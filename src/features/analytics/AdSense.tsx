import React, { useEffect, useRef, useState } from 'react';
import {
  CONSENT_CHANGED_EVENT,
  getAdSenseClient,
  hasConsent,
  isAdSenseEnabled,
  loadAdSenseIfAllowed,
} from '../privacy/privacyConsent';
import type { ConsentPreferences } from '../privacy/privacyConsent';

export type ApprovedAdPlacement = 'article' | 'lesson' | 'resource-detail';

interface AdSenseProps {
  adSlot: string;
  adClient?: string;
  /**
   * Ads fail closed unless the caller identifies a reviewed, substantive-content
   * placement. Do not set this on menus, search results, directories, selectors,
   * download controls, or other navigation/list screens.
   */
  approvedContentPlacement?: ApprovedAdPlacement;
  className?: string;
  style?: React.CSSProperties;
  minimal?: boolean;
}

export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adClient = getAdSenseClient(),
  approvedContentPlacement,
  className = '',
  style = { display: 'block' },
  minimal = false
}) => {
  const adElement = useRef<HTMLModElement | null>(null);
  const [hasAdvertisingConsent, setHasAdvertisingConsent] = useState(() =>
    hasConsent('advertising'),
  );
  const canRender =
    isAdSenseEnabled() && Boolean(approvedContentPlacement) && hasAdvertisingConsent;

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const preferences = (event as CustomEvent<ConsentPreferences>).detail;
      setHasAdvertisingConsent(preferences.advertising === true);
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (!canRender) return;

    let cancelled = false;
    void loadAdSenseIfAllowed(adClient).then((loaded) => {
      const element = adElement.current;
      if (!loaded || cancelled || !element || !element.isConnected) return;
      if (element.dataset.adRequestStarted === 'true') return;

      element.dataset.adRequestStarted = 'true';
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (error) {
        element.dataset.adRequestStarted = 'false';
        console.warn('AdSense could not request this approved placement.', error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [adClient, adSlot, canRender]);

  if (!canRender) return null;

  if (minimal) {
    return (
      <div key={adSlot} className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={{ height: style.height, width: style.width }}>
        <ins
          ref={adElement}
          className="adsbygoogle"
          style={style}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-full-width-responsive="false"
        />
      </div>
    );
  }

  return (
    <div key={adSlot} className={`my-4 overflow-hidden rounded-lg bg-gray-50/50 dark:bg-black/10 border border-gray-100 dark:border-white/5 p-2 flex flex-col items-center justify-center ${className}`}>
      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 select-none">Advertisement</span>
      <ins
        ref={adElement}
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
