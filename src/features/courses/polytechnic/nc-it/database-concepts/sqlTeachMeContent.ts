import { estimateNarrationTrack } from "../../../../../lib/audio/narrationEstimate";
import { SQL_LESSON_NARRATION_TRACKS } from "../../../../../lib/audio/narration/sqlLessons";
import type { NarrationTrack } from "../../../../../lib/audio/narrationCaptions";

import ch1 from "./teach-me/ch1-foundations.json";
import ch2 from "./teach-me/ch2-tables.json";
import ch3 from "./teach-me/ch3-inserting.json";
import ch4 from "./teach-me/ch4-select.json";
import ch5 from "./teach-me/ch5-changing.json";
import ch6 from "./teach-me/ch6-relationships.json";
import ch7 from "./teach-me/ch7-aggregates.json";
import ch8 from "./teach-me/ch8-views-security.json";

/**
 * The "Teach me" course that sits behind the SQL console.
 *
 * The lesson text lives in the JSON files under ./teach-me/ rather than in this
 * module, because the same files are read by
 * `scripts/build_sql_lesson_captions.mjs` to produce the recording sheet and the
 * caption-generator input. One source of truth for the words, whether they are
 * being spoken, captioned or recorded.
 */

/** Part of the console a line of narration is talking about. */
export type TeachFocus = "screen" | "editor" | "run" | "result";

export interface TeachLine {
  text: string;
  focus?: TeachFocus;
}

/**
 * A drawing on the whiteboard.
 *
 * Items are revealed one at a time, each on a phrase from the narration, and
 * the newest one lifts and lights up while the rest settle back — so the board
 * builds itself in front of the learner at the speed the lecturer is talking.
 */
export type BoardItem = { cue?: string } & (
  | { kind: "callout"; text: string; tone?: "info" | "good" | "warn" | "bad" }
  /** Named things and what they mean — data types, constraints, keywords. */
  | { kind: "terms"; items: { term: string; meaning: string; tone?: "info" | "good" | "warn" | "bad" }[] }
  /** Boxes inside boxes: database contains table contains row. Outermost first. */
  | { kind: "stack"; layers: { label: string; sub?: string }[] }
  /** A drawn table, optionally with one row or one column picked out. */
  | {
      kind: "table";
      name: string;
      columns: string[];
      rows: string[][];
      highlightRow?: number;
      highlightColumn?: number;
      note?: string;
    }
  /** Labelled boxes joined by arrows — a sequence or a pipeline. */
  | { kind: "flow"; steps: { label: string; sub?: string }[] }
  /** Two or three things side by side, for "distinguish between…" questions. */
  | { kind: "compare"; columns: { title: string; tone?: "info" | "good" | "warn" | "bad"; points: string[] }[] }
);

export interface TeachBoard {
  title: string;
  items: BoardItem[];
}

export interface TeachStep {
  /** Stable id — also the MP3 filename inside the lesson's folder. */
  id: string;
  title: string;
  lines: TeachLine[];
  /** SQL typed into the editor while this step is narrated. */
  sql?: string;
  /**
   * Phrase from one of the lines at which the typing starts. Matched
   * case-insensitively against the caption track, so a re-recorded clip retimes
   * itself. Defaults to the start of the clip.
   */
  typeCue?: string;
  /** Phrase at which Run is pressed. Omit and the step never runs the SQL. */
  runCue?: string;
  /** The SQL is MySQL-only (DCL, mostly) and cannot run in the browser engine. */
  serverOnly?: boolean;
  /** The step deliberately produces an error — the error is the lesson. */
  expectError?: boolean;
  /** One line describing what the learner should see. */
  expect?: string;
  /**
   * Fragments of the SQL to light up inside the editor while they are being
   * talked about — the two dashes of a comment, the word SHOW TABLES, the comma
   * that must not be there. `find` is matched literally against the editor text.
   */
  marks?: { cue: string; find: string }[];
  /**
   * A whiteboard drawn over the console for this step. Steps that explain an
   * idea rather than run a command would otherwise leave the learner staring at
   * an empty editor; this is what they look at instead.
   */
  board?: TeachBoard;
}

export interface TeachLesson {
  id: string;
  title: string;
  summary: string;
  /** Shown on the lesson card and repeated in the closing step. */
  examTip: string;
  /** Run quietly before the lesson starts, so every lesson is self-contained. */
  setupSql?: string;
  steps: TeachStep[];
}

export interface TeachChapter {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  lessons: TeachLesson[];
}

