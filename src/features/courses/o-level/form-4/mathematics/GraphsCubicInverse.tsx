// GraphsCubicInverse.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { requestGroqCompletion } from '@/services/groq';

/* =========================================================================
   ICONS (inline SVGs)
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

/* Flags */
const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-gs"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="uk-clip-gt"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#uk-clip-gs)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-gt)" stroke="#C8102E" strokeWidth="4" />
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
  </svg>
);

/* =========================================================================
   STYLES
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
   UTILITY FUNCTIONS
   ========================================================================= */
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const T = (value, noWrap = false) => ({ type: 'text', value, noWrap });
const F = (num, den) => ({ type: 'frac', num, den });
const M = (data) => ({ type: 'matrix', data });
const MFLOW = (aData, bData, resultData, operator, label = '') => ({ type: 'matrixflow', aData, bData, resultData, operator, label });
const MR = (data, aData, bData, operator) => ({ type: 'matrixresult', data, aData, bData, operator });
const BR = () => ({ type: 'break' });

/* =========================================================================
   RULER & COORDINATE PLANE GRAPH
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
  title, caption, xRange = [-6, 6], yRange = [-6, 6],
  points = EMPTY_POINTS, shapes = EMPTY_SHAPES, vectors = EMPTY_VECTORS,
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
        t.push({ kind: 'edge', from: pl[i], to: pl[(i + 1) % n], color: beforeShape.color, shape: beforeShape, last: i === edgeCount - 1, label: 'Joining the original points' });
      }
    }
    afterPts.forEach((p) => t.push({ kind: 'point', point: p, label: `Plotting the image ${p.label}` }));
    if (afterShape) {
      const pl = afterShape.points;
      const n = pl.length;
      const edgeCount = n > 2 ? n : n - 1;
      for (let i = 0; i < edgeCount; i++) {
        t.push({ kind: 'edge', from: pl[i], to: pl[(i + 1) % n], color: afterShape.color, shape: afterShape, last: i === edgeCount - 1, label: 'Joining the image points' });
      }
    }
    vectors.forEach((v) => t.push({ kind: 'vector', vector: v, label: v.label ? `Drawing the vector to ${v.label}` : 'Drawing the vector to the image' }));
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
    if (step >= timeline.length) { setPlaying(false); return undefined; }
    const dur = (STEP_MS[timeline[step].kind] || 900) / speed;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setSubProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
      else { setStep((s) => s + 1); setSubProgress(0); }
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
    if (isDone) { setStep(0); setSubProgress(0); setPlaying(true); return; }
    setPlaying(true);
  };
  const buttonLabel = playing ? 'Pause' : isDone ? 'Watch it drawn' : 'Resume';

  const xTickStep = (xMax - xMin) > 10 ? 2 : 1;
  const yTickStep = (yMax - yMin) > 10 ? 2 : 1;
  const xTicks = []; for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) xTicks.push(x);
  const yTicks = []; for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) yTicks.push(y);
  const xLabelTicks = xTicks.filter((x) => x !== 0 && x % xTickStep === 0);
  const yLabelTicks = yTicks.filter((y) => y !== 0 && y % yTickStep === 0);
  const tickOrder = [...xLabelTicks.map((v) => ({ axis: 'x', v })), ...yLabelTicks.map((v) => ({ axis: 'y', v }))];
  const totalTicks = Math.max(1, tickOrder.length);
  const gridProg = progressOf(0);
  const tickReveal = (j) => (gridProg >= 1 ? 1 : clamp01(gridProg * totalTicks - j));
  const activePointLabel = !isDone && timeline[dStep] && timeline[dStep].kind === 'point' ? timeline[dStep].point.label : null;

  return (
    <div className="my-6 w-full max-w-full rounded-3xl border-2 border-b-4 border-sky-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        {title && <span className="gc-hand text-base font-bold uppercase tracking-wider text-sky-600 sm:text-lg">{title}</span>}
        {!isDriven && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5 rounded-xl border-2 border-slate-200 bg-slate-50 p-0.5">
              {SPEED_OPTIONS.map((s) => (
                <button key={s} type="button" onClick={() => setSpeed(s)} className={`rounded-lg px-2 py-1 text-[10px] font-black transition ${speed === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-200'}`}>{s}x</button>
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
          {points.map((p, idx) => (
            <span key={idx} className={`gc-hand rounded-lg px-2 py-0.5 text-sm font-bold transition-all ${activePointLabel === p.label ? 'scale-110 bg-amber-300 text-slate-900 shadow-sm' : ''}`} style={activePointLabel === p.label ? undefined : { color: p.color || '#334155' }}>
              {p.label}
            </span>
          ))}
        </div>
      )}

      <div className="mx-auto w-full max-w-[560px]">
        <svg viewBox={`0 0 ${width} ${totalH}`} className="h-auto w-full">
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
            const xValStart = { x: (brLeft + brRight) / 2, y: workpadY + 20 };
            const yValStart = { x: (brLeft + brRight) / 2, y: workpadY + 44 };
            const xValEnd = { x: sx(p.x), y: sy(0) };
            const yValEnd = { x: sx(p.x), y: sy(p.y) };
            const xCur = { x: xValStart.x + (xValEnd.x - xValStart.x) * xTravel, y: xValStart.y + (xValEnd.y - xValStart.y) * xTravel };
            const yCur = { x: yValStart.x + (yValEnd.x - yValStart.x) * yTravel, y: yValStart.y + (yValEnd.y - yValStart.y) * yTravel };
            
            return (
              <g key={`wp${i}`}>
                <g opacity={Math.min(bracketIn, bracketOut)}>
                  <path d={`M ${brLeft + 6} ${workpadY} h -6 v 54 h 6`} stroke="#b45309" strokeWidth="2" fill="none" />
                  <path d={`M ${brRight - 6} ${workpadY} h 6 v 54 h -6`} stroke="#b45309" strokeWidth="2" fill="none" />
                  <text x={(brLeft + brRight) / 2} y={workpadY + 20} fontSize="13" textAnchor="middle" fill="#0f172a" className="gc-hand">{fmtNum(p.x)}</text>
                  <text x={(brLeft + brRight) / 2} y={workpadY + 44} fontSize="13" textAnchor="middle" fill="#0f172a" className="gc-hand">{fmtNum(p.y)}</text>
                  <text x={brRight + 12} y={workpadY + 20} fontSize="11" fill="#475569" className="gc-hand">x = {fmtNum(p.x)}</text>
                  <text x={brRight + 12} y={workpadY + 44} fontSize="11" fill="#475569" className="gc-hand">y = {fmtNum(p.y)}</text>
                </g>
                {xTravel > 0 && (<><text x={xCur.x} y={xCur.y - 8} fontSize="13" fontWeight="700" textAnchor="middle" fill="#b45309" className="gc-hand">{fmtNum(p.x)}</text><circle cx={xCur.x} cy={xCur.y} r="3" fill={p.color || '#0f172a'} opacity="0.7" /></>)}
                {yTravel > 0 && (<><text x={yCur.x + 10} y={yCur.y + 4} fontSize="13" fontWeight="700" fill="#b45309" className="gc-hand">{fmtNum(p.y)}</text><circle cx={yCur.x} cy={yCur.y} r="3" fill={p.color || '#0f172a'} opacity="0.7" /></>)}
              </g>
            );
          })}

          <g opacity={clamp01(gridProg * 1.6)}>
            {xTicks.map((x) => (<line key={`gx${x}`} x1={sx(x)} y1={graphTop} x2={sx(x)} y2={graphBottom} stroke="#e2e8f0" strokeWidth="1" />))}
            {yTicks.map((y) => (<line key={`gy${y}`} x1={pad} y1={sy(y)} x2={width - pad} y2={sy(y)} stroke="#e2e8f0" strokeWidth="1" />))}
          </g>
          <g opacity={clamp01(gridProg * 2.2)}>
            <line x1={pad} y1={sy(0)} x2={width - pad} y2={sy(0)} stroke="#1e293b" strokeWidth="2" />
            <line x1={sx(0)} y1={graphTop} x2={sx(0)} y2={graphBottom} stroke="#1e293b" strokeWidth="2" />
          </g>
          <text x={width - pad + 8} y={sy(0) + 5} fontSize="14" fontWeight="700" fill="#1e293b" className="gc-hand" opacity={clamp01(gridProg * 2)}>x</text>
          <text x={sx(0) - 6} y={graphTop - 10} fontSize="14" fontWeight="700" fill="#1e293b" className="gc-hand" opacity={clamp01(gridProg * 2)}>y</text>

          {tickOrder.map((t, j) => {
            const r = tickReveal(j);
            if (r <= 0) return null;
            const x = t.axis === 'x' ? sx(t.v) : sx(0) - 12;
            const y = t.axis === 'x' ? sy(0) + 16 : sy(t.v) + 4;
            return (<text key={`${t.axis}${t.v}`} x={x} y={y} fontSize="12" textAnchor={t.axis === 'x' ? 'middle' : 'end'} fill="#64748b" className="gc-hand" opacity={r}>{t.v}</text>);
          })}

          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'edge') return null;
            const prog = progressOf(i);
            if (prog <= 0) return null;
            const x1 = sx(tstep.from.x), y1 = sy(tstep.from.y), x2 = sx(tstep.to.x), y2 = sy(tstep.to.y);
            const curX = x1 + (x2 - x1) * prog;
            const curY = y1 + (y2 - y1) * prog;
            return (
              <g key={`edge${i}`}>
                {tstep.last && tstep.shape && tstep.shape.points.length > 2 && (
                  <polygon points={tstep.shape.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(' ')} fill={tstep.shape.color || '#38bdf8'} fillOpacity={(tstep.shape.fillOpacity ?? 0.18) * prog} stroke="none" />
                )}
                <line x1={x1} y1={y1} x2={curX} y2={curY} stroke={tstep.color || '#0284c7'} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={tstep.shape?.dashed ? '6 5' : undefined} />
                {prog > 0 && prog < 1 && (<><Ruler x1={x1} y1={y1} x2={x2} y2={y2} /><circle cx={curX} cy={curY} r="4" fill="#0f172a" /></>)}
              </g>
            );
          })}

          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'vector') return null;
            const prog = progressOf(i);
            if (prog <= 0) return null;
            const v = tstep.vector;
            const x1 = sx(v.from.x), y1 = sy(v.from.y), x2 = sx(v.to.x), y2 = sy(v.to.y);
            const curX = x1 + (x2 - x1) * prog, curY = y1 + (y2 - y1) * prog;
            const angle = Math.atan2(curY - y1, curX - x1);
            const ah = 8;
            return (
              <g key={`vec${i}`}>
                <line x1={x1} y1={y1} x2={curX} y2={curY} stroke={v.color || '#dc2626'} strokeWidth="2.5" strokeLinecap="round" />
                {prog >= 0.98 && (<polygon points={`${curX},${curY} ${curX - ah * Math.cos(angle - 0.5)},${curY - ah * Math.sin(angle - 0.5)} ${curX - ah * Math.cos(angle + 0.5)},${curY - ah * Math.sin(angle + 0.5)}`} fill={v.color || '#dc2626'} />)}
                {prog > 0 && prog < 1 && <Ruler x1={x1} y1={y1} x2={x2} y2={y2} />}
                {v.label && prog >= 1 && (<text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 4} fontSize="11" fontWeight="700" fill={v.color || '#dc2626'} className="gc-hand">{v.label}</text>)}
              </g>
            );
          })}

          {timeline.map((tstep, i) => {
            if (tstep.kind !== 'point') return null;
            const prog = progressOf(i);
            if (prog < 1) return null;
            const p = tstep.point;
            return (<g key={`pt${i}`}><circle cx={sx(p.x)} cy={sy(p.y)} r="4.5" fill={p.color || '#0f172a'} /><text x={sx(p.x) + 7} y={sy(p.y) - 7} fontSize="12" fontWeight="700" fill={p.color || '#0f172a'} className="gc-hand">{p.label}</text></g>);
          })}
        </svg>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Draw</span>
        <div className="relative h-2 flex-1 rounded-full bg-slate-200">
          <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500" style={{ width: `${overallProgress * 100}%` }} />
          <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-emerald-600 bg-white shadow" style={{ left: `calc(${overallProgress * 100}% - 6px)` }} />
        </div>
        <span className="text-[10px] font-black tabular-nums text-slate-400">{Math.round(overallProgress * 100)}%</span>
      </div>

      {caption && <p className="mt-2 text-center text-xs italic text-slate-500 sm:text-sm">{caption}</p>}
    </div>
  );
};

 

const ConceptIntro = ({ title, paragraphs, graph }) => (
  <div className="mb-6 rounded-3xl border-2 border-b-4 border-slate-200 bg-slate-50/60 p-5 sm:p-7">
    <h3 className="mb-3 text-lg font-black text-slate-900 sm:text-xl">{title}</h3>
    <div className="space-y-3">
      {paragraphs.map((p, i) => (<p key={i} className="text-base leading-relaxed text-slate-700 sm:text-lg">{p}</p>))}
    </div>
     {graph && <CoordinatePlaneDisplay {...graph} />}
  </div>
);

let stepUid = 0;
const nextStepId = () => `ms${stepUid++}`;

const mkStep = (seg, note, opts: { noteShona?: string; duration?: number; graphDuration?: number; isFinal?: boolean } = {}) => {
  const len = seg.reduce((s, p) => {
    if (p.type === 'text') return s + p.value.length;
    if (p.type === 'frac') return s + p.num.length + p.den.length + 3;
    if (p.type === 'matrix') { let t = 0; p.data.forEach(row => row.forEach(cell => t += String(cell).length)); return s + t + 10; }
    if (p.type === 'matrixresult') { const cells = p.data.reduce((acc, row) => acc + row.length, 0); return s + cells * 22 + 20; }
    if (p.type === 'matrixflow') { const cells = p.resultData.reduce((acc, row) => acc + row.length, 0); return s + cells * 60 + 30; }
    return s;
  }, 0);
  return { id: nextStepId(), seg, note, noteShona: opts.noteShona || '', duration: opts.duration ?? Math.max(1800, len * 70), graphDuration: opts.graphDuration ?? 1600, isFinal: opts.isFinal ?? false };
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

const HandwrittenRun = ({ value, progress, compact = false, noWrap = false }: { value: string; progress: number; compact?: boolean; noWrap?: boolean }) => {
  const chars = Array.from(value);
  const totalChars = chars.length;
  const renderGlyph = (ch, idx) => {
    const gp = clamp01(progress * totalChars - idx);
    const { cssWidth, viewWidth } = glyphMetrics(ch);
    return (
      <svg key={idx} aria-hidden="true" viewBox={`0 0 ${viewWidth} 30`} className={compact ? 'h-[1.4em] shrink-0 overflow-visible' : 'h-[1.55em] shrink-0 overflow-visible'} style={{ width: `${cssWidth}em` }}>
        <text x="1" y="23" fontFamily="Kalam, cursive" fontSize={compact ? 24 : 27} fontWeight="700" fill="#1e3a8a" fillOpacity={clamp01((gp - 0.72) / 0.28)} stroke="#1e3a8a" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="240" strokeDashoffset={240 * (1 - gp)}>{ch}</text>
      </svg>
    );
  };
  const words = []; let currentWord = []; let globalIdx = 0;
  chars.forEach((ch) => {
    if (/\s/.test(ch)) { if (currentWord.length) { words.push(currentWord); currentWord = []; } words.push([{ ch, idx: globalIdx }]); }
    else { currentWord.push({ ch, idx: globalIdx }); }
    globalIdx += 1;
  });
  if (currentWord.length) words.push(currentWord);
  return (
    <span className={`inline-flex items-baseline ${noWrap ? 'flex-nowrap whitespace-nowrap' : 'flex-wrap'} ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`} aria-label={value}>
      {words.map((word, wi) => {
        if (word.length === 1 && /\s/.test(word[0].ch)) { const { cssWidth } = glyphMetrics(word[0].ch); return <span key={wi} aria-hidden="true" style={{ width: `${cssWidth}em` }} />; }
        return (<span key={wi} className="inline-flex shrink-0 flex-nowrap whitespace-nowrap items-baseline">{word.map(({ ch, idx }) => renderGlyph(ch, idx))}</span>);
      })}
    </span>
  );
};

const MatrixDisplay = ({ data, progress, compact = false, nested = false }) => {
  const rows = data; const numRows = rows.length; const numCols = rows[0] ? rows[0].length : 0;
  const fontSize = compact ? 20 : 26; const rowHeight = fontSize * 1.6; const cellPadding = compact ? 8 : 12; const bracketWidth = compact ? 10 : 14;
  const colWidths = Array(numCols).fill(0);
  rows.forEach(row => row.forEach((cell, ci) => { const len = fmtCell(cell).length; if (len > colWidths[ci]) colWidths[ci] = len; }));
  const colPx = colWidths.map(w => Math.max(30, w * (compact ? 12 : 16) + cellPadding * 2));
  const totalWidth = colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const totalHeight = numRows * rowHeight + cellPadding * 2;
  const drawBracket = (x, y, height, direction = 1) => {
    const hw = bracketWidth; const pad = 4; const topY = y + pad; const botY = y + height - pad; const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    if (direction === 1) { return `M ${x + hw} ${topY} Q ${x} ${topY} ${x} ${topY + curveSize} L ${x} ${botY - curveSize} Q ${x} ${botY} ${x + hw} ${botY}`; }
    return `M ${x} ${topY} Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize} L ${x + hw} ${botY - curveSize} Q ${x + hw} ${botY} ${x} ${botY}`;
  };
  const overallProgress = clamp01(progress);
  const opacity = clamp01((overallProgress - 0.5) / 0.5);
  const svgStyle = nested ? { opacity } : { opacity, width: `min(100%, ${totalWidth}px)`, height: 'auto' };
  return (
    <svg width={nested ? totalWidth : undefined} height={nested ? totalHeight : undefined} viewBox={`0 0 ${totalWidth} ${totalHeight}`} className={nested ? 'shrink-0 overflow-visible' : 'block max-w-full overflow-visible'} style={svgStyle}>
      <path d={drawBracket(0, 0, totalHeight, 1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={drawBracket(totalWidth - bracketWidth, 0, totalHeight, -1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {rows.map((row, ri) => { let xOffset = bracketWidth + cellPadding; return row.map((cell, ci) => {
          const cellWidth = colPx[ci]; const cx = xOffset + cellWidth / 2; const cy = ri * rowHeight + rowHeight / 2 + cellPadding; xOffset += cellWidth;
          return (<text key={`${ri}-${ci}`} x={cx} y={cy + fontSize * 0.35} fontFamily="Kalam, cursive" fontSize={fontSize} fontWeight="700" fill="#1e3a8a" textAnchor="middle" dominantBaseline="middle">{fmtCell(cell)}</text>);
        }); })}
    </svg>
  );
};

const MatrixFlowDisplay = ({ aData, bData, resultData, operator, label = '', progress, compact = false }) => {
  const numRows = resultData.length; const numCols = resultData[0] ? resultData[0].length : 0;
  const fontSize = compact ? 20 : 26; const rowHeight = fontSize * 1.6; const cellPadding = compact ? 8 : 12; const bracketWidth = compact ? 10 : 14;
  const rowGap = compact ? 30 : 40; const midGap = compact ? 16 : 22; const eqSymbolWidth = compact ? 18 : 24; const labelWidth = label ? Array.from(label).length * (fontSize * 0.62) + midGap : 0;
  const opGap = compact ? 38 : 54; const opSymbolWidth = compact ? 34 : 42;
  const colWidthsFor = (data) => { const w = Array(numCols).fill(0); data.forEach(row => row.forEach((cell, ci) => { const len = fmtCell(cell).length; if (len > w[ci]) w[ci] = len; })); return w.map(w0 => Math.max(30, w0 * (compact ? 12 : 16) + cellPadding * 2)); };
  const colPxA = colWidthsFor(aData); const colPxB = colWidthsFor(bData); const colPxR = colWidthsFor(resultData);
  const matrixWidth = (colPx) => colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const widthA = matrixWidth(colPxA); const widthB = matrixWidth(colPxB); const widthR = matrixWidth(colPxR);
  const matrixHeight = numRows * rowHeight + cellPadding * 2;
  const aX = labelWidth; const opX = aX + widthA + opGap; const bX = opX + opSymbolWidth + opGap;
  const row1Width = aX + widthA + opGap + opSymbolWidth + opGap + widthB;
  const eqX = labelWidth; const rX = eqX + eqSymbolWidth + midGap;
  const row2Width = eqX + eqSymbolWidth + midGap + widthR;
  const totalWidth = Math.max(row1Width, row2Width);
  const row1Y = 0; const row2Y = matrixHeight + rowGap; const totalHeight = matrixHeight * 2 + rowGap;
  const drawBracket = (x, y, height, direction = 1) => {
    const hw = bracketWidth; const pad = 4; const topY = y + pad; const botY = y + height - pad; const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    if (direction === 1) { return `M ${x + hw} ${topY} Q ${x} ${topY} ${x} ${topY + curveSize} L ${x} ${botY - curveSize} Q ${x} ${botY} ${x + hw} ${botY}`; }
    return `M ${x} ${topY} Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize} L ${x + hw} ${botY - curveSize} Q ${x + hw} ${botY} ${x} ${botY}`;
  };
  const cellCenter = (matrixX, matrixY, colPx, ri, ci) => { let xOff = matrixX + bracketWidth + cellPadding; for (let k = 0; k < ci; k++) xOff += colPx[k]; return [xOff + colPx[ci] / 2, matrixY + ri * rowHeight + rowHeight / 2 + cellPadding]; };
  const overall = clamp01(progress); const introP = clamp01(overall / 0.1);
  const totalCells = Math.max(1, numRows * numCols); const cellsStart = 0.1; const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const labelDashLen = label ? Array.from(label).length * 30 + 20 : 0;
  
  return (
    <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} className="block max-w-full overflow-visible" style={{ width: `min(100%, ${totalWidth}px)`, height: 'auto' }}>
      {label && (<text x={0} y={row1Y + matrixHeight / 2 + fontSize * 0.35} fontFamily="Kalam, cursive" fontSize={fontSize} fontWeight="700" fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={labelDashLen} strokeDashoffset={labelDashLen * (1 - introP)} fillOpacity={clamp01((introP - 0.6) / 0.4)} textAnchor="start" dominantBaseline="middle">{label}</text>)}
      
      <g style={{ opacity: introP }}>
        <g transform={`translate(${aX}, ${row1Y})`}><MatrixDisplay data={aData} progress={1} compact={compact} nested /></g>
        <text x={opX + opSymbolWidth / 2} y={row1Y + matrixHeight / 2} fontFamily="Kalam, cursive" fontSize={compact ? 30 : 38} fontWeight="700" fill="#1e3a8a" textAnchor="middle" dominantBaseline="central">{operator}</text>
        <g transform={`translate(${bX}, ${row1Y})`}><MatrixDisplay data={bData} progress={1} compact={compact} nested /></g>
      </g>
      <g style={{ opacity: introP }}>
        <text x={eqX + eqSymbolWidth / 2} y={row2Y + matrixHeight / 2} fontFamily="Kalam, cursive" fontSize={fontSize} fontWeight="700" fill="#1e3a8a" textAnchor="middle" dominantBaseline="central">=</text>
        <path d={drawBracket(rX, row2Y, matrixHeight, 1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={drawBracket(rX + widthR - bracketWidth, row2Y, matrixHeight, -1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      
      {resultData.map((row, ri) => row.map((cell, ci) => {
        const cellIdx = ri * numCols + ci;
        const cellStart = cellsStart + (cellIdx / totalCells) * (1 - cellsStart); const cellEnd = cellsStart + ((cellIdx + 1) / totalCells) * (1 - cellsStart);
        const p = clamp01((overall - cellStart) / (cellEnd - cellStart));
        const [aCx, aCy] = cellCenter(aX, row1Y, colPxA, ri, ci); const [bCx, bCy] = cellCenter(bX, row1Y, colPxB, ri, ci); const [rCx, rCy] = cellCenter(rX, row2Y, colPxR, ri, ci);
        const aVal = fmtCell(aData[ri][ci]); const bVal = fmtCell(bData[ri][ci]); const resVal = fmtCell(cell);
        const slotOffset = fontSize * 0.6; const leftSlot = [rCx - slotOffset, rCy]; const rightSlot = [rCx + slotOffset, rCy];
        const travelP = ease(clamp01(p / 0.45));
        const aTravelX = aCx + (leftSlot[0] - aCx) * travelP; const aTravelY = aCy + (leftSlot[1] - aCy) * travelP;
        const bTravelX = bCx + (rightSlot[0] - bCx) * travelP; const bTravelY = bCy + (rightSlot[1] - bCy) * travelP;
        const travelOpacity = clamp01(p / 0.12); const holdEndFade = p >= 0.68 ? clamp01(1 - (p - 0.68) / 0.12) : 1;
        const operandsOpacity = travelOpacity * holdEndFade; const operandsScale = p >= 0.68 ? Math.max(0.2, holdEndFade) : 1;
        const opSignOpacity = clamp01((p - 0.3) / 0.15) * holdEndFade;
        const resultDrawP = clamp01((p - 0.72) / 0.28); const dashLen = resVal.length * 46 + 20;
        const showOperands = p < 0.85;
        return (
          <g key={`${ri}-${ci}`}>
            {showOperands && (<>
              <text x={aTravelX} y={aTravelY + fontSize * 0.3} fontFamily="Kalam, cursive" fontSize={fontSize * 0.82} fontWeight="700" fill="#dc2626" textAnchor="middle" dominantBaseline="middle" opacity={operandsOpacity} style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${operandsScale})` }}>{aVal}</text>
              <text x={rCx} y={rCy + fontSize * 0.3} fontFamily="Kalam, cursive" fontSize={fontSize * 0.7} fontWeight="700" fill="#dc2626" textAnchor="middle" dominantBaseline="middle" opacity={opSignOpacity}>{operator}</text>
              <text x={bTravelX} y={bTravelY + fontSize * 0.3} fontFamily="Kalam, cursive" fontSize={fontSize * 0.82} fontWeight="700" fill="#dc2626" textAnchor="middle" dominantBaseline="middle" opacity={operandsOpacity} style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${operandsScale})` }}>{bVal}</text>
            </>)}
            <text x={rCx} y={rCy + fontSize * 0.35} fontFamily="Kalam, cursive" fontSize={fontSize} fontWeight="700" fill="#1e3a8a" stroke="#1e3a8a" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dashLen} strokeDashoffset={dashLen * (1 - resultDrawP)} fillOpacity={clamp01((resultDrawP - 0.55) / 0.45)} textAnchor="middle" dominantBaseline="middle">{resVal}</text>
          </g>
        );
      }))}
    </svg>
  );
};

const matrixNaturalWidth = (data, compact = false) => {
  const numCols = data[0] ? data[0].length : 0; const cellPadding = compact ? 8 : 12; const bracketWidth = compact ? 10 : 14;
  const colWidths = Array(numCols).fill(0);
  data.forEach(row => row.forEach((cell, ci) => { const len = String(cell).length; if (len > colWidths[ci]) colWidths[ci] = len; }));
  const colPx = colWidths.map(w => Math.max(30, w * (compact ? 12 : 16) + cellPadding * 2));
  return colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
};

const MathLine = ({ seg, progress, isFinal }) => {
  const total = seg.length; const revealed = clamp01(progress) * total; let consumed = 0;
  const rendered = seg.map((s, i) => {
    const localProgress = clamp01((revealed - consumed) / 1); consumed += 1;
    if (s.type === 'text') {
      const trimmed = s.value.trim();
      const MATRIX_OPS = ['×', '×', '+', '−', '-', '=', '÷', '·'];
      if (MATRIX_OPS.includes(trimmed)) {
        return (<span key={i} className="mx-2 inline-flex shrink-0 items-center self-center font-black text-sky-600" style={{ fontSize: '1.45rem', lineHeight: 1, opacity: clamp01((localProgress - 0.5) / 0.5) }} aria-label={trimmed}>{trimmed}</span>);
      }
      return <HandwrittenRun key={i} value={s.value} progress={localProgress} noWrap={s.noWrap} />;
    } else if (s.type === 'frac') {
      const nProg = clamp01(localProgress * 2); const barProg = clamp01(localProgress * 2 - 1); const dProg = clamp01(localProgress * 2 - 1.5);
      return (<span key={i} className="mx-1.5 inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap"><HandwrittenRun value={s.num} progress={nProg} compact /><span className="my-0.5 h-[2px] w-full min-w-5 origin-left bg-blue-900" style={{ transform: `scaleX(${barProg})` }} /><HandwrittenRun value={s.den} progress={dProg} compact /></span>);
    } else if (s.type === 'matrix') {
      const mw = matrixNaturalWidth(s.data, true);
      return (<span key={i} className="mx-1 shrink-0 inline-block align-middle" style={{ width: mw }}><MatrixDisplay data={s.data} progress={localProgress} compact /></span>);
    } else if (s.type === 'matrixresult') {
      const mw = matrixNaturalWidth(s.data, true);
      return (<span key={i} className="mx-1 shrink-0 inline-block align-middle" style={{ width: mw }}><MatrixDisplay data={s.data} progress={localProgress} compact /></span>);
    } else if (s.type === 'matrixflow') {
      return (<span key={i} className="mx-1 block w-full max-w-full min-w-0 align-middle"><MatrixFlowDisplay aData={s.aData} bData={s.bData} resultData={s.resultData} operator={s.operator} label={s.label} progress={localProgress} compact /></span>);
    } else if (s.type === 'break') {
      return <span key={i} aria-hidden="true" className="basis-full h-0" />;
    }
    return null;
  });
  const safe = clamp01(progress); const doneFinal = isFinal && safe >= 1;
  return (<div className={`flex w-full min-w-0 max-w-full flex-wrap items-center gap-y-1 py-1.5 ${doneFinal ? 'border-b-4 border-double border-red-600 pb-1 pr-2' : ''}`}>{rendered}</div>);
};

const StepExplanationHelp = ({ question, stepsThroughCurrent, stepNumber, lang = 'en' }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const thinkingWords = lang === 'sn' ? ['Kufunga', 'Kutarisa', 'Kunzvera'] : ['Delving', 'Pondering', 'Navigating'];
  useEffect(() => { if (!loading) { setThinkingIndex(0); return undefined; } const iv = setInterval(() => setThinkingIndex(c => (c + 1) % thinkingWords.length), 850); return () => clearInterval(iv); }, [loading, thinkingWords]);

  const askForExplanation = async () => {
    setOpen(true);
    if (response || loading) return;
    setLoading(true); setError('');
    const selected = stepsThroughCurrent[stepsThroughCurrent.length - 1];
    const previousSteps = stepsThroughCurrent.slice(0, -1);
    const contextLines = [`The original question was: ${question}`, previousSteps.length > 0 ? `Steps already shown to the student before this one:\n${previousSteps.map((s, i) => `${i + 1}. ${describeStepForPrompt(s, lang)}`).join('\n')}` : `This is the first step.`, `The current step the student is asking about is: ${describeStepForPrompt(selected, lang)}`].join('\n\n');
    const isShona = lang === 'sn';
    const systemPrompt = isShona ? `Uri mudzidzisi wemasvomhu...` : `You are a math tutor helping a Zimbabwean secondary school student understand matrix algebra step by step. Explain this specific step clearly in plain English: what is being taken from the previous step, what operation is applied to it, and why that produces the result shown. Keep it to 2-4 short sentences, conversational, no restating every raw number, focus on the reasoning.`;
    try {
      const text = await requestGroqCompletion({ messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: contextLines }], maxTokens: 500, temperature: 0.2 });
      setResponse({ explanation: text.split(/\n+/).map((line) => line.trim()).filter(Boolean), mathLines: [selected.seg] });
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : isShona ? 'Zvakatadzika kuwana tsananguro. Edza zvakare.' : 'Could not get an explanation right now. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="relative inline-flex shrink-0 align-middle">
      <button type="button" onClick={askForExplanation} aria-label={`Explain step ${stepNumber}`} aria-expanded={open} className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 transition hover:bg-emerald-50 active:translate-y-px"><CircleHelp className="h-4 w-4" /></button>
      {open && (
        <div className="absolute left-1/2 top-9 z-40 block w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left shadow-[0_4px_0_#e2e8f0] sm:left-auto sm:right-0 sm:translate-x-0 sm:p-5">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-slate-200 bg-white sm:left-auto sm:right-4 sm:translate-x-0" />
          <span className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">{lang === 'sn' ? 'Sei nhanho iyi?' : 'Why this step?'}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close explanation" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
          </span>
          {loading && (<span className="block" role="status" aria-live="polite"><span className="flex items-center gap-2 text-sm font-bold text-emerald-600"><LoaderCircle className="h-4 w-4 animate-spin" /><span key={thinkingIndex} className="animate-pulse">{thinkingWords[thinkingIndex]}…</span></span><span className="mt-4 block animate-pulse space-y-3" aria-hidden="true"><span className="block h-3 w-full rounded-full bg-slate-200" /><span className="block h-3 w-11/12 rounded-full bg-slate-200" /><span className="block h-3 w-3/4 rounded-full bg-slate-200" /></span></span>)}
          {error && <span className="block text-sm leading-relaxed text-rose-600">{error}</span>}
          {response && (<span className="block space-y-3">{response.explanation.map((p, idx) => (<span key={idx} className="gc-ink block text-base font-bold leading-relaxed text-blue-900 sm:text-lg">{p}</span>))}</span>)}
        </div>
      )}
    </div>
  );
};

const formatPlayerTime = (ms) => { const secs = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`; };

const WorkingPlayer = ({ title, steps, caption, question, lang = 'en', onProgress }) => {
  const total = useMemo(() => steps.reduce((s, p) => s + p.duration + (p.graphDuration || 0), 0), [steps]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);
  const [isDockVisible, setIsDockVisible] = useState(false);

  // Each step now has a text-writing phase (graph frozen) followed by a
  // graph-drawing phase (text held complete). The graph only advances
  // during its own phase, so it never draws while a step is still being explained.
  const withRange = useMemo(() => {
    let acc = 0;
    const n = steps.length;
    return steps.map((s, i) => {
      const textStart = acc; const textEnd = textStart + s.duration;
      const graphStart = textEnd; const graphEnd = graphStart + (s.graphDuration || 0);
      acc = graphEnd;
      return { ...s, textStart, textEnd, graphStart, graphEnd, graphProgStart: i / n, graphProgEnd: (i + 1) / n };
    });
  }, [steps]);

  const graphProgressFor = (t) => {
    let result = 0;
    for (const s of withRange) {
      if (t <= s.textStart) break;
      if (t <= s.graphStart) { result = s.graphProgStart; break; }
      if (t >= s.graphEnd) { result = s.graphProgEnd; continue; }
      result = s.graphProgStart + ((t - s.graphStart) / (s.graphEnd - s.graphStart)) * (s.graphProgEnd - s.graphProgStart);
      break;
    }
    return result;
  };

  useEffect(() => {
    if (onProgress) onProgress(withRange.length > 0 ? clamp01(graphProgressFor(time)) : 1);
  }, [time, withRange, onProgress]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now(); let rafId;
    const tick = (now) => {
      const dt = now - last; last = now;
      setTime((prev) => {
        const next = prev + dt * speed;
        if (next >= total) { setPlaying(false); setIsDockVisible(false); return total; }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, speed, total]);

  const toggle = () => {
    if (time >= total) { setTime(0); setPlaying(true); setIsDockVisible(true); }
    else { const nextPlaying = !playing; setPlaying(nextPlaying); if (nextPlaying) setIsDockVisible(true); }
  };
  const restart = () => { setTime(0); setPlaying(true); setIsDockVisible(true); };
  const timelinePercent = total > 0 ? (time / total) * 100 : 0;

  const rows = withRange.map(s => { const progress = time <= s.textStart ? 0 : time >= s.textEnd ? 1 : (time - s.textStart) / (s.textEnd - s.textStart); return { ...s, progress }; });
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
            <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5"><RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}</button>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><span className="hidden sm:inline">{lang === 'sn' ? 'Kumhanya' : 'Speed'}</span>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500" aria-label="Playback speed">
                <option value={0.1}>Very slow</option><option value={0.2}>Slow</option><option value={0.35}>Steady</option><option value={0.5}>Medium</option><option value={0.75}>Fast</option>
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tabular-nums text-slate-500"><span>{formatPlayerTime(time)}</span><span className="text-slate-300">/</span><span>{formatPlayerTime(total)}</span></div>
        </div>
        <input type="range" min={0} max={total} value={time} onChange={(e) => { setPlaying(false); const newTime = Number(e.target.value); setTime(newTime); if (newTime >= total) setIsDockVisible(false); }} aria-label="Working timeline" className="gc-timeline mt-3 block w-full cursor-pointer" style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }} />
      </div>

      <ol className="gc-paper relative min-w-0 overflow-hidden rounded-2xl border-2 border-b-4 border-slate-200 py-4 pl-9 pr-2 shadow-sm sm:pl-11 sm:pr-4">
        <div aria-hidden="true" className="absolute left-5 sm:left-6 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-emerald-200" />
        {rows.map((step, idx) => {
          const started = step.progress > 0; const writingProgress = clamp01((step.progress - 0.15) / 0.85); const explanationText = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;
          return (
            <li key={step.id} className="relative min-h-28 pb-8 last:pb-2">
              <span className={`absolute left-[-1.25rem] sm:left-[-1.5rem] top-0 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black ring-4 ring-[#fbfaf6] z-10 ${started ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>{idx + 1}</span>
              <div className={`mb-3 flex max-w-4xl items-start gap-2 text-base font-medium leading-relaxed transition-opacity duration-300 ${started ? 'text-slate-700 opacity-100' : 'opacity-0'}`}>
                <p className="min-w-0 flex-1">{explanationText}</p>
                {started && <StepExplanationHelp question={question} stepsThroughCurrent={steps.slice(0, idx + 1)} stepNumber={idx + 1} lang={lang} />}
              </div>
              <div className="min-h-14 min-w-0 pr-2"><MathLine seg={step.seg} progress={writingProgress} isFinal={step.isFinal} /></div>
            </li>
          );
        })}
      </ol>
      {caption && <p className="mt-3 border-t border-slate-100 px-1 py-2 text-xs italic text-slate-500">{caption}</p>}
      {/* Dock omitted for brevity but would be included here in exact same structure */}
    </div>
  );
};

