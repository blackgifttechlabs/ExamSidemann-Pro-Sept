import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Download,
  Edit,
  GraduationCap,
  Link2,
  ListChecks,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  Search,
  Server,
  Shield,
  SkipBack,
  SkipForward,
  Square,
  Table as TableIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useExperimentNarrator } from "../../../../../lib/audio/experimentNarrator";
import { TEACH_ME_SHIMMER_CSS } from "../../../../practicals/tools/shared/teachMeShimmer";
import { cueTimeMs, type CaptionLine } from "../../../../../lib/audio/narrationCaptions";
import {
  ALL_LESSONS,
  TEACH_ME_CHAPTERS,
  findLesson,
  lessonHasAudio,
  lessonMinutes,
  resolveClipSrc,
  stepAudioBase,
  stepTrack,
  type BoardItem,
  type TeachChapter,
  type TeachFocus,
  type TeachLesson,
  type TeachStep,
} from "./sqlTeachMeContent";

/**
 * "Teach me" — the narrated SQL course that drives the console.
 *
 * A lesson is a list of steps, and a step is one voice clip. While the clip
 * plays, the SQL for that step is typed into the editor and then run, at the
 * exact moment the narrator describes it, so the learner hears "watch me press
 * Run" and sees Run being pressed.
 *
 * Every cue is measured against the clip's own caption track rather than a
 * timer, which means a re-recorded voice retimes the demonstration by itself.
 * Clips that have not been recorded yet fall back to estimated timings, so the
 * whole course already works end to end — silently — while the audio is being
 * produced. See `sqlTeachMeContent.ts`.
 */

/** What the lesson player is allowed to do to the console around it. */
export interface TeachMeActions {
  /** Type SQL into the editor, character by character, as a person would. */
  typeCode: (code: string) => void;
  /** Empty the editor and the result panel. */
  clearCode: () => void;
  /** Press Run. */
  runCode: () => void;
  /** Execute SQL without showing it — used for a lesson's setup data. */
  runSilently: (sql: string) => void;
  /** Light up a fragment of the SQL inside the editor, or clear the highlight. */
  markCode: (find: string | null) => void;
  /** On a phone, bring the editor back into view. */
  showCode: () => void;
}

type PlayerPhase = "idle" | "playing" | "paused" | "finished";

interface StepClock {
  /** The clip actually being played, once probing has found it. */
  src: string | null;
  budgetMs: number;
  cues: { atMs: number; run: () => void }[];
  nextCue: number;
  elapsedMs: number;
  lastTs: number;
  hasAudio: boolean;
  ended: boolean;
}

export interface TeachMeController {
  /** Which chapter list / lesson screen the panel is showing. */
  openChapterId: string | null;
  toggleChapter: (chapterId: string) => void;
  lesson: TeachLesson | null;
  chapter: TeachChapter | null;
  lessonIndex: number;
  stepIndex: number;
  phase: PlayerPhase;
  muted: boolean;
  toggleMuted: () => void;
  openLesson: (lessonId: string) => void;
  closeLesson: () => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  replayStep: () => void;
  nextLesson: () => void;
  /** The line being spoken, and which word inside it. */
  caption: { line: CaptionLine | null; wordIndex: number };
  /** The part of the console being pointed at, or null. */
  spotlight: TeachFocus | null;
  /** How many whiteboard items have been drawn so far in this step. */
  boardRevealed: number;
  completed: Record<string, boolean>;
}

const STORAGE_KEY = "sqlTeachMeCompleted";

