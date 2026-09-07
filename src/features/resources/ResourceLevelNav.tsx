import React from 'react';
import { AcademicNavCourse } from './AcademicLibrarySidebar';

/**
 * The phone-sized navigation for the resource shelves.
 *
 * On a phone the app header is out of the way and the sidebar never opens, so
 * these two pieces are how a learner moves: a bar of academic categories along
 * the bottom, and the levels inside the chosen category as a strip of chips
 * under the search bar.
 */

export const RESOURCE_CATEGORIES = [
  { id: 'Primary', label: 'Primary' },
  { id: 'ZJC', label: 'ZJC' },
  { id: "O' Level", label: 'O Level' },
  { id: "A' Level", label: 'A Level' },
  { id: 'Polytechnic', label: 'Poly' },
];

/** The category a level belongs to, for lists that predate the field. */
export const categoryOf = (course: AcademicNavCourse) => course.category || (
  ['Form 1', 'Form 2'].includes(course.name) ? 'ZJC'
    : ['Form 3', 'Form 4'].includes(course.name) ? "O' Level"
      : course.name.includes('6') ? "A' Level" : 'Polytechnic'
);

/** The levels inside one category, in registry order. */
export const coursesInCategory = (courses: AcademicNavCourse[], category: string) =>
  courses.filter((course) => categoryOf(course) === category);

export const ResourceCategoryBar: React.FC<{
  categories?: { id: string; label: string }[];
  active: string;
  onSelect: (category: string) => void;
}> = ({ categories = RESOURCE_CATEGORIES, active, onSelect }) => (
  <nav
    className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/95 lg:hidden"
    aria-label="Academic level"
  >
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onSelect(category.id)}
        aria-current={active === category.id}
        className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider transition-colors ${
          active === category.id
            ? 'text-[#ea580c] dark:text-[#fdba74]'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        {category.label}
      </button>
    ))}
  </nav>
);

export const ResourceLevelChips: React.FC<{
  courses: AcademicNavCourse[];
  active: string;
  onSelect: (courseName: string) => void;
}> = ({ courses, active, onSelect }) => (
  /* One line, shared out evenly like a row of tabs. A level list long enough
     to squash the labels keeps its minimum width and scrolls instead. */
  <div className="flex w-full gap-2 overflow-x-auto [scrollbar-width:none] lg:hidden">
    {courses.map((course) => (
      <button
        key={course.name}
        onClick={() => onSelect(course.name)}
        className={`min-w-fit flex-1 whitespace-nowrap px-2 py-1.5 text-center text-[12px] font-black ${
          active === course.name
            ? 'text-[#ea580c] dark:text-[#fdba74]'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        {course.displayName || course.name}
      </button>
    ))}
  </div>
);
