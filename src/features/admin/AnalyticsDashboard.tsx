import { analyticsPage } from '../../utils/analyticsPage';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock,
  Eye,
  Globe,
  Laptop,
  Loader2,
  MonitorSmartphone,
  RefreshCw,
  Search,
  Smartphone,
  Sparkles,
  Tablet,
  Users,
} from 'lucide-react';
import {
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  fetchCachedActiveSessions,
  fetchDashboardMetrics,
  rangeForPreset,
  totalsFor,
  type CountryStats,
  type DateRange,
  type HourlyStats,
  type LiveSession,
  type RangePreset,
  type RangeTotals,
  type TrafficSourceStats,
} from '../../services/analyticsQueries';
import { dayKey, formatDuration, type DailyStats, type PageStats } from '../../services/analytics';

/*
 * Colour is assigned by job, not by taste. Two categorical slots carry series
 * identity on the trend chart (page views, visitors) and three carry the device
 * split; both sets were run through the data-viz validator against this page's
 * own surfaces (#ffffff light, #111111 dark) and clear the lightness band,
 * chroma floor, colour-vision separation and normal-vision floors. Aqua sits
 * just under 3:1 on the light surface, so every donut slice carries a written
 * label and a value — hue is never the only channel.
 */
type ChartColors = {
  series1: string;
  series2: string;
  series3: string;
  grid: string;
  axis: string;
  surface: string;
};

const PALETTE: { light: ChartColors; dark: ChartColors } = {
  light: {
    series1: '#2a78d6',
    series2: '#eb6834',
    series3: '#1baf7a',
    grid: '#e1e0d9',
    axis: '#898781',
    surface: '#ffffff',
  },
  dark: {
    series1: '#3987e5',
    series2: '#d95926',
    series3: '#199e70',
    grid: '#2c2c2a',
    axis: '#898781',
    surface: '#111111',
  },
};

const useIsDarkMode = () => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains('dark'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
};

const numberFormat = new Intl.NumberFormat('en-GB');
const compact = (value: number) => numberFormat.format(Math.round(value));

