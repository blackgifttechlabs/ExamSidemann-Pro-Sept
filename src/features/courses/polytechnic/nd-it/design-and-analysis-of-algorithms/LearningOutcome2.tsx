import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import { HanoiThreeWalkthrough } from './HanoiThreeWalkthrough';
import {
  Code,
  Brain,
  Table,
  AlertTriangle,
  List,
  GraduationCap,
  Lightbulb,
  Search,
  X,
  BookOpen,
  Copy,
  Check,
  Layers,
  Workflow,
  User,
  Users,
  Megaphone,
  MessageCircle,
  Pause,
  Play,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'iteration', label: 'Iteration' },
  { id: 'vs-iteration', label: 'Recursion vs Iteration' },
  { id: 'types', label: 'Types' },
  { id: 'critique', label: 'Critique' },
  { id: 'laws', label: 'Laws' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// RECURSION TREE DIAGRAMS — fib-style nodes, page bg, mobile-first portrait layout
// ──────────────────────────────────────────────────────────────────────────────
type TreeNodeDef = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: 'root' | 'internal' | 'base' | 'role';
  result?: string;
};

type TreeEdgeDef = { from: string; to: string; highlight?: boolean };

const NODE_STYLE: Record<TreeNodeDef['kind'], { fill: string; stroke: string; text: string }> = {
  root: { fill: '#fb923c', stroke: '#ea580c', text: '#ffffff' },
  internal: { fill: '#eef2ff', stroke: '#6366f1', text: '#3730a3' },
  base: { fill: '#34d399', stroke: '#059669', text: '#ffffff' },
  role: { fill: '#e0e7ff', stroke: '#6366f1', text: '#3730a3' },
};

