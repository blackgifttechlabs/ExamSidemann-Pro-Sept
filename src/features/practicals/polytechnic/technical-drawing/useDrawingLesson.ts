'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { estimateNarrationTrack } from '../../../../lib/audio/narrationEstimate';
import { useExperimentNarrator } from '../../../../lib/audio/experimentNarrator';
import { DRAWING_NARRATION_TRACKS } from '../../../../lib/audio/narration/technicalDrawing';
import type { NarrationPlayback, NarrationTrack } from '../../../../lib/audio/narrationCaptions';
import { markLength, type Mark, type Pt } from './drawingGeometry';
import type { DrawStep, DrawTopic } from './drawingTopics';
import type { LineCue } from './drawingLessonTypes';

/**
 * The clock a drawing lesson runs on.
 *
 * A step that has a recorded voice runs on the voice: the clock is read off the
 * audio element itself, so the captions, the pointing hand and the pencil can
 * never drift away from what is being said. A step whose clip has not been
 * recorded yet runs on a wall clock instead, with the words laid out at a
 * patient teacher's pace by `estimateNarrationTrack` — the same fallback the
 * SQL course uses. Both look identical on screen; one of them is silent.
 *
 * Recording a clip therefore needs no change here: drop the MP3 in, run the
 * caption generator, and that step starts taking its timing from the voice.
 *
 * While a step's narration runs, its marks are laid onto the paper in order,
 * each one given a share of the step in proportion to how long it is to draw.
 * That is what puts the pencil on the line the narrator is describing rather
 * than making the drawing appear all at once at the end.
 */

/**
 * Millimetres of pencil line per second at 1×.
 *
 * This is the pace of somebody demonstrating at a board, not somebody getting
 * the drawing finished: slow enough that a learner can follow the pencil along
 * the line and copy it on their own sheet as it goes. 1.5× is there for anyone
 * who wants it quicker.
 */
const DRAW_SPEED = 26;
/** Narration before the pencil starts moving, as a share of the step. */
const LEAD_IN = 0.12;
/** Narration left after the pencil stops. */
const TAIL = 0.08;
/** A step with nothing to draw still needs a moment to land. */
const MIN_STEP_MS = 2600;

const clamp = (value: number, low: number, high: number) =>
  Math.min(Math.max(value, low), high);

function scaleTrack(track: NarrationTrack, durationSeconds: number): NarrationTrack {
  if (track.duration <= 0 || durationSeconds <= 0) return { ...track, duration: durationSeconds };
  const factor = durationSeconds / track.duration;
  return {
    ...track,
    duration: durationSeconds,
    lines: track.lines.map((line) => ({
      ...line,
      start: line.start * factor,
      end: line.end * factor,
      words: line.words.map((word) => ({
        ...word,
        t: word.t * factor,
        d: word.d * factor,
      })),
    })),
  };
}

/* ------------------------------------------------- pinning a mark to a word */

/** Punctuation and case dropped, so the cue "three" finds the spoken "Three.". */
const bareWord = (word: string) => word.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Where in a spoken line a cue lands, as a word index.
 *
 * Searching forward from the last cue used is what lets a sentence count:
 * "Three. Four. Five." can be cued three times, and "draw again" can be cued
 * twice, without either one matching the same word twice over.
 */
function cueWordIndex(line: NarrationTrack['lines'][number], cue: string | number, from: number): number {
  if (typeof cue === 'number') {
    return line.words.length ? clamp(Math.round(cue), 0, line.words.length - 1) : -1;
  }

  const wanted = cue.split(/\s+/).map(bareWord).filter(Boolean);
  if (wanted.length === 0) return -1;

  const matchesAt = (start: number) =>
    wanted.every((word, offset) => bareWord(line.words[start + offset]?.w ?? '') === word);

  const last = line.words.length - wanted.length;
  for (let index = Math.max(0, from); index <= last; index += 1) {
    if (matchesAt(index)) return index;
  }
  // A cue given out of order still deserves to be found, so fall back to a
  // search over the whole line before giving up on it.
  for (let index = 0; index <= last; index += 1) {
    if (matchesAt(index)) return index;
  }
  return -1;
}

