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
  FORCE INTRO — 3D/WebGL EXAMPLES (Three.js)
  ======================================================================== */

/** Generic Three.js scene lifecycle hook: sets up renderer/camera/lights on
 *  a container div, runs `build` once to populate the scene and get back a
 *  per-frame update callback, then animates it with cleanup on unmount. */
function useForceScene(
  containerRef: React.RefObject<HTMLDivElement>,
  build: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => (t: number) => void
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 220;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 6.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const update = build(scene, camera);

    let rafId = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      update(clock.getElapsedTime());
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || width;
      height = container.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      scene.traverse(obj => {
        const mesh = obj as THREE.Mesh;
        if ((mesh as any).geometry) (mesh as any).geometry.dispose();
        const mat = (mesh as any).material;
        if (mat) {
          if (Array.isArray(mat)) mat.forEach((m: THREE.Material) => m.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Builds a small pill-shaped text label as a sprite that always faces the
 *  camera. Used to caption force arrows without touching the 3D object. */
function makeLabelSprite(text: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const fontSize = 44;
  ctx.font = `bold ${fontSize}px sans-serif`;
  const padding = 18;
  const textWidth = ctx.measureText(text).width;
  canvas.width = Math.ceil(textWidth + padding * 2);
  canvas.height = fontSize + padding * 2;

  ctx.font = `bold ${fontSize}px sans-serif`;
  const r = 20;
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  ctx.strokeStyle = '#ff3b30';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(r, 1);
  ctx.lineTo(canvas.width - r, 1);
  ctx.quadraticCurveTo(canvas.width - 1, 1, canvas.width - 1, r);
  ctx.lineTo(canvas.width - 1, canvas.height - r);
  ctx.quadraticCurveTo(canvas.width - 1, canvas.height - 1, canvas.width - r, canvas.height - 1);
  ctx.lineTo(r, canvas.height - 1);
  ctx.quadraticCurveTo(1, canvas.height - 1, 1, canvas.height - r);
  ctx.lineTo(1, r);
  ctx.quadraticCurveTo(1, 1, r, 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ff3b30';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, padding, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false, transparent: true });
  const sprite = new THREE.Sprite(material);
  const aspect = canvas.width / canvas.height;
  const spriteHeight = 0.18;
  sprite.scale.set(spriteHeight * aspect, spriteHeight, 1);
  sprite.renderOrder = 999;
  return sprite;
}

/** Gravity: fruit falls from a lush, fruit-laden tree; the camera zooms in
 *  and tracks the falling fruit all the way down, with a downward arrow
 *  showing the force of gravity. */
const GravityScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.6, 32),
      new THREE.MeshStandardMaterial({ color: 0x9ed9a8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.3;
    scene.add(ground);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.24, 2.3, 10),
      new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
    );
    trunk.position.set(-0.9, -0.15, 0);
    scene.add(trunk);

    const branchGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.9, 6);
    const branchMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
    const branchDefs: [number, number, number, number, number][] = [
      [-0.55, 1.15, 0.1, 0.5, 0.55],
      [-1.3, 1.3, -0.2, -0.6, 0.4],
      [-0.9, 1.7, 0.3, 0.15, -0.3],
    ];
    branchDefs.forEach(([x, y, z, rz, rx]) => {
      const branch = new THREE.Mesh(branchGeo, branchMat);
      branch.position.set(x, y, z);
      branch.rotation.z = rz;
      branch.rotation.x = rx;
      scene.add(branch);
    });

    const foliageClusters: [number, number, number, number, number][] = [
      [-0.9, 1.45, 0, 1.3, 0x4caf50],
      [-1.55, 1.2, 0.25, 0.85, 0x43a047],
      [-0.3, 1.15, -0.3, 0.8, 0x66bb6a],
      [-1.1, 2.0, -0.15, 0.78, 0x388e3c],
      [-0.45, 1.9, 0.35, 0.72, 0x4caf50],
      [-1.4, 1.65, 0.55, 0.68, 0x66bb6a],
    ];
    foliageClusters.forEach(([x, y, z, scale, color]) => {
      const cluster = new THREE.Mesh(
        new THREE.SphereGeometry(1, 14, 14),
        new THREE.MeshStandardMaterial({ color })
      );
      cluster.position.set(x, y, z);
      cluster.scale.setScalar(scale);
      scene.add(cluster);
    });

    // The one fruit that falls — kept on an exposed twig outside the canopy
    // so its drop path is never blocked by leaves.
    const fallerPos = new THREE.Vector3(0.15, 1.65, 0.4);

    // Every other fruit is placed ON THE SURFACE of a foliage cluster
    // (center + outward direction * cluster radius + small margin), so it
    // can never end up floating inside the leaves.
    const fruitColors = [0xd32f2f, 0xffa000, 0xc62828, 0xef6c00, 0xb71c1c, 0xffb300];

    interface FruitDef { clusterIndex: number; dir: [number, number, number]; }
    const fruitDefs: FruitDef[] = [
      { clusterIndex: 0, dir: [0.7, -0.3, 0.6] },
      { clusterIndex: 0, dir: [-0.6, -0.4, 0.5] },
      { clusterIndex: 0, dir: [0.2, -0.6, -0.7] },
      { clusterIndex: 0, dir: [0.8, 0.2, -0.5] },
      { clusterIndex: 0, dir: [-0.2, -0.7, 0.4] },
      { clusterIndex: 0, dir: [0.9, -0.1, 0.2] },
      { clusterIndex: 1, dir: [0.5, -0.5, 0.6] },
      { clusterIndex: 1, dir: [-0.4, -0.6, 0.3] },
      { clusterIndex: 2, dir: [0.6, -0.4, 0.5] },
      { clusterIndex: 2, dir: [-0.3, -0.5, -0.6] },
      { clusterIndex: 3, dir: [0.4, -0.5, 0.6] },
      { clusterIndex: 3, dir: [-0.5, -0.3, -0.5] },
      { clusterIndex: 4, dir: [0.6, -0.4, 0.4] },
      { clusterIndex: 4, dir: [-0.4, -0.6, 0.3] },
      { clusterIndex: 5, dir: [0.5, -0.5, 0.5] },
      { clusterIndex: 5, dir: [-0.6, -0.3, 0.4] },
    ];

    const fruits: THREE.Mesh[] = [];
    const stems: THREE.Mesh[] = [];

    // Faller first (index 0), so downstream code (`fruits[0]`) still points
    // at the falling fruit.
    const faller = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd32f2f })
    );
    faller.position.copy(fallerPos);
    scene.add(faller);
    fruits.push(faller);

    const fallerStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.02, 0.1, 6),
      new THREE.MeshStandardMaterial({ color: 0x5d4037 })
    );
    fallerStem.position.set(fallerPos.x, fallerPos.y + 0.13, fallerPos.z);
    scene.add(fallerStem);
    stems.push(fallerStem);

    const fruitRadiusFor = (i: number) => 0.11 + (i % 3) * 0.01;

    // Pushes the candidate point outward, along `dir`, until it clears
    // EVERY foliage cluster's sphere (not just the one it's assigned to) —
    // this is what actually prevents fruit from ending up buried inside
    // an overlapping neighbor cluster.
    const findSurfacePosition = (clusterIndex: number, dir: THREE.Vector3, rad: number): THREE.Vector3 => {
      const [cx, cy, cz, scale] = foliageClusters[clusterIndex];
      const center = new THREE.Vector3(cx, cy, cz);
      const d = dir.clone().normalize();
      let distance = scale + rad + 0.03;
      let pos = center.clone().addScaledVector(d, distance);

      for (let attempt = 0; attempt < 24; attempt++) {
        const overlapping = foliageClusters.some(([ocx, ocy, ocz, oscale]) => {
          const other = new THREE.Vector3(ocx, ocy, ocz);
          return pos.distanceTo(other) < oscale + rad + 0.03;
        });
        if (!overlapping) break;
        distance += 0.05;
        pos = center.clone().addScaledVector(d, distance);
      }
      return pos;
    };

    fruitDefs.forEach((def, i) => {
      const [cx, cy, cz] = foliageClusters[def.clusterIndex];
      const dir = new THREE.Vector3(...def.dir);
      const rad = fruitRadiusFor(i);
      const pos = findSurfacePosition(def.clusterIndex, dir, rad);

      const fruit = new THREE.Mesh(
        new THREE.SphereGeometry(rad, 14, 14),
        new THREE.MeshStandardMaterial({ color: fruitColors[i % fruitColors.length] })
      );
      fruit.position.copy(pos);
      scene.add(fruit);
      fruits.push(fruit);

      const stemMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.016, 0.08, 6),
        new THREE.MeshStandardMaterial({ color: 0x5d4037 })
      );
      stemMesh.position.set(pos.x, pos.y + 0.1, pos.z);
      stemMesh.lookAt(new THREE.Vector3(cx, cy, cz));
      stemMesh.rotateX(Math.PI / 2);
      scene.add(stemMesh);
      stems.push(stemMesh);
    });

    const branchPos = fallerPos;
    const apple = fruits[0];
    const stem = stems[0];
    const groundY = -1.24;

    const arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      branchPos.clone(),
      0.42,
      0xff3b30,
      0.14,
      0.09
    );
    scene.add(arrow);

    const gravityLabel = makeLabelSprite('Force of Gravity');
    scene.add(gravityLabel);

    const cycle = 5.8;
    const fallStart = 0.9;
    const fallEnd = 4.1;

    const wideCamPos = camera.position.clone();
    const wideLookAt = new THREE.Vector3(0, 0.2, 0);

    const smoothstep = (e0: number, e1: number, x: number) => {
      const c = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    return (t: number) => {
      const local = t % cycle;
      let y = branchPos.y;
      let visible = false;

      if (local < fallStart) {
        y = branchPos.y;
      } else if (local < fallEnd) {
        const p = (local - fallStart) / (fallEnd - fallStart);
        y = branchPos.y - (branchPos.y - groundY) * (p * p);
        visible = true;
      } else if (local < fallEnd + 0.35) {
        const p = (local - fallEnd) / 0.35;
        y = groundY + Math.abs(Math.sin(p * Math.PI)) * 0.09 * (1 - p);
        visible = true;
      } else {
        y = groundY;
      }

      apple.position.set(branchPos.x, y, branchPos.z);
      stem.position.set(branchPos.x, y + 0.15, branchPos.z);
      arrow.position.set(branchPos.x, y + 0.06, branchPos.z);
      arrow.visible = visible;
      gravityLabel.position.set(branchPos.x + 0.65, y + 0.35, branchPos.z);
      gravityLabel.visible = visible;

      const fallMid = fallStart + (fallEnd - fallStart) * 0.5;
      const zoomInStart = fallMid;
      const zoomInEnd = fallMid + 1.0;
      const zoomHoldEnd = fallEnd + 0.35;
      const zoomOutEnd = zoomHoldEnd + 1.2;

      let zoom = 0;
      if (local < zoomInStart) zoom = 0;
      else if (local < zoomInEnd) zoom = smoothstep(zoomInStart, zoomInEnd, local);
      else if (local < zoomHoldEnd) zoom = 1;
      else if (local < zoomOutEnd) zoom = 1 - smoothstep(zoomHoldEnd, zoomOutEnd, local);
      else zoom = 0;

      const closeCamPos = new THREE.Vector3(branchPos.x + 0.85, y + 0.3, branchPos.z + 1.5);
      camera.position.lerpVectors(wideCamPos, closeCamPos, zoom);

      const lookTarget = wideLookAt.clone().lerp(apple.position, zoom);
      camera.lookAt(lookTarget);
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Friction: a tyre rolls along a road while a friction-force arrow at the
 *  contact patch points backward, opposing the direction of travel. */
/** Builds a repeating asphalt texture with a dashed centre lane line,
 *  drawn on canvas so the road reads as tarmac rather than a flat gray
 *  plane. */
function makeAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#3a3d40';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle speckled grain for an asphalt feel.
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = Math.random() > 0.5 ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.08)';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, 1.4, 1.4);
  }

  // Dashed centre lane line running along the length of the road.
  ctx.fillStyle = '#e8d84a';
  const dashW = 36;
  const gapW = 26;
  const lineY = canvas.height / 2 - 4;
  for (let x = 0; x < canvas.width; x += dashW + gapW) {
    ctx.fillRect(x, lineY, dashW, 8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

/** Soft radial-gradient shadow blob used under the rolling tyre so it
 *  looks grounded rather than floating above the road. */
function makeShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.45)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

const FrictionScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    const roadTexture = makeAsphaltTexture();
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 1.6),
      new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 0.95 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.9;
    scene.add(road);

    // Kerb strips along both long edges of the road for depth cues.
    const kerbMat = new THREE.MeshStandardMaterial({ color: 0xd8d3c4 });
    [-0.82, 0.82].forEach((z) => {
      const kerb = new THREE.Mesh(new THREE.BoxGeometry(6, 0.06, 0.12), kerbMat);
      kerb.position.set(0, -0.87, z);
      scene.add(kerb);
    });

    const shadowTexture = makeShadowTexture();
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85, 0.4),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -0.895;
    scene.add(shadow);

    // Tyre: darker tread ring behind a slightly lighter sidewall torus.
    const tread = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.16, 14, 32),
      new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.85 })
    );
    scene.add(tread);

    const sidewall = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.1, 10, 32),
      new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.7 })
    );
    scene.add(sidewall);

    // Bigger, tractor-style tread blocks around the tyre for a rougher grip look.
    const treadBlocks = new THREE.Group();
    const blockCount = 12;
    for (let i = 0; i < blockCount; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.11, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x0d0d0d })
      );
      const angle = (i / blockCount) * Math.PI * 2;
      block.position.set(Math.cos(angle) * 0.46, Math.sin(angle) * 0.46, 0);
      block.rotation.z = angle;
      treadBlocks.add(block);
    }
    scene.add(treadBlocks);

    // Rim + spokes instead of a plain cylinder hub.
    const rimGroup = new THREE.Group();
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.19, 0.1, 20),
      new THREE.MeshStandardMaterial({ color: 0xb8bcc0, metalness: 0.6, roughness: 0.35 })
    );
    rim.rotation.x = Math.PI / 2;
    rimGroup.add(rim);

    const hubCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.11, 16),
      new THREE.MeshStandardMaterial({ color: 0x7a7d80, metalness: 0.5, roughness: 0.4 })
    );
    hubCap.rotation.x = Math.PI / 2;
    rimGroup.add(hubCap);

    const spokeMat = new THREE.MeshStandardMaterial({ color: 0x9a9da0, metalness: 0.5, roughness: 0.4 });
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.15, 0.09), spokeMat);
      const angle = (i / 5) * Math.PI * 2;
      spoke.position.set(Math.cos(angle) * 0.09, Math.sin(angle) * 0.09, 0);
      spoke.rotation.z = angle;
      rimGroup.add(spoke);
    }
    scene.add(rimGroup);

    const frictionArrow = new THREE.ArrowHelper(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(),
      0.45,
      0xff3b30,
      0.13,
      0.08
    );
    scene.add(frictionArrow);

    const frictionLabel = makeLabelSprite('Friction');
    scene.add(frictionLabel);

    const startX = -1.7;
    const endX = 1.7;
    const cycle = 4.2;

    return (t: number) => {
      const local = t % cycle;
      const p = local / cycle;
      const x = startX + (endX - startX) * p;
      const rotation = -x * 2.2;

      tread.position.set(x, -0.46, 0);
      tread.rotation.z = rotation;
      sidewall.position.set(x, -0.46, 0);
      sidewall.rotation.z = rotation;
      treadBlocks.position.set(x, -0.46, 0);
      treadBlocks.rotation.z = rotation;
      rimGroup.position.set(x, -0.46, 0);
      rimGroup.rotation.z = rotation;
      shadow.position.set(x, -0.895, 0);

      frictionArrow.position.set(x, -1.06, 0.5);
      frictionLabel.position.set(x + 0.55, -1.12, 0.5);
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Air resistance (drag): a parachutist descends slowly, with a drag arrow
 *  pointing upward, opposing the downward motion. */
/** Soft fluffy cloud blob drawn on canvas — several overlapping radial
 *  gradients so it reads as a cloud rather than a plain circle. */
function makeCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  const blobs: [number, number, number][] = [
    [80, 90, 55], [130, 75, 62], [180, 95, 48], [110, 105, 50], [155, 100, 45],
  ];
  blobs.forEach(([cx, cy, r]) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, 'rgba(255,255,255,0.95)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const DragScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    // --- Background drifting clouds ---
    const cloudTexture = makeCloudTexture();
    const cloudMat = new THREE.SpriteMaterial({ map: cloudTexture, transparent: true, opacity: 0.85, depthWrite: false });
    const cloudDefs: [number, number, number, number][] = [
      [-1.6, 1.1, -1.6, 0.9],
      [1.5, 0.6, -1.8, 1.1],
      [-1.1, -0.5, -1.7, 0.8],
      [1.2, -0.9, -1.6, 0.95],
    ];
    const clouds = cloudDefs.map(([x, y, z, scale]) => {
      const cloud = new THREE.Sprite(cloudMat);
      cloud.position.set(x, y, z);
      cloud.scale.set(1.8 * scale, 1.1 * scale, 1);
      scene.add(cloud);
      return { mesh: cloud, baseX: x, speed: 0.03 + Math.random() * 0.02 };
    });

    // --- Parachute canopy: 8 alternating colored gore panels forming a dome ---
    const panelCount = 8;
    const canopyGroup = new THREE.Group();
    const canopyColors = [0xd32f2f, 0xf5f5f5];
    for (let i = 0; i < panelCount; i++) {
      const thetaStart = (i / panelCount) * Math.PI * 2;
      const thetaLength = (Math.PI * 2) / panelCount;
      const panel = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 6, 10, thetaStart, thetaLength, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({
          color: canopyColors[i % 2],
          side: THREE.DoubleSide,
          roughness: 0.6,
        })
      );
      canopyGroup.add(panel);
    }
    scene.add(canopyGroup);

    // Canopy rim (skirt) for a finished edge.
    const rimTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.02, 6, panelCount * 2),
      new THREE.MeshStandardMaterial({ color: 0xb71c1c })
    );
    rimTorus.rotation.x = Math.PI / 2;
    canopyGroup.add(rimTorus);

    // --- Person: body, head, arms, legs, harness ---
    const person = new THREE.Group();
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc80 });
    const suitMat = new THREE.MeshStandardMaterial({ color: 0x2f3b52 });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.32, 10), suitMat);
    person.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 14), skinMat);
    head.position.y = 0.24;
    person.add(head);

    const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.28, 8);
    const leftArm = new THREE.Mesh(armGeo, suitMat);
    leftArm.position.set(-0.16, 0.08, 0);
    leftArm.rotation.z = Math.PI / 3.2;
    person.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, suitMat);
    rightArm.position.set(0.16, 0.08, 0);
    rightArm.rotation.z = -Math.PI / 3.2;
    person.add(rightArm);

    const legGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.26, 8);
    const leftLeg = new THREE.Mesh(legGeo, suitMat);
    leftLeg.position.set(-0.055, -0.28, 0);
    leftLeg.rotation.z = -Math.PI / 16;
    person.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, suitMat);
    rightLeg.position.set(0.055, -0.28, 0);
    rightLeg.rotation.z = Math.PI / 16;
    person.add(rightLeg);

    // Harness straps crossing the chest.
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const strapA = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.34, 0.01), strapMat);
    strapA.position.set(0, 0.05, 0.1);
    strapA.rotation.z = Math.PI / 7;
    person.add(strapA);
    const strapB = strapA.clone();
    strapB.rotation.z = -Math.PI / 7;
    person.add(strapB);

    scene.add(person);

    // --- Rigging lines: fan out from harness shoulders to canopy rim ---
    const riggingCount = 8;
    const cordGeo = new THREE.BufferGeometry();
    const cords = new THREE.LineSegments(cordGeo, new THREE.LineBasicMaterial({ color: 0xe0e0e0 }));
    scene.add(cords);

    // --- Wind streaks: thin vertical lines that stream upward past the
    // falling figure and loop, selling the sense of air rushing by. ---
    const streakCount = 10;
    const streakGeo = new THREE.BufferGeometry();
    const streakPositions = new Float32Array(streakCount * 2 * 3);
    streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
    const streaks = new THREE.LineSegments(
      streakGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 })
    );
    scene.add(streaks);
    const streakSeeds = Array.from({ length: streakCount }, () => ({
      x: (Math.random() - 0.5) * 1.6,
      z: (Math.random() - 0.5) * 0.8 - 0.2,
      phase: Math.random() * 5,
      len: 0.12 + Math.random() * 0.1,
      speed: 1.2 + Math.random() * 0.6,
    }));

    const dragArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(),
      0.5,
      0xff3b30,
      0.14,
      0.09
    );
    scene.add(dragArrow);

    const dragLabel = makeLabelSprite('Air Resistance');
    scene.add(dragLabel);

    const topY = 1.3;
    const botY = -1.0;
    const cycle = 5;

    return (t: number) => {
      const local = t % cycle;
      const p = local / cycle;
      const y = topY - (topY - botY) * p;

      canopyGroup.position.set(0, y + 0.55, 0);
      person.position.set(0, y, 0);
      person.rotation.z = Math.sin(t * 1.3) * 0.03;

      const shoulderL = new THREE.Vector3(-0.14, y + 0.35, 0.05);
      const shoulderR = new THREE.Vector3(0.14, y + 0.35, 0.05);
      const cordPoints: THREE.Vector3[] = [];
      for (let i = 0; i < riggingCount; i++) {
        const angle = (i / riggingCount) * Math.PI * 2;
        const rimPoint = new THREE.Vector3(
          Math.cos(angle) * 0.52,
          y + 0.57,
          Math.sin(angle) * 0.52
        );
        const shoulder = i % 2 === 0 ? shoulderL : shoulderR;
        cordPoints.push(shoulder, rimPoint);
      }
      cordGeo.setFromPoints(cordPoints);

      dragArrow.position.set(0.85, y + 0.1, 0);
      dragLabel.position.set(1.3, y + 0.1, 0);

      // Drifting background clouds — slow horizontal parallax loop.
      clouds.forEach((c) => {
        c.mesh.position.x = c.baseX + Math.sin(t * c.speed) * 0.3;
      });

      // Wind streaks stream upward relative to the falling figure and
      // loop back to below once they pass above it.
      const streakArr = streakGeo.attributes.position.array as Float32Array;
      streakSeeds.forEach((s, i) => {
        const cyc = 1.1;
        const local2 = (t * s.speed + s.phase) % cyc;
        const streakY = y - 0.5 + local2 * 1.8;
        const idx = i * 6;
        streakArr[idx] = s.x;
        streakArr[idx + 1] = streakY;
        streakArr[idx + 2] = s.z;
        streakArr[idx + 3] = s.x;
        streakArr[idx + 4] = streakY + s.len;
        streakArr[idx + 5] = s.z;
      });
      streakGeo.attributes.position.needsUpdate = true;
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Upthrust: a small boat bobs gently on the surface of the water, with an
 *  upward arrow showing the upthrust supporting its weight. */
const UpthrustScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    // --- Tank ---
    const tankWidth = 2.6;
    const tankDepth = 1.5;
    const tankHeight = 1.9;
    const tankBottomY = -1.35;
    const waterLevelY = -0.15;

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xbfe0e8,
      transparent: true,
      opacity: 0.18,
      roughness: 0.05,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8a9296, metalness: 0.5, roughness: 0.4 });

    // Tank base.
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(tankWidth + 0.1, 0.08, tankDepth + 0.1),
      frameMat
    );
    base.position.set(0, tankBottomY - 0.04, 0);
    scene.add(base);

    // Glass side/back/front panels.
    const backPanel = new THREE.Mesh(new THREE.PlaneGeometry(tankWidth, tankHeight), glassMat);
    backPanel.position.set(0, tankBottomY + tankHeight / 2, -tankDepth / 2);
    scene.add(backPanel);

    const frontPanel = new THREE.Mesh(new THREE.PlaneGeometry(tankWidth, tankHeight), glassMat);
    frontPanel.position.set(0, tankBottomY + tankHeight / 2, tankDepth / 2);
    frontPanel.rotation.y = Math.PI;
    scene.add(frontPanel);

    [-1, 1].forEach((side) => {
      const sidePanel = new THREE.Mesh(new THREE.PlaneGeometry(tankDepth, tankHeight), glassMat);
      sidePanel.position.set((side * tankWidth) / 2, tankBottomY + tankHeight / 2, 0);
      sidePanel.rotation.y = (side * Math.PI) / 2;
      scene.add(sidePanel);
    });

    // Thin frame edges along the top rim for a "glass tank" read.
    const edgeGeo = new THREE.BoxGeometry(tankWidth + 0.06, 0.05, 0.05);
    const edgeGeoDepth = new THREE.BoxGeometry(0.05, 0.05, tankDepth + 0.06);
    const topY = tankBottomY + tankHeight;
    [tankDepth / 2, -tankDepth / 2].forEach((z) => {
      const edge = new THREE.Mesh(edgeGeo, frameMat);
      edge.position.set(0, topY, z);
      scene.add(edge);
    });
    [tankWidth / 2, -tankWidth / 2].forEach((x) => {
      const edge = new THREE.Mesh(edgeGeoDepth, frameMat);
      edge.position.set(x, topY, 0);
      scene.add(edge);
    });

    // --- Water: displaced plane mesh for a gentle wave surface ---
    const waterGeo = new THREE.PlaneGeometry(tankWidth - 0.04, tankDepth - 0.04, 40, 24);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x1a8fbf,
      transparent: true,
      opacity: 0.82,
      roughness: 0.15,
      metalness: 0.05,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = waterLevelY;
    scene.add(water);
    const waterBasePositions = waterGeo.attributes.position.array.slice();

    // A body-of-water fill below the surface plane so the tank doesn't
    // look hollow from the side, down to the tank floor.
    const waterBody = new THREE.Mesh(
      new THREE.BoxGeometry(tankWidth - 0.04, waterLevelY - tankBottomY, tankDepth - 0.04),
      new THREE.MeshStandardMaterial({ color: 0x1976a3, transparent: true, opacity: 0.55, roughness: 0.2 })
    );
    waterBody.position.set(0, tankBottomY + (waterLevelY - tankBottomY) / 2, 0);
    scene.add(waterBody);

    // --- Boat hull: tapered bow using a lathe-like extruded shape ---
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-0.55, 0);
    hullShape.lineTo(0.35, 0);
    hullShape.quadraticCurveTo(0.62, 0, 0.62, 0.16);
    hullShape.lineTo(-0.55, 0.16);
    hullShape.closePath();
    const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 0.5, bevelEnabled: false });
    hullGeo.center();
    const hull = new THREE.Mesh(hullGeo, new THREE.MeshStandardMaterial({ color: 0x8d5a3b, roughness: 0.7 }));
    hull.rotation.x = -Math.PI / 2;
    scene.add(hull);

    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.05, 0.46),
      new THREE.MeshStandardMaterial({ color: 0xc9a876, roughness: 0.8 })
    );
    scene.add(deck);

    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.3, 0.38),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5 })
    );
    scene.add(cabin);

    const cabinRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.04, 0.44),
      new THREE.MeshStandardMaterial({ color: 0xd32f2f })
    );
    scene.add(cabinRoof);

    // Cabin windows.
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x2a4a5c, roughness: 0.2 });
    const windows: THREE.Mesh[] = [];
    [-0.12, 0.12].forEach((wx) => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.02), windowMat);
      win.position.set(wx, 0, 0.2);
      windows.push(win);
      cabin.add(win);
    });

    const upthrustArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(),
      0.5,
      0xff3b30,
      0.14,
      0.09
    );
    scene.add(upthrustArrow);

    const upthrustLabel = makeLabelSprite('Upthrust');
    scene.add(upthrustLabel);

    return (t: number) => {
      const bob = Math.sin(t * 1.4) * 0.07;

      hull.position.set(0, waterLevelY - 0.02 + bob, 0);
      deck.position.set(0, waterLevelY + 0.14 + bob, 0);
      cabin.position.set(0, waterLevelY + 0.32 + bob, -0.02);
      cabinRoof.position.set(0, waterLevelY + 0.49 + bob, -0.02);

      upthrustArrow.position.set(0, waterLevelY - 0.2 + bob, 0.42);
      upthrustLabel.position.set(0.85, waterLevelY - 0.02 + bob, 0.42);

      // Animate the water surface with layered sine ripples.
      const posAttr = water.geometry.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const bx = waterBasePositions[i] as number;
        const by = waterBasePositions[i + 1] as number;
        arr[i + 2] =
          Math.sin(bx * 3 + t * 1.6) * 0.02 +
          Math.sin(by * 2.4 + t * 1.1) * 0.018;
      }
      posAttr.needsUpdate = true;
      water.geometry.computeVertexNormals();
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Normal reaction: a book drops onto a table and settles, with an upward
 *  arrow showing the table pushing back on the book. */
