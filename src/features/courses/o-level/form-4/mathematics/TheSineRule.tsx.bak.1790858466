
const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="uk-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#uk-clip-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const ZwFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <rect width="60" height="4.286" y="0" fill="#31905c" />
    <rect width="60" height="4.286" y="4.286" fill="#ffd200" />
    <rect width="60" height="4.286" y="8.572" fill="#de2010" />
    <rect width="60" height="4.286" y="12.858" fill="#000000" />
    <rect width="60" height="4.286" y="17.144" fill="#de2010" />
    <rect width="60" height="4.286" y="21.43" fill="#ffd200" />
    <rect width="60" height="4.286" y="25.716" fill="#31905c" />
    <polygon points="0,0 22,15 0,30" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
    <polygon points="7.5,9.5 8.7,13.2 12.6,13.2 9.5,15.5 10.7,19.2 7.5,16.9 4.3,19.2 5.5,15.5 2.4,13.2 6.3,13.2" fill="#de2010" />
  </svg>
);

import React, { useState, useRef, useEffect, useMemo } from 'react';

/* =========================================================================
   FONTS + SHARED STYLES
   (Kept identical to the Circle Geometry chapter so the two feel like one
   consistent series.)
   ========================================================================= */
const InkStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .gc-hand { font-family: 'Patrick Hand', cursive; }
    .gc-ink { font-family: 'Kalam', cursive; }
    @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .gc-timeline { appearance: none; -webkit-appearance: none; height: 4px; border-radius: 999px; outline: none; }
    .gc-timeline::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 0; border-radius: 999px; background: #171717; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.28); }
    .gc-timeline::-moz-range-thumb { width: 18px; height: 18px; border: 0; border-radius: 999px; background: #171717; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.28); }
  `}</style>
);

/* =========================================================================
   PURE GEOMETRY HELPERS
   Same conventions as the rest of the series: toXY(center,r,angle) places a
   point r away from center at that angle, where 0° points right and
   positive angles turn counter-clockwise on screen (a normal maths unit
   circle) even though SVG's y-axis points down.
   ========================================================================= */
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const toXY = (c, r, deg) => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.cos(t), y: c.y - r * Math.sin(t) };
};
const angleFromCenter = (center, p) => (Math.atan2(center.y - p.y, p.x - center.x) * 180) / Math.PI;
const perpendicularFoot = (p, a, b) => {
  const abx = b.x - a.x, aby = b.y - a.y;
  const t = ((p.x - a.x) * abx + (p.y - a.y) * aby) / (abx * abx + aby * aby);
  return { x: a.x + t * abx, y: a.y + t * aby };
};
const lineLineIntersect = (p1, p2, p3, p4) => {
  const a1 = p2.y - p1.y, b1 = p1.x - p2.x, c1 = a1 * p1.x + b1 * p1.y;
  const a2 = p4.y - p3.y, b2 = p3.x - p4.x, c2 = a2 * p3.x + b2 * p3.y;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-9) return null;
  return { x: (b2 * c1 - b1 * c2) / det, y: (a1 * c2 - a2 * c1) / det };
};
const lineCircleIntersect = (a, b, center, r) => {
  const d = { x: b.x - a.x, y: b.y - a.y };
  const f = { x: a.x - center.x, y: a.y - center.y };
  const A = d.x * d.x + d.y * d.y;
  const B = 2 * (f.x * d.x + f.y * d.y);
  const C = f.x * f.x + f.y * f.y - r * r;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return null;
  const sq = Math.sqrt(disc);
  const t1 = (-B - sq) / (2 * A), t2 = (-B + sq) / (2 * A);
  return [{ x: a.x + t1 * d.x, y: a.y + t1 * d.y }, { x: a.x + t2 * d.x, y: a.y + t2 * d.y }];
};
// Angle (in degrees, 0-180) at vertex V looking toward P and Q — used to pick
// the geometrically sensible root when an SSA construction has two candidates.
const triangleAngleDeg = (V, P, Q) => {
  const v1 = { x: P.x - V.x, y: P.y - V.y };
  const v2 = { x: Q.x - V.x, y: Q.y - V.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y);
  return (Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180) / Math.PI;
};

/* =========================================================================
   ACTION CREATORS
   Every visual "beat" of a construction/demo is one of these small objects.
   The player walks through them in sequence, animating each one's "draw".
   ========================================================================= */
let uidCounter = 0;
const nextId = () => `sr${uidCounter++}`;

const mkLine = (from, to, narration, opts: any = {}) => ({
  id: nextId(), kind: 'line', from, to, length: dist(from, to), narration,
  duration: opts.duration ?? 900, color: opts.color ?? '#1e3a8a', width: opts.width ?? 2.5,
  dashed: opts.dashed ?? false,
});

const mkArc = (center, r, a0, a1, narration, opts: any = {}) => {
  const start = toXY(center, r, a0), end = toXY(center, r, a1);
  const delta = a1 - a0;
  const sweep = delta >= 0 ? 0 : 1;
  const absDelta = Math.abs(delta) % 360;
  const largeArc = absDelta > 180 ? 1 : 0;
  const d = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
  return {
    id: nextId(), kind: 'path', d, length: r * (Math.abs(delta) * Math.PI / 180), narration,
    duration: opts.duration ?? 1000, color: opts.color ?? '#f472b6', width: opts.width ?? 1.6,
    opacity: opts.opacity ?? 0.75, dashed: opts.dashed ?? false, center, r, a0, a1,
  };
};

const mkCircle = (center, r, narration, opts: any = {}) => ({
  id: nextId(), kind: 'circle', center, r, length: 2 * Math.PI * r, narration,
  duration: opts.duration ?? 2600, color: opts.color ?? '#10b981', width: opts.width ?? 1.8,
  opacity: opts.opacity ?? 0.82,
});

const mkPoint = (p, label, narration, opts: any = {}) => ({
  id: nextId(), kind: 'point', p, label, narration, duration: opts.duration ?? 420,
  color: opts.color ?? '#0f172a', labelOffset: opts.labelOffset ?? { x: 9, y: -9 },
});

const mkRightAngleMark = (corner, dirA, dirB, opts: any = {}) => {
  const s = opts.size ?? 13;
  const p1 = toXY(corner, s, dirA), p2 = toXY(corner, s, dirB);
  const p3 = { x: p1.x + (p2.x - corner.x), y: p1.y + (p2.y - corner.y) };
  const d = `M ${p1.x} ${p1.y} L ${p3.x} ${p3.y} L ${p2.x} ${p2.y}`;
  return {
    id: nextId(), kind: 'path', d, length: dist(p1, p3) + dist(p3, p2), narration: opts.narration ?? '',
    duration: opts.duration ?? 300, color: opts.color ?? '#0f172a', width: 1.5, dashed: false,
  };
};

/* =========================================================================
   ANIMATION ENGINE — shared player used across every chapter in the series
   ========================================================================= */
const ActionShape = ({ action, progress }) => {
  if (action.kind === 'point') {
    const scale = Math.min(1, progress * 1.5);
    return (
      <g style={{ opacity: Math.min(1, progress * 3) }}>
        <circle cx={action.p.x} cy={action.p.y} r={4 * scale} fill={action.color} />
        {action.label && (
          <text x={action.p.x + (action.labelOffset?.x ?? 9)} y={action.p.y + (action.labelOffset?.y ?? -9)} className="gc-hand" fontSize="15" fill={action.color}>
            {action.label}
          </text>
        )}
      </g>
    );
  }
  if (action.kind === 'circle') {
    const len = action.length;
    return <circle cx={action.center.x} cy={action.center.y} r={action.r} fill="none" stroke={action.color} strokeOpacity={action.opacity ?? 1} strokeWidth={action.width} strokeDasharray={len} strokeDashoffset={len * (1 - progress)} strokeLinecap="round" />;
  }
  const d = action.d ?? `M ${action.from.x} ${action.from.y} L ${action.to.x} ${action.to.y}`;
  if (action.dashed) {
    return <path d={d} fill="none" stroke={action.color} strokeWidth={action.width} strokeDasharray="6 4" style={{ opacity: Math.min(action.opacity ?? 1, progress * 2) }} strokeLinecap="round" />;
  }
  const len = action.length;
  return <path d={d} fill="none" stroke={action.color} strokeOpacity={action.opacity ?? 1} strokeWidth={action.width} strokeDasharray={len} strokeDashoffset={len * (1 - progress)} strokeLinecap="round" />;
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const DRAW_START = 0.34;
const drawProgressFor = (action, progress) => {
  if (action.kind === 'point') return progress;
  return clamp01((progress - DRAW_START) / (1 - DRAW_START));
};

const anchorForAction = (action) => {
  if (action.center) return action.center;
  if (action.from) return action.from;
  if (action.p) return action.p;
  return null;
};

const PencilInstrument = ({ point, angle }) => (
  <g transform={`translate(${point.x} ${point.y}) rotate(${angle})`} className="pointer-events-none" style={{ filter: 'drop-shadow(0 2px 2px rgba(15,23,42,.2))' }}>
    <polygon points="0,0 -13,-5 -13,5" fill="#e8c49a" stroke="#8b5e34" strokeWidth="0.8" />
    <polygon points="0,0 -4,-1.6 -4,1.6" fill="#252525" />
    <rect x="-68" y="-5" width="55" height="10" rx="2" fill="#f4c430" stroke="#a16207" strokeWidth="1" />
    <rect x="-68" y="-5" width="9" height="10" rx="1.5" fill="#ef6a7b" />
    <rect x="-61" y="-5" width="3" height="10" fill="#b7bcc3" />
    <path d="M -52 -4 L -18 -4" stroke="rgba(255,255,255,.65)" strokeWidth="1.4" strokeLinecap="round" />
  </g>
);

const CompassInstrument = ({ pin, pencil, raised }) => {
  const dx = pencil.x - pin.x;
  const dy = pencil.y - pin.y;
  const span = Math.max(1, Math.hypot(dx, dy));
  const normal = { x: -dy / span, y: dx / span };
  const midpoint = { x: (pin.x + pencil.x) / 2, y: (pin.y + pencil.y) / 2 };
  const hinge = {
    x: midpoint.x + normal.x * Math.min(58, Math.max(34, span * 0.28)),
    y: midpoint.y + normal.y * Math.min(58, Math.max(34, span * 0.28)) - raised,
  };
  const pencilAngle = (Math.atan2(pencil.y - hinge.y, pencil.x - hinge.x) * 180) / Math.PI;
  const wingStart = { x: hinge.x + (pin.x - hinge.x) * 0.38, y: hinge.y + (pin.y - hinge.y) * 0.38 };
  const wingEnd = { x: hinge.x + (pencil.x - hinge.x) * 0.38, y: hinge.y + (pencil.y - hinge.y) * 0.38 };
  const wingMid = { x: (wingStart.x + wingEnd.x) / 2, y: Math.min(wingStart.y, wingEnd.y) - 10 };

  return (
    <g className="pointer-events-none" style={{ filter: 'drop-shadow(0 3px 3px rgba(15,23,42,.25))' }}>
      <defs>
        <linearGradient id="srCompassSteel" x1="0" x2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="0.45" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
      </defs>
      <line x1={hinge.x} y1={hinge.y} x2={pin.x} y2={pin.y - 4} stroke="url(#srCompassSteel)" strokeWidth="9" strokeLinecap="round" />
      <line x1={hinge.x} y1={hinge.y} x2={pencil.x} y2={pencil.y - 3} stroke="url(#srCompassSteel)" strokeWidth="9" strokeLinecap="round" />
      <path d={`M ${wingStart.x} ${wingStart.y} Q ${wingMid.x} ${wingMid.y} ${wingEnd.x} ${wingEnd.y}`} fill="none" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
      <circle cx={wingMid.x} cy={wingMid.y + 3} r="5" fill="#1f2937" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1={pin.x} y1={pin.y - 11} x2={pin.x} y2={pin.y + 3} stroke="#20252b" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={pin.x} cy={pin.y + 2.5} r="2.2" fill="#111827" />
      <g transform={`translate(${pencil.x} ${pencil.y}) rotate(${pencilAngle})`}>
        <polygon points="0,0 -13,-5 -13,5" fill="#e8c49a" stroke="#7c2d12" strokeWidth="0.8" />
        <polygon points="0,0 -4,-1.5 -4,1.5" fill="#202020" />
        <rect x="-52" y="-4.5" width="39" height="9" rx="2" fill="#f0a830" stroke="#a16207" strokeWidth="0.8" />
        <rect x="-43" y="-7" width="13" height="14" rx="2" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
      </g>
      <circle cx={hinge.x} cy={hinge.y} r="12" fill="url(#srCompassSteel)" stroke="#334155" strokeWidth="1.5" />
      <circle cx={hinge.x} cy={hinge.y} r="4.5" fill="#475569" stroke="#f8fafc" strokeWidth="1.2" />
      <circle cx={hinge.x} cy={hinge.y - 25} r="9" fill="none" stroke="#cbd5e1" strokeWidth="4" />
      <rect x={hinge.x - 4} y={hinge.y - 17} width="8" height="9" rx="3" fill="url(#srCompassSteel)" stroke="#475569" strokeWidth="1" />
    </g>
  );
};

const DrawingInstrument = ({ action, progress, previousAnchor }) => {
  if (!action || action.kind === 'point') return null;
  const targetAnchor = anchorForAction(action);
  if (!targetAnchor) return null;
  const moveProgress = clamp01(progress / 0.2);
  const openProgress = clamp01((progress - 0.2) / (DRAW_START - 0.2));
  const drawProgress = drawProgressFor(action, progress);
  const startAnchor = previousAnchor ?? targetAnchor;
  const lift = progress < 0.2 ? Math.sin(moveProgress * Math.PI) * 28 : 0;
  const pin = {
    x: startAnchor.x + (targetAnchor.x - startAnchor.x) * moveProgress,
    y: startAnchor.y + (targetAnchor.y - startAnchor.y) * moveProgress - lift,
  };

  if (action.center && action.r) {
    const isFullCircle = action.kind === 'circle';
    const startAngle = isFullCircle ? 0 : (action.a0 ?? -90);
    const endAngle = isFullCircle ? -360 : (action.a1 ?? startAngle + 360);
    const activeAngle = startAngle + (endAngle - startAngle) * drawProgress;
    const finalPencil = toXY(targetAnchor, action.r, activeAngle);
    const initialPencil = toXY(pin, 18, startAngle);
    const pencil = progress < DRAW_START
      ? {
          x: initialPencil.x + (toXY(pin, action.r, startAngle).x - initialPencil.x) * openProgress,
          y: initialPencil.y + (toXY(pin, action.r, startAngle).y - initialPencil.y) * openProgress,
        }
      : finalPencil;
    return <CompassInstrument pin={pin} pencil={pencil} raised={progress < 0.2 ? 8 : 0} />;
  }

  if (action.from && action.to) {
    const point = {
      x: action.from.x + (action.to.x - action.from.x) * drawProgress,
      y: action.from.y + (action.to.y - action.from.y) * drawProgress,
    };
    const angle = (Math.atan2(action.to.y - action.from.y, action.to.x - action.from.x) * 180) / Math.PI;
    return <PencilInstrument point={point} angle={angle} />;
  }
  return null;
};

const formatPlayerTime = (milliseconds) => {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const ConstructionPlayer = ({ title, viewBox = '0 0 420 300', actions, caption }) => {
  const total = useMemo(() => actions.reduce((s, a) => s + a.duration, 0), [actions]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!playing) return undefined;
    lastRef.current = performance.now();
    const tick = (now) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      setTime((t) => {
        const nt = t + dt * speed;
        if (nt >= total) { setPlaying(false); return total; }
        return nt;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, speed, total]);

  const withRange = useMemo(() => {
    let acc = 0;
    return actions.map((a) => { const start = acc; acc += a.duration; return { ...a, start, end: acc }; });
  }, [actions]);

  const narrations = withRange.filter((a) => a.narration && time >= a.start);

  const toggle = () => {
    if (time >= total) { setTime(0); setPlaying(true); }
    else setPlaying((p) => !p);
  };
  const restart = () => { setTime(0); setPlaying(true); };
  const currentIndex = withRange.findIndex((action) => time >= action.start && time < action.end);
  const currentAction = currentIndex >= 0 ? withRange[currentIndex] : null;
  const currentProgress = currentAction
    ? clamp01((time - currentAction.start) / Math.max(1, currentAction.end - currentAction.start))
    : 0;
  const previousAnchor = currentIndex > 0
    ? [...withRange.slice(0, currentIndex)].reverse().map(anchorForAction).find(Boolean) ?? null
    : null;
  const timelinePercent = total > 0 ? (time / total) * 100 : 0;
  const paddedViewBox = useMemo(() => {
    const [x, y, width, height] = viewBox.trim().split(/\s+/).map(Number);
    if (![x, y, width, height].every(Number.isFinite)) return viewBox;
    const padX = width * 0.28;
    const padY = height * 0.28;
    return `${x - padX} ${y - padY} ${width + padX * 2} ${height + padY * 2}`;
  }, [viewBox]);

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {title && <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{title}</div>}
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox={paddedViewBox} preserveAspectRatio="xMidYMid meet" className="h-auto w-full">
            {withRange.map((a) => {
              if (time < a.start) return null;
              const progress = a.end === a.start ? 1 : Math.min(1, (time - a.start) / (a.end - a.start));
              return <ActionShape key={a.id} action={a} progress={drawProgressFor(a, progress)} />;
            })}
            <DrawingInstrument action={currentAction} progress={currentProgress} previousAnchor={previousAnchor} />
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            <input
              type="range" min={0} max={total} value={time}
              onChange={(e) => { setPlaying(false); setTime(Number(e.target.value)); }}
              aria-label="Construction timeline"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${timelinePercent}%, #c9c9c9 ${timelinePercent}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-sm font-semibold tabular-nums text-slate-800">
              <span>{formatPlayerTime(time)}</span>
              <span>{formatPlayerTime(total)}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <button onClick={toggle} className="shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95" style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {playing ? 'PAUSE' : time >= total ? 'PLAY ▶' : time > 0 ? 'RESUME ▶' : 'PLAY ▶'}
              </button>
              <button onClick={restart} className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500">
                Restart
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs font-bold text-slate-500">
                Speed
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                  aria-label="Playback speed"
                >
                  <option value={0.5}>0.5×</option>
                  <option value={0.75}>0.75×</option>
                  <option value={1}>1×</option>
                  <option value={1.5}>1.5×</option>
                  <option value={2}>2×</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        <div className="min-w-0 max-h-72 overflow-y-auto overflow-x-hidden p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Working</h5>
          <ol className="space-y-2">
            {narrations.length === 0 && <li className="text-sm italic text-slate-400">Press play to begin…</li>}
            {narrations.map((a) => {
              const isCurrent = time < a.end;
              return (
                <li key={a.id} className={`gc-ink text-[1.05rem] leading-snug ${isCurrent ? 'text-blue-900' : 'text-slate-400'}`}>
                  <span className="mr-1">{isCurrent ? '✎' : '✓'}</span>
                  {a.narration}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      {caption && <p className="border-t border-slate-100 px-4 py-2 text-xs italic text-slate-500">{caption}</p>}
    </div>
  );
};

/* =========================================================================
   FIG. 4.1 / 4.4 — TRIG RATIOS BY PROJECTION (interactive slider)
   A radius OP sweeps from 0° to 180°; drop its projections onto Ox and Oy
   to redefine sin/cos/tan so they still make sense once θ passes 90°.
   ========================================================================= */
const ObtuseRatioDemo = () => {
  const O = { x: 210, y: 175 }, r = 92;
  const [theta, setTheta] = useState(55);
  const P = toXY(O, r, theta);
  const M = { x: P.x, y: O.y };
  const N = { x: O.x, y: P.y };
  const rad = (theta * Math.PI) / 180;
  const sinT = Math.sin(rad), cosT = Math.cos(rad), tanT = Math.tan(rad);
  const isObtuse = theta > 90;
  const axisLeft = O.x - r - 46, axisRight = O.x + r + 46;
  const axisTop = O.y - r - 30, axisBottom = O.y + r + 30;

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Trig Ratios by Projection</div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 420 350" className="h-auto w-full">
            <line x1={axisLeft} y1={O.y} x2={axisRight} y2={O.y} stroke="#94a3b8" strokeWidth="1.4" />
            <line x1={O.x} y1={axisTop} x2={O.x} y2={axisBottom} stroke="#94a3b8" strokeWidth="1.4" />
            <text x={axisRight - 12} y={O.y - 8} className="gc-hand" fontSize="14" fill="#64748b">Ox</text>
            <text x={O.x + 8} y={axisTop + 14} className="gc-hand" fontSize="14" fill="#64748b">Oy</text>
            <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="1.6" opacity={0.75} />
            <line x1={P.x} y1={P.y} x2={M.x} y2={M.y} stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="4 3" />
            <line x1={P.x} y1={P.y} x2={N.x} y2={N.y} stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="4 3" />
            <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke="#1e3a8a" strokeWidth="2.2" />
            <circle cx={P.x} cy={P.y} r={4.5} fill="#f43f5e" />
            <text x={P.x + 8} y={P.y - 8} className="gc-hand" fontSize="15" fill="#f43f5e">P</text>
            <circle cx={M.x} cy={M.y} r={3} fill="#0f172a" />
            <text x={M.x - 6} y={M.y + 18} className="gc-hand" fontSize="14" fill="#0f172a">M</text>
            <circle cx={N.x} cy={N.y} r={3} fill="#0f172a" />
            <text x={N.x - 20} y={N.y - 6} className="gc-hand" fontSize="14" fill="#0f172a">N</text>
            <circle cx={O.x} cy={O.y} r={3} fill="#0f172a" />
            <text x={O.x - 16} y={O.y + 16} className="gc-hand" fontSize="14" fill="#0f172a">O</text>
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            <input
              type="range" min={1} max={179} value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              aria-label="Sweep the radius OP"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${(theta / 179) * 100}%, #c9c9c9 ${(theta / 179) * 100}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>θ = {theta}°</span>
              <span>{isObtuse ? 'Obtuse' : 'Acute'}</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Live values</h5>
          <p className="gc-ink text-[1.15rem] leading-snug text-blue-900">
            sin θ = ON ⁄ OP = {sinT.toFixed(4)}<br />
            cos θ = OM ⁄ OP = {cosT.toFixed(4)}<br />
            tan θ = ON ⁄ OM = {tanT.toFixed(4)}
          </p>
          <p className="mt-3 text-xs italic text-slate-500">
            {isObtuse
              ? 'M has slid onto the negative side of Ox, so OM (and cos θ) is now negative — but ON stays positive, so sin θ stays positive too.'
              : 'Both M and N sit on the positive axes here, so every ratio agrees with the ordinary right-angled-triangle definitions.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   FIG. 4.5 — THE SUPPLEMENTARY ANGLE IDENTITIES (interactive slider)
   P at angle θ and Q at angle (180°−θ) are mirror images across Oy, which
   is the entire proof that sin(180°−θ)=sinθ, cos(180°−θ)=−cosθ, etc.
   ========================================================================= */
const SupplementIdentityDemo = () => {
  const O = { x: 210, y: 195 }, r = 92;
  const [theta, setTheta] = useState(35);
  const P = toXY(O, r, theta);
  const Q = toXY(O, r, 180 - theta);
  const M = { x: P.x, y: O.y };
  const L = { x: Q.x, y: O.y };
  const rad = (d) => (d * Math.PI) / 180;
  const sinT = Math.sin(rad(theta)), cosT = Math.cos(rad(theta)), tanT = Math.tan(rad(theta));
  const sinS = Math.sin(rad(180 - theta)), cosS = Math.cos(rad(180 - theta)), tanS = Math.tan(rad(180 - theta));
  const axisLeft = O.x - r - 46, axisRight = O.x + r + 46;

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">sin(180° − θ) = sin θ</div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 420 320" className="h-auto w-full">
            <line x1={axisLeft} y1={O.y} x2={axisRight} y2={O.y} stroke="#94a3b8" strokeWidth="1.4" />
            <line x1={O.x} y1={O.y - r - 26} x2={O.x} y2={O.y + 26} stroke="#94a3b8" strokeWidth="1.4" />
            <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="1.6" opacity={0.7} />
            <line x1={P.x} y1={P.y} x2={M.x} y2={M.y} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 3" />
            <line x1={Q.x} y1={Q.y} x2={L.x} y2={L.y} stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="4 3" />
            <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke="#1e3a8a" strokeWidth="2" />
            <line x1={O.x} y1={O.y} x2={Q.x} y2={Q.y} stroke="#be185d" strokeWidth="2" />
            <circle cx={P.x} cy={P.y} r={4.5} fill="#1e3a8a" />
            <text x={P.x + 8} y={P.y - 6} className="gc-hand" fontSize="15" fill="#1e3a8a">P</text>
            <circle cx={Q.x} cy={Q.y} r={4.5} fill="#be185d" />
            <text x={Q.x - 20} y={Q.y - 6} className="gc-hand" fontSize="15" fill="#be185d">Q</text>
            <circle cx={M.x} cy={M.y} r={3} fill="#0f172a" />
            <text x={M.x - 6} y={M.y + 18} className="gc-hand" fontSize="14" fill="#0f172a">M</text>
            <circle cx={L.x} cy={L.y} r={3} fill="#0f172a" />
            <text x={L.x - 8} y={L.y + 18} className="gc-hand" fontSize="14" fill="#0f172a">L</text>
            <circle cx={O.x} cy={O.y} r={3} fill="#0f172a" />
            <text x={O.x - 8} y={O.y + 18} className="gc-hand" fontSize="14" fill="#0f172a">O</text>
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            <input
              type="range" min={1} max={89} value={theta}
              onChange={(e) => setTheta(Number(e.target.value))}
              aria-label="Change theta"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${(theta / 89) * 100}%, #c9c9c9 ${(theta / 89) * 100}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>θ = {theta}°</span>
              <span>180° − θ = {180 - theta}°</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Matching values</h5>
          <p className="gc-ink text-[1.02rem] leading-snug text-blue-900">
            sin {theta}° = {sinT.toFixed(4)} &nbsp;=&nbsp; sin {180 - theta}° = {sinS.toFixed(4)}<br />
            cos {theta}° = {cosT.toFixed(4)} &nbsp;=&nbsp; −(cos {180 - theta}°) = {(-cosS).toFixed(4)}<br />
            tan {theta}° = {tanT.toFixed(4)} &nbsp;=&nbsp; −(tan {180 - theta}°) = {(-tanS).toFixed(4)}
          </p>
          <p className="mt-3 text-xs italic text-slate-500">P and Q are mirror images across Oy, so ON is shared by both — that's the whole proof.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   BEARINGS COMPASS (interactive slider)
   ========================================================================= */
const BearingCompassDemo = () => {
  const O = { x: 210, y: 175 }, r = 108;
  const [bearing, setBearing] = useState(53);
  const mathAngle = 90 - bearing;
  const P = toXY(O, r, mathAngle);
  const quadrant = (b) => {
    let ns, ew, ang;
    if (b <= 90) { ns = 'N'; ew = 'E'; ang = b; }
    else if (b <= 180) { ns = 'S'; ew = 'E'; ang = 180 - b; }
    else if (b <= 270) { ns = 'S'; ew = 'W'; ang = b - 180; }
    else { ns = 'N'; ew = 'W'; ang = 360 - b; }
    return `${ns}${Math.round(ang)}°${ew}`;
  };
  const ticks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Reading a Bearing</div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 420 350" className="h-auto w-full">
            <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#94a3b8" strokeWidth="1.2" />
            {ticks.map((t) => {
              const inner = toXY(O, r - 8, 90 - t);
              const outer = toXY(O, r, 90 - t);
              return <line key={t} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#94a3b8" strokeWidth="1.2" />;
            })}
            <text x={O.x - 6} y={O.y - r - 12} className="gc-hand" fontSize="16" fill="#0f172a">N</text>
            <text x={O.x + r + 10} y={O.y + 5} className="gc-hand" fontSize="16" fill="#0f172a">E</text>
            <text x={O.x - 8} y={O.y + r + 22} className="gc-hand" fontSize="16" fill="#0f172a">S</text>
            <text x={O.x - r - 22} y={O.y + 5} className="gc-hand" fontSize="16" fill="#0f172a">W</text>
            <line x1={O.x} y1={O.y + r} x2={O.x} y2={O.y - r} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" />
            <line x1={O.x} y1={O.y} x2={O.x} y2={O.y - r - 4} stroke="#0f172a" strokeWidth="2" />
            <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke="#1e3a8a" strokeWidth="2.4" />
            <circle cx={P.x} cy={P.y} r={5} fill="#f43f5e" />
            <circle cx={O.x} cy={O.y} r={3} fill="#0f172a" />
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            <input
              type="range" min={0} max={360} value={bearing}
              onChange={(e) => setBearing(Number(e.target.value))}
              aria-label="Change bearing"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${(bearing / 360) * 100}%, #c9c9c9 ${(bearing / 360) * 100}%, #c9c9c9 100%)` }}
            />
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Two ways to write it</h5>
          <p className="gc-ink text-[1.2rem] leading-snug text-blue-900">
            {String(Math.round(bearing)).padStart(3, '0')}°<br />
            {quadrant(bearing)}
          </p>
          <p className="mt-3 text-xs italic text-slate-500">A three-figure bearing always has three digits and is measured clockwise from north. The compass form measures away from N or S, toward E or W.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