export interface StepTiming {
  track: NarrationTrack;
  durationMs: number;
  /** Cumulative 0..1 window each mark is drawn in. */
  spans: { start: number; end: number }[];
  /** The recorded clip for this step, or null while it is still silent. */
  src: string | null;
}

/** Where a step's voice clip lives. One clip per step, named after the step. */
export const narrationSrc = (topicId: string, stepId: string) =>
  `/sounds/technical-drawing/${topicId}/${stepId}.mp3`;

export interface DrawingLesson {
  topic: DrawTopic;
  step: DrawStep;
  stepIndex: number;
  stepCount: number;
  /** 0..1 through the current step. */
  progress: number;
  playing: boolean;
  /** True once the last step has run to its end. */
  finished: boolean;
  speed: number;
  /** 0..1 through the full lesson. */
  overallProgress: number;
  /** Total timeline length across every step, in milliseconds. */
  totalDurationMs: number;
  /** Current timeline position across every step, in milliseconds. */
  totalElapsedMs: number;

  /** Everything fully drawn on the sheet right now. */
  marks: Mark[];
  /** What the board should be doing on the line being spoken. */
  cue: LineCue;
  /** Which line of the step is being spoken, or -1 between lines. */
  lineIndex: number;
  /** The mark under the pencil, and how far along it is. */
  drawing: { mark: Mark; t: number } | null;
  /** Marks this step has added, so they can be tinted as "new". */
  stepMarks: Mark[];

  /** Shaped for the shared caption bar and pointing hand. */
  playback: NarrationPlayback;
  /** False while this step uses estimated silent captions instead of a real clip. */
  hasAudio: boolean;
  /** Plain caption lines for silent steps: no fake word-by-word highlighting. */
  plainCaptionLines: string[];
  /** Where on the sheet the hand is pointing, in mm, or null. */
  focusPoint: Pt | null;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  replay: () => void;
  goTo: (index: number) => void;
  restart: () => void;
  setSpeed: (speed: number) => void;
  seekOverall: (fraction: number) => void;
  skipBy: (deltaMs: number) => void;
  /** Jumps to the end of the lesson with the whole drawing complete. */
  showFinished: () => void;
}

const IDLE_PLAYBACK: NarrationPlayback = { line: null, wordIndex: -1, active: false, paused: false };

