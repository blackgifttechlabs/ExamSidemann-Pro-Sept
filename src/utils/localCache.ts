/**
 * Client-Side Local Storage Cache for heavy/frequent database requests.
 * Caches data locally on the user's phone/browser.
 *
 * Serves cached data if:
 * 1. The user returns within a short window (default: 5 minutes / 300,000 ms).
 * 2. The user is offline (!navigator.onLine).
 */

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CacheEnvelope<T> = {
  data: T;
  timestamp: number;
};

export const getCachedData = <T>(
  key: string,
  ttlMs: number = DEFAULT_TTL_MS,
  ignoreTtlIfOffline = true,
): T | null => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const envelope = JSON.parse(raw) as CacheEnvelope<T>;
    if (!envelope || typeof envelope.timestamp !== 'number') {
      return null;
    }

    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    const isFresh = Date.now() - envelope.timestamp < ttlMs;

    if (isFresh || (isOffline && ignoreTtlIfOffline)) {
      return envelope.data;
    }
  } catch (error) {
    console.debug('localCache: read error for key', key, error);
  }

  return null;
};

export const setCachedData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    const envelope: CacheEnvelope<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch (error) {
    console.debug('localCache: write error for key', key, error);
  }
};

export const clearCachedData = (key: string): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.debug('localCache: remove error for key', key, error);
  }
};
