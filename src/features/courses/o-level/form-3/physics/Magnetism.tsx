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
  type: 'image' | 'field' | 'magnetisation' | 'application';
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
  MAGNETISM DIAGRAMS (SVG)
  ======================================================================== */

/* ---- Magnetic Field Lines ---- */
const MagneticFieldDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Magnetic Field Lines</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Bar Magnet</p>
        <svg viewBox="0 0 160 120" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="55" y="50" width="50" height="20" fill="#dc2626" rx="3" />
          <rect x="55" y="50" width="20" height="20" fill="#2563eb" rx="3" />
          <text x="65" y="63" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">N</text>
          <text x="95" y="63" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">S</text>
          {/* Field lines */}
          <path d="M65,50 Q30,30 95,50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag)" />
          <path d="M65,50 Q30,60 95,50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag)" />
          <path d="M95,70 Q120,90 65,70" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag)" />
          <path d="M95,70 Q120,80 65,70" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag)" />
          <path d="M65,50 Q60,20 65,50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag)" />
          <path d="M95,70 Q100,100 95,70" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag)" />
          <defs>
            <marker id="arrowMag" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#8b5cf6" />
            </marker>
          </defs>
          <text x="80" y="115" textAnchor="middle" fontSize="10" fill="#475569">N → S (outside magnet)</text>
        </svg>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Horseshoe Magnet</p>
        <svg viewBox="0 0 160 120" className="mx-auto h-auto w-full max-w-[160px]">
          <path d="M60,30 L60,80 Q60,95 75,95 L85,95 Q100,95 100,80 L100,30" fill="none" stroke="#475569" strokeWidth="3" />
          <text x="60" y="22" textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="bold">N</text>
          <text x="100" y="22" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="bold">S</text>
          <path d="M65,35 Q80,20 95,35" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag2)" />
          <path d="M65,40 Q80,25 95,40" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag2)" />
          <path d="M65,45 Q80,30 95,45" fill="none" stroke="#8b5cf6" strokeWidth="1.5" markerEnd="url(#arrowMag2)" />
          <defs>
            <marker id="arrowMag2" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#8b5cf6" />
            </marker>
          </defs>
          <text x="80" y="115" textAnchor="middle" fontSize="10" fill="#475569">Strong uniform field between poles</text>
        </svg>
      </div>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Magnetic field lines leave the N pole and enter the S pole. They show the direction of force on a north pole.
    </p>
  </div>
);

/* ---- Magnetisation Methods ---- */
const MagnetisationDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Magnetisation Methods</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Single Stroke Method</p>
        <svg viewBox="0 0 180 80" className="mx-auto h-auto w-full max-w-[180px]">
          <rect x="10" y="30" width="120" height="20" fill="#94a3b8" rx="2" />
          <text x="70" y="25" textAnchor="middle" fontSize="10" fill="#475569">Steel bar (unmagnetised)</text>
          <rect x="10" y="30" width="40" height="20" fill="#dc2626" rx="2" />
          <text x="15" y="44" textAnchor="start" fontSize="8" fill="white" fontWeight="bold">N</text>
          <text x="45" y="44" textAnchor="start" fontSize="8" fill="white" fontWeight="bold">S</text>
          <line x1="50" y1="40" x2="140" y2="40" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowStroke)" />
          <text x="150" y="44" fontSize="8" fill="#475569">Stroke</text>
          <defs>
            <marker id="arrowStroke" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#dc2626" />
            </marker>
          </defs>
        </svg>
        <p className="text-center text-xs text-slate-600">Stroke a steel bar with a magnet</p>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-amber-700">Solenoid Method</p>
        <svg viewBox="0 0 180 80" className="mx-auto h-auto w-full max-w-[180px]">
          <rect x="10" y="30" width="100" height="16" fill="#94a3b8" rx="2" />
          <rect x="10" y="30" width="30" height="16" fill="#dc2626" rx="2" />
          <rect x="80" y="30" width="30" height="16" fill="#2563eb" rx="2" />
          <text x="15" y="41" textAnchor="start" fontSize="8" fill="white" fontWeight="bold">N</text>
          <text x="25" y="41" textAnchor="start" fontSize="8" fill="white">S</text>
          <text x="90" y="41" textAnchor="start" fontSize="8" fill="white">N</text>
          <text x="100" y="41" textAnchor="start" fontSize="8" fill="white">S</text>
          {/* Solenoid coils */}
          <path d="M20,46 Q25,55 30,46 Q35,55 40,46 Q45,55 50,46 Q55,55 60,46 Q65,55 70,46 Q75,55 80,46" fill="none" stroke="#475569" strokeWidth="1.5" />
          <path d="M20,34 Q25,25 30,34 Q35,25 40,34 Q45,25 50,34 Q55,25 60,34 Q65,25 70,34 Q75,25 80,34" fill="none" stroke="#475569" strokeWidth="1.5" />
          <text x="10" y="60" fontSize="8" fill="#475569">Current</text>
          <line x1="30" y1="60" x2="30" y2="70" stroke="#475569" strokeWidth="1" />
          <line x1="30" y1="70" x2="50" y2="70" stroke="#475569" strokeWidth="1" />
          <circle cx="40" cy="70" r="3" fill="#dc2626" />
          <text x="55" y="73" fontSize="8" fill="#475569">Battery</text>
        </svg>
        <p className="text-center text-xs text-slate-600">Place in a current-carrying solenoid</p>
      </div>
    </div>
  </div>
);

