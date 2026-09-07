// Exercises the analytics_* rules as an unauthenticated
// visitor against the Firestore emulator. Run through `emulators:exec`.
import { initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  increment,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

const app = initializeApp({ projectId: 'demo-rules-check', apiKey: 'fake' });
const db = getFirestore(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);

let failures = 0;

const expect = async (label, shouldPass, run) => {
  let passed = true;
  let error = null;
  try {
    await run();
  } catch (err) {
    passed = false;
    error = err;
  }
  const ok = passed === shouldPass;
  if (!ok) failures += 1;
  const verdict = ok ? 'ok  ' : 'FAIL';
  const detail = passed === shouldPass ? '' : `  <- ${passed ? 'was allowed' : error?.code || error?.message}`;
  console.log(`${verdict} ${shouldPass ? 'allow' : 'deny '} ${label}${detail}`);
};

const day = '2026-08-17';
const pagePath = '/schools/search/high';
const pageId = '~schools~search~high';

// 1. First page view of the day, exactly as trackPageView writes it.
await expect('daily: first page view', true, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    {
      date: day,
      views: increment(1),
      visitors: increment(1),
      newVisitors: increment(1),
      sessions: increment(1),
      deviceMobile: increment(1),
      refDirect: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  ),
);

await expect('daily: another page view', true, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    { date: day, views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('daily: engagement flush', true, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    { date: day, timeMs: increment(45000), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('daily: inflated counter', false, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    { date: day, views: increment(100000), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('daily: counter pushed downwards', false, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    { date: day, views: 0, updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('daily: smuggled extra field', false, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    { date: day, views: increment(1), payload: 'x'.repeat(500), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('daily: client-chosen timestamp', false, () =>
  setDoc(
    doc(db, 'analytics_daily', day),
    { date: day, views: increment(1), updatedAt: new Date('2030-01-01') },
    { merge: true },
  ),
);

await expect('daily: id not matching date field', false, () =>
  setDoc(
    doc(db, 'analytics_daily', '2026-08-18'),
    { date: day, views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

// The dashboard opens without a sign-in, so these reads must succeed for anyone.
await expect('daily: dashboard read, not signed in', true, () =>
  getDoc(doc(db, 'analytics_daily', day)),
);

// 2. Page rows.
await expect('page_daily: create then update', true, async () => {
  const ref = doc(db, 'analytics_page_daily', `${day}__${pageId}`);
  await setDoc(
    ref,
    {
      date: day,
      path: pagePath,
      title: 'Find a school',
      views: increment(1),
      visitors: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  await setDoc(
    ref,
    { date: day, path: pagePath, title: 'Find a school', timeMs: increment(30000), updatedAt: serverTimestamp() },
    { merge: true },
  );
});

await expect('page_daily: path rewritten under an existing row', false, () =>
  setDoc(
    doc(db, 'analytics_page_daily', `${day}__${pageId}`),
    { date: day, path: '/somewhere-else', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('page_daily: path that is not a path', false, () =>
  setDoc(
    doc(db, 'analytics_page_daily', `${day}__bogus`),
    { date: day, path: 'javascript:alert(1)', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('pages: lifetime totals', true, () =>
  setDoc(
    doc(db, 'analytics_pages', pageId),
    {
      path: pagePath,
      title: 'Find a school',
      views: increment(1),
      lastViewedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  ),
);

// 3. Country rollups. The code is derived from the visitor's timezone, so the
//    rules only accept a two-letter code and nothing finer-grained.
await expect('geo: country rollup', true, () =>
  setDoc(
    doc(db, 'analytics_geo_daily', `${day}__ZW`),
    { date: day, country: 'ZW', sessions: increment(1), views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('geo: lowercase country', false, () =>
  setDoc(
    doc(db, 'analytics_geo_daily', `${day}__zw`),
    { date: day, country: 'zw', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('geo: a city smuggled in as a country', false, () =>
  setDoc(
    doc(db, 'analytics_geo_daily', `${day}__X1`),
    { date: day, country: 'ZW', city: 'Bulawayo', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('geo: country rewritten under an existing row', false, () =>
  setDoc(
    doc(db, 'analytics_geo_daily', `${day}__ZW`),
    { date: day, country: 'ZA', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('geo: dashboard read, not signed in', true, () =>
  getDoc(doc(db, 'analytics_geo_daily', `${day}__ZW`)),
);

// 4. Sessions.
const sessionId = 'session-under-test';

await expect('source: exact referrer rollup', true, () =>
  setDoc(
    doc(db, 'analytics_source_daily', `${day}__search__google`),
    {
      date: day,
      category: 'search',
      source: 'google',
      sessions: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  ),
);

await expect('source: URL path is refused', false, () =>
  setDoc(
    doc(db, 'analytics_source_daily', `${day}__other__unsafe`),
    {
      date: day,
      category: 'other',
      source: 'example.com/private/path?query=secret',
      sessions: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  ),
);

await expect('session: create', true, () =>
  setDoc(
    doc(db, 'analytics_sessions', sessionId),
    {
      date: day,
      path: pagePath,
      title: 'Find a school',
      landing: pagePath,
      device: 'mobile',
      referrer: 'search',
      referrerSource: 'google',
      views: increment(1),
      timeMs: 0,
      startedAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
      expiresAt: new Date(Date.now() + 86400000),
    },
    { merge: true },
  ),
);

await expect('session: heartbeat', true, () =>
  setDoc(
    doc(db, 'analytics_sessions', sessionId),
    { timeMs: increment(15000), lastSeenAt: serverTimestamp() },
    { merge: true },
  ),
);

await expect('session: made-up device label', false, () =>
  setDoc(
    doc(db, 'analytics_sessions', `${sessionId}-2`),
    {
      date: day,
      path: pagePath,
      device: 'toaster',
      referrer: 'direct',
      views: increment(1),
      startedAt: serverTimestamp(),
      lastSeenAt: serverTimestamp(),
    },
    { merge: true },
  ),
);

await expect('session: dashboard read, not signed in', true, () =>
  getDoc(doc(db, 'analytics_sessions', sessionId)),
);

// Opening reads must not have opened anything else: user records stay private.
await expect('users: still unreadable', false, () => getDoc(doc(db, 'users', 'someone')));

await expect('analytics: deletion still refused', false, () =>
  deleteDoc(doc(db, 'analytics_daily', day)),
);

// 5. The batch the tracker actually commits must go through as one unit.
await expect('tracker batch commit', true, () => {
  const batch = writeBatch(db);
  batch.set(
    doc(db, 'analytics_daily', day),
    { date: day, views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  );
  batch.set(
    doc(db, 'analytics_source_daily', `${day}__search__google`),
    {
      date: day,
      category: 'search',
      source: 'google',
      sessions: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  batch.set(
    doc(db, 'analytics_page_daily', `${day}__${pageId}`),
    { date: day, path: pagePath, title: 'Find a school', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  );
  batch.set(
    doc(db, 'analytics_pages', pageId),
    { path: pagePath, title: 'Find a school', views: increment(1), lastViewedAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true },
  );
  batch.set(
    doc(db, 'analytics_geo_daily', `${day}__ZW`),
    { date: day, country: 'ZW', views: increment(1), updatedAt: serverTimestamp() },
    { merge: true },
  );
  batch.set(
    doc(db, 'analytics_sessions', sessionId),
    { date: day, path: pagePath, title: 'Find a school', country: 'ZW', views: increment(1), lastSeenAt: serverTimestamp() },
    { merge: true },
  );
  return batch.commit();
});

// 6. The catch-all must still deny everything else.
await expect('unrelated collection still closed', false, () =>
  setDoc(doc(db, 'analytics_free_for_all', 'x'), { hello: 'world' }),
);

console.log(failures === 0 ? '\nALL RULES CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
