import { BlenderLabProp, BlenderBurner, BlenderSteam } from '../../common/BlenderLabApparatus';
import { FirstPersonScienceActor, useExperimentPerformance } from '../../common/CombinedScienceExperience';
"use client";

import { BlenderLabEnvironment, BlenderLabBench, blenderLabObstacles } from "../../common/BlenderLabEnvironment";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
import {
  Award,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Coins,
  FileText,
  Flame,
  FlaskConical,
  Gem,
  Info,
  Lightbulb,
  Lock,
  Menu,
  Moon,
  Pause,
  Play,
  PlayCircle,
  RotateCcw,
  Settings,
  Speech,
  Square,
  Star,
  Sun,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import * as THREE from "three";
import { ExperimentTopBar } from "../../common/ExperimentGameChrome";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";
import { useExperimentNarrator, type NarratorHandle } from "../../../../lib/audio/experimentNarrator";
import { useAuth } from "../../../../contexts/AuthContext";


const BLENDER_LAB_LAYOUT = { worktopY: 1.12 };
const STEP_LABELS = [
  "Boil leaf in water",
  "Heat in alcohol water bath",
  "Wash in warm water",
  "Add iodine solution",
] as const;

const STEP_DURATIONS = [3600, 4300, 2800, 3000] as const;
// Keep hands-on play responsive, but let the narrated demonstration breathe at
// the exact pace of each recorded explanation.
const NARRATED_STEP_DURATIONS = [15624, 26856, 18816, 22944] as const;
const BOILING_START_THRESHOLD = 0.18;
const PHOTO_MISSIONS = [
  {
    short: "Boil",
    title: "Boil the Leaf",
    detail: "Boil the leaf in water to kill its cells and stop chemical reactions.",
    reward: 25,
    symbol: "🫧",
  },
  {
    short: "Heat",
    title: "Heat in Alcohol",
    detail: "Use the hot-water bath to remove chlorophyll safely.",
    reward: 30,
    symbol: "⚗️",
  },
  {
    short: "Wash",
    title: "Wash the Leaf",
    detail: "Rinse the brittle leaf in warm water so it becomes soft again.",
    reward: 25,
    symbol: "💧",
  },
  {
    short: "Iodine",
    title: "Add Iodine",
    detail: "Place the leaf on the tile and add iodine to reveal starch.",
    reward: 25,
    symbol: "🧴",
  },
] as const;
const PHOTOSYNTHESIS_PAPER_FILENAME = "photosynthesis-leaf-starch-test.html";
const PHOTO_NARRATION = {
  intro: "/sounds/photosynthesis/intro.mp3",
  tinasheIntro: "/sounds/photosynthesis/tinashe_intro.mp3",
  complete: "/sounds/photosynthesis/experiment_complete.mp3",
  steps: [
    "/sounds/photosynthesis/step1_boil.mp3",
    "/sounds/photosynthesis/step2_alcohol.mp3",
    "/sounds/photosynthesis/step3_wash.mp3",
    "/sounds/photosynthesis/step4_iodine.mp3",
  ],
} as const;

const PHOTO_EXPLANATIONS = [
  { label: "Introduction", src: PHOTO_NARRATION.intro },
  { label: "Step 1: Boil in water", src: PHOTO_NARRATION.steps[0] },
  { label: "Step 2: Alcohol bath", src: PHOTO_NARRATION.steps[1] },
  { label: "Step 3: Warm water wash", src: PHOTO_NARRATION.steps[2] },
  { label: "Step 4: Iodine test", src: PHOTO_NARRATION.steps[3] },
] as const;

type AutoWalkthroughPhase = "idle" | "intro" | "step" | "closing";

function getStepDuration(step: number, narrated: boolean) {
  const durations = narrated ? NARRATED_STEP_DURATIONS : STEP_DURATIONS;
  return durations[Math.min(step, durations.length - 1)];
}

function getBoilIntensity(step: number, running: boolean, progress: number) {
  if (!running) return 0;
  if (step === 0) return THREE.MathUtils.smoothstep(progress, 0.16, 0.42);
  if (step === 1) return THREE.MathUtils.smoothstep(progress, 0.08, 0.3);
  return 0;
}

function isBurnerActive(step: number, running: boolean, progress: number) {
  if (!running) return false;
  return step === 0 || (step === 1 && progress < 0.3);
}

function useLoopingPhotoSound(
  src: string,
  active: boolean,
  paused: boolean,
  volume: number,
  loop = true,
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [loop, src, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let retryArmed = false;

    const clearRetry = () => {
      if (!retryArmed) return;
      retryArmed = false;
      window.removeEventListener("pointerdown", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };

    const armRetry = () => {
      if (retryArmed) return;
      retryArmed = true;
      window.addEventListener("pointerdown", tryPlay, { once: true });
      window.addEventListener("keydown", tryPlay, { once: true });
    };

    function tryPlay() {
      clearRetry();
      void audio.play().catch(armRetry);
    }

    if (!active) {
      audio.pause();
      audio.currentTime = 0;
    } else if (paused) {
      audio.pause();
    } else {
      tryPlay();
    }

    return clearRetry;
  }, [active, paused]);

  return useCallback(() => {
    const audio = audioRef.current;
    if (!audio || active) return;

    const originalVolume = audio.volume;
    audio.volume = 0;
    const restore = () => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = originalVolume;
    };
    void audio.play().then(restore, restore);
  }, [active]);
}

const PHOTO_PLAYER_BOUNDS: PlayerBounds = { minX: -14.4, maxX: 14.4, minZ: -10.45, maxZ: 10.45 };
const PHOTO_PLAYER_SPAWN = new THREE.Vector3(7.2, 0, 9.1);
const PHOTO_PLAYER_INITIAL_YAW = Math.atan2(PHOTO_PLAYER_SPAWN.x, PHOTO_PLAYER_SPAWN.z);
const PHOTO_PLAYER_INITIAL_PITCH = -0.12;
const PHOTO_INTERACTION_RADIUS = 3.65;
const PHOTO_STATION_POSITIONS = [
  new THREE.Vector3(-3.15, 0.12, 0.05),
  new THREE.Vector3(-1.05, 0.12, 0.05),
  new THREE.Vector3(1.15, 0.12, 0.05),
  new THREE.Vector3(3.15, 0.12, 0.12),
] as const;
const PHOTO_STATION_LABEL_HEIGHTS = [3.05, 3.35, 1.62, 1.48] as const;
const PHOTO_LEAF_STAIN_PATCHES = [
  { x: -0.13, y: -0.2, sx: 0.24, sy: 0.19, start: 0, rotation: -0.2 },
  { x: 0.12, y: 0.02, sx: 0.29, sy: 0.23, start: 0.08, rotation: 0.35 },
  { x: -0.15, y: 0.22, sx: 0.21, sy: 0.18, start: 0.17, rotation: -0.5 },
  { x: 0.17, y: -0.26, sx: 0.18, sy: 0.15, start: 0.25, rotation: 0.55 },
  { x: 0.04, y: 0.36, sx: 0.16, sy: 0.13, start: 0.33, rotation: 0.1 },
  { x: -0.24, y: -0.02, sx: 0.13, sy: 0.1, start: 0.42, rotation: -0.35 },
  { x: 0.23, y: 0.14, sx: 0.12, sy: 0.095, start: 0.5, rotation: 0.45 },
] as const;
const PHOTO_PLAYER_OBSTACLES: PlayerBounds[] = [
  { minX: -4.45, maxX: 4.45, minZ: -1.85, maxZ: 1.85 },
  { minX: -9.8, maxX: -7.1, minZ: 3.2, maxZ: 5.8 },
  { minX: 7.1, maxX: 9.8, minZ: 3.2, maxZ: 5.8 },
  { minX: -9.8, maxX: -7.1, minZ: -5.7, maxZ: -3.15 }, ...blenderLabObstacles(BLENDER_LAB_LAYOUT)];

const photosynthesisTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Test a Leaf for Starch",
    text: "This practical removes living tissue and chlorophyll before iodine is used to test whether a light-exposed leaf contains starch.",
    mode: "modal",
  },
  {
    title: "Choose the Leaf Condition",
    text: "Keep Light exposed selected for the expected positive result, or use the dark control to compare a leaf that could not photosynthesise.",
    mode: "bubble",
    selector: '[data-experiment-tour="photo-condition"]',
  },
  {
    title: "Procedure",
    text: "Run the four steps in order. Alcohol is heated safely in a hot-water bath because alcohol is flammable.",
    mode: "bubble",
    selector: '[data-experiment-tour="photo-procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Observation",
    text: "After iodine is added, blue-black indicates starch. A yellow-brown leaf is a negative result.",
    mode: "bubble",
    selector: '[data-experiment-tour="photo-observation"]',
  },
];

const photosynthesisHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Test a Leaf",
    text: "Choose the leaf condition, enter Doing mode, then complete the four apparatus stations in order before reading the starch result.",
    mode: "modal",
  },
  {
    title: "Step 1: Choose the Leaf",
    text: "Select Light exposed for the expected blue-black result, or Dark control for a comparison. Choose before starting because the condition locks once the procedure begins.",
    mode: "bubble",
    selector: '[data-experiment-tour="photo-condition"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Step 2: Enter Doing Mode",
    text: "Switch from Learning to Doing. The side controls will close and you can walk around the laboratory using WASD or the mobile joystick.",
    mode: "bubble",
    selector: '[data-experiment-tour="photo-mode-toggle"], .experiment-mobile-topbar',
  },
  {
    title: "Step 3: Walk, Aim, Use",
    text: "Walk to the highlighted current apparatus and aim at it. When you are close enough, Press E appears on desktop or a Use button appears on mobile. Activate it to perform that stage.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="photo-scene"]',
    sceneBox: { x: 0.08, y: 0.2, w: 0.84, h: 0.62 },
  },
  {
    title: "Step 4: Complete All Stations",
    text: "Follow the moving highlight through boiling water, the alcohol water bath, the warm-water wash, and finally the iodine tile. Wait for each action to finish before moving on.",
    mode: "bubble",
    selector: '[data-experiment-tour="photo-observation"]',
  },
  {
    title: "Step 5: Read and Record",
    text: "Read the final iodine observation, then open Paper to inspect the method, result, and conclusion generated from your chosen leaf condition.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
  {
    title: "Ready to Experiment",
    text: "Use the yellow apparatus marker and the Press E or Use prompt as your guide. Complete all four stages to test the leaf for starch.",
    mode: "modal",
  },
];

interface PhotosynthesisSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

