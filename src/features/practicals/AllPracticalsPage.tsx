import React from 'react';
import { ArrowLeft, ChevronRight, Layers3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LEVELS, REVEAL_STYLES } from './practicalsCatalog';
import { PracticalsDesktopSidebar } from './common/PracticalsDesktopSidebar';
import { canonicalPathFor } from '../../utils/siteUrl';

const ALL_LEVELS = [...LEVELS].sort((a, b) => {
  const order: Record<string, number> = { polytechnic: 0, olevel: 1, alevel: 2 };
  return (order[a.id] ?? 99) - (order[b.id] ?? 99);
});

const MOBILE_LEVELS = ['olevel', 'alevel', 'polytechnic']
  .map((id) => LEVELS.find((level) => level.id === id))
  .filter((level): level is (typeof LEVELS)[number] => Boolean(level));

const MOBILE_LEVEL_IMAGES: Record<string, string> = {
  olevel: '/images/prac/combinedscie.png',
  alevel: '/images/prac/physicss.png',
  polytechnic: '/images/prac/IT.png',
};

const MOBILE_LEVEL_STYLES: Record<string, string> = {
  olevel: 'border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/10',
  alevel: 'border-sky-200 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-500/10',
  polytechnic: 'border-fuchsia-200 bg-fuchsia-50 dark:border-fuchsia-400/20 dark:bg-fuchsia-500/10',
};

export const AllPracticalsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_80%_6%,#ede9fe_0%,#f8fafc_38%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_80%_6%,#2b0b50_0%,#130522_38%,#09020f_74%)] dark:text-white">
      <style>{REVEAL_STYLES}</style>
      <PracticalsDesktopSidebar activeLevelId="all" />

      <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-[#160728]/95 lg:hidden">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/')} aria-label="Back to home" className="flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-black dark:text-white">
            <ArrowLeft size={24} strokeWidth={2.4} />
          </button>
          <h1 className="text-xl font-black">All Practicals</h1>
        </div>
      </header>

      <main className="practicals-page-grow w-full px-4 py-4 sm:px-6 lg:py-7 lg:pl-[292px] lg:pr-8">
        <section className="relative mb-5 flex aspect-[19/9] items-center overflow-hidden rounded-[5px] border border-violet-300/20 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 px-5 text-white shadow-[0_16px_36px_rgba(8,0,28,.24)] lg:hidden">
          <img src="/images/prac/all-practicals-hero.png" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-right" onError={(event) => { event.currentTarget.style.display = 'none'; }} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(53,16,93,.98)_0%,rgba(85,21,132,.88)_48%,rgba(85,21,132,.18)_78%,transparent_100%)]" />
          <div className="relative z-10 max-w-[58%]">
            <p className="text-[9px] font-black uppercase tracking-[.18em] text-cyan-200">Complete catalogue</p>
            <h2 className="mt-1 text-2xl font-black leading-tight">Learn by doing.</h2>
          </div>
        </section>

        <section className="lg:hidden">
          <h2 className="mb-3 text-lg font-black">Choose your level</h2>
          <div className="grid grid-cols-2 gap-3">
            {MOBILE_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => navigate(canonicalPathFor(level.route))}
                className={`group flex min-w-0 flex-col overflow-hidden rounded-[5px] border text-left shadow-[0_10px_24px_rgba(76,29,149,.1)] transition active:scale-[.98] ${level.id === 'polytechnic' ? 'col-span-2 aspect-[2/1]' : 'aspect-square'} ${MOBILE_LEVEL_STYLES[level.id]}`}
              >
                <div className="h-[66%] w-full shrink-0 overflow-hidden bg-white/55 dark:bg-black/10">
                  <img src={MOBILE_LEVEL_IMAGES[level.id]} alt="" aria-hidden="true" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <span className="flex min-h-0 flex-1 items-center justify-between gap-2 border-t border-black/5 px-3 text-base font-black dark:border-white/10">
                  <span className="truncate">{level.label}</span>
                  <ChevronRight size={17} className="shrink-0 opacity-55" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="relative mb-7 hidden aspect-[190/63] overflow-hidden rounded-[5px] border border-violet-300/20 bg-[radial-gradient(circle_at_82%_18%,rgba(34,211,238,.3),transparent_24%),linear-gradient(120deg,#35105d,#551584_48%,#17245c)] px-9 py-8 text-white shadow-[0_24px_60px_rgba(8,0,28,.3)] lg:flex lg:items-center">
          <img
            src="/images/prac/all-practicals-hero.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-right"
            onError={(event) => { event.currentTarget.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#35105d_0%,rgba(85,21,132,.94)_46%,rgba(85,21,132,.35)_68%,transparent_100%)]" />
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="relative z-10">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-cyan-200"><Layers3 size={16} /> Complete catalogue</p>
            <h1 className="mt-2 text-4xl font-black">All Practicals</h1>
            <p className="mt-2 text-sm text-white/65">Choose a level, subject or workshop and start learning.</p>
          </div>
        </section>

        <div className="hidden space-y-9 lg:block">
          {ALL_LEVELS.map((level) => (
            <section key={level.id}>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600 dark:text-fuchsia-300">Study level</p>
                  <h2 className="mt-1 text-2xl font-black sm:text-3xl">{level.label}</h2>
                </div>
                <button type="button" onClick={() => navigate(canonicalPathFor(level.route))} className="flex shrink-0 items-center gap-1 text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  Open level <ChevronRight size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
                {level.categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => navigate(canonicalPathFor(category.route))}
                    className={`group flex aspect-square min-w-0 flex-col overflow-hidden rounded-[5px] border border-slate-200 bg-white text-left shadow-[0_12px_30px_rgba(76,29,149,.1)] transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.055] dark:shadow-[0_12px_30px_rgba(0,0,0,.24)] lg:h-[238px] lg:aspect-auto ${category.ring}`}
                  >
                    <div className={`flex h-[52%] w-full shrink-0 items-center justify-center overflow-hidden lg:h-[138px] ${category.tile}`}>
                      {category.image ? (
                        <img src={category.image} alt="" loading="lazy" className={`h-full w-full transition-transform duration-300 group-hover:scale-105 ${category.imageFit === 'cover' ? 'object-cover' : 'object-contain p-1'}`} />
                      ) : (
                        <category.Icon size={50} className={category.iconColor} />
                      )}
                    </div>
                    <div className="flex min-h-0 flex-1 flex-col justify-between border-t border-slate-200 p-2.5 dark:border-white/10 sm:p-3 lg:p-4">
                      <h3 className="w-full shrink-0 truncate whitespace-nowrap text-sm font-black text-slate-900 dark:text-white sm:text-base lg:text-lg" title={category.title}>{category.title}</h3>
                      <span className="mx-auto mt-1 flex w-full max-w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] bg-gradient-to-r from-fuchsia-800 via-purple-700 to-violet-600 px-2 py-1 text-white lg:px-3 lg:py-1.5">
                        <span className="text-lg font-black leading-none lg:text-2xl">{category.experiments.length}</span>
                        <span className="truncate text-[8px] font-black uppercase tracking-wide sm:text-[10px] lg:text-xs">{category.itemNoun ?? level.itemNoun ?? 'experiment'}{category.experiments.length === 1 ? '' : 's'}</span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AllPracticalsPage;
