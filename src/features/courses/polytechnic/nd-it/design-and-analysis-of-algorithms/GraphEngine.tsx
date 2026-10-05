import React, { useEffect, useRef, useState } from 'react';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
export type GNode = { id: string; x: number; y: number; name?: string };
export type GEdge = { a: string; b: string; w?: number; directed?: boolean };
export type Graph = { nodes: GNode[]; edges: GEdge[]; w: number; h: number };

export type NState = 'current' | 'queued' | 'done' | 'source' | 'bad';
export type EState = 'active' | 'tree' | 'reject' | 'gone';
export type Chip = { t: string; c?: 'amber' | 'green' | 'red' | 'blue' | 'grey' };
export type ListRow = { label: string; items: Chip[] };
export type Matrix = {
  labels: string[];
  cells: number[][];
  hl?: [number, number][];      // cells being looked at (amber)
  fresh?: [number, number][];   // cells that just changed (green)
  rowHl?: number;
  colHl?: number;
};
export type Step = {
  text: string;
  nodes?: Record<string, NState>;
  fills?: Record<string, string>;
  edges?: Record<string, EState>;
  badges?: Record<string, string>;
  lists?: ListRow[];
  matrix?: Matrix;
  extraEdges?: { a: string; b: string }[]; // dashed green "new" arrows
};

export const ek = (e: GEdge) => `${e.a}-${e.b}`;
export const findEdge = (g: Graph, u: string, v: string) =>
  g.edges.find((e) => (e.a === u && e.b === v) || (!e.directed && e.a === v && e.b === u));
export const edgeKey = (g: Graph, u: string, v: string) => {
  const e = findEdge(g, u, v);
  return e ? ek(e) : `${u}-${v}`;
};
// Neighbours in the order the nodes are listed in the graph
export const neighbours = (g: Graph): Record<string, string[]> => {
  const order = g.nodes.map((n) => n.id);
  const out: Record<string, string[]> = {};
  g.nodes.forEach((n) => { out[n.id] = []; });
  g.edges.forEach((e) => {
    out[e.a].push(e.b);
    if (!e.directed) out[e.b].push(e.a);
  });
  Object.keys(out).forEach((k) => out[k].sort((x, y) => order.indexOf(x) - order.indexOf(y)));
  return out;
};
export const joinWords = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

// ──────────────────────────────────────────────────────────────────────────────
// Colours
// ──────────────────────────────────────────────────────────────────────────────
export const COLORS = {
  base: '#94a3b8',
  current: '#f59e0b',
  queued: '#38bdf8',
  done: '#10b981',
  source: '#8b5cf6',
  bad: '#ef4444',
  line: '#94a3b8',
};
const CHIP: Record<NonNullable<Chip['c']>, string> = {
  amber: '#f59e0b',
  green: '#10b981',
  red: '#ef4444',
  blue: '#38bdf8',
  grey: '#94a3b8',
};
const R = 14;

// ──────────────────────────────────────────────────────────────────────────────
// Drawing
// ──────────────────────────────────────────────────────────────────────────────
const arrowHead = (x1: number, y1: number, x2: number, y2: number, color: string, opacity: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const tx = x2 - ux * (R + 1);
  const ty = y2 - uy * (R + 1);
  const bx = tx - ux * 9;
  const by = ty - uy * 9;
  const px = -uy * 4.5;
  const py = ux * 4.5;
  return <polygon points={`${tx},${ty} ${bx + px},${by + py} ${bx - px},${by - py}`} fill={color} style={{ opacity, transition: 'opacity .3s, fill .3s' }} />;
};