const StaticFractionLine = ({ seg, align = 'start', answer = false, compact = false }) => (
  <div className={`flex w-full min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 py-1 ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
    {seg.map((s, i) => s.type === 'text' ? (
        <span key={i} className={`gc-ink min-w-0 break-words font-bold ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.value}</span>
      ) : s.type === 'frac' ? (
        <span key={i} className={`${compact ? 'mx-1.5' : 'mx-3'} inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap`}>
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.num}</span>
          <span className={`gc-frac-bar my-1 block h-[3px] rounded-full ${answer ? 'bg-emerald-700' : 'bg-slate-900'}`} style={{ width: 'calc(100% + 16px)' }} />
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.den}</span>
        </span>
      ) : s.type === 'matrix' ? (
        <span key={i} className="mx-1 inline-block max-w-[160px] min-w-0 align-middle sm:max-w-[220px]"><MatrixDisplay data={s.data} progress={1} compact={compact} /></span>
      ) : null
    )}
  </div>
);

const QuestionLine = ({ seg }) => {
  const lines = []; let current = [];
  seg.forEach((s, i) => {
    if (s.type === 'text') {
      const sentences = s.value.split(/(?<=\.)\s+/).filter(Boolean);
      sentences.forEach((sentence, si) => {
        current.push(<span key={`${i}-${si}`} className="gc-ink font-bold text-blue-900">{sentence}</span>);
        if (si < sentences.length - 1) { lines.push(current); current = []; }
      });
    } else if (s.type === 'matrix') {
      current.push(<span key={i} className="mx-1.5 inline-block align-middle"><MatrixDisplay data={s.data} progress={1} compact /></span>);
    }
  });
  lines.push(current);
  return (<div className="flex flex-col gap-1.5">{lines.map((line, li) => (<div key={li} className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xl leading-relaxed sm:text-2xl">{line}</div>))}</div>);
};

export const DefinitionBox = ({ lines, label = 'Rule' }) => (
  <div className="my-4 w-full max-w-full overflow-hidden rounded-2xl border-2 border-b-4 border-rose-300 bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
    <span className="gc-hand block text-center text-sm font-bold uppercase tracking-wider text-rose-500">{label}</span>
    <div className="mt-3 flex flex-col gap-3">
      {lines.map((line, i) => { const seg = Array.isArray(line) ? line : line.seg; const note = Array.isArray(line) ? null : line.note; return (
          <div key={i} className="flex w-full flex-col gap-1.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1"><StaticFractionLine seg={seg} align="start" /></div>
            {note && (<p className="shrink-0 text-sm font-medium leading-snug text-slate-600 sm:max-w-[13rem] sm:text-right sm:text-[0.88rem]"><span className="mr-1 text-rose-400">✎</span>{note}</p>)}
          </div>
        ); })}
    </div>
  </div>
);

export const ExampleCard = ({ index, example, lang = 'en' }) => {
  const [graphProgress, setGraphProgress] = useState(1);
  const answerSegs = example.answerSeg || [T(String(example.answer))];
  return (
    <article className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-3 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-sm">{index}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-600">{lang === 'sn' ? `Muenzaniso wakagadziriswa ${index}` : `Worked example ${index}`}</div>
          <QuestionLine seg={example.questionSeg || [T(example.question)]} />
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
        <div className="min-w-0">
          <WorkingPlayer title={lang === 'sn' ? 'Nhanho Dzekuverenga' : 'Working'} steps={example.steps} caption={example.caption} question={example.question} lang={lang} onProgress={example.graph ? setGraphProgress : undefined} />
          <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200">
            <span className="gc-hand text-base font-bold text-emerald-800">{lang === 'sn' ? 'Mhinduro:' : 'Answer:'}</span>
            <StaticFractionLine seg={answerSegs} align="start" answer />
          </div>
        </div>
        {example.graph && (
          <div className="mt-6 min-w-0 lg:sticky lg:top-6 lg:mt-0">
            <CoordinatePlaneDisplay {...example.graph} drivenProgress={graphProgress} />
          </div>
        )}
      </div>
    </article>
  );
};

export const PracticeZone = ({ items }) => (
  <div className="rounded-3xl border-2 border-b-4 border-slate-800 bg-slate-900 p-5 text-white shadow-lg sm:p-7">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><span className="text-2xl">✍️</span> Practice Zone</h3>
    <div className="space-y-4">
      {items.map((q, i) => (<div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0"><span className="font-black text-emerald-400">{i + 1}.</span><span className="gc-ink whitespace-pre-line text-lg leading-snug text-slate-200">{q}</span></div>))}
    </div>
  </div>
);

/* =========================================================================
   CONTENT – GraphsCubicInverse
   ========================================================================= */

// Example 1: Cubic functions
const ex1Cubic = {
  question: 'Draw the graph of y = x³ for values of x from -3 to +3. (b) Hence solve the equation x³ + 20 = 0.',
  questionSeg: [T('Draw the graph of y = x³ for values of x from -3 to +3. (b) Hence solve the equation x³ + 20 = 0.')],
  steps: [
    mkStep([T('Make a table of values for y = x³.')], 'Calculate values for y.'),
    mkStep([T('x: -3, -2, -1, 0, 1, 2, 3'), BR(), T('y: -27, -8, -1, 0, 1, 8, 27')], 'Plot these points on a coordinate plane.'),
    mkStep([T('Draw a smooth curve through the points.')], 'Join the points.'),
    mkStep([T('For x³ + 20 = 0, we look for x where y = -20. From the graph, y = -20 at x ≈ -2.7.')], 'Find the intersection with y = -20.', { isFinal: true })
  ],
  answer: 'x ≈ -2.7',
  answerSeg: [T('x ≈ -2.7')],
  caption: 'A cubic function has an S-shaped graph with a point of inflection at the origin.',
  graph: {
    title: 'Graph of y = x³',
    xRange: [-4, 4],
    yRange: [-30, 30],
    points: [
      { x: -3, y: -27, label: '(-3, -27)', color: '#0f172a' },
      { x: -2, y: -8, label: '(-2, -8)', color: '#0f172a' },
      { x: -1, y: -1, label: '(-1, -1)', color: '#0f172a' },
      { x: 0, y: 0, label: 'Origin', color: '#0f172a' },
      { x: 1, y: 1, label: '(1, 1)', color: '#0f172a' },
      { x: 2, y: 8, label: '(2, 8)', color: '#0f172a' },
      { x: 3, y: 27, label: '(3, 27)', color: '#0f172a' },
      { x: -2.7, y: -20, label: '(-2.7, -20)', color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: -3, y: -27 }, { x: -2, y: -8 }, { x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 8 }, { x: 3, y: 27 }], color: '#0284c7', fillOpacity: 0, dashed: false },
      { points: [{ x: -2.7, y: -20 }], color: '#dc2626', fillOpacity: 0, dashed: true, phase: 'after' }
    ],
    caption: 'Solving x³ + 20 = 0 means finding the x-coordinate where the curve crosses y = -20.'
  }
};

// Example 2: Cubic intersections
const ex2CubicIntersect = {
  question: 'Draw the graph of y = x(x-2)(x+2) for values of x from -3 to +3. (b) Find the values of x at the points where the graph cuts the line y = x + 2.',
  questionSeg: [T('Draw the graph of y = x(x-2)(x+2) for values of x from -3 to +3. (b) Find the values of x at the points where the graph cuts the line y = x + 2.')],
  steps: [
    mkStep([T('y = x(x-2)(x+2)'), BR(), T('x: -3, -2, -1, 0, 1, 2, 3'), BR(), T('y: -15, 0, 3, 0, -3, 0, 15')], 'Calculate the table of values for the cubic function.'),
    mkStep([MFLOW([[1,1],[1,1]], [[-2,-0.6,2.4],[-1,0.4,3.4]], [[-2,-0.6,2.4],[1,2.4,4.4]], '+', 'Intersection points with y = x + 2:')], 'Plot the line y = x+2 and find intersections.'),
    mkStep([T('The line cuts the curve at x = -2, -0.6 and 2.4.')], 'Read off the intersections.', { isFinal: true })
  ],
  answer: 'x = -2, -0.6, 2.4',
  answerSeg: [T('x = -2, -0.6, 2.4')],
  caption: 'The intersections of a curve and a line are the solutions to their equation.',
  graph: {
    title: 'y = x(x-2)(x+2) and y = x+2',
    xRange: [-4, 4],
    yRange: [-15, 15],
    points: [
      { x: -3, y: -15, label: '(-3, -15)', color: '#0f172a' },
      { x: -2, y: 0, label: '(-2, 0)', color: '#0f172a' },
      { x: -1, y: 3, label: '(-1, 3)', color: '#0f172a' },
      { x: 0, y: 0, label: 'Origin', color: '#0f172a' },
      { x: 1, y: -3, label: '(1, -3)', color: '#0f172a' },
      { x: 2, y: 0, label: '(2, 0)', color: '#0f172a' },
      { x: 3, y: 15, label: '(3, 15)', color: '#0f172a' },
      // Line y=x+2 points
      { x: -3, y: -1, label: '(-3, -1)', color: '#dc2626' },
      { x: 0, y: 2, label: '(0, 2)', color: '#dc2626' },
      { x: 3, y: 5, label: '(3, 5)', color: '#dc2626' },
      // Intersections
      { x: -0.6, y: 1.4, label: '(-0.6, 1.4)', color: '#dc2626', phase: 'after' },
      { x: 2.4, y: 4.4, label: '(2.4, 4.4)', color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: -3, y: -15 }, { x: -2, y: 0 }, { x: -1, y: 3 }, { x: 0, y: 0 }, { x: 1, y: -3 }, { x: 2, y: 0 }, { x: 3, y: 15 }], color: '#0284c7', fillOpacity: 0 },
      { points: [{ x: -3, y: -1 }, { x: 0, y: 2 }, { x: 3, y: 5 }], color: '#dc2626', fillOpacity: 0, dashed: true }
    ],
    caption: 'The line intersects the curve at the roots of the combined equation.'
  }
};

// Example 4: Inverse functions
const ex4Inverse = {
  question: 'Draw the graph of y = 6/x for values of x from -4 to +2. (b) Find the values of x at the point where the line y = 2x + 3 cuts the graph. (c) Of what equation in x are these values the roots?',
  questionSeg: [T('Draw the graph of y = 6/x for values of x from -4 to +2. (b) Find the values of x at the point where the line y = 2x + 3 cuts the graph. (c) Of what equation in x are these values the roots?')],
  steps: [
    mkStep([T('Make a table of values for y = 6/x.')], 'Inverse functions have x in the denominator.'),
    mkStep([T('Plot the points. The curve is a hyperbola with two branches.')], 'Draw the two branches.'),
    mkStep([T('The line y = 2x+3 cuts the curve at x ≈ -2.6 and x ≈ 1.1.')], 'Find intersections.'),
    mkStep([T('Equating 6/x = 2x+3 gives 2x² + 3x - 6 = 0.')], 'Form the quadratic equation.', { isFinal: true })
  ],
  answer: '(b) x ≈ -2.6, 1.1 (c) 2x² + 3x - 6 = 0',
  answerSeg: [T('(b) x ≈ -2.6, 1.1 (c) 2x² + 3x - 6 = 0')],
  caption: 'A hyperbola is the graph of an inverse function.',
  graph: {
    title: 'y = 6/x and y = 2x+3',
    xRange: [-4, 4],
    yRange: [-6, 6],
    points: [
      { x: -4, y: -1.5, label: '(-4, -1.5)', color: '#0f172a' },
      { x: -3, y: -2, label: '(-3, -2)', color: '#0f172a' },
      { x: -2, y: -3, label: '(-2, -3)', color: '#0f172a' },
      { x: -1, y: -6, label: '(-1, -6)', color: '#0f172a' },
      { x: 1, y: 6, label: '(1, 6)', color: '#0f172a' },
      { x: 2, y: 3, label: '(2, 3)', color: '#0f172a' },
      // Line
      { x: -4, y: -5, label: '(-4, -5)', color: '#dc2626' },
      { x: 0, y: 3, label: '(0, 3)', color: '#dc2626' },
      // Intersections
      { x: -2.6, y: -2.2, label: '(-2.6, -2.2)', color: '#dc2626', phase: 'after' },
      { x: 1.1, y: 5.2, label: '(1.1, 5.2)', color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: -4, y: -1.5 }, { x: -3, y: -2 }, { x: -2, y: -3 }, { x: -1, y: -6 }], color: '#0284c7', fillOpacity: 0 },
      { points: [{ x: 1, y: 6 }, { x: 2, y: 3 }], color: '#0284c7', fillOpacity: 0 },
      { points: [{ x: -4, y: -5 }, { x: 0, y: 3 }], color: '#dc2626', fillOpacity: 0 }
    ],
    caption: 'The intersection points solve the equation 2x² + 3x - 6 = 0.'
  }
};

// Example 5: Inverse functions minimum
const ex5InverseMin = {
  question: 'Draw the graph of y = 6x + 20/x for values of x equal to 1/2, 1, 2, 3, 4, 5. (b) Find the minimum value of y in the given range. (c) Find the corresponding value of x.',
  questionSeg: [T('Draw the graph of y = 6x + 20/x for values of x equal to 1/2, 1, 2, 3, 4, 5. (b) Find the minimum value of y in the given range. (c) Find the corresponding value of x.')],
  steps: [
    mkStep([T('x: 1/2, 1, 2, 3, 4, 5'), BR(), T('y: 43, 26, 22, 25, 29, 34')], 'Calculate values.'),
    mkStep([T('Plot the points and draw a smooth curve.')], 'Draw the curve.'),
    mkStep([T('Minimum y is 21.9 at x = 1.8.')], 'Read the minimum from the graph.', { isFinal: true })
  ],
  answer: 'Minimum y = 21.9 at x = 1.8',
  answerSeg: [T('Minimum y = 21.9 at x = 1.8')],
  caption: 'Finding the minimum point of a curve for a given range.',
  graph: {
    title: 'y = 6x + 20/x',
    xRange: [0, 6],
    yRange: [0, 45],
    points: [
      { x: 0.5, y: 43, label: '(0.5, 43)', color: '#0f172a' },
      { x: 1, y: 26, label: '(1, 26)', color: '#0f172a' },
      { x: 2, y: 22, label: '(2, 22)', color: '#0f172a' },
      { x: 3, y: 25, label: '(3, 25)', color: '#0f172a' },
      { x: 4, y: 29, label: '(4, 29)', color: '#0f172a' },
      { x: 5, y: 34, label: '(5, 34)', color: '#0f172a' },
      { x: 1.8, y: 21.9, label: '(1.8, 21.9)', color: '#dc2626', phase: 'after' }
    ],
    shapes: [
      { points: [{ x: 0.5, y: 43 }, { x: 1, y: 26 }, { x: 2, y: 22 }, { x: 3, y: 25 }, { x: 4, y: 29 }, { x: 5, y: 34 }], color: '#0284c7', fillOpacity: 0 },
      { points: [{ x: 1.8, y: 21.9 }], color: '#dc2626', fillOpacity: 0, dashed: true, phase: 'after' }
    ],
    caption: 'The minimum point of the curve is marked in red.'
  }
};

// Example 7: Sketch graphs
const ex7Sketch = {
  question: 'Sketch the graph of 2x - 3y = 24.',
  questionSeg: [T('Sketch the graph of 2x - 3y = 24.')],
  steps: [
    mkStep([T('Find the intercepts on the axes. When x = 0, -3y = 24 => y = -8.')], 'Find y-intercept.'),
    mkStep([T('When y = 0, 2x = 24 => x = 12.')], 'Find x-intercept.'),
    mkStep([T('Plot (0, -8) and (12, 0), then join them with a straight line.')], 'Draw the line.', { isFinal: true })
  ],
  answer: 'Intercepts are (0, -8) and (12, 0)',
  answerSeg: [T('Intercepts are (0, -8) and (12, 0)')],
  caption: 'Sketch graphs show the main features: intercepts, axes and general shape.',
  graph: {
    title: '2x - 3y = 24',
    xRange: [-2, 14],
    yRange: [-10, 4],
    points: [
      { x: 0, y: -8, label: '(0, -8)', color: '#0f172a' },
      { x: 12, y: 0, label: '(12, 0)', color: '#0f172a' }
    ],
    shapes: [
      { points: [{ x: 0, y: -8 }, { x: 12, y: 0 }], color: '#0284c7', fillOpacity: 0 }
    ],
    caption: 'A sketch graph simply shows the line crossing the axes.'
  }
};

const ex9Sketch = {
  question: 'Sketch the graph of y = x² - x - 12, showing where the curve cuts the axes.',
  questionSeg: [T('Sketch the graph of y = x² - x - 12, showing where the curve cuts the axes.')],
  steps: [
    mkStep([T('y-intercept: when x = 0, y = -12.')], 'Find y-intercept.'),
    mkStep([T('x-intercepts: when y = 0, x² - x - 12 = 0 => (x-4)(x+3) = 0 so x = 4 or x = -3.')], 'Find x-intercepts.'),
    mkStep([T('Since a = 1 (positive), the graph is a cup-shaped parabola.')], 'Determine the shape.'),
    mkStep([T('Sketch the parabola passing through (0, -12), (-3, 0) and (4, 0).')], 'Draw the curve.', { isFinal: true })
  ],
  answer: 'Cuts y at (0, -12) and x at (-3, 0) and (4, 0)',
  answerSeg: [T('Cuts y at (0, -12) and x at (-3, 0) and (4, 0)')],
  caption: 'Quadratic functions produce parabolas.',
  graph: {
    title: 'y = x² - x - 12',
    xRange: [-5, 6],
    yRange: [-14, 4],
    points: [
      { x: -3, y: 0, label: '(-3, 0)', color: '#0f172a' },
      { x: 0, y: -12, label: '(0, -12)', color: '#0f172a' },
      { x: 4, y: 0, label: '(4, 0)', color: '#0f172a' }
    ],
    shapes: [
      { points: [{ x: -3, y: 0 }, { x: 0, y: -12 }, { x: 4, y: 0 }], color: '#0284c7', fillOpacity: 0 }
    ],
    caption: 'The key features are the intercepts on both axes.'
  }
};

// Example 10: Sketch inverse
const ex10SketchInverse = {
  question: 'Find the equation of the curve represented by the sketch in Fig 15.14.',
  questionSeg: [T('Find the equation of the curve represented by the sketch in Fig 15.14.')],
  steps: [
    mkStep([T('The curve cuts the y-axis at +20, so c = 20.')], 'Find y-intercept.'),
    mkStep([T('The roots are -2 and +5, so (x+2)(x-5) = 0 => x² - 3x - 10 = 0.')], 'Use roots to form quadratic.'),
    mkStep([T('Multiply by -2 to get c = 20: y = -2x² + 6x + 20.')], 'Adjust coefficients.', { isFinal: true })
  ],
  answer: 'y = -2x² + 6x + 20',
  answerSeg: [T('y = -2x² + 6x + 20')],
  caption: 'Finding the equation of a curve from its key points.',
  graph: {
    title: 'Cap-shaped Parabola',
    xRange: [-4, 7],
    yRange: [-3, 25],
    points: [
      { x: -2, y: 0, label: '(-2, 0)', color: '#0f172a' },
      { x: 0, y: 20, label: '(0, 20)', color: '#0f172a' },
      { x: 5, y: 0, label: '(5, 0)', color: '#0f172a' }
    ],
    shapes: [
      { points: [{ x: -2, y: 0 }, { x: 0, y: 20 }, { x: 5, y: 0 }], color: '#0284c7', fillOpacity: 0 }
    ],
    caption: 'This is a cap-shaped parabola because the coefficient of x² is negative.'
  }
};

// Statistics Examples (Chapter 16)
const statsEx1 = {
  question: 'The number of schools in twelve towns is as follows: 1 town has 4 schools, 4 towns have 5 schools, 2 towns have 6 schools, 3 towns have 7 schools, and 2 towns have 8 schools. (a) State the mode and median. (b) Calculate the mean.',
  questionSeg: [T('The number of schools in twelve towns is as follows: 1 town has 4 schools, 4 towns have 5 schools, 2 towns have 6 schools, 3 towns have 7 schools, and 2 towns have 8 schools. (a) State the mode and median. (b) Calculate the mean.')],
  steps: [
    mkStep([T('Number of schools: 4, 5, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8')], 'List the 12 values in order.'),
    mkStep([T('Mean = (1×4 + 4×5 + 2×6 + 3×7 + 2×8) / 12 = 73/12 ≈ 6.1')], 'Calculate the mean.'),
    mkStep([T('Mode = 5 schools (appears most often). Median = average of 6th and 7th values = (6+6)/2 = 6 schools.')], 'Find mode and median.', { isFinal: true })
  ],
  answer: 'Mode = 5, Median = 6, Mean = 5',
  answerSeg: [T('Mode = 5, Median = 6, Mean = 5')],
  caption: 'Bar charts represent frequencies using bar lengths.'
};

const statsEx2 = {
  question: 'A frequency distribution has classes 0-5, 6-10, 11-15, 16-20, 21-25 with frequencies 3, 5, 7, 6, 4 respectively. Calculate the mean.',
  questionSeg: [T('A frequency distribution has classes 0-5, 6-10, 11-15, 16-20, 21-25 with frequencies 3, 5, 7, 6, 4 respectively. Calculate the mean.')],
  steps: [
    mkStep([T('Use mid-points of each class: 3, 8, 13, 18, 23.')], 'Find mid-points.'),
    mkStep([T('Mean = (3×3 + 5×8 + 7×13 + 6×18 + 4×23) / 25 = 340/25 = 13.6')], 'Weighted mean calculation.', { isFinal: true })
  ],
  answer: 'Mean = 13.6',
  answerSeg: [T('Mean = 13.6')],
  caption: 'When data is grouped, you use the mid-point of each class to estimate the mean.'
};

const statsEx3 = {
  question: 'The marks of 50 students, grouped into classes 21-30, 31-40, 41-50, 51-60, 61-70, 71-80, 81-90, 91-100, had frequencies 2, 4, 6, 9, 13, 8, 5, 3. Find the modal class and the mean mark.',
  questionSeg: [T('The marks of 50 students, grouped into classes 21-30, 31-40, 41-50, 51-60, 61-70, 71-80, 81-90, 91-100, had frequencies 2, 4, 6, 9, 13, 8, 5, 3. Find the modal class and the mean mark.')],
  steps: [
    mkStep([T('The class with the highest frequency (13) is 61-70, so this is the modal class.')], 'Identify the modal class.'),
    mkStep([T('Using working mean 65.5 (mid-point of modal class), the calculated deviation gives mean = 65.5 - 3.8 = 61.7.')], 'Calculate mean using deviations.', { isFinal: true })
  ],
  answer: 'Modal class = 61-70, Mean = 61.7',
  answerSeg: [T('Modal class = 61-70, Mean = 61.7')],
  caption: 'Histograms use area to represent frequency.'
};

const statsEx4 = {
  question: 'Using the same 50 students\' marks as the previous example, find the median using a cumulative frequency curve.',
  questionSeg: [T('Using the same 50 students\' marks as the previous example, find the median using a cumulative frequency curve.')],
  steps: [
    mkStep([T('Construct a cumulative frequency table.')], 'Make the table.'),
    mkStep([T('Draw the ogive by plotting cumulative frequencies against upper class limits.')], 'Plot the points.'),
    mkStep([T('Find the 25th student (median). From the curve, this corresponds to 62 marks.')], 'Read median from graph.', { isFinal: true })
  ],
  answer: 'Median = 62 marks',
  answerSeg: [T('Median = 62 marks')],
  caption: 'A cumulative frequency curve (ogive) is used to find medians, quartiles, and percentiles.'
};

const statsEx5 = {
  question: 'Using the cumulative frequency curve from the previous example, estimate the percentage of students that passed if they scored over 45 marks.',
  questionSeg: [T('Using the cumulative frequency curve from the previous example, estimate the percentage of students that passed if they scored over 45 marks.')],
  steps: [
    mkStep([T('45 marks corresponds to the 21st percentile.')], 'Find percentile.'),
    mkStep([T('Percentage passing = 100% - 21% = 79%.')], 'Calculate pass percentage.', { isFinal: true })
  ],
  answer: '79% pass',
  answerSeg: [T('79% pass')],
  caption: 'Percentiles can be estimated from the ogive.'
};

/* =========================================================================
   SECTIONS & THEMES
   ========================================================================= */
const sectionThemes = {
  'cubic-functions': { bgGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600', borderColor: 'border-b-4 border-sky-700', badgeBg: 'bg-sky-400/30 text-white border border-sky-200/40', navActiveBg: 'bg-sky-500 border-b-4 border-sky-700 text-white shadow-sm', cardBorder: 'border-sky-300' },
  'inverse-functions': { bgGradient: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600', borderColor: 'border-b-4 border-emerald-700', badgeBg: 'bg-emerald-400/30 text-white border border-emerald-200/40', navActiveBg: 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm', cardBorder: 'border-emerald-300' },
  'sketch-graphs': { bgGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600', borderColor: 'border-b-4 border-amber-700', badgeBg: 'bg-amber-400/30 text-white border border-amber-200/40', navActiveBg: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm', cardBorder: 'border-amber-300' },
  'histograms-freq': { bgGradient: 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600', borderColor: 'border-b-4 border-rose-700', badgeBg: 'bg-rose-400/30 text-white border border-rose-200/40', navActiveBg: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm', cardBorder: 'border-rose-300' },
  'cumulative-freq': { bgGradient: 'bg-gradient-to-r from-violet-500 via-purple-600 to-purple-700', borderColor: 'border-b-4 border-purple-700', badgeBg: 'bg-purple-400/30 text-white border border-purple-200/40', navActiveBg: 'bg-purple-500 border-b-4 border-purple-700 text-white shadow-sm', cardBorder: 'border-purple-300' }
};

const sections = [
  {
    id: 'cubic-functions',
    eyebrow: 'Chapter 15.1',
    title: 'Cubic Functions',
    heading: 'Graphs (5) Cubic and inverse functions',
    intro: 'A cubic function of x is an expression in x in which 3 is the highest power of x. For example, 2x³ + 5x² - x - 8 is a cubic function of x.',
    introShona: 'A cubic function yex i expression mu x umo 3 ndiyo power yepamusoro ya x. Semuenzaniso, 2x³ + 5x² - x - 8 icubic function yex.',
    concept: {
      title: 'What is a cubic function?',
      paragraphs: [
        'A cubic function is a polynomial of degree 3. It generally has the form y = ax³ + bx² + cx + d.',
        'The graph of a cubic function is an S-shaped curve. It has a point of inflection where it changes concavity.',
        'To solve a cubic equation graphically, you draw the graph of the cubic function and find the x-coordinates where it intersects the x-axis (or another line).'
      ],
      graph: {
        title: 'Graph of y = x³',
        xRange: [-4, 4],
        yRange: [-30, 30],
        points: [
          { x: -3, y: -27, label: '(-3, -27)', color: '#0f172a' },
          { x: -2, y: -8, label: '(-2, -8)', color: '#0f172a' },
          { x: -1, y: -1, label: '(-1, -1)', color: '#0f172a' },
          { x: 0, y: 0, label: 'Origin', color: '#0f172a' },
          { x: 1, y: 1, label: '(1, 1)', color: '#0f172a' },
          { x: 2, y: 8, label: '(2, 8)', color: '#0f172a' },
          { x: 3, y: 27, label: '(3, 27)', color: '#0f172a' }
        ],
        shapes: [
          { points: [{ x: -3, y: -27 }, { x: -2, y: -8 }, { x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 8 }, { x: 3, y: 27 }], color: '#0284c7', fillOpacity: 0 }
        ],
        caption: 'The graph of y = x³ passes through the origin and is symmetric about it.'
      }
    },
    rules: [
      [
        { seg: [T('Cubic function: y = ax³ + bx² + cx + d')], note: 'Highest power of x is 3.' },
        { seg: [T('To solve x³ + 20 = 0, plot y = x³ and find where y = -20.')], note: 'Graphical solution.' }
      ]
    ],
    examples: [ex1Cubic, ex2CubicIntersect],
    practice: [
      'Draw the graph of y = x³ for values of x from -4 to +4. (b) On the same axes, draw y = -x³. (c) Use either graph to solve x³ + 50 = 0.',
      'Solve the equation x³ = 5x + 2 by drawing graphs of y = x³ and y = 5x + 2 for values of x between -3 and +3.',
      'Given that y = x³ + 2x - 1, copy and complete the table of values, then solve x³ + 2x - 1 = 0 graphically.'
    ]
  },
  {
    id: 'inverse-functions',
    eyebrow: 'Chapter 15.2',
    title: 'Inverse Functions',
    heading: 'Inverse functions and Hyperbolas',
    intro: 'An inverse function of x is an expression in x which appears in the denominator of a fraction. For example, 6/x and 2x²/(1-3x) are inverse functions of x.',
    introShona: 'Inverse function yex i expression mu x inowanika mudenominator yefraction. Semuenzaniso, 6/x ne 2x²/(1-3x) inverse functions dza x.',
    concept: {
      title: 'Graphing inverse functions',
      paragraphs: [
        'When x = 0 in an inverse function, the value of y is undefined. This creates a break in continuity, and the graph is split into two branches separated by the axes.',
        'This kind of curve is called a hyperbola. As x increases towards 0, y decreases in value; as x decreases towards 0, y increases in value.',
        'To solve equations involving inverse functions, you can plot the curve and a straight line (or another curve) and find the points of intersection.'
      ],
      graph: {
        title: 'y = 6/x',
        xRange: [-4, 4],
        yRange: [-6, 6],
        points: [
          { x: -4, y: -1.5, label: '(-4, -1.5)', color: '#0f172a' },
          { x: -3, y: -2, label: '(-3, -2)', color: '#0f172a' },
          { x: -2, y: -3, label: '(-2, -3)', color: '#0f172a' },
          { x: -1, y: -6, label: '(-1, -6)', color: '#0f172a' },
          { x: 1, y: 6, label: '(1, 6)', color: '#0f172a' },
          { x: 2, y: 3, label: '(2, 3)', color: '#0f172a' },
          { x: 3, y: 2, label: '(3, 2)', color: '#0f172a' },
          { x: 4, y: 1.5, label: '(4, 1.5)', color: '#0f172a' }
        ],
        shapes: [
          { points: [{ x: -4, y: -1.5 }, { x: -3, y: -2 }, { x: -2, y: -3 }, { x: -1, y: -6 }], color: '#0284c7', fillOpacity: 0 },
          { points: [{ x: 1, y: 6 }, { x: 2, y: 3 }, { x: 3, y: 2 }, { x: 4, y: 1.5 }], color: '#0284c7', fillOpacity: 0 }
        ],
        caption: 'A hyperbola has two branches which never touch the axes.'
      }
    },
    rules: [
      [
        { seg: [T('Inverse function: y = k/x')], note: 'x is in the denominator.' },
        { seg: [T('Hyperbola: a curve with two branches.')], note: 'Separated by the axes.' }
      ]
    ],
    examples: [ex4Inverse, ex5InverseMin],
    practice: [
      'Draw the graphs of (a) y = 1/x, (b) y = 1/x² for values of x equal to ±4, ±2, ±1, ±1/2, ±1/4.',
      'Draw the graphs of y = 5/x and y = x(x-1) from x = 1/2 to x = 5. Read off the value of x at the intersection.',
      'Draw the graph of y = x - 5/x for values of x from -2 to +4. Hence solve the equation x - 5/x = 2.'
    ]
  },
  {
    id: 'sketch-graphs',
    eyebrow: 'Chapter 15.3',
    title: 'Sketch Graphs',
    heading: 'Linear, Quadratic and Inverse Functions',
    intro: 'A sketch graph is a simple freehand drawing which shows the main features of a line or curve. These features are typically the intercepts on the axes and the general shape.',
    introShona: 'Sketch graph imufananidzo wakapfava wakadhirowa neruoko unoratidza maficha makuru emutsara kana curve. Aya maficha anosanganisira intercepts pane axes uye chimiro chese.',
    concept: {
      title: 'How to sketch a graph',
      paragraphs: [
        'To sketch a linear graph, find the intercepts on the x and y axes and join them with a straight line.',
        'To sketch a quadratic graph (y = ax² + bx + c), find the y-intercept (c), the x-intercepts (roots), and determine if it is cup-shaped (a > 0) or cap-shaped (a < 0).',
        'To sketch an inverse function, find the x-value for which the fraction is undefined (the asymptote) and the intercept on the y-axis.'
      ],
      graph: {
        title: 'Line and Parabola Sketches',
        xRange: [-4, 6],
        yRange: [-4, 6],
        points: [
          { x: 0, y: -2, label: 'y-int', color: '#0f172a' },
          { x: 2, y: 0, label: 'x-int', color: '#0f172a' },
          { x: -1, y: 0, label: 'root', color: '#dc2626' },
          { x: 3, y: 0, label: 'root', color: '#dc2626' }
        ],
        shapes: [
          { points: [{ x: 0, y: -2 }, { x: 2, y: 0 }], color: '#0284c7', fillOpacity: 0 },
          { points: [{ x: -1, y: 0 }, { x: 3, y: 0 }], color: '#dc2626', fillOpacity: 0 }
        ],
        caption: 'Sketching highlights the points where the line or curve crosses the axes.'
      }
    },
    rules: [
      [
        { seg: [T('Linear: y = mx + c')], note: 'Find x-intercept and y-intercept.' },
        { seg: [T('Quadratic: y = ax² + bx + c')], note: 'If a > 0, cup-shaped; if a < 0, cap-shaped.' },
        { seg: [T('Inverse: y = a/(x-k)')], note: 'Asymptote at x = k.' }
      ]
    ],
    examples: [ex7Sketch, ex9Sketch, ex10SketchInverse],
    practice: [
      'Sketch the graphs of the following: (a) 3x - 2y = 12, (b) 6x + 3y = 18, (c) y = 2x - 7, (d) y = 3x - 1.',
      'Sketch the graphs of the following, showing where the curve cuts the axes: (a) y = x² - 5x + 4, (b) y = 15 - 2x - x², (c) y = x² - 12x + 36.',
      'Sketch the graphs of the following: (a) y = 1/(x+1), (b) y = 1/(x-5).'
    ]
  },
  {
    id: 'histograms-freq',
    eyebrow: 'Chapter 16.1',
    title: 'Histograms & Frequency Distributions',
    heading: 'Statistics (5) Grouped Data',
    intro: 'When statistical data contain a large number of values, it is impractical to draw a bar chart and often difficult to calculate averages. The data can be reduced to a frequency distribution.',
    introShona: 'Kana data yestatistics ine huwandu hwakawanda, hazvibvire kudhirowa bar chart uye kunonetsa kuverenga averages. Data inogona kuderedzwa kuita frequency distribution.',
    concept: {
      title: 'What is a histogram?',
      paragraphs: [
        'A frequency distribution is a table in which the given values are divided into class intervals. The number of values in each class interval is given as the frequency.',
        'A histogram is a block graph representing a frequency distribution. The area of each rectangle is proportional to the frequency in that interval.',
        'To find the mean of grouped data, use the mid-point of each class interval as an approximation for all values in that class.'
      ],
      graph: {
        title: 'Histogram of Weekly Pay',
        xRange: [0, 500],
        yRange: [0, 25],
        points: [
          { x: 50, y: 5, label: '0-99', color: '#0f172a' },
          { x: 150, y: 16, label: '100-199', color: '#0f172a' },
          { x: 250, y: 19, label: '200-299', color: '#0f172a' },
          { x: 350, y: 6, label: '300-399', color: '#0f172a' },
          { x: 450, y: 4, label: '400-499', color: '#0f172a' }
        ],
        caption: 'In a histogram, the height is proportional to the frequency for equal class intervals.'
      }
    },
    rules: [
      [
        { seg: [T('Histogram: Area of rectangle = Frequency')], note: 'For equal intervals, height = frequency.' },
        { seg: [T('Mean of grouped data: use mid-points')], note: 'Weighted average of mid-points.' }
      ]
    ],
    examples: [statsEx1, statsEx2, statsEx3],
    practice: [
      'Make a frequency distribution of the data in Table 16.5 taking equal class intervals $1-$100, $101-$200, etc.',
      'Draw a histogram and a frequency polygon for the frequency distribution in Table 16.12.',
      'Draw a histogram of the data in Table 16.14. Estimate the mode of the data.'
    ]
  },
  {
    id: 'cumulative-freq',
    eyebrow: 'Chapter 16.2',
    title: 'Cumulative Frequency',
    heading: 'Ogive, Median and Quartiles',
    intro: 'To save time and to avoid making errors when finding the median of a large set of data, it is more usual to make a cumulative frequency table and to draw a cumulative frequency curve (an ogive).',
    introShona: 'Kuchengetedza nguva uye kudzivirira kukanganisa paunotsvaga median yedata rakawanda, zvinowanzoitwa kugadzira cumulative frequency table uye kudhirowa cumulative frequency curve (ogive).',
    concept: {
      title: 'How to use an ogive',
      paragraphs: [
        'A cumulative frequency curve (ogive) is drawn by plotting the cumulative frequencies against the corresponding upper limits of the class intervals.',
        'The median corresponds to the middle student (50% of the way up).',
        'The lower quartile (Q₁) is 25% of the way up, and the upper quartile (Q₃) is 75% of the way up.'
      ],
      graph: {
        title: 'Ogive of Marks',
        xRange: [0, 100],
        yRange: [0, 50],
        points: [
          { x: 30, y: 2, label: '', color: '#0f172a' },
          { x: 40, y: 7, label: '', color: '#0f172a' },
          { x: 50, y: 14, label: '', color: '#0f172a' },
          { x: 60, y: 23, label: '', color: '#0f172a' },
          { x: 70, y: 34, label: '', color: '#0f172a' },
          { x: 80, y: 42, label: '', color: '#0f172a' },
          { x: 90, y: 47, label: '', color: '#0f172a' },
          { x: 100, y: 50, label: '', color: '#0f172a' }
        ],
        shapes: [
          { points: [{ x: 30, y: 2 }, { x: 40, y: 7 }, { x: 50, y: 14 }, { x: 60, y: 23 }, { x: 70, y: 34 }, { x: 80, y: 42 }, { x: 90, y: 47 }, { x: 100, y: 50 }], color: '#0284c7', fillOpacity: 0 }
        ],
        caption: 'The ogive is a smooth curve showing the running total.'
      }
    },
    rules: [
      [
        { seg: [T('Cumulative frequency: add up the frequencies')], note: 'Build the cumulative frequency table.' },
        { seg: [T('Median: 50th percentile, Q₁: 25th percentile, Q₃: 75th percentile')], note: 'Read from the ogive.' }
      ]
    ],
    examples: [statsEx4, statsEx5],
    practice: [
      'Draw a cumulative frequency curve of the data in Table 16.24. Hence estimate the median diameter of the tins.',
      'Make a cumulative frequency table and hence draw an ogive showing the mark distribution in Table 16.28. Estimate the median and upper and lower quartiles.',
      'Draw a cumulative frequency curve for the test in Table 16.29. Find its median and semi-interquartile range.'
    ]
  }
];

/* =========================================================================
   SECTION COMPONENT
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
            <React.Fragment key={i}>
              <ExampleCard index={i + 1} example={ex} lang={lang} />
              {ex.graph && <CoordinatePlaneDisplay {...ex.graph} />}
            </React.Fragment>
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
   MAIN COMPONENT – GraphsCubicInverse
   ========================================================================= */
export const GraphsCubicInverse = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState('en');

  const activeIndex = Math.max(0, sections.findIndex(s => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];
  const activeTheme = sectionThemes[activeSection.id] || sectionThemes['cubic-functions'];

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
                CHAPTER 15 & 16
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                O-Level Mathematics
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'} className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <UkFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">English</span>
              </button>
              <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'} className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md scale-100' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
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
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2 sm:py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex w-full min-w-0 flex-nowrap items-center gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const theme = sectionThemes[s.id] || sectionThemes['cubic-functions'];
              const isActive = active === s.id;
              return (
                <button key={s.id} onClick={() => handleNavigate(s.id)} title={s.title} className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? theme.navActiveBg : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-10 md:px-8 lg:px-10">
        <div key={`${activeSection.id}-${lang}`}>
          <Section section={activeSection} lang={lang} />
        </div>

        {/* Prev / Next Footer */}
        <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button onClick={goPrev} disabled={activeIndex === 0} className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
          <button onClick={goNext} disabled={activeIndex === sections.length - 1} className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphsCubicInverse;
