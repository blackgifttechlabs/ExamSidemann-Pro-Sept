"use client";

import { useId, useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  Lock,
  Pause,
  PlayCircle,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { labSounds } from "../../../lib/audio/labSounds";
import { ExperimentTopBar } from "./ExperimentGameChrome";
import { ExperimentHeaderPortal } from "./ExperimentHeaderSlots";

/**
 * Shared "game" chrome for the O Level Combined Science experiments.
 *
 * This reproduces the immersive interface used by the Photosynthesis practical
 * (a full-screen dark lab shell with a floating profile HUD, an experiment goal
 * card, a mission rail and Learn / Play modes) so every experiment shares the
 * same look and feel. Each simulation supplies its own 3D scene, control panel
 * content and accent colour; the chrome below stays identical.
 */

export interface ExperimentAccent {
  /** Solid brand colour (used for glows, primary buttons, active steps). */
  base: string;
  /** Lighter tint used for text on the dark shell. */
  text: string;
  /** Translucent fill for cards. */
  soft: string;
  /** Border colour. */
  ring: string;
  /** Outer glow colour (rgba). */
  glow: string;
  /** Gradient stops for the rail banner. */
  bannerFrom: string;
  bannerTo: string;
}

export const EXPERIMENT_ACCENTS = {
  rose: {
    base: "#f43f5e",
    text: "#fecdd3",
    soft: "rgba(244,63,94,0.16)",
    ring: "rgba(251,113,133,0.4)",
    glow: "rgba(244,63,94,0.35)",
    bannerFrom: "#9f1239",
    bannerTo: "#4c0519",
  },
  fuchsia: {
    base: "#d946ef",
    text: "#f5d0fe",
    soft: "rgba(217,70,239,0.16)",
    ring: "rgba(232,121,249,0.4)",
    glow: "rgba(217,70,239,0.35)",
    bannerFrom: "#86198f",
    bannerTo: "#3b0764",
  },
  amber: {
    base: "#f59e0b",
    text: "#fde68a",
    soft: "rgba(245,158,11,0.16)",
    ring: "rgba(251,191,36,0.4)",
    glow: "rgba(245,158,11,0.35)",
    bannerFrom: "#92400e",
    bannerTo: "#451a03",
  },
  sky: {
    base: "#0ea5e9",
    text: "#bae6fd",
    soft: "rgba(14,165,233,0.16)",
    ring: "rgba(56,189,248,0.4)",
    glow: "rgba(14,165,233,0.35)",
    bannerFrom: "#075985",
    bannerTo: "#082f49",
  },
  emerald: {
    base: "#10b981",
    text: "#a7f3d0",
    soft: "rgba(16,185,129,0.16)",
    ring: "rgba(52,211,153,0.4)",
    glow: "rgba(16,185,129,0.35)",
    bannerFrom: "#065f46",
    bannerTo: "#022c22",
  },
  violet: {
    base: "#8b5cf6",
    text: "#ddd6fe",
    soft: "rgba(139,92,246,0.16)",
    ring: "rgba(167,139,250,0.4)",
    glow: "rgba(139,92,246,0.35)",
    bannerFrom: "#5b21b6",
    bannerTo: "#2e1065",
  },
  cyan: {
    base: "#06b6d4",
    text: "#a5f3fc",
    soft: "rgba(6,182,212,0.16)",
    ring: "rgba(34,211,238,0.4)",
    glow: "rgba(6,182,212,0.35)",
    bannerFrom: "#155e75",
    bannerTo: "#083344",
  },
  orange: {
    base: "#f97316",
    text: "#fed7aa",
    soft: "rgba(249,115,22,0.16)",
    ring: "rgba(251,146,60,0.4)",
    glow: "rgba(249,115,22,0.35)",
    bannerFrom: "#9a3412",
    bannerTo: "#431407",
  },
  indigo: {
    base: "#6366f1",
    text: "#c7d2fe",
    soft: "rgba(99,102,241,0.16)",
    ring: "rgba(129,140,248,0.4)",
    glow: "rgba(99,102,241,0.35)",
    bannerFrom: "#3730a3",
    bannerTo: "#1e1b4b",
  },
  lime: {
    base: "#84cc16",
    text: "#d9f99d",
    soft: "rgba(132,204,22,0.16)",
    ring: "rgba(163,230,53,0.4)",
    glow: "rgba(132,204,22,0.35)",
    bannerFrom: "#3f6212",
    bannerTo: "#1a2e05",
  },
  teal: {
    base: "#14b8a6",
    text: "#99f6e4",
    soft: "rgba(20,184,166,0.16)",
    ring: "rgba(45,212,191,0.4)",
    glow: "rgba(20,184,166,0.35)",
    bannerFrom: "#115e59",
    bannerTo: "#042f2e",
  },
  red: {
    base: "#ef4444",
    text: "#fecaca",
    soft: "rgba(239,68,68,0.16)",
    ring: "rgba(248,113,113,0.4)",
    glow: "rgba(239,68,68,0.35)",
    bannerFrom: "#991b1b",
    bannerTo: "#450a0a",
  },
} as const satisfies Record<string, ExperimentAccent>;

export interface GameMission {
  short: string;
  title: string;
  detail: string;
  symbol: string;
}

export function useLabProfile() {
  const { user, userProfile } = useAuth();
  const profileName =
    [userProfile?.firstName, userProfile?.lastName].filter(Boolean).join(" ") ||
    user?.displayName ||
    "Lab Scientist";
  const profilePhoto = userProfile?.photoURL || user?.photoURL || undefined;
  const points = Math.max(0, userProfile?.totalPoints ?? 0);
  const streak = Math.max(0, userProfile?.streak ?? 0);
  const level = Math.max(1, Math.floor(points / 500) + 1);
  const levelProgress = Math.min(100, ((points % 500) / 500) * 100);
  const initials = profileName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return { profileName, profilePhoto, points, streak, level, levelProgress, initials };
}

export function GameModeToggle({
  mode,
  disabled = false,
  onChange,
  compact = false,
}: {
  mode: "learning" | "doing";
  disabled?: boolean;
  onChange: (mode: "learning" | "doing") => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`pointer-events-auto flex shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#090b25]/92 font-black uppercase tracking-wide shadow-xl backdrop-blur-xl ${
        compact ? "text-[8px]" : "text-[9px]"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          labSounds.play("uiToggle", { volume: 0.5 });
          onChange("learning");
        }}
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
        onClick={() => {
          labSounds.play("uiToggle", { volume: 0.5 });
          onChange("doing");
        }}
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

/**
 * Learning · Doing toggle for simulations that own the mode themselves while the
 * page above them draws the header. It lands in the header's actions slot, and
 * only floats over the scene when there is no header to portal into.
 */
export function HeaderModeToggle({
  mode,
  onChange,
  disabled = false,
}: {
  mode: "learning" | "doing";
  onChange: (mode: "learning" | "doing") => void;
  disabled?: boolean;
}) {
  return (
    <ExperimentHeaderPortal name="actions" fallbackClassName="absolute right-3 top-3 z-40 hidden sm:flex">
      <GameModeToggle mode={mode} onChange={onChange} disabled={disabled} />
    </ExperimentHeaderPortal>
  );
}

/**
 * The in-scene experiment header. It is only a thin configuration of the shared
 * `ExperimentTopBar`: the experiment's own title on the left, the Tinashe
 * narration controls in the middle (portalled in by the simulation), and the
 * Show me / Learning · Doing controls on the right.
 */
export function CombinedScienceHud({
  title,
  subtitle,
  symbol,
  accent,
  mode,
  onModeChange,
  modeDisabled = false,
  onBack,
  backLabel = "Back to Combined Science experiments",
  onRequestPaper,
  onRequestHowTo,
  demoActive = false,
  onDemo,
}: {
  title: string;
  /** Short line under the title — usually what the experiment measures. */
  subtitle?: string;
  symbol: ReactNode;
  accent: ExperimentAccent;
  mode: "learning" | "doing";
  onModeChange: (mode: "learning" | "doing") => void;
  modeDisabled?: boolean;
  onBack?: () => void;
  /** Screen-reader label for the back button — override outside Combined Science. */
  backLabel?: string;
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  /** Kept for call sites that still pass a badge count; no longer displayed. */
  badges?: number;
  demoActive?: boolean;
  onDemo?: () => void;
}) {
  return (
    <ExperimentTopBar
      variant="overlay"
      title={title}
      subtitle={subtitle}
      symbol={symbol}
      backLabel={backLabel}
      onBack={onBack}
      onRequestPaper={onRequestPaper}
      onRequestHowTo={onRequestHowTo}
      accentBase={accent.base}
      accentRing={accent.ring}
      accentSoft={accent.soft}
      accentText={accent.text}
      narration={
        onDemo && (
          <button
            type="button"
            onClick={onDemo}
            disabled={modeDisabled && !demoActive}
            aria-label={demoActive ? "Stop the guided demonstration" : "Show me this experiment"}
            className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[10px] font-black uppercase tracking-wide shadow-xl backdrop-blur-xl transition disabled:cursor-not-allowed disabled:opacity-40 ${
              demoActive
                ? "border-white/40 text-white"
                : "border-white/15 bg-slate-950/82 text-slate-200 hover:text-white"
            }`}
            style={demoActive ? { background: accent.base } : undefined}
          >
            {demoActive ? <Pause size={14} /> : <Sparkles size={14} />}
            {demoActive ? "Stop" : "Show me"}
          </button>
        )
      }
      actions={<GameModeToggle mode={mode} disabled={modeDisabled} onChange={onModeChange} />}
    />
  );
}

