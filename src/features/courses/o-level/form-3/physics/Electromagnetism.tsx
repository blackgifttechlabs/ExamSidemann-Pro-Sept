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
  type: 'image' | 'field' | 'motor' | 'generator' | 'transformer';
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
  ELECTROMAGNETISM DIAGRAMS (SVG)
  ======================================================================== */

/* ---- Right-Hand Grip Rule ---- */
const RightHandGripDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Right-Hand Grip Rule</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Straight Conductor</p>
        <svg viewBox="0 0 180 140" className="mx-auto h-auto w-full max-w-[180px]">
          <circle cx="90" cy="70" r="30" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          <circle cx="90" cy="70" r="20" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="90" cy="70" r="40" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          <line x1="90" y1="70" x2="90" y2="0" stroke="#475569" strokeWidth="3" />
          <line x1="90" y1="70" x2="90" y2="140" stroke="#475569" strokeWidth="3" />
          <circle cx="90" cy="70" r="6" fill="#dc2626" />
          <text x="90" y="140" textAnchor="middle" fontSize="9" fill="#475569">Current ↑</text>
          <text x="90" y="12" textAnchor="middle" fontSize="9" fill="#475569">Field direction</text>
          <text x="10" y="75" fontSize="8" fill="#8b5cf6">↺</text>
          <text x="160" y="75" fontSize="8" fill="#8b5cf6">↻</text>
        </svg>
        <p className="text-center text-xs text-slate-600">Concentric circles around wire</p>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Solenoid</p>
        <svg viewBox="0 0 180 140" className="mx-auto h-auto w-full max-w-[180px]">
          <rect x="30" y="40" width="120" height="30" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" rx="4" />
          <text x="90" y="58" textAnchor="middle" fontSize="10" fill="#ca8a04">Iron core</text>
          <path d="M30,45 Q40,35 50,45 Q60,35 70,45 Q80,35 90,45 Q100,35 110,45 Q120,35 130,45 Q140,35 150,45" fill="none" stroke="#475569" strokeWidth="2" />
          <path d="M30,65 Q40,75 50,65 Q60,75 70,65 Q80,75 90,65 Q100,75 110,65 Q120,75 130,65 Q140,75 150,65" fill="none" stroke="#475569" strokeWidth="2" />
          <path d="M30,45 L30,65" stroke="#475569" strokeWidth="1.5" />
          <path d="M150,45 L150,65" stroke="#475569" strokeWidth="1.5" />
          <text x="20" y="35" fontSize="9" fill="#dc2626">N</text>
          <text x="160" y="35" fontSize="9" fill="#2563eb">S</text>
          <rect x="170" y="80" width="20" height="12" fill="#94a3b8" rx="2" />
          <text x="180" y="88" textAnchor="middle" fontSize="7" fill="white">Cell</text>
          <line x1="160" y1="55" x2="170" y2="86" stroke="#475569" strokeWidth="1" />
          <line x1="170" y1="86" x2="170" y2="80" stroke="#475569" strokeWidth="1" />
          <text x="90" y="120" textAnchor="middle" fontSize="10" fill="#475569">Like a bar magnet</text>
        </svg>
        <p className="text-center text-xs text-slate-600">Solenoid field is like a bar magnet</p>
      </div>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Right-Hand Grip Rule: thumb points in direction of current; fingers curl in direction of field.
    </p>
  </div>
);

/* ---- Fleming's Left Hand Rule ---- */
const FlemingsLeftHandDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Fleming's Left Hand Rule</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 320 200" className="h-auto w-full max-w-sm">
        {/* Hand outline */}
        <path d="M80,180 L80,100 L60,60 L80,40 L140,40 L160,60 L160,100 L140,180 Z" fill="none" stroke="#475569" strokeWidth="2" />
        <text x="70" y="130" fontSize="10" fill="#475569">ThuMb</text>
        <text x="60" y="160" fontSize="10" fill="#475569">= Motion</text>
        <text x="100" y="50" fontSize="10" fill="#475569">First finger = Field</text>
        <text x="100" y="70" fontSize="10" fill="#475569">seCond finger = Current</text>
        <line x1="80" y1="50" x2="80" y2="100" stroke="#8b5cf6" strokeWidth="3" />
        <text x="60" y="45" fontSize="8" fill="#8b5cf6">Field</text>
        <line x1="80" y1="100" x2="140" y2="40" stroke="#dc2626" strokeWidth="3" />
        <text x="130" y="30" fontSize="8" fill="#dc2626">Current</text>
        <line x1="80" y1="100" x2="140" y2="100" stroke="#2563eb" strokeWidth="3" />
        <text x="145" y="105" fontSize="8" fill="#2563eb">Force</text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      thuMb = Motion, First finger = Field, seCond finger = Current (remember "FBI" — Force, B-field, I-current)
    </p>
  </div>
);

