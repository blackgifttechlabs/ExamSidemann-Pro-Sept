"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Headphones, Info, Pause, Play, PlayCircle, Speech, Square, Volume2 } from "lucide-react";
import type { NarratorHandle } from "../../../lib/audio/experimentNarrator";
import { ExperimentHeaderPortal, useHasExperimentHeaderSlot } from "./ExperimentHeaderSlots";

/**
 * Shared narration chrome, factored out of the Photosynthesis experiment so every
 * practical can offer the same three things:
 *
 *  - an "Explain" menu of individual voice clips the learner can replay on demand,
 *  - a "Show me" narrated walkthrough that drives the 3D scene automatically, and
 *  - a "Tinashe" guide toggle that drops the learner into the lab with a voice guide.
 */

export interface NarrationClip {
  label: string;
  src: string;
}

export interface WalkthroughStep {
  /** Voice clip played as the step begins. */
  src: string;
  /**
   * Minimum time the 3D animation needs for this step. The walkthrough only moves
   * on once BOTH this time has passed and the voice clip has finished, so the
   * scene never races ahead of the narrator.
   */
  durationMs: number;
  /** Short label shown in the walkthrough status pill. */
  label: string;
  /** Drives the simulation as the step begins. */
  onEnter?: () => void;
}

type WalkthroughPhase = "idle" | "intro" | "step" | "closing";

export interface WalkthroughHandle {
  active: boolean;
  paused: boolean;
  phase: WalkthroughPhase;
  stepIndex: number;
  /** Human-readable status for the goal card / HUD. */
  status: string;
  start: () => void;
  stop: () => void;
  togglePause: () => void;
}

