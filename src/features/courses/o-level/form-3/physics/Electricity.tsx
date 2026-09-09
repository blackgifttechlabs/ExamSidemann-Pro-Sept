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
  type: 'image' | 'electrostatics' | 'circuit' | 'plug' | 'graph';
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

/* ========================================================================
  ELECTRICITY DIAGRAMS (SVG)
  ======================================================================== */

/* ---- Electric Field Lines ---- */
const ElectricFieldDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Electric Field Lines</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Positive Charge</p>
        <svg viewBox="0 0 120 120" className="mx-auto h-auto w-32">
          <circle cx="60" cy="60" r="15" fill="#dc2626" />
          <text x="60" y="65" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">+</text>
          <line x1="60" y1="45" x2="60" y2="15" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="60" y1="75" x2="60" y2="105" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="45" y1="60" x2="15" y2="60" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="75" y1="60" x2="105" y2="60" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="50" y1="50" x2="25" y2="25" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="70" y1="50" x2="95" y2="25" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="50" y1="70" x2="25" y2="95" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <line x1="70" y1="70" x2="95" y2="95" stroke="#2563eb" strokeWidth="1.5" markerEnd="url(#arrowField)" />
          <defs>
            <marker id="arrowField" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#2563eb" />
            </marker>
          </defs>
        </svg>
        <p className="text-center text-xs text-slate-600">Lines radiate outwards</p>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Negative Charge</p>
        <svg viewBox="0 0 120 120" className="mx-auto h-auto w-32">
          <circle cx="60" cy="60" r="15" fill="#2563eb" />
          <text x="60" y="65" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">−</text>
          <line x1="60" y1="45" x2="60" y2="15" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="60" y1="75" x2="60" y2="105" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="45" y1="60" x2="15" y2="60" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="75" y1="60" x2="105" y2="60" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="50" y1="50" x2="25" y2="25" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="70" y1="50" x2="95" y2="25" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="50" y1="70" x2="25" y2="95" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <line x1="70" y1="70" x2="95" y2="95" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrowField2)" />
          <defs>
            <marker id="arrowField2" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#dc2626" />
            </marker>
          </defs>
        </svg>
        <p className="text-center text-xs text-slate-600">Lines point inwards</p>
      </div>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Electric field lines show the direction of force on a positive test charge. They point away from positive charges and towards negative charges.
    </p>
  </div>
);

/* ---- Circuit Diagrams ---- */
const CircuitDiagrams: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Series and Parallel Circuits</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Series Circuit</p>
        <svg viewBox="0 0 200 120" className="mx-auto h-auto w-full max-w-[200px]">
          <rect x="10" y="50" width="20" height="20" fill="#94a3b8" rx="4" />
          <text x="20" y="64" textAnchor="middle" fontSize="8" fill="white">Cell</text>
          <line x1="30" y1="60" x2="70" y2="60" stroke="#475569" strokeWidth="2" />
          <circle cx="70" cy="60" r="6" fill="#fcd34d" stroke="#475569" strokeWidth="1" />
          <text x="70" y="64" textAnchor="middle" fontSize="6" fill="black">R₁</text>
          <line x1="76" y1="60" x2="120" y2="60" stroke="#475569" strokeWidth="2" />
          <circle cx="120" cy="60" r="6" fill="#fcd34d" stroke="#475569" strokeWidth="1" />
          <text x="120" y="64" textAnchor="middle" fontSize="6" fill="black">R₂</text>
          <line x1="126" y1="60" x2="180" y2="60" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="60" x2="180" y2="20" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="20" x2="10" y2="20" stroke="#475569" strokeWidth="2" />
          <line x1="10" y1="20" x2="10" y2="50" stroke="#475569" strokeWidth="2" />
          <text x="95" y="92" textAnchor="middle" fontSize="10" fill="#475569">Same current, voltages add</text>
        </svg>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-amber-700">Parallel Circuit</p>
        <svg viewBox="0 0 200 120" className="mx-auto h-auto w-full max-w-[200px]">
          <rect x="10" y="50" width="20" height="20" fill="#94a3b8" rx="4" />
          <text x="20" y="64" textAnchor="middle" fontSize="8" fill="white">Cell</text>
          <line x1="30" y1="60" x2="60" y2="60" stroke="#475569" strokeWidth="2" />
          <line x1="60" y1="60" x2="60" y2="20" stroke="#475569" strokeWidth="2" />
          <line x1="60" y1="60" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
          <line x1="60" y1="20" x2="140" y2="20" stroke="#475569" strokeWidth="2" />
          <line x1="60" y1="100" x2="140" y2="100" stroke="#475569" strokeWidth="2" />
          <line x1="140" y1="20" x2="140" y2="60" stroke="#475569" strokeWidth="2" />
          <line x1="140" y1="100" x2="140" y2="60" stroke="#475569" strokeWidth="2" />
          <circle cx="100" cy="20" r="6" fill="#fcd34d" stroke="#475569" strokeWidth="1" />
          <text x="100" y="24" textAnchor="middle" fontSize="6" fill="black">R₁</text>
          <circle cx="100" cy="100" r="6" fill="#fcd34d" stroke="#475569" strokeWidth="1" />
          <text x="100" y="104" textAnchor="middle" fontSize="6" fill="black">R₂</text>
          <line x1="140" y1="60" x2="180" y2="60" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="60" x2="180" y2="20" stroke="#475569" strokeWidth="2" />
          <line x1="180" y1="20" x2="140" y2="20" stroke="#475569" strokeWidth="2" />
          <text x="100" y="92" textAnchor="middle" fontSize="10" fill="#475569">Same voltage, currents add</text>
        </svg>
      </div>
    </div>
  </div>
);