const DefinitionBox = ({ children, label = 'Definition' }) => (
  <div className="my-6 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
    <span className="gc-hand block text-center text-sm text-slate-500">{label}</span>
    <p className="gc-ink mt-2 text-center text-xl font-bold leading-snug text-blue-900 sm:text-2xl">{children}</p>
    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rose-300" />
  </div>
);

const ExampleCard = ({ index, example }) => {
  const [open, setOpen] = useState(false);
  const diagram = useMemo(() => (open && example.build ? example.build() : null), [open, example]);
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{index}</div>
        <div className="pt-1">
          {example.tag && <div className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-500">{example.tag}</div>}
          <div className="font-medium text-slate-800">{example.question}</div>
        </div>
      </div>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-slate-100">
        <span>{open ? 'Hide Solution' : 'Show Solution'}</span>
        <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          {diagram && (
            <ConstructionPlayer title="Diagram" viewBox={diagram.viewBox} actions={diagram.actions} caption={diagram.caption} />
          )}
          <div className="rounded-lg bg-blue-50/40 p-4 pl-6">
            {example.steps.map((step, i) => (
              <div key={i} className="flex gap-2 border-b border-blue-100/70 py-2 text-sm leading-relaxed last:border-0">
                <span className="gc-hand shrink-0 font-bold text-rose-500">Step {i + 1}:</span>
                <span className="gc-ink flex-1 text-[1.05rem] leading-relaxed text-blue-900">{step}</span>
              </div>
            ))}
            <div className="pt-2 text-sm leading-relaxed">
              <span className="gc-hand mr-1 font-bold text-slate-500">Answer:</span>
              <span className="gc-ink text-lg font-bold text-emerald-700">{example.answer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const PracticeZone = ({ items }) => (
  <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
      <span className="text-2xl">✍️</span> Practice Zone
    </h3>
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
          <span className="font-bold text-emerald-400">{i + 1}.</span>
          <span className="text-slate-200">{q}</span>
        </div>
      ))}
    </div>
  </div>
);

