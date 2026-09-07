const isProductionBuild =
  (import.meta as ImportMeta & { env?: { PROD?: boolean } }).env?.PROD === true;

export const registerPwa = () => {
  if (!isProductionBuild || !("serviceWorker" in navigator)) return;

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
