import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './tutorInvite.css';

const CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb34ZR859PwV4EzW1w04';

// Design preview: show the card 3s after opening the library, past papers, extra lessons,
// class notes (courses) or practicals, ignoring the 2-minute timer and the
// stored dismissal. Set to false to restore normal behaviour.
const PREVIEW_ALWAYS_SHOW = true;
const PREVIEW_DELAY_MS = 3000;

const JOINED = 'examsidemann:whatsapp-channel-joined';
const DISMISSED = 'examsidemann:tutor-invite-dismissed';
const ELAPSED = 'examsidemann:tutor-invite-elapsed';

const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zM20.52 3.45A11.8 11.8 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.34-1.66a11.88 11.88 0 0 0 5.71 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.43-8.45z" />
  </svg>
);

export function TutorInvitePrompt({ eligible }: { eligible: boolean; onContinue?: () => void }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      if (localStorage.getItem(JOINED) === '1') return true;
    } catch {
      /* Optional storage. */
    }
    if (PREVIEW_ALWAYS_SHOW) return false;
    try {
      return !!sessionStorage.getItem(DISMISSED);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!PREVIEW_ALWAYS_SHOW || dismissed) return;
    if (!eligible) {
      setOpen(false);
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), PREVIEW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [dismissed, eligible]);

  useEffect(() => {
    if (PREVIEW_ALWAYS_SHOW || dismissed) return;
    let elapsed = 0;
    try {
      elapsed = Number(sessionStorage.getItem(ELAPSED)) || 0;
    } catch {
      /* Optional storage. */
    }
    let previous = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      if (document.visibilityState === 'visible') elapsed += Math.min(now - previous, 1500);
      previous = now;
      try {
        sessionStorage.setItem(ELAPSED, String(elapsed));
      } catch {
        /* Optional storage. */
      }
      const blocked = !!document.querySelector('[aria-modal="true"], .privacy-consent-backdrop');
      if (blocked) setOpen(false);
      else if (elapsed >= 120_000 && eligible) setOpen(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [dismissed, eligible]);

  const dismiss = () => {
    setDismissed(true);
    setOpen(false);
    if (PREVIEW_ALWAYS_SHOW) return;
    try {
      sessionStorage.setItem(DISMISSED, '1');
    } catch {
      /* In-memory dismissal still works. */
    }
  };

  const handleJoin = () => {
    try {
      localStorage.setItem(JOINED, '1');
    } catch {
      /* Falls back to hiding it for this visit only. */
    }
    dismiss();
  };

  if (!open || dismissed || !eligible) return null;

  return (
    <aside
      className="tutor-invite"
      role="dialog"
      aria-label="Join our WhatsApp channel"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          dismiss();
        }
      }}
    >
      <button className="tutor-invite-close" aria-label="Close" onClick={dismiss}>
        <X size={18} />
      </button>

      <span className="tutor-invite-icon" aria-hidden="true">
        <WhatsAppIcon size={26} />
      </span>
      <h2>Student guide on WhatsApp</h2>
      <p className="tutor-invite-subtitle">
        Join our WhatsApp channel for study guidance and get connected to real teachers.
      </p>

      <div className="tutor-invite-actions">
        <a
          className="tutor-invite-primary tutor-invite-whatsapp"
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleJoin}
        >
          <WhatsAppIcon size={18} />
          Join the channel
        </a>
      </div>
    </aside>
  );
}
