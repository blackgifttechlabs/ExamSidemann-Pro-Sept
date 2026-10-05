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
    <div className="my-6 rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
        <div className="text-base font-bold uppercase tracking-wide text-slate-700">{label === 'Definition' ? 'Official Definition' : label}</div>
        <p className="mt-2 break-words text-[22px] font-bold leading-snug text-slate-900 sm:text-[26px]">{children}</p>
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
                    ? <span key={i} className="gc-ink font-bold text-slate-900">{part}</span>
                    : <React.Fragment key={i}>{part}</React.Fragment>
            )}
        </>
    );
};

const PracticeZone = ({ items }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-7">
        <h3 className="mb-4 flex items-center gap-2 text-2xl font-extrabold uppercase tracking-tight">
            Practice Zone
        </h3>
        <div className="space-y-4">
            {items.map((q, i) => (
                <div key={i} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <span className="text-lg font-extrabold text-slate-700">{i + 1}.</span>
                    <span className="text-[18px] leading-[1.7] text-slate-700">{q}</span>
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
                            className={`rounded-full px-1.5 py-0.5 text-xs font-bold transition ${speed === s ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
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
const FigGI_Dashed = () => (
    <Graph xRange={[-4, 4]} yRange={[-5, 7]}>
        <GLine x1={-3} y1={-5} x2={3} y2={7} color="#1e3a8a" width={2.5} dashed />
        <GText x={3} y={7} dx={8} dy={-2} size={13} color="#1e3a8a">y = 2x + 1</GText>
        <GShadeExcluded x1={-3} y1={-5} x2={3} y2={7} awayX={-2} awayY={5} />
        <GPoint x={0} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={18} size={13} color="#f43f5e" weight="bold">(0, 0) is not in the region</GText>
        <GText x={-3.6} y={5.5} color="#0f172a" size={16} weight="bold">{'y > 2x + 1'}</GText>
    </Graph>
);

const FigGI_Solid = () => (
    <Graph xRange={[-2, 5]} yRange={[-3, 8]}>
        <GLine x1={-1} y1={8} x2={4} y2={-2} color="#1e3a8a" width={2.5} />
        <GText x={4} y={-2} dx={8} dy={-4} size={13} color="#1e3a8a">2x + y = 6</GText>
        <GShadeExcluded x1={-1} y1={8} x2={4} y2={-2} awayX={0} awayY={0} />
        <GPoint x={0} y={0} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#16a34a" weight="bold">(0, 0) works</GText>
        <GText x={-1.8} y={-2} color="#0f172a" size={16} weight="bold">{'2x + y ≤ 6'}</GText>
    </Graph>
);

const FigGI_Simul = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={0} x2={5} y2={6} color="#1e3a8a" width={2.5} />
        <GText x={5} y={6} dx={8} dy={-2} size={13} color="#1e3a8a">y = x + 1</GText>
        <GLine x1={-1} y1={6} x2={6} y2={-1} color="#dc2626" width={2.5} />
        <GText x={6} y={-1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">y = 5 − x</GText>
        <GShadeExcluded x1={-1} y1={0} x2={5} y2={6} awayX={1} awayY={3} />
        <GShadeExcluded x1={-1} y1={6} x2={6} y2={-1} awayX={1} awayY={3} />
        <GText x={0} y={3} color="#0f172a" size={20} weight="bold">R</GText>
        <GPoint x={2} y={3} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={2} y={3} dx={10} dy={-8} size={13} color="#f43f5e" weight="bold">(2, 3)</GText>
    </Graph>
);

const FigGI_LineTypes = () => (
    <Graph xRange={[-4, 5]} yRange={[-6, 7]}>
        <GLine x1={-3} y1={-5} x2={3} y2={7} color="#1e3a8a" width={2.5} dashed />
        <GText x={3} y={7} dx={8} dy={4} size={13} color="#1e3a8a">y = 2x + 1</GText>
        <GLine x1={-1.5} y1={-6} x2={4.5} y2={6} color="#dc2626" width={2.5} />
        <GText x={4.5} y={6} dx={-8} dy={18} size={13} color="#dc2626" anchor="end">y = 2x − 3</GText>
        <GText x={-3.9} y={6} color="#1e3a8a" size={13} weight="bold">{'Broken line: > or <'}</GText>
        <GText x={-3.9} y={5.2} color="#dc2626" size={13} weight="bold">{'Solid line: ≥ or ≤'}</GText>
    </Graph>
);

const FigGI_Vert = () => (
    <Graph xRange={[-1, 6]} yRange={[-2, 6]}>
        <GLine x1={3} y1={-2} x2={3} y2={6} color="#1e3a8a" width={2.5} />
        <GText x={3} y={-2} dy={-8} size={13} color="#1e3a8a" anchor="middle">x = 3</GText>
        <GShadeExcluded x1={3} y1={-2} x2={3} y2={6} awayX={5} awayY={2} />
        <GText x={4.2} y={4.5} color="#0f172a" size={20} weight="bold">R</GText>
        <GText x={-0.9} y={5.2} color="#1e3a8a" size={14} weight="bold">{'x ≥ 3: shade right'}</GText>
    </Graph>
);

const FigGI_Horiz = () => (
    <Graph xRange={[-2, 6]} yRange={[-1, 6]}>
        <GLine x1={-2} y1={4} x2={6} y2={4} color="#dc2626" width={2.5} dashed />
        <GText x={6} y={4} dx={-6} dy={-8} size={13} color="#dc2626" anchor="end">y = 4</GText>
        <GShadeExcluded x1={-2} y1={4} x2={6} y2={4} awayX={2} awayY={1} />
        <GText x={2} y={2} color="#0f172a" size={20} weight="bold">R</GText>
        <GText x={-1.9} y={5.3} color="#dc2626" size={14} weight="bold">{'y < 4: shade below'}</GText>
    </Graph>
);

const FigGI_Read = () => (
    <Graph xRange={[-4, 3]} yRange={[-3, 9]}>
        <GLine x1={-3} y1={-3} x2={3} y2={9} color="#1e3a8a" width={2.5} />
        <GText x={-3} y={-3} dx={8} dy={-10} size={13} color="#1e3a8a">y = 2x + 3</GText>
        <GShadeExcluded x1={-3} y1={-3} x2={3} y2={9} awayX={2} awayY={0} />
        <GText x={1} y={-1} color="#0f172a" size={20} weight="bold">R</GText>
        <GText x={-3.9} y={8.2} color="#1e3a8a" size={13} weight="bold">Solid line, R is below</GText>
    </Graph>
);

const FigGI_Test = () => (
    <Graph xRange={[-1, 7]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={7} x2={7} y2={-1} color="#dc2626" width={2.5} dashed />
        <GText x={7} y={-1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">x + y = 6</GText>
        <GShadeExcluded x1={-1} y1={7} x2={7} y2={-1} awayX={0} awayY={0} />
        <GPoint x={0} y={0} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={18} size={13} color="#16a34a" weight="bold">(0, 0) works</GText>
        <GText x={1} y={2} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigGI_Four = () => (
    <Graph xRange={[-1, 11]} yRange={[-1, 11]}>
        <GLine x1={0} y1={10} x2={10} y2={0} color="#059669" width={2.5} />
        <GText x={10} y={0} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 10</GText>
        <GLine x1={0} y1={0} x2={5.5} y2={11} color="#7c3aed" width={2.5} />
        <GText x={5.5} y={11} dx={8} dy={4} size={13} color="#7c3aed">y = 2x</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={11} awayX={5} awayY={2} />
        <GShadeExcluded x1={-1} y1={0} x2={11} y2={0} awayX={5} awayY={2} />
        <GShadeExcluded x1={0} y1={10} x2={10} y2={0} awayX={2} awayY={2} />
        <GShadeExcluded x1={0} y1={0} x2={5.5} y2={11} awayX={5} awayY={2} />
        <GText x={5.2} y={2.5} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigGI_Quadrant = () => (
    <Graph xRange={[-2, 8]} yRange={[-2, 8]}>
        <GLine x1={-1} y1={7} x2={7} y2={-1} color="#059669" width={2.5} />
        <GText x={7} y={-1} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 6</GText>
        <GShadeExcluded x1={0} y1={-2} x2={0} y2={8} awayX={2} awayY={2} />
        <GShadeExcluded x1={-2} y1={0} x2={8} y2={0} awayX={2} awayY={2} />
        <GShadeExcluded x1={-1} y1={7} x2={7} y2={-1} awayX={1} awayY={1} />
        <GText x={1.3} y={1.5} color="#0f172a" size={20} weight="bold">R</GText>
        <GText x={-1.9} y={7.2} color="#6b7280" size={12}>x ≥ 0, y ≥ 0: first quadrant</GText>
    </Graph>
);

const FigGI_Verts = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={3} x2={6} y2={3} color="#dc2626" width={2.5} />
        <GText x={6} y={3} dx={-6} dy={-8} size={13} color="#dc2626" anchor="end">y = 3</GText>
        <GLine x1={0} y1={6} x2={4.67} y2={-1} color="#059669" width={2.5} />
        <GText x={4.67} y={-1} dx={6} dy={-8} size={13} color="#059669">3x + 2y = 12</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={7} awayX={2} awayY={1} />
        <GShadeExcluded x1={-1} y1={0} x2={6} y2={0} awayX={2} awayY={1} />
        <GShadeExcluded x1={-1} y1={3} x2={6} y2={3} awayX={1} awayY={1} />
        <GShadeExcluded x1={0} y1={6} x2={4.67} y2={-1} awayX={1} awayY={1} />
        <GPoint x={0} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#f43f5e" weight="bold">(0, 0)</GText>
        <GPoint x={4} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={4} y={0} dx={-8} dy={-12} size={13} color="#f43f5e" weight="bold" anchor="end">(4, 0)</GText>
        <GPoint x={2} y={3} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={2} y={3} dx={8} dy={-10} size={13} color="#f43f5e" weight="bold">(2, 3)</GText>
        <GPoint x={0} y={3} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={3} dx={10} dy={-10} size={13} color="#f43f5e" weight="bold">(0, 3)</GText>
    </Graph>
);

const FigGI_Obj = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={3} x2={6} y2={3} color="#dc2626" width={2} />
        <GLine x1={0} y1={6} x2={4.67} y2={-1} color="#059669" width={2} />
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={7} awayX={2} awayY={1} />
        <GShadeExcluded x1={-1} y1={0} x2={6} y2={0} awayX={2} awayY={1} />
        <GShadeExcluded x1={-1} y1={3} x2={6} y2={3} awayX={1} awayY={1} />
        <GShadeExcluded x1={0} y1={6} x2={4.67} y2={-1} awayX={1} awayY={1} />
        <GLine x1={0} y1={6.67} x2={4} y2={0} color="#f59e0b" width={2.5} dashed />
        <GText x={0} y={6.67} dx={8} dy={4} size={13} color="#f59e0b" weight="bold">P = 20</GText>
        <GPoint x={4} y={0} r={6} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={4} y={0} dx={-8} dy={-12} size={13} color="#f43f5e" weight="bold" anchor="end">(4, 0): maximum</GText>
        <GPoint x={0} y={0} r={5} color="#6b7280" />
        <GPoint x={2} y={3} r={5} color="#6b7280" />
        <GPoint x={0} y={3} r={5} color="#6b7280" />
    </Graph>
);

const FigGI_Farm = () => (
    <Graph xRange={[0, 110]} yRange={[0, 110]}>
        <GLine x1={20} y1={0} x2={20} y2={110} color="#1e3a8a" width={2.5} />
        <GText x={20} y={0} dx={-6} dy={-8} size={12} color="#1e3a8a" anchor="end">x = 20</GText>
        <GLine x1={0} y1={100} x2={100} y2={0} color="#059669" width={2.5} />
        <GText x={50} y={50} dx={8} dy={-8} size={12} color="#059669">x + y = 100</GText>
        <GShadeExcluded x1={20} y1={0} x2={20} y2={110} awayX={50} awayY={10} />
        <GShadeExcluded x1={0} y1={100} x2={100} y2={0} awayX={30} awayY={10} />
        <GShadeExcluded x1={0} y1={0} x2={110} y2={0} awayX={50} awayY={10} />
        <GPoint x={20} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={20} y={0} dx={10} dy={-10} size={12} color="#f43f5e" weight="bold">(20, 0)</GText>
        <GPoint x={100} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={100} y={0} dx={-8} dy={-12} size={12} color="#f43f5e" weight="bold" anchor="end">(100, 0)</GText>
        <GPoint x={20} y={80} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={20} y={80} dx={10} dy={-8} size={12} color="#f43f5e" weight="bold">(20, 80)</GText>
        <GText x={40} y={20} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigTP_Two = () => (
    <Graph xRange={[-2, 6]} yRange={[-2, 10]}>
        <GLine x1={-1} y1={10} x2={5} y2={-2} color="#1e3a8a" width={2.5} />
        <GText x={5} y={-2} dx={-6} dy={-10} size={13} color="#1e3a8a" anchor="end">2x + y = 8</GText>
        <GShadeExcluded x1={-1} y1={10} x2={5} y2={-2} awayX={0} awayY={0} />
        <GPoint x={0} y={0} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={18} size={13} color="#16a34a" weight="bold">(0, 0) works</GText>
        <GText x={1.2} y={3} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigTP_Line = () => (
    <Graph xRange={[-3, 6]} yRange={[-4, 5]}>
        <GLine x1={-2} y1={-4} x2={6} y2={4} color="#1e3a8a" width={2.5} />
        <GText x={6} y={4} dx={-6} dy={20} size={13} color="#1e3a8a" anchor="end">y = x − 2</GText>
        <GShadeExcluded x1={-2} y1={-4} x2={6} y2={4} awayX={0} awayY={0} />
        <GPoint x={0} y={0} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#16a34a" weight="bold">(0, 0) works</GText>
        <GText x={-1.8} y={3} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigTP_Points = () => (
    <Graph xRange={[-3, 5]} yRange={[-2, 6]}>
        <GLine x1={-3} y1={-2} x2={4} y2={5} color="#1e3a8a" width={2.5} dashed />
        <GText x={4} y={5} dx={8} dy={4} size={13} color="#1e3a8a">y = x + 1</GText>
        <GShadeExcluded x1={-3} y1={-2} x2={4} y2={5} awayX={-1} awayY={4} />
        <GPoint x={0} y={0} r={5} color="#dc2626" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#dc2626" weight="bold">A (0, 0)</GText>
        <GPoint x={2} y={1} r={5} color="#dc2626" strokeColor="#0f172a" strokeW={1} />
        <GText x={2} y={1} dx={10} dy={-8} size={13} color="#dc2626" weight="bold">B (2, 1)</GText>
        <GPoint x={3} y={5} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={3} y={5} dx={-10} dy={-8} size={13} color="#16a34a" weight="bold" anchor="end">C (3, 5)</GText>
        <GPoint x={-1} y={4} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={-1} y={4} dx={10} dy={-8} size={13} color="#16a34a" weight="bold">D (−1, 4)</GText>
        <GText x={-2.8} y={5.4} color="#0f172a" size={14} weight="bold">Green = true, red = false</GText>
    </Graph>
);

const FigSI_Two = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={0} x2={5} y2={6} color="#1e3a8a" width={2.5} />
        <GText x={5} y={6} dx={8} dy={-2} size={13} color="#1e3a8a">y = x + 1</GText>
        <GLine x1={-1} y1={6} x2={6} y2={-1} color="#dc2626" width={2.5} />
        <GText x={6} y={-1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">y = 5 − x</GText>
        <GShadeExcluded x1={-1} y1={0} x2={5} y2={6} awayX={0} awayY={3} />
        <GShadeExcluded x1={-1} y1={6} x2={6} y2={-1} awayX={0} awayY={3} />
        <GText x={0.2} y={3.6} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigSI_Test = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={0} x2={5} y2={6} color="#1e3a8a" width={2.5} />
        <GText x={5} y={6} dx={8} dy={-2} size={13} color="#1e3a8a">y = x + 1</GText>
        <GLine x1={-1} y1={6} x2={6} y2={-1} color="#dc2626" width={2.5} />
        <GText x={6} y={-1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">y = 5 − x</GText>
        <GShadeExcluded x1={-1} y1={0} x2={5} y2={6} awayX={0} awayY={3} />
        <GShadeExcluded x1={-1} y1={6} x2={6} y2={-1} awayX={0} awayY={3} />
        <GPoint x={0} y={3} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={3} dx={10} dy={-8} size={13} color="#16a34a" weight="bold">(0, 3) works in both</GText>
        <GPoint x={2} y={3} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={2} y={3} dx={10} dy={18} size={13} color="#f43f5e" weight="bold">(2, 3)</GText>
    </Graph>
);

const FigSI_Mid = () => (
    <Graph xRange={[-2, 7]} yRange={[-1, 8]}>
        <GLine x1={-2} y1={0} x2={5} y2={7} color="#1e3a8a" width={2.5} dashed />
        <GText x={5} y={7} dx={8} dy={4} size={13} color="#1e3a8a">y = x + 2</GText>
        <GLine x1={-1} y1={7} x2={7} y2={-1} color="#dc2626" width={2.5} />
        <GText x={7} y={-1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">y = 6 − x</GText>
        <GShadeExcluded x1={-2} y1={0} x2={5} y2={7} awayX={0} awayY={4} />
        <GShadeExcluded x1={-1} y1={7} x2={7} y2={-1} awayX={0} awayY={4} />
        <GPoint x={2} y={4} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={2} y={4} dx={10} dy={18} size={13} color="#f43f5e" weight="bold">(2, 4)</GText>
        <GText x={-0.6} y={4.6} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigSI_Five = () => (
    <Graph xRange={[-1, 10]} yRange={[-1, 10]}>
        <GLine x1={0} y1={8} x2={8} y2={0} color="#059669" width={2.5} />
        <GText x={8} y={0} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 8</GText>
        <GLine x1={0} y1={0} x2={4.5} y2={9} color="#7c3aed" width={2.5} />
        <GText x={4.5} y={9} dx={8} dy={4} size={13} color="#7c3aed">y = 2x</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={10} awayX={4} awayY={2} />
        <GShadeExcluded x1={-1} y1={0} x2={10} y2={0} awayX={4} awayY={2} />
        <GShadeExcluded x1={0} y1={8} x2={8} y2={0} awayX={2} awayY={2} />
        <GShadeExcluded x1={0} y1={0} x2={4.5} y2={9} awayX={4} awayY={2} />
        <GPoint x={2.667} y={5.333} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={2.667} y={5.333} dx={-8} dy={-10} size={12} color="#f43f5e" weight="bold" anchor="end">(8/3, 16/3)</GText>
        <GPoint x={8} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={8} y={0} dx={0} dy={-12} size={12} color="#f43f5e" weight="bold" anchor="middle">(8, 0)</GText>
        <GText x={4.5} y={2} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigSI_Hard = () => (
    <Graph xRange={[-1, 11]} yRange={[-1, 11]}>
        <GLine x1={0} y1={10} x2={10} y2={0} color="#059669" width={2.5} />
        <GText x={10} y={0} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 10</GText>
        <GLine x1={0} y1={0} x2={5.5} y2={11} color="#7c3aed" width={2.5} />
        <GText x={5.5} y={11} dx={8} dy={4} size={13} color="#7c3aed">y = 2x</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={11} awayX={5} awayY={2} />
        <GShadeExcluded x1={-1} y1={0} x2={11} y2={0} awayX={5} awayY={2} />
        <GShadeExcluded x1={0} y1={10} x2={10} y2={0} awayX={2} awayY={2} />
        <GShadeExcluded x1={0} y1={0} x2={5.5} y2={11} awayX={5} awayY={2} />
        <GPoint x={3.333} y={6.667} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={3.333} y={6.667} dx={-8} dy={-10} size={12} color="#f43f5e" weight="bold" anchor="end">(10/3, 20/3)</GText>
        <GPoint x={10} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={10} y={0} dx={0} dy={-12} size={12} color="#f43f5e" weight="bold" anchor="middle">(10, 0)</GText>
        <GText x={5.2} y={2.5} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigFR_Lines = () => (
    <Graph xRange={[-1, 10]} yRange={[-1, 10]}>
        <GLine x1={0} y1={8} x2={8} y2={0} color="#059669" width={2.5} />
        <GText x={8} y={0} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 8</GText>
        <GLine x1={0} y1={0} x2={4.5} y2={9} color="#7c3aed" width={2.5} />
        <GText x={4.5} y={9} dx={8} dy={4} size={13} color="#7c3aed">y = 2x</GText>
        <GText x={0} y={9.5} dx={8} size={12} color="#6b7280">x = 0 is the y-axis</GText>
        <GText x={9.9} y={0} dx={-4} dy={-24} size={12} color="#6b7280" anchor="end">y = 0 is the x-axis</GText>
    </Graph>
);

const FigFR_Shade = () => (
    <Graph xRange={[-1, 10]} yRange={[-1, 10]}>
        <GLine x1={0} y1={8} x2={8} y2={0} color="#059669" width={2.5} />
        <GText x={8} y={0} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 8</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={10} awayX={3} awayY={2} />
        <GShadeExcluded x1={-1} y1={0} x2={10} y2={0} awayX={3} awayY={2} />
        <GShadeExcluded x1={0} y1={8} x2={8} y2={0} awayX={1} awayY={1} />
        <GText x={1} y={2} color="#0f172a" size={16} weight="bold">allowed</GText>
        <GText x={0.2} y={9.4} size={12} color="#6b7280">x ≥ 0: right of the y-axis</GText>
        <GText x={3.5} y={-0.7} size={12} color="#6b7280">y ≥ 0: above the x-axis</GText>
    </Graph>
);

const FigFR_Common = () => (
    <Graph xRange={[-1, 10]} yRange={[-1, 10]}>
        <GLine x1={0} y1={8} x2={8} y2={0} color="#059669" width={2.5} />
        <GText x={8} y={0} dx={-6} dy={-10} size={13} color="#059669" anchor="end">x + y = 8</GText>
        <GLine x1={0} y1={0} x2={4.5} y2={9} color="#7c3aed" width={2.5} />
        <GText x={4.5} y={9} dx={8} dy={4} size={13} color="#7c3aed">y = 2x</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={10} awayX={4} awayY={2} />
        <GShadeExcluded x1={-1} y1={0} x2={10} y2={0} awayX={4} awayY={2} />
        <GShadeExcluded x1={0} y1={8} x2={8} y2={0} awayX={2} awayY={2} />
        <GShadeExcluded x1={0} y1={0} x2={4.5} y2={9} awayX={4} awayY={2} />
        <GText x={4.2} y={2.2} color="#0f172a" size={18} weight="bold">Feasible region</GText>
    </Graph>
);

const FigFR_Verts = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 9]}>
        <GLine x1={-0.5} y1={9} x2={4.5} y2={-1} color="#059669" width={2.5} />
        <GText x={4.5} y={-1} dx={6} dy={-10} size={13} color="#059669">2x + y = 8</GText>
        <GLine x1={-1} y1={3.333} x2={6} y2={1} color="#dc2626" width={2.5} />
        <GText x={6} y={1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">x + 3y = 9</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={9} awayX={1} awayY={1} />
        <GShadeExcluded x1={-1} y1={0} x2={6} y2={0} awayX={1} awayY={1} />
        <GShadeExcluded x1={-0.5} y1={9} x2={4.5} y2={-1} awayX={1} awayY={1} />
        <GShadeExcluded x1={-1} y1={3.333} x2={6} y2={1} awayX={1} awayY={1} />
        <GPoint x={0} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#f43f5e" weight="bold">(0, 0)</GText>
        <GPoint x={4} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={4} y={0} dx={-8} dy={-12} size={13} color="#f43f5e" weight="bold" anchor="end">(4, 0)</GText>
        <GPoint x={3} y={2} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={3} y={2} dx={8} dy={-10} size={13} color="#f43f5e" weight="bold">(3, 2)</GText>
        <GPoint x={0} y={3} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={3} dx={10} dy={-10} size={13} color="#f43f5e" weight="bold">(0, 3)</GText>
        <GText x={1.2} y={1.2} color="#0f172a" size={18} weight="bold">R</GText>
    </Graph>
);

const FigFR_Venn = () => (
    <svg viewBox="0 0 360 270" className="mx-auto h-auto w-full max-w-md" role="img" aria-label="Four overlapping regions A, B, C and D with a shared centre">
        <circle cx="150" cy="95" r="70" fill="#1e3a8a" fillOpacity="0.22" stroke="#1e3a8a" strokeWidth="2" />
        <circle cx="210" cy="95" r="70" fill="#dc2626" fillOpacity="0.22" stroke="#dc2626" strokeWidth="2" />
        <circle cx="150" cy="155" r="70" fill="#059669" fillOpacity="0.22" stroke="#059669" strokeWidth="2" />
        <circle cx="210" cy="155" r="70" fill="#7c3aed" fillOpacity="0.22" stroke="#7c3aed" strokeWidth="2" />
        <text x="95" y="62" className="gc-ink" fontSize="22" fontWeight="700" fill="#1e3a8a">A</text>
        <text x="250" y="62" className="gc-ink" fontSize="22" fontWeight="700" fill="#dc2626">B</text>
        <text x="95" y="205" className="gc-ink" fontSize="22" fontWeight="700" fill="#059669">C</text>
        <text x="250" y="205" className="gc-ink" fontSize="22" fontWeight="700" fill="#7c3aed">D</text>
        <circle cx="180" cy="125" r="14" fill="#facc15" fillOpacity="0.9" stroke="#0f172a" strokeWidth="1.5" />
        <line x1="180" y1="139" x2="180" y2="236" stroke="#0f172a" strokeWidth="1.5" />
        <text x="180" y="256" textAnchor="middle" className="gc-ink" fontSize="17" fontWeight="700" fill="#0f172a">A ∩ B ∩ C ∩ D: the area shared by all four</text>
    </svg>
);

const FigFR_Flow = () => {
    const steps = ['Word problem', 'Create inequalities', 'Draw inequalities', 'Find feasible region', 'Find vertices', 'Test objective function at vertices', 'Maximum / minimum'];
    return (
        <div className="flex flex-col items-center py-2">
            {steps.map((t, i) => (
                <React.Fragment key={t}>
                    <div className={`gc-ink rounded-xl border px-4 py-2 text-center text-[17px] font-bold ${i === steps.length - 1 ? 'border-slate-300 bg-slate-50 text-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>{t}</div>
                    {i < steps.length - 1 && <div className="text-xl font-bold leading-none text-slate-700">↓</div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const FigVT_Poly = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 9]}>
        <GLine x1={-0.5} y1={9} x2={4.5} y2={-1} color="#059669" width={2.5} />
        <GText x={4.5} y={-1} dx={6} dy={-10} size={13} color="#059669">2x + y = 8</GText>
        <GLine x1={-1} y1={3.333} x2={6} y2={1} color="#dc2626" width={2.5} />
        <GText x={6} y={1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">x + 3y = 9</GText>
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={9} awayX={1} awayY={1} />
        <GShadeExcluded x1={-1} y1={0} x2={6} y2={0} awayX={1} awayY={1} />
        <GShadeExcluded x1={-0.5} y1={9} x2={4.5} y2={-1} awayX={1} awayY={1} />
        <GShadeExcluded x1={-1} y1={3.333} x2={6} y2={1} awayX={1} awayY={1} />
        <GPoint x={0} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#f43f5e" weight="bold">(0, 0)</GText>
        <GPoint x={4} y={0} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={4} y={0} dx={-8} dy={-12} size={13} color="#f43f5e" weight="bold" anchor="end">(4, 0)</GText>
        <GPoint x={3} y={2} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={3} y={2} dx={8} dy={-10} size={13} color="#f43f5e" weight="bold">(3, 2)</GText>
        <GPoint x={0} y={3} r={5} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={3} dx={10} dy={-10} size={13} color="#f43f5e" weight="bold">(0, 3)</GText>
        <GText x={1.2} y={1.2} color="#0f172a" size={18} weight="bold">R</GText>
    </Graph>
);

const FigVT_Two = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 7]}>
        <GLine x1={-1} y1={0} x2={5} y2={6} color="#1e3a8a" width={2.5} />
        <GText x={5} y={6} dx={8} dy={-2} size={13} color="#1e3a8a">y = x + 1</GText>
        <GLine x1={-1} y1={6} x2={6} y2={-1} color="#dc2626" width={2.5} />
        <GText x={6} y={-1} dx={-6} dy={-10} size={13} color="#dc2626" anchor="end">y = 5 − x</GText>
        <GPoint x={2} y={3} r={6} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={2} y={3} dx={10} dy={-10} size={14} color="#f43f5e" weight="bold">(2, 3)</GText>
    </Graph>
);

const FigVT_Elim = () => (
    <Graph xRange={[-1, 8]} yRange={[-1, 11]}>
        <GLine x1={-0.5} y1={11} x2={5.5} y2={-1} color="#7c3aed" width={2.5} />
        <GText x={5.5} y={-1} dx={8} dy={-10} size={13} color="#7c3aed">2x + y = 10</GText>
        <GLine x1={-1} y1={8} x2={8} y2={-1} color="#059669" width={2.5} />
        <GText x={8} y={-1} dx={-6} dy={-30} size={13} color="#059669" anchor="end">x + y = 7</GText>
        <GPoint x={3} y={4} r={6} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={3} y={4} dx={10} dy={-10} size={14} color="#f43f5e" weight="bold">(3, 4)</GText>
    </Graph>
);

const FigVT_Axes = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 9]}>
        <GLine x1={-0.5} y1={9} x2={4.5} y2={-1} color="#059669" width={2.5} />
        <GText x={4.5} y={-1} dx={6} dy={-10} size={13} color="#059669">2x + y = 8</GText>
        <GPoint x={4} y={0} r={6} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={4} y={0} dx={-8} dy={-12} size={14} color="#f43f5e" weight="bold" anchor="end">(4, 0)  y = 0</GText>
        <GPoint x={0} y={8} r={6} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={0} y={8} dx={10} dy={-10} size={14} color="#f43f5e" weight="bold">(0, 8)  x = 0</GText>
    </Graph>
);

