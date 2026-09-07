# Visitor Analytics — how it works and what to switch on

Every page view, visitor and reading minute on the site is recorded in Firestore
and shown in **Admin → Analytics**. Nothing here uses Google Analytics; it is our
own data, in our own database.

---

## 1. Opening the admin area

Tap **© 2026** in the footer **five times quickly** (within 1.5 s of each tap) and
the site opens `/admin`.

**This works for anybody who finds it.** There is no email allowlist and no
sign-in check on the route — that is deliberate, so the dashboard opens without
any setup.

What keeps it safe is that the route is a shell, not a key. Every screen behind
it reads and writes through Firestore, and those rules still demand the `admin`
custom claim:

| Screen | Someone who stumbles in | You, with the `admin` claim |
|---|---|---|
| Analytics | works — the numbers are public by design | works |
| News, Comments, Schools, Calendar, Resources | loads nothing, saves nothing | works |
| Users | loads nothing — no email or profile ever leaves Firestore | works |

**The trade you accepted:** your traffic figures are readable by anyone who knows
the collection names, not only through the dashboard. That includes the live
"on the site now" panel. No visitor is identifiable in any of it — see *What is
not stored* below.

### To close the door again

Two edits, both small:

1. In `src/app/App.tsx`, restore the check on `AdminRoute` — the comment there spells out
   what used to be in it — and set `VITE_ADMIN_EMAILS=you@example.com` in
   `.env.local` and in the deployment's environment variables.
2. In `firestore.rules`, change the four `allow read: if true;` lines in the
   `analytics_*` blocks back to `allow read: if isAdmin();`, then redeploy.

### Setting the `admin` claim (needed for every screen except Analytics)

Only the Admin SDK can do this, never the browser:

```js
// node setAdmin.mjs — run once, from a machine holding the service-account key
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

initializeApp({ cert: cert('./service-account.json') });
const user = await getAuth().getUserByEmail('you@example.com');
await getAuth().setCustomUserClaims(user.uid, { admin: true });
```

The account has to sign out and back in before its token carries the claim.

---

## 2. Deploy the rules

The analytics collections are refused until the new rules are live:

```
firebase deploy --only firestore:rules,firestore:indexes
```

Analytics automatically retries against `examsidemann-login-4ec4f` when the
primary project reports `resource-exhausted` (quota reached). The admin
dashboard adds the counters from both projects, so the switch is invisible in
the totals. Deploy the same rules and indexes to the fallback project too:

```
firebase deploy --project examsidemann-login-4ec4f --only firestore:rules,firestore:indexes
```

The switch is intentionally limited to analytics. Login, user profiles and
other application records are not split between databases.

If the primary project cannot be read during a quota outage, Admin combines
the last primary summaries in the browser's persistent Firestore cache with
fresh summaries from the fallback project. The fallback stores the same daily,
hourly, page, country, source and session summary collections; it is not merely
a temporary browser cache. When both projects are readable, the cached API
combines their summaries directly.

To check the rules still behave after any edit:

```
npx firebase-tools emulators:exec --only firestore \
  --project demo-rules-check "node scripts/checkAnalyticsRules.mjs"
```

That script writes as an unauthenticated visitor and asserts what must be
allowed (a page view, an engagement flush, the dashboard's reads) and what must
be refused (inflated counters, extra fields, client-chosen timestamps, a city
smuggled in beside a country, deleting anything, and reading `users`).

---

## 3. What gets stored

| Collection | One document per | Holds |
|---|---|---|
| `analytics_daily` | day | views, visitors, new visitors, sessions, time spent, device split, traffic sources |
| `analytics_hourly` | hour | views, sessions and time spent — powers Today's graph without reading raw sessions |
| `analytics_page_daily` | page × day | views, visitors, time spent — this is what the date filters read |
| `analytics_pages` | page, all time | lifetime views and time — this is what **All time** reads |
| `analytics_geo_daily` | country × day | sessions and views per country |
| `analytics_sessions` | visit | current page, device, source, country, page count, last seen — powers "on the site now" |

Counters are updated with `increment()`, so concurrent visitors never overwrite
each other, and a month of traffic costs a few dozen reads to display instead of
tens of thousands.

### Vercel dashboard cache

`/api/dashboard-metrics` is a Vercel Function that combines the bounded
aggregate queries into one response. Vercel's CDN and warm function instances
cache each date-range response for 60 seconds, so repeat dashboard loads do not
read Firestore. It uses the REST-based Firebase Lite client and can only read
the privacy-safe aggregate collections allowed by Firestore rules; no service
account key is stored in Vercel. If the function is unavailable during local
development, the dashboard automatically uses the bounded browser queries.

Days are bucketed in **Africa/Harare** time, not the visitor's timezone, so
"today" means the same thing for every reader of the dashboard.

### Country, and why there is no province

Country comes from the browser's own timezone — `Africa/Harare` means Zimbabwe —
so it costs nothing, needs no third-party service, and no visitor data leaves the
site. It is right at country level and wrong only for the occasional traveller or
VPN user. A timezone we do not recognise is counted as `ZZ`, shown as
"Elsewhere", rather than guessed at.

**Province is not in here, because a browser cannot know it.** Timezones stop at
the country. The only ways to get finer are a paid geo-IP lookup — which means
sending every visitor's IP to another company, and which in Zimbabwe resolves
most mobile traffic to Harare regardless of where the reader actually is — or the
Geolocation permission prompt, which most visitors decline. Either would produce
a provincial breakdown that looks precise and is not.

### What is not stored

No IP addresses, no user-agent strings, no account ids, no cross-site
identifiers, no coordinates. A visitor is a random string generated in their own
browser. If they declined analytics cookies in the consent banner, that string is
kept only for the tab session, so nothing persists after they close it — the
visit is still counted, it just cannot be recognised as a return visit.

Pages with an id in the URL are grouped: `/news/article/aZ8kQm31xPr9` is recorded
as `/news/article/:id`, so one article route is one row rather than hundreds.
`/admin` itself is never recorded.

---

## 4. Two things worth turning on

**Firebase App Check.** The write rules cap how much a single request can add to
any counter, but a script could still add visits one write at a time — true of
any analytics that runs in the browser. App Check is what stops that properly,
and it matters more now that reads are open.

**A TTL policy on `analytics_sessions`.** Session documents carry an `expiresAt`
field 90 days out. In the Firebase console, Firestore → TTL → create a policy on
collection `analytics_sessions`, field `expiresAt`, and they clean themselves up.
The daily, per-page and per-country rollups are small and are meant to be kept.

---

## 5. Reading the dashboard

- **Date filters** — Today, This week (7 days), 30 days, 90 days, All time, or a
  custom start/end pair.
- **Sorting the page list** — Most visits, Most visitors, Most time spent, or A–Z,
  with a search box for finding one page.
- **Time on site** is *engaged* time: it only accrues while the tab is visible
  and the reader has interacted in the last 90 seconds, sampled every 15 seconds.
  A tab left open on a desk does not inflate it.
- **All time** reads the lifetime page totals in one small query. Very wide custom
  ranges read per-day rows and are capped at 4,000 of them; if a range is wider
  than that, the dashboard says so and asks you to narrow it or use All time.
