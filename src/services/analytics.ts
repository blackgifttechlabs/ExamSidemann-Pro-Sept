/**
 * First-party page analytics.
 *
 * Every visit is folded into pre-aggregated counter documents rather than one
 * row per hit: a dashboard that asks "how many visits last month" then reads a
 * few dozen small documents instead of tens of thousands of events, and there
 * is no raw log of individual people to look after.
 *
 * Six collections, all written with `increment()` so concurrent visitors never
 * clobber each other:
 *
 *   analytics_daily/{YYYY-MM-DD}          site totals for one day
 *   analytics_hourly/{day__HH}            site totals for one hour
 *   analytics_page_daily/{day__path}      one page on one day (date filters)
 *   analytics_pages/{path}                one page, all time (most-visited)
 *   analytics_geo_daily/{day__country}    country totals for one day
 *   analytics_source_daily/{day__source}  exact referrer totals for one day
 *   analytics_sessions/{sessionId}        one visit, for "active now" + feed
 *
 * Aggregate documents never contain IP addresses, account ids or user-agent
 * strings. Consent-aware visit-detail documents use pseudonymous random ids
 * and may contain browser-provided coordinates only after the visitor accepts
 * analytics and grants the browser location permission. Those detail rows are
 * admin-only and expire on the same 90-day schedule as sessions.
 */

import { doc, increment, serverTimestamp, setDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { writeAnalyticsWithFailover } from './firebase';
import { hasConsent } from '../features/privacy/privacyConsent';

/**
 * Days are bucketed in Zimbabwean local time, not the visitor's timezone and
 * not UTC, so "today" on the dashboard means the same thing for every reader.
 */
const DAY_TIMEZONE = 'Africa/Harare';

const VISITOR_STORAGE_KEY = 'exam-sidemann:analytics:visitor';
const SESSION_STORAGE_KEY = 'exam-sidemann:analytics:session';
const SEEN_STORAGE_KEY = 'exam-sidemann:analytics:seen';
const EXPERIMENT_HISTORY_KEY = 'exam-sidemann:analytics:experiment-history';
const PRECISE_LOCATION_KEY = 'exam-sidemann:analytics:precise-location';

/** Engaged time is sampled rather than measured off wall-clock deltas. */
const TICK_MS = 15_000;
/** No interaction for this long and the tab stops counting as "being read". */
const IDLE_MS = 90_000;
/** Buffered engagement is written out once it reaches this much. */
const FLUSH_AT_MS = 60_000;
/** A session is "active now" if it was seen within this window. */
export const ACTIVE_WINDOW_MS = 5 * 60_000;
/** Session documents are disposable; set a Firestore TTL policy on expiresAt. */
const SESSION_TTL_DAYS = 90;

export type DeviceKind = 'mobile' | 'tablet' | 'desktop';
export type ReferrerKind = 'direct' | 'search' | 'social' | 'other';
export type DetailedReferrer = { kind: ReferrerKind; source: string };

export type DailyStats = {
  date: string;
  views: number;
  visitors: number;
  newVisitors: number;
  sessions: number;
  timeMs: number;
  deviceMobile: number;
  deviceTablet: number;
  deviceDesktop: number;
  refDirect: number;
  refSearch: number;
  refSocial: number;
  refOther: number;
};

export type PageStats = {
  path: string;
  title: string;
  views: number;
  visitors: number;
  timeMs: number;
};

type LocationStatus = 'pending' | 'granted' | 'denied' | 'unavailable' | 'not-consented';

type PreciseLocation = {
  latitude: number;
  longitude: number;
  accuracy: number;
  placeName: string;
  formattedAddress: string;
  province: string;
  district: string;
  locality: string;
};

type LocationResult = { status: LocationStatus; location?: PreciseLocation };

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const dayFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: DAY_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const hourFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: DAY_TIMEZONE,
  hour: '2-digit',
  hourCycle: 'h23',
});