/** Brick-face texture: reddish clay with mottled speckle noise, drawn on
 *  canvas, used on the long faces of the brick mesh. */
function makeBrickTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#a13a2b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Mottled clay speckle.
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = Math.random() > 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,150,120,0.15)';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, 2, 2);
  }

  // A couple of faint hairline cracks for realism.
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 20);
  ctx.lineTo(70, 55);
  ctx.lineTo(50, 90);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const NormalReactionScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    const tableTop = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.12, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.75 })
    );
    tableTop.position.set(0, -0.4, 0);
    scene.add(tableTop);

    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.85, 8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x6d4c25 });
    ([[-0.95, -0.83, 0.4], [0.95, -0.83, 0.4], [-0.95, -0.83, -0.4], [0.95, -0.83, -0.4]] as [number, number, number][]).forEach(
      ([x, y, z]) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, y, z);
        scene.add(leg);
      }
    );

    // Brick, replacing the old flat "book" — textured clay-red block with
    // slightly rounded edges and a mortar-colored top for realism.
    const brickTexture = makeBrickTexture();
    const brickSideMat = new THREE.MeshStandardMaterial({ map: brickTexture, roughness: 0.9 });
    const brickTopMat = new THREE.MeshStandardMaterial({ color: 0x8a3324, roughness: 0.95 });

    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.24, 0.28),
      [brickSideMat, brickSideMat, brickTopMat, brickTopMat, brickSideMat, brickSideMat]
    );
    scene.add(book);

    // Subtle bevel edges on the brick for a less perfectly-sharp look.
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x6e2a1d, roughness: 1 });
    const edgeGeoLong = new THREE.BoxGeometry(0.55, 0.02, 0.02);
    [[-0.13, 0.14], [0.13, 0.14], [-0.13, -0.14], [0.13, -0.14]].forEach(([, ] ) => {});
    const topFrontEdge = new THREE.Mesh(edgeGeoLong, edgeMat);
    topFrontEdge.position.set(0, 0.12, 0.14);
    book.add(topFrontEdge);
    const topBackEdge = new THREE.Mesh(edgeGeoLong, edgeMat);
    topBackEdge.position.set(0, 0.12, -0.14);
    book.add(topBackEdge);

    // Downward arrow — the brick's weight — visible while it's falling.
    const weightArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(),
      0.4,
      0xff3b30,
      0.13,
      0.08
    );
    scene.add(weightArrow);

    const weightLabel = makeLabelSprite('Weight');
    scene.add(weightLabel);

    // Upward arrow — the table's normal reaction — visible once the brick
    // has landed and the table is pushing back.
    const normalArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(),
      0.42,
      0xff3b30,
      0.13,
      0.08
    );
    scene.add(normalArrow);

    const normalLabel = makeLabelSprite('Normal Reaction');
    scene.add(normalLabel);

    const cycle = 4.0;
    const dropEnd = 1.6;
    const restY = -0.28;
    const startY = 0.6;

    const wideCamPos = camera.position.clone();
    const wideLookAt = new THREE.Vector3(0, 0.2, 0);

    const smoothstep = (e0: number, e1: number, x: number) => {
      const c = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    return (t: number) => {
      const local = t % cycle;
      let y: number;
      if (local < dropEnd) {
        const p = local / dropEnd;
        y = startY - (startY - restY) * (p * p);
      } else if (local < dropEnd + 0.2) {
        const p = (local - dropEnd) / 0.2;
        y = restY + Math.sin(p * Math.PI) * 0.04 * (1 - p);
      } else {
        y = restY;
      }
      book.position.set(0, y, 0);

      const hasLanded = local > dropEnd - 0.1;

      // While falling: downward weight arrow beside the brick, tracking it.
      weightArrow.position.set(0.45, y + 0.15, 0.14);
      weightArrow.visible = !hasLanded;
      weightLabel.position.set(0.85, y + 0.05, 0.14);
      weightLabel.visible = !hasLanded;

      // After landing: upward normal-reaction arrow from the table surface.
      normalArrow.position.set(0, -0.34, 0.3);
      normalArrow.visible = hasLanded;
      normalLabel.position.set(0.9, -0.2, 0.3);
      normalLabel.visible = hasLanded;

      // Zoom in slowly starting right from the top of the fall, so the
      // camera is already easing in well before impact, hold through the
      // settle bounce, then ease back out to the wide shot.
      const zoomInStart = 0;
      const zoomInEnd = dropEnd - 0.05;
      const zoomHoldEnd = dropEnd + 0.4;
      const zoomOutEnd = zoomHoldEnd + 0.6;

      let zoom = 0;
      if (local < zoomInStart) zoom = 0;
      else if (local < zoomInEnd) zoom = smoothstep(zoomInStart, zoomInEnd, local);
      else if (local < zoomHoldEnd) zoom = 1;
      else if (local < zoomOutEnd) zoom = 1 - smoothstep(zoomHoldEnd, zoomOutEnd, local);
      else zoom = 0;

      const closeCamPos = new THREE.Vector3(0.5, y + 0.25, 0.9);
      camera.position.lerpVectors(wideCamPos, closeCamPos, zoom);

      const lookTarget = wideLookAt.clone().lerp(book.position, zoom);
      camera.lookAt(lookTarget);
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Tension: a load hangs and swings gently from a rope, with an arrow along
 *  the rope showing the tension pulling the load upward. */
/** Wooden-plank crate texture: vertical planks with grain streaks and
 *  visible seams, drawn on canvas. */
function makeCrateTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b8863f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const plankCount = 4;
  const plankW = canvas.width / plankCount;
  for (let p = 0; p < plankCount; p++) {
    const x0 = p * plankW;
    // Slight tone variation per plank.
    ctx.fillStyle = p % 2 === 0 ? '#b8863f' : '#ad7c38';
    ctx.fillRect(x0, 0, plankW, canvas.height);

    // Grain streaks.
    for (let i = 0; i < 14; i++) {
      const gx = x0 + Math.random() * plankW;
      ctx.strokeStyle = 'rgba(90,60,25,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      let cy = 0;
      while (cy < canvas.height) {
        cy += 10 + Math.random() * 14;
        ctx.lineTo(gx + (Math.random() - 0.5) * 4, cy);
      }
      ctx.stroke();
    }

    // Seam line between planks.
    ctx.strokeStyle = 'rgba(50,32,15,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0, canvas.height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

const TensionScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    // Pull the camera back slightly since the whole rig is bigger now.
    camera.position.set(0, 0.7, 7.4);

    const support = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.2, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.7 })
    );
    support.position.set(0, 1.9, 0);
    scene.add(support);

    // Thicker rope, rendered as a tube instead of a thin line so it reads
    // as an actual rope rather than a wire.
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xd9c9a3, roughness: 0.9 });
    let ropeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 6), ropeMat);
    scene.add(ropeMesh);

       // --- Wooden crate, replacing the monkey ---
    const crateTexture = makeCrateTexture();
    const plankMat = new THREE.MeshStandardMaterial({ map: crateTexture, roughness: 0.85 });
    const braceMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1a, roughness: 0.9 });
    const ropeLoopMat = new THREE.MeshStandardMaterial({ color: 0xd9c9a3, roughness: 0.9 });

    const monkey = new THREE.Group(); // kept as `monkey` so the rest of the animation code below needs no renaming

    const crateSize = 0.62;
    const crateBody = new THREE.Mesh(
      new THREE.BoxGeometry(crateSize, crateSize, crateSize),
      plankMat
    );
    monkey.add(crateBody);

    // Corner braces (vertical strips at each of the 4 vertical edges).
    const braceGeo = new THREE.BoxGeometry(0.05, crateSize + 0.02, 0.05);
    [
      [-1, -1], [1, -1], [-1, 1], [1, 1],
    ].forEach(([sx, sz]) => {
      const brace = new THREE.Mesh(braceGeo, braceMat);
      brace.position.set((sx * crateSize) / 2, 0, (sz * crateSize) / 2);
      monkey.add(brace);
    });

    // Horizontal top and bottom battens for extra crate detail.
    const battenGeo = new THREE.BoxGeometry(crateSize + 0.03, 0.05, 0.05);
    [crateSize / 2, -crateSize / 2].forEach((by) => {
      const batten = new THREE.Mesh(battenGeo, braceMat);
      batten.position.set(0, by, crateSize / 2 + 0.002);
      monkey.add(batten);
      const batten2 = batten.clone();
      batten2.position.z = -crateSize / 2 - 0.002;
      monkey.add(batten2);
    });

    // Rope loop knotted to the top of the crate, where the hanging rope
    // will visually connect.
    const ropeLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.016, 8, 16),
      ropeLoopMat
    );
    ropeLoop.rotation.x = Math.PI / 2;
    ropeLoop.position.set(0, crateSize / 2 + 0.03, 0);
    monkey.add(ropeLoop);

    monkey.scale.setScalar(1.15);
    scene.add(monkey);

    const tensionArrowL = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(),
      0.5,
      0xff3b30,
      0.14,
      0.09
    );
    scene.add(tensionArrowL);

    const tensionLabel = makeLabelSprite('Tension');
    scene.add(tensionLabel);

    const anchor = new THREE.Vector3(0, 1.8, 0);
    const ropeLen = 1.65;

    // Exact world-space vertical offset from the crate group's origin up
    // to its top rope loop (loop local y × group scale), so the rope
    // visually terminates right at the loop instead of floating above it.
    const handWorldOffsetY = (0.31 + 0.03) * 1.15;

    const wideCamPos = camera.position.clone();
    const wideLookAt = new THREE.Vector3(0, 0.4, 0);
    const zoomCycle = 11;

    return (t: number) => {
      const swing = Math.sin(t * 0.9) * 0.32;
      const gripPos = new THREE.Vector3(
        anchor.x + Math.sin(swing) * ropeLen,
        anchor.y - Math.cos(swing) * ropeLen,
        0
      );

      // Monkey hangs with its hands exactly at gripPos, body below.
      monkey.position.set(gripPos.x, gripPos.y - handWorldOffsetY, gripPos.z);
      monkey.rotation.z = swing * 0.5;

      // Rebuild the rope as a thin cylinder stretching from anchor to grip.
      const mid = anchor.clone().add(gripPos).multiplyScalar(0.5);
      const dir = gripPos.clone().sub(anchor);
      const length = dir.length();
      ropeMesh.position.copy(mid);
      ropeMesh.scale.set(1, length, 1);
      ropeMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

      const dirUp = anchor.clone().sub(gripPos).normalize();
      tensionArrowL.position.copy(gripPos);
      tensionArrowL.setDirection(dirUp);
      tensionLabel.position.set(gripPos.x + 0.55, gripPos.y + 0.1, gripPos.z);

      // Slow, gentle continuous zoom in and out — long period so the
      // motion reads as a slow drift rather than a snap.
      const zoomPhase = (t / zoomCycle) % 1;
      const zoom = (Math.sin(zoomPhase * Math.PI * 2 - Math.PI / 2) + 1) / 2;
      const closeCamPos = new THREE.Vector3(gripPos.x + 0.6, gripPos.y - 0.3, gripPos.z + 3.2);
      camera.position.lerpVectors(wideCamPos, closeCamPos, zoom * 0.6);
      const lookTarget = wideLookAt.clone().lerp(monkey.position, zoom * 0.6);
      camera.lookAt(lookTarget);
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Magnetic force: two magnets drift apart and back together, with arrows
 *  pointing outward to show the repelling force between them. */
const MagneticScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    // Half-length of each colored block along the magnet's long axis.
    // Full magnet length = HALF_LEN * 2. Bumped up from the old 0.225
    // so the magnets read as bigger, chunkier bars.
    const HALF_LEN = 0.35;

    const makeMagnet = () => {
      const group = new THREE.Group();
      const redHalf = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.42, HALF_LEN * 2),
        new THREE.MeshStandardMaterial({ color: 0xd32f2f })
      );
      redHalf.position.z = HALF_LEN / 2;
      const blueHalf = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.42, HALF_LEN * 2),
        new THREE.MeshStandardMaterial({ color: 0x1976d2 })
      );
      blueHalf.position.z = -HALF_LEN / 2;
      group.add(redHalf, blueHalf);
      return group;
    };

    // magnetA stays put; magnetB is the one that travels toward it.
    // Their rotation is the same, so the red end of A and the blue end of
    // B are the faces pointing at each other — opposite poles, attracting.
    const magnetA = makeMagnet();
    magnetA.rotation.y = Math.PI / 2;
    const magnetB = makeMagnet();
    magnetB.rotation.y = Math.PI / 2;
    scene.add(magnetA, magnetB);

    // Arrows point INWARD, toward the other magnet, showing an attracting pull.
    const arrowA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.1, 0.06);
    const arrowB = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.1, 0.06);
    scene.add(arrowA, arrowB);

    const magneticLabel = makeLabelSprite('Attraction');
    scene.add(magneticLabel);

    const smoothstep = (e0: number, e1: number, x: number) => {
      const c = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    // Each magnet's full length is HALF_LEN * 2, so its half-length is
    // HALF_LEN * 2 (the whole magnet extends HALF_LEN*2 from its centre
    // to its outer tip, since the red+blue halves stack along the axis).
    const magnetHalfLength = HALF_LEN * 2;

    const fixedX = -1.0;                      // magnetA's stationary position
    const contactGap = magnetHalfLength * 2;  // faces exactly flush, no overlap
    const nearGap = contactGap + 0.9;         // gap where the "snap" kicks in
    const farGap = contactGap + 2.0;          // starting gap — further apart

    const slowEnd = 2.6;  // slow drift phase ends
    const snapEnd = 2.9;  // fast snap-to-contact ends
    const holdEnd = 3.6;  // stays stuck together until here
    const cycle = 4.4;    // then resets and loops

    return (t: number) => {
      const local = t % cycle;
      let gap: number;

      if (local < slowEnd) {
        // Sitting/drifting phase: B eases slowly toward A.
        const p = smoothstep(0, slowEnd, local);
        gap = farGap - (farGap - nearGap) * p;
      } else if (local < snapEnd) {
        // Snap phase: once close enough, attraction yanks it in fast —
        // ends exactly flush against A's red face, no overlap.
        const p = (local - slowEnd) / (snapEnd - slowEnd);
        const eased = p * p * p;
        gap = nearGap - (nearGap - contactGap) * eased;
      } else if (local < holdEnd) {
        // Held together in contact.
        gap = contactGap;
      } else {
        // Resets back out so the loop can repeat.
        const p = smoothstep(holdEnd, cycle, local);
        gap = contactGap + (farGap - contactGap) * p;
      }

      magnetA.position.set(fixedX, 0, 0);
      magnetB.position.set(fixedX + gap, 0, 0);

      const isStuck = local >= snapEnd && local < holdEnd;
      arrowA.position.set(fixedX + magnetHalfLength + 0.2, 0, 0);
      arrowB.position.set(fixedX + gap - magnetHalfLength - 0.2, 0, 0);
      arrowA.visible = !isStuck;
      arrowB.visible = !isStuck;

      magneticLabel.position.set(fixedX + gap / 2, 0.55, 0);
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Electrostatic force: small paper flecks are pulled towards a charged
 *  balloon, then reset and drift back — showing an attracting force. */
const ElectrostaticScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    // --- Balloon: bigger, glossy sphere with a slightly tapered neck ---
    const balloon = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 28, 28),
      new THREE.MeshStandardMaterial({ color: 0xba3fa8, roughness: 0.28, metalness: 0.05 })
    );
    balloon.scale.set(1, 1.08, 1);
    balloon.position.set(-1.05, 0.35, 0);
    scene.add(balloon);

    // Glossy highlight — a soft white patch to sell the rubbery sheen.
    const highlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
    );
    highlight.position.set(-1.3, 0.7, 0.62);
    scene.add(highlight);

    // Tapered neck between the balloon body and the knot.
    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.11, 0.16, 14),
      new THREE.MeshStandardMaterial({ color: 0xba3fa8, roughness: 0.28 })
    );
    neck.position.set(-1.05, -0.62, 0);
    scene.add(neck);

    const knot = new THREE.Mesh(
      new THREE.ConeGeometry(0.075, 0.13, 10),
      new THREE.MeshStandardMaterial({ color: 0xba3fa8, roughness: 0.28 })
    );
    knot.position.set(-1.05, -0.76, 0);
    knot.rotation.x = Math.PI;
    scene.add(knot);

    // Thin curved string hanging from the knot, for realism.
    const stringCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-1.05, -0.82, 0),
      new THREE.Vector3(-1.0, -1.05, 0.05),
      new THREE.Vector3(-0.95, -1.3, 0)
    );
    const stringGeo = new THREE.TubeGeometry(stringCurve, 12, 0.008, 6, false);
    const stringMesh = new THREE.Mesh(stringGeo, new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    scene.add(stringMesh);

    // --- Paper flecks: thin boxes bent slightly like real scraps, bigger ---
    const paperCount = 5;
    const papers: THREE.Mesh[] = [];
    const paperStart: THREE.Vector3[] = [];
    for (let i = 0; i < paperCount; i++) {
      const paperGroup = new THREE.Group();
      const flapA = new THREE.Mesh(
        new THREE.BoxGeometry(0.11, 0.005, 0.16),
        new THREE.MeshStandardMaterial({ color: 0xfafafa, side: THREE.DoubleSide, roughness: 0.9 })
      );
      flapA.position.z = 0.08;
      flapA.rotation.x = 0.18;
      const flapB = flapA.clone();
      flapB.position.z = -0.08;
      flapB.rotation.x = -0.18;
      paperGroup.add(flapA, flapB);

      const start = new THREE.Vector3(0.95 + (i % 2) * 0.35, -1.15 + i * 0.24, (i - 2) * 0.16);
      paperGroup.position.copy(start);
      papers.push(paperGroup as unknown as THREE.Mesh);
      paperStart.push(start);
      scene.add(paperGroup);
    }

    const attractArrow = new THREE.ArrowHelper(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(),
      0.5,
      0xff3b30,
      0.14,
      0.08
    );
    scene.add(attractArrow);

    const electrostaticLabel = makeLabelSprite('Electrostatic Force');
    scene.add(electrostaticLabel);

    const target = new THREE.Vector3(-0.75, -0.3, 0);
    const cycle = 4;

    return (t: number) => {
      const local = t % cycle;
      const p = Math.min(1, local / (cycle * 0.75));
      papers.forEach((paper, i) => {
        paper.position.lerpVectors(paperStart[i], target, p);
        paper.rotation.z = t * 2 + i;
        paper.rotation.y = t * 1.4 + i;
      });
      attractArrow.position.set(0.3, -0.3, 0.2);
      attractArrow.visible = p < 0.95;
      electrostaticLabel.position.set(0.3, 0.25, 0.2);
      electrostaticLabel.visible = p < 0.95;
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/** Compression: a press plate descends onto a stack of paper, squashing it
 *  shorter and wider, then eases back off — showing a compressive force. */
const PaperCompressionScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f0, roughness: 0.9 });
    const paper = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.8), paperMat);
    scene.add(paper);

    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.1, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.4, roughness: 0.4 })
    );
    scene.add(plate);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.08, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x8a8f94 })
    );
    base.position.y = -1.35;
    scene.add(base);

    const arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 0.4, 0xff3b30, 0.12, 0.08
    );
    scene.add(arrow);
    const label = makeLabelSprite('Compression');
    scene.add(label);

    const restHeight = 0.5;
    const cycle = 4.0;
    const pressStart = 0.6;
    const pressEnd = 1.6;
    const holdEnd = 2.6;
    const releaseEnd = 3.6;

    return (t: number) => {
      const local = t % cycle;
      let squash = 0;
      if (local < pressStart) squash = 0;
      else if (local < pressEnd) squash = (local - pressStart) / (pressEnd - pressStart);
      else if (local < holdEnd) squash = 1;
      else if (local < releaseEnd) squash = 1 - (local - holdEnd) / (releaseEnd - holdEnd);

      const heightScale = 1 - squash * 0.55;
      const widthScale = 1 + squash * 0.22;
      paper.scale.set(widthScale, heightScale, widthScale);

      const paperTopY = -1.3 + restHeight * heightScale + 0.08;
      paper.position.y = paperTopY - (restHeight * heightScale) / 2;
      plate.position.y = paperTopY + 0.05;

      arrow.position.set(0, plate.position.y + 0.55, 0);
      label.position.set(0.75, plate.position.y + 0.3, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Tension: a coiled spring between two clamps stretches, holds, then
 *  relaxes back — showing a stretching (tensile) force. */
const SpringStretchScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    const ringCount = 10;
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.6, roughness: 0.3 });
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < ringCount; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 16), ringMat);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
      rings.push(ring);
    }

    const clampMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const topClamp = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), clampMat);
    scene.add(topClamp);
    const bottomClamp = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.4), clampMat);
    scene.add(bottomClamp);

    const arrowUp = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 0.35, 0xff3b30, 0.11, 0.07);
    const arrowDown = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 0.35, 0xff3b30, 0.11, 0.07);
    scene.add(arrowUp, arrowDown);
    const label = makeLabelSprite('Tension (stretching)');
    scene.add(label);

    const topY = 0.9;
    const restBottomY = -0.5;
    const stretchedBottomY = -1.15;
    const cycle = 4.0;
    const stretchStart = 0.6;
    const stretchEnd = 1.6;
    const holdEnd = 2.6;
    const releaseEnd = 3.6;

    return (t: number) => {
      const local = t % cycle;
      let p = 0;
      if (local < stretchStart) p = 0;
      else if (local < stretchEnd) p = (local - stretchStart) / (stretchEnd - stretchStart);
      else if (local < holdEnd) p = 1;
      else if (local < releaseEnd) p = 1 - (local - holdEnd) / (releaseEnd - holdEnd);

      const bottomY = restBottomY + (stretchedBottomY - restBottomY) * p;
      topClamp.position.set(0, topY, 0);
      bottomClamp.position.set(0, bottomY, 0);

      rings.forEach((ring, i) => {
        const frac = i / (ringCount - 1);
        ring.position.set(0, topY - 0.1 + (bottomY - topY + 0.2) * frac, 0);
      });

      arrowUp.position.set(0, topY + 0.15, 0);
      arrowDown.position.set(0, bottomY - 0.15, 0);
      label.position.set(0.7, (topY + bottomY) / 2, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Bending: a beam resting on two supports dips in the middle under a
 *  downward force, then springs back — showing a bending deformation. */
const BendingScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    const beamGeo = new THREE.BoxGeometry(2.2, 0.1, 0.4, 24, 1, 1);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.7 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    scene.add(beam);
    const basePositions = beamGeo.attributes.position.array.slice();

    const supportMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const supportL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.4), supportMat);
    supportL.position.set(-1.0, -0.25, 0);
    scene.add(supportL);
    const supportR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.4, 0.4), supportMat);
    supportR.position.set(1.0, -0.25, 0);
    scene.add(supportR);

    const arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0.5, 0), 0.35, 0xff3b30, 0.11, 0.07
    );
    scene.add(arrow);
    const label = makeLabelSprite('Bending');
    scene.add(label);

    const cycle = 4.0;
    const bendStart = 0.6;
    const bendEnd = 1.6;
    const holdEnd = 2.6;
    const releaseEnd = 3.6;

    return (t: number) => {
      const local = t % cycle;
      let p = 0;
      if (local < bendStart) p = 0;
      else if (local < bendEnd) p = (local - bendStart) / (bendEnd - bendStart);
      else if (local < holdEnd) p = 1;
      else if (local < releaseEnd) p = 1 - (local - holdEnd) / (releaseEnd - holdEnd);

      const maxDip = 0.28 * p;
      const posAttr = beamGeo.attributes.position;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i += 3) {
        const bx = basePositions[i] as number;
        const by = basePositions[i + 1] as number;
        const norm = bx / 1.1;
        const dip = maxDip * (1 - norm * norm);
        arr[i + 1] = by - dip;
      }
      posAttr.needsUpdate = true;
      beamGeo.computeVertexNormals();

      arrow.visible = p > 0.02;
      label.position.set(0.85, 0.35, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Torsion: a rod clamped at one end is twisted from the other, shown by a
 *  line of segment markers spiralling progressively along its length. */
const TorsionScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene) => {
    const segmentCount = 10;
    const rodLength = 1.8;
    const segLength = rodLength / segmentCount;
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.3, roughness: 0.5 });
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xff3b30 });
    const segments: THREE.Group[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const group = new THREE.Group();
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, segLength * 1.02, 16), rodMat);
      seg.rotation.z = Math.PI / 2;
      group.add(seg);
      const marker = new THREE.Mesh(new THREE.BoxGeometry(segLength * 0.9, 0.02, 0.03), markerMat);
      marker.position.set(0, 0.14, 0);
      group.add(marker);
      group.position.x = -rodLength / 2 + segLength / 2 + i * segLength;
      scene.add(group);
      segments.push(group);
    }

    const clampMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const clampL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.4), clampMat);
    clampL.position.x = -rodLength / 2 - 0.05;
    scene.add(clampL);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.08), clampMat);
    handle.position.x = rodLength / 2 + 0.05;
    scene.add(handle);

    const label = makeLabelSprite('Torsion (twisting)');
    scene.add(label);

    const cycle = 4.0;
    const twistStart = 0.6;
    const twistEnd = 1.8;
    const holdEnd = 2.8;
    const releaseEnd = 3.8;

    return (t: number) => {
      const local = t % cycle;
      let p = 0;
      if (local < twistStart) p = 0;
      else if (local < twistEnd) p = (local - twistStart) / (twistEnd - twistStart);
      else if (local < holdEnd) p = 1;
      else if (local < releaseEnd) p = 1 - (local - holdEnd) / (releaseEnd - holdEnd);

      const maxTwist = Math.PI * 0.9;
      segments.forEach((group, i) => {
        const frac = i / (segmentCount - 1);
        group.rotation.x = maxTwist * p * frac;
      });
      handle.rotation.x = maxTwist * p;
      label.position.set(0, 0.75, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Door swinging open around a hinge when pushed near the handle — shows
 *  the pivot and the force being applied far from it. */
const DoorMomentScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0.3, 0.5, 5.2);
    camera.lookAt(0.3, 0, 0);

    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.0, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x5d4037 })
    );
    frame.position.set(-1.1, 0, 0);
    scene.add(frame);

    const doorGroup = new THREE.Group();
    doorGroup.position.set(-1.05, 0, 0);
    scene.add(doorGroup);

    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.9, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd9c9a3, roughness: 0.7 })
    );
    door.position.set(0.85, 0, 0);
    doorGroup.add(door);

    const handle = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xdaa520, metalness: 0.7, roughness: 0.3 })
    );
    handle.position.set(1.55, 0, 0.1);
    doorGroup.add(handle);

    const pivotDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xff3b30 })
    );
    pivotDot.position.set(-1.05, 0, 0.1);
    scene.add(pivotDot);
    const pivotLabel = makeLabelSprite('Pivot');
    pivotLabel.position.set(-1.05, 0.35, 0.1);
    scene.add(pivotLabel);

    const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 0.4, 0xff3b30, 0.12, 0.08);
    scene.add(arrow);
    const forceLabel = makeLabelSprite('Push');
    scene.add(forceLabel);

    const cycle = 4.0;
    const openEnd = 1.6;
    const holdEnd = 2.2;
    const closeEnd = 3.8;

    return (t: number) => {
      const local = t % cycle;
      let angle = 0;
      if (local < openEnd) angle = (local / openEnd) * (Math.PI * 0.4);
      else if (local < holdEnd) angle = Math.PI * 0.4;
      else if (local < closeEnd) angle = Math.PI * 0.4 * (1 - (local - holdEnd) / (closeEnd - holdEnd));
      doorGroup.rotation.y = -angle;

      const handleWorld = new THREE.Vector3(1.55, 0, 0.1)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), -angle)
        .add(new THREE.Vector3(-1.05, 0, 0));
      const pushing = local < openEnd;
      arrow.visible = pushing;
      forceLabel.visible = pushing;
      arrow.position.set(handleWorld.x, 0, handleWorld.z + 0.35);
      forceLabel.position.set(handleWorld.x, 0.3, handleWorld.z + 0.35);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Wheelbarrow lifting: load sits near the wheel (pivot); lifting the far
 *  handles rotates the whole body about the wheel with little effort. */
const WheelbarrowScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0.2, 0.4, 5.0);

    const pivotX = -0.9, pivotY = -0.55;
    const bodyGroup = new THREE.Group();
    bodyGroup.position.set(pivotX, pivotY, 0);
    scene.add(bodyGroup);

    const wheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.06, 10, 20),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
    );
    bodyGroup.add(wheel);
    const pivotLabel = makeLabelSprite('Pivot (wheel)');
    pivotLabel.position.set(0, 0.4, 0);
    bodyGroup.add(pivotLabel);

    const tub = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 0.4, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x455a64 })
    );
    tub.position.set(0.35, 0.55, 0);
    bodyGroup.add(tub);

    const legMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6);
    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(0.5, 0.05, 0.3);
    bodyGroup.add(leg1);
    const leg2 = leg1.clone();
    leg2.position.z = -0.3;
    bodyGroup.add(leg2);

    const handleMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
    const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.3, 8);
    const handleL = new THREE.Mesh(handleGeo, handleMat);
    handleL.rotation.z = Math.PI / 2;
    handleL.position.set(1.45, 0.4, 0.28);
    bodyGroup.add(handleL);
    const handleR = handleL.clone();
    handleR.position.z = -0.28;
    bodyGroup.add(handleR);

    const load = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.2, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x8a6a3d, roughness: 0.9 })
    );
    load.position.set(0.3, 0.85, 0);
    bodyGroup.add(load);

    const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.1, 0.07);
    scene.add(arrow);
    const label = makeLabelSprite('Lift');
    scene.add(label);

    const cycle = 3.2;
    const liftEnd = 1.2;
    const holdEnd = 1.9;
    const lowerEnd = 3.0;

    return (t: number) => {
      const local = t % cycle;
      let p = 0;
      if (local < liftEnd) p = local / liftEnd;
      else if (local < holdEnd) p = 1;
      else if (local < lowerEnd) p = 1 - (local - holdEnd) / (lowerEnd - holdEnd);

      const angle = p * 0.28;
      bodyGroup.rotation.z = angle;

      const handleWorld = new THREE.Vector3(1.45, 0.4, 0.28)
        .applyAxisAngle(new THREE.Vector3(0, 0, 1), angle)
        .add(new THREE.Vector3(pivotX, pivotY, 0));
      arrow.position.set(handleWorld.x, handleWorld.y + 0.35, handleWorld.z);
      label.position.set(handleWorld.x, handleWorld.y + 0.6, handleWorld.z);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Crowbar prying a rock: a small push at the far end of the bar, over a
 *  fulcrum, lifts a heavy rock a short distance near the pivot. */
const CrowbarScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.35, 5.0);

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.1, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x9ed9a8 })
    );
    ground.position.y = -1.15;
    scene.add(ground);

    // --- Two stacked planks: the crowbar tip slides into the seam
    // between them and pries the top one up at its near edge. ---
    const plankMat = new THREE.MeshStandardMaterial({ color: 0xb0834f, roughness: 0.8 });
    const plankWidth = 2.4;
    const plankThickness = 0.14;
    const plankDepth = 0.9;

    const bottomPlankY = -1.15 + 0.05 + plankThickness / 2;
    const bottomPlank = new THREE.Mesh(
      new THREE.BoxGeometry(plankWidth, plankThickness, plankDepth),
      plankMat
    );
    bottomPlank.position.set(0, bottomPlankY, 0);
    scene.add(bottomPlank);

    const plankRestY = bottomPlankY + plankThickness;
    const hingeX = plankWidth / 2; // top plank stays "anchored" at its far (right) edge

    const topPlankGroup = new THREE.Group();
    topPlankGroup.position.set(hingeX, plankRestY, 0);
    scene.add(topPlankGroup);

    const topPlank = new THREE.Mesh(
      new THREE.BoxGeometry(plankWidth, plankThickness, plankDepth),
      plankMat
    );
    topPlank.position.set(-plankWidth / 2, 0, 0);
    topPlankGroup.add(topPlank);

    // --- Fulcrum: a small wedge the crowbar pivots on, resting on the
    // bottom plank just to the right of the insertion seam. ---
    const fulcrumHeight = 0.14;
    const fulcrum = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, fulcrumHeight, 4),
      new THREE.MeshStandardMaterial({ color: 0x475569 })
    );
    fulcrum.rotation.y = Math.PI / 4;
    const fulcrumX = -0.55;
    // Fulcrum rests ON the seam and lifts the bar just above it — not
    // floating high above the plank stack.
    const fulcrumTopY = plankRestY + fulcrumHeight;
    fulcrum.position.set(fulcrumX, fulcrumTopY - fulcrumHeight / 2, 0);
    scene.add(fulcrum);

    // --- Crowbar: a single curved rod (straight shaft + hooked end)
    // built from a tube along a smooth curve, with a flat pry tip —
    // matching a real crowbar's shape instead of a plain straight bar. ---
    const barGroup = new THREE.Group();
    barGroup.position.set(fulcrumX - 0.2, fulcrumTopY, 0);
    barGroup.rotation.y = Math.PI; // flip the crowbar 180° without touching the planks
    scene.add(barGroup);

    const curvePoints = [
      new THREE.Vector3(-0.55, 0, 0),
      new THREE.Vector3(0.35, 0, 0),
      new THREE.Vector3(1.05, 0.05, 0),
      new THREE.Vector3(1.3, 0.35, 0),
      new THREE.Vector3(1.1, 0.55, 0),
      new THREE.Vector3(0.8, 0.5, 0),
    ];
    const barCurve = new THREE.CatmullRomCurve3(curvePoints);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.45, metalness: 0.15 });
    const barBody = new THREE.Mesh(new THREE.TubeGeometry(barCurve, 40, 0.045, 10, false), barMat);
    barGroup.add(barBody);

    const tipMat = new THREE.MeshStandardMaterial({ color: 0xb8bcc0, metalness: 0.6, roughness: 0.35 });
    const flatTip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.028, 0.1), tipMat);
    // Dip the tip down slightly below the bar's resting line so it
    // actually sits inside the seam gap between the two planks, not
    // hovering above the top plank's surface.
    flatTip.position.set(-0.62, -fulcrumHeight * 0.55, 0);
    barGroup.add(flatTip);

    const hookTip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.028, 0.09), tipMat);
    hookTip.position.set(0.78, 0.5, 0);
    hookTip.rotation.z = 2.9;
    barGroup.add(hookTip);

    const pushArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 0.35, 0xff3b30, 0.1, 0.07);
    scene.add(pushArrow);
    const liftArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.1, 0.07);
    scene.add(liftArrow);

    const shortLabel = makeLabelSprite('Short distance');
    scene.add(shortLabel);
    const longLabel = makeLabelSprite('Long distance');
    scene.add(longLabel);

    const cycle = 3.4;
    const pressEnd = 1.4;
    const holdEnd = 2.1;
    const releaseEnd = 3.2;

    return (t: number) => {
      const local = t % cycle;
      let p = 0;
      if (local < pressEnd) p = local / pressEnd;
      else if (local < holdEnd) p = 1;
      else if (local < releaseEnd) p = 1 - (local - holdEnd) / (releaseEnd - holdEnd);

      // Negative angle: the far (push) end of the bar rotates DOWN while
      // the near (short/tip) end rotates UP around the fulcrum.
      const angle = -p * 0.24;
      barGroup.rotation.z = angle;

      // The top plank lifts at its near (left) edge, hinged at its far
      // (right) edge — driven by the same timeline as the bar so the
      // pry action reads as one continuous motion.
      topPlankGroup.rotation.z = -p * 0.16;

      const farEnd = new THREE.Vector3(1.3, 0.35, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), angle).add(barGroup.position);
      const nearEnd = new THREE.Vector3(-0.55, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), angle).add(barGroup.position);

      pushArrow.position.set(farEnd.x, farEnd.y + 0.35, 0);
      liftArrow.position.set(nearEnd.x - 0.15, nearEnd.y + 0.2, 0);

      shortLabel.position.set(nearEnd.x - 0.15, nearEnd.y + 0.45, 0);
      longLabel.position.set(farEnd.x - 0.3, farEnd.y + 0.55, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Spanner turning a bolt: pushing on the far end of the handle rotates
 *  the spanner (and the bolt) around the pivot at the bolt's centre. */
const SpannerScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.3, 4.6);

    const bolt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.2, 6),
      new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.7, roughness: 0.3 })
    );
    bolt.rotation.x = Math.PI / 2;
    scene.add(bolt);

    const spannerGroup = new THREE.Group();
    scene.add(spannerGroup);

    const head = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.06, 10, 6),
      new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.4, roughness: 0.4 })
    );
    spannerGroup.add(head);

    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.09, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.4, roughness: 0.4 })
    );
    handle.position.set(0.9, 0, 0);
    spannerGroup.add(handle);

    const pushArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.09, 0.06);
    scene.add(pushArrow);
    const label = makeLabelSprite('Push (far end)');
    scene.add(label);

    const cycle = 3.6;
    const turnEnd = 1.6;
    const holdEnd = 2.0;
    const resetEnd = 3.4;

    return (t: number) => {
      const local = t % cycle;
      let angle = 0;
      if (local < turnEnd) angle = (local / turnEnd) * 0.7;
      else if (local < holdEnd) angle = 0.7;
      else if (local < resetEnd) angle = 0.7 * (1 - (local - holdEnd) / (resetEnd - holdEnd));

      spannerGroup.rotation.z = angle;

      const tip = new THREE.Vector3(1.7, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
      const turning = local < turnEnd;
      pushArrow.visible = turning;
      label.visible = turning;
      pushArrow.position.set(tip.x, tip.y + 0.3, 0);
      label.position.set(tip.x, tip.y + 0.55, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Green grass texture with light blade-like streaks, used as the ground
 *  plane under the seesaw for a real playground/park feel. */
function makeGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#5fae5c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 2600; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
    ctx.fillStyle = shade;
    ctx.fillRect(x, y, 1.5, 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/** Horizontal wood-plank texture for the seesaw beam — pale varnished
 *  wood with subtle grain streaks running along its length. */
function makeSeesawPlankTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c99a5b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 40; i++) {
    const y = Math.random() * canvas.height;
    ctx.strokeStyle = 'rgba(110,75,35,0.2)';
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    let cx = 0;
    while (cx < canvas.width) {
      cx += 20 + Math.random() * 30;
      ctx.lineTo(cx, y + (Math.random() - 0.5) * 6);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(90,60,25,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

/** Interactive seesaw: sliders control mass and distance on each side; the
 *  plank tilts in real time with spring-damped physics toward the angle
 *  implied by the net moment, so it settles the way a real seesaw would. */
const InteractiveSeesaw: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftMass, setLeftMass] = useState(4);
  const [leftDist, setLeftDist] = useState(0.8);
  const [rightMass, setRightMass] = useState(4);
  const [rightDist, setRightDist] = useState(0.8);

  const stateRef = useRef({ leftMass, leftDist, rightMass, rightDist });
  useEffect(() => {
    stateRef.current = { leftMass, leftDist, rightMass, rightDist };
  }, [leftMass, leftDist, rightMass, rightDist]);

  useForceScene(containerRef, (scene, camera) => {
    camera.position.set(0, 0.55, 5.7);
    camera.lookAt(0, -0.05, 0);

    const groundTexture = makeGrassTexture();
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 32),
      new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.0;
    scene.add(ground);

    const shadowTexture = makeShadowTexture();
    const rigShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 0.9),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    rigShadow.rotation.x = -Math.PI / 2;
    rigShadow.position.y = -0.995;
    scene.add(rigShadow);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.1, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x6d5636, roughness: 0.8 })
    );
    base.position.y = -0.9;
    scene.add(base);

    const fulcrum = new THREE.Mesh(
      new THREE.ConeGeometry(0.26, 0.62, 4),
      new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 0.7 })
    );
    fulcrum.rotation.y = Math.PI / 4;
    fulcrum.position.y = -0.52;
    scene.add(fulcrum);

    const pivotPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.5, 14),
      new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.6, roughness: 0.35 })
    );
    pivotPin.rotation.x = Math.PI / 2;
    pivotPin.position.y = -0.21;
    scene.add(pivotPin);

    const plankGroup = new THREE.Group();
    scene.add(plankGroup);

    const plankTexture = makeSeesawPlankTexture();
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.1, 0.42),
      new THREE.MeshStandardMaterial({ map: plankTexture, roughness: 0.75 })
    );
    plankGroup.add(plank);

    const midMark = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.12, 0.44),
      new THREE.MeshStandardMaterial({ color: 0xff3b30 })
    );
    plankGroup.add(midMark);

    const crateTexture = makeCrateTexture();
    const crateMat = new THREE.MeshStandardMaterial({ map: crateTexture, roughness: 0.85 });

    const leftBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), crateMat);
    plankGroup.add(leftBox);
    const leftTag = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.05, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8 })
    );
    leftTag.position.y = 0.16;
    leftBox.add(leftTag);

    const rightBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), crateMat);
    plankGroup.add(rightBox);
    const rightTag = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.05, 0.32),
      new THREE.MeshStandardMaterial({ color: 0xd32f2f })
    );
    rightTag.position.y = 0.16;
    rightBox.add(rightTag);

    const leftArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 0.3, 0x1d4ed8, 0.09, 0.06);
    const rightArrow = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 0.3, 0xd32f2f, 0.09, 0.06);
    scene.add(leftArrow, rightArrow);

    let currentAngle = 0;
    let angularVel = 0;

    return (t: number) => {
      const { leftMass, leftDist, rightMass, rightDist } = stateRef.current;

      const maxDist = 1.6;
      const lx = -Math.min(leftDist, maxDist);
      const rx = Math.min(rightDist, maxDist);

      const netMoment = rightMass * rightDist - leftMass * leftDist;
      const targetAngle = Math.max(-0.32, Math.min(0.32, netMoment * 0.02));

      const springStrength = 40;
      const damping = 9;
      const accel = (targetAngle - currentAngle) * springStrength - angularVel * damping;
      angularVel += accel * (1 / 60);
      currentAngle += angularVel * (1 / 60);
      plankGroup.rotation.z = -currentAngle;

      const leftScale = 0.5 + Math.min(leftMass, 10) * 0.05;
      const rightScale = 0.5 + Math.min(rightMass, 10) * 0.05;
      leftBox.scale.setScalar(leftScale);
      rightBox.scale.setScalar(rightScale);

      const leftY = 0.08 + (leftScale * 0.3) / 2;
      const rightY = 0.08 + (rightScale * 0.3) / 2;
      leftBox.position.set(lx, leftY, 0);
      rightBox.position.set(rx, rightY, 0);

      leftArrow.position.set(lx, leftY + 0.4, 0);
      rightArrow.position.set(rx, rightY + 0.4, 0);
      leftArrow.setLength(0.15 + leftMass * 0.03, 0.09, 0.06);
      rightArrow.setLength(0.15 + rightMass * 0.03, 0.09, 0.06);
    };
  });

  const sliderClass = 'w-full accent-emerald-600';

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
      <div className="relative h-64 w-full bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 sm:h-72">
        <div ref={containerRef} className="h-full w-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 border-t border-slate-200 p-5 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-black text-blue-700">Left Side</h4>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Mass: {leftMass} kg</label>
          <input type="range" min={1} max={10} step={1} value={leftMass}
            onChange={e => setLeftMass(Number(e.target.value))} className={sliderClass} />
          <label className="mb-1 mt-3 block text-xs font-semibold text-slate-600">
            Distance from pivot: {leftDist.toFixed(1)} m
          </label>
          <input type="range" min={0.2} max={1.6} step={0.1} value={leftDist}
            onChange={e => setLeftDist(Number(e.target.value))} className={sliderClass} />
        </div>
        <div>
          <h4 className="mb-2 text-sm font-black text-rose-700">Right Side</h4>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Mass: {rightMass} kg</label>
          <input type="range" min={1} max={10} step={1} value={rightMass}
            onChange={e => setRightMass(Number(e.target.value))} className={sliderClass} />
          <label className="mb-1 mt-3 block text-xs font-semibold text-slate-600">
            Distance from pivot: {rightDist.toFixed(1)} m
          </label>
          <input type="range" min={0.2} max={1.6} step={0.1} value={rightDist}
            onChange={e => setRightDist(Number(e.target.value))} className={sliderClass} />
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 text-center text-xs font-semibold text-slate-500">
        Left moment: {(leftMass * leftDist).toFixed(1)} N·m &nbsp;|&nbsp; Right moment: {(rightMass * rightDist).toFixed(1)} N·m
      </div>
    </div>
  );
};

/** Bottom-heavy roly-poly toy: tipped over, it rocks with decaying
 *  oscillation back to upright — a real damped-pendulum motion. */
const StableToyScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.3, 4.2);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(2, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.75;
    scene.add(ground);

    const toy = new THREE.Group();
    toy.position.y = -0.35;
    scene.add(toy);

    const bottom = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8 })
    );
    bottom.rotation.x = Math.PI;
    bottom.position.y = -0.05;
    toy.add(bottom);

    const top = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0xfacc15 })
    );
    top.position.y = 0.35;
    toy.add(top);

    const weight = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    weight.position.y = -0.35;
    toy.add(weight);

    const cgLabel = makeLabelSprite('Low centre of gravity');
    cgLabel.position.y = -0.6;
    toy.add(cgLabel);

    const cycle = 3.6;
    const tipEnd = 1.0;
    const rightEnd = 2.4;

    return (t: number) => {
      const local = t % cycle;
      let angle = 0;
      if (local < tipEnd) {
        angle = (local / tipEnd) * 0.85;
      } else if (local < rightEnd) {
        const p = (local - tipEnd) / (rightEnd - tipEnd);
        angle = 0.85 * Math.exp(-p * 3.5) * Math.cos(p * Math.PI * 3);
      }
      toy.rotation.z = angle;
      toy.position.x = Math.sin(angle) * 0.08;
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Tall narrow stack of blocks: a small tilt sends it toppling right
 *  over, since its centre of gravity is high and its base is narrow. */
const UnstableTowerScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0.3, 0.3, 4.6);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(2, 32),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.85;
    scene.add(ground);

    const towerGroup = new THREE.Group();
    towerGroup.position.set(0, -0.85, 0);
    scene.add(towerGroup);

    const blockCount = 5;
    const blockH = 0.22;
    const colors = [0xef4444, 0xf97316, 0xeab308, 0x22c55e, 0x3b82f6];
    for (let i = 0; i < blockCount; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, blockH, 0.22),
        new THREE.MeshStandardMaterial({ color: colors[i] })
      );
      block.position.y = blockH * i + blockH / 2;
      towerGroup.add(block);
    }

    const cgLabel = makeLabelSprite('High centre of gravity');
    cgLabel.position.y = blockCount * blockH + 0.35;
    towerGroup.add(cgLabel);

    const cycle = 4.2;
    const tipStart = 0.6;
    const fallEnd = 1.7;
    const holdEnd = 2.6;
    const resetEnd = 3.8;

    return (t: number) => {
      const local = t % cycle;
      let angle = 0;
      if (local < tipStart) angle = 0;
      else if (local < fallEnd) {
        const p = (local - tipStart) / (fallEnd - tipStart);
        angle = p * p * (Math.PI / 2.1);
      } else if (local < holdEnd) {
        angle = Math.PI / 2.1;
      } else if (local < resetEnd) {
        const p = (local - holdEnd) / (resetEnd - holdEnd);
        angle = (Math.PI / 2.1) * (1 - p);
      }
      towerGroup.rotation.z = -angle;
      towerGroup.position.x = Math.sin(angle) * -0.1;
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

/** Ball on a flat table: nudged, it rolls to a new spot and simply stays
 *  there — no tendency to tip or return, a neutral equilibrium. */
const NeutralBallScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.4, 4.4);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.1, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xd9c9a3, roughness: 0.7 })
    );
    table.position.y = -0.75;
    scene.add(table);

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
    );
    scene.add(ball);

    const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.09, 0.06);
    scene.add(arrow);
    const label = makeLabelSprite('Nudge');
    scene.add(label);

    const startX = -1.0;
    const endX = 0.4;
    const cycle = 4.0;
    const nudgeStart = 0.7;
    const rollEnd = 1.7;

    return (t: number) => {
      const local = t % cycle;
      let x = startX;
      if (local < nudgeStart) x = startX;
      else if (local < rollEnd) {
        const p = (local - nudgeStart) / (rollEnd - nudgeStart);
        x = startX + (endX - startX) * (1 - Math.pow(1 - p, 2));
      } else {
        x = endX;
      }
      ball.position.set(x, -0.53, 0);
      ball.rotation.z -= 0.04;

      const nudging = local >= nudgeStart - 0.15 && local < nudgeStart + 0.15;
      arrow.visible = nudging;
      label.visible = nudging;
      arrow.position.set(startX - 0.4, -0.3, 0);
      label.position.set(startX - 0.4, -0.05, 0);
    };
  });
  return <div ref={ref} className="h-full w-full" />;
};

interface ForceExampleCardProps {
  title: string;
  forceLabel: string;
  description: string;
  Scene: React.FC;
}

const ForceExampleCard: React.FC<ForceExampleCardProps> = ({ title, forceLabel, description, Scene }) => (
  <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
    <div className="relative h-48 w-full bg-gradient-to-b from-sky-50 to-white sm:h-56">
      <Scene />
      <span className="absolute top-2 right-2 whitespace-nowrap rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow">
        {forceLabel}
      </span>
    </div>
    <div className="p-4">
      <h4 className="mb-1 text-sm font-black text-slate-900">{title}</h4>
      <p className="text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  </div>
);

/* ========================================================================
  NEWTON'S THREE LAWS — DETAILED BLOCK
  ======================================================================== */

interface NewtonLawData {
  number: string;
  title: string;
  definition: string;
  equation: ReactNode;
  explanation: string;
  example: string;
  Diagram: React.FC;
}

/** Builds a simple but recognisable low-poly car: body, cabin, windows,
 *  bumpers, headlights/taillights, and four wheels. */
function makeCar(bodyColor: number, roofColor: number): THREE.Group {
  const car = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.16, 0.28),
    new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.5, metalness: 0.2 })
  );
  body.position.y = 0.1;
  car.add(body);

  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.14, 0.24),
    new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.4 })
  );
  cabin.position.set(-0.02, 0.24, 0);
  car.add(cabin);

  const windowMat = new THREE.MeshStandardMaterial({ color: 0x1c2733, roughness: 0.2 });
  const windowFront = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.19), windowMat);
  windowFront.position.set(0.13, 0.24, 0);
  car.add(windowFront);
  const windowBack = windowFront.clone();
  windowBack.position.x = -0.17;
  car.add(windowBack);

  const bumperMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.6 });
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.3), bumperMat);
  frontBumper.position.set(0.33, 0.06, 0);
  car.add(frontBumper);
  const rearBumper = frontBumper.clone();
  rearBumper.position.x = -0.33;
  car.add(rearBumper);

  const lightMat = new THREE.MeshStandardMaterial({ color: 0xfff2b0, emissive: 0xffe27a, emissiveIntensity: 0.4 });
  [0.11, -0.11].forEach((z) => {
    const light = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.05), lightMat);
    light.position.set(0.35, 0.09, z);
    car.add(light);
  });

  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.8 });
  const wheelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 14);
  const wheelPositions: [number, number][] = [
    [0.2, 0.16], [0.2, -0.16], [-0.2, 0.16], [-0.2, -0.16],
  ];
  wheelPositions.forEach(([x, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, 0.02, z);
    wheel.userData.isWheel = true;
    car.add(wheel);
  });

  return car;
}

const TEXT_INITIAL = 'An object at rest stays at rest.';
const TEXT_FINAL = 'An object at rest… until a force acts on it!';

/** Inertia, shown as a real crash: a moving car drives into a stationary
 *  one. The caption types out, freezes right at impact, edits itself, and
 *  only once the new line finishes typing does the crash actually play
 *  out — using real momentum conservation for the aftermath (equal
 *  masses colliding and coupling together move off at exactly half the
 *  approach speed). */
const InertiaCrashDiagram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0.1, 1.0, 3.4);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const roadTexture = makeAsphaltTexture();
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 1.4),
      new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 0.95 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.05;
    scene.add(road);

    const carA = makeCar(0x64748b, 0x475569); // stationary — grey
    const carB = makeCar(0xd32f2f, 0x8b1e1e); // moving — red
    scene.add(carA, carB);

    const restX = 0.55;              // Car A's resting position
    const startBX = -1.7;            // Car B's starting position
    const collideBX = restX - 0.62;  // Car B's centre when bumpers touch

    carA.position.set(restX, 0, 0);
    carB.position.set(startBX, 0, 0);

    const atRestLabel = makeLabelSprite('At Rest');
    scene.add(atRestLabel);

    const movingArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.3, 0x1976d2, 0.09, 0.06
    );
    scene.add(movingArrow);
    const movingLabel = makeLabelSprite('Moving');
    scene.add(movingLabel);

    const forceArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.3, 0xff3b30, 0.09, 0.06
    );
    scene.add(forceArrow);
    const forceLabel = makeLabelSprite('Force!');
    scene.add(forceLabel);

    // --- Timeline, driven straight from the render loop ---
    const driveDuration = 2.4;
    const resumeDuration = 1.5;
    const holdDuration = 1.0;

    const P_DRIVE = driveDuration;
    const P_RESUME = P_DRIVE + resumeDuration;
    const P_HOLD = P_RESUME + holdDuration;
    const cycle = P_HOLD;

    // Real physics: equal masses, Car A starts at rest, perfectly
    // inelastic collision → conservation of momentum gives
    // m·v = 2m·v' so the coupled pair moves off at half of Car B's
    // approach speed.
    const approachSpeed = (collideBX - startBX) / driveDuration;
    const postCrashSpeed = approachSpeed / 2;
    const squashDuration = 0.18; // brief impact jolt so the hit reads as a push, not a drift

    let lastCaption = '';
    const clock = new THREE.Clock();
    let rafId = 0;

    const spinWheels = (car: THREE.Group) => {
      car.children.forEach((child) => {
        if (child.userData.isWheel) {
          // The wheel's axle (set by rotation.x = 90° at creation) ends
          // up pointing along the mesh's local Y axis, so real rolling
          // motion comes from spinning around local Y — not Z, which
          // was making it spin flat like a coin.
          child.rotation.y -= 0.35;
        }
      });
    };

    const animate = () => {
      const t = clock.getElapsedTime() % cycle;

      // ---- Caption state machine ----
      const text = t < P_DRIVE ? TEXT_INITIAL : TEXT_FINAL;
      if (text !== lastCaption) {
        lastCaption = text;
        setCaption(text);
      }

      // ---- Car motion state machine ----
      if (t < P_DRIVE) {
        // Car A must be pinned to restX every frame here — otherwise it
        // keeps whatever position it drifted to at the end of the previous
        // loop cycle, which makes it look like it's being pulled back into
        // place as Car B approaches instead of simply sitting still.
        const p = t / driveDuration;
        carA.position.x = restX;
        carB.position.x = startBX + (collideBX - startBX) * p;
        carA.scale.set(1, 1, 1);
        carB.scale.set(1, 1, 1);
        spinWheels(carB);
      } else if (t < P_RESUME) {
        // Car A had zero velocity right up to contact, then is knocked
        // forward at the shared post-impact speed — a sudden push, not a
        // gradual pull. Car B simultaneously drops from its full approach
        // speed to that same shared speed, showing it lost momentum to A.
        const travelled = postCrashSpeed * (t - P_DRIVE);
        carA.position.x = restX + travelled;
        carB.position.x = collideBX + travelled;
        spinWheels(carA);
        spinWheels(carB);
      } else {
        const travelled = postCrashSpeed * resumeDuration;
        carA.position.x = restX + travelled;
        carB.position.x = collideBX + travelled;
      }

      // ---- Impact jolt ----
      // A quick squash-and-recover right at contact sells the collision as
      // Car B striking Car A, rather than the two simply gliding together.
      let squash = 0;
      if (t >= P_DRIVE && t < P_DRIVE + squashDuration) {
        const p = (t - P_DRIVE) / squashDuration;
        squash = Math.sin(p * Math.PI);
      }
      carA.scale.set(1 - squash * 0.18, 1 + squash * 0.1, 1);
      carB.scale.set(1 - squash * 0.18, 1 + squash * 0.1, 1);

      // ---- Markers ----
      const beforeCrash = t < P_DRIVE;
      atRestLabel.visible = beforeCrash;
      atRestLabel.position.set(carA.position.x, 0.42, 0);

      const driving = t < P_DRIVE;
      movingArrow.visible = driving;
      movingLabel.visible = driving;
      movingArrow.position.set(carB.position.x + 0.5, 0.14, 0);
      movingLabel.position.set(carB.position.x + 0.5, 0.32, 0);

      const showForce = t >= P_DRIVE && t < P_HOLD;
      forceArrow.visible = showForce;
      forceLabel.visible = showForce;
      forceArrow.position.set(carA.position.x + 0.5, 0.14, 0);
      forceLabel.position.set(carA.position.x + 0.5, 0.32, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = container.clientWidth || width;
      height = container.clientHeight || height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if ((mesh as any).geometry) (mesh as any).geometry.dispose();
        const mat = (mesh as any).material;
        if (mat) {
          if (Array.isArray(mat)) mat.forEach((m: THREE.Material) => m.dispose());
          else mat.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg bg-gradient-to-b from-sky-50 to-white sm:h-80">
      <div ref={containerRef} className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-3 flex justify-center px-4">
        <p className="ga-ink max-w-md rounded-lg bg-white/90 px-4 py-2 text-center text-sm font-semibold text-slate-800 shadow-sm sm:text-base">
          {caption}
        </p>
      </div>
    </div>
  );
};

/** Builds a simple cannon: a wheeled carriage with a barrel pointing
 *  along +x, so it can fire a ball off to the right. */
interface CannonRig {
  group: THREE.Group;
  barrel: THREE.Group;
  barrelBaseX: number;
}

/** Builds a detailed field-cannon rig: spoked wheels on an axle, a wooden
 *  two-cheek carriage with a ground trail, and a separate barrel assembly
 *  (tube + reinforcing rings + cascabel + trunnion) that can slide along
 *  its own axis independently of the carriage — this is what lets it
 *  recoil realistically when fired. */
function makeCannon(): CannonRig {
  const group = new THREE.Group();

  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1a, roughness: 0.85 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x8a8f94, metalness: 0.6, roughness: 0.35 });

  const makeWheel = (): THREE.Group => {
    const wheelGroup = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.028, 8, 20), wheelMat);
    wheelGroup.add(rim);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12), metalMat);
    hub.rotation.x = Math.PI / 2;
    wheelGroup.add(hub);
    for (let i = 0; i < 6; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.02), wheelMat);
      const angle = (i / 6) * Math.PI * 2;
      spoke.position.set(Math.cos(angle) * 0.08, Math.sin(angle) * 0.08, 0);
      spoke.rotation.z = angle;
      wheelGroup.add(spoke);
    }
    return wheelGroup;
  };

  const wheelL = makeWheel();
  wheelL.rotation.y = Math.PI / 2;
  wheelL.position.set(-0.06, -0.14, 0.2);
  group.add(wheelL);
  const wheelR = makeWheel();
  wheelR.rotation.y = Math.PI / 2;
  wheelR.position.set(-0.06, -0.14, -0.2);
  group.add(wheelR);

  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.44, 10), metalMat);
  axle.rotation.x = Math.PI / 2;
  axle.position.set(-0.06, -0.14, 0);
  group.add(axle);

  // Wooden carriage cheeks — an angled trapezoid profile, extruded to
  // give the carriage some real thickness on both sides of the barrel.
  const cheekMat = new THREE.MeshStandardMaterial({ color: 0x6d4c25, roughness: 0.85 });
  const cheekShape = new THREE.Shape();
  cheekShape.moveTo(-0.3, -0.06);
  cheekShape.lineTo(0.24, -0.06);
  cheekShape.lineTo(0.24, 0.1);
  cheekShape.lineTo(0.02, 0.24);
  cheekShape.lineTo(-0.3, 0.16);
  cheekShape.closePath();
  const cheekGeo = new THREE.ExtrudeGeometry(cheekShape, { depth: 0.04, bevelEnabled: false });
  const cheekL = new THREE.Mesh(cheekGeo, cheekMat);
  cheekL.position.set(-0.1, -0.06, 0.14);
  group.add(cheekL);
  const cheekR = new THREE.Mesh(cheekGeo, cheekMat);
  cheekR.position.set(-0.1, -0.06, -0.18);
  group.add(cheekR);

  // Trail — the beam that rests on the ground and braces against recoil.
  const trail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.06), cheekMat);
  trail.position.set(-0.46, -0.17, 0);
  trail.rotation.z = -0.16;
  group.add(trail);

  // --- Barrel assembly: this whole group slides backward on firing ---
  const barrel = new THREE.Group();
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x2e3236, roughness: 0.35, metalness: 0.7 });

  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.64, 16), barrelMat);
  tube.rotation.z = Math.PI / 2;
  barrel.add(tube);

  [-0.2, 0.04, 0.27].forEach((x) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.015, 8, 16), barrelMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(x, 0, 0);
    barrel.add(ring);
  });

  const muzzleRing = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.018, 8, 16), barrelMat);
  muzzleRing.rotation.y = Math.PI / 2;
  muzzleRing.position.set(0.32, 0, 0);
  barrel.add(muzzleRing);

  // Cascabel — the round knob at the very back of the barrel.
  const cascabel = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), barrelMat);
  cascabel.position.set(-0.35, 0, 0);
  barrel.add(cascabel);

  // Trunnion — the pivot pin the barrel rides on, seated between the cheeks.
  const trunnion = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.42, 10), metalMat);
  trunnion.rotation.x = Math.PI / 2;
  trunnion.position.set(-0.02, 0, 0);
  barrel.add(trunnion);

  const barrelBaseX = 0.02;
  barrel.position.set(barrelBaseX, 0.11, 0);
  group.add(barrel);

  return { group, barrel, barrelBaseX };
}

/** Realistic flight of a fired ball: a true parabolic launch under
 *  gravity, followed by rolling to a stop as friction linearly kills its
 *  horizontal speed. Returns ground-relative x/y offsets from the muzzle. */
function ballTravel(t: number, v0x: number, v0y: number, g: number, rollDuration: number) {
  if (t <= 0) return { x: 0, y: 0, speed: 0 };
  const tFlight = (2 * v0y) / g;
  if (t < tFlight) {
    return { x: v0x * t, y: v0y * t - 0.5 * g * t * t, speed: v0x };
  }
  const troll = Math.min(t - tFlight, rollDuration);
  const flightDist = v0x * tFlight;
  const speedNow = v0x * (1 - troll / rollDuration);
  const rollDist = v0x * troll - 0.5 * (v0x / rollDuration) * troll * troll;
  return { x: flightDist + rollDist, y: 0, speed: Math.max(0, speedNow) };
}

/** Soft circular glow texture for fire particles — bright core fading to
 *  transparent, so each particle reads as a glowing spark rather than a
 *  flat colored square. */
function makeFireParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,244,214,1)');
  grad.addColorStop(0.35, 'rgba(255,178,64,0.9)');
  grad.addColorStop(0.7, 'rgba(255,90,30,0.4)');
  grad.addColorStop(1, 'rgba(255,60,20,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

/** Soft circular puff texture for smoke particles. */
function makeSmokeParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(210,210,210,0.85)');
  grad.addColorStop(0.6, 'rgba(170,170,170,0.4)');
  grad.addColorStop(1, 'rgba(150,150,150,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

interface MuzzleParticle {
  sprite: THREE.Sprite;
  dirX: number;
  dirY: number;
  speed: number;
  life: number;
  delay: number;
  sizeStart: number;
  sizeEnd: number;
  isSmoke: boolean;
}

/** Builds one burst's worth of fire + smoke particles as individual round
 *  sprites with randomized directions, speeds and lifetimes, so a fired
 *  shot produces a real spreading explosion of sparks and a drifting
 *  smoke puff instead of a single flat flash square. */
function makeMuzzleBurst(fireTexture: THREE.Texture, smokeTexture: THREE.Texture, scene: THREE.Scene): MuzzleParticle[] {
  const particles: MuzzleParticle[] = [];

  const fireCount = 12;
  for (let i = 0; i < fireCount; i++) {
    const mat = new THREE.SpriteMaterial({ map: fireTexture, transparent: true, opacity: 0, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    scene.add(sprite);
    const angle = (Math.random() - 0.5) * 0.9; // narrow forward cone
    particles.push({
      sprite,
      dirX: Math.cos(angle),
      dirY: Math.sin(angle) * 0.6 + (Math.random() - 0.5) * 0.3,
      speed: 1.4 + Math.random() * 1.2,
      life: 0.16 + Math.random() * 0.14,
      delay: Math.random() * 0.03,
      sizeStart: 0.12 + Math.random() * 0.08,
      sizeEnd: 0.02,
      isSmoke: false,
    });
  }

  const smokeCount = 8;
  for (let i = 0; i < smokeCount; i++) {
    const mat = new THREE.SpriteMaterial({ map: smokeTexture, transparent: true, opacity: 0, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    scene.add(sprite);
    const angle = (Math.random() - 0.5) * 1.1;
    particles.push({
      sprite,
      dirX: Math.cos(angle) * 0.7,
      dirY: Math.sin(angle) * 0.4 + 0.25 + Math.random() * 0.2,
      speed: 0.35 + Math.random() * 0.3,
      life: 0.9 + Math.random() * 0.6,
      delay: 0.03 + Math.random() * 0.08,
      sizeStart: 0.14 + Math.random() * 0.08,
      sizeEnd: 0.4 + Math.random() * 0.15,
      isSmoke: true,
    });
  }

  return particles;
}

/** Positions and fades every particle in a burst for the time elapsed
 *  since the shot fired. Outside the particle's delay/life window it is
 *  hidden. */
function updateMuzzleBurst(particles: MuzzleParticle[], sinceFire: number, originX: number, originY: number) {
  particles.forEach((p) => {
    const pt = sinceFire - p.delay;
    if (pt < 0 || pt > p.life) {
      (p.sprite.material as THREE.SpriteMaterial).opacity = 0;
      return;
    }
    const frac = pt / p.life;
    const x = originX + p.dirX * p.speed * pt;
    const y = originY + p.dirY * p.speed * pt - (p.isSmoke ? 0 : 0.6 * pt * pt);
    const size = p.sizeStart + (p.sizeEnd - p.sizeStart) * frac;
    p.sprite.position.set(x, y, 0);
    p.sprite.scale.set(size, size, 1);
    const opacity = p.isSmoke
      ? Math.sin(Math.PI * Math.min(1, frac)) * 0.55 // fades in, then out
      : (1 - frac) * 0.95; // fire sparks: bright burst that quickly fades
    (p.sprite.material as THREE.SpriteMaterial).opacity = Math.max(0, opacity);
  });
}

/** Same-size cannon blast, two different ball masses: the small light
 *  ball is launched fast, arcs under gravity, lands and rolls far. The
 *  heavy cannonball gets the exact same blast but only manages a short,
 *  low arc before rolling to a stop nearby — real F = ma, with real
 *  projectile physics and a recoiling barrel on every shot. */
const SecondLawDiagram: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.5, 5.8);
    camera.lookAt(0, 0.1, 0);

    const rowSmallY = 0.95;
    const rowLargeY = -0.85;
    const cannonX = -2.0;
    const muzzleX = cannonX + 0.34;

    const rigSmall = makeCannon();
    rigSmall.group.position.set(cannonX, rowSmallY, 0);
    scene.add(rigSmall.group);

    const rigLarge = makeCannon();
    rigLarge.group.scale.setScalar(1.4);
    rigLarge.group.position.set(cannonX, rowLargeY, 0);
    scene.add(rigLarge.group);

    const smallBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 })
    );
    scene.add(smallBall);

    const largeBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.24, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.4, metalness: 0.3 })
    );
    scene.add(largeBall);

    // Ground shadows so the balls read as resting/rolling on a surface,
    // not floating.
    const shadowTexture = makeShadowTexture();
    const shadowSmall = new THREE.Mesh(
      new THREE.PlaneGeometry(0.5, 0.24),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadowSmall.rotation.x = -Math.PI / 2;
    scene.add(shadowSmall);
    const shadowLarge = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.3),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadowLarge.rotation.x = -Math.PI / 2;
    scene.add(shadowLarge);

    // Real fire + smoke particle bursts (round, glowing sparks and a
    // drifting smoke puff) instead of a single flat flash square.
    const fireTexture = makeFireParticleTexture();
    const smokeTexture = makeSmokeParticleTexture();
    const burstSmall = makeMuzzleBurst(fireTexture, smokeTexture, scene);
    const burstLarge = makeMuzzleBurst(fireTexture, smokeTexture, scene);

    const smallMassLabel = makeLabelSprite('Small mass');
    scene.add(smallMassLabel);
    const largeMassLabel = makeLabelSprite('Large mass');
    scene.add(largeMassLabel);

    const bigAccelLabel = makeLabelSprite('Big acceleration');
    scene.add(bigAccelLabel);
    const smallAccelLabel = makeLabelSprite('Small acceleration');
    scene.add(smallAccelLabel);

    // --- Real physics parameters (same "push" = same launch impulse
    // duration/character, but F = ma means very different results) ---
    const g = 3.4;
    const small = { v0x: 2.5, v0y: 1.4, rollDuration: 0.85 };
    const large = { v0x: 0.95, v0y: 0.62, rollDuration: 0.75 };

    const tFlightSmall = (2 * small.v0y) / g;
    const tFlightLarge = (2 * large.v0y) / g;
    const travelDurationSmall = tFlightSmall + small.rollDuration;
    const travelDurationLarge = tFlightLarge + large.rollDuration;
    const travelDuration = Math.max(travelDurationSmall, travelDurationLarge);

    const restXSmall = small.v0x * tFlightSmall + 0.5 * small.v0x * small.rollDuration;
    const restXLarge = large.v0x * tFlightLarge + 0.5 * large.v0x * large.rollDuration;

    const holdDuration = 0.7;
    const resetDuration = 0.6;
    const holdEnd = travelDuration + holdDuration;
    const cycle = holdEnd + resetDuration;

    const recoilDuration = 0.35;
    const recoilMagnitude = 0.1;

    const smoothstep = (e0: number, e1: number, x: number) => {
      const c = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    return (t: number) => {
      const local = t % cycle;

      let smallOff = { x: 0, y: 0, speed: 0 };
      let largeOff = { x: 0, y: 0, speed: 0 };

      if (local < travelDuration) {
        smallOff = ballTravel(local, small.v0x, small.v0y, g, small.rollDuration);
        largeOff = ballTravel(local, large.v0x, large.v0y, g, large.rollDuration);
      } else if (local < holdEnd) {
        smallOff = { x: restXSmall, y: 0, speed: 0 };
        largeOff = { x: restXLarge, y: 0, speed: 0 };
      } else {
        // Reset: roll both balls back to the muzzle for the next shot.
        const p = smoothstep(holdEnd, cycle, local);
        smallOff = { x: restXSmall * (1 - p), y: 0, speed: 0 };
        largeOff = { x: restXLarge * (1 - p), y: 0, speed: 0 };
      }

      const smallX = muzzleX + smallOff.x;
      const smallY = rowSmallY + 0.11 + smallOff.y;
      const largeX = muzzleX + largeOff.x;
      const largeY = rowLargeY + 0.13 + largeOff.y;

      smallBall.position.set(smallX, smallY, 0);
      largeBall.position.set(largeX, largeY, 0);

      shadowSmall.position.set(smallX, rowSmallY + 0.005, 0);
      shadowLarge.position.set(largeX, rowLargeY + 0.005, 0);
      // Shadow fades and shrinks while the ball is airborne, at its
      // strongest once the ball is back on the ground rolling.
      const smallAirborne = smallOff.y > 0.005;
      const largeAirborne = largeOff.y > 0.005;
      shadowSmall.scale.set(smallAirborne ? 0.5 : 0.7, smallAirborne ? 0.24 : 0.34, 1);
      (shadowSmall.material as THREE.MeshBasicMaterial).opacity = smallAirborne ? 0.35 : 0.6;
      shadowLarge.scale.set(largeAirborne ? 0.6 : 0.85, largeAirborne ? 0.3 : 0.42, 1);
      (shadowLarge.material as THREE.MeshBasicMaterial).opacity = largeAirborne ? 0.35 : 0.6;

      // Rolling/spin rate tied to actual instantaneous speed.
      smallBall.rotation.z -= smallOff.speed * 2.2 + (local < travelDuration ? 0.1 : 0);
      largeBall.rotation.z -= largeOff.speed * 2.2 + (local < travelDuration ? 0.04 : 0);

      // --- Barrel recoil: kicks backward sharply, then eases back to
      // rest (like a real hydraulic recuperator), starting the instant
      // the shot fires. ---
      const recoilP = local < recoilDuration ? local / recoilDuration : 1;
      const recoilKick =
        local < recoilDuration
          ? -recoilMagnitude * Math.sin(Math.PI * recoilP) * Math.exp(-recoilP * 1.1)
          : 0;
      rigSmall.barrel.position.x = rigSmall.barrelBaseX + recoilKick;
      rigLarge.barrel.position.x = rigLarge.barrelBaseX + recoilKick;

      // --- Muzzle fire + smoke particle bursts, right at the fire instant ---
      updateMuzzleBurst(burstSmall, local, muzzleX, rowSmallY + 0.11);
      updateMuzzleBurst(burstLarge, local, muzzleX, rowLargeY + 0.13);

      smallMassLabel.position.set(cannonX, rowSmallY + 0.55, 0);
      largeMassLabel.position.set(cannonX, rowLargeY + 0.85, 0);

      const showAccel = local >= 0.15 && local < holdEnd;
      bigAccelLabel.visible = showAccel;
      smallAccelLabel.visible = showAccel;
      bigAccelLabel.position.set(smallX + 0.5, smallY + 0.4, 0);
      smallAccelLabel.position.set(largeX + 0.45, largeY + 0.45, 0);
    };
  });

  return (
    <div className="h-72 w-full overflow-hidden rounded-lg bg-gradient-to-b from-sky-50 to-white sm:h-80">
      <div ref={ref} className="h-full w-full" />
    </div>
  );
};

