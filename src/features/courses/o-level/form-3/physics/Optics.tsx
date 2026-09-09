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
  type: 'image' | 'reflection' | 'refraction' | 'lens' | 'dispersion';
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
  OPTICS DIAGRAMS (SVG)
  ======================================================================== */

/* ---- Reflection Diagram ---- */
const ReflectionDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Reflection of Light</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 300 200" className="h-auto w-full max-w-xs">
        {/* Mirror line */}
        <line x1="150" y1="10" x2="150" y2="180" stroke="#475569" strokeWidth="3" strokeDasharray="6" />
        <rect x="145" y="10" width="10" height="170" fill="#94a3b8" opacity="0.2" />
        {/* Normal (dashed) */}
        <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,5" />
        {/* Incident ray */}
        <line x1="30" y1="40" x2="150" y2="100" stroke="#2563eb" strokeWidth="2.5" />
        {/* Reflected ray */}
        <line x1="150" y1="100" x2="270" y2="160" stroke="#dc2626" strokeWidth="2.5" />
        {/* Normal arrow head for angle i */}
        <circle cx="150" cy="100" r="3" fill="#475569" />
        {/* Angle arcs */}
        <path d="M150,100 L130,80 A28,28 0 0,1 150,75 Z" fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="1" />
        <path d="M150,100 L170,120 A28,28 0 0,1 150,125 Z" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="1" />
        <text x="118" y="82" fontSize="14" fontWeight="bold" fill="#2563eb">i</text>
        <text x="172" y="128" fontSize="14" fontWeight="bold" fill="#dc2626">r</text>
        <text x="35" y="32" fontSize="12" fill="#2563eb">Incident ray</text>
        <text x="200" y="170" fontSize="12" fill="#dc2626">Reflected ray</text>
        <text x="155" y="190" fontSize="12" fill="#475569">Mirror</text>
        <text x="155" y="12" fontSize="12" fill="#94a3b8">Normal</text>
        {/* Label: i = r */}
        <text x="120" y="150" fontSize="14" fontWeight="bold" fill="#475569">i = r</text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      The angle of incidence (i) equals the angle of reflection (r). The incident ray, reflected ray, and normal all lie in the same plane.
    </p>
  </div>
);

/* ---- Refraction Diagram ---- */
const RefractionDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Refraction of Light</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 320 220" className="h-auto w-full max-w-xs">
        {/* Air region */}
        <rect x="0" y="0" width="320" height="100" fill="#e0f2fe" opacity="0.3" />
        <text x="10" y="20" fontSize="12" fill="#0284c7">Air (less dense)</text>
        {/* Glass/block region */}
        <rect x="0" y="100" width="320" height="120" fill="#fef9c3" opacity="0.3" />
        <text x="10" y="130" fontSize="12" fill="#ca8a04">Glass (denser)</text>
        {/* Interface line */}
        <line x1="0" y1="100" x2="320" y2="100" stroke="#475569" strokeWidth="2" />
        {/* Normal */}
        <line x1="160" y1="0" x2="160" y2="220" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,5" />
        {/* Incident ray (in air) */}
        <line x1="30" y1="30" x2="160" y2="100" stroke="#2563eb" strokeWidth="2.5" />
        {/* Refracted ray (in glass) - bends towards normal */}
        <line x1="160" y1="100" x2="250" y2="170" stroke="#dc2626" strokeWidth="2.5" />
        {/* Angle arcs */}
        <path d="M160,100 L135,80 A28,28 0 0,1 160,75 Z" fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="1" />
        <path d="M160,100 L175,115 A22,22 0 0,1 160,120 Z" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="1" />
        <text x="128" y="82" fontSize="14" fontWeight="bold" fill="#2563eb">i</text>
        <text x="176" y="118" fontSize="14" fontWeight="bold" fill="#dc2626">r</text>
        <text x="35" y="22" fontSize="12" fill="#2563eb">Incident ray</text>
        <text x="200" y="180" fontSize="12" fill="#dc2626">Refracted ray</text>
        <text x="165" y="210" fontSize="12" fill="#94a3b8">Normal</text>
        {/* Label */}
        <text x="90" y="190" fontSize="12" fill="#475569">Light bends towards the normal</text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      Light bends towards the normal when entering a denser medium (glass), and away from the normal when entering a less dense medium (air).
    </p>
  </div>
);

