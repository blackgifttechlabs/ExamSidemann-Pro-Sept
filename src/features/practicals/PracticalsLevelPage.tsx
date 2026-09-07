import React, { useMemo, useRef } from 'react';
import { ArrowLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { LEVELS, REVEAL_STYLES, useScrollReveal } from './practicalsCatalog';
import { canonicalPathFor } from '../../utils/siteUrl';
import { polytechnicPracticalPath } from '../../utils/practicalSeo';
import {
  HeroEdgeLight,
  HeroGlow,
  HeroGridPaper,
  HeroLabMotif,
} from './common/PracticalsHeroChrome';
import { PracticalsDesktopSidebar } from './common/PracticalsDesktopSidebar';

/**
 * The "See All" destination: every experiment for a level, or for one subject
 * within it. It carries its own header, so the app header is hidden on all
 * /practicals routes.
 */
export const PracticalsLevelPage: React.FC<{
  levelId?: string;
  subjectId?: string;
}> = ({ levelId, subjectId: subjectProp }) => {
  const navigate = useNavigate();
  const params = useParams();
  const resolvedLevelId = levelId ?? params.levelId ?? LEVELS[0].id;
  const level = LEVELS.find((item) => item.id === resolvedLevelId) ?? LEVELS[0];

  const subjectId = subjectProp ?? params.subjectId;
  const categories = useMemo(
    () =>
      subjectId
        ? level.categories.filter((category) => category.route.endsWith(`/${subjectId}`))
        : level.categories,
    [level, subjectId]
  );

  const single = categories.length === 1 ? categories[0] : null;
  const SingleIcon = single?.Icon;
  const total = categories.reduce(
    (count, category) => count + category.experiments.length,
    0
  );

  const noun = level.itemNoun ?? 'experiment';

  const contentRef = useRef<HTMLDivElement>(null);
  useScrollReveal(contentRef, [level.id, subjectId]);

  const goBack = () => {
    const index = (window.history.state as { idx?: number } | null)?.idx;
    if (typeof index === 'number' && index > 0) {
      navigate(-1);
      return;
    }
    navigate(level.route);
  };

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_80%_8%,#ede9fe_0%,#f8fafc_38%,#eef2ff_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_80%_8%,#2b0b50_0%,#130522_36%,#09020f_74%)] dark:text-white">
      <style>{REVEAL_STYLES}</style>
      <PracticalsDesktopSidebar activeLevelId={level.id} />

      {/* Hero. Same bench as the Practical Labs header — squared paper, a light
          from the corner and a lit bottom edge — over this subject's accent. */}
      <div className={`practicals-header-in relative overflow-hidden rounded-b-[28px] bg-gradient-to-br text-white shadow-lg lg:hidden ${
          // On a single subject's page the hero takes that subject's accent, so
          // the header matches the card you clicked to get here.
          single?.hero ?? 'from-violet-700 via-purple-700 to-indigo-800 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-950'
        }`}>
        <HeroGridPaper />
        <HeroGlow />
        {/* The subject illustration already fills the corner; the line art only
            stands in when there is no picture to carry it. */}
        {!single?.image && <HeroLabMotif />}
        <HeroEdgeLight />
        <div className="relative mx-auto max-w-[1600px] px-4 pb-7 pt-6 sm:px-6 sm:pt-8 lg:px-10">
          <div className="flex items-start gap-3">
            <button
              onClick={goBack}
              className="mt-1 rounded-xl p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
              aria-label="Back to Practical Labs"
            >
              <ArrowLeft size={22} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {level.label} Practicals
              </p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                {single ? single.title : 'All Experiments'}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
                {single ? single.blurb : `Every ${noun} in the ${level.label} catalogue.`}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {total} {noun}{total === 1 ? '' : 's'}
                </span>
                {!single && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {categories.length} subjects
                  </span>
                )}
                <button
                  onClick={() => navigate('/practicals/')}
                  className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold transition-colors hover:bg-white/25"
                >
                  <Search size={13} />
                  Search labs
                </button>
              </div>
            </div>

            {single?.image && (
              <img
                src={single.image}
                alt=""
                aria-hidden="true"
                className={`hidden h-56 w-80 shrink-0 object-contain opacity-[0.85] mix-blend-screen lg:block xl:h-64 xl:w-96 ${
                  single.imageZoom ?? ''
                }`}
                style={{
                  // The artwork ships on a white plate: screen blending drops the
                  // plate into the gradient and the radial mask feathers every
                  // edge, so no rectangle is left behind.
                  WebkitMaskImage:
                    'radial-gradient(ellipse 50% 50% at 50% 50%, #000 30%, rgba(0,0,0,0.5) 62%, transparent 88%)',
                  maskImage:
                    'radial-gradient(ellipse 50% 50% at 50% 50%, #000 30%, rgba(0,0,0,0.5) 62%, transparent 88%)',
                }}
              />
            )}
          </div>

          {/* Jump links when the page holds several subjects */}
          {!single && (
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => jumpTo(category.id)}
                  className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                >
                  {category.title}
                  <span className="ml-1.5 text-white/50">
                    {category.experiments.length}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        ref={contentRef}
        className="practicals-page-grow w-full px-4 py-6 sm:px-6 lg:pl-[292px] lg:pr-8"
      >
        <section className="relative mb-7 hidden min-h-[210px] overflow-hidden rounded-[26px] border border-violet-300/20 bg-[radial-gradient(circle_at_82%_20%,rgba(34,211,238,.3),transparent_25%),linear-gradient(120deg,#35105d,#551584_48%,#17245c)] px-9 py-8 shadow-[0_24px_60px_rgba(8,0,28,.38),inset_0_1px_0_rgba(255,255,255,.12)] lg:flex lg:items-center">
          <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:34px_34px] [mask-image:linear-gradient(to_right,black,transparent_82%)]" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[.2em] text-cyan-200">{level.label} practicals</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">{single ? single.title : 'Choose an experiment'}</h1>
            <p className="mt-3 line-clamp-1 max-w-2xl text-sm text-white/65">{single ? single.blurb : `Explore every hands-on activity in the ${level.label} catalogue.`}</p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75">{total} {noun}{total === 1 ? '' : 's'}</span>
              {!single && <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75">{categories.length} subjects</span>}
            </div>
          </div>
          {SingleIcon && <SingleIcon className="absolute right-[8%] h-32 w-32 text-cyan-200/30" />}
        </section>

        <div
          className={`min-w-0 flex-1 ${
            single
              ? 'space-y-6'
              : 'space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0'
          }`}
        >
          {categories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className={`scroll-mt-6 rounded-[10px] p-4 lg:p-6 ${category.band}`}
            >
              <div
                data-reveal="out"
                className="flex items-center justify-between border-b border-black/5 pb-3 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${category.tile}`}>
                    <category.Icon className={category.iconColor} size={18} />
                  </span>
                  <h2 className="text-base font-bold sm:text-lg">{category.title}</h2>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                  {category.experiments.length} {category.itemNoun ?? noun}
                  {category.experiments.length === 1 ? '' : 's'}
                </span>
              </div>

              {category.experiments.length === 0 ? (
                <p
                  data-reveal="out"
                  className="mt-3 rounded-[10px] border border-dashed border-slate-200 bg-white/60 p-4 text-sm text-slate-500 dark:border-[#222] dark:bg-[#141414] dark:text-gray-500"
                >
                  {(category.itemNoun ?? noun) === 'practical' ? 'Practicals' : 'Experiments'} for{' '}
                  {category.title} are being built.
                </p>
              ) : (
                <ul
                  className={`mt-3 divide-y divide-slate-100 overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm dark:divide-[#222] dark:border-[#222] dark:bg-[#161616] lg:divide-y-0 lg:overflow-visible lg:border-0 lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${
                    single
                      ? 'lg:grid lg:grid-cols-2 lg:gap-3'
                      : 'lg:space-y-3'
                  }`}
                >
                  {category.experiments.map((experiment, index) => (
                    <li
                      key={experiment.route + experiment.title}
                      data-reveal="out"
                      style={{ transitionDelay: `${Math.min(index, 6) * 45}ms` }}
                    >
                      <button
                        onClick={() => navigate(canonicalPathFor(
                          level.id === 'polytechnic'
                            ? polytechnicPracticalPath(category.route, experiment.route, experiment.title)
                            : experiment.route
                        ))}
                        className="group flex h-full w-full items-center gap-3 rounded-[16px] p-3 text-left transition-all hover:bg-white/[0.08] sm:p-4 lg:gap-4 lg:border lg:border-violet-300/15 lg:bg-white/[0.055] lg:p-4 lg:shadow-[0_10px_30px_rgba(0,0,0,.18)] lg:hover:-translate-y-0.5 lg:hover:border-fuchsia-400/35 lg:hover:shadow-[0_16px_36px_rgba(0,0,0,.3)]"
                      >
                        <span className="hidden w-8 shrink-0 text-sm font-bold tabular-nums text-slate-300 dark:text-gray-600 lg:block">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[12px] lg:h-16 lg:w-16 ${experiment.image ? '' : category.tile}`}
                        >
                          {experiment.image ? (
                            <img
                              src={experiment.image}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <>
                              <experiment.Icon
                                className={`${category.iconColor} lg:hidden`}
                                size={20}
                              />
                              <experiment.Icon
                                className={`${category.iconColor} hidden lg:block`}
                                size={36}
                              />
                            </>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 block text-sm font-bold lg:text-lg lg:leading-snug">
                            {experiment.title}
                          </span>
                          <span className="mt-1 block truncate text-xs text-white/45">
                            {experiment.blurb}
                          </span>
                        </span>
                        <span className="hidden shrink-0 text-sm font-semibold text-violet-600 dark:text-violet-400 lg:block">
                          Open
                        </span>
                        <ChevronRight
                          size={18}
                          className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 dark:text-gray-600 dark:group-hover:text-gray-300"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
