import { recordedEcdAudio, resolveEcdAudio } from "./ecdAudioAssets";
import { playReadingLine, stopReadingVoice } from "../../features/ecd/reading/readingVoice";
import voiceMap from "../../data/ecdNumberVoice.json";

/**
 * The counting voice for the maths games.
 *
 * All twenty numbers live in **one** recording with a pause between each, and
 * this plays a single number by seeking to its slice and stopping at the end of
 * it. One take is far easier to record — and to re-record in the same voice —
 * than twenty separate files.
 *
 * The slices are measured from the real audio by
 * `scripts/buildNumberVoiceMap.mjs`, which asks ffmpeg where the recording is
 * actually silent, so the map matches whatever pauses the reader really took.
 * Until that has been run the map is empty and the browser's own voice stands
 * in, exactly as it does for the reading scripts.
 */

interface Segment {
  n: number;
  start: number;
  end: number;
}

const map = voiceMap as { clip: string; segments: Segment[] };
const segments = new Map(map.segments.map((segment) => [segment.n, segment]));

let element: HTMLAudioElement | null = null;
let stopTimer: ReturnType<typeof setTimeout> | null = null;

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];

const speak = (value: number, onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(WORDS[value] ?? String(value));
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => onEnd?.();
    window.speechSynthesis.speak(utterance);
  } catch {
    /* a device with no voice still gets to play the game, silently */
    onEnd?.();
  }
};

export const stopNumberVoice = () => {
  stopReadingVoice();
  if (stopTimer) {
    clearTimeout(stopTimer);
    stopTimer = null;
  }
  element?.pause();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Say one number aloud. `onEnd` fires when it has finished, so a caller can
 * line the next sound up behind it rather than talking over it.
 */
export const sayNumber = (value: number, volume = 1, onEnd?: () => void) => {
  stopNumberVoice();
  if (typeof window === "undefined") {
    onEnd?.();
    return;
  }

  const individual = recordedEcdAudio(`/sounds/ecd/maths/numbers/${value}.wav`);
  if (individual) {
    playReadingLine(individual, WORDS[value] ?? String(value), onEnd);
    return;
  }
  const segment = segments.get(value);
  if (!segment) {
    speak(value, onEnd);
    return;
  }

  if (!element) {
    element = new Audio(resolveEcdAudio(map.clip));
    element.preload = "auto";
  }
  const audio = element;
  audio.volume = Math.min(1, Math.max(0, volume));

  /**
   * `onEnd` fires exactly once, however this call ends.
   *
   * There are three ways out — the slice finishes, playback is refused and the
   * robot voice stands in, or the file fails to load — and without this guard a
   * refused `play()` would report the number as finished twice: once from the
   * fallback and again when the stop timer came round. A caller that steps to
   * the next round on `onEnd` would then skip a round.
   */
  let ended = false;
  const finish = () => {
    if (ended) return;
    ended = true;
    onEnd?.();
  };

  const fallBack = () => {
    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }
    if (ended) return;
    speak(value, finish);
  };

  const startAt = () => {
    try {
      audio.currentTime = segment.start;
    } catch {
      /* not seekable yet — the fallback below covers it */
    }
    void audio.play().catch(fallBack);
    // A timer rather than `timeupdate`, which only fires about four times a
    // second and would let a short number run into the next one.
    stopTimer = setTimeout(() => {
      audio.pause();
      finish();
    }, Math.max(120, (segment.end - segment.start) * 1000));
  };

  if (audio.readyState >= 1) {
    startAt();
  } else {
    audio.addEventListener("loadedmetadata", startAt, { once: true });
    audio.addEventListener("error", fallBack, { once: true });
  }
};

/** True once a real recording has been measured in. */
export const hasNumberVoice = segments.size > 0;
