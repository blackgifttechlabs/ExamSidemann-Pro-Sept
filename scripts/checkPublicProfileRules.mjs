// Exercises the /public_profiles rules against the Firestore emulator: what a
// student may publish about themselves, and what stays private in /users.
// Run through `emulators:exec`.
import { initializeApp } from 'firebase/app';
import {
  connectFirestoreEmulator,
  collection,
  doc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { connectAuthEmulator, getAuth, signInAnonymously, signOut } from 'firebase/auth';

const app = initializeApp({ projectId: 'demo-rules-check', apiKey: 'fake' });
const db = getFirestore(app);
const auth = getAuth(app);
connectFirestoreEmulator(db, '127.0.0.1', 8080);
connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });

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
  console.log(
    `${ok ? 'ok  ' : 'FAIL'} ${shouldPass ? 'allow' : 'deny '} ${label}` +
      (ok ? '' : `  <- ${passed ? 'was allowed' : error?.code || error?.message}`),
  );
};

const rowFor = (extra = {}) => ({
  displayName: 'Tendai Moyo',
  school: 'Prince Edward School',
  grade: 'Form 4',
  level: 'Form 4',
  subjects: ['Mathematics', 'Combined Science'],
  totalPoints: 120,
  streak: 3,
  role: 'student',
  updatedAt: serverTimestamp(),
  ...extra,
});

// A signed-out visitor may not browse students at all.
await expect('signed out: cannot read the directory', false, () =>
  getDocs(query(collection(db, 'public_profiles'), limit(1))),
);

const me = (await signInAnonymously(auth)).user.uid;

await expect('own row: publish', true, () =>
  setDoc(doc(db, 'public_profiles', me), rowFor(), { merge: true }),
);

await expect('own row: email smuggled in', false, () =>
  setDoc(doc(db, 'public_profiles', me), rowFor({ email: 'tendai@example.com' }), { merge: true }),
);

await expect('own row: phone number smuggled in', false, () =>
  setDoc(doc(db, 'public_profiles', me), rowFor({ phone: '+263771234567' }), { merge: true }),
);

await expect('own row: client-chosen timestamp', false, () =>
  setDoc(doc(db, 'public_profiles', me), rowFor({ updatedAt: new Date('2030-01-01') }), {
    merge: true,
  }),
);

await expect('own row: negative score', false, () =>
  setDoc(doc(db, 'public_profiles', me), rowFor({ totalPoints: -5 }), { merge: true }),
);

await expect('own row: 400 subjects', false, () =>
  setDoc(
    doc(db, 'public_profiles', me),
    rowFor({ subjects: Array.from({ length: 400 }, (_, i) => `Subject ${i}`) }),
    { merge: true },
  ),
);

await expect("somebody else's row", false, () =>
  setDoc(doc(db, 'public_profiles', 'some-other-student'), rowFor(), { merge: true }),
);

// The two queries the dashboard actually runs.
await expect('signed in: global ranking query', true, () =>
  getDocs(query(collection(db, 'public_profiles'), orderBy('totalPoints', 'desc'), limit(25))),
);

await expect('signed in: classmates query', true, () =>
  getDocs(
    query(
      collection(db, 'public_profiles'),
      where('level', '==', 'Form 4'),
      orderBy('totalPoints', 'desc'),
      limit(60),
    ),
  ),
);

// The whole point of the collection: /users stays unlistable.
await expect('signed in: cannot list /users', false, () =>
  getDocs(query(collection(db, 'users'), limit(5))),
);

await signOut(auth);

console.log(failures === 0 ? '\nALL PUBLIC PROFILE CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
