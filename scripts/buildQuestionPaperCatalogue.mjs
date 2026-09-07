#!/usr/bin/env node
/**
 * Reads `public/qp` and writes the catalogue the Past Papers archive lists
 * from — `src/data/questionPapers.json`.
 *
 *   node scripts/buildQuestionPaperCatalogue.mjs
 *
 * Everything under `public/qp` is included, ZIMSEC and Cambridge alike; the two
 * boards sit side by side in the same archive and are told apart by a label on
 * the card rather than by being filed separately.
 *
 * Cambridge names carry their own metadata — `9709_w24_qp_43` is Mathematics,
 * October/November 2024, paper 4 variant 3 — so those are read from the file
 * name. The ZIMSEC scans are named by hand and are listed in ZIMSEC_PAPERS
 * below, because no rule reliably turns "O Level Phy P2 N2025.pdf" into a
 * title, a subject and a year.
 *
 * Re-run it whenever files are added to `public/qp`. It fails loudly if a file
 * on disk is not accounted for, so nothing is quietly dropped.
 */

import { readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const QP_DIR = resolve(ROOT, "public/qp");
const OUT = resolve(ROOT, "src/data/questionPapers.json");

/** Cambridge syllabus codes → the subject the archive files them under. */
const CAMBRIDGE_SUBJECTS = {
  9618: "Computer Science",
  9709: "Mathematics",
  9702: "Physics",
};

const CAMBRIDGE_SERIES = { s: "June", w: "November", m: "March" };

/** The standalone Cambridge syllabus documents, identified from their covers. */
const CAMBRIDGE_SYLLABUSES = {
  "664565-2025-2027-syllabus.pdf": { subject: "Physics", years: "2025–2027" },
  "721397-2027-2029-syllabus.pdf": { subject: "Computer Science", years: "2027–2029" },
  "744634-2028-2030-syllabus.pdf": { subject: "Mathematics", years: "2028–2030" },
};

/**
 * The ZIMSEC scans, named by hand.
 *
 * `type` is what the card calls the document — a paper, a specimen, or one of
 * the revision "green books", which are compilations rather than single sittings.
 */
const ZIMSEC_PAPERS = {
  // ── A Level ───────────────────────────────────────────────────────────────
  "a-level/biology/Diamond Key Biology.pdf":
    { subject: "Biology", course: "A' Level", year: "Green Book", type: "Green Book", name: "Biology · Diamond Key Green Book" },
  "a-level/biology/Zimsec A Level Biology Paper1 Practice 1.pdf":
    { subject: "Biology", course: "A' Level", year: "Practice", type: "Paper 1", name: "Biology · Paper 1 Practice" },
  "a-level/chemistry/A levelNov 2024 Chemistry Paper 3.pdf":
    { subject: "Chemistry", course: "A' Level", year: "November 2024", type: "Paper 3", name: "Chemistry · November 2024 · Paper 3" },
  "a-level/chemistry/Nov 2024 Chemistry Paper 3.pdf":
    { subject: "Chemistry", course: "A' Level", year: "November 2024", type: "Paper 3 (scan 2)", name: "Chemistry · November 2024 · Paper 3 (second scan)" },
  "a-level/chemistry/chemistry-Alevel-Specimen 2026 P2.pdf":
    { subject: "Chemistry", course: "A' Level", year: "Specimen 2026", type: "Paper 2", name: "Chemistry · 2026 Specimen · Paper 2" },
  "a-level/pure-maths/2023 Paper 1 A Level Pure Mathematics Final Revision Mr Share.pdf":
    { subject: "Pure Mathematics", course: "A' Level", year: "2023", type: "Paper 1", name: "Pure Mathematics · 2023 · Paper 1 Final Revision" },
  "a-level/pure-maths/Pure Maths November 2025 A Level.pdf":
    { subject: "Pure Mathematics", course: "A' Level", year: "November 2025", type: "Paper 1", name: "Pure Mathematics · November 2025" },

  // ── O Level · Biology ─────────────────────────────────────────────────────
  "o-level/biology/Biology O level4025Q1 Specimen.pdf":
    { subject: "Biology", course: "O' Level", year: "Specimen", type: "Paper 1", name: "Biology 4025 · Specimen · Paper 1" },
  "o-level/biology/Emerald Key Biology Greenbook.pdf":
    { subject: "Biology", course: "O' Level", year: "Green Book", type: "Green Book", name: "Biology · Emerald Key Green Book" },
  "o-level/biology/Zimsec Biology O Level Greenbook.pdf":
    { subject: "Biology", course: "O' Level", year: "Green Book", type: "Green Book", name: "Biology · ZIMSEC Green Book" },

  // ── O Level · Chemistry ───────────────────────────────────────────────────
  "o-level/chemistry/Chemistry O lvel4024Q2Specimen Paper Pdf.pdf":
    { subject: "Chemistry", course: "O' Level", year: "Specimen", type: "Paper 2", name: "Chemistry 4024 · Specimen · Paper 2" },
  "o-level/chemistry/Zimsec Chemistry Green Book.pdf":
    { subject: "Chemistry", course: "O' Level", year: "Green Book", type: "Green Book", name: "Chemistry · ZIMSEC Green Book" },

  // ── O Level · Physics ─────────────────────────────────────────────────────
  "o-level/physics/O Level Phy P2 N2025.pdf":
    { subject: "Physics", course: "O' Level", year: "November 2025", type: "Paper 2", name: "Physics · November 2025 · Paper 2" },

  // ── O Level · Combined Science ────────────────────────────────────────────
  "o-level/combined-science/Combined Science June 2025 Paper 2.pdf":
    { subject: "Combined Science", course: "O' Level", year: "June 2025", type: "Paper 2", name: "Combined Science · June 2025 · Paper 2" },
  "o-level/combined-science/Combined Science November 2024 Paper 1 Marking Scheme.pdf":
    { subject: "Combined Science", course: "O' Level", year: "November 2024", type: "Paper 1 Marking Scheme", name: "Combined Science · November 2024 · Paper 1 Marking Scheme" },
  "o-level/combined-science/Combined Science November 2025 Paper 1 Marking Scheme.pdf":
    { subject: "Combined Science", course: "O' Level", year: "November 2025", type: "Paper 1 Marking Scheme", name: "Combined Science · November 2025 · Paper 1 Marking Scheme" },
  "o-level/combined-science/Combined Science Paper 2 Marking Schemes 2018-2024.pdf":
    { subject: "Combined Science", course: "O' Level", year: "2018–2024", type: "Paper 2 Marking Schemes", name: "Combined Science · 2018–2024 · Paper 2 Marking Schemes" },

  // ── O Level · Mathematics ─────────────────────────────────────────────────
  "o-level/mathematics/Mathematics June 2025 Paper 1.pdf":
    { subject: "Mathematics", course: "O' Level", year: "June 2025", type: "Paper 1", name: "Mathematics · June 2025 · Paper 1" },
  "o-level/mathematics/Mathematics November 2020 Paper 1 Marking Guide.pdf":
    { subject: "Mathematics", course: "O' Level", year: "November 2020", type: "Paper 1 Marking Guide", name: "Mathematics · November 2020 · Paper 1 Marking Guide" },
  "o-level/mathematics/Mathematics November 2022 Paper 2 Marking Scheme.pdf":
    { subject: "Mathematics", course: "O' Level", year: "November 2022", type: "Paper 2 Marking Scheme", name: "Mathematics · November 2022 · Paper 2 Marking Scheme" },
  "o-level/mathematics/Mathematics November 2023 Paper 2.pdf":
    { subject: "Mathematics", course: "O' Level", year: "November 2023", type: "Paper 2", name: "Mathematics · November 2023 · Paper 2" },
  "o-level/mathematics/Mathematics November 2024 Paper 2 Marking Guide.pdf":
    { subject: "Mathematics", course: "O' Level", year: "November 2024", type: "Paper 2 Marking Guide", name: "Mathematics · November 2024 · Paper 2 Marking Guide" },
  "o-level/mathematics/Mathematics November 2024 Paper 2.pdf":
    { subject: "Mathematics", course: "O' Level", year: "November 2024", type: "Paper 2", name: "Mathematics 4004 · November 2024 · Paper 2" },

  // ── O Level · Geography ───────────────────────────────────────────────────
  "o-level/geography/Emerald Key Geography Green Book 2018-2019.pdf":
    { subject: "Geography", course: "O' Level", year: "Green Book", type: "Green Book", name: "Geography 4022 · Emerald Key Green Book · 2018–2019" },
  "o-level/geography/Geography 2026 Specimen Marking Scheme.pdf":
    { subject: "Geography", course: "O' Level", year: "Specimen 2026", type: "Marking Scheme", name: "Geography · 2026 Specimen · Marking Scheme" },
  "o-level/geography/Geography November 2021 Paper 2.pdf":
    { subject: "Geography", course: "O' Level", year: "November 2021", type: "Paper 2", name: "Geography · November 2021 · Paper 2" },
  "o-level/geography/Geography November 2025 Paper 2.pdf":
    { subject: "Geography", course: "O' Level", year: "November 2025", type: "Paper 2", name: "Geography · November 2025 · Paper 2" },

  // ── O Level · Principles of Accounts ──────────────────────────────────────
  "o-level/principles-of-accounts/Principles of Accounts Green Book.pdf":
    { subject: "Principles of Accounts", course: "O' Level", year: "Green Book", type: "Green Book", name: "Principles of Accounts · ZIMSEC Green Book" },
  "o-level/principles-of-accounts/Principles of Accounts November 2018 Paper 1.pdf":
    { subject: "Principles of Accounts", course: "O' Level", year: "November 2018", type: "Paper 1", name: "Principles of Accounts 4051 · November 2018 · Paper 1" },

  // ── O Level · Family and Religious Studies ────────────────────────────────
  "o-level/family-and-religious-studies/Emerald Key Family and Religious Studies Green Book 2018-2019.pdf":
    { subject: "Family and Religious Studies", course: "O' Level", year: "Green Book", type: "Green Book", name: "Family and Religious Studies 4047 · Emerald Key Green Book · 2018–2019" },

  // ── O Level · Heritage Studies ────────────────────────────────────────────
  "o-level/heritage-studies/Heritage Studies Past Paper Collection.pdf":
    { subject: "Heritage Studies", course: "O' Level", year: "Collection", type: "Past Paper Collection", name: "Heritage Studies · Past Paper Collection" },
};


/** Every PDF under `public/qp`, as paths relative to it. */
const walk = async (dir, prefix = "") => {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) found.push(...await walk(join(dir, entry.name), relative));
    else if (entry.name.toLowerCase().endsWith(".pdf")) found.push(relative);
  }
  return found;
};