export function CombinedScienceGoalCard({
  accent,
  label = "Experiment goal",
  emoji = "🎯",
  cornerEmoji,
  status,
  running = false,
  progress = 0,
  complete = false,
}: {
  accent: ExperimentAccent;
  label?: string;
  emoji?: string;
  cornerEmoji?: string;
  status: string;
  running?: boolean;
  progress?: number;
  complete?: boolean;
}) {
  return (
    <div
      data-experiment-tour="goal-card"
      className="pointer-events-none absolute left-4 top-[4.85rem] z-30 w-[min(290px,36vw)] overflow-hidden rounded-2xl border p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_16px_35px_rgba(4,12,24,.32)] backdrop-blur-xl"
      style={{ borderColor: accent.ring, background: `linear-gradient(145deg, ${accent.soft}, rgba(9,14,26,.72))` }}
    >
      <div
        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em]"
        style={{ color: accent.text }}
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-sm">{emoji}</span>
        {label}
      </div>
      <div className={`mt-2 text-xs font-bold leading-relaxed ${complete ? "text-emerald-100" : "text-white"}`}>
        {status}
      </div>
      {running && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-950/45">
          <div
            className="h-full rounded-full transition-[width]"
            style={{ width: `${Math.max(3, progress * 100)}%`, background: accent.base }}
          />
        </div>
      )}
      {cornerEmoji && (
        <div className="absolute bottom-1 right-2 text-2xl drop-shadow-lg" aria-hidden="true">
          {cornerEmoji}
        </div>
      )}
    </div>
  );
}

