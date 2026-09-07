import { resolveEcdAudio } from "../../../lib/audio/ecdAudioAssets";
import { ecdSounds } from "../../../lib/audio/ecdSounds";

/**
 * The voice engine shared by every reading game.
 *
 * Each spoken line has a recorded clip *and* a written script. Where the clip
 * has been recorded it is played; where it has not, the browser's own speech
 * synthesis reads the script with the performance tags stripped out. That way
 * a game is fully playable before a single file has been recorded, and each
 * clip that lands simply replaces a robot voice with a real one.
 */

export interface VoiceClip {
  /** The file's basename, without the folder or the extension. */
  id: string;
  script: string;
}

/** One visual action tied to a recording timestamp or browser speech boundary. */
export interface VoiceCue {
  atSeconds: number;
  atCharacter: number;
  onCue: () => void;
}

/** Said when the child gets it right. One is chosen at random. */
export const READING_PRAISE: VoiceClip[] = [
  { id: "correct-1", script: "[claps and laughs] Yes! You did it! That's the one!" },
  { id: "correct-2", script: "[cheers] Woo-hoo! You are a super sound finder!" },
  { id: "correct-3", script: "[giggles] Brilliant! Your listening ears are working perfectly!" },
  { id: "correct-4", script: "[happy gasp] Wow! That is exactly right! High five!" },
  { id: "correct-5", script: "[laughs] Yes, yes, yes! You are getting so good at this!" },
];

/** Said on a wrong pick — warm and playful, never disappointed. */
export const READING_ENCOURAGE: VoiceClip[] = [
  { id: "tryagain-1", script: "[gentle giggle] Ooh, not that one. Have a listen again — you can do it!" },
  { id: "tryagain-2", script: "[warmly] So close! Let's use our listening ears one more time." },
  { id: "tryagain-3", script: "[playful hmm] Hmm, that one sounds different. Try again!" },
  { id: "tryagain-4", script: "[encouraging] Nearly there, my friend. Have another go!" },
  { id: "tryagain-5", script: "[soft chuckle] Oops! No problem at all. Let's try once more!" },
];

/** The chime played the instant a child gets one right, before the praise. */
export const SUCCESS_CUE = "success";
/** The note played on a wrong pick, before the encouragement. */
export const WRONG_CUE = "wrong";

/** Played when a game is finished. */
export const READING_FINISH: VoiceClip = {
  id: "finished",
  script:
    "[cheers and claps] Hooray! You finished them all! [giggles] You are a reading star. Shall we play again?",
};

/**
 * Where a praise, encouragement or finish clip lives.
 *
 * These are shared by every reading game despite sitting under `phonics/` —
 * that is simply where they were recorded, and moving recorded assets to suit
 * a folder name is not worth breaking them over.
 */
export const readingFeedbackUrl = (id: string) => `/sounds/ecd/phonics/feedback/${id}.mp3`;

/** "[giggles] Yes! You did it!" → "Yes! You did it!" */
const spoken = (script: string) =>
  script
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * How far the background tune drops while a line is spoken.
 *
 * Most screens use the default. A screen where the child has to pick a sound
 * out of the narration can ask for a quieter bed still — see the phonics
 * puzzle, which turns the music almost off so nothing competes with a phoneme.
 */
export const DEFAULT_READING_DUCK = 0.04;
let duckLevel = DEFAULT_READING_DUCK;

/** Set the duck level for the current screen; reset it on the way out. */
export const setReadingDuckLevel = (level: number) => {
  duckLevel = level;
};

let current: HTMLAudioElement | null = null;
/** Fires when the line in flight finishes, however it finishes. */
let finishLine: (() => void) | null = null;
/**
 * Which line is in flight.
 *
 * Handlers from a line that has already been replaced must not fire — under
 * React StrictMode the mount effect runs twice, and a stale `onEnd` arriving
 * after the replacement line had started was switching the caller's "speaking"
 * flag back off while the new clip was still playing.
 */
let lineId = 0;

const settle = (id: number) => {
  if (id !== lineId) return;
  const done = finishLine;
  finishLine = null;
  ecdSounds.restoreIntro();
  done?.();
};

/** Silence whatever is talking. A new line always wins. */
const silence = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  if (current) {
    current.pause();
    current = null;
  }
};

/**
 * Stop the narration.
 *
 * The pending callback is dropped rather than fired: a line that was cut short
 * has not finished, and firing its `onEnd` would step a sequence forward as if
 * it had.
 */
