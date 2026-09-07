import { getApps, initializeApp } from 'firebase/app';
import {
  collection,
  type Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore/lite';

export const config = { maxDuration: 30 };

const PROJECT_ID = 'testing-3d5b2';
const PAGE_ROW_CAP = 4000;
const CACHE_MS = 60_000;
const DATABASE_READ_TIMEOUT_MS = 6_000;
const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;
const memoryCache = new Map<string, { value: DashboardResponse; expiresAt: number }>();
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB8Tg1JSxd_DWX5b99pSPIZHECPwBBxnrE',
  authDomain: 'testing-3d5b2.firebaseapp.com',
  projectId: PROJECT_ID,
};
const SECONDARY_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAafqJS5e15s8H6DE_HSu2-pEljIdI3jok',
  authDomain: 'examsidemann-login-4ec4f.firebaseapp.com',
  projectId: 'examsidemann-login-4ec4f',
};

type DashboardResponse = {
  daily: Array<Record<string, string | number>>;
  hourly: Array<Record<string, number>>;
  pages: Array<Record<string, string | number>>;
  pagesTruncated: boolean;
  live: Array<Record<string, string | number | null>>;
  countries: Array<Record<string, string | number>>;
  trafficSources: Array<Record<string, string | number>>;
  partial: boolean;
};

const firstQueryValue = (value: unknown) => Array.isArray(value) ? value[0] : value;
const textValue = (data: Record<string, unknown>, field: string, fallback = '') =>
  typeof data[field] === 'string' ? data[field] as string : fallback;
const numberValue = (data: Record<string, unknown>, field: string) => {
  const value = data[field];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
};

const firestoreDatabases = (): Firestore[] => {
  const apps = getApps();
  const primary = apps.find((app) => app.name === '[DEFAULT]') || initializeApp(FIREBASE_CONFIG);
  const secondary = apps.find((app) => app.name === 'analytics-secondary') ||
    initializeApp(SECONDARY_FIREBASE_CONFIG, 'analytics-secondary');
  return [getFirestore(primary), getFirestore(secondary)];
};

