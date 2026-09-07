import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../services/analytics';
import { recordPageViewForAchievements } from '../../services/achievements';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Records a page view on every route change.
 *
 * The short delay lets `RouteSeo` finish writing `document.title`, so the
 * report shows the page's real name rather than whatever the previous route
 * left behind — and it drops instant bounce-throughs where the reader was only
 * passing over a route on the way somewhere else.
 *
 * Also records the visit for the Dedicated Learners achievement tracking system.
 */
export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      void trackPageView(location.pathname);
      recordPageViewForAchievements(location.pathname, user?.uid);
    }, 400);
    return () => clearTimeout(timer);
  }, [location.pathname, user?.uid]);

  return null;
};
