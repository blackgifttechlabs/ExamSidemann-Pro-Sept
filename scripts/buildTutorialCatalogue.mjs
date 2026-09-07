/**
 * Generates src/data/zimsecTutorialsCompact.json - the catalogue the app ships.
 *
 * The full src/data/zimsecTutorials.json is the source of truth (and what
 * scripts/importTutorials.mjs writes to Firestore), but it carries fields the
 * UI can rebuild for itself: url, thumbnail and description are all derivable
 * from the video id. Stripping them roughly halves the payload, which matters
 * because this file is bundled into the app rather than fetched per row.
 *
 * Run after regenerating the catalogue:
 *   node scripts/buildTutorialCatalogue.mjs
 */
import { readFileSync, writeFileSync } from 'fs';

const IN = new URL('../src/data/zimsecTutorials.json', import.meta.url);
const OUT = new URL('../src/data/zimsecTutorialsCompact.json', import.meta.url);

const full = JSON.parse(readFileSync(IN, 'utf8'));

const compact = full.map((v) => ({
  i: v.videoId,
  t: v.title,
  s: v.subject,
  g: v.grade,
  c: String(v.teacherName || '').trim(),
  d: v.durationSeconds || 0,
  v: v.youtubeViews || 0,
}));

writeFileSync(OUT, JSON.stringify(compact));

const before = readFileSync(IN, 'utf8').length;
const after = JSON.stringify(compact).length;
console.log(`entries: ${compact.length}`);
console.log(`${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
