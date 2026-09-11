import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CircleHelp, LoaderCircle, Pause, Play, RotateCcw, X, Globe } from 'lucide-react';
import { requestGroqCompletion } from '../../../../../services/groq';

/* =========================================================================
   FONTS + SHARED STYLES
   ========================================================================= */
const InkStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .gc-hand { font-family: 'Patrick Hand', cursive; }
    .gc-ink { font-family: 'Kalam', cursive; }
    @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .gc-timeline { appearance: none; -webkit-appearance: none; height: 6px; border-radius: 999px; outline: none; }
    .gc-timeline::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 0; border-radius: 999px; background: #059669; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
    .gc-timeline::-moz-range-thumb { width: 18px; height: 18px; border: 0; border-radius: 999px; background: #059669; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
    .gc-paper { background-image: repeating-linear-gradient(#fbfaf6, #fbfaf6 26px, #e7e2d6 27px); background-position: 0 -2px; }
  `}</style>
);

/* =========================================================================
   FLAGS
   ========================================================================= */
export const UkFlag = ({ className = 'h-4 w-6' }: { className?: string }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="uk-clip-t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#uk-clip-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

export const ZwFlag = ({ className = 'h-4 w-6' }: { className?: string }) => (
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
    <path d="M 6.8 12.8 C 7.5 12 8.5 12.3 8.7 13 C 8.5 14 7.2 14.8 7.5 16 L 8.5 16.5 L 6.5 16.5 Z" fill="#ffd200" />
  </svg>
);

/* =========================================================================
   MATH-LINE MARKUP HELPERS (always guaranteed single-line equation)
   ========================================================================= */
const T = (value: string) => ({ type: 'text', value });

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lineLength = (seg: { type: string; value: string }[]) => seg.reduce((sum, s) => sum + s.value.length, 0);

let stepUid = 0;
const nextStepId = () => `cs${stepUid++}`;

const mkStep = (
  seg: any[],
  note: string,
  opts: { duration?: number; isFinal?: boolean; diagram?: (p: number, ctx?: any) => any; noteShona?: string } = {},
) => {
  const len = lineLength(seg);
  return {
    id: nextStepId(),
    seg,
    note,
    noteShona: opts.noteShona,
    duration: opts.duration ?? Math.max(2200, len * 90),
    isFinal: opts.isFinal ?? false,
    diagram: opts.diagram ?? null,
  };
};

const glyphMetrics = (character: string) => {
  if (/\s/.test(character)) return { cssWidth: 0.32, viewWidth: 10 };
  if (/[1ilI.,'()]/.test(character)) return { cssWidth: 0.4, viewWidth: 13 };
  if (/[mwMW]/.test(character)) return { cssWidth: 0.9, viewWidth: 28 };
  return { cssWidth: 0.66, viewWidth: 21 };
};

const HandwrittenRun = ({ value, progress, compact = false }: { value: string; progress: number; compact?: boolean }) => {
  const tokens = value.split(/(\s+)/).filter(Boolean);
  const totalCharacters = Array.from(value).length;
  let characterOffset = 0;
  return (
    <span className={`inline-flex shrink-0 flex-nowrap whitespace-nowrap items-baseline ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl xl:text-3xl'}`} aria-label={value}>
      {tokens.map((token, tokenIndex) => {
        const tokenCharacters = Array.from(token);
        const tokenStart = characterOffset;
        characterOffset += tokenCharacters.length;
        if (/^\s+$/.test(token)) {
          return <span key={tokenIndex} aria-hidden="true" className="h-px shrink-0 whitespace-pre" style={{ width: `${tokenCharacters.length * 0.34}em` }} />;
        }
        return (
          <span key={tokenIndex} className="inline-flex shrink-0 items-baseline whitespace-pre">
            {tokenCharacters.map((character, characterIndex) => {
              const glyphProgress = clamp01(progress * totalCharacters - tokenStart - characterIndex);
              const { cssWidth, viewWidth } = glyphMetrics(character);
              return (
                <svg key={characterIndex} aria-hidden="true" viewBox={`0 0 ${viewWidth} 30`} className={compact ? 'h-[1.3em] shrink-0 overflow-visible' : 'h-[1.45em] shrink-0 overflow-visible'} style={{ width: `${cssWidth}em` }}>
                  <text x="1" y="23" fontFamily="Kalam, cursive" fontSize={compact ? 23 : 26} fontWeight="700" fill="#1e3a8a"
                    fillOpacity={clamp01((glyphProgress - 0.72) / 0.28)} stroke="#1e3a8a" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="240" strokeDashoffset={240 * (1 - glyphProgress)}>
                    {character}
                  </text>
                </svg>
              );
            })}
          </span>
        );
      })}
    </span>
  );
};

const MathLine = ({ seg, progress, isFinal }: { seg: any[]; progress: number; isFinal?: boolean }) => {
  const total = lineLength(seg);
  const revealed = clamp01(progress) * total;
  let consumed = 0;
  const rendered = seg.map((s, i) => {
    const length = s.value.length;
    const localProgress = clamp01((revealed - consumed) / Math.max(1, length));
    consumed += length;
    return <HandwrittenRun key={i} value={s.value} progress={localProgress} />;
  });
  const safeProgress = clamp01(progress);
  const doneAndFinal = isFinal && safeProgress >= 1;
  return (
    <div className={`flex w-full min-w-0 max-w-full flex-nowrap whitespace-nowrap items-center overflow-x-auto overflow-y-hidden py-1.5 custom-scrollbar ${doneAndFinal ? 'border-b-4 border-double border-red-600 pb-1 pr-2' : ''}`}>
      {rendered}
    </div>
  );
};

/* =========================================================================
   GEOMETRY / "DRAWN BY HAND" DIAGRAM PRIMITIVES
   ========================================================================= */
const ptAt = (cx: number, cy: number, r: number, deg: number) => [
  cx + r * Math.cos((deg * Math.PI) / 180),
  cy + r * Math.sin((deg * Math.PI) / 180),
];

const DrawnLine = ({ x1, y1, x2, y2, progress, dashed = false, color = '#1e3a8a', strokeWidth = 3.5 }: any) => {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const p = clamp01(progress);
  if (dashed) return <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={color} strokeWidth={strokeWidth} strokeDasharray="7 5" strokeLinecap="round" />;
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={length} strokeDashoffset={length * (1 - p)} />;
};

const RulerGraphic = ({ x1, y1, x2, y2, progress }: any) => {
  if (progress <= 0.02 || progress >= 0.98) return null;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const nx = -dy / (len || 1), ny = dx / (len || 1);
  const offset = 10;
  const ox = x1 + nx * offset, oy = y1 + ny * offset;
  const placement = clamp01(progress / 0.22);
  const lift = clamp01((progress - 0.88) / 0.1);
  const movingX = ox - (1 - placement) * 32 + lift * 14;
  const movingY = oy + (1 - placement) * 22 - lift * 18;
  const movingAngle = angle - (1 - placement) * 12 + lift * 7;
  const width = 15;
  const tickCount = Math.max(4, Math.round(len / 16));
  const ticks = [];
  for (let i = 0; i <= tickCount; i += 1) {
    const t = (i / tickCount) * len;
    ticks.push(<line key={i} x1={t} y1={0} x2={t} y2={i % 5 === 0 ? width * 0.75 : width * 0.4} stroke="#92836b" strokeWidth="1" />);
  }
  return (
    <g transform={`translate(${movingX},${movingY}) rotate(${movingAngle})`} opacity={Math.max(0, Math.min(placement, 1 - lift)) * 0.92}>
      <rect x={-4} y={0} width={len + 8} height={width} rx={2} fill="#fdf3d7" stroke="#b9a679" strokeWidth="1" />
      {ticks}
    </g>
  );
};

const ProtractorGraphic = ({ cx, cy, rotationDeg = 0, progress }: any) => {
  if (progress <= 0.02 || progress >= 0.98) return null;
  const r = 42;
  const marks = Array.from({ length: 19 }).map((_, i) => {
    const deg = i * 10;
    const rad = (deg * Math.PI) / 180;
    const inner = i % 3 === 0 ? r - 10 : r - 5;
    return <line key={i} x1={-r * Math.cos(rad)} y1={-r * Math.sin(rad)} x2={-inner * Math.cos(rad)} y2={-inner * Math.sin(rad)} stroke="#3b82f6" strokeWidth="1" />;
  });
  return (
    <g transform={`translate(${cx},${cy}) rotate(${rotationDeg})`} opacity={0.85}>
      <path d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 Z`} fill="rgba(191,219,254,0.5)" stroke="#3b82f6" strokeWidth="1.5" />
      {marks}
    </g>
  );
};

const AngleArc = ({ cx, cy, r, startDeg, endDeg, progress, color = '#dc2626' }: any) => {
  const sweep = (endDeg - startDeg) * clamp01(progress);
  const [sx, sy] = ptAt(cx, cy, r, startDeg);
  const [ex, ey] = ptAt(cx, cy, r, startDeg + sweep);
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep >= 0 ? 1 : 0;
  return <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} ${sweepFlag} ${ex} ${ey}`} fill="none" stroke={color} strokeWidth="2.5" />;
};

const DiagramLabel = ({
  x,
  y,
  children,
  size = 15,
  weight = 'bold',
  color = '#171717',
  anchor = 'middle' as 'start' | 'middle' | 'end' | 'inherit',
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  weight?: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end' | 'inherit';
}) => (
  <g>
    <text
      x={x}
      y={y}
      className="gc-hand select-none"
      fontSize={size}
      fontWeight={weight}
      fill="white"
      stroke="white"
      strokeWidth={4.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      textAnchor={anchor}
      opacity={0.95}
    >
      {children}
    </text>
    <text
      x={x}
      y={y}
      className="gc-hand select-none"
      fontSize={size}
      fontWeight={weight}
      fill={color}
      textAnchor={anchor}
    >
      {children}
    </text>
  </g>
);

const combine = (...fns: any[]) => {
  const actions = fns.filter(Boolean);
  return (progress: number, ctx?: any) => (
    <>
      {actions.map((action, index) => (
        <g key={index}>{action(clamp01(progress * actions.length - index), ctx)}</g>
      ))}
    </>
  );
};

const drawSide = (p1: [number, number], p2: [number, number], opts: any = {}) => (progress: number, ctx?: any) => {
  if (opts.hideAfterStep !== undefined && ctx?.currentStepIndex !== undefined && ctx.currentStepIndex >= opts.hideAfterStep) {
    return null;
  }
  const drawingProgress = clamp01((progress - 0.22) / 0.66);
  return (
    <g>
      <RulerGraphic x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} progress={progress} />
      <DrawnLine x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} progress={drawingProgress} dashed={opts.dashed} color={opts.color} strokeWidth={opts.strokeWidth ?? 3.5} />
      {opts.label && progress >= 0.88 && (
        <DiagramLabel
          x={(p1[0] + p2[0]) / 2 + (opts.dx ?? 0)}
          y={(p1[1] + p2[1]) / 2 + (opts.dy ?? 0)}
          color={opts.color ?? '#1e3a8a'}
          size={opts.size ?? 16}
        >
          {opts.label}
        </DiagramLabel>
      )}
    </g>
  );
};