const FigVT_Obj = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 9]}>
        <GLine x1={-0.5} y1={9} x2={4.5} y2={-1} color="#059669" width={2} />
        <GLine x1={-1} y1={3.333} x2={6} y2={1} color="#dc2626" width={2} />
        <GShadeExcluded x1={0} y1={-1} x2={0} y2={9} awayX={1} awayY={1} />
        <GShadeExcluded x1={-1} y1={0} x2={6} y2={0} awayX={1} awayY={1} />
        <GShadeExcluded x1={-0.5} y1={9} x2={4.5} y2={-1} awayX={1} awayY={1} />
        <GShadeExcluded x1={-1} y1={3.333} x2={6} y2={1} awayX={1} awayY={1} />
        <GPoint x={0} y={0} r={5} color="#6b7280" />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#374151" weight="bold">P = 0</GText>
        <GPoint x={4} y={0} r={5} color="#6b7280" />
        <GText x={4} y={0} dx={-8} dy={-12} size={13} color="#374151" weight="bold" anchor="end">P = 20</GText>
        <GPoint x={0} y={3} r={5} color="#6b7280" />
        <GText x={0} y={3} dx={10} dy={-10} size={13} color="#374151" weight="bold">P = 9</GText>
        <GPoint x={3} y={2} r={7} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={3} y={2} dx={10} dy={-10} size={14} color="#f43f5e" weight="bold">(3, 2): P = 21 maximum</GText>
    </Graph>
);

const FigOF_Max = () => (
    <Graph xRange={[-1, 6]} yRange={[-1, 8]}>
        <GLine x1={0} y1={0} x2={4} y2={0} color="#1e3a8a" width={2.5} />
        <GLine x1={4} y1={0} x2={3} y2={2} color="#1e3a8a" width={2.5} />
        <GLine x1={3} y1={2} x2={0} y2={3} color="#1e3a8a" width={2.5} />
        <GLine x1={0} y1={3} x2={0} y2={0} color="#1e3a8a" width={2.5} />
        <GLine x1={0} y1={7} x2={4.2} y2={0} color="#f59e0b" width={2.5} dashed />
        <GText x={0} y={7} dx={8} dy={4} size={13} color="#f59e0b" weight="bold">P = 21</GText>
        <GPoint x={0} y={0} r={5} color="#6b7280" />
        <GText x={0} y={0} dx={10} dy={-8} size={13} color="#374151" weight="bold">(0, 0): P = 0</GText>
        <GPoint x={4} y={0} r={5} color="#6b7280" />
        <GText x={4} y={0} dx={-8} dy={-12} size={13} color="#374151" weight="bold" anchor="end">(4, 0): P = 20</GText>
        <GPoint x={0} y={3} r={5} color="#6b7280" />
        <GText x={0} y={3} dx={10} dy={-10} size={13} color="#374151" weight="bold">(0, 3): P = 9</GText>
        <GPoint x={3} y={2} r={7} color="#f43f5e" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={3} y={2} dx={10} dy={-10} size={14} color="#f43f5e" weight="bold">(3, 2): P = 21 maximum</GText>
    </Graph>
);

const FigOF_Min = () => (
    <Graph xRange={[0, 7]} yRange={[0, 7]}>
        <GLine x1={1} y1={4} x2={3} y2={2} color="#1e3a8a" width={2.5} />
        <GLine x1={3} y1={2} x2={5} y2={1} color="#1e3a8a" width={2.5} />
        <GLine x1={5} y1={1} x2={2} y2={5} color="#1e3a8a" width={2.5} />
        <GLine x1={2} y1={5} x2={1} y2={4} color="#1e3a8a" width={2.5} />
        <GPoint x={1} y={4} r={5} color="#6b7280" />
        <GText x={1} y={4} dx={-10} dy={4} size={13} color="#374151" weight="bold" anchor="end">(1, 4): C = 32</GText>
        <GPoint x={5} y={1} r={5} color="#6b7280" />
        <GText x={5} y={1} dx={10} dy={4} size={13} color="#374151" weight="bold">(5, 1): C = 27</GText>
        <GPoint x={2} y={5} r={5} color="#6b7280" />
        <GText x={2} y={5} dx={10} dy={-10} size={13} color="#374151" weight="bold">(2, 5): C = 43</GText>
        <GPoint x={3} y={2} r={7} color="#16a34a" strokeColor="#0f172a" strokeW={1.5} />
        <GText x={3} y={2} dx={-10} dy={22} size={14} color="#16a34a" weight="bold" anchor="end">(3, 2): C = 26 minimum</GText>
    </Graph>
);

