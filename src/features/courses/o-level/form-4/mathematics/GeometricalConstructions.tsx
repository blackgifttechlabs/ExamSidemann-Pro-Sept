
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
   All angles are in degrees, using the convention: toXY(center,r,angle)
   places a point r away from center at that angle, where 0° points right
   and positive angles turn counter-clockwise on screen (like a normal
   maths unit circle) even though SVG's y-axis points down.
   ========================================================================= */
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const toXY = (c, r, deg) => {
  const t = (deg * Math.PI) / 180;
  return { x: c.x + r * Math.cos(t), y: c.y - r * Math.sin(t) };
};
const angleFromCenter = (center, p) => (Math.atan2(center.y - p.y, p.x - center.x) * 180) / Math.PI;
const normDiff = (a, b) => { let d = ((a - b + 540) % 360) - 180; return d; };
const normalizeDeg = (a) => { let x = a % 360; if (x < 0) x += 360; return x; };
const angleBetween = (a, lo, hi) => { const A = normalizeDeg(a - lo); const D = normalizeDeg(hi - lo); return A <= D; };
const arcContaining = (angA, angB, containAngle) => {
  const d1 = normalizeDeg(angB - angA);
  if (angleBetween(containAngle, angA, angA + d1)) return [angA, angA + d1];
  const d2 = normalizeDeg(angA - angB);
  return [angB, angB + d2];
};
const angleAt = (P, A, B) => {
  const v1 = { x: A.x - P.x, y: A.y - P.y }, v2 = { x: B.x - P.x, y: B.y - P.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const m1 = Math.hypot(v1.x, v1.y), m2 = Math.hypot(v2.x, v2.y);
  return (Math.acos(Math.min(1, Math.max(-1, dot / (m1 * m2)))) * 180) / Math.PI;
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
   Every visual "beat" of a construction is one of these small objects.
   The player walks through them in sequence, animating each one's "draw".
   ========================================================================= */
let uidCounter = 0;
const nextId = () => `a${uidCounter++}`;

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

const mkOrbitCircle = (center, r, a0, a1, narration, opts: any = {}) => ({
  id: nextId(), kind: 'orbit', narration, duration: opts.duration ?? 3000,
  compute: (t) => { const ang = a0 + (a1 - a0) * t; const marker = toXY(center, r, ang); return { marker, guides: [{ from: center, to: marker, color: '#f59e0b' }] }; },
});

const mkOrbitSlide = (p1, p2, guideFn, narration, opts: any = {}) => ({
  id: nextId(), kind: 'orbit', narration, duration: opts.duration ?? 3000,
  compute: (t) => { const pos = { x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t }; return { marker: pos, guides: guideFn(pos) }; },
});

/* =========================================================================
   REUSABLE CONSTRUCTION BUILDERS
   Each returns { actions, ...usefulPoints } so bigger constructions
   (circumcircle, combined loci) can build on top of smaller ones.
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
  const bisLine = mkLine(ext1, ext2, opts.n3 ?? 'Draw a straight line through both crossing points — this is the perpendicular bisector. It cuts AB exactly in half, at a right angle.', { color: '#1e3a8a', width: 2.5 });
  return { actions: [arcA, arcB, mkPoint(P, '', ''), mkPoint(Q, '', ''), bisLine], P, Q, line: [ext1, ext2] };
}

function bisectAngleActions(O, angA, angB, opts: any = {}) {
  const r1 = opts.r1 ?? 90;
  const r2 = opts.r2 ?? r1 * 1.3;
  const X = toXY(O, r1, angA), Y = toXY(O, r1, angB);
  const midAng = (angA + angB) / 2;
  const cands = circleCircleIntersect(X, r2, Y, r2) || [];
  const Z = cands.slice().sort((p, q) => Math.abs(normDiff(angleFromCenter(O, p), midAng)) - Math.abs(normDiff(angleFromCenter(O, q), midAng)))[0];
  const bisectorAngle = angleFromCenter(O, Z);
  const rayEnd = toXY(O, r1 * 1.6, bisectorAngle);
  const arc0 = arcThrough(O, r1, [X, Y], midAng, opts.n1 ?? 'With the compass point on the vertex, draw an arc that crosses both arms of the angle.');
  const dirXZ = angleFromCenter(X, Z), dirYZ = angleFromCenter(Y, Z);
  const arcX = mkArc(X, r2, dirXZ - 22, dirXZ + 22, opts.n2 ?? 'Keeping the same new compass width, place the point on each crossing point and draw two small arcs so they cross each other.');
  const arcY = mkArc(Y, r2, dirYZ - 22, dirYZ + 22, '');
  const lineOZ = mkLine(O, rayEnd, opts.n3 ?? 'Draw a straight line from the vertex through the point where the two small arcs cross — this splits the angle exactly in half.', { color: '#1e3a8a', width: 2.5 });
  return { actions: [arc0, mkPoint(X, '', ''), mkPoint(Y, '', ''), arcX, arcY, mkPoint(Z, '', opts.n4 ?? 'This is where the two small arcs cross.'), lineOZ], bisectorAngle, X, Y, Z, rayEnd };
}

function equilateralActions(A, B, opts: any = {}) {
  const r = dist(A, B);
  const dirAB = angleFromCenter(A, B);
  const cands = circleCircleIntersect(A, r, B, r) || [];
  const sorted = cands.slice().sort((p, q) => p.y - q.y);
  const C = sorted[0], other = sorted[1];
  const arcA = arcThrough(A, r, [C, other], dirAB, opts.n1 ?? 'From A, open the compass to the full length of AB, and draw an arc above the line.');
  const arcB = arcThrough(B, r, [C, other], dirAB + 180, opts.n2 ?? 'Keeping the same width, do the same from B. The two arcs cross at a new point above.');
  return {
    actions: [arcA, arcB, mkPoint(C, opts.labelC ?? 'C', opts.n3 ?? 'This crossing point is the third corner. Every side of this triangle is the same length, so every angle is exactly 60°.'),
      mkLine(A, C, opts.n4 ?? 'Join A to C.', { color: '#1e3a8a' }), mkLine(B, C, '', { color: '#1e3a8a' })],
    C,
  };
}

function copyAngleActions(O, angA, angB, O2, angBase2, opts: any = {}) {
  const r = opts.r ?? 100;
  const X = toXY(O, r, angA), Y = toXY(O, r, angB);
  const targetDir = angBase2 + (angB - angA);
  const X2 = toXY(O2, r, angBase2);
  const d = dist(X, Y);
  const cands = circleCircleIntersect(X2, d, O2, r) || [];
  const Y2 = cands.slice().sort((p, q) => Math.abs(normDiff(angleFromCenter(O2, p), targetDir)) - Math.abs(normDiff(angleFromCenter(O2, q), targetDir)))[0];
  const resultDir = angleFromCenter(O2, Y2);
  const arc1 = arcThrough(O, r, [X, Y], (angA + angB) / 2, opts.n1 ?? 'Draw an arc from the vertex, crossing both arms of the original angle.');
  const arc2 = arcThrough(O2, r, [X2, Y2], angBase2 + (angB - angA) / 2, opts.n2 ?? 'Using the exact same radius, draw a matching arc at the new vertex, crossing the new base line.');
  const dirToY2 = angleFromCenter(X2, Y2);
  const arc3 = mkArc(X2, d, dirToY2 - 18, dirToY2 + 18, opts.n3 ?? 'Open the compass to the width between the two crossing points on the first arc. Mark this same width from the new crossing point.');
  const rayEnd = toXY(O2, r * 1.7, resultDir);
  return {
    actions: [arc1, mkPoint(X, opts.labelX ?? 'X', ''), mkPoint(Y, opts.labelY ?? 'Y', ''), arc2, mkPoint(X2, opts.labelX2 ?? "X'", ''), arc3,
      mkPoint(Y2, opts.labelY2 ?? "Y'", opts.n4 ?? 'This marks exactly where the new arm must cross.'),
      mkLine(O2, rayEnd, opts.n5 ?? 'Draw a ray from the new vertex through this point — the two angles are now exactly equal.', { color: '#1e3a8a' })],
    resultDir, X, Y, X2, Y2,
  };
}

function perpFromPointActions(A, B, P, opts: any = {}) {
  const foot = perpendicularFoot(P, A, B);
  const r = opts.r ?? dist(P, foot) * 1.3;
  const [X, Y] = lineCircleIntersect(A, B, P, r);
  const dirAB = angleFromCenter(A, B);
  const footAngle = angleFromCenter(P, foot);
  const arcP = arcThrough(P, r, [X, Y], footAngle, opts.n1 ?? 'From the point outside the line, draw an arc that crosses the line in two places.');
  const r2 = dist(X, Y) * 0.72 + 22;
  const cands = circleCircleIntersect(X, r2, Y, r2) || [];
  const sideP = Math.sign((B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x));
  const Q = cands.find((c) => Math.sign((B.x - A.x) * (c.y - A.y) - (B.y - A.y) * (c.x - A.x)) !== sideP) || cands[0];
  const dirXQ = angleFromCenter(X, Q), dirYQ = angleFromCenter(Y, Q);
  const arcX = mkArc(X, r2, dirXQ - 22, dirXQ + 22, opts.n2 ?? 'From each of those crossing points, draw an equal arc on the other side of the line.');
  const arcY = mkArc(Y, r2, dirYQ - 22, dirYQ + 22, '');
  const lineExt = { x: P.x + (Q.x - P.x) * 1.08, y: P.y + (Q.y - P.y) * 1.08 };
  const linePQ = mkLine(P, lineExt, opts.n3 ?? 'Draw a straight line from the original point, through where the new arcs cross.', { color: '#1e3a8a' });
  const rightMark = mkRightAngleMark(foot, dirAB, angleFromCenter(foot, P));
  return {
    actions: [arcP, mkPoint(X, '', ''), mkPoint(Y, '', ''), arcX, mkPoint(Q, '', ''), arcY, linePQ,
      mkPoint(foot, 'F', opts.n4 ?? 'Where it meets the line is the foot of the perpendicular — the line makes a right angle with AB here.'), rightMark],
    foot, Q,
  };
}

/* =========================================================================
   ANIMATION ENGINE — the player and the shapes it draws
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
        <linearGradient id="gcCompassSteel" x1="0" x2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="0.45" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="gcCompassPencil" x1="0" x2="1">
          <stop offset="0" stopColor="#9a3412" />
          <stop offset="0.5" stopColor="#f97316" />
          <stop offset="1" stopColor="#7c2d12" />
        </linearGradient>
      </defs>
      <line x1={hinge.x} y1={hinge.y} x2={pin.x} y2={pin.y - 4} stroke="url(#gcCompassSteel)" strokeWidth="9" strokeLinecap="round" />
      <line x1={hinge.x} y1={hinge.y} x2={pencil.x} y2={pencil.y - 3} stroke="url(#gcCompassSteel)" strokeWidth="9" strokeLinecap="round" />
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
      <circle cx={hinge.x} cy={hinge.y} r="12" fill="url(#gcCompassSteel)" stroke="#334155" strokeWidth="1.5" />
      <circle cx={hinge.x} cy={hinge.y} r="4.5" fill="#475569" stroke="#f8fafc" strokeWidth="1.2" />
      <circle cx={hinge.x} cy={hinge.y - 25} r="9" fill="none" stroke="#cbd5e1" strokeWidth="4" />
      <rect x={hinge.x - 4} y={hinge.y - 17} width="8" height="9" rx="3" fill="url(#gcCompassSteel)" stroke="#475569" strokeWidth="1" />
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
    const startAngle = action.a0 ?? -90;
    const endAngle = action.a1 ?? startAngle + 360;
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

const interpolateNarrationTime = (audioSeconds, anchors, total) => {
  if (!anchors?.length) return total;
  if (audioSeconds <= anchors[0][0]) return anchors[0][1];
  for (let index = 1; index < anchors.length; index += 1) {
    const [nextAudio, nextConstruction] = anchors[index];
    const [previousAudio, previousConstruction] = anchors[index - 1];
    if (audioSeconds <= nextAudio) {
      const progress = (audioSeconds - previousAudio) / Math.max(0.001, nextAudio - previousAudio);
      return previousConstruction + (nextConstruction - previousConstruction) * progress;
    }
  }
  return total;
};

const ConstructionPlayer = ({ title, viewBox = '0 0 420 300', actions, caption, narrationAudioRef = null, narrationControlled = false, syncAnchors = null }) => {
  const total = useMemo(() => actions.reduce((s, a) => s + a.duration, 0), [actions]);
  // Show the complete result before playback; Play rewinds the construction.
  const [localTime, setLocalTime] = useState(total);
  const [syncedTime, setSyncedTime] = useState(0);
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
      setLocalTime((t) => {
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

  useEffect(() => {
    if (!narrationControlled || !narrationAudioRef?.current || !syncAnchors?.length) return undefined;
    const audio = narrationAudioRef.current;
    let syncFrame: number | null = null;
    const updateFromAudio = () => {
      setSyncedTime(interpolateNarrationTime(audio.currentTime, syncAnchors, total));
    };
    const animateFromAudio = () => {
      updateFromAudio();
      if (!audio.paused && !audio.ended) syncFrame = requestAnimationFrame(animateFromAudio);
    };
    const startSync = () => {
      if (syncFrame !== null) cancelAnimationFrame(syncFrame);
      syncFrame = requestAnimationFrame(animateFromAudio);
    };
    updateFromAudio();
    if (!audio.paused && !audio.ended) startSync();
    audio.addEventListener('play', startSync);
    audio.addEventListener('pause', updateFromAudio);
    audio.addEventListener('seeked', updateFromAudio);
    audio.addEventListener('timeupdate', updateFromAudio);
    return () => {
      if (syncFrame !== null) cancelAnimationFrame(syncFrame);
      audio.removeEventListener('play', startSync);
      audio.removeEventListener('pause', updateFromAudio);
      audio.removeEventListener('seeked', updateFromAudio);
      audio.removeEventListener('timeupdate', updateFromAudio);
    };
  }, [narrationAudioRef, narrationControlled, syncAnchors, total]);

  const time = narrationControlled ? syncedTime : localTime;

  const withRange = useMemo(() => {
    let acc = 0;
    return actions.map((a) => { const start = acc; acc += a.duration; return { ...a, start, end: acc }; });
  }, [actions]);

  const narrations = withRange.filter((a) => a.narration && time >= a.start);

  const toggle = () => {
    if (time >= total) { setLocalTime(0); setPlaying(true); }
    else setPlaying((p) => !p);
  };
  const restart = () => { setLocalTime(0); setPlaying(true); };
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
              disabled={narrationControlled}
              onChange={(e) => { setPlaying(false); setLocalTime(Number(e.target.value)); }}
              aria-label="Construction timeline"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${timelinePercent}%, #c9c9c9 ${timelinePercent}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-sm font-semibold tabular-nums text-slate-800">
              <span>{formatPlayerTime(time)}</span>
              <span>{formatPlayerTime(total)}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <button disabled={narrationControlled} onClick={toggle} className="shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50" style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {narrationControlled ? 'Synced to narration' : playing ? 'PAUSE' : time >= total ? 'PLAY ▶' : time > 0 ? 'RESUME ▶' : 'PLAY ▶'}
              </button>
              <button disabled={narrationControlled} onClick={restart} className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-50">
                Restart
              </button>
              <label className="ml-auto flex items-center gap-2 text-xs font-bold text-slate-500">
                Speed
                <select
                  value={speed}
                  disabled={narrationControlled}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
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
            {narrations.length === 0 && <li className="text-sm italic text-slate-400">Press play to begin the construction…</li>}
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
   SHARED UI PRIMITIVES (same visual system as Chapter 1)
   ========================================================================= */
const DefinitionBox = ({ children }) => (
  <div className="my-6 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
    <span className="gc-hand block text-center text-sm text-slate-500">Definition</span>
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
        <div className="pt-1 font-medium text-slate-800">{example.question}</div>
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

// --- 2.1 Perpendicular bisector, angle bisector, right angle ---
function build_PerpBisectorDemo() {
  const A = { x: 80, y: 150 }, B = { x: 340, y: 150 };
  const given = [mkLine(A, B, 'Here is the line segment AB that we want to cut exactly in half, at a right angle.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const { actions } = perpBisectorActions(A, B, { r: 200 });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_AngleBisectorDemo() {
  const O = { x: 110, y: 250 };
  const angA = 15, angB = 105, armLen = 230;
  const given = [
    mkLine(O, toXY(O, armLen, angA), 'Here is an angle, made from two straight arms meeting at a vertex, O.', { color: '#334155' }),
    mkLine(O, toXY(O, armLen, angB), '', { color: '#334155' }),
    mkPoint(O, 'O', ''),
  ];
  const { actions } = bisectAngleActions(O, angA, angB, { r1: 90 });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_RightAngleDemo() {
  const P = { x: 210, y: 220 };
  const given = [mkLine({ x: 30, y: 220 }, { x: 390, y: 220 }, 'Here is a straight line, with a point P marked on it.', { color: '#334155' }), mkPoint(P, 'P', '')];
  const { actions, rayEnd } = bisectAngleActions(P, 0, 180, {
    r1: 80,
    n1: 'With the compass on P, mark a point the same distance away on each side, along the line.',
    n3: 'Draw a line from P through the point where the two new arcs cross — this line is exactly perpendicular (90°) to the original line.',
  });
  const mark = mkRightAngleMark(P, 0, angleFromCenter(P, rayEnd));
  return { viewBox: '0 0 420 300', actions: [...given, ...actions, mark] };
}

// --- 2.2 Equilateral triangle / 60°, copying an angle, 45°, 30° ---
function build_EquilateralDemo() {
  const A = { x: 110, y: 240 }, B = { x: 310, y: 240 };
  const given = [mkLine(A, B, 'Here is a base line, AB.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const { actions } = equilateralActions(A, B);
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_CopyAngleDemo() {
  const O = { x: 100, y: 340 }, O2 = { x: 100, y: 120 };
  const given = [
    mkLine(O, toXY(O, 190, 0), 'Here is our original angle, at vertex O.', { color: '#334155' }),
    mkLine(O, toXY(O, 190, 55), '', { color: '#334155' }),
    mkPoint(O, 'O', ''),
    mkLine(O2, toXY(O2, 190, 0), "Here is a brand new baseline, with a new vertex O'. We want to build the exact same angle here, without ever measuring in degrees.", { color: '#334155' }),
    mkPoint(O2, "O'", ''),
  ];
  const { actions } = copyAngleActions(O, 0, 55, O2, 0);
  return { viewBox: '0 0 420 380', actions: [...given, ...actions] };
}

function build_FortyFiveDemo() {
  const P = { x: 210, y: 260 };
  const given = [mkLine({ x: 30, y: 260 }, { x: 390, y: 260 }, 'Start the same way as building a right angle: a point P on a straight line.', { color: '#334155' }), mkPoint(P, 'P', '')];
  const right = bisectAngleActions(P, 0, 180, { r1: 80, n1: 'Mark two equal points either side of P on the line.', n3: 'Draw the perpendicular through P — this gives us a 90° angle to work with.' });
  const mark = mkRightAngleMark(P, 0, angleFromCenter(P, right.rayEnd));
  const half = bisectAngleActions(P, 0, right.bisectorAngle, { r1: 70, n1: 'Now bisect this 90° angle, the same way we bisect any angle.', n3: 'This new line splits the right angle exactly in half — giving us 45°.' });
  return { viewBox: '0 0 420 300', actions: [...given, ...right.actions, mark, ...half.actions] };
}

function build_ThirtyDemo() {
  const A = { x: 100, y: 260 }, B = { x: 300, y: 260 };
  const given = [mkLine(A, B, 'Start by building an equilateral triangle on a base line AB, which gives us a 60° angle at A.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const tri = equilateralActions(A, B, { n3: 'This crossing point is the third corner — angle CAB is exactly 60°.' });
  const angle60 = angleFromCenter(A, tri.C);
  const half = bisectAngleActions(A, 0, angle60, { r1: 70, n1: 'Now bisect this 60° angle, the same way we bisect any angle.', n3: 'This new ray splits the 60° angle exactly in half — giving us 30°.' });
  return { viewBox: '0 0 420 300', actions: [...given, ...tri.actions, ...half.actions] };
}

// --- 2.3 Parallel line & perpendicular from an external point ---
function build_ParallelLineDemo() {
  const A = { x: 20, y: 260 }, B = { x: 400, y: 260 }, P = { x: 260, y: 90 };
  const Q = { x: 150, y: 260 };
  const phi = angleFromCenter(Q, P);
  const given = [mkLine(A, B, 'Here is a straight line, AB, and a point P that is not on it.', { color: '#334155' }), mkPoint(P, 'P', ''),
    mkLine(Q, P, 'Draw any straight line (a transversal) from a point Q on AB, through P, and a little beyond.', { color: '#334155' }), mkPoint(Q, 'Q', '')];
  const { actions } = copyAngleActions(Q, phi, 0, P, phi, {
    n1: 'Draw an arc at Q, crossing both the transversal and the line AB.',
    n2: 'Using the same radius, draw a matching arc at P, crossing the transversal.',
    n3: 'Measure the gap between the two crossing points at Q, and mark that same gap from the crossing point at P.',
    n4: 'This marks exactly where the new line must cross.',
    n5: 'Draw a line through P and this new point — since the two marked angles are equal (corresponding angles), this new line must be parallel to AB.',
  });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_PerpFromPointDemo() {
  const A = { x: 20, y: 250 }, B = { x: 440, y: 250 }, P = { x: 310, y: 90 };
  const given = [mkLine(A, B, 'Here is a straight line, AB, and a point P above it that is not on the line.', { color: '#334155' }), mkPoint(P, 'P', '')];
  const { actions } = perpFromPointActions(A, B, P);
  // The equal arcs cross well below AB, so this construction needs a taller
  // sheet than the other examples to keep the crossing and compass visible.
  return { viewBox: '0 0 460 430', actions: [...given, ...actions] };
}

// --- 2.4 / 2.5 The five common loci ---
function build_L_Circle() {
  const O = { x: 210, y: 150 }, r = 90;
  const circle = mkCircle(O, r, 'Draw a circle centred on the fixed point, using the given distance as the radius. Every point on this circle is exactly that distance from the centre.');
  const orbit = mkOrbitCircle(O, r, 0, 360, 'Watch a point travel all the way around: it always stays exactly the same distance from O. This circle is the whole locus.', { duration: 3400 });
  return { viewBox: '0 0 420 300', actions: [mkPoint(O, 'O', 'Start with the one fixed point, O.'), circle, orbit] };
}

function build_L_Parallel() {
  const A = { x: 40, y: 150 }, B = { x: 380, y: 150 }, d = 60;
  const lineAB = mkLine(A, B, 'Here is the fixed straight line.', { color: '#334155' });
  const top1 = { x: A.x, y: A.y - d }, top2 = { x: B.x, y: B.y - d };
  const bot1 = { x: A.x, y: A.y + d }, bot2 = { x: B.x, y: B.y + d };
  const topLine = mkLine(top1, top2, 'Draw a line parallel to it, at the given fixed distance, above it.', { color: '#1e3a8a' });
  const botLine = mkLine(bot1, bot2, 'Draw another parallel line the same distance below it.', { color: '#1e3a8a' });
  const slide = mkOrbitSlide(top1, top2, (pos) => [{ from: pos, to: { x: pos.x, y: pos.y + d }, color: '#f59e0b' }], 'Slide a point along either new line — it always stays that same fixed distance from the original line. Together, the two lines are the locus.', { duration: 3400 });
  return { viewBox: '0 0 420 260', actions: [lineAB, topLine, botLine, slide] };
}

function build_L_PerpBisector() {
  const A = { x: 90, y: 150 }, B = { x: 330, y: 150 };
  const given = [mkLine(A, B, 'Here are the two fixed points, A and B, joined for reference.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const { actions, line } = perpBisectorActions(A, B, { r: 200 });
  const [ext1, ext2] = line;
  const slide = mkOrbitSlide(ext1, ext2, (pos) => [{ from: pos, to: A, color: '#f59e0b' }, { from: pos, to: B, color: '#f59e0b' }], 'Slide a point up and down this line — its distance to A and its distance to B always stay equal. This line is the locus.', { duration: 3600 });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions, slide] };
}

function build_L_AngleBisector() {
  const O = { x: 120, y: 260 }, angA = 15, angB = 105, armLen = 230;
  const arm1End = toXY(O, armLen, angA), arm2End = toXY(O, armLen, angB);
  const given = [mkLine(O, arm1End, 'Here are two fixed straight lines meeting at O.', { color: '#334155' }), mkLine(O, arm2End, '', { color: '#334155' })];
  const { actions, rayEnd } = bisectAngleActions(O, angA, angB, { r1: 90 });
  const slide = mkOrbitSlide(O, rayEnd, (pos) => {
    const foot1 = perpendicularFoot(pos, O, arm1End);
    const foot2 = perpendicularFoot(pos, O, arm2End);
    return [{ from: pos, to: foot1, color: '#f59e0b' }, { from: pos, to: foot2, color: '#f59e0b' }];
  }, "Slide a point along this bisector — its straight-line distance to each arm always stays equal. This ray is the locus.", { duration: 3600 });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions, slide] };
}

function build_L_AngleArc() {
  const A = { x: 110, y: 240 }, B = { x: 310, y: 240 }, theta = 65;
  const T = toXY(A, 150, theta);
  const given = [mkLine(A, B, 'Here is the fixed segment AB.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', ''),
    mkLine(A, T, `Using a protractor, draw a ray from A making the given angle (${theta}°) with AB.`, { color: '#334155' })];
  const perp = bisectAngleActions(A, theta, theta + 180, { r1: 70, n1: '', n2: '', n3: 'Construct the perpendicular to this new ray, at A.', n4: '' });
  const bis = perpBisectorActions(A, B, { r: 220, n1: 'Now construct the perpendicular bisector of AB, the usual way.', n2: '', n3: '' });
  const O = lineLineIntersect(A, perp.rayEnd, bis.line[0], bis.line[1]);
  const r = dist(O, A);
  const angO_A = angleFromCenter(O, A), angO_B = angleFromCenter(O, B);
  const topSample = toXY(O, r, 90), botSample = toXY(O, r, -90);
  const angTop = angleAt(topSample, A, B), angBot = angleAt(botSample, A, B);
  const containAngle = Math.abs(angTop - theta) < Math.abs(angBot - theta) ? 90 : -90;
  const [a0, a1] = arcContaining(angO_A, angO_B, containAngle);
  const arcPath = mkArc(O, r, a0, a1, `Where these two constructions cross is the centre, O, of a circle. Any point on this arc will always see AB at exactly ${theta}°.`, { color: '#10b981', duration: 1400 });
  const arcSlide = { id: nextId(), kind: 'orbit', narration: 'As this point slides along the arc, the angle it makes looking back at A and B never changes.', duration: 3000,
    compute: (t) => { const ang = a0 + (a1 - a0) * t; const pos = toXY(O, r, ang); return { marker: pos, guides: [{ from: pos, to: A, color: '#f59e0b' }, { from: pos, to: B, color: '#f59e0b' }] }; } };
  return { viewBox: '0 0 420 300', actions: [...given, ...perp.actions, ...bis.actions, arcPath, arcSlide] };
}

// --- 2.6 Combining two loci ---
function build_Combine1() {
  const A = { x: 110, y: 90 }, B = { x: 110, y: 230 }, C = { x: 320, y: 160 }, rC = 140;
  const given = [mkLine(A, B, 'Two fixed points, A and B, joined for reference — and a third fixed point, C.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', '')];
  const bis = perpBisectorActions(A, B, { r: 110 });
  const circle = mkCircle(C, rC, 'Draw a circle centred at C, using the fixed distance (3 cm) as the radius — this is the second locus.');
  const hits = lineCircleIntersect(bis.line[0], bis.line[1], C, rC) || [];
  const sol = hits[0];
  const solMark = sol ? mkPoint(sol, '★', 'This crossing point satisfies BOTH rules at once — it is equidistant from A and B, AND exactly 3 cm from C.', { color: '#f59e0b', duration: 500 }) : null;
  const actions = [...given, ...bis.actions, circle];
  if (solMark) actions.push(solMark);
  return { viewBox: '0 0 420 300', actions };
}

function build_Combine2() {
  const A = { x: 40, y: 230 }, B = { x: 380, y: 230 }, d = 70;
  const C = { x: 140, y: 60 }, D = { x: 320, y: 60 };
  const given = [mkLine(A, B, 'A fixed line, AB — and two fixed points, C and D, elsewhere on the page.', { color: '#334155' }), mkPoint(C, 'C', ''), mkPoint(D, 'D', '')];
  const topLine = mkLine({ x: A.x, y: A.y - d }, { x: B.x, y: B.y - d }, 'Draw a line at the fixed distance above AB — this is our first locus.', { color: '#10b981' });
  const bis = perpBisectorActions(C, D, { r: 140 });
  const hit = lineLineIntersect(bis.line[0], bis.line[1], { x: A.x, y: A.y - d }, { x: B.x, y: B.y - d });
  const solMark = hit ? mkPoint(hit, '★', 'This crossing point is both the correct distance from AB, and equidistant from C and D — it satisfies both loci at once.', { color: '#f59e0b', duration: 500 }) : null;
  const actions = [...given, topLine, ...bis.actions];
  if (solMark) actions.push(solMark);
  return { viewBox: '0 0 420 300', actions };
}

// --- 2.7 Circumcircle ---
function build_Circumcircle() {
  const A = { x: 90, y: 260 }, B = { x: 340, y: 230 }, C = { x: 230, y: 70 };
  const given = [
    mkLine(A, B, 'Here is a triangle, ABC.', { color: '#334155' }), mkLine(B, C, '', { color: '#334155' }), mkLine(C, A, '', { color: '#334155' }),
    mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''),
  ];
  const bis1 = perpBisectorActions(A, B, { r: 190, n3: 'Construct the perpendicular bisector of side AB.' });
  const bis2 = perpBisectorActions(B, C, { r: 190, n3: 'Now construct the perpendicular bisector of side BC.' });
  const O = lineLineIntersect(bis1.line[0], bis1.line[1], bis2.line[0], bis2.line[1]);
  const r = dist(O, A);
  const circle = mkCircle(O, r, 'This crossing point, O, is the circumcentre — it is equally far from all three corners. Draw a circle centred here, and it passes through A, B and C exactly.', { color: '#10b981', duration: 1500 });
  return { viewBox: '0 0 420 300', actions: [...given, ...bis1.actions, ...bis2.actions, mkPoint(O, 'O', ''), circle] };
}


// --- Worked-example diagrams ---
function build_Example1Diagram() {
  const A = { x: 90, y: 150 }, B = { x: 330, y: 150 };
  const given = [mkLine(A, B, 'Suppose we want the perpendicular bisector of AB.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const { actions } = perpBisectorActions(A, B, {
    r: 200,
    n1: 'From A, draw an arc using some chosen compass width.',
    n2: 'From B, keep that SAME width and draw a matching arc — this is the step that must stay consistent.',
    n3: 'Because both arcs used the same width, the crossing points are equally distant from A and from B — so the line through them is a true perpendicular bisector.',
  });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_Example2Diagram() {
  const A = { x: 100, y: 260 }, B = { x: 300, y: 260 };
  const given = [mkLine(A, B, 'Start with a base line AB.', { color: '#334155' }), mkPoint(A, 'A', ''), mkPoint(B, 'B', '')];
  const tri = equilateralActions(A, B, { n3: 'Build an equilateral triangle on AB — this gives a 60° angle at A.' });
  const angle60 = angleFromCenter(A, tri.C);
  const half30 = bisectAngleActions(A, 0, angle60, { r1: 70, n1: 'Bisect this 60° angle...', n3: '...giving exactly 30°.' });
  const half15 = bisectAngleActions(A, 0, half30.bisectorAngle, { r1: 55, n1: 'Now bisect the 30° angle...', n3: '...giving exactly 15°.' });
  return { viewBox: '0 0 420 300', actions: [...given, ...tri.actions, ...half30.actions, ...half15.actions] };
}

function build_Example3Diagram() {
  const A = { x: 20, y: 240 }, B = { x: 380, y: 240 }, P = { x: 260, y: 90 };
  const Q = { x: 150, y: 240 };
  const phi = angleFromCenter(Q, P);
  const given = [mkLine(A, B, 'Line AB, with point P off the line.', { color: '#334155' }), mkPoint(P, 'P', ''),
    mkLine(Q, P, 'A transversal through Q and P.', { color: '#334155' }), mkPoint(Q, 'Q', '')];
  const { actions } = copyAngleActions(Q, phi, 0, P, phi, {
    n1: 'Mark the angle at Q between the transversal and AB.',
    n2: 'Copy that same angle at P, on the same side of the transversal.',
    n3: 'Match the gap exactly.',
    n4: 'This fixes where the new line must cross.',
    n5: 'Since the corresponding angles at Q and P are equal, this new line through P can never meet AB — it is parallel.',
  });
  return { viewBox: '0 0 420 300', actions: [...given, ...actions] };
}

function build_Example4Diagram() {
  const O = { x: 210, y: 150 }, r = 90;
  const circle = mkCircle(O, r, 'Draw a circle of radius 5 m, centred on the light.');
  const orbit = mkOrbitCircle(O, r, 0, 360, 'Every point on this circle is exactly 5 m from the light — this circle IS the locus.', { duration: 3200 });
  return { viewBox: '0 0 420 300', actions: [mkPoint(O, 'Light', 'Start with the fixed point — the security light.'), circle, orbit] };
}

function build_Example5Diagram() {
  const A = { x: 40, y: 220 }, B = { x: 380, y: 220 }, d = 55;
  const C = { x: 130, y: 60 }, D = { x: 300, y: 60 };
  const given = [mkLine(A, B, 'The buried cable runs in a straight line.', { color: '#334155' }),
    mkPoint(C, 'Post 1', ''), mkPoint(D, 'Post 2', '')];
  const topLine = mkLine({ x: A.x, y: A.y - d }, { x: B.x, y: B.y - d }, 'Locus 1: a line 3 m above the cable...', { color: '#10b981' });
  const botLine = mkLine({ x: A.x, y: A.y + d }, { x: B.x, y: B.y + d }, '...and one 3 m below it.', { color: '#10b981' });
  const bis = perpBisectorActions(C, D, { r: 140, n3: 'Locus 2: the perpendicular bisector of the two gate posts — equidistant from both.' });
  const hit = lineLineIntersect(bis.line[0], bis.line[1], { x: A.x, y: A.y - d }, { x: B.x, y: B.y - d });
  const solMark = hit ? mkPoint(hit, '★', 'Where the two loci cross satisfies both rules — a valid spot for the tree.', { color: '#f59e0b', duration: 500 }) : null;
  const actions = [...given, topLine, botLine, ...bis.actions];
  if (solMark) actions.push(solMark);
  return { viewBox: '0 0 420 300', actions };
}

function build_Example6Diagram() {
  const A = { x: 70, y: 230 }, B = { x: 350, y: 230 }, C = { x: 300, y: 100 };
  const given = [
    mkLine(A, B, 'Here is an obtuse-angled triangle, ABC.', { color: '#334155' }), mkLine(B, C, '', { color: '#334155' }), mkLine(C, A, '', { color: '#334155' }),
    mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''),
  ];
  const bis1 = perpBisectorActions(A, B, { r: 190, n3: 'Construct the perpendicular bisector of AB.' });
  const bis2 = perpBisectorActions(B, C, { r: 190, n3: 'Construct the perpendicular bisector of BC.' });
  const O = lineLineIntersect(bis1.line[0], bis1.line[1], bis2.line[0], bis2.line[1]);
  const r = dist(O, A);
  const circle = mkCircle(O, r, 'The two bisectors cross OUTSIDE the triangle this time — that crossing point, O, is still the circumcentre.', { color: '#10b981', duration: 1500 });
  return { viewBox: '0 0 460 320', actions: [...given, ...bis1.actions, ...bis2.actions, mkPoint(O, 'O', ''), circle] };
}

/* =========================================================================
   CHAPTER CONTENT
   ========================================================================= */
const sections = [
  {
    id: 'basics-1',
    eyebrow: 'Chapter 2.1',
    title: 'Bisectors & Right Angles',
    heading: 'Basic Constructions: Bisectors and Right Angles',
    intro: "In this chapter we draw shapes using only two tools: a ruler (for straight lines) and a pair of compasses (for arcs and circles) — no protractor allowed! Every construction below is built from real, exact arcs, so you can trust every crossing point completely. Press play on each one and watch it happen, step by step, with the working written out as it goes.",
    audioSrc: '/sounds/o-level/form-4/mathematics/geometrical-constructions/basics-1/full-lesson.mp3',
    players: [
      {
        title: 'Constructing a Perpendicular Bisector',
        caption: 'This line cuts AB exactly in half, and crosses it at a perfect right angle.',
        build: build_PerpBisectorDemo,
        syncStart: 40.43,
        syncAnchors: [
          [40.43, 0], [59.2, 0], [62.5, 1740],
          [63.5, 1740], [67.0, 2386], [82.7, 2386], [87.8, 3640],
          [89.0, 3640], [92.5, 4286], [94.0, 4286], [99.0, 5540], [100.5, 6380],
          [103.5, 6380], [108.0, 7280],
        ],
      },
      {
        title: 'Bisecting an Angle',
        caption: 'This new ray splits the angle into two exactly equal halves.',
        build: build_AngleBisectorDemo,
        syncStart: 122.04,
        syncAnchors: [
          [122.04, 0], [125.4, 0], [128.3, 2220],
          [129.0, 2220], [130.5, 2866], [131.5, 2866], [134.2, 4120], [135.0, 4960],
          [138.0, 4960], [140.0, 5606], [140.5, 5606], [142.0, 6860],
          [143.2, 6860], [145.0, 7506], [145.5, 7506], [148.2, 8760], [149.0, 9180],
          [151.0, 9180], [155.0, 10080],
        ],
      },
      {
        title: 'Constructing a Right Angle (90°) on a Line',
        caption: 'A right angle is really just a straight angle (180°), bisected in half.',
        build: build_RightAngleDemo,
        syncStart: 185.16,
        syncAnchors: [
          [185.16, 0], [189.6, 0], [193.0, 1320],
          [201.4, 1320], [203.5, 1966], [204.0, 1966], [207.0, 3220], [208.0, 4060],
          [214.1, 4060], [215.5, 4706], [216.0, 4706], [218.2, 5960],
          [219.0, 5960], [220.2, 6606], [220.8, 6606], [224.0, 7860], [224.5, 8280],
          [225.0, 8280], [229.0, 9480],
        ],
      },
    ],
    examples: [
      { question: 'Why must you keep the compass width exactly the same when drawing the two crossing arcs in a bisector construction?', steps: ['If the width changed between arcs, the new crossing point would not be equally distant from both original points (or both arms).', 'Keeping the width the same is what guarantees the construction is accurate.'], answer: 'Because the equal width is what makes the resulting line truly perpendicular / a true bisector.', build: build_Example1Diagram },
    ],
    practice: [
      'Draw a line segment AB, 9 cm long. Construct its perpendicular bisector using only a ruler and compasses, then measure to check both halves are 4.5 cm.',
      'Draw any angle of about 74°. Bisect it using compasses, then use a protractor to check that both new angles are equal.',
      'Construct a right angle onto a line without using a protractor. Check your answer with a protractor afterwards.',
      'A carpenter needs to check that a table leg meets the tabletop at exactly 90°, but has no protractor — only a piece of string and a pencil. Explain how the perpendicular-bisector idea could help.',
    ],
  },
  {
    id: 'basics-2',
    eyebrow: 'Chapter 2.2',
    title: 'Triangles & Special Angles',
    heading: 'Basic Constructions: Triangles, Copying Angles, and Special Angles',
    intro: "Some angles come up so often in geometry that it helps to know how to build them directly with compasses alone — no protractor, no guessing. The trick for 45° and 30° is simple: build a bigger angle you already know how to make (90° or 60°), then bisect it.",
    players: [
      { title: 'Constructing an Equilateral Triangle (and a 60° Angle)', caption: 'Because all three sides are equal, all three angles must also be equal — each one is exactly 60°.', build: build_EquilateralDemo },
      { title: 'Copying an Angle', caption: "The new angle X'O'Y' is an exact copy of the original — without ever measuring in degrees.", build: build_CopyAngleDemo },
      { title: 'Constructing 45° by Bisection', caption: 'A right angle, cut exactly in half.', build: build_FortyFiveDemo },
      { title: 'Constructing 30° by Bisection', caption: 'A 60° angle, cut exactly in half.', build: build_ThirtyDemo },
    ],
    examples: [
      { question: 'You need a 15° angle for a technical drawing, but your protractor is broken. How could you construct one using only compasses?', steps: ['Construct a 60° angle (using the equilateral triangle method).', 'Bisect it to get 30°.', 'Bisect the 30° angle again — bisecting cuts any angle exactly in half.'], answer: 'Bisect 60° down to 30°, then bisect 30° down to 15°.', build: build_Example2Diagram },
    ],
    practice: [
      'Construct an equilateral triangle with sides of 6 cm. Measure each angle with a protractor to check they are all 60°.',
      "Draw a 50° angle on one part of your page. Using only compasses, copy it onto a new line elsewhere on the page.",
      'Construct a 45° angle directly onto your exercise book, using only a ruler and compasses.',
      'Using the idea from the worked example above, construct a 15° angle.',
    ],
  },
  {
    id: 'parallel-perp',
    eyebrow: 'Chapter 2.3',
    title: 'Parallel Lines & Perpendiculars',
    heading: 'Constructing Parallel Lines, and a Perpendicular from an External Point',
    intro: "Sometimes the point you need a perpendicular from is not sitting on the line at all — it's off to one side. And sometimes you need a brand new line that never meets a given one, no matter how far it is extended: a parallel line. Both of these are just clever uses of the constructions you already know.",
    players: [
      { title: 'Constructing a Parallel Line Through a Point', caption: 'Because the two marked (corresponding) angles are equal, the new line can never meet AB — it is parallel.', build: build_ParallelLineDemo },
      { title: 'Constructing a Perpendicular from a Point Outside a Line', caption: 'The line from P meets AB at a perfect right angle, at the foot F.', build: build_PerpFromPointDemo },
    ],
    examples: [
      { question: 'Why does making the two angles at Q and P equal guarantee that the new line through P is parallel to AB?', steps: ['When a transversal crosses two lines and the corresponding angles are equal, the two lines can never meet, however far they are extended.', 'This is the corresponding-angles rule for parallel lines.'], answer: 'Equal corresponding angles is the defining test for two lines being parallel.', build: build_Example3Diagram },
    ],
    practice: [
      'Draw a line AB and mark a point P not on it. Construct a line through P parallel to AB.',
      'On a simple map, a straight road runs east-west. A new borehole is marked at point P, away from the road. Construct the shortest path (a perpendicular) from P to the road.',
      'A stage light must hang from a fixed point on the ceiling so that its beam falls perpendicular to the back wall of the hall. Explain, using construction language, how the electrician could mark this exactly.',
    ],
  },
  {
    id: 'loci',
    eyebrow: 'Chapter 2.4 – 2.5',
    title: 'What Is a Locus?',
    heading: 'What Is a Locus? The Five Common Loci',
    intro: "A locus is simply the path traced out by every possible position of a point that follows one particular rule. The word is Latin for \"place\" — mathematicians use it for the set of ALL the places a point is allowed to be. Some rules give a straight line. Some give a circle. Some give something in between. Below are the five loci you must know for this course — press play on each one to see the shape being built, and then watch a point slide along it to prove the rule really does hold everywhere.",
    definition: '"A locus is the set of all possible positions occupied by a point which varies its position according to some given rule."',
    players: [
      { title: 'Locus 1 — A Fixed Distance from a Fixed Point', caption: 'In three dimensions, this same rule gives a sphere instead of a circle.', build: build_L_Circle },
      { title: 'Locus 2 — A Fixed Distance from a Straight Line', caption: 'In three dimensions, this rule gives a cylindrical surface wrapped around the line.', build: build_L_Parallel },
      { title: 'Locus 3 — Equidistant from Two Fixed Points', caption: 'In three dimensions, this rule gives a flat plane, not just a line.', build: build_L_PerpBisector },
      { title: 'Locus 4 — Equidistant from Two Straight Lines', caption: 'Every angle actually has two bisectors, at right angles to each other — this shows just one.', build: build_L_AngleBisector },
      { title: 'Locus 5 — Points That See AB at a Fixed Angle', caption: 'There is a mirror-image arc below AB too, giving the same angle on the other side.', build: build_L_AngleArc },
    ],
    examples: [
      { question: 'A security light is fixed to a wall and needs to shine on any point exactly 5 m away from it. What shape is the locus of points it can reach?', steps: ['The rule is "a fixed distance from one fixed point".', 'This is our first common locus.'], answer: 'A circle of radius 5 m, centred on the light.', build: build_Example4Diagram },
    ],
    practice: [
      'A goat is tied by a rope 4 m long to a peg in an open field. Describe and sketch the locus of the goat as it grazes, keeping the rope tight.',
      "The tip of a clock's minute hand is 8 cm from the centre of the clock face. Describe the locus of the tip as the clock runs for one full hour.",
      'A door of width 90 cm swings open on its hinge. Describe the locus traced by the door handle.',
      'Two villages are at points A and B. The villagers want to build a single borehole that is the same distance from both villages. Describe the locus of all the possible positions for the borehole.',
      'A wheel of radius 30 cm rolls along a straight, flat road without slipping. Describe the locus of the point at the very centre of the wheel as it rolls.',
      'A goalkeeper wants to stand where the goalposts (7.3 m apart) appear to make an angle of 45° to him. Describe the shape of the locus of all such standing positions.',
    ],
  },
  {
    id: 'combining',
    eyebrow: 'Chapter 2.6',
    title: 'Combining Two Loci',
    heading: 'Construction of Loci: Combining Two Rules',
    intro: "Many real problems give you TWO rules at once, and ask for the position (or positions) that satisfy both together. The method is always the same: construct each locus separately, on the same diagram, and then simply look for where they cross. Every crossing point is a valid answer.",
    players: [
      { title: 'Example 1 — Equidistant from A and B, and a Fixed Distance from C', caption: 'Where the perpendicular bisector meets the circle is the answer.', build: build_Combine1 },
      { title: 'Example 2 — A Fixed Distance from a Line, and Equidistant from Two Points', caption: 'Where the parallel line meets the perpendicular bisector is the answer.', build: build_Combine2 },
    ],
    examples: [
      { question: 'A buried cable runs in a straight line across a field. A farmer wants to plant a tree that is both at least 3 m from the cable, AND the same distance from two gate posts at either end of the field. Describe how to find every possible spot.', steps: ['Draw the locus for "3 m from the cable" — this is a pair of parallel lines, one on each side.', 'Draw the locus for "equidistant from the two gate posts" — this is the perpendicular bisector of the segment joining them.', 'Any point where these two loci cross satisfies both conditions at once.'], answer: 'The tree can go at any crossing point between the parallel-line locus and the perpendicular bisector.', build: build_Example5Diagram },
    ],
    practice: [
      'A treasure is buried equidistant from two rocks, A and B, and exactly 5 m from a well, W. Construct all three fixed points, then find every possible position for the treasure.',
      'A goat is tied to a peg with a 3 m rope, in a field with a straight fence along one edge. The goat must also stay at least 1.5 m from the fence at all times. Construct both loci and shade the region where the goat can actually graze.',
      "Two straight roads cross at a point. A new petrol station must be built the same distance from both roads, and exactly 200 m from the crossing point. Find every valid position.",
    ],
  },
  {
    id: 'circumcircle',
    eyebrow: 'Chapter 2.7',
    title: 'Circumcircle of a Triangle',
    heading: 'The Circumcircle of a Triangle',
    intro: "Here is a beautiful result that comes straight from what you've already learned: if you construct the perpendicular bisector of every side of a triangle, all three bisectors meet at exactly the same single point. That point — called the circumcentre — is equally distant from all three corners of the triangle, so a circle drawn from there passes through all three corners perfectly.",
    definition: 'The perpendicular bisectors of the three sides of any triangle always meet at one point — the circumcentre — which is the centre of the circle passing through all three vertices.',
    players: [
      { title: 'Constructing the Circumcircle', caption: 'You only ever need to construct two of the three perpendicular bisectors — the third would meet at exactly the same point.', build: build_Circumcircle },
    ],
    examples: [
      { question: 'Would the circumcentre of a very "flat", obtuse-angled triangle still be found the same way?', steps: ['Yes — the method (construct two perpendicular bisectors, find where they meet) works for every triangle.', 'For an obtuse triangle, the circumcentre actually ends up OUTSIDE the triangle, rather than inside it.'], answer: "Same method every time — but for an obtuse triangle, the circumcentre lies outside the triangle.", build: build_Example6Diagram },
    ],
    practice: [
      'A new cattle dip tank must be built the same distance from three villages, A, B and C. Construct the triangle ABC, then find the exact spot to build the tank.',
      'Construct a triangle with one angle greater than 90°. Construct its circumcircle, and confirm for yourself that the centre falls outside the triangle.',
      'Construct a right-angled triangle and its circumcircle. What do you notice about where the centre falls, compared to the hypotenuse?',
    ],
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */
const Section = ({ section }) => {
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const [narrationControlled, setNarrationControlled] = useState(false);

  return (
  <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
    <div className="mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{section.eyebrow}</span>
      <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
    </div>

    <div className="mb-6">
      <p className="mb-4 leading-relaxed text-slate-700">{section.intro}</p>
      {section.audioSrc && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-sm">
          <p className="mb-3 text-sm font-bold text-slate-800">Wake Teacher</p>
          <audio
            ref={narrationAudioRef}
            controls
            preload="metadata"
            className="block w-full"
            src={section.audioSrc}
            onPlay={() => setNarrationControlled(true)}
            onEnded={() => setNarrationControlled(false)}
          />
        </div>
      )}
      {section.definition && <DefinitionBox>{section.definition}</DefinitionBox>}

      {section.players.map((p, i) => {
        const built = p.build();
        return (
          <div id={`${section.id}-construction-${i}`} key={i} className="scroll-mt-32">
            <ConstructionPlayer
              title={p.title}
              viewBox={built.viewBox}
              actions={built.actions}
              caption={p.caption}
              narrationAudioRef={narrationAudioRef}
              narrationControlled={narrationControlled}
              syncAnchors={p.syncAnchors}
            />
          </div>
        );
      })}
    </div>

    <div className="mb-8">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Worked Examples</h3>
      {section.examples.map((ex, i) => (
        <ExampleCard key={i} index={i + 1} example={ex} />
      ))}
    </div>

    <PracticeZone items={section.practice} />
  </section>
  );
};

export const GeometricalConstructions = () => {
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
    <div id="gc-scroll-area" className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />
      {/* Duolingo Gradient Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-600 border-b-4 border-amber-700 pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-amber-300/30 text-white border border-amber-200/40`}>CHAPTER 2</span>
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
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Geometrical Constructions</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "Dzidza unyanzvi hwekudhirowa zvakananga uchiburitsa rezha necompasses — kubva pakupatsanura miringa nemakona kusvika pakugadzira polygon dzakakwana." : "Master the art of precise drawing with a ruler and compass — from bisecting lines and angles to constructing regular polygons and accurate scale drawings."}
          </p>
        </div>
      </div>

      {/* Left-aligned pill navigation */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div id="math-topic-rail" data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button key={s.id} data-topic-id={s.id} onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
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

export default GeometricalConstructions;
