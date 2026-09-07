// GeometricalTransformations3.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { requestGroqCompletion } from '@/services/groq';


/* =========================================================================
   ICONS (inline SVGs – same as Matrices2)
   ========================================================================= */
const CircleHelp = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LoaderCircle = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const RotateCcw = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9m0 0-3 3m3-3 3 3" />
  </svg>
);

const Play = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Pause = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const X = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* Flags – same as before */
const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-fa-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="uk-clip-fa-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#uk-clip-fa-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-fa-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
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
    <path d="M 6.8 12.8 C 7.5 12 8.5 12.3 8.7 13 C 8.5 14 7.2 14.8 7.5 16 L 8.5 16.5 L 6.5 16.5 Z" fill="#ffd200" />
  </svg>
);

/* =========================================================================
   STYLES (same as Matrices2)
   ========================================================================= */
const InkStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .gc-hand { font-family: 'Patrick Hand', cursive; }
    .gc-ink { font-family: 'Kalam', cursive; }
    @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .gc-timeline { appearance: none; -webkit-appearance: none; height: 6px; border-radius: 999px; outline: none; }
    .gc-timeline::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 0; border-radius: 999px; background: #059669; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
    .gc-timeline::-moz-range-thumb { width: 18px; height: 18px; border: 0; border-radius: 999px; background: #059669; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
    .gc-paper { background-image: repeating-linear-gradient(#fbfaf6, #fbfaf6 26px, #e7e2d6 27px); background-position: 0 -2px; }
    .gc-frac-bar { transform: rotate(-0.6deg); box-shadow: 0 1px 0 rgba(23,23,23,0.15); }
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 999px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }
    .custom-scrollbar { scrollbar-width: thin; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .section-enter { animation: gcEnter 320ms ease-out; }
  `}</style>
);

/* =========================================================================
   UTILITY FUNCTIONS (same as Matrices2)
   ========================================================================= */
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const T = (value, noWrap = false) => ({ type: 'text', value, noWrap });
const F = (num, den) => ({ type: 'frac', num, den });
const M = (data) => ({ type: 'matrix', data }); // data is 2D array
const MFLOW = (aData, bData, resultData, operator, label = '') => ({ type: 'matrixflow', aData, bData, resultData, operator, label });
const MR = (data, aData, bData, operator) => ({ type: 'matrixresult', data, aData, bData, operator });
const BR = () => ({ type: 'break' }); // forces a line break in MathLine

/* =========================================================================
   RULER — a small ruler graphic that slides along whichever line/vector is
   currently being drawn, the way a person lines up a straightedge before
   drawing a segment.
   ========================================================================= */
const Ruler = ({ x1, y1, x2, y2 }) => {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const tickGap = 14;
  const tickCount = Math.max(2, Math.floor(len / tickGap));
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i * (len / tickCount));
  return (
    <g transform={`translate(${midX}, ${midY}) rotate(${angle})`} opacity="0.85">
      <rect x={-len / 2} y="-7" width={len} height="14" rx="2" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
      {ticks.map((t, i) => (
        <line key={i} x1={-len / 2 + t} y1="-7" x2={-len / 2 + t} y2={i % 5 === 0 ? 3 : -1} stroke="#b45309" strokeWidth="0.75" />
      ))}
    </g>
  );
};

/* =========================================================================
   COORDINATE PLANE GRAPH — bigger, clearer, and animated step-by-step like
   a person drawing it: axes and gridlines appear first, axis numbers are
   handwritten in one at a time, then each point is plotted the way a
   student actually plots one (find x on the x-axis, then travel up/down to
   y), then each line is drawn progressively with a ruler sliding along it.
   A caption above the graph names the current step, so the reader always
   knows which piece of working produced the number currently being drawn.
   ========================================================================= */
const EMPTY_POINTS = [];
const EMPTY_SHAPES = [];
const EMPTY_VECTORS = [];
const SPEED_OPTIONS = [0.5, 1, 1.5, 2];
const HEADER_H = 108;

const fmtNum = (n) => {
  if (Number.isInteger(n)) return String(n);
  const r = Math.round(n * 100) / 100;
  if (Number.isInteger(r)) return String(r);
  return r.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
};
const fmtCell = (v) => (typeof v === 'number' ? fmtNum(v) : String(v));

const CoordinatePlaneDisplay = ({
  title,
  caption,
  xRange = [-6, 6],
  yRange = [-6, 6],
  points = EMPTY_POINTS,
  shapes = EMPTY_SHAPES,
  vectors = EMPTY_VECTORS,
  drivenProgress = null,
}) => {
  const width = 560;
  const graphH = 560;
  const pad = 44;
  const totalH = graphH + HEADER_H;
  const graphTop = HEADER_H + pad;
  const graphBottom = HEADER_H + graphH - pad;
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;
  const sx = (x) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sy = (y) => HEADER_H + graphH - pad - ((y - yMin) / (yMax - yMin)) * (graphH - pad * 2);

  const timeline = useMemo(() => {
    const t = [];
    t.push({ kind: 'grid', label: 'Drawing the x and y axes' });

    const beforePts = points.filter((p) => p.phase !== 'after');
    const afterPts = points.filter((p) => p.phase === 'after');
    const beforeShape = shapes.find((s) => s.phase !== 'after');
    const afterShape = shapes.find((s) => s.phase === 'after');

    beforePts.forEach((p) => t.push({ kind: 'point', point: p, label: `Plotting ${p.label}` }));

    if (beforeShape) {
      const pl = beforeShape.points;
      const n = pl.length;
      const edgeCount = n > 2 ? n : n - 1;
      for (let i = 0; i < edgeCount; i++) {
        t.push({
          kind: 'edge',
          from: pl[i],
          to: pl[(i + 1) % n],
          color: beforeShape.color,
          shape: beforeShape,
          last: i === edgeCount - 1,
          label: 'Joining the original points',
        });
      }
    }

    afterPts.forEach((p) =>
      t.push({
        kind: 'point',
        point: p,
        label: `Plotting the image ${p.label} — using the answer you worked out above`,
      })
    );

    if (afterShape) {
      const pl = afterShape.points;
      const n = pl.length;
      const edgeCount = n > 2 ? n : n - 1;
      for (let i = 0; i < edgeCount; i++) {
        t.push({
          kind: 'edge',
          from: pl[i],
          to: pl[(i + 1) % n],
          color: afterShape.color,
          shape: afterShape,
          last: i === edgeCount - 1,
          label: 'Joining the image points',
        });
      }
    }

    vectors.forEach((v) =>
      t.push({
        kind: 'vector',
        vector: v,
        label: v.label ? `Drawing the vector to ${v.label}` : 'Drawing the vector to the image',
      })
    );

    return t;
  }, [points, shapes, vectors]);

  const STEP_MS = { grid: 1200, point: 2200, edge: 900, vector: 900 };

  const [step, setStep] = useState(timeline.length);
  const [subProgress, setSubProgress] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const rafRef = useRef(null);
  const timelineLenRef = useRef(timeline.length);

  useEffect(() => {
    if (timelineLenRef.current === timeline.length) return;
    timelineLenRef.current = timeline.length;
    setStep(timeline.length);
    setSubProgress(1);
    setPlaying(false);
  }, [timeline]);

  useEffect(() => {
    if (!playing) return undefined;
    if (step >= timeline.length) {
      setPlaying(false);
      return undefined;
    }
    const dur = (STEP_MS[timeline[step].kind] || 900) / speed;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setSubProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setStep((s) => s + 1);
        setSubProgress(0);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [playing, step, timeline, speed]);

  const isDriven = drivenProgress != null;
  const drivenFloat = isDriven ? clamp01(drivenProgress) * timeline.length : 0;
  const dStep = isDriven ? Math.min(timeline.length, Math.floor(drivenFloat)) : step;
  const dSub = isDriven ? clamp01(drivenFloat - dStep) : subProgress;

  const isDone = dStep >= timeline.length;
  const progressOf = (idx) => (idx < dStep ? 1 : idx === dStep ? dSub : 0);
  const overallProgress = timeline.length > 0 ? clamp01((dStep + dSub) / timeline.length) : 1;

  const handleButton = () => {
    if (playing) { setPlaying(false); return; }
    if (isDone) {
      setStep(0);
      setSubProgress(0);
      setPlaying(true);
      return;
    }
    setPlaying(true);
  };

  const buttonLabel = playing ? 'Pause' : isDone ? 'Watch it drawn' : 'Resume';

  const xTickStep = (xMax - xMin) > 10 ? 2 : 1;
  const yTickStep = (yMax - yMin) > 10 ? 2 : 1;
  const xTicks = [];
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) xTicks.push(x);
  const yTicks = [];
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) yTicks.push(y);
  const xLabelTicks = xTicks.filter((x) => x !== 0 && x % xTickStep === 0);
  const yLabelTicks = yTicks.filter((y) => y !== 0 && y % yTickStep === 0);
  const tickOrder = [
    ...xLabelTicks.map((v) => ({ axis: 'x', v })),
    ...yLabelTicks.map((v) => ({ axis: 'y', v })),
  ];
  const totalTicks = Math.max(1, tickOrder.length);

  const gridProg = progressOf(0);
  const tickReveal = (j) => (gridProg >= 1 ? 1 : clamp01(gridProg * totalTicks - j));

  const activePointLabel = !isDone && timeline[dStep] && timeline[dStep].kind === 'point'
    ? timeline[dStep].point.label
    : null;

  return (
    <div className="my-6 w-full max-w-full rounded-3xl border-2 border-b-4 border-sky-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        {title && (
          <span className="gc-hand text-base font-bold uppercase tracking-wider text-sky-600 sm:text-lg">
            {title}
          </span>
        )}
        {!isDriven && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-xl border-2 border-slate-200 bg-slate-50 p-0.5">
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`rounded-lg px-2 py-1 text-[10px] font-black transition ${
                    speed === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleButton}
              className="inline-flex items-center gap-1.5 relative overflow-hidden rounded-full px-4 py-2 text-xs font-black text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
              {playing ? <Pause className="h-3.5 w-3.5 fill-white relative z-10" /> : <Play className="h-3.5 w-3.5 fill-white relative z-10" />}
              <span className="relative z-10">{buttonLabel.toUpperCase()}</span>
            </button>
          </div>
        )}
      </div>

 

      {points.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-1.5 rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2">
          <span className="mr-1 text-[10px] font-black uppercase tracking-wider text-slate-400">Coordinates:</span>
          {points.map((p, idx) => {
            const isActive = activePointLabel === p.label;
            return (
              <span
                key={idx}
                className={`gc-hand rounded-lg px-2 py-0.5 text-sm font-bold transition-all ${
                  isActive ? 'scale-110 bg-amber-300 text-slate-900 shadow-sm' : ''
                }`}
                style={isActive ? undefined : { color: p.color || '#334155' }}
              >
                {p.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="mx-auto w-full max-w-[560px]">
        <svg viewBox={`0 0 ${width} ${totalH}`} className="h-auto w-full">
          {/* Workpad — bracket + x=/y= readout + travelling numbers, shown while a point is being plotted */}
          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'point') return null;
            const prog = progressOf(i);
            if (prog <= 0 || prog >= 1) return null;
            const p = tstep.point;
            const bracketIn = clamp01(prog / 0.18);
            const bracketOut = 1 - clamp01((prog - 0.55) / 0.15);
            const xTravel = clamp01((prog - 0.3) / 0.32);
            const yTravel = clamp01((prog - 0.62) / 0.36);

            const workpadX = width - 160;
            const workpadY = 12;
            const brLeft = workpadX;
            const brRight = workpadX + 30;
            const brTop = workpadY;
            const brBot = workpadY + 54;

            const xValStart = { x: (brLeft + brRight) / 2, y: workpadY + 20 };
            const yValStart = { x: (brLeft + brRight) / 2, y: workpadY + 44 };
            const xValEnd = { x: sx(p.x), y: sy(0) };
            const yValEnd = { x: sx(p.x), y: sy(p.y) };

            const xCur = {
              x: xValStart.x + (xValEnd.x - xValStart.x) * xTravel,
              y: xValStart.y + (xValEnd.y - xValStart.y) * xTravel,
            };
            const yCur = {
              x: yValStart.x + (yValEnd.x - yValStart.x) * yTravel,
              y: yValStart.y + (yValEnd.y - yValStart.y) * yTravel,
            };

            return (
              <g key={`wp${i}`}>
                <g opacity={Math.min(bracketIn, bracketOut)}>
                  <path d={`M ${brLeft + 6} ${brTop} h -6 v ${brBot - brTop} h 6`} stroke="#b45309" strokeWidth="2" fill="none" />
                  <path d={`M ${brRight - 6} ${brTop} h 6 v ${brBot - brTop} h -6`} stroke="#b45309" strokeWidth="2" fill="none" />
                  <text x={(brLeft + brRight) / 2} y={workpadY + 20} fontSize="13" textAnchor="middle" fill="#0f172a" className="gc-hand">
                    {fmtNum(p.x)}
                  </text>
                  <text x={(brLeft + brRight) / 2} y={workpadY + 44} fontSize="13" textAnchor="middle" fill="#0f172a" className="gc-hand">
                    {fmtNum(p.y)}
                  </text>
                  <text x={brRight + 12} y={workpadY + 20} fontSize="11" fill="#475569" className="gc-hand">x = {fmtNum(p.x)}</text>
                  <text x={brRight + 12} y={workpadY + 44} fontSize="11" fill="#475569" className="gc-hand">y = {fmtNum(p.y)}</text>
                </g>

                {xTravel > 0 && (
                  <>
                    <text x={xCur.x} y={xCur.y - 8} fontSize="13" fontWeight="700" textAnchor="middle" fill="#b45309" className="gc-hand">
                      {fmtNum(p.x)}
                    </text>
                    <circle cx={xCur.x} cy={xCur.y} r="3" fill={p.color || '#0f172a'} opacity="0.7" />
                  </>
                )}
                {yTravel > 0 && (
                  <>
                    <text x={yCur.x + 10} y={yCur.y + 4} fontSize="13" fontWeight="700" fill="#b45309" className="gc-hand">
                      {fmtNum(p.y)}
                    </text>
                    <circle cx={yCur.x} cy={yCur.y} r="3" fill={p.color || '#0f172a'} opacity="0.7" />
                  </>
                )}
              </g>
            );
          })}

          {/* Gridlines */}
          <g opacity={clamp01(gridProg * 1.6)}>
            {xTicks.map((x) => (
              <line key={`gx${x}`} x1={sx(x)} y1={graphTop} x2={sx(x)} y2={graphBottom} stroke="#e2e8f0" strokeWidth="1" />
            ))}
            {yTicks.map((y) => (
              <line key={`gy${y}`} x1={pad} y1={sy(y)} x2={width - pad} y2={sy(y)} stroke="#e2e8f0" strokeWidth="1" />
            ))}
          </g>

          {/* Axes — plain straight lines */}
          <g opacity={clamp01(gridProg * 2.2)}>
            <line x1={pad} y1={sy(0)} x2={width - pad} y2={sy(0)} stroke="#1e293b" strokeWidth="2" />
            <line x1={sx(0)} y1={graphTop} x2={sx(0)} y2={graphBottom} stroke="#1e293b" strokeWidth="2" />
          </g>
          <text x={width - pad + 8} y={sy(0) + 5} fontSize="14" fontWeight="700" fill="#1e293b" className="gc-hand" opacity={clamp01(gridProg * 2)}>x</text>
          <text x={sx(0) - 6} y={graphTop - 10} fontSize="14" fontWeight="700" fill="#1e293b" className="gc-hand" opacity={clamp01(gridProg * 2)}>y</text>

          {/* Axis tick numbers — handwritten, revealed one at a time */}
          {tickOrder.map((t, j) => {
            const r = tickReveal(j);
            if (r <= 0) return null;
            const x = t.axis === 'x' ? sx(t.v) : sx(0) - 12;
            const y = t.axis === 'x' ? sy(0) + 16 : sy(t.v) + 4;
            return (
              <text
                key={`${t.axis}${t.v}`}
                x={x}
                y={y}
                fontSize="12"
                textAnchor={t.axis === 'x' ? 'middle' : 'end'}
                fill="#64748b"
                className="gc-hand"
                opacity={r}
              >
                {t.v}
              </text>
            );
          })}

          {/* Edges — plain straight lines, drawn progressively with a ruler sliding along them */}
          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'edge') return null;
            const prog = progressOf(i);
            if (prog <= 0) return null;
            const x1 = sx(tstep.from.x), y1 = sy(tstep.from.y);
            const x2 = sx(tstep.to.x), y2 = sy(tstep.to.y);
            const curX = x1 + (x2 - x1) * prog;
            const curY = y1 + (y2 - y1) * prog;
            const isActive = prog > 0 && prog < 1;
            return (
              <g key={`edge${i}`}>
                {tstep.last && tstep.shape && tstep.shape.points.length > 2 && (
                  <polygon
                    points={tstep.shape.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')}
                    fill={tstep.shape.color || '#38bdf8'}
                    fillOpacity={(tstep.shape.fillOpacity ?? 0.18) * prog}
                    stroke="none"
                  />
                )}
                <line
                  x1={x1} y1={y1} x2={curX} y2={curY}
                  stroke={tstep.color || '#0284c7'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={tstep.shape?.dashed ? '6 5' : undefined}
                />
                {isActive && (
                  <>
                    <Ruler x1={x1} y1={y1} x2={x2} y2={y2} />
                    <circle cx={curX} cy={curY} r="4" fill="#0f172a" />
                  </>
                )}
              </g>
            );
          })}

          {/* Vectors — plain straight lines with arrowhead, drawn with a ruler */}
          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'vector') return null;
            const prog = progressOf(i);
            if (prog <= 0) return null;
            const v = tstep.vector;
            const x1 = sx(v.from.x), y1 = sy(v.from.y);
            const x2 = sx(v.to.x), y2 = sy(v.to.y);
            const curX = x1 + (x2 - x1) * prog;
            const curY = y1 + (y2 - y1) * prog;
            const isActive = prog > 0 && prog < 1;
            const angle = Math.atan2(curY - y1, curX - x1);
            const ah = 8;
            return (
              <g key={`vec${i}`}>
                <line x1={x1} y1={y1} x2={curX} y2={curY} stroke={v.color || '#dc2626'} strokeWidth="2.5" strokeLinecap="round" />
                {prog >= 0.98 && (
                  <polygon
                    points={`${curX},${curY} ${curX - ah * Math.cos(angle - 0.5)},${curY - ah * Math.sin(angle - 0.5)} ${curX - ah * Math.cos(angle + 0.5)},${curY - ah * Math.sin(angle + 0.5)}`}
                    fill={v.color || '#dc2626'}
                  />
                )}
                {isActive && <Ruler x1={x1} y1={y1} x2={x2} y2={y2} />}
                {v.label && prog >= 1 && (
                  <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 4} fontSize="11" fontWeight="700" fill={v.color || '#dc2626'} className="gc-hand">{v.label}</text>
                )}
              </g>
            );
          })}

          {/* Points — final rendering, once the number-travel animation lands */}
          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'point') return null;
            const prog = progressOf(i);
            if (prog < 1) return null;
            const p = tstep.point;
            return (
              <g key={`pt${i}`}>
                <circle cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill={p.color || '#0f172a'} />
                <text x={sx(p.x) + 7} y={sy(p.y) - 7} fontSize="12" fontWeight="700" fill={p.color || '#0f172a'} className="gc-hand">
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Player line — scrub bar showing overall draw progress */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Draw</span>
        <div className="relative h-2 flex-1 rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
            style={{ width: `${overallProgress * 100}%` }}
          />
          <div
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-emerald-600 bg-white shadow"
            style={{ left: `calc(${overallProgress * 100}% - 6px)` }}
          />
        </div>
        <span className="text-[10px] font-black tabular-nums text-slate-400">
          {Math.round(overallProgress * 100)}%
        </span>
      </div>

      {caption && <p className="mt-2 text-center text-xs italic text-slate-500 sm:text-sm">{caption}</p>}
    </div>
  );
};

