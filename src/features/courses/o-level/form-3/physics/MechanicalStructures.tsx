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
  type: 'image' | 'beam' | 'truss' | 'joint' | 'bridge';
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

/* ---- Beam Cross-Section Diagram Component ---- */

const BeamCrossSectionDiagram: React.FC = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Beam Cross-Section Shapes</h4>
      <div className="grid grid-cols-4 gap-4 rounded-lg border border-emerald-100 bg-white p-6">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-blue-600 bg-blue-100/60" />
          <span className="mt-2 text-xs font-bold text-slate-700">O (Cylindrical)</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-16 w-12 rounded-lg border-4 border-blue-600 bg-blue-100/60" />
          <span className="mt-2 text-xs font-bold text-slate-700">Solid Box</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-12">
            <div className="absolute left-0 top-0 h-16 w-4 rounded-l-lg border-4 border-blue-600 bg-blue-100/60" />
            <div className="absolute right-0 top-0 h-16 w-4 rounded-r-lg border-4 border-blue-600 bg-blue-100/60" />
            <div className="absolute left-1/2 top-0 h-16 w-4 -translate-x-1/2 rounded-lg border-4 border-blue-600 bg-blue-100/60" />
          </div>
          <span className="mt-2 text-xs font-bold text-slate-700">H</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative h-16 w-12">
            <div className="absolute left-0 top-0 h-16 w-4 rounded-l-lg border-4 border-blue-600 bg-blue-100/60" />
            <div className="absolute right-0 top-0 h-16 w-4 rounded-r-lg border-4 border-blue-600 bg-blue-100/60" />
            <div className="absolute left-1/2 top-1/2 h-4 w-8 -translate-x-1/2 -translate-y-1/2 rounded-lg border-4 border-blue-600 bg-blue-100/60" />
          </div>
          <span className="mt-2 text-xs font-bold text-slate-700">I</span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        Different cross-sections give different strength-to-weight ratios. Deeper beams resist bending better.
      </p>
    </div>
  );
};

/* ---- Bridge Types Diagram ---- */

const BridgeTypesDiagram: React.FC = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Types of Bridges</h4>
      <div className="grid grid-cols-1 gap-6 rounded-lg border border-emerald-100 bg-white p-6 sm:grid-cols-2">
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-4">
          <div className="h-24 w-full max-w-[180px]">
            <svg viewBox="0 0 180 96" className="h-full w-full">
              <rect x="10" y="60" width="20" height="30" fill="#94a3b8" />
              <rect x="150" y="60" width="20" height="30" fill="#94a3b8" />
              <rect x="20" y="50" width="140" height="12" fill="#475569" rx="2" />
              <rect x="60" y="62" width="20" height="28" fill="#94a3b8" />
              <rect x="100" y="62" width="20" height="28" fill="#94a3b8" />
              <text x="90" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">Beam Bridge</text>
            </svg>
          </div>
          <p className="text-center text-xs text-slate-600">Simple span with supports at ends</p>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-4">
          <div className="h-24 w-full max-w-[180px]">
            <svg viewBox="0 0 180 96" className="h-full w-full">
              <rect x="10" y="60" width="16" height="30" fill="#94a3b8" />
              <rect x="154" y="60" width="16" height="30" fill="#94a3b8" />
              <path d="M18 50 Q90 10 162 50" fill="none" stroke="#475569" strokeWidth="8" />
              <path d="M18 50 Q90 20 162 50" fill="none" stroke="#475569" strokeWidth="4" />
              <text x="90" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">Arch Bridge</text>
            </svg>
          </div>
          <p className="text-center text-xs text-slate-600">Load carried by curved arch in compression</p>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-4">
          <div className="h-24 w-full max-w-[180px]">
            <svg viewBox="0 0 180 96" className="h-full w-full">
              <rect x="10" y="70" width="12" height="20" fill="#94a3b8" />
              <rect x="158" y="70" width="12" height="20" fill="#94a3b8" />
              <circle cx="40" cy="22" r="4" fill="#475569" />
              <circle cx="140" cy="22" r="4" fill="#475569" />
              <line x1="40" y1="22" x2="140" y2="22" stroke="#475569" strokeWidth="3" />
              <line x1="40" y1="22" x2="90" y2="70" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
              <line x1="140" y1="22" x2="90" y2="70" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
              <line x1="40" y1="22" x2="16" y2="70" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
              <line x1="140" y1="22" x2="164" y2="70" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
              <rect x="35" y="40" width="8" height="6" fill="#94a3b8" />
              <rect x="45" y="48" width="8" height="6" fill="#94a3b8" />
              <text x="90" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">Suspension Bridge</text>
            </svg>
          </div>
          <p className="text-center text-xs text-slate-600">Cables and towers support the deck</p>
        </div>
        <div className="flex flex-col items-center rounded-lg border-2 border-slate-200 p-4">
          <div className="h-24 w-full max-w-[180px]">
            <svg viewBox="0 0 180 96" className="h-full w-full">
              <rect x="10" y="60" width="16" height="30" fill="#94a3b8" />
              <rect x="154" y="60" width="16" height="30" fill="#94a3b8" />
              <rect x="20" y="50" width="140" height="10" fill="#475569" rx="2" />
              <rect x="20" y="60" width="140" height="4" fill="#64748b" />
              <circle cx="40" cy="55" r="2" fill="#475569" />
              <circle cx="90" cy="55" r="2" fill="#475569" />
              <circle cx="140" cy="55" r="2" fill="#475569" />
              <text x="90" y="94" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">Pier Bridge</text>
            </svg>
          </div>
          <p className="text-center text-xs text-slate-600">Supported by piers along the span</p>
        </div>
      </div>
    </div>
  );
};