/* =========================================================================
   BUILDING EACH SECTION'S DIAGRAMS
   (All recreated as original SVG constructions rather than reproducing the
   scanned textbook figures — same idea as Fig. 4.1–4.10, redrawn.)
   ========================================================================= */

// --- 4.2 Proving the sine rule ---
function build_SineRuleProofAcute() {
  const A = { x: 210, y: 55 };
  const B = { x: 95, y: 245 };
  const C = { x: 330, y: 245 };
  const D = perpendicularFoot(A, B, C);
  const given = [
    mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''),
    mkLine(A, B, 'Here is triangle ABC. As always, a = BC (opposite A), b = CA (opposite B), c = AB (opposite C).', { color: '#1e3a8a' }),
    mkLine(B, C, '', { color: '#1e3a8a' }),
    mkLine(C, A, '', { color: '#1e3a8a' }),
  ];
  const altitude = mkLine(A, D, 'Draw the perpendicular from A to BC, meeting it at D. Call this height AD = h.', { color: '#f59e0b', dashed: true });
  const rightMark = mkRightAngleMark(D, angleFromCenter(D, B), angleFromCenter(D, A));
  const note1 = mkPoint(D, '', 'In right-angled triangle ABD, sin B = h ⁄ c, so h = c·sin B.');
  const note2 = mkPoint(D, '', 'In right-angled triangle ACD, sin C = h ⁄ b, so h = b·sin C.');
  const note3 = mkPoint(A, '', 'Both expressions equal h, so c·sin B = b·sin C — rearranged, that\'s b ⁄ sin B = c ⁄ sin C.');
  const note4 = mkPoint(A, '', 'Drop a second perpendicular, from C to AB this time, and the same argument shows a ⁄ sin A = b ⁄ sin B too. All three ratios are equal.');
  return { viewBox: '0 0 420 300', actions: [...given, altitude, rightMark, note1, note2, note3, note4], caption: 'a ⁄ sin A = b ⁄ sin B = c ⁄ sin C — the sine rule, true for every triangle.' };
}

