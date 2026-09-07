#!/usr/bin/env node
/**
 * Seeds the Book Library from the files sitting in `public/Books`.
 *
 *   node scripts/seedBookLibrary.mjs                      # dry run, writes nothing
 *   node scripts/seedBookLibrary.mjs --commit             # save as private drafts
 *   node scripts/seedBookLibrary.mjs --commit --approve   # …and publish them
 *   node scripts/seedBookLibrary.mjs --audit              # what is in there, and what is hidden
 *
 * Books are `global_resources` documents of type `library`, and the security
 * rules only let an admin write them, so this signs in first:
 *
 *   ESM_ADMIN_EMAIL=you@example.com ESM_ADMIN_PASSWORD=… node scripts/seedBookLibrary.mjs --commit
 *
 * (or pass --email= and --password=). The account needs the `admin` custom
 * claim, exactly as the Resource Manager does.
 *
 * ── Rights ──────────────────────────────────────────────────────────────────
 * Every entry below has empty `sourceUrl`, `rightsHolder` and `rightsBasis`,
 * and seeds as an unverified private draft: saved, but invisible to learners.
 * That is deliberate — most of these are commercial titles, and the same rights
 * review the admin form enforces applies here. Fill those three fields in for a
 * book and it can be published, either by ticking the boxes in the Resource
 * Manager or by re-running with `--approve`, which refuses to publish any book
 * whose provenance is still blank.
 *
 * Re-running is safe: a book whose `url` is already in the collection is left
 * alone rather than duplicated.
 */

import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BOOKS_DIR = resolve(ROOT, "public/Books");

/**
 * The catalogue lives in `src/data/bookLibrary.json`, which the app also renders
 * directly — one list, so a book cannot be on the shelf under one name and in
 * Firestore under another. Each entry already carries its URL, cover and
 * measured size; the rights fields are the ones to fill in before publishing.
 */
const CATALOGUE = JSON.parse(await readFile(resolve(ROOT, "src/data/bookLibrary.json"), "utf8")).books;

