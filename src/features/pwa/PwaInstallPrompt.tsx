import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Share, WifiOff, X } from 'lucide-react';
import { requestPersistentStorage } from '../../services/offlineStorage';
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_OPEN_EVENT,
  getConsentPreferences,
} from '../privacy/privacyConsent';

interface InstallChoice {
  outcome: 'accepted' | 'dismissed';
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

const PROMPT_DELAY_MS = 20_000;
const POST_CONSENT_DELAY_MS = 10_000;
const DISMISSAL_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1_000;
const DISMISSED_AT_KEY = 'exam-sidemann-pwa-dismissed-at';

const isRunningStandalone = () => {
  const standaloneNavigator = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || standaloneNavigator.standalone === true;
};

const isIosDevice = () =>
  /iphone|ipad|ipod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

const wasRecentlyDismissed = () => {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISSED_AT_KEY));
    return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISSAL_COOLDOWN_MS;
  } catch {
    return false;
  }
};

const rememberDismissal = () => {
  try { localStorage.setItem(DISMISSED_AT_KEY, String(Date.now())); } catch { /* optional */ }
};

const clearDismissal = () => {
  try { localStorage.removeItem(DISMISSED_AT_KEY); } catch { /* optional */ }
};

const warmInstalledApp = () => {
  if (!('serviceWorker' in navigator)) return;
  void navigator.serviceWorker.ready.then((registration) => {
    registration.active?.postMessage({ type: 'DOWNLOAD_OFFLINE_LIBRARY' });
  });
};