const GraphSvg: React.FC<{ g: Graph; st: Step; base: string; maxW: number }> = ({ g, st, base, maxW }) => {
  const byId = Object.fromEntries(g.nodes.map((n) => [n.id, n]));
  return (
    <svg viewBox={`0 0 ${g.w} ${g.h}`} className="block w-full h-auto mx-auto" style={{ maxWidth: maxW }} role="img" aria-label="Graph diagram">
      {g.edges.map((e) => {
        const a = byId[e.a];
        const b = byId[e.b];
        const s = st.edges?.[ek(e)];
        const color = s === 'active' ? COLORS.current : s === 'tree' ? COLORS.done : s === 'reject' ? COLORS.bad : COLORS.line;
        const opacity = s === 'gone' ? 0.15 : 1;
        const width = s === 'tree' ? 3.5 : s === 'active' ? 3 : 1.8;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        return (
          <g key={ek(e)}>
            <path
              key={`${ek(e)}-${s ?? 'none'}`}
              d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
              pathLength={1}
              fill="none"
              stroke={color}
              strokeWidth={width}
              strokeLinecap="round"
              strokeDasharray={s === 'reject' ? '5 4' : s === 'active' || s === 'tree' ? 1 : undefined}
              style={{
                opacity,
                strokeDashoffset: s === 'active' || s === 'tree' ? 1 : 0,
                animation: s === 'active' || s === 'tree' ? 'gdDraw .45s ease-out forwards' : undefined,
                transition: 'opacity .3s',
              }}
            />
            {e.directed && arrowHead(a.x, a.y, b.x, b.y, color, opacity)}
            {e.w !== undefined && (
              <g style={{ opacity, transition: 'opacity .3s' }}>
                <rect x={mx - 9} y={my - 7} width={18} height={14} rx={7} className="fill-white dark:fill-[#0a0a0b]" stroke={s === 'tree' ? COLORS.done : s === 'active' ? COLORS.current : '#cbd5e1'} strokeWidth={1} />
                <text x={mx} y={my + 3.5} textAnchor="middle" fontSize="9.5" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">{e.w}</text>
              </g>
            )}
          </g>
        );
      })}

      {st.extraEdges?.map((e) => {
        const a = byId[e.a];
        const b = byId[e.b];
        return (
          <g key={`x-${e.a}-${e.b}`}>
            <path d={`M${a.x} ${a.y} L${b.x} ${b.y}`} fill="none" stroke={COLORS.done} strokeWidth={2.5} strokeDasharray="6 4" strokeLinecap="round" style={{ animation: 'gdFade .5s ease-out' }} />
            {arrowHead(a.x, a.y, b.x, b.y, COLORS.done, 1)}
          </g>
        );
      })}

      {g.nodes.map((n, i) => {
        const s = st.nodes?.[n.id];
        const fill = st.fills?.[n.id] ?? (s ? COLORS[s] : base);
        const badge = st.badges?.[n.id];
        return (
          <g key={n.id} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `gdPop .4s cubic-bezier(.3,1.4,.5,1) ${i * 0.05}s backwards` } as React.CSSProperties}>
            {s === 'current' && (
              <circle key={`pulse-${st.text}`} cx={n.x} cy={n.y} r={R} fill="none" stroke={COLORS.current} strokeWidth={2} style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'gdPulse 1s ease-out' } as React.CSSProperties} />
            )}
            <circle cx={n.x} cy={n.y} r={R} fill={fill} stroke={s === 'current' ? '#b45309' : 'none'} strokeWidth={2} style={{ transition: 'fill .3s, stroke .3s' }} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" pointerEvents="none">{n.id}</text>
            {n.name && <text x={n.x} y={n.y + R + 11} textAnchor="middle" fontSize="9" fontWeight="600" className="fill-slate-500 dark:fill-slate-400">{n.name}</text>}
            {badge !== undefined && (
              <text
                key={`${n.id}-${badge}`}
                x={n.x} y={n.y - R - 4} textAnchor="middle" fontSize="10" fontWeight="800"
                className="fill-indigo-700 dark:fill-indigo-300 stroke-white dark:stroke-[#0a0a0b]"
                strokeWidth={3} paintOrder="stroke"
                style={{ animation: 'gdFade .35s ease-out' }}
              >
                {badge}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

const MatrixView: React.FC<{ m: Matrix }> = ({ m }) => {
  const inList = (list: [number, number][] | undefined, i: number, j: number) => !!list && list.some(([a, b]) => a === i && b === j);
  return (
    <div className="inline-block">
      <div className="grid gap-1" style={{ gridTemplateColumns: `1.5rem repeat(${m.labels.length}, 1.75rem)` }}>
        <span />
        {m.labels.map((l, j) => (
          <span key={l} className={`text-center text-[11px] font-bold ${m.colHl === j ? 'text-amber-600' : 'text-slate-400'}`}>{l}</span>
        ))}
        {m.cells.map((row, i) => (
          <React.Fragment key={i}>
            <span className={`flex items-center justify-center text-[11px] font-bold ${m.rowHl === i ? 'text-amber-600' : 'text-slate-400'}`}>{m.labels[i]}</span>
            {row.map((v, j) => {
              const fresh = inList(m.fresh, i, j);
              const hl = inList(m.hl, i, j);
              const lit = m.rowHl === i || m.colHl === j;
              return (
                <span
                  key={`${i}-${j}-${v}-${fresh}`}
                  className={`flex h-7 items-center justify-center rounded-md text-xs font-bold border transition-colors ${
                    fresh ? 'text-white border-transparent' : hl ? 'text-white border-transparent' : v ? 'text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 bg-white dark:bg-white/10' : 'text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-700'
                  } ${lit && !fresh && !hl ? 'bg-amber-50 dark:bg-amber-900/20' : ''}`}
                  style={{ background: fresh ? COLORS.done : hl ? COLORS.current : undefined, animation: fresh || hl ? 'gdPop .35s ease-out' : undefined }}
                >
                  {v}
                </span>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const ChipView: React.FC<{ chip: Chip }> = ({ chip }) => (
  <span
    key={`${chip.t}-${chip.c}`}
    className="rounded-md px-2 py-0.5 text-xs font-bold text-white whitespace-nowrap"
    style={{ background: CHIP[chip.c ?? 'blue'], animation: 'gdPop .3s ease-out' }}
  >
    {chip.t}
  </span>
);

// ──────────────────────────────────────────────────────────────────────────────
// Player
// ──────────────────────────────────────────────────────────────────────────────
export const GraphPlayer: React.FC<{
  graph: Graph;
  steps: Step[];
  accent: string;
  playing: boolean;
  base?: string;
  stepMs?: number;
  compact?: boolean;
  maxW?: number;
}> = ({ graph, steps, accent, playing, base = COLORS.base, stepMs = 2600, compact = false, maxW = 460 }) => {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const idx = Math.min(step, steps.length - 1);
  const st = steps[idx];

  // Move on by itself, resting one extra beat on the last step before looping
  useEffect(() => {
    if (!playing || !auto) return;
    const iv = setInterval(() => setStep((s) => (s + 1) % (steps.length + 1)), compact ? 2000 : stepMs);
    return () => clearInterval(iv);
  }, [playing, auto, steps.length, stepMs, compact]);

  const go = (i: number) => { setAuto(false); setStep(Math.max(0, Math.min(steps.length - 1, i))); };

  const caption = (
    <div key={idx} className={`rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 text-slate-700 dark:text-slate-200 ${compact ? 'min-h-[3rem] text-xs' : 'min-h-[3.5rem] text-sm'}`} style={{ animation: 'gdFade .35s ease-out' }}>
      {!compact && <span className="font-bold mr-1.5" style={{ color: accent }}>Step {idx + 1}.</span>}
      {st.text}
    </div>
  );

  const panels = (
    <>
      {st.lists?.map((row) => (
        <div key={row.label} className="flex flex-wrap items-center gap-1.5 min-h-[1.75rem]">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mr-1">{row.label}</span>
          {row.items.length === 0 && <span className="text-xs text-slate-400 italic">empty</span>}
          {row.items.map((c, i) => <ChipView key={`${c.t}-${i}`} chip={c} />)}
        </div>
      ))}
      {st.matrix && <div className="overflow-x-auto py-1"><MatrixView m={st.matrix} /></div>}
    </>
  );

  const controls = !compact && (
    <div className="mt-3 flex items-center gap-2">
      <button onClick={() => go(idx - 1)} aria-label="Previous step" className="h-7 w-7 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform">◀</button>
      <button onClick={() => setAuto((a) => !a)} aria-label={auto ? 'Pause' : 'Play'} className="h-7 w-7 rounded-full text-[10px] text-white hover:scale-110 transition-transform" style={{ background: accent }}>{auto ? '❚❚' : '▶'}</button>
      <button onClick={() => go(idx + 1)} aria-label="Next step" className="h-7 w-7 rounded-full border border-slate-300 dark:border-slate-600 text-[10px] text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform">▶</button>
      <input type="range" min={0} max={steps.length - 1} value={idx} onChange={(e) => go(Number(e.target.value))} className="flex-1 h-1 cursor-pointer" style={{ accentColor: accent }} aria-label="Step" />
      <span className="text-[11px] tabular-nums text-slate-400 whitespace-nowrap">{idx + 1} / {steps.length}</span>
    </div>
  );

  if (compact) {
    return (
      <div>
        <GraphSvg g={graph} st={st} base={base} maxW={maxW} />
        <div className="mt-2">{caption}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-4 items-start">
        <GraphSvg g={graph} st={st} base={base} maxW={maxW} />
        <div className="space-y-2">
          {caption}
          {panels}
        </div>
      </div>
      {controls}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// Visibility gate + shared keyframes
// ──────────────────────────────────────────────────────────────────────────────
export const useOnScreen = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
};

export const GraphStyles: React.FC = () => (
  <style>{`
    @keyframes gdDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes gdFade { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
    @keyframes gdPop { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes gdPulse { 0% { opacity: .7; transform: scale(1); } 100% { opacity: 0; transform: scale(2); } }
  `}</style>
);

// A titled card used by every demo
export const DemoCard: React.FC<{ title: string; accent: string; children: React.ReactNode; tabs?: { names: string[]; value: number; onChange: (i: number) => void } }> = ({ title, accent, children, tabs }) => (
  <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-4">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <h4 className="text-sm font-bold" style={{ color: accent }}>{title}</h4>
      {tabs && (
        <div className="flex gap-1.5">
          {tabs.names.map((n, i) => (
            <button
              key={n}
              onClick={() => tabs.onChange(i)}
              className="rounded-full px-3 py-1 text-xs font-semibold border transition-colors"
              style={i === tabs.value ? { background: accent, borderColor: accent, color: '#fff' } : { borderColor: '#cbd5e1', color: '#64748b' }}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
    {children}
  </div>
);