function build_SineRuleProofObtuse() {
  const B = { x: 90, y: 245 };
  const C = { x: 235, y: 245 };
  const A = { x: 300, y: 60 };
  const D = perpendicularFoot(A, B, C);
  const given = [
    mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''),
    mkLine(A, B, 'Now suppose angle C is obtuse. Triangle ABC still has a = BC, b = CA, c = AB as before.', { color: '#1e3a8a' }),
    mkLine(B, C, '', { color: '#1e3a8a' }),
    mkLine(C, A, '', { color: '#1e3a8a' }),
  ];
  const extend = mkLine(C, D, 'The foot of the perpendicular from A no longer lands inside BC — it falls beyond C. Extend BC out to meet it, at D.', { color: '#94a3b8', dashed: true });
  const altitude = mkLine(A, D, 'Draw the perpendicular AD = h, exactly as before.', { color: '#f59e0b', dashed: true });
  const rightMark = mkRightAngleMark(D, angleFromCenter(D, C), angleFromCenter(D, A));
  const note1 = mkPoint(D, '', 'Triangle ABD still gives sin B = h ⁄ c, exactly as before.');
  const note2 = mkPoint(D, '', 'But angle ACD isn\'t angle C — it\'s the angle that makes a straight line with C, so angle ACD = 180° − C.');
  const note3 = mkPoint(A, '', 'In triangle ACD, sin(ACD) = h ⁄ b. Since sin(180° − C) = sin C, this is really just sin C = h ⁄ b — the identity survives.');
  const note4 = mkPoint(A, '', 'So b ⁄ sin B = c ⁄ sin C still holds — the sine rule works for obtuse-angled triangles too.');
  return { viewBox: '0 0 420 300', actions: [...given, extend, altitude, rightMark, note1, note2, note3, note4], caption: 'The identity sin(180° − θ) = sin θ is exactly what rescues the sine rule when an angle is obtuse.' };
}

