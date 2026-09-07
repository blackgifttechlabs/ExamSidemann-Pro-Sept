import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock3,
  ExternalLink,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  fetchPageVisitRecords,
  type PageVisitRecord,
} from '../../services/analyticsQueries';
import { formatDuration } from '../../services/analytics';

type Props = {
  path: string;
  title: string;
  onBack: () => void;
};

const dateTime = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'medium',
  timeZone: 'Africa/Harare',
});

const exactTime = (value: Date | null) => value ? dateTime.format(value) : '—';

const shortId = (value: string) => value ? `${value.slice(0, 8)}…${value.slice(-4)}` : 'Unknown';

const openDuration = (row: PageVisitRecord) => {
  if (!row.openedAt) return 0;
  const end = row.closedAt ?? row.lastSeenAt;
  return end ? Math.max(0, end.getTime() - row.openedAt.getTime()) : 0;
};

const osmUrl = (row: PageVisitRecord) => {
  if (row.latitude == null || row.longitude == null) return '';
  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(row.latitude)}&mlon=${encodeURIComponent(row.longitude)}#map=18/${encodeURIComponent(row.latitude)}/${encodeURIComponent(row.longitude)}`;
};

const locationText = (row: PageVisitRecord) =>
  row.placeName || row.locality || row.formattedAddress ||
  (row.latitude != null && row.longitude != null
    ? `${row.latitude.toFixed(5)}, ${row.longitude.toFixed(5)}`
    : row.locationStatus === 'denied'
      ? 'Permission denied'
      : row.locationStatus === 'pending'
        ? 'Waiting for permission'
        : 'Not available');

