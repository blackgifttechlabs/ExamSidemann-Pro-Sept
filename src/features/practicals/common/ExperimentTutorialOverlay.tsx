import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";

export interface ExperimentTutorialStep {
  title: string;
  text: string;
  mode: "modal" | "bubble";
  selector?: string;
  sceneSelector?: string;
  sceneBox?: { x: number; y: number; w: number; h: number; round?: boolean };
  actionSelector?: string;
  actionEvent?: "click" | "pointerup" | "change" | "input";
  actionLabel?: string;
  isComplete?: () => boolean;
  completeTitle?: string;
  completeText?: string;
}

interface ExperimentTutorialOverlayProps {
  steps: ExperimentTutorialStep[];
  onClose: () => void;
}

function visibleRect(selector: string) {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const visible = elements.find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  });
  return visible?.getBoundingClientRect() ?? null;
}

export function ExperimentTutorialOverlay({ steps, onClose }: ExperimentTutorialOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [spotlightStyle, setSpotlightStyle] = useState<CSSProperties | null>(null);
  const [bubbleStyle, setBubbleStyle] = useState<CSSProperties>({});
  const [pointerStyle, setPointerStyle] = useState<CSSProperties | null>(null);
  const [actionHint, setActionHint] = useState("");
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const next = useCallback(() => {
    setActionHint("");
    if (isLast) onClose();
    else setStepIndex((current) => current + 1);
  }, [isLast, onClose]);

  const requestNext = () => {
    if (step.isComplete?.()) {
      next();
      return;
    }
    if (step.actionSelector) {
      setActionHint(step.actionLabel ? `${step.actionLabel} to continue.` : "Do the highlighted action to continue.");
      window.setTimeout(() => setActionHint(""), 1800);
      return;
    }
    next();
  };

  const back = () => {
    setActionHint("");
    setStepIndex((current) => Math.max(0, current - 1));
  };

  useEffect(() => {
    setTypedText("");
    setActionHint("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTypedText(step.text.slice(0, index));
      if (index >= step.text.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [step.text]);

  useEffect(() => {
    if (step.mode !== "bubble") {
      setSpotlightStyle(null);
      setPointerStyle(null);
      return;
    }

    const targetRect = () => {
      if (step.actionSelector) {
        const rect = visibleRect(step.actionSelector);
        if (rect) return rect;
      }
      if (step.selector) {
        const rect = visibleRect(step.selector);
        if (rect) return rect;
      }
      if (step.sceneSelector && step.sceneBox) {
        const scene = visibleRect(step.sceneSelector);
        if (!scene) return null;
        return new DOMRect(
          scene.left + scene.width * step.sceneBox.x,
          scene.top + scene.height * step.sceneBox.y,
          scene.width * step.sceneBox.w,
          scene.height * step.sceneBox.h
        );
      }
      return null;
    };

    const update = () => {
      const rect = targetRect();
      if (!rect) return;
      const pad = 8;
      const left = Math.max(6, rect.left - pad);
      const top = Math.max(6, rect.top - pad);
      const width = Math.min(window.innerWidth - left - 6, rect.width + pad * 2);
      const height = Math.min(window.innerHeight - top - 6, rect.height + pad * 2);

      setSpotlightStyle({
        left,
        top,
        width,
        height,
        borderRadius: step.sceneBox?.round ? 999 : 18,
      });
      setPointerStyle({
        left: Math.min(window.innerWidth - 74, Math.max(18, left + width * 0.72)),
        top: Math.min(window.innerHeight - 92, Math.max(18, top + height * 0.58)),
      });

      const bubbleWidth = Math.min(330, window.innerWidth - 24);
      const canRight = left + width + 16 + bubbleWidth < window.innerWidth;
      const canLeft = left - 16 - bubbleWidth > 0;
      const below = top + height + 14;
      const above = top - 226;
      setBubbleStyle({
        left: canRight ? left + width + 16 : canLeft ? left - bubbleWidth - 16 : 12,
        top: below + 220 < window.innerHeight ? below : above > 8 ? above : Math.max(8, Math.min(window.innerHeight - 236, top)),
        width: bubbleWidth,
      });
    };

    update();
    const timer = window.setTimeout(update, 150);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step]);

  useEffect(() => {
    if (step.isComplete?.()) {
      const timer = window.setTimeout(() => next(), 220);
      return () => window.clearTimeout(timer);
    }
    if (!step.actionSelector) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(step.actionSelector));
    if (elements.length === 0) return;
    const eventName = step.actionEvent ?? "click";
    const complete = () => {
      window.setTimeout(() => next(), 180);
    };
    const warnWrongAction = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(step.actionSelector ?? "")) return;
      if (target.closest("[data-experiment-tutorial-card]")) return;
      setActionHint(step.actionLabel ? `${step.actionLabel} to continue.` : "Use the highlighted control to continue.");
      window.setTimeout(() => setActionHint(""), 1800);
    };

    elements.forEach((element) => element.addEventListener(eventName, complete, { once: true }));
    document.addEventListener("click", warnWrongAction, true);
    document.addEventListener("pointerdown", warnWrongAction, true);
    return () => {
      elements.forEach((element) => element.removeEventListener(eventName, complete));
      document.removeEventListener("click", warnWrongAction, true);
      document.removeEventListener("pointerdown", warnWrongAction, true);
    };
  }, [next, step, stepIndex]);

  return (
    <div className={`fixed inset-0 overflow-hidden text-white ${step.mode === "modal" ? "bg-black/72" : "pointer-events-none bg-transparent"}`} style={{ zIndex: 2147483647 }}>
      <style>{`
        @keyframes experimentTutorialPop {
          0% { opacity: 0; transform: translateY(18px) scale(0.92); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes experimentTutorialPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(103,232,249,0.95), 0 0 0 9999px rgba(0,0,0,0.46), 0 0 30px rgba(34,211,238,0.58); }
          50% { box-shadow: 0 0 0 4px rgba(250,204,21,0.95), 0 0 0 9999px rgba(0,0,0,0.46), 0 0 42px rgba(250,204,21,0.66); }
        }
        @keyframes experimentTutorialShine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .experiment-tutorial-card {
          animation: experimentTutorialPop 280ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
          box-shadow: inset 0 3px 0 rgba(255,255,255,0.28), inset 0 -12px 24px rgba(0,0,0,0.3), 0 24px 70px rgba(0,0,0,0.62), 0 0 34px rgba(168,85,247,0.42);
        }
        .experiment-tutorial-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.22) 45%, transparent 62%);
          animation: experimentTutorialShine 2.6s ease-in-out infinite;
          pointer-events: none;
        }
        .experiment-tutorial-spotlight { animation: experimentTutorialPulse 1.7s ease-in-out infinite; }
        .experiment-tutorial-spotlight::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.32), inset 0 0 28px rgba(255,255,255,0.12);
        }
        @keyframes experimentTutorialHand {
          0%, 100% { transform: translate(0, 0) rotate(-22deg) scale(1); }
          50% { transform: translate(-10px, 10px) rotate(-22deg) scale(0.96); }
        }
        @keyframes experimentTutorialTouch {
          0% { transform: scale(0.35); opacity: 0.95; }
          70% { transform: scale(1.85); opacity: 0.08; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .experiment-tutorial-hand { animation: experimentTutorialHand 1.1s ease-in-out infinite; }
        .experiment-tutorial-touch { animation: experimentTutorialTouch 1.1s ease-out infinite; }
      `}</style>

      {step.mode === "bubble" && spotlightStyle && (
        <div className="experiment-tutorial-spotlight pointer-events-none fixed border border-cyan-200/90 bg-transparent" style={spotlightStyle} />
      )}
      {step.mode === "bubble" && pointerStyle && (
        <div className="pointer-events-none fixed" style={pointerStyle}>
          <div className="experiment-tutorial-touch absolute left-1 top-1 h-10 w-10 rounded-full border-2 border-yellow-200 bg-yellow-300/30" />
          <div className="experiment-tutorial-hand relative text-5xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.65)]">
            ☝
          </div>
        </div>
      )}

      {step.mode === "modal" ? (
        <div className="grid h-full place-items-center px-4">
          <div className="experiment-tutorial-card relative w-[min(92vw,430px)] overflow-hidden rounded-[1.35rem] border-2 border-fuchsia-200/70 bg-[linear-gradient(180deg,#b968ff,#8b1fd5_48%,#4a0874)] p-5 text-center">
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 rounded-xl border border-white/20 bg-black/20 px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-white/85 transition-colors hover:bg-white/15 hover:text-white"
            >
              Skip
            </button>
            <div className="relative z-10 mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl border-2 border-yellow-200/70 bg-yellow-300 text-5xl font-black text-purple-950 shadow-[inset_0_3px_0_rgba(255,255,255,0.55),inset_0_-7px_0_rgba(0,0,0,0.14),0_10px_22px_rgba(0,0,0,0.28)]">
              !
            </div>
            <div className="relative z-10 mb-2 text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">{step.title}</div>
            <p className="relative z-10 min-h-[6rem] rounded-2xl border border-white/20 bg-black/18 px-4 py-3 text-base font-black leading-relaxed text-amber-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.1)] drop-shadow-[0_2px_1px_rgba(0,0,0,0.55)]">
              {typedText}
              <span className="ml-0.5 animate-pulse">|</span>
            </p>
            <div className="relative z-10 mt-5 flex items-center justify-between gap-3">
              <button onClick={back} disabled={stepIndex === 0} className="rounded-2xl border border-white/25 bg-white/20 px-4 py-3 text-sm font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-4px_0_rgba(0,0,0,0.2)] disabled:opacity-45">
                Back
              </button>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/75">{stepIndex + 1}/{steps.length}</div>
              <button onClick={requestNext} className="rounded-2xl border border-yellow-100/70 bg-gradient-to-b from-yellow-200 via-orange-400 to-orange-600 px-6 py-3 text-sm font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.42),inset_0_-5px_0_rgba(0,0,0,0.22),0_10px_20px_rgba(0,0,0,0.34)]">
                {isLast ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div data-experiment-tutorial-card="true" className="experiment-tutorial-card pointer-events-auto fixed overflow-hidden rounded-2xl border border-cyan-200/45 bg-[linear-gradient(180deg,rgba(88,28,135,0.96),rgba(31,5,55,0.96))] p-4 shadow-2xl" style={bubbleStyle}>
          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="text-lg font-black text-cyan-100">{step.title}</div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-50 transition-colors hover:bg-white/18"
            >
              Skip
            </button>
          </div>
          <p className="relative z-10 mt-2 min-h-[4.5rem] text-sm font-bold leading-relaxed text-slate-100">
            {typedText}
            <span className="ml-0.5 animate-pulse">|</span>
          </p>
          {step.actionLabel && (
            <div className="relative z-10 mt-3 rounded-xl border border-yellow-200/35 bg-yellow-300/12 px-3 py-2 text-xs font-black uppercase tracking-[0.08em] text-yellow-100">
              {step.actionLabel}
            </div>
          )}
          {actionHint && (
            <div className="relative z-10 mt-2 rounded-xl border border-rose-200/40 bg-rose-500/20 px-3 py-2 text-xs font-black text-rose-50">
              {actionHint}
            </div>
          )}
          <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
            <button onClick={back} disabled={stepIndex === 0} className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-slate-100 disabled:opacity-45">Back</button>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/80">{stepIndex + 1}/{steps.length}</div>
            <button onClick={requestNext} className="rounded-xl border border-cyan-100/60 bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-700 px-5 py-2 text-xs font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.38),inset_0_-4px_0_rgba(0,0,0,0.24),0_8px_18px_rgba(0,0,0,0.34)]">
              {isLast ? "Done" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
