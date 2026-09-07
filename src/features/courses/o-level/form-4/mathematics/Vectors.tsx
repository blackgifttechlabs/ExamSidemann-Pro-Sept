import React, { useState, useRef, useEffect, useMemo } from 'react';

/* =========================================================================
   FONTS + SHARED STYLES
   ========================================================================= */
const InkStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
      .gc-hand { font-family: 'Patrick Hand', cursive; }
      .gc-ink { font-family: 'Kalam', cursive; }
      .gc-timeline { appearance: none; -webkit-appearance: none; height: 4px; border-radius: 999px; outline: none; }
      .gc-timeline::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 0; border-radius: 999px; background: #171717; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.28); }
      .gc-timeline::-moz-range-thumb { width: 18px; height: 18px; border: 0; border-radius: 999px; background: #171717; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,.28); }
    `}</style>
);

/* =========================================================================
   FLAG ICONS
   ========================================================================= */
const UkFlag = ({ className = 'h-4 w-6' }) => (
    <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
        <clipPath id="uk-clip-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
        <clipPath id="uk-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
        <g clipPath="url(#uk-clip-s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4" />
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
    </svg>
);

/* =========================================================================
   GEOMETRY + PIXEL TRANSFORM
   Diagram builders describe everything in plain maths coordinates (x
   across, y up), exactly as in the textbook. A single transform converts
   those maths coordinates into a fixed pixel canvas at render time, so
   every visual property (stroke width, font size, arrowhead size, dash
   pattern) is a real, constant pixel value — never a value that has to be
   guessed relative to the data's numeric range.
   ========================================================================= */
type Pt = { x: number; y: number };
const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

const CANVAS_W = 700;
const CANVAS_H = 480;
const CANVAS_PAD = 46;

type Transform = { toPx: (p: Pt) => Pt; scale: number };

function makeTransform(xRange: [number, number], yRange: [number, number]): Transform {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;
    const scaleX = (CANVAS_W - CANVAS_PAD * 2) / (xMax - xMin);
    const scaleY = (CANVAS_H - CANVAS_PAD * 2) / (yMax - yMin);
    const scale = Math.min(scaleX, scaleY);
    const originX = CANVAS_PAD - xMin * scale;
    const originY = CANVAS_H - CANVAS_PAD + yMin * scale;
    return {
        scale,
        toPx: (p: Pt) => ({ x: originX + p.x * scale, y: originY - p.y * scale }),
    };
}

/* =========================================================================
   ACTION CREATORS
   Each of these is one "beat" the animation plays through in order: a
   point appearing, a vector being drawn with its arrowhead, a dashed
   guide line, a shaded shape, or a plain text label. Points are stored in
   plain maths coordinates — the pixel transform is applied at render time.
   ========================================================================= */
let uidCounter = 0;
const nextId = () => `vc${uidCounter++}`;

const mkVector = (from: Pt, to: Pt, label: string, narration: string, opts: any = {}) => ({
    id: nextId(), kind: 'vector', from, to, label, narration,
    length: dist(from, to), duration: opts.duration ?? 1000,
    color: opts.color ?? '#1e3a8a', width: opts.width ?? 3,
    dashed: opts.dashed ?? false,
    labelOffset: opts.labelOffset ?? { x: 14, y: -10 },
});

const mkPoint = (p: Pt, label: string, narration: string, opts: any = {}) => ({
    id: nextId(), kind: 'point', p, label, narration,
    duration: opts.duration ?? 380, color: opts.color ?? '#0f172a',
    labelOffset: opts.labelOffset ?? { x: 12, y: -12 }, radius: opts.radius ?? 5,
});

const mkGuide = (from: Pt, to: Pt, narration: string, opts: any = {}) => ({
    id: nextId(), kind: 'guide', from, to, narration, duration: opts.duration ?? 550, color: opts.color ?? '#f59e0b',
});

const mkShape = (points: Pt[], narration: string, opts: any = {}) => ({
    id: nextId(), kind: 'shape', points, narration, duration: opts.duration ?? 500,
    fill: opts.fill ?? 'rgba(30,58,138,0.06)', stroke: opts.stroke ?? '#1e3a8a',
});

/* =========================================================================
   RENDERING A SINGLE ACTION (pixel space)
   ========================================================================= */
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const ActionShape = ({ action, progress, tx }: any) => {
    if (action.kind === 'point') {
        const p = tx.toPx(action.p);
        const s = Math.min(1, progress * 1.6);
        return (
            <g style={{ opacity: Math.min(1, progress * 3) }}>
                <circle cx={p.x} cy={p.y} r={action.radius * s} fill={action.color} />
                {action.label && (
                    <text x={p.x + action.labelOffset.x} y={p.y + action.labelOffset.y} className="gc-hand" fontSize="17" fill={action.color}>{action.label}</text>
                )}
            </g>
        );
    }
    if (action.kind === 'shape') {
        const pts = action.points.map((p: Pt) => tx.toPx(p));
        const ptsStr = pts.map((p: Pt) => `${p.x},${p.y}`).join(' ');
        return <polygon points={ptsStr} fill={action.fill} stroke={action.stroke} strokeWidth={1.5} style={{ opacity: Math.min(1, progress * 1.6) }} />;
    }
    if (action.kind === 'guide') {
        const from = tx.toPx(action.from), to = tx.toPx(action.to);
        return <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={action.color} strokeWidth={1.5} strokeDasharray="4 4" style={{ opacity: Math.min(1, progress * 2) }} />;
    }
    // vector
    const from = tx.toPx(action.from), to = tx.toPx(action.to);
    const lineT = Math.min(1, progress / 0.82);
    const headT = Math.max(0, (progress - 0.72) / 0.28);
    const tip = lerp(from, to, lineT);
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLen = 12, headAngle = 0.5;
    const endX = to.x - headLen * 0.3 * Math.cos(angle);
    const endY = to.y - headLen * 0.3 * Math.sin(angle);
    const p1 = { x: endX - headLen * Math.cos(angle - headAngle), y: endY - headLen * Math.sin(angle - headAngle) };
    const p2 = { x: endX - headLen * Math.cos(angle + headAngle), y: endY - headLen * Math.sin(angle + headAngle) };
    return (
        <g>
            <line x1={from.x} y1={from.y} x2={tip.x} y2={tip.y} stroke={action.color} strokeWidth={action.width} strokeDasharray={action.dashed ? '7 6' : 'none'} strokeLinecap="round" />
            {headT > 0 && <polygon points={`${to.x},${to.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`} fill={action.color} style={{ opacity: Math.min(1, headT * 3) }} />}
            {action.label && headT > 0.15 && (
                <text x={(from.x + to.x) / 2 + action.labelOffset.x} y={(from.y + to.y) / 2 + action.labelOffset.y} className="gc-hand" fontSize="17" fill={action.color} style={{ opacity: Math.min(1, (headT - 0.15) * 3) }}>{action.label}</text>
            )}
        </g>
    );
};

/* =========================================================================
   COORDINATE-PLANE BACKGROUND (grid, axes, ticks) — pixel space
   ========================================================================= */
const GridBackground = ({ xRange = [-1, 6], yRange = [-1, 6], tx }: { xRange: [number, number]; yRange: [number, number]; tx: Transform }) => {
    const [xMin, xMax] = xRange, [yMin, yMax] = yRange;
    const vLines: number[] = [], hLines: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) if (x !== 0) vLines.push(x);
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) if (y !== 0) hLines.push(y);

    const originPx = tx.toPx({ x: 0, y: 0 });
    const xAxisStart = tx.toPx({ x: xMin, y: 0 });
    const xAxisEnd = tx.toPx({ x: xMax, y: 0 });
    const yAxisStart = tx.toPx({ x: 0, y: yMin });
    const yAxisEnd = tx.toPx({ x: 0, y: yMax });

    return (
        <g>
            {vLines.map((x) => {
                const a = tx.toPx({ x, y: yMin }), b = tx.toPx({ x, y: yMax });
                return <line key={`v${x}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />;
            })}
            {hLines.map((y) => {
                const a = tx.toPx({ x: xMin, y }), b = tx.toPx({ x: xMax, y });
                return <line key={`h${y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />;
            })}
            <line x1={xAxisStart.x} y1={xAxisStart.y} x2={xAxisEnd.x} y2={xAxisEnd.y} stroke="#1f2937" strokeWidth="2" />
            <line x1={yAxisStart.x} y1={yAxisStart.y} x2={yAxisEnd.x} y2={yAxisEnd.y} stroke="#1f2937" strokeWidth="2" />
            <polygon points={`${xAxisEnd.x},${xAxisEnd.y} ${xAxisEnd.x - 9},${xAxisEnd.y - 5} ${xAxisEnd.x - 9},${xAxisEnd.y + 5}`} fill="#1f2937" />
            <polygon points={`${yAxisEnd.x},${yAxisEnd.y} ${yAxisEnd.x - 5},${yAxisEnd.y + 9} ${yAxisEnd.x + 5},${yAxisEnd.y + 9}`} fill="#1f2937" />
            <text x={xAxisEnd.x + 10} y={xAxisEnd.y + 5} className="gc-hand" fontSize="18" fill="#1f2937">x</text>
            <text x={yAxisEnd.x + 8} y={yAxisEnd.y - 6} className="gc-hand" fontSize="18" fill="#1f2937">y</text>
            <text x={originPx.x - 12} y={originPx.y + 16} className="gc-hand" fontSize="13" fill="#6b7280">O</text>
            {vLines.map((v) => {
                const p = tx.toPx({ x: v, y: 0 });
                return (
                    <g key={`vt${v}`}>
                        <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 4} stroke="#1f2937" strokeWidth="1.5" />
                        <text x={p.x} y={p.y + 20} className="gc-hand" fontSize="14" fill="#4b5563" textAnchor="middle">{v}</text>
                    </g>
                );
            })}
            {hLines.map((v) => {
                const p = tx.toPx({ x: 0, y: v });
                return (
                    <g key={`ht${v}`}>
                        <line x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} stroke="#1f2937" strokeWidth="1.5" />
                        <text x={p.x - 10} y={p.y + 5} className="gc-hand" fontSize="14" fill="#4b5563" textAnchor="end">{v}</text>
                    </g>
                );
            })}
        </g>
    );
};

/* =========================================================================
   VECTOR PLAYER — the animated, scrubbable diagram
   ========================================================================= */
const formatPlayerTime = (ms: number) => {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const VectorPlayer = ({ title, xRange = [-1, 7], yRange = [-1, 6], actions, caption }: any) => {
    const total = useMemo(() => actions.reduce((s: number, a: any) => s + a.duration, 0), [actions]);
    const [time, setTime] = useState(total);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const rafRef = useRef<number | null>(null);
    const lastRef = useRef(0);

    useEffect(() => {
        if (!playing) return undefined;
        lastRef.current = performance.now();
        const tick = (now: number) => {
            const dt = now - lastRef.current;
            lastRef.current = now;
            setTime((t) => {
                const nt = t + dt * speed;
                if (nt >= total) { setPlaying(false); return total; }
                return nt;
            });
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
    }, [playing, speed, total]);

    const withRange = useMemo(() => {
        let acc = 0;
        return actions.map((a: any) => { const start = acc; acc += a.duration; return { ...a, start, end: acc }; });
    }, [actions]);

    const tx = useMemo(() => makeTransform(xRange, yRange), [xRange, yRange]);

    const narrations = withRange.filter((a: any) => a.narration && time >= a.start);
    const toggle = () => { if (time >= total) { setTime(0); setPlaying(true); } else setPlaying((p) => !p); };
    const restart = () => { setTime(0); setPlaying(true); };
    const timelinePercent = total > 0 ? (time / total) * 100 : 0;

    return (
        <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
            {title && <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{title}</div>}
            <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <div className="min-w-0 border-b border-slate-100 bg-slate-50 p-3 md:border-b-0 md:border-r">
                    <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="xMidYMid meet" className="h-auto w-full">
                        <GridBackground xRange={xRange} yRange={yRange} tx={tx} />
                        {withRange.map((a: any) => {
                            if (time < a.start) return null;
                            const progress = a.end === a.start ? 1 : clamp01((time - a.start) / (a.end - a.start));
                            return <ActionShape key={a.id} action={a} progress={progress} tx={tx} />;
                        })}
                    </svg>
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 pb-3 pt-4 shadow-sm">
                        <input
                            type="range" min={0} max={total} value={time}
                            onChange={(e) => { setPlaying(false); setTime(Number(e.target.value)); }}
                            aria-label="Diagram timeline"
                            className="gc-timeline block w-full cursor-pointer"
                            style={{ background: `linear-gradient(to right, #262626 0%, #262626 ${timelinePercent}%, #c9c9c9 ${timelinePercent}%, #c9c9c9 100%)` }}
                        />
                        <div className="mt-2 flex items-center justify-between text-sm font-semibold tabular-nums text-slate-800">
                            <span>{formatPlayerTime(time)}</span>
                            <span>{formatPlayerTime(total)}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                            <button onClick={toggle} className="shrink-0 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95" style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                                {playing ? 'PAUSE' : time >= total ? 'PLAY ▶' : time > 0 ? 'RESUME ▶' : 'PLAY ▶'}
                            </button>
                            <button onClick={restart} className="shrink-0 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500">Restart</button>
                            <label className="ml-auto flex items-center gap-2 text-xs font-bold text-slate-500">
                                Speed
                                <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500" aria-label="Playback speed">
                                    <option value={0.5}>0.5×</option>
                                    <option value={0.75}>0.75×</option>
                                    <option value={1}>1×</option>
                                    <option value={1.5}>1.5×</option>
                                    <option value={2}>2×</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="min-w-0 max-h-72 overflow-y-auto overflow-x-hidden p-4">
                    <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Working</h5>
                    <ol className="space-y-2">
                        {narrations.length === 0 && <li className="text-sm italic text-slate-400">Press play to begin…</li>}
                        {narrations.map((a: any) => {
                            const isCurrent = time < a.end;
                            return (
                                <li key={a.id} className={`gc-ink text-[1.05rem] leading-snug ${isCurrent ? 'text-blue-900' : 'text-slate-400'}`}>
                                    <span className="mr-1">{isCurrent ? '✎' : '✓'}</span>{a.narration}
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </div>
            {caption && <p className="border-t border-slate-100 px-4 py-2 text-xs italic text-slate-500">{caption}</p>}
        </div>
    );
};
/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
const DefinitionBox = ({ children, label = 'Definition' }: any) => (
    <div className="my-6 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
        <span className="gc-hand block text-center text-sm text-slate-500">{label}</span>
        <p className="gc-ink mt-2 text-center text-xl font-bold leading-snug text-blue-900 sm:text-2xl">{children}</p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rose-300" />
    </div>
);

const PracticeZone = ({ items }: any) => (
    <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">✍️</span> Practice Zone
        </h3>
        <div className="space-y-4">
            {items.map((q: string, i: number) => (
                <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold text-emerald-400">{i + 1}.</span>
                    <span className="text-slate-200">{q}</span>
                </div>
            ))}
        </div>
    </div>
);

const ExampleCard = ({ index, example }: any) => {
    const [open, setOpen] = useState(false);
    const diagram = useMemo(() => (open && example.build ? example.build() : null), [open, example]);
    return (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start gap-4 p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{index}</div>
                <div className="pt-1">
                    {example.tag && <div className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-500">{example.tag}</div>}
                    <div className="font-medium text-slate-800">{example.question}</div>
                </div>
            </div>
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-slate-100">
                <span>{open ? 'Hide Solution' : 'Show Solution'}</span>
                <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open && (
                <div className="border-t border-slate-100 p-4 sm:p-5">
                    {diagram && <VectorPlayer title="Diagram" xRange={diagram.xRange} yRange={diagram.yRange} actions={diagram.actions} caption={diagram.caption} />}
                    <div className="rounded-lg bg-blue-50/40 p-4 pl-6">
                        {example.steps.map((step: string, i: number) => (
                            <div key={i} className="flex gap-2 border-b border-blue-100/70 py-2 text-sm leading-relaxed last:border-0">
                                <span className="gc-hand shrink-0 font-bold text-rose-500">Step {i + 1}:</span>
                                <span className="gc-ink flex-1 text-[1.05rem] leading-relaxed text-blue-900">{step}</span>
                            </div>
                        ))}
                        <div className="pt-2 text-sm leading-relaxed">
                            <span className="gc-hand mr-1 font-bold text-slate-500">Answer:</span>
                            <span className="gc-ink text-lg font-bold text-emerald-700">{example.answer}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* =========================================================================
   DIAGRAM BUILDERS — one function per figure, using the exact numbers
   from the textbook pages you shared.
   ========================================================================= */

// Fig 18.1 — a single vector AB
function build_Fig18_1() {
    const A = { x: 0, y: 0 }, B = { x: 4, y: 1 };
    return {
        xRange: [-1, 6] as [number, number], yRange: [-1, 4] as [number, number],
        caption: 'Magnitude: |AB| = √(4² + 1²) = √17 ≈ 4.12',
        actions: [
            mkPoint(A, 'A', 'A is our starting point, at the origin (0, 0).'),
            mkPoint(B, 'B', 'B is the point (4, 1) — 4 across, 1 up.'),
            mkGuide(A, { x: 4, y: 0 }, 'Going from A to B, we move 4 units across...'),
            mkGuide({ x: 4, y: 0 }, B, '...then 1 unit up.'),
            mkVector(A, B, 'AB', 'This arrow is the vector AB. It shows both the direction and the distance from A to B. As a column vector, AB = (4, 1).'),
        ],
    };
}

// Scalar multiplication idea: a, 3a, -½a
function build_ScalarDemo() {
    const O = { x: 0, y: 0 }, A = { x: 2, y: 1 }, B = { x: 6, y: 3 }, C = { x: -1, y: -0.5 };
    return {
        xRange: [-2, 7] as [number, number], yRange: [-1, 4] as [number, number],
        caption: 'A positive scalar stretches or shrinks a vector; a negative scalar also flips its direction.',
        actions: [
            mkPoint(O, 'O', "Let's start with a vector a, drawn from O."),
            mkVector(O, A, 'a', 'Here is vector a = (2, 1).'),
            mkVector(O, B, '3a', 'This is 3a — three times as long as a, same direction: 3 × (2,1) = (6, 3).', { color: '#dc2626' }),
            mkVector(O, C, '-½a', 'And this is -½a — half the length, but pointing the OPPOSITE way because of the minus sign: -½ × (2,1) = (-1, -0.5).', { color: '#059669' }),
        ],
    };
}

// Adding and subtracting vectors, tip-to-tail
function build_AddSubtractDemo() {
    const O = { x: 0, y: 0 }, P = { x: -9, y: 0 }, Q = { x: 6, y: -2 };
    const sumTip = { x: P.x + Q.x, y: P.y + Q.y };
    return {
        xRange: [-11, 7] as [number, number], yRange: [-4, 3] as [number, number],
        caption: 'To add or subtract vectors, add or subtract their components: p + q = (-9+6, 0-2) = (-3, -2).',
        actions: [
            mkVector(O, P, 'p', 'Here is vector p = (-9, 0) — it points straight to the left.'),
            mkVector(O, Q, 'q', 'And here is vector q = (6, -2).', { color: '#dc2626' }),
            mkVector(P, sumTip, 'q', "To add p + q, slide q so its tail starts at the tip of p — its length and direction don't change, we just move it.", { color: '#dc2626', dashed: true }),
            mkVector(O, sumTip, 'p+q', 'Now draw one new arrow from the very start all the way to the very end. That arrow is p + q.', { color: '#059669' }),
        ],
    };
}

// Fig 18.2 — chain of vectors AB, BC, CD, DE (Example 1)
function build_Fig18_2() {
    const A = { x: 0, y: 0 }, B = { x: 3, y: -1 }, C = { x: 5, y: 0 }, D = { x: 4, y: 4 }, E = { x: 0, y: 2 };
    return {
        xRange: [-1, 6] as [number, number], yRange: [-2, 5] as [number, number],
        caption: 'DE = -2 × BC, so DE and BC point in opposite directions, and DE is twice as long.',
        actions: [
            mkPoint(A, 'A', ''),
            mkVector(A, B, 'AB', 'AB = (3, -1) — 3 across, 1 down.'),
            mkPoint(B, 'B', ''),
            mkVector(B, C, 'BC', 'BC = (2, 1).', { color: '#dc2626' }),
            mkPoint(C, 'C', ''),
            mkVector(C, D, 'CD', 'CD = (-1, 4).', { color: '#059669' }),
            mkPoint(D, 'D', ''),
            mkVector(D, E, 'DE', 'DE = (-4, -2). Compare this with BC — DE is exactly -2 × BC.', { color: '#7c3aed' }),
            mkPoint(E, 'E', ''),
        ],
    };
}

// XY example for magnitude / reverse vector
function build_XYExample() {
    const X = { x: 0, y: 0 }, Y = { x: -8, y: 5 };
    return {
        xRange: [-10, 2] as [number, number], yRange: [-1, 7] as [number, number],
        caption: 'YX is the same length as XY, but points the opposite way: YX = -XY = (8, -5).',
        actions: [
            mkPoint(X, 'X', 'X is at the origin.'),
            mkPoint(Y, 'Y', 'Y is at (-8, 5).'),
            mkVector(X, Y, 'XY', 'XY = (-8, 5). Its magnitude is |XY| = √((-8)² + 5²) = √89 ≈ 9.43.'),
            mkVector(Y, X, 'YX', 'YX is the reverse journey — from Y back to X. YX = -XY = (8, -5).', { color: '#dc2626', dashed: true }),
        ],
    };
}

// Fig 18.4 — position vector
function build_Fig18_4() {
    const O = { x: 0, y: 0 }, P = { x: 5, y: 4 };
    return {
        xRange: [-1, 7] as [number, number], yRange: [-1, 6] as [number, number],
        caption: 'A position vector always starts at O, so it is simply the point\'s own coordinates written as a column vector.',
        actions: [
            mkPoint(O, 'O', 'O is the origin — every position vector starts here.'),
            mkPoint(P, 'P', 'P is the point (5, 4).'),
            mkVector(O, P, 'a = OP', "The vector from O to P is called the position vector of P. We usually call it a. Here a = OP = (5, 4) — exactly P's coordinates."),
        ],
    };
}

// Fig 18.6 — distance between two points
function build_Fig18_6() {
    const P = { x: 3, y: 7 }, Q = { x: 11, y: 13 };
    return {
        xRange: [0, 13] as [number, number], yRange: [5, 15] as [number, number],
        caption: 'By Pythagoras, |PQ| = √(8² + 6²) = √100 = 10.',
        actions: [
            mkPoint(P, 'P', 'P is at (3, 7).'),
            mkPoint(Q, 'Q', 'Q is at (11, 13).'),
            mkGuide(P, { x: 11, y: 7 }, 'From P to Q: 8 units across (11 - 3 = 8)...'),
            mkGuide({ x: 11, y: 7 }, Q, '...and 6 units up (13 - 7 = 6).'),
            mkVector(P, Q, 'PQ', 'PQ = OQ - OP = (11-3, 13-7) = (8, 6).'),
        ],
    };
}

// Fig 18.9 style example — K, L, M and column vectors between them
function build_KLMExample() {
    const O = { x: 0, y: 0 }, K = { x: -1, y: 3 }, L = { x: 5, y: 4 }, M = { x: 8, y: -1 };
    return {
        xRange: [-2, 9] as [number, number], yRange: [-2, 5] as [number, number],
        caption: 'Any vector between two points = (position vector of the end point) − (position vector of the start point).',
        actions: [
            mkPoint(O, 'O', ''),
            mkPoint(K, 'K', 'K is at (-1, 3).'),
            mkPoint(L, 'L', 'L is at (5, 4).'),
            mkPoint(M, 'M', 'M is at (8, -1).'),
            mkVector(O, K, 'OK', "OK is simply K's coordinates, since it starts at the origin: OK = (-1, 3)."),
            mkVector(K, L, 'KL', 'KL = OL - OK = (5-(-1), 4-3) = (6, 1).', { color: '#dc2626' }),
            mkVector(L, M, 'LM', 'LM = OM - OL = (8-5, -1-4) = (3, -5).', { color: '#059669' }),
        ],
    };
}

// Fig 18.7 — parallelogram OPQR
function build_Fig18_7() {
    const O = { x: 0, y: 0 }, P = { x: 2, y: 2 }, Q = { x: 5, y: 3 }, R = { x: 3, y: 1 };
    return {
        xRange: [-1, 7] as [number, number], yRange: [-1, 5] as [number, number],
        caption: 'Since OP = RQ and PQ = OR, opposite sides are equal AND parallel — so OPQR is a parallelogram.',
        actions: [
            mkShape([O, P, Q, R], 'Here is quadrilateral OPQR.'),
            mkPoint(O, 'O', ''), mkPoint(P, 'P', ''), mkPoint(Q, 'Q', ''), mkPoint(R, 'R', ''),
            mkVector(O, P, 'OP', 'OP = (2, 2).'),
            mkVector(P, Q, 'PQ', 'PQ = (3, 1).', { color: '#dc2626' }),
            mkVector(R, Q, 'RQ', 'RQ = (2, 2) — exactly the same as OP!', { color: '#059669' }),
            mkVector(O, R, 'OR', 'OR = (3, 1) — exactly the same as PQ!', { color: '#7c3aed' }),
        ],
    };
}

// Fig 18.8 — rhombus ABCD
function build_Fig18_8() {
    const A = { x: 5, y: 6 }, B = { x: 1, y: 8 }, C = { x: 3, y: 4 }, D = { x: 7, y: 2 };
    return {
        xRange: [0, 9] as [number, number], yRange: [0, 10] as [number, number],
        caption: 'All four sides of a rhombus are equal in length, and opposite sides are parallel.',
        actions: [
            mkShape([A, B, C, D], 'Here is quadrilateral ABCD.', { fill: 'rgba(16,185,129,0.1)', stroke: '#10b981' }),
            mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''), mkPoint(D, 'D', ''),
            mkVector(A, B, 'AB', 'AB = (-4, 2).'),
            mkVector(B, C, 'BC', 'BC = (2, -4).', { color: '#dc2626' }),
            mkVector(C, D, 'CD', 'CD = (4, -2).', { color: '#059669' }),
            mkVector(D, A, 'DA', 'DA = (-2, 4).', { color: '#7c3aed' }),
        ],
    };
}

// Trapezium example — PQRS
function build_TrapeziumExample() {
    const P = { x: -3, y: 0 }, Q = { x: -1, y: 6 }, R = { x: 3, y: 5 }, S = { x: 5, y: -2 };
    return {
        xRange: [-4, 6] as [number, number], yRange: [-3, 7] as [number, number],
        caption: 'One pair of opposite sides (PS and QR) is parallel — that is what makes PQRS a trapezium.',
        actions: [
            mkShape([P, Q, R, S], 'Here is quadrilateral PQRS.'),
            mkPoint(P, 'P', ''), mkPoint(Q, 'Q', ''), mkPoint(R, 'R', ''), mkPoint(S, 'S', ''),
            mkVector(Q, R, 'QR', 'QR = (4, -1).'),
            mkVector(P, S, 'PS', 'PS = (8, -2) — exactly 2 × QR! So PS is parallel to QR, and twice as long.', { color: '#dc2626' }),
        ],
    };
}

// Fig 18.11 — closed quadrilateral, sum of vectors around it is zero
function build_Fig18_11() {
    const A = { x: 0, y: 0 }, B = { x: 2, y: 6 }, C = { x: 8, y: 7 }, D = { x: 9, y: 1 };
    return {
        xRange: [-1, 10] as [number, number], yRange: [-1, 8] as [number, number],
        caption: 'a + b + c + d = 0 — travelling all the way around a closed shape brings you back to your start, so the total displacement is the zero vector.',
        actions: [
            mkShape([A, B, C, D], 'Here is any quadrilateral, ABCD.'),
            mkPoint(A, 'A', ''), mkPoint(B, 'B', ''), mkPoint(C, 'C', ''), mkPoint(D, 'D', ''),
            mkVector(A, B, 'a', 'Going around the outside: a = AB.'),
            mkVector(B, C, 'b', 'b = BC.', { color: '#dc2626' }),
            mkVector(C, D, 'c', 'c = CD.', { color: '#059669' }),
            mkVector(D, A, 'd', 'd = DA — and we\'re back at A, where we started.', { color: '#7c3aed' }),
        ],
    };
}

// Example 5 — midpoints of PQRS form a parallelogram
function build_Example5Diagram() {
    const P = { x: 0, y: 2 }, Q = { x: 2, y: 8 }, R = { x: 8, y: 6 }, S = { x: 6, y: 0 };
    const A = mid(P, Q), B = mid(Q, R), C = mid(R, S), D = mid(S, P);
    return {
        xRange: [-1, 9] as [number, number], yRange: [-1, 9] as [number, number],
        caption: 'AB = DC = (4, 2) — one pair of opposite sides of ABCD is equal and parallel, so ABCD is a parallelogram.',
        actions: [
            mkShape([P, Q, R, S], 'PQRS is any quadrilateral. A, B, C, D are the midpoints of PQ, QR, RS, SP.', { fill: 'rgba(148,163,184,0.08)', stroke: '#94a3b8' }),
            mkPoint(P, 'P', ''), mkPoint(Q, 'Q', ''), mkPoint(R, 'R', ''), mkPoint(S, 'S', ''),
            mkPoint(A, 'A', 'A is the midpoint of PQ.'),
            mkPoint(B, 'B', 'B is the midpoint of QR.'),
            mkPoint(C, 'C', 'C is the midpoint of RS.'),
            mkPoint(D, 'D', 'D is the midpoint of SP.'),
            mkVector(A, B, 'AB', 'AB = B - A = (4, 2).', { color: '#1e3a8a' }),
            mkVector(D, C, 'DC', 'DC = C - D = (4, 2) — the same as AB!', { color: '#dc2626' }),
        ],
    };
}

// Example 6 — point P dividing AB in ratio 7:3
function build_Example6Diagram() {
    const O = { x: 0, y: 0 }, A = { x: 2, y: 10 }, B = { x: 12, y: 0 };
    const P = { x: 9, y: 3 };
    return {
        xRange: [-1, 13] as [number, number], yRange: [-1, 11] as [number, number],
        caption: 'OP = (3/10)a + (7/10)b — a mix of a and b, weighted by how far along AB the point P sits.',
        actions: [
            mkPoint(O, 'O', ''), mkPoint(A, 'A', ''), mkPoint(B, 'B', ''),
            mkVector(O, A, 'a', 'OA = a'),
            mkVector(O, B, 'b', 'OB = b', { color: '#dc2626' }),
            mkVector(A, B, 'b-a', 'AB = OB - OA = b - a', { color: '#059669' }),
            mkPoint(P, 'P', 'P divides AB so that AP : PB = 7 : 3.'),
            mkVector(A, P, 'AP', 'AP is 7/10 of the way along AB: AP = (7/10)(b - a).', { color: '#7c3aed' }),
            mkVector(O, P, 'OP', 'OP = OA + AP = a + (7/10)(b-a) = (3/10)a + (7/10)b.'),
        ],
    };
}

// Example 7 — classic O, A, B, C, X ratio problem
function build_Example7Diagram() {
    const O = { x: 0, y: 0 }, A = { x: 4, y: 0 }, B = { x: 3, y: 8 }, C = { x: 12, y: 0 };
    const X = mid(B, A);
    return {
        xRange: [-1, 13] as [number, number], yRange: [-1, 9] as [number, number],
        caption: 'This is the setup for Example 7 — a classic vector ratio problem. See the steps below for the full working.',
        actions: [
            mkPoint(O, 'O', ''), mkPoint(A, 'A', ''), mkPoint(B, 'B', ''),
            mkVector(O, A, 'a', 'OA = a'),
            mkVector(O, B, 'b', 'OB = b', { color: '#dc2626' }),
            mkVector(B, A, 'a-b', 'BA = OA - OB = a - b', { color: '#059669' }),
            mkPoint(X, 'X', 'X is the midpoint of BA.'),
            mkVector(O, X, 'OX', 'OX = OB + BX = b + ½(a-b) = ½(a+b).', { color: '#7c3aed' }),
            mkPoint(C, 'C', 'C sits on ray OA extended, with OC = 3a.'),
            mkVector(O, C, '3a', '', { color: '#1e3a8a', dashed: true }),
        ],
    };
}

/* =========================================================================
   SECTION CONTENT
   ========================================================================= */
const sections = [
    {
        id: 'intro',
        eyebrow: 'Chapter 18',
        title: 'What Is a Vector?',
        heading: 'Naming Vectors and Finding Their Size',
        intro: (
            <>
                <p className="mb-4 leading-relaxed text-slate-700">
                    A <strong>vector</strong> is anything that has both a <strong>direction</strong> and a <strong>size</strong> (called its magnitude). A car's velocity is a vector — it has a speed AND a direction. Compare this to something like temperature, which is just a number with no direction: that is called a <strong>scalar</strong>.
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    We usually draw a vector as an arrow. The <strong>length</strong> of the arrow shows the size, and the way it <strong>points</strong> shows the direction.
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    If a vector goes from point A to point B, we write it as <strong>AB</strong>. On squared paper we can also write it as a <strong>column vector</strong>: the top number is how far across we move, and the bottom number is how far up (or down) we move.
                </p>
            </>
        ),
        definition: 'A vector is a quantity with both direction and magnitude, usually drawn as an arrow. The length of the arrow is the magnitude; the way it points is the direction.',
        players: [{ title: 'A Vector From A to B', build: build_Fig18_1 }],
        examples: [
            { tag: 'Worked Example 1', question: 'A is the point (0, 0) and B is the point (4, 1). Write down the column vector AB, and find its magnitude |AB|.', steps: ['Reading straight from the grid: to get from A to B we move 4 across and 1 up, so AB = (4, 1).', 'The magnitude of a vector is its length, found with Pythagoras\' theorem: |AB| = √(4² + 1²).'], answer: '|AB| = √17 ≈ 4.12', build: build_Fig18_1 },
            { tag: 'Worked Example 2', question: 'Given the vector XY = (-8, 5), find (a) the magnitude |XY|, and (b) the reverse vector YX.', steps: ['Magnitude uses Pythagoras on the two components: |XY| = √((-8)² + 5²) = √(64+25) = √89.', 'The reverse journey YX is simply the negative of XY — same length, opposite direction: YX = -XY = (8, -5).'], answer: '|XY| = √89 ≈ 9.43, and YX = (8, -5)', build: build_XYExample },
            { tag: 'Worked Example 3', question: 'A vector p = (3, 4). Find its magnitude |p|.', steps: ['Use Pythagoras directly on the components: |p| = √(3² + 4²) = √(9+16) = √25.'], answer: '|p| = 5 — this is the well-known 3-4-5 triangle' },
        ],
        practice: [
            'Express the following as their opposite (positive) vectors: (a) -(-3,1) (b) -(4,-5) (c) -(-8,-6) (d) -(2,7).',
            'In Fig 18.2 (shown above in the worked examples), state the column vector that would displace point E to point A.',
            'Given points A(7,8) and B(2,-1), find the column vectors AB and BA.',
        ],
    },
    {
        id: 'operations',
        eyebrow: 'Chapter 18',
        title: 'Combining Vectors',
        heading: 'Multiplying, Adding and Subtracting Vectors',
        intro: (
            <>
                <p className="mb-4 leading-relaxed text-slate-700">
                    We can do arithmetic with vectors, just like with numbers — but every operation works <strong>component by component</strong> (top number with top number, bottom with bottom).
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    <strong>Multiplying by a number (a scalar):</strong> if k is a number and a is a vector, then k·a is k times as long as a. If k is negative, the vector also flips to point the opposite way.
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    <strong>Adding vectors:</strong> to add p + q, slide vector q (without changing its length or direction) so it starts where p ends. The sum p + q is the single arrow from the very start to the very end — this is called the <strong>tip-to-tail</strong> method.
                </p>
            </>
        ),
        players: [
            { title: 'Scaling a Vector', build: build_ScalarDemo },
            { title: 'Adding Vectors: Tip to Tail', build: build_AddSubtractDemo },
        ],
        examples: [
            { tag: 'Worked Example 1', question: 'If p = (-9, 0) and q = (6, -2), find (a) p + q and (b) p - q.', steps: ['Add the top numbers together, then the bottom numbers together: p + q = (-9+6, 0+(-2)).', 'Subtracting works the same way, component by component: p - q = (-9-6, 0-(-2)).'], answer: 'p + q = (-3, -2) and p - q = (-15, 2)', build: build_AddSubtractDemo },
            { tag: 'Worked Example 2', question: 'Using Fig 18.2, where AB=(3,-1), BC=(2,1), CD=(-1,4) and DE=(-4,-2): show that DE = -2·BC, and find BC + CD.', steps: ['Multiply BC by -2, component by component: -2 × (2,1) = (-4,-2). This matches DE exactly.', 'Add BC and CD by adding matching components: (2,1) + (-1,4) = (2-1, 1+4).'], answer: 'DE = -2·BC is confirmed, and BC + CD = (1, 5)', build: build_Fig18_2 },
            { tag: 'Worked Example 3', question: 'If p = (3, 4), find the column vectors 5p and -3p.', steps: ['Multiply every component of p by 5: 5 × (3,4) = (15, 20).', 'Multiply every component of p by -3, remembering the vector will point the opposite way: -3 × (3,4) = (-9, -12).'], answer: '5p = (15, 20) and -3p = (-9, -12)' },
        ],
        practice: [
            'If p=(3,4), q=(3,-1), r=(-1,0), express as column vectors: (a) 5p (b) -3q (c) ½r (d) p+q (e) p-r (f) 3p+r (g) p-2q (h) 5p-4q+r.',
            'Using the same p, q, r, evaluate |p|, |q|, |r|, |p+r|, |q+r| and |p-q|.',
            'A shape is translated through (5,-3), then through (2,8). What single translation is this equivalent to? How far is the shape from its starting position?',
        ],
    },
    {
        id: 'position-vectors',
        eyebrow: 'Chapter 18',
        title: 'Position Vectors',
        heading: 'Position Vectors and the Distance Formula',
        intro: (
            <>
                <p className="mb-4 leading-relaxed text-slate-700">
                    The vector that goes from the origin O to a point P is called the <strong>position vector</strong> of P. It is usually given the letter a, so a = OP. Because it always starts at O, a position vector is simply the point's coordinates written as a column vector.
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    Position vectors let us find the vector between <strong>any two points</strong> quickly: <strong>PQ = OQ - OP</strong> — the position vector of the end point, minus the position vector of the start point.
                </p>
            </>
        ),
        definition: 'For two points P(x₁,y₁) and Q(x₂,y₂), the vector PQ = (x₂-x₁, y₂-y₁), and the distance |PQ| = √((x₂-x₁)² + (y₂-y₁)²).',
        players: [{ title: 'A Position Vector', build: build_Fig18_4 }],
        examples: [
            { tag: 'Worked Example 1', question: 'P is the point (3,7) and Q is the point (11,13). Find the vector PQ and its magnitude |PQ|.', steps: ['PQ = OQ - OP = (11,13) - (3,7) = (11-3, 13-7) = (8,6).', 'Use Pythagoras on the components of PQ: |PQ| = √(8²+6²) = √(64+36) = √100.'], answer: 'PQ = (8, 6) and |PQ| = 10', build: build_Fig18_6 },
            { tag: 'Worked Example 2', question: 'Points K(-1,3), L(5,4) and M(8,-1) are given. Express OK, KL and LM as column vectors.', steps: ['OK starts at the origin, so it is just K\'s own coordinates: OK = (-1,3).', 'KL = OL - OK = (5,4) - (-1,3) = (6,1).', 'LM = OM - OL = (8,-1) - (5,4) = (3,-5).'], answer: 'OK=(-1,3), KL=(6,1), LM=(3,-5)', build: build_KLMExample },
            { tag: 'Worked Example 3', question: 'Points A(7,8) and B(2,-1) are given. Find the vector AB and its length.', steps: ['AB = OB - OA = (2,-1) - (7,8) = (2-7, -1-8) = (-5,-9).', 'Use Pythagoras: |AB| = √((-5)²+(-9)²) = √(25+81) = √106.'], answer: 'AB = (-5, -9) and |AB| = √106 ≈ 10.30' },
        ],
        practice: [
            'Points O(0,0), P(1,5), Q(3,8), R(7,10), S(10,3) are given. Express OQ, OS and PQ as column vectors.',
            'M and N have position vectors m = (1,-4) and MN = (7,10). Find n, and hence find |n|.',
            'X, Y and Z have position vectors x=(3,4), y=(3,-1) and z=(-1,0). Find |x+z| and |y+z|, leaving your answers in surd form where necessary.',
        ],
    },
    {
        id: 'parallelogram',
        eyebrow: 'Chapter 18',
        title: 'Parallelograms',
        heading: 'Proving a Shape Is a Parallelogram',
        intro: (
            <>
                <p className="mb-4 leading-relaxed text-slate-700">
                    Here is the key idea behind almost every vector proof: <strong>if two vectors are equal (a = b), then they have the same length AND point in the same direction</strong> — in other words, the two line segments they represent are equal in length and parallel.
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    So to show a quadrilateral is a <strong>parallelogram</strong>, we just calculate a pair of opposite sides as column vectors, and check that they come out identical.
                </p>
            </>
        ),
        players: [{ title: 'Parallelogram OPQR', build: build_Fig18_7 }],
        examples: [
            { tag: 'Worked Example 1', question: 'O(0,0), P(2,2), Q(5,3), R(3,1) are the vertices of quadrilateral OPQR. Show that OPQR is a parallelogram, and find where its diagonals cross.', steps: ['Compute OP = (2,2) and RQ = (5,3)-(3,1) = (2,2). Since OP = RQ, side OP is equal and parallel to side RQ.', 'The diagonals of any parallelogram bisect each other, so the crossing point is the midpoint of OQ: ½(5,3) = (2.5, 1.5).'], answer: 'OPQR is a parallelogram; the diagonals cross at (2½, 1½)', build: build_Fig18_7 },
            { tag: 'Worked Example 2', question: 'P(-3,0), Q(-1,6), R(3,5), S(5,-2) are the vertices of quadrilateral PQRS. Show that PQRS is a trapezium (it has exactly one pair of parallel sides).', steps: ['Compute QR = (3,5)-(-1,6) = (4,-1).', 'Compute PS = (5,-2)-(-3,0) = (8,-2). Notice (8,-2) = 2 × (4,-1), so PS = 2·QR.'], answer: 'Since PS is a scalar multiple of QR, PS is parallel to QR — so PQRS is a trapezium', build: build_TrapeziumExample },
            { tag: 'Worked Example 3', question: 'O(0,0), A(4,0), B(7,5), C(3,5) are given. Show that OABC is a parallelogram.', steps: ['Compute OA = (4,0)-(0,0) = (4,0).', 'Compute CB = (7,5)-(3,5) = (4,0). Since OA = CB, side OA is equal and parallel to side CB.'], answer: 'OA = CB = (4,0), so OABC is a parallelogram' },
        ],
        practice: [
            'P(3,2), Q(9,4), R(11,8), S(5,6) are vertices of a parallelogram. Find the coordinates of the point where its diagonals intersect.',
            'O(0,0), A(4,6), and OABC is a parallelogram with C(8,2). Find the coordinates of B.',
            'A(-3,0), B(-1,6), C(3,5), D(5,-2): use vectors to decide whether ABCD is a trapezium, a parallelogram, or neither.',
        ],
    },
    {
        id: 'rhombus',
        eyebrow: 'Chapter 18',
        title: 'Rhombuses & Other Shapes',
        heading: 'Rhombuses and Special Quadrilaterals',
        intro: (
            <>
                <p className="mb-4 leading-relaxed text-slate-700">
                    A <strong>rhombus</strong> is a special parallelogram where all four sides are the same length. We can use vectors to find a missing coordinate, by setting two adjacent sides' magnitudes equal to each other and solving.
                </p>
            </>
        ),
        players: [{ title: 'Rhombus ABCD', build: build_Fig18_8 }],
        examples: [
            { tag: 'Worked Example 1', question: 'A(5,6), B(1,8), C(p,4) and D(7,2) are the vertices of a rhombus, with C in the positive quadrant. Find p, and hence the coordinates of D.', steps: ['Since ABCD is a rhombus, adjacent sides are equal in length: |AB| = |BC|.', 'AB = (1-5, 8-6) = (-4,2), so |AB| = √(16+4) = √20.', 'BC = (p-1, 4-8) = (p-1,-4), so |BC|² = (p-1)² + 16. Setting this equal to 20 gives (p-1)² = 4, so p-1 = ±2, giving p=3 (taking the positive quadrant option).', 'Using AB = DC (opposite sides of a rhombus are equal and parallel) confirms D = (7,2), as given.'], answer: 'p = 3, so C = (3, 4) and D = (7, 2)', build: build_Fig18_8 },
            { tag: 'Worked Example 2', question: 'A(3,-5), B(8,5), C(6,16), D(1,6) are given. Use vectors to show ABCD is a rhombus.', steps: ['AB = (8-3,5-(-5)) = (5,10), so |AB| = √(25+100) = √125.', 'BC = (6-8,16-5) = (-2,11), so |BC| = √(4+121) = √125 — the same as |AB|.', 'DC = (6-1,16-6) = (5,10) = AB, so AB is parallel and equal to DC, confirming ABCD is a parallelogram with all sides equal.'], answer: 'ABCD is a rhombus, since |AB| = |BC| = √125 and AB = DC' },
            { tag: 'Worked Example 3', question: 'OABC is a parallelogram, O the origin, with OA=(1,4) and OC=(5,2). Find the column vector OB.', steps: ['In a parallelogram OABC, diagonal OB = OA + AB, and AB = OC (opposite sides are equal).', 'So OB = OA + OC = (1,4) + (5,2).'], answer: 'OB = (6, 6)' },
        ],
        practice: [
            'A shape has vertices A(3,-5), B(8,5), C(6,16), D(1,6). Confirm using vectors that AD = BC.',
            'A rhombus PQRS has P(2,1), Q(6,1), S(0,4). Use the equal-sides property to find the coordinates of R.',
            'A kite ABCD has diagonals that meet at right angles. If A(0,4), B(3,0), C(0,-5) and D(-3,0), use vectors to check that the diagonals AC and BD are indeed perpendicular.',
        ],
    },
    {
        id: 'proofs',
        eyebrow: 'Chapter 18',
        title: 'Vector Proofs',
        heading: 'Using Vectors to Prove Geometry Facts',
        intro: (
            <>
                <p className="mb-4 leading-relaxed text-slate-700">
                    This is where vectors become really powerful: instead of just describing a shape, we can <strong>prove</strong> general facts about triangles and quadrilaterals — for any size or position — using only the letters a, b, c that represent the sides.
                </p>
                <p className="mb-4 leading-relaxed text-slate-700">
                    Two big rules make this possible. First: <strong>going all the way around a closed shape brings you back to the start</strong>, so all the vectors around it add up to zero. Second: <strong>if h·a + k·b = n·a + m·b</strong>, and a and b point in different directions, then the numbers in front of a must match, and so must the numbers in front of b — this lets us solve for unknown ratios.
                </p>
            </>
        ),
        definition: 'For any closed polygon with sides taken in order as vectors a, b, c, d, ... , the sum a + b + c + d + ... = 0.',
        players: [{ title: 'Around a Closed Shape, the Vectors Sum to Zero', build: build_Fig18_11 }],
        examples: [
            { tag: 'Worked Example 5', question: 'PQRS is any quadrilateral. A, B, C, D are the midpoints of PQ, QR, RS, SP. Prove that ABCD is a parallelogram.', steps: ['Let PQ = q, QR = r, RS = s, SP = p (so p+q+r+s = 0, since PQRS is closed).', 'A is the midpoint of PQ and B is the midpoint of QR, so AB = ½q + ½r = ½(q + r).', 'D is the midpoint of SP and C is the midpoint of RS, so DC = ½s + ½r ... working the other way around, DC also simplifies to ½(q + r) using p+q+r+s=0.', 'Since AB = DC, side AB is equal and parallel to side DC, so ABCD is a parallelogram.'], answer: 'ABCD is a parallelogram, because AB = DC', build: build_Example5Diagram },
            { tag: 'Worked Example 6', question: 'In triangle OAB, OA=a and OB=b. P lies on AB such that AP:PB = 7:3. Express OP in terms of a and b.', steps: ['AB = OB - OA = b - a.', 'Since AP:PB = 7:3, point P is 7/10 of the way from A to B, so AP = (7/10)(b-a).', 'OP = OA + AP = a + (7/10)(b-a) = a - (7/10)a + (7/10)b.'], answer: 'OP = (3/10)a + (7/10)b', build: build_Example6Diagram },
            { tag: 'Worked Example 7', question: 'OA=a and OB=b. X is the midpoint of BA. OC=3a. Y lies on BC with BY=m·BC. If OY=n·OX, find the values of m and n.', steps: ['In triangle OAB: OB + BA = OA, so BA = a - b.', 'X is the midpoint of BA, so BX = ½(a-b), and OX = OB + BX = b + ½(a-b) = ½(a+b).', 'BC = OC - OB = 3a - b. Since BY = m·BC, OY = OB + BY = b + m(3a-b) = 3ma + (1-m)b.', 'Also OY = n·OX = n·½(a+b) = ½na + ½nb. Comparing the amounts of a: 3m = ½n. Comparing the amounts of b: 1-m = ½n. Combining these two equations gives m = ¼.'], answer: 'm = ¼, and n = 1½', build: build_Example7Diagram },
        ],
        practice: [
            'PQRST is a pentagon. Using single vectors, represent (a) PQ + QR (b) PR + RS + ST (c) PQ + QR + RS + ST + TP.',
            'Use vectors to show that if the diagonals of a quadrilateral bisect each other, then the quadrilateral must be a parallelogram.',
            'ABC is any triangle. M and N are the midpoints of BC and AC respectively. AM and BN intersect at G. If AB=x and AC=y, express AM and BN in terms of x and y, and use them to show that AG:GM = 2:1.',
        ],
    },
];

/* =========================================================================
   SECTION COMPONENT
   ========================================================================= */
const Section = ({ section }: any) => (
    <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
        <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{section.eyebrow}</span>
            <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
        </div>

        <div className="mb-6">
            {typeof section.intro === 'string'
                ? <p className="mb-4 leading-relaxed text-slate-700">{section.intro}</p>
                : section.intro}

            {section.definition && <DefinitionBox>{section.definition}</DefinitionBox>}

            {section.players && section.players.map((p: any, i: number) => {
                const built = p.build();
                return <VectorPlayer key={i} title={p.title} xRange={built.xRange} yRange={built.yRange} actions={built.actions} caption={built.caption} />;
            })}
        </div>

        {section.examples && section.examples.length > 0 && (
            <div className="mb-8">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Worked Examples</h3>
                {section.examples.map((ex: any, i: number) => (
                    <ExampleCard key={i} index={i + 1} example={ex} />
                ))}
            </div>
        )}

        {section.practice && section.practice.length > 0 && <PracticeZone items={section.practice} />}
    </section>
);

/* =========================================================================
   MAIN VECTORS COMPONENT
   ========================================================================= */
export const Vectors = () => {
    const [active, setActive] = useState('intro');
    const [lang, setLang] = useState('en');

    const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
    const activeSection = sections[activeIndex] || sections[0];

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
        <div id="cg-scroll-area" className="min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
            <InkStyles />

            <div className={`relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md`}>
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-violet-400/30 text-white border border-violet-200/40`}>CHAPTER 18</span>
                            <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                            <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
                            </button>
                            <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
                            </button>
                        </div>
                    </div>
                    <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Vectors (2)</h1>
                    <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                        {lang === 'sn' ? "Zvose zvine nzira nekukura. Shandisa mavhector kutsvaga nhambwe, kuwedzera nekubvisa, uye kuratidza hunhu hwezvinoumba. Dhinda play pane dhiyagiramu yega yega kuona nhanho dzekufunga." : "Quantities with direction and size. Press play on any diagram below to watch each vector drawn step by step, with the reasoning alongside it."}
                    </p>
                </div>
            </div>

            <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div id="math-topic-rail" data-math-chapter-scroller="true"
                        className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {sections.map((s) => {
                            const isActive = active === s.id;
                            return (
                                <button key={s.id} onClick={() => handleNavigate(s.id)}
                                    title={s.title}
                                    className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                                    {s.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
                <div key={activeSection.id}>
                    <Section section={activeSection} />
                </div>

                <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
                    <button onClick={goPrev} disabled={activeIndex === 0}
                        className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
                        ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
                    </button>
                    <span className="text-xs font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
                    <button onClick={goNext} disabled={activeIndex === sections.length - 1}
                        className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
                        {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Vectors;