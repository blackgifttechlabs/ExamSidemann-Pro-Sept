
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

import React, { useState, useRef, useEffect, useMemo, useImperativeHandle } from 'react';

/* =========================================================================
   FONTS + SHARED STYLES
   ========================================================================= */
const InkStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .gc-hand { font-family: 'Patrick Hand', cursive; }
    .gc-ink { font-family: 'Kalam', cursive; }
    @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes gcChevronPulse { 0%, 100% { opacity: .15; } 40% { opacity: 1; } }
    .gc-chevron-track { display: inline-flex; align-items: center; gap: 1px; }
    .gc-chevron-track svg { animation: gcChevronPulse 1s ease-in-out infinite; }
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
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const toXY = (c, r, deg) => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.cos(t), y: c.y - r * Math.sin(t) };
};
const angleFromCenter = (center, p) => (Math.atan2(center.y - p.y, p.x - center.x) * 180) / Math.PI;
const normalizeDeg = (a) => { let x = a % 360; if (x < 0) x += 360; return x; };
const angleBetween = (a, lo, hi) => { const A = normalizeDeg(a - lo); const D = normalizeDeg(hi - lo); return A <= D; };
const arcContaining = (angA, angB, containAngle) => {
  const d1 = normalizeDeg(angB - angA);
  if (angleBetween(containAngle, angA, angA + d1)) return [angA, angA + d1];
  const d2 = normalizeDeg(angA - angB);
  return [angB, angB + d2];
};
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
const circleCircleIntersect = (c1, r1, c2, r2) => {
  const d = dist(c1, c2);
  if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) return null;
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const xm = c1.x + (a * (c2.x - c1.x)) / d;
  const ym = c1.y + (a * (c2.y - c1.y)) / d;
  const rx = -(c2.y - c1.y) * (h / d);
  const ry = (c2.x - c1.x) * (h / d);
  return [{ x: xm + rx, y: ym + ry }, { x: xm - rx, y: ym - ry }];
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

/* =========================================================================
   ACTION CREATORS
   Every visual "beat" of a construction/demo is one of these small objects.
   The player walks through them in sequence, animating each one's "draw".
   ========================================================================= */
let uidCounter = 0;
const nextId = () => `cg${uidCounter++}`;

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
    duration: opts.duration ?? 1900, color: opts.color ?? '#f472b6', width: opts.width ?? 1.35,
    opacity: opts.opacity ?? 0.58, dashed: opts.dashed ?? false, center, r, a0, a1,
  };
};

const arcThrough = (center, r, points, containAngle, narration, opts: any = {}) => {
  const pad = opts.pad ?? 14;
  const angs = points.map((p) => angleFromCenter(center, p));
  let [a0, a1] = arcContaining(angs[0], angs[1], containAngle);
  a0 -= pad; a1 += pad;
  return mkArc(center, r, a0, a1, narration, opts);
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

const mkOrbitSlide = (p1, p2, guideFn, narration, opts: any = {}) => ({
  id: nextId(), kind: 'orbit', narration, duration: opts.duration ?? 3000,
  compute: (t) => { const pos = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t }; return { marker: pos, guides: guideFn(pos) }; },
});

const mkOrbitArc = (center, r, a0, a1, guideFn, narration, opts: any = {}) => ({
  id: nextId(), kind: 'orbit', narration, duration: opts.duration ?? 3200,
  compute: (t) => { const ang = a0 + (a1 - a0) * t; const pos = toXY(center, r, ang); return { marker: pos, guides: guideFn ? guideFn(pos) : [] }; },
});

/* =========================================================================
   REUSABLE CONSTRUCTION BUILDERS
   ========================================================================= */
function perpBisectorActions(A, B, opts: any = {}) {
  const r = opts.r ?? Math.max(dist(A, B) * 0.62, dist(A, B) / 2 + 45);
  const dirAB = angleFromCenter(A, B);
  const pair = circleCircleIntersect(A, r, B, r);
  const [P, Q] = pair;
  const arcA = arcThrough(A, r, [P, Q], dirAB, opts.n1 ?? 'Open the compass wider than half of AB. From A, draw a long arc passing above and below the line.');
  const arcB = arcThrough(B, r, [P, Q], dirAB + 180, opts.n2 ?? 'Without changing the compass width, do the same from B. The two arcs cross in two places.');
  const ext1 = { x: P.x + (P.x - Q.x) * 0.15, y: P.y + (P.y - Q.y) * 0.15 };
  const ext2 = { x: Q.x + (Q.x - P.x) * 0.15, y: Q.y + (Q.y - P.y) * 0.15 };
  const bisLine = mkLine(ext1, ext2, opts.n3 ?? 'Draw a straight line through both crossing points — this is the perpendicular bisector.', { color: '#1e3a8a', width: 2.5 });
  return { actions: [arcA, arcB, mkPoint(P, '', ''), mkPoint(Q, '', ''), bisLine], P, Q, line: [ext1, ext2] };
}

function bisectAngleActions(O, angA, angB, opts: any = {}) {
  const r1 = opts.r1 ?? 90;
  const r2 = opts.r2 ?? r1 * 1.3;
  const X = toXY(O, r1, angA), Y = toXY(O, r1, angB);
  const midAng = (angA + angB) / 2;
  const cands = circleCircleIntersect(X, r2, Y, r2) || [];
  const Z = cands.slice().sort((p, q) => Math.abs(angleFromCenter(O, p) - midAng) - Math.abs(angleFromCenter(O, q) - midAng))[0];
  const bisectorAngle = angleFromCenter(O, Z);
  const rayEnd = toXY(O, r1 * 1.6, bisectorAngle);
  const arc0 = arcThrough(O, r1, [X, Y], midAng, opts.n1 ?? 'With the compass point on the vertex, draw an arc crossing both arms.');
  const dirXZ = angleFromCenter(X, Z), dirYZ = angleFromCenter(Y, Z);
  const arcX = mkArc(X, r2, dirXZ - 22, dirXZ + 22, opts.n2 ?? 'Keeping the same new width, draw two small arcs from each crossing point so they cross each other.');
  const arcY = mkArc(Y, r2, dirYZ - 22, dirYZ + 22, '');
  const lineOZ = mkLine(O, rayEnd, opts.n3 ?? 'Draw a straight line from the vertex through where the two small arcs cross.', { color: '#1e3a8a', width: 2.5 });
  return { actions: [arc0, mkPoint(X, '', ''), mkPoint(Y, '', ''), arcX, arcY, mkPoint(Z, '', opts.n4 ?? ''), lineOZ], bisectorAngle, X, Y, Z, rayEnd };
}

/* =========================================================================
   ANIMATION ENGINE — shared player used across every chapter in the series
   ========================================================================= */