const buildMetricsForDatabase = async (db: Firestore, {
  start,
  end,
  allTime,
  hourly,
}: {
  start: string;
  end: string;
  allTime: boolean;
  hourly: boolean;
}): Promise<DashboardResponse> => {
  const ranged = (name: string) => query(
    collection(db, name),
    where('date', '>=', start),
    where('date', '<=', end),
    orderBy('date', 'asc'),
  );

  const [dailySnap, hourlySnap, pagesSnap, liveSnap, countriesSnap, sourcesSnap] = await Promise.all([
    getDocs(query(ranged('analytics_daily'), limit(PAGE_ROW_CAP))),
    hourly
      ? getDocs(query(
          collection(db, 'analytics_hourly'),
          where('date', '==', end),
          limit(24),
        ))
      : Promise.resolve(null),
    allTime
      ? getDocs(query(collection(db, 'analytics_pages'), orderBy('views', 'desc'), limit(100)))
      : getDocs(query(ranged('analytics_page_daily'), limit(PAGE_ROW_CAP))),
    getDocs(query(
      collection(db, 'analytics_sessions'),
      where('lastSeenAt', '>=', new Date(Date.now() - 5 * 60_000)),
      orderBy('lastSeenAt', 'desc'),
      limit(50),
    )),
    getDocs(query(ranged('analytics_geo_daily'), limit(PAGE_ROW_CAP))),
    getDocs(query(ranged('analytics_source_daily'), limit(PAGE_ROW_CAP))),
  ]);

  const daily = dailySnap.docs.map((snap) => {
    const data = snap.data() as Record<string, unknown>;
    return {
      date: textValue(data, 'date', snap.id),
      views: numberValue(data, 'views'),
      visitors: numberValue(data, 'visitors'),
      newVisitors: numberValue(data, 'newVisitors'),
      sessions: numberValue(data, 'sessions'),
      timeMs: numberValue(data, 'timeMs'),
      deviceMobile: numberValue(data, 'deviceMobile'),
      deviceTablet: numberValue(data, 'deviceTablet'),
      deviceDesktop: numberValue(data, 'deviceDesktop'),
      refDirect: numberValue(data, 'refDirect'),
      refSearch: numberValue(data, 'refSearch'),
      refSocial: numberValue(data, 'refSocial'),
      refOther: numberValue(data, 'refOther'),
    };
  });

  const pageTotals = new Map<string, Record<string, string | number>>();
  pagesSnap.docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const path = textValue(data, 'path', allTime ? snap.id : '');
    if (!path) return;
    const row = pageTotals.get(path) || {
      path,
      title: textValue(data, 'title'),
      views: 0,
      visitors: 0,
      timeMs: 0,
    };
    row.views = Number(row.views) + numberValue(data, 'views');
    row.visitors = Number(row.visitors) + numberValue(data, 'visitors');
    row.timeMs = Number(row.timeMs) + numberValue(data, 'timeMs');
    if (!row.title) row.title = textValue(data, 'title');
    pageTotals.set(path, row);
  });

  const countryTotals = new Map<string, Record<string, string | number>>();
  countriesSnap.docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const country = textValue(data, 'country');
    if (!country) return;
    const row = countryTotals.get(country) || { country, sessions: 0, views: 0 };
    row.sessions = Number(row.sessions) + numberValue(data, 'sessions');
    row.views = Number(row.views) + numberValue(data, 'views');
    countryTotals.set(country, row);
  });

  const sourceTotals = new Map<string, Record<string, string | number>>();
  sourcesSnap.docs.forEach((snap) => {
    const data = snap.data() as Record<string, unknown>;
    const category = data.category;
    const source = textValue(data, 'source');
    if ((category !== 'search' && category !== 'social' && category !== 'other') || !source) return;
    const key = `${category}:${source}`;
    const row = sourceTotals.get(key) || { category, source, sessions: 0 };
    row.sessions = Number(row.sessions) + numberValue(data, 'sessions');
    sourceTotals.set(key, row);
  });

  const pages = [...pageTotals.values()].sort((a, b) => Number(b.views) - Number(a.views));
  const countries = [...countryTotals.values()].sort(
    (a, b) => Number(b.sessions) - Number(a.sessions) || Number(b.views) - Number(a.views),
  );
  const trafficSources = [...sourceTotals.values()].sort(
    (a, b) => Number(b.sessions) - Number(a.sessions) || String(a.source).localeCompare(String(b.source)),
  );

  return {
    daily,
    hourly: hourlySnap ? hourlySnap.docs.map((snap) => {
      const data = snap.data() as Record<string, unknown>;
      return {
        hour: numberValue(data, 'hour'),
        views: numberValue(data, 'views'),
        sessions: numberValue(data, 'sessions'),
        timeMs: numberValue(data, 'timeMs'),
      };
    }).sort((a, b) => a.hour - b.hour) : [],
    pages,
    pagesTruncated: !allTime && pagesSnap.size >= PAGE_ROW_CAP,
    live: liveSnap.docs.map((snap) => {
      const data = snap.data() as Record<string, unknown>;
      const lastSeenAt = data.lastSeenAt as { toMillis?: () => number } | undefined;
      return {
        id: snap.id,
        path: textValue(data, 'path'),
        title: textValue(data, 'title'),
        device: textValue(data, 'device', 'unknown'),
        referrer: textValue(data, 'referrer', 'direct'),
        referrerSource: textValue(data, 'referrerSource', textValue(data, 'referrer', 'direct')),
        country: textValue(data, 'country', 'ZZ'),
        views: numberValue(data, 'views'),
        timeMs: numberValue(data, 'timeMs'),
        lastSeenAt: lastSeenAt?.toMillis?.() ?? null,
      };
    }),
    countries,
    trafficSources,
    partial: false,
  };
};

const mergeRows = (
  groups: Array<Array<Record<string, any>>>,
  keyField: string,
  numberFields: string[],
) => {
  const merged = new Map<string, Record<string, any>>();
  groups.flat().forEach((row) => {
    const key = String(row[keyField] ?? '');
    if (!key) return;
    const current = merged.get(key) || { ...row };
    if (merged.has(key)) {
      numberFields.forEach((field) => {
        current[field] = Number(current[field] || 0) + Number(row[field] || 0);
      });
      Object.entries(row).forEach(([field, value]) => {
        if (!numberFields.includes(field) && (current[field] == null || current[field] === '')) {
          current[field] = value;
        }
      });
    }
    merged.set(key, current);
  });
  return [...merged.values()];
};

