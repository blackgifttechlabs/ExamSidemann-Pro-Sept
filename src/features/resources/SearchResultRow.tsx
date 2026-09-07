import React from 'react';
import {
  BookOpen,
  Building2,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';

interface SearchResultRowProps {
  title: string;
  levelName?: string;
  levelCategory?: string;
  resultType?: string;
  onSelect: () => void;
  className?: string;
}

const levelStyles: Record<string, { icon: string; badge: string; surface: string }> = {
  ZJC: {
    icon: 'text-emerald-700 dark:text-emerald-300',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300',
    surface: 'bg-emerald-100 dark:bg-emerald-500/15',
  },
  "O' Level": {
    icon: 'text-orange-700 dark:text-orange-300',
    badge: 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-300',
    surface: 'bg-orange-100 dark:bg-orange-500/15',
  },
  "A' Level": {
    icon: 'text-blue-700 dark:text-blue-300',
    badge: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300',
    surface: 'bg-blue-100 dark:bg-blue-500/15',
  },
  Polytechnic: {
    icon: 'text-violet-700 dark:text-violet-300',
    badge: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/25 dark:bg-violet-500/10 dark:text-violet-300',
    surface: 'bg-violet-100 dark:bg-violet-500/15',
  },
};

export const SearchResultRow: React.FC<SearchResultRowProps> = ({
  title,
  levelName,
  levelCategory,
  resultType,
  onSelect,
  className = '',
}) => {
  const isLevel = resultType?.toLowerCase().includes('level') ?? false;
  const styles = levelStyles[levelCategory ?? ''] ?? {
    icon: 'text-slate-700 dark:text-slate-300',
    badge: 'border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
    surface: 'bg-slate-100 dark:bg-white/10',
  };
  const Icon = isLevel
    ? GraduationCap
    : levelCategory === 'Polytechnic'
      ? Building2
      : BookOpen;
  const distinctLevel = levelName && levelName !== title ? levelName : undefined;
  const primaryMeta = distinctLevel ?? levelCategory ?? 'Course';
  const secondaryMeta = distinctLevel
    ? levelCategory
    : isLevel
      ? 'Course level'
      : resultType;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20 dark:hover:bg-white/[0.07] ${className}`}
      aria-label={`Open ${title}${levelName ? ` for ${levelName}` : ''}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.surface}`}
      >
        <Icon size={18} className={styles.icon} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold leading-5 text-slate-900 dark:text-white">
          {title}
        </span>
        <span className="mt-1 flex min-w-0 items-center gap-2">
          <span
            className={`max-w-[70%] truncate rounded-md border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${styles.badge}`}
          >
            {primaryMeta}
          </span>
          {secondaryMeta && secondaryMeta !== primaryMeta && (
            <span className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {secondaryMeta}
            </span>
          )}
        </span>
      </span>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 dark:text-slate-600 dark:group-hover:text-slate-300"
        aria-hidden="true"
      />
    </button>
  );
};
