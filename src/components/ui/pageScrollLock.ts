import { useEffect } from 'react';

type PageScrollLockState = {
  count: number;
  bodyOverflow: string;
  htmlOverflow: string;
};

const STATE_KEY = '__examSidemannPageScrollLock__';

const getState = (): PageScrollLockState => {
  const host = window as typeof window & {
    [STATE_KEY]?: PageScrollLockState;
  };

  if (!host[STATE_KEY]) {
    host[STATE_KEY] = {
      count: 0,
      bodyOverflow: '',
      htmlOverflow: '',
    };
  }

  return host[STATE_KEY];
};

/**
 * Locks document scrolling without letting overlapping full-screen views restore
 * a stale `overflow: hidden` value. The returned release function is idempotent.
 */
export const acquirePageScrollLock = (): (() => void) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => undefined;
  }

  const state = getState();
  if (state.count === 0) {
    state.bodyOverflow = document.body.style.overflow;
    state.htmlOverflow = document.documentElement.style.overflow;
  }

  state.count += 1;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  let released = false;
  return () => {
    if (released) return;
    released = true;

    state.count = Math.max(0, state.count - 1);
    if (state.count !== 0) return;

    document.body.style.overflow = state.bodyOverflow;
    document.documentElement.style.overflow = state.htmlOverflow;
    state.bodyOverflow = '';
    state.htmlOverflow = '';
  };
};

export const usePageScrollLock = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    return acquirePageScrollLock();
  }, [enabled]);
};
