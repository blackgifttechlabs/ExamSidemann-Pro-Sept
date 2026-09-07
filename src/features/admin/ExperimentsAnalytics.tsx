import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Clock3,
  Eye,
  FlaskConical,
  MousePointerClick,
  RefreshCw,
  Repeat2,
  Search,
  UserPlus,
  Users,
} from 'lucide-react';
import { LEVELS } from '../practicals/practicalsCatalog';
import { dayKey, formatDuration, normalizePath } from '../../services/analytics';
import {
  fetchExperimentEngagementStats,
  fetchPageStats,
  rangeForPreset,
  type DateRange,
} from '../../services/analyticsQueries';

type Period = 'today' | 'week' | 'month' | '90d' | 'all';

const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
  { id: '90d', label: 'Last 90 days' },
  { id: 'all', label: 'All time' },
];

const rangeForPeriod = (period: Period): DateRange => {
  if (period === 'today') return rangeForPreset('today');
  if (period === 'week') return rangeForPreset('7d');
  if (period === '90d') return rangeForPreset('90d');
  if (period === 'all') return rangeForPreset('all');
  const end = dayKey();
  return { start: `${end.slice(0, 8)}01`, end };
};

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

type CategoryRow = {
  id: string;
  level: string;
  title: string;
  image?: string;
  Icon: (typeof LEVELS)[number]['categories'][number]['Icon'];
  tile: string;
  iconColor: string;
  experimentCount: number;
  views: number;
  timeMs: number;
  buttonClicks: number;
  newUsers: number;
  returningUsers: number;
  repeatVisits: number;
};

