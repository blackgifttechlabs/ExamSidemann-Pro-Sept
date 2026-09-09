import { CURRICULUM_REGISTRY, type AcademicLevel, type SubjectMeta } from '../data/constants';
import {
  hasCourseSubjectContent,
  isCourseOutcomeIndexable,
  isCourseSubjectIndexable,
} from '../features/courses/courseContentAvailability';
import learningOutcomeTitles from '../data/learningOutcomeTitles.json';

export const slugifyLearningPath = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export type LearningSubjectRoute = {
  course: AcademicLevel;
  subject: SubjectMeta;
  coursePath: string;
  subjectPath: string;
};

export type LearningOutcomeRoute = LearningSubjectRoute & {
  outcomeNumber: number;
  outcomeLabel: string;
  outcomePath: string;
};

export const getAvailableSubjects = (course: AcademicLevel) =>
  course.subjects.filter((subject) =>
    hasCourseSubjectContent(course.name, subject.name, course.category),
  );

export const getIndexableSubjects = (course: AcademicLevel) =>
  getAvailableSubjects(course).filter((subject) =>
    isCourseSubjectIndexable(course.name, subject.name, course.category),
  );

export const findLearningCourse = (courseId?: string) =>
  CURRICULUM_REGISTRY.find((course) => course.id === courseId);

export const findLearningSubjectRoute = (
  courseId?: string,
  subjectSlug?: string,
): LearningSubjectRoute | null => {
  const course = findLearningCourse(courseId);
  if (!course || !subjectSlug) return null;

  // Availability controls whether the learner can open a route. Indexability
  // is handled separately by RouteSeo and the static SEO generator.
  const subject = getAvailableSubjects(course).find(
    (candidate) => slugifyLearningPath(candidate.name) === subjectSlug,
  );
  if (!subject) return null;

  const coursePath = `/courses/${course.id}`;
  return {
    course,
    subject,
    coursePath,
    subjectPath: `${coursePath}/${subjectSlug}`,
  };
};

const sourceTitles = learningOutcomeTitles as Record<string, string>;
const SOURCE_SUBJECT_ALIASES: Record<string, string> = {
  'nc-it|computer-systems-maintenance': 'nc-it|csm',
  'nc-auto|safety-health-env-and-fitting-machining': 'nc-auto|safety-health-env',
  'nc-auto|electrical-and-electronics-fundamentals': 'nc-auto|electrical-electronics-fundamentals',
  'nc-auto|automotive-comm-and-computer-apps': 'nc-auto|automotive-comm-computer-apps',
  'nc-auto|wiring-lighting-and-auxiliary-systems': 'nc-auto|wiring-lighting-auxiliary-systems',
  'nc-auto|automotive-eng-maths-and-science': 'nc-auto|automotive-eng-maths-science',
  'nc-auto|ignition-starting-and-charging-syst': 'nc-auto|ignition-starting-charging-syst',
  'records-nc|digital-and-conv-mail-management': 'records-nc|digital-conv-mail-management',
};
const SHARED_SUBJECT_SOURCES: Record<string, string> = {
  'nc-auto|national-studies': 'nc-it|national-studies',
  'nc-auto|entrepreneurship-skills-development': 'nc-it|entrepreneurship-skills-development',
  'banking-nc|national-studies': 'nc-it|national-studies',
};

export const getOutcomeLabel = (
  course: AcademicLevel,
  subject: SubjectMeta,
  outcomeNumber: number,
) => {
  if (subject.outcomes?.[outcomeNumber - 1]) {
    return subject.outcomes[outcomeNumber - 1];
  }

  if (subject.name === 'English Language') {
    return [
      'Grammar & Structure',
      'Vocabulary Mastery',
      'Reading & Literature',
      'Basic Composition',
      'Advanced Composition',
      'Comprehension & Summary',
      'Oral Communication',
      'Functional Writing',
      'Exam & Study Skills',
      'Language in Use',
    ][outcomeNumber - 1] || `Learning Outcome ${outcomeNumber}`;
  }

  if (subject.name === 'Shona') {
    return [
      'Rondedzero neTsamba',
      'Tsumo',
      'Madimikira',
      'Zvirevo',
      'Kufananidza neKushasa',
      'Zvidavado',
      'Madimikira eRuremekedzo',
      'Madimikira eKuwedzeredza',
      'Mipanda yeMazita',
      'Zvisazitasingwi',
    ][outcomeNumber - 1] || `Learning Outcome ${outcomeNumber}`;
  }

  if (subject.name === 'Database Administration' && outcomeNumber === 6) {
    return 'Practice SQL';
  }
  if (subject.name === 'Object Oriented Programming' && outcomeNumber === 8) {
    return 'Practical C#';
  }
  if (subject.name === 'Workplace Communication' && outcomeNumber === 3) {
    return 'English Grammar';
  }

  const routeKey = `${course.id}|${slugifyLearningPath(subject.name)}`;
  const sourceKey =
    SOURCE_SUBJECT_ALIASES[routeKey] ||
    SHARED_SUBJECT_SOURCES[routeKey] ||
    routeKey;

  return (
    sourceTitles[`${sourceKey}|${outcomeNumber}`] ||
    `Learning Outcome ${outcomeNumber}`
  );
};

/** Every outcome label in a subject, in outcome order. */
export const getOutcomeLabels = (course: AcademicLevel, subject: SubjectMeta) =>
  Array.from({ length: subject.outcomeCount }, (_, index) =>
    getOutcomeLabel(course, subject, index + 1),
  );

export const getLearningOutcomePath = (course: AcademicLevel, subject: SubjectMeta, number: number) =>
  `/courses/${course.id}/${slugifyLearningPath(subject.name)}/outcomes/${number}-${slugifyLearningPath(getOutcomeLabel(course, subject, number).replace(/^Learning Outcome \d+$/, `${subject.name} Study Notes`))}`;

export const findLearningOutcomeRoute = (
  courseId?: string,
  subjectSlug?: string,
  outcomeValue?: string,
): LearningOutcomeRoute | null => {
  const subjectRoute = findLearningSubjectRoute(courseId, subjectSlug);
  if (!subjectRoute || !outcomeValue || !/^\d+(?:-[a-z0-9-]+)?$/.test(outcomeValue)) return null;

  const outcomeNumber = Number(outcomeValue.split('-')[0]);
  if (
    !Number.isSafeInteger(outcomeNumber) ||
    outcomeNumber < 1 ||
    outcomeNumber > subjectRoute.subject.outcomeCount
  ) {
    return null;
  }

  return {
    ...subjectRoute,
    outcomeNumber,
    outcomeLabel: getOutcomeLabel(
      subjectRoute.course,
      subjectRoute.subject,
      outcomeNumber,
    ),
    outcomePath: getLearningOutcomePath(subjectRoute.course, subjectRoute.subject, outcomeNumber),
  };
};

export const isLearningSubjectRouteIndexable = (route: LearningSubjectRoute) =>
  isCourseSubjectIndexable(
    route.course.name,
    route.subject.name,
    route.course.category,
  );

export const isLearningOutcomeRouteIndexable = (route: LearningOutcomeRoute) =>
  isCourseOutcomeIndexable(
    route.course.name,
    route.subject.name,
    route.outcomeNumber,
    route.course.category,
  );