const shortDate = (isoDay: string) => {
  const parsed = new Date(`${isoDay}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDay;
  return parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
};

const PRESETS: { id: Exclude<RangePreset, 'custom'>; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: 'This week' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'all', label: 'All time' },
];

type PageSort = 'views' | 'time' | 'visitors' | 'recent';

const PAGE_SORTS: { id: PageSort; label: string }[] = [
  { id: 'views', label: 'Most visits' },
  { id: 'visitors', label: 'Most visitors' },
  { id: 'time', label: 'Most time spent' },
  { id: 'recent', label: 'A–Z' },
];

const CARD =
  'min-w-0 bg-white dark:bg-[#0f0f0f] rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm';

/* ------------------------------------------------------------------ tiles */

const StatTile: React.FC<{
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  sub?: string;
  tint: string;
  iconTint: string;
}> = ({ icon: Icon, label, value, sub, tint, iconTint }) => (
  <div className={`rounded-lg p-3.5 border border-gray-200 dark:border-neutral-800 ${tint}`}>
    <div className="flex items-start justify-between gap-2">
      <div className={`w-8 h-8 rounded-md flex items-center justify-center ${iconTint}`}>
        <Icon size={16} />
      </div>
      {sub && (
        <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
          {sub}
        </span>
      )}
    </div>
    <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">{value}</p>
    <p className="mt-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

/* ------------------------------------------------------------------ chart */

type TrendPoint = Pick<DailyStats, 'views' | 'visitors' | 'sessions' | 'timeMs'> & {
  label: string;
};

const TrendTooltip: React.FC<{
  active?: boolean;
  payload?: { payload: TrendPoint }[];
  colors: ChartColors;
  secondaryLabel: string;
}> = ({ active, payload, colors, secondaryLabel }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div className="rounded-md bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-md px-3 py-2 text-left text-xs">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{point.label}</p>
      <div className="mt-1.5 space-y-1">
        <p className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
          <span className="w-2 h-2 rounded-full" style={{ background: colors.series1 }} />
          {compact(point.views)} page views
        </p>
        <p className="flex items-center gap-2 text-xs font-semibold text-gray-900 dark:text-white">
          <span className="w-2 h-2 rounded-full" style={{ background: colors.series2 }} />
          {compact(point.visitors)} {secondaryLabel.toLocaleLowerCase()}
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-0.5">
          {formatDuration(point.timeMs)} spent reading
          {secondaryLabel === 'Visitors' ? ` · ${compact(point.sessions)} sessions` : ''}
        </p>
      </div>
    </div>
  );
};

const TrendChart: React.FC<{ data: TrendPoint[]; colors: ChartColors; secondaryLabel: string }> = ({
  data,
  colors,
  secondaryLabel,
}) => {
  const lastIndex = data.length - 1;
  // One or two days plot as points: a line needs somewhere to go.
  const sparse = data.length <= 2;

  /** Only the final point is labelled — a number on every point is unreadable. */
  const endLabel =
    (dataKey: 'views' | 'visitors', fill: string) =>
    (props: { x?: number; y?: number; index?: number; value?: number }) => {
      if (props.index !== lastIndex || props.x == null || props.y == null) return null;
      return (
        <text
          x={props.x}
          y={props.y - 12}
          textAnchor="end"
          fontSize={11}
          fontWeight={700}
          fill={fill}
        >
          {compact(Number(props.value ?? 0))}
        </text>
      );
    };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 24, right: 16, bottom: 8, left: 0 }}>
        <defs>
          <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.series1} stopOpacity={0.22} />
            <stop offset="100%" stopColor={colors.series1} stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={colors.grid} strokeWidth={1} vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: colors.axis, fontSize: 11 }}
          minTickGap={24}
          dy={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: colors.axis, fontSize: 11 }}
          width={44}
          allowDecimals={false}
        />
        <Tooltip
          content={<TrendTooltip colors={colors} secondaryLabel={secondaryLabel} />}
          cursor={{ stroke: colors.axis, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke={colors.series1}
          strokeWidth={2}
          fill="url(#viewsFill)"
          dot={sparse ? { r: 4, strokeWidth: 0, fill: colors.series1 } : false}
          isAnimationActive={false}
          activeDot={{ r: 5, strokeWidth: 2, stroke: colors.surface }}
          label={endLabel('views', colors.series1)}
        />
        <Line
          type="monotone"
          dataKey="visitors"
          stroke={colors.series2}
          strokeWidth={2}
          dot={sparse ? { r: 4, strokeWidth: 0, fill: colors.series2 } : false}
          isAnimationActive={false}
          activeDot={{ r: 5, strokeWidth: 2, stroke: colors.surface }}
          label={endLabel('visitors', colors.series2)}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

/* ------------------------------------------------------------------ donut */

const DEVICE_META = [
  { key: 'mobile' as const, label: 'Mobile', icon: Smartphone },
  { key: 'desktop' as const, label: 'Desktop', icon: Laptop },
  { key: 'tablet' as const, label: 'Tablet', icon: Tablet },
];

const DeviceDonut: React.FC<{ totals: RangeTotals; colors: ChartColors }> = ({
  totals,
  colors,
}) => {
  const slices = [
    { name: 'Mobile', value: totals.devices.mobile, fill: colors.series1 },
    { name: 'Desktop', value: totals.devices.desktop, fill: colors.series2 },
    { name: 'Tablet', value: totals.devices.tablet, fill: colors.series3 },
  ];
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div>
      <div className="relative h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={total > 0 ? slices : [{ name: 'No data', value: 1, fill: colors.grid }]}
              dataKey="value"
              innerRadius="66%"
              outerRadius="94%"
              paddingAngle={total > 0 ? 3 : 0}
              stroke={colors.surface}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
            >
              {(total > 0 ? slices : [{ fill: colors.grid }]).map((slice, index) => (
                <Cell key={index} fill={slice.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-none">
            {compact(total)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
            Sessions
          </span>
        </div>
      </div>

      {/* Every slice is written out with its share: colour is never the only cue. */}
      <div className="mt-4 space-y-2">
        {DEVICE_META.map(({ key, label, icon: Icon }, index) => {
          const value = totals.devices[key];
          const share = total > 0 ? Math.round((value / total) * 100) : 0;
          return (
            <div key={key} className="flex items-center gap-3 text-left">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: slices[index].fill }}
              />
              <Icon size={14} className="text-gray-400 shrink-0" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex-1">
                {label}
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                {compact(value)}
              </span>
              <span className="text-[11px] text-gray-400 tabular-nums w-9 text-right">{share}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------- referrers */

const REFERRER_META = [
  { key: 'direct' as const, label: 'Direct / typed in' },
  { key: 'search' as const, label: 'Search engines' },
  { key: 'social' as const, label: 'Social & WhatsApp' },
  { key: 'other' as const, label: 'Other websites' },
];

const SOURCE_LABELS: Record<string, string> = {
  direct: 'Direct / typed in',
  search: 'Search engine',
  social: 'Social / WhatsApp',
  other: 'Other website',
  google: 'Google',
  bing: 'Bing',
  yahoo: 'Yahoo',
  duckduckgo: 'DuckDuckGo',
  yandex: 'Yandex',
  baidu: 'Baidu',
  ecosia: 'Ecosia',
  'brave-search': 'Brave Search',
  whatsapp: 'WhatsApp',
  facebook: 'Facebook',
  instagram: 'Instagram',
  'x-twitter': 'X / Twitter',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  telegram: 'Telegram',
  reddit: 'Reddit',
  pinterest: 'Pinterest',
  threads: 'Threads',
  snapchat: 'Snapchat',
  'unknown-website': 'Unknown website',
};

const sourceLabel = (source: string) => SOURCE_LABELS[source] ?? source.replace(/^www\./, '');

const ReferrerBars: React.FC<{
  totals: RangeTotals;
  colors: ChartColors;
  sources: TrafficSourceStats[];
}> = ({
  totals,
  colors,
  sources,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const rows = REFERRER_META.map((meta) => ({ ...meta, value: totals.referrers[meta.key] }));
  const max = Math.max(...rows.map((row) => row.value), 1);
  const detailedCategories = rows.filter((row) => row.key !== 'direct');

  return (
    <div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {row.label}
              </span>
              <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                {compact(row.value)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(row.value / max) * 100}%`, background: colors.series1 }}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={detailsOpen}
        aria-controls="traffic-source-details"
        onClick={() => setDetailsOpen((open) => !open)}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-200 dark:border-neutral-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
      >
        {detailsOpen ? 'Hide source details' : 'Show source details'}
        <ChevronDown
          size={14}
          className={`transition-transform ${detailsOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {detailsOpen && (
        <div
          id="traffic-source-details"
          className="mt-3 rounded-md bg-gray-50 dark:bg-neutral-900/60 px-3 py-1 border border-gray-100 dark:border-neutral-800"
        >
          {detailedCategories.map((category) => {
            const categorySources = sources.filter((source) => source.category === category.key);
            const identified = categorySources.reduce((sum, source) => sum + source.sessions, 0);
            const unidentified = Math.max(category.value - identified, 0);
            const details = [
              ...categorySources,
              ...(unidentified > 0
                ? [{ category: category.key, source: 'earlier-unidentified', sessions: unidentified }]
                : []),
            ];

            return (
              <div
                key={category.key}
                className="py-3 border-b border-gray-200/70 dark:border-white/5 last:border-0"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {category.label}
                  </p>
                  <span className="text-[10px] font-semibold text-gray-400">visits</span>
                </div>
                {details.length === 0 ? (
                  <p className="text-xs text-gray-400 py-1">No visits from this source</p>
                ) : (
                  <div className="space-y-2">
                    {details.map((source) => (
                      <div
                        key={`${category.key}-${source.source}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="min-w-0 truncate text-xs font-semibold text-gray-700 dark:text-gray-200">
                          {source.source === 'earlier-unidentified'
                            ? 'Earlier / unidentified'
                            : sourceLabel(source.source)}
                        </span>
                        <span className="text-xs font-extrabold text-gray-900 dark:text-white tabular-nums">
                          {compact(source.sessions)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ countries */

const countryNames =
  typeof Intl !== 'undefined' && 'DisplayNames' in Intl
    ? new Intl.DisplayNames(['en'], { type: 'region' })
    : null;

const countryLabel = (code: string) => {
  if (code === 'ZZ') return 'Elsewhere';
  try {
    return countryNames?.of(code) ?? code;
  } catch {
    return code;
  }
};

/** Two letters → the flag, via the regional-indicator block. */
const countryFlag = (code: string) => {
  if (code === 'ZZ' || code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0)));
};

