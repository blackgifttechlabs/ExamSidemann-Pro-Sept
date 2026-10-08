import { trackPwaEvent } from './analytics';

interface InstallChoice {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

const PENDING_KEY = 'exam-sidemann-pwa-pending-install';
/** Asks the install card to open (also used for the iOS "Add to Home Screen" help). */
export const SHOW_INSTALL_EVENT = 'examsidemann:show-install';

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let started = false;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/** Captures the browser's install event as early as possible, for any component to use. */
export const initPwaInstall = () => {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notify();
  });
};

export const getInstallPrompt = () => deferredPrompt;

export const subscribeInstall = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const isRunningStandalone = () => {
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true;
};

export const isIosDevice = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export const hasPendingInstall = () => {
  try { return localStorage.getItem(PENDING_KEY) === '1'; } catch { return false; }
};

export const setPendingInstall = (pending: boolean) => {
  try {
    if (pending) localStorage.setItem(PENDING_KEY, '1');
    else localStorage.removeItem(PENDING_KEY);
  } catch { /* optional */ }
};

/**
 * Shows the browser's install dialog. Returns 'unavailable' when there is no
 * install event yet, or the browser refused because there was no recent tap.
 */
export const runInstall = async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
  const prompt = deferredPrompt;
  if (!prompt) return 'unavailable';
  try {
    await prompt.prompt();
  } catch {
    return 'unavailable';
  }
  const choice = await prompt.userChoice;
  deferredPrompt = null;
  notify();
  void trackPwaEvent(choice.outcome === 'accepted' ? 'prompt_accepted' : 'prompt_dismissed');
  return choice.outcome;
};

/**
 * The "Download app" entry point. Signed-out visitors are sent to the login
 * screen first and the install resumes once they are signed in.
 */
export const requestInstall = async (signedIn: boolean) => {
  if (!signedIn) {
    setPendingInstall(true);
    window.dispatchEvent(new CustomEvent('examsidemann:request-login', {
      detail: { returnTo: window.location.pathname, reason: 'install' },
    }));
    return;
  }
  const result = await runInstall();
  if (result === 'unavailable') window.dispatchEvent(new Event(SHOW_INSTALL_EVENT));
};
