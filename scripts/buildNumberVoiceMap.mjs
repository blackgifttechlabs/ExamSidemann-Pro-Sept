#!/usr/bin/env node
/**
 * Measures the one-take counting recording and writes the slice map the game
 * plays from.
 *
 *   node scripts/buildNumberVoiceMap.mjs [path/to/numbers.mp3]
 *
 * The reader records every number from one to twenty in a single file with a
 * clear pause between each. This asks ffmpeg where that file is actually
 * silent, keeps the stretches that contain speech, and writes each stretch out
 * against its number — so the map matches the pauses the reader really took
 * rather than the ones they were asked for.
 *
 * Re-run it whenever the clip is re-recorded. Requires ffmpeg on PATH.
 */

import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const CLIP = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(ROOT, "public/sounds/ecd/maths/numbers.mp3");
const PUBLIC_URL = "/sounds/ecd/maths/numbers.mp3";
const MAP_FILE = resolve(ROOT, "src/data/ecdNumberVoice.json");

const EXPECTED = 20;

/** Anything quieter than this for at least this long counts as a pause. */
const NOISE_FLOOR = "-34dB";
const MIN_SILENCE = 0.28;
/** Pad each slice so a soft start or a trailing "-ty" is not clipped. */
const PAD_BEFORE = 0.08;
const PAD_AFTER = 0.16;

const duration = async (file) => {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=nw=1:nk=1",
    file,
  ]);
  return Number.parseFloat(stdout.trim());
};

/** The stretches of the file that contain sound, in order. */
const speechSpans = async (file, total) => {
  const { stderr } = await run("ffmpeg", [
    "-i", file,
    "-af", `silencedetect=noise=${NOISE_FLOOR}:d=${MIN_SILENCE}`,
    "-f", "null", "-",
  ]);

  const silences = [];
  let openedAt = null;
  for (const line of stderr.split("\n")) {
    const start = line.match(/silence_start:\s*(-?[\d.]+)/);
    if (start) openedAt = Math.max(0, Number.parseFloat(start[1]));
    const end = line.match(/silence_end:\s*([\d.]+)/);
    if (end && openedAt !== null) {
      silences.push([openedAt, Number.parseFloat(end[1])]);
      openedAt = null;
    }
  }
  if (openedAt !== null) silences.push([openedAt, total]);

  const spans = [];
  let cursor = 0;
  for (const [from, to] of silences) {
    if (from - cursor > 0.05) spans.push([cursor, from]);
    cursor = to;
  }
  if (total - cursor > 0.05) spans.push([cursor, total]);
  return spans;
};

const total = await duration(CLIP);
const spans = await speechSpans(CLIP, total);

if (spans.length !== EXPECTED) {
  console.warn(
    `Found ${spans.length} spoken stretches, expected ${EXPECTED}.\n` +
      "Either a pause was too short to detect or a number was said twice.\n" +
      "Leave a full second of silence between numbers and re-record, or tune " +
      "NOISE_FLOOR / MIN_SILENCE at the top of this script.",
  );
}

const segments = spans.slice(0, EXPECTED).map(([from, to], index) => ({
  n: index + 1,
  start: Number(Math.max(0, from - PAD_BEFORE).toFixed(3)),
  end: Number(Math.min(total, to + PAD_AFTER).toFixed(3)),
}));

await writeFile(
  MAP_FILE,
  `${JSON.stringify({ clip: PUBLIC_URL, segments }, null, 2)}\n`,
);

console.log(
  `Wrote ${segments.length} slices to src/data/ecdNumberVoice.json ` +
    `from a ${total.toFixed(1)}s recording.`,
);
for (const segment of segments) {
  console.log(
    `  ${String(segment.n).padStart(2)}  ${segment.start.toFixed(2)}s → ${segment.end.toFixed(2)}s`,
  );
}
