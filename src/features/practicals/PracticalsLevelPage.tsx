import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { LEVELS } from './practicalsCatalog';
import { canonicalPathFor } from '../../utils/siteUrl';
import { polytechnicPracticalPath } from '../../utils/practicalSeo';
import { PracticalsDesktopSidebar } from './common/PracticalsDesktopSidebar';

/** Browse a level or subject without changing its existing public routes. */
export const PracticalsLevelPage: React.FC<{ levelId?: string; subjectId?: string }> = ({
  levelId, subjectId: subjectProp,
}) => {
  const params = useParams();
  const level = LEVELS.find((item) => item.id === (levelId ?? params.levelId)) ?? LEVELS[0];
  const subjectId = subjectProp ?? params.subjectId;
  const [search, setSearch] = useState('');
  const categories = useMemo(() => subjectId
    ? level.categories.filter((category) => category.route.replace(/\/$/, '').endsWith(`/${subjectId}`))
    : level.categories, [level, subjectId]);
  const single = categories.length === 1 ? categories[0] : null;
  const isTechnology = level.id === 'polytechnic' && single?.id === 'poly-it';
  const heroImage = isTechnology ? '/images/prac/it-learning-banner.webp' : single?.image;
  const noun = level.itemNoun ?? 'experiment';
  const total = categories.reduce((count, category) => count + category.experiments.length, 0);
  const query = search.trim().toLowerCase();
  const filtered = categories.map((category) => ({
    ...category,
    experiments: category.experiments.filter((experiment) =>
      `${category.title} ${experiment.title} ${experiment.blurb}`.toLowerCase().includes(query)),
  }));
  const visibleCount = filtered.reduce((count, category) => count + category.experiments.length, 0);

  return (
    <div className="min-h-screen w-full bg-[#f8fafd] text-slate-900 dark:bg-[#111827] dark:text-slate-100">
      <PracticalsDesktopSidebar activeLevelId={level.id} />
      <main className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:pl-[292px] lg:pr-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to={canonicalPathFor(level.route)} className="inline-flex items-center gap-2 rounded-md py-1 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 dark:hover:text-blue-300">
              <ArrowLeft size={16} aria-hidden="true" /> {level.label} practicals
            </Link>
            <span aria-hidden="true" className="text-slate-400">/</span>
            <span aria-current="page" className="font-medium text-slate-800 dark:text-slate-100">{single?.title ?? 'All practicals'}</span>
          </nav>

          <header className="practical-hero relative mb-8 isolate overflow-hidden rounded-3xl border-2 border-blue-700 border-b-[6px] bg-blue-700 px-6 py-8 sm:px-9 sm:py-10">
            {heroImage && <img src={heroImage} alt="" aria-hidden="true" fetchPriority="high" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-[right_58%] sm:left-auto sm:w-[72%]" />}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#1639a8_0%,rgba(22,57,168,0.97)_25%,rgba(22,57,168,0.78)_50%,rgba(22,57,168,0.12)_100%)]" />
            <div className="relative max-w-xl sm:max-w-[66%]">
              <p className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] !text-blue-100"><Sparkles size={16} aria-hidden="true" />{level.label} practicals</p>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight !text-white sm:text-4xl">{single?.title ?? 'Learn by doing'}</h1>
              <p className="mt-3 max-w-md text-sm font-medium leading-6 !text-blue-100 sm:text-base">{single?.blurb ?? `Build your skills with hands-on activities from the ${level.label} catalogue.`}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-xl border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold !text-white">{total} {noun}{total === 1 ? '' : 's'}</span>
                <span className="rounded-xl border border-lime-200/40 bg-lime-300 px-3 py-1.5 text-xs font-extrabold !text-lime-950">Build real skills</span>
              </div>
            </div>
          </header>

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Available {noun}s</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300" aria-live="polite">{query ? `${visibleCount} matching ${visibleCount === 1 ? noun : `${noun}s`}` : 'Choose an activity to open your workspace.'}</p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search practicals</span>
              <Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-3 text-slate-500 dark:text-slate-400" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search practicals" className="h-11 w-full rounded-full border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900" />
            </label>
          </div>

          <div className="space-y-8">
            {filtered.filter((category) => !query || category.experiments.length > 0).map((category) => (
              <section key={category.id} aria-label={category.title}>
                {!single && <h3 className="mb-4 text-base font-semibold text-slate-800 dark:text-slate-100">{category.title}</h3>}
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-5">
                  {category.experiments.map((experiment) => (
                    <li key={experiment.route + experiment.title} className="min-w-0">
                      <Link to={canonicalPathFor(level.id === 'polytechnic'
                        ? polytechnicPracticalPath(category.route, experiment.route, experiment.title)
                        : experiment.route)} className="group flex h-full flex-col rounded-3xl border-2 border-b-[5px] border-slate-200 bg-white p-5 text-left transition-[border-color,transform,background-color] hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/40 active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 sm:p-6 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-500 dark:hover:bg-slate-800">
                        <div className="flex flex-1 items-start gap-4">
                          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 p-2 text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300">
                            {experiment.image ? <img src={experiment.image} alt="" loading="lazy" className="h-full w-full object-contain" /> : <experiment.Icon size={28} aria-hidden="true" />}
                          </span>
                          <div className="min-w-0 py-0.5">
                            <h3 className="text-base font-extrabold leading-6 text-slate-900 sm:text-lg dark:text-white">{experiment.title}</h3>
                            <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{experiment.blurb}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{category.title}</span>
                          <span className="inline-flex items-center gap-2 rounded-xl border-b-[3px] border-blue-800 bg-blue-600 px-4 py-2 text-xs font-extrabold uppercase tracking-wide !text-white group-hover:bg-blue-700">Start <span className="sr-only">{experiment.title}</span><ArrowRight size={16} aria-hidden="true" /></span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {category.experiments.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">Activities for this subject are being prepared.</p>}
              </section>
            ))}
            {query && visibleCount === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900"><p className="font-medium text-slate-900 dark:text-white">No practicals found</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try another name, such as C++, database, or Linux.</p><button type="button" onClick={() => setSearch('')} className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800">Clear search</button></div>}
          </div>
        </div>
      </main>
    </div>
  );
};
