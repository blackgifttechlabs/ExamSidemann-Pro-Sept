import React, { useEffect, useReducer, useRef, useState } from 'react';

type N = { id: string; x: number; y: number; t: string; parent?: string; late?: boolean };
type Step = {
  text: string;
  hl?: string[];                       // trail of visited nodes; the last one is "current"
  done?: string[];                     // already visited (traversals)
  mark?: string[];                     // about to be removed / not found (red)
  good?: string[];                     // success (green)
  ghost?: string[];                    // empty slot drawn dashed
  show?: string[];                     // late nodes that are now real
  hide?: string[];                     // nodes that fade out
  pos?: Record<string, [number, number]>;
  parents?: Record<string, string | null>;
  out?: string[];                      // traversal output so far
};
type Scene = { name: string; nodes: N[]; steps: Step[]; stepMs?: number };
type Demo = { title: string; accent: string; definition: string; simple: string; scenes: Scene[] };

const R = 12;
const tree = (...extra: N[]): N[] => [
  { id: 'n8', x: 120, y: 20, t: '8' },
  { id: 'n3', x: 70, y: 62, t: '3', parent: 'n8' },
  { id: 'n10', x: 170, y: 62, t: '10', parent: 'n8' },
  { id: 'n1', x: 45, y: 108, t: '1', parent: 'n3' },
  { id: 'n6', x: 95, y: 108, t: '6', parent: 'n3' },
  { id: 'n14', x: 195, y: 108, t: '14', parent: 'n10' },
  ...extra,
];
const label = (id: string) => tree().find((n) => n.id === id)!.t;

const traversal = (name: string, rule: string, order: string[], texts: string[], ending: string): Scene => ({
  name,
  stepMs: 2300,
  nodes: tree(),
  steps: [
    { text: rule, out: [] },
    ...order.map((id, i) => ({
      text: texts[i],
      hl: [id],
      done: order.slice(0, i),
      out: order.slice(0, i + 1).map(label),
    })),
    { text: ending, done: order, out: order.map(label) },
  ],
});

