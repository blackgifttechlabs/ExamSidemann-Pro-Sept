import React, { useState, useRef, useEffect, useMemo } from 'react';

/* =========================================================================
   FONTS + SHARED STYLES
   ========================================================================= */
const InkStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
      .gc-hand { font-family: 'Patrick Hand', cursive; }
      .gc-ink { font-family: 'Kalam', cursive; }
      @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes gcChevronPulse { 0%, 100% { opacity: .15; } 40% { opacity: 1; } }
      .gc-chevron-track { display: inline-flex; align-items: center; gap: 1px; }
      .gc-chevron-track svg { animation: gcChevronPulse 1s ease-in-out infinite; }
      @keyframes gcDrawLine { to { stroke-dashoffset: 0; } }
      @keyframes gcFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes gcPopIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
     `}</style>
);

/* =========================================================================
   FLAG ICONS (reused from the circle geometry file)
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
   SHARED UI PRIMITIVES
   ========================================================================= */
const DefinitionBox = ({ children, label = 'Definition' }) => (
    <div className="my-6 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
        <span className="gc-hand block text-center text-sm text-slate-500">{label}</span>
        <p className="gc-ink mt-2 text-center text-xl font-bold leading-snug text-blue-900 sm:text-2xl">{children}</p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rose-300" />
    </div>
);

/**
 * Scans a plain sentence for math-looking fragments — equations,
 * inequalities, coordinate pairs, money amounts — and renders only
 * those in the handwritten ink font, leaving surrounding prose alone.
 * Heuristic, not a parser: tuned for the patterns this lesson actually
 * uses (x/y terms, =, <, >, ≤, ≥, +, −, coordinates, $ and ¢ amounts).
 */
const MATH_RE = /(\$\d+(?:\.\d+)?|\d+¢|\(-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\)|-?\d*\.?\d*[xy](?:\s*[+\-−]\s*\d*\.?\d*[xy]?)*\s*[=<>≤≥]\s*-?\d*\.?\d*[xy]?(?:\s*[+\-−]\s*\d*\.?\d*[xy]?)*(?:\s*,\s*-?\d*\.?\d*[xy]?(?:\s*[+\-−]\s*\d*\.?\d*[xy]?)*\s*[=<>≤≥]\s*-?\d*\.?\d*[xy]?(?:\s*[+\-−]\s*\d*\.?\d*[xy]?)*)*)/g;

const MathText = ({ text }: { text: string }) => {
    if (!text) return null;
    const parts = text.split(MATH_RE);
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1
                    ? <span key={i} className="gc-ink font-bold text-blue-900">{part}</span>
                    : <React.Fragment key={i}>{part}</React.Fragment>
            )}
        </>
    );
};

const PracticeZone = ({ items }) => (
    <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">✍️</span> Practice Zone
        </h3>
        <div className="space-y-4">
            {items.map((q, i) => (
                <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold text-emerald-400">{i + 1}.</span>
                    <span className="text-slate-200"><MathText text={q} /></span>
                </div>
            ))}
        </div>
    </div>
);
/* =========================================================================
   GRAPH DRAWING HELPERS
   Every figure is described in plain maths coordinates. A single pixel
   transform (shared by every figure) converts those into a fixed-size
   canvas at render time, so stroke widths, font sizes, dot radii and
   arrowheads are ordinary constant pixel values — never guessed relative
   to how wide any individual figure's axis range happens to be.
   ========================================================================= */
type Point = { x: number; y: number };

const CANVAS_W = 640;
const CANVAS_H = 480;
const CANVAS_PAD = 50;

/* Timing for the "hand-drawn" playback: axis draw -> axis numbers ->
   each boundary line (ruler-drawn) + its label -> shaded regions ->
   plotted points. Every primitive claims a slot on a shared running
   cursor, so JSX order IS playback order — no manual indices needed. */
const AXIS_MS = 550;
const TICK_STEP_MS = 70;
const TICK_MS = 260;
const LINE_STEP_MS = 520;
const LINE_DRAW_MS = 460;
const TEXT_STEP_MS = 220;
const TEXT_MS = 300;
const POINT_STEP_MS = 70;
const POINT_MS = 240;
const SHADE_STEP_MS = 260;
const SHADE_MS = 380;
const SPEEDS = [0.5, 1, 1.5, 2];

type Transform = {
    toPx: (p: Point) => Point;
    scale: number;
    cursor: { current: number };
    elapsed: number;
};

function makeTransform(xRange: [number, number], yRange: [number, number]): Transform {
    const [xMin, xMax] = xRange;
    const [yMin, yMax] = yRange;
    const scaleX = (CANVAS_W - CANVAS_PAD * 2) / (xMax - xMin);
    const scaleY = (CANVAS_H - CANVAS_PAD * 2) / (yMax - yMin);
    const scale = Math.min(scaleX, scaleY);
    const originX = CANVAS_PAD - xMin * scale;
    const originY = CANVAS_H - CANVAS_PAD + yMin * scale;
    return { scale, toPx: (p) => ({ x: originX + p.x * scale, y: originY - p.y * scale }), cursor: { current: 0 }, elapsed: 0 };
}

const GraphCtx = React.createContext<Transform | null>(null);
const useGTx = (): Transform => {
    const tx = React.useContext(GraphCtx);
    if (!tx) throw new Error('Graph primitives (GLine, GText, GPoint, GShadeExcluded) must be used inside <Graph>');
    return tx;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** A small sliding ruler shown at the tip of a line while it's being drawn. */
const RulerTip = ({ x, y, angle, color }: { x: number; y: number; angle: number; color: string }) => (
    <g transform={`translate(${x},${y}) rotate(${angle})`} opacity={0.92}>
        <rect x={-3} y={-7} width={34} height={14} rx={2} fill="#f5deb3" stroke="#7c5a2e" strokeWidth={1} />
        {[3, 9, 15, 21, 27].map((tx2, i) => (
            <line key={i} x1={tx2} y1={-7} x2={tx2} y2={i % 2 === 0 ? -1 : -3} stroke="#7c5a2e" strokeWidth={1} />
        ))}
        <circle cx={0} cy={0} r={2.2} fill={color} />
    </g>
);

/** A straight line segment between two maths-space points, drawn in with a ruler. */
const GLine = ({ x1, y1, x2, y2, color = '#1e3a8a', width = 2.5, dashed = false }: any) => {
    const tx = useGTx();
    const a = tx.toPx({ x: x1, y: y1 }), b = tx.toPx({ x: x2, y: y2 });
    const start = tx.cursor.current;
    tx.cursor.current += LINE_STEP_MS;
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const progress = clamp01((tx.elapsed - start) / LINE_DRAW_MS);
    const tip = { x: a.x + (b.x - a.x) * progress, y: a.y + (b.y - a.y) * progress };
    const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    return (
        <g>
            <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={color} strokeWidth={width} strokeLinecap="round"
                strokeDasharray={progress >= 1 ? (dashed ? '7 6' : 'none') : len}
                strokeDashoffset={progress >= 1 ? 0 : len * (1 - progress)}
            />
            {progress > 0 && progress < 1 && <RulerTip x={tip.x} y={tip.y} angle={angle} color={color} />}
        </g>
    );
};

/** A text label anchored at a maths-space point, offset in pixels (dx/dy). */
const jitterAngle = (seed: number) => {
    const s = Math.sin(seed * 12.9898) * 43758.5453;
    return ((s - Math.floor(s)) - 0.5) * 3.2; // ~-1.6deg to +1.6deg
};

const GText = ({ x, y, children, color = '#1f2937', size = 15, dx = 0, dy = 0, weight = 'normal', anchor = 'start' }: any) => {
    const tx = useGTx();
    const p = tx.toPx({ x, y });
    const start = tx.cursor.current;
    tx.cursor.current += TEXT_STEP_MS;
    const progress = clamp01((tx.elapsed - start) / TEXT_MS);
    const rot = jitterAngle(p.x + p.y + start);
    return (
        <text
            x={p.x + dx} y={p.y + dy} className="gc-ink" fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor}
            style={{
                opacity: progress,
                transform: `translateY(${(1 - progress) * 5}px) rotate(${rot}deg)`,
                transformOrigin: `${p.x + dx}px ${p.y + dy}px`,
            }}
        >{children}</text>
    );
};

/** A filled dot at a maths-space point, radius in pixels. */
const GPoint = ({ x, y, r = 3.5, color = '#f43f5e', strokeColor, strokeW = 0 }: any) => {
    const tx = useGTx();
    const p = tx.toPx({ x, y });
    const start = tx.cursor.current;
    tx.cursor.current += POINT_STEP_MS;
    const progress = clamp01((tx.elapsed - start) / POINT_MS);
    return (
        <circle
            cx={p.x} cy={p.y} r={r} fill={color} stroke={strokeColor} strokeWidth={strokeW}
            style={{ opacity: progress, transform: `scale(${0.25 + 0.75 * progress})`, transformOrigin: `${p.x}px ${p.y}px` }}
        />
    );
};

/**
 * Shades the excluded half-plane of a boundary line. `awayX/awayY` is any
 * point known to be INSIDE the wanted (unshaded) region — the shading is
 * drawn on the opposite side. The polygon is oversized and the surrounding
 * <svg> clips it, so no manual intersection maths is ever needed.
 */
const GShadeExcluded = ({ x1, y1, x2, y2, awayX, awayY }: any) => {
    const tx = useGTx();
    const a = tx.toPx({ x: x1, y: y1 }), b = tx.toPx({ x: x2, y: y2 }), away = tx.toPx({ x: awayX, y: awayY });
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const midx = (a.x + b.x) / 2, midy = (a.y + b.y) / 2;
    const dot = nx * (away.x - midx) + ny * (away.y - midy);
    const sign = dot >= 0 ? 1 : -1;
    const extent = Math.max(CANVAS_W, CANVAS_H);
    const ox = nx * sign * extent, oy = ny * sign * extent;
    const start = tx.cursor.current;
    tx.cursor.current += SHADE_STEP_MS;
    const progress = clamp01((tx.elapsed - start) / SHADE_MS);
    return (
        <polygon
            points={`${a.x},${a.y} ${b.x},${b.y} ${b.x + ox},${b.y + oy} ${a.x + ox},${a.y + oy}`}
            fill="rgba(220,38,38,0.08)"
            style={{ opacity: progress }}
        />
    );
};

interface GraphProps {
    children?: React.ReactNode;
    xRange?: [number, number];
    yRange?: [number, number];
    grid?: boolean;
    axes?: boolean;
    labels?: { x?: string; y?: string };
}

const Graph = ({
    children,
    xRange = [-5, 5],
    yRange = [-5, 5],
    grid = true,
    axes = true,
    labels = { x: 'x', y: 'y' },
}: GraphProps) => {
    const tx = useMemo(() => makeTransform(xRange, yRange), [xRange, yRange]);
    const [xMin, xMax] = xRange, [yMin, yMax] = yRange;

    const vTicks: number[] = [], hTicks: number[] = [];
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) if (x !== 0) vTicks.push(x);
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) if (y !== 0) hTicks.push(y);
    const tickCount = vTicks.length + hTicks.length;
    const ticksEnd = AXIS_MS + Math.max(0, tickCount - 1) * TICK_STEP_MS + TICK_MS + 100;

    const cursorRef = useRef({ current: 0 });
    cursorRef.current.current = ticksEnd;

    const [elapsed, setElapsed] = useState(0);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [totalDuration, setTotalDuration] = useState(1);

    useEffect(() => {
        const t = cursorRef.current.current + 150;
        if (t !== totalDuration) setTotalDuration(t);
    });

    useEffect(() => {
        if (!playing) return;
        let raf: number;
        let last = performance.now();
        const tick = (now: number) => {
            const dt = now - last;
            last = now;
            setElapsed((e) => {
                const next = e + dt * speed;
                if (next >= totalDuration) { setPlaying(false); return totalDuration; }
                return next;
            });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [playing, speed, totalDuration]);

    const effectiveElapsed = hasInteracted ? elapsed : totalDuration;

    const handlePlayPause = () => {
        if (playing) { setPlaying(false); return; }
        setElapsed((e) => (!hasInteracted || e >= totalDuration ? 0 : e));
        setHasInteracted(true);
        setPlaying(true);
    };
    const handleSeek = (v: number) => { setHasInteracted(true); setPlaying(false); setElapsed(v); };

    const ctxValue: Transform = { ...tx, cursor: cursorRef.current, elapsed: effectiveElapsed };

    const origin = tx.toPx({ x: 0, y: 0 });
    const xAxisStart = tx.toPx({ x: xMin, y: 0 }), xAxisEnd = tx.toPx({ x: xMax, y: 0 });
    const yAxisStart = tx.toPx({ x: 0, y: yMin }), yAxisEnd = tx.toPx({ x: 0, y: yMax });
    const axisProgress = clamp01(effectiveElapsed / AXIS_MS);
    const xAxisLen = Math.hypot(xAxisEnd.x - xAxisStart.x, xAxisEnd.y - xAxisStart.y) || 1;
    const yAxisLen = Math.hypot(yAxisEnd.x - yAxisStart.x, yAxisEnd.y - yAxisStart.y) || 1;
    const chromeOpacity = clamp01((axisProgress - 0.75) / 0.25);

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} className="h-auto w-full" preserveAspectRatio="xMidYMid meet">
                {grid && vTicks.map((x) => {
                    const a = tx.toPx({ x, y: yMin }), b = tx.toPx({ x, y: yMax });
                    return <line key={`gv${x}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />;
                })}
                {grid && hTicks.map((y) => {
                    const a = tx.toPx({ x: xMin, y }), b = tx.toPx({ x: xMax, y });
                    return <line key={`gh${y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" />;
                })}
                {axes && (
                    <>
                        <line x1={xAxisStart.x} y1={xAxisStart.y} x2={xAxisEnd.x} y2={xAxisEnd.y} stroke="#1f2937" strokeWidth="2"
                            strokeDasharray={xAxisLen} strokeDashoffset={xAxisLen * (1 - axisProgress)} />
                        <line x1={yAxisStart.x} y1={yAxisStart.y} x2={yAxisEnd.x} y2={yAxisEnd.y} stroke="#1f2937" strokeWidth="2"
                            strokeDasharray={yAxisLen} strokeDashoffset={yAxisLen * (1 - axisProgress)} />
                        <g style={{ opacity: chromeOpacity }}>
                            <polygon points={`${xAxisEnd.x},${xAxisEnd.y} ${xAxisEnd.x - 9},${xAxisEnd.y - 5} ${xAxisEnd.x - 9},${xAxisEnd.y + 5}`} fill="#1f2937" />
                            <polygon points={`${yAxisEnd.x},${yAxisEnd.y} ${yAxisEnd.x - 5},${yAxisEnd.y + 9} ${yAxisEnd.x + 5},${yAxisEnd.y + 9}`} fill="#1f2937" />
                            <text x={xAxisEnd.x + 10} y={xAxisEnd.y + 5} className="gc-ink" fontSize="18" fill="#1f2937" style={{ transform: `rotate(${jitterAngle(xAxisEnd.x)}deg)`, transformOrigin: `${xAxisEnd.x + 10}px ${xAxisEnd.y + 5}px` }}>{labels.x}</text>
                            <text x={yAxisEnd.x + 8} y={yAxisEnd.y - 6} className="gc-ink" fontSize="18" fill="#1f2937" style={{ transform: `rotate(${jitterAngle(yAxisEnd.y)}deg)`, transformOrigin: `${yAxisEnd.x + 8}px ${yAxisEnd.y - 6}px` }}>{labels.y}</text>
                            <text x={origin.x - 14} y={origin.y + 16} className="gc-ink" fontSize="13" fill="#6b7280">O</text>
                        </g>
                        {vTicks.map((v, i) => {
                            const p = tx.toPx({ x: v, y: 0 });
                            const tp = clamp01((effectiveElapsed - (AXIS_MS + i * TICK_STEP_MS)) / TICK_MS);
                            const rot = jitterAngle(p.x + v);
                            return (
                                <g key={`vt${v}`} style={{ opacity: tp, transform: `scale(${0.5 + 0.5 * tp})`, transformOrigin: `${p.x}px ${p.y}px` }}>
                                    <line x1={p.x} y1={p.y - 4} x2={p.x} y2={p.y + 4} stroke="#1f2937" strokeWidth="1.5" />
                                    <text x={p.x} y={p.y + 20} className="gc-ink" fontSize="14" fill="#4b5563" textAnchor="middle" style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${p.x}px ${p.y + 20}px` }}>{v}</text>
                                </g>
                            );
                        })}
                        {hTicks.map((v, i) => {
                            const p = tx.toPx({ x: 0, y: v });
                            const gi = vTicks.length + i;
                            const tp = clamp01((effectiveElapsed - (AXIS_MS + gi * TICK_STEP_MS)) / TICK_MS);
                            const rot = jitterAngle(p.y + v * 7);
                            return (
                                <g key={`ht${v}`} style={{ opacity: tp, transform: `scale(${0.5 + 0.5 * tp})`, transformOrigin: `${p.x}px ${p.y}px` }}>
                                    <line x1={p.x - 4} y1={p.y} x2={p.x + 4} y2={p.y} stroke="#1f2937" strokeWidth="1.5" />
                                    <text x={p.x - 10} y={p.y + 5} className="gc-ink" fontSize="14" fill="#4b5563" textAnchor="end" style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${p.x - 10}px ${p.y + 5}px` }}>{v}</text>
                                </g>
                            );
                        })}
                    </>
                )}
                <GraphCtx.Provider value={ctxValue}>{children}</GraphCtx.Provider>
            </svg>

            <div className="mt-2 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md ring-1 ring-slate-200 backdrop-blur-xs">
                <button
                    type="button"
                    onClick={handlePlayPause}
                    title={playing ? 'Pause' : 'Play'}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 active:scale-95"
                >
                    {playing ? (
                        <svg width="9" height="9" viewBox="0 0 10 10"><rect x="0" y="0" width="3.5" height="10" fill="white" /><rect x="6.5" y="0" width="3.5" height="10" fill="white" /></svg>
                    ) : (
                        <svg width="9" height="9" viewBox="0 0 10 10"><polygon points="0,0 10,5 0,10" fill="white" /></svg>
                    )}
                </button>
                <input
                    type="range"
                    min={0}
                    max={totalDuration}
                    step={1}
                    value={effectiveElapsed}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="h-1.5 flex-1 cursor-pointer accent-emerald-600"
                />
                <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-slate-100 p-0.5">
                    {SPEEDS.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setSpeed(s)}
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold transition ${speed === s ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* =========================================================================
   GRAPH: Fig 17.1 — Example 1: y − x ≤ 1, 2x < 5, 5y > −4x
   ========================================================================= */
const Fig17_1 = () => (
    <Graph xRange={[-5, 5]} yRange={[-3.5, 5]}>
        <GLine x1={-4} y1={-3} x2={4} y2={5} color="#1e3a8a" width={2.5} />
        <GText x={4} y={5} dx={10} dy={-4} color="#1e3a8a">y = x + 1</GText>

        <GLine x1={2.5} y1={-3.5} x2={2.5} y2={5} color="#dc2626" width={2} dashed />
        <GText x={2.5} y={-3.5} dy={-10} color="#dc2626" anchor="middle">x = 2.5</GText>

        <GLine x1={-4} y1={3.2} x2={4} y2={-3.2} color="#059669" width={2} dashed />
        <GText x={4} y={-3.2} dx={10} dy={-4} color="#059669">y = -4x/5</GText>

        <GShadeExcluded x1={-4} y1={-3} x2={4} y2={5} awayX={0} awayY={4} />
        <GShadeExcluded x1={2.5} y1={-3.5} x2={2.5} y2={5} awayX={4} awayY={0} />
        <GShadeExcluded x1={-4} y1={3.2} x2={4} y2={-3.2} awayX={0} awayY={-3} />

        <GText x={0} y={0.8} color="#0f172a" size={22} weight="bold">R</GText>
        <GText x={-5} y={-2.5} color="#6b7280" size={11}>Solid: included</GText>
        <GText x={-5} y={-2.0} color="#6b7280" size={11}>Dashed: not included</GText>
    </Graph>
);

/* =========================================================================
   GRAPH: Fig 17.2 — Example 2: region A from x ≤ 3, y > 4 − x, y ≤ 2x + 1
   ========================================================================= */
const Fig17_2 = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 8]}>
        <GLine x1={3} y1={-1} x2={3} y2={8} color="#1e3a8a" width={2.5} />
        <GText x={3} y={-1} dy={-8} size={13} color="#1e3a8a" anchor="middle">x = 3</GText>

        <GLine x1={-1} y1={5} x2={5} y2={-1} color="#dc2626" width={2} dashed />
        <GText x={5} y={-1} dx={8} dy={-2} size={13} color="#dc2626">y = 4 − x</GText>

        <GLine x1={-1} y1={-1} x2={4} y2={9} color="#059669" width={2.5} />
        <GText x={4} y={9} dx={8} dy={-2} size={13} color="#059669">y = 2x + 1</GText>

        <GShadeExcluded x1={3} y1={-1} x2={3} y2={8} awayX={5} awayY={0} />
        <GShadeExcluded x1={-1} y1={5} x2={5} y2={-1} awayX={0} awayY={-1} />
        <GShadeExcluded x1={-1} y1={-1} x2={4} y2={9} awayX={0} awayY={5} />

        <GText x={1.5} y={4.5} color="#0f172a" size={20} weight="bold">A</GText>
    </Graph>
);

/* =========================================================================
   GRAPH: Fig 17.3 — Exercise 17a Q3
   NOTE: the scan of Fig 17.3 you shared is too low-resolution for me to
   read its exact boundary equations and vertices reliably (the axis
   numbers and line labels aren't legible). The triangle below is a
   placeholder built to roughly match its shape, NOT reconstructed from
   real coordinates — please replace the three GLine calls with the
   actual equations once you can read them off a clearer copy of the page.
   ========================================================================= */
const Fig17_3 = () => (
    <Graph xRange={[-1, 7]} yRange={[-1, 7]}>
        <GLine x1={0} y1={6} x2={5} y2={0} color="#1e3a8a" width={2} dashed />
        <GLine x1={0} y1={0} x2={6} y2={2} color="#dc2626" width={2} dashed />
        <GLine x1={0} y1={0} x2={0} y2={6} color="#059669" width={2.5} />
        <GText x={2} y={2.5} color="#0f172a" size={20} weight="bold">A</GText>
        <GText x={0} y={-1} dy={-14} size={11} color="#b45309" anchor="middle">Placeholder — verify against a clearer scan</GText>
    </Graph>
);

/* =========================================================================
   GRAPH: Fig 17.6 — Example 3
   A student has $2.50 to spend on ballpens (25c) and pencils (10c).
   She wants at least five of each, and the amount spent on ballpens is
   over 50c more than the amount spent on pencils:
     x ≥ 5, y ≥ 5, 25x + 10y ≤ 250, 25x − 10y > 50
   This gives exactly 12 integer solutions, matching the textbook: max
   ballpens 8 at (8,5), max pencils 9 at (6,9).
   ========================================================================= */
const FIG17_6_POINTS: [number, number][] = (() => {
    const pts: [number, number][] = [];
    for (let x = 0; x <= 12; x++) {
        for (let y = 0; y <= 14; y++) {
            if (x >= 5 && y >= 5 && 25 * x + 10 * y <= 250 && 25 * x - 10 * y > 50) pts.push([x, y]);
        }
    }
    return pts;
})();

const Fig17_6 = () => (
    <Graph xRange={[-1, 12]} yRange={[-1, 14]}>
        <GLine x1={5} y1={-1} x2={5} y2={14} color="#1e3a8a" width={2.5} />
        <GText x={5} y={-1} dy={-8} size={13} color="#1e3a8a" anchor="middle">x = 5</GText>

        <GLine x1={-1} y1={5} x2={12} y2={5} color="#7c3aed" width={2.5} />
        <GText x={12} y={5} dx={8} dy={4} size={13} color="#7c3aed">y = 5</GText>

        <GLine x1={-2} y1={30} x2={11} y2={-2.5} color="#059669" width={2.5} />
        <GText x={9} y={2.5} dx={8} dy={-6} size={12} color="#059669">25x + 10y = 250</GText>

        <GLine x1={0.5} y1={-3.75} x2={12} y2={25} color="#dc2626" width={2} dashed />
        <GText x={10} y={20} dx={8} dy={0} size={12} color="#dc2626">25x − 10y = 50</GText>

        <GShadeExcluded x1={5} y1={-1} x2={5} y2={14} awayX={7} awayY={7} />
        <GShadeExcluded x1={-1} y1={5} x2={12} y2={5} awayX={7} awayY={7} />
        <GShadeExcluded x1={-2} y1={30} x2={11} y2={-2.5} awayX={5} awayY={5} />
        <GShadeExcluded x1={0.5} y1={-3.75} x2={12} y2={25} awayX={5} awayY={5.5} />

        {FIG17_6_POINTS.map(([x, y], i) => <GPoint key={i} x={x} y={y} r={4} color="#f43f5e" />)}

        <GPoint x={8} y={5} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={8} y={5} dx={10} dy={-6} size={13} color="#f43f5e" weight="bold">(8, 5)</GText>

        <GPoint x={6} y={9} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={6} y={9} dx={10} dy={-6} size={13} color="#f43f5e" weight="bold">(6, 9)</GText>

        <GText x={0.5} y={12} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

/* =========================================================================
   GRAPH: Fig 17.7 — the family of parallel lines x + y = n
   ========================================================================= */
const Fig17_7 = () => (
    <Graph xRange={[-1, 14]} yRange={[-1, 12]}>
        <GLine x1={0} y1={5} x2={5} y2={0} color="#f59e0b" width={2} dashed />
        <GText x={5} y={0} dx={8} dy={-2} size={13} color="#f59e0b">x + y = 5</GText>

        <GLine x1={0} y1={10} x2={10} y2={0} color="#f59e0b" width={2} dashed />
        <GText x={10} y={0} dx={8} dy={-2} size={13} color="#f59e0b">x + y = 10</GText>

        <GLine x1={0} y1={12} x2={12} y2={0} color="#f59e0b" width={2} dashed />
        <GText x={12} y={0} dx={8} dy={-2} size={13} color="#f59e0b">x + y = 12</GText>

        <GLine x1={0} y1={6} x2={6} y2={0} color="#f59e0b" width={1} dashed />
        <GLine x1={0} y1={8} x2={8} y2={0} color="#f59e0b" width={1} dashed />
        <GLine x1={0} y1={3} x2={3} y2={0} color="#f59e0b" width={1} dashed />

        <GText x={1} y={2} color="#0f172a" size={16} weight="bold">x + y = n</GText>
        <GText x={1} y={1.3} color="#6b7280" size={12}>n = 5, 10, 12</GText>
    </Graph>
);

/* =========================================================================
   GRAPH: Fig 17.8 — Fig 17.6 with the family x + y = n added; max n = 15
   ========================================================================= */
const Fig17_8 = () => (
    <Graph xRange={[-1, 16]} yRange={[-1, 12]}>
        <GLine x1={5} y1={-1} x2={5} y2={12} color="#1e3a8a" width={2} />
        <GLine x1={-1} y1={5} x2={16} y2={5} color="#7c3aed" width={2} />
        <GLine x1={-2} y1={30} x2={11} y2={-2.5} color="#059669" width={2} />
        <GText x={9} y={2.5} dx={8} dy={-6} size={11} color="#059669">25x + 10y = 250</GText>
        <GLine x1={0.5} y1={-3.75} x2={12} y2={25} color="#dc2626" width={1.5} dashed />

        <GLine x1={0} y1={5} x2={5} y2={0} color="#f59e0b" width={1} dashed />
        <GLine x1={0} y1={10} x2={10} y2={0} color="#f59e0b" width={1} dashed />
        <GLine x1={0} y1={12} x2={12} y2={0} color="#f59e0b" width={1.5} dashed />
        <GLine x1={0} y1={14} x2={14} y2={0} color="#f59e0b" width={2} dashed />
        <GText x={14} y={0} dx={6} dy={-2} size={12} color="#f59e0b">x + y = 14</GText>
        <GLine x1={0} y1={15} x2={15} y2={0} color="#f59e0b" width={2.5} />
        <GText x={15} y={0} dx={6} dy={-2} size={12} color="#f59e0b">x + y = 15</GText>

        {FIG17_6_POINTS.map(([x, y], i) => <GPoint key={i} x={x} y={y} r={3.5} color="#f43f5e" />)}

        <GPoint x={6} y={9} r={5.5} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={6} y={9} dx={10} dy={-8} size={14} color="#f43f5e" weight="bold">(6, 9)</GText>

        <GText x={0.5} y={10} color="#0f172a" size={18} weight="bold">R</GText>
        <GText x={0.5} y={9} color="#6b7280" size={11}>x + y = 15 max</GText>
    </Graph>
);

/* =========================================================================
   GRAPH: Fig 17.9 — Example 5: bus company problem
   x ≥ 5, y ≥ 10, x + y ≤ 30, 3x + y ≤ 54; C = 90x + 48y, max at (12,18)
   ========================================================================= */
const Fig17_9 = () => (
    <Graph xRange={[0, 32]} yRange={[0, 32]}>
        <GLine x1={5} y1={0} x2={5} y2={32} color="#1e3a8a" width={2.5} />
        <GText x={5} y={0} dy={-8} size={13} color="#1e3a8a" anchor="middle">x = 5</GText>

        <GLine x1={0} y1={10} x2={32} y2={10} color="#dc2626" width={2.5} />
        <GText x={32} y={10} dx={8} dy={4} size={13} color="#dc2626">y = 10</GText>

        <GLine x1={0} y1={30} x2={30} y2={0} color="#059669" width={2.5} />
        <GText x={30} y={0} dx={6} dy={-4} size={13} color="#059669">x + y = 30</GText>

        <GLine x1={0} y1={54} x2={18} y2={0} color="#7c3aed" width={2.5} />
        <GText x={18} y={0} dx={6} dy={-4} size={13} color="#7c3aed">3x + y = 54</GText>

        <GLine x1={0} y1={15} x2={8} y2={0} color="#f59e0b" width={1.5} dashed />
        <GText x={8} y={0} dx={6} dy={-4} size={11} color="#f59e0b">C = 720</GText>

        <GLine x1={0} y1={40.5} x2={21.6} y2={0} color="#f59e0b" width={2} dashed />
        <GText x={21.6} y={0} dx={6} dy={-4} size={11} color="#f59e0b">C = 1944</GText>

        <GShadeExcluded x1={5} y1={0} x2={5} y2={32} awayX={0} awayY={5} />
        <GShadeExcluded x1={0} y1={10} x2={32} y2={10} awayX={5} awayY={0} />
        <GShadeExcluded x1={0} y1={30} x2={30} y2={0} awayX={30} awayY={30} />
        <GShadeExcluded x1={0} y1={54} x2={18} y2={0} awayX={30} awayY={30} />

        <GText x={8} y={20} color="#0f172a" size={18} weight="bold">R</GText>

        <GPoint x={12} y={18} r={5.5} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={12} y={18} dx={10} dy={-8} size={14} color="#f43f5e" weight="bold">(12, 18)</GText>

        <GPoint x={8} y={12} r={2.5} color="#6b7280" />
        <GPoint x={10} y={15} r={2.5} color="#6b7280" />
        <GPoint x={14} y={14} r={2.5} color="#6b7280" />
        <GPoint x={6} y={14} r={2.5} color="#6b7280" />
    </Graph>
);
const TheoremExplainer = ({ heading, paragraphs, callout, calloutSn, footer, audioSrc }) => {
    const [showSn, setShowSn] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleTogglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
    };

    return (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">{heading}</h3>
            <div className="space-y-3">
                {paragraphs.map((p, i) => (
                    <div key={i} className="leading-relaxed text-slate-700">{p}</div>
                ))}
            </div>
            <div className="my-4 flex items-start gap-3 rounded-r-lg border-l-4ac border-rose-300 bg-rose-50/60 py-3 pl-4 pr-3">
                <p className="flex-1 font-bold leading-snug text-slate-800">{showSn && calloutSn ? calloutSn : callout}</p>
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                    {calloutSn && (
                        <button
                            type="button"
                            onClick={() => setShowSn((s) => !s)}
                            aria-pressed={showSn}
                            title={showSn ? 'Show in English' : 'Bvunza muChiShona'}
                            className={`flex items-center justify-center rounded-lg p-1 transition ${showSn ? 'bg-white ring-2 ring-emerald-500' : 'bg-white/60 hover:bg-white'}`}
                        >
                            <ZwFlag className="h-4 w-6" />
                        </button>
                    )}
                    {audioSrc && (
                        <>
                            <button
                                type="button"
                                onClick={handleTogglePlay}
                                aria-pressed={isPlaying}
                                title={isPlaying ? 'Pause explanation' : 'Play explanation'}
                                className="relative overflow-hidden flex items-center justify-center rounded-full p-1.5 text-white transition-all active:scale-95"
                                style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 3px 0 #155208, 0 4px 6px rgba(0,0,0,0.25)' }}
                            >
                                <span className="absolute inset-x-0.5 top-0.5 h-1.5 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                                {isPlaying ? (
                                    <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="0" width="3.5" height="10" fill="white" /><rect x="6.5" y="0" width="3.5" height="10" fill="white" /></svg>
                                ) : (
                                    <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="0,0 10,5 0,10" fill="white" /></svg>
                                )}
                            </button>
                            <audio
                                ref={audioRef}
                                src={audioSrc}
                                onEnded={() => setIsPlaying(false)}
                                onPause={() => setIsPlaying(false)}
                                className="hidden"
                            />
                        </>
                    )}
                </div>
            </div>
            {footer && <p className="leading-relaxed text-slate-700">{footer}</p>}
        </div>
    );
};

/* =========================================================================
   EXAMPLE CARD (reused pattern)
   ========================================================================= */
const ExampleCard = ({ index, example }) => {
    const [open, setOpen] = useState(false);
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
                    <div className="rounded-lg bg-blue-50/40 p-4 pl-6">
                        {example.steps.map((step, i) => (
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
   GRAPH DISPLAY COMPONENT
   ========================================================================= */
const GraphDisplay = ({ title, children, caption }) => (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {title && <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{title}</div>}
        <div className="p-4 bg-slate-50/50 max-w-xl mx-auto">
            {children}
        </div>
        {caption && <p className="border-t border-slate-100 px-4 py-2 text-xs italic text-slate-500">{caption}</p>}
    </div>
);

/* =========================================================================
   LINEAR PROGRAMMING SECTION COMPONENT
   ========================================================================= */
const Section = ({ section }) => {
    const { id, eyebrow, title, heading, intro, content, graphs, examples, practice, definition } = section;

    return (
        <section id={id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
            <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{eyebrow}</span>
                <h2 className="text-2xl font-bold text-slate-900">{heading}</h2>
            </div>

            <div className="mb-6">
                {typeof intro === 'string'
                    ? <p className="mb-4 leading-relaxed text-slate-700">{intro}</p>
                    : intro}

                {definition && <DefinitionBox>{definition}</DefinitionBox>}

                {content && content.map((item, i) => {
                    if (item.type === 'paragraph') {
                        return <p key={i} className="mb-4 leading-relaxed text-slate-700"><MathText text={item.text} /></p>;
                    }
                    if (item.type === 'graph') {
                        const GraphComp = item.component;
                        return (
                            <GraphDisplay key={i} title={item.title} caption={item.caption}>
                                <GraphComp />
                            </GraphDisplay>
                        );
                    }
                    if (item.type === 'note') {
                        return (
                            <div key={i} className="my-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                                <span className="font-bold text-amber-700">Note:</span>
                                <span className="ml-2 text-slate-700">{item.text}</span>
                            </div>
                        );
                    }
                    if (item.type === 'example') {
                        return (
                            <div key={i} className="my-4 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4">
                                <p className="gc-ink text-xl font-bold leading-snug text-blue-900 sm:text-2xl">{item.text}</p>
                            </div>
                        );
                    }
                    if (item.type === 'worked') {
                        return (
                            <div key={i} className="my-4 rounded-lg border border-emerald-200 bg-emerald-50 px-5 py-4">
                                <p className="gc-hand font-bold text-emerald-800">{item.text}</p>
                                {item.working && <p className="gc-ink mt-2 text-lg leading-snug text-slate-800">{item.working}</p>}
                                {item.answer && <p className="gc-ink mt-2 text-xl font-bold text-emerald-700">{item.answer}</p>}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {graphs && graphs.map((g, i) => {
                const GraphComp = g.component;
                return (
                    <GraphDisplay key={i} title={g.title} caption={g.caption}>
                        <GraphComp />
                    </GraphDisplay>
                );
            })}

            {examples && examples.length > 0 && (
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Worked Examples</h3>
                    {examples.map((ex, i) => (
                        <ExampleCard key={i} index={i + 1} example={ex} />
                    ))}
                </div>
            )}

            {practice && practice.length > 0 && <PracticeZone items={practice} />}
        </section>
    );
};

/* =========================================================================
   MAIN INEQUALITIES COMPONENT
   ========================================================================= */
export const Inequalities = () => {
    const [active, setActive] = useState('intro');
    const [lang, setLang] = useState('en');

    const sections = [
        {
            id: 'intro',
            eyebrow: 'Chapter 17',
            title: 'Introduction',
            heading: 'Linear Programming',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Linear programming is a way of solving problems where you have <strong>restrictions</strong> — like a limited amount of money, or a limit on how much space you have.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Think of it like planning a shopping trip. You have a fixed budget, and you need to buy different items. Each item costs a certain amount, and you have to stay within your budget. But you also want to get the most items, or the most value.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Each restriction — like the budget, or the number of items you can carry — can be written as an <strong>inequality</strong>. When you put all the inequalities together, they create a <strong>region</strong> on a graph. The points inside that region are all the possible solutions.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        The best solution — like the one that gives you the most items or the lowest cost — is found by looking at the edges of that region. This is what we call <strong>linear programming</strong>.
                    </p>
                </>
            ),
            definition: 'Linear programming is a method for finding the best outcome (such as maximum profit or lowest cost) in a mathematical model whose requirements are represented by linear relationships.',
            content: [
                { type: 'paragraph', text: 'Let\'s start with a simple example. We have three inequalities:' },
                { type: 'example', text: 'y − x ≤ 1, 2x < 5, 5y > −4x' },
                { type: 'paragraph', text: 'Each inequality represents a restriction. The first one says that y can\'t be more than x + 1. The second says x must be less than 2.5. The third says y must be greater than −4x/5.' },
                { type: 'paragraph', text: 'When we draw these on a graph, the region where all three are true is the solution set. Let\'s see what that looks like.' },
                { type: 'graph', component: Fig17_1, title: 'Fig 17.1 — Solution Set of Three Inequalities', caption: 'The unshaded region R contains all points (x, y) that satisfy all three inequalities. Solid lines mean the points on the line are included; dashed lines mean they are not.' },
                { type: 'note', text: 'A solid line is used when the inequality includes "≤" or "≥" (the points on the line are included). A dashed line is used when the inequality uses "<" or ">" (the points on the line are not included).' },
                { type: 'paragraph', text: 'Now let\'s try the reverse problem. Instead of being given the inequalities, we\'re given the graph and we need to work out what the inequalities are.' },
                { type: 'graph', component: Fig17_2, title: 'Fig 17.2 — Finding Inequalities from a Graph', caption: 'The unshaded region A is defined by three inequalities. Can you work out what they are?' },
                { type: 'paragraph', text: 'Looking at Fig 17.2, we can see three boundary lines:' },
                { type: 'paragraph', text: '1. A vertical line at x = 3 (solid) — so the region is on the left, meaning x ≤ 3.' },
                { type: 'paragraph', text: '2. A diagonal line y = 4 − x (dashed) — the region is above this line, so y > 4 − x.' },
                { type: 'paragraph', text: '3. Another diagonal line y = 2x + 1 (solid) — the region is below this line, so y ≤ 2x + 1.' },
                { type: 'paragraph', text: 'So the three inequalities are: x ≤ 3, y > 4 − x, y ≤ 2x + 1.' },
            ],
            practice: [
                'On graph paper, show the region defined by: 4y − x < 4, x − y < 3, x ≥ −2. Use solid and broken lines appropriately and leave the required region unshaded.',
                'Write down the three inequalities that define the unshaded area labelled A in Fig 17.3.',
                'Solve graphically for integral values of x and y: y ≥ x, y ≤ 3x, y + 2x < 8.',
            ],
        },
        {
            id: 'example3',
            eyebrow: 'Chapter 17',
            title: 'Example 3',
            heading: 'Spending Money — A Real Problem',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Now let's look at a real problem. A student has <strong>$2.50</strong> to spend on ballpens and pencils.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Each ballpen costs <strong>25¢</strong> and each pencil costs <strong>10¢</strong>. The student wants to buy at least 6 ballpens and at least 8 pencils.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        How many different ways can she spend her money? And what's the most of each item she can buy?
                    </p>
                </>
            ),
            content: [
                { type: 'paragraph', text: 'Let x be the number of ballpens and y be the number of pencils.' },
                { type: 'paragraph', text: 'The cost of x ballpens is 25x cents, and the cost of y pencils is 10y cents. The total cost must be at most 250 cents:' },
                { type: 'example', text: '25x + 10y ≤ 250' },
                { type: 'paragraph', text: 'She needs at least 6 ballpens and 8 pencils:' },
                { type: 'example', text: 'x ≥ 6, y ≥ 8' },
                { type: 'paragraph', text: 'We also know x and y must be whole numbers (you can\'t buy half a pen!).' },
                { type: 'paragraph', text: 'Let\'s plot these on a graph and see all the possible combinations.' },
                { type: 'graph', component: Fig17_6, title: 'Fig 17.6 — All Possible Ways to Spend the Money', caption: 'The 12 points marked in the unshaded region R show all the ways the student can buy ballpens and pencils within her budget. For example, (6,8) means 6 ballpens and 8 pencils.' },
                { type: 'paragraph', text: 'From the graph, we can see there are 12 different ways to spend the money.' },
                { type: 'paragraph', text: 'The greatest number of ballpens she can buy is 8 (at point (8,5)).' },
                { type: 'paragraph', text: 'The greatest number of pencils she can buy is 9 (at point (6,9)).' },
            ],
            practice: [
                'A student has $3.60 to spend on notebooks (60¢ each) and pencils (36¢ each). She needs at least 20 notebooks and 3 pencils. How many ways can she spend her money?',
                'A shopkeeper orders packets of soap powder. Large packets cost $2.70, small packets cost $1.20. She has $60 to spend and needs twice as many small as large, with at least 10 large and 20 small. What is the greatest number of packets she can buy?',
            ],
        },
        {
            id: 'example4',
            eyebrow: 'Chapter 17',
            title: 'Example 4',
            heading: 'Getting the Most Items',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        In the previous example, the student wanted to know all the ways she could spend her money. But what if she wants to buy <strong>as many items as possible</strong>?
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Now we're not just looking for any solution — we're looking for the <strong>best</strong> solution. This is where linear programming really shines.
                    </p>
                </>
            ),
            content: [
                { type: 'paragraph', text: 'The number of items bought is x + y. Let\'s call this n.' },
                { type: 'paragraph', text: 'We want to find the largest possible value of n = x + y that still satisfies all the restrictions:' },
                { type: 'example', text: '25x + 10y ≤ 250, x ≥ 6, y ≥ 8' },
                { type: 'paragraph', text: 'On a graph, x + y = n is a family of parallel lines. As n increases, the lines move to the right.' },
                { type: 'graph', component: Fig17_7, title: 'Fig 17.7 — The Family of Lines x + y = n', caption: 'As n increases from 5 to 10 to 12, the lines move to the right. The largest n that still passes through the region R gives us the maximum number of items.' },
                { type: 'paragraph', text: 'Now let\'s add these lines to our original graph to find the maximum.' },
                { type: 'graph', component: Fig17_8, title: 'Fig 17.8 — Finding the Maximum Number of Items', caption: 'The line x + y = 15 passes through the point (6,9) in the region R. This gives the maximum number of items: 15.' },
                { type: 'paragraph', text: 'The maximum number of items is 15, achieved by buying 6 ballpens and 9 pencils.' },
                { type: 'worked', text: 'Let\'s check the cost:', working: '6 ballpens × 25¢ = $1.50, 9 pencils × 10¢ = $0.90, Total = $2.40', answer: 'Change from $2.50 = 10¢' },
                { type: 'paragraph', text: 'So the student gets 15 items and has 10¢ change.' },
            ],
            practice: [
                'A girl has $3.60 to spend on notebooks (60¢) and pencils (36¢). She needs at least 20 notebooks and 3 pencils. She wants to spend as much as possible. How many ways can she spend her money? Do any give her change?',
                'A dressmaker buys machines A ($300, 3m²) and B ($400, 2.5m²). She has $3600 and 27m² of floor space. She must buy at least 3 of A and 4 of B. What arrangement gives the biggest output?',
            ],
        },
        {
            id: 'example5',
            eyebrow: 'Chapter 17',
            title: 'Example 5',
            heading: 'The Bus Company Problem',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Here's a bigger problem. A businessman wants to start a bus company.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        He needs at least <strong>5 buses</strong> and <strong>10 minibuses</strong>. He doesn't want more than <strong>30 vehicles</strong> altogether. And he only has <strong>54 units</strong> of garage space — each bus takes 3 units, each minibus takes 1 unit.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Running costs are <strong>$90 per day</strong> for a bus and <strong>$48 per day</strong> for a minibus. He wants to know what combination gives the <strong>maximum daily cost</strong> (since he can charge more if he runs more vehicles).
                    </p>
                </>
            ),
            content: [
                { type: 'paragraph', text: 'Let x = number of buses, y = number of minibuses.' },
                { type: 'paragraph', text: 'From the requirements:' },
                { type: 'example', text: 'x ≥ 5, y ≥ 10, x + y ≤ 30' },
                { type: 'paragraph', text: 'From the garage space:' },
                { type: 'example', text: '3x + y ≤ 54' },
                { type: 'paragraph', text: 'The daily cost is:' },
                { type: 'example', text: 'C = 90x + 48y' },
                { type: 'paragraph', text: 'Let\'s plot these inequalities and find the region of possible values.' },
                { type: 'graph', component: Fig17_9, title: 'Fig 17.9 — The Bus Company\'s Feasible Region', caption: 'The region R shows all possible combinations of buses (x) and minibuses (y). The point (12,18) gives the maximum daily cost.' },
                { type: 'paragraph', text: 'The region R is the set of all possible (x, y) values that satisfy all restrictions.' },
                { type: 'paragraph', text: 'To find the maximum cost, we look for the point in R that gives the largest value of C = 90x + 48y.' },
                { type: 'paragraph', text: 'The lines C = 720 and C = 1944 are shown. As C increases, the lines move to the right. The last line that still touches R is at C = 1944, at point (12, 18).' },
                { type: 'worked', text: 'Maximum cost at (12, 18):', working: '12 buses × $90 = $1080, 18 minibuses × $48 = $864', answer: 'Total = $1944 per day' },
                { type: 'note', text: 'In part (d), C = 720 was chosen as the LCM of 90 and 48 to give a convenient line through (8,6) and (0,15). The maximum cost line C = 1944 is then drawn parallel to it.' },
            ],
            practice: [
                'Redraw Fig 17.9 using a scale of 2 cm to 1 unit on both axes. When the bus company is running at full efficiency, the daily profit on a bus is 60 times that on a minibus. Find the number of buses and minibuses the businessman should buy to maximise his profit.',
                'A car repair workshop uses two types of spare parts: $3 and $4 each. The owner allows $300 and needs twice as many cheap as dear ones, with at least 50 cheap and 20 expensive. What is the largest number of parts he can buy?',
                'A storeman fills a warehouse with boxes of type A ($50, ½m²) and type B ($300, ½m²). He has 100m² of floor space and $1500 to spend. He needs at least 50 of A and 20 of B. (a) How many of each for max spend and max space? (b) What is the cost in the second case?',
                'Following an illness, a patient needs pills with minerals (800mg) and vitamins (30mg). Fecgold has 160mg mineral, 4mg vitamin; Getbeta has 40mg mineral, 3mg vitamin. Find the cheapest prescription.',
                'A builder has $96000 and 8ha of land. Large houses cost $24000 and need 0.25ha; small houses cost $15000 and need 0.1ha. There must be at least 16 large and 30 small. (a) Find the greatest number of large houses. (b) Find the distribution that (i) gives the greatest number of houses, (ii) uses all the land.',
            ],
        },
    ];

    const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
    const activeSection = sections[activeIndex] || sections[0];

    const handleNavigate = (id) => {
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

            {/* Header */}
            <div className={`relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md`}>
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-violet-400/30 text-white border border-violet-200/40`}>CHAPTER 17</span>
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
                    <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Linear Programming</h1>
                    <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                        {lang === 'sn' ? "Zvishandiso zvekugadzirisa matambudziko ane miganhu — semari shoma, nzvimbo shoma, kana nhamba shoma yezvinhu. Shandisa graph kuona nzvimbo yezvose zvinobvira, uye uwane mhinduro yakanakisa." : "A practical way to solve problems with limits — like a tight budget, limited space, or a maximum number of items. Use a graph to see all possible solutions, then pick the best one."}
                    </p>
                </div>
            </div>

            {/* Navigation pills */}
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

            {/* Main content */}
            <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
                <div key={activeSection.id}>
                    <Section section={activeSection} />
                </div>

                {/* Navigation buttons */}
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

export default Inequalities;