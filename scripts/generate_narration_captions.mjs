#!/usr/bin/env node
/**
 * Builds word-level caption tracks for the narrated experiments.
 *
 *   node scripts/generate_narration_captions.mjs [scripts/narration/*.captions.json ...]
 *
 * For each clip it asks ffmpeg where the recording is actually silent, keeps the
 * stretches that contain speech, and spreads the words of the script across
 * those stretches in proportion to how long each word takes to say. The pauses
 * the narrator really took therefore end up as gaps in the caption track, which
 * is what stops the captions — and the pointing hand — drifting away from the
 * voice over a thirty second clip.
 *
 * Re-run this whenever a clip is re-recorded; the generated file carries the
 * measured clip length too, which is what the walkthrough uses as its step
 * budget, so the 3D scene retimes itself at the same time.
 *
 * Requires ffmpeg/ffprobe on PATH.
 */

import { execFile } from "node:child_process";
import { access, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Anything quieter than this for at least this long counts as a pause. */
const SILENCE_DB = -32;
const SILENCE_MIN_SECONDS = 0.16;

async function probeDuration(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "quiet",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    file,
  ]);
  const duration = Number.parseFloat(stdout.trim());
  if (!Number.isFinite(duration)) throw new Error(`could not read a duration from ${file}`);
  return duration;
}

/** The stretches of the clip that contain speech, as [start, end] pairs. */
async function speechSegments(file, duration) {
  const { stderr } = await run(
    "ffmpeg",
    ["-hide_banner", "-nostats", "-i", file, "-af", `silencedetect=noise=${SILENCE_DB}dB:d=${SILENCE_MIN_SECONDS}`, "-f", "null", "-"],
    { maxBuffer: 1024 * 1024 * 16 },
  );

  const silences = [];
  let pendingStart = null;
  for (const line of stderr.split("\n")) {
    const start = line.match(/silence_start:\s*(-?[\d.]+)/);
    if (start) {
      pendingStart = Math.max(0, Number.parseFloat(start[1]));
      continue;
    }
    const end = line.match(/silence_end:\s*(-?[\d.]+)/);
    if (end && pendingStart !== null) {
      silences.push([pendingStart, Math.min(duration, Number.parseFloat(end[1]))]);
      pendingStart = null;
    }
  }
  // A clip that fades out ends on an unterminated silence.
  if (pendingStart !== null) silences.push([pendingStart, duration]);

  const segments = [];
  let cursor = 0;
  for (const [start, end] of silences) {
    if (start > cursor) segments.push([cursor, start]);
    cursor = Math.max(cursor, end);
  }
  if (cursor < duration) segments.push([cursor, duration]);

  const speaking = segments.filter(([start, end]) => end - start > 0.02);
  return speaking.length > 0 ? speaking : [[0, duration]];
}

/**
 * Roughly how long a word takes to say, in syllables. Good enough to share out
 * a speech segment between the words inside it — the segment boundaries, which
 * are measured, do the heavy lifting.
 */
function spokenWeight(word) {
  const letters = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!letters) return 0.4;
  const groups = letters.match(/[aeiouy]+/g);
  let syllables = groups ? groups.length : 1;
  // A trailing silent "e" is written but not said.
  if (syllables > 1 && /e$/.test(letters) && !/[aeiouy]e$/.test(letters)) syllables -= 1;
  return Math.max(1, syllables) + 0.35;
}

/**
 * Give every line its own run of speech segments.
 *
 * The narrator pauses between sentences, so the pauses ffmpeg found are almost
 * always sentence boundaries — we just have to decide which pause belongs to
 * which line. This walks every way of cutting the segment list into one
 * contiguous run per line and keeps the cheapest, where "cheap" means each run
 * lasts about as long as its line ought to take to say. Because the cuts can
 * only ever land on a real pause, a line can never start mid-word.
 */
function assignSegmentsToLines(lineWeights, segments) {
  const lineCount = lineWeights.length;
  const segCount = segments.length;
  const segDur = segments.map(([start, end]) => end - start);
  const speechTotal = segDur.reduce((sum, value) => sum + value, 0);
  const weightTotal = lineWeights.reduce((sum, value) => sum + value, 0);
  const expected = lineWeights.map((weight) => (weightTotal > 0 ? (weight / weightTotal) * speechTotal : 0));

  // Prefix sums so any run's duration is one subtraction.
  const prefix = [0];
  for (const value of segDur) prefix.push(prefix[prefix.length - 1] + value);
  const runCost = (from, to, lineIndex) => {
    const actual = prefix[to] - prefix[from];
    const want = Math.max(expected[lineIndex], 0.05);
    return ((actual - want) * (actual - want)) / want;
  };

  // best[j][i] = cheapest way to cover segments [0, i) with lines [0, j).
  const best = Array.from({ length: lineCount + 1 }, () => new Float64Array(segCount + 1).fill(Infinity));
  const cut = Array.from({ length: lineCount + 1 }, () => new Int32Array(segCount + 1).fill(-1));
  best[0][0] = 0;

  for (let j = 1; j <= lineCount; j += 1) {
    // Every line takes at least one segment, so bound the reachable range.
    for (let i = j; i <= segCount - (lineCount - j); i += 1) {
      for (let k = j - 1; k < i; k += 1) {
        const prior = best[j - 1][k];
        if (prior === Infinity) continue;
        const total = prior + runCost(k, i, j - 1);
        if (total < best[j][i]) {
          best[j][i] = total;
          cut[j][i] = k;
        }
      }
    }
  }

  if (best[lineCount][segCount] === Infinity) return null;

  const runs = new Array(lineCount);
  let end = segCount;
  for (let j = lineCount; j >= 1; j -= 1) {
    const start = cut[j][end];
    runs[j - 1] = segments.slice(start, end);
    end = start;
  }
  return runs;
}