/* =========================================================================
   PLOT GUIDE — bridges the worked-out numbers to the actual drawing.
   Reads the same points array the graph itself uses, so it can never go
   out of sync with the working above it.
   ========================================================================= */
const PlotGuide = ({ graph }) => {
  if (!graph || !graph.points || graph.points.length === 0) return null;
  const before = graph.points.filter((p) => p.phase !== 'after');
  const after = graph.points.filter((p) => p.phase === 'after');
  return (
    <div className="mb-3 rounded-2xl border-2 border-dashed border-slate-300 bg-white/70 p-4">
      <p className="gc-hand mb-1.5 text-sm font-bold text-slate-600">
        Turning your working into this graph:
      </p>
      <ol className="list-inside list-decimal space-y-1 text-sm leading-relaxed text-slate-700">
        <li>Draw x and y axes and mark the gridlines like the ones below.</li>
        {before.length > 0 && (
          <li>
            Plot the <span className="font-bold text-slate-900">original</span> points:{' '}
            {before.map((p) => p.label).join(', ')}. Join them in order to draw the original shape.
          </li>
        )}
        {after.length > 0 && (
          <li>
            Using the coordinates you just calculated in the steps above, plot the{' '}
            <span className="font-bold text-red-600">image</span> points:{' '}
            {after.map((p) => p.label).join(', ')}.
          </li>
        )}
        <li>
          Join the image points in the <span className="font-bold">same order</span> as the original
          shape. Each image point should sit exactly where your working said it would — if it doesn't,
          check your matrix multiplication again.
        </li>
      </ol>
    </div>
  );
};

/* =========================================================================
   CONCEPT INTRO — plain-language explanation shown before the Rule box and
   Worked Examples, so a reader always knows what they're studying and why,
   the way the textbook's "Translation / Rotation / Reflection" prose does
   before its first worked example.
   ========================================================================= */
const ConceptIntro = ({ title, paragraphs, graph }) => (
  <div className="mb-6 rounded-3xl border-2 border-b-4 border-slate-200 bg-slate-50/60 p-5 sm:p-7">
    <h3 className="mb-3 text-lg font-black text-slate-900 sm:text-xl">{title}</h3>
    <div className="space-y-3">
      {paragraphs.map((p, i) => (
        <p key={i} className="text-base leading-relaxed text-slate-700 sm:text-lg">{p}</p>
      ))}
    </div>
    {graph && <PlotGuide graph={graph} />}
    {graph && <CoordinatePlaneDisplay {...graph} />}
  </div>
);

let stepUid = 0;
const nextStepId = () => `ms${stepUid++}`;

const mkStep = (
  seg: any[],
  note: string,
  opts: { noteShona?: string; duration?: number; isFinal?: boolean } = {},
) => {
  const len = seg.reduce((s, p) => {
    if (p.type === 'text') return s + p.value.length;
    if (p.type === 'frac') return s + p.num.length + p.den.length + 3;
    if (p.type === 'matrix') {
      let total = 0;
      p.data.forEach(row => {
        row.forEach(cell => {
          total += String(cell).length;
        });
        total += row.length - 1;
      });
      return s + total + 10;
    }
    if (p.type === 'matrixresult') {
      const cells = p.data.reduce((acc, row) => acc + row.length, 0);
      return s + cells * 22 + 20;
    }
    if (p.type === 'matrixflow') {
      const cells = p.resultData.reduce((acc, row) => acc + row.length, 0);
      return s + cells * 60 + 30;
    }
    return s;
  }, 0);
  return {
    id: nextStepId(),
    seg,
    note,
    noteShona: opts.noteShona || '',
    duration: opts.duration ?? Math.max(1800, len * 70),
    isFinal: opts.isFinal ?? false,
  };
};

