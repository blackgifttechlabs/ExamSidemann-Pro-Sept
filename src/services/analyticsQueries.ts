/**
 * Read side of the analytics store — everything the admin dashboard asks for.
 *
 * All of these read pre-aggregated counter documents written by
 * `services/analytics.ts`, so a month of traffic is a few dozen reads. Only an
 * aggregate rows contain no account or precise-location data.
 */

import {
  collection,
  getDocs,
  getDocsFromCache,
  limit as limitTo,
  orderBy,
  query,
  type DocumentData,
  type Firestore,
  type Query,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
import {
  analyticsDatabases,
  db,
  primaryAnalyticsDatabaseIsAvailable,
} from './firebase';
import {
  ACTIVE_WINDOW_MS,
  dayKey,
  dayKeyBefore,
  docIdToPath,
  type DailyStats,
  type PageStats,
  type ReferrerKind,
} from './analytics';

/**
 * A range wide enough to matter can still be a lot of page/day rows. The cap
 * keeps one careless "all time" click from reading the whole collection; the
 * dashboard says so when it bites.
 */
const PAGE_ROW_CAP = 4000;
const DATABASE_READ_TIMEOUT_MS = 6_000;

const getAnalyticsDocs = async (
  buildQuery: (database: Firestore) => Query<DocumentData>,
): Promise<QueryDocumentSnapshot<DocumentData>[]> => {
  const primaryAvailable = await primaryAnalyticsDatabaseIsAvailable();
  const readFromServer = (database: Firestore) => new Promise<QuerySnapshot<DocumentData>>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Analytics database read timed out.')),
      DATABASE_READ_TIMEOUT_MS,
    );
    getDocs(buildQuery(database)).then(
      (snapshot) => {
        clearTimeout(timeout);
        resolve(snapshot);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
  const read = async (database: Firestore) => {
    const analyticsQuery = buildQuery(database);
    if (database === db && !primaryAvailable) {
      return getDocsFromCache(analyticsQuery);
    }
    try {
      return await readFromServer(database);
    } catch (serverError) {
      try {
        // A quota-blocked project can still supply its last complete summary
        // from Firestore's persistent IndexedDB cache.
        return await getDocsFromCache(analyticsQuery);
      } catch {
        throw serverError;
      }
    }
  };
  const settled = await Promise.allSettled(
    analyticsDatabases.map(read),
  );
  const snapshots = settled
    .filter((result): result is PromiseFulfilledResult<QuerySnapshot<DocumentData>> =>
      result.status === 'fulfilled')
    .map((result) => result.value);
  if (snapshots.length === 0) {
    const failure = settled.find((result): result is PromiseRejectedResult => result.status === 'rejected');
    throw failure?.reason ?? new Error('No analytics database was available.');
  }
  return snapshots.flatMap((snapshot) => snapshot.docs);
};

export type DateRange = { start: string; end: string };

export type HourlyStats = {
  hour: number;
  views: number;
  sessions: number;
  timeMs: number;
};

export type RangePreset = 'today' | '7d' | '30d' | '90d' | 'all' | 'custom';

export const ALL_TIME_START = '2020-01-01';

export const rangeForPreset = (preset: Exclude<RangePreset, 'custom'>): DateRange => {
  const end = dayKey();
  switch (preset) {
    case 'today':
      return { start: end, end };
    case '7d':
      return { start: dayKeyBefore(6), end };
    case '30d':
      return { start: dayKeyBefore(29), end };
    case '90d':
      return { start: dayKeyBefore(89), end };
    case 'all':
      return { start: ALL_TIME_START, end };
  }
};

const numberField = (data: Record<string, unknown>, field: string) => {
  const value = data[field];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};

const emptyDay = (date: string): DailyStats => ({
  date,
  views: 0,
  visitors: 0,
  newVisitors: 0,
  sessions: 0,
  timeMs: 0,
  deviceMobile: 0,
  deviceTablet: 0,
  deviceDesktop: 0,
  refDirect: 0,
  refSearch: 0,
  refSocial: 0,
  refOther: 0,
});

const mergeDailyRows = (rows: DailyStats[]) => {
  const totals = new Map<string, DailyStats>();
  rows.forEach((row) => {
    const current = totals.get(row.date) ?? emptyDay(row.date);
    (Object.keys(current) as Array<keyof DailyStats>).forEach((field) => {
      if (field !== 'date') current[field] += row[field] as number;
    });
    totals.set(row.date, current);
  });
  return [...totals.values()].sort((a, b) => a.date.localeCompare(b.date));
};

const mergePageRows = (rows: PageStats[]) => {
  const totals = new Map<string, PageStats>();
  rows.forEach((row) => {
    const current = totals.get(row.path) ?? { path: row.path, title: row.title, views: 0, visitors: 0, timeMs: 0 };
    current.views += row.views;
    current.visitors += row.visitors;
    current.timeMs += row.timeMs;
    if (!current.title) current.title = row.title;
    totals.set(row.path, current);
  });
  return [...totals.values()].sort((a, b) => b.views - a.views);
};

/** Fills the gaps so a quiet day plots as a zero instead of vanishing. */
const fillMissingDays = (rows: DailyStats[], range: DateRange): DailyStats[] => {
  const byDate = new Map(rows.map((row) => [row.date, row]));
  const filled: DailyStats[] = [];
  const cursor = new Date(`${range.start}T00:00:00Z`);
  const last = new Date(`${range.end}T00:00:00Z`);
  // An unbounded "all time" start would fabricate years of empty days.
  if (Number.isNaN(cursor.getTime()) || (last.getTime() - cursor.getTime()) / 86_400_000 > 400) {
    return rows;
  }

  while (cursor.getTime() <= last.getTime()) {
    const key = cursor.toISOString().slice(0, 10);
    filled.push(byDate.get(key) ?? emptyDay(key));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return filled;
};

export const fetchDailyStats = async (range: DateRange): Promise<DailyStats[]> => {
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_daily'),
      where('date', '>=', range.start),
      where('date', '<=', range.end),
      orderBy('date', 'asc'),
    ),
  );

  const rows = docs.map((snap) => {
    const data = snap.data() as Record<string, unknown>;
    return {
      ...emptyDay(typeof data.date === 'string' ? data.date : snap.id),
      views: numberField(data, 'views'),
      visitors: numberField(data, 'visitors'),
      newVisitors: numberField(data, 'newVisitors'),
      sessions: numberField(data, 'sessions'),
      timeMs: numberField(data, 'timeMs'),
      deviceMobile: numberField(data, 'deviceMobile'),
      deviceTablet: numberField(data, 'deviceTablet'),
      deviceDesktop: numberField(data, 'deviceDesktop'),
      refDirect: numberField(data, 'refDirect'),
      refSearch: numberField(data, 'refSearch'),
      refSocial: numberField(data, 'refSocial'),
      refOther: numberField(data, 'refOther'),
    } satisfies DailyStats;
  });

  return fillMissingDays(mergeDailyRows(rows), range);
};

const harareHourFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Harare',
  hour: '2-digit',
  hourCycle: 'h23',
});