const DEMOS: Demo[] = [
  {
    title: 'Insertion', accent: '#3b82f6',
    definition: 'Start at the root; go left if the new value is less, right if it is greater. Insert at the first null spot.',
    simple: 'Like asking "smaller or bigger?" at every junction to find the right house on a street. When you reach an empty spot, that is where the new value lives.',
    scenes: [{
      name: 'Insert 5',
      nodes: tree({ id: 'n5', x: 80, y: 150, t: '5', parent: 'n6', late: true }),
      steps: [
        { text: 'We want to insert 5. Start at the root, 8.', hl: ['n8'] },
        { text: '5 is less than 8, so go left. Now at 3.', hl: ['n8', 'n3'] },
        { text: '5 is greater than 3, so go right. Now at 6.', hl: ['n8', 'n3', 'n6'] },
        { text: '5 is less than 6, so go left. That spot is empty (null).', hl: ['n8', 'n3', 'n6'], ghost: ['n5'] },
        { text: 'Place 5 in the empty spot. Done!', hl: ['n8', 'n3', 'n6', 'n5'], show: ['n5'], good: ['n5'] },
      ],
    }],
  },
  {
    title: 'Deletion', accent: '#10b981',
    definition: 'Three cases: leaf (remove), one child (replace with child), two children (replace with inorder successor, then delete successor).',
    simple: 'Removing a node must not break the "small on the left, big on the right" rule. A leaf just goes. With one child, that child steps up. With two children, borrow the next-bigger value from the right side.',
    scenes: [
      {
        name: 'Leaf',
        nodes: tree(),
        steps: [
          { text: 'Delete 14. First find it: start at 8.', hl: ['n8'] },
          { text: '14 is greater than 8, so go right.', hl: ['n8', 'n10'] },
          { text: '14 is greater than 10, so go right. Found 14.', hl: ['n8', 'n10', 'n14'] },
          { text: '14 is a leaf (no children), so we can simply remove it.', hl: ['n14'], mark: ['n14'] },
          { text: 'Removed. Nothing else needs to change.', hide: ['n14'] },
        ],
      },
      {
        name: 'One child',
        nodes: tree(),
        steps: [
          { text: 'Delete 10. Start at 8.', hl: ['n8'] },
          { text: '10 is greater than 8, so go right. Found 10.', hl: ['n8', 'n10'] },
          { text: '10 has only one child (14).', hl: ['n10'], mark: ['n10'] },
          { text: 'Remove 10 and lift its child 14 into its place.', hide: ['n10'], pos: { n14: [170, 62] }, parents: { n14: 'n8' } },
          { text: 'The tree is still a valid BST.', hide: ['n10'], pos: { n14: [170, 62] }, parents: { n14: 'n8' }, good: ['n14'] },
        ],
      },
      {
        name: 'Two children',
        nodes: tree({ id: 'n9', x: 145, y: 108, t: '9', parent: 'n10' }),
        steps: [
          { text: 'Delete the root, 8. It has two children, so it is trickier.', hl: ['n8'], mark: ['n8'] },
          { text: 'Plan: use the inorder successor, the smallest value on the right side. Go right.', hl: ['n8', 'n10'] },
          { text: 'Keep going left until you cannot. 9 is the smallest on this side.', hl: ['n8', 'n10', 'n9'] },
          { text: '9 is the successor. It is just bigger than everything on the left.', hl: ['n9'], good: ['n9'] },
          { text: 'Move 9 up into the root\'s place and remove 8.', hide: ['n8'], pos: { n9: [120, 20] }, parents: { n9: null, n3: 'n9', n10: 'n9' }, good: ['n9'] },
          { text: 'Still a valid BST: 3 is less than 9, and 10 is greater than 9.', hide: ['n8'], pos: { n9: [120, 20] }, parents: { n9: null, n3: 'n9', n10: 'n9' }, good: ['n9'] },
        ],
      },
    ],
  },
  {
    title: 'Searching', accent: '#f97316',
    definition: 'Compare the target with the current node; go left if smaller, right if larger. Repeat until found or null.',
    simple: 'Every comparison throws away half of the tree. If you fall off the bottom (null), the value is not there.',
    scenes: [
      {
        name: 'Found',
        nodes: tree(),
        steps: [
          { text: 'Look for 6. Compare it with the root, 8.', hl: ['n8'] },
          { text: '6 is less than 8, so go left.', hl: ['n8', 'n3'] },
          { text: '6 is greater than 3, so go right.', hl: ['n8', 'n3', 'n6'] },
          { text: '6 equals 6. Found it in just 3 steps!', hl: ['n8', 'n3', 'n6'], good: ['n6'] },
        ],
      },
      {
        name: 'Not found',
        nodes: tree({ id: 'n7', x: 120, y: 150, t: '7', parent: 'n6', late: true }),
        steps: [
          { text: 'Look for 7. Compare it with the root, 8.', hl: ['n8'] },
          { text: '7 is less than 8, so go left.', hl: ['n8', 'n3'] },
          { text: '7 is greater than 3, so go right.', hl: ['n8', 'n3', 'n6'] },
          { text: '7 is greater than 6, so go right. But there is nothing there (null).', hl: ['n8', 'n3', 'n6'], ghost: ['n7'], mark: ['n7'] },
          { text: 'We fell off the tree, so 7 is not in it.', hl: ['n8', 'n3', 'n6'], ghost: ['n7'], mark: ['n7'] },
        ],
      },
    ],
  },
  {
    title: 'Traversals', accent: '#a855f7',
    definition: 'Inorder (Left, Root, Right) yields sorted order in a BST. Preorder (Root, Left, Right) is used for copying. Postorder (Left, Right, Root) is used for deletion.',
    simple: 'A traversal visits every node exactly once. The only difference is when you say the node\'s name: before its children (preorder), between them (inorder) or after them (postorder).',
    scenes: [
      traversal('Inorder', 'Inorder = Left, Root, Right. Finish the left side before saying the root.', ['n1', 'n3', 'n6', 'n8', 'n10', 'n14'], [
        'Go as far left as possible. 1 has no left child, so visit 1.',
        'Left side of 3 is done, so visit 3.',
        'Now 3\'s right side. 6 has no children, so visit 6.',
        'Everything left of 8 is done, so visit 8.',
        'Now 8\'s right side. 10 has nothing on its left, so visit 10.',
        'Finally visit 14.',
      ], 'The output is sorted: 1 3 6 8 10 14. That is why inorder is so useful on a BST.'),
      traversal('Preorder', 'Preorder = Root, Left, Right. Say the root first, then explore.', ['n8', 'n3', 'n1', 'n6', 'n10', 'n14'], [
        'Root first: visit 8 straight away.',
        'Go left and visit 3 before its children.',
        'Then 3\'s left child: visit 1.',
        'Then 3\'s right child: visit 6.',
        'The left side is done. Go right and visit 10.',
        'Finally visit 14.',
      ], 'A parent always comes before its children, so this order is perfect for copying a tree.'),
      traversal('Postorder', 'Postorder = Left, Right, Root. Children first, parent last.', ['n1', 'n6', 'n3', 'n14', 'n10', 'n8'], [
        'Start at the bottom left: visit 1.',
        'Then its sibling: visit 6.',
        'Both children of 3 are done, so visit 3.',
        'Down the right side: visit 14.',
        'Its child is done, so visit 10.',
        'The root, 8, comes last.',
      ], 'Children always come before their parent, so this order is safe for deleting a tree.'),
    ],
  },
];