/* ---- Applications Diagram ---- */
const ApplicationsDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Uses of Magnets</h4>
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-4">
      <div className="flex flex-col items-center rounded-lg border-2 border-blue-200 bg-blue-50/60 p-3">
        <span className="text-3xl">🔔</span>
        <span className="mt-1 text-xs font-bold text-blue-700 text-center">Electric Bell</span>
        <span className="text-[10px] text-slate-600 text-center">Temporary</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-amber-200 bg-amber-50/60 p-3">
        <span className="text-3xl">🏗️</span>
        <span className="mt-1 text-xs font-bold text-amber-700 text-center">Crane</span>
        <span className="text-[10px] text-slate-600 text-center">Electromagnet</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-green-200 bg-green-50/60 p-3">
        <span className="text-3xl">🧭</span>
        <span className="mt-1 text-xs font-bold text-green-700 text-center">Compass</span>
        <span className="text-[10px] text-slate-600 text-center">Permanent</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-purple-200 bg-purple-50/60 p-3">
        <span className="text-3xl">🔊</span>
        <span className="mt-1 text-xs font-bold text-purple-700 text-center">Loudspeaker</span>
        <span className="text-[10px] text-slate-600 text-center">Electromagnet</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-red-200 bg-red-50/60 p-3">
        <span className="text-3xl">⚡</span>
        <span className="mt-1 text-xs font-bold text-red-700 text-center">Generator</span>
        <span className="text-[10px] text-slate-600 text-center">Permanent</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-indigo-200 bg-indigo-50/60 p-3">
        <span className="text-3xl">📀</span>
        <span className="mt-1 text-xs font-bold text-indigo-700 text-center">Hard Drive</span>
        <span className="text-[10px] text-slate-600 text-center">Permanent</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-cyan-200 bg-cyan-50/60 p-3">
        <span className="text-3xl">📞</span>
        <span className="mt-1 text-xs font-bold text-cyan-700 text-center">Telephone</span>
        <span className="text-[10px] text-slate-600 text-center">Electromagnet</span>
      </div>
      <div className="flex flex-col items-center rounded-lg border-2 border-pink-200 bg-pink-50/60 p-3">
        <span className="text-3xl">🎥</span>
        <span className="mt-1 text-xs font-bold text-pink-700 text-center">Tape/Video</span>
        <span className="text-[10px] text-slate-600 text-center">Permanent</span>
      </div>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Temporary magnets (electromagnets) are used where magnetic field needs to be switched on/off.
      Permanent magnets are used where a constant magnetic field is needed.
    </p>
  </div>
);