const harareHour = (date: Date) => Number(harareHourFormatter.format(date));

const fillHourlyStats = (rows: HourlyStats[], day: string): HourlyStats[] => {
  const lastHour = day === dayKey() ? harareHour(new Date()) : 23;
  const hours = Array.from({ length: lastHour + 1 }, (_, hour) => ({
    hour,
    views: 0,
    sessions: 0,
    timeMs: 0,
  } satisfies HourlyStats));
  rows.forEach((row) => {
    const bucket = hours[row.hour];
    if (!bucket) return;
    bucket.views += row.views;
    bucket.sessions += row.sessions;
    bucket.timeMs += row.timeMs;
  });
  return hours;
};

/** Reads the 24 small hourly counters; no raw session scan is needed. */
export const fetchHourlyStats = async (day: string): Promise<HourlyStats[]> => {
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_hourly'),
      where('date', '==', day),
      limitTo(24),
    ),
  );

  const rows = docs.map((snap) => {
    const data = snap.data() as Record<string, unknown>;
    return {
      hour: numberField(data, 'hour'),
      views: numberField(data, 'views'),
      sessions: numberField(data, 'sessions'),
      timeMs: numberField(data, 'timeMs'),
    } satisfies HourlyStats;
  });
  return fillHourlyStats(rows, day);
};

export type PageReport = { rows: PageStats[]; truncated: boolean };

export type ExperimentEngagementStats = {
  path: string;
  views: number;
  timeMs: number;
  buttonClicks: number;
  newUsers: number;
  returningUsers: number;
  repeatVisits: number;
};