/** Lays a step out on its own little timeline. */
function timeStep(topic: DrawTopic, step: DrawStep, index: number): StepTiming {
  // A measured track only exists once the clip has been recorded and the
  // caption generator has run over it. Until then, estimate.
  const src = narrationSrc(topic.id, step.id);
  const recorded = DRAWING_NARRATION_TRACKS[src];
  const rawTrack =
    recorded ??
    estimateNarrationTrack(
      `drawing/${topic.id}/${step.id}`,
      step.lines.map((line, lineIndex) => ({
        text: line.text,
        focus: line.at ? { sceneAnchor: 'focus', label: line.label ?? `${index + 1}.${lineIndex + 1}` } : undefined,
      }))
    );

  const lengths = step.marks.map((mark) => Math.max(6, markLength(mark)));
  /** How long this mark takes at a natural pencil speed, in ms. */
  const naturalMs = (index: number) => (lengths[index] / DRAW_SPEED) * 1000;

  // Marks bound to a line share that line's slice of the clip; the rest are
  // drawn one after another from the lead-in.
  const byLine = new Map<number, number[]>();
  step.marks.forEach((_, index) => {
    const lineIndex = step.markLines?.[index];
    if (lineIndex === undefined || !rawTrack.lines[lineIndex]) return;
    byLine.set(lineIndex, [...(byLine.get(lineIndex) ?? []), index]);
  });
  const bound = new Set([...byLine.values()].flat());

  // The step lasts as long as the narration. Only the marks that are *not* tied
  // to a sentence can push it out any further: stretching the step to fit work
  // that is already timed to the voice would only leave silence on the end of
  // it, with nothing being drawn.
  const looseMs = step.marks.reduce(
    (sum, _, index) => (bound.has(index) ? sum : sum + naturalMs(index)),
    0
  );
  const spokenMs = recorded ? rawTrack.duration * 1000 : 0;
  const drawMs = lengths.reduce((sum, length) => sum + (length / DRAW_SPEED) * 1000, 0);
  const silentCaptionMs = rawTrack.lines.length * 900;
  const durationMs = recorded
    ? Math.max(MIN_STEP_MS, spokenMs, looseMs / (1 - LEAD_IN - TAIL))
    : Math.max(MIN_STEP_MS, silentCaptionMs, drawMs / (1 - LEAD_IN - TAIL));
  const track = recorded ? rawTrack : scaleTrack(rawTrack, durationMs / 1000);

  /**
   * When the step says which line each mark belongs to, the mark is drawn
   * across that line's own slice of the clip — so the pencil is on the line the
   * narrator is describing. Otherwise the marks are drawn one after another at
   * a natural pencil speed and the pencil then rests: stretching one short line
   * across a fifty second explanation is what made this feel slow.
   */
  const spans: { start: number; end: number }[] = new Array(step.marks.length);

  byLine.forEach((indices, lineIndex) => {
    const line = track.lines[lineIndex];
    const fromMs = line.start * 1000;
    const untilMs = Math.max(fromMs + 120, line.end * 1000);

    /**
     * Where each mark starts. A mark with a word cue starts on that word, so a
     * count lands with the counting; anything else is left open for now.
     */
    const startMs: (number | null)[] = indices.map(() => null);
    let searchFrom = 0;
    indices.forEach((markIndex, slot) => {
      const cue = step.markWords?.[markIndex];
      if (cue === undefined) return;
      const wordIndex = cueWordIndex(line, cue, searchFrom);
      if (wordIndex < 0) return;
      searchFrom = wordIndex + 1;
      startMs[slot] = clamp(line.words[wordIndex].t * 1000, fromMs, untilMs);
    });

    /**
     * Everything without a cue is spread across the room left between the cues
     * around it, in proportion to how long each is to draw — so a sentence that
     * carries six marks lays them down across the whole sentence rather than
     * rattling all six off in its first second and then watching him talk.
     */
    let slot = 0;
    while (slot < indices.length) {
      if (startMs[slot] !== null) {
        slot += 1;
        continue;
      }
      let after = slot;
      while (after < indices.length && startMs[after] === null) after += 1;

      const openMs =
        slot === 0 ? fromMs : Math.min(untilMs, startMs[slot - 1]! + naturalMs(indices[slot - 1]));
      const closeMs = after < indices.length ? startMs[after]! : untilMs;
      const room = Math.max(0, closeMs - openMs);
      const run = indices.slice(slot, after);
      const runLength = run.reduce((sum, index) => sum + lengths[index], 0) || 1;

      let walked = 0;
      for (let index = slot; index < after; index += 1) {
        startMs[index] = openMs + room * (walked / runLength);
        walked += lengths[indices[index]];
      }
      slot = after;
    }

    // Each mark then runs at a natural pencil speed, cut short only where the
    // next one is already due — which is what compresses a count that has more
    // to draw than the sentence has room for.
    indices.forEach((markIndex, index) => {
      const start = startMs[index]!;
      const nextMs = index + 1 < indices.length ? startMs[index + 1]! : untilMs;
      const takesMs = Math.min(naturalMs(markIndex), Math.max(120, nextMs - start));
      spans[markIndex] = { start: start / durationMs, end: (start + takesMs) / durationMs };
    });
  });

  // Anything not bound to a line is drawn at a natural pencil speed, one after
  // another from the lead-in, and the pencil then rests until the step ends.
  let walkedMs = LEAD_IN * durationMs;
  step.marks.forEach((_, index) => {
    if (spans[index]) return;
    const takesMs = (lengths[index] / DRAW_SPEED) * 1000;
    spans[index] = {
      start: walkedMs / durationMs,
      end: Math.min(1 - TAIL, (walkedMs + takesMs) / durationMs),
    };
    walkedMs += takesMs;
  });

  return { track, durationMs, spans, src: recorded ? src : null };
}