export const TrafficPageDetails: React.FC<Props> = ({ path, title, onBack }) => {
  const [rows, setRows] = useState<PageVisitRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await fetchPageVisitRecords(path));
    } catch (loadError) {
      console.error('page visit details load failed', loadError);
      setError('Could not load visit details. Confirm this account has the Firebase admin claim and try again.');
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { void load(); }, [load]);

  const visibleRows = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    if (!term) return rows;
    return rows.filter((row) => (
      `${row.visitorId} ${row.device} ${row.country} ${row.province} ${row.district} ${row.locality} ${row.placeName} ${row.formattedAddress}`
        .toLocaleLowerCase()
        .includes(term)
    ));
  }, [rows, search]);

  const metrics = useMemo(() => ({
    visits: rows.length,
    visitors: new Set(rows.map((row) => row.visitorId).filter(Boolean)).size,
    located: rows.filter((row) => row.latitude != null && row.longitude != null).length,
    open: rows.filter((row) => !row.closedAt).length,
  }), [rows]);

  return (
    <div className="animate-dropdown-reveal text-left">
      <button type="button" onClick={onBack} className="mb-4 inline-flex items-center gap-2 text-xs font-black text-gray-500 transition hover:text-purple-700 dark:text-gray-400 dark:hover:text-purple-300">
        <ArrowLeft size={16} /> Back to pages by traffic
      </button>

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-purple-600 dark:text-purple-300"><Eye size={14} /> Page visit details</p>
          <h2 className="truncate text-2xl font-black tracking-tight text-gray-950 dark:text-white">{title || path}</h2>
          <p className="mt-1 truncate font-mono text-xs text-gray-400">{path}</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-black text-gray-600 shadow-sm hover:text-purple-700 disabled:opacity-50 dark:border-white/10 dark:bg-[#161616] dark:text-gray-300">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          { label: 'Recorded visits', value: metrics.visits, Icon: Eye, tint: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
          { label: 'Unique visitors', value: metrics.visitors, Icon: Users, tint: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300' },
          { label: 'Located visits', value: metrics.located, Icon: MapPin, tint: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' },
          { label: 'No close signal', value: metrics.open, Icon: Clock3, tint: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300' },
        ].map(({ label, value, Icon, tint }) => (
          <div key={label} className={`rounded-2xl p-4 ${tint}`}><Icon size={18} /><p className="mt-4 text-2xl font-black tabular-nums">{loading ? '—' : value}</p><p className="mt-1 text-[10px] font-black uppercase tracking-wider opacity-70">{label}</p></div>
        ))}
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs text-blue-800 dark:border-blue-400/15 dark:bg-blue-500/10 dark:text-blue-200">
        <ShieldCheck size={18} className="mt-0.5 shrink-0" />
        <p><strong>Consent-aware data:</strong> precise location appears only when a visitor accepted analytics and granted browser location permission. “No close signal” means the browser ended before its final event could reach Firestore; the last-seen time remains available.</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#161616]">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div><h3 className="text-sm font-black text-gray-950 dark:text-white">Visit timeline</h3><p className="mt-0.5 text-[11px] text-gray-400">Times shown in Africa/Harare</p></div>
          <div className="relative w-full sm:w-80"><Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search visitor or location" className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-xs font-semibold outline-none focus:border-purple-500 dark:border-white/10 dark:bg-[#111] dark:text-white" /></div>
        </div>

        {error && <div className="m-4 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 dark:bg-red-500/10 dark:text-red-300">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1480px] text-left text-xs">
            <thead className="border-b border-gray-200 bg-slate-50 text-[10px] font-black uppercase tracking-[.1em] text-slate-500 dark:border-white/10 dark:bg-white/[.035] dark:text-gray-400">
              <tr><th className="px-4 py-4">Visitor</th><th className="px-4 py-4">Opened</th><th className="px-4 py-4">Closed / last seen</th><th className="px-4 py-4">Open span</th><th className="px-4 py-4">Engaged</th><th className="px-4 py-4">Device</th><th className="px-4 py-4">Province</th><th className="px-4 py-4">District</th><th className="px-4 py-4">Exact place</th><th className="px-4 py-4">Coordinates</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? Array.from({ length: 7 }, (_, index) => <tr key={index} className="animate-pulse"><td colSpan={10} className="px-4 py-4"><span className="block h-4 rounded bg-gray-100 dark:bg-white/5" /></td></tr>) : visibleRows.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-16 text-center text-sm font-semibold text-gray-400">No consented visit records found for this page yet.</td></tr>
              ) : visibleRows.map((row) => {
                const link = osmUrl(row);
                return (
                  <tr key={row.id} className="odd:bg-white even:bg-slate-50/60 hover:!bg-purple-50/60 dark:odd:bg-[#161616] dark:even:bg-white/[.025] dark:hover:!bg-purple-500/[.06]">
                    <td className="px-4 py-3"><p className="font-mono font-bold text-gray-800 dark:text-gray-200">{shortId(row.visitorId)}</p><p className="mt-0.5 text-[10px] text-gray-400">{row.isNewVisitor ? 'New visitor' : 'Returning visitor'}</p></td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">{exactTime(row.openedAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3"><p className="font-semibold text-gray-700 dark:text-gray-200">{exactTime(row.closedAt ?? row.lastSeenAt)}</p><p className={`mt-0.5 text-[10px] font-bold ${row.closedAt ? 'text-emerald-600' : 'text-amber-600'}`}>{row.closedAt ? `Closed · ${row.exitType || 'browser'}` : 'Last seen only'}</p></td>
                    <td className="whitespace-nowrap px-4 py-3 font-black tabular-nums text-gray-700 dark:text-gray-200">{formatDuration(openDuration(row))}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold tabular-nums text-gray-500">{formatDuration(row.durationMs)}</td>
                    <td className="capitalize px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{row.device}</td>
                    <td className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{row.province || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300">{row.district || '—'}</td>
                    <td className="max-w-xs px-4 py-3"><p className="truncate font-bold text-gray-800 dark:text-gray-100" title={row.formattedAddress}>{locationText(row)}</p><p className="mt-0.5 truncate text-[10px] text-gray-400">{row.formattedAddress || row.locationStatus}</p></td>
                    <td className="whitespace-nowrap px-4 py-3">{link ? <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 font-black text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300">{row.latitude?.toFixed(5)}, {row.longitude?.toFixed(5)} <ExternalLink size={12} /></a> : <span className="text-gray-400">Not shared</span>}{row.accuracy != null && <p className="mt-1 text-[10px] text-gray-400">±{Math.round(row.accuracy)} m accuracy</p>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