/**
 * Per-page totals for a date range, summed across the days in it. "All time"
 * skips the per-day rows entirely and reads the running page totals, which is
 * one small query no matter how long the site has been up.
 */
export const fetchPageStats = async (
  range: DateRange,
  isAllTime: boolean,
): Promise<PageReport> => {
  if (isAllTime) {
    const docs = await getAnalyticsDocs((database) =>
      query(collection(database, 'analytics_pages'), orderBy('views', 'desc'), limitTo(1000)),
    );
    return {
      rows: mergePageRows(docs.map((snap) => {
        const data = snap.data() as Record<string, unknown>;
        return {
          path: typeof data.path === 'string' && data.path ? data.path : docIdToPath(snap.id),
          title: typeof data.title === 'string' ? data.title : '',
          views: numberField(data, 'views'),
          visitors: 0,
          timeMs: numberField(data, 'timeMs'),
        } satisfies PageStats;
      })),
      truncated: docs.length >= 1000,
    };
  }

  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_page_daily'),
      where('date', '>=', range.start),
      where('date', '<=', range.end),
      orderBy('date', 'asc'),
      limitTo(PAGE_ROW_CAP),
    ),
  );

  const totals = new Map<string, PageStats>();
  docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const path = typeof data.path === 'string' ? data.path : '';
    if (!path) return;

    const existing = totals.get(path) ?? { path, title: '', views: 0, visitors: 0, timeMs: 0 };
    existing.views += numberField(data, 'views');
    existing.visitors += numberField(data, 'visitors');
    existing.timeMs += numberField(data, 'timeMs');
    if (!existing.title && typeof data.title === 'string') existing.title = data.title;
    totals.set(path, existing);
  });

  return {
    rows: [...totals.values()].sort((a, b) => b.views - a.views),
    truncated: docs.length >= PAGE_ROW_CAP,
  };
};

/** New experiment-only interaction counters; historical page views remain in fetchPageStats. */
export const fetchExperimentEngagementStats = async (
  range: DateRange,
  isAllTime: boolean,
): Promise<{ rows: ExperimentEngagementStats[]; truncated: boolean }> => {
  const docs = isAllTime
    ? await getAnalyticsDocs((database) =>
        query(collection(database, 'analytics_experiments'), limitTo(PAGE_ROW_CAP)))
    : await getAnalyticsDocs((database) =>
        query(
          collection(database, 'analytics_experiment_daily'),
          where('date', '>=', range.start),
          where('date', '<=', range.end),
          orderBy('date', 'asc'),
          limitTo(PAGE_ROW_CAP),
        ));

  const totals = new Map<string, ExperimentEngagementStats>();
  docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const path = typeof data.path === 'string' ? data.path : '';
    if (!path) return;
    const row = totals.get(path) ?? {
      path,
      views: 0,
      timeMs: 0,
      buttonClicks: 0,
      newUsers: 0,
      returningUsers: 0,
      repeatVisits: 0,
    };
    row.views += numberField(data, 'views');
    row.timeMs += numberField(data, 'timeMs');
    row.buttonClicks += numberField(data, 'buttonClicks');
    row.newUsers += numberField(data, 'newUsers');
    row.returningUsers += numberField(data, 'returningUsers');
    row.repeatVisits += numberField(data, 'repeatVisits');
    totals.set(path, row);
  });

  return {
    rows: [...totals.values()],
    truncated: docs.length >= PAGE_ROW_CAP,
  };
};

export type CountryStats = { country: string; sessions: number; views: number };

export type PageVisitRecord = {
  id: string;
  path: string;
  title: string;
  visitorId: string;
  sessionId: string;
  isNewVisitor: boolean;
  device: string;
  country: string;
  openedAt: Date | null;
  closedAt: Date | null;
  lastSeenAt: Date | null;
  durationMs: number;
  exitType: string;
  locationStatus: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  placeName: string;
  formattedAddress: string;
  province: string;
  district: string;
  locality: string;
};

export type UniqueVisitorLocation = PageVisitRecord & { visitCount: number };

const dateField = (data: Record<string, unknown>, field: string) =>
  data[field] instanceof Timestamp ? (data[field] as Timestamp).toDate() : null;

const optionalNumberField = (data: Record<string, unknown>, field: string) => {
  const value = data[field];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
};

