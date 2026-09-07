import type { NavigateFunction } from 'react-router-dom';
import { canonicalPathFor } from '../../../utils/siteUrl';

/**
 * Back handler for experiment pages.
 *
 * Steps back through history when the learner arrived from somewhere inside the
 * app, so they land exactly where they left off — same page, same scroll
 * position, same open section. Only a cold entry (deep link, refresh, shared
 * URL) falls through to the subject landing page.
 */
export const practicalBack = (navigate: NavigateFunction, fallbackRoute: string) => {
  // React Router stamps an index onto history.state; anything above 0 means
  // there is an in-app entry to go back to.
  const index = (window.history.state as { idx?: number } | null)?.idx;
  if (typeof index === 'number' && index > 0) {
    navigate(-1);
    return;
  }
  navigate(canonicalPathFor(fallbackRoute));
};