/** "/Books/New%20General…pdf" → "New General…pdf" */
const basename = (url) => decodeURIComponent(url.replace(/^\/Books\//, ""));

const flags = new Set(process.argv.slice(2).filter((arg) => !arg.includes("=")));
const valueOf = (name) => {
  const match = process.argv.slice(2).find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.slice(name.length + 3) : "";
};

const COMMIT = flags.has("--commit");
const AUDIT = flags.has("--audit");
const APPROVE = flags.has("--approve");
const EMAIL = valueOf("email") || process.env.ESM_ADMIN_EMAIL || "";
const PASSWORD = valueOf("password") || process.env.ESM_ADMIN_PASSWORD || "";

/** Read the web config out of src/services/firebase.ts rather than keeping a copy. */
const firebaseConfig = async () => {
  const source = await readFile(resolve(ROOT, "src/services/firebase.ts"), "utf8");
  const block = source.match(/const firebaseConfig = \{([\s\S]*?)\};/);
  if (!block) throw new Error("Could not find firebaseConfig in src/services/firebase.ts");
  const config = {};
  for (const [, key, value] of block[1].matchAll(/(\w+):\s*"([^"]*)"/g)) config[key] = value;
  return config;
};

/** "/Books/New-General-Mathematics-3-1.pdf", encoded for the spaces and brackets. */
const publicUrl = (name) => `/Books/${encodeURIComponent(name)}`;

const humanSize = (bytes) => (bytes >= 1024 * 1024
  ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const exists = async (name) => {
  try {
    return (await stat(resolve(BOOKS_DIR, name))).size;
  } catch {
    return null;
  }
};

/** Fill in what the filesystem knows and complain about what it does not. */
const prepare = async () => {
  const problems = [];
  const books = [];

  for (const entry of CATALOGUE) {
    // The catalogue carries served URLs; the checks below want the path on disk.
    const file = basename(entry.url);
    const cover = entry.coverUrl ? basename(entry.coverUrl) : "";
    const size = await exists(file);
    if (size === null) {
      problems.push(`missing file: ${file}`);
      continue;
    }
    if (cover && (await exists(cover)) === null) {
      problems.push(`missing cover: ${cover} (for ${entry.title})`);
    }
    if (APPROVE && (!entry.sourceUrl || !entry.rightsHolder || !entry.rightsBasis)) {
      problems.push(`no rights recorded, cannot approve: ${entry.title}`);
      continue;
    }
    books.push({
      type: "library",
      title: entry.title,
      author: entry.author,
      url: entry.url,
      coverUrl: entry.coverUrl || "",
      course: entry.course,
      subject: entry.subject,
      size: humanSize(size),
      sourceUrl: entry.sourceUrl,
      rightsHolder: entry.rightsHolder,
      rightsBasis: entry.rightsBasis,
    });
  }

  return { books, problems };
};

/** Sign in as an admin and hand back a live Firestore handle. */
const connect = async () => {
  if (!EMAIL || !PASSWORD) {
    console.error(
      "\nAn admin sign-in is required to reach global_resources.\n" +
        "  ESM_ADMIN_EMAIL=… ESM_ADMIN_PASSWORD=… node scripts/seedBookLibrary.mjs --commit",
    );
    process.exit(1);
  }
  const app = initializeApp(await firebaseConfig());
  const auth = getAuth(app);
  const db = getFirestore(app);
  await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
  const token = await auth.currentUser.getIdTokenResult();
  if (token.claims.admin !== true) {
    console.error(`\n${EMAIL} signed in but does not carry the admin claim; the rules will reject every write.`);
    process.exit(1);
  }
  return { auth, db };
};

/**
 * What is actually in the library right now, and why each book is or is not
 * visible to a learner.
 *
 * The library shows a book only when `approved` and `rightsVerified` are both
 * true *and* its source, rights holder and licence basis are all filled in —
 * the query and the filter behind it live in src/features/resources/CompactLibrary.tsx.
 * A book can therefore be saved, correct, and still invisible.
 */
if (AUDIT) {
  const { db } = await connect();
  const snapshot = await getDocs(query(collection(db, "global_resources"), where("type", "==", "library")));

  if (snapshot.empty) {
    console.log("\nNo library books in global_resources at all — the seed has not been committed yet.");
    process.exit(0);
  }

  let visible = 0;
  console.log(`\n${snapshot.size} library book${snapshot.size === 1 ? "" : "s"} in global_resources:\n`);
  snapshot.forEach((document) => {
    const book = document.data();
    const missing = [];
    if (book.approved !== true) missing.push("not approved");
    if (book.rightsVerified !== true) missing.push("rights unverified");
    if (!book.sourceUrl?.trim()) missing.push("no source URL");
    if (!book.rightsHolder?.trim()) missing.push("no rights holder");
    if (!book.rightsBasis?.trim()) missing.push("no licence basis");
    if (!book.course?.trim()) missing.push("no level");
    if (!missing.length) visible += 1;
    console.log(
      `  ${missing.length ? "hidden " : "VISIBLE"}  ${(book.course || "—").padEnd(8)} ${book.title}` +
        `${missing.length ? `\n            ${missing.join(", ")}` : ""}`,
    );
  });

  console.log(`\n${visible} of ${snapshot.size} would show in the Book Library.`);
  console.log("A hidden book needs its rights fields filled in and then approving — in the Resource Manager, or by");
  console.log("filling them into the catalogue in this file and re-running with --commit --approve.");
  process.exit(0);
}

const { books, problems } = await prepare();

for (const problem of problems) console.warn(`  ! ${problem}`);

console.log(`\n${books.length} book${books.length === 1 ? "" : "s"} ready:\n`);
for (const book of books) {
  console.log(`  ${book.course.padEnd(8)} ${book.subject.padEnd(22)} ${book.size.padStart(8)}  ${book.title}`);
}

if (!COMMIT) {
  console.log("\nDry run — nothing written. Re-run with --commit to save them.");
  if (problems.length) console.log("Fix the warnings above first.");
  process.exit(problems.length ? 1 : 0);
}

const { auth, db } = await connect();

// One read of what is already there, so a re-run tops up rather than duplicates.
const existing = new Set();
const snapshot = await getDocs(query(collection(db, "global_resources"), where("type", "==", "library")));
snapshot.forEach((document) => existing.add(document.data().url));

let written = 0;
let skipped = 0;
for (const book of books) {
  if (existing.has(book.url)) {
    skipped += 1;
    continue;
  }
  await addDoc(collection(db, "global_resources"), {
    ...book,
    rightsVerified: APPROVE,
    rightsVerifiedAt: APPROVE ? serverTimestamp() : null,
    rightsVerifiedBy: APPROVE ? auth.currentUser.uid : null,
    approved: APPROVE,
    approvedAt: APPROVE ? serverTimestamp() : null,
    approvedBy: APPROVE ? auth.currentUser.uid : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  written += 1;
}

console.log(
  `\nWrote ${written} book${written === 1 ? "" : "s"}` +
    `${skipped ? `, skipped ${skipped} already in the library` : ""}` +
    `${APPROVE ? " and published them." : " as private drafts — approve them in the Resource Manager."}`,
);
process.exit(0);