const visitRecord = (id: string, data: Record<string, unknown>): PageVisitRecord => ({
  id,
  path: typeof data.path === 'string' ? data.path : '',
  title: typeof data.title === 'string' ? data.title : '',
  visitorId: typeof data.visitorId === 'string' ? data.visitorId : '',
  sessionId: typeof data.sessionId === 'string' ? data.sessionId : '',
  isNewVisitor: data.isNewVisitor === true,
  device: typeof data.device === 'string' ? data.device : 'unknown',
  country: typeof data.country === 'string' ? data.country : 'ZZ',
  openedAt: dateField(data, 'openedAt'),
  closedAt: dateField(data, 'closedAt'),
  lastSeenAt: dateField(data, 'lastSeenAt'),
  durationMs: numberField(data, 'durationMs'),
  exitType: typeof data.exitType === 'string' ? data.exitType : '',
  locationStatus: typeof data.locationStatus === 'string' ? data.locationStatus : 'unavailable',
  latitude: optionalNumberField(data, 'latitude'),
  longitude: optionalNumberField(data, 'longitude'),
  accuracy: optionalNumberField(data, 'accuracy'),
  placeName: typeof data.placeName === 'string' ? data.placeName : '',
  formattedAddress: typeof data.formattedAddress === 'string' ? data.formattedAddress : '',
  province: typeof data.province === 'string' ? data.province : '',
  district: typeof data.district === 'string' ? data.district : '',
  locality: typeof data.locality === 'string' ? data.locality : '',
});

/** Exact consented visit rows for one page, newest first. */
export const fetchPageVisitRecords = async (path: string): Promise<PageVisitRecord[]> => {
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_page_visits'),
      where('path', '==', path),
      orderBy('openedAt', 'desc'),
      limitTo(500),
    ),
  );
  const records = new Map<string, PageVisitRecord>();
  docs.forEach((snap) => records.set(snap.id, visitRecord(snap.id, snap.data() as Record<string, unknown>)));
  return [...records.values()].sort(
    (a, b) => (b.openedAt?.getTime() ?? 0) - (a.openedAt?.getTime() ?? 0),
  );
};

/** One most-recent coordinate per consented pseudonymous visitor. */
export const fetchUniqueVisitorLocations = async (): Promise<UniqueVisitorLocation[]> => {
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_page_visits'),
      where('locationStatus', '==', 'granted'),
      orderBy('openedAt', 'desc'),
      limitTo(PAGE_ROW_CAP),
    ),
  );
  const unique = new Map<string, UniqueVisitorLocation>();
  docs.forEach((snap) => {
    const row = visitRecord(snap.id, snap.data() as Record<string, unknown>);
    if (!row.visitorId || row.latitude == null || row.longitude == null) return;
    const existing = unique.get(row.visitorId);
    if (!existing) {
      unique.set(row.visitorId, { ...row, visitCount: 1 });
      return;
    }
    existing.visitCount += 1;
    if ((row.openedAt?.getTime() ?? 0) > (existing.openedAt?.getTime() ?? 0)) {
      unique.set(row.visitorId, { ...row, visitCount: existing.visitCount });
    }
  });
  return [...unique.values()].sort(
    (a, b) => (b.openedAt?.getTime() ?? 0) - (a.openedAt?.getTime() ?? 0),
  );
};

export type TrafficSourceStats = {
  category: Exclude<ReferrerKind, 'direct'>;
  source: string;
  sessions: number;
};

/** Exact search engine, social platform, or referring website totals. */
export const fetchTrafficSourceStats = async (range: DateRange): Promise<TrafficSourceStats[]> => {
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_source_daily'),
      where('date', '>=', range.start),
      where('date', '<=', range.end),
      orderBy('date', 'asc'),
      limitTo(PAGE_ROW_CAP),
    ),
  );

  const totals = new Map<string, TrafficSourceStats>();
  docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const category = data.category;
    const source = typeof data.source === 'string' ? data.source : '';
    if ((category !== 'search' && category !== 'social' && category !== 'other') || !source) {
      return;
    }

    const key = `${category}:${source}`;
    const existing = totals.get(key) ?? { category, source, sessions: 0 };
    existing.sessions += numberField(data, 'sessions');
    totals.set(key, existing);
  });

  return [...totals.values()].sort(
    (a, b) => b.sessions - a.sessions || a.source.localeCompare(b.source),
  );
};