// --- 4.3 Worked examples: solving triangles ---
function build_Example2Diagram() {
  const B = { x: 100, y: 235 };
  const C = { x: 320, y: 235 };
  const angB = 39, angC = 82;
  const dirBA = angB;
  const dirCA = 180 - angC;
  const A = lineLineIntersect(B, toXY(B, 400, dirBA), C, toXY(C, 400, dirCA)) || { x: 210, y: 90 };
  const given = [mkPoint(B, 'B', ''), mkPoint(C, 'C', ''), mkLine(B, C, 'Draw side a = BC, the side we\'re given.', { color: '#334155' })];
  const arcB = mkArc(B, 46, 0, dirBA, 'Mark the given angle at B, 39°.', { color: '#f472b6' });
  const lineBA = mkLine(B, A, 'Draw a ray from B at this angle — A lies somewhere along it.', { color: '#94a3b8', dashed: true });
  const arcC = mkArc(C, 46, 180, dirCA, 'Mark the given angle at C, 82°.', { color: '#f472b6' });
  const lineCA = mkLine(C, A, 'Draw a ray from C at this angle too — where the two rays meet is A.', { color: '#1e3a8a' });
  const markA = mkPoint(A, 'A', 'Angle A = 180° − (39° + 82°) = 59°.');
  return { viewBox: '0 0 420 300', actions: [...given, arcB, lineBA, arcC, lineCA, markA], caption: 'With two angles and the included side known, c = (a × sin C) ⁄ sin A.' };
}