const FigOF_Word = () => (
    <div className="gc-ink flex flex-wrap items-center justify-center gap-3 py-2 text-[17px] font-bold">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-slate-900">x = tables<br /><span className="text-[14px] font-normal text-slate-600">$20 profit each</span></div>
        <div className="text-xl text-slate-700">+</div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-slate-900">y = chairs<br /><span className="text-[14px] font-normal text-slate-600">$8 profit each</span></div>
        <div className="text-xl text-slate-700">→</div>
        <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 text-center text-slate-800">P = 20x + 8y<br /><span className="text-[14px] font-normal">maximise</span></div>
    </div>
);

const FigOF_Compare = () => (
    <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-base font-bold uppercase tracking-wide text-slate-700">Constraints</div>
            <div className="gc-ink mt-1 text-[19px] font-bold leading-snug text-slate-900">2x + y ≤ 10<br />x + 2y ≤ 12<br />x ≥ 0,  y ≥ 0</div>
            <p className="mt-2 text-[15px] leading-snug text-slate-600">"What am I allowed to do?"</p>
        </div>
        <div className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3">
            <div className="text-base font-bold uppercase tracking-wide text-slate-700">Objective function</div>
            <div className="gc-ink mt-1 text-[19px] font-bold leading-snug text-slate-800">P = 5x + 4y</div>
            <p className="mt-2 text-[15px] leading-snug text-slate-600">"What am I trying to achieve?"</p>
        </div>
    </div>
);