export function MissionPath({
  missions,
  step,
  progress,
  accent,
  compact = false,
}: {
  missions: GameMission[];
  step: number;
  progress: number;
  accent: ExperimentAccent;
  compact?: boolean;
}) {
  const complete = step >= missions.length;

  return (
    <div data-experiment-tour="procedure" className="w-full">
      <div className={`flex items-start ${compact ? "gap-1" : "gap-1.5"}`}>
        {missions.map((mission, index) => {
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
                        ? "border-white/70"
                        : "border-white/12 bg-white/[0.035] grayscale"
                  }`}
                  style={active ? { background: accent.soft, boxShadow: `0 0 18px ${accent.glow}`, borderColor: accent.ring } : undefined}
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
                    <svg
                      className="pointer-events-none absolute -inset-1 h-[calc(100%+8px)] w-[calc(100%+8px)] -rotate-90"
                      viewBox="0 0 44 44"
                      aria-hidden="true"
                    >
                      <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
                      <circle
                        cx="22"
                        cy="22"
                        r="20"
                        fill="none"
                        stroke={accent.base}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${progress * 125.66} 125.66`}
                      />
                    </svg>
                  )}
                </div>
                <div
                  className={`mt-1 truncate font-black ${compact ? "text-[7px]" : "text-[8px]"} ${
                    active ? "" : done ? "text-emerald-200" : "text-slate-500"
                  }`}
                  style={active ? { color: accent.text } : undefined}
                >
                  {index + 1} {mission.short}
                </div>
              </div>
              {index < missions.length - 1 && (
                <div
                  className={`mt-4 shrink-0 border-t border-dashed ${compact ? "w-3" : "w-5"} ${
                    index < step ? "border-emerald-300/70" : "border-slate-600"
                  }`}
                />
              )}
            </div>
          );
        })}
        <div className="mx-0.5 mt-4 w-3 shrink-0 border-t border-dashed border-slate-600" />
        <div className="min-w-0 flex-1 text-center">
          <div
            className={`mx-auto grid place-items-center rounded-full border ${compact ? "h-8 w-8" : "h-10 w-10"} ${
              complete ? "border-white/70 text-white" : "border-white/12 bg-white/[0.035] text-slate-500"
            }`}
            style={complete ? { background: accent.soft, boxShadow: `0 0 18px ${accent.glow}` } : undefined}
          >
            <Trophy size={compact ? 14 : 18} />
          </div>
          <div
            className={`mt-1 truncate font-black ${compact ? "text-[7px]" : "text-[8px]"} ${
              complete ? "" : "text-slate-500"
            }`}
            style={complete ? { color: accent.text } : undefined}
          >
            Result
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * One labelled, collapsible container in the control rail.
 *
 * Everything in the rail lives in one of these so the panel reads as a short
 * list of named groups rather than a single long column of controls. The raised
 * edge highlight and drop shadow give each group the same physical "tray" look
 * as the apparatus in the scene.
 */
