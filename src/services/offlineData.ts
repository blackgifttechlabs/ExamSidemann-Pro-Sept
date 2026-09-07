import { collection, doc, getDoc, getDocs, limit, query } from 'firebase/firestore';
import { analyticsDatabases, db } from './firebase';

const USER_WARM_KEY = 'exam-sidemann:offline-user-warm';
const ADMIN_WARM_KEY = 'exam-sidemann:offline-admin-warm';
const REFRESH_AFTER_MS = 6 * 60 * 60 * 1_000;
const ADMIN_COLLECTION_LIMIT = 5_000;

const shouldRefresh = (key: string, identity: string) => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}') as { identity?: string; at?: number };
    return stored.identity !== identity || typeof stored.at !== 'number' || Date.now() - stored.at > REFRESH_AFTER_MS;
  } catch {
    return true;
  }
};

const rememberRefresh = (key: string, identity: string) => {
  try { localStorage.setItem(key, JSON.stringify({ identity, at: Date.now() })); } catch { /* optional */ }
};

/** Persist the account profile, saved notes/resources and quiz history. */
export const warmUserDataForOffline = async (uid: string) => {
  if (!uid || !shouldRefresh(USER_WARM_KEY, uid)) return;
  const results = await Promise.allSettled([
    getDoc(doc(db, 'users', uid)),
    getDocs(collection(db, 'users', uid, 'resources')),
    getDocs(collection(db, 'users', uid, 'quizHistory')),
  ]);
  if (results.every((result) => result.status === 'fulfilled')) rememberRefresh(USER_WARM_KEY, uid);
};

const ADMIN_ANALYTICS_COLLECTIONS = [
  'analytics_daily',
  'analytics_page_daily',
  'analytics_pages',
  'analytics_experiment_daily',
  'analytics_experiments',
  'analytics_geo_daily',
  'analytics_source_daily',
  'analytics_sessions',
  'analytics_page_visits',
] as const;

/** Cache the retained analytics dataset after an administrator opens Admin. */
export const warmAdminAnalyticsForOffline = async () => {
  if (!shouldRefresh(ADMIN_WARM_KEY, 'admin')) return;
  const results = await Promise.allSettled(
    analyticsDatabases.flatMap((database) =>
      ADMIN_ANALYTICS_COLLECTIONS.map((name) =>
        getDocs(query(collection(database, name), limit(ADMIN_COLLECTION_LIMIT))),
      ),
    ),
  );
  // Do not mark a rejected non-admin attempt as complete; a real administrator
  // on the same device must still be allowed to populate the protected rows.
  if (results.some((result) => result.status === 'fulfilled')) rememberRefresh(ADMIN_WARM_KEY, 'admin');
};
