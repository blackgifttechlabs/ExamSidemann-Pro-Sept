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
import { VariationLesson } from './lessonEngine';
import { INVERSE_LESSON, JOINT_LESSON, PARTIAL_LESSON, EXAMPLE_LIBRARY_LESSON, DIRECT_REAL_QUESTION } from './variationLessonData';

/* =========================================================================
   FONTS + SHARED STYLES
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
   GEOMETRY HELPERS
   ========================================================================= */
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const toScreen = (origin, scale) => (mx, my) => ({ x: origin.x + mx * scale, y: origin.y - my * scale });

/* =========================================================================
   ACTION CREATORS
   ========================================================================= */
let uidCounter = 0;
const nextId = () => `vr${uidCounter++}`;

const mkLine = (from, to, narration, opts: any = {}) => ({
  id: nextId(), kind: 'line', from, to, length: dist(from, to), narration,
  duration: opts.duration ?? 850, color: opts.color ?? '#1e3a8a', width: opts.width ?? 2.4,
  dashed: opts.dashed ?? false,
});

const mkPoint = (p, label, narration, opts: any = {}) => ({
  id: nextId(), kind: 'point', p, label, narration, duration: opts.duration ?? 420,
  color: opts.color ?? '#0f172a', labelOffset: opts.labelOffset ?? { x: 9, y: -9 },
});

const mkNote = (anchor, narration, opts: any = {}) => ({
  id: nextId(), kind: 'note', p: anchor, narration, duration: opts.duration ?? 900,
});

const mkLabel = (p, text, opts: any = {}) => ({
  id: nextId(), kind: 'label', p, text, narration: '', duration: opts.duration ?? 60,
  color: opts.color ?? '#94a3b8', fontSize: opts.fontSize ?? 11, anchor: opts.anchor ?? 'middle',
});

/* =========================================================================
   ANIMATION ENGINE
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
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!playing) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
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
      {title && <div className="border-b border-slate-100 px-4 py-2 text-base font-bold text-slate-700">{title}</div>}
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
            <div className="mt-2 flex items-center justify-between text-base font-semibold tabular-nums text-slate-800">
              <span>{formatPlayerTime(time)}</span>
              <span>{formatPlayerTime(total)}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
              <button onClick={toggle} className="shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-sm font-black text-white transition-all active:scale-95" style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {playing ? 'PAUSE' : time >= total ? 'PLAY ▶' : time > 0 ? 'RESUME ▶' : 'PLAY ▶'}
              </button>
              <button onClick={restart} className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-500">
                Restart
              </button>
              <label className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-500">
                Speed
                <select
                  value={speed}
                  onChange={(event) => setSpeed(Number(event.target.value))}
                  className="rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
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
          <h5 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-400">Working</h5>
          <ol className="space-y-2">
            {narrations.length === 0 && <li className="text-base italic text-slate-400">Press play to begin…</li>}
            {narrations.map((a) => {
              const isCurrent = time < a.end;
              return (
                <li key={a.id} className={`gc-ink text-[1.05rem] leading-snug ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                  <span className="mr-1">{isCurrent ? '✎' : '✓'}</span>
                  {a.narration}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      {caption && <p className="border-t border-slate-100 px-4 py-2 text-sm italic text-slate-500">{caption}</p>}
    </div>
  );
};

/* =========================================================================
   INTERACTIVE DEMOS (Variation)
   ========================================================================= */

const useDemoPlayback = (minimum, maximum, initial = maximum, duration = 6500) => {
  const [value, setValue] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const valueRef = useRef(initial);
  const frameRef = useRef<number | null>(null);
  const lastRef = useRef(0);

  useEffect(() => { valueRef.current = value; }, [value]);
  useEffect(() => {
    if (!playing) return undefined;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - lastRef.current;
      lastRef.current = now;
      const next = Math.min(maximum, valueRef.current + (((maximum - minimum) * elapsed) / duration) * speed);
      valueRef.current = next;
      setValue(next);
      if (next >= maximum) setPlaying(false);
      else frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); };
  }, [duration, maximum, minimum, playing, speed]);

  const toggle = () => {
    if (playing) { setPlaying(false); return; }
    if (valueRef.current >= maximum) {
      valueRef.current = minimum;
      setValue(minimum);
    }
    setPlaying(true);
  };
  const restart = () => {
    valueRef.current = minimum;
    setValue(minimum);
    setPlaying(true);
  };
  const scrub = (next) => {
    setPlaying(false);
    valueRef.current = next;
    setValue(next);
  };
  return { value, playing, speed, setSpeed, toggle, restart, scrub };
};