const glyphMetrics = (char) => {
  if (/\s/.test(char)) return { cssWidth: 0.32, viewWidth: 10 };
  if (/[1ilI.,'()$%]/.test(char)) return { cssWidth: 0.4, viewWidth: 13 };
  if (/[mwMW]/.test(char)) return { cssWidth: 0.9, viewWidth: 28 };
  return { cssWidth: 0.66, viewWidth: 21 };
};

const matrixToString = (data) => {
  const rows = data.map(row => row.join(' '));
  return '⎡' + rows.join(' ⎤ ⎡') + '⎦';
};

const describeStepForPrompt = (step, lang) => {
  const mathText = step.seg.map(s => {
    if (s.type === 'text') return s.value;
    if (s.type === 'frac') return `(${s.num})/(${s.den})`;
    if (s.type === 'matrix') return matrixToString(s.data);
    if (s.type === 'matrixresult') return matrixToString(s.data);
    if (s.type === 'matrixflow') return `${matrixToString(s.aData)} ${s.operator} ${matrixToString(s.bData)} = ${matrixToString(s.resultData)}`;
    return '';
  }).join('');
  const note = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;
  return `${mathText}  [reason given: ${note}]`;
};

const MatrixDisplay = ({ data, progress, compact = false, nested = false }) => {
  const rows = data;
  const numRows = rows.length;
  const numCols = rows[0] ? rows[0].length : 0;
  const fontSize = compact ? 20 : 26;
  const rowHeight = fontSize * 1.6;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;

  // Estimate cell widths based on content (simplified: use max length per column)
  const colWidths = Array(numCols).fill(0);
  rows.forEach(row => {
    row.forEach((cell, ci) => {
      const len = fmtCell(cell).length;
      if (len > colWidths[ci]) colWidths[ci] = len;
    });
  });
  // Convert to pixel widths (approx)
  const colPx = colWidths.map(w => Math.max(30, w * (compact ? 12 : 16) + cellPadding * 2));

  const totalWidth = colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const totalHeight = numRows * rowHeight + cellPadding * 2;

  // Bracket path: curvy left bracket and right bracket
  const drawBracket = (x, y, height, direction = 1) => {
    // direction: 1 for left, -1 for right
    const hw = bracketWidth;
    const pad = 4;
    const topY = y + pad;
    const botY = y + height - pad;
    const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    // Path: from top tip to bottom tip with curved hooks instead of hard corners
    let path = '';
    if (direction === 1) { // left bracket
      path = `M ${x + hw} ${topY}
              Q ${x} ${topY} ${x} ${topY + curveSize}
              L ${x} ${botY - curveSize}
              Q ${x} ${botY} ${x + hw} ${botY}`;
    } else { // right bracket
      path = `M ${x} ${topY}
              Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize}
              L ${x + hw} ${botY - curveSize}
              Q ${x + hw} ${botY} ${x} ${botY}`;
    }
    return path;
  };

  // We'll render the entire matrix inside an SVG with a reveal opacity
  const overallProgress = clamp01(progress);
  const opacity = clamp01((overallProgress - 0.5) / 0.5); // fade in

  const svgStyle = nested
    ? { opacity }
    : { opacity, width: `min(100%, ${totalWidth}px)`, height: 'auto' };

  return (
    <svg
      width={nested ? totalWidth : undefined}
      height={nested ? totalHeight : undefined}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={nested ? 'shrink-0 overflow-visible' : 'block max-w-full overflow-visible'}
      style={svgStyle}
    >
      {/* Brackets */}
      <path
        d={drawBracket(0, 0, totalHeight, 1)}
        stroke="#1e3a8a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={drawBracket(totalWidth - bracketWidth, 0, totalHeight, -1)}
        stroke="#1e3a8a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cells */}
      {rows.map((row, ri) => {
        let xOffset = bracketWidth + cellPadding;
        return row.map((cell, ci) => {
          const cellWidth = colPx[ci];
          const cx = xOffset + cellWidth / 2;
          const cy = ri * rowHeight + rowHeight / 2 + cellPadding;
          const cellStr = fmtCell(cell);
          xOffset += cellWidth;
          // Render each cell as a handwritten text
          return (
            <text
              key={`${ri}-${ci}`}
              x={cx}
              y={cy + fontSize * 0.35}
              fontFamily="Kalam, cursive"
              fontSize={fontSize}
              fontWeight="700"
              fill="#1e3a8a"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {cellStr}
            </text>
          );
        });
      })}
    </svg>
  );
};

/* =========================================================================
   ANIMATED RESULT MATRIX: per-cell "raise the two operands, merge, drop in"
   ========================================================================= */
const MatrixResultDisplay = ({ resultData, aData, bData, operator, progress, compact = false }) => {
  const rows = resultData;
  const numRows = rows.length;
  const numCols = rows[0] ? rows[0].length : 0;
  const fontSize = compact ? 20 : 26;
  const exprFontSize = compact ? 13 : 16;
  const rowHeight = fontSize * 1.6;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;

  const colWidths = Array(numCols).fill(0);
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const exprLen = `${fmtCell(aData[ri][ci])} ${operator} ${fmtCell(bData[ri][ci])}`.length;
      const resLen = fmtCell(cell).length;
      const len = Math.max(exprLen * 0.72, resLen);
      if (len > colWidths[ci]) colWidths[ci] = len;
    });
  });
  const colPx = colWidths.map(w => Math.max(44, w * (compact ? 10 : 13) + cellPadding * 2));

  const totalWidth = colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const totalHeight = numRows * rowHeight + cellPadding * 2;

  const drawBracket = (x, y, height, direction = 1) => {
    const hw = bracketWidth;
    const pad = 4;
    const topY = y + pad;
    const botY = y + height - pad;
    const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    if (direction === 1) {
      return `M ${x + hw} ${topY}
              Q ${x} ${topY} ${x} ${topY + curveSize}
              L ${x} ${botY - curveSize}
              Q ${x} ${botY} ${x + hw} ${botY}`;
    }
    return `M ${x} ${topY}
            Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize}
            L ${x + hw} ${botY - curveSize}
            Q ${x + hw} ${botY} ${x} ${botY}`;
  };

  const overallProgress = clamp01(progress);
  const containerOpacity = clamp01((overallProgress - 0.02) / 0.1);

  const totalCells = Math.max(1, numRows * numCols);
  let cellIndex = 0;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="block max-w-full overflow-visible"
      style={{ opacity: containerOpacity, width: `min(100%, ${totalWidth}px)`, height: 'auto' }}
    >
      <path d={drawBracket(0, 0, totalHeight, 1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={drawBracket(totalWidth - bracketWidth, 0, totalHeight, -1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {rows.map((row, ri) => {
        let xOffset = bracketWidth + cellPadding;
        return row.map((cell, ci) => {
          const cellWidth = colPx[ci];
          const cx = xOffset + cellWidth / 2;
          const cy = ri * rowHeight + rowHeight / 2 + cellPadding;
          xOffset += cellWidth;

          const myIndex = cellIndex++;
          const cellStart = myIndex / totalCells;
          const cellEnd = (myIndex + 1) / totalCells;
          const p = clamp01((overallProgress - cellStart) / (cellEnd - cellStart));

          const aVal = fmtCell(aData[ri][ci]);
          const bVal = fmtCell(bData[ri][ci]);
          const exprText = `${aVal} ${operator} ${bVal}`;
          const resText = fmtCell(cell);

          // Phase 1 (0 - 0.3): the two operands rise up into place, red.
          const riseP = clamp01(p / 0.3);
          const exprY = cy + (1 - riseP) * 16;
          // Phase 2 (0.3 - 0.65): they hold, visible, red, combined as "a + b".
          // Phase 3 (0.65 - 0.93): crossfade + shrink out red expr, grow in blue result.
          const exprOpacity = p <= 0.65 ? clamp01(p / 0.15) : clamp01(1 - (p - 0.65) / 0.15);
          const resultOpacity = clamp01((p - 0.68) / 0.28);
          const resultScale = 0.82 + resultOpacity * 0.18;

          return (
            <g key={`${ri}-${ci}`}>
              <text
                x={cx}
                y={exprY + exprFontSize * 0.32}
                fontFamily="Kalam, cursive"
                fontSize={exprFontSize}
                fontWeight="700"
                fill="#dc2626"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={exprOpacity}
              >
                {exprText}
              </text>
              <text
                x={cx}
                y={cy + fontSize * 0.35}
                fontFamily="Kalam, cursive"
                fontSize={fontSize}
                fontWeight="700"
                fill="#1e3a8a"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={resultOpacity}
                style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${resultScale})` }}
              >
                {resText}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
};

/* =========================================================================
   MATRIX FLOW: A and B render via MatrixDisplay (unchanged), then each
   source number physically travels down from its real cell position into
   the result cell, pauses in red as "a op b", then the merged value is
   hand-drawn (stroke reveal) in blue at its final spot.
   ========================================================================= */
const MatrixFlowDisplay = ({ aData, bData, resultData, operator, label = '', progress, compact = false }) => {
  const numRows = resultData.length;
  const numCols = resultData[0] ? resultData[0].length : 0;
  const fontSize = compact ? 20 : 26;
  const rowHeight = fontSize * 1.6;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;
  const rowGap = compact ? 30 : 40;
  const midGap = compact ? 16 : 22;
  const eqSymbolWidth = compact ? 18 : 24;
  const labelWidth = label ? Array.from(label).length * (fontSize * 0.62) + midGap : 0;

  const opGap = compact ? 38 : 54;
  const opSymbolWidth = compact ? 34 : 42;
  const opGlyphNudge = 0;

  const colWidthsFor = (data) => {
    const w = Array(numCols).fill(0);
    data.forEach(row => row.forEach((cell, ci) => {
      const len = fmtCell(cell).length;
      if (len > w[ci]) w[ci] = len;
    }));
    return w.map(w0 => Math.max(30, w0 * (compact ? 12 : 16) + cellPadding * 2));
  };

  const colPxA = colWidthsFor(aData);
  const colPxB = colWidthsFor(bData);
  const colPxR = colWidthsFor(resultData);

  const matrixWidth = (colPx) => colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const widthA = matrixWidth(colPxA);
  const widthB = matrixWidth(colPxB);
  const widthR = matrixWidth(colPxR);
  const matrixHeight = numRows * rowHeight + cellPadding * 2;

  // Row 1: [label] A op B — left-aligned, starting at x=0
  const aX = labelWidth;
  const opX = aX + widthA + opGap;
  const bX = opX + opSymbolWidth + opGap;
  const row1Width = aX + widthA + opGap + opSymbolWidth + opGap + widthB;

  // Row 2: "=" Result — indented to start where A starts, so it visually
  // sits "under" the expression it came from, on every screen size.
  const eqX = labelWidth;
  const rX = eqX + eqSymbolWidth + midGap;
  const row2Width = eqX + eqSymbolWidth + midGap + widthR;

  const totalWidth = Math.max(row1Width, row2Width);

  const row1Y = 0;
  const row2Y = matrixHeight + rowGap;
  const totalHeight = matrixHeight * 2 + rowGap;

  const drawBracket = (x, y, height, direction = 1) => {
    const hw = bracketWidth;
    const pad = 4;
    const topY = y + pad;
    const botY = y + height - pad;
    const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    if (direction === 1) {
      return `M ${x + hw} ${topY} Q ${x} ${topY} ${x} ${topY + curveSize} L ${x} ${botY - curveSize} Q ${x} ${botY} ${x + hw} ${botY}`;
    }
    return `M ${x} ${topY} Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize} L ${x + hw} ${botY - curveSize} Q ${x + hw} ${botY} ${x} ${botY}`;
  };

  const cellCenter = (matrixX, matrixY, colPx, ri, ci) => {
    let xOff = matrixX + bracketWidth + cellPadding;
    for (let k = 0; k < ci; k++) xOff += colPx[k];
    const cx = xOff + colPx[ci] / 2;
    const cy = matrixY + ri * rowHeight + rowHeight / 2 + cellPadding;
    return [cx, cy];
  };

  const overall = clamp01(progress);
  const introP = clamp01(overall / 0.1);
  const totalCells = Math.max(1, numRows * numCols);
  const cellsStart = 0.1;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const labelDashLen = label ? Array.from(label).length * 30 + 20 : 0;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="block max-w-full overflow-visible"
      style={{ width: `min(100%, ${totalWidth}px)`, height: 'auto' }}
    >
      {label && (
        <text
          x={0}
          y={row1Y + matrixHeight / 2 + fontSize * 0.35}
          fontFamily="Kalam, cursive"
          fontSize={fontSize}
          fontWeight="700"
          fill="#1e3a8a"
          stroke="#1e3a8a"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={labelDashLen}
          strokeDashoffset={labelDashLen * (1 - introP)}
          fillOpacity={clamp01((introP - 0.6) / 0.4)}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}

      <g style={{ opacity: introP }}>
        <g transform={`translate(${aX}, ${row1Y})`}>
          <MatrixDisplay data={aData} progress={1} compact={compact} nested />
        </g>
        <text
          x={opX + opSymbolWidth / 2}
          y={row1Y + matrixHeight / 2}
          fontFamily="Kalam, cursive"
          fontSize={compact ? 30 : 38}
          fontWeight="700"
          fill="#1e3a8a"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {operator}
        </text>
        <g transform={`translate(${bX}, ${row1Y})`}>
          <MatrixDisplay data={bData} progress={1} compact={compact} nested />
        </g>
      </g>

      <g style={{ opacity: introP }}>
        <text x={eqX + eqSymbolWidth / 2} y={row2Y + matrixHeight / 2} fontFamily="Kalam, cursive" fontSize={fontSize} fontWeight="700" fill="#1e3a8a" textAnchor="middle" dominantBaseline="central">
          =
        </text>
        <path d={drawBracket(rX, row2Y, matrixHeight, 1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={drawBracket(rX + widthR - bracketWidth, row2Y, matrixHeight, -1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {resultData.map((row, ri) => row.map((cell, ci) => {
        const cellIdx = ri * numCols + ci;
        const cellStart = cellsStart + (cellIdx / totalCells) * (1 - cellsStart);
        const cellEnd = cellsStart + ((cellIdx + 1) / totalCells) * (1 - cellsStart);
        const p = clamp01((overall - cellStart) / (cellEnd - cellStart));

        const [aCx, aCy] = cellCenter(aX, row1Y, colPxA, ri, ci);
        const [bCx, bCy] = cellCenter(bX, row1Y, colPxB, ri, ci);
        const [rCx, rCy] = cellCenter(rX, row2Y, colPxR, ri, ci);

        const aVal = fmtCell(aData[ri][ci]);
        const bVal = fmtCell(bData[ri][ci]);
        const resVal = fmtCell(cell);

        const slotOffset = fontSize * 0.6;
        const leftSlot = [rCx - slotOffset, rCy];
        const rightSlot = [rCx + slotOffset, rCy];

        const travelP = ease(clamp01(p / 0.45));
        const aTravelX = aCx + (leftSlot[0] - aCx) * travelP;
        const aTravelY = aCy + (leftSlot[1] - aCy) * travelP;
        const bTravelX = bCx + (rightSlot[0] - bCx) * travelP;
        const bTravelY = bCy + (rightSlot[1] - bCy) * travelP;

        const travelOpacity = clamp01(p / 0.12);
        const holdEndFade = p >= 0.68 ? clamp01(1 - (p - 0.68) / 0.12) : 1;
        const operandsOpacity = travelOpacity * holdEndFade;
        const operandsScale = p >= 0.68 ? Math.max(0.2, holdEndFade) : 1;

        const opSignOpacity = clamp01((p - 0.3) / 0.15) * holdEndFade;
        const resultDrawP = clamp01((p - 0.72) / 0.28);
        const dashLen = resVal.length * 46 + 20;
        const showOperands = p < 0.85;

        return (
          <g key={`${ri}-${ci}`}>
            {showOperands && (
              <>
                <text
                  x={aTravelX}
                  y={aTravelY + fontSize * 0.3}
                  fontFamily="Kalam, cursive"
                  fontSize={fontSize * 0.82}
                  fontWeight="700"
                  fill="#dc2626"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={operandsOpacity}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${operandsScale})` }}
                >
                  {aVal}
                </text>
                <text
                  x={rCx}
                  y={rCy + fontSize * 0.3}
                  fontFamily="Kalam, cursive"
                  fontSize={fontSize * 0.7}
                  fontWeight="700"
                  fill="#dc2626"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={opSignOpacity}
                >
                  {operator}
                </text>
                <text
                  x={bTravelX}
                  y={bTravelY + fontSize * 0.3}
                  fontFamily="Kalam, cursive"
                  fontSize={fontSize * 0.82}
                  fontWeight="700"
                  fill="#dc2626"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={operandsOpacity}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${operandsScale})` }}
                >
                  {bVal}
                </text>
              </>
            )}

            <text
              x={rCx}
              y={rCy + fontSize * 0.35}
              fontFamily="Kalam, cursive"
              fontSize={fontSize}
              fontWeight="700"
              fill="#1e3a8a"
              stroke="#1e3a8a"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dashLen}
              strokeDashoffset={dashLen * (1 - resultDrawP)}
              fillOpacity={clamp01((resultDrawP - 0.55) / 0.45)}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {resVal}
            </text>
          </g>
        );
      }))}
    </svg>
  );
};

// Handwritten character rendering (unchanged)
const HandwrittenRun = ({
  value,
  progress,
  compact = false,
  noWrap = false,
}: {
  value: string;
  progress: number;
  compact?: boolean;
  noWrap?: boolean;
}) => {
  const chars = Array.from(value);
  const totalChars = chars.length;

  const renderGlyph = (ch, idx) => {
    const gp = clamp01(progress * totalChars - idx);
    const { cssWidth, viewWidth } = glyphMetrics(ch);
    return (
      <svg
        key={idx}
        aria-hidden="true"
        viewBox={`0 0 ${viewWidth} 30`}
        className={compact ? 'h-[1.4em] shrink-0 overflow-visible' : 'h-[1.55em] shrink-0 overflow-visible'}
        style={{ width: `${cssWidth}em` }}
      >
        <text
          x="1"
          y="23"
          fontFamily="Kalam, cursive"
          fontSize={compact ? 24 : 27}
          fontWeight="700"
          fill="#1e3a8a"
          fillOpacity={clamp01((gp - 0.72) / 0.28)}
          stroke="#1e3a8a"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="240"
          strokeDashoffset={240 * (1 - gp)}
        >
          {ch}
        </text>
      </svg>
    );
  };

  // Group characters into words so a word never splits across a line break,
  // while still letting long lines wrap naturally at the spaces between words.
  const words = [];
  let currentWord = [];
  let globalIdx = 0;
  chars.forEach((ch) => {
    if (/\s/.test(ch)) {
      if (currentWord.length) { words.push(currentWord); currentWord = []; }
      words.push([{ ch, idx: globalIdx }]);
    } else {
      currentWord.push({ ch, idx: globalIdx });
    }
    globalIdx += 1;
  });
  if (currentWord.length) words.push(currentWord);

  return (
    <span
      className={`inline-flex items-baseline ${noWrap ? 'flex-nowrap whitespace-nowrap' : 'flex-wrap'} ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
      aria-label={value}
    >
      {words.map((word, wi) => {
        if (word.length === 1 && /\s/.test(word[0].ch)) {
          const { cssWidth } = glyphMetrics(word[0].ch);
          return <span key={wi} aria-hidden="true" style={{ width: `${cssWidth}em` }} />;
        }
        return (
          <span key={wi} className="inline-flex shrink-0 flex-nowrap whitespace-nowrap items-baseline">
            {word.map(({ ch, idx }) => renderGlyph(ch, idx))}
          </span>
        );
      })}
    </span>
  );
};

// Mirrors MatrixDisplay's totalWidth calculation so the wrapper span has an
// explicit pixel width matching the SVG — prevents the span from stretching inside
// a flex row and creating a gap between the matrix and the operator symbol.
const matrixNaturalWidth = (data, compact = false) => {
  const numCols = data[0] ? data[0].length : 0;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;
  const colWidths = Array(numCols).fill(0);
  data.forEach(row => row.forEach((cell, ci) => {
    const len = String(cell).length;
    if (len > colWidths[ci]) colWidths[ci] = len;
  }));
  const colPx = colWidths.map(w => Math.max(30, w * (compact ? 12 : 16) + cellPadding * 2));
  return colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
};

// Single-line math display – now with matrix support
const MathLine = ({ seg, progress, isFinal }) => {
  // We'll compute total "length" for progress: each element consumes a portion
  // For simplicity, we assign each element equal weight (1)
  const total = seg.length;
  const revealed = clamp01(progress) * total;
  let consumed = 0;

  const rendered = seg.map((s, i) => {
    const localProgress = clamp01((revealed - consumed) / 1);
    consumed += 1;

    if (s.type === 'text') {
      // Render pure operator symbols (×, +, −, =, ÷) as large, bold, vertically-centred
      // spans so they look correct next to matrix brackets instead of being tiny SVG glyphs
      const trimmed = s.value.trim();
      const MATRIX_OPS = ['×', '×', '+', '−', '-', '=', '÷', '·'];
      if (MATRIX_OPS.includes(trimmed)) {
        return (
          <span
            key={i}
            className="mx-2 inline-flex shrink-0 items-center self-center font-black text-sky-600"
            style={{ fontSize: '1.45rem', lineHeight: 1, opacity: clamp01((localProgress - 0.5) / 0.5) }}
            aria-label={trimmed}
          >
            {trimmed}
          </span>
        );
      }
      // Split text into individual characters for handwriting reveal
      return <HandwrittenRun key={i} value={s.value} progress={localProgress} noWrap={s.noWrap} />;
    } else if (s.type === 'frac') {
      const nProg = clamp01(localProgress * 2);
      const barProg = clamp01(localProgress * 2 - 1);
      const dProg = clamp01(localProgress * 2 - 1.5);
      return (
        <span key={i} className="mx-1.5 inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap">
          <HandwrittenRun value={s.num} progress={nProg} compact />
          <span className="my-0.5 h-[2px] w-full min-w-5 origin-left bg-blue-900" style={{ transform: `scaleX(${barProg})` }} />
          <HandwrittenRun value={s.den} progress={dProg} compact />
        </span>
      );
        } else if (s.type === 'matrix') {
      const mw = matrixNaturalWidth(s.data, true);
      return (
        <span key={i} className="mx-1 shrink-0 inline-block align-middle" style={{ width: mw }}>
          <MatrixDisplay data={s.data} progress={localProgress} compact />
        </span>
      );
    } else if (s.type === 'matrixresult') {
      const mw = matrixNaturalWidth(s.data, true);
      return (
        <span key={i} className="mx-1 shrink-0 inline-block align-middle" style={{ width: mw }}>
          <MatrixResultDisplay
            resultData={s.data}
            aData={s.aData}
            bData={s.bData}
            operator={s.operator}
            progress={localProgress}
            compact
          />
        </span>
      );
    } else if (s.type === 'matrixflow') {
      return (
        <span key={i} className="mx-1 block w-full max-w-full min-w-0 align-middle">
          <MatrixFlowDisplay
            aData={s.aData}
            bData={s.bData}
            resultData={s.resultData}
            operator={s.operator}
            label={s.label}
            progress={localProgress}
            compact
          />
        </span>
      );
    } else if (s.type === 'break') {
      return <span key={i} aria-hidden="true" className="basis-full h-0" />;
    }
    return null;
  });

  const safe = clamp01(progress);
  const doneFinal = isFinal && safe >= 1;

  return (
    <div
      className={`flex w-full min-w-0 max-w-full flex-wrap items-center gap-y-1 py-1.5 ${doneFinal ? 'border-b-4 border-double border-red-600 pb-1 pr-2' : ''}`}
    >
      {rendered}
    </div>
  );
};

// AI explanation popup for each worked step.
const StepExplanationHelp = ({ question, stepsThroughCurrent, stepNumber, lang = 'en' }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const thinkingWords = lang === 'sn'
    ? ['Kufunga', 'Kutarisa', 'Kunzvera', 'Kuongorora', 'Kufambisa', 'Kutsvaga', 'Kupimisa', 'Kuverenga', 'Kudzokorora', 'Kuronga']
    : ['Delving', 'Pondering', 'Navigating', 'Unraveling', 'Elucidating', 'Deciphering', 'Charting', 'Weighing', 'Cross-checking', 'Reasoning'];

  useEffect(() => {
    if (!loading) { setThinkingIndex(0); return undefined; }
    const iv = setInterval(() => setThinkingIndex(c => (c + 1) % thinkingWords.length), 850);
    return () => clearInterval(iv);
  }, [loading, thinkingWords]);

  const askForExplanation = async () => {
    setOpen(true);
    if (response || loading) return;
    setLoading(true);
    setError('');

    const selected = stepsThroughCurrent[stepsThroughCurrent.length - 1];
    const previousSteps = stepsThroughCurrent.slice(0, -1);

    const contextLines = [
      `The original question was: ${question}`,
      previousSteps.length > 0
        ? `Steps already shown to the student before this one:\n${previousSteps.map((s, i) => `${i + 1}. ${describeStepForPrompt(s, lang)}`).join('\n')}`
        : `This is the first step.`,
      `The current step the student is asking about is: ${describeStepForPrompt(selected, lang)}`
    ].join('\n\n');

    const isShona = lang === 'sn';
    const systemPrompt = isShona
      ? `Uri mudzidzisi wemasvomhu anobatsira vadzidzi vechikoro veZimbabwe kunzwisisa matrix algebra. Tsanangura nhanho iyi zvakajeka, uchishandisa mazwi eChiShona chiri nyore. Taura kuti chii chinotorwa kubva panhanho yakapfuura, chii chinoitwa kwachiri, uye kuti sei zvichipa mhinduro yaunoona. Nyorai mitsara mishoma (2-4), musingadzokorore mabhii ese emumatrix, asi tsanangura maitiro.`
      : `You are a math tutor helping a Zimbabwean secondary school student understand matrix algebra step by step. Explain this specific step clearly in plain English: what is being taken from the previous step, what operation is applied to it, and why that produces the result shown. Keep it to 2-4 short sentences, conversational, no restating every raw number, focus on the reasoning.`;

    try {
      const text = await requestGroqCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contextLines },
        ],
        maxTokens: 500,
        temperature: 0.2,
      });

      setResponse({
        explanation: text.split(/\n+/).map((line) => line.trim()).filter(Boolean),
        mathLines: [selected.seg]
      });
    } catch (requestError) {
      setError(requestError instanceof Error
        ? requestError.message
        : isShona
          ? 'Zvakatadzika kuwana tsananguro. Edza zvakare.'
          : 'Could not get an explanation right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        onClick={askForExplanation}
        aria-label={`Explain step ${stepNumber}`}
        aria-expanded={open}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 transition hover:bg-emerald-50 active:translate-y-px"
      >
        <CircleHelp className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-9 z-40 block w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left shadow-[0_4px_0_#e2e8f0] sm:left-auto sm:right-0 sm:translate-x-0 sm:p-5">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-slate-200 bg-white sm:left-auto sm:right-4 sm:translate-x-0" />
          <span className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              {lang === 'sn' ? 'Sei nhanho iyi?' : 'Why this step?'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close explanation"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </span>

          {loading && (
            <span className="block" role="status" aria-live="polite">
              <span className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span key={thinkingIndex} className="animate-pulse">{thinkingWords[thinkingIndex]}…</span>
              </span>
              <span className="mt-4 block animate-pulse space-y-3" aria-hidden="true">
                <span className="block h-3 w-full rounded-full bg-slate-200" />
                <span className="block h-3 w-11/12 rounded-full bg-slate-200" />
                <span className="block h-3 w-3/4 rounded-full bg-slate-200" />
              </span>
            </span>
          )}

          {error && <span className="block text-sm leading-relaxed text-rose-600">{error}</span>}

          {response && (
            <span className="block space-y-3">
              {response.explanation.map((p, idx) => (
                <span key={idx} className="gc-ink block text-base font-bold leading-relaxed text-blue-900 sm:text-lg">
                  {p}
                </span>
              ))}
              {response.mathLines.map((line, idx) => (
                <span key={idx} className="block overflow-x-auto rounded-xl bg-[#fffdf5] px-3 py-2">
                  <span className="flex items-center gap-x-1 whitespace-nowrap">
                    {line.map((seg, si) =>
                      seg.type === 'text' ? (
                        <span key={si} className="gc-ink text-base font-bold text-blue-900 sm:text-lg">
                          {seg.value}
                        </span>
                      ) : seg.type === 'frac' ? (
                        <span key={si} className="mx-1 inline-flex flex-col items-center align-middle">
                          <span className="gc-ink text-sm font-bold text-blue-900">{seg.num}</span>
                          <span className="my-0.5 h-[2px] w-full min-w-4 bg-blue-900" />
                          <span className="gc-ink text-sm font-bold text-blue-900">{seg.den}</span>
                        </span>
                      ) : seg.type === 'matrix' ? (
                        <span key={si} className="mx-1 inline-block align-middle">
                          <MatrixDisplay data={seg.data} progress={1} compact />
                        </span>
                      ) : seg.type === 'matrixresult' ? (
                        <span key={si} className="mx-1 inline-block align-middle">
                          <MatrixDisplay data={seg.data} progress={1} compact />
                        </span>
                      ) : seg.type === 'matrixflow' ? (
                        <span key={si} className="mx-1 inline-block align-middle">
                          <MatrixDisplay data={seg.resultData} progress={1} compact />
                        </span>
                      ) : null
                    )}
                  </span>
                </span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Working Player – unchanged from ConsumerArithmetic2 (includes docked bar)
const formatPlayerTime = (ms) => {
  const secs = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
};

const WorkingPlayer = ({ title, steps, caption, question, lang = 'en', onProgress }) => {
  const total = useMemo(() => steps.reduce((s, p) => s + p.duration, 0), [steps]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);
  const [isDockVisible, setIsDockVisible] = useState(false);

  useEffect(() => {
    if (onProgress) onProgress(total > 0 ? clamp01(time / total) : 1);
  }, [time, total, onProgress]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let rafId;

    const tick = (now) => {
      const dt = now - last;
      last = now;
      setTime((prev) => {
        const next = prev + dt * speed;
        if (next >= total) {
          setPlaying(false);
          setIsDockVisible(false);
          return total;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, speed, total]);

  const toggle = () => {
    if (time >= total) {
      setTime(0);
      setPlaying(true);
      setIsDockVisible(true);
    } else {
      const nextPlaying = !playing;
      setPlaying(nextPlaying);
      if (nextPlaying) setIsDockVisible(true);
    }
  };

  const restart = () => {
    setTime(0);
    setPlaying(true);
    setIsDockVisible(true);
  };

  const timelinePercent = total > 0 ? (time / total) * 100 : 0;

  const withRange = useMemo(() => {
    let acc = 0;
    return steps.map(s => {
      const start = acc;
      acc += s.duration;
      return { ...s, start, end: acc };
    });
  }, [steps]);

  const rows = withRange.map(s => {
    const progress = time <= s.start ? 0 : time >= s.end ? 1 : (time - s.start) / (s.end - s.start);
    return { ...s, progress };
  });

  const activeStepIdx = rows.findIndex((r) => r.progress < 1);
  const currentStepIndex = activeStepIdx === -1 ? rows.length - 1 : activeStepIdx;

  return (
    <div className="mb-5 w-full min-w-0 max-w-full">
      {title && <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">{title}</h4>}

      <div className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-2 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
              {playing ? <Pause className="h-4 w-4 fill-white relative z-10" /> : <Play className="h-4 w-4 fill-white relative z-10" />}
              <span className="relative z-10">{playing ? (lang === 'sn' ? 'Misa' : 'PAUSE') : time >= total ? (lang === 'sn' ? 'Tanga Patsva' : 'REPLAY') : (lang === 'sn' ? 'Tanga' : 'PLAY')}</span>
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
            </button>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="hidden sm:inline">{lang === 'sn' ? 'Kumhanya' : 'Speed'}</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                aria-label="Playback speed"
              >
                <option value={0.1}>Very slow</option>
                <option value={0.2}>Slow</option>
                <option value={0.35}>Steady</option>
                <option value={0.5}>Medium</option>
                <option value={0.75}>Fast</option>
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tabular-nums text-slate-500">
            <span>{formatPlayerTime(time)}</span>
            <span className="text-slate-300">/</span>
            <span>{formatPlayerTime(total)}</span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={total}
          value={time}
          onChange={(e) => {
            setPlaying(false);
            const newTime = Number(e.target.value);
            setTime(newTime);
            if (newTime >= total) setIsDockVisible(false);
          }}
          aria-label="Working timeline"
          className="gc-timeline mt-3 block w-full cursor-pointer"
          style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
        />
      </div>

      <ol className="gc-paper relative min-w-0 overflow-hidden rounded-2xl border-2 border-b-4 border-slate-200 py-4 pl-9 pr-2 shadow-sm sm:pl-11 sm:pr-4">
        <div aria-hidden="true" className="absolute left-5 sm:left-6 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-emerald-200" />
        {rows.map((step, idx) => {
          const started = step.progress > 0;
          const writingProgress = clamp01((step.progress - 0.15) / 0.85);
          const explanationText = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;

          return (
            <li key={step.id} className="relative min-h-28 pb-8 last:pb-2">
              <span
                className={`absolute left-[-1.25rem] sm:left-[-1.5rem] top-0 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black ring-4 ring-[#fbfaf6] z-10 ${started ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}
              >
                {idx + 1}
              </span>
              <div className={`mb-3 flex max-w-4xl items-start gap-2 text-base font-medium leading-relaxed transition-opacity duration-300 ${started ? 'text-slate-700 opacity-100' : 'opacity-0'}`}>
                <p className="min-w-0 flex-1">{explanationText}</p>
                {started && (
                  <StepExplanationHelp
                    question={question}
                    stepsThroughCurrent={steps.slice(0, idx + 1)}
                    stepNumber={idx + 1}
                    lang={lang}
                  />
                )}
              </div>
              <div className="min-h-14 min-w-0 pr-2">
                <MathLine seg={step.seg} progress={writingProgress} isFinal={step.isFinal} />
              </div>
            </li>
          );
        })}
      </ol>
      {caption && <p className="mt-3 border-t border-slate-100 px-1 py-2 text-xs italic text-slate-500">{caption}</p>}

      {isDockVisible && (
        <div
          className="fixed bottom-0 left-0 lg:left-[280px] right-0 z-50 animate-in fade-in slide-in-from-bottom duration-200 border-t-2 border-emerald-500 bg-white/95 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.15)] backdrop-blur-md dark:bg-slate-900/95"
          role="region"
          aria-label="Working playback controls"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
              >
                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {playing ? <Pause className="h-4 w-4 fill-white relative z-10" /> : <Play className="h-4 w-4 fill-white relative z-10" />}
                <span className="relative z-10">{playing ? (lang === 'sn' ? 'Misa' : 'PAUSE') : time >= total ? (lang === 'sn' ? 'Tanga Patsva' : 'REPLAY') : (lang === 'sn' ? 'Tanga' : 'PLAY')}</span>
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
              </button>
              <span className="hidden sm:inline-flex items-center rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {lang === 'sn' ? `Nhanho ${currentStepIndex + 1} / ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}
              </span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                aria-label="Playback speed"
              >
                <option value={0.1}>0.1x</option>
                <option value={0.2}>0.2x</option>
                <option value={0.35}>0.35x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
              </select>
            </div>
            <div className="flex flex-1 items-center gap-3 min-w-[180px]">
              <input
                type="range"
                min={0}
                max={total}
                value={time}
                onChange={(e) => {
                  setPlaying(false);
                  const newTime = Number(e.target.value);
                  setTime(newTime);
                  if (newTime >= total) setIsDockVisible(false);
                }}
                aria-label="Working timeline"
                className="gc-timeline block flex-1 cursor-pointer"
                style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
              />
              <div className="text-xs font-semibold tabular-nums text-slate-500 shrink-0">
                <span>{formatPlayerTime(time)}</span>
                <span className="mx-1 text-slate-300">/</span>
                <span>{formatPlayerTime(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDockVisible(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition dark:hover:bg-slate-800"
              aria-label="Close docked player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Static fraction line – used for rules and answers (no matrix rendering here)
const StaticFractionLine = ({ seg, align = 'start', answer = false, compact = false }) => (
  <div className={`flex w-full min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 py-1 ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
    {seg.map((s, i) =>
      s.type === 'text' ? (
        <span key={i} className={`gc-ink min-w-0 break-words font-bold ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>
          {s.value}
        </span>
      ) :       s.type === 'frac' ? (
        <span key={i} className={`${compact ? 'mx-1.5' : 'mx-3'} inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap`}>
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.num}</span>
          <span className={`gc-frac-bar my-1 block h-[3px] rounded-full ${answer ? 'bg-emerald-700' : 'bg-slate-900'}`} style={{ width: 'calc(100% + 16px)' }} />
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.den}</span>
        </span>
      ) : s.type === 'matrix' ? (
        <span key={i} className="mx-1 inline-block max-w-[160px] min-w-0 align-middle sm:max-w-[220px]">
          <MatrixDisplay data={s.data} progress={1} compact={compact} />
        </span>
      ) : s.type === 'matrixresult' ? (
        <span key={i} className="mx-1 inline-block max-w-[160px] min-w-0 align-middle sm:max-w-[220px]">
          <MatrixDisplay data={s.data} progress={1} compact={compact} />
        </span>
      ) : s.type === 'matrixflow' ? (
        <span key={i} className="mx-1 block w-full max-w-full min-w-0 overflow-x-auto custom-scrollbar py-1 align-middle">
          <MatrixFlowDisplay
            aData={s.aData}
            bData={s.bData}
            resultData={s.resultData}
            operator={s.operator}
            label={s.label}
            progress={1}
            compact={compact}
          />
        </span>
      ) : null
    )}
  </div>
);

// Renders a worked-example question: breaks onto a new line after each full
// stop, so long questions read like normal sentences instead of one long
// horizontally-scrolling line — while still showing any inline matrices.
const QuestionLine = ({ seg }) => {
  const lines = [];
  let current = [];

  seg.forEach((s, i) => {
    if (s.type === 'text') {
      const sentences = s.value.split(/(?<=\.)\s+/).filter(Boolean);
      sentences.forEach((sentence, si) => {
        current.push(
          <span key={`${i}-${si}`} className="gc-ink font-bold text-blue-900">
            {sentence}
          </span>
        );
        if (si < sentences.length - 1) {
          lines.push(current);
          current = [];
        }
      });
    } else if (s.type === 'matrix' || s.type === 'matrixresult') {
      current.push(
        <span key={i} className="mx-1.5 inline-block align-middle">
          <MatrixDisplay data={s.data} progress={1} compact />
        </span>
      );
    } else if (s.type === 'matrixflow') {
      current.push(
        <span key={i} className="mx-1.5 inline-block align-middle">
          <MatrixDisplay data={s.resultData} progress={1} compact />
        </span>
      );
    }
  });
  lines.push(current);

  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, li) => (
        <div key={li} className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xl leading-relaxed sm:text-2xl">
          {line}
        </div>
      ))}
    </div>
  );
};

// Definition / rule box
export const DefinitionBox = ({ lines, label = 'Rule' }) => (
  <div className="my-4 w-full max-w-full overflow-hidden rounded-2xl border-2 border-b-4 border-rose-300 bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
    <span className="gc-hand block text-center text-sm font-bold uppercase tracking-wider text-rose-500">{label}</span>
    <div className="mt-3 flex flex-col gap-3">
      {lines.map((line, i) => {
        const seg = Array.isArray(line) ? line : line.seg;
        const note = Array.isArray(line) ? null : line.note;
        return (
          <div key={i} className="flex w-full flex-col gap-1.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <StaticFractionLine seg={seg} align="start" />
            </div>
            {note && (
              <p className="shrink-0 text-sm font-medium leading-snug text-slate-600 sm:max-w-[13rem] sm:text-right sm:text-[0.88rem]">
                <span className="mr-1 text-rose-400">✎</span>
                {note}
              </p>
            )}
          </div>
        );
      })}
    </div>
    <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-rose-200" />
  </div>
);

// Example card
export const ExampleCard = ({ index, example, lang = 'en' }) => {
  const [graphProgress, setGraphProgress] = useState(1);
  const answerSegs = example.answerSeg || (() => {
    // For matrices, answer may be a matrix object or text
    if (typeof example.answer === 'string') {
      return [T(example.answer)];
    } else if (Array.isArray(example.answer)) {
      // assume it's a matrix data
      return [M(example.answer)];
    }
    return [T(String(example.answer))];
  })();

  return (
    <article className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-3 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-sm">{index}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-600">
            {lang === 'sn' ? `Muenzaniso wakagadziriswa ${index}` : `Worked example ${index}`}
          </div>
          <QuestionLine seg={example.questionSeg || [T(example.question)]} />
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <div className="min-w-0">
          <WorkingPlayer
            title={lang === 'sn' ? 'Nhanho Dzekuverenga' : 'Working'}
            steps={example.steps}
            caption={example.caption}
            question={example.question}
            lang={lang}
            onProgress={example.graph ? setGraphProgress : undefined}
          />
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200">
            <span className="gc-hand text-base font-bold text-emerald-800">{lang === 'sn' ? 'Mhinduro:' : 'Answer:'}</span>
            <StaticFractionLine seg={answerSegs} align="start" answer />
          </div>
        </div>
        {example.graph && (
          <div className="mt-6 min-w-0 lg:sticky lg:top-6 lg:mt-0">
            <PlotGuide graph={example.graph} />
            <CoordinatePlaneDisplay {...example.graph} drivenProgress={graphProgress} />
          </div>
        )}
      </div>
    </article>
  );
};

// Practice zone
export const PracticeZone = ({ items }) => (
  <div className="rounded-3xl border-2 border-b-4 border-slate-800 bg-slate-900 p-5 text-white shadow-lg sm:p-7">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
      <span className="text-2xl">✍️</span> Practice Zone
    </h3>
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
          <span className="font-black text-emerald-400">{i + 1}.</span>
          <span className="gc-ink whitespace-pre-line text-lg leading-snug text-slate-200">{q}</span>
        </div>
      ))}
    </div>
  </div>
);


/* =========================================================================
   CONTENT – Geometrical Transformations
   ========================================================================= */

// Example 1: Reflection in x-axis
const ex1Reflection = {
  question: 'The vertices of a triangle are A(1;2), B(3;1) and C(-2;1). If △ABC is reflected in the x-axis, find the coordinates of the vertices of its image.',
  questionSeg: [
    T('The vertices of a triangle are A(1;2), B(3;1) and C(-2;1). If △ABC is reflected in the x-axis, find the coordinates of the vertices of its image.')
  ],
  steps: [
    mkStep(
      [T('Reflection in x-axis:', true), BR(), T('M = '), M([[1,0],[0,-1]])],
      'The x-axis reflection matrix keeps x the same and negates y.',
      { noteShona: 'Matrices yekuratidzira pa x-axis inochengeta x uye inoshandura y kuita -y.' }
    ),
    mkStep(
      [MFLOW([[1,0],[0,-1]], [[1],[2]], [[1],[-2]], '×', 'M × A =')],
      'Apply M to A.',
      { noteShona: 'Shandisa M pa A.' }
    ),
    mkStep(
      [MFLOW([[1,0],[0,-1]], [[3],[1]], [[3],[-1]], '×', 'M × B =')],
      'Apply M to B.',
      { noteShona: 'Shandisa M pa B.' }
    ),
    mkStep(
      [MFLOW([[1,0],[0,-1]], [[-2],[1]], [[-2],[-1]], '×', 'M × C =')],
      'Apply M to C.',
      { noteShona: 'Shandisa M pa C.' }
    ),
    mkStep(
      [T('Image vertices:'), BR(), T('A\' (1; -2),'), BR(), T('B\' (3; -1),'), BR(), T('C\' (-2; -1).')],
      'Final coordinates after reflection.',
      { noteShona: 'Mhinduro yekupedzisira.', isFinal: true }
    )
  ],
  answer: 'A\'(1; -2), B\'(3; -1), C\'(-2; -1)',
  answerSeg: [T('A\'(1; -2), B\'(3; -1), C\'(-2; -1)')],
  caption: 'Reflection in the x-axis negates the y-coordinate of each point.',
  graph: {
    title: 'Reflection of △ABC in the x-axis',
    xRange: [-5, 5],
    yRange: [-4, 4],
    points: [
      { x: 1, y: 2, label: 'A(1;2)', color: '#0f172a' },
      { x: 3, y: 1, label: 'B(3;1)', color: '#0f172a' },
      { x: -2, y: 1, label: 'C(-2;1)', color: '#0f172a' },
      { x: 1, y: -2, label: "A'(1;-2)", color: '#dc2626', phase: 'after' },
      { x: 3, y: -1, label: "B'(3;-1)", color: '#dc2626', phase: 'after' },
      { x: -2, y: -1, label: "C'(-2;-1)", color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 1, y: 2 }, { x: 3, y: 1 }, { x: -2, y: 1 }], color: '#0f172a', fillOpacity: 0.15 },
      { points: [{ x: 1, y: -2 }, { x: 3, y: -1 }, { x: -2, y: -1 }], color: '#dc2626', fillOpacity: 0.15, dashed: true, phase: 'after' }
    ],
    caption: 'Triangle ABC (blue) reflected in the x-axis gives triangle A\'B\'C\' (red).'
  }
};

// Example 2: Translation then rotation
const ex2TranslationRotation = {
  question: 'Triangle XYZ has vertices at X(3;4), Y(5;-1), Z(-2;2). Find the coordinates of the image of X, Y, Z if the triangle is first translated by vector (-2;7) and then rotated through 180° about the origin.',
  questionSeg: [
    T('Triangle XYZ has vertices at X(3;4), Y(5;-1), Z(-2;2). Find the coordinates of the image of X, Y, Z if the triangle is first translated by vector (-2;7) and then rotated through 180° about the origin.')
  ],
  steps: [
    mkStep(
      [T('Translate each point by (-2,7): X\' = (3-2, 4+7) = (1,11), Y\' = (5-2, -1+7) = (3,6), Z\' = (-2-2, 2+7) = (-4,9).')],
      'Add translation vector to each coordinate.',
      { noteShona: 'Wedzera translation vector kune yega yega point.' }
    ),
    mkStep(
      [T('Rotation 180° matrix R = '), M([[-1,0],[0,-1]])],
      '180° rotation about origin negates both coordinates.',
      { noteShona: 'Kutenderera 180° kunoshandura zvinhu zvese kuva negative.' }
    ),
    mkStep(
      [MFLOW([[-1,0],[0,-1]], [[1,3,-4],[11,6,9]], [[-1,-3,4],[-11,-6,-9]], '×', 'R × [X\' Y\' Z\'] =')],
      'Apply R to the matrix of translated points.',
      { noteShona: 'Shandisa R pa matrix ye points dzakatenderedzwa.' }
    ),
    mkStep(
      [T('Final image: X\'\'(-1; -11), Y\'\'(-3; -6), Z\'\'(4; -9).')],
      'Result after combined transformation.',
      { noteShona: 'Mhinduro yekupedzisira.', isFinal: true }
    )
  ],
  answer: 'X\'\'(-1; -11), Y\'\'(-3; -6), Z\'\'(4; -9)',
  answerSeg: [T('X\'\'(-1; -11), Y\'\'(-3; -6), Z\'\'(4; -9)')],
  caption: 'Order matters: translate first, then rotate.',
  graph: {
    title: 'Triangle XYZ: translate then rotate 180°',
    xRange: [-12, 12],
    yRange: [-13, 13],
    points: [
      { x: 3, y: 4, label: 'X(3;4)', color: '#0f172a' },
      { x: 5, y: -1, label: 'Y(5;-1)', color: '#0f172a' },
      { x: -2, y: 2, label: 'Z(-2;2)', color: '#0f172a' },
      { x: -1, y: -11, label: "X''(-1;-11)", color: '#dc2626', phase: 'after' },
      { x: -3, y: -6, label: "Y''(-3;-6)", color: '#dc2626', phase: 'after' },
      { x: 4, y: -9, label: "Z''(4;-9)", color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 3, y: 4 }, { x: 5, y: -1 }, { x: -2, y: 2 }], color: '#0f172a', fillOpacity: 0.15 },
      { points: [{ x: -1, y: -11 }, { x: -3, y: -6 }, { x: 4, y: -9 }], color: '#dc2626', fillOpacity: 0.15, dashed: true, phase: 'after' }
    ],
    caption: 'Triangle XYZ (blue) after translation then 180° rotation gives X\'\'Y\'\'Z\'\' (red).'
  }
};

// Example 3: Enlargement
const ex3Enlargement = {
  question: 'Quadrilateral OABC has vertices O(0;0), A(6;-1), B(-4;2), C(9;9). OABC is enlarged with scale factor 1/3 with the origin as centre. Find the coordinates of its enlargement O\'A\'B\'C\'.',
  questionSeg: [
    T('Quadrilateral OABC has vertices O(0;0), A(6;-1), B(-4;2), C(9;9). OABC is enlarged with scale factor 1/3 with the origin as centre. Find the coordinates of its enlargement O\'A\'B\'C\'.')
  ],
  steps: [
    mkStep(
      [T('Enlargement scale factor 1/3 about origin: E = '), M([[1/3,0],[0,1/3]])],
      'Enlargement matrix is kI.',
      { noteShona: 'Matrix yekukudza ndeye kI.' }
    ),
    mkStep(
      [MFLOW([[1/3,0],[0,1/3]], [[0,6,-4,9],[0,-1,2,9]], [[0,2,-4/3,3],[0,-1/3,2/3,3]], '×', 'E × vertices =')],
      'Apply E to each vertex.',
      { noteShona: 'Shandisa E pa vertex yega yega.' }
    ),
    mkStep(
      [T('Image vertices: O\'(0;0), A\'(2; -1/3), B\'(-4/3; 2/3), C\'(3; 3).')],
      'Result of enlargement.',
      { noteShona: 'Mhinduro yekukudza.', isFinal: true }
    )
  ],
  answer: 'O\'(0;0), A\'(2; -1/3), B\'(-4/3; 2/3), C\'(3; 3)',
  answerSeg: [T('O\'(0;0), A\'(2; -1/3), B\'(-4/3; 2/3), C\'(3; 3)')],
  caption: 'Enlargement by factor k multiplies all coordinates by k.',
  graph: {
    title: 'Quadrilateral OABC enlarged by factor 1/3',
    xRange: [-6, 10],
    yRange: [-3, 10],
    points: [
      { x: 0, y: 0, label: 'O', color: '#0f172a' },
      { x: 6, y: -1, label: 'A(6;-1)', color: '#0f172a' },
      { x: -4, y: 2, label: 'B(-4;2)', color: '#0f172a' },
      { x: 9, y: 9, label: 'C(9;9)', color: '#0f172a' },
      { x: 2, y: -0.333, label: "A'(2;-1/3)", color: '#dc2626', phase: 'after' },
      { x: -1.333, y: 0.667, label: "B'(-4/3;2/3)", color: '#dc2626', phase: 'after' },
      { x: 3, y: 3, label: "C'(3;3)", color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 0, y: 0 }, { x: 6, y: -1 }, { x: 9, y: 9 }, { x: -4, y: 2 }], color: '#0f172a', fillOpacity: 0.12 },
      { points: [{ x: 0, y: 0 }, { x: 2, y: -0.333 }, { x: 3, y: 3 }, { x: -1.333, y: 0.667 }], color: '#dc2626', fillOpacity: 0.15, dashed: true, phase: 'after' }
    ],
    caption: 'OABC (blue) enlarged with scale factor 1/3 about the origin gives O\'A\'B\'C\' (red).'
  }
};

// Example 4: Shear
const ex4Shear = {
  question: 'G is a transformation represented by the matrix [[1,-2],[0,1]]. (a) Find the image of (4;3) under G. (b) Find the image of (4;-3) under G. (c) Describe, completely, the transformation G.',
  questionSeg: [
    T('G is a transformation represented by the matrix '), M([[1,-2],[0,1]]),
    T('. (a) Find the image of (4;3) under G. (b) Find the image of (4;-3) under G. (c) Describe, completely, the transformation G.')
  ],
  steps: [
    mkStep(
      [MFLOW([[1,-2],[0,1]], [[4],[3]], [[-2],[3]], '×', 'G × (4,3) =')],
      'Apply G to (4,3).',
      { noteShona: 'Shandisa G pa (4,3).' }
    ),
    mkStep(
      [MFLOW([[1,-2],[0,1]], [[4],[-3]], [[10],[-3]], '×', 'G × (4,-3) =')],
      'Apply G to (4,-3).',
      { noteShona: 'Shandisa G pa (4,-3).' }
    ),
    mkStep(
      [T('This is a shear parallel to the x-axis with shear factor -2; the x-axis is invariant.')],
      'Describe the transformation.',
      { noteShona: 'Iyi ishear inoenderana ne x-axis ine shear factor -2; x-axis haichinji.', isFinal: true }
    )
  ],
  answer: '(a) (-2;3), (b) (10;-3), (c) shear parallel to x-axis, factor -2',
  answerSeg: [
    T('(a) (-2;3), (b) (10;-3), (c) shear parallel to x-axis, factor -2')
  ],
  caption: 'Shear matrix [[1,k],[0,1]] shifts points horizontally by k times their y-coordinate.',
  graph: {
    title: 'Fig 14.8 — Shear G on the segment (4;3) to (4;-3)',
    xRange: [-4, 11],
    yRange: [-5, 5],
    points: [
      { x: 4, y: 3, label: '(4;3)', color: '#0f172a' },
      { x: 4, y: -3, label: '(4;-3)', color: '#0f172a' },
      { x: -2, y: 3, label: "(-2;3)", color: '#dc2626', phase: 'after' },
      { x: 10, y: -3, label: "(10;-3)", color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 4, y: 3 }, { x: 4, y: -3 }], color: '#0f172a', fillOpacity: 0 },
      { points: [{ x: -2, y: 3 }, { x: 10, y: -3 }], color: '#dc2626', fillOpacity: 0, dashed: true, phase: 'after' }
    ],
    caption: 'The vertical segment (blue) becomes the slanted segment (red) after the shear G.'
  }
};

// Example 5: Stretch and inverse
const ex5Stretch = {
  question: 'A\'(0;0), B\'(-5;6), C\'(-2;-9) are the images of A(0;0), B(5;2), C(2;-3) under a transformation represented by a matrix of the form [[a,0],[0,b]]. (a) Find the transformation matrix. (b) Find the matrix which will transform △A\'B\'C\' back to △ABC.',
  questionSeg: [
    T('A\'(0;0), B\'(-5;6), C\'(-2;-9) are the images of A(0;0), B(5;2), C(2;-3) under a transformation represented by a matrix of the form '), M([['a',0],[0,'b']]),
    T('. (a) Find the transformation matrix. (b) Find the matrix which will transform △A\'B\'C\' back to △ABC.')
  ],
  steps: [
    mkStep(
      [T('Using B(5;2) → B\'(-5;6): 5a = -5 ⇒ a = -1; 2b = 6 ⇒ b = 3.')],
      'Solve for a and b from the image of B.',
      { noteShona: 'Tsvaga a na b kubva pamufananidzo we B.' }
    ),
    mkStep(
      [T('Transformation matrix S = '), M([[-1,0],[0,3]])],
      'Stretch matrix found.',
      { noteShona: 'Matrix yakawanikwa.' }
    ),
    mkStep(
      [T('Inverse of S: S⁻¹ = '), M([[-1,0],[0,1/3]])],
      'Inverse of diagonal matrix is reciprocal of diagonal entries.',
      { noteShona: 'Inverse ye diagonal matrix ndeye reciprocal ye diagonal entries.', isFinal: true }
    )
  ],
  answer: '(a) [[-1,0],[0,3]] (b) [[-1,0],[0,1/3]]',
  answerSeg: [
    T('(a) '), M([[-1,0],[0,3]]),
    T('      (b) '), M([[-1,0],[0,1/3]])
  ],
  caption: 'Stretch matrix diag(h,k) maps (x,y) to (hx, ky). Its inverse is diag(1/h, 1/k).',
  graph: {
    title: 'Triangle ABC stretched to A\'B\'C\'',
    xRange: [-7, 7],
    yRange: [-11, 8],
    points: [
      { x: 0, y: 0, label: 'A(0;0)', color: '#0f172a' },
      { x: 5, y: 2, label: 'B(5;2)', color: '#0f172a' },
      { x: 2, y: -3, label: 'C(2;-3)', color: '#0f172a' },
      { x: 0, y: 0, label: "A'(0;0)", color: '#dc2626', phase: 'after' },
      { x: -5, y: 6, label: "B'(-5;6)", color: '#dc2626', phase: 'after' },
      { x: -2, y: -9, label: "C'(-2;-9)", color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 0, y: 0 }, { x: 5, y: 2 }, { x: 2, y: -3 }], color: '#0f172a', fillOpacity: 0.15 },
      { points: [{ x: 0, y: 0 }, { x: -5, y: 6 }, { x: -2, y: -9 }], color: '#dc2626', fillOpacity: 0.15, dashed: true, phase: 'after' }
    ],
    caption: 'Triangle ABC (blue) is stretched by S = diag(-1,3) to A\'B\'C\' (red).'
  }
};

// Example 6: Combined enlargement and translation
const ex6Combined = {
  question: 'Triangle OAB has vertices O(0;0), A(2;1), B(0;2). It is enlarged by factor 2 with origin as centre, then translated by vector (-3;-5). Find the coordinates of the image.',
  questionSeg: [
    T('Triangle OAB has vertices O(0;0), A(2;1), B(0;2). It is enlarged by factor 2 with origin as centre, then translated by vector (-3;-5). Find the coordinates of the image.')
  ],
  steps: [
    mkStep(
      [T('Enlargement E = '), M([[2,0],[0,2]])],
      'Enlargement by factor 2.',
      { noteShona: 'Kukudza ne factor 2.' }
    ),
    mkStep(
      [MFLOW([[2,0],[0,2]], [[0,2,0],[0,1,2]], [[0,4,0],[0,2,4]], '×', 'E × vertices =')],
      'Apply enlargement to all vertices.',
      { noteShona: 'Shandisa E pane vertex dzese.' }
    ),
    mkStep(
      [T('After enlargement: O\'(0;0), A\'(4;2), B\'(0;4). Translate by (-3;-5): O\'\' = (-3;-5), A\'\' = (1;-3), B\'\' = (-3;-1).')],
      'Add translation vector to each enlarged point.',
      { noteShona: 'Wedzera translation vector kune yega yega point yakakudzwa.' }
    ),
    mkStep(
      [T('Final image: O\'\'(-3;-5), A\'\'(1;-3), B\'\'(-3;-1).')],
      'Result of combined transformation.',
      { noteShona: 'Mhinduro yekupedzisira.', isFinal: true }
    )
  ],
  answer: 'O\'\'(-3;-5), A\'\'(1;-3), B\'\'(-3;-1)',
  answerSeg: [T('O\'\'(-3;-5), A\'\'(1;-3), B\'\'(-3;-1)')],
  caption: 'Combined transformation: apply enlargement first, then translation.',
  graph: {
    title: 'Triangle OAB enlarged then translated',
    xRange: [-6, 6],
    yRange: [-7, 5],
    points: [
      { x: 0, y: 0, label: 'O', color: '#0f172a' },
      { x: 2, y: 1, label: 'A(2;1)', color: '#0f172a' },
      { x: 0, y: 2, label: 'B(0;2)', color: '#0f172a' },
      { x: -3, y: -5, label: "O''(-3;-5)", color: '#dc2626', phase: 'after' },
      { x: 1, y: -3, label: "A''(1;-3)", color: '#dc2626', phase: 'after' },
      { x: -3, y: -1, label: "B''(-3;-1)", color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 0, y: 0 }, { x: 2, y: 1 }, { x: 0, y: 2 }], color: '#0f172a', fillOpacity: 0.15 },
      { points: [{ x: -3, y: -5 }, { x: 1, y: -3 }, { x: -3, y: -1 }], color: '#dc2626', fillOpacity: 0.15, dashed: true, phase: 'after' }
    ],
    caption: 'Triangle OAB (blue) enlarged by factor 2 then translated by (-3;-5) gives O\'\'A\'\'B\'\' (red).'
  }
};

