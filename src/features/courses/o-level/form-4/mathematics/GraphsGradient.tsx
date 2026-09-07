
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
   (Matches the conventions used across the rest of the geometry series so
   this chapter feels like part of the same set of notes.)
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
   ========================================================================= */
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
// toScreen(origin, scale) converts a maths coordinate (x;y) into a pixel
// point, flipping y so that "up" on the page means "increasing y" as usual.
const toScreen = (origin, scale) => (mx, my) => ({ x: origin.x + mx * scale, y: origin.y - my * scale });

/* =========================================================================
   ACTION CREATORS
   Every visual "beat" of a diagram is one of these small objects. The
   player walks through them in sequence, animating each one's "draw".
   ========================================================================= */
let uidCounter = 0;
const nextId = () => `gr${uidCounter++}`;

const mkLine = (from, to, narration, opts: any = {}) => ({
  id: nextId(), kind: 'line', from, to, length: dist(from, to), narration,
  duration: opts.duration ?? 850, color: opts.color ?? '#1e3a8a', width: opts.width ?? 2.4,
  dashed: opts.dashed ?? false,
});

const mkPoint = (p, label, narration, opts: any = {}) => ({
  id: nextId(), kind: 'point', p, label, narration, duration: opts.duration ?? 420,
  color: opts.color ?? '#0f172a', labelOffset: opts.labelOffset ?? { x: 9, y: -9 },
});

// A "note" is a narration-only beat: nothing new is drawn, but the pencil
// rests at an existing point while a sentence of reasoning appears.
const mkNote = (anchor, narration, opts: any = {}) => ({
  id: nextId(), kind: 'note', p: anchor, narration, duration: opts.duration ?? 900,
});

// A "label" is a small static axis-tick number — it appears instantly
// (no pencil, no draw animation) and is used to number the axes.
const mkLabel = (p, text, opts: any = {}) => ({
  id: nextId(), kind: 'label', p, text, narration: '', duration: opts.duration ?? 60,
  color: opts.color ?? '#94a3b8', fontSize: opts.fontSize ?? 11, anchor: opts.anchor ?? 'middle',
});

/* =========================================================================
   ANIMATION ENGINE — shared player used across every diagram in this chapter
   ========================================================================= */
const clamp01 = (value) => Math.max(0, Math.min(1, value));
const DRAW_START = 0.3;
const drawProgressFor = (action, progress) => {
  if (action.kind === 'point' || action.kind === 'note' || action.kind === 'label') return progress;
  return clamp01((progress - DRAW_START) / (1 - DRAW_START));
};

