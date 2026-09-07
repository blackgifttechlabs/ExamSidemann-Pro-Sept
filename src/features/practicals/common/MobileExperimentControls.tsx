import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export interface MobileExperimentPanel {
  id: string;
  label: string;
  value?: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface MobileExperimentAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "orange" | "green" | "blue" | "red" | "dark";
}

interface MobileExperimentControlsProps {
  panels?: MobileExperimentPanel[];
  actions?: MobileExperimentAction[];
  readouts?: ReactNode;
  initialPanelId?: string | null;
  panelCloseRequestKey?: number;
  variant?: "game" | "minimal";
  columns?: number;
}

const actionToneClass = {
  orange: "from-[#fff36a] via-[#ffb21d] to-[#ef5b11] text-white shadow-orange-950/45",
  green: "from-[#caff5c] via-[#39d63e] to-[#078747] text-white shadow-emerald-950/45",
  blue: "from-[#8df9ff] via-[#13bed8] to-[#07659b] text-white shadow-cyan-950/45",
  red: "from-[#ffb46b] via-[#ff493d] to-[#bb1634] text-white shadow-red-950/45",
  dark: "from-[#6b7280] via-[#334155] to-[#111827] text-white shadow-slate-950/45",
};

const minimalActionToneClass = {
  orange: "border-orange-300/30 bg-orange-400 text-slate-950",
  green: "border-emerald-300/30 bg-emerald-400 text-slate-950",
  blue: "border-cyan-300/30 bg-cyan-400 text-slate-950",
  red: "border-rose-300/30 bg-rose-400 text-slate-950",
  dark: "border-white/10 bg-white/[0.06] text-slate-200",
};

function GameButton({
  children,
  onClick,
  disabled,
  active,
  tone = "orange",
  tourId,
  minimal = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  tone?: MobileExperimentAction["tone"];
  tourId?: string;
  minimal?: boolean;
}) {
  return (
    <button
      type="button"
      data-mobile-experiment-action={tourId}
      onClick={onClick}
      disabled={disabled}
      className={minimal
        ? `relative min-h-10 min-w-0 overflow-hidden rounded-xl border px-2 text-[9px] font-black uppercase tracking-wide shadow-lg transition-all active:translate-y-0.5 disabled:opacity-35 ${minimalActionToneClass[tone]} ${active ? "ring-2 ring-cyan-300/70" : ""}`
        : `mobile-game-button relative min-h-9 min-w-0 overflow-hidden rounded-full border border-white/45 bg-gradient-to-b px-2 text-[9px] font-black uppercase text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.55),inset_0_-4px_0_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.35)] transition-transform active:translate-y-0.5 disabled:opacity-45 ${actionToneClass[tone]} ${active ? "ring-2 ring-white/90" : ""}`}
    >
      {!minimal && <span className="pointer-events-none absolute inset-x-2 top-1 h-2 rounded-full bg-white/35 blur-[1px]" />}
      <span className="relative block truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.65)]">{children}</span>
    </button>
  );
}

