import React, { useState, useRef, useEffect, ReactNode } from 'react';
import * as THREE from 'three';

/* ========================================================================
   TYPES
   ======================================================================== */

interface FlagProps {
  className?: string;
}

interface StepRowProps {
  step: number | string;
  children: ReactNode;
  formula?: string;
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

interface ComputationVar {
  symbol: string;
  label: string;
  value: string;
  unit: string;
}

interface Computation {
  vars: ComputationVar[];
  numerator: string;
  denominator: string;
  dividend: number;
  divisor: number;
  resultUnit: string;
}

interface ExampleItem {
  question: string;
  steps: string[];
  answer: string;
  computation?: Computation;
}

interface ExampleCardProps {
  index: number;
  example: ExampleItem;
}

interface PracticeZoneProps {
  items: string[];
}

interface DiagramFrameProps {
  title?: string;
  caption?: string;
  children: ReactNode;
}

// Diagram props
interface RoundingProps {
  lowLabel: string;
  highLabel: string;
  ratio: number;
}

interface BoundsProps {
  value: string | number;
  lower: string | number;
  upper: string | number;
  unit: string;
}

interface AreaProps {
  minL: number;
  minW: number;
  maxL: number;
  maxW: number;
}

interface DensityProps {
  mass: string;
  volume: string;
  density: string;
}

type DiagramType = 'rounding' | 'bounds' | 'area' | 'density' | 'vectors' | 'circuit' | 'densityBalance';

interface DiagramConfig {
  type: DiagramType;
  title?: string;
  caption?: string;
  props?: any;
  bare?: boolean;
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

interface Section {
  id: string;
  eyebrow: string;
  title: string;
  heading: string;
  intro: string;
  intro2?: string;
  intromore?: string[];
  definition?: string;
  diagram?: DiagramConfig;
  method?: MethodConfig;
  method2?: MethodConfig;
  method3?: MethodConfig;
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
   FLAGS
   ======================================================================== */

export const UkFlag: React.FC<FlagProps> = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="uk-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#uk-clip-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L30,0" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L30,0" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const ZwFlag: React.FC<FlagProps> = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <rect width="60" height="4.286" y="0" fill="#31905c" />
    <rect width="60" height="4.286" y="4.286" fill="#ffd200" />
    <rect width="60" height="4.286" y="8.572" fill="#de2010" />
    <rect width="60" height="4.286" y="12.858" fill="#000000" />
    <rect width="60" height="4.286" y="17.144" fill="#de2010" />
    <rect width="60" height="4.286" y="21.43" fill="#ffd200" />
    <rect width="60" height="4.286" y="25.716" fill="#31905c" />
    <polygon points="0,0 22,15 0,30" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
    <polygon points="7.5,9.5 8.7,13.2 12.6,13.2 9.5,15.5 10.7,19.2 7.5,16.9 4.3,19.2 5.5,15.5 2.4,13.2 6.3,13.2" fill="#de2010" />
  </svg>
);

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

export const StepRow: React.FC<StepRowProps> = ({ step, children, formula }) => (
  <div className="grid grid-cols-1 gap-3 border-b border-dashed border-slate-200 py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
    <div className="flex gap-3">
      <span className="ga-hand flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-800">
        {step}
      </span>
      <p className="pt-0.5 leading-relaxed text-slate-700">{children}</p>
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
    <p className="text-[1.05rem] font-semibold leading-relaxed text-blue-900">{renderRich(text)}</p>
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
      {/* Desktop: two-column table */}
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

export const ExampleCard: React.FC<ExampleCardProps> = ({ index, example }) => {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {index}
        </div>
        <div className="pt-1 font-medium text-slate-800">{example.question}</div>
      </div>
      <div className="border-t border-slate-100 p-4 sm:p-5">
        <div className="ga-ruled rounded-lg p-4 pl-6">
          {example.steps.map((step, i) => (
            <div key={i} className="flex gap-2 border-b border-blue-100/70 py-2 text-sm leading-relaxed last:border-0">
              <span className="ga-hand shrink-0 font-bold text-rose-500">Step {i + 1}:</span>
              <span className="ga-ink flex-1 text-[1.05rem] leading-relaxed text-blue-900">{step}</span>
            </div>
          ))}
          <div className="pt-2 text-sm leading-relaxed">
            <span className="ga-hand mr-1 font-bold text-slate-500">Answer:</span>
            <span className="ga-ink text-lg font-bold text-emerald-700">{example.answer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

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

/* ========================================================================
   THREE.JS DIAGRAM ENGINE
   ======================================================================== */

interface ThreeSetupReturn {
  onFrame?: (t: number) => void;
  cleanup?: () => void;
}

type ThreeSetupFn = (params: {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  THREE: typeof THREE;
}) => ThreeSetupReturn | void;

export function useThreeScene(
  mountRef: React.RefObject<HTMLDivElement | null>,
  setup: ThreeSetupFn,
  deps: React.DependencyList = []
): void {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 300;
    const height = mount.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 6, 5);
    const fill = new THREE.DirectionalLight(0xbfd7ff, 0.4);
    fill.position.set(-5, 2, -3);
    scene.add(ambient, key, fill);

    const result = setup({ scene, camera, renderer, THREE });
    const { onFrame, cleanup } = result || {};

    let frameId: number;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      onFrame?.(t);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = mount.clientWidth || 300;
      const h = mount.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      cleanup?.();
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m: THREE.Material) => m.dispose());
        } else {
          obj.material.dispose();
        }
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const DiagramFrame: React.FC<DiagramFrameProps> = ({ title, caption, children }) => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    {title && (
      <h4 className="mb-2 text-xs font-bold uppercase text-emerald-600">
        {title}
      </h4>
    )}
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white">{children}</div>
    {caption && <p className="mt-2 text-center text-sm italic text-slate-500">{caption}</p>}
  </div>
);

interface TitleBannerProps {
  children: ReactNode;
}

export const TitleBanner: React.FC<TitleBannerProps> = ({ children }) => (
  <h3 className="mb-3 text-lg font-bold text-slate-900 sm:text-xl">{children}</h3>
);

/* ---- Whiteboard-style derivation animation ---- */

const whiteboardKeyframes = `
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
    
    const t = setTimeout(() => setCount((c) => c + 1), speed);
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

/* ---- CancelLine: rise-in numbers + strike-through cancellation for arithmetic steps ---- */

interface CancelLineProps {
  text: string;
}

const CancelLine: React.FC<CancelLineProps> = ({ text }) => {
  const parts = text.split('=').map((p) => p.trim()).filter((p) => p.length > 0);

  if (parts.length <= 1) {
    return (
      <span
        className="ga-ink inline-block text-[1.05rem] leading-relaxed text-slate-800"
        style={{ animation: 'wbRise 0.5s ease-out both' }}
      >
        {text}
      </span>
    );
  }

  return (
    <span className="ga-ink inline-flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[1.05rem] leading-relaxed text-slate-800">
      {parts.map((part, i) => {
        const isLast = i === parts.length - 1;
        const isCancelled = !isLast && i > 0;
        const delay = i * 0.65;
        return (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-slate-400">=</span>}
            <span
              className={`relative inline-block px-0.5 ${isLast ? 'text-lg font-bold text-slate-900' : ''}`}
              style={{
                animation: `${isLast ? 'wbRise' : 'wbPop'} 0.45s ease-out both`,
                animationDelay: `${delay}s`,
              }}
            >
              {part}
              {isCancelled && (
                <span
                  className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-slate-400"
                  style={{
                    width: '0%',
                    animation: 'wbStrike 0.35s linear forwards',
                    animationDelay: `${delay + 0.4}s`,
                  }}
                />
              )}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
};

/* ---- Long-division "bus stop" animation: cancel, carry, quotient, decimal, bring-down-zero ---- */

interface DivisionStep {
  digit: string;
  incomingCarry: number;
  quotientDigit: string;
  outgoingRemainder: number;
  isDecimalPoint: boolean;
}

function computeLongDivision(dividend: number, divisor: number, maxDecimalDigits = 6): DivisionStep[] {
  const intPart = Math.floor(dividend).toString();
  const steps: DivisionStep[] = [];
  let remainder = 0;

  for (let i = 0; i < intPart.length; i++) {
    const digit = intPart[i];
    const remainderBefore = remainder;
    const combined = remainder * 10 + Number(digit);
    const qDigit = Math.floor(combined / divisor);
    remainder = combined % divisor;
    steps.push({ digit, incomingCarry: remainderBefore, quotientDigit: String(qDigit), outgoingRemainder: remainder, isDecimalPoint: false });
  }

  let decimalCount = 0;
  let first = true;
  while (remainder !== 0 && decimalCount < maxDecimalDigits) {
    const remainderBefore = remainder;
    const combined = remainder * 10;
    const qDigit = Math.floor(combined / divisor);
    remainder = combined % divisor;
    steps.push({ digit: '0', incomingCarry: remainderBefore, quotientDigit: String(qDigit), outgoingRemainder: remainder, isDecimalPoint: first });
    first = false;
    decimalCount++;
  }
  return steps;
}

function stripCommonZeros(a: number, b: number): { count: number; a: number; b: number } {
  let x = a, y = b, count = 0;
  while (x >= 10 && y >= 10 && x % 10 === 0 && y % 10 === 0) {
    x /= 10; y /= 10; count++;
  }
  return { count, a: x, b: y };
}

function buildQuotientString(steps: DivisionStep[], revealed: number): string {
  let out = '';
  let seenSig = false;
  for (let i = 0; i < revealed; i++) {
    const s = steps[i];
    if (s.isDecimalPoint) out += '.';
    if (s.quotientDigit !== '0' || seenSig || s.isDecimalPoint) {
      out += s.quotientDigit;
      if (s.quotientDigit !== '0') seenSig = true;
    }
  }
  if (out === '' || out.startsWith('.')) out = '0' + out;
  return out;
}

const LongDivisionAnimator: React.FC<{ dividend: number; divisor: number; resultUnit: string }> = ({ dividend, divisor, resultUnit }) => {
  const steps = React.useMemo(() => computeLongDivision(dividend, divisor), [dividend, divisor]);
  const [visible, setVisible] = useState(0);
  const [phase, setPhase] = useState<'digit' | 'cancel' | 'quotient'>('digit');

  useEffect(() => {
    setVisible(0);
    setPhase('digit');
  }, [dividend, divisor]);

  useEffect(() => {
    if (visible >= steps.length) return;
    const t1 = setTimeout(() => setPhase('cancel'), 450);
    const t2 = setTimeout(() => setPhase('quotient'), 850);
    const t3 = setTimeout(() => {
      setVisible((v) => v + 1);
      setPhase('digit');
    }, 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [visible, steps.length]);

  const revealed = phase === 'digit' ? visible : visible + 1;
  const quotient = buildQuotientString(steps, revealed);

  return (
    <div className="ga-ink flex flex-col items-start gap-1 py-1">
      <div className="pl-14 text-lg font-bold text-slate-900 sm:text-xl" style={{ minHeight: '1.6em' }}>
        {quotient.split('').map((ch, i) => (
          <span key={`${quotient.length}-${i}`} className="inline-block" style={{ animation: 'wbPop 0.3s ease-out both' }}>
            {ch}
          </span>
        ))}
        <span className="ml-2 text-sm font-semibold text-slate-500">{revealed >= steps.length ? resultUnit : ''}</span>
      </div>

      <div className="flex items-start">
        <div className="flex items-center border-r-2 border-t-2 border-slate-800 pr-3 pt-1">
          <span className="pr-2 text-lg font-bold text-slate-900 sm:text-xl">{divisor}</span>
        </div>
        <div className="flex gap-2 pl-2 pt-1">
          {steps.map((s, i) => {
            const shown = visible >= i;
            const cancelled = visible > i || (visible === i && (phase === 'cancel' || phase === 'quotient'));
            return (
              <span key={i} className="relative flex w-6 flex-col items-center">
                {s.isDecimalPoint && <span className="absolute -left-2 bottom-0 text-lg font-bold text-slate-900">.</span>}
                {s.incomingCarry > 0 && shown && (
                  <span className="absolute -top-3 left-3 text-[10px] font-bold text-slate-400" style={{ animation: 'wbPop 0.25s ease-out both' }}>
                    {s.incomingCarry}
                  </span>
                )}
                <span
                  className="relative text-lg font-bold sm:text-xl"
                  style={{
                    opacity: shown ? 1 : 0.15,
                    color: cancelled ? '#94a3b8' : '#0f172a',
                    textDecoration: cancelled ? 'line-through' : 'none',
                    animation: shown ? 'wbPop 0.25s ease-out both' : undefined,
                  }}
                >
                  {s.digit}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CancelAndAnswer: React.FC<{ dividend: number; divisor: number; resultUnit: string }> = ({ dividend, divisor, resultUnit }) => {
  const dividendStr = String(dividend);
  const divisorStr = String(divisor);
  const answerStr = React.useMemo(() => {
    const steps = computeLongDivision(dividend, divisor);
    return `${buildQuotientString(steps, steps.length)} ${resultUnit}`;
  }, [dividend, divisor, resultUnit]);

  type Phase = 'top' | 'bottom' | 'cancelBottom' | 'cancelTop' | 'equalsPause' | 'answer' | 'done';
  const [phase, setPhase] = useState<Phase>('top');

  useEffect(() => {
    setPhase('top');
  }, [dividend, divisor]);

  useEffect(() => {
    if (phase === 'cancelBottom') {
      const t = setTimeout(() => setPhase('cancelTop'), 350);
      return () => clearTimeout(t);
    }
    if (phase === 'cancelTop') {
      const t = setTimeout(() => setPhase('equalsPause'), 350);
      return () => clearTimeout(t);
    }
    if (phase === 'equalsPause') {
      const t = setTimeout(() => setPhase('answer'), 250);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const topStruckThrough = phase === 'cancelTop' || phase === 'equalsPause' || phase === 'answer' || phase === 'done';
  const bottomStruckThrough = phase === 'cancelBottom' || topStruckThrough;

  return (
    <span className="ga-ink inline-flex items-center gap-4">
      <span className="inline-flex flex-col items-center">
        <span className="relative inline-block min-w-[1ch] px-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          <Typewriter text={dividendStr} active={phase === 'top'} onDone={() => setPhase('bottom')} speed={90} />
          {topStruckThrough && (
            <span
              className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-6 bg-red-500"
              style={{ animation: 'wbStrike 0.3s linear forwards' }}
            />
          )}
        </span>
        <span className="my-1 h-[2px] w-full bg-slate-800" />
        <span className="relative inline-block min-w-[1ch] px-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          {phase !== 'top' && (
            <Typewriter text={divisorStr} active={phase === 'bottom'} onDone={() => setPhase('cancelBottom')} speed={90} />
          )}
          {bottomStruckThrough && (
            <span
              className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-6 bg-red-500"
              style={{ animation: 'wbStrike 0.3s linear forwards' }}
            />
          )}
        </span>
      </span>
      {(phase === 'answer' || phase === 'done') && (
        <span className="flex items-center gap-3" style={{ animation: 'wbRise 0.3s ease-out both' }}>
          <span className="text-2xl text-slate-400">=</span>
          <Typewriter
            text={answerStr}
            active={phase === 'answer'}
            onDone={() => setPhase('done')}
            speed={55}
            className="text-2xl font-bold text-emerald-700 sm:text-3xl"
          />
        </span>
      )}
    </span>
  );
};

const ComputationBlock: React.FC<{ computation: Computation }> = ({ computation }) => {
  const { vars, numerator, denominator, dividend, divisor, resultUnit } = computation;

  return (
    <div className="mt-1">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-8 gap-y-2">
        {vars.map((v, i) => (
          <span
            key={i}
            className="ga-ink text-base font-semibold text-slate-800 sm:text-lg"
            style={{ animation: 'wbRise 0.4s ease-out both', animationDelay: `${i * 0.25}s` }}
          >
            {v.label} ({v.symbol}) = {v.value} {v.unit}.
          </span>
        ))}
      </div>

      <p className="ga-hand mb-2 text-sm font-bold text-slate-500">Now use this formula:</p>
      <div className="flex flex-wrap items-center gap-5">
        <span className="ga-ink inline-flex flex-col items-center text-xl font-bold text-slate-900 sm:text-2xl">
          <span>{numerator}</span>
          <span className="my-0.5 h-[2px] w-full bg-slate-800" />
          <span>{denominator}</span>
        </span>
        <span className="text-2xl text-slate-400">→</span>
        <CancelAndAnswer dividend={dividend} divisor={divisor} resultUnit={resultUnit} />
      </div>
    </div>
  );
};

/* ---- Generic derivation engine: works for any formula with 1–3 variables ---- */

interface DerivationVar {
  letter: string;
  unit: string;
  caption: string;
}

interface Derivation {
  id: string;
  label: string;
  resultSymbol: string;
  operators: string[]; // length = vars.length - 1, e.g. [' × '] or [' × ', ' × '] or [' / ']
  vars: DerivationVar[];
  substitution: string;
  finalResult: string;
}

const DERIVATIONS: Derivation[] = [
  { id: 'force', label: 'Force', resultSymbol: 'F', operators: [' × '], vars: [
    { letter: 'm', unit: 'kg', caption: 'Mass is measured in kilograms (kg)' },
    { letter: 'a', unit: 'm/s²', caption: 'Acceleration is measured in m/s²' },
  ], substitution: 'F = kg × m/s²', finalResult: '1 N = 1 kg·m/s²' },
  { id: 'energy', label: 'Energy', resultSymbol: 'W', operators: [' × '], vars: [
    { letter: 'F', unit: 'kg·m/s²', caption: 'Force is measured in newtons (kg·m/s²)' },
    { letter: 'd', unit: 'm', caption: 'Distance is measured in metres (m)' },
  ], substitution: 'W = kg·m/s² × m', finalResult: '1 J = 1 kg·m²/s²' },
  { id: 'power', label: 'Power', resultSymbol: 'P', operators: [' / '], vars: [
    { letter: 'W', unit: 'kg·m²/s²', caption: 'Energy is measured in joules (kg·m²/s²)' },
    { letter: 't', unit: 's', caption: 'Time is measured in seconds (s)' },
  ], substitution: 'P = kg·m²/s² / s', finalResult: '1 W = 1 kg·m²/s³' },
  { id: 'voltage', label: 'Voltage', resultSymbol: 'V', operators: [' / '], vars: [
    { letter: 'P', unit: 'kg·m²/s³', caption: 'Power is measured in watts (kg·m²/s³)' },
    { letter: 'I', unit: 'A', caption: 'Current is measured in amperes (A)' },
  ], substitution: 'V = kg·m²/s³ / A', finalResult: '1 V = 1 kg·m²/(s³·A)' },
  { id: 'pressure', label: 'Pressure', resultSymbol: 'P', operators: [' / '], vars: [
    { letter: 'F', unit: 'kg·m/s²', caption: 'Force is measured in newtons (kg·m/s²)' },
    { letter: 'A', unit: 'm²', caption: 'Area is measured in square metres (m²)' },
  ], substitution: 'P = kg·m/s² / m²', finalResult: '1 Pa = 1 kg/(m·s²)' },
  { id: 'frequency', label: 'Frequency', resultSymbol: 'f', operators: [' / '], vars: [
    { letter: '1', unit: '', caption: 'The numerator is just the number 1 (no unit)' },
    { letter: 'T', unit: 's', caption: 'Period is measured in seconds (s)' },
  ], substitution: 'f = 1 / s', finalResult: '1 Hz = 1 / s' },
  { id: 'charge', label: 'Charge', resultSymbol: 'Q', operators: [' × '], vars: [
    { letter: 'I', unit: 'A', caption: 'Current is measured in amperes (A)' },
    { letter: 't', unit: 's', caption: 'Time is measured in seconds (s)' },
  ], substitution: 'Q = A × s', finalResult: '1 C = 1 A·s' },
  { id: 'resistance', label: 'Resistance', resultSymbol: 'R', operators: [' / '], vars: [
    { letter: 'V', unit: 'kg·m²/(s³·A)', caption: 'Voltage is measured in volts' },
    { letter: 'I', unit: 'A', caption: 'Current is measured in amperes (A)' },
  ], substitution: 'R = kg·m²/(s³·A) / A', finalResult: '1 Ω = 1 kg·m²/(s³·A²)' },
  { id: 'area', label: 'Area', resultSymbol: 'A', operators: [' × '], vars: [
    { letter: 'l', unit: 'm', caption: 'Length is measured in metres (m)' },
    { letter: 'w', unit: 'm', caption: 'Width is measured in metres (m)' },
  ], substitution: 'A = m × m', finalResult: '1 m² = 1 m × m' },
  { id: 'volume', label: 'Volume', resultSymbol: 'V', operators: [' × ', ' × '], vars: [
    { letter: 'l', unit: 'm', caption: 'Length is measured in metres (m)' },
    { letter: 'w', unit: 'm', caption: 'Width is measured in metres (m)' },
    { letter: 'h', unit: 'm', caption: 'Height is measured in metres (m)' },
  ], substitution: 'V = m × m × m', finalResult: '1 m³ = 1 m × m × m' },
  { id: 'density', label: 'Density', resultSymbol: 'ρ', operators: [' / '], vars: [
    { letter: 'm', unit: 'kg', caption: 'Mass is measured in kilograms (kg)' },
    { letter: 'V', unit: 'm³', caption: 'Volume is measured in cubic metres (m³)' },
  ], substitution: 'ρ = kg / m³', finalResult: '1 kg/m³ = 1 kg / m³' },
  { id: 'speed', label: 'Speed', resultSymbol: 'v', operators: [' / '], vars: [
    { letter: 'd', unit: 'm', caption: 'Distance is measured in metres (m)' },
    { letter: 't', unit: 's', caption: 'Time is measured in seconds (s)' },
  ], substitution: 'v = m / s', finalResult: '1 m/s = 1 m / s' },
  { id: 'acceleration', label: 'Acceleration', resultSymbol: 'a', operators: [' / '], vars: [
    { letter: 'v', unit: 'm/s', caption: 'Velocity is measured in m/s' },
    { letter: 't', unit: 's', caption: 'Time is measured in seconds (s)' },
  ], substitution: 'a = m/s / s', finalResult: '1 m/s² = 1 m/s / s' },
  { id: 'momentum', label: 'Momentum', resultSymbol: 'p', operators: [' × '], vars: [
    { letter: 'm', unit: 'kg', caption: 'Mass is measured in kilograms (kg)' },
    { letter: 'v', unit: 'm/s', caption: 'Velocity is measured in m/s' },
  ], substitution: 'p = kg × m/s', finalResult: '1 kg·m/s = 1 kg × m/s' },
];

function derivationToExample(d: Derivation): ExampleItem {
  const eqLine = `${d.resultSymbol} = ${d.vars.map((v) => v.letter).join(d.operators[0] ?? ' ')}`;
  const varSteps = d.vars.map((v) => `${v.caption} (${v.letter} = ${v.unit || 'no unit'}).`);
  const subStep = `Substitute the units: ${d.substitution}.`;
  return {
    question: eqLine,
    steps: [...varSteps, subStep],
    answer: d.finalResult,
  };
}

type StepKind =
  | 'eqSymbol' | 'eqVar' | 'eqOp' | 'preRiserPause'
  | 'riserFly' | 'riserCaption' | 'riserUnit' | 'riserPause'
  | 'substitution' | 'result' | 'hold';

interface Step {
  kind: StepKind;
  varIndex?: number;
}

function buildSteps(d: Derivation): Step[] {
  const steps: Step[] = [{ kind: 'eqSymbol' }];
  d.vars.forEach((_, i) => {
    steps.push({ kind: 'eqVar', varIndex: i });
    if (i < d.vars.length - 1) steps.push({ kind: 'eqOp', varIndex: i });
  });
  steps.push({ kind: 'preRiserPause' });
  d.vars.forEach((_, i) => {
    steps.push({ kind: 'riserFly', varIndex: i });
    steps.push({ kind: 'riserCaption', varIndex: i });
    steps.push({ kind: 'riserUnit', varIndex: i });
    steps.push({ kind: 'riserPause' });
  });
  steps.push({ kind: 'substitution' }, { kind: 'result' }, { kind: 'hold' });
  return steps;
}

function stepDuration(s: Step, d: Derivation): number {
  switch (s.kind) {
    case 'eqSymbol': return (d.resultSymbol.length + 3) * 40;
    case 'eqVar': return 400;
    case 'eqOp': return (d.operators[s.varIndex!]?.length ?? 3) * 40;
    case 'preRiserPause': return 400;
    case 'riserFly': return 700;
    case 'riserCaption': return d.vars[s.varIndex!].caption.length * 40;
    case 'riserUnit': return (` = ${d.vars[s.varIndex!].unit}`).length * 40;
    case 'riserPause': return 400;
    case 'substitution': return d.substitution.length * 40;
    case 'result': return d.finalResult.length * 40;
    case 'hold': return 3200;
  }
}

const isTypewriterStep = (kind: StepKind) =>
  kind === 'eqSymbol' || kind === 'eqOp' || kind === 'riserCaption' || kind === 'riserUnit' || kind === 'substitution' || kind === 'result';

// Equation sits in a fixed left column; risers "dock" near where their
// letter roughly sits in that equation, then glide right into a vertical
// stack whose rows (one per variable, plus substitution, plus result)
// are evenly spaced — this scales cleanly to 1, 2, or 3 variables without
// ever running past the right edge of the card.
const EQN_POS = { top: '46%', left: '4%' };
const STACK_LEFT = 44;
const CAPTION_LEFT = 56;
const CAPTION_WIDTH = 40;

const dockLeftFor = (i: number, total: number) => {
  if (total <= 1) return 22;
  const start = 14, end = 34;
  return start + (i * (end - start)) / (total - 1);
};
const rowTop = (rowIndex: number, totalRows: number) => {
  if (totalRows <= 1) return 50;
  const start = 12, end = 88;
  return start + (rowIndex * (end - start)) / (totalRows - 1);
};

export const WhiteboardBuild: React.FC<{ derivation: Derivation }> = ({ derivation }) => {
  const steps = React.useMemo(() => buildSteps(derivation), [derivation]);
  const durations = React.useMemo(() => steps.map((s) => stepDuration(s, derivation)), [steps, derivation]);
  const cum = React.useMemo(() => {
    const acc: number[] = [];
    durations.forEach((d, i) => acc.push(i === 0 ? 0 : acc[i - 1] + durations[i - 1]));
    return acc;
  }, [durations]);
  const total = (cum[cum.length - 1] ?? 0) + (durations[durations.length - 1] ?? 1);

  const findStep = (kind: StepKind, varIndex?: number) =>
    steps.findIndex((s) => s.kind === kind && (varIndex === undefined || s.varIndex === varIndex));

  const totalRows = derivation.vars.length + 2;

  const [cycle, setCycle] = useState(0);
  const [step, setStep] = useState(0);
  const [landed, setLanded] = useState<boolean[]>(() => new Array(derivation.vars.length).fill(false));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const speedRef = useRef(1);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    setStep(0);
    setLanded(new Array(derivation.vars.length).fill(false));
    setCycle((c) => c + 1);
  }, [derivation]);

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
    setLanded(derivation.vars.map((_, i) => p >= findStep('riserFly', i)));
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

  // Advance non-typewriter steps on a timer; typewriter steps advance via onDone.
  useEffect(() => {
    if (!isPlaying) return;
    const s = steps[step];
    if (!s || isTypewriterStep(s.kind)) return;
    const dur = durations[step] ?? 400;
    const t = setTimeout(() => {
      if (s.kind === 'hold') {
        setStep(0);
        setLanded(new Array(derivation.vars.length).fill(false));
        setCycle((c) => c + 1);
      } else {
        setStep((p) => p + 1);
      }
    }, dur / speed);
    return () => clearTimeout(t);
  }, [step, isPlaying, speed, steps, durations, derivation.vars.length]);

  // Kick a riser into flight the instant its step is reached.
  useEffect(() => {
    const s = steps[step];
    if (!s || s.kind !== 'riserFly' || !isPlaying) return;
    const idx = s.varIndex!;
    const innerRef: { current: number | null } = { current: null };
    const raf1 = requestAnimationFrame(() => {
      innerRef.current = requestAnimationFrame(() => {
        setLanded((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (innerRef.current !== null) cancelAnimationFrame(innerRef.current);
    };
  }, [step, isPlaying, steps]);

  const advance = () => setStep((p) => p + 1);

  return (
    <div className="relative z-10 mb-6 -mx-3 overflow-visible rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-8 sm:-mx-5 sm:px-10 md:-mx-8 lg:-mx-10">
      <style>{whiteboardKeyframes}</style>

      <div className="mb-5 flex items-center gap-3">
        <button
          onClick={() => setIsPlaying((p) => !p)}
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
            onClick={() => setSpeedMenuOpen((o) => !o)}
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
                {[0.5, 1, 1.5, 2].map((s) => (
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

      {/* Desktop: flying-letters derivation */}
      <div key={cycle} className="relative mx-auto hidden min-h-[280px] max-w-2xl sm:block">
        <div className="ga-ink absolute -translate-y-1/2 text-2xl font-bold text-blue-900 sm:text-4xl" style={EQN_POS}>
          <Typewriter text={`${derivation.resultSymbol} = `} active={step === findStep('eqSymbol') && isPlaying} onDone={advance} />
          {derivation.vars.map((v, i) => (
            <React.Fragment key={i}>
              {step >= findStep('eqVar', i) && <span style={{ animation: 'wbPop 0.4s ease-out both' }}>{v.letter}</span>}
              {i < derivation.vars.length - 1 && step >= findStep('eqOp', i) && (
                <Typewriter text={derivation.operators[i]} active={step === findStep('eqOp', i) && isPlaying} onDone={advance} />
              )}
            </React.Fragment>
          ))}
        </div>

        {derivation.vars.map((v, i) => {
          const flyIdx = findStep('riserFly', i);
          if (step < flyIdx) return null;
          const dock = { top: '46%', left: `${dockLeftFor(i, derivation.vars.length)}%` };
          const slot = { top: `${rowTop(i, totalRows)}%`, left: `${STACK_LEFT}%` };
          return (
            <span
              key={i}
              className="ga-ink pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-xl font-bold text-red-500 sm:text-2xl"
              style={{ ...(landed[i] ? slot : dock), transition: `top ${700 / speed}ms ease-in-out, left ${700 / speed}ms ease-in-out` }}
            >
              {v.letter}
              {step >= findStep('riserUnit', i) && (
                <Typewriter text={` = ${v.unit}`} active={step === findStep('riserUnit', i) && isPlaying} onDone={advance} />
              )}
            </span>
          );
        })}

        {derivation.vars.map((v, i) => {
          const capIdx = findStep('riserCaption', i);
          if (step < capIdx) return null;
          return (
            <div key={i} className="absolute -translate-y-1/2 text-left" style={{ top: `${rowTop(i, totalRows)}%`, left: `${CAPTION_LEFT}%`, width: `${CAPTION_WIDTH}%` }}>
              <Typewriter text={v.caption} active={step === capIdx && isPlaying} onDone={advance} className="ga-hand text-sm font-semibold text-slate-700 sm:text-base" />
            </div>
          );
        })}

        {step >= findStep('substitution') && (
          <div className="absolute -translate-y-1/2 text-left" style={{ top: `${rowTop(derivation.vars.length, totalRows)}%`, left: `${STACK_LEFT}%`, width: '50%' }}>
            <Typewriter text={derivation.substitution} active={step === findStep('substitution') && isPlaying} onDone={advance} className="ga-ink text-lg font-bold text-emerald-700 sm:text-xl" />
          </div>
        )}
        {step >= findStep('result') && (
          <div className="absolute -translate-y-1/2 text-left" style={{ top: `${rowTop(derivation.vars.length + 1, totalRows)}%`, left: `${STACK_LEFT}%`, width: '50%' }}>
            <Typewriter text={derivation.finalResult} active={step === findStep('result') && isPlaying} onDone={advance} className="ga-ink text-xl font-bold text-blue-900 sm:text-2xl" />
          </div>
        )}
      </div>

      {/* Mobile: plain stacked flow, no absolute positioning */}
      <div key={`${cycle}-mobile`} className="flex flex-col items-start gap-3 sm:hidden">
        <div className="ga-ink flex flex-wrap items-center gap-1 text-2xl font-bold text-blue-900">
          <Typewriter text={`${derivation.resultSymbol} = `} active={step === findStep('eqSymbol') && isPlaying} onDone={advance} />
          {derivation.vars.map((v, i) => (
            <React.Fragment key={i}>
              {step >= findStep('eqVar', i) && <span style={{ animation: 'wbPop 0.4s ease-out both' }}>{v.letter}</span>}
              {i < derivation.vars.length - 1 && step >= findStep('eqOp', i) && (
                <Typewriter text={derivation.operators[i]} active={step === findStep('eqOp', i) && isPlaying} onDone={advance} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step >= findStep('riserFly', 0) && (
          <div className="flex flex-col gap-2 border-l-4 border-red-200 pl-3" style={{ animation: 'wbPop 0.4s ease-out both' }}>
            {derivation.vars.map((v, i) => {
              if (step < findStep('riserFly', i)) return null;
              return (
                <div key={i} className="flex flex-wrap items-baseline gap-2">
                  <span className="ga-ink text-xl font-bold text-red-500">
                    {v.letter}
                    {step >= findStep('riserUnit', i) && (
                      <Typewriter text={` = ${v.unit}`} active={step === findStep('riserUnit', i) && isPlaying} onDone={advance} />
                    )}
                  </span>
                  {step >= findStep('riserCaption', i) && (
                    <Typewriter text={v.caption} active={step === findStep('riserCaption', i) && isPlaying} onDone={advance} className="ga-hand text-sm font-semibold text-slate-700" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {step >= findStep('substitution') && (
          <div className="flex flex-col gap-2 border-l-4 border-emerald-200 pl-3">
            <Typewriter text={derivation.substitution} active={step === findStep('substitution') && isPlaying} onDone={advance} className="ga-ink text-lg font-bold text-emerald-700" />
            {step >= findStep('result') && (
              <Typewriter text={derivation.finalResult} active={step === findStep('result') && isPlaying} onDone={advance} className="ga-ink text-2xl font-bold text-blue-900" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const DerivationExplorer: React.FC = () => {
  const [selectedId, setSelectedId] = useState(DERIVATIONS[0].id);
  const selected = DERIVATIONS.find((d) => d.id === selectedId) || DERIVATIONS[0];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {DERIVATIONS.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedId(d.id)}
            className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-bold transition ${
              d.id === selectedId
                ? 'border-emerald-600 bg-emerald-500 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
      <WhiteboardBuild key={selectedId} derivation={selected} />
    </div>
  );
};

/* ---- Generic animated worked-example engine (question -> steps -> answer) ---- */

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
  const durations = React.useMemo(() => steps.map((s) => exStepDuration(s, example)), [steps, example]);
  const cum = React.useMemo(() => {
    const acc: number[] = [];
    durations.forEach((d, i) => acc.push(i === 0 ? 0 : acc[i - 1] + durations[i - 1]));
    return acc;
  }, [durations]);
  const total = (cum[cum.length - 1] ?? 0) + (durations[durations.length - 1] ?? 1);

  const findStep = (kind: ExStepKind, idx?: number) =>
    steps.findIndex((s) => s.kind === kind && (idx === undefined || s.idx === idx));

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
        setStep((p) => Math.min(p + 1, steps.length - 1));
      }
    }, dur / speed);
    return () => clearTimeout(t);
  }, [step, isPlaying, speed, steps, durations]);

  return (
    <div className="relative z-10 mb-6 overflow-visible rounded-xl border-2 border-dashed border-slate-200 bg-white px-5 py-6 sm:px-8 sm:py-7">
      <style>{whiteboardKeyframes}</style>

      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setIsPlaying((p) => !p)}
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
            onClick={() => setSpeedMenuOpen((o) => !o)}
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
                {[0.5, 1, 1.5, 2].map((s) => (
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
            <span
              className="ga-ink inline-block text-lg font-bold text-slate-900"
              style={{ animation: 'wbRise 0.5s ease-out both' }}
            >
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

/* ---- DIAGRAM 1: Density Cube ---- */
/* ---- DIAGRAM 1: Density Cube ---- */

interface DensityCubeProps {
  mass?: string;
  volume?: string;
  density?: string;
}

export const DensityCube: React.FC<DensityCubeProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useThreeScene(mountRef, ({ scene, camera, THREE }) => {
    camera.position.set(3.2, 2.6, 4.8);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.y = 0.9;
    group.add(cube);

    const wire = new THREE.Mesh(
      new THREE.BoxGeometry(1.82, 1.82, 1.82),
      new THREE.MeshBasicMaterial({ color: 0x065f46, wireframe: true })
    );
    wire.position.y = 0.9;
    group.add(wire);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    group.add(floor);

    const labelMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
    const labelMat2 = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });

    const dot1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), labelMat);
    dot1.position.set(-1.1, 1.9, 0);
    group.add(dot1);

    const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), labelMat2);
    dot2.position.set(1.1, 1.9, 0);
    group.add(dot2);

    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    for (let i = 0; i < 18; i++) {
      const p = new THREE.Mesh(
        particleGeo,
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0xfbbf24 : 0x60a5fa,
          transparent: true,
          opacity: 0.5,
        })
      );
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.2 + Math.random() * 0.4;
      p.position.set(
        Math.sin(theta) * Math.cos(phi) * r,
        0.9 + Math.sin(phi) * r * 0.5,
        Math.sin(theta) * Math.sin(phi) * r
      );
      (p as any).userData = { theta, phi, r, speed: 0.2 + Math.random() * 0.3 };
      group.add(p);
    }

    return {
      onFrame: (t: number) => {
        group.rotation.y = t * 0.3;
        group.rotation.x = Math.sin(t * 0.15) * 0.08;
        group.children.forEach((child, i) => {
          const ud = (child as any).userData;
          if (ud && ud.theta !== undefined) {
            ud.theta += 0.005 * ud.speed;
            child.position.x = Math.sin(ud.theta) * Math.cos(ud.phi) * ud.r;
            child.position.z = Math.sin(ud.theta) * Math.sin(ud.phi) * ud.r;
            child.position.y = 0.9 + Math.sin(ud.phi) * ud.r * 0.5 + Math.sin(t * 0.5 + i) * 0.05;
          }
        });
      },
    };
  }, []);

  return <div ref={mountRef} className="h-56 w-full max-w-lg" />;
};

/* ---- DIAGRAM 2: Vector Addition ---- */

export const VectorDiagram: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useThreeScene(mountRef, ({ scene, camera, THREE }) => {
    camera.position.set(0, 3.8, 7.2);
    camera.lookAt(0, 0.2, 0);

    const group = new THREE.Group();
    scene.add(group);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    group.add(floor);

    const makeArrow = (
      from: THREE.Vector3,
      to: THREE.Vector3,
      color: number,
      headLength: number = 0.3,
      headWidth: number = 0.18
    ): THREE.ArrowHelper | null => {
      const dir = new THREE.Vector3().subVectors(to, from);
      const length = dir.length();
      if (length < 0.01) return null;
      dir.normalize();
      return new THREE.ArrowHelper(dir, from, length, color, headLength, headWidth);
    };

    const A = new THREE.Vector3(0, 0.2, 0);
    const B = new THREE.Vector3(1.2, 1.6, 0);
    const R = new THREE.Vector3().addVectors(A, B);

    const arrowA = makeArrow(new THREE.Vector3(0, 0.2, 0), A, 0x3b82f6, 0.35, 0.2);
    if (arrowA) group.add(arrowA);

    const arrowB = makeArrow(A, R, 0xf59e0b, 0.35, 0.2);
    if (arrowB) group.add(arrowB);

    let arrowR = makeArrow(new THREE.Vector3(0, 0.2, 0), R, 0xef4444, 0.4, 0.22);
    if (arrowR) group.add(arrowR);

    const makeLabel = (pos: THREE.Vector3, color: number): THREE.Mesh => {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshStandardMaterial({ color })
      );
      s.position.copy(pos);
      s.position.y += 0.25;
      return s;
    };

    group.add(makeLabel(A, 0x3b82f6));
    group.add(makeLabel(R, 0xef4444));

    return {
      onFrame: (t: number) => {
        group.rotation.y = Math.sin(t * 0.2) * 0.12;
        if (arrowR) {
          const scale = 1 + Math.sin(t * 1.8) * 0.02;
          arrowR.setLength(3.58 * scale, 0.4, 0.22);
        }
      },
    };
  }, []);

  return <div ref={mountRef} className="h-56 w-full max-w-lg" />;
};

/* ---- DIAGRAM 3: Circuit ---- */

export const CircuitDiagram: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useThreeScene(mountRef, ({ scene, camera, THREE }) => {
    camera.position.set(0, 2.8, 6.5);
    camera.lookAt(0, 0.2, 0);

    const group = new THREE.Group();
    scene.add(group);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    group.add(floor);

    const battMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
    const batt = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.7, 24), battMat);
    batt.position.set(-1.6, 0.35, 0);
    group.add(batt);

    const battTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    battTop.position.set(-1.6, 0.76, 0);
    group.add(battTop);

    const resMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
    const res = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.3), resMat);
    res.position.set(1.2, 0.15, 0);
    group.add(res);

    const bandColors = [0xf59e0b, 0x10b981, 0xef4444];
    bandColors.forEach((c, i) => {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.34, 0.34),
        new THREE.MeshStandardMaterial({ color: c })
      );
      band.position.set(1.2 - 0.2 + i * 0.2, 0.15, 0);
      group.add(band);
    });

    const wireMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    const wire1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), wireMat);
    wire1.rotation.z = Math.PI / 2;
    wire1.position.set(-0.8, 0.7, 0);
    group.add(wire1);

    const wire2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), wireMat);
    wire2.rotation.z = Math.PI / 2;
    wire2.position.set(0.8, 0.7, 0);
    group.add(wire2);

    const wire3 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), wireMat);
    wire3.rotation.z = Math.PI / 2;
    wire3.position.set(-0.8, -0.4, 0);
    group.add(wire3);

    const wire4 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), wireMat);
    wire4.rotation.z = Math.PI / 2;
    wire4.position.set(0.8, -0.4, 0);
    group.add(wire4);

    const amm = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
    );
    amm.position.set(-0.8, 0.15, 0.5);
    group.add(amm);

    const volt = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0x10b981 })
    );
    volt.position.set(0.8, 0.15, 0.5);
    group.add(volt);

    return {
      onFrame: (t: number) => {
        group.rotation.y = Math.sin(t * 0.18) * 0.1;
        const glow = 0.7 + Math.sin(t * 1.6) * 0.3;
        (amm.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x3b82f6);
        (amm.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * 0.2;
        (volt.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x10b981);
        (volt.material as THREE.MeshStandardMaterial).emissiveIntensity = glow * 0.2;
      },
    };
  }, []);

  return <div ref={mountRef} className="h-56 w-full max-w-lg" />;
};

/* ---- DIAGRAM 4: Density Balance (interactive) ---- */

interface CupHandle {
  holder: THREE.Group;
  instanced: THREE.InstancedMesh;
  particleBaseY: number;
}

function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const t = Math.max(0, Math.min(1, (v - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}

function generateDensityParticles(density: number, maxCount: number = 60) {
  const count = Math.round(mapRange(density, 100, 3000, 6, maxCount));
  const radius = mapRange(density, 100, 3000, 0.05, 0.075);
  const cylRadius = 0.5;
  const fillFrac = mapRange(density, 100, 3000, 0.28, 0.92);
  const fillHeight = 1.0 * fillFrac;
  const positions: { x: number; y: number; z: number; scale: number }[] = [];

  for (let i = 0; i < count; i++) {
    let placed = false;
    let attempt = 0;
    while (!placed && attempt < 24) {
      attempt++;
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * Math.max(0.02, cylRadius - radius - 0.02);
      const x = Math.cos(a) * rr;
      const z = Math.sin(a) * rr;
      const y = radius + Math.random() * Math.max(0.02, fillHeight - radius * 2);
      let ok = true;
      for (const p of positions) {
        const dx = p.x - x, dy = p.y - y, dz = p.z - z;
        const minDist = (radius + p.scale) * 0.92;
        if (dx * dx + dy * dy + dz * dz < minDist * minDist) { ok = false; break; }
      }
      if (ok) {
        positions.push({ x, y, z, scale: radius });
        placed = true;
      }
    }
    if (!placed) {
      const a = Math.random() * Math.PI * 2;
      const rr = Math.sqrt(Math.random()) * Math.max(0.02, cylRadius - radius - 0.02);
      positions.push({ x: Math.cos(a) * rr, y: radius + Math.random() * fillHeight, z: Math.sin(a) * rr, scale: radius });
    }
  }
  return positions;
}

export const DensityBalanceDiagram: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ setDensity: (side: 'left' | 'right', density: number) => void } | null>(null);
  const [leftDensity, setLeftDensity] = useState(700);
  const [rightDensity, setRightDensity] = useState(2500);

  useThreeScene(mountRef, ({ scene, camera, THREE }) => {
    camera.position.set(0, 3.3, 8.4);
    camera.lookAt(0, 1.3, 0);

    const triShape = new THREE.Shape();
    triShape.moveTo(-1.15, 0);
    triShape.lineTo(1.15, 0);
    triShape.lineTo(0, 1.7);
    triShape.lineTo(-1.15, 0);
    const fulcrumGeo = new THREE.ExtrudeGeometry(triShape, { depth: 0.9, bevelEnabled: false });
    fulcrumGeo.translate(0, 0, -0.45);
    const fulcrum = new THREE.Mesh(
      fulcrumGeo,
      new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.55 })
    );
    scene.add(fulcrum);

    const pivotY = 1.7;
    const plankGroup = new THREE.Group();
    plankGroup.position.set(0, pivotY, 0);
    scene.add(plankGroup);

    const plankHalfLength = 2.7;
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(plankHalfLength * 2, 0.22, 0.9),
      new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 })
    );
    plankGroup.add(plank);

    const cupRadius = 0.52;
    const cupHeight = 1.0;

    function makeCup(): CupHandle {
      const holder = new THREE.Group();
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(cupRadius, cupRadius, cupHeight, 32, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0x2dd4bf, transparent: true, opacity: 0.3, roughness: 0.2, side: THREE.DoubleSide,
        })
      );
      cup.position.y = cupHeight / 2 + 0.14;
      holder.add(cup);

      const rimMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, roughness: 0.3 });
      const rim = new THREE.Mesh(new THREE.TorusGeometry(cupRadius, 0.025, 8, 32), rimMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = cupHeight + 0.14;
      holder.add(rim);

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(cupRadius * 1.05, cupRadius * 1.05, 0.12, 32),
        rimMat
      );
      base.position.y = 0.06;
      holder.add(base);

      const instanced = new THREE.InstancedMesh(
        new THREE.SphereGeometry(1, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.35, metalness: 0.05 }),
        60
      );
      instanced.count = 0;
      holder.add(instanced);

      return { holder, instanced, particleBaseY: 0.14 };
    }

    const leftCup = makeCup();
    const rightCup = makeCup();
    leftCup.holder.position.set(-plankHalfLength + 0.6, 0.11, 0);
    rightCup.holder.position.set(plankHalfLength - 0.6, 0.11, 0);
    plankGroup.add(leftCup.holder);
    plankGroup.add(rightCup.holder);

    const dummy = new THREE.Object3D();
    function updateCupDensity(cup: CupHandle, density: number) {
      const positions = generateDensityParticles(density);
      positions.forEach((p, i) => {
        dummy.position.set(p.x, p.y + cup.particleBaseY, p.z);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        cup.instanced.setMatrixAt(i, dummy.matrix);
      });
      cup.instanced.count = positions.length;
      cup.instanced.instanceMatrix.needsUpdate = true;
    }

    updateCupDensity(leftCup, leftDensity);
    updateCupDensity(rightCup, rightDensity);

    const maxAngle = 0.38;
    const kAngle = maxAngle / 2900;
    const angleState = { current: 0, velocity: 0, target: 0 };
    let curLeft = leftDensity;
    let curRight = rightDensity;

    const recomputeTarget = () => {
      const diff = curLeft - curRight;
      angleState.target = Math.max(-maxAngle, Math.min(maxAngle, diff * kAngle));
    };
    recomputeTarget();

    apiRef.current = {
      setDensity: (side, density) => {
        if (side === 'left') { curLeft = density; updateCupDensity(leftCup, density); }
        else { curRight = density; updateCupDensity(rightCup, density); }
        recomputeTarget();
      },
    };

    return {
      onFrame: () => {
        const stiffness = 0.05;
        const damping = 0.82;
        angleState.velocity += (angleState.target - angleState.current) * stiffness;
        angleState.velocity *= damping;
        angleState.current += angleState.velocity;
        plankGroup.rotation.z = angleState.current;
        leftCup.holder.rotation.z = -angleState.current;
        rightCup.holder.rotation.z = -angleState.current;
      },
      cleanup: () => {
        apiRef.current = null;
      },
    };
  }, []);

  useEffect(() => { apiRef.current?.setDensity('left', leftDensity); }, [leftDensity]);
  useEffect(() => { apiRef.current?.setDensity('right', rightDensity); }, [rightDensity]);

  const describeDensity = (d: number) => (d < 900 ? 'Low density' : d > 1800 ? 'High density' : 'Medium density');

  return (
    <div className="relative z-10 mb-8 -mx-3 sm:-mx-5 md:-mx-8 lg:-mx-10">
      <h4 className="mb-2 text-center text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        DENSITY
      </h4>
      <div className="relative">
        <div ref={mountRef} className="h-[340px] w-full sm:h-[420px]" />

        <div
          className="pointer-events-none absolute left-[14%] top-[8%] -translate-x-1/2 rounded-xl px-3 py-1.5 text-xs font-bold shadow-md transition-colors duration-300 sm:left-[18%] sm:text-sm"
          style={{
            backgroundColor: leftDensity < 900 ? '#0d9488' : leftDensity > 1800 ? '#dc2626' : '#d97706',
            color: '#fff',
          }}
        >
          {describeDensity(leftDensity)}
          <span
            className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent"
            style={{ borderTopColor: leftDensity < 900 ? '#0d9488' : leftDensity > 1800 ? '#dc2626' : '#d97706' }}
          />
        </div>

        <div
          className="pointer-events-none absolute right-[14%] top-[8%] translate-x-1/2 rounded-xl px-3 py-1.5 text-xs font-bold shadow-md transition-colors duration-300 sm:right-[18%] sm:text-sm"
          style={{
            backgroundColor: rightDensity < 900 ? '#0d9488' : rightDensity > 1800 ? '#dc2626' : '#d97706',
            color: '#fff',
          }}
        >
          {describeDensity(rightDensity)}
          <span
            className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent"
            style={{ borderTopColor: rightDensity < 900 ? '#0d9488' : rightDensity > 1800 ? '#dc2626' : '#d97706' }}
          />
        </div>
      </div>
      <div className="mx-auto mt-1 grid max-w-xl grid-cols-1 gap-5 px-3 sm:grid-cols-2 sm:px-0">
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">Left cup</span>
            <span className="ga-ink font-bold text-teal-700">{Math.round(leftDensity)} kg/m³</span>
          </div>
          <input
            type="range"
            min={100}
            max={3000}
            step={10}
            value={leftDensity}
            onChange={(e) => setLeftDensity(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <div className="mt-0.5 text-xs font-semibold text-slate-500">{describeDensity(leftDensity)}</div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">Right cup</span>
            <span className="ga-ink font-bold text-teal-700">{Math.round(rightDensity)} kg/m³</span>
          </div>
          <input
            type="range"
            min={100}
            max={3000}
            step={10}
            value={rightDensity}
            onChange={(e) => setRightDensity(Number(e.target.value))}
            className="w-full accent-teal-600"
          />
          <div className="mt-0.5 text-xs font-semibold text-slate-500">{describeDensity(rightDensity)}</div>
        </div>
      </div>
      <p className="mt-3 text-center text-sm italic text-slate-500">
        Drag the sliders — the denser side sinks, just like a real balance.
      </p>
    </div>
  );
};

/* ========================================================================
   CONTENT DATA
   ======================================================================== */

const sections: Section[] = [
  {
    id: 'quantities',
    eyebrow: 'Chapter 1.1',
    title: 'Physical Quantities & SI Units',
    heading: 'Physical Quantities and SI Units',
    intro:
      'A physical quantity is anything that can be measured — it has a number and a unit. ' +
      'For example, 5 metres, 2 kilograms, and 10 seconds are all physical quantities. ' +
      'The number tells you how many, and the unit tells you what kind of quantity it is.',
    intro2:
      'Scientists all over the world use the same system of units, called the International System of Units (SI). ' +
      'This means a kilogram in Harare is the same as a kilogram in London or Tokyo. ' +
      'SI units are the foundation of all scientific measurement.',
    method: {
      title: 'SI Base Units — The Seven Fundamental Quantities',
      kind: 'rules',
      rules: [
        { rule: 'Length — metre (m)', example: 'The distance between two points.' },
        { rule: 'Mass — kilogram (kg)', example: 'The amount of matter in an object.' },
        { rule: 'Time — second (s)', example: 'The duration of an event.' },
        { rule: 'Electric current — ampere (A)', example: 'The flow of electric charge.' },
        { rule: 'Temperature — kelvin (K)', example: 'How hot or cold something is.' },
        { rule: 'Amount of substance — mole (mol)', example: 'The number of particles in a sample.' },
        { rule: 'Luminous intensity — candela (cd)', example: 'The brightness of a light source.' },
      ],
    },
    method2: {
      title: 'Other Useful Points About SI Units',
      kind: 'rules',
      rules: [
        { rule: 'SI units are universal.', example: 'A kilogram or a second means the same thing anywhere in the world.' },
        { rule: 'Every base unit has one clear definition.', example: 'This avoids confusion between different measuring systems (e.g. metric vs imperial).' },
        { rule: 'Prefixes scale units up or down.', example: 'kilo- (×1000)\ncenti- (÷100)\nmilli- (÷1000)\ne.g. 1 km = 1000 m' },
        { rule: 'All other units are "derived" from these seven.', example: 'Combining base units through multiplication or division gives you every other unit in physics.' },
      ],
    },
    method3: {
      title: 'Expressing Common Quantities in SI Base Units',
      rows: [
        { text: 'Force', unit: 'newton (N)', formula: 'kg·m/s²' },
        { text: 'Energy / Work', unit: 'joule (J)', formula: 'kg·m²/s²' },
        { text: 'Power', unit: 'watt (W)', formula: 'kg·m²/s³' },
        { text: 'Electric potential', unit: 'volt (V)', formula: 'kg·m²/(s³·A)' },
        { text: 'Pressure', unit: 'pascal (Pa)', formula: 'kg/(m·s²)' },
        { text: 'Frequency', unit: 'hertz (Hz)', formula: '1/s' },
        { text: 'Electric charge', unit: 'coulomb (C)', formula: 'A·s' },
        { text: 'Resistance', unit: 'ohm (Ω)', formula: 'kg·m²/(s³·A²)' },
        { text: 'Area', unit: 'm²', formula: 'm²' },
        { text: 'Volume', unit: 'm³', formula: 'm³' },
        { text: 'Density', unit: 'kg/m³', formula: 'kg/m³' },
        { text: 'Speed / Velocity', unit: 'm/s', formula: 'm/s' },
        { text: 'Acceleration', unit: 'm/s²', formula: 'm/s²' },
        { text: 'Momentum', unit: 'kg·m/s', formula: 'kg·m/s' },
      ],
    },
    keyFormula: {
      label: 'A physical quantity is always:',
      formula: 'Number × Unit',
    },
    examples: [
      {
        question: 'What are the SI base units for length, mass, and time?',
        steps: ['Length is measured in metres (m).', 'Mass is measured in kilograms (kg).', 'Time is measured in seconds (s).'],
        answer: 'metre (m), kilogram (kg), second (s)',
      },
      {
        question: 'The Newton (N) is a derived unit. Express it in terms of SI base units.',
        steps: [
          'Force = mass × acceleration (F = ma).',
          'Mass is measured in kilograms (kg).',
          'Acceleration is measured in m/s².',
          'So N = kg × m/s² = kg·m/s².',
        ],
        answer: '1 N = 1 kg·m/s²',
      },
    ],
    practice: [
      'List the seven SI base units and the physical quantities they measure.',
      'Express the joule (J) in terms of SI base units.',
      'What is the difference between a base unit and a derived unit? Give an example of each.',
      'A car travels at 25 m/s. What are the SI base units involved in this measurement?',
    ],
  },
  {
    id: 'density',
    eyebrow: 'Chapter 1.2',
    title: 'Density',
    heading: 'Density — How Tightly Packed is the Mass?',
    intro: '**Density means:** how much stuff is inside a certain amount of space.',
    intro2: 'That is all.',
    introMore: [
      'Something has **high density** when it has **a lot of stuff packed into a small space**.',
      'Something has **low density** when it has **little stuff spread out in a space**.',
    ],
    definition: 'Density is the **mass per unit volume** of a substance.',
    diagram: {
      type: 'densityBalance',
      bare: true,
    },
    method: {
      title: 'How to Calculate Density',
      rows: [
        { step: 1, formula: 'm = ?', text: 'Measure the mass of the object using a balance or scale.' },
        {
          step: 2,
          formula: 'V = ?',
          text: 'Measure the volume. For regular objects, use geometry. For irregular objects, use water displacement.',
        },
        { step: 3, formula: 'ρ = m / V', text: 'Divide the mass by the volume to get the density.' },
        { step: 4, formula: 'kg/m³ or g/cm³', text: 'Express your answer with the correct units.' },
      ],
    },
    workedAnimated: {
      title: 'Worked Examples — Step by Step',
      examples: [
        {
          question: 'A block of wood has a mass of 240 g and a volume of 300 cm³. Calculate its density.',
          steps: ['Mass (m) = 240 g.', 'Volume (V) = 300 cm³.', 'Density (ρ) = m ÷ V = 240 ÷ 300 = 0.8 g/cm³.'],
          answer: 'ρ = 0.8 g/cm³ (or 800 kg/m³)',
        },
        {
          question:
            'An irregular stone has a mass of 150 g. When placed in a measuring cylinder of water, the water level rises from 50 cm³ to 80 cm³. Find the density of the stone.',
          steps: [
            'Mass = 150 g.',
            'Volume of stone = volume of water displaced = 80 − 50 = 30 cm³.',
            'Density = 150 ÷ 30 = 5 g/cm³.',
          ],
          answer: 'ρ = 5 g/cm³ (or 5000 kg/m³)',
        },
        {
          question: 'A liquid fills a container with a volume of 400 cm³ and has a mass of 500 g. Calculate its density.',
          steps: [
            'Mass (m) = 500 g.',
            'Volume (V) = 400 cm³.',
            'Density (ρ) = m ÷ V = 500 ÷ 400 = 1.25 g/cm³.',
          ],
          answer: 'ρ = 1.25 g/cm³ (or 1250 kg/m³)',
        },
      ],
    },
    keyFormula: {
      label: 'The density formula:',
      formula: <>ρ = <Fraction numerator="m" denominator="V" /></>,
    },
    examples: [
      {
        question: 'A block of wood has a mass of 240 g and a volume of 300 cm³. Calculate its density.',
        steps: ['__computation__'],
        answer: 'ρ = 0.8 g/cm³ (or 800 kg/m³)',
        computation: {
          vars: [
            { symbol: 'm', label: 'Mass', value: '240', unit: 'g' },
            { symbol: 'V', label: 'Volume', value: '300', unit: 'cm³' },
          ],
          numerator: 'm',
          denominator: 'V',
          dividend: 240,
          divisor: 300,
          resultUnit: 'g/cm³',
        },
      },
      {
        question:
          'An irregular stone has a mass of 150 g. When placed in a measuring cylinder of water, the water level rises from 50 cm³ to 80 cm³. Find the density of the stone.',
        steps: ['__computation__'],
        answer: 'ρ = 5 g/cm³ (or 5000 kg/m³)',
        computation: {
          vars: [
            { symbol: 'm', label: 'Mass', value: '150', unit: 'g' },
            { symbol: 'V', label: 'Volume', value: '30', unit: 'cm³ (80 − 50)' },
          ],
          numerator: 'm',
          denominator: 'V',
          dividend: 150,
          divisor: 30,
          resultUnit: 'g/cm³',
        },
      },
    ],
    practice: [
      'A cube of side 2 cm has a mass of 56 g. Calculate its density.',
      'A liquid has a mass of 180 g and occupies a volume of 150 cm³. What is its density?',
      'An irregular object has a mass of 320 g. It displaces 40 cm³ of water. Find its density.',
      'A metal cylinder has a radius of 3 cm and a height of 10 cm. Its mass is 2.5 kg. Calculate its density in g/cm³.',
    ],
  },
  {
    id: 'scalars-vectors',
    eyebrow: 'Chapter 1.3',
    title: 'Scalars & Vectors',
    heading: 'Scalars and Vectors — Magnitude and Direction',
    intro:
      'Some quantities in physics are fully described by just a number and a unit — these are called scalar quantities. ' +
      'Other quantities need both a number and a direction to be fully understood — these are called vector quantities.',
    intro2:
      'For example, 5 kilometres is a scalar — it just tells you the distance. ' +
      'But 5 kilometres north is a vector — it tells you both how far and in which direction. ' +
      'Vectors are essential for describing forces, velocities, and many other physical phenomena.',
    diagram: {
      type: 'vectors',
      title: 'Adding Two Vectors to Find a Resultant',
      caption: 'The blue arrow + the yellow arrow = the red resultant vector. This is the triangle method.',
      props: {},
    },
    method: {
      title: 'Scalar vs Vector — Key Differences',
      kind: 'rules',
      rules: [
        { rule: 'Scalar: magnitude only.', example: 'mass, distance, speed, time, energy, temperature' },
        { rule: 'Vector: magnitude AND direction.', example: 'displacement, velocity, acceleration, force, momentum' },
        { rule: 'Adding scalars is simple arithmetic.', example: '5 kg + 3 kg = 8 kg' },
        { rule: 'Adding vectors must consider direction.', example: '5 N north + 3 N south = 2 N north' },
      ],
    },
    method2: {
      title: 'Finding the Resultant Vector — Graphical Method',
      rows: [
        { step: 1, formula: 'Draw to scale', text: 'Choose a suitable scale (e.g. 1 cm = 1 N) and draw the first vector.' },
        { step: 2, formula: 'Tip-to-tail', text: 'Place the tail of the second vector at the tip of the first vector.' },
        {
          step: 3,
          formula: 'Complete the triangle',
          text: 'Draw a line from the tail of the first vector to the tip of the last vector — this is the resultant.',
        },
        {
          step: 4,
          formula: 'Measure',
          text: 'Measure the length of the resultant and its angle to find the magnitude and direction.',
        },
      ],
    },
    keyFormula: {
      label: 'The resultant vector is the single vector that has the same effect as:',
      formula: 'R = A + B   (vector addition)',
    },
    examples: [
      {
        question: 'A force of 6 N acts east, and a force of 8 N acts north. Find the resultant force.',
        steps: [
          'Draw a right-angled triangle with 6 cm east and 8 cm north.',
          'The resultant is the hypotenuse.',
          'Magnitude = √(6² + 8²) = √(36 + 64) = √100 = 10 N.',
          'Direction = tan⁻¹(8/6) = 53.1° north of east.',
        ],
        answer: '10 N at 53.1° north of east',
      },
      {
        question: 'A boy walks 3 km east, then 4 km south. What is his displacement from the starting point?',
        steps: [
          'Draw a right-angled triangle with 3 km east and 4 km south.',
          'Resultant = √(3² + 4²) = √25 = 5 km.',
          'Direction = tan⁻¹(4/3) = 53.1° south of east.',
        ],
        answer: '5 km at 53.1° south of east',
      },
    ],
    practice: [
      'Distinguish between scalar and vector quantities. Give two examples of each.',
      'A force of 10 N acts east and a force of 10 N acts east. What is the resultant force?',
      'A force of 12 N acts north and a force of 5 N acts west. Find the resultant force.',
      'A car travels 5 km north, then 12 km east. What is its displacement from the start?',
    ],
  },
  {
    id: 'voltage-current',
    eyebrow: 'Chapter 1.4 (Form 4)',
    title: 'Voltage, Current & Resistance',
    heading: 'Voltage, Current, and Resistance — The Basics of Circuits',
    intro:
      'In Form 4, you extend your understanding of electricity to include voltage, current, and resistance. ' +
      'These three quantities are the foundation of all electrical circuits.',
    intro2:
      'Voltage (also called potential difference) is the "push" that makes charges move around a circuit. ' +
      'Current is the rate at which charges flow. Resistance is the opposition to the flow of current. ' +
      'Together, they are related by Ohm\'s Law.',
    diagram: {
      type: 'circuit',
      title: 'A Simple Circuit with Battery, Resistor, Ammeter, and Voltmeter',
      caption: 'The ammeter (blue) measures current. The voltmeter (green) measures voltage across the resistor.',
      props: {},
    },
    method: {
      title: 'Definitions of Voltage, Current, and Resistance',
      kind: 'rules',
      rules: [
        {
          rule: 'Voltage (V) — the energy given to each coulomb of charge.',
          example: 'Measured in volts (V). Also called potential difference (p.d.).',
        },
        {
          rule: 'Current (I) — the rate of flow of charge.',
          example: 'Measured in amperes (A). 1 A = 1 coulomb per second.',
        },
        {
          rule: 'Resistance (R) — the opposition to current flow.',
          example: 'Measured in ohms (Ω). Higher resistance = less current for the same voltage.',
        },
      ],
    },
    method2: {
      title: "Ohm's Law — The Relationship Between V, I, and R",
      rows: [
        { step: 1, formula: 'V = I × R', text: "Voltage (V) = Current (I) × Resistance (R). This is Ohm's Law." },
        {
          step: 2,
          formula: 'I = V / R',
          text: 'Current = Voltage ÷ Resistance. If you increase voltage, current increases.',
        },
        {
          step: 3,
          formula: 'R = V / I',
          text: 'Resistance = Voltage ÷ Current. You can find the resistance of a component by measuring V and I.',
        },
        {
          step: 4,
          formula: 'Ohmic conductors',
          text: 'A conductor that obeys Ohm\'s Law has a constant resistance (e.g. a metal wire at constant temperature).',
        },
      ],
    },
    keyFormula: {
      label: "Ohm's Law:",
      formula: 'V = I × R',
    },
    examples: [
      {
        question: 'A resistor has a voltage of 12 V across it and a current of 2 A flowing through it. Calculate its resistance.',
        steps: ['Voltage (V) = 12 V.', 'Current (I) = 2 A.', 'Resistance (R) = V ÷ I = 12 ÷ 2 = 6 Ω.'],
        answer: 'R = 6 Ω',
      },
      {
        question: 'A circuit has a resistance of 10 Ω and a voltage of 230 V. Calculate the current.',
        steps: ['Voltage (V) = 230 V.', 'Resistance (R) = 10 Ω.', 'Current (I) = V ÷ R = 230 ÷ 10 = 23 A.'],
        answer: 'I = 23 A',
      },
    ],
    practice: [
      'Define voltage, current, and resistance. Give the unit for each.',
      'A 12 V battery is connected to a 4 Ω resistor. What is the current?',
      'A current of 0.5 A flows through a resistor with a voltage of 6 V. What is the resistance?',
      'Explain why a metal wire at constant temperature is called an "ohmic conductor."',
    ],
  },
];

/* ========================================================================
   SECTION COMPONENT
   ======================================================================== */

interface SectionProps {
  section: Section;
}

const Section: React.FC<SectionProps> = ({ section }) => {
  const renderDiagram = (diagram?: DiagramConfig): ReactNode => {
    if (!diagram) return null;
    switch (diagram.type) {
      case 'density':
        return <DensityCube {...diagram.props} />;
      case 'vectors':
        return <VectorDiagram {...diagram.props} />;
      case 'circuit':
        return <CircuitDiagram {...diagram.props} />;
      case 'densityBalance':
        return <DensityBalanceDiagram />;
      default:
        return null;
    }
  };

  return (
    <section id={section.id} className="mb-16 scroll-mt-24">
      <div className="relative mb-6 -mx-3 overflow-hidden rounded-none border-0 bg-transparent shadow-none sm:-mx-5 md:-mx-8 lg:-mx-10">
        {/* Top thin navy strip */}
        <div className="h-2 w-full bg-[#0d2c45]" />
        <div className="relative flex min-h-[70px] items-center">
          {/* Dark Navy Badge - Flat left side (0px), rounded bottom-right corner */}
          <div className="relative z-10 flex items-center rounded-none rounded-br-[32px] bg-[#0d2c45] py-3 pl-5 pr-8 text-white sm:rounded-br-[40px] sm:py-4 sm:pl-6 sm:pr-10">
            {/* 3D Hexagon/Cube Logo Icon */}
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
            <DiagramFrame title={section.diagram.title} caption={section.diagram.caption}>
              {renderDiagram(section.diagram)}
            </DiagramFrame>
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

        {section.method3 && (
          <div className="mb-6">
            <TitleBanner>{section.method3.title}</TitleBanner>
            <DerivationExplorer />
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                            <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="w-10 border-b border-slate-200 px-4 py-2.5 font-bold text-slate-600">#</th>
                    <th className="border-b border-slate-200 px-4 py-2.5 font-bold text-slate-600">Quantity</th>
                    <th className="border-b border-slate-200 px-4 py-2.5 font-bold text-slate-600">Unit</th>
                    <th className="border-b border-slate-200 px-4 py-2.5 font-bold text-slate-600">In SI Base Units</th>
                  </tr>
                </thead>
                <tbody>
                  {section.method3.rows?.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="border-b border-slate-100 px-4 py-3 align-top font-bold text-emerald-500 last:border-0">
                        {i + 1}.
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 align-top font-semibold text-slate-800 last:border-0">
                        {r.text}
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3 align-top text-slate-600 last:border-0">
                        {r.unit}
                      </td>
                      <td className="ga-ink border-b border-slate-100 px-4 py-3 align-top text-blue-800 last:border-0">
                        {r.formula}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section.keyFormula && <KeyFormula label={section.keyFormula.label} formula={section.keyFormula.formula} />}
      </div>

      <div className="mb-8">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Worked Examples — Step by Step</h3>
        <WorkedExampleExplorer examples={section.examples} />
      </div>

      <PracticeZone items={section.practice} />
    </section>
  );
};

/* ========================================================================
   MAIN EXPORT
   ======================================================================== */

export const MeasurementAndPhysicalQuantities: React.FC = () => {
  const [active, setActive] = useState<string>(sections[0].id);
  const [lang, setLang] = useState<'en' | 'sn'>('en');

  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
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

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 border-b-4 border-emerald-800 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40">
              TOPIC 1
            </span>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            Measurement &amp; Physical Quantities
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn'
              ? 'Zviyero, huwandu hwezvinhu, uye nhamba dzakatarwa. Muchitsauko chino, uchadzidza kuyera, kuverenga, uye kushandisa zviyero zvesayenzi.'
              : "Measurements, quantities, and the language of physics. In this chapter, you'll learn how to measure, calculate, and describe the physical world with precision and confidence."}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex min-w-0 flex-wrap items-center justify-start gap-1.5 pb-1 text-left sm:gap-2.5 mr-auto">
            {sections.map((s) => {
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
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">
            {activeIndex + 1} / {sections.length}
          </span>
          <button
            onClick={goNext}
            disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementAndPhysicalQuantities;