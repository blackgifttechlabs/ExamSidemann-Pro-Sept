'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { TEACH_ME_SHIMMER_CSS } from './teachMeShimmer';

/**
 * "Teach me" for the IT labs.
 *
 * The labs are open to everyone; the narrated course behind this button is the
 * part that needs an account. Clicking while signed out asks the shell to open
 * the login modal and tells it where the student was — the modal otherwise
 * drops everyone on /dashboard, which would throw away the lab they were in.
 * The student never leaves the page, so once they are in, the course starts
 * where they stood.
 */

/** Ask the app shell for the login modal, and where to come back to. */
export const requestLogin = (returnTo: string) => {
  window.dispatchEvent(
    new CustomEvent('examsidemann:request-login', { detail: { returnTo } }),
  );
};


export const TeachMeLaunchButton: React.FC<{
  /** What the lesson does once the student is signed in. */
  onStart?: () => void;
  /** Title bars are 22px tall; the IDE top bars have room for the full pill. */
  size?: 'sm' | 'md';
  /** Escape hatch for chrome the two presets do not suit. */
  className?: string;
  label?: string;
  title?: string;
  /** Accepted for call-site symmetry; the button paints its own colours. */
  isDarkMode?: boolean;
}> = ({
  onStart,
  size = 'md',
  className,
  label = 'Teach me',
  title = 'Learn this lab with a narrated lesson',
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const waitingForLogin = useRef(false);
  const [notice, setNotice] = useState(false);

  const start = () => {
    if (onStart) {
      onStart();
      return;
    }
    // No course recorded for this lab yet — say so rather than doing nothing.
    setNotice(true);
    window.setTimeout(() => setNotice(false), 4200);
  };

  // Signed in while the modal was open: pick up where they left off.
  useEffect(() => {
    if (user && waitingForLogin.current) {
      waitingForLogin.current = false;
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const click = () => {
    if (!user) {
      waitingForLogin.current = true;
      requestLogin(`${location.pathname}${location.search}`);
      return;
    }
    start();
  };

  const preset =
    size === 'sm'
      ? 'teachme-btn flex h-[22px] shrink-0 items-center gap-1.5 rounded-[3px] px-2.5 text-[11px] font-bold'
      : 'teachme-btn flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black active:scale-95 sm:px-4';

  return (
    <>
      <style>{TEACH_ME_SHIMMER_CSS}</style>
      <button type="button" onClick={click} title={title} className={className ?? preset}>
        <GraduationCap className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        <span>{label}</span>
      </button>

      {notice && (
        <div className="fixed bottom-6 left-1/2 z-[400] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 text-center text-xs font-bold text-white shadow-2xl">
          The narrated lesson for this lab is still being recorded.
        </div>
      )}
    </>
  );
};