export function useNarratedWalkthrough({
  narrator,
  intro,
  complete,
  steps,
  onStart,
  onStop,
  onComplete,
}: {
  narrator: NarratorHandle;
  intro: string;
  complete: string;
  steps: WalkthroughStep[];
  /** Called before the intro clip — reset the experiment here. */
  onStart?: () => void;
  /** Called when the learner stops the walkthrough early. */
  onStop?: () => void;
  /** Called once the closing clip has finished playing. */
  onComplete?: () => void;
}): WalkthroughHandle {
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<WalkthroughPhase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [stepStarted, setStepStarted] = useState(false);
  const [narrationDone, setNarrationDone] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  const runIdRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const watchdogRef = useRef<number | null>(null);
  const remainingRef = useRef(0);
  const timerStartRef = useRef(0);

  // Steps are read through a ref so a consumer re-creating the array on every
  // render cannot restart the step that is already playing.
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const callbacksRef = useRef({ onStart, onStop, onComplete });
  callbacksRef.current = { onStart, onStop, onComplete };
  // Latest narrator state, so the watchdog below can see whether a clip started.
  const narratorRef = useRef(narrator);
  narratorRef.current = narrator;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearWatchdog = useCallback(() => {
    if (watchdogRef.current !== null) {
      window.clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }
  }, []);

  /**
   * A missing or blocked clip makes `audio.play()` reject, so its `onEnded`
   * callback never fires and the walkthrough would stall. Shortly after asking
   * for a clip we check whether the narrator actually took it; if it did not,
   * we treat the clip as already finished and carry on silently.
   */
  const guardAgainstSilentClip = useCallback(
    (src: string, runId: number, onMissing: () => void) => {
      clearWatchdog();
      watchdogRef.current = window.setTimeout(() => {
        watchdogRef.current = null;
        if (runIdRef.current !== runId) return;
        if (narratorRef.current.currentSrc === src) return;
        onMissing();
      }, 1200);
    },
    [clearWatchdog],
  );

  useEffect(
    () => () => {
      clearTimer();
      clearWatchdog();
    },
    [clearTimer, clearWatchdog],
  );

  const stop = useCallback(() => {
    runIdRef.current += 1;
    clearTimer();
    clearWatchdog();
    narrator.stop();
    setActive(false);
    setPaused(false);
    setPhase("idle");
    setStepIndex(0);
    setStepStarted(false);
    setNarrationDone(false);
    setAnimationDone(false);
    callbacksRef.current.onStop?.();
  }, [clearTimer, clearWatchdog, narrator.stop]);

  const start = useCallback(() => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    clearTimer();
    clearWatchdog();
    narrator.stop();
    callbacksRef.current.onStart?.();
    setActive(true);
    setPaused(false);
    setPhase("intro");
    setStepIndex(0);
    setStepStarted(false);
    setNarrationDone(false);
    setAnimationDone(false);

    narrator.play(intro, () => {
      if (runIdRef.current !== runId) return;
      setPhase("step");
    });
    guardAgainstSilentClip(intro, runId, () => setPhase("step"));
  }, [clearTimer, clearWatchdog, guardAgainstSilentClip, intro, narrator.play, narrator.stop]);

  /* Entering a step: drive the scene and start the voice clip together. */
  useEffect(() => {
    if (!active || paused || phase !== "step" || stepStarted) return;
    const step = stepsRef.current[stepIndex];
    if (!step) return;

    const runId = runIdRef.current;
    setStepStarted(true);
    setNarrationDone(false);
    setAnimationDone(false);
    step.onEnter?.();

    narrator.play(step.src, () => {
      if (runIdRef.current !== runId) return;
      setNarrationDone(true);
    });
    guardAgainstSilentClip(step.src, runId, () => setNarrationDone(true));

    remainingRef.current = step.durationMs;
    timerStartRef.current = performance.now();
    timerRef.current = window.setTimeout(() => {
      if (runIdRef.current !== runId) return;
      setAnimationDone(true);
    }, step.durationMs);
  }, [active, guardAgainstSilentClip, narrator.play, paused, phase, stepIndex, stepStarted]);

  /* Both the animation and the voice have finished — move on. */
  useEffect(() => {
    if (!active || paused || phase !== "step" || !stepStarted || !narrationDone || !animationDone) return;

    const total = stepsRef.current.length;
    if (stepIndex < total - 1) {
      setStepIndex(stepIndex + 1);
      setStepStarted(false);
      setNarrationDone(false);
      setAnimationDone(false);
      return;
    }

    const runId = runIdRef.current;
    setPhase("closing");
    const finish = () => {
      setActive(false);
      setPaused(false);
      setPhase("idle");
      setStepStarted(false);
      callbacksRef.current.onComplete?.();
    };
    narrator.play(complete, () => {
      if (runIdRef.current !== runId) return;
      finish();
    });
    guardAgainstSilentClip(complete, runId, finish);
  }, [
    active,
    animationDone,
    complete,
    guardAgainstSilentClip,
    narrationDone,
    narrator.play,
    paused,
    phase,
    stepIndex,
    stepStarted,
  ]);

  const togglePause = useCallback(() => {
    if (!active) return;

    if (paused) {
      setPaused(false);
      narrator.resume();
      if (phase === "step" && !animationDone && remainingRef.current > 0) {
        const runId = runIdRef.current;
        timerStartRef.current = performance.now();
        timerRef.current = window.setTimeout(() => {
          if (runIdRef.current !== runId) return;
          setAnimationDone(true);
        }, remainingRef.current);
      }
      return;
    }

    setPaused(true);
    narrator.pause();
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current = Math.max(0, remainingRef.current - (performance.now() - timerStartRef.current));
    }
  }, [active, animationDone, narrator.pause, narrator.resume, paused, phase]);

  const currentStep = stepsRef.current[Math.min(stepIndex, Math.max(0, stepsRef.current.length - 1))];
  const status =
    phase === "intro"
      ? "Introduction"
      : phase === "closing"
        ? "Wrapping up"
        : phase === "step"
          ? `${currentStep?.label ?? ""}${animationDone && !narrationDone ? " · finishing explanation" : ""}`
          : "";

  return { active, paused, phase, stepIndex, status: paused ? `Paused · ${status}` : status, start, stop, togglePause };
}

/* ------------------------------------------------------------------ Explain menu */

