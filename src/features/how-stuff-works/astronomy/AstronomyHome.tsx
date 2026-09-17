import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Play, Telescope } from 'lucide-react';

interface TopicItem {
  id: string;
  title: string;
  emoji: string;
  route: string;
  available: boolean;
  colorBg: string;
  borderColor: string;
}

const TOPICS: TopicItem[] = [
  {
    id: 'gravity',
    title: 'How Gravity Works',
    emoji: '☀️',
    route: '/how-stuff-works/astronomy/gravity',
    available: true,
    colorBg: 'bg-amber-100 dark:bg-amber-950/40',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
  },
  {
    id: 'orbits',
    title: 'How Orbits Work',
    emoji: '🪐',
    route: '/how-stuff-works/astronomy/orbits',
    available: true,
    colorBg: 'bg-sky-100 dark:bg-sky-950/40',
    borderColor: 'border-sky-200 dark:border-sky-800/50',
  },
  {
    id: 'orbits-2',
    title: 'Earth & Satellites',
    emoji: '🛰️',
    route: '/how-stuff-works/astronomy/orbits-2',
    available: true,
    colorBg: 'bg-cyan-100 dark:bg-cyan-950/40',
    borderColor: 'border-cyan-200 dark:border-cyan-800/50',
  },
  {
    id: 'light-travels',
    title: 'How Light Travels',
    emoji: '✨',
    route: '/how-stuff-works/astronomy/light-travels',
    available: true,
    colorBg: 'bg-indigo-100 dark:bg-indigo-950/40',
    borderColor: 'border-indigo-200 dark:border-indigo-800/50',
  },
  {
    id: 'gravity-on-planets',
    title: 'Gravity on Planets',
    emoji: '🌍',
    route: '/how-stuff-works/astronomy/gravity-on-planets',
    available: true,
    colorBg: 'bg-emerald-100 dark:bg-emerald-950/40',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
  },
  {
    id: 'black-holes',
    title: 'Black Holes',
    emoji: '🕳️',
    route: '/how-stuff-works/astronomy/black-holes',
    available: false,
    colorBg: 'bg-purple-100 dark:bg-purple-950/40',
    borderColor: 'border-purple-200 dark:border-purple-800/50',
  },
  {
    id: 'rockets',
    title: 'How Rockets Work',
    emoji: '🚀',
    route: '/how-stuff-works/astronomy/rockets',
    available: false,
    colorBg: 'bg-orange-100 dark:bg-orange-950/40',
    borderColor: 'border-orange-200 dark:border-orange-800/50',
  },
];

export const AstronomyHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors pb-24">
      {/* ─── Top Bar: Minimal Duolingo Header ─── */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b-2 border-slate-200 dark:border-zinc-800">
        <div className="w-full px-4 md:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate('/how-stuff-works')}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 active:translate-y-0.5 active:border-b-2 transition-all cursor-pointer shadow-sm"
            aria-label="Back to How It Works"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#1cb0f6] text-white shadow-sm">
              <Telescope size={14} />
            </span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Space &amp; Astronomy
            </h1>
          </div>

          <div className="w-10 sm:w-11" />
        </div>
      </header>

      {/* ─── Topics Grid (Duolingo Minimalist Design) ─── */}
      <main className="w-full px-4 md:px-6 lg:px-8 pt-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              onClick={() => topic.available && navigate(topic.route)}
              className={`relative rounded-3xl border-2 border-b-[5px] p-5 flex flex-col items-center justify-between text-center transition-all select-none ${
                topic.available
                  ? 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 cursor-pointer shadow-sm active:translate-y-1 active:border-b-2'
                  : 'bg-slate-100/70 dark:bg-zinc-900/40 border-slate-200/80 dark:border-zinc-800/80 opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Topic Emoji Tile */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3.5 border-2 shadow-inner ${topic.colorBg} ${topic.borderColor}`}
              >
                {topic.emoji}
              </div>

              {/* Minimalist Title (No paragraphs) */}
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-5">
                {topic.title}
              </h2>

              {/* Duolingo 3D Button */}
              <div className="w-full mt-auto">
                {topic.available ? (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="w-full py-2.5 rounded-2xl bg-[#58cc02] border-2 border-[#58cc02] border-b-4 border-b-[#46a302] hover:bg-[#61e002] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all pointer-events-none"
                  >
                    <Play size={13} fill="currentColor" />
                    <span>START</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled
                    className="w-full py-2.5 rounded-2xl bg-slate-200 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-800 border-b-4 border-b-slate-300 dark:border-b-zinc-700 text-slate-400 dark:text-zinc-500 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 pointer-events-none"
                  >
                    <Lock size={12} />
                    <span>LOCKED</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AstronomyHome;