/* ---- Total Internal Reflection Diagram ---- */
const TotalInternalReflectionDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Total Internal Reflection</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 300 200" className="h-auto w-full max-w-xs">
        {/* Glass block */}
        <rect x="30" y="40" width="240" height="120" fill="#fef9c3" opacity="0.4" stroke="#ca8a04" strokeWidth="1" />
        <text x="50" y="60" fontSize="10" fill="#ca8a04">Glass (denser)</text>
        {/* Air region */}
        <text x="50" y="20" fontSize="10" fill="#0284c7">Air</text>
        {/* Interface line */}
        <line x1="30" y1="40" x2="270" y2="40" stroke="#475569" strokeWidth="1.5" strokeDasharray="4" />
        {/* Normal */}
        <line x1="150" y1="40" x2="150" y2="160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
        {/* Incident ray (from glass to air) - angle greater than critical */}
        <line x1="100" y1="160" x2="150" y2="40" stroke="#2563eb" strokeWidth="2" />
        {/* Refracted ray would be at 90° (along interface) if at critical angle - here we show total internal reflection (no refracted ray, only reflected) */}
        {/* Reflected ray */}
        <line x1="150" y1="40" x2="200" y2="100" stroke="#dc2626" strokeWidth="2" />
        {/* Angle arc for incidence */}
        <path d="M150,40 L140,60 A22,22 0 0,1 150,65 Z" fill="rgba(37,99,235,0.15)" stroke="#2563eb" strokeWidth="1" />
        <text x="132" y="56" fontSize="12" fontWeight="bold" fill="#2563eb">i</text>
        {/* Angle arc for reflection */}
        <path d="M150,40 L160,60 A22,22 0 0,1 150,65 Z" fill="rgba(220,38,38,0.15)" stroke="#dc2626" strokeWidth="1" />
        <text x="168" y="56" fontSize="12" fontWeight="bold" fill="#dc2626">r</text>
        {/* Labels */}
        <text x="105" y="172" fontSize="12" fill="#2563eb">Incident ray</text>
        <text x="180" y="110" fontSize="12" fill="#dc2626">Reflected ray</text>
        <text x="120" y="30" fontSize="12" fill="#94a3b8">Interface</text>
        <text x="130" y="190" fontSize="12" fill="#475569">i &gt; c → total internal reflection</text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      When the angle of incidence exceeds the critical angle, all light is reflected back into the denser medium — total internal reflection.
    </p>
  </div>
);

/* ---- Lens Diagrams ---- */
const LensDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Converging and Diverging Lenses</h4>
    <div className="grid grid-cols-1 gap-4 rounded-lg border border-emerald-100 bg-white p-4 sm:grid-cols-2">
      <div>
        <p className="text-center text-sm font-bold text-blue-700">Converging (Convex) Lens</p>
        <svg viewBox="0 0 200 100" className="h-auto w-full">
          <path d="M30,50 Q100,0 170,50 Q100,100 30,50" fill="none" stroke="#2563eb" strokeWidth="2.5" />
          <line x1="30" y1="50" x2="170" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
          <line x1="30" y1="50" x2="100" y2="10" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowRed)" />
          <line x1="30" y1="50" x2="100" y2="90" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowRed)" />
          <circle cx="100" cy="50" r="3" fill="#475569" />
          <text x="100" y="8" textAnchor="middle" fontSize="10" fill="#dc2626">Parallel rays</text>
          <text x="100" y="98" textAnchor="middle" fontSize="10" fill="#dc2626">converge at focus</text>
          <defs>
            <marker id="arrowRed" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#dc2626" />
            </marker>
          </defs>
        </svg>
      </div>
      <div>
        <p className="text-center text-sm font-bold text-amber-700">Diverging (Concave) Lens</p>
        <svg viewBox="0 0 200 100" className="h-auto w-full">
          <path d="M30,50 Q100,100 170,50 Q100,0 30,50" fill="none" stroke="#d97706" strokeWidth="2.5" />
          <line x1="30" y1="50" x2="170" y2="50" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
          <line x1="30" y1="50" x2="100" y2="10" stroke="#dc2626" strokeWidth="2" />
          <line x1="30" y1="50" x2="100" y2="90" stroke="#dc2626" strokeWidth="2" />
          <line x1="100" y1="10" x2="160" y2="30" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowRed2)" strokeDasharray="4" />
          <line x1="100" y1="90" x2="160" y2="70" stroke="#dc2626" strokeWidth="2" markerEnd="url(#arrowRed2)" strokeDasharray="4" />
          <text x="100" y="8" textAnchor="middle" fontSize="10" fill="#dc2626">Parallel rays</text>
          <text x="100" y="98" textAnchor="middle" fontSize="10" fill="#dc2626">diverge as if from focus</text>
          <defs>
            <marker id="arrowRed2" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10" fill="#dc2626" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  </div>
);

