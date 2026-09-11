// ConsumerArithmetic2.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';

/* =========================================================================
   ICONS (inline SVGs to avoid external dependencies)
   ========================================================================= */
const CircleHelp = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LoaderCircle = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const RotateCcw = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9m0 0-3 3m3-3 3 3" />
  </svg>
);

const Play = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Pause = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const X = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* =========================================================================
   FLAGS (UK & Zimbabwe)
   ========================================================================= */
const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-fa-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="uk-clip-fa-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#uk-clip-fa-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-fa-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const ZwFlag = ({ className = 'h-4 w-6' }) => (
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
   STYLES (injected as <style> tag)
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
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 999px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }
    .custom-scrollbar { scrollbar-width: thin; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .section-enter { animation: gcEnter 320ms ease-out; }
  `}</style>
);

/* =========================================================================
   UTILITY FUNCTIONS
   ========================================================================= */
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const T = (value) => ({ type: 'text', value });
const F = (num, den) => ({ type: 'frac', num, den });

let stepUid = 0;
const nextStepId = () => `cs${stepUid++}`;

const mkStep = (seg: any[], note: string, opts: { noteShona?: string; duration?: number; isFinal?: boolean } = {}) => {
  const len = seg.reduce((s, p) => s + (p.type === 'text' ? p.value.length : p.num.length + p.den.length + 3), 0);
  return {
    id: nextStepId(),
    seg,
    note,
    noteShona: opts.noteShona || '',
    duration: opts.duration ?? Math.max(1800, len * 70),
    isFinal: opts.isFinal ?? false,
  };
};

const glyphMetrics = (char: string) => {
  if (/\s/.test(char)) return { cssWidth: 0.32, viewWidth: 10 };
  if (/[1ilI.,'()$%]/.test(char)) return { cssWidth: 0.4, viewWidth: 13 };
  if (/[mwMW]/.test(char)) return { cssWidth: 0.9, viewWidth: 28 };
  return { cssWidth: 0.66, viewWidth: 21 };
};

const questionSegments = (q: string) => {
  const m = q.match(/(.*?)\s*?⁄\s*?(.*)/);
  if (m) {
    const left = m[1].trim();
    const right = m[2].trim();
    const segs = [];
    const prefixMatch = left.match(/^(.*?)([a-zA-Z0-9]+)$/);
    if (prefixMatch && prefixMatch[1].trim()) {
      segs.push(T(prefixMatch[1].trim()));
      segs.push(F(prefixMatch[2].trim(), right));
    } else {
      segs.push(F(left, right));
    }
    return segs;
  }
  return [T(q)];
};

/* =========================================================================
   SUB-COMPONENTS
   ========================================================================= */

// Handwritten character rendering
const HandwrittenRun = ({ value, progress, compact = false }: { value: string; progress: number; compact?: boolean }) => {
  const chars = Array.from(value);
  return (
    <span
      className={`inline-flex shrink-0 flex-nowrap whitespace-nowrap items-baseline ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
      aria-label={value}
    >
      {chars.map((ch: string, idx: number) => {
        const gp = clamp01(progress * chars.length - idx);
        const { cssWidth, viewWidth } = glyphMetrics(ch);
        if (/\s/.test(ch)) {
          return <span key={idx} aria-hidden="true" style={{ width: `${cssWidth}em` }} />;
        }
        return (
          <svg
            key={idx}
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
              fillOpacity={clamp01((gp - 0.72) / 0.28)}
              stroke="#1e3a8a"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="240"
              strokeDashoffset={240 * (1 - gp)}
            >
              {ch}
            </text>
          </svg>
        );
      })}
    </span>
  );
};

// Single-line math display with handwritten reveal
const MathLine = ({ seg, progress, isFinal }) => {
  const total = seg.reduce((s, p) => s + (p.type === 'text' ? p.value.length : p.num.length + p.den.length + 3), 0);
  const revealed = clamp01(progress) * total;
  let consumed = 0;

  const rendered = seg.map((s, i) => {
    if (s.type === 'text') {
      const len = s.value.length;
      const local = clamp01((revealed - consumed) / Math.max(1, len));
      consumed += len;
      return <HandwrittenRun key={i} value={s.value} progress={local} />;
    }
    const nLen = s.num.length;
    const dLen = s.den.length;
    const nProg = clamp01((revealed - consumed) / Math.max(1, nLen));
    const barProg = clamp01(revealed - consumed - nLen);
    const dProg = clamp01((revealed - consumed - nLen - 1) / Math.max(1, dLen));
    consumed += nLen + dLen + 3;
    return (
      <span key={i} className="mx-1.5 inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap">
        <HandwrittenRun value={s.num} progress={nProg} compact />
        <span className="my-0.5 h-[2px] w-full min-w-5 origin-left bg-blue-900" style={{ transform: `scaleX(${barProg})` }} />
        <HandwrittenRun value={s.den} progress={dProg} compact />
      </span>
    );
  });

  const safe = clamp01(progress);
  const doneFinal = isFinal && safe >= 1;

  return (
    <div
      className={`flex w-full min-w-0 max-w-full flex-nowrap whitespace-nowrap items-center overflow-x-auto overflow-y-hidden py-1.5 custom-scrollbar ${doneFinal ? 'border-b-4 border-double border-red-600 pb-1 pr-2' : ''}`}
    >
      {rendered}
    </div>
  );
};