function readCompleted(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function useSqlTeachMe(actions: TeachMeActions): TeachMeController {
  const narrator = useExperimentNarrator();
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const [openChapterId, setOpenChapterId] = useState<string | null>(TEACH_ME_CHAPTERS[0]?.id ?? null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<PlayerPhase>("idle");
  const [muted, setMuted] = useState(false);
  const [caption, setCaption] = useState<{ line: CaptionLine | null; wordIndex: number }>({
    line: null,
    wordIndex: -1,
  });
  const [spotlight, setSpotlight] = useState<TeachFocus | null>(null);
  const [boardRevealed, setBoardRevealed] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => setCompleted(readCompleted()), []);

  const location = lessonId ? findLesson(lessonId) : undefined;
  const lesson = location?.lesson ?? null;
  const chapter = location?.chapter ?? null;

  const clockRef = useRef<StepClock | null>(null);
  const frameRef = useRef(0);
  const runIdRef = useRef(0);
  const phaseRef = useRef<PlayerPhase>("idle");
  phaseRef.current = phase;
  // The player advances itself, so the effect that starts a step must be able
  // to tell "the learner pressed next" from "the step is simply still running".
  const startedKeyRef = useRef<string | null>(null);

  const stopClock = useCallback(() => {
    if (frameRef.current) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    clockRef.current = null;
  }, []);

  const stop = useCallback(() => {
    runIdRef.current += 1;
    startedKeyRef.current = null;
    stopClock();
    narrator.stop();
    setPhase("idle");
    setCaption({ line: null, wordIndex: -1 });
    setSpotlight(null);
  }, [narrator, stopClock]);

  const markCompleted = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* a full or blocked localStorage must never stop the lesson */
      }
      return next;
    });
  }, []);

  /* Starting a step: queue the demonstration, then start the voice. */
  useEffect(() => {
    if (!lesson || phase !== "playing") return;
    const step = lesson.steps[stepIndex];
    if (!step) return;

    const key = `${lesson.id}:${stepIndex}:${runIdRef.current}`;
    if (startedKeyRef.current === key) return;
    startedKeyRef.current = key;

    const track = stepTrack(lesson.id, step);
    const base = stepAudioBase(lesson.id, step.id);
    const budgetMs = Math.round(track.duration * 1000);
    const runId = runIdRef.current;
    const act = actionsRef.current;

    act.showCode();
    setSpotlight(null);
    setBoardRevealed(0);
    act.markCode(null);
    if (step.sql) act.clearCode();

    const cues: { atMs: number; run: () => void }[] = [];

    // The pointing hand of a text console: point at, and light up, whatever the
    // line is about. A board covers the console, so the two never both apply.
    if (!step.board) {
      track.lines.forEach((line) => {
        const target = line.focus?.selector as TeachFocus | undefined;
        if (!target) return;
        cues.push({ atMs: Math.round(line.start * 1000), run: () => setSpotlight(target) });
      });
    }

    // Whiteboard items are drawn as the narrator reaches the phrase that
    // describes them, so the picture builds at the speed of the explanation.
    step.board?.items.forEach((item, index) => {
      const atMs = item.cue ? cueTimeMs(track, item.cue, Math.round((budgetMs * index) / step.board!.items.length)) : 0;
      cues.push({ atMs, run: () => setBoardRevealed((current) => Math.max(current, index + 1)) });
    });

    if (step.sql) {
      cues.push({
        atMs: step.typeCue ? cueTimeMs(track, step.typeCue, 400) : 400,
        run: () => act.typeCode(step.sql as string),
      });
    }
    if (step.sql && step.runCue && !step.serverOnly) {
      cues.push({
        atMs: cueTimeMs(track, step.runCue, Math.round(budgetMs * 0.6)),
        run: () => act.runCode(),
      });
    }

    // "Do you see those two dashes?" — light them up in the editor as it is said.
    step.marks?.forEach((mark) => {
      cues.push({ atMs: cueTimeMs(track, mark.cue, 0), run: () => act.markCode(mark.find) });
    });

    clockRef.current = {
      src: null,
      budgetMs,
      cues: cues.sort((a, b) => a.atMs - b.atMs),
      nextCue: 0,
      elapsedMs: 0,
      lastTs: performance.now(),
      hasAudio: false,
      ended: false,
    };

    if (!muted) {
      // The clip may have been delivered as .mp3, .wav or anything else in the
      // list, so find out which before asking the narrator for it.
      void resolveClipSrc(base).then((resolved) => {
        if (!resolved || runIdRef.current !== runId || !clockRef.current) return;
        clockRef.current.src = resolved;
        narrator.play(resolved, () => {
          if (runIdRef.current !== runId) return;
          if (clockRef.current) clockRef.current.ended = true;
        });
      });
    }

    let lastLine: CaptionLine | null = null;
    let lastWord = -1;

    const tick = (ts: number) => {
      const clock = clockRef.current;
      if (!clock || runIdRef.current !== runId) return;

      const audio = narrator.audioRef.current;
      const audioRunning = !!audio && !!clock.src && audio.src.endsWith(clock.src) && audio.currentTime > 0;
      if (audioRunning) {
        clock.hasAudio = true;
        clock.elapsedMs = (audio as HTMLAudioElement).currentTime * 1000;
      } else if (phaseRef.current === "playing" && !clock.hasAudio) {
        // No recording for this clip (or it has not started yet) — run the
        // demonstration on wall-clock time so the lesson still teaches.
        clock.elapsedMs += ts - clock.lastTs;
      }
      clock.lastTs = ts;

      while (clock.nextCue < clock.cues.length && clock.elapsedMs >= clock.cues[clock.nextCue].atMs) {
        const cue = clock.cues[clock.nextCue];
        clock.nextCue += 1;
        cue.run();
      }

      const seconds = clock.elapsedMs / 1000;
      const line = track.lines.find((item) => seconds >= item.start && seconds < item.end) ?? null;
      let wordIndex = -1;
      if (line) {
        for (let i = line.words.length - 1; i >= 0; i -= 1) {
          if (seconds >= line.words[i].t) {
            wordIndex = i;
            break;
          }
        }
      }
      if (line !== lastLine || wordIndex !== lastWord) {
        lastLine = line;
        lastWord = wordIndex;
        setCaption({ line, wordIndex });
      }

      const finished = clock.elapsedMs >= clock.budgetMs && (clock.ended || !clock.hasAudio);
      if (finished) {
        stopClock();
        if (stepIndex < lesson.steps.length - 1) {
          setStepIndex(stepIndex + 1);
        } else {
          markCompleted(lesson.id);
          setPhase("finished");
          setCaption({ line: null, wordIndex: -1 });
          setSpotlight(null);
        }
        return;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
  }, [lesson, markCompleted, muted, narrator, phase, stepIndex, stopClock]);

  useEffect(() => () => stopClock(), [stopClock]);

  const openLesson = useCallback(
    (id: string) => {
      const target = findLesson(id);
      if (!target) return;
      runIdRef.current += 1;
      startedKeyRef.current = null;
      stopClock();
      narrator.stop();
      const act = actionsRef.current;
      if (target.lesson.setupSql) act.runSilently(target.lesson.setupSql);
      act.clearCode();
      setSpotlight(null);
      setLessonId(id);
      setStepIndex(0);
      setCaption({ line: null, wordIndex: -1 });
      setPhase("playing");
    },
    [narrator, stopClock],
  );

  const closeLesson = useCallback(() => {
    stop();
    setLessonId(null);
    setStepIndex(0);
  }, [stop]);

  const play = useCallback(() => {
    if (!lesson) return;
    if (phase === "paused") {
      if (clockRef.current) clockRef.current.lastTs = performance.now();
      setPhase("playing");
      if (!muted) narrator.resume();
      return;
    }
    if (phase === "finished") {
      runIdRef.current += 1;
      startedKeyRef.current = null;
      setStepIndex(0);
    }
    setPhase("playing");
  }, [lesson, muted, narrator, phase]);

  const pause = useCallback(() => {
    if (phase !== "playing") return;
    setPhase("paused");
    narrator.pause();
  }, [narrator, phase]);

  const togglePlay = useCallback(() => {
    if (phase === "playing") pause();
    else play();
  }, [pause, phase, play]);

  const goToStep = useCallback(
    (index: number) => {
      if (!lesson) return;
      const clamped = Math.max(0, Math.min(lesson.steps.length - 1, index));
      runIdRef.current += 1;
      startedKeyRef.current = null;
      stopClock();
      narrator.stop();
      setSpotlight(null);
      setCaption({ line: null, wordIndex: -1 });
      setStepIndex(clamped);
      setPhase("playing");
    },
    [lesson, narrator, stopClock],
  );

  const nextStep = useCallback(() => goToStep(stepIndex + 1), [goToStep, stepIndex]);
  const previousStep = useCallback(() => goToStep(stepIndex - 1), [goToStep, stepIndex]);
  const replayStep = useCallback(() => goToStep(stepIndex), [goToStep, stepIndex]);

  const nextLesson = useCallback(() => {
    if (!lesson) return;
    const at = ALL_LESSONS.findIndex((entry) => entry.lesson.id === lesson.id);
    const following = ALL_LESSONS[at + 1];
    if (following) openLesson(following.lesson.id);
  }, [lesson, openLesson]);

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      if (!prev) narrator.stop();
      return !prev;
    });
  }, [narrator]);

  const toggleChapter = useCallback((chapterId: string) => {
    setOpenChapterId((prev) => (prev === chapterId ? null : chapterId));
  }, []);

  return {
    openChapterId,
    toggleChapter,
    lesson,
    chapter,
    lessonIndex: location?.index ?? 0,
    stepIndex,
    phase,
    muted,
    toggleMuted,
    openLesson,
    closeLesson,
    play,
    pause,
    togglePlay,
    stop,
    goToStep,
    nextStep,
    previousStep,
    replayStep,
    nextLesson,
    caption,
    spotlight,
    boardRevealed,
    completed,
  };
}

