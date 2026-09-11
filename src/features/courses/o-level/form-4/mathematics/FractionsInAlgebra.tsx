import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CircleHelp, LoaderCircle, RotateCcw, X, Globe, Play, Pause } from 'lucide-react';
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
    .gc-frac-bar { transform: rotate(-0.6deg); box-shadow: 0 1px 0 rgba(23,23,23,0.15); }
  `}</style>
);

/* =========================================================================
   FLAGS
   ========================================================================= */
export const UkFlag = ({ className = 'h-4 w-6' }: { className?: string }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-fa-s">
      <path d="M0,0 v30 h60 v-30 z"/>
    </clipPath>
    <clipPath id="uk-clip-fa-t">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
    </clipPath>
    <g clipPath="url(#uk-clip-fa-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-fa-t)" stroke="#C8102E" strokeWidth="4"/>
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
   MATH-LINE MARKUP HELPERS
   ========================================================================= */
const T = (value: string) => ({ type: 'text', value });
const F = (num: string, den: string) => ({ type: 'frac', num, den });

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const segLength = (s: any) => (s.type === 'text' ? s.value.length : s.num.length + s.den.length + 3);
const lineLength = (seg: any[]) => seg.reduce((sum, s) => sum + segLength(s), 0);

let stepUid = 0;
const nextStepId = () => `fs${stepUid++}`;

const mkStep = (
  seg: any[],
  note: string,
  opts: { duration?: number; isFinal?: boolean; noteShona?: string } = {},
) => {
  const len = lineLength(seg);
  return {
    id: nextStepId(),
    seg,
    note,
    noteShona: opts.noteShona,
    duration: opts.duration ?? Math.max(2200, len * 90),
    isFinal: opts.isFinal ?? false,
  };
};

const glyphMetrics = (character: string) => {
  if (/\s/.test(character)) return { cssWidth: 0.32, viewWidth: 10 };
  if (/[1ilI.,'()]/.test(character)) return { cssWidth: 0.4, viewWidth: 13 };
  if (/[mwMW]/.test(character)) return { cssWidth: 0.9, viewWidth: 28 };
  return { cssWidth: 0.66, viewWidth: 21 };
};

const HandwrittenRun = ({
  value,
  progress,
  compact = false,
}: {
  value: string;
  progress: number;
  compact?: boolean;
}) => {
  const characters = Array.from(value);
  return (
    <span
      className={`inline-flex shrink-0 flex-nowrap whitespace-nowrap items-baseline ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
      aria-label={value}
    >
      {characters.map((character, index) => {
        const glyphProgress = clamp01(progress * characters.length - index);
        const { cssWidth, viewWidth } = glyphMetrics(character);
        if (/\s/.test(character)) {
          return <span key={index} aria-hidden="true" style={{ width: `${cssWidth}em` }} />;
        }
        return (
          <svg
            key={index}
            aria-hidden="true"
            viewBox={`0 0 ${viewWidth} 30`}
            className={compact ? 'h-[1.4em] shrink-0 overflow-visible' : 'h-[1.55em] shrink-0 overflow-visible'}
            style={{ width: `${cssWidth}em` }}
          >
            <text
              x="1"
              y="23"
              fontFamily="Kalam, cursive"
              fontSize={compact ? 24 : 27}
              fontWeight="700"
              fill="#1e3a8a"
              fillOpacity={clamp01((glyphProgress - 0.72) / 0.28)}
              stroke="#1e3a8a"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="240"
              strokeDashoffset={240 * (1 - glyphProgress)}
            >
              {character}
            </text>
          </svg>
        );
      })}
    </span>
  );
};

// MathLine is strictly single-line (flex-nowrap whitespace-nowrap overflow-x-auto)
// so that any equation with an equal sign is always kept on ONE single equation line.
const MathLine = ({ seg, progress, isFinal }: { seg: any[]; progress: number; isFinal?: boolean }) => {
  const total = lineLength(seg);
  const revealed = clamp01(progress) * total;
  let consumed = 0;

  const rendered = seg.map((s, i) => {
    if (s.type === 'text') {
      const length = s.value.length;
      const localProgress = clamp01((revealed - consumed) / Math.max(1, length));
      consumed += length;
      return (
        <HandwrittenRun key={i} value={s.value} progress={localProgress} />
      );
    }

    const numeratorLength = s.num.length;
    const denominatorLength = s.den.length;
    const numeratorProgress = clamp01((revealed - consumed) / Math.max(1, numeratorLength));
    const barProgress = clamp01(revealed - consumed - numeratorLength);
    const denominatorProgress = clamp01((revealed - consumed - numeratorLength - 1) / Math.max(1, denominatorLength));
    consumed += numeratorLength + denominatorLength + 3;
    return (
      <span key={i} className="mx-1.5 inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap">
        <HandwrittenRun value={s.num} progress={numeratorProgress} compact />
        <span
          className="my-0.5 h-[2px] w-full min-w-5 origin-left bg-blue-900"
          style={{ transform: `scaleX(${barProgress})` }}
        />
        <HandwrittenRun value={s.den} progress={denominatorProgress} compact />
      </span>
    );
  });

  const safeProgress = clamp01(progress);
  const doneAndFinal = isFinal && safeProgress >= 1;

  return (
    <div
      className={`flex w-full min-w-0 max-w-full flex-nowrap whitespace-nowrap items-center overflow-x-auto overflow-y-hidden py-1.5 custom-scrollbar ${
        doneAndFinal ? 'border-b-4 border-double border-red-600 pb-1 pr-2' : ''
      }`}
    >
      {rendered}
    </div>
  );
};

/* =========================================================================
   WORKING PLAYER (Play button removed)
   ========================================================================= */