export const PwaInstallPrompt: React.FC = () => {
  const mountedAtRef = useRef(Date.now());
  const showTimerRef = useRef<number | null>(null);
  const privacyReadyRef = useRef(getConsentPreferences() !== null);
  const installAvailableRef = useRef(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  const schedulePrompt = useCallback((delayOverrideMs?: number) => {
    if (!privacyReadyRef.current || isRunningStandalone() || wasRecentlyDismissed()) return;
    if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);

    const elapsed = Date.now() - mountedAtRef.current;
    const delay = delayOverrideMs ?? Math.max(0, PROMPT_DELAY_MS - elapsed);
    showTimerRef.current = window.setTimeout(() => {
      setIsVisible(true);
      showTimerRef.current = null;
    }, delay);
  }, []);

  useEffect(() => {
    if (isRunningStandalone()) {
      void requestPersistentStorage();
      warmInstalledApp();
      return;
    }

    const handleInstallAvailable = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      installAvailableRef.current = true;
      setInstallPrompt(promptEvent);
      schedulePrompt();
    };
    const handleInstalled = () => {
      clearDismissal();
      installAvailableRef.current = false;
      setInstallPrompt(null);
      setIsVisible(false);
      void requestPersistentStorage();
      warmInstalledApp();
    };
    const displayMode = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => { if (displayMode.matches) handleInstalled(); };
    const handleConsentOpen = () => {
      privacyReadyRef.current = false;
      setIsVisible(false);
      setShowIosHelp(false);
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }
    };
    const handleConsentChanged = () => {
      privacyReadyRef.current = true;
      if (installAvailableRef.current || isIosDevice()) schedulePrompt(POST_CONSENT_DELAY_MS);
    };

    window.addEventListener('beforeinstallprompt', handleInstallAvailable);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener(CONSENT_OPEN_EVENT, handleConsentOpen);
    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChanged);
    displayMode.addEventListener?.('change', handleDisplayModeChange);
    if (isIosDevice() && privacyReadyRef.current) schedulePrompt();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallAvailable);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener(CONSENT_OPEN_EVENT, handleConsentOpen);
      window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChanged);
      displayMode.removeEventListener?.('change', handleDisplayModeChange);
      if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
    };
  }, [schedulePrompt]);

  const dismiss = () => {
    rememberDismissal();
    setIsVisible(false);
    setShowIosHelp(false);
  };

  const install = async () => {
    if (!installPrompt) {
      setShowIosHelp(true);
      return;
    }

    setIsInstalling(true);
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      installAvailableRef.current = false;
      setInstallPrompt(null);
      setIsVisible(false);
      if (choice.outcome === 'accepted') {
        clearDismissal();
        await requestPersistentStorage();
        warmInstalledApp();
      } else {
        rememberDismissal();
      }
    } finally {
      setIsInstalling(false);
    }
  };

  if (!isVisible || isRunningStandalone()) return null;

  return (
    <>
      <div className="pwa-install-backdrop" aria-hidden="true" />
      <aside className="pwa-install-card" role="dialog" aria-modal="false" aria-labelledby="pwa-install-title" aria-describedby="pwa-install-description">
      <style>{`
        .pwa-install-backdrop {
          position:fixed; z-index:10019; inset:0; background:rgba(15,23,42,.08);
          -webkit-backdrop-filter:blur(5px); backdrop-filter:blur(5px);
          animation:pwaBackdropIn 220ms ease both;
        }
        .pwa-install-card {
          position:fixed; z-index:10020; left:max(16px,env(safe-area-inset-left)); bottom:max(16px,env(safe-area-inset-bottom));
          width:min(340px,calc(100vw - 24px)); padding:16px; color:#172033;
          background:rgba(255,255,255,.98); border:1px solid rgba(148,163,184,.25);
          border-radius:18px; box-shadow:0 24px 70px rgba(15,23,42,.25);
          animation:pwaCardIn 320ms cubic-bezier(.2,.8,.2,1) both;
          -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px);
        }
        .dark .pwa-install-card { color:#f8fafc; background:rgba(10,18,31,.98); border-color:rgba(148,163,184,.18); box-shadow:0 25px 75px rgba(0,0,0,.52); }
        .pwa-install-close { position:absolute; top:10px; right:10px; display:grid; width:30px; height:30px; place-items:center; padding:0; color:#64748b; background:rgba(148,163,184,.1); border:0; border-radius:999px; cursor:pointer; }
        .pwa-install-head { display:flex; align-items:center; gap:12px; padding-right:28px; }
        .pwa-install-logo { width:56px; height:56px; flex:none; border-radius:14px; object-fit:cover; box-shadow:0 8px 22px rgba(15,23,42,.2); }
        .pwa-install-kicker { margin:0 0 2px; color:#7c3aed; font-size:.62rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .pwa-install-title { margin:0; color:inherit; font-size:1rem; font-weight:900; letter-spacing:-.02em; line-height:1.25; }
        .pwa-install-description { margin:10px 0 0; color:#64748b; font-size:.72rem; font-weight:550; line-height:1.45; }
        .dark .pwa-install-description { color:#a8b4c6; }
        .pwa-install-actions { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px; margin-top:13px; }
        .pwa-install-button { display:flex; min-height:40px; align-items:center; justify-content:center; gap:7px; padding:9px 14px; color:#fff; background:linear-gradient(135deg,#7c3aed,#4f46e5); border:0; border-radius:10px; box-shadow:0 9px 20px rgba(99,102,241,.25); cursor:pointer; font-size:.75rem; font-weight:900; }
        .pwa-install-button:disabled { cursor:wait; opacity:.65; }
        .pwa-install-offline { display:flex; min-height:40px; align-items:center; gap:5px; padding:0 10px; color:#475569; background:#f1f5f9; border-radius:10px; font-size:.65rem; font-weight:800; }
        .dark .pwa-install-offline { color:#cbd5e1; background:rgba(148,163,184,.1); }
        .pwa-ios-help { margin:10px 0 0; padding:9px 10px; color:#475569; background:#f8fafc; border-radius:10px; font-size:.7rem; line-height:1.45; }
        .dark .pwa-ios-help { color:#cbd5e1; background:rgba(148,163,184,.08); }
        @keyframes pwaCardIn { from { opacity:0; transform:translateY(18px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pwaBackdropIn { from { opacity:0; } to { opacity:1; } }
        @media (max-width:460px) { .pwa-install-card { left:max(12px,env(safe-area-inset-left)); } }
        @media (prefers-reduced-motion:reduce) { .pwa-install-card,.pwa-install-backdrop { animation:none; } }
      `}</style>

      <button type="button" className="pwa-install-close" onClick={dismiss} aria-label="Dismiss install suggestion"><X size={16} aria-hidden="true" /></button>
      <div className="pwa-install-head">
        <img className="pwa-install-logo" src="/app-icon-192.png" width="56" height="56" alt="" />
        <div>
          <p className="pwa-install-kicker">Exam Sidemann</p>
          <h2 className="pwa-install-title" id="pwa-install-title">Install the learning app</h2>
        </div>
      </div>
      <p className="pwa-install-description" id="pwa-install-description">Open faster and download the lesson library in the background for offline study when your device has enough space.</p>
      <div className="pwa-install-actions">
        <button type="button" className="pwa-install-button" onClick={install} disabled={isInstalling}>
          {installPrompt ? <Download size={16} aria-hidden="true" /> : <Share size={16} aria-hidden="true" />}
          {isInstalling ? 'Opening…' : installPrompt ? 'Install app' : 'How to install'}
        </button>
        <span className="pwa-install-offline"><WifiOff size={13} /> Offline</span>
      </div>
      {showIosHelp && <p className="pwa-ios-help" role="status">Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.</p>}
      </aside>
    </>
  );
};