/** Lay a line's words across the segments it was given, longest words last. */
function placeWords(tokens, runSegments) {
  const speechTotal = runSegments.reduce((sum, [start, end]) => sum + (end - start), 0);
  const weightTotal = tokens.reduce((sum, token) => sum + token.weight, 0);
  const secondsPerWeight = weightTotal > 0 ? speechTotal / weightTotal : 0;

  let segIndex = 0;
  let cursor = runSegments[0][0];
  const placed = [];

  for (const token of tokens) {
    const start = cursor;
    let budget = token.weight * secondsPerWeight;
    // Walk the clock forward by `budget` seconds of *speech*, hopping over any
    // pause we run into so no word is ever placed inside a silence.
    while (budget > 1e-6 && segIndex < runSegments.length) {
      const remaining = runSegments[segIndex][1] - cursor;
      if (remaining > budget) {
        cursor += budget;
        budget = 0;
      } else {
        budget -= Math.max(0, remaining);
        segIndex += 1;
        cursor = segIndex < runSegments.length ? runSegments[segIndex][0] : runSegments[runSegments.length - 1][1];
      }
    }
    placed.push({
      t: Number(start.toFixed(3)),
      d: Number(Math.max(0.08, cursor - start).toFixed(3)),
      w: token.w,
    });
  }

  return placed;
}

function alignClip(lines, segments) {
  const tokensPerLine = lines.map((line) =>
    line.text
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => ({ w, weight: spokenWeight(w) })),
  );
  const lineWeights = tokensPerLine.map((tokens) => tokens.reduce((sum, token) => sum + token.weight, 0));

  // With fewer pauses than lines there is nothing to snap to; share the whole
  // clip out by weight instead.
  const runs =
    segments.length >= lines.length ? assignSegmentsToLines(lineWeights, segments) : null;

  const placedPerLine = runs
    ? runs.map((run, index) => placeWords(tokensPerLine[index], run))
    : (() => {
        const flat = placeWords(tokensPerLine.flat(), segments);
        let offset = 0;
        return tokensPerLine.map((tokens) => flat.slice(offset, (offset += tokens.length)));
      })();

  return lines.map((line, index) => {
    const words = placedPerLine[index];
    const start = words.length > 0 ? words[0].t : 0;
    const last = words[words.length - 1];
    return {
      start: Number(start.toFixed(3)),
      end: Number((last ? last.t + last.d : start).toFixed(3)),
      text: line.text,
      focus: line.focus,
      words,
    };
  });
}

/**
 * Hold each caption on screen until the next one starts, so the reader is not
 * left staring at a blank bar through the narrator's pauses.
 */
function closeGaps(lines, duration) {
  return lines.map((line, index) => ({
    ...line,
    start: index === 0 ? 0 : line.start,
    end: index === lines.length - 1 ? duration : lines[index + 1].start,
  }));
}

function serialise(tracks, exportName, title, sourceName) {
  const body = tracks
    .map((track) => {
      const lines = track.lines
        .map((line) => {
          const focus = line.focus ? `\n      focus: ${JSON.stringify(line.focus)},` : "";
          const words = line.words.map((word) => JSON.stringify(word)).join(",\n        ");
          return `    {\n      start: ${line.start},\n      end: ${line.end},\n      text: ${JSON.stringify(line.text)},${focus}\n      words: [\n        ${words},\n      ],\n    }`;
        })
        .join(",\n");
      return `  ${JSON.stringify(track.src)}: {\n    src: ${JSON.stringify(track.src)},\n    duration: ${track.duration},\n    lines: [\n${lines},\n    ],\n  }`;
    })
    .join(",\n");

  return `/**
 * ${title} narration captions — GENERATED, do not edit by hand.
 *
 * Source script: ${sourceName}
 * Regenerate with: node scripts/generate_narration_captions.mjs
 *
 * Word timings come from ffmpeg silence detection over the recorded MP3s, so
 * they follow the pauses the narrator actually took.
 */

import type { NarrationTrackMap } from "../narrationCaptions";

export const ${exportName}: NarrationTrackMap = {${body ? `\n${body},\n` : ""}};
`;
}

async function build(configPath) {
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const tracks = [];

  let pending = 0;
  for (const clip of config.clips) {
    const file = join(ROOT, "public", clip.src.replace(/^\//, ""));
    // A course is voiced a few clips at a time, so a clip that has not been
    // recorded yet is the normal case, not an error. Skip it and carry on —
    // the app falls back to estimated timings for anything missing here.
    try {
      await access(file);
    } catch {
      pending += 1;
      continue;
    }
    const duration = await probeDuration(file);
    const segments = await speechSegments(file, duration);
    const lines = closeGaps(alignClip(clip.lines, segments), Number(duration.toFixed(3)));
    tracks.push({ src: clip.src, duration: Number(duration.toFixed(3)), lines });
    console.log(`  ${clip.src}  ${duration.toFixed(2)}s  ${clip.lines.length} lines  ${segments.length} speech segments`);
  }

  const outPath = join(ROOT, config.output);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, serialise(tracks, config.exportName, config.title, configPath.split("/").pop()));
  console.log(`→ ${config.output}  (${tracks.length} measured${pending ? `, ${pending} not recorded yet` : ""})`);
}

const configs = process.argv.slice(2);
if (configs.length === 0) {
  configs.push(
    "scripts/narration/projectile-motion.captions.json",
    "scripts/narration/hookes-law.captions.json",
    "scripts/narration/simple-pendulum.captions.json",
  );
}

for (const config of configs) {
  console.log(config);
  await build(resolve(ROOT, config));
}