const ActionShape = ({ action, progress }) => {
  if (action.kind === 'orbit') {
    const { marker, guides } = action.compute(progress);
    return (
      <g>
        {guides.map((g, i) => (
          <line key={i} x1={g.from.x} y1={g.from.y} x2={g.to.x} y2={g.to.y} stroke={g.color ?? '#f59e0b'} strokeWidth={1.5} strokeDasharray="4 3" />
        ))}
        <circle cx={marker.x} cy={marker.y} r={5} fill="#f43f5e" stroke="white" strokeWidth={1} />
      </g>
    );
  }
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
  if (action.kind === 'point' || action.kind === 'orbit') return progress;
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
        <linearGradient id="cgCompassSteel" x1="0" x2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="0.45" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
      </defs>
      <line x1={hinge.x} y1={hinge.y} x2={pin.x} y2={pin.y - 4} stroke="url(#cgCompassSteel)" strokeWidth="9" strokeLinecap="round" />
      <line x1={hinge.x} y1={hinge.y} x2={pencil.x} y2={pencil.y - 3} stroke="url(#cgCompassSteel)" strokeWidth="9" strokeLinecap="round" />
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
      <circle cx={hinge.x} cy={hinge.y} r="12" fill="url(#cgCompassSteel)" stroke="#334155" strokeWidth="1.5" />
      <circle cx={hinge.x} cy={hinge.y} r="4.5" fill="#475569" stroke="#f8fafc" strokeWidth="1.2" />
      <circle cx={hinge.x} cy={hinge.y - 25} r="9" fill="none" stroke="#cbd5e1" strokeWidth="4" />
      <rect x={hinge.x - 4} y={hinge.y - 17} width="8" height="9" rx="3" fill="url(#cgCompassSteel)" stroke="#475569" strokeWidth="1" />
    </g>
  );
};