/**
 * Sessions and views per country for a date range. Countries are derived from
 * the visitor's timezone, so this answers "roughly where are they" and nothing
 * finer — there is no province or city in the data.
 */
export const fetchCountryStats = async (range: DateRange): Promise<CountryStats[]> => {
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_geo_daily'),
      where('date', '>=', range.start),
      where('date', '<=', range.end),
      orderBy('date', 'asc'),
      limitTo(PAGE_ROW_CAP),
    ),
  );

  const totals = new Map<string, CountryStats>();
  docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const country = typeof data.country === 'string' ? data.country : '';
    if (!country) return;

    const existing = totals.get(country) ?? { country, sessions: 0, views: 0 };
    existing.sessions += numberField(data, 'sessions');
    existing.views += numberField(data, 'views');
    totals.set(country, existing);
  });

  return [...totals.values()].sort((a, b) => b.sessions - a.sessions || b.views - a.views);
};

export type LiveSession = {
  id: string;
  path: string;
  title: string;
  device: string;
  referrer: string;
  referrerSource: string;
  country: string;
  views: number;
  timeMs: number;
  lastSeenAt: Date | null;
};

/** Sessions seen in the last few minutes — the "people on the site now" tile. */
export const fetchActiveSessions = async (): Promise<LiveSession[]> => {
  const since = Timestamp.fromMillis(Date.now() - ACTIVE_WINDOW_MS);
  const docs = await getAnalyticsDocs((database) =>
    query(
      collection(database, 'analytics_sessions'),
      where('lastSeenAt', '>=', since),
      orderBy('lastSeenAt', 'desc'),
      limitTo(50),
    ),
  );

  const sessions = docs.map((snap) => {
    const data = snap.data() as Record<string, unknown>;
    return {
      id: snap.id,
      path: typeof data.path === 'string' ? data.path : '',
      title: typeof data.title === 'string' ? data.title : '',
      device: typeof data.device === 'string' ? data.device : 'unknown',
      referrer: typeof data.referrer === 'string' ? data.referrer : 'direct',
      referrerSource:
        typeof data.referrerSource === 'string'
          ? data.referrerSource
          : typeof data.referrer === 'string'
            ? data.referrer
            : 'direct',
      country: typeof data.country === 'string' ? data.country : 'ZZ',
      views: numberField(data, 'views'),
      timeMs: numberField(data, 'timeMs'),
      lastSeenAt:
        data.lastSeenAt instanceof Timestamp ? (data.lastSeenAt as Timestamp).toDate() : null,
    } satisfies LiveSession;
  });
  const merged = new Map<string, LiveSession>();
  sessions.forEach((session) => {
    const current = merged.get(session.id);
    if (!current) {
      merged.set(session.id, session);
      return;
    }
    // Session counters are cumulative: the record with the newer lastSeenAt already has the
    // highest totals, so taking the latest record directly avoids double-counting when the
    // same session ID exists in both databases after a quota-failover DB switch.
    const latest = (session.lastSeenAt?.getTime() ?? 0) > (current.lastSeenAt?.getTime() ?? 0)
      ? session
      : current;
    merged.set(session.id, { ...latest });
  });
  return [...merged.values()]
    .sort((a, b) => (b.lastSeenAt?.getTime() ?? 0) - (a.lastSeenAt?.getTime() ?? 0))
    .slice(0, 50);
};

/** Refresh the live tile through the same cached Vercel boundary as the dashboard. */
export const fetchCachedActiveSessions = async (): Promise<LiveSession[]> => {
  if (!await primaryAnalyticsDatabaseIsAvailable()) return fetchActiveSessions();
  const end = dayKey();
  const params = new URLSearchParams({
    start: end,
    end,
    allTime: 'false',
    hourly: 'false',
  });
  const response = await fetch(`/api/dashboard-metrics/?${params}`, {
    headers: { Accept: 'application/json' },
    cache: 'default',
  });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error(`metrics endpoint returned ${response.status}`);
  }
  const cached: unknown = await response.json();
  if (!isCachedDashboardResponse(cached)) throw new Error('invalid metrics response');
  // Accept partial responses: if one DB is down the other still provides valid live sessions.
  return cached.live.map((row) => ({
    ...row,
    lastSeenAt: typeof row.lastSeenAt === 'number' ? new Date(row.lastSeenAt) : null,
  }));
};

