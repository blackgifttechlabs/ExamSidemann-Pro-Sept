"use client";

import { useState, type ReactNode } from "react";
import { CircleHelp, FileText, Volume2, VolumeX } from "lucide-react";
import { labSounds } from "../../../lib/audio/labSounds";
import { useExperimentHeaderSlotRef } from "./ExperimentHeaderSlots";

/**
 * Shared desktop chrome for the full-screen science experiments.
 *
 * The bar is the same on every practical:
 *
 *   [ ← ]  🧪 Experiment title / subtitle  |  narration controls  |  Learning · Doing  ? 📄
 *
 * The middle is a slot: `ExperimentHeaderPortal` (see `ExperimentHeaderSlots`)
 * drops the Tinashe "Show me" controls — the walkthrough pill, Pause, Stop, the
 * Explain menu — into it from wherever the simulation renders them.
 *
 * Keep `experiment-desktop-header` on the root: App.tsx uses it to swap the
 * desktop and mobile interfaces on short, touch-first landscape viewports.
 * The theme styles below are intentionally global so each simulation can opt
 * its existing `experiment-desktop-panel` into the same violet lab surface by
 * adding `experiment-violet-panel`, without moving any simulation state.
 */

export interface ExperimentTopBarProps {
  title: string;
  subtitle?: string;
  symbol?: ReactNode;
  backLabel?: string;
  onBack?: () => void;
  onRequestHowTo?: () => void;
  onRequestPaper?: () => void;
  paperTourAttributes?: Record<`data-${string}`, string>;
  /** Accent colour for the title chip — defaults to the violet lab theme. */
  accentBase?: string;
  accentRing?: string;
  accentSoft?: string;
  accentText?: string;
  /** Extra controls placed just before the How-to / Paper buttons. */
  actions?: ReactNode;
  /**
   * Narration controls rendered directly in the middle of the bar. Simulations
   * that render elsewhere in the tree should use `ExperimentHeaderPortal`
   * instead — this is only for headers that already own the controls.
   */
  narration?: ReactNode;
  /**
   * `static` sits in the page flow above the canvas (page wrappers);
   * `overlay` floats over a full-bleed scene (simulations with their own HUD).
   */
  variant?: "static" | "overlay";
}

