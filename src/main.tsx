
import React, { useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { AuthProvider } from './contexts/AuthContext';
import { registerPwa } from './utils/registerPwa';
import { canonicalPathFor } from './utils/siteUrl';

if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1));
}

const canonicalPath = canonicalPathFor(window.location.pathname);
if (window.location.pathname !== canonicalPath) {
  window.history.replaceState(
    window.history.state,
    '',
    `${canonicalPath}${window.location.search}${window.location.hash}`,
  );
}

registerPwa();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const AppBootReady: React.FC = () => {
  useLayoutEffect(() => {
    const startedAt = Number(document.documentElement.dataset.appBootStarted || Date.now());
    // The last orange stroke of the X finishes at 1.5 seconds. Keep a small
    // buffer so the completed logo is visible before revealing the page.
    const remaining = Math.max(0, 1650 - (Date.now() - startedAt));
    let removeBoot: number | undefined;
    const finishBoot = window.setTimeout(() => {
      document.documentElement.classList.add('app-boot-leaving');
      removeBoot = window.setTimeout(() => {
        document.documentElement.classList.remove('app-booting', 'app-boot-leaving');
        delete document.documentElement.dataset.appBootStarted;
        document.getElementById('app-boot-screen')?.remove();
      }, 650);
    }, remaining);

    return () => {
      window.clearTimeout(finishBoot);
      if (removeBoot !== undefined) window.clearTimeout(removeBoot);
    };
  }, []);

  return null;
};

root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppBootReady />
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
