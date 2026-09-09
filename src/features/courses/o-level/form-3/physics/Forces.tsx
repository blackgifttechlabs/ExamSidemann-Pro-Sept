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
  type: 'image' | 'hooke' | 'moments' | 'pressure' | 'freebody';
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
  CONTENT DATA
  ======================================================================== */

const sections: Section[] = [
  {
    id: 'hookes-law',
    eyebrow: 'Chapter 3.1',
    title: 'Effect of Force on Materials',
    heading: 'Effect of Force on Materials — Hooke\'s Law',
    intro:
      'A force can change the shape, size, or motion of an object. When a force is applied to a material, it can **stretch** (tension), **squeeze** (compression), or **bend** it.',
    intro2:
      'The relationship between force and extension is described by **Hooke\'s Law**, which states that the extension of a spring is directly proportional to the applied force, provided the elastic limit is not exceeded.',
    introMore: [
      '**Hooke\'s Law:** F = k e, where F is force, k is the spring constant (stiffness), and e is the extension.',
      '**Spring constant (k):** a measure of how stiff a spring is — the force needed per unit extension.',
      '**Elastic limit:** the maximum force a material can withstand without being permanently deformed.',
    ],
    definition:
      '**Hooke\'s Law** states that the extension of an elastic material is directly proportional to the applied force, as long as the elastic limit is not exceeded.\n\n' +
      'Mathematically: F ∝ e → F = k e, where k is the spring constant.',
    method: {
      title: 'Practical: Determining Spring Constant',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Measure original length', text: 'Hang a spring from a clamp and measure its original length (l₀).' },
        { step: 2, formula: 'Add masses', text: 'Add known masses one at a time, measure the new length each time, and calculate extension (e = new length − original length).' },
        { step: 3, formula: 'Plot graph', text: 'Plot a graph of force (weight = mg) on the y-axis against extension on the x-axis. The gradient gives the spring constant k.' },
        { step: 4, formula: 'k = gradient', text: 'If the graph is a straight line through the origin, the spring obeys Hooke\'s Law.' },
      ],
    },
    method2: {
      title: 'Key Points About Hooke\'s Law',
      kind: 'rules',
      rules: [
        { rule: 'Extension is directly proportional to force.', example: 'Doubling the force doubles the extension (if elastic limit is not exceeded).' },
        { rule: 'The spring constant k is a measure of stiffness.', example: 'A larger k means a stiffer spring — more force is needed for the same extension.' },
        { rule: 'The elastic limit is the maximum force without permanent deformation.', example: 'Beyond this point, the material will not return to its original shape.' },
        { rule: 'Hooke\'s Law applies to many materials, not just springs.', example: 'Metals, rubber bands, and even bones obey similar relationships up to a limit.' },
      ],
    },
    keyFormula: {
      label: 'Hooke\'s Law:',
      formula: 'F = k e',
    },
    examples: [
      {
        question: 'A spring has a spring constant of 25 N/m. Calculate the force needed to extend it by 0.08 m.',
        steps: ['k = 25 N/m', 'e = 0.08 m', 'F = k × e = 25 × 0.08 = 2.0 N'],
        answer: 'F = 2.0 N',
      },
      {
        question: 'A force of 12 N extends a spring by 0.03 m. Calculate the spring constant.',
        steps: ['F = 12 N', 'e = 0.03 m', 'k = F / e = 12 / 0.03 = 400 N/m'],
        answer: 'k = 400 N/m',
      },
      {
        question: 'A spring has an original length of 0.20 m. When a 5 N weight is hung on it, the length becomes 0.32 m. Calculate the spring constant.',
        steps: ['Extension e = 0.32 − 0.20 = 0.12 m', 'F = 5 N', 'k = F / e = 5 / 0.12 ≈ 41.7 N/m'],
        answer: 'k ≈ 41.7 N/m',
      },
    ],
    practice: [
      'Define Hooke\'s Law and state the relationship between force and extension.',
      'A spring has a spring constant of 60 N/m. How much force is needed to stretch it by 0.15 m?',
      'A force of 8 N causes a spring to extend by 0.04 m. What is the spring constant?',
      'Explain what is meant by the elastic limit and why it is important.',
      'Describe an experiment to determine the spring constant of a spring using a set of masses.',
    ],
  },
  {
    id: 'newtons-laws',
    eyebrow: 'Chapter 3.2',
    title: 'Effect of Force on Motion',
    heading: 'Effect of Force on Motion — Newton\'s Laws',
    intro:
      'Forces cause changes in motion. **Newton\'s three laws of motion** describe how forces affect the movement of objects.',
    intro2:
      'We also define **weight**, **momentum**, and **inertia** as key concepts in understanding motion under the influence of forces.',
    introMore: [
      '**Weight (W)** = the force of gravity acting on a mass: W = mg.',
      '**Momentum (p)** = mass × velocity: p = mv. It is the "quantity of motion".',
      '**Inertia** = the tendency of an object to resist changes in its state of motion. Objects with more mass have more inertia.',
      '**Newton\'s 1st Law:** An object stays at rest or moves at constant velocity unless acted upon by a resultant (unbalanced) force.',
      '**Newton\'s 2nd Law:** The resultant force on an object equals mass times acceleration: F = ma.',
      '**Newton\'s 3rd Law:** For every action, there is an equal and opposite reaction.',
    ],
    definition:
      '**Newton\'s Second Law** states that the acceleration of an object is directly proportional to the resultant force acting on it, and inversely proportional to its mass.\n\n' +
      'Mathematically: F = ma, where F is the resultant force, m is mass, and a is acceleration.',
    method: {
      title: 'Key Equations of Motion with Forces',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'F = ma', text: 'Newton\'s Second Law — force equals mass times acceleration.' },
        { step: 2, formula: 'W = mg', text: 'Weight is mass times gravitational field strength (g ≈ 9.8 m/s²).' },
        { step: 3, formula: 'p = mv', text: 'Momentum is mass times velocity.' },
        { step: 4, formula: 'F = Δp / Δt', text: 'Force can also be expressed as the rate of change of momentum.' },
      ],
    },
    method2: {
      title: 'Newton\'s Three Laws',
      kind: 'rules',
      rules: [
        { rule: '1st Law — Inertia', example: 'A book on a table stays at rest unless someone pushes it.' },
        { rule: '2nd Law — F = ma', example: 'A heavier object requires more force to accelerate than a lighter one.' },
        { rule: '3rd Law — Action & Reaction', example: 'When you push on a wall, the wall pushes back with the same force.' },
      ],
    },
    keyFormula: {
      label: 'Core formulas:',
      formula: (
        <>
          F = ma &nbsp;&nbsp;|&nbsp;&nbsp; W = mg &nbsp;&nbsp;|&nbsp;&nbsp; p = mv
        </>
      ),
    },
    examples: [
      {
        question: 'A car of mass 1200 kg accelerates from rest at 2.5 m/s². Calculate the resultant force acting on it.',
        steps: ['m = 1200 kg', 'a = 2.5 m/s²', 'F = ma = 1200 × 2.5 = 3000 N'],
        answer: 'F = 3000 N',
      },
      {
        question: 'An object has a mass of 5 kg. What is its weight on Earth? (g = 10 m/s²)',
        steps: ['m = 5 kg', 'g = 10 m/s²', 'W = mg = 5 × 10 = 50 N'],
        answer: 'W = 50 N',
      },
      {
        question: 'A tennis ball of mass 0.06 kg is hit with a force of 18 N. Calculate its acceleration.',
        steps: ['m = 0.06 kg', 'F = 18 N', 'a = F / m = 18 / 0.06 = 300 m/s²'],
        answer: 'a = 300 m/s²',
      },
      {
        question: 'A 0.2 kg ball moving at 5 m/s strikes a wall and rebounds at 5 m/s in the opposite direction. The contact time is 0.1 s. Calculate the force on the ball.',
        steps: ['Δp = m(v − u) = 0.2(−5 − 5) = 0.2(−10) = −2 kg·m/s', 'F = Δp / Δt = (−2) / 0.1 = −20 N (magnitude 20 N)'],
        answer: 'F = 20 N (opposite to initial direction)',
      },
    ],
    practice: [
      'State Newton\'s three laws of motion.',
      'What is the weight of a 75 kg person on Earth? (g = 10 m/s²)',
      'A force of 400 N accelerates a 100 kg object from rest. What is its acceleration?',
      'Explain the concept of inertia and give an example.',
      'A 0.5 kg ball is kicked with a force of 30 N. Calculate the acceleration of the ball.',
    ],
  },
  {
    id: 'friction-circular',
    eyebrow: 'Chapter 3.3',
    title: 'Friction and Circular Motion',
    heading: 'Friction and Circular Motion',
    intro:
      '**Friction** is a force that opposes relative motion between two surfaces in contact. It can be a help or a hindrance.',
    intro2:
      'When an object moves in a circular path, it requires a force directed towards the centre of the circle — this is called the **centripetal force**.',
    introMore: [
      'Friction acts to slow down motion or prevent slipping.',
      'Ways to reduce friction: lubrication (oil/grease), ball bearings, polishing/smoothing surfaces.',
      'Ways to increase friction: roughening surfaces, using rubber or grippy materials.',
      '**Centripetal force:** the resultant force towards the centre of the circle that keeps an object moving in a circular path.',
      '**Centripetal acceleration:** the acceleration of an object moving in a circle, always directed towards the centre.',
    ],
    definition:
      '**Friction** is a force that opposes the relative motion (or tendency to move) of two surfaces in contact.\n\n' +
      '**Centripetal force** is the net force that acts on an object moving in a circular path, directed towards the centre of the circle.',
    method: {
      title: 'Ways to Change Friction',
      kind: 'rules',
      rules: [
        { rule: 'Lubrication (oil, grease) reduces friction.', example: 'Engine oil reduces wear in car engines.' },
        { rule: 'Ball bearings reduce friction by rolling instead of sliding.', example: 'Wheels on cars or bicycles.' },
        { rule: 'Polishing surfaces reduces friction.', example: 'Smooth metal surfaces slide easily.' },
        { rule: 'Roughening surfaces increases friction.', example: 'Sandpaper, tyres with treads.' },
        { rule: 'Using materials like rubber increases grip.', example: 'Shoe soles, tennis racket handles.' },
      ],
    },
    method2: {
      title: 'Circular Motion Essentials',
      kind: 'rules',
      rules: [
        { rule: 'A centripetal force is needed for circular motion.', example: 'A satellite orbiting Earth is kept in orbit by gravity (centripetal force).' },
        { rule: 'The centripetal force is always perpendicular to the velocity.', example: 'It changes the direction of motion, not the speed.' },
        { rule: 'If the centripetal force is removed, the object moves in a straight line (Newton\'s 1st law).', example: 'Releasing a spinning stone causes it to fly off tangentially.' },
        { rule: 'The centripetal acceleration is directed towards the centre.', example: 'a = v²/r.' },
      ],
    },
    keyFormula: {
      label: 'Centripetal acceleration:',
      formula: 'a = v² / r   (v = speed, r = radius)',
    },
    examples: [
      {
        question: 'A car is moving around a circular track of radius 50 m at a speed of 20 m/s. Calculate the centripetal acceleration.',
        steps: ['v = 20 m/s', 'r = 50 m', 'a = v² / r = 20² / 50 = 400 / 50 = 8 m/s²'],
        answer: 'a = 8 m/s²',
      },
      {
        question: 'Explain why a cyclist leaning into a bend is an example of circular motion.',
        steps: ['The cyclist leans so that the friction from the ground provides a centripetal force.', 'The centripetal force acts towards the centre of the bend, changing the cyclist\'s direction.'],
        answer: 'The cyclist\'s lean helps to provide the required centripetal force to turn the corner.',
      },
    ],
    practice: [
      'Define friction and give two examples where friction is useful and two where it is undesirable.',
      'List three ways to reduce friction.',
      'What is centripetal force? Why is it needed for circular motion?',
      'A stone is tied to a string and whirled in a horizontal circle. If the string breaks, in what direction does the stone move? Explain using Newton\'s first law.',
      'A car travels at 15 m/s around a curve of radius 25 m. Calculate the centripetal acceleration.',
    ],
  },
  {
    id: 'moments',
    eyebrow: 'Chapter 3.4',
    title: 'Turning Effect of a Force',
    heading: 'Turning Effect of a Force — Moments',
    intro:
      'A force can cause an object to rotate about a pivot. The turning effect is called a **moment**.',
    intro2:
      'The moment of a force depends on the size of the force and the perpendicular distance from the pivot to the line of action of the force.',
    introMore: [
      '**Moment = Force × Perpendicular distance from pivot.**',
      'The **principle of moments** states that for an object in equilibrium, the sum of clockwise moments equals the sum of anticlockwise moments.',
      'Everyday examples: opening a door, using a lever, a wheelbarrow, a crowbar.',
    ],
    definition:
      'The **moment of a force** is the turning effect of the force about a pivot, calculated as the product of the force and the perpendicular distance from the pivot to the line of action of the force.\n\n' +
      'For equilibrium: **Sum of clockwise moments = Sum of anticlockwise moments.**',
    method: {
      title: 'Calculating Moments',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Identify forces', text: 'List all the forces acting on the object and their distances from the pivot.' },
        { step: 2, formula: 'Choose direction', text: 'Decide which forces cause clockwise moments and which cause anticlockwise moments.' },
        { step: 3, formula: 'M = F × d', text: 'Calculate each moment using M = F × d (d is perpendicular distance).' },
        { step: 4, formula: 'Apply principle', text: 'For equilibrium, set sum of clockwise moments equal to sum of anticlockwise moments and solve.' },
      ],
    },
    method2: {
      title: 'Everyday Examples of Moments',
      kind: 'rules',
      rules: [
        { rule: 'Door handle is placed far from the hinges.', example: 'This increases the perpendicular distance, so less force is needed to open the door.' },
        { rule: 'A crowbar uses a long handle to magnify force.', example: 'A small force applied at the end creates a large moment.' },
        { rule: 'A wheelbarrow lifts heavy loads with less effort.', example: 'The load is placed near the wheel (pivot) and the handles are far from the pivot.' },
      ],
    },
    keyFormula: {
      label: 'Moment equation:',
      formula: 'M = F × d',
    },
    examples: [
      {
        question: 'A force of 20 N is applied at a distance of 0.3 m from a pivot. Calculate the moment.',
        steps: ['F = 20 N', 'd = 0.3 m', 'M = F × d = 20 × 0.3 = 6.0 N·m'],
        answer: 'M = 6.0 N·m',
      },
      {
        question: 'A metre rule is pivoted at its centre. A weight of 5 N hangs at the 20 cm mark on the left, and a weight of 2 N hangs at the 70 cm mark on the right. Calculate the resultant moment.',
        steps: ['Left distance from pivot: 50 cm − 20 cm = 30 cm = 0.30 m', 'Right distance: 70 cm − 50 cm = 20 cm = 0.20 m', 'Clockwise moment (right): 2 × 0.20 = 0.40 N·m', 'Anticlockwise moment (left): 5 × 0.30 = 1.50 N·m', 'Resultant moment = 1.50 − 0.40 = 1.10 N·m (anticlockwise)'],
        answer: 'Resultant moment = 1.10 N·m anticlockwise',
      },
      {
        question: 'A see-saw is balanced with a child of mass 30 kg on the left at 1.5 m from the pivot. Where must a child of mass 20 kg sit on the right to balance? (g = 10 N/kg)',
        steps: ['Weight left = 30 × 10 = 300 N', 'Weight right = 20 × 10 = 200 N', 'Clockwise moment = anticlockwise moment: 300 × 1.5 = 200 × d → 450 = 200d → d = 2.25 m'],
        answer: 'd = 2.25 m from the pivot.',
      },
    ],
    practice: [
      'Define moment of a force and state its unit.',
      'A force of 15 N is applied perpendicular to a door at a distance of 0.8 m from the hinges. Calculate the moment.',
      'State the principle of moments.',
      'A beam is balanced when a 50 N weight is placed 2 m from the pivot on one side, and a 25 N weight is placed on the other side. How far from the pivot must the 25 N weight be placed?',
      'Explain why a door handle is positioned far from the hinges.',
    ],
  },
  {
    id: 'centre-of-mass',
    eyebrow: 'Chapter 3.5',
    title: 'Centre of Mass / Centre of Gravity',
    heading: 'Centre of Mass and Stability',
    intro:
      'The **centre of mass** is the point where the entire mass of an object can be considered to be concentrated. The **centre of gravity** is the point where the entire weight acts.',
    intro2:
      'For objects near the Earth\'s surface, these points are essentially the same. The position of the centre of mass affects the stability of an object.',
    introMore: [
      '**Stable equilibrium:** a low centre of mass and a wide base. When tilted, it returns to its original position.',
      '**Unstable equilibrium:** a high centre of mass and a narrow base. It falls over easily.',
      '**Neutral equilibrium:** the centre of mass remains at the same height when displaced; it stays in its new position (e.g., a ball on a flat surface).',
    ],
    definition:
      'The **centre of mass** (or centre of gravity) is the single point where the whole weight of a body can be considered to act.\n\n' +
      'For a uniform object, the centre of mass is at its geometric centre. For irregular shapes, it can be found experimentally by suspension.',
    method: {
      title: 'Finding the Centre of Mass of a Lamina',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'Suspend lamina', text: 'Suspend the irregular lamina from a point near its edge using a pin or clamp.' },
        { step: 2, formula: 'Draw vertical line', text: 'Hang a plumb line from the suspension point and draw a vertical line on the lamina.' },
        { step: 3, formula: 'Repeat', text: 'Suspend the lamina from another point and draw another vertical line.' },
        { step: 4, formula: 'Intersection', text: 'The intersection of these lines is the centre of mass.' },
      ],
    },
    method2: {
      title: 'Stability and Centre of Mass',
      kind: 'rules',
      rules: [
        { rule: 'Stable equilibrium: low centre of mass, wide base.', example: 'A pyramid or a racing car with a low centre of mass.' },
        { rule: 'Unstable equilibrium: high centre of mass, narrow base.', example: 'A pencil balanced on its tip.' },
        { rule: 'Neutral equilibrium: centre of mass stays at same height.', example: 'A ball on a flat table.' },
        { rule: 'Increasing the base width increases stability.', example: 'A tall chair with a wide base is more stable than one with a narrow base.' },
      ],
    },
    keyFormula: {
      label: 'For a uniform object, the centre of mass is at the centre of the object.',
      formula: 'e.g. centre of a sphere, centre of a rectangular block',
    },
    examples: [
      {
        question: 'A rectangular block is placed on a table. Describe how its stability changes if it is turned on its side.',
        steps: ['When placed on its largest face, it has a low centre of mass and a wide base — stable.', 'When turned on its narrow side, the centre of mass is higher and the base is narrower — less stable.'],
        answer: 'Stability decreases.',
      },
      {
        question: 'Explain why racing cars have a low centre of mass.',
        steps: ['A low centre of mass reduces the chance of the car rolling over during fast cornering.', 'It also allows for a wider track, increasing stability.'],
        answer: 'To improve stability and prevent rollovers.',
      },
    ],
    practice: [
      'Define centre of mass and centre of gravity.',
      'Describe an experiment to find the centre of mass of an irregular lamina.',
      'Explain the difference between stable, unstable, and neutral equilibrium. Give an example of each.',
      'Why is it important for a double-decker bus to have a low centre of mass?',
      'A cone is placed upright. Is it in stable, unstable, or neutral equilibrium? Explain.',
    ],
  },
  {
    id: 'pressure',
    eyebrow: 'Chapter 3.6',
    title: 'Pressure',
    heading: 'Pressure — Force per Unit Area',
    intro:
      '**Pressure** is defined as the force acting perpendicularly per unit area. It tells us how concentrated a force is.',
    intro2:
      'In fluids, pressure increases with depth and with the density of the fluid. Atmospheric pressure is the pressure due to the weight of the air above us.',
    introMore: [
      '**Pressure formula:** P = F / A.',
      '**Pressure in a fluid:** P = ρ g h, where ρ is density, g is gravitational field strength, and h is depth.',
      '**Atmospheric pressure** is measured using a barometer.',
      '**Manometer** measures the pressure of a gas.',
      'Applications: hydraulic systems, water supply, weather prediction using barometers.',
    ],
    definition:
      '**Pressure** is the force acting per unit area. It is measured in pascals (Pa), where 1 Pa = 1 N/m².\n\n' +
      'For fluids: pressure increases with depth and density, and acts in all directions.',
    method: {
      title: 'Calculating Pressure',
      kind: 'steps',
      rows: [
        { step: 1, formula: 'P = F / A', text: 'Identify the force (F) applied perpendicular to the surface and the area (A) over which it acts.' },
        { step: 2, formula: 'P = ρ g h', text: 'For a fluid at depth h, use P = ρ g h (density of fluid, g = 9.8 m/s², depth h).' },
        { step: 3, formula: 'Units', text: 'Pressure is measured in pascals (Pa) or N/m². Atmospheric pressure is about 101,000 Pa (101 kPa).' },
      ],
    },
    method2: {
      title: 'Measuring Pressure — Barometers and Manometers',
      kind: 'rules',
      rules: [
        { rule: 'Barometer measures atmospheric pressure.', example: 'Mercury barometer or aneroid barometer.' },
        { rule: 'Manometer measures gas pressure relative to atmospheric pressure.', example: 'U-tube manometer with liquid.' },
        { rule: 'Pressure increases with depth in a fluid.', example: 'Scuba divers experience higher pressure at greater depths.' },
        { rule: 'Atmospheric pressure changes with altitude.', example: 'Pressure is lower at high altitudes (top of a mountain).' },
      ],
    },
    keyFormula: {
      label: 'Pressure formulas:',
      formula: (
        <>
          P = F / A &nbsp;&nbsp;|&nbsp;&nbsp; P = ρ g h
        </>
      ),
    },
    examples: [
      {
        question: 'A force of 200 N acts on an area of 0.5 m². Calculate the pressure.',
        steps: ['F = 200 N', 'A = 0.5 m²', 'P = F / A = 200 / 0.5 = 400 Pa'],
        answer: 'P = 400 Pa',
      },
      {
        question: 'Calculate the pressure at a depth of 10 m in water. (Density of water = 1000 kg/m³, g = 10 m/s²)',
        steps: ['ρ = 1000 kg/m³', 'g = 10 m/s²', 'h = 10 m', 'P = ρ g h = 1000 × 10 × 10 = 100,000 Pa = 100 kPa'],
        answer: 'P = 100 kPa',
      },
      {
        question: 'A hydraulic lift has a small piston of area 0.02 m² and a large piston of area 0.5 m². If a force of 100 N is applied to the small piston, what force is exerted on the large piston?',
        steps: ['Pressure is transmitted equally: P = F₁/A₁ = F₂/A₂.', '100 / 0.02 = F₂ / 0.5 → 5000 = F₂ / 0.5 → F₂ = 2500 N'],
        answer: 'F₂ = 2500 N',
      },
    ],
    practice: [
      'Define pressure and state its SI unit.',
      'A book of weight 25 N rests on a table. If the area of contact is 0.02 m², calculate the pressure on the table.',
      'Explain why pressure in a fluid increases with depth.',
      'What is atmospheric pressure? How is it measured?',
      'A manometer shows a difference in liquid height of 15 cm. If the liquid is mercury (density = 13,600 kg/m³), calculate the pressure difference. (g = 10 m/s²)',
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

export const Forces: React.FC = () => {
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
              TOPIC 3
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Forces
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Forces affect the shape, motion, and equilibrium of objects. In this chapter, you'll learn about
            Hooke's Law, Newton's Laws, friction, circular motion, moments, centre of mass, and pressure —
            all with clear explanations, worked examples, and practical applications.
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

export default Forces;