/* ------------------------------------------------------------------ */
/* UI                                                                   */
/* ------------------------------------------------------------------ */

const CHAPTER_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  database: Database,
  table: TableIcon,
  download: Download,
  search: Search,
  edit: Edit,
  link: Link2,
  chart: BarChart2,
  shield: Shield,
};

const CHAPTER_TONES = [
  { light: "bg-indigo-100 text-indigo-600", dark: "bg-indigo-900/40 text-indigo-300" },
  { light: "bg-emerald-100 text-emerald-600", dark: "bg-emerald-900/40 text-emerald-300" },
  { light: "bg-sky-100 text-sky-600", dark: "bg-sky-900/40 text-sky-300" },
  { light: "bg-purple-100 text-purple-600", dark: "bg-purple-900/40 text-purple-300" },
  { light: "bg-amber-100 text-amber-600", dark: "bg-amber-900/40 text-amber-300" },
  { light: "bg-rose-100 text-rose-600", dark: "bg-rose-900/40 text-rose-300" },
  { light: "bg-teal-100 text-teal-600", dark: "bg-teal-900/40 text-teal-300" },
  { light: "bg-slate-200 text-slate-700", dark: "bg-slate-700/50 text-slate-200" },
];

export const TeachMePanel: React.FC<{ controller: TeachMeController; isDarkMode: boolean }> = ({
  controller,
  isDarkMode,
}) => {
  if (controller.lesson) {
    return <LessonScreen controller={controller} isDarkMode={isDarkMode} />;
  }
  return <ChapterList controller={controller} isDarkMode={isDarkMode} />;
};

/**
 * The chapter picker.
 *
 * Deliberately sparse: one line of explanation at the top, then a card per
 * chapter and a row per lesson. Everything a learner cannot act on — the
 * chapter blurb, the lesson summary, the step count in prose — was cut, because
 * this panel sits in a narrow rail beside the editor and a wall of grey text is
 * the fastest way to make somebody stop reading it.
 */