export function ExperimentExplainMenu({
  narrator,
  clips,
  onShowMe,
  showMeLabel = "Watch the narrated 3D experiment run automatically",
  disabled = false,
  menuLabel = "explanations",
}: {
  narrator: NarratorHandle;
  clips: readonly NarrationClip[];
  onShowMe: () => void;
  showMeLabel?: string;
  disabled?: boolean;
  menuLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!open) return;

    const handleOutsidePointer = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };

    document.addEventListener("pointerdown", handleOutsidePointer);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const toggleClip = (src: string) => {
    const isCurrentClip = narrator.currentSrc === src;
    if (isCurrentClip && narrator.isPlaying) narrator.pause();
    else if (isCurrentClip && narrator.isPaused) narrator.resume();
    else narrator.play(src);
  };

  return (
    <div ref={menuRef} className="pointer-events-auto relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-label={`Open ${menuLabel}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        title="Explain"
        className={`inline-flex h-9 items-center gap-1 rounded-full border px-2 text-[10px] font-black uppercase tracking-wide shadow-xl backdrop-blur-xl transition sm:gap-1.5 sm:px-3 ${
          open
            ? "border-cyan-200/55 bg-cyan-400/25 text-cyan-50 ring-2 ring-cyan-300/20"
            : "border-white/15 bg-slate-950/82 text-slate-200 hover:border-cyan-200/35 hover:text-white"
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Info size={14} aria-hidden="true" />
        <span className="hidden sm:inline">Explain</span>
        <ChevronDown size={13} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          className="fixed inset-x-2 top-16 z-[200] max-h-[calc(100dvh-4.5rem)] w-auto overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/96 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.58)] backdrop-blur-2xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-[calc(100%+.5rem)] sm:max-h-[calc(100dvh-6.25rem)] sm:w-[min(19rem,calc(100vw-1rem))]"
        >
          <div className="px-3 pb-1.5 pt-2 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">
            Choose an explanation
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onShowMe();
            }}
            aria-label="Show me the complete narrated experiment"
            className="mb-1 flex w-full items-center gap-3 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-500/25 via-indigo-500/20 to-cyan-500/15 px-3 py-3 text-left text-white transition hover:border-violet-200/40 hover:from-violet-500/35 hover:to-cyan-500/25"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-200/35 bg-violet-400/25 text-violet-50 shadow-[0_0_20px_rgba(139,92,246,.25)]">
              <PlayCircle size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black">Show me</span>
              <span className="mt-0.5 block text-[9px] font-semibold leading-snug text-violet-100/75">{showMeLabel}</span>
            </span>
          </button>
          <div className="mx-2 my-1 h-px bg-white/8" aria-hidden="true" />
          {clips.map((item) => {
            const isCurrentClip = narrator.currentSrc === item.src;
            const isPlaying = isCurrentClip && narrator.isPlaying;
            const action = isPlaying ? "Pause" : isCurrentClip && narrator.isPaused ? "Resume" : "Play";
            return (
              <button
                key={item.src}
                type="button"
                role="menuitem"
                onClick={() => toggleClip(item.src)}
                aria-label={`${action} ${item.label} explanation`}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  isCurrentClip ? "bg-cyan-400/15 text-cyan-50" : "text-slate-200 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                    isCurrentClip
                      ? "border-cyan-200/40 bg-cyan-400/20 text-cyan-100"
                      : "border-white/10 bg-white/[0.05] text-slate-300"
                  }`}
                >
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                </span>
                <span className="min-w-0 flex-1 text-xs font-bold">{item.label}</span>
                {isCurrentClip && (
                  <span className="text-[8px] font-black uppercase tracking-widest text-cyan-300">
                    {narrator.isPaused ? "Paused" : "Playing"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- Tinashe guide */

export function TinasheGuideButton({
  active,
  disabled = false,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={active ? "Turn off Tinashe guide mode" : "Turn on Tinashe guide mode"}
      aria-pressed={active}
      title={active ? "Turn off Tinashe guide" : "Turn on Tinashe guide"}
      className={`pointer-events-auto inline-flex h-9 items-center gap-1 rounded-full border px-1.5 text-[10px] font-black uppercase tracking-wide shadow-xl backdrop-blur-xl transition sm:gap-2 sm:px-2.5 ${
        active
          ? "border-violet-200/70 bg-violet-500 text-white ring-2 ring-violet-300/35"
          : "border-white/15 bg-slate-950/82 text-slate-200 hover:border-violet-200/45 hover:text-white"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white/10">
        <Speech size={15} aria-hidden="true" />
        <Volume2
          size={8}
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-slate-950 text-amber-300"
        />
      </span>
      <span className="hidden sm:inline">Tinashe</span>
    </button>
  );
}

/* ------------------------------------------------------------------- The dock */

/**
 * Row that carries the walkthrough status, the Explain menu, the Tinashe toggle
 * and — while a walkthrough is running — its pause/stop controls.
 *
 * It renders itself into the experiment header's narration slot whenever one is
 * mounted (see `ExperimentHeaderSlots`), so every practical shows the same
 * controls in the same place. With no header on screen it falls back to floating
 * over the canvas at `className`.
 */
export function ExperimentNarrationDock({
  narrator,
  clips,
  walkthrough,
  guideActive,
  onToggleGuide,
  showMeLabel,
  menuLabel,
  className = "absolute right-3 top-14 z-30 flex items-center gap-2 sm:top-3 sm:right-[10.5rem]",
  children,
}: {
  narrator: NarratorHandle;
  clips: readonly NarrationClip[];
  walkthrough: WalkthroughHandle;
  guideActive?: boolean;
  onToggleGuide?: () => void;
  showMeLabel?: string;
  menuLabel?: string;
  /** Fallback placement, used only when no experiment header is mounted. */
  className?: string;
  children?: ReactNode;
}) {
  return (
    <ExperimentHeaderPortal fallbackClassName={className}>
      {children}
      {walkthrough.active ? (
        <>
          {walkthrough.status && (
            <span className="pointer-events-none hidden max-w-[16rem] items-center gap-1.5 truncate rounded-full border border-violet-300/40 bg-violet-600/25 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-violet-100 shadow-xl backdrop-blur-xl md:inline-flex">
              <Headphones size={13} aria-hidden="true" />
              <span className="truncate">{walkthrough.status}</span>
            </span>
          )}
          <button
            type="button"
            onClick={walkthrough.togglePause}
            aria-label={walkthrough.paused ? "Resume the narrated walkthrough" : "Pause the narrated walkthrough"}
            className="pointer-events-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-violet-200/50 bg-violet-500/90 px-3 text-[10px] font-black uppercase tracking-wide text-white shadow-xl backdrop-blur-xl transition hover:bg-violet-500"
          >
            {walkthrough.paused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
            {walkthrough.paused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={walkthrough.stop}
            aria-label="Stop the narrated walkthrough"
            className="pointer-events-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/82 px-3 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl transition hover:text-white"
          >
            <Square size={11} fill="currentColor" />
            Stop
          </button>
        </>
      ) : (
        <>
          <ExperimentExplainMenu
            narrator={narrator}
            clips={clips}
            onShowMe={walkthrough.start}
            showMeLabel={showMeLabel}
            menuLabel={menuLabel}
          />
          {onToggleGuide && (
            <TinasheGuideButton active={Boolean(guideActive)} onClick={onToggleGuide} />
          )}
        </>
      )}
    </ExperimentHeaderPortal>
  );
}

/**
 * Small status pill shown while a narrated walkthrough is running. When an
 * experiment header is mounted the dock already shows the status inline, so this
 * stays out of the way rather than repeating it over the scene.
 */
export function WalkthroughStatusPill({ walkthrough }: { walkthrough: WalkthroughHandle }) {
  const headerHandlesIt = useHasExperimentHeaderSlot();
  if (headerHandlesIt || !walkthrough.active || !walkthrough.status) return null;
  return (
    <div className="pointer-events-none absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full border border-violet-300/35 bg-violet-950/85 px-4 py-1.5 text-[10px] font-black uppercase tracking-wide text-violet-100 shadow-xl backdrop-blur-xl">
      🎧 {walkthrough.status}
    </div>
  );
}