// Example 7: Combined reflection and shear
const ex7Combined = {
  question: 'The rhombus whose vertices are at (0;0), (1;2), (3;3) and (2;1) is first reflected in the x-axis and then sheared by the operator [[1,2],[0,1]]. Find the vertices of the resulting figure.',
  questionSeg: [
    T('The rhombus whose vertices are at (0;0), (1;2), (3;3) and (2;1) is first reflected in the x-axis and then sheared by the operator '), M([[1,2],[0,1]]),
    T('. Find the vertices of the resulting figure.')
  ],
  steps: [
    mkStep(
      [T('Reflection M = '), M([[1,0],[0,-1]]), T('; Shear H = '), M([[1,2],[0,1]])],
      'Write down the two matrices.',
      { noteShona: 'Nyora matrix mbiri.' }
    ),
    mkStep(
      [T('Combined matrix HM = '), M([[1,2],[0,1]]), T(' × '), M([[1,0],[0,-1]]), T(' = '), M([[1,-2],[0,-1]])],
      'Multiply H by M (order: M first, then H).',
      { noteShona: 'Wanza H na M (M kutanga, H kevera).' }
    ),
    mkStep(
      [MFLOW([[1,-2],[0,-1]], [[0,1,3,2],[0,2,3,1]], [[0,-3,-3,0],[0,-2,-3,-1]], '×', 'HM × vertices =')],
      'Apply combined matrix to the vertices.',
      { noteShona: 'Shandisa matrix yakasanganiswa kune vertices.' }
    ),
    mkStep(
      [T('Resulting vertices: (0;0), (-3;-2), (-3;-3), (0;-1).')],
      'Final coordinates.',
      { noteShona: 'Mhinduro yekupedzisira.', isFinal: true }
    )
  ],
  answer: '(0;0), (-3;-2), (-3;-3), (0;-1)',
  answerSeg: [T('(0;0), (-3;-2), (-3;-3), (0;-1)')],
  caption: 'When combining transformations, the matrix product is applied in the reverse order of the operations.',
  graph: {
    title: 'Fig 14.14 — Rhombus reflected then sheared',
    xRange: [-5, 5],
    yRange: [-5, 4],
    points: [
      { x: 0, y: 0, label: '(0;0)', color: '#0f172a' },
      { x: 1, y: 2, label: '(1;2)', color: '#0f172a' },
      { x: 3, y: 3, label: '(3;3)', color: '#0f172a' },
      { x: 2, y: 1, label: '(2;1)', color: '#0f172a' },
      { x: -3, y: -2, label: '(-3;-2)', color: '#dc2626', phase: 'after' },
      { x: -3, y: -3, label: '(-3;-3)', color: '#dc2626', phase: 'after' },
      { x: 0, y: -1, label: '(0;-1)', color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 0, y: 0 }, { x: 1, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 1 }], color: '#0f172a', fillOpacity: 0.15 },
      { points: [{ x: 0, y: 0 }, { x: -3, y: -2 }, { x: -3, y: -3 }, { x: 0, y: -1 }], color: '#dc2626', fillOpacity: 0.15, dashed: true, phase: 'after' }
    ],
    caption: 'The rhombus (blue) reflected in the x-axis then sheared gives the red figure.'
  }
};

