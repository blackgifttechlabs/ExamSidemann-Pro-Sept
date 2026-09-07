import type { CaptionLine, CaptionWord, NarrationTrack } from "./narrationCaptions";

/**
 * Stand-in caption timings for narration whose MP3s have not been recorded yet.
 *
 * The real timings come from `scripts/generate_narration_captions.mjs`, which
 * measures the pauses the narrator actually took. Until a clip exists there is
 * nothing to measure, so this lays the words out at a patient teacher's pace
 * instead. That is enough for the lesson to run end to end — captions appear,
 * the editor types on cue, the query runs on cue — just silently.
 *
 * As soon as a clip is recorded and the generator has run, the measured track
 * wins and this is never consulted for that clip again.
 */

/** Seconds a single syllable takes at an explaining-to-beginners pace. */
const SECONDS_PER_SYLLABLE = 0.235;
/** No word is read faster than this, however short it is. */
const MIN_WORD_SECONDS = 0.26;
/** Breath after a comma, a colon or a dash. */
const CLAUSE_PAUSE_SECONDS = 0.2;
/** Breath at the end of a sentence. */
const SENTENCE_PAUSE_SECONDS = 0.44;

/** Rough syllable count — vowel groups, with a silent trailing "e" ignored. */
function syllables(word: string): number {
  const letters = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!letters) return 1;
  // Spelled-out letters ("s", "q", "l") are one syllable each anyway.
  const groups = letters.replace(/e$/, "").match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

function trailingPause(word: string): number {
  if (/[.!?]["')]?$/.test(word)) return SENTENCE_PAUSE_SECONDS;
  if (/[,;:—-]$/.test(word)) return CLAUSE_PAUSE_SECONDS;
  return 0;
}

export interface EstimatedLineInput {
  text: string;
  focus?: CaptionLine["focus"];
}

/**
 * Builds a caption track for a clip that has not been recorded, laying the
 * script out at a steady speaking pace. `duration` is the length the clip is
 * expected to be, which is what a lesson step uses as its time budget.
 */
export function estimateNarrationTrack(src: string, lines: EstimatedLineInput[]): NarrationTrack {
  let clock = 0;
  const captionLines: CaptionLine[] = lines.map((line) => {
    const start = clock;
    const tokens = line.text.split(/\s+/).filter(Boolean);
    const words: CaptionWord[] = tokens.map((token) => {
      const duration = Math.max(MIN_WORD_SECONDS, syllables(token) * SECONDS_PER_SYLLABLE);
      const word: CaptionWord = { t: round(clock), d: round(duration), w: token };
      clock += duration + trailingPause(token);
      return word;
    });
    // A line that ended on a word with no punctuation still gets a small gap,
    // otherwise consecutive lines run into each other with no breath at all.
    if (words.length > 0 && trailingPause(tokens[tokens.length - 1]) === 0) {
      clock += CLAUSE_PAUSE_SECONDS;
    }
    return { start: round(start), end: round(clock), text: line.text, words, focus: line.focus };
  });

  return { src, duration: round(clock), lines: captionLines };
}

function round(seconds: number): number {
  return Math.round(seconds * 1000) / 1000;
}
