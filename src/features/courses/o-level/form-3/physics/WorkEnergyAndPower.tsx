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
  type: 'image' | 'energy' | 'power';
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
    const t = setTimeout(() => setCount(c => c + 1), speed);
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

/* ---- Energy Forms Diagram ---- */

const EnergyFormsDiagram: React.FC = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Forms of Energy</h4>
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-4">
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">⚡</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Electrical</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">🔥</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Heat</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">💡</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Light</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">🔊</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Sound</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">🏃</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Kinetic</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">⬆️</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Potential</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">🧪</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Chemical</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-3">
          <span className="text-3xl">☢️</span>
          <span className="mt-1 text-xs font-bold text-slate-700">Nuclear</span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        Energy exists in many forms and can be converted from one form to another.
      </p>
    </div>
  );
};

/* ---- Energy Sources Diagram ---- */

const EnergySourcesDiagram: React.FC = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Sources of Energy</h4>
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-4">
        <div className="flex flex-col items-center rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <span className="text-3xl">☀️</span>
          <span className="mt-1 text-xs font-bold text-green-700">Solar</span>
          <span className="text-[10px] text-green-600">Renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <span className="text-3xl">💨</span>
          <span className="mt-1 text-xs font-bold text-green-700">Wind</span>
          <span className="text-[10px] text-green-600">Renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <span className="text-3xl">🌊</span>
          <span className="mt-1 text-xs font-bold text-green-700">Hydro</span>
          <span className="text-[10px] text-green-600">Renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <span className="text-3xl">🌋</span>
          <span className="mt-1 text-xs font-bold text-green-700">Geothermal</span>
          <span className="text-[10px] text-green-600">Renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-amber-200 bg-amber-50 p-3">
          <span className="text-3xl">🪨</span>
          <span className="mt-1 text-xs font-bold text-amber-700">Nuclear</span>
          <span className="text-[10px] text-amber-600">Non-renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-amber-200 bg-amber-50 p-3">
          <span className="text-3xl">⛽</span>
          <span className="mt-1 text-xs font-bold text-amber-700">Fossil Fuels</span>
          <span className="text-[10px] text-amber-600">Non-renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-amber-200 bg-amber-50 p-3">
          <span className="text-3xl">🌊</span>
          <span className="mt-1 text-xs font-bold text-amber-700">Tidal</span>
          <span className="text-[10px] text-amber-600">Renewable</span>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <span className="text-3xl">🌱</span>
          <span className="mt-1 text-xs font-bold text-green-700">Biomass</span>
          <span className="text-[10px] text-green-600">Renewable</span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        Renewable sources can be replenished naturally; non-renewable sources are finite and will eventually run out.
      </p>
    </div>
  );
};

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'work',
    eyebrow: 'Chapter 6.1',
    title: 'Work',
    heading: 'Work — Force Moving a Distance',
    intro:
      'In physics, **work** has a very specific meaning: it is done when a force moves its point of application in the direction of the force.',
    intro2:
      'If you push against a wall and it doesn\'t move, you are not doing any work in the physics sense — even if you are using a lot of effort. Work requires movement in the direction of the force.',
    introMore: [
      '**Work done = Force × Distance moved in the direction of the force.**',
      'The unit of work is the **joule (J)** — 1 J is the work done when a force of 1 N moves an object 1 m in the direction of the force.',
      'If the force and the movement are not in the same direction, you must use the component of the force in the direction of motion.',
    ],
    definition:
      '**Work** is the product of the force applied to an object and the distance the object moves in the direction of the force.\n\n' +
      'Work is done only when the force causes movement in the direction of the force. Mathematically: W = F × d.',
    method: {
      title: 'Calculating Work Done',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Identify the force', text: 'Determine the force (F) applied to the object, measured in newtons (N).' },
        { step: 2, formula: 'Measure the distance', text: 'Measure the distance (d) the object moves in the direction of the force, measured in metres (m).' },
        { step: 3, formula: 'W = F × d', text: 'Multiply the force by the distance to find the work done.' },
        { step: 4, formula: 'Unit: Joules (J)', text: '1 J = 1 N × 1 m. The work done is measured in joules.' },
      ],
    },
    method2: {
      title: 'Key Points About Work',
      kind: 'rules',
      rules: [
        { rule: 'Work is only done when there is movement.', example: 'Pushing a wall that does not move = no work done.' },
        { rule: 'Movement must be in the direction of the force.', example: 'If you pull a sled at an angle, only the horizontal component of the force does work.' },
        { rule: 'Work is a scalar quantity.', example: 'It has magnitude only — no direction.' },
        { rule: 'The joule (J) is the SI unit for work.', example: '1 J = 1 N·m = 1 kg·m²/s².' },
      ],
    },
    keyFormula: {
      label: 'Work Done:',
      formula: 'W = F × d',
    },
    examples: [
      {
        question: 'A force of 50 N is used to push a box 4 m across the floor. Calculate the work done.',
        steps: ['F = 50 N', 'd = 4 m', 'W = F × d = 50 × 4 = 200 J'],
        answer: 'W = 200 J',
      },
      {
        question: 'A student lifts a 200 N weight vertically upwards by 1.5 m. How much work is done?',
        steps: ['Force = weight = 200 N', 'Distance = 1.5 m', 'W = 200 × 1.5 = 300 J'],
        answer: 'W = 300 J',
      },
      {
        question: 'A force of 80 N is applied to a trolley, moving it 5 m. Calculate the work done.',
        steps: ['F = 80 N', 'd = 5 m', 'W = 80 × 5 = 400 J'],
        answer: 'W = 400 J',
      },
      {
        question: 'A person pulls a suitcase with a force of 120 N at an angle. The horizontal component of the force is 80 N, and the suitcase moves 6 m. Calculate the work done.',
        steps: ['Horizontal force = 80 N', 'Distance = 6 m', 'Work = 80 × 6 = 480 J'],
        answer: 'W = 480 J',
      },
    ],
    practice: [
      'Define work in the physics sense. What is the condition for work to be done?',
      'A force of 30 N moves a box 2.5 m. Calculate the work done.',
      'A crane lifts a 5000 N load 8 m. How much work is done?',
      'Explain why no work is done when you push against a wall that does not move.',
      'A girl pushes a trolley with a force of 45 N for a distance of 12 m. Calculate the work done.',
    ],
  },
  {
    id: 'energy',
    eyebrow: 'Chapter 6.2',
    title: 'Energy',
    heading: 'Energy — The Capacity to Do Work',
    intro:
      '**Energy** is the capacity to do work. It is what allows objects to move, change, or cause change in other objects.',
    intro2:
      'Energy exists in many forms, and it can be converted from one form to another. The **Law of Conservation of Energy** states that energy cannot be created or destroyed — it can only be transformed.',
    introMore: [
      '**Forms of energy:** chemical, kinetic, gravitational potential, heat, light, sound, electrical, nuclear.',
      '**Sources of energy:** hydro-electric power (HEP), solar, nuclear, geothermal, wind, tides, fossil fuels.',
      '**Renewable energy sources** can be replenished naturally (solar, wind, hydro, geothermal).',
      '**Non-renewable energy sources** are finite and will eventually run out (fossil fuels, nuclear).',
      'Batteries and accumulators must be disposed of safely as they can be harmful to the environment.',
    ],
    definition:
      '**Energy** is the capacity to do work. It is measured in joules (J).\n\n' +
      'The **Law of Conservation of Energy** states that energy cannot be created or destroyed, only transformed from one form to another.',
    method: {
      title: 'Forms and Sources of Energy',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Identify the form', text: 'Determine what form the energy is in: kinetic, potential, chemical, heat, light, sound, electrical, or nuclear.' },
        { step: 2, formula: 'Trace the conversion', text: 'Energy often changes from one form to another. Trace the conversion path.' },
        { step: 3, formula: 'Apply conservation', text: 'Total energy before = Total energy after (assuming no losses).' },
        { step: 4, formula: 'Consider losses', text: 'In real systems, some energy is always lost as heat due to friction.' },
      ],
    },
    method2: {
      title: 'Energy Conservation and Safety',
      kind: 'rules',
      rules: [
        { rule: 'Energy cannot be created or destroyed.', example: 'Energy is always conserved in any process.' },
        { rule: 'Energy can be converted from one form to another.', example: 'A battery converts chemical energy to electrical energy.' },
        { rule: 'Energy conversions are never 100% efficient.', example: 'Some energy is always lost as heat or sound.' },
        { rule: 'Batteries and accumulators must be disposed of safely.', example: 'They contain toxic chemicals that can harm the environment.' },
      ],
    },
    keyFormula: {
      label: 'Law of Conservation of Energy:',
      formula: 'Total Energy (initial) = Total Energy (final)',
    },
    examples: [
      {
        question: 'A light bulb converts electrical energy into light and heat. What forms of energy are involved?',
        steps: [
          'Input: Electrical energy from the mains or battery.',
          'Output: Light energy (useful) and heat energy (waste).',
          'The total energy output equals the total energy input.',
        ],
        answer: 'Electrical → Light + Heat (conservation of energy).',
      },
      {
        question: 'A hydro-electric power station converts energy from falling water into electrical energy. Trace the energy conversion.',
        steps: [
          'Gravitational potential energy of water in the reservoir.',
          'Kinetic energy as the water falls and turns the turbine.',
          'Mechanical energy of the turbine.',
          'Electrical energy generated by the generator.',
        ],
        answer: 'Gravitational potential → Kinetic → Mechanical → Electrical.',
      },
      {
        question: 'Explain why energy is often "lost" in real-life energy conversions.',
        steps: [
          'Energy is not destroyed, but it is often converted into less useful forms.',
          'For example, friction converts mechanical energy into heat energy.',
          'The heat energy is often dissipated to the surroundings and is difficult to reuse.',
        ],
        answer: 'Energy is converted into heat due to friction, which is then dissipated and becomes difficult to use.',
      },
    ],
    practice: [
      'Define energy and state the unit for energy.',
      'List five different forms of energy and give an example of each.',
      'What is the Law of Conservation of Energy?',
      'Give two examples of renewable energy sources and two examples of non-renewable energy sources.',
      'Explain why batteries should be disposed of safely and not thrown in the bin.',
    ],
  },
  {
    id: 'power',
    eyebrow: 'Chapter 6.3',
    title: 'Power',
    heading: 'Power — The Rate of Doing Work',
    intro:
      '**Power** is the rate at which work is done (or energy is transferred). It tells us how quickly energy is being used or work is being done.',
    intro2:
      'Two machines can do the same amount of work, but the one with more power does it faster. Power is a measure of how "powerful" a device is.',
    introMore: [
      '**Power = Energy / Time = Work Done / Time.**',
      'The unit of power is the **watt (W)** — 1 W = 1 J/s.',
      'For a moving object, power can also be calculated as: Power = Force × Velocity (P = Fv).',
      'Everyday examples: a 100 W light bulb uses 100 J of energy every second. A car engine with more power can accelerate faster.',
    ],
    definition:
      '**Power** is the rate at which work is done or energy is transferred. It is measured in watts (W), where 1 W = 1 J/s.\n\n' +
      'Mathematically: P = W / t = E / t. For constant force and velocity: P = F × v.',
    method: {
      title: 'Calculating Power',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Work done or energy', text: 'Find the work done (W) or energy transferred (E) in joules.' },
        { step: 2, formula: 'Time taken', text: 'Measure the time (t) in seconds for the work to be done.' },
        { step: 3, formula: 'P = W / t', text: 'Divide the work done by the time taken to find power.' },
        { step: 4, formula: 'Unit: Watts (W)', text: '1 W = 1 J/s. Other units: kilowatt (kW) = 1000 W, megawatt (MW) = 1,000,000 W.' },
      ],
    },
    method2: {
      title: 'Power — Key Points',
      kind: 'rules',
      rules: [
        { rule: 'Power is the rate of doing work.', example: 'A powerful machine can do the same work in less time.' },
        { rule: 'P = F × v for constant speed.', example: 'A car moving at constant speed has power = force × velocity.' },
        { rule: 'The watt is a small unit.', example: 'A light bulb uses tens of watts; a car engine uses tens of kilowatts.' },
        { rule: 'Power is also the rate of energy transfer.', example: 'A 100 W lamp transfers 100 J of energy every second.' },
      ],
    },
    keyFormula: {
      label: 'Power formulas:',
      formula: (
        <>
          P = W / t &nbsp;&nbsp;|&nbsp;&nbsp; P = E / t &nbsp;&nbsp;|&nbsp;&nbsp; P = F × v
        </>
      ),
    },
    examples: [
      {
        question: 'A student does 500 J of work in 10 seconds. Calculate the power.',
        steps: ['Work = 500 J', 'Time = 10 s', 'P = W / t = 500 / 10 = 50 W'],
        answer: 'P = 50 W',
      },
      {
        question: 'A motor lifts a 300 N load through a height of 5 m in 4 seconds. Calculate the power.',
        steps: ['Work = Force × Distance = 300 × 5 = 1500 J', 'Time = 4 s', 'P = 1500 / 4 = 375 W'],
        answer: 'P = 375 W',
      },
      {
        question: 'A car engine exerts a force of 2000 N and moves at a constant speed of 25 m/s. Calculate the power output.',
        steps: ['F = 2000 N', 'v = 25 m/s', 'P = F × v = 2000 × 25 = 50,000 W = 50 kW'],
        answer: 'P = 50 kW',
      },
      {
        question: 'A 100 W light bulb is left on for 30 seconds. How much energy does it use?',
        steps: ['P = 100 W', 't = 30 s', 'Energy = P × t = 100 × 30 = 3000 J'],
        answer: 'Energy = 3000 J',
      },
    ],
    practice: [
      'Define power and state its unit.',
      'A person does 800 J of work in 20 seconds. Calculate the power.',
      'A motor lifts a 200 kg load through a height of 3 m in 6 seconds. Calculate the power. (g = 10 m/s²)',
      'A car moves at a constant speed of 30 m/s with a driving force of 1500 N. Calculate the power output.',
      'Explain the difference between work and power, using examples.',
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

const Section: React.FC<SectionProps> = ({ section }) => {
  // Render special inline diagrams based on section id
  const renderInlineDiagram = () => {
    if (section.id === 'energy') {
      return (
        <>
          <EnergyFormsDiagram />
          <EnergySourcesDiagram />
        </>
      );
    }
    return null;
  };

  return (
    <section id={section.id} className="mb-16 scroll-mt-24">
      <div className="relative mb-6 -mx-3 overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:-mx-5 md:-mx-8 lg:-mx-10">
        <div className="h-2 w-full bg-[#0d2c45]" />
        <div className="relative flex min-h-[70px] items-center">
          <div className="relative z-10 flex items-center rounded-none rounded-br-[32px] bg-[#0d2c45] py-3 pl-5 pr-8 text-white sm:rounded-br-[40px] sm:py-4 sm:pl-6 sm:pr-10">
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

        {/* Inline diagrams for specific sections */}
        {renderInlineDiagram()}

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

export const WorkEnergyAndPower: React.FC = () => {
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

      {/* Header — solid color (matching previous topics) */}
      <div className="relative overflow-hidden bg-[#0d2c45] border-b-4 border-[#0a1f33] pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40">
              TOPIC 6
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Work, Energy &amp; Power
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Work, energy, and power are fundamental concepts in physics that describe how forces
            cause change, how energy is stored and transferred, and how quickly work can be done.
            In this chapter, you'll learn to calculate work done, understand energy conversions,
            and measure power — with real-world examples and practical applications.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex min-w-0 flex-wrap items-center justify-start gap-1.5 pb-1 text-left sm:gap-2.5 mr-auto">
            {sections.map(s => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${
                    isActive
                      ? 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm'
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

export default WorkEnergyAndPower;