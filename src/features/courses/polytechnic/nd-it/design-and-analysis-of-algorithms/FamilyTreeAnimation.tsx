import React, { useEffect, useRef, useState } from 'react';

type TreeNode = { id: string; label: string; role: 'Root' | 'Internal node' | 'Leaf'; x: number; y: number; parent?: string; level: number };

const NODES: TreeNode[] = [
  { id: 'gp', label: 'Grandparent', role: 'Root', x: 200, y: 32, level: 0 },
  { id: 'p1', label: 'Parent A', role: 'Internal node', x: 105, y: 112, parent: 'gp', level: 1 },
  { id: 'p2', label: 'Parent B', role: 'Internal node', x: 295, y: 112, parent: 'gp', level: 1 },
  { id: 'c1', label: 'Child 1', role: 'Leaf', x: 55, y: 192, parent: 'p1', level: 2 },
  { id: 'c2', label: 'Child 2', role: 'Leaf', x: 155, y: 192, parent: 'p1', level: 2 },
  { id: 'c3', label: 'Child 3', role: 'Leaf', x: 245, y: 192, parent: 'p2', level: 2 },
  { id: 'c4', label: 'Child 4', role: 'Leaf', x: 345, y: 192, parent: 'p2', level: 2 },
];

const COLORS: Record<TreeNode['role'], string> = {
  Root: '#f59e0b',
  'Internal node': '#6366f1',
  Leaf: '#10b981',
};

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const LEVEL_DELAY = 0.8; // seconds between levels

export const FamilyTreeAnimation: React.FC = () => {
  const [run, setRun] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Start the animation when scrolled into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Path from hovered node up to the root
  const active = new Set<string>();
  for (let n: TreeNode | undefined = hover ? byId[hover] : undefined; n; n = n.parent ? byId[n.parent] : undefined) active.add(n.id);
  const dim = (id: string) => (hover && !active.has(id) ? 0.25 : 1);

  return (
    <div ref={ref} className="mt-4 rounded-xl bg-white/70 dark:bg-black/30 border border-amber-200/70 dark:border-amber-800/50 p-3">
      <style>{`
        @keyframes ftDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes ftPop { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes ftPulse { 0% { r: 16; opacity: .5; } 100% { r: 28; opacity: 0; } }
      `}</style>

      {visible && (
        <svg key={run} viewBox="0 0 430 232" className="block w-full h-auto mx-auto max-h-[40vh]" role="img" aria-label="Animated family tree showing root, internal nodes and leaves">
          {NODES.filter((n) => n.parent).map((n) => {
            const p = byId[n.parent!];
            const isActive = active.has(n.id) && active.has(p.id);
            return (
              <path
                key={n.id}
                d={`M${p.x} ${p.y + 16} C${p.x} ${(p.y + n.y) / 2}, ${n.x} ${(p.y + n.y) / 2}, ${n.x} ${n.y - 16}`}
                pathLength={1}
                fill="none"
                stroke={isActive ? '#f59e0b' : '#94a3b8'}
                strokeWidth={isActive ? 3 : 1.75}
                strokeLinecap="round"
                strokeDasharray={1}
                style={{
                  strokeDashoffset: 1,
                  animation: `ftDraw .6s ease-out ${n.level * LEVEL_DELAY - 0.3}s forwards`,
                  opacity: hover ? (isActive ? 1 : 0.2) : 1,
                  transition: 'stroke .25s, stroke-width .25s, opacity .25s',
                }}
              />
            );
          })}

          {NODES.map((n) => {
            const color = COLORS[n.role];
            const delay = n.level * LEVEL_DELAY;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover((h) => (h === n.id ? null : n.id))}
                style={{ cursor: 'pointer', opacity: dim(n.id), transition: 'opacity .25s' }}
              >
                <g style={{ transformOrigin: `${n.x}px ${n.y}px`, transformBox: 'view-box' as any, opacity: 0, animation: `ftPop .5s cubic-bezier(.3,1.4,.5,1) ${delay}s forwards` }}>
                  <circle cx={n.x} cy={n.y} r={16} fill="none" stroke={color} strokeWidth={2} style={{ animation: `ftPulse 1.2s ease-out ${delay + 0.4}s 1 both` }} />
                  <circle cx={n.x} cy={n.y} r={16} fill={color} />
                  <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" pointerEvents="none">
                    {n.role === 'Root' ? '★' : n.role === 'Leaf' ? '●' : '◆'}
                  </text>
                  <text x={n.role === 'Leaf' ? n.x : n.x + 23} y={n.role === 'Leaf' ? n.y + 31 : n.y + 4} textAnchor={n.role === 'Leaf' ? 'middle' : 'start'} fontSize="10" fontWeight="600" className="fill-slate-700 dark:fill-slate-200" pointerEvents="none">
                    {n.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap gap-3">
          {(Object.keys(COLORS) as TreeNode['role'][]).map((r) => (
            <span key={r} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[r] }} /> {r}
            </span>
          ))}
        </div>
        <span className="flex items-center gap-3">
          <span className="hidden sm:inline">Hover a node to trace its path to the root</span>
          <button onClick={() => { setHover(null); setRun((r) => r + 1); }} className="font-semibold text-amber-700 dark:text-amber-400 hover:underline">
            Replay
          </button>
        </span>
      </div>
    </div>
  );
};