const DemoButtons = ({ playing, speed, onSpeedChange, onToggle, onRestart }) => (
  <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
    <button onClick={onToggle} className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-black text-white transition-all active:scale-95" style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
      <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
      {playing ? 'PAUSE' : 'PLAY ▶'}
    </button>
    <button onClick={onRestart} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-600">
      Restart
    </button>
    <label className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-500">
      Speed
      <select value={speed} onChange={(event) => onSpeedChange(Number(event.target.value))} className="rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-bold text-slate-700">
        <option value={0.5}>0.5×</option>
        <option value={1}>1×</option>
        <option value={1.5}>1.5×</option>
        <option value={2}>2×</option>
      </select>
    </label>
  </div>
);

const DIRECT_LESSON = [
  { h: 'What does "varies directly" mean?' },
  { p: 'Imagine that you are buying sweets. Each sweet costs $2.' },
  { table: [['Number of sweets', 'Cost'], ['1', '$2'], ['2', '$4'], ['3', '$6'], ['4', '$8']] },
  { p: 'When the number of sweets doubles from 1 to 2, the cost also doubles from $2 to $4. When it changes from 1 to 3, the cost changes from $2 to $6. When it changes from 2 to 4, the cost doubles from $4 to $8. The two quantities change together at the same rate. This is called **direct variation**.' },
  { p: '**In simple English:** when one quantity changes, the other changes in the same proportion. If one doubles, the other doubles. If one triples, the other triples.' },

  { h: 'How can we recognise direct variation?' },
  { p: 'Look at this table and compare `y` with `x` by dividing.' },
  { table: [['x', '1', '2', '3', '4'], ['y', '3', '6', '9', '12']] },
  { p: '`3 ÷ 1 = 3`, `6 ÷ 2 = 3`, `9 ÷ 3 = 3`, `12 ÷ 4 = 3`. The answer is always 3, so `y` is directly proportional to `x`. We write `y ∝ x`. The symbol `∝` means "is proportional to", so `y ∝ x` means "`y` varies directly as `x`".' },

  { c: true },
  { h: 'The important rule' },
  { p: 'When a question says "`y` varies directly as `x`", write:' },
  { f: 'y = kx' },
  { p: 'The letter `k` is a fixed number called the **constant of proportionality**. It tells us exactly how `x` and `y` are connected. If `k = 3` then `y = 3x`. If `k = 5` then `y = 5x`. Memory trick: **direct means multiply by k**.' },

  { h: 'Finding the constant k' },
  { solver: {
    title: 'Find k',
    problem: 'y varies directly as x. When x = 5, y = 20. Find k.',
    steps: [
      { text: 'y = kx', why: 'It says "varies directly", so write y = kx.' },
      { text: '20 = k(5)', why: 'Put in the values: y = 20 and x = 5.' },
      { text: '20 ÷ 5 = k', why: 'k is multiplied by 5, so divide both sides by 5.' },
      { text: 'k = 4', why: 'This number is the constant of proportionality.' },
    ],
    answer: 'k = 4',
  } },

  { h: 'Finding the complete formula' },
  { p: 'Once we know `k`, we put it back into `y = kx`. This gives the equation connecting `y` and `x`, and we can use it to find `y` for any `x`.' },
  { solver: {
    title: 'Find the formula',
    problem: 'We found k = 4. Write the formula connecting y and x, then find y when x = 10.',
    steps: [
      { text: 'y = kx', why: 'Start with the direct variation formula.' },
      { text: 'y = 4x', why: 'Replace k with 4. This is the formula.' },
      { text: 'y = 4(10)', why: 'To find y when x = 10, put 10 in place of x.' },
      { text: 'y = 40', why: 'Multiply: 4 × 10 = 40.' },
    ],
    answer: 'y = 4x, and y = 40 when x = 10',
  } },

  { h: 'The method to remember' },
  { p: 'When a question says one quantity varies directly as another: (1) write `y = kx`; (2) use the values in the question to find `k`; (3) put `k` into the formula; (4) use the formula to find the unknown.' },
  { f: 'Write → Find k → Make the formula → Find the unknown' },

  { c: true },
  { h: "Let's try one together" },
  { p: 'Watch the working being written, then try the next question yourself.' },
  { solver: {
    title: 'Find k',
    problem: 'p varies directly as q. When q = 4, p = 20. Find k.',
    steps: [
      { text: 'p = kq', why: 'It says "varies directly", so write p = kq.' },
      { text: '20 = k(4)', why: 'Put in the values: p = 20 and q = 4.' },
      { text: '20 ÷ 4 = k', why: 'k is multiplied by 4, so divide both sides by 4.' },
      { text: 'k = 5', why: 'So the equation is p = 5q.' },
    ],
    answer: 'k = 5, so p = 5q',
  } },
  { solver: {
    title: 'Find another value',
    problem: 'Using p = 5q, find p when q = 10.',
    steps: [
      { text: 'p = 5q', why: 'We already know the formula, so we do not start again.' },
      { text: 'p = 5(10)', why: 'Put 10 in place of q.' },
      { text: 'p = 50', why: 'Multiply: 5 × 10 = 50.' },
    ],
    answer: 'p = 50',
  } },

  { c: true },
  { h: 'Direct variation from a table', big: true },
  { p: 'Sometimes you are given a table and asked what type of relationship it shows.' },
  { table: [['x', '2', '4', '6', '8'], ['y', '6', '12', '18', '24']] },
  { p: 'Calculate `y ÷ x` for each pair: `6 ÷ 2 = 3`, `12 ÷ 4 = 3`, `18 ÷ 6 = 3`, `24 ÷ 8 = 3`. The ratio is always 3, so `y ∝ x` and `y = 3x`.' },
  { p: '**Important:** if `y ÷ x` has the same value for every pair, the quantities are directly proportional.' },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Find the constant', lines: ['`y` varies directly as `x`.', 'When `x = 6`, `y = 24`. Find `k`.'], skill: 'Practice question. Skill: writing y = kx and solving for k.', solution: ['`y = kx`', '`24 = k(6)`', '`k = 24 ÷ 6 =` **4**'] },
    { level: 'Easy', topic: 'Write the equation', lines: ['`p` varies directly as `q`.', 'When `q = 8`, `p = 40`.', 'Find the equation connecting `p` and `q`.'], skill: 'Practice question. Skill: finding k, then writing the equation.', solution: ['`p = kq`', '`40 = 8k`, so `k = 5`', 'The equation is **p = 5q**'] },
    { level: 'Easy', topic: 'Use a formula', lines: ['`y = 7x`.', 'Find `y` when `x = 15`.'], skill: 'Practice question. Skill: substituting into a known formula.', solution: ['`y = 7(15)`', '**y = 105**'] },
    { level: 'Easy / Medium', topic: 'Is it direct variation?', lines: ['The table shows values of `x` and `y`.', 'x = 2, 5, 8 and y = 6, 15, 24.', 'Is `y` directly proportional to `x`?'], skill: 'Practice question. Skill: checking that y ÷ x is always the same.', solution: ['`6 ÷ 2 = 15 ÷ 5 = 24 ÷ 8 = 3`', 'Yes. The ratio is always 3, so **y = 3x**'] },
    { level: 'Easy / Medium', topic: 'Find a missing value', lines: ['`P` varies directly as `Q`.', 'When `Q = 5`, `P = 12`.', 'Find `P` when `Q = 20`.'], skill: 'Practice question. Skill: finding k first, then using the formula.', solution: ['`P = kQ`', '`12 = 5k`, so `k = 2.4`, and `P = 2.4Q`', '`P = 2.4(20) =` **48**'] },
    { level: 'Medium', topic: 'Distance and time', lines: ['A car travels a distance `D` which varies directly with time `T`.', 'The car travels 300 km in 4 hours.', '(a) Find the equation connecting `D` and `T`.', '(b) Find the distance travelled in 7 hours.'], skill: 'Practice question. Skill: turning a word problem into D = kT.', solution: ['(a) `D = kT`', '`300 = 4k`, so `k = 75`', 'The equation is **D = 75T**', '(b) `D = 75(7) =` **525 km**'] },
    DIRECT_REAL_QUESTION,
    { level: 'Hard', topic: 'Direct variation with a square root', lines: ['`H` varies directly as `√Q`.', 'When `H = 51`, `Q = 289`.', 'Find `Q` when `H = 81`.'], skill: 'Practice question. Skill: using H = k√Q.', solution: ['`H = k√Q`', '`51 = k√289 = 17k`, so `k = 3`', '`H = 3√Q`', '`81 = 3√Q`, so `27 = √Q`', '**Q = 729**'] },
  ] },
  { p: '**The one thing to remember:** when you see "varies directly as", think **directly → × k**. Then write `y = kx`. If there is a power, write `y = kx²` or `y = kx³`. If there is a square root, write `y = k√x`.' },
];