/* ---- Dispersion Diagram ---- */
const DispersionDiagram: React.FC = () => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Dispersion of White Light</h4>
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-4">
      <svg viewBox="0 0 300 200" className="h-auto w-full max-w-xs">
        {/* Prism */}
        <polygon points="150,40 80,180 220,180" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2" />
        <text x="150" y="140" textAnchor="middle" fontSize="12" fill="#ca8a04">Prism</text>
        {/* Incident white light ray */}
        <line x1="30" y1="80" x2="140" y2="95" stroke="#475569" strokeWidth="3" />
        <text x="40" y="70" fontSize="12" fill="#475569">White light</text>
        {/* Spectrum */}
        <line x1="150" y1="100" x2="210" y2="40" stroke="#dc2626" strokeWidth="3" /> {/* red */}
        <line x1="150" y1="100" x2="220" y2="55" stroke="#f97316" strokeWidth="3" /> {/* orange */}
        <line x1="150" y1="100" x2="230" y2="70" stroke="#eab308" strokeWidth="3" /> {/* yellow */}
        <line x1="150" y1="100" x2="235" y2="85" stroke="#22c55e" strokeWidth="3" /> {/* green */}
        <line x1="150" y1="100" x2="230" y2="100" stroke="#3b82f6" strokeWidth="3" /> {/* blue */}
        <line x1="150" y1="100" x2="220" y2="115" stroke="#8b5cf6" strokeWidth="3" /> {/* indigo */}
        <line x1="150" y1="100" x2="210" y2="130" stroke="#a855f7" strokeWidth="3" /> {/* violet */}
        {/* Labels */}
        <text x="250" y="40" fontSize="10" fill="#dc2626">Red</text>
        <text x="260" y="70" fontSize="10" fill="#eab308">Yellow</text>
        <text x="250" y="130" fontSize="10" fill="#a855f7">Violet</text>
        <text x="180" y="180" fontSize="12" fill="#475569">Spectrum (ROYGBIV)</text>
      </svg>
    </div>
    <p className="mt-3 text-center text-sm italic text-slate-500">
      White light splits into its component colours (red to violet) because each colour is refracted by a different amount.
    </p>
  </div>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'reflection',
    eyebrow: 'Chapter 10.1',
    title: 'Reflection of Light',
    heading: 'Reflection of Light — Laws and Plane Mirrors',
    intro:
      '**Reflection** occurs when light bounces off a surface. The laws of reflection govern how light behaves when it strikes a smooth, shiny surface like a mirror.',
    intro2:
      'The **laws of reflection** state: (1) The angle of incidence equals the angle of reflection (i = r). (2) The incident ray, reflected ray, and normal all lie in the same plane.',
    introMore: [
      'An image formed by a plane mirror is: **virtual** (cannot be projected), **same size** as the object, **laterally inverted** (left–right reversed), and **as far behind the mirror** as the object is in front.',
      'Ray diagrams can be used to construct the image and measure distances.',
    ],
    definition:
      '**Reflection** is the bouncing of light rays off a surface.\n\n' +
      'The **angle of incidence** is the angle between the incident ray and the normal. The **angle of reflection** is the angle between the reflected ray and the normal. The law states i = r.',
    method: {
      title: 'Laws of Reflection',
      kind: 'rules',
      rules: [
        { rule: 'Angle of incidence = Angle of reflection', example: 'i = r' },
        { rule: 'The incident ray, reflected ray, and normal are in the same plane.', example: 'They all lie on the same flat surface.' },
        { rule: 'The normal is perpendicular to the reflecting surface.', example: 'It is drawn at 90° to the mirror.' },
      ],
    },
    keyFormula: {
      label: 'Law of Reflection:',
      formula: 'i = r',
    },
    examples: [
      {
        question: 'A ray of light strikes a plane mirror at an angle of 30° to the normal. What is the angle of reflection?',
        steps: ['According to the law of reflection, the angle of incidence equals the angle of reflection.', 'i = 30°, so r = 30°.'],
        answer: 'r = 30°',
      },
      {
        question: 'An object is placed 20 cm in front of a plane mirror. How far behind the mirror is the image?',
        steps: ['For a plane mirror, the image distance equals the object distance.', 'Object distance = 20 cm, so image distance = 20 cm behind the mirror.'],
        answer: 'Image is 20 cm behind the mirror.',
      },
      {
        question: 'Describe the characteristics of the image formed by a plane mirror.',
        steps: ['The image is virtual (cannot be projected).', 'It is the same size as the object.', 'It is laterally inverted (left–right reversed).', 'It is as far behind the mirror as the object is in front.'],
        answer: 'Virtual, same size, laterally inverted, same distance behind as object in front.',
      },
    ],
    practice: [
      'State the two laws of reflection.',
      'A ray of light hits a plane mirror with an angle of incidence of 45°. What is the angle of reflection?',
      'Explain why the image in a plane mirror is virtual.',
      'An object is 15 cm from a plane mirror. How far from the mirror is the image?',
      'Draw a ray diagram to show the formation of an image in a plane mirror.',
    ],
  },
  {
    id: 'refraction',
    eyebrow: 'Chapter 10.2',
    title: 'Refraction of Light',
    heading: 'Refraction — Bending Light',
    intro:
      '**Refraction** is the bending of light as it passes from one medium to another, caused by a change in speed. When light enters a denser medium, it bends towards the normal; when it enters a less dense medium, it bends away from the normal.',
    intro2:
      'The amount of bending is described by the **refractive index (n)** of the material. Snell\'s Law relates the angles of incidence and refraction: sin i / sin r = n.',
    introMore: [
      '**Refractive index** is a measure of how much a medium bends light. Higher n means more bending.',
      '**Critical angle** is the angle of incidence (in the denser medium) that produces an angle of refraction of 90° in the less dense medium.',
      'If the angle of incidence exceeds the critical angle, **total internal reflection** occurs — all light is reflected back into the denser medium.',
      'Applications: fibre optics (communication), prisms (binoculars, periscopes), mirages.',
    ],
    definition:
      '**Refraction** is the change in direction of a light ray as it passes obliquely from one transparent medium to another due to a change in speed.\n\n' +
      '**Snell\'s Law** states: n = sin i / sin r, where i is the angle of incidence and r is the angle of refraction.',
    method: {
      title: 'Key Refraction Concepts',
      kind: 'rules',
      rules: [
        { rule: 'Light bends towards the normal when entering a denser medium.', example: 'Air → glass (n increases).' },
        { rule: 'Light bends away from the normal when entering a less dense medium.', example: 'Glass → air.' },
        { rule: 'The refractive index n = sin i / sin r (Snell\'s Law).', example: 'For air to glass, n ≈ 1.5.' },
        { rule: 'Critical angle (c) occurs when r = 90°: sin c = 1/n.', example: 'For glass (n=1.5), c ≈ 42°.' },
        { rule: 'Total internal reflection occurs when i > c.', example: 'Used in fibre optics.' },
      ],
    },
    keyFormula: {
      label: 'Snell\'s Law:',
      formula: 'n = sin i / sin r',
    },
    examples: [
      {
        question: 'A ray of light enters a glass block from air. If the angle of incidence is 45° and the angle of refraction is 28°, calculate the refractive index of the glass.',
        steps: ['i = 45°', 'r = 28°', 'n = sin i / sin r = sin45° / sin28° = 0.707 / 0.469 ≈ 1.51'],
        answer: 'n ≈ 1.51',
      },
      {
        question: 'The critical angle for a glass-air boundary is 42°. What is the refractive index of the glass?',
        steps: ['sin c = 1/n', 'n = 1 / sin c = 1 / sin42° = 1 / 0.669 = 1.49'],
        answer: 'n ≈ 1.49',
      },
      {
        question: 'Explain why a straw in a glass of water appears bent.',
        steps: ['Light from the straw travels from water (denser) to air (less dense).', 'The light bends away from the normal at the water-air interface.', 'Our eyes perceive the light as coming from a straight line, giving the illusion that the straw is bent.'],
        answer: 'Refraction of light at the water-air surface causes the straw to appear bent.',
      },
    ],
    practice: [
      'State Snell\'s Law and define refractive index.',
      'A ray of light passes from air into water with an angle of incidence of 50°. If the refractive index of water is 1.33, calculate the angle of refraction.',
      'What is the critical angle for a water-air interface? (n_water = 1.33)',
      'Explain total internal reflection and give an application.',
      'Why do objects under water appear shallower than they really are?',
    ],
  },
  {
    id: 'lenses',
    eyebrow: 'Chapter 10.3',
    title: 'Lenses',
    heading: 'Lenses — Converging and Diverging',
    intro:
      'A **lens** is a transparent optical device that refracts light to form an image. There are two main types: **converging (convex)** lenses and **diverging (concave)** lenses.',
    intro2:
      'A converging lens brings parallel rays of light together at a focal point. A diverging lens spreads parallel rays apart.',
    introMore: [
      '**Focal length** is the distance from the lens to the focal point.',
      '**Magnification** (m) = image height / object height = image distance / object distance (v/u).',
      'A converging lens can form a **real image** (inverted) when the object is beyond the focal point, or a **virtual image** (upright, magnified) when the object is within the focal length (magnifying glass).',
      'Lenses are used to correct vision: **short sight (myopia)** is corrected with a diverging lens; **long sight (hypermetropia)** is corrected with a converging lens.',
    ],
    definition:
      'A **converging (convex) lens** is thicker at the centre than at the edges and brings parallel light to a focus.\n\n' +
      'A **diverging (concave) lens** is thinner at the centre than at the edges and spreads parallel light apart.',
    method: {
      title: 'Lens Properties',
      kind: 'rules',
      rules: [
        { rule: 'Converging lens: brings parallel rays to a focal point.', example: 'Magnifying glass, camera, projector.' },
        { rule: 'Diverging lens: spreads parallel rays as if from a virtual focus.', example: 'Corrective lens for myopia.' },
        { rule: 'Magnification m = v/u = hi/ho.', example: 'If v > u, image is enlarged.' },
        { rule: 'Real images are inverted; virtual images are upright.', example: 'Projector (real), magnifying glass (virtual).' },
        { rule: 'Short sight: diverging lens; Long sight: converging lens.', example: 'Concave lens for myopia, convex lens for hypermetropia.' },
      ],
    },
    keyFormula: {
      label: 'Magnification:',
      formula: 'm = v / u = h_i / h_o',
    },
    examples: [
      {
        question: 'A converging lens has a focal length of 10 cm. An object is placed 30 cm from the lens. Describe the image formed.',
        steps: ['Object distance u = 30 cm (beyond focal length).', 'A real, inverted image will be formed on the other side of the lens.', 'Since u > f, it forms a real image.'],
        answer: 'Real, inverted image (could be used in a camera or projector).',
      },
      {
        question: 'An object is placed 5 cm from a converging lens of focal length 10 cm. What type of image is formed?',
        steps: ['Object distance u = 5 cm, which is less than focal length (10 cm).', 'The lens acts as a magnifying glass.', 'Image is virtual, upright, magnified.'],
        answer: 'Virtual, upright, magnified (magnifying glass).',
      },
      {
        question: 'What type of lens is used to correct short sight (myopia)? Explain.',
        steps: ['Short sight means the eye focuses light in front of the retina.', 'A diverging (concave) lens spreads light before it enters the eye, moving the focus back onto the retina.'],
        answer: 'A diverging lens is used to correct myopia.',
      },
    ],
    practice: [
      'Define focal length and magnification.',
      'A converging lens is used as a magnifying glass. Describe the position of the object relative to the focal point.',
      'What is the difference between a real and a virtual image?',
      'Explain why a diverging lens is used to correct short sight.',
      'Draw a ray diagram to show the formation of a virtual image by a converging lens acting as a magnifying glass.',
    ],
  },
  {
    id: 'dispersion',
    eyebrow: 'Chapter 10.4',
    title: 'Dispersion of Light',
    heading: 'Dispersion — Splitting White Light',
    intro:
      '**Dispersion** is the splitting of white light into its component colours when it passes through a prism. This happens because each colour (wavelength) is refracted by a different amount.',
    intro2:
      'The order of colours in the spectrum is **red, orange, yellow, green, blue, indigo, violet** (ROYGBIV). Red is refracted the least, violet the most.',
    introMore: [
      'White light is a mixture of all colours of the visible spectrum.',
      'Dispersion occurs because the refractive index of a material depends on the wavelength of light.',
      'This phenomenon explains rainbows, where water droplets act as tiny prisms.',
    ],
    definition:
      '**Dispersion** is the separation of white light into its constituent colours (spectrum) when it is refracted by a prism.',
    method: {
      title: 'Dispersion of Light',
      kind: 'rules',
      rules: [
        { rule: 'White light is a mixture of colours.', example: 'Red, orange, yellow, green, blue, indigo, violet.' },
        { rule: 'Each colour has a different wavelength.', example: 'Red has the longest wavelength, violet the shortest.' },
        { rule: 'Different wavelengths are refracted by different amounts.', example: 'Violet is refracted most, red least.' },
        { rule: 'Dispersion produces the spectrum.', example: 'Observed in rainbows and prism experiments.' },
      ],
    },
    keyFormula: {
      label: 'Colour order of the spectrum:',
      formula: 'Red → Orange → Yellow → Green → Blue → Indigo → Violet (ROYGBIV)',
    },
    examples: [
      {
        question: 'Explain why a prism splits white light into a spectrum.',
        steps: ['White light consists of many colours with different wavelengths.', 'When light enters the prism, each colour is refracted (bent) by a different amount due to its wavelength.', 'Violet light is refracted most, red least, so the colours spread out into a spectrum.'],
        answer: 'Different wavelengths are refracted by different amounts, causing the colours to separate.',
      },
      {
        question: 'Why are rainbows circular and where do they appear?',
        steps: ['Rainbows are caused by dispersion of sunlight by water droplets in the air.', 'Each droplet acts as a tiny prism, splitting light and reflecting it back.', 'The circular shape is due to the geometry of light refraction and reflection in droplets.'],
        answer: 'Rainbows are caused by dispersion and reflection of sunlight by water droplets.',
      },
    ],
    practice: [
      'Define dispersion of light.',
      'List the colours of the visible spectrum in order of increasing wavelength.',
      'Why is violet light refracted more than red light in a prism?',
      'Explain how a rainbow is formed.',
      'Describe an experiment to demonstrate the dispersion of white light using a prism.',
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
    if (section.id === 'reflection') {
      return <ReflectionDiagram />;
    }
    if (section.id === 'refraction') {
      return (
        <>
          <RefractionDiagram />
          <TotalInternalReflectionDiagram />
        </>
      );
    }
    if (section.id === 'lenses') {
      return <LensDiagram />;
    }
    if (section.id === 'dispersion') {
      return <DispersionDiagram />;
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

export const Optics: React.FC = () => {
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
              TOPIC 10
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Optics
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Optics is the study of light and its behaviour. In this chapter, you will learn about
            reflection, refraction, lenses, and dispersion. You'll discover how mirrors form images,
            how light bends when passing through different materials, how lenses work in cameras and
            magnifying glasses, and why a prism splits white light into a spectrum of colours.
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

export default Optics;