const DrawingInstrument = ({ action, progress, previousAnchor }) => {
  if (!action || action.kind === 'point' || action.kind === 'orbit') return null;
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
    // Arcs (kind 'path') are drawn along an explicit `M a0 A ... a1` command, so
    // the pencil should sweep linearly from a0 to a1 exactly as authored.
    // Full circles (kind 'circle') are native <circle> elements instead — the
    // browser always strokes those starting at 3 o'clock (angle 0) and
    // sweeping clockwise on screen, which in this file's toXY convention
    // (y-flipped, counter-clockwise-positive) means DEcreasing angle down to
    // -360. Using the arc defaults here pointed the compass the wrong way
    // and started it from the wrong side of the circle.
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
   SECANT → TANGENT LIMIT DEMO
   A hands-on slider (not a ruler/compass build) that reproduces the book's
   Fig. 3.1 → 3.2 → 3.3 sequence: a line MN cuts a circle at X and Y; as it
   slides outward the two crossing points slide together and merge into a
   single point of contact, T, where OT is perpendicular to MN.
   ========================================================================= */
const SecantLimitDemo = () => {
  const O = { x: 210, y: 130 }, r = 88;
  const dMax = r;
  const [d, setD] = useState(0);
  const y = O.y + d;
  const halfChord = Math.sqrt(Math.max(0, r * r - d * d));
  const isTangent = dMax - d < 1.4;
  const X = { x: O.x - halfChord, y };
  const Y = { x: O.x + halfChord, y };
  const T = { x: O.x, y: O.y + r };

  let stageText;
  if (d < r * 0.35) stageText = 'MN is a secant here — it cuts right through the circle, crossing it at two separate points, X and Y.';
  else if (!isTangent) stageText = 'As MN slides downward, X and Y are sliding closer together — but the line still crosses the circle twice.';
  else stageText = 'X and Y have merged into a single point, T. MN now only touches the circle, at exactly one point — MN is a tangent, and OT is perpendicular to it.';

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">From Secant to Tangent</div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="-20 0 460 260" className="h-auto w-full">
            <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="1.8" opacity={0.85} />
            <circle cx={O.x} cy={O.y} r={2.4} fill="#0f172a" />
            <text x={O.x - 14} y={O.y - 8} className="gc-hand" fontSize="15" fill="#0f172a">O</text>
            <line x1={20} y1={y} x2={400} y2={y} stroke="#334155" strokeWidth="2.2" />
            <text x={14} y={y + 4} className="gc-hand" fontSize="14" fill="#334155">M</text>
            <text x={404} y={y + 4} className="gc-hand" fontSize="14" fill="#334155">N</text>
            {isTangent ? (
              <>
                <line x1={O.x} y1={O.y} x2={T.x} y2={T.y} stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="5 4" />
                <circle cx={T.x} cy={T.y} r={4.5} fill="#f43f5e" />
                <text x={T.x + 9} y={T.y + 4} className="gc-hand" fontSize="15" fill="#f43f5e">T</text>
                <path d={`M ${T.x - 12} ${T.y} L ${T.x - 12} ${T.y - 12} L ${T.x} ${T.y - 12}`} fill="none" stroke="#0f172a" strokeWidth="1.5" />
              </>
            ) : (
              <>
                <line x1={O.x} y1={O.y} x2={X.x} y2={X.y} stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="4 3" opacity={0.75} />
                <line x1={O.x} y1={O.y} x2={Y.x} y2={Y.y} stroke="#f59e0b" strokeWidth="1.3" strokeDasharray="4 3" opacity={0.75} />
                <circle cx={X.x} cy={X.y} r={4} fill="#f43f5e" />
                <circle cx={Y.x} cy={Y.y} r={4} fill="#f43f5e" />
                <text x={X.x - 16} y={X.y + 18} className="gc-hand" fontSize="15" fill="#f43f5e">X</text>
                <text x={Y.x + 8} y={Y.y + 18} className="gc-hand" fontSize="15" fill="#f43f5e">Y</text>
              </>
            )}
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            {!isTangent && (
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <span className="gc-chevron-track flex items-center" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <svg key={i} width="10" height="14" viewBox="0 0 10 14" style={{ animationDelay: `${i * 0.15}s` }}>
                      <polyline points="1.5,1.5 8.5,7 1.5,12.5" fill="none" stroke="#f43f5e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ))}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wide text-rose-500">Drag to slide the line</span>
              </div>
            )}
            <input
              type="range" min={0} max={dMax} step={0.5} value={d}
              onChange={(e) => setD(Number(e.target.value))}
              aria-label="Slide the line MN toward the circle"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${(d / dMax) * 100}%, #c9c9c9 ${(d / dMax) * 100}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Secant</span>
              <span>{isTangent ? 'Tangent!' : 'Sliding…'}</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">What's happening</h5>
          <p className="gc-ink text-[1.05rem] leading-snug text-blue-900">{stageText}</p>
          <p className="mt-3 text-xs italic text-slate-500">Drag the slider all the way to the right to watch X and Y become T.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   RADIUS-TO-TANGENT LOOP
   A small looping diagram: a circle with a tangent at A, and a radius that
   draws itself from O out to A, pauses so the right angle mark can appear,
   then fades and repeats. Just a play/pause icon — no timeline scrubber.
   ========================================================================= */
const RadiusToTangentDiagram = React.forwardRef((props, ref) => {
  const O = { x: 150, y: 120 }, r = 78;
  const angA = -20;
  const A = toXY(O, r, angA);
  const tangentDir = angA + 90;
  const T1 = toXY(A, 110, tangentDir);
  const T2 = toXY(A, 110, tangentDir + 180);
  const dirToO = angleFromCenter(A, O);

  const FULL_VB = { x: 0, y: 0, w: 300, h: 240 };
  const ZOOM_W = 90, ZOOM_H = 72;
  const ZOOM_VB = { x: A.x - ZOOM_W * 0.55, y: A.y - ZOOM_H * 0.55, w: ZOOM_W, h: ZOOM_H };

  const [phase, setPhase] = useState('idle'); // idle | draw | zoomIn | hold | zoomOut
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const DRAW_MS = 1000, ZOOM_MS = 900, HOLD_MS = 1800, UNZOOM_MS = 700;

  const runPhase = (name, ms, next) => {
    setPhase(name);
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / ms);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else if (next) next();
      else setPhase('idle');
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const play = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const loop = () =>
      runPhase('draw', DRAW_MS, () =>
        runPhase('zoomIn', ZOOM_MS, () =>
          runPhase('hold', HOLD_MS, () =>
            runPhase('zoomOut', UNZOOM_MS, loop)
          )
        )
      );
    loop();
  };

  useEffect(() => {
    play();
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);
  useImperativeHandle(ref, () => ({ play }));

  const radiusDraw = phase === 'draw' ? progress : (phase === 'idle' ? 0 : 1);
  const radiusPoint = { x: O.x + (A.x - O.x) * radiusDraw, y: O.y + (A.y - O.y) * radiusDraw };
  const markOpacity = phase === 'zoomIn' ? progress : phase === 'hold' ? 1 : phase === 'zoomOut' ? 1 - progress : 0;

  const zoomT = phase === 'zoomIn' ? progress : phase === 'hold' ? 1 : phase === 'zoomOut' ? 1 - progress : 0;
  const vb = {
    x: FULL_VB.x + (ZOOM_VB.x - FULL_VB.x) * zoomT,
    y: FULL_VB.y + (ZOOM_VB.y - FULL_VB.y) * zoomT,
    w: FULL_VB.w + (ZOOM_VB.w - FULL_VB.w) * zoomT,
    h: FULL_VB.h + (ZOOM_VB.h - FULL_VB.h) * zoomT,
  };

  return (
    <div className="my-5 flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
      <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="h-auto w-full max-w-[260px] shrink-0">
        <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="1.8" opacity={0.85} />
        <circle cx={O.x} cy={O.y} r={2.6} fill="#0f172a" />
        <text x={O.x - 16} y={O.y - 8} className="gc-hand" fontSize="15" fill="#0f172a">O</text>
        <line x1={T2.x} y1={T2.y} x2={T1.x} y2={T1.y} stroke="#334155" strokeWidth="2.2" />
        <line x1={O.x} y1={O.y} x2={radiusPoint.x} y2={radiusPoint.y} stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" opacity={radiusDraw > 0 ? 1 : 0} />
        <circle cx={A.x} cy={A.y} r={3.6} fill="#f43f5e" opacity={radiusDraw > 0 ? 1 : 0} />
        <text x={A.x + 8} y={A.y + 16} className="gc-hand" fontSize="15" fill="#f43f5e" opacity={radiusDraw > 0 ? 1 : 0}>A</text>
        <g opacity={markOpacity}>
          <path
            d={(() => {
              const s = 13;
              const p1 = toXY(A, s, tangentDir);
              const p2 = toXY(A, s, dirToO);
              const p3 = { x: p1.x + (p2.x - A.x), y: p1.y + (p2.y - A.y) };
              return `M ${p1.x} ${p1.y} L ${p3.x} ${p3.y} L ${p2.x} ${p2.y}`;
            })()}
            fill="none" stroke="#0f172a" strokeWidth="1.6"
          />
        </g>
      </svg>
      <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
        <p className="gc-ink text-center text-[1.05rem] leading-snug text-blue-900 sm:text-left">
          Press play below — the radius draws out to the point of contact, then the view zooms in on the right angle where it meets the tangent.
        </p>
      </div>
    </div>
  );
});

const PerpendicularToCentreDiagram = React.forwardRef((props, ref) => {
  const O = { x: 150, y: 120 }, r = 78;
  const angA = -20;
  const A = toXY(O, r, angA);
  const tangentDir = angA + 90;
  const T1 = toXY(A, 110, tangentDir);
  const T2 = toXY(A, 110, tangentDir + 180);
  const perpDir = angleFromCenter(A, O);
  const perpFar = toXY(A, r * 1.65, perpDir);

  const [phase, setPhase] = useState('idle'); // idle | tangent | perp | hold | fadeOut
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  const TAN_MS = 700, PERP_MS = 1100, HOLD_MS = 1800, FADE_MS = 600;

  const runPhase = (name, ms, next) => {
    setPhase(name);
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / ms);
      setProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else if (next) next();
      else setPhase('idle');
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const play = () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const loop = () =>
      runPhase('tangent', TAN_MS, () =>
        runPhase('perp', PERP_MS, () =>
          runPhase('hold', HOLD_MS, () =>
            runPhase('fadeOut', FADE_MS, loop)
          )
        )
      );
    loop();
  };

  useEffect(() => {
    play();
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);
  useImperativeHandle(ref, () => ({ play }));

  const tangentDraw = phase === 'idle' ? 0 : phase === 'tangent' ? progress : 1;
  const tangentPoint2 = { x: A.x + (T1.x - A.x) * tangentDraw, y: A.y + (T1.y - A.y) * tangentDraw };
  const tangentPoint1 = { x: A.x + (T2.x - A.x) * tangentDraw, y: A.y + (T2.y - A.y) * tangentDraw };

  const perpDraw = phase === 'perp' ? progress : (phase === 'hold' || phase === 'fadeOut') ? 1 : 0;
  const perpPoint = { x: A.x + (perpFar.x - A.x) * perpDraw, y: A.y + (perpFar.y - A.y) * perpDraw };

  const centreOpacity = phase === 'hold' ? 1 : phase === 'fadeOut' ? 1 - progress : perpDraw >= 0.97 ? 1 : 0;
  const fadeAll = phase === 'fadeOut' ? 1 - progress : 1;

  return (
    <div className="my-5 flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
      <svg viewBox="0 0 300 240" className="h-auto w-full max-w-[260px] shrink-0" style={{ opacity: fadeAll }}>
        <circle cx={O.x} cy={O.y} r={r} fill="none" stroke="#10b981" strokeWidth="1.8" opacity={0.85} />
        <circle cx={O.x} cy={O.y} r={2.6} fill="#0f172a" opacity={centreOpacity} />
        <text x={O.x - 16} y={O.y - 8} className="gc-hand" fontSize="15" fill="#0f172a" opacity={centreOpacity}>O</text>
        <line x1={tangentPoint1.x} y1={tangentPoint1.y} x2={tangentPoint2.x} y2={tangentPoint2.y} stroke="#334155" strokeWidth="2.2" />
        <circle cx={A.x} cy={A.y} r={3.6} fill="#f43f5e" opacity={tangentDraw > 0 ? 1 : 0} />
        <text x={A.x + 8} y={A.y + 16} className="gc-hand" fontSize="15" fill="#f43f5e" opacity={tangentDraw > 0 ? 1 : 0}>A</text>
        <line x1={A.x} y1={A.y} x2={perpPoint.x} y2={perpPoint.y} stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" opacity={perpDraw > 0 ? 1 : 0} />
      </svg>
      <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
        <p className="gc-ink text-center text-[1.05rem] leading-snug text-blue-900 sm:text-left">
          Watch the perpendicular line sweep out from the tangent — see how it always lands exactly on the centre, O.
        </p>
      </div>
    </div>
  );
});

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

const TheoremExplainer = ({ heading, paragraphs, callout, calloutSn, footer, audioSrc, diagramRef }) => {
  const [showSn, setShowSn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    if (diagramRef && diagramRef.current) diagramRef.current.play();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
  };

  return (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-4 text-lg font-bold text-slate-900">{heading}</h3>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <div key={i} className="leading-relaxed text-slate-700">{p}</div>
        ))}
      </div>
      <div className="my-4 flex items-start gap-3 rounded-r-lg border-l-4 border-rose-300 bg-rose-50/60 py-3 pl-4 pr-3">
        <p className="flex-1 font-bold leading-snug text-slate-800">{showSn && calloutSn ? calloutSn : callout}</p>
        <div className="flex shrink-0 flex-col items-center gap-1.5">
          {calloutSn && (
            <button
              type="button"
              onClick={() => setShowSn((s) => !s)}
              aria-pressed={showSn}
              title={showSn ? 'Show in English' : 'Bvunza muChiShona'}
              className={`flex items-center justify-center rounded-lg p-1 transition ${showSn ? 'bg-white ring-2 ring-emerald-500' : 'bg-white/60 hover:bg-white'}`}
            >
              <ZwFlag className="h-4 w-6" />
            </button>
          )}
          {audioSrc && (
            <>
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-pressed={isPlaying}
                title={isPlaying ? 'Pause explanation' : 'Play explanation'}
                className="relative overflow-hidden flex items-center justify-center rounded-full p-1.5 text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 3px 0 #155208, 0 4px 6px rgba(0,0,0,0.25)' }}
              >
                <span className="absolute inset-x-0.5 top-0.5 h-1.5 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {isPlaying ? (
                  <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="0" width="3.5" height="10" fill="white" /><rect x="6.5" y="0" width="3.5" height="10" fill="white" /></svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="0,0 10,5 0,10" fill="white" /></svg>
                )}
              </button>
              <audio
                ref={audioRef}
                src={audioSrc}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                className="hidden"
              />
            </>
          )}
        </div>
      </div>
      {footer && <p className="leading-relaxed text-slate-700">{footer}</p>}
    </div>
  );
};

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
   BUILDING EACH SECTION'S CONSTRUCTIONS
   ========================================================================= */