const DirectVariationDemo = () => <VariationLesson lesson={DIRECT_LESSON} />;
const InverseVariationDemo = () => <VariationLesson lesson={INVERSE_LESSON} />;
const JointVariationDemo = () => <VariationLesson lesson={JOINT_LESSON} />;
const PartialVariationDemo = () => <VariationLesson lesson={PARTIAL_LESSON} />;
const ExampleLibraryDemo = () => <VariationLesson lesson={EXAMPLE_LIBRARY_LESSON} />;

/* =========================================================================
   DIAGRAM BUILDERS FOR WORKED EXAMPLES
   ========================================================================= */

function build_Example1Diagram() {
  const S = toScreen({ x: 150, y: 210 }, 20);
  const A = S(0, 0), B = S(3, 48); // D = 16T, T=3, D=48
  const axes = [
    mkLine(S(-1, 0), S(5, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -5), S(0, 60), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLabel({ x: S(3, 0).x, y: S(3, 0).y + 15 }, '3'),
    mkLabel({ x: S(0, 48).x - 12, y: S(0, 48).y + 4 }, '48'),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(A, 'A', 'Plot A(0,0) since D=0 when T=0.'),
    mkPoint(B, 'B(3, 48)', 'Plot the point where T=3, D=48.'),
    mkLine(A, B, '', { color: '#1e3a8a' }),
    mkNote(B, 'The gradient of this line is 48/3 = 16, so D = 16T.'),
  ];
  return { viewBox: '0 0 300 260', actions, caption: 'Graph of D = 16T is a straight line through the origin.' };
}

function build_Example2Diagram() {
  const S = toScreen({ x: 80, y: 180 }, 25);
  const P1 = S(5, 7.5), P2 = S(11, 16.5), origin = S(0, 0);
  const axes = [
    mkLine(S(-1, 0), S(14, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -1), S(0, 20), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLabel({ x: S(5, 0).x, y: S(5, 0).y + 15 }, '5'),
    mkLabel({ x: S(11, 0).x, y: S(11, 0).y + 15 }, '11'),
    mkLabel({ x: S(0, 7.5).x - 12, y: S(0, 7.5).y + 4 }, '7.5'),
    mkLabel({ x: S(0, 16.5).x - 12, y: S(0, 16.5).y + 4 }, '16.5'),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(P1, 'P1', 'Plot the first point (5, 7.5).'),
    mkPoint(P2, 'P2', 'Plot the second point (11, 16.5).'),
    mkLine(origin, P2, 'Draw the line through origin and these points.', { color: '#be185d' }),
    mkNote(P1, 'Gradient = 16.5/11 = 7.5/5 = 1.5, so E = 1.5T.'),
  ];
  return { viewBox: '0 0 320 240', actions, caption: 'Since the graph is a straight line through origin, E ∝ T.' };
}

function build_Example3Diagram() {
  const S = toScreen({ x: 120, y: 180 }, 15);
  const pts = [];
  for (let x = 0; x <= 16; x += 2) pts.push(S(x, 1.5 * Math.sqrt(x)));
  const P1 = S(9, 4.5), P2 = S(25, 7.5); // not on svg? scale must fit
  const A = S(9, 4.5), B = S(16, 6);
  const axes = [
    mkLine(S(-1, 0), S(20, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -1), S(0, 8), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLabel({ x: S(9, 0).x, y: S(9, 0).y + 15 }, '9'),
    mkLabel({ x: S(0, 4.5).x - 12, y: S(0, 4.5).y + 4 }, '4.5'),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(A, 'A(9,4.5)', 'Plot the point where x=9, y=4.5.'),
    mkPoint(B, 'B(16,6)', 'Plot the point where x=16, y=6.'),
    mkLine(S(0, 0), B, 'Draw the curve.', { color: '#059669', dashed: false }),
    mkNote(A, 'y = 1.5√x is the relationship.'),
  ];
  return { viewBox: '0 0 360 240', actions, caption: 'Graph of y = 1.5√x, a parabola-like curve rising slowly.' };
}

function build_Example5Diagram() {
  const S = toScreen({ x: 150, y: 180 }, 2);
  const A = S(6, 220), B = S(8, 165);
  const axes = [
    mkLine(S(-2, 0), S(15, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -5), S(0, 250), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLabel({ x: S(6, 0).x, y: S(6, 0).y + 15 }, '6'),
    mkLabel({ x: S(8, 0).x, y: S(8, 0).y + 15 }, '8'),
    mkLabel({ x: S(0, 220).x - 12, y: S(0, 220).y + 4 }, '220'),
    mkLabel({ x: S(0, 165).x - 12, y: S(0, 165).y + 4 }, '165'),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(A, 'A(6,220)', 'Plot (6, 220).'),
    mkPoint(B, 'B(8,165)', 'Plot (8, 165).'),
    mkLine(S(0, 0), B, 'Hyperbola curve.', { color: '#be185d', dashed: true }),
    mkNote(A, 'V = 1320/n, so when n=8, V=165.'),
  ];
  return { viewBox: '0 0 340 260', actions, caption: 'Inverse relationship: V decreases as n increases.' };
}

function build_Example9Diagram() {
  const S = toScreen({ x: 80, y: 150 }, 10);
  const A = S(10, 45), B = S(24, 87), C = S(18, 69);
  const axes = [
    mkLine(S(-2, 0), S(30, 0), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLine(S(0, -5), S(0, 100), '', { color: '#94a3b8', duration: 250, width: 1.2 }),
    mkLabel({ x: S(10, 0).x, y: S(10, 0).y + 15 }, '10'),
    mkLabel({ x: S(24, 0).x, y: S(24, 0).y + 15 }, '24'),
    mkLabel({ x: S(0, 45).x - 12, y: S(0, 45).y + 4 }, '45'),
    mkLabel({ x: S(0, 87).x - 12, y: S(0, 87).y + 4 }, '87'),
    mkLabel({ x: S(0, 0).x - 10, y: S(0, 0).y + 15 }, '0'),
  ];
  const actions = [
    ...axes,
    mkPoint(A, 'A(10,45)', 'Plot (10, 45).'),
    mkPoint(B, 'B(24,87)', 'Plot (24, 87).'),
    mkLine(A, B, 'Draw the straight line.', { color: '#059669' }),
    mkNote(C, 'At N=18, C=69. Formula: C=15+3N.'),
  ];
  return { viewBox: '0 0 340 240', actions, caption: 'Graph of C = 15 + 3N is a straight line not through origin.' };
}

/* =========================================================================
   WORKED EXAMPLE DATA
   ========================================================================= */
const example1 = {
  tag: 'Worked Example 1', question: 'If D ∝ T and D = 80 when T = 5, find (a) the relationship between D and T, (b) the value of T when D = 56.',
  steps: [
    'Since D ∝ T, D = kT for some constant k.',
    'When D = 80, T = 5: 80 = k × 5, so k = 16.',
    '(a) The relationship is D = 16T.',
    '(b) When D = 56: 56 = 16T, so T = 56/16 = 3½.',
  ],
  answer: '(a) D = 16T (b) T = 3½', build: build_Example1Diagram,
};

const example2 = {
  tag: 'Worked Example 2', question: 'Table 9.1 shows the extension E cm in an elastic string when pulled by a force of T newtons. (a) Show that E is directly proportional to T. (b) Find the value of E when T = 8.',
  table: { T: [5, 8, 11], E: [7.5, null, 16.5] },
  steps: [
    'If E ∝ T, then E/T should have a constant value.',
    'When T = 5, E = 7.5, so E/T = 7.5/5 = 1.5.',
    'When T = 11, E = 16.5, so E/T = 16.5/11 = 1.5.',
    'Since E/T = 1.5 in both cases, E is directly proportional to T.',
    'E = 1.5T. When T = 8, E = 1.5 × 8 = 12.',
  ],
  answer: '(a) Shown (b) E = 12', build: build_Example2Diagram,
};

const example3 = {
  tag: 'Worked Example 3', question: 'y ∝ √x, and y = 4½ when x = 9. (a) Find the relationship between x and y. (b) Find y when x = 25. (c) Find x when y = 6. (d) Sketch the graph of y ∝ √x.',
  steps: [
    'y = k√x for some constant k.',
    'When x = 9, y = 4½: 4.5 = k × 3, so k = 1.5.',
    '(a) y = 1.5√x.',
    '(b) When x = 25: y = 1.5 × 5 = 7.5.',
    '(c) When y = 6: 6 = 1.5√x → √x = 4 → x = 16.',
    '(d) Sketch showing the curve rising from the origin, increasing at a decreasing rate.',
  ],
  answer: '(a) y = 1.5√x (b) y = 7.5 (c) x = 16', build: build_Example3Diagram,
};

const example4 = {
  tag: 'Worked Example 4', question: 'x is directly proportional to the square of y. What is the percentage change in x if y increases by 20%?',
  steps: [
    'x = ky² for some constant k.',
    'If y increases by 20%, y becomes 1.2y.',
    'New x = k(1.2y)² = k × 1.44y² = 1.44ky² = 1.44x.',
    'x increases by 44%.',
  ],
  answer: '44%', build: null,
};

const example5 = {
  tag: 'Worked Example 5', question: 'If V varies inversely with n and V = 220 when n = 6, find V when n = 8.',
  steps: [
    'V = k/n for some constant k.',
    'When V = 220, n = 6: 220 = k/6 → k = 1320.',
    'V = 1320/n.',
    'When n = 8: V = 1320/8 = 165.',
  ],
  answer: 'V = 165', build: build_Example5Diagram,
};

const example6 = {
  tag: 'Worked Example 6', question: 'The number of spherical glass beads which can be made from a given volume of glass varies inversely with the cube of the diameter. When d = 2 mm, N = 2700. How many beads of diameter 3 mm can be made?',
  steps: [
    'N ∝ 1/d³, so N = k/d³.',
    'When d = 2, N = 2700: 2700 = k/8 → k = 21600.',
    'N = 21600/d³.',
    'When d = 3: N = 21600/27 = 800.',
  ],
  answer: '800 beads', build: null,
};

const example7 = {
  tag: 'Worked Example 7', question: 'The mass of a wire varies jointly with its length and the square of its diameter. 500 m of wire of diameter 3 mm has a mass of 31.5 kg. What is the mass of 1 km of wire of diameter 2 mm?',
  steps: [
    'M ∝ Ld², so M = kLd².',
    'When L = 500, d = 3, M = 31.5: 31.5 = k × 500 × 9 → k = 0.007.',
    'M = 0.007Ld².',
    'When L = 1000, d = 2: M = 0.007 × 1000 × 4 = 28.',
  ],
  answer: '28 kg', build: null,
};

const example8 = {
  tag: 'Worked Example 8', question: 'If X ∝ YZ² and Y ∝ Z⁻², show that X ∝ YZ⁶.',
  steps: [
    'If Y ∝ Z⁻², then Y = kZ⁻² for some constant k.',
    'X ∝ YZ², so X = m(YZ²) for some constant m.',
    'Substitute Y: X = m(kZ⁻²)Z² = mkZ⁰ = mk.',
    'Thus X is constant, so X ∝ YZ⁶ trivially (as YZ⁶ = kZ⁴ for constant k).',
  ],
  answer: 'Shown', build: null,
};

const example9 = {
  tag: 'Worked Example 9', question: 'C is partly constant and partly varies as N. C = 45 when N = 10, and C = 87 when N = 24. Find (a) the formula connecting C and N, (b) C when N = 18.',
  steps: [
    'C = a + kN, where a and k are constants.',
    '45 = a + 10k (1)',
    '87 = a + 24k (2)',
    'Subtract (1) from (2): 42 = 14k → k = 3.',
    'Substitute k = 3 into (1): 45 = a + 30 → a = 15.',
    '(a) C = 15 + 3N.',
    '(b) When N = 18: C = 15 + 3 × 18 = 15 + 54 = 69.',
  ],
  answer: '(a) C = 15 + 3N (b) C = 69', build: build_Example9Diagram,
};

const example10 = {
  tag: 'Worked Example 10', question: 'The resistance to motion of a car is partly constant and partly varies as the square of the speed. At 40 km/h the resistance is 530 N, and at 60 km/h it is 730 N. What will be the resistance at 70 km/h?',
  steps: [
    'R = a + kV², where a and k are constants.',
    '530 = a + k(40)² = a + 1600k (1)',
    '730 = a + k(60)² = a + 3600k (2)',
    'Subtract (1) from (2): 200 = 2000k → k = 1/10.',
    'Substitute k = 1/10 into (1): 530 = a + 160 → a = 370.',
    'R = 370 + V²/10.',
    'When V = 70: R = 370 + 4900/10 = 370 + 490 = 860 N.',
  ],
  answer: '860 N', build: null,
};

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
const DefinitionBox = ({ children, label = 'Definition' }) => (
  <div className="my-6 rounded-2xl border-2 border-slate-200 bg-white px-6 py-5 shadow-sm">
    <span className="gc-hand block text-center text-base text-slate-500">{label}</span>
    <p className="gc-ink mt-2 text-center text-xl font-bold leading-snug text-slate-900 sm:text-2xl">{children}</p>
    <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rose-300" />
  </div>
);

const ExampleCard = ({ index, example }) => {
  const [open, setOpen] = useState(false);
  const diagram = useMemo(() => (open && example.build ? example.build() : null), [open, example]);
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-700">{index}</div>
        <div className="pt-1">
          {example.tag && <div className="mb-1 text-sm font-bold uppercase tracking-wide text-emerald-500">{example.tag}</div>}
          <div className="font-medium text-slate-800">{example.question}</div>
          {example.table && (
            <div style={{ marginTop: '10px', overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', fontSize: '13px' }}>
                <tr><th style={{ border: '1px solid #e2e8f0', padding: '6px 10px', background: '#f8fafc', textAlign: 'center', fontWeight: '700' }}>T</th>
                  {example.table.T.map((t, i) => <td key={i} style={{ border: '1px solid #e2e8f0', padding: '6px 10px', textAlign: 'center' }}>{t}</td>)}
                </tr>
                <tr><th style={{ border: '1px solid #e2e8f0', padding: '6px 10px', background: '#f8fafc', textAlign: 'center', fontWeight: '700' }}>E</th>
                  {example.table.E.map((e, i) => <td key={i} style={{ border: '1px solid #e2e8f0', padding: '6px 10px', textAlign: 'center' }}>{e === null ? '—' : e}</td>)}
                </tr>
              </table>
            </div>
          )}
        </div>
      </div>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-base font-medium text-slate-700 transition-colors hover:bg-slate-100">
        <span>{open ? 'Hide Solution' : 'Show Solution'}</span>
        <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          {diagram && (
            <ConstructionPlayer title="Diagram" viewBox={diagram.viewBox} actions={diagram.actions} caption={diagram.caption} />
          )}
          <div className="rounded-lg bg-slate-50/40 p-4 pl-6">
            {example.steps.map((step, i) => (
              <div key={i} className="flex gap-2 border-b border-slate-200/70 py-2 text-base leading-relaxed last:border-0">
                <span className="gc-hand shrink-0 font-bold text-rose-500">Step {i + 1}:</span>
                <span className="gc-ink flex-1 text-[1.05rem] leading-relaxed text-slate-900">{step}</span>
              </div>
            ))}
            <div className="pt-2 text-base leading-relaxed">
              <span className="gc-hand mr-1 font-bold text-slate-500">Answer:</span>
              <span className="gc-ink text-lg font-bold text-slate-700">{example.answer}</span>
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

/* =========================================================================
   SECTIONS
   ========================================================================= */
const sections = [
  {
    id: 'direct',
    eyebrow: '',
    title: 'Direct Variation',
    heading: 'Direct Variation',
    intro: "Read each part below, then use the results and examples to practise.",
    customDemo: DirectVariationDemo,
  },
  {
    id: 'inverse',
    eyebrow: '',
    title: 'Inverse Variation',
    heading: 'Inverse Variation',
    intro: "Read each part below, then try the questions at the end.",
    customDemo: InverseVariationDemo,
  },
  {
    id: 'joint',
    eyebrow: '',
    title: 'Joint Variation',
    heading: 'Joint Variation',
    intro: "Read each part below, then try the questions at the end.",
    customDemo: JointVariationDemo,
  },
  {
    id: 'partial',
    eyebrow: '',
    title: 'Partial Variation',
    heading: 'Partial Variation',
    intro: "Read each part below, then try the questions at the end.",
    customDemo: PartialVariationDemo,
  },
  {
    id: 'example-library',
    eyebrow: 'Reference',
    title: 'Example Library',
    heading: 'Worked Example Library',
    intro: "Every worked example in one place, written out step by step.",
    customDemo: ExampleLibraryDemo,
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */
const Section = ({ section }) => (
  <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
    <div className="mb-4">
      {section.eyebrow && (<span className="text-sm font-bold uppercase tracking-wider text-emerald-500">{section.eyebrow}</span>)}
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
    </div>

    {section.examples && section.examples.length > 0 && (
      <div className="mb-8">
        <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-400">{section.id === 'example-library' ? 'All Worked Examples' : 'Worked Examples'}</h3>
        {section.examples.map((ex, i) => (
          <ExampleCard key={i} index={i + 1} example={ex} />
        ))}
      </div>
    )}

    {section.practice && section.practice.length > 0 && <PracticeZone items={section.practice} />}
  </section>
);

export const Variation = () => {
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
    <div id="gr-scroll-area" className="math-lesson min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />
      {/* Duolingo Gradient Header */}
      <div className={`math-lesson-header relative overflow-hidden bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 border-b-4 border-fuchsia-800 pb-8 pt-10 text-white shadow-md`}>
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
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Variation</h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "Variation yakatwasuka, yakadzokera, yakabatana, neye pakati — nzira ina dzinowanika nhamba imwe ichiterera imwe. Kunzwisisa constant yekuenzana kunokupa kukwanisa kugadzirisa mibvunzo yose ye variation." : "Direct, inverse, joint and partial variation — the four ways one quantity can depend on another. Understand the constant of proportionality and you can solve any variation problem in seconds."}
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
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-fuchsia-600 border-b-4 border-fuchsia-800 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="math-lesson-body w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
        <div key={activeSection.id}>
          <Section section={activeSection} />
        </div>
        <div className="math-lesson-footer mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button onClick={goPrev} disabled={activeIndex === 0}
            className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-base font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-sm font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
          <button onClick={goNext} disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-base font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Variation;