/* ---- V-I Graphs ---- */
const VIGraphDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">V–I Graphs: Ohmic vs Non-Ohmic</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Ohmic Conductor</p>
        <svg viewBox="0 0 160 120" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="10" y="10" width="140" height="100" fill="none" stroke="#475569" strokeWidth="1" />
          <line x1="10" y1="110" x2="150" y2="110" stroke="#475569" strokeWidth="1" />
          <line x1="10" y1="10" x2="10" y2="110" stroke="#475569" strokeWidth="1" />
          <line x1="15" y1="105" x2="140" y2="15" stroke="#2563eb" strokeWidth="2" />
          <text x="75" y="10" textAnchor="middle" fontSize="8" fill="#475569">V</text>
          <text x="155" y="60" fontSize="8" fill="#475569">I</text>
          <text x="30" y="90" fontSize="8" fill="#2563eb">straight line</text>
          <text x="30" y="100" fontSize="8" fill="#475569">R = constant</text>
        </svg>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-amber-700">Non-Ohmic (e.g. filament lamp)</p>
        <svg viewBox="0 0 160 120" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="10" y="10" width="140" height="100" fill="none" stroke="#475569" strokeWidth="1" />
          <line x1="10" y1="110" x2="150" y2="110" stroke="#475569" strokeWidth="1" />
          <line x1="10" y1="10" x2="10" y2="110" stroke="#475569" strokeWidth="1" />
          <path d="M20,90 Q50,80 70,60 Q90,40 120,20" fill="none" stroke="#d97706" strokeWidth="2" />
          <text x="75" y="10" textAnchor="middle" fontSize="8" fill="#475569">V</text>
          <text x="155" y="60" fontSize="8" fill="#475569">I</text>
          <text x="30" y="90" fontSize="8" fill="#d97706">curve</text>
          <text x="30" y="100" fontSize="8" fill="#475569">R increases with V</text>
        </svg>
      </div>
    </div>
  </div>
);

