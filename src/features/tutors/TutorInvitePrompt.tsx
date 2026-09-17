import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './tutorInvite.css';

const DISMISSED = 'examsidemann:tutor-invite-dismissed';
const NEVER_SHOW = 'examsidemann:tutor-invite-never-show';
const ELAPSED = 'examsidemann:tutor-invite-elapsed';

export function TutorInvitePrompt({ eligible, onContinue }: { eligible: boolean; onContinue: () => void }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      if (localStorage.getItem(NEVER_SHOW) === '1') return true;
    } catch {
      /* Optional storage. */
    }
    try {
      return !!sessionStorage.getItem(DISMISSED);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (dismissed) return;
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
    try {
      sessionStorage.setItem(DISMISSED, '1');
    } catch {
      /* In-memory dismissal still works. */
    }
  };

  const handleContinue = () => {
    dismiss();
    onContinue();
  };

  const neverShowAgain = () => {
    try {
      localStorage.setItem(NEVER_SHOW, '1');
    } catch {
      /* Session and in-memory dismissal still work if storage is unavailable. */
    }
    dismiss();
  };

  if (!open || !eligible || dismissed) return null;

  return (
    <aside
      className="tutor-invite"
      role="dialog"
      aria-label="Are you a teacher?"
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

      <h2>Are you a teacher?</h2>
      <p className="tutor-invite-subtitle">
        List yourself on the platform so that students near you will find you
      </p>

      <div className="tutor-invite-actions">
        <button
          type="button"
          className="tutor-invite-primary"
          onClick={handleContinue}
        >
          Continue
        </button>
        <button
          type="button"
          className="tutor-invite-dismiss"
          onClick={dismiss}
        >
          Maybe Later
        </button>
      </div>
      <button
        type="button"
        className="tutor-invite-dismiss tutor-invite-never-show"
        onClick={neverShowAgain}
      >
        Never show again
      </button>
    </aside>
  );
}