export type DashboardMetricsBundle = {
  daily: DailyStats[];
  hourly: HourlyStats[];
  pages: PageStats[];
  pagesTruncated: boolean;
  live: LiveSession[];
  countries: CountryStats[];
  trafficSources: TrafficSourceStats[];
  partial?: boolean;
};

type CachedDashboardResponse = Omit<DashboardMetricsBundle, 'live'> & {
  live: Array<Omit<LiveSession, 'lastSeenAt'> & { lastSeenAt: number | null }>;
};

const isCachedDashboardResponse = (value: unknown): value is CachedDashboardResponse => {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<CachedDashboardResponse>;
  return Array.isArray(data.daily) && Array.isArray(data.hourly) &&
    Array.isArray(data.pages) && Array.isArray(data.live) &&
    Array.isArray(data.countries) && Array.isArray(data.trafficSources) &&
    typeof data.pagesTruncated === 'boolean';
};

/**
 * Loads the main dashboard through the Vercel Function cache. Local preview
 * environments transparently fall back to the bounded SDK queries.
 */
export const fetchDashboardMetrics = async (
  range: DateRange,
  isAllTime: boolean,
  includeHourly: boolean,
): Promise<DashboardMetricsBundle> => {
  const params = new URLSearchParams({
    start: range.start,
    end: range.end,
    allTime: String(isAllTime),
    hourly: String(includeHourly),
  });

  try {
    if (!await primaryAnalyticsDatabaseIsAvailable()) {
      throw new Error('primary analytics quota is exhausted');
    }
    const response = await fetch(`/api/dashboard-metrics/?${params}`, {
      headers: { Accept: 'application/json' },
      cache: 'default',
    });
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
      throw new Error(`metrics endpoint returned ${response.status}`);
    }
    const cached: unknown = await response.json();
    if (!isCachedDashboardResponse(cached)) throw new Error('invalid metrics response');
    // When one DB is unavailable the API still returns the other DB's data. Accept partial
    // results and let the dashboard show a warning banner rather than falling back to the
    // slower SDK path which reads the same partially-unavailable database.
    return {
      ...cached,
      daily: fillMissingDays(cached.daily, range),
      hourly: includeHourly ? fillHourlyStats(cached.hourly, range.end) : [],
      live: cached.live.map((row) => ({
        ...row,
        lastSeenAt: typeof row.lastSeenAt === 'number' ? new Date(row.lastSeenAt) : null,
      })),
      partial: cached.partial,
    };
  } catch (cacheError) {
    console.debug('cached dashboard metrics unavailable; using Firestore', cacheError);
  }

  const [daily, hourly, pageReport, live, countries, trafficSources] = await Promise.all([
    fetchDailyStats(range),
    includeHourly ? fetchHourlyStats(range.end) : Promise.resolve([]),
    fetchPageStats(range, isAllTime),
    fetchActiveSessions(),
    fetchCountryStats(range),
    fetchTrafficSourceStats(range).catch(() => []),
  ]);
  return {
    daily,
    hourly,
    pages: pageReport.rows,
    pagesTruncated: pageReport.truncated,
    live,
    countries,
    trafficSources,
  };
};

export type RangeTotals = {
  views: number;
  visitors: number;
  newVisitors: number;
  sessions: number;
  timeMs: number;
  devices: { mobile: number; tablet: number; desktop: number };
  referrers: { direct: number; search: number; social: number; other: number };
  avgSessionMs: number;
  viewsPerSession: number;
};

export const totalsFor = (days: DailyStats[]): RangeTotals => {
  const sum = (pick: (day: DailyStats) => number) => days.reduce((acc, day) => acc + pick(day), 0);

  const sessions = sum((day) => day.sessions);
  const views = sum((day) => day.views);
  const timeMs = sum((day) => day.timeMs);

  return {
    views,
    visitors: sum((day) => day.visitors),
    newVisitors: sum((day) => day.newVisitors),
    sessions,
    timeMs,
    devices: {
      mobile: sum((day) => day.deviceMobile),
      tablet: sum((day) => day.deviceTablet),
      desktop: sum((day) => day.deviceDesktop),
    },
    referrers: {
      direct: sum((day) => day.refDirect),
      search: sum((day) => day.refSearch),
      social: sum((day) => day.refSocial),
      other: sum((day) => day.refOther),
    },
    avgSessionMs: sessions > 0 ? timeMs / sessions : 0,
    viewsPerSession: sessions > 0 ? views / sessions : 0,
  };
};
