import React, { useEffect, useState } from 'react';
import { Cookie, MapPin } from 'lucide-react';
import { requestAnalyticsLocationPermission } from '../../services/analytics';
import { requestPersistentStorage } from '../../services/offlineStorage';
import {
  applyConsentPreferences,
  CONSENT_CHANGED_EVENT,
  CONSENT_OPEN_EVENT,
  createConsentPreferences,
  getConsentPreferences,
  saveConsentPreferences,
} from './privacyConsent';
import type { ConsentPreferences } from './privacyConsent';

type ConsentDraft = Pick<ConsentPreferences, 'analytics' | 'advertising'>;

const REJECTED: ConsentDraft = { analytics: false, advertising: false };
const ACCEPTED: ConsentDraft = { analytics: true, advertising: true };
const CONSENT_PROMPT_DELAY_MS = 10_000;

export const ConsentBanner: React.FC = () => {
  const [savedPreferences, setSavedPreferences] = useState<ConsentPreferences | null>(() =>
    getConsentPreferences(),
  );
  const [draft, setDraft] = useState<ConsentDraft>(() => {
    const saved = getConsentPreferences();
    return saved ? { analytics: saved.analytics, advertising: saved.advertising } : REJECTED;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    applyConsentPreferences(savedPreferences);

    let promptTimer: number | undefined;
    if (!getConsentPreferences()) {
      promptTimer = window.setTimeout(() => setIsOpen(true), CONSENT_PROMPT_DELAY_MS);
    }

    const handleOpen = () => {
      if (promptTimer !== undefined) window.clearTimeout(promptTimer);
      const current = getConsentPreferences();
      setDraft(current ? { analytics: current.analytics, advertising: current.advertising } : REJECTED);
      setIsManaging(true);
      setIsOpen(true);
    };
    const handleChange = (event: Event) => {
      setSavedPreferences((event as CustomEvent<ConsentPreferences>).detail);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen);
    window.addEventListener(CONSENT_CHANGED_EVENT, handleChange);
    return () => {
      if (promptTimer !== undefined) window.clearTimeout(promptTimer);
      window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen);
      window.removeEventListener(CONSENT_CHANGED_EVENT, handleChange);
    };
  }, []);

  const commit = (choices: ConsentDraft) => {
    const preferences = createConsentPreferences(choices);
    saveConsentPreferences(preferences);
    setSavedPreferences(preferences);
    setDraft(choices);
    setIsManaging(false);
    setIsOpen(false);

    // Both calls begin inside the button gesture. Location still has its own
    // browser permission sheet and is never requested for necessary-only use.
    void requestPersistentStorage();
    if (choices.analytics) void requestAnalyticsLocationPermission();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="privacy-consent-backdrop" aria-hidden="true" />
      <section
      role="dialog"
      aria-modal="false"
      aria-labelledby="privacy-consent-title"
      aria-describedby="privacy-consent-description"
      className="privacy-consent-card"
    >
      <style>{`
        .privacy-consent-backdrop {
          position:fixed;
          z-index:10029;
          inset:0;
          background:rgba(15,23,42,.08);
          -webkit-backdrop-filter:blur(5px);
          backdrop-filter:blur(5px);
          animation:privacyBackdropIn 220ms ease both;
        }
        .privacy-consent-card {
          position: fixed;
          z-index: 10030;
          left: max(16px, env(safe-area-inset-left));
          bottom: max(16px, env(safe-area-inset-bottom));
          width: min(310px, calc(100vw - 24px));
          overflow: hidden;
          color: #172033;
          background: rgba(255,255,255,.98);
          border: 1px solid rgba(148,163,184,.25);
          border-radius: 18px;
          box-shadow: 0 24px 70px rgba(15,23,42,.25);
          animation: privacyCardIn 320ms cubic-bezier(.2,.8,.2,1) both;
          -webkit-backdrop-filter: blur(18px);
          backdrop-filter: blur(18px);
        }
        .dark .privacy-consent-card {
          color: #f8fafc;
          background: rgba(10,18,31,.98);
          border-color: rgba(148,163,184,.18);
          box-shadow: 0 25px 75px rgba(0,0,0,.52);
        }
        .privacy-cookie-visual {
          position: relative;
          display: grid;
          height: 104px;
          place-items: center;
          overflow: hidden;
          color: #f97316;
          background: linear-gradient(145deg,#eef8f0,#f8fbf5);
        }
        .dark .privacy-cookie-visual { background: linear-gradient(145deg,#11291f,#101d1a); }
        .privacy-cookie-icon {
          display: grid;
          width: 70px;
          height: 70px;
          place-items: center;
          border: 8px solid rgba(255,255,255,.85);
          border-radius: 999px;
          background: #ffedd5;
          box-shadow: 0 12px 28px rgba(249,115,22,.22);
          transform: rotate(-8deg);
        }
        .dark .privacy-cookie-icon { border-color: rgba(255,255,255,.08); background: #43210e; }
        .privacy-crumb { position:absolute; width:6px; height:6px; border-radius:999px; background:#7c2d12; opacity:.75; }
        .privacy-crumb-one { left:36px; top:24px; }
        .privacy-crumb-two { right:42px; top:30px; width:8px; height:8px; }
        .privacy-crumb-three { right:28px; bottom:19px; width:5px; height:5px; }
        .privacy-consent-body { padding:16px; text-align:center; }
        .privacy-consent-heading { margin:0; font-size:1.08rem; font-weight:900; letter-spacing:-.025em; }
        .privacy-consent-copy { margin:6px auto 0; max-width:250px; color:#64748b; font-size:.72rem; font-weight:550; line-height:1.45; }
        .dark .privacy-consent-copy { color:#a8b4c6; }
        .privacy-location-note { display:flex; align-items:center; justify-content:center; gap:5px; margin:9px 0 0; color:#64748b; font-size:.64rem; font-weight:700; }
        .dark .privacy-location-note { color:#94a3b8; }
        .privacy-consent-options { display:grid; gap:7px; margin-top:12px; text-align:left; }
        .privacy-consent-option { display:flex; min-height:40px; align-items:center; justify-content:space-between; gap:12px; padding:8px 10px; border:1px solid rgba(148,163,184,.25); border-radius:10px; font-size:.72rem; font-weight:800; }
        .privacy-consent-toggle { width:18px; height:18px; flex:none; accent-color:#22c55e; }
        .privacy-consent-actions { display:grid; gap:7px; margin-top:13px; }
        .privacy-consent-button { display:flex; min-height:40px; width:100%; align-items:center; justify-content:center; padding:9px 14px; border-radius:10px; cursor:pointer; font-size:.75rem; font-weight:900; transition:transform 150ms ease, filter 150ms ease, background-color 150ms ease; }
        .privacy-consent-button:hover { transform:translateY(-1px); }
        .privacy-consent-primary { color:#064e3b; background:#86ef6b; border:1px solid #86ef6b; box-shadow:0 8px 18px rgba(34,197,94,.2); }
        .privacy-consent-primary:hover { filter:brightness(.97); }
        .privacy-consent-secondary { color:#475569; background:transparent; border:1px solid rgba(148,163,184,.36); }
        .dark .privacy-consent-secondary { color:#d7deea; }
        .privacy-consent-links { display:flex; justify-content:center; gap:14px; margin-top:11px; }
        .privacy-consent-link { padding:0; color:#64748b; background:transparent; border:0; cursor:pointer; font-size:.65rem; font-weight:750; text-decoration:underline; text-underline-offset:3px; }
        .dark .privacy-consent-link { color:#a8b4c6; }
        @keyframes privacyCardIn { from { opacity:0; transform:translateY(18px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes privacyBackdropIn { from { opacity:0; } to { opacity:1; } }
        @media (max-width:460px) { .privacy-consent-card { left:max(12px,env(safe-area-inset-left)); } }
        @media (prefers-reduced-motion:reduce) { .privacy-consent-card,.privacy-consent-backdrop { animation:none; } .privacy-consent-button { transition:none; } }
      `}</style>

      <div className="privacy-cookie-visual" aria-hidden="true">
        <span className="privacy-crumb privacy-crumb-one" />
        <span className="privacy-crumb privacy-crumb-two" />
        <span className="privacy-crumb privacy-crumb-three" />
        <span className="privacy-cookie-icon"><Cookie size={46} strokeWidth={2.4} /></span>
      </div>

      <div className="privacy-consent-body">
        <h2 id="privacy-consent-title" className="privacy-consent-heading">We use cookies</h2>
        <p id="privacy-consent-description" className="privacy-consent-copy">They keep learning saved and help us improve the app.</p>
        <p className="privacy-location-note"><MapPin size={12} /> Accepting asks for location permission.</p>

        {isManaging && (
          <div className="privacy-consent-options">
            <label className="privacy-consent-option"><span>Analytics &amp; location</span><input type="checkbox" checked={draft.analytics} onChange={(event) => setDraft((current) => ({ ...current, analytics: event.target.checked }))} className="privacy-consent-toggle" /></label>
            <label className="privacy-consent-option"><span>Advertising</span><input type="checkbox" checked={draft.advertising} onChange={(event) => setDraft((current) => ({ ...current, advertising: event.target.checked }))} className="privacy-consent-toggle" /></label>
          </div>
        )}

        <div className="privacy-consent-actions">
          <button type="button" onClick={() => commit(isManaging ? draft : ACCEPTED)} className="privacy-consent-button privacy-consent-primary">{isManaging ? 'Save choices' : 'Accept cookies'}</button>
          <button type="button" onClick={() => commit(REJECTED)} className="privacy-consent-button privacy-consent-secondary">Necessary only</button>
        </div>
        <div className="privacy-consent-links">
          <a href="/privacy/" className="privacy-consent-link">Privacy policy</a>
          {!isManaging && <button type="button" onClick={() => setIsManaging(true)} className="privacy-consent-link">Choose cookies</button>}
        </div>
      </div>
      </section>
    </>
  );
};

export { openConsentPreferences } from './privacyConsent';
