import { LessonDiagram, LessonImage, LessonFigure } from './components/LessonDiagram';
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
  /** When present, this fully replaces the intro/definition/diagram/method/keyFormula block for the section. */
  customBody?: ReactNode;
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
  <div className="lesson-prose-panel my-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
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
  <div className="lesson-prose-panel relative mb-6 overflow-hidden rounded-2xl border-2 border-blue-200 bg-blue-50/60 px-5 py-4 sm:px-6 sm:py-5">
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
  <div className="lesson-prose-panel rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
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
    <div className="mb-6 min-w-0 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3 sm:p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Beam Cross-Section Shapes</h4>
      <div className="grid grid-cols-2 gap-4 rounded-lg sm:grid-cols-4 border border-emerald-100 bg-white p-6">
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
    <div className="mb-6 min-w-0 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3 sm:p-4">
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
              <text x="90" y="94" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">Beam Bridge</text>
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
              <text x="90" y="94" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">Arch Bridge</text>
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
              <text x="90" y="94" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">Suspension Bridge</text>
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
              <text x="90" y="94" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#475569">Pier Bridge</text>
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
    <div className="mb-6 min-w-0 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3 sm:p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">Truss Structure — Triangles in Action</h4>
      <div className="flex justify-center rounded-lg border border-emerald-100 bg-white p-6">
        <LessonDiagram viewBox="0 0 400 200" className="h-auto w-full max-w-md" notes={["Triangles provide rigidity — they cannot change shape without changing side length"]}>
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
          <text x="115" y="170" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2563eb">Strut (Compression)</text>
          <text x="290" y="170" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#16a34a">Tie (Tension)</text>

          {/* Legend */}
          <rect x="30" y="190" width="12" height="4" fill="#dc2626" />
          <text x="48" y="194" fontSize="14" fill="#64748b">Compression</text>
          <rect x="140" y="190" width="12" height="4" fill="#2563eb" />
          <text x="158" y="194" fontSize="14" fill="#64748b">Tension</text>
          <rect x="250" y="190" width="12" height="4" fill="#475569" />
          <text x="268" y="194" fontSize="14" fill="#64748b">Member</text>
        </LessonDiagram>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        Trusses use triangles to distribute loads efficiently. Members in compression are struts; members in tension are ties.
      </p>
    </div>
  );
};

/* ========================================================================
  BEAMS — LOCAL LAYOUT HELPERS
  ======================================================================== */

const BLead: React.FC<{ children: ReactNode }> = ({ children }) => (
  <p className="relative mb-5 pl-4 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300">
    {children}
  </p>
);

const BHeading: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3 className="mb-3 mt-8 text-lg font-bold text-slate-900 sm:text-xl">{children}</h3>
);

const BDivider: React.FC = () => <hr className="my-8 border-t-2 border-dashed border-slate-200" />;

const BDiagramBox = LessonFigure;

const BNote: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="lesson-prose-panel mb-4 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
    {children}
  </div>
);

