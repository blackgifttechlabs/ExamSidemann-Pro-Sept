"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NarratorHandle } from "./experimentNarrator";

/**
 * Caption tracks for the narration clips.
 *
 * The timings are not guesses. `scripts/generate_narration_captions.mjs` runs
 * ffmpeg silence detection over each recorded MP3, takes the stretches that
 * actually contain speech, and lays the words of the script across them in
 * proportion to how long each word takes to say. Real pauses in the recording
 * therefore become real gaps in the caption track, which is what keeps the big
 * text at the bottom of the screen — and the pointing hand — on the word the
 * narrator is saying.
 *
 * Re-run the generator whenever a clip is re-recorded.
 */

/**
 * A dimension drawn across the scene while a line is being spoken — the ruler
 * the narrator is talking over. It appears when the line starts and disappears
 * when the line ends, so "measure from the top, all the way down to the middle
 * of the bob" puts a labelled measure exactly there and then clears it again.
 */
export interface NarrationMeasure {
  /** Named scene anchors at each end of the dimension. */
  from: string;
  to: string;
  /**
   * `vertical` and `horizontal` square the measure off against the axis, the
   * way a ruler is actually held. `direct` joins the two points.
   */
  axis?: "vertical" | "horizontal" | "direct";
  /** Text on the label chip, e.g. "Length ℓ" or "Extension". */
  label?: string;
}

/** Where the pointing hand should sit while a line is being spoken. */
export interface NarrationFocus {
  /**
   * CSS selector for a control in the page chrome, e.g. the angle slider.
   * The first visible match wins, so mobile and desktop copies of a control can
   * share one selector list.
   */
  selector?: string;
  /**
   * A named point inside the 3D scene (the cannon, the muzzle, the grid…).
   * The experiment maps these names to world coordinates and projects them, so
   * the hand follows the object even as the camera or the barrel angle moves.
   */
  sceneAnchor?: string;
  /** Short caption for the little label that rides with the hand. */
  label?: string;
  /** A ruler to draw across the scene for as long as this line is spoken. */
  measure?: NarrationMeasure;
}

export interface CaptionWord {
  /** Start time in seconds, relative to the clip. */
  t: number;
  /** Duration in seconds. */
  d: number;
  w: string;
}

export interface CaptionLine {
  start: number;
  end: number;
  text: string;
  words: CaptionWord[];
  focus?: NarrationFocus;
}

export interface NarrationTrack {
  src: string;
  /** Measured length of the recording, in seconds. */
  duration: number;
  lines: CaptionLine[];
}

export type NarrationTrackMap = Readonly<Record<string, NarrationTrack>>;

/** Milliseconds — what a walkthrough step should budget for this clip. */
export function trackDurationMs(track: NarrationTrack | undefined, fallbackMs: number): number {
  if (!track) return fallbackMs;
  return Math.round(track.duration * 1000);
}

/** Lowercased, stripped of punctuation, collapsed to single spaces. */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9*_\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Time, in milliseconds, at which a clip reaches `phrase` — measured to the
 * **word**, not to the line it sits in.
 *
 * This is how a scene action gets pinned to the moment it is described: the
 * editor starts typing as the narrator says "watch me type this", and the Run
 * button goes down on the word "Run".
 *
 * Matching is deliberately fussy, in this order:
 *
 *   1. A line that *is* the phrase, ignoring punctuation. A cue of "Run" means
 *      the line "Run.", not the word buried in "TRUNCATE" or "the WHERE runs
 *      first" — a plain substring search matches both of those, which fired the
 *      query several sentences before the narrator asked for it.
 *   2. Otherwise the first line containing the phrase as whole words, so "add a
 *      column" matches that phrase but never "columns".
 *
 * Failing both, the caller's fallback stands.
 */