const AMBER = '#f59e0b';
const GREEN = '#10b981';
const RED = '#ef4444';

const ScenePlayer: React.FC<{ scene: Scene; accent: string; playing: boolean }> = ({ scene, accent, playing }) => {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [, force] = useReducer((x: number) => x + 1, 0);
  const cur = useRef<Record<string, [number, number]>>({});

  const idx = Math.min(step, scene.steps.length - 1);
  const st = scene.steps[idx];
  const byId = Object.fromEntries(scene.nodes.map((n) => [n.id, n]));
  const target = (n: N): [number, number] => st.pos?.[n.id] ?? [n.x, n.y];
  scene.nodes.forEach((n) => { if (!cur.current[n.id]) cur.current[n.id] = [...target(n)] as [number, number]; });

  // Advance automatically, holding the last step for one extra beat before looping
  useEffect(() => {
    if (!playing || !auto) return;
    const iv = setInterval(() => setStep((s) => (s + 1) % (scene.steps.length + 1)), scene.stepMs ?? 2200);
    return () => clearInterval(iv);
  }, [playing, auto, scene]);

  // Glide nodes toward their target positions so edges follow smoothly
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      let moving = false;
      scene.nodes.forEach((n) => {
        const t = target(n);
        const c = cur.current[n.id];
        const dx = t[0] - c[0];
        const dy = t[1] - c[1];
        if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) { c[0] += dx * 0.12; c[1] += dy * 0.12; moving = true; } else { c[0] = t[0]; c[1] = t[1]; }
      });
      force();
      if (moving) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const has = (list: string[] | undefined, id: string) => !!list && list.includes(id);
  const isGhost = (n: N) => has(st.ghost, n.id) && !has(st.show, n.id);
  const visible = (n: N) => !has(st.hide, n.id) && (!n.late || has(st.show, n.id) || has(st.ghost, n.id));
  const parentOf = (n: N) => (st.parents && n.id in st.parents ? st.parents[n.id] : n.parent) ?? undefined;
  const trail = st.hl ?? [];
  const current = trail[trail.length - 1];

  return (
    <div>
      <svg viewBox="0 0 240 170" className="block w-full max-w-[280px] h-auto mx-auto" role="img" aria-label="Tree operation diagram">
        {scene.nodes.map((n) => {
          const pid = parentOf(n);
          const p = pid ? byId[pid] : undefined;
          if (!p) return null;
          const a = cur.current[p.id];
          const b = cur.current[n.id];
          const my = (a[1] + b[1]) / 2;
          const on = has(trail, n.id) && has(trail, p.id);
          const show = visible(n) && visible(p);
          return (
            <path
              key={`e-${n.id}`}
              d={`M${a[0]} ${a[1] + R} C${a[0]} ${my}, ${b[0]} ${my}, ${b[0]} ${b[1] - R}`}
              fill="none"
              stroke={isGhost(n) ? (has(st.mark, n.id) ? RED : '#94a3b8') : on ? AMBER : '#94a3b8'}
              strokeWidth={on ? 2.5 : 1.5}
              strokeLinecap="round"
              strokeDasharray={isGhost(n) ? '3 3' : undefined}
              style={{ opacity: show ? 1 : 0, transition: 'opacity .35s, stroke .3s' }}
            />
          );
        })}
        {scene.nodes.map((n) => {
          const [x, y] = cur.current[n.id];
          const ghost = isGhost(n);
          const fill = has(st.mark, n.id) ? RED : has(st.good, n.id) ? GREEN : n.id === current ? AMBER : has(st.done, n.id) ? GREEN : accent;
          return (
            <g key={n.id} style={{ opacity: visible(n) ? 1 : 0, transition: 'opacity .35s' }}>
              <circle
                cx={x} cy={y} r={R}
                fill={ghost ? 'none' : fill}
                stroke={ghost ? (has(st.mark, n.id) ? RED : '#94a3b8') : has(trail, n.id) ? AMBER : 'none'}
                strokeWidth={ghost ? 1.5 : 3}
                strokeDasharray={ghost ? '3 3' : undefined}
                style={{ transition: 'fill .3s, stroke .3s' }}
              />
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill={ghost ? (has(st.mark, n.id) ? RED : '#94a3b8') : '#fff'} pointerEvents="none">
                {ghost ? '?' : n.t}
              </text>
            </g>
          );
        })}
      </svg>

      {st.out && (
        <div className="flex flex-wrap items-center gap-1.5 min-h-[1.75rem] mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Output</span>
          {st.out.map((v, i) => (
            <span key={`${v}-${i}`} className="rounded-md px-2 py-0.5 text-xs font-bold text-white" style={{ background: GREEN, animation: 'toPop .3s ease-out' }}>{v}</span>
          ))}
        </div>
      )}

      <div key={idx} className="rounded-lg bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 px-3 py-2 min-h-[2.75rem] text-xs text-slate-700 dark:text-slate-200" style={{ animation: 'toFade .35s ease-out' }}>
        <span className="font-bold mr-1.5" style={{ color: accent }}>Step {idx + 1}.</span>{st.text}
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setAuto((a) => !a)}
          aria-label={auto ? 'Pause' : 'Play'}
          className="h-6 w-6 rounded-full border border-slate-300 dark:border-slate-600 text-[9px] text-slate-600 dark:text-slate-300 flex items-center justify-center hover:scale-110 transition-transform"
        >
          {auto ? '❚❚' : '▶'}
        </button>
        <div className="flex items-center gap-1">
          {scene.steps.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to step ${i + 1}`}
              onClick={() => { setAuto(false); setStep(i); }}
              className="h-1.5 rounded-full transition-all"
              style={{ width: i === idx ? 18 : 8, background: i === idx ? accent : '#cbd5e1' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DemoCard: React.FC<{ d: Demo; playing: boolean }> = ({ d, playing }) => {
  const [sceneIdx, setSceneIdx] = useState(0);
  return (
    <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-4">
      <h4 className="text-sm font-bold" style={{ color: d.accent }}>{d.title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{d.definition}</p>
      <p className="text-sm text-slate-800 dark:text-slate-200 mt-2 mb-3"><strong>In simple words:</strong> {d.simple}</p>

      {d.scenes.length > 1 ? (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {d.scenes.map((s, i) => (
            <button
              key={s.name}
              onClick={() => setSceneIdx(i)}
              className="rounded-full px-3 py-1 text-xs font-semibold border transition-colors"
              style={i === sceneIdx ? { background: d.accent, borderColor: d.accent, color: '#fff' } : { borderColor: '#cbd5e1', color: '#64748b' }}
            >
              {s.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">{d.scenes[0].name}</div>
      )}

      <ScenePlayer key={sceneIdx} scene={d.scenes[sceneIdx]} accent={d.accent} playing={playing} />
    </div>
  );
};

export const TreeOperationsDemo: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <style>{`
        @keyframes toFade { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
        @keyframes toPop { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
      `}</style>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {DEMOS.map((d) => <DemoCard key={d.title} d={d} playing={visible} />)}
      </div>
    </div>
  );
};