export const TEACH_ME_CHAPTERS: TeachChapter[] = [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8] as TeachChapter[];

/**
 * Audio formats a clip may be delivered in, in the order they are tried.
 *
 * Voice generators hand back different things — some MP3, some WAV — and asking
 * whoever records these to convert every file first is a good way to get a
 * half-finished course. The player probes for whichever one is actually there.
 */
export const CLIP_EXTENSIONS = ["mp3", "wav", "ogg", "m4a"] as const;

/** A step's clip path without its extension. */
export function stepAudioBase(lessonId: string, stepId: string): string {
  return `/sounds/sql-lessons/${lessonId}/${stepId}`;
}

/** The default path used in the recording sheet and before any probing. */
export function stepAudioSrc(lessonId: string, stepId: string): string {
  return `${stepAudioBase(lessonId, stepId)}.mp3`;
}

const clipSrcCache = new Map<string, Promise<string | null>>();

/**
 * The URL of the clip that actually exists for a step, or null if none has been
 * recorded yet.
 *
 * A missing static file can come back as the SPA's index.html with a 200, so a
 * bare "did it respond?" check is not enough — the content type has to say it
 * is audio. Results are cached, so each clip is probed once per session.
 */
export function resolveClipSrc(base: string): Promise<string | null> {
  const cached = clipSrcCache.get(base);
  if (cached) return cached;

  const probe = (async () => {
    for (const extension of CLIP_EXTENSIONS) {
      const url = `${base}.${extension}`;
      try {
        const response = await fetch(url, { method: "HEAD" });
        if (response.ok && (response.headers.get("content-type") ?? "").toLowerCase().startsWith("audio/")) {
          return url;
        }
      } catch {
        /* offline or blocked — try the next extension, then give up quietly */
      }
    }
    return null;
  })();

  clipSrcCache.set(base, probe);
  return probe;
}

const estimateCache = new Map<string, NarrationTrack>();

/**
 * The caption track for a step: the measured one if its MP3 has been recorded
 * and the generator has run, otherwise an estimate at a steady speaking pace.
 *
 * Everything downstream — captions, the typing cue, the Run cue, the step's
 * time budget — reads its timings from here, so a lesson behaves the same way
 * whether or not its voice exists yet. It is simply silent until it does.
 */
export function stepTrack(lessonId: string, step: TeachStep): NarrationTrack {
  const base = stepAudioBase(lessonId, step.id);
  const src = `${base}.mp3`;
  // The generated track is keyed by the file that was measured, which may be a
  // .wav, so look for the clip under any of its possible extensions.
  const measured = CLIP_EXTENSIONS.map((extension) => SQL_LESSON_NARRATION_TRACKS[`${base}.${extension}`]).find(Boolean);
  if (measured) return measured;

  const cached = estimateCache.get(src);
  if (cached) return cached;
  // A caption line's focus is the shared NarrationFocus shape, and the part of
  // the console being pointed at rides in `selector` — the same field the
  // generated tracks use, so estimated and measured tracks read identically.
  const estimated = estimateNarrationTrack(
    src,
    step.lines.map((line) => ({ text: line.text, focus: line.focus ? { selector: line.focus } : undefined })),
  );
  estimateCache.set(src, estimated);
  return estimated;
}

/** True once at least one clip of this lesson has a real recording behind it. */
export function lessonHasAudio(lesson: TeachLesson): boolean {
  return lesson.steps.some((step) => {
    const base = stepAudioBase(lesson.id, step.id);
    return CLIP_EXTENSIONS.some((extension) => SQL_LESSON_NARRATION_TRACKS[`${base}.${extension}`] !== undefined);
  });
}

export interface LessonLocation {
  chapter: TeachChapter;
  lesson: TeachLesson;
  /** 1-based position of the lesson within the whole course. */
  index: number;
}

export const ALL_LESSONS: LessonLocation[] = TEACH_ME_CHAPTERS.flatMap((chapter) =>
  chapter.lessons.map((lesson) => ({ chapter, lesson, index: 0 })),
).map((entry, i) => ({ ...entry, index: i + 1 }));

export function findLesson(lessonId: string): LessonLocation | undefined {
  return ALL_LESSONS.find((entry) => entry.lesson.id === lessonId);
}

/** Roughly how long a lesson takes to narrate, in whole minutes. */
export function lessonMinutes(lesson: TeachLesson): number {
  const seconds = lesson.steps.reduce((sum, step) => sum + stepTrack(lesson.id, step).duration, 0);
  return Math.max(1, Math.round(seconds / 60));
}
