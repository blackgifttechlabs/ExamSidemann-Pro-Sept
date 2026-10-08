import './mathLessonTheme.css';

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
    duration: opts.duration ?? ((r <= 70 && !opts.dashed) ? 2200 : 1000), color: opts.color ?? '#f472b6', width: opts.width ?? 1.6,
    opacity: opts.opacity ?? 0.75, dashed: opts.dashed ?? false, center, r, a0, a1, protractor: opts.protractor ?? (r <= 70 && !opts.dashed),
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
const mkEq = (text, narration, opts: any = {}) => ({
  id: nextId(), kind: 'eq', text, narration, duration: opts.duration ?? 300, color: opts.color ?? '#0f172a',
});

const mkText = (p, text, narration, opts: any = {}) => ({
  id: nextId(), kind: 'text', p, text, narration, flash: opts.flash ?? null, duration: opts.duration ?? (opts.flash ? 1600 : 1000),
  color: opts.color ?? '#0f172a', size: opts.size ?? 17, anchor: opts.anchor ?? 'middle',
});

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
  if (action.kind === 'eq') return null;
  if (action.kind === 'text') {
    const rise = Math.min(1, progress / 0.5);
    const settle = progress < 0.5 ? 0 : (progress - 0.5) / 0.5;
    const ease = 1 - Math.pow(1 - settle, 3);
    const lift = rise * (1 - ease);
    const pulse = action.flash && progress < 1 ? Math.abs(Math.sin(progress * Math.PI * 2)) : 0;
    return (
      <g>
        {pulse > 0.02 && (
          <line x1={action.flash.from.x} y1={action.flash.from.y} x2={action.flash.to.x} y2={action.flash.to.y} stroke="#ef4444" strokeWidth="6" strokeLinecap="round" strokeOpacity={pulse} />
        )}
        <text transform={`translate(${action.p.x} ${action.p.y - 30 * lift}) scale(${1 + 0.6 * lift})`} className="gc-hand" fontSize={action.size} fontWeight="700" fill={progress < 1 ? '#f59e0b' : action.color} textAnchor={action.anchor} style={{ opacity: Math.min(1, progress * 4) }}>{action.text}</text>
      </g>
    );
  }
  if (action.kind === 'text') {
    return (
      <text x={action.p.x} y={action.p.y} className="gc-hand" fontSize={action.size} fontWeight="700" fill={action.color} textAnchor={action.anchor} style={{ opacity: Math.min(1, progress * 2) }}>{action.text}</text>
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
  if (action.kind === 'point' || action.kind === 'text') return progress;
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

const ProtractorInstrument = ({ pos, a0, a1, progress, drawProgress, moveProgress }) => {
  const R = 72;
  const delta = a1 - a0;
  const sign = delta >= 0 ? 1 : -1;
  const ease = 1 - Math.pow(1 - moveProgress, 3);
  const appear = Math.min(1, progress / 0.2);
  const fadeOut = progress > 0.92 ? (1 - progress) / 0.08 : 1;
  const opacity = Math.max(0, Math.min(1, appear * fadeOut));
  const scale = 0.7 + 0.3 * ease;
  const cur = Math.abs(delta) * drawProgress;
  const curRad = (cur * Math.PI) / 180;
  const full = Math.abs(delta) > 180;
  const ticks = [];
  for (let k = 0; k <= (full ? 355 : 180); k += 5) {
    const len = k % 30 === 0 ? 11 : k % 10 === 0 ? 8 : 4.5;
    const c = Math.cos((k * Math.PI) / 180), sn = Math.sin((k * Math.PI) / 180);
    ticks.push(<line key={k} x1={R * c} y1={-R * sn} x2={(R - len) * c} y2={-(R - len) * sn} stroke="#0369a1" strokeWidth={k % 10 === 0 ? 0.9 : 0.5} />);
  }
  const labels = (full ? [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] : [0, 30, 60, 90, 120, 150, 180]).map((k) => {
    const lp = toXY(pos, (R - 20) * scale, a0 + sign * k);
    return <text key={k} x={lp.x} y={lp.y + 2.5} textAnchor="middle" fontSize="7" fontWeight="700" fill="#075985">{k}</text>;
  });
  const bubble = toXY(pos, (R + 17) * scale, a0 + sign * cur);
  return (
    <g className="pointer-events-none" style={{ opacity, filter: 'drop-shadow(0 2px 3px rgba(15,23,42,.25))' }}>
      <g transform={`translate(${pos.x} ${pos.y}) rotate(${-a0}) scale(${scale} ${sign * scale})`}>
        {full ? <circle cx="0" cy="0" r={R} fill="rgba(186,230,253,0.45)" stroke="#0284c7" strokeWidth="1.1" /> : <path d={`M ${R} 0 A ${R} ${R} 0 0 0 ${-R} 0 Z`} fill="rgba(186,230,253,0.45)" stroke="#0284c7" strokeWidth="1.1" />}
        <path d={`M ${R * 0.34} 0 A ${R * 0.34} ${R * 0.34} 0 0 0 ${-R * 0.34} 0`} fill="none" stroke="#7dd3fc" strokeWidth="0.7" />
        {cur > 0.5 && <path d={`M 0 0 L ${R} 0 A ${R} ${R} 0 ${cur > 180 ? 1 : 0} 0 ${R * Math.cos(curRad)} ${-R * Math.sin(curRad)} Z`} fill="rgba(244,114,182,0.28)" />}
        {ticks}
        <line x1={-R - 8} y1="0" x2={R + 8} y2="0" stroke="#0369a1" strokeWidth="1" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#0369a1" strokeWidth="0.8" />
        <line x1="0" y1="0" x2={R * Math.cos(curRad)} y2={-R * Math.sin(curRad)} stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="2.5" fill="#dc2626" />
      </g>
      {labels}
      <g>
        <rect x={bubble.x - 15} y={bubble.y - 8} width="30" height="14" rx="4" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
        <text x={bubble.x} y={bubble.y + 3} textAnchor="middle" fontSize="9" fontWeight="800" fill="#dc2626">{Math.round(cur)}°</text>
      </g>
    </g>
  );
};

const DrawingInstrument = ({ action, progress, previousAnchor }) => {
  if (!action || action.kind === 'point' || action.kind === 'text') return null;
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

  if (action.protractor && action.center) {
    const pos = { x: startAnchor.x + (targetAnchor.x - startAnchor.x) * moveProgress, y: startAnchor.y + (targetAnchor.y - startAnchor.y) * moveProgress };
    return <ProtractorInstrument pos={pos} a0={action.a0} a1={action.a1} progress={progress} drawProgress={drawProgress} moveProgress={moveProgress} />;
  }

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

const TYPE_MS = 32;

const MathFrac = ({ n, d }) => (
  <span className="mx-1 inline-flex flex-col items-center align-middle leading-tight">
    <span className="px-1 pb-0.5">{n}</span>
    <span className="w-full border-t-2 border-current" />
    <span className="px-1 pt-0.5">{d}</span>
  </span>
);

const EqMath = ({ text }) => {
  const parts = text.split(' = ');
  return (
    <span className="inline-flex flex-wrap items-center justify-center gap-x-2 lg:flex-nowrap" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontStyle: 'italic' }}>
      {parts.map((part, i) => {
        const f = part.split(' ⁄ ');
        return (
          <React.Fragment key={i}>
            {i > 0 && <span style={{ fontStyle: 'normal' }}>=</span>}
            {f.length === 2 ? <MathFrac n={f[0]} d={f[1]} /> : <span>{part}</span>}
          </React.Fragment>
        );
      })}
    </span>
  );
};

const ConstructionPlayer = ({ title, viewBox = '0 0 420 300', actions, caption }) => {
  const withRange = useMemo(() => {
    let acc = 0;
    return actions.map((a) => {
      const hold = a.narration ? Math.round(a.narration.length * TYPE_MS + 800) : 0;
      const start = acc;
      const drawStart = start + hold;
      acc = drawStart + a.duration;
      return { ...a, start, drawStart, end: acc };
    });
  }, [actions]);
  const total = withRange.length ? withRange[withRange.length - 1].end : 0;
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
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


  const spoken = [...withRange].reverse().find((a) => a.narration && time >= a.start);
  const eqs = withRange.filter((a) => a.kind === 'eq' && time >= a.drawStart);
  const boardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = boardRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [eqs.length]);

  const toggle = () => {
    if (time >= total) { setTime(0); setPlaying(true); }
    else setPlaying((p) => !p);
  };
  const restart = () => { setTime(0); setPlaying(true); };
  const currentIndex = withRange.findIndex((action) => time >= action.start && time < action.end);
  const currentAction = currentIndex >= 0 ? withRange[currentIndex] : null;
  const currentProgress = currentAction
    ? clamp01((time - currentAction.drawStart) / Math.max(1, currentAction.duration))
    : 0;
  const previousAnchor = currentIndex > 0
    ? [...withRange.slice(0, currentIndex)].reverse().map(anchorForAction).find(Boolean) ?? null
    : null;
  const timelinePercent = total > 0 ? (time / total) * 100 : 0;
  const paddedViewBox = useMemo(() => {
    const [x, y, width, height] = viewBox.trim().split(/\s+/).map(Number);
    if (![x, y, width, height].every(Number.isFinite)) return viewBox;
    const padX = width * 0.2;
    const padY = height * 0.2;
    return `${x - padX} ${y - padY} ${width + padX * 2} ${height + padY * 2}`;
  }, [viewBox]);

  return (
    <div className="mb-4 flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white lg:h-[min(34rem,calc(100dvh-7rem))]">
      {title && <div className="shrink-0 border-b border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-500">{title}</div>}
      <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1">
        <div className="h-24 shrink-0 overflow-y-auto border-b border-neutral-200 px-3 py-2 sm:h-16">
          {!spoken && <p className="text-base text-neutral-400">Press play to begin…</p>}
          {spoken && (
            <p className={`text-[14px] leading-snug ${time < spoken.drawStart ? 'text-neutral-900' : 'text-neutral-500'}`}>
              {time < spoken.drawStart ? spoken.narration.slice(0, Math.max(0, Math.floor((time - spoken.start) / TYPE_MS))) : spoken.narration}
            </p>
          )}
        </div>
        <div className="flex min-w-0 flex-col lg:min-h-0 lg:flex-1 lg:flex-row">
          <div className="relative h-64 min-w-0 shrink-0 bg-neutral-50 sm:h-72 lg:h-auto lg:min-h-0 lg:flex-1">
            <svg viewBox={paddedViewBox} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
              {withRange.map((a) => {
                if (time < a.drawStart) return null;
                const progress = clamp01((time - a.drawStart) / Math.max(1, a.duration));
                return <ActionShape key={a.id} action={a} progress={drawProgressFor(a, progress)} />;
              })}
              <DrawingInstrument action={currentAction && time >= currentAction.drawStart ? currentAction : null} progress={currentProgress} previousAnchor={previousAnchor} />
            </svg>
          </div>
          <div ref={boardRef} className={`flex shrink-0 flex-col overflow-auto border-t border-neutral-200 bg-white px-4 py-3 lg:w-[58%] lg:border-l lg:border-t-0 ${eqs.length > 0 ? '' : 'hidden lg:flex'}`}>
            <div className="my-auto flex w-full flex-col gap-y-3">
              {eqs.map((e) => (
                <div key={e.id} className={`text-center text-[18px] font-semibold lg:whitespace-nowrap lg:text-[20px] xl:text-[22px] ${eqs.indexOf(e) > 0 && eqs[eqs.indexOf(e) - 1].color !== e.color ? 'border-t border-neutral-200 pt-3' : ''}`} style={{ color: e.color }}><EqMath text={e.text} /></div>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 border-t border-neutral-200 bg-white px-3 py-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <button onClick={toggle} className="shrink-0 rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 active:scale-95">
              {playing ? 'Pause' : time >= total ? 'Replay' : time > 0 ? 'Resume' : 'Play'}
            </button>
            <button onClick={restart} className="shrink-0 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">
              Restart
            </button>
            <div className="order-last flex w-full min-w-0 items-center gap-2 text-xs tabular-nums text-neutral-500 sm:order-none sm:w-auto sm:flex-1">
              <span>{formatPlayerTime(time)}</span>
              <input
                type="range" min={0} max={total} value={time}
                onChange={(e) => { setPlaying(false); setTime(Number(e.target.value)); }}
                aria-label="Construction timeline"
                className="gc-timeline block min-w-0 flex-1 cursor-pointer"
                style={{ background: `linear-gradient(to right, #171717 0%, #171717 ${timelinePercent}%, #e5e5e5 ${timelinePercent}%, #e5e5e5 100%)` }}
              />
              <span>{formatPlayerTime(total)}</span>
            </div>
            <label className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500 sm:ml-0">
              Speed
              <select
                value={speed}
                onChange={(event) => setSpeed(Number(event.target.value))}
                className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-sm text-neutral-700 outline-none focus:border-neutral-400"
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
      {caption && <p className="shrink-0 border-t border-neutral-200 px-3 py-2 text-sm leading-snug text-neutral-500">{caption}</p>}
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
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3 text-base font-extrabold text-slate-900">Trig Ratios by Projection</div>
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
            <div className="mt-2 flex items-center justify-between text-base font-bold text-slate-700">
              <span>θ = {theta}°</span>
              <span>{isObtuse ? 'Obtuse' : 'Acute'}</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-base font-bold uppercase tracking-wide text-slate-700">Live values</h5>
          <p className="text-[22px] font-bold leading-snug text-slate-900">
            sin θ = ON ⁄ OP = {sinT.toFixed(4)}<br />
            cos θ = OM ⁄ OP = {cosT.toFixed(4)}<br />
            tan θ = ON ⁄ OM = {tanT.toFixed(4)}
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
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
   SUPPLEMENTARY ANGLE IDENTITIES: styled explanation on top, diagram under
   ========================================================================= */
// Bolds the key words inside explanation text
const RICH_RE = /(\b(?:sin|cos|tan)(?:\([^)]*\)| θ)?|\bHIGH\b|\bACROSS\b|\bARE\b|\bNOT\b)/g;
const rich = (text: string) =>
  text.split(RICH_RE).map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-extrabold text-slate-950">{part}</strong> : part
  );

const SpeedPicker = ({ speed, setSpeed }: { speed: number; setSpeed: (n: number) => void }) => (
  <div className="flex items-center gap-1.5">
    {[0.25, 0.5, 1, 2].map((v) => (
      <button
        key={v}
        type="button"
        onClick={() => setSpeed(v)}
        className={`rounded-full px-3 py-1 text-base font-black transition ${speed === v ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      >
        {v}×
      </button>
    ))}
  </div>
);

const SinCosAnimated = () => {
  const O = { x: 210, y: 135 };
  const r = 100;
  const [theta, setTheta] = useState(35);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.5);
  const dirRef = useRef(1);

  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setTheta((t) => {
        let nt = t + dirRef.current * dt * 0.03 * speed;
        if (nt >= 175) { nt = 175; dirRef.current = -1; }
        if (nt <= 5) { nt = 5; dirRef.current = 1; }
        return nt;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const rad = (theta * Math.PI) / 180;
  const sinV = Math.sin(rad);
  const cosV = Math.cos(rad);
  const P = toXY(O, r, theta);
  const foot = { x: P.x, y: O.y };
  const arcEnd = toXY(O, 34, theta);
  const onRight = cosV >= 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <svg viewBox="-40 0 500 270" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label="Animated circle. Point P moves round the circle. Height is sin and across is cos.">
        <line x1="40" y1="135" x2="380" y2="135" stroke="#312e81" strokeWidth="2" />
        <line x1="210" y1="20" x2="210" y2="250" stroke="#312e81" strokeWidth="1.5" />
        <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="2" />
        <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke="#1e3a8a" strokeWidth="3" />
        <line x1={foot.x} y1={foot.y} x2={P.x} y2={P.y} stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
        <line x1={O.x} y1={O.y} x2={foot.x} y2={foot.y} stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
        <path d={`M ${O.x + 34} ${O.y} A 34 34 0 0 0 ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke="#312e81" strokeWidth="1.5" />
        <circle cx={P.x} cy={P.y} r="6" fill="#1e3a8a" />
        <text x={P.x + (onRight ? 10 : -10)} y={P.y - 8} textAnchor={onRight ? 'start' : 'end'} fontSize="18" fontWeight="700" fill="#1e3a8a">P</text>
        <text x={O.x - 16} y={O.y + 18} fontSize="16" fontWeight="700" fill="#1e1b4b">O</text>
        <text x={P.x + (onRight ? 12 : -12)} y={(P.y + O.y) / 2 + 5} textAnchor={onRight ? 'start' : 'end'} fontSize="16" fontWeight="800" fill="#b45309">sin θ = height</text>
        <text x={(O.x + foot.x) / 2} y={O.y + 28} textAnchor="middle" fontSize="16" fontWeight="800" fill="#dc2626">cos θ = across</text>
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-lg font-extrabold text-slate-900 sm:text-xl">θ = {Math.round(theta)}°</div>
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-lg font-extrabold text-slate-700 sm:text-xl">sin = {sinV.toFixed(2)}</div>
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-lg font-extrabold text-slate-700 sm:text-xl">cos = {cosV.toFixed(2)}</div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          className="shrink-0 rounded-full border-2 border-b-4 border-emerald-700 bg-emerald-500 px-5 py-1.5 text-base font-black text-white active:translate-y-0.5"
        >
          {playing ? 'PAUSE' : 'PLAY ▶'}
        </button>
        <SpeedPicker speed={speed} setSpeed={setSpeed} />
      </div>
      <input
        type="range" min={1} max={179} value={Math.round(theta)}
        onChange={(e) => { setPlaying(false); setTheta(Number(e.target.value)); }}
        aria-label="Change the angle"
        className="mt-3 w-full cursor-pointer"
      />
    </div>
  );
};

const SinMirrorAnimated = () => {
  const O = { x: 210, y: 135 };
  const r = 100;
  const [theta, setTheta] = useState(35);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.5);
  const dirRef = useRef(1);

  useEffect(() => {
    if (!playing) return undefined;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setTheta((t) => {
        let nt = t + dirRef.current * dt * 0.025 * speed;
        if (nt >= 85) { nt = 85; dirRef.current = -1; }
        if (nt <= 5) { nt = 5; dirRef.current = 1; }
        return nt;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed]);

  const rad = (theta * Math.PI) / 180;
  const sinV = Math.sin(rad);
  const cosV = Math.cos(rad);
  const P = toXY(O, r, theta);
  const Q = toXY(O, r, 180 - theta);
  const t = Math.round(theta);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <svg viewBox="0 0 420 270" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label="Animated circle. P and Q are mirror images and always at the same height.">
        <line x1="40" y1="135" x2="380" y2="135" stroke="#312e81" strokeWidth="2" />
        <line x1="210" y1="20" x2="210" y2="250" stroke="#312e81" strokeWidth="1.5" strokeDasharray="6 4" />
        <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="2" />
        <line x1={Q.x} y1={Q.y} x2={P.x} y2={P.y} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="6 4" />
        <line x1={P.x} y1={P.y} x2={P.x} y2={O.y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <line x1={Q.x} y1={Q.y} x2={Q.x} y2={O.y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
        <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} stroke="#1e3a8a" strokeWidth="3" />
        <line x1={O.x} y1={O.y} x2={Q.x} y2={Q.y} stroke="#be185d" strokeWidth="3" />
        <circle cx={P.x} cy={P.y} r="6" fill="#1e3a8a" />
        <circle cx={Q.x} cy={Q.y} r="6" fill="#be185d" />
        <text x={P.x + 10} y={P.y - 8} fontSize="18" fontWeight="700" fill="#1e3a8a">P</text>
        <text x={Q.x - 10} y={Q.y - 8} textAnchor="end" fontSize="18" fontWeight="700" fill="#be185d">Q</text>
        <text x={O.x - 16} y={O.y + 18} fontSize="16" fontWeight="700" fill="#1e1b4b">O</text>
      </svg>

      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-base font-extrabold text-slate-700 sm:text-lg">
          sin {t}° = {sinV.toFixed(2)}<br />sin {180 - t}° = {sinV.toFixed(2)}<br />
          <span className="text-base">✔ SAME</span>
        </div>
        <div className="rounded-xl bg-slate-50 px-2 py-2 text-base font-extrabold text-slate-700 sm:text-lg">
          cos {t}° = {cosV.toFixed(2)}<br />cos {180 - t}° = {(-cosV).toFixed(2)}<br />
          <span className="text-base">↔ SIGN FLIPS</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          className="shrink-0 rounded-full border-2 border-b-4 border-emerald-700 bg-emerald-500 px-5 py-1.5 text-base font-black text-white active:translate-y-0.5"
        >
          {playing ? 'PAUSE' : 'PLAY ▶'}
        </button>
        <SpeedPicker speed={speed} setSpeed={setSpeed} />
      </div>
      <input
        type="range" min={1} max={89} value={t}
        onChange={(e) => { setPlaying(false); setTheta(Number(e.target.value)); }}
        aria-label="Change the angle"
        className="mt-3 w-full cursor-pointer"
      />
    </div>
  );
};

const SupplementIdentityDemo = () => {
  return (
    <div className="mb-6 w-full min-w-0 max-w-full space-y-4 font-sans">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">Official Definition</div>
        <p className="mt-2 whitespace-pre-line break-words text-[22px] sm:text-[26px] font-bold leading-snug text-slate-900">{rich('Supplementary angles are two angles that fit together to make a straight line.')}</p>
        <p className="mt-3 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-900">{rich('A straight line is 180°.\nSo if you add the two angles, the answer must be exactly 180°.\n\n✔ Example: 130° + 50° = 180°.\nThe total is 180°, so these angles ARE supplementary.\n\n✘ Example: 100° + 60° = 160°.\nThe total is not 180°, so these angles are NOT supplementary.\n\nTip: to find the missing angle, take the angle you know away from 180°.\nExample: 180° − 130° = 50°.')}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-4">
        <svg viewBox="0 0 420 190" className="mx-auto h-auto w-full max-w-xl" role="img" aria-label="A straight line split into 130 degrees and 50 degrees, which add up to 180 degrees">
          <defs>
            <marker id="suppArrowDark" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#312e81" />
            </marker>
            <marker id="suppArrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
          </defs>
          <line x1="10" y1="160" x2="410" y2="160" stroke="#312e81" strokeWidth="3" markerStart="url(#suppArrowDark)" markerEnd="url(#suppArrowDark)" />
          <line x1="215" y1="160" x2="337" y2="15" stroke="#312e81" strokeWidth="3" markerEnd="url(#suppArrowDark)" />
          <path d="M 215 160 L 177 160 A 38 38 0 0 1 239.4 130.9 Z" fill="#4f6df5" />
          <path d="M 215 160 L 245 160 A 30 30 0 0 0 234.3 137 Z" fill="#f59e0b" />
          <text x="118" y="146" fontSize="22" fontWeight="700" fill="#1e1b4b">130°</text>
          <text x="252" y="156" fontSize="22" fontWeight="700" fill="#1e1b4b">50°</text>
          <path d="M 150 112 Q 215 62 282 118" fill="none" stroke="#ef4444" strokeWidth="2" markerStart="url(#suppArrowRed)" markerEnd="url(#suppArrowRed)" />
          <text x="183" y="78" fontSize="24" fontWeight="700" fill="#ef4444">= 180°</text>
        </svg>
        <p className="mt-2 text-center text-lg font-semibold text-slate-900">130° + 50° = 180°, so they are supplementary angles.</p>
      </div>

      <hr className="my-2 border-t-2 border-slate-200" />

      <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-4xl">First: what are sin, cos and tan?</h3>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">Start here</div>
        <p className="mt-2 break-words text-[22px] sm:text-[26px] font-bold leading-snug text-slate-900"><span className="rounded-md bg-amber-200 px-1.5 py-0.5 text-slate-800">sin</span>, <span className="rounded-md bg-red-200 px-1.5 py-0.5 text-slate-700">cos</span> and <span className="rounded-md bg-sky-200 px-1.5 py-0.5 text-slate-800">tan</span> are three numbers that describe an angle.</p>
        <p className="mt-3 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-900">{rich('To see them, draw a circle with the middle point O.\nDraw a line from O to a point P on the circle.\nThe angle θ is the opening between the flat line and OP.\n\nNow look at where P is:\n● sin θ is how HIGH P is above the flat line.\n● cos θ is how far P is ACROSS from the middle. Right is positive, left is negative.\n● tan θ is height divided by across. So tan θ = sin θ ÷ cos θ.\n\nIn this picture the circle has radius 1, so the height and the distance across are exactly the sin and cos numbers.')}</p>
      </div>

      <SinCosAnimated />

      <hr className="my-2 border-t-2 border-slate-200" />

      <h3 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-4xl">Now: how supplementary angles change them</h3>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">The big idea</div>
        <p className="mt-2 whitespace-pre-line break-words text-[22px] sm:text-[26px] font-bold leading-snug text-slate-900">{rich('Supplementary angles are mirror images on the circle.')}</p>
        <p className="mt-3 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-900">{rich('Put point P at angle θ.\nPut point Q at angle 180° − θ.\nThese two angles add up to 180°, so they are supplementary.\n\nLook at the picture below.\nQ is exactly where P would be if you held P up to a mirror standing straight up through O.\nSo P and Q are the same height, but on opposite sides.\n\nThis one idea gives us all three identities.')}</p>
      </div>

      <SinMirrorAnimated />

      <h3 className="pt-2 text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-4xl">The three identities</h3>

      <div className="rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">Identity 1</div>
        <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">sin(180° − θ) = sin θ</p>
        <p className="mt-2 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-600">{rich('sin is the height.\nP and Q are mirror images, so they are at the same height.\nSo they have the same sin.\nExample: sin 30° = 0.5 and sin 150° = 0.5.')}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">Identity 2</div>
        <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">cos(180° − θ) = −cos θ</p>
        <p className="mt-2 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-600">{rich('cos is how far across the point is.\nP and Q are the same distance from the middle, but on opposite sides.\nP is on the right, so its cos is positive.\nQ is on the left, so its cos is negative.\nSo the number is the same, but the sign flips.\nExample: cos 30° = 0.866 and cos 150° = −0.866.')}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">Identity 3</div>
        <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900">tan(180° − θ) = −tan θ</p>
        <p className="mt-2 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-600">{rich('tan = sin ÷ cos.\nThe sin stays the same.\nThe cos flips sign.\nSo the answer flips sign too.\nExample: tan 45° = 1 and tan 135° = −1.')}</p>
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
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3 text-base font-extrabold text-slate-900">Reading a Bearing</div>
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
          <h5 className="mb-2 text-base font-bold uppercase tracking-wide text-slate-700">Two ways to write it</h5>
          <p className="text-[26px] font-bold leading-snug text-slate-900">
            {String(Math.round(bearing)).padStart(3, '0')}°<br />
            {quadrant(bearing)}
          </p>
          <p className="mt-3 text-base leading-relaxed text-slate-600">A three-figure bearing always has three digits and is measured clockwise from north. The compass form measures away from N or S, toward E or W.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
const SineRuleTriangleFigure = () => (
  <div className="sine-rule-fig-pair mb-6 grid items-center gap-4 md:grid-cols-2">
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <svg viewBox="0 0 300 190" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label="Triangle ABC with sides a, b, c opposite angles A, B, C">
        <path d="M20 155 L50 155 A30 30 0 0 0 42.98 135.72 Z" fill="#c7e86b" />
        <path d="M250 155 L220 155 A30 30 0 0 1 235 129.02 Z" fill="#60a5fa" />
        <path d="M175 25 L152.02 44.28 A30 30 0 0 0 190 50.98 Z" fill="#f472b6" />
        <path d="M20 155 L250 155 L175 25 Z" fill="none" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
        <text x="2" y="172" fontSize="22" fontWeight="800" fill="#0f172a">A</text>
        <text x="254" y="172" fontSize="22" fontWeight="800" fill="#0f172a">B</text>
        <text x="166" y="16" fontSize="22" fontWeight="800" fill="#0f172a">C</text>
        <text x="84" y="82" fontSize="20" fontWeight="800" fontStyle="italic" fill="#0f172a">b</text>
        <text x="216" y="88" fontSize="20" fontWeight="800" fontStyle="italic" fill="#0f172a">a</text>
        <text x="130" y="182" fontSize="20" fontWeight="800" fontStyle="italic" fill="#0f172a">c</text>
      </svg>
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <svg viewBox="0 0 300 190" className="mx-auto h-auto w-full max-w-sm" role="img" aria-label="The sine rule written in both forms">
        <g fontSize="22" fontStyle="italic" fill="#0f172a" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif">
          <text x="45" y="36">sin A</text><line x1="15" y1="44" x2="75" y2="44" stroke="#0f172a" strokeWidth="1.5" /><text x="45" y="66">a</text>
          <text x="100" y="56" fontStyle="normal">=</text>
          <text x="150" y="36">sin B</text><line x1="120" y1="44" x2="180" y2="44" stroke="#0f172a" strokeWidth="1.5" /><text x="150" y="66">b</text>
          <text x="200" y="56" fontStyle="normal">=</text>
          <text x="255" y="36">sin C</text><line x1="225" y1="44" x2="285" y2="44" stroke="#0f172a" strokeWidth="1.5" /><text x="255" y="66">c</text>

          <text x="150" y="104" fontSize="20" fontWeight="800" fontStyle="normal" fill="#10b981" fontFamily="inherit">OR</text>

          <text x="45" y="136">a</text><line x1="15" y1="144" x2="75" y2="144" stroke="#0f172a" strokeWidth="1.5" /><text x="45" y="166">sin A</text>
          <text x="100" y="156" fontStyle="normal">=</text>
          <text x="150" y="136">b</text><line x1="120" y1="144" x2="180" y2="144" stroke="#0f172a" strokeWidth="1.5" /><text x="150" y="166">sin B</text>
          <text x="200" y="156" fontStyle="normal">=</text>
          <text x="255" y="136">c</text><line x1="225" y1="144" x2="285" y2="144" stroke="#0f172a" strokeWidth="1.5" /><text x="255" y="166">sin C</text>
        </g>
      </svg>
    </div>
  </div>
);

const DefinitionBox = ({ children, label = 'Definition' }) => (
  <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
    <div className="text-base font-bold uppercase tracking-wide text-slate-700">{label === 'Definition' ? 'Official Definition' : label}</div>
    <p className="mt-2 break-words text-[22px] font-bold leading-snug text-slate-900 sm:text-[26px]">{children}</p>
  </div>
);

const ExampleCard = ({ index, example }) => {
  const [open, setOpen] = useState(false);
  const diagram = useMemo(() => (open && example.build ? example.build() : null), [open, example]);
  return (
    <div className="mb-3 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-start gap-3 px-4 pb-3 pt-3.5">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-neutral-300 text-xs font-semibold tabular-nums text-neutral-700">{index}</span>
        <div className="min-w-0 flex-1">
          {example.tag && <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{example.tag}</div>}
          <div className="mt-1 whitespace-pre-line text-[16px] font-bold leading-relaxed text-neutral-950" style={{ fontFamily: "Arial, 'Liberation Sans', Helvetica, sans-serif" }}>{example.question}</div>
          {example.skill && <div className="mt-2 text-sm text-neutral-500">Skill: {example.skill}</div>}
        </div>
      </div>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-t border-neutral-200 px-4 py-2 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900">
        <span>{open ? 'Hide solution' : 'Show solution'}</span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8l5 5 5-5" /></svg>
      </button>
      {open && (
        <div className="border-t border-neutral-200 p-3 sm:p-4">
          {diagram && (
            <ConstructionPlayer title="Diagram" viewBox={diagram.viewBox} actions={diagram.actions} caption={diagram.caption} />
          )}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4">
            {example.steps.map((step, i) => (
              <div key={i} className="flex gap-2 border-b border-neutral-200 py-2.5 text-[15px] leading-relaxed">
                <span className="shrink-0 font-semibold text-neutral-500">Step {i + 1}:</span>
                <span className="flex-1 text-neutral-800">{step}</span>
              </div>
            ))}
            <div className="py-2.5 text-[15px] leading-relaxed">
              <span className="mr-1 font-semibold text-neutral-500">Answer:</span>
              <span className="font-bold text-neutral-950">{example.answer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const FlatExample = ({ index, example }) => {
  const diagram = useMemo(() => (example.build ? example.build() : null), [example]);
  return (
    <div className="mb-10 border-t border-neutral-200 pt-6">
      <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{example.tag || 'Example ' + index}</div>
      <div className="mt-1 whitespace-pre-line text-[17px] font-bold leading-relaxed text-neutral-950" style={{ fontFamily: "Arial, 'Liberation Sans', Helvetica, sans-serif" }}>{example.question}</div>
      {diagram && (
        <div className="mt-4">
          <ConstructionPlayer title="Diagram" viewBox={diagram.viewBox} actions={diagram.actions} caption={diagram.caption} />
        </div>
      )}
      {example.steps && example.steps.length > 0 && (
        <ol className="mt-2 space-y-2">
          {example.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-neutral-800"><span className="shrink-0 font-semibold text-neutral-500">Step {i + 1}:</span><span>{step}</span></li>
          ))}
        </ol>
      )}
      <p className="mt-3 text-[15px] leading-relaxed"><span className="mr-1 font-semibold text-neutral-500">Answer:</span><span className="font-bold text-neutral-950">{example.answer}</span></p>
    </div>
  );
};

const PracticeZone = ({ items }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-7">
    <h3 className="mb-4 flex items-center gap-2 text-2xl font-extrabold uppercase tracking-tight">
      <span className="text-2xl">✍️</span> Practice Zone
    </h3>
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={i} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
          <span className="text-lg font-extrabold text-slate-700">{i + 1}.</span>
          <span className="text-[18px] leading-[1.7] text-slate-700">{q}</span>
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
  const A = { x: 230, y: 50 };
  const B = { x: 80, y: 250 };
  const C = { x: 350, y: 250 };
  const D = perpendicularFoot(A, B, C);
  const angB = angleFromCenter(B, A);
  const angC = angleFromCenter(C, A);
  const actions = [
    mkPoint(B, 'B', '', { labelOffset: { x: -22, y: 22 } }),
    mkPoint(C, 'C', '', { labelOffset: { x: 8, y: 22 } }),
    mkLine(B, C, 'Here is triangle ABC. First we draw the bottom side, BC.', { color: '#1e3a8a' }),
    mkLine(C, A, 'Now we draw the side from C up to A.', { color: '#1e3a8a' }),
    mkLine(A, B, 'Then we join A back to B. That is our triangle.', { color: '#1e3a8a' }),
    mkPoint(A, 'A', '', { labelOffset: { x: -4, y: -14 } }),
    mkText({ x: 215, y: 282 }, 'a', 'Side a is BC. It sits opposite angle A.', { size: 20, color: '#1e3a8a', flash: { from: B, to: C } }),
    mkText({ x: 312, y: 148 }, 'b', 'Side b is CA. It sits opposite angle B.', { size: 20, color: '#1e3a8a', flash: { from: C, to: A } }),
    mkText({ x: 140, y: 148 }, 'c', 'Side c is AB. It sits opposite angle C.', { size: 20, color: '#1e3a8a', flash: { from: A, to: B } }),
    mkArc(B, 34, 0, angB, 'Next we mark angle B and angle C. We will need them in a moment.', { color: '#f472b6' }),
    mkArc(C, 34, 180, angC, '', { color: '#f472b6' }),
    mkLine(A, D, 'Now we draw a straight line down from A to BC. It meets BC at a right angle. We call that point D.', { color: '#f59e0b', dashed: true }),
    mkPoint(D, 'D', '', { labelOffset: { x: -4, y: 22 } }),
    mkRightAngleMark(D, angleFromCenter(D, B), angleFromCenter(D, A), { narration: 'The little square shows it is exactly 90 degrees.' }),
    mkText({ x: 242, y: 155 }, 'h', 'This line is the height. We call it h.', { size: 20, color: '#d97706', flash: { from: A, to: D } }),
    mkEq('sin B = h ⁄ c', 'Look at the left triangle, ABD. It has a right angle, so sin B = h over c.', { color: '#2563eb' }),
    mkEq('h = c · sin B', 'Multiply both sides by c. So h = c times sin B.', { color: '#2563eb' }),
    mkEq('sin C = h ⁄ b', 'Now look at the right triangle, ACD. Same idea: sin C = h over b.', { color: '#db2777' }),
    mkEq('h = b · sin C', 'So h = b times sin C.', { color: '#db2777' }),
    mkEq('c · sin B = b · sin C', 'Both of them are equal to h. So they must be equal to each other.'),
    mkEq('b ⁄ sin B = c ⁄ sin C', 'Now divide both sides by sin B and sin C. As you can see, b over sin B equals c over sin C.'),
    mkEq('a ⁄ sin A = b ⁄ sin B = c ⁄ sin C', 'Draw the height from another corner and a over sin A joins in too. That is the sine rule!', { color: '#059669' }),
  ];
  return { viewBox: '0 0 420 300', actions, caption: 'a ⁄ sin A = b ⁄ sin B = c ⁄ sin C — the sine rule, true for every triangle.' };
}

function build_SineRuleProofObtuse() {
  const B = { x: 70, y: 250 };
  const C = { x: 220, y: 250 };
  const A = { x: 310, y: 50 };
  const D = perpendicularFoot(A, B, C);
  const angCA = angleFromCenter(C, A);
  const actions = [
    mkPoint(B, 'B', '', { labelOffset: { x: -22, y: 22 } }),
    mkPoint(C, 'C', '', { labelOffset: { x: -6, y: 22 } }),
    mkLine(B, C, 'Here is triangle ABC. This time angle C is obtuse, which means bigger than 90 degrees.', { color: '#1e3a8a' }),
    mkLine(C, A, 'We draw the side from C up to A.', { color: '#1e3a8a' }),
    mkLine(A, B, 'Then we join A to B to finish the triangle.', { color: '#1e3a8a' }),
    mkPoint(A, 'A', '', { labelOffset: { x: -4, y: -14 } }),
    mkText({ x: 145, y: 282 }, 'a', 'Side a is BC, opposite angle A.', { size: 20, color: '#1e3a8a', flash: { from: B, to: C } }),
    mkText({ x: 282, y: 150 }, 'b', 'Side b is CA, opposite angle B.', { size: 20, color: '#1e3a8a', flash: { from: C, to: A } }),
    mkText({ x: 165, y: 150 }, 'c', 'Side c is AB, opposite angle C.', { size: 20, color: '#1e3a8a', flash: { from: A, to: B } }),
    mkArc(C, 30, angCA, 180, 'See the angle at C? It is wider than a right angle.', { color: '#f472b6' }),
    mkLine(C, D, 'If we drop a height from A, it lands outside the triangle. So first we stretch BC out to the right.', { color: '#94a3b8', dashed: true }),
    mkLine(A, D, 'Now we draw the height from A down to the stretched line. It meets it at D, at a right angle.', { color: '#f59e0b', dashed: true }),
    mkPoint(D, 'D', '', { labelOffset: { x: 6, y: 22 } }),
    mkRightAngleMark(D, angleFromCenter(D, C), angleFromCenter(D, A), { narration: 'The little square shows it is exactly 90 degrees.' }),
    mkText({ x: 322, y: 155 }, 'h', 'We call this height h.', { size: 20, color: '#d97706', anchor: 'start', flash: { from: A, to: D } }),
    mkEq('sin B = h ⁄ c', 'Look at the big triangle ABD. It has a right angle, so sin B = h over c.', { color: '#2563eb' }),
    mkEq('h = c · sin B', 'So h = c times sin B. Same as before.', { color: '#2563eb' }),
    mkArc(C, 40, 0, angCA, 'Now look at the small triangle ACD. Its angle at C is what is left on the straight line.', { color: '#f59e0b' }),
    mkEq('angle ACD = 180° − C', 'So angle ACD is 180 degrees minus C.', { color: '#b45309' }),
    mkEq('sin(180° − C) = h ⁄ b', 'In this small triangle, sin of 180 minus C is h over b.', { color: '#db2777' }),
    mkEq('sin C = h ⁄ b', 'Remember: sin of 180 minus C is the same as sin C. So sin C = h over b.', { color: '#db2777' }),
    mkEq('h = b · sin C', 'So h = b times sin C.', { color: '#db2777' }),
    mkEq('c · sin B = b · sin C', 'Both are equal to h, so they are equal to each other.'),
    mkEq('b ⁄ sin B = c ⁄ sin C', 'Divide both sides by sin B and sin C. We get b over sin B equals c over sin C.'),
    mkEq('The sine rule works for obtuse triangles too!', 'As you can see, the rule still works. That is why we needed sin(180° − C) = sin C.', { color: '#059669' }),
  ];
  return { viewBox: '0 0 420 300', actions, caption: 'The identity sin(180° − θ) = sin θ is exactly what rescues the sine rule when an angle is obtuse.' };
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
  const rayCA = mkLine(C, toXY(C, dist(C, A) + 45, angC), 'Draw a ray from C at 116° — A lies somewhere along it, though we don\'t yet know how far.', { color: '#94a3b8', dashed: true });
  const arcFromB = mkArc(B, cPx, angleFromCenter(B, A) - 28, angleFromCenter(B, A) + 28, 'Since AB = c = 17.7 cm, swing an arc of that radius centred on B. Wherever it crosses the ray is a possible spot for A.', { color: '#f59e0b', opacity: 0.5, duration: 2200 });
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
  const rayBA = mkLine(B, toXY(B, dist(B, A) + 45, angB), 'Draw a ray from B at this angle — A lies somewhere along it.', { color: '#94a3b8', dashed: true });
  const arcFromC = mkArc(C, bPx, angleFromCenter(C, A) - 28, angleFromCenter(C, A) + 28, 'Since CA = b = 9.5 cm, swing an arc of that radius centred on C.', { color: '#f59e0b', opacity: 0.5, duration: 2200 });
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
/* =========================================================================
   WHAT THE EXAM USUALLY ASKS: animated worked solutions
   ========================================================================= */
const K = { b: '#2563eb', p: '#db2777', g: '#059669', a: '#b45309', v: '#7c3aed' };
const RED = '#dc2626';
const ctr = (...ps: any[]) => ({ x: ps.reduce((t, q) => t + q.x, 0) / ps.length, y: ps.reduce((t, q) => t + q.y, 0) / ps.length });
const unitV = (v: any) => { const l = Math.hypot(v.x, v.y) || 1; return { x: v.x / l, y: v.y / l }; };
const apexFrom = (L: any, R: any, aL: number, aR: number) => lineLineIntersect(L, toXY(L, 500, aL), R, toXY(R, 500, 180 - aR)) || { x: (L.x + R.x) / 2, y: 80 };
const vtx = (p: any, name: string, cen: any) => {
  const u = unitV({ x: p.x - cen.x, y: p.y - cen.y });
  return mkPoint(p, name, '', { labelOffset: { x: u.x * 16 - 5, y: u.y * 16 + 5 } });
};
const sideTag = (p: any, q: any, cen: any, text: string, narration: string, color: string = '#1e3a8a') => {
  const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  const u = unitV({ x: m.x - cen.x, y: m.y - cen.y });
  return mkText({ x: m.x + u.x * 28, y: m.y + u.y * 28 + 6 }, text, narration, { size: 17, color, flash: { from: p, to: q } });
};
const angTag = (V: any, cen: any, text: string, narration: string, color: string = '#be185d') => {
  const u = unitV({ x: cen.x - V.x, y: cen.y - V.y });
  return mkText({ x: V.x + u.x * 64, y: V.y + u.y * 64 + 6 }, text, narration, { size: 16, color });
};
const arcAt = (V: any, P1: any, P2: any, r: number, narration: string = '') => {
  const a0 = angleFromCenter(V, P1);
  let d = angleFromCenter(V, P2) - a0;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return mkArc(V, r, a0, a0 + d, narration, { color: '#f472b6' });
};
const triLines = (a: any, b: any, c: any, narration: string) => [
  mkLine(a, b, narration, { color: '#1e3a8a' }),
  mkLine(b, c, '', { color: '#1e3a8a' }),
  mkLine(c, a, '', { color: '#1e3a8a' }),
];
const E = (rows: any[]) => rows.map(([t, n, c]) => mkEq(t, n, { color: c }));

function build_Q1() {
  const A = { x: 60, y: 240 }, B = { x: 330, y: 240 };
  const C = apexFrom(A, B, 35, 65);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with A = 35°, B = 65° and a = 8 cm.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(A, B, C, 30), angTag(A, cen, '35°', 'Angle A is 35°.'),
    arcAt(B, C, A, 30), angTag(B, cen, '65°', 'Angle B is 65°.'),
    sideTag(B, C, cen, '8 cm', 'Side a is BC. It is 8 cm, and it sits opposite angle A.'),
    sideTag(C, A, cen, 'b = ?', 'We need side b. It is CA, and it sits opposite angle B.', RED),
    ...E([
      ['a ⁄ sin A = b ⁄ sin B', 'We know a and A, and we want b, so we use the sine rule.', K.b],
      ['8 ⁄ sin 35° = b ⁄ sin 65°', 'Put in the numbers.', K.p],
      ['b = 8 × sin 65° ⁄ sin 35°', 'Multiply both sides by sin 65°.', K.p],
      ['b = 12.6 cm (3 s.f.)', 'Use a calculator: 8 × 0.9063 ÷ 0.5736 = 12.64, so b = 12.6 cm to 3 significant figures.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q2() {
  const P = { x: 60, y: 240 }, Q = { x: 330, y: 240 };
  const R = apexFrom(P, Q, 42, 73);
  const cen = ctr(P, Q, R);
  const actions = [
    ...triLines(P, Q, R, 'Sketch triangle PQR with P = 42°, Q = 73° and PR = 10 cm.'),
    vtx(P, 'P', cen), vtx(Q, 'Q', cen), vtx(R, 'R', cen),
    arcAt(P, Q, R, 30), angTag(P, cen, '42°', 'Angle P is 42°.'),
    arcAt(Q, R, P, 30), angTag(Q, cen, '73°', 'Angle Q is 73°.'),
    sideTag(P, R, cen, '10 cm', 'PR is 10 cm. It sits opposite angle Q.'),
    sideTag(Q, R, cen, 'QR = ?', 'We need QR. It sits opposite angle P.', RED),
    ...E([
      ['QR ⁄ sin P = PR ⁄ sin Q', 'Each side is divided by the sine of its opposite angle. QR is opposite P, and PR is opposite Q.', K.b],
      ['QR ⁄ sin 42° = 10 ⁄ sin 73°', 'Put in the numbers.', K.p],
      ['QR = 10 × sin 42° ⁄ sin 73°', 'Multiply both sides by sin 42°.', K.p],
      ['QR = 7.00 cm (3 s.f.)', '10 × 0.6691 ÷ 0.9563 = 6.997, which is 7.00 to 3 significant figures.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q3() {
  const X = { x: 60, y: 240 }, Y = { x: 330, y: 240 };
  const Z = apexFrom(X, Y, 48, 33.87);
  const cen = ctr(X, Y, Z);
  const actions = [
    ...triLines(X, Y, Z, 'Sketch triangle XYZ with x = 12 cm, y = 9 cm and X = 48°.'),
    vtx(X, 'X', cen), vtx(Y, 'Y', cen), vtx(Z, 'Z', cen),
    arcAt(X, Y, Z, 30), angTag(X, cen, '48°', 'Angle X is 48°.'),
    sideTag(Y, Z, cen, '12 cm', 'Side x is YZ. It is 12 cm and sits opposite angle X.'),
    sideTag(Z, X, cen, '9 cm', 'Side y is ZX. It is 9 cm and sits opposite angle Y.'),
    angTag(Y, cen, 'Y = ?', 'We need angle Y.', RED),
    ...E([
      ['sin Y ⁄ y = sin X ⁄ x', 'We want an angle, so we flip the sine rule to put the sines on top.', K.b],
      ['sin Y ⁄ 9 = sin 48° ⁄ 12', 'Put in the numbers: y = 9, x = 12 and X = 48°.', K.p],
      ['sin Y = 9 × sin 48° ⁄ 12', 'Multiply both sides by 9.', K.p],
      ['sin Y = 0.5574', '9 × 0.7431 ÷ 12 = 0.5574.', K.p],
      ['Y = 33.9°', 'Use inverse sine. Side y is shorter than side x, so Y is smaller than X and must be acute. So Y = 33.9° to 1 d.p.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q4() {
  const B = { x: 60, y: 240 }, C = { x: 318, y: 240 };
  const A = apexFrom(B, C, 38, 59.53);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(B, C, A, 'Sketch triangle ABC with AB = 14 cm, AC = 10 cm and B = 38°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(B, C, A, 30), angTag(B, cen, '38°', 'Angle B is 38°.'),
    sideTag(A, B, cen, '14 cm', 'AB = 14 cm. It sits opposite angle C.'),
    sideTag(C, A, cen, '10 cm', 'AC = 10 cm. It sits opposite angle B.'),
    angTag(C, cen, 'C = ?', 'We need angle C. The pair we know is AC with B, so AB goes with C.', RED),
    ...E([
      ['sin C ⁄ c = sin B ⁄ b', 'We want an angle, so we put the sines on top. c = AB = 14 and b = AC = 10.', K.b],
      ['sin C ⁄ 14 = sin 38° ⁄ 10', 'Put in the numbers.', K.p],
      ['sin C = 14 × sin 38° ⁄ 10', 'Multiply both sides by 14.', K.p],
      ['sin C = 0.8619', '14 × 0.6157 ÷ 10 = 0.8619.', K.p],
      ['C = 59.5°', 'Inverse sine gives 59.5°.', K.g],
      ['or C = 120.5°', 'But 180° − 59.5° = 120.5° has the same sine, and 38° + 120.5° is less than 180°, so it also fits. AB is longer than AC, so both triangles exist. Your diagram tells you which one is meant.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q5() {
  const P = { x: 60, y: 240 }, Q = { x: 330, y: 240 };
  const R = apexFrom(P, Q, 65, 40);
  const cen = ctr(P, Q, R);
  const actions = [
    ...triLines(P, Q, R, 'Sketch triangle PQR with P = 65°, Q = 40° and PR = 12 cm.'),
    vtx(P, 'P', cen), vtx(Q, 'Q', cen), vtx(R, 'R', cen),
    arcAt(P, Q, R, 30), angTag(P, cen, '65°', 'Angle P is 65°.'),
    arcAt(Q, R, P, 30), angTag(Q, cen, '40°', 'Angle Q is 40°.'),
    sideTag(P, R, cen, '12 cm', 'PR is 12 cm. It sits opposite angle Q.'),
    ...E([['∠R = 180° − 65° − 40° = 75°', '(a) Angles in a triangle add to 180°, so we find angle R first.', K.v]]),
    arcAt(R, P, Q, 26), angTag(R, cen, '75°', 'So angle R is 75°.'),
    sideTag(P, Q, cen, 'PQ = ?', '(b) We need PQ. It sits opposite angle R.', RED),
    ...E([
      ['PQ ⁄ sin R = PR ⁄ sin Q', 'PQ is opposite R, and PR is opposite Q. Now the sine rule works.', K.b],
      ['PQ ⁄ sin 75° = 12 ⁄ sin 40°', 'Put in the numbers.', K.p],
      ['PQ = 12 × sin 75° ⁄ sin 40°', 'Multiply both sides by sin 75°.', K.p],
      ['PQ = 18.0 cm (3 s.f.)', '12 × 0.9659 ÷ 0.6428 = 18.03, so PQ = 18.0 cm to 3 significant figures.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q6() {
  const A = { x: 130, y: 140 }, C = { x: 264, y: 140 };
  const B = apexFrom(A, C, 55, 55);
  const D = toXY(A, 156, -72.26);
  const c1 = ctr(A, B, C), c2 = ctr(A, C, D);
  const actions = [
    ...triLines(A, C, B, 'Start with triangle ABC.'),
    vtx(A, 'A', c1), vtx(B, 'B', c1), vtx(C, 'C', c1),
    sideTag(A, B, c1, '9 cm', 'AB = 9 cm.'),
    arcAt(A, C, B, 30), angTag(A, c1, '55°', 'Angle BAC is 55°.'),
    arcAt(B, A, C, 30), angTag(B, c1, '70°', 'Angle ABC is 70°.'),
    ...E([
      ['∠ACB = 180° − 55° − 70° = 55°', '(a) First find the angle at C: 180° − 55° − 70° = 55°.', K.v],
      ['AC ⁄ sin B = AB ⁄ sin C', 'AC is opposite B, and AB is opposite C.', K.v],
      ['AC ⁄ sin 70° = 9 ⁄ sin 55°', 'Put in the numbers.', K.v],
      ['AC = 9 × sin 70° ⁄ sin 55°', 'Multiply both sides by sin 70°.', K.v],
      ['AC = 10.32 cm', '9 × 0.9397 ÷ 0.8192 = 10.32. We keep the unrounded value for part (b).', K.v],
    ]),
    mkLine(C, D, '(b) Now add triangle ACD. It shares the side AC.', { color: '#1e3a8a' }),
    mkLine(D, A, '', { color: '#1e3a8a' }),
    vtx(D, 'D', c2),
    sideTag(A, D, c2, '12 cm', 'AD = 12 cm.'),
    angTag(D, c2, '48°', 'Angle ADC is 48°.'),
    arcAt(C, A, D, 30), angTag(C, c2, '?', 'We need angle ACD.', RED),
    ...E([
      ['sin ∠ACD ⁄ AD = sin D ⁄ AC', 'In triangle ACD, angle ACD is opposite AD, and D is opposite AC. We use the AC we just found.', K.b],
      ['sin ∠ACD ⁄ 12 = sin 48° ⁄ 10.32', 'Put in the numbers.', K.b],
      ['sin ∠ACD = 12 × sin 48° ⁄ 10.32', 'Multiply both sides by 12.', K.b],
      ['sin ∠ACD = 0.8638', '12 × 0.7431 ÷ 10.32 = 0.8638.', K.b],
      ['∠ACD = 59.7°', 'Inverse sine gives 59.7° to 1 d.p. The value 120.3° has the same sine, so if your diagram shows angle ACD obtuse, use that instead.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q7() {
  const C = { x: 80, y: 230 }, B = { x: 360, y: 230 };
  const A = toXY(C, 200, 58);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(C, B, A, 'Sketch the three points: A, B and C on level ground.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(C, A, cen, '10 m', 'CA = 10 m.'),
    sideTag(C, B, cen, '14 m', 'CB = 14 m.'),
    arcAt(C, B, A, 32), angTag(C, cen, '58°', 'The angle at C, between the two known sides, is 58°.'),
    sideTag(A, B, cen, 'AB = ?', 'We want AB, the side opposite the 58° angle.', RED),
    ...E([
      ['AB² = CA² + CB² − 2 × CA × CB × cos C', 'We know two sides and the angle between them. There is no side and opposite angle pair, so the sine rule will not work. We use the cosine rule.', K.b],
      ['AB² = 10² + 14² − 2 × 10 × 14 × cos 58°', 'Put in the numbers.', K.p],
      ['AB² = 147.62', '100 + 196 − 280 × 0.5299 = 147.62.', K.p],
      ['AB = 12.15 m (2 d.p.)', 'Take the square root of 147.62.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q8() {
  const P = { x: 260, y: 125 };
  const Q = toXY(P, 120, 90 - 328);
  const R = toXY(Q, 200, 90 - 191);
  const cen = ctr(P, Q, R);
  const nP = toXY(P, 70, 90), nQ = toXY(Q, 70, 90);
  const actions = [
    vtx(P, 'P', cen),
    mkLine(P, nP, 'A bearing is measured clockwise from north, so we start with a north line at P.', { color: '#94a3b8', dashed: true }),
    mkText({ x: nP.x, y: nP.y - 8 }, 'N', '', { duration: 400 }),
    mkLine(P, Q, 'Q is 3 km from P on a bearing of 328°. That is 32° anticlockwise from north.', { color: '#1e3a8a' }),
    vtx(Q, 'Q', cen),
    sideTag(P, Q, cen, '3 km', 'PQ = 3 km.'),
    mkArc(P, 30, 90, 90 - 328, 'The bearing 328° is measured clockwise from north, all the way round to PQ.', { color: '#f472b6' }),
    mkLine(Q, nQ, 'At Q we draw another north line.', { color: '#94a3b8', dashed: true }),
    mkText({ x: nQ.x, y: nQ.y - 8 }, 'N', '', { duration: 400 }),
    mkLine(Q, R, 'R is 5 km from Q on a bearing of 191°. That is 11° past due south.', { color: '#1e3a8a' }),
    vtx(R, 'R', cen),
    sideTag(Q, R, cen, '5 km', 'QR = 5 km.'),
    mkArc(Q, 30, 90, 90 - 191, 'Again we measure clockwise from north, this time 191°.', { color: '#f472b6' }),
    ...E([['Bearing QP = 328° − 180° = 148°', '(a) Looking back from Q to P, we subtract 180° from the bearing: 328° − 180° = 148°.', K.v]]),
    arcAt(Q, P, R, 44), angTag(Q, cen, '43°', 'R is on bearing 191° from Q and P is on 148°. The angle between them is 43°.'),
    ...E([['∠PQR = 191° − 148° = 43°', 'So angle PQR = 191° − 148° = 43°.', K.v]]),
    mkLine(P, R, '(b) Now join P to R.', { color: '#1e3a8a' }),
    sideTag(P, R, cen, 'PR = ?', 'We want PR.', RED),
    ...E([
      ['PR² = 3² + 5² − 2 × 3 × 5 × cos 43°', 'We know two sides, 3 and 5, and the angle between them, 43°. So we use the cosine rule.', K.b],
      ['PR² = 12.06', '9 + 25 − 30 × 0.7314 = 12.06.', K.b],
      ['PR = 3.47 km', 'Take the square root: PR = 3.47 km to 3 significant figures.', K.b],
      ['cos ∠QPR = (3² + 3.4727² − 5²) ⁄ (2 × 3 × 3.4727)', '(c) To get the bearing we need angle QPR. We use the cosine rule again, because the sine rule would give two possible angles.', K.a],
      ['cos ∠QPR = −0.1891', '(9 + 12.0597 − 25) ÷ 20.8362 = −0.1891.', K.a],
      ['∠QPR = 100.9°', 'The cosine is negative, so the angle is obtuse: 100.9°. This fits the diagram, because QR is the longest side and faces the biggest angle.', K.a],
    ]),
    arcAt(P, Q, R, 40), angTag(P, cen, '100.9°', 'Angle QPR is 100.9°.'),
    ...E([
      ['Bearing PR = 328° − 100.9° = 227.1°', 'R is 100.9° anticlockwise from PQ, so we subtract from 328°.', K.g],
      ['Bearing of R from P = 227°', 'To the nearest degree, the bearing of R from P is 227°.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q9() {
  const sc = 15;
  const P = { x: 120, y: 240 }, R = { x: 120 + 14.05 * sc, y: 240 };
  const Q = apexFrom(P, R, 68, 41);
  const hits = lineCircleIntersect(R, P, Q, 15 * sc) || [];
  const S = hits.slice().sort((u, v) => u.x - v.x)[0] || { x: 0, y: 240 };
  const cen = ctr(P, Q, R), cenS = ctr(S, Q, R);
  const actions = [
    ...triLines(P, Q, R, 'Sketch triangle PQR with PQ = 9.75 cm, angle QPR = 68° and angle PRQ = 41°.'),
    vtx(P, 'P', cen), vtx(Q, 'Q', cen), vtx(R, 'R', cen),
    sideTag(P, Q, cen, '9.75 cm', 'PQ = 9.75 cm. It sits opposite angle R.'),
    arcAt(P, R, Q, 30), angTag(P, cen, '68°', 'Angle P is 68°.'),
    arcAt(R, Q, P, 30), angTag(R, cen, '41°', 'Angle R is 41°.'),
    ...E([['∠PQR = 180° − 68° − 41° = 71°', '(a) Angles in a triangle add to 180°.', K.v]]),
    arcAt(Q, P, R, 26), angTag(Q, cen, '71°', 'So angle Q is 71°.'),
    sideTag(Q, R, cen, 'QR = ?', '(b) We want QR. It sits opposite angle P.', RED),
    ...E([
      ['QR ⁄ sin P = PQ ⁄ sin R', 'QR is opposite P, and PQ is opposite R.', K.b],
      ['QR ⁄ sin 68° = 9.75 ⁄ sin 41°', 'Put in the numbers.', K.b],
      ['QR = 9.75 × sin 68° ⁄ sin 41°', 'Multiply both sides by sin 68°.', K.b],
      ['QR = 13.78 cm', '9.75 × 0.9272 ÷ 0.6561 = 13.78. We keep this value for part (c).', K.b],
    ]),
    mkLine(P, S, '(c) Extend RP beyond P to a point S, so that QS = 15 cm.', { color: '#94a3b8', dashed: true }),
    mkLine(S, Q, '', { color: '#1e3a8a' }),
    vtx(S, 'S', cenS),
    sideTag(S, Q, cenS, '15 cm', 'QS = 15 cm.'),
    angTag(S, cenS, '?', 'We need angle QSR, in the big triangle QRS.', RED),
    ...E([
      ['sin S ⁄ QR = sin R ⁄ QS', 'In triangle QRS, angle S is opposite QR (our answer from part b), and angle R is opposite QS.', K.a],
      ['sin S ⁄ 13.78 = sin 41° ⁄ 15', 'Put in the numbers.', K.a],
      ['sin S = 13.78 × sin 41° ⁄ 15', 'Multiply both sides by 13.78.', K.a],
      ['sin S = 0.6027', '13.78 × 0.6561 ÷ 15 = 0.6027.', K.a],
      ['∠QSR = 37.1°', 'Inverse sine gives 37.1°. QS is longer than QR, so the angle opposite QR is the smaller one and must be acute.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_Q10() {
  const sc = 14;
  const A = { x: 50, y: 240 }, B = { x: 50 + 18.5 * sc, y: 240 };
  const C = apexFrom(A, B, 42, 67);
  const D = { x: 50 + 10.603 * sc, y: 240 };
  const cen = ctr(A, B, C), cenD = ctr(A, C, D);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with AB = 18.5 m, A = 42° and B = 67°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, '18.5 m', 'AB = 18.5 m.'),
    arcAt(A, B, C, 30), angTag(A, cen, '42°', 'Angle A is 42°.'),
    arcAt(B, C, A, 30), angTag(B, cen, '67°', 'Angle B is 67°.'),
    ...E([['∠C = 180° − 42° − 67° = 71°', '(a) Angles in a triangle add to 180°.', K.v]]),
    sideTag(C, A, cen, 'AC = ?', '(b) We want AC. It sits opposite angle B.', RED),
    ...E([
      ['AC ⁄ sin B = AB ⁄ sin C', 'AC is opposite B, and AB is opposite C.', K.b],
      ['AC ⁄ sin 67° = 18.5 ⁄ sin 71°', 'Put in the numbers.', K.b],
      ['AC = 18.5 × sin 67° ⁄ sin 71°', 'Multiply both sides by sin 67°.', K.b],
      ['AC = 18.01 m', '18.5 × 0.9205 ÷ 0.9455 = 18.01. We keep this value for part (c).', K.b],
    ]),
    mkLine(C, D, '(c) D is a point on AB, and CD makes 35° with AC. Draw CD.', { color: '#1e3a8a' }),
    vtx(D, 'D', cen),
    arcAt(C, A, D, 34), angTag(C, cenD, '35°', 'Angle ACD is 35°.'),
    ...E([
      ['∠ADC = 180° − 42° − 35° = 103°', 'In triangle ACD we know two angles, so the third is 180° − 42° − 35° = 103°.', K.a],
      ['CD ⁄ sin A = AC ⁄ sin ∠ADC', 'CD is opposite A, and AC is opposite angle ADC.', K.a],
      ['CD ⁄ sin 42° = 18.01 ⁄ sin 103°', 'Put in the numbers, using AC from part (b).', K.a],
      ['CD = 18.01 × sin 42° ⁄ sin 103°', 'Multiply both sides by sin 42°.', K.a],
      ['CD = 12.4 m (3 s.f.)', '18.01 × 0.6691 ÷ 0.9744 = 12.37, so CD = 12.4 m.', K.a],
    ]),
    sideTag(B, C, cen, 'BC = ?', '(d) For the boundary we also need BC.', RED),
    ...E([
      ['BC ⁄ sin A = AB ⁄ sin C', 'BC is opposite A, and AB is opposite C.', K.g],
      ['BC = 18.5 × sin 42° ⁄ sin 71°', 'Put in the numbers and multiply both sides by sin 42°.', K.g],
      ['BC = 13.09 m', '18.5 × 0.6691 ÷ 0.9455 = 13.09.', K.g],
      ['Boundary = 18.5 + 13.09 + 18.01', 'The boundary is AB + BC + CA.', K.g],
      ['Boundary = 49.6 m (1 d.p.)', 'Add them up: 49.60, so the boundary is 49.6 m.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

const examLevels = [
  { id: 'l1', title: 'Level 1 — Basic', questions: [
    { no: 1, tag: 'Find a side', skill: 'Direct use of the Sine Rule.', question: 'In triangle ABC, A = 35°, B = 65° and a = 8 cm.\nCalculate b, correct to 3 significant figures.', steps: [], answer: 'b ≈ 12.6 cm', build: build_Q1 },
    { no: 2, tag: 'Find another side', skill: 'Recognising the opposite angle and side pair.', question: 'Triangle PQR has P = 42°, Q = 73° and PR = 10 cm.\nCalculate QR, correct to 3 significant figures.', steps: [], answer: 'QR ≈ 7.00 cm', build: build_Q2 },
  ] },
  { id: 'l2', title: 'Level 2 — Finding angles', questions: [
    { no: 3, tag: 'Find an unknown angle', skill: 'Rearranging the Sine Rule to find an angle.', question: 'In triangle XYZ, x = 12 cm, y = 9 cm and X = 48°.\nCalculate angle Y, correct to 1 decimal place.', steps: [], answer: 'Y ≈ 33.9°', build: build_Q3 },
    { no: 4, tag: 'Sine Rule with a diagram', skill: 'Identifying the complete side and angle pair before applying the formula.', question: 'Triangle ABC has AB = 14 cm, AC = 10 cm and ∠B = 38°.\nCalculate ∠C.', steps: [], answer: 'C ≈ 59.5° (or 120.5° if the diagram shows C obtuse)', build: build_Q4 },
  ] },
  { id: 'l3', title: 'Level 3 — Multi-step', questions: [
    { no: 5, tag: 'Find an angle first', skill: 'Two-stage work: angle first, then the Sine Rule.', question: 'In triangle PQR, ∠P = 65°, ∠Q = 40° and PR = 12 cm.\n(a) Calculate ∠R.\n(b) Use the Sine Rule to calculate PQ.', steps: [], answer: '(a) ∠R = 75°   (b) PQ ≈ 18.0 cm', build: build_Q5 },
    { no: 6, tag: 'Two triangles', skill: 'Carrying an answer from one triangle into another.', question: 'Two triangles share a side AC.\nIn triangle ABC: AB = 9 cm, ∠BAC = 55° and ∠ABC = 70°.\n(a) Calculate AC.\nTriangle ACD has AD = 12 cm and ∠ADC = 48°.\n(b) Calculate ∠ACD.', steps: [], answer: '(a) AC ≈ 10.32 cm   (b) ∠ACD ≈ 59.7°', build: build_Q6 },
  ] },
  { id: 'l4', title: 'Level 4 — ZIMSEC exam-style application', questions: [
    { no: 7, tag: 'Distance between two points', skill: 'Choosing the correct rule rather than blindly using the Sine Rule.', question: 'Two boys A and B are standing on level ground. A point C is also on the ground, with CA = 10 m, CB = 14 m and ∠ACB = 58°.\nCalculate AB, correct to 2 decimal places.', steps: [], answer: 'AB ≈ 12.15 m (Cosine Rule)', build: build_Q7 },
    { no: 8, tag: 'Bearing problem', skill: 'Bearings, triangles and trigonometry combined.', question: 'The bearing of Q from P is 328°. The bearing of R from Q is 191°.\nPQ = 3 km and QR = 5 km.\n(a) Calculate ∠PQR.\n(b) Calculate PR.\n(c) Find the bearing of R from P, correct to the nearest degree.', steps: [], answer: '(a) 43°   (b) PR ≈ 3.47 km   (c) 227°', build: build_Q8 },
  ] },
  { id: 'l5', title: 'Level 5 — Hard', questions: [
    { no: 9, tag: 'Multi-stage triangle problem', skill: 'Using the answer from one part to find another angle.', question: 'In triangle PQR, PQ = 9.75 cm, ∠QPR = 68° and ∠PRQ = 41°.\n(a) Calculate ∠PQR.\n(b) Use the Sine Rule to calculate QR.\n(c) S lies on RP extended beyond P, so that QS = 15 cm. Use your answer to (b) to calculate ∠QSR.', steps: [], answer: '(a) 71°   (b) QR ≈ 13.8 cm   (c) ∠QSR ≈ 37.1°', build: build_Q9 },
    { no: 10, tag: '🔥 Challenge: full ZIMSEC-style problem', skill: 'A full multi-part problem.', question: 'A triangular piece of land ABC has AB = 18.5 m, ∠A = 42° and ∠B = 67°. A path is constructed from C to a point D on AB.\n(a) Calculate ∠C.\n(b) Calculate AC using the Sine Rule.\n(c) If CD makes an angle of 35° with AC, calculate the length of CD.\n(d) Calculate the total length of the boundary ABC, correct to 1 decimal place.', steps: [], answer: '(a) 71°   (b) AC ≈ 18.0 m   (c) CD ≈ 12.4 m   (d) 49.6 m', build: build_Q10 },
  ] },
];

/* =========================================================================
   SOLVING TRIANGLES: what the exam usually asks (animated worked solutions)
   ========================================================================= */
function build_T1() {
  const A = { x: 60, y: 240 }, B = { x: 330, y: 240 };
  const C = apexFrom(A, B, 40, 65);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with A = 40°, B = 65° and a = 10 cm.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(A, B, C, 30), angTag(A, cen, '40°', 'Angle A is 40°.'),
    arcAt(B, C, A, 30), angTag(B, cen, '65°', 'Angle B is 65°.'),
    sideTag(B, C, cen, '10 cm', 'Side a is BC. It is 10 cm and sits opposite angle A.'),
    ...E([['C = 180° − 40° − 65° = 75°', 'Angles in a triangle add up to 180°, so we find C first.', K.v]]),
    arcAt(C, A, B, 26), angTag(C, cen, '75°', 'So angle C is 75°.'),
    sideTag(C, A, cen, 'b', 'Now side b. It is CA and sits opposite angle B.', RED),
    ...E([
      ['a ⁄ sin A = b ⁄ sin B', 'We know a and A, and we want b, so we use the sine rule.', K.b],
      ['10 ⁄ sin 40° = b ⁄ sin 65°', 'Put in the numbers.', K.b],
      ['b = 10 × sin 65° ⁄ sin 40°', 'Multiply both sides by sin 65°.', K.b],
      ['b = 14.10 cm', '10 × 0.9063 ÷ 0.6428 = 14.10 cm.', K.b],
    ]),
    sideTag(A, B, cen, 'c', 'Now side c. It is AB and sits opposite angle C.', RED),
    ...E([
      ['a ⁄ sin A = c ⁄ sin C', 'The pair a and A is still known, and c is opposite C.', K.a],
      ['10 ⁄ sin 40° = c ⁄ sin 75°', 'Put in the numbers.', K.a],
      ['c = 10 × sin 75° ⁄ sin 40°', 'Multiply both sides by sin 75°.', K.a],
      ['c = 15.03 cm', '10 × 0.9659 ÷ 0.6428 = 15.03 cm.', K.a],
      ['C = 75°, b = 14.10 cm, c = 15.03 cm', 'So C = 75°, b = 14.10 cm and c = 15.03 cm.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T2() {
  const sc = 22;
  const P = { x: 60, y: 240 }, Q = { x: 60 + 8 * sc, y: 240 };
  const R = toXY(P, 11 * sc, 52);
  const cen = ctr(P, Q, R);
  const actions = [
    ...triLines(P, Q, R, 'Sketch triangle PQR with PQ = 8 cm, PR = 11 cm and ∠QPR = 52°.'),
    vtx(P, 'P', cen), vtx(Q, 'Q', cen), vtx(R, 'R', cen),
    sideTag(P, Q, cen, '8 cm', 'PQ = 8 cm.'),
    sideTag(P, R, cen, '11 cm', 'PR = 11 cm.'),
    arcAt(P, Q, R, 30), angTag(P, cen, '52°', 'The angle at P, between the two known sides, is 52°.'),
    sideTag(Q, R, cen, 'QR', 'We want QR.', RED),
    ...E([
      ['QR² = PQ² + PR² − 2 × PQ × PR × cos P', 'We know two sides and the angle between them, so we use the cosine rule.', K.b],
      ['QR² = 8² + 11² − 2 × 8 × 11 × cos 52°', 'Put in the numbers.', K.b],
      ['QR² = 185 − 176 × 0.6157', '8² + 11² = 64 + 121 = 185, and 2 × 8 × 11 = 176.', K.b],
      ['QR² = 76.64', '176 × 0.6157 = 108.36, so QR² = 185 − 108.36 = 76.64.', K.b],
      ['QR = 8.75 cm', 'Take the square root: QR = 8.75 cm.', K.b],
      ['sin R ⁄ PQ = sin P ⁄ QR', 'Now the angles. R is opposite PQ, the shortest side, so R must be acute and the sine rule is safe.', K.p],
      ['sin R ⁄ 8 = sin 52° ⁄ 8.754', 'Put in the numbers. We use the unrounded QR = 8.754 to stay accurate.', K.p],
      ['sin R = 8 × sin 52° ⁄ 8.754', 'Multiply both sides by 8.', K.p],
      ['sin R = 0.7201', '8 × 0.7880 ÷ 8.754 = 0.7201.', K.p],
      ['R = 46.1°', 'Inverse sine gives R = 46.1°.', K.p],
    ]),
    arcAt(R, P, Q, 26), angTag(R, cen, '46.1°', 'Mark angle R on the diagram.'),
    ...E([['Q = 180° − 52° − 46.1° = 81.9°', 'The last angle comes from the angle sum.', K.g]]),
    arcAt(Q, R, P, 26), angTag(Q, cen, '81.9°', 'So angle Q is 81.9°.'),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T3() {
  const A = { x: 60, y: 240 }, B = { x: 330, y: 240 };
  const C = apexFrom(A, B, 35, 72);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with A = 35°, B = 72° and c = 14 cm.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(A, B, C, 30), angTag(A, cen, '35°', 'Angle A is 35°.'),
    arcAt(B, C, A, 30), angTag(B, cen, '72°', 'Angle B is 72°.'),
    sideTag(A, B, cen, '14 cm', 'Side c is AB. It is 14 cm and sits opposite angle C.'),
    ...E([['C = 180° − 35° − 72° = 73°', 'We find C first, because c and C make the known pair.', K.v]]),
    arcAt(C, A, B, 26), angTag(C, cen, '73°', 'So angle C is 73°.'),
    sideTag(B, C, cen, 'a', 'Now side a. It is BC and sits opposite angle A.', RED),
    ...E([
      ['a ⁄ sin A = c ⁄ sin C', 'a is opposite A, and c is opposite C.', K.b],
      ['a ⁄ sin 35° = 14 ⁄ sin 73°', 'Put in the numbers.', K.b],
      ['a = 14 × sin 35° ⁄ sin 73°', 'Multiply both sides by sin 35°.', K.b],
      ['a = 8.40 cm', '14 × 0.5736 ÷ 0.9563 = 8.40 cm.', K.b],
    ]),
    sideTag(C, A, cen, 'b', 'Now side b. It is CA and sits opposite angle B.', RED),
    ...E([
      ['b ⁄ sin B = c ⁄ sin C', 'b is opposite B, and c is opposite C.', K.a],
      ['b ⁄ sin 72° = 14 ⁄ sin 73°', 'Put in the numbers.', K.a],
      ['b = 14 × sin 72° ⁄ sin 73°', 'Multiply both sides by sin 72°.', K.a],
      ['b = 13.92 cm', '14 × 0.9511 ÷ 0.9563 = 13.92 cm.', K.a],
      ['C = 73°, a = 8.40 cm, b = 13.92 cm', 'So C = 73°, a = 8.40 cm and b = 13.92 cm.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T4() {
  const sc = 19;
  const A = { x: 60, y: 240 };
  const C = toXY(A, 9 * sc, 58);
  const B = { x: 60 + 14.03 * sc, y: 240 };
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with a = 12 cm, b = 9 cm and A = 58°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(A, B, C, 30), angTag(A, cen, '58°', 'Angle A is 58°.'),
    sideTag(B, C, cen, '12 cm', 'Side a is BC. It is 12 cm and sits opposite angle A.'),
    sideTag(C, A, cen, '9 cm', 'Side b is CA. It is 9 cm and sits opposite angle B.'),
    ...E([
      ['sin B ⁄ b = sin A ⁄ a', 'We want angle B, and the pair a = 12 with A = 58° is complete. So we use the sine rule with the sines on top.', K.b],
      ['sin B ⁄ 9 = sin 58° ⁄ 12', 'Put in the numbers.', K.b],
      ['sin B = 9 × sin 58° ⁄ 12', 'Multiply both sides by 9.', K.b],
      ['sin B = 0.6360', '9 × 0.8480 ÷ 12 = 0.6360.', K.b],
      ['B = 39.5°', 'Inverse sine gives 39.5°.', K.b],
      ['or B = 140.5°', 'Warning: sin 140.5° is also 0.6360, so the sine rule offers a second answer, 180° − 39.5° = 140.5°. This is the ambiguous case, so we must check it.', K.a],
      ['58° + 140.5° = 198.5° > 180°', 'But 58° + 140.5° is more than 180°, so there is no room for a third angle. This answer is rejected. Because a is longer than b, angle A is bigger than angle B, so only one triangle exists. Two triangles can only appear when the known angle is opposite the shorter of the two known sides.', K.a],
    ]),
    arcAt(B, C, A, 26), angTag(B, cen, '39.5°', 'So angle B is 39.5°.'),
    ...E([['C = 180° − 58° − 39.5° = 82.5°', 'The last angle comes from the angle sum.', K.v]]),
    arcAt(C, A, B, 26), angTag(C, cen, '82.5°', 'So angle C is 82.5°.'),
    sideTag(A, B, cen, 'c', 'Finally side c. It is AB and sits opposite angle C.', RED),
    ...E([
      ['c ⁄ sin C = a ⁄ sin A', 'c is opposite C, and a is opposite A.', K.g],
      ['c ⁄ sin 82.5° = 12 ⁄ sin 58°', 'Put in the numbers.', K.g],
      ['c = 12 × sin 82.5° ⁄ sin 58°', 'Multiply both sides by sin 82.5°.', K.g],
      ['c = 14.03 cm', '12 × 0.9914 ÷ 0.8480 = 14.03 cm.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T5() {
  const sc = 14;
  const C = { x: 60, y: 240 }, B = { x: 60 + 15.2 * sc, y: 240 };
  const A = toXY(C, 18.7 * sc, 47);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(C, B, A, 'Sketch the triangle with a = 15.2 cm, b = 18.7 cm and C = 47°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(C, B, A, 30), angTag(C, cen, '47°', 'The angle at C, between the two known sides, is 47°.'),
    sideTag(B, C, cen, '15.2 cm', 'Side a is BC. It is 15.2 cm.'),
    sideTag(C, A, cen, '18.7 cm', 'Side b is CA. It is 18.7 cm.'),
    sideTag(A, B, cen, 'c', 'We want the remaining side c, which is AB.', RED),
    ...E([
      ['c² = a² + b² − 2ab cos C', 'Two sides and the angle between them: the cosine rule. This is step 1.', K.b],
      ['c² = 15.2² + 18.7² − 2 × 15.2 × 18.7 × cos 47°', 'Put in the numbers.', K.b],
      ['c² = 580.73 − 387.70', '15.2² + 18.7² = 580.73, and 2 × 15.2 × 18.7 × cos 47° = 387.70.', K.b],
      ['c² = 193.03', 'Subtract.', K.b],
      ['c = 13.89 cm', 'Take the square root: c = 13.89 cm.', K.b],
      ['sin A ⁄ a = sin C ⁄ c', 'Step 2: an angle with the sine rule. a = 15.2 is shorter than b = 18.7, so angle A is smaller than B and must be acute. The sine rule is safe.', K.p],
      ['sin A ⁄ 15.2 = sin 47° ⁄ 13.89', 'Put in the numbers.', K.p],
      ['sin A = 15.2 × sin 47° ⁄ 13.89', 'Multiply both sides by 15.2.', K.p],
      ['sin A = 0.8001', '15.2 × 0.7314 ÷ 13.89 = 0.8001.', K.p],
      ['A = 53.1°', 'Inverse sine gives A = 53.1°.', K.p],
    ]),
    arcAt(A, C, B, 26), angTag(A, cen, '53.1°', 'Mark angle A.'),
    ...E([['B = 180° − 47° − 53.1° = 79.9°', 'Step 3: the angle sum gives the last angle.', K.g]]),
    arcAt(B, A, C, 26), angTag(B, cen, '79.9°', 'So angle B is 79.9°.'),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T6() {
  const sc = 15;
  const B = { x: 60, y: 240 }, C = { x: 60 + 21.4 * sc, y: 240 };
  const A = toXY(B, 13.5 * sc, 53.41);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(B, C, A, 'Sketch triangle ABC with AB = 13.5 m, AC = 17.2 m and BC = 21.4 m.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, '13.5 m', 'AB = 13.5 m.'),
    sideTag(C, A, cen, '17.2 m', 'AC = 17.2 m.'),
    sideTag(B, C, cen, '21.4 m', 'BC = 21.4 m. We know three sides and no angles, so the sine rule cannot start. We use the cosine rule.'),
    ...E([
      ['cos A = (b² + c² − a²) ⁄ 2bc', 'Start with the largest angle, A, opposite the longest side BC = a.', K.b],
      ['cos A = (17.2² + 13.5² − 21.4²) ⁄ (2 × 17.2 × 13.5)', 'Put in the numbers.', K.b],
      ['cos A = 20.13 ⁄ 464.4', '295.84 + 182.25 − 457.96 = 20.13, and 2 × 17.2 × 13.5 = 464.4.', K.b],
      ['A = 87.5°', 'Inverse cosine gives A = 87.5°.', K.b],
    ]),
    arcAt(A, B, C, 28), angTag(A, cen, '87.5°', 'Mark angle A.'),
    ...E([
      ['cos B = (a² + c² − b²) ⁄ 2ac', 'Now angle B, opposite AC = b.', K.p],
      ['cos B = (21.4² + 13.5² − 17.2²) ⁄ (2 × 21.4 × 13.5)', 'Put in the numbers.', K.p],
      ['cos B = 344.37 ⁄ 577.8', '457.96 + 182.25 − 295.84 = 344.37, and 2 × 21.4 × 13.5 = 577.8.', K.p],
      ['B = 53.4°', 'Inverse cosine gives B = 53.4°.', K.p],
    ]),
    arcAt(B, C, A, 30), angTag(B, cen, '53.4°', 'Mark angle B.'),
    ...E([['C = 180° − 87.5° − 53.4° = 39.1°', 'The last angle comes from the angle sum.', K.g]]),
    arcAt(C, A, B, 30), angTag(C, cen, '39.1°', 'So angle C is 39.1°.'),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T7() {
  const sc = 11.5;
  const B = { x: 60, y: 240 }, C = { x: 60 + 26.93 * sc, y: 240 };
  const A = toXY(B, 14 * sc, 42);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(B, C, A, 'Sketch triangle ABC with AB = 14 cm, AC = 19 cm and ∠ABC = 42°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    arcAt(B, C, A, 30), angTag(B, cen, '42°', 'Angle B is 42°.'),
    sideTag(A, B, cen, '14 cm', 'AB = 14 cm.'),
    sideTag(C, A, cen, '19 cm', 'AC = 19 cm.'),
    ...E([
      ['sin C ⁄ c = sin B ⁄ b', 'Which rule? AC = b and its opposite angle B = 42° are both known. That is a complete pair, so the sine rule works. AB = c is opposite angle C.', K.b],
      ['sin C ⁄ 14 = sin 42° ⁄ 19', 'Put in the numbers.', K.b],
      ['sin C = 14 × sin 42° ⁄ 19', 'Multiply both sides by 14.', K.b],
      ['sin C = 0.4930', '14 × 0.6691 ÷ 19 = 0.4930.', K.b],
      ['C = 29.5°', 'Inverse sine gives 29.5°. The other value, 150.5°, is impossible: 42° + 150.5° is more than 180°. Also AC is longer than AB, so the angle opposite AC is the larger one.', K.b],
    ]),
    arcAt(C, A, B, 26), angTag(C, cen, '29.5°', 'So angle C is 29.5°.'),
    ...E([['A = 180° − 42° − 29.5° = 108.5°', 'The angle sum gives angle A, which is obtuse.', K.v]]),
    arcAt(A, B, C, 24), angTag(A, cen, '108.5°', 'So angle A is 108.5°.'),
    sideTag(B, C, cen, 'a', 'Last, side a. It is BC and sits opposite angle A.', RED),
    ...E([
      ['a ⁄ sin A = b ⁄ sin B', 'The pair b and B is still our known pair.', K.g],
      ['a ⁄ sin 108.5° = 19 ⁄ sin 42°', 'Put in the numbers.', K.g],
      ['a = 19 × sin 108.5° ⁄ sin 42°', 'Multiply both sides by sin 108.5°.', K.g],
      ['a = 26.9 cm', '19 × 0.9483 ÷ 0.6691 = 26.9 cm.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T8() {
  const sc = 11;
  const B = { x: 90, y: 145 };
  const C = { x: 90 + 11.3187 * sc, y: 145 };
  const A = toXY(B, 12 * sc, 80.01);
  const D = toXY(B, 9 * sc, -64.37);
  const c1 = ctr(A, B, C), c2 = ctr(B, C, D), all = ctr(A, B, C, D);
  const mid = { x: (B.x + C.x) / 2, y: B.y };
  const actions = [
    ...triLines(A, B, C, 'Start with triangle ABC. AB = 12 cm, AC = 15 cm and the angle at A is 48°.'),
    vtx(A, 'A', all), vtx(B, 'B', all), vtx(C, 'C', all),
    sideTag(A, B, c1, '12 cm', 'AB = 12 cm.'),
    sideTag(C, A, c1, '15 cm', 'AC = 15 cm.'),
    arcAt(A, B, C, 26), angTag(A, c1, '48°', 'The angle at A, between the two known sides, is 48°.'),
    mkText({ x: mid.x, y: mid.y - 10 }, 'BC', 'BC is shared by both triangles. In triangle ABC we know two sides and the angle between them, so the cosine rule gives BC.', { size: 16, color: RED, flash: { from: B, to: C } }),
    ...E([
      ['BC² = AB² + AC² − 2 × AB × AC × cos A', 'The cosine rule for the side opposite angle A.', K.b],
      ['BC² = 12² + 15² − 2 × 12 × 15 × cos 48°', 'Put in the numbers.', K.b],
      ['BC² = 369 − 240.89', '12² + 15² = 144 + 225 = 369, and 2 × 12 × 15 × cos 48° = 240.89.', K.b],
      ['BC = 11.32 cm', 'BC² = 128.11, so BC = 11.32 cm.', K.b],
      ['sin C ⁄ AB = sin A ⁄ BC', 'Now the angles of triangle ABC. AB = 12 is its shortest side, so the angle opposite it, ∠ACB, is acute and the sine rule is safe.', K.p],
      ['sin C ⁄ 12 = sin 48° ⁄ 11.32', 'Put in the numbers (using the unrounded BC).', K.p],
      ['sin C = 12 × sin 48° ⁄ 11.32', 'Multiply both sides by 12.', K.p],
      ['sin C = 0.7879', '12 × 0.7431 ÷ 11.32 = 0.7879.', K.p],
      ['∠ACB = 52.0°', 'Inverse sine gives 52.0°.', K.p],
    ]),
    arcAt(C, A, B, 24), angTag(C, c1, '52.0°', 'Mark ∠ACB.'),
    ...E([['∠ABC = 180° − 48° − 52.0° = 80.0°', 'The angle sum in triangle ABC gives ∠ABC.', K.v]]),
    arcAt(B, C, A, 30), angTag(B, c1, '80.0°', 'So ∠ABC is 80.0°.'),
    mkLine(B, D, 'Now triangle BCD, on the other side of BC. BD = 9 cm and CD = 11 cm.', { color: '#1e3a8a' }),
    mkLine(D, C, '', { color: '#1e3a8a' }),
    vtx(D, 'D', all),
    sideTag(B, D, c2, '9 cm', 'BD = 9 cm.'),
    sideTag(C, D, c2, '11 cm', 'CD = 11 cm.'),
    ...E([
      ['cos D = (BD² + CD² − BC²) ⁄ 2 × BD × CD', 'We now know all three sides of triangle BCD, so we use the cosine rule for angle D, opposite the shared side BC.', K.a],
      ['cos D = (9² + 11² − 128.11) ⁄ (2 × 9 × 11)', 'Put in the numbers. BC² = 128.11 from before.', K.a],
      ['cos D = 73.89 ⁄ 198', '81 + 121 − 128.11 = 73.89, and 2 × 9 × 11 = 198.', K.a],
      ['∠BDC = 68.1°', 'Inverse cosine gives 68.1°.', K.a],
    ]),
    arcAt(D, B, C, 24), angTag(D, c2, '68.1°', 'Mark ∠BDC.'),
    ...E([
      ['sin ∠BCD ⁄ BD = sin D ⁄ BC', 'BD = 9 is the shortest side of triangle BCD, so ∠BCD is acute and the sine rule is safe.', K.a],
      ['sin ∠BCD ⁄ 9 = sin 68.1° ⁄ 11.32', 'Put in the numbers.', K.a],
      ['sin ∠BCD = 9 × sin 68.1° ⁄ 11.32', 'Multiply both sides by 9.', K.a],
      ['sin ∠BCD = 0.7377', '9 × 0.9278 ÷ 11.32 = 0.7377.', K.a],
      ['∠BCD = 47.5°', 'Inverse sine gives 47.5°.', K.a],
    ]),
    arcAt(C, B, D, 28), angTag(C, c2, '47.5°', 'Mark ∠BCD.'),
    ...E([['∠DBC = 180° − 68.1° − 47.5° = 64.4°', 'The angle sum in triangle BCD gives ∠DBC.', K.g]]),
    arcAt(B, C, D, 38), angTag(B, c2, '64.4°', 'So ∠DBC is 64.4°.'),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T9() {
  const A = { x: 70, y: 90 };
  const B = toXY(A, 120, 90 - 65);
  const C = toXY(B, 180, 90 - 145);
  const cen = ctr(A, B, C);
  const north = (P: any, narration: string) => [
    mkLine(P, toXY(P, 56, 90), narration, { color: '#94a3b8', dashed: true }),
    mkText({ x: P.x, y: P.y - 62 }, 'N', '', { size: 15, color: '#64748b', duration: 400 }),
  ];
  const actions = [
    vtx(A, 'A', cen),
    ...north(A, 'A bearing is measured clockwise from north, so we start with a north line at A.'),
    mkLine(A, B, 'The ship sails 12 km from A to B on a bearing of 065°.', { color: '#1e3a8a' }),
    vtx(B, 'B', cen),
    sideTag(A, B, cen, '12 km', 'So AB = 12 km.'),
    mkArc(A, 34, 90, 25, 'The bearing 065° is the angle measured clockwise from north to AB.', { color: '#f472b6' }),
    mkText({ x: A.x + 28, y: A.y - 44 }, '065°', '', { size: 14, color: '#be185d', duration: 400 }),
    ...north(B, 'At B we draw another north line.'),
    mkLine(B, C, 'Then it sails 18 km from B to C on a bearing of 145°.', { color: '#1e3a8a' }),
    vtx(C, 'C', cen),
    sideTag(B, C, cen, '18 km', 'So BC = 18 km.'),
    mkArc(B, 30, 90, -55, 'The bearing 145° is measured clockwise from north to BC.', { color: '#f472b6' }),
    mkText({ x: B.x + 46, y: B.y - 10 }, '145°', '', { size: 14, color: '#be185d', duration: 400 }),
    ...E([
      ['Bearing of A from B = 065° + 180° = 245°', '(a) To find ∠ABC we need the bearing of A from B. Looking back along AB we add 180° to 065°.', K.v],
      ['∠ABC = 245° − 145° = 100°', 'The angle at B is the difference between the bearing of A (245°) and the bearing of C (145°).', K.v],
    ]),
    arcAt(B, A, C, 20), angTag(B, cen, '100°', 'So ∠ABC is 100°.'),
    mkLine(C, A, '(b) To find AC we join A to C.', { color: '#1e3a8a' }),
    sideTag(C, A, cen, 'AC', 'We want AC.', RED),
    ...E([
      ['AC² = AB² + BC² − 2 × AB × BC × cos B', 'We know two sides and the angle between them, so we use the cosine rule.', K.b],
      ['AC² = 12² + 18² − 2 × 12 × 18 × cos 100°', 'Put in the numbers.', K.b],
      ['AC² = 468 + 75.02', 'cos 100° is negative, so we are adding: 432 × 0.1736 = 75.02.', K.b],
      ['AC = 23.30 km', 'AC² = 543.02, so AC = 23.30 km.', K.b],
      ['sin ∠BAC ⁄ BC = sin B ⁄ AC', '(c) We need ∠BAC. B = 100° is the biggest angle, so ∠BAC is acute and the sine rule is safe.', K.p],
      ['sin ∠BAC ⁄ 18 = sin 100° ⁄ 23.30', 'Put in the numbers.', K.p],
      ['sin ∠BAC = 18 × sin 100° ⁄ 23.30', 'Multiply both sides by 18.', K.p],
      ['sin ∠BAC = 0.7607', '18 × 0.9848 ÷ 23.30 = 0.7607.', K.p],
      ['∠BAC = 49.5°', 'Inverse sine gives 49.5°.', K.p],
    ]),
    arcAt(A, B, C, 44),
    ...E([['Bearing of C from A = 065° + 49.5° = 114.5°', 'C lies clockwise from B as seen from A, so we add ∠BAC to the bearing 065°. To the nearest degree that is 115°.', K.g]]),
    ...north(C, '(d) For the bearing of A from C we draw a north line at C.'),
    mkArc(C, 28, 90, 90 - 294.53, 'We measure clockwise from north to CA.', { color: '#f472b6' }),
    mkText({ x: C.x, y: C.y + 46 }, '294.5°', '', { size: 14, color: '#be185d', duration: 400 }),
    ...E([['Bearing of A from C = 114.5° + 180° = 294.5°', 'Looking back from C to A, we add 180° to the bearing of C from A. To the nearest degree that is 295°.', K.g]]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_T10() {
  const sc = 9;
  const B = { x: 70, y: 230 };
  const C = { x: 70 + 27.6456 * sc, y: 230 };
  const A = toXY(B, 24.6 * sc, 74.73);
  const D = { x: 70 + 13.5 * sc, y: 230 };
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(B, C, A, 'Sketch triangle ABC with AB = 24.6 m, AC = 31.8 m and ∠BAC = 57°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, '24.6 m', 'AB = 24.6 m.'),
    sideTag(C, A, cen, '31.8 m', 'AC = 31.8 m.'),
    arcAt(A, B, C, 30), angTag(A, cen, '57°', 'The angle at A, between the two known sides, is 57°.'),
    mkLine(A, D, 'D is a point on BC with BD = 13.5 m. Join A to D.', { color: '#94a3b8', dashed: true }),
    vtx(D, 'D', cen),
    sideTag(B, D, cen, '13.5 m', 'BD = 13.5 m.'),
    mkText({ x: 255, y: 258 }, 'BC', '(a) We want BC. Two sides and the angle between them: the cosine rule.', { size: 16, color: RED, flash: { from: B, to: C } }),
    ...E([
      ['BC² = AB² + AC² − 2 × AB × AC × cos A', 'The cosine rule for the side opposite angle A.', K.b],
      ['BC² = 24.6² + 31.8² − 2 × 24.6 × 31.8 × cos 57°', 'Put in the numbers.', K.b],
      ['BC² = 1616.40 − 852.12', '24.6² + 31.8² = 1616.40, and 2 × 24.6 × 31.8 × cos 57° = 852.12.', K.b],
      ['BC² = 764.28', 'Subtract.', K.b],
      ['BC = 27.65 m', 'Take the square root: BC = 27.65 m.', K.b],
      ['sin C ⁄ AB = sin A ⁄ BC', '(b) The angle opposite AB is ∠ACB. AB is shorter than BC, so C is smaller than A and must be acute. The sine rule is safe.', K.p],
      ['sin C ⁄ 24.6 = sin 57° ⁄ 27.65', 'Put in the numbers.', K.p],
      ['sin C = 24.6 × sin 57° ⁄ 27.65', 'Multiply both sides by 24.6.', K.p],
      ['sin C = 0.7463', '24.6 × 0.8387 ÷ 27.6456 = 0.7463 (using the unrounded BC).', K.p],
      ['∠ACB = 48.3°', 'Inverse sine gives 48.3°.', K.p],
    ]),
    arcAt(C, A, B, 28), angTag(C, cen, '48.3°', 'Mark ∠ACB.'),
    ...E([['∠ABC = 180° − 57° − 48.3° = 74.7°', '(c) The angle opposite AC is ∠ABC. The angle sum gives it.', K.v]]),
    arcAt(B, C, A, 28), angTag(B, cen, '74.7°', 'So ∠ABC is 74.7°.'),
    ...E([
      ['CD = BC − BD', '(d) D lies on BC, so CD is what is left of BC after BD.', K.a],
      ['CD = 27.65 − 13.5', 'Put in the numbers.', K.a],
      ['CD = 14.15 m', 'CD = 14.15 m.', K.a],
      ['cos B = 0.2634', '(e) For the angles at D we first need AD. We use cos B from the unrounded ∠ABC = 74.73°.', K.p],
      ['AD² = AB² + BD² − 2 × AB × BD × cos B', 'In triangle ABD we know AB, BD and the angle B between them: the cosine rule.', K.p],
      ['AD² = 787.41 − 664.2 × 0.2634', '24.6² + 13.5² = 787.41, and 2 × 24.6 × 13.5 = 664.2.', K.p],
      ['AD = 24.75 m', 'AD² = 612.46, so AD = 24.75 m.', K.p],
      ['sin ∠BAD ⁄ BD = sin B ⁄ AD', 'Now ∠BAD. BD is shorter than AD, so ∠BAD is acute and the sine rule is safe.', K.p],
      ['sin ∠BAD = 13.5 × sin 74.7° ⁄ 24.75', 'Multiply both sides by 13.5.', K.p],
      ['sin ∠BAD = 0.5262', '13.5 × 0.9647 ÷ 24.75 = 0.5262.', K.p],
      ['∠BAD = 31.8°', 'Inverse sine gives 31.8°.', K.p],
    ]),
    arcAt(A, B, D, 40),
    ...E([
      ['∠DAC = 57° − 31.8° = 25.2°', 'The 57° angle at A is split by AD into two parts.', K.v],
      ['∠ADB = 180° − 74.7° − 31.8° = 73.5°', 'The angle sum in triangle ABD.', K.v],
      ['∠ADC = 180° − 73.5° = 106.5°', 'Angles on the straight line BC add up to 180°.', K.v],
    ]),
    arcAt(A, D, C, 50),
    ...E([
      ['Area = ½ × AB × AC × sin A', '(f) The area from two sides and the angle between them.', K.g],
      ['Area = ½ × 24.6 × 31.8 × sin 57°', 'Put in the numbers.', K.g],
      ['Area = 391.14 × 0.8387', '½ × 24.6 × 31.8 = 391.14.', K.g],
      ['Area = 328 m² (3 s.f.)', 'The area of triangle ABC is 328 m².', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

const examLevels2 = [
  { id: 't-easy', title: 'Easy', questions: [
    { no: 1, tag: 'Find the third angle and two sides', skill: 'Angle sum, then the Sine Rule twice.', question: 'Triangle ABC: A = 40°, B = 65° and a = 10 cm.\nFind C, b and c.', steps: [], answer: 'C = 75°, b ≈ 14.10 cm, c ≈ 15.03 cm', build: build_T1 },
  ] },
  { id: 't-easymed', title: 'Easy / Medium', questions: [
    { no: 2, tag: 'Two sides and the angle between them', skill: 'Cosine Rule for the side, then the Sine Rule for an angle.', question: 'Triangle PQR: PQ = 8 cm, PR = 11 cm and ∠QPR = 52°.\nFind QR, then find the other two angles.', steps: [], answer: 'QR ≈ 8.75 cm, R ≈ 46.1°, Q ≈ 81.9°', build: build_T2 },
  ] },
  { id: 't-med', title: 'Medium', questions: [
    { no: 3, tag: 'Two angles and a side', skill: 'Angle sum, then the Sine Rule for two sides.', question: 'In triangle ABC, A = 35°, B = 72° and c = 14 cm.\nFind C, a and b.', steps: [], answer: 'C = 73°, a ≈ 8.40 cm, b ≈ 13.92 cm', build: build_T3 },
    { no: 4, tag: 'The ambiguous case', skill: 'Sine Rule for an angle, and checking whether a second triangle is possible.', question: 'In triangle ABC, a = 12 cm, b = 9 cm and A = 58°.\nFind B, C and c.', steps: [], answer: 'B ≈ 39.5°, C ≈ 82.5°, c ≈ 14.03 cm (only one triangle, since a > b)', build: build_T4 },
  ] },
  { id: 't-medhard', title: 'Medium / Hard', questions: [
    { no: 5, tag: 'Cosine Rule, then Sine Rule', skill: 'Cosine Rule for c, Sine Rule for an angle, angle sum for the last angle.', question: 'A triangle has a = 15.2 cm, b = 18.7 cm and C = 47°.\nFind all three angles and the remaining side.', steps: [], answer: 'c ≈ 13.89 cm, A ≈ 53.1°, B ≈ 79.9°, C = 47°', build: build_T5 },
  ] },
  { id: 't-hard', title: 'Hard', questions: [
    { no: 6, tag: 'Three sides (SSS)', skill: 'Cosine Rule for A, Cosine Rule for B, then C = 180° − A − B.', question: 'A triangle has AB = 13.5 m, AC = 17.2 m and BC = 21.4 m.\nFind all three angles.', steps: [], answer: 'A ≈ 87.5°, B ≈ 53.4°, C ≈ 39.1°', build: build_T6 },
    { no: 7, tag: 'Which rule?', skill: 'Recognising which rule is appropriate rather than being told.', question: 'Triangle ABC has AB = 14 cm, AC = 19 cm and ∠ABC = 42°.\nFind all the unknown sides and angles.', steps: [], answer: 'C ≈ 29.5°, A ≈ 108.5°, a ≈ 26.9 cm', build: build_T7 },
  ] },
  { id: 't-vhard', title: 'Very Hard', questions: [
    { no: 8, tag: 'Two triangles sharing a side', skill: 'Carrying the shared side BC from one triangle into the other.', question: 'Two triangles share the side BC.\nFirst triangle: AB = 12 cm, AC = 15 cm and ∠BAC = 48°.\nSecond triangle: BD = 9 cm and CD = 11 cm.\nFind all unknown angles and sides in both triangles.', steps: [], answer: 'BC ≈ 11.32 cm; ∠ACB ≈ 52.0°, ∠ABC ≈ 80.0°; ∠BDC ≈ 68.1°, ∠BCD ≈ 47.5°, ∠DBC ≈ 64.4°', build: build_T8 },
  ] },
  { id: 't-exam', title: 'Exam Challenge', questions: [
    { no: 9, tag: 'Ship and bearings', skill: 'Bearings, angle geometry, Cosine Rule and Sine Rule together.', question: 'A ship sails from A to B on a bearing of 065°, travelling 12 km. It then sails from B to C on a bearing of 145°, travelling 18 km.\nFind:\n(a) the angle ABC\n(b) AC\n(c) the bearing of C from A\n(d) the bearing of A from C.', steps: [], answer: '(a) 100°   (b) AC ≈ 23.30 km   (c) 114.5° (115°)   (d) 294.5° (295°)', build: build_T9 },
    { no: 10, tag: 'Full "Solve the Triangle" question', skill: 'A full multi-part problem with a point on a side.', question: 'A triangular plot of land ABC has AB = 24.6 m, AC = 31.8 m and ∠BAC = 57°. A point D lies on BC with BD = 13.5 m.\nFind:\n(a) BC\n(b) the angle opposite AB\n(c) the angle opposite AC\n(d) CD\n(e) all remaining angles (∠BAD, ∠DAC, ∠ADB, ∠ADC)\n(f) the area of ABC.', steps: [], answer: '(a) 27.65 m   (b) 48.3°   (c) 74.7°   (d) 14.15 m   (e) ∠BAD 31.8°, ∠DAC 25.2°, ∠ADB 73.5°, ∠ADC 106.5°   (f) 328 m²', build: build_T10 },
  ] },
];


/* =========================================================================
   BEARINGS: what the exam usually asks (animated worked solutions)
   ========================================================================= */
const bp = (P: any, d: number, b: number) => toXY(P, d, 90 - b);
const northAt = (P: any, narr: string) => [
  mkLine(P, toXY(P, 60, 90), narr, { color: '#94a3b8', dashed: true }),
  mkText({ x: P.x, y: P.y - 66 }, 'N', '', { size: 15, color: '#64748b', duration: 400 }),
];
const brgArc = (P: any, r: number, b: number, narr: string) => mkArc(P, r, 90, 90 - b, narr, { color: '#f472b6' });
const brgTag = (P: any, r: number, b: number, text: string) => {
  const q = bp(P, r + 20, b / 2);
  return mkText({ x: q.x, y: q.y + 5 }, text, '', { size: 14, color: '#be185d', duration: 400 });
};

function build_B1() {
  const A = { x: 110, y: 170 }, B = { x: 310, y: 170 }, cen = ctr(A, B);
  const actions = [
    vtx(A, 'A', cen), vtx(B, 'B', cen),
    mkLine(A, B, 'B is directly east of A. So we draw B straight to the right of A.', { color: '#1e3a8a' }),
    ...northAt(A, 'A bearing is measured clockwise from north. So at A we draw a north line.'),
    brgArc(A, 34, 90, 'From north, turn clockwise to the line AB. East is a quarter turn.'),
    ...E([['(a) Bearing of B from A = 090°', 'A quarter turn is 90°. A bearing has three figures, so we write 090°.', K.v]]),
    ...northAt(B, '(b) Now we look from B. We draw a north line at B.'),
    mkArc(B, 34, 90, -180, 'From north, turn clockwise to BA. A is to the west. That is three quarters of a turn.', { color: '#f472b6' }),
    ...E([['(b) Bearing of A from B = 270°', 'Three quarters of a turn is 270°. Check: 090° + 180° = 270°.', K.g]]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B2() {
  const O = { x: 210, y: 150 };
  const ray = (b: number, label: string, color: string, narr: string) => [
    mkLine(O, bp(O, 95, b), narr, { color }),
    mkText({ x: bp(O, 120, b).x, y: bp(O, 120, b).y + 5 }, label, '', { size: 14, color, duration: 500 }),
  ];
  const actions = [
    vtx(O, 'O', { x: 210, y: 100 }),
    ...northAt(O, 'We draw a north line. All three-figure bearings start from here.'),
    ...ray(40, 'N40°E', '#1e3a8a', '(a) N40°E means: start at north and turn 40° towards east.'),
    ...E([['N40°E = 040°', 'Turning from north towards east is clockwise. So the bearing is just 040°.', K.b]]),
    ...ray(145, 'S35°E', '#be185d', '(b) S35°E means: start at south and turn 35° towards east.'),
    ...E([['S35°E = 180° − 35° = 145°', 'South is 180°. East is back towards north, so we subtract 35°.', K.p]]),
    ...ray(240, 'S60°W', '#b45309', '(c) S60°W means: start at south and turn 60° towards west.'),
    ...E([['S60°W = 180° + 60° = 240°', 'West is further round the clock from south, so we add 60°.', K.a]]),
    ...ray(335, 'N25°W', '#059669', '(d) N25°W means: start at north and turn 25° towards west.'),
    ...E([['N25°W = 360° − 25° = 335°', 'Turning west from north is anticlockwise. So we take 25° away from 360°.', K.g]]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B3() {
  const P = { x: 120, y: 230 }, Q = bp(P, 150, 47), cen = ctr(P, Q);
  const actions = [
    vtx(P, 'P', cen),
    ...northAt(P, 'We start at P and draw a north line.'),
    brgArc(P, 34, 47, 'The bearing 047° is measured clockwise from north to PQ.'),
    brgTag(P, 34, 47, '047°'),
    mkLine(P, Q, 'Q is on a bearing of 047° from P. We draw PQ at that angle from north.', { color: '#1e3a8a' }),
    vtx(Q, 'Q', cen),
    ...northAt(Q, 'Now we look back from Q. We draw a north line at Q.'),
    mkArc(Q, 30, 90, 90 - 227, 'The line from Q back to P points the opposite way. We measure clockwise from north, all the way round.', { color: '#f472b6' }),
    ...E([
      ['Reverse bearing = bearing ± 180°', 'To look back, we add 180° or take away 180°. We choose the one that keeps the answer between 0° and 360°.', K.b],
      ['Bearing of P from Q = 047° + 180°', '047° is less than 180°, so we add 180°.', K.p],
      ['Bearing of P from Q = 227°', '047° + 180° = 227°.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B4() {
  const sc = 12;
  const A = { x: 90, y: 240 }, B = bp(A, 15 * sc, 60), N = { x: A.x, y: B.y }, cen = ctr(A, B, N);
  const actions = [
    vtx(A, 'A', cen), 
    ...northAt(A, '(a) We start at A and draw a north line.'),
    brgArc(A, 34, 60, 'The bearing 060° is measured clockwise from north.'),
    brgTag(A, 34, 60, '60°'),
    mkLine(A, B, 'The boat travels 15 km on a bearing of 060°. We draw AB at 60° clockwise from north.', { color: '#1e3a8a' }),
    vtx(B, 'B', cen),
    sideTag(A, B, cen, '15 km', 'AB = 15 km.'),
    mkLine(A, N, '(b) To split the journey, draw a line straight up from A to the height of B. This is how far north the boat went.', { color: '#f59e0b', dashed: true }),
    mkLine(N, B, 'Then draw a line across to B. This is how far east the boat went.', { color: '#f59e0b', dashed: true }),
    mkRightAngleMark(N, angleFromCenter(N, A), angleFromCenter(N, B), { narration: 'The corner is a right angle, so we have a right-angled triangle. The angle at A is 60°.' }),
    mkText({ x: (N.x + B.x) / 2, y: N.y - 10 }, 'east', '', { size: 14, color: '#b45309', duration: 400 }),
    mkText({ x: N.x - 30, y: (A.y + N.y) / 2 }, 'north', '', { size: 14, color: '#b45309', duration: 400 }),
    ...E([
      ['east = 15 × sin 60°', 'East is the side opposite the 60° angle. Opposite and hypotenuse means sine.', K.b],
      ['east = 13.0 km (3 s.f.)', '15 × 0.8660 = 12.99, so the boat went 13.0 km east.', K.b],
      ['north = 15 × cos 60°', '(c) North is the side next to the 60° angle. Adjacent and hypotenuse means cosine.', K.p],
      ['north = 7.5 km', '15 × 0.5 = 7.5, so the boat went 7.5 km north.', K.p],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B5() {
  const sc = 17;
  const A = { x: 120, y: 120 }, B = bp(A, 8 * sc, 75), C = bp(A, 10 * sc, 125), cen = ctr(A, B, C);
  const actions = [
    vtx(A, 'A', cen),
    ...northAt(A, 'We start at A and draw a north line.'),
    brgArc(A, 30, 75, 'The bearing 075° is measured clockwise from north.'),
    mkLine(A, B, 'B is 8 km from A on a bearing of 075°.', { color: '#1e3a8a' }),
    vtx(B, 'B', cen),
    sideTag(A, B, cen, '8 km', 'AB = 8 km.'),
    brgArc(A, 44, 125, 'The bearing 125° is also measured clockwise from north.'),
    mkLine(A, C, 'C is 10 km from A on a bearing of 125°.', { color: '#1e3a8a' }),
    vtx(C, 'C', cen),
    sideTag(A, C, cen, '10 km', 'AC = 10 km.'),
    ...E([['∠BAC = 125° − 75° = 50°', 'Both bearings start at the same north line. The angle between AB and AC is the difference: 50°.', K.v]]),
    mkLine(B, C, 'Now we join B to C. We want this distance.', { color: '#1e3a8a' }),
    sideTag(B, C, cen, 'BC = ?', 'We want BC.', RED),
    ...E([
      ['BC² = AB² + AC² − 2 × AB × AC × cos A', 'We know two sides, 8 and 10, and the angle between them, 50°. So we use the cosine rule.', K.b],
      ['BC² = 8² + 10² − 2 × 8 × 10 × cos 50°', 'Put in the numbers.', K.b],
      ['BC² = 164 − 160 × 0.6428', '8² + 10² = 164, and 2 × 8 × 10 = 160.', K.b],
      ['BC² = 61.15', '164 − 102.85 = 61.15.', K.b],
      ['BC = 7.82 km (3 s.f.)', 'Take the square root: BC = 7.82 km.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B6() {
  const sc = 11;
  const A = { x: 90, y: 110 }, B = bp(A, 12 * sc, 65), C = bp(A, 18 * sc, 145), cen = ctr(A, B, C);
  const actions = [
    vtx(A, 'A', cen),
    ...northAt(A, 'We start at A and draw a north line.'),
    brgArc(A, 30, 65, 'The bearing 065° is measured clockwise from north.'),
    mkLine(A, B, 'Town B is 12 km from A on a bearing of 065°.', { color: '#1e3a8a' }),
    vtx(B, 'B', cen),
    sideTag(A, B, cen, '12 km', 'AB = 12 km.'),
    brgArc(A, 44, 145, 'The bearing 145° is also measured clockwise from north.'),
    mkLine(A, C, 'Town C is 18 km from A on a bearing of 145°.', { color: '#1e3a8a' }),
    vtx(C, 'C', cen),
    sideTag(A, C, cen, '18 km', 'AC = 18 km.'),
    ...E([['(a) ∠BAC = 145° − 65° = 80°', 'The angle inside the triangle is the difference between the two bearings.', K.v]]),
    mkLine(B, C, '(b) Join B to C.', { color: '#1e3a8a' }),
    sideTag(B, C, cen, 'BC = ?', 'We want BC.', RED),
    ...E([
      ['BC² = AB² + AC² − 2 × AB × AC × cos A', 'Two sides and the angle between them: the cosine rule.', K.b],
      ['BC² = 12² + 18² − 2 × 12 × 18 × cos 80°', 'Put in the numbers.', K.b],
      ['BC² = 468 − 432 × 0.1736', '12² + 18² = 468, and 2 × 12 × 18 = 432.', K.b],
      ['BC² = 392.98', '468 − 75.02 = 392.98.', K.b],
      ['BC = 19.8 km (3 s.f.)', 'Take the square root: BC = 19.8 km.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B7() {
  const sc = 25;
  const X = { x: 80, y: 100 }, Y = { x: 80 + 8 * sc, y: 100 }, Z = { x: 80 + 8 * sc, y: 100 + 6 * sc }, cen = ctr(X, Y, Z);
  const actions = [
    vtx(X, 'X', cen),
    mkLine(X, Y, '(a) Y is 8 km due east of X. So we draw Y straight to the right of X.', { color: '#1e3a8a' }),
    vtx(Y, 'Y', cen),
    sideTag(X, Y, cen, '8 km', 'XY = 8 km.'),
    mkLine(Y, Z, 'Z is due south of Y. So we draw Z straight down from Y.', { color: '#1e3a8a' }),
    vtx(Z, 'Z', cen),
    mkRightAngleMark(Y, angleFromCenter(Y, X), angleFromCenter(Y, Z), { narration: 'East and south make a right angle at Y.' }),
    mkLine(Z, X, 'Now we join X to Z. XZ = 10 km.', { color: '#1e3a8a' }),
    sideTag(Z, X, cen, '10 km', 'XZ = 10 km. It is the longest side, opposite the right angle.'),
    sideTag(Y, Z, cen, 'YZ = ?', '(b) We want YZ.', RED),
    ...E([
      ['XZ² = XY² + YZ²', 'The triangle has a right angle at Y, so we use Pythagoras.', K.b],
      ['YZ² = 10² − 8²', 'Move XY² across.', K.b],
      ['YZ² = 100 − 64 = 36', 'Work it out.', K.b],
      ['YZ = 6 km', 'The square root of 36 is 6.', K.g],
      ['tan Z = XY ⁄ YZ', '(c) First we find angle XZY. We know the opposite side XY and the adjacent side YZ, so we use tangent.', K.p],
      ['tan Z = 8 ⁄ 6', 'Put in the numbers.', K.p],
      ['∠XZY = 53.1°', 'Inverse tangent of 1.3333 gives 53.1°.', K.p],
    ]),
    arcAt(Z, Y, X, 40),
    mkArc(Z, 26, 90, 90 - 306.87, 'From Z, the line ZY points due north. Then X is 53.1° to the left of north. So we measure clockwise from north, nearly all the way round.', { color: '#f59e0b' }),
    ...E([
      ['Bearing of X from Z = 360° − 53.1°', 'X is to the left of north, which is anticlockwise. So we take 53.1° away from 360°.', K.v],
      ['Bearing of X from Z = 306.9° ≈ 307°', '360° − 53.1° = 306.9°.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B8() {
  const sc = 0.55;
  const A = { x: 80, y: 230 }, B = bp(A, 240 * sc, 35), C = bp(B, 310 * sc, 125), cen = ctr(A, B, C);
  const actions = [
    vtx(A, 'A', cen),
    ...northAt(A, 'We start at A and draw a north line.'),
    brgArc(A, 30, 35, 'The bearing 035° is measured clockwise from north.'),
    mkLine(A, B, 'The aircraft flies 240 km from A to B on a bearing of 035°.', { color: '#1e3a8a' }),
    vtx(B, 'B', cen),
    sideTag(A, B, cen, '240 km', 'AB = 240 km.'),
    ...northAt(B, 'At B we draw another north line.'),
    brgArc(B, 30, 125, 'The bearing 125° is measured clockwise from north at B.'),
    mkLine(B, C, 'Then it flies 310 km from B to C on a bearing of 125°.', { color: '#1e3a8a' }),
    vtx(C, 'C', cen),
    sideTag(B, C, cen, '310 km', 'BC = 310 km.'),
    ...E([
      ['Bearing of A from B = 035° + 180° = 215°', 'To find the angle at B, we need the bearing of A from B. We look back, so we add 180°.', K.v],
      ['∠ABC = 215° − 125° = 90°', 'The angle at B is the difference between the bearing of A (215°) and the bearing of C (125°).', K.v],
    ]),
    arcAt(B, A, C, 22),
    mkRightAngleMark(B, angleFromCenter(B, A), angleFromCenter(B, C), { narration: 'The angle at B is a right angle.' }),
    mkLine(C, A, 'Now we join C to A. We want this direct distance.', { color: '#1e3a8a' }),
    sideTag(C, A, cen, 'AC = ?', 'We want AC.', RED),
    ...E([
      ['AC² = AB² + BC² − 2 × AB × BC × cos B', 'We know two sides and the angle between them, so we use the cosine rule.', K.b],
      ['AC² = 240² + 310² − 2 × 240 × 310 × cos 90°', 'Put in the numbers.', K.b],
      ['AC² = 57 600 + 96 100 − 0', 'cos 90° = 0, so the last part disappears. (This is just Pythagoras.)', K.b],
      ['AC² = 153 700', '57 600 + 96 100 = 153 700.', K.b],
      ['AC = 392 km (3 s.f.)', 'Take the square root: AC = 392 km.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B9() {
  const sc = 7;
  const P = { x: 70, y: 215 }, Q = bp(P, 18 * sc, 55), R = bp(Q, 24 * sc, 145), cen = ctr(P, Q, R);
  const actions = [
    vtx(P, 'P', cen),
    ...northAt(P, 'We start at P and draw a north line.'),
    brgArc(P, 30, 55, 'The bearing 055° is measured clockwise from north.'),
    mkLine(P, Q, 'The ship goes 18 km from P to Q on a bearing of 055°.', { color: '#1e3a8a' }),
    vtx(Q, 'Q', cen),
    sideTag(P, Q, cen, '18 km', 'PQ = 18 km.'),
    ...northAt(Q, 'At Q we draw another north line.'),
    brgArc(Q, 30, 145, 'The bearing 145° is measured clockwise from north at Q.'),
    mkLine(Q, R, 'Then it goes 24 km from Q to R on a bearing of 145°.', { color: '#1e3a8a' }),
    vtx(R, 'R', cen),
    sideTag(Q, R, cen, '24 km', 'QR = 24 km.'),
    ...E([
      ['Bearing of P from Q = 055° + 180° = 235°', '(a) We look back from Q to P, so we add 180°.', K.v],
      ['∠PQR = 235° − 145° = 90°', 'The angle at Q is the difference between 235° and 145°.', K.v],
    ]),
    mkRightAngleMark(Q, angleFromCenter(Q, P), angleFromCenter(Q, R), { narration: 'So angle PQR is a right angle.' }),
    mkLine(R, P, '(b) Join R to P.', { color: '#1e3a8a' }),
    sideTag(R, P, cen, 'PR = ?', 'We want PR.', RED),
    ...E([
      ['PR² = PQ² + QR² − 2 × PQ × QR × cos Q', 'Two sides and the angle between them: the cosine rule.', K.b],
      ['PR² = 18² + 24² − 2 × 18 × 24 × cos 90°', 'Put in the numbers.', K.b],
      ['PR² = 324 + 576 − 0 = 900', 'cos 90° = 0, so the last part disappears.', K.b],
      ['PR = 30 km', 'The square root of 900 is 30.', K.g],
      ['sin ∠QPR ⁄ QR = sin Q ⁄ PR', '(c) We need angle QPR. PR is the longest side, opposite the 90° angle. So ∠QPR is acute and the sine rule is safe.', K.p],
      ['sin ∠QPR ⁄ 24 = sin 90° ⁄ 30', 'Put in the numbers.', K.p],
      ['sin ∠QPR = 24 × sin 90° ⁄ 30', 'Multiply both sides by 24.', K.p],
      ['sin ∠QPR = 0.8', '24 × 1 ÷ 30 = 0.8.', K.p],
      ['∠QPR = 53.1°', 'Inverse sine gives 53.1°.', K.p],
    ]),
    arcAt(P, Q, R, 44),
    ...E([
      ['Bearing of R from P = 055° + 53.1° = 108.1°', 'R is clockwise from Q as seen from P, so we add. To the nearest degree: 108°.', K.g],
      ['Bearing of P from R = 108.1° + 180° = 288.1°', '(d) We look back from R to P, so we add 180°. To the nearest degree: 288°.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_B10() {
  const sc = 9;
  const A = { x: 70, y: 140 }, B = bp(A, 16 * sc, 40), C = bp(A, 25 * sc, 125), cen = ctr(A, B, C);
  const actions = [
    vtx(A, 'A', cen),
    ...northAt(A, '(a) We start at A and draw a north line.'),
    brgArc(A, 30, 40, 'The bearing 040° is measured clockwise from north.'),
    mkLine(A, B, 'Town B is 16 km from A on a bearing of 040°.', { color: '#1e3a8a' }),
    vtx(B, 'B', cen),
    sideTag(A, B, cen, '16 km', 'AB = 16 km.'),
    brgArc(A, 44, 125, 'The bearing 125° is also measured clockwise from north.'),
    mkLine(A, C, 'Town C is 25 km from A on a bearing of 125°.', { color: '#1e3a8a' }),
    vtx(C, 'C', cen),
    sideTag(A, C, cen, '25 km', 'AC = 25 km.'),
    ...E([['(b) ∠BAC = 125° − 40° = 85°', 'The angle inside the triangle is the difference between the two bearings.', K.v]]),
    mkLine(B, C, '(c) Join B to C.', { color: '#1e3a8a' }),
    sideTag(B, C, cen, 'BC = ?', 'We want BC.', RED),
    ...E([
      ['BC² = AB² + AC² − 2 × AB × AC × cos A', 'Two sides and the angle between them: the cosine rule.', K.b],
      ['BC² = 16² + 25² − 2 × 16 × 25 × cos 85°', 'Put in the numbers.', K.b],
      ['BC² = 881 − 800 × 0.0872', '16² + 25² = 881, and 2 × 16 × 25 = 800.', K.b],
      ['BC² = 811.3', '881 − 69.73 = 811.27.', K.b],
      ['BC = 28.5 km (3 s.f.)', 'Take the square root: BC = 28.5 km.', K.g],
      ['sin B ⁄ AC = sin A ⁄ BC', '(d) For angle ABC we use the sine rule. A = 85° is the biggest angle, so B is acute and the sine rule is safe.', K.p],
      ['sin B ⁄ 25 = sin 85° ⁄ 28.48', 'Put in the numbers. We use the unrounded BC.', K.p],
      ['sin B = 25 × sin 85° ⁄ 28.48', 'Multiply both sides by 25.', K.p],
      ['sin B = 0.8744', '25 × 0.9962 ÷ 28.48 = 0.8744.', K.p],
      ['∠ABC = 61.0°', 'Inverse sine gives 61.0°.', K.p],
    ]),
    arcAt(B, A, C, 26), angTag(B, cen, '61.0°', 'Mark angle ABC.'),
    ...northAt(B, '(e) To find the bearing of C from B, we draw a north line at B.'),
    ...E([
      ['Bearing of A from B = 040° + 180° = 220°', 'First we look back from B to A. We add 180°.', K.v],
      ['Bearing of C from B = 220° − 61.0° = 159.0°', 'BC is 61.0° anticlockwise from BA, so we subtract. To the nearest degree: 159°.', K.v],
      ['(f) Bearing of B from C = 159.0° + 180° = 339.0°', 'We look back from C to B, so we add 180°. To the nearest degree: 339°.', K.g],
      ['(g) Total = AB + BC + CA', 'The vehicle goes round the whole triangle, so we add the three sides.', K.a],
      ['Total = 16 + 28.48 + 25', 'Put in the three lengths.', K.a],
      ['Total = 69.5 km (3 s.f.)', '16 + 28.48 + 25 = 69.48, so the total is 69.5 km.', K.a],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

const examLevels3 = [
  { id: 'b1', title: 'Level 1 — Understanding bearings', questions: [
    { no: 1, tag: 'Three-figure bearings', skill: 'Basic three-figure bearings.', question: 'Point B is directly east of point A.\n(a) State the bearing of B from A.\n(b) State the bearing of A from B.', steps: [], answer: '(a) 090°   (b) 270°', build: build_B1 },
  ] },
  { id: 'b2', title: 'Level 2 — Compass to three-figure', questions: [
    { no: 2, tag: 'Convert bearings', skill: 'Changing a compass bearing into a three-figure bearing. Very close to the November 2025 ZIMSEC Paper 1.', question: 'Convert each of the following to three-figure bearings:\n(a) N40°E\n(b) S35°E\n(c) S60°W\n(d) N25°W', steps: [], answer: '(a) 040°   (b) 145°   (c) 240°   (d) 335°', build: build_B2 },
  ] },
  { id: 'b3', title: 'Level 3 — Reverse bearings', questions: [
    { no: 3, tag: 'Finding the reverse bearing', skill: 'Reverse bearing = bearing ± 180°. Also tested in the 2025 Paper 1.', question: 'The bearing of Q from P is 047°.\nFind the bearing of P from Q.', steps: [], answer: '227°', build: build_B3 },
  ] },
  { id: 'b4', title: 'Level 4 — Bearing + distance', questions: [
    { no: 4, tag: 'Simple navigation', skill: 'Breaking a bearing into east and north parts.', question: 'A boat travels 15 km from A on a bearing of 060°.\n(a) Draw a diagram showing the journey.\n(b) How far east has the boat travelled?\n(c) How far north has it travelled?', steps: [], answer: '(b) 13.0 km east   (c) 7.5 km north', build: build_B4 },
  ] },
  { id: 'b5', title: 'Level 5 — Two points from the same starting point', questions: [
    { no: 5, tag: 'Find the distance', skill: 'Based on the structure of a November 2020 ZIMSEC question.', question: 'Point B is 8 km from A on a bearing of 075°.\nPoint C is 10 km from A on a bearing of 125°.\nCalculate BC.', steps: [], answer: 'BC ≈ 7.82 km', build: build_B5 },
  ] },
  { id: 'b6', title: 'Level 6 — Bearings + triangle', questions: [
    { no: 6, tag: 'Two towns', skill: 'Turn the bearings into the angle inside the triangle, then use the right rule.', question: 'Town B is 12 km from town A on a bearing of 065°.\nTown C is 18 km from A on a bearing of 145°.\nCalculate:\n(a) ∠BAC\n(b) BC', steps: [], answer: '(a) 80°   (b) BC ≈ 19.8 km', build: build_B6 },
  ] },
  { id: 'b7', title: 'Level 7 — North/South/East/West description', questions: [
    { no: 7, tag: 'Three towns', skill: 'Close to the November 2024 ZIMSEC Paper 1 question on towns X, Y, Z.', question: 'Town Y is 8 km due east of town X.\nTown Z is due south of Y.\nXZ = 10 km.\n(a) Draw the diagram.\n(b) Find the distance YZ.\n(c) Find the bearing of X from Z.', steps: [], answer: '(b) YZ = 6 km   (c) 307° (306.9°)', build: build_B7 },
  ] },
  { id: 'b8', title: 'Level 8 — Bearings + Cosine Rule', questions: [
    { no: 8, tag: 'Aircraft', skill: 'Find the included angle from the bearings, then use the Cosine Rule.', question: 'An aircraft flies from A to B, a distance of 240 km, on a bearing of 035°.\nIt then flies from B to C, a distance of 310 km, on a bearing of 125°.\nCalculate the direct distance AC.', steps: [], answer: 'AC ≈ 392 km', build: build_B8 },
  ] },
  { id: 'b9', title: 'Level 9 — Complete triangle', questions: [
    { no: 9, tag: 'Ship navigation', skill: 'Bearings → angles → Cosine Rule → Sine Rule → reverse bearing.', question: 'A ship leaves P and travels 18 km on a bearing of 055° to Q.\nIt then travels 24 km on a bearing of 145° to R.\nFind:\n(a) ∠PQR\n(b) PR\n(c) the bearing of R from P\n(d) the bearing of P from R.', steps: [], answer: '(a) 90°   (b) 30 km   (c) 108°   (d) 288°', build: build_B9 },
  ] },
  { id: 'b10', title: 'Level 10 — Full ZIMSEC Challenge', questions: [
    { no: 10, tag: '🔥 Towns, bearings and distances', skill: 'A full multi-part problem.', question: 'Three towns A, B and C are on level ground.\nTown B is 16 km from A on a bearing of 040°.\nTown C is 25 km from A on a bearing of 125°.\n(a) Draw a labelled diagram.\n(b) Calculate ∠BAC.\n(c) Calculate BC.\n(d) Calculate ∠ABC.\n(e) Find the bearing of C from B.\n(f) Find the bearing of B from C.\n(g) A road is built directly from B to C. Calculate the total distance travelled by a vehicle that goes A→B→C→A.', steps: [], answer: '(b) 85°   (c) 28.5 km   (d) 61.0°   (e) 159°   (f) 339°   (g) 69.5 km', build: build_B10 },
  ] },
];


/* =========================================================================
   OBTUSE RATIOS: what the exam usually asks (animated worked solutions)
   ========================================================================= */
function build_O1() {
  const O = { x: 210, y: 200 };
  const P = toXY(O, 120, 30), Q = toXY(O, 120, 150);
  const L = toXY(O, 150, 180), R = toXY(O, 150, 0);
  const actions = [
    vtx(O, 'O', { x: 210, y: 120 }),
    mkLine(L, R, 'Draw a flat line. We measure every angle from its right end.', { color: '#94a3b8' }),
    mkLine(O, P, 'Draw a line at 30° above the right side. It ends at P.', { color: '#1e3a8a' }),
    vtx(P, 'P', O),
    arcAt(O, R, P, 34), angTag(O, { x: 210, y: 120 }, '', ''),
    mkLine(O, Q, 'Now draw a line at 150°. It ends at Q.', { color: '#be185d' }),
    vtx(Q, 'Q', O),
    arcAt(O, R, Q, 50),
    mkLine(P, { x: P.x, y: O.y }, 'Drop a line down from P and from Q. Both are the same height.', { color: '#f59e0b', dashed: true }),
    mkLine(Q, { x: Q.x, y: O.y }, '', { color: '#f59e0b', dashed: true }),
    ...E([
      ['sin 150° = sin(180° − 30°) = sin 30°', 'The angles add to 180°. The height is the same, so the sine is the same.', K.b],
      ['sin 150° = 0.5', 'sin 30° = 0.5.', K.b],
      ['cos 150° = −cos 30° = −0.866', 'The distance across is the same, but Q is on the left. So the sign flips.', K.p],
      ['tan 150° = −tan 30° = −0.577', 'tan = sin ÷ cos. The sine stays and the cosine flips, so tan flips.', K.a],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_O2() {
  const sc = 30;
  const P = { x: 150, y: 230 };
  const Q = toXY(P, 5 * sc, 0), R = toXY(P, 8 * sc, 120);
  const cen = ctr(P, Q, R);
  const actions = [
    ...triLines(P, Q, R, 'Sketch triangle PQR with PQ = 5 cm, PR = 8 cm and angle P = 120°.'),
    vtx(P, 'P', cen), vtx(Q, 'Q', cen), vtx(R, 'R', cen),
    sideTag(P, Q, cen, '5 cm', 'PQ = 5 cm.'),
    sideTag(P, R, cen, '8 cm', 'PR = 8 cm.'),
    arcAt(P, Q, R, 30), angTag(P, cen, '120°', 'The angle at P, between the two known sides, is 120°.'),
    sideTag(Q, R, cen, 'QR = ?', 'We want QR.', RED),
    ...E([
      ['(a) cos 120° = −cos 60°', '120° and 60° add to 180°. So the cosine has the same size but the sign flips.', K.v],
      ['cos 120° = −0.5', 'cos 60° = 0.5.', K.v],
      ['(b) QR² = PQ² + PR² − 2 × PQ × PR × cos P', 'Two sides and the angle between them: the cosine rule.', K.b],
      ['QR² = 5² + 8² − 2 × 5 × 8 × (−0.5)', 'Put in the numbers. cos 120° is negative.', K.b],
      ['QR² = 89 + 40 = 129', 'Minus times minus is plus. So 2 × 5 × 8 × 0.5 = 40 is added.', K.b],
      ['QR = 11.4 cm (3 s.f.)', 'The square root of 129 is 11.36.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_O3() {
  const sc = 20;
  const A = { x: 150, y: 230 };
  const B = toXY(A, 6 * sc, 0), C = toXY(A, 10 * sc, 120);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with AB = 6 cm, AC = 10 cm and angle A = 120°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, '6 cm', 'AB = 6 cm.'),
    sideTag(A, C, cen, '10 cm', 'AC = 10 cm.'),
    arcAt(A, B, C, 30), angTag(A, cen, '120°', 'The angle at A, between the two known sides, is 120°.'),
    ...E([
      ['Area = ½ × AB × AC × sin A', 'We know two sides and the angle between them. This formula gives the area.', K.b],
      ['Area = ½ × 6 × 10 × sin 120°', 'Put in the numbers.', K.b],
      ['sin 120° = sin 60° = 0.866', 'Supplementary angles have the same sine. It stays positive.', K.v],
      ['Area = 30 × 0.866', '½ × 6 × 10 = 30.', K.p],
      ['Area = 26.0 cm² (3 s.f.)', '30 × 0.8660 = 25.98.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_O4() {
  const sc = 15;
  const A = { x: 120, y: 200 };
  const B = toXY(A, 5.29 * sc, 0), C = toXY(A, 10.58 * sc, 120);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with AB = x, AC = 2x, BC = 14 cm and angle A = 120°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, 'x', 'AB = x cm.'),
    sideTag(A, C, cen, '2x', 'AC = 2x cm.'),
    sideTag(B, C, cen, '14 cm', 'BC = 14 cm. It sits opposite the 120° angle.'),
    arcAt(A, B, C, 30), angTag(A, cen, '120°', 'The angle at A is 120°.'),
    ...E([
      ['(a) BC² = AB² + AC² − 2 × AB × AC × cos A', 'We know all three sides in terms of x and the angle A. Use the cosine rule for the side opposite A.', K.b],
      ['14² = x² + (2x)² − 2 × x × 2x × cos 120°', 'Put in AB = x and AC = 2x.', K.b],
      ['cos 120° = −cos 60° = −0.5', 'The cosine of an obtuse angle is negative.', K.v],
      ['196 = x² + 4x² + 2x²', '−2 × x × 2x × (−0.5) = +2x².', K.b],
      ['196 = 7x²', 'Add the x² terms.', K.b],
      ['x² = 28', 'Divide both sides by 7.', K.b],
      ['x = √28 = 2√7 cm', 'Surd form: √28 = √4 × √7 = 2√7.', K.g],
      ['(b) Area = ½ × AB × AC × sin A', 'Area from two sides and the angle between them.', K.p],
      ['Area = ½ × x × 2x × sin 120° = x² sin 120°', '½ × x × 2x = x².', K.p],
      ['sin 120° = sin 60° = 0.866', 'The sine of an obtuse angle stays positive.', K.v],
      ['Area = 28 × 0.866 = 24.2 cm² (3 s.f.)', 'x² = 28, and 28 × 0.8660 = 24.25.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_O5() {
  const sc = 40;
  const C = { x: 120, y: 230 };
  const B = toXY(C, 3.07 * sc, 0), A = toXY(C, 4 * sc, 120);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(C, B, A, 'Sketch triangle ABC with AB = 2x, BC = x, AC = 4 cm and angle C = 120°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(C, B, cen, 'x', 'BC = x cm.'),
    sideTag(C, A, cen, '4 cm', 'AC = 4 cm.'),
    sideTag(A, B, cen, '2x', 'AB = 2x cm. It sits opposite the 120° angle.'),
    arcAt(C, B, A, 30), angTag(C, cen, '120°', 'The angle at C is 120°.'),
    ...E([
      ['(i) AB² = BC² + AC² − 2 × BC × AC × cos C', 'Use the cosine rule for the side opposite C.', K.b],
      ['(2x)² = x² + 4² − 2 × x × 4 × cos 120°', 'Put in the numbers.', K.b],
      ['4x² = x² + 16 + 4x', 'cos 120° = −0.5, so −2 × x × 4 × (−0.5) = +4x.', K.b],
      ['3x² − 4x − 16 = 0', 'Move everything to the left. This is the equation we had to show.', K.g],
      ['(ii) x = (−b ± √(b² − 4ac)) ⁄ 2a', 'Use the quadratic formula with a = 3, b = −4 and c = −16.', K.p],
      ['x = (4 ± √(16 + 192)) ⁄ 6', 'b² = 16 and −4ac = 192.', K.p],
      ['x = (4 ± 14.42) ⁄ 6', 'The square root of 208 is 14.42.', K.p],
      ['x = 3.07 or x = −1.74', '18.42 ÷ 6 = 3.07 and −10.42 ÷ 6 = −1.74.', K.p],
      ['x = 3.07 cm (3 s.f.)', 'A length cannot be negative, so we reject −1.74.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

const examLevels4 = [
  { id: 'o-easy', title: 'Easy', questions: [
    { no: 1, tag: 'Ratios of a supplementary angle', skill: 'Using sin(180° − θ), cos(180° − θ) and tan(180° − θ).', question: 'Given sin 30° = 0.5, cos 30° = 0.866 and tan 30° = 0.577,\nwrite down sin 150°, cos 150° and tan 150°.', steps: [], answer: 'sin 150° = 0.5, cos 150° = −0.866, tan 150° = −0.577', build: build_O1 },
  ] },
  { id: 'o-easymed', title: 'Easy / Medium', questions: [
    { no: 2, tag: 'Direct obtuse-angle ratio', skill: 'Writing cos 120° as −cos 60°, then using it in the cosine rule.', question: 'Triangle PQR has PQ = 5 cm, PR = 8 cm and ∠QPR = 120°.\n(a) Write down the value of cos 120°.\n(b) Calculate QR.', steps: [], answer: '(a) cos 120° = −0.5   (b) QR ≈ 11.4 cm', build: build_O2 },
  ] },
  { id: 'o-med', title: 'Medium', questions: [
    { no: 3, tag: 'Area with an obtuse angle', skill: 'Using sin 120° = sin 60° in the area formula.', question: 'Triangle ABC has AB = 6 cm, AC = 10 cm and ∠BAC = 120°.\nCalculate the area of the triangle.', steps: [], answer: 'Area ≈ 26.0 cm²', build: build_O3 },
  ] },
  { id: 'o-hard', title: 'Hard', questions: [
    { no: 4, tag: 'Cosine and sine of an obtuse angle', skill: 'Negative cosine for the side, positive sine for the area. Answer in surd form.', question: 'In triangle ABC, AB = x cm, AC = 2x cm, BC = 14 cm and ∠BAC = 120°.\n(a) Calculate the value of x. Leave your answer in surd form.\n(b) Calculate the area of triangle ABC.', steps: [], answer: '(a) x = 2√7 cm   (b) Area ≈ 24.2 cm²', build: build_O4 },
    { no: 5, tag: 'Form and solve an equation', skill: 'Cosine rule with 120° gives a quadratic equation.', question: 'In triangle ABC, AB = 2x cm, BC = x cm, AC = 4 cm and ∠ACB = 120°.\n(i) Form an equation in x and show that it reduces to 3x² − 4x − 16 = 0.\n(ii) Solve the equation, giving your answers to 3 significant figures.', steps: [], answer: '(ii) x = 3.07 or x = −1.74. The length is x = 3.07 cm.', build: build_O5 },
  ] },
];


/* =========================================================================
   SUPPLEMENTARY ANGLES: what the exam usually asks (animated worked solutions)
   ========================================================================= */
const rt5 = () => {
  const sc = 18;
  const B = { x: 80, y: 230 }, C = { x: 80 + 12 * sc, y: 230 }, A = { x: 80 + 12 * sc, y: 230 - 5 * sc };
  const cen = ctr(A, B, C);
  const base = [
    ...triLines(B, C, A, 'Draw a right-angled triangle. tan x = 5 over 12, so the side opposite x is 5 and the side next to x is 12.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(B, C, cen, '12', ''),
    sideTag(C, A, cen, '5', ''),
    arcAt(B, C, A, 30), angTag(B, cen, 'x', 'The angle x is at B.'),
    mkRightAngleMark(C, angleFromCenter(C, B), angleFromCenter(C, A), { narration: 'The corner at C is a right angle.' }),
  ];
  return { A, B, C, cen, base };
};

function build_S1() {
  const { A, B, C, cen, base } = rt5();
  const actions = [
    ...base,
    sideTag(A, B, cen, '13', 'The longest side is the hypotenuse. We find it next.'),
    ...E([
      ['tan x = 5 ⁄ 12', 'tan is opposite over adjacent. So opposite = 5 and adjacent = 12.', K.b],
      ['hyp² = 5² + 12² = 169', 'Pythagoras gives the longest side.', K.p],
      ['hyp = 13', 'The square root of 169 is 13.', K.p],
      ['sin x = 5 ⁄ 13', 'sin is opposite over hypotenuse.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S2() {
  const { A, B, C, cen, base } = rt5();
  const G = { x: 20, y: 230 };
  const actions = [
    ...base,
    sideTag(A, B, cen, '13', 'Pythagoras gives the longest side: 5 squared plus 12 squared is 169, and the square root is 13.'),
    mkLine(B, G, 'Now stretch the base line to the left. Angle x and the new angle on the same straight line add up to 180°.', { color: '#f59e0b', dashed: true }),
    ...E([
      ['cos(180° − x) = −cos x', 'The supplementary angle rule. The size stays the same but the sign flips.', K.b],
      ['cos x = 12 ⁄ 13', 'cos is adjacent over hypotenuse.', K.p],
      ['cos(180° − x) = −12 ⁄ 13', 'Put a minus sign in front.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S3() {
  const sc = 17;
  const G = { x: 60, y: 230 }, H = { x: 210, y: 230 }, J = { x: 360, y: 230 };
  const K_ = { x: 210 + 6 * sc, y: 230 - 8 * sc }, M = { x: 210 + 6 * sc, y: 230 };
  const cen = { x: 210, y: 170 };
  const actions = [
    mkLine(G, J, 'G, H and J are on one straight line.', { color: '#334155' }),
    vtx(G, 'G', cen), vtx(H, 'H', cen), vtx(J, 'J', cen),
    mkLine(H, K_, 'K is a point above the line. HK = 10 cm.', { color: '#1e3a8a' }),
    vtx(K_, 'K', cen),
    sideTag(H, K_, cen, '10 cm', 'HK = 10 cm.'),
    mkLine(K_, M, 'Drop a straight line from K down to the line. It is 8 cm tall.', { color: '#f59e0b', dashed: true }),
    vtx(M, 'M', cen),
    mkRightAngleMark(M, angleFromCenter(M, H), angleFromCenter(M, K_), { narration: 'It makes a right angle.' }),
    sideTag(K_, M, cen, '8 cm', 'KM = 8 cm.'),
    arcAt(H, J, K_, 30), angTag(H, cen, 'KHJ', 'This is angle KHJ.'),
    arcAt(H, K_, G, 44), mkText({ x: 150, y: 200 }, 'GHK = ?', 'We want sin of angle GHK. It is the wide angle on the left.', { size: 15, color: RED }),
    ...E([
      ['sin KHJ = KM ⁄ HK', 'In the right-angled triangle, sin is opposite over hypotenuse.', K.b],
      ['sin KHJ = 8 ⁄ 10 = 0.8', 'Put in the numbers.', K.b],
      ['GHK = 180° − KHJ', 'G, H and J are on a straight line, so the two angles add up to 180°.', K.v],
      ['sin GHK = sin(180° − KHJ)', 'Take sin of both sides.', K.p],
      ['sin GHK = sin KHJ = 0.8', 'Supplementary angles have the same sine.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S4() {
  const sc = 22;
  const G = { x: 40, y: 230 }, H = { x: 120, y: 230 };
  const J = { x: 120 + 8.66 * sc, y: 230 }, K_ = { x: 120 + 8.66 * sc, y: 230 - 5 * sc };
  const L = { x: 400, y: 230 };
  const cen = { x: 230, y: 170 };
  const actions = [
    mkLine(G, L, 'G, H and J are on one straight line.', { color: '#334155' }),
    vtx(G, 'G', cen), vtx(H, 'H', cen), vtx(J, 'J', cen),
    mkLine(H, K_, 'HK = 10 cm.', { color: '#1e3a8a' }),
    vtx(K_, 'K', cen),
    mkLine(J, K_, 'JK = 5 cm, and the angle at J is a right angle.', { color: '#1e3a8a' }),
    mkRightAngleMark(J, angleFromCenter(J, H), angleFromCenter(J, K_), { narration: '' }),
    sideTag(H, K_, cen, '10 cm', 'HK = 10 cm.'),
    sideTag(J, K_, cen, '5 cm', 'JK = 5 cm.'),
    arcAt(H, J, K_, 30),
    mkText({ x: 55, y: 205 }, 'GHK = ?', 'We want sin of the wide angle GHK on the left. The question does not say sin of the small angle, so we must use the straight line.', { size: 15, color: RED }),
    ...E([
      ['sin KHJ = JK ⁄ HK', 'In the right-angled triangle HJK, sin is opposite over hypotenuse.', K.b],
      ['sin KHJ = 5 ⁄ 10 = 0.5', 'Put in the numbers.', K.b],
      ['GHK = 180° − KHJ', 'The two angles are on a straight line.', K.v],
      ['sin GHK = sin KHJ = 0.5', 'Supplementary angles have the same sine. The identity was hidden inside the diagram.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S5() {
  const G = { x: 60, y: 230 }, H = { x: 210, y: 230 }, J = { x: 360, y: 230 };
  const P = toXY(H, 130, 60);
  const cen = { x: 210, y: 150 };
  const actions = [
    mkLine(G, J, 'Draw a straight line. A straight line is 180°.', { color: '#334155' }),
    vtx(H, 'H', { x: 210, y: 150 }),
    mkLine(H, P, 'Draw a line from H at 60° from the right side.', { color: '#1e3a8a' }),
    arcAt(H, J, P, 34),
    mkText({ x: 262, y: 215 }, '60°', '', { size: 15, color: '#be185d' }),
    arcAt(H, P, G, 48),
    mkText({ x: 150, y: 190 }, '120°', 'The angle on the other side is 180° − 60° = 120°.', { size: 15, color: '#be185d' }),
    ...E([
      ['120° = 180° − 60°', 'The two angles make a straight line.', K.v],
      ['cos 120° = −cos 60° = −0.5', 'The size stays the same, but cos becomes negative.', K.b],
      ['150° = 180° − 30°', 'Now the same idea for 150°.', K.v],
      ['cos 150° = −cos 30° = −0.866', 'cos 30° = 0.866. Put a minus sign in front.', K.p],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S6() {
  const G = { x: 60, y: 230 }, H = { x: 210, y: 230 }, J = { x: 360, y: 230 };
  const P = toXY(H, 130, 40), Q = toXY(H, 130, 140);
  const actions = [
    mkLine(G, J, 'Draw a straight line.', { color: '#334155' }),
    vtx(H, 'H', { x: 210, y: 150 }),
    mkLine(H, P, 'Draw a line at 40° from the right side.', { color: '#1e3a8a' }),
    arcAt(H, J, P, 34),
    mkText({ x: 262, y: 215 }, '40°', '', { size: 15, color: '#be185d' }),
    mkLine(H, Q, 'Draw a line at 140° from the right side. It is a mirror image.', { color: '#be185d' }),
    arcAt(H, J, Q, 52),
    mkText({ x: 150, y: 190 }, '140°', '', { size: 15, color: '#be185d' }),
    mkLine(P, { x: P.x, y: H.y }, 'Both lines end at the same height. So they have the same sine.', { color: '#f59e0b', dashed: true }),
    mkLine(Q, { x: Q.x, y: H.y }, '', { color: '#f59e0b', dashed: true }),
    ...E([
      ['sin 120° = sin(180° − 60°) = sin 60°', '(a) Supplementary angles have the same sine.', K.b],
      ['sin 120° = 0.866', 'The sine stays positive.', K.b],
      ['sin θ = sin 40°', '(b) We want another angle with the same sine as 40°.', K.p],
      ['θ = 180° − 40° = 140°', 'The mirror angle is 180° minus 40°.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S7() {
  const sc = 30;
  const A = { x: 150, y: 230 };
  const B = toXY(A, 3 * sc, 0), C = toXY(A, 7 * sc, 120);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with AB = 3 cm, AC = 7 cm and angle A = 120°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, '3 cm', 'AB = 3 cm.'),
    sideTag(A, C, cen, '7 cm', 'AC = 7 cm.'),
    arcAt(A, B, C, 30), angTag(A, cen, '120°', 'The angle at A, between the two known sides, is 120°.'),
    sideTag(B, C, cen, 'a = ?', 'We want BC. It is opposite angle A.', RED),
    ...E([
      ['cos 120° = −cos 60° = −0.5', 'First the supplementary angle rule. The cosine of an obtuse angle is negative.', K.v],
      ['a² = 7² + 3² − 2 × 7 × 3 × cos 120°', 'Two sides and the angle between them: the cosine rule.', K.b],
      ['a² = 49 + 9 − 42 × (−0.5)', 'Put in the numbers.', K.b],
      ['a² = 58 + 21 = 79', 'Minus times minus is plus. So we add 21.', K.b],
      ['a = 8.89 cm (3 s.f.)', 'The square root of 79 is 8.89.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S8() {
  const sc = 25;
  const A = { x: 110, y: 230 };
  const B = toXY(A, 8 * sc, 0), C = toXY(A, 5 * sc, 120);
  const cen = ctr(A, B, C);
  const actions = [
    ...triLines(A, B, C, 'Sketch triangle ABC with AB = 8 cm, AC = 5 cm and angle A = 120°.'),
    vtx(A, 'A', cen), vtx(B, 'B', cen), vtx(C, 'C', cen),
    sideTag(A, B, cen, '8 cm', 'AB = 8 cm.'),
    sideTag(A, C, cen, '5 cm', 'AC = 5 cm.'),
    arcAt(A, B, C, 30), angTag(A, cen, '120°', 'The angle between the two known sides is 120°.'),
    ...E([
      ['Area = ½ × AB × AC × sin A', 'Two sides and the angle between them give the area.', K.b],
      ['Area = ½ × 8 × 5 × sin 120°', 'Put in the numbers.', K.b],
      ['sin 120° = sin 60° = 0.866', 'Supplementary angles have the same sine. It stays positive.', K.v],
      ['Area = 20 × 0.866', '½ × 8 × 5 = 20.', K.p],
      ['Area = 17.3 cm² (3 s.f.)', '20 × 0.8660 = 17.32.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S9() {
  const O = { x: 210, y: 150 }, r = 90;
  const P = toXY(O, r, 35), Q = toXY(O, r, 215);
  const actions = [
    mkLine(toXY(O, 125, 180), toXY(O, 125, 0), 'Draw the flat line through the middle O.', { color: '#334155' }),
    vtx(O, 'O', { x: 210, y: 100 }),
    mkCircle(O, r, 'Draw a circle around O.', { color: '#10b981' }),
    mkLine(O, P, 'Draw a line to P at angle b above the flat line.', { color: '#1e3a8a' }),
    vtx(P, 'P', O),
    mkLine(P, { x: P.x, y: O.y }, 'The height of P is sin b. We call it p.', { color: '#f59e0b', dashed: true }),
    mkText({ x: P.x + 22, y: (P.y + O.y) / 2 + 5 }, 'p', '', { size: 17, color: '#b45309', duration: 400 }),
    mkLine(O, Q, 'Now go 180° further round. The point Q is exactly opposite P.', { color: '#be185d' }),
    vtx(Q, 'Q', O),
    mkLine(Q, { x: Q.x, y: O.y }, 'Q is the same distance from the flat line, but it is below it. So the height is negative.', { color: '#f59e0b', dashed: true }),
    mkText({ x: Q.x - 24, y: (Q.y + O.y) / 2 + 5 }, '−p', '', { size: 17, color: '#b45309', duration: 400 }),
    ...E([
      ['sin b = p', 'This is what we are given.', K.b],
      ['sin(180° + b) = −sin b', '(a) Moving 180° round flips the height to the other side.', K.v],
      ['sin(180° + b) = −p', 'Put in p.', K.g],
      ['sin(180° − b) = sin b = p', '(b) Do not mix them up. 180° minus b keeps the sign. 180° plus b flips it.', K.a],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

function build_S10() {
  const { A, B, C, cen, base } = rt5();
  const G = { x: 20, y: 230 };
  const actions = [
    ...base,
    sideTag(A, B, cen, '13', 'Pythagoras gives the longest side: 5 squared plus 12 squared is 169, and the square root is 13.'),
    ...E([
      ['sin x = 5 ⁄ 13', '(a) Opposite over hypotenuse.', K.b],
      ['cos x = 12 ⁄ 13', 'Adjacent over hypotenuse.', K.b],
    ]),
    mkLine(B, G, '(b) Now stretch the base to the left. The wide angle is 180° − x.', { color: '#f59e0b', dashed: true }),
    ...E([
      ['cos(180° − x) = −cos x = −12 ⁄ 13', 'The cosine flips sign.', K.p],
      ['sin(180° − x) = sin x = 5 ⁄ 13', 'The sine stays the same.', K.p],
      ['tan(180° − x) = −tan x = −5 ⁄ 12', 'tan = sin ÷ cos, so the sign flips.', K.g],
    ]),
  ];
  return { viewBox: '0 0 420 300', actions, caption: null };
}

const examLevels5 = [
  { id: 's-easy', title: 'Easy', questions: [
    { no: 1, tag: 'Find sin from tan', skill: 'Use a right-angled triangle to find a missing ratio.', question: 'x is an acute angle and tan x = 5/12.\nFind sin x.', steps: [], answer: 'sin x = 5/13', build: build_S1 },
  ] },
  { id: 's-easymed', title: 'Easy / Medium', questions: [
    { no: 2, tag: 'Supplementary cosine', skill: 'cos(180° − x) = −cos x.', question: 'x is an acute angle and tan x = 5/12.\nFind cos(180° − x) as a common fraction.', steps: [], answer: 'cos(180° − x) = −12/13', build: build_S2 },
  ] },
  { id: 's-med', title: 'Medium', questions: [
    { no: 3, tag: 'Supplementary sine in a diagram', skill: 'sin(180° − θ) = sin θ.', question: 'GHJ is a straight line. K is a point above it, 8 cm from the line, and HK = 10 cm.\nFind sin GHK.', steps: [], answer: 'sin GHK = 0.8', build: build_S3 },
    { no: 4, tag: 'The identity hidden inside geometry', skill: 'Spot the straight line, then use the identity.', question: 'GHJ is a straight line. Triangle HJK has a right angle at J, JK = 5 cm and HK = 10 cm.\nFind sin GHK.', steps: [], answer: 'sin GHK = 0.5', build: build_S4 },
    { no: 5, tag: 'Cosine of an obtuse angle', skill: 'cos 120° = −cos 60° and cos 150° = −cos 30°.', question: 'Given cos 60° = 0.5 and cos 30° = 0.866,\nwrite down cos 120° and cos 150°.', steps: [], answer: 'cos 120° = −0.5, cos 150° = −0.866', build: build_S5 },
    { no: 6, tag: 'Sine of an obtuse angle', skill: 'sin 120° = sin 60°, and finding the other angle with the same sine.', question: '(a) Given sin 60° = 0.866, write down sin 120°.\n(b) Find another angle between 0° and 180° with the same sine as 40°.', steps: [], answer: '(a) 0.866   (b) 140°', build: build_S6 },
  ] },
  { id: 's-hard', title: 'Hard', questions: [
    { no: 7, tag: 'Cosine rule with 120°', skill: 'The negative sign matters.', question: 'In triangle ABC, AB = 3 cm, AC = 7 cm and angle A = 120°.\nCalculate BC.', steps: [], answer: 'BC ≈ 8.89 cm', build: build_S7 },
    { no: 8, tag: 'Area with 120°', skill: 'The sine stays positive.', question: 'In triangle ABC, AB = 8 cm, AC = 5 cm and angle A = 120°.\nCalculate the area of the triangle.', steps: [], answer: 'Area ≈ 17.3 cm²', build: build_S8 },
    { no: 9, tag: '180° plus an angle', skill: 'sin(180° + b) = −sin b, but sin(180° − b) = sin b.', question: 'b is an acute angle and sin b = p.\n(a) Write sin(180° + b) in terms of p.\n(b) Write sin(180° − b) in terms of p.', steps: [], answer: '(a) −p   (b) p', build: build_S9 },
  ] },
  { id: 's-vhard', title: 'Very Hard', questions: [
    { no: 10, tag: 'Combined triangle and supplementary angle', skill: 'Right-angled triangle first, then all three supplementary rules.', question: 'x is an acute angle and tan x = 5/12.\n(a) Find sin x and cos x.\n(b) Find sin(180° − x), cos(180° − x) and tan(180° − x).', steps: [], answer: '(a) sin x = 5/13, cos x = 12/13   (b) 5/13, −12/13, −5/12', build: build_S10 },
  ] },
];

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
    eyebrow: '',
    title: 'Obtuse Ratios',
    heading: 'Trigonometric Ratios of Obtuse Angles',
    intro: "So far, sin, cos and tan have only been defined inside a right-angled triangle — which only works for acute angles. To handle obtuse angles too, picture a radius OP of length r, sweeping anticlockwise from the positive x-axis through angle θ. Drop P's projections onto both axes — OM onto Ox, ON onto Oy — and redefine the ratios in terms of those projections. Try sweeping θ past 90° below and watch what happens to each ratio.",
    customDemo: ObtuseRatioDemo,
    theorems: [
      'sin θ = projection of OP on Oy ⁄ OP,   cos θ = projection of OP on Ox ⁄ OP,   tan θ = projection on Oy ⁄ projection on Ox.',
    ],
    examples: [example1],
    examLevels: examLevels4,
    practice: [],
  },
  {
    id: 'supplementary',
    eyebrow: '',
    title: 'Supplementary Angles',
    heading: 'The Supplementary Angle Identities',
    intro: '',
    customDemo: SupplementIdentityDemo,
    theorems: [
      'sin(180° − θ) = sin θ',
      'cos(180° − θ) = −cos θ',
      'tan(180° − θ) = −tan θ',
    ],
    examLevels: examLevels5,
    practice: [],
  },
  {
    id: 'sine-rule',
    eyebrow: '',
    title: 'The Sine Rule',
    heading: 'Proving the Sine Rule',
    intro: "Drop a perpendicular from one vertex of a triangle to the opposite side, and two right-angled triangles appear, sharing that perpendicular as a common height. Writing sin of each base angle in terms of that shared height links two sides and their opposite angles together — and the same trick works for every pair of sides, giving one continuous chain of equal ratios.",
    theorems: [
      'a ⁄ sin A = b ⁄ sin B = c ⁄ sin C, where a, b, c are the sides opposite angles A, B, C.',
    ],
    theoremFigure: SineRuleTriangleFigure,
    examLevels: examLevels,
    players: [
      { title: 'Proof — Acute-Angled Triangle', caption: null, build: build_SineRuleProofAcute },
      { title: 'Proof — Obtuse-Angled Triangle', caption: null, build: build_SineRuleProofObtuse },
    ],
    practice: [

    ],
  },
  {
    id: 'solving-triangles',
    flat: true,
    examLevels: examLevels2,
    eyebrow: '',
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
    eyebrow: '',
    title: 'Bearings',
    heading: 'Bearings and Distances',
    intro: "A three-figure bearing measures a direction clockwise from north, always written with three digits — 072°, not 72°. The same direction can be written as a compass bearing instead, like N72°E, measuring the angle away from north or south, toward east or west. Bearings problems almost always boil down to an ordinary triangle — the compass directions just tell you which angles to mark.",
    customDemo: BearingCompassDemo,
    definition: 'A bearing is always measured clockwise from north and written as three digits, e.g. 053°, 090°, 246°.',
    examples: [example5, example6],
    examLevels: examLevels3,
    practice: [],
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
      <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-4xl">{section.heading}</h2>
    </div>

    <div className="mb-6">
      {section.intro && <p className="mb-5 whitespace-pre-line break-words text-[19px] leading-[1.8] text-slate-700">{section.intro}</p>}

      {section.customDemo && <section.customDemo />}

      {section.theorems && section.theorems.length > 0 && !section.theoremFigure && (
        <div className="mb-6 space-y-3">
          {section.theorems.map((t, i) => (
            <DefinitionBox key={i} label={section.theorems.length > 1 ? `Identity ${i + 1}` : 'Theorem'}>{t}</DefinitionBox>
          ))}
        </div>
      )}
      {section.theoremFigure && <section.theoremFigure />}
      {section.definition && <DefinitionBox>{section.definition}</DefinitionBox>}

      {section.players && section.players.map((p, i) => {
        const built = p.build();
        return <ConstructionPlayer key={i} title={p.title} viewBox={built.viewBox} actions={built.actions} caption={p.caption ?? built.caption} />;
      })}
    </div>

    {section.examples && section.examples.length > 0 && (
      <div className="mb-8">
        <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-400">{section.isLibrary ? 'All Worked Examples' : 'Worked Examples'}</h3>
        {section.examples.map((ex, i) => (
          section.flat ? <FlatExample key={i} index={i + 1} example={ex} /> : <ExampleCard key={i} index={i + 1} example={ex} />
        ))}
      </div>
    )}

    {section.examLevels && (
      <div className="mb-8">
        <h3 className="mb-2 text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-4xl">What the exam usually asks</h3>
        {section.examLevels.map((lv) => (
          <div key={lv.id}>
            <h4 className="mb-3 mt-6 text-lg font-extrabold text-slate-800 sm:text-xl">{lv.title}</h4>
            {lv.questions.map((q) => <ExampleCard key={q.no} index={q.no} example={q} />)}
          </div>
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
    <div id="sr-scroll-area" className="math-lesson min-h-screen w-full bg-slate-50 font-sans text-slate-900">
      <InkStyles />
      {/* Duolingo Gradient Header */}
      <div className={`math-lesson-header relative overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 border-b-4 border-rose-700 pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">

              <span className="rounded-2xl bg-white/20 px-3 py-1 text-sm font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
              </button>
              <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">The Sine Rule</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-base">
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
                <button key={s.id} aria-current={isActive ? "step" : undefined} data-topic-id={s.id} onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="math-lesson-body w-full min-w-0 max-w-full overflow-x-hidden px-3 pb-10 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
        <div key={activeSection.id}>
          <Section section={activeSection} />
        </div>
        </div>
      <div className="math-lesson-footer sticky bottom-0 z-30 border-t border-neutral-200 bg-white/90 backdrop-blur-md">
        <div className="flex w-full items-center justify-between gap-3 px-3 py-2.5 sm:px-5 md:px-8 lg:px-10">
          <button onClick={goPrev} disabled={activeIndex === 0}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white">
            <span aria-hidden="true">←</span>
            <span className="truncate">{lang === 'sn' ? 'Kwekumashure' : 'Previous'}</span>
          </button>
          <span className="shrink-0 text-sm font-medium tabular-nums text-neutral-500">{activeIndex + 1} / {sections.length}</span>
          <button onClick={goNext} disabled={activeIndex === sections.length - 1}
            className="inline-flex min-w-0 items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-base font-medium text-white transition-colors hover:bg-neutral-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900">
            <span className="truncate">{lang === 'sn' ? 'Enderera Mberi' : 'Next'}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheSineRule;