export function ExperimentControlGroup({
  accent,
  label,
  hint,
  icon,
  value,
  defaultOpen = true,
  collapsible = true,
  tourId,
  children,
}: {
  accent: ExperimentAccent;
  /** Short, plain-English name of the group, e.g. "Apparatus setup". */
  label: string;
  /** One line saying what the group is for. */
  hint?: string;
  /** Emoji or icon shown in the group's chip. */
  icon?: ReactNode;
  /** Current value summarised on the header, visible while collapsed. */
  value?: ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  /** Value for `data-experiment-tour`, so the tutorial can point at the group. */
  tourId?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = collapsible ? open : true;
  const bodyId = useId();

  const header = (
    <>
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-sm"
        style={{ borderColor: accent.ring, background: accent.soft }}
        aria-hidden="true"
      >
        {icon ?? "🎛️"}
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: accent.text }}>
          {label}
        </span>
        {hint && <span className="mt-0.5 block truncate text-[9px] font-semibold text-slate-400">{hint}</span>}
      </span>
      {value !== undefined && value !== null && value !== "" && (
        <span className="shrink-0 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[9px] font-black text-slate-200">
          {value}
        </span>
      )}
    </>
  );

  return (
    <section
      data-experiment-tour={tourId}
      className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_10px_22px_rgba(2,4,14,.42)]"
    >
      {collapsible ? (
        <button
          type="button"
          onClick={() => {
            labSounds.play("panelOpen", { volume: 0.35 });
            setOpen((current) => !current);
          }}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          className="flex w-full items-center gap-2 px-2.5 py-2 transition hover:bg-white/[0.04]"
        >
          {header}
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <div className="flex w-full items-center gap-2 px-2.5 py-2">{header}</div>
      )}

      {isOpen && (
        <div id={bodyId} className="space-y-2.5 border-t border-white/[0.07] bg-black/20 p-2.5">
          {children}
        </div>
      )}
    </section>
  );
}

/** A labelled group of controls the experiment wants in the rail. */
export interface RailSection {
  id: string;
  /** Group name shown on the container. */
  label: string;
  /** One line saying what the group is for. */
  hint?: string;
  /** Emoji shown in the group chip. */
  icon?: ReactNode;
  /** Current setting, summarised on the header so it reads while collapsed. */
  value?: ReactNode;
  content: ReactNode;
  defaultOpen?: boolean;
  /** Not relevant to the apparatus currently set up — left out of the rail. */
  disabled?: boolean;
}

/**
 * The right-hand mission rail used on desktop.
 *
 * The experiment supplies its controls as `sections` — named groups that each
 * become their own labelled, collapsible container — and the rail frames them
 * with the mission banner, the step path, the observation readout and the
 * primary Run / Reset / Demo actions. `children` is still accepted for controls
 * that have no natural grouping; they land in one "Apparatus controls" group.
 */