const buildMetrics = async (options: {
  start: string;
  end: string;
  allTime: boolean;
  hourly: boolean;
}): Promise<DashboardResponse> => {
  const withTimeout = (database: Firestore) => new Promise<DashboardResponse>((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Analytics database read timed out.')),
      DATABASE_READ_TIMEOUT_MS,
    );
    buildMetricsForDatabase(database, options).then(
      (result) => {
        clearTimeout(timeout);
        resolve(result);
      },
      (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
  const settled = await Promise.allSettled(
    firestoreDatabases().map(withTimeout),
  );
  const results = settled
    .filter((result): result is PromiseFulfilledResult<DashboardResponse> => result.status === 'fulfilled')
    .map((result) => result.value);
  if (results.length === 0) {
    const failure = settled.find((result): result is PromiseRejectedResult => result.status === 'rejected');
    throw failure?.reason ?? new Error('No analytics database was available.');
  }
  const dailyFields = [
    'views', 'visitors', 'newVisitors', 'sessions', 'timeMs',
    'deviceMobile', 'deviceTablet', 'deviceDesktop',
    'refDirect', 'refSearch', 'refSocial', 'refOther',
  ];
  const daily = mergeRows(results.map((row) => row.daily), 'date', dailyFields)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const hourly = mergeRows(results.map((row) => row.hourly), 'hour', ['views', 'sessions', 'timeMs'])
    .sort((a, b) => Number(a.hour) - Number(b.hour));
  const pages = mergeRows(results.map((row) => row.pages), 'path', ['views', 'visitors', 'timeMs'])
    .sort((a, b) => Number(b.views) - Number(a.views));
  const countries = mergeRows(results.map((row) => row.countries), 'country', ['sessions', 'views'])
    .sort((a, b) => Number(b.sessions) - Number(a.sessions) || Number(b.views) - Number(a.views));
  const trafficSources = mergeRows(
    results.map((row) => row.trafficSources.map((source) => ({
      ...source,
      mergeKey: `${source.category}:${source.source}`,
    }))),
    'mergeKey',
    ['sessions'],
  ).map(({ mergeKey: _mergeKey, ...row }) => row)
    .sort((a, b) => Number(b.sessions) - Number(a.sessions));

  const liveById = new Map<string, Record<string, string | number | null>>();
  results.flatMap((row) => row.live).forEach((session) => {
    const id = String(session.id || '');
    if (!id) return;
    const current = liveById.get(id);
    if (!current) {
      liveById.set(id, { ...session });
      return;
    }
    current.views = Number(current.views || 0) + Number(session.views || 0);
    current.timeMs = Number(current.timeMs || 0) + Number(session.timeMs || 0);
    if (Number(session.lastSeenAt || 0) > Number(current.lastSeenAt || 0)) {
      Object.assign(current, session, { views: current.views, timeMs: current.timeMs });
    }
  });

  return {
    daily,
    hourly,
    pages,
    pagesTruncated: results.some((row) => row.pagesTruncated),
    live: [...liveById.values()].sort(
      (a, b) => Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0),
    ).slice(0, 50),
    countries,
    trafficSources,
    partial: results.length < firestoreDatabases().length,
  };
};

export default async function dashboardMetricsHandler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const start = String(firstQueryValue(req.query?.start) || '');
  const end = String(firstQueryValue(req.query?.end) || '');
  const allTime = firstQueryValue(req.query?.allTime) === 'true';
  const hourly = firstQueryValue(req.query?.hourly) === 'true';
  if (!DATE_KEY.test(start) || !DATE_KEY.test(end) || start > end) {
    res.status(400).json({ error: 'Use a valid start and end date.' });
    return;
  }

  const cacheKey = `${start}:${end}:${allTime}:${hourly}`;
  const now = Date.now();
  const cached = memoryCache.get(cacheKey);
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader('CDN-Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  if (cached && cached.expiresAt > now) {
    res.setHeader('X-Metrics-Cache', 'HIT');
    res.status(200).json(cached.value);
    return;
  }

  try {
    const value = await buildMetrics({ start, end, allTime, hourly });
    if (memoryCache.size >= 30) {
      const oldestKey = memoryCache.keys().next().value;
      if (oldestKey) memoryCache.delete(oldestKey);
    }
    memoryCache.set(cacheKey, { value, expiresAt: now + CACHE_MS });
    res.setHeader('X-Metrics-Cache', 'MISS');
    res.status(200).json(value);
  } catch (error) {
    console.error('Dashboard metrics API failed', error);
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ error: 'Metrics unavailable' });
  }
}