/** Soccer-ball-style texture: white sphere with scattered black pentagon
 *  patches, drawn on canvas — enough to read as a football rather than a
 *  plain sphere. */
function makeSoccerBallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawPentagon = (cx: number, cy: number, r: number, rot: number) => {
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = rot + (i / 5) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const spots: [number, number, number, number][] = [
    [40, 30, 18, 0.2], [120, 20, 16, 1.1], [200, 35, 17, 2.3],
    [30, 90, 16, 0.8], [95, 100, 18, 1.7], [175, 95, 16, 2.9],
    [235, 80, 15, 0.5], [150, 60, 14, 3.4],
  ];
  spots.forEach(([x, y, r, rot]) => drawPentagon(x, y, r, rot));

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/** Bright white-yellow radial flash texture for the ball/wall impact. */
function makeImpactFlashTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,241,180,0.85)');
  grad.addColorStop(1, 'rgba(255,220,120,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

/** 1D kicked-ball motion: rolls from the kick at approachSpeed, hits the
 *  wall, rebounds at a reduced speed (coefficient of restitution), then
 *  decelerates under rolling friction to a stop. Returns distance
 *  travelled from the kick point (can go negative once bouncing back). */
function kickedBallTravel(
  t: number,
  approachSpeed: number,
  travelDuration: number,
  restitution: number,
  bounceRollDuration: number
): { dist: number; speed: number } {
  if (t <= 0) return { dist: 0, speed: 0 };
  if (t < travelDuration) {
    return { dist: approachSpeed * t, speed: approachSpeed };
  }
  const bounceSpeed = approachSpeed * restitution;
  const tb = Math.min(t - travelDuration, bounceRollDuration);
  const speedNow = bounceSpeed * (1 - tb / bounceRollDuration);
  const bounceDist = bounceSpeed * tb - 0.5 * (bounceSpeed / bounceRollDuration) * tb * tb;
  const travelDist = approachSpeed * travelDuration;
  return { dist: travelDist - bounceDist, speed: -speedNow };
}

/** A leg winds up and kicks a football across the ground into a wall —
 *  showing the action (ball pushes wall) and the reaction (wall pushes
 *  ball straight back) as a pair of arrows right at the instant of
 *  impact, then the ball rolls back and settles before the cycle
 *  repeats. */
const ThirdLawDiagram: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.55, 5.6);
    camera.lookAt(0, 0.1, 0);

    const groundY = -0.55;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 2),
      new THREE.MeshStandardMaterial({ color: 0xdff2e0, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = groundY;
    scene.add(ground);

    // --- Wall ---
    const wallWidth = 0.32;
    const wallHeight = 1.5;
    const wallX = 1.65;
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(wallWidth, wallHeight, 0.85),
      new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 })
    );
    wall.position.set(wallX, groundY + wallHeight / 2, 0);
    scene.add(wall);

    const wallLabel = makeLabelSprite('Wall');
    wallLabel.position.set(wallX, groundY + wallHeight + 0.18, 0);
    scene.add(wallLabel);

    // --- Ball ---
    const ballRadius = 0.16;
    const ballTexture = makeSoccerBallTexture();
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(ballRadius, 20, 20),
      new THREE.MeshStandardMaterial({ map: ballTexture, roughness: 0.6 })
    );
    const kickX = -1.7;
    ball.position.set(kickX, groundY + ballRadius, 0);
    scene.add(ball);

    const shadowTexture = makeShadowTexture();
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 0.22),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = groundY + 0.005;
    scene.add(shadow);

    // --- Kicking leg: a simple hinged thigh + foot, pivoting at the hip ---
    const legPivot = new THREE.Group();
    legPivot.position.set(kickX - 0.22, groundY + 0.62, 0);
    scene.add(legPivot);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffcc80 });
    const shortsMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });

    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.32, 10), shortsMat);
    thigh.position.set(0, -0.16, 0);
    legPivot.add(thigh);

    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.04, 0.34, 10), skinMat);
    shin.position.set(0, -0.48, 0);
    legPivot.add(shin);

    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.07, 0.09), shoeMat);
    shoe.position.set(0.05, -0.66, 0);
    legPivot.add(shoe);

    // --- Impact flash + action/reaction arrows ---
    const flashTexture = makeImpactFlashTexture();
    const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: flashTexture, transparent: true, opacity: 0, depthWrite: false }));
    flash.scale.set(0.5, 0.5, 1);
    scene.add(flash);

    const actionArrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 0.55, 0xff3b30, 0.14, 0.09);
    scene.add(actionArrow);
    const actionLabel = makeLabelSprite('Action: ball pushes wall');
    scene.add(actionLabel);

    const reactionArrow = new THREE.ArrowHelper(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(), 0.55, 0x0f172a, 0.14, 0.09);
    scene.add(reactionArrow);
    const reactionLabel = makeLabelSprite('Reaction: wall pushes ball back');
    scene.add(reactionLabel);

    // --- Timeline ---
    const kickWindup = 0.4;   // leg cocks back, ball still
    const kickSwing = 0.15;   // leg swings forward, ball leaves the ground start
    const travelDuration = 0.85; // ball rolls from kick to wall contact
    const restitution = 0.55;
    const bounceRollDuration = 1.1;
    const holdDuration = 0.5;
    const legRetract = 0.3;   // leg eases back to rest after the swing

    const contactStart = kickWindup + kickSwing;
    const impactTime = contactStart + travelDuration;
    const bounceEnd = impactTime + bounceRollDuration;
    const holdEnd = bounceEnd + holdDuration;
    const resetDuration = 0.6;
    const cycle = holdEnd + resetDuration;

    const approachDist = wallX - wallWidth / 2 - ballRadius - kickX;
    const approachSpeed = approachDist / travelDuration;

    const smoothstep = (e0: number, e1: number, x: number) => {
      const c = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
      return c * c * (3 - 2 * c);
    };

    return (t: number) => {
      const local = t % cycle;

      // ---- Leg animation ----
      const restAngle = -0.55;
      const cockedAngle = -1.1;
      const kickThroughAngle = 0.5;
      let legAngle = restAngle;
      if (local < kickWindup) {
        const p = smoothstep(0, kickWindup, local);
        legAngle = restAngle + (cockedAngle - restAngle) * p;
      } else if (local < contactStart) {
        const p = (local - kickWindup) / kickSwing;
        legAngle = cockedAngle + (kickThroughAngle - cockedAngle) * p;
      } else if (local < contactStart + legRetract) {
        const p = smoothstep(contactStart, contactStart + legRetract, local);
        legAngle = kickThroughAngle + (restAngle - kickThroughAngle) * p;
      } else {
        legAngle = restAngle;
      }
      legPivot.rotation.z = legAngle;

      // ---- Ball motion ----
      let ballX = kickX;
      if (local < contactStart) {
        ballX = kickX;
      } else if (local < bounceEnd) {
        const { dist } = kickedBallTravel(local - contactStart, approachSpeed, travelDuration, restitution, bounceRollDuration);
        ballX = kickX + dist;
      } else if (local < holdEnd) {
        const { dist } = kickedBallTravel(bounceEnd - contactStart, approachSpeed, travelDuration, restitution, bounceRollDuration);
        ballX = kickX + dist;
      } else {
        const restDist = kickedBallTravel(bounceEnd - contactStart, approachSpeed, travelDuration, restitution, bounceRollDuration).dist;
        const p = smoothstep(holdEnd, cycle, local);
        ballX = kickX + restDist * (1 - p);
      }

      ball.position.x = ballX;
      shadow.position.x = ballX;

      // Roll the ball based on its current phase's speed direction.
      const rollSpeed = local < contactStart ? 0 : local < impactTime ? approachSpeed : approachSpeed * restitution * 0.6;
      const rollDir = local >= impactTime && local < bounceEnd ? 1 : -1;
      ball.rotation.z += rollDir * rollSpeed * 0.035;

      // ---- Impact flash ----
      const sinceImpact = local - impactTime;
      const flashVisible = sinceImpact >= 0 && sinceImpact < 0.18;
      (flash.material as THREE.SpriteMaterial).opacity = flashVisible ? (1 - sinceImpact / 0.18) : 0;
      flash.position.set(wallX - wallWidth / 2 - 0.02, groundY + ballRadius, 0);

      // ---- Action / reaction arrows + labels, right at contact ----
      const showForces = sinceImpact >= 0 && sinceImpact < 0.55;
      actionArrow.visible = showForces;
      actionLabel.visible = showForces;
      reactionArrow.visible = showForces;
      reactionLabel.visible = showForces;

      const contactX = wallX - wallWidth / 2 - ballRadius;
      actionArrow.position.set(contactX - 0.55, groundY + ballRadius, 0);
      actionLabel.position.set(contactX - 0.55, groundY + ballRadius + 0.28, 0);
      reactionArrow.position.set(contactX + 0.1, groundY + ballRadius - 0.15, 0);
      reactionLabel.position.set(contactX - 0.1, groundY + ballRadius - 0.4, 0);
    };
  });

  return (
    <div className="h-72 w-full overflow-hidden rounded-lg bg-gradient-to-b from-sky-50 to-white sm:h-80">
      <div ref={ref} className="h-full w-full" />
    </div>
  );
};

const newtonLaws: NewtonLawData[] = [
  {
    number: '1',
    title: 'The Law of Inertia',
    definition:
      '**Newton\'s First Law** says an object will stay still, or keep moving in a straight line at the same speed, unless a force pushes or pulls it to change.',
    equation: 'Resultant force = 0  →  no change in motion',
    explanation:
      'Every object "resists" a change in how it is moving — this is called inertia. A heavy object has more inertia than a light one, so it is harder to start moving, stop, or turn.',
    example:
      'A football on the grass will not move by itself — it stays still until someone kicks it. Once it is rolling, it would keep rolling forever in a straight line if friction and air resistance were not slowing it down.',
    Diagram: InertiaCrashDiagram,
  },
  {
    number: '2',
    title: 'Force, Mass and Acceleration',
    definition:
      '**Newton\'s Second Law** says the bigger the force on an object, the faster it speeds up — but the more mass the object has, the harder it is to speed up.',
    equation: 'F = m × a',
    explanation:
      'Force, mass and acceleration are linked by F = ma. Push two objects with the same force: the lighter one speeds up more than the heavier one. To make the same object speed up faster, you must push harder.',
    example:
      'It is easier to push an empty shopping trolley than a full one. The full trolley has more mass, so the same push only gives it a small acceleration.',
    Diagram: SecondLawDiagram,
  },
  {
    number: '3',
    title: 'Action and Reaction',
    definition:
      '**Newton\'s Third Law** says that when one object pushes or pulls on a second object (the action), the second object pushes or pulls back with an equal force in the opposite direction (the reaction).',
    equation: 'Force on B = − Force on A',
    explanation:
      'Forces always come in pairs. The two forces are equal in size but point in opposite directions, and they act on two different objects — that is why they do not simply cancel out.',
    example:
      'When a swimmer pushes off the wall of a pool, they push backward on the wall (action), and the wall pushes them forward into the water (reaction).',
    Diagram: ThirdLawDiagram,
  },
];

const NewtonLawCard: React.FC<{ law: NewtonLawData }> = ({ law }) => (
  <div className="mb-10">
    <div className="mb-5">
      <span className="ga-hand inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
        Law {law.number}
      </span>
      <h4 className="mt-2 text-xl font-black text-slate-900 sm:text-2xl">{law.title}</h4>
    </div>
    <DefinitionBox text={law.definition} />
    <KeyFormula label="In symbols:" formula={law.equation} />
    <div className="mb-6">
      <TitleBanner>What this means</TitleBanner>
      <p className="leading-relaxed text-slate-700">{law.explanation}</p>
    </div>
    <div className="mb-6">
      <TitleBanner>Example</TitleBanner>
      <p className="leading-relaxed text-slate-700">{law.example}</p>
    </div>
    <div>
      <TitleBanner>See it in action</TitleBanner>
      <div className="overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4">
        <law.Diagram />
      </div>
    </div>
  </div>
);

const NewtonsLawsBlock: React.FC = () => (
  <div className="mb-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Newton's Three Laws
    </h2>
    <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700">
      Isaac Newton wrote down three simple rules that explain how forces make things move,
      speed up, slow down, or stay still. They are called{' '}
      <strong className="font-bold text-slate-900">Newton's Laws of Motion</strong>, and they work
      for everything — a football, a car, a rocket, even you.
    </p>

    <h3 className="mb-4 text-lg font-bold text-slate-900 sm:text-xl">The Three Laws</h3>
    <ol className="mb-10 ml-1 max-w-2xl list-decimal space-y-3 pl-5 leading-relaxed text-slate-700">
      <li>
        <strong className="font-semibold text-slate-900">Things don't move by themselves.</strong>{' '}
        A still object stays still, and a moving object keeps moving the same way, unless something pushes or pulls it.
      </li>
      <li>
        <strong className="font-semibold text-slate-900">A bigger push gives a bigger speed-up.</strong>{' '}
        But a heavier object is harder to speed up than a lighter one.
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Every push has a push back.</strong>{' '}
        If you push something, it pushes you back just as hard, in the opposite direction.
      </li>
    </ol>

    {newtonLaws.map(law => (
      <NewtonLawCard key={law.number} law={law} />
    ))}
  </div>
);

const ForceIntro: React.FC = () => (
  <div className="mb-10">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Force</h2>
    <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
      A <strong className="font-bold text-slate-900">force</strong> is simply a{' '}
      <strong className="font-bold text-slate-900">push or a pull</strong> that can start, stop, speed up,
      slow down, or change the direction of an object.
    </p>

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">Types of Forces</h3>
    <ol className="mb-8 ml-1 max-w-2xl list-decimal space-y-3 pl-5 leading-relaxed text-slate-700">
      <li>
        <strong className="font-semibold text-slate-900">Gravitational force (weight)</strong> — the force
        pulling objects towards the Earth.
        <br />
        <span className="text-slate-500">Example: A ball falls to the ground.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Friction</strong> — a force that opposes motion
        when two surfaces rub against each other.
        <br />
        <span className="text-slate-500">Example: Friction between tyres and the road.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Air resistance (drag)</strong> — a force that
        opposes an object moving through air.
        <br />
        <span className="text-slate-500">Example: A parachutist slowing down.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Upthrust</strong> — an upward force exerted by a
        liquid or gas on an object.
        <br />
        <span className="text-slate-500">Example: A boat floating on water.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Normal reaction force</strong> — the force a
        surface exerts on an object resting on it.
        <br />
        <span className="text-slate-500">Example: A table pushing upward on a book.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Tension</strong> — a pulling force transmitted
        through a string, rope, or cable.
        <br />
        <span className="text-slate-500">Example: A rope pulling a hanging load.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Magnetic force</strong> — a non-contact force
        caused by magnets. It can attract or repel.
        <br />
        <span className="text-slate-500">Example: Two magnets pulling together.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Electrostatic force</strong> — a non-contact
        force between electric charges. Charges can attract or repel.
        <br />
        <span className="text-slate-500">Example: A charged balloon attracting small pieces of paper.</span>
      </li>
    </ol>

    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <ForceExampleCard
        title="1. Gravitational Force (Weight)"
        forceLabel="e.g. An apple falling"
        description="Gravity pulls the apple straight down from the branch to the ground — a pulling force that acts even without contact."
        Scene={GravityScene}
      />
      <ForceExampleCard
        title="2. Friction"
        forceLabel="e.g. A tyre rolling on a road"
        description="As the tyre rolls forward, friction with the road acts backward, opposing the motion."
        Scene={FrictionScene}
      />
      <ForceExampleCard
        title="3. Air Resistance (Drag)"
        forceLabel="e.g. A parachutist descending"
        description="The parachute pushes air out of the way as it falls, and drag acts upward, slowing the descent."
        Scene={DragScene}
      />
      <ForceExampleCard
        title="4. Upthrust"
        forceLabel="e.g. A boat floating"
        description="The water pushes up on the hull, supporting the boat's weight and keeping it afloat."
        Scene={UpthrustScene}
      />
      <ForceExampleCard
        title="5. Normal Reaction Force"
        forceLabel="e.g. A book resting on a table"
        description="The table pushes back up on the book with a force equal and opposite to the book's weight."
        Scene={NormalReactionScene}
      />
      <ForceExampleCard
        title="6. Tension"
        forceLabel="e.g. A load hanging from a rope"
        description="The rope pulls the hanging load upward towards the support, keeping it from falling."
        Scene={TensionScene}
      />
      <ForceExampleCard
        title="7. Magnetic Force"
        forceLabel="e.g. Two magnets attracting"
        description="Opposite poles pull the magnets together — a non-contact force acting at a distance, until they snap into contact."
        Scene={MagneticScene}
      />
      <ForceExampleCard
        title="8. Electrostatic Force"
        forceLabel="e.g. A charged balloon and paper"
        description="A charged balloon pulls small, light pieces of paper towards it without ever touching them."
        Scene={ElectrostaticScene}
      />
    </div>

    <NewtonsLawsBlock />
  </div>
);

const MaterialsIntro: React.FC = () => (
  <div className="mb-10">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Effect of Force on Materials
    </h2>
    <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
      When a force pushes, pulls, or twists a material, it can change the material's shape or size.
      Some materials spring back to their original shape once the force is removed — this is called
      being <strong className="font-bold text-slate-900">elastic</strong>. Others stay changed even
      after the force is gone — this is called being <strong className="font-bold text-slate-900">plastic</strong>.
    </p>

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">Key Definitions</h3>
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5">
        <span className="ga-hand mb-1 block text-xs font-bold uppercase tracking-widest text-blue-500">
          Load — symbol F
        </span>
        <p className="text-sm leading-relaxed text-blue-900">
          The <strong>load</strong> is the force applied to a material, usually a weight that pulls or
          pushes on it. It is measured in newtons (N).
        </p>
      </div>
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5">
        <span className="ga-hand mb-1 block text-xs font-bold uppercase tracking-widest text-blue-500">
          Extension — symbol e
        </span>
        <p className="text-sm leading-relaxed text-blue-900">
          The <strong>extension</strong> is how much longer a material becomes under a load — the new
          length minus the original length. It is measured in metres (m).
        </p>
      </div>
    </div>

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">Deformation Types</h3>
    <ol className="mb-8 ml-1 max-w-2xl list-decimal space-y-3 pl-5 leading-relaxed text-slate-700">
      <li>
        <strong className="font-semibold text-slate-900">Tension (stretching)</strong> — pulling forces
        at each end make a material longer.
        <br />
        <span className="text-slate-500">Example: stretching a rubber band.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Compression (squashing)</strong> — pushing
        forces make a material shorter or squeeze it into a smaller space.
        <br />
        <span className="text-slate-500">Example: pressing down on a stack of paper.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Bending</strong> — a force applied to part of a
        material curves it, stretching one side while squashing the other.
        <br />
        <span className="text-slate-500">Example: a diving board bending under a diver's weight.</span>
      </li>
      <li>
        <strong className="font-semibold text-slate-900">Torsion (twisting)</strong> — turning forces at
        each end twist a material around its own length.
        <br />
        <span className="text-slate-500">Example: wringing out a wet cloth.</span>
      </li>
    </ol>

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
      Examples of Force Changing Materials
    </h3>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <ForceExampleCard
        title="1. Compression"
        forceLabel="e.g. Paper being squashed"
        description="Pressing down on a stack of paper squeezes it shorter and wider — the force compresses the material."
        Scene={PaperCompressionScene}
      />
      <ForceExampleCard
        title="2. Tension"
        forceLabel="e.g. A spring being stretched"
        description="Pulling on both ends of a spring makes it longer — the force stretches the material."
        Scene={SpringStretchScene}
      />
      <ForceExampleCard
        title="3. Bending"
        forceLabel="e.g. A beam bending"
        description="A weight pressed onto the middle of a supported beam curves it — the top squashes while the bottom stretches."
        Scene={BendingScene}
      />
      <ForceExampleCard
        title="4. Torsion"
        forceLabel="e.g. A rod being twisted"
        description="Twisting forces at each end of a rod turn it around its own length, like wringing out a cloth."
        Scene={TorsionScene}
      />
    </div>
  </div>
);

const HookesLawBlock: React.FC = () => (
  <div className="mb-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Hooke's Law
    </h2>
    <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
      Hooke's Law tells us how much a spring — or another elastic material — stretches when you pull
      on it.
    </p>

    <DefinitionBox
      text={
        "**Hooke's Law** says that the extension of a spring is directly proportional to the force " +
        "stretching it — if you double the force, you double the stretch. This only holds true up to a " +
        "certain point, called the **elastic limit**."
      }
    />

    <div className="mb-6">
      <TitleBanner>What this means</TitleBanner>
      <p className="leading-relaxed text-slate-700">
        Imagine pulling on a spring. The harder you pull, the more it stretches — and for a spring that
        obeys Hooke's Law, the stretch grows at a steady, predictable rate. Pull with twice the force and
        it stretches twice as far. But pull too hard, past the elastic limit, and the spring gets
        permanently stretched out of shape — it will not spring back, and Hooke's Law no longer applies.
      </p>
    </div>

    <KeyFormula label="The Formula" formula="F = k e" />

    <div className="mb-6">
      <TitleBanner>What Each Part Means</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <StepRow step="F">
          <strong className="font-semibold text-slate-900">Force (F)</strong> — the load pulling or
          pushing on the material, measured in newtons (N).
        </StepRow>
        <StepRow step="k">
          <strong className="font-semibold text-slate-900">Spring constant (k)</strong> — a number that
          shows how stiff the spring is, measured in newtons per metre (N/m). A bigger k means a stiffer
          spring that needs more force to stretch it the same amount.
        </StepRow>
        <StepRow step="e">
          <strong className="font-semibold text-slate-900">Extension (e)</strong> — how much longer the
          spring has become, measured in metres (m).
        </StepRow>
      </div>
    </div>
  </div>
);

