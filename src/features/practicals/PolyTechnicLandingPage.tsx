import React from 'react';
import { ArrowLeft, ChevronRight, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PracticalsDesktopSidebar } from './common/PracticalsDesktopSidebar';
import { LEVELS, REVEAL_STYLES } from './practicalsCatalog';
import { canonicalPathFor } from '../../utils/siteUrl';

const CARD_STYLES = [
  'from-fuchsia-600 via-purple-600 to-violet-700 shadow-purple-950/25',
  'from-violet-700 via-indigo-700 to-blue-700 shadow-indigo-950/25',
  'from-emerald-600 via-teal-600 to-cyan-700 shadow-emerald-950/25',
  'from-orange-500 via-rose-600 to-pink-700 shadow-rose-950/25',
  'from-sky-600 via-blue-700 to-indigo-800 shadow-blue-950/25',
];

export interface PolyTechnicLandingPageProps {
  levelId?: 'olevel' | 'alevel' | 'polytechnic';
}

/** Subject-first practical browser shared by O Level, A Level and Polytechnic. */
export const PolyTechnicLandingPage: React.FC<PolyTechnicLandingPageProps> = ({
  levelId = 'polytechnic',
}) => {
  const navigate = useNavigate();
  const level = LEVELS.find((item) => item.id === levelId) ?? LEVELS[0];
  const categoryLabel = level.categoriesLabel ?? 'Subjects';
  const categoryNoun = categoryLabel === 'Courses' ? 'course' : 'subject';

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#0b0612] dark:text-white">
      <style>{REVEAL_STYLES}</style>
      <PracticalsDesktopSidebar activeLevelId={level.id} />

      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-[#160728] lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/practicals/all')}
            aria-label="Back to all practicals"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-800 transition hover:bg-slate-100 active:scale-95 dark:text-white dark:hover:bg-white/10"
          >
            <ArrowLeft size={23} />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-600 dark:text-fuchsia-300">Practical experiments</p>
            <h1 className="text-xl font-black leading-tight">{level.label}</h1>
          </div>
        </div>
      </header>

      <main className="practicals-page-grow w-full px-3 py-4 sm:px-7 sm:py-8 lg:pl-[292px] lg:pr-9 lg:pt-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 hidden text-left lg:block">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 lg:mx-0">
              <FlaskConical size={24} />
            </div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-violet-600 dark:text-fuchsia-300">{level.label} practicals</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Choose a {categoryNoun}</h1>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {level.categories.map((category, index) => {
              const Icon = category.Icon;
              const noun = category.itemNoun ?? level.itemNoun ?? 'experiment';
              const count = category.experiments.length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => navigate(canonicalPathFor(category.route))}
                  className={`group relative min-h-[220px] overflow-hidden rounded-[12px] bg-gradient-to-br p-0 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 sm:min-h-[310px] ${CARD_STYLES[index % CARD_STYLES.length]}`}
                >
                  <span className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
                  <span className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-black/10" />

                  <span className="relative flex h-[112px] items-end justify-center px-2 pt-3 sm:h-[205px] sm:px-6 sm:pt-4">
                    <span className="absolute bottom-0 h-20 w-[76%] rounded-t-full bg-white/90 shadow-[0_-12px_35px_rgba(255,255,255,.16)] sm:h-40 sm:w-[72%]" />
                    {category.image ? (
                      <img
                        src={category.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className={`relative z-10 h-[100px] w-[92%] rounded-xl transition-transform duration-300 group-hover:scale-105 sm:h-[185px] sm:w-[88%] sm:rounded-[20px] ${category.imageFit === 'cover' ? 'object-cover' : 'object-contain'} ${category.imageZoom ?? ''}`}
                      />
                    ) : (
                      <Icon className="relative z-10 mb-5 h-14 w-14 text-violet-700 sm:mb-10 sm:h-24 sm:w-24" />
                    )}
                  </span>

                  <span className="relative block px-2.5 pb-3 pt-3 text-center sm:px-6 sm:pb-5 sm:pt-5">
                    <span className="line-clamp-2 block text-sm font-black leading-tight sm:text-xl">{category.title}</span>

                    <span className="mt-3 flex h-8 items-center justify-center sm:mt-4 sm:h-10">
                      {category.experiments.slice(0, 5).map((experiment, experimentIndex) => {
                        const ExperimentIcon = experiment.Icon;
                        return (
                          <span
                            key={experiment.route + experiment.title}
                            title={experiment.title}
                            className={`grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white bg-violet-100 text-violet-700 shadow-md sm:h-10 sm:w-10 ${experimentIndex === 0 ? '' : '-ml-2 sm:-ml-2.5'}`}
                          >
                            {experiment.image ? (
                              <img src={experiment.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <ExperimentIcon size={14} className="sm:hidden" />
                            )}
                            {!experiment.image && <ExperimentIcon size={18} className="hidden sm:block" />}
                          </span>
                        );
                      })}
                      {count > 5 && (
                        <span className="-ml-2 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-white bg-slate-900 text-[9px] font-black text-white shadow-md sm:-ml-2.5 sm:h-10 sm:w-10 sm:text-xs">
                          +{count - 5}
                        </span>
                      )}
                    </span>

                    <span className="mt-3 flex items-center justify-between border-t border-white/25 pt-3 sm:mt-4 sm:pt-4">
                      <span className="text-[10px] font-black uppercase tracking-wide sm:text-sm sm:tracking-[.14em]">
                        {count} {noun}{count === 1 ? '' : 's'}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                        <span className="hidden sm:inline">View list</span> <ChevronRight size={17} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PolyTechnicLandingPage;