/* ---- Iron vs Steel Comparison ---- */
const IronSteelDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Iron vs Steel — Magnetic Properties</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50/60 p-3">
        <p className="text-sm font-bold text-blue-700">Iron (Soft Magnetic Material)</p>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          <li>• Magnetises easily</li>
          <li>• Loses magnetism quickly</li>
          <li>• Used for temporary magnets</li>
          <li>• Used in electromagnets</li>
          <li>• Example: transformer cores</li>
        </ul>
      </div>
      <div className="rounded-lg border-2 border-amber-200 bg-amber-50/60 p-3">
        <p className="text-sm font-bold text-amber-700">Steel (Hard Magnetic Material)</p>
        <ul className="mt-2 space-y-1 text-xs text-slate-700">
          <li>• Harder to magnetise</li>
          <li>• Keeps its magnetism</li>
          <li>• Used for permanent magnets</li>
          <li>• Used in compass needles</li>
          <li>• Example: bar magnets</li>
        </ul>
      </div>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Iron is soft — easy to magnetise and demagnetise. Steel is hard — retains magnetism well.
    </p>
  </div>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'magnetic-properties',
    eyebrow: 'Chapter 12.1',
    title: 'Magnetic Properties',
    heading: 'Magnetic Properties — Magnets and Fields',
    intro:
      '**Magnetism** is a force of attraction or repulsion that acts between certain materials. Every magnet has two poles: a **north pole** and a **south pole**.',
    intro2:
      'Like poles repel; unlike poles attract. A magnetic field is the region around a magnet where its influence can be felt.',
    introMore: [
      '**Magnetic field lines** show the direction and strength of the field — they leave the N pole and enter the S pole.',
      '**Induced magnetism** occurs when an unmagnetised magnetic material becomes magnetised when placed near or in contact with a magnet.',
      '**Magnetisation methods:** single stroking, double stroking, placing in a current-carrying solenoid.',
      '**Demagnetisation methods:** hammering, heating, using alternating current (AC).',
      '**Magnetic materials:** iron, steel, nickel, cobalt. Non-magnetic materials include copper, aluminium, wood, glass.',
      'Iron magnetises easily but loses magnetism quickly — used for temporary magnets/electromagnets.',
      'Steel is harder to magnetise but keeps its magnetism — used for permanent magnets.',
    ],
    definition:
      'A **magnet** is a material that produces a magnetic field. It has two poles: north (N) and south (S).\n\n' +
      '**Magnetic field lines** are imaginary lines that show the direction of the magnetic force. They leave the N pole and enter the S pole.',
    method: {
      title: 'Magnetisation and Demagnetisation',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Single stroking', text: 'Stroke a steel bar repeatedly with a magnet in one direction — aligns magnetic domains.' },
        { step: 2, formula: 'Double stroking', text: 'Stroke from the centre outwards with two magnets — creates stronger magnetisation.' },
        { step: 3, formula: 'Solenoid method', text: 'Place the material inside a coil carrying direct current — the magnetic field magnetises it.' },
        { step: 4, formula: 'Demagnetisation', text: 'Hammering, heating above the Curie point, or placing in an alternating magnetic field randomises domains.' },
      ],
    },
    method2: {
      title: 'Key Magnetic Facts',
      kind: 'rules',
      rules: [
        { rule: 'Like poles repel; unlike poles attract.', example: 'N-N repel, N-S attract.' },
        { rule: 'Field lines go from N to S (outside the magnet).', example: 'They are continuous loops.' },
        { rule: 'Iron is a soft magnetic material.', example: 'Used in electromagnets (temporary).' },
        { rule: 'Steel is a hard magnetic material.', example: 'Used for permanent magnets.' },
        { rule: 'Induced magnetism requires no contact.', example: 'Bring a magnet near an unmagnetised iron nail.' },
      ],
    },
    keyFormula: {
      label: 'Key principle:',
      formula: 'Like poles repel, unlike poles attract',
    },
    examples: [
      {
        question: 'Explain the difference between a hard magnetic material and a soft magnetic material, giving an example of each.',
        steps: [
          'A hard magnetic material (steel) is difficult to magnetise but retains its magnetism once magnetised.',
          'A soft magnetic material (iron) is easy to magnetise but loses its magnetism quickly.',
          'Steel is used for permanent magnets; iron is used for electromagnets.',
        ],
        answer: 'Hard (steel) — retains magnetism; soft (iron) — easily magnetised/demagnetised.',
      },
      {
        question: 'Describe two methods of magnetising a steel bar.',
        steps: [
          'Method 1 — Single stroking: stroke the bar in one direction with a magnet.',
          'Method 2 — Solenoid: place the bar inside a coil carrying current and switch the current on.',
          'Both methods align the magnetic domains in the material.',
        ],
        answer: 'Single stroking and solenoid method are two ways to magnetise a steel bar.',
      },
      {
        question: 'Explain why a magnet loses its magnetism when it is heated or hammered.',
        steps: [
          'Heating gives the atoms more energy, causing them to vibrate and randomise their magnetic domains.',
          'Hammering also disturbs the alignment of magnetic domains.',
          'When domains are randomly oriented, the net magnetic field is zero.',
        ],
        answer: 'Heating or hammering randomises the magnetic domains, demagnetising the material.',
      },
    ],
    practice: [
      'State the two types of magnetic poles and the rule for their interaction.',
      'What are magnetic field lines? In which direction do they travel?',
      'Distinguish between iron and steel as magnetic materials. Which is better for a permanent magnet?',
      'Describe three methods of magnetisation and two methods of demagnetisation.',
      'What is induced magnetism? Give an example.',
    ],
  },
  {
    id: 'applications',
    eyebrow: 'Chapter 12.2',
    title: 'Applications of Magnets',
    heading: 'Applications — Uses of Temporary and Permanent Magnets',
    intro:
      'Magnets have a wide range of practical applications. The choice between a temporary magnet (electromagnet) and a permanent magnet depends on the requirement.',
    intro2:
      '**Temporary magnets** (electromagnets) are used where the magnetic field needs to be switched on and off. **Permanent magnets** are used where a constant magnetic field is needed.',
    introMore: [
      '**Temporary magnets (electromagnets):** electric bells, cranes for lifting scrap metal, relays, loudspeakers, telephone receivers.',
      '**Permanent magnets:** compasses, electric motors, generators, computer hard drives, audio and video tapes, fridge magnets.',
      'Electromagnets are also used in MRI scanners, particle accelerators, and magnetic locks.',
      'Permanent magnets are essential in many modern technologies where a continuous magnetic field is required.',
    ],
    definition:
      'A **temporary magnet** (electromagnet) is a magnet that only produces a magnetic field when an electric current flows through it. It is made by wrapping a coil of wire around a soft iron core.\n\n' +
      'A **permanent magnet** is a material that retains its magnetism without any external influence.',
    method: {
      title: 'Temporary vs Permanent Magnets',
      kind: 'rules',
      rules: [
        { rule: 'Temporary magnets (electromagnets) require current.', example: 'Electric bells, cranes, relays.' },
        { rule: 'Temporary magnets can be switched on and off.', example: 'Useful in control systems.' },
        { rule: 'Permanent magnets are always magnetic.', example: 'Compasses, motors, generators.' },
        { rule: 'Permanent magnets maintain a constant field.', example: 'Used in measuring instruments.' },
      ],
    },
    keyFormula: {
      label: 'Key distinction:',
      formula: 'Temporary = electromagnet (current)  |  Permanent = always magnetic',
    },
    examples: [
      {
        question: 'Explain why an electromagnet is used in a scrap yard crane rather than a permanent magnet.',
        steps: [
          'An electromagnet can be switched on and off by controlling the current.',
          'When the crane needs to pick up scrap metal, the current is switched on.',
          'When the scrap needs to be released, the current is switched off, and the magnetism disappears.',
          'A permanent magnet would hold the scrap and not release it easily.',
        ],
        answer: 'Electromagnets can be switched on and off, making them ideal for lifting and releasing scrap metal.',
      },
      {
        question: 'Give two uses of permanent magnets and explain why a permanent magnet is suitable for each.',
        steps: [
          'Compass — a permanent magnet is needed to align with the Earth\'s magnetic field continuously.',
          'Electric motor — permanent magnets provide a constant magnetic field for the motor to operate efficiently.',
        ],
        answer: 'Compass (constant alignment with Earth\'s field) and motor (constant magnetic field for rotation).',
      },
    ],
    practice: [
      'Give three examples of devices that use temporary magnets (electromagnets).',
      'Give three examples of devices that use permanent magnets.',
      'Explain why an electromagnet is used in an electric bell.',
      'Why is a permanent magnet used in a compass?',
      'Describe the difference in construction between an electromagnet and a permanent magnet.',
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
    if (section.id === 'magnetic-properties') {
      return (
        <>
          <MagneticFieldDiagram />
          <MagnetisationDiagram />
          <IronSteelDiagram />
        </>
      );
    }
    if (section.id === 'applications') {
      return <ApplicationsDiagram />;
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

export const Magnetism: React.FC = () => {
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
              TOPIC 12
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Magnetism
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Magnetism is the force that attracts certain materials. In this chapter, you'll learn
            about magnetic properties, field lines, induced magnetism, and the difference between
            iron and steel. You'll also discover the wide range of applications for both temporary
            and permanent magnets — from electric bells and cranes to compasses and hard drives.
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

export default Magnetism;