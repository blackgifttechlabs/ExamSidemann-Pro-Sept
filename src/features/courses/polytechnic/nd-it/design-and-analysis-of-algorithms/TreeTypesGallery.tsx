import React, { useEffect, useRef, useState } from 'react';

type N = {
  id: string; x: number; y: number; t: string; parent?: string;
  color?: string; w?: number; ghost?: boolean; sub?: string; end?: boolean;
};
type Diagram = { title: string; caption: string; accent: string; nodes: N[]; trace: string[]; how: string; h?: number };

const BLACK = '#1e293b';
const RED = '#ef4444';

const DIAGRAMS: Diagram[] = [
  {
    title: 'Binary Tree', accent: '#6366f1', caption: 'Each node has at most two children: left and right.',
    nodes: [
      { id: 'a', x: 120, y: 20, t: 'A' },
      { id: 'b', x: 70, y: 62, t: 'B', parent: 'a' }, { id: 'c', x: 170, y: 62, t: 'C', parent: 'a' },
      { id: 'd', x: 45, y: 108, t: 'D', parent: 'b' }, { id: 'e', x: 95, y: 108, t: 'E', parent: 'b' },
      { id: 'f', x: 195, y: 108, t: 'F', parent: 'c' },
    ],
    trace: ['a', 'b', 'e'],
    how: 'Think of a family where every parent can have at most two kids, a left one and a right one. Some parents have two kids, some have one, some have none.',
  },
  {
    title: 'Binary Search Tree', accent: '#0ea5e9', caption: 'Left < node < right. Watch the search for 6.',
    nodes: [
      { id: 'n8', x: 120, y: 20, t: '8' },
      { id: 'n3', x: 70, y: 62, t: '3', parent: 'n8' }, { id: 'n10', x: 170, y: 62, t: '10', parent: 'n8' },
      { id: 'n1', x: 45, y: 108, t: '1', parent: 'n3' }, { id: 'n6', x: 95, y: 108, t: '6', parent: 'n3' },
      { id: 'n14', x: 195, y: 108, t: '14', parent: 'n10' },
    ],
    trace: ['n8', 'n3', 'n6'],
    how: 'Smaller numbers go left, bigger numbers go right. To find 6: start at 8, 6 is smaller so go left to 3, 6 is bigger so go right. Found it in 3 steps instead of checking every number.',
  },
  {
    title: 'Complete Binary Tree', accent: '#14b8a6', caption: 'Every level is full except the last, filled left to right.',
    nodes: [
      { id: '1', x: 120, y: 20, t: '1' },
      { id: '2', x: 70, y: 62, t: '2', parent: '1' }, { id: '3', x: 170, y: 62, t: '3', parent: '1' },
      { id: '4', x: 45, y: 108, t: '4', parent: '2' }, { id: '5', x: 95, y: 108, t: '5', parent: '2' },
      { id: '6', x: 145, y: 108, t: '6', parent: '3' }, { id: '7', x: 195, y: 108, t: '', parent: '3', ghost: true },
    ],
    trace: ['1', '2', '3', '4', '5', '6'],
    how: 'Like seating people in a cinema: fill each row completely before starting the next, and always sit from the left. No gaps are allowed in the middle, only at the end of the last row.',
  },
  {
    title: 'Full Binary Tree', accent: '#f59e0b', caption: 'Every node has either 0 or 2 children, never 1.',
    nodes: [
      { id: 'a', x: 120, y: 20, t: 'A' },
      { id: 'b', x: 70, y: 62, t: 'B', parent: 'a' }, { id: 'c', x: 170, y: 62, t: 'C', parent: 'a' },
      { id: 'd', x: 45, y: 108, t: 'D', parent: 'b' }, { id: 'e', x: 95, y: 108, t: 'E', parent: 'b' },
    ],
    trace: ['a', 'b', 'd', 'e', 'c'],
    how: 'A node either has no children or exactly two. It is never left with just one child, like a sports bracket where every match has two teams.',
  },
  {
    title: 'Perfect Binary Tree', accent: '#8b5cf6', caption: 'All internal nodes have 2 children; all leaves share one level.',
    nodes: [
      { id: 'a', x: 120, y: 20, t: '1' },
      { id: 'b', x: 70, y: 62, t: '2', parent: 'a' }, { id: 'c', x: 170, y: 62, t: '3', parent: 'a' },
      { id: 'd', x: 45, y: 108, t: '4', parent: 'b' }, { id: 'e', x: 95, y: 108, t: '5', parent: 'b' },
      { id: 'f', x: 145, y: 108, t: '6', parent: 'c' }, { id: 'g', x: 195, y: 108, t: '7', parent: 'c' },
    ],
    trace: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    how: 'A perfectly neat triangle. Every row is completely full and all the leaves are on the bottom row. A tree with h levels holds exactly 2^h - 1 nodes.',
  },
  {
    title: 'AVL Tree', accent: '#10b981', caption: 'Balance factor (bf) of every node stays between -1 and 1.',
    nodes: [
      { id: 'n30', x: 120, y: 24, t: '30', sub: 'bf 0' },
      { id: 'n20', x: 70, y: 66, t: '20', parent: 'n30', sub: 'bf 0' }, { id: 'n40', x: 170, y: 66, t: '40', parent: 'n30', sub: 'bf -1' },
      { id: 'n10', x: 45, y: 112, t: '10', parent: 'n20' }, { id: 'n25', x: 95, y: 112, t: '25', parent: 'n20' },
      { id: 'n50', x: 195, y: 112, t: '50', parent: 'n40' },
    ],
    trace: ['n30', 'n40', 'n50'],
    how: 'A BST that keeps itself tidy. The bf number is how much taller the left side is than the right. If any bf goes beyond -1 or 1, the tree rotates nodes to fix the lean, so searches stay fast.',
  },
  {
    title: 'Red-Black Tree', accent: '#ef4444', caption: 'Node colors keep the tree roughly balanced.',
    nodes: [
      { id: 'a', x: 120, y: 20, t: '10', color: BLACK },
      { id: 'b', x: 70, y: 62, t: '5', parent: 'a', color: RED }, { id: 'c', x: 170, y: 62, t: '15', parent: 'a', color: RED },
      { id: 'd', x: 45, y: 108, t: '3', parent: 'b', color: BLACK }, { id: 'e', x: 95, y: 108, t: '7', parent: 'b', color: BLACK },
      { id: 'f', x: 145, y: 108, t: '12', parent: 'c', color: BLACK }, { id: 'g', x: 195, y: 108, t: '20', parent: 'c', color: BLACK },
    ],
    trace: ['a', 'c', 'f'],
    how: 'Every node is red or black, and a few simple rules (no two reds in a row, same number of blacks on every path) stop it from leaning too far. When a rule breaks, it recolors or rotates nodes.',
  },
  {
    title: 'B-Tree', accent: '#3b82f6', caption: 'Nodes hold many keys and many children; great for disks.',
    nodes: [
      { id: 'r', x: 120, y: 24, t: '10 | 20', w: 64 },
      { id: 'l', x: 45, y: 92, t: '3 | 7', w: 56, parent: 'r' },
      { id: 'm', x: 120, y: 92, t: '12 | 15', w: 64, parent: 'r' },
      { id: 'rt', x: 195, y: 92, t: '25 | 30', w: 64, parent: 'r' },
    ],
    trace: ['r', 'm'],
    how: 'Each box holds several sorted keys. To find 12: it is bigger than 10 but smaller than 20, so take the middle branch. Fewer, fatter nodes mean fewer disk reads, which is why databases use it.',
  },
  {
    title: 'Heap (Max-Heap)', accent: '#f97316', caption: 'Every parent is greater than or equal to its children.',
    nodes: [
      { id: 'a', x: 120, y: 20, t: '90' },
      { id: 'b', x: 70, y: 62, t: '70', parent: 'a' }, { id: 'c', x: 170, y: 62, t: '80', parent: 'a' },
      { id: 'd', x: 45, y: 108, t: '40', parent: 'b' }, { id: 'e', x: 95, y: 108, t: '60', parent: 'b' },
      { id: 'f', x: 145, y: 108, t: '50', parent: 'c' }, { id: 'g', x: 195, y: 108, t: '30', parent: 'c' },
    ],
    trace: ['a', 'b', 'e'],
    how: 'The biggest value is always at the top, like the boss. Adding a value puts it at the bottom, then it swaps upward until it is no bigger than its parent. Removing the top is how you get the maximum fast.',
  },
  {
    title: 'Trie', accent: '#ec4899', caption: 'Each node is a letter. Words: cat, car, dog.',
    h: 160,
    nodes: [
      { id: 'root', x: 120, y: 18, t: '∅' },
      { id: 'c', x: 70, y: 54, t: 'c', parent: 'root' }, { id: 'd', x: 170, y: 54, t: 'd', parent: 'root' },
      { id: 'a', x: 70, y: 90, t: 'a', parent: 'c' }, { id: 'o', x: 170, y: 90, t: 'o', parent: 'd' },
      { id: 't', x: 45, y: 128, t: 't', parent: 'a', end: true }, { id: 'r', x: 95, y: 128, t: 'r', parent: 'a', end: true },
      { id: 'g', x: 170, y: 128, t: 'g', parent: 'o', end: true },
    ],
    trace: ['root', 'c', 'a', 't'],
    how: 'Spell a word by walking down the letters. c, a, t leads to the word cat. Words that start the same, like cat and car, share the same path. The ringed letters mark where a word ends.',
  },
];

