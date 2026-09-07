import React from 'react';
import { ChevronRight, Gamepad2, Grid2X2, Home, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LEVELS } from '../practicalsCatalog';
import { canonicalPathFor } from '../../../utils/siteUrl';
import { useThemeMode } from '../polytechnic/technical-drawing/useThemeMode';

export interface PracticalsDesktopSidebarProps {
  activeLevelId: string;
  onSelectLevel?: (id: string) => void;
  onOpen?: (route: string) => void;
}

/** Shared desktop navigation for every Practical Labs catalogue/course screen. */
export const PracticalsDesktopSidebar: React.FC<PracticalsDesktopSidebarProps> = ({
  activeLevelId,
  onSelectLevel,
  onOpen,
}) => {
  const navigate = useNavigate();
  const [theme, toggleTheme] = useThemeMode();
  const allPracticalsActive = activeLevelId === 'all';
  const level = LEVELS.find((item) => item.id === activeLevelId) ?? LEVELS[0];
  const open = onOpen ?? ((route: string) => navigate(canonicalPathFor(route)));

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[260px] flex-col overflow-hidden border-r border-violet-200 bg-[linear-gradient(180deg,#ffffff_0%,#f5f3ff_52%,#ede9fe_100%)] text-slate-900 shadow-[18px_0_60px_rgba(76,29,149,.12)] dark:border-violet-400/20 dark:bg-[linear-gradient(180deg,#251044_0%,#160728_52%,#0d041a_100%)] dark:text-white dark:shadow-[18px_0_60px_rgba(5,0,18,.38),inset_-1px_0_0_rgba(255,255,255,.08)] lg:flex">
      <nav className="space-y-1 px-3 py-4" aria-label="Practical navigation">
        <button onClick={() => navigate('/')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-600 transition hover:bg-violet-100 hover:text-slate-950 dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">
          <Home size={18} /> Home
        </button>
        <button onClick={() => navigate('/practicals/all')} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${allPracticalsActive ? 'bg-violet-100 text-violet-800 dark:bg-white/10 dark:text-white' : 'text-slate-600 hover:bg-violet-100 hover:text-slate-950 dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white'}`}>
          <Grid2X2 size={18} /> All Practicals
        </button>
        <p className="px-3 pb-1 pt-4 text-[10px] font-black uppercase tracking-[.18em] text-slate-400 dark:text-white/35">Study level</p>
        {LEVELS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectLevel ? onSelectLevel(item.id) : open(item.route)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-extrabold transition ${
              !allPracticalsActive && item.id === level.id
                ? 'bg-gradient-to-r from-fuchsia-600 to-violet-700 text-white shadow-[0_5px_0_#4c1d95]'
                : 'text-slate-600 hover:bg-violet-100 hover:text-slate-950 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            <span className="flex items-center gap-3"><Gamepad2 size={18} /> {item.label}</span>
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] dark:bg-black/25">{item.categories.length}</span>
          </button>
        ))}
      </nav>

      {!allPracticalsActive && <div className="min-h-0 flex-1 overflow-y-auto border-t border-violet-200 px-3 py-4 dark:border-white/10">
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-[.18em] text-slate-400 dark:text-white/35">Subjects</p>
        {level.categories.map((category) => (
          <button key={category.id} onClick={() => open(category.route)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-600 transition hover:bg-violet-100 hover:text-slate-950 dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white">
            <category.Icon size={17} className="text-violet-600 transition group-hover:text-fuchsia-600 dark:text-violet-300 dark:group-hover:text-fuchsia-300" />
            <span className="min-w-0 flex-1 truncate">{category.title}</span>
            <ChevronRight size={14} className="opacity-30 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </button>
        ))}
      </div>}
      {allPracticalsActive && <div className="min-h-0 flex-1 border-t border-violet-200 dark:border-white/10" />}

      <button
        type="button"
        onClick={toggleTheme}
        className="m-3 flex items-center justify-between rounded-2xl border border-violet-200 bg-white/70 p-4 text-left shadow-sm transition hover:border-violet-400 hover:bg-white dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10 dark:hover:border-fuchsia-300/40 dark:hover:bg-fuchsia-500/15"
        aria-label={theme === 'dark' ? 'Switch Practical Hub to light theme' : 'Switch Practical Hub to dark theme'}
      >
        <span>
          <span className="block text-xs font-black uppercase tracking-wider text-violet-700 dark:text-fuchsia-200">Appearance</span>
          <span className="mt-1 block text-xs text-slate-500 dark:text-white/55">{theme === 'dark' ? 'Dark theme' : 'Light theme'}</span>
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700 dark:bg-white/10 dark:text-amber-200">
          {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
        </span>
      </button>
    </aside>
  );
};

export default PracticalsDesktopSidebar;