/** `YYYY-MM-DD` in Harare time — the document id of a day bucket. */
export const dayKey = (date: Date = new Date()) => dayFormatter.format(date);

/** The day bucket `offset` days before today (negative offsets go forward). */
export const dayKeyBefore = (offset: number, from: Date = new Date()) =>
  dayKey(new Date(from.getTime() - offset * 86_400_000));

/** Numeric hour in Harare time, used by the small per-hour dashboard buckets. */
export const hourKey = (date: Date = new Date()) => Number(hourFormatter.format(date));

const randomId = () => {
  const cryptoObj = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID().replace(/-/g, '').slice(0, 20);
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Visitor-scoped storage follows the consent choice: a persistent id only for
 * visitors who accepted analytics, a tab-scoped one for everybody else. Either
 * way the counters are written — only the memory of who has already been
 * counted today changes.
 */
const visitorStore = (): Storage | null => {
  if (!isBrowser()) return null;
  try {
    return hasConsent('analytics') ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
};

const readStore = (store: Storage | null, key: string) => {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
};

const writeStore = (store: Storage | null, key: string, value: string) => {
  try {
    store?.setItem(key, value);
  } catch {
    /* Private browsing or a full quota: counting still works, de-duping does not. */
  }
};

/** Path → document id. Firestore ids cannot contain `/`, so slashes become `~`. */
export const pathToDocId = (path: string) =>
  (path === '/' ? '~home' : path.replace(/\//g, '~')).slice(0, 400);

/** Document id → path, for rendering a stored key back as a URL. */
export const docIdToPath = (id: string) => (id === '~home' ? '/' : id.replace(/~/g, '/'));

const LONG_ID = /^[A-Za-z0-9_-]{18,}$/;
const NUMERIC_ID = /^\d{3,}$/;

/**
 * Collapses the identifier out of routes like `/news/article/xKq93…` so a
 * hundred article ids do not become a hundred rows in the page report. Human
 * slugs (`/schools/search/high`) are kept — they are the page, not an id.
 */
export const normalizePath = (rawPath: string) => {
  const [withoutHash] = rawPath.split('#');
  const [withoutQuery] = withoutHash.split('?');
  const segments = withoutQuery.split('/').filter(Boolean);
  if (segments.length === 0) return '/';

  const normalized = segments.map((segment) =>
    LONG_ID.test(segment) || NUMERIC_ID.test(segment) ? ':id' : segment.toLowerCase(),
  );
  return `/${normalized.join('/')}`.slice(0, 300);
};

/** Device and source are flat counter fields so the rules can bound each one. */
const DEVICE_FIELD: Record<DeviceKind, keyof DailyStats> = {
  mobile: 'deviceMobile',
  tablet: 'deviceTablet',
  desktop: 'deviceDesktop',
};

const REFERRER_FIELD: Record<ReferrerKind, keyof DailyStats> = {
  direct: 'refDirect',
  search: 'refSearch',
  social: 'refSocial',
  other: 'refOther',
};

const detectDevice = (): DeviceKind => {
  const ua = navigator.userAgent || '';
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) {
    return 'tablet';
  }
  if (/Mobi|iPhone|iPod|Android|BlackBerry|Opera Mini|IEMobile/i.test(ua)) return 'mobile';
  return 'desktop';
};

/*
 * Country comes from the browser's own timezone, which costs nothing and sends
 * no visitor data anywhere. It is accurate at country level and wrong only for
 * the rare traveller or VPN user. Anything not on this list is counted as ZZ
 * ("Elsewhere") rather than guessed at — the list leans on the countries this
 * site actually serves.
 */
const TIMEZONE_COUNTRY: Record<string, string> = {
  'Africa/Harare': 'ZW',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lusaka': 'ZM',
  'Africa/Gaborone': 'BW',
  'Africa/Maputo': 'MZ',
  'Africa/Windhoek': 'NA',
  'Africa/Blantyre': 'MW',
  'Africa/Lilongwe': 'MW',
  'Africa/Nairobi': 'KE',
  'Africa/Dar_es_Salaam': 'TZ',
  'Africa/Kampala': 'UG',
  'Africa/Kigali': 'RW',
  'Africa/Lagos': 'NG',
  'Africa/Accra': 'GH',
  'Africa/Abidjan': 'CI',
  'Africa/Dakar': 'SN',
  'Africa/Cairo': 'EG',
  'Africa/Algiers': 'DZ',
  'Africa/Casablanca': 'MA',
  'Africa/Tunis': 'TN',
  'Africa/Addis_Ababa': 'ET',
  'Africa/Khartoum': 'SD',
  'Africa/Luanda': 'AO',
  'Africa/Kinshasa': 'CD',
  'Africa/Lubumbashi': 'CD',
  'Africa/Maseru': 'LS',
  'Africa/Mbabane': 'SZ',
  'Indian/Mauritius': 'MU',
  'Europe/London': 'GB',
  'Europe/Dublin': 'IE',
  'Europe/Lisbon': 'PT',
  'Europe/Madrid': 'ES',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Warsaw': 'PL',
  'Europe/Moscow': 'RU',
  'Europe/Istanbul': 'TR',
  'America/New_York': 'US',
  'America/Detroit': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Phoenix': 'US',
  'America/Los_Angeles': 'US',
  'America/Anchorage': 'US',
  'Pacific/Honolulu': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Edmonton': 'CA',
  'America/Winnipeg': 'CA',
  'America/Mexico_City': 'MX',
  'America/Sao_Paulo': 'BR',
  'America/Argentina/Buenos_Aires': 'AR',
  'America/Bogota': 'CO',
  'America/Lima': 'PE',
  'America/Santiago': 'CL',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Qatar': 'QA',
  'Asia/Kuwait': 'KW',
  'Asia/Jerusalem': 'IL',
  'Asia/Karachi': 'PK',
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Asia/Colombo': 'LK',
  'Asia/Dhaka': 'BD',
  'Asia/Bangkok': 'TH',
  'Asia/Jakarta': 'ID',
  'Asia/Singapore': 'SG',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Manila': 'PH',
  'Asia/Hong_Kong': 'HK',
  'Asia/Shanghai': 'CN',
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Pacific/Auckland': 'NZ',
};

/** ISO-3166 alpha-2, or `ZZ` when the timezone is not one we recognise. */
export const detectCountry = (): string => {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return TIMEZONE_COUNTRY[zone] ?? 'ZZ';
  } catch {
    return 'ZZ';
  }
};

const reverseGeocode = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`,
      { headers: { Accept: 'application/json' } },
    );
    if (!response.ok) throw new Error(`OpenStreetMap geocoding returned ${response.status}`);
    const payload = await response.json() as {
      name?: string;
      display_name?: string;
      address?: Record<string, string | undefined>;
    };
    const address = payload.address ?? {};
    const locality = address.city || address.town || address.village || address.suburb || address.hamlet || '';
    return {
      placeName: (payload.name || address.amenity || address.building || address.road || locality).slice(0, 160),
      formattedAddress: (payload.display_name || '').slice(0, 300),
      province: (address.state || address.province || address.region || '').slice(0, 160),
      district: (address.county || address.state_district || address.district || '').slice(0, 160),
      locality,
    };
  } catch (error) {
    console.debug('analytics: reverse geocoding unavailable', error);
    return { placeName: '', formattedAddress: '', province: '', district: '', locality: '' };
  }
};

let locationPromise: Promise<LocationResult> | null = null;

/**
 * Requests location only for visitors who accepted analytics. The browser
 * remains the permission boundary; denial is recorded as a status, never
 * worked around with IP-based tracking.
 */
const getPreciseLocation = (): Promise<LocationResult> => {
  if (!hasConsent('analytics')) return Promise.resolve({ status: 'not-consented' });
  if (!navigator.geolocation) return Promise.resolve({ status: 'unavailable' });
  if (locationPromise) return locationPromise;

  try {
    const cached = window.sessionStorage.getItem(PRECISE_LOCATION_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as PreciseLocation & { capturedAt?: number };
      if (
        Number.isFinite(parsed.latitude) && Number.isFinite(parsed.longitude) &&
        typeof parsed.capturedAt === 'number' && Date.now() - parsed.capturedAt < 30 * 60_000
      ) {
        return Promise.resolve({ status: 'granted', location: parsed });
      }
    }
  } catch {
    /* A private tab may not expose sessionStorage; permission can still work. */
  }

  locationPromise = new Promise<LocationResult>((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        void reverseGeocode(latitude, longitude).then((address) => {
          const location: PreciseLocation & { capturedAt: number } = {
            latitude,
            longitude,
            accuracy: Math.max(0, Math.round(accuracy || 0)),
            ...address,
            capturedAt: Date.now(),
          };
          try {
            window.sessionStorage.setItem(PRECISE_LOCATION_KEY, JSON.stringify(location));
          } catch {
            /* Keep the in-memory result when storage is unavailable. */
          }
          resolve({ status: 'granted', location });
        });
      },
      (error) => resolve({ status: error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable' }),
      { enableHighAccuracy: true, timeout: 8_000, maximumAge: 15 * 60_000 },
    );
  });

  return locationPromise;
};

/**
 * Called directly from the Accept button so the browser permission sheet opens
 * as part of the user's click. The result is reused by page analytics and is
 * never requested when analytics consent is off.
 */
export const requestAnalyticsLocationPermission = (): Promise<LocationResult> =>
  getPreciseLocation();

const SEARCH_SOURCES: { source: string; host: RegExp }[] = [
  { source: 'google', host: /(^|\.)google\.[a-z.]+$/i },
  { source: 'bing', host: /(^|\.)bing\.com$/i },
  { source: 'yahoo', host: /(^|\.)search\.yahoo\.[a-z.]+$/i },
  { source: 'duckduckgo', host: /(^|\.)duckduckgo\.com$/i },
  { source: 'yandex', host: /(^|\.)yandex\.[a-z.]+$/i },
  { source: 'baidu', host: /(^|\.)baidu\.com$/i },
  { source: 'ecosia', host: /(^|\.)ecosia\.org$/i },
  { source: 'brave-search', host: /(^|\.)search\.brave\.com$/i },
];

const SOCIAL_SOURCES: { source: string; host: RegExp }[] = [
  { source: 'whatsapp', host: /(^|\.)(whatsapp\.com|wa\.me)$/i },
  { source: 'facebook', host: /(^|\.)(facebook\.com|fb\.com|fb\.me)$/i },
  { source: 'instagram', host: /(^|\.)instagram\.com$/i },
  { source: 'x-twitter', host: /(^|\.)(twitter\.com|x\.com|t\.co)$/i },
  { source: 'tiktok', host: /(^|\.)tiktok\.com$/i },
  { source: 'linkedin', host: /(^|\.)linkedin\.com$/i },
  { source: 'youtube', host: /(^|\.)(youtube\.com|youtu\.be)$/i },
  { source: 'telegram', host: /(^|\.)(telegram\.org|t\.me)$/i },
  { source: 'reddit', host: /(^|\.)reddit\.com$/i },
  { source: 'pinterest', host: /(^|\.)pinterest\.[a-z.]+$/i },
  { source: 'threads', host: /(^|\.)threads\.net$/i },
  { source: 'snapchat', host: /(^|\.)snapchat\.com$/i },
];

/**
 * Stores only a service name or hostname — never the referring URL/path, which
 * can contain search terms or other private information.
 */
const detectReferrer = (): DetailedReferrer => {
  const referrer = document.referrer;
  if (!referrer) return { kind: 'direct', source: 'direct' };
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '').slice(0, 120);
    if (host === window.location.hostname.toLowerCase().replace(/^www\./, '')) {
      return { kind: 'direct', source: 'direct' };
    }

    const search = SEARCH_SOURCES.find((item) => item.host.test(host));
    if (search) return { kind: 'search', source: search.source };

    const social = SOCIAL_SOURCES.find((item) => item.host.test(host));
    if (social) return { kind: 'social', source: social.source };

    // URL.hostname is already stripped of paths, queries, credentials and ports.
    const safeHost = /^[a-z0-9][a-z0-9.-]{0,119}$/.test(host) ? host : 'unknown-website';
    return { kind: 'other', source: safeHost };
  } catch {
    return { kind: 'other', source: 'unknown-website' };
  }
};

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|monitor|pingdom/i;

/** Routes that describe the tool rather than the audience are not measured. */
const UNTRACKED_PREFIXES = ['/admin'];

const isTrackablePath = (path: string) =>
  !UNTRACKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));

let analyticsDisabled = false;

const canTrack = () => {
  if (!isBrowser() || analyticsDisabled) return false;
  if (navigator.webdriver) return false;
  if (BOT_UA.test(navigator.userAgent || '')) return false;
  return true;
};

type SeenRecord = { date: string; visitor: boolean; paths: string[] };

type ExperimentHistory = Record<string, number>;

const readExperimentHistory = (): ExperimentHistory => {
  const raw = readStore(visitorStore(), EXPERIMENT_HISTORY_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as ExperimentHistory;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeExperimentHistory = (history: ExperimentHistory) => {
  const entries = Object.entries(history).slice(-500);
  writeStore(visitorStore(), EXPERIMENT_HISTORY_KEY, JSON.stringify(Object.fromEntries(entries)));
};

/** Category pages have three path segments; playable experiments have four or more. */
const isExperimentPath = (path: string) =>
  path.startsWith('/practicals/') && path.split('/').filter(Boolean).length >= 4;

const readSeen = (): SeenRecord => {
  const today = dayKey();
  const raw = readStore(visitorStore(), SEEN_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as SeenRecord;
      if (parsed?.date === today && Array.isArray(parsed.paths)) return parsed;
    } catch {
      /* Fall through to a fresh record. */
    }
  }
  return { date: today, visitor: false, paths: [] };
};

const writeSeen = (record: SeenRecord) => {
  writeStore(visitorStore(), SEEN_STORAGE_KEY, JSON.stringify(record));
};

type VisitorState = { id: string; isNew: boolean };

const getVisitor = (): VisitorState => {
  const store = visitorStore();
  const existing = readStore(store, VISITOR_STORAGE_KEY);
  if (existing) return { id: existing, isNew: false };
  const id = randomId();
  writeStore(store, VISITOR_STORAGE_KEY, id);
  return { id, isNew: true };
};

type SessionState = { id: string; isNew: boolean };

const getSession = (): SessionState => {
  try {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return { id: existing, isNew: false };
    const id = randomId();
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return { id, isNew: true };
  } catch {
    return { id: randomId(), isNew: true };
  }
};

type Engagement = { path: string; title: string; pendingMs: number; visitId?: string };
type ActiveDetailedVisit = { id: string };

let engagement: Engagement | null = null;
let activeDetailedVisit: ActiveDetailedVisit | null = null;
let lastActivityAt = Date.now();
let tickTimer: ReturnType<typeof setInterval> | null = null;
let listenersBound = false;

const markActivity = () => {
  lastActivityAt = Date.now();
};

const updateDetailedVisit = async (visitId: string, fields: Record<string, unknown>) => {
  try {
    await writeAnalyticsWithFailover((database) =>
      setDoc(
        doc(database, 'analytics_page_visits', visitId),
        { ...fields, updatedAt: serverTimestamp() },
        { merge: true },
      ),
    );
  } catch (error) {
    // Keep raw-detail failures isolated from the aggregate counters. This also
    // lets the site keep counting while updated Firestore rules are deploying.
    console.debug('analytics: detailed visit update failed', error);
  }
};

const openDetailedVisit = async ({
  id,
  day,
  path,
  title,
  visitor,
  session,
  device,
  country,
}: {
  id: string;
  day: string;
  path: string;
  title: string;
  visitor: VisitorState;
  session: SessionState;
  device: DeviceKind;
  country: string;
}) => {
  activeDetailedVisit = { id };
  try {
    await writeAnalyticsWithFailover((database) =>
      setDoc(doc(database, 'analytics_page_visits', id), {
        date: day,
        path,
        title,
        visitorId: visitor.id,
        sessionId: session.id,
        isNewVisitor: visitor.isNew,
        device,
        country,
        openedAt: serverTimestamp(),
        lastSeenAt: serverTimestamp(),
        durationMs: 0,
        locationStatus: 'pending',
        expiresAt: Timestamp.fromMillis(Date.now() + SESSION_TTL_DAYS * 86_400_000),
        updatedAt: serverTimestamp(),
      }),
    );
  } catch (error) {
    console.debug('analytics: detailed visit was not opened', error);
    return;
  }

  void getPreciseLocation().then((result) => {
    if (result.status !== 'granted' || !result.location) {
      return updateDetailedVisit(id, { locationStatus: result.status });
    }
    const location = result.location;
    return updateDetailedVisit(id, {
      locationStatus: 'granted',
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
      placeName: location.placeName,
      formattedAddress: location.formattedAddress,
      province: location.province,
      district: location.district,
      locality: location.locality,
    });
  });
};

const closeDetailedVisit = async (exitType: 'navigation' | 'pagehide' | 'untracked') => {
  const current = activeDetailedVisit;
  activeDetailedVisit = null;
  if (!current) return;
  await updateDetailedVisit(current.id, {
    closedAt: serverTimestamp(),
    lastSeenAt: serverTimestamp(),
    exitType,
  });
};

/**
 * Writes buffered engaged time against the page it was spent on. Called on
 * navigation, when the tab is hidden, and whenever a minute has piled up — so
 * a visitor who closes the tab loses at most the last unflushed minute.
 */
const flushEngagement = async () => {
  if (!engagement || engagement.pendingMs <= 0) return;
  const { path, title, pendingMs, visitId } = engagement;
  engagement.pendingMs = 0;

  const day = dayKey();
  const hour = hourKey();
  const session = getSession();

  try {
    await writeAnalyticsWithFailover(async (database) => {
      const batch = writeBatch(database);
      batch.set(
        doc(database, 'analytics_daily', day),
        { date: day, timeMs: increment(pendingMs), updatedAt: serverTimestamp() },
        { merge: true },
      );
      batch.set(
        doc(database, 'analytics_hourly', `${day}__${String(hour).padStart(2, '0')}`),
        { date: day, hour, timeMs: increment(pendingMs), updatedAt: serverTimestamp() },
        { merge: true },
      );
      batch.set(
        doc(database, 'analytics_page_daily', `${day}__${pathToDocId(path)}`),
        { date: day, path, title, timeMs: increment(pendingMs), updatedAt: serverTimestamp() },
        { merge: true },
      );
      batch.set(
        doc(database, 'analytics_pages', pathToDocId(path)),
        { path, title, timeMs: increment(pendingMs), updatedAt: serverTimestamp() },
        { merge: true },
      );
      if (isExperimentPath(path)) {
        batch.set(
          doc(database, 'analytics_experiment_daily', `${day}__${pathToDocId(path)}`),
          { date: day, path, title, timeMs: increment(pendingMs), updatedAt: serverTimestamp() },
          { merge: true },
        );
        batch.set(
          doc(database, 'analytics_experiments', pathToDocId(path)),
          { path, title, timeMs: increment(pendingMs), updatedAt: serverTimestamp() },
          { merge: true },
        );
      }
      batch.set(
        doc(database, 'analytics_sessions', session.id),
        { timeMs: increment(pendingMs), lastSeenAt: serverTimestamp() },
        { merge: true },
      );
      await batch.commit();
    });
    if (visitId) {
      await updateDetailedVisit(visitId, {
        durationMs: increment(pendingMs),
        lastSeenAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.debug('analytics: engagement flush failed', error);
  }
};

const finishCurrentPage = async (exitType: 'navigation' | 'pagehide' | 'untracked') => {
  await flushEngagement();
  await closeDetailedVisit(exitType);
};

const tick = () => {
  if (!engagement) return;
  if (document.visibilityState !== 'visible') return;
  if (Date.now() - lastActivityAt > IDLE_MS) return;

  engagement.pendingMs += TICK_MS;
  if (engagement.pendingMs >= FLUSH_AT_MS) void flushEngagement();
};

const trackExperimentButtonClick = async () => {
  if (!engagement || !isExperimentPath(engagement.path) || !canTrack()) return;
  const { path, title } = engagement;
  const day = dayKey();
  try {
    await writeAnalyticsWithFailover(async (database) => {
      const batch = writeBatch(database);
      batch.set(
        doc(database, 'analytics_experiment_daily', `${day}__${pathToDocId(path)}`),
        { date: day, path, title, buttonClicks: increment(1), updatedAt: serverTimestamp() },
        { merge: true },
      );
      batch.set(
        doc(database, 'analytics_experiments', pathToDocId(path)),
        { path, title, buttonClicks: increment(1), updatedAt: serverTimestamp() },
        { merge: true },
      );
      await batch.commit();
    });
  } catch (error) {
    console.debug('analytics: experiment button click not recorded', error);
  }
};

const bindListeners = () => {
  if (listenersBound || !isBrowser()) return;
  listenersBound = true;

  (['pointerdown', 'keydown', 'scroll', 'touchstart'] as const).forEach((event) => {
    window.addEventListener(event, markActivity, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') markActivity();
    else void flushEngagement();
  });

  window.addEventListener('pagehide', () => {
    void finishCurrentPage('pagehide');
  });

  document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('button,[role="button"]') : null;
    if (target) void trackExperimentButtonClick();
  });

  tickTimer = setInterval(tick, TICK_MS);
};

/**
 * Records one page view and starts timing it. Safe to call on every route
 * change; failures are swallowed so a blocked or offline Firestore never
 * surfaces as a broken page.
 */
export const trackPageView = async (rawPath: string, rawTitle?: string) => {
  if (!canTrack()) return;

  const path = normalizePath(rawPath);
  if (!isTrackablePath(path)) {
    // Still bank whatever was read on the previous page before going quiet.
    await finishCurrentPage('untracked');
    engagement = null;
    return;
  }

  await finishCurrentPage('navigation');

  const title = (rawTitle || document.title || path).slice(0, 160);
  const visitId = hasConsent('analytics') ? randomId() : undefined;
  engagement = { path, title, pendingMs: 0, visitId };
  markActivity();
  bindListeners();

  const day = dayKey();
  const hour = hourKey();
  const visitor = getVisitor();
  const session = getSession();
  const seen = readSeen();

  const firstViewToday = !seen.visitor;
  const firstViewOfPageToday = !seen.paths.includes(path);
  writeSeen({
    date: day,
    visitor: true,
    // A cap keeps the record small for someone who browses all afternoon.
    paths: firstViewOfPageToday ? [...seen.paths, path].slice(-300) : seen.paths,
  });

  const device = detectDevice();
  const referrer = detectReferrer();
  const country = detectCountry();
  const experimentHistory = isExperimentPath(path) ? readExperimentHistory() : null;
  const previousExperimentVisits = experimentHistory?.[path] ?? 0;
  if (experimentHistory) {
    experimentHistory[path] = previousExperimentVisits + 1;
    writeExperimentHistory(experimentHistory);
  }

  try {
    await writeAnalyticsWithFailover(async (database) => {
      const batch = writeBatch(database);

    const daily: Record<string, unknown> = {
      date: day,
      views: increment(1),
      updatedAt: serverTimestamp(),
    };
    if (firstViewToday) {
      daily.visitors = increment(1);
      if (visitor.isNew) daily.newVisitors = increment(1);
    }
    if (session.isNew) {
      daily.sessions = increment(1);
      daily[DEVICE_FIELD[device]] = increment(1);
      daily[REFERRER_FIELD[referrer.kind]] = increment(1);
    }
    batch.set(doc(database, 'analytics_daily', day), daily, { merge: true });

    batch.set(
      doc(database, 'analytics_hourly', `${day}__${String(hour).padStart(2, '0')}`),
      {
        date: day,
        hour,
        views: increment(1),
        ...(session.isNew ? { sessions: increment(1) } : {}),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    if (session.isNew && referrer.kind !== 'direct') {
      batch.set(
        doc(database, 'analytics_source_daily', `${day}__${referrer.kind}__${referrer.source}`),
        {
          date: day,
          category: referrer.kind,
          source: referrer.source,
          sessions: increment(1),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    batch.set(
      doc(database, 'analytics_page_daily', `${day}__${pathToDocId(path)}`),
      {
        date: day,
        path,
        title,
        views: increment(1),
        ...(firstViewOfPageToday ? { visitors: increment(1) } : {}),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    batch.set(
      doc(database, 'analytics_pages', pathToDocId(path)),
      { path, title, views: increment(1), lastViewedAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { merge: true },
    );

    if (experimentHistory) {
      const experimentCounters = {
        views: increment(1),
        ...(previousExperimentVisits === 0 ? { newUsers: increment(1) } : {}),
        ...(previousExperimentVisits > 0 && firstViewOfPageToday
          ? { returningUsers: increment(1) }
          : {}),
        ...(previousExperimentVisits > 0 ? { repeatVisits: increment(1) } : {}),
      };
      batch.set(
        doc(database, 'analytics_experiment_daily', `${day}__${pathToDocId(path)}`),
        { date: day, path, title, ...experimentCounters, updatedAt: serverTimestamp() },
        { merge: true },
      );
      batch.set(
        doc(database, 'analytics_experiments', pathToDocId(path)),
        { path, title, ...experimentCounters, updatedAt: serverTimestamp() },
        { merge: true },
      );
    }

    batch.set(
      doc(database, 'analytics_geo_daily', `${day}__${country}`),
      {
        date: day,
        country,
        views: increment(1),
        ...(session.isNew ? { sessions: increment(1) } : {}),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    batch.set(
      doc(database, 'analytics_sessions', session.id),
      {
        date: day,
        path,
        title,
        views: increment(1),
        lastSeenAt: serverTimestamp(),
        expiresAt: Timestamp.fromMillis(Date.now() + SESSION_TTL_DAYS * 86_400_000),
        ...(session.isNew
          ? {
              startedAt: serverTimestamp(),
              landing: path,
              device,
              referrer: referrer.kind,
              referrerSource: referrer.source,
              country,
              timeMs: 0,
            }
          : {}),
      },
      { merge: true },
    );

      await batch.commit();
    });
    if (visitId) {
      await openDetailedVisit({ id: visitId, day, path, title, visitor, session, device, country });
    }
  } catch (error) {
    console.debug('analytics: page view not recorded', error);
  }
};

/** Turns collection off for the rest of the page life (used by tests/tools). */
export const disableAnalytics = () => {
  analyticsDisabled = true;
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = null;
  engagement = null;
  activeDetailedVisit = null;
};

export const formatDuration = (ms: number) => {
  if (!Number.isFinite(ms) || ms <= 0) return '0s';
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};