function PhotosynthesisExplanations({
  narrator,
  onShowMe,
  disabled = false,
}: {
  narrator: NarratorHandle;
  onShowMe: () => void;
  disabled?: boolean;
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
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
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
    if (isCurrentClip && narrator.isPlaying) {
      narrator.pause();
    } else if (isCurrentClip && narrator.isPaused) {
      narrator.resume();
    } else {
      narrator.play(src);
    }
  };

  return (
    <div ref={menuRef} className="pointer-events-auto relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-label="Open photosynthesis explanations"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] font-black uppercase tracking-wide shadow-xl backdrop-blur-xl transition ${
          open
            ? "border-cyan-200/55 bg-cyan-400/25 text-cyan-50 ring-2 ring-cyan-300/20"
            : "border-white/15 bg-slate-950/82 text-slate-200 hover:border-cyan-200/35 hover:text-white"
        } disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Info size={14} aria-hidden="true" />
        Explain
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="Photosynthesis explanations"
          className="absolute right-0 top-[calc(100%+.5rem)] z-[120] max-h-[calc(100dvh-6.25rem)] w-[min(19rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/96 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.58)] backdrop-blur-2xl"
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
            aria-label="Show me the complete narrated photosynthesis experiment"
            className="mb-1 flex w-full items-center gap-3 rounded-xl border border-violet-300/20 bg-gradient-to-r from-violet-500/25 via-indigo-500/20 to-cyan-500/15 px-3 py-3 text-left text-white transition hover:border-violet-200/40 hover:from-violet-500/35 hover:to-cyan-500/25"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-200/35 bg-violet-400/25 text-violet-50 shadow-[0_0_20px_rgba(139,92,246,.25)]">
              <PlayCircle size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-black">Show me</span>
              <span className="mt-0.5 block text-[9px] font-semibold leading-snug text-violet-100/75">
                Watch the narrated 3D experiment run automatically
              </span>
            </span>
          </button>
          <div className="mx-2 my-1 h-px bg-white/8" aria-hidden="true" />
          {PHOTO_EXPLANATIONS.map((item) => {
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
                  isCurrentClip
                    ? "bg-cyan-400/15 text-cyan-50"
                    : "text-slate-200 hover:bg-white/[0.07] hover:text-white"
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

function TinasheGuideButton({
  active,
  disabled,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={active ? "Turn off Tinashe guide mode" : "Turn on Tinashe guide mode"}
      aria-pressed={active}
      className={`pointer-events-auto inline-flex h-9 items-center gap-2 rounded-full border px-2.5 text-[10px] font-black uppercase tracking-wide shadow-xl backdrop-blur-xl transition ${
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
      Tinashe
    </button>
  );
}

function PhotoModeToggle({
  mode,
  disabled,
  onChange,
  compact = false,
}: {
  mode: "learning" | "doing";
  disabled: boolean;
  onChange: (mode: "learning" | "doing") => void;
  compact?: boolean;
}) {
  return (
    <div
      data-experiment-tour="photo-mode-toggle"
      className={`pointer-events-auto flex shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#090b25]/92 font-black uppercase tracking-wide shadow-xl backdrop-blur-xl ${
        compact ? "text-[8px]" : "text-[9px]"
      }`}
    >
      <button
        type="button"
        onClick={() => onChange("learning")}
        disabled={disabled}
        aria-label="Switch to learning mode"
        className={`transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
          compact ? "px-2 py-1.5" : "px-3 py-2"
        } ${mode === "learning" ? "bg-gradient-to-b from-cyan-300 to-sky-500 text-slate-950" : "text-slate-300 hover:text-white"}`}
      >
        Learning
      </button>
      <button
        type="button"
        onClick={() => onChange("doing")}
        disabled={disabled}
        aria-label="Switch to doing mode"
        className={`transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
          compact ? "px-2 py-1.5" : "px-3 py-2"
        } ${mode === "doing" ? "bg-gradient-to-b from-amber-300 to-orange-500 text-slate-950" : "text-slate-300 hover:text-white"}`}
      >
        Doing
      </button>
    </div>
  );
}

function PhotoGameHud({
  mode,
  onModeChange,
  modeDisabled,
  narrator,
  onShowMe,
  guideActive,
  onToggleGuide,
  onBack,
  onRequestHowTo,
  onRequestPaper,
}: {
  mode: "learning" | "doing";
  onModeChange: (mode: "learning" | "doing") => void;
  modeDisabled: boolean;
  narrator: NarratorHandle;
  onShowMe: () => void;
  guideActive: boolean;
  onToggleGuide: () => void;
  onBack?: () => void;
  onRequestHowTo?: () => void;
  onRequestPaper?: () => void;
}) {
  return (
    <ExperimentTopBar
      variant="overlay"
      title="Photosynthesis Lab"
      subtitle="Testing a leaf for starch"
      symbol="🌿"
      backLabel="Back to Combined Science experiments"
      onBack={onBack}
      onRequestHowTo={onRequestHowTo}
      onRequestPaper={onRequestPaper}
      accentBase="#22c55e"
      accentRing="rgba(74,222,128,0.4)"
      accentSoft="rgba(34,197,94,0.16)"
      accentText="#bbf7d0"
      narration={
        <>
          <PhotosynthesisExplanations narrator={narrator} onShowMe={onShowMe} disabled={modeDisabled} />
          <TinasheGuideButton active={guideActive} disabled={modeDisabled} onClick={onToggleGuide} />
        </>
      }
      actions={<PhotoModeToggle mode={mode} disabled={modeDisabled} onChange={onModeChange} />}
    />
  );
}

function PhotoGoalCard({
  currentStep,
  observation,
  running,
  progress,
  complete,
  autoWalkthroughActive,
  autoWalkthroughPaused,
  walkthroughStatus,
}: {
  currentStep: number;
  observation: string;
  running: boolean;
  progress: number;
  complete: boolean;
  autoWalkthroughActive: boolean;
  autoWalkthroughPaused: boolean;
  walkthroughStatus: string;
}) {
  const status = autoWalkthroughActive
    ? `${autoWalkthroughPaused ? "Paused · " : ""}${walkthroughStatus}`
    : running
      ? `${STEP_LABELS[Math.min(STEP_LABELS.length - 1, currentStep)]}`
      : complete
        ? observation
        : "Find out whether light is needed for a leaf to make starch.";

  return (
    <div
      data-experiment-tour="photo-observation"
      className="photo-goal-card pointer-events-none absolute left-4 top-[4.85rem] z-30 w-[min(285px,34vw)] overflow-hidden rounded-2xl border border-cyan-100/35 bg-[linear-gradient(145deg,rgba(19,49,55,.78),rgba(11,22,38,.68))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_16px_35px_rgba(4,12,24,.32)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-fuchsia-500/25 text-sm">🎯</span>
        Experiment goal
      </div>
      <div className={`mt-2 text-xs font-bold leading-relaxed ${complete ? "text-emerald-100" : "text-white"}`}>
        {autoWalkthroughActive
          ? status
          : running
            ? `${STEP_LABELS[Math.min(STEP_LABELS.length - 1, currentStep)]} · ${Math.round(progress * 100)}%`
            : status}
      </div>
      {(running || autoWalkthroughActive) && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-950/45">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 transition-[width]"
            style={{ width: `${Math.max(3, progress * 100)}%` }}
          />
        </div>
      )}
      <div className="absolute bottom-1 right-2 text-2xl drop-shadow-lg" aria-hidden="true">🪴</div>
    </div>
  );
}

function PhotoConditionCard({
  lightExposed,
  disabled,
  onChange,
  compact = false,
}: {
  lightExposed: boolean;
  disabled: boolean;
  onChange: (lightExposed: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div
      data-experiment-tour="photo-condition"
      className={`overflow-hidden rounded-2xl border border-violet-100/20 bg-[linear-gradient(160deg,rgba(22,22,57,.9),rgba(17,23,47,.78))] shadow-[0_16px_38px_rgba(3,5,20,.38)] backdrop-blur-xl ${
        compact ? "p-1.5" : "w-[220px] p-2.5"
      }`}
    >
      {!compact && (
        <div className="mb-2 text-center text-[9px] font-black uppercase tracking-[0.14em] text-slate-200">
          Leaf condition
        </div>
      )}
      <div className={`grid grid-cols-2 ${compact ? "gap-1" : "gap-2"}`}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(true)}
          aria-label="Use a light-exposed leaf"
          aria-pressed={lightExposed}
          className={`relative flex items-center justify-center rounded-xl border font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${
            compact ? "gap-1 px-2 py-1.5 text-[8px]" : "min-h-[94px] flex-col px-2 py-2 text-[9px]"
          } ${
            lightExposed
              ? "border-emerald-200 bg-gradient-to-b from-amber-50 to-emerald-50 text-slate-900 shadow-[0_0_0_2px_#10b981,0_0_22px_rgba(52,211,153,.42)]"
              : "border-white/10 bg-white/[0.045] text-slate-300"
          }`}
        >
          <Sun size={compact ? 15 : 29} className={lightExposed ? "fill-amber-300 text-amber-500" : "text-slate-400"} />
          <span>{compact ? "Light" : "Light exposed"}</span>
          {!compact && <span className="font-medium text-[8px] normal-case opacity-70">Leaf exposed to sunlight</span>}
          {lightExposed && !compact && (
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white">
              <Check size={15} strokeWidth={3} />
            </span>
          )}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(false)}
          aria-label="Use a dark-control leaf"
          aria-pressed={!lightExposed}
          className={`relative flex items-center justify-center rounded-xl border font-black transition disabled:cursor-not-allowed disabled:opacity-45 ${
            compact ? "gap-1 px-2 py-1.5 text-[8px]" : "min-h-[94px] flex-col px-2 py-2 text-[9px]"
          } ${
            !lightExposed
              ? "border-violet-300 bg-gradient-to-b from-violet-900 to-slate-950 text-white shadow-[0_0_0_2px_#8b5cf6,0_0_22px_rgba(139,92,246,.4)]"
              : "border-white/10 bg-white/[0.045] text-slate-300"
          }`}
        >
          <Moon size={compact ? 15 : 27} className={!lightExposed ? "fill-violet-200 text-violet-200" : "text-slate-400"} />
          <span>{compact ? "Dark" : "Dark control"}</span>
          {!compact && <span className="font-medium text-[8px] normal-case opacity-70">Kept without light</span>}
          {!lightExposed && !compact && (
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-violet-500 text-white">
              <Check size={15} strokeWidth={3} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

function PhotoMissionPath({
  step,
  progress,
  compact = false,
}: {
  step: number;
  progress: number;
  compact?: boolean;
}) {
  const complete = step >= PHOTO_MISSIONS.length;

  return (
    <div data-experiment-tour="photo-procedure" className="w-full">
      <div className={`flex items-start ${compact ? "gap-1" : "gap-1.5"}`}>
        {PHOTO_MISSIONS.map((mission, index) => {
          const done = index < step;
          const active = !complete && index === step;
          return (
            <div key={mission.title} className="contents">
              <div className="min-w-0 flex-1 text-center">
                <div
                  className={`relative mx-auto grid place-items-center rounded-full border transition ${
                    compact ? "h-8 w-8 text-sm" : "h-10 w-10 text-lg"
                  } ${
                    done
                      ? "border-emerald-200/60 bg-emerald-500/25 shadow-[0_0_16px_rgba(16,185,129,.35)]"
                      : active
                        ? "border-amber-200 bg-amber-400/20 shadow-[0_0_18px_rgba(250,204,21,.48)]"
                        : "border-white/12 bg-white/[0.035] grayscale"
                  }`}
                >
                  <span aria-hidden="true">{mission.symbol}</span>
                  {done && (
                    <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-400 text-slate-950">
                      <Check size={10} strokeWidth={4} />
                    </span>
                  )}
                  {!done && !active && (
                    <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-slate-800 text-slate-400">
                      <Lock size={8} />
                    </span>
                  )}
                  {active && progress > 0 && (
                    <svg className="pointer-events-none absolute -inset-1 h-[calc(100%+8px)] w-[calc(100%+8px)] -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
                      <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
                      <circle
                        cx="22"
                        cy="22"
                        r="20"
                        fill="none"
                        stroke="#fde047"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 125.66} 125.66`}
                      />
                    </svg>
                  )}
                </div>
                <div className={`mt-1 truncate font-black ${compact ? "text-[7px]" : "text-[8px]"} ${active ? "text-amber-200" : done ? "text-emerald-200" : "text-slate-500"}`}>
                  {index + 1} {mission.short}
                </div>
              </div>
              {index < PHOTO_MISSIONS.length - 1 && (
                <div className={`mt-4 shrink-0 border-t border-dashed ${compact ? "w-3" : "w-5"} ${index < step ? "border-emerald-300/70" : "border-slate-600"}`} />
              )}
            </div>
          );
        })}
        <div className="mx-0.5 mt-4 w-3 shrink-0 border-t border-dashed border-slate-600" />
        <div className="min-w-0 flex-1 text-center">
          <div className={`mx-auto grid place-items-center rounded-full border ${
            compact ? "h-8 w-8" : "h-10 w-10"
          } ${complete ? "border-amber-200 bg-amber-400/25 text-amber-200 shadow-[0_0_18px_rgba(250,204,21,.45)]" : "border-white/12 bg-white/[0.035] text-slate-500"}`}>
            <Trophy size={compact ? 14 : 18} />
          </div>
          <div className={`mt-1 truncate font-black ${compact ? "text-[7px]" : "text-[8px]"} ${complete ? "text-amber-200" : "text-slate-500"}`}>
            Result
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoMissionRail({
  step,
  running,
  progress,
  observation,
  autoWalkthroughActive,
  autoWalkthroughPaused,
  onRun,
  onReset,
  onStartAuto,
  onToggleAutoPause,
  onStopAuto,
  onRequestHowTo,
  onRequestPaper,
}: {
  step: number;
  running: boolean;
  progress: number;
  observation: string;
  autoWalkthroughActive: boolean;
  autoWalkthroughPaused: boolean;
  onRun: () => void;
  onReset: () => void;
  onStartAuto: () => void;
  onToggleAutoPause: () => void;
  onStopAuto: () => void;
  onRequestHowTo?: () => void;
  onRequestPaper?: () => void;
}) {
  const complete = step >= PHOTO_MISSIONS.length;
  const currentIndex = Math.min(step, PHOTO_MISSIONS.length - 1);
  const mission = PHOTO_MISSIONS[currentIndex];
  const visibleStageProgress =
    running || autoWalkthroughActive ? progress : 0;
  const totalProgress = complete
    ? 100
    : Math.round(((step + visibleStageProgress) / PHOTO_MISSIONS.length) * 100);
  const filledStars = Math.min(PHOTO_MISSIONS.length, step);

  return (
    <aside className="experiment-desktop-panel hidden h-full min-h-0 w-[clamp(320px,27vw,380px)] shrink-0 flex-col overflow-y-auto border-l border-violet-300/15 bg-[linear-gradient(180deg,#0b0b26,#0b1027_52%,#080c20)] px-2.5 pb-3 pt-[4.55rem] shadow-[-12px_0_35px_rgba(2,3,17,.28)] sm:flex">
      <section className="relative overflow-hidden rounded-2xl border border-fuchsia-300/35 bg-[radial-gradient(circle_at_84%_18%,rgba(250,204,21,.2),transparent_22%),linear-gradient(145deg,#7510a0,#320260)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_10px_25px_rgba(28,2,48,.45)]">
        <div className="absolute -right-2 -top-3 text-6xl opacity-90 drop-shadow-[0_0_18px_rgba(250,204,21,.55)]" aria-hidden="true">
          {complete ? "🏆" : "🎁"}
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-r-full bg-fuchsia-600/80 py-1 pl-2 pr-8 text-[9px] font-black uppercase tracking-wide text-white">
          <FlaskConical size={12} /> Lab mission
        </div>
        <div className="mt-2 text-sm font-black text-white">Leaf Starch Test</div>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 4 }, (_, index) => (
            <Star
              key={index}
              size={21}
              className={index < filledStars ? "fill-amber-300 text-amber-300 drop-shadow-[0_0_5px_rgba(250,204,21,.65)]" : "fill-white/10 text-white/15"}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 pr-16">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-violet-950/75">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-amber-300" style={{ width: `${Math.max(4, totalProgress)}%` }} />
          </div>
          <span className="text-[9px] font-black text-white">{totalProgress}%</span>
        </div>
      </section>

      <section className="mt-2 overflow-hidden rounded-2xl border-2 border-amber-300/75 bg-gradient-to-b from-amber-300 to-yellow-400 p-2 shadow-[0_10px_24px_rgba(146,86,0,.3),inset_0_1px_0_rgba(255,255,255,.72)]">
        <div className="px-1 text-[8px] font-black uppercase tracking-[0.12em] text-amber-950">
          {complete ? "Mission complete" : "Current mission"}
        </div>
        <div className="mt-1.5 rounded-xl bg-amber-50 p-2.5 text-slate-900 shadow-inner">
          <div className="flex gap-2.5">
            <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-amber-200 bg-gradient-to-b from-white to-amber-100 text-3xl shadow-md">
              {complete ? "🏆" : mission.symbol}
              <span className="absolute -left-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-[9px] font-black text-white">
                {complete ? <Check size={11} /> : currentIndex + 1}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black">{complete ? "Result Revealed" : mission.title}</div>
              <p className="mt-0.5 text-[9px] font-semibold leading-snug text-slate-600">
                {complete ? observation : mission.detail}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[9px] font-black text-amber-700">
                <Star size={12} className="fill-amber-400 text-amber-500" />
                {complete ? "All rewards earned" : `+${mission.reward} session XP`}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={autoWalkthroughActive ? onToggleAutoPause : onRun}
            disabled={running && !autoWalkthroughActive}
            aria-label={
              autoWalkthroughActive
                ? autoWalkthroughPaused
                  ? "Resume the narrated photosynthesis walkthrough"
                  : "Pause the narrated photosynthesis walkthrough"
                : complete
                  ? "Repeat the photosynthesis experiment"
                  : `Start mission ${currentIndex + 1}: ${mission.title}`
            }
            className={`mt-2 inline-flex h-8 w-full items-center justify-center gap-2 rounded-full border border-white/45 text-[10px] font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,.34),0_5px_10px_rgba(71,5,110,.28)] transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 ${
              autoWalkthroughActive
                ? autoWalkthroughPaused
                  ? "bg-gradient-to-b from-cyan-400 to-sky-600"
                  : "bg-gradient-to-b from-amber-400 to-orange-600"
                : "bg-gradient-to-b from-fuchsia-500 to-purple-700"
            }`}
          >
            {autoWalkthroughActive
              ? autoWalkthroughPaused
                ? <Play size={13} fill="currentColor" />
                : <Pause size={13} fill="currentColor" />
              : complete
                ? <RotateCcw size={13} />
                : <Play size={13} fill="currentColor" />}
            {autoWalkthroughActive
              ? autoWalkthroughPaused
                ? "Resume demo"
                : "Pause demo"
              : running
                ? `${Math.round(progress * 100)}% complete`
                : complete
                  ? "Repeat mission"
                  : "Start mission"}
          </button>
        </div>
      </section>

      <section className="mt-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2.5">
        <div className="mb-2 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Mission path</div>
        <PhotoMissionPath step={step} progress={visibleStageProgress} />
      </section>

      {!complete && (
        <section className="mt-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2.5">
          <div className="mb-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Upcoming missions</div>
          <div className="space-y-1">
            {PHOTO_MISSIONS.slice(currentIndex + 1).map((upcoming, offset) => (
              <div key={upcoming.title} className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-slate-950/25 px-2 py-1.5 text-[9px]">
                <Lock size={11} className="text-slate-500" />
                <span className="min-w-0 flex-1 truncate font-bold text-slate-400">{upcoming.title}</span>
                <span className="shrink-0 font-black text-fuchsia-300">+{upcoming.reward} XP</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="photo-short-height-hide mt-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2.5">
        <div className="mb-2 text-[8px] font-black uppercase tracking-[0.12em] text-slate-400">Achievements</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Safe scientist", unlocked: step > 0, icon: <FlaskConical size={18} /> },
            { label: "Quick thinker", unlocked: step > 2, icon: <Zap size={18} /> },
            { label: "Perfect result", unlocked: complete, icon: <Trophy size={18} /> },
          ].map((achievement) => (
            <div key={achievement.label} className={`rounded-xl border p-2 text-center ${achievement.unlocked ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200" : "border-white/[0.07] bg-white/[0.025] text-slate-600"}`}>
              <div className="mx-auto grid h-8 w-8 place-items-center rounded-full border border-current/30 bg-black/20">
                {achievement.unlocked ? achievement.icon : <Lock size={15} />}
              </div>
              <div className="mt-1 text-[7px] font-black leading-tight">{achievement.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={autoWalkthroughActive ? onStopAuto : onStartAuto}
          aria-label={autoWalkthroughActive ? "Stop the narrated walkthrough and reset the experiment" : "Explain the whole photosynthesis process"}
          className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[9px] font-black ${
            autoWalkthroughActive
              ? "border-rose-300/25 bg-rose-500/15 text-rose-100"
              : "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
          }`}
        >
          {autoWalkthroughActive ? <Square size={11} fill="currentColor" /> : <PlayCircle size={13} />}
          {autoWalkthroughActive ? "Stop demo" : "Watch demo"}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={autoWalkthroughActive}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-[9px] font-black text-slate-300 disabled:opacity-40"
        >
          <RotateCcw size={11} /> Reset
        </button>
        <button
          type="button"
          onClick={onRequestHowTo}
          disabled={!onRequestHowTo}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-[9px] font-black text-slate-300 disabled:opacity-40"
        >
          <CircleHelp size={11} /> How to
        </button>
        <button
          type="button"
          onClick={onRequestPaper}
          disabled={!onRequestPaper}
          data-experiment-tour="paper"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-2 text-[9px] font-black text-slate-300 disabled:opacity-40"
        >
          <FileText size={11} /> Paper
        </button>
      </div>

      <div className="mt-2 rounded-xl border border-amber-300/15 bg-amber-400/[0.07] px-2.5 py-2 text-[8px] leading-relaxed text-amber-100/80">
        <span className="font-black text-amber-200">Safety:</span> Heat ethanol only in the hot-water bath and keep it away from a naked flame.
      </div>
    </aside>
  );
}

function PhotoCoachDock({
  currentStep,
  guideActive,
  disabled,
  onHint,
  onGuide,
  onDemo,
}: {
  currentStep: number;
  guideActive: boolean;
  disabled: boolean;
  onHint?: () => void;
  onGuide: () => void;
  onDemo: () => void;
}) {
  const coachText = currentStep >= PHOTO_MISSIONS.length
    ? "Excellent work! Your iodine result is ready to record."
    : currentStep === 0
      ? "Let’s start by boiling the leaf to kill its cells and stop reactions."
      : `Next mission: ${PHOTO_MISSIONS[currentStep].title.toLowerCase()}.`;

  return (
    <div className="pointer-events-none absolute bottom-3 left-4 z-40 hidden max-w-[660px] items-end gap-2 lg:flex">
      <div className="pointer-events-auto flex items-end">
        <div className="relative z-10 grid h-[74px] w-[74px] shrink-0 place-items-center rounded-full border-2 border-fuchsia-300 bg-gradient-to-b from-violet-500 to-fuchsia-700 text-4xl shadow-[0_0_24px_rgba(217,70,239,.36)]">
          <span aria-hidden="true">🧑🏾‍🔬</span>
          <span className="absolute -right-1 -top-1 rounded-full bg-emerald-400 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-950">Tinashe</span>
        </div>
        <div className="-ml-2 mb-1 max-w-[260px] rounded-2xl rounded-bl-sm border border-white/35 bg-white/95 py-2.5 pl-5 pr-3 text-slate-800 shadow-xl">
          <div className="text-[9px] font-black text-fuchsia-700">Lab guide</div>
          <p className="mt-0.5 text-[10px] font-semibold leading-snug">{coachText}</p>
        </div>
      </div>
      <div className="pointer-events-auto mb-1 flex overflow-hidden rounded-2xl border border-white/20 bg-slate-950/68 p-1.5 shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={onHint}
          disabled={!onHint || disabled}
          className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[8px] font-black text-amber-100 transition hover:bg-white/10 disabled:opacity-40"
        >
          <Lightbulb size={18} className="fill-amber-300 text-amber-300" /> Hint
        </button>
        <button
          type="button"
          onClick={onGuide}
          disabled={disabled}
          className={`flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[8px] font-black transition disabled:opacity-40 ${guideActive ? "bg-violet-500/35 text-violet-100" : "text-cyan-100 hover:bg-white/10"}`}
        >
          <Bot size={18} className="text-cyan-300" /> Ask guide
        </button>
        <button
          type="button"
          onClick={onDemo}
          disabled={disabled}
          className="flex min-w-[70px] flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[8px] font-black text-violet-100 transition hover:bg-white/10 disabled:opacity-40"
        >
          <PlayCircle size={18} className="text-violet-300" /> Watch demo
        </button>
      </div>
    </div>
  );
}

function PhotoMobileHud({
  profileName,
  profilePhoto,
  points,
  completedSteps,
  mode,
  modeDisabled,
  onModeChange,
  onBack,
  onRequestHowTo,
  onRequestPaper,
  narrator,
  onShowMe,
  guideActive,
  onToggleGuide,
}: {
  profileName: string;
  profilePhoto?: string;
  points: number;
  completedSteps: number;
  mode: "learning" | "doing";
  modeDisabled: boolean;
  onModeChange: (mode: "learning" | "doing") => void;
  onBack?: () => void;
  onRequestHowTo?: () => void;
  onRequestPaper?: () => void;
  narrator: NarratorHandle;
  onShowMe: () => void;
  guideActive: boolean;
  onToggleGuide: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const level = Math.max(1, Math.floor(points / 500) + 1);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <div className="photo-mobile-game-hud experiment-mobile-topbar pointer-events-none absolute inset-x-0 top-0 z-[92] sm:hidden">
      <div className="pointer-events-auto flex h-14 items-center gap-2 border-b border-violet-300/15 bg-[linear-gradient(90deg,rgba(8,8,36,.98),rgba(16,10,50,.97),rgba(7,9,30,.98))] px-2 shadow-xl backdrop-blur-xl">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.055] text-white"
          >
            ←
          </button>
        )}
        <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-fuchsia-400 bg-gradient-to-br from-violet-500 to-fuchsia-700 text-base font-black">
          {profilePhoto ? <img src={profilePhoto} alt="" className="h-full w-full object-cover" /> : <span aria-hidden="true">🧑🏾‍🔬</span>}
        </div>
        <div className="min-w-0">
          <div className="max-w-[78px] truncate text-[8px] font-black text-white">{profileName || "Scientist"}</div>
          <div className="mt-0.5 flex items-center gap-1">
            <span className="rounded bg-fuchsia-500/25 px-1 py-0.5 text-[6px] font-black text-fuchsia-200">LV {level}</span>
            <div className="h-1 w-10 overflow-hidden rounded-full bg-violet-950">
              <div className="h-full bg-fuchsia-500" style={{ width: `${Math.max(12, ((points % 500) / 500) * 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] font-black text-white">
            <Star size={15} className="fill-amber-300 text-amber-300" /> {points}
          </div>
          <div className="flex items-center gap-1 text-[9px] font-black text-white">
            <Gem size={15} className="fill-fuchsia-500/30 text-fuchsia-300" /> {completedSteps}
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Open lab menu"
            aria-expanded={menuOpen}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/15 bg-white/[0.055] text-white"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>

      <div className="photo-mobile-title-strip pointer-events-auto mx-2 mt-1.5 flex h-9 items-center justify-between rounded-xl border border-white/15 bg-slate-950/72 px-2.5 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-1.5 text-[11px] font-black text-white">
          <span aria-hidden="true">🌿</span> Photosynthesis Lab
        </div>
        <PhotoModeToggle mode={mode} disabled={modeDisabled} onChange={onModeChange} compact />
      </div>

      <div className="photo-mobile-tools pointer-events-none mx-2 mt-1.5 flex justify-end gap-1.5">
        <PhotosynthesisExplanations narrator={narrator} onShowMe={onShowMe} disabled={modeDisabled} />
        <TinasheGuideButton active={guideActive} disabled={modeDisabled} onClick={onToggleGuide} />
      </div>

      {menuOpen && (
        <div className="pointer-events-auto absolute right-2 top-[3.35rem] w-44 overflow-hidden rounded-2xl border border-violet-300/20 bg-[#0c0c2d]/97 p-1.5 text-white shadow-2xl backdrop-blur-2xl">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onRequestHowTo?.();
            }}
            disabled={!onRequestHowTo}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[10px] font-black hover:bg-white/10 disabled:opacity-40"
          >
            <CircleHelp size={14} className="text-cyan-300" /> How to
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onRequestPaper?.();
            }}
            disabled={!onRequestPaper}
            data-experiment-tour="paper"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[10px] font-black hover:bg-white/10 disabled:opacity-40"
          >
            <FileText size={14} className="text-emerald-300" /> Experiment paper
          </button>
          <div className="my-1 h-px bg-white/10" />
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onShowMe();
            }}
            disabled={modeDisabled}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[10px] font-black text-violet-100 hover:bg-white/10 disabled:opacity-40"
          >
            <PlayCircle size={14} className="text-violet-300" /> Watch full demo
          </button>
        </div>
      )}
    </div>
  );
}

function PhotoMobileMissionDeck({
  step,
  running,
  progress,
  observation,
  lightExposed,
  conditionDisabled,
  onConditionChange,
  autoWalkthroughActive,
  autoWalkthroughPaused,
  onRun,
  onReset,
  onStartAuto,
  onToggleAutoPause,
  onStopAuto,
}: {
  step: number;
  running: boolean;
  progress: number;
  observation: string;
  lightExposed: boolean;
  conditionDisabled: boolean;
  onConditionChange: (value: boolean) => void;
  autoWalkthroughActive: boolean;
  autoWalkthroughPaused: boolean;
  onRun: () => void;
  onReset: () => void;
  onStartAuto: () => void;
  onToggleAutoPause: () => void;
  onStopAuto: () => void;
}) {
  const complete = step >= PHOTO_MISSIONS.length;
  const currentIndex = Math.min(step, PHOTO_MISSIONS.length - 1);
  const mission = PHOTO_MISSIONS[currentIndex];
  const visibleStageProgress =
    running || autoWalkthroughActive ? progress : 0;

  return (
    <div
      data-mobile-experiment-controls="true"
      className="photo-mobile-mission-deck experiment-mobile-controls pointer-events-auto absolute inset-x-2 bottom-2 z-[82] rounded-[22px] border border-fuchsia-300/35 bg-[radial-gradient(circle_at_92%_8%,rgba(217,70,239,.22),transparent_26%),linear-gradient(160deg,rgba(72,15,99,.97),rgba(33,5,58,.98)_48%,rgba(15,5,34,.98))] p-2 shadow-[inset_0_2px_0_rgba(255,255,255,.17),0_18px_50px_rgba(3,2,18,.55)] backdrop-blur-xl sm:hidden"
    >
      <div className="flex items-center justify-between px-1 text-[7px] font-black uppercase tracking-[0.14em] text-fuchsia-100">
        <span>{complete ? "Mission complete" : "Current mission"}</span>
        <PhotoConditionCard lightExposed={lightExposed} disabled={conditionDisabled} onChange={onConditionChange} compact />
      </div>

      <div className="photo-mobile-current-card mt-1.5 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-violet-50 p-2 text-slate-900 shadow-[inset_0_1px_0_white,0_6px_16px_rgba(24,2,43,.35)]">
        <div className="flex items-center gap-2">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-amber-200 bg-amber-100 text-2xl shadow-sm">
            {complete ? "🏆" : mission.symbol}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[12px] font-black">{complete ? "Result Revealed" : mission.title}</div>
            <p className="photo-mobile-mission-detail mt-0.5 line-clamp-2 text-[8px] font-semibold leading-snug text-slate-600">
              {complete ? observation : mission.detail}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[8px] font-black text-amber-700">
              <Star size={10} className="fill-amber-400 text-amber-500" />
              {complete ? "4 / 4 missions complete" : `+${mission.reward} session XP`}
            </div>
          </div>
          <div className="photo-mobile-coach relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-600 text-2xl shadow-md">
            <span aria-hidden="true">🧑🏾‍🔬</span>
            <span className="absolute -left-16 -top-2 w-[72px] rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-center text-[6px] font-black leading-tight text-slate-700 shadow">
              {complete ? "Great science!" : `Mission ${currentIndex + 1} is ready!`}
            </span>
          </div>
        </div>

        <div className="mt-1.5 grid grid-cols-[1fr_auto_auto] gap-1.5">
          <button
            type="button"
            onClick={autoWalkthroughActive ? onToggleAutoPause : onRun}
            disabled={running && !autoWalkthroughActive}
            aria-label={
              autoWalkthroughActive
                ? autoWalkthroughPaused
                  ? "Resume the narrated photosynthesis walkthrough"
                  : "Pause the narrated photosynthesis walkthrough"
                : complete
                  ? "Repeat the photosynthesis experiment"
                  : `Start mission ${currentIndex + 1}: ${mission.title}`
            }
            className={`inline-flex h-8 min-w-0 items-center justify-center gap-1.5 rounded-full border border-white/45 px-3 text-[9px] font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,.34),0_5px_10px_rgba(71,5,110,.28)] disabled:opacity-50 ${
              autoWalkthroughActive
                ? autoWalkthroughPaused
                  ? "bg-gradient-to-b from-cyan-400 to-sky-600"
                  : "bg-gradient-to-b from-amber-400 to-orange-600"
                : "bg-gradient-to-b from-fuchsia-500 to-purple-700"
            }`}
          >
            {autoWalkthroughActive
              ? autoWalkthroughPaused
                ? <Play size={11} fill="currentColor" />
                : <Pause size={11} fill="currentColor" />
              : complete
                ? <RotateCcw size={11} />
                : <Play size={11} fill="currentColor" />}
            <span className="truncate">
              {autoWalkthroughActive
                ? autoWalkthroughPaused
                  ? "Resume"
                  : "Pause"
                : running
                  ? `${Math.round(progress * 100)}%`
                  : complete
                    ? "Repeat"
                    : "Start mission"}
            </span>
          </button>
          <button
            type="button"
            onClick={autoWalkthroughActive ? onStopAuto : onStartAuto}
            aria-label={autoWalkthroughActive ? "Stop the narrated walkthrough and reset the experiment" : "Explain the whole photosynthesis process"}
            className={`grid h-8 w-8 place-items-center rounded-full border ${
              autoWalkthroughActive
                ? "border-rose-300/40 bg-rose-500 text-white"
                : "border-violet-300/40 bg-violet-100 text-violet-700"
            }`}
          >
            {autoWalkthroughActive ? <Square size={11} fill="currentColor" /> : <PlayCircle size={14} />}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={autoWalkthroughActive}
            aria-label="Reset the photosynthesis experiment"
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white text-slate-600 disabled:opacity-40"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      <div className="photo-mobile-path mt-2 rounded-xl border border-white/10 bg-slate-950/35 p-1.5">
        <div className="mb-1 px-1 text-[6px] font-black uppercase tracking-[0.14em] text-violet-200">Mission path</div>
        <PhotoMissionPath step={step} progress={visibleStageProgress} compact />
      </div>
    </div>
  );
}

function LabCamera() {
  const { camera, size } = useThree();
  const mobile = size.width < 640;
  useEffect(() => {
    camera.position.set(mobile ? 6.8 : 8.2, mobile ? 4.4 : 5.2, mobile ? 9.4 : 10.8);
    if (camera instanceof THREE.PerspectiveCamera) camera.fov = mobile ? 56 : 50;
    camera.near = 0.08;
    camera.far = 110;
    camera.lookAt(0, 1.2, 0);
    camera.updateProjectionMatrix();
  }, [camera, mobile]);
  return <OrbitControls makeDefault enablePan={false} target={[0, 1.1, 0]} minDistance={5.6} maxDistance={17.5} maxPolarAngle={1.5} />;
}

const PHOTO_WALKTHROUGH_CAMERA_TARGETS = [
  new THREE.Vector3(-3.15, 2.2, 0.05),
  new THREE.Vector3(-1.05, 2.2, 0.05),
  new THREE.Vector3(1.15, 1.75, 0.05),
  new THREE.Vector3(3.15, 1.38, 0.12),
] as const;

function WalkthroughCamera({
  stepIndex,
  paused,
}: {
  stepIndex: number;
  paused: boolean;
}) {
  const { camera, size } = useThree();
  const mobile = size.width < 640;
  const lookTargetRef = useRef(new THREE.Vector3(0, 1.2, 0));
  const desiredPositionRef = useRef(new THREE.Vector3());

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) camera.fov = mobile ? 58 : 48;
    camera.near = 0.08;
    camera.far = 110;
    camera.updateProjectionMatrix();
  }, [camera, mobile]);

  useFrame((_, delta) => {
    if (paused) return;
    const target = PHOTO_WALKTHROUGH_CAMERA_TARGETS[
      Math.min(PHOTO_WALKTHROUGH_CAMERA_TARGETS.length - 1, Math.max(0, stepIndex))
    ];
    const desiredPosition = desiredPositionRef.current.set(
      target.x + (mobile ? 0.4 : 0.62),
      target.y + (mobile ? 2.05 : 1.85),
      target.z + (mobile ? 6.4 : 5.65),
    );
    const positionBlend = 1 - Math.exp(-delta * 1.75);
    const targetBlend = 1 - Math.exp(-delta * 2.25);
    camera.position.lerp(desiredPosition, positionBlend);
    lookTargetRef.current.lerp(target, targetBlend);
    camera.lookAt(lookTargetRef.current);
  });

  return null;
}