// --- 3.1 Constructing a tangent at a point on a circle ---
function build_TangentAtPointDemo() {
  const O = { x: 210, y: 165 }, r = 92;
  const angA = 205;
  const A = toXY(O, r, angA);
  const given = [
    mkCircle(O, r, 'Here is a circle, centre O, with a point A marked on its circumference.'),
    mkPoint(O, 'O', ''), mkPoint(A, 'A', ''),
    mkLine(O, A, 'Draw the radius OA, and extend it a little beyond A.', { color: '#334155' }),
  ];
  const dirToO = angleFromCenter(A, O);
  const { actions, bisectorAngle } = bisectAngleActions(A, dirToO, dirToO + 180, {
    r1: 78,
    n1: 'With the compass point on A, mark a point the same distance away on each side, along the extended radius.',
    n2: 'Keeping the same new width, draw two small arcs from each of those marks so they cross each other, above and below the radius.',
    n3: 'Draw a straight line through A and the point where the new arcs cross.',
    n4: '',
  });
  const backEnd = toXY(A, 78 * 1.6, bisectorAngle + 180);
  const finish = mkLine(A, backEnd, 'Extend this new line the other way through A too — the whole line only ever touches the circle at A, and it meets OA at a perfect right angle. This is the tangent at A.', { color: '#1e3a8a' });
  const mark = mkRightAngleMark(A, dirToO, bisectorAngle);
  return { viewBox: '0 0 420 300', actions: [...given, ...actions, finish, mark] };
}

// --- 3.2 Constructing both tangents from an external point ---
function build_TangentsFromExternalDemo() {
  const O = { x: 140, y: 210 }, r = 68;
  const T = { x: 355, y: 90 };
  const given = [mkCircle(O, r, 'Here is a circle, centre O, and a point T outside it.'), mkPoint(O, 'O', ''), mkPoint(T, 'T', '')];
  const joinOT = mkLine(O, T, 'Join O to T with a straight line.', { color: '#334155' });
  const bis = perpBisectorActions(O, T, {
    r: dist(O, T) * 0.6,
    n1: 'Construct the perpendicular bisector of OT, the usual way — open the compass wider than half of OT and swing an arc from each end.',
    n2: 'The two arcs cross above and below the line.',
    n3: 'Join the crossing points. Where this new line meets OT is the midpoint, M.',
  });
  const M = mid(O, T);
  const rm = dist(M, O);
  const bigCircle = mkCircle(M, rm, 'With the compass point on M and the pencil on O, draw a circle. Since M is the midpoint of OT, this circle passes through both O and T.', { color: '#f59e0b', duration: 2200 });
  const hits = circleCircleIntersect(M, rm, O, r) || [];
  const [A, B] = hits;
  const markA = mkPoint(A, 'A', 'This new circle crosses our original circle at two points — call them A and B.');
  const markB = mkPoint(B, 'B', '');
  const lineTA = mkLine(T, A, 'Draw a straight line from T through A…', { color: '#1e3a8a' });
  const lineTB = mkLine(T, B, '…and another straight line from T through B. TA and TB are the two tangents from T — and they are exactly equal in length.', { color: '#1e3a8a' });
  const rightA = mkRightAngleMark(A, angleFromCenter(A, O), angleFromCenter(A, T));
  const rightB = mkRightAngleMark(B, angleFromCenter(B, O), angleFromCenter(B, T));
  return { viewBox: '0 0 420 300', actions: [...given, joinOT, ...bis.actions, bigCircle, markA, markB, lineTA, lineTB, rightA, rightB], meta: { O, T, A, B } };
}

// --- 3.3 Contact of circles ---
function build_ExternalContactDemo() {
  const A = { x: 130, y: 130 }, rA = 68;
  const rB = 42;
  const B = { x: A.x + rA + rB, y: A.y };
  const T = { x: A.x + rA, y: A.y };
  const given = [
    mkCircle(A, rA, 'Here are two circles, centres A and B, touching each other externally.'), mkPoint(A, 'A', ''),
    mkCircle(B, rB, '', { color: '#10b981' }), mkPoint(B, 'B', ''),
  ];
  const lineAB = mkLine(A, B, 'Join the two centres, A and B — this straight line is called the line of centres.', { color: '#334155', dashed: true });
  const markT = mkPoint(T, 'T', 'The point where the two circles touch, T, always lies exactly on the line of centres.');
  const tangent = mkLine({ x: T.x, y: T.y - 46 }, { x: T.x, y: T.y + 46 }, 'A common tangent drawn at T is perpendicular to the line of centres, since it must be perpendicular to both radius AT and radius BT at the same time.', { color: '#1e3a8a' });
  const mark = mkRightAngleMark(T, 0, 90);
  return { viewBox: '0 0 420 220', actions: [...given, lineAB, markT, tangent, mark], caption: `AB = ${rA} + ${rB} — for external contact, the distance between the centres equals the SUM of the two radii.` };
}

