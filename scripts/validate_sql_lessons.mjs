#!/usr/bin/env node
/**
 * Runs every Teach Me lesson through the same in-browser SQL engine the console
 * uses, in the same order, and reports anything that would not behave.
 *
 *   node scripts/validate_sql_lessons.mjs
 *
 * A narrated lesson makes a promise the moment it says "look, we just created a
 * table". This is what keeps that promise honest: a lesson whose SQL does not
 * actually run in alasql is a lesson that lies to the learner while the voice
 * carries on regardless.
 *
 * Steps marked `serverOnly` are skipped (they are MySQL-only DCL) and steps
 * marked `expectError` are required to fail.
 */

import { readdir, readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const alasql = require("alasql");

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LESSON_DIR = join(ROOT, "src/features/courses/polytechnic/nc-it/database-concepts/teach-me");

/** Mirrors how SQLPractice splits an editor buffer before running it. */
function statementsOf(sql) {
  return sql
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

/** A fragment that is only a comment never reaches the engine in the console either. */
function isOnlyComment(statement) {
  return statement.split("\n").every((line) => line.trim() === "" || line.trim().startsWith("--"));
}

const files = (await readdir(LESSON_DIR)).filter((name) => name.endsWith(".json")).sort();
const problems = [];
let stepsRun = 0;
let statementsRun = 0;

for (const file of files) {
  const chapter = JSON.parse(await readFile(join(LESSON_DIR, file), "utf8"));

  for (const lesson of chapter.lessons) {
    if (lesson.setupSql) {
      for (const statement of statementsOf(lesson.setupSql)) {
        if (isOnlyComment(statement)) continue;
        try {
          alasql(statement);
        } catch (error) {
          // Setup is allowed to fail on tidy-up statements only.
          if (!/^DROP\s/i.test(statement)) {
            problems.push(`${lesson.id} · setup · ${statement.split("\n")[0]} — ${error.message.split("\n")[0]}`);
          }
        }
      }
    }

    for (const step of lesson.steps) {
      if (!step.sql) continue;
      stepsRun += 1;
      if (step.serverOnly) continue;

      let failure = null;
      for (const statement of statementsOf(step.sql)) {
        if (isOnlyComment(statement)) continue;
        statementsRun += 1;
        try {
          alasql(statement);
        } catch (error) {
          failure = `${statement.split("\n")[0]} — ${error.message.split("\n")[0]}`;
          break;
        }
      }

      if (step.expectError && !failure) {
        problems.push(`${lesson.id}/${step.id} — expected this step to fail, but it succeeded`);
      } else if (!step.expectError && failure) {
        problems.push(`${lesson.id}/${step.id} — ${failure}`);
      }
    }
  }
}

console.log(`Checked ${files.length} chapters, ${stepsRun} steps with SQL, ${statementsRun} statements.`);
if (problems.length === 0) {
  console.log("All lesson SQL runs as narrated.");
} else {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  - ${problem}`);
  process.exitCode = 1;
}
