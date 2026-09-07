import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Cpu,
  GraduationCap,
  Layers,
} from 'lucide-react';

type Props = {
  onNavigate: (page: string, params?: any) => void;
};

const paths = [
  { id: 'ZJC', label: 'ZJC', detail: 'Forms 1–2', icon: BookOpen },
  { id: "O' Level", label: 'O Level', detail: 'Forms 3–4', icon: Layers },
  { id: "A' Level", label: 'A Level', detail: 'Lower & Upper 6', icon: GraduationCap },
  { id: 'Polytechnic', label: 'Polytechnic', detail: 'NC & ND', icon: Cpu },
];

export const CompactLevelQuickNav: React.FC<Props> = ({ onNavigate }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateRail = () => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 4);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4);
  };

  useEffect(() => {
    updateRail();
    window.addEventListener('resize', updateRail);
    return () => window.removeEventListener('resize', updateRail);
  }, []);

  const move = (direction: number) => railRef.current?.scrollBy({
    left: direction * Math.min(420, railRef.current.clientWidth * 0.8),
    behavior: 'smooth',
  });

  return (
    <div className="sticky top-16 z-40 border-b border-slate-200 bg-white/90 px-3 py-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-[#09090c]/90 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        {canScrollLeft && (
          <button onClick={() => move(-1)} aria-label="Scroll levels left" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:flex">
            <ChevronLeft size={17} />
          </button>
        )}
        <div ref={railRef} onScroll={updateRail} className="flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none]">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <button
                key={path.id}
                onClick={() => onNavigate('courses/overview', { category: path.id })}
                className="flex min-w-[150px] flex-1 snap-start items-center gap-3 rounded-[15px] border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-violet-600 shadow-sm dark:bg-white/5 dark:text-violet-300"><Icon size={15} /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-black text-slate-800 dark:text-white">{path.label}</span>
                  <span className="block truncate text-[9px] font-bold text-slate-400">{path.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
        {canScrollRight && (
          <button onClick={() => move(1)} aria-label="Scroll levels right" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border border-slate-200 bg-white text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:flex">
            <ChevronRight size={17} />
          </button>
        )}
      </div>
    </div>
  );
};
