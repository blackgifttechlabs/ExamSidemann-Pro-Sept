/**
 * Imports the curated ZIMSEC YouTube tutorials in src/data/zimsecTutorials.json into
 * the Firestore `tutorials` collection that /tutorials reads from.
 *
 * Dry run (default - writes nothing, just reports what would happen):
 *   node scripts/importTutorials.mjs
 *
 * Commit for real:
 *   TUTORIAL_ADMIN_EMAIL=you@example.com \
 *   TUTORIAL_ADMIN_PASSWORD='...' \
 *   node scripts/importTutorials.mjs --commit
 *
 * Filter to part of the catalogue:
 *   node scripts/importTutorials.mjs --grade "Form 3" --subject Mathematics --limit 50
 *
 * Notes:
 *  - Credentials are read from the environment and never stored.
 *  - Videos already in Firestore (matched on url) are skipped, so re-running is
 *    safe and resumable.
 *  - createdAt is required: VideoLibrary lists tutorials with
 *    orderBy('createdAt'), and Firestore silently omits documents that lack the
 *    field being ordered on.
 */
import { readFileSync } from 'fs';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore, collection, getDocs, query, addDoc, serverTimestamp,
} from 'firebase/firestore';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const COMMIT = args.includes('--commit');
const ONLY_GRADE = flag('grade');
const ONLY_SUBJECT = flag('subject');
const LIMIT = Number(flag('limit') || 0);

const firebaseConfig = {
  apiKey: 'AIzaSyB8Tg1JSxd_DWX5b99pSPIZHECPwBBxnrE',
  authDomain: 'testing-3d5b2.firebaseapp.com',
  projectId: 'testing-3d5b2',
  storageBucket: 'testing-3d5b2.firebasestorage.app',
  messagingSenderId: '291797509956',
  appId: '1:291797509956:web:05f115bb2cd98e9e565911',
};

let catalogue = JSON.parse(readFileSync(new URL('../src/data/zimsecTutorials.json', import.meta.url), 'utf8'));
if (ONLY_GRADE) catalogue = catalogue.filter((v) => v.grade === ONLY_GRADE);
if (ONLY_SUBJECT) catalogue = catalogue.filter((v) => v.subject === ONLY_SUBJECT);
if (LIMIT > 0) catalogue = catalogue.slice(0, LIMIT);

console.log(`catalogue entries selected: ${catalogue.length}`);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const email = process.env.TUTORIAL_ADMIN_EMAIL;
const password = process.env.TUTORIAL_ADMIN_PASSWORD;
let uid = 'zimsec-youtube-import';

if (COMMIT) {
  if (!email || !password) {
    console.error('\nRefusing to write: set TUTORIAL_ADMIN_EMAIL and TUTORIAL_ADMIN_PASSWORD.');
    console.error('Firestore rules almost certainly reject unauthenticated writes anyway.');
    process.exit(1);
  }
  const cred = await signInWithEmailAndPassword(getAuth(app), email, password);
  uid = cred.user.uid;
  console.log(`signed in as ${cred.user.email}`);
}

// Skip anything already present, so this is safe to re-run.
//
// Keyed on url + grade, not url alone: an O Level topic lesson is listed under
// both Form 3 and Form 4, and a url-only key would import one and silently
// treat the other as a duplicate.
const existing = new Set();
const snap = await getDocs(query(collection(db, 'tutorials')));
snap.forEach((d) => {
  const { url, grade } = d.data();
  if (url) existing.add(`${url}|${grade || ''}`);
});
console.log(`already in Firestore: ${existing.size}`);

const pending = catalogue.filter((v) => !existing.has(`${v.url}|${v.grade}`));
console.log(`to import: ${pending.length}\n`);

const perGrade = {};
pending.forEach((v) => { perGrade[v.grade] = (perGrade[v.grade] || 0) + 1; });
console.log('breakdown:', perGrade, '\n');

if (!COMMIT) {
  pending.slice(0, 10).forEach((v) => console.log(`  [${v.grade}/${v.subject}] ${v.title}`));
  if (pending.length > 10) console.log(`  ... and ${pending.length - 10} more`);
  console.log('\nDRY RUN - nothing written. Re-run with --commit to import.');
  process.exit(0);
}

let written = 0;
for (const v of pending) {
  await addDoc(collection(db, 'tutorials'), {
    title: v.title,
    url: v.url,
    thumbnail: v.thumbnail,
    subject: v.subject,
    grade: v.grade,
    topic: v.subject,
    description: v.description,
    teacherId: uid,
    teacherName: v.teacherName,
    source: 'youtube',
    sourceChannelUrl: v.sourceChannelUrl || null,
    durationSeconds: v.durationSeconds || 0,
    views: 0,
    likes: 0,
    createdAt: serverTimestamp(),
  });
  written++;
  if (written % 25 === 0) console.log(`  imported ${written}/${pending.length}`);
}
console.log(`\ndone - imported ${written} tutorials.`);
process.exit(0);