const TurningForceIntro: React.FC = () => (
  <div className="mb-10">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Effect of a Turning Force
    </h2>
    <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
      A force does not always make things move in a straight line. Sometimes a force makes an object
      turn or rotate around a fixed point. This turning effect is called a{' '}
      <strong className="font-bold text-slate-900">moment</strong>.
    </p>

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">Key Definitions</h3>
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5">
        <span className="ga-hand mb-1 block text-xs font-bold uppercase tracking-widest text-blue-500">
          Pivot (Fulcrum)
        </span>
        <p className="text-sm leading-relaxed text-blue-900">
          The <strong>pivot</strong>, also called the <strong>fulcrum</strong>, is the fixed point that
          an object turns around. Everything rotates about this point.
        </p>
      </div>
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5">
        <span className="ga-hand mb-1 block text-xs font-bold uppercase tracking-widest text-blue-500">
          Perpendicular Distance
        </span>
        <p className="text-sm leading-relaxed text-blue-900">
          The <strong>perpendicular distance</strong> is the shortest distance from the pivot to the
          line along which the force acts — measured at a right angle to the force.
        </p>
      </div>
    </div>

    <div className="mb-2 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5">
      <span className="ga-hand mb-1 block text-xs font-bold uppercase tracking-widest text-emerald-600">
        Direction
      </span>
      <p className="text-sm leading-relaxed text-emerald-900">
        Moments act in either a <strong>clockwise</strong> or <strong>anticlockwise</strong> direction,
        depending on which way the force turns the object around the pivot.
      </p>
    </div>
  </div>
);

const MomentOfForceBlock: React.FC = () => (
  <div className="mb-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Moment of a Force
    </h2>

    <DefinitionBox
      text={
        "The **moment of a force** is a measure of how much a force turns an object around a pivot. " +
        "It is calculated by multiplying the force by the perpendicular distance from the pivot to " +
        "where the force is applied."
      }
    />

    <div className="mb-6">
      <TitleBanner>What this means</TitleBanner>
      <p className="leading-relaxed text-slate-700">
        The bigger the force, or the further away from the pivot it is applied, the bigger the turning
        effect. This is why pushing a door open near the hinge is hard, but pushing it near the handle
        (far from the hinge) is easy — the same force creates a much bigger moment when it acts further
        from the pivot.
      </p>
    </div>

    <KeyFormula label="The Formula" formula="M = F × d" />

    <div className="mb-6">
      <TitleBanner>What Each Part Means</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <StepRow step="M">
          <strong className="font-semibold text-slate-900">Moment (M)</strong> — the turning effect of
          the force, measured in newton-metres (N·m).
        </StepRow>
        <StepRow step="F">
          <strong className="font-semibold text-slate-900">Force (F)</strong> — the push or pull applied,
          measured in newtons (N).
        </StepRow>
        <StepRow step="d">
          <strong className="font-semibold text-slate-900">Perpendicular distance (d)</strong> — the
          shortest distance from the pivot to the line of the force, measured in metres (m).
        </StepRow>
      </div>
    </div>

    <div className="mb-8">
      <TitleBanner>Factors Affecting Moment Size</TitleBanner>
      <RuleList
        forceList
        rules={[
          { rule: 'The size of the force.', example: 'A bigger push or pull creates a bigger moment.' },
          { rule: 'The perpendicular distance from the pivot.', example: 'Applying the same force further from the pivot creates a bigger moment.' },
          { rule: 'The direction of the force.', example: 'Only the part of the force perpendicular to the object produces a turning effect.' },
        ]}
      />
    </div>

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">
      Everyday Examples & Applications
    </h3>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <ForceExampleCard
        title="1. Opening a Door"
        forceLabel="e.g. Push near the handle"
        description="Pushing far from the hinges creates a bigger moment, so the door swings open easily with a small force."
        Scene={DoorMomentScene}
      />
      <ForceExampleCard
        title="2. Using a Wheelbarrow"
        forceLabel="e.g. Lifting the handles"
        description="The load sits close to the wheel (the pivot), so lifting the far handles needs much less effort."
        Scene={WheelbarrowScene}
      />
      <ForceExampleCard
        title="3. Prying with a Crowbar"
        forceLabel="e.g. Lifting a heavy object"
        description="A long crowbar lets a small force at the far end create a large moment, lifting a heavy load near the fulcrum."
        Scene={CrowbarScene}
      />
      <ForceExampleCard
        title="4. Turning a Spanner"
        forceLabel="e.g. Loosening a bolt"
        description="Pushing on the end of a long spanner handle creates a bigger moment than gripping close to the bolt."
        Scene={SpannerScene}
      />
    </div>
  </div>
);

const PrincipleOfMomentsBlock: React.FC = () => (
  <div className="mb-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      The Principle of Moments & Equilibrium
    </h2>

    <div className="mb-6">
      <TitleBanner>What it is</TitleBanner>
      <p className="leading-relaxed text-slate-700">
        When an object is balanced and not turning, the turning effects on each side of the pivot must
        cancel each other out. This idea is called the{' '}
        <strong className="font-bold text-slate-900">principle of moments</strong>.
      </p>
    </div>

    <DefinitionBox
      text={
        "The **principle of moments** states that for an object in equilibrium (balanced, not turning), " +
        "the sum of the clockwise moments about a pivot is equal to the sum of the anticlockwise " +
        "moments about the same pivot."
      }
    />

    <KeyFormula label="The Equation" formula="Sum of clockwise moments = Sum of anticlockwise moments" />

    <div className="mb-4">
      <TitleBanner>Try it yourself — Balance the Seesaw</TitleBanner>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-slate-600">
        Adjust the mass and distance on each side. Watch the seesaw tilt in real time as the moments
        change — try to get it perfectly level!
      </p>
    </div>
    <InteractiveSeesaw />
  </div>
);

const CentreOfGravityBlock: React.FC = () => (
  <div className="mb-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
      Centre of Gravity & Stability
    </h2>

    <div className="mb-6">
      <TitleBanner>What it is</TitleBanner>
      <p className="leading-relaxed text-slate-700">
        Every object has a single point where its whole weight seems to act — this is its{' '}
        <strong className="font-bold text-slate-900">centre of gravity</strong>. Where this point sits,
        and how wide the object's base is, decides how easily it tips over.
      </p>
    </div>

    <DefinitionBox
      text={
        "The **centre of gravity** is the point where the entire weight of an object can be considered " +
        "to act. An object is more **stable** when its centre of gravity is low and its base is wide — " +
        "it is harder to tip over. An object is more **unstable** when its centre of gravity is high " +
        "and its base is narrow — it tips over easily."
      }
    />

    <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">Examples</h3>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <ForceExampleCard
        title="1. Stable Equilibrium"
        forceLabel="Low centre of gravity"
        description="A bottom-heavy toy has a low centre of gravity and a wide base — when tipped, it always rights itself."
        Scene={StableToyScene}
      />
      <ForceExampleCard
        title="2. Unstable Equilibrium"
        forceLabel="High centre of gravity"
        description="A tall, narrow stack has a high centre of gravity and a small base — a small tilt sends it toppling over."
        Scene={UnstableTowerScene}
      />
      <ForceExampleCard
        title="3. Neutral Equilibrium"
        forceLabel="Centre of gravity stays level"
        description="A ball on a flat surface has no tendency to tip — nudged to a new spot, it simply stays there."
        Scene={NeutralBallScene}
      />
    </div>
  </div>
);

/** Big spinning wheel used to introduce friction: the wheel spins in
 *  place and a fixed red arrow at the contact point shows the direction
 *  friction acts, opposing the surface's motion. */
const WheelFrictionScene: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useForceScene(ref, (scene, camera) => {
    camera.position.set(0, 0.05, 4.4);
    camera.lookAt(0, -0.05, 0);

    const groundTexture = makeAsphaltTexture();
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 1.4),
      new THREE.MeshStandardMaterial({ map: groundTexture, roughness: 0.95 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.85;
    scene.add(ground);

    const wheelRadius = 0.50;
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(0, -0.85 + wheelRadius + 0.22, 0);
    scene.add(wheelGroup);

    const tread = new THREE.Mesh(
      new THREE.TorusGeometry(wheelRadius, 0.12, 16, 36),
      new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.85 })
    );
    wheelGroup.add(tread);

    const treadBlockHeight = 0.06;
    const treadBlockDepth = 0.24;
    const treadBlockGap = 0.015;
    const treadBlocks = new THREE.Group();
    const blockCount = 12;
    for (let i = 0; i < blockCount; i++) {
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.20, treadBlockHeight, treadBlockDepth),
        new THREE.MeshStandardMaterial({ color: 0x0d0d0d })
      );
      const angle = (i / blockCount) * Math.PI * 2;
      const radiusOffset = wheelRadius + 0.02 + (i % 2) * treadBlockGap;
      block.position.set(Math.cos(angle) * radiusOffset, Math.sin(angle) * radiusOffset, 0);
      block.rotation.z = angle;
      treadBlocks.add(block);
    }
    wheelGroup.add(treadBlocks);

    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.14, 24),
      new THREE.MeshStandardMaterial({ color: 0xb8bcc0, metalness: 0.6, roughness: 0.35 })
    );
    rim.rotation.x = Math.PI / 2;
    wheelGroup.add(rim);

    const spokeMat = new THREE.MeshStandardMaterial({ color: 0x9a9da0, metalness: 0.5, roughness: 0.4 });
    for (let i = 0; i < 6; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.24, 0.13), spokeMat);
      const angle = (i / 6) * Math.PI * 2;
      spoke.position.set(Math.cos(angle) * 0.14, Math.sin(angle) * 0.14, 0);
      spoke.rotation.z = angle;
      wheelGroup.add(spoke);
    }

    const shadowTexture = makeShadowTexture();
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 0.55),
      new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -0.845, 0);
    scene.add(shadow);

    const spinArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0.4, 0.9, 0).normalize(),
      new THREE.Vector3(wheelGroup.position.x + 0.5, wheelGroup.position.y + 0.35, 0.3),
      0.4, 0x1976d2, 0.12, 0.08
    );
    scene.add(spinArrow);
    const spinLabel = makeLabelSprite('Spin direction');
    spinLabel.position.set(wheelGroup.position.x + 0.95, wheelGroup.position.y + 0.85, 0.3);
    scene.add(spinLabel);

    const frictionArrow = new THREE.ArrowHelper(
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, -1.40, 0.45),
      0.55, 0xff3b30, 0.15, 0.1
    );
    scene.add(frictionArrow);
    const frictionLabel = makeLabelSprite('Friction (opposes the surface motion)');
    frictionLabel.position.set(-0.55, -1.45, 0.45);
    scene.add(frictionLabel);

    return (t: number) => {
      wheelGroup.rotation.z -= 0.03;
    };
  });

  return <div ref={ref} className="h-full w-full" />;
};

/* ---- Simple labeled SVG diagrams for the three types of friction ---- */

const StaticFrictionDiagram: React.FC = () => (
  <svg viewBox="0 0 300 140" className="w-full max-w-sm">
    <rect x="0" y="110" width="300" height="10" fill="#94a3b8" />
    <rect x="110" y="70" width="80" height="40" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <line x1="30" y1="90" x2="105" y2="90" stroke="#1976d2" strokeWidth="4" markerEnd="url(#arrowBlueStatic)" />
    <text x="30" y="76" fontSize="11" fill="#1976d2" fontWeight="bold">Applied force</text>
    <line x1="195" y1="90" x2="270" y2="90" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedStatic)" />
    <text x="195" y="76" fontSize="11" fill="#ff3b30" fontWeight="bold">Static friction</text>
    <text x="118" y="130" fontSize="11" fill="#334155">Block stays still</text>
    <defs>
      <marker id="arrowBlueStatic" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#1976d2" /></marker>
      <marker id="arrowRedStatic" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#ff3b30" /></marker>
    </defs>
  </svg>
);

const SlidingFrictionDiagram: React.FC = () => (
  <svg viewBox="0 0 300 140" className="w-full max-w-sm">
    <rect x="0" y="110" width="300" height="10" fill="#94a3b8" />
    <line x1="40" y1="105" x2="70" y2="105" stroke="#cbd5e1" strokeWidth="3" />
    <line x1="40" y1="115" x2="80" y2="115" stroke="#cbd5e1" strokeWidth="3" />
    <rect x="140" y="70" width="70" height="40" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <line x1="215" y1="90" x2="270" y2="90" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrowGreenSliding)" />
    <text x="220" y="76" fontSize="11" fill="#22c55e" fontWeight="bold">Motion</text>
    <line x1="140" y1="120" x2="100" y2="120" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedSliding)" />
    <text x="90" y="136" fontSize="11" fill="#ff3b30" fontWeight="bold">Sliding friction</text>
    <defs>
      <marker id="arrowGreenSliding" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#22c55e" /></marker>
      <marker id="arrowRedSliding" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#ff3b30" /></marker>
    </defs>
  </svg>
);

const RollingFrictionDiagram: React.FC = () => (
  <svg viewBox="0 0 300 140" className="w-full max-w-sm">
    <rect x="0" y="110" width="300" height="10" fill="#94a3b8" />
    <circle cx="150" cy="85" r="25" fill="#37474f" stroke="#151515" strokeWidth="2" />
    <line x1="150" y1="85" x2="169" y2="70" stroke="#cbd5e1" strokeWidth="2" />
    <line x1="180" y1="60" x2="230" y2="60" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrowGreenRolling)" />
    <text x="185" y="50" fontSize="11" fill="#22c55e" fontWeight="bold">Rolling motion</text>
    <line x1="150" y1="112" x2="115" y2="112" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedRolling)" />
    <text x="80" y="126" fontSize="11" fill="#ff3b30" fontWeight="bold">Rolling friction</text>
    <defs>
      <marker id="arrowGreenRolling" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#22c55e" /></marker>
      <marker id="arrowRedRolling" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0,0 L5,2.5 L0,5 Z" fill="#ff3b30" /></marker>
    </defs>
  </svg>
);

/* ---- Friction: intro, types, advantages/disadvantages ---- */

const FrictionIntro: React.FC = () => (
  <div className="mb-10">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Friction</h2>
    <p className="mb-4 max-w-2xl text-base leading-relaxed text-slate-700">
      <strong className="font-bold text-slate-900">Friction</strong> is a force that tries to stop two
      surfaces from sliding past each other. Whenever one surface rubs, or tries to rub, against another,
      friction appears between them.
    </p>
    <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
      Friction always acts <strong className="font-bold text-slate-900">in the opposite direction to the
      motion</strong> (or the attempted motion) of the surface. So if something is moving to the right,
      friction pushes back to the left, trying to slow it down or stop it completely.
    </p>

    <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
      <h4 className="mb-2 text-xs font-bold uppercase text-emerald-600">See it in action</h4>
      <div className="h-64 w-full overflow-hidden rounded-lg border border-emerald-100 bg-white sm:h-96">
        <WheelFrictionScene />
      </div>
      <p className="mt-2 text-center text-sm italic text-slate-500">
        As the wheel spins, its surface tries to slide against the ground. Friction acts at the point of
        contact, opposing that sliding motion.
      </p>
    </div>

    <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700">
      Without friction, wheels would spin uselessly without gripping the ground, your shoes would slide out
      from under you, and it would be impossible to hold a pencil. Friction is caused by tiny bumps and
      rough patches on every surface — even ones that look smooth — catching against each other.
    </p>

    <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">Types of Friction</h3>
    <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
      Friction does not always behave the same way — it depends on whether the object is still, sliding, or
      rolling. There are three main types.
    </p>

    <div className="space-y-8">
      <div>
        <h4 className="mb-2 text-lg font-black text-slate-900">1. Static Friction</h4>
        <DefinitionBox text="**Static friction** is the friction that acts on an object that is not yet moving, stopping it from starting to slide." />
        <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4">
          <StaticFrictionDiagram />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Example: a heavy box on the floor does not move even when you push it gently — static friction is
          matching your push and holding it still.
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-lg font-black text-slate-900">2. Sliding (Kinetic) Friction</h4>
        <DefinitionBox text="**Sliding friction**, also called kinetic friction, is the friction that acts on an object that is already sliding across a surface." />
        <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4">
          <SlidingFrictionDiagram />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Example: a book sliding across a table slows down and eventually stops because of sliding
          friction acting against its motion.
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-lg font-black text-slate-900">3. Rolling Friction</h4>
        <DefinitionBox text="**Rolling friction** is the friction that acts on an object that is rolling over a surface, such as a wheel or a ball." />
        <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4">
          <RollingFrictionDiagram />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Example: a ball rolling on grass slowly loses speed due to rolling friction — this is usually much
          smaller than sliding friction, which is why wheels make it easier to move heavy things.
        </p>
      </div>
    </div>

    <h3 className="mb-3 mt-10 text-2xl font-black tracking-tight text-slate-900">
      Advantages and Disadvantages of Friction
    </h3>
    <p className="mb-4 max-w-2xl text-base leading-relaxed text-slate-700">
      Friction is not always a bad thing — sometimes we need it, and sometimes we try to get rid of it.
    </p>
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5">
        <span className="ga-hand mb-2 block text-xs font-bold uppercase tracking-widest text-emerald-600">
          Advantages (friction helps us)
        </span>
        <ul className="ml-1 space-y-2 text-sm leading-relaxed text-emerald-900">
          <li>• Lets us walk without slipping</li>
          <li>• Lets tyres grip the road so cars can move and brake</li>
          <li>• Holds nails and screws in place</li>
          <li>• Lets us hold and grip objects</li>
        </ul>
      </div>
      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-5">
        <span className="ga-hand mb-2 block text-xs font-bold uppercase tracking-widest text-rose-600">
          Disadvantages (friction works against us)
        </span>
        <ul className="ml-1 space-y-2 text-sm leading-relaxed text-rose-900">
          <li>• Wastes energy as heat in engines and machines</li>
          <li>• Wears down moving parts and shoe soles over time</li>
          <li>• Slows down moving vehicles, needing more fuel</li>
          <li>• Makes it harder to push or drag heavy loads</li>
        </ul>
      </div>
    </div>

    <div className="mb-2">
      <TitleBanner>Ways to Change Friction</TitleBanner>
      <RuleList
        forceList
        rules={[
          { rule: 'Lubrication (oil, grease) reduces friction.', example: 'Engine oil reduces wear in car engines.' },
          { rule: 'Ball bearings reduce friction by rolling instead of sliding.', example: 'Wheels on cars or bicycles.' },
          { rule: 'Polishing surfaces reduces friction.', example: 'Smooth metal surfaces slide easily.' },
          { rule: 'Roughening surfaces increases friction.', example: 'Sandpaper, tyres with treads.' },
          { rule: 'Using materials like rubber increases grip.', example: 'Shoe soles, tennis racket handles.' },
        ]}
      />
    </div>
  </div>
);

/* ---- Circular motion diagrams and block ---- */

const CircularMotionDiagram: React.FC = () => (
  <svg viewBox="0 0 300 300" className="mx-auto w-full max-w-xs">
    <circle cx="150" cy="150" r="100" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
    <circle cx="150" cy="50" r="6" fill="#1976d2" />
    <line x1="150" y1="50" x2="220" y2="50" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrowGreenCirc)" />
    <text x="225" y="54" fontSize="11" fill="#22c55e" fontWeight="bold">v</text>
    <line x1="150" y1="50" x2="150" y2="100" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedCirc)" />
    <text x="112" y="90" fontSize="11" fill="#ff3b30" fontWeight="bold">a</text>

    <circle cx="250" cy="150" r="6" fill="#1976d2" />
    <line x1="250" y1="150" x2="250" y2="220" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrowGreenCirc)" />
    <text x="255" y="235" fontSize="11" fill="#22c55e" fontWeight="bold">v</text>
    <line x1="250" y1="150" x2="200" y2="150" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedCirc)" />
    <text x="185" y="140" fontSize="11" fill="#ff3b30" fontWeight="bold">a</text>

    <circle cx="150" cy="150" r="4" fill="#0d2c45" />
    <text x="140" y="170" fontSize="11" fill="#0d2c45" fontWeight="bold">centre</text>

    <defs>
      <marker id="arrowGreenCirc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22c55e" /></marker>
      <marker id="arrowRedCirc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ff3b30" /></marker>
    </defs>
  </svg>
);

const CentripetalForceDiagram: React.FC = () => (
  <svg viewBox="0 0 300 260" className="mx-auto w-full max-w-xs">
    <circle cx="150" cy="140" r="90" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 4" />
    <circle cx="150" cy="140" r="4" fill="#0d2c45" />
    <text x="158" y="145" fontSize="11" fill="#0d2c45" fontWeight="bold">centre</text>

    <circle cx="240" cy="140" r="10" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <text x="238" y="118" fontSize="11" fill="#334155" fontWeight="bold">mass m</text>

    <line x1="150" y1="140" x2="230" y2="140" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
    <text x="180" y="132" fontSize="11" fill="#334155" fontWeight="bold">r</text>

    <line x1="240" y1="140" x2="240" y2="70" stroke="#22c55e" strokeWidth="4" markerEnd="url(#arrowGreenCentri)" />
    <text x="246" y="80" fontSize="11" fill="#22c55e" fontWeight="bold">v</text>

    <line x1="230" y1="140" x2="165" y2="140" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedCentri)" />
    <text x="178" y="158" fontSize="11" fill="#ff3b30" fontWeight="bold">F</text>

    <defs>
      <marker id="arrowGreenCentri" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#22c55e" /></marker>
      <marker id="arrowRedCentri" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ff3b30" /></marker>
    </defs>
  </svg>
);

const CircularMotionBlock: React.FC = () => (
  <div className="mb-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Circular Motion</h2>
    <DefinitionBox text="**Circular motion** is the movement of an object along the path of a circle, at a fixed distance from a central point." />

    <div className="mb-6">
      <TitleBanner>Why does circular motion need acceleration, even at constant speed?</TitleBanner>
      <p className="mb-4 leading-relaxed text-slate-700">
        Acceleration does not only mean speeding up or slowing down — it also means{' '}
        <strong className="font-bold text-slate-900">changing direction</strong>. An object moving in a
        circle keeps turning, so even if its speed never changes, its direction is changing constantly.
        Because velocity includes both speed and direction, a changing direction means a changing velocity —
        and any change in velocity is an acceleration.
      </p>
      <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <CircularMotionDiagram />
      </div>
      <p className="mt-2 text-center text-sm italic text-slate-500">
        The velocity (green) always points along the circle, but its direction keeps changing. The
        acceleration (red) always points towards the centre.
      </p>
    </div>

    <div className="mb-6">
      <TitleBanner>Centripetal Force and Centripetal Acceleration</TitleBanner>
      <DefinitionBox
        text={
          "**Centripetal acceleration** is the acceleration of an object moving in a circle. It always " +
          "points towards the centre of the circle.\n\n" +
          "**Centripetal force** is the resultant force that causes this acceleration. It also always " +
          "points towards the centre of the circle, and is what keeps the object moving in its circular path."
        }
      />
      <p className="mb-4 leading-relaxed text-slate-700">
        Without a centripetal force pulling it inward, an object would not be able to keep turning — by
        Newton's first law, it would simply fly off in a straight line. The centripetal force does not speed
        the object up; it only changes the direction it is moving in.
      </p>
      <div className="flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <CentripetalForceDiagram />
      </div>
      <p className="mt-2 text-center text-sm italic text-slate-500">
        A mass moving in a circle of radius r at speed v needs a force F pulling it towards the centre.
      </p>
    </div>

    <KeyFormula label="Centripetal acceleration:" formula="a = v² / r" />
    <KeyFormula label="Centripetal force:" formula="F = m v² / r" />

    <div className="mb-6">
      <TitleBanner>What Each Symbol Means</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <StepRow step="a">
          <strong className="font-semibold text-slate-900">Centripetal acceleration (a)</strong> — measured
          in metres per second squared (m/s²), always directed towards the centre.
        </StepRow>
        <StepRow step="F">
          <strong className="font-semibold text-slate-900">Centripetal force (F)</strong> — measured in
          newtons (N), the resultant force pulling the object towards the centre.
        </StepRow>
        <StepRow step="m">
          <strong className="font-semibold text-slate-900">Mass (m)</strong> — measured in kilograms (kg).
        </StepRow>
        <StepRow step="v">
          <strong className="font-semibold text-slate-900">Speed (v)</strong> — measured in metres per
          second (m/s).
        </StepRow>
        <StepRow step="r">
          <strong className="font-semibold text-slate-900">Radius (r)</strong> — measured in metres (m), the
          distance from the centre of the circle to the object.
        </StepRow>
      </div>
    </div>
  </div>
);

/* ---- Centre of mass / centre of gravity diagrams ---- */

const CentreOfMassDiagram: React.FC = () => (
  <svg viewBox="0 0 260 180" className="mx-auto w-full max-w-xs">
    <rect x="30" y="30" width="200" height="120" fill="#dbeafe" stroke="#1976d2" strokeWidth="3" />
    <line x1="30" y1="30" x2="230" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
    <line x1="230" y1="30" x2="30" y2="150" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
    <circle cx="130" cy="90" r="6" fill="#ff3b30" />
    <text x="140" y="85" fontSize="12" fill="#ff3b30" fontWeight="bold">Centre of mass</text>
  </svg>
);

