import pastPaperData from '../data/pastPapers.json';
import questionPaperData from '../data/questionPapers.json';

export type PastPaperRecord = {
  id: string;
  level: string;
  sublevel: string;
  subject: string;
  year: string;
  type: string;
  fileId: string;
  course: string;
  url: string;
  name: string;
  /** Which board set it. ZIMSEC unless the record says otherwise. */
  board?: string;
  /** True only when a human has recorded a publication basis for this file. */
  rightsVerified: boolean;
  rightsHolder?: string;
  rightsBasis?: string;
  sourceUrl?: string;
  /** Runtime catalogue entries use their stable file ID in the detail URL. */
  detailPath?: string;
};

type RawPastPaperRecord = Omit<
  PastPaperRecord,
  'id' | 'course' | 'url' | 'name' | 'rightsVerified' | 'rightsHolder' | 'rightsBasis' | 'sourceUrl'
> & {
  /** Set only after documenting the owner and permission/publication basis. */
  rightsVerified?: boolean;
  rightsHolder?: string;
  rightsBasis?: string;
  sourceUrl?: string;
};

export const SITE_URL = 'https://www.examsidemann.com';

export const slugifyPastPaperValue = (value: string) => value
  .toLowerCase()
  .replace(/&/g, ' and ')
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const normalizePastPaperCourse = (record: RawPastPaperRecord) => {
  if (record.level !== 'Polytechnic') {
    if (record.sublevel === "O'Level") return "O' Level";
    if (record.sublevel === "A'Level") return "A' Level";
    return record.sublevel;
  }

  const value = record.sublevel.toLowerCase();
  const qualification = value.includes('nd') ? 'ND' : 'NC';
  if (value.includes('information technology')) return `${qualification} Information Technology`;
  if (value.includes('purchasing')) return `${qualification} Purchasing & Supply`;
  if (value.includes('records')) return qualification === 'ND' ? 'ND Records & Information Management' : 'NC Records Management';
  if (value.includes('auto')) return 'NC Auto Electrics';
  if (value.includes('banking')) return 'NC Banking and Finance';
  return record.sublevel;
};

const isFutureExamSeries = (record: RawPastPaperRecord) => {
  const match = record.year.match(/\b(20\d{2})\b/);
  if (!match) return false;
  const seriesYear = Number(match[1]);
  const currentYear = new Date().getFullYear();
  if (seriesYear > currentYear) return true;
  if (seriesYear < currentYear) return false;

  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];
  const seriesMonth = monthNames.findIndex((month) => record.year.toLowerCase().includes(month));
  return seriesMonth >= 0 && seriesMonth > new Date().getMonth();
};

const isValidDriveFileId = (fileId: string) => /^[A-Za-z0-9_-]{10,}$/.test(fileId);

export const STATIC_PAST_PAPERS: PastPaperRecord[] = (pastPaperData as RawPastPaperRecord[])
  .filter((record) => (
    record.fileId !== 'PASTE_GOOGLE_DRIVE_FILE_ID_HERE' &&
    isValidDriveFileId(record.fileId) &&
    !isFutureExamSeries(record)
  ))
  .map((record, index) => {
    const course = normalizePastPaperCourse(record);
    return {
      ...record,
      id: `paper-${index}-${record.fileId}`,
      course,
      url: `https://drive.google.com/file/d/${record.fileId}/view`,
      name: [record.subject, record.year, record.type].filter(Boolean).join(' · '),
      // Missing metadata stays missing. Access does not imply that Exam
      // Sidemann owns the document or has completed a rights review.
      rightsVerified: record.rightsVerified === true,
      rightsHolder: record.rightsHolder?.trim() || undefined,
      rightsBasis: record.rightsBasis?.trim() || undefined,
      sourceUrl: record.sourceUrl?.trim() || undefined,
    };
  });

export const getPastPaperCoursePath = (course: string) => (
  `/past-papers/${slugifyPastPaperValue(course)}/`
);

export const getPastPaperSubjectPath = (course: string, subject: string) => (
  `${getPastPaperCoursePath(course)}${slugifyPastPaperValue(subject)}/`
);

export const getPastPaperPath = (paper: PastPaperRecord) => (
  paper.detailPath || `${getPastPaperSubjectPath(paper.course, paper.subject)}${slugifyPastPaperValue(`${paper.year}-${paper.type}`)}/`
);

/** Count the build-time papers represented by an exact subject-hub URL. */
export const getPastPaperSubjectCountForPath = (pathname: string) => {
  const normalizedPath = `/${pathname.split(/[?#]/, 1)[0].split('/').filter(Boolean).join('/')}/`;
  const parts = normalizedPath.split('/').filter(Boolean);
  if (parts[0] !== 'past-papers' || parts.length !== 3) return 0;

  return STATIC_PAST_PAPERS.filter(
    (paper) => getPastPaperSubjectPath(paper.course, paper.subject) === normalizedPath,
  ).length;
};

export const isSingletonPastPaperSubjectPath = (pathname: string) => (
  getPastPaperSubjectCountForPath(pathname) === 1
);

export const getPastPaperBoard = (paper: Pick<PastPaperRecord, 'level'> & { board?: string }) => (
  paper.board ? paper.board : (
  paper.level === 'Polytechnic' ? 'HEXCO' : 'ZIMSEC')
);

/**
 * The qpandbooks catalogue papers in the same shape as the other Drive-hosted
 * records so a single lookup covers both. The detail view resolves these
 * legacy catalogue paths to their current Drive links before displaying them.
 */
export const BUNDLED_PAST_PAPERS: PastPaperRecord[] = (questionPaperData.papers as Array<{
  id: string;
  board: string;
  course: string;
  subject: string;
  year: string;
  type: string;
  name: string;
  url: string;
}>).map((paper) => ({
  id: paper.id,
  level: paper.course,
  sublevel: '',
  subject: paper.subject,
  year: paper.year,
  type: paper.type,
  fileId: '',
  course: paper.course,
  url: paper.url,
  name: paper.name,
  board: paper.board,
  rightsVerified: false,
}));

/** Everything the archive can open, wherever the file happens to live. */
export const ALL_PAST_PAPERS: PastPaperRecord[] = [...STATIC_PAST_PAPERS, ...BUNDLED_PAST_PAPERS];

export const findPastPaperCourse = (courseSlug?: string) => {
  if (!courseSlug) return undefined;
  return ALL_PAST_PAPERS.find((paper) => slugifyPastPaperValue(paper.course) === courseSlug)?.course;
};

export const findPastPaperSubject = (courseSlug?: string, subjectSlug?: string) => {
  const course = findPastPaperCourse(courseSlug);
  if (!course || !subjectSlug) return undefined;
  return ALL_PAST_PAPERS.find((paper) => (
    paper.course === course && slugifyPastPaperValue(paper.subject) === subjectSlug
  ))?.subject;
};

export const findPastPaper = (courseSlug?: string, subjectSlug?: string, paperSlug?: string) => {
  const course = findPastPaperCourse(courseSlug);
  const subject = findPastPaperSubject(courseSlug, subjectSlug);
  if (!course || !subject || !paperSlug) return undefined;
  return ALL_PAST_PAPERS.find((paper) => (
    paper.course === course
    && paper.subject === subject
    && slugifyPastPaperValue(`${paper.year}-${paper.type}`) === paperSlug
  ));
};