const markUnknown = (x: number, y: number, opts: { size?: number; anchor?: 'start' | 'middle' | 'end'; hideAfterStep?: number } = {}) => (
  progress: number,
  ctx?: any,
) => {
  if (progress <= 0.35) return null;
  if (opts.hideAfterStep !== undefined && ctx?.currentStepIndex !== undefined && ctx.currentStepIndex >= opts.hideAfterStep) {
    return null;
  }
  return (
    <DiagramLabel x={x} y={y} size={opts.size ?? 20} weight="bold" color="#dc2626" anchor={opts.anchor ?? 'middle'}>
      ?
    </DiagramLabel>
  );
};

const drawAngle = (center: [number, number], r: number, startDeg: number, endDeg: number, opts: any = {}) => (progress: number) => {
  const midDeg = opts.midDeg ?? (startDeg + (endDeg - startDeg) / 2);
  const midRad = (midDeg * Math.PI) / 180;
  const defaultDist = r * 0.58;
  const lx = opts.lx ?? Math.cos(midRad) * defaultDist;
  const ly = opts.ly ?? Math.sin(midRad) * defaultDist;
  const fontSize = opts.size ?? 11;

  return (
    <g>
      <ProtractorGraphic cx={center[0]} cy={center[1]} rotationDeg={opts.rotation ?? 0} progress={progress} />
      <AngleArc cx={center[0]} cy={center[1]} r={r} startDeg={startDeg} endDeg={endDeg} progress={progress} color={opts.color} />
      {opts.label && progress >= 0.95 && (
        <DiagramLabel
          x={center[0] + lx}
          y={center[1] + ly}
          size={fontSize}
          weight="bold"
          color={opts.color ?? '#dc2626'}
        >
          {opts.label}
        </DiagramLabel>
      )}
    </g>
  );
};

const showVertices = (points: any[]) => (progress: number) => progress > 0.05 ? (
  <g>
    {points.map((pt, i) => (
      <g key={i}>
        <circle cx={pt.x} cy={pt.y} r={3.5} fill="#171717" />
        <DiagramLabel x={pt.x + (pt.dx ?? 0)} y={pt.y + (pt.dy ?? 0)} size={18} color="#0f172a">{pt.label}</DiagramLabel>
      </g>
    ))}
  </g>
) : null;

const northArrow = (base: [number, number], len = 110) => (progress: number) => progress > 0.05 ? (
  <g opacity={0.85}>
    <line x1={base[0]} y1={base[1]} x2={base[0]} y2={base[1] - len} stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
    <path d={`M ${base[0]} ${base[1] - len} l -5 10 l 10 0 z`} fill="#475569" />
    <DiagramLabel x={base[0]} y={base[1] - len - 8} size={15} color="#475569">N</DiagramLabel>
  </g>
) : null;

/* =========================================================================
   AI STEP-EXPLANATION HELP
   ========================================================================= */
const AI_THINKING_WORDS = [
  'Delving', 'Pondering', 'Navigating', 'Unraveling', 'Elucidating', 'Deciphering', 'Charting', 'Weighing',
  'Cross-checking', 'Reasoning', 'Working through', 'Tracing', 'Untangling', 'Mapping out', 'Double-checking',
];

const serializeMathSegments = (segments: any[]) => segments.map((s) => s.value).join('');

type AiStepHelpResponse = { explanation: string[]; mathLines: string[] };

const parseStepHelpResponse = (raw: string): AiStepHelpResponse | null => {
  try {
    const withoutFence = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const objectStart = withoutFence.indexOf('{');
    const objectEnd = withoutFence.lastIndexOf('}');
    if (objectStart < 0 || objectEnd <= objectStart) return null;
    const parsed = JSON.parse(withoutFence.slice(objectStart, objectEnd + 1));
    const explanationSource = typeof parsed.explanation === 'string' ? [parsed.explanation] : parsed.explanation;
    const explanation = Array.isArray(explanationSource) ? explanationSource.filter((i) => typeof i === 'string' && i.trim()) : [];
    const mathLines = Array.isArray(parsed.mathLines) ? parsed.mathLines.filter((i) => typeof i === 'string') : [];
    if (explanation.length || mathLines.length) return { explanation, mathLines };
  } catch {
    // Retry on failure
  }
  return null;
};