// Explanation popup (simulated AI)
const StepExplanationHelp = ({ question, stepsThroughCurrent, stepNumber, lang = 'en' }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const thinkingWords = lang === 'sn'
    ? ['Kufunga', 'Kutarisa', 'Kunzvera', 'Kuongorora', 'Kufambisa', 'Kutsvaga', 'Kupimisa', 'Kuverenga', 'Kudzokorora', 'Kuronga']
    : ['Delving', 'Pondering', 'Navigating', 'Unraveling', 'Elucidating', 'Deciphering', 'Charting', 'Weighing', 'Cross-checking', 'Reasoning'];

  useEffect(() => {
    if (!loading) { setThinkingIndex(0); return undefined; }
    const iv = setInterval(() => setThinkingIndex(c => (c + 1) % thinkingWords.length), 850);
    return () => clearInterval(iv);
  }, [loading, thinkingWords]);

  const askForExplanation = () => {
    setOpen(true);
    if (response || loading) return;
    setLoading(true);
    setError('');

    const reachedWork = stepsThroughCurrent.map((step, idx) =>
      `Step ${idx+1}: ${step.seg.map(s => s.type==='text'?s.value:`(${s.num})/(${s.den})`).join('')}\nReason: ${lang==='sn'&&step.noteShona?step.noteShona:step.note}`
    ).join('\n\n');

    // Simulate API call
    setTimeout(() => {
      const selected = stepsThroughCurrent[stepsThroughCurrent.length - 1];
      const stepText = selected.seg.map(s => s.type === 'text' ? s.value : `(${s.num})/(${s.den})`).join('');
      const isShona = lang === 'sn';
      const explanation = isShona
        ? [`Nhanho ino inoratidza kuti ${stepText}.`]
        : [`This step shows that ${stepText}.`];
      setResponse({
        explanation,
        mathLines: [[{ type: 'text', value: stepText }]]
      });
      setLoading(false);
    }, 800);
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
                <span key={thinkingIndex} className="animate-pulse">{thinkingWords[thinkingIndex]}…</span>
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
              {response.explanation.map((p, idx) => (
                <span key={idx} className="gc-ink block text-base font-bold leading-relaxed text-blue-900 sm:text-lg">
                  {p}
                </span>
              ))}
              {response.mathLines.map((line, idx) => (
                <span key={idx} className="block overflow-x-auto rounded-xl bg-[#fffdf5] px-3 py-2">
                  <span className="flex items-center gap-x-1 whitespace-nowrap">
                    {line.map((seg, si) =>
                      seg.type === 'text' ? (
                        <span key={si} className="gc-ink text-base font-bold text-blue-900 sm:text-lg">
                          {seg.value}
                        </span>
                      ) : (
                        <span key={si} className="mx-1 inline-flex flex-col items-center align-middle">
                          <span className="gc-ink text-sm font-bold text-blue-900">{seg.numerator}</span>
                          <span className="my-0.5 h-[2px] w-full min-w-4 bg-blue-900" />
                          <span className="gc-ink text-sm font-bold text-blue-900">{seg.denominator}</span>
                        </span>
                      )
                    )}
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

// Working Player (timeline + steps)
const formatPlayerTime = (ms) => {
  const secs = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
};

const WorkingPlayer = ({ title, steps, caption, question, lang = 'en' }) => {
  const total = useMemo(() => steps.reduce((s, p) => s + p.duration, 0), [steps]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);
  const [isDockVisible, setIsDockVisible] = useState(false);

  // Playback Animation Loop
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let rafId;

    const tick = (now) => {
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
    return steps.map(s => {
      const start = acc;
      acc += s.duration;
      return { ...s, start, end: acc };
    });
  }, [steps]);

  const rows = withRange.map(s => {
    const progress = time <= s.start ? 0 : time >= s.end ? 1 : (time - s.start) / (s.end - s.start);
    return { ...s, progress };
  });

  const activeStepIdx = rows.findIndex((r) => r.progress < 1);
  const currentStepIndex = activeStepIdx === -1 ? rows.length - 1 : activeStepIdx;

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

      <ol className="gc-paper relative min-w-0 overflow-hidden rounded-3xl border-2 border-b-4 border-slate-200 py-6 pl-12 pr-3 shadow-sm sm:pl-14 sm:pr-5">
        <div aria-hidden="true" className="absolute left-6 sm:left-7 top-6 bottom-6 w-0.5 -translate-x-1/2 bg-emerald-200" />
        {rows.map((step, idx) => {
          const started = step.progress > 0;
          const writingProgress = clamp01((step.progress - 0.15) / 0.85);
          const explanationText = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;

          return (
            <li key={step.id} className="relative min-h-28 pb-8 last:pb-2">
              <span
                className={`absolute left-[-1.5rem] sm:left-[-1.75rem] top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black ring-4 ring-[#fbfaf6] z-10 ${started ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}
              >
                {idx + 1}
              </span>
              <div className={`mb-3 flex max-w-4xl items-start gap-2 text-base font-medium leading-relaxed transition-opacity duration-300 ${started ? 'text-slate-700 opacity-100' : 'opacity-0'}`}>
                <p className="min-w-0 flex-1">{explanationText}</p>
                {started && (
                  <StepExplanationHelp
                    question={question}
                    stepsThroughCurrent={steps.slice(0, idx + 1)}
                    stepNumber={idx + 1}
                    lang={lang}
                  />
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

// Static fraction line (no animation)
const StaticFractionLine = ({ seg, align = 'center', answer = false, compact = false }) => (
  <div className={`flex max-w-full flex-nowrap whitespace-nowrap items-center overflow-x-auto overflow-y-hidden py-1 custom-scrollbar ${compact ? 'w-max' : 'w-full'} ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
    {seg.map((s, i) =>
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

// Definition / rule box
const DefinitionBox = ({ lines, label = 'Rule' }) => (
  <div className="my-6 w-full max-w-full overflow-hidden rounded-3xl border-2 border-b-4 border-rose-300 bg-white px-5 py-6 shadow-sm sm:px-7">
    <span className="gc-hand block text-center text-sm font-bold uppercase tracking-wider text-rose-500">{label}</span>
    <div className="mt-3 flex flex-col items-center gap-4 px-1">
      {lines.map((line, i) => {
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

// Example card
const ExampleCard = ({ index, example, lang = 'en' }) => {
  const answerSegs = example.answerSeg || (() => {
    if (typeof example.answer === 'string' && example.answer.includes('⁄')) {
      const m = example.answer.match(/(.*?)\s*?⁄\s*?(.*)/);
      if (m) {
        const left = m[1].trim();
        const right = m[2].trim();
        const pMatch = left.match(/^(.*?)([a-zA-Z0-9]+)$/);
        if (pMatch && pMatch[1].trim()) {
          return [T(pMatch[1].trim()), F(pMatch[2].trim(), right)];
        }
        return [F(left, right)];
      }
    }
    return [T(String(example.answer))];
  })();

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
        <StaticFractionLine seg={answerSegs} align="start" answer />
      </div>
    </article>
  );
};

// Practice zone
const PracticeZone = ({ items }) => (
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
   CONTENT – CONSUMER ARITHMETIC 2 (all examples from images)
   ========================================================================= */

// ---- Example 1: Sales tax (ring) ----
const ex1 = {
  question: 'A gold and diamond ring is advertised as $1495, excluding sales tax. What will be the total cost of the ring?',
  steps: [
    mkStep([T('Ring is a durable item → sales tax = 20%')], 'A ring is a durable good, so the sales tax rate is 20%.', { noteShona: 'Ring ichi ndeyedurable, saka sales tax ndeye 20%.' }),
    mkStep([T('True cost = 120% of $1495')], 'The total cost is 100% of the price plus 20% tax, so 120% of $1495.', { noteShona: 'Mutengo wese ndi 100% yemutengo + 20% tax, saka 120% ye $1495.' }),
    mkStep([T('= '), F('6', '5'), T(' × $1495')], '120% as a fraction is 6⁄5.', { noteShona: '120% se fraction ndi 6⁄5.' }),
    mkStep([T('= $1794')], 'Multiply 6⁄5 × 1495 = 1794. The total cost is $1794.', { noteShona: 'Wanza 6⁄5 × 1495 = 1794. Mutengo wese ndi $1794.', isFinal: true })
  ],
  answer: '$1794',
  caption: 'For durable goods, sales tax is 20% — add it to the base price.'
};

// ---- Example 2: Sales tax (coat) ----
const ex2 = {
  question: 'A coat costs $229.50 including sales tax. How much tax does the Government receive?',
  steps: [
    mkStep([T('Coat is consumable → sales tax = 12.5%')], 'A coat is a consumable item, so the sales tax rate is 12.5%.', { noteShona: 'Coat ndeye consumable, saka sales tax ndeye 12.5%.' }),
    mkStep([T('112.5% of basic cost = $229.50')], 'The price includes the basic cost plus 12.5% tax, so 112.5% of the basic cost equals $229.50.', { noteShona: 'Mutengo unosanganisira basic cost + 12.5% tax, saka 112.5% yebasic cost = $229.50.' }),
    mkStep([T('1% of basic cost = $229.50 ÷ 112.5')], 'Divide to find 1% of the basic cost.', { noteShona: 'Patsanura kuti uwane 1% yebasic cost.' }),
    mkStep([T('12.5% of basic cost = $25.50')], 'Multiply by 12.5 to find the tax amount: $229.50 ÷ 112.5 × 12.5 = $25.50.', { noteShona: 'Wanza ne 12.5 kuti uwane tax: $229.50 ÷ 112.5 × 12.5 = $25.50.', isFinal: true })
  ],
  answer: '$25.50',
  caption: 'When the price includes tax, divide by (100 + rate%) then multiply by the rate.'
};

// ---- Example 3: Income tax (married teacher) ----
const ex3 = {
  question: 'A married teacher has an income of $11,560. He has 4 children and a dependent relative. How much income tax should he pay?',
  steps: [
    mkStep([T('Gross income = $11,560')], 'Start with the gross income.', { noteShona: 'Tanga ne gross income.' }),
    mkStep([T('Abatements: married $3,000 + 4×$600 + $400 = $5,800')], 'Add all abatements: married allowance, children, and dependent relative.', { noteShona: 'Batanidza zvese: married allowance, vana, uye dependent relative.' }),
    mkStep([T('Tax on gross income = $2,379.20')], 'Using the tax table: $100+$120+$140+$160+$180+$200+$220+$240+$260+$280+$300+32% of $560 = $2,379.20', { noteShona: 'Shandisa tafura yemitero.' }),
    mkStep([T('Tax on abatable amount = $860')], 'Tax on $5,800: $100+$120+$140+$160+$180+20% of $800 = $860', { noteShona: 'Mitero pa $5,800.' }),
    mkStep([T('Chargeable tax = $2,379.20 − $860 = $1,519.20')], 'Subtract the tax on abatements from the tax on gross income.', { noteShona: 'Bvisa mitero yeabatements kubva pamitero yegross income.' }),
    mkStep([T('Surcharge = 15% of $1,519.20 = $227.88')], 'Add the 15% surcharge.', { noteShona: 'Wedzera 15% surcharge.' }),
    mkStep([T('Total tax = $1,519.20 + $227.88 = $1,747.08')], 'The total income tax payable is $1,747.08.', { noteShona: 'Mitero yese ndi $1,747.08.', isFinal: true })
  ],
  answer: '$1,747.08',
  caption: 'Income tax = tax on gross income − tax on abatements, then add the surcharge.'
};

// ---- Example 4: Cash discount (refrigerator) ----
const ex4 = {
  question: 'A refrigerator costs $899. A 10% discount is given for cash. What is the cash price?',
  steps: [
    mkStep([T('Discount = 10% of $899')], 'The discount is 10% of the marked price.', { noteShona: 'Discount i 10% yemutengo wakatarwa.' }),
    mkStep([T('= $89.90')], '10% × 899 = 89.90.', { noteShona: '10% × 899 = 89.90.' }),
    mkStep([T('Cash price = $899 − $89.90 = $809.10')], 'Subtract the discount from the original price.', { noteShona: 'Bvisa discount kubva pamutengo wekutanga.', isFinal: true })
  ],
  answer: '$809.10',
  caption: 'Cash price = original price − discount. Or: 90% of $899 = $809.10.'
};

// ---- Example 5: Unit costs (notebooks) ----
const ex5 = {
  question: 'A stationery shop sells notebooks at $1.40 each or 5 for $6. It gives a 35% discount to schools on orders of 100 or more. Calculate the unit costs at the three rates.',
  steps: [
    mkStep([T('1 notebook = $1.40')], 'At the non-discount rate, one notebook costs $1.40.', { noteShona: 'Pasina discount, notebook imwe inodhura $1.40.' }),
    mkStep([T('5 for $6: cost per notebook = $6 ÷ 5 = $1.20')], 'At the bulk rate, each notebook costs $1.20.', { noteShona: 'Pabulk rate, notebook imwe inodhura $1.20.' }),
    mkStep([T('35% discount: 65% of $1.40 = $0.91')], 'With 35% discount, the school pays 65% of $1.40 = $0.91 per notebook.', { noteShona: 'Ne35% discount, chikoro chinobhadhara 65% ye $1.40 = $0.91 panotebook.', isFinal: true })
  ],
  answer: '$1.40, $1.20, $0.91',
  caption: 'Buying in bulk and getting a discount both reduce the unit cost significantly.'
};

// ---- Example 6: Hire purchase (motorbike) ----
const ex6 = {
  question: 'A motorbike costs $2,676 cash. Alternatively it can be bought for 25% deposit and 24 monthly instalments of $115. How much more expensive is it to buy by hire purchase?',
  steps: [
    mkStep([T('Deposit = 25% of $2,676 = $669')], 'Calculate the deposit.', { noteShona: 'Verenga deposit.' }),
    mkStep([T('Instalments = 24 × $115 = $2,760')], 'Total of all monthly payments.', { noteShona: 'Mari yese yemwedzi.' }),
    mkStep([T('HP price = $669 + $2,760 = $3,429')], 'Hire purchase price = deposit + instalments.', { noteShona: 'HP price = deposit + instalments.' }),
    mkStep([T('Difference = $3,429 − $2,676 = $753')], 'The extra cost of hire purchase is $753.', { noteShona: 'Mari yakawedzerwa ne hire purchase ndi $753.', isFinal: true })
  ],
  answer: '$753 more expensive',
  caption: 'Hire purchase costs more than cash because you pay for the "hire" of the item over time.'
};

// ---- Example 7: Electricity bill ----
const ex7 = {
  question: 'A household uses 716 units of electricity. What will be the cost of the electricity?',
  steps: [
    mkStep([T('Units used = 716')], 'Start with the number of units consumed.', { noteShona: 'Tanga ne nhamba yemayunits akashandiswa.' }),
    mkStep([T('Cost of units = 716 × 6.65 = 4,761.4 cents = $47.61')], 'Multiply units by the rate per unit.', { noteShona: 'Wanza mayunits ne rate paunit.' }),
    mkStep([T('Fixed monthly charge = $7.30')], 'Add the fixed monthly charge.', { noteShona: 'Wedzera fixed monthly charge.' }),
    mkStep([T('Subtotal = $47.61 + $7.30 = $54.91')], 'Sum of usage charge and fixed charge.', { noteShona: 'Huwandu hwemari yekushandisa ne fixed charge.' }),
    mkStep([T('10% surcharge = $5.49')], '10% of $54.91 = $5.49.', { noteShona: '10% ye $54.91 = $5.49.' }),
    mkStep([T('Total = $54.91 + $5.49 = $60.40')], 'The total electricity bill is $60.40.', { noteShona: 'Bhari yemagetsi ndi $60.40.', isFinal: true })
  ],
  answer: '$60.40',
  caption: 'Electricity bills include: units used × rate + fixed charge + 10% surcharge.'
};

// ---- Example 8: Water bill (Scale W1) ----
const ex8 = {
  question: 'Find the bill for 48 m³ of water when calculated by Scale W1.',
  steps: [
    mkStep([T('48 = 13 + 26 + 9')], 'Break 48 into the three tiers: 13, 26, 9.', { noteShona: 'Patsanura 48 kuita zvikamu zvitatu: 13, 26, 9.' }),
    mkStep([T('(13 × 36.5) + (26 × 48.5) + (9 × 60)')], 'Apply the rates for each tier.', { noteShona: 'Shandisa rate pane chikamu chimwe nechimwe.' }),
    mkStep([T('= 474.5 + 1261.5 + 540 = 2,275.5 cents')], 'Calculate each part.', { noteShona: 'Verenga chikamu chimwe nechimwe.' }),
    mkStep([T('= $22.755 → $22.76')], 'Convert cents to dollars.', { noteShona: 'Chinja cents kuva madhora.', isFinal: true })
  ],
  answer: '$22.76',
  caption: 'Water is charged in tiers: the first 13 m³ at one rate, the next 26 m³ at a higher rate, and the rest at the highest rate.'
};

// ---- Example 9: Water bill W2 and W3 ----
const ex9 = {
  question: 'Find the bill for 48 m³ of water when calculated by (a) Scale W2, (b) Scale W3.',
  steps: [
    mkStep([T('Scale W2: 48 × 48.5 = 2,328 cents = $23.28')], 'Scale W2 has a flat rate of 48.5 cents per m³.', { noteShona: 'Scale W2 ine flat rate ye 48.5 cents pam³.' }),
    mkStep([T('Scale W3: 48 × 57.5 = 2,760 cents = $27.60')], 'Scale W3 has a flat rate of 57.5 cents per m³.', { noteShona: 'Scale W3 ine flat rate ye 57.5 cents pam³.', isFinal: true })
  ],
  answer: 'W2: $23.28, W3: $27.60',
  caption: 'Different user types pay different rates — commercial and outside-municipal users pay more.'
};

// ---- Example 10: Rates bill ----
const ex10 = {
  question: 'Check that the rates bill is correct: Land $6,610 at 1,166c, Improvements $15,490 at 0.818c, Refuse removal $25.25.',
  steps: [
    mkStep([T('Land: 6,610 × 1,166c = $77.07')], 'Calculate land charge.', { noteShona: 'Verenga mari yevhu.' }),
    mkStep([T('Improvements: 15,490 × 0.818c = $126.71')], 'Calculate improvements charge.', { noteShona: 'Verenga mari yezvivakwa.' }),
    mkStep([T('Refuse removal: $25.25')], 'Fixed charge for refuse removal.', { noteShona: 'Mari yekubvisa marara.' }),
    mkStep([T('Total = $77.07 + $126.71 + $25.25 = $229.03')], 'The total owners charges are $229.03.', { noteShona: 'Mari yese ndi $229.03.', isFinal: true })
  ],
  answer: '$229.03',
  caption: 'Rates bills include land, improvements, and refuse removal charges.'
};

// ---- Example 11: Insurance premium ----
const ex11 = {
  question: 'Referring to the travel insurance table, what would be the premium for a traveller who wishes to insure himself for 2 weeks?',
  steps: [
    mkStep([T('2 weeks = 14 days')], 'Convert weeks to days.', { noteShona: 'Chinja mavhiki kuva mazuva.' }),
    mkStep([T('14 days falls in the 12–17 days range')], 'Find the correct range in the table.', { noteShona: 'Tsvaga range chaiyo mutafura.' }),
    mkStep([T('Premium = $23.40')], 'The premium for 12–17 days is $23.40.', { noteShona: 'Premium ye 12–17 mazuva ndi $23.40.', isFinal: true })
  ],
  answer: '$23.40',
  caption: 'There is no reduction in premium if the time period is less than the upper limit of the range.'
};

// ---- Example 12: Insurance compensation ----
const ex12 = {
  question: 'A traveller has luggage valued at $450 and $210 in travellers\' cheques stolen. What compensation could he expect?',
  steps: [
    mkStep([T('Luggage loss → Benefit D: up to $800')], 'Benefit D covers loss of luggage up to $800.', { noteShona: 'Benefit D inobhadhara kurasikirwa nemukwende.' }),
    mkStep([T('Compensation for luggage = $450')], 'The traveller receives the actual value lost, up to the maximum.', { noteShona: 'Anogamuchira mari chaiyo yakarasika.' }),
    mkStep([T('Money loss → Benefit G: up to $500')], 'Benefit G covers loss of money up to $500.', { noteShona: 'Benefit G inobhadhara kurasikirwa nemari.' }),
    mkStep([T('Compensation for money = $210')], 'The traveller receives the actual amount stolen.', { noteShona: 'Anogamuchira mari chaiyo yakabiwa.' }),
    mkStep([T('Total compensation = $450 + $210 = $660')], 'Total compensation is $660.', { noteShona: 'Mari yese ndi $660.', isFinal: true })
  ],
  answer: '$660',
  caption: 'Compensation is paid on the actual value of losses, not on the maximum insurable amount.'
};

// ---- Example 13: Mortgage ----
const ex13 = {
  question: 'A house buyer borrows $50,000 from the Building Society to buy a $70,000 property. The mortgage is over 25 years with monthly repayments of $576.39. (a) How much was the deposit? (b) What is the total amount repaid? (c) How much does the house buyer pay altogether?',
  steps: [
    mkStep([T('Deposit = $70,000 − $50,000 = $20,000')], 'The deposit is the difference between the property price and the loan.', { noteShona: 'Deposit ndiyo mutsauko pakati pemutengo weimba nechikwereti.' }),
    mkStep([T('Total repayments = $576.39 × 12 × 25 = $172,917')], 'Multiply monthly payment by months per year by years.', { noteShona: 'Wanza monthly payment ne mwedzi pagore nemakore.' }),
    mkStep([T('Total cost = $172,917 + $20,000 = $192,917')], 'Add the deposit to the total repayments.', { noteShona: 'Wedzera deposit kune total repayments.', isFinal: true })
  ],
  answer: '(a) $20,000 (b) $172,917 (c) $192,917',
  caption: 'A mortgage costs much more than the loan amount because of interest over many years.'
};

// ---- Example 14: Profit from farming ----
const ex14 = {
  question: 'Use the household cash account to calculate the profit that the household made from farming.',
  steps: [
    mkStep([T('Income from farming = $247.17')], 'Find the farming income from the cash account.', { noteShona: 'Tsvaga mari yekurima kubva mucash account.' }),
    mkStep([T('Farm costs = $58.00')], 'Find the farming expenses from the cash account.', { noteShona: 'Tsvaga mari yekurima yakashandiswa.' }),
    mkStep([T('Profit = $247.17 − $58.00 = $189.17')], 'Profit = income − expenses.', { noteShona: 'Profit = income − expenses.', isFinal: true })
  ],
  answer: '$189.17',
  caption: 'Keeping accurate cash accounts helps you see which activities are profitable.'
};

// ---- Example 15: Operating profit/loss ----
const ex15 = {
  question: 'Use the transport co-operative cash account to find the operating profit or loss during June.',
  steps: [
    mkStep([T('Cash brought forward (May) = $8,176.38')], 'This is the cash balance from the previous month.', { noteShona: 'Iyi ndiyo mari yakasara kubva mwedzi wapfuura.' }),
    mkStep([T('Cash carried forward (July) = $9,664.07')], 'This is the cash balance at the end of June.', { noteShona: 'Iyi ndiyo mari yasara pakupera kwaJune.' }),
    mkStep([T('Operating profit = $9,664.07 − $8,176.38 = $1,487.69')], 'Profit = cash carried forward − cash brought forward.', { noteShona: 'Profit = cash carried forward − cash brought forward.', isFinal: true })
  ],
  answer: '$1,487.69 profit',
  caption: 'If cash carried forward is less than cash brought forward, a trading loss occurred.'
};

/* =========================================================================
   SECTIONS & THEMES
   ========================================================================= */
const sectionThemes = {
  taxation: {
    bgGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
    borderColor: 'border-b-4 border-sky-700',
    badgeBg: 'bg-sky-400/30 text-white border border-sky-200/40',
    navActiveBg: 'bg-sky-500 border-b-4 border-sky-700 text-white shadow-sm',
    cardBorder: 'border-sky-300'
  },
  'household-bills': {
    bgGradient: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600',
    borderColor: 'border-b-4 border-emerald-700',
    badgeBg: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    navActiveBg: 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm',
    cardBorder: 'border-emerald-300'
  },
  'hire-purchase': {
    bgGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    borderColor: 'border-b-4 border-amber-700',
    badgeBg: 'bg-amber-400/30 text-white border border-amber-200/40',
    navActiveBg: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm',
    cardBorder: 'border-amber-300'
  },
  'electricity-water': {
    bgGradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
    borderColor: 'border-b-4 border-violet-800',
    badgeBg: 'bg-violet-400/30 text-white border border-violet-200/40',
    navActiveBg: 'bg-violet-600 border-b-4 border-violet-800 text-white shadow-sm',
    cardBorder: 'border-violet-300'
  },
  'household-rates': {
    bgGradient: 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600',
    borderColor: 'border-b-4 border-rose-700',
    badgeBg: 'bg-rose-400/30 text-white border border-rose-200/40',
    navActiveBg: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm',
    cardBorder: 'border-rose-300'
  },
  insurance: {
    bgGradient: 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700',
    borderColor: 'border-b-4 border-cyan-800',
    badgeBg: 'bg-cyan-400/30 text-white border border-cyan-200/40',
    navActiveBg: 'bg-cyan-600 border-b-4 border-cyan-800 text-white shadow-sm',
    cardBorder: 'border-cyan-300'
  },
  mortgages: {
    bgGradient: 'bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900',
    borderColor: 'border-b-4 border-indigo-950',
    badgeBg: 'bg-indigo-400/30 text-white border border-indigo-200/40',
    navActiveBg: 'bg-indigo-600 border-b-4 border-indigo-800 text-white shadow-sm',
    cardBorder: 'border-indigo-300'
  },
  budgeting: {
    bgGradient: 'bg-gradient-to-r from-lime-600 via-green-600 to-emerald-700',
    borderColor: 'border-b-4 border-lime-800',
    badgeBg: 'bg-lime-400/30 text-white border border-lime-200/40',
    navActiveBg: 'bg-lime-600 border-b-4 border-lime-800 text-white shadow-sm',
    cardBorder: 'border-lime-300'
  }
};

const sections = [
  {
    id: 'taxation',
    eyebrow: 'Chapter 12.1',
    title: 'Taxation',
    heading: 'Taxation — Sales Tax & Income Tax',
    intro: 'A tax is a financial contribution which people are legally obliged to make to the State. The Government uses taxes to pay for services such as education, health, public transport and national defence.',
    introShona: 'Muteri (tax) imari yavanhu vanosungirwa nemutemo kupa Hurumende. Hurumende inoshandisa mitero kubhadhara zvinhu sezvivako, hutano, zvekufambisa uye kuchengetedza nyika.',
    rules: [
      [
        { seg: [T('Sales tax on consumable goods = 12.5% (1⁄8)')], note: 'Clothing, petrol, and other consumables.' },
        { seg: [T('Sales tax on durable goods = 20% (1⁄5)')], note: 'Cars, furniture, and other durables.' }
      ],
      [
        { seg: [T('Income tax = tax on gross income − tax on abatements')], note: 'Then add 15% surcharge.' }
      ]
    ],
    examples: [ex1, ex2, ex3],
    practice: [
      'A TV set costs $850 excluding sales tax. What is the total cost? (TV is durable)',
      'A pair of jeans costs $45 including sales tax. How much tax is paid? (consumable)',
      'A single person earns $8,000 per year with $2,000 abatements. Calculate the income tax.'
    ]
  },
  {
    id: 'household-bills',
    eyebrow: 'Chapter 12.2',
    title: 'Household Bills',
    heading: 'Discounts and Unit Costs',
    intro: 'A discount is a reduction in price given to encourage sales. Cash discounts are common, and buying in bulk often reduces the unit cost.',
    introShona: 'Discount (kuderedza mutengo) inoitwa kuti zvinhu zvitengeseke. Discount yecash inowanzoitika, uye kutenga zvakawanda kunoderedza mutengo wechinhu chimwe chete.',
    examples: [ex4, ex5],
    practice: [
      'A sofa costs $550. A 15% cash discount is given. What is the cash price?',
      'A shop sells pens at $0.80 each or 10 for $7. What is the unit cost for the bulk buy?',
      'A school gets a 25% discount on books priced at $12 each. What does the school pay per book?'
    ]
  },
  {
    id: 'hire-purchase',
    eyebrow: 'Chapter 12.3',
    title: 'Hire Purchase',
    heading: 'Hire Purchase — Paying in Instalments',
    intro: 'Expensive items such as cars and television sets are often bought through hire purchase — paying a deposit and then instalments over time. This costs more than paying cash.',
    introShona: 'Zvinhu zvinodhura zvakaita semotokari neterevhizheni zvinowanzotengwa ne hire purchase — kubhadhara deposit yekutanga uye wobva wabhadhara instalments nenguva. Izvi zvinodhura kupfuura kubhadhara cash.',
    examples: [ex6],
    practice: [
      'A laptop costs $1,200 cash. HP terms: 20% deposit and 18 monthly payments of $75. How much more is HP?',
      'A fridge costs $850 cash or $150 deposit and 24 payments of $35. Find the HP price and the extra cost.'
    ]
  },
  {
    id: 'electricity-water',
    eyebrow: 'Chapter 12.4',
    title: 'Electricity & Water',
    heading: 'Electricity and Water Charges',
    intro: 'Electricity is measured in kilowatt-hours (kWh), water in cubic metres (m³). Bills include usage charges, fixed charges, and often a surcharge.',
    introShona: 'Magetsi anoyerwa ne kilowatt-hours (kWh), mvura inoyerwa ne cubic metres (m³). Bhari dzinosanganisira mari yekushandisa, fixed charge, uye kazhinji surcharge.',
    examples: [ex7, ex8, ex9],
    practice: [
      'A household uses 520 units of electricity. Calculate the bill (rate 6.65¢/unit, fixed $7.30, 10% surcharge).',
      'Calculate the water bill for 35 m³ using Scale W1.',
      'What is the bill for 60 m³ of water using Scale W2?'
    ]
  },
  {
    id: 'household-rates',
    eyebrow: 'Chapter 12.5',
    title: 'Household Rates',
    heading: 'Household Rates (Owners Charges)',
    intro: 'Property owners pay rates for services like road maintenance, refuse removal, and public amenities. Rates are calculated on land value, improvements, and a fixed refuse charge.',
    introShona: 'Varidzi vezvivakwa vanobhadhara rates (mari yezvivakwa) kuti vawane masevhisi akaita semigwagwa, kubvisa marara, uye zvivakwa zveveruzhinji.',
    examples: [ex10],
    practice: [
      'A property has land value $8,000 and improvements $12,000. Calculate the rates bill (land 1,166c, improvements 0.818c, refuse $25.25).',
      'If rates increase to land 1,225c and improvements 0.922c, what is the new bill?'
    ]
  },
  {
    id: 'insurance',
    eyebrow: 'Chapter 12.6',
    title: 'Insurance',
    heading: 'Insurance — Protection Against Loss',
    intro: 'Insurance is a contract that protects you from financial loss. You pay a premium, and the insurer compensates you for covered losses.',
    introShona: 'Insurance (inishuwarenzi) chibvumirano chinokudzivirira kubva pakurasikirwa nemari. Unobhadhara premium, uye inishuwarenzi inokubhadharira kurasikirwa kwakafukidzwa.',
    examples: [ex11, ex12],
    practice: [
      'Using the travel insurance table, find the premium for a 3-week trip.',
      'A traveller has $600 in luggage and $300 in cash stolen. How much compensation do they get?'
    ]
  },
  {
    id: 'mortgages',
    eyebrow: 'Chapter 12.7',
    title: 'Mortgages',
    heading: 'Mortgages — Borrowing to Buy Property',
    intro: 'A mortgage is a loan from a building society to buy property. You pay interest on the loan and repay the capital over many years.',
    introShona: 'Mortgage (chikwereti cheimba) chikwereti chinobva kubuilding society kutenga zvivakwa. Unobhadhara interest pachikwereti uye unodzosa capital kwemakore mazhinji.',
    examples: [ex13],
    practice: [
      'A buyer borrows $60,000 to buy an $85,000 house. Monthly repayments are $690 for 25 years. (a) What is the deposit? (b) What is the total repaid?',
      'A building society charges $12.50 per $1,000 borrowed per month. What is the monthly payment on a $45,000 mortgage?'
    ]
  },
  {
    id: 'budgeting',
    eyebrow: 'Chapter 12.8',
    title: 'Budgeting',
    heading: 'Budgeting — Keeping Cash Accounts',
    intro: 'Budgeting means planning your income and expenditure. Cash accounts help you track money coming in and going out, so you can see if you are making a profit or loss.',
    introShona: 'Budgeting (kuronga mari) zvinoreva kuronga mari yaunowana neyaushandisa. Cash accounts zvinobatsira kuona mari inopinda neinobuda, kuti uone kana uri kuita profit kana loss.',
    examples: [ex14, ex15],
    practice: [
      'From a cash account, farming income is $320 and farm costs are $95. What is the profit?',
      'A business has cash brought forward of $5,200 and cash carried forward of $6,800. What is the operating profit?'
    ]
  }
];

/* =========================================================================
   SECTION COMPONENT (renders a single section)
   ========================================================================= */
const Section = ({ section, lang = 'en' }) => {
  return (
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
            {section.rules.map((r, i) => (
              <DefinitionBox key={i} label={section.rules.length > 1 ? `Rule ${i+1}` : 'Rule'} lines={r} />
            ))}
          </div>
        )}
      </div>

      {section.examples && section.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
            {lang === 'sn' ? 'Mienzaniso Yakagadziriswa' : 'Worked Examples'}
          </h3>
          {section.examples.map((ex, i) => (
            <ExampleCard key={i} index={i + 1} example={ex} lang={lang} />
          ))}
        </div>
      )}

      {section.practice && section.practice.length > 0 && (
        <PracticeZone items={section.practice} />
      )}
    </section>
  );
};

/* =========================================================================
   MAIN COMPONENT – ConsumerArithmetic2
   ========================================================================= */
export const ConsumerArithmetic2 = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState('en');

  const activeIndex = Math.max(0, sections.findIndex(s => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];
  const activeTheme = sectionThemes[activeSection.id] || sectionThemes.taxation;

  const handleNavigate = (id) => {
    setActive(id);
    requestAnimationFrame(() => {
      const lessonScrollArea = document.getElementById('lesson-scroll-area');
      if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };

  const goNext = () => {
    const n = sections[activeIndex + 1];
    if (n) handleNavigate(n.id);
  };
  const goPrev = () => {
    const p = sections[activeIndex - 1];
    if (p) handleNavigate(p.id);
  };

  return (
    <div id="fa-scroll-area" className="min-h-screen w-full bg-[#f8fafc] pb-24 font-sans text-slate-900">
      <InkStyles />

      {/* Top Banner */}
      <div className={`relative overflow-hidden transition-all duration-300 ${activeTheme.bgGradient} ${activeTheme.borderColor} pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${activeTheme.badgeBg}`}>
                CHAPTER 12
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                O-Level Mathematics
              </span>
            </div>

            {/* Language Switcher */}
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

      {/* Navigation Rail — Left-aligned flush, 4 topics visible on mobile */}
      <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2 sm:py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div
            id="math-topic-rail"
            data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s) => {
              const theme = sectionThemes[s.id] || sectionThemes.taxation;
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

      {/* Main Content */}
      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-10 md:px-8 lg:px-10">
        <div key={`${activeSection.id}-${lang}`}>
          <Section section={activeSection} lang={lang} />
        </div>

        {/* Prev / Next Footer */}
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

export default ConsumerArithmetic2;