function build_InternalContactDemo() {
  const A = { x: 210, y: 140 }, rA = 100, rB = 42;
  const B = { x: A.x + (rA - rB), y: A.y };
  const T = { x: A.x + rA, y: A.y };
  const given = [
    mkCircle(A, rA, 'Here, one circle (centre A) touches a smaller circle (centre B) from the inside.'), mkPoint(A, 'A', ''),
    mkCircle(B, rB, '', { color: '#10b981' }), mkPoint(B, 'B', ''),
  ];
  const lineAB = mkLine(A, B, 'Once again, join the centres — the point of contact still lies on this line of centres, extended out to the edge of the big circle.', { color: '#334155', dashed: true });
  const markT = mkPoint(T, 'T', '');
  const tangent = mkLine({ x: T.x - 40, y: T.y - 26 }, { x: T.x + 40, y: T.y + 26 }, 'The common tangent at T is still perpendicular to AB — it just touches both circles from the same side now.', { color: '#1e3a8a' });
  const mark = mkRightAngleMark(T, angleFromCenter(T, A), angleFromCenter(T, A) - 90);
  return { viewBox: '0 0 460 260', actions: [...given, lineAB, markT, tangent, mark], caption: `AB = ${rA} − ${rB} — for internal contact, the distance between the centres equals the DIFFERENCE of the two radii.` };
}

// --- 3.4 Alternate segment theorem ---
function build_AlternateSegmentDemo() {
  const O = { x: 210, y: 150 }, r = 96;
  const angA = -75;
  const A = toXY(O, r, angA);
  const tangentDir = angA + 90;
  const T1 = toXY(A, 150, tangentDir);
  const T2 = toXY(A, 150, tangentDir + 180);
  const angB = angA + 128;
  const B = toXY(O, r, angB);
  const given = [
    mkCircle(O, r, 'Here is a circle, with SAT drawn as a tangent touching it at A.'),
    mkPoint(O, 'O', ''),
    mkLine(T2, T1, '', { color: '#334155' }),
    mkPoint(A, 'A', ''),
  ];
  const chord = mkLine(A, B, 'From the point of contact, A, draw a chord AB. This chord splits the circle into two segments — one on each side of AB.', { color: '#1e3a8a' });
  const markB = mkPoint(B, 'B', '');
  const nearArc = arcThrough(O, r * 0.4, [A, B], angA + 15, 'The small segment tucked in the angle between the tangent and the chord is the segment ADJACENT to that angle.', { color: '#f472b6', duration: 1200, pad: -4 });
  const orbitFar = mkOrbitArc(O, r, angB, angA + 360, (pos) => [{ from: pos, to: A, color: '#f59e0b' }, { from: pos, to: B, color: '#f59e0b' }], 'Now slide a point P around the OTHER segment — the one on the far side of AB. Watch the angle APB it sees: however far P slides, that angle never changes, and it always equals the angle between the tangent and the chord, TAB.', { duration: 3600 });
  return { viewBox: '0 0 420 300', actions: [...given, chord, markB, nearArc, orbitFar] };
}

// --- Worked-example diagrams ---
function build_Example1Diagram() {
  const O = { x: 210, y: 150 }, r = 90;
  const angA = 200;
  const A = toXY(O, r, angA);
  const tangentDir = angA + 90;
  const T1 = toXY(A, 130, tangentDir);
  const T2 = toXY(A, 130, tangentDir + 180);
  const angB = angA - 95;
  const B = toXY(O, r, angB);
  const given = [
    mkCircle(O, r, 'Circle, centre O, with TA a tangent touching it at A.'),
    mkPoint(O, 'O', ''),
    mkLine(T2, T1, 'Draw the tangent line at A.', { color: '#334155' }),
    mkPoint(A, 'A', ''),
  ];
  const radOA = mkLine(O, A, 'Join the radius OA — it meets the tangent at exactly 90°.', { color: '#334155', dashed: true });
  const rightMark = mkRightAngleMark(A, tangentDir, angleFromCenter(A, O));
  const chord = mkLine(A, B, 'Draw the chord AB. The angle between the tangent and this chord is x°.', { color: '#1e3a8a' });
  const markB = mkPoint(B, 'B', '');
  const radOB = mkLine(O, B, 'Join OB. Since OA and OB are both radii, triangle AOB is isosceles.', { color: '#334155', dashed: true });
  return { viewBox: '0 0 420 300', actions: [...given, radOA, rightMark, chord, markB, radOB], caption: 'Angle BÂT = x° and angle BÔA = 2x° — the isosceles triangle AOB is the key.' };
}

function build_Example2Diagram() {
  const O = { x: 140, y: 210 }, r = 68;
  const T = { x: 355, y: 90 };
  const M = mid(O, T);
  const rm = dist(M, O);
  const hits = circleCircleIntersect(M, rm, O, r) || [];
  const [A, B] = hits;
  const X = lineLineIntersect(O, T, A, B) || M;
  const given = [
    mkCircle(O, r, 'Circle, centre O, with TA and TB the two tangents from external point T.'),
    mkPoint(O, 'O', ''), mkPoint(T, 'T', ''),
  ];
  const lineTA = mkLine(T, A, 'Draw tangent TA.', { color: '#1e3a8a' });
  const lineTB = mkLine(T, B, 'Draw tangent TB.', { color: '#1e3a8a' });
  const markA = mkPoint(A, 'A', '');
  const markB = mkPoint(B, 'B', '');
  const joinOT = mkLine(O, T, 'Join OT — by symmetry, this line bisects angle ATB and crosses AB at right angles, at X.', { color: '#334155', dashed: true });
  const joinAB = mkLine(A, B, 'Join AB. It crosses OT at X.', { color: '#f59e0b' });
  const markX = mkPoint(X, 'X', '');
  const rightMark = mkRightAngleMark(X, angleFromCenter(X, A), angleFromCenter(X, T));
  return { viewBox: '0 0 420 300', actions: [...given, lineTA, lineTB, markA, markB, joinOT, joinAB, markX, rightMark], caption: 'Angle ATO = 39° is given; triangle TAX has a right angle at X.' };
}

function build_Example3Diagram() {
  const O = { x: 210, y: 150 }, r = 85;
  const angX = 150, angY = 20;
  const X = toXY(O, r, angX);
  const Y = toXY(O, r, angY);
  const dirX = angX + 90;
  const dirY = angY - 90;
  const T = lineLineIntersect(X, toXY(X, 200, dirX), Y, toXY(Y, 200, dirY));
  const angZ = -110;
  const Z = toXY(O, r, angZ);
  const given = [
    mkCircle(O, r, 'Circle, centre O, with X, Y and Z three points on it.'),
    mkPoint(O, 'O', ''), mkPoint(X, 'X', ''), mkPoint(Y, 'Y', ''),
  ];
  const tanX = mkLine(X, T, 'Draw the tangent at X.', { color: '#1e3a8a' });
  const tanY = mkLine(Y, T, 'Draw the tangent at Y — the two tangents meet at T.', { color: '#1e3a8a' });
  const markT = mkPoint(T, 'T', '');
  const radOX = mkLine(O, X, '', { color: '#334155', dashed: true });
  const radOY = mkLine(O, Y, 'OX and OY are both perpendicular to their tangents.', { color: '#334155', dashed: true });
  const rightX = mkRightAngleMark(X, dirX, angleFromCenter(X, O));
  const rightY = mkRightAngleMark(Y, dirY, angleFromCenter(Y, O));
  const markZ = mkPoint(Z, 'Z', 'Z sits on the major arc XY.');
  const lineZX = mkLine(Z, X, '', { color: '#f59e0b' });
  const lineZY = mkLine(Z, Y, 'Angle XZY is the angle at the circumference standing on arc XY.', { color: '#f59e0b' });
  return { viewBox: '0 0 420 320', actions: [...given, tanX, tanY, markT, radOX, radOY, rightX, rightY, markZ, lineZX, lineZY], caption: 'Angle XTY = 58° is given; quadrilateral TXOY has two right angles.' };
}