const CentreOfGravityDiagram: React.FC = () => (
  <svg viewBox="0 0 260 200" className="mx-auto w-full max-w-xs">
    <polygon points="40,40 140,40 140,90 220,90 220,160 40,160" fill="#fde68a" stroke="#b45309" strokeWidth="3" />
    <circle cx="110" cy="110" r="6" fill="#ff3b30" />
    <line x1="110" y1="110" x2="110" y2="186" stroke="#ff3b30" strokeWidth="5" markerEnd="url(#arrowRedCog)" />
    <text x="118" y="176" fontSize="12" fill="#ff3b30" fontWeight="bold">Weight (W)</text>
    <text x="88" y="102" fontSize="11" fill="#0d2c45" fontWeight="bold">Centre of gravity</text>
    <defs>
      <marker id="arrowRedCog" markerWidth="4" markerHeight="4" refX="2.5" refY="2" orient="auto">
        <path d="M0,0 L4,2 L0,4 Z" fill="#ff3b30" />
      </marker>
    </defs>
  </svg>
);

const RegularObjectDiagram: React.FC = () => (
  <svg viewBox="0 0 320 140" className="mx-auto w-full max-w-md">
    <rect x="10" y="30" width="80" height="60" fill="#dbeafe" stroke="#1976d2" strokeWidth="2" />
    <circle cx="50" cy="60" r="5" fill="#ff3b30" />
    <text x="20" y="110" fontSize="11" fill="#334155">Rectangle</text>

    <circle cx="180" cy="60" r="40" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
    <circle cx="180" cy="60" r="5" fill="#ff3b30" />
    <text x="160" y="110" fontSize="11" fill="#334155">Circle</text>

    <polygon points="270,20 240,100 300,100" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
    <circle cx="270" cy="73" r="5" fill="#ff3b30" />
    <text x="250" y="120" fontSize="11" fill="#334155">Triangle</text>
  </svg>
);

const IrregularObjectDiagram: React.FC = () => (
  <svg viewBox="0 0 780 255" role="img" aria-label="Find the centre of gravity of an irregular lamina: suspend it from each of two holes, trace the vertical plumb lines, and mark their intersection" className="mx-auto w-full max-w-4xl">
    <defs>
      <marker id="plumbBob" markerWidth="7" markerHeight="10" refX="3.5" refY="2" orient="auto"><path d="M3.5 0 L7 7 Q3.5 11 0 7 Z" fill="#475569" /></marker>
    </defs>
    <path d="M260 30 V225 M510 30 V225" stroke="#e2e8f0" strokeWidth="2" />
    <text x="70" y="20" fontSize="14" fontWeight="600" fill="#0f172a">1. Suspend from hole A</text>
    <g transform="translate(20 30) rotate(-26.565 135 20)">
      <polygon points="45,40 135,20 168,76 145,152 55,163 20,96" fill="#dbeafe" stroke="#475569" strokeWidth="2.5" />
      <circle cx="135" cy="20" r="5" fill="#0f172a" />
      <circle cx="20" cy="96" r="4" fill="#64748b" />
    </g>
    <path d="M155 51 V212" stroke="#2563eb" strokeWidth="2" markerEnd="url(#plumbBob)" />
    <text x="45" y="232" fontSize="12" fill="#1d4ed8">Vertical plumb line</text>

    <text x="318" y="20" fontSize="14" fontWeight="600" fill="#0f172a">2. Suspend from hole B</text>
    <g transform="translate(345 15) rotate(78.69 20 96)">
      <polygon points="45,40 135,20 168,76 145,152 55,163 20,96" fill="#dcfce7" stroke="#475569" strokeWidth="2.5" />
      <circle cx="135" cy="20" r="4" fill="#64748b" />
      <circle cx="20" cy="96" r="5" fill="#0f172a" />
    </g>
    <path d="M365 112 V224" stroke="#16a34a" strokeWidth="2" markerEnd="url(#plumbBob)" />
    <text x="373" y="208" fontSize="12" fill="#15803d">Vertical plumb line</text>

    <text x="546" y="20" fontSize="14" fontWeight="600" fill="#0f172a">3. Mark the intersection</text>
    <g transform="translate(555 30)">
      <polygon points="45,40 135,20 168,76 145,152 55,163 20,96" fill="#f1f5f9" stroke="#475569" strokeWidth="2.5" />
      <path d="M135 20 L62 166" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 4" />
      <path d="M20 96 L151 122" stroke="#16a34a" strokeWidth="2" strokeDasharray="5 4" />
      <circle cx="135" cy="20" r="4.5" fill="#0f172a" /><circle cx="20" cy="96" r="4.5" fill="#0f172a" />
      <circle cx="90" cy="110" r="5.5" fill="#dc2626" stroke="white" strokeWidth="2" />
    </g>
    <path d="M648 140 H717" stroke="#dc2626" strokeWidth="1.5" />
    <text x="651" y="157" fontSize="12" fontWeight="600" fill="#b91c1c">Centre of gravity</text>
    <text x="249" y="247" fontSize="12" fill="#475569">Trace each plumb line while the lamina hangs freely; the traced lines cross at its centre of gravity.</text>
  </svg>
);

const ToppleConditionDiagram: React.FC = () => (
  <div className="flex flex-wrap items-start justify-center gap-8">
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 180" className="w-40">
        <line x1="10" y1="150" x2="150" y2="150" stroke="#94a3b8" strokeWidth="3" />
        <polygon points="55,150 105,150 95,40 65,40" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="2" />
        <line x1="80" y1="70" x2="80" y2="164" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="80" cy="70" r="5" fill="#16a34a" />
      </svg>
      <span className="mt-1 text-center text-xs font-bold text-emerald-600">Line falls inside base → stays up</span>
    </div>
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 160 180" className="w-40">
        <line x1="10" y1="150" x2="150" y2="150" stroke="#94a3b8" strokeWidth="3" />
        <polygon points="55,150 105,150 130,45 100,40" fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
        <line x1="115" y1="60" x2="115" y2="164" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="115" cy="60" r="5" fill="#dc2626" />
      </svg>
      <span className="mt-1 text-center text-xs font-bold text-rose-600">Line falls outside base → topples</span>
    </div>
  </div>
);

const massVsGravityRows: [string, string, string][] = [
  ['Definition', 'The point where the whole mass of an object can be considered to be concentrated.', 'The point where the whole weight of an object can be considered to act.'],
  ['Depends on', 'Only the distribution of mass in the object.', 'Both the distribution of mass and the strength of gravity (g).'],
  ['Changes with location?', 'No — stays the same everywhere, even in space.', 'Can shift very slightly if gravity is not uniform across a very large object.'],
  ['Exists without gravity?', 'Yes — an object still has a centre of mass in space with no gravity.', 'Strictly needs a gravitational field to exist, since it is about weight.'],
  ['For everyday objects on Earth', 'Same point as the centre of gravity.', 'Same point as the centre of mass.'],
];

