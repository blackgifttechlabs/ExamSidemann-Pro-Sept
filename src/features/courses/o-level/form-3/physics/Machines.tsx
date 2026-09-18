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
    type: 'image' | 'lever' | 'pulley' | 'inclined';
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

  /* ========================================================================
    SIMPLE MACHINES — STUDENT-FRIENDLY OVERVIEW
    ======================================================================== */

  const OverviewLead: React.FC<{ children: ReactNode }> = ({ children }) => (
    <p className="relative mb-5 pl-4 leading-relaxed text-slate-700 before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-slate-300">
      {children}
    </p>
  );

  const OverviewHeading: React.FC<{ children: ReactNode }> = ({ children }) => (
    <h3 className="mb-3 mt-8 text-lg font-bold text-slate-900 sm:text-xl">{children}</h3>
  );

  const TermCard: React.FC<{
    accent: 'blue' | 'emerald';
    text: string;
    examples: string[];
  }> = ({ accent, text, examples }) => {
    const styles =
      accent === 'blue'
        ? { border: 'border-blue-200', bg: 'bg-blue-50/60', title: 'text-blue-900' }
        : { border: 'border-emerald-200', bg: 'bg-emerald-50/60', title: 'text-emerald-900' };
    return (
      <div className={`lesson-prose-panel mb-6 overflow-hidden rounded-2xl border-2 ${styles.border} ${styles.bg} px-5 py-4 sm:px-6 sm:py-5`}>
        <p className={`text-[1.05rem] font-semibold leading-relaxed ${styles.title}`}>{renderRich(text)}</p>
        <ul className="mt-3 space-y-1">
          {examples.map((ex, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-600">
              <span className="mt-1 shrink-0 text-slate-400">●</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const MachineFlowDiagram: React.FC = () => (
    <div className="mb-6 min-w-0 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 sm:p-4">
      <h4 className="mb-3 text-xs font-bold uppercase text-emerald-600">How a Simple Machine Works</h4>
      <div className="grid gap-3 rounded-lg bg-white p-4 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4"><p className="font-bold text-blue-800">Effort</p><p className="mt-2 text-sm text-slate-600">Force we apply</p></div>
        <span aria-hidden="true" className="text-center text-2xl text-slate-400"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4"><p className="font-bold text-slate-900">Simple machine</p></div>
        <span aria-hidden="true" className="text-center text-2xl text-slate-400"><span className="sm:hidden">↓</span><span className="hidden sm:inline">→</span></span>
        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4"><p className="font-bold text-emerald-800">Load</p><p className="mt-2 text-sm text-slate-600">Object being moved</p></div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">Effort goes into the machine, and the machine helps move the load.</p>
    </div>
  );

  const machineTypes = [
    { image: '/images/physics/simple-machines/lever.webp', name: '1. Lever', definition: 'A rigid bar that turns about a fixed point (the pivot) to lift or move a load.', example: 'e.g. a see-saw or a crowbar' },
    { image: '/images/physics/simple-machines/inclined-plane.webp', name: '2. Inclined Plane', definition: 'A sloping surface that lets us raise a load gradually instead of straight up.', example: 'e.g. a ramp' },
    { image: '/images/physics/simple-machines/wheel-and-axle.webp', name: '3. Wheel and Axle', definition: 'A large wheel fixed to a smaller rod (axle) that turn together.', example: 'e.g. a door handle or a steering wheel' },
    { image: '/images/physics/simple-machines/pulley.webp', name: '4. Pulley', definition: 'A wheel with a rope over it, used to change the direction of a pulling force.', example: 'e.g. lifting a bucket from a well' },
    { image: '/images/physics/simple-machines/screw.webp', name: '5. Screw', definition: 'An inclined plane wrapped around a rod, used to grip or lift with a turning force.', example: 'e.g. a jar lid or a bottle top' },
    { image: '/images/physics/simple-machines/wedge.webp', name: '6. Wedge', definition: 'Two inclined planes joined back-to-back, used to split or push things apart.', example: 'e.g. an axe or a knife' },
  ];

  const MachinesOverviewBody: React.FC = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Simple Machines
        </h1>
      </div>

      <OverviewLead>
        A <strong className="font-bold text-slate-900">machine</strong> is something that helps us do a job more easily.
      </OverviewLead>
      <OverviewLead>
        A machine does not do the job for free — it simply makes the job easier. It can help us by:
      </OverviewLead>
      <ul className="mb-6 ml-1 space-y-3 text-slate-700">
        <li className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">●</span>
          <span><strong className="font-semibold text-slate-800">reducing the effort</strong> needed to move a load</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">●</span>
          <span><strong className="font-semibold text-slate-800">changing the direction</strong> of a force</span>
        </li>
        <li className="flex items-center gap-2">
          <span className="shrink-0 text-emerald-400">●</span>
          <span>allowing a force to <strong className="font-semibold text-slate-800">act over a greater distance</strong></span>
        </li>
      </ul>

      <OverviewHeading>Load</OverviewHeading>
      <TermCard
        accent="emerald"
        text="The **load** is the object or resistance that the machine is helping us move. SI unit: Newton (N)."
        examples={['A heavy box you are lifting', 'A car being raised on a jack', 'Bricks in a wheelbarrow']}
      />

      <OverviewHeading>Effort</OverviewHeading>
      <TermCard
        accent="blue"
        text="The **effort** is the force we apply to the machine in order to move the load. SI unit: Newton (N)."
        examples={['The push you give a wheelbarrow', 'The pull on a rope over a pulley', 'The push on a lever handle']}
      />

      <OverviewHeading>How a Simple Machine Helps Us</OverviewHeading>
      <OverviewLead>
        Think about pushing a wheelbarrow, opening a bottle, or walking up a ramp instead of a ladder. In each case, the machine
        is not creating new energy, and it is not making the load disappear. It simply changes <strong className="font-bold text-slate-900">how</strong> the
        force is applied — so the same job feels easier.
      </OverviewLead>
      <MachineFlowDiagram />

      <OverviewHeading>Main Types of Simple Machines</OverviewHeading>
      <OverviewLead>
        There are six main types of simple machines. We will look at some of them in more detail later in this chapter.
      </OverviewLead>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {machineTypes.map((m, i) => (
          <div key={i} className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <img src={m.image} alt={`${m.name.slice(3)} example`} className="h-44 w-full rounded-xl border border-slate-200 bg-white object-contain sm:h-48" />
            <h4 className="ga-hand mt-5 text-lg font-bold text-slate-900 sm:text-xl">{m.name}</h4>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{m.definition}</p>
            <p className="ga-ink mt-3 text-base text-blue-800">{m.example}</p>
          </div>
        ))}
      </div>

      <div className="mb-2 overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-50/60 px-5 py-4 sm:px-6 sm:py-5">
        <span className="ga-hand mb-1.5 block text-xs font-bold uppercase tracking-widest text-amber-600">
          Key Idea
        </span>
        <p className="text-[1.05rem] font-semibold leading-relaxed text-amber-900">
          A simple machine does not remove the work. Instead, it makes the work easier by changing the{' '}
          <strong className="font-bold">size</strong>, <strong className="font-bold">direction</strong>, or{' '}
          <strong className="font-bold">distance</strong> of the force we use.
        </p>
      </div>
    </>
  );

  /* ========================================================================
    LEVERS — SHARED HELPERS
    ======================================================================== */

  const Divider: React.FC = () => <hr className="my-8 border-t-2 border-dashed border-slate-200" />;

  const DiagramBox = LessonFigure;

  const NoteBox: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className="lesson-prose-panel mb-4 rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
      {children}
    </div>
  );

  const ExampleBulletList: React.FC<{ items: string[] }> = ({ items }) => (
    <ul className="mb-4 ml-1 space-y-2 text-slate-700">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 shrink-0 text-emerald-400">●</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );

  const ComparisonTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
    <div className="mb-6 overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-sm">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm sm:text-base">
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

  interface WorkedStepExample {
    title: string;
    given: string[];
    find: string;
    formula: string;
    substitution: string;
    calculation: string;
    answer: string;
    meaning: string;
  }

  const WorkedExampleBox: React.FC<{ index: number; example: WorkedStepExample }> = ({ index, example }) => (
    <div className="lesson-prose-panel mb-5 rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
          {index}
        </span>
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

  const ExamTipsBox: React.FC<{ items: string[] }> = ({ items }) => (
    <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
        <span className="text-2xl">🎯</span> Lever Exam Tips
      </h3>
      <ul className="space-y-3">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
            <span className="shrink-0 font-bold text-emerald-400">✓</span>
            <span className="text-slate-200">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  /* ========================================================================
    LEVERS — DIAGRAMS
    ======================================================================== */

  const ArrowMark: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; width?: number }> = ({
    x1,
    y1,
    x2,
    y2,
    color,
    width = 2.5,
  }) => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 8;
    const hx1 = x2 - headLen * Math.cos(angle - Math.PI / 6);
    const hy1 = y2 - headLen * Math.sin(angle - Math.PI / 6);
    const hx2 = x2 - headLen * Math.cos(angle + Math.PI / 6);
    const hy2 = y2 - headLen * Math.sin(angle + Math.PI / 6);
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon points={`${x2},${y2} ${hx1},${hy1} ${hx2},${hy2}`} fill={color} />
      </g>
    );
  };

  const BasicLeverDiagram: React.FC = () => (
    <svg viewBox="0 0 480 235" className="h-auto w-full max-w-2xl" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="100" x2="430" y2="100" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
      <polygon points="240,100 222,138 258,138" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
      <text x="240" y="156" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">FULCRUM</text>

      <ArrowMark x1={60} y1={55} x2={60} y2={94} color="#2563eb" />
      <text x="60" y="42" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">EFFORT (E)</text>
      <text x="60" y="26" textAnchor="middle" fontSize="14" fill="#475569">pushed down</text>

      <ArrowMark x1={420} y1={140} x2={420} y2={106} color="#059669" />
      <text x="420" y="158" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">LOAD (L)</text>
      <text x="420" y="174" textAnchor="middle" fontSize="14" fill="#475569">moves up</text>

      <line x1="60" y1="195" x2="240" y2="195" stroke="#2563eb" strokeWidth="2" />
      <line x1="60" y1="189" x2="60" y2="201" stroke="#2563eb" strokeWidth="2" />
      <line x1="240" y1="189" x2="240" y2="201" stroke="#2563eb" strokeWidth="2" />
      <text x="150" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Effort Arm</text>

      <line x1="240" y1="195" x2="420" y2="195" stroke="#059669" strokeWidth="2" />
      <line x1="240" y1="189" x2="240" y2="201" stroke="#059669" strokeWidth="2" />
      <line x1="420" y1="189" x2="420" y2="201" stroke="#059669" strokeWidth="2" />
      <text x="330" y="220" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Load Arm</text>
    </svg>
  );

  const arrangementColor: Record<'F' | 'L' | 'E', string> = { F: '#1e293b', L: '#059669', E: '#2563eb' };
  const arrangementLabel: Record<'F' | 'L' | 'E', string> = { F: 'Fulcrum', L: 'Load', E: 'Effort' };

  const ArrangementRow: React.FC<{ order: ('F' | 'L' | 'E')[] }> = ({ order }) => (
    <svg viewBox="0 0 300 105" className="h-auto w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="48" x2="260" y2="48" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      {order.map((k, i) => {
        const x = 40 + i * 110;
        const isMiddle = i === 1;
        return (
          <g key={i}>
            {isMiddle && <circle cx={x} cy={48} r={25} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" />}
            <circle cx={x} cy={48} r={18} fill={arrangementColor[k]} />
            <text x={x} y={54} textAnchor="middle" fontSize="17" fontWeight="700" fill="#fff">{k}</text>
            <text x={x} y={91} textAnchor="middle" fontSize="14" fontWeight="700" fill="#334155">{arrangementLabel[k]}</text>
          </g>
        );
      })}
    </svg>
  );

  const ClassesOverviewDiagram: React.FC = () => (
    <div className="grid w-full grid-cols-1 divide-y-2 divide-slate-200 lg:grid-cols-3 lg:divide-x-2 lg:divide-y-0">
      <div className="flex flex-col items-center gap-3 px-4 py-5 lg:px-6 lg:py-8">
        <span className="ga-hand text-lg font-bold text-slate-700">1st Class</span>
        <ArrangementRow order={['L', 'F', 'E']} />
      </div>
      <div className="flex flex-col items-center gap-3 px-4 py-5 lg:px-6 lg:py-8">
        <span className="ga-hand text-lg font-bold text-slate-700">2nd Class</span>
        <ArrangementRow order={['F', 'L', 'E']} />
      </div>
      <div className="flex flex-col items-center gap-3 px-4 py-5 lg:px-6 lg:py-8">
        <span className="ga-hand text-lg font-bold text-slate-700">3rd Class</span>
        <ArrangementRow order={['F', 'E', 'L']} />
      </div>
    </div>
  );

  const leverExamples = {
    first: ['Seesaw', 'Scissors', 'Crowbar', 'Claw hammer', 'Pliers', 'Balance scale', 'Bolt cutters', 'Rowing oar', 'Wire cutters', 'Tin snips'],
    second: ['Wheelbarrow', 'Nutcracker', 'Bottle opener', 'Garlic press', 'Lemon squeezer', 'Hand truck', 'Paper cutter', 'Tip cart (lifted)', 'Door (pushed at edge)', 'Chest lid (lifted)'],
    third: ['Human forearm', 'Tweezers', 'Fishing rod', 'Broom', 'Shovel', 'Chopsticks', 'Garden rake', 'Baseball bat', 'Hockey stick', 'Fly swatter'],
  } as const;

  const LeverExamplesGallery: React.FC<{ leverClass: keyof typeof leverExamples }> = ({ leverClass }) => (
    <div className="mb-8 rounded-xl border border-slate-200 bg-white p-3 sm:p-5">
      <h4 className="mb-3 text-lg font-bold text-slate-900">{leverClass === 'first' ? 'First' : leverClass === 'second' ? 'Second' : 'Third'}-class levers: 10 examples</h4>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {leverExamples[leverClass].map((label, index) => (
          <figure key={label} className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            <img
              src={`/images/physics/levers/${leverClass}-${index + 1}.webp`}
              alt={label}
              className="h-full w-full object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-white/90 px-2 py-2 text-center text-xs font-semibold text-slate-900 sm:text-sm">{label}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );

  const classPositions = [70, 250, 430];

  const LeverDiagram: React.FC<{ order: ('F' | 'L' | 'E')[]; names?: Partial<Record<'F' | 'L' | 'E', string>> }> = ({
    order,
    names,
  }) => {
    const label = { F: names?.F ?? 'F', L: names?.L ?? 'L', E: names?.E ?? 'E' };
    const posOf = (k: 'F' | 'L' | 'E') => classPositions[order.indexOf(k)];
    const fx = posOf('F');
    const lx = posOf('L');
    const ex = posOf('E');
    return (
      <svg viewBox="0 0 500 200" className="h-auto w-full max-w-2xl" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="100" x2="460" y2="100" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
        <polygon points={`${fx},100 ${fx - 18},138 ${fx + 18},138`} fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
        <text x={fx} y="152" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">{label.F}</text>
        <ArrowMark x1={ex} y1={52} x2={ex} y2={94} color="#2563eb" />
        <text x={ex} y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">{label.E}</text>
        <ArrowMark x1={lx} y1={148} x2={lx} y2={106} color="#059669" />
        <text x={lx} y="164" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">{label.L}</text>
      </svg>
    );
  };

  const ArmHighlightDiagram: React.FC<{ highlight: 'effort' | 'load' }> = ({ highlight }) => (
    <svg viewBox="0 0 480 190" className="h-auto w-full max-w-xl" xmlns="http://www.w3.org/2000/svg">
      <line x1="50" y1="90" x2="430" y2="90" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
      <polygon points="240,90 222,128 258,128" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
      <text x="240" y="146" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">FULCRUM</text>
      <circle cx="60" cy="90" r="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
      <text x="60" y="70" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">E</text>
      <circle cx="420" cy="90" r="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2.5" />
      <text x="420" y="70" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">L</text>

      {highlight === 'effort' ? (
        <>
          <line x1="60" y1="165" x2="240" y2="165" stroke="#2563eb" strokeWidth="3" />
          <line x1="60" y1="158" x2="60" y2="172" stroke="#2563eb" strokeWidth="3" />
          <line x1="240" y1="158" x2="240" y2="172" stroke="#2563eb" strokeWidth="3" />
          <text x="150" y="184" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Effort Arm</text>
        </>
      ) : (
        <>
          <line x1="240" y1="165" x2="420" y2="165" stroke="#059669" strokeWidth="3" />
          <line x1="240" y1="158" x2="240" y2="172" stroke="#059669" strokeWidth="3" />
          <line x1="420" y1="158" x2="420" y2="172" stroke="#059669" strokeWidth="3" />
          <text x="330" y="184" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Load Arm</text>
        </>
      )}
    </svg>
  );

  const MovementDiagram: React.FC = () => (
    <LessonDiagram viewBox="0 0 500 225" role="img" aria-label="Animated lever: the long effort arm moves down a greater distance while the short load arm rises a smaller distance" className="h-auto w-full max-w-2xl" xmlns="http://www.w3.org/2000/svg" notes={["Both ends turn through the same angle; distance moved depends on arm length."]}>
      <path d="M50 107 Q47 119 51 131 M430 107 Q430 100 429 97" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="330,105 311,148 349,148" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
      <circle cx="330" cy="105" r="4" fill="#1e293b" />
      <g>
        <line x1="50" y1="105" x2="430" y2="105" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
        <circle cx="50" cy="105" r="5" fill="#2563eb" />
        <circle cx="430" cy="105" r="5" fill="#059669" />
        <animateTransform attributeName="transform" type="rotate" values="0 330 105;-5 330 105;0 330 105" dur="3.2s" repeatCount="indefinite" />
      </g>
      <text x="330" y="168" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">FULCRUM</text>
      <path d="M50 80 V99" stroke="#2563eb" strokeWidth="2" />
      <text x="70" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">EFFORT</text>
      <text x="70" y="60" textAnchor="middle" fontSize="14" fill="#1d4ed8">moves farther ↓</text>
      <path d="M430 142 V113" stroke="#059669" strokeWidth="2" />
      <text x="430" y="175" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">LOAD</text>
      <text x="430" y="202" textAnchor="middle" fontSize="14" fill="#047857">moves less ↑</text>

    </LessonDiagram>
  );

  const MomentsDiagram: React.FC = () => (
    <svg viewBox="0 0 500 210" role="img" aria-label="A balanced lever has an anticlockwise moment from the left load and an equal clockwise moment from the right effort" className="h-auto w-full max-w-2xl" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="momentArrowBlue" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill="#2563eb" /></marker>
        <marker id="momentArrowGreen" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0 L5 2.5 L0 5 Z" fill="#059669" /></marker>
      </defs>
      <line x1="50" y1="105" x2="450" y2="105" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
      <polygon points="250,105 231,148 269,148" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />
      <text x="250" y="166" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">FULCRUM</text>
      <path d="M75 52 V98" stroke="#059669" strokeWidth="3" markerEnd="url(#momentArrowGreen)">
        <animate attributeName="opacity" values="1;.45;1" dur="2.4s" repeatCount="indefinite" />
      </path>
      <text x="75" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">LOAD ↓</text>
      <path d="M425 52 V98" stroke="#2563eb" strokeWidth="3" markerEnd="url(#momentArrowBlue)">
        <animate attributeName="opacity" values=".45;1;.45" dur="2.4s" repeatCount="indefinite" />
      </path>
      <text x="425" y="41" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">EFFORT ↓</text>
      <path d="M250 47 A58 58 0 0 0 192 105" fill="none" stroke="#059669" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#momentArrowGreen)">
        <animate attributeName="stroke-dashoffset" values="20;0" dur="1.4s" repeatCount="indefinite" />
      </path>
      <path d="M250 47 A58 58 0 0 1 308 105" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#momentArrowBlue)">
        <animate attributeName="stroke-dashoffset" values="20;0" dur="1.4s" repeatCount="indefinite" />
      </path>
      <text x="130" y="190" textAnchor="middle" fontSize="14" fill="#047857">Anticlockwise moment</text>
      <text x="370" y="190" textAnchor="middle" fontSize="14" fill="#1d4ed8">Clockwise moment</text>
    </svg>
  );

  const ArmLengthComparisonDiagram: React.FC = () => (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-200 p-2">
        <svg viewBox="0 0 240 145" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="70" x2="220" y2="70" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
          <polygon points="180,70 168,95 192,95" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
          <ArrowMark x1={30} y1={35} x2={30} y2={66} color="#2563eb" />
          <text x="30" y="24" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Small E</text>
          <ArrowMark x1={210} y1={105} x2={210} y2={76} color="#059669" />
          <text x="210" y="118" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">LOAD</text>
          <text x="105" y="112" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Long effort arm</text>
        </svg>
      </div>
      <div className="rounded-lg border border-slate-200 p-2">
        <svg viewBox="0 0 240 145" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="20" y1="70" x2="220" y2="70" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
          <polygon points="60,70 48,95 72,95" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
          <ArrowMark x1={30} y1={35} x2={30} y2={66} color="#2563eb" />
          <text x="30" y="24" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Large E</text>
          <ArrowMark x1={210} y1={105} x2={210} y2={76} color="#059669" />
          <text x="210" y="118" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">LOAD</text>
          <text x="105" y="112" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Short effort arm</text>
        </svg>
      </div>
    </div>
  );

  /* ========================================================================
    LEVERS — WORKED EXAMPLE DATA
    ======================================================================== */

  const vrWorkedExamples: WorkedStepExample[] = [
    {
      title: 'A lever has an effort arm of 1.2 m and a load arm of 0.3 m. Find the velocity ratio.',
      given: ['Effort arm = 1.2 m.', 'Load arm = 0.3 m.'],
      find: 'The velocity ratio (VR).',
      formula: 'VR = Effort Arm / Load Arm',
      substitution: 'VR = 1.2 / 0.3',
      calculation: 'VR = 4',
      answer: 'VR = 4 (no unit)',
      meaning: 'The effort moves 4 times as far as the load moves.',
    },
    {
      title: 'The effort of a lever moves 0.8 m while the load moves 0.2 m. Find the velocity ratio.',
      given: ['Distance moved by effort = 0.8 m.', 'Distance moved by load = 0.2 m.'],
      find: 'The velocity ratio (VR).',
      formula: 'VR = Distance moved by Effort / Distance moved by Load',
      substitution: 'VR = 0.8 / 0.2',
      calculation: 'VR = 4',
      answer: 'VR = 4 (no unit)',
      meaning: 'This matches the ratio of the effort arm to the load arm for the same lever.',
    },
  ];

  const momentsWorkedExamples: WorkedStepExample[] = [
    {
      title: 'A seesaw is balanced. A 300 N load sits 1.5 m from the fulcrum. Find how far from the fulcrum a 450 N effort must push to balance it.',
      given: ['Load = 300 N.', 'Load arm = 1.5 m.', 'Effort = 450 N.'],
      find: 'The effort arm (distance of the effort from the fulcrum).',
      formula: 'Load × Load Arm = Effort × Effort Arm',
      substitution: '300 × 1.5 = 450 × Effort Arm',
      calculation: '450 = 450 × Effort Arm → Effort Arm = 450 ÷ 450',
      answer: 'Effort arm = 1 m',
      meaning: 'The 450 N effort must be applied 1 m from the fulcrum to balance the seesaw.',
    },
    {
      title: 'A crowbar has an effort of 80 N applied 1.6 m from the fulcrum, with a load arm of 0.2 m. Find the maximum load it can lift.',
      given: ['Effort = 80 N.', 'Effort arm = 1.6 m.', 'Load arm = 0.2 m.'],
      find: 'The load (L).',
      formula: 'Load × Load Arm = Effort × Effort Arm',
      substitution: 'Load × 0.2 = 80 × 1.6',
      calculation: 'Load × 0.2 = 128 → Load = 128 ÷ 0.2',
      answer: 'Load = 640 N',
      meaning: 'This crowbar lets an 80 N effort lift a 640 N load — this is why levers are so useful.',
    },
    {
      title: 'A beam is balanced. A 25 N weight sits 0.4 m from the pivot on one side. Find where a 20 N weight must sit on the other side to balance it.',
      given: ['First weight = 25 N, 0.4 m from the pivot.', 'Second weight = 20 N.'],
      find: 'The distance (d) of the 20 N weight from the pivot.',
      formula: '25 × 0.4 = 20 × d',
      substitution: '10 = 20 × d',
      calculation: 'd = 10 ÷ 20',
      answer: 'd = 0.5 m',
      meaning: 'The 20 N weight must be placed 0.5 m from the pivot to balance the beam.',
    },
  ];

  const maWorkedExamples: WorkedStepExample[] = [
    {
      title: 'A lever has an effort arm of 2 m and a load arm of 0.5 m. Find the ideal mechanical advantage.',
      given: ['Effort arm = 2 m.', 'Load arm = 0.5 m.'],
      find: 'The mechanical advantage (MA), ideal.',
      formula: 'MA = Effort Arm / Load Arm',
      substitution: 'MA = 2 / 0.5',
      calculation: 'MA = 4',
      answer: 'MA = 4',
      meaning: 'This lever multiplies the effort force four times.',
    },
    {
      title: 'A lever lifts a load of 180 N using an effort of 60 N. Find the mechanical advantage.',
      given: ['Load = 180 N.', 'Effort = 60 N.'],
      find: 'The mechanical advantage (MA).',
      formula: 'MA = Load / Effort',
      substitution: 'MA = 180 / 60',
      calculation: 'MA = 3',
      answer: 'MA = 3',
      meaning: 'The lever multiplies the applied effort three times to lift the load.',
    },
  ];

  /* ========================================================================
    LEVERS — BODY
    ======================================================================== */

  const LeversBody: React.FC = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Levers
        </h1>
      </div>

      <OverviewLead>
        A <strong className="font-bold text-slate-900">lever</strong> is a rigid bar or rod that can turn around a fixed point
        called a <strong className="font-bold text-slate-900">fulcrum</strong>.
      </OverviewLead>
      <OverviewLead>
        We use levers to make it easier to move or lift loads. By pushing down on one part of the bar, we can lift or move a
        load at another part of the same bar.
      </OverviewLead>

      <DiagramBox title="A Basic Lever" caption="Fulcrum, effort, load, effort arm, and load arm on a basic lever.">
        <BasicLeverDiagram />
      </DiagramBox>

      <OverviewHeading>Parts of a Lever</OverviewHeading>
      <ComparisonTable
        headers={['Part', 'What it means', 'Example', 'SI unit']}
        rows={[
          ['Fulcrum', 'The fixed pivot about which the lever turns.', 'The centre support of a seesaw; the pivot pin of scissors; the wheel axle of a wheelbarrow.', '—'],
          ['Load', 'The object or resistance the lever moves.', 'A child on a seesaw or the contents of a wheelbarrow.', 'newton (N)'],
          ['Effort', 'The force applied to the lever.', 'A push on a seesaw or an upward pull on wheelbarrow handles.', 'newton (N)'],
        ]}
      />

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">The Three Classes of Levers</h2>
      <OverviewLead>
        There is an easy way to remember the three classes of levers: <strong className="font-bold text-slate-900">FLE = 1, 2, 3</strong>.
      </OverviewLead>
      <ExampleBulletList
        items={[
          'Class 1 → the Fulcrum is in the middle',
          'Class 2 → the Load is in the middle',
          'Class 3 → the Effort is in the middle',
        ]}
      />
      <DiagramBox title="FLE — Which Component Is in the Middle?" caption="The circled component in each row is the one in the middle.">
        <ClassesOverviewDiagram />
      </DiagramBox>
      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <OverviewHeading>First-Class Lever</OverviewHeading>
      <OverviewLead>
        In a first-class lever, the <strong className="font-bold text-slate-900">fulcrum is between the load and the effort</strong>.
      </OverviewLead>
      <p className="ga-ink mb-4 pl-4 text-lg font-bold text-slate-800">Load — Fulcrum — Effort</p>
      <ExampleBulletList items={['Seesaw', 'Scissors', 'Crowbar', 'Claw hammer']} />
      <DiagramBox title="First-Class Lever" caption="Load — Fulcrum — Effort">
        <LeverDiagram order={['L', 'F', 'E']} />
      </DiagramBox>
      <LeverExamplesGallery leverClass="first" />
      <NoteBox>
        Depending on where the fulcrum is positioned, the mechanical advantage of a first-class lever can be{' '}
        <strong className="font-semibold text-slate-800">greater than 1</strong>,{' '}
        <strong className="font-semibold text-slate-800">equal to 1</strong>, or{' '}
        <strong className="font-semibold text-slate-800">less than 1</strong>. For example, moving the fulcrum of a crowbar
        closer to the load increases its mechanical advantage.
      </NoteBox>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <OverviewHeading>Second-Class Lever</OverviewHeading>
      <OverviewLead>
        In a second-class lever, the <strong className="font-bold text-slate-900">load is between the fulcrum and the effort</strong>.
      </OverviewLead>
      <p className="ga-ink mb-4 pl-4 text-lg font-bold text-slate-800">Fulcrum — Load — Effort</p>
      <ExampleBulletList items={['Wheelbarrow', 'Nutcracker', 'Bottle opener']} />
      <DiagramBox title="Second-Class Lever" caption="Fulcrum — Load — Effort">
        <LeverDiagram order={['F', 'L', 'E']} />
      </DiagramBox>
      <LeverExamplesGallery leverClass="second" />
      <NoteBox>
        Because the load is always closer to the fulcrum than the effort is, a second-class lever normally gives a mechanical
        advantage <strong className="font-semibold text-slate-800">greater than 1 (MA &gt; 1)</strong>. For example, a
        wheelbarrow lets you lift a heavy load using a much smaller effort at the handles.
      </NoteBox>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <OverviewHeading>Third-Class Lever</OverviewHeading>
      <OverviewLead>
        In a third-class lever, the <strong className="font-bold text-slate-900">effort is between the fulcrum and the load</strong>.
      </OverviewLead>
      <p className="ga-ink mb-4 pl-4 text-lg font-bold text-slate-800">Fulcrum — Effort — Load</p>
      <ExampleBulletList items={['Human forearm', 'Fishing rod', 'Tweezers', 'Sugar tongs']} />
      <DiagramBox title="Third-Class Lever" caption="Fulcrum — Effort — Load">
        <LeverDiagram order={['F', 'E', 'L']} />
      </DiagramBox>
      <LeverExamplesGallery leverClass="third" />
      <NoteBox>
        Because the effort is always closer to the fulcrum than the load is, third-class levers always give a mechanical
        advantage <strong className="font-semibold text-slate-800">less than 1 (MA &lt; 1)</strong>. They do not multiply
        force, but they let the load move faster or through a larger distance — for example, a fishing rod moves the tip of
        the line a long way with just a small movement of the hand.
      </NoteBox>
      </section>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Comparing the Three Classes</h2>
      <ComparisonTable
        headers={['Class', 'Middle component', 'Arrangement', 'Examples', 'Mechanical Advantage']}
        rows={[
          ['1st', 'Fulcrum', 'L – F – E', 'Seesaw, scissors', 'Can be >, = or < 1'],
          ['2nd', 'Load', 'F – L – E', 'Wheelbarrow, nutcracker', 'Always > 1'],
          ['3rd', 'Effort', 'F – E – L', 'Forearm, tweezers', 'Always < 1'],
        ]}
      />
      <DiagramBox title="Comparing All Three Classes" caption="Notice how the middle component changes from class to class.">
        <ClassesOverviewDiagram />
      </DiagramBox>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Effort Arm and Load Arm</h2>
      <OverviewLead>
        Before we calculate anything, we need to understand these two distances.
      </OverviewLead>

      <OverviewHeading>Effort Arm</OverviewHeading>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">effort arm</strong> is the perpendicular distance from the fulcrum to
        the line of action of the effort.
      </OverviewLead>
      <DiagramBox title="Effort Arm" caption="The distance from the fulcrum to where the effort is applied.">
        <ArmHighlightDiagram highlight="effort" />
      </DiagramBox>

      <OverviewHeading>Load Arm</OverviewHeading>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">load arm</strong> is the perpendicular distance from the fulcrum to
        the line of action of the load.
      </OverviewLead>
      <DiagramBox title="Load Arm" caption="The distance from the fulcrum to where the load acts.">
        <ArmHighlightDiagram highlight="load" />
      </DiagramBox>

      <OverviewLead>
        These distances matter because <strong className="font-bold text-slate-900">the farther a force is from the fulcrum,
        the greater its turning effect</strong>.
      </OverviewLead>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Velocity Ratio of a Lever</h2>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">velocity ratio</strong> compares how far the effort moves with how
        far the load moves.
      </OverviewLead>
      <KeyFormula label="Velocity Ratio:" formula="VR = Distance moved by Effort / Distance moved by Load" />
      <OverviewLead>For a lever, this is the same as comparing the two arm lengths:</OverviewLead>
      <KeyFormula label="For a lever:" formula="VR = Effort Arm / Load Arm" />
      <OverviewLead>
        VR has <strong className="font-bold text-slate-900">no SI unit</strong>, because it is simply a ratio between two
        distances.
      </OverviewLead>
      <DiagramBox title="Effort and Load Movement" caption="The effort moves further than the load when the effort arm is longer.">
        <MovementDiagram />
      </DiagramBox>
      {vrWorkedExamples.map((ex, i) => (
        <WorkedExampleBox key={i} index={i + 1} example={ex} />
      ))}

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Principle of Moments in Levers</h2>
      <OverviewLead>
        A force can make an object turn. The turning effect of a force depends on both the size of the force and its distance
        from the pivot.
      </OverviewLead>
      <KeyFormula label="For an ideal lever in balance:" formula="Clockwise moment = Anticlockwise moment" />
      <KeyFormula label="This gives us:" formula="Load × Load Arm = Effort × Effort Arm" />
      <ExampleBulletList
        items={[
          'Load × Load Arm — the turning effect of the load about the fulcrum',
          'Effort × Effort Arm — the turning effect of the effort about the fulcrum',
          'When these two turning effects are equal, the lever is balanced',
        ]}
      />
      <DiagramBox title="Clockwise and Anticlockwise Moments" caption="A balanced lever has equal turning effects on each side of the fulcrum.">
        <MomentsDiagram />
      </DiagramBox>
      {momentsWorkedExamples.map((ex, i) => (
        <WorkedExampleBox key={i} index={i + 1} example={ex} />
      ))}

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Mechanical Advantage of a Lever</h2>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">mechanical advantage</strong> tells us how many times the lever
        multiplies the effort force.
      </OverviewLead>
      <KeyFormula label="Mechanical Advantage:" formula="MA = Load / Effort" />
      <KeyFormula label="For an ideal lever:" formula="MA = Effort Arm / Load Arm" />
      <OverviewLead>
        A longer effort arm means the effort has a greater turning effect for the same force — so a smaller effort is needed
        to balance the same load.
      </OverviewLead>
      <DiagramBox title="Long vs Short Effort Arm" caption="The same load needs a smaller effort when the effort arm is longer.">
        <ArmLengthComparisonDiagram />
      </DiagramBox>
      {maWorkedExamples.map((ex, i) => (
        <WorkedExampleBox key={i} index={i + 1} example={ex} />
      ))}

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Levers in the Human Body</h2>
      <OverviewLead>Parts of the human body can work like levers.</OverviewLead>

      <OverviewHeading>The Forearm — Third-Class Lever</OverviewHeading>
      <DiagramBox title="The Forearm as a Lever" caption="Elbow = Fulcrum, Biceps = Effort, Weight in hand = Load.">
        <LeverDiagram order={['F', 'E', 'L']} names={{ F: 'ELBOW', E: 'BICEPS', L: 'HAND' }} />
      </DiagramBox>
      <OverviewLead>
        When the biceps contracts, it pulls upward on the forearm close to the elbow. This lifts the weight held in the hand,
        which is much further from the elbow. Because the effort (biceps) is between the fulcrum (elbow) and the load (hand),
        this is a <strong className="font-bold text-slate-900">third-class lever</strong>.
      </OverviewLead>

      <OverviewHeading>Standing on Tiptoes — Second-Class Lever</OverviewHeading>
      <DiagramBox title="Standing on Tiptoes as a Lever" caption="Ball of foot = Fulcrum, Calf muscle = Effort, Body weight = Load.">
        <LeverDiagram order={['F', 'L', 'E']} names={{ F: 'BALL OF FOOT', L: 'ANKLE', E: 'CALF' }} />
      </DiagramBox>
      <OverviewLead>
        When you stand on tiptoes, the ball of your foot stays on the ground and acts as the fulcrum. Your calf muscle pulls
        up at the heel (the effort), while your body weight presses down at the ankle, between the two. Because the load
        (body weight) is between the fulcrum and the effort, this is a{' '}
        <strong className="font-bold text-slate-900">second-class lever</strong>.
      </OverviewLead>

      <Divider />

      <ExamTipsBox
        items={[
          'Remember FLE: 1st class = Fulcrum in the middle, 2nd class = Load in the middle, 3rd class = Effort in the middle.',
          'Moment = Force × perpendicular distance from the pivot.',
          'For a balanced lever: Clockwise moment = Anticlockwise moment.',
          'MA = Load / Effort.',
          'VR = Effort Arm / Load Arm.',
        ]}
      />
    </>
  );

  /* ========================================================================
    PULLEYS — BODY
    ======================================================================== */

  const PulleyDiagram: React.FC<{ kind: 'fixed' | 'movable' | 'tackle'; forces?: boolean }> = ({ kind, forces = false }) => {
    const [lift, setLift] = useState(0);
    useEffect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      let frame: number;
      const start = performance.now();
      let previous = 0;
      const tick = (now: number) => {
        if (now - previous >= 33) {
          // Lift, then lower, keeping the rope length and velocity ratio constant.
          setLift(20 * (1 - Math.cos((now - start) * Math.PI / 3000)));
          previous = now;
        }
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, []);
    const y = 250 - lift;
    const wheel = (x: number, cy: number, reverse = false) => (
      <g key={`${x}-${reverse}`}>
        <circle cx={x} cy={cy} r="24" fill="#dbeafe" stroke="#334155" strokeWidth="3" />
        <g transform={`rotate(${lift * (reverse ? -2.4 : 2.4)} ${x} ${cy})`}>
          <circle cx={x} cy={cy} r="17" fill="none" stroke="#94a3b8" strokeWidth="2" />
          <path d={`M${x - 16} ${cy} H${x + 16} M${x} ${cy - 16} V${cy + 16}`} stroke="#94a3b8" strokeWidth="2" />
        </g>
        <circle cx={x} cy={cy} r="4" fill="#334155" />
      </g>
    );
    const label = (x: number, cy: number, text: string, color: string, width = 82) => (
      <g>
        <rect x={x - width / 2} y={cy - 15} width={width} height="24" rx="6" fill="white" fillOpacity="0.96" />
        <text x={x} y={cy + 1} textAnchor="middle" fontSize="14" fontWeight="600" fill={color}>{text}</text>
      </g>
    );
    const loadX = kind === 'fixed' ? 191 : kind === 'movable' ? 215 : 193;
    const loadY = kind === 'fixed' ? 280 - lift : y + 55;
    return (
      <div
        className="relative w-full max-w-[440px] shrink-0 overflow-hidden"
        style={{ aspectRatio: '460 / 410', contain: 'layout paint', overflowAnchor: 'none' }}
      >
      <LessonDiagram width="460" height="410" viewBox="0 0 460 410" role="img" aria-label={`Animated ${kind} pulley: effort moves ${kind === 'fixed' ? 'the same distance as' : kind === 'movable' ? 'twice as far as' : 'four times as far as'} the load${forces ? ', with equal tension in the supporting rope sections' : ''}`} className="absolute inset-0 block h-full w-full" style={{ overflowAnchor: 'none' }} notes={["Lifting and lowering on a continuous loop"]}>
        <rect x="65" y="35" width="320" height="15" rx="3" fill="#475569" />
        {label(225, 22, 'Fixed support', '#475569', 110)}
        {kind === 'fixed' ? <>
          <path d="M215 50 V86" stroke="#475569" strokeWidth="5" />
          {wheel(215, 110)}
          <path d={`M191 ${loadY - 25} V110 A24 24 0 0 1 239 110 V${240 + lift}`} fill="none" stroke="#d97706" strokeWidth="4" />
          <path d={`M191 ${loadY - 25} V${loadY}`} stroke="#475569" strokeWidth="3" />
          <circle cx="239" cy={240 + lift} r="6" fill="#2563eb" />
          {label(305, 240, 'Effort ↓', '#2563eb')}
          {label(100, 280, 'Load ↑', '#059669')}
          {forces && <>{label(150, 180, 'T ↑', '#b45309', 40)}{label(275, 180, 'T', '#b45309', 40)}</>}
        </> : kind === 'movable' ? <>
          {wheel(215, y, true)}
          <path d={`M191 50 V${y} A24 24 0 0 0 239 ${y} V${150 - 2 * lift}`} fill="none" stroke="#d97706" strokeWidth="4" />
          <circle cx="191" cy="50" r="5" fill="#d97706" />
          <circle cx="239" cy={150 - 2 * lift} r="6" fill="#2563eb" />
          <path d={`M215 ${y} V${loadY}`} stroke="#475569" strokeWidth="3" />
          {label(305, 130, 'Effort ↑', '#2563eb')}
          {label(150, 185, 'T ↑', '#b45309', 40)}{label(275, 185, 'T ↑', '#b45309', 40)}
          {label(105, 285, 'Wheel + load ↑', '#059669', 115)}
        </> : <>
          <path d="M193 50 V86 M289 50 V86" stroke="#475569" strokeWidth="5" />
          {wheel(193, 110)}{wheel(289, 110)}{wheel(145, y, true)}{wheel(241, y, true)}
          <path d={`M121 50 V${y} A24 24 0 0 0 169 ${y} V110 A24 24 0 0 1 217 110 V${y} A24 24 0 0 0 265 ${y} V110 A24 24 0 0 1 313 110 V${170 + 4 * lift}`} fill="none" stroke="#d97706" strokeWidth="4" />
          <path d={`M145 ${y} V${y + 35} H241 V${y} M193 ${y + 35} V${loadY}`} fill="none" stroke="#475569" strokeWidth="3" />
          <circle cx="313" cy={170 + 4 * lift} r="6" fill="#2563eb" />
          {label(375, 205, 'Effort ↓', '#2563eb')}
          {[121, 169, 217, 265].map((x, i) => <g key={x}>{label(x, 174, forces ? 'T ↑' : `${i + 1}`, '#b45309', 34)}</g>)}
          {label(75, 300, 'Load ↑', '#059669', 65)}
        </>}
        <rect x={loadX - 30} y={loadY} width="60" height="40" rx="5" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
        <text x={loadX} y={loadY + 25} textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Load</text>
        <text x="230" y="377" textAnchor="middle" fontSize="14" fill="#475569">{kind === 'fixed' ? '1 supporting section • VR = 1' : kind === 'movable' ? '2 supporting sections • VR = 2' : '4 supporting sections • VR = 4'}</text>

      </LessonDiagram>
      </div>
    );
  };

  const PulleyDiagramBox = LessonFigure;

  const PulleyDistanceDiagram: React.FC = () => (
    <svg viewBox="0 0 520 180" role="img" aria-label="For VR 4, pulling 4 metres of rope lifts the load 1 metre" className="h-auto w-full max-w-2xl">
      <text x="20" y="35" fontSize="16" fontWeight="700" fill="#2563eb">Effort moves 4 m</text>
      <path d="M25 65 H465 l-12 -7 m12 7 l-12 7" fill="none" stroke="#2563eb" strokeWidth="4" />
      <text x="20" y="110" fontSize="16" fontWeight="700" fill="#059669">Load moves 1 m</text>
      <path d="M25 140 H135 l-12 -7 m12 7 l-12 7" fill="none" stroke="#059669" strokeWidth="4" />
      <text x="260" y="145" fontSize="18" fill="#334155">VR = 4 ÷ 1 = 4</text>
    </svg>
  );

  const PulleyTypeImages: React.FC = () => (
    <div className="mb-6 grid gap-4 lg:grid-cols-2">
      {[
        { kind: 'fixed' as const, name: 'Single fixed pulley', caption: 'The wheel stays attached to the support.' },
        { kind: 'movable' as const, name: 'Single movable pulley', caption: 'The wheel rises with the load.' },
        { kind: 'tackle' as const, name: 'Block and tackle', caption: 'Fixed and movable wheels work together.' },
      ].map(type => (
        <figure key={type.kind} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex justify-center"><PulleyDiagram kind={type.kind} /></div>
          <figcaption className="mt-3 text-sm text-slate-600"><strong className="mb-1 block text-slate-900">{type.name}</strong>{type.caption}</figcaption>
        </figure>
      ))}
    </div>
  );

  const PulleysBody: React.FC = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Pulleys
        </h1>
      </div>

      <OverviewLead>{renderRich("A **pulley system** is a simple machine made of one or more wheels with a rope, chain, or cable running over them. It is used to lift or move a load by pulling on the rope.")}</OverviewLead>

      <OverviewLead>
        A pulley works by letting a rope run smoothly over a wheel. When you pull down on one end of the rope, the
        other end (attached to the load) moves. Pulleys make lifting easier because they can change the{' '}
        <strong className="font-bold text-slate-900">direction</strong> of the force, and, when several pulleys are
        combined, they can also reduce the <strong className="font-bold text-slate-900">size</strong> of the effort
        needed to lift a heavy load.
      </OverviewLead>

      <hr className="my-8 border-t-2 border-slate-200" />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Types of Pulleys</h2>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5 shadow-sm">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">1.</p>
          <h3 className="text-xl font-black text-slate-900">Single Fixed Pulley</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">The wheel stays attached to the support.</p>
        </div>
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600">2.</p>
          <h3 className="text-xl font-black text-slate-900">Single Movable Pulley</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">The wheel moves with the load.</p>
        </div>
      </div>

      <PulleyTypeImages />
      <OverviewHeading>Single Fixed Pulley</OverviewHeading>
      <TermCard
        accent="blue"
        text="A **single fixed pulley** is one wheel attached to a fixed point, such as a beam or a wall, so the wheel itself does not move."
        examples={[]}
      />
      <OverviewLead>
        Its job is only to change the{' '}
        <strong className="font-bold text-slate-900">direction</strong> of the force. Pulling down on the rope makes
        the load go up.
      </OverviewLead>
      <OverviewLead>
        The rope passes over the wheel. One end
        is tied to the load and the other end is pulled by the effort. Because the wheel is fixed, it does not add
        extra rope segments to help lift the load — it simply lets you pull down instead of up.
      </OverviewLead>
      <KeyFormula label="Velocity Ratio of a single fixed pulley:" formula="VR = 1" />
      <OverviewLead>
        Count the number of rope segments
        supporting the load. A single fixed pulley has only one rope segment holding the load, so VR = 1.
      </OverviewLead>
      <OverviewLead>
        You can see fixed pulleys at the top of flagpoles and above wells, where they help raise buckets of water.
      </OverviewLead>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <PulleyDiagramBox title="The Fixed Pulley Setup" caption="Single fixed pulley — basic setup">
        <PulleyDiagram kind="fixed" />
      </PulleyDiagramBox>
      <PulleyDiagramBox title="Pull Down to Lift Up" caption="Single fixed pulley — direction of forces">
        <PulleyDiagram kind="fixed" forces />
      </PulleyDiagramBox>
      <PulleyDiagramBox title="Lifting Water from a Well" caption="Single fixed pulley — real-life application">
        <img src="/images/physics/simple-machines/pulley.webp" alt="A fixed pulley lifting a bucket from a well" loading="lazy" className="h-auto w-full max-w-lg rounded-lg" />
      </PulleyDiagramBox>

      </div>

      <OverviewHeading>Single Movable Pulley</OverviewHeading>
      <TermCard
        accent="emerald"
        text="A **single movable pulley** is one wheel attached directly to the load, so the wheel moves together with the load as it is lifted."
        examples={[]}
      />
      <OverviewLead>
        It reduces the effort needed to lift the
        load by sharing the load's weight between two rope segments.
      </OverviewLead>
      <OverviewLead>
        One end of the rope is fixed to a
        support, the rope goes under the movable pulley (which carries the load), and back up to where the effort
        pulls. Because two rope segments now support the load, each one carries half the load's weight in an ideal system with negligible pulley weight and friction.
      </OverviewLead>
      <KeyFormula label="Velocity Ratio of a single movable pulley:" formula="VR = 2" />
      <OverviewLead>
        Count the rope segments supporting
        the movable pulley. There are two segments holding it up, so VR = 2.
      </OverviewLead>
      <OverviewLead>
        Movable pulleys are used in crane hook assemblies and hoists to lift building materials.
      </OverviewLead>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <PulleyDiagramBox title="Two Sections Support the Load" caption="The effort pulls upward; the wheel and load rise together.">
          <PulleyDiagram kind="movable" />
        </PulleyDiagramBox>
        <PulleyDiagramBox title="Half the Effort, Twice the Distance" caption="In an ideal system, each rope section carries half the load. Pull 2 m to lift the load 1 m.">
          <PulleyDiagram kind="movable" forces />
        </PulleyDiagramBox>
      </div>

      <hr className="my-8 border-t-2 border-slate-200" />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Block and Tackle Systems</h2>

      <OverviewLead>{renderRich("A **block and tackle** is a pulley system made of two or more pulleys — some fixed and some movable — connected by one continuous rope, used to lift very heavy loads with a small effort.")}</OverviewLead>

      <OverviewLead>
        In a block and tackle, the fixed pulleys are grouped in one block, and the movable pulleys are grouped in
        another block that carries the load. As you pull the rope, it runs back and forth between the two blocks.
        The more times the rope passes between the blocks, the more it shares the load's weight, and the smaller
        the effort needed to lift it.
      </OverviewLead>

      <OverviewHeading>Determining the Velocity Ratio</OverviewHeading>
      <RuleList
        rules={[
          { rule: 'Count the supporting rope sections.', example: 'Count each section of rope that pulls upward on the movable block, including a rope end attached to that block. This gives the VR for the systems shown here.' },
          { rule: 'Leave out the free effort end.', example: 'A rope section that only changes the direction of the effort does not support the movable block.' },
          { rule: 'Follow the rope path.', example: 'Wheel count alone is not a reliable rule: the way the rope is threaded and where its end is attached determine the VR.' },
        ]}
        forceList
      />

      <hr className="my-8 border-t-2 border-slate-200" />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Distance Relations &amp; Velocity Ratio Formula</h2>

      <OverviewHeading>The Trade-Off Between Effort Distance and Load Distance</OverviewHeading>
      <OverviewLead>
        In any pulley system, there is a trade-off: the more the system reduces the effort needed, the{' '}
        <strong className="font-bold text-slate-900">farther the effort must move</strong> compared to the load. If
        a system has a VR of 4, the effort must pull 4 m of rope to raise the load by just 1 m. The machine does not
        create extra energy — it simply spreads the same amount of work over a smaller force acting through a
        longer distance.
      </OverviewLead>

      <KeyFormula label="Velocity Ratio (distance form):" formula="VR = Distance moved by Effort / Distance moved by Load" />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
      <PulleyDiagramBox title="The Rope Path" caption="Block and tackle — full system layout">
        <PulleyDiagram kind="tackle" />
      </PulleyDiagramBox>
      <PulleyDiagramBox title="Pulling Farther to Lift Higher" caption="Distance moved by effort vs distance moved by load">
        <PulleyDistanceDiagram />
      </PulleyDiagramBox>
      <PulleyDiagramBox title="Sharing the Load" caption="Forces acting on each rope segment">
        <PulleyDiagram kind="tackle" forces />
      </PulleyDiagramBox>
      </div>

      <OverviewHeading>Comparing Pulley Systems</OverviewHeading>
      <ComparisonTable
        headers={['Pulley system', 'What moves?', 'Supporting rope sections / VR', 'Ideal effort', 'Uses']}
        rows={[
          ['Single fixed', 'The load moves; the wheel stays fixed.', '1 section; VR = 1', 'Equal to the load; changes the direction of the effort.', 'Flagpoles and well buckets'],
          ['Single movable', 'The wheel and load move together.', '2 sections; VR = 2', 'Half the load; effort moves twice as far as the load.', 'Hoists and crane hook assemblies'],
          ['Block and tackle', 'The lower block and load move; the upper block stays fixed.', 'VR equals the number of supporting sections; 4 in the illustrated system.', 'Load ÷ VR; effort moves VR times as far as the load.', 'Lifting heavy equipment and building materials'],
        ]}
      />
      <NoteBox>These effort values assume negligible friction and pulley weight. Real systems need more effort.</NoteBox>

      <OverviewHeading>Worked Example</OverviewHeading>
      <WorkedExampleBox
        index={1}
        example={{
          title: 'A block and tackle system has a velocity ratio of 5. The load is lifted 0.6 m. Calculate the distance the effort must move.',
          given: ['VR = 5.', 'Distance moved by load = 0.6 m.'],
          find: 'The distance moved by the effort.',
          formula: 'VR = Distance moved by Effort / Distance moved by Load',
          substitution: '5 = Distance moved by Effort / 0.6',
          calculation: 'Distance moved by Effort = 5 × 0.6',
          answer: 'Distance moved by Effort = 3 m',
          meaning: "To raise the load by 0.6 m, the effort must pull 3 m of rope through the system.",
        }}
      />
    </>
  );

  /* ========================================================================
    INCLINED PLANES — DIAGRAMS
    ======================================================================== */

  const RampSetupDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 500 300" className="w-full max-w-2xl" aria-label="Ramp length l measured along the sloping surface and height h measured vertically" notes={['Ramp length l is measured along the slope, not along the horizontal base.']}>
    <polygon points="50,230 360,230 360,100" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
    <g transform="translate(185 173.4) rotate(-22.75)"><rect x="-22" y="-38" width="44" height="38" rx="3" fill="#dcfce7" stroke="#059669" strokeWidth="2" /><text x="0" y="-14" textAnchor="middle" fontSize="14" fill="#047857">Load</text></g>
    <path d="M235 140 L315 106 L305 105 M315 106 L308 116" fill="none" stroke="#2563eb" strokeWidth="3" />
    <text x="310" y="78" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1d4ed8">Effort up the slope</text>
    <line x1="18" y1="153.7" x2="328" y2="23.7" stroke="#059669" strokeWidth="2" />
    <path d="M14 144.7 L22 162.7 M324 14.7 L332 32.7" stroke="#059669" strokeWidth="2" />
    <text x="140" y="84" textAnchor="middle" transform="rotate(-22.75 140 84)" fontSize="15" fontWeight="700" fill="#047857">Length (l)</text>
    <path d="M395 100 V230 M387 100 H403 M387 230 H403" fill="none" stroke="#2563eb" strokeWidth="2" />
    <text x="412" y="170" fontSize="15" fontWeight="700" fill="#1d4ed8">Height (h)</text>
    <path d="M344 230 V214 H360" fill="none" stroke="#64748b" strokeWidth="1.5" />
  </LessonDiagram>
);

  const RampForceDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 460 300" className="w-full max-w-2xl" aria-label="Effort acts parallel to the ramp while weight acts vertically down" notes={['Blue: effort parallel to the slope. Green: weight vertically downward.']}>
    <defs><marker id="cleanRampEffort" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#2563eb" /></marker><marker id="cleanRampWeight" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="#059669" /></marker></defs>
    <polygon points="40,240 400,240 400,90" fill="#f1f5f9" stroke="#334155" strokeWidth="3" />
    <g transform="translate(210 169) rotate(-22.62)"><rect x="-25" y="-42" width="50" height="42" rx="3" fill="#dcfce7" stroke="#059669" strokeWidth="2" /></g>
    <line x1="210" y1="149" x2="325" y2="101" stroke="#2563eb" strokeWidth="3" markerEnd="url(#cleanRampEffort)" />
    <text x="280" y="70" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1d4ed8">Effort</text>
    <line x1="210" y1="149" x2="210" y2="248" stroke="#059669" strokeWidth="3" markerEnd="url(#cleanRampWeight)" />
    <text x="210" y="280" textAnchor="middle" fontSize="16" fontWeight="700" fill="#047857">Weight of load</text>
  </LessonDiagram>
);

  const RampSteepnessDiagram: React.FC = () => (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-slate-200 p-2">
        <svg viewBox="0 0 240 140" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,120 220,120 220,25" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
          <text x="120" y="135" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Steep — short, large effort</text>
        </svg>
      </div>
      <div className="rounded-lg border border-slate-200 p-2">
        <svg viewBox="0 0 240 140" className="h-auto w-full" xmlns="http://www.w3.org/2000/svg">
          <polygon points="10,120 230,120 230,80" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
          <text x="120" y="135" textAnchor="middle" fontSize="14" fontWeight="700" fill="#475569">Gentle — long, small effort</text>
        </svg>
      </div>
    </div>
  );

  const WedgeDiagram: React.FC = () => (
    <LessonDiagram viewBox="0 0 300 160" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={["Two sloping faces meeting at a thin edge"]}>
      <polygon points="30,30 30,130 270,80" fill="#f1f5f9" stroke="#1e293b" strokeWidth="3" />

      <text x="255" y="75" fontSize="14" fontWeight="700" fill="#2563eb">Edge</text>
    </LessonDiagram>
  );

  const WedgeActionDiagram: React.FC = () => <LessonImage name="wedge-splitting-wood" alt="A tapered steel wedge driven into a log, opening a split along the wood grain" labels={['Effort: push into the wood', 'Output: wood pushed apart sideways']} />;

  const ScrewPitchDiagram: React.FC = () => (
    <LessonDiagram viewBox="0 0 300 180" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" notes={["One turn moves the screw forward by the pitch"]}>
      <rect x="130" y="20" width="40" height="140" rx="6" fill="#f1f5f9" stroke="#1e293b" strokeWidth="2.5" />
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path key={i} d={`M130 ${30 + i * 22} Q150 ${20 + i * 22} 170 ${30 + i * 22}`} fill="none" stroke="#2563eb" strokeWidth="2.5" />
      ))}
      <line x1="200" y1="30" x2="200" y2="52" stroke="#059669" strokeWidth="2" />
      <line x1="194" y1="30" x2="206" y2="30" stroke="#059669" strokeWidth="2" />
      <line x1="194" y1="52" x2="206" y2="52" stroke="#059669" strokeWidth="2" />
      <text x="215" y="45" fontSize="14" fontWeight="700" fill="#047857">Pitch (p)</text>

    </LessonDiagram>
  );

  const EfficiencyDiagram: React.FC = () => (
    <svg viewBox="0 0 300 180" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="20" width="50" height="130" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
      <text x="75" y="162" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Input work</text>
      <rect x="180" y="55" width="50" height="95" fill="#dcfce7" stroke="#059669" strokeWidth="2.5" />
      <rect x="180" y="20" width="50" height="35" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
      <text x="205" y="162" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Output work</text>
      <text x="205" y="40" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Lost</text>
    </svg>
  );

  /* ========================================================================
    INCLINED PLANES — BODY
    ======================================================================== */

  const InclinedPlanesBody: React.FC = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Inclined Planes
        </h1>
      </div>

      <TermCard
        accent="blue"
        text="An **inclined plane** (ramp) is a flat surface that is set at an angle instead of straight up and down. It is used to raise a load to a higher place."
        examples={[]}
      />
      <OverviewLead>
        Lifting a heavy box straight up needs a large force over a short distance. Pushing the same box up a ramp
        needs a much smaller force, but the box has to travel a longer distance to reach the same height. The
        inclined plane makes the job feel easier by trading distance for force.
      </OverviewLead>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Key Dimensions &amp; How It Works</h2>

      <OverviewHeading>Ramp Length (l)</OverviewHeading>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">length</strong> is the distance measured along the sloping
        surface, from the bottom of the ramp to the top.
      </OverviewLead>

      <OverviewHeading>Vertical Height (h)</OverviewHeading>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">height</strong> is the straight up-and-down distance the
        load is actually raised, from the ground to the top of the ramp.
      </OverviewLead>

      <DiagramBox title="Ramp Setup" caption="Length (l) is measured along the slope; height (h) is measured straight up.">
        <RampSetupDiagram />
      </DiagramBox>

      <OverviewLead>
        The inclined plane works on a simple trade-off: the load only needs to move up by the height (h), but the
        effort has to push it all the way along the longer length (l). Because the effort acts over a longer
        distance, a smaller effort force is enough to do the same job.
      </OverviewLead>

      <DiagramBox title="Force Directions on a Ramp" caption="The effort acts along the slope; the load's weight always acts straight down.">
        <RampForceDiagram />
      </DiagramBox>

      <OverviewLead>
        A steeper ramp is shorter, so it needs a bigger effort. A gentler ramp is longer, so it needs a smaller
        effort. Both ramps lift the load to the same height.
      </OverviewLead>

      <DiagramBox title="Steep vs Gentle Ramps" caption="A gentler slope trades a longer distance for a smaller effort.">
        <RampSteepnessDiagram />
      </DiagramBox>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Velocity Ratio &amp; Mechanical Advantage</h2>

      <OverviewLead>
        The <strong className="font-bold text-slate-900">velocity ratio</strong> compares the distance the effort
        moves (along the slope) with the distance the load moves (straight up).
      </OverviewLead>
      <KeyFormula label="Velocity Ratio of a ramp:" formula="VR = Length of Ramp / Height of Ramp" />

      <OverviewLead>
        The <strong className="font-bold text-slate-900">mechanical advantage</strong> compares the load lifted with
        the effort actually used.
      </OverviewLead>
      <KeyFormula label="Mechanical Advantage:" formula="MA = Load / Effort" />

      <OverviewLead>
        In a perfect ramp with no friction, MA and VR are equal. In real life, friction between the load and the
        ramp surface wastes some of the effort as heat. This means the real effort needed is always a little more
        than the ideal value, so the real MA is always <strong className="font-bold text-slate-900">less than</strong> the
        VR.
      </OverviewLead>
      <NoteBox>
        A rougher ramp surface has more friction, so more effort is wasted and the efficiency is lower. A smoother
        surface, or adding rollers, reduces friction and improves efficiency.
      </NoteBox>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Variations of Inclined Planes</h2>

      <OverviewHeading>The Wedge</OverviewHeading>
      <TermCard
        accent="emerald"
        text="A **wedge** is two inclined planes joined back-to-back, forming a thin edge. It is pushed or driven into a material to split, cut, or force it apart."
        examples={['An axe splitting wood', 'A knife cutting through food', 'A chisel cutting into wood', 'A doorstop wedged under a door', 'A nail or a pin']}
      />
      <OverviewLead>
        As the wedge is pushed forward along its length, its two sloping sides push sideways with a much larger
        force than the one used to drive it in. This sideways push is what splits or separates the material.
      </OverviewLead>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <DiagramBox title="Shape of a Wedge" caption="Two sloping faces meeting at a thin edge.">
          <WedgeDiagram />
        </DiagramBox>
        <DiagramBox title="A Wedge Splitting Wood" caption="A forward push becomes a strong sideways push.">
          <WedgeActionDiagram />
        </DiagramBox>
      </div>

      <OverviewHeading>The Screw</OverviewHeading>
      <TermCard
        accent="blue"
        text="A **screw** is an inclined plane wrapped around a rod, forming a spiral ridge called a thread."
        examples={['A wood screw or a bolt', 'A jar lid', 'A spiral staircase', 'A drill bit', 'A car jack']}
      />
      <OverviewLead>
        Turning the screw makes it move forward, the same way walking up a wrapped ramp would raise you. Each full
        turn of the screw moves it forward by a fixed, small distance called the{' '}
        <strong className="font-bold text-slate-900">pitch</strong>.
      </OverviewLead>
      <TermCard
        accent="emerald"
        text="The **pitch** of a screw is the distance the screw moves forward (or backward) for one complete turn."
        examples={[]}
      />
      <OverviewLead>
        Because the thread is a long inclined plane wrapped into a small space, a small turning effort applied to
        the screw head produces a very large force pushing or gripping along the shaft.
      </OverviewLead>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Distance Relations &amp; Worked Examples</h2>

      <OverviewLead>
        A workman uses a ramp that is 6 m long and 1.5 m high to push a 300 N crate onto a truck. He pushes with an
        effort of 100 N.
      </OverviewLead>

      <WorkedExampleBox
        index={1}
        example={{
          title: 'Step 1 — Find the velocity ratio of the ramp.',
          given: ['Length of ramp, l = 6 m.', 'Height of ramp, h = 1.5 m.'],
          find: 'The velocity ratio (VR).',
          formula: 'VR = Length / Height',
          substitution: 'VR = 6 / 1.5',
          calculation: 'VR = 4',
          answer: 'VR = 4 (no unit)',
          meaning: 'The effort moves 4 times as far as the load moves.',
        }}
      />
      <WorkedExampleBox
        index={2}
        example={{
          title: 'Step 2 — Find the ideal (frictionless) effort force.',
          given: ['Load = 300 N.', 'VR = 4 (from Step 1).'],
          find: 'The smallest possible effort, if there were no friction.',
          formula: 'Ideal MA = VR, and MA = Load / Effort',
          substitution: '4 = 300 / Ideal Effort',
          calculation: 'Ideal Effort = 300 / 4',
          answer: 'Ideal Effort = 75 N',
          meaning: 'With no friction, only 75 N would be needed to push the crate up the ramp.',
        }}
      />
      <WorkedExampleBox
        index={3}
        example={{
          title: 'Step 3 — Find the actual mechanical advantage and efficiency.',
          given: ['Load = 300 N.', 'Actual effort used = 100 N.', 'VR = 4 (from Step 1).'],
          find: 'The actual mechanical advantage (MA) and the efficiency.',
          formula: 'MA = Load / Effort, then Efficiency = (MA / VR) × 100%',
          substitution: 'MA = 300 / 100, then Efficiency = (3 / 4) × 100%',
          calculation: 'MA = 3, Efficiency = 75%',
          answer: 'MA = 3, Efficiency = 75%',
          meaning: 'Friction between the crate and the ramp wastes some of the effort, so the real effort (100 N) is more than the ideal effort (75 N).',
        }}
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <DiagramBox title="Comparing Slopes" caption="A gentler slope needs a smaller effort but a longer push.">
          <RampSteepnessDiagram />
        </DiagramBox>
        <DiagramBox title="Wedge in Action" caption="A wedge turns a forward push into a strong sideways force.">
          <WedgeActionDiagram />
        </DiagramBox>
        <DiagramBox title="Screw Pitch" caption="One full turn moves the screw forward by one pitch length.">
          <ScrewPitchDiagram />
        </DiagramBox>
        <DiagramBox title="Where the Energy Goes" caption="Friction turns some of the input work into wasted heat.">
          <EfficiencyDiagram />
        </DiagramBox>
      </div>
    </>
  );

  /* ========================================================================
    EFFICIENCY — DIAGRAMS
    ======================================================================== */

  const EnergyFlowSankeyDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 460 270" className="w-full max-w-2xl" aria-label="100 joules input splits into 70 joules useful output and 30 joules wasted energy" notes={['Example: 100 J input = 70 J useful output + 30 J wasted energy. Arrow widths show these proportions.']}>
    <path d="M30 70 H180 V170 H30Z" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
    <path d="M180 70 H370 V58 L430 105 L370 152 V140 H180Z" fill="#dcfce7" stroke="#059669" strokeWidth="2" />
    <path d="M180 140 H210 V213 H220 L195 250 L170 213 H180Z" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
    <text x="105" y="42" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1d4ed8">Input: 100 J</text>
    <text x="315" y="34" textAnchor="middle" fontSize="16" fontWeight="700" fill="#047857">Useful: 70 J</text>
    <text x="255" y="190" fontSize="15" fontWeight="700" fill="#dc2626">Wasted: 30 J</text>
    <text x="255" y="212" fontSize="14" fill="#b91c1c">Heat and sound</text>
  </LessonDiagram>
);

  const WorkInputOutputDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 460 190" className="w-full max-w-2xl" aria-label="Work input enters a machine and useful work output leaves it">
    <defs><marker id="cleanWorkBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#2563eb" /></marker><marker id="cleanWorkGreen" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#059669" /></marker></defs>
    <rect x="170" y="48" width="120" height="80" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
    <text x="230" y="94" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0f172a">Machine</text>
    <path d="M30 88 H155" stroke="#2563eb" strokeWidth="3" markerEnd="url(#cleanWorkBlue)" />
    <path d="M305 88 H425" stroke="#059669" strokeWidth="3" markerEnd="url(#cleanWorkGreen)" />
    <text x="92" y="64" textAnchor="middle" fontSize="15" fontWeight="700" fill="#1d4ed8">Work input</text>
    <text x="365" y="64" textAnchor="middle" fontSize="15" fontWeight="700" fill="#047857">Useful output</text>
    <text x="230" y="163" textAnchor="middle" fontSize="14" fill="#475569">Some input energy is wasted as heat and sound</text>
  </LessonDiagram>
  );

  const EnergyLossPathwayDiagram: React.FC = () => (
    <svg viewBox="0 0 420 170" className="h-auto w-full max-w-lg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="lossArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L7 3 L0 6 Z" fill="#dc2626" /></marker>
      </defs>
      <rect x="30" y="60" width="130" height="50" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2.5" />
      <text x="95" y="90" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d4ed8">Work Input</text>
      <line x1="160" y1="85" x2="250" y2="85" stroke="#334155" strokeWidth="3" markerEnd="url(#lossArrow)" />
      <path d="M180 85 Q195 40 220 25" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#lossArrow)" strokeDasharray="4 4" />
      <text x="225" y="18" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Heat (friction)</text>
      <path d="M180 90 Q195 130 220 148" fill="none" stroke="#dc2626" strokeWidth="2.5" markerEnd="url(#lossArrow)" strokeDasharray="4 4" />
      <text x="225" y="163" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Sound</text>
      <rect x="255" y="60" width="130" height="50" rx="8" fill="#dcfce7" stroke="#059669" strokeWidth="2.5" />
      <text x="320" y="90" textAnchor="middle" fontSize="14" fontWeight="700" fill="#047857">Useful Output</text>
    </svg>
  );

  const FrictionPointsDiagram: React.FC = () => (
  <LessonDiagram viewBox="0 0 440 240" className="w-full max-w-2xl" aria-label="Friction at a rope or axle, at a pivot, and between sliding surfaces">
    <line x1="65" y1="120" x2="375" y2="120" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
    <polygon points="220,120 200,161 240,161" fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
    {[65,220,375].map(x => <circle key={x} cx={x} cy="120" r="7" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />)}
    <path d="M65 110 V78 M375 110 V78 M220 172 V187" stroke="#94a3b8" strokeWidth="1.5" />
    <text x="65" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Rope / axle</text><text x="65" y="64" textAnchor="middle" fontSize="14" fill="#dc2626">friction</text>
    <text x="375" y="45" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Surface</text><text x="375" y="64" textAnchor="middle" fontSize="14" fill="#dc2626">friction</text>
    <text x="220" y="213" textAnchor="middle" fontSize="14" fontWeight="700" fill="#dc2626">Pivot friction</text>
  </LessonDiagram>
);

  const LubricationDiagram: React.FC = () => <LessonImage name="bearing-lubrication" alt="Cutaway of a ball bearing with a drop of lubricant at the ball and race contact" labels={['Oil reduces friction at the contacting surfaces']} />;

  const EfficiencyVsLoadGraph: React.FC = () => (
    <svg viewBox="0 0 320 220" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
      <line x1="45" y1="20" x2="45" y2="180" stroke="#334155" strokeWidth="2" />
      <line x1="45" y1="180" x2="290" y2="180" stroke="#334155" strokeWidth="2" />
      <text x="15" y="20" fontSize="14" fontWeight="700" fill="#334155">Eff. %</text>
      <text x="270" y="200" fontSize="14" fontWeight="700" fill="#334155">Load</text>
      <path d="M45 175 Q100 130 160 90 T290 55" fill="none" stroke="#2563eb" strokeWidth="3" />
      <text x="150" y="70" fontSize="14" fontWeight="700" fill="#1d4ed8">Rises, then levels off</text>
    </svg>
  );

  const MAVsLoadGraph: React.FC = () => (
  <LessonDiagram viewBox="0 0 360 245" className="w-full max-w-md" aria-label="Mechanical advantage increases with load and approaches the constant velocity ratio">
    <path d="M50 40 V190 H330" fill="none" stroke="#334155" strokeWidth="2" />
    <text x="28" y="27" fontSize="14" fontWeight="700" fill="#334155">MA</text>
    <text x="330" y="220" textAnchor="end" fontSize="14" fontWeight="700" fill="#334155">Load</text>
    <path d="M50 184 C105 127 175 95 330 80" fill="none" stroke="#059669" strokeWidth="3" />
    <path d="M50 65 H330" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
    <text x="325" y="50" textAnchor="end" fontSize="14" fill="#64748b">VR (constant)</text>
  </LessonDiagram>
);

  /* ========================================================================
    EFFICIENCY — BODY
    ======================================================================== */

  const EfficiencyBody: React.FC = () => (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
          Efficiency and Energy Losses
        </h1>
      </div>

      <TermCard
        accent="blue"
        text="**Efficiency** tells us how much of the work put into a machine comes out as useful work, written as a percentage."
        examples={[]}
      />
      <OverviewLead>
        No real machine is 100% efficient. Every machine has moving parts, and wherever parts rub, slide, or turn
        against each other, some of the input energy is changed into heat and sound instead of useful work. This
        wasted energy is not destroyed — it just does not help move the load.
      </OverviewLead>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Work Input and Work Output</h2>

      <OverviewHeading>Work Input</OverviewHeading>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">work input</strong> is the total work done on the machine
        by the effort.
      </OverviewLead>
      <KeyFormula label="Work Input:" formula="Work Input = Effort × Distance moved by Effort" />

      <OverviewHeading>Work Output</OverviewHeading>
      <OverviewLead>
        The <strong className="font-bold text-slate-900">work output</strong> is the useful work done by the
        machine on the load.
      </OverviewLead>
      <KeyFormula label="Work Output:" formula="Work Output = Load × Distance moved by Load" />

      <OverviewLead>
        The work output is always less than the work input, because some energy is always wasted inside the
        machine. The bigger the gap between input and output, the less efficient the machine is.
      </OverviewLead>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <DiagramBox title="Work Input vs Work Output" caption="What goes into the machine, and what usefully comes out.">
          <WorkInputOutputDiagram />
        </DiagramBox>
        <DiagramBox title="Energy Flow Through a Machine" caption="A flow diagram showing useful output and wasted energy branching off input.">
          <EnergyFlowSankeyDiagram />
        </DiagramBox>
        <DiagramBox title="Where the Wasted Energy Goes" caption="Some input work leaves the machine as heat and sound instead of useful output.">
          <EnergyLossPathwayDiagram />
        </DiagramBox>
      </div>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Efficiency Formulas</h2>

      <OverviewLead>Efficiency can be calculated in two equivalent ways.</OverviewLead>

      <KeyFormula label="Using work:" formula="Efficiency = (Work Output / Work Input) × 100%" />
      <KeyFormula label="Using MA and VR:" formula="Efficiency = (MA / VR) × 100%" />

      <OverviewLead>
        In a real machine, friction and the weight of moving parts always waste some of the effort. This means the
        actual load lifted for a given effort is always a little less than the ideal case, so the{' '}
        <strong className="font-bold text-slate-900">mechanical advantage (MA) is always less than the velocity
        ratio (VR)</strong> in a real machine. Only an imaginary, perfectly frictionless machine could have MA equal
        to VR, giving 100% efficiency.
      </OverviewLead>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Sources of Energy Losses</h2>

      <OverviewHeading>Friction</OverviewHeading>
      <OverviewLead>
        <strong className="font-bold text-slate-900">Friction</strong> happens wherever two surfaces rub or slide
        against each other inside a machine — for example, at a lever's pivot, along a rope over a pulley wheel, or
        between a load and a ramp. Friction changes some of the useful kinetic energy of the moving parts into{' '}
        <strong className="font-bold text-slate-900">unwanted heat and sound</strong>, which cannot be used to do
        useful work.
      </OverviewLead>
      <DiagramBox title="Common Friction Points" caption="Friction appears at pivots, axles, and sliding surfaces.">
        <FrictionPointsDiagram />
      </DiagramBox>

      <OverviewHeading>Weight of Moving Parts</OverviewHeading>
      <OverviewLead>
        Heavy parts of a machine, such as a thick pulley block or a solid lever arm, have their own weight. Some of
        the effort's work has to go into lifting or moving these heavy parts themselves, not just the load. This
        extra work is wasted as far as the load is concerned, lowering the machine's efficiency.
      </OverviewLead>

      <OverviewHeading>Methods to Improve Efficiency</OverviewHeading>
      <RuleList
        rules={[
          { rule: 'Lubrication.', example: 'Oil or grease between moving surfaces reduces friction and heat.' },
          { rule: 'Using lighter materials.', example: 'Lighter moving parts need less work to move, wasting less energy.' },
          { rule: 'Ball bearings.', example: 'Replace sliding friction with much smaller rolling friction.' },
          { rule: 'Streamlining.', example: 'Smooth, well-shaped parts reduce drag and resistance during movement.' },
        ]}
        forceList
      />
      <DiagramBox title="Lubrication Reduces Friction" caption="Oil between moving surfaces lowers energy losses.">
        <LubricationDiagram />
      </DiagramBox>

      <Divider />

      <h2 className="mb-3 mt-2 text-xl font-black text-slate-900 sm:text-2xl">Graphical Analysis &amp; Worked Examples</h2>

      <OverviewHeading>Efficiency vs Load Graph</OverviewHeading>
      <OverviewLead>
        As the load on a machine increases, efficiency usually rises quickly at first, then{' '}
        <strong className="font-bold text-slate-900">levels off</strong> at larger loads. This happens because
        friction losses stay roughly constant while the useful work done grows, so friction becomes a smaller
        fraction of the total work as the load increases.
      </OverviewLead>
      <DiagramBox title="Efficiency vs Load" caption="Efficiency rises with load, then levels off at higher loads.">
        <EfficiencyVsLoadGraph />
      </DiagramBox>

      <OverviewHeading>MA vs Load Graph</OverviewHeading>
      <OverviewLead>
        Mechanical advantage also increases with load and gets closer and closer to the velocity ratio, but it
        never quite reaches it, because there is always some friction in a real machine.
      </OverviewLead>
      <DiagramBox title="MA vs Load" caption="MA rises toward VR but never quite reaches it.">
        <MAVsLoadGraph />
      </DiagramBox>

      <OverviewHeading>Worked Example</OverviewHeading>
      <OverviewLead>
        A pulley system is used to lift a 250 N load through a height of 2 m. The effort applied is 80 N, and the
        effort moves through a distance of 8 m.
      </OverviewLead>

      <WorkedExampleBox
        index={1}
        example={{
          title: 'Step 1 — Find the work input.',
          given: ['Effort = 80 N.', 'Distance moved by effort = 8 m.'],
          find: 'The work input.',
          formula: 'Work Input = Effort × Distance moved by Effort',
          substitution: 'Work Input = 80 × 8',
          calculation: 'Work Input = 640',
          answer: 'Work Input = 640 J',
          meaning: 'This is the total energy supplied to the machine by the person pulling the rope.',
        }}
      />
      <WorkedExampleBox
        index={2}
        example={{
          title: 'Step 2 — Find the work output.',
          given: ['Load = 250 N.', 'Distance moved by load = 2 m.'],
          find: 'The work output.',
          formula: 'Work Output = Load × Distance moved by Load',
          substitution: 'Work Output = 250 × 2',
          calculation: 'Work Output = 500',
          answer: 'Work Output = 500 J',
          meaning: 'This is the useful energy that actually lifts the load.',
        }}
      />
      <WorkedExampleBox
        index={3}
        example={{
          title: 'Step 3 — Find the wasted energy.',
          given: ['Work Input = 640 J (Step 1).', 'Work Output = 500 J (Step 2).'],
          find: 'The energy wasted inside the machine.',
          formula: 'Wasted Energy = Work Input − Work Output',
          substitution: 'Wasted Energy = 640 − 500',
          calculation: 'Wasted Energy = 140',
          answer: 'Wasted Energy = 140 J',
          meaning: 'This energy was lost mainly as heat and sound due to friction in the pulley system.',
        }}
      />
      <WorkedExampleBox
        index={4}
        example={{
          title: 'Step 4 — Find the percentage efficiency.',
          given: ['Work Output = 500 J.', 'Work Input = 640 J.'],
          find: 'The efficiency of the pulley system.',
          formula: 'Efficiency = (Work Output / Work Input) × 100%',
          substitution: 'Efficiency = (500 / 640) × 100%',
          calculation: 'Efficiency = 78.1%',
          answer: 'Efficiency ≈ 78%',
          meaning: 'About 78% of the input energy usefully lifted the load; the rest was wasted to friction.',
        }}
      />
    </>
  );

  /* ========================================================================
    CONTENT DATA
    ======================================================================== */

  const sections: Section[] = [
    {
      id: 'machines-overview',
      eyebrow: 'Chapter 4.1',
      title: 'Simple Machines Overview',
      heading: 'Simple Machines — Making Work Easier',
      intro: '',
      customBody: <MachinesOverviewBody />,
      examples: [
        {
          question: 'A gardener pushes a wheelbarrow full of soil. Identify the load and the effort in this situation.',
          steps: [
            'The load is the object being moved by the machine.',
            'The load is the soil (and the wheelbarrow itself) being carried.',
            'The effort is the force applied to the machine.',
            'The effort is the push the gardener applies to the wheelbarrow handles.',
          ],
          answer: 'Load = the soil being carried, Effort = the push from the gardener',
        },
        {
          question: 'A learner uses a bottle opener to remove a bottle cap. Identify the load and the effort.',
          steps: [
            'The load is the resistance the machine is overcoming.',
            'The load is the grip of the bottle cap on the bottle.',
            'The effort is the force applied to the machine.',
            'The effort is the upward force the learner applies to the handle of the opener.',
          ],
          answer: 'Load = the grip of the bottle cap, Effort = the force applied to the opener handle',
        },
        {
          question: 'A driver rolls a heavy drum up a ramp into a truck instead of lifting it straight up. Explain how the ramp (an inclined plane) makes this easier.',
          steps: [
            'Lifting the drum straight up needs a large force over a short distance.',
            'The ramp lets the same drum be raised to the same height, but by pushing it along a longer, sloping path.',
            'Because the force acts over a greater distance, less force is needed at any one moment.',
          ],
          answer: 'The ramp spreads the same job over a longer distance, so a smaller effort is needed to raise the drum.',
        },
      ],
      practice: [
        'In your own words, explain what a machine is.',
        'Give two ways a machine can make a job easier.',
        'Define load and give one everyday example.',
        'Define effort and give one everyday example.',
        'Name the six main types of simple machines, and give one everyday example of each.',
        'Explain why a machine does not remove the need for work, even though it makes a job feel easier.',
      ],
    },
    {
      id: 'levers',
      eyebrow: 'Chapter 4.2',
      title: 'Levers',
      heading: 'Levers — Turning Force into Advantage',
      customBody: <LeversBody />,
      intro:
        'A **lever** is a rigid bar that rotates about a fixed point called the **pivot** or **fulcrum**. By applying a force at one point, we can lift or move a load at another point.',
      intro2:
        'Levers are found in many everyday tools: scissors, wheelbarrows, bottle openers, and crowbars. They work by changing the distance from the pivot to magnify the force or the distance moved.',
      introMore: [
        'The **mechanical advantage** of a lever depends on the distances from the pivot to the effort and the load.',
        'For a lever in equilibrium: Effort × Effort arm = Load × Load arm (Principle of Moments).',
        'If the effort arm is longer than the load arm, the lever multiplies force (MA > 1).',
        'If the effort arm is shorter, the lever multiplies distance (MA < 1).',
      ],
      definition:
        'A **lever** is a simple machine consisting of a rigid bar that pivots about a fixed point (fulcrum).\n\n' +
        'The **effort arm** is the perpendicular distance from the fulcrum to the line of action of the effort. The **load arm** is the distance from the fulcrum to the load.',
      method: {
        title: 'Calculating MA for Levers',
        kind: 'steps',
        rows: [
          { step: 1, formula: 'Identify forces', text: 'Determine the load (L) and the effort (E).' },
          { step: 2, formula: 'Measure distances', text: 'Measure the effort arm (d_E) and the load arm (d_L) from the pivot.' },
          { step: 3, formula: 'Use moments', text: 'For equilibrium: E × d_E = L × d_L.' },
          { step: 4, formula: 'Calculate MA', text: 'MA = L / E = d_E / d_L (from the moment equation).' },
        ],
      },
      keyFormula: {
        label: 'Lever equilibrium and MA:',
        formula: (
          <>
            E × d<sub>E</sub> = L × d<sub>L</sub> &nbsp;&nbsp;|&nbsp;&nbsp; MA = d<sub>E</sub> / d<sub>L</sub>
          </>
        ),
      },
      examples: [
        {
          question: 'A crowbar is used to lift a heavy rock. The effort arm is 1.5 m and the load arm is 0.3 m. Calculate the mechanical advantage.',
          steps: ['d_E = 1.5 m', 'd_L = 0.3 m', 'MA = d_E / d_L = 1.5 / 0.3 = 5'],
          answer: 'MA = 5',
        },
        {
          question: 'A see-saw is balanced when a 40 N child sits 2 m from the pivot and a 60 N child sits on the other side. Calculate the distance the 60 N child must sit from the pivot.',
          steps: ['Clockwise moment = 40 × 2 = 80 N·m', 'Anticlockwise moment = 60 × d', '80 = 60d → d = 80/60 = 1.33 m'],
          answer: 'd = 1.33 m',
        },
        {
          question: 'A lever has a mechanical advantage of 4. If the effort is 30 N, what load can it lift?',
          steps: ['MA = 4', 'Effort = 30 N', 'MA = Load / Effort → Load = MA × Effort = 4 × 30 = 120 N'],
          answer: 'Load = 120 N',
        },
      ],
      practice: [
        'What is a lever? Give two examples of levers in everyday life.',
        'A lever has an effort arm of 0.8 m and a load arm of 0.2 m. Calculate the mechanical advantage.',
        'A force of 20 N is applied at the end of a lever 1.2 m from the pivot. Calculate the moment produced.',
        'Explain why a longer effort arm gives a larger mechanical advantage.',
        'A see-saw is balanced with a 50 N child 1.5 m from the pivot and a 30 N child on the other side. How far from the pivot must the 30 N child sit?',
      ],
    },
    {
      id: 'pulleys',
      eyebrow: 'Chapter 4.3',
      title: 'Pulley Systems',
      heading: 'Pulley Systems — Multiplying Force with Ropes',
      intro: '',
      customBody: <PulleysBody />,
      examples: [
        {
          question: 'A pulley system has 4 rope segments supporting the load. What is the velocity ratio?',
          steps: ['Number of rope segments = 4', 'VR = 4'],
          answer: 'VR = 4',
        },
        {
          question: 'A block and tackle pulley system has a velocity ratio of 5. If the effort is 60 N, what is the maximum load that can be lifted (assuming no friction)?',
          steps: ['VR = 5', 'Effort = 60 N', 'MA (ideal) = VR = 5', 'Load = MA × Effort = 5 × 60 = 300 N'],
          answer: 'Load = 300 N',
        },
        {
          question: 'A pulley system lifts a load of 400 N with an effort of 100 N. The system has 5 rope segments. Calculate the mechanical advantage and efficiency.',
          steps: ['Load = 400 N', 'Effort = 100 N', 'MA = 400 / 100 = 4', 'VR = 5', 'Efficiency = (MA / VR) × 100% = (4/5) × 100% = 80%'],
          answer: 'MA = 4, Efficiency = 80%',
        },
      ],
      practice: [
        'Explain the difference between a fixed pulley and a movable pulley.',
        'A pulley system has 3 rope segments supporting the load. What is the velocity ratio?',
        'A block and tackle system has a velocity ratio of 6. If the effort is 80 N, what load can be lifted (ideal)?',
        'In a pulley experiment, a load of 200 N is lifted with an effort of 50 N. The system has 5 rope segments. Calculate the mechanical advantage and efficiency.',
        'Why do pulley systems lose efficiency? How can it be improved?',
      ],
    },
    {
      id: 'inclined-planes',
      eyebrow: 'Chapter 4.4',
      title: 'Inclined Planes',
      heading: 'Inclined Planes — Sloping to Success',
      intro: '',
      customBody: <InclinedPlanesBody />,
      examples: [
        {
          question: 'A ramp is 5 m long and rises to a height of 1 m. Calculate the ideal mechanical advantage.',
          steps: ['Length = 5 m', 'Height = 1 m', 'MA = 5 / 1 = 5'],
          answer: 'MA = 5',
        },
        {
          question: 'A force of 100 N is used to push a 400 N load up a 4 m long ramp to a height of 1 m. Calculate the mechanical advantage and efficiency.',
          steps: ['Load = 400 N', 'Effort = 100 N', 'MA = 400 / 100 = 4', 'VR = Length / Height = 4 / 1 = 4', 'Efficiency = (4/4) × 100% = 100% (ideal)'],
          answer: 'MA = 4, Efficiency = 100% (no friction assumed)',
        },
        {
          question: 'A carpenter drives a wedge into a log to split it. Explain why a small hammer blow along the wedge can produce a much larger splitting force.',
          steps: [
            'A wedge is two inclined planes joined back-to-back.',
            'The forward force of the hammer blow acts along the length of the wedge.',
            'The sloping sides convert this into a much larger sideways force, because the wedge moves only a short distance into the wood while its sides push the wood apart over a wider distance.',
          ],
          answer: 'The wedge trades a small forward movement for a much larger sideways splitting force.',
        },
        {
          question: 'A screw has a pitch of 2 mm. Explain how many millimetres it moves forward after 5 complete turns.',
          steps: [
            'Pitch = distance moved forward in 1 turn = 2 mm.',
            'Distance moved in 5 turns = 5 × 2 mm.',
          ],
          answer: 'The screw moves forward 10 mm after 5 complete turns.',
        },
      ],
      practice: [
        'Define an inclined plane and give two examples.',
        'A ramp is 8 m long and rises 2 m. Calculate the ideal mechanical advantage.',
        'A 300 N load is pushed up a 3 m long ramp to a height of 0.6 m. If the effort is 60 N, calculate the mechanical advantage and efficiency.',
        'Explain why a longer inclined plane makes it easier to lift a load.',
        'How can friction on an inclined plane be reduced to improve efficiency?',
        'Define a wedge and give three real-life examples.',
        'A screw has a pitch of 1.5 mm. How far forward does it move after 4 complete turns?',
      ],
    },
    {
      id: 'efficiency',
      eyebrow: 'Chapter 4.5',
      title: 'Efficiency and Energy Losses',
      heading: 'Efficiency — Getting the Most Out of a Machine',
      intro: '',
      customBody: <EfficiencyBody />,
      examples: [
        {
          question: 'A machine has a mechanical advantage of 4 and a velocity ratio of 5. Calculate its efficiency.',
          steps: ['MA = 4', 'VR = 5', 'Efficiency = (4/5) × 100% = 80%'],
          answer: 'Efficiency = 80%',
        },
        {
          question: 'A pulley system lifts a load of 500 N with an effort of 125 N. The effort moves 4 m while the load moves 1 m. Calculate the efficiency.',
          steps: ['Load = 500 N', 'Effort = 125 N', 'MA = 500/125 = 4', 'VR = Distance effort / Distance load = 4/1 = 4', 'Efficiency = (4/4) × 100% = 100% (ideal)'],
          answer: 'Efficiency = 100% (assuming no energy losses)',
        },
        {
          question: 'A ramp is used to lift a 600 N load to a height of 2 m. The effort applied is 150 N and the ramp is 8 m long. Calculate the efficiency.',
          steps: ['Load = 600 N', 'Effort = 150 N', 'MA = 600/150 = 4', 'VR = Length/Height = 8/2 = 4', 'Efficiency = (4/4) × 100% = 100%'],
          answer: 'Efficiency = 100% (ideal, no friction)',
        },
        {
          question: 'In a machine, the input work is 800 J and the useful output work is 560 J. What is the efficiency?',
          steps: ['Efficiency = (Useful output / Input) × 100% = (560 / 800) × 100% = 70%'],
          answer: 'Efficiency = 70%',
        },
        {
          question: 'Explain why the mechanical advantage of a real machine is always less than its velocity ratio.',
          steps: [
            'Velocity ratio depends only on the machine\'s dimensions, not on friction.',
            'Mechanical advantage depends on the actual load lifted for the actual effort used.',
            'Because friction and the weight of moving parts waste some of the effort, the real load lifted is always less than the ideal case, so MA < VR.',
          ],
          answer: 'Friction and moving-part weight waste some effort, so MA is always less than VR in a real machine.',
        },
      ],
      practice: [
        'Define efficiency and state its formula.',
        'A machine has a velocity ratio of 6 and a mechanical advantage of 4.5. Calculate its efficiency.',
        'List four ways to improve the efficiency of a machine.',
        'Why is efficiency always less than 100% in practice?',
        'In an experiment, a machine lifts a load of 200 N through a height of 1.2 m. The effort does 400 J of work. Calculate the efficiency of the machine.',
        'Sketch and describe how efficiency changes as the load on a machine increases.',
        'A crane does 900 J of work input to lift a load, producing 630 J of useful output work. Find the wasted energy and the percentage efficiency.',
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

  export const Machines: React.FC = () => {
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
                TOPIC 4
              </span>
            </div>
            <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
              Machines
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
              Machines make work easier by changing the size or direction of a force. In this chapter,
              you will learn about levers, pulley systems, and inclined planes, and how to calculate
              mechanical advantage, velocity ratio, and efficiency. We'll also explore how to improve
              the efficiency of machines in real-world applications.
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

  export default Machines;