/* ---- D.C. Motor Diagram ---- */
const DCMotorDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">D.C. Motor</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 280 180" className="h-auto w-full max-w-sm">
        {/* Magnetic field */}
        <text x="20" y="40" fontSize="10" fill="#dc2626">N</text>
        <text x="250" y="40" fontSize="10" fill="#2563eb">S</text>
        <path d="M30,50 L30,150" stroke="#dc2626" strokeWidth="2" strokeDasharray="4" />
        <path d="M240,50 L240,150" stroke="#2563eb" strokeWidth="2" strokeDasharray="4" />
        <text x="10" y="100" fontSize="8" fill="#dc2626">Field</text>
        <text x="250" y="100" fontSize="8" fill="#2563eb">Field</text>
        {/* Coil */}
        <rect x="70" y="60" width="130" height="10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <rect x="70" y="110" width="130" height="10" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1" rx="2" />
        <line x1="70" y1="60" x2="70" y2="110" stroke="#ca8a04" strokeWidth="2" />
        <line x1="200" y1="60" x2="200" y2="110" stroke="#ca8a04" strokeWidth="2" />
        <circle cx="135" cy="85" r="5" fill="#475569" />
        <text x="135" y="90" textAnchor="middle" fontSize="6" fill="white">A</text>
        {/* Current direction arrows */}
        <text x="50" y="80" fontSize="8" fill="#dc2626">I ↑</text>
        <text x="215" y="95" fontSize="8" fill="#dc2626">I ↓</text>
        {/* Commutator */}
        <rect x="130" y="130" width="10" height="15" fill="#94a3b8" rx="2" />
        <rect x="135" y="130" width="5" height="15" fill="#475569" rx="1" />
        <line x1="135" y1="145" x2="135" y2="160" stroke="#475569" strokeWidth="1" />
        <text x="135" y="170" textAnchor="middle" fontSize="8" fill="#475569">Commutator</text>
        {/* Labels */}
        <text x="135" y="20" textAnchor="middle" fontSize="12" fill="#475569">D.C. Motor</text>
        <text x="135" y="35" textAnchor="middle" fontSize="9" fill="#475569">Converts electrical → mechanical energy</text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      The commutator reverses the current every half-turn, keeping the coil spinning in one direction.
    </p>
  </div>
);

/* ---- Generator Diagram ---- */
const GeneratorDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">A.C. and D.C. Generators</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">A.C. Generator</p>
        <svg viewBox="0 0 160 120" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="10" y="30" width="140" height="60" fill="none" stroke="#475569" strokeWidth="1" />
          <text x="20" y="50" fontSize="8" fill="#dc2626">N</text>
          <text x="130" y="50" fontSize="8" fill="#2563eb">S</text>
          <rect x="60" y="40" width="40" height="8" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1" />
          <rect x="60" y="70" width="40" height="8" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1" />
          <line x1="60" y1="40" x2="60" y2="70" stroke="#ca8a04" strokeWidth="1" />
          <line x1="100" y1="40" x2="100" y2="70" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="80" cy="55" r="3" fill="#475569" />
          <line x1="80" y1="88" x2="80" y2="110" stroke="#475569" strokeWidth="1" />
          <text x="80" y="118" textAnchor="middle" fontSize="8" fill="#475569">Slip rings</text>
          <text x="80" y="15" textAnchor="middle" fontSize="8" fill="#475569">Produces A.C.</text>
        </svg>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-amber-700">D.C. Generator</p>
        <svg viewBox="0 0 160 120" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="10" y="30" width="140" height="60" fill="none" stroke="#475569" strokeWidth="1" />
          <text x="20" y="50" fontSize="8" fill="#dc2626">N</text>
          <text x="130" y="50" fontSize="8" fill="#2563eb">S</text>
          <rect x="60" y="40" width="40" height="8" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1" />
          <rect x="60" y="70" width="40" height="8" fill="#fcd34d" stroke="#ca8a04" strokeWidth="1" />
          <line x1="60" y1="40" x2="60" y2="70" stroke="#ca8a04" strokeWidth="1" />
          <line x1="100" y1="40" x2="100" y2="70" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="80" cy="55" r="3" fill="#475569" />
          <line x1="80" y1="88" x2="80" y2="110" stroke="#475569" strokeWidth="1" />
          <text x="80" y="118" textAnchor="middle" fontSize="8" fill="#475569">Commutator</text>
          <text x="80" y="15" textAnchor="middle" fontSize="8" fill="#475569">Produces D.C.</text>
        </svg>
      </div>
    </div>
  </div>
);