// Example 8: Stretch then translation described by a single equation
const ex8Combined = {
  question: '(a,b) is the image of a point (a;b) after a transformation given by [[4,0],[0,3]] (a;b) + (-7;-2). (a) Describe the transformation in words. (b) A\' is the image of A(-1;2). Find the coordinates of A\'. (c) Find the coordinates of a point B which has an image at B\'(5;-5).',
  questionSeg: [
    T('(a,b) is the image of a point (a;b) after a transformation given by '), M([[4,0],[0,3]]),
    T('(a;b) + (-7;-2). (a) Describe the transformation in words. (b) A\' is the image of A(-1;2). Find the coordinates of A\'. (c) Find the coordinates of a point B which has an image at B\'(5;-5).')
  ],
  steps: [
    mkStep(
      [T('First, stretch by factor 4 in x-direction and 3 in y-direction; then translate by (-7;-2).')],
      'Description of the transformation.',
      { noteShona: 'Kutanga, kukudza ne 4 mu x uye 3 mu y; kozoti shandura ne (-7;-2).' }
    ),
    mkStep(
      [MFLOW([[4,0],[0,3]], [[-1],[2]], [[-4],[6]], '×', 'Stretch part ='),
       T(' then add (-7;-2) gives (-11;4).')],
      'Apply stretch to A(-1;2), then translate.',
      { noteShona: 'Shandisa kukudza pa A(-1;2), kozoti shandura.' }
    ),
    mkStep(
      [T('Let B = (h;k). Then [[4h-7, 3k-2]] = (5;-5). Solve: 4h-7=5 ⇒ h=3; 3k-2=-5 ⇒ k=-1. So B=(3;-1).')],
      'Solve for B using the inverse of the affine transformation.',
      { noteShona: 'Tsvaga B uchishandisa inverse ye affine transformation.', isFinal: true }
    )
  ],
  answer: '(a) stretch by 4 in x, 3 in y, then translate (-7,-2); (b) A\'(-11;4); (c) B(3;-1)',
  answerSeg: [
    T('(a) stretch by 4 in x, 3 in y, then translate (-7,-2); (b) A\'(-11;4); (c) B(3;-1)')
  ],
  caption: 'Affine transformations combine linear and translation parts.',
  graph: {
    title: 'Stretch-and-translate: A → A\', B → B\'',
    xRange: [-14, 8],
    yRange: [-7, 7],
    points: [
      { x: -1, y: 2, label: 'A(-1;2)', color: '#0f172a' },
      { x: 3, y: -1, label: 'B(3;-1)', color: '#0f172a' },
      { x: -11, y: 4, label: "A'(-11;4)", color: '#dc2626', phase: 'after' },
      { x: 5, y: -5, label: "B'(5;-5)", color: '#dc2626', phase: 'after' }
    ],
    vectors: [
      { from: { x: -1, y: 2 }, to: { x: -11, y: 4 }, color: '#dc2626' },
      { from: { x: 3, y: -1 }, to: { x: 5, y: -5 }, color: '#dc2626' }
    ],
    caption: 'A and B (blue) map to A\' and B\' (red) under the stretch-then-translate rule.'
  }
};

