import { StudyHero, StudyCard } from './StudySearchResults';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { CoursePage } from './CoursePage';
import { DynamicModuleViewer } from './DynamicModuleViewer';
import {
  findLearningCourse,
  findLearningOutcomeRoute,
  findLearningSubjectRoute,
  getOutcomeLabel,
  getLearningOutcomePath,
} from '../../utils/learningOutcomeSeo';

type LearningRouteProps = {
  onLoginRequest: () => void;
};

export const LearningCourseRoute: React.FC<LearningRouteProps> = ({
  onLoginRequest,
}) => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const course = findLearningCourse(courseId);

  if (!course) return <Navigate to="/courses/" replace />;

  return (
    <CoursePage
      courseName={course.name}
      onNavigateHome={() => navigate('/')}
      onLoginRequest={onLoginRequest}
    />
  );
};

export const LearningSubjectRoute: React.FC = () => {
  const { courseId, subjectSlug } = useParams<{
    courseId: string;
    subjectSlug: string;
  }>();
  const route = findLearningSubjectRoute(courseId, subjectSlug);

  if (!route) return <Navigate to="/courses/" replace />;

  return (
    <section className="min-h-screen bg-slate-50 pb-20 text-slate-950 dark:bg-[#070914] dark:text-white">
      <StudyHero title={route.subject.name} subtitle="Choose Topic You Want To Study">
        <Link to={`${route.coursePath}/`} className="inline-flex items-center gap-2 font-bold"><ArrowLeft size={17} /> {route.course.name}</Link>
      </StudyHero>
      <div className="px-5 py-10 sm:px-10 lg:px-[100px]">
        <ol className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: route.subject.outcomeCount }, (_, index) => index + 1).map(outcomeNumber => (
            <li key={outcomeNumber}>
              <StudyCard title={getOutcomeLabel(route.course, route.subject, outcomeNumber)} label={`Learning outcome ${outcomeNumber}`} footer="Study topic" action="Start studying" to={`${getLearningOutcomePath(route.course, route.subject, outcomeNumber)}/`} index={outcomeNumber - 1} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export const LearningOutcomePage: React.FC<LearningRouteProps> = ({
  onLoginRequest,
}) => {
  const location = useLocation();
  const params = useParams<{
    courseId: string;
    subjectSlug: string;
    outcomeNumber: string;
  }>();
  const navigate = useNavigate();
  const route = findLearningOutcomeRoute(
    params.courseId,
    params.subjectSlug,
    params.outcomeNumber,
  );

  if (!route) return <Navigate to="/courses/" replace />;

  if (location.pathname.replace(/\/$/, '') !== route.outcomePath) {
    return <Navigate to={`${route.outcomePath}/${location.search}${location.hash}`} replace />;
  }

  return (
    <DynamicModuleViewer
      key={route.outcomePath}
      level={route.course.name}
      subject={route.subject.name}
      initialOutcome={route.outcomeNumber}
      onOutcomeChange={(nextOutcome) =>
        navigate(`${getLearningOutcomePath(route.course, route.subject, nextOutcome)}/`)
      }
      onBack={() => navigate(`${route.coursePath}/`)}
      onLoginRequest={onLoginRequest}
    />
  );
};
