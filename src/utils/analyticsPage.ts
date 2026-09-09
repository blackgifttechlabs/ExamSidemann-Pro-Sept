import pages from '../data/seoPages.json';
import { findLearningCourse, findLearningOutcomeRoute, findLearningSubjectRoute } from './learningOutcomeSeo';

/** Resolve stored activity paths independently of stale browser titles. */
export const analyticsPage = (rawPath: string, savedTitle = '') => {
  const safePath = rawPath?.startsWith('/') && !rawPath.startsWith('//') && !rawPath.includes('\\') ? rawPath : '/';
  const path = safePath.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'courses') {
    const outcome = parts[3] === 'outcomes' ? findLearningOutcomeRoute(parts[1], parts[2], parts[4]) : null;
    if (outcome) return { href: `${outcome.outcomePath}/`, title: `${outcome.outcomeLabel} — ${outcome.subject.name} · ${outcome.course.name}` };
    const subject = findLearningSubjectRoute(parts[1], parts[2]);
    if (subject) return { href: safePath, title: `${subject.subject.name} — ${subject.course.name}` };
    const course = findLearningCourse(parts[1]);
    if (course) return { href: safePath, title: `${course.name} — Subjects and Learning Resources` };
  }
  const page = pages.find((candidate) => candidate.path === path);
  const fallback = parts.map((part) => part.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())).join(' — ');
  return { href: safePath, title: path === '/' ? 'Home — Exam Sidemann' : page?.heading || fallback || savedTitle || 'Unknown page' };
};