const RecursionTreeSvg: React.FC<{
  nodes: TreeNodeDef[];
  edges: TreeEdgeDef[];
  viewW: number;
  viewH: number;
  caption: string;
  animateKey?: string;
  activeId?: string;
  passedIds?: string[];
}> = ({ nodes, edges, viewW, viewH, caption, animateKey = 'tree', activeId, passedIds = [] }) => {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const r = viewW < 280 ? 18 : 22;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0b] p-2 sm:p-3">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-auto max-h-[240px] sm:max-h-[280px] mx-auto block"
        role="img"
        aria-label={caption}
      >
        <defs>
          <filter id={`${animateKey}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.14" />
          </filter>
          <marker id={`${animateKey}-arrow`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#94a3b8" />
          </marker>
          <marker id={`${animateKey}-arrow-hi`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill="#f97316" />
          </marker>
        </defs>

        {edges.map((edge, i) => {
          const a = nodeMap[edge.from];
          const b = nodeMap[edge.to];
          if (!a || !b) return null;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const x1 = a.x + (dx / len) * (r + 2);
          const y1 = a.y + (dy / len) * (r + 2);
          const x2 = b.x - (dx / len) * (r + 4);
          const y2 = b.y - (dy / len) * (r + 4);
          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={edge.highlight ? '#f97316' : '#94a3b8'}
              strokeWidth={edge.highlight ? 2.5 : 1.75}
              markerEnd={`url(#${animateKey}-arrow${edge.highlight ? '-hi' : ''})`}
              className="tree-edge"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          );
        })}

        {nodes.map((node, i) => {
          const isActive = activeId === node.id;
          const isPassed = passedIds.includes(node.id);
          const s = NODE_STYLE[node.kind];
          const fill = isActive ? '#c7d2fe' : isPassed && node.kind !== 'base' ? '#e0e7ff' : s.fill;
          const stroke = isActive ? '#4f46e5' : s.stroke;
          const strokeW = isActive ? 3 : 2;
          return (
            <g key={node.id} filter={`url(#${animateKey}-shadow)`} className="tree-node" style={{ animationDelay: `${i * 0.1}s` }}>
              <circle cx={node.x} cy={node.y} r={isActive ? r + 2 : r} fill={fill} stroke={stroke} strokeWidth={strokeW} />
              <text
                x={node.x} y={node.y + (node.label.length > 3 ? 3 : 4)}
                textAnchor="middle"
                fontSize={node.label.length > 6 ? 8 : 10}
                fontWeight="700"
                fill={s.text}
                fontFamily="ui-monospace, monospace"
              >
                {node.label}
              </text>
              {node.result !== undefined && (
                <text x={node.x} y={node.y + r + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill="#e11d48" fontFamily="ui-monospace, monospace">
                  {node.result}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-center mt-1 leading-snug px-1">{caption}</p>
    </div>
  );
};

const FACTORIAL_STEPS = [
  { depth: 0, value: '', line: 0, message: 'Start with factorial(5). We need to find the value of 5!.' },
  { depth: 1, value: '', line: 3, message: '5! needs 4!, so the function calls factorial(4).' },
  { depth: 2, value: '', line: 3, message: '4! needs 3!, so the same function runs again with 3.' },
  { depth: 3, value: '', line: 3, message: '3! needs 2!. Each call makes the number smaller.' },
  { depth: 4, value: '', line: 3, message: '2! needs 1!. We are getting closer to the stopping point.' },
  { depth: 5, value: '1', line: 1, message: 'factorial(0) is the base case. It stops calling and returns 1.' },
  { depth: 4, value: '1', line: 3, message: 'Now the answers return upward: 1 × 1 = 1.' },
  { depth: 3, value: '2', line: 3, message: 'The next waiting call continues: 2 × 1 = 2.' },
  { depth: 2, value: '6', line: 3, message: 'Then factorial(3) returns 3 × 2 = 6.' },
  { depth: 1, value: '24', line: 3, message: 'Then factorial(4) returns 4 × 6 = 24.' },
  { depth: 0, value: '120', line: 3, message: 'Finally, factorial(5) returns 5 × 24 = 120.' },
];

const FACTORIAL_CODE = [
  'int factorial(int n) {',
  '  if (n == 0) return 1;',
  '',
  '  return n * factorial(n - 1);',
  '}',
];

const FactorialAnimation: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCharacters, setVisibleCharacters] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(
      () => setStepIndex((current) => (current + 1) % FACTORIAL_STEPS.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [isPaused]);

  const current = FACTORIAL_STEPS[stepIndex];

  useEffect(() => {
    setVisibleCharacters(0);
  }, [stepIndex]);

  useEffect(() => {
    if (isPaused || visibleCharacters >= current.message.length) return;
    const timer = window.setTimeout(
      () => setVisibleCharacters((count) => Math.min(count + 1, current.message.length)),
      38
    );
    return () => window.clearTimeout(timer);
  }, [current.message, isPaused, visibleCharacters]);

  const descending = stepIndex <= 5;
  const visibleDepths = Array.from({ length: current.depth + 1 }, (_, index) => index);
  const nodePosition = (depth: number) => ({ x: 54 + depth * 59, y: 38 + depth * 43 });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0a0a0b]">
      <div className="relative min-h-[118px] border-b border-slate-200 bg-indigo-50 px-5 py-4 pr-16 dark:border-slate-700 dark:bg-indigo-950/35 sm:px-6 sm:pr-20">
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-indigo-200 bg-white text-indigo-700 shadow-sm transition hover:bg-indigo-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-200 dark:hover:bg-indigo-900"
          aria-label={isPaused ? 'Play factorial animation' : 'Pause factorial animation'}
          title={isPaused ? 'Play animation' : 'Pause animation'}
        >
          {isPaused ? <Play size={19} fill="currentColor" /> : <Pause size={19} fill="currentColor" />}
        </button>
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-600 text-sm font-black text-white">
            {stepIndex + 1}
          </span>
          <div>
            <p className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-300">
              Step {stepIndex + 1} of {FACTORIAL_STEPS.length}
            </p>
            <p aria-live="polite" className="mt-1 text-base font-semibold leading-relaxed text-slate-800 dark:text-slate-100 sm:text-lg">
              {current.message.slice(0, visibleCharacters)}
              {visibleCharacters < current.message.length && (
                <span className="ml-0.5 inline-block h-[1em] w-0.5 translate-y-0.5 animate-pulse bg-indigo-600 align-baseline dark:bg-indigo-300" aria-hidden="true" />
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="grid min-h-[310px] md:grid-cols-2">
        <div className="relative flex min-h-[310px] items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-[#080a0e] md:border-b-0 md:border-r">
          <div className="absolute left-4 top-4 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">
            {descending ? 'Calling the function' : 'Returning the answer'}
          </div>
          <svg viewBox="0 0 410 300" className="mt-6 h-auto w-full max-w-[440px]" role="img" aria-label="Animated factorial call chain from factorial five to factorial zero and back to 120">
            <defs>
              <marker id="factorial-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" className="fill-slate-400 dark:fill-slate-500" />
              </marker>
            </defs>
            {visibleDepths.slice(1).map((depth) => {
              const from = nodePosition(depth - 1);
              const to = nodePosition(depth);
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const radius = 29;
              return (
                <line
                  key={`edge-${depth}`}
                  x1={from.x + (dx / length) * radius}
                  y1={from.y + (dy / length) * radius}
                  x2={to.x - (dx / length) * (radius + 5)}
                  y2={to.y - (dy / length) * (radius + 5)}
                  className="stroke-slate-400 transition-all duration-700 ease-in-out dark:stroke-slate-600"
                  strokeWidth="2"
                  markerEnd="url(#factorial-arrow)"
                />
              );
            })}
            {visibleDepths.map((depth) => {
              const position = nodePosition(depth);
              const isActive = depth === current.depth;
              const label = `${5 - depth}!`;
              return (
                <g key={depth} className="transition-all duration-700 ease-in-out">
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r={isActive ? 33 : 29}
                    className={`transition-all duration-700 ease-in-out ${
                      isActive
                        ? 'fill-emerald-400 stroke-emerald-600 dark:fill-emerald-400 dark:stroke-emerald-200'
                        : 'fill-indigo-100 stroke-indigo-500 dark:fill-indigo-950 dark:stroke-indigo-400'
                    }`}
                    strokeWidth={isActive ? 3 : 2}
                  />
                  <text
                    x={position.x}
                    y={position.y + 5}
                    textAnchor="middle"
                    className={`font-mono text-[15px] font-black ${isActive ? 'fill-emerald-950' : 'fill-indigo-900 dark:fill-indigo-100'}`}
                  >
                    {label}
                  </text>
                  {isActive && current.value && (
                    <text x={position.x} y={position.y + 48} textAnchor="middle" className="fill-emerald-700 font-mono text-[13px] font-black dark:fill-emerald-300">
                      returns {current.value}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex min-h-[310px] flex-col justify-center p-5 sm:p-7">
          <p className="mb-4 text-xs font-black uppercase text-slate-500 dark:text-slate-400">C++ code</p>
          <pre className="overflow-x-auto font-mono text-sm leading-9 text-slate-700 dark:text-slate-300 sm:text-base">
            {FACTORIAL_CODE.map((line, index) => (
              <span
                key={`${line}-${index}`}
                className={`block min-h-8 border-l-2 px-3 transition-colors duration-300 ${
                  current.line === index
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-200'
                    : 'border-transparent'
                }`}
              >
                {line || ' '}
              </span>
            ))}
          </pre>
          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">factorial(5)</span>
            <span className="font-mono text-base font-black text-emerald-700 dark:text-emerald-400">
              {current.value ? `Result: ${current.value}` : 'Working...'}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-700 dark:bg-slate-900/60 sm:px-6">
        <h5 className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
          Now you can see why we say a function calls itself
        </h5>
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
          <p>
            The function called itself on the highlighted line:{' '}
            <code className="font-mono font-bold text-indigo-700 dark:text-indigo-300">factorial(n - 1)</code>.
            Each new call used a smaller value, changing <code className="font-mono font-bold">n</code> from 5 to 4,
            then 3, 2, 1, and finally 0.
          </p>
          <p>
            At 0, the base case returned 1 and stopped any more calls. The process then moved in reverse through
            the waiting calls: 1 × 1, 2 × 1, 3 × 2, 4 × 6, and finally 5 × 24. That is how the answer became{' '}
            <strong className="text-emerald-700 dark:text-emerald-300">120</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

/** Direct recursion — fib(3) call tree (accurate branching, like reference image) */
const DIRECT_FIB_TREE = {
  nodes: [
    { id: 'f3', label: 'fib(3)', x: 160, y: 28, kind: 'root' as const, result: '2' },
    { id: 'f2a', label: 'fib(2)', x: 90, y: 95, kind: 'internal' as const, result: '1' },
    { id: 'f1a', label: 'fib(1)', x: 230, y: 95, kind: 'base' as const, result: '1' },
    { id: 'f1b', label: 'fib(1)', x: 50, y: 162, kind: 'base' as const, result: '1' },
    { id: 'f0', label: 'fib(0)', x: 130, y: 162, kind: 'base' as const, result: '0' },
  ] satisfies TreeNodeDef[],
  edges: [
    { from: 'f3', to: 'f2a', highlight: true },
    { from: 'f3', to: 'f1a' },
    { from: 'f2a', to: 'f1b' },
    { from: 'f2a', to: 'f0' },
  ] satisfies TreeEdgeDef[],
  viewW: 320,
  viewH: 195,
  caption: 'Direct: fib(3) calls itself twice → branches grow. Red numbers = return values.',
};

/** shoutFollow call tree for intro animation (4 → 0) */
const SHOUT_FOLLOW_TREE = {
  nodes: [
    { id: 'sf4', label: '4', x: 130, y: 22, kind: 'root' as const },
    { id: 'sf3', label: '3', x: 130, y: 68, kind: 'internal' as const },
    { id: 'sf2', label: '2', x: 130, y: 114, kind: 'internal' as const },
    { id: 'sf1', label: '1', x: 130, y: 160, kind: 'internal' as const },
    { id: 'sf0', label: '0', x: 130, y: 206, kind: 'base' as const, result: 'stop' },
  ] satisfies TreeNodeDef[],
  edges: [
    { from: 'sf4', to: 'sf3', highlight: true },
    { from: 'sf3', to: 'sf2' },
    { from: 'sf2', to: 'sf1' },
    { from: 'sf1', to: 'sf0' },
  ] satisfies TreeEdgeDef[],
  viewW: 260,
  viewH: 230,
};

const SHOUT_ACTIVE_IDS = ['sf4', 'sf3', 'sf2', 'sf1', 'sf0'];

/** Direct linear — shoutFollow chain (single path, good on narrow screens) */
const DIRECT_LINEAR_TREE = {
  nodes: [
    { id: 's3', label: '3', x: 130, y: 26, kind: 'root' as const },
    { id: 's2', label: '2', x: 130, y: 78, kind: 'internal' as const },
    { id: 's1', label: '1', x: 130, y: 130, kind: 'internal' as const },
    { id: 's0', label: '0', x: 130, y: 182, kind: 'base' as const, result: 'stop' },
  ] satisfies TreeNodeDef[],
  edges: [
    { from: 's3', to: 's2', highlight: true },
    { from: 's2', to: 's1' },
    { from: 's1', to: 's0' },
  ] satisfies TreeEdgeDef[],
  viewW: 260,
  viewH: 210,
  caption: 'Direct (linear): shoutFollow counts down 3 → 2 → 1 → 0, then stops.',
};

/** Indirect — three roles in a circle (no self-call on first hop) */
const INDIRECT_CYCLE_TREE = {
  nodes: [
    { id: 'student', label: 'Student', x: 160, y: 30, kind: 'role' as const },
    { id: 'teacher', label: 'Teacher', x: 60, y: 130, kind: 'role' as const },
    { id: 'principal', label: 'Principal', x: 260, y: 130, kind: 'role' as const },
  ] satisfies TreeNodeDef[],
  edges: [
    { from: 'student', to: 'teacher', highlight: true },
    { from: 'teacher', to: 'principal' },
    { from: 'principal', to: 'student' },
  ] satisfies TreeEdgeDef[],
  viewW: 320,
  viewH: 175,
  caption: 'Indirect: no one calls themselves first — Student → Teacher → Principal → Student.',
};

/** Tail — linear with return path annotation via result labels */
const TAIL_LINEAR_TREE = {
  nodes: [
    { id: 't3', label: 'n=3', x: 130, y: 26, kind: 'root' as const },
    { id: 't2', label: 'n=2', x: 130, y: 78, kind: 'internal' as const },
    { id: 't1', label: 'n=1', x: 130, y: 130, kind: 'internal' as const },
    { id: 't0', label: 'n=0', x: 130, y: 182, kind: 'base' as const, result: 'done' },
  ] satisfies TreeNodeDef[],
  edges: [
    { from: 't3', to: 't2', highlight: true },
    { from: 't2', to: 't1' },
    { from: 't1', to: 't0' },
  ] satisfies TreeEdgeDef[],
  viewW: 260,
  viewH: 210,
  caption: 'Tail: say message, then immediately call the smaller count — nothing left after the call.',
};

const RecursionTypesExplainer: React.FC = () => {
  const types = [
    {
      title: 'Direct Recursion',
      color: 'blue',
      simple: 'The function calls itself directly — one call can lead to one path or many branches.',
      example: 'shoutFollow(3) counts down in a straight line. fib(3) splits into two self-calls each time (see tree).',
      treeKey: 'direct',
      pseudo: `shoutFollow(n):
  if n == 0: stop
  say "Follow for more!"
  shoutFollow(n - 1)  ← calls itself

fib(n):
  if n <= 1: return n
  return fib(n-1) + fib(n-2)
  ← calls itself twice → tree branches`,
    },
    {
      title: 'Indirect Recursion',
      color: 'green',
      simple: 'No function calls itself on the first hop — they pass the job around in a circle until someone stops.',
      example: 'Student asks Teacher, Teacher asks Principal, Principal asks Student again.',
      treeKey: 'indirect',
      pseudo: `studentAsks():
  teacherAsks()

teacherAsks():
  principalAsks()

principalAsks():
  studentAsks()  ← circle, not self on step 1`,
    },
    {
      title: 'Tail Recursion',
      color: 'orange',
      simple: 'The recursive call is the last thing that happens — nothing left to do after passing the job on.',
      example: 'Say your message, hand the rest to shoutFollow(n−1), and that call is the final step.',
      treeKey: 'tail',
      pseudo: `shoutFollow(n):
  if n == 0: stop
  say "Follow for more!"
  return shoutFollow(n - 1)
  ← last line, nothing after`,
    },
  ];

  const colorMap: Record<string, { border: string; bg: string; text: string; pseudo: string }> = {
    blue: {
      border: 'border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-700 dark:text-blue-300',
      pseudo: 'bg-slate-50 dark:bg-[#0a0a0b] border-blue-200 dark:border-blue-800',
    },
    green: {
      border: 'border-green-200 dark:border-green-800',
      bg: 'bg-green-50 dark:bg-green-950/30',
      text: 'text-green-700 dark:text-green-300',
      pseudo: 'bg-slate-50 dark:bg-[#0a0a0b] border-green-200 dark:border-green-800',
    },
    orange: {
      border: 'border-orange-200 dark:border-orange-800',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      text: 'text-orange-700 dark:text-orange-300',
      pseudo: 'bg-slate-50 dark:bg-[#0a0a0b] border-orange-200 dark:border-orange-800',
    },
  };

  const renderTree = (key: string) => {
    if (key === 'direct') {
      return (
        <div className="space-y-2">
          <RecursionTreeSvg {...DIRECT_FIB_TREE} animateKey="direct-fib" />
          <RecursionTreeSvg {...DIRECT_LINEAR_TREE} animateKey="direct-linear" />
        </div>
      );
    }
    if (key === 'indirect') {
      return <RecursionTreeSvg {...INDIRECT_CYCLE_TREE} animateKey="indirect" />;
    }
    return <RecursionTreeSvg {...TAIL_LINEAR_TREE} animateKey="tail" />;
  };

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes tree-node-in {
          from { opacity: 0; transform: scale(0.75); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes tree-edge-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .tree-node { animation: tree-node-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; transform-origin: center; transform-box: fill-box; }
        .tree-edge { animation: tree-edge-in 0.45s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .tree-node, .tree-edge { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Three ways recursion shows up — each tree below shows <strong className="text-slate-800 dark:text-slate-200">how calls connect</strong>.
        Orange = start, purple = in progress, green = base case (stop).
      </p>

      <div className="grid grid-cols-1 gap-5">
        {types.map((type) => {
          const c = colorMap[type.color];
          return (
            <div key={type.title} className={`rounded-xl border ${c.border} ${c.bg} p-3 sm:p-5 shadow-sm overflow-hidden`}>
              <h4 className={`text-sm font-black uppercase tracking-wide ${c.text} mb-2`}>{type.title}</h4>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-0.5">In simple terms</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{type.simple}</p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-0.5">Everyday example</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{type.example}</p>

              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1.5">Call tree</p>
              <div className="mb-3 max-w-full overflow-hidden">{renderTree(type.treeKey)}</div>

              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-1.5">Simple pseudocode</p>
              <pre className={`rounded-lg border ${c.pseudo} p-3 text-[11px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap overflow-x-auto`}>
                {type.pseudo}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type RecursionScene = 'intro' | 'problem' | 'example';

const SCENE_DURATIONS: Record<RecursionScene, number> = {
  intro: 4800,
  problem: 4200,
  example: 14000,
};

const SCENE_ORDER: RecursionScene[] = ['intro', 'problem', 'example'];

const RecursionFlowDiagram: React.FC = () => {
  const [scene, setScene] = useState<RecursionScene>('intro');
  const [callIndex, setCallIndex] = useState(-1);
  const [messagesShown, setMessagesShown] = useState(0);
  const [sceneVisible, setSceneVisible] = useState(true);

  useEffect(() => {
    const fadeOut = window.setTimeout(() => setSceneVisible(false), SCENE_DURATIONS[scene] - 450);
    const advance = window.setTimeout(() => {
      setScene((prev) => {
        const idx = SCENE_ORDER.indexOf(prev);
        return SCENE_ORDER[(idx + 1) % SCENE_ORDER.length];
      });
      setSceneVisible(true);
      setCallIndex(-1);
      setMessagesShown(0);
    }, SCENE_DURATIONS[scene]);

    return () => {
      window.clearTimeout(fadeOut);
      window.clearTimeout(advance);
    };
  }, [scene]);

  useEffect(() => {
    if (scene !== 'example') return;

    const descentTimers: number[] = [];
    SHOUT_ACTIVE_IDS.forEach((_, i) => {
      descentTimers.push(window.setTimeout(() => setCallIndex(i), 800 + i * 1100));
    });

    const messageTimers: number[] = [];
    [0, 1, 2, 3].forEach((i) => {
      messageTimers.push(window.setTimeout(() => setMessagesShown(i + 1), 5200 + i * 900));
    });

    return () => {
      descentTimers.forEach(window.clearTimeout);
      messageTimers.forEach(window.clearTimeout);
    };
  }, [scene]);

  const sceneLabel =
    scene === 'intro' ? 'What is recursion?' :
    scene === 'problem' ? 'A real-world task' :
    'How recursion solves it';

  return (
    <div className="p-5 sm:p-6 bg-slate-50 dark:bg-[#0a0a0b] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <style>{`
        @keyframes grow-in {
          0% { opacity: 0; transform: scale(0.82); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.6); }
          70% { transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes bubble-in {
          0% { opacity: 0; transform: translateX(12px) scale(0.9); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.35); }
          50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }
        .rec-grow { animation: grow-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .rec-slide { animation: slide-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .rec-pop { animation: pop-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .rec-bubble { animation: bubble-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .rec-active-ring { animation: pulse-ring 1.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rec-grow, .rec-slide, .rec-pop, .rec-bubble, .rec-active-ring { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <div className="flex items-center justify-between mb-4 gap-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          {sceneLabel}
        </p>
        <div className="flex gap-1.5">
          {SCENE_ORDER.map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s === scene ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      <div
        className={`relative min-h-[320px] sm:min-h-[380px] flex items-center justify-center transition-opacity duration-400 ${
          sceneVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {scene === 'intro' && (
          <div className="max-w-lg px-4 text-center rec-grow">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3 rec-slide" style={{ animationDelay: '0.15s' }}>
              Recursion in plain English
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-snug rec-grow" style={{ animationDelay: '0.25s' }}>
              Recursion is simply{' '}
              <span className="text-indigo-600 dark:text-indigo-400">repeating what you already know how to do</span>
              {' '}— on a smaller piece of the problem — until you reach the{' '}
              <span className="text-rose-600 dark:text-rose-400">simplest case</span>.
            </h3>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 rec-slide" style={{ animationDelay: '0.7s' }}>
              Same step. Smaller input. Stop when done.
            </p>
          </div>
        )}

        {scene === 'problem' && (
          <div className="w-full max-w-md px-2 text-center">
            <div className="rec-pop mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 shadow-md">
              <User className="text-indigo-600 dark:text-indigo-400" size={32} />
            </div>
            <p className="rec-slide text-sm text-slate-500 dark:text-slate-400 mb-2" style={{ animationDelay: '0.2s' }}>
              Imagine you are a creator and you need to tell
            </p>
            <p className="rec-grow text-2xl sm:text-3xl font-black text-slate-900 dark:text-white" style={{ animationDelay: '0.35s' }}>
              <span className="text-indigo-600 dark:text-indigo-400">190 people</span>
            </p>
            <div className="rec-pop mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 px-4 py-2 shadow-sm" style={{ animationDelay: '0.55s' }}>
              <Megaphone size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-bold text-amber-900 dark:text-amber-100">&quot;Follow for more!&quot;</span>
            </div>
            <p className="rec-slide mt-5 text-xs text-slate-500 dark:text-slate-400" style={{ animationDelay: '0.85s' }}>
              Writing it 190 times by hand is tiring. Recursion gives you one rule that repeats itself.
            </p>
            <div className="rec-slide mt-4 flex justify-center gap-1" style={{ animationDelay: '1.1s' }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                  <User size={14} className="text-slate-500 dark:text-slate-300" />
                </div>
              ))}
              <span className="flex items-center text-xs font-bold text-slate-400 pl-1">+183 more</span>
            </div>
          </div>
        )}

        {scene === 'example' && (
          <div className="w-full flex flex-col gap-3 max-w-sm sm:max-w-md mx-auto px-1">
            <div className="rec-slide rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0a0a0b] p-3" style={{ animationDelay: '0.1s' }}>
              <p className="text-[10px] font-black uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1">
                <Code size={12} /> Pseudocode
              </p>
              <pre className="text-[10px] sm:text-[11px] font-mono leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{`shoutFollow(count):
  if count == 0: stop
  say "Follow for more!"
  shoutFollow(count - 1)`}</pre>
            </div>

            <div className="rec-slide" style={{ animationDelay: '0.2s' }}>
              <p className="text-[10px] font-black uppercase tracking-wide text-indigo-500 mb-1.5 text-center">
                Call tree — count goes down each level
              </p>
              <RecursionTreeSvg
                {...SHOUT_FOLLOW_TREE}
                animateKey="shout-flow"
                caption="shoutFollow(4) → 3 → 2 → 1 → 0 (stop). Same pattern for all 190 people."
                activeId={callIndex >= 0 ? SHOUT_ACTIVE_IDS[callIndex] : undefined}
                passedIds={callIndex > 0 ? SHOUT_ACTIVE_IDS.slice(0, callIndex) : []}
              />
            </div>

            <div className="rec-slide space-y-1.5" style={{ animationDelay: '0.35s' }}>
              <p className="text-[10px] font-black uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <Users size={12} /> People hear the message
              </p>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className={`flex items-center gap-2 transition-all duration-500 ${
                    messagesShown >= n ? 'opacity-100 translate-x-0' : 'opacity-25 translate-x-2'
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700">
                    <User size={14} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {messagesShown >= n ? (
                    <div className="rec-bubble flex items-center gap-1.5 rounded-xl rounded-bl-sm bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-700 px-2 py-1 shadow-sm">
                      <MessageCircle size={11} className="text-emerald-600 shrink-0" />
                      <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-200">Follow for more!</span>
                    </div>
                  ) : (
                    <div className="h-7 w-24 rounded-xl border border-dashed border-slate-200 dark:border-slate-700" />
                  )}
                </div>
              ))}
              {messagesShown >= 4 && (
                <p className="rec-pop text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                  ✓ 4 shown — imagine 190 bubbles total
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center max-w-xl mx-auto leading-relaxed">
        {scene === 'intro' && 'Watch the short animation — it builds from the idea, to the problem, to the solution.'}
        {scene === 'problem' && 'Recursion avoids writing the same instruction 190 times by hand.'}
        {scene === 'example' && 'Each call says the message once, then passes a smaller count to the next call until count reaches 0.'}
      </p>
    </div>
  );
};
// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Copy to clipboard ──────────────────────────────────────────────────
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Syntax highlighting (same as LO1 redesign) ───────────────────────
  const highlightSyntax = (code: string): React.ReactNode => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const placeholders: Record<string, string> = {};
    let counter = 0;

    // Comments
    escaped = escaped.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
      const key = `__COMMENT_${counter++}__`;
      placeholders[key] = `<span class="text-[#57A64A] dark:text-[#6a9955] italic">${match}</span>`;
      return key;
    });

    // Strings
    escaped = escaped.replace(/(".*?"|'.*?'|`.*?`)/g, (match) => {
      const key = `__STRING_${counter++}__`;
      placeholders[key] = `<span class="text-[#D69D85] dark:text-[#ce9178]">${match}</span>`;
      return key;
    });

    // Keywords
    const keywords = [
      'int', 'void', 'char', 'double', 'float', 'if', 'else', 'return', 'for',
      'while', 'do', 'break', 'continue', 'switch', 'case', 'default', 'class',
      'struct', 'public', 'private', 'protected', 'namespace', 'using', 'include',
      'define', 'endl', 'cout', 'cin', 'new', 'delete', 'this', 'virtual', 'override',
      'static', 'const', 'enum', 'template', 'typename', 'try', 'catch', 'throw',
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Known functions (like factorial, etc.)
    const functions = ['factorial', 'towersOfHanoi', 'binarySearch', 'fibonacci'];
    const funcRegex = new RegExp(`\\b(${functions.join('|')})\\b`, 'g');
    escaped = escaped.replace(funcRegex, '<span class="text-[#DCDCAA]">$1</span>');

    // Methods (words followed by '(')
    escaped = escaped.replace(/(?<![<>"'])\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-[#DCDCAA]">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#16a34a] dark:text-[#b5cea8]">$1</span>');

    Object.keys(placeholders).forEach(key => {
      escaped = escaped.replace(key, placeholders[key]);
    });

    const lines = escaped.split('\n');
    return lines.map((line, idx) => (
      <div key={idx} className="flex min-h-[1.5rem] hover:bg-gray-100/50 dark:hover:bg-gray-700/30 rounded-md transition-colors">
        <span className="text-right w-8 select-none text-gray-400 dark:text-gray-500 text-xs pr-3 mr-3 border-r border-gray-200 dark:border-gray-700 shrink-0">
          {idx + 1}
        </span>
        <pre
          className="m-0 flex-1 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: line || ' ' }}
        />
      </div>
    ));
  };

  // ─── CodeBlock component ────────────────────────────────────────────────
  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          {copiedId === id ? <Check size={12} /> : <Copy size={12} />}
          {copiedId === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-white dark:bg-[#0a0a0b] p-4 overflow-x-auto">
        {highlightSyntax(code)}
      </div>
    </div>
  );

  // ─── Table component ────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0a0a0b]' : 'bg-slate-50 dark:bg-[#121212]'}>
              {row.map((cell, j) => (
                <td key={j} className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Code snippets ──────────────────────────────────────────────────────
  const factorialCode = `int factorial(int n) {
    if (n == 0) {
        return 1; // Base case
    } else {
        return n * factorial(n - 1); // Recursive case
    }
}`;

  const hanoiCode = `void towersOfHanoi(int n, char source, char destination, char auxiliary) {
    if (n == 1) {
        cout << "Move disk 1 from " << source << " to " << destination << endl;
        return;
    }
    towersOfHanoi(n - 1, source, auxiliary, destination);
    cout << "Move disk " << n << " from " << source << " to " << destination << endl;
    towersOfHanoi(n - 1, auxiliary, destination, source);
}`;

  const binarySearchCode = `int binarySearch(int arr[], int left, int right, int x) {
    if (right >= left) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == x)
            return mid;
        if (arr[mid] > x)
            return binarySearch(arr, left, mid - 1, x);
        return binarySearch(arr, mid + 1, right, x);
    }
    return -1;
}`;

  const fibonacciCode = `int fibonacci(int n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Brain size={14} className="inline mr-1" /> RECURSION
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Simply Easy Recursion
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the art of recursion: function calling itself, base cases,
            recursive algorithms, and classic examples like factorial, Towers
            of Hanoi, binary search, and Fibonacci.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> Recursion
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Workflow size={14} className="inline mr-1" /> Algorithms
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, algorithm, or law..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-indigo-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div>
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Intro ──────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Recursion
              </h2>

              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="font-bold">Recursion</span> is when a function calls itself to solve a problem.
                  Each call works on a smaller part of the problem until it reaches a point where it can stop.
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Where Recursion Is Used
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-6 text-sm md:text-base text-slate-700 dark:text-slate-300">
                  <li>Calculating factorials</li>
                  <li>Solving the Towers of Hanoi puzzle</li>
                  <li>Searching sorted data with binary search</li>
                  <li>Moving through folders and tree structures</li>
                  <li>Calculating numbers in the Fibonacci sequence</li>
                </ul>
              </div>

              <div className="pt-4">
                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                  Let&apos;s Look Into How Recursion Works
                </h3>
                <div className="mb-5 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-900 dark:text-white">What we need to do:</strong>{' '}
                    calculate 5 factorial, written as 5!, by multiplying 5 × 4 × 3 × 2 × 1.
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">Why recursion works here:</strong>{' '}
                    every factorial is the current number multiplied by the factorial of the number below it.
                    For example, 5! is 5 × 4!.
                  </p>
                  <p>
                    <strong className="text-slate-900 dark:text-white">How it will work:</strong>{' '}
                    the function calls itself with a smaller number until it reaches 0. It then returns 1 and
                    multiplies the answers on the way back to produce 120.
                  </p>
                </div>
                <h4 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                  Example 1: Calculating Factorials
                </h4>
                <FactorialAnimation />
                <div className="pt-8">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    Example 2: Towers of Hanoi
                  </h4>
                  <div className="mt-4 space-y-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                    <p><strong className="text-slate-900 dark:text-white">Goal:</strong> Move all the disks from rod A to rod C.</p>
                    <p><strong className="text-slate-900 dark:text-white">Rule 1:</strong> Move only one disk at a time.</p>
                    <p><strong className="text-slate-900 dark:text-white">Rule 2:</strong> Never put a large disk on a smaller disk.</p>
                    <p><strong className="text-slate-900 dark:text-white">First:</strong> Move the smaller disks out of the way.</p>
                    <p><strong className="text-slate-900 dark:text-white">Next:</strong> Move the largest disk to the correct rod.</p>
                    <p><strong className="text-slate-900 dark:text-white">Finally:</strong> Repeat the same steps to move the smaller disks on top.</p>
                  </div>
                </div>
                <HanoiThreeWalkthrough />
              </div>
            </div>
            {/* ─── Section 2: Iteration ─────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['iteration'] = el; }}
              className="scroll-mt-24 space-y-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#121212] sm:p-6"
            >
              <h2 className="text-2xl font-bold uppercase text-slate-900 dark:text-white md:text-3xl">
                Iteration
              </h2>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-900/20">
                <p className="text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">
                  <span className="font-bold">Iteration</span> means repeating a set of instructions using a loop.
                  The loop continues while a condition is true, or until it has repeated a chosen number of times.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Where Iteration Is Used
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-700 dark:text-slate-300 md:text-base">
                  <li>Counting from one number to another</li>
                  <li>Reading every item in an array or list</li>
                  <li>Repeating a calculation several times</li>
                  <li>Checking input until the user enters a valid value</li>
                  <li>Processing records one at a time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Let&apos;s Look Into How Iteration Works
                </h3>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                  <p><strong className="text-slate-900 dark:text-white">First:</strong> Give the loop a starting value.</p>
                  <p><strong className="text-slate-900 dark:text-white">Next:</strong> Check whether its condition is true.</p>
                  <p><strong className="text-slate-900 dark:text-white">Then:</strong> Run the instructions and change the loop value.</p>
                  <p><strong className="text-slate-900 dark:text-white">Finally:</strong> Stop when the condition becomes false.</p>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Example 1: Calculating a Factorial
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                  To calculate 5!, begin with 1 and use a loop to multiply it by 1, 2, 3, 4, and 5.
                  The result changes as follows: <strong className="text-emerald-700 dark:text-emerald-300">1 → 2 → 6 → 24 → 120</strong>.
                </p>
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0a0a0b]">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                    C++ code
                  </div>
                  <pre className="overflow-x-auto p-4 font-mono text-sm leading-7 text-slate-800 dark:text-slate-200"><code>{`int factorial = 1;

for (int number = 1; number <= 5; number++) {
    factorial = factorial * number;
}

cout << factorial;`}</code></pre>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Example 2: Displaying Numbers From 1 to 5
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                  The loop starts with <code className="font-mono font-bold">number = 1</code>. After displaying a number,
                  <code className="font-mono font-bold"> number++</code> adds one. It stops after displaying 5 because
                  the condition <code className="font-mono font-bold">number &lt;= 5</code> is no longer true.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(240px,.7fr)]">
                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#0a0a0b]">
                    <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-black uppercase text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                      C++ code
                    </div>
                    <pre className="overflow-x-auto p-4 font-mono text-sm leading-7 text-slate-800 dark:text-slate-200"><code>{`for (int number = 1; number <= 5; number++) {
    cout << number << " ";
}`}</code></pre>
                  </div>
                  <div className="flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950/30">
                    <div className="text-center">
                      <p className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">Output</p>
                      <p className="mt-3 font-mono text-2xl font-black tracking-normal text-slate-900 dark:text-white">1 2 3 4 5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 3: Recursion vs Iteration ────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['vs-iteration'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Recursion vs Iteration
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Both approaches repeat work. <strong className="text-slate-900 dark:text-white">Recursion</strong> repeats
                by calling functions (like stacking tasks). <strong className="text-slate-900 dark:text-white">Iteration</strong> repeats
                with a loop (<code className="font-mono text-xs">for</code> / <code className="font-mono text-xs">while</code>).
                Use recursion when the problem naturally breaks into smaller copies of itself.
              </p>

              <div className="mt-4">
                <Table
                  headers={["Feature", "Recursion (simple view)", "Iteration (simple view)"]}
                  rows={[
                    ["How it repeats", "Function calls itself (or others in a chain)", "A loop runs again and again"],
                    ["Memory", "Keeps a stack of unfinished calls", "Usually just a counter variable"],
                    ["Best for", "Tree problems, divide-and-conquer, nested structures", "Counting, simple loops, fixed steps"],
                    ["Risk", "Too many calls → stack overflow", "Usually safer on memory"],
                    ["Readability", "Can read like the problem statement", "Often easier for beginners on simple tasks"],
                    ["Speed", "Slightly slower (call overhead)", "Usually faster for plain counting"],
                  ]}
                />
              </div>
            </div>

            {/* ─── Section 3: Types of Recursion ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['types'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Types of Recursion
              </h2>

              <RecursionTypesExplainer />
            </div>

            {/* ─── Section 4: Critique of Recursion ──────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['critique'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Critique of Recursion
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Recursion is powerful, but it is not always the best choice. Here is what to watch out for — in plain terms.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Efficiency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Each function call takes a little extra time. For very large inputs, a simple loop is often faster.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Clarity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Deep or messy recursion can be hard to follow. Keep the base case obvious and the steps small.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Stack Overflow</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Too many nested calls fill up memory — like stacking too many unfinished tasks. Always move toward the base case.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Memory Usage</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Every call waits in memory until it finishes. Loops usually remember less.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Debugging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tracing many nested calls is harder than stepping through one loop. Test the base case first.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 5: Laws of Recursion ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['laws'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Laws of Recursion
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Six simple rules every recursive solution should follow. If one is missing, the program may never stop or may give wrong answers.
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Base Case</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A clear stop condition. Example: when count is 0, stop shouting &quot;Follow for more!&quot;</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Recursive Case</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Each call must make the problem smaller. Example: 190 → 189 → 188 … getting closer to 0.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Correctness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The same rule must work for every valid input — not just the first few numbers you tested.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Efficiency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avoid redoing the same work twice. (Fibonacci naïve recursion recalculates a lot — there are smarter versions.)</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Clarity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Name things clearly. A reader should spot the base case and the &quot;do one step, pass the rest&quot; pattern quickly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Boundedness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recursion must always reach the base case. If count never decreases, you get an infinite loop of calls.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 6: Algorithms ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['algorithms'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                C++ Recursive Algorithms
              </h2>

              {/* Factorial */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Factorial</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <strong className="text-slate-800 dark:text-slate-200">In simple terms:</strong> multiply n by all smaller numbers down to 1.
                  Example: 5! = 5 × 4 × 3 × 2 × 1 = 120. Stops when n reaches 0.
                </p>
                <CodeBlock code={factorialCode} title="factorial.cpp" id="factorial" />
              </div>

              {/* Towers of Hanoi */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Towers of Hanoi</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <strong className="text-slate-800 dark:text-slate-200">In simple terms:</strong> move a stack of disks to another rod, one at a time, never putting a big disk on a small one.
                  Recursion: move the top n−1 disks out of the way, move the biggest disk, then move the n−1 disks on top.
                </p>
                <CodeBlock code={hanoiCode} title="towers_of_hanoi.cpp" id="hanoi" />
              </div>

              {/* Binary Search */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-6">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Binary Search</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <strong className="text-slate-800 dark:text-slate-200">In simple terms:</strong> find a number in a sorted list by checking the middle, then searching only the left or right half — halving the search each time.
                </p>
                <CodeBlock code={binarySearchCode} title="binary_search.cpp" id="binarySearch" />
              </div>

              {/* Fibonacci */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Fibonacci Sequence</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <strong className="text-slate-800 dark:text-slate-200">In simple terms:</strong> each number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13 …
                  Recursion asks: &quot;What were the previous two values?&quot; until you reach 0 or 1.
                </p>
                <CodeBlock code={fibonacciCode} title="fibonacci.cpp" id="fibonacci" />
              </div>
            </div>

            {/* ─── Section 7: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Core Concepts</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Recursion:</strong> A function repeats by calling itself (or others in a chain)</li>
                    <li><strong>Base case:</strong> The stop rule — e.g. count == 0</li>
                    <li><strong>Recursive case:</strong> Do one step, then pass a smaller problem on</li>
                    <li><strong>Direct:</strong> Function calls itself (shoutFollow → shoutFollow)</li>
                    <li><strong>Indirect:</strong> Functions pass the job in a circle (A → B → C → A)</li>
                    <li><strong>Tail:</strong> The recursive call is the last line — nothing after it</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Recursion vs Iteration</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Control:</strong> Function calls vs loops</li>
                    <li><strong>Memory:</strong> Stack frames vs loop counters</li>
                    <li><strong>Efficiency:</strong> Usually slower for recursion</li>
                    <li><strong>Clarity:</strong> Recursion can be elegant</li>
                    <li><strong>Risk:</strong> Stack overflow in recursion</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Classic Algorithms</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Factorial:</strong> n! = n × (n−1)!</li>
                    <li><strong>Towers of Hanoi:</strong> Move n disks</li>
                    <li><strong>Binary Search:</strong> Divide and conquer</li>
                    <li><strong>Fibonacci:</strong> F(n) = F(n−1) + F(n−2)</li>
                    <li><strong>Base cases:</strong> 0! = 1, F(0)=0, F(1)=1</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      Exam questions often ask you to spot the base case and explain how each call makes the problem smaller.
                      Always check: Is there a stop condition? Does the input get smaller each time?
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Practice it. Master it. 🚀</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Recursion</strong> is a function that calls itself, with a base case
                to terminate and a recursive case that progresses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Recursion vs Iteration</strong> – recursion uses stack frames and is
                often elegant but less efficient; iteration uses loops and is more memory‑efficient.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Three types</strong> – direct (calls itself), indirect (passes through other functions), and tail (recursive call is the last step).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Laws</strong> – base case, recursive progress, correctness,
                efficiency, clarity, boundedness.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Classic examples</strong> – Factorial, Towers of Hanoi, Binary
                Search, Fibonacci – each demonstrates recursion in a different context.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Simply Easy Recursion 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