export function cueTimeMs(track: NarrationTrack | undefined, phrase: string, fallbackMs: number): number {
  if (!track) return fallbackMs;

  const needle = normalise(phrase);
  if (!needle) return fallbackMs;

  const exact = track.lines.find((item) => normalise(item.text) === needle);
  const line =
    exact ??
    track.lines.find((item) => {
      const words = normalise(item.text);
      return words === needle || words.startsWith(`${needle} `) || words.endsWith(` ${needle}`) || words.includes(` ${needle} `);
    });

  if (!line) return fallbackMs;

  // Walk the line's own words to find where the phrase actually begins, so a
  // cue in the middle of a long sentence does not fire at the start of it.
  const target = needle.split(' ');
  for (let start = 0; start + target.length <= line.words.length; start += 1) {
    let matched = true;
    for (let offset = 0; offset < target.length; offset += 1) {
      if (normalise(line.words[start + offset].w) !== target[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) return Math.round(line.words[start].t * 1000);
  }

  return Math.round(line.start * 1000);
}

export interface NarrationCueAction {
  /** Milliseconds into the clip at which to run. */
  atMs: number;
  run: () => void;
}

export interface NarrationCueRunner {
  /** Queue actions against the clip that is about to play. Replaces any queue. */
  schedule: (actions: NarrationCueAction[]) => void;
  clear: () => void;
}

/**
 * Runs scene actions at a given point *inside a clip*, measured on the audio's
 * own clock rather than on `setTimeout`.
 *
 * That matters twice over: a clip that takes a moment to buffer no longer
 * leaves the scene running ahead of the voice, and pausing the narration
 * genuinely pauses the demonstration instead of letting queued timers fire
 * against a silent scene.
 */
export function useNarrationCueRunner(narrator: NarratorHandle): NarrationCueRunner {
  const queueRef = useRef<NarrationCueAction[]>([]);
  const nextRef = useRef(0);
  const frameRef = useRef(0);
  const audioRef = narrator.audioRef;

  const clear = useCallback(() => {
    queueRef.current = [];
    nextRef.current = 0;
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
  }, []);

  const schedule = useCallback(
    (actions: NarrationCueAction[]) => {
      clear();
      if (actions.length === 0) return;
      queueRef.current = [...actions].sort((a, b) => a.atMs - b.atMs);
      const queuedAt = performance.now();

      const tick = () => {
        const audio = audioRef.current;
        // If the clip is missing or blocked it never starts, and the whole
        // demonstration would be skipped. Fall back to wall-clock time so the
        // scene still performs the steps, just without a voice over them.
        const silent = !audio || (audio.paused && audio.currentTime === 0);
        const timeMs =
          silent && performance.now() - queuedAt > 1500
            ? performance.now() - queuedAt
            : (audio?.currentTime ?? 0) * 1000;
        while (nextRef.current < queueRef.current.length && timeMs >= queueRef.current[nextRef.current].atMs) {
          const action = queueRef.current[nextRef.current];
          nextRef.current += 1;
          action.run();
        }
        if (nextRef.current < queueRef.current.length) frameRef.current = window.requestAnimationFrame(tick);
        else frameRef.current = 0;
      };
      frameRef.current = window.requestAnimationFrame(tick);
    },
    [audioRef, clear],
  );

  useEffect(() => clear, [clear]);

  return { schedule, clear };
}

export interface NarrationPlayback {
  /** The line being spoken right now, or null between lines / while silent. */
  line: CaptionLine | null;
  /** Index of the word inside `line.words` being spoken, or -1. */
  wordIndex: number;
  /** True while a clip with a caption track is loaded, playing or paused. */
  active: boolean;
  paused: boolean;
}

const IDLE: NarrationPlayback = { line: null, wordIndex: -1, active: false, paused: false };

/**
 * Follows the narrator's own playback clock and reports the current line and
 * word. Polled on animation frames while a clip is playing; the loop stops
 * itself as soon as nothing is talking, so an idle experiment costs nothing.
 */
export function useNarrationPlayback(narrator: NarratorHandle, tracks: NarrationTrackMap): NarrationPlayback {
  const [state, setState] = useState<NarrationPlayback>(IDLE);
  const tracksRef = useRef(tracks);
  tracksRef.current = tracks;
  const audioRef = narrator.audioRef;
  const { currentSrc, isPlaying, isPaused } = narrator;

  useEffect(() => {
    const track = currentSrc ? tracksRef.current[currentSrc] : undefined;
    if (!track || (!isPlaying && !isPaused)) {
      setState(IDLE);
      return;
    }

    let frame = 0;
    let lastLine: CaptionLine | null = null;
    let lastWord = -1;

    const sample = () => {
      const time = audioRef.current?.currentTime ?? 0;
      // Lines never overlap, so a linear scan over a handful of them is cheaper
      // than any index we could keep.
      const line = track.lines.find((item) => time >= item.start && time < item.end) ?? null;
      let wordIndex = -1;
      if (line) {
        for (let i = line.words.length - 1; i >= 0; i -= 1) {
          if (time >= line.words[i].t) {
            wordIndex = i;
            break;
          }
        }
      }
      if (line !== lastLine || wordIndex !== lastWord) {
        lastLine = line;
        lastWord = wordIndex;
        setState({ line, wordIndex, active: true, paused: isPaused });
      }
      frame = window.requestAnimationFrame(sample);
    };

    // One immediate sample so a paused clip still shows its line.
    sample();
    return () => window.cancelAnimationFrame(frame);
  }, [audioRef, currentSrc, isPaused, isPlaying]);

  return state;
}