const StepExplanationHelp = ({ question, stepsThroughCurrent, stepNumber, lang = 'en' }: any) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [response, setResponse] = useState<AiStepHelpResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading) { setThinkingIndex(0); return undefined; }
    const interval = window.setInterval(() => setThinkingIndex((c) => (c + 1) % AI_THINKING_WORDS.length), 850);
    return () => window.clearInterval(interval);
  }, [loading]);

  const askForExplanation = async () => {
    setOpen(true);
    if (response || loading) return;
    setLoading(true);
    setError('');

    const reachedWork = stepsThroughCurrent.map((step: any, index: number) => (
      `Step ${index + 1}: ${serializeMathSegments(step.seg)}\nReason: ${lang === 'sn' && step.noteShona ? step.noteShona : step.note}`
    )).join('\n\n');
    const selected = stepsThroughCurrent[stepsThroughCurrent.length - 1];

    try {
      const isShona = lang === 'sn';
      const messages = [
        {
          role: 'system' as const,
          content: isShona
            ? `You are Sidemann, a patient Zimbabwean mathematics tutor.
Explain only the selected worked-example step in clear, friendly ChiShona (for Zimbabwean students).
Keep the equations in standard mathematical notation.
Return only valid JSON in this exact shape:
{"explanation":["Chikamu chekutanga chetsananguro muchiShona","Chikamu chechipiri chetsananguro"],"mathLines":["= 5,29 + 44,89 − 21,17"]}`
            : `You are Sidemann, a patient Zimbabwean secondary-school mathematics tutor covering the cosine rule and triangle trigonometry.
Explain only the selected worked-example step. You receive the original question and only the work reached up to that step.
Never reveal or predict any later step.
Return only valid JSON in this exact shape:
{"explanation":["One short paragraph","Optional second short paragraph"],"mathLines":["= 5,29 + 44,89 − 21,17"]}`,
        },
        {
          role: 'user' as const,
          content: `Question: ${question}\n\nWork available:\n${reachedWork}\n\nExplain Step ${stepNumber} only: ${serializeMathSegments(selected.seg)}`,
        },
      ];
      let parsedResponse: AiStepHelpResponse | null = null;
      for (let attempt = 0; attempt < 2 && !parsedResponse; attempt += 1) {
        const raw = await requestGroqCompletion({
          messages: attempt === 0 ? messages : [...messages, { role: 'user' as const, content: 'Return the complete compact JSON object only.' }],
          maxTokens: 900,
          temperature: 0.15,
        });
        parsedResponse = parseStepHelpResponse(raw);
      }
      if (!parsedResponse) throw new Error('Explanation incomplete. Please try again.');
      setResponse(parsedResponse);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'The explanation could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex shrink-0 align-middle">
      <button type="button" onClick={askForExplanation} aria-label={`Explain step ${stepNumber}`} aria-expanded={open}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 transition hover:bg-emerald-50 active:translate-y-px">
        <CircleHelp className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-1/2 top-9 z-40 block w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left shadow-[0_4px_0_#e2e8f0] sm:left-auto sm:right-0 sm:translate-x-0 sm:p-5">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-slate-200 bg-white sm:left-auto sm:right-4 sm:translate-x-0" />
          <span className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              {lang === 'sn' ? 'Sei nhanho iyi?' : 'Why this step?'}
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close explanation" className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </span>
          {loading && (
            <span className="block" role="status" aria-live="polite">
              <span className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span key={thinkingIndex} className="animate-pulse">{AI_THINKING_WORDS[thinkingIndex]}…</span>
              </span>
              <span className="mt-4 block animate-pulse space-y-3" aria-hidden="true">
                <span className="block h-3 w-full rounded-full bg-slate-200" />
                <span className="block h-3 w-11/12 rounded-full bg-slate-200" />
                <span className="block h-3 w-3/4 rounded-full bg-slate-200" />
              </span>
            </span>
          )}
          {error && <span className="block text-sm leading-relaxed text-rose-600">{error}</span>}
          {response && (
            <span className="block space-y-3">
              {response.explanation.map((paragraph, index) => (
                <span key={index} className="gc-ink block text-base font-bold leading-relaxed text-blue-900 sm:text-lg">{paragraph}</span>
              ))}
              {response.mathLines.map((line, index) => (
                <span key={index} className="gc-ink block overflow-x-auto rounded-xl bg-[#fffdf5] px-3 py-2 text-base font-bold text-blue-900 whitespace-nowrap">{line}</span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   WORKING PLAYER — Sticky Player Controls Bar & Animation Playback
   ========================================================================= */
const formatPlayerTime = (ms: number) => {
  const seconds = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

const WorkingPlayer = ({ title, steps, caption, question, diagramViewBox, diagramCaption, lang = 'en' }: any) => {
  const total = useMemo(() => steps.reduce((s: number, a: any) => s + a.duration, 0), [steps]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.25);
  const hasDiagram = steps.some((s: any) => s.diagram);

  const [isDockVisible, setIsDockVisible] = useState(false);

  // Playback Animation Loop
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setTime((prev) => {
        const next = prev + dt * speed;
        if (next >= total) {
          setPlaying(false);
          setIsDockVisible(false); // Finished — disappears!
          return total;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, speed, total]);

  const toggle = () => {
    if (time >= total) {
      setTime(0);
      setPlaying(true);
      setIsDockVisible(true);
    } else {
      const nextPlaying = !playing;
      setPlaying(nextPlaying);
      if (nextPlaying) {
        setIsDockVisible(true);
      }
    }
  };

  const restart = () => {
    setTime(0);
    setPlaying(true);
    setIsDockVisible(true);
  };

  const timelinePercent = total > 0 ? (time / total) * 100 : 0;

  const withRange = useMemo(() => {
    let acc = 0;
    return steps.map((s: any) => {
      const start = acc; acc += s.duration; const end = acc;
      return { ...s, start, end };
    });
  }, [steps]);

  const rows = withRange.map((s: any) => {
    const progress = time <= s.start ? 0 : time >= s.end ? 1 : (time - s.start) / (s.end - s.start);
    return { ...s, progress };
  });

  const activeStepIdx = rows.findIndex((r: any) => r.progress < 1);
  const currentStepIndex = activeStepIdx === -1 ? rows.length - 1 : activeStepIdx;

  const notebook = (
    <ol className="gc-paper relative min-w-0 overflow-hidden rounded-3xl border-2 border-b-4 border-slate-200 py-6 pl-12 pr-3 shadow-sm sm:pl-14 sm:pr-5">
      <div
        className="absolute left-6 sm:left-7 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-emerald-200"
        aria-hidden="true"
      />
      {rows.map((step: any, index: number) => {
        const started = step.progress > 0;
        const writingProgress = clamp01((step.progress - 0.15) / 0.85);
        const explanationText = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;

        return (
          <li key={step.id} className="relative min-h-28 pb-8 last:pb-2">
            <span
              className={`absolute left-[-1.5rem] sm:left-[-1.75rem] top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black ring-4 ring-[#fbfaf6] z-10 ${
                started ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {index + 1}
            </span>
            <div className={`mb-3 flex max-w-4xl items-start gap-2 text-base font-medium leading-relaxed transition-opacity duration-300 ${started ? 'text-slate-700 opacity-100' : 'opacity-0'}`}>
              <p className="min-w-0 flex-1">{explanationText}</p>
              {started && <StepExplanationHelp question={question} stepsThroughCurrent={steps.slice(0, index + 1)} stepNumber={index + 1} lang={lang} />}
            </div>
            <div className="min-h-14 min-w-0 pr-2">
              <MathLine seg={step.seg} progress={writingProgress} isFinal={step.isFinal} />
            </div>
          </li>
        );
      })}
    </ol>
  );

  const diagramPanel = hasDiagram && (
    <div className="mb-6 w-full overflow-hidden rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5 shadow-sm">
      <svg viewBox={diagramViewBox ?? '0 0 380 260'} className="mx-auto block h-72 w-full max-w-2xl sm:h-84 lg:h-[22rem]">
        {rows.map((r: any) => (
          r.diagram ? <g key={r.id}>{r.diagram(r.progress, { currentStepIndex })}</g> : null
        ))}
      </svg>
      {diagramCaption && <p className="mt-2 text-center text-xs font-bold text-slate-500">{diagramCaption}</p>}
    </div>
  );

  return (
    <div className="mb-8 w-full min-w-0 max-w-full">
      {title && <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">{title}</h4>}

      {/* Inline Player Controls Bar (Inside card, with Play button) */}
      <div className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Play / Pause button */}
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-2 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
              {playing ? <Pause className="h-4 w-4 fill-white relative z-10" /> : <Play className="h-4 w-4 fill-white relative z-10" />}
              <span className="relative z-10">{playing ? (lang === 'sn' ? 'Misa' : 'PAUSE') : time >= total ? (lang === 'sn' ? 'Tanga Patsva' : 'REPLAY') : (lang === 'sn' ? 'Tanga' : 'PLAY')}</span>
            </button>

            {/* Restart button */}
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
            </button>

            {/* Speed Selector */}
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="hidden sm:inline">{lang === 'sn' ? 'Kumhanya' : 'Speed'}</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                aria-label="Playback speed"
              >
                <option value={0.1}>Very slow</option>
                <option value={0.2}>Slow</option>
                <option value={0.35}>Steady</option>
                <option value={0.5}>Medium</option>
                <option value={0.75}>Fast</option>
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold tabular-nums text-slate-500">
            <span>{formatPlayerTime(time)}</span>
            <span className="text-slate-300">/</span>
            <span>{formatPlayerTime(total)}</span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <input
          type="range"
          min={0}
          max={total}
          value={time}
          onChange={(e) => {
            setPlaying(false);
            const newTime = Number(e.target.value);
            setTime(newTime);
            if (newTime >= total) setIsDockVisible(false);
          }}
          aria-label="Working timeline"
          className="gc-timeline mt-3 block w-full cursor-pointer"
          style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
        />
      </div>

      {/* Diagram placed at the TOP of the container */}
      {diagramPanel}

      {/* Notebook of steps underneath */}
      {notebook}

      {caption && <p className="mt-3 border-t border-slate-100 px-1 py-2 text-xs italic text-slate-500">{caption}</p>}

      {/* Docked Bottom Bar: docks at bottom 0px from sidebar (lg:left-[280px]), 0px to right end. Only comes when user clicks play, disappears when finished. */}
      {isDockVisible && (
        <div
          className="fixed bottom-0 left-0 lg:left-[280px] right-0 z-50 animate-in fade-in slide-in-from-bottom duration-200 border-t-2 border-emerald-500 bg-white/95 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.15)] backdrop-blur-md dark:bg-slate-900/95"
          role="region"
          aria-label="Working playback controls"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Play / Pause button */}
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
              >
                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {playing ? <Pause className="h-4 w-4 fill-white relative z-10" /> : <Play className="h-4 w-4 fill-white relative z-10" />}
                <span className="relative z-10">{playing ? (lang === 'sn' ? 'Misa' : 'PAUSE') : time >= total ? (lang === 'sn' ? 'Tanga Patsva' : 'REPLAY') : (lang === 'sn' ? 'Tanga' : 'PLAY')}</span>
              </button>

              {/* Restart button */}
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
              </button>

              {/* Step indicator */}
              <span className="hidden sm:inline-flex items-center rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {lang === 'sn' ? `Nhanho ${currentStepIndex + 1} / ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}
              </span>

              {/* Speed Selector */}
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                aria-label="Playback speed"
              >
                <option value={0.1}>0.1x</option>
                <option value={0.2}>0.2x</option>
                <option value={0.35}>0.35x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
              </select>
            </div>

            {/* Timeline scrubber + time in docked bar */}
            <div className="flex flex-1 items-center gap-3 min-w-[180px]">
              <input
                type="range"
                min={0}
                max={total}
                value={time}
                onChange={(e) => {
                  setPlaying(false);
                  const newTime = Number(e.target.value);
                  setTime(newTime);
                  if (newTime >= total) setIsDockVisible(false);
                }}
                aria-label="Working timeline"
                className="gc-timeline block flex-1 cursor-pointer"
                style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
              />
              <div className="text-xs font-semibold tabular-nums text-slate-500 shrink-0">
                <span>{formatPlayerTime(time)}</span>
                <span className="mx-1 text-slate-300">/</span>
                <span>{formatPlayerTime(total)}</span>
              </div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsDockVisible(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition dark:hover:bg-slate-800"
              aria-label="Close docked player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
const StaticLine = ({ seg, align = 'center', answer = false }: any) => (
  <div className={`flex max-w-full flex-nowrap whitespace-nowrap overflow-x-auto overflow-y-hidden py-1 custom-scrollbar ${align === 'start' ? 'justify-start' : 'w-full justify-center'}`}>
    {seg.map((s: any, i: number) => (
      <span key={i} className={`gc-ink font-bold text-xl sm:text-2xl whitespace-nowrap ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.value}</span>
    ))}
  </div>
);

const DefinitionBox = ({ lines, label = 'Rule' }: any) => (
  <div className="my-6 w-full max-w-full overflow-hidden rounded-3xl border-2 border-b-4 border-rose-300 bg-white px-5 py-6 shadow-sm sm:px-7">
    <span className="gc-hand block text-center text-sm font-bold uppercase tracking-wider text-rose-500">{label}</span>
    <div className="mt-3 flex flex-col items-center gap-4 px-1">
      {lines.map((line: any, i: number) => {
        const seg = Array.isArray(line) ? line : line.seg;
        const note = Array.isArray(line) ? null : line.note;
        return (
          <div key={i} className="flex w-full flex-col items-center gap-1.5">
            <StaticLine seg={seg} />
            {note && <p className="max-w-md px-2 text-center text-sm font-medium leading-snug text-slate-600 sm:text-[0.95rem]"><span className="mr-1 text-rose-400">✎</span>{note}</p>}
          </div>
        );
      })}
    </div>
    <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-rose-200" />
  </div>
);

const ExampleCard = ({ index, example, lang = 'en' }: any) => (
  <article className="mb-10 rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5 shadow-sm sm:p-7">
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-sm">{index}</div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-600">
          {lang === 'sn' ? `Muenzaniso wakagadziriswa ${index}` : `Worked example ${index}`}
        </div>
        <StaticLine seg={[T(example.question)]} align="start" />
      </div>
    </div>
    <WorkingPlayer
      title={lang === 'sn' ? 'Nhanho Dzekuverenga' : 'Working'}
      steps={example.steps}
      caption={example.caption}
      question={example.question}
      diagramViewBox={example.diagramViewBox}
      diagramCaption={example.diagramCaption}
      lang={lang}
    />
    <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200">
      <span className="gc-hand text-base font-bold text-emerald-800">{lang === 'sn' ? 'Mhinduro:' : 'Answer:'}</span>
      <StaticLine seg={[T(example.answer)]} align="start" answer />
    </div>
  </article>
);

const PracticeZone = ({ items }: { items: string[] }) => (
  <div className="rounded-3xl border-2 border-b-4 border-slate-800 bg-slate-900 p-5 text-white shadow-lg sm:p-7">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-black"><span className="text-2xl">✍️</span> Practice Zone</h3>
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
          <span className="font-black text-emerald-400">{i + 1}.</span>
          <span className="gc-ink whitespace-pre-line text-lg leading-snug text-slate-200">{q}</span>
        </div>
      ))}
    </div>
  </div>
);

/* =========================================================================
   WORKED EXAMPLES — with full authentic Shona translations for explanations
   ========================================================================= */

// --- Example 1 -----------------------------------------------------------
const e1B = { x: 55, y: 200 }, e1C = { x: 280, y: 200 }, e1A = { x: 254, y: 52 };
const example1 = {
  question: 'Find AB in the triangle where BC = 3 cm, CA = 2 cm and angle C = 80°.',
  diagramViewBox: '0 0 360 250',
  diagramCaption: 'Two sides and the included angle are known — the cosine rule finds the third side.',
  steps: [
    mkStep(
      [T('Sketch and label the triangle.')],
      'Draw the two known sides around the included 80° angle, then mark the unknown side AB with a red question mark.',
      {
        noteShona: 'Dhirowa mativi maviri anozivikanwa akakomberedza kona ye 80°, wozoratidza divi risingazivikanwe AB nechiratidzo chitsvuku chemubvunzo.',
        diagram: combine(
          drawSide([e1B.x, e1B.y], [e1C.x, e1C.y], { label: '3 cm (a)', dy: 24 }),
          drawSide([e1C.x, e1C.y], [e1A.x, e1A.y], { label: '2 cm (b)', dx: 32, dy: -6 }),
          drawSide([e1A.x, e1A.y], [e1B.x, e1B.y], { dashed: true, color: '#dc2626', label: '?', dx: -34, dy: -12, hideAfterStep: 6 }),
          drawAngle([e1C.x, e1C.y], 48, 180, 260, { rotation: 220, label: '80°', lx: -25, ly: -18, size: 11 }),
          showVertices([{ ...e1A, label: 'A', dx: 0, dy: -14 }, { ...e1B, label: 'B', dx: -18, dy: 6 }, { ...e1C, label: 'C', dx: 18, dy: 6 }]),
        ),
      }
    ),
    mkStep(
      [T('x² = 2² + 3² − 2 × 2 × 3 × cos80°')],
      'Substitute a = 2, b = 3 and the included angle C = 80° into c² = a² + b² − 2ab cos C.',
      { noteShona: 'Isa a = 2, b = 3 nekona iri pakati C = 80° mumutemo: c² = a² + b² − 2ab cos C.' }
    ),
    mkStep(
      [T('= 4 + 9 − 12 × 0,1736')],
      'Work out the squares (2² = 4, 3² = 9) and the product 2 × 2 × 3 = 12, then read cos 80° = 0,1736 from a calculator.',
      { noteShona: 'Verenga masikweya (2² = 4, 3² = 9) uye kuwanda kwe 2 × 2 × 3 = 12, wozoverenga cos 80° = 0,1736 kubva pane karukureti.' }
    ),
    mkStep(
      [T('= 13 − 2,0832')],
      'Multiply 12 × 0,1736.',
      { noteShona: 'Wanza 12 ne 0,1736.' }
    ),
    mkStep(
      [T('= 10,916 8 = 10,92 to 4 s.f.')],
      'Subtract and round to 4 significant figures.',
      { noteShona: 'Bvisa wozokomba kuita manhamba 4 anokosha (significant figures).' }
    ),
    mkStep(
      [T('x = √10,92')],
      'Take the square root of both sides.',
      { noteShona: 'Tora sikweya ruti yemativi ese maviri.' }
    ),
    mkStep(
      [T('x = 3,305 = 3,3 to 2 s.f.')],
      'Round the final length to 2 significant figures — this gives AB.',
      {
        noteShona: 'Komba kureba kwekupedzisira kuita manhamba 2 anokosha — izvi zvinopa AB.',
        isFinal: true,
        diagram: drawSide([e1A.x, e1A.y], [e1B.x, e1B.y], { label: '3,3 cm', dx: -36, dy: -12 }),
      }
    ),
  ],
  answer: 'AB ≈ 3,3 cm',
  caption: 'The cosine rule is used whenever two sides and the angle between them are known.',
};

// --- Example 2 -----------------------------------------------------------
const e2D = { x: 190, y: 55 }, e2E = { x: 50, y: 168 }, e2F = { x: 274, y: 123 };
const example2 = {
  question: 'Find y in the triangle where the two sides from the apex are 5 cm and 3 cm, with a 102° angle between them.',
  diagramViewBox: '0 0 360 240',
  diagramCaption: 'When the included angle is obtuse, cos C is negative — the working keeps track of the sign.',
  steps: [
    mkStep(
      [T('Sketch and label the triangle.')],
      'Draw the two known sides around the included 102° angle, then mark the unknown base y with a red question mark.',
      {
        noteShona: 'Dhirowa mativi maviri anozivikanwa akakomberedza kona ye 102°, wozoratidza pasi pasingazivikanwe y nechiratidzo chitsvuku chemubvunzo.',
        diagram: combine(
          drawSide([e2D.x, e2D.y], [e2E.x, e2E.y], { label: '5 cm', dx: -30, dy: 10 }),
          drawSide([e2D.x, e2D.y], [e2F.x, e2F.y], { label: '3 cm', dx: 30, dy: 4 }),
          drawSide([e2E.x, e2E.y], [e2F.x, e2F.y], { dashed: true, color: '#dc2626', label: '?', dy: 24, hideAfterStep: 8 }),
          drawAngle([e2D.x, e2D.y], 44, 39, 141, { rotation: 90, label: '102°', lx: 0, ly: 26, size: 11 }),
          showVertices([{ ...e2D, label: 'D', dx: 0, dy: -14 }, { ...e2E, label: 'E', dx: -18, dy: 14 }, { ...e2F, label: 'F', dx: 18, dy: 10 }]),
        ),
      }
    ),
    mkStep(
      [T('y² = 5² + 3² − 2 × 5 × 3 × cos102°')],
      'Substitute the two sides and the 102° angle into c² = a² + b² − 2ab cos C.',
      { noteShona: 'Isa mativi maviri nekona ye 102° mumutemo: c² = a² + b² − 2ab cos C.' }
    ),
    mkStep(
      [T('= 25 + 9 − 30(−cos78°)')],
      'Since 102° is obtuse, cos102° = −cos78° — a calculator can evaluate this directly, but it helps to see the sign appear.',
      { noteShona: 'Sezvo 102° iri kona yakapamhama, cos 102° = −cos 78° — zvinobatsira kuona kuti chiratidzo chinoshanduka sei.' }
    ),
    mkStep(
      [T('= 34 + 30cos78°')],
      'The two minus signs combine to give a plus — this is why the working grows larger for an obtuse angle.',
      { noteShona: 'Zviratidzo zviviri zve minus zvinosangana zvichipa plus — ndosaka nhamba dzichikura pane kona yakapamhama.' }
    ),
    mkStep(
      [T('= 34 + 30 × 0,2079')],
      'Read cos78° = 0,2079 from a calculator.',
      { noteShona: 'Verenga cos 78° = 0,2079 kubva pane karukureti.' }
    ),
    mkStep(
      [T('= 34 + 6,237')],
      'Multiply 30 × 0,2079.',
      { noteShona: 'Wanza 30 ne 0,2079.' }
    ),
    mkStep(
      [T('= 40,237 = 40,24 to 4 s.f.')],
      'Add and round to 4 significant figures.',
      { noteShona: 'Sanganisa wozokomba kuita manhamba 4 anokosha.' }
    ),
    mkStep(
      [T('y = √40,24 = 6,343')],
      'Take the square root.',
      { noteShona: 'Tora sikweya ruti.' }
    ),
    mkStep(
      [T('y = 6,34 to 3 s.f.')],
      'Round the final answer.',
      {
        noteShona: 'Komba mhinduro yekupedzisira kuita manhamba 3 anokosha.',
        isFinal: true,
        diagram: drawSide([e2E.x, e2E.y], [e2F.x, e2F.y], { label: '6,34 cm', dy: 24 }),
      }
    ),
  ],
  answer: 'y ≈ 6,34 cm',
};

const sectionOneRule = [
  [T('c² = a² + b² − 2ab cos C')],
  [T('b² = a² + c² − 2ac cos B')],
  [T('a² = b² + c² − 2bc cos A')],
];

// --- Example 4 -----------------------------------------------------------
const e4B = { x: 55, y: 210 }, e4C = { x: 335, y: 210 }, e4A = { x: 121, y: 140 };
const example4 = {
  question: 'In triangle ABC, a = 6,7 cm, c = 2,3 cm and B = 46,6°. Find b, A and C.',
  diagramViewBox: '0 0 380 260',
  diagramCaption: 'The cosine rule finds the missing side first; the sine rule then finds the remaining angles.',
  steps: [
    mkStep(
      [T('Sketch and label the triangle.')],
      'Draw the two known sides around angle B, then mark the missing side b and the unknown angles A and C with red question marks.',
      {
        noteShona: 'Dhirowa mativi maviri akakomberedza kona B, wozoratidza divi riri kushomeka b nemakona A na C nezviratidzo zvitsvuku zvembvunzo.',
        diagram: combine(
          drawSide([e4B.x, e4B.y], [e4C.x, e4C.y], { label: '6,7 cm (a)', dy: 24 }),
          drawSide([e4B.x, e4B.y], [e4A.x, e4A.y], { label: '2,3 cm (c)', dx: -38, dy: -12 }),
          drawSide([e4A.x, e4A.y], [e4C.x, e4C.y], { dashed: true, color: '#dc2626', label: '?', dx: 24, dy: -24, hideAfterStep: 4 }),
          drawAngle([e4B.x, e4B.y], 50, -46.6, 0, { rotation: -23.3, label: '46,6°', lx: 28, ly: -10, size: 10.5 }),
          showVertices([{ ...e4B, label: 'B', dx: -18, dy: 8 }, { ...e4C, label: 'C', dx: 18, dy: 8 }, { ...e4A, label: 'A', dx: -2, dy: -16 }]),
          markUnknown(e4A.x + 14, e4A.y + 22, { size: 16, hideAfterStep: 8 }),
          markUnknown(e4C.x - 42, e4C.y - 6, { size: 15, hideAfterStep: 7 }),
        ),
      }
    ),
    mkStep(
      [T('b² = 2,3² + 6,7² − 2 × 2,3 × 6,7 cos46,6°')],
      'Substitute a = 6,7, c = 2,3 and B = 46,6° into b² = a² + c² − 2ac cos B.',
      { noteShona: 'Isa a = 6,7, c = 2,3 ne kona B = 46,6° mumutemo we cosine: b² = a² + c² − 2ac cos B.' }
    ),
    mkStep(
      [T('= 5,29 + 44,89 − 21,17')],
      'Work out each part: 2,3² = 5,29, 6,7² = 44,89, and 2 × 2,3 × 6,7 × cos46,6° ≈ 21,17.',
      { noteShona: 'Verenga chikamu chimwe nechimwe: 2,3² = 5,29, 6,7² = 44,89, uye 2 × 2,3 × 6,7 × cos 46,6° ≈ 21,17.' }
    ),
    mkStep(
      [T('= 50,18 − 21,17 = 29,01')],
      'Add the squares, then subtract.',
      { noteShona: 'Sanganisa masikweya, wozobvisa.' }
    ),
    mkStep(
      [T('b = √29,01 = 5,386 cm')],
      'Take the square root to find b.',
      {
        noteShona: 'Tora sikweya ruti kuti uwane kureba kwe divi b.',
        diagram: drawSide([e4A.x, e4A.y], [e4C.x, e4C.y], { label: 'b ≈ 5,39 cm', dx: 24, dy: -24 }),
      }
    ),
    mkStep(
      [T('Using the sine rule,  sinC ⁄ 2,3 = sin46,6° ⁄ 5,386')],
      'With one side and its opposite angle now known (b and B), the sine rule finds another angle from a second side.',
      { noteShona: 'Ne divi rimwe nekona yakatarisana naro zvave kuzivikanwa (b na B), mutemo we sine unowana imwe kona kubva kune rimwe divi.' }
    ),
    mkStep(
      [T('sinC = 2,3 sin46,6° ⁄ 5,386')],
      'Rearrange to make sin C the subject.',
      { noteShona: 'Ronga patsva kuti sin C ive musoro wetsananguro (subject of formula).' }
    ),
    mkStep(
      [T('C = 18,08°')],
      'Take sin⁻¹ of the result — the smaller of the two unknown angles is found first, since it must be acute.',
      {
        noteShona: 'Tora sin⁻¹ yemhinduro — kona diki pane dzisiri kuzivikanwa inotanga kutsvagwa nekuti inofanira kunge iri acute.',
        diagram: drawAngle([e4C.x, e4C.y], 68, 180, 198.1, { rotation: 189, label: '18,1°', lx: -46, ly: -6, size: 9.5 }),
      }
    ),
    mkStep(
      [T('A = 180° − (46,6° + 18,08°) = 115,32°')],
      'The three angles of a triangle sum to 180°, so the last angle is found by subtraction.',
      {
        noteShona: 'Makona matatu etriangle anowedzera kusvika pa 180°, saka kona yekupedzisira inowanikwa nekubvisa.',
        isFinal: true,
        diagram: drawAngle([e4A.x, e4A.y], 42, 18, 133.4, { rotation: 75, label: '115,3°', lx: 14, ly: 24, size: 10.5 }),
      }
    ),
  ],
  answer: 'b = 5,4 cm, C = 18,1°, A = 115,3° (to 1 d.p.)',
  caption: 'Find the smaller unknown angle first with the sine rule, since it is guaranteed to be acute — this avoids the ambiguous case.',
};

const rearrangedRule = [
  [T('cos A = (b² + c² − a²) ⁄ 2bc')],
  [T('cos B = (c² + a² − b²) ⁄ 2ca')],
  [T('cos C = (a² + b² − c²) ⁄ 2ab')],
];

// --- Example 5 -----------------------------------------------------------
const e5A = { x: 50, y: 210 }, e5B = { x: 330, y: 210 }, e5C = { x: 216, y: 98 };
const example5 = {
  question: 'Calculate the angles of a triangle with sides 4 m, 5 m and 7 m (AC = 5, CB = 4, AB = 7).',
  diagramViewBox: '0 0 380 260',
  diagramCaption: 'With all three sides known, the rearranged cosine formula finds every angle in turn.',
  steps: [
    mkStep(
      [T('Sketch and label the triangle.')],
      'Draw the three accurately scaled sides first. All three angles are unknown, so mark each one with a red question mark.',
      {
        noteShona: 'Dhirowa mativi matatu akapimwa zvakanaka. Makona ese matatu haazivikanwe, saka nyora chiratidzo chemubvunzo pane rimwe nerimwe.',
        diagram: combine(
          drawSide([e5A.x, e5A.y], [e5B.x, e5B.y], { label: '7', dy: 24 }),
          drawSide([e5A.x, e5A.y], [e5C.x, e5C.y], { label: '5', dx: -24, dy: -8 }),
          drawSide([e5C.x, e5C.y], [e5B.x, e5B.y], { label: '4', dx: 24, dy: -8 }),
          showVertices([{ ...e5A, label: 'A', dx: -18, dy: 8 }, { ...e5B, label: 'B', dx: 18, dy: 8 }, { ...e5C, label: 'C', dx: 0, dy: -14 }]),
          markUnknown(e5A.x + 34, e5A.y - 8, { size: 16, hideAfterStep: 2 }),
          markUnknown(e5B.x - 32, e5B.y - 10, { size: 16, hideAfterStep: 4 }),
          markUnknown(e5C.x, e5C.y + 25, { size: 16, hideAfterStep: 6 }),
        ),
      }
    ),
    mkStep(
      [T('cosA = (5² + 7² − 4²) ⁄ (2 × 5 × 7) = 58 ⁄ 70 = 0,828 6')],
      'Substitute b = 5, c = 7 and a = 4 (the side opposite A) into cos A = (b² + c² − a²) ⁄ 2bc.',
      { noteShona: 'Isa b = 5, c = 7 uye a = 4 mumutemo: cos A = (b² + c² − a²) ⁄ 2bc.' }
    ),
    mkStep(
      [T('A = 34,04°')],
      'Take cos⁻¹ of the result.',
      {
        noteShona: 'Tora cos⁻¹ yemhinduro kuti uwane kona A.',
        diagram: drawAngle([e5A.x, e5A.y], 56, -34, 0, { rotation: -17, label: '34,0°', lx: 34, ly: -8, size: 10.5 }),
      }
    ),
    mkStep(
      [T('cosB = (4² + 7² − 5²) ⁄ (2 × 4 × 7) = 40 ⁄ 56 = 0,714 3')],
      'Substitute a = 4, c = 7 and b = 5 (the side opposite B) into cos B = (c² + a² − b²) ⁄ 2ca.',
      { noteShona: 'Isa a = 4, c = 7 uye b = 5 mumutemo: cos B = (c² + a² − b²) ⁄ 2ca.' }
    ),
    mkStep(
      [T('B = 44,42°')],
      'Take cos⁻¹ of the result.',
      {
        noteShona: 'Tora cos⁻¹ yemhinduro kuti uwane kona B.',
        diagram: drawAngle([e5B.x, e5B.y], 54, 180, 224.4, { rotation: 202, label: '44,4°', lx: -32, ly: -10, size: 10.5 }),
      }
    ),
    mkStep(
      [T('cosC = (4² + 5² − 7²) ⁄ (2 × 4 × 5) = −8 ⁄ 40 = −0,200 0')],
      'Substitute a = 4, b = 5 and c = 7 (the side opposite C) into cos C = (a² + b² − c²) ⁄ 2ab. A negative cosine means C is obtuse.',
      { noteShona: 'Isa a = 4, b = 5 uye c = 7 mumutemo: cos C = (a² + b² − c²) ⁄ 2ab. Cosine ine minus inoreva kuti C ikona yakapamhama.' }
    ),
    mkStep(
      [T('C = 180° − 78,46° = 101,54°')],
      'cos⁻¹ of a negative number gives an obtuse angle directly on most calculators.',
      {
        noteShona: 'cos⁻¹ yenhamba ine minus inopa kona yakapamhama zvakananga pakarukureti.',
        isFinal: true,
        diagram: drawAngle([e5C.x, e5C.y], 42, 44.4, 146, { rotation: 95, label: '101,5°', lx: 0, ly: 25, size: 10.5 }),
      }
    ),
    mkStep(
      [T('Check: A + B + C = 34,04° + 44,42° + 101,54° = 180°')],
      'The three angles sum to 180°, confirming the working.',
      { noteShona: 'Makona matatu anowedzera kusvika pa 180°, zvichisimbisa kuti basa rako rakarongeka.' }
    ),
  ],
  answer: 'A ≈ 34,0°, B ≈ 44,4°, C ≈ 101,5°',
  caption: 'When all three sides are known, always use the cosine formula to find every angle, then check the three angles sum to 180°.',
};

// --- Example 6 -----------------------------------------------------------
const example6 = {
  question: 'Calculate the angles of triangles with sides (a) 400 m, 500 m, 700 m; (b) 2,8 cm, 4,2 cm, 5,6 cm.',
  steps: [
    mkStep(
      [T('(a)  400 : 500 : 700 = 4 : 5 : 7')],
      'The calculation is simplified by dividing every side by their common factor of 100 — this gives an equiangular (similar) triangle.',
      { noteShona: 'Zvinoreruka nekupatsanura divi rega rega ne 100 — izvi zvinopa triangle ine makona akafanana (similar triangle).' }
    ),
    mkStep(
      [T('This is the same triangle as Example 5, solved with sides 4, 5 and 7 units.')],
      'Similar triangles have identical angles, however large or small the actual sides are — only the ratio between the sides matters.',
      {
        noteShona: 'Iyi triangle yakangofanana neyeku Example 5 ine mativi 4, 5 na 7. Makona anoramba akafanana zvachose.',
        isFinal: true,
      }
    ),
    mkStep(
      [T('(b)  2,8 : 4,2 : 5,6 = 28 : 42 : 56 = 2 : 3 : 4')],
      'Divide throughout by 1,4, then by 14, to reach the simplest whole-number ratio.',
      { noteShona: 'Patsanura ese ne 1,4, wozopatsanura ne 14, kuti uwane ratio yakapfava.' }
    ),
    mkStep(
      [T('Solve the triangle with sides 2, 3 and 4 units instead, using the cosine formula exactly as in Example 5.')],
      'This is left as an exercise — the method is identical, just with smaller numbers.',
      {
        noteShona: 'Gadzirisa triangle ine mativi 2, 3 na 4 uchishandisa mutemo we cosine sezvakaitwa mu Example 5.',
        isFinal: true,
      }
    ),
  ],
  answer: '(a) same angles as Example 5: 34,0°, 44,4°, 101,5°   (b) solve 2 : 3 : 4',
  caption: 'Before reaching for a calculator, check whether the sides simplify to a smaller, easier ratio — the angles will be exactly the same.',
};

// --- Example 7 -----------------------------------------------------------
const e7D = { x: 50, y: 200 }, e7C = { x: 270, y: 200 }, e7A = { x: 134, y: 71 }, e7Bv = { x: 354, y: 71 };
const example7 = {
  question: 'The sides of a parallelogram are 7 cm and 10 cm and one diagonal, BD, is 15 cm. Find the length of the other diagonal, AC.',
  diagramViewBox: '0 0 390 260',
  diagramCaption: 'Adjacent angles of a parallelogram add to 180°, so cos(ADC) = −cos(DCB) — the sign is what links the two triangles.',
  steps: [
    mkStep(
      [T('Sketch and label the parallelogram.')],
      'Draw the known sides and diagonal BD first, then mark the required diagonal AC with a red question mark.',
      {
        noteShona: 'Dhirowa mativi anozivikanwa nediagonal BD, wozoratidza diagonal inodiwa AC nechiratidzo chemubvunzo.',
        diagram: combine(
          drawSide([e7D.x, e7D.y], [e7C.x, e7C.y], { label: '10 cm', dy: 24 }),
          drawSide([e7D.x, e7D.y], [e7A.x, e7A.y], { label: '7 cm', dx: -28, dy: -6 }),
          drawSide([e7A.x, e7A.y], [e7Bv.x, e7Bv.y], { dashed: true, color: '#94a3b8' }),
          drawSide([e7Bv.x, e7Bv.y], [e7C.x, e7C.y], { dashed: true, color: '#94a3b8', label: '7 cm', dx: 26 }),
          drawSide([e7Bv.x, e7Bv.y], [e7D.x, e7D.y], { color: '#0f766e', label: '15 cm', dx: 30, dy: -8 }),
          drawSide([e7A.x, e7A.y], [e7C.x, e7C.y], { dashed: true, color: '#dc2626', label: '?', dx: -18, dy: -24, hideAfterStep: 6 }),
          showVertices([{ ...e7A, label: 'A', dx: -16, dy: -8 }, { ...e7Bv, label: 'B', dx: 16, dy: -8 }, { ...e7C, label: 'C', dx: 16, dy: 8 }, { ...e7D, label: 'D', dx: -16, dy: 8 }]),
        ),
      }
    ),
    mkStep(
      [T('cosC = (10² + 7² − 15²) ⁄ (2 × 10 × 7) = −76 ⁄ 140')],
      'Substitute DC = 10, CB = 7 and the given diagonal BD = 15 into the rearranged cosine formula.',
      { noteShona: 'Isa DC = 10, CB = 7 nediagonal BD = 15 mumutemo we cosine wakarongwa patsva.' }
    ),
    mkStep(
      [T('In parallelogram ABCD, ADC + DCB = 180°')],
      'ADC and DCB are adjacent angles of the parallelogram, so they are supplementary.',
      { noteShona: 'Kona ADC ne DCB dziri pamwe chete muparallelogram, saka dzinowedzera kusvika pa 180°.' }
    ),
    mkStep(
      [T('⇒ cosADC = −cosDCB = 76 ⁄ 140')],
      'Since ADC = 180° − DCB, cos ADC = −cos DCB — the minus sign flips.',
      {
        noteShona: 'Sezvo ADC = 180° − DCB, cos ADC = −cos DCB — chiratidzo che minus chinoshanduka kuita plus.',
        diagram: drawAngle([e7D.x, e7D.y], 46, -57.1, 0, { rotation: -28, label: '57,1°', lx: 26, ly: -10, size: 11 }),
      }
    ),
    mkStep(
      [T('In triangle ADC,  AC² = 7² + 10² − 2 × 7 × 10 × cosADC')],
      'Now use the cosine rule in the other triangle, ADC, to find the required diagonal.',
      { noteShona: 'Zvino shandisa mutemo we cosine mune imwe triangle ADC kuti uwane kureba kwe diagonal.' }
    ),
    mkStep(
      [T('= 49 + 100 − 140 × 76⁄140 = 149 − 76 = 73')],
      'The 140 cancels neatly with the denominator from cos ADC.',
      { noteShona: 'Iyo 140 inobvisana zvakanaka ne denominator kubva pana cos ADC.' }
    ),
    mkStep(
      [T('AC = √73 = 8,544 cm')],
      'Take the square root — this is the length of the other diagonal.',
      {
        noteShona: 'Tora sikweya ruti — uku ndiko kureba kweimwe diagonal AC.',
        isFinal: true,
        diagram: drawSide([e7A.x, e7A.y], [e7C.x, e7C.y], { color: '#0f766e', label: 'AC ≈ 8,54 cm', dx: -24, dy: -24 }),
      }
    ),
  ],
  answer: 'AC ≈ 8,54 cm',
  caption: 'It was not necessary to find the value of angle C in degrees at all — only its cosine was ever needed.',
};

// --- Example 8 -----------------------------------------------------------
const e8A = { x: 190, y: 210 }, e8B = { x: 274, y: 162 }, e8C = { x: 50, y: 154 };
const example8 = {
  question: 'Towns A, B and C are such that AB = 60 km and AC = 100 km. The bearing of B from A is 060° and the bearing of C from A is 290°. Calculate (a) the distance BC, (b) the bearing of B from C.',
  diagramViewBox: '0 0 380 270',
  diagramCaption: 'Bearings are turned into an ordinary angle (here, angle BAC) before the cosine rule is applied.',
  steps: [
    mkStep(
      [T('Angle CAB = 60° + (360° − 290°) = 130°')],
      'Both bearings are measured clockwise from north at A. The angle between AB and AC is found by combining the two turns from north.',
      {
        noteShona: 'Mabearing ese anoyerwa clockwise kubva ku North pa A. Kona pakati pe AB ne AC inowanikwa nekubatanidza kutendeuka kwese kubva ku North.',
        diagram: combine(
          northArrow([e8A.x, e8A.y], 120),
          drawSide([e8A.x, e8A.y], [e8B.x, e8B.y], { label: '60 km', dx: 32, dy: -8 }),
          drawSide([e8A.x, e8A.y], [e8C.x, e8C.y], { label: '100 km', dx: -38, dy: -8 }),
          drawSide([e8B.x, e8B.y], [e8C.x, e8C.y], { dashed: true, color: '#dc2626', label: '?', dy: 24, hideAfterStep: 5 }),
          showVertices([{ ...e8A, label: 'A', dx: 0, dy: 18 }, { ...e8B, label: 'B', dx: 18, dy: 6 }, { ...e8C, label: 'C', dx: -18, dy: 6 }]),
          markUnknown(e8A.x + 8, e8A.y - 30, { size: 16, hideAfterStep: 1 }),
          markUnknown(e8C.x + 22, e8C.y - 18, { size: 16, hideAfterStep: 7 }),
        ),
      }
    ),
    mkStep(
      [T('By the cosine rule,')],
      'Angle A = 130° is now an ordinary included angle between the two known sides AB = 60 km and AC = 100 km.',
      {
        noteShona: 'Kona A = 130° yava kona yakajairika iri pakati pemativi maviri anozivikanwa AB = 60 km na AC = 100 km.',
        diagram: drawAngle([e8A.x, e8A.y], 54, -160, 33, { rotation: -60, label: '130°', lx: 10, ly: -28, size: 11 }),
      }
    ),
    mkStep(
      [T('BC² = 100² + 60² − 2 × 100 × 60 × cos130°')],
      'Substitute the two sides and the included angle into a² = b² + c² − 2bc cos A.',
      { noteShona: 'Isa mativi maviri nekona iri pakati mumutemo: a² = b² + c² − 2bc cos A.' }
    ),
    mkStep(
      [T('= 10 000 + 3 600 + 12 000 × 0,6428')],
      'Since 130° is obtuse, cos130° is negative, so −2ab cos130° becomes a positive addition.',
      { noteShona: 'Sezvo 130° iri obtuse, cos 130° ine minus, saka −2ab cos 130° inova kuwedzera kwakanaka.' }
    ),
    mkStep(
      [T('= 13 600 + 7 713,6 = 21 313,6')],
      'Add the parts together.',
      { noteShona: 'Sanganisa zvikamu pamwe chete.' }
    ),
    mkStep(
      [T('BC = √21 313,6 = 146 km to 3 s.f.')],
      'Take the square root to find the distance between the two towns.',
      {
        noteShona: 'Tora sikweya ruti kuti uwane nhambwe iri pakati pemataundi maviri aya.',
        diagram: drawSide([e8B.x, e8B.y], [e8C.x, e8C.y], { label: 'BC ≈ 146 km', dy: 24 }),
      }
    ),
    mkStep(
      [T('By the sine rule,  sinC ⁄ 60 = sin130° ⁄ 146')],
      'With BC and its opposite angle A now known, the sine rule finds the angle at C, which leads to the bearing of B from C.',
      { noteShona: 'Ne BC nekona yakatarisana nayo A zvava kuzivikanwa, mutemo we sine unowana kona iri pa C.' }
    ),
    mkStep(
      [T('C = 18,35°,  so NĈB = 91,7°')],
      'Angle NCA turns out to be 110° from the bearing geometry, so NĈB = NĈA − 18,35° gives the bearing of B from C.',
      {
        noteShona: 'Kona NCA inobuda iri 110° kubva pa geometry ye bearing, saka NĈB inopa bearing ya B kubva pa C.',
        isFinal: true,
        diagram: combine(northArrow([e8C.x, e8C.y], 85), drawAngle([e8C.x, e8C.y], 50, -90, 1.7, { rotation: -90, label: '91,7°', lx: 22, ly: -18, size: 10.5 })),
      }
    ),
  ],
  answer: '(a) BC ≈ 146 km   (b) bearing of B from C ≈ 091,7°',
  caption: 'Bearings problems are ordinary cosine/sine rule triangles once the compass angles are converted into an included angle.',
};

/* =========================================================================
   CHAPTER CONTENT & DUOLINGO TOPIC PALETTES
   ========================================================================= */
const sectionThemes: Record<string, {
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  navActiveBg: string;
  cardBorder: string;
}> = {
  'cosine-rule': {
    bgGradient: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600',
    borderColor: 'border-b-4 border-emerald-700',
    badgeBg: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    navActiveBg: 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm',
    cardBorder: 'border-emerald-300',
  },
  'mixed-rules': {
    bgGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
    borderColor: 'border-b-4 border-sky-700',
    badgeBg: 'bg-sky-400/30 text-white border border-sky-200/40',
    navActiveBg: 'bg-sky-500 border-b-4 border-sky-700 text-white shadow-sm',
    cardBorder: 'border-sky-300',
  },
  'finding-angles': {
    bgGradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
    borderColor: 'border-b-4 border-violet-800',
    badgeBg: 'bg-violet-400/30 text-white border border-violet-200/40',
    navActiveBg: 'bg-violet-600 border-b-4 border-violet-800 text-white shadow-sm',
    cardBorder: 'border-violet-300',
  },
  'quadrilaterals': {
    bgGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    borderColor: 'border-b-4 border-amber-700',
    badgeBg: 'bg-amber-400/30 text-white border border-amber-200/40',
    navActiveBg: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm',
    cardBorder: 'border-amber-300',
  },
  'bearings': {
    bgGradient: 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600',
    borderColor: 'border-b-4 border-rose-700',
    badgeBg: 'bg-rose-400/30 text-white border border-rose-200/40',
    navActiveBg: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm',
    cardBorder: 'border-rose-300',
  },
  'example-library': {
    bgGradient: 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900',
    borderColor: 'border-b-4 border-indigo-950',
    badgeBg: 'bg-indigo-400/30 text-white border border-indigo-200/40',
    navActiveBg: 'bg-indigo-600 border-b-4 border-indigo-800 text-white shadow-sm',
    cardBorder: 'border-indigo-300',
  },
};

const sections = [
  {
    id: 'cosine-rule',
    eyebrow: 'Chapter 11.1',
    title: 'The Cosine Rule',
    heading: 'The Cosine Rule',
    intro:
      'The cosine rule is used to solve a triangle when two sides and the angle between them (the included angle) are known, or when all three sides are known. Watch each line get written in, one step at a time — with the triangle itself drawn above it, ruler and protractor in hand.',
    introShona:
      'Mutemo we cosine unoshandiswa kugadzirisa triangle kana mativi maviri nekona iri pakati pawo zvichizivikanwa, kana kuti kana mativi ese matatu achizivikanwa. Wona mutsara wega wega uchinyorwa nhanho nenhanho — triangle ichidhirorwa pamusoro.',
    rules: [sectionOneRule],
    examples: [example1, example2],
    practice: [
      'A = 120°, b = 7 cm, c = 12 cm — calculate the length of the side opposite A.',
      'B = 54°, c = 4 cm, a = 5 cm — calculate the length of the side opposite B.',
      'C = 13°, a = 10 m, b = 15 m — calculate the length of the side opposite C.',
      'B = 135,5°, c = 8 cm, a = 5 cm — calculate the length of the side opposite B.',
      'A = 125,4°, b = 2,4 cm, c = 5 cm — calculate the length of the side opposite A.',
    ],
  },
  {
    id: 'mixed-rules',
    eyebrow: 'Chapter 11.1',
    title: 'Sine + Cosine',
    heading: 'Solving Triangles Using the Sine and Cosine Rules',
    intro:
      'Once the cosine rule has found one missing side, the sine rule is often the quickest way to find the remaining angles. Always find the smaller of the two unknown angles first, since that angle is guaranteed to be acute — this avoids the ambiguous case where sin⁻¹ could mean two different angles.',
    introShona:
      'Kana mutemo we cosine wapedza kuwana divi rimwe riri kushomeka, mutemo we sine unokurumidza kuwana makona asara. Nguva dzese tanga kuwana kona diki pane dzisiri kuzivikanwa nekuti yakavimbiswa kuva acute.',
    examples: [example4],
    practice: [
      'A = 58,1°, b = 10 m, c = 8,5 m — calculate the unknown side and angles.',
      'B = 126°, c = 5,6 cm, a = 5 cm — calculate the unknown side and angles.',
      'C = 25,7°, b = 3,5 cm, a = 6 cm — calculate the unknown side and angles.',
      'A = 140,15°, b = 45 m, c = 24 m — calculate the unknown side and angles.',
      'C = 143,3°, b = 3,8 cm, a = 2,3 cm — calculate the unknown side and angles.',
    ],
  },
  {
    id: 'finding-angles',
    eyebrow: 'Chapter 11.1',
    title: 'Finding Angles',
    heading: 'Using the Cosine Rule to Calculate Angles',
    intro:
      'When all three sides of a triangle are given, the cosine rule can be rearranged to make each cosine the subject in turn. It is advisable to find every angle this way, then check the three results add to 180°.',
    introShona:
      'Kana mativi ese matatu etriangle apihwa, mutemo we cosine unogona kurongwa patsva kuti kona yega yega ive musoro wetsananguro. Zvakanaka kuwana makona ese nenzira iyi, wozotarisisa kuti anowedzera kusvika pa 180° here.',
    rules: [rearrangedRule],
    examples: [example5, example6],
    practice: [
      'Calculate the angles of the triangle with sides 9 cm, 5 cm and 10 cm.',
      'Calculate the angles of the triangle with sides 7 cm, 5 cm and 8 cm.',
      'a = 5, b = 7, c = 9 — calculate the angles.',
      'a = 45, b = 33, c = 21 — calculate the angles.',
      'a = 14,4, b = 11,2, c = 7,6 — calculate the angles.',
    ],
  },
  {
    id: 'quadrilaterals',
    eyebrow: 'Chapter 11.2',
    title: 'Parallelograms',
    heading: 'Diagonals of Parallelograms and Cyclic Quadrilaterals',
    intro:
      'A diagonal splits a parallelogram or a cyclic quadrilateral into two triangles that share a side. Because adjacent angles in a parallelogram are supplementary (they add to 180°), the cosine of one angle is always the negative of the other.',
    introShona:
      'Diagonal inopatsanura parallelogram kuita triangle mbiri dzine divi rimwe rakafanana. Sezvo makona ari pedyo muparallelogram achiwedzera kusvika pa 180°, cosine yeimwe kona inova negative yeimwe.',
    examples: [example7],
    practice: [
      'The sides of a parallelogram are 3 cm and 5 cm and include an angle of 144°. Find the lengths of the diagonals of the parallelogram.',
      'In a cyclic quadrilateral PQRS, PQ = 7 cm, QR = 8 cm and PR = 7,5 cm. (a) Calculate angle PSR. (b) If SR = SP, calculate angle SPR.',
      'In triangle ABC, AB = 8 cm, BC = 4 cm, CA = 5 cm and BC is produced to P so that CP = 4 cm. Use the cosine rule to find cos ACB, hence find AP.',
    ],
  },
  {
    id: 'bearings',
    eyebrow: 'Chapter 11.3',
    title: 'Bearings',
    heading: 'Bearings and Distances',
    intro:
      'A bearing problem becomes an ordinary triangle problem the moment the compass bearings are converted into an included angle between two known distances.',
    introShona:
      'Mubvunzo webearing unova mubvunzo wakajairika wetriangle apo mabearing ecompass anochinjwa kuva kona iri pakati penhambwe mbiri dzinozivikanwa.',
    examples: [example8],
    practice: [
      'From a point on the edge of the sea, one ship is 5 km away on a bearing S 50° E and another is 2 km away on a bearing S 60° W. Find the distance between the ships.',
      'A girl walks 50 m on a bearing 025° and then 200 m due east. How far is she from her starting point?',
      'City A is 300 km due east of city B. City C is 200 km on a bearing of 123° from city B. How far is it from C to A?',
      'An aeroplane flies due north from Harare Airport for 500 km. It then flies on a bearing of 060° for a further 300 km before overflying a road junction. Calculate (a) the distance of the aeroplane from Harare Airport, (b) the bearing of the aeroplane from Harare Airport.',
      'Villages A, B, C, D are such that B is 4 km due east of A, C is 3 km due south of B and D is 4 km S50°W from C. Calculate the distance and bearing of A from D.',
    ],
  },
  {
    id: 'example-library',
    eyebrow: 'Reference',
    title: 'Example Library',
    heading: 'Worked Example Library',
    intro:
      'Every worked example from this chapter, gathered in one place. Use this page to revise without the surrounding explanation.',
    introShona:
      'Mienzaniso yese yakagadziriswa kubva muchitsauko chino yaunganidzwa pano. Shandisa peji rino kudzokorora nekudzidza.',
    isLibrary: true,
    examples: [example1, example2, example4, example5, example6, example7, example8],
  },
];

/* =========================================================================
   MAIN COMPONENT WITH DUOLINGO TOP BAR & LANGUAGE SWITCHER
   ========================================================================= */
const Section = ({ section, lang = 'en' }: any) => (
  <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
    <div className="mb-5">
      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">{section.eyebrow}</span>
      <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{section.heading}</h2>
    </div>

    <div className="mb-6">
      <p className="mb-4 leading-relaxed text-slate-700 text-base sm:text-lg">
        {lang === 'sn' && section.introShona ? section.introShona : section.intro}
      </p>
      {section.rules && section.rules.length > 0 && (
        <div className="mb-6 space-y-3">
          {section.rules.map((r: any, i: number) => <DefinitionBox key={i} label={section.rules.length > 1 ? `Rule ${i + 1}` : 'Rule'} lines={r} />)}
        </div>
      )}
    </div>

    {section.examples && section.examples.length > 0 && (
      <div className="mb-8">
        <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
          {section.isLibrary
            ? (lang === 'sn' ? 'Mienzaniso Yese Yakagadziriswa' : 'All Worked Examples')
            : (lang === 'sn' ? 'Mienzaniso Yakagadziriswa' : 'Worked Examples')}
        </h3>
        {section.examples.map((ex: any, i: number) => <ExampleCard key={i} index={i + 1} example={ex} lang={lang} />)}
      </div>
    )}

    {section.practice && section.practice.length > 0 && <PracticeZone items={section.practice} />}
  </section>
);

export const TheCosineRule = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState<'en' | 'sn'>('en');
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];
  const activeTheme = sectionThemes[activeSection.id] || sectionThemes['cosine-rule'];

  const handleNavigate = (id: string) => {
    setActive(id);
    requestAnimationFrame(() => {
      const lessonScrollArea = document.getElementById('lesson-scroll-area');
      if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };

  const goNext = () => { const n = sections[activeIndex + 1]; if (n) handleNavigate(n.id); };
  const goPrev = () => { const p = sections[activeIndex - 1]; if (p) handleNavigate(p.id); };

  return (
    <div id="cr-scroll-area" className="min-h-screen w-full bg-[#f8fafc] pb-24 font-sans text-slate-900">
      <InkStyles />

      {/* Duolingo-Styled Top Bar Banner with Distinct Topic Colors */}
      <div className={`relative overflow-hidden transition-all duration-300 ${activeTheme.bgGradient} ${activeTheme.borderColor} pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${activeTheme.badgeBg}`}>
                CHAPTER 11
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                O-Level Mathematics
              </span>
            </div>

            {/* Language Switcher with UK & Zimbabwe Flags */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-md scale-100'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <UkFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('sn')}
                aria-pressed={lang === 'sn'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  lang === 'sn'
                    ? 'bg-white text-slate-900 shadow-md scale-100'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ZwFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            {activeSection.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' && activeSection.introShona ? activeSection.introShona : activeSection.intro}
          </p>
        </div>
      </div>

      {/* Duolingo-Styled Navigation Bar — Left aligned flush */}
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div id="math-topic-rail" data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const theme = sectionThemes[s.id] || sectionThemes['cosine-rule'];
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  data-topic-id={s.id}
                  onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${
                    isActive
                      ? theme.navActiveBg
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

      {/* Main Content Area */}
      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-10 md:px-8 lg:px-10">
        <div key={`${activeSection.id}-${lang}`}>
          <Section section={activeSection} lang={lang} />
        </div>

        {/* Duolingo-Styled Next / Previous Navigation Footer */}
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

export default TheCosineRule;