const R = 12;
const LEVEL_DELAY = 0.35;

const DiagramCard: React.FC<{ d: Diagram; run: number; playing: boolean }> = ({ d, run, playing }) => {
  const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
  const level = (n: N): number => (n.parent ? 1 + level(byId[n.parent]) : 0);
  const revealMs = (Math.max(...d.nodes.map(level)) * LEVEL_DELAY + 1) * 1000;

  // Step through the trace after the tree has drawn itself
  const [step, setStep] = useState(-1);
  useEffect(() => {
    setStep(-1);
    if (!playing) return;
    let i = -1;
    let iv: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        i = i >= d.trace.length + 1 ? 0 : i + 1;
        setStep(i);
      }, 650);
    }, revealMs);
    return () => { clearTimeout(start); clearInterval(iv); };
  }, [playing, run, d.trace.length, revealMs]);

  const active = new Set(d.trace.slice(0, step + 1));

  return (
    <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-4">
      <h4 className="text-sm font-bold" style={{ color: d.accent }}>{d.title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 min-h-[2rem]">{d.caption}</p>
      {playing && (
        <svg key={run} viewBox={`0 0 240 ${d.h ?? 140}`} className="block w-full h-auto" role="img" aria-label={`${d.title} diagram`}>
          {d.nodes.filter((n) => n.parent).map((n) => {
            const p = byId[n.parent!];
            const on = active.has(n.id) && active.has(p.id);
            const my = (p.y + n.y) / 2;
            return (
              <path
                key={`e-${n.id}`}
                d={`M${p.x} ${p.y + R} C${p.x} ${my}, ${n.x} ${my}, ${n.x} ${n.y - R}`}
                pathLength={1}
                fill="none"
                stroke={on ? '#f59e0b' : '#94a3b8'}
                strokeWidth={on ? 2.5 : 1.5}
                strokeLinecap="round"
                strokeDasharray={n.ghost ? '0.08 0.06' : 1}
                style={{
                  strokeDashoffset: n.ghost ? 0 : 1,
                  opacity: n.ghost ? 0 : 1,
                  animation: `${n.ghost ? 'ttFade' : 'ttDraw'} .5s ease-out ${level(n) * LEVEL_DELAY - 0.2}s forwards`,
                  transition: 'stroke .25s, stroke-width .25s',
                }}
              />
            );
          })}
          {d.nodes.map((n) => {
            const on = active.has(n.id);
            const fill = n.color ?? d.accent;
            const w = n.w ?? R * 2;
            return (
              <g
                key={n.id}
                style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0, animation: `ttPop .45s cubic-bezier(.3,1.4,.5,1) ${level(n) * LEVEL_DELAY}s forwards` } as React.CSSProperties}
              >
                {n.w ? (
                  <rect x={n.x - w / 2} y={n.y - R} width={w} height={R * 2} rx={6} fill={fill} stroke={on ? '#f59e0b' : 'none'} strokeWidth={3} style={{ transition: 'stroke .25s' }} />
                ) : (
                  <circle
                    cx={n.x} cy={n.y} r={R}
                    fill={n.ghost ? 'none' : fill}
                    stroke={on ? '#f59e0b' : n.ghost ? '#94a3b8' : n.end ? '#facc15' : 'none'}
                    strokeWidth={on ? 3 : n.end ? 2.5 : 1.5}
                    strokeDasharray={n.ghost ? '3 3' : undefined}
                    style={{ transition: 'stroke .25s' }}
                  />
                )}
                <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff" pointerEvents="none">{n.t}</text>
                {n.sub && (
                  <text x={n.x + R + 3} y={n.y - R + 2} fontSize="7.5" fontWeight="600" className="fill-emerald-600 dark:fill-emerald-400" pointerEvents="none">{n.sub}</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
      <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        <span className="font-bold" style={{ color: d.accent }}>How it works: </span>{d.how}
      </p>
    </div>
  );
};

export const TreeTypesGallery: React.FC = () => {
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <style>{`
        @keyframes ttDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes ttFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ttPop { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
      <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
        <span>Each tree draws itself, then a highlighted walk shows how it behaves.</span>
        <button onClick={() => setRun((r) => r + 1)} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Replay</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {DIAGRAMS.map((d) => <DiagramCard key={d.title} d={d} run={run} playing={visible} />)}
      </div>
    </div>
  );
};