/* ---- Transformer Diagram ---- */
const TransformerDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Transformer</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 340 160" className="h-auto w-full max-w-sm">
        {/* Core */}
        <rect x="60" y="20" width="220" height="120" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" rx="4" />
        <rect x="60" y="20" width="220" height="120" fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="4" />
        <text x="170" y="80" textAnchor="middle" fontSize="10" fill="#ca8a04">Iron Core</text>
        {/* Primary coil (left) */}
        <path d="M40,50 L60,50 Q70,40 80,50 Q90,40 100,50 Q110,40 120,50 L130,50" fill="none" stroke="#475569" strokeWidth="3" />
        <path d="M40,70 L60,70 Q70,80 80,70 Q90,80 100,70 Q110,80 120,70 L130,70" fill="none" stroke="#475569" strokeWidth="3" />
        <text x="80" y="10" textAnchor="middle" fontSize="9" fill="#2563eb">Primary</text>
        <text x="80" y="140" textAnchor="middle" fontSize="8" fill="#475569">N<sub>p</sub> turns</text>
        {/* Secondary coil (right) */}
        <path d="M210,50 L220,50 Q230,40 240,50 Q250,40 260,50 Q270,40 280,50 L290,50" fill="none" stroke="#475569" strokeWidth="3" />
        <path d="M210,70 L220,70 Q230,80 240,70 Q250,80 260,70 Q270,80 280,70 L290,70" fill="none" stroke="#475569" strokeWidth="3" />
        <text x="250" y="10" textAnchor="middle" fontSize="9" fill="#dc2626">Secondary</text>
        <text x="250" y="140" textAnchor="middle" fontSize="8" fill="#475569">N<sub>s</sub> turns</text>
        {/* Labels */}
        <text x="30" y="60" fontSize="9" fill="#475569">V<sub>p</sub></text>
        <text x="300" y="60" fontSize="9" fill="#475569">V<sub>s</sub></text>
        <text x="170" y="170" textAnchor="middle" fontSize="10" fill="#475569">V<sub>p</sub> / V<sub>s</sub> = N<sub>p</sub> / N<sub>s</sub></text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      A transformer changes the voltage of an alternating current. Step-up: N<sub>s</sub> &gt; N<sub>p</sub>; Step-down: N<sub>s</sub> &lt; N<sub>p</sub>.
    </p>
  </div>
);

