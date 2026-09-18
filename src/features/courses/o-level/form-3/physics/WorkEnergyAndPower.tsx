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
  figures?: DiagramConfig[];
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
    heading: 'Work Done',
    intro: '**Work is done when a force moves an object through a distance, in the direction of the force.** If you push a wall and it does not move, you have used force, but you have done no work — because nothing moved.',
    intro2: 'The formula for work done is: **W = F × d**, where W is work (in joules, J), F is force (in newtons, N), and d is the distance moved in the direction of the force (in metres, m).',
    introMore: [
      'Work is only counted when the object actually moves in the same direction as the force. If you carry a bag while walking on flat ground, gravity does no work on the bag, because the bag does not move up or down.',
      'The unit of work is the **joule (J)**. One joule is the work done when a force of 1 newton moves an object 1 metre.',
    ],
    definition: '**Work Done** is the product of force and the distance moved in the direction of that force.\n\nW = F × d',
    diagram: { type: 'image', src: '/images/physics/work-energy-power/work-power.webp', title: "Work Done by a Lifting Force", caption: "An upward force raises a load through a vertical distance. Work = force \u00d7 distance.", alt: "An electric crane lifting a crate, with an upward force arrow, lift distance bracket and stopwatch." },
    keyFormula: { label: 'Work Done:', formula: 'W = F × d' },
    examples: [
      { question: 'A force of 20 N pushes a box 5 m across a floor. Find the work done.', steps: ['F = 20 N', 'd = 5 m', 'W = F × d = 20 × 5 = 100 J'], answer: 'W = 100 J' },
      { question: 'A boy lifts a 40 N bag 2 m off the ground. Find the work done.', steps: ['F = 40 N', 'd = 2 m', 'W = 40 × 2 = 80 J'], answer: 'W = 80 J' },
    ],
    practice: [
      'What two things are needed for work to be done?',
      'A force of 15 N moves a trolley 6 m. Find the work done.',
      'Why is no work done when you push a wall that does not move?',
    ],
  },
  {
    id: 'energy-stores',
    eyebrow: 'Chapter 6.2',
    title: 'Energy Stores',
    heading: 'Forms & Stores of Energy',
    intro: '**Energy is the capacity to do work.** It is measured in joules (J), same as work. Energy can be stored in different ways, called energy stores.',
    intro2: '**Gravitational Potential Energy (GPE)** is energy stored in an object because of its height above the ground. GPE = m × g × h (mass × gravity × height).',
    introMore: [
      '**Kinetic Energy (KE)** is energy stored in a moving object. KE = ½ × m × v² (half × mass × speed squared).',
      '**Chemical energy** is stored in food, fuel and batteries, and is released in reactions.',
      '**Elastic potential energy** is stored in a stretched or squashed object, like a spring or rubber band.',
      '**Thermal (heat) energy** is stored in the movement of particles inside an object — the hotter it is, the more thermal energy it has.',
      '**Electrical energy** is energy carried by moving electric charge, such as current in a wire.',
    ],
    definition: '**GPE = mgh** (m = mass in kg, g = gravity ≈ 10 m/s², h = height in m)\n\n**KE = ½mv²** (m = mass in kg, v = speed in m/s)',
    diagram: { type: 'image', src: '/images/physics/work-energy-power/falling-ball.webp', title: "Gravitational Potential and Kinetic Energy", caption: "As the ball falls, its height and GPE decrease while its speed and KE increase.", alt: "Three stages of a ball falling from rest towards the ground." },

    figures: [
      { type: 'image', src: '/images/physics/work-energy-power/pendulum-swing.webp', title: "Energy in a Swinging Pendulum", caption: "At either extreme the bob is highest and momentarily at rest. At the bottom it moves fastest.", alt: "A pendulum at its left extreme, lowest point and right extreme." },
      { type: 'image', src: '/images/physics/work-energy-power/compressed-spring.webp', title: "Elastic Potential Energy", caption: "Compressing a spring stores elastic potential energy. The spring can transfer this energy as it returns to its natural length.", alt: "A spring compressed by a wooden block beside the same spring at its relaxed length." },
    ],
    keyFormula: { label: 'Energy stores:', formula: 'GPE = mgh   |   KE = ½mv²' },
    examples: [
      { question: 'Find the GPE of a 2 kg ball held 5 m above the ground. (g = 10 m/s²)', steps: ['m = 2 kg', 'h = 5 m', 'GPE = mgh = 2 × 10 × 5 = 100 J'], answer: 'GPE = 100 J' },
      { question: 'Find the KE of a 3 kg object moving at 4 m/s.', steps: ['m = 3 kg', 'v = 4 m/s', 'KE = ½mv² = ½ × 3 × 16 = 24 J'], answer: 'KE = 24 J' },
    ],
    practice: [
      'Define energy and state its unit.',
      'A 1.5 kg object is 4 m above the ground. Find its GPE.',
      'A 2 kg trolley moves at 3 m/s. Find its KE.',
      'Name four stores of energy and give an example of each.',
    ],
  },
  {
    id: 'conservation',
    eyebrow: 'Chapter 6.3',
    title: 'Conservation of Energy',
    heading: 'The Principle of Conservation of Energy',
    intro: '**The Law of Conservation of Energy** says energy cannot be created or destroyed — it can only be transformed from one store to another.',
    intro2: 'On a roller coaster or a swinging pendulum, as height (and GPE) decreases, speed (and KE) increases. If we ignore friction, the GPE lost equals the KE gained.',
    introMore: [
      'At the very top of a swing, all the energy is GPE and speed is zero. At the bottom, all that energy has become KE, and the object moves fastest.',
      'In real life, some energy is always lost as heat because of friction and air resistance, so the total useful energy is slightly less each time.',
    ],
    definition: '**Conservation of Energy:** Total energy before = Total energy after.\n\nLoss in GPE = Gain in KE (no friction)',
    diagram: { type: 'image', src: '/images/physics/work-energy-power/fuel-engine-motion.webp', title: "Fuel, Engine and Motion", caption: "Chemical energy in fuel is transferred by the engine into kinetic energy of the car, with some energy transferred to the surroundings.", alt: "Fuel, a piston engine and a moving car connected by energy transfer arrows." },

    figures: [
      { type: 'image', src: '/images/physics/work-energy-power/pendulum-energy.webp', title: "Conservation of Energy in a Pendulum", caption: "Blue bars show GPE; teal bars show KE. At the extreme: 100% GPE and 0% KE. Halfway down in height: 50% each. At the bottom: 0% GPE and 100% KE. Total energy remains constant when resistance is neglected.", alt: "Three pendulum positions with bars showing gravitational potential energy decreasing as kinetic energy increases." },
      { type: 'image', src: '/images/physics/work-energy-power/friction-losses.webp', title: "Energy Transfers Due to Friction", caption: "Friction transfers energy to thermal stores of the block and surface; some energy is also transferred as sound. Energy is conserved even when useful mechanical energy decreases.", alt: "A wooden block pulled across a rough surface, with warmth and vibration marks at the contact." },
    ],
    keyFormula: { label: 'Conservation of Energy:', formula: 'GPE lost = KE gained' },
    examples: [
      { question: 'A 2 kg ball falls from 10 m. Find its speed just before hitting the ground (g = 10 m/s², ignore friction).', steps: ['GPE at top = mgh = 2 × 10 × 10 = 200 J', 'GPE lost = KE gained, so KE = 200 J', '½mv² = 200 → v² = 200 / (½ × 2) = 200', 'v = √200 ≈ 14.1 m/s'], answer: 'v ≈ 14.1 m/s' },
    ],
    practice: [
      'State the Law of Conservation of Energy in your own words.',
      'A 4 kg object falls from 5 m. Find its KE just before landing (g = 10 m/s²).',
      'Why does a pendulum eventually stop swinging in real life?',
    ],
  },
  {
    id: 'power-efficiency',
    eyebrow: 'Chapter 6.4',
    title: 'Power & Efficiency',
    heading: 'Power and Efficiency',
    intro: '**Power** is the rate of doing work, or the rate of transferring energy. P = W / t (work done ÷ time taken).',
    intro2: 'The unit of power is the **watt (W)**. 1 watt = 1 joule per second (1 W = 1 J/s).',
    introMore: [
      '**Efficiency** tells us how much of the energy put into a machine is turned into useful output, instead of being wasted (usually as heat).',
      'Efficiency (%) = (Useful energy output ÷ Total energy input) × 100%',
      'A **Sankey diagram** is a picture that shows energy flowing through a device: a wide arrow splits into a useful output arrow and a wasted-heat arrow, with widths showing how much energy goes each way.',
    ],
    definition: '**Power: P = W / t** (measured in watts, W)\n\n**Efficiency = (Useful output ÷ Total input) × 100%**',
    diagram: { type: 'image', src: '/images/physics/work-energy-power/sankey-efficiency.webp', title: "Sankey Diagram: Useful and Wasted Energy", caption: "500 J input = 350 J useful output + 150 J heat. Efficiency = (350 \u00f7 500) \u00d7 100% = 70%. The arrow widths represent the amount of energy transferred.", alt: "A proportional Sankey diagram showing 500 J input splitting into 350 J useful energy and 150 J wasted heat." },
    figures: [
      { type: 'image', src: '/images/physics/work-energy-power/work-power.webp', title: "Calculating Power", caption: "Use the lifting force and vertical distance to calculate work done, then divide by the time measured on the stopwatch: P = W \u00f7 t.", alt: "A crane lifting a crate with a force arrow, distance marker and stopwatch." },
    ],
    keyFormula: { label: 'Power & Efficiency:', formula: 'P = W / t   |   Efficiency = (Useful ÷ Input) × 100%' },
    examples: [
      { question: 'A motor does 600 J of work in 3 s. Find its power.', steps: ['W = 600 J', 't = 3 s', 'P = W / t = 600 / 3 = 200 W'], answer: 'P = 200 W' },
      { question: 'A machine takes in 500 J and produces 350 J of useful energy. Find its efficiency.', steps: ['Useful output = 350 J', 'Total input = 500 J', 'Efficiency = (350 / 500) × 100 = 70%'], answer: 'Efficiency = 70%' },
    ],
    practice: [
      'Define power and state its unit.',
      'A crane does 900 J of work in 6 s. Find its power.',
      'A bulb takes in 100 J and gives out 20 J of light. Find its efficiency.',
      'What does a Sankey diagram show?',
    ],
  },
  {
    id: 'resources',
    eyebrow: 'Chapter 6.5',
    title: 'Energy Resources',
    heading: 'Energy Resources & Worked Examples',
    intro: '**Renewable energy resources** (solar, wind, hydro) can be replaced naturally and will not run out. **Non-renewable resources** (fossil fuels, nuclear) are limited and will eventually run out.',
    intro2: 'Renewable sources are cleaner but often depend on weather. Non-renewable sources give a lot of reliable power but cause pollution and cannot be replaced.',
    method: {
      title: 'Renewable vs Non-Renewable (Summary Table)',
      kind: 'rules',
      rules: [
        { rule: 'Solar (renewable)', example: 'Sunlight is converted directly into electricity using solar panels. Free and clean, but weather-dependent.' },
        { rule: 'Wind (renewable)', example: 'Wind turns turbines to generate electricity. Clean, but needs windy locations.' },
        { rule: 'Hydro (renewable)', example: 'Falling water turns turbines. Reliable, but needs a dam and affects the environment.' },
        { rule: 'Fossil fuels (non-renewable)', example: 'Coal, oil, and gas are burned to generate power. Reliable but causes pollution and will run out.' },
        { rule: 'Nuclear (non-renewable)', example: 'Splitting atoms releases huge energy. Very powerful, but produces radioactive waste.' },
      ],
    },
    diagram: { type: 'image', src: '/images/physics/work-energy-power/hydroelectric-plant.webp', title: "Inside a Hydroelectric Power Plant", caption: "Water flows from the reservoir through the penstock to the turbine. The turbine drives the generator, producing electricity; water leaves through the tailrace into the river.", alt: "A hydroelectric dam cutaway showing a reservoir, downhill penstock, turbine, generator and lower river." },

    figures: [
      { type: 'image', src: '/images/physics/work-energy-power/solar-electricity.webp', title: "Sunlight to Electricity", caption: "Solar panels transfer energy from sunlight into electrical energy, which powers the lamp. The lamp transfers energy as light and heat.", alt: "Sunlight reaching a solar panel connected by two wires to a glowing LED lamp." },
    ],
    keyFormula: { label: 'Worked examples combine:', formula: 'GPE ↔ KE   and   P = W / t' },
    examples: [
      { question: 'A 5 kg rock falls from a 20 m cliff. Find its speed just before hitting the ground (g = 10 m/s², ignore friction).', steps: ['GPE = mgh = 5 × 10 × 20 = 1000 J', 'GPE lost = KE gained → KE = 1000 J', '½mv² = 1000 → v² = 1000 / 2.5 = 400', 'v = √400 = 20 m/s'], answer: 'v = 20 m/s' },
      { question: 'A pump lifts 200 kg of water 10 m in 5 s using an electric motor that takes in 25000 J of electrical energy. Find the power output and the efficiency (g = 10 m/s²).', steps: ['Weight = mg = 200 × 10 = 2000 N', 'Work = F × d = 2000 × 10 = 20000 J', 'Power = W / t = 20000 / 5 = 4000 W', 'Efficiency = (Useful output / Total input) × 100 = (20000 / 25000) × 100 = 80%'], answer: 'P = 4000 W, Efficiency = 80%' },
    ],
    practice: [
      'List three renewable and three non-renewable energy resources.',
      'Give one advantage and one disadvantage of solar energy.',
      'A 10 kg object falls from 8 m. Find its speed on landing (g = 10 m/s²).',
      'A machine does 1200 J of work in 4 s. Find its power.',
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
  if (!diagram || diagram.type !== 'image' || !diagram.src) return null;
  const image = (
    <img
      src={diagram.src}
      alt={diagram.alt || ''}
      loading="lazy"
      decoding="async"
      width={1200}
      height={800}
      className="block h-auto w-full max-w-full rounded-lg object-contain"
      style={{ maxHeight: 'min(360px, 45vh)' }}
    />
  );
  if (diagram.bare) return image;
  return (
    <figure className="w-full min-w-0 max-w-2xl rounded-xl border border-slate-200 bg-white p-4">
      {diagram.title && <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-700">{diagram.title}</h4>}
      {image}
      {diagram.caption && <figcaption className="mt-3 text-sm leading-relaxed text-slate-600">{diagram.caption}</figcaption>}
    </figure>
  );
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

        {(section.diagram || section.figures?.length) && (
          <div className="mb-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
            {[section.diagram, ...(section.figures || [])].map(figure => figure && (
              <React.Fragment key={figure.src}>{renderDiagram(figure)}</React.Fragment>
            ))}
          </div>
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