/* =========================================================================
   SECTIONS & THEMES
   ========================================================================= */
const sectionThemes = {
  'intro-transforms': {
    bgGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
    borderColor: 'border-b-4 border-sky-700',
    badgeBg: 'bg-sky-400/30 text-white border border-sky-200/40',
    navActiveBg: 'bg-sky-500 border-b-4 border-sky-700 text-white shadow-sm',
    cardBorder: 'border-sky-300'
  },
  'enlargement-shear-stretch': {
    bgGradient: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600',
    borderColor: 'border-b-4 border-emerald-700',
    badgeBg: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    navActiveBg: 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm',
    cardBorder: 'border-emerald-300'
  },
  'combined-transformations': {
    bgGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    borderColor: 'border-b-4 border-amber-700',
    badgeBg: 'bg-amber-400/30 text-white border border-amber-200/40',
    navActiveBg: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm',
    cardBorder: 'border-amber-300'
  },
  'exercises': {
    bgGradient: 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600',
    borderColor: 'border-b-4 border-rose-700',
    badgeBg: 'bg-rose-400/30 text-white border border-rose-200/40',
    navActiveBg: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm',
    cardBorder: 'border-rose-300'
  }
};

const sections = [
  {
    id: 'intro-transforms',
    eyebrow: 'Chapter 14.1',
    title: 'Translation, Rotation, Reflection',
    heading: 'Basic Matrix Transformations',
    intro: 'Translation adds a vector; rotation and reflection are linear transformations represented by matrices. The identity matrix I leaves points unchanged.',
    introShona: 'Kushandura kunowedzera vector; kutenderera uye kuratidzira zvinomiririrwa nematrix. Identity matrix I inosiya mapoinzi asina kuchinjika.',
    concept: {
      title: 'What is a geometrical transformation?',
      paragraphs: [
        'A point on the plane can be described by its position vector — for example, the point (3;4) has position vector OA. A transformation moves that point to a new position, called its image, usually written with a prime: A\'.',
        'A translation just adds a fixed vector to every point — it slides the whole shape without turning or resizing it.',
        'A rotation and a reflection are both linear transformations, meaning they can be written as a 2×2 matrix multiplying the position vector. Below, watch how the point A(1;2) is reflected in the x-axis to give A\'(1;-2) — the x stays the same, only the y-coordinate flips sign.'
      ],
      graph: {
        title: 'Fig — Reflection of A(1;2) in the x-axis',
        xRange: [-4, 4],
        yRange: [-4, 4],
        points: [
          { x: 1, y: 2, label: 'A(1;2)', color: '#0f172a' },
          { x: 1, y: -2, label: "A'(1;-2)", color: '#dc2626', phase: 'after' }
        ],
        vectors: [
          { from: { x: 1, y: 2 }, to: { x: 1, y: -2 }, color: '#dc2626', label: '' }
        ],
        caption: 'Reflecting A(1;2) in the x-axis gives A\'(1;-2): x unchanged, y negated.'
      }
    },
    rules: [
      [
        { seg: [T('Translation: T(a) = a + t')], note: 'Add vector t to every point.' },
        { seg: [T('Rotation 90° clockwise: '), M([[0,1],[-1,0]])], note: 'Matrix for 90° clockwise about origin.' },
        { seg: [T('Reflection in x-axis: '), M([[1,0],[0,-1]])], note: 'Negate y-coordinate.' },
        { seg: [T('Reflection in y-axis: '), M([[-1,0],[0,1]])], note: 'Negate x-coordinate.' }
      ]
    ],
    examples: [
      {
        question: 'Watch how each rule transforms a general point (x, y).',
        questionSeg: [T('Watch how each rule transforms a general point (x, y).')],
        steps: [
          mkStep(
            [MFLOW([[0,1],[-1,0]], [['x'],['y']], [['y'],['-x']], '×', 'Rotate 90° cw:')],
            'x and y swap, and the new x becomes negative.',
            { noteShona: 'x na y vanochinjana, uye x itsva inova negative.', duration: 5000 }
          ),
          mkStep(
            [MFLOW([[1,0],[0,-1]], [['x'],['y']], [['x'],['-y']], '×', 'Reflect in x-axis:')],
            'x stays the same, y flips sign.',
            { noteShona: 'x inoramba yakadaro, y inochinja sign.', duration: 5000, isFinal: true }
          )
        ],
        answer: '(y, -x) for rotation; (x, -y) for reflection',
        answerSeg: [T('(y, -x) for rotation; (x, -y) for reflection')],
        caption: 'A quick visual for how the rule matrices act on a general point.'
      },
      ex1Reflection, ex2TranslationRotation
    ],
    practice: [
      'If T represents translation (2;3), find T((5; -1)).',
      'Write the matrix for reflection in the line y = x.',
      'A point (4; -2) is rotated 90° clockwise about origin. Find its image.',
      'The vertices of a square are (0;0), (2;0), (2;2), (0;2). Reflect it in the x-axis and give the new coordinates.'
    ]
  },
  {
    id: 'enlargement-shear-stretch',
    eyebrow: 'Chapter 14.2',
    title: 'Enlargement, Shear, Stretch',
    heading: 'Non-rigid Transformations',
    intro: 'Enlargement scales all coordinates uniformly; shear shifts points parallel to an axis; stretch scales independently in x and y directions.',
    introShona: 'Kukudza kunowedzera zvese zvakaenzana; shear inosundira mapoinzi zvakafanana ne axis; stretch inowedzera zvakasiyana mu x ne y.',
    concept: {
      title: 'Enlargement, shear and stretch — what changes and what stays fixed',
      paragraphs: [
        'An enlargement scales every coordinate by the same factor k, with the origin as centre — the shape grows or shrinks but keeps its proportions.',
        'A shear parallel to the x-axis keeps the x-axis fixed (invariant) and shifts every other point sideways by an amount proportional to its y-coordinate. The further a point is from the x-axis, the further it shifts.',
        'A stretch scales x and y by different factors — one direction grows more than the other, so the shape distorts.',
        'Below is the shear matrix [[1,k],[0,1]] with shear factor k = -2, acting on the segment joining (-2;3) to (4;-3) — notice the x-axis stays put while the rest of the line shifts.'
      ],
      graph: {
        title: 'Fig 14.8 — Shear parallel to the x-axis, factor -2',
        xRange: [-6, 11],
        yRange: [-5, 5],
        points: [
          { x: -2, y: 3, label: '(-2;3)', color: '#0f172a' },
          { x: 4, y: -3, label: '(4;-3)', color: '#0f172a' },
          { x: 4, y: 3, label: '(4;3)', color: '#0f172a' },
          { x: 10, y: -3, label: "(10;-3)", color: '#dc2626', phase: 'after' }
        ],
        shapes: [
          { points: [{ x: -2, y: 3 }, { x: 4, y: -3 }], color: '#0f172a', dashed: false, fillOpacity: 0 },
          { points: [{ x: -2, y: 3 }, { x: 10, y: -3 }], color: '#dc2626', dashed: true, fillOpacity: 0, phase: 'after' }
        ],
        caption: 'The x-axis stays invariant; every other point shifts left or right by k × its y-coordinate.'
      }
    },
    rules: [
      [
        { seg: [T('Enlargement: kI = '), M([['k',0],[0,'k']])], note: 'Scale factor k about origin.' },
        { seg: [T('Shear parallel to x-axis: '), M([[1,'k'],[0,1]])], note: 'Shift x by k*y.' },
        { seg: [T('Stretch: '), M([['h',0],[0,'k']])], note: 'Scale x by h, y by k.' }
      ]
    ],
    examples: [ex3Enlargement, ex4Shear, ex5Stretch],
    practice: [
      'Enlarge the point (3; -2) by factor 2 about origin.',
      'Shear the point (1; 3) by factor 4 parallel to x-axis.',
      'A stretch matrix [[2,0],[0,3]] maps (5; -1) to what?',
      'Find the inverse of the stretch matrix [[-2,0],[0,4]] if it exists.'
    ]
  },
  {
    id: 'combined-transformations',
    eyebrow: 'Chapter 14.3',
    title: 'Combined Transformations',
    heading: 'Composition of Matrix Transformations',
    intro: 'When multiple transformations are applied, the combined matrix is the product of the individual matrices in the reverse order of application.',
    introShona: 'Kana shanduko dzakawanda dzichiitwa, matrix yakaunganidzwa inova chibereko che matrix yega yega mumashure mekushandisa.',
    rules: [
      [
        { seg: [T('If T1 then T2, combined matrix = T2 × T1')], note: 'Order matters: matrix multiplication is not commutative.' },
        { seg: [T('Affine transformation: x\' = Mx + t')], note: 'Linear part M plus translation t.' }
      ]
    ],
    examples: [ex6Combined, ex7Combined, ex8Combined],
    practice: [
      'First rotate 90° clockwise, then reflect in y-axis. Find the combined matrix.',
      'A point (2; -3) is first sheared by [[1,2],[0,1]] then enlarged by factor 2. Find its image.',
      'If T is translation (5; -1) and R is reflection in x-axis, find the image of (3; 4) under R followed by T.',
      'Find the single matrix that represents a 180° rotation and then translation (2; -1).'
    ]
  },
  {
    id: 'exercises',
    eyebrow: 'Practice',
    title: 'Exercise 14a, 14b, 14c',
    heading: 'Mixed Exercises on Transformations',
    intro: 'Consolidate your understanding with these exercises covering all transformation types and combined operations.',
    introShona: 'Simbisisa nzwisiso yako nezviedzo izvi zvinosanganisira mhando dzese dzeshanduko uye mabasa akasanganiswa.',
    examples: [],
    practice: [
      'Copy and complete Table 14.1: identity, reflection in x-axis, reflection in y-axis, rotation of 180° about origin.',
      'Find the matrices for anticlockwise rotations of (a) 90°, (b) 270° about the origin.',
      'A triangle has vertices (1,1), (2,4), (3,7). Rotate it 90° clockwise about origin. Give the new coordinates.',
      'P\'Q\' is the image of line PQ after translation (7; -4). If P\' is (6,1), find P.',
      'Triangle with vertices A(0,0), B(1,-1), C(1,1) is rotated 180° about origin. Find new vertices.',
      'Reflect the triangle from question 5 about the y-axis. Compare answers.',
      'In Fig 14.5, (a) find translation vector for A₁B₁C₁, (b) find rotation angle and matrix for A₂B₂C₂, (c) find equation of line through B₃ and C₃ under reflection [[1,0],[0,-1]].',
      'Triangle XYZ with X(1,1), Y(4,2), Z(2,3) is rotated 180° then translated (3;5). Find image coordinates.',
      'T = (3;-1) and R = clockwise 90°. Given A(-5;2) and B(4;-3), find (a) T(A), (b) R(B), (c) point C such that T then R maps C to (6;-2).',
      'Use matrix [[-3,0],[0,-3]] to enlarge triangle ABC in Fig 14.10.',
      'Use matrix [[1,3],[0,1]] to shear triangle ABC in Fig 14.10. Find the inverse matrix.',
      'Use matrix [[2,0],[0,5]] to transform triangle ABC. Describe fully.',
      'Find matrix E for enlargement by scale factor 1.5 about origin.',
      'Use E to enlarge rectangle with vertices (0,0), (3,0), (0,2), (3,2).',
      'Matrix [[1,0],[5,1]] represents transformation H. (a) Find image of (2;5). (b) Image of (-2;5). (c) Describe H.',
      'In Fig 14.11, KLM mapped to K\'L\'M\' by two-way stretch S. (a) Find stretch factor in x-direction. (b) y-direction. (c) Find matrix S.',
      'A single transformation U maps triangle PQR to P₁Q₁R₁ with P₁(0;16), Q₁(12;20), R₁(8;2). Describe U and its matrix.',
      'Triangle XYZ in Fig 14.15 is first rotated 90° anticlockwise then sheared by [[1,2],[0,1]]. Find image vertices.',
      'Use matrix [[1,0],[0,1]] to shear triangle XYZ, then reflect in y-axis. Find final image.',
      'For each equation, describe and find image of (-1;4): (a) x\' = [[4,0],[0,4]]x + (-3;1), (b) x\' = [[2,0],[0,3]] [[1,3],[0,1]]x.',
      'T = (2;8), S = [[-2,0],[0,3]]. Find image of A(3;2) under: (a) ST, (b) TS, (c) S⁻¹T.',
      'R = clockwise 270°, H = [[1,-2],[0,1]]. Find image of P(-3;5) under: (a) RH, (b) HR, (c) H².',
      'Semicircle A mapped to B by anticlockwise rotation then translation. (a) angle, (b) rotation matrix, (c) translation vector, (d) equation of reflection line m.',
      'Semicircle C is image of A under TE(A)=C where E enlargement and T translation. (a) scale factor, (b) E matrix, (c) T vector, (d) if ET(A)=C with same E, find new T.',
      'Translate by (-1;3) then shear by [[1,0],[0,3]]. Show image of (a,b) is (a-1; 3a+b). Find image of origin.',
      'Transformation: x\' = [[1,4],[0,1]]x + (-1;5). (a) image of O(0;0), (b) image of A(3;2), (c) if B\'(7;8) is image of B(m;n), find m,n.',
      'Graph paper question: draw axes, triangle X with vertices (2;4), (4;4), (4;1). (b) U maps X to (6;12), (12;12), (12;3). Describe U. (c) R = clockwise 90°; draw R(X). (d) T = (-8;4); draw T(X) and RT(X). (e) V = [[0,-1],[-1,0]]; draw V(X) and describe V.'
    ]
  }
];

