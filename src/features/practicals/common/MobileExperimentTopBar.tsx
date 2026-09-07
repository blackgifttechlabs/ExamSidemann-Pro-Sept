"use client";

import { CircleHelp, FileText } from "lucide-react";
import { useExperimentHeaderSlotRef } from "./ExperimentHeaderSlots";

interface MobileExperimentTopBarProps {
  onBack?: () => void;
  onRequestHowTo?: () => void;
  onRequestPaper?: () => void;
  mode?: "learning" | "doing";
  onModeChange?: (mode: "learning" | "doing") => void;
  contextLabel?: string;
}

export function MobileExperimentTopBar({
  onBack,
  onRequestHowTo,
  onRequestPaper,
  mode,
  onModeChange,
  contextLabel,
}: MobileExperimentTopBarProps) {
  const narrationSlotRef = useExperimentHeaderSlotRef("narration");
  const actionsSlotRef = useExperimentHeaderSlotRef("actions");
  const ownsModeToggle = Boolean(mode && onModeChange);

  return (
    <div className="experiment-mobile-topbar pointer-events-none absolute inset-x-0 top-0 z-[70] flex h-14 items-center justify-between gap-2 border-b border-violet-300/15 bg-[linear-gradient(90deg,rgba(8,8,36,.98),rgba(16,10,50,.97),rgba(7,9,30,.98))] px-2 shadow-[0_12px_30px_rgba(3,3,20,.36)] backdrop-blur-xl sm:hidden">
      <div className="pointer-events-auto flex min-w-0 items-center gap-1.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-200/20 bg-white/[0.055] text-white shadow-xl transition hover:bg-white/10"
          >
            ←
          </button>
        )}
        {onRequestHowTo && (
          <button
            type="button"
            onClick={onRequestHowTo}
            data-experiment-tour="how-to"
            aria-label="Open experiment guide"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-200/20 bg-white/[0.055] text-cyan-200 shadow-xl transition hover:bg-white/10 hover:text-white"
          >
            <CircleHelp size={16} />
          </button>
        )}
        {onRequestPaper && (
          <div data-experiment-tour="paper">
            <button
              type="button"
              onClick={onRequestPaper}
              aria-label="Open experiment paper"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-violet-200/20 bg-white/[0.055] text-emerald-200 shadow-xl transition hover:bg-white/10 hover:text-white"
            >
              <FileText size={16} />
            </button>
          </div>
        )}
      </div>

      {/* The Tinashe narration controls are portalled in here on phones. */}
      <div
        ref={narrationSlotRef}
        data-experiment-header-slot="narration"
        className="pointer-events-auto flex min-w-0 flex-1 items-center justify-center gap-1.5 overflow-visible"
      />

      {!ownsModeToggle && (
        <div
          ref={actionsSlotRef}
          data-experiment-header-slot="actions"
          className="pointer-events-auto flex shrink-0 items-center gap-1.5 empty:hidden"
        />
      )}

      {mode && onModeChange ? (
        <div className="pointer-events-auto flex shrink-0 overflow-hidden rounded-full border border-violet-200/20 bg-[#090b25]/92 text-[9px] font-black uppercase tracking-wide shadow-xl">
          <button
            type="button"
            onClick={() => onModeChange("learning")}
            className={`px-2.5 py-1.5 transition-colors ${mode === "learning" ? "bg-gradient-to-b from-cyan-300 to-sky-500 text-slate-950" : "text-slate-300"}`}
          >
            Learning
          </button>
          <button
            type="button"
            onClick={() => onModeChange("doing")}
            className={`px-2.5 py-1.5 transition-colors ${mode === "doing" ? "bg-gradient-to-b from-amber-300 to-orange-500 text-slate-950" : "text-slate-300"}`}
          >
            Doing
          </button>
        </div>
      ) : contextLabel ? (
        <div className="max-w-[42vw] truncate rounded-full border border-violet-200/20 bg-white/[0.055] px-3 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-violet-100 shadow-xl">
          {contextLabel}
        </div>
      ) : null}
    </div>
  );
}
