/// <reference types="vite/client" />
export const registerPwa = () => {
  if (!("serviceWorker" in navigator)) return;

  // Vite serves changing source URLs; an offline cache must not mask local edits.
  if (import.meta.env.DEV) {
    void navigator.serviceWorker.getRegistrations().then(async registrations => {
      await Promise.all(registrations.filter(registration => {
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        return worker && new URL(worker.scriptURL).pathname === '/service-worker.js';
      }).map(registration => registration.unregister()));
      const names = await caches.keys();
      await Promise.all(names.filter(name => name.startsWith('exam-sidemann-')).map(name => caches.delete(name)));
    }).catch(error => console.warn('Could not clear development offline cache.', error));
    return;
  }

  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js",
        {
          scope: "/",
          updateViaCache: "none",
        },
      );

      await navigator.serviceWorker.ready;

      window.setTimeout(() => {
        void registration.update();
      }, 60_000);

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          void registration.update();
        }
      });
    } catch (error) {
      console.warn("Exam Sidemann offline mode could not be started.", error);
    }
  };

  if (document.readyState === "complete") {
    void register();
  } else {
    window.addEventListener("load", () => void register(), { once: true });
  }
};