const CountryList: React.FC<{ rows: CountryStats[]; colors: ChartColors }> = ({ rows, colors }) => {
  const max = Math.max(...rows.map((row) => row.sessions), 1);

  if (rows.length === 0) {
    return (
      <div className="py-8 flex flex-col items-center gap-2 text-center">
        <Globe size={22} className="text-gray-300" />
        <p className="text-sm font-semibold text-gray-500">No visits recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.slice(0, 10).map((row) => (
        <div key={row.country}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base leading-none">{countryFlag(row.country)}</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex-1 truncate">
              {countryLabel(row.country)}
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
              {compact(row.sessions)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(row.sessions / max) * 100}%`, background: colors.series1 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- pages */

const PageRow: React.FC<{ page: PageStats; rank: number; max: number; colors: ChartColors }> =
  ({ page, rank, max, colors }) => (
    <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-neutral-800/60 last:border-0 text-xs">
      <span className="w-5 text-xs font-semibold text-gray-400 dark:text-neutral-500 tabular-nums shrink-0">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
          <a href={analyticsPage(page.path, page.title).href} target="_blank" rel="noopener noreferrer" className="hover:underline">{analyticsPage(page.path, page.title).title}</a>
        </p>
        <p className="text-[10px] text-gray-400 dark:text-neutral-400 truncate font-mono">{page.path}</p>
        <div className="h-1 mt-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${(page.views / max) * 100}%`, background: colors.series1 }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-bold text-gray-900 dark:text-white tabular-nums">
          {compact(page.views)}
        </p>
        <p className="text-[10px] text-gray-400">visits</p>
      </div>
      <div className="text-right shrink-0 w-16 hidden sm:block">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 tabular-nums">
          {formatDuration(page.views > 0 ? page.timeMs / page.views : 0)}
        </p>
        <p className="text-[10px] text-gray-400">avg. time</p>
      </div>
    </div>
  );

/* ------------------------------------------------------------ dashboard */

export const AnalyticsDashboard: React.FC = () => {
  const isDark = useIsDarkMode();
  const colors = isDark ? PALETTE.dark : PALETTE.light;

  const [preset, setPreset] = useState<RangePreset>('30d');
  const [customRange, setCustomRange] = useState<DateRange>({
    start: rangeForPreset('30d').start,
    end: dayKey(),
  });
  const [pageSort, setPageSort] = useState<PageSort>('views');
  const [pageSearch, setPageSearch] = useState('');

  const [daily, setDaily] = useState<DailyStats[]>([]);
  const [hourly, setHourly] = useState<HourlyStats[]>([]);
  const [pages, setPages] = useState<PageStats[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [live, setLive] = useState<LiveSession[]>([]);
  const [countries, setCountries] = useState<CountryStats[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSourceStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo<DateRange>(
    () => (preset === 'custom' ? customRange : rangeForPreset(preset)),
    [preset, customRange],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const metrics = await fetchDashboardMetrics(range, preset === 'all', preset === 'today');
      setDaily(metrics.daily);
      setHourly(metrics.hourly);
      setPages(metrics.pages);
      setTruncated(metrics.pagesTruncated);
      setLive(metrics.live);
      setCountries(metrics.countries);
      setTrafficSources(metrics.trafficSources);
    } catch (err) {
      console.error('analytics dashboard load failed', err);
      setError(
        err instanceof Error && err.message.includes('permission')
          ? 'Firestore refused the read. Deploy the analytics rules and make sure this account carries the admin claim.'
          : 'Could not load analytics. Check the connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [range, preset]);

  useEffect(() => {
    void load();
  }, [load]);

  // The "on the site now" panel is only meaningful if it keeps up.
  useEffect(() => {
    const timer = setInterval(() => {
      void fetchCachedActiveSessions()
        .then(setLive)
        .catch(() => undefined);
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  const totals = useMemo(() => totalsFor(daily), [daily]);

  const isHourlyTrend = preset === 'today';
  const trend = useMemo<TrendPoint[]>(() => {
    if (isHourlyTrend) {
      return hourly.map((hour) => ({
        label: `${String(hour.hour).padStart(2, '0')}:00`,
        views: hour.views,
        visitors: hour.sessions,
        sessions: hour.sessions,
        timeMs: hour.timeMs,
      }));
    }
    return daily.map((day) => ({ ...day, label: shortDate(day.date) }));
  }, [daily, hourly, isHourlyTrend]);

  const visiblePages = useMemo(() => {
    const term = pageSearch.trim().toLowerCase();
    const filtered = term
      ? pages.filter(
          (page) =>
            page.path.toLowerCase().includes(term) || page.title.toLowerCase().includes(term),
        )
      : pages;

    const sorted = [...filtered];
    switch (pageSort) {
      case 'views':
        sorted.sort((a, b) => b.views - a.views);
        break;
      case 'visitors':
        sorted.sort((a, b) => b.visitors - a.visitors || b.views - a.views);
        break;
      case 'time':
        sorted.sort((a, b) => b.timeMs - a.timeMs);
        break;
      case 'recent':
        sorted.sort((a, b) => a.path.localeCompare(b.path));
        break;
    }
    return sorted.slice(0, 40);
  }, [pages, pageSort, pageSearch]);

  const maxPageViews = Math.max(...visiblePages.map((page) => page.views), 1);
  const dayCount = Math.max(daily.length, 1);
  const activeNow = live.length;

  return (
    <div className="w-full text-left">
      {/* ------------------------------------------------------------ head */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Visitor Analytics
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {shortDate(range.start)} — {shortDate(range.end)} · Every page view and reading minute recorded
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeNow > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 border border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeNow} reading now
            </span>
          )}
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* --------------------------------------------------------- filters */}
      <div className={`${CARD} p-3 mb-4 flex flex-col xl:flex-row xl:items-center gap-3`}>
        <div className="flex flex-wrap items-center gap-1.5">
          {PRESETS.map((item) => (
            <button
              key={item.id}
              onClick={() => setPreset(item.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                preset === item.id
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 xl:ml-auto">
          <input
            type="date"
            value={customRange.start}
            max={customRange.end}
            onChange={(event) => {
              setCustomRange((prev) => ({ ...prev, start: event.target.value }));
              setPreset('custom');
            }}
            className="rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-gray-400"
          />
          <span className="text-xs text-gray-400">to</span>
          <input
            type="date"
            value={customRange.end}
            min={customRange.start}
            max={dayKey()}
            onChange={(event) => {
              setCustomRange((prev) => ({ ...prev, end: event.target.value }));
              setPreset('custom');
            }}
            className="rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-3xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-5 mb-6 text-sm font-semibold text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* ------------------------------------------------------------ kpis */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <StatTile
          icon={Users}
          label="Unique visitors"
          value={compact(totals.visitors)}
          sub={`${compact(totals.newVisitors)} new`}
          tint="bg-white dark:bg-[#0f0f0f]"
          iconTint="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatTile
          icon={Eye}
          label="Page views"
          value={compact(totals.views)}
          sub={`${totals.viewsPerSession.toFixed(1)} / visit`}
          tint="bg-white dark:bg-[#0f0f0f]"
          iconTint="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400"
        />
        <StatTile
          icon={Clock}
          label="Total time on site"
          value={formatDuration(totals.timeMs)}
          sub={`${formatDuration(totals.avgSessionMs)} avg`}
          tint="bg-white dark:bg-[#0f0f0f]"
          iconTint="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatTile
          icon={Activity}
          label="Visits (sessions)"
          value={compact(totals.sessions)}
          sub={`${compact(Math.round(totals.views / dayCount))} views/day`}
          tint="bg-white dark:bg-[#0f0f0f]"
          iconTint="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* ------------------------------------------------------- main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start mb-6">
        <div className={`${CARD} p-6 xl:col-span-2`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-2">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                Traffic over time
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isHourlyTrend
                  ? 'Page views and visits by hour'
                  : 'Page views and unique visitors per day'}
              </p>
            </div>
            {/* Legend: identity is never carried by colour alone. */}
            <div className="flex items-center gap-4 shrink-0">
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors.series1 }} />
                Page views
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors.series2 }} />
                {isHourlyTrend ? 'Visits' : 'Visitors'}
              </span>
            </div>
          </div>

          {loading && daily.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-gray-400">
              <Loader2 className="animate-spin" size={22} />
            </div>
          ) : trend.length === 0 ? (
            <div className="h-[280px] flex flex-col items-center justify-center text-center gap-2">
              <BarChart3 size={26} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">No visits recorded in this range</p>
            </div>
          ) : (
            <TrendChart
              data={trend}
              colors={colors}
              secondaryLabel={isHourlyTrend ? 'Visits' : 'Visitors'}
            />
          )}
        </div>

        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">How they arrive</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Device and traffic source, per visit
          </p>
          <DeviceDonut totals={totals} colors={colors} />
          <div className="mt-6 pt-5 border-t border-gray-50 dark:border-white/5">
            <ReferrerBars totals={totals} colors={colors} sources={trafficSources} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- page list */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className={`${CARD} p-6 xl:col-span-2 xl:-mt-44`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
                Pages by traffic
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {compact(pages.length)} pages visited in this range
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  value={pageSearch}
                  onChange={(event) => setPageSearch(event.target.value)}
                  placeholder="Find a page"
                  className="w-36 rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 pl-7 pr-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 placeholder:text-gray-400 outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <select
                value={pageSort}
                onChange={(event) => setPageSort(event.target.value as PageSort)}
                className="rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-200 outline-none focus:ring-1 focus:ring-gray-400"
              >
                {PAGE_SORTS.map((sort) => (
                  <option key={sort.id} value={sort.id} className="dark:bg-[#111]">
                    {sort.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {truncated && (
            <p className="mb-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 px-4 py-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              This range has more page-days than one read can return — the list shows the earliest
              part of the range. Narrow the dates, or use All time for lifetime totals.
            </p>
          )}

          {visiblePages.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2 text-center">
              <Sparkles size={22} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">Nothing recorded yet</p>
              <p className="text-xs text-gray-400 max-w-xs">
                Visits appear here a few seconds after somebody opens a page on the site.
              </p>
            </div>
          ) : (
            <div>
              {visiblePages.map((page, index) => (
                <PageRow
                  key={page.path}
                  page={page}
                  rank={index + 1}
                  max={maxPageViews}
                  colors={colors}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 min-w-0">
        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Where they are</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Visits by country, from the reader's own timezone
          </p>
          <CountryList rows={countries} colors={colors} />
        </div>

        <div className={`${CARD} p-6`}>
          <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">On the site now</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Visits active in the last 5 minutes
          </p>

          {live.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-2 text-center">
              <MonitorSmartphone size={22} className="text-gray-300" />
              <p className="text-sm font-semibold text-gray-500">Nobody on the site</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
              {live.map((session) => (
                <a
                  href={analyticsPage(session.path, session.title).href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open ${analyticsPage(session.path, session.title).title}`}
                  key={session.id}
                  className="rounded-2xl bg-gray-50 dark:bg-white/5 px-4 py-3 flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white break-words">
                      {analyticsPage(session.path, session.title).title}
                    </p>
                    <p className="text-[10px] text-gray-500 break-all">{analyticsPage(session.path, session.title).href}</p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {countryFlag(session.country)} {session.device} ·{' '}
                      {sourceLabel(session.referrerSource)} ·{' '}
                      {compact(session.views)} pages
                    </p>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-300 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};
