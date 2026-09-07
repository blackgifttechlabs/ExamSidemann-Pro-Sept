export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  advertising: boolean;
  decidedAt: string;
  version: 1;
};

export type OptionalConsentCategory = 'analytics' | 'advertising';

export const CONSENT_CHANGED_EVENT = 'exam-sidemann:consent-changed';
export const CONSENT_OPEN_EVENT = 'exam-sidemann:consent-open';

const CONSENT_STORAGE_KEY = 'exam-sidemann:privacy-consent:v1';
const ADSENSE_SCRIPT_ID = 'exam-sidemann-adsense';
const ANALYTICS_SCRIPT_ID = 'exam-sidemann-google-analytics';
const DEFAULT_ADSENSE_CLIENT = 'ca-pub-1348757097125886';
const DEFAULT_ANALYTICS_ID = 'G-BXQF9X9T0Y';

const env = (import.meta as any).env as Record<string, string | undefined> | undefined;

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const isConsentPreferences = (value: unknown): value is ConsentPreferences => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<ConsentPreferences>;
  return (
    candidate.necessary === true &&
    typeof candidate.analytics === 'boolean' &&
    typeof candidate.advertising === 'boolean' &&
    typeof candidate.decidedAt === 'string' &&
    candidate.version === 1
  );
};

export const createConsentPreferences = (
  choices: Pick<ConsentPreferences, 'analytics' | 'advertising'>,
): ConsentPreferences => ({
  necessary: true,
  analytics: choices.analytics,
  advertising: choices.advertising,
  decidedAt: new Date().toISOString(),
  version: 1,
});

export const getConsentPreferences = (): ConsentPreferences | null => {
  if (!isBrowser()) return null;

  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);
    return isConsentPreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const hasConsent = (category: OptionalConsentCategory): boolean =>
  getConsentPreferences()?.[category] === true;

const ensureGtag = () => {
  if (!isBrowser()) return null;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: unknown[]) => {
      window.dataLayer?.push(args);
    });

  return window.gtag;
};

const getAnalyticsId = () =>
  env?.VITE_GOOGLE_ANALYTICS_ID?.trim() || DEFAULT_ANALYTICS_ID;

export const isAdSenseEnabled = () =>
  env?.VITE_ENABLE_ADSENSE?.trim().toLowerCase() === 'true';

export const getAdSenseClient = () =>
  env?.VITE_ADSENSE_CLIENT?.trim() || DEFAULT_ADSENSE_CLIENT;

export const updateGoogleConsentMode = (preferences: ConsentPreferences | null) => {
  const gtag = ensureGtag();
  if (!gtag) return;

  const consent = {
    analytics_storage: preferences?.analytics ? 'granted' : 'denied',
    ad_storage: preferences?.advertising ? 'granted' : 'denied',
    ad_user_data: preferences?.advertising ? 'granted' : 'denied',
    ad_personalization: preferences?.advertising ? 'granted' : 'denied',
  };

  gtag('consent', preferences ? 'update' : 'default', consent);

  const analyticsId = getAnalyticsId();
  (window as unknown as Record<string, unknown>)[`ga-disable-${analyticsId}`] =
    !preferences?.analytics;
};

let analyticsLoadPromise: Promise<boolean> | null = null;

export const loadGoogleAnalyticsIfAllowed = (
  preferences = getConsentPreferences(),
): Promise<boolean> => {
  if (!isBrowser() || preferences?.analytics !== true) {
    return Promise.resolve(false);
  }

  updateGoogleConsentMode(preferences);

  const analyticsId = getAnalyticsId();
  const existing = document.getElementById(ANALYTICS_SCRIPT_ID) as HTMLScriptElement | null;
  const gtag = ensureGtag();

  if (existing) {
    return Promise.resolve(true);
  }

  if (analyticsLoadPromise) return analyticsLoadPromise;

  gtag?.('js', new Date());
  gtag?.('config', analyticsId, {
    anonymize_ip: true,
    send_page_view: true,
  });

  analyticsLoadPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.id = ANALYTICS_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    script.onload = () => resolve(true);
    script.onerror = () => {
      script.remove();
      analyticsLoadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return analyticsLoadPromise;
};

let adSenseLoadPromise: Promise<boolean> | null = null;

export const loadAdSenseIfAllowed = (
  adClient = getAdSenseClient(),
): Promise<boolean> => {
  if (!isBrowser() || !isAdSenseEnabled() || !hasConsent('advertising')) {
    return Promise.resolve(false);
  }

  const existing = document.getElementById(ADSENSE_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) return Promise.resolve(true);
  if (adSenseLoadPromise) return adSenseLoadPromise;

  adSenseLoadPromise = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src =
      `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adClient)}`;
    script.onload = () => resolve(true);
    script.onerror = () => {
      script.remove();
      adSenseLoadPromise = null;
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return adSenseLoadPromise;
};

export const applyConsentPreferences = (preferences: ConsentPreferences | null) => {
  updateGoogleConsentMode(preferences);
  if (preferences?.analytics) {
    void loadGoogleAnalyticsIfAllowed(preferences);
  }
};

export const saveConsentPreferences = (preferences: ConsentPreferences) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // The in-memory event still applies the choice for the current page.
  }

  applyConsentPreferences(preferences);
  window.dispatchEvent(
    new CustomEvent<ConsentPreferences>(CONSENT_CHANGED_EVENT, { detail: preferences }),
  );
};

export const openConsentPreferences = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};

