import React, { useState, useRef, useEffect, ReactNode } from 'react';
import * as THREE from 'three';

/* ========================================================================
  TYPES
  ======================================================================== */

interface StepRowProps {
  step: number | string;
  children: ReactNode;
  formula?: string;
  diagram?: ReactNode;
}

interface KeyFormulaProps {
  label?: string;
  formula: ReactNode;
}

interface RuleItem {
  rule: string;
  example?: string;
}

interface RuleListProps {
  rules: RuleItem[];
  forceList?: boolean;
}

interface MethodRow {
  step?: number | string;
  formula?: string;
  text: string;
  unit?: string;
}

interface MethodConfig {
  title: string;
  kind?: 'rules' | 'steps';
  rows?: MethodRow[];
  rules?: RuleItem[];
}

interface ExampleItem {
  question: string;
  steps: string[];
  answer: string;
  computation?: Computation;
}

interface ExampleCardProps {
  index: number;
  example: ExampleItem;
}

interface PracticeZoneProps {
  items: string[];
}

interface Computation {
  vars: ComputationVar[];
  numerator: string;
  denominator: string;
  dividend: number;
  divisor: number;
  resultUnit: string;
}

interface ComputationVar {
  symbol: string;
  label: string;
  value: string;
  unit: string;
}

interface DiagramConfig {
  type: 'kinematics' | 'graph' | 'freefall' | 'image';
  title?: string;
  caption?: string;
  props?: any;
  bare?: boolean;
  src?: string;
  alt?: string;
}

interface Section {
  id: string;
  eyebrow: string;
  title: string;
  heading: string;
  accentColor: string;
  intro: string;
  intro2?: string;
  introMore?: string[];
  definition?: string;
  diagram?: DiagramConfig;
  method?: MethodConfig;
  method2?: MethodConfig;
  keyFormula?: KeyFormulaProps;
  workedAnimated?: { title: string; examples: ExampleItem[] };
  examples: ExampleItem[];
  practice: string[];
}

/* ========================================================================
  TEXT UTILITIES
  ======================================================================== */

function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

function renderRich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-bold text-slate-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

/* ========================================================================
  INK STYLES
  ======================================================================== */