const BTermCard: React.FC<{ accent: 'blue' | 'emerald'; text: string; examples: string[] }> = ({ accent, text, examples }) => {
  const styles = accent === 'blue'
    ? { border: 'border-blue-200', bg: 'bg-blue-50/60', title: 'text-blue-900' }
    : { border: 'border-emerald-200', bg: 'bg-emerald-50/60', title: 'text-emerald-900' };
  return (
    <div className={`lesson-prose-panel mb-6 overflow-hidden rounded-2xl border-2 ${styles.border} ${styles.bg} px-5 py-4 sm:px-6 sm:py-5`}>
      <p className={`text-[1.05rem] font-semibold leading-relaxed ${styles.title}`}>{renderRich(text)}</p>
      {examples.length > 0 && (
        <ul className="mt-3 space-y-1">
          {examples.map((ex, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600">
              <span className="mt-1 shrink-0 text-slate-400">●</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const BTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="mb-6 overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-sm">
    <table className="w-full min-w-[640px] border-collapse text-left text-sm sm:text-base">
      <thead>
        <tr className="bg-slate-50/70 text-slate-900">
          {headers.map((h, i) => (
            <th key={i} scope="col" className="border-b-2 border-r border-slate-300 px-4 py-3.5 font-bold last:border-r-0">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
            {row.map((cell, j) => (
              j === 0
                ? <th key={j} scope="row" className="border-b border-r border-slate-200 px-4 py-4 text-left align-top font-semibold text-slate-900">{cell}</th>
                : <td key={j} className="border-b border-r border-slate-200 px-4 py-4 align-top leading-relaxed text-slate-700 last:border-r-0">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface BWorkedStep {
  title: string;
  given: string[];
  find: string;
  formula: string;
  substitution: string;
  calculation: string;
  answer: string;
  meaning: string;
}

const BWorkedBox: React.FC<{ index: number; example: BWorkedStep }> = ({ index, example }) => (
  <div className="lesson-prose-panel mb-5 rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 sm:p-5">
    <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">{index}</span>
      <span className="ga-ink text-base font-semibold leading-relaxed text-slate-800">{example.title}</span>
    </div>
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      <p><span className="ga-hand font-bold text-slate-500">Given: </span>{example.given.join('  ')}</p>
      <p><span className="ga-hand font-bold text-slate-500">Find: </span>{example.find}</p>
      <p><span className="ga-hand font-bold text-slate-500">Formula: </span><span className="ga-ink font-semibold text-blue-900">{example.formula}</span></p>
      <p><span className="ga-hand font-bold text-slate-500">Substitute: </span><span className="ga-ink">{example.substitution}</span></p>
      <p><span className="ga-hand font-bold text-slate-500">Calculate: </span><span className="ga-ink">{example.calculation}</span></p>
      <p><span className="ga-hand font-bold text-slate-500">Answer: </span><span className="ga-ink text-base font-bold text-emerald-700">{example.answer}</span></p>
      <p className="italic text-slate-500">{example.meaning}</p>
    </div>
  </div>
);

/* ========================================================================
  BEAMS — DIAGRAMS
  ======================================================================== */

const BendingStressDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 420 180" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg" notes={["The straight beam (dashed) bends into a curve under load"]}>
    <defs>
      <marker id="bArrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
    </defs>
    <line x1="30" y1="70" x2="390" y2="70" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
    <path d="M30 90 Q210 130 390 90" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <polygon points="20,145 40,145 30,120" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <circle cx="380" cy="135" r="9" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <line x1="205" y1="30" x2="205" y2="105" stroke="#2563eb" strokeWidth="3" markerEnd="url(#bArrowBlue)" />
    <text x="205" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Load</text>

  </LessonDiagram>
);

const TensionCompressionZonesDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 420 230" className="w-full max-w-lg" aria-label="A sagging beam has compression in its upper half and tension in its lower half" notes={['In a sagging beam, the upper fibres compress and the lower fibres stretch.']}>
    <rect x="40" y="70" width="340" height="90" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
    <path d="M40 115 H380" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
    <path d="M75 94 H140 L130 88 M140 94 L130 100 M345 94 H280 L290 88 M280 94 L290 100" fill="none" stroke="#2563eb" strokeWidth="3" />
    <path d="M140 139 H75 L85 133 M75 139 L85 145 M280 139 H345 L335 133 M345 139 L335 145" fill="none" stroke="#dc2626" strokeWidth="3" />
    <text x="210" y="43" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1d4ed8">Compression (squashed)</text>
    <text x="210" y="202" textAnchor="middle" fontSize="16" fontWeight="700" fill="#dc2626">Tension (stretched)</text>
  </LessonDiagram>
);

const NeutralAxisDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 420 160" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg" notes={["Along this line, the beam is neither stretched nor squashed — zero stress"]}>
    <rect x="40" y="40" width="340" height="80" fill="#f8fafc" stroke="#1e293b" strokeWidth="3" />
    <line x1="40" y1="80" x2="380" y2="80" stroke="#059669" strokeWidth="3" strokeDasharray="6 4" />
    <circle cx="210" cy="80" r="5" fill="#059669" />
    <text x="210" y="66" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Neutral axis</text>

  </LessonDiagram>
);

const SimplySupportedBeamDiagram: React.FC = () => (
  <svg viewBox="0 0 420 160" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ssArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
    </defs>
    <line x1="40" y1="70" x2="380" y2="70" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <polygon points="70,70 55,105 85,105" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="70" y="122" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Pin support</text>
    <circle cx="350" cy="95" r="10" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="350" y="122" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Roller support</text>
    <line x1="210" y1="25" x2="210" y2="64" stroke="#2563eb" strokeWidth="3" markerEnd="url(#ssArrow)" />
    <text x="210" y="16" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Load</text>
  </svg>
);

const CantileverBeamDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 420 170" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg" notes={["Fixed at one end, free at the other — the free end droops the most"]}>
    <defs>
      <marker id="clArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
    </defs>
    <rect x="20" y="30" width="20" height="90" fill="#94a3b8" />
    {[0, 1, 2, 3, 4].map(i => (
      <line key={i} x1="20" y1={35 + i * 18} x2="35" y2={20 + i * 18} stroke="#475569" strokeWidth="2" />
    ))}
    <path d="M40 75 Q220 78 390 108" fill="none" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <line x1="40" y1="65" x2="390" y2="65" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 5" />
    <line x1="360" y1="55" x2="360" y2="100" stroke="#2563eb" strokeWidth="3" markerEnd="url(#clArrow)" />
    <text x="360" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Load</text>

  </LessonDiagram>
);

const BeamShapeCompareDiagram: React.FC = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 100 100" className="h-24 w-24">
        <rect x="20" y="10" width="60" height="14" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <rect x="43" y="24" width="14" height="52" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
        <rect x="20" y="76" width="60" height="14" fill="#dbeafe" stroke="#2563eb" strokeWidth="3" />
      </svg>
      <span className="ga-hand mt-2 text-sm font-bold text-slate-800">I-Beam</span>
      <span className="mt-1 text-center text-xs text-slate-600">Material at top and bottom flanges; thin middle web</span>
    </div>
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 100 100" className="h-24 w-24">
        <rect x="20" y="20" width="60" height="60" fill="#dcfce7" stroke="#059669" strokeWidth="3" />
        <rect x="34" y="34" width="32" height="32" fill="white" stroke="#059669" strokeWidth="2" />
      </svg>
      <span className="ga-hand mt-2 text-sm font-bold text-slate-800">Box Girder / Hollow Tube</span>
      <span className="mt-1 text-center text-xs text-slate-600">Hollow, closed shape resists bending and twisting</span>
    </div>
  </div>
);

const StressDistributionMapDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 380 225" className="w-full max-w-lg" aria-label="Bending stress is zero at the neutral axis and largest at the outer fibres" notes={['Stress is greatest at the outer edges and zero at the neutral axis.']}>
    <rect x="40" y="45" width="25" height="140" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
    <polygon points="65,45 65,115 190,45" fill="#2563eb" opacity="0.35" />
    <polygon points="65,115 65,185 190,185" fill="#dc2626" opacity="0.35" />
    <path d="M40 115 H205" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
    <text x="222" y="62" fontSize="14" fontWeight="700" fill="#1d4ed8">Max compression</text>
    <text x="222" y="120" fontSize="14" fill="#64748b">Zero stress</text>
    <text x="222" y="180" fontSize="14" fontWeight="700" fill="#dc2626">Max tension</text>
  </LessonDiagram>
);

const PointLoadUDLDiagram: React.FC = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="rounded-lg border border-slate-200 p-2">
      <svg viewBox="0 0 240 110" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="70" x2="220" y2="70" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
        <line x1="120" y1="25" x2="120" y2="66" stroke="#2563eb" strokeWidth="3" markerEnd="url(#ssArrow)" />
        <text x="120" y="16" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Point load</text>
        <text x="120" y="98" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Force at one spot</text>
      </svg>
    </div>
    <div className="rounded-lg border border-slate-200 p-2">
      <svg viewBox="0 0 240 110" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="70" x2="220" y2="70" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
        {[40, 70, 100, 130, 160, 190].map(x => (
          <line key={x} x1={x} y1="30" x2={x} y2="66" stroke="#059669" strokeWidth="2.5" markerEnd="url(#ssArrow)" />
        ))}
        <text x="120" y="16" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Uniformly Distributed Load</text>
        <text x="120" y="98" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Weight spread evenly</text>
      </svg>
    </div>
  </div>
);

const ReactionForcesDiagram: React.FC = () => (
  <svg viewBox="0 0 420 180" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="rfArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
      <marker id="rfArrowUp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#059669" /></marker>
    </defs>
    <line x1="40" y1="80" x2="380" y2="80" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <polygon points="55,80 40,112 70,112" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="55" y="128" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">A</text>
    <circle cx="365" cy="98" r="9" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="365" y="128" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">B</text>
    <line x1="240" y1="30" x2="240" y2="74" stroke="#2563eb" strokeWidth="3" markerEnd="url(#rfArrow)" />
    <text x="240" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Load, W</text>
    <line x1="55" y1="150" x2="55" y2="115" stroke="#059669" strokeWidth="3" markerEnd="url(#rfArrowUp)" />
    <text x="55" y="163" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">R_A</text>
    <line x1="365" y1="150" x2="365" y2="112" stroke="#059669" strokeWidth="3" markerEnd="url(#rfArrowUp)" />
    <text x="365" y="163" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">R_B</text>
  </svg>
);

const ShearForceDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 300 160" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={['Sudden jump at the load position']}>
    <line x1="30" y1="80" x2="270" y2="80" stroke="#334155" strokeWidth="2" />
    <line x1="30" y1="20" x2="30" y2="140" stroke="#334155" strokeWidth="2" />
    <path d="M30 40 H150 V120 H270" fill="none" stroke="#2563eb" strokeWidth="3" />
    <text x="20" y="20" fontSize="14" fontWeight="700" fill="#334155">Shear</text>
    <text x="285" y="150" textAnchor="end" fontSize="14" fontWeight="700" fill="#334155">Length</text>
  </LessonDiagram>
);

const BendingMomentDiagram: React.FC = () => (
  <svg viewBox="0 0 300 160" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
    <line x1="30" y1="130" x2="270" y2="130" stroke="#334155" strokeWidth="2" />
    <line x1="30" y1="20" x2="30" y2="140" stroke="#334155" strokeWidth="2" />
    <path d="M30 130 L150 45 L270 130" fill="none" stroke="#059669" strokeWidth="3" />
    <text x="20" y="20" fontSize="14" fontWeight="700" fill="#334155">Moment</text>
    <text x="285" y="150" textAnchor="end" fontSize="14" fontWeight="700" fill="#334155">Length</text>
    <text x="150" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Peaks under the load</text>
  </svg>
);

const LabeledBeamSetupDiagram: React.FC = () => (
  <svg viewBox="0 0 420 190" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="lbArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
      <marker id="lbArrowUp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#059669" /></marker>
    </defs>
    <line x1="40" y1="70" x2="380" y2="70" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <polygon points="55,70 40,102 70,102" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="55" y="118" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">A</text>
    <circle cx="365" cy="88" r="9" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="365" y="118" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">B</text>
    <line x1="150" y1="25" x2="150" y2="64" stroke="#2563eb" strokeWidth="3" markerEnd="url(#lbArrow)" />
    <text x="150" y="16" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">W</text>
    <line x1="55" y1="145" x2="150" y2="145" stroke="#94a3b8" strokeWidth="2" />
    <text x="100" y="160" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">a</text>
    <line x1="150" y1="145" x2="365" y2="145" stroke="#94a3b8" strokeWidth="2" />
    <text x="255" y="160" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">b</text>
    <line x1="55" y1="175" x2="365" y2="175" stroke="#334155" strokeWidth="2" />
    <text x="210" y="188" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">L (total span)</text>
  </svg>
);

/* ========================================================================
  BEAMS — BODY
  ======================================================================== */

const BeamsBody: React.FC = () => (
  <>
    <div className="mb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        Beams
      </h1>
    </div>

    <BTermCard
      accent="blue"
      text="A **beam** is a structural member that carries a load sideways (transversely) across a gap, resting on supports at one or more points."
      examples={[]}
    />
    <BLead>
      When a load pushes down on a beam, the beam bends slightly. This bending carries the force along the
      length of the beam to its supports, where the supports push back up to hold everything in balance. This
      is how a beam turns a downward load into forces the supports can safely carry.
    </BLead>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Forces Acting on a Beam</h2>

    <BHeading>Tension and Compression</BHeading>
    <BLead>
      When a beam bends under a load, one side of it stretches and the other side squashes.
    </BLead>
    <BTermCard accent="blue" text="**Compression** is a squashing force. It acts on the inner curve of the bent beam — usually the top." examples={[]} />
    <BTermCard accent="emerald" text="**Tension** is a stretching force. It acts on the outer curve of the bent beam — usually the bottom." examples={[]} />
    <BDiagramBox title="A Beam Bending Under Load" caption="The straight beam bends into a curve as the load pushes down.">
      <BendingStressDiagram />
    </BDiagramBox>
    <BDiagramBox title="Tension and Compression Zones" caption="Top = compression (squashed), bottom = tension (stretched).">
      <TensionCompressionZonesDiagram />
    </BDiagramBox>

    <BHeading>The Neutral Axis</BHeading>
    <BTermCard
      accent="emerald"
      text="The **neutral axis** is the layer running along the centre of the beam where there is zero stress — it is neither stretched nor squashed."
      examples={[]}
    />
    <BDiagramBox title="The Neutral Axis" caption="Stress is zero at the centre and increases toward the top and bottom edges.">
      <NeutralAxisDiagram />
    </BDiagramBox>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Types of Beams &amp; Supports</h2>

    <BHeading>Simply Supported Beam</BHeading>
    <BTermCard
      accent="blue"
      text="A **simply supported beam** rests freely on a support at each end — one end can be a fixed pin, the other a roller that allows slight sideways movement."
      examples={['A footbridge resting on two piers', 'A floor joist resting on two walls', 'A shelf resting on two brackets']}
    />
    <BLead>
      Because both ends are free to rotate slightly, this is the simplest and most common beam arrangement in
      buildings and bridges.
    </BLead>
    <BDiagramBox title="A Simply Supported Beam" caption="Pin support at one end, roller support at the other.">
      <SimplySupportedBeamDiagram />
    </BDiagramBox>

    <BHeading>Cantilever Beam</BHeading>
    <BTermCard
      accent="emerald"
      text="A **cantilever beam** is fixed rigidly at one end and completely free at the other end."
      examples={['A balcony sticking out from a building', 'A diving board', 'An aircraft wing']}
    />
    <BLead>
      Because only one end is held, a cantilever beam bends downward the most at its free end, and the fixed
      end must resist all of the bending on its own.
    </BLead>
    <BDiagramBox title="A Cantilever Beam" caption="Fixed into a wall at one end; the free end droops under load.">
      <CantileverBeamDiagram />
    </BDiagramBox>

    <BHeading>Overhanging &amp; Continuous Beams</BHeading>
    <BLead>
      An <strong className="font-bold text-slate-900">overhanging beam</strong> rests on two supports but extends
      past one of them, like a diving board that also has a support partway along its length. A{' '}
      <strong className="font-bold text-slate-900">continuous beam</strong> runs over three or more supports in
      a row. Adding extra supports spreads the load over more points, so each support carries a smaller share
      and the beam bends less at any one place.
    </BLead>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Beam Shapes &amp; Structural Efficiency</h2>

    <BHeading>Why the I-Beam Is So Widely Used</BHeading>
    <BLead>
      Bending stress is greatest at the top and bottom of a beam, and almost zero near the middle (the neutral
      axis). The <strong className="font-bold text-slate-900">I-beam</strong> takes advantage of this: it places
      most of its material in the top and bottom flanges, where the stress is highest, and uses only a thin web
      to connect them. This gives a very strong beam without using much material in the middle, where it is
      barely needed — saving weight and cost.
    </BLead>

    <BHeading>Box Girders and Hollow Tubes</BHeading>
    <BLead>
      A <strong className="font-bold text-slate-900">box girder</strong> or <strong className="font-bold text-slate-900">hollow tube</strong> is
      a closed, hollow shape. Because the material forms a closed loop, it resists <strong className="font-bold text-slate-900">twisting</strong> (torsion)
      much better than an open shape like an I-beam, as well as resisting bending. This makes box girders a
      good choice for bridges and structures that must resist sideways or twisting forces, such as wind loads.
    </BLead>

    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="I-Beam and Box Girder Cross-Sections" caption="Different shapes place material where it resists bending or twisting best.">
        <BeamShapeCompareDiagram />
      </BDiagramBox>
      <BDiagramBox title="Stress Distribution Across a Beam" caption="Stress is highest at the outer edges and zero at the neutral axis.">
        <StressDistributionMapDiagram />
      </BDiagramBox>
    </div>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Point Loads, Distributed Loads &amp; Worked Examples</h2>

    <BTermCard accent="blue" text="A **point load** is a force applied at a single, specific location on a beam." examples={['A person standing at one spot on a bridge', 'A single heavy box on a shelf']} />
    <BTermCard accent="emerald" text="A **Uniformly Distributed Load (UDL)** is a load spread evenly along the whole length (or part of the length) of a beam." examples={['The beam\'s own weight', 'A layer of snow spread across a roof beam', 'Books spread evenly along a shelf']} />
    <BDiagramBox title="Point Load vs Uniformly Distributed Load" caption="A point load acts at one spot; a UDL is spread evenly along the beam.">
      <PointLoadUDLDiagram />
    </BDiagramBox>

    <BLead>
      A simply supported beam AB is 6 m long. A point load of 300 N is applied 2 m from support A. Find the
      reaction forces at each support using the Principle of Moments.
    </BLead>

    <BWorkedBox
      index={1}
      example={{
        title: 'Step 1 — Take moments about support A to find R_B.',
        given: ['Total span, L = 6 m.', 'Load, W = 300 N, at 2 m from A.'],
        find: 'The reaction force at support B (R_B).',
        formula: 'Sum of clockwise moments about A = Sum of anticlockwise moments about A',
        substitution: 'W × 2 = R_B × 6 → 300 × 2 = R_B × 6',
        calculation: '600 = 6 × R_B → R_B = 600 / 6',
        answer: 'R_B = 100 N',
        meaning: 'Taking moments about A cancels out R_A, leaving only R_B to solve for.',
      }}
    />
    <BWorkedBox
      index={2}
      example={{
        title: 'Step 2 — Use vertical equilibrium to find R_A.',
        given: ['Load, W = 300 N.', 'R_B = 100 N (from Step 1).'],
        find: 'The reaction force at support A (R_A).',
        formula: 'R_A + R_B = W',
        substitution: 'R_A + 100 = 300',
        calculation: 'R_A = 300 − 100',
        answer: 'R_A = 200 N',
        meaning: 'The two upward reactions must together balance the single downward load.',
      }}
    />
    <BWorkedBox
      index={3}
      example={{
        title: 'Step 3 — Check the answer.',
        given: ['R_A = 200 N.', 'R_B = 100 N.', 'W = 300 N.'],
        find: 'Whether the reactions are correct.',
        formula: 'R_A + R_B should equal W',
        substitution: '200 + 100',
        calculation: '= 300',
        answer: '300 N = 300 N ✓',
        meaning: 'The reactions balance the load exactly, confirming the beam is in equilibrium.',
      }}
    />

    <div className="mb-2 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="Reaction Forces at the Supports" caption="R_A and R_B push up to balance the downward load.">
        <ReactionForcesDiagram />
      </BDiagramBox>
      <BDiagramBox title="Shear Force Diagram" caption="Shear jumps suddenly at the point where the load is applied.">
        <ShearForceDiagram />
      </BDiagramBox>
      <BDiagramBox title="Bending Moment Diagram" caption="Bending moment peaks under the load and is zero at the supports.">
        <BendingMomentDiagram />
      </BDiagramBox>
      <BDiagramBox title="Fully Labeled Beam Setup" caption="Span L, distances a and b, load W, and reactions R_A and R_B.">
        <LabeledBeamSetupDiagram />
      </BDiagramBox>
    </div>
  </>
);

/* ========================================================================
  TRUSSES — DIAGRAMS
  ======================================================================== */

const TriangleVsSquareDiagram: React.FC = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 160 140" className="h-32 w-32" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="tzArrow1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
        </defs>
        <polygon points="80,20 20,120 140,120" fill="#dbeafe" stroke="#2563eb" strokeWidth="4" />
        <line x1="140" y1="70" x2="170" y2="70" stroke="#dc2626" strokeWidth="3" markerEnd="url(#tzArrow1)" />
        <text x="80" y="135" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Stays rigid</text>
      </svg>
      <span className="ga-hand mt-2 text-sm font-bold text-slate-800">Triangle</span>
      <span className="mt-1 text-center text-xs text-slate-600">A push on one side cannot change its shape</span>
    </div>
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 160 140" className="h-32 w-32" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,20 120,20 140,120 40,120" fill="#fee2e2" stroke="#dc2626" strokeWidth="3" strokeDasharray="6 4" />
        <polygon points="20,20 120,20 100,120 0,120" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="140" y1="70" x2="165" y2="70" stroke="#dc2626" strokeWidth="3" markerEnd="url(#tzArrow1)" />
        <text x="80" y="135" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Collapses sideways</text>
      </svg>
      <span className="ga-hand mt-2 text-sm font-bold text-slate-800">Rectangle</span>
      <span className="mt-1 text-center text-xs text-slate-600">A push on one side turns it into a slanted parallelogram, even though every side stays the same length</span>
    </div>
  </div>
);

const JointNodeDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 240 200" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Force spreads out to every member meeting at the pin joint"]}>
    <defs>
      <marker id="jnArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
    </defs>
    <line x1="120" y1="100" x2="30" y2="40" stroke="#475569" strokeWidth="4" />
    <line x1="120" y1="100" x2="210" y2="40" stroke="#475569" strokeWidth="4" />
    <line x1="120" y1="100" x2="30" y2="160" stroke="#475569" strokeWidth="4" />
    <line x1="120" y1="100" x2="210" y2="160" stroke="#475569" strokeWidth="4" />
    <line x1="120" y1="30" x2="120" y2="80" stroke="#dc2626" strokeWidth="3" markerEnd="url(#jnArrow)" />
    <circle cx="120" cy="100" r="8" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
    <text x="120" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Applied load</text>

  </LessonDiagram>
);

const TrussBracingRealWorldDiagram: React.FC = () => <LessonImage name="roof-truss" alt="A timber roof truss with clearly visible triangular bracing and connector plates" labels={['Triangular bracing', 'Members meet at connected joints']} />;

const KingQueenPostDiagram: React.FC = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 200 120" className="h-24 w-full" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,15 20,100 180,100" fill="none" stroke="#475569" strokeWidth="3" />
        <line x1="100" y1="15" x2="100" y2="100" stroke="#2563eb" strokeWidth="3" />
        <text x="100" y="115" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">King Post</text>
      </svg>
      <span className="mt-1 text-center text-xs text-slate-600">One central vertical post</span>
    </div>
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 200 120" className="h-24 w-full" xmlns="http://www.w3.org/2000/svg">
        <polygon points="100,15 20,100 180,100" fill="none" stroke="#475569" strokeWidth="3" />
        <line x1="70" y1="52" x2="70" y2="100" stroke="#059669" strokeWidth="3" />
        <line x1="130" y1="52" x2="130" y2="100" stroke="#059669" strokeWidth="3" />
        <line x1="70" y1="52" x2="130" y2="52" stroke="#059669" strokeWidth="3" />
        <text x="100" y="115" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Queen Post</text>
      </svg>
      <span className="mt-1 text-center text-xs text-slate-600">Two posts with a horizontal tie between them</span>
    </div>
  </div>
);