function build_Example4Diagram() {
  const A = { x: 140, y: 190 };
  const rA = 55, rB = 88, rC = 66;
  const B = { x: A.x + rA + rB, y: A.y };
  const cHits = circleCircleIntersect(A, rA + rC, B, rB + rC) || [];
  const C = cHits[0] || { x: A.x + 40, y: A.y - 100 };
  const given = [
    mkCircle(A, rA, 'Three circles, centres A, B and C, each touching the other two.'), mkPoint(A, 'A', ''),
    mkCircle(B, rB, '', { color: '#10b981' }), mkPoint(B, 'B', ''),
    mkCircle(C, rC, '', { color: '#f59e0b' }), mkPoint(C, 'C', ''),
  ];
  const lineAB = mkLine(A, B, 'Join the centres to form triangle ABC. AB = 13 cm.', { color: '#334155' });
  const lineBC = mkLine(B, C, 'BC = 14 cm.', { color: '#334155' });
  const lineCA = mkLine(C, A, 'CA = 11 cm.', { color: '#334155' });
  return { viewBox: '0 0 460 300', actions: [...given, lineAB, lineBC, lineCA], caption: 'Each side of triangle ABC is the SUM of the two radii it joins.' };
}

function build_Example5Diagram() {
  const O = { x: 210, y: 150 }, r = 88;
  const angQ = -70;
  const Q = toXY(O, r, angQ);
  const tangentDir = angQ + 90;
  const P = toXY(Q, 140, tangentDir);
  const X = toXY(Q, 140, tangentDir + 180);
  const angR = angQ + 110;
  const R = toXY(O, r, angR);
  const angS = angQ + 220;
  const S = toXY(O, r, angS);
  const given = [
    mkCircle(O, r, 'Circle QRS, with PQX a tangent touching it at Q.'),
    mkLine(X, P, '', { color: '#334155' }),
    mkPoint(Q, 'Q', ''),
  ];
  const chordQR = mkLine(Q, R, 'Draw chord QR — angle RQX = 48°.', { color: '#1e3a8a' });
  const markR = mkPoint(R, 'R', '');
  const chordQS = mkLine(Q, S, 'Draw chord QS.', { color: '#1e3a8a' });
  const markS = mkPoint(S, 'S', '');
  const chordRS = mkLine(R, S, 'Join RS to complete triangle QRS — angle RSQ = 55°.', { color: '#f59e0b' });
  return { viewBox: '0 0 420 320', actions: [...given, chordQR, markR, chordQS, markS, chordRS], caption: 'By the alternate segment theorem, angle SQX equals angle SQR (the angle in triangle QRS at Q).' };
}

function build_Example6Diagram() {
  const O = { x: 210, y: 150 }, r = 88;
  const angT = -70;
  const T = toXY(O, r, angT);
  const tangentDir = angT + 90;
  const P = toXY(T, 140, tangentDir);
  const P2 = toXY(T, 140, tangentDir + 180);
  const angB = angT + 100;
  const B = toXY(O, r, angB);
  const angA = angT + 190;
  const A = toXY(O, r, angA);
  const angC = angT - 90;
  const C = toXY(O, r, angC);
  const given = [
    mkCircle(O, r, 'Circle ABCT, with PT a tangent at T.'),
    mkLine(P2, P, '', { color: '#334155' }),
    mkPoint(T, 'T', ''),
  ];
  const chordTB = mkLine(T, B, 'Draw chord TB — angle ATP = 82° is the angle between the tangent and TA.', { color: '#1e3a8a' });
  const markB = mkPoint(B, 'B', '');
  const chordTA = mkLine(T, A, 'Draw chord TA.', { color: '#1e3a8a' });
  const markA = mkPoint(A, 'A', '');
  const chordBA = mkLine(B, A, 'BA = BT, so triangle ABT is isosceles.', { color: '#f59e0b' });
  const markC = mkPoint(C, 'C', '');
  const chordBC = mkLine(B, C, '', { color: '#334155' });
  const chordCT = mkLine(C, T, 'ABTC is a cyclic quadrilateral — opposite angles sum to 180°.', { color: '#334155' });
  return { viewBox: '0 0 420 320', actions: [...given, chordTB, markB, chordTA, markA, chordBA, markC, chordBC, chordCT], caption: 'Alternate segment theorem gives angle ABT = angle ATP = 82°.' };
}

/* =========================================================================
   CHAPTER CONTENT
   ========================================================================= */
const radiusTangentDiagramRef = React.createRef();
const perpToCentreDiagramRef = React.createRef();

