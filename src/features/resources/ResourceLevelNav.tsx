import React, { useEffect, useRef } from 'react';
import { Baby, BookOpen, Building2, GraduationCap, School, type LucideIcon } from 'lucide-react';
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

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Primary: Baby,
  ZJC: BookOpen,
  "O' Level": School,
  "A' Level": GraduationCap,
  Polytechnic: Building2,
};

export const ResourceCategoryBar: React.FC<{
  categories?: { id: string; label: string }[];
  active: string;
  onSelect: (category: string) => void;
}> = ({ categories = RESOURCE_CATEGORIES, active, onSelect }) => (
  <nav
    className="fixed inset-x-0 bottom-0 z-40 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/95 lg:hidden"
    aria-label="Academic level"
  >
    {categories.map((category) => {
      const isActive = active === category.id;
      const Icon = CATEGORY_ICONS[category.id] || BookOpen;
      return (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          aria-current={isActive}
          className="group relative flex flex-1 flex-col items-center gap-0.5 pb-2 pt-2.5 transition-transform active:scale-95"
        >
          <span
            className={`absolute inset-x-5 top-0 h-0.5 rounded-b-full transition-colors ${isActive ? 'bg-[#ea580c] dark:bg-[#fdba74]' : 'bg-transparent'}`}
          />
          <span
            className={`flex h-7 w-11 items-center justify-center rounded-full transition-colors ${
              isActive
                ? 'bg-orange-100 text-[#ea580c] dark:bg-orange-400/15 dark:text-[#fdba74]'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
          </span>
          <span
            className={`text-[10px] font-black uppercase tracking-wider ${
              isActive ? 'text-[#ea580c] dark:text-[#fdba74]' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {category.label}
          </span>
        </button>
      );
    })}
  </nav>
);

export const ResourceLevelChips: React.FC<{
  courses: AcademicNavCourse[];
  active: string;
  onSelect: (courseName: string) => void;
}> = ({ courses, active, onSelect }) => {
  const railRef = useRef<HTMLDivElement>(null);

  // A long level list scrolls sideways; keep the chosen level in view so it
  // is never the one clipped off the edge.
  useEffect(() => {
    const chip = railRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    const rail = railRef.current;
    if (!chip || !rail) return;
    rail.scrollTo({ left: chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
  }, [active, courses]);

  return (
    <div ref={railRef} className="flex w-full gap-2 overflow-x-auto px-0.5 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
      {courses.map((course) => {
        const isActive = active === course.name;
        return (
          <button
            key={course.name}
            onClick={() => onSelect(course.name)}
            aria-current={isActive}
            className={`min-w-fit shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[12px] font-black transition-colors active:scale-95 ${
              isActive
                ? 'border-[#ea580c] bg-[#ea580c] text-white shadow-sm shadow-orange-500/30 dark:border-[#fdba74] dark:bg-[#fdba74] dark:text-slate-900'
                : 'border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'
            }`}
          >
            {course.displayName || course.name}
          </button>
        );
      })}
    </div>
  );
};
