import { sayNumber } from "../../../lib/audio/numberVoice";
import { playReadingLine } from "../reading/readingVoice";

/**
 * The voice engine for the maths games.
 *
 * It is the reading engine underneath — a recorded clip where one exists, the
 * browser's own voice reading the script where it does not — with the maths
 * folder layout on top. Every line a game speaks therefore works today and
 * simply gets better the day its MP3 lands.
 *
 * Files: `public/sounds/ecd/maths/<game>/<id>.mp3`. The scripts to record are
 * printed in `docs/ECD_MATHS_VOICE_SCRIPTS.md`.
 */

export interface MathsLine {
  /** The file's basename, without folder or extension. */
  id: string;
  script: string;
}

export const mathsVoiceUrl = (game: string, id: string) =>
  `/sounds/ecd/maths/${game}/${id}.mp3`;

/** Say one of a game's own lines. `onEnd` fires however the line finishes. */
export const playMathsLine = (game: string, line: MathsLine, onEnd?: () => void) =>
  playReadingLine(mathsVoiceUrl(game, line.id), line.script, onEnd);

/**
 * Count a run of numbers aloud, one after the other.
 *
 * Each number waits for the one before it to finish rather than running on a
 * timer, so "one… two… three" never trips over itself. `onStep` fires as each
 * number is spoken, which is what makes the matching object light up in time
 * with the voice.
 */
export const countAloud = (
  values: number[],
  onStep?: (value: number, index: number) => void,
  onEnd?: () => void,
) => {
  const next = (index: number) => {
    if (index >= values.length) {
      onEnd?.();
      return;
    }
    onStep?.(values[index], index);
    sayNumber(values[index], 1, () => next(index + 1));
  };
  next(0);
};

export {
  playCorrectResponse,
  playEncouragement,
  playFinish,
  playPraise,
  playSuccessCue,
  playWrongCue,
  playWrongResponse,
  stopReadingVoice as stopMathsVoice,
} from "../reading/readingVoice";
export { sayNumber, stopNumberVoice } from "../../../lib/audio/numberVoice";