const PrattWarrenDiagram: React.FC = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 220 120" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="80" x2="210" y2="80" stroke="#475569" strokeWidth="3" />
        <line x1="10" y1="20" x2="210" y2="20" stroke="#475569" strokeWidth="3" />
        {[10, 60, 110, 160, 210].map(x => (
          <line key={x} x1={x} y1="20" x2={x} y2="80" stroke="#94a3b8" strokeWidth="2" />
        ))}
        <line x1="10" y1="20" x2="60" y2="80" stroke="#dc2626" strokeWidth="2" />
        <line x1="60" y1="80" x2="110" y2="20" stroke="#dc2626" strokeWidth="2" />
        <line x1="110" y1="20" x2="160" y2="80" stroke="#dc2626" strokeWidth="2" />
        <line x1="160" y1="80" x2="210" y2="20" stroke="#dc2626" strokeWidth="2" />
        <text x="110" y="98" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Pratt Truss</text>
      </svg>
      <span className="mt-1 text-center text-xs text-slate-600">Diagonals slope towards the centre; verticals are struts</span>
    </div>
    <div className="flex flex-col items-center rounded-lg border border-slate-200 p-4">
      <svg viewBox="0 0 220 120" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
        <line x1="10" y1="80" x2="210" y2="80" stroke="#475569" strokeWidth="3" />
        <polyline points="10,80 60,20 110,80 160,20 210,80" fill="none" stroke="#2563eb" strokeWidth="2" />
        <text x="110" y="98" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Warren Truss</text>
      </svg>
      <span className="mt-1 text-center text-xs text-slate-600">A repeating zig-zag of equal triangles, no verticals</span>
    </div>
  </div>
);

const TrussReactionsDiagram: React.FC = () => (
  <svg viewBox="0 0 300 190" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="trxArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
      <marker id="trxArrowUp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#059669" /></marker>
    </defs>
    <polygon points="150,20 30,100 270,100" fill="none" stroke="#1e293b" strokeWidth="4" />
    <line x1="100" y1="60" x2="150" y2="100" stroke="#94a3b8" strokeWidth="2" />
    <polygon points="45,100 30,132 60,132" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="45" y="148" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">A</text>
    <circle cx="255" cy="116" r="9" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
    <text x="255" y="148" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">B</text>
    <line x1="100" y1="70" x2="100" y2="96" stroke="#2563eb" strokeWidth="3" markerEnd="url(#trxArrow)" />
    <text x="100" y="55" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">W</text>
    <line x1="45" y1="182" x2="45" y2="136" stroke="#059669" strokeWidth="3" markerEnd="url(#trxArrowUp)" />
    <text x="45" y="180" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">R_A</text>
    <line x1="255" y1="182" x2="255" y2="128" stroke="#059669" strokeWidth="3" markerEnd="url(#trxArrowUp)" />
    <text x="255" y="180" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">R_B</text>
  </svg>
);

const TieStrutStressDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 300 170" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={["Sloping top members squash together; the bottom chord and inner diagonal stretch apart"]}>
    <polygon points="150,20 30,100 270,100" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
    <line x1="150" y1="20" x2="30" y2="100" stroke="#2563eb" strokeWidth="4" />
    <line x1="150" y1="20" x2="270" y2="100" stroke="#2563eb" strokeWidth="4" />
    <line x1="30" y1="100" x2="270" y2="100" stroke="#dc2626" strokeWidth="4" />
    <line x1="100" y1="60" x2="150" y2="100" stroke="#dc2626" strokeWidth="3" />
    <text x="150" y="12" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Apex</text>
    <rect x="20" y="120" width="12" height="4" fill="#2563eb" />
    <text x="38" y="124" fontSize="14" fill="#475569">Strut (compression)</text>
    <rect x="170" y="120" width="12" height="4" fill="#dc2626" />
    <text x="188" y="124" fontSize="14" fill="#475569">Tie (tension)</text>

  </LessonDiagram>
);

const RoofLoadDistributionDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 300 180" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={["Loads at the joints travel down through the sloping members to the two end supports"]}>
    <defs>
      <marker id="rldArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
    </defs>
    <polygon points="150,20 30,110 270,110" fill="none" stroke="#1e293b" strokeWidth="3" />
    <line x1="90" y1="65" x2="150" y2="110" stroke="#94a3b8" strokeWidth="2" />
    <line x1="210" y1="65" x2="150" y2="110" stroke="#94a3b8" strokeWidth="2" />
    <line x1="90" y1="20" x2="90" y2="60" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rldArrow)" />
    <line x1="150" y1="20" x2="150" y2="60" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rldArrow)" />
    <line x1="210" y1="20" x2="210" y2="60" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#rldArrow)" />
    <polygon points="45,110 30,140 60,140" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
    <circle cx="255" cy="122" r="8" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />

  </LessonDiagram>
);

const BridgeTrussFullDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 320 150" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={["Warren-style bridge truss — repeating triangles carry the load to both ends"]}>
    <line x1="20" y1="110" x2="300" y2="110" stroke="#1e293b" strokeWidth="4" />
    <polyline points="20,110 55,50 90,110 125,50 160,110 195,50 230,110 265,50 300,110" fill="none" stroke="#2563eb" strokeWidth="3" />
    <rect x="10" y="118" width="16" height="14" fill="#94a3b8" />
    <rect x="294" y="118" width="16" height="14" fill="#94a3b8" />

  </LessonDiagram>
);

/* ========================================================================
  TRUSSES — BODY
  ======================================================================== */

const TrussesBody: React.FC = () => (
  <>
    <div className="mb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        Trusses
      </h1>
    </div>

    <BTermCard
      accent="blue"
      text="A **truss** is a framework made of straight members joined together at their ends (called joints or nodes), usually arranged as a series of triangles."
      examples={[]}
    />
    <BLead>
      Trusses are used to support heavy loads across long gaps, such as the roof of a house or the deck of a
      bridge. Instead of using one big solid beam, a truss uses many thin, light members joined into
      triangles. Because triangles do not change shape, the whole framework stays strong and stiff, even
      though it is made of much less material than a solid beam.
    </BLead>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">The Principle of Triangulation</h2>
    <BLead>
      A truss gets its strength from one simple idea: <strong className="font-bold text-slate-900">the triangle is the only shape that cannot change shape</strong> unless one of its sides changes length.
    </BLead>
    <BTermCard
      accent="blue"
      text="A **triangle** is rigid. If you push on one corner, the triangle cannot fold or lean — the only way to change its shape is to actually change the length of one of its three sides."
      examples={[]}
    />
    <BTermCard
      accent="emerald"
      text="A **rectangle** (or square) is not rigid. If you push sideways on it, it can lean over into a slanted parallelogram shape, even though every side stays the same length."
      examples={['A rectangular gate that swings and sags sideways', 'A tall bookshelf that wobbles from side to side']}
    />
    <BDiagramBox title="Triangle Rigidity vs Rectangle Deformation" caption="A sideways push cannot change the triangle's shape, but it can lean a rectangle into a slanted parallelogram.">
      <TriangleVsSquareDiagram />
    </BDiagramBox>
    <BDiagramBox title="Members Meeting at a Joint (Node)" caption="At each joint, several members are pinned together. Forces pass from one member to the next through these joints.">
      <JointNodeDiagram />
    </BDiagramBox>
    <BDiagramBox title="Triangular Bracing in Real Structures" caption="Diagonal braces turn weak rectangular frames into rigid triangles, in towers, roofs, and bridges.">
      <TrussBracingRealWorldDiagram />
    </BDiagramBox>
    <BLead>
      This is why engineers add diagonal braces to towers, shelving, and roof frames — the diagonal splits a
      floppy rectangle into two rigid triangles.
    </BLead>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Ties and Struts (Tension vs Compression)</h2>
    <BLead>
      When a load is placed on a truss, every member either gets stretched or squashed. We give these two
      kinds of members different names.
    </BLead>
    <BTermCard
      accent="emerald"
      text="A **tie** is a member that is being pulled apart (in tension). You can spot a tie because it is trying to stretch — if you cut it, the two joints it connects would spring apart."
      examples={['The bottom chord of many roof trusses', 'A diagonal member pulled straight by a load']}
    />
    <BTermCard
      accent="blue"
      text="A **strut** is a member that is being pushed together (in compression). You can spot a strut because it is trying to squash shorter — if it were too thin, it would bow outward (buckle)."
      examples={['The top chord of many roof trusses', 'A sloping rafter carrying the roof load down to the walls']}
    />
    <BNote>
      <strong className="font-bold text-slate-900">How to tell them apart quickly:</strong> imagine removing
      the member. If the joints on either end would fly apart, the member was a tie (tension). If the joints
      would fall together, the member was a strut (compression).
    </BNote>
    <BLead>
      When a load is applied at a joint, it does not stay at that one point. It spreads out along the members
      connected to that joint, passing from joint to joint — some members squeezed (struts), others stretched
      (ties) — until it finally reaches the end supports, where the supports push back up to balance it.
    </BLead>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Common Roof and Bridge Trusses</h2>

    <BHeading>King Post and Queen Post Trusses</BHeading>
    <BTermCard
      accent="blue"
      text="A **king post truss** is a simple triangular roof truss with a single vertical post (the king post) running from the apex down to the middle of the bottom chord."
      examples={['Small roof spans, such as garages and sheds']}
    />
    <BTermCard
      accent="emerald"
      text="A **queen post truss** is similar, but uses two vertical posts (queen posts) with a horizontal member between them, instead of one central post."
      examples={['Slightly wider roof spans than a king post truss can manage']}
    />
    <BHeading>Pratt and Warren Trusses</BHeading>
    <BTermCard
      accent="blue"
      text="A **Pratt truss** uses a repeating pattern of diagonal members that slope towards the centre of the span, so that under a normal downward load, the diagonals are ties and the verticals are struts."
      examples={['Steel railway and road bridges']}
    />
    <BTermCard
      accent="emerald"
      text="A **Warren truss** uses a repeating pattern of equal-length diagonals forming a continuous zig-zag of triangles, with no vertical members at all."
      examples={['Road bridges and long roof spans']}
    />
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="King Post vs Queen Post Trusses" caption="King post: one central post. Queen post: two posts with a horizontal tie between them.">
        <KingQueenPostDiagram />
      </BDiagramBox>
      <BDiagramBox title="Pratt vs Warren Trusses" caption="Pratt: diagonals slope inward with vertical struts. Warren: a repeating zig-zag of triangles.">
        <PrattWarrenDiagram />
      </BDiagramBox>
    </div>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Equilibrium and Worked Examples</h2>
    <BTermCard
      accent="blue"
      text="For any truss resting on two supports, the basic rule of equilibrium is: **Total upward support forces = Total downward load forces**."
      examples={[]}
    />
    <BLead>
      Just like a beam, we can use the <strong className="font-bold text-slate-900">Principle of Moments</strong> to find the two support reactions, R_A and R_B, of a simply supported roof truss.
    </BLead>

    <BLead>
      A triangular roof truss rests on two supports, A and B, 8 m apart. A load of 240 N acts on a joint on the
      bottom chord, 3 m from support A. Find the reaction forces at A and B.
    </BLead>

    <BWorkedBox
      index={1}
      example={{
        title: 'Step 1 — Take moments about support A to find R_B.',
        given: ['Total span, L = 8 m.', 'Load, W = 240 N, at 3 m from A.'],
        find: 'The reaction force at support B (R_B).',
        formula: 'Sum of clockwise moments about A = Sum of anticlockwise moments about A',
        substitution: 'W × 3 = R_B × 8 → 240 × 3 = R_B × 8',
        calculation: '720 = 8 × R_B → R_B = 720 / 8',
        answer: 'R_B = 90 N',
        meaning: 'Taking moments about A cancels out R_A, leaving only R_B to solve for.',
      }}
    />
    <BWorkedBox
      index={2}
      example={{
        title: 'Step 2 — Use vertical equilibrium to find R_A.',
        given: ['Load, W = 240 N.', 'R_B = 90 N (from Step 1).'],
        find: 'The reaction force at support A (R_A).',
        formula: 'R_A + R_B = W',
        substitution: 'R_A + 90 = 240',
        calculation: 'R_A = 240 − 90',
        answer: 'R_A = 150 N',
        meaning: 'The two upward reactions must together balance the single downward load.',
      }}
    />
    <BWorkedBox
      index={3}
      example={{
        title: 'Step 3 — Check the answer.',
        given: ['R_A = 150 N.', 'R_B = 90 N.', 'W = 240 N.'],
        find: 'Whether the reactions are correct.',
        formula: 'R_A + R_B should equal W',
        substitution: '150 + 90',
        calculation: '= 240',
        answer: '240 N = 240 N ✓',
        meaning: 'The reactions balance the load exactly, confirming the truss is in equilibrium.',
      }}
    />

    <div className="mb-2 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="Support Reaction Forces on a Truss" caption="R_A and R_B push up to balance the downward load on the truss.">
        <TrussReactionsDiagram />
      </BDiagramBox>
      <BDiagramBox title="Ties and Struts Under Load" caption="Blue members are struts (compression); red members are ties (tension).">
        <TieStrutStressDiagram />
      </BDiagramBox>
      <BDiagramBox title="Roof Load Distribution" caption="Loads at the joints travel through the members down to the two supports.">
        <RoofLoadDistributionDiagram />
      </BDiagramBox>
      <BDiagramBox title="A Complete Bridge Truss" caption="A Warren-style bridge truss made of repeating triangles carrying traffic loads to its end supports.">
        <BridgeTrussFullDiagram />
      </BDiagramBox>
    </div>
  </>
);

/* ========================================================================
  JOINING MATERIALS — DIAGRAMS
  ======================================================================== */

const BoltNutAssemblyDiagram: React.FC = () => <LessonImage name="bolt-nut" alt="A hex-head bolt aligned through two steel plates with a washer and nut on the same axis" labels={['Bolt head', 'Overlapping plates', 'Washer and threaded nut']} />;

const WoodScrewThreadDiagram: React.FC = () => <LessonImage name="wood-screw" alt="A countersunk wood screw with a cross-head drive, spiral thread and pointed tip" labels={['Head', 'Spiral thread', 'Pointed tip']} />;

const TemporaryJointSetupDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 150" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Panels line up on a dowel and lock with a turning cam — no glue, easy to take apart"]}>
    <rect x="30" y="40" width="90" height="60" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
    <rect x="120" y="40" width="90" height="60" fill="#dcfce7" stroke="#059669" strokeWidth="2.5" strokeDasharray="5 4" />
    <circle cx="120" cy="60" r="6" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <circle cx="120" cy="80" r="6" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <text x="130" y="122" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Cam-and-dowel KD fitting</text>

  </LessonDiagram>
);

const PopRivetingStepsDiagram: React.FC = () => (
  <div className="grid w-full gap-5 md:grid-cols-3">
    {['Insert the rivet through the drilled hole', 'Pull the mandrel with the rivet gun', 'Mandrel snaps; the rivet clamps the sheets'].map((label,index) => <div key={label} className="min-w-0 rounded-lg border border-slate-200 p-3">
      <svg viewBox="0 0 160 130" role="img" aria-label={label} className="block h-auto w-full">
        <rect x="25" y="47" width="110" height="16" fill="#dbeafe" stroke="#334155" strokeWidth="2" />
        <rect x="25" y="63" width="110" height="16" fill="#dcfce7" stroke="#334155" strokeWidth="2" />
        <path d={index === 0 ? 'M80 26 V93' : index === 1 ? 'M80 15 V90' : 'M80 44 V84'} stroke="#475569" strokeWidth="7" />
        <ellipse cx="80" cy="43" rx="12" ry="5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
        {index > 0 && <ellipse cx="80" cy="85" rx="15" ry="7" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />}
        {index === 1 && <path d="M105 33 V12 L100 20 M105 12 L110 20" fill="none" stroke="#2563eb" strokeWidth="2" />}
      </svg>
      <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-700">{index + 1}. {label}</p>
    </div>)}
  </div>
);

const AdhesiveBondingLayersDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 360 180" className="w-full max-w-lg" aria-label="A thin adhesive layer between two joined parts" notes={['Glue grips both surfaces and hardens, locking the two parts together.']}>
    <rect x="105" y="40" width="215" height="30" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
    <rect x="105" y="70" width="215" height="10" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
    <rect x="105" y="80" width="215" height="30" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
    <text x="85" y="60" textAnchor="end" fontSize="15" fontWeight="700" fill="#1e293b">Part A</text>
    <text x="85" y="100" textAnchor="end" fontSize="15" fontWeight="700" fill="#1e293b">Part B</text>
    <path d="M212 84 V125" stroke="#b45309" strokeWidth="1.5" />
    <text x="212" y="150" textAnchor="middle" fontSize="15" fontWeight="700" fill="#b45309">Thin adhesive layer</text>
  </LessonDiagram>
);

const WeldedBrazedCrossSectionDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 140" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Welding melts the base metals together; soldering/brazing melts only a filler between them"]}>
    <rect x="20" y="60" width="100" height="20" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
    <rect x="120" y="60" width="100" height="20" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
    <path d="M110 55 Q130 40 150 55 L150 85 Q130 100 110 85 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
    <text x="130" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="#b45309">Fused / filled joint area</text>

  </LessonDiagram>
);

const MortiseAndTenonExplodedDiagram: React.FC = () => <LessonImage name="mortise-tenon" alt="Exploded timber joint with a rectangular tenon aligned with a matching mortise hole" labels={['Mortise: rectangular slot', 'Tenon: projecting tongue']} />;

const DovetailExplodedDiagram: React.FC = () => <LessonImage name="dovetail" alt="A disassembled timber dovetail showing a flared trapezoidal tail and a mating socket" labels={['Flared trapezoidal tail', 'Mating socket']} />;

const JointTestingSetupDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 150" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Pulling a joint apart to test its strength","Force is applied until the joint fails, showing its maximum strength"]}>
    <defs>
      <marker id="jtsArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
    </defs>
    <rect x="60" y="60" width="60" height="20" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
    <rect x="120" y="60" width="60" height="20" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
    <line x1="60" y1="70" x2="30" y2="70" stroke="#dc2626" strokeWidth="3" markerEnd="url(#jtsArrow)" />
    <line x1="180" y1="70" x2="210" y2="70" stroke="#dc2626" strokeWidth="3" markerEnd="url(#jtsArrow)" />


  </LessonDiagram>
);

const JointFailurePointsDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 150" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Joints often fail at the glue line, a fastener hole, or the thinnest part of a fitting"]}>
    <rect x="40" y="60" width="70" height="20" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2" />
    <rect x="110" y="60" width="70" height="20" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 3" />
    <circle cx="110" cy="70" r="6" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
    <text x="110" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Common failure point</text>

  </LessonDiagram>
);

const ToolUsageDiagram: React.FC = () => <LessonImage name="joining-tools" alt="A soldering iron on its stand beside a handheld pop-rivet gun and blind rivets" labels={['Left: soldering iron', 'Right: pop-rivet gun']} />;

const WorkshopApplicationsDiagram: React.FC = () => <LessonImage name="workshop-projects" alt="Workshop examples of timber furniture, a welded steel frame and a riveted sheet-metal box" labels={['Timber furniture', 'Welded frame', 'Riveted sheet-metal box']} />;

/* ========================================================================
  JOINING MATERIALS — TABLE DATA
  ======================================================================== */

const joiningMethodsTable: { method: string; jointType: string; materials: string; advantage: string }[] = [
  { method: 'Screw / bolt & nut', jointType: 'Temporary', materials: 'Wood, metal, plastic', advantage: 'Can be undone and reused without damage' },
  { method: 'KD fitting (cam & dowel)', jointType: 'Temporary', materials: 'Flat-pack wood/board furniture', advantage: 'Fast assembly and disassembly, no tools glue needed' },
  { method: 'Pop rivet', jointType: 'Permanent', materials: 'Thin sheet metal', advantage: 'Quick, strong, needs access from one side only' },
  { method: 'PVA adhesive', jointType: 'Permanent', materials: 'Wood', advantage: 'Cheap, strong, invisible glue line' },
  { method: 'Contact adhesive', jointType: 'Permanent', materials: 'Plastic laminates, veneers', advantage: 'Instant bond on contact, no clamping needed' },
  { method: 'Epoxy resin', jointType: 'Permanent', materials: 'Metal, some plastics', advantage: 'Very strong, fills small gaps' },
  { method: 'Soldering / brazing', jointType: 'Permanent', materials: 'Metals (lower melting point)', advantage: 'Neat joint without melting the base metal' },
  { method: 'Welding', jointType: 'Permanent', materials: 'Metals', advantage: 'Maximum strength — parts fuse into one piece' },
  { method: 'Mortise and tenon', jointType: 'Permanent (framing)', materials: 'Wood', advantage: 'Large glue area plus strong mechanical interlock' },
  { method: 'Dovetail joint', jointType: 'Permanent (framing)', materials: 'Wood', advantage: 'Resists being pulled straight apart' },
];

/* ========================================================================
  JOINING MATERIALS — BODY
  ======================================================================== */

