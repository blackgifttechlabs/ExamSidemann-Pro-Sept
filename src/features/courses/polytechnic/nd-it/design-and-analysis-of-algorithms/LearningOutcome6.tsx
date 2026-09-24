import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Link,
  Code,
  GitBranch,
  MemoryStick,
  Table,
  List,
  Lightbulb,
  GraduationCap,
  Copy,
  Check,
  Search,
  X,
  RefreshCw,
  ChevronUp,
  BookOpen,
  Layers,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'basics', label: 'Basics' },
  { id: 'node-structure', label: 'Node Structure' },
  { id: 'operations', label: 'Operations' },
  { id: 'memory', label: 'Memory' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// LINKED LIST BUILD & TRAVERSAL ANIMATION
// ──────────────────────────────────────────────────────────────────────────────
type ListKind = 'singly' | 'circular' | 'circular-doubly' | 'doubly';

const LIST_TYPES: { type: ListKind; title: string; color: string; desc: string }[] = [
  { type: 'singly', title: 'Singly Linked List', color: '#3b82f6', desc: 'Each node has data and one next pointer. You can only travel forward, from HEAD to nullptr.' },
  { type: 'circular', title: 'Circular Linked List', color: '#f59e0b', desc: 'The last node points back to the first node instead of nullptr, so the list forms a loop.' },
  { type: 'circular-doubly', title: 'Circular Doubly Linked List', color: '#8b5cf6', desc: 'Every node has prev and next pointers, and both ends wrap around: last.next goes to first, first.prev goes to last.' },
  { type: 'doubly', title: 'Doubly Linked List', color: '#10b981', desc: 'Each node has prev and next pointers, so you can travel forward and backward. Both ends are nullptr.' },
];

type Arrow = { d: string; ex: number; ey: number; ang: number; color: string };

const mkQuad = (sx: number, sy: number, cx: number, cy: number, ex: number, ey: number, color: string): Arrow => ({
  d: `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`,
  ex, ey, color,
  ang: (Math.atan2(ey - cy, ex - cx) * 180) / Math.PI,
});

const mkCubic = (
  sx: number, sy: number, c1x: number, c1y: number, c2x: number, c2y: number,
  ex: number, ey: number, color: string
): Arrow => ({
  d: `M${sx} ${sy} C${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`,
  ex, ey, color,
  ang: (Math.atan2(ey - c2y, ex - c2x) * 180) / Math.PI,
});

const mkLine = (sx: number, sy: number, ex: number, ey: number, color: string): Arrow => ({
  d: `M${sx} ${sy} L${ex} ${ey}`,
  ex, ey, color,
  ang: (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI,
});

const ListTypeDiagram: React.FC<{ type: ListKind }> = ({ type }) => {
  const doubly = type === 'doubly' || type === 'circular-doubly';
  const circular = type === 'circular' || type === 'circular-doubly';
  const color = LIST_TYPES.find((t) => t.type === type)!.color;
  const HC = '#f59e0b';
  const Y = 90;
  const H = 30;
  const MID = Y + H / 2;
  const B = Y + H;
  const xs = [80, 200, 320];
  const w = doubly ? 80 : 64;
  const dur = '10s';

  // Arrows are listed in the order they get drawn
  const arrows: Arrow[] = [];
  arrows.push(mkQuad(32, 58, 32, MID, xs[0] - 3, MID, HC)); // HEAD

  if (!doubly) {
    for (let i = 0; i < 2; i++) {
      const sx = xs[i] + 54;
      const ex = xs[i + 1] + 22;
      arrows.push(mkQuad(sx, Y, (sx + ex) / 2, Y - 55, ex, Y - 3, color));
    }
    if (circular) {
      arrows.push(mkCubic(xs[2] + 54, B, xs[2] + 54, B + 75, xs[0] + 22, B + 75, xs[0] + 22, B + 3, color));
    } else {
      arrows.push(mkLine(xs[2] + w, MID, xs[2] + w + 36, MID, color));
    }
  } else {
    for (let i = 0; i < 2; i++) {
      const sx = xs[i] + 70;
      const ex = xs[i + 1] + 30;
      arrows.push(mkQuad(sx, Y, (sx + ex) / 2, Y - 55, ex, Y - 3, color));
    }
    if (circular) {
      arrows.push(mkCubic(xs[2] + 70, B, xs[2] + 70, B + 80, xs[0] + 25, B + 80, xs[0] + 25, B + 3, color));
    } else {
      arrows.push(mkLine(xs[2] + w, MID, xs[2] + w + 36, MID, color));
    }
    for (let i = 1; i < 3; i++) {
      const sx = xs[i] + 10;
      const ex = xs[i - 1] + 50;
      arrows.push(mkQuad(sx, B, (sx + ex) / 2, B + 55, ex, B + 3, color));
    }
    if (circular) {
      arrows.push(mkCubic(xs[0] + 10, Y, xs[0] + 10, Y - 80, xs[2] + 52, Y - 80, xs[2] + 52, Y - 3, color));
    } else {
      arrows.push(mkLine(xs[0] + 10, B, xs[0] + 10, B + 30, color));
    }
  }

  const step = 0.1;
  const len = 0.08;

  return (
    <svg
      viewBox="0 0 500 210"
      className="w-full h-auto"
      role="img"
      aria-label={`${type} linked list animation`}
    >
      <text x="6" y="52" fontSize="12" fontWeight="800" fill={HC}>HEAD</text>

      {/* Nodes */}
      {xs.map((x, i) => (
        <g key={i}>
          <rect x={x} y={Y} width={w} height={H} rx="6" fill={color} />
          {doubly ? (
            <>
              <rect x={x} y={Y} width="20" height={H} rx="6" fill="rgba(255,255,255,0.25)" />
              <rect x={x + 60} y={Y} width="20" height={H} rx="6" fill="rgba(255,255,255,0.25)" />
              <text x={x + 40} y={MID + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">data</text>
              <circle cx={x + 10} cy={MID} r="3" fill="#fff" />
              <circle cx={x + 70} cy={MID} r="3" fill="#fff" />
            </>
          ) : (
            <>
              <rect x={x + 44} y={Y} width="20" height={H} rx="6" fill="rgba(255,255,255,0.25)" />
              <text x={x + 22} y={MID + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">data</text>
              <circle cx={x + 54} cy={MID} r="3" fill="#fff" />
            </>
          )}
        </g>
      ))}

      {/* nullptr labels */}
      {!circular && (
        <text x={xs[2] + w + 40} y={MID + 4} fontSize="11" fontWeight="700" fill="#ef4444">nullptr</text>
      )}
      {type === 'doubly' && (
        <text x={xs[0] + 10} y={B + 46} textAnchor="middle" fontSize="11" fontWeight="700" fill="#ef4444">nullptr</text>
      )}

      {/* Arrows: each one draws along its own curve, one after another */}
      {arrows.map((a, i) => {
        const t0 = 0.03 + i * step;
        const t1 = t0 + len;
        return (
          <g key={i}>
            <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.9;0.97;1" dur={dur} repeatCount="indefinite" />
            <path
              d={a.d}
              fill="none"
              stroke={a.color}
              strokeWidth="2.5"
              strokeLinecap="butt"
              pathLength={1}
              strokeDasharray="1 2"
              strokeDashoffset={1}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="1;1;0;0;1"
                keyTimes={`0;${t0.toFixed(3)};${t1.toFixed(3)};0.98;1`}
                dur={dur}
                repeatCount="indefinite"
              />
            </path>
            <polygon
              points="0,0 -9,-5 -9,5"
              fill={a.color}
              opacity={0}
              transform={`translate(${a.ex} ${a.ey}) rotate(${a.ang})`}
            >
              <animate
                attributeName="opacity"
                values="0;0;1;1"
                keyTimes={`0;${t1.toFixed(3)};${(t1 + 0.02).toFixed(3)};1`}
                dur={dur}
                repeatCount="indefinite"
              />
            </polygon>
          </g>
        );
      })}
    </svg>
  );
};

interface LLNodeData {
  letter: string;
  addr: string;
  x: number;
  y: number;
  color: string;
}

const LL_ITEMS: LLNodeData[] = [
  { letter: 'A', addr: '0x104', x: 90,  y: 60,  color: '#3b82f6' }, // blue
  { letter: 'B', addr: '0x8F2', x: 330, y: 290, color: '#10b981' }, // emerald
  { letter: 'C', addr: '0x3C0', x: 610, y: 70,  color: '#d97706' }, // amber
  { letter: 'D', addr: '0x71A', x: 180, y: 340, color: '#ec4899' }, // pink
  { letter: 'E', addr: '0x25E', x: 460, y: 60,  color: '#8b5cf6' }, // purple
  { letter: 'F', addr: '0x90B', x: 690, y: 280, color: '#06b6d4' }, // cyan
  { letter: 'G', addr: '0x40D', x: 360, y: 170, color: '#f97316' }, // orange
  { letter: 'H', addr: '0x1D8', x: 80,  y: 210, color: '#14b8a6' }, // teal
  { letter: 'I', addr: '0x62F', x: 530, y: 330, color: '#eab308' }, // yellow
  { letter: 'J', addr: '0x5E4', x: 670, y: 170, color: '#f43f5e' }, // rose
];

const LL_STEP_MS = 450;

type LLArrow = Arrow;

const LinkedListAnimation: React.FC = () => {
  const [step, setStep] = useState(0);
  const [travelIndex, setTravelIndex] = useState<number | null>(null);
  const [fade, setFade] = useState(false);

  const totalSteps = 2 * LL_ITEMS.length + 1; // 21 steps for 10 items

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const run = async () => {
      while (!cancelled) {
        setStep(0);
        setTravelIndex(null);
        setFade(false);
        await sleep(700);

        for (let st = 1; st <= totalSteps; st++) {
          if (cancelled) return;
          setStep(st);
          await sleep(LL_STEP_MS);
        }

        await sleep(600);

        for (let i = 0; i < LL_ITEMS.length; i++) {
          if (cancelled) return;
          setTravelIndex(i);
          await sleep(600);
        }
        setTravelIndex(null);
        await sleep(1000);

        if (cancelled) return;
        setFade(true);
        await sleep(500);
        if (cancelled) return;
        setStep(0);
        await sleep(100);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [totalSteps]);

  const nodeW = 60;
  const nodeH = 40;
  const HC = '#f59e0b';

  // HEAD arrow curves from HEAD label to node A
  const headArrow: LLArrow = mkQuad(32, 42, 32, 80, LL_ITEMS[0].x - 3, LL_ITEMS[0].y + 20, HC);

  // Curved pointer arrows connecting scattered nodes in order A->B->C->D->E->F->G->H->I->J
  const nextArrows: LLArrow[] = [
    // A (90,60) -> B (330,290)
    mkCubic(142, 80, 220, 80, 280, 230, 327, 305, LL_ITEMS[0].color),
    // B (330,290) -> C (610,70)
    mkCubic(382, 310, 480, 310, 560, 180, 607, 85, LL_ITEMS[1].color),
    // C (610,70) -> D (180,340)
    mkCubic(662, 90, 520, 20, 320, 220, 243, 345, LL_ITEMS[2].color),
    // D (180,340) -> E (460,60)
    mkCubic(232, 360, 310, 380, 410, 180, 457, 75, LL_ITEMS[3].color),
    // E (460,60) -> F (690,280)
    mkCubic(512, 80, 590, 80, 680, 180, 710, 277, LL_ITEMS[4].color),
    // F (690,280) -> G (360,170)
    mkCubic(742, 300, 650, 380, 520, 240, 423, 190, LL_ITEMS[5].color),
    // G (360,170) -> H (80,210)
    mkCubic(412, 190, 310, 140, 210, 170, 143, 225, LL_ITEMS[6].color),
    // H (80,210) -> I (530,330)
    mkCubic(132, 230, 220, 300, 400, 380, 527, 345, LL_ITEMS[7].color),
    // I (530,330) -> J (670,170)
    mkCubic(582, 350, 650, 350, 680, 270, 690, 213, LL_ITEMS[8].color),
  ];

  const lastNode = LL_ITEMS[LL_ITEMS.length - 1];
  const nullArrow: LLArrow = mkLine(
    lastNode.x + nodeW,
    lastNode.y + nodeH / 2,
    lastNode.x + nodeW + 35,
    lastNode.y + nodeH / 2,
    lastNode.color
  );

  const viewW = 810;
  const viewH = 410;

  const renderArrow = (key: string, a: LLArrow, show: boolean) => (
    <g key={key}>
      <path
        d={a.d}
        fill="none"
        stroke={a.color}
        strokeWidth="2.5"
        pathLength={1}
        strokeDasharray="1 2"
        style={{ strokeDashoffset: show ? 0 : 1, transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <polygon
        points="0,0 -9,-5 -9,5"
        fill={a.color}
        transform={`translate(${a.ex} ${a.ey}) rotate(${a.ang})`}
        style={{ opacity: show ? 1 : 0, transition: `opacity 0.15s ease ${show ? '0.45s' : '0s'}` }}
      />
    </g>
  );

  return (
    <div className="flex flex-col items-center py-6 overflow-x-auto">
      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="w-full h-auto max-w-[780px]"
        role="img"
        aria-label="Scattered linked list build and traversal animation"
      >
        <g style={{ opacity: fade ? 0 : 1, transition: 'opacity 0.45s ease' }}>
          {/* HEAD label + curved arrow */}
          <text
            x="12"
            y="32"
            fontSize="12"
            fontWeight="800"
            fill={HC}
            style={{ opacity: step >= 1 ? 1 : 0, transition: 'opacity 0.4s ease' }}
          >
            HEAD
          </text>
          {renderArrow('head', headArrow, step >= 2)}

          {/* Pointer arrows, each drawn sequentially */}
          {nextArrows.map((a, i) => renderArrow(`next-${i}`, a, step >= 4 + 2 * i))}
          {renderArrow('null', nullArrow, step >= totalSteps)}

          <text
            x={lastNode.x + nodeW + 42}
            y={lastNode.y + nodeH / 2 + 4}
            fontSize="11"
            fontWeight="700"
            fill="#ef4444"
            style={{ opacity: step >= totalSteps ? 1 : 0, transition: 'opacity 0.4s ease 0.4s' }}
          >
            nullptr
          </text>

          {/* Nodes */}
          {LL_ITEMS.map((item, i) => {
            const visible = step >= 1 + 2 * i;
            const isTravel = travelIndex === i;
            return (
              <g
                key={item.letter}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0px)' : 'translateY(-12px)',
                  transition: 'opacity 0.45s ease, transform 0.45s ease',
                }}
              >
                {/* Memory address tag above node */}
                <text
                  x={item.x + nodeW / 2}
                  y={item.y - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#94a3b8"
                >
                  {item.addr}
                </text>

                {/* Main node box */}
                <rect
                  x={item.x}
                  y={item.y}
                  width={nodeW}
                  height={nodeH}
                  rx="7"
                  fill={item.color}
                  stroke={isTravel ? '#fbbf24' : 'none'}
                  strokeWidth="3"
                  style={{ transition: 'stroke 0.3s ease' }}
                />
                <line
                  x1={item.x + nodeW * 0.62}
                  y1={item.y}
                  x2={item.x + nodeW * 0.62}
                  y2={item.y + nodeH}
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1"
                />
                <text
                  x={item.x + nodeW * 0.31}
                  y={item.y + nodeH / 2 + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill="#fff"
                >
                  {item.letter}
                </text>
                <circle cx={item.x + nodeW * 0.81} cy={item.y + nodeH / 2} r="2.5" fill="#fff" />

                {/* Traversal 'current' badge */}
                <text
                  x={item.x + nodeW / 2}
                  y={item.y + nodeH + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill={HC}
                  style={{ opacity: isTravel ? 1 : 0, transition: 'opacity 0.3s ease' }}
                >
                  current
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center px-4 max-w-2xl leading-relaxed">
        Each node stores its data, memory address, and a pointer to the next node. Even when nodes are scattered randomly across memory (non-contiguous memory locations), following pointers starting at HEAD guarantees you read the entire list in exact sequential order.
      </p>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );
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

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Linked lists were one of the first dynamic data structures, developed in the 1950s for the LISP programming language.',
      },
      {
        title: 'Pro Tip',
        text: 'When inserting or deleting at the beginning, linked lists are O(1) – much faster than arrays which require shifting.',
      },
      {
        title: 'Memory Trick',
        text: 'Think of a linked list like a scavenger hunt: each clue (node) tells you where to find the next clue.',
      },
      {
        title: 'Common Mistake',
        text: 'Forgetting to update the head pointer when inserting or deleting at the beginning leads to lost nodes or memory leaks.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Linked lists were one of the first dynamic data structures, developed in the 1950s for the LISP programming language.',
      },
      {
        title: 'Pro Tip',
        text: 'When inserting or deleting at the beginning, linked lists are O(1) – much faster than arrays which require shifting.',
      },
      {
        title: 'Memory Trick',
        text: 'Think of a linked list like a scavenger hunt: each clue (node) tells you where to find the next clue.',
      },
      {
        title: 'Common Mistake',
        text: 'Forgetting to update the head pointer when inserting or deleting at the beginning leads to lost nodes or memory leaks.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

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

  // ─── Syntax highlighting (same as LO1) ────────────────────────────────
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
      'define', 'endl', 'cout', 'cin', 'main', 'bool', 'const', 'new', 'delete',
      'virtual', 'override', 'final', 'template', 'typename', 'auto', 'static',
      'constexpr', 'try', 'catch', 'throw', 'std', 'vector', 'cerr', 'nullptr',
      'this'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string', 'Node'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Preprocessor
    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');

    // Known functions (like insertAtBeginning, etc.)
    const functions = [
      'insertAtBeginning', 'insertAtEnd', 'deleteNode', 'display'
    ];
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
  const nodeStructure = `struct Node {
    int data; // Data stored in the node
    Node* next; // Pointer to the next node

    // Constructor to initialize a new node
    Node(int val) : data(val), next(nullptr) {}
};`;

  const linkedListClass = `class LinkedList {
private:
    Node* head; // Pointer to the first node in the list

public:
    LinkedList() : head(nullptr) {} // Constructor: initially empty list
    // ... (Methods for operations will go here)
};`;

  const displayCode = `void display() {
    Node* current = head; // Start from the head
    while (current != nullptr) { // Traverse until the end
        std::cout << current->data << " -> ";
        current = current->next; // Move to the next node
    }
    std::cout << "nullptr" << std::endl;
}`;

  const insertBeginning = `void insertAtBeginning(int data) {
    Node* newNode = new Node(data); // Create a new node
    newNode->next = head; // New node points to the current head
    head = newNode;      // Head now points to the new node
}`;

  const insertEnd = `void insertAtEnd(int data) {
    Node* newNode = new Node(data);
    if (head == nullptr) { // If list is empty
        head = newNode;
        return;
    }
    Node* last = head;
    while (last->next != nullptr) { // Traverse to the last node
        last = last->next;
    }
    last->next = newNode; // Link the last node to the new node
}`;

  const deleteNode = `void deleteNode(int key) {
    Node* current = head;
    Node* prev = nullptr;
    // If head node holds the key
    if (current != nullptr && current->data == key) {
        head = current->next;
        delete current;
        return;
    }
    // Search for the key, keeping track of the previous node
    while (current != nullptr && current->data != key) {
        prev = current;
        current = current->next;
    }
    // If key was not found
    if (current == nullptr) return;
    // Unlink the node and free memory
    prev->next = current->next;
    delete current;
}`;

  const destructor = `~LinkedList() {
    Node* current = head;
    while (current != nullptr) {
        Node* nextNode = current->next;
        delete current;
        current = nextNode;
    }
    head = nullptr;
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Link size={14} className="inline mr-1" /> LINKED LIST
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Linked List & Dynamic Data Structures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master linked lists: node structure, operations, memory management,
            and comparisons with arrays. Learn to implement dynamic data
            structures efficiently.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Link size={14} className="inline mr-1" /> Nodes
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MemoryStick size={14} className="inline mr-1" /> Dynamic Memory
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
                placeholder="Search for a concept, operation, or comparison..."
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
        <div className="grid grid-cols-1 gap-8">
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Linked Lists
              </h2>

              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">
                  Official Definition
                </p>
                <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div>
                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      A <span className="font-bold">linked list</span> stores a list of items, but not next to each
                      other in memory. Each item, called a <span className="font-bold">node</span>, holds its data
                      plus a pointer that tells you where the next item is. This makes it easy to add or remove
                      items, which is harder to do with an array.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <LinkedListAnimation />
              </div>
            </div>

            {/* ─── Section 2: Basics ────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['basics'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Linked List Basics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {LIST_TYPES.map((t) => (
                  <div key={t.type} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold uppercase tracking-wide" style={{ color: t.color }}>{t.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.desc}</p>
                    <div className="mt-3 rounded-lg bg-white dark:bg-[#0a0a0b] border border-slate-200 dark:border-slate-800 p-2">
                      <ListTypeDiagram type={t.type} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Key Components</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Node:</strong> Contains data and a pointer (next).</li>
                  <li><strong>Head:</strong> Pointer to the first node.</li>
                  <li><strong>Tail (optional):</strong> Pointer to the last node for O(1) insertion at end.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 3: Node Structure ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['node-structure'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Node Structure & LinkedList Class
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Defining the Node Structure</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The fundamental building block is the node. Each node holds data and a pointer to the next node.
                </p>
                <div className="mt-3">
                  <CodeBlock code={nodeStructure} title="node_structure.cpp" id="nodeStructure" />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">The LinkedList Class</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The class manages the list and holds a pointer to the head node. It encapsulates operations.
                </p>
                <div className="mt-3">
                  <CodeBlock code={linkedListClass} title="linked_list_class.cpp" id="linkedListClass" />
                </div>
              </div>
            </div>

            {/* ─── Section 4: Operations ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['operations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Linked List Operations
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Display / Traversal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Traverse from head, following next pointers until nullptr.
                  </p>
                  <div className="mt-3">
                    <CodeBlock code={displayCode} title="display.cpp" id="displayCode" />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Insertion</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Insert at the beginning (O(1)) or at the end (O(n) without tail pointer).
                  </p>
                  <div className="mt-3">
                    <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-400">Insert at Beginning</h5>
                    <CodeBlock code={insertBeginning} title="insert_beginning.cpp" id="insertBeginning" />
                    <h5 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-4">Insert at End</h5>
                    <CodeBlock code={insertEnd} title="insert_end.cpp" id="insertEnd" />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Deleting a Node</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Find the node, adjust the previous node's next pointer to bypass it, and delete it.
                  </p>
                  <div className="mt-3">
                    <CodeBlock code={deleteNode} title="delete_node.cpp" id="deleteNode" />
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 5: Memory Management ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['memory'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Memory Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  In C++, memory for nodes is allocated dynamically using <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">new</code>.
                  It is crucial to deallocate each node when the list is destroyed to prevent memory leaks.
                  This is typically done in the class destructor.
                </p>
                <div className="mt-3">
                  <CodeBlock code={destructor} title="destructor.cpp" id="destructor" />
                </div>
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    ⚠️ <strong>Important:</strong> Always delete dynamically allocated memory. Forgetting to do so causes memory leaks.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Section 6: Comparison ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Array vs Linked List Comparison
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <Table
                  headers={["Feature", "Array‑Based List", "Linked List"]}
                  rows={[
                    ["Memory Allocation", "Contiguous memory", "Dynamic allocation"],
                    ["Access to Elements", "O(1) direct", "O(n) sequential"],
                    ["Insertion/Deletion (beginning)", "O(n)", "O(1)"],
                    ["Insertion/Deletion (end)", "O(1) amortised", "O(n) unless tail"],
                    ["Space Overhead", "Minimal", "Extra memory for pointers"],
                    ["Flexibility", "Fixed size", "Dynamic size"],
                    ["Cache Efficiency", "Cache‑friendly", "Less cache‑friendly"],
                  ]}
                  title="Array vs Linked List"
                />
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Linked List Basics</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Node:</strong> data + next pointer</li>
                    <li><strong>Head:</strong> pointer to first node</li>
                    <li><strong>Types:</strong> Singly, Doubly, Circular</li>
                    <li><strong>Pros:</strong> Dynamic size, efficient insertion/deletion</li>
                    <li><strong>Cons:</strong> No random access, extra memory for pointers</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Operations & Complexity</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Traversal:</strong> O(n)</li>
                    <li><strong>Insert at beginning:</strong> O(1)</li>
                    <li><strong>Insert at end:</strong> O(n) (or O(1) with tail)</li>
                    <li><strong>Delete node:</strong> O(n) to find, O(1) to remove</li>
                    <li><strong>Search:</strong> O(n)</li>
                    <li><strong>Memory:</strong> manual allocation/deallocation (new/delete)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Array vs Linked List</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Access:</strong> Array O(1) vs List O(n)</li>
                    <li><strong>Insert/Delete:</strong> Array O(n) vs List O(1) at known position</li>
                    <li><strong>Memory:</strong> Array contiguous vs List scattered</li>
                    <li><strong>Size:</strong> Array fixed vs List dynamic</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Compare arrays and linked lists" and "Explain how to insert and delete nodes" are common
                      questions. Emphasise the trade‑offs: time complexity, memory usage, and use cases.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Link it. Node it. Delete it. Master it. 🚀</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Linked lists</strong> are dynamic data structures where each
                node points to the next, enabling efficient insertions/deletions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Node structure</strong> contains data and a next pointer.
                The LinkedList class manages the head and operations.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Operations</strong> include traversal, insertion (beginning/end),
                and deletion – each with different time complexities.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Memory management</strong> is crucial – always delete nodes
                to prevent leaks, especially in destructors.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from understanding the trade‑offs
                between arrays and linked lists, and being able to implement and explain operations.
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
            Sidemann Academic Registry • Linked List & Dynamic Data Structures 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;