export function MobileExperimentControls({
  panels = [],
  actions = [],
  readouts,
  initialPanelId = null,
  panelCloseRequestKey = 0,
  variant = "game",
  columns = 4,
}: MobileExperimentControlsProps) {
  const [activePanelId, setActivePanelId] = useState<string | null>(initialPanelId);
  const activePanel = panels.find((panel) => panel.id === activePanelId && !panel.disabled);
  const isMinimal = variant === "minimal";

  useEffect(() => {
    if (panelCloseRequestKey > 0) setActivePanelId(null);
  }, [panelCloseRequestKey]);

  return (
    <div
      data-mobile-experiment-controls="true"
      className={`experiment-mobile-controls pointer-events-none fixed inset-x-0 z-[80] px-2 sm:hidden ${isMinimal ? "mobile-experiment-minimal" : ""}`}
      style={{ bottom: "max(0.65rem, env(safe-area-inset-bottom))" }}
    >
      <style>{`
        @keyframes mobileGamePanelIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.96) rotateX(8deg); }
          70% { opacity: 1; transform: translateY(-2px) scale(1.01) rotateX(0deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
        }
        @keyframes mobileGamePanelGlow {
          0%, 100% { opacity: 0.38; transform: translateX(-18%); }
          50% { opacity: 0.9; transform: translateX(18%); }
        }
        @keyframes mobileGameButtonPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.14); }
        }
        .mobile-game-panel {
          animation: mobileGamePanelIn 260ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
          background:
            linear-gradient(180deg, rgba(89, 20, 117, 0.96), rgba(38, 4, 59, 0.95) 54%, rgba(18, 3, 31, 0.96)),
            radial-gradient(circle at 18% 0%, rgba(255, 221, 96, 0.18), transparent 38%),
            radial-gradient(circle at 86% 18%, rgba(34, 211, 238, 0.14), transparent 34%);
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.2),
            inset 0 -10px 22px rgba(0,0,0,0.32),
            0 2px 0 rgba(255,255,255,0.1),
            0 18px 44px rgba(0,0,0,0.58),
            0 0 26px rgba(168, 85, 247, 0.28);
          transform-origin: bottom center;
        }
        .mobile-game-panel::before {
          content: "";
          position: absolute;
          inset: 1px 10px auto 10px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.75), transparent);
          animation: mobileGamePanelGlow 2.3s ease-in-out infinite;
        }
        .mobile-game-panel::after {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(255,255,255,0.16), transparent 28%, transparent 62%, rgba(255,255,255,0.08));
          mix-blend-mode: screen;
        }
        .mobile-game-panel-content button:not([aria-label]) {
          position: relative;
          overflow: hidden;
          min-height: 34px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.24);
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.22),
            inset 0 -5px 0 rgba(0,0,0,0.22),
            0 8px 16px rgba(0,0,0,0.34);
          transform: translateZ(0);
          transition: transform 140ms ease, filter 180ms ease, box-shadow 180ms ease;
        }
        .mobile-game-panel-content button:not([aria-label]):active {
          transform: translateY(2px);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            inset 0 -2px 0 rgba(0,0,0,0.24),
            0 4px 9px rgba(0,0,0,0.3);
        }
        .mobile-game-panel-content button:not([aria-label])::before {
          content: "";
          pointer-events: none;
          position: absolute;
          inset: 4px 8px auto 8px;
          height: 7px;
          border-radius: 999px;
          background: rgba(255,255,255,0.22);
          filter: blur(0.5px);
        }
        .mobile-game-panel-content button[class*="bg-emerald-500"],
        .mobile-game-panel-content button[class*="bg-orange-500"],
        .mobile-game-panel-content button[class*="bg-sky-500"],
        .mobile-game-panel-content button[class*="bg-rose-500"] {
          animation: mobileGameButtonPulse 1.8s ease-in-out infinite;
        }
        @media (max-height: 680px) {
          [data-mobile-experiment-controls="true"] .mobile-game-panel {
            max-height: min(22dvh, 156px);
            padding: 0.5rem;
          }
          [data-mobile-experiment-controls="true"] .mobile-game-panel-content {
            gap: 0.35rem;
          }
          [data-mobile-experiment-controls="true"] .mobile-game-dock {
            padding: 0.3rem;
            border-radius: 0.9rem;
          }
          [data-mobile-experiment-controls="true"] .mobile-game-button {
            min-height: 2rem;
            font-size: 0.5rem;
          }
        }
      `}</style>
      {activePanel && (
        <div className={`${isMinimal ? "pointer-events-auto relative mx-auto mb-1.5 max-h-[min(42dvh,360px)] w-[min(94vw,430px)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-slate-950/95 p-2.5 text-slate-100 shadow-[0_18px_50px_rgba(0,0,0,0.62)] backdrop-blur-2xl" : "mobile-game-panel pointer-events-auto relative mx-auto mb-1.5 max-h-[min(26dvh,210px)] w-[min(94vw,430px)] overflow-y-auto overscroll-contain rounded-2xl border border-fuchsia-200/20 p-2.5 text-slate-100 backdrop-blur-2xl"}`}>
          <div className="relative z-10 mb-1.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-xs font-black drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{activePanel.label}</div>
              {activePanel.value && <div className="text-[10px] font-black text-orange-200 drop-shadow-[0_0_8px_rgba(251,146,60,0.55)]">{activePanel.value}</div>}
            </div>
            <button
              type="button"
              onClick={() => setActivePanelId(null)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 bg-white/12 text-base font-black text-slate-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.18),0_6px_14px_rgba(0,0,0,0.35)] ring-1 ring-white/15"
              aria-label="Close controls"
            >
              ×
            </button>
          </div>
          <div className={`${isMinimal ? "relative z-10 space-y-2 text-xs" : "mobile-game-panel-content relative z-10 space-y-2 text-xs"}`}>{activePanel.content}</div>
        </div>
      )}

      <div className={`${isMinimal ? "pointer-events-auto mx-auto w-[min(96vw,460px)] rounded-2xl border border-white/10 bg-slate-950/92 p-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.55)] backdrop-blur-xl" : "mobile-game-dock pointer-events-auto mx-auto w-[min(96vw,460px)] rounded-2xl border border-white/15 bg-[#111827]/90 p-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.55)] backdrop-blur-md"}`}>
        {readouts && activePanel && <div className="mb-2 grid min-w-0 grid-cols-3 gap-1.5">{readouts}</div>}
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))` }}>
          {actions.map((action) => (
            <GameButton
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              tone={action.tone}
              tourId={action.id}
              minimal={isMinimal}
            >
              {action.label}
            </GameButton>
          ))}
          {panels.map((panel) => (
            <GameButton
              key={panel.id}
              onClick={() => setActivePanelId((current) => (current === panel.id ? null : panel.id))}
              disabled={panel.disabled}
              active={activePanelId === panel.id}
              tone="blue"
              tourId={panel.id}
              minimal={isMinimal}
            >
              {panel.label}
            </GameButton>
          ))}
        </div>
      </div>
    </div>
  );
}