const ActionShape = ({ action, progress }) => {
  if (action.kind === 'note') return null;
  if (action.kind === 'label') {
    return (
      <text x={action.p.x} y={action.p.y} textAnchor={action.anchor} className="gc-hand" fontSize={action.fontSize} fill={action.color} style={{ opacity: Math.min(1, progress * 4) }}>
        {action.text}
      </text>
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
  const d = `M ${action.from.x} ${action.from.y} L ${action.to.x} ${action.to.y}`;
  if (action.dashed) {
    return <path d={d} fill="none" stroke={action.color} strokeWidth={action.width} strokeDasharray="6 4" style={{ opacity: Math.min(1, progress * 2) }} strokeLinecap="round" />;
  }
  const len = action.length || 1;
  return <path d={d} fill="none" stroke={action.color} strokeWidth={action.width} strokeDasharray={len} strokeDashoffset={len * (1 - progress)} strokeLinecap="round" />;
};

const anchorForAction = (action) => {
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

const DrawingInstrument = ({ action, progress, previousAnchor }) => {
  if (!action || action.kind !== 'line') return null;
  const moveProgress = clamp01(progress / 0.2);
  const drawProgress = drawProgressFor(action, progress);
  const startAnchor = previousAnchor ?? action.from;
  const lift = progress < 0.2 ? Math.sin(moveProgress * Math.PI) * 22 : 0;
  const pin = {
    x: startAnchor.x + (action.from.x - startAnchor.x) * moveProgress,
    y: startAnchor.y + (action.from.y - startAnchor.y) * moveProgress - lift,
  };
  const point = progress < DRAW_START
    ? pin
    : { x: action.from.x + (action.to.x - action.from.x) * drawProgress, y: action.from.y + (action.to.y - action.from.y) * drawProgress };
  const angle = (Math.atan2(action.to.y - action.from.y, action.to.x - action.from.x) * 180) / Math.PI;
  return <PencilInstrument point={point} angle={angle} />;
};

const formatPlayerTime = (milliseconds) => {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const ConstructionPlayer = ({ title, viewBox = '0 0 380 300', actions, caption }) => {
  const total = useMemo(() => actions.reduce((s, a) => s + a.duration, 0), [actions]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const rafRef = useRef(null);
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
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
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
    const padX = width * 0.22;
    const padY = height * 0.22;
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
              aria-label="Diagram timeline"
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
   FIG. 5.1–5.3 — GRADIENT OF A STRAIGHT LINE (interactive slider)
   Drag the slider to change the gradient m of the line through A. The
   dashed legs show "increase in x" (run) and "increase in y" (rise), and
   the panel reports the gradient, tan θ, and whether θ is acute or obtuse.
   ========================================================================= */
const GradientTriangleDemo = () => {
  const A = { x: 60, y: 190 };
  const run = 190;
  const [m, setM] = useState(1);
  const B = { x: A.x + run, y: A.y - run * m };
  const M = { x: B.x, y: A.y };
  const thetaAcute = (Math.atan(Math.abs(m)) * 180) / Math.PI;
  const displayAngle = m >= 0 ? thetaAcute : 180 - thetaAcute;

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Gradient of a Straight Line</div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 320 260" className="h-auto w-full">
            <line x1={10} y1={A.y} x2={310} y2={A.y} stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="2 5" />
            <line x1={A.x} y1={A.y} x2={M.x} y2={M.y} stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="5 4" />
            <line x1={M.x} y1={M.y} x2={B.x} y2={B.y} stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="5 4" />
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#1e3a8a" strokeWidth="2.6" strokeLinecap="round" />
            <circle cx={A.x} cy={A.y} r={4.5} fill="#0f172a" />
            <text x={A.x - 10} y={A.y + 18} className="gc-hand" fontSize="15" fill="#0f172a">A</text>
            <circle cx={B.x} cy={B.y} r={4.5} fill="#f43f5e" />
            <text x={B.x + 8} y={B.y - 6} className="gc-hand" fontSize="15" fill="#f43f5e">B</text>
            <circle cx={M.x} cy={M.y} r={3} fill="#0f172a" />
            <text x={M.x - 4} y={M.y + (m >= 0 ? 18 : -8)} className="gc-hand" fontSize="14" fill="#0f172a">M</text>
            <text x={(A.x + M.x) / 2 - 12} y={A.y + 18} className="gc-hand" fontSize="13" fill="#b45309">increase in x</text>
            <text x={M.x + 8} y={(M.y + B.y) / 2} className="gc-hand" fontSize="13" fill="#b45309">increase in y</text>
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            <input
              type="range" min={-3} max={3} step={0.25} value={m}
              onChange={(e) => setM(Number(e.target.value))}
              aria-label="Change the gradient"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${((m + 3) / 6) * 100}%, #c9c9c9 ${((m + 3) / 6) * 100}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>m = {m.toFixed(2)}</span>
              <span>{m > 0 ? 'positive gradient' : m < 0 ? 'negative gradient' : 'zero gradient'}</span>
            </div>
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Live values</h5>
          <p className="gc-ink text-[1.1rem] leading-snug text-blue-900">
            Gradient of AB = increase in y ⁄ increase in x = {m.toFixed(2)}<br />
            tan θ = {m.toFixed(2)}<br />
            θ (with the positive x-direction) ≈ {displayAngle.toFixed(0)}°
          </p>
          <p className="mt-3 text-xs italic text-slate-500">
            {m >= 0
              ? 'y increases as x increases, AB makes an acute angle with the positive x-direction, and tan θ is positive — everything agrees.'
              : 'y decreases as x increases. Measured from the positive x-direction round to the line, θ is now obtuse, and tan θ is negative — matching the negative gradient.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   EXAMPLE 2 — GRAPHING A LINE FROM ITS EQUATION (interactive)
   Choose one of a few equations of the form ax + by = c, see the table of
   values it generates, and read the gradient straight off the rearranged
   equation y = mx + c.
   ========================================================================= */
const LINE_PRESETS = [
  { label: '4x + 2y = 5', a: 4, b: 2, c: 5 },
  { label: '2x + 3y = 6', a: 2, b: 3, c: 6 },
  { label: '3x − 2y = −4', a: 3, b: -2, c: -4 },
  { label: 'x + y = 3', a: 1, b: 1, c: 3 },
];

const LineGrapherDemo = () => {
  const [idx, setIdx] = useState(0);
  const { label, a, b, c } = LINE_PRESETS[idx];
  const m = -a / b, k = c / b;
  const origin = { x: 90, y: 190 }, scale = 34;
  const S = toScreen(origin, scale);
  const xs = [-2, -1, 0, 1, 2, 3];
  const table = xs.map((x) => ({ x, y: m * x + k }));
  const p1 = S(-2, m * -2 + k), p2 = S(3, m * 3 + k);
  const yIntercept = S(0, k);

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Drawing a Graph from Its Equation</div>
      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        {LINE_PRESETS.map((p, i) => (
          <button key={p.label} onClick={() => setIdx(i)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${i === idx ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 320 260" className="h-auto w-full">
            <line x1={10} y1={origin.y} x2={310} y2={origin.y} stroke="#94a3b8" strokeWidth="1.3" />
            <line x1={origin.x} y1={10} x2={origin.x} y2={250} stroke="#94a3b8" strokeWidth="1.3" />
            {[-2, -1, 1, 2, 3, 4, 5].map((v) => {
              const p = S(v, 0);
              return p.x >= 10 && p.x <= 310 ? <text key={`x${v}`} x={p.x} y={origin.y + 15} textAnchor="middle" className="gc-hand" fontSize="11" fill="#94a3b8">{v}</text> : null;
            })}
            {[-3, -2, -1, 1, 2, 3, 4].map((v) => {
              const p = S(0, v);
              return p.y >= 10 && p.y <= 250 ? <text key={`y${v}`} x={origin.x - 10} y={p.y + 4} textAnchor="end" className="gc-hand" fontSize="11" fill="#94a3b8">{v}</text> : null;
            })}
            <text x={origin.x - 10} y={origin.y + 15} textAnchor="end" className="gc-hand" fontSize="11" fill="#94a3b8">0</text>
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" />
            {table.map((t, i) => {
              const pt = S(t.x, t.y);
              return <circle key={i} cx={pt.x} cy={pt.y} r={3.4} fill="#f43f5e" />;
            })}
            <circle cx={yIntercept.x} cy={yIntercept.y} r={4} fill="#0f172a" />
            <text x={yIntercept.x + 8} y={yIntercept.y - 6} className="gc-hand" fontSize="13" fill="#0f172a">
              (0, {k % 1 === 0 ? k : k.toFixed(2)})
            </text>
          </svg>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Table of values</h5>
          <div className="mb-3 overflow-x-auto">
            <table className="w-full border-collapse text-center text-xs">
              <thead><tr className="text-slate-500">{table.map((t) => <th key={t.x} className="border border-slate-300 bg-slate-100 px-2 py-1.5 font-semibold">{t.x}</th>)}</tr></thead>
              <tbody><tr className="gc-ink text-blue-900">{table.map((t) => <td key={t.x} className="border border-slate-300 px-2 py-1.5">{t.y.toFixed(2)}</td>)}</tr></tbody>
            </table>
          </div>
          <p className="gc-ink text-[1.05rem] leading-snug text-blue-900">
            {label} rearranges to<br />
            y = {m.toFixed(2)}x + {k.toFixed(2)}<br />
            so the gradient is {m.toFixed(2)}.
          </p>
          <p className="mt-3 text-xs italic text-slate-500">Once an equation is in the form y = mx + c, the coefficient of x is always the gradient — no measuring required.</p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   EXAMPLES 3 & 4 — SKETCHING FROM INTERCEPTS (interactive)
   Also covers the special zero-gradient and undefined-gradient lines.
   ========================================================================= */
const INTERCEPT_PRESETS = [
  { label: '2x + 4y = 9', kind: 'oblique', a: 2, b: 4, c: 9 },
  { label: '4x − 3y = 12', kind: 'oblique', a: 4, b: -3, c: 12 },
  { label: 'y = 5', kind: 'horizontal', value: 5 },
  { label: 'x = −4', kind: 'vertical', value: -4 },
];

const InterceptSketchDemo = () => {
  const [idx, setIdx] = useState(0);
  const preset = INTERCEPT_PRESETS[idx];
  const origin = { x: 150, y: 150 }, scale = 26;
  const S = toScreen(origin, scale);
  let content;
  if (preset.kind === 'oblique') {
    const { a, b, c } = preset;
    const xInt = c / a, yInt = c / b;
    const p1 = S(xInt, 0), p2 = S(0, yInt);
    content = (
      <>
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx={p1.x} cy={p1.y} r={4} fill="#f43f5e" />
        <text x={p1.x + 6} y={p1.y - 8} className="gc-hand" fontSize="13" fill="#f43f5e">({xInt.toFixed(2)}, 0)</text>
        <circle cx={p2.x} cy={p2.y} r={4} fill="#f43f5e" />
        <text x={p2.x + 6} y={p2.y - 8} className="gc-hand" fontSize="13" fill="#f43f5e">(0, {yInt.toFixed(2)})</text>
      </>
    );
  } else if (preset.kind === 'horizontal') {
    const p = S(0, preset.value);
    content = (
      <>
        <line x1={20} y1={p.y} x2={280} y2={p.y} stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" />
        <text x={230} y={p.y - 8} className="gc-hand" fontSize="13" fill="#1e3a8a">y = {preset.value}</text>
      </>
    );
  } else {
    const p = S(preset.value, 0);
    content = (
      <>
        <line x1={p.x} y1={20} x2={p.x} y2={280} stroke="#1e3a8a" strokeWidth="2.4" strokeLinecap="round" />
        <text x={p.x + 8} y={40} className="gc-hand" fontSize="13" fill="#1e3a8a">x = {preset.value}</text>
      </>
    );
  }
  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Sketching Straight Lines</div>
      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        {INTERCEPT_PRESETS.map((p, i) => (
          <button key={p.label} onClick={() => setIdx(i)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${i === idx ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 300 300" className="h-auto w-full">
            <line x1={10} y1={origin.y} x2={290} y2={origin.y} stroke="#94a3b8" strokeWidth="1.3" />
            <line x1={origin.x} y1={10} x2={origin.x} y2={290} stroke="#94a3b8" strokeWidth="1.3" />
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((v) => {
              const p = S(v, 0);
              return p.x >= 10 && p.x <= 290 ? <text key={`x${v}`} x={p.x} y={origin.y + 15} textAnchor="middle" className="gc-hand" fontSize="11" fill="#94a3b8">{v}</text> : null;
            })}
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((v) => {
              const p = S(0, v);
              return p.y >= 10 && p.y <= 290 ? <text key={`y${v}`} x={origin.x - 10} y={p.y + 4} textAnchor="end" className="gc-hand" fontSize="11" fill="#94a3b8">{v}</text> : null;
            })}
            <text x={origin.x - 10} y={origin.y + 15} textAnchor="end" className="gc-hand" fontSize="11" fill="#94a3b8">0</text>
            {content}
          </svg>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">What to notice</h5>
          <p className="text-sm leading-relaxed text-slate-600">
            {preset.kind === 'oblique' && 'The fastest way to sketch an oblique line is to find where it crosses each axis, then join those two points with a ruler.'}
            {preset.kind === 'horizontal' && 'Every point on this line has the same y-value. There is no increase in y at all, however far you move — so the gradient is zero.'}
            {preset.kind === 'vertical' && 'Every point on this line has the same x-value. The increase in x is always zero, so gradient = (increase in y) ÷ 0 is undefined.'}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   EXAMPLES 7 & 8 — GRADIENT OF A CURVE (interactive tangent)
   Slide the point along the curve; the tangent line and its gradient
   (computed from the true derivative) update live.
   ========================================================================= */
const CURVE_PRESETS = [
  { label: 'y = ¼x²', f: (x) => 0.25 * x * x, fp: (x) => 0.5 * x, xMin: -4, xMax: 4 },
  { label: 'y = 2 + x − x²', f: (x) => 2 + x - x * x, fp: (x) => 1 - 2 * x, xMin: -2.2, xMax: 3.2 },
];

const TangentCurveDemo = () => {
  const [curveIdx, setCurveIdx] = useState(0);
  const preset = CURVE_PRESETS[curveIdx];
  const [x0, setX0] = useState(1);
  const origin = { x: 150, y: 190 }, scale = 34;
  const S = toScreen(origin, scale);
  const samples = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const x = preset.xMin + ((preset.xMax - preset.xMin) * i) / 60;
      pts.push(S(x, preset.f(x)));
    }
    return pts;
  }, [preset]);
  const pathD = samples.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const y0 = preset.f(x0), grad = preset.fp(x0);
  const P = S(x0, y0);
  const tanA = S(x0 - 1.4, y0 - grad * 1.4), tanB = S(x0 + 1.4, y0 + grad * 1.4);

  return (
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Gradient of a Curve</div>
      <div className="flex flex-wrap gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
        {CURVE_PRESETS.map((p, i) => (
          <button key={p.label} onClick={() => { setCurveIdx(i); setX0(0); }} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${i === curveIdx ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white text-slate-600'}`}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
          <svg viewBox="0 0 300 300" className="h-auto w-full">
            <line x1={10} y1={origin.y} x2={290} y2={origin.y} stroke="#94a3b8" strokeWidth="1.2" />
            <line x1={origin.x} y1={10} x2={origin.x} y2={290} stroke="#94a3b8" strokeWidth="1.2" />
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => {
              const p = S(v, 0);
              return p.x >= 10 && p.x <= 290 ? <text key={`x${v}`} x={p.x} y={origin.y + 15} textAnchor="middle" className="gc-hand" fontSize="11" fill="#94a3b8">{v}</text> : null;
            })}
            {[-4, -3, -2, -1, 1, 2, 3, 4].map((v) => {
              const p = S(0, v);
              return p.y >= 10 && p.y <= 290 ? <text key={`y${v}`} x={origin.x - 10} y={p.y + 4} textAnchor="end" className="gc-hand" fontSize="11" fill="#94a3b8">{v}</text> : null;
            })}
            <text x={origin.x - 10} y={origin.y + 15} textAnchor="end" className="gc-hand" fontSize="11" fill="#94a3b8">0</text>
            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.2" />
            <line x1={tanA.x} y1={tanA.y} x2={tanB.x} y2={tanB.y} stroke="#f43f5e" strokeWidth="2" strokeDasharray="6 4" />
            <circle cx={P.x} cy={P.y} r={5} fill="#1e3a8a" />
          </svg>
          <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
            <input
              type="range" min={preset.xMin} max={preset.xMax} step={0.1} value={x0}
              onChange={(e) => setX0(Number(e.target.value))}
              aria-label="Slide the point along the curve"
              className="gc-timeline block w-full cursor-pointer"
              style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${((x0 - preset.xMin) / (preset.xMax - preset.xMin)) * 100}%, #c9c9c9 ${((x0 - preset.xMin) / (preset.xMax - preset.xMin)) * 100}%, #c9c9c9 100%)` }}
            />
            <div className="mt-2 text-xs font-semibold text-slate-500">x = {x0.toFixed(2)}</div>
          </div>
        </div>
        <div className="min-w-0 p-4">
          <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Live values</h5>
          <p className="gc-ink text-[1.1rem] leading-snug text-blue-900">
            Point: ({x0.toFixed(2)}, {y0.toFixed(2)})<br />
            Gradient of the curve here = gradient of the tangent<br />
            = {grad.toFixed(2)}
          </p>
          <p className="mt-3 text-xs italic text-slate-500">
            {Math.abs(grad) < 0.05
              ? 'The tangent is (almost) horizontal — this is a turning point, where the gradient of the curve is zero.'
              : 'The gradient of a curve at a point is defined as the gradient of the tangent drawn at that point — a ruler laid so the "angles" on either side of the curve look equal.'}
          </p>
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
          <span className="whitespace-pre-line text-slate-200">{q}</span>
        </div>
      ))}
    </div>
  </div>
);

// A small static pair of icons recreating Fig. 5.17 — the tangent at a
// turning point is always horizontal, so the gradient there is zero.
const TurningPointIcons = () => (
  <div className="mb-6 grid grid-cols-2 gap-4">
    {[{ min: true }, { min: false }].map((cfg, i) => (
      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
        <svg viewBox="0 0 160 110" className="mx-auto h-24 w-full">
          <line x1={10} y1={55} x2={150} y2={55} stroke="#cbd5e1" strokeWidth="1.2" strokeDasharray="4 4" />
          {cfg.min ? (
            <path d="M 20 90 Q 80 10 140 90" fill="none" stroke="#1e3a8a" strokeWidth="2.4" />
          ) : (
            <path d="M 20 20 Q 80 100 140 20" fill="none" stroke="#1e3a8a" strokeWidth="2.4" />
          )}
          <circle cx={80} cy={cfg.min ? 32 : 78} r={4} fill="#f43f5e" />
        </svg>
        <p className="gc-hand mt-1 text-sm text-slate-600">{cfg.min ? 'Minimum — gradient zero' : 'Maximum — gradient zero'}</p>
      </div>
    ))}
  </div>
);

/* =========================================================================
   DIAGRAM BUILDERS FOR THE WORKED EXAMPLES
   (Recreated as original SVG constructions rather than reproducing the
   scanned textbook figures.)
   ========================================================================= */
function build_Example1Diagram() {
  const S = toScreen({ x: 150, y: 230 }, 38);
  const A = S(-1, 2), B = S(3, -2), C = S(0, -1), D = S(4, 1);
  const M = S(3, 2), N = S(4, -1);
  const axes = [
    mkLine(S(-2, 0), S(4, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -3), S(0, 3), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    ...[-2, -1, 1, 2, 3, 4].map((v) => mkLabel({ x: S(v, 0).x, y: S(v, 0).y + 15 }, String(v))),
    ...[-3, -2, -1, 1, 2, 3].map((v) => mkLabel({ x: S(0, v).x - 12, y: S(0, v).y + 4 }, String(v))),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(A, 'A', 'Plot A(−1, 2) and B(3, −2), then draw the line AB.'),
    mkPoint(B, 'B', ''),
    mkLine(A, B, '', { color: '#1e3a8a' }),
    mkLine(A, M, 'From A, the increase in x needed to reach B\'s level is AM = 4.', { color: '#f59e0b', dashed: true }),
    mkLine(M, B, 'The corresponding increase in y is MB = −4 (B sits lower than A).', { color: '#f59e0b', dashed: true }),
    mkNote(A, 'Gradient of AB = increase in y ÷ increase in x = −4 ÷ 4 = −1.'),
    mkPoint(C, 'C', 'Now plot C(0, −1) and D(4, 1), and draw the line CD.'),
    mkPoint(D, 'D', ''),
    mkLine(C, D, '', { color: '#be185d' }),
    mkLine(C, N, 'The increase in x from C to D is CN = 4.', { color: '#f59e0b', dashed: true }),
    mkLine(N, D, 'The increase in y is ND = 2.', { color: '#f59e0b', dashed: true }),
    mkNote(D, 'Gradient of CD = 2 ÷ 4 = ½.'),
  ];
  return { viewBox: '0 0 400 300', actions, caption: 'AB slopes down (gradient −1); CD slopes up (gradient ½) — the sign of the gradient always matches the direction of the slope.' };
}

function build_Example2Diagram() {
  const S = toScreen({ x: 70, y: 210 }, 70);
  const P0 = S(0, 2.5), P1 = S(1, 0.5), P2 = S(2, -1.5), corner = S(2, 2.5);
  const axes = [
    mkLine(S(-1, 0), S(3, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -2), S(0, 3), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    ...[-1, 1, 2, 3].map((v) => mkLabel({ x: S(v, 0).x, y: S(v, 0).y + 15 }, String(v))),
    ...[-2, -1, 1, 2, 3].map((v) => mkLabel({ x: S(0, v).x - 12, y: S(0, v).y + 4 }, String(v))),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(P0, '', 'First make a table of values: when x = 0, y = 2½.'),
    mkPoint(P1, '', 'When x = 1, y = ½.'),
    mkPoint(P2, '', 'When x = 2, y = −1½.'),
    mkLine(P0, P2, 'Plot the points and draw the straight line through them.', { color: '#1e3a8a' }),
    mkLine(P0, corner, 'To measure the gradient, take the increase in x between two convenient points — here, 2.', { color: '#f59e0b', dashed: true }),
    mkLine(corner, P2, 'The corresponding increase in y is −4.', { color: '#f59e0b', dashed: true }),
    mkNote(P2, 'Gradient = −4 ÷ 2 = −2 — matching the rearranged equation y = −2x + 2½.'),
  ];
  return { viewBox: '0 0 320 260', actions, caption: 'Rearranging 4x + 2y = 5 gives y = −2x + 2½, so the gradient −2 could have been read straight off the equation.' };
}

function build_Example3Diagram() {
  const S = toScreen({ x: 80, y: 200 }, 60);
  const yInt = S(0, 2.25), other = S(4, 0.25);
  const axes = [
    mkLine(S(-1, 0), S(5, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -1), S(0, 3), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    ...[-1, 1, 2, 3, 4, 5].map((v) => mkLabel({ x: S(v, 0).x, y: S(v, 0).y + 15 }, String(v))),
    ...[-1, 1, 2, 3].map((v) => mkLabel({ x: S(0, v).x - 12, y: S(0, v).y + 4 }, String(v))),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkNote(yInt, 'Rearrange to make y the subject: 4y = −2x + 9, so y = −½x + 2¼.'),
    mkPoint(yInt, '(0, 2¼)', 'Plot the y-intercept, (0, 2¼) — the simplest point to find.'),
    mkLine(yInt, other, 'Using the gradient −½, step 4 across and 2 down to a second point, then draw the line through both.', { color: '#1e3a8a' }),
  ];
  return { viewBox: '0 0 360 260', actions, caption: 'A rough sketch only needs one point and the gradient — no table of values required.' };
}

function build_Example4Diagram() {
  const S = toScreen({ x: 70, y: 150 }, 55);
  const yInt = S(0, -4), xInt = S(3, 0);
  const axes = [
    mkLine(S(-2, 0), S(5, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -6), S(0, 2), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    ...[-2, -1, 1, 2, 3, 4, 5].map((v) => mkLabel({ x: S(v, 0).x, y: S(v, 0).y + 15 }, String(v))),
    ...[-6, -5, -4, -3, -2, -1, 1, 2].map((v) => mkLabel({ x: S(0, v).x - 12, y: S(0, v).y + 4 }, String(v))),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(yInt, '(0, −4)', 'When x = 0, −3y = 12, so y = −4 — that\'s the y-intercept.'),
    mkPoint(xInt, '(3, 0)', 'When y = 0, 4x = 12, so x = 3 — the x-intercept.'),
    mkLine(yInt, xInt, 'Join the two intercepts with a ruler to sketch the line.', { color: '#1e3a8a' }),
  ];
  return { viewBox: '0 0 380 260', actions, caption: 'Finding both axis intercepts is often the fastest way to sketch a line, especially when the gradient is awkward.' };
}

function build_Example5Diagram() {
  const S = toScreen({ x: 70, y: 70 }, 12);
  const B = S(3, -8), A = S(5, 2);
  const axes = [
    mkLine(S(-1, 0), S(6, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -10), S(0, 4), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    ...[-1, 1, 2, 3, 4, 5, 6].map((v) => mkLabel({ x: S(v, 0).x, y: S(v, 0).y + 15 }, String(v))),
    ...[-10, -8, -6, -4, -2, 2, 4].map((v) => mkLabel({ x: S(0, v).x - 14, y: S(0, v).y + 4 }, String(v))),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(B, 'B(3, −8)', 'Plot the given point B(3, −8).'),
    mkPoint(A, 'A(x, y)', 'Let A(x, y) be any general point on the line.'),
    mkLine(B, A, 'Draw the line through B with gradient 5 — for every 1 step across, go 5 up.', { color: '#1e3a8a' }),
    mkNote(A, 'Gradient of AB = (y − (−8)) ÷ (x − 3) = 5, so y + 8 = 5(x − 3), giving y = 5x − 23.'),
  ];
  return { viewBox: '0 0 380 300', actions, caption: 'The equation of a line through (a, b) with gradient m is (y − b) ÷ (x − a) = m.' };
}

function build_Example6Diagram() {
  const S = toScreen({ x: 150, y: 170 }, 20);
  const Q = S(-1, 7), R = S(3, -2);
  const axes = [
    mkLine(S(-2, 0), S(5, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -3), S(0, 8), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    ...[-2, -1, 1, 2, 3, 4, 5].map((v) => mkLabel({ x: S(v, 0).x, y: S(v, 0).y + 15 }, String(v))),
    ...[-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => mkLabel({ x: S(0, v).x - 12, y: S(0, v).y + 4 }, String(v))),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(Q, 'Q(−1, 7)', 'Plot Q(−1, 7) and R(3, −2), and draw the line QR.'),
    mkPoint(R, 'R(3, −2)', ''),
    mkLine(Q, R, '', { color: '#1e3a8a' }),
    mkNote(R, 'Gradient of QR = (7 − (−2)) ÷ (−1 − 3) = 9 ÷ (−4) = −2¼.'),
    mkNote(Q, 'Taking P(x, y) as a general point on the line: gradient of PR = (y − (−2)) ÷ (x − 3) = −2¼, giving y = −2¼x + 4¾.'),
  ];
  return { viewBox: '0 0 380 260', actions, caption: 'Any two points on a line fix both its gradient and, from there, its full equation.' };
}

/* =========================================================================
   WORKED EXAMPLE DATA
   ========================================================================= */
const example1 = {
  tag: 'Worked Example 1', question: 'Find the gradients of the lines joining (a) A(−1; 2) and B(3; −2), (b) C(0; −1) and D(4; 1).',
  steps: [
    'Gradient = (difference in y-coordinates) ÷ (difference in x-coordinates).',
    '(a) Gradient of AB = (−2 − 2) ÷ (3 − (−1)) = −4 ÷ 4 = −1.',
    '(b) Gradient of CD = (1 − (−1)) ÷ (4 − 0) = 2 ÷ 4 = ½.',
  ],
  answer: '(a) −1   (b) ½', build: build_Example1Diagram,
};
const example2 = {
  tag: 'Worked Example 2', question: 'Draw a graph of the line represented by 4x + 2y = 5, and find its gradient by taking measurements.',
  steps: [
    'Make a table of values: when x = 0, y = 2½; when x = 1, y = ½; when x = 2, y = −1½.',
    'Plot these points and draw the straight line through them.',
    'Choose two convenient points on the drawn line, e.g. (0, 2½) and (2, −1½).',
    'Gradient = increase in y ÷ increase in x = −4 ÷ 2 = −2.',
  ],
  answer: 'Gradient = −2', build: build_Example2Diagram,
};
const example3 = {
  tag: 'Worked Example 3', question: 'Make a rough sketch of the line whose equation is 2x + 4y = 9.',
  steps: [
    'Rearrange to make y the subject: 4y = −2x + 9, so y = −½x + 2¼.',
    'Find a point on the line — the simplest is where x = 0: when x = 0, y = 2¼.',
    'Plot (0, 2¼), then use the gradient −½ to step to a second point and draw the line.',
  ],
  answer: 'y = −½x + 2¼, sketch through (0, 2¼) with gradient −½', build: build_Example3Diagram,
};
const example4 = {
  tag: 'Worked Example 4', question: 'Sketch the graph of the line whose equation is 4x − 3y = 12.',
  steps: [
    'When x = 0: −3y = 12, so y = −4. The line crosses the y-axis at (0, −4).',
    'When y = 0: 4x = 12, so x = 3. The line crosses the x-axis at (3, 0).',
    'Join the two intercepts with a ruler to complete the sketch.',
  ],
  answer: 'Crosses the axes at (0, −4) and (3, 0)', build: build_Example4Diagram,
};
const example5 = {
  tag: 'Worked Example 5', question: 'A straight line of gradient 5 passes through the point B(3; −8). Find the equation of the line.',
  steps: [
    'Let A(x, y) be any general point on the line.',
    'Gradient of AB = (y − (−8)) ÷ (x − 3) = (y + 8) ⁄ (x − 3).',
    'Since the gradient of AB is 5, (y + 8) ⁄ (x − 3) = 5.',
    'y + 8 = 5(x − 3) = 5x − 15, so y = 5x − 23.',
  ],
  answer: 'y = 5x − 23', build: build_Example5Diagram,
};
const example6 = {
  tag: 'Worked Example 6', question: 'Find the equation of the straight line which passes through the points Q(−1; 7) and R(3; −2).',
  steps: [
    'Gradient of QR = (7 − (−2)) ⁄ (−1 − 3) = 9 ⁄ (−4) = −2¼.',
    'Let P(x, y) be any general point on the line. Gradient of PR = (y − (−2)) ⁄ (x − 3) = (y + 2) ⁄ (x − 3).',
    'Since PQR is a straight line, gradient of PR = gradient of QR: (y + 2) ⁄ (x − 3) = −2¼.',
    'y + 2 = −2¼(x − 3) = −2¼x + 6¾, so y = −2¼x + 4¾.',
  ],
  answer: 'y = −2¼x + 4¾', build: build_Example6Diagram,
};
const example7 = {
  tag: 'Worked Example 7', question: 'Fig. 5.15 shows the curve y = 2 + x − x² for x from −2 to 3. Using the tangents drawn at P and Q, find the gradient of the curve at (a) P, (b) Q.',
  steps: [
    'The gradient of a curve at a point is defined as the gradient of the tangent to the curve at that point.',
    'At P, using the right-angled triangle TOP formed by the tangent: gradient = OP ÷ TO = 2 ÷ 2 = 1.',
    'At Q, using triangle QMR formed the same way: gradient = −MR ÷ QM = −3 ÷ 1 = −3.',
    'Use the interactive tangent demo above (choose "y = 2 + x − x²") to see this tangent-drawing idea in action at any point on the curve.',
  ],
  answer: '(a) 1   (b) −3',
};
const example8 = {
  tag: 'Worked Example 8', question: 'Draw the graph of y = ¼x² for x from −2 to 3. Find the gradient of the curve at the point where x has the value (a) 3, (b) −2.',
  steps: [
    'Draw tangents to the curve at the points where x = 3 and x = −2.',
    '(a) At x = 3: gradient = MP ÷ TM = 2.25 ÷ 1.5 = 1½.',
    '(b) At x = −2: gradient = −QN ÷ NR = −1 ÷ 1 = −1.',
    'Use the interactive tangent demo above (choose "y = ¼x²") and drag to x = 3 and x = −2 to check both values live.',
  ],
  answer: '(a) 1½   (b) −1',
};

/* =========================================================================
   CHAPTER CONTENT
   ========================================================================= */
const sections = [
  {
    id: 'gradient-basics',
    eyebrow: 'Chapter 5.1',
    title: 'Gradient of a Line',
    heading: 'Gradient of a Straight Line',
    intro: "In Fig. 5.1, HG is a horizontal line and HK makes an angle θ with HG. Triangles ABC, PQR, UVW along the slope are all similar, so the ratio BC ⁄ AB is the same wherever it is measured along the line — this constant ratio is called the gradient. It also equals tan θ, since BC ⁄ AB is exactly the tangent ratio in each right-angled triangle. Drag the slider below to see the gradient triangle stretch and flip as the line's steepness and direction change.",
    customDemo: GradientTriangleDemo,
    theorems: [
      'Gradient of a line = (increase in y) ⁄ (increase in x), measured between any two points on it.',
      'Gradient = tan θ, where θ is the angle the line makes with the positive direction of the x-axis.',
      'Gradient of the line through (x₁; y₁) and (x₂; y₂) = (y₂ − y₁) ⁄ (x₂ − x₁).',
    ],
    examples: [example1],
    practice: [
      'Find the gradients of the lines joining: (a) (9;7), (2;5)   (b) (2;5), (4;8)',
      '(a) (5;3), (0;0)   (b) (6;1), (1;5)',
      '(a) (0;4), (3;0)   (b) (−3;2), (4;4)',
      '(a) (2;3), (6;−5)   (b) (−4;3), (8;−6)',
      '(a) (−4;−4), (−1;5)   (b) (7;−2), (−1;2)',
    ],
  },
  {
    id: 'graphing-equations',
    eyebrow: 'Chapter 5.1',
    title: 'Graphing Equations',
    heading: 'Drawing a Graph from an Equation',
    intro: "To draw the line represented by an equation like 4x + 2y = 5, first build a table of values (choose a few x-values and calculate the matching y), plot the points, and draw the straight line through them. The gradient can then be read off by taking measurements from the finished graph — or, as the next section shows, straight from the equation itself. Try each preset equation below and watch the table and line update together.",
    customDemo: LineGrapherDemo,
    examples: [example2],
    practice: [
      'Draw the graph of y = 3x + 1 and find its gradient by taking measurements.',
      'Draw the graph of y = 3x − 2 and find its gradient by taking measurements.',
      'Draw the graph of y = −2x + 3 and find its gradient by taking measurements.',
      'Draw the graph of 4x − 2y + 1 = 0 and find its gradient by taking measurements.',
      'Draw the graph of 2x + 3y = 0 and find its gradient by taking measurements.',
      'Draw the graph of 5x − 2y = 5 and find its gradient by taking measurements.',
    ],
  },
  {
    id: 'sketching-lines',
    eyebrow: 'Chapter 5.1',
    title: 'Sketching Lines',
    heading: 'Sketching Graphs of Straight Lines',
    intro: "Once an equation is rearranged into the form y = mx + c, the coefficient of x, m, gives the gradient directly, and c is the y-intercept — no measuring needed. Two quick sketching methods follow from this: use the gradient and one point (fastest when the y-intercept is easy to find), or find both axis intercepts and join them (fastest for equations like ax + by = c). A line parallel to the x-axis (y = constant) has zero gradient; a line parallel to the y-axis (x = constant) has an undefined gradient, since the increase in x is always zero. Try each case below.",
    customDemo: InterceptSketchDemo,
    theorems: [
      'If y = mx + c, the gradient of the line is m and it crosses the y-axis at (0, c).',
      'A line parallel to the x-axis has the form y = c and has zero gradient.',
      'A line parallel to the y-axis has the form x = a and has an undefined (infinite) gradient.',
    ],
    examples: [example3, example4],
    practice: [
      'Sketch the lines through the given points with the given gradients: (a) (2;1), grad 3   (b) (5;0), grad −2   (c) (1;−3), grad −3   (d) (−4;−2), grad ⅔   (e) (5;−2), grad −4⁄3',
      'Write down the gradients of, then sketch: (a) y = 2x + 3   (b) y = ¼x   (c) y = ⅝x − 2   (d) 3x + 7y = 5   (e) 4x − 7y = 7',
      'Find where each line crosses the axes, then sketch it: (a) y = 2x − 2   (b) y = ⅓x + 1   (c) 3x − 5y = 30   (d) 4x + 3y = 2   (e) 8x + 5y = 4',
    ],
  },
  {
    id: 'equation-of-line',
    eyebrow: 'Chapter 5.1',
    title: 'Equation of a Line',
    heading: 'Finding the Equation of a Straight Line',
    intro: "There are two common starting points for finding a line's equation: (a) a gradient and one point on the line, or (b) two points on the line. Both methods rest on the same idea — pick a general point (x, y) on the line, write down its gradient to a known point, and set that equal to the known gradient (found directly, or by using the two given points).",
    theorems: [
      'Given gradient m through point (a; b): (y − b) ⁄ (x − a) = m.',
      'Given two points (a; b) and (c; d): (y − b) ⁄ (x − a) = (d − b) ⁄ (c − a).',
    ],
    examples: [example5, example6],
    practice: [
      'Find the equation of the line through (4;9) with gradient 3, and through (0;0) with gradient 3.',
      'Find the equation of the line through (6;0) with gradient −¾, through (0;−5) with gradient −4, and through (−1;2) with gradient 2½.',
      'Find the equation of the line through: (a) (0;0) and (3;7)   (b) (−1;4) and (5;−2)   (c) (7;2) and (−9;7)',
      'A straight line is drawn through (7;0) and (−2;3). Find (a) its gradient, (b) its equation.',
      'A line of gradient 4½ passes through (4;−3). Write down (a) the equation of the line, (b) the equation of a parallel line through (0; ½).',
      'Find the value of k if the line joining (6;k) and (4;1) has gradient ⅗. Then find the equation of the line through (−4;5) with gradient −2.',
    ],
  },
  {
    id: 'gradient-of-curve',
    eyebrow: 'Chapter 5.2',
    title: 'Gradient of a Curve',
    heading: 'Gradient of a Curve',
    intro: "The gradient of a straight line is the same at every point on it, but the gradient of a curve changes from point to point. The gradient at a particular point on a curve is defined as the gradient of the tangent to the curve at that point — a ruler placed against the curve so the angles it makes with the curve on either side look equal. Slide the point along either curve below to watch the tangent (and its gradient) update continuously.",
    customDemo: TangentCurveDemo,
    definition: 'The gradient of a curve at a point equals the gradient of the tangent drawn to the curve at that point.',
    examples: [example7, example8],
    extra: <TurningPointIcons />,
    practice: [
      'For y = 3 − 2x − x², use tangents to find the gradient of the curve at x = −2 and at x = 1, and state the maximum value of the function.',
      'Copy and complete a table of values for y = 3x − x² from x = −2 to x = 4, then find the gradient of the curve at x = 0 and at x = 2.',
      'Draw y = x² for x from −4 to 4. Find the gradient at x = 3, at x = 1.5, and at x = −2.',
      'Draw y = 2x² − 4x + 3 from x = −2 to x = 4. Find the equation of the line of symmetry, the gradient at x = 3, and the minimum value of y.',
      'Draw y = x² − 4x from x = −1 to x = 5. Find the gradient at x = 4, at x = 2, and at x = 0.',
      'Draw y = x² − 3x + 2 from x = −1 to x = 4. Find the gradient at x = 2½, at x = 1½, at x = 0, and at x = −½.',
    ],
  },
  {
    id: 'example-library',
    eyebrow: 'Reference',
    title: 'Example Library',
    heading: 'Worked Example Library',
    intro: "Every worked example from this chapter, gathered in one place — from reading gradients off coordinates, to sketching lines, to finding equations, to tangents on curves. Use this page to revise without the surrounding explanation, or to find the closest match to a problem you're stuck on.",
    isLibrary: true,
    examples: [example1, example2, example3, example4, example5, example6, example7, example8],
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
            <DefinitionBox key={i} label={section.theorems.length > 1 ? `Result ${i + 1}` : 'Result'}>{t}</DefinitionBox>
          ))}
        </div>
      )}
      {section.definition && <DefinitionBox>{section.definition}</DefinitionBox>}
      {section.extra}
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

export const GraphsGradient = () => {
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
    <div id="gr-scroll-area" className="min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />
      {/* Duolingo Gradient Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 border-b-4 border-sky-800 pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-sky-300/30 text-white border border-sky-200/40`}>CHAPTER 5</span>
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
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Graphs & Gradient</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "Kudhirowa nekutsanangura magraph emutsetse wakatwasuka — kubva pakuisa nhamba patepu kusvika pakuverenga gradient ne y-intercept zvakananga kubva mumutemo." : "Drawing and interpreting straight-line graphs — from plotting a table of values to reading gradient and y-intercept straight from the equation, finding a line's equation from two clues, and measuring gradient on a curve using a tangent."}
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
                  className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-sky-500 border-b-4 border-sky-800 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
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

export default GraphsGradient;