const JoiningMaterialsBody: React.FC = () => (
  <>
    <div className="mb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        Joining Materials
      </h1>
    </div>

    <BTermCard
      accent="blue"
      text="**Joining materials** means fixing two or more parts together so they act as one piece, using a fastener, an adhesive, or heat."
      examples={[]}
    />
    <BLead>
      Parts are joined together because most products and structures are too big, too complicated, or made of
      too many different materials to be built as one single piece. Joining lets us build up a large object
      from smaller, simpler parts.
    </BLead>
    <BTermCard
      accent="emerald"
      text="A **temporary joint** can be taken apart again without damaging the parts or the joint itself — like undoing a bolt."
      examples={['A bolted machine frame that needs regular maintenance', 'Flat-pack furniture you can disassemble to move house']}
    />
    <BTermCard
      accent="blue"
      text="A **permanent joint** cannot be separated without destroying the joint, and often without damaging the material itself — like a weld or a glued joint."
      examples={['A welded steel gate', 'A glued wooden chair frame']}
    />

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Mechanical Fasteners (Temporary Joints)</h2>

    <BHeading>Screws, Bolts, and Nuts</BHeading>
    <BTermCard
      accent="blue"
      text="A **screw** has a helical (spiral) thread that cuts its own grip into the material as it is turned in. A **bolt** is a threaded rod that passes through a hole in both parts and is held with a matching **nut**."
      examples={['Screws holding hinges onto a wooden door', 'Bolts and nuts holding steel machine frames together']}
    />
    <BLead>
      The spiral thread acts like a ramp wrapped around a rod. As the screw or bolt turns, the thread pulls the
      parts together along the ramp, squeezing them tightly with very little turning force.
    </BLead>
    <BDiagramBox title="Bolt and Nut Assembly" caption="The bolt passes through both parts; the nut threads on to clamp them together.">
      <BoltNutAssemblyDiagram />
    </BDiagramBox>
    <BDiagramBox title="Wood Screw Thread" caption="The spiral thread bites into the wood and draws the screw in as it turns.">
      <WoodScrewThreadDiagram />
    </BDiagramBox>

    <BHeading>Knocked-Down (KD) Fittings and Pins</BHeading>
    <BTermCard
      accent="emerald"
      text="A **knocked-down (KD) fitting** is a small hardware fitting, such as a cam-and-dowel lock or a pin, that lets two flat panels be assembled and taken apart again quickly, without glue or special tools."
      examples={['Flat-pack wardrobes and shelving', 'Modular office desks']}
    />
    <BLead>
      KD fittings are popular for flat-pack furniture because the furniture can be shipped flat in a box, then
      assembled by the customer, and taken apart again later if it needs to be moved.
    </BLead>
    <BDiagramBox title="A Temporary Joint Using a KD Fitting" caption="Panels line up on a dowel and lock with a turning cam, with no glue used.">
      <TemporaryJointSetupDiagram />
    </BDiagramBox>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Permanent Joining Methods</h2>

    <BHeading>Riveting</BHeading>
    <BTermCard
      accent="blue"
      text="A **rivet** is a metal pin pushed through holes in two sheets and then formed (squashed) at both ends to lock the sheets together permanently."
      examples={[]}
    />
    <BTermCard
      accent="emerald"
      text="A **pop rivet** (blind rivet) is fitted from one side only using a rivet gun, which pulls a central mandrel until it snaps, forming a head on the hidden side. A **solid rivet** has no mandrel — its tail end is hammered flat by hand or by machine."
      examples={['Pop rivets joining sheet-metal ducting', 'Solid rivets on older aircraft and bridge structures']}
    />
    <BLead>
      Both types of riveting are a **cold-forming** process — no heat is used. The rivet is simply squashed
      into shape, which is why riveting is a fast and safe way to join sheet metal.
    </BLead>
    <BDiagramBox title="Steps in Pop Riveting" caption="Drill a hole, insert the rivet, then pull the mandrel with a rivet gun until it snaps and forms a head.">
      <PopRivetingStepsDiagram />
    </BDiagramBox>

    <BHeading>Adhesives (Gluing)</BHeading>
    <BTermCard
      accent="blue"
      text="An **adhesive** is a substance spread between two surfaces that hardens (cures) and grips both surfaces, bonding them together."
      examples={[]}
    />
    <BTable
      headers={['Adhesive', 'Best For', 'Notes']}
      rows={[
        ['PVA glue', 'Wood', 'Cheap, strong, dries almost clear'],
        ['Contact adhesive', 'Plastic laminates, veneers', 'Bonds instantly on contact — no clamping time needed'],
        ['Epoxy resin', 'Metals, some plastics', 'Very strong, mixed from two parts, can fill small gaps'],
      ]}
    />
    <BDiagramBox title="Adhesive Bonding Layers" caption="A thin layer of glue grips both surfaces and hardens, locking the parts together.">
      <AdhesiveBondingLayersDiagram />
    </BDiagramBox>

    <BHeading>Thermal Joining (Metals)</BHeading>
    <BTermCard
      accent="emerald"
      text="**Soldering** and **brazing** join metals by melting a filler rod (solder or brazing alloy) at a temperature lower than the melting point of the metals being joined. The filler flows into the joint and sets, gluing the parts together without melting them."
      examples={['Soldering electrical wires and joints on circuit boards', 'Brazing copper pipe joints in plumbing']}
    />
    <BTermCard
      accent="blue"
      text="**Welding** joins metals by heating the edges of the base metals themselves until they melt and fuse together, usually with extra filler metal added, forming one continuous piece once cooled."
      examples={['Welding steel gates and frames', 'Welding car body panels']}
    />
    <BLead>
      Because welding actually melts and fuses the base metal, it generally gives the strongest joint of the
      three thermal methods — but it also needs the most skill, heat, and safety equipment.
    </BLead>
    <BDiagramBox title="Welded / Brazed Joint Cross-Section" caption="Welding fuses the base metals together; soldering and brazing melt only a filler between them.">
      <WeldedBrazedCrossSectionDiagram />
    </BDiagramBox>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Woodwork Joints</h2>
    <BLead>
      Timber joints are often cut into interlocking shapes rather than just butted flat together. This
      increases the surface area available for glue, and can add a mechanical interlock that holds the parts
      together even before the glue sets.
    </BLead>

    <BHeading>Widening Joints</BHeading>
    <BTermCard
      accent="blue"
      text="A **butt joint** simply places two flat edges together, glued or fixed with fasteners — the simplest joint, but the weakest because it has the smallest contact area."
      examples={['Joining boards edge-to-edge to make a wider panel']}
    />
    <BTermCard
      accent="emerald"
      text="A **dowel joint** adds round wooden pegs (dowels) across a butt joint, giving extra mechanical strength and helping to line up the pieces accurately."
      examples={['Joining table-top boards together']}
    />

    <BHeading>Framing Joints</BHeading>
    <BTermCard
      accent="blue"
      text="A **mortise and tenon joint** has a tongue (the tenon) on one piece that fits tightly into a matching slot (the mortise) cut into the other piece."
      examples={['Joining a table leg to its frame', 'Door and window frame corners']}
    />
    <BTermCard
      accent="emerald"
      text="A **lap joint** overlaps two pieces so that part of one is cut away to sit flush with the other, giving a larger glue area than a simple butt joint."
      examples={['Corner joints in light frames']}
    />
    <BTermCard
      accent="blue"
      text="A **dovetail joint** uses interlocking, flared wedge shapes (like a bird's tail) that mechanically lock the pieces so they resist being pulled straight apart."
      examples={['Drawer corners in quality furniture']}
    />
    <BLead>
      Shapes like the mortise and tenon or the dovetail work well because their interlocking shape both
      increases the glued surface area and physically locks the pieces together, so the joint does not rely on
      glue alone for its strength.
    </BLead>
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="Mortise and Tenon Joint (Exploded View)" caption="The tenon slides into the mortise, giving a large interlocking glue surface.">
        <MortiseAndTenonExplodedDiagram />
      </BDiagramBox>
      <BDiagramBox title="Dovetail Joint (Exploded View)" caption="The flared tail shape locks mechanically and resists being pulled apart.">
        <DovetailExplodedDiagram />
      </BDiagramBox>
    </div>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Factors in Joint Selection &amp; Practical Comparison</h2>
    <BLead>
      Choosing the right joining method depends on several factors: the type of material being joined (wood,
      metal, or plastic), how much strength the joint must carry, how the finished joint should look, and
      whether the parts will ever need to be taken apart again.
    </BLead>
    <BNote>
      <strong className="font-bold text-slate-900">Quick rule of thumb:</strong> if the parts must come apart
      again, choose a mechanical fastener or KD fitting. If the joint must be as strong and permanent as
      possible and the parts are metal, choose welding. If appearance matters most, an adhesive or a neatly
      cut woodwork joint usually gives the tidiest result.
    </BNote>

    <TitleBanner>Summary: Joining Methods Compared</TitleBanner>
    <BTable
      headers={['Fastener / Method', 'Joint Type', 'Suitable Materials', 'Key Advantage']}
      rows={joiningMethodsTable.map(row => [row.method, row.jointType, row.materials, row.advantage])}
    />

    <div className="mb-2 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="Testing a Joint" caption="Pulling a joint apart under controlled force shows its maximum strength.">
        <JointTestingSetupDiagram />
      </BDiagramBox>
      <BDiagramBox title="Common Failure Points" caption="Joints often fail at the glue line, a fastener hole, or the thinnest part of a fitting.">
        <JointFailurePointsDiagram />
      </BDiagramBox>
      <BDiagramBox title="Tools of the Trade" caption="A soldering iron melts filler for electrical joints; a rivet gun forms pop rivets in sheet metal.">
        <ToolUsageDiagram />
      </BDiagramBox>
      <BDiagramBox title="Practical Workshop Applications" caption="Different projects — furniture, metal frames, sheet-metal boxes — call for different joining methods.">
        <WorkshopApplicationsDiagram />
      </BDiagramBox>
    </div>
  </>
);

/* ========================================================================
  LARGE STRUCTURES — DIAGRAMS
  ======================================================================== */

const LoadDistributionDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 160" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Loads on the roof pass down through columns to the foundation"]}>
    <defs>
      <marker id="lsdArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
    </defs>
    <rect x="60" y="20" width="140" height="20" fill="#cbd5e1" stroke="#1e293b" strokeWidth="2" />
    <rect x="95" y="40" width="16" height="80" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <rect x="150" y="40" width="16" height="80" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <rect x="40" y="120" width="180" height="16" fill="#475569" stroke="#1e293b" strokeWidth="2" />
    {[80, 130, 180].map(x => (
      <line key={x} x1={x} y1="5" x2={x} y2="18" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#lsdArrow)" />
    ))}

  </LessonDiagram>
);

const DeadLiveLoadVectorsDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 150" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Dead load (spread evenly, always present)","Live load (one heavy vehicle, temporary)"]}>
    <defs>
      <marker id="dlArrowBlue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
      <marker id="dlArrowGreen" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#059669" /></marker>
    </defs>
    <rect x="30" y="70" width="200" height="16" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <line x1="70" y1="20" x2="70" y2="66" stroke="#2563eb" strokeWidth="3" markerEnd="url(#dlArrowBlue)" />
    <line x1="110" y1="20" x2="110" y2="66" stroke="#2563eb" strokeWidth="3" markerEnd="url(#dlArrowBlue)" />
    <line x1="150" y1="20" x2="150" y2="66" stroke="#2563eb" strokeWidth="3" markerEnd="url(#dlArrowBlue)" />
    <line x1="190" y1="20" x2="190" y2="66" stroke="#2563eb" strokeWidth="3" markerEnd="url(#dlArrowBlue)" />

    <line x1="130" y1="95" x2="130" y2="60" stroke="#059669" strokeWidth="4" markerEnd="url(#dlArrowGreen)" />

  </LessonDiagram>
);

const WindPressureHighRiseDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 220 200" className="h-auto w-full max-w-xs" xmlns="http://www.w3.org/2000/svg" notes={["Wind pushes harder higher up, bending the tall frame slightly sideways"]}>
    <defs>
      <marker id="wpArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#0ea5e9" /></marker>
    </defs>
    <rect x="70" y="20" width="60" height="150" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
    {[30, 60, 90, 120, 150].map(y => (
      <line key={y} x1="30" y1={y} x2="65" y2={y} stroke="#0ea5e9" strokeWidth="2.5" markerEnd="url(#wpArrow)" />
    ))}
    <path d="M130 170 Q160 130 130 90 Q160 55 130 25" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />

  </LessonDiagram>
);

const SkyscraperFrameDiagram: React.FC = () => <LessonImage name="steel-frame" alt="A steel building under construction showing vertical columns, horizontal beams and diagonal braces" labels={['Columns: vertical', 'Beams: horizontal', 'Bracing: diagonal']} />;

const DeepPileFoundationDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 380 280" className="w-full max-w-lg" aria-label="Deep piles extend through soft soil into stable bedrock" notes={['Shallow footings spread load near the surface. Deep piles reach stronger ground below.']}>
    <rect x="30" y="60" width="220" height="120" fill="#e7e5e4" />
    <rect x="30" y="180" width="220" height="60" fill="#a8a29e" />
    <rect x="55" y="35" width="170" height="30" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
    {[85,140,195].map(x => <rect key={x} x={x} y="65" width="12" height="150" fill="#475569" />)}
    <text x="140" y="22" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">Pile cap</text>
    <path d="M255 120 H272 M255 205 H272" stroke="#78716c" strokeWidth="1.5" />
    <text x="282" y="125" fontSize="15" fill="#78716c">Soft soil</text>
    <text x="282" y="210" fontSize="15" fill="#57534e">Bedrock</text>
    <text x="140" y="264" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">Deep piles</text>
  </LessonDiagram>
);

const CrossBracingFrameDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 220 200" className="h-auto w-full max-w-xs" xmlns="http://www.w3.org/2000/svg" notes={["Diagonal braces stop the frame racking sideways under wind or earthquake loads"]}>
    <defs>
      <marker id="cbArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
    </defs>
    {[20, 70, 120, 170].map(y => (
      <line key={y} x1="30" y1={y} x2="190" y2={y} stroke="#94a3b8" strokeWidth="2.5" />
    ))}
    {[30, 190].map(x => (
      <line key={x} x1={x} y1="20" x2={x} y2="170" stroke="#94a3b8" strokeWidth="2.5" />
    ))}
    <line x1="30" y1="20" x2="190" y2="70" stroke="#2563eb" strokeWidth="3" />
    <line x1="190" y1="20" x2="30" y2="70" stroke="#2563eb" strokeWidth="3" />
    <line x1="30" y1="70" x2="190" y2="120" stroke="#2563eb" strokeWidth="3" />
    <line x1="190" y1="70" x2="30" y2="120" stroke="#2563eb" strokeWidth="3" />
    <line x1="10" y1="45" x2="30" y2="45" stroke="#dc2626" strokeWidth="3" markerEnd="url(#cbArrow)" />

  </LessonDiagram>
);

const ColumnBucklingDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 340 230" className="w-full max-w-lg" aria-label="A straight column compared with a slender column buckling sideways under compression">
    <defs><marker id="cleanBucklingArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#334155" /></marker></defs>
    <path d="M80 65 V175" stroke="#475569" strokeWidth="6" />
    <path d="M250 65 Q290 120 250 175" fill="none" stroke="#dc2626" strokeWidth="6" />
    <path d="M80 22 V52 M250 22 V52" stroke="#334155" strokeWidth="3" markerEnd="url(#cleanBucklingArrow)" />
    <text x="80" y="209" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1e293b">Straight column</text>
    <text x="250" y="209" textAnchor="middle" fontSize="15" fontWeight="700" fill="#dc2626">Buckled column</text>
  </LessonDiagram>
);

const RCStressZonesDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 260 150" className="h-auto w-full max-w-sm" xmlns="http://www.w3.org/2000/svg" notes={["Steel rebar near bottom — resists tension"]}>
    <rect x="30" y="40" width="200" height="60" fill="#e7e5e4" stroke="#1e293b" strokeWidth="2.5" />
    <line x1="45" y1="88" x2="215" y2="88" stroke="#dc2626" strokeWidth="4" />
    <circle cx="60" cy="88" r="4" fill="#dc2626" />
    <circle cx="120" cy="88" r="4" fill="#dc2626" />
    <circle cx="180" cy="88" r="4" fill="#dc2626" />
    <text x="130" y="30" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">Concrete top — in compression</text>

  </LessonDiagram>
);

const BridgeFoundationReactionsDiagram: React.FC = () => (
  <svg viewBox="0 0 300 190" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="bfrArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#2563eb" /></marker>
      <marker id="bfrArrowUp" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#059669" /></marker>
    </defs>
    <line x1="30" y1="80" x2="270" y2="80" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    <rect x="45" y="80" width="20" height="40" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <rect x="235" y="80" width="20" height="40" fill="#94a3b8" stroke="#1e293b" strokeWidth="2" />
    <text x="55" y="140" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">A</text>
    <text x="245" y="140" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">B</text>
    <line x1="150" y1="30" x2="150" y2="74" stroke="#2563eb" strokeWidth="3" markerEnd="url(#bfrArrow)" />
    <text x="150" y="20" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Total load (dead + live)</text>
    <line x1="55" y1="170" x2="55" y2="124" stroke="#059669" strokeWidth="3" markerEnd="url(#bfrArrowUp)" />
    <text x="55" y="182" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">R_A</text>
    <line x1="245" y1="170" x2="245" y2="124" stroke="#059669" strokeWidth="3" markerEnd="url(#bfrArrowUp)" />
    <text x="245" y="182" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">R_B</text>
  </svg>
);

const CompleteBridgeLabeledDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 320 170" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={["Towers, main cable/arch, deck, and end supports of a suspension/arch bridge"]}>
    <line x1="20" y1="120" x2="300" y2="120" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
    <rect x="10" y="128" width="18" height="18" fill="#94a3b8" />
    <rect x="292" y="128" width="18" height="18" fill="#94a3b8" />
    <line x1="30" y1="112" x2="30" y2="40" stroke="#475569" strokeWidth="3" />
    <line x1="290" y1="112" x2="290" y2="40" stroke="#475569" strokeWidth="3" />
    <path d="M30 40 Q160 0 290 40" fill="none" stroke="#475569" strokeWidth="4" />
    <line x1="80" y1="40" x2="80" y2="112" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
    <line x1="160" y1="14" x2="160" y2="112" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
    <line x1="240" y1="40" x2="240" y2="112" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />

  </LessonDiagram>
);

/* ========================================================================
  LARGE STRUCTURES — BODY
  ======================================================================== */

const LargeStructuresBody: React.FC = () => (
  <>
    <div className="mb-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
        Large Structures
      </h1>
    </div>

    <BTermCard
      accent="blue"
      text="A **large structure** is a massive construction, such as a skyscraper, bridge, dam, or transmission tower, built to support its own weight, the people and objects using it, and the forces of nature acting on it."
      examples={[]}
    />
    <BLead>
      Large structures must do two jobs at once: carry the weight of everything they hold up, and survive
      forces from the environment around them, such as wind, moving water, temperature changes, and
      earthquakes. Engineers design the shape, materials, and foundations of a structure so that all of these
      forces travel safely down to the ground, without the structure bending too much, cracking, or collapsing.
    </BLead>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Types of Loads Acting on Large Structures</h2>

    <BTermCard
      accent="blue"
      text="A **dead load** is the permanent, unchanging weight of the structure's own materials — its walls, floors, beams, and roof — which is always present and never moves."
      examples={['The weight of the concrete floors in a building', 'The weight of a bridge deck itself']}
    />
    <BTermCard
      accent="emerald"
      text="A **live load** is a temporary, movable weight that the structure supports, which can change in size, position, or whether it is even there at all."
      examples={['People walking through a building', 'Furniture and equipment', 'Vehicles crossing a bridge']}
    />
    <BDiagramBox title="Dead Load vs Live Load" caption="Dead load (blue) is spread evenly and always present; live load (green) is temporary and can be anywhere.">
      <DeadLiveLoadVectorsDiagram />
    </BDiagramBox>

    <BHeading>Environmental and Dynamic Loads</BHeading>
    <BTermCard
      accent="blue"
      text="**Environmental (dynamic) loads** are forces from nature that act on a structure in addition to dead and live loads."
      examples={[]}
    />
    <BTable
      headers={['Environmental Load', 'What It Is', 'Example']}
      rows={[
        ['Wind pressure', 'Sideways push of moving air, stronger higher up a tall building', 'A skyscraper swaying slightly in strong wind'],
        ['Water pressure', 'Sideways push of water against a structure, increasing with depth', 'Water pushing against a dam wall'],
        ['Thermal expansion', 'Materials expand when hot and contract when cold', 'A bridge deck expanding in the midday sun'],
        ['Earth movement', 'Sudden shaking or ground movement', 'An earthquake shaking a building\'s foundations'],
      ]}
    />
    <BDiagramBox title="Load Distribution Through a Structure" caption="Loads applied at the roof travel down through columns to the foundation.">
      <LoadDistributionDiagram />
    </BDiagramBox>
    <BDiagramBox title="Wind Pressure on a High-Rise Building" caption="Wind pushes harder at greater heights, bending a tall frame slightly to one side.">
      <WindPressureHighRiseDiagram />
    </BDiagramBox>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Structural Frameworks and Load Transfer</h2>

    <BHeading>Frame Structures</BHeading>
    <BTermCard
      accent="blue"
      text="A **frame structure** is a skeleton of vertical **columns** and horizontal **beams** joined together, which carries the loads of floors, walls, and roofs safely down to the foundations."
      examples={['The steel or concrete skeleton inside a skyscraper', 'The frame of a warehouse']}
    />
    <BLead>
      Beams collect the loads from floors and roofs and carry them sideways to the nearest column. Columns
      then carry that load straight down, floor after floor, until it finally reaches the foundation at ground
      level.
    </BLead>
    <BDiagramBox title="A Skyscraper Frame Under Construction" caption="Columns run vertically; beams run horizontally between them, forming the building's skeleton.">
      <SkyscraperFrameDiagram />
    </BDiagramBox>

    <BHeading>Foundations</BHeading>
    <BTermCard
      accent="emerald"
      text="A **shallow foundation** spreads a structure's load over a wide, flat footing near the surface, used where the soil close to the surface is already strong enough."
      examples={['A spread footing under a small house']}
    />
    <BTermCard
      accent="blue"
      text="A **deep foundation (pile foundation)** uses long piles driven or drilled down through soft soil until they reach strong bedrock or firm soil, anchoring a heavy structure securely."
      examples={['Piles supporting a skyscraper built on soft ground', 'Piles supporting a bridge pier in a riverbed']}
    />
    <BDiagramBox title="Shallow vs Deep (Pile) Foundations" caption="Shallow foundations spread load near the surface; deep piles reach down to stable bedrock.">
      <DeepPileFoundationDiagram />
    </BDiagramBox>

    <BHeading>Trussing and Bracing</BHeading>
    <BTermCard
      accent="emerald"
      text="**Cross-bracing** adds diagonal members between columns and beams, turning weak rectangular frames into rigid triangles that resist **racking** (sideways swaying or leaning)."
      examples={['Diagonal steel braces on the outside of a tall building', 'X-shaped bracing in a tower crane mast']}
    />
    <BDiagramBox title="Cross-Bracing in a Frame" caption="Diagonal braces stop the frame racking sideways under wind or earthquake loads.">
      <CrossBracingFrameDiagram />
    </BDiagramBox>

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Key Materials Used in Large Structures</h2>

    <BTermCard
      accent="blue"
      text="**Reinforced concrete (RC)** combines plain concrete, which is strong in compression but weak in tension, with steel rebar embedded inside it, which is strong in tension. Together they resist both squashing and stretching forces."
      examples={['Reinforced concrete floor slabs and beams', 'Reinforced concrete columns in a multi-storey building']}
    />
    <BTermCard
      accent="emerald"
      text="**Structural steel** has high strength in both tension and compression for its weight, making it ideal for long-span girders, tall building frames, and bridges."
      examples={['Steel girders in a long-span bridge', 'The steel frame of a skyscraper']}
    />
    <BTermCard
      accent="blue"
      text="**Pre-stressed** and **post-tensioned concrete** are made by stretching (tensioning) steel rebar or cables before or after the concrete sets, so the concrete starts off slightly squeezed. This lets the beam carry much heavier loads before it begins to crack or sag."
      examples={['Pre-stressed concrete beams in long bridge spans', 'Post-tensioned concrete floor slabs in large buildings']}
    />

    <BDivider />

    <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Failure Modes and Worked Examples</h2>

    <BTermCard accent="blue" text="**Buckling** happens when a tall, slender column bends and gives way sideways under too much compression, instead of simply crushing straight down." examples={[]} />
    <BTermCard accent="emerald" text="**Bending** happens when a beam or slab curves under load, stretching one side (tension) and squashing the other (compression), and can fail if the stresses become too great." examples={[]} />
    <BTermCard accent="blue" text="**Shearing** happens when one part of a structure is forced to slide past an adjacent part, often near supports or joints where forces change direction sharply." examples={[]} />
    <BDiagramBox title="Column Buckling" caption="A slender column under too much compression bends sideways instead of crushing straight down.">
      <ColumnBucklingDiagram />
    </BDiagramBox>
    <BDiagramBox title="Stress Zones in a Reinforced Concrete Beam" caption="Concrete resists the compression at the top; steel rebar near the bottom resists the tension.">
      <RCStressZonesDiagram />
    </BDiagramBox>

    <BLead>
      A bridge deck between two foundation supports, A and B, is 10 m long. The deck's own dead load is 500 N,
      acting at its centre. A vehicle crossing the bridge adds a live load of 300 N, positioned 4 m from
      support A. Find the total downward force and the reaction forces at A and B.
    </BLead>

    <BWorkedBox
      index={1}
      example={{
        title: 'Step 1 — Find the total downward force.',
        given: ['Dead load = 500 N.', 'Live load = 300 N.'],
        find: 'The total downward force on the bridge deck.',
        formula: 'Total load = Dead load + Live load',
        substitution: '500 + 300',
        calculation: '= 800',
        answer: 'Total load = 800 N',
        meaning: 'The foundations together must support the combined weight of the deck itself and the vehicle crossing it.',
      }}
    />
    <BWorkedBox
      index={2}
      example={{
        title: 'Step 2 — Take moments about A to find R_B.',
        given: ['Span, L = 10 m.', 'Dead load = 500 N at 5 m from A (centre).', 'Live load = 300 N at 4 m from A.'],
        find: 'The reaction force at support B (R_B).',
        formula: 'Sum of clockwise moments about A = Sum of anticlockwise moments about A',
        substitution: '(500 × 5) + (300 × 4) = R_B × 10',
        calculation: '2500 + 1200 = 3700 → R_B = 3700 / 10',
        answer: 'R_B = 370 N',
        meaning: 'Taking moments about A cancels out R_A, leaving only R_B to solve for.',
      }}
    />
    <BWorkedBox
      index={3}
      example={{
        title: 'Step 3 — Use vertical equilibrium to find R_A.',
        given: ['Total load = 800 N.', 'R_B = 370 N (from Step 2).'],
        find: 'The reaction force at support A (R_A).',
        formula: 'R_A + R_B = Total load',
        substitution: 'R_A + 370 = 800',
        calculation: 'R_A = 800 − 370',
        answer: 'R_A = 430 N',
        meaning: 'The two upward reactions must together balance the total downward load.',
      }}
    />
    <BWorkedBox
      index={4}
      example={{
        title: 'Step 4 — Check the answer.',
        given: ['R_A = 430 N.', 'R_B = 370 N.', 'Total load = 800 N.'],
        find: 'Whether the reactions are correct.',
        formula: 'R_A + R_B should equal the total load',
        substitution: '430 + 370',
        calculation: '= 800',
        answer: '800 N = 800 N ✓',
        meaning: 'The reactions balance the total load exactly, confirming the bridge is in equilibrium.',
      }}
    />

    <div className="mb-2 grid gap-4 lg:grid-cols-2">
      <BDiagramBox title="Bridge Foundation Reactions" caption="R_A and R_B push up to balance the total dead and live load on the deck.">
        <BridgeFoundationReactionsDiagram />
      </BDiagramBox>
      <BDiagramBox title="A Complete Suspension/Arch Bridge" caption="Towers, the main cable or arch, the deck, and the end supports all work together to carry the load.">
        <CompleteBridgeLabeledDiagram />
      </BDiagramBox>
    </div>
  </>
);