const humanSize = (bytes) => (bytes >= 1024 * 1024
  ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`);

const slug = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const files = (await walk(QP_DIR)).sort();
const papers = [];
const unclaimed = [];

for (const relative of files) {
  const url = `/qp/${relative.split("/").map(encodeURIComponent).join("/")}`;
  const size = humanSize((await stat(join(QP_DIR, relative))).size);
  const name = relative.split("/").pop();

  if (relative.startsWith("cambridge/")) {
    const syllabus = CAMBRIDGE_SYLLABUSES[name];
    if (syllabus) {
      papers.push({
        id: `cam-syllabus-${slug(name)}`,
        board: "Cambridge",
        course: "A' Level",
        subject: syllabus.subject,
        year: syllabus.years,
        type: "Syllabus",
        name: `${syllabus.subject} 9709 Syllabus`.replace("9709", "") .replace(/\s+/g, " ").trim() + ` · ${syllabus.years}`,
        url,
        size,
      });
      continue;
    }

    const match = name.match(/^(\d{4})_([swm])(\d{2})_qp_(\d)(\d)/);
    if (match) {
      const [, code, series, yy, paper, variant] = match;
      const subject = CAMBRIDGE_SUBJECTS[code];
      if (!subject) {
        unclaimed.push(relative);
        continue;
      }
      const session = CAMBRIDGE_SERIES[series];
      const year = `${session} 20${yy}`;
      papers.push({
        id: `cam-${code}-${series}${yy}-${paper}${variant}`,
        board: "Cambridge",
        course: "A' Level",
        subject,
        year,
        type: `Paper ${paper} (Variant ${variant})`,
        name: `${subject} · ${year} · Paper ${paper} Variant ${variant}`,
        url,
        size,
      });
      continue;
    }
    unclaimed.push(relative);
    continue;
  }

  if (relative.startsWith("zimsec/")) {
    const key = relative.replace("zimsec/", "");
    const meta = ZIMSEC_PAPERS[key];
    if (!meta) {
      unclaimed.push(relative);
      continue;
    }
    papers.push({
      id: `zim-${slug(key)}`,
      board: "ZIMSEC",
      course: meta.course,
      subject: meta.subject,
      year: meta.year,
      type: meta.type,
      name: meta.name,
      url,
      size,
    });
    continue;
  }

  unclaimed.push(relative);
}

if (unclaimed.length) {
  console.error(`\n${unclaimed.length} file(s) in public/qp are not described yet:`);
  for (const item of unclaimed) console.error(`  ${item}`);
  console.error("Add them to ZIMSEC_PAPERS / CAMBRIDGE_SYLLABUSES in this script and re-run.\n");
  process.exit(1);
}

await writeFile(OUT, `${JSON.stringify({ papers }, null, 2)}\n`);

const byBoard = papers.reduce((totals, paper) => {
  totals[paper.board] = (totals[paper.board] || 0) + 1;
  return totals;
}, {});
console.log(`Wrote ${papers.length} papers to src/data/questionPapers.json`);
console.log(Object.entries(byBoard).map(([board, count]) => `  ${board}: ${count}`).join("\n"));