function build_Example3Diagram() {
  const scale = 11.2;
  const C = { x: 110, y: 235 };
  const aPx = 12.5 * scale, cPx = 17.7 * scale;
  const B = toXY(C, aPx, 0);
  const angC = 116;
  const rayEnd = toXY(C, 380, angC);
  const candidates = lineCircleIntersect(C, rayEnd, B, cPx) || [];
  const dir = { x: rayEnd.x - C.x, y: rayEnd.y - C.y };
  const validPts = candidates.filter((p) => (p.x - C.x) * dir.x + (p.y - C.y) * dir.y > 0);
  const A = validPts[0] || candidates[0] || { x: 260, y: 90 };
  const given = [mkPoint(C, 'C', ''), mkLine(C, B, 'Draw side a = BC (12.5 cm).', { color: '#334155' }), mkPoint(B, 'B', '')];
  const arcC = mkArc(C, 42, 0, angC, 'At C, mark the given angle, 116°.', { color: '#f472b6' });
  const rayCA = mkLine(C, rayEnd, 'Draw a ray from C at 116° — A lies somewhere along it, though we don\'t yet know how far.', { color: '#94a3b8', dashed: true });
  const arcFromB = mkCircle(B, cPx, 'Since AB = c = 17.7 cm, swing an arc of that radius centred on B. Wherever it crosses the ray is a possible spot for A.', { color: '#f59e0b', opacity: 0.5, duration: 2200 });
  const markA = mkPoint(A, 'A', 'Only one crossing point actually lies on the ray in the right direction — because C is obtuse, there\'s no second valid position. A is fixed uniquely.');
  const lineCA = mkLine(C, A, '', { color: '#1e3a8a' });
  const lineBA = mkLine(B, A, 'Draw AB = c to complete the triangle.', { color: '#1e3a8a' });
  return { viewBox: '0 0 420 300', actions: [...given, arcC, rayCA, arcFromB, markA, lineCA, lineBA], caption: 'sin A = (a × sin C) ⁄ c ≈ 0.6347, so A = 39.4° and B = 180° − 116° − 39.4° = 24.6°.' };
}

function build_Example4Diagram() {
  const scale = 20;
  const B = { x: 110, y: 235 };
  const aPx = 7.1 * scale, bPx = 9.5 * scale;
  const angB = 63.3;
  const C = toXY(B, aPx, 0);
  const rayEnd = toXY(B, 380, angB);
  const candidates = lineCircleIntersect(B, rayEnd, C, bPx) || [];
  const dir = { x: rayEnd.x - B.x, y: rayEnd.y - B.y };
  const validPts = candidates.filter((p) => (p.x - B.x) * dir.x + (p.y - B.y) * dir.y > 0);
  let A = validPts[0] || candidates[0] || { x: 200, y: 90 };
  if (validPts.length > 1) {
    A = validPts.slice().sort((p, q) => triangleAngleDeg(p, B, C) - triangleAngleDeg(q, B, C))[0];
  }
  const given = [mkPoint(B, 'B', ''), mkLine(B, C, 'Draw side a = BC (7.1 cm).', { color: '#334155' }), mkPoint(C, 'C', '')];
  const arcB = mkArc(B, 42, 0, angB, 'At B, mark the given angle, 63°18′ (63.3°).', { color: '#f472b6' });
  const rayBA = mkLine(B, rayEnd, 'Draw a ray from B at this angle — A lies somewhere along it.', { color: '#94a3b8', dashed: true });
  const arcFromC = mkCircle(C, bPx, 'Since CA = b = 9.5 cm, swing an arc of that radius centred on C.', { color: '#f59e0b', opacity: 0.5, duration: 2200 });
  const markA = mkPoint(A, 'A', 'This arc could cross the ray twice — but since a < b, angle A must be smaller than angle B, so A has to be the acute solution.');
  const lineBA2 = mkLine(B, A, '', { color: '#1e3a8a' });
  const lineCA = mkLine(C, A, 'Draw CA = b to complete the triangle.', { color: '#1e3a8a' });
  return { viewBox: '0 0 420 300', actions: [...given, arcB, rayBA, arcFromC, markA, lineBA2, lineCA], caption: 'A = 41.89° (rejecting 138.11°, since a < b ⇒ A < B), so C = 180° − 63.3° − 41.89° = 74.81°, and c = (b × sin C) ⁄ sin B ≈ 10.26 cm.' };
}

// --- 4.4 Worked examples: bearings ---
function build_Example5Diagram() {
  const scale = 18;
  const A = { x: 90, y: 210 };
  const B = toXY(A, 8 * scale, 0);
  const dirAL = 90 - 62;
  const dirBL = 90 - 296;
  const L = lineLineIntersect(A, toXY(A, 400, dirAL), B, toXY(B, 400, dirBL)) || { x: 220, y: 60 };
  const given = [mkPoint(A, 'A', ''), mkLine(A, B, 'A ship sails due east from A to B, a distance of 8 km.', { color: '#334155' }), mkPoint(B, 'B', '')];
  const rayAL = mkLine(A, toXY(A, 230, dirAL), 'From A, the lighthouse L bears 062° — draw this direction as a ray.', { color: '#94a3b8', dashed: true });
  const rayBL = mkLine(B, toXY(B, 230, dirBL), 'From B, L now bears 296° — draw this direction too. Where the rays cross is L.', { color: '#94a3b8', dashed: true });
  const markL = mkPoint(L, 'L', 'Angle at A (between due east and AL) = 90° − 62° = 28°. Angle at B (between due west and BL) = 296° − 270° = 26°.');
  const lineAL = mkLine(A, L, '', { color: '#1e3a8a' });
  const lineBL = mkLine(B, L, '', { color: '#1e3a8a' });
  return { viewBox: '0 0 420 260', actions: [...given, rayAL, rayBL, markL, lineAL, lineBL], caption: 'Angle ALB = 180° − 28° − 26° = 126°, so by the sine rule, BL = (8 × sin 28°) ⁄ sin 126° ≈ 4.64 km.' };
}