/* ---- Three-Pin Plug Diagram ---- */
const PlugDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Three-Pin Plug Wiring</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 250 200" className="h-auto w-full max-w-xs">
        <rect x="50" y="30" width="150" height="120" fill="#e2e8f0" stroke="#475569" strokeWidth="2" rx="10" />
        <rect x="70" y="50" width="110" height="80" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" rx="4" />
        <rect x="80" y="60" width="90" height="60" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <text x="125" y="95" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">PLUG</text>
        <line x1="125" y1="60" x2="125" y2="120" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
        {/* Live pin */}
        <rect x="60" y="150" width="10" height="30" fill="#d1d5db" stroke="#475569" strokeWidth="1" />
        <text x="65" y="195" textAnchor="middle" fontSize="10" fill="#dc2626">Live (Brown)</text>
        <line x1="65" y1="150" x2="65" y2="80" stroke="#dc2626" strokeWidth="3" />
        <circle cx="65" cy="75" r="4" fill="#dc2626" />
        {/* Neutral pin */}
        <rect x="120" y="150" width="10" height="30" fill="#d1d5db" stroke="#475569" strokeWidth="1" />
        <text x="125" y="195" textAnchor="middle" fontSize="10" fill="#2563eb">Neutral (Blue)</text>
        <line x1="125" y1="150" x2="125" y2="80" stroke="#2563eb" strokeWidth="3" />
        <circle cx="125" cy="75" r="4" fill="#2563eb" />
        {/* Earth pin (longer) */}
        <rect x="180" y="140" width="10" height="40" fill="#d1d5db" stroke="#475569" strokeWidth="1" />
        <text x="185" y="195" textAnchor="middle" fontSize="10" fill="#16a34a">Earth (Green/Yellow)</text>
        <line x1="185" y1="140" x2="185" y2="80" stroke="#16a34a" strokeWidth="3" />
        <circle cx="185" cy="75" r="4" fill="#16a34a" />
        <text x="125" y="30" textAnchor="middle" fontSize="10" fill="#475569">Fuse on live wire</text>
        <rect x="55" y="70" width="10" height="6" fill="#dc2626" rx="2" />
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Live (brown) carries current; Neutral (blue) completes circuit; Earth (green/yellow) is a safety wire. Fuse is on the live wire.
    </p>
  </div>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'electrostatics',
    eyebrow: 'Chapter 11.1',
    title: 'Electrostatics',
    heading: 'Electrostatics — Charging, Forces, and Fields',
    intro:
      '**Electrostatics** deals with electric charges at rest. When two materials are rubbed together, electrons can be transferred, leaving one positively charged and the other negatively charged.',
    intro2:
      'Like charges repel; unlike charges attract. An electric field is a region around a charged object where another charge experiences a force.',
    introMore: [
      '**Charging by friction** transfers electrons between surfaces.',
      'There are two types of charge: positive and negative. Charge is measured in coulombs (C).',
      '**Conductors** (e.g. metals) allow charge to flow freely; **insulators** (e.g. plastic, rubber) do not.',
      '**Induction** is charging without contact: bringing a charged object near a conductor induces separation of charges.',
      '**Lightning** is a natural static discharge. Lightning conductors protect buildings by providing a safe path to Earth.',
    ],
    definition:
      '**Electrostatics** is the study of stationary electric charges.\n\n' +
      'An **electric field** is a region in which a charged particle experiences a force. Field lines point from positive to negative.',
    method: {
      title: 'Key Electrostatics Facts',
      kind: 'rules',
      rules: [
        { rule: 'Charging by friction transfers electrons.', example: 'Rubbing a polythene rod with fur makes it negative (gains electrons).' },
        { rule: 'Like charges repel, unlike charges attract.', example: 'Two positive charges repel each other.' },
        { rule: 'Field lines point away from positive charges and towards negative charges.', example: 'The direction of force on a positive test charge.' },
        { rule: 'Conductors allow charge to flow; insulators do not.', example: 'Metals are conductors; plastics are insulators.' },
        { rule: 'Induction charges without direct contact.', example: 'Bringing a charged rod near an electroscope causes deflection.' },
      ],
    },
    keyFormula: {
      label: 'Charge is measured in coulombs (C).',
      formula: 'C = A·s',
    },
    examples: [
      {
        question: 'Describe the process of charging by friction using a polythene rod and a cloth.',
        steps: [
          'When the polythene rod is rubbed with the cloth, electrons are transferred from the cloth to the rod.',
          'The rod gains electrons and becomes negatively charged.',
          'The cloth loses electrons and becomes positively charged.',
        ],
        answer: 'The rod becomes negative (gains electrons), the cloth becomes positive (loses electrons).',
      },
      {
        question: 'Explain how a lightning conductor protects a building.',
        steps: [
          'Lightning is a large static discharge between clouds and the ground.',
          'A lightning conductor is a metal rod fixed to the top of a building, connected to the ground by a thick wire.',
          'It provides a safe, low-resistance path for the lightning current to flow to Earth, preventing damage to the building.',
        ],
        answer: 'A lightning conductor provides a safe path for lightning to reach the ground, protecting the building.',
      },
    ],
    practice: [
      'Explain the difference between a conductor and an insulator, giving examples.',
      'Describe how a polythene rod can be charged by friction and identify the type of charge it gains.',
      'State the two types of electric charge and the rule for their interaction.',
      'What is an electric field? Draw the field lines for a positive point charge.',
      'Explain the phenomenon of lightning and the function of a lightning conductor.',
    ],
  },
  {
    id: 'cells-emf',
    eyebrow: 'Chapter 11.2',
    title: 'Primary and Secondary Cells (e.m.f.)',
    heading: 'Electromotive Force (e.m.f.)',
    intro:
      'A cell or battery is a source of electrical energy. The **electromotive force (e.m.f.)** of a source is the energy supplied to each unit of charge as it passes through the source.',
    intro2:
      'The unit of e.m.f. is the volt (V), where 1 volt = 1 joule per coulomb (J/C).',
    introMore: [
      '**e.m.f.** is measured in volts and represents the work done per unit charge by the source.',
      'Sources of e.m.f. include cells, batteries, accumulators, and photovoltaic (solar) cells.',
      'When a charge flows around a complete circuit, the source does work on the charges, raising their electrical potential energy.',
    ],
    definition:
      'The **electromotive force (e.m.f.)** of a source is the energy converted from other forms (chemical, light, etc.) into electrical energy per unit charge delivered around a complete circuit.\n\n' +
      'It is measured in volts (V), where 1 V = 1 J/C.',
    keyFormula: {
      label: 'e.m.f. = Energy / Charge',
      formula: 'ε = W / Q   (units: J/C = V)',
    },
    examples: [
      {
        question: 'A cell transfers 60 J of energy when 5 C of charge flows through it. Calculate the e.m.f. of the cell.',
        steps: ['W = 60 J', 'Q = 5 C', 'ε = W / Q = 60 / 5 = 12 V'],
        answer: 'e.m.f. = 12 V',
      },
    ],
    practice: [
      'Define electromotive force (e.m.f.) and state its unit.',
      'A battery does 200 J of work to move 40 C of charge. Calculate the e.m.f. of the battery.',
      'What is the difference between a primary cell and a secondary cell?',
      'Give three examples of sources of e.m.f.',
    ],
  },
  {
    id: 'current-electricity',
    eyebrow: 'Chapter 11.3',
    title: 'Current Electricity',
    heading: 'Current, Voltage, and Potential Difference',
    intro:
      '**Electric current** is the rate of flow of electric charge. It is measured in amperes (A) using an ammeter connected in series.',
    intro2:
      '**Potential difference (p.d.)** is the energy transferred per unit charge between two points in a circuit, measured in volts (V) using a voltmeter connected in parallel.',
    introMore: [
      'Conventional current flows from positive to negative; actual electron flow is opposite.',
      'Ammeters are connected in series to measure current; voltmeters are connected in parallel to measure p.d.',
    ],
    definition:
      '**Electric current** is the rate of flow of charge, given by I = Q/t. It is measured in amperes (A).\n\n' +
      '**Potential difference** between two points is the work done per unit charge to move charge between them.',
    method: {
      title: 'Current and Charge',
      kind: 'rules',
      rules: [
        { rule: 'I = Q / t', example: 'Current = charge / time.' },
        { rule: '1 A = 1 C / s', example: 'One ampere is one coulomb per second.' },
        { rule: 'Ammeter in series, voltmeter in parallel.', example: 'Correct connections for measuring current and p.d.' },
      ],
    },
    keyFormula: {
      label: 'Current equation:',
      formula: 'I = Q / t',
    },
    examples: [
      {
        question: 'A charge of 50 C passes through a circuit in 10 seconds. Calculate the current.',
        steps: ['Q = 50 C', 't = 10 s', 'I = Q / t = 50 / 10 = 5 A'],
        answer: 'I = 5 A',
      },
      {
        question: 'A current of 0.5 A flows for 20 seconds. How much charge flows?',
        steps: ['I = 0.5 A', 't = 20 s', 'Q = I × t = 0.5 × 20 = 10 C'],
        answer: 'Q = 10 C',
      },
    ],
    practice: [
      'Define electric current and state its unit.',
      'A current of 2 A flows for 30 seconds. Calculate the charge flowing.',
      'Explain the difference between conventional current and electron flow.',
      'How is an ammeter connected in a circuit? How is a voltmeter connected?',
    ],
  },
  {
    id: 'circuits',
    eyebrow: 'Chapter 11.4',
    title: 'Electric Circuits',
    heading: 'Series and Parallel Circuits, Ohm\'s Law',
    intro:
      'Circuits can be arranged in **series** or **parallel**. In a series circuit, the same current flows through all components, and the total voltage is the sum of the individual voltages.',
    intro2:
      'In a parallel circuit, the same voltage appears across each branch, and the total current is the sum of the currents in each branch.',
    introMore: [
      '**Ohm\'s Law:** For a conductor at constant temperature, the current is proportional to the voltage: V = IR, or R = V/I.',
      'Resistance depends on length (longer = more resistance), cross-sectional area (thicker = less resistance), and temperature.',
      'A **V–I graph** for an ohmic conductor is a straight line through the origin. A filament lamp (non-ohmic) shows a curve because its resistance increases with temperature.',
    ],
    definition:
      '**Ohm\'s Law** states that the current through a conductor between two points is directly proportional to the voltage across the two points, provided the temperature remains constant.\n\n' +
      'R = V/I, where R is the resistance in ohms (Ω).',
    method: {
      title: 'Circuit Rules',
      kind: 'rules',
      rules: [
        { rule: 'Series: I same, V adds up.', example: 'V_total = V₁ + V₂ + ...' },
        { rule: 'Series: R_total = R₁ + R₂ + ...', example: 'Total resistance is sum of individual resistances.' },
        { rule: 'Parallel: V same, I adds up.', example: 'I_total = I₁ + I₂ + ...' },
        { rule: 'Parallel: 1/R_total = 1/R₁ + 1/R₂ + ...', example: 'Reciprocal of total resistance is sum of reciprocals.' },
        { rule: 'Ohm\'s Law: R = V / I.', example: 'Calculate resistance if V and I are known.' },
      ],
    },
    keyFormula: {
      label: 'Circuit formulas:',
      formula: (
        <>
          Series: R<sub>T</sub> = R₁ + R₂ &nbsp;&nbsp;|&nbsp;&nbsp; Parallel: 1/R<sub>T</sub> = 1/R₁ + 1/R₂ &nbsp;&nbsp;|&nbsp;&nbsp; V = IR
        </>
      ),
    },
    examples: [
      {
        question: 'A 10 Ω resistor and a 20 Ω resistor are connected in series to a 12 V battery. Calculate the total resistance and the current.',
        steps: ['R_total = 10 + 20 = 30 Ω', 'V = 12 V', 'I = V / R = 12 / 30 = 0.4 A'],
        answer: 'R_total = 30 Ω, I = 0.4 A',
      },
      {
        question: 'A 10 Ω and a 20 Ω resistor are connected in parallel to a 12 V battery. Calculate the total resistance and the total current.',
        steps: ['1/R_total = 1/10 + 1/20 = 3/20', 'R_total = 20/3 ≈ 6.67 Ω', 'I = V / R = 12 / 6.67 ≈ 1.8 A'],
        answer: 'R_total ≈ 6.67 Ω, I ≈ 1.8 A',
      },
      {
        question: 'A resistor has a current of 2 A when connected to a 6 V supply. Calculate its resistance.',
        steps: ['V = 6 V', 'I = 2 A', 'R = V / I = 6 / 2 = 3 Ω'],
        answer: 'R = 3 Ω',
      },
    ],
    practice: [
      'State Ohm\'s Law and give its formula.',
      'Two resistors of 5 Ω and 15 Ω are connected in series. Calculate the total resistance.',
      'Two resistors of 6 Ω and 12 Ω are connected in parallel. Calculate the total resistance.',
      'A 10 Ω resistor is connected across a 20 V supply. What current flows?',
      'Sketch the V–I graphs for an ohmic conductor and a filament lamp, and explain the difference.',
    ],
  },
  {
    id: 'home-electricity',
    eyebrow: 'Chapter 11.5',
    title: 'Electricity in the Home',
    heading: 'Power, Energy, and Electrical Safety',
    intro:
      'Electricity is used in homes for lighting, heating, and running motors. Most appliances are connected in parallel so they each receive the same voltage and can be switched independently.',
    intro2:
      'The amount of electrical energy used is measured in **kilowatt-hours (kWh)** — this is the unit used on electricity bills.',
    introMore: [
      '**Power** is the rate of energy transfer: P = VI, measured in watts (W).',
      '**Energy** = Power × Time (E = VIt).',
      '**Cost** = Energy (in kWh) × cost per unit.',
      '**Electrical hazards:** damaged insulation, overheating cables, damp conditions.',
      'A **three-pin plug** has Live (brown), Neutral (blue), and Earth (green/yellow).',
      'A **fuse** is a thin wire that melts and breaks the circuit if current exceeds a safe value — always on the live wire.',
      'The **switch** must always be on the live wire for safety.',
    ],
    definition:
      '**Power** is the rate of doing work or transferring energy, measured in watts (W).\n\n' +
      '**Energy** in electrical terms is E = VIt, and the commercial unit is the kilowatt-hour (kWh).',
    method: {
      title: 'Power, Energy, and Cost Calculations',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'P = VI', text: 'Calculate power using voltage and current.' },
        { step: 2, formula: 'E = VIt', text: 'Energy in joules.' },
        { step: 3, formula: 'kWh = (P × t) / 1000', text: 'Convert watts × hours to kilowatt-hours.' },
        { step: 4, formula: 'Cost = kWh × unit cost', text: 'Calculate the cost of electricity.' },
      ],
    },
    keyFormula: {
      label: 'Power and energy:',
      formula: 'P = VI   &   Energy (kWh) = (P × t) / 1000',
    },
    examples: [
      {
        question: 'A 100 W light bulb is used for 5 hours. Calculate the energy used in kWh and the cost if 1 kWh costs $0.20.',
        steps: ['P = 100 W = 0.1 kW', 't = 5 h', 'Energy = 0.1 × 5 = 0.5 kWh', 'Cost = 0.5 × 0.20 = $0.10'],
        answer: 'Energy = 0.5 kWh, Cost = $0.10',
      },
      {
        question: 'A kettle has a power rating of 2000 W. It is used for 3 minutes. Calculate the energy used in joules.',
        steps: ['P = 2000 W', 't = 3 min = 180 s', 'E = P × t = 2000 × 180 = 360,000 J = 360 kJ'],
        answer: 'E = 360,000 J (360 kJ)',
      },
      {
        question: 'An appliance draws a current of 5 A from a 230 V supply. Calculate its power and the energy used in 2 hours in kWh.',
        steps: ['P = VI = 230 × 5 = 1150 W = 1.15 kW', 'Energy = 1.15 × 2 = 2.3 kWh'],
        answer: 'Power = 1150 W, Energy = 2.3 kWh',
      },
    ],
    practice: [
      'A 60 W lamp is used for 8 hours. Calculate the energy used in kWh.',
      'What is the function of the earth wire in a three-pin plug?',
      'Explain why a fuse is placed on the live wire and not the neutral wire.',
      'A television is rated at 150 W and is used for 6 hours a day. Calculate the energy used per day in kWh.',
      'Describe the colour coding of the three wires in a UK three-pin plug.',
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
    if (section.id === 'electrostatics') {
      return <ElectricFieldDiagram />;
    }
    if (section.id === 'circuits') {
      return (
        <>
          <CircuitDiagrams />
          <VIGraphDiagram />
        </>
      );
    }
    if (section.id === 'home-electricity') {
      return <PlugDiagram />;
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

export const Electricity: React.FC = () => {
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

      {/* Header — solid color */}
      <div className="relative overflow-hidden bg-[#0d2c45] border-b-4 border-[#0a1f33] pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40">
              TOPIC 11
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Electricity
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Electricity powers our world. In this chapter, you'll learn about electrostatics,
            electric circuits, Ohm's law, and electrical safety. You'll discover how charges interact,
            how to calculate current, voltage, resistance, and power, and how to stay safe with
            electricity in the home.
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

export default Electricity;