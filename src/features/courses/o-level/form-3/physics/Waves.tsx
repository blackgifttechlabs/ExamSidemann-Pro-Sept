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
  type: 'image' | 'wave' | 'sound' | 'em';
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

/* ---- Wave Diagrams ---- */

const WaveTypesDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Transverse vs Longitudinal Waves</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div className="rounded-lg border-2 border-blue-200 bg-blue-50/60 p-3">
        <p className="text-sm font-bold text-blue-700">Transverse Wave</p>
        <div className="mt-2 flex justify-center">
          <svg viewBox="0 0 200 60" className="h-12 w-full">
            <path d="M0 30 Q20 0 40 30 Q60 60 80 30 Q100 0 120 30 Q140 60 160 30 Q180 0 200 30" fill="none" stroke="#2563eb" strokeWidth="3" />
            <line x1="40" y1="0" x2="40" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            <line x1="80" y1="0" x2="80" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            <line x1="120" y1="0" x2="120" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            <line x1="160" y1="0" x2="160" y2="60" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
            <text x="40" y="70" textAnchor="middle" fontSize="8" fill="#94a3b8">Crest</text>
            <text x="120" y="70" textAnchor="middle" fontSize="8" fill="#94a3b8">Crest</text>
            <text x="80" y="70" textAnchor="middle" fontSize="8" fill="#94a3b8">Trough</text>
            <text x="160" y="70" textAnchor="middle" fontSize="8" fill="#94a3b8">Trough</text>
          </svg>
        </div>
        <p className="mt-1 text-center text-xs text-slate-600">Vibration at 90° to direction of travel</p>
        <p className="text-center text-xs font-medium text-slate-700">Examples: Light, water waves, waves on a rope</p>
      </div>
      <div className="rounded-lg border-2 border-amber-200 bg-amber-50/60 p-3">
        <p className="text-sm font-bold text-amber-700">Longitudinal Wave</p>
        <div className="mt-2 flex justify-center">
          <svg viewBox="0 0 200 50" className="h-10 w-full">
            <line x1="10" y1="25" x2="190" y2="25" stroke="#94a3b8" strokeWidth="1" />
            <g fill="#d97706">
              <circle cx="20" cy="25" r="5" />
              <circle cx="35" cy="25" r="5" />
              <circle cx="50" cy="25" r="5" />
              <circle cx="65" cy="25" r="8" />
              <circle cx="85" cy="25" r="8" />
              <circle cx="105" cy="25" r="8" />
              <circle cx="120" cy="25" r="5" />
              <circle cx="135" cy="25" r="5" />
              <circle cx="150" cy="25" r="5" />
              <circle cx="165" cy="25" r="8" />
              <circle cx="185" cy="25" r="8" />
            </g>
            <text x="30" y="42" textAnchor="middle" fontSize="8" fill="#94a3b8">Compression</text>
            <text x="100" y="42" textAnchor="middle" fontSize="8" fill="#94a3b8">Rarefaction</text>
            <text x="170" y="42" textAnchor="middle" fontSize="8" fill="#94a3b8">Compression</text>
          </svg>
        </div>
        <p className="mt-1 text-center text-xs text-slate-600">Vibration parallel to direction of travel</p>
        <p className="text-center text-xs font-medium text-slate-700">Examples: Sound, waves in a spring</p>
      </div>
    </div>
  </div>
);

const ElectromagneticSpectrumDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Electromagnetic Spectrum</h4>
    <div className="rounded-lg border border-emerald-100 bg-white p-4">
      <div className="relative h-8 w-full">
        <div className="absolute left-0 top-0 h-8 w-[14%] rounded-l-lg bg-red-400" />
        <div className="absolute left-[14%] top-0 h-8 w-[14%] bg-orange-400" />
        <div className="absolute left-[28%] top-0 h-8 w-[14%] bg-yellow-400" />
        <div className="absolute left-[42%] top-0 h-8 w-[14%] bg-green-400" />
        <div className="absolute left-[56%] top-0 h-8 w-[14%] bg-blue-400" />
        <div className="absolute left-[70%] top-0 h-8 w-[14%] bg-indigo-400" />
        <div className="absolute left-[84%] top-0 h-8 w-[16%] rounded-r-lg bg-purple-400" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1 text-center text-[10px] font-semibold sm:grid-cols-7">
        <span className="text-red-700">Radio</span>
        <span className="text-orange-700">Microwave</span>
        <span className="text-yellow-700">Infrared</span>
        <span className="text-green-700">Visible</span>
        <span className="text-blue-700">UV</span>
        <span className="text-indigo-700">X-ray</span>
        <span className="text-purple-700">Gamma</span>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-500">
        <span>Low frequency</span>
        <span>High frequency</span>
      </div>
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Long wavelength</span>
        <span>Short wavelength</span>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        All electromagnetic waves travel at the speed of light in a vacuum (3 × 10⁸ m/s).
      </p>
    </div>
  </div>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'mechanical-waves',
    eyebrow: 'Chapter 9.1',
    title: 'Mechanical Wave Properties',
    heading: 'Mechanical Waves — Properties and Characteristics',
    intro:
      'A **wave** is a disturbance that transfers energy from one place to another without transferring matter. Waves are everywhere — in water, sound, light, and even earthquakes.',
    intro2:
      'In this section, we study the properties of mechanical waves: amplitude, wavelength, frequency, period, and speed. We also distinguish between transverse and longitudinal waves.',
    introMore: [
      '**Transverse wave:** particles vibrate at right angles to the direction of travel (e.g., light, water waves, waves on a rope).',
      '**Longitudinal wave:** particles vibrate parallel to the direction of travel (e.g., sound).',
      '**Amplitude:** maximum displacement from the rest position — related to wave energy.',
      '**Wavelength (λ):** distance between two successive identical points (e.g., crest to crest).',
      '**Frequency (f):** number of complete waves passing a point per second (unit: Hz).',
      '**Period (T):** time for one complete wave — T = 1/f.',
      'Mechanical waves need a medium to travel through (unlike electromagnetic waves).',
    ],
    definition:
      'A **mechanical wave** is a disturbance that transfers energy through a medium (solid, liquid, or gas). The particles of the medium oscillate about fixed positions, but do not move with the wave.',
    method: {
      title: 'Wave Calculations',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'T = 1/f', text: 'Period is the reciprocal of frequency.' },
        { step: 2, formula: 'v = fλ', text: 'Wave speed = frequency × wavelength.' },
        { step: 3, formula: 'Identify given values', text: 'Identify what is given in the problem and what you need to find.' },
        { step: 4, formula: 'Solve', text: 'Substitute and calculate using the wave equation.' },
      ],
    },
    method2: {
      title: 'Key Wave Properties',
      kind: 'rules',
      rules: [
        { rule: 'Amplitude = maximum displacement from equilibrium.', example: 'The height of a wave crest from the rest position.' },
        { rule: 'Wavelength = distance between two identical points.', example: 'Crest to crest or trough to trough.' },
        { rule: 'Frequency = number of waves per second.', example: 'Measured in Hertz (Hz).' },
        { rule: 'Period = time for one complete wave.', example: 'T = 1/f.' },
        { rule: 'Wave speed depends on the medium.', example: 'Sound travels faster in water than in air.' },
      ],
    },
    keyFormula: {
      label: 'Wave equations:',
      formula: (
        <>
          T = 1/f &nbsp;&nbsp;|&nbsp;&nbsp; v = fλ
        </>
      ),
    },
    examples: [
      {
        question: 'A wave has a frequency of 50 Hz and a wavelength of 2 m. Calculate the wave speed.',
        steps: ['f = 50 Hz', 'λ = 2 m', 'v = f × λ = 50 × 2 = 100 m/s'],
        answer: 'v = 100 m/s',
      },
      {
        question: 'A sound wave has a speed of 340 m/s and a frequency of 680 Hz. Calculate its wavelength.',
        steps: ['v = 340 m/s', 'f = 680 Hz', 'λ = v / f = 340 / 680 = 0.5 m'],
        answer: 'λ = 0.5 m',
      },
      {
        question: 'A water wave has a wavelength of 1.5 m and a speed of 3 m/s. Calculate its frequency.',
        steps: ['λ = 1.5 m', 'v = 3 m/s', 'f = v / λ = 3 / 1.5 = 2 Hz'],
        answer: 'f = 2 Hz',
      },
      {
        question: 'A wave has a period of 0.02 s. Calculate its frequency.',
        steps: ['T = 0.02 s', 'f = 1 / T = 1 / 0.02 = 50 Hz'],
        answer: 'f = 50 Hz',
      },
    ],
    practice: [
      'Define amplitude, wavelength, frequency, and period.',
      'Distinguish between transverse and longitudinal waves, giving an example of each.',
      'A wave has a frequency of 200 Hz and a wavelength of 1.7 m. Calculate the wave speed.',
      'A sound wave travels at 330 m/s with a frequency of 550 Hz. Calculate its wavelength.',
      'What is the period of a wave with a frequency of 25 Hz?',
    ],
  },
  {
    id: 'sound',
    eyebrow: 'Chapter 9.2',
    title: 'Sound Waves',
    heading: 'Sound — A Longitudinal Wave',
    intro:
      '**Sound** is produced by a vibrating object. It is a mechanical, longitudinal wave that travels through a medium (solid, liquid, or gas).',
    intro2:
      'Sound consists of **compressions** (regions of high pressure where particles are close together) and **rarefactions** (regions of low pressure where particles are spread apart).',
    introMore: [
      'Sound needs a medium — it cannot travel through a vacuum (no particles to vibrate).',
      'The human audible range is approximately **20 Hz to 20,000 Hz**.',
      '**Pitch** is related to frequency: higher frequency = higher pitch.',
      '**Loudness** is related to amplitude: larger amplitude = louder sound.',
      '**Quality (timbre)** allows us to distinguish two sounds of the same pitch and loudness.',
      'An **echo** is the reflection of sound off a surface — used for depth determination (sonar).',
    ],
    definition:
      '**Sound** is a longitudinal wave produced by a vibrating source. It consists of compressions and rarefactions travelling through a medium.\n\n' +
      'The **audible range** for humans is approximately 20 Hz to 20,000 Hz.',
    method: {
      title: 'Determining the Speed of Sound in Air',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Method 1: Echo', text: 'Measure the time for an echo to return from a known distance. Speed = 2d / t.' },
        { step: 2, formula: 'Method 2: Starter gun', text: 'Measure the time between seeing a flash (light) and hearing the sound.' },
        { step: 3, formula: 'Method 3: Resonance tube', text: 'Use a resonance tube to find the wavelength, then v = fλ.' },
        { step: 4, formula: 'v = fλ', text: 'Once you know frequency and wavelength, you can calculate speed.' },
      ],
    },
    method2: {
      title: 'Sound Characteristics',
      kind: 'rules',
      rules: [
        { rule: 'Pitch depends on frequency.', example: 'A high frequency gives a high pitch (e.g., a whistle).' },
        { rule: 'Loudness depends on amplitude.', example: 'A larger amplitude gives a louder sound.' },
        { rule: 'Quality (timbre) distinguishes sources.', example: 'A violin and a piano playing the same note sound different.' },
        { rule: 'Sound needs a medium.', example: 'In a vacuum, no sound can be heard.' },
        { rule: 'Echoes are reflected sound waves.', example: 'Used for sonar, depth finding, and ultrasound scanning.' },
      ],
    },
    keyFormula: {
      label: 'Speed of sound calculations:',
      formula: 'v = 2d / t  (for echoes)  |  v = fλ',
    },
    examples: [
      {
        question: 'A person shouts near a cliff and hears an echo 1.5 s later. If the speed of sound is 340 m/s, calculate the distance to the cliff.',
        steps: ['Time for echo = 1.5 s', 'Speed = 340 m/s', 'Distance = speed × time / 2 (echo travels there and back)', 'd = 340 × 1.5 / 2 = 255 m'],
        answer: 'Distance = 255 m',
      },
      {
        question: 'A sound wave has a frequency of 256 Hz and a wavelength of 1.33 m. Calculate the speed of sound.',
        steps: ['f = 256 Hz', 'λ = 1.33 m', 'v = f × λ = 256 × 1.33 = 340.5 m/s'],
        answer: 'v ≈ 340 m/s',
      },
      {
        question: 'Explain why sound cannot travel through a vacuum.',
        steps: [
          'Sound is a mechanical wave — it needs particles to vibrate and transfer energy.',
          'A vacuum contains no particles (no medium).',
          'Without particles, there is nothing to carry the sound wave.',
        ],
        answer: 'Sound cannot travel through a vacuum because there are no particles to vibrate and transfer the wave.',
      },
    ],
    practice: [
      'Describe how sound is produced and explain why it is a longitudinal wave.',
      'State the approximate range of audible frequencies for humans.',
      'A student hears an echo from a cliff 0.8 s after shouting. If the speed of sound is 340 m/s, calculate the distance to the cliff.',
      'Explain the difference between pitch, loudness, and quality of a sound.',
      'Why does sound travel faster in water than in air?',
    ],
  },
  {
    id: 'electromagnetic-waves',
    eyebrow: 'Chapter 9.3',
    title: 'Electromagnetic Waves',
    heading: 'Electromagnetic Waves — The Spectrum',
    intro:
      '**Electromagnetic (EM) waves** are transverse waves that consist of oscillating electric and magnetic fields. Unlike mechanical waves, they do not need a medium to travel through.',
    intro2:
      'All EM waves travel at the speed of light in a vacuum (3 × 10⁸ m/s). They differ in wavelength and frequency, which determines their properties and applications.',
    introMore: [
      '**Order of the EM spectrum (increasing frequency, decreasing wavelength):** radio waves → microwaves → infrared → visible light → ultraviolet → X-rays → gamma rays.',
      'All EM waves travel at the same speed in a vacuum and do not need a medium.',
      '**Uses:** radio (communication), microwaves (cooking, communication), infrared (remote sensing, heating), visible light (sight), UV (sterilisation), X-rays (medical imaging), gamma rays (cancer treatment).',
      'They differ in wavelength, frequency, and energy — shorter wavelengths have higher energy.',
    ],
    definition:
      '**Electromagnetic waves** are transverse waves that consist of oscillating electric and magnetic fields. They can travel through a vacuum and all travel at the speed of light.\n\n' +
      'The **electromagnetic spectrum** is the full range of EM waves, ordered by wavelength or frequency.',
    method: {
      title: 'The Electromagnetic Spectrum — Order and Uses',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Radio waves', text: 'Longest wavelength, lowest frequency. Uses: communication, broadcasting.' },
        { step: 2, formula: 'Microwaves', text: 'Used for cooking and satellite communication.' },
        { step: 3, formula: 'Infrared', text: 'Used for remote sensing, heating, and thermal imaging.' },
        { step: 4, formula: 'Visible light', text: 'The part we can see — used for sight and photography.' },
        { step: 5, formula: 'Ultraviolet', text: 'Used for sterilisation and detecting forged currency.' },
        { step: 6, formula: 'X-rays', text: 'Used in medical imaging (bone scans) and security.' },
        { step: 7, formula: 'Gamma rays', text: 'Shortest wavelength, highest frequency. Used in cancer treatment and sterilisation.' },
      ],
    },
    method2: {
      title: 'EM Waves — Key Facts',
      kind: 'rules',
      rules: [
        { rule: 'All EM waves travel at 3 × 10⁸ m/s in a vacuum.', example: 'Speed of light is constant.' },
        { rule: 'They do not need a medium.', example: 'Light from the Sun reaches Earth through a vacuum.' },
        { rule: 'They are transverse waves.', example: 'Electric and magnetic fields oscillate at right angles.' },
        { rule: 'Different wavelengths have different uses.', example: 'Radio waves for communication, X-rays for imaging.' },
        { rule: 'Higher frequency = shorter wavelength = higher energy.', example: 'Gamma rays have the most energy.' },
      ],
    },
    keyFormula: {
      label: 'For all electromagnetic waves:',
      formula: 'c = fλ  (where c = 3 × 10⁸ m/s in a vacuum)',
    },
    examples: [
      {
        question: 'An electromagnetic wave has a frequency of 100 MHz. Calculate its wavelength. (c = 3 × 10⁸ m/s)',
        steps: ['f = 100 MHz = 100 × 10⁶ Hz = 10⁸ Hz', 'c = 3 × 10⁸ m/s', 'λ = c / f = 3 × 10⁸ / 10⁸ = 3 m'],
        answer: 'λ = 3 m (radio wave)',
      },
      {
        question: 'Place the following EM waves in order of increasing frequency: X-rays, infrared, microwaves, visible light, gamma rays.',
        steps: ['Increasing frequency means from longest wavelength to shortest.', 'Order: microwaves → infrared → visible light → X-rays → gamma rays'],
        answer: 'Microwaves → Infrared → Visible → X-rays → Gamma rays',
      },
      {
        question: 'Why can electromagnetic waves travel through a vacuum but sound waves cannot?',
        steps: [
          'EM waves are electric and magnetic field oscillations — they do not need particles.',
          'Sound waves are mechanical — they need a medium (particles) to travel through.',
          'A vacuum has no particles, so sound cannot travel through it.',
        ],
        answer: 'EM waves are not mechanical; they do not need a medium, unlike sound waves.',
      },
    ],
    practice: [
      'List the regions of the electromagnetic spectrum in order of increasing wavelength.',
      'State three similarities and three differences between electromagnetic waves.',
      'Give one use for each of the following: radio waves, infrared, X-rays, gamma rays.',
      'Why are X-rays used in medicine?',
      'An electromagnetic wave has a wavelength of 0.1 m. Calculate its frequency. (c = 3 × 10⁸ m/s)',
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
    if (section.id === 'mechanical-waves') {
      return <WaveTypesDiagram />;
    }
    if (section.id === 'electromagnetic-waves') {
      return <ElectromagneticSpectrumDiagram />;
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

export const Waves: React.FC = () => {
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
              TOPIC 9
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Waves
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Waves are everywhere — from the sound we hear to the light we see. In this chapter,
            you'll learn about mechanical waves, sound waves, and electromagnetic waves. You'll
            discover how waves transfer energy, how to calculate wave properties, and how
            different types of waves are used in communication, medicine, and everyday life.
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

export default Waves;