function build_Example6Diagram() {
  const scale = 1.35;
  const O = { x: 110, y: 235 };
  const P = toXY(O, 120 * scale, 0);
  const dirOQ = 55;
  const dirPQ = 180 - 43;
  const Q = lineLineIntersect(O, toXY(O, 300, dirOQ), P, toXY(P, 300, dirPQ)) || { x: 200, y: 100 };
  const given = [mkPoint(O, 'O', ''), mkLine(O, P, 'Road 1 runs from junction O to peg P, 120 m away.', { color: '#334155' }), mkPoint(P, 'P', '')];
  const arcO = mkArc(O, 40, 0, dirOQ, 'Road 2 leaves O at 55° to road 1.', { color: '#f472b6' });
  const rayOQ = mkLine(O, toXY(O, 260, dirOQ), '', { color: '#94a3b8', dashed: true });
  const rayPQ = mkLine(P, toXY(P, 230, dirPQ), 'At P, the direction to Q makes an angle of 43° with the road — draw this ray until it meets road 2, at Q.', { color: '#94a3b8', dashed: true });
  const markQ = mkPoint(Q, 'Q', 'Angle OPQ = 180° − 55° − 82° = 43°.');
  const lineOQ = mkLine(O, Q, '', { color: '#1e3a8a' });
  const linePQ = mkLine(P, Q, '', { color: '#1e3a8a' });
  return { viewBox: '0 0 420 260', actions: [...given, arcO, rayOQ, rayPQ, markQ, lineOQ, linePQ], caption: 'By the sine rule, PQ ⁄ sin O = OP ⁄ sin Q, so PQ = (120 × sin 55°) ⁄ sin 82° ≈ 99.3 m.' };
}

/* =========================================================================
   WORKED EXAMPLE DATA (shared between each chapter section and the library)
   ========================================================================= */
const example1 = {
  tag: 'Worked Example 1', question: 'Find θ, where 0° ≤ θ ≤ 180°, given: (a) cos θ = 0.3420  (b) sin θ = 0.8988  (c) cos θ = −0.6157  (d) tan θ = −1.7321.',
  steps: [
    '(a) cos θ is positive, so θ is acute: θ = 70°.',
    '(b) sin θ = 0.8988 gives an acute angle of 64° — but sin(180° − 64°) = sin 64° too, so θ = 64° or 116°.',
    '(c) cos θ is negative, so θ is obtuse. The acute angle with cosine 0.6157 is 52°, so θ = 180° − 52°.',
    '(d) tan θ is negative, so θ is obtuse. The acute angle with tangent 1.7321 is 60°, so θ = 180° − 60°.',
  ],
  answer: '(a) 70°  (b) 64° or 116°  (c) 128°  (d) 120°',
};
const example2 = {
  tag: 'Worked Example 2', question: 'In triangle ABC, B = 39°, C = 82°, a = 6.73 cm. Solve the triangle completely.',
  steps: [
    'A = 180° − (39° + 82°) = 59°.',
    'By the sine rule, c ⁄ sin C = a ⁄ sin A.',
    'c = (6.73 × sin 82°) ⁄ sin 59° = 7.78 cm (2 d.p.).',
    'Similarly, b = (6.73 × sin 39°) ⁄ sin 59° ≈ 4.94 cm.',
  ],
  answer: 'A = 59°, b ≈ 4.94 cm, c ≈ 7.78 cm', build: build_Example2Diagram,
};
const example3 = {
  tag: 'Worked Example 3', question: 'In triangle ABC, a = 12.5 cm, c = 17.7 cm, C = 116°. Find the remaining angles.',
  steps: [
    'sin A ⁄ a = sin C ⁄ c, so sin A = (12.5 × sin 116°) ⁄ 17.7 = 0.6347.',
    'This gives A = 39.4° or A = 140.6° — but a triangle can only have one obtuse angle, and C is already obtuse, so A must be acute.',
    'A = 39.4°, so B = 180° − 116° − 39.4° = 24.6°.',
  ],
  answer: 'A ≈ 39.4°, B ≈ 24.6°', build: build_Example3Diagram,
};
const example4 = {
  tag: 'Worked Example 4', question: 'In triangle ABC, a = 7.1 cm, b = 9.5 cm, B = 63°18′. Solve the triangle completely.',
  steps: [
    'sin A ⁄ a = sin B ⁄ b, so sin A = (7.1 × sin 63.3°) ⁄ 9.5 = 0.6683.',
    'This gives A = 41.89° or A = 138.11° — but since a < b, angle A must be smaller than angle B (63.3°), ruling out the obtuse option.',
    'A = 41.89°, so C = 180° − 63.3° − 41.89° = 74.81°.',
    'c ⁄ sin C = b ⁄ sin B, so c = (9.5 × sin 74.81°) ⁄ sin 63.3° ≈ 10.26 cm.',
  ],
  answer: 'A ≈ 41.89°, C ≈ 74.81°, c ≈ 10.26 cm', build: build_Example4Diagram,
};
const example5 = {
  tag: 'Worked Example 5', question: 'A ship sails 8 km due east from A to B. From A, a lighthouse L bears 062°; from B, L bears 296°. Find the distance BL.',
  steps: [
    'At A, the angle between due east (AB) and AL is 90° − 62° = 28°.',
    'At B, the angle between due west (BA) and BL is 296° − 270° = 26°.',
    'So angle ALB = 180° − 28° − 26° = 126°.',
    'By the sine rule, BL ⁄ sin 28° = AB ⁄ sin 126°, so BL = (8 × sin 28°) ⁄ sin 126° ≈ 4.64 km.',
  ],
  answer: 'BL ≈ 4.64 km', build: build_Example5Diagram,
};
const example6 = {
  tag: 'Worked Example 6', question: 'Two straight roads meet at junction O at 55°. Peg P is 120 m from O along one road. On the other road, point Q is placed so that angle OQP = 82°. Find PQ.',
  steps: [
    'Angle OPQ = 180° − 55° − 82° = 43°.',
    'By the sine rule, PQ ⁄ sin O = OP ⁄ sin Q.',
    'PQ = (120 × sin 55°) ⁄ sin 82° ≈ 99.3 m.',
  ],
  answer: 'PQ ≈ 99.3 m', build: build_Example6Diagram,
};

/* =========================================================================
   CHAPTER CONTENT
   ========================================================================= */
