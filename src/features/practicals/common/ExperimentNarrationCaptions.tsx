"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";
import type { NarrationFocus, NarrationMeasure, NarrationPlayback } from "../../../lib/audio/narrationCaptions";

/**
 * The two things that keep a narrated experiment readable: big captions along
 * the bottom of the scene, and a hand that points at whatever the narrator is
 * talking about. Both are driven straight off the audio clock via
 * `useNarrationPlayback`, so they cannot drift away from the voice.
 */

/* --------------------------------------------------------------- Caption bar */

export function NarrationCaptionBar({
  playback,
  className = "pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-2 pb-2 sm:px-4 sm:pb-4",
  compact = false,
  plainLines,
}: {
  playback: NarrationPlayback;
  className?: string;
  /** Half-height captions, for screens where the scene needs the room. */
  compact?: boolean;
  /** Plain multi-line captions for silent/demo-driven steps. */
  plainLines?: string[];
}) {
  const line = playback.line;
  if (!playback.active || (!line && !plainLines?.length)) return null;

  return (
    <div className={className} aria-live="polite" aria-atomic="true">
      <div
        className={`w-full max-w-4xl rounded-2xl border border-white/12 bg-slate-950/90 text-center shadow-[0_18px_60px_rgba(0,0,0,.62)] backdrop-blur-xl ${
          compact ? "px-3.5 py-2 sm:px-5 sm:py-2.5" : "px-4 py-3 sm:px-7 sm:py-5"
        }`}
      >
        {plainLines?.length ? (
          <div
            className={`space-y-1 text-balance font-bold leading-snug text-slate-200 ${
              compact
                ? "text-[0.82rem] sm:text-[0.92rem] lg:text-[1rem]"
                : "text-[1rem] sm:text-[1.35rem] lg:text-[1.55rem]"
            }`}
          >
            {plainLines.map((text, index) => (
              <p key={`${text}-${index}`}>{text}</p>
            ))}
          </div>
        ) : line ? (
          <>
            <div
              className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.22em] text-cyan-300/85 ${
                compact ? "mb-1" : "mb-1.5"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full bg-cyan-300 ${playback.paused ? "" : "animate-pulse"}`}
                aria-hidden="true"
              />
              {playback.paused ? "Paused" : "Tinashe is saying"}
            </div>
            <p
              className={`text-balance font-extrabold leading-snug tracking-tight text-slate-200 ${
                compact
                  ? "text-[0.95rem] sm:text-[1.05rem] lg:text-[1.15rem]"
                  : "text-[1.1rem] sm:text-[1.6rem] lg:text-[1.85rem]"
              }`}
            >
              {line.words.map((word, index) => (
                <span
                  key={`${word.t}-${index}`}
                  className={
                    index === playback.wordIndex
                      ? "rounded-md bg-cyan-300/20 px-0.5 text-white shadow-[0_0_22px_rgba(103,232,249,.35)]"
                      : index < playback.wordIndex
                        ? "text-white"
                        : "text-slate-400"
                  }
                >
                  {word.w}
                  {index < line.words.length - 1 ? " " : ""}
                </span>
              ))}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Pointing hand */

/** Where a named 3D anchor currently sits on screen, in viewport pixels. */
export interface SceneAnchorPoint {
  x: number;
  y: number;
  /** False while the anchor is behind the camera or off screen. */
  visible: boolean;
}

export type SceneAnchorPoints = Record<string, SceneAnchorPoint>;

interface HandTarget {
  x: number;
  y: number;
  label?: string;
  /** True when we are aiming at a slider thumb, which the hand rides. */
  dragging: boolean;
}

function visibleElement(selector: string): HTMLElement | null {
  for (const element of Array.from(document.querySelectorAll<HTMLElement>(selector))) {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) continue;
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
    return element;
  }
  return null;
}

/**
 * Aim point for a control. If the control is a slider we aim at the thumb
 * rather than the middle of the box, so when the walkthrough moves the launch
 * angle from thirty to sixty degrees the hand slides along the track with it —
 * the learner sees the adjustment being made, not just where it happens.
 */
function controlAim(element: HTMLElement): { x: number; y: number; dragging: boolean } {
  const range = element.matches('input[type="range"]')
    ? (element as HTMLInputElement)
    : element.querySelector<HTMLInputElement>('input[type="range"]');

  if (range) {
    const rect = range.getBoundingClientRect();
    const min = Number(range.min || 0);
    const max = Number(range.max || 100);
    const value = Number(range.value || 0);
    const fraction = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
    const thumb = 22;
    return {
      x: rect.left + thumb / 2 + fraction * Math.max(0, rect.width - thumb),
      y: rect.top + rect.height / 2,
      dragging: true,
    };
  }

  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, dragging: false };
}

function resolveTarget(focus: NarrationFocus, anchors: SceneAnchorPoints | null): HandTarget | null {
  if (focus.selector) {
    // Controls are duplicated for mobile and desktop; take whichever is on screen.
    const element =
      visibleElement(`[data-experiment-tour="${focus.selector}"]`) ??
      visibleElement(`[data-experiment-tour="${focus.selector.replace(/^([a-z]+)-/, "$1-mobile-")}"]`);
    if (element) {
      const aim = controlAim(element);
      return { ...aim, label: focus.label };
    }
  }

  if (focus.sceneAnchor && anchors) {
    const point = anchors[focus.sceneAnchor];
    if (point?.visible) return { x: point.x, y: point.y, label: focus.label, dragging: false };
  }

  return null;
}

/* ----------------------------------------------------------- Measure overlay */

interface MeasureGeometry {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
}

function resolveMeasure(measure: NarrationMeasure, anchors: SceneAnchorPoints | null): MeasureGeometry | null {
  const from = anchors?.[measure.from];
  const to = anchors?.[measure.to];
  if (!from?.visible || !to?.visible) return null;

  // Squaring the measure off against an axis is how a ruler is actually held
  // against the apparatus, and it reads far more clearly than a diagonal.
  if (measure.axis === "vertical") {
    const x = (from.x + to.x) / 2;
    return { x1: x, y1: from.y, x2: x, y2: to.y, label: measure.label };
  }
  if (measure.axis === "horizontal") {
    const y = (from.y + to.y) / 2;
    return { x1: from.x, y1: y, x2: to.x, y2: y, label: measure.label };
  }
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y, label: measure.label };
}

/**
 * The ruler the narrator talks over: a dimension line with end caps and a
 * label, drawn between two scene anchors for exactly as long as the caption
 * line that asked for it. Held up, read out, then taken away.
 */
export function NarrationMeasureOverlay({
  playback,
  sceneAnchorsRef,
  enabled = true,
}: {
  playback: NarrationPlayback;
  sceneAnchorsRef?: MutableRefObject<SceneAnchorPoints>;
  enabled?: boolean;
}) {
  const [geometry, setGeometry] = useState<MeasureGeometry | null>(null);
  const [mounted, setMounted] = useState(false);
  const measure = playback.active ? playback.line?.focus?.measure : undefined;
  const measureRef = useRef<NarrationMeasure | undefined>(measure);
  measureRef.current = measure;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!enabled || !measure) {
      setGeometry(null);
      return;
    }

    let frame = 0;
    let last: MeasureGeometry | null = null;
    const track = () => {
      const current = measureRef.current;
      const next = current ? resolveMeasure(current, sceneAnchorsRef?.current ?? null) : null;
      const moved =
        !next !== !last ||
        (next &&
          last &&
          (Math.abs(next.x1 - last.x1) > 0.75 ||
            Math.abs(next.y1 - last.y1) > 0.75 ||
            Math.abs(next.x2 - last.x2) > 0.75 ||
            Math.abs(next.y2 - last.y2) > 0.75 ||
            next.label !== last.label));
      if (moved) {
        last = next;
        setGeometry(next);
      }
      frame = window.requestAnimationFrame(track);
    };
    track();
    return () => window.cancelAnimationFrame(frame);
  }, [enabled, measure, sceneAnchorsRef]);

  if (!mounted || !geometry) return null;

  const { x1, y1, x2, y2 } = geometry;
  // End caps sit across the dimension, so work out the perpendicular.
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy) || 1;
  const capX = (-dy / length) * 11;
  const capY = (dx / length) * 11;
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[125]" aria-hidden="true">
      <svg className="h-full w-full overflow-visible" style={{ animation: "narrationMeasureIn 260ms ease-out" }}>
        <defs>
          <marker id="narration-measure-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 z" fill="#fbbf24" />
          </marker>
        </defs>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#fbbf24"
          strokeWidth={2.5}
          markerStart="url(#narration-measure-arrow)"
          markerEnd="url(#narration-measure-arrow)"
          style={{ filter: "drop-shadow(0 0 7px rgba(251,191,36,.75))" }}
        />
        <line x1={x1 - capX} y1={y1 - capY} x2={x1 + capX} y2={y1 + capY} stroke="#fbbf24" strokeWidth={2.5} />
        <line x1={x2 - capX} y1={y2 - capY} x2={x2 + capX} y2={y2 + capY} stroke="#fbbf24" strokeWidth={2.5} />
      </svg>

      {geometry.label && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-amber-300/45 bg-slate-950/92 px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-amber-100 shadow-[0_8px_28px_rgba(0,0,0,.6)] backdrop-blur"
          style={{
            left: midX + (Math.abs(dx) < Math.abs(dy) ? 52 : 0),
            top: midY + (Math.abs(dx) < Math.abs(dy) ? 0 : -24),
            animation: "narrationMeasureIn 260ms ease-out",
          }}
        >
          {geometry.label}
        </div>
      )}

      <style>{`
        @keyframes narrationMeasureIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>,
    document.body,
  );
}

export function NarrationPointerHand({
  playback,
  sceneAnchorsRef,
  enabled = true,
}: {
  playback: NarrationPlayback;
  /** Live screen positions of the named 3D anchors, written by the scene probe. */
  sceneAnchorsRef?: MutableRefObject<SceneAnchorPoints>;
  enabled?: boolean;
}) {
  const [target, setTarget] = useState<HandTarget | null>(null);
  const [mounted, setMounted] = useState(false);
  const focus = playback.active ? playback.line?.focus : undefined;
  const focusRef = useRef<NarrationFocus | undefined>(focus);
  focusRef.current = focus;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!enabled || !focus) {
      setTarget(null);
      return;
    }

    let frame = 0;
    let last: HandTarget | null = null;
    const track = () => {
      const current = focusRef.current;
      const next = current ? resolveTarget(current, sceneAnchorsRef?.current ?? null) : null;
      // Sub-pixel jitter from the 3D projection would re-render every frame.
      const moved =
        !next !== !last ||
        (next &&
          last &&
          (Math.abs(next.x - last.x) > 0.75 || Math.abs(next.y - last.y) > 0.75 || next.label !== last.label));
      if (moved) {
        last = next;
        setTarget(next);
      }
      frame = window.requestAnimationFrame(track);
    };
    track();
    return () => window.cancelAnimationFrame(frame);
  }, [enabled, focus, sceneAnchorsRef]);

  if (!mounted || !target) return null;

  // Flip the callout to the other side near the right or bottom edge so it
  // never hangs off screen.
  const flipX = target.x > window.innerWidth - 190;
  const flipY = target.y > window.innerHeight - 150;
  const calloutX = target.x + (flipX ? -132 : 132);
  const calloutY = target.y + (flipY ? -70 : 70);
  const targetSize = target.dragging ? 28 : 36;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[130]" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        <g
          style={{
            transform: `translate(${target.x}px, ${target.y}px)`,
            transition: "transform 380ms cubic-bezier(.22,1,.36,1)",
            animation: target.dragging ? "narrationPointerTrack 1.2s ease-in-out infinite" : undefined,
          }}
        >
          <circle
            r={targetSize / 2}
            fill="rgba(255,255,255,.08)"
            stroke="rgba(15,23,42,.72)"
            strokeWidth="1.5"
          />
          <circle r="2.4" fill="#ea580c" stroke="white" strokeWidth="1.2" />
          <line x1={-targetSize / 2 - 7} y1="0" x2={-5} y2="0" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="5" y1="0" x2={targetSize / 2 + 7} y2="0" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1={-targetSize / 2 - 7} x2="0" y2="-5" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="5" x2="0" y2={targetSize / 2 + 7} stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {target.label && (
          <line
            x1={target.x + (flipX ? -targetSize / 2 : targetSize / 2)}
            y1={target.y + (flipY ? -targetSize / 2 : targetSize / 2)}
            x2={calloutX}
            y2={calloutY}
            stroke="rgba(234,88,12,.78)"
            strokeWidth="1.4"
            strokeDasharray="5 5"
            strokeLinecap="round"
            style={{ transition: "all 380ms cubic-bezier(.22,1,.36,1)" }}
          />
        )}
      </svg>

      {target.label && (
        <div
          className="absolute whitespace-nowrap rounded-[9px] border border-slate-300 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,.2)] backdrop-blur dark:border-white/15 dark:bg-slate-950/92 dark:text-slate-100"
          style={{
            left: calloutX,
            top: calloutY,
            transform: `translate(${flipX ? "-100%" : "0"}, ${flipY ? "-100%" : "0"})`,
            transition: "left 380ms cubic-bezier(.22,1,.36,1), top 380ms cubic-bezier(.22,1,.36,1)",
          }}
        >
          {target.label}
        </div>
      )}

      <style>{`
        @keyframes narrationPointerTrack {
          0%, 100% { opacity: .86; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>,
    document.body,
  );
}