const formatPlayerTime = (milliseconds: number) => {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

type AiMathSegment =
  | { type: 'text'; value: string }
  | { type: 'fraction'; numerator: string; denominator: string };

type AiStepHelpResponse = {
  explanation: string[];
  mathLines: AiMathSegment[][];
};

const AI_THINKING_WORDS = [
  'Delving', 'Pondering', 'Navigating', 'Unraveling', 'Elucidating', 'Deciphering', 'Charting', 'Weighing',
  'Cross-checking', 'Reasoning', 'Working through', 'Tracing', 'Untangling', 'Mapping out', 'Double-checking',
];

const serializeSegments = (segments: any[]) =>
  segments
    .map((s) => (s.type === 'text' ? s.value : `(${s.num})/(${s.den})`))
    .join('');

const parseAiMathSegment = (raw: any): AiMathSegment | null => {
  if (typeof raw === 'string') return { type: 'text', value: raw };
  if (raw && typeof raw === 'object') {
    if (typeof raw.value === 'string') return { type: 'text', value: raw.value };
    if (typeof raw.numerator === 'string' && typeof raw.denominator === 'string') {
      return { type: 'fraction', numerator: raw.numerator, denominator: raw.denominator };
    }
  }
  return null;
};

const parseStepHelpResponse = (raw: string): AiStepHelpResponse | null => {
  try {
    const withoutFence = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const objectStart = withoutFence.indexOf('{');
    const objectEnd = withoutFence.lastIndexOf('}');
    if (objectStart < 0 || objectEnd <= objectStart) return null;
    const parsed = JSON.parse(withoutFence.slice(objectStart, objectEnd + 1));
    const explanationSource = typeof parsed.explanation === 'string' ? [parsed.explanation] : parsed.explanation;
    const explanation = Array.isArray(explanationSource) ? explanationSource.filter((i) => typeof i === 'string' && i.trim()) : [];
    const mathLinesSource = Array.isArray(parsed.mathLines) ? parsed.mathLines : [];
    const mathLines = mathLinesSource.map((line: any) => {
      const parts = Array.isArray(line) ? line : [line];
      return parts.map(parseAiMathSegment).filter(Boolean) as AiMathSegment[];
    }).filter((line: any) => line.length > 0);

    if (explanation.length || mathLines.length) return { explanation, mathLines };
  } catch {
    // Retry on syntax error
  }
  return null;
};

const StepExplanationHelp = ({
  question,
  stepsThroughCurrent,
  stepNumber,
  lang = 'en',
}: {
  question: string;
  stepsThroughCurrent: any[];
  stepNumber: number;
  lang?: 'en' | 'sn';
}) => {
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

    const reachedWork = stepsThroughCurrent.map((step, index) => (
      `Step ${index + 1}: ${serializeSegments(step.seg)}\nReason: ${lang === 'sn' && step.noteShona ? step.noteShona : step.note}`
    )).join('\n\n');
    const selected = stepsThroughCurrent[stepsThroughCurrent.length - 1];

    try {
      const isShona = lang === 'sn';
      const messages = [
        {
          role: 'system' as const,
          content: isShona
            ? `You are Sidemann, a patient Zimbabwean mathematics tutor.
Explain only the selected worked-example step in clear, friendly ChiShona (for Zimbabwean secondary school students).
Keep the equations in standard algebraic notation.
Return only valid JSON in this exact shape:
{"explanation":["Chikamu chekutanga chetsananguro muchiShona","Chikamu chechipiri chetsananguro"],"mathLines":[[{"type":"text","value":"= "},{"type":"fraction","numerator":"2u","denominator":"3m + 2u"}]]}`
            : `You are Sidemann, a patient Zimbabwean secondary-school mathematics tutor covering algebraic fractions.
Explain only the selected worked-example step. You receive the original question and only the work reached up to that step.
Never reveal or predict any later step.
Return only valid JSON in this exact shape:
{"explanation":["One short paragraph","Optional second short paragraph"],"mathLines":[[{"type":"text","value":"= "},{"type":"fraction","numerator":"2u","denominator":"3m + 2u"}]]}`,
        },
        {
          role: 'user' as const,
          content: `Question: ${question}\n\nWork available:\n${reachedWork}\n\nExplain Step ${stepNumber} only: ${serializeSegments(selected.seg)}`,
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
      <button
        type="button"
        onClick={askForExplanation}
        aria-label={`Explain step ${stepNumber}`}
        aria-expanded={open}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 transition hover:bg-emerald-50 active:translate-y-px"
      >
        <CircleHelp className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-9 z-40 block w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left shadow-[0_4px_0_#e2e8f0] sm:left-auto sm:right-0 sm:translate-x-0 sm:p-5">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-slate-200 bg-white sm:left-auto sm:right-4 sm:translate-x-0" />
          <span className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              {lang === 'sn' ? 'Sei nhanho iyi?' : 'Why this step?'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close explanation"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
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
                <span key={index} className="gc-ink block text-base font-bold leading-relaxed text-blue-900 sm:text-lg">
                  {paragraph}
                </span>
              ))}

              {response.mathLines.map((line, index) => (
                <span key={index} className="block overflow-x-auto rounded-xl bg-[#fffdf5] px-3 py-2">
                  <span className="flex items-center gap-x-1 whitespace-nowrap">
                    {line.map((segment, segmentIndex) => (
                      segment.type === 'text' ? (
                        <span key={segmentIndex} className="gc-ink text-base font-bold text-blue-900 sm:text-lg">
                          {segment.value}
                        </span>
                      ) : (
                        <span key={segmentIndex} className="mx-1 inline-flex flex-col items-center align-middle">
                          <span className="gc-ink text-sm font-bold text-blue-900">{segment.numerator}</span>
                          <span className="my-0.5 h-[2px] w-full min-w-4 bg-blue-900" />
                          <span className="gc-ink text-sm font-bold text-blue-900">{segment.denominator}</span>
                        </span>
                      )
                    ))}
                  </span>
                </span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const WorkingPlayer = ({ title, steps, caption, question, lang = 'en' }: any) => {
  const total = useMemo(() => steps.reduce((sum: number, step: any) => sum + step.duration, 0), [steps]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);  const [isDockVisible, setIsDockVisible] = useState(false);

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
          setIsDockVisible(false); // Disappears when finished!
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
      if (nextPlaying) setIsDockVisible(true);
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

  return (
    <div className="mb-8 w-full min-w-0 max-w-full">
      {title && <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">{title}</h4>}

      {/* Inline Player Controls Bar inside the Working card */}
      <div className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Play / Pause */}
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
            {/* Restart */}
            <button type="button" onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5">
              <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
            </button>
            {/* Speed */}
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="hidden sm:inline">{lang === 'sn' ? 'Kumhanya' : 'Speed'}</span>
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500" aria-label="Playback speed">
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
        <input type="range" min={0} max={total} value={time}
          onChange={(e) => {
            setPlaying(false);
            const newTime = Number(e.target.value);
            setTime(newTime);
            if (newTime >= total) setIsDockVisible(false);
          }}
          aria-label="Working timeline" className="gc-timeline mt-3 block w-full cursor-pointer"
          style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
        />
      </div>

      <ol className="gc-paper relative min-w-0 overflow-hidden rounded-3xl border-2 border-b-4 border-slate-200 py-6 pl-12 pr-3 shadow-sm sm:pl-14 sm:pr-5">
        {/* Centered vertical line behind badge numbers */}
        <div className="absolute left-6 sm:left-7 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-emerald-200" aria-hidden="true" />
        {rows.map((step: any, index: number) => {
          const started = step.progress > 0;
          const writingProgress = clamp01((step.progress - 0.15) / 0.85);
          const explanationText = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;

          return (
            <li key={step.id} className="relative min-h-28 pb-8 last:pb-2">
              <span className={`absolute left-[-1.5rem] sm:left-[-1.75rem] top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black ring-4 ring-[#fbfaf6] z-10 ${
                started ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </span>
              <div className={`mb-3 flex max-w-4xl items-start gap-2 text-base font-medium leading-relaxed transition-opacity duration-300 ${started ? 'text-slate-700 opacity-100' : 'opacity-0'}`}>
                <p className="min-w-0 flex-1">{explanationText}</p>
                {started && (
                  <StepExplanationHelp question={question} stepsThroughCurrent={steps.slice(0, index + 1)} stepNumber={index + 1} lang={lang} />
                )}
              </div>
              <div className="min-h-14 min-w-0 pr-2">
                <MathLine seg={step.seg} progress={writingProgress} isFinal={step.isFinal} />
              </div>
            </li>
          );
        })}
      </ol>
      {caption && <p className="mt-3 border-t border-slate-100 px-1 py-2 text-xs italic text-slate-500">{caption}</p>}

      {/* Docked Bottom Bar: 0px from sidebar (lg:left-[280px]), 0px to right end, bottom 0px */}
      {isDockVisible && (
        <div
          className="fixed bottom-0 left-0 lg:left-[280px] right-0 z-50 animate-in fade-in slide-in-from-bottom duration-200 border-t-2 border-emerald-500 bg-white/95 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.15)] backdrop-blur-md dark:bg-slate-900/95"
          role="region"
          aria-label="Working playback controls"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
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
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
              </button>
              <span className="hidden sm:inline-flex items-center rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {lang === 'sn' ? `Nhanho ${currentStepIndex + 1} / ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}
              </span>
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
// StaticFractionLine strictly stays on one single line (flex-nowrap whitespace-nowrap overflow-x-auto)
const StaticFractionLine = ({ seg, align = 'center', answer = false, compact = false }: any) => (
  <div className={`flex max-w-full flex-nowrap whitespace-nowrap items-center overflow-x-auto overflow-y-hidden py-1 custom-scrollbar ${compact ? 'w-max' : 'w-full'} ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
    {seg.map((s: any, i: number) =>
      s.type === 'text' ? (
        <span key={i} className={`gc-ink font-bold whitespace-nowrap ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>
          {s.value}
        </span>
      ) : (
        <span key={i} className={`${compact ? 'mx-1.5' : 'mx-3'} inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap`}>
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.num}</span>
          <span className={`gc-frac-bar my-1 block h-[3px] rounded-full ${answer ? 'bg-emerald-700' : 'bg-slate-900'}`} style={{ width: 'calc(100% + 16px)' }} />
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.den}</span>
        </span>
      )
    )}
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
            <StaticFractionLine seg={seg} />
            {note && (
              <p className="max-w-md px-2 text-center text-sm font-medium leading-snug text-slate-600 sm:text-[0.95rem]">
                <span className="mr-1 text-rose-400">✎</span>
                {note}
              </p>
            )}
          </div>
        );
      })}
    </div>
    <div className="mx-auto mt-4 h-1.5 w-20 rounded-full bg-rose-200" />
  </div>
);

const unwrapMathGroup = (value: string) => {
  const trimmed = value.trim();
  const pairs: Record<string, string> = { '(': ')', '[': ']' };
  return pairs[trimmed[0]] === trimmed[trimmed.length - 1]
    ? trimmed.slice(1, -1)
    : trimmed;
};

const matchingGroupStart = (value: string, endIndex: number) => {
  const closer = value[endIndex];
  const opener = closer === ')' ? '(' : '[';
  let depth = 0;
  for (let i = endIndex; i >= 0; i -= 1) {
    if (value[i] === closer) depth += 1;
    if (value[i] === opener) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const matchingGroupEnd = (value: string, startIndex: number) => {
  const opener = value[startIndex];
  const closer = opener === '(' ? ')' : ']';
  let depth = 0;
  for (let i = startIndex; i < value.length; i += 1) {
    if (value[i] === opener) depth += 1;
    if (value[i] === closer) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const parseFractionToken = (token: string) => {
  const slashIndex = token.indexOf('⁄');
  if (slashIndex === -1) return null;

  const leftTrimmed = token.slice(0, slashIndex).trim();
  const rightTrimmed = token.slice(slashIndex + 1).trim();

  let numerator = leftTrimmed;
  let denominator = rightTrimmed;
  let prefix = '';
  let suffix = '';

  if (leftTrimmed.endsWith(')') || leftTrimmed.endsWith(']')) {
    const groupStart = matchingGroupStart(leftTrimmed, leftTrimmed.length - 1);
    if (groupStart >= 0) {
      prefix = leftTrimmed.slice(0, groupStart);
      numerator = unwrapMathGroup(leftTrimmed.slice(groupStart));
    }
  }

  if (rightTrimmed.startsWith('(') || rightTrimmed.startsWith('[')) {
    const groupEnd = matchingGroupEnd(rightTrimmed, 0);
    if (groupEnd >= 0) {
      denominator = unwrapMathGroup(rightTrimmed.slice(0, groupEnd + 1));
      suffix = rightTrimmed.slice(groupEnd + 1);
    }
  }

  return {
    prefix,
    fraction: F(numerator, denominator),
    suffix,
  };
};

const questionSegments = (question: string) => {
  const parsed = parseFractionToken(question);
  if (!parsed) return [T(question)];

  const segments: any[] = [];
  if (parsed.prefix) segments.push(T(parsed.prefix));
  segments.push(parsed.fraction);
  if (parsed.suffix) segments.push(T(parsed.suffix));
  return segments;
};

const ExampleCard = ({ index, example, lang = 'en' }: any) => {
  const answerSegments = example.answerSeg || (example.answer.includes('⁄')
    ? (() => {
        const parsed = parseFractionToken(example.answer);
        if (!parsed) return [T(example.answer)];
        const segs: any[] = [];
        if (parsed.prefix) segs.push(T(parsed.prefix));
        segs.push(parsed.fraction);
        if (parsed.suffix) segs.push(T(parsed.suffix));
        return segs;
      })()
    : [T(example.answer)]);

  return (
    <article className="mb-8 rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-sm">{index}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-600">
            {lang === 'sn' ? `Muenzaniso wakagadziriswa ${index}` : `Worked example ${index}`}
          </div>
          <StaticFractionLine seg={questionSegments(example.question)} align="start" />
        </div>
      </div>
      <WorkingPlayer
        title={lang === 'sn' ? 'Nhanho Dzekuverenga' : 'Working'}
        steps={example.steps}
        caption={example.caption}
        question={example.question}
        lang={lang}
      />
      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200">
        <span className="gc-hand text-base font-bold text-emerald-800">{lang === 'sn' ? 'Mhinduro:' : 'Answer:'}</span>
        <StaticFractionLine seg={answerSegments} align="start" answer />
      </div>
    </article>
  );
};

const PracticeZone = ({ items }: { items: string[] }) => (
  <div className="rounded-3xl border-2 border-b-4 border-slate-800 bg-slate-900 p-5 text-white shadow-lg sm:p-7">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
      <span className="text-2xl">✍️</span> Practice Zone
    </h3>
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
   WORKED EXAMPLES — Chapter 7, "Fractions in Algebra"
   ========================================================================= */

// Example 1
const example1 = {
  tag: 'Worked Example 1',
  question: 'Reduce (6m²u² − 4mu³) ⁄ (9m³u − 4mu³) to its lowest terms.',
  steps: [
    mkStep([F('6m²u² − 4mu³', '9m³u − 4mu³')], 'Start with the fraction exactly as given — nothing cancels yet because neither top nor bottom is factorised.', {
      noteShona: 'Tanga nefracton sezvairi — hapana chinoderedzwa pachine pano nekuti kumusoro nekuzasi hakusati kwaiswa mafactors.',
    }),
    mkStep([T('= '), F('2mu²(3m − 2u)', 'mu(9m² − 4u²)')], 'First, take out the common factors: 2mu² from the top, mu from the bottom.', {
      noteShona: 'Chekutanga, bvisa ma common factors: 2mu² kumusoro, uye mu kuzasi.',
    }),
    mkStep([T('= '), F('2mu²(3m − 2u)', 'mu(3m + 2u)(3m − 2u)')], 'Next, spot the difference of two squares: 9m² − 4u² factorises as (3m + 2u)(3m − 2u).', {
      noteShona: 'Tevere, cherechedza difference of two squares: 9m² − 4u² inoburitsa (3m + 2u)(3m − 2u).',
    }),
    mkStep([T('= '), F('2u', '3m + 2u')], 'Finally, divide the top and bottom by the common factor mu(3m − 2u) to reach lowest terms.', {
      noteShona: 'Pakupedzisira, patsanura musoro nepasi ne common factor mu(3m − 2u) kuti usvike pa lowest terms.',
      isFinal: true,
    }),
  ],
  answer: '2u ⁄ (3m + 2u)',
  caption: 'Always fully factorise numerator and denominator first — only then can common factors be cancelled.',
};

// Example 2
const example2 = {
  tag: 'Worked Example 2',
  question: 'Simplify (a² + ax − 6x²) ⁄ (2x² + ax − a²).',
  steps: [
    mkStep([F('a² + ax − 6x²', '2x² + ax − a²')], 'Start with the given fraction.', {
      noteShona: 'Tanga ne fraction yapiwa.',
    }),
    mkStep([T('= '), F('(a − 2x)(a + 3x)', '(2x − a)(x + a)')], 'Factorise the numerator and denominator fully.', {
      noteShona: 'Factorisa musoro nepasi zvizere.',
    }),
    mkStep([T('= −'), F('a + 3x', 'x + a')], 'Since a − 2x = −(2x − a), those factors are negatives of each other, so cancelling them leaves a minus sign out front.', {
      noteShona: 'Sezvo a − 2x = −(2x − a), mafactors aya anopikisana, saka kudzima kunosiya chiratidzo che minus kumberi.',
      isFinal: true,
    }),
  ],
  answer: '−(a + 3x) ⁄ (x + a)',
  caption: 'When the sign of just one of a numerator or denominator is flipped, the sign of the whole fraction flips too.',
};

// Example 3
const example3 = {
  tag: 'Worked Example 3',
  question: 'Simplify (a² − 5a + 6) ⁄ (2 − 3a + a²).',
  steps: [
    mkStep([F('a² − 5a + 6', '2 − 3a + a²')], 'Start with the given fraction.', {
      noteShona: 'Tanga ne fraction yapiwa.',
    }),
    mkStep([T('= '), F('(a − 2)(a − 3)', '(2 − a)(1 − a)')], 'Factorise both quadratics.', {
      noteShona: 'Factorisa maquadratic ese ari maviri.',
    }),
    mkStep(
      [T('= −'), F('a − 3', '1 − a'), T('   or   '), F('a − 3', 'a − 1')],
      'Since 2 − a = −(a − 2), one pair of factors cancels with a sign left over — the answer can be written either way.',
      {
        noteShona: 'Sezvo 2 − a = −(a − 2), peya imwe inobvisana ichisiya minus — mhinduro inogona kunyorwa nenzira dzese mbiri.',
        isFinal: true,
      }
    ),
  ],
  answer: '(a − 3) ⁄ (a − 1)',
  caption: 'Because the signs of a numerator or a denominator can each be flipped, the same simplified fraction often has more than one valid form.',
};

// Example 4
const example4 = {
  tag: 'Worked Example 4',
  question: 'Simplify (a² + 2a − 3) ⁄ (a² − 16) × (a + 4) ⁄ (a² + 8a + 15).',
  steps: [
    mkStep([F('a² + 2a − 3', 'a² − 16'), T('  ×  '), F('a + 4', 'a² + 8a + 15')], 'Start with the product of the two fractions.', {
      noteShona: 'Tanga nekuwanda kwe fractions mbiri idzi.',
    }),
    mkStep(
      [T('= '), F('(a + 3)(a − 1)', '(a − 4)(a + 4)'), T('  ×  '), F('a + 4', '(a + 5)(a + 3)')],
      'Factorise every numerator and denominator fully before cancelling anything.',
      { noteShona: 'Factorisa musoro wega wega nepasi pega pega zvizere usati wadzima chinhu.' }
    ),
    mkStep([T('= '), F('a − 1', '(a − 4)(a + 5)')], 'Cancel the common factors (a + 3) and (a + 4). Leave the answer in factorised form — do not multiply out.', {
      noteShona: 'Bvisa ma common factors (a + 3) ne (a + 4). Siya mhinduro yakafactoriswa — usadzorere mabrackets.',
      isFinal: true,
    }),
  ],
  answer: '(a − 1) ⁄ [(a − 4)(a + 5)]',
  caption: 'Factorise fully, then divide — never multiply the brackets out first.',
};

// Example 5
const example5 = {
  tag: 'Worked Example 5',
  question: 'Simplify (m² − a²) ⁄ (m² + bm + am + ab) ÷ (m² − 2am + a²) ⁄ (cm + bc).',
  steps: [
    mkStep([F('m² − a²', 'm² + bm + am + ab'), T('  ÷  '), F('m² − 2am + a²', 'cm + bc')], 'Start with the division of two fractions.', {
      noteShona: 'Tanga nekupatsanura kwe fractions mbiri.',
    }),
    mkStep(
      [T('= '), F('m² − a²', 'm² + bm + am + ab'), T('  ×  '), F('cm + bc', 'm² − 2am + a²')],
      'To divide by a fraction, multiply by its reciprocal.',
      { noteShona: 'Kuti upatsanure ne fraction, wanza ne reciprocal yayo (pidigura).' }
    ),
    mkStep(
      [T('= '), F('(m − a)(m + a)', '(m + b)(m + a)'), T('  ×  '), F('c(m + b)', '(m − a)(m − a)')],
      'Factorise every part fully.',
      { noteShona: 'Factorisa zvikamu zvese zvizere.' }
    ),
    mkStep([T('= '), F('c', 'm − a')], 'Cancel (m − a), (m + a) and (m + b) from top and bottom, leaving the answer.', {
      noteShona: 'Bvisa (m − a), (m + a) pamwe chete ne (m + b) kumusoro nekuzasi.',
      isFinal: true,
    }),
  ],
  answer: 'c ⁄ (m − a)',
  caption: 'Dividing by a fraction is the same as multiplying by its reciprocal — flip it, then factorise and cancel as usual.',
};

// Example 6
const example6 = {
  tag: 'Worked Example 6',
  question: 'Simplify (a² + ab) ⁄ (a² − 2ab + b²) ÷ (a + 3b) ⁄ (a + 2b) × (ab − a²) ⁄ (a² + 3ab + 2b²).',
  steps: [
    mkStep(
      [F('a² + ab', 'a² − 2ab + b²'), T('  ÷  '), F('a + 3b', 'a + 2b'), T('  ×  '), F('ab − a²', 'a² + 3ab + 2b²')],
      'Start with three fractions combined by ÷ and ×.',
      { noteShona: 'Tanga ne fractions nhatu dzakabatanidzwa ne ÷ pamwe chete ne ×.' }
    ),
    mkStep(
      [T('= '), F('a² + ab', 'a² − 2ab + b²'), T('  ×  '), F('a + 2b', 'a + 3b'), T('  ×  '), F('ab − a²', 'a² + 3ab + 2b²')],
      'Change the ÷ into a × by flipping the fraction that follows it.',
      { noteShona: 'Chinja chiratidzo che ÷ kuita × nekupidigura fraction inotevera.' }
    ),
    mkStep(
      [T('= '), F('a(a + b)', '(a − b)(a − b)'), T('  ×  '), F('a + 2b', 'a + 3b'), T('  ×  '), F('a(b − a)', '(a + b)(a + 2b)')],
      'Factorise every numerator and denominator fully.',
      { noteShona: 'Factorisa musoro wega wega nepasi pega pega zvizere.' }
    ),
    mkStep(
      [T('= −'), F('a²', '(a − b)(a + 3b)')],
      'Cancel (a + b), (a + 2b) and one (a − b). Since (b − a) = −(a − b), a minus sign is left over.',
      {
        noteShona: 'Bvisa (a + b), (a + 2b) pamwe chete ne (a − b). Sezvo (b − a) = −(a − b), panosara minus.',
        isFinal: true,
      }
    ),
  ],
  answer: '−a² ⁄ [(a − b)(a + 3b)]',
  caption: 'Notice that (a − b) divides into (b − a) to give −1, because −1 × (a − b) = (b − a).',
};

// Example 7
const example7 = {
  tag: 'Worked Example 7',
  question: 'Simplify 2 + (6a² + 2b²) ⁄ 3ab − (4a − b) ⁄ 2b.',
  steps: [
    mkStep([T('2 + '), F('6a² + 2b²', '3ab'), T(' − '), F('4a − b', '2b')], 'Start with the given expression — the denominators are 3ab and 2b.', {
      noteShona: 'Tanga ne expression yapiwa — madenominator aripo ndi 3ab na 2b.',
    }),
    mkStep(
      [T('= '), F('2 × 6ab', '6ab'), T(' + '), F('2(6a² + 2b²)', '6ab'), T(' − '), F('3a(4a − b)', '6ab')],
      'The LCM of 3ab and 2b is 6ab. Rewrite every term with that common denominator.',
      { noteShona: 'LCM ye 3ab na 2b ndi 6ab. Nyora temu yega yega ine common denominator iyoyo.' }
    ),
    mkStep([T('= '), F('12ab + 2(6a² + 2b²) − 3a(4a − b)', '6ab')], 'Combine the three numerators over the common denominator.', {
      noteShona: 'Batanidza misoro mitatu iyi pamusoro pe common denominator.',
    }),
    mkStep([T('= '), F('12ab + 12a² + 4b² − 12a² + 3ab', '6ab')], 'Expand the brackets in the numerator.', {
      noteShona: 'Vhura mabrackets ari kumusoro.',
    }),
    mkStep([T('= '), F('15ab + 4b²', '6ab')], 'Collect like terms: 12a² and −12a² cancel; 12ab + 3ab = 15ab.', {
      noteShona: 'Batanidza mazwi akafanana: 12a² na −12a² anobvisana; 12ab + 3ab = 15ab.',
    }),
    mkStep([T('= '), F('b(15a + 4b)', '6ab')], 'Take out the common factor b from the numerator.', {
      noteShona: 'Bvisa common factor b kumusoro.',
    }),
    mkStep([T('= '), F('15a + 4b', '6a')], 'Finally, cancel the common factor b from top and bottom.', {
      noteShona: 'Pakupedzisira, bvisa common factor b kumusoro nekuzasi.',
      isFinal: true,
    }),
  ],
  answer: '(15a + 4b) ⁄ 6a',
  caption: 'Whole numbers join the LCM too — treat 2 as 2 ⁄ 1 when finding the common denominator.',
};

// Example 8
const example8 = {
  tag: 'Worked Example 8',
  question: 'Simplify 3 ⁄ (m² + mn − 2n²) − 2 ⁄ (m² − 4mn + 3n²).',
  steps: [
    mkStep([F('3', 'm² + mn − 2n²'), T(' − '), F('2', 'm² − 4mn + 3n²')], 'Start with the given expression.', {
      noteShona: 'Tanga ne expression yapiwa.',
    }),
    mkStep([T('= '), F('3', '(m − n)(m + 2n)'), T(' − '), F('2', '(m − n)(m − 3n)')], 'Factorise both denominators so their LCM can be found.', {
      noteShona: 'Factorisa madenominator ese maviri kuitira kuwana LCM.',
    }),
    mkStep([T('= '), F('3(m − 3n) − 2(m + 2n)', '(m − n)(m + 2n)(m − 3n)')], 'The LCM is (m − n)(m + 2n)(m − 3n). Combine both fractions over it.', {
      noteShona: 'LCM ndiyo (m − n)(m + 2n)(m − 3n). Batanidza mafractions ese ari maviri pamusoro payo.',
    }),
    mkStep([T('= '), F('3m − 9n − 2m − 4n', '(m − n)(m + 2n)(m − 3n)')], 'Expand the numerator.', {
      noteShona: 'Vhura mabrackets ekumusoro.',
    }),
    mkStep([T('= '), F('m − 13n', '(m − n)(m + 2n)(m − 3n)')], 'Collect like terms in the numerator: 3m − 2m = m, and −9n − 4n = −13n.', {
      noteShona: 'Batanidza mazwi akafanana kumusoro: 3m − 2m = m, uye −9n − 4n = −13n.',
      isFinal: true,
    }),
  ],
  answer: '(m − 13n) ⁄ [(m − n)(m + 2n)(m − 3n)]',
};

// Example 9
const example9 = {
  tag: 'Worked Example 9',
  question: 'Simplify (x + 4) ⁄ (x² − 3x) − (x − 1) ⁄ (9 − x²).',
  steps: [
    mkStep([F('x + 4', 'x² − 3x'), T(' − '), F('x − 1', '9 − x²')], 'Start with the given expression.', {
      noteShona: 'Tanga ne expression yapiwa.',
    }),
    mkStep([T('= '), F('x + 4', 'x(x − 3)'), T(' − '), F('x − 1', '(3 − x)(3 + x)')], 'Factorise both denominators.', {
      noteShona: 'Factorisa madenominator ese ari maviri.',
    }),
    mkStep([T('= '), F('x + 4', 'x(x − 3)'), T(' + '), F('x − 1', '(x − 3)(x + 3)')], 'Since 3 − x = −(x − 3), the subtraction turns into an addition.', {
      noteShona: 'Sezvo 3 − x = −(x − 3), kubvisa kunochinja kuita kuwedzera (minus inochinja kuita plus).',
    }),
    mkStep([T('= '), F('(x + 4)(x + 3) + x(x − 1)', 'x(x − 3)(x + 3)')], 'Combine both fractions over the common denominator x(x − 3)(x + 3).', {
      noteShona: 'Batanidza fractions pamusoro pe common denominator x(x − 3)(x + 3).',
    }),
    mkStep([T('= '), F('x² + 7x + 12 + x² − x', 'x(x − 3)(x + 3)')], 'Expand both brackets in the numerator.', {
      noteShona: 'Vhura mabrackets ese ari maviri ekumusoro.',
    }),
    mkStep(
      [T('= '), F('2x² + 6x + 12', 'x(x − 3)(x + 3)'), T('  =  '), F('2(x² + 3x + 6)', 'x(x − 3)(x + 3)')],
      'Collect like terms, then take out the common factor 2 from the numerator.',
      {
        noteShona: 'Batanidza mazwi akafanana, wozobvisa common factor 2 kubva kumusoro.',
        isFinal: true,
      }
    ),
  ],
  answer: '2(x² + 3x + 6) ⁄ [x(x − 3)(x + 3)]',
  caption: 'A sign in front of a fraction changes the whole time a bracket like (3 − x) is rewritten as −(x − 3).',
};

// Example 10
const example10 = {
  tag: 'Worked Example 10',
  question: 'Simplify (3a − 5m) ⁄ (a² − 5am + 6m²) + 1 ⁄ (a − 2m) − 2 ⁄ (a − 3m).',
  steps: [
    mkStep([F('3a − 5m', 'a² − 5am + 6m²'), T(' + '), F('1', 'a − 2m'), T(' − '), F('2', 'a − 3m')], 'Start with the given expression.', {
      noteShona: 'Tanga ne expression yapiwa.',
    }),
    mkStep([T('= '), F('3a − 5m', '(a − 2m)(a − 3m)'), T(' + '), F('1', 'a − 2m'), T(' − '), F('2', 'a − 3m')], 'Factorise the first denominator; the common denominator is now (a − 2m)(a − 3m).', {
      noteShona: 'Factorisa denominator yekutanga; common denominator zvino yava (a − 2m)(a − 3m).',
    }),
    mkStep([T('= '), F('3a − 5m + (a − 3m) − 2(a − 2m)', '(a − 2m)(a − 3m)')], 'Combine all three fractions over that common denominator.', {
      noteShona: 'Batanidza fractions dzese nhatu pamusoro pe common denominator iyoyo.',
    }),
    mkStep([T('= '), F('3a − 5m + a − 3m − 2a + 4m', '(a − 2m)(a − 3m)')], 'Remove the brackets in the numerator.', {
      noteShona: 'Bvisa mabrackets ari kumusoro.',
    }),
    mkStep([T('= '), F('2a − 4m', '(a − 2m)(a − 3m)')], 'Collect like terms: 3a + a − 2a = 2a, and −5m − 3m + 4m = −4m.', {
      noteShona: 'Batanidza mazwi akafanana: 3a + a − 2a = 2a, uye −5m − 3m + 4m = −4m.',
    }),
    mkStep([T('= '), F('2(a − 2m)', '(a − 2m)(a − 3m)')], 'Take out the common factor 2 from the numerator.', {
      noteShona: 'Bvisa common factor 2 kubva kumusoro.',
    }),
    mkStep([T('= '), F('2', 'a − 3m')], 'Cancel the common factor (a − 2m) from top and bottom.', {
      noteShona: 'Bvisa common factor (a − 2m) kumusoro nekuzasi.',
      isFinal: true,
    }),
  ],
  answer: '2 ⁄ (a − 3m)',
};

// Example 11
const example11 = {
  tag: 'Worked Example 11',
  question: 'Given that x : y = 9 : 4, evaluate (8x − 3y) ⁄ (x − ¾y).',
  steps: [
    mkStep([T('If x : y = 9 : 4, then  '), F('x', 'y'), T(' = '), F('9', '4')], 'Turn the ratio into a fraction x ⁄ y.', {
      noteShona: 'Chinja ratio kuita fraction x ⁄ y.',
    }),
    mkStep([F('8x − 3y', 'x − ¾y'), T('  =  '), F('8(x⁄y) − 3', '(x⁄y) − ¾')], 'Divide the numerator and denominator of the expression by y.', {
      noteShona: 'Patsanura musoro nepasi pe expression iyi ne y.',
    }),
    mkStep([T('= '), F('8 × 9⁄4 − 3', '9⁄4 − 3⁄4')], 'Substitute 9⁄4 for x ⁄ y.', {
      noteShona: 'Isa 9⁄4 panzvimbo ya x ⁄ y.',
    }),
    mkStep([T('= '), F('18 − 3', '1½')], 'Work out 8 × 9⁄4 = 18.', {
      noteShona: 'Verenga 8 × 9⁄4 = 18.',
    }),
    mkStep([T('= '), F('15', '1½'), T('  =  15 ÷ 1½  =  15 × '), F('2', '3')], 'Dividing by 1½ is the same as multiplying by its reciprocal, 2⁄3.', {
      noteShona: 'Kupatsanura ne 1½ kwakafanana nekuwanza ne reciprocal yayo, 2⁄3.',
    }),
    mkStep([T('= 10')], 'Multiply through to get the final value.', {
      noteShona: 'Wanza kuti uwane mhinduro yekupedzisira.',
      isFinal: true,
    }),
  ],
  answer: '10',
  caption: 'Whenever a ratio x : y is given, dividing numerator and denominator by y turns every x into a single fraction x ⁄ y.',
};

// Example 12 — Single-line guarantee with =
const example12 = {
  tag: 'Worked Example 12',
  question: 'If x = (2a + 3) ⁄ (3a − 2), express (x − 1) ⁄ (2x + 1) in terms of a.',
  steps: [
    mkStep([F('x − 1', '2x + 1'), T('  =  '), F('(2a+3)⁄(3a−2) − 1', '2 × (2a+3)⁄(3a−2) + 1')], 'Substitute (2a + 3) ⁄ (3a − 2) for x in the expression.', {
      noteShona: 'Isa (2a + 3) ⁄ (3a − 2) panzvimbo ya x mune expression yapiwa.',
    }),
    mkStep([T('Multiply top and bottom by (3a − 2):')], 'Multiplying numerator and denominator by (3a − 2) clears the smaller fraction inside.', {
      noteShona: 'Kuwanza kumusoro nekuzasi ne (3a − 2) kunobvisa mafractions madiki ari mukati.',
    }),
    mkStep([T('= '), F('2a + 3 − (3a − 2)', '2(2a + 3) + (3a − 2)')], 'Distribute the multiplication across each part.', {
      noteShona: 'Govanisa kuwanza pane chikamu chimwe nechimwe.',
    }),
    mkStep([T('= '), F('2a + 3 − 3a + 2', '4a + 6 + 3a − 2')], 'Expand the brackets.', {
      noteShona: 'Vhura mabrackets ose.',
    }),
    mkStep([T('= '), F('−a + 5', '7a + 4')], 'Collect like terms in the numerator and denominator.', {
      noteShona: 'Batanidza mazwi akafanana kumusoro nepasi.',
      isFinal: true,
    }),
  ],
  answer: '(−a + 5) ⁄ (7a + 4)',
  caption: 'A "fraction within a fraction" is cleared by multiplying every term, top and bottom, by the inner denominator.',
};

// Example 13
const example13 = {
  tag: 'Worked Example 13',
  question: 'Solve the equation 1 ⁄ (3a − 1) = 2 ⁄ (a + 1) − 3 ⁄ 8.',
  steps: [
    mkStep([F('1', '3a − 1'), T(' = '), F('2', 'a + 1'), T(' − '), F('3', '8')], 'The LCM of the denominators is 8(3a − 1)(a + 1).', {
      noteShona: 'LCM yemadenominator ndiyo 8(3a − 1)(a + 1).',
    }),
    mkStep([T('8(a + 1) = 16(3a − 1) − 3(3a − 1)(a + 1)')], 'Multiply every term by that LCM — this clears every fraction at once.', {
      noteShona: 'Wanza temu yega yega ne LCM iyoyo — izvi zvinobvisa mafractions ese kamwe chete.',
    }),
    mkStep([T('8a + 8 = 48a − 16 − 3(3a² + 2a − 1)')], 'Expand (3a − 1)(a + 1) = 3a² + 2a − 1.', {
      noteShona: 'Vhura (3a − 1)(a + 1) = 3a² + 2a − 1.',
    }),
    mkStep([T('8a + 8 = 48a − 16 − 9a² − 6a + 3')], 'Expand the last bracket fully.', {
      noteShona: 'Vhura bracket rekupedzisira zvizere.',
    }),
    mkStep([T('9a² − 34a + 21 = 0')], 'Collect every term on one side to form a quadratic equation.', {
      noteShona: 'Unganidza matemu ese kune rimwe divi kuti uite quadratic equation.',
    }),
    mkStep([T('(a − 3)(9a − 7) = 0')], 'Factorise the quadratic.', {
      noteShona: 'Factorisa quadratic iyi.',
    }),
    mkStep([T('a = 3   or   a = 7⁄9')], 'Set each factor equal to zero and solve for a.', {
      noteShona: 'Isa factor yega yega ive zero wozotsvaga mhinduro dza a.',
      isFinal: true,
    }),
  ],
  answer: 'a = 3 or a = 7⁄9',
  answerSeg: [T('a = 3   or   a = '), F('7', '9')],
  caption: 'Unlike simplifying, solving an equation lets the common denominator disappear — every term is multiplied by the LCM, so it cancels everywhere at once.',
};

// Example 14
const example14 = {
  tag: 'Worked Example 14',
  question: 'Solve the equation 3 ⁄ (x² − 5x + 6) = 2 ⁄ (x² − x − 6).',
  steps: [
    mkStep([F('3', 'x² − 5x + 6'), T(' = '), F('2', 'x² − x − 6')], 'Start with the given equation.', {
      noteShona: 'Tanga ne equation yapiwa.',
    }),
    mkStep([T('= '), F('3', '(x − 2)(x − 3)'), T(' = '), F('2', '(x − 3)(x + 2)')], 'Factorise both denominators.', {
      noteShona: 'Factorisa madenominator ese ari maviri.',
    }),
    mkStep([T('3(x + 2) = 2(x − 2)')], 'Multiply both sides by (x − 2)(x − 3)(x + 2) to clear the fractions.', {
      noteShona: 'Wanza mativi ese maviri ne (x − 2)(x − 3)(x + 2) kuitira kubvisa mafractions.',
    }),
    mkStep([T('3x + 6 = 2x − 4')], 'Expand both sides.', {
      noteShona: 'Vhura mabrackets kumativi ese maviri.',
    }),
    mkStep([T('x = −10')], 'Collect the x-terms on one side and the numbers on the other.', {
      noteShona: 'Unganidza mazwi ane x kune rimwe divi nenhamba kune rimwe divi.',
      isFinal: true,
    }),
  ],
  answer: 'x = −10',
};

// Example 15
const example15 = {
  tag: 'Worked Example 15',
  question: 'Find the values of x for which each fraction is not defined: (a) 3 ⁄ (x + 2)  (b) (2x + 13) ⁄ (3x − 12)  (c) 5x ⁄ [x(5 − x)]  (d) (x² − 2x + 3) ⁄ [(x + 3)(x − 8)].',
  steps: [
    mkStep([F('3', 'x + 2'), T('  is undefined when  x + 2 = 0')], '(a) A fraction is undefined whenever its denominator equals zero.', {
      noteShona: '(a) Fraction hainatsanangurwa chero nguva iyo pasi payo (denominator) paanenge akaenzana ne zero.',
    }),
    mkStep([T('x = −2')], 'So the fraction is not defined when x = −2.', {
      noteShona: 'Saka fraction iyi haina kutsanangurwa kana x = −2.',
      isFinal: true,
    }),
    mkStep([F('2x + 13', '3x − 12'), T('  is undefined when  3x − 12 = 0')], '(b) Set this denominator equal to zero.', {
      noteShona: '(b) Isa denominator iyi ive zero.',
    }),
    mkStep([T('x = 4')], 'Solving gives x = 4.', {
      noteShona: 'Kugadzirisa kunopa x = 4.',
      isFinal: true,
    }),
    mkStep([F('5x', 'x(5 − x)'), T('  is undefined when  x(5 − x) = 0')], '(c) Set this denominator equal to zero.', {
      noteShona: '(c) Isa denominator iyi ive zero.',
    }),
    mkStep([T('x = 0   or   x = 5')], 'Either factor can be zero, so there are two excluded values.', {
      noteShona: 'Factor chero ipi inogona kuva zero, saka pane manhamba maviri asingatenderwi.',
      isFinal: true,
    }),
    mkStep([F('x² − 2x + 3', '(x + 3)(x − 8)'), T('  is undefined when  (x + 3)(x − 8) = 0')], '(d) Set this denominator equal to zero.', {
      noteShona: '(d) Isa denominator iyi ive zero.',
    }),
    mkStep([T('x = −3   or   x = 8')], 'Either factor can be zero, giving two excluded values.', {
      noteShona: 'Factor chero ipi inogona kuva zero, zvichipa manhamba maviri asingatenderwi.',
      isFinal: true,
    }),
  ],
  answer: '(a) x = −2   (b) x = 4   (c) x = 0 or 5   (d) x = −3 or 8',
  caption: 'A fraction is undefined exactly where its denominator is zero — the numerator plays no part in this.',
};

// Example 16
const example16 = {
  tag: 'Worked Example 16',
  question: 'Find the values of x for which a ⁄ x − b ⁄ (x² + 6x − 7) is not defined.',
  steps: [
    mkStep([F('a', 'x'), T(' − '), F('b', 'x² + 6x − 7')], 'Start with the given expression.', {
      noteShona: 'Tanga ne expression yapiwa.',
    }),
    mkStep([T('= '), F('a', 'x'), T(' − '), F('b', '(x − 1)(x + 7)')], 'Factorise the second denominator.', {
      noteShona: 'Factorisa denominator yechipiri.',
    }),
    mkStep([T('x = 0,  1,   or  −7')], 'The expression is undefined wherever any denominator is zero: x itself, or (x − 1)(x + 7).', {
      noteShona: 'Expression iyi haina kutsanangurwa chero pakaita denominator iri zero: x pachayo, kana kuti (x − 1)(x + 7).',
      isFinal: true,
    }),
  ],
  answer: 'x = 0, 1 or −7',
  caption: 'If any part of an expression is undefined, the whole expression is undefined.',
};

// Example 17
const example17 = {
  tag: 'Worked Example 17',
  question: '(a) For what value of x is (x² + 15x + 50) ⁄ (x − 5) not defined? (b) Find the value(s) of x for which the expression is zero.',
  steps: [
    mkStep([F('x² + 15x + 50', 'x − 5')], '(a) The expression is not defined when its denominator is zero.', {
      noteShona: '(a) Expression iyi haina kutsanangurwa kana pasi payo pakaenzana ne zero.',
    }),
    mkStep([T('x = 5')], 'Setting x − 5 = 0 gives the excluded value.', {
      noteShona: 'Kugadzika x − 5 = 0 kunopa nhamba isingatenderwi.',
      isFinal: true,
    }),
    mkStep([F('x² + 15x + 50', 'x − 5'), T(' = 0')], '(b) The expression equals zero exactly when its numerator is zero.', {
      noteShona: '(b) Expression iyi inova zero chaizvo chete kana musoro wayo uri zero.',
    }),
    mkStep([T('x² + 15x + 50 = 0')], 'Multiply both sides by (x − 5) to clear the fraction.', {
      noteShona: 'Wanza mativi ese maviri ne (x − 5) kuitira kubvisa fraction.',
    }),
    mkStep([T('(x + 5)(x + 10) = 0')], 'Factorise the quadratic.', {
      noteShona: 'Factorisa quadratic iyi.',
    }),
    mkStep([T('x = −5   or   x = −10')], 'Set each factor equal to zero and solve.', {
      noteShona: 'Isa factor yega yega ive zero wozotsvaga mhinduro.',
      isFinal: true,
    }),
  ],
  answer: '(a) x = 5   (b) x = −5 or x = −10',
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
  'lowest-terms': {
    bgGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
    borderColor: 'border-b-4 border-sky-700',
    badgeBg: 'bg-sky-400/30 text-white border border-sky-200/40',
    navActiveBg: 'bg-sky-500 border-b-4 border-sky-700 text-white shadow-sm',
    cardBorder: 'border-sky-300',
  },
  'mult-div': {
    bgGradient: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600',
    borderColor: 'border-b-4 border-emerald-700',
    badgeBg: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    navActiveBg: 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm',
    cardBorder: 'border-emerald-300',
  },
  'add-sub': {
    bgGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    borderColor: 'border-b-4 border-amber-700',
    badgeBg: 'bg-amber-400/30 text-white border border-amber-200/40',
    navActiveBg: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm',
    cardBorder: 'border-amber-300',
  },
  'ratio-substitution': {
    bgGradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
    borderColor: 'border-b-4 border-violet-800',
    badgeBg: 'bg-violet-400/30 text-white border border-violet-200/40',
    navActiveBg: 'bg-violet-600 border-b-4 border-violet-800 text-white shadow-sm',
    cardBorder: 'border-violet-300',
  },
  'equations': {
    bgGradient: 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600',
    borderColor: 'border-b-4 border-rose-700',
    badgeBg: 'bg-rose-400/30 text-white border border-rose-200/40',
    navActiveBg: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm',
    cardBorder: 'border-rose-300',
  },
  'undefined': {
    bgGradient: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700',
    borderColor: 'border-b-4 border-cyan-800',
    badgeBg: 'bg-cyan-400/30 text-white border border-cyan-200/40',
    navActiveBg: 'bg-cyan-600 border-b-4 border-cyan-800 text-white shadow-sm',
    cardBorder: 'border-cyan-300',
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
    id: 'lowest-terms',
    eyebrow: 'Chapter 7.1',
    title: 'Lowest Terms',
    heading: 'Simplification of Fractions — Lowest Terms',
    intro:
      'When simplifying algebraic fractions, always fully factorise the numerator and the denominator first. It may then be possible to divide both by any factors they have in common.',
    introShona:
      'Paunorerutsa ma fractions ealgebra, gara watanga nekufactorisa zvizere musoro nepasi. Mushure maizvozvo zvinogona kupatsanurwa nemafactors akafanana.',
    rules: [
      [
        {
          seg: [F('c', '−d'), T('  =  −  '), F('c', 'd')],
          note: 'A minus sign sitting alone in the denominator can be moved out to the front of the whole fraction.',
        },
        {
          seg: [F('−c', 'd'), T('  =  −  '), F('c', 'd')],
          note: 'A minus sign alone in the numerator can also be moved out to the front.',
        },
        {
          seg: [F('c', '−d'), T('  =  '), F('−c', 'd'), T('  =  −  '), F('c', 'd')],
          note: 'All three forms are equal — a lone minus sign can sit in the numerator, the denominator, or out front.',
        },
      ],
      [
        [F('−c', '−d'), T('  =  '), F('c', 'd')],
        [T('(two negative quantities, divided one by the other, give a positive result)')],
      ],
    ],
    examples: [example1, example2, example3],
    practice: [
      'Simplify: 12x²y ⁄ 18xy²',
      'Simplify: (x² − 4) ⁄ (x² + 2x)',
      'Simplify: (a² − b²) ⁄ (a² − 2ab + b²)',
      'Simplify: (2x² − 8) ⁄ (x² − 4x + 4)',
      'Simplify: (x² + xy − 6y²) ⁄ (x² − 3xy + 2y²)',
    ],
  },
  {
    id: 'mult-div',
    eyebrow: 'Chapter 7.1',
    title: 'Multiply & Divide',
    heading: 'Multiplication and Division of Fractions',
    intro:
      'Factorise fully first, then divide the numerator and denominator by any common factors, exactly as with a single fraction. To divide by a fraction, multiply by its reciprocal instead.',
    introShona:
      'Tanga nekufactorisa zvizere, wozopatsanura musoro nepasi nemafactors akafanana. Kuti upatsanure nefraction, wanza nereciprocal (pidigura).',
    examples: [example4, example5, example6],
    practice: [
      '18ab ⁄ 15bc × 20cd ⁄ 24de',
      '(m + n) ⁄ m × mn ⁄ (3m + 3n)',
      '(a² − b²) ⁄ (a² + ab) × 2a³ ⁄ (ab − a²)',
      '(m² − 9) ⁄ (m² − m − 6) × (m² + 2m) ⁄ m²',
      '(m² − n²) ⁄ (m² − 2mn + n²) ÷ (m² + mn) ⁄ (n² − mn)',
    ],
  },
  {
    id: 'add-sub',
    eyebrow: 'Chapter 7.1',
    title: 'Add & Subtract',
    heading: 'Addition and Subtraction of Fractions',
    intro:
      'Find the LCM of the denominators, rewrite every term over it, then combine the numerators into one. Whole numbers and single terms join the LCM too.',
    introShona:
      'Tsvaga LCM yemadenominator, nyora temu yega yega pamusoro payo, wozobatanidza misoro kuita chimwe chete.',
    examples: [example7, example8, example9, example10],
    practice: [
      '3 ⁄ 2ab + 4 ⁄ 3bc',
      '5 − (a − b) ⁄ c',
      '3 ⁄ (2x + y) − 1 ⁄ [3(x + y)]',
      '2 ⁄ (a + 1) − 3',
      '4 ⁄ (x − 3) − 1 ⁄ (x + 2) − (x + 7) ⁄ (x² − x − 6)',
    ],
  },
  {
    id: 'ratio-substitution',
    eyebrow: 'Chapter 7.1',
    title: 'Ratio & Substitution',
    heading: 'Evaluating and Substituting into Fractions',
    intro:
      'Two related skills: turning a ratio like x : y into a fraction x ⁄ y to evaluate an expression, and substituting one algebraic fraction into another.',
    introShona:
      'Unyanzvi huviri hwakafanana: kushandura ratio yakaita sa x : y kuita fraction x ⁄ y, pamwe chete nekuisa fraction mukati meimwe fraction.',
    examples: [example11, example12],
    practice: [
      'If x ⁄ y = ¾, evaluate (2x − y) ⁄ (2x + y).',
      'Given p : q = 9 : 5, evaluate (15p − 2q) ⁄ (5p + 16q).',
      'If a : b = 5 : 3, evaluate (6a + b) ⁄ (a − ⅓b).',
      'If a = (d + 1) ⁄ (d − 1), express (a + 1) ⁄ (a − 1) in terms of d.',
      'If x = (3w − 1) ⁄ (w + 2), express (2x − 3) ⁄ (3x − 1) in terms of w.',
    ],
  },
  {
    id: 'equations',
    eyebrow: 'Chapter 7.2',
    title: 'Equations',
    heading: 'Equations with Fractions',
    intro:
      'To solve an equation with fractions, multiply every term on both sides by the LCM of the denominators so every fraction is cleared completely.',
    introShona:
      'Kuti ugadzirise equation ine mafractions, wanza temu yega yega kumativi ese maviri ne LCM yemadenominator kuitira kubvisa mafractions ese.',
    examples: [example13, example14],
    practice: [
      '3 ⁄ a = a − 2',
      '7⁄3 + 2 ⁄ e = e',
      '4 ⁄ (w + 3) − 3 ⁄ (w + 2) = 0',
      '3 ⁄ (2b − 5) − 4 ⁄ (b − 3) = 0',
      '2 ⁄ (u + 2) = 2 ⁄ (u + 1) − 1 ⁄ (u + 4)',
    ],
  },
  {
    id: 'undefined',
    eyebrow: 'Chapter 7.3',
    title: 'Undefined Fractions',
    heading: 'Undefined Fractions',
    intro:
      'Division by zero is impossible, so a fraction is said to be undefined wherever its denominator equals zero. To find where a fraction equals zero, set its numerator equal to zero.',
    introShona:
      'Kupatsanura ne zero hazvigoneki, saka fraction inonzi haina kutsanangurwa (undefined) pese apo pasi payo panenge pakaenzana ne zero.',
    rules: [
      [[T('A fraction is undefined exactly where its denominator equals zero.')]],
      [[T('A fraction equals zero exactly where its numerator equals zero')], [T('(and the denominator does not).')]],
    ],
    examples: [example15, example16, example17],
    practice: [
      'Find the values of x for which 7 ⁄ (x − 3) is not defined.',
      'Find the values of x for which (3x + 1) ⁄ [(x + 4)(x + 3)] is not defined.',
      'Find the values of x for which (x² + 12x + 36) ⁄ (x² − 3x − 10) is not defined.',
      'For what value of x is A = (3x + 2) ⁄ (x + 3) undefined? For what range of values of x is A < 2?',
      '(a) For what value(s) of x is (2x + 11) ⁄ (x² + x − 20) not defined? (b) For what value(s) of x is the expression zero?',
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
    examples: [example1, example2, example3, example4, example5, example6, example7, example8, example9, example10, example11, example12, example13, example14, example15, example16, example17],
  },
];

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
          {section.rules.map((r: any, i: number) => (
            <DefinitionBox key={i} label={section.rules.length > 1 ? `Rule ${i + 1}` : 'Rule'} lines={r} />
          ))}
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
        {section.examples.map((ex: any, i: number) => (
          <ExampleCard key={i} index={i + 1} example={ex} lang={lang} />
        ))}
      </div>
    )}

    {section.practice && section.practice.length > 0 && <PracticeZone items={section.practice} />}
  </section>
);

export const FractionInAlgebra = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState<'en' | 'sn'>('en');
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];
  const activeTheme = sectionThemes[activeSection.id] || sectionThemes['lowest-terms'];

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
    <div id="fa-scroll-area" className="min-h-screen w-full bg-[#f8fafc] pb-24 font-sans text-slate-900">
      <InkStyles />

      {/* Duolingo-Styled Top Bar Banner with Distinct Topic Colors */}
      <div className={`relative overflow-hidden transition-all duration-300 ${activeTheme.bgGradient} ${activeTheme.borderColor} pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${activeTheme.badgeBg}`}>
                CHAPTER 7
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

      {/* Duolingo-Styled Navigation Bar */}
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-3 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div id="math-topic-rail" data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const theme = sectionThemes[s.id] || sectionThemes['lowest-terms'];
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

export default FractionInAlgebra;