export function ExperimentTopBar({
  title,
  subtitle,
  symbol = "🧪",
  backLabel = "Back to experiments",
  onBack,
  onRequestHowTo,
  onRequestPaper,
  paperTourAttributes,
  accentBase = "#8b5cf6",
  accentRing = "rgba(167,139,250,0.4)",
  accentSoft = "rgba(139,92,246,0.16)",
  accentText = "#ddd6fe",
  actions,
  narration,
  variant = "static",
}: ExperimentTopBarProps) {
  const narrationSlotRef = useExperimentHeaderSlotRef("narration");
  const actionsSlotRef = useExperimentHeaderSlotRef("actions");

  return (
    <>
      <style>{`
        .experiment-desktop-panel.experiment-violet-panel {
          border-color: rgba(196, 181, 253, 0.18) !important;
          background:
            radial-gradient(circle at 88% 4%, rgba(217, 70, 239, 0.15), transparent 29%),
            radial-gradient(circle at 8% 96%, rgba(34, 211, 238, 0.09), transparent 32%),
            linear-gradient(180deg, rgba(11, 11, 38, 0.985), rgba(11, 16, 39, 0.985) 52%, rgba(8, 12, 32, 0.99)) !important;
          box-shadow:
            inset 1px 0 0 rgba(255, 255, 255, 0.045),
            -12px 0 35px rgba(2, 3, 17, 0.3) !important;
        }
      `}</style>

      <header
        className={`experiment-desktop-header hidden h-16 items-center gap-3 border-b border-violet-300/15 bg-[linear-gradient(90deg,rgba(8,8,35,.98),rgba(11,10,42,.96),rgba(7,9,30,.98))] px-3 text-white shadow-[0_12px_30px_rgba(3,3,20,.32)] backdrop-blur-2xl sm:flex lg:px-4 ${
          variant === "overlay"
            ? "pointer-events-none absolute inset-x-0 top-0 z-[90]"
            : "relative z-[90] shrink-0"
        }`}
      >
        {/* Left — back, and the experiment's own identity (no player profile). */}
        <div
          className={`flex min-w-0 shrink items-center gap-2.5 lg:gap-3 ${
            variant === "overlay" ? "pointer-events-auto" : ""
          }`}
        >
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label={backLabel}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.045] text-slate-300 shadow-lg transition hover:border-violet-200/35 hover:bg-white/10 hover:text-white"
            >
              ←
            </button>
          )}

          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border text-lg shadow-lg"
            style={{ borderColor: accentRing, background: accentSoft, boxShadow: `0 0 18px ${accentSoft}` }}
            aria-hidden="true"
          >
            {symbol}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[13px] font-black leading-tight text-white lg:text-sm">{title}</h1>
            {subtitle && (
              <p
                className="mt-0.5 truncate text-[8px] font-bold uppercase tracking-[0.14em]"
                style={{ color: accentText }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Middle — the Tinashe narration controls land here. */}
        <div
          ref={narrationSlotRef}
          data-experiment-header-slot="narration"
          className={`flex min-w-0 flex-1 flex-wrap items-center justify-center gap-2 ${
            variant === "overlay" ? "pointer-events-auto" : ""
          }`}
        >
          {narration}
        </div>

        {/* Right — mode toggle (passed in as `actions`) and the reference buttons. */}
        <div
          className={`flex shrink-0 items-center gap-2 ${variant === "overlay" ? "pointer-events-auto" : ""}`}
        >
          {actions}

          {/* Simulations that own their own Learning · Doing toggle land here. */}
          <div
            ref={actionsSlotRef}
            data-experiment-header-slot="actions"
            className="flex shrink-0 items-center gap-2 empty:hidden"
          />

          <LabSoundButton />

          {onRequestHowTo && (
            <button
              type="button"
              onClick={onRequestHowTo}
              data-experiment-tour="how-to"
              aria-label={`Open ${title} experiment guide`}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-violet-300/15 bg-white/[0.045] px-2.5 text-cyan-200 shadow-lg transition hover:border-cyan-200/35 hover:bg-white/10 hover:text-white xl:px-3"
            >
              <CircleHelp size={16} />
              <span className="hidden text-[9px] font-black uppercase tracking-wide xl:inline">How to</span>
            </button>
          )}

          {onRequestPaper && (
            <div {...paperTourAttributes} data-experiment-tour="paper">
              <button
                type="button"
                onClick={onRequestPaper}
                aria-label={`Open ${title} experiment paper`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-violet-300/15 bg-white/[0.045] px-2.5 text-emerald-200 shadow-lg transition hover:border-emerald-200/35 hover:bg-white/10 hover:text-white xl:px-3"
              >
                <FileText size={16} />
                <span className="hidden text-[9px] font-black uppercase tracking-wide xl:inline">Paper</span>
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

/** Mutes every lab sound effect. The narrator's voice is unaffected. */
export function LabSoundButton() {
  const [muted, setMuted] = useState(labSounds.isMuted());

  return (
    <button
      type="button"
      onClick={() => {
        const next = !muted;
        labSounds.setMuted(next);
        setMuted(next);
        if (!next) labSounds.play("uiToggle", { volume: 0.5 });
      }}
      aria-pressed={muted}
      aria-label={muted ? "Turn lab sounds on" : "Turn lab sounds off"}
      title={muted ? "Lab sounds off" : "Lab sounds on"}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-300/15 bg-white/[0.045] shadow-lg transition hover:bg-white/10 hover:text-white ${
        muted ? "text-slate-500" : "text-violet-200"
      }`}
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}

interface ExperimentGameHeaderProps {
  title: string;
  subtitle?: string;
  symbol?: ReactNode;
  backLabel?: string;
  paperTourAttributes?: Record<`data-${string}`, string>;
  onBack: () => void;
  onRequestHowTo: () => void;
  onRequestPaper: () => void;
  /** Extra controls (usually the Learning / Doing toggle) shown on the right. */
  actions?: ReactNode;
}

/** Page-level header for experiments that do not draw their own in-scene HUD. */
export function ExperimentGameHeader({
  title,
  subtitle,
  symbol = "🧪",
  backLabel = "Back to experiments",
  paperTourAttributes,
  onBack,
  onRequestHowTo,
  onRequestPaper,
  actions,
}: ExperimentGameHeaderProps) {
  return (
    <ExperimentTopBar
      title={title}
      subtitle={subtitle}
      symbol={symbol}
      backLabel={backLabel}
      paperTourAttributes={paperTourAttributes}
      onBack={onBack}
      onRequestHowTo={onRequestHowTo}
      onRequestPaper={onRequestPaper}
      actions={actions}
      variant="static"
    />
  );
}
