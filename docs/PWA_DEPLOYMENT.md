# Exam Sidemann PWA deployment

## Production requirements

- Deploy over HTTPS. Service workers and install prompts require a secure context
  (localhost is allowed for testing).
- Keep `site.webmanifest`, `service-worker.js`, `offline.html`, and every referenced
  icon at the site root.
- Preserve the cache headers in `public/_headers`. In particular,
  `service-worker.js` must not be cached by the CDN and hashed `/assets/*` files
  should be immutable.
- Run `npm run build`. The build generates the final service worker after Vite has
  produced its hashed assets and after the SEO routes and sitemap are generated.

## Install prompt behavior

- The compact Exam Sidemann card appears after five seconds when Chromium reports
  that the site is installable.
- The card is hidden when the app is already running in standalone mode.
- Dismissing it pauses the suggestion for seven days.
- On iPhone and iPad the card explains **Share → Add to Home Screen**, because iOS
  does not expose Chromium's `beforeinstallprompt` event.
- The browser always owns the final native install confirmation. A website cannot
  silently install itself.

## Offline cache behavior

- The versioned precache guarantees the app shell, CSS, current entry script,
  manifest, offline page, and branded icons.
- The first controlled visit warms all public SEO entry pages and code chunks in
  the background once per deployed version.
- Navigations prefer fresh network HTML but fall back quickly to cached pages and
  then to the cached React app shell.
- Hashed build assets use cache-first delivery.
- Scripts, styles, and permitted third-party presentation assets use
  stale-while-revalidate.
- Viewed images, audio, video, and fonts are retained in bounded runtime caches.
- `/api/*`, Firebase requests, authentication, messages, and other private cloud
  data are never placed in the public response cache. Those features still require
  a connection, while the installed shell and previously cached learning content
  remain available.
- Installed users are eligible for persistent browser storage. The browser makes
  the final persistence decision and users can always clear site data.

## Release verification

1. Open the deployed site in Chrome DevTools.
2. In **Application → Manifest**, confirm the name, eX icons, start URL, and
   standalone display mode.
3. In **Application → Service workers**, confirm `/service-worker.js` controls `/`.
4. Wait for the background cache to finish, select **Offline**, and reload `/`,
   `/courses/`, `/past-papers/`, and `/practicals/`.
5. In **Cache storage**, confirm the current version has `precache`, `pages`,
   `assets`, `media`, and `external` caches.
6. Deploy a second build and confirm the old `exam-sidemann-*` cache version is
   removed after activation.
