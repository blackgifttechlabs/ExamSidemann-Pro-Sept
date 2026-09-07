import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginWithGoogleIdToken } from '../../services/firebase';

type GoogleCredentialResponse = {
  credential?: string;
};

type GooglePromptMomentNotification = {
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
  getMomentType: () => string;
};

type GoogleIdentityApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: 'signin' | 'signup' | 'use';
    itp_support?: boolean;
    use_fedcm_for_prompt?: boolean;
  }) => void;
  prompt: (momentListener?: (notification: GooglePromptMomentNotification) => void) => void;
  cancel: () => void;
  disableAutoSelect: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdentityApi;
      };
    };
  }
}

const DEFAULT_GOOGLE_CLIENT_ID = '632116604698-r80g47snmodo48nasm5c27ac9h96in1i.apps.googleusercontent.com';

let googleIdentityScript: Promise<void> | null = null;
let initializedClientId: string | null = null;
let credentialConsumer: ((response: GoogleCredentialResponse) => void) | null = null;

const loadGoogleIdentity = () => {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleIdentityScript) return googleIdentityScript;

  googleIdentityScript = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-identity-services');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Google Identity Services failed to load.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-services';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Identity Services failed to load.'));
    document.head.appendChild(script);
  });

  return googleIdentityScript;
};

export const GoogleOneTap: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const rawClientId = String((import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '').trim();
  const clientId = rawClientId || DEFAULT_GOOGLE_CLIENT_ID;
  const cameFromLogout = new URLSearchParams(location.search).get('from') === 'logout';

  useEffect(() => {
    if (loading || !clientId) return;
    if (user || cameFromLogout) {
      window.google?.accounts?.id?.cancel();
      if (cameFromLogout) window.google?.accounts?.id?.disableAutoSelect();
      return;
    }

    let active = true;
    const consumeCredential = (response: GoogleCredentialResponse) => {
      if (!response.credential) return;
      void loginWithGoogleIdToken(response.credential)
        .then(() => {
          if (location.pathname.startsWith('/login')) {
            navigate('/dashboard', { replace: true });
          }
        })
        .catch((error) => {
          console.error('Google One Tap sign-in failed', error);
        });
    };
    credentialConsumer = consumeCredential;

    void loadGoogleIdentity()
      .then(() => {
        if (!active || !window.google?.accounts?.id) return;
        if (!initializedClientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            auto_select: false,
            cancel_on_tap_outside: false,
            context: 'signin',
            itp_support: true,
            use_fedcm_for_prompt: true,
            callback: (response) => credentialConsumer?.(response),
          });
          initializedClientId = clientId;
        } else if (initializedClientId !== clientId) {
          console.error('Google One Tap client ID changed after initialization.');
          return;
        }

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            // Can happen if user closed it recently, cooldown, or browser FedCM settings
            const reason = notification.getNotDisplayedReason();
            if (reason !== 'suppressed_by_user') {
              console.debug('Google One Tap not displayed:', reason);
            }
          } else if (notification.isSkippedMoment()) {
            console.debug('Google One Tap skipped:', notification.getSkippedReason());
          }
        });
      })
      .catch((error) => console.warn('Could not load Google Identity Services:', error));

    return () => {
      active = false;
      if (credentialConsumer === consumeCredential) credentialConsumer = null;
    };
  }, [cameFromLogout, clientId, loading, user]);

  return null;
};

export default GoogleOneTap;