const CentreVsGravityTable: React.FC = () => (
  <div className="overflow-hidden rounded-xl border border-slate-200">
    <table className="w-full border-collapse text-left text-sm">
      <thead>
        <tr className="bg-[#0d2c45] text-white">
          <th className="px-4 py-3 font-bold">Aspect</th>
          <th className="px-4 py-3 font-bold">Centre of Mass</th>
          <th className="px-4 py-3 font-bold">Centre of Gravity</th>
        </tr>
      </thead>
      <tbody>
        {massVsGravityRows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
            <td className="border-b border-slate-100 px-4 py-3 align-top font-semibold text-slate-800">{row[0]}</td>
            <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-700">{row[1]}</td>
            <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-700">{row[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/** Interactive tilt explorer: sliders control base width and centre-of-
 *  gravity height; the box tilts further and further until its CoG line
 *  passes outside the base, at which point it topples — then resets. */
const StabilityTiltExplorer: React.FC = () => {
  const [baseWidth, setBaseWidth] = useState(90);
  const [cogHeight, setCogHeight] = useState(110);
  const [angle, setAngle] = useState(0);
  const [toppled, setToppled] = useState(false);

  const stateRef = useRef({ baseWidth, cogHeight });
  useEffect(() => { stateRef.current = { baseWidth, cogHeight }; }, [baseWidth, cogHeight]);

  const startRef = useRef(performance.now());

  useEffect(() => {
    let rafId: number;
    const rampDuration = 2600;
    const maxTestAngle = 55;
    const fallDuration = 500;
    const holdDuration = 1200;

    const tick = () => {
      const now = performance.now();
      const elapsed = now - startRef.current;
      const { baseWidth: bw, cogHeight: ch } = stateRef.current;
      const criticalDeg = Math.atan((bw / 2) / ch) * (180 / Math.PI);
      const rampAngle = Math.min(maxTestAngle, (elapsed / rampDuration) * maxTestAngle);

      if (rampAngle >= criticalDeg) {
        const toppleStartTime = (criticalDeg / maxTestAngle) * rampDuration;
        const fallElapsed = elapsed - toppleStartTime;
        const fallP = Math.min(1, fallElapsed / fallDuration);
        setAngle(criticalDeg + (90 - criticalDeg) * fallP);
        setToppled(fallP >= 1);
        if (fallP >= 1 && fallElapsed > fallDuration + holdDuration) {
          startRef.current = now;
          setToppled(false);
        }
      } else if (elapsed < rampDuration) {
        setAngle(rampAngle);
        setToppled(false);
      } else {
        const backElapsed = elapsed - rampDuration;
        const backP = Math.min(1, backElapsed / fallDuration);
        setAngle(maxTestAngle * (1 - backP));
        setToppled(false);
        if (backP >= 1 && backElapsed - fallDuration > holdDuration) {
          startRef.current = now;
        }
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const width = 280;
  const height = 280;
  const baseY = 190;
  const centreX = 140;

  const rad = (angle * Math.PI) / 180;
  const pivotX = centreX + baseWidth / 2;
  const pivotY = baseY;

  const rotatePoint = (x: number, y: number) => {
    const dx = x - pivotX;
    const dy = y - pivotY;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);
    return { x: pivotX + rx, y: pivotY + ry };
  };

  const corners = [
    { x: centreX - baseWidth / 2, y: baseY },
    { x: centreX + baseWidth / 2, y: baseY },
    { x: centreX + baseWidth / 2, y: baseY - cogHeight * 2 },
    { x: centreX - baseWidth / 2, y: baseY - cogHeight * 2 },
  ].map(p => rotatePoint(p.x, p.y));

  const cogRotated = rotatePoint(centreX, baseY - cogHeight);
  const points = corners.map(p => `${p.x},${p.y}`).join(' ');
  const criticalDeg = Math.atan((baseWidth / 2) / cogHeight) * (180 / Math.PI);

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-sm">
      <div className="flex h-64 items-center justify-center bg-gradient-to-b from-sky-50 to-white sm:h-72">
        <svg viewBox={`-20 -80 ${width} ${height}`} className="h-full w-full">
          <line x1="10" y1={baseY} x2={width - 10} y2={baseY} stroke="#94a3b8" strokeWidth="3" />
          <polygon points={points} fill={toppled ? '#fecaca' : '#93c5fd'} stroke={toppled ? '#dc2626' : '#1d4ed8'} strokeWidth="3" />
          <line x1={cogRotated.x} y1={cogRotated.y} x2={cogRotated.x} y2={baseY + 14} stroke="#ff3b30" strokeWidth="2" strokeDasharray="4 3" />
          <circle cx={cogRotated.x} cy={cogRotated.y} r="6" fill="#ff3b30" />
          <text x={cogRotated.x + 10} y={cogRotated.y} fontSize="11" fill="#ff3b30" fontWeight="bold">CoG</text>
        </svg>
      </div>
      <div className="grid grid-cols-1 gap-6 border-t border-slate-200 p-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Base width: {baseWidth}px</label>
          <input type="range" min={40} max={160} step={5} value={baseWidth}
            onChange={e => setBaseWidth(Number(e.target.value))} className="w-full accent-emerald-600" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Height of centre of gravity: {cogHeight}px</label>
          <input type="range" min={50} max={170} step={5} value={cogHeight}
            onChange={e => setCogHeight(Number(e.target.value))} className="w-full accent-emerald-600" />
        </div>
      </div>
      <div className={`border-t border-slate-200 px-5 py-3 text-center text-xs font-semibold ${toppled ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'}`}>
        {toppled
          ? 'Toppled! The line from the centre of gravity fell outside the base.'
          : `Tips over at about ${criticalDeg.toFixed(0)}° — try a wider base or a lower centre of gravity.`}
      </div>
    </div>
  );
};

/* ---- Full Centre of Mass / Centre of Gravity / Stability content ---- */

const CentreOfMassBlock: React.FC = () => (
  <div className="mb-10">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Centre of Mass</h2>
    <DefinitionBox text="The **centre of mass** is the single point in an object where its whole mass can be thought of as being concentrated. If you could balance the object perfectly on that one point, it would balance without tipping." />
    <div className="mb-4 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
      <CentreOfMassDiagram />
    </div>
    <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700">
      Think of a ruler. If you try to balance it flat on one finger, there is only one spot where it sits
      perfectly level without falling off either side. That spot is the ruler's centre of mass — every bit
      of the ruler's mass is "balanced out" around that single point.
    </p>

    <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">Finding the Centre of Mass</h3>
    <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700">
      For a <strong className="font-bold text-slate-900">uniform object</strong> — one that is the same
      shape and made of the same material all the way through — the centre of mass is simply at its{' '}
      <strong className="font-bold text-slate-900">geometric centre</strong> (the middle of the shape). A
      uniform metre rule, for example, balances exactly at the 50 cm mark. For objects that are not uniform
      or have an irregular shape, we need a practical method to find it — this works the same way as
      finding the centre of gravity, explained next.
    </p>

    <div className="border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Centre of Gravity</h2>
      <DefinitionBox text="The **centre of gravity** is the single point in an object where its whole weight can be considered to act. It is the point through which gravity effectively pulls the whole object downward." />
      <div className="mb-4 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <CentreOfGravityDiagram />
      </div>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700">
        Every part of an object is pulled down by gravity, but instead of thinking about millions of tiny
        pulls all over the object, we can treat the object's whole weight as if it acts through one single
        point — the centre of gravity. For everyday objects on Earth, this point is in exactly the same
        place as the centre of mass.
      </p>

      <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">Finding the Centre of Gravity</h3>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
        How we find the centre of gravity depends on the shape of the object. Regular shapes (like squares
        or circles) can be worked out just by looking at their symmetry. Irregular shapes need a simple
        hands-on experiment.
      </p>

      <h4 className="mb-2 text-lg font-black text-slate-900">Finding it on Regular Objects</h4>
      <p className="mb-4 max-w-2xl text-base leading-relaxed text-slate-700">
        A regular object (one with a symmetrical shape, like a rectangle, circle, or triangle) has its
        centre of gravity exactly at its geometric centre — the point where its lines of symmetry cross.
      </p>
      <div className="mb-8 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <RegularObjectDiagram />
      </div>

      <h4 className="mb-2 text-lg font-black text-slate-900">Finding it on Irregular Objects</h4>
      <p className="mb-4 max-w-2xl text-base leading-relaxed text-slate-700">
        For an oddly-shaped object (called a lamina — a flat sheet), we find the centre of gravity by
        hanging it freely and using a plumb line, which always points straight down.
      </p>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <StepRow step={1}>Suspend the irregular lamina from a point near its edge using a pin, so it can swing freely.</StepRow>
        <StepRow step={2}>Hang a plumb line (a weight on a string) from the same point and draw a straight line on the lamina along the string.</StepRow>
        <StepRow step={3}>Suspend the lamina from a different point and repeat, drawing a second line.</StepRow>
        <StepRow step={4}>The point where the two lines cross is the centre of gravity.</StepRow>
      </div>
      <div className="mb-8 mt-4 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <IrregularObjectDiagram />
      </div>
    </div>

    <div className="border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900">
        Centre of Mass vs Centre of Gravity
      </h3>
      <CentreVsGravityTable />
    </div>

    <div className="border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Stability &amp; Toppling Mechanics
      </h2>
      <DefinitionBox text="**Stability** is how well an object resists toppling (falling) over when it is tilted or pushed. It depends on where the centre of gravity is and how wide the object's base is." />
      <p className="mb-4 max-w-2xl text-base leading-relaxed text-slate-700">
        An object stays upright as long as the vertical line drawn straight down from its centre of gravity
        falls inside its base. Once that line falls outside the base, there is nothing to stop the object
        rotating, and it topples over.
      </p>
      <div className="mb-8 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <ToppleConditionDiagram />
      </div>

      <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">Toppling Condition</h3>
      <DefinitionBox text="An object **topples** when the vertical line through its centre of gravity falls outside its base of support." />
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-700">
        This is why tilting an object slowly makes it more and more likely to fall — the further it tilts,
        the further the centre-of-gravity line shifts sideways, until it finally moves past the edge of the
        base.
      </p>

      <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900">Maximizing Stability</h3>
      <p className="mb-4 max-w-2xl text-base leading-relaxed text-slate-700">
        You can make an object harder to topple in two ways: give it a{' '}
        <strong className="font-bold text-slate-900">lower centre of gravity</strong>, or give it a{' '}
        <strong className="font-bold text-slate-900">wider base</strong>. Both mean the object has to tilt
        much further before the centre-of-gravity line passes outside the base.
      </p>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-slate-600">
        Try the sliders below — see how the tipping angle changes as you adjust the base width and the
        height of the centre of gravity.
      </p>
      <StabilityTiltExplorer />

      <h3 className="mb-3 mt-10 text-2xl font-black tracking-tight text-slate-900">States of Equilibrium</h3>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-slate-700">
        When an object is disturbed slightly, it settles into one of three states, depending on where its
        centre of gravity is.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ForceExampleCard
          title="Stable Equilibrium"
          forceLabel="Low centre of gravity"
          description="A low centre of gravity and a wide base — when tilted, the object rocks back and rights itself."
          Scene={StableToyScene}
        />
        <ForceExampleCard
          title="Unstable Equilibrium"
          forceLabel="High centre of gravity"
          description="A high centre of gravity and a narrow base — even a small tilt sends it toppling over."
          Scene={UnstableTowerScene}
        />
        <ForceExampleCard
          title="Neutral Equilibrium"
          forceLabel="Height stays the same"
          description="Moving the object doesn't raise or lower its centre of gravity, so it has no tendency to tip or return."
          Scene={NeutralBallScene}
        />
      </div>

      <h3 className="mb-3 mt-10 text-2xl font-black tracking-tight text-slate-900">Everyday Applications</h3>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <ul className="ml-1 space-y-3 text-sm leading-relaxed text-slate-700">
          <li>• <strong className="font-semibold text-slate-900">Racing cars</strong> are built low and wide so their centre of gravity stays low, helping them corner fast without rolling over.</li>
          <li>• <strong className="font-semibold text-slate-900">Double-decker buses</strong> have their heaviest parts (engine, fuel tank) mounted low down to lower the centre of gravity and prevent tipping.</li>
          <li>• <strong className="font-semibold text-slate-900">Laboratory retort stands and Bunsen burners</strong> have wide, heavy bases so they do not topple easily when knocked.</li>
          <li>• <strong className="font-semibold text-slate-900">Ships</strong> carry ballast (heavy weight) low in the hull to keep their centre of gravity low and stop them capsizing.</li>
          <li>• <strong className="font-semibold text-slate-900">Tightrope walkers</strong> carry a long pole, which lowers and widens the overall centre of gravity of the walker-and-pole system, making them more stable.</li>
        </ul>
      </div>
    </div>
  </div>
);

/* ---- Pressure: SVG diagrams ---- */

const PressureAreaDiagram: React.FC = () => (
  <svg viewBox="0 0 320 160" className="w-full max-w-md">
    <rect x="0" y="130" width="320" height="10" fill="#c7b28a" />
    <rect x="40" y="90" width="30" height="40" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <line x1="55" y1="40" x2="55" y2="88" stroke="#ff3b30" strokeWidth="5" markerEnd="url(#arrowRedPA)" />
    <text x="15" y="30" fontSize="11" fill="#ff3b30" fontWeight="bold">Same force</text>
    <text x="10" y="152" fontSize="10" fill="#334155">Small area → high pressure</text>
    <rect x="170" y="115" width="120" height="15" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <line x1="230" y1="40" x2="230" y2="113" stroke="#ff3b30" strokeWidth="5" markerEnd="url(#arrowRedPA2)" />
    <text x="200" y="30" fontSize="11" fill="#ff3b30" fontWeight="bold">Same force</text>
    <text x="160" y="152" fontSize="10" fill="#334155">Large area → low pressure</text>
    <defs>
      <marker id="arrowRedPA" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#ff3b30" /></marker>
      <marker id="arrowRedPA2" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#ff3b30" /></marker>
    </defs>
  </svg>
);

/** Clear, scale-independent diagrams of the four hydrostatic-pressure rules. */
const LiquidDepthScene: React.FC = () => (
  <svg viewBox="0 0 480 230" role="img" aria-label="Three animated water jets leave holes at increasing depths; deeper holes have faster initial flow" className="h-full w-full">
    <defs>
      <linearGradient id="depthWaterFill" x2="0" y2="1"><stop stopColor="#7dd3fc"/><stop offset="1" stopColor="#0284c7"/></linearGradient>
      <clipPath id="depthTankClip"><rect x="42" y="30" width="154" height="158" rx="3" /></clipPath>
    </defs>
    <rect x="42" y="30" width="154" height="158" rx="3" fill="#eff6ff" stroke="#475569" strokeWidth="2.5" />
    <g clipPath="url(#depthTankClip)">
      <rect x="44" y="55" width="150" height="131" fill="url(#depthWaterFill)" opacity=".85" />
      <path d="M44 55 H194" stroke="#0369a1" strokeWidth="2" />
    </g>
    <text x="47" y="22" fontSize="13" fill="#334155">Water surface</text>
    <g fill="none" stroke="#0369a1" strokeWidth="3" strokeLinecap="round">
      <path d="M196 83 Q220 83 245 91" />
      <path d="M196 123 Q235 123 282 140" />
      <path d="M196 163 Q255 163 318 190" />
    </g>
    <g fill="none" stroke="#7dd3fc" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 12">
      <path d="M196 83 Q220 83 245 91"><animate attributeName="stroke-dashoffset" values="0;-20" dur="1.2s" repeatCount="indefinite" /></path>
      <path d="M196 123 Q235 123 282 140"><animate attributeName="stroke-dashoffset" values="0;-20" dur=".75s" repeatCount="indefinite" /></path>
      <path d="M196 163 Q255 163 318 190"><animate attributeName="stroke-dashoffset" values="0;-20" dur=".5s" repeatCount="indefinite" /></path>
    </g>
    <g fill="#0f172a"><circle cx="196" cy="83" r="3"/><circle cx="196" cy="123" r="3"/><circle cx="196" cy="163" r="3"/></g>
    <g fontSize="13" fill="#0f172a">
      <text x="327" y="88">Shallow: slower exit</text>
      <text x="327" y="135">Deeper: faster exit</text>
      <text x="327" y="182">Deepest: fastest exit</text>
    </g>
    <text x="42" y="219" fontSize="12" fill="#334155">Greater depth gives greater pressure and a faster jet.</text>
  </svg>
);

const LiquidAllDirectionsScene: React.FC = () => (
  <svg viewBox="0 0 440 220" role="img" aria-label="At a point in water, pressure acts equally in every direction" className="h-full w-full">
    <rect x="99" y="22" width="242" height="170" rx="3" fill="#e0f2fe" stroke="#64748b" strokeWidth="3" />
    <rect x="102" y="39" width="236" height="150" fill="#38bdf8" fillOpacity=".48" />
    <path d="M102 39 H338" stroke="#0284c7" strokeWidth="2" />
    <circle cx="220" cy="116" r="28" fill="#475569" stroke="#334155" strokeWidth="2" />
    <defs><marker id="liquidPressureArrow" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#e11d48" /></marker></defs>
    <g stroke="#e11d48" strokeWidth="3" markerEnd="url(#liquidPressureArrow)">
      <path d="M220 62 V85" /><path d="M220 170 V147" /><path d="M166 116 H189" /><path d="M274 116 H251" />
      <path d="M181 77 L200 96" /><path d="M259 77 L240 96" /><path d="M181 155 L200 136" /><path d="M259 155 L240 136" />
    </g>
    <text x="127" y="210" fontSize="13" fill="#334155">At a point, pressure acts in every direction</text>
  </svg>
);

const LiquidShapeScene: React.FC = () => (
  <svg viewBox="0 0 440 220" role="img" aria-label="Three connected vessels of different shapes have the same water level and pressure at the same depth" className="h-full w-full">
    <defs><clipPath id="connectedVesselsClip"><path d="M55 33 H95 V169 H172 L156 33 H200 L217 169 H294 L310 33 H350 L330 190 H55 Z" /></clipPath></defs>
    <path d="M55 33 V190 H330 L350 33 M95 33 V169 H172 L156 33 M200 33 L217 169 H294 L310 33" fill="none" stroke="#475569" strokeWidth="4" strokeLinejoin="round" />
    <rect x="55" y="91" width="300" height="99" fill="#38bdf8" fillOpacity=".56" clipPath="url(#connectedVesselsClip)" />
    <path d="M55 91 H95 M164 91 H193 M302 91 H341" stroke="#0284c7" strokeWidth="2" />
    <path d="M40 91 H365" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="5 5" />
    <text x="125" y="22" fontSize="13" fill="#334155">Open to the same atmosphere</text>
    <text x="118" y="211" fontSize="13" fill="#334155">Same surface level · same bottom pressure</text>
  </svg>
);

const LiquidDensityScene: React.FC = () => (
  <svg viewBox="0 0 440 220" role="img" aria-label="At equal depth, denser salt water has greater pressure than fresh water" className="h-full w-full">
    <rect x="70" y="38" width="105" height="132" fill="#e0f2fe" stroke="#475569" strokeWidth="3" />
    <rect x="73" y="54" width="99" height="113" fill="#38bdf8" fillOpacity=".55" />
    <rect x="265" y="38" width="105" height="132" fill="#e0f2fe" stroke="#475569" strokeWidth="3" />
    <rect x="268" y="54" width="99" height="113" fill="#0e7490" fillOpacity=".65" />
    <path d="M73 54 H172 M268 54 H367 M58 54 H382" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="5 4" />
    <circle cx="122" cy="155" r="5" fill="#0f172a" /><circle cx="317" cy="155" r="5" fill="#0f172a" />
    <text x="76" y="27" fontSize="14" fontWeight="600" fill="#0f172a">Fresh water</text>
    <text x="276" y="27" fontSize="14" fontWeight="600" fill="#0f172a">Salt water</text>
    <text x="90" y="191" fontSize="14" fill="#0f172a">lower P</text>
    <text x="283" y="191" fontSize="14" fill="#0f172a">higher P</text>
    <text x="135" y="214" fontSize="12" fill="#334155">Equal depth h · denser liquid gives greater P</text>
  </svg>
);

const HydrostaticColumnDiagram: React.FC = () => (
  <svg viewBox="0 0 280 250" role="img" aria-label="At depth h below the free surface, the gauge pressure is rho g h" className="w-full max-w-xs">
    <rect x="72" y="35" width="126" height="172" rx="2" fill="#bae6fd" stroke="#475569" strokeWidth="2.5" />
    <path d="M75 49 H195" stroke="#0284c7" strokeWidth="2" />
    <text x="75" y="27" fontSize="13" fill="#334155">Free surface</text>
    <circle cx="135" cy="183" r="5" fill="#0f172a" />
    <path d="M51 49 V183 M46 49 H56 M46 183 H56" stroke="#334155" strokeWidth="1.5" />
    <text x="34" y="123" fontSize="16" fill="#334155">h</text>
    <text x="101" y="121" fontSize="16" fill="#0f172a">ρ, g</text>
    <path d="M140 183 H216" stroke="#dc2626" strokeWidth="1.8" />
    <text x="100" y="238" fontSize="15" fill="#0f172a">Gauge pressure = ρgh</text>
  </svg>
);

const BarometerDiagram: React.FC = () => (
  <svg viewBox="0 0 340 300" role="img" aria-label="Mercury barometer: a vacuum above the mercury column, with height h measured from the reservoir surface" className="w-full max-w-sm">
    <path d="M118 226 H291 V257 H118 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
    <path d="M185 36 H212 V253 H185 Z" fill="#f8fafc" stroke="#475569" strokeWidth="2.5" />
    <path d="M188 91 H209 V253 H188 Z" fill="#94a3b8" />
    <path d="M121 229 H182 V254 H121 Z M215 229 H288 V254 H215 Z" fill="#94a3b8" />
    <path d="M188 91 H209 M121 229 H182 M215 229 H288" stroke="#475569" strokeWidth="1.5" />
    <path d="M103 91 V229 M97 91 H109 M97 229 H109" stroke="#334155" strokeWidth="1.5" />
    <text x="13" y="155" fontSize="13" fill="#334155">h ≈ 760 mm</text>
    <path d="M213 56 H228" stroke="#64748b" strokeWidth="1.2" />
    <text x="233" y="60" fontSize="13" fill="#334155">Vacuum</text>
    <text x="58" y="283" fontSize="12" fill="#334155">Atmosphere presses on the open reservoir</text>
  </svg>
);

const ManometerDiagram: React.FC = () => (
  <svg viewBox="0 0 360 250" role="img" aria-label="U-tube manometer. Higher gas pressure lowers liquid on the gas side and raises it on the open-air side by height h." className="w-full max-w-md">
    <defs><marker id="manoSmallArrow" markerWidth="5" markerHeight="5" refX="4.5" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill="#dc2626"/></marker></defs>
    <path d="M93 50 V190 Q93 220 123 220 H237 Q267 220 267 190 V50" fill="none" stroke="#475569" strokeWidth="29" strokeLinecap="butt" strokeLinejoin="round" />
    <path d="M93 50 V190 Q93 220 123 220 H237 Q267 220 267 190 V50" fill="none" stroke="#f8fafc" strokeWidth="23" strokeLinecap="butt" strokeLinejoin="round" />
    <path d="M93 143 V190 Q93 220 123 220 H237 Q267 220 267 190 V88" fill="none" stroke="#3b82f6" strokeWidth="20" strokeLinecap="butt" strokeLinejoin="round" />
    <path d="M82 143 H104 M256 88 H278" stroke="#1d4ed8" strokeWidth="2" />
    <path d="M110 88 H235 M110 143 H235" stroke="#64748b" strokeDasharray="4 4" strokeWidth="1.2" />
    <path d="M225 88 V143 M219 88 H231 M219 143 H231" stroke="#334155" strokeWidth="1.5" />
    <text x="193" y="120" fontSize="16" fontWeight="600" fill="#334155">h</text>
    <path d="M38 66 H76" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#manoSmallArrow)" />
    <text x="27" y="43" fontSize="14" fill="#991b1b">Gas</text>
    <text x="247" y="36" fontSize="13" fill="#334155">Open to air</text>
    <text x="97" y="245" fontSize="12" fill="#334155">Gas pressure &gt; atmospheric pressure</text>
  </svg>
);

const HydraulicSystemDiagram: React.FC = () => (
  <svg viewBox="0 0 320 200" className="w-full max-w-md">
    <rect x="30" y="120" width="30" height="30" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <line x1="45" y1="80" x2="45" y2="118" stroke="#ff3b30" strokeWidth="4" markerEnd="url(#arrowRedHyd1)" />
    <text x="10" y="70" fontSize="10" fill="#ff3b30" fontWeight="bold">F₁ (small)</text>
    <rect x="230" y="60" width="60" height="30" fill="#8d6e63" stroke="#5d4037" strokeWidth="2" />
    <line x1="260" y1="57" x2="260" y2="23" stroke="#22c55e" strokeWidth="6" markerEnd="url(#arrowGreenHyd)" />
    <text x="215" y="15" fontSize="10" fill="#22c55e" fontWeight="bold">F₂ (large)</text>
    <rect x="20" y="150" width="280" height="20" fill="#93c5fd" opacity="0.7" />
    <text x="55" y="188" fontSize="10" fill="#334155">Small piston, area A₁</text>
    <text x="205" y="188" fontSize="10" fill="#334155">Large piston, area A₂</text>
    <defs>
      <marker id="arrowRedHyd1" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#ff3b30" /></marker>
      <marker id="arrowGreenHyd" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0,0 L4,2 L0,4 Z" fill="#22c55e" /></marker>
    </defs>
  </svg>
);

const BoyleLawDiagram: React.FC = () => (
  <svg viewBox="0 0 360 220" role="img" aria-label="A piston compresses the same six gas particles to half their original volume at constant temperature, doubling pressure" className="w-full max-w-lg">
    <defs><marker id="boyleSmallArrow" markerWidth="4" markerHeight="4" refX="3.5" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="#dc2626" /></marker></defs>
    <text x="33" y="22" fontSize="13" fontWeight="600" fill="#334155">Before</text>
    <text x="224" y="22" fontSize="13" fontWeight="600" fill="#334155">Compressed</text>
    <path d="M55 35 V174 H135 V35 M225 35 V174 H305 V35" fill="none" stroke="#334155" strokeWidth="3" />
    <rect x="52" y="38" width="86" height="11" rx="2" fill="#64748b" />
    <rect x="222" y="102" width="86" height="11" rx="2" fill="#64748b" />
    <path d="M265 48 V91" stroke="#dc2626" strokeWidth="2" markerEnd="url(#boyleSmallArrow)" />
    <g fill="#2563eb">
      <circle cx="73" cy="73" r="4"/><circle cx="115" cy="89" r="4"/><circle cx="88" cy="108" r="4"/>
      <circle cx="121" cy="133" r="4"/><circle cx="70" cy="151" r="4"/><circle cx="98" cy="158" r="4"/>
      <circle cx="240" cy="127" r="4"/><circle cx="278" cy="126" r="4"/><circle cx="258" cy="141" r="4"/>
      <circle cx="291" cy="149" r="4"/><circle cx="240" cy="161" r="4"/><circle cx="275" cy="165" r="4"/>
    </g>
    <path d="M155 106 H201" stroke="#475569" strokeWidth="2" markerEnd="url(#boyleSmallArrow)" />
    <text x="53" y="197" fontSize="13" fill="#0f172a">V₁, P₁</text>
    <text x="222" y="197" fontSize="13" fill="#0f172a">V₂ = ½V₁</text>
    <text x="94" y="215" fontSize="12" fill="#334155">Same gas particles · constant temperature · P₂ = 2P₁</text>
  </svg>
);

const BoylePVGraphDiagram: React.FC = () => (
  <svg viewBox="0 0 340 220" role="img" aria-label="Boyle's law pressure-volume graph: a smooth inverse curve with pressure doubling as volume halves" className="w-full max-w-lg">
    <path d="M43 22 V180 H310" fill="none" stroke="#334155" strokeWidth="2" />
    <text x="24" y="27" fontSize="14" fill="#334155">P</text>
    <text x="303" y="200" fontSize="14" fill="#334155">V</text>
    <path d={Array.from({ length: 200 }, (_, i) => {
      const x = 85 + i * 1.05;
      const y = 180 - 7200 / (x - 40);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ')} fill="none" stroke="#1d4ed8" strokeWidth="3" />
    <path d="M100 60 V180 M43 60 H100 M160 120 V180 M43 120 H160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
    <circle cx="100" cy="60" r="4" fill="#1d4ed8"/><circle cx="160" cy="120" r="4" fill="#1d4ed8"/>
    <text x="109" y="54" fontSize="12" fill="#0f172a">V₂, P₂</text>
    <text x="169" y="117" fontSize="12" fill="#0f172a">V₁, P₁</text>
    <text x="184" y="45" fontSize="13" fill="#1d4ed8">PV = constant</text>
    <text x="95" y="214" fontSize="12" fill="#334155">Fixed gas · constant temperature</text>
  </svg>
);

/* ---- Full Pressure content ---- */

const PressureBlock: React.FC = () => (
  <div className="mb-10">
    <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Pressure</h2>

    <DefinitionBox text="**Pressure** is the amount of force pushing on a certain area. The same force spread over a small area creates a much bigger pressure than the same force spread over a large area." />

    <div className="mb-6">
      <TitleBanner>What this means</TitleBanner>
      <p className="leading-relaxed text-slate-700">
        A sharp pin sinks into soft ground easily with a gentle push, because all the force is squeezed
        into a tiny area. A wide, flat object with the same force spreads it out, so it presses much less
        hard on any one spot.
      </p>
    </div>

    <div className="mb-6 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
      <PressureAreaDiagram />
    </div>

    <KeyFormula label="The Formula" formula="P = F / A" />

    <div className="mb-6">
      <TitleBanner>What Each Part Means</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <StepRow step="P">
          <strong className="font-semibold text-slate-900">Pressure (P)</strong> — how concentrated the
          force is, measured in pascals (Pa).
        </StepRow>
        <StepRow step="F">
          <strong className="font-semibold text-slate-900">Force (F)</strong> — the push acting at a right
          angle to the surface, measured in newtons (N).
        </StepRow>
        <StepRow step="A">
          <strong className="font-semibold text-slate-900">Area (A)</strong> — the size of the surface the
          force is spread over, measured in square metres (m²).
        </StepRow>
      </div>
    </div>

    <div className="mb-6">
      <TitleBanner>SI Units</TitleBanner>
      <RuleList
        forceList
        rules={[
          { rule: 'The SI unit of pressure is the pascal (Pa).', example: '1 Pa = 1 N/m²' },
          { rule: 'Larger pressures are often given in kilopascals.', example: '1 kPa = 1000 Pa' },
          { rule: 'Atmospheric pressure is often quoted in other units too.', example: '1 atm ≈ 101,325 Pa ≈ 760 mmHg' },
        ]}
      />
    </div>

    <div className="mb-4">
      <TitleBanner>Everyday Examples</TitleBanner>
      <RuleList
        forceList
        rules={[
          { rule: 'A sharp knife cuts more easily than a blunt one.', example: 'A thin blade concentrates force into a tiny area.' },
          { rule: 'Snowshoes stop you sinking into snow.', example: 'A wide shoe spreads your weight, lowering the pressure.' },
          { rule: 'Tractor tyres are wide.', example: 'Spreads a heavy tractor\'s weight so it doesn\'t sink into soil.' },
          { rule: 'A drawing pin has a sharp point.', example: 'A tiny tip area makes the pressure large enough to pierce a board.' },
        ]}
      />
    </div>

    <div className="my-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Pressure in Liquids</h2>

      <DefinitionBox text="**Pressure in a liquid** is caused by the weight of the liquid pressing down on everything inside it. It exists at every point in the liquid, and gets bigger the deeper you go." />

      <div className="mb-6">
        <TitleBanner>What this means</TitleBanner>
        <p className="leading-relaxed text-slate-700">
          Every layer of liquid supports the weight of all the liquid above it, so the deeper you go, the
          more pressure there is. This is why your ears feel squeezed at the bottom of a swimming pool but
          not near the surface — water pressure pushes on you from every direction, growing with depth.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <h4 className="pt-3 text-center text-xs font-bold uppercase text-slate-500">1. Increases with depth</h4>
          <div className="h-48 w-full bg-gradient-to-b from-sky-50 to-white sm:h-56"><LiquidDepthScene /></div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <h4 className="pt-3 text-center text-xs font-bold uppercase text-slate-500">2. Acts in all directions</h4>
          <div className="h-48 w-full bg-gradient-to-b from-sky-50 to-white sm:h-56"><LiquidAllDirectionsScene /></div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <h4 className="pt-3 text-center text-xs font-bold uppercase text-slate-500">3. Independent of shape</h4>
          <div className="h-48 w-full bg-gradient-to-b from-sky-50 to-white sm:h-56"><LiquidShapeScene /></div>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <h4 className="pt-3 text-center text-xs font-bold uppercase text-slate-500">4. Depends on density</h4>
          <div className="h-48 w-full bg-gradient-to-b from-sky-50 to-white sm:h-56"><LiquidDensityScene /></div>
        </div>
      </div>

      <div className="mb-8">
        <TitleBanner>Characteristics of Liquid Pressure</TitleBanner>
        <RuleList
          forceList
          rules={[
            { rule: 'Increases with depth.', example: 'The deeper you go, the greater the pressure.' },
            { rule: 'Increases with the density of the liquid.', example: 'A denser liquid presses harder at the same depth.' },
            { rule: 'Acts equally in all directions at a point.', example: 'A submerged object is squeezed evenly on all sides.' },
            { rule: 'Does not depend on the shape or width of the container.', example: 'Only depth and density matter.' },
            { rule: 'Is the same at all points at the same depth.', example: 'Connected liquids settle to the same level.' },
          ]}
        />
      </div>

      <TitleBanner>The Hydrostatic Pressure Formula</TitleBanner>
      <p className="mb-4 leading-relaxed text-slate-700">
        <strong className="font-bold text-slate-900">Hydrostatic pressure</strong> is the pressure at a
        depth inside a liquid, caused only by the weight of the liquid above that point.
      </p>
      <div className="mb-4 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <HydrostaticColumnDiagram />
      </div>

      <KeyFormula label="The Formula" formula="P = ρ g h" />

      <div className="mb-6">
        <TitleBanner>What Each Part Means</TitleBanner>
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <StepRow step="ρ">
            <strong className="font-semibold text-slate-900">Density (ρ)</strong> — measured in kg/m³.
          </StepRow>
          <StepRow step="g">
            <strong className="font-semibold text-slate-900">Gravitational field strength (g)</strong> — about 9.8 m/s² (often 10 m/s²).
          </StepRow>
          <StepRow step="h">
            <strong className="font-semibold text-slate-900">Depth (h)</strong> — measured in metres (m).
          </StepRow>
        </div>
      </div>

      <TitleBanner>Worked Examples</TitleBanner>
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div>
          <p className="font-semibold text-slate-800">1. Pressure at 5 m in water (ρ = 1000 kg/m³, g = 10 m/s²).</p>
          <p className="ga-ink text-blue-800">P = ρgh = 1000 × 10 × 5 = 50,000 Pa</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">2. A diver 20 m deep in seawater (ρ = 1025 kg/m³, g = 10 m/s²).</p>
          <p className="ga-ink text-blue-800">P = ρgh = 1025 × 10 × 20 = 205,000 Pa</p>
        </div>
        <div>
          <p className="font-semibold text-slate-800">3. Pressure at the base of an oil tank is 39,200 Pa (ρ = 800 kg/m³, g = 10 m/s²). Find the depth.</p>
          <p className="ga-ink text-blue-800">h = P / (ρg) = 39,200 / 8000 = 4.9 m</p>
        </div>
      </div>
    </div>

    <div className="my-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Atmospheric Pressure & Barometers</h2>
      <DefinitionBox text="**Atmospheric pressure** is the pressure caused by the weight of the air in the Earth's atmosphere pressing down on everything below it." />
      <p className="mb-6 leading-relaxed text-slate-700">
        A huge column of air stretches above every point on Earth. At sea level this adds up to about
        101,000 Pa — enough to hold up a 760 mm column of mercury. Higher up (e.g. on a mountain) there is
        less air above you, so pressure is lower.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-center text-xs font-bold uppercase text-slate-500">Mercury Barometer</h4>
          <div className="flex justify-center"><BarometerDiagram /></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
          <p className="mb-2">A vacuum sits at the top of the sealed tube.</p>
          <p className="mb-2">Atmospheric pressure pushes on the mercury in the open dish, holding the column up.</p>
          <p>A taller column means higher pressure; a shorter one means lower pressure.</p>
        </div>
      </div>
      <RuleList
        forceList
        rules={[
          { rule: 'Normal atmospheric pressure at sea level is about 101,325 Pa.', example: '= 101.3 kPa = 1 atm = 760 mmHg' },
          { rule: 'Atmospheric pressure decreases with altitude.', example: 'Lower at the top of a mountain than at sea level.' },
          { rule: 'A barometer measures atmospheric pressure.', example: 'Mercury and aneroid barometers.' },
          { rule: 'Falling pressure often signals stormy weather.', example: 'Used by weather forecasters.' },
        ]}
      />
    </div>

    <div className="my-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Manometers & Gas Pressure Measurement</h2>
      <DefinitionBox text="A **manometer** is a U-shaped tube of liquid used to measure gas pressure by comparing it to atmospheric pressure." />
      <p className="mb-6 leading-relaxed text-slate-700">
        One end connects to the gas; the other is open to air. If gas pressure is higher than atmospheric
        pressure, it pushes liquid down on its side and up on the open side — a bigger pressure difference
        means a bigger height difference (h).
      </p>
      <div className="mb-6 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <ManometerDiagram />
      </div>
      <KeyFormula label="Gas pressure:" formula="P(gas) = P(atmospheric) + ρ g h" />
      <TitleBanner>Worked Example</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="font-semibold text-slate-800">
          Height difference of 0.20 m mercury (ρ = 13,600 kg/m³, g = 10 m/s²), atmospheric pressure 101,000 Pa.
        </p>
        <p className="ga-ink mt-2 text-blue-800">
          ρgh = 27,200 Pa &nbsp;→&nbsp; P(gas) = 101,000 + 27,200 = 128,200 Pa
        </p>
      </div>
    </div>

    <div className="my-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Hydraulic Systems (Pascal's Principle)</h2>
      <DefinitionBox text="**Pascal's Principle** states that pressure applied to a liquid in a closed system is transmitted equally to every part of the liquid." />
      <p className="mb-6 leading-relaxed text-slate-700">
        A small force on a small piston creates the same pressure as a much bigger force on a much bigger
        piston — this lets hydraulic systems multiply force, used in car brakes, jacks, and diggers.
      </p>
      <div className="mb-6 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
        <HydraulicSystemDiagram />
      </div>
      <KeyFormula label="The Formula" formula="F₁ / A₁ = F₂ / A₂" />
      <TitleBanner>Worked Example</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="font-semibold text-slate-800">
          Small piston area 0.01 m², large piston area 0.25 m², force 50 N on the small piston.
        </p>
        <p className="ga-ink mt-2 text-blue-800">F₂ = 50 × (0.25 / 0.01) = 1250 N</p>
      </div>
    </div>

    <div className="my-10 border-t-2 border-slate-200 pt-10 sm:pt-14">
      <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        6.6 Gas Laws & Kinetic Theory (Boyle's Law)
      </h2>
      <DefinitionBox text="**Boyle's Law** states that, at constant temperature, the pressure of a fixed amount of gas is inversely proportional to its volume." />
      <p className="mb-6 leading-relaxed text-slate-700">
        Gas pressure comes from particles constantly colliding with the container walls. Squeeze the same
        particles into a smaller volume and they hit the walls more often, so pressure rises.
      </p>
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-center text-xs font-bold uppercase text-slate-500">Compressing a Gas</h4>
          <div className="flex justify-center"><BoyleLawDiagram /></div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="mb-2 text-center text-xs font-bold uppercase text-slate-500">Pressure vs Volume</h4>
          <div className="flex justify-center"><BoylePVGraphDiagram /></div>
        </div>
      </div>
      <KeyFormula label="The Formula" formula="P₁V₁ = P₂V₂" />
      <TitleBanner>Worked Example</TitleBanner>
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <p className="font-semibold text-slate-800">
          Gas at 0.60 m³ and 100 kPa is compressed to 0.20 m³ at constant temperature.
        </p>
        <p className="ga-ink mt-2 text-blue-800">P₂ = (100 × 0.60) / 0.20 = 300 kPa</p>
      </div>
    </div>
  </div>
);


const sections: Section[] = [
  {
    id: 'newtons-laws',
    eyebrow: 'Chapter 3.2',
    title: 'Effect of Force on Motion',
    heading: 'Effect of Force on Motion — Newton\'s Laws',
    intro: '',
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
    id: 'hookes-law',
    eyebrow: 'Chapter 3.1',
    title: 'Effect of Force on Materials',
    heading: 'Effect of Force on Materials — Hooke\'s Law',
    intro: '',
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
    id: 'friction-circular',
    eyebrow: 'Chapter 3.3',
    title: 'Friction and Circular Motion',
    heading: 'Friction and Circular Motion',
    intro: '',
    examples: [
      {
        question: 'A car is moving around a circular track of radius 50 m at a speed of 20 m/s. Calculate the centripetal acceleration.',
        steps: ['v = 20 m/s', 'r = 50 m', 'a = v² / r = 20² / 50 = 400 / 50 = 8 m/s²'],
        answer: 'a = 8 m/s²',
      },
      {
        question: 'A ball of mass 0.5 kg moves in a circle of radius 0.8 m at a speed of 4 m/s. Calculate the centripetal force acting on it.',
        steps: ['m = 0.5 kg', 'v = 4 m/s', 'r = 0.8 m', 'F = m v² / r = 0.5 × 4² / 0.8 = 0.5 × 16 / 0.8 = 10 N'],
        answer: 'F = 10 N',
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
      'A 2 kg object moves in a circle of radius 0.5 m at 3 m/s. Calculate the centripetal force acting on it.',
    ],
  },
  {
    id: 'moments',
    eyebrow: 'Chapter 3.4',
    title: 'Turning Effect of a Force',
    heading: 'Turning Effect of a Force — Moments',
    intro: '',
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
    intro: '',
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
    intro: '',
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

      {section.id === 'newtons-laws' && <ForceIntro />}
      {section.id === 'hookes-law' && (
        <>
          <MaterialsIntro />
          <HookesLawBlock />
        </>
      )}
      {section.id === 'moments' && (
        <>
          <TurningForceIntro />
          <MomentOfForceBlock />
          <PrincipleOfMomentsBlock />
          <CentreOfGravityBlock />
        </>
      )}
      {section.id === 'friction-circular' && (
        <>
          <FrictionIntro />
          <CircularMotionBlock />
        </>
      )}
      {section.id === 'centre-of-mass' && <CentreOfMassBlock />}
      {section.id === 'pressure' && <PressureBlock />}

      <div className="mb-6">
        {section.intro && (
          <p className="relative mb-6 pl-4 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300">
            {renderRich(section.intro)}
          </p>
        )}
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
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex min-w-0 flex-nowrap items-center justify-start gap-1.5 overflow-x-auto pb-1 text-left sm:gap-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map(s => {
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${
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