const FigOF_Chain = () => {
    const steps = ['Word problem', 'Define x and y', 'Form inequalities (constraints)', 'Draw the inequalities', 'Find feasible region', 'Find vertices', 'Form objective function', 'Substitute every vertex', 'Find maximum / minimum', 'State the answer in context'];
    return (
        <div className="flex flex-col items-center py-2">
            {steps.map((t, i) => (
                <React.Fragment key={t}>
                    <div className={`gc-ink rounded-xl border px-4 py-2 text-center text-[17px] font-bold ${i === steps.length - 1 ? 'border-slate-300 bg-slate-50 text-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>{t}</div>
                    {i < steps.length - 1 && <div className="text-xl font-bold leading-none text-slate-700">↓</div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const FigWP_Flow = () => {
    const steps = ['Read the words', 'Define the variables', 'Translate the restrictions into inequalities'];
    return (
        <div className="flex flex-col items-center py-2">
            {steps.map((t, i) => (
                <React.Fragment key={t}>
                    <div className={`gc-ink rounded-xl border px-4 py-2 text-center text-[17px] font-bold ${i === steps.length - 1 ? 'border-slate-300 bg-slate-50 text-slate-800' : 'border-slate-200 bg-slate-50 text-slate-900'}`}>{t}</div>
                    {i < steps.length - 1 && <div className="text-xl font-bold leading-none text-slate-700">↓</div>}
                </React.Fragment>
            ))}
        </div>
    );
};

const FigWP_Define = () => (
    <div className="gc-ink flex flex-wrap items-center justify-center gap-3 py-2 text-[18px] font-bold">
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-slate-900">x = hectares of maize</div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-slate-900">y = hectares of beans</div>
    </div>
);

const FigWP_Farm = () => (
    <Graph xRange={[0, 22]} yRange={[0, 22]}>
        <GLine x1={6} y1={0} x2={6} y2={22} color="#1e3a8a" width={2.5} />
        <GText x={6} y={22} dx={8} dy={14} size={12} color="#1e3a8a">x = 6</GText>
        <GLine x1={0} y1={8} x2={22} y2={8} color="#dc2626" width={2.5} />
        <GText x={22} y={8} dx={-6} dy={-8} size={12} color="#dc2626" anchor="end">y = 8</GText>
        <GLine x1={0} y1={20} x2={20} y2={0} color="#059669" width={2.5} />
        <GText x={14} y={6} dx={8} dy={-4} size={12} color="#059669">x + y = 20</GText>
        <GShadeExcluded x1={6} y1={0} x2={6} y2={22} awayX={10} awayY={4} />
        <GShadeExcluded x1={0} y1={8} x2={22} y2={8} awayX={10} awayY={4} />
        <GShadeExcluded x1={0} y1={20} x2={20} y2={0} awayX={10} awayY={4} />
        <GShadeExcluded x1={0} y1={0} x2={22} y2={0} awayX={10} awayY={4} />
        <GPoint x={6} y={0} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GPoint x={20} y={0} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GPoint x={12} y={8} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GPoint x={6} y={8} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={10} y={4} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigWP_Factory = () => (
    <Graph xRange={[0, 12]} yRange={[0, 22]}>
        <GLine x1={0} y1={20} x2={10} y2={0} color="#059669" width={2.5} />
        <GText x={10} y={0} dx={-4} dy={-12} size={12} color="#059669" anchor="end">4x + 2y = 40</GText>
        <GShadeExcluded x1={0} y1={20} x2={10} y2={0} awayX={2} awayY={3} />
        <GShadeExcluded x1={0} y1={0} x2={0} y2={22} awayX={3} awayY={3} />
        <GShadeExcluded x1={0} y1={0} x2={12} y2={0} awayX={3} awayY={3} />
        <GPoint x={0} y={0} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GPoint x={10} y={0} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GPoint x={0} y={20} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={0} y={20} dx={10} dy={4} size={12} color="#f43f5e" weight="bold">(0, 20)</GText>
        <GText x={10} y={0} dx={0} dy={-22} size={12} color="#f43f5e" weight="bold" anchor="middle">(10, 0)</GText>
        <GText x={2.5} y={5} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigWP_Twice = () => (
    <Graph xRange={[0, 12]} yRange={[0, 8]}>
        <GLine x1={0} y1={0} x2={12} y2={6} color="#1e3a8a" width={2.5} />
        <GText x={12} y={6} dx={-6} dy={-10} size={13} color="#1e3a8a" anchor="end">x = 2y</GText>
        <GShadeExcluded x1={0} y1={0} x2={12} y2={6} awayX={8} awayY={1} />
        <GPoint x={10} y={1} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={10} y={1} dx={-8} dy={-10} size={12} color="#16a34a" weight="bold" anchor="end">(10, 1): 10 ≥ 2</GText>
        <GText x={7} y={0.4} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigWP_Three = () => (
    <Graph xRange={[0, 6]} yRange={[0, 14]}>
        <GLine x1={0} y1={0} x2={4.5} y2={13.5} color="#dc2626" width={2.5} />
        <GText x={4.5} y={13.5} dx={8} dy={4} size={13} color="#dc2626">y = 3x</GText>
        <GShadeExcluded x1={0} y1={0} x2={4.5} y2={13.5} awayX={4} awayY={2} />
        <GPoint x={3} y={2} r={5} color="#16a34a" strokeColor="#0f172a" strokeW={1} />
        <GText x={3} y={2} dx={10} dy={-8} size={12} color="#16a34a" weight="bold">(3, 2): 2 ≤ 9</GText>
        <GText x={4.6} y={4} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigWP_Quadrant = () => (
    <Graph xRange={[-3, 8]} yRange={[-3, 8]}>
        <GShadeExcluded x1={0} y1={-3} x2={0} y2={8} awayX={3} awayY={3} />
        <GShadeExcluded x1={-3} y1={0} x2={8} y2={0} awayX={3} awayY={3} />
        <GText x={2.5} y={4} color="#0f172a" size={18} weight="bold">First quadrant</GText>
        <GText x={-2.9} y={7.2} size={12} color="#6b7280">x ≥ 0 and y ≥ 0 keep the region here</GText>
    </Graph>
);

const FigWP_Bakery = () => (
    <Graph xRange={[0, 12]} yRange={[0, 32]}>
        <GLine x1={4} y1={0} x2={4} y2={32} color="#1e3a8a" width={2.5} />
        <GText x={4} y={32} dx={8} dy={14} size={12} color="#1e3a8a">x = 4</GText>
        <GLine x1={0} y1={6} x2={12} y2={6} color="#dc2626" width={2.5} />
        <GText x={12} y={6} dx={-6} dy={-8} size={12} color="#dc2626" anchor="end">y = 6</GText>
        <GLine x1={0} y1={30} x2={10} y2={0} color="#059669" width={2.5} />
        <GText x={6} y={12} dx={10} dy={-4} size={12} color="#059669">3x + y = 30</GText>
        <GShadeExcluded x1={4} y1={0} x2={4} y2={32} awayX={5} awayY={9} />
        <GShadeExcluded x1={0} y1={6} x2={12} y2={6} awayX={5} awayY={9} />
        <GShadeExcluded x1={0} y1={30} x2={10} y2={0} awayX={5} awayY={9} />
        <GPoint x={4} y={6} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={4} y={6} dx={-8} dy={18} size={12} color="#f43f5e" weight="bold" anchor="end">(4, 6)</GText>
        <GPoint x={8} y={6} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={8} y={6} dx={8} dy={18} size={12} color="#f43f5e" weight="bold">(8, 6)</GText>
        <GPoint x={4} y={18} r={4} color="#f43f5e" strokeColor="#0f172a" strokeW={1} />
        <GText x={4} y={18} dx={-8} dy={-8} size={12} color="#f43f5e" weight="bold" anchor="end">(4, 18)</GText>
        <GText x={4.8} y={9} color="#0f172a" size={20} weight="bold">R</GText>
    </Graph>
);

const FigWP_Set = () => (
    <div className="gc-ink mx-auto w-fit rounded-xl border border-slate-200 bg-slate-50 px-6 py-3 text-[20px] font-bold leading-relaxed text-slate-900">
        <div>3x + y ≤ 30</div>
        <div>x ≥ 4</div>
        <div>y ≥ 6</div>
        <div>x ≥ 0</div>
        <div>y ≥ 0</div>
    </div>
);

const FigWP_Skills = () => (
    <div className="grid gap-3 sm:grid-cols-3">
        {[
            ['A. Variables', 'Let x be... Let y be...'],
            ['B. Restrictions', 'at least, at most, maximum, minimum, no more than, no less than, available, limited, cannot exceed'],
            ['C. Expression', 'Write the mathematical expression for each restriction'],
        ].map(([h, b]) => (
            <div key={h} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-base font-bold uppercase tracking-wide text-slate-700">{h}</div>
                <p className="gc-ink mt-1 text-[16px] font-bold leading-snug text-slate-900">{b}</p>
            </div>
        ))}
    </div>
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
            <div className="my-4 flex items-start gap-3 rounded-r-lg border-l-4ac border-slate-300 bg-slate-50/60 py-3 pl-4 pr-3">
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
        <div className="mb-3 overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="flex items-start gap-3 px-4 pb-3 pt-3.5">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-neutral-300 text-xs font-semibold tabular-nums text-neutral-700">{index}</span>
                <div className="min-w-0 flex-1">
                    {example.tag && <div className="text-xs font-medium uppercase tracking-wider text-neutral-500">{example.tag}</div>}
                    <div className="mt-1 whitespace-pre-line text-[16px] font-bold leading-relaxed text-neutral-950">{example.question}</div>
                </div>
            </div>
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-t border-neutral-200 px-4 py-2 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900">
                <span>{open ? 'Hide solution' : 'Show solution'}</span>
                <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 8l5 5 5-5" /></svg>
            </button>
            {open && (
                <div className="border-t border-neutral-200 p-3 sm:p-4">
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4">
                        {example.steps.map((step, i) => (
                            <div key={i} className="flex gap-2 border-b border-neutral-200 py-2.5 text-[15px] leading-relaxed">
                                <span className="shrink-0 font-semibold text-neutral-500">Step {i + 1}:</span>
                                <span className="flex-1 text-neutral-800">{step}</span>
                            </div>
                        ))}
                        <div className="py-2.5 text-[15px] leading-relaxed">
                            <span className="mr-1 font-semibold text-neutral-500">Answer:</span>
                            <span className="font-bold text-neutral-950">{example.answer}</span>
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
    <div className="mb-6 w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {title && <div className="border-b border-slate-100 px-4 py-3 text-base font-extrabold text-slate-900">{title}</div>}
        <div className="mx-auto max-w-xl bg-slate-50 p-3">{children}</div>
        {caption && <p className="border-t border-slate-100 px-4 py-3 text-base leading-relaxed text-slate-600">{caption}</p>}
    </div>
);

/* =========================================================================
   LINEAR PROGRAMMING SECTION COMPONENT
   ========================================================================= */
/* =========================================================================
   PEN-WRITTEN STEP SOLVER + NUMBER LINES
   ========================================================================= */
const HandLine = ({ text, upTo, live }: { text: string; upTo: number; live: boolean }) => {
    const shown = text.slice(0, upTo).split('');
    return (
        <svg viewBox="0 0 760 44" className="block h-auto w-full max-w-[600px]" style={{ overflow: 'visible' }} role="img" aria-label={text}>
            <text x="2" y="32" className="gc-ink" fontSize="28" fontWeight="700" style={{ whiteSpace: 'pre' }}>
                {shown.map((ch, j) => {
                    const isNew = live && j === shown.length - 1;
                    return (
                        <tspan
                            key={j}
                            fill="#1e3a8a"
                            stroke="#1e3a8a"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            strokeWidth={0.4}
                            strokeDasharray={isNew ? 240 : undefined}
                            style={isNew ? { animation: 'liWrite 0.9s ease-in-out forwards' } : undefined}
                        >{ch === ' ' ? '\u00A0' : ch}</tspan>
                    );
                })}
            </text>
        </svg>
    );
};

const PenSolver = ({ title, problem, steps, answer }: any) => {
    const [step, setStep] = useState(0);
    const [chars, setChars] = useState(0);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const [speed, setSpeed] = useState(1);
    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = boxRef.current;
        if (!el || started) return undefined;
        if (typeof IntersectionObserver === 'undefined') { setStarted(true); return undefined; }
        const io = new IntersectionObserver((es) => {
            if (es[0].isIntersecting) { setStarted(true); io.disconnect(); }
        }, { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started || done) return undefined;
        const cur = steps[step];
        if (!cur) { setDone(true); return undefined; }
        if (chars < cur.text.length) {
            const t = setTimeout(() => setChars((c) => c + 1), 170 / speed);
            return () => clearTimeout(t);
        }
        const t = setTimeout(() => {
            if (step + 1 >= steps.length) setDone(true);
            else { setStep(step + 1); setChars(0); }
        }, 1100 / speed);
        return () => clearTimeout(t);
    }, [started, done, step, chars, speed, steps]);

    const replay = () => { setStep(0); setChars(0); setDone(false); setStarted(true); };
    const skip = () => { setStarted(true); setStep(steps.length - 1); setChars(steps[steps.length - 1].text.length); setDone(true); };

    return (
        <div ref={boxRef} className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <style>{`@keyframes liWrite { 0% { stroke-dashoffset: 240; stroke-width: 1.6; fill-opacity: 0; } 65% { stroke-dashoffset: 0; stroke-width: 1.6; fill-opacity: 0; } 100% { stroke-dashoffset: 0; stroke-width: 0.4; fill-opacity: 1; } }`}</style>
            <div className="border-b border-slate-100 px-7 py-4">
                <div className="text-base font-bold uppercase tracking-wide text-slate-700">{title}</div>
                <p className="gc-ink mt-1 break-words text-[20px] font-bold leading-snug text-slate-900">{problem}</p>
            </div>
            <div className="min-h-[90px] px-7 py-3">
                {!started && <p className="py-4 text-[16px] text-slate-400">The working will be written here…</p>}
                {started && steps.map((st: any, i: number) => {
                    const full = done || i < step;
                    const partial = !done && i === step;
                    if (!full && !partial) return null;
                    const text = full ? st.text : st.text.slice(0, chars);
                    const showWhy = full || chars >= st.text.length;
                    return (
                        <div key={i} className="flex gap-3 border-b border-dashed border-slate-200 py-3 last:border-0">
                            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{i + 1}</span>
                            <div className="min-w-0 flex-1">
                                <div className="min-h-[34px]"><HandLine text={st.text} upTo={full ? st.text.length : chars} live={partial} /></div>
                                {st.why && <p className="mt-1 text-[14px] leading-snug text-slate-500 transition-opacity duration-500" style={{ opacity: showWhy ? 1 : 0 }}>{st.why}</p>}
                            </div>
                        </div>
                    );
                })}
                {done && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3" style={{ animation: 'gcPopIn .4s ease-out' }}>
                        <span className="mr-2 text-base font-bold uppercase tracking-wide text-slate-700">Answer</span>
                        <span className="gc-ink text-[20px] font-bold text-slate-700">{answer}</span>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
                <button type="button" onClick={replay} className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 active:scale-95">Replay</button>
                <button type="button" onClick={skip} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">Show all</button>
                <label className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500">
                    Writing speed
                    <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-sm text-neutral-700 outline-none">
                        <option value={0.5}>0.5×</option>
                        <option value={1}>1×</option>
                        <option value={2}>2×</option>
                        <option value={3}>3×</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

const NumberLine = ({ min, max, a = null, aOpen = false, b = null, bOpen = false }: any) => {
    const W = 360, H = 86, pad = 26, y = 46;
    const sx = (v: number) => pad + ((v - min) / (max - min)) * (W - pad * 2);
    const x1 = a === null ? pad - 6 : sx(a);
    const x2 = b === null ? W - pad + 6 : sx(b);
    const ticks: number[] = [];
    for (let v = Math.ceil(min); v <= Math.floor(max); v++) ticks.push(v);
    const dot = (cx: number, open: boolean, delay: string) => (
        <circle cx={cx} cy={y} r="7" fill={open ? '#ffffff' : '#dc2626'} stroke="#dc2626" strokeWidth="2.5"
            style={{ animation: `gcPopIn .4s ease-out ${delay} both`, transformBox: 'fill-box', transformOrigin: 'center' }} />
    );
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[280px]">
            <line x1={pad - 14} y1={y} x2={W - pad + 14} y2={y} stroke="#1f2937" strokeWidth="2" />
            <polygon points={`${W - pad + 16},${y} ${W - pad + 8},${y - 5} ${W - pad + 8},${y + 5}`} fill="#1f2937" />
            <polygon points={`${pad - 16},${y} ${pad - 8},${y - 5} ${pad - 8},${y + 5}`} fill="#1f2937" />
            {ticks.map((v) => (
                <g key={v}>
                    <line x1={sx(v)} y1={y - 5} x2={sx(v)} y2={y + 5} stroke="#1f2937" strokeWidth="1.5" />
                    <text x={sx(v)} y={y + 24} textAnchor="middle" className="gc-ink" fontSize="15" fill="#4b5563">{v}</text>
                </g>
            ))}
            <path d={`M ${x1} ${y} L ${x2} ${y}`} pathLength={1} stroke="#dc2626" strokeWidth="5" strokeLinecap="round" fill="none"
                strokeDasharray="1" strokeDashoffset="1" style={{ animation: 'gcDrawLine 1s ease-out .3s forwards' }} />
            {a === null && <polygon points={`${x1 - 4},${y} ${x1 + 8},${y - 8} ${x1 + 8},${y + 8}`} fill="#dc2626" />}
            {b === null && <polygon points={`${x2 + 4},${y} ${x2 - 8},${y - 8} ${x2 - 8},${y + 8}`} fill="#dc2626" />}
            {a !== null && dot(sx(a), aOpen, '.1s')}
            {b !== null && dot(sx(b), bOpen, '.1s')}
        </svg>
    );
};

const REL = ['<', '>', '≤', '≥', '='];
const CHAR_MS = 260;

const parseToks = (str: string) => str.split(' ').map((q) => { const i = q.indexOf(':'); return { id: q.slice(0, i), t: q.slice(i + 1), st: 'n' } as any; });

const groupIndex = (toks: any[]) => {
    const m: any = {};
    let g = 0;
    toks.forEach((k) => { if (REL.includes(k.t)) g += 1; else m[k.id] = g; });
    return m;
};

const buildFrames = (baseStr: string, step: any, lead = 0) => {
    const frames: any[] = [];
    let cur: any[] = parseToks(baseStr);
    frames.push({ toks: cur, ms: 900 + lead });
    const hot = step.hot || [], add = step.add || [], cross = step.cross || [];
    if (hot.length) {
        cur = cur.map((k) => (hot.includes(k.id) ? { ...k, st: 'h' } : k));
        frames.push({ toks: cur, ms: 1300 });
    }
    if (add.length) {
        const nx = [...cur];
        let chars = 0;
        add.forEach((e: any[]) => {
            const idx = nx.findIndex((k) => k.id === e[0]);
            const isDiv = e[1].split(':')[1] === '÷';
            const ins = e.slice(1).map((sp: string) => {
                const tk = parseToks(sp)[0];
                if (!(isDiv && tk.t === '÷')) chars += tk.t.length;
                return { ...tk, st: 'a', fresh: true, den: true, div: isDiv };
            });
            nx.splice(idx + 1, 0, ...ins);
        });
        cur = nx;
        frames.push({ toks: cur, ms: 900 + chars * CHAR_MS });
    }
    if (cross.length) {
        cur = cur.map((k) => (cross.includes(k.id) ? { ...k, st: 'c' } : k));
        const gi = groupIndex(cur);
        const gs = new Set(cur.filter((k) => k.st === 'c').map((k) => gi[k.id]));
        frames.push({ toks: cur, ms: 800 + 650 * Math.max(1, gs.size) });
    }
    const next = parseToks(step.next);
    const keep = new Set(next.map((k) => k.id));
    const have = new Set(cur.map((k) => k.id));
    const fin: any[] = cur.map((k) => (keep.has(k.id) ? { ...k, st: 'n' } : { ...k, st: 'o' }));
    let prev: any = null;
    let wChars = 0;
    next.forEach((k) => {
        if (have.has(k.id)) { prev = k.id; return; }
        const idx = prev === null ? 0 : fin.findIndex((x) => x.id === prev) + 1;
        fin.splice(idx, 0, { ...k, st: 'w', fresh: true });
        wChars += k.t.length;
        prev = k.id;
    });
    frames.push({ toks: fin, ms: 1000 + wChars * CHAR_MS });
    frames.push({ toks: next, ms: 800 });
    return frames;
};

/* Turns "x/3" or "5/2" inside plain text into a stacked fraction */
const FracText = ({ text }: { text: string }) => {
    const out: any[] = [];
    const re = /(\d*x|\d+)\/(\d+)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let n = 0;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) out.push(<React.Fragment key={`t${n}`}>{text.slice(last, m.index)}</React.Fragment>);
        out.push(
            <span key={`f${n}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.05, margin: '0 3px' }}>
                <span style={{ padding: '0 3px' }}>{m[1]}</span>
                <span style={{ display: 'block', width: '100%', height: 2, background: 'currentColor', borderRadius: 2 }} />
                <span style={{ padding: '0 3px' }}>{m[2]}</span>
            </span>
        );
        last = m.index + m[0].length;
        n += 1;
    }
    if (last < text.length) out.push(<React.Fragment key="tend">{text.slice(last)}</React.Fragment>);
    return <>{out}</>;
};

const AlgTok = ({ t, st, fresh, delay, speed, cdelay }: any) => {
    const [d0] = useState(delay || 0);
    const open = st !== 'o';
    const red = st === 'h' || st === 'a' || st === 'c' || st === 'w';
    const dur = 0.6 / speed;
    return (
        <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', maxWidth: open ? t.length * 18 + 24 : 0, opacity: open ? 1 : 0, paddingTop: 16, marginTop: -16, paddingBottom: 4, marginBottom: -4, transition: 'max-width .7s ease, opacity .5s ease' }}>
            <span style={{ display: 'inline-block', position: 'relative', padding: '0 6px', whiteSpace: 'pre', color: red ? '#dc2626' : '#1e3a8a', transform: 'none', transition: 'color .4s ease' }}>
                {fresh ? (
                    <>
                        <span style={{ visibility: 'hidden' }}>{t}</span>
                        <svg aria-hidden="true" style={{ position: 'absolute', left: 6, top: 0, width: 'calc(100% - 12px)', height: '100%', overflow: 'visible' }}>
                            <text x="0" y="50%" dominantBaseline="central" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={120} style={{ whiteSpace: 'pre' }}>
                                {t.split('').map((ch: string, i: number) => (
                                    <tspan key={i} style={{ animation: `liTrace ${dur}s ease-in-out ${d0 + (i * CHAR_MS) / 1000 / speed}s both` }}>{ch}</tspan>
                                ))}
                            </text>
                        </svg>
                    </>
                ) : t}
                {st === 'c' && <span className="li-slash" style={{ animationDelay: `${cdelay || 0}s` }} />}
            </span>
        </span>
    );
};

const AlgRow = ({ toks, cap, speed = 1, writeAll = false }: any) => {
    const groups: any[] = [{ num: [], den: [] }];
    const rels: any[] = [];
    for (let i = 0; i < toks.length; i++) {
        const k = toks[i];
        if (REL.includes(k.t)) { rels.push(k); groups.push({ num: [], den: [] }); continue; }
        if (k.den) { groups[groups.length - 1].den.push(k); continue; }
        const s = toks[i + 1], b = toks[i + 2];
        if (s && s.t === '/' && !s.den && b && !b.den) {
            groups[groups.length - 1].num.push({ frac: true, top: k, bar: s, bot: b });
            i += 2;
            continue;
        }
        groups[groups.length - 1].num.push(k);
    }
    const flat = (g: any) => [...g.num.flatMap((it: any) => (it.frac ? [it.top, it.bar, it.bot] : [it])), ...g.den];
    const crossOrder: number[] = [];
    groups.forEach((g, gi) => { if (flat(g).some((k: any) => k.st === 'c')) crossOrder.push(gi); });
    const hasFrac = groups.some((g) => g.num.some((it: any) => it.frac && it.bar.st !== 'o') || g.den.some((k: any) => k.div && k.st !== 'o'));
    let wc = 0;
    const tok = (k: any, gi: number) => {
        const isFresh = writeAll || !!k.fresh;
        const counts = writeAll || k.st === 'a' || k.st === 'w';
        const delay = isFresh ? ((wc * CHAR_MS) / 1000 + (k.div ? 0.3 : 0)) / speed : 0;
        if (counts) wc += k.t.length;
        const order = Math.max(0, crossOrder.indexOf(gi));
        return <AlgTok key={k.id} t={k.t} st={k.st} fresh={isFresh} delay={delay} speed={speed} cdelay={(order * 0.65) / speed} />;
    };
    const renderNum = (it: any, gi: number) => {
        if (!it.frac) return tok(it, gi);
        const { top, bar, bot } = it;
        if (bar.st === 'o') return tok(top, gi);
        const t1 = tok(top, gi);
        const barFresh = writeAll || !!bar.fresh;
        const barDelay = barFresh ? ((wc * CHAR_MS) / 1000) / speed : 0;
        const t2 = tok(bot, gi);
        const barRed = bar.st === 'h' || bar.st === 'a' || bar.st === 'c' || bar.st === 'w';
        return (
            <span key={`f${top.id}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                {t1}
                <span style={{ display: 'block', width: '100%', height: 2, background: barRed ? '#dc2626' : '#1e3a8a', borderRadius: 2, transformOrigin: 'left center', animation: barFresh ? `liBar ${0.3 / speed}s ease-out ${barDelay}s both` : undefined }} />
                {t2}
            </span>
        );
    };
    const out: any[] = [];
    groups.forEach((g: any, gi: number) => {
        const isDivGroup = g.den.some((k: any) => k.div);
        const showBar = g.den.some((k: any) => k.div && k.st !== 'o');
        const groupHasFrac = g.num.some((it: any) => it.frac && it.bar.st !== 'o');
        out.push(
            <span key={`g${gi}`} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: isDivGroup ? 'center' : 'flex-end' }}>
                <span style={{ display: 'inline-flex', alignItems: groupHasFrac ? 'center' : 'flex-end' }}>{g.num.map((it: any) => renderNum(it, gi))}</span>
                {g.den.length > 0 && (
                    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: isDivGroup ? 'center' : 'flex-end', width: isDivGroup ? '100%' : 'auto' }}>
                        {showBar && <span style={{ display: 'block', width: '100%', height: 2, background: '#1e3a8a', borderRadius: 2, transformOrigin: 'left center', animation: `liBar ${0.3 / speed}s ease-out both` }} />}
                        <span style={{ display: 'inline-flex' }}>{g.den.filter((k: any) => !(k.div && k.t === '÷')).map((k: any) => tok(k, gi))}</span>
                    </span>
                )}
            </span>
        );
        if (rels[gi]) out.push(tok(rels[gi], gi));
    });
    return (
        <div className="border-b border-dashed border-slate-200 py-2 last:border-0">
            <div className="gc-ink flex flex-wrap text-[22px] font-bold leading-none" style={{ minHeight: 40, alignItems: hasFrac ? 'center' : 'flex-start' }}>{out}</div>
            {cap && <p className="mt-1 text-[14px] leading-snug text-slate-500">{cap}</p>}
        </div>
    );
};

const AlgSolver = ({ title, problem, base, steps, answer }: any) => {
    const framesAll = useMemo(() => {
        const baseChars = base.split(' ').reduce((n: number, q: string) => n + q.slice(q.indexOf(':') + 1).length, 0);
        return steps.map((sp: any, i: number) => buildFrames(i === 0 ? base : steps[i - 1].next, sp, i === 0 ? baseChars * CHAR_MS : 0));
    }, [base, steps]);
    const [si, setSi] = useState(0);
    const [fi, setFi] = useState(0);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [run, setRun] = useState(0);
    const boxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = boxRef.current;
        if (!el || started) return undefined;
        if (typeof IntersectionObserver === 'undefined') { setStarted(true); return undefined; }
        const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.35 });
        io.observe(el);
        return () => io.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started || done) return undefined;
        const frames = framesAll[si];
        const t = setTimeout(() => {
            if (fi + 1 < frames.length) setFi(fi + 1);
            else if (si + 1 < steps.length) { setSi(si + 1); setFi(0); }
            else setDone(true);
        }, frames[fi].ms / speed);
        return () => clearTimeout(t);
    }, [started, done, si, fi, speed, framesAll, steps.length]);

    const replay = () => { setRun((r) => r + 1); setSi(0); setFi(0); setDone(false); setStarted(true); };
    const skip = () => { setStarted(true); setSi(steps.length - 1); setFi(framesAll[steps.length - 1].length - 1); setDone(true); };

    return (
        <div ref={boxRef} className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <style>{`
                .li-slash { position: absolute; left: -12%; top: 52%; width: 124%; height: 3px; background: #dc2626; border-radius: 2px; transform-origin: left center; transform: rotate(-38deg) scaleX(0); animation: liSlash .45s ease-out forwards; }
                @keyframes liSlash { to { transform: rotate(-38deg) scaleX(1); } }
                @keyframes liTrace { 0% { stroke-dashoffset: 120; stroke-width: 1.5; fill-opacity: 0; } 70% { stroke-dashoffset: 0; stroke-width: 1.5; fill-opacity: 0; } 100% { stroke-dashoffset: 0; stroke-width: 0.3; fill-opacity: 1; } }
                @keyframes liBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
            `}</style>
            <div className="border-b border-slate-100 px-7 py-4">
                <div className="text-base font-bold uppercase tracking-wide text-slate-700">{title}</div>
                <p className="gc-ink mt-1 break-words text-[20px] font-bold leading-snug text-slate-900"><FracText text={problem} /></p>
            </div>
            <div key={run} className="min-h-[90px] px-7 py-3">
                {!started && <p className="py-4 text-[14px] text-slate-400">The working will be written here…</p>}
                {started && <AlgRow toks={parseToks(base)} writeAll speed={speed} cap="" />}
                {started && steps.map((sp: any, k: number) => {
                    if (k > si && !done) return null;
                    if (k === 0 && si === 0 && fi === 0 && !done) return null;
                    const frames = framesAll[k];
                    const frame = (k < si || done) ? frames[frames.length - 1] : frames[fi];
                    return <AlgRow key={k} toks={frame.toks} speed={speed} cap={sp.cap} />;
                })}
                {done && (
                    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3" style={{ animation: 'gcPopIn .4s ease-out' }}>
                        <span className="mr-2 text-base font-bold uppercase tracking-wide text-slate-700">Answer</span>
                        <span className="gc-ink text-[20px] font-bold text-slate-700">{answer}</span>
                    </div>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2">
                <button type="button" onClick={replay} className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 active:scale-95">Replay</button>
                <button type="button" onClick={skip} className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50">Show all</button>
                <label className="ml-auto flex items-center gap-1.5 text-xs text-neutral-500">
                    Speed
                    <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-md border border-neutral-200 bg-white px-1.5 py-1 text-sm text-neutral-700 outline-none">
                        <option value={0.5}>0.5×</option>
                        <option value={1}>1×</option>
                        <option value={2}>2×</option>
                        <option value={3}>3×</option>
                    </select>
                </label>
            </div>
        </div>
    );
};

const al = (title: string, problem: string, base: string, steps: any[], answer: string) => ({ type: 'alg', title, problem, base, steps, answer });

const sv = (title: string, problem: string, steps: any[], answer: string) => ({ type: 'solver', title, problem, steps, answer });
const st = (text: string, why?: string) => ({ text, why });

const Section = ({ section }) => {
    const { id, heading, intro, content, graphs, examples, practice, definition } = section;
    const label = 'text-base font-bold uppercase tracking-wide text-slate-700';
    const body = 'mb-5 break-words text-[19px] leading-[1.8] text-slate-700';

    return (
        <section id={id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
            <div className="mb-4">
                <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-4xl">{heading}</h2>
            </div>

            <div className="mb-6">
                {typeof intro === 'string' ? <p className={body}>{intro}</p> : intro}

                {definition && <DefinitionBox>{definition}</DefinitionBox>}

                {content && content.map((item, i) => {
                    if (item.type === 'table') {
                        return (
                            <div key={i} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <table className="w-full text-left text-[17px]">
                                    <thead className="bg-slate-50 text-slate-700">
                                        <tr>{item.headers.map((h, j) => <th key={j} scope="col" className="px-5 py-3 text-base font-bold uppercase tracking-wide">{h}</th>)}</tr>
                                    </thead>
                                    <tbody>{item.rows.map((row, j) => (
                                        <tr key={j} className="border-t border-slate-200">
                                            {row.map((cell, k) => <td key={k} className="px-5 py-3 font-semibold text-slate-800">{cell}</td>)}
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        );
                    }
                    if (item.type === 'list') {
                        return (
                            <div key={i} className="mb-6 rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
                                <div className={label}>Steps</div>
                                <ol className="mt-2 list-decimal space-y-2 pl-6 text-[19px] leading-[1.8] text-slate-700">
                                    {item.items.map((t, j) => <li key={j}>{t}</li>)}
                                </ol>
                            </div>
                        );
                    }
                    if (item.type === 'paragraph') return <p key={i} className={body}>{item.text}</p>;
                    if (item.type === 'sub') return <h3 key={i} className="mb-3 mt-10 text-xl font-extrabold uppercase leading-tight tracking-tight text-slate-900 sm:text-2xl">{item.text}</h3>;
                    if (item.type === 'alg') return <AlgSolver key={i} title={item.title} problem={item.problem} base={item.base} steps={item.steps} answer={item.answer} />;
                    if (item.type === 'solver') return <PenSolver key={i} title={item.title} problem={item.problem} steps={item.steps} answer={item.answer} />;
                    if (item.type === 'numberlines') {
                        return (
                            <div key={i} className="mb-6 grid gap-3 sm:grid-cols-2">
                                {item.lines.map((ln: any, j: number) => (
                                    <div key={j} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                        <div className="gc-ink mb-1 text-[18px] font-bold text-slate-900">{ln.label}</div>
                                        <NumberLine min={ln.min} max={ln.max} a={ln.a ?? null} aOpen={ln.aOpen} b={ln.b ?? null} bOpen={ln.bOpen} />
                                        {ln.note && <p className="mt-1 text-[14px] leading-snug text-slate-600">{ln.note}</p>}
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    if (item.type === 'graph') {
                        const GraphComp = item.component;
                        return <GraphDisplay key={i} title={item.title} caption={item.caption}><GraphComp /></GraphDisplay>;
                    }
                    if (item.type === 'note') {
                        return (
                            <div key={i} className="my-6 rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
                                <div className="text-base font-bold uppercase tracking-wide text-slate-700">Remember</div>
                                <p className="mt-2 text-[19px] leading-[1.8] text-slate-900">{item.text}</p>
                            </div>
                        );
                    }
                    if (item.type === 'example') {
                        return (
                            <div key={i} className="my-6 rounded-2xl border border-slate-200 bg-slate-50 px-7 py-6">
                                <div className={label}>Look at this</div>
                                <p className="mt-2 break-words text-[22px] font-bold leading-snug text-slate-900 sm:text-[26px]">{item.text}</p>
                            </div>
                        );
                    }
                    if (item.type === 'worked') {
                        return (
                            <div key={i} className="my-6 rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm">
                                <div className={label}>Worked Example</div>
                                <p className="mt-1 text-2xl font-extrabold text-slate-900">{item.text}</p>
                                {item.working && <p className="mt-2 text-[19px] leading-[1.8] text-slate-600">{item.working}</p>}
                                {item.answer && <p className="mt-2 text-[19px] font-extrabold leading-snug text-slate-700">{item.answer}</p>}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {graphs && graphs.map((g, i) => {
                const GraphComp = g.component;
                return <GraphDisplay key={i} title={g.title} caption={g.caption}><GraphComp /></GraphDisplay>;
            })}

            {examples && examples.length > 0 && (
                <div className="mb-8">
                    <h3 className="mb-3 text-base font-bold uppercase tracking-widest text-slate-400">Worked Examples</h3>
                    {examples.map((ex, i) => <ExampleCard key={i} index={i + 1} example={ex} />)}
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
    const [active, setActive] = useState('linear-inequalities');
    const [lang, setLang] = useState('en');

    const sections = [
        {
            id: 'linear-inequalities',
            eyebrow: 'O Level Mathematics · Topic 1',
            title: 'Linear Inequalities',
            heading: 'Linear inequalities',
            intro: "An inequality is like an equation, but the answer is a range of values, not one number. Learn these 10 skills in order. Each worked example is written out step by step.",
            content: [
                { type: 'sub', text: 'The inequality signs' },
                { type: 'table', headers: ['Sign', 'Meaning'], rows: [['<', 'less than'], ['>', 'greater than'], ['≤', 'less than or equal to'], ['≥', 'greater than or equal to']] },
                { type: 'example', text: 'x > 5 means all values bigger than 5, but not 5 itself.   x ≥ 5 includes 5.' },

                { type: 'sub', text: 'Solving simple inequalities' },
                { type: 'paragraph', text: "Solve it like an equation. Do the same thing to both sides." },
                al('Worked Example', 'Solve x + 4 > 9', 'x:x p:+ a:4 g:> b:9', [
    { cap: 'Take 4 away from both sides.', hot: ['p', 'a'], add: [['a', 'm1:−', 'm2:4'], ['b', 'm3:−', 'm4:4']], cross: ['p', 'a', 'm1', 'm2'], next: 'x:x g:> r:5' },
], 'x > 5'),
                al('Worked Example', 'Solve 3x ≤ 18', 'c:3 x:x g:≤ b:18', [
    { cap: 'Divide both sides by 3. It is positive, so the sign stays the same.', hot: ['c'], add: [['x', 'd1:÷', 'd2:3'], ['b', 'd3:÷', 'd4:3']], cross: ['c', 'd1', 'd2'], next: 'x:x g:≤ r:6' },
], 'x ≤ 6'),

                { type: 'sub', text: 'Negative numbers' },
                { type: 'note', text: 'When you multiply or divide both sides by a NEGATIVE number, reverse the inequality sign. > becomes <, and ≤ becomes ≥.' },
                al('Worked Example', 'Solve −2x > 10', 'n:− c:2 x:x g:> b:10', [
    { cap: 'Divide both sides by −2.', hot: ['n', 'c'], add: [['x', 'd1:÷', 'd2:(−2)'], ['b', 'd3:÷', 'd4:(−2)']], cross: ['n', 'c', 'd1', 'd2'], next: 'x:x g:> r:−5' },
    { cap: 'We divided by a negative number, so flip the sign: > becomes <.', hot: ['g'], next: 'x:x h:< r:−5' },
], 'x < −5'),

                { type: 'sub', text: 'x on both sides' },
                { type: 'paragraph', text: "Collect the x terms on one side and the numbers on the other." },
                al('Worked Example', 'Solve 3x + 2 > x + 8', 'c:3 x:x p:+ a:2 g:> y:x q:+ b:8', [
    { cap: 'Take x away from both sides.', hot: ['y'], add: [['a', 'm1:−', 'm2:x'], ['b', 'm3:−', 'm4:x']], cross: ['y', 'm3', 'm4'], next: 'c1:2 x:x p:+ a:2 g:> b:8' },
    { cap: 'Take 2 away from both sides.', hot: ['p', 'a'], add: [['a', 'e1:−', 'e2:2'], ['b', 'e3:−', 'e4:2']], cross: ['p', 'a', 'e1', 'e2'], next: 'c1:2 x:x g:> r:6' },
    { cap: 'Divide both sides by 2.', hot: ['c1'], add: [['x', 'f1:÷', 'f2:2'], ['r', 'f3:÷', 'f4:2']], cross: ['c1', 'f1', 'f2'], next: 'x:x g:> s:3' },
], 'x > 3'),

                { type: 'sub', text: 'Brackets' },
                { type: 'paragraph', text: "Expand the brackets first. Then solve." },
                al('Worked Example', 'Solve 2(x + 3) ≤ 14', 'c:2 l:( x:x p:+ t:3 r:) g:≤ b:14', [
    { cap: 'Multiply everything inside the bracket by 2: 2 × 3 = 6.', hot: ['c', 't'], next: 'c:2 x:x p:+ u:6 g:≤ b:14' },
    { cap: 'Take 6 away from both sides.', hot: ['p', 'u'], add: [['u', 'm1:−', 'm2:6'], ['b', 'm3:−', 'm4:6']], cross: ['p', 'u', 'm1', 'm2'], next: 'c:2 x:x g:≤ r:8' },
    { cap: 'Divide both sides by 2.', hot: ['c'], add: [['x', 'd1:÷', 'd2:2'], ['r', 'd3:÷', 'd4:2']], cross: ['c', 'd1', 'd2'], next: 'x:x g:≤ s:4' },
], 'x ≤ 4'),
                al('Negative bracket', 'Solve −3(x − 2) > 12', 'n:− c:3 l:( x:x m:− t:2 r:) g:> b:12', [
    { cap: 'Multiply the bracket by −3. Minus times minus is plus: −3 × −2 = +6.', hot: ['n', 'c', 't'], next: 'n:− c:3 x:x p:+ u:6 g:> b:12' },
    { cap: 'Take 6 away from both sides.', hot: ['p', 'u'], add: [['u', 'm1:−', 'm2:6'], ['b', 'm3:−', 'm4:6']], cross: ['p', 'u', 'm1', 'm2'], next: 'n:− c:3 x:x g:> r:6' },
    { cap: 'Divide both sides by −3.', hot: ['n', 'c'], add: [['x', 'd1:÷', 'd2:(−3)'], ['r', 'd3:÷', 'd4:(−3)']], cross: ['n', 'c', 'd1', 'd2'], next: 'x:x g:> s:−2' },
    { cap: 'We divided by a negative number, so flip the sign.', hot: ['g'], next: 'x:x h:< s:−2' },
], 'x < −2'),

                { type: 'sub', text: 'Double inequalities' },
                { type: 'paragraph', text: "Whatever you do, do it to ALL THREE parts." },
                al('Worked Example', 'Solve 2 < x + 3 ≤ 7', 'a:2 g:< x:x p:+ t:3 h:≤ b:7', [
    { cap: 'Take 3 away from all three parts.', hot: ['p', 't'], add: [['a', 'k1:−', 'k2:3'], ['t', 'm1:−', 'm2:3'], ['b', 'm3:−', 'm4:3']], cross: ['p', 't', 'm1', 'm2'], next: 'r1:−1 g:< x:x h:≤ r2:4' },
], '−1 < x ≤ 4'),
                al('Worked Example', 'Solve −5 ≤ 2x + 1 < 9', 'a:−5 g:≤ c:2 x:x p:+ t:1 h:< b:9', [
    { cap: 'Take 1 away from all three parts.', hot: ['p', 't'], add: [['a', 'k1:−', 'k2:1'], ['t', 'm1:−', 'm2:1'], ['b', 'm3:−', 'm4:1']], cross: ['p', 't', 'm1', 'm2'], next: 'r1:−6 g:≤ c:2 x:x h:< r2:8' },
    { cap: 'Divide all three parts by 2.', hot: ['c'], add: [['r1', 'd1:÷', 'd2:2'], ['x', 'd3:÷', 'd4:2'], ['r2', 'd5:÷', 'd6:2']], cross: ['c', 'd3', 'd4'], next: 's1:−3 g:≤ x:x h:< s2:4' },
], '−3 ≤ x < 4'),

                { type: 'sub', text: 'Number lines' },
                { type: 'paragraph', text: "An open circle means the number is NOT included. A closed circle means it IS included. The arrow shows which way the answers go." },
                { type: 'table', headers: ['Inequality', 'Circle at the boundary', 'Direction'], rows: [['x > 3', 'Open', 'Right'], ['x ≥ 3', 'Closed', 'Right'], ['x < 3', 'Open', 'Left'], ['x ≤ 3', 'Closed', 'Left']] },
                { type: 'numberlines', lines: [
                    { label: 'x > 3', min: 0, max: 6, a: 3, aOpen: true },
                    { label: 'x ≥ 3', min: 0, max: 6, a: 3, aOpen: false },
                    { label: 'x < 3', min: 0, max: 6, b: 3, bOpen: true },
                    { label: 'x ≤ 3', min: 0, max: 6, b: 3, bOpen: false },
                ] },
                { type: 'numberlines', lines: [
                    { label: '−1 < x ≤ 4', min: -3, max: 6, a: -1, aOpen: true, b: 4, bOpen: false, note: 'Open at −1, closed at 4, shaded in between.' },
                ] },

                { type: 'sub', text: 'Reading a number line' },
                { type: 'paragraph', text: "In the exam they can show you the number line and ask you to write the inequality. Look at two things: is each circle open or closed, and which way does the shading go?" },
                { type: 'numberlines', lines: [
                    { label: 'x ≤ −2', min: -5, max: 3, b: -2, bOpen: false, note: 'Closed circle at −2, arrow to the left. So x ≤ −2.' },
                    { label: '−2 ≤ x < 3', min: -4, max: 5, a: -2, aOpen: false, b: 3, bOpen: true, note: 'Closed at −2, open at 3, shaded between. So −2 ≤ x < 3.' },
                ] },

                { type: 'sub', text: 'Fractions' },
                { type: 'paragraph', text: "Get the fraction on its own. Then multiply to remove the bottom number." },
                al('Worked Example', 'Solve x/3 + 2 ≥ 5', 'x:x s:/ t:3 p:+ a:2 g:≥ b:5', [
    { cap: 'Take 2 away from both sides.', hot: ['p', 'a'], add: [['a', 'm1:−', 'm2:2'], ['b', 'm3:−', 'm4:2']], cross: ['p', 'a', 'm1', 'm2'], next: 'x:x s:/ t:3 g:≥ r:3' },
    { cap: 'Multiply both sides by 3.', hot: ['s', 't'], add: [['t', 'd1:×', 'd2:3'], ['r', 'd3:×', 'd4:3']], cross: ['s', 't', 'd1', 'd2'], next: 'x:x g:≥ q:9' },
], 'x ≥ 9'),
                al('Negative coefficient', 'Solve −x/2 > 3', 'n:− x:x s:/ t:2 g:> b:3', [
    { cap: 'Multiply both sides by 2. It is positive, so the sign stays.', hot: ['s', 't'], add: [['t', 'd1:×', 'd2:2'], ['b', 'd3:×', 'd4:2']], cross: ['s', 't', 'd1', 'd2'], next: 'n:− x:x g:> r:6' },
    { cap: 'Multiply both sides by −1 to make x positive.', hot: ['n'], add: [['x', 'e1:×', 'e2:(−1)'], ['r', 'e3:×', 'e4:(−1)']], cross: ['n', 'e1', 'e2'], next: 'x:x g:> s:−6' },
    { cap: 'We multiplied by a negative number, so flip the sign.', hot: ['g'], next: 'x:x h:< s:−6' },
], 'x < −6'),

                { type: 'sub', text: 'Word problems' },
                { type: 'paragraph', text: "Change the words into a sign. These are the phrases to know." },
                { type: 'table', headers: ['Words', 'Sign'], rows: [['greater than', '>'], ['less than', '<'], ['at least', '≥'], ['at most', '≤'], ['no more than', '≤'], ['no less than', '≥'], ['exceeds', '>'], ['does not exceed / cannot exceed', '≤']] },
                al('Worked Example', 'The number of students x cannot exceed 40.', 'a:x b:cannot c:exceed d:40', [
    { cap: 'Cannot exceed means 40 is allowed, but nothing more. So we write ≤.', hot: ['b', 'c'], cross: ['b', 'c'], next: 'a:x e:≤ d:40' },
], 'x ≤ 40'),
                al('Worked Example', 'Three times a number, plus 4, is at most 19. Find the numbers.', 'c:3 x:x p:+ a:4 g:≤ b:19', [
    { cap: 'At most means ≤. Now take 4 away from both sides.', hot: ['p', 'a'], add: [['a', 'm1:−', 'm2:4'], ['b', 'm3:−', 'm4:4']], cross: ['p', 'a', 'm1', 'm2'], next: 'c:3 x:x g:≤ r:15' },
    { cap: 'Divide both sides by 3.', hot: ['c'], add: [['x', 'd1:÷', 'd2:3'], ['r', 'd3:÷', 'd4:3']], cross: ['c', 'd1', 'd2'], next: 'x:x g:≤ s:5' },
], 'x ≤ 5'),

                { type: 'note', text: 'Study in this order: Solving → Number lines → Double inequalities → Word problems. Then move on to inequalities with two variables, graphs and feasible regions. Two skills to make automatic: reverse the sign when you multiply or divide by a negative, and do every step to all three parts of a double inequality.' },
            ],
},
        {
            id: 'graphing-inequalities',
            eyebrow: 'O Level Mathematics · Topic 2',
            title: 'Graphing Inequalities',
            heading: 'Representing inequalities on a graph',
            intro: 'This topic starts with the number line and ends with the regions you need for Linear Programming. Learn the 8 skills in order.',
            content: [
                { type: 'sub', text: 'Inequalities on a number line' },
                { type: 'paragraph', text: 'x > 3 is shown by an open circle at 3 and shading to the right.' },
                { type: 'paragraph', text: 'Why open? Because x > 3 means 3 is NOT included. Compare x ≥ 3: here you use a closed (filled) circle, because 3 is included.' },
                { type: 'table', headers: ['Inequality', 'Circle', 'Direction'], rows: [['x > 3', 'Open', '→'], ['x ≥ 3', 'Closed', '→'], ['x < 3', 'Open', '←'], ['x ≤ 3', 'Closed', '←']] },
                { type: 'numberlines', lines: [
                    { label: 'x > 3', min: 0, max: 6, a: 3, aOpen: true },
                    { label: 'x ≥ 3', min: 0, max: 6, a: 3, aOpen: false },
                    { label: 'x < 3', min: 0, max: 6, b: 3, bOpen: true },
                    { label: 'x ≤ 3', min: 0, max: 6, b: 3, bOpen: false },
                ] },
                { type: 'note', text: 'This is a fundamental skill. Open circle = not included. Closed circle = included.' },

                { type: 'sub', text: 'Inequalities in two variables' },
                { type: 'paragraph', text: 'This is where the topic becomes more important for Linear Programming. For example:' },
                { type: 'example', text: 'y > 2x + 1' },
                { type: 'paragraph', text: 'First, temporarily ignore the inequality and draw y = 2x + 1. This is the boundary line. Then decide which side of the line represents y > 2x + 1.' },

                { type: 'sub', text: 'Solid vs broken line' },
                { type: 'paragraph', text: 'You should know this very well for ZIMSEC.' },
                { type: 'table', headers: ['Sign', 'Line', 'Example'], rows: [['>  or  <', 'Broken / dashed', 'y > 2x + 1'], ['≥  or  ≤', 'Solid', 'y ≥ 2x + 1']] },
                { type: 'paragraph', text: 'The line for y > 2x + 1 is broken because points on the line are not included. The line for y ≥ 2x + 1 is solid because points on the line are included.' },
                { type: 'graph', title: 'Broken line and solid line', caption: 'The broken line is for > or <. The solid line is for ≥ or ≤.', component: FigGI_LineTypes },
                { type: 'note', text: 'Memory trick: strict inequality (< or >) → broken line. Inclusive inequality (≤ or ≥) → solid line.' },

                { type: 'sub', text: 'Knowing which side to shade' },
                { type: 'paragraph', text: 'Suppose y > 2x + 1. Draw y = 2x + 1. Then choose a test point, usually (0, 0), and substitute it.' },
                al('Test the point (0, 0)', 'Is (0, 0) in the region y > 2x + 1?', 'y:y g:> a:2x p:+ b:1', [
    { cap: 'Put x = 0 and y = 0 into the inequality.', hot: ['y', 'a'], next: 'l:0 g:> c:2(0) p:+ b:1' },
    { cap: 'Work out the right side: 2(0) + 1 = 1.', hot: ['c', 'p', 'b'], next: 'l:0 g:> s:1' },
], '0 > 1 is FALSE'),
                { type: 'paragraph', text: 'It is false. So the region containing (0, 0) is NOT the required region. You shade the side containing (0, 0), and the unshaded side is the answer.' },
                { type: 'graph', title: 'y > 2x + 1 (broken line)', caption: 'The line is broken because the sign is >. (0, 0) fails the test, so the red side with (0, 0) is shaded out and the unshaded side is the region.', component: FigGI_Dashed },

                { type: 'sub', text: 'The test-point method' },
                { type: 'paragraph', text: 'Learn this method. It works for almost every inequality. Suppose 2x + y ≤ 6.' },
                { type: 'list', items: ['Draw the boundary. Change ≤ to =, so 2x + y = 6.', 'Choose a test point, usually (0, 0).', 'Substitute it: 2(0) + 0 ≤ 6, so 0 ≤ 6. This is true.', 'Shade the side containing (0, 0), because the test point satisfies the inequality.'] },
                al('Test the point (0, 0)', 'Is (0, 0) in the region 2x + y ≤ 6?', 'a:2x p:+ b:y g:≤ c:6', [
    { cap: 'Put x = 0 and y = 0 into the inequality.', hot: ['a', 'b'], next: 'd:2(0) p:+ e:0 g:≤ c:6' },
    { cap: 'Work out the left side: 2(0) + 0 = 0.', hot: ['d', 'p', 'e'], next: 'f:0 g:≤ c:6' },
], '0 ≤ 6 is TRUE'),
                { type: 'graph', title: '2x + y ≤ 6 (solid line)', caption: 'The line is solid because the sign is ≤. (0, 0) passes the test, so the side with (0, 0) is the region. The other side is shaded out.', component: FigGI_Solid },

                { type: 'sub', text: 'Horizontal and vertical inequalities' },
                { type: 'paragraph', text: 'Recognise these quickly. x = 3 is a vertical line. y = 4 is a horizontal line.' },
                { type: 'table', headers: ['Inequality', 'Boundary', 'Shade'], rows: [['x > 3', 'Vertical line x = 3', 'Right'], ['x < 3', 'Vertical line x = 3', 'Left'], ['y > 4', 'Horizontal line y = 4', 'Above'], ['y < 4', 'Horizontal line y = 4', 'Below']] },
                { type: 'graph', title: 'x ≥ 3 (vertical line)', caption: 'The boundary x = 3 is vertical. Shade to the right. The region R is the unshaded side.', component: FigGI_Vert },
                { type: 'graph', title: 'y < 4 (horizontal line)', caption: 'The boundary y = 4 is horizontal and broken. Shade below. The region R is the unshaded side.', component: FigGI_Horiz },
                { type: 'note', text: 'x ≥ 3 and y ≤ 4 shade the same sides, but the line is solid.' },

                { type: 'sub', text: 'Finding an inequality from a graph' },
                { type: 'paragraph', text: 'Especially worth practising for ZIMSEC. They give a graph with a boundary line and a shaded region, and ask: which inequality represents the shaded region? Find three things:' },
                { type: 'list', items: ['What is the equation of the boundary? For example y = 2x + 3.', 'Is the line solid or broken? Solid means ≤ or ≥. Broken means < or >.', 'Which side is the region? Above the line means y > 2x + 3. Below the line means y < 2x + 3.'] },
                { type: 'graph', title: 'Reading an inequality from a graph', caption: 'Boundary: y = 2x + 3. The line is solid. R is below the line, so the inequality is y ≤ 2x + 3.', component: FigGI_Read },

                { type: 'sub', text: 'Simultaneous inequalities' },
                { type: 'paragraph', text: 'This leads directly into Linear Programming. For example:' },
                { type: 'example', text: 'y ≥ x + 1   and   y ≤ 5 − x' },
                { type: 'paragraph', text: 'Draw both boundary lines and find the area that satisfies both inequalities at the same time. That common area is the solution region, or the feasible region, depending on the context.' },
                { type: 'graph', title: 'y ≥ x + 1 and y ≤ 5 − x', caption: 'Both lines are solid. The region R satisfies both inequalities. The two lines meet at (2, 3), a vertex of the region.', component: FigGI_Simul },
                { type: 'note', text: 'Every point in the common region must satisfy every inequality at the same time.' },
            ],
        },
        
{
            id: 'testing-a-point',
            eyebrow: 'O Level Mathematics · Topic 3',
            title: 'Testing a Point',
            heading: 'Testing a point',
            intro: 'The purpose is to determine which side of a boundary line should be shaded.',
            content: [
                { type: 'sub', text: 'The method' },
                { type: 'paragraph', text: 'Suppose you have:' },
                { type: 'example', text: 'y > 2x + 1' },
                { type: 'list', items: [
                    'Draw the boundary. Ignore the > temporarily and draw y = 2x + 1. Because the sign is >, draw the boundary as a broken line.',
                    'Choose a point. Usually choose (0, 0), provided it is not on the boundary.',
                    'Substitute the point. Put x = 0 and y = 0 into the inequality.',
                    'Decide the region. If the point does not satisfy the inequality, do not shade the side containing it. Shade the opposite side.',
                ] },
                al('Test the point (0, 0)', 'Is (0, 0) in the region y > 2x + 1?', 'y:y g:> a:2x p:+ b:1', [
    { cap: 'Put x = 0 and y = 0 into the inequality.', hot: ['y', 'a'], next: 'l:0 g:> c:2(0) p:+ b:1' },
    { cap: 'Work out the right side: 2(0) + 1 = 1.', hot: ['c', 'p', 'b'], next: 'l:0 g:> s:1' },
], '0 > 1 is FALSE'),
                { type: 'paragraph', text: 'This is false. Because (0, 0) does not satisfy the inequality, you do not shade the side containing (0, 0). You shade the opposite side.' },
                { type: 'graph', title: 'y > 2x + 1 (broken line)', caption: '(0, 0) fails the test. The red tint is on the side with (0, 0), so the required region is the clear side above the line.', component: FigGI_Dashed },

                { type: 'sub', text: 'Another example' },
                { type: 'example', text: '2x + y ≤ 8' },
                al('Test the point (0, 0)', 'Is (0, 0) in the region 2x + y ≤ 8?', 'a:2x p:+ b:y g:≤ c:8', [
    { cap: 'Put x = 0 and y = 0 into the inequality.', hot: ['a', 'b'], next: 'd:2(0) p:+ e:0 g:≤ c:8' },
    { cap: 'Work out the left side: 2(0) + 0 = 0.', hot: ['d', 'p', 'e'], next: 'f:0 g:≤ c:8' },
], '0 ≤ 8 is TRUE'),
                { type: 'paragraph', text: 'This is true. Therefore the side containing (0, 0) is the required region.' },
                { type: 'graph', title: '2x + y ≤ 8 (solid line)', caption: '(0, 0) passes the test, so the side with (0, 0) is the required region R. The red tint is on the other side.', component: FigTP_Two },

                { type: 'sub', text: 'What ZIMSEC can test' },
                { type: 'paragraph', text: 'You should be able to do these three things.' },

                { type: 'sub', text: 'Test a given point' },
                { type: 'paragraph', text: 'Determine whether (2, 1) satisfies y < 3x + 2. Put x = 2 and y = 1.' },
                al('Test the point (2, 1)', 'Does (2, 1) satisfy y < 3x + 2?', 'y:y g:< a:3x p:+ b:2', [
    { cap: 'Put x = 2 and y = 1 into the inequality.', hot: ['y', 'a'], next: 'l:1 g:< c:3(2) p:+ b:2' },
    { cap: 'Work out the right side: 3(2) + 2 = 8.', hot: ['c', 'p', 'b'], next: 'l:1 g:< s:8' },
], '1 < 8 is TRUE'),
                { type: 'paragraph', text: 'True. Therefore (2, 1) lies in the solution region.' },

                { type: 'sub', text: 'Use a point to determine shading' },
                { type: 'paragraph', text: 'Given y ≥ x − 2, test (0, 0).' },
                al('Test the point (0, 0)', 'Which side of y ≥ x − 2 is the region?', 'y:y g:≥ a:x m:− b:2', [
    { cap: 'Put x = 0 and y = 0 into the inequality.', hot: ['y', 'a'], next: 'l:0 g:≥ c:0 m:− b:2' },
    { cap: 'Work out the right side: 0 − 2 = −2.', hot: ['c', 'm', 'b'], next: 'l:0 g:≥ s:−2' },
], '0 ≥ −2 is TRUE'),
                { type: 'paragraph', text: 'True. Therefore the required region is the side containing (0, 0).' },
                { type: 'graph', title: 'y ≥ x − 2 (solid line)', caption: 'The line is solid because of ≥. (0, 0) passes the test, so R is the side containing (0, 0).', component: FigTP_Line },

                { type: 'sub', text: 'Test points from a graph' },
                { type: 'paragraph', text: 'You may be given a graph and asked which of several points satisfies the inequality. For example the points A (0, 0), B (2, 1), C (3, 5) and D (−1, 4) with the inequality y > x + 1. You substitute each point and see which ones satisfy it.' },
                { type: 'table', headers: ['Point', 'Substitute into y > x + 1', 'Result'], rows: [['A (0, 0)', '0 > 0 + 1, so 0 > 1', 'False'], ['B (2, 1)', '1 > 2 + 1, so 1 > 3', 'False'], ['C (3, 5)', '5 > 3 + 1, so 5 > 4', 'True'], ['D (−1, 4)', '4 > −1 + 1, so 4 > 0', 'True']] },
                { type: 'graph', title: 'Which points satisfy y > x + 1?', caption: 'C and D are on the required side of the broken line. A and B are not.', component: FigTP_Points },

                { type: 'sub', text: 'The key rule' },
                { type: 'list', items: [
                    'Take the x and y coordinates of the point.',
                    'Substitute them into the inequality.',
                    'If the statement is TRUE, the point is in the solution region.',
                    'If it is FALSE, the point is not in the solution region.',
                ] },
                { type: 'note', text: 'For graph shading: a test point that makes the inequality TRUE tells you which side is the required region.' },
                { type: 'note', text: 'One important warning: do not automatically use (0, 0). If (0, 0) lies on the boundary line, choose another point such as (1, 0) or (0, 1).' },
            ],
        },
        
{
            id: 'simultaneous-inequalities',
            eyebrow: 'O Level Mathematics · Topic 4',
            title: 'Simultaneous Inequalities',
            heading: 'Simultaneous inequalities',
            intro: 'This means you have two or more inequalities that must be satisfied at the same time. For example y ≥ x + 1 and y ≤ 5 − x. You are looking for the region where both inequalities are true.',
            content: [
                { type: 'sub', text: 'Solving simultaneous inequalities algebraically' },
                { type: 'paragraph', text: 'At the simpler level you can have 2x + 3 > 7 and x + 1 ≤ 6. Solve them separately.' },
                al('First inequality', 'Solve 2x + 3 > 7', 'c:2 x:x p:+ a:3 g:> b:7', [
    { cap: 'Take 3 away from both sides.', hot: ['p', 'a'], add: [['a', 'm1:−', 'm2:3'], ['b', 'm3:−', 'm4:3']], cross: ['p', 'a', 'm1', 'm2'], next: 'c:2 x:x g:> r:4' },
    { cap: 'Divide both sides by 2.', hot: ['c'], add: [['x', 'd1:÷', 'd2:2'], ['r', 'd3:÷', 'd4:2']], cross: ['c', 'd1', 'd2'], next: 'x:x g:> s:2' },
], 'x > 2'),
                al('Second inequality', 'Solve x + 1 ≤ 6', 'x:x p:+ a:1 g:≤ b:6', [
    { cap: 'Take 1 away from both sides.', hot: ['p', 'a'], add: [['a', 'm1:−', 'm2:1'], ['b', 'm3:−', 'm4:1']], cross: ['p', 'a', 'm1', 'm2'], next: 'x:x g:≤ r:5' },
], 'x ≤ 5'),
                { type: 'paragraph', text: 'The answer must satisfy both conditions, so x is more than 2 and at most 5.' },
                { type: 'example', text: '2 < x ≤ 5' },
                { type: 'numberlines', lines: [
                    { label: 'x > 2', min: 0, max: 8, a: 2, aOpen: true },
                    { label: 'x ≤ 5', min: 0, max: 8, b: 5, bOpen: false },
                    { label: '2 < x ≤ 5', min: 0, max: 8, a: 2, aOpen: true, b: 5, bOpen: false, note: 'Both conditions are true only where the two lines overlap.' },
                ] },

                { type: 'sub', text: 'Simultaneous inequalities on a graph' },
                { type: 'paragraph', text: 'This is the more important part for the graphical and Linear Programming section. Suppose y ≥ x + 1 and y ≤ 5 − x.' },
                { type: 'list', items: [
                    'Draw the first boundary, y = x + 1. The sign is ≥, so use a solid line.',
                    'Draw the second boundary, y = 5 − x. The sign is ≤, so also use a solid line.',
                    'Shade each inequality. For y ≥ x + 1 the region is above the first line. For y ≤ 5 − x the region is below the second line.',
                    'Find the common region. The area where the two regions overlap is the solution to the simultaneous inequalities.',
                ] },
                { type: 'graph', title: 'y ≥ x + 1 and y ≤ 5 − x', caption: 'Each line tints the side that is not wanted. The clear area R is where both inequalities are true.', component: FigSI_Two },

                { type: 'sub', text: 'Testing points' },
                { type: 'paragraph', text: 'Use the testing-a-point method. Test (0, 3) against both inequalities.' },
                al('First inequality', 'Does (0, 3) satisfy y ≥ x + 1?', 'l:3 g:≥ a:0 p:+ b:1', [
    { cap: 'Put x = 0 and y = 3 in. Work out the right side: 0 + 1 = 1.', hot: ['a', 'p', 'b'], next: 'l:3 g:≥ s:1' },
], '3 ≥ 1 is TRUE'),
                al('Second inequality', 'Does (0, 3) satisfy y ≤ 5 − x?', 'l:3 g:≤ a:5 m:− b:0', [
    { cap: 'Put x = 0 and y = 3 in. Work out the right side: 5 − 0 = 5.', hot: ['a', 'm', 'b'], next: 'l:3 g:≤ s:5' },
], '3 ≤ 5 is TRUE'),
                { type: 'paragraph', text: 'Both are true. Therefore (0, 3) lies in the common solution region.' },
                { type: 'graph', title: 'Testing (0, 3)', caption: '(0, 3) is inside the clear region, so it satisfies both inequalities.', component: FigSI_Test },

                { type: 'sub', text: 'Finding the intersection' },
                { type: 'paragraph', text: 'Sometimes you need to find where the boundary lines meet. We have y = x + 1 and y = 5 − x. Since both equal y, put them equal to each other.' },
                al('Find x', 'Solve x + 1 = 5 − x', 'x:x p:+ a:1 g:= b:5 m:− y:x', [
    { cap: 'Add x to both sides, so the −x on the right cancels.', hot: ['m', 'y'], add: [['a', 'p1:+', 'p2:x'], ['y', 'p3:+', 'p4:x']], cross: ['m', 'y', 'p3', 'p4'], next: 'c:2 x:x p:+ a:1 g:= b:5' },
    { cap: 'Take 1 away from both sides.', hot: ['p', 'a'], add: [['a', 'q1:−', 'q2:1'], ['b', 'q3:−', 'q4:1']], cross: ['p', 'a', 'q1', 'q2'], next: 'c:2 x:x g:= r:4' },
    { cap: 'Divide both sides by 2.', hot: ['c'], add: [['x', 'd1:÷', 'd2:2'], ['r', 'd3:÷', 'd4:2']], cross: ['c', 'd1', 'd2'], next: 'x:x g:= s:2' },
], 'x = 2'),
                al('Find y', 'Put x = 2 into y = x + 1', 'y:y g:= a:2 p:+ b:1', [
    { cap: 'Work out 2 + 1.', hot: ['a', 'p', 'b'], next: 'y:y g:= r:3' },
], 'y = 3'),
                { type: 'paragraph', text: 'So the lines intersect at:' },
                { type: 'example', text: '(2, 3)' },
                { type: 'note', text: 'This skill becomes particularly important when you progress to feasible regions and Linear Programming.' },

                { type: 'sub', text: 'Three or more inequalities' },
                { type: 'paragraph', text: 'ZIMSEC questions can become more complicated. For example:' },
                { type: 'example', text: 'x ≥ 0,   y ≥ 0,   x + y ≤ 8,   y ≤ 2x' },
                { type: 'paragraph', text: 'You draw all four boundaries. The required answer is the region satisfying all four conditions at the same time. This is the beginning of a feasible region.' },
                { type: 'graph', title: 'x ≥ 0, y ≥ 0, x + y ≤ 8, y ≤ 2x', caption: 'The region R is a triangle. y = 2x and x + y = 8 meet where 3x = 8, so at (8/3, 16/3).', component: FigSI_Five },

                { type: 'sub', text: 'Difficulty progression' },
                { type: 'table', headers: ['Level', 'Example'], rows: [['Basic', 'x > 2,   x ≤ 7'], ['Intermediate', 'y > x + 2,   y ≤ 6 − x'], ['Harder', 'x ≥ 0,   y ≥ 0,   x + y ≤ 10,   y ≤ 2x']] },
                { type: 'numberlines', lines: [
                    { label: 'Basic: 2 < x ≤ 7', min: 0, max: 9, a: 2, aOpen: true, b: 7, bOpen: false },
                ] },
                { type: 'graph', title: 'Intermediate: y > x + 2 and y ≤ 6 − x', caption: 'y > x + 2 is a broken line and y ≤ 6 − x is solid. The lines meet at (2, 4), where x + 2 = 6 − x.', component: FigSI_Mid },
                { type: 'graph', title: 'Harder: x ≥ 0, y ≥ 0, x + y ≤ 10, y ≤ 2x', caption: 'The corners of R are (0, 0), (10, 0) and (10/3, 20/3).', component: FigSI_Hard },

                { type: 'sub', text: 'What you should learn for this subtopic' },
                { type: 'list', items: [
                    'Solving two inequalities simultaneously.',
                    'Representing two inequalities on the same graph.',
                    'Finding the common or overlapping region.',
                    'Testing points in multiple inequalities.',
                    'Drawing several inequalities on one graph.',
                    'Finding intersections of boundary lines.',
                    'Identifying the solution or feasible region.',
                    'Using the region to solve Linear Programming problems.',
                ] },
                { type: 'note', text: 'Every point in the common region must satisfy every inequality at the same time.' },
            ],
        },
        
{
            id: 'feasible-region',
            eyebrow: 'O Level Mathematics · Topic 5',
            title: 'Feasible Region',
            heading: 'Understanding the feasible region',
            intro: 'The feasible region is the area where all the restrictions of a problem are true at the same time. It is built in 7 steps.',
            content: [
                { type: 'sub', text: 'Start with several inequalities' },
                { type: 'paragraph', text: 'For example:' },
                { type: 'example', text: 'x ≥ 0,   y ≥ 0,   x + y ≤ 8,   y ≤ 2x' },
                { type: 'paragraph', text: 'Each inequality represents a restriction.' },

                { type: 'sub', text: 'Draw all the boundary lines' },
                { type: 'paragraph', text: 'Change each inequality to an equation temporarily. The boundaries are x = 0, y = 0, x + y = 8 and y = 2x.' },
                al('Change to an equation', 'Boundary of x + y ≤ 8', 'a:x p:+ b:y g:≤ c:8', [
    { cap: 'Replace the ≤ sign with = to get the boundary line.', hot: ['g'], next: 'a:x p:+ b:y h:= c:8' },
], 'x + y = 8'),
                al('Change to an equation', 'Boundary of y ≤ 2x', 'y:y g:≤ c:2x', [
    { cap: 'Replace the ≤ sign with = to get the boundary line.', hot: ['g'], next: 'y:y h:= c:2x' },
], 'y = 2x'),
                { type: 'paragraph', text: 'Then draw them on the same coordinate plane. Remember:' },
                { type: 'table', headers: ['Sign', 'Line'], rows: [['<  or  >', 'Broken line'], ['≤  or  ≥', 'Solid line']] },
                { type: 'paragraph', text: 'In this example all the inequalities use ≤ or ≥, so the boundaries are solid.' },
                { type: 'graph', title: 'The boundary lines on one plane', caption: 'x = 0 is the y-axis and y = 0 is the x-axis. The other two lines are x + y = 8 and y = 2x. All four are solid.', component: FigFR_Lines },

                { type: 'sub', text: 'Shade the correct side of each line' },
                { type: 'paragraph', text: 'Each inequality tells you which side of its boundary is allowed.' },
                { type: 'table', headers: ['Inequality', 'Meaning'], rows: [['x ≥ 0', 'You are on the right side of the y-axis'], ['y ≥ 0', 'You are above the x-axis'], ['x + y ≤ 8', 'You are on the side below the line x + y = 8']] },
                { type: 'graph', title: 'The allowed side of three boundaries', caption: 'The red tint marks the side that is NOT allowed for x ≥ 0, y ≥ 0 and x + y ≤ 8. The clear triangle is allowed by all three.', component: FigFR_Shade },

                { type: 'sub', text: 'Find the common area' },
                { type: 'paragraph', text: 'This is the most important part. You are looking for the area where EVERY inequality is true. That common area is the:' },
                { type: 'example', text: 'FEASIBLE REGION' },
                { type: 'paragraph', text: 'Think of it as the area where all the restrictions agree.' },
                { type: 'graph', title: 'x ≥ 0, y ≥ 0, x + y ≤ 8, y ≤ 2x', caption: 'Each line tints the side that is not allowed. The clear area left over is the feasible region.', component: FigFR_Common },

                { type: 'sub', text: 'Feasible region vs individual regions' },
                { type: 'paragraph', text: 'Suppose inequality A gives a large shaded area, and B, C and D each give another. You do not want just A, or B, or C, or D. You want:' },
                { type: 'example', text: 'A ∩ B ∩ C ∩ D' },
                { type: 'paragraph', text: 'In simple English, that is the area shared by all four.' },
                { type: 'graph', title: 'The area shared by all four', caption: 'Each circle is the region allowed by one inequality. The yellow spot in the middle is inside all four, so it is the feasible region.', component: FigFR_Venn },

                { type: 'sub', text: 'Finding the vertices' },
                { type: 'paragraph', text: 'Once you have found the feasible region, you normally need to identify its corner points, called vertices. For example, a feasible region might have:' },
                { type: 'example', text: '(0, 0),   (4, 0),   (3, 2),   (0, 3)' },
                { type: 'paragraph', text: 'These points become extremely important in Linear Programming, because you can use them to find the maximum or minimum value of an objective function.' },
                { type: 'graph', title: 'The vertices of a feasible region', caption: 'The region R has four corners. (3, 2) is where 2x + y = 8 meets x + 3y = 9.', component: FigFR_Verts },

                { type: 'sub', text: 'Why the feasible region matters' },
                { type: 'paragraph', text: 'This is the connection from a word problem to the answer:' },
                { type: 'graph', title: 'From word problem to answer', caption: 'The feasible region is the allowed area of the problem.', component: FigFR_Flow },
                { type: 'note', text: 'The feasible region is basically the allowed area of the problem. Every point in it satisfies every restriction at the same time.' },
            ],
        },
        
{
            id: 'vertices',
            eyebrow: 'O Level Mathematics · Topic 6',
            title: 'Coordinates of Vertices',
            heading: 'Finding the coordinates of vertices',
            intro: 'This is the next skill after the feasible region. In ZIMSEC O-Level Linear Programming, a vertex is simply a corner point of the feasible region. You need to be able to find the coordinates of every vertex accurately.',
            content: [
                { type: 'example', text: '(0, 0),   (4, 0),   (3, 2),   (0, 3)' },
                { type: 'graph', title: 'The vertices of a feasible region', caption: 'The region R is a polygon. Every corner has coordinates.', component: FigVT_Poly },

                { type: 'sub', text: 'Some vertices can be read directly' },
                { type: 'paragraph', text: 'If a corner lies clearly on the graph, you may simply read its coordinates. For example (4, 0) means x = 4 and y = 0. And (0, 3) means x = 0 and y = 3. These are usually the easier vertices.' },

                { type: 'sub', text: 'Vertices formed by two lines' },
                { type: 'paragraph', text: 'The more important skill is finding the point where two boundary lines intersect. Suppose two boundaries are y = x + 1 and y = 5 − x. The vertex occurs where these two lines meet. Because both equal y, put them equal to each other.' },
                al('Find x', 'Solve x + 1 = 5 − x', 'x:x p:+ a:1 g:= b:5 m:− y:x', [
    { cap: 'Add x to both sides, so the −x on the right cancels.', hot: ['m', 'y'], add: [['a', 'p1:+', 'p2:x'], ['y', 'p3:+', 'p4:x']], cross: ['m', 'y', 'p3', 'p4'], next: 'c:2 x:x p:+ a:1 g:= b:5' },
    { cap: 'Take 1 away from both sides.', hot: ['p', 'a'], add: [['a', 'q1:−', 'q2:1'], ['b', 'q3:−', 'q4:1']], cross: ['p', 'a', 'q1', 'q2'], next: 'c:2 x:x g:= r:4' },
    { cap: 'Divide both sides by 2.', hot: ['c'], add: [['x', 'd1:÷', 'd2:2'], ['r', 'd3:÷', 'd4:2']], cross: ['c', 'd1', 'd2'], next: 'x:x g:= s:2' },
], 'x = 2'),
                al('Find y', 'Put x = 2 into y = x + 1', 'y:y g:= a:2 p:+ b:1', [
    { cap: 'Work out 2 + 1.', hot: ['a', 'p', 'b'], next: 'y:y g:= r:3' },
], 'y = 3'),
                { type: 'paragraph', text: 'Therefore the vertex is:' },
                { type: 'example', text: '(2, 3)' },
                { type: 'graph', title: 'Where y = x + 1 meets y = 5 − x', caption: 'The two boundary lines cross at (2, 3). That crossing point is a vertex.', component: FigVT_Two },

                { type: 'sub', text: 'Another common ZIMSEC style situation' },
                { type: 'paragraph', text: 'Suppose the boundaries are 2x + y = 10 and x + y = 7. To find their intersection, subtract the second equation from the first.' },
                al('Subtract the equations', '(2x + y) − (x + y) = 10 − 7', 'a:(2x+y) m:− b:(x+y) g:= c:10 n:− d:7', [
    { cap: 'The y terms cancel: 2x − x = x, and 10 − 7 = 3.', hot: ['a', 'm', 'b', 'n', 'c', 'd'], next: 'e:x g:= f:3' },
], 'x = 3'),
                al('Find y', 'Put x = 3 into x + y = 7', 'a:3 p:+ y:y g:= b:7', [
    { cap: 'Take 3 away from both sides.', hot: ['a', 'p'], add: [['a', 'm1:−', 'm2:3'], ['b', 'm3:−', 'm4:3']], cross: ['a', 'm1', 'm2'], next: 'y:y g:= r:4' },
], 'y = 4'),
                { type: 'paragraph', text: 'Therefore the lines meet at:' },
                { type: 'example', text: '(3, 4)' },
                { type: 'paragraph', text: 'That point can be a vertex of the feasible region.' },
                { type: 'graph', title: 'Where 2x + y = 10 meets x + y = 7', caption: 'The two lines cross at (3, 4).', component: FigVT_Elim },

                { type: 'sub', text: 'Vertices involving the axes' },
                { type: 'paragraph', text: 'These are particularly easy once you understand them. Suppose the boundary is 2x + y = 8.' },
                { type: 'paragraph', text: 'Intersection with the x-axis. On the x-axis, y = 0. Put y = 0 into the equation.' },
                al('Meeting the x-axis', 'Put y = 0 into 2x + y = 8', 'c:2 x:x p:+ y:0 g:= b:8', [
    { cap: 'Adding 0 changes nothing.', hot: ['p', 'y'], next: 'c:2 x:x g:= b:8' },
    { cap: 'Divide both sides by 2.', hot: ['c'], add: [['x', 'd1:÷', 'd2:2'], ['b', 'd3:÷', 'd4:2']], cross: ['c', 'd1', 'd2'], next: 'x:x g:= s:4' },
], 'x = 4, so the point is (4, 0)'),
                { type: 'paragraph', text: 'Intersection with the y-axis. On the y-axis, x = 0. Put x = 0 into the equation.' },
                al('Meeting the y-axis', 'Put x = 0 into 2x + y = 8', 'a:2(0) p:+ y:y g:= b:8', [
    { cap: '2 × 0 is 0, and adding 0 changes nothing.', hot: ['a', 'p'], next: 'y:y g:= b:8' },
], 'y = 8, so the point is (0, 8)'),
                { type: 'graph', title: 'Where 2x + y = 8 meets the axes', caption: 'On the x-axis y = 0, which gives (4, 0). On the y-axis x = 0, which gives (0, 8).', component: FigVT_Axes },

                { type: 'sub', text: 'Three main ways you will find vertices' },
                { type: 'table', headers: ['Method', 'When to use it'], rows: [['A: Read from the graph', 'The coordinates are obvious, for example (2, 5). Just read them.'], ['B: Set x = 0 or y = 0', 'For vertices where a boundary meets an axis.'], ['C: Solve simultaneous equations', 'For vertices where two boundary lines intersect.']] },
                { type: 'note', text: 'Method C is the one you really need to master.' },

                { type: 'sub', text: 'Important connection to Linear Programming' },
                { type: 'paragraph', text: 'Once you have the feasible region, find all the vertices. Then evaluate the objective function at each vertex. For example P = 5x + 3y. If the vertices are (0, 0), (4, 0), (3, 2) and (0, 3), you calculate P at each one.' },
                { type: 'table', headers: ['Vertex', 'P = 5x + 3y'], rows: [['(0, 0)', '0'], ['(4, 0)', '20'], ['(3, 2)', '21'], ['(0, 3)', '9']] },
                { type: 'graph', title: 'P at each vertex', caption: 'The largest value of P is 21, at the vertex (3, 2). The vertex coordinates are essential for the next stage of Linear Programming.', component: FigVT_Obj },
                { type: 'note', text: 'Find the vertices first. Without accurate coordinates, the objective function values will be wrong.' },
            ],
        },
        
{
            id: 'objective-functions',
            eyebrow: 'O Level Mathematics · Topic 7',
            title: 'Objective Functions',
            heading: 'Objective functions',
            intro: 'This is the point where Linear Programming becomes a complete problem. In ZIMSEC O-Level, an objective function is the mathematical expression that represents the quantity you want to maximise or minimise.',
            content: [
                { type: 'table', headers: ['Quantity', 'Aim'], rows: [['Profit', 'Maximise'], ['Revenue', 'Maximise'], ['Cost', 'Minimise'], ['Time', 'Minimise'], ['Production', 'Maximise or minimise, depending on the question']] },

                { type: 'sub', text: 'What is an objective function?' },
                { type: 'paragraph', text: 'Suppose a company makes two products. Let x be the number of Product A and y the number of Product B. If Product A makes $5 profit and Product B makes $3 profit, then the total profit is:' },
                { type: 'example', text: 'P = 5x + 3y' },
                { type: 'paragraph', text: 'This is the objective function. The objective is to find the maximum value of P.' },

                { type: 'sub', text: 'Maximisation' },
                { type: 'paragraph', text: 'If the question says "find the maximum profit", you might have P = 5x + 3y and a feasible region with vertices (0, 0), (4, 0), (3, 2) and (0, 3). Substitute each vertex into the objective function.' },
                { type: 'table', headers: ['Vertex', 'P = 5x + 3y'], rows: [['(0, 0)', '0'], ['(4, 0)', '20'], ['(3, 2)', '21'], ['(0, 3)', '9']] },
                al('Substitute (3, 2)', 'Find P at the vertex (3, 2)', 'p:P g:= a:5x pl:+ b:3y', [
    { cap: 'Put x = 3 and y = 2 into the objective function.', hot: ['a', 'b'], next: 'p:P g:= c:5(3) pl:+ d:3(2)' },
    { cap: 'Multiply: 5 × 3 = 15 and 3 × 2 = 6.', hot: ['c', 'd'], next: 'p:P g:= e:15 pl:+ f:6' },
    { cap: 'Add the two values.', hot: ['e', 'pl', 'f'], next: 'p:P g:= h:21' },
], 'P = 21'),
                { type: 'paragraph', text: 'Therefore the maximum value is 21, at (3, 2).' },
                { type: 'graph', title: 'P at each vertex', caption: 'The dashed line P = 21 touches the region at one corner only, (3, 2). That is the maximum.', component: FigOF_Max },

                { type: 'sub', text: 'Minimisation' },
                { type: 'paragraph', text: 'The same process applies if you are asked to minimise something. Suppose C = 4x + 7y and the vertices are (1, 4), (3, 2), (5, 1) and (2, 5). Calculate C at every vertex.' },
                { type: 'table', headers: ['Vertex', 'C = 4x + 7y'], rows: [['(1, 4)', '32'], ['(3, 2)', '26'], ['(5, 1)', '27'], ['(2, 5)', '43']] },
                al('Substitute (3, 2)', 'Find C at the vertex (3, 2)', 'c:C g:= a:4x pl:+ b:7y', [
    { cap: 'Put x = 3 and y = 2 into the objective function.', hot: ['a', 'b'], next: 'c:C g:= d:4(3) pl:+ e:7(2)' },
    { cap: 'Multiply: 4 × 3 = 12 and 7 × 2 = 14.', hot: ['d', 'e'], next: 'c:C g:= f:12 pl:+ h:14' },
    { cap: 'Add the two values.', hot: ['f', 'pl', 'h'], next: 'c:C g:= k:26' },
], 'C = 26'),
                { type: 'paragraph', text: 'The smallest value is 26, so the minimum is 26, at (3, 2).' },
                { type: 'graph', title: 'C at each vertex', caption: 'The values are 32, 26, 27 and 43. The smallest is 26, at (3, 2).', component: FigOF_Min },

                { type: 'sub', text: 'The important ZIMSEC method' },
                { type: 'paragraph', text: 'Once you have found the feasible region, the standard process is:' },
                { type: 'list', items: [
                    'Find the vertices.',
                    'Write the objective function, for example P = 5x + 3y.',
                    'Substitute every vertex into the objective function.',
                    'Compare the answers.',
                    'Choose the required maximum or minimum.',
                    'Interpret your answer in the context of the question.',
                ] },

                { type: 'sub', text: 'Getting the objective function from a word problem' },
                { type: 'paragraph', text: 'This is an important exam skill. Suppose a company produces tables and chairs. Each table gives a profit of $20 and each chair gives a profit of $8. Let x be the number of tables and y the number of chairs. Therefore:' },
                { type: 'example', text: 'P = 20x + 8y' },
                { type: 'paragraph', text: 'If the question says maximise profit, this becomes the objective function.' },
                { type: 'graph', title: 'From the words to P', caption: 'Each product contributes its profit times its number. Add them to get the total profit.', component: FigOF_Word },

                { type: 'sub', text: 'Do not confuse constraints with the objective function' },
                { type: 'paragraph', text: 'This is very important. Suppose you have 2x + y ≤ 10, x + 2y ≤ 12, x ≥ 0 and y ≥ 0. These are constraints. They tell you what combinations of x and y are allowed. But P = 5x + 4y is the objective function. It tells you what you are trying to maximise or minimise.' },
                { type: 'graph', title: 'Constraints and objective function', caption: 'Constraints decide the allowed region. The objective function decides which point in it is best.', component: FigOF_Compare },
                { type: 'note', text: 'Constraints: "What am I allowed to do?" Objective function: "What am I trying to achieve?"' },

                { type: 'sub', text: 'The complete Linear Programming chain' },
                { type: 'paragraph', text: 'This is the big picture you should know for ZIMSEC:' },
                { type: 'graph', title: 'The complete Linear Programming chain', caption: 'Every Linear Programming question follows these steps from the word problem to the answer in context.', component: FigOF_Chain },
                { type: 'note', text: 'Always test every vertex, then state the answer in the words of the question, with the units, for example "the maximum profit is $21".' },
            ],
        },
        
{
            id: 'word-problems',
            eyebrow: 'O Level Mathematics · Topic 8',
            title: 'Word Problems',
            heading: 'Word problems to inequalities',
            intro: 'This is an important skill for ZIMSEC O-Level Linear Programming, because exam questions often give you a real-life situation and expect you to turn the information into inequalities.',
            content: [
                { type: 'paragraph', text: 'The key idea is: read the words, define the variables, translate the restrictions into inequalities.' },
                { type: 'graph', title: 'The key idea', caption: 'Do these three things in this order for every word problem.', component: FigWP_Flow },

                { type: 'sub', text: 'Know what the words mean' },
                { type: 'table', headers: ['Words in the question', 'Mathematical sign'], rows: [['at least', '≥'], ['at most', '≤'], ['no more than', '≤'], ['no less than', '≥'], ['not greater than', '≤'], ['not less than', '≥'], ['greater than', '>'], ['less than', '<'], ['maximum', '≤'], ['minimum', '≥'], ['cannot exceed', '≤'], ['must be more than', '>']] },
                { type: 'note', text: 'Very important: "at least 10" means 10 or more, so x ≥ 10. "At most 10" means 10 or less, so x ≤ 10.' },
                { type: 'numberlines', lines: [
                    { label: 'at least 10: x ≥ 10', min: 6, max: 14, a: 10, aOpen: false, note: '10 is included, and the answers go up from there.' },
                    { label: 'at most 10: x ≤ 10', min: 6, max: 14, b: 10, bOpen: false, note: '10 is included, and the answers go down from there.' },
                ] },

                { type: 'sub', text: 'Define your variables' },
                { type: 'paragraph', text: 'Suppose a question says: a farmer grows maize and beans. Let x be the number of hectares of maize and y be the number of hectares of beans. You should immediately write:' },
                { type: 'graph', title: 'Define the variables first', caption: 'This makes the rest much easier.', component: FigWP_Define },

                { type: 'sub', text: 'Translate the restrictions' },
                { type: 'paragraph', text: 'Example 1, total limit. A farmer has at most 20 hectares of land. He grows maize on x hectares and beans on y hectares. "At most 20" means 20 or less.' },
                al('Total limit', 'At most 20 hectares in total. Write the inequality.', 'a:x p:+ b:y w1:at w2:most n:20', [
    { cap: '"At most" means 20 or less, so write ≤.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:x p:+ b:y s:≤ n:20' },
], 'x + y ≤ 20'),
                { type: 'paragraph', text: 'Example 2, minimum requirement. At least 6 hectares must be used for maize. "At least 6" means 6 or more.' },
                al('Minimum requirement', 'At least 6 hectares for maize.', 'a:x w1:at w2:least n:6', [
    { cap: '"At least" means 6 or more, so write ≥.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:x s:≥ n:6' },
], 'x ≥ 6'),
                { type: 'paragraph', text: 'Example 3, maximum amount. The farmer can grow no more than 8 hectares of beans.' },
                al('Maximum amount', 'No more than 8 hectares of beans.', 'a:y w1:no w2:more w3:than n:8', [
    { cap: '"No more than" means 8 or less, so write ≤.', hot: ['w1', 'w2', 'w3'], cross: ['w1', 'w2', 'w3'], next: 'a:y s:≤ n:8' },
], 'y ≤ 8'),
                { type: 'graph', title: 'x + y ≤ 20, x ≥ 6, y ≤ 8, y ≥ 0', caption: 'Each line tints the side that is not allowed. The clear area R is where all the farmer restrictions are true.', component: FigWP_Farm },

                { type: 'sub', text: 'Watch for quantities attached to each variable' },
                { type: 'paragraph', text: 'This is where Linear Programming questions become more realistic. A factory makes tables and chairs. Each table requires 4 hours of labour and each chair requires 2 hours. There are at most 40 labour hours available. Let x be the number of tables and y the number of chairs.' },
                { type: 'paragraph', text: 'Each table uses 4 hours, so tables use 4x. Each chair uses 2 hours, so chairs use 2y. The total available is 40 hours.' },
                al('Labour hours', '4 hours per table, 2 hours per chair, at most 40 hours.', 'a:4x p:+ b:2y w1:at w2:most n:40', [
    { cap: '"At most 40" means 40 or less, so write ≤.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:4x p:+ b:2y s:≤ n:40' },
], '4x + 2y ≤ 40'),
                { type: 'graph', title: '4x + 2y ≤ 40, x ≥ 0, y ≥ 0', caption: 'The line meets the axes at (10, 0) and (0, 20). The clear triangle R is every allowed number of tables and chairs.', component: FigWP_Factory },

                { type: 'sub', text: '"At least" can apply to a combination' },
                { type: 'paragraph', text: 'A school requires at least 100 students to participate in two activities. x students participate in Activity A and y in Activity B.' },
                al('Combination', 'At least 100 students in total.', 'a:x p:+ b:y w1:at w2:least n:100', [
    { cap: '"At least 100" means 100 or more, so write ≥.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:x p:+ b:y s:≥ n:100' },
], 'x + y ≥ 100'),

                { type: 'sub', text: 'Conditions involving one variable compared with another' },
                { type: 'paragraph', text: 'These are also important. The number of boys x must be at least twice the number of girls y.' },
                al('At least twice', 'Boys x are at least twice the girls y.', 'a:x w1:at w2:least w3:twice b:y', [
    { cap: '"At least" means ≥.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:x s:≥ w3:twice b:y' },
    { cap: '"Twice y" means 2 times y, so write 2y.', hot: ['w3', 'b'], cross: ['w3', 'b'], next: 'a:x s:≥ c:2y' },
], 'x ≥ 2y'),
                { type: 'paragraph', text: 'The number of chairs y must be no more than three times the number of tables x.' },
                al('No more than three times', 'Chairs y are no more than three times the tables x.', 'a:y w1:no w2:more w3:than w4:three w5:times b:x', [
    { cap: '"No more than" means ≤.', hot: ['w1', 'w2', 'w3'], cross: ['w1', 'w2', 'w3'], next: 'a:y s:≤ w4:three w5:times b:x' },
    { cap: '"Three times x" means 3 times x, so write 3x.', hot: ['w4', 'w5', 'b'], cross: ['w4', 'w5', 'b'], next: 'a:y s:≤ c:3x' },
], 'y ≤ 3x'),
                { type: 'graph', title: 'x ≥ 2y', caption: 'The boundary is x = 2y. Boys are at least twice the girls, so the region is the clear side below the line. The point (10, 1) works.', component: FigWP_Twice },
                { type: 'graph', title: 'y ≤ 3x', caption: 'The boundary is y = 3x. Chairs are no more than three times the tables, so the region is the clear side below the line. The point (3, 2) works.', component: FigWP_Three },

                { type: 'sub', text: 'Do not forget x ≥ 0 and y ≥ 0' },
                { type: 'paragraph', text: 'In most Linear Programming word problems, x and y represent things such as the number of products, the number of people, kilograms, hours, hectares or money. These normally cannot be negative. So you often need x ≥ 0 and y ≥ 0. These restrictions put the feasible region in the first quadrant.' },
                { type: 'graph', title: 'x ≥ 0 and y ≥ 0', caption: 'The red tint marks values that are not allowed. Only the first quadrant is left.', component: FigWP_Quadrant },

                { type: 'sub', text: 'Full ZIMSEC style example' },
                { type: 'paragraph', text: 'A bakery makes cakes and loaves of bread. Let x be the number of cakes and y the number of loaves. Each cake requires 3 kg of flour and each loaf requires 1 kg. The bakery has at most 30 kg of flour. The bakery must make at least 4 cakes and at least 6 loaves.' },
                { type: 'paragraph', text: 'Step 1, define the variables: x is the number of cakes and y is the number of loaves.' },
                { type: 'paragraph', text: 'Step 2, the flour restriction. A cake uses 3 kg, so cakes use 3x. A loaf uses 1 kg, so loaves use y. At most 30 kg is available.' },
                al('Flour', '3 kg per cake, 1 kg per loaf, at most 30 kg.', 'a:3x p:+ b:y w1:at w2:most n:30', [
    { cap: '"At most 30" means 30 or less, so write ≤.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:3x p:+ b:y s:≤ n:30' },
], '3x + y ≤ 30'),
                { type: 'paragraph', text: 'Step 3, minimum cakes. At least 4.' },
                al('Minimum cakes', 'At least 4 cakes.', 'a:x w1:at w2:least n:4', [
    { cap: '"At least 4" means 4 or more, so write ≥.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:x s:≥ n:4' },
], 'x ≥ 4'),
                { type: 'paragraph', text: 'Step 4, minimum loaves. At least 6.' },
                al('Minimum loaves', 'At least 6 loaves.', 'a:y w1:at w2:least n:6', [
    { cap: '"At least 6" means 6 or more, so write ≥.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:y s:≥ n:6' },
], 'y ≥ 6'),
                { type: 'paragraph', text: 'Step 5, the non-negative restrictions: x ≥ 0 and y ≥ 0. So the complete set is:' },
                { type: 'graph', title: 'The complete set of inequalities', caption: 'These inequalities are then drawn on a graph to find the feasible region.', component: FigWP_Set },
                { type: 'graph', title: 'The bakery problem on a graph', caption: 'The region R has vertices (4, 6), (8, 6) and (4, 18). The restrictions x ≥ 0 and y ≥ 0 are already satisfied by x ≥ 4 and y ≥ 6.', component: FigWP_Bakery },

                { type: 'sub', text: 'The skill ZIMSEC is testing' },
                { type: 'paragraph', text: 'When you see a word problem, train yourself to identify these three things.' },
                { type: 'graph', title: 'Three things to identify', caption: 'Variables, restrictions, and the expression for each restriction.', component: FigWP_Skills },
                { type: 'paragraph', text: 'For example: 5 hours per table and 3 hours per chair, with 60 hours available, becomes an inequality.' },
                al('Final practice', '5 hours per table, 3 hours per chair, 60 hours available.', 'a:5x p:+ b:3y w1:at w2:most n:60', [
    { cap: 'Hours available is a limit, so it is at most 60. Write ≤.', hot: ['w1', 'w2'], cross: ['w1', 'w2'], next: 'a:5x p:+ b:3y s:≤ n:60' },
], '5x + 3y ≤ 60'),
                { type: 'note', text: 'Translate every restriction before you draw anything. Words like available, limited and cannot exceed all mean ≤. Words like must be at least and minimum mean ≥.' },
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
        <div id="cg-scroll-area" className="min-h-screen w-full bg-slate-50 font-sans text-slate-900">
            <InkStyles />

            {/* Header */}
            <div className={`relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md`}>
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-sm font-black tracking-wider uppercase bg-violet-400/30 text-white border border-slate-200/40`}>CHAPTER 17</span>
                            <span className="rounded-2xl bg-white/20 px-3 py-1 text-sm font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                            <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
                            </button>
                            <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
                            </button>
                        </div>
                    </div>
                    <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Linear Programming</h1>
                    <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-base">
                        {lang === 'sn' ? "Zvishandiso zvekugadzirisa matambudziko ane miganhu — semari shoma, nzvimbo shoma, kana nhamba shoma yezvinhu. Shandisa graph kuona nzvimbo yezvose zvinobvira, uye uwane mhinduro yakanakisa." : "A practical way to solve problems with limits — like a tight budget, limited space, or a maximum number of items. Use a graph to see all possible solutions, then pick the best one."}
                    </p>
                </div>
            </div>

            {/* Navigation pills */}
            <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div id="math-topic-rail" data-math-chapter-scroller="true"
                        className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {sections.map((s) => {
                            const isActive = active === s.id;
                            return (
                                <button key={s.id} onClick={() => handleNavigate(s.id)}
                                    title={s.title}
                                    aria-pressed={isActive}
                                    className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                                    {s.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pb-10 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
                <div key={activeSection.id}>
                    <Section section={activeSection} />
                </div>
            </div>

            {/* Sticky bottom navigation */}
            <div className="sticky bottom-0 z-30 border-t border-neutral-200 bg-white/90 backdrop-blur-md">
                <div className="flex w-full items-center justify-between gap-3 px-3 py-2.5 sm:px-5 md:px-8 lg:px-10">
                    <button onClick={goPrev} disabled={activeIndex === 0}
                        className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-base font-medium text-neutral-800 transition-colors hover:bg-neutral-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white">
                        <span aria-hidden="true">←</span>
                        <span className="truncate">{lang === 'sn' ? 'Kwekumashure' : 'Previous'}</span>
                    </button>
                    <span className="shrink-0 text-sm font-medium tabular-nums text-neutral-500">{activeIndex + 1} / {sections.length}</span>
                    <button onClick={goNext} disabled={activeIndex === sections.length - 1}
                        className="inline-flex min-w-0 items-center gap-1.5 rounded-md bg-neutral-900 px-3 py-1.5 text-base font-medium text-white transition-colors hover:bg-neutral-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-neutral-900">
                        <span className="truncate">{lang === 'sn' ? 'Enderera Mberi' : 'Next'}</span>
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Inequalities;