export const ExperimentsAnalytics: React.FC = () => {
  const [period, setPeriod] = useState<Period>('month');
  const [pageStats, setPageStats] = useState<Awaited<ReturnType<typeof fetchPageStats>>['rows']>([]);
  const [engagement, setEngagement] = useState<Awaited<ReturnType<typeof fetchExperimentEngagementStats>>['rows']>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [truncated, setTruncated] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const range = rangeForPeriod(period);
      const allTime = period === 'all';
      const [pages, interactions] = await Promise.all([
        fetchPageStats(range, allTime),
        fetchExperimentEngagementStats(range, allTime),
      ]);
      setPageStats(pages.rows);
      setEngagement(interactions.rows);
      setTruncated(pages.truncated || interactions.truncated);
    } catch (loadError) {
      console.error('experiment analytics load failed', loadError);
      setError('Experiment analytics could not be loaded. Check Firestore access and try again.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { void load(); }, [load]);

  const rows = useMemo<CategoryRow[]>(() => {
    const pages = new Map(pageStats.map((row) => [normalizePath(row.path), row]));
    const interactions = new Map(engagement.map((row) => [normalizePath(row.path), row]));

    return LEVELS.flatMap((level) =>
      level.categories.map((category) => {
        const paths = category.experiments.map((experiment) => normalizePath(experiment.route));
        return paths.reduce<CategoryRow>((row, path) => {
          const page = pages.get(path);
          const interaction = interactions.get(path);
          row.views += page?.views ?? interaction?.views ?? 0;
          row.timeMs += page?.timeMs ?? interaction?.timeMs ?? 0;
          row.buttonClicks += interaction?.buttonClicks ?? 0;
          row.newUsers += interaction?.newUsers ?? 0;
          row.returningUsers += interaction?.returningUsers ?? 0;
          row.repeatVisits += interaction?.repeatVisits ?? 0;
          return row;
        }, {
          id: category.id,
          level: level.label,
          title: category.title,
          image: category.image,
          Icon: category.Icon,
          tile: category.tile,
          iconColor: category.iconColor,
          experimentCount: category.experiments.length,
          views: 0,
          timeMs: 0,
          buttonClicks: 0,
          newUsers: 0,
          returningUsers: 0,
          repeatVisits: 0,
        });
      }),
    );
  }, [engagement, pageStats]);

  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter((row) => !term || `${row.level} ${row.title}`.toLowerCase().includes(term))
      .sort((a, b) => b.views - a.views || a.title.localeCompare(b.title));
  }, [rows, search]);

  const totals = useMemo(() => rows.reduce((sum, row) => ({
    views: sum.views + row.views,
    timeMs: sum.timeMs + row.timeMs,
    clicks: sum.clicks + row.buttonClicks,
    newUsers: sum.newUsers + row.newUsers,
    returningUsers: sum.returningUsers + row.returningUsers,
    repeats: sum.repeats + row.repeatVisits,
  }), { views: 0, timeMs: 0, clicks: 0, newUsers: 0, returningUsers: 0, repeats: 0 }), [rows]);

  const summary = [
    { label: 'Experiment views', value: compact.format(totals.views), Icon: Eye, colour: 'from-violet-600 to-fuchsia-500' },
    { label: 'Average time', value: formatDuration(totals.views ? totals.timeMs / totals.views : 0), Icon: Clock3, colour: 'from-blue-600 to-cyan-500' },
    { label: 'Button clicks', value: compact.format(totals.clicks), Icon: MousePointerClick, colour: 'from-orange-500 to-amber-400' },
    { label: 'Returning learners', value: compact.format(totals.returningUsers), Icon: Repeat2, colour: 'from-emerald-600 to-teal-500' },
  ];

  return (
    <div className="animate-dropdown-reveal text-left">
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-fuchsia-600 dark:text-fuchsia-300"><FlaskConical size={14} /> Practical analytics</div>
          <h2 className="text-2xl font-black text-gray-950 dark:text-white">Experiments</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Category performance, engagement and learner return behaviour.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black text-gray-600 shadow-sm hover:text-violet-700 disabled:opacity-50 dark:border-white/10 dark:bg-[#161616] dark:text-gray-300">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {PERIODS.map((item) => (
          <button key={item.id} type="button" onClick={() => setPeriod(item.id)} className={`rounded-xl px-4 py-2 text-xs font-black transition ${period === item.id ? 'bg-violet-600 text-white shadow-md' : 'border border-gray-200 bg-white text-gray-500 hover:border-violet-300 dark:border-white/10 dark:bg-[#161616] dark:text-gray-300'}`}>{item.label}</button>
        ))}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summary.map((metric) => (
          <div key={metric.label} className={`relative flex min-h-[106px] items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg ${metric.colour}`}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20"><metric.Icon size={21} /></span>
            <div className="min-w-0"><p className="text-2xl font-black tabular-nums">{loading ? '—' : metric.value}</p><p className="truncate text-[10px] font-black uppercase tracking-[.14em] text-white/75">{metric.label}</p></div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#161616]"><p className="flex items-center gap-2 text-xs font-bold text-gray-500"><UserPlus size={15} /> New learners</p><strong className="mt-1 block text-xl text-gray-950 dark:text-white">{compact.format(totals.newUsers)}</strong></div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#161616]"><p className="flex items-center gap-2 text-xs font-bold text-gray-500"><Users size={15} /> Returning learners</p><strong className="mt-1 block text-xl text-gray-950 dark:text-white">{compact.format(totals.returningUsers)}</strong></div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#161616]"><p className="flex items-center gap-2 text-xs font-bold text-gray-500"><Repeat2 size={15} /> Repeat visits</p><strong className="mt-1 block text-xl text-gray-950 dark:text-white">{compact.format(totals.repeats)}</strong></div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#161616]">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-black text-gray-950 dark:text-white">Categories</h3><p className="mt-0.5 text-[11px] text-gray-500">Return data is aggregate and does not expose learner identities.</p></div>
          <div className="relative w-full sm:w-64"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories" className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs font-semibold outline-none focus:border-violet-400 dark:border-white/10 dark:bg-[#111] dark:text-white" /></div>
        </div>
        {truncated && <p className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-[11px] font-semibold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">This range reached the analytics row limit. Choose a shorter period for exact totals.</p>}
        {error && <p className="m-4 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <thead className="bg-gray-50 text-[9px] font-black uppercase tracking-[.13em] text-gray-500 dark:bg-white/[.03]"><tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Experiments</th><th className="px-4 py-3">Views</th><th className="px-4 py-3">Avg. time</th><th className="px-4 py-3">Buttons clicked</th><th className="px-4 py-3">New users</th><th className="px-4 py-3">Returned users</th><th className="px-4 py-3">Return visits</th><th className="px-4 py-3">Times per returner</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/[.07]">
              {loading ? <tr><td colSpan={9} className="px-4 py-14 text-center text-sm text-gray-400">Loading experiment analytics…</td></tr> : visibleRows.map((row) => (
                <tr key={row.id} className="hover:bg-violet-50/40 dark:hover:bg-white/[.025]">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><span className={`flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[5px] ${row.tile}`}>{row.image ? <img src={row.image} alt="" className="h-full w-full object-cover" /> : <row.Icon size={22} className={row.iconColor} />}</span><span className="min-w-0"><strong className="block max-w-[220px] truncate text-sm text-gray-950 dark:text-white">{row.title}</strong><span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{row.level}</span></span></div></td>
                  <td className="px-4 py-3 font-bold tabular-nums text-gray-700 dark:text-gray-200">{row.experimentCount}</td>
                  <td className="px-4 py-3 font-black tabular-nums text-gray-950 dark:text-white">{compact.format(row.views)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{formatDuration(row.views ? row.timeMs / row.views : 0)}</td>
                  <td className="px-4 py-3 font-bold tabular-nums text-orange-600 dark:text-orange-300">{compact.format(row.buttonClicks)}</td>
                  <td className="px-4 py-3 font-bold tabular-nums text-blue-600 dark:text-blue-300">{compact.format(row.newUsers)}</td>
                  <td className="px-4 py-3 font-bold tabular-nums text-emerald-600 dark:text-emerald-300">{compact.format(row.returningUsers)}</td>
                  <td className="px-4 py-3 font-bold tabular-nums text-violet-600 dark:text-violet-300">{compact.format(row.repeatVisits)}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums text-gray-600 dark:text-gray-300">{row.returningUsers ? (row.repeatVisits / row.returningUsers).toFixed(1) : '0.0'}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="mt-3 text-[10px] leading-relaxed text-gray-400">Views and time include existing page analytics. Button, new-versus-returning and repeat-visit counters begin accumulating when this release is deployed.</p>
    </div>
  );
};

export default ExperimentsAnalytics;