/* =========================================================================
   SECTION COMPONENT (same as Matrices2)
   ========================================================================= */
const Section = ({ section, lang = 'en' }) => {
  return (
    <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
      <div className="mb-5">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-600">{section.eyebrow}</span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{section.heading}</h2>
      </div>

      <div className="mb-6">
        <p className="mb-4 leading-relaxed text-slate-700 text-base sm:text-lg">
          {lang === 'sn' && section.introShona ? section.introShona : section.intro}
        </p>

        {section.concept && (
          <ConceptIntro
            title={section.concept.title}
            paragraphs={section.concept.paragraphs}
            graph={section.concept.graph}
          />
        )}

        {section.rules && section.rules.length > 0 && (
          <div className="mb-6 space-y-3">
            {section.rules.map((r, i) => (
              <DefinitionBox key={i} label={section.rules.length > 1 ? `Rule ${i+1}` : 'Rule'} lines={r} />
            ))}
          </div>
        )}
      </div>

      {section.examples && section.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
            {lang === 'sn' ? 'Mienzaniso Yakagadziriswa' : 'Worked Examples'}
          </h3>
          {section.examples.map((ex, i) => (
            <ExampleCard key={i} index={i + 1} example={ex} lang={lang} />
          ))}
        </div>
      )}

      {section.practice && section.practice.length > 0 && (
        <PracticeZone items={section.practice} />
      )}
    </section>
  );
};