const sections = [
  {
    id: 'tangent-radius',
    eyebrow: 'Chapter 3.1',
    title: 'Tangent & Radius',
    heading: 'Tangent to a Circle',
    intro: (
      <>
        <p className="mb-4 leading-relaxed text-slate-700">
          Imagine a straight line passing through a circle. The line cuts the circle at <strong>two points</strong>.
        </p>
        <p className="mb-4 leading-relaxed text-slate-700">
          Now move the line slowly away from the centre of the circle. The two points where the line crosses the circle move closer and closer together.
        </p>
        <p className="mb-4 leading-relaxed text-slate-700">
          Eventually, the two points meet at <strong>one point</strong>. At this moment, the line no longer cuts through the circle — it just <strong>touches</strong> it.
        </p>
        <p className="mb-4 leading-relaxed text-slate-700">
          This line is called a <strong>tangent</strong>, and the single point where it touches the circle is called the <strong>point of contact</strong>.
        </p>
        <p className="mb-4 font-bold leading-relaxed text-slate-700">
          Try moving the line below and see it happen for yourself.
        </p>
      </>
    ),
    demoBefore: true,
    theoremBlocks: [
      {
        heading: 'Something Interesting About a Tangent',
        paragraphs: [
          <>We now know that a tangent touches the circle at just <strong>one point</strong>.</>,
          <>But look closely at that touching point.</>,
          <>Draw a line from the <strong>centre of the circle</strong> to the point where the tangent touches it.</>,
          <RadiusToTangentDiagram ref={radiusTangentDiagramRef} />,
          <>What do you notice about the angle between the radius and the tangent?</>,
          <>It is a <strong>right angle — 90°</strong>.</>,
          <>So we have an important rule:</>,
        ],
        callout: 'A tangent to a circle is perpendicular to the radius drawn to its point of contact.',
        calloutSn: 'Tangent ye circle ringori line rakagumha circle panhu 1, panhu parakagumha ipapo panonzi point of contact, now inzwa, ukadrawa ka line kuba pakati pe circle kunobata tangent, pazvinosangana panenge paine 90 digirizi (degrees kkkk) , saka manje iyoyo reason yekuti panosangana radius ne tangent pane 90 deegreen ndosaka pachizonzi,  A tangent to a circle is perpendicular to the radius drawn to its point of contact',
        footer: <>This is called the <strong>tangent-radius theorem</strong>.</>,
        audioSrc: '/sounds/maths/tangent of a circle.wav',
        diagramRef: radiusTangentDiagramRef,
      },
      {
        heading: 'Can We Work Backwards?',
        paragraphs: [
          <>We know that a radius drawn to the point of contact is perpendicular to the tangent.</>,
          <>But what if we start with a tangent and draw a line <strong>perpendicular to it</strong> at the point where it touches the circle?</>,
          <PerpendicularToCentreDiagram ref={perpToCentreDiagramRef} />,
          <>Where does that line go?</>,
          <strong>It passes through the centre of the circle.</strong>,
          <>So we get another important result:</>,
        ],
        callout: 'The line perpendicular to a tangent at its point of contact always passes through the centre of the circle.',
        calloutSn: 'Rangarira kuti tangent ye circle inobata circle panhu 1 chete panonzi pa point of contact, ukadrawa ka line kari straight kane 90 degrees netangent, ikako ka line kanopfuura nepakati pe circle always chero ukachinja pane tangent.',
        footer: <>This is the <strong>converse of the tangent-radius theorem</strong>.</>,
        audioSrc: '/sounds/maths/tangent2.wav',
        diagramRef: perpToCentreDiagramRef,
      },
    ],
    players: [
      { title: 'Constructing a Tangent at a Given Point on a Circle', caption: 'The finished line touches the circle only at A, and meets the radius OA at exactly 90°.', build: build_TangentAtPointDemo },
    ],
    examples: [
      { tag: 'Worked Example 1', question: 'TA is a tangent at A to a circle, centre O. AB is a chord. If the angle between the tangent and the chord, BÂT, is x°, show that the angle BÔA is 2x°.', steps: ['Since a tangent is perpendicular to the radius at the point of contact, angle BÂO = (90 − x)°.', 'Triangle AOB is isosceles, because OA and OB are both radii, so angle ABO is also (90 − x)°.', 'The three angles of triangle AOB add up to 180°, so angle BÔA = 180° − 2(90 − x)°.'], answer: 'BÔA = 180° − 180° + 2x° = 2x°', build: build_Example1Diagram },
    ],
    practice: [
      'A circle has centre O and radius 6 cm. A tangent touches the circle at point A. Sketch the diagram and mark the right angle you know must be there, without measuring anything.',
      'TA is a tangent to a circle at A, and AB is a chord such that angle between the tangent and chord is 34°. Use the worked example above to find the angle the chord subtends at the centre.',
      'A surveyor is pegging out a circular reservoir. Explain, using only a right-angle set square and a length of string from the centre, how they could check whether a fence post exactly touches the reservoir\'s edge without crossing into the water.',
    ],
  },
  {
    id: 'external-point',
    eyebrow: 'Chapter 3.2',
    title: 'Tangents from a Point',
    heading: 'Tangents from an External Point',
    intro: "From any point outside a circle, exactly two tangents can be drawn to it. What's remarkable is that those two tangents always turn out to be exactly the same length — and the line joining the external point back to the centre always bisects both the angle between the tangents, and the angle between the two radii drawn to the points of contact.",
    theorems: [
      'The two tangents drawn to a circle from the same external point are always equal in length.',
    ],
    players: [
      { title: 'Constructing Both Tangents from an External Point', caption: "TA and TB are the two tangents from T — equal in length, with OT bisecting angle ATB.", build: build_TangentsFromExternalDemo },
    ],
    examples: [
      { tag: 'Worked Example 2', question: 'O is the centre of a circle, and TA and TB are tangents from an external point T. If angle ATO = 39°, calculate angle TBX, where X is the point where the diagonals of quadrilateral TAOB cross.', steps: ['In triangle TAX, angle AXT = 90° (this follows from the symmetry of the figure — OT is the line of symmetry, so it crosses AB at right angles).', 'The three angles of triangle TAX sum to 180°, so angle TAX = 180° − (90° + 39°) = 51°.', 'By the same symmetry, angle TBX must equal angle TAX.'], answer: 'TBX = 51°', build: build_Example2Diagram },
      { tag: 'Worked Example 3', question: 'X, Y and Z are three points on a circle, centre O. The tangents to the circle at X and Y meet at T. If angle XTY = 58°, calculate angle XZY, where Z is on the major arc XY.', steps: ['In quadrilateral TXOY, both angle OXT and angle OYT are 90°, since a tangent is perpendicular to its radius.', 'The angles of the quadrilateral sum to 360°, so angle XOY = 360° − 90° − 90° − 58° = 122°.', 'The angle at the centre is twice the angle at the circumference standing on the same arc, so angle XZY = half of 122°.'], answer: 'XZY = 61° (or 119° if Z is taken on the minor arc instead)', build: build_Example3Diagram },
    ],
    practice: [
      'Two tangents are drawn to a circle of radius 5 cm from an external point 13 cm from the centre. Sketch the diagram, marking every right angle, and find the length of each tangent using Pythagoras.',
      'A goat-herder ties two ropes of equal length from a post to a circular fenced garden, so that each rope just grazes the fence without crossing into it. Explain, using the theorem above, why both ropes must be the same length no matter where the post stands.',
      'PT and QT are tangents from an external point T to a circle, centre O. If angle PTQ = 64°, calculate angle POQ.',
    ],
  },
  {
    id: 'contact-circles',
    eyebrow: 'Chapter 3.3',
    title: 'Contact of Circles',
    heading: 'Contact of Circles',
    intro: "Two circles touch each other when they share a single common tangent at exactly the same point. That can happen in two different ways: the circles can sit side-by-side (touching externally), or one can nestle inside the other (touching internally). Either way, one fact never changes — the point where they touch always lies exactly on the straight line joining their two centres.",
    definition: 'If two circles touch each other, the point of contact lies on the line of centres, and the distance between the centres equals the sum of the radii (external contact) or the difference of the radii (internal contact).',
    players: [
      { title: 'Circles Touching Externally', caption: null, build: build_ExternalContactDemo },
      { title: 'Circles Touching Internally', caption: null, build: build_InternalContactDemo },
    ],
    examples: [
      { tag: 'Worked Example 4', question: 'A, B and C are the centres of three circles that all touch each other externally. If AB = 13 cm, BC = 14 cm and CA = 11 cm, calculate the radius of each circle.', steps: ['Since every pair of circles touches externally, each distance between centres is the SUM of that pair\'s radii: a + b = 13, b + c = 14, c + a = 11 (using a, b, c for the radii at A, B, C).', 'Subtracting the third equation from the second gives b − a = 3.', 'Adding this to the first equation (a + b = 13) gives 2b = 16, so b = 8. Then a = 13 − 8 = 5, and c = 14 − 8 = 6.'], answer: 'The radii are 5 cm (A), 8 cm (B) and 6 cm (C).', build: build_Example4Diagram },
    ],
    practice: [
      'Two circles of radius 9 cm and 5 cm touch each other externally. What is the distance between their centres?',
      'A circle of radius 15 cm touches a smaller circle of radius 4 cm internally. Find the distance between the two centres.',
      'Three coins of radii 2 cm, 3 cm and 4 cm are pushed together on a table so that every pair touches. Sketch the triangle formed by their centres, and work out the length of each side.',
    ],
  },
  {
    id: 'alternate-segment',
    eyebrow: 'Chapter 3.4',
    title: 'Alternate Segment',
    heading: 'The Alternate Segment Theorem',
    intro: "This is one of the most useful circle theorems for solving angle-chasing problems, because it connects an angle OUTSIDE the circle (between a tangent and a chord) to an angle INSIDE it (in the segment on the far side of that chord). Once you can spot a tangent and a chord meeting at the same point, this theorem hands you an equal angle somewhere else in the diagram for free.",
    definition: 'If a straight line touches a circle, and a chord is drawn from the point of contact, then the angle between the tangent and the chord equals the angle in the alternate segment.',
    players: [
      { title: 'Angle Between Tangent and Chord = Angle in the Alternate Segment', caption: "Angle TAB (between the tangent and the chord) always equals angle APB, for any point P on the far arc.", build: build_AlternateSegmentDemo },
    ],
    examples: [
      { tag: 'Worked Example 5', question: 'PQX is a tangent to a circle QRS at Q. If angle RSQ = 55° and angle RQX = 48°, calculate angle SQX.', steps: ['In triangle QRS, the three angles sum to 180°, so angle SQR = 180° − (55° + 48°) = 77°.'], answer: 'By the alternate segment theorem, SQX = SQR = 77°', build: build_Example5Diagram },
      { tag: 'Worked Example 6', question: 'PT is a tangent to circle ABCT at T. BA = BT, and angle ATP = 82°. Calculate angle BCT.', steps: ['By the alternate segment theorem, angle ABT (in the alternate segment) equals angle ATP, so ABT = 82°.', 'Triangle ABT is isosceles since BA = BT, so angle BAT = half of (180° − 82°) = 49°.', 'ABTC is a cyclic quadrilateral, and opposite angles of a cyclic quadrilateral sum to 180°, so angle BCT = 180° − angle BAT.'], answer: 'BCT = 180° − 49° = 131°', build: build_Example6Diagram },
    ],
    practice: [
      'XYZ is a tangent to a circle at Y, and a chord YA is drawn such that angle AYZ = 63°. Name the angle in the alternate segment, and state its size.',
      'A tangent touches a circle at T, and a chord TS is drawn. The angle between the tangent and the chord, on one side, is 72°. What is the angle between the tangent and the chord on the OTHER side of TS? What can you say about the two segments\' opposite angles?',
      'A stonemason is cutting a circular archway and wants to check, using only a straightedge, whether a proposed cut is truly tangent to the curve at a marked point. Explain how measuring a chord angle and comparing it to the angle in the far segment could help.',
    ],
  },
  {
    id: 'example-library',
    eyebrow: 'Reference',
    title: 'Example Library',
    heading: 'Worked Example Library',
    intro: "Every worked example from this chapter, gathered in one place. Use this page to revise the theorems by working through each solution again without the surrounding explanation, or to hunt for the closest match to a problem you're stuck on.",
    isLibrary: true,
    examples: [
      { tag: 'Example 1 · Tangent ⊥ Radius', question: 'TA is a tangent at A to a circle, centre O. AB is a chord. If the angle between the tangent and the chord, BÂT, is x°, show that the angle BÔA is 2x°.', steps: ['Since a tangent is perpendicular to the radius at the point of contact, angle BÂO = (90 − x)°.', 'Triangle AOB is isosceles (OA = OB, both radii), so angle ABO is also (90 − x)°.', 'The angles of triangle AOB sum to 180°, so BÔA = 180° − 2(90 − x)°.'], answer: 'BÔA = 2x°', build: build_Example1Diagram },
      { tag: 'Example 2 · Tangents from a Point', question: 'O is the centre of a circle, and TA and TB are tangents from an external point T. If angle ATO = 39°, calculate angle TBX (X is where the diagonals of TAOB cross).', steps: ['Angle AXT = 90°, from the symmetry of the figure about OT.', 'In triangle TAX, angle TAX = 180° − (90° + 39°) = 51°.', 'By symmetry, angle TBX = angle TAX.'], answer: 'TBX = 51°', build: build_Example2Diagram },
      { tag: 'Example 3 · Tangents from a Point', question: 'X, Y, Z lie on a circle, centre O. Tangents at X and Y meet at T. If angle XTY = 58°, calculate angle XZY (Z on the major arc).', steps: ['In quadrilateral TXOY, angle OXT = angle OYT = 90° (tangent ⊥ radius).', 'Angle XOY = 360° − 90° − 90° − 58° = 122°.', 'Angle at centre = 2 × angle at circumference on the same arc.'], answer: 'XZY = 61° (or 119° on the minor arc)', build: build_Example3Diagram },
      { tag: 'Example 4 · Contact of Circles', question: 'A, B, C are centres of three circles touching each other externally. AB = 13 cm, BC = 14 cm, CA = 11 cm. Find each radius.', steps: ['For external contact, a + b = 13, b + c = 14, c + a = 11.', 'Subtracting: (b + c) − (c + a) = 14 − 11, giving b − a = 3.', 'Adding to a + b = 13: 2b = 16, so b = 8; then a = 5 and c = 6.'], answer: 'Radii: 5 cm, 8 cm, 6 cm', build: build_Example4Diagram },
      { tag: 'Example 5 · Alternate Segment', question: 'PQX is a tangent to circle QRS at Q. Angle RSQ = 55°, angle RQX = 48°. Calculate angle SQX.', steps: ['Angles of triangle QRS sum to 180°, so angle SQR = 180° − (55° + 48°) = 77°.'], answer: 'By the alternate segment theorem, SQX = 77°', build: build_Example5Diagram },
      { tag: 'Example 6 · Alternate Segment', question: 'PT is a tangent to circle ABCT at T, with BA = BT and angle ATP = 82°. Calculate angle BCT.', steps: ['Alternate segment theorem: angle ABT = angle ATP = 82°.', 'Triangle ABT is isosceles (BA = BT), so angle BAT = ½(180° − 82°) = 49°.', 'ABTC is cyclic, so opposite angles sum to 180°: angle BCT = 180° − 49°.'], answer: 'BCT = 131°', build: build_Example6Diagram },
    ],
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
      {typeof section.intro === 'string'
        ? <p className="mb-4 leading-relaxed text-slate-700">{section.intro}</p>
        : section.intro}

      {section.demoBefore && <SecantLimitDemo />}

      {section.theoremBlocks && section.theoremBlocks.length > 0 && (
        <div className="mb-6">
          {section.theoremBlocks.map((tb, i) => (
            <TheoremExplainer key={i} heading={tb.heading} paragraphs={tb.paragraphs} callout={tb.callout} calloutSn={tb.calloutSn} footer={tb.footer} audioSrc={tb.audioSrc} diagramRef={tb.diagramRef} />
          ))}
        </div>
      )}

      {section.theorems && section.theorems.length > 0 && (
        <div className="mb-6 space-y-3">
          {section.theorems.map((t, i) => (
            <DefinitionBox key={i} label={section.theorems.length > 1 ? `Theorem ${i + 1}` : 'Theorem'}>{t}</DefinitionBox>
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

export const CircleGeometry = () => {
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
    <div id="cg-scroll-area" className="min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />
      {/* Duolingo Gradient Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-violet-400/30 text-white border border-violet-200/40`}>CHAPTER 3</span>
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
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Circle Geometry (2): Tangents</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "Tangents, makona avaita, nemirayiridzo miviri yemacircle inokuita nzira pfupi yekutevedzera makona. Dhinda play pane dhiyagiramu yega yega kuona nhanho dzekufunga dzichizarurwa." : "Tangents, the angles they create, and the two circle theorems that turn them into a shortcut for angle-chasing. Press play on any diagram to see the reasoning unfold step by step."}
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
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
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

export default CircleGeometry;