/* ========================================================================
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'beams',
    eyebrow: 'Chapter 5.1',
    title: 'Beams',
    heading: 'Beams — Supporting Loads Across a Span',
    intro: '',
    customBody: <BeamsBody />,
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
        question: 'A simply supported beam AB is 5 m long. A point load of 200 N is applied 3 m from support A. Find the reaction force at support B.',
        steps: [
          'Take moments about A: W × distance from A = R_B × L',
          '200 × 3 = R_B × 5',
          '600 = 5 × R_B → R_B = 120 N',
        ],
        answer: 'R_B = 120 N',
      },
      {
        question: 'Using the beam in the previous question, find the reaction force at support A.',
        steps: [
          'R_A + R_B = W',
          'R_A + 120 = 200',
          'R_A = 80 N',
        ],
        answer: 'R_A = 80 N',
      },
      {
        question: 'A cantilever beam is fixed into a wall at one end. Explain what happens to the free end when a load is added, and why the fixed end must be strong.',
        steps: [
          'The free end has no support, so it bends downward under the load.',
          'All of the bending force must be carried by the fixed end alone, since there is no second support to share it.',
          'This means the fixed end experiences the largest stresses in the whole beam.',
        ],
        answer: 'The free end droops, and the fixed end must resist all the bending on its own.',
      },
    ],
    practice: [
      'Define a beam and give two examples of where beams are used.',
      'Explain the difference between tension and compression in a bent beam.',
      'What is the neutral axis, and why does it have zero stress?',
      'Compare a simply supported beam and a cantilever beam, giving one real-life example of each.',
      'Explain why an I-beam saves material compared to a solid rectangular beam.',
      'Distinguish between a point load and a uniformly distributed load, giving one example of each.',
      'A simply supported beam AB is 8 m long. A point load of 400 N is applied 3 m from support A. Calculate the reaction forces R_A and R_B.',
    ],
  },
  {
    id: 'trusses',
    eyebrow: 'Chapter 5.2',
    title: 'Trusses',
    heading: 'Trusses — The Power of Triangles',
    intro: '',
    customBody: <TrussesBody />,
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
      {
        question: 'A triangular roof truss rests on two supports, A and B, 8 m apart. A load of 240 N acts on a joint 3 m from A. Find R_B.',
        steps: [
          'Take moments about A: W × distance from A = R_B × L',
          '240 × 3 = R_B × 8',
          '720 = 8 × R_B → R_B = 90 N',
        ],
        answer: 'R_B = 90 N',
      },
    ],
    practice: [
      'Define a truss and explain why triangles are used in truss construction.',
      'What is the difference between a strut and a tie? Give an example of each in a roof truss.',
      'Explain the advantages of using a truss instead of a solid beam for a long span.',
      'Draw a simple roof truss and label the struts and ties.',
      'Why is a triangle considered the most rigid shape?',
      'Compare a King Post truss and a Queen Post truss.',
      'Explain the difference between a Pratt truss and a Warren truss.',
      'A triangular roof truss rests on two supports, A and B, 10 m apart. A load of 300 N acts on a joint 4 m from A. Calculate the reaction forces R_A and R_B.',
    ],
  },
  {
    id: 'joints',
    eyebrow: 'Chapter 5.3',
    title: 'Joining Materials',
    heading: 'Joining Materials — Connecting Parts Together',
    intro: '',
    customBody: <JoiningMaterialsBody />,
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
      {
        question: 'Explain the difference between a temporary joint and a permanent joint, giving one example of each.',
        steps: [
          'A temporary joint, such as a bolt and nut, can be undone without damaging the parts.',
          'A permanent joint, such as a weld, cannot be separated without destroying the joint or the material.',
          'The choice depends on whether the parts will ever need to be taken apart again.',
        ],
        answer: 'Temporary joints (e.g. bolts) can be disassembled; permanent joints (e.g. welds) cannot.',
      },
    ],
    practice: [
      'List four different methods of joining materials.',
      'Explain why a larger contact area makes a joint stronger.',
      'Compare soldering and welding as joining methods for metals.',
      'What factors affect the strength of a joint?',
      'Why might a tongue-and-groove joint be used in flooring?',
      'Explain the difference between a temporary joint and a permanent joint, giving one example of each.',
      'Compare a pop rivet and a solid rivet.',
      'Explain why a mortise and tenon joint is stronger than a simple butt joint.',
      'State two factors an engineer should consider when choosing how to join two pieces of metal.',
    ],
  },
  {
    id: 'large-structures',
    eyebrow: 'Chapter 5.4',
    title: 'Large Structures',
    heading: 'Large Structures — Materials and Design',
    intro: '',
    customBody: <LargeStructuresBody />,
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
        question: 'Distinguish between a dead load and a live load on a building.',
        steps: [
          'A dead load is the permanent weight of the structure\'s own materials, such as its walls and floors.',
          'A live load is a temporary, movable weight, such as people or furniture.',
          'Dead loads never change; live loads can change in size or position, or disappear entirely.',
        ],
        answer: 'Dead load is the structure\'s own permanent weight; live load is temporary and movable.',
      },
      {
        question: 'A bridge deck 10 m long between supports A and B carries a dead load of 500 N at its centre and a live load of 300 N at 4 m from A. Find R_A and R_B.',
        steps: [
          'Total load = 500 + 300 = 800 N',
          'Take moments about A: (500 × 5) + (300 × 4) = R_B × 10 → R_B = 370 N',
          'R_A + R_B = 800 → R_A = 800 − 370 = 430 N',
        ],
        answer: 'R_A = 430 N, R_B = 370 N',
      },
    ],
    practice: [
      'Name four materials used in large structures and describe one property of each.',
      'List the four main types of bridges and give an example of where each might be used.',
      'Explain why reinforced concrete is used in large structures instead of plain concrete.',
      'What is the advantage of an arch dam over a straight dam?',
      'Describe the design of a suspension bridge and explain how it supports its own weight and the load.',
      'Distinguish between a dead load and a live load, giving one example of each.',
      'Explain why a deep pile foundation is used instead of a shallow foundation on soft ground.',
      'Explain how cross-bracing helps a tall building resist wind or earthquake loads.',
      'Describe what happens to a column when it buckles.',
      'A bridge deck 12 m long carries a dead load of 600 N at its centre and a live load of 400 N at 5 m from support A. Calculate the total load and the reaction forces at each support.',
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
        {section.customBody ? (
          section.customBody
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                {section.title}
              </h1>
            </div>
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
                <div className="mb-6 min-w-0 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-3 sm:p-4">
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
          </>
        )}
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
    <div id="ga-scroll-area" className="physics-lesson-content min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-slate-50 pb-20 font-sans text-slate-900">
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

export default MechanicalStructures;