export const InkStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .ga-hand { font-family: 'Patrick Hand', cursive; }
    .ga-ink { font-family: 'Kalam', cursive; }
    .ga-ruled {
      background-color: #fffdf6;
      background-image:
        repeating-linear-gradient(#fffdf6, #fffdf6 26px, #d9e6f5 26px, #d9e6f5 27px),
        linear-gradient(90deg, transparent 38px, #f2b8b8 38px, #f2b8b8 40px, transparent 40px);
    }
    @keyframes gaEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

/* ========================================================================
  UI PRIMITIVES
  ======================================================================== */

export const StepRow: React.FC<StepRowProps> = ({ step, children, formula, diagram }) => (
  <div className="grid grid-cols-1 gap-3 border-b border-dashed border-slate-200 py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
    <div className="flex gap-3">
      <span className="ga-hand flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-800">
        {step}
      </span>
      <div className="flex-1">
        <p className="pt-0.5 leading-relaxed text-slate-700">{children}</p>
        {diagram && <div className="mt-3">{diagram}</div>}
      </div>
    </div>
    {formula && (
      <div className="rounded-lg border-2 border-blue-100 bg-blue-50/60 px-4 py-3 sm:min-w-[220px] sm:border-l-2 sm:border-t-0">
        <span className="ga-ink block text-center text-xl font-bold leading-snug text-blue-900 sm:text-2xl">
          {formula}
        </span>
      </div>
    )}
  </div>
);

export const KeyFormula: React.FC<KeyFormulaProps> = ({ label, formula }) => (
  <div className="my-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
    {label && <span className="ga-hand text-sm text-slate-500">{label}</span>}
    <span className="ga-ink text-2xl font-bold text-blue-900 sm:text-3xl">{formula}</span>
    <span className="h-1 w-16 rounded-full bg-rose-300" />
  </div>
);

export const Fraction: React.FC<{ numerator: string; denominator: string }> = ({ numerator, denominator }) => (
  <span className="ga-ink mx-1 inline-flex flex-col items-center align-middle text-center leading-none">
    <span className="px-1 pb-0.5">{numerator}</span>
    <span className="block h-[2px] w-full bg-current" />
    <span className="px-1 pt-0.5">{denominator}</span>
  </span>
);

export const DefinitionBox: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative mb-6 overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/60 px-5 py-4 sm:px-6 sm:py-5">
    <span className="ga-hand mb-1.5 block text-xs font-bold uppercase tracking-widest text-blue-500">
      Official Definition
    </span>
    <p className="whitespace-pre-line text-[1.05rem] font-semibold leading-relaxed text-blue-900">{renderRich(text)}</p>
  </div>
);

export const RuleList: React.FC<RuleListProps> = ({ rules, forceList = false }) => {
  const listView = (
    <ul className={`ml-1 space-y-4 text-slate-700 ${forceList ? '' : 'sm:hidden'}`}>
      {rules.map((r, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 shrink-0 text-emerald-400">●</span>
          <div className="leading-relaxed">
            <span className="font-semibold text-slate-800">{r.rule}</span>
            {r.example && (
              <span className="ga-ink mt-1 block whitespace-pre-line text-blue-800">{r.example}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );

  if (forceList) return listView;

  return (
    <>
      {listView}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 sm:block">
        <table className="w-full border-collapse text-left">
          <tbody>
            {rules.map((r, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="w-10 border-b border-slate-100 px-4 py-3 align-top font-bold text-emerald-500 last:border-0">
                  {i + 1}.
                </td>
                <td className="w-1/3 border-b border-slate-100 px-4 py-3 align-top font-semibold text-slate-800 last:border-0">
                  {r.rule}
                </td>
                <td className="ga-ink border-b border-slate-100 px-4 py-3 align-top text-blue-800 last:border-0">
                  {r.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const TitleBanner: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">{children}</h3>
);

export const PracticeZone: React.FC<PracticeZoneProps> = ({ items }) => (
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

/* ---- Whiteboard animation primitives ---- */

const whiteboardKeyframes = `
  .hw-char {
    display: inline-block;
    opacity: 0;
    animation: hwDraw 300ms ease-out forwards;
  }
  @keyframes hwDraw {
    0% { opacity: 0; -webkit-text-stroke: 1.4px currentColor; color: transparent; transform: translateY(2px) scale(0.92); }
    45% { opacity: 1; -webkit-text-stroke: 1.4px currentColor; color: transparent; transform: translateY(0) scale(1.04); }
    100% { opacity: 1; -webkit-text-stroke: 0px currentColor; color: currentColor; transform: scale(1); }
  }
  @keyframes wbPop {
    0% { opacity: 0; transform: translateY(14px) scale(0.9); }
    60% { opacity: 1; transform: translateY(-2px) scale(1.03); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes wbBlink {
    0%, 45% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  .wb-cursor {
    display: inline-block;
    width: 2px;
    height: 0.9em;
    margin-left: 2px;
    background: currentColor;
    vertical-align: -0.1em;
    animation: wbBlink 0.9s steps(1) infinite;
  }
  @keyframes wbRise {
    0% { opacity: 0; transform: translateY(18px) scale(0.85); }
    55% { opacity: 1; transform: translateY(-4px) scale(1.08); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes wbStrike {
    from { width: 0%; }
    to { width: 100%; }
  }
`;

interface TypewriterProps {
  text: string;
  active: boolean;
  className?: string;
  onDone?: () => void;
  speed?: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, active, className, onDone, speed = 40 }) => {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    if (count >= text.length) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [active, count, text, speed]);

  useEffect(() => {
    if (active && count >= text.length && !doneRef.current) {
      doneRef.current = true;
      onDone?.();
    }
  }, [active, count, text, onDone]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {active && count < text.length && <span className="wb-cursor" />}
    </span>
  );
};

interface StrokeTextProps {
  text: string;
  onDone?: () => void;
  className?: string;
  speed?: number;
}

const StrokeText: React.FC<StrokeTextProps> = ({ text, onDone, className, speed = 45 }) => {
  const doneRef = useRef(false);
  const chars = React.useMemo(() => text.split(''), [text]);

  useEffect(() => {
    doneRef.current = false;
    const totalTime = chars.length * speed + 320;
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone?.();
      }
    }, totalTime);
    return () => clearTimeout(t);
  }, [text, chars.length, speed, onDone]);

  return (
    <span className={className}>
      {chars.map((ch, i) => (
        <span
          key={i}
          className="hw-char"
          style={{ animationDelay: `${i * speed}ms`, whiteSpace: ch === ' ' ? 'pre' : undefined }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
};

interface CancelLineProps {
  text: string;
}

const MathPart: React.FC<{ text: string }> = ({ text }) => {
  const radicalMatch = text.match(/^√\((.*)\)$/) || text.match(/^√(.+)$/);
  if (radicalMatch) {
    return (
      <span className="inline-flex items-stretch align-middle">
        <svg viewBox="0 0 24 36" preserveAspectRatio="none" className="h-auto w-5 shrink-0 self-stretch overflow-visible" aria-hidden="true">
          <path d="M1 20 L5 20 L10 33 L23 1" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="miter" />
        </svg>
        <span className="-ml-[1px] inline-block border-t-[3.2px] border-current px-1 pt-1 text-3xl leading-none sm:text-4xl">
          {radicalMatch[1]}
        </span>
      </span>
    );
  }
  return <span>{text}</span>;
};

const CancelLine: React.FC<CancelLineProps> = ({ text }) => {
  const parts = text.split('=').map(p => p.trim()).filter(p => p.length > 0);
  if (parts.length <= 1) {
    return (
      <span className="ga-ink inline-block text-xl leading-relaxed text-slate-800 sm:text-2xl" style={{ animation: 'wbRise 0.5s ease-out both' }}>
        {text}
      </span>
    );
  }
  return (
    <span className="ga-ink flex flex-col items-start gap-2 text-2xl leading-relaxed text-slate-900 sm:text-3xl">
      {parts.map((part, i) => (
        <span
          key={i}
          className={i === parts.length - 1 ? 'font-bold text-blue-900' : 'font-semibold'}
          style={{ animation: `${i === parts.length - 1 ? 'wbRise' : 'wbPop'} 0.45s ease-out both`, animationDelay: `${i * 0.45}s` }}
        >
          {i > 0 && <span className="mr-3 text-slate-400">=</span>}
          <MathPart text={part} />
        </span>
      ))}
    </span>
  );
};

/* ---- Computation Block ---- */

const ComputationBlock: React.FC<{ computation: Computation }> = ({ computation }) => {
  const { vars, numerator, denominator, dividend, divisor, resultUnit } = computation;
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    setRevealedCount(0);
  }, [computation]);

  const varsDone = revealedCount >= vars.length;

  return (
    <div className="mt-1">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-8 gap-y-2">
        {vars.map((v, i) => {
          const text = `${v.label} (${v.symbol}) = ${v.value} ${v.unit}.`;
          if (i < revealedCount) {
            return (
              <span key={i} className="ga-ink text-base font-semibold text-slate-800 sm:text-lg">
                {text}
              </span>
            );
          }
          if (i === revealedCount) {
            return (
              <StrokeText
                key={i}
                text={text}
                onDone={() => setRevealedCount(c => c + 1)}
                speed={40}
                className="ga-ink text-base font-semibold text-slate-800 sm:text-lg"
              />
            );
          }
          return null;
        })}
      </div>
      {varsDone && (
        <div style={{ animation: 'wbRise 0.3s ease-out both' }}>
          <p className="ga-hand mb-2 text-sm font-bold text-slate-500">Now use this formula:</p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="ga-ink inline-flex flex-col items-center text-xl font-bold text-slate-900 sm:text-2xl">
              <span>{numerator}</span>
              <span className="my-0.5 h-[2px] w-full bg-slate-800" />
              <span>{denominator}</span>
            </span>
            <span className="text-2xl text-slate-400">→</span>
            <span className="ga-ink inline-flex flex-col items-center text-xl font-bold text-slate-900 sm:text-2xl">
              <span>{dividend}</span>
              <span className="my-0.5 h-[2px] w-full bg-slate-800" />
              <span>{divisor}</span>
            </span>
            <span className="text-2xl text-slate-400">=</span>
            <span className="ga-ink text-2xl font-bold text-emerald-700 sm:text-3xl">
              {dividend / divisor} {resultUnit}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Worked Example Animated Engine ---- */

type ExStepKind = 'question' | 'stepLine' | 'answer' | 'hold';

interface ExStep {
  kind: ExStepKind;
  idx?: number;
}

function buildExampleSteps(ex: ExampleItem): ExStep[] {
  const steps: ExStep[] = [{ kind: 'question' }];
  ex.steps.forEach((_, i) => steps.push({ kind: 'stepLine', idx: i }));
  steps.push({ kind: 'answer' }, { kind: 'hold' });
  return steps;
}

function exStepDuration(s: ExStep, ex: ExampleItem): number {
  switch (s.kind) {
    case 'question': return 400;
    case 'stepLine': {
      if (ex.steps[s.idx!] === '__computation__') return 7000;
      const parts = ex.steps[s.idx!].split('=').length;
      return 500 + parts * 650;
    }
    case 'answer': return 800;
    case 'hold': return 3200;
  }
}

export const WorkedExampleAnimated: React.FC<{ example: ExampleItem; index: number }> = ({ example, index }) => {
  const steps = React.useMemo(() => buildExampleSteps(example), [example]);
  const durations = React.useMemo(() => steps.map(s => exStepDuration(s, example)), [steps, example]);
  const cum = React.useMemo(() => {
    const acc: number[] = [];
    durations.forEach((d, i) => acc.push(i === 0 ? 0 : acc[i - 1] + durations[i - 1]));
    return acc;
  }, [durations]);
  const total = (cum[cum.length - 1] ?? 0) + (durations[durations.length - 1] ?? 1);

  const findStep = (kind: ExStepKind, idx?: number) =>
    steps.findIndex(s => s.kind === kind && (idx === undefined || s.idx === idx));

  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const speedRef = useRef(1);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepStartRef = useRef<number>(performance.now());
  const isDraggingRef = useRef(false);

  useEffect(() => { stepStartRef.current = performance.now(); }, [step]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (isPlaying && !isDraggingRef.current) {
        const elapsed = (performance.now() - stepStartRef.current) * speedRef.current;
        const dur = durations[step] ?? 1;
        const t = Math.min(elapsed, dur);
        const frac = ((cum[step] ?? 0) + t) / total;
        if (fillRef.current) fillRef.current.style.width = `${Math.min(100, frac * 100)}%`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [step, isPlaying, durations, cum, total]);

  const seekToClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    if (fillRef.current) fillRef.current.style.width = `${frac * 100}%`;
    const targetTime = frac * total;
    let p = steps.length - 1;
    for (let i = 0; i < cum.length; i++) {
      if (targetTime < cum[i]) { p = Math.max(0, i - 1); break; }
    }
    setStep(p);
  };

  const handleBarPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsPlaying(false);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    seekToClientX(e.clientX);
  };
  const handleBarPointerMove = (e: React.PointerEvent) => { if (isDraggingRef.current) seekToClientX(e.clientX); };
  const handleBarPointerUp = () => { isDraggingRef.current = false; };

  useEffect(() => {
    if (!isPlaying) return;
    const s = steps[step];
    if (!s) return;
    const dur = durations[step] ?? 400;
    const t = setTimeout(() => {
      if (s.kind === 'hold') {
        setStep(0);
      } else {
        setStep(p => Math.min(p + 1, steps.length - 1));
      }
    }, dur / speed);
    return () => clearTimeout(t);
  }, [step, isPlaying, speed, steps, durations]);

  return (
    <div className="relative z-10 mb-6 overflow-visible rounded-xl border-2 border-dashed border-slate-200 bg-white px-5 py-6 sm:px-8 sm:py-7">
      <style>{whiteboardKeyframes}</style>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(p => !p)}
          aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white transition hover:bg-slate-700 active:scale-95"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <rect x="5" y="4" width="5" height="16" />
              <rect x="14" y="4" width="5" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>
        <div className="relative shrink-0">
          <button
            onClick={() => setSpeedMenuOpen(o => !o)}
            aria-label="Playback speed"
            aria-expanded={speedMenuOpen}
            className={`flex h-8 items-center gap-1 rounded-full border px-3 text-xs font-bold transition active:scale-95 ${
              speedMenuOpen ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-6-6V4z" />
              <path d="M12 6v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {speed}x
          </button>
          {speedMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setSpeedMenuOpen(false)} />
              <div className="absolute bottom-full left-0 z-50 mb-2 w-24 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg" style={{ animation: 'wbPop 0.15s ease-out both' }}>
                {[0.5, 1, 1.5, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setSpeedMenuOpen(false); }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-semibold transition ${
                      s === speed ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{s}x</span>
                    {s === speed && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current">
                        <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div
          ref={barRef}
          onPointerDown={handleBarPointerDown}
          onPointerMove={handleBarPointerMove}
          onPointerUp={handleBarPointerUp}
          onPointerCancel={handleBarPointerUp}
          className="group relative h-1.5 flex-1 cursor-pointer touch-none select-none rounded-full bg-slate-200"
        >
          <div ref={fillRef} className="pointer-events-none h-full rounded-full bg-black" style={{ width: '0%' }} />
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 pl-6 sm:p-5 sm:pl-8">
        <div className="mb-3 flex gap-2 border-b border-slate-200 pb-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            {index}
          </span>
          <span className="ga-ink flex-1 text-base font-semibold leading-relaxed text-slate-800 sm:text-lg">
            {example.question}
          </span>
        </div>
        {example.steps.map((st, i) => {
          const idx = findStep('stepLine', i);
          if (step < idx) return null;
          if (st === '__computation__' && example.computation) {
            return <ComputationBlock key={i} computation={example.computation} />;
          }
          return (
            <div key={i} className="flex gap-2 border-b border-slate-200 py-2 text-sm leading-relaxed last:border-0">
              <span className="ga-hand shrink-0 font-bold text-slate-500">Step {i + 1}:</span>
              <CancelLine key={i} text={st} />
            </div>
          );
        })}
        {step >= findStep('answer') && (
          <div className="pt-3 text-sm leading-relaxed">
            <span className="ga-hand mr-1 font-bold text-slate-500">Answer:</span>
            <span className="ga-ink inline-block text-lg font-bold text-slate-900" style={{ animation: 'wbRise 0.5s ease-out both' }}>
              {example.answer}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkedExampleExplorer: React.FC<{ examples: ExampleItem[] }> = ({ examples }) => {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {examples.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition ${
              i === selected
                ? 'border-emerald-600 bg-emerald-500 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            Example {i + 1}
          </button>
        ))}
      </div>
      <WorkedExampleAnimated key={selected} example={examples[selected]} index={selected + 1} />
    </div>
  );
};

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'speed-velocity',
    accentColor: '#0d2c45',
    eyebrow: 'Chapter 2.1',
    title: 'Speed, Velocity, Distance, Displacement, Acceleration',
    heading: 'Speed, Velocity, Distance, Displacement & Acceleration',
    intro:
      '**Kinematics** is the study of motion. It describes **how** objects move — how fast, how far, and in which direction — without worrying about what causes the motion.',
    intro2:
      'In this chapter, we will learn the key quantities that describe motion: **distance, displacement, speed, velocity,** and **acceleration**.',
    introMore: [
      '**Distance** is the total path length travelled. It is a **scalar** — it has magnitude only.',
      '**Displacement** is the distance travelled in a specified direction. It is a **vector** — it has both magnitude and direction.',
      '**Speed** is the distance covered per unit time. It is a **scalar**.',
      '**Velocity** is the displacement per unit time. It is a **vector**.',
      '**Acceleration** is the rate of change of velocity. It tells us how quickly velocity changes.',
    ],
    definition:
      '**Acceleration** is the rate at which an object\'s velocity changes over time.\n\n' +
      'When an object speeds up, it has **positive acceleration**; when it slows down, it has **negative acceleration** (deceleration).\n\n' +
      'The standard unit for acceleration is **metres per second squared (m/s²)**.',
    method: {
      title: 'Key Motion Equations',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'v = s / t', text: 'Velocity = Displacement / Time — the rate of change of displacement.' },
        { step: 2, formula: 'a = (v − u) / t', text: 'Acceleration = (Final velocity − Initial velocity) / Time.' },
        { step: 3, formula: 'v = u + at', text: 'Final velocity = Initial velocity + (Acceleration × Time).' },
        { step: 4, formula: 's = ut + ½at²', text: 'Displacement = Initial velocity × Time + ½ × Acceleration × Time².' },
        { step: 5, formula: 'v² = u² + 2as', text: 'Final velocity² = Initial velocity² + 2 × Acceleration × Displacement.' },
        { step: 6, formula: 's = ½(u + v)t', text: 'Displacement = Average velocity × Time.' },
      ],
    },
    keyFormula: {
      label: 'The three core motion equations:',
      formula: (
        <>
          v = u + at &nbsp;&nbsp;|&nbsp;&nbsp; s = ut + ½at² &nbsp;&nbsp;|&nbsp;&nbsp; v² = u² + 2as
        </>
      ),
    },
    examples: [
      {
        question: 'A car accelerates from rest (u = 0) at 2 m/s² for 5 seconds. Calculate its final velocity.',
        steps: ['Initial velocity (u) = 0 m/s.', 'Acceleration (a) = 2 m/s².', 'Time (t) = 5 s.', 'v = u + at = 0 + 2 × 5 = 10 m/s.'],
        answer: 'v = 10 m/s',
      },
      {
        question: 'A train moving at 20 m/s brakes to a stop in 10 seconds. Calculate its acceleration.',
        steps: ['Initial velocity (u) = 20 m/s.', 'Final velocity (v) = 0 m/s.', 'Time (t) = 10 s.', 'a = (v − u) / t = (0 − 20) / 10 = −2 m/s².'],
        answer: 'a = −2 m/s² (deceleration)',
      },
      {
        question: 'A ball is thrown upwards with an initial velocity of 15 m/s. Calculate the time taken to reach the highest point. (g = 10 m/s²)',
        steps: ['Initial velocity (u) = 15 m/s.', 'Final velocity at highest point (v) = 0 m/s.', 'Acceleration (a) = −10 m/s² (due to gravity).', 'v = u + at → 0 = 15 − 10t → t = 1.5 s.'],
        answer: 't = 1.5 s',
      },
      {
        question: 'A cyclist travels at 8 m/s for 20 seconds. Calculate the distance covered.',
        steps: ['Speed = 8 m/s.', 'Time = 20 s.', 'Distance = Speed × Time = 8 × 20 = 160 m.'],
        answer: 's = 160 m',
      },
      {
        question: 'A ball is dropped from rest and hits the ground after 2 seconds. Calculate the height from which it was dropped. (g = 10 m/s²)',
        steps: ['Initial velocity (u) = 0 m/s.', 'Time (t) = 2 s.', 'Acceleration (a) = 10 m/s².', 's = ut + ½at² = 0 + ½ × 10 × 4 = 20 m.'],
        answer: 's = 20 m',
      },
    ],
    practice: [
      'Distinguish between distance and displacement. Give an example of each.',
      'A car travels 100 m north, then 40 m south. Calculate its total distance and its displacement.',
      'Define acceleration. What is the difference between positive and negative acceleration?',
      'A train accelerates from rest at 0.5 m/s² for 30 seconds. Calculate its final velocity and the distance it travels.',
      'A ball is thrown vertically upwards with a velocity of 20 m/s. Calculate the maximum height it reaches. (g = 10 m/s²)',
    ],
  },
  {
    id: 'graphs-of-motion',
    accentColor: '#7c3aed',
    eyebrow: 'Chapter 2.2',
    title: 'Graphs of Motion',
    heading: 'Graphs of Motion — Distance–Time & Speed–Time',
    intro:
      'Graphs are a powerful way to visualise motion. Two types of graphs are especially important in kinematics: **distance–time graphs** and **speed–time graphs**.',
    intro2:
      'Each type of graph gives us different information about the motion of an object. The **slope** (gradient) and the **area under the graph** tell us key quantities.',
    introMore: [
      '**Distance–time graph:** the gradient (slope) gives the **speed**. A steeper slope means a higher speed. A horizontal line means the object is stationary.',
      '**Speed–time graph:** the gradient gives the **acceleration**. A steeper slope means a larger acceleration. The **area under the graph** gives the distance travelled.',
    ],
    definition:
      '**Gradient** = the steepness of a graph line. On a distance–time graph, gradient = speed. On a speed–time graph, gradient = acceleration.\n\n' +
      '**Area under a graph** = the space between the graph line and the horizontal axis. On a speed–time graph, the area under the graph = distance travelled.',
    keyFormula: {
      label: 'Key relationships from graphs:',
      formula: (
        <>
          <span className="block text-lg">Distance–time: gradient = speed</span>
          <span className="block text-lg">Speed–time: gradient = acceleration, area = distance</span>
        </>
      ),
    },
    examples: [
      {
        question: 'From a distance–time graph, a straight line slopes upwards from (0,0) to (10 s, 50 m). Calculate the speed.',
        steps: ['Gradient = (change in distance) / (change in time).', 'Gradient = 50 m / 10 s = 5 m/s.'],
        answer: 'Speed = 5 m/s',
      },
      {
        question: 'From a speed–time graph, the line goes from (0, 0) to (5 s, 20 m/s). Calculate the acceleration and the distance travelled.',
        steps: ['Acceleration = gradient = (20 − 0) / (5 − 0) = 4 m/s².', 'Distance = area under graph = ½ × base × height = ½ × 5 × 20 = 50 m.'],
        answer: 'a = 4 m/s², distance = 50 m',
      },
      {
        question: 'A speed–time graph shows a horizontal line at 15 m/s from t = 2 s to t = 8 s. Calculate the distance travelled during this time.',
        steps: ['The graph is a rectangle of width 6 s and height 15 m/s.', 'Area = width × height = 6 × 15 = 90 m.'],
        answer: 'Distance = 90 m',
      },
      {
        question: 'A speed–time graph has a line from (0, 0) to (4 s, 12 m/s), then a horizontal line from (4 s, 12 m/s) to (10 s, 12 m/s). Calculate the total distance.',
        steps: ['Area of triangle = ½ × 4 × 12 = 24 m.', 'Area of rectangle = 6 × 12 = 72 m.', 'Total distance = 24 + 72 = 96 m.'],
        answer: 'Total distance = 96 m',
      },
    ],
    practice: [
      'Sketch a distance–time graph for an object moving at constant speed, then at rest, then accelerating.',
      'What does the gradient of a speed–time graph represent? What does the area under it represent?',
      'A speed–time graph shows a line from (0, 5 m/s) to (8 s, 21 m/s). Calculate the acceleration and the distance travelled.',
      'Explain why the area under a speed–time graph gives distance but the gradient gives acceleration.',
      'A train accelerates from rest to 30 m/s in 20 seconds, travels at constant speed for 40 seconds, then brakes to a stop in 10 seconds. Draw the speed–time graph and calculate the total distance.',
    ],
  },
  {
    id: 'motion-under-gravity',
    accentColor: '#ea580c',
    eyebrow: 'Chapter 2.3',
    title: 'Motion Under Gravity',
    heading: 'Motion Under Gravity — Free Fall & Terminal Velocity',
    intro:
      '**Gravity** is the force that pulls objects towards the Earth\'s surface. When an object falls freely under the influence of gravity alone, we call this **free fall**.',
    intro2:
      'In the absence of air resistance, all objects fall with the same acceleration, regardless of their mass. This acceleration is called the **acceleration due to gravity**, denoted by **g**.',
    introMore: [
      '**Free fall** = motion of an object falling under gravity alone (no other forces, such as air resistance).',
      '**Terminal velocity** = the maximum constant velocity reached when air resistance becomes equal to the weight of the object (so acceleration = 0).',
      '**Acceleration due to gravity, g** ≈ 9.8 m/s² (often rounded to 10 m/s² for calculations).',
    ],
    definition:
      '**Free fall** is the motion of an object where the only force acting on it is gravity.\n\n' +
      'When an object is in free fall, its acceleration is constant and equal to **g** (the acceleration due to gravity).\n\n' +
      'Near the Earth\'s surface, **g ≈ 9.8 m/s²** (or 10 m/s² for rough calculations).',
    method: {
      title: 'Equations of Motion Under Gravity',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'a = g = 9.8 m/s²', text: 'The acceleration of an object in free fall is constant — approximately 9.8 m/s² downwards.' },
        { step: 2, formula: 'v = u + gt', text: 'Use the same equations of motion, but replace a with g (and be careful with the sign convention).' },
        { step: 3, formula: 's = ut + ½gt²', text: 'For an object dropped from rest, u = 0, so s = ½gt².' },
        { step: 4, formula: 'v² = u² + 2gs', text: 'This equation is useful for finding the final velocity or the height of a fall.' },
      ],
    },
 
    keyFormula: {
      label: 'Acceleration due to gravity:',
      formula: (
        <>
          g ≈ 9.8 m/s² &nbsp;&nbsp; (≈ 10 m/s²)
        </>
      ),
    },
    examples: [
      {
        question: 'A ball is dropped from rest from a height of 20 m. Calculate the time it takes to reach the ground. (g = 10 m/s²)',
        steps: ['Initial velocity (u) = 0 m/s.', 'Height (s) = 20 m.', 'Acceleration (a) = 10 m/s².', 's = ut + ½at² → 20 = 0 + ½ × 10 × t² → 20 = 5t² → t² = 4 → t = 2 s.'],
        answer: 't = 2 s',
      },
      {
        question: 'A stone is thrown vertically upwards with an initial velocity of 15 m/s. Calculate the maximum height reached. (g = 10 m/s²)',
        steps: ['Initial velocity (u) = 15 m/s.', 'Final velocity at max height (v) = 0 m/s.', 'Acceleration (a) = −10 m/s² (upwards is positive).', 'v² = u² + 2as → 0 = 225 − 20s → 20s = 225 → s = 11.25 m.'],
        answer: 's = 11.25 m',
      },
      {
        question: 'A feather and a hammer are dropped on the Moon. Which one hits the ground first? Explain.',
        steps: ['On the Moon, there is no air resistance.', 'Both objects fall with the same acceleration due to gravity (about 1.6 m/s²).', 'Without air resistance, they hit the ground at the same time.'],
        answer: 'They hit the ground at the same time.',
      },
      {
        question: 'A skydiver jumps from a plane and reaches terminal velocity. Describe the forces acting on the skydiver.',
        steps: ['At terminal velocity, the skydiver\'s weight (downward force) is balanced by air resistance (upward force).', 'The net force is zero, so acceleration is zero.', 'The skydiver falls at a constant, maximum speed.'],
        answer: 'Weight = Air resistance, net force = 0, acceleration = 0, speed = constant (terminal velocity).',
      },
    ],
    practice: [
      'Define free fall. What is the acceleration of an object in free fall near the Earth\'s surface?',
      'A ball is thrown upwards with a velocity of 25 m/s. Calculate the time taken to reach the highest point and the maximum height reached. (g = 10 m/s²)',
      'What is terminal velocity? Explain why a skydiver reaches a terminal velocity.',
      'A coin is dropped from a height of 1.8 m. Calculate the time it takes to hit the ground. (g = 10 m/s²)',
      'Describe an experiment to determine the acceleration due to gravity using a free-falling object.',
    ],
  },
];

/* ========================================================================
  SECTION COMPONENT
  ======================================================================== */

interface SectionProps {
  section: Section;
}

const renderDiagram = (diagram?: DiagramConfig): ReactNode => {
  if (!diagram) return null;
  switch (diagram.type) {
    case 'image':
      return (
        <img
          src={diagram.src}
          alt={diagram.alt || ''}
          className="w-full rounded-lg"
        />
      );
    default:
      return null;
  }
};

const RedCommaText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(',').map((part, index, parts) => (
      <span key={index}>
        {renderRich(part)}
        {index < parts.length - 1 && (
          <span className="font-black text-red-600">,</span>
        )}
      </span>
    ))}
  </>
);

const BookWorkingLine: React.FC<{ line: string }> = ({ line }) => {
  /*
   * Only convert mathematical divisions into fractions.
   * Units such as m/s must remain written normally.
   */
  const fractionMatch = line.match(/^(.*?)([A-Za-z²]+)\s*=\s*(.*?)\s+\/\s+([A-Za-z0-9²().−+\-×\s]+?)([.]?)$/);

  if (fractionMatch) {
    const [, prefix, symbol, numerator, denominator, punctuation] = fractionMatch;

    return (
      <span className="ga-ink block text-lg leading-relaxed text-slate-800 sm:text-xl">
        {prefix && <RedCommaText text={prefix} />}
        <span>{symbol} = </span>
        <span className="inline-flex align-middle">
          <Fraction
            numerator={numerator.trim()}
            denominator={denominator.trim()}
          />
          {punctuation}
        </span>
      </span>
    );
  }

  return (
    <span className="ga-ink block text-lg leading-relaxed text-slate-800 sm:text-xl">
      <RedCommaText text={line} />
    </span>
  );
};


interface TopicQuestion {
  question: string;
  working: string[];
  answer: string;
}

interface TopicLessonProps {
  title: string;
  definition: string;
  formula: ReactNode;
  explanation: ReactNode;
  realWorld: string;
  questions: TopicQuestion[];
}

const TopicLesson: React.FC<TopicLessonProps> = ({
  title,
  definition,
  formula,
  explanation,
  realWorld,
  questions,
}) => {
  const [showMore, setShowMore] = useState(false);
  const visibleQuestions = showMore ? questions : questions.slice(0, 3);

  return (
    <div className="mt-10 border-t-4 border-slate-300 pt-8">
      <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
        {title}
      </h2>

      <DefinitionBox text={definition} />

      <div className="my-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5 sm:p-7">
        <p className="ga-hand mb-3 text-sm font-bold uppercase tracking-widest text-emerald-700">
          Formula
        </p>

        <div className="text-center">
          <span className="ga-ink text-2xl font-bold text-blue-900 sm:text-3xl">
            {formula}
          </span>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="mb-3 text-xl font-bold text-slate-900">
          Explanation
        </h3>

        <div className="space-y-4 leading-relaxed text-slate-700">
          {explanation}
        </div>

        <h3 className="mb-3 mt-6 text-xl font-bold text-slate-900">
          Real-world uses
        </h3>

        <p className="leading-relaxed text-slate-700">
          {realWorld}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="mb-4 text-xl font-bold text-slate-900">
          Example Questions
        </h3>

        <div className="space-y-4">
          {visibleQuestions.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                {index + 1}. {item.question}
              </p>

              <div className="mb-4 rounded-xl bg-slate-50 p-4">
                <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                  Working
                </p>

                <div className="space-y-3">
                  {item.working.map((line, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                        {stepIndex + 1}
                      </span>

                      <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                        <BookWorkingLine line={line} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="font-bold text-emerald-700">
                Answer: {item.answer}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setShowMore((visible) => !visible)}
          className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
        >
          {showMore ? 'Show fewer questions' : 'View more questions'}
        </button>
      </div>
    </div>
  );
};

/* ---- Simple labelled line-graph diagram for graph-topic lessons ---- */

interface GraphDiagramProps {
  id: string;
  title: string;
  caption: string;
  pathD: string;
  arrow: { x1: number; y1: number; x2: number; y2: number };
  label: string;
  labelX: number;
  labelY: number;
  yLabel?: string;
}

const GraphDiagram: React.FC<GraphDiagramProps> = ({
  id,
  title,
  caption,
  pathD,
  arrow,
  label,
  labelX,
  labelY,
  yLabel = 'Distance (m)',
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">{title}</p>
    <svg viewBox="0 0 220 180" className="mx-auto w-full max-w-[220px]">
      <defs>
        <marker id={`arrow-${id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill="#059669" />
        </marker>
      </defs>
      <line x1="30" y1="10" x2="30" y2="150" stroke="#94a3b8" strokeWidth="2" />
      <line x1="30" y1="150" x2="200" y2="150" stroke="#94a3b8" strokeWidth="2" />
      <polygon points="30,4 25,14 35,14" fill="#94a3b8" />
      <polygon points="206,150 196,145 196,155" fill="#94a3b8" />
      <text x="10" y="85" fontSize="9" fill="#475569" transform="rotate(-90 10 85)">
        {yLabel}
      </text>
      <text x="115" y="167" fontSize="9" fill="#475569" textAnchor="middle">
        Time (s)
      </text>
      <path d={pathD} fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      <line
        x1={arrow.x1}
        y1={arrow.y1}
        x2={arrow.x2}
        y2={arrow.y2}
        stroke="#059669"
        strokeWidth="1.5"
        markerEnd={`url(#arrow-${id})`}
      />
      <text x={labelX} y={labelY} fontSize="9.5" fill="#059669" fontWeight="bold">
        {label}
      </text>
    </svg>
    <p className="mt-2 text-center text-xs italic text-slate-500">{caption}</p>
  </div>
);

function fallPhaseAt(t: number): { phase: 0 | 1 | 2; p: number } {
  if (t < 0.25) return { phase: 0, p: t / 0.25 };
  if (t < 0.55) return { phase: 1, p: (t - 0.25) / 0.3 };
  return { phase: 2, p: (t - 0.55) / 0.45 };
}

function speedAt(t: number): number {
  const { phase, p } = fallPhaseAt(t);
  if (phase === 0) return 28 * p;
  if (phase === 1) return 28 + 27 * p;
  return 55;
}

function airForceAt(t: number): number {
  const { phase, p } = fallPhaseAt(t);
  if (phase === 0) return 4 + 4 * p;
  if (phase === 1) return 8 + 24 * p;
  return 32;
}

const FreeFallLoopAnimation: React.FC = () => {
  const _sizeNote = null;
  const CYCLE_MS = 9000;
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      setElapsed(performance.now() - startRef.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const cycleT = (elapsed % CYCLE_MS) / CYCLE_MS;
  const { phase, p } = fallPhaseAt(cycleT);

  const objY =
    phase === 0 ? 35 + 25 * p :
    phase === 1 ? 60 + 35 * p :
    Math.min(95 + 20 * p, 108);

  const pulse = Math.sin(elapsed / 300);
  const weightLen = phase === 2 ? 32 + 3 * pulse : 32;
  const airLen = phase === 2 ? 32 + 3 * pulse : airForceAt(cycleT);

  const speed = Math.round(speedAt(cycleT));

  const label =
    phase === 0 ? 'Weight is greater than air resistance, so the object accelerates.' :
    phase === 1 ? 'Air resistance increases as speed increases, reducing acceleration.' :
    'Terminal velocity: weight equals air resistance, so speed stays constant.';

  const particleSpeed = phase === 0 ? 0.004 : phase === 1 ? 0.05 : 0.09;
  const particleOpacity = phase === 0 ? 0.12 : phase === 1 ? 0.5 : 0.85;
  const particleOffsets = [0, 40, 80, 120];

  /* ---- Graph geometry: shared time axis with the animation ---- */
  const GRAPH_X0 = 34;
  const GRAPH_X1 = 270;
  const GRAPH_Y0 = 20;
  const GRAPH_Y1 = 150;
  const MAX_SPEED = 55;

  const xAt = (t: number) => GRAPH_X0 + (GRAPH_X1 - GRAPH_X0) * t;
  const ySpeed = (v: number) => GRAPH_Y1 - (v / MAX_SPEED) * (GRAPH_Y1 - GRAPH_Y0);
  const yForce = (v: number) => GRAPH_Y1 - (v / 32) * (GRAPH_Y1 - GRAPH_Y0);

  const SAMPLES = 40;
  const sampleTs = Array.from({ length: SAMPLES + 1 }, (_, i) => (cycleT * i) / SAMPLES);

  const speedPath = sampleTs
    .map((t, i) => `${i === 0 ? 'M' : 'L'}${xAt(t).toFixed(1)},${ySpeed(speedAt(t)).toFixed(1)}`)
    .join(' ');

  const airForcePath = sampleTs
    .map((t, i) => `${i === 0 ? 'M' : 'L'}${xAt(t).toFixed(1)},${yForce(airForceAt(t)).toFixed(1)}`)
    .join(' ');

  const weightY = yForce(32);
  const cursorX = xAt(cycleT);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="ga-hand mb-1 text-center text-sm font-bold text-slate-600">
        Falling object — forces in action
      </p>
      <p className="ga-ink mb-2 text-center text-2xl font-bold text-slate-900">
        {speed} m/s
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
        <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-[420px]">
          <defs>
            <marker id="ffl-down" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
            <marker id="ffl-up" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          <line x1="20" y1="170" x2="280" y2="170" stroke="#cbd5e1" strokeWidth="2" />

          {particleOffsets.map((off, i) => {
            const side = i % 2 === 0 ? 112 : 188;
            const y = 165 - ((elapsed * particleSpeed + off) % 160);
            return (
              <line
                key={i}
                x1={side}
                y1={y}
                x2={side}
                y2={y + 8}
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
                opacity={particleOpacity}
              />
            );
          })}

          <circle cx="150" cy={objY} r="9" fill="#0f172a" />

          <line
            x1="150" y1={objY + 9}
            x2="150" y2={objY + 9 + weightLen}
            stroke="#dc2626" strokeWidth="3" markerEnd="url(#ffl-down)"
          />
          <text x="160" y={objY + 9 + weightLen} fontSize="9.5" fill="#dc2626" fontWeight="bold">
            Weight (gravity)
          </text>

          <line
            x1="150" y1={objY - 9}
            x2="150" y2={objY - 9 - airLen}
            stroke="#2563eb" strokeWidth="3" markerEnd="url(#ffl-up)"
          />
          <text x="160" y={objY - 9 - airLen + 9} fontSize="9.5" fill="#2563eb" fontWeight="bold">
            Air resistance
          </text>
        </svg>

        <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-[420px]">
          <line x1={GRAPH_X0} y1={GRAPH_Y0} x2={GRAPH_X0} y2={GRAPH_Y1} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={GRAPH_X0} y1={GRAPH_Y1} x2={GRAPH_X1} y2={GRAPH_Y1} stroke="#cbd5e1" strokeWidth="2" />
          <text x="4" y={GRAPH_Y0 + 10} fontSize="8" fill="#475569">55</text>
          <text x="14" y={GRAPH_Y1 + 3} fontSize="8" fill="#475569">0</text>
          <text x="150" y="182" fontSize="8.5" fill="#475569" textAnchor="middle">time →</text>

          <line
            x1={GRAPH_X0} y1={weightY} x2={GRAPH_X1} y2={weightY}
            stroke="#dc2626" strokeWidth="2" strokeDasharray="4,3"
          />
          <path d={airForcePath} fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4,3" />
          <path d={speedPath} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

          <line x1={cursorX} y1={GRAPH_Y0} x2={cursorX} y2={GRAPH_Y1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx={cursorX} cy={ySpeed(speed)} r="4" fill="#059669" />

          <text x={GRAPH_X0 + 4} y={GRAPH_Y0 - 6} fontSize="8.5" fill="#059669" fontWeight="bold">speed</text>
          <text x={GRAPH_X0 + 44} y={GRAPH_Y0 - 6} fontSize="8.5" fill="#dc2626" fontWeight="bold">weight</text>
          <text x={GRAPH_X0 + 96} y={GRAPH_Y0 - 6} fontSize="8.5" fill="#2563eb" fontWeight="bold">air resist.</text>
        </svg>
      </div>

      <p className="ga-ink mt-2 min-h-[34px] text-center text-xs font-semibold text-emerald-700 sm:text-sm">
        {label}
      </p>
    </div>
  );
};

function freeFallSpeedAt(t: number): number {
  return 40 * t;
}

const FreeFallOnlyAnimation: React.FC = () => {
  const CYCLE_MS = 5000;
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      setElapsed(performance.now() - startRef.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const cycleT = (elapsed % CYCLE_MS) / CYCLE_MS;
  const objY = 20 + 110 * cycleT;
  const speed = Math.round(freeFallSpeedAt(cycleT));
  const weightLen = 32;

  const GRAPH_X0 = 34;
  const GRAPH_X1 = 270;
  const GRAPH_Y0 = 20;
  const GRAPH_Y1 = 150;
  const MAX_SPEED = 40;

  const xAt = (t: number) => GRAPH_X0 + (GRAPH_X1 - GRAPH_X0) * t;
  const ySpeed = (v: number) => GRAPH_Y1 - (v / MAX_SPEED) * (GRAPH_Y1 - GRAPH_Y0);

  const SAMPLES = 40;
  const sampleTs = Array.from({ length: SAMPLES + 1 }, (_, i) => (cycleT * i) / SAMPLES);
  const speedPath = sampleTs
    .map((t, i) => `${i === 0 ? 'M' : 'L'}${xAt(t).toFixed(1)},${ySpeed(freeFallSpeedAt(t)).toFixed(1)}`)
    .join(' ');

  const cursorX = xAt(cycleT);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="ga-hand mb-1 text-center text-sm font-bold text-slate-600">
        Free fall — constant acceleration
      </p>
      <p className="ga-ink mb-2 text-center text-2xl font-bold text-slate-900">
        {speed} m/s
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
        <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-[420px]">
          <defs>
            <marker id="ff-only-down" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <line x1="20" y1="170" x2="280" y2="170" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="150" cy={objY} r="9" fill="#0f172a" />
          <line
            x1="150" y1={objY + 9}
            x2="150" y2={objY + 9 + weightLen}
            stroke="#dc2626" strokeWidth="3" markerEnd="url(#ff-only-down)"
          />
          <text x="160" y={objY + 9 + weightLen} fontSize="9.5" fill="#dc2626" fontWeight="bold">
            Weight (gravity)
          </text>
        </svg>
        <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-[420px]">
          <line x1={GRAPH_X0} y1={GRAPH_Y0} x2={GRAPH_X0} y2={GRAPH_Y1} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={GRAPH_X0} y1={GRAPH_Y1} x2={GRAPH_X1} y2={GRAPH_Y1} stroke="#cbd5e1" strokeWidth="2" />
          <text x="4" y={GRAPH_Y0 + 10} fontSize="8" fill="#475569">40</text>
          <text x="14" y={GRAPH_Y1 + 3} fontSize="8" fill="#475569">0</text>
          <text x="150" y="182" fontSize="8.5" fill="#475569" textAnchor="middle">time →</text>
          <path d={speedPath} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cursorX} y1={GRAPH_Y0} x2={cursorX} y2={GRAPH_Y1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx={cursorX} cy={ySpeed(speed)} r="4" fill="#059669" />
          <text x={GRAPH_X0 + 4} y={GRAPH_Y0 - 6} fontSize="8.5" fill="#059669" fontWeight="bold">speed (v = gt)</text>
        </svg>
      </div>
      <p className="ga-ink mt-2 min-h-[34px] text-center text-xs font-semibold text-emerald-700 sm:text-sm">
        Speed increases steadily — acceleration stays constant at g.
      </p>
    </div>
  );
};

function gravitySpeedAt(t: number): number {
  return 9.8 * t;
}

const GravityAccelAnimation: React.FC = () => {
  const CYCLE_MS = 4000;
  const SECONDS_SHOWN = 4;
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      setElapsed(performance.now() - startRef.current);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const cycleT = (elapsed % CYCLE_MS) / CYCLE_MS;
  const secondsElapsed = cycleT * SECONDS_SHOWN;
  const objY = 20 + 110 * cycleT;
  const speed = gravitySpeedAt(secondsElapsed);

  const GRAPH_X0 = 34;
  const GRAPH_X1 = 270;
  const GRAPH_Y0 = 20;
  const GRAPH_Y1 = 150;
  const MAX_SPEED = 9.8 * SECONDS_SHOWN;

  const xAt = (s: number) => GRAPH_X0 + (GRAPH_X1 - GRAPH_X0) * (s / SECONDS_SHOWN);
  const ySpeed = (v: number) => GRAPH_Y1 - (v / MAX_SPEED) * (GRAPH_Y1 - GRAPH_Y0);

  const SAMPLES = 40;
  const sampleSeconds = Array.from({ length: SAMPLES + 1 }, (_, i) => (secondsElapsed * i) / SAMPLES);
  const speedPath = sampleSeconds
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${xAt(s).toFixed(1)},${ySpeed(gravitySpeedAt(s)).toFixed(1)}`)
    .join(' ');

  const cursorX = xAt(secondsElapsed);
  const secondMarks = [0, 1, 2, 3, 4];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="ga-hand mb-1 text-center text-sm font-bold text-slate-600">
        Acceleration due to gravity — g ≈ 9.8 m/s²
      </p>
      <p className="ga-ink mb-2 text-center text-2xl font-bold text-slate-900">
        {speed.toFixed(1)} m/s
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-center">
        <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-[420px]">
          <defs>
            <marker id="grav-down" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
              <path d="M1 1 L7 4 L1 7" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          <line x1="20" y1="170" x2="280" y2="170" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="150" cy={objY} r="9" fill="#0f172a" />
          <line
            x1="150" y1={objY + 9}
            x2="150" y2={objY + 41}
            stroke="#dc2626" strokeWidth="3" markerEnd="url(#grav-down)"
          />
          <text x="160" y={objY + 41} fontSize="9.5" fill="#dc2626" fontWeight="bold">
            g ≈ 9.8 m/s²
          </text>
        </svg>
        <svg viewBox="0 0 300 190" className="mx-auto w-full max-w-[420px]">
          <line x1={GRAPH_X0} y1={GRAPH_Y0} x2={GRAPH_X0} y2={GRAPH_Y1} stroke="#cbd5e1" strokeWidth="2" />
          <line x1={GRAPH_X0} y1={GRAPH_Y1} x2={GRAPH_X1} y2={GRAPH_Y1} stroke="#cbd5e1" strokeWidth="2" />
          <text x="2" y={GRAPH_Y0 + 10} fontSize="8" fill="#475569">{MAX_SPEED.toFixed(0)}</text>
          <text x="14" y={GRAPH_Y1 + 3} fontSize="8" fill="#475569">0</text>
          <text x="150" y="182" fontSize="8.5" fill="#475569" textAnchor="middle">time (s) →</text>

          {secondMarks.map((s) => (
            <g key={s}>
              <line
                x1={xAt(s)} y1={GRAPH_Y1} x2={xAt(s)} y2={GRAPH_Y1 + 4}
                stroke="#94a3b8" strokeWidth="1"
              />
              <text x={xAt(s)} y={GRAPH_Y1 + 14} fontSize="7.5" fill="#94a3b8" textAnchor="middle">{s}s</text>
              {s <= secondsElapsed && s > 0 && (
                <circle cx={xAt(s)} cy={ySpeed(gravitySpeedAt(s))} r="3" fill="#059669" />
              )}
            </g>
          ))}

          <path d={speedPath} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
          <line x1={cursorX} y1={GRAPH_Y0} x2={cursorX} y2={GRAPH_Y1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx={cursorX} cy={ySpeed(speed)} r="4" fill="#059669" />
          <text x={GRAPH_X0 + 4} y={GRAPH_Y0 - 6} fontSize="8.5" fill="#059669" fontWeight="bold">speed (v = gt)</text>
        </svg>
      </div>
      <p className="ga-ink mt-2 min-h-[34px] text-center text-xs font-semibold text-emerald-700 sm:text-sm">
        Every second, speed climbs by the same 9.8 m/s — that steady jump is g.
      </p>
    </div>
  );
};

interface InterpretationCardProps {
  rule: string;
  example: string;
  children: ReactNode;
}

const InterpretationCard: React.FC<InterpretationCardProps> = ({ rule, example, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="mb-3 flex justify-center">{children}</div>
    <p className="text-sm font-semibold text-slate-800">{rule}</p>
    <p className="ga-ink mt-1 text-sm text-blue-800">{example}</p>
  </div>
);

interface MotionEquation {
  name: string;
  formula: string;
  definition: string;
  use: string;
  examples: TopicQuestion[];
}

const EquationsOfMotionLesson: React.FC = () => {
  const equations: MotionEquation[] = [
    {
      name: 'First equation of motion',
      formula: 'v = u + at',
      definition: 'This equation connects the initial velocity, final velocity, acceleration and time.',
      use: 'Use this equation when the displacement is not given and you need to find the final velocity, initial velocity, acceleration or time.',
      examples: [
        {
          question: 'A car starts from rest and accelerates at 3 m/s² for 5 s. Find its final velocity.',
          working: [
            'Given: u = 0 m/s, a = 3 m/s² and t = 5 s.',
            'Use v = u + at.',
            'v = 0 + (3 × 5).',
            'v = 15 m/s.'
          ],
          answer: 'The final velocity is 15 m/s.'
        },
        {
          question: 'A bus increases its velocity from 8 m/s to 20 m/s in 6 s. Find its acceleration.',
          working: [
            'Given: u = 8 m/s, v = 20 m/s and t = 6 s.',
            'Rearrange v = u + at to make a the subject.',
            'a = (v − u) / t.',
            'a = (20 − 8) / 6 = 2 m/s².'
          ],
          answer: 'The acceleration is 2 m/s².'
        },
        {
          question: 'An object moving at 24 m/s slows down at 4 m/s² until it stops. Find the time taken.',
          working: [
            'Given: u = 24 m/s, v = 0 m/s and a = −4 m/s².',
            'Use v = u + at.',
            '0 = 24 − 4t.',
            '4t = 24, therefore t = 6 s.'
          ],
          answer: 'The time taken is 6 s.'
        }
      ]
    },
    {
      name: 'Second equation of motion',
      formula: 's = ut + ½at²',
      definition: 'This equation gives the displacement of an object moving with uniform acceleration.',
      use: 'Use this equation when you know the initial velocity, acceleration and time, and need to calculate displacement.',
      examples: [
        {
          question: 'A stone is thrown with an initial velocity of 5 m/s and accelerates at 2 m/s² for 4 s. Find its displacement.',
          working: [
            'Given: u = 5 m/s, a = 2 m/s² and t = 4 s.',
            'Use s = ut + ½at².',
            's = (5 × 4) + ½ × 2 × 4².',
            's = 20 + 16 = 36 m.'
          ],
          answer: 'The displacement is 36 m.'
        },
        {
          question: 'A car starts from rest and accelerates at 4 m/s² for 6 s. Calculate the distance travelled.',
          working: [
            'Given: u = 0 m/s, a = 4 m/s² and t = 6 s.',
            'Use s = ut + ½at².',
            's = (0 × 6) + ½ × 4 × 6².',
            's = 72 m.'
          ],
          answer: 'The distance travelled is 72 m.'
        },
        {
          question: 'A vehicle moving at 10 m/s accelerates at 1.5 m/s² for 8 s. Find its displacement.',
          working: [
            'Given: u = 10 m/s, a = 1.5 m/s² and t = 8 s.',
            'Use s = ut + ½at².',
            's = (10 × 8) + ½ × 1.5 × 8².',
            's = 80 + 48 = 128 m.'
          ],
          answer: 'The displacement is 128 m.'
        }
      ]
    },
    {
      name: 'Third equation of motion',
      formula: 'v² = u² + 2as',
      definition: 'This equation connects velocity, acceleration and displacement without using time.',
      use: 'Use this equation when time is not given or is not required, especially for stopping distances and motion over a measured distance.',
      examples: [
        {
          question: 'A car starts from rest and accelerates at 2 m/s² over 100 m. Find its final velocity.',
          working: [
            'Given: u = 0 m/s, a = 2 m/s² and s = 100 m.',
            'Use v² = u² + 2as.',
            'v² = 0² + 2 × 2 × 100 = 400.',
            'v = √400 = 20 m/s.'
          ],
          answer: 'The final velocity is 20 m/s.'
        },
        {
          question: 'A train moving at 15 m/s accelerates at 1 m/s² over 200 m. Find its final velocity.',
          working: [
            'Given: u = 15 m/s, a = 1 m/s² and s = 200 m.',
            'Use v² = u² + 2as.',
            'v² = 15² + 2 × 1 × 200.',
            'v² = 625, therefore v = 25 m/s.'
          ],
          answer: 'The final velocity is 25 m/s.'
        },
        {
          question: 'A car travelling at 20 m/s stops with a deceleration of 4 m/s². Find the stopping distance.',
          working: [
            'Given: u = 20 m/s, v = 0 m/s and a = −4 m/s².',
            'Use v² = u² + 2as.',
            '0² = 20² + 2 × (−4) × s.',
            '0 = 400 − 8s, therefore s = 50 m.'
          ],
          answer: 'The stopping distance is 50 m.'
        }
      ]
    },
    {
      name: 'Fourth equation of motion',
      formula: 's = ½(u + v)t',
      definition: 'This equation calculates displacement using the average velocity multiplied by time.',
      use: 'Use it when the initial velocity, final velocity and time are known.',
      examples: [
        {
          question: 'A cyclist increases velocity from 4 m/s to 12 m/s in 10 s. Find the displacement.',
          working: [
            'Given: u = 4 m/s, v = 12 m/s and t = 10 s.',
            'Use s = ½(u + v)t.',
            's = ½(4 + 12) × 10.',
            's = 80 m.'
          ],
          answer: 'The displacement is 80 m.'
        },
        {
          question: 'A train slows from 30 m/s to 10 m/s in 20 s. Calculate the distance travelled.',
          working: [
            'Given: u = 30 m/s, v = 10 m/s and t = 20 s.',
            'Use s = ½(u + v)t.',
            's = ½(30 + 10) × 20.',
            's = 400 m.'
          ],
          answer: 'The distance travelled is 400 m.'
        },
        {
          question: 'An object moves from 6 m/s to 18 m/s in 4 s. Find its displacement.',
          working: [
            'Given: u = 6 m/s, v = 18 m/s and t = 4 s.',
            'Use s = ½(u + v)t.',
            's = ½(6 + 18) × 4.',
            's = 48 m.'
          ],
          answer: 'The displacement is 48 m.'
        }
      ]
    },
    {
      name: 'Acceleration from change in velocity',
      formula: 'a = (v − u) / t',
      definition: 'This equation defines acceleration as the change in velocity divided by the time taken.',
      use: 'Use it when the initial velocity, final velocity and time are known and acceleration is required.',
      examples: [
        {
          question: 'A motorbike changes velocity from 5 m/s to 25 m/s in 4 s. Find its acceleration.',
          working: [
            'Given: u = 5 m/s, v = 25 m/s and t = 4 s.',
            'Use a = (v − u) / t.',
            'a = (25 − 5) / 4.',
            'a = 5 m/s².'
          ],
          answer: 'The acceleration is 5 m/s².'
        },
        {
          question: 'A bus slows from 18 m/s to 6 m/s in 3 s. Find its acceleration.',
          working: [
            'Given: u = 18 m/s, v = 6 m/s and t = 3 s.',
            'Use a = (v − u) / t.',
            'a = (6 − 18) / 3.',
            'a = −4 m/s².'
          ],
          answer: 'The acceleration is −4 m/s², meaning the bus is decelerating.'
        },
        {
          question: 'A runner increases velocity from 2 m/s to 8 m/s in 3 s. Calculate the acceleration.',
          working: [
            'Given: u = 2 m/s, v = 8 m/s and t = 3 s.',
            'Use a = (v − u) / t.',
            'a = (8 − 2) / 3.',
            'a = 2 m/s².'
          ],
          answer: 'The acceleration is 2 m/s².'
        }
      ]
    },
    {
      name: 'Average velocity',
      formula: 'average velocity = ½(u + v)',
      definition: 'For uniform acceleration, average velocity is the mean of the initial and final velocities.',
      use: 'Use this equation when the initial and final velocities are known and the motion has uniform acceleration.',
      examples: [
        {
          question: 'An object changes velocity from 10 m/s to 30 m/s. Find its average velocity.',
          working: [
            'Given: u = 10 m/s and v = 30 m/s.',
            'Use average velocity = ½(u + v).',
            'Average velocity = ½(10 + 30).',
            'Average velocity = 20 m/s.'
          ],
          answer: 'The average velocity is 20 m/s.'
        },
        {
          question: 'A car slows from 24 m/s to 8 m/s. Find its average velocity.',
          working: [
            'Given: u = 24 m/s and v = 8 m/s.',
            'Use average velocity = ½(u + v).',
            'Average velocity = ½(24 + 8).',
            'Average velocity = 16 m/s.'
          ],
          answer: 'The average velocity is 16 m/s.'
        },
        {
          question: 'A cyclist travels for 12 s with an initial velocity of 4 m/s and final velocity of 16 m/s. Find the displacement.',
          working: [
            'First find average velocity.',
            'Average velocity = ½(4 + 16) = 10 m/s.',
            'Use displacement = average velocity × time.',
            's = 10 × 12 = 120 m.'
          ],
          answer: 'The displacement is 120 m.'
        }
      ]
    }
  ];

  return (
    <div className="mt-10 border-t-4 border-slate-300 pt-8">
      <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
        Equations of Motion
      </h2>

      <DefinitionBox text="The equations of motion are mathematical relationships used to calculate the velocity, displacement, acceleration and time of an object moving with uniform acceleration." />

      <div className="space-y-8">
        {equations.map((equation) => (
          <div key={equation.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h3 className="mb-4 text-2xl font-black text-slate-900">
              {equation.name}
            </h3>

            <div className="mb-5 rounded-xl border-2 border-emerald-200 bg-emerald-50/60 p-5 text-center">
              <span className="ga-ink text-3xl font-bold text-blue-900">
                {equation.formula}
              </span>
            </div>

            <p className="mb-3 leading-relaxed text-slate-700">
              <strong>Meaning:</strong> {equation.definition}
            </p>
            <p className="mb-5 leading-relaxed text-slate-700">
              <strong>When to use it:</strong> {equation.use}
            </p>

            <h4 className="mb-3 text-lg font-bold text-slate-900">
              Example Questions
            </h4>

            <div className="space-y-4">
              {equation.examples.map((example, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                    {index + 1}. {example.question}
                  </p>

                  <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                    Working
                  </p>

                  <div className="space-y-3">
                    {example.working.map((line, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0">
                        <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                          {stepIndex + 1}
                        </span>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <BookWorkingLine line={line} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 font-bold text-emerald-700">
                    Answer: {example.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section: React.FC<SectionProps> = ({ section }) => {
  const [showMoreAccelerationQuestions, setShowMoreAccelerationQuestions] = useState(false);
  const [showMoreMotionQuestions, setShowMoreMotionQuestions] = useState(false);
  const [showMoreDistanceTimeQuestions, setShowMoreDistanceTimeQuestions] = useState(false);

  const [showMoreSpeedTimeQuestions, setShowMoreSpeedTimeQuestions] = useState(false);
  const [showMoreFreeFallQuestions, setShowMoreFreeFallQuestions] = useState(false);
  const [showMoreTerminalVelocityQuestions, setShowMoreTerminalVelocityQuestions] = useState(false);
  const [showMoreGravityQuestions, setShowMoreGravityQuestions] = useState(false);

  const terminalVelocityQuestions = [
    {
      question: 'A skydiver jumps from a plane. Explain why they accelerate immediately after jumping.',
      working: [
        'At the moment of jumping, speed = 0, so there is no air resistance yet.',
        'Weight is the only significant force acting.',
        'Since weight is greater than air resistance, there is a net downward force.',
        'A net force causes acceleration.'
      ],
      answer: 'They accelerate because weight is greater than air resistance at the start.'
    },
    {
      question: 'As a skydiver\'s speed increases, what happens to air resistance, and why does their acceleration decrease?',
      working: [
        'Air resistance increases as speed increases.',
        'This makes the net downward force (weight − air resistance) smaller.',
        'A smaller net force means a smaller acceleration.'
      ],
      answer: 'Air resistance grows with speed, so the net force — and therefore the acceleration — gets smaller.'
    },
    {
      question: 'At terminal velocity, what is the relationship between weight and air resistance? What is the acceleration?',
      working: [
        'At terminal velocity, air resistance has grown until it equals weight.',
        'Net force = weight − air resistance = 0.',
        'Since net force is zero, acceleration = 0.'
      ],
      answer: 'Weight = air resistance, so the net force is zero and acceleration = 0 (constant speed).'
    },
    {
      question: 'A skydiver opens their parachute after reaching terminal velocity. Explain what happens to their speed immediately afterwards.',
      working: [
        'A parachute greatly increases air resistance.',
        'Air resistance suddenly becomes much greater than weight.',
        'This creates a net upward force, decelerating the skydiver.',
        'They slow down until a new, lower terminal velocity is reached.'
      ],
      answer: 'The skydiver decelerates rapidly, then falls at a new, much lower terminal velocity.'
    },
    {
      question: 'Two skydivers of different mass fall together, arms and legs spread the same way. Which one reaches a higher terminal velocity, and why?',
      working: [
        'The heavier skydiver has a greater weight.',
        'A greater weight needs a greater air resistance to balance it.',
        'Air resistance increases with speed, so more speed is needed to generate that extra air resistance.',
        'Therefore the heavier skydiver must fall faster before reaching balance.'
      ],
      answer: 'The heavier skydiver reaches a higher terminal velocity.'
    }
  ];

  const gravityQuestions = [
    {
      question: 'By how much does a falling object\'s speed increase every second near the Earth\'s surface?',
      working: [
        'The acceleration due to gravity, g, is about 9.8 m/s² (often rounded to 10 m/s²).',
        'Acceleration means the speed changes by that amount every second.',
        'So the object gains about 9.8 m/s of speed for every second it falls.'
      ],
      answer: 'Speed increases by about 9.8 m/s (or 10 m/s) every second.'
    },
    {
      question: 'An object falls freely for 3 s on Earth. Calculate its speed. (g = 10 m/s²)',
      working: [
        'Given: u = 0 m/s, t = 3 s, g = 10 m/s².',
        'Use v = u + gt.',
        'v = 0 + (10 × 3).',
        'v = 30 m/s.'
      ],
      answer: 'The speed after 3 s is 30 m/s.'
    },
    {
      question: 'On the Moon, g ≈ 1.6 m/s². An object is dropped and falls for 4 s. Calculate its speed.',
      working: [
        'Given: u = 0 m/s, t = 4 s, g = 1.6 m/s².',
        'Use v = u + gt.',
        'v = 0 + (1.6 × 4).',
        'v = 6.4 m/s.'
      ],
      answer: 'The speed after 4 s is 6.4 m/s.'
    },
    {
      question: 'Explain why an object dropped on the Moon gains speed more slowly than one dropped on Earth over the same time.',
      working: [
        'The Moon has much less mass than the Earth, so its gravity is weaker.',
        'Weaker gravity means a smaller value of g (1.6 m/s² compared with 9.8 m/s²).',
        'A smaller g means the object\'s speed increases more slowly each second.'
      ],
      answer: 'The Moon\'s g is smaller than Earth\'s, so speed builds up more slowly there.'
    },
    {
      question: 'Textbooks often use g = 9.8 m/s², but simple calculations often round it to 10 m/s². Calculate the percentage difference between these two values.',
      working: [
        'Difference = 10 − 9.8 = 0.2.',
        'Percentage difference = (0.2 / 9.8) × 100.',
        'Percentage difference ≈ 2%.'
      ],
      answer: 'Rounding to 10 m/s² introduces about a 2% difference from the more precise value.'
    }
  ];

  const freeFallQuestions = [
    {
      question: 'A ball is released from rest and falls for 3 s. Calculate its speed at that moment. (g = 10 m/s²)',
      working: [
        'Given: initial speed, u = 0 m/s and time, t = 3 s.',
        'Use v = u + gt.',
        'v = 0 + (10 × 3).',
        'v = 30 m/s.'
      ],
      answer: 'The speed after 3 s is 30 m/s.'
    },
    {
      question: 'A stone is dropped from a cliff and falls for 4 s before landing. Calculate the height of the cliff. (g = 10 m/s²)',
      working: [
        'Given: u = 0 m/s, t = 4 s, a = 10 m/s².',
        'Use s = ut + ½gt².',
        's = (0 × 4) + ½ × 10 × 4².',
        's = 80 m.'
      ],
      answer: 'The height of the cliff is 80 m.'
    },
    {
      question: 'An apple falls from a branch and reaches a speed of 14 m/s just before hitting the ground. Calculate the time it was falling. (g = 10 m/s²)',
      working: [
        'Given: u = 0 m/s, v = 14 m/s, a = 10 m/s².',
        'Use v = u + gt.',
        '14 = 0 + 10t.',
        't = 1.4 s.'
      ],
      answer: 'The apple fell for 1.4 s.'
    },
    {
      question: 'A coin is dropped down a well and takes 2.5 s to hit the water. Calculate the depth of the well. (g = 10 m/s²)',
      working: [
        'Given: u = 0 m/s, t = 2.5 s, a = 10 m/s².',
        'Use s = ut + ½gt².',
        's = 0 + ½ × 10 × 2.5².',
        's = 31.25 m.'
      ],
      answer: 'The well is 31.25 m deep.'
    },
    {
      question: 'A ball dropped from a window falls 45 m to the ground. Calculate its speed just before landing. (g = 10 m/s²)',
      working: [
        'Given: u = 0 m/s, s = 45 m, a = 10 m/s².',
        'Use v² = u² + 2gs.',
        'v² = 0 + 2 × 10 × 45 = 900.',
        'v = √900 = 30 m/s.'
      ],
      answer: 'The ball lands at 30 m/s.'
    }
  ];

  const speedTimeGraphQuestions = [
    {
      question: 'A speed–time graph shows a straight line from (0, 0) to (6 s, 18 m/s). Calculate the acceleration.',
      working: [
        'Given: change in speed = 18 m/s and time, t = 6 s.',
        'Use gradient = change in speed / change in time.',
        'gradient = 18 / 6.',
        'gradient = 3 m/s².'
      ],
      answer: 'The acceleration is 3 m/s².'
    },
    {
      question: 'A speed–time graph is a horizontal line at 12 m/s from t = 0 s to t = 10 s. State the acceleration and calculate the distance travelled.',
      working: [
        'A horizontal line means speed is not changing, so acceleration = 0 m/s².',
        'Distance = area under the graph.',
        'The shape is a rectangle: width = 10 s, height = 12 m/s.',
        'Area = 10 × 12 = 120 m.'
      ],
      answer: 'Acceleration = 0 m/s²; distance travelled = 120 m.'
    },
    {
      question: 'A car\'s speed–time graph falls in a straight line from (0, 20 m/s) to (5 s, 0 m/s). Calculate the deceleration.',
      working: [
        'Given: initial speed = 20 m/s, final speed = 0 m/s, time = 5 s.',
        'gradient = change in speed / time = (0 − 20) / 5.',
        'gradient = −4 m/s².',
        'The negative sign shows the object is slowing down.'
      ],
      answer: 'The deceleration is 4 m/s² (gradient = −4 m/s²).'
    },
    {
      question: 'A speed–time graph rises from (0, 0) to (4 s, 16 m/s), then stays flat until t = 9 s. Calculate the acceleration during the first 4 seconds.',
      working: [
        'During 0–4 s, speed rises from 0 to 16 m/s.',
        'gradient = 16 / 4.',
        'gradient = 4 m/s².',
        'After t = 4 s, the flat line means constant speed — acceleration = 0.'
      ],
      answer: 'Acceleration in the first 4 s is 4 m/s²; after that, it is constant speed (0 m/s²).'
    },
    {
      question: 'A cyclist\'s speed–time graph is a straight line from (0, 0) to (8 s, 24 m/s). Calculate the acceleration and the distance travelled.',
      working: [
        'Acceleration = gradient = (24 − 0) / (8 − 0) = 3 m/s².',
        'Distance = area under the graph.',
        'The shape is a triangle: base = 8 s, height = 24 m/s.',
        'Area = ½ × 8 × 24 = 96 m.'
      ],
      answer: 'Acceleration = 3 m/s²; distance travelled = 96 m.'
    }
  ];

  const distanceTimeGraphQuestions = [
    {
      question: 'A distance–time graph shows a straight line from (0, 0) to (8 s, 40 m). Calculate the speed represented by the graph.',
      working: [
        'Given: distance travelled, s = 40 m and time, t = 8 s.',
        'Use gradient = change in distance / change in time.',
        'gradient = 40 / 8.',
        'gradient = 5 m/s.'
      ],
      answer: 'The speed is 5 m/s.'
    },
    {
      question: 'A distance–time graph shows a horizontal line at 25 m from t = 3 s to t = 10 s. Describe the motion of the object during this time.',
      working: [
        'A horizontal line means the distance is not changing.',
        'Since distance stays at 25 m, the object is not moving.',
        'Speed = gradient of a horizontal line = 0 m/s.'
      ],
      answer: 'The object is stationary (at rest) — speed = 0 m/s.'
    },
    {
      question: 'A cyclist\'s distance–time graph is a straight line from (0, 0) to (20 s, 100 m). Calculate the speed and state whether the cyclist is accelerating.',
      working: [
        'Given: distance = 100 m and time = 20 s.',
        'gradient = 100 / 20 = 5 m/s.',
        'Since the line is straight, the gradient (speed) does not change.',
        'Therefore the cyclist is not accelerating.'
      ],
      answer: 'Speed = 5 m/s; the cyclist is moving at constant speed, not accelerating.'
    },
    {
      question: 'A distance–time graph curves upward, becoming steeper between t = 0 s and t = 10 s. What does this tell you about the object\'s motion?',
      working: [
        'A curved line means the gradient is changing.',
        'Gradient becoming steeper means speed is increasing over time.',
        'Therefore the object is accelerating.'
      ],
      answer: 'The object is speeding up (accelerating), since the gradient increases with time.'
    },
    {
      question: 'A runner\'s distance–time graph goes from (0, 0) to (5 s, 30 m), then is flat from (5 s, 30 m) to (9 s, 30 m). Describe the two stages of motion and calculate the speed in the first stage.',
      working: [
        'Stage 1 (0–5 s): distance increases from 0 to 30 m.',
        'gradient = 30 / 5 = 6 m/s.',
        'Stage 2 (5–9 s): distance stays at 30 m, so the line is horizontal.',
        'A horizontal line means the runner has stopped (speed = 0 m/s).'
      ],
      answer: 'Stage 1: constant speed of 6 m/s. Stage 2: the runner is at rest (speed = 0 m/s).'
    }
  ];

  const motionQuestions = [
    {
      question: 'A runner covers a distance of 400 m in 50 s. Calculate the average speed of the runner.',
      working: [
        'Given: distance, s = 400 m and time, t = 50 s.',
        'Use speed = distance / time.',
        'speed = 400 / 50.',
        'speed = 8 m/s.'
      ],
      answer: 'The average speed of the runner is 8 m/s.'
    },
    {
      question: 'A car travels at a constant speed of 20 m/s for 15 s. Calculate the distance travelled.',
      working: [
        'Given: speed, v = 20 m/s and time, t = 15 s.',
        'Use distance = speed × time.',
        'distance = 20 × 15.',
        'distance = 300 m.'
      ],
      answer: 'The car travels a distance of 300 m.'
    },
    {
      question: 'A cyclist travels 120 m east and then 50 m west. Calculate the total distance and the displacement.',
      working: [
        'Total distance is the complete path travelled.',
        'Total distance = 120 + 50.',
        'Total distance = 170 m.',
        'Displacement takes direction into account.',
        'Displacement = 120 − 50 = 70 m east.'
      ],
      answer: 'Distance = 170 m; displacement = 70 m east.'
    },
    {
      question: 'A bus travels 180 km in 3 hours. Calculate its average speed in km/h and in m/s.',
      working: [
        'Given: distance = 180 km and time = 3 h.',
        'Average speed = distance / time.',
        'Average speed = 180 / 3 = 60 km/h.',
        'Convert to m/s: 60 × 1000 / 3600.',
        'Average speed = 16.7 m/s, approximately.'
      ],
      answer: 'The average speed is 60 km/h, or approximately 16.7 m/s.'
    },
    {
      question: 'An object moves from position 10 m east of a reference point to position 35 m west of the same point. Calculate its displacement.',
      working: [
        'Take east as positive and west as negative.',
        'Initial position, x₁ = +10 m.',
        'Final position, x₂ = −35 m.',
        'Displacement = x₂ − x₁.',
        'Displacement = −35 − (+10) = −45 m.',
        'The negative sign shows that the displacement is 45 m west.'
      ],
      answer: 'The displacement is 45 m west.'
    }
  ];

  const visibleMotionQuestions = showMoreMotionQuestions
    ? motionQuestions
    : motionQuestions.slice(0, 3);


  const accelerationQuestions = [
    {
      question: 'A car starts from rest and accelerates uniformly at 2.5 m/s² for 8 seconds. Calculate its final velocity.',
      working: [
        'Given: u = 0 m/s, a = 2.5 m/s², t = 8 s.',
        'Use v = u + at.',
        'v = 0 + (2.5 × 8).',
        'v = 20 m/s.'
      ],
      answer: 'The final velocity of the car is 20 m/s.'
    },
    {
      question: 'A cyclist increases velocity from 6 m/s to 18 m/s in 6 seconds. Calculate the acceleration.',
      working: [
        'Given: u = 6 m/s, v = 18 m/s, t = 6 s.',
        'Use a = (v − u) / t.',
        'a = (18 − 6) / 6.',
        'a = 12 / 6 = 2 m/s².'
      ],
      answer: 'The acceleration of the cyclist is 2 m/s².'
    },
    {
      question: 'A bus travelling at 20 m/s slows down uniformly at 1.5 m/s² for 10 seconds. Calculate its final velocity.',
      working: [
        'Given: u = 20 m/s, a = −1.5 m/s², t = 10 s.',
        'The acceleration is negative because the bus is slowing down.',
        'Use v = u + at.',
        'v = 20 + (−1.5 × 10).',
        'v = 20 − 15 = 5 m/s.'
      ],
      answer: 'The final velocity of the bus is 5 m/s.'
    },
    {
      question: 'A train starts from rest and reaches a velocity of 25 m/s after travelling 125 m. Calculate its acceleration.',
      working: [
        'Given: u = 0 m/s, v = 25 m/s, s = 125 m.',
        'Use v² = u² + 2as.',
        '25² = 0² + 2 × a × 125.',
        '625 = 250a.',
        'a = 625 / 250 = 2.5 m/s².'
      ],
      answer: 'The acceleration of the train is 2.5 m/s².'
    },
    {
      question: 'A stone moves with an initial velocity of 4 m/s and accelerates at 3 m/s² for 5 seconds. Calculate the distance travelled.',
      working: [
        'Given: u = 4 m/s, a = 3 m/s², t = 5 s.',
        'Use s = ut + ½at².',
        's = (4 × 5) + ½ × 3 × 5².',
        's = 20 + 1.5 × 25.',
        's = 20 + 37.5 = 57.5 m.'
      ],
      answer: 'The stone travels a distance of 57.5 m.'
    }
  ];

  const visibleAccelerationQuestions = showMoreAccelerationQuestions
    ? accelerationQuestions
    : accelerationQuestions.slice(0, 3);

  return (
    <section id={section.id} className="mb-16 scroll-mt-24">
      <div className="relative mb-6 -mx-3 overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:-mx-5 md:-mx-8 lg:-mx-10">
        <div className="h-2 w-full" style={{ backgroundColor: section.accentColor }} />
        <div className="relative flex min-h-[70px] items-center">
          <div className="relative z-10 flex items-center rounded-none rounded-br-[32px] py-3 pl-5 pr-8 text-white sm:rounded-br-[40px] sm:py-4 sm:pl-6 sm:pr-10" style={{ backgroundColor: section.accentColor }}>
            <span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
              <svg viewBox="0 0 100 100" className="h-full w-full fill-none stroke-white" strokeWidth="8">
                <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" />
                <path d="M50 5 L50 50 L90 72.5" />
                <path d="M50 50 L10 72.5" />
                <polygon points="50,50 90,27.5 90,72.5" className="fill-white/30 stroke-none" />
              </svg>
            </span>
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-white sm:text-base">
                {section.heading}
              </h2>
              <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-300 sm:text-[10px]">
                {section.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="relative mb-6 pl-4 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300">
          {renderRich(section.intro)}
        </p>
        {section.intro2 && (
          <p className="relative mb-6 pl-4 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300">
            {renderRich(section.intro2)}
          </p>
        )}
        {section.introMore?.map((para, i) => (
          <p
            key={i}
            className="relative mb-6 pl-4 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300"
          >
            {renderRich(para)}
          </p>
        ))}

        {section.definition && <DefinitionBox text={section.definition} />}

        {section.id === 'graphs-of-motion' && (
          <div className="mt-10 border-t-4 border-slate-300 pt-8">
            <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
              Distance–Time Graphs
            </h2>

            <DefinitionBox text="A distance–time graph plots the distance travelled by an object (y-axis) against time (x-axis). The gradient (slope) of the line at any point gives the object's speed at that instant." />

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-xl font-bold text-slate-900">Explanation</h3>
              <div className="space-y-4 leading-relaxed text-slate-700">
                <p>
                  Every point on a distance–time graph shows how far an object has travelled
                  by a given time. Reading the shape of the line tells you how the object is
                  moving, without needing any extra data.
                </p>
                <p>
                  A straight, sloped line means the object covers equal distances in equal
                  times — constant speed. A flat, horizontal line means the distance is not
                  changing — the object is at rest. A curve that gets steeper over time means
                  the object is speeding up, since the gradient (and therefore the speed) is
                  increasing.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <TitleBanner>Example Graphs</TitleBanner>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <GraphDiagram
                  id="dt-steady"
                  title="Steady speed"
                  caption="Straight line — constant gradient means constant speed."
                  pathD="M30,150 L200,40"
                  arrow={{ x1: 150, y1: 65, x2: 175, y2: 45 }}
                  label="gradient = speed"
                  labelX={135}
                  labelY={35}
                />
                <GraphDiagram
                  id="dt-rest"
                  title="At rest"
                  caption="Horizontal line — distance is not changing, so speed = 0."
                  pathD="M30,100 L200,100"
                  arrow={{ x1: 120, y1: 100, x2: 150, y2: 78 }}
                  label="gradient = 0"
                  labelX={120}
                  labelY={68}
                />
                <GraphDiagram
                  id="dt-accel"
                  title="Speeding up"
                  caption="Curve gets steeper — the object's speed is increasing."
                  pathD="M30,150 C90,148 140,110 200,25"
                  arrow={{ x1: 165, y1: 55, x2: 190, y2: 30 }}
                  label="gradient increasing"
                  labelX={95}
                  labelY={20}
                />
              </div>
            </div>

            <div className="mb-6">
              <TitleBanner>Interpretation</TitleBanner>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InterpretationCard
                  rule="A straight line with a positive slope means constant speed."
                  example="The object is moving at a steady rate."
                >
                  <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                    <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M25,115 L175,25" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                    <text x="85" y="95" fontSize="10" fill="#059669" fontWeight="bold">same speed</text>
                    <text x="85" y="107" fontSize="10" fill="#059669" fontWeight="bold">the whole way</text>
                  </svg>
                </InterpretationCard>

                <InterpretationCard
                  rule="A horizontal line means the object is stationary."
                  example="No movement — speed = 0."
                >
                  <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                    <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M25,70 L175,70" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                    <text x="65" y="40" fontSize="10" fill="#059669" fontWeight="bold">flat line =</text>
                    <text x="55" y="52" fontSize="10" fill="#059669" fontWeight="bold">staying still</text>
                  </svg>
                </InterpretationCard>

                <InterpretationCard
                  rule="A curved line means changing speed (acceleration or deceleration)."
                  example="The slope is changing, so speed is changing."
                >
                  <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                    <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M25,115 C80,112 130,90 175,25" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                    <text x="40" y="42" fontSize="10" fill="#059669" fontWeight="bold">curve = the</text>
                    <text x="40" y="54" fontSize="10" fill="#059669" fontWeight="bold">speed is changing</text>
                  </svg>
                </InterpretationCard>

                <InterpretationCard
                  rule="The steeper the slope, the greater the speed."
                  example="A steep line means the object is moving quickly."
                >
                  <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                    <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <path d="M25,115 L110,20" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                    <path d="M25,115 L175,90" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                    <text x="118" y="15" fontSize="10" fill="#1d4ed8" fontWeight="bold">steep = fast</text>
                    <text x="128" y="78" fontSize="10" fill="#f97316" fontWeight="bold">gentle = slow</text>
                  </svg>
                </InterpretationCard>

                <InterpretationCard
                  rule="The area under a distance–time graph has no physical meaning."
                  example="Only the gradient matters for distance–time graphs."
                >
                  <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                    <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                    <polygon points="25,115 175,25 175,115" fill="#cbd5e1" opacity="0.6" />
                    <path d="M25,115 L175,25" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                    <line x1="115" y1="85" x2="155" y2="105" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
                    <line x1="155" y1="85" x2="115" y2="105" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
                    <text x="40" y="40" fontSize="10" fill="#dc2626" fontWeight="bold">shaded area</text>
                    <text x="40" y="52" fontSize="10" fill="#dc2626" fontWeight="bold">isn't used here</text>
                  </svg>
                </InterpretationCard>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Example Questions</h3>
              <div className="space-y-4">
                {(showMoreDistanceTimeQuestions ? distanceTimeGraphQuestions : distanceTimeGraphQuestions.slice(0, 3)).map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                      {index + 1}. {item.question}
                    </p>
                    <div className="mb-4 rounded-xl bg-slate-50 p-4">
                      <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                        Working
                      </p>
                      <div className="space-y-3">
                        {item.working.map((line, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                          >
                            <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                              {stepIndex + 1}
                            </span>
                            <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                              <BookWorkingLine line={line} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="font-bold text-emerald-700">Answer: {item.answer}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowMoreDistanceTimeQuestions((v) => !v)}
                className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
              >
                {showMoreDistanceTimeQuestions ? 'Show fewer questions' : 'View more questions'}
              </button>
            </div>

            <div className="mt-10 border-t-4 border-slate-300 pt-8">
              <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
                Speed–Time Graphs
              </h2>

              <DefinitionBox text="A speed–time graph plots an object's speed (y-axis) against time (x-axis). The gradient of the line gives the acceleration, and the area under the line gives the distance travelled." />

              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <h3 className="mb-3 text-xl font-bold text-slate-900">Explanation</h3>
                <div className="space-y-4 leading-relaxed text-slate-700">
                  <p>
                    A speed–time graph tells a different story to a distance–time graph. Here,
                    the height of the line at any point shows how fast the object is going right
                    then — not how far it has travelled.
                  </p>
                  <p>
                    A flat, horizontal line means the speed stays the same, so there is no
                    acceleration. A line that rises means the object is speeding up; a line
                    that falls means it is slowing down. The steeper the line, the bigger the
                    change in speed each second. Unlike a distance–time graph, the space under
                    the line is meaningful here — it adds up to the total distance travelled.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <TitleBanner>Example Graphs</TitleBanner>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <GraphDiagram
                    id="st-constant"
                    title="Constant speed"
                    caption="Horizontal line — speed stays the same, so acceleration = 0."
                    pathD="M30,80 L200,80"
                    arrow={{ x1: 120, y1: 80, x2: 150, y2: 58 }}
                    label="no speeding up"
                    labelX={100}
                    labelY={48}
                    yLabel="Speed (m/s)"
                  />
                  <GraphDiagram
                    id="st-accel"
                    title="Speeding up"
                    caption="Line rises — speed increases, so the object is accelerating."
                    pathD="M30,150 L200,40"
                    arrow={{ x1: 150, y1: 65, x2: 175, y2: 45 }}
                    label="getting faster"
                    labelX={50}
                    labelY={135}
                    yLabel="Speed (m/s)"
                  />
                  <GraphDiagram
                    id="st-decel"
                    title="Slowing down"
                    caption="Line falls — speed decreases, so the object is decelerating."
                    pathD="M30,25 L200,140"
                    arrow={{ x1: 90, y1: 60, x2: 65, y2: 40 }}
                    label="getting slower"
                    labelX={110}
                    labelY={35}
                    yLabel="Speed (m/s)"
                  />
                </div>
              </div>

              <div className="mb-6">
                <TitleBanner>Interpretation</TitleBanner>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InterpretationCard
                    rule="A horizontal line means constant speed (zero acceleration)."
                    example="The object is moving at a steady speed."
                  >
                    <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                      <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M25,70 L175,70" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                      <text x="65" y="40" fontSize="10" fill="#059669" fontWeight="bold">flat line =</text>
                      <text x="55" y="52" fontSize="10" fill="#059669" fontWeight="bold">steady speed</text>
                    </svg>
                  </InterpretationCard>

                  <InterpretationCard
                    rule="A line with a positive slope means acceleration."
                    example="The object is speeding up."
                  >
                    <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                      <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M25,115 L175,25" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                      <text x="85" y="95" fontSize="10" fill="#059669" fontWeight="bold">rising line =</text>
                      <text x="85" y="107" fontSize="10" fill="#059669" fontWeight="bold">speeding up</text>
                    </svg>
                  </InterpretationCard>

                  <InterpretationCard
                    rule="A line with a negative slope means deceleration."
                    example="The object is slowing down."
                  >
                    <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                      <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M25,25 L175,115" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                      <text x="90" y="30" fontSize="10" fill="#059669" fontWeight="bold">falling line =</text>
                      <text x="90" y="42" fontSize="10" fill="#059669" fontWeight="bold">slowing down</text>
                    </svg>
                  </InterpretationCard>

                  <InterpretationCard
                    rule="The gradient = acceleration."
                    example="a = (change in speed) / (change in time)."
                  >
                    <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                      <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <path d="M25,115 L110,20" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                      <path d="M25,115 L175,90" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                      <text x="120" y="35" fontSize="10" fill="#1d4ed8" fontWeight="bold">steep = big a</text>
                      <text x="122" y="108" fontSize="10" fill="#f97316" fontWeight="bold">gentle = small a</text>
                    </svg>
                  </InterpretationCard>

                  <InterpretationCard
                    rule="The area under the graph = distance travelled."
                    example="This is the most important feature of speed–time graphs."
                  >
                    <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                      <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <polygon points="25,115 175,25 175,115" fill="#bbf7d0" opacity="0.7" />
                      <path d="M25,115 L175,25" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                      <text x="112" y="100" fontSize="10" fill="#15803d" fontWeight="bold">shaded area</text>
                      <text x="118" y="112" fontSize="10" fill="#15803d" fontWeight="bold">= distance</text>
                    </svg>
                  </InterpretationCard>

                  <InterpretationCard
                    rule="To find the area, split the graph into shapes (rectangles, triangles, trapeziums)."
                    example="Then calculate the sum of the areas."
                  >
                    <svg viewBox="0 0 200 130" className="w-full max-w-[190px]">
                      <line x1="25" y1="10" x2="25" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="25" y1="115" x2="185" y2="115" stroke="#94a3b8" strokeWidth="2" />
                      <polygon points="25,115 100,40 175,40 175,115" fill="#bbf7d0" opacity="0.6" />
                      <line x1="100" y1="40" x2="100" y2="115" stroke="#15803d" strokeWidth="1.5" strokeDasharray="3,3" />
                      <path d="M25,115 L100,40 L175,40" fill="none" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
                      <text x="45" y="103" fontSize="9" fill="#15803d" fontWeight="bold">triangle</text>
                      <text x="123" y="103" fontSize="9" fill="#15803d" fontWeight="bold">rectangle</text>
                    </svg>
                  </InterpretationCard>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Example Questions</h3>
                <div className="space-y-4">
                  {(showMoreSpeedTimeQuestions ? speedTimeGraphQuestions : speedTimeGraphQuestions.slice(0, 3)).map((item, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                        {index + 1}. {item.question}
                      </p>
                      <div className="mb-4 rounded-xl bg-slate-50 p-4">
                        <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                          Working
                        </p>
                        <div className="space-y-3">
                          {item.working.map((line, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                            >
                              <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                                {stepIndex + 1}
                              </span>
                              <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                                <BookWorkingLine line={line} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="font-bold text-emerald-700">Answer: {item.answer}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowMoreSpeedTimeQuestions((v) => !v)}
                  className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
                >
                  {showMoreSpeedTimeQuestions ? 'Show fewer questions' : 'View more questions'}
                </button>
              </div>
            </div>
          </div>
        )}

        {section.diagram && (
          section.diagram.bare ? (
            renderDiagram(section.diagram)
          ) : (
            <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
              {section.diagram.title && (
                <h4 className="mb-2 text-xs font-bold uppercase text-emerald-600">
                  {section.diagram.title}
                </h4>
              )}
              <div className="flex justify-center rounded-lg border border-emerald-100 bg-white">
                {renderDiagram(section.diagram)}
              </div>
              {section.diagram.caption && (
                <p className="mt-2 text-center text-sm italic text-slate-500">{section.diagram.caption}</p>
              )}
            </div>
          )
        )}

        {section.method && (
          <div className="mb-6">
            <TitleBanner>{section.method.title}</TitleBanner>
            {section.method.kind === 'rules' && section.method.rules ? (
              <RuleList rules={section.method.rules} />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                {section.method.rows?.map((r, i) => (
                  <StepRow key={i} step={r.step} formula={r.formula}>
                    {r.text}
                  </StepRow>
                ))}
              </div>
            )}
          </div>
        )}

        {section.id === 'motion-under-gravity' && (
          <div className="mt-10 border-t-4 border-slate-300 pt-8">
            <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
              Free Fall
            </h2>

            <DefinitionBox text="Free fall is the motion of an object falling under gravity alone, with no other forces (such as air resistance) acting on it. During free fall, the object's acceleration stays constant and equal to g throughout the whole fall." />

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-xl font-bold text-slate-900">Explanation</h3>
              <div className="space-y-4 leading-relaxed text-slate-700">
                <p>
                  When an object is dropped, it starts with zero speed. Gravity then pulls it
                  downward, and its speed increases by the same amount — about 10 m/s — every
                  single second it keeps falling. This steady increase is what "constant
                  acceleration" means.
                </p>
                <p>
                  Because the acceleration never changes during free fall, the same three
                  equations used for any uniformly accelerated motion apply here too — just
                  swap the letter <strong>a</strong> for <strong>g</strong>.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <TitleBanner>What Free Fall Looks Like</TitleBanner>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">The moment of release</p>
                  <p className="mb-3 min-h-10 text-center text-sm font-semibold text-blue-700">Released from rest · u = 0</p>
                  <svg viewBox="0 0 160 180" className="mx-auto w-full max-w-[180px]" aria-hidden="true">
                    <line x1="20" y1="20" x2="140" y2="20" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
                    <circle cx="80" cy="20" r="10" fill="#1d4ed8" />
                  </svg>
                  <p className="mt-2 text-center text-xs italic text-slate-500">
                    The hand lets go. The ball starts with zero speed.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">While it falls</p>
                  <p className="mb-3 min-h-10 text-center text-sm font-semibold text-emerald-700">Speed increases · a = g</p>
                  <svg viewBox="0 0 160 180" className="mx-auto w-full max-w-[180px]" aria-hidden="true">
                    <circle cx="80" cy="20" r="9" fill="#cbd5e1" />
                    <circle cx="80" cy="50" r="9" fill="#3b82f6" />
                    <circle cx="80" cy="140" r="9" fill="#1d4ed8" />
                    <line x1="80" y1="33" x2="80" y2="36" stroke="#059669" strokeWidth="2.5" markerEnd="url(#ff-arrow)" />
                    <line x1="80" y1="64" x2="80" y2="122" stroke="#059669" strokeWidth="2.5" markerEnd="url(#ff-arrow)" />
                    <defs>
                      <marker markerUnits="userSpaceOnUse" id="ff-arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                        <polygon points="0,0 6,3 0,6" fill="#059669" />
                      </marker>
                    </defs>
                  </svg>
                  <p className="mt-2 text-center text-xs italic text-slate-500">
                    Equal time steps: the gaps grow as the ball speeds up.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">Just before landing</p>
                  <p className="mb-3 min-h-10 text-center text-sm font-semibold text-red-700">Greatest speed during this fall</p>
                  <svg viewBox="0 0 160 180" className="mx-auto w-full max-w-[180px]" aria-hidden="true">
                    <line x1="15" y1="140" x2="145" y2="140" stroke="#475569" strokeWidth="3" />
                    <circle cx="80" cy="115" r="12" fill="#1d4ed8" />
                    <line x1="80" y1="70" x2="80" y2="98" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#ff-arrow2)" />
                    <defs>
                      <marker id="ff-arrow2" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                        <polygon points="0,0 6,3 0,6" fill="#dc2626" />
                      </marker>
                    </defs>
                  </svg>
                  <p className="mt-2 text-center text-xs italic text-slate-500">
                    The ball is moving fastest just above the ground (grey line).
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <TitleBanner>Free Fall — Live Simulation</TitleBanner>
              <FreeFallOnlyAnimation />
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Example Questions</h3>
              <div className="space-y-4">
                {(showMoreFreeFallQuestions ? freeFallQuestions : freeFallQuestions.slice(0, 3)).map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                      {index + 1}. {item.question}
                    </p>
                    <div className="mb-4 rounded-xl bg-slate-50 p-4">
                      <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                        Working
                      </p>
                      <div className="space-y-3">
                        {item.working.map((line, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                          >
                            <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                              {stepIndex + 1}
                            </span>
                            <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                              <BookWorkingLine line={line} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="font-bold text-emerald-700">Answer: {item.answer}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowMoreFreeFallQuestions((v) => !v)}
                className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
              >
                {showMoreFreeFallQuestions ? 'Show fewer questions' : 'View more questions'}
              </button>
            </div>

            <div className="mt-10 border-t-4 border-slate-300 pt-8">
              <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
                Terminal Velocity
              </h2>

              <DefinitionBox text="Terminal velocity is the maximum, constant velocity a falling object reaches when air resistance has grown large enough to balance its weight. Once this happens, the net force is zero, so acceleration is zero and speed no longer changes." />

              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <h3 className="mb-3 text-xl font-bold text-slate-900">Explanation</h3>
                <div className="space-y-4 leading-relaxed text-slate-700">
                  <p>
                    A falling object doesn't just speed up forever. As it falls, air resistance
                    pushes back against it, and this push gets stronger the faster the object
                    moves. Early in the fall, weight is much bigger than air resistance, so the
                    object accelerates quickly.
                  </p>
                  <p>
                    As speed builds up, air resistance keeps growing until it becomes exactly
                    equal to weight. From that point on, the two forces cancel out, there is
                    no net force, and the object falls at a steady, unchanging speed — its
                    terminal velocity.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <TitleBanner>The Three Stages of a Fall</TitleBanner>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">Just after jumping</p>
                    <svg viewBox="0 0 160 160" className="mx-auto w-full max-w-[160px]">
                      <defs>
                        <marker id="tv1-down" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
                          <path d="M1 1 L7 4 L1 7" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                        <marker id="tv1-up" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
                          <path d="M1 1 L7 4 L1 7" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                      </defs>
                      <circle cx="80" cy="70" r="10" fill="#1d4ed8" />
                      <line x1="80" y1="82" x2="80" y2="145" stroke="#dc2626" strokeWidth="3" markerEnd="url(#tv1-down)" />
                      <line x1="80" y1="58" x2="80" y2="42" stroke="#2563eb" strokeWidth="3" markerEnd="url(#tv1-up)" />
                      <text x="88" y="120" fontSize="9" fill="#dc2626" fontWeight="bold">weight (big)</text>
                      <text x="88" y="35" fontSize="9" fill="#2563eb" fontWeight="bold">air resistance</text>
                      <text x="88" y="46" fontSize="9" fill="#2563eb" fontWeight="bold">(almost none)</text>
                    </svg>
                    <p className="mt-2 text-center text-xs italic text-slate-500">
                      Weight wins — the skydiver speeds up quickly.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">Falling faster</p>
                    <svg viewBox="0 0 160 160" className="mx-auto w-full max-w-[160px]">
                      <defs>
                        <marker id="tv2-down" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
                          <path d="M1 1 L7 4 L1 7" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                        <marker id="tv2-up" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
                          <path d="M1 1 L7 4 L1 7" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                      </defs>
                      <circle cx="80" cy="80" r="10" fill="#1d4ed8" />
                      <line x1="80" y1="92" x2="80" y2="145" stroke="#dc2626" strokeWidth="3" markerEnd="url(#tv2-down)" />
                      <line x1="80" y1="68" x2="80" y2="25" stroke="#2563eb" strokeWidth="3" markerEnd="url(#tv2-up)" />
                      <text x="88" y="125" fontSize="9" fill="#dc2626" fontWeight="bold">weight</text>
                      <text x="88" y="45" fontSize="9" fill="#2563eb" fontWeight="bold">air resistance</text>
                      <text x="88" y="56" fontSize="9" fill="#2563eb" fontWeight="bold">(growing)</text>
                    </svg>
                    <p className="mt-2 text-center text-xs italic text-slate-500">
                      Air resistance is catching up — acceleration is getting smaller.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">Terminal velocity</p>
                    <svg viewBox="0 0 160 160" className="mx-auto w-full max-w-[160px]">
                      <defs>
                        <marker id="tv3-down" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
                          <path d="M1 1 L7 4 L1 7" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                        <marker id="tv3-up" viewBox="0 0 8 8" markerWidth="4" markerHeight="4" refX="7" refY="4" orient="auto">
                          <path d="M1 1 L7 4 L1 7" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                      </defs>
                      <circle cx="80" cy="80" r="10" fill="#1d4ed8" />
                      <line x1="80" y1="92" x2="80" y2="140" stroke="#dc2626" strokeWidth="3" markerEnd="url(#tv3-down)" />
                      <line x1="80" y1="68" x2="80" y2="20" stroke="#2563eb" strokeWidth="3" markerEnd="url(#tv3-up)" />
                      <text x="88" y="120" fontSize="9" fill="#dc2626" fontWeight="bold">weight</text>
                      <text x="88" y="40" fontSize="9" fill="#2563eb" fontWeight="bold">air resistance</text>
                      <text x="35" y="155" fontSize="9" fill="#15803d" fontWeight="bold">forces equal</text>
                    </svg>
                    <p className="mt-2 text-center text-xs italic text-slate-500">
                      Forces are balanced — speed is now constant.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <TitleBanner>Free Fall — Live Simulation</TitleBanner>
                <FreeFallLoopAnimation />
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Example Questions</h3>
                <div className="space-y-4">
                  {(showMoreTerminalVelocityQuestions ? terminalVelocityQuestions : terminalVelocityQuestions.slice(0, 3)).map((item, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                        {index + 1}. {item.question}
                      </p>
                      <div className="mb-4 rounded-xl bg-slate-50 p-4">
                        <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                          Working
                        </p>
                        <div className="space-y-3">
                          {item.working.map((line, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                            >
                              <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                                {stepIndex + 1}
                              </span>
                              <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                                <BookWorkingLine line={line} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="font-bold text-emerald-700">Answer: {item.answer}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowMoreTerminalVelocityQuestions((v) => !v)}
                  className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
                >
                  {showMoreTerminalVelocityQuestions ? 'Show fewer questions' : 'View more questions'}
                </button>
              </div>
            </div>

            <div className="mt-10 border-t-4 border-slate-300 pt-8">
              <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
                Acceleration Due to Gravity
              </h2>

              <DefinitionBox text="Acceleration due to gravity, g, is the constant acceleration that gravity gives to any object in free fall near the Earth's surface. Its value is about 9.8 m/s² (often rounded to 10 m/s²) and does not depend on the object's mass." />

              <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                <h3 className="mb-3 text-xl font-bold text-slate-900">Explanation</h3>
                <div className="space-y-4 leading-relaxed text-slate-700">
                  <p>
                    The value g = 9.8 m/s² means that, ignoring air resistance, any falling
                    object near Earth's surface gains about 9.8 m/s of speed for every second
                    it falls — whether it's a feather in a vacuum, a stone, or a car. Mass
                    doesn't change g; a heavier object isn't pulled down "harder" per kilogram
                    than a lighter one.
                  </p>
                  <p>
                    g isn't the same everywhere. It depends on the mass of the body pulling you
                    down and how far you are from its centre, which is why the Moon (much less
                    massive than Earth) has a much smaller g.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <TitleBanner>What g Actually Means</TitleBanner>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">Speed builds up every second</p>
                    <svg viewBox="0 0 200 140" className="mx-auto w-full max-w-[200px]">
                      <line x1="30" y1="10" x2="30" y2="120" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="30" y1="120" x2="185" y2="120" stroke="#94a3b8" strokeWidth="2" />
                      <circle cx="45" cy="115" r="4" fill="#1d4ed8" />
                      <circle cx="85" cy="90" r="4" fill="#1d4ed8" />
                      <circle cx="125" cy="55" r="4" fill="#1d4ed8" />
                      <circle cx="165" cy="15" r="4" fill="#1d4ed8" />
                      <path d="M45,115 L85,90 L125,55 L165,15" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="3,3" />
                      <text x="35" y="132" fontSize="8" fill="#475569">0s</text>
                      <text x="78" y="132" fontSize="8" fill="#475569">1s</text>
                      <text x="118" y="132" fontSize="8" fill="#475569">2s</text>
                      <text x="158" y="132" fontSize="8" fill="#475569">3s</text>
                      <text x="10" y="70" fontSize="8" fill="#475569" transform="rotate(-90 10 70)">Speed</text>
                      <text x="40" y="98" fontSize="8" fill="#059669" fontWeight="bold">+9.8 m/s</text>
                      <text x="80" y="70" fontSize="8" fill="#059669" fontWeight="bold">+9.8 m/s</text>
                      <text x="118" y="35" fontSize="8" fill="#059669" fontWeight="bold">+9.8 m/s</text>
                    </svg>
                    <p className="mt-2 text-center text-xs italic text-slate-500">
                      Speed increases by the same 9.8 m/s each second — that jump is g.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="ga-hand mb-2 text-center text-sm font-bold text-slate-600">g is different on other worlds</p>
                    <svg viewBox="0 0 200 140" className="mx-auto w-full max-w-[200px]">
                      <line x1="30" y1="10" x2="30" y2="120" stroke="#94a3b8" strokeWidth="2" />
                      <line x1="30" y1="120" x2="185" y2="120" stroke="#94a3b8" strokeWidth="2" />
                      <rect x="45" y="98" width="28" height="22" fill="#2563eb" />
                      <rect x="90" y="20" width="28" height="100" fill="#1d4ed8" />
                      <rect x="135" y="60" width="28" height="60" fill="#3b82f6" />
                      <text x="47" y="132" fontSize="8" fill="#475569">Moon</text>
                      <text x="90" y="132" fontSize="8" fill="#475569">Earth</text>
                      <text x="132" y="132" fontSize="8" fill="#475569">Mars</text>
                      <text x="45" y="93" fontSize="8" fill="#1d4ed8" fontWeight="bold">1.6</text>
                      <text x="93" y="16" fontSize="8" fill="#1d4ed8" fontWeight="bold">9.8</text>
                      <text x="136" y="55" fontSize="8" fill="#1d4ed8" fontWeight="bold">3.7</text>
                    </svg>
                    <p className="mt-2 text-center text-xs italic text-slate-500">
                      g (in m/s²) depends on the mass of the planet or moon.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <TitleBanner>Acceleration Due to Gravity — Live Simulation</TitleBanner>
                <GravityAccelAnimation />
              </div>

              <div className="mb-6">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Example Questions</h3>
                <div className="space-y-4">
                  {(showMoreGravityQuestions ? gravityQuestions : gravityQuestions.slice(0, 3)).map((item, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                      <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                        {index + 1}. {item.question}
                      </p>
                      <div className="mb-4 rounded-xl bg-slate-50 p-4">
                        <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                          Working
                        </p>
                        <div className="space-y-3">
                          {item.working.map((line, stepIndex) => (
                            <div
                              key={stepIndex}
                              className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                            >
                              <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                                {stepIndex + 1}
                              </span>
                              <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                                <BookWorkingLine line={line} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="font-bold text-emerald-700">Answer: {item.answer}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowMoreGravityQuestions((v) => !v)}
                  className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
                >
                  {showMoreGravityQuestions ? 'Show fewer questions' : 'View more questions'}
                </button>
              </div>
            </div>
          </div>
        )}

        {section.method2 && (
          <div className="mb-6">
            <TitleBanner>{section.method2.title}</TitleBanner>
            {section.method2.kind === 'rules' && section.method2.rules ? (
              <RuleList rules={section.method2.rules} forceList />
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                {section.method2.rows?.map((r, i) => (
                  <StepRow key={i} step={r.step} formula={r.formula}>
                    {r.text}
                  </StepRow>
                ))}
              </div>
            )}
          </div>
        )}

        {section.id === 'speed-velocity' && (
          <div className="mt-10 border-t-4 border-slate-300 pt-8">
            <h2 className="mb-5 text-3xl font-black text-[#0d2c45] sm:text-4xl">
              Acceleration
            </h2>

            <DefinitionBox
              text="Acceleration is the rate at which velocity changes with time. An object accelerates when it speeds up, slows down, or changes direction."
            />

            <div className="my-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5 sm:p-7">
              <p className="ga-hand mb-3 text-sm font-bold uppercase tracking-widest text-emerald-700">
                Acceleration formula
              </p>
              <div className="mb-5 text-center">
                <span className="ga-ink text-3xl font-bold text-blue-900 sm:text-4xl">
                  a = <Fraction numerator="v − u" denominator="t" />
                </span>
              </div>

              <div className="space-y-3 text-slate-700">
                <p><strong>a</strong> = acceleration, measured in metres per second squared (m/s²).</p>
                <p><strong>v</strong> = final velocity, measured in metres per second (m/s).</p>
                <p><strong>u</strong> = initial velocity, measured in metres per second (m/s).</p>
                <p><strong>t</strong> = time taken for the change in velocity, measured in seconds (s).</p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                What the formula means
              </h3>
              <p className="mb-4 leading-relaxed text-slate-700">
                The formula shows that acceleration is found by dividing the change in velocity
                by the time taken. First subtract the initial velocity from the final velocity.
                Then divide the answer by the time. A positive answer means the object is speeding
                up in the chosen direction, while a negative answer means the object is slowing down
                or accelerating in the opposite direction.
              </p>
              <p className="mb-4 leading-relaxed text-slate-700">
                The unit m/s² means that the velocity changes by a certain number of metres per
                second every second. For example, an acceleration of 3 m/s² means that the velocity
                increases by 3 m/s every second.
              </p>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                Acceleration in the real world
              </h3>
              <p className="leading-relaxed text-slate-700">
                Acceleration is used when analysing cars leaving traffic lights, buses braking,
                aircraft during take-off, rockets launching, lifts starting or stopping, athletes
                sprinting, and objects falling under gravity. Engineers use acceleration to design
                safer vehicles, calculate stopping distances, test seat belts and airbags, and
                control machines and transport systems.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-4 text-xl font-bold text-slate-900">
                Example Questions
              </h3>

              <div className="space-y-4">
                {visibleAccelerationQuestions.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <p className="mb-4 font-semibold leading-relaxed text-slate-900">
                      {index + 1}. {item.question}
                    </p>

                    <div className="mb-4 rounded-xl bg-slate-50 p-4">
                      <p className="ga-hand mb-3 text-base font-bold uppercase tracking-widest text-slate-500">
                        Working
                      </p>
                      <div className="space-y-3">
                        {item.working.map((line, stepIndex) => (
                          <div
                            key={stepIndex}
                            className="flex items-start gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0"
                          >
                            <span className="ga-hand flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-800">
                              {stepIndex + 1}
                            </span>

                            <div className="min-w-0 flex-1 pt-0.5 leading-relaxed">
                              <BookWorkingLine line={line} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <p className="font-bold text-emerald-700">
                      Answer: {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              {accelerationQuestions.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowMoreAccelerationQuestions((visible) => !visible)}
                  className="mt-5 rounded-xl border-2 border-emerald-700 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600"
                >
                  {showMoreAccelerationQuestions
                    ? 'Show fewer questions'
                    : 'View more questions'}
                </button>
              )}
            </div>
          </div>
        )}

            {section.id === 'speed-velocity' && (
            <>
            <TopicLesson
              title="Speed"
              definition="Speed is the distance travelled by an object per unit time. Speed is a scalar quantity because it has magnitude but no direction."
              formula={
                <>
                  speed = <Fraction numerator="distance" denominator="time" />
                </>
              }
              explanation={
                <>
                  <p>
                    Speed tells us how quickly an object covers a distance. To calculate
                    speed, divide the total distance travelled by the time taken.
                  </p>
                  <p>
                    The SI unit of speed is metres per second (m/s). Speed may also be
                    measured in kilometres per hour (km/h).
                  </p>
                </>
              }
              realWorld="Speed is used by drivers to monitor vehicles, by speed cameras to detect speeding, by athletes to measure performance, and by pilots and engineers to control moving machines."
              questions={[
                {
                  question: 'A car travels 150 m in 10 s. Calculate its speed.',
                  working: [
                    'Given: distance = 150 m and time = 10 s.',
                    'Use speed = distance / time.',
                    'speed = 150 / 10.',
                    'speed = 15 m/s.'
                  ],
                  answer: 'The speed of the car is 15 m/s.'
                },
                {
                  question: 'A cyclist travels 2 400 m in 120 s. Calculate the average speed.',
                  working: [
                    'Given: distance = 2 400 m and time = 120 s.',
                    'Use speed = distance / time.',
                    'speed = 2 400 / 120.',
                    'speed = 20 m/s.'
                  ],
                  answer: 'The average speed is 20 m/s.'
                },
                {
                  question: 'A bus travels 90 km in 2 hours. Calculate its average speed.',
                  working: [
                    'Given: distance = 90 km and time = 2 h.',
                    'Use speed = distance / time.',
                    'speed = 90 / 2.',
                    'speed = 45 km/h.'
                  ],
                  answer: 'The average speed is 45 km/h.'
                },
                {
                  question: 'A runner travels 800 m at a speed of 5 m/s. Calculate the time taken.',
                  working: [
                    'Given: distance = 800 m and speed = 5 m/s.',
                    'Rearrange speed = distance / time.',
                    'time = distance / speed.',
                    'time = 800 / 5 = 160 s.'
                  ],
                  answer: 'The time taken is 160 s.'
                },
                {
                  question: 'Convert 72 km/h into m/s.',
                  working: [
                    'Use 1 km/h = 5/18 m/s.',
                    '72 km/h = 72 × 5/18 m/s.',
                    '72 ÷ 18 = 4.',
                    'speed = 4 × 5 = 20 m/s.'
                  ],
                  answer: '72 km/h is equal to 20 m/s.'
                }
              ]}
            />

            <TopicLesson
              title="Velocity"
              definition="Velocity is the rate of change of displacement. Velocity is a vector quantity because it has both magnitude and direction."
              formula={
                <>
                  velocity = <Fraction numerator="displacement" denominator="time" />
                </>
              }
              explanation={
                <>
                  <p>
                    Velocity is calculated by dividing displacement by time. The direction
                    must always be included, for example 12 m/s east.
                  </p>
                  <p>
                    Unlike speed, velocity can be positive, negative, or zero depending on
                    the chosen direction and the object's change in position.
                  </p>
                </>
              }
              realWorld="Velocity is used in navigation, GPS systems, aircraft control, weather forecasting, robotics, and the analysis of vehicles moving in a particular direction."
              questions={[
                {
                  question: 'A car has a displacement of 240 m east in 12 s. Calculate its velocity.',
                  working: [
                    'Given: displacement = 240 m east and time = 12 s.',
                    'Use velocity = displacement / time.',
                    'velocity = 240 / 12.',
                    'velocity = 20 m/s east.'
                  ],
                  answer: 'The velocity is 20 m/s east.'
                },
                {
                  question: 'A boat moves 600 m north in 30 s. Calculate its velocity.',
                  working: [
                    'Given: displacement = 600 m north and time = 30 s.',
                    'Use velocity = displacement / time.',
                    'velocity = 600 / 30.',
                    'velocity = 20 m/s north.'
                  ],
                  answer: 'The velocity is 20 m/s north.'
                },
                {
                  question: 'An object has a displacement of 45 m west in 9 s. Find its velocity.',
                  working: [
                    'Given: displacement = 45 m west and time = 9 s.',
                    'Use velocity = displacement / time.',
                    'velocity = 45 / 9.',
                    'velocity = 5 m/s west.'
                  ],
                  answer: 'The velocity is 5 m/s west.'
                },
                {
                  question: 'A runner completes one full circular lap and finishes at the starting point. What is the average velocity?',
                  working: [
                    'The final position is the same as the initial position.',
                    'Therefore displacement = 0 m.',
                    'Use velocity = displacement / time.',
                    'velocity = 0 / time = 0 m/s.'
                  ],
                  answer: 'The average velocity is 0 m/s.'
                },
                {
                  question: 'A vehicle moves 100 m east and then 40 m west in 20 s. Calculate its average velocity.',
                  working: [
                    'Take east as positive.',
                    'Displacement = 100 − 40 = 60 m east.',
                    'Use velocity = displacement / time.',
                    'velocity = 60 / 20 = 3 m/s east.'
                  ],
                  answer: 'The average velocity is 3 m/s east.'
                }
              ]}
            />

            <TopicLesson
              title="Distance"
              definition="Distance is the total length of the path travelled by an object. Distance is a scalar quantity because it has magnitude only and no direction."
              formula={
                <>
                  distance = speed × time
                </>
              }
              explanation={
                <>
                  <p>
                    Distance measures the complete route followed by an object. Every part
                    of the path is included, even when the object changes direction.
                  </p>
                  <p>
                    Distance is never negative. Its common units are metres (m) and
                    kilometres (km).
                  </p>
                </>
              }
              realWorld="Distance is used to measure road journeys, railway routes, walking trails, fuel consumption, delivery routes, and the total path travelled by athletes and vehicles."
              questions={[
                {
                  question: 'A car travels at 18 m/s for 20 s. Calculate the distance travelled.',
                  working: [
                    'Given: speed = 18 m/s and time = 20 s.',
                    'Use distance = speed × time.',
                    'distance = 18 × 20.',
                    'distance = 360 m.'
                  ],
                  answer: 'The distance travelled is 360 m.'
                },
                {
                  question: 'A train travels at 25 m/s for 40 s. Find the distance travelled.',
                  working: [
                    'Given: speed = 25 m/s and time = 40 s.',
                    'Use distance = speed × time.',
                    'distance = 25 × 40.',
                    'distance = 1 000 m.'
                  ],
                  answer: 'The train travels 1 000 m.'
                },
                {
                  question: 'A cyclist travels 3 km east and then 2 km west. Calculate the total distance.',
                  working: [
                    'Distance includes the complete path.',
                    'Total distance = 3 + 2.',
                    'Total distance = 5 km.'
                  ],
                  answer: 'The total distance is 5 km.'
                },
                {
                  question: 'A bus travels at 60 km/h for 2.5 hours. Calculate the distance travelled.',
                  working: [
                    'Given: speed = 60 km/h and time = 2.5 h.',
                    'Use distance = speed × time.',
                    'distance = 60 × 2.5.',
                    'distance = 150 km.'
                  ],
                  answer: 'The distance travelled is 150 km.'
                },
                {
                  question: 'An athlete runs at 4 m/s for 3 minutes. Calculate the distance in metres.',
                  working: [
                    'Convert time: 3 minutes = 3 × 60 = 180 s.',
                    'Use distance = speed × time.',
                    'distance = 4 × 180.',
                    'distance = 720 m.'
                  ],
                  answer: 'The athlete runs 720 m.'
                }
              ]}
            />

            <TopicLesson
              title="Displacement"
              definition="Displacement is the shortest straight-line distance from an object's initial position to its final position in a specified direction. Displacement is a vector quantity."
              formula={
                <>
                  displacement = final position − initial position
                </>
              }
              explanation={
                <>
                  <p>
                    Displacement compares where an object finishes with where it started.
                    Direction must be stated, such as east, west, north, or south.
                  </p>
                  <p>
                    Displacement may be positive, negative, or zero. If an object returns
                    to its starting point, its displacement is zero even though it has
                    travelled a distance.
                  </p>
                </>
              }
              realWorld="Displacement is important in GPS navigation, surveying, construction, robotics, aircraft navigation, and describing the movement of objects from one position to another."
              questions={[
                {
                  question: 'A person walks 80 m east and then 30 m west. Calculate the displacement.',
                  working: [
                    'Take east as positive.',
                    'Displacement = 80 − 30.',
                    'Displacement = 50 m east.'
                  ],
                  answer: 'The displacement is 50 m east.'
                },
                {
                  question: 'A car moves from position 10 m east of a reference point to position 40 m east. Find its displacement.',
                  working: [
                    'Initial position = 10 m east.',
                    'Final position = 40 m east.',
                    'Displacement = final position − initial position.',
                    'Displacement = 40 − 10 = 30 m east.'
                  ],
                  answer: 'The displacement is 30 m east.'
                },
                {
                  question: 'A runner completes one full lap of a circular track and finishes at the starting point. Find the displacement.',
                  working: [
                    'Initial position and final position are the same.',
                    'Displacement = final position − initial position.',
                    'Displacement = 0 m.'
                  ],
                  answer: 'The displacement is 0 m.'
                },
                {
                  question: 'A boat travels 120 m north and then 50 m south. Calculate its displacement.',
                  working: [
                    'Take north as positive.',
                    'Displacement = 120 − 50.',
                    'Displacement = 70 m north.'
                  ],
                  answer: 'The displacement is 70 m north.'
                },
                {
                  question: 'An object moves from 15 m west of a point to 25 m east of the point. Calculate its displacement.',
                  working: [
                    'Take east as positive.',
                    'Initial position = −15 m.',
                    'Final position = +25 m.',
                    'Displacement = 25 − (−15).',
                    'Displacement = 40 m east.'
                  ],
                  answer: 'The displacement is 40 m east.'
                }
              ]}
            />
            </>
            )}

        {section.id === 'speed-velocity' && <EquationsOfMotionLesson />}

        {section.keyFormula && <KeyFormula label={section.keyFormula.label} formula={section.keyFormula.formula} />}
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">
          {section.workedAnimated?.title || 'Worked Examples — Step by Step'}
        </h3>
        <WorkedExampleExplorer
          examples={section.workedAnimated?.examples || section.examples}
        />
      </div>

      <PracticeZone items={section.practice} />
    </section>
  );
};

/* ========================================================================
  MAIN EXPORT
  ======================================================================== */

export const Kinematics: React.FC = () => {
  const [active, setActive] = useState<string>(sections[0].id);

  const activeIndex = Math.max(0, sections.findIndex(s => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];

  const handleNavigate = (id: string) => {
    setActive(id);
  };

  useEffect(() => {
    const resetScroll = () => {
      const scrollArea = document.getElementById('ga-scroll-area');
      if (scrollArea) scrollArea.scrollTop = 0;

      let node: HTMLElement | null = document.getElementById('lesson-scroll-area');
      while (node) {
        node.scrollTop = 0;
        node = node.parentElement;
      }

      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const raf1 = requestAnimationFrame(() => {
      resetScroll();
      requestAnimationFrame(resetScroll);
    });
    return () => cancelAnimationFrame(raf1);
  }, [active]);

  const goNext = () => {
    const next = sections[activeIndex + 1];
    if (next) handleNavigate(next.id);
  };

  const goPrev = () => {
    const prev = sections[activeIndex - 1];
    if (prev) handleNavigate(prev.id);
  };

  return (
    <div id="ga-scroll-area" className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />

      {/* Header — flat Duolingo-style color band, full width */}
      <div className="relative w-full pb-8 pt-10 text-white transition-colors duration-300" style={{ backgroundColor: activeSection.accentColor }}>
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <span className="inline-flex items-center justify-center rounded-full bg-white/25 px-3.5 py-1 text-xs font-black tracking-wider uppercase text-white">
            TOPIC 2
          </span>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            Kinematics
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            The study of motion — how objects move, how fast they go, and how their motion changes.
            In this chapter, you'll learn about speed, velocity, acceleration, and how to read
            motion graphs, all with real-world examples and step-by-step guidance.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex min-w-0 flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-1 text-left sm:gap-2.5 mr-auto">
            {sections.map(s => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${
                    isActive
                      ? 'border-b-4 text-white shadow-sm'
                      : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  style={
                    isActive
                      ? { backgroundColor: s.accentColor, borderColor: shadeColor(s.accentColor, -25) }
                      : undefined
                  }
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="lesson-scroll-area" className="w-full min-w-0 max-w-full px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
        <div key={activeSection.id}>
          <Section section={activeSection} />
        </div>

        <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            ← Previous
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">
            {activeIndex + 1} / {sections.length}
          </span>
          <button
            onClick={goNext}
            disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kinematics;