const ChapterList: React.FC<{ controller: TeachMeController; isDarkMode: boolean }> = ({
  controller,
  isDarkMode,
}) => {
  const doneCount = Object.keys(controller.completed).length;
  const progress = ALL_LESSONS.length > 0 ? Math.round((doneCount / ALL_LESSONS.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-2.5">
      <div
        className={`rounded-[15px] border p-4 ${
          isDarkMode ? "border-indigo-500/25 bg-indigo-950/30" : "border-indigo-100 bg-indigo-50/70"
        }`}
      >
        <div className="flex items-center gap-2">
          <GraduationCap className={`h-4 w-4 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`} />
          <h3 className={`text-sm font-bold ${isDarkMode ? "text-indigo-100" : "text-indigo-900"}`}>
            Teach me SQL
          </h3>
        </div>
        <p className={`mt-1 text-[12px] ${isDarkMode ? "text-gray-400" : "text-indigo-900/60"}`}>
          Every command typed and run for you.
        </p>

        <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-white/10" : "bg-indigo-200/60"}`}>
          <div
            className="h-full rounded-full bg-indigo-500 transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={`mt-1.5 text-[11px] font-semibold ${isDarkMode ? "text-gray-500" : "text-indigo-700/70"}`}>
          {doneCount} of {ALL_LESSONS.length} done
        </p>
      </div>

      {TEACH_ME_CHAPTERS.map((chapter, index) => {
        const Icon = CHAPTER_ICONS[chapter.icon] ?? BookOpen;
        const tone = CHAPTER_TONES[index % CHAPTER_TONES.length];
        const isOpen = controller.openChapterId === chapter.id;
        const done = chapter.lessons.filter((lesson) => controller.completed[lesson.id]).length;

        return (
          <div
            key={chapter.id}
            className={`overflow-hidden rounded-[15px] border ${
              isDarkMode ? "border-[#30363d] bg-[#161b22]" : "border-gray-200 bg-white"
            }`}
          >
            <button
              type="button"
              onClick={() => controller.toggleChapter(chapter.id)}
              className={`flex w-full items-center gap-3 p-3 text-left transition-colors ${
                isDarkMode ? "hover:bg-[#1c2330]" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] ${
                  isDarkMode ? tone.dark : tone.light
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  {chapter.title}
                </span>
                <span className="mt-0.5 block text-[11px] text-gray-500 dark:text-gray-400">
                  {done > 0 ? `${done} of ${chapter.lessons.length} done` : `${chapter.lessons.length} lessons`}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="flex flex-col gap-2 px-3 pb-3">
                {chapter.lessons.map((lesson, lessonIdx) => {
                  const finished = Boolean(controller.completed[lesson.id]);
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => controller.openLesson(lesson.id)}
                      className={`group flex items-center gap-3 rounded-[15px] border p-2.5 text-left transition-all ${
                        isDarkMode
                          ? "border-[#30363d] bg-[#0d1117] hover:border-indigo-500"
                          : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                      }`}
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-[12px] font-bold ${
                          finished
                            ? "bg-emerald-500 text-white"
                            : isDarkMode
                              ? "bg-[#21262d] text-gray-400"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {finished ? <Check className="h-5 w-5" /> : `${index + 1}.${lessonIdx + 1}`}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[13px] font-semibold leading-snug ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                          {lessonMinutes(lesson)} min
                          {/* One amber dot rather than a sentence — it only
                              matters to whoever is still recording the voices. */}
                          {!lessonHasAudio(lesson) && (
                            <span
                              title="No voice recorded yet"
                              className="h-1.5 w-1.5 rounded-full bg-amber-400"
                            />
                          )}
                        </span>
                      </span>

                      <span
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                          isDarkMode
                            ? "bg-indigo-500/15 text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white"
                            : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                        }`}
                      >
                        {finished ? "Again" : "Start"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const LessonScreen: React.FC<{ controller: TeachMeController; isDarkMode: boolean }> = ({
  controller,
  isDarkMode,
}) => {
  const lesson = controller.lesson as TeachLesson;
  const step = lesson.steps[controller.stepIndex];
  const stepListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    stepListRef.current
      ?.querySelector(`[data-step-index="${controller.stepIndex}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [controller.stepIndex]);

  const progress = ((controller.stepIndex + 1) / lesson.steps.length) * 100;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={controller.closeLesson}
        className={`self-start flex items-center gap-1.5 text-[11px] font-semibold ${
          isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
        }`}
      >
        <ChevronLeft className="w-3.5 h-3.5" /> All chapters
      </button>

      <div
        className={`rounded-xl border p-4 ${
          isDarkMode ? "border-[#30363d] bg-[#161b22]" : "border-gray-200 bg-white"
        }`}
      >
        <p className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          {controller.chapter?.title} · Lesson {controller.lessonIndex} of {ALL_LESSONS.length}
        </p>
        <h3 className={`mt-1 text-base font-bold leading-snug ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {lesson.title}
        </h3>
        <p className="mt-1 text-[12px] leading-relaxed text-gray-500 dark:text-gray-400">{lesson.summary}</p>

        <div className={`mt-3 h-1.5 w-full overflow-hidden rounded-full ${isDarkMode ? "bg-[#21262d]" : "bg-gray-100"}`}>
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={controller.togglePlay}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow transition-colors hover:bg-indigo-700"
          >
            {controller.phase === "playing" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {controller.phase === "playing" ? "Pause" : controller.phase === "finished" ? "Start again" : "Play"}
          </button>
          <IconButton title="Previous step" onClick={controller.previousStep} isDarkMode={isDarkMode}>
            <SkipBack className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton title="Repeat this step" onClick={controller.replayStep} isDarkMode={isDarkMode}>
            <RotateCcw className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton title="Next step" onClick={controller.nextStep} isDarkMode={isDarkMode}>
            <SkipForward className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton title="Stop" onClick={controller.stop} isDarkMode={isDarkMode}>
            <Square className="w-3.5 h-3.5" />
          </IconButton>
          <IconButton
            title={controller.muted ? "Turn the voice on" : "Silent mode"}
            onClick={controller.toggleMuted}
            isDarkMode={isDarkMode}
            active={controller.muted}
          >
            {controller.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </IconButton>
        </div>
      </div>

      {step?.expect && (
        <div
          className={`rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed ${
            isDarkMode ? "border-sky-500/30 bg-sky-950/25 text-sky-200" : "border-sky-200 bg-sky-50 text-sky-900"
          }`}
        >
          <span className="font-bold">What you should see: </span>
          {step.expect}
        </div>
      )}

      {step?.serverOnly && (
        <div
          className={`flex gap-2 rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed ${
            isDarkMode ? "border-amber-500/30 bg-amber-950/25 text-amber-200" : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <Server className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            This one only runs on a real MySQL server, not in this browser console. Read it and write it in the exam —
            it is not run here.
          </span>
        </div>
      )}

      {step?.expectError && (
        <div
          className={`flex gap-2 rounded-xl border px-3 py-2.5 text-[12px] leading-relaxed ${
            isDarkMode ? "border-rose-500/30 bg-rose-950/25 text-rose-200" : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>This step fails on purpose. The error message is the lesson — read it carefully.</span>
        </div>
      )}

      <div ref={stepListRef} className="flex flex-col gap-1.5">
        <p className={`px-1 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
          Steps
        </p>
        {lesson.steps.map((item, index) => {
          const isActive = index === controller.stepIndex;
          return (
            <button
              key={item.id}
              type="button"
              data-step-index={index}
              onClick={() => controller.goToStep(index)}
              className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
                isActive
                  ? isDarkMode
                    ? "border-indigo-500 bg-indigo-950/40"
                    : "border-indigo-400 bg-indigo-50"
                  : isDarkMode
                    ? "border-[#30363d] bg-[#0d1117] hover:border-[#4a5568]"
                    : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive ? "bg-indigo-600 text-white" : isDarkMode ? "bg-[#21262d] text-gray-400" : "bg-gray-100 text-gray-500"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`flex-1 text-[12px] font-medium leading-snug ${
                  isActive ? (isDarkMode ? "text-indigo-200" : "text-indigo-900") : isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {item.title}
              </span>
              {isActive && controller.phase === "playing" && (
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>

      <div
        className={`rounded-xl border p-3 ${
          isDarkMode ? "border-emerald-500/30 bg-emerald-950/20" : "border-emerald-200 bg-emerald-50"
        }`}
      >
        <div className="mb-1 flex items-center gap-1.5">
          <ListChecks className={`h-3.5 w-3.5 ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>
            In the exam
          </span>
        </div>
        <p className={`text-[12px] leading-relaxed ${isDarkMode ? "text-emerald-100/80" : "text-emerald-900"}`}>
          {lesson.examTip}
        </p>
      </div>

      {controller.phase === "finished" && (
        <button
          type="button"
          onClick={controller.nextLesson}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow transition-colors hover:bg-emerald-700"
        >
          Next lesson <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const IconButton: React.FC<{
  title: string;
  onClick: () => void;
  isDarkMode: boolean;
  active?: boolean;
  children: React.ReactNode;
}> = ({ title, onClick, isDarkMode, active, children }) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    onClick={onClick}
    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
      active
        ? "border-amber-400 bg-amber-100 text-amber-700 dark:border-amber-500/50 dark:bg-amber-900/30 dark:text-amber-300"
        : isDarkMode
          ? "border-[#30363d] bg-[#0d1117] text-gray-300 hover:bg-[#21262d]"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    }`}
  >
    {children}
  </button>
);

/**
 * The line being spoken, across the bottom of the editor, with the current word
 * lit up. This is what makes the lesson followable with the sound off, and it
 * is the only place a learner on a noisy bus can read along.
 */
export const TeachMeCaptionBar: React.FC<{
  controller: TeachMeController;
  isDarkMode: boolean;
}> = ({ controller, isDarkMode }) => {
  const { line, wordIndex } = controller.caption;
  const lesson = controller.lesson;
  const visible = !!lesson && (controller.phase === "playing" || controller.phase === "paused") && !!line;

  const words = useMemo(() => line?.words ?? [], [line]);
  if (!visible || !lesson) return null;

  const step = lesson.steps[controller.stepIndex];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[60] flex justify-center px-3 pb-3">
      <div
        className={`pointer-events-auto w-full max-w-3xl rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
          isDarkMode
            ? "border-indigo-500/30 bg-[#0d1117]/95 text-gray-100"
            : "border-indigo-200 bg-white/95 text-gray-900"
        }`}
      >
        <div className="mb-1.5 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            {controller.stepIndex + 1}
          </span>
          <span className={`truncate text-[11px] font-semibold uppercase tracking-wider ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            {step?.title}
          </span>
          {controller.phase === "paused" && (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-amber-500">Paused</span>
          )}
          <span className="ml-auto flex shrink-0 items-center gap-1">
            <IconButton title="Repeat this step" onClick={controller.replayStep} isDarkMode={isDarkMode}>
              <RotateCcw className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton
              title={controller.phase === "playing" ? "Pause the lesson" : "Continue the lesson"}
              onClick={controller.togglePlay}
              isDarkMode={isDarkMode}
            >
              {controller.phase === "playing" ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
            </IconButton>
            <IconButton title="Next step" onClick={controller.nextStep} isDarkMode={isDarkMode}>
              <SkipForward className="h-3.5 w-3.5" />
            </IconButton>
            <IconButton title="Stop the lesson" onClick={controller.stop} isDarkMode={isDarkMode}>
              <Square className="h-3.5 w-3.5" />
            </IconButton>
          </span>
        </div>
        <p className="text-[15px] font-medium leading-relaxed sm:text-base">
          {words.map((word, index) => (
            <span
              key={`${word.t}-${index}`}
              className={
                index === wordIndex
                  ? isDarkMode
                    ? "rounded bg-indigo-500/30 px-0.5 text-white"
                    : "rounded bg-indigo-100 px-0.5 text-indigo-900"
                  : index < wordIndex
                    ? isDarkMode
                      ? "text-gray-300"
                      : "text-gray-800"
                    : isDarkMode
                      ? "text-gray-500"
                      : "text-gray-400"
              }
            >
              {word.w}{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pointing at the console                                              */
/* ------------------------------------------------------------------ */

const TARGET_LABELS: Record<TeachFocus, string> = {
  screen: "The console",
  editor: "Where we type",
  run: "The Run button",
  result: "The answer",
};

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Follows the focused element's position on screen.
 *
 * The console resizes constantly — the result panel opens, the split bars get
 * dragged — so the hole and the hand are measured every frame rather than once,
 * and the highlight stays on the thing even while it moves.
 */
function useTargetRect(target: TeachFocus | null): Rect | null {
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    if (!target) {
      setRect(null);
      return;
    }
    let frame = 0;
    let previous: Rect | null = null;

    const measure = () => {
      const node = document.querySelector<HTMLElement>(`[data-teach-target="${target}"]`);
      const box = node?.getBoundingClientRect();
      const next: Rect | null =
        box && box.width > 0 && box.height > 0
          ? { top: box.top, left: box.left, width: box.width, height: box.height }
          : null;
      const moved =
        !previous !== !next ||
        (previous &&
          next &&
          (Math.abs(previous.top - next.top) > 0.5 ||
            Math.abs(previous.left - next.left) > 0.5 ||
            Math.abs(previous.width - next.width) > 0.5 ||
            Math.abs(previous.height - next.height) > 0.5));
      if (moved) {
        previous = next;
        setRect(next);
      }
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    return () => window.cancelAnimationFrame(frame);
  }, [target]);

  return rect;
}

/**
 * Darkens the whole console except the one thing being explained, and puts a
 * hand next to it.
 *
 * The dimming is the point: "do you see this?" only works if there is nothing
 * else to look at. The lit area is a hole punched in a huge box-shadow, so the
 * real editor and the real results stay live and readable inside it.
 */
export const TeachSpotlight: React.FC<{ controller: TeachMeController }> = ({ controller }) => {
  const active = controller.phase === "playing" || controller.phase === "paused";
  const step = controller.lesson?.steps[controller.stepIndex];
  const target = active && !step?.board ? controller.spotlight : null;
  const rect = useTargetRect(target);

  if (!target || !rect) return null;

  const pad = 8;
  const top = Math.max(0, rect.top - pad);
  const left = Math.max(0, rect.left - pad);
  const width = rect.width + pad * 2;
  const height = rect.height + pad * 2;
  // Below the box if it starts near the top of the screen, above it otherwise,
  // so the hand never ends up off-screen on a short result panel.
  const handAbove = top > 96;

  return (
    <div className="pointer-events-none absolute inset-0 z-[40]" aria-hidden="true">
      <div
        className="absolute rounded-xl transition-all duration-500 ease-out"
        style={{
          top,
          left,
          width,
          height,
          boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.62), 0 0 0 2px rgba(129, 140, 248, 0.9) inset",
        }}
      />
      <div
        className="teach-hand absolute flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xl transition-all duration-500 ease-out"
        style={{
          top: handAbove ? top - 40 : top + height + 12,
          left: Math.min(Math.max(12, left + 16), (typeof window === "undefined" ? 1200 : window.innerWidth) - 200),
        }}
      >
        <span className="text-base leading-none">{handAbove ? "👇" : "👆"}</span>
        {TARGET_LABELS[target]}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* The whiteboard                                                       */
/* ------------------------------------------------------------------ */

/**
 * Words too ordinary to mean anything if they happen to appear on the board.
 * Without this, "the", "one" and "table" in a passing sentence would set the
 * whole diagram flashing.
 */
const SPOKEN_STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "has", "one", "two", "its", "our", "out",
  "use", "new", "now", "see", "put", "say", "get", "let", "way", "why", "how", "who", "own", "yes", "off",
  "that", "this", "with", "from", "have", "what", "when", "they", "them", "then", "here", "just", "your",
  "will", "into", "same", "very", "only", "also", "each", "must", "does", "make", "look", "give", "want",
]);

/** Strips punctuation so "database." matches the word "database". */
function spokenToken(word: string | undefined): string | null {
  if (!word) return null;
  const clean = word.toLowerCase().replace(/[^a-z0-9_]/g, "");
  if (clean.length < 3 || SPOKEN_STOPWORDS.has(clean)) return null;
  return clean;
}

/**
 * True when the word being spoken right now is one of the words on this part of
 * the board — which is what makes "database… table… row… column" walk across
 * the four cards as the lecturer names them.
 */
function isBeingSaid(label: string, spoken: string | null): boolean {
  if (!spoken) return false;
  return label
    .toLowerCase()
    .split(/[^a-z0-9_]+/)
    .some((token) => token === spoken || (spoken.length > 4 && token === `${spoken}s`) || token === `${spoken}s`);
}

const SAID_RING = "ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-[#11151c] scale-[1.03] shadow-lg";

const TONE_CLASSES: Record<string, { light: string; dark: string }> = {
  info: { light: "border-indigo-300 bg-indigo-50 text-indigo-900", dark: "border-indigo-500/40 bg-indigo-950/40 text-indigo-100" },
  good: { light: "border-emerald-300 bg-emerald-50 text-emerald-900", dark: "border-emerald-500/40 bg-emerald-950/40 text-emerald-100" },
  warn: { light: "border-amber-300 bg-amber-50 text-amber-900", dark: "border-amber-500/40 bg-amber-950/40 text-amber-100" },
  bad: { light: "border-rose-300 bg-rose-50 text-rose-900", dark: "border-rose-500/40 bg-rose-950/40 text-rose-100" },
};

function tone(name: string | undefined, isDarkMode: boolean): string {
  const entry = TONE_CLASSES[name ?? "info"] ?? TONE_CLASSES.info;
  return isDarkMode ? entry.dark : entry.light;
}

/**
 * The board the lecturer draws on while explaining an idea.
 *
 * It covers the console and dims everything behind it, because a step like
 * "a database is a book, a table is a page" has nothing to show in the editor —
 * the picture *is* the lesson. Items appear one at a time on the narrator's own
 * words; the one being talked about lifts and lights, and the ones already
 * explained settle back so the eye knows where to look.
 */
export const TeachWhiteboard: React.FC<{ controller: TeachMeController; isDarkMode: boolean }> = ({
  controller,
  isDarkMode,
}) => {
  const active = controller.phase === "playing" || controller.phase === "paused";
  const step = controller.lesson?.steps[controller.stepIndex];
  const board = step?.board;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current
      ?.querySelector('[data-board-active="true"]')
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [controller.boardRevealed]);

  if (!active || !board) return null;

  const revealed = Math.max(1, controller.boardRevealed);
  const { line, wordIndex } = controller.caption;
  const spoken = spokenToken(line?.words[wordIndex]?.w);

  return (
    <div className="absolute inset-0 z-[45] flex items-start justify-center overflow-hidden bg-slate-950/75 px-3 pt-4 pb-[196px] backdrop-blur-[2px] lg:pb-[168px]">
      <div
        className={`flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border shadow-2xl transition-all duration-500 ${
          isDarkMode ? "border-[#30363d] bg-[#11151c]" : "border-slate-200 bg-white"
        }`}
      >
        <div
          className={`flex shrink-0 items-center gap-2 border-b px-4 py-2.5 ${
            isDarkMode ? "border-[#30363d] bg-[#161b22]" : "border-slate-200 bg-slate-50"
          }`}
        >
          <PenLine className={`h-4 w-4 ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`} />
          <h3 className={`text-sm font-bold ${isDarkMode ? "text-gray-100" : "text-slate-900"}`}>{board.title}</h3>
        </div>

        <div ref={scrollRef} className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            {board.items.slice(0, revealed).map((item, index) => {
              const isActive = index === revealed - 1;
              return (
                <div
                  key={index}
                  data-board-active={isActive}
                  className={`teach-board-item origin-top transition-all duration-500 ${
                    isActive ? "teach-board-lift" : "opacity-55 saturate-50"
                  }`}
                >
                  <BoardItemView item={item} isDarkMode={isDarkMode} spoken={isActive ? spoken : null} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const BoardItemView: React.FC<{ item: BoardItem; isDarkMode: boolean; spoken: string | null }> = ({
  item,
  isDarkMode,
  spoken,
}) => {
  const frame = isDarkMode ? "border-[#30363d] bg-[#0d1117]" : "border-slate-200 bg-white";
  const muted = isDarkMode ? "text-gray-400" : "text-slate-500";
  const strong = isDarkMode ? "text-gray-100" : "text-slate-900";

  switch (item.kind) {
    case "callout":
      return (
        <div className={`rounded-xl border-2 px-4 py-3 text-[15px] font-semibold leading-relaxed ${tone(item.tone, isDarkMode)}`}>
          {item.text}
        </div>
      );

    case "terms":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {item.items.map((entry, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 px-3 py-2.5 transition-all duration-200 ${tone(entry.tone, isDarkMode)} ${
                isBeingSaid(entry.term, spoken) ? SAID_RING : ""
              }`}
            >
              <p className="font-mono text-sm font-bold">{entry.term}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug opacity-90">{entry.meaning}</p>
            </div>
          ))}
        </div>
      );

    case "stack":
      return (
        <div className={`rounded-xl border-2 border-dashed p-3 ${isDarkMode ? "border-indigo-500/40" : "border-indigo-300"}`}>
          {item.layers.map((layer, index) => (
            <div
              key={index}
              className={`rounded-lg border-2 p-3 transition-all duration-200 ${index > 0 ? "mt-2" : ""} ${tone(
                ["info", "good", "warn", "bad"][index % 4],
                isDarkMode,
              )} ${isBeingSaid(layer.label, spoken) ? SAID_RING : ""}`}
              style={{ marginLeft: index * 14 }}
            >
              <p className="text-sm font-bold">{layer.label}</p>
              {layer.sub && <p className="mt-0.5 text-[12.5px] leading-snug opacity-90">{layer.sub}</p>}
            </div>
          ))}
        </div>
      );

    case "table": {
      // Saying a column's name out loud lights that column, on top of whatever
      // the board item already picks out.
      const saidColumn = item.columns.findIndex((column) => isBeingSaid(column, spoken));
      const litColumn = saidColumn >= 0 ? saidColumn : item.highlightColumn;
      return (
        <div className={`overflow-hidden rounded-xl border-2 ${frame}`}>
          <div
            className={`border-b px-3 py-1.5 font-mono text-[12px] font-bold ${
              isDarkMode ? "border-[#30363d] bg-[#161b22] text-indigo-300" : "border-slate-200 bg-slate-50 text-indigo-700"
            }`}
          >
            {item.name}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr>
                  {item.columns.map((column, index) => (
                    <th
                      key={index}
                      className={`whitespace-nowrap border-b px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        litColumn === index
                          ? "bg-amber-200 text-amber-900 dark:bg-amber-500/30 dark:text-amber-100"
                          : isDarkMode
                            ? "border-[#30363d] text-gray-400"
                            : "border-slate-200 text-slate-500"
                      }`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={
                      item.highlightRow === rowIndex
                        ? "bg-emerald-200/70 dark:bg-emerald-500/25"
                        : isDarkMode
                          ? "odd:bg-[#11161d]"
                          : "odd:bg-slate-50"
                    }
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`whitespace-nowrap px-3 py-1.5 transition-colors ${
                          litColumn === cellIndex
                            ? "bg-amber-100 font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-100"
                            : strong
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {item.note && (
            <p className={`border-t px-3 py-2 text-[12.5px] ${isDarkMode ? "border-[#30363d] " : "border-slate-200 "}${muted}`}>
              {item.note}
            </p>
          )}
        </div>
      );
    }

    case "flow":
      return (
        <div className="flex flex-wrap items-stretch gap-2">
          {item.steps.map((entry, index) => (
            <React.Fragment key={index}>
              <div
                className={`min-w-[120px] flex-1 rounded-xl border-2 px-3 py-2.5 transition-all duration-200 ${tone(
                  "info",
                  isDarkMode,
                )} ${isBeingSaid(entry.label, spoken) ? SAID_RING : ""}`}
              >
                <p className="text-[13px] font-bold leading-snug">{entry.label}</p>
                {entry.sub && <p className="mt-0.5 text-[12px] leading-snug opacity-85">{entry.sub}</p>}
              </div>
              {index < item.steps.length - 1 && (
                <div className="flex items-center">
                  <ArrowRight className={`h-5 w-5 ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      );

    case "compare":
      return (
        <div className={`grid gap-3 ${item.columns.length > 2 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {item.columns.map((column, index) => (
            <div
              key={index}
              className={`rounded-xl border-2 p-3 transition-all duration-200 ${tone(column.tone, isDarkMode)} ${
                isBeingSaid(column.title, spoken) ? SAID_RING : ""
              }`}
            >
              <p className="mb-1.5 font-mono text-[13px] font-bold uppercase tracking-wide">{column.title}</p>
              <ul className="flex flex-col gap-1">
                {column.points.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex gap-1.5 text-[12.5px] leading-snug">
                    <span className="opacity-60">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
};

/**
 * The button in the console's top bar that opens the course. It wears the same
 * shimmering pill as the IT labs — see TeachMeLaunchButton, which owns the CSS.
 * While the lesson is actually running the shimmer would compete with the
 * lesson itself, so the active state drops to a flat solid.
 */
export const TeachMeButton: React.FC<{ onClick: () => void; isActive: boolean; isDarkMode: boolean }> = ({
  onClick,
  isActive,
}) => (
  <>
    <style>{TEACH_ME_SHIMMER_CSS}</style>
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-black active:scale-95 sm:px-3.5 ${
        isActive ? "bg-indigo-700 text-white shadow" : "teachme-btn"
      }`}
      title="Learn SQL with a narrated lesson"
    >
      <GraduationCap className="h-4 w-4" />
      <span>Teach me</span>
    </button>
  </>
);