export const stopReadingVoice = () => {
  lineId += 1;
  finishLine = null;
  silence();
  ecdSounds.restoreIntro();
};

const speak = (script: string, id: number, fireCue: () => void, cue?: VoiceCue) => {
  const words = spoken(script);
  // A cue with no words — a chime or a buzz — has nothing to fall back to, so
  // treat a missing file as an instant finish rather than hanging the chain.
  if (!words || typeof window === "undefined" || !("speechSynthesis" in window)) {
    fireCue();
    settle(id);
    return;
  }
  try {
    const utterance = new SpeechSynthesisUtterance(words);
    utterance.rate = 0.8;
    utterance.pitch = 1.25;
    utterance.onboundary = (event) => {
      if (cue && event.charIndex >= cue.atCharacter) fireCue();
    };
    utterance.onend = utterance.onerror = () => { fireCue(); settle(id); };
    window.speechSynthesis.speak(utterance);
  } catch {
    /* a device with no voice still gets to play the game, silently */
    fireCue();
    settle(id);
  }
};

/**
 * Play the recording at `url`, falling back to reading `script` aloud.
 *
 * A missing file surfaces either as a rejected `play()` or as an `error` event
 * depending on the browser, so both are handled — and guarded, so a browser
 * that fires both does not read the line twice.
 */
export const playReadingLine = (url: string, script: string, onEnd?: () => void, cue?: VoiceCue) => {
  lineId += 1;
  silence();
  if (typeof window === "undefined") {
    cue?.onCue();
    onEnd?.();
    return;
  }

  // Claim the channel: anything still in flight from the previous line is now
  // stale and its handlers will be ignored.
  const id = lineId;
  finishLine = onEnd ?? null;

  // Drop the music out of the way for as long as the line lasts.
  ecdSounds.duckIntro(duckLevel);

  let cueFired = false;
  const fireCue = () => {
    if (cueFired || id !== lineId) return;
    cueFired = true;
    cue?.onCue();
  };
  let handled = false;
  const fallBack = () => {
    if (handled || id !== lineId) return;
    handled = true;
    speak(script, id, fireCue, cue);
  };

  try {
    const audio = new Audio(resolveEcdAudio(url));
    audio.onerror = fallBack;
    audio.onplaying = () => {
      handled = true;
    };
    audio.ontimeupdate = () => {
      if (cue && audio.currentTime >= cue.atSeconds) fireCue();
    };
    audio.onended = () => { fireCue(); settle(id); };
    current = audio;
    void audio.play().catch(fallBack);
  } catch {
    fallBack();
  }
};

const pickOne = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const playPraise = (onEnd?: () => void) => {
  const clip = pickOne(READING_PRAISE);
  playReadingLine(readingFeedbackUrl(clip.id), clip.script, onEnd);
};

export const playEncouragement = (onEnd?: () => void) => {
  const clip = pickOne(READING_ENCOURAGE);
  playReadingLine(readingFeedbackUrl(clip.id), clip.script, onEnd);
};

/**
 * The full response to a correct answer: the chime, then a spoken well-done,
 * then whatever comes next.
 *
 * Each step waits for the one before it to actually finish rather than running
 * on a guessed timer, so nothing is ever cut off mid-word — and if the child
 * moves on early, `stopReadingVoice` drops the chain instead of racing it.
 */
export const playCorrectResponse = (onDone?: () => void) => {
  playReadingLine(readingFeedbackUrl(SUCCESS_CUE), "", () => {
    playPraise(onDone);
  });
};

/**
 * Just the cue, with no spoken line after it.
 *
 * The driving game collects a number every few seconds, and a full spoken
 * well-done between each one would leave the child waiting more than playing.
 * It saves the spoken response for the end of a level.
 */
export const playSuccessCue = (onEnd?: () => void) =>
  playReadingLine(readingFeedbackUrl(SUCCESS_CUE), "", onEnd);

export const playWrongCue = (onEnd?: () => void) =>
  playReadingLine(readingFeedbackUrl(WRONG_CUE), "", onEnd);

/** The same for a wrong pick: the note, then a spoken try-again. */
export const playWrongResponse = (onDone?: () => void) => {
  playReadingLine(readingFeedbackUrl(WRONG_CUE), "", () => {
    playEncouragement(onDone);
  });
};

export const playFinish = () => playReadingLine(readingFeedbackUrl(READING_FINISH.id), READING_FINISH.script);
