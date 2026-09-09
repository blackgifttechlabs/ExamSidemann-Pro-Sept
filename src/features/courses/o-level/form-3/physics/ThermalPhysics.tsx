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
  type: 'image' | 'kinetic' | 'expansion' | 'thermometer' | 'heattransfer';
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

/* ---- Thermal Physics Diagrams ---- */

const KineticTheoryDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">States of Matter — Kinetic Theory</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-6 sm:grid-cols-3">
      <div className="flex flex-col items-center">
        <div className="relative h-24 w-24">
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
          <div className="absolute left-1/3 top-1/4 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
          <div className="absolute right-1/3 bottom-1/4 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
          <div className="absolute left-1/4 bottom-1/3 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
          <div className="absolute right-1/4 top-1/3 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500" />
        </div>
        <span className="mt-2 text-sm font-bold text-slate-700">Solid</span>
        <p className="text-xs text-slate-500">Fixed positions, vibrate</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative h-24 w-24">
          <div className="absolute left-1/3 top-1/3 h-3 w-3 rounded-full bg-blue-400" />
          <div className="absolute right-1/3 top-1/3 h-3 w-3 rounded-full bg-blue-400" />
          <div className="absolute left-1/4 bottom-1/3 h-3 w-3 rounded-full bg-blue-400" />
          <div className="absolute right-1/4 bottom-1/3 h-3 w-3 rounded-full bg-blue-400" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400" />
        </div>
        <span className="mt-2 text-sm font-bold text-slate-700">Liquid</span>
        <p className="text-xs text-slate-500">Close, can slide past</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative h-24 w-24">
          <div className="absolute left-1/4 top-1/4 h-3 w-3 rounded-full bg-blue-300" />
          <div className="absolute right-1/4 top-1/3 h-3 w-3 rounded-full bg-blue-300" />
          <div className="absolute left-1/3 bottom-1/4 h-3 w-3 rounded-full bg-blue-300" />
          <div className="absolute right-1/3 bottom-1/4 h-3 w-3 rounded-full bg-blue-300" />
          <div className="absolute left-2/3 top-2/3 h-3 w-3 rounded-full bg-blue-300" />
          <div className="absolute right-2/3 top-1/2 h-3 w-3 rounded-full bg-blue-300" />
        </div>
        <span className="mt-2 text-sm font-bold text-slate-700">Gas</span>
        <p className="text-xs text-slate-500">Far apart, random motion</p>
      </div>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Particles in solids vibrate about fixed positions; liquids flow; gases fill any container.
    </p>
  </div>
);

const ExpansionDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Thermal Expansion — Applications</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div className="rounded-lg border-2 border-slate-200 p-3">
        <p className="text-sm font-semibold text-slate-700">Expansion Joints in Bridges</p>
        <p className="text-xs text-slate-600">Gaps allow the bridge to expand in summer without buckling.</p>
      </div>
      <div className="rounded-lg border-2 border-slate-200 p-3">
        <p className="text-sm font-semibold text-slate-700">Bimetallic Strip in Thermostats</p>
        <p className="text-xs text-slate-600">Two metals expand differently, causing the strip to bend and switch circuits.</p>
      </div>
      <div className="rounded-lg border-2 border-slate-200 p-3">
        <p className="text-sm font-semibold text-slate-700">Overhead Power Cables</p>
        <p className="text-xs text-slate-600">Cables sag in hot weather because they expand; they are hung with slack.</p>
      </div>
      <div className="rounded-lg border-2 border-slate-200 p-3">
        <p className="text-sm font-semibold text-slate-700">Railway Lines</p>
        <p className="text-xs text-slate-600">Gaps between rails prevent buckling due to thermal expansion.</p>
      </div>
    </div>
  </div>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'kinetic-theory',
    eyebrow: 'Chapter 7.1',
    title: 'Kinetic Theory of Matter',
    heading: 'Kinetic Theory — The Particle Model',
    intro:
      'The **kinetic theory of matter** explains the physical properties of solids, liquids, and gases in terms of the motion and arrangement of particles.',
    intro2:
      'All matter is made of tiny, constantly moving particles. The differences between states arise from the spacing and motion of these particles.',
    introMore: [
      '**Solids:** particles are close together in a regular arrangement, vibrating about fixed positions.',
      '**Liquids:** particles are close but can slide past each other; they have more kinetic energy.',
      '**Gases:** particles are far apart, moving randomly at high speed; they fill any container.',
      '**Brownian motion:** the random, jittery movement of small particles (e.g., smoke) caused by collisions with invisible, fast-moving molecules — evidence for particle motion.',
      '**Diffusion:** the mixing of substances due to random molecular motion (e.g., perfume spreading through a room).',
      '**Relative order of expansion:** gases expand most, then liquids, then solids (for the same temperature rise).',
      '**Charles\'s Law:** at constant pressure, volume of a fixed mass of gas is directly proportional to absolute temperature.',
      '**Boyle\'s Law:** at constant temperature, pressure of a fixed mass of gas is inversely proportional to volume.',
    ],
    definition:
      'The **kinetic theory** describes matter as composed of particles in constant motion. The properties of solids, liquids, and gases are explained by the arrangement and movement of these particles.',
    method: {
      title: 'Gas Laws — Combined Equation',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Charles\'s Law', text: 'V ∝ T (at constant pressure) → V₁/T₁ = V₂/T₂ (temperature in Kelvin).' },
        { step: 2, formula: 'Boyle\'s Law', text: 'P ∝ 1/V (at constant temperature) → P₁V₁ = P₂V₂.' },
        { step: 3, formula: 'Combined Gas Law', text: 'P₁V₁/T₁ = P₂V₂/T₂ (temperature must be in Kelvin).' },
      ],
    },
    method2: {
      title: 'Key Facts About States of Matter',
      kind: 'rules',
      rules: [
        { rule: 'Solids have fixed shape and volume.', example: 'Particles vibrate about fixed positions.' },
        { rule: 'Liquids have fixed volume but take the shape of the container.', example: 'Particles can slide past each other.' },
        { rule: 'Gases have neither fixed shape nor fixed volume.', example: 'Particles move randomly and fill any container.' },
        { rule: 'Diffusion is fastest in gases, slowest in solids.', example: 'Perfume spreads quickly in air (gas) but slowly in water (liquid).' },
      ],
    },
    keyFormula: {
      label: 'Combined Gas Law:',
      formula: 'P₁V₁ / T₁ = P₂V₂ / T₂   (T in Kelvin)',
    },
    examples: [
      {
        question: 'A gas has a volume of 2.0 m³ at a temperature of 300 K. What is its volume at 450 K, if pressure is constant?',
        steps: ['V₁ = 2.0 m³', 'T₁ = 300 K', 'T₂ = 450 K', 'Charles\'s Law: V₁/T₁ = V₂/T₂ → V₂ = V₁ × T₂/T₁ = 2.0 × 450/300 = 3.0 m³'],
        answer: 'V₂ = 3.0 m³',
      },
      {
        question: 'A gas occupies 3.0 m³ at a pressure of 100 kPa. If the pressure is increased to 150 kPa at constant temperature, what is the new volume?',
        steps: ['P₁ = 100 kPa', 'V₁ = 3.0 m³', 'P₂ = 150 kPa', 'Boyle\'s Law: P₁V₁ = P₂V₂ → V₂ = P₁V₁/P₂ = 100 × 3.0 / 150 = 2.0 m³'],
        answer: 'V₂ = 2.0 m³',
      },
      {
        question: 'A gas has a volume of 4.0 m³ at 200 kPa and 400 K. What is its volume at 300 kPa and 600 K?',
        steps: ['P₁=200 kPa, V₁=4.0 m³, T₁=400 K', 'P₂=300 kPa, T₂=600 K', 'Using P₁V₁/T₁ = P₂V₂/T₂ → V₂ = P₁V₁T₂/(P₂T₁) = 200×4.0×600/(300×400) = 4.0 m³'],
        answer: 'V₂ = 4.0 m³',
      },
    ],
    practice: [
      'Describe the arrangement and motion of particles in solids, liquids, and gases.',
      'Explain Brownian motion and what it tells us about the nature of matter.',
      'State Charles\'s Law and Boyle\'s Law.',
      'A gas has a volume of 5.0 m³ at a pressure of 120 kPa. At constant temperature, what will its volume be if the pressure is increased to 200 kPa?',
      'A gas at 300 K has a volume of 2.5 m³. What will be its volume at 450 K at constant pressure?',
    ],
  },
  {
    id: 'thermal-properties',
    eyebrow: 'Chapter 7.2',
    title: 'Thermal Properties',
    heading: 'Thermal Properties — Expansion, Thermometers, Heat Capacities',
    intro:
      'Thermal properties describe how materials respond to changes in temperature: they expand, change state, and absorb or release heat.',
    intro2:
      'In this section, we study thermal expansion, thermometers, and the quantitative measurement of heat using specific heat capacity and latent heat.',
    introMore: [
      '**Expansion:** solids expand least, gases most (for the same temperature rise). Applications: expansion joints, bimetallic strips, sagging cables.',
      '**Thermometers** use a physical property that changes with temperature (e.g., length of liquid, resistance). Fixed points (0°C ice point, 100°C steam point) calibrate them.',
      '**Melting and boiling** occur at fixed temperatures; heat energy is absorbed without temperature change during the phase change.',
      '**Specific heat capacity (c):** heat energy needed to raise 1 kg of substance by 1°C. Q = mcΔθ.',
      '**Specific latent heat (l):** heat energy needed to change the state of 1 kg of substance without changing temperature. Q = ml.',
      'Impurities lower melting points and raise boiling points; increased pressure raises boiling point.',
    ],
    definition:
      '**Specific heat capacity** is the heat energy required to raise the temperature of 1 kg of a substance by 1°C (or 1 K).\n\n' +
      '**Specific latent heat** is the heat energy required to change the state of 1 kg of a substance without changing its temperature.',
    method: {
      title: 'Heat Calculations',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Q = mcΔθ', text: 'Calculate heat gained/lost using specific heat capacity (c).' },
        { step: 2, formula: 'Q = ml', text: 'Calculate heat for a phase change (latent heat).' },
        { step: 3, formula: 'Q = IVt', text: 'Electrical heating: energy = current × voltage × time.' },
        { step: 4, formula: 'Heat balance', text: 'Q_lost = Q_gained (assuming no losses).' },
      ],
    },
    method2: {
      title: 'Thermometers and Fixed Points',
      kind: 'rules',
      rules: [
        { rule: 'Fixed points: ice point (0°C), steam point (100°C).', example: 'Used to calibrate thermometers.' },
        { rule: 'Liquid-in-glass thermometer: range, sensitivity, linearity.', example: 'Mercury or alcohol, different ranges.' },
        { rule: 'Thermocouple: measures high temperatures, fast response.', example: 'Used in industry and laboratories.' },
        { rule: 'Clinical thermometer: range ~35–42°C, with constriction.', example: 'Used to measure body temperature.' },
      ],
    },
    keyFormula: {
      label: 'Heat equations:',
      formula: (
        <>
          Q = mcΔθ &nbsp;&nbsp;|&nbsp;&nbsp; Q = ml &nbsp;&nbsp;|&nbsp;&nbsp; Q = IVt
        </>
      ),
    },
    examples: [
      {
        question: 'How much heat is needed to raise the temperature of 2 kg of water from 20°C to 80°C? (c_water = 4200 J/kg°C)',
        steps: ['m = 2 kg', 'Δθ = 80 − 20 = 60°C', 'Q = mcΔθ = 2 × 4200 × 60 = 504,000 J = 504 kJ'],
        answer: 'Q = 504 kJ',
      },
      {
        question: 'A 0.5 kg block of ice at 0°C is melted. How much heat is required? (Latent heat of fusion of ice = 334,000 J/kg)',
        steps: ['m = 0.5 kg', 'l = 334,000 J/kg', 'Q = ml = 0.5 × 334,000 = 167,000 J = 167 kJ'],
        answer: 'Q = 167 kJ',
      },
      {
        question: 'A heater supplies 500 J of energy per second. How long will it take to heat 0.2 kg of water from 15°C to 100°C? (c_water = 4200 J/kg°C)',
        steps: ['Energy needed = mcΔθ = 0.2 × 4200 × (100−15) = 0.2 × 4200 × 85 = 71,400 J', 'Power = 500 W', 'Time = Energy / Power = 71,400 / 500 = 142.8 s ≈ 143 s'],
        answer: 'Time ≈ 143 s (2 min 23 s)',
      },
    ],
    practice: [
      'What is meant by specific heat capacity? Give its unit.',
      'Calculate the heat energy needed to raise the temperature of 1.5 kg of copper from 25°C to 100°C. (c_copper = 385 J/kg°C)',
      'Define specific latent heat of vaporisation.',
      'A 0.2 kg sample of a liquid is vaporised at its boiling point, requiring 90,000 J of energy. Calculate its specific latent heat of vaporisation.',
      'Why does the temperature not change during melting or boiling?',
    ],
  },
  {
    id: 'heat-transfer',
    eyebrow: 'Chapter 7.3',
    title: 'Heat Transfer',
    heading: 'Heat Transfer — Conduction, Convection, Radiation',
    intro:
      'Heat can be transferred from one place to another by three mechanisms: **conduction**, **convection**, and **radiation**.',
    intro2:
      'Each mechanism operates in different media and under different conditions. Understanding them helps explain everyday phenomena and design efficient heating systems.',
    introMore: [
      '**Conduction:** heat transfer through a solid by particle vibrations and collisions. Metals are good conductors; insulators (wood, air) are poor conductors.',
      '**Convection:** heat transfer in fluids (liquids and gases) by density differences — hot fluid rises, cold fluid sinks, creating convection currents.',
      '**Radiation:** heat transfer by electromagnetic (infrared) waves; does not require a medium. Dull, black surfaces are good absorbers and emitters; shiny, white surfaces are poor.',
      'Applications: solar water heaters (radiation), vacuum flasks (reduce all three), sea breezes (convection), cooking utensils (conduction).',
    ],
    definition:
      '**Conduction** is the transfer of heat through a material by particle vibration and collision, without bulk movement of the material.\n\n' +
      '**Convection** is the transfer of heat in a fluid by the movement of the fluid itself due to density differences.\n\n' +
      '**Radiation** is the transfer of heat by electromagnetic waves, primarily infrared, that can travel through a vacuum.',
    method: {
      title: 'Identifying Good and Bad Conductors',
      kind: 'rules',
      rules: [
        { rule: 'Metals are good conductors of heat.', example: 'Copper, aluminium, iron.' },
        { rule: 'Non-metals like wood, plastic, air are poor conductors (insulators).', example: 'Handle of a saucepan, double glazing.' },
        { rule: 'Conduction in metals occurs via free electrons.', example: 'Electrons transfer energy quickly through the metal.' },
        { rule: 'Convection occurs in liquids and gases.', example: 'Heating water in a pan, air currents in a room.' },
      ],
    },
    method2: {
      title: 'Radiation — Absorbers and Emitters',
      kind: 'rules',
      rules: [
        { rule: 'Dull, black surfaces are good absorbers of radiation.', example: 'Solar panels, black car interior heats up quickly.' },
        { rule: 'Dull, black surfaces are also good emitters of radiation.', example: 'Hot black body cools faster than a shiny one.' },
        { rule: 'Shiny, white surfaces are poor absorbers and poor emitters.', example: 'White roofs keep buildings cool, shiny space blanket reflects heat.' },
        { rule: 'Solar water heaters use radiation to heat water.', example: 'Flat plate collector with dark surface.' },
      ],
    },
    keyFormula: {
      label: 'Remember:',
      formula: 'Good absorbers = Good emitters; Poor absorbers = Poor emitters',
    },
    examples: [
      {
        question: 'Explain why a vacuum flask is able to keep hot liquids hot for a long time.',
        steps: [
          'The vacuum between the walls prevents conduction and convection.',
          'The silvered surfaces reflect radiation back into the liquid.',
          'The stopper and insulating materials reduce heat loss by conduction.',
        ],
        answer: 'Vacuum reduces conduction and convection; silvered surfaces reduce radiation.',
      },
      {
        question: 'Why are car radiators usually painted black?',
        steps: [
          'Black surfaces are good emitters of radiation.',
          'The radiator needs to lose heat to the surrounding air efficiently.',
          'Black colour enhances heat transfer by radiation.',
        ],
        answer: 'Black is a good emitter, so heat is lost more rapidly.',
      },
      {
        question: 'A solar water heater has a black collector plate. Why is it black?',
        steps: [
          'Black surfaces are good absorbers of radiation (sunlight).',
          'This maximises the energy absorbed from the sun.',
          'The absorbed energy heats the water in the pipes.',
        ],
        answer: 'Black absorbs radiation well, increasing the efficiency of heating.',
      },
    ],
    practice: [
      'Explain conduction, convection, and radiation. Give an example of each.',
      'Why are metals good conductors of heat?',
      'Describe an experiment to show that black surfaces are better emitters of radiation than white surfaces.',
      'Explain the design of a vacuum flask and how it reduces heat loss by each of the three mechanisms.',
      'How does a solar water heater work?',
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
    if (section.id === 'kinetic-theory') {
      return <KineticTheoryDiagram />;
    }
    if (section.id === 'thermal-properties') {
      return <ExpansionDiagram />;
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

export const ThermalPhysics: React.FC = () => {
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
              TOPIC 7
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Thermal Physics
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Thermal physics explores heat, temperature, and the behaviour of matter. In this chapter,
            you'll learn about the kinetic theory of matter, thermal expansion, thermometers,
            heat capacities, latent heat, and the three mechanisms of heat transfer —
            with practical applications and worked examples.
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

export default ThermalPhysics;