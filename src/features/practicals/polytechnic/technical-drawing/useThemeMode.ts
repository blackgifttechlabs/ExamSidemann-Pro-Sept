'use client';

import { useCallback, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

const PRACTICALS_THEME_EVENT = 'practicals-theme-change';

/**
 * Reads and drives the app's light/dark mode.
 *
 * Tailwind here is configured `darkMode: 'class'`, so the switch is a class on
 * `<html>` plus a `theme` entry in localStorage — the same pair the bottom
 * navigation writes. This hook adopts whatever is already set rather than
 * imposing a default, so opening a drawing lesson never flips the rest of the
 * site out from under the reader.
 */
export function useThemeMode(): [ThemeMode, () => void] {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document === 'undefined') return 'dark';
    const root = document.documentElement;
    if (root.classList.contains('light')) return 'light';
    if (root.classList.contains('dark')) return 'dark';
    return window.localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    window.localStorage.setItem('theme', theme);
    window.dispatchEvent(new CustomEvent<ThemeMode>(PRACTICALS_THEME_EVENT, { detail: theme }));
  }, [theme]);

  useEffect(() => {
    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<ThemeMode>).detail;
      if (nextTheme === 'light' || nextTheme === 'dark') setTheme(nextTheme);
    };
    window.addEventListener(PRACTICALS_THEME_EVENT, syncTheme);
    return () => window.removeEventListener(PRACTICALS_THEME_EVENT, syncTheme);
  }, []);

  const toggle = useCallback(() => setTheme((current) => (current === 'light' ? 'dark' : 'light')), []);

  return [theme, toggle];
}
