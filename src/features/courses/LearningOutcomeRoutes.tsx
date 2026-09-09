import React from 'react';
import { ArrowLeft, ArrowRight, GraduationCap } from 'lucide-react';
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
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-5 py-12 text-slate-950 dark:bg-[#070914] dark:text-white md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to={`${route.coursePath}/`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-violet-700 hover:text-violet-900 dark:text-violet-300 dark:hover:text-white"
        >
          <ArrowLeft size={17} /> {route.course.name}
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl dark:border-white/10 dark:bg-white/[0.055] md:p-10">
          <div className="flex items-center gap-3 text-violet-700 dark:text-violet-300">
            <GraduationCap />
            <p className="text-xs font-black uppercase tracking-[0.25em]">
              {route.course.category} · {route.course.name}
            </p>
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            {route.subject.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-slate-600 dark:text-slate-300">
            {route.subject.description}
          </p>
        </div>

        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {Array.from(
            { length: route.subject.outcomeCount },
            (_, index) => index + 1,
          ).map((outcomeNumber) => (
            <li key={outcomeNumber}>
              <Link
                to={`${getLearningOutcomePath(route.course, route.subject, outcomeNumber)}/`}
                className="group flex h-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.055] dark:hover:border-violet-400/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-800 dark:bg-violet-500/20 dark:text-violet-200">
                  {outcomeNumber}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Learning outcome {outcomeNumber}
                  </span>
                  <span className="mt-1 block font-black">
                    {getOutcomeLabel(
                      route.course,
                      route.subject,
                      outcomeNumber,
                    )}
                  </span>
                </span>
                <ArrowRight
                  size={18}
                  className="shrink-0 text-violet-600 transition group-hover:translate-x-1 dark:text-violet-300"
                />
              </Link>
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