const sections = [
  {
    id: 'obtuse-ratios',
    eyebrow: 'Chapter 4.1',
    title: 'Obtuse Ratios',
    heading: 'Trigonometric Ratios of Obtuse Angles',
    intro: "So far, sin, cos and tan have only been defined inside a right-angled triangle — which only works for acute angles. To handle obtuse angles too, picture a radius OP of length r, sweeping anticlockwise from the positive x-axis through angle θ. Drop P's projections onto both axes — OM onto Ox, ON onto Oy — and redefine the ratios in terms of those projections. Try sweeping θ past 90° below and watch what happens to each ratio.",
    customDemo: ObtuseRatioDemo,
    theorems: [
      'sin θ = projection of OP on Oy ⁄ OP,   cos θ = projection of OP on Ox ⁄ OP,   tan θ = projection on Oy ⁄ projection on Ox.',
    ],
    examples: [example1],
    practice: [
      'Without a calculator, state whether θ is acute or obtuse: sin θ = 0.5, cos θ = −0.5, tan θ = −1.',
      'Find θ between 0° and 180° such that sin θ = 0.6428.',
      'Using the projection definitions, explain why sin θ can never be negative for 0° ≤ θ ≤ 180°, even though cos θ sometimes is.',
    ],
  },
  {
    id: 'supplementary',
    eyebrow: 'Chapter 4.1',
    title: 'Supplementary Angles',
    heading: 'The Supplementary Angle Identities',
    intro: "Two points on the same circle, symmetric about the vertical axis, sit at angles θ and (180° − θ). Because they're mirror images, their projections onto Oy are identical — but their projections onto Ox are opposite in sign. That single observation proves all three identities below.",
    customDemo: SupplementIdentityDemo,
    theorems: [
      'sin(180° − θ) = sin θ',
      'cos(180° − θ) = −cos θ',
      'tan(180° − θ) = −tan θ',
    ],
    practice: [
      'Without a calculator, write down sin 150°, given that sin 30° = 0.5.',
      'If cos 40° = 0.766, write down cos 140° without recalculating.',
      'A student says tan 170° must be positive because "170° is close to 180°, which is like 0°." Explain what\'s wrong, using the identity above.',
    ],
  },
  {
    id: 'sine-rule',
    eyebrow: 'Chapter 4.2',
    title: 'The Sine Rule',
    heading: 'Proving the Sine Rule',
    intro: "Drop a perpendicular from one vertex of a triangle to the opposite side, and two right-angled triangles appear, sharing that perpendicular as a common height. Writing sin of each base angle in terms of that shared height links two sides and their opposite angles together — and the same trick works for every pair of sides, giving one continuous chain of equal ratios.",
    theorems: [
      'a ⁄ sin A = b ⁄ sin B = c ⁄ sin C, where a, b, c are the sides opposite angles A, B, C.',
    ],
    players: [
      { title: 'Proof — Acute-Angled Triangle', caption: null, build: build_SineRuleProofAcute },
      { title: 'Proof — Obtuse-Angled Triangle', caption: null, build: build_SineRuleProofObtuse },
    ],
    practice: [
      'State the two situations in which the sine rule can be used to solve a triangle.',
      'In triangle PQR, only the three sides p, q, r are known. Explain why the sine rule can\'t be used directly here.',
      'In your own words, explain why the proof needs the supplementary-angle identity when one angle of the triangle is obtuse.',
    ],
  },
  {
    id: 'solving-triangles',
    eyebrow: 'Chapter 4.3',
    title: 'Solving Triangles',
    heading: 'Solving Triangles Completely',
    intro: "\"Solve the triangle completely\" means finding every missing side and angle. The sine rule handles two situations: two angles and any side (subtract from 180° for the third angle, then use the rule directly), or two sides and the angle opposite one of them — which is trickier, since it can sometimes produce two different valid triangles from the same data. Watch for that ambiguous case in Examples 3 and 4.",
    definition: 'The sine rule solves a triangle when given either (i) two angles and any side, or (ii) two sides and the angle opposite one of them — though case (ii) can have two solutions, one solution, or none.',
    examples: [example2, example3, example4],
    practice: [
      'In triangle ABC, A = 54°12′, B = 71°30′, a = 12.4 cm. Find b.',
      'In triangle ABC, a = 65 m, b = 32 m, A = 115°. Solve the triangle completely — is there an ambiguous case here? Explain why or why not.',
      'Two sides of a triangle are 8 cm and 11 cm, and the angle opposite the 8 cm side is 35°. Show this gives two possible triangles, and find both possible values of the angle opposite the 11 cm side.',
    ],
  },
  {
    id: 'bearings',
    eyebrow: 'Chapter 4.4',
    title: 'Bearings',
    heading: 'Bearings and Distances',
    intro: "A three-figure bearing measures a direction clockwise from north, always written with three digits — 072°, not 72°. The same direction can be written as a compass bearing instead, like N72°E, measuring the angle away from north or south, toward east or west. Bearings problems almost always boil down to an ordinary triangle — the compass directions just tell you which angles to mark.",
    customDemo: BearingCompassDemo,
    definition: 'A bearing is always measured clockwise from north and written as three digits, e.g. 053°, 090°, 246°.',
    examples: [example5, example6],
    practice: [
      'A ship sails from port on a bearing of 048° for 15 km. Sketch this as an angle measured from north, and convert it to a compass bearing.',
      'From a tower, two landmarks are observed on bearings of 034° and 112°. What additional information would you need to find the distance between the landmarks using the sine rule?',
      'Convert the bearing S28°W into a three-figure bearing.',
    ],
  },
  {
    id: 'example-library',
    eyebrow: 'Reference',
    title: 'Example Library',
    heading: 'Worked Example Library',
    intro: "Every worked example from this chapter, gathered in one place. Use this page to revise the sine rule's two use-cases — and the bearings problems that lean on it — without the surrounding explanation, or to find the closest match to a problem you're stuck on.",
    isLibrary: true,
    examples: [example1, example2, example3, example4, example5, example6],
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */
const Section = ({ section }) => (
  <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
    <div className="mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{section.eyebrow}</span>
      <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
    </div>

    <div className="mb-6">
      <p className="mb-4 leading-relaxed text-slate-700">{section.intro}</p>

      {section.customDemo && <section.customDemo />}

      {section.theorems && section.theorems.length > 0 && (
        <div className="mb-6 space-y-3">
          {section.theorems.map((t, i) => (
            <DefinitionBox key={i} label={section.theorems.length > 1 ? `Identity ${i + 1}` : 'Theorem'}>{t}</DefinitionBox>
          ))}
        </div>
      )}
      {section.definition && <DefinitionBox>{section.definition}</DefinitionBox>}

      {section.players && section.players.map((p, i) => {
        const built = p.build();
        return <ConstructionPlayer key={i} title={p.title} viewBox={built.viewBox} actions={built.actions} caption={p.caption ?? built.caption} />;
      })}
    </div>

    {section.examples && section.examples.length > 0 && (
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">{section.isLibrary ? 'All Worked Examples' : 'Worked Examples'}</h3>
        {section.examples.map((ex, i) => (
          <ExampleCard key={i} index={i + 1} example={ex} />
        ))}
      </div>
    )}

    {section.practice && section.practice.length > 0 && <PracticeZone items={section.practice} />}
  </section>
);

export const TheSineRule = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState('en');
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];

  const handleNavigate = (id) => {
    setActive(id);
    requestAnimationFrame(() => {
      const lessonScrollArea = document.getElementById('lesson-scroll-area');
      if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };
  const goNext = () => { const n = sections[activeIndex + 1]; if (n) handleNavigate(n.id); };
  const goPrev = () => { const p = sections[activeIndex - 1]; if (p) handleNavigate(p.id); };

  return (
    <div id="sr-scroll-area" className="min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />
      {/* Duolingo Gradient Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 border-b-4 border-rose-700 pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-rose-300/30 text-white border border-rose-200/40`}>CHAPTER 4</span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
              </button>
              <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">The Sine Rule</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "Ratio dzekona dzakapamhama, mutemo we sine, kugadzirisa triangle zvakakwana, nemibvunzo ye bearings. Kana mutemo we sine uchinzwika, triangle yose inogadziriswa." : "Ratios for obtuse angles, the sine rule, solving triangles completely, and bearings problems. Once the sine rule clicks, every triangle becomes solvable — no right angle required."}
          </p>
        </div>
      </div>

      {/* Left-aligned pill navigation */}
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div id="math-topic-rail" data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button key={s.id} data-topic-id={s.id} onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
        <div key={activeSection.id}>
          <Section section={activeSection} />
        </div>
        <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button onClick={goPrev} disabled={activeIndex === 0}
            className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
          <button onClick={goNext} disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheSineRule;