function makePhotoPosterTexture(title: string, lines: string[], accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 820;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#edf5ef";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(0, 0, canvas.width, 122);
  context.fillStyle = "#ffffff";
  context.font = "800 40px Arial";
  context.textAlign = "center";
  context.fillText(title, canvas.width / 2, 74);
  context.textAlign = "left";
  context.font = "700 29px Arial";
  lines.forEach((line, index) => {
    const y = 180 + index * 108;
    context.fillStyle = accent;
    context.beginPath();
    context.arc(58, y - 9, 14, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#172033";
    const words = line.split(" ");
    let row = "";
    let rowY = y;
    words.forEach((word) => {
      const next = `${row}${word} `;
      if (context.measureText(next).width > 500) {
        context.fillText(row.trim(), 92, rowY);
        row = `${word} `;
        rowY += 36;
      } else {
        row = next;
      }
    });
    context.fillText(row.trim(), 92, rowY);
  });
  context.strokeStyle = "#91a39a";
  context.lineWidth = 8;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function PhotoWallPoster({
  position,
  title,
  lines,
  accent,
}: {
  position: [number, number, number];
  title: string;
  lines: string[];
  accent: string;
}) {
  const contentKey = lines.join("|");
  const texture = useMemo(() => makePhotoPosterTexture(title, lines, accent), [accent, contentKey, title]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.95, 3.55, 0.12]} />
        <meshStandardMaterial color="#2f3c36" metalness={0.32} roughness={0.38} />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[2.72, 3.32]} />
        <meshStandardMaterial map={texture} roughness={0.72} />
      </mesh>
    </group>
  );
}

function PhotoCeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3.1, 0.14, 0.68]} />
        <meshStandardMaterial color="#d9e2df" metalness={0.32} roughness={0.36} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[2.78, 0.035, 0.48]} />
        <meshStandardMaterial color="#f8fffb" emissive="#effff8" emissiveIntensity={1.75} toneMapped={false} />
      </mesh>
      <pointLight position={[0, -0.5, 0]} color="#f5fff8" intensity={0.78} distance={8.5} decay={2} />
    </group>
  );
}

function PhotoLabTable({
  position,
  size,
  topColor = "#375448",
}: {
  position: [number, number, number];
  size: [number, number];
  topColor?: string;
}) { return <BlenderLabBench position={position} size={size} height={1.12} topColor={topColor} />; }

function PhotoLabStool({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.37, 0.13, 28]} />
        <meshStandardMaterial color="#29463b" roughness={0.44} />
      </mesh>
      {[0, 1, 2, 3].map((index) => {
        const angle = index * (Math.PI / 2) + Math.PI / 4;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.23, 0.34, Math.sin(angle) * 0.23]} castShadow>
            <cylinderGeometry args={[0.035, 0.045, 0.7, 10]} />
            <meshStandardMaterial color="#313d38" metalness={0.62} roughness={0.28} />
          </mesh>
        );
      })}
    </group>
  );
}

function PhotoExitDoor() {
  return (
    <group position={[15.83, 0, -7]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[2.22, 4.3, 0.18]} />
        <meshStandardMaterial color="#49615a" roughness={0.58} />
      </mesh>
      <mesh position={[0, 2.15, -0.105]}>
        <boxGeometry args={[1.78, 3.86, 0.045]} />
        <meshStandardMaterial color="#6d8580" roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.72, -0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 1.22, 14]} />
        <meshStandardMaterial color="#d1dad8" metalness={0.82} roughness={0.22} />
      </mesh>
      <Html position={[0, 4.75, -0.12]} center distanceFactor={9} style={{ pointerEvents: "none" }}>
        <div className="rounded bg-emerald-700 px-4 py-1 text-xs font-black uppercase tracking-wide text-white shadow-lg">Exit</div>
      </Html>
    </group>
  );
}

function PhotoWindow() {
  return (
    <group position={[-15.84, 5.2, -3.55]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[4.8, 2.8, 0.2]} />
        <meshStandardMaterial color="#dfe9e4" roughness={0.4} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0, -0.13]}>
        <planeGeometry args={[4.42, 2.42]} />
        <meshPhysicalMaterial color="#a7e0ee" emissive="#72cfe5" emissiveIntensity={0.24} transparent opacity={0.55} transmission={0.35} roughness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[0.1, 2.48, 0.08]} />
        <meshStandardMaterial color="#edf5f1" metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[4.45, 0.1, 0.08]} />
        <meshStandardMaterial color="#edf5f1" metalness={0.35} />
      </mesh>
      <mesh position={[-1.45, -0.35, -0.22]}>
        <coneGeometry args={[0.58, 1.35, 8]} />
        <meshStandardMaterial color="#39764b" roughness={0.92} />
      </mesh>
      <mesh position={[1.35, -0.38, -0.21]}>
        <coneGeometry args={[0.52, 1.22, 8]} />
        <meshStandardMaterial color="#5a8f56" roughness={0.92} />
      </mesh>
    </group>
  );
}

function PottedPlant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.34, 0.56, 28]} />
        <meshStandardMaterial color="#8b4a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 28]} />
        <meshStandardMaterial color="#2b1a13" roughness={0.95} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = index * 0.7;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.24, 1.03 + (index % 3) * 0.08, Math.sin(angle) * 0.24]} rotation={[0.75, angle, 0]} scale={[0.55, 0.9, 1]} castShadow>
            <circleGeometry args={[0.28, 28]} />
            <meshStandardMaterial color={index % 2 ? "#2f8a49" : "#3aa75a"} roughness={0.78} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function SafetyGoggles({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0.2, 0]}>
      {[-0.22, 0.22].map((x) => (
        <mesh key={x} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.34, 0.12, 0.08]} />
          <meshPhysicalMaterial color="#dffaff" transparent opacity={0.42} transmission={0.4} roughness={0.08} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.16, 0.045, 0.055]} />
        <meshStandardMaterial color="#3b4a45" roughness={0.45} />
      </mesh>
      <Line points={[[-0.39, 0, 0], [-0.62, 0.04, 0.14]]} color="#23312d" lineWidth={1.5} />
      <Line points={[[0.39, 0, 0], [0.62, 0.04, 0.14]]} color="#23312d" lineWidth={1.5} />
    </group>
  );
}

function PhotoLabRoom() { return <group><BlenderLabEnvironment {...BLENDER_LAB_LAYOUT} />
<PhotoWallPoster
        position={[-10.35, 5.65, 11.82]}
        title="STARCH TEST"
        accent="#15803d"
        lines={["Boil leaf to kill cells", "Alcohol removes chlorophyll", "Warm water softens leaf", "Iodine turns blue-black with starch", "Light is needed for photosynthesis"]}
      />
<PhotoWallPoster
        position={[7.65, 5.65, 11.82]}
        title="SAFETY"
        accent="#b45309"
        lines={["Wear eye protection", "Heat alcohol in a water bath", "Keep ethanol away from flames", "Handle hot glassware carefully", "Use forceps for the leaf"]}
      />
<PhotoLabTable position={[0, 0, 0]} size={[8.9, 3.7]} />
<PhotoLabTable position={[-8.45, 0, 4.5]} size={[2.7, 2.6]} topColor="#416052" />
<PhotoLabTable position={[8.45, 0, 4.5]} size={[2.7, 2.6]} topColor="#416052" />
<PhotoLabTable position={[-8.45, 0, -4.45]} size={[2.7, 2.55]} topColor="#4b6257" />
<PhotoLabStool position={[-4.9, 0, 1.45]} />
<PhotoLabStool position={[4.9, 0, 1.45]} />
<PhotoLabStool position={[-4.9, 0, -1.45]} />
<PhotoLabStool position={[4.9, 0, -1.45]} />
<PottedPlant position={[-8.45, 1.05, 4.5]} />
<PottedPlant position={[8.45, 1.05, 4.5]} />
<SafetyGoggles position={[-2.35, 1.24, -1.42]} /></group>; }

