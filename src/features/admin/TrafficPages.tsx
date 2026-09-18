import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDownUp,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Info,
  RefreshCw,
  Search,
  Users,
} from 'lucide-react';
import type { PageStats } from '../../services/analytics';
import {
  dayKey,
} from '../../services/analytics';
import type { DailyStats } from '../../services/analytics';
import {
  fetchDailyStats,
  fetchPageStats,
  rangeForPreset,
  totalsFor,
  type DateRange,
  type RangePreset,
} from '../../services/analyticsQueries';

type TrafficSort = 'views' | 'visitors' | 'time' | 'name';
type PageFilter = 'all' | 'practicals' | 'past-papers' | 'iq-trainer' | 'course-notes';

const PAGE_SIZE = 15;

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

const formatDuration = (milliseconds: number) => {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) return '0s';
  const seconds = Math.round(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}m ${remainder}s`;
};

const pageTypeForPath = (path: string): Exclude<PageFilter, 'all'> | 'other' => {
  const value = path.toLocaleLowerCase();
  if (value.includes('/practicals')) return 'practicals';
  if (value.includes('/past-papers')) return 'past-papers';
  if (value.includes('/iq-trainer')) return 'iq-trainer';
  if (value.includes('/courses') || value.includes('/tutorials')) return 'course-notes';
  return 'other';
};

const categoryForPath = (path: string) => {
  const value = path.toLocaleLowerCase();
  const pageType = pageTypeForPath(path);
  if (pageType === 'practicals') return { label: 'Practical', classes: 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300' };
  if (pageType === 'past-papers') return { label: 'Past Paper', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' };
  if (pageType === 'iq-trainer') return { label: 'IQ Trainer', classes: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300' };
  if (pageType === 'course-notes') return { label: 'Course Notes', classes: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' };
  if (value === '/' || value.includes('/home')) return { label: 'Home', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' };
  if (value.includes('school')) return { label: 'Schools', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' };
  if (value.includes('news')) return { label: 'News', classes: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300' };
  if (value.includes('dashboard')) return { label: 'Dashboard', classes: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300' };
  return { label: 'General', classes: 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300' };
};

const presetLabels: Record<RangePreset, string> = {
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
  all: 'All time',
  custom: 'Custom range',
};

export const TrafficPages: React.FC<{ onOpenDetails?: (page: PageStats) => void }> = ({ onOpenDetails }) => {
  const [preset, setPreset] = useState<RangePreset>('30d');
  const [customRange, setCustomRange] = useState<DateRange>(rangeForPreset('30d'));
  const [rows, setRows] = useState<PageStats[]>([]);
  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<TrafficSort>('views');
  const [pageFilter, setPageFilter] = useState<PageFilter>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(
    () => preset === 'custom' ? customRange : rangeForPreset(preset),
    [customRange, preset],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [report, dailyStats] = await Promise.all([
        fetchPageStats(range, preset === 'all'),
        fetchDailyStats(range).catch(() => []),
      ]);
      setRows(report.rows);
      setTruncated(report.truncated);
      setDaily(dailyStats);
    } catch (loadError) {
      console.error('page traffic load failed', loadError);
      setError('Could not load page traffic. Check the connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [preset, range]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, pageFilter, preset, customRange]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    const result = rows.filter(row => {
      const matchesSearch = !term || `${row.title} ${row.path}`.toLocaleLowerCase().includes(term);
      const matchesPageType = pageFilter === 'all' || pageTypeForPath(row.path) === pageFilter;
      return matchesSearch && matchesPageType;
    });
    return [...result].sort((a, b) => {
      if (sort === 'name') return (a.title || a.path).localeCompare(b.title || b.path);
      if (sort === 'visitors') return b.visitors - a.visitors;
      if (sort === 'time') return (b.views ? b.timeMs / b.views : 0) - (a.views ? a.timeMs / a.views : 0);
      return b.views - a.views;
    });
  }, [rows, search, sort, pageFilter]);

  const dailyTotals = useMemo(() => totalsFor(daily), [daily]);

  const totals = useMemo(() => ({
    views: rows.reduce((sum, row) => sum + row.views, 0),
    visitors: rows.reduce((sum, row) => sum + row.visitors, 0),
    timeMs: rows.reduce((sum, row) => sum + row.timeMs, 0),
  }), [rows]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const maxViews = Math.max(1, ...rows.map(row => row.views));
  const startRow = filteredRows.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const endRow = Math.min(safePage * PAGE_SIZE, filteredRows.length);

  return (
    <div className="animate-dropdown-reveal text-left">
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-0.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <BarChart3 size={13} /> Analytics
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Pages by traffic</h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">See which pages attract attention and keep visitors engaged.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200">
            <CalendarDays size={14} className="text-gray-400" />
            <select
              value={preset}
              onChange={event => setPreset(event.target.value as RangePreset)}
              className="cursor-pointer border-0 bg-transparent font-medium text-gray-900 outline-none dark:text-white"
              aria-label="Traffic date range"
            >
              {(Object.keys(presetLabels) as RangePreset[]).map(value => (
                <option key={value} value={value} className="dark:bg-[#161616]">{presetLabels[value]}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300 dark:hover:bg-neutral-800"
            aria-label="Refresh page traffic"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {preset === 'custom' && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-md border border-gray-200 bg-white p-2.5 dark:border-neutral-800 dark:bg-neutral-900">
          <span className="text-xs font-medium text-gray-500">From</span>
          <input type="date" value={customRange.start} max={customRange.end} onChange={event => setCustomRange(current => ({ ...current, start: event.target.value }))} className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200" />
          <span className="text-xs font-medium text-gray-500">to</span>
          <input type="date" value={customRange.end} min={customRange.start} max={dayKey()} onChange={event => setCustomRange(current => ({ ...current, end: event.target.value }))} className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200" />
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Tracked pages', value: compact.format(rows.length), icon: BarChart3 },
          { label: 'Page views', value: compact.format(dailyTotals.views || totals.views), icon: Eye },
          { label: 'Visitors', value: compact.format(dailyTotals.visitors || totals.visitors), icon: Users },
          { label: 'Avg. time', value: formatDuration(dailyTotals.avgSessionMs || (totals.views ? totals.timeMs / totals.views : 0)), icon: Clock3 },
        ].map(metric => (
          <div key={metric.label} className="rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm dark:border-neutral-800 dark:bg-[#0f0f0f]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">{metric.label}</span>
              <metric.icon size={15} className="text-gray-400" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">{loading ? '—' : metric.value}</p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-[#0f0f0f]">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex shrink-0 items-center gap-2">
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">Traffic records</h3>
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-neutral-800 dark:text-gray-300">{filteredRows.length} results</span>
          </div>
          <div className="grid w-full gap-2 sm:grid-cols-3 xl:w-auto">
            <div className="relative sm:min-w-[200px]">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search pages" className="h-8 w-full rounded-md border border-gray-200 bg-gray-50 pl-8 pr-2.5 text-xs text-gray-700 outline-none transition-colors focus:border-gray-400 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-200" />
            </div>
            <label className="flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300">
              <Filter size={13} />
              <select value={pageFilter} onChange={event => setPageFilter(event.target.value as PageFilter)} className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent font-medium text-gray-800 outline-none dark:text-gray-100" aria-label="Filter by page type">
                <option value="all" className="dark:bg-[#161616]">All pages</option>
                <option value="practicals" className="dark:bg-[#161616]">Practicals</option>
                <option value="past-papers" className="dark:bg-[#161616]">Past Papers</option>
                <option value="iq-trainer" className="dark:bg-[#161616]">IQ Trainer</option>
                <option value="course-notes" className="dark:bg-[#161616]">Course Notes</option>
              </select>
            </label>
            <label className="flex h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-300">
              <ArrowDownUp size={13} />
              <select value={sort} onChange={event => setSort(event.target.value as TrafficSort)} className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent font-medium text-gray-800 outline-none dark:text-gray-100" aria-label="Sort traffic table">
                <option value="views" className="dark:bg-[#161616]">Most views</option>
                <option value="visitors" className="dark:bg-[#161616]">Most visitors</option>
                <option value="time" className="dark:bg-[#161616]">Longest time</option>
                <option value="name" className="dark:bg-[#161616]">Page name</option>
              </select>
            </label>
          </div>
        </div>

        {truncated && <p className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-[11px] font-semibold text-amber-700 dark:border-amber-500/10 dark:bg-amber-500/10 dark:text-amber-300">This date range contains more records than can be loaded at once. Choose a shorter range for exact totals.</p>}
        {error && <div className="m-4 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div>}

        <div className="overflow-x-auto">
          {loading ? (
            <table className="w-full min-w-[1080px] text-left text-xs" aria-label="Loading page traffic" aria-busy="true">
              <thead className="border-b border-gray-200 bg-slate-50 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500 dark:border-white/10 dark:bg-white/[0.035] dark:text-gray-400">
                <tr><th className="w-14 border-r border-gray-200/70 px-4 py-4 text-center dark:border-white/5">#</th><th className="border-r border-gray-200/70 px-4 py-4 dark:border-white/5">Page</th><th className="border-r border-gray-200/70 px-4 py-4 dark:border-white/5">Page type</th><th className="border-r border-gray-200/70 px-4 py-4 dark:border-white/5">Page views</th><th className="border-r border-gray-200/70 px-4 py-4 text-right dark:border-white/5">Visitors</th><th className="border-r border-gray-200/70 px-4 py-4 text-right dark:border-white/5">Avg. time</th><th className="border-r border-gray-200/70 px-4 py-4 text-right dark:border-white/5">Traffic share</th><th className="px-4 py-4 text-right">More info</th></tr>
              </thead>
              <tbody className="animate-pulse divide-y divide-gray-100 dark:divide-white/5">
                {Array.from({ length: 10 }, (_, index) => (
                  <tr key={index} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#161616] dark:even:bg-white/[0.025]">
                    <td className="border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><span className="mx-auto block h-3 w-4 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                    <td className="border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><span className="mb-2 block h-3 w-48 rounded-full bg-gray-200 dark:bg-white/10" /><span className="block h-2.5 w-32 rounded-full bg-gray-200/80 dark:bg-white/[0.07]" /></td>
                    <td className="border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><span className="block h-6 w-20 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                    <td className="w-56 border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><div className="flex items-center justify-between gap-3"><span className="block h-3 w-8 rounded-full bg-gray-200 dark:bg-white/10" /><span className="block h-1.5 w-28 rounded-full bg-gray-200 dark:bg-white/10" /></div></td>
                    <td className="border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><span className="ml-auto block h-3 w-8 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                    <td className="border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><span className="ml-auto block h-3 w-12 rounded-full bg-gray-200 dark:bg-white/10" /></td>
                    <td className="border-r border-gray-200/80 px-4 py-3 dark:border-white/[0.07]"><span className="ml-auto block h-6 w-12 rounded-lg bg-gray-200 dark:bg-white/10" /></td><td className="px-4 py-3"><span className="ml-auto block h-8 w-24 rounded-lg bg-gray-200 dark:bg-white/10" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : visibleRows.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-2 text-center"><BarChart3 size={28} className="text-gray-300" /><p className="text-sm font-bold text-gray-600 dark:text-gray-300">No pages found</p><p className="text-xs text-gray-400">Try another date range or search.</p></div>
          ) : (
            <table className="w-full min-w-[900px] text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50/60 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-gray-400">
                <tr><th className="w-10 px-3 py-2.5 text-center">#</th><th className="px-3 py-2.5">Page</th><th className="px-3 py-2.5">Page type</th><th className="px-3 py-2.5">Page views</th><th className="px-3 py-2.5 text-right">Visitors</th><th className="px-3 py-2.5 text-right">Avg. time</th><th className="px-3 py-2.5 text-right">Share</th><th className="px-3 py-2.5 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800/70">
                {visibleRows.map((row, index) => {
                  const rank = (safePage - 1) * PAGE_SIZE + index + 1;
                  const category = categoryForPath(row.path);
                  const share = totals.views ? (row.views / totals.views) * 100 : 0;
                  return (
                    <tr key={row.path} className="hover:bg-gray-50/80 dark:hover:bg-neutral-900/40 transition-colors">
                      <td className="px-3 py-2.5 text-center font-medium tabular-nums text-gray-400 dark:text-neutral-500">{rank}</td>
                      <td className="max-w-md px-3 py-2.5"><p className="truncate font-semibold text-gray-900 dark:text-gray-100">{row.title || row.path}</p><p className="mt-0.5 truncate font-mono text-[10px] text-gray-400">{row.path}</p></td>
                      <td className="px-3 py-2.5"><span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-medium ${category.classes}`}>{category.label}</span></td>
                      <td className="w-48 px-3 py-2.5"><div className="flex items-center justify-between gap-2.5"><span className="font-semibold tabular-nums text-gray-800 dark:text-gray-100">{compact.format(row.views)}</span><div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-neutral-800"><div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: `${Math.max(3, (row.views / maxViews) * 100)}%` }} /></div></div></td>
                      <td className="px-3 py-2.5 text-right font-medium tabular-nums text-gray-600 dark:text-gray-300">{preset === 'all' ? '—' : compact.format(row.visitors)}</td>
                      <td className="px-3 py-2.5 text-right font-medium tabular-nums text-gray-600 dark:text-gray-300">{formatDuration(row.views ? row.timeMs / row.views : 0)}</td>
                      <td className="px-3 py-2.5 text-right"><span className="rounded-md bg-gray-100 px-2 py-0.5 font-semibold tabular-nums text-gray-700 dark:bg-neutral-800 dark:text-gray-300 text-[11px]">{share.toFixed(1)}%</span></td>
                      <td className="px-3 py-2.5 text-right"><button type="button" onClick={() => onOpenDetails?.(row)} className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1 text-[11px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"><Info size={12} /> Details</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <span>{startRow}–{endRow} of {filteredRows.length} pages</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setPage(current => Math.max(1, current - 1))} disabled={safePage === 1} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-white/5" aria-label="Previous page"><ChevronLeft size={15} /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).filter(number => number === 1 || number === pageCount || Math.abs(number - safePage) <= 1).map((number, index, pages) => (
              <React.Fragment key={number}>{index > 0 && number - pages[index - 1] > 1 && <span className="px-1 text-gray-300">…</span>}<button type="button" onClick={() => setPage(number)} className={`h-8 min-w-8 rounded-lg px-2 font-bold ${safePage === number ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}>{number}</button></React.Fragment>
            ))}
            <button type="button" onClick={() => setPage(current => Math.min(pageCount, current + 1))} disabled={safePage === pageCount} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-white/5" aria-label="Next page"><ChevronRight size={15} /></button>
          </div>
        </div>
      </section>
    </div>
  );
};