export function useDrawingLesson(topic: DrawTopic): DrawingLesson {
  const timings = useMemo(
    () => topic.steps.map((step, index) => timeStep(topic, step, index)),
    [topic]
  );

  const narrator = useExperimentNarrator();
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  /** Bumped on every seek, so replaying the same step restarts its clip. */
  const [playToken, setPlayToken] = useState(0);

  // The clock lives in a ref so the animation loop never re-subscribes; React
  // state is only updated with the sampled value each frame.
  const elapsedRef = useRef(0);
  const stepIndexRef = useRef(0);
  const speedRef = useRef(1);
  stepIndexRef.current = stepIndex;
  speedRef.current = speed;

  const timing = timings[Math.min(stepIndex, timings.length - 1)];
  const step = topic.steps[Math.min(stepIndex, topic.steps.length - 1)];
  const totalDurationMs = useMemo(
    () => timings.reduce((sum, item) => sum + item.durationMs, 0),
    [timings]
  );
  const elapsedBeforeStep = useMemo(
    () => timings.slice(0, stepIndex).reduce((sum, item) => sum + item.durationMs, 0),
    [timings, stepIndex]
  );
  const totalElapsedMs = finished ? totalDurationMs : Math.min(totalDurationMs, elapsedBeforeStep + elapsed);

  const seek = useCallback((index: number, ms = 0) => {
    const safeIndex = clamp(index, 0, Math.max(0, timings.length - 1));
    const safeTiming = timings[safeIndex];
    const safeMs = clamp(ms, 0, safeTiming?.durationMs ?? 0);
    elapsedRef.current = safeMs;
    stepIndexRef.current = safeIndex;
    setElapsed(safeMs);
    setStepIndex(safeIndex);
    setFinished(false);
    setPlayToken((token) => token + 1);
  }, [timings]);

  const seekAbsolute = useCallback(
    (wantedMs: number) => {
      if (!timings.length) return;
      const atMs = clamp(wantedMs, 0, totalDurationMs);
      if (atMs >= totalDurationMs) {
        const lastIndex = timings.length - 1;
        const last = timings[lastIndex];
        seek(lastIndex, last?.durationMs ?? 0);
        setPlaying(false);
        setFinished(true);
        return;
      }

      let walked = 0;
      for (let index = 0; index < timings.length; index += 1) {
        const durationMs = timings[index].durationMs;
        if (atMs <= walked + durationMs) {
          seek(index, atMs - walked);
          return;
        }
        walked += durationMs;
      }
    },
    [seek, timings, totalDurationMs]
  );

  /* ------------------------------------------------------------- the clock */

  useEffect(() => {
    if (!playing) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = (now - last) * speedRef.current;
      last = now;
      const current = timings[stepIndexRef.current];

      // With a voice on this step, the voice is the clock. Without one — or if
      // the clip failed to load — the wall clock carries the lesson silently.
      const audio = narrator.audioRef.current;
      const onTheVoice =
        current?.src && audio && !audio.paused && narrator.currentSrc === current.src;
      const next = onTheVoice ? audio.currentTime * 1000 : elapsedRef.current + delta;

      if (current && next >= current.durationMs) {
        const following = stepIndexRef.current + 1;
        if (following < timings.length) {
          elapsedRef.current = next - current.durationMs;
          // Move the ref with the state: another frame can fire before React
          // has re-rendered, and it must not skip a step.
          stepIndexRef.current = following;
          setStepIndex(following);
        } else {
          elapsedRef.current = current.durationMs;
          setElapsed(current.durationMs);
          setPlaying(false);
          setFinished(true);
          return;
        }
      } else {
        elapsedRef.current = next;
      }

      setElapsed(elapsedRef.current);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, timings, narrator]);

  /* --------------------------------------------------------------- the voice */

  const clipSrc = timing?.src ?? null;

  useEffect(() => {
    if (!clipSrc) {
      narrator.stop();
      return;
    }
    if (!playing) {
      narrator.pause();
      return;
    }
    // A fresh step, or a replay of this one, starts the clip again; carrying on
    // after a pause resumes it where the voice stopped.
    if (narrator.currentSrc !== clipSrc || elapsedRef.current === 0 || playToken > 0) {
      narrator.play(clipSrc, undefined, elapsedRef.current / 1000);
    } else {
      narrator.resume();
    }
    // `playToken` is what makes a replay of the same step restart the clip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipSrc, playing, playToken]);

  // The speed control moves the voice with the pencil.
  useEffect(() => {
    const audio = narrator.audioRef.current;
    if (audio) audio.playbackRate = speed;
  }, [speed, narrator, clipSrc]);

  // A different lesson is a fresh sheet.
  useEffect(() => {
    elapsedRef.current = 0;
    setElapsed(0);
    setStepIndex(0);
    setPlaying(false);
    setFinished(false);
    narrator.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.id]);

  /* -------------------------------------------------------- what is on show */

  const progress = timing ? Math.min(1, elapsed / timing.durationMs) : 0;
  const overallProgress = totalDurationMs > 0 ? clamp(totalElapsedMs / totalDurationMs, 0, 1) : 0;

  const { marks, drawing, stepMarks } = useMemo(() => {
    const before: Mark[] = [
      ...topic.base,
      ...topic.steps.slice(0, stepIndex).flatMap((item) => item.marks),
    ];

    if (finished) {
      const all = [...before, ...step.marks];
      return { marks: all, drawing: null, stepMarks: step.marks };
    }

    const done: Mark[] = [];
    let active: { mark: Mark; t: number } | null = null;

    for (let index = 0; index < step.marks.length; index += 1) {
      const span = timing?.spans[index];
      if (!span) continue;
      if (progress >= span.end) {
        done.push(step.marks[index]);
        continue;
      }
      if (progress > span.start && active === null) {
        const width = span.end - span.start || 1;
        active = { mark: step.marks[index], t: (progress - span.start) / width };
      }
    }

    return { marks: [...before, ...done], drawing: active, stepMarks: done };
  }, [topic, stepIndex, step, timing, progress, finished]);

  /* ------------------------------------------------------------- captions */

  const playback = useMemo<NarrationPlayback>(() => {
    if (!timing) return IDLE_PLAYBACK;
    const time = elapsed / 1000;
    const line = timing.track.lines.find((item) => time >= item.start && time < item.end) ?? null;
    if (!line) {
      // Between lines the bar stays up holding the last thing said, otherwise
      // it flickers off and on between every sentence.
      const previous = [...timing.track.lines].reverse().find((item) => time >= item.end) ?? null;
      return { line: previous, wordIndex: previous ? previous.words.length - 1 : -1, active: true, paused: !playing };
    }

    let wordIndex = -1;
    for (let i = line.words.length - 1; i >= 0; i -= 1) {
      if (time >= line.words[i].t) {
        wordIndex = i;
        break;
      }
    }
    return { line, wordIndex, active: true, paused: !playing };
  }, [timing, elapsed, playing]);

  const hasAudio = Boolean(timing?.src);
  const plainCaptionLines = useMemo(() => {
    if (hasAudio || !timing?.track.lines.length) return [];
    const lines = timing.track.lines;
    const current = playback.line ? Math.max(0, lines.indexOf(playback.line)) : 0;
    const start = Math.min(Math.max(0, current), Math.max(0, lines.length - 3));
    return lines.slice(start, start + 3).map((line) => line.text);
  }, [hasAudio, timing, playback.line]);

  /** Which line of the step is being spoken, or -1 between lines. */
  const lineIndex = useMemo(() => {
    const line = playback.line;
    if (!line || !timing) return -1;
    return timing.track.lines.indexOf(line);
  }, [playback.line, timing]);

  const focusPoint = useMemo<Pt | null>(
    () => (lineIndex >= 0 ? step.lines[lineIndex]?.at ?? null : null),
    [lineIndex, step]
  );

  /**
   * What the board should be doing right now: the cue on the line being spoken,
   * falling back to the step's own settings between lines.
   */
  const cue = useMemo<LineCue>(() => {
    const line = lineIndex >= 0 ? step.lines[lineIndex] : undefined;

    /**
     * A step that opens the compass line by line starts with it shut, and only
     * ever shows the opening that has been reached so far — walking back to the
     * last one declared. Falling through to the step's own radius instead would
     * show the finished opening before the narrator has said a word, and the
     * compass would appear to snap shut when he starts talking about opening it.
     */
    const opensByLine = step.lines.some((item) => item.compassRadius !== undefined);
    let compassRadius = step.compassRadius;
    if (opensByLine) {
      // Everything opened so far — the last radius declared *before* this line.
      let from = 0;
      for (let index = 0; index < lineIndex && index < step.lines.length; index += 1) {
        const declared = step.lines[index].compassRadius;
        if (declared !== undefined) from = declared;
      }

      const wanted = lineIndex >= 0 ? step.lines[lineIndex]?.compassRadius : undefined;
      if (wanted === undefined) {
        compassRadius = from;
      } else {
        // The legs open *across the sentence that asks for it*, not in a jump
        // at the start of it. "Open it to more than half the line" then reads
        // as an instruction being carried out while it is spoken, which is the
        // whole reason for showing the instrument at all.
        const track = timing?.track.lines[lineIndex];
        const spoken = track ? Math.max(0.2, track.end - track.start) : 1;
        const into = track ? elapsed / 1000 - track.start : spoken;
        compassRadius = from + (wanted - from) * clamp(into / spoken, 0, 1);
      }
    }

    return {
      compassRadius,
      focus: line?.focus ?? step.focus,
      alert: line?.alert,
    };
  }, [lineIndex, step, timing, elapsed]);

  /* ------------------------------------------------------------- controls */

  const play = useCallback(() => {
    if (finished) {
      seek(0, 0);
    }
    setPlaying(true);
  }, [finished, seek]);

  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? setPlaying(false) : play()), [play, playing]);

  const next = useCallback(() => {
    if (stepIndex + 1 < topic.steps.length) seek(stepIndex + 1, 0);
    else {
      elapsedRef.current = timing?.durationMs ?? 0;
      setElapsed(elapsedRef.current);
      setFinished(true);
      setPlaying(false);
    }
  }, [seek, stepIndex, timing, topic.steps.length]);

  const previous = useCallback(() => seek(Math.max(0, stepIndex - 1), 0), [seek, stepIndex]);
  const replay = useCallback(() => {
    seek(stepIndex, 0);
    setPlaying(true);
  }, [seek, stepIndex]);
  const goTo = useCallback(
    (index: number) => seek(Math.min(Math.max(0, index), topic.steps.length - 1), 0),
    [seek, topic.steps.length]
  );
  const restart = useCallback(() => {
    seek(0, 0);
    setPlaying(true);
  }, [seek]);
  const seekOverall = useCallback(
    (fraction: number) => seekAbsolute(totalDurationMs * clamp(fraction, 0, 1)),
    [seekAbsolute, totalDurationMs]
  );
  const skipBy = useCallback(
    (deltaMs: number) => {
      const nextMs = totalElapsedMs + deltaMs;
      seekAbsolute(nextMs);
      if (nextMs < totalDurationMs && playing) setPlaying(true);
    },
    [seekAbsolute, totalElapsedMs, totalDurationMs, playing]
  );
  const showFinished = useCallback(() => {
    setStepIndex(topic.steps.length - 1);
    const last = timings[timings.length - 1];
    elapsedRef.current = last?.durationMs ?? 0;
    setElapsed(elapsedRef.current);
    setPlaying(false);
    setFinished(true);
  }, [timings, topic.steps.length]);

  return {
    topic,
    step,
    stepIndex,
    stepCount: topic.steps.length,
    progress,
    overallProgress,
    totalDurationMs,
    totalElapsedMs,
    playing,
    finished,
    speed,
    marks,
    drawing,
    stepMarks,
    playback,
    hasAudio,
    plainCaptionLines,
    focusPoint,
    cue,
    lineIndex,
    play,
    pause,
    toggle,
    next,
    previous,
    replay,
    goTo,
    restart,
    setSpeed,
    seekOverall,
    skipBy,
    showFinished,
  };
}