/* =========================================================================
   MAIN COMPONENT – GeometricalTransformations3
   ========================================================================= */
export const GeometricalTransformations3 = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState('en');

  const activeIndex = Math.max(0, sections.findIndex(s => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];
  const activeTheme = sectionThemes[activeSection.id] || sectionThemes['intro-transforms'];

  const handleNavigate = (id) => {
    setActive(id);
    requestAnimationFrame(() => {
      const lessonScrollArea = document.getElementById('lesson-scroll-area');
      if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };

  const goNext = () => {
    const n = sections[activeIndex + 1];
    if (n) handleNavigate(n.id);
  };
  const goPrev = () => {
    const p = sections[activeIndex - 1];
    if (p) handleNavigate(p.id);
  };

  return (
    <div id="fa-scroll-area" className="min-h-screen w-full bg-[#f8fafc] pb-24 font-sans text-slate-900">
      <InkStyles />

      {/* Top Banner */}
      <div className={`relative overflow-hidden transition-all duration-300 ${activeTheme.bgGradient} ${activeTheme.borderColor} pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${activeTheme.badgeBg}`}>
                CHAPTER 14
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                O-Level Mathematics
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-md scale-100'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <UkFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('sn')}
                aria-pressed={lang === 'sn'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  lang === 'sn'
                    ? 'bg-white text-slate-900 shadow-md scale-100'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ZwFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            {activeSection.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' && activeSection.introShona ? activeSection.introShona : activeSection.intro}
          </p>
        </div>
      </div>

      {/* Navigation Rail */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2 sm:py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div
            id="math-topic-rail"
            data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s) => {
              const theme = sectionThemes[s.id] || sectionThemes['intro-transforms'];
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  data-topic-id={s.id}
                  onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${
                    isActive
                      ? theme.navActiveBg
                      : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10">
        <div key={`${activeSection.id}-${lang}`}>
          <Section section={activeSection} lang={lang} />
        </div>

        {/* Prev / Next Footer */}
        <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">
            {activeIndex + 1} / {sections.length}
          </span>
          <button
            onClick={goNext}
            disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeometricalTransformations3;