export function CombinedScienceObjectiveRail({
  accent,
  title,
  tagline,
  missions,
  step,
  running,
  progress,
  complete,
  primaryLabel,
  primaryEmoji = "▶",
  onPrimary,
  primaryDisabled = false,
  onReset,
  onDemo,
  demoActive = false,
  observation,
  sections,
  controlsLabel = "Apparatus controls",
  controlsHint = "Set the apparatus up before you run it",
  children,
}: {
  accent: ExperimentAccent;
  title: string;
  tagline: string;
  missions: GameMission[];
  step: number;
  running: boolean;
  progress: number;
  complete: boolean;
  primaryLabel: string;
  primaryEmoji?: ReactNode;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  onReset: () => void;
  onDemo?: () => void;
  demoActive?: boolean;
  observation: string;
  sections?: RailSection[];
  /** Label for the group that wraps loose `children`. */
  controlsLabel?: string;
  controlsHint?: string;
  children?: ReactNode;
}) {
  const currentIndex = Math.min(step, missions.length - 1);
  const mission = missions[currentIndex];
  const totalProgress = complete
    ? 100
    : Math.round(((step + (running ? progress : 0)) / missions.length) * 100);
  const filledStars = Math.min(missions.length, step);

  return (
    <aside
      className="experiment-desktop-panel hidden h-full min-h-0 w-[clamp(320px,28vw,392px)] shrink-0 flex-col overflow-y-auto border-l border-white/10 px-2.5 pb-3 pt-[4.55rem] shadow-[-12px_0_35px_rgba(2,3,17,.28)] sm:flex"
      style={{ background: "linear-gradient(180deg,#0b0b1e,#0b0f22 52%,#080b1a)" }}
    >
      <section
        className="relative overflow-hidden rounded-2xl border p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.22),0_10px_25px_rgba(6,6,20,.45)]"
        style={{
          borderColor: accent.ring,
          background: `radial-gradient(circle at 84% 18%, ${accent.glow}, transparent 30%), linear-gradient(145deg, ${accent.bannerFrom}, ${accent.bannerTo})`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-white/80">Mission control</div>
          <div className="flex gap-0.5">
            {missions.map((_, index) => (
              <Star
                key={index}
                size={13}
                className={index < filledStars ? "fill-amber-300 text-amber-300" : "text-white/25"}
              />
            ))}
          </div>
        </div>
        <div className="mt-1 text-lg font-black leading-tight text-white">{title}</div>
        <div className="text-[10px] font-bold text-white/70">{tagline}</div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/35">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-white transition-[width]"
            style={{ width: `${Math.max(4, totalProgress)}%` }}
          />
        </div>
        <div className="mt-1 text-right text-[9px] font-black text-white/80">{totalProgress}% complete</div>
      </section>

      <div className="mt-3 space-y-2.5">
        <ExperimentControlGroup
          accent={accent}
          label="Steps"
          hint={complete ? "All steps done" : `Step ${Math.min(step + 1, missions.length)} of ${missions.length}`}
          icon="🗺️"
          value={`${Math.min(step, missions.length)}/${missions.length}`}
          tourId="procedure"
        >
          <MissionPath missions={missions} step={step} progress={running ? progress : 0} accent={accent} />
          <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
            <div className="text-[8px] font-black uppercase tracking-[0.16em]" style={{ color: accent.text }}>
              {complete ? "Result" : `Now · ${mission.short}`}
            </div>
            <div className="mt-1 text-[11px] font-bold leading-snug text-slate-200">
              {complete ? observation : mission.detail}
            </div>
          </div>
        </ExperimentControlGroup>

        {sections?.filter((section) => !section.disabled).map((section) => (
          <ExperimentControlGroup
            key={section.id}
            accent={accent}
            label={section.label}
            hint={section.hint}
            icon={section.icon}
            value={section.value}
            defaultOpen={section.defaultOpen ?? true}
            tourId={section.id}
          >
            {section.content}
          </ExperimentControlGroup>
        ))}

        {children && (
          <ExperimentControlGroup accent={accent} label={controlsLabel} hint={controlsHint} icon="🎛️" tourId="controls">
            {children}
          </ExperimentControlGroup>
        )}

        <ExperimentControlGroup
          accent={accent}
          label="Observation"
          hint="What you should be seeing right now"
          icon="🔍"
          tourId="observation"
        >
          <div className="text-xs font-bold leading-snug text-slate-100">{observation}</div>
        </ExperimentControlGroup>
      </div>

      <div className="mt-auto space-y-2 pt-3">
        <button
          type="button"
          onClick={() => {
            labSounds.play("uiClick", { volume: 0.55 });
            onPrimary();
          }}
          disabled={primaryDisabled}
          className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black text-white shadow-lg transition active:translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
          style={{ background: accent.base, boxShadow: `0 10px 24px ${accent.glow}` }}
        >
          <span aria-hidden="true">{primaryEmoji}</span>
          {primaryLabel}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              labSounds.play("uiClick", { volume: 0.4, rate: 0.85 });
              onReset();
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
          >
            <RotateCcw size={14} /> Reset
          </button>
          {onDemo ? (
            <button
              type="button"
              onClick={() => {
                labSounds.play("uiClick", { volume: 0.45 });
                onDemo();
              }}
              className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition ${
                demoActive ? "border-white/40 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
              style={demoActive ? { background: accent.base } : undefined}
            >
              {demoActive ? <Pause size={14} /> : <PlayCircle size={14} />}
              {demoActive ? "Stop" : "Demo"}
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </aside>
  );
}
