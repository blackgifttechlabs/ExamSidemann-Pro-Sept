# Google sign-in deployment

Phones and cross-origin isolated pages use Firebase full-page redirect sign-in.
The app consumes the result on startup and opens the dashboard after success.
Non-isolated desktop browsers use a popup, with redirect fallback if blocked.

The auth helper stays on the app origin so Safari and browsers blocking
third-party storage can finish login. Vercel, Netlify, Vite dev and Vite preview
proxy `/__/auth/*` to `https://testing-3d5b2.firebaseapp.com/__/auth/*`.
The service worker must never cache or intercept these URLs.

Before deploying, configure the existing Google OAuth client used by the
`testing-3d5b2` Firebase Authentication Google provider:

1. In Firebase Authentication > Settings > Authorized domains, include
   `www.examsidemann.com` (and any other host where sign-in is supported).
2. In Google Cloud > APIs & Services > Credentials, add this exact Authorized
   redirect URI to that provider's OAuth client:
   `https://www.examsidemann.com/__/auth/handler`
   Keep the existing Firebase callback URI. For other supported hosts, register
   their matching callback URI too. Local Vite testing requires the matching
   `http://localhost:5173/__/auth/handler` callback and authorized localhost.
3. Deploy the app and hosting rewrites together. Ensure `/__/auth/iframe` serves
   the Firebase helper rather than the app HTML. Test on iPhone Safari and
   Android Chrome with third-party cookies blocked: choose an account, return
   to the dashboard, reload and confirm the session persists. Also check cancel
   and retry, and desktop login.

These console settings cannot be verified from this repository. Missing callback
registration results in Google's `redirect_uri_mismatch` error.

Reference: https://firebase.google.com/docs/auth/web/redirect-best-practices#proxy-requests