/* ---- Truss Diagram ---- */

const TrussDiagram: React.FC = () => {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Truss Structure — Triangles in Action</h4>
      <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-6">
        <svg viewBox="0 0 400 200" className="h-auto w-full max-w-md">
          {/* Roof truss shape */}
          <polygon points="200,30 30,150 370,150" fill="none" stroke="#475569" strokeWidth="3" />
          {/* Bottom chord */}
          <line x1="30" y1="150" x2="370" y2="150" stroke="#475569" strokeWidth="3" />
          {/* Internal triangles */}
          <line x1="200" y1="30" x2="115" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          <line x1="200" y1="30" x2="285" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          <line x1="115" y1="150" x2="285" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          <line x1="200" y1="30" x2="30" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          <line x1="200" y1="30" x2="370" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          <line x1="30" y1="150" x2="200" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          <line x1="200" y1="150" x2="370" y2="150" stroke="#475569" strokeWidth="2" strokeDasharray="6" />
          {/* Labels */}
          <text x="200" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">Load</text>
          <text x="30" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#2563eb">Strut (Compression)</text>
          <text x="370" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#16a34a">Tie (Tension)</text>
          <text x="200" y="185" textAnchor="middle" fontSize="11" fill="#64748b">Triangles provide rigidity — they cannot change shape without changing side length</text>
          {/* Legend */}
          <rect x="30" y="190" width="12" height="4" fill="#dc2626" />
          <text x="48" y="194" fontSize="10" fill="#64748b">Compression</text>
          <rect x="140" y="190" width="12" height="4" fill="#2563eb" />
          <text x="158" y="194" fontSize="10" fill="#64748b">Tension</text>
          <rect x="250" y="190" width="12" height="4" fill="#475569" />
          <text x="268" y="194" fontSize="10" fill="#64748b">Member</text>
        </svg>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        Trusses use triangles to distribute loads efficiently. Members in compression are struts; members in tension are ties.
      </p>
    </div>
  );
};

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'beams',
    eyebrow: 'Chapter 5.1',
    title: 'Beams',
    heading: 'Beams — Supporting Loads Across a Span',
    intro:
      'A **beam** is a structural member that supports a load across a span. Beams are found everywhere: in buildings, bridges, furniture, and machinery.',
    intro2:
      'The **strength** of a beam depends on its cross-sectional shape, its depth, and the material it is made from. A deeper beam resists bending better than a shallower one of the same material.',
    introMore: [
      '**Cross-section shapes:** T, L, I, Z, O, H, solid box, hollow box, and cylindrical.',
      '**Compression** = a squeezing force that pushes material together.',
      '**Tension** = a stretching force that pulls material apart.',
      '**Shear** = forces that cause layers of material to slide past each other.',
      '**Buckling** = sudden failure under compression (the beam bends sideways and collapses).',
      'In a loaded beam, stress is not spread evenly — there are zones of tension and compression.',
    ],
    definition:
      'A **beam** is a structural member that spans between supports and carries loads.\n\n' +
      'The **strength** of a beam is determined by its cross-sectional shape, its depth (height), and the material properties. Deeper beams have greater resistance to bending.',
    method: {
      title: 'Comparing Beam Strength',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Identify cross-section', text: 'Different shapes (I, H, T, O, etc.) distribute stress differently.' },
        { step: 2, formula: 'Consider depth', text: 'A deeper beam is stronger than a shallower one of the same shape and material.' },
        { step: 3, formula: 'Compare materials', text: 'Steel, wood, and concrete have different strengths and stiffnesses.' },
        { step: 4, formula: 'Test bending', text: 'In a practical test, apply a load and measure the deflection (bending).' },
      ],
    },
    method2: {
      title: 'Key Forces Acting on Beams',
      kind: 'rules',
      rules: [
        { rule: 'Compression — squeezing force', example: 'The top of a loaded beam is in compression.' },
        { rule: 'Tension — stretching force', example: 'The bottom of a loaded beam is in tension.' },
        { rule: 'Shear — sliding layers', example: 'Forces that cause one part of the beam to slide past another.' },
        { rule: 'Buckling — sudden collapse', example: 'A long, thin beam under compression may buckle sideways.' },
      ],
    },
    keyFormula: {
      label: 'Key principle:',
      formula: 'Stress = Force / Area   (but stress distribution in a beam is not uniform)',
    },
    examples: [
      {
        question: 'Explain why an I-beam is stronger than a solid rectangular beam of the same mass.',
        steps: [
          'An I-beam has material concentrated at the top and bottom flanges, where stress is highest.',
          'This gives a high second moment of area (resistance to bending) without adding extra mass.',
          'The web connects the flanges and resists shear forces.',
        ],
        answer: 'An I-beam has a better strength-to-weight ratio because material is placed where it is most effective.',
      },
      {
        question: 'A wooden beam is 10 cm deep. Another beam of the same material is 15 cm deep. Which is stronger?',
        steps: [
          'The deeper beam (15 cm) is stronger because bending resistance increases with the square of the depth.',
          'More depth means more material is further from the neutral axis, where it resists bending more effectively.',
        ],
        answer: 'The 15 cm deep beam is stronger.',
      },
      {
        question: 'What happens to the top and bottom of a beam when a load is applied?',
        steps: [
          'The top of the beam is compressed (squeezed) by the load.',
          'The bottom of the beam is stretched (under tension).',
          'The neutral axis in the middle experiences neither compression nor tension.',
        ],
        answer: 'Top = compression, bottom = tension, neutral axis = no stress.',
      },
    ],
    practice: [
      'Define a beam and give two examples of where beams are used.',
      'Name four different beam cross-section shapes.',
      'Explain why a deeper beam is stronger than a shallower beam.',
      'What is the difference between compression and tension in a beam?',
      'Describe an experiment to compare the strength of different beam shapes.',
    ],
  },
  {
    id: 'trusses',
    eyebrow: 'Chapter 5.2',
    title: 'Trusses',
    heading: 'Trusses — The Power of Triangles',
    intro:
      'A **truss** is a rigid framework made of straight members connected at joints. Trusses are built from triangles because triangles are the most rigid shape.',
    intro2:
      'Trusses are used in roofs, bridges, towers, and many other structures. They provide a high strength-to-mass ratio — they are strong and light.',
    introMore: [
      '**Triangles** are rigid — they cannot change shape without changing the length of one of their sides.',
      'A **strut** is a member in compression (pushed together).',
      'A **tie** is a member in tension (pulled apart).',
      'Trusses distribute loads through the entire structure, not just through one member.',
      'The advantage of a truss over a solid beam is that it uses less material for the same strength.',
    ],
    definition:
      'A **truss** is a structural framework made of members joined at their ends, forming triangles.\n\n' +
      'Trusses are efficient because they use triangular shapes to distribute loads and resist deformation. Members in compression are called **struts**; members in tension are called **ties**.',
    method: {
      title: 'Identifying Struts and Ties in a Truss',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Apply a load', text: 'Consider where the load is applied to the truss.' },
        { step: 2, formula: 'Follow the load path', text: 'Trace how the load travels through the members to the supports.' },
        { step: 3, formula: 'Identify compression', text: 'Members that are being squeezed are struts (compression).' },
        { step: 4, formula: 'Identify tension', text: 'Members that are being stretched are ties (tension).' },
      ],
    },
    method2: {
      title: 'Advantages of Trusses Over Beams',
      kind: 'rules',
      rules: [
        { rule: 'Better strength-to-mass ratio', example: 'Trusses can span long distances with less material than solid beams.' },
        { rule: 'Efficient load distribution', example: 'Loads are spread through the whole framework, not just one member.' },
        { rule: 'Triangles are rigid', example: 'A triangle cannot change shape without changing side length, making trusses stable.' },
        { rule: 'Can be made from many materials', example: 'Wood, steel, and aluminium are all used for truss construction.' },
      ],
    },
    keyFormula: {
      label: 'Truss design principle:',
      formula: 'A triangle is the most rigid shape — it cannot be deformed without changing the length of a side.',
    },
    examples: [
      {
        question: 'Explain why triangles are used in truss construction.',
        steps: [
          'A triangle is rigid — it cannot change its shape without changing the length of one of its sides.',
          'This means that a triangular frame stays in shape under load, making it a stable structural element.',
          'Rectangles, by contrast, can easily deform into parallelograms.',
        ],
        answer: 'Triangles are used because they are inherently rigid and maintain their shape under load.',
      },
      {
        question: 'In a roof truss, the top chord is in compression and the bottom chord is in tension. What does this mean?',
        steps: [
          'The top chord is being pushed together (compressed) by the weight of the roof and any loads on it.',
          'The bottom chord is being pulled apart (stretched) as it resists the outward thrust from the top chord.',
          'The diagonals may be in either tension or compression depending on their orientation.',
        ],
        answer: 'Top chord = compression (strut), bottom chord = tension (tie).',
      },
      {
        question: 'What is the advantage of a truss over a solid beam for a bridge?',
        steps: [
          'A truss uses less material than a solid beam for the same span and load capacity.',
          'This makes the structure lighter and more economical.',
          'The open framework also reduces wind resistance and allows for easier inspection.',
        ],
        answer: 'Trusses provide a better strength-to-mass ratio, using less material to achieve the same strength.',
      },
    ],
    practice: [
      'Define a truss and explain why triangles are used in truss construction.',
      'What is the difference between a strut and a tie? Give an example of each in a roof truss.',
      'Explain the advantages of using a truss instead of a solid beam for a long span.',
      'Draw a simple roof truss and label the struts and ties.',
      'Why is a triangle considered the most rigid shape?',
    ],
  },
  {
    id: 'joints',
    eyebrow: 'Chapter 5.3',
    title: 'Joining Materials',
    heading: 'Joining Materials — Connecting Parts Together',
    intro:
      'A structure is only as strong as its joints. The way materials are joined together affects the overall strength, durability, and performance of a structure.',
    intro2:
      'There are many methods for joining materials, ranging from mechanical fastening to bonding. The choice of joint depends on the materials being joined and the forces they must withstand.',
    introMore: [
      '**Pinning:** using nails, screws, bolts, or rivets to hold parts together.',
      '**Surface contact:** gluing with adhesives, with or without dowels or tongue-and-groove joints.',
      '**Soldering, brazing, and welding:** using heat to join metals with or without filler material.',
      '**Plastic welding/gluing:** bonding plastic components with heat or adhesives.',
      'The strength of a joint depends on the size of the contact area and the number and position of pins or fasteners.',
    ],
    definition:
      'A **joint** is the connection between two or more structural members.\n\n' +
      'The **strength** of a joint depends on the method of joining, the contact area, the number of fasteners, and the materials being joined.',
    method: {
      title: 'Common Joining Methods',
      kind: 'rules',
      rules: [
        { rule: 'Pinning (nails, screws, bolts, rivets)', example: 'Used in woodworking, metal frames, and machinery.' },
        { rule: 'Gluing with adhesives', example: 'Wood glue, epoxy, superglue — strong bonding for many materials.' },
        { rule: 'Dowel joints', example: 'Wooden dowels reinforce glued joints.' },
        { rule: 'Tongue and groove', example: 'A strong joint used in flooring and cabinetry.' },
        { rule: 'Soldering and brazing', example: 'Joining metals with a filler metal (lower melting point).' },
        { rule: 'Welding', example: 'Melting the base metals together for a very strong joint.' },
        { rule: 'Plastic welding/gluing', example: 'Using heat or solvents to bond plastics.' },
      ],
    },
    method2: {
      title: 'Factors Affecting Joint Strength',
      kind: 'rules',
      rules: [
        { rule: 'Contact area', example: 'A larger contact area distributes the load and gives a stronger joint.' },
        { rule: 'Number of fasteners', example: 'More pins or screws usually means a stronger joint (up to a point).' },
        { rule: 'Position of fasteners', example: 'Fasteners placed near the edges or in a staggered pattern give better strength.' },
        { rule: 'Type of adhesive or fastener', example: 'Different adhesives and fasteners have different strengths.' },
      ],
    },
    keyFormula: {
      label: 'Joint strength depends on:',
      formula: 'Contact area + Number of fasteners + Type of joint',
    },
    examples: [
      {
        question: 'Why is a glued joint with a large contact area stronger than a joint with a small contact area?',
        steps: [
          'A larger contact area allows the adhesive to spread the load over a greater surface.',
          'This reduces the stress per unit area on the glue line.',
          'The joint is less likely to fail under load.',
        ],
        answer: 'Larger contact area distributes load better and reduces stress on the adhesive.',
      },
      {
        question: 'Compare pinning and welding as methods for joining steel beams.',
        steps: [
          'Pinning uses bolts or rivets — it is quick and allows for disassembly, but may have stress concentrations at the holes.',
          'Welding fuses the metal — it creates a continuous, very strong joint but requires skill and cannot be easily undone.',
          'Welded joints are generally stronger for permanent structures.',
        ],
        answer: 'Welding creates a stronger, continuous joint; pinning allows for disassembly but may have stress concentrations.',
      },
      {
        question: 'Why are dowels sometimes used with glued joints in woodwork?',
        steps: [
          'Dowels add mechanical strength to the joint — they resist shear forces.',
          'They also help align the pieces correctly during assembly.',
          'The combination of glue (bonding) and dowels (mechanical strength) gives a very strong joint.',
        ],
        answer: 'Dowels add mechanical strength and alignment to glued joints.',
      },
    ],
    practice: [
      'List four different methods of joining materials.',
      'Explain why a larger contact area makes a joint stronger.',
      'Compare soldering and welding as joining methods for metals.',
      'What factors affect the strength of a joint?',
      'Why might a tongue-and-groove joint be used in flooring?',
    ],
  },
  {
    id: 'large-structures',
    eyebrow: 'Chapter 5.4',
    title: 'Large Structures',
    heading: 'Large Structures — Materials and Design',
    intro:
      'Large structures like bridges, dams, and buildings must be designed to withstand enormous forces while using materials efficiently.',
    intro2:
      'The choice of materials and the design of the structure are critical to its strength, durability, and cost.',
    introMore: [
      '**Materials used:** wood, metal (steel, aluminium), reinforced concrete, stone — each has different compressive and tensile strength, mass, and durability.',
      '**Types of bridges:** pier bridge, beam bridge, arch bridge, suspension bridge.',
      '**Dam walls:** made of earth and concrete; can be straight or arch-shaped.',
      'Design choices balance strength, durability, and cost.',
    ],
    definition:
      'A **large structure** is a construction that spans a significant distance or supports large loads, such as bridges, dams, and multi-storey buildings.\n\n' +
      'The choice of materials and design shape determines the structure\'s strength, weight, and cost.',
    method: {
      title: 'Comparing Structural Materials',
      kind: 'rules',
      rules: [
        { rule: 'Wood — good compressive and tensile strength, lightweight, renewable.', example: 'Used in houses and small bridges.' },
        { rule: 'Steel — excellent tensile and compressive strength, heavy, durable.', example: 'Used in skyscrapers, bridges, and machinery.' },
        { rule: 'Reinforced concrete — good compressive strength, reinforced with steel for tensile strength.', example: 'Used in buildings, dams, and bridges.' },
        { rule: 'Stone — very strong in compression, weak in tension.', example: 'Used in old buildings, arch bridges.' },
      ],
    },
    method2: {
      title: 'Types of Bridges and Dams',
      kind: 'rules',
      rules: [
        { rule: 'Beam bridge — simple span supported at ends.', example: 'Short spans, simple construction.' },
        { rule: 'Arch bridge — curved arch in compression.', example: 'Strong, can span medium distances.' },
        { rule: 'Suspension bridge — cables and towers support the deck.', example: 'Can span very long distances (e.g., Golden Gate Bridge).' },
        { rule: 'Pier bridge — supported by piers along the span.', example: 'Good for long spans with intermediate supports.' },
        { rule: 'Dam walls — straight or arch-shaped, made of earth or concrete.', example: 'Hold back water in reservoirs.' },
      ],
    },
    keyFormula: {
      label: 'Key design principle:',
      formula: 'Choose materials that are strong where they are needed most (compression vs tension).',
    },
    examples: [
      {
        question: 'Why is reinforced concrete used instead of plain concrete in large structures?',
        steps: [
          'Concrete is very strong in compression but weak in tension.',
          'Steel reinforcement (rebar) provides tensile strength.',
          'The combination of concrete (compression) and steel (tension) creates a strong, durable material for structures.',
        ],
        answer: 'Reinforced concrete combines the compressive strength of concrete with the tensile strength of steel.',
      },
      {
        question: 'What type of bridge is best for a very long span? Explain why.',
        steps: [
          'A suspension bridge is best for very long spans.',
          'The main cables can support the deck over long distances with minimal intermediate supports.',
          'The towers and anchorages handle the tension forces.',
        ],
        answer: 'Suspension bridges can span the longest distances because the cables distribute the load efficiently.',
      },
      {
        question: 'Why are arch dams curved? What advantage does this give?',
        steps: [
          'An arch dam is curved towards the water, transferring the water pressure into the rock abutments on either side.',
          'This uses the compressive strength of concrete very efficiently.',
          'The curve also reduces the amount of material needed compared to a straight dam.',
        ],
        answer: 'Arch dams use the compressive strength of concrete and transfer water pressure to the abutments, using less material.',
      },
    ],
    practice: [
      'Name four materials used in large structures and describe one property of each.',
      'List the four main types of bridges and give an example of where each might be used.',
      'Explain why reinforced concrete is used in large structures instead of plain concrete.',
      'What is the advantage of an arch dam over a straight dam?',
      'Describe the design of a suspension bridge and explain how it supports its own weight and the load.',
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
    if (section.id === 'beams') {
      return <BeamCrossSectionDiagram />;
    }
    if (section.id === 'trusses') {
      return <TrussDiagram />;
    }
    if (section.id === 'large-structures') {
      return <BridgeTypesDiagram />;
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

export const MechanicalStructures: React.FC = () => {
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
              TOPIC 5
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Mechanical Structures
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Structures are the framework of our built environment. In this chapter, you'll learn
            about beams, trusses, joints, and large structures like bridges and dams. We'll explore
            how materials and design choices affect strength, stability, and efficiency — from
            the humble beam to the mighty suspension bridge.
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

export default MechanicalStructures;