/* ---- Voltage-Time Graphs ---- */
const VoltageGraphsDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">A.C. vs D.C. Waveforms</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">A.C. (Alternating Current)</p>
        <svg viewBox="0 0 160 80" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="5" y="5" width="150" height="70" fill="none" stroke="#475569" strokeWidth="1" />
          <line x1="5" y1="40" x2="155" y2="40" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4" />
          <path d="M15,40 Q25,10 35,40 Q45,70 55,40 Q65,10 75,40 Q85,70 95,40 Q105,10 115,40 Q125,70 135,40 Q145,10 155,40" fill="none" stroke="#2563eb" strokeWidth="2" />
          <text x="80" y="72" textAnchor="middle" fontSize="8" fill="#475569">Reverses direction periodically</text>
        </svg>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-amber-700">D.C. (Direct Current)</p>
        <svg viewBox="0 0 160 80" className="mx-auto h-auto w-full max-w-[160px]">
          <rect x="5" y="5" width="150" height="70" fill="none" stroke="#475569" strokeWidth="1" />
          <line x1="5" y1="40" x2="155" y2="40" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="4" />
          <line x1="15" y1="15" x2="155" y2="15" stroke="#d97706" strokeWidth="2" />
          <line x1="15" y1="15" x2="15" y2="65" stroke="#d97706" strokeWidth="2" />
          <text x="80" y="72" textAnchor="middle" fontSize="8" fill="#475569">Flows in one direction only</text>
        </svg>
      </div>
    </div>
  </div>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'magnetic-effect',
    eyebrow: 'Chapter 13.1',
    title: 'Magnetic Effect of an Electric Current',
    heading: 'Magnetic Effect of an Electric Current',
    intro:
      'An electric current produces a magnetic field around the conductor. This is the fundamental principle behind electromagnets, motors, and many other devices.',
    intro2:
      'The field pattern around a straight conductor consists of concentric circles. Around a solenoid, the field is similar to that of a bar magnet.',
    introMore: [
      'A **current-carrying conductor** produces a magnetic field around it.',
      '**Field pattern around a straight wire:** concentric circles.',
      '**Field pattern around a solenoid:** similar to a bar magnet, with N and S poles.',
      '**Right-Hand Grip Rule:** thumb points in direction of current; fingers curl in direction of field.',
      'The strength of the field increases with current and decreases with distance from the conductor.',
    ],
    definition:
      'A current-carrying conductor produces a magnetic field. The field is circular around a straight wire and similar to a bar magnet around a solenoid.\n\n' +
      'The **Right-Hand Grip Rule** determines the direction of the field: thumb = current direction, fingers = field direction.',
    method: {
      title: 'Right-Hand Grip Rule',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Thumb → Current', text: 'Point your thumb in the direction of conventional current flow.' },
        { step: 2, formula: 'Fingers → Field', text: 'Curl your fingers around the conductor — they point in the direction of the magnetic field.' },
        { step: 3, formula: 'Straight wire', text: 'Field is concentric circles around the wire.' },
        { step: 4, formula: 'Solenoid', text: 'Field runs from N to S outside the solenoid, and from S to N inside.' },
      ],
    },
    method2: {
      title: 'Key Facts About Magnetic Fields',
      kind: 'rules',
      rules: [
        { rule: 'A current-carrying wire produces a magnetic field.', example: 'Detected using a plotting compass or iron filings.' },
        { rule: 'Field around a straight wire is concentric circles.', example: 'Field lines are circles centred on the wire.' },
        { rule: 'Field around a solenoid is like a bar magnet.', example: 'Has N and S poles.' },
        { rule: 'Reversing the current reverses the field direction.', example: 'Use the Right-Hand Grip Rule to predict.' },
      ],
    },
    keyFormula: {
      label: 'Right-Hand Grip Rule:',
      formula: 'Thumb = Current direction, Fingers = Field direction',
    },
    examples: [
      {
        question: 'A current flows upwards through a vertical wire. Use the Right-Hand Grip Rule to determine the direction of the magnetic field.',
        steps: [
          'Point your thumb upwards (direction of current).',
          'Curl your fingers around the wire — they curl in the direction of the field.',
          'Looking from above, the field is anticlockwise.',
        ],
        answer: 'Field is anticlockwise when viewed from above.',
      },
      {
        question: 'Describe the magnetic field pattern produced by a current-carrying solenoid.',
        steps: [
          'Inside the solenoid, the field lines are parallel and run from S to N.',
          'Outside the solenoid, the field lines run from N to S, similar to a bar magnet.',
          'The field is strong and uniform inside the solenoid.',
        ],
        answer: 'The solenoid field is like a bar magnet — uniform inside, loops outside from N to S.',
      },
    ],
    practice: [
      'Describe an experiment to show that a current-carrying conductor produces a magnetic field.',
      'What is the field pattern around a straight current-carrying wire?',
      'How does the magnetic field of a solenoid compare to that of a bar magnet?',
      'Use the Right-Hand Grip Rule to predict the field direction for a wire carrying current downwards.',
      'What happens to the magnetic field strength as you move further from a current-carrying wire?',
    ],
  },
  {
    id: 'force-on-conductor',
    eyebrow: 'Chapter 13.2',
    title: 'Force on a Current-Carrying Conductor',
    heading: 'Force on a Current-Carrying Conductor in a Magnetic Field',
    intro:
      'When a current-carrying conductor is placed in a magnetic field, it experiences a force. This is the principle behind the electric motor.',
    intro2:
      'The direction of the force is given by **Fleming\'s Left Hand Rule**: ThuMb = Motion, First finger = Field, seCond finger = Current.',
    introMore: [
      'A current-carrying conductor in a magnetic field experiences a force — the motor effect.',
      '**Fleming\'s Left Hand Rule** predicts the direction of force/motion.',
      'Factors affecting force: current strength, magnetic field strength, length of conductor in the field.',
      'Parallel currents in the same direction attract; in opposite directions repel.',
      'Applications: electric bell, relay, d.c. motor.',
      'A **d.c. motor** converts electrical energy to mechanical energy using a coil in a magnetic field with a commutator to reverse current each half-turn.',
    ],
    definition:
      'The **motor effect** is the force experienced by a current-carrying conductor in a magnetic field.\n\n' +
      '**Fleming\'s Left Hand Rule** gives the direction: thuMb = Motion, First finger = Field, seCond finger = Current.',
    method: {
      title: 'Fleming\'s Left Hand Rule',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'First finger → Field', text: 'Point your First finger in the direction of the magnetic field (N to S).' },
        { step: 2, formula: 'seCond finger → Current', text: 'Point your seCond finger in the direction of conventional current.' },
        { step: 3, formula: 'ThuMb → Motion', text: 'Your ThuMb points in the direction of the force/motion.' },
        { step: 4, formula: 'Remember: FBI', text: 'Force, B-field (magnetic field), I (current).' },
      ],
    },
    method2: {
      title: 'D.C. Motor Operation',
      kind: 'rules',
      rules: [
        { rule: 'A coil in a magnetic field experiences a turning force.', example: 'The coil rotates when current flows.' },
        { rule: 'The commutator reverses the current every half-turn.', example: 'Keeps the coil spinning in one direction.' },
        { rule: 'More current, stronger field, more coil turns = more force.', example: 'Increases motor power.' },
        { rule: 'Converts electrical energy to mechanical energy.', example: 'Used in fans, drills, cars.' },
      ],
    },
    keyFormula: {
      label: 'Motor effect:',
      formula: 'Force ∝ Current × Field Strength × Length of conductor in field',
    },
    examples: [
      {
        question: 'A current-carrying wire is placed between the poles of a magnet. The current flows from left to right and the magnetic field is from north to south. Use Fleming\'s Left Hand Rule to determine the direction of the force.',
        steps: [
          'First finger points from N to S (field direction).',
          'Second finger points from left to right (current direction).',
          'Your thumb points upwards — the force is upwards.',
        ],
        answer: 'The force is upwards.',
      },
      {
        question: 'Explain the role of the commutator in a d.c. motor.',
        steps: [
          'The commutator reverses the current in the coil every half-turn.',
          'This ensures that the force on each side of the coil always acts in the same direction.',
          'Without the commutator, the coil would oscillate back and forth instead of rotating continuously.',
        ],
        answer: 'The commutator reverses the current each half-turn, maintaining continuous rotation.',
      },
    ],
    practice: [
      'State Fleming\'s Left Hand Rule and explain each finger represents.',
      'A current-carrying conductor experiences a force in a magnetic field. What factors affect the size of this force?',
      'Describe the operation of a simple d.c. motor.',
      'Two parallel wires carry currents in the same direction. Do they attract or repel? Explain.',
      'What is the function of the commutator in a d.c. motor?',
    ],
  },
  {
    id: 'induction',
    eyebrow: 'Chapter 13.3',
    title: 'Electromagnetic Induction',
    heading: 'Electromagnetic Induction — Generating Electricity',
    intro:
      '**Electromagnetic induction** is the production of an e.m.f. (and current) using a changing magnetic field. This is the principle behind generators.',
    intro2:
      'When a conductor cuts through magnetic field lines, or when the magnetic field around a conductor changes, an e.m.f. is induced.',
    introMore: [
      'Electromagnetic induction produces an e.m.f. when there is relative motion between a conductor and a magnetic field.',
      'Factors affecting induced e.m.f.: magnet strength, speed of motion, number of coil turns, area of coil.',
      '**Lenz\'s Law:** the direction of induced current always opposes the change that produced it.',
      '**Fleming\'s Right Hand Rule** predicts the direction of induced current: thuMb = Motion, First finger = Field, seCond finger = Current.',
      'An **A.C. generator** uses slip rings to produce alternating current.',
      'A **D.C. generator** uses a commutator to produce direct current.',
      'A.C. reverses direction periodically; D.C. flows in one direction only.',
    ],
    definition:
      '**Electromagnetic induction** is the process of generating an e.m.f. (and current) in a conductor due to a changing magnetic field.\n\n' +
      '**Lenz\'s Law** states that the induced current flows in a direction that opposes the change that produced it.',
    method: {
      title: 'Fleming\'s Right Hand Rule (for Generators)',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'ThuMb → Motion', text: 'Point your ThuMb in the direction of motion of the conductor.' },
        { step: 2, formula: 'First finger → Field', text: 'Point your First finger in the direction of the magnetic field (N to S).' },
        { step: 3, formula: 'seCond finger → Current', text: 'Your seCond finger points in the direction of the induced current.' },
        { step: 4, formula: 'Use for generators', text: 'This rule is for generating current (not motors).' },
      ],
    },
    method2: {
      title: 'A.C. vs D.C. Generators',
      kind: 'rules',
      rules: [
        { rule: 'A.C. generator uses slip rings.', example: 'Produces alternating current (voltage changes sign).' },
        { rule: 'D.C. generator uses a commutator.', example: 'Produces direct current (voltage stays positive).' },
        { rule: 'A.C. waveform: sine wave.', example: 'Voltage alternates between positive and negative.' },
        { rule: 'D.C. waveform: constant positive (or negative) voltage.', example: 'Voltage does not change direction.' },
      ],
    },
    keyFormula: {
      label: 'Lenz\'s Law:',
      formula: 'Induced current opposes the change that produced it.',
    },
    examples: [
      {
        question: 'A magnet is moved towards a coil. State the direction of the induced current using Lenz\'s Law.',
        steps: [
          'The magnet approaching the coil increases the magnetic flux through the coil.',
          'Lenz\'s Law says the induced current will oppose this increase.',
          'The induced current creates a magnetic field that repels the approaching magnet.',
          'Therefore, the induced current flows to create a north pole facing the approaching magnet.',
        ],
        answer: 'The induced current flows to create a north pole facing the approaching magnet (repulsion).',
      },
      {
        question: 'State four factors that affect the magnitude of the induced e.m.f. in a generator.',
        steps: [
          'Strength of the magnet (stronger magnet → greater e.m.f.).',
          'Speed of relative motion (faster motion → greater e.m.f.).',
          'Number of turns on the coil (more turns → greater e.m.f.).',
          'Area of the coil (larger area → greater e.m.f.).',
        ],
        answer: 'Magnet strength, speed of motion, number of turns, area of coil.',
      },
    ],
    practice: [
      'Define electromagnetic induction.',
      'State Lenz\'s Law and explain what it means.',
      'What factors affect the magnitude of induced e.m.f.?',
      'Explain the difference between an A.C. generator and a D.C. generator.',
      'Use Fleming\'s Right Hand Rule to determine the direction of induced current in a given situation.',
    ],
  },
  {
    id: 'transformers',
    eyebrow: 'Chapter 13.4',
    title: 'Transformers',
    heading: 'Transformers — Changing Voltage',
    intro:
      'A **transformer** is a device that changes the voltage of an alternating current. It consists of two coils (primary and secondary) wound on a laminated iron core.',
    intro2:
      'Transformers are essential for the efficient transmission of electrical power over long distances.',
    introMore: [
      '**Step-up transformer:** N<sub>s</sub> > N<sub>p</sub> — increases voltage, decreases current.',
      '**Step-down transformer:** N<sub>s</sub> < N<sub>p</sub> — decreases voltage, increases current.',
      '**Turns ratio:** V<sub>p</sub>/V<sub>s</sub> = N<sub>p</sub>/N<sub>s</sub>.',
      'For an ideal transformer (100% efficiency): V<sub>p</sub> × I<sub>p</sub> = V<sub>s</sub> × I<sub>s</sub>.',
      'Energy losses: Joule heating in coils, eddy currents in core, magnetic flux leakage.',
      'High-voltage transmission reduces current in cables, reducing power loss (I²R heating).',
    ],
    definition:
      'A **transformer** is a device that changes the voltage of an alternating current using electromagnetic induction.\n\n' +
      'It has a primary coil, a secondary coil, and a laminated iron core that transfers energy between the coils.',
    method: {
      title: 'Transformer Calculations',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Vp/Vs = Np/Ns', text: 'Voltage ratio equals turns ratio.' },
        { step: 2, formula: 'Vp × Ip = Vs × Is', text: 'For an ideal transformer (100% efficiency).' },
        { step: 3, formula: 'Step-up: Ns > Np', text: 'Output voltage is higher than input.' },
        { step: 4, formula: 'Step-down: Ns < Np', text: 'Output voltage is lower than input.' },
      ],
    },
    method2: {
      title: 'Advantages of High-Voltage Transmission',
      kind: 'rules',
      rules: [
        { rule: 'High voltage reduces current for the same power.', example: 'P = VI, so higher V means lower I.' },
        { rule: 'Power loss in cables is I²R.', example: 'Lower current means much lower power loss.' },
        { rule: 'Thinner cables can be used.', example: 'Reduced material cost and weight.' },
        { rule: 'Transformers enable efficient long-distance transmission.', example: 'Step-up for transmission, step-down for use.' },
      ],
    },
    keyFormula: {
      label: 'Transformer equations:',
      formula: (
        <>
          V<sub>p</sub>/V<sub>s</sub> = N<sub>p</sub>/N<sub>s</sub> &nbsp;&nbsp;|&nbsp;&nbsp; V<sub>p</sub>I<sub>p</sub> = V<sub>s</sub>I<sub>s</sub>
        </>
      ),
    },
    examples: [
      {
        question: 'A transformer has 200 turns on the primary coil and 800 turns on the secondary coil. The primary voltage is 230 V. Calculate the secondary voltage.',
        steps: ['Np = 200', 'Ns = 800', 'Vp = 230 V', 'Vp/Vs = Np/Ns → 230/Vs = 200/800', 'Vs = 230 × 800 / 200 = 920 V'],
        answer: 'Vs = 920 V (step-up transformer)',
      },
      {
        question: 'A transformer has a primary voltage of 240 V and a secondary voltage of 12 V. If the primary current is 0.5 A, calculate the secondary current (assuming 100% efficiency).',
        steps: ['Vp = 240 V', 'Vs = 12 V', 'Ip = 0.5 A', 'Vp × Ip = Vs × Is → 240 × 0.5 = 12 × Is', 'Is = 120 / 12 = 10 A'],
        answer: 'Is = 10 A',
      },
      {
        question: 'Explain why electricity is transmitted at high voltage over long distances.',
        steps: [
          'Power = VI, so for a given power, higher voltage means lower current.',
          'Power loss in cables is I²R, so lower current means much less heat loss.',
          'This makes transmission more efficient and reduces the need for thick cables.',
        ],
        answer: 'High voltage reduces current, reducing I²R power losses in cables.',
      },
    ],
    practice: [
      'Explain the structure and operation of a transformer.',
      'A transformer has 500 turns on the primary and 2500 turns on the secondary. If the primary voltage is 230 V, calculate the secondary voltage.',
      'A step-down transformer reduces voltage from 11,000 V to 230 V. If the primary current is 2 A, calculate the secondary current (ideal).',
      'Why are transformers important for the national grid?',
      'State three causes of energy loss in a transformer.',
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
    if (section.id === 'magnetic-effect') {
      return <RightHandGripDiagram />;
    }
    if (section.id === 'force-on-conductor') {
      return (
        <>
          <FlemingsLeftHandDiagram />
          <DCMotorDiagram />
        </>
      );
    }
    if (section.id === 'induction') {
      return (
        <>
          <GeneratorDiagram />
          <VoltageGraphsDiagram />
        </>
      );
    }
    if (section.id === 'transformers') {
      return <TransformerDiagram />;
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

export const Electromagnetism: React.FC = () => {
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
              TOPIC 13
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Electromagnetism
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Electromagnetism links electricity and magnetism. In this chapter, you'll learn
            about the magnetic fields produced by electric currents, the forces on current-carrying
            conductors, electromagnetic induction, and transformers. You'll discover how electric
            motors, generators, and transformers work — powering the modern world.
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

export default Electromagnetism;