function BunsenBurner({ active, paused = false }: { active: boolean; paused?: boolean }) {
  return <group><group scale={[1.3, 2, 1.3]}><BlenderBurner lit={active} heat={.45} paused={paused} /></group><BlenderLabProp asset="tripod-gauze" scale={[12, 8.8, 12]} /></group>;
}

function GlassBeaker({
  position,
  liquidColor,
  liquidLevel = 0.72,
  boilIntensity = 0,
  label,
  paused = false,
}: {
  position: [number, number, number];
  liquidColor: string;
  liquidLevel?: number;
  boilIntensity?: number;
  label: string;
  paused?: boolean;
}) {
  const bubblesRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);
  const ripplesRef = useRef<THREE.Group>(null);
  const liquidSurfaceRef = useRef<THREE.Mesh>(null);
  const boilEnergyRef = useRef(0);
  const animationTimeRef = useRef(0);
  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const random = (offset: number) => {
          const value = Math.sin((index + 1) * (12.9898 + offset * 17.17)) * 43758.5453;
          return value - Math.floor(value);
        };
        const angle = random(1) * Math.PI * 2;
        const radius = Math.sqrt(random(2)) * 0.39;
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius,
          phase: random(3),
          speed: 0.42 + random(4) * 0.6,
          size: 0.018 + random(5) * 0.034,
          sway: 0.018 + random(6) * 0.035,
        };
      }),
    [],
  );
  const steamSeeds = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        phase: (index * 0.173) % 1,
        x: Math.sin(index * 2.17) * 0.27,
        z: Math.cos(index * 1.71) * 0.19,
        speed: 0.1 + (index % 4) * 0.018,
      })),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (paused) return;

    animationTimeRef.current += delta;
    const rawIntensity = THREE.MathUtils.clamp(boilIntensity, 0, 1);
    const targetEnergy =
      rawIntensity < BOILING_START_THRESHOLD
        ? 0
        : THREE.MathUtils.clamp(
            (rawIntensity - BOILING_START_THRESHOLD) /
              (1 - BOILING_START_THRESHOLD),
            0,
            1,
          );
    boilEnergyRef.current +=
      (targetEnergy - boilEnergyRef.current) * (1 - Math.exp(-delta * 3.8));
    const energy = boilEnergyRef.current;
    const time = animationTimeRef.current;

    if (targetEnergy === 0 && energy < 0.001) {
      boilEnergyRef.current = 0;
      if (liquidSurfaceRef.current) {
        liquidSurfaceRef.current.position.y = liquidLevel + 0.065;
        liquidSurfaceRef.current.scale.set(1, 1, 1);
      }
      if (bubblesRef.current) bubblesRef.current.visible = false;
      if (ripplesRef.current) ripplesRef.current.visible = false;
      if (steamRef.current) steamRef.current.visible = false;
      return;
    }

    if (liquidSurfaceRef.current) {
      liquidSurfaceRef.current.position.y =
        liquidLevel + 0.065 +
        (Math.sin(time * 8.3) + Math.sin(time * 12.7) * 0.45) * 0.006 * energy;
      liquidSurfaceRef.current.scale.set(
        1 + Math.sin(time * 7.1) * 0.008 * energy,
        1 + Math.cos(time * 8.6) * 0.008 * energy,
        1,
      );
    }

    if (bubblesRef.current) {
      bubblesRef.current.visible = energy > 0.015;
      bubblesRef.current.children.forEach((child, index) => {
        const seed = bubbleSeeds[index];
        const cycle = (time * seed.speed + seed.phase) % 1;
        const rise = 0.1 + cycle * Math.max(0.16, liquidLevel - 0.08);
        const edgeFade = 1 - THREE.MathUtils.smoothstep(cycle, 0.82, 1);
        child.position.set(
          seed.x + Math.sin(time * 4.1 + index) * seed.sway * cycle,
          rise,
          seed.z + Math.cos(time * 3.6 + index * 1.3) * seed.sway * cycle,
        );
        const scale = energy * (0.45 + cycle * 1.12);
        child.scale.setScalar(Math.max(0.01, scale));
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = energy * edgeFade * (0.38 + cycle * 0.46);
      });
    }

    if (ripplesRef.current) {
      ripplesRef.current.visible = energy > 0.08;
      ripplesRef.current.children.forEach((child, index) => {
        const cycle = (time * (0.62 + index * 0.07) + index * 0.23) % 1;
        const scale = 0.2 + cycle * 0.85;
        child.position.y = liquidLevel + 0.071 + index * 0.0006;
        child.scale.set(scale, scale, 1);
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity =
          energy * (1 - THREE.MathUtils.smoothstep(cycle, 0.35, 1)) * 0.54;
      });
    }

    if (steamRef.current) {
      steamRef.current.visible = energy > 0.38;
      steamRef.current.children.forEach((child, index) => {
        const seed = steamSeeds[index];
        const cycle = (time * seed.speed + seed.phase) % 1;
        child.position.set(
          seed.x + Math.sin(time * 0.8 + index) * 0.09 * cycle,
          liquidLevel + 0.18 + cycle * 1.24,
          seed.z + Math.cos(time * 0.7 + index * 0.8) * 0.06 * cycle,
        );
        child.scale.set(
          0.38 + cycle * 0.82,
          0.58 + cycle * 1.25,
          0.38 + cycle * 0.82,
        );
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity =
          energy *
          THREE.MathUtils.smoothstep(cycle, 0, 0.18) *
          (1 - THREE.MathUtils.smoothstep(cycle, 0.55, 1)) *
          0.22;
      });
    }
  });

  return (
    <group position={position}>
      <BlenderLabProp asset="beaker-250ml" scale={[15,12,15]} />
      <BlenderLabProp asset="water-volume" position={[0,.06,0]} scale={[.54,liquidLevel,.54]} color={liquidColor} />
      <mesh
        ref={liquidSurfaceRef}
        position={[0, liquidLevel + 0.065, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={18}
      >
        <circleGeometry args={[0.535, 64]} />
        <meshPhysicalMaterial
          color={liquidColor}
          transparent
          opacity={0.63}
          transmission={0.18}
          roughness={0.12}
          clearcoat={0.7}
          clearcoatRoughness={0.16}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.19, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={28}>
        <torusGeometry args={[0.605, 0.025, 12, 64]} />
        <meshPhysicalMaterial color="#e8fbff" transparent opacity={0.72} transmission={0.5} depthWrite={false} />
      </mesh>
      <group ref={bubblesRef} visible={false}>
        {bubbleSeeds.map((seed, index) => (
          <mesh key={index} position={[seed.x, 0.1, seed.z]} renderOrder={20}>
            <sphereGeometry args={[seed.size, 12, 9]} />
            <meshBasicMaterial
              color="#f2feff"
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
      <group ref={ripplesRef} visible={false}>
        {Array.from({ length: 6 }, (_, index) => (
          <mesh
            key={index}
            position={[0, liquidLevel + 0.071, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={21}
          >
            <ringGeometry args={[0.12, 0.15, 32]} />
            <meshBasicMaterial
              color="#ecfeff"
              transparent
              opacity={0}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
      <BlenderSteam active={boilIntensity > .38} heat={boilIntensity} position={[0,liquidLevel+.18,0]} paused={paused} />
      <Html position={[0, -0.22, 0.4]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/88 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-white">{label}</div>
      </Html>
    </group>
  );
}

function AlcoholWaterBath({
  active,
  decolorProgress,
  paused = false,
}: {
  active: boolean;
  decolorProgress: number;
  paused?: boolean;
}) {
  const ethanolBubblesRef = useRef<THREE.Group>(null);
  const tubeDip = THREE.MathUtils.smoothstep(decolorProgress, 0.3, 0.52);
  const tubeLift = (1 - tubeDip) * 0.62;
  const ethanolBoiling = active && decolorProgress >= 0.46;
  const ethanolColor = new THREE.Color("#e6ddc2").lerp(
    new THREE.Color("#4e8f50"),
    THREE.MathUtils.clamp(decolorProgress, 0, 1),
  );

  useFrame(({ clock }) => {
    if (!ethanolBubblesRef.current || !ethanolBoiling || paused) return;
    ethanolBubblesRef.current.children.forEach((child, index) => {
      const travel = (clock.elapsedTime * (0.34 + index * 0.025) + index * 0.17) % 0.5;
      child.position.y = 1.61 + travel;
      child.position.x = Math.sin(clock.elapsedTime * 3.1 + index * 1.7) * 0.11;
      child.position.z = Math.cos(clock.elapsedTime * 2.6 + index) * 0.08;
    });
  });

  return (
    <group position={[-1.05, 0.02, 0.05]}>
      <BunsenBurner active={active && decolorProgress < 0.3} paused={paused} />
      <GlassBeaker
        position={[0, 1.33, 0]}
        liquidColor="#68c9dc"
        liquidLevel={0.79}
        boilIntensity={
          active ? THREE.MathUtils.smoothstep(decolorProgress, 0.08, 0.3) : 0
        }
        label="Heated water bath"
        paused={paused}
      />

      <group position={[0, tubeLift, 0]}>
        <mesh position={[0, 2.14, 0]} renderOrder={28}>
          <cylinderGeometry args={[0.265, 0.235, 1.25, 42, 1, true]} />
          <meshPhysicalMaterial
            color="#e9fbff"
            transparent
            opacity={0.3}
            transmission={0.86}
            roughness={0.035}
            thickness={0.045}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 1.53, 0]} scale={[1, 0.62, 1]} renderOrder={28}>
          <sphereGeometry args={[0.235, 34, 20]} />
          <meshPhysicalMaterial
            color="#e9fbff"
            transparent
            opacity={0.27}
            transmission={0.86}
            roughness={0.035}
            thickness={0.045}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 2.765, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={30}>
          <torusGeometry args={[0.267, 0.021, 10, 42]} />
          <meshPhysicalMaterial color="#effdff" transparent opacity={0.72} transmission={0.55} depthWrite={false} />
        </mesh>

        <mesh position={[0, 1.86, 0]} renderOrder={20}>
          <cylinderGeometry args={[0.215, 0.205, 0.58, 38]} />
          <meshPhysicalMaterial
            color={ethanolColor}
            transparent
            opacity={0.62}
            transmission={0.16}
            roughness={0.12}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 2.15, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={22}>
          <circleGeometry args={[0.214, 38]} />
          <meshPhysicalMaterial color={ethanolColor} transparent opacity={0.72} roughness={0.08} depthWrite={false} />
        </mesh>

        <group ref={ethanolBubblesRef} visible={ethanolBoiling}>
          {Array.from({ length: 8 }, (_, index) => (
            <mesh key={index} position={[0, 1.62 + index * 0.055, 0.03]}>
              <sphereGeometry args={[0.018 + (index % 3) * 0.008, 10, 8]} />
              <meshBasicMaterial color="#f4fff3" transparent opacity={0.66} depthWrite={false} />
            </mesh>
          ))}
        </group>
      </group>

      <group position={[0.58, 2.43, -0.12]}>
        <mesh position={[0, -1.05, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 2.48, 14]} />
          <meshStandardMaterial color="#67757b" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh position={[-0.28, 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.028, 0.035, 0.6, 14]} />
          <meshStandardMaterial color="#77858a" metalness={0.82} roughness={0.25} />
        </mesh>
        <mesh position={[-0.57, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.29, 0.025, 10, 32]} />
          <meshStandardMaterial color="#69777c" metalness={0.82} roughness={0.27} />
        </mesh>
      </group>

      <Html position={[0, 2.98, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-amber-200/35 bg-amber-950/92 px-2.5 py-1 text-[8px] font-black uppercase tracking-wide text-amber-50 shadow-lg">
          Ethanol tube · indirect heat
        </div>
      </Html>
    </group>
  );
}

function LeafModel({
  step,
  progress,
  lightExposed,
  paused = false,
}: {
  step: number;
  progress: number;
  lightExposed: boolean;
  paused?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bladeRef = useRef<THREE.Group>(null);
  const leafShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.56);
    shape.bezierCurveTo(-0.37, -0.42, -0.58, 0.08, 0, 0.6);
    shape.bezierCurveTo(0.58, 0.08, 0.37, -0.42, 0, -0.56);
    return shape;
  }, []);
  const positions = useMemo(
    () => [
      new THREE.Vector3(-3.15, 2.15, 0.15),
      new THREE.Vector3(-1.05, 2.03, 0.18),
      new THREE.Vector3(1.15, 0.72, 0.18),
      new THREE.Vector3(3.15, 0.17, 0.22),
    ],
    [],
  );
  const alcoholTarget = useMemo(() => new THREE.Vector3(), []);
  const alcoholTubeLift =
    step === 1 ? (1 - THREE.MathUtils.smoothstep(progress, 0.3, 0.52)) * 0.62 : 0;
  const target =
    step === 1
      ? alcoholTarget.set(-1.05, positions[1].y + alcoholTubeLift, 0.18)
      : positions[Math.min(3, step)];
  const decolorProgress = step < 1 ? 0 : step === 1 ? progress : 1;
  const iodineProgress = step < 3 ? 0 : step === 3 ? progress : 1;
  const stainProgress = THREE.MathUtils.smoothstep(iodineProgress, 0.5, 0.98);
  const green = new THREE.Color("#3f8f48");
  const pale = new THREE.Color("#eee4bb");
  const wetResult = new THREE.Color(lightExposed ? "#a97828" : "#b68128");
  const color = green
    .clone()
    .lerp(pale, decolorProgress)
    .lerp(wetResult, THREE.MathUtils.smoothstep(iodineProgress, 0.48, 0.94));

  useFrame(({ clock }, delta) => {
    if (!groupRef.current || paused) return;
    groupRef.current.position.lerp(target, 1 - Math.exp(-delta * 4.4));
    groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 2.2) * 0.035;
    groupRef.current.position.y += Math.sin(clock.elapsedTime * 3.1) * 0.0015;
    if (bladeRef.current) {
      const targetTilt = step >= 3 ? -Math.PI / 2 + 0.08 : -0.35;
      bladeRef.current.rotation.x = THREE.MathUtils.lerp(
        bladeRef.current.rotation.x,
        targetTilt,
        1 - Math.exp(-delta * 4.2),
      );
    }
  });

  return (
    <group ref={groupRef} position={positions[0]}>
      <group ref={bladeRef} rotation={[-0.35, 0, -0.18]} scale={[0.74, 1, 1]}>
        <mesh castShadow renderOrder={30}>
          <shapeGeometry args={[leafShape, 48]} />
          <meshPhysicalMaterial
            color={color}
            roughness={THREE.MathUtils.lerp(0.7, 0.28, iodineProgress)}
            clearcoat={THREE.MathUtils.lerp(0.08, 0.82, iodineProgress)}
            clearcoatRoughness={0.22}
            side={THREE.DoubleSide}
          />
        </mesh>
        {PHOTO_LEAF_STAIN_PATCHES.map((patch, index) => {
          const localProgress = THREE.MathUtils.clamp(
            (stainProgress - patch.start) / Math.max(0.001, 1 - patch.start),
            0,
            1,
          );
          const spread = 1 - Math.pow(1 - localProgress, 3);
          return (
            <mesh
              key={`${patch.x}-${patch.y}`}
              visible={spread > 0.001}
              position={[patch.x, patch.y, 0.012 + index * 0.0003]}
              rotation={[0, 0, patch.rotation]}
              scale={[
                Math.max(0.001, patch.sx * spread),
                Math.max(0.001, patch.sy * spread),
                1,
              ]}
              renderOrder={31}
            >
              <circleGeometry args={[1, 32]} />
              <meshPhysicalMaterial
                color={
                  lightExposed
                    ? index % 2 === 0
                      ? "#10162d"
                      : "#202247"
                    : index % 2 === 0
                      ? "#8f5f1c"
                      : "#a87325"
                }
                transparent
                opacity={(lightExposed ? 0.94 : 0.42) * spread}
                roughness={0.24}
                clearcoat={0.75}
                clearcoatRoughness={0.2}
                depthWrite={false}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
        <Line
          points={[[0, -0.5, 0.026], [0, 0.51, 0.026]]}
          color={iodineProgress > 0.6 && lightExposed ? "#65709c" : "#758258"}
          lineWidth={1.5}
        />
        {[-0.3, -0.14, 0.04, 0.22].map((y, index) => (
          <Line
            key={y}
            points={[[0, y, 0.027], [index % 2 ? 0.28 : -0.28, y + 0.13, 0.027]]}
            color={iodineProgress > 0.6 && lightExposed ? "#65709c" : "#758258"}
            lineWidth={0.8}
          />
        ))}
        <mesh position={[0, -0.69, 0]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.055, 0.3, 0.035]} />
          <meshStandardMaterial color="#6c7b42" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

function IodineApparatus({
  active,
  progress,
  paused = false,
}: {
  active: boolean;
  progress: number;
  paused?: boolean;
}) {
  const dropperRef = useRef<THREE.Group>(null);
  const travel = active
    ? THREE.MathUtils.smoothstep(progress, 0.08, 0.34) *
      (1 - THREE.MathUtils.smoothstep(progress, 0.84, 0.99))
    : 0;

  useFrame(({ clock }) => {
    if (!dropperRef.current || paused) return;
    dropperRef.current.position.set(
      -0.68 + travel * 0.84,
      1.15 + travel * 0.41 + (active ? Math.sin(clock.elapsedTime * 3.8) * 0.008 : 0),
      0.02,
    );
    dropperRef.current.rotation.z = -travel * 0.2;
  });

  const dropletStarts = [0.37, 0.49, 0.61, 0.73] as const;

  return (
    <group>
      <group position={[-0.68, 0.04, 0]}>
        <mesh position={[0, 0.31, 0]} castShadow renderOrder={22}>
          <cylinderGeometry args={[0.19, 0.225, 0.58, 42]} />
          <meshPhysicalMaterial
            color="#75431d"
            transparent
            opacity={0.5}
            transmission={0.35}
            roughness={0.08}
            thickness={0.08}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.25, 0]} renderOrder={18}>
          <cylinderGeometry args={[0.17, 0.19, 0.4, 40]} />
          <meshPhysicalMaterial color="#7a480f" transparent opacity={0.86} roughness={0.18} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.64, 0]} renderOrder={22}>
          <cylinderGeometry args={[0.105, 0.19, 0.16, 40]} />
          <meshPhysicalMaterial
            color="#7b4820"
            transparent
            opacity={0.48}
            transmission={0.35}
            roughness={0.08}
            thickness={0.07}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.77, 0]} renderOrder={22}>
          <cylinderGeometry args={[0.102, 0.102, 0.18, 32]} />
          <meshPhysicalMaterial color="#70401c" transparent opacity={0.5} transmission={0.3} roughness={0.08} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.88, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.105, 0.018, 10, 36]} />
          <meshPhysicalMaterial color="#7f4b20" transparent opacity={0.66} transmission={0.28} roughness={0.13} />
        </mesh>
        <mesh position={[0, 0.34, 0.205]} castShadow>
          <boxGeometry args={[0.33, 0.25, 0.018]} />
          <meshStandardMaterial color="#eee9d9" roughness={0.72} />
        </mesh>
        <Html position={[0, 0.34, 0.221]} center distanceFactor={5.5} style={{ pointerEvents: "none" }}>
          <div className="w-[48px] rounded-[3px] border border-amber-950/20 bg-[#f4eedc] px-1 py-0.5 text-center font-sans text-[5px] font-black uppercase leading-tight tracking-[0.05em] text-amber-950 shadow-sm">
            Iodine
            <span className="block text-[4px] font-bold tracking-normal">solution</span>
          </div>
        </Html>
      </group>

      <group ref={dropperRef} position={[-0.68, 1.15, 0.02]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <cylinderGeometry args={[0.126, 0.126, 0.13, 32]} />
          <meshStandardMaterial color="#25201d" roughness={0.52} metalness={0.08} />
        </mesh>
        {[-0.315, -0.285, -0.255, -0.225, -0.195].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.126, 0.006, 6, 32]} />
            <meshStandardMaterial color="#403832" roughness={0.58} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.045, 0.022, 0.76, 20]} />
          <meshPhysicalMaterial
            color="#8f6337"
            transparent
            opacity={0.62}
            transmission={0.38}
            roughness={0.1}
            thickness={0.04}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, -0.38, 0]}>
          <coneGeometry args={[0.024, 0.12, 18]} />
          <meshPhysicalMaterial color="#6d4219" transparent opacity={0.76} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.46, 0]} scale={[0.78, 1.08, 0.78]} castShadow>
          <sphereGeometry args={[0.135, 24, 18]} />
          <meshStandardMaterial color="#34221d" roughness={0.6} />
        </mesh>
      </group>

      {dropletStarts.map((start, index) => {
        const fall = THREE.MathUtils.clamp((progress - start) / 0.13, 0, 1);
        const visible = active && progress >= start && progress <= start + 0.13;
        return (
          <mesh
            key={start}
            visible={visible}
            position={[
              0.12 + Math.sin(index * 2.1) * 0.035,
              1.08 - fall * 0.87,
              0.04 + Math.cos(index * 1.4) * 0.025,
            ]}
            scale={[1, 1 + fall * 1.4, 1]}
            renderOrder={34}
          >
            <sphereGeometry args={[0.038, 14, 10]} />
            <meshPhysicalMaterial
              color="#9a5a0c"
              transparent
              opacity={0.94}
              roughness={0.08}
              clearcoat={0.85}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {dropletStarts.map((start, index) => {
        const ripple = THREE.MathUtils.clamp((progress - start - 0.1) / 0.12, 0, 1);
        return (
          <mesh
            key={`ripple-${start}`}
            visible={active && ripple > 0 && ripple < 1}
            position={[
              0.12 + Math.sin(index * 2.1) * 0.035,
              0.205,
              0.04 + Math.cos(index * 1.4) * 0.025,
            ]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={[0.2 + ripple * 0.8, 0.2 + ripple * 0.8, 1]}
            renderOrder={35}
          >
            <ringGeometry args={[0.035, 0.052, 24]} />
            <meshBasicMaterial
              color="#9a5a0c"
              transparent
              opacity={(1 - ripple) * 0.7}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function PhotoMissionBeacon({
  position,
  active,
}: {
  position: [number, number, number];
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4.2) * 0.08;
    groupRef.current.scale.setScalar(pulse);
    groupRef.current.rotation.y = clock.elapsedTime * 0.35;
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={45}>
        <ringGeometry args={[0.7, 0.78, 56]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (index / 5) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.78, 0.17 + (index % 2) * 0.08, Math.sin(angle) * 0.78]}>
            <sphereGeometry args={[0.025 + (index % 2) * 0.012, 10, 8]} />
            <meshBasicMaterial color={index % 2 ? "#ffffff" : "#facc15"} toneMapped={false} />
          </mesh>
        );
      })}
      <pointLight position={[0, 0.35, 0]} color="#facc15" intensity={0.75} distance={2.6} decay={2} />
    </group>
  );
}

function PhotoStationMissionMarker({
  index,
  step,
  position,
}: {
  index: number;
  step: number;
  position: [number, number, number];
}) {
  const done = index < step;
  const active = step < PHOTO_MISSIONS.length && index === step;
  const mission = PHOTO_MISSIONS[index];

  return (
    <Html position={position} center distanceFactor={7.5} style={{ pointerEvents: "none" }} zIndexRange={[40, 0]}>
      <div className="flex flex-col items-center">
        <div
          className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[8px] font-black shadow-xl backdrop-blur-md ${
            done
              ? "border-emerald-200/60 bg-emerald-700/88 text-emerald-50"
              : active
                ? "border-yellow-200 bg-amber-500/90 text-slate-950 shadow-[0_0_18px_rgba(250,204,21,.55)]"
                : "border-white/25 bg-slate-800/74 text-slate-200"
          }`}
        >
          <span className={`mr-1 inline-grid h-4 w-4 place-items-center rounded-full ${active ? "bg-slate-900 text-amber-200" : "bg-white/10"}`}>
            {done ? "✓" : index + 1}
          </span>
          {mission.short === "Heat" ? "Heat in Alcohol" : mission.title.replace("the ", "")}
        </div>
        {active && (
          <div className="photo-station-arrow mt-1 text-xl font-black leading-none text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,.85)]">
            ↓
          </div>
        )}
      </div>
    </Html>
  );
}

function PhotoInteractionHighlight({
  position,
  active,
  guideMode = false,
  onActivate,
}: {
  position: THREE.Vector3;
  active: boolean;
  guideMode?: boolean;
  onActivate?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active;
    if (!active) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4.5) * 0.09;
    groupRef.current.scale.setScalar(pulse);
    groupRef.current.rotation.y = clock.elapsedTime * 0.45;
  });

  return (
    <group ref={groupRef} position={[position.x, 1.3, position.z]} visible={active}>
      {onActivate && (
        <mesh
          position={[0, 0.72, 0]}
          onPointerDown={(event) => {
            event.stopPropagation();
            onActivate();
          }}
        >
          <cylinderGeometry args={[1.05, 1.05, 2.55, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={50}>
        <ringGeometry args={[0.73, 0.84, 48]} />
        <meshBasicMaterial
          color={guideMode ? "#c4b5fd" : "#fef08a"}
          transparent
          opacity={0.88}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 1.7, 0]} rotation={[Math.PI, 0, 0]} renderOrder={50}>
        <coneGeometry args={[0.18, 0.4, 24]} />
        <meshBasicMaterial
          color={guideMode ? "#a78bfa" : "#fde047"}
          transparent
          opacity={0.95}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0.8, 0]}
        color={guideMode ? "#c4b5fd" : "#fde68a"}
        intensity={guideMode ? 0.7 : 0.45}
        distance={3.2}
        decay={2}
      />
    </group>
  );
}

function PhotosynthesisScene({
  step,
  running,
  progress,
  lightExposed,
  mode,
  isMobile,
  moveVectorRef,
  interactables,
  activeTargetId,
  onTargetChange,
  guideModeActive,
  onGuideStationClick,
  walkthroughActive,
  walkthroughStep,
  animationPaused,
}: {
  step: number;
  running: boolean;
  progress: number;
  lightExposed: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
  interactables: Interactable[];
  activeTargetId: string | null;
  onTargetChange: (target: Interactable | null) => void;
  guideModeActive: boolean;
  onGuideStationClick: (stationIndex: number) => void;
  walkthroughActive: boolean;
  walkthroughStep: number;
  animationPaused: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#aebbb3"]} />
      <fog attach="fog" args={["#aebbb3", 23, 42]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#ecffff", "#4b3a2e", 0.3]} />
      <directionalLight
        position={[-7.5, 10.5, 4.5]}
        intensity={0.85}
        color="#f0fff3"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-9.6, 4.35, -2.65]} color="#a5f3fc" intensity={1.25} distance={11} decay={2} />

      <PhotoLabRoom />

      <group position={[0, 1.14, 0]}>
        <mesh position={[0, 0.035, 0]} receiveShadow>
          <boxGeometry args={[8.15, 0.07, 3.05]} />
          <meshStandardMaterial color="#e5ece7" roughness={0.36} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[7.82, 0.035, 2.76]} />
          <meshStandardMaterial color="#f8fbf7" roughness={0.58} />
        </mesh>
        <group position={[-3.15, 0.02, 0.05]}>
          <BunsenBurner active={running && step === 0} paused={animationPaused} />
        </group>
        <GlassBeaker
          position={[-3.15, 1.35, 0.05]}
          liquidColor="#62cbe2"
          boilIntensity={getBoilIntensity(step, running, progress)}
          label={
            running && step === 0 && progress < 0.16
              ? "Water heating"
              : "Boiling water"
          }
          paused={animationPaused}
        />
        <AlcoholWaterBath
          active={running && step === 1}
          decolorProgress={step < 1 ? 0 : step === 1 ? progress : 1}
          paused={animationPaused}
        />
        <GlassBeaker position={[1.15, 0, 0.05]} liquidColor="#7dd8ea" boilIntensity={0} label="Warm-water wash" paused={animationPaused} />

        <group position={[3.15, 0.03, 0.12]}>
          <mesh receiveShadow>
            <cylinderGeometry args={[0.75, 0.75, 0.08, 48]} />
            <meshStandardMaterial color="#f1f3f4" metalness={0.12} roughness={0.3} />
          </mesh>
          <IodineApparatus
            active={running && step === 3}
            progress={step < 3 ? 0 : step === 3 ? progress : 1}
            paused={animationPaused}
          />
        </group>
        <LeafModel step={step} progress={progress} lightExposed={lightExposed} paused={animationPaused} />

        {mode === "learning" &&
          PHOTO_STATION_POSITIONS.map((stationPosition, index) => (
            <PhotoStationMissionMarker
              key={`photo-mission-marker-${index}`}
              index={index}
              step={step}
              position={[stationPosition.x, PHOTO_STATION_LABEL_HEIGHTS[index], stationPosition.z]}
            />
          ))}
        {mode === "learning" && step < PHOTO_MISSIONS.length && (
          <PhotoMissionBeacon
            active
            position={[
              PHOTO_STATION_POSITIONS[step].x,
              0.13,
              PHOTO_STATION_POSITIONS[step].z,
            ]}
          />
        )}

        {[-2.1, 0.05, 2.15].map((x) => (
          <mesh key={x} position={[x, 0.02, -1.25]}>
            <boxGeometry args={[0.035, 0.05, 2.2]} />
            <meshStandardMaterial color="#503525" roughness={0.85} />
          </mesh>
        ))}
      </group>
      <ContactShadows position={[0, 1.16, 0]} opacity={0.42} scale={9} blur={2.4} far={4} />
      {mode === "doing" &&
        (guideModeActive
          ? PHOTO_STATION_POSITIONS.map((position, stationIndex) => (
              <PhotoInteractionHighlight
                key={`photo-guide-${stationIndex}`}
                position={position}
                active
                guideMode
                onActivate={() => onGuideStationClick(stationIndex)}
              />
            ))
          : interactables.map((item) => (
              <PhotoInteractionHighlight
                key={item.id}
                position={item.position}
                active={item.id === activeTargetId}
              />
            )))}
      {mode === "doing" ? (
        <PlayerController
          bounds={PHOTO_PLAYER_BOUNDS}
          obstacles={PHOTO_PLAYER_OBSTACLES}
          spawn={PHOTO_PLAYER_SPAWN}
          eyeHeight={2.7}
          initialYaw={PHOTO_PLAYER_INITIAL_YAW}
          initialPitch={PHOTO_PLAYER_INITIAL_PITCH}
          speed={3.1}
          isMobile={isMobile}
          enabled
          moveVector={moveVectorRef}
          onUpdate={(position, lookDirection) => {
            onTargetChange(resolveActiveInteractable(interactables, position, lookDirection));
          }}
        />
      ) : (
        walkthroughActive
          ? <WalkthroughCamera stepIndex={walkthroughStep} paused={animationPaused} />
          : <LabCamera />
      )}
    </>
  );
}

const PHOTO_PAPER_METHOD = [
  "The leaf was boiled in water to kill it and stop chemical reactions.",
  "It was heated in ethanol inside a hot-water bath until chlorophyll was removed. Alcohol was kept away from a naked flame.",
  "The brittle leaf was washed in warm water to soften it.",
  "The leaf was placed on a white tile and iodine solution was added.",
] as const;

function getPhotosynthesisPaperCopy(lightExposed: boolean, complete: boolean) {
  return {
    title: "Test a Leaf for Starch",
    aim: `To determine whether a ${lightExposed ? "light-exposed" : "dark-kept"} leaf contains starch.`,
    apparatus:
      "Leaf, boiling water, test tube, ethanol, hot-water bath, forceps, warm water, white tile, iodine solution and eye protection.",
    method: PHOTO_PAPER_METHOD,
    observation: !complete
      ? "The practical has not yet reached the iodine observation."
      : lightExposed
        ? "The leaf turned blue-black when iodine was added, showing that starch was present."
        : "The leaf remained yellow-brown, showing that starch was absent from the dark control.",
    conclusion:
      complete && lightExposed
        ? "Photosynthesis produced starch in the leaf in the presence of light."
        : complete
          ? "The dark-kept leaf did not produce detectable starch, supporting the need for light in photosynthesis."
          : "A conclusion can be recorded after completing the iodine test.",
  };
}

function escapePaperHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );
}

function downloadPhotosynthesisPaperAsFile(lightExposed: boolean, complete: boolean) {
  const copy = getPhotosynthesisPaperCopy(lightExposed, complete);
  const methodItems = copy.method
    .map((item) => `<li>${escapePaperHtml(item)}</li>`)
    .join("");
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapePaperHtml(copy.title)}</title>
    <style>
      body { max-width: 760px; margin: 48px auto; padding: 0 24px; color: #172033; font: 17px/1.65 Georgia, serif; }
      h1 { text-align: center; text-transform: uppercase; font-size: 1.45rem; }
      h2 { margin: 1.6rem 0 .35rem; text-transform: uppercase; font-size: 1rem; }
      ol { padding-left: 1.5rem; }
    </style>
  </head>
  <body>
    <h1>${escapePaperHtml(copy.title)}</h1>
    <h2>Aim</h2><p>${escapePaperHtml(copy.aim)}</p>
    <h2>Apparatus</h2><p>${escapePaperHtml(copy.apparatus)}</p>
    <h2>Method</h2><ol>${methodItems}</ol>
    <h2>Observation</h2><p>${escapePaperHtml(copy.observation)}</p>
    <h2>Conclusion</h2><p>${escapePaperHtml(copy.conclusion)}</p>
  </body>
</html>`;
  const blobUrl = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = PHOTOSYNTHESIS_PAPER_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
}

function PhotosynthesisPaper({
  lightExposed,
  complete,
  onClose,
}: {
  lightExposed: boolean;
  complete: boolean;
  onClose: () => void;
}) {
  const copy = getPhotosynthesisPaperCopy(lightExposed, complete);

  return (
    <ExperimentPaperModal filename={PHOTOSYNTHESIS_PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">{copy.title}</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>{copy.aim}</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>{copy.apparatus}</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          {copy.method.map((item) => <li key={item}>{item}</li>)}
        </ol>
        <h2 className="mt-5 font-bold uppercase">Observation</h2>
        <p>{copy.observation}</p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>{copy.conclusion}</p>
      </div>
    </ExperimentPaperModal>
  );
}

export default function PhotosynthesisSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: PhotosynthesisSimProps) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lightExposed, setLightExposed] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [guideModeActive, setGuideModeActive] = useState(false);
  const [autoWalkthroughActive, setAutoWalkthroughActive] = useState(false);
  const [autoWalkthroughPaused, setAutoWalkthroughPaused] = useState(false);
  const [autoWalkthroughPhase, setAutoWalkthroughPhase] = useState<AutoWalkthroughPhase>("idle");
  const [autoWalkthroughStep, setAutoWalkthroughStep] = useState(0);
  const [autoStepStarted, setAutoStepStarted] = useState(false);
  const [autoNarrationFinished, setAutoNarrationFinished] = useState(false);
  const [autoAnimationFinished, setAutoAnimationFinished] = useState(false);
  const [activeInteractableMeta, setActiveInteractableMeta] = useState<{ id: string; label: string } | null>(null);
  const activeInteractableRef = useRef<Interactable | null>(null);
  const startRef = useRef(0);
  const progressRef = useRef(0);
  const autoRunIdRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const narrator = useExperimentNarrator();
  const { user, userProfile } = useAuth();
  const isMobileViewport = useMobileExperimentViewport();
  const complete = step >= STEP_LABELS.length;
  const burnerSoundActive = isBurnerActive(step, running, progress);
  const boilingSoundActive = getBoilIntensity(step, running, progress) >= 0.18;
  const soundEffectsPaused = autoWalkthroughActive && autoWalkthroughPaused;
  useLoopingPhotoSound(
    "/sounds/burner.mp3",
    burnerSoundActive,
    soundEffectsPaused,
    0.38,
  );
  useLoopingPhotoSound(
    "/sounds/water-boiling.mp3",
    boilingSoundActive,
    soundEffectsPaused,
    0.32,
  );
  const completedSteps = Math.min(step, PHOTO_MISSIONS.length);
  const profileName =
    [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(" ") ||
    user?.displayName ||
    "Lab Scientist";
  const profilePhoto = userProfile?.photoURL || user?.photoURL || undefined;
  const profilePoints = Math.max(0, userProfile?.totalPoints ?? 0);
  const profileStreak = Math.max(0, userProfile?.streak ?? 0);

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => {
    if (!running || complete || autoWalkthroughPaused) return;
    let frame = 0;
    const narrated =
      autoWalkthroughActive && autoWalkthroughPhase === "step";
    const duration = getStepDuration(step, narrated);
    const animate = (now: number) => {
      const next = THREE.MathUtils.clamp(
        (now - startRef.current) / duration,
        0,
        1,
      );
      progressRef.current = next;
      setProgress(next);
      if (next >= 1) {
        const coordinatedWalkthroughStage =
          autoWalkthroughActive &&
          autoWalkthroughPhase === "step" &&
          step === autoWalkthroughStep;

        setRunning(false);
        if (coordinatedWalkthroughStage) {
          // Hold the leaf and apparatus at the completed stage until its voice
          // explanation also ends. The coordinator below advances everything
          // together, so the next narration starts as the leaf moves.
          setProgress(1);
          progressRef.current = 1;
          setAutoAnimationFinished(true);
          return;
        }

        setProgress(0);
        progressRef.current = 0;
        setStep((current) => current + 1);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [
    autoWalkthroughActive,
    autoWalkthroughPaused,
    autoWalkthroughPhase,
    autoWalkthroughStep,
    complete,
    running,
    step,
  ]);

  const runStep = useCallback(() => {
    if (running || complete) return;
    startRef.current = performance.now();
    progressRef.current = 0;
    setProgress(0);
    setRunning(true);
  }, [complete, running]);

  const resetExperiment = useCallback(() => {
    setRunning(false);
    setProgress(0);
    progressRef.current = 0;
    setStep(0);
  }, []);

  const stopAutoWalkthrough = useCallback(() => {
    autoRunIdRef.current += 1;
    narrator.stop();
    setAutoWalkthroughActive(false);
    setAutoWalkthroughPaused(false);
    setAutoWalkthroughPhase("idle");
    setAutoWalkthroughStep(0);
    setAutoStepStarted(false);
    setAutoNarrationFinished(false);
    setAutoAnimationFinished(false);
    resetExperiment();
  }, [narrator.stop, resetExperiment]);

  const reset = useCallback(() => {
    if (autoWalkthroughActive) {
      stopAutoWalkthrough();
      return;
    }
    resetExperiment();
  }, [autoWalkthroughActive, resetExperiment, stopAutoWalkthrough]);

  const startAutoWalkthrough = useCallback(() => {
    const runId = autoRunIdRef.current + 1;
    autoRunIdRef.current = runId;
    narrator.stop();
    setGuideModeActive(false);
    setMode("learning");
    resetExperiment();
    setAutoWalkthroughActive(true);
    setAutoWalkthroughPaused(false);
    setAutoWalkthroughPhase("intro");
    setAutoWalkthroughStep(0);
    setAutoStepStarted(false);
    setAutoNarrationFinished(false);
    setAutoAnimationFinished(false);

    narrator.play(PHOTO_NARRATION.intro, () => {
      if (autoRunIdRef.current !== runId) return;
      setAutoWalkthroughPhase("step");
    });
  }, [narrator.play, narrator.stop, resetExperiment]);

  const toggleAutoWalkthroughPause = useCallback(() => {
    if (!autoWalkthroughActive) return;

    if (autoWalkthroughPaused) {
      if (running && autoWalkthroughPhase === "step" && step < STEP_LABELS.length) {
        const duration = getStepDuration(step, true);
        startRef.current =
          performance.now() - progressRef.current * duration;
      }
      setAutoWalkthroughPaused(false);
      narrator.resume();
    } else {
      setAutoWalkthroughPaused(true);
      narrator.pause();
    }
  }, [
    autoWalkthroughActive,
    autoWalkthroughPaused,
    autoWalkthroughPhase,
    narrator.pause,
    narrator.resume,
    running,
    step,
  ]);

  useEffect(() => {
    if (
      !autoWalkthroughActive ||
      autoWalkthroughPaused ||
      autoWalkthroughPhase !== "step" ||
      autoStepStarted ||
      step !== autoWalkthroughStep
    ) {
      return;
    }

    const runId = autoRunIdRef.current;
    setAutoStepStarted(true);
    setAutoNarrationFinished(false);
    setAutoAnimationFinished(false);
    runStep();
    narrator.play(PHOTO_NARRATION.steps[autoWalkthroughStep], () => {
      if (autoRunIdRef.current !== runId) return;
      setAutoNarrationFinished(true);
    });
  }, [
    autoStepStarted,
    autoWalkthroughActive,
    autoWalkthroughPaused,
    autoWalkthroughPhase,
    autoWalkthroughStep,
    narrator.play,
    runStep,
    step,
  ]);

  useEffect(() => {
    if (
      !autoWalkthroughActive ||
      autoWalkthroughPaused ||
      autoWalkthroughPhase !== "step" ||
      !autoStepStarted ||
      !autoNarrationFinished ||
      !autoAnimationFinished
    ) {
      return;
    }

    if (autoWalkthroughStep < STEP_LABELS.length - 1) {
      const nextStep = autoWalkthroughStep + 1;
      setProgress(0);
      progressRef.current = 0;
      setStep(nextStep);
      setAutoWalkthroughStep(nextStep);
      setAutoStepStarted(false);
      setAutoNarrationFinished(false);
      setAutoAnimationFinished(false);
      return;
    }

    const runId = autoRunIdRef.current;
    setProgress(0);
    progressRef.current = 0;
    setStep(STEP_LABELS.length);
    setAutoAnimationFinished(false);
    setAutoWalkthroughPhase("closing");
    narrator.play(PHOTO_NARRATION.complete, () => {
      if (autoRunIdRef.current !== runId) return;
      setAutoWalkthroughActive(false);
      setAutoWalkthroughPaused(false);
      setAutoWalkthroughPhase("idle");
      setAutoStepStarted(false);
      downloadPhotosynthesisPaperAsFile(lightExposed, true);
      onRequestPaper?.();
    });
  }, [
    autoAnimationFinished,
    autoNarrationFinished,
    autoStepStarted,
    autoWalkthroughActive,
    autoWalkthroughPaused,
    autoWalkthroughPhase,
    autoWalkthroughStep,
    lightExposed,
    narrator.play,
    onRequestPaper,
  ]);

  const handleModeChange = useCallback((nextMode: "learning" | "doing") => {
    if (autoWalkthroughActive) return;
    if (nextMode === "learning" && guideModeActive) {
      setGuideModeActive(false);
      narrator.stop();
    }
    setMode(nextMode);
  }, [autoWalkthroughActive, guideModeActive, narrator.stop]);

  const toggleGuideMode = useCallback(() => {
    if (autoWalkthroughActive) return;
    if (guideModeActive) {
      setGuideModeActive(false);
      narrator.stop();
      return;
    }

    setGuideModeActive(true);
    setMode("doing");
    narrator.play(PHOTO_NARRATION.tinasheIntro);
  }, [autoWalkthroughActive, guideModeActive, narrator.play, narrator.stop]);

  const handleGuideStationClick = useCallback((stationIndex: number) => {
    if (!guideModeActive || autoWalkthroughActive) return;
    const source = PHOTO_NARRATION.steps[stationIndex];
    if (source) narrator.play(source);
  }, [autoWalkthroughActive, guideModeActive, narrator.play]);

  const handleTargetChange = useCallback((target: Interactable | null) => {
    activeInteractableRef.current = target;
    setActiveInteractableMeta((current) => {
      if (!target) return current === null ? current : null;
      if (current?.id === target.id && current.label === target.label) return current;
      return { id: target.id, label: target.label };
    });
  }, []);

  const handleInteraction = useCallback(() => {
    if (autoWalkthroughActive) return;
    activeInteractableRef.current?.onActivate();
  }, [autoWalkthroughActive]);

  useEffect(() => {
    if (mode !== "doing" || isMobileViewport || autoWalkthroughActive) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.code !== "KeyE" && event.code !== "Space") || event.repeat) return;
      if (!activeInteractableRef.current) return;
      event.preventDefault();
      activeInteractableRef.current.onActivate();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [autoWalkthroughActive, isMobileViewport, mode]);

  useEffect(() => {
    if (mode === "doing") return;
    activeInteractableRef.current = null;
    setActiveInteractableMeta(null);
    moveVectorRef.current = { x: 0, y: 0 };
  }, [mode]);

  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const currentStep = Math.min(step, STEP_LABELS.length - 1);
    const labels = [
      "boil the leaf in water",
      "heat the leaf in the alcohol water bath",
      "wash the leaf in warm water",
      "add iodine to the leaf",
    ] as const;

    return [
      {
        id: complete ? "photo-repeat" : `photo-step-${currentStep}`,
        position: PHOTO_STATION_POSITIONS[currentStep],
        radius: PHOTO_INTERACTION_RADIUS,
        label: complete ? "repeat the experiment" : labels[currentStep],
        disabled: running || autoWalkthroughActive,
        onActivate: complete ? reset : runStep,
      },
    ];
  }, [autoWalkthroughActive, complete, mode, reset, runStep, running, step]);

  const observation = !complete
    ? "Complete all four stages to reveal the iodine result."
    : lightExposed
      ? "Blue-black · starch present"
      : "Yellow-brown · no starch detected";
  const walkthroughStatus =
    autoWalkthroughPhase === "intro"
      ? "Introducing the experiment"
      : autoWalkthroughPhase === "closing"
        ? "Preparing your experiment paper"
        : autoWalkthroughPhase === "step"
          ? `${STEP_LABELS[Math.min(autoWalkthroughStep, STEP_LABELS.length - 1)]}${
              autoAnimationFinished && !autoNarrationFinished ? " · finishing explanation" : ""
            }`
          : observation;

    useExperimentPerformance({reset, handScale: 3, prepare: () => { setMode('learning'); setShowTutorial(false); }, actions: STEP_LABELS.map((label, i) => ({id:'photo-'+i,label,target:[PHOTO_STATION_POSITIONS[Math.min(i,3)].x, 1.8, .05] as [number,number,number],gesture:'grip' as const,perform:runStep,done:step>i,seconds:3}))});

return (
    <div className="photo-game-shell relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      <style>{`
        @keyframes photoStationArrow {
          0%, 100% { transform: translateY(0); opacity: .72; }
          50% { transform: translateY(5px); opacity: 1; }
        }
        @keyframes photoGoalGlow {
          0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 16px 35px rgba(4,12,24,.32); }
          50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 16px 42px rgba(34,211,238,.22); }
        }
        .photo-station-arrow { animation: photoStationArrow 1.15s ease-in-out infinite; }
        .photo-goal-card { animation: photoGoalGlow 3.2s ease-in-out infinite; }
        @media (max-width: 639px) {
          .photo-goal-card {
            left: .55rem !important;
            top: 9.2rem !important;
            width: min(210px, 56vw) !important;
            padding: .6rem !important;
          }
        }
        @media (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse) {
          .photo-mobile-game-hud.experiment-mobile-topbar {
            display: block !important;
          }
          .photo-mobile-title-strip {
            display: none !important;
          }
          .photo-mobile-tools {
            position: absolute;
            right: .5rem;
            top: 3.35rem;
            margin: 0 !important;
          }
          .photo-goal-card {
            left: .55rem !important;
            top: 3.5rem !important;
            width: min(220px, 28vw) !important;
            padding: .55rem !important;
          }
          .photo-goal-card > div:last-child {
            display: none;
          }
          .photo-mobile-mission-deck.experiment-mobile-controls {
            inset-inline: .5rem !important;
            bottom: .4rem !important;
            display: grid !important;
            max-height: 132px;
            grid-template-columns: minmax(0, 1.45fr) minmax(265px, 1fr);
            grid-template-rows: auto minmax(0, 1fr);
            gap: .3rem .55rem;
            padding: .4rem !important;
            border-radius: 16px !important;
          }
          .photo-mobile-mission-deck > :first-child {
            grid-column: 1;
            grid-row: 1;
          }
          .photo-mobile-current-card {
            grid-column: 1;
            grid-row: 2;
            margin-top: 0 !important;
            padding: .35rem .5rem !important;
          }
          .photo-mobile-current-card > div:first-child > div:first-child {
            height: 38px !important;
            width: 38px !important;
            font-size: 1.15rem !important;
          }
          .photo-mobile-mission-detail,
          .photo-mobile-coach {
            display: none !important;
          }
          .photo-mobile-current-card > div:last-child {
            margin-top: .2rem !important;
          }
          .photo-mobile-path {
            grid-column: 2;
            grid-row: 1 / span 2;
            align-self: stretch;
            margin-top: 0 !important;
          }
        }
        @media (max-height: 690px) and (min-width: 640px) {
          .photo-short-height-hide { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .photo-station-arrow,
          .photo-goal-card { animation: none; }
        }
      `}</style>

      {!isMobileViewport && (
        <PhotoGameHud
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={autoWalkthroughActive}
          narrator={narrator}
          onShowMe={startAutoWalkthrough}
          guideActive={guideModeActive}
          onToggleGuide={toggleGuideMode}
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
        />
      )}
      {isMobileViewport && (
        <PhotoMobileHud
          profileName={profileName}
          profilePhoto={profilePhoto}
          points={profilePoints}
          completedSteps={completedSteps}
          mode={mode}
          modeDisabled={autoWalkthroughActive}
          onModeChange={handleModeChange}
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          narrator={narrator}
          onShowMe={startAutoWalkthrough}
          guideActive={guideModeActive}
          onToggleGuide={toggleGuideMode}
        />
      )}
      <div data-experiment-tour="photo-scene" className="relative min-w-0 flex-1">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [8.2, 5.2, 10.8], fov: 50, near: 0.08, far: 110 }}
          style={{ touchAction: "none" }}
        >
          <PhotosynthesisScene
            step={step}
            running={running}
            progress={progress}
            lightExposed={lightExposed}
            mode={mode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
            interactables={interactables}
            activeTargetId={activeInteractableMeta?.id ?? null}
            onTargetChange={handleTargetChange}
            guideModeActive={guideModeActive}
            onGuideStationClick={handleGuideStationClick}
            walkthroughActive={autoWalkthroughActive}
            walkthroughStep={autoWalkthroughStep}
            animationPaused={autoWalkthroughActive && autoWalkthroughPaused}
          />
        <FirstPersonScienceActor />
        </Canvas>
        {mode === "doing" && isMobileViewport && <MobileGtaNavigation moveVector={moveVectorRef} />}
        {mode === "learning" && (
          <PhotoGoalCard
            currentStep={step}
            observation={observation}
            running={running}
            progress={progress}
            complete={complete}
            autoWalkthroughActive={autoWalkthroughActive}
            autoWalkthroughPaused={autoWalkthroughPaused}
            walkthroughStatus={walkthroughStatus}
          />
        )}
        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-auto absolute bottom-[7.1rem] left-4 z-40">
            <PhotoConditionCard
              lightExposed={lightExposed}
              disabled={step > 0 || running || autoWalkthroughActive}
              onChange={setLightExposed}
            />
          </div>
        )}
        {mode === "learning" && !isMobileViewport && (
          <PhotoCoachDock
            currentStep={step}
            guideActive={guideModeActive}
            disabled={autoWalkthroughActive}
            onHint={onRequestHowTo}
            onGuide={toggleGuideMode}
            onDemo={startAutoWalkthrough}
          />
        )}
        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-none absolute bottom-4 right-4 z-30 rounded-full border border-cyan-100/20 bg-slate-950/72 px-4 py-2 text-[9px] font-black text-slate-100 shadow-xl backdrop-blur-xl">
            <span className="mr-1.5 text-amber-300">☝</span>
            Drag to look · scroll to zoom · follow the glowing mission
          </div>
        )}
        {mode === "doing" && !isMobileViewport && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
            {guideModeActive && (
              <div className="absolute top-[19%] rounded-full border border-violet-200/35 bg-violet-950/86 px-4 py-2 text-xs font-black text-violet-50 shadow-xl backdrop-blur">
                Click any purple station marker to hear its explanation
              </div>
            )}
            {activeInteractableMeta && (
              <div className="absolute top-[58%] rounded-full border border-amber-200/30 bg-slate-950/86 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur">
                Press <span className="text-amber-300">E</span> to {activeInteractableMeta.label}
              </div>
            )}
            <div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
              Walk to the highlighted apparatus · WASD/arrows to move · mouse to look
            </div>
          </div>
        )}
        {mode === "doing" && isMobileViewport && activeInteractableMeta && (
          <button
            type="button"
            onClick={handleInteraction}
            className="absolute bottom-[11.5rem] right-4 z-[70] flex h-[76px] w-[76px] touch-manipulation select-none flex-col items-center justify-center rounded-full border-2 border-amber-100/65 bg-gradient-to-b from-amber-300 via-orange-500 to-orange-700 px-1 text-white shadow-[0_10px_28px_rgba(0,0,0,0.48),0_0_22px_rgba(251,146,60,0.25)] active:translate-y-0.5"
            aria-label={`Use apparatus to ${activeInteractableMeta.label}`}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.12em]">Use</span>
            <span className="mt-0.5 max-w-[66px] text-center text-[8px] font-bold leading-tight">
              {activeInteractableMeta.label}
            </span>
          </button>
        )}
      </div>

      {!isMobileViewport && mode === "learning" && (
        <PhotoMissionRail
          step={step}
          running={running}
          progress={progress}
          observation={observation}
          autoWalkthroughActive={autoWalkthroughActive}
          autoWalkthroughPaused={autoWalkthroughPaused}
          onRun={complete ? reset : runStep}
          onReset={reset}
          onStartAuto={startAutoWalkthrough}
          onToggleAutoPause={toggleAutoWalkthroughPause}
          onStopAuto={stopAutoWalkthrough}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
        />
      )}

      {isMobileViewport && mode === "learning" && (
        <PhotoMobileMissionDeck
          step={step}
          running={running}
          progress={progress}
          observation={observation}
          lightExposed={lightExposed}
          conditionDisabled={step > 0 || running || autoWalkthroughActive}
          onConditionChange={setLightExposed}
          autoWalkthroughActive={autoWalkthroughActive}
          autoWalkthroughPaused={autoWalkthroughPaused}
          onRun={complete ? reset : runStep}
          onReset={reset}
          onStartAuto={startAutoWalkthrough}
          onToggleAutoPause={toggleAutoWalkthroughPause}
          onStopAuto={stopAutoWalkthrough}
        />
      )}

      {showPaper && <PhotosynthesisPaper lightExposed={lightExposed} complete={complete} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? photosynthesisHowToSteps : photosynthesisTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
