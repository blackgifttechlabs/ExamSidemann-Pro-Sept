import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Code,
  Terminal,
  GitBranch,
  Lightbulb,
  GraduationCap,
  Table,
  List,
  Copy,
  Check,
  Brain,
  RefreshCw,
  ChevronUp,
  BookOpen,
  X,
  Search,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'stack', label: 'Stack' },
  { id: 'stack-ops', label: 'Stack Ops' },
  { id: 'stack-impl', label: 'Stack Impl' },
  { id: 'stack-apps', label: 'Stack Apps' },
  { id: 'queue', label: 'Queue' },
  { id: 'queue-ops', label: 'Queue Ops' },
  { id: 'queue-impl', label: 'Queue Impl' },
  { id: 'circular', label: 'Circular Queue' },
  { id: 'priority', label: 'Priority Queue' },
  { id: 'queue-apps', label: 'Queue Apps' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// STACK PUSH/POP ANIMATION
// ──────────────────────────────────────────────────────────────────────────────
const STACK_ITEMS = [
  { letter: 'A', color: '#3b82f6' },
  { letter: 'B', color: '#10b981' },
  { letter: 'C', color: '#d97706' },
  { letter: 'D', color: '#ec4899' },
];

const StackLifoAnimation: React.FC = () => {
  const [stack, setStack] = useState<{ letter: string; color: string; phase: 'in' | 'idle' | 'out' }[]>([]);
  const [topIndex, setTopIndex] = useState<number | null>(null);
  const [landed, setLanded] = useState<{ letter: string; color: string }[]>([]);
  const [flyStyle, setFlyStyle] = useState<{ transform: string; transition: string; borderRadius: string } | null>(null);
  const flyRef = useRef<HTMLDivElement | null>(null);
  const traySlotRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const run = async () => {
      while (!cancelled) {
        setStack([]);
        setLanded([]);
        setTopIndex(null);
        setFlyStyle(null);
        await sleep(600);

        for (let i = 0; i < STACK_ITEMS.length; i++) {
          if (cancelled) return;
          const item = { ...STACK_ITEMS[i], phase: 'in' as const };
          setStack((prev) => [...prev, item]);
          await sleep(60);
          setStack((prev) =>
            prev.map((it, idx) => (idx === prev.length - 1 ? { ...it, phase: 'idle' } : it))
          );
          setTopIndex(i);
          await sleep(550);
        }

        await sleep(700);

        for (let i = STACK_ITEMS.length - 1; i >= 0; i--) {
          if (cancelled) return;
          const poppedItem = STACK_ITEMS[i];
          const slotIndex = STACK_ITEMS.length - 1 - i;

          setStack((prev) =>
            prev.map((it, idx) => (idx === prev.length - 1 ? { ...it, phase: 'out' } : it))
          );
          setTopIndex(i - 1 >= 0 ? i - 1 : null);
          // Start at identity transform, transition disabled — this is the
          // pre-animation frame the element sits at before we kick off the move.
          setFlyStyle({ transform: 'translate(0px, 0px) scale(1, 1)', transition: 'none', borderRadius: '0.5rem' });

          await sleep(40);
          const flyEl = flyRef.current;
          const slotEl = traySlotRefs.current[slotIndex];
          if (flyEl && slotEl) {
            const flyRect = flyEl.getBoundingClientRect();
            const slotRect = slotEl.getBoundingClientRect();
            const dx = slotRect.left + slotRect.width / 2 - (flyRect.left + flyRect.width / 2);
            const dy = slotRect.top + slotRect.height / 2 - (flyRect.top + flyRect.height / 2);
            const sx = Math.max(0.2, slotRect.width / flyRect.width);
            const sy = Math.max(0.2, slotRect.height / flyRect.height);

            // Force a reflow so the browser commits the "at rest" frame above
            // before we change the target — otherwise the two states can get
            // batched together and the shrink never gets painted as a step.
            void flyEl.getBoundingClientRect();

            requestAnimationFrame(() => {
              setFlyStyle({
                transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
                transition: 'transform 0.95s cubic-bezier(0.45, 0, 0.55, 1), border-radius 0.95s cubic-bezier(0.45, 0, 0.55, 1)',
                borderRadius: '0.375rem',
              });
            });
          }

          await sleep(950);
          setFlyStyle(null);
          setStack((prev) => prev.slice(0, -1));
          setLanded((prev) => [...prev, { letter: poppedItem.letter, color: poppedItem.color }]);
          await sleep(150);
        }

        await sleep(500);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="flex flex-row items-start justify-center gap-16">
        <div className="relative w-40 h-64">
          {topIndex !== null && (
            <div
              className="absolute -left-20 flex items-center gap-1.5"
              style={{ bottom: `${28 + topIndex * 52}px`, transition: 'bottom 0.4s ease' }}
            >
              <span className="text-sm font-extrabold text-amber-500 dark:text-amber-400 tracking-wide drop-shadow-sm">
                TOP
              </span>
              <span className="text-xl font-black text-amber-500 dark:text-amber-400 leading-none drop-shadow-sm">
                &rarr;
              </span>
            </div>
          )}

          {stack.map((item, idx) => {
            const isFlying = item.phase === 'out';
            const baseStyle: React.CSSProperties = {
              position: 'absolute',
              left: 'calc(50% - 4rem)',
              bottom: `${20 + idx * 52}px`,
              backgroundColor: item.color,
              boxShadow:
                item.phase === 'idle' && idx === stack.length - 1
                  ? `0 0 18px ${item.color}`
                  : 'none',
              willChange: isFlying ? 'transform, border-radius' : undefined,
            };

            let motionStyle: React.CSSProperties = {};
            if (isFlying) {
              motionStyle = flyStyle
                ? {
                    transform: flyStyle.transform,
                    transition: flyStyle.transition,
                    borderRadius: flyStyle.borderRadius,
                  }
                : { transform: 'translate(0px, 0px) scale(1, 1)', borderRadius: '0.5rem' };
            } else if (item.phase === 'in') {
              motionStyle = {
                transform: 'translateY(-160px) scale(0.9)',
                transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
              };
            } else {
              motionStyle = {
                transform: 'translateY(0) scale(1)',
                transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease',
              };
            }

            return (
              <div
                key={`${item.letter}-${idx}`}
                ref={isFlying ? flyRef : undefined}
                className="w-32 h-11 flex items-center justify-center font-extrabold text-white text-lg shadow-lg"
                style={{ ...baseStyle, ...motionStyle }}
              >
                {item.letter}
              </div>
            );
          })}

          <div
            className="absolute w-32 h-2 opacity-40"
            style={{
              left: 'calc(50% - 4rem)',
              bottom: '8px',
              backgroundImage:
                'repeating-linear-gradient(45deg, #64748b 0, #64748b 2px, transparent 2px, transparent 8px)',
            }}
          />
        </div>

        <div className="flex flex-row gap-2 justify-start pt-2">
          {[0, 1, 2, 3].map((slot) => {
            const item = landed[slot];
            return (
              <div
                key={slot}
                ref={(el) => { traySlotRefs.current[slot] = el; }}
                className="w-9 h-9 rounded-md flex items-center justify-center text-xs font-bold border-2 transition-colors duration-200"
                style={{
                  backgroundColor: item ? item.color : 'transparent',
                  borderStyle: item ? 'solid' : 'dashed',
                  borderColor: item ? item.color : '#475569',
                  color: item ? '#fff' : 'transparent',
                  opacity: item ? 1 : 0.5,
                }}
              >
                {item ? item.letter : ''}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-3">
        Push adds a block to the top. Pop removes the block from the top.
      </p>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
// ──────────────────────────────────────────────────────────────────────────────
// STACK OPERATION ILLUSTRATIONS (Push / Pop / Peek / IsEmpty-IsFull)
// ──────────────────────────────────────────────────────────────────────────────
const OP_COLORS: Record<string, string> = {
  A: '#3b82f6',
  B: '#10b981',
  C: '#d97706',
  D: '#ec4899',
};

const OpCup: React.FC<{ x: number }> = ({ x }) => (
  <path
    d={`M${x} 15 V100 H${x + 60} V15`}
    fill="none"
    stroke="#64748b"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const OpBlock: React.FC<{ x: number; y: number; k: string; glow?: boolean }> = ({ x, y, k, glow }) => (
  <g>
    <rect
      x={x + 5}
      y={y}
      width="50"
      height="18"
      rx="3"
      fill={OP_COLORS[k]}
      stroke={glow ? '#fbbf24' : 'none'}
      strokeWidth="2"
    >
      {glow && (
        <animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
      )}
    </rect>
    <text x={x + 30} y={y + 13} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
      {k}
    </text>
  </g>
);

const OpLabel: React.FC<{ x: number; y: number; text: string; color?: string; pulse?: boolean }> = ({
  x,
  y,
  text,
  color = '#64748b',
  pulse,
}) => (
  <text x={x} y={y} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>
    {text}
    {pulse && <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" repeatCount="indefinite" />}
  </text>
);

const StackOpIllustration: React.FC<{ type: 'push' | 'pop' | 'peek' | 'state' }> = ({ type }) => {
  const wide = type === 'state';
  return (
    <div className="my-3 flex justify-center">
      <svg
        viewBox={wide ? '0 0 220 120' : '0 0 160 120'}
        className={`w-full h-auto ${wide ? 'max-w-[240px]' : 'max-w-[190px]'}`}
        role="img"
        aria-label={`Stack ${type} illustration`}
      >
        {type === 'push' && (
          <>
            <OpCup x={50} />
            <OpBlock x={50} y={80} k="A" />
            <OpBlock x={50} y={60} k="B" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 -55;0 0;0 0;0 -55"
                keyTimes="0;0.4;0.85;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.4;0.85;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <OpBlock x={50} y={40} k="C" />
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 -6;0 8;0 -6"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <line x1="132" y1="12" x2="132" y2="36" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <polygon points="123,34 141,34 132,48" fill="#10b981" />
            </g>
            <text x="132" y="68" textAnchor="middle" fontSize="10" fontWeight="800" fill="#10b981">
              IN
            </text>
            <OpLabel x={80} y={114} text="PUSH C: add on top" color="#10b981" />
          </>
        )}

        {type === 'pop' && (
          <>
            <OpCup x={50} />
            <OpBlock x={50} y={80} k="A" />
            <OpBlock x={50} y={60} k="B" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;0 0;0 -55;0 -55"
                keyTimes="0;0.3;0.7;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;1;0;0"
                keyTimes="0;0.3;0.7;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <OpBlock x={50} y={40} k="C" />
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 8;0 -6;0 8"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <line x1="132" y1="48" x2="132" y2="24" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <polygon points="123,26 141,26 132,12" fill="#ef4444" />
            </g>
            <text x="132" y="68" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ef4444">
              OUT
            </text>
            <OpLabel x={80} y={114} text="POP: remove from top" color="#ef4444" />
          </>
        )}

        {type === 'peek' && (
          <>
            <OpCup x={50} />
            <OpBlock x={50} y={80} k="A" />
            <OpBlock x={50} y={60} k="B" />
            <OpBlock x={50} y={40} k="C" glow />
            <text x="4" y="53" fontSize="10" fontWeight="800" fill="#f59e0b">
              TOP →
            </text>
            <g>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.25;0.8;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <rect x="116" y="38" width="42" height="22" rx="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="137" y="53" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f59e0b">
                = C
              </text>
            </g>
            <OpLabel x={80} y={114} text="PEEK: look, don't remove" color="#f59e0b" />
          </>
        )}

        {type === 'state' && (
          <>
            {/* Empty stack */}
            <OpCup x={20} />
            <OpLabel x={50} y={60} text="empty" />
            <OpLabel x={50} y={114} text="isEmpty() = true" color="#3b82f6" pulse />
            {/* Full stack */}
            <OpCup x={140} />
            <OpBlock x={140} y={80} k="A" />
            <OpBlock x={140} y={60} k="B" />
            <OpBlock x={140} y={40} k="C" />
            <OpBlock x={140} y={20} k="D" />
            <OpLabel x={170} y={114} text="isFull() = true" color="#ec4899" pulse />
          </>
        )}
      </svg>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// QUEUE ENQUEUE/DEQUEUE ANIMATION
// ──────────────────────────────────────────────────────────────────────────────
const QUEUE_ITEMS = [
  { letter: 'A', color: '#3b82f6' },
  { letter: 'B', color: '#10b981' },
  { letter: 'C', color: '#d97706' },
  { letter: 'D', color: '#ec4899' },
];
const Q_STEP = 52;

const QueueFifoAnimation: React.FC = () => {
  type Status = 'waiting' | 'in' | 'out';
  const [status, setStatus] = useState<Status[]>(QUEUE_ITEMS.map(() => 'waiting'));
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const run = async () => {
      while (!cancelled) {
        // Reset without any animation
        setInstant(true);
        setStatus(QUEUE_ITEMS.map(() => 'waiting' as Status));
        await sleep(80);
        setInstant(false);
        await sleep(500);

        // Enqueue: each block slides in at the rear
        for (let j = 0; j < QUEUE_ITEMS.length; j++) {
          if (cancelled) return;
          setStatus((prev) => prev.map((s, i) => (i === j ? 'in' : s)));
          await sleep(850);
        }

        await sleep(900);

        // Dequeue: the front block slides out, the others move up together
        for (let j = 0; j < QUEUE_ITEMS.length; j++) {
          if (cancelled) return;
          setStatus((prev) => {
            const k = prev.indexOf('in');
            return prev.map((s, i) => (i === k ? 'out' : s));
          });
          await sleep(850);
        }

        await sleep(600);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const count = status.filter((s) => s === 'in').length;
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const moveTransition = instant ? 'none' : 'transform 0.75s ' + ease + ', opacity 0.6s ease';

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative" style={{ width: 4 * Q_STEP, height: 110 }}>
        {/* Base line under the queue */}
        <div
          className="absolute h-2 opacity-40"
          style={{
            left: 0,
            width: 4 * Q_STEP - 8,
            top: 84,
            backgroundImage:
              'repeating-linear-gradient(45deg, #64748b 0, #64748b 2px, transparent 2px, transparent 8px)',
          }}
        />

        {/* FRONT label (always at the first place) */}
        <span
          className="absolute text-[10px] font-extrabold text-amber-500 dark:text-amber-400 text-center"
          style={{
            left: 0,
            top: 10,
            width: 44,
            opacity: count > 0 ? 1 : 0,
            transition: instant ? 'none' : 'opacity 0.5s ease',
          }}
        >
          FRONT
        </span>

        {/* REAR label (follows the last block) */}
        <span
          className="absolute text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 text-center"
          style={{
            left: 0,
            top: 84,
            width: 44,
            opacity: count > 0 ? 1 : 0,
            transform: 'translate3d(' + Math.max(0, count - 1) * Q_STEP + 'px, 0, 0)',
            transition: instant ? 'none' : 'transform 0.75s ' + ease + ', opacity 0.5s ease',
            willChange: 'transform, opacity',
          }}
        >
          REAR
        </span>

        {QUEUE_ITEMS.map((item, i) => {
          const s = status[i];
          let pos = 0;
          for (let k = 0; k < i; k++) if (status[k] === 'in') pos++;

          let x = 4 * Q_STEP;
          if (s === 'in') x = pos * Q_STEP;
          if (s === 'out') x = -Q_STEP;

          return (
            <div
              key={item.letter}
              className="absolute w-11 h-11 rounded-lg flex items-center justify-center font-extrabold text-white text-lg shadow-lg"
              style={{
                left: 0,
                top: 30,
                backgroundColor: item.color,
                opacity: s === 'in' ? 1 : 0,
                transform: 'translate3d(' + x + 'px, 0, 0)',
                transition: moveTransition,
                willChange: 'transform, opacity',
              }}
            >
              {item.letter}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 text-center">
        Enqueue adds a block at the rear. Dequeue removes the block from the front.
      </p>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// QUEUE OPERATION ILLUSTRATIONS (Enqueue / Dequeue / Peek / IsEmpty)
// ──────────────────────────────────────────────────────────────────────────────
const qSlotX = (i: number) => 20 + i * 38;

const QOpTrack: React.FC = () => (
  <>
    {[0, 1, 2, 3].map((i) => (
      <rect
        key={i}
        x={qSlotX(i)}
        y={45}
        width="34"
        height="34"
        rx="6"
        fill="none"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.5"
      />
    ))}
    <line x1="16" y1="86" x2="176" y2="86" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
  </>
);

const QOpBlock: React.FC<{ slot: number; k: string; glow?: boolean }> = ({ slot, k, glow }) => (
  <g>
    <rect
      x={qSlotX(slot)}
      y={45}
      width="34"
      height="34"
      rx="6"
      fill={OP_COLORS[k]}
      stroke={glow ? '#fbbf24' : 'none'}
      strokeWidth="2.5"
    >
      {glow && (
        <animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />
      )}
    </rect>
    <text x={qSlotX(slot) + 17} y={67} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">
      {k}
    </text>
  </g>
);

const QueueOpIllustration: React.FC<{ type: 'enqueue' | 'dequeue' | 'peek' | 'empty' }> = ({ type }) => {
  return (
    <div className="my-3 flex justify-center">
      <svg
        viewBox="0 0 200 120"
        className="w-full h-auto max-w-[240px]"
        role="img"
        aria-label={`Queue ${type} illustration`}
      >
        <QOpTrack />

        {type === 'enqueue' && (
          <>
            <QOpBlock slot={0} k="A" />
            <QOpBlock slot={1} k="B" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="60 0;0 0;0 0;60 0"
                keyTimes="0;0.4;0.85;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.4;0.85;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <QOpBlock slot={2} k="C" />
            </g>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="6 0;-6 0;6 0"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <line x1="188" y1="24" x2="164" y2="24" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              <polygon points="166,15 166,33 152,24" fill="#10b981" />
            </g>
            <text x="172" y="11" textAnchor="middle" fontSize="10" fontWeight="800" fill="#10b981">
              IN
            </text>
            <text x="58" y="30" textAnchor="middle" fontSize="9" fontWeight="800" fill="#10b981">
              REAR
            </text>
            <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#10b981">
              ENQUEUE C: add at the rear
            </text>
          </>
        )}

        {type === 'dequeue' && (
          <>
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0;0 0;-45 0;-45 0"
                keyTimes="0;0.3;0.7;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;1;0;0"
                keyTimes="0;0.3;0.7;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <QOpBlock slot={0} k="A" />
            </g>
            <QOpBlock slot={1} k="B" />
            <QOpBlock slot={2} k="C" />
            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="6 0;-6 0;6 0"
                dur="1.5s"
                repeatCount="indefinite"
              />
              <line x1="54" y1="24" x2="30" y2="24" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              <polygon points="32,15 32,33 18,24" fill="#ef4444" />
            </g>
            <text x="38" y="11" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ef4444">
              OUT
            </text>
            <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#ef4444">
              DEQUEUE: remove from the front
            </text>
          </>
        )}

        {type === 'peek' && (
          <>
            <QOpBlock slot={0} k="A" glow />
            <QOpBlock slot={1} k="B" />
            <QOpBlock slot={2} k="C" />
            <text x="37" y="34" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f59e0b">
              FRONT ↓
            </text>
            <g>
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.25;0.8;1"
                dur="3s"
                repeatCount="indefinite"
              />
              <rect x="150" y="50" width="42" height="24" rx="6" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="171" y="66" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f59e0b">
                = A
              </text>
            </g>
            <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#f59e0b">
              PEEK: look, don't remove
            </text>
          </>
        )}

        {type === 'empty' && (
          <>
            <text x="98" y="67" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">
              empty
              <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" repeatCount="indefinite" />
            </text>
            <text x="100" y="112" textAnchor="middle" fontSize="9" fontWeight="700" fill="#3b82f6">
              isEmpty() = true
              <animate attributeName="opacity" values="1;0.35;1" dur="1.5s" repeatCount="indefinite" />
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// CIRCULAR QUEUE ANIMATION
// ──────────────────────────────────────────────────────────────────────────────
const CQ_N = 6;
const CQ_C = 130;
const CQ_COLORS = ['#3b82f6', '#10b981', '#d97706', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444', '#84cc16'];
const CQ_OPS: { t: 'enq' | 'deq'; l?: string; m: string }[] = [
  { t: 'enq', l: 'A', m: 'Enqueue A: it goes at the rear.' },
  { t: 'enq', l: 'B', m: 'Enqueue B.' },
  { t: 'enq', l: 'C', m: 'Enqueue C.' },
  { t: 'enq', l: 'D', m: 'Enqueue D.' },
  { t: 'enq', l: 'E', m: 'Enqueue E.' },
  { t: 'enq', l: 'F', m: 'Enqueue F. The last place is full.' },
  { t: 'deq', m: 'Dequeue: A leaves. The front moves forward.' },
  { t: 'deq', m: 'Dequeue: B leaves. Now places 0 and 1 are free.' },
  { t: 'enq', l: 'G', m: 'Enqueue G: the rear goes back to place 0!' },
  { t: 'enq', l: 'H', m: 'Enqueue H: it reuses place 1.' },
];

const cqPos = (i: number, r: number) => {
  const a = ((-90 + (i * 360) / CQ_N) * Math.PI) / 180;
  return { x: CQ_C + r * Math.cos(a), y: CQ_C + r * Math.sin(a) };
};

const CircularQueueAnimation: React.FC = () => {
  const [view, setView] = useState<{
    slots: (string | null)[];
    ghost: (string | null)[];
    front: number;
    count: number;
    msg: string;
  }>({
    slots: Array(CQ_N).fill(null),
    ghost: Array(CQ_N).fill(null),
    front: 0,
    count: 0,
    msg: 'A circular queue is a ring of places.',
  });

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const run = async () => {
      while (!cancelled) {
        let slots: (string | null)[] = Array(CQ_N).fill(null);
        let ghost: (string | null)[] = Array(CQ_N).fill(null);
        let front = 0;
        let count = 0;
        setView({ slots, ghost, front, count, msg: 'A circular queue is a ring of places.' });
        await sleep(1200);

        for (const op of CQ_OPS) {
          if (cancelled) return;
          if (op.t === 'enq') {
            const idx = (front + count) % CQ_N;
            slots = [...slots];
            ghost = [...ghost];
            slots[idx] = op.l as string;
            ghost[idx] = op.l as string;
            count++;
          } else {
            slots = [...slots];
            slots[front] = null;
            front = (front + 1) % CQ_N;
            count--;
          }
          setView({ slots, ghost, front, count, msg: op.m });
          await sleep(1300);
        }

        await sleep(1500);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const rear = (view.front + view.count - 1 + CQ_N) % CQ_N;
  const frontOut = cqPos(view.front, 114);
  const rearIn = cqPos(rear, 42);
  const ease = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease';

  return (
    <div className="flex flex-col items-center py-6">
      <svg viewBox="0 0 260 260" className="w-full h-auto max-w-[280px]" role="img" aria-label="Circular queue animation">
        {/* ring line */}
        <circle cx={CQ_C} cy={CQ_C} r="70" fill="none" stroke="#94a3b8" strokeWidth="1" opacity="0.3" />

        {Array.from({ length: CQ_N }).map((_, i) => {
          const p = cqPos(i, 70);
          const n = cqPos(i, 96);
          const filled = view.slots[i] !== null;
          const letter = view.ghost[i];
          const color = letter ? CQ_COLORS[letter.charCodeAt(0) - 65] : '#64748b';
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r="17"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="17"
                fill={color}
                style={{ opacity: filled ? 1 : 0, transition: 'opacity 0.5s ease' }}
              />
              <text
                x={p.x}
                y={p.y + 5}
                textAnchor="middle"
                fontSize="14"
                fontWeight="800"
                fill="#fff"
                style={{ opacity: filled ? 1 : 0, transition: 'opacity 0.5s ease' }}
              >
                {letter}
              </text>
              <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8">
                {i}
              </text>
            </g>
          );
        })}

        {/* FRONT label (outside the ring) */}
        <g
          style={{
            transform: `translate(${frontOut.x}px, ${frontOut.y}px)`,
            opacity: view.count > 0 ? 1 : 0,
            transition: ease,
          }}
        >
          <text textAnchor="middle" y="3" fontSize="10" fontWeight="800" fill="#f59e0b">
            FRONT
          </text>
        </g>

        {/* REAR label (inside the ring) */}
        <g
          style={{
            transform: `translate(${rearIn.x}px, ${rearIn.y}px)`,
            opacity: view.count > 0 ? 1 : 0,
            transition: ease,
          }}
        >
          <text textAnchor="middle" y="3" fontSize="10" fontWeight="800" fill="#10b981">
            REAR
          </text>
        </g>
      </svg>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 text-center min-h-[2.5rem]">
        {view.msg}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 text-center">
        The rear goes back to place 0 when it reaches the end and there is free space.
      </p>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// PRIORITY QUEUE ANIMATION
// ──────────────────────────────────────────────────────────────────────────────
const PQ_ITEMS = [
  { letter: 'A', level: 1, name: 'LOW', color: '#10b981' },
  { letter: 'B', level: 3, name: 'HIGH', color: '#ef4444' },
  { letter: 'C', level: 2, name: 'MEDIUM', color: '#d97706' },
  { letter: 'D', level: 3, name: 'HIGH', color: '#ef4444' },
];

const PQ_STEPS: { t: 'enq' | 'deq'; m: string }[] = [
  { t: 'enq', m: 'Enqueue A (LOW).' },
  { t: 'enq', m: 'Enqueue B (HIGH): it moves ahead of A.' },
  { t: 'enq', m: 'Enqueue C (MEDIUM): it goes between B and A.' },
  { t: 'enq', m: 'Enqueue D (HIGH): it goes after B, because B came first.' },
  { t: 'deq', m: 'Dequeue: B leaves first (HIGH, and it came first).' },
  { t: 'deq', m: 'Dequeue: D leaves next (HIGH).' },
  { t: 'deq', m: 'Dequeue: C leaves (MEDIUM).' },
  { t: 'deq', m: 'Dequeue: A leaves last (LOW).' },
];

// true if item a must leave before item b
const pqBefore = (a: number, b: number) =>
  PQ_ITEMS[a].level > PQ_ITEMS[b].level || (PQ_ITEMS[a].level === PQ_ITEMS[b].level && a < b);

const PriorityQueueAnimation: React.FC = () => {
  type Status = 'waiting' | 'in' | 'out';
  const [status, setStatus] = useState<Status[]>(PQ_ITEMS.map(() => 'waiting'));
  const [msg, setMsg] = useState('Every item has a priority.');
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    const run = async () => {
      while (!cancelled) {
        setInstant(true);
        setStatus(PQ_ITEMS.map(() => 'waiting' as Status));
        setMsg('Every item has a priority.');
        await sleep(80);
        setInstant(false);
        await sleep(1200);

        let enqIndex = 0;
        for (const step of PQ_STEPS) {
          if (cancelled) return;
          setMsg(step.m);
          if (step.t === 'enq') {
            const j = enqIndex++;
            setStatus((prev) => prev.map((s, i) => (i === j ? 'in' : s)));
          } else {
            setStatus((prev) => {
              let best = -1;
              prev.forEach((s, i) => {
                if (s === 'in' && (best === -1 || pqBefore(i, best))) best = i;
              });
              return prev.map((s, i) => (i === best ? 'out' : s));
            });
          }
          await sleep(1500);
        }

        await sleep(1200);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const count = status.filter((s) => s === 'in').length;
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const moveTransition = instant ? 'none' : 'transform 0.75s ' + ease + ', opacity 0.6s ease';

  return (
    <div className="flex flex-col items-center py-6">
      <div className="relative" style={{ width: 4 * Q_STEP, height: 120 }}>
        {/* Base line */}
        <div
          className="absolute h-2 opacity-40"
          style={{
            left: 0,
            width: 4 * Q_STEP - 8,
            top: 96,
            backgroundImage:
              'repeating-linear-gradient(45deg, #64748b 0, #64748b 2px, transparent 2px, transparent 8px)',
          }}
        />

        {/* FRONT label */}
        <span
          className="absolute text-[10px] font-extrabold text-amber-500 dark:text-amber-400 text-center"
          style={{
            left: 0,
            top: 6,
            width: 44,
            opacity: count > 0 ? 1 : 0,
            transition: instant ? 'none' : 'opacity 0.5s ease',
          }}
        >
          FRONT
        </span>

        {PQ_ITEMS.map((item, i) => {
          const s = status[i];
          let pos = 0;
          for (let k = 0; k < PQ_ITEMS.length; k++) {
            if (k !== i && status[k] === 'in' && pqBefore(k, i)) pos++;
          }

          let x = 4 * Q_STEP;
          if (s === 'in') x = pos * Q_STEP;
          if (s === 'out') x = -Q_STEP;

          return (
            <div
              key={item.letter}
              className="absolute w-11 h-14 rounded-lg flex flex-col items-center justify-center text-white shadow-lg"
              style={{
                left: 0,
                top: 28,
                backgroundColor: item.color,
                opacity: s === 'in' ? 1 : 0,
                transform: 'translate3d(' + x + 'px, 0, 0)',
                transition: moveTransition,
                willChange: 'transform, opacity',
              }}
            >
              <span className="text-lg font-extrabold leading-none">{item.letter}</span>
              <span className="text-[8px] font-bold mt-1 leading-none">{item.name}</span>
            </div>
          );
        })}
      </div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2 text-center min-h-[2.5rem]">
        {msg}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 text-center">
        The item with the highest priority is always at the front.
      </p>
    </div>
  );
};

export const LearningOutcome5: React.FC = () => {
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
        text: 'The undo/redo feature in most applications is implemented using two stacks – one for undo, one for redo.',
      },
      {
        title: 'Pro Tip',
        text: 'Use a queue when you need to process elements in the order they arrive – like task scheduling or breadth‑first search.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: Stack = LIFO (Last In First Out) – like a stack of plates. Queue = FIFO (First In First Out) – like a queue of people.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse circular queue with priority queue – they serve different purposes: circular for space efficiency, priority for ordering by priority.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The undo/redo feature in most applications is implemented using two stacks – one for undo, one for redo.',
      },
      {
        title: 'Pro Tip',
        text: 'Use a queue when you need to process elements in the order they arrive – like task scheduling or breadth‑first search.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: Stack = LIFO (Last In First Out) – like a stack of plates. Queue = FIFO (First In First Out) – like a queue of people.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse circular queue with priority queue – they serve different purposes: circular for space efficiency, priority for ordering by priority.',
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
      'constexpr', 'try', 'catch', 'throw', 'std', 'vector', 'queue', 'cerr'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string', 'vector'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Preprocessor
    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');

    // Known functions (like push, pop, etc.)
    const functions = [
      'push', 'pop', 'peek', 'isEmpty', 'isFull', 'size', 'enqueue', 'dequeue',
      'exampleStdQueue', 'exampleFixedSizeQueue'
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
  const stackCode = `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> s;

    s.push(10);
    s.push(20);
    s.push(30);

    cout << s.top() << endl;    // 30 (look at the top)
    s.pop();                    // remove 30

    cout << s.top() << endl;    // 20
    cout << s.size() << endl;   // 2
    cout << s.empty() << endl;  // 0 (means false)

    return 0;
}`;

  const queueCode = `#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> q;

    q.push(10);
    q.push(20);
    q.push(30);

    cout << q.front() << endl;   // 10 (front item)
    q.pop();                     // remove 10

    cout << q.front() << endl;   // 20
    cout << q.size() << endl;    // 2
    cout << q.empty() << endl;   // 0 (false)

    return 0;
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Layers size={14} className="inline mr-1" /> STACK & QUEUE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Simply Easy Stack & Queue
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the fundamentals of stack (LIFO) and queue (FIFO) data structures:
            operations, implementations, applications, and advanced variants like circular
            and priority queues.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ArrowUp size={14} className="inline mr-1" /> Stack
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ArrowDown size={14} className="inline mr-1" /> Queue
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
                placeholder="Search for a concept, operation, or application..."
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
                Introduction to Stack & Queue
              </h2>

              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">
                  Official Definition
                </p>
                <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <div>
                    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      A <span className="font-bold">stack</span> and a <span className="font-bold">queue</span> are
                      both simple ways to store a list of items. The difference is the order you take items out.
                      In a stack, you always remove the item you added <strong>last</strong> (this is called LIFO).
                      In a queue, you always remove the item you added <strong>first</strong> (this is called FIFO).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                  Types of Data Structures
                </h3>
                <ul className="list-disc pl-5 space-y-4">
                  <li className="text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Stack (LIFO)</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      You can only add or remove items from the top. Think of a pile of plates — you always take
                      the top plate first, and you always put a new plate on top.
                    </p>
                  </li>
                  <li className="text-slate-800 dark:text-slate-200">
                    <span className="font-bold">Queue (FIFO)</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      You add new items at the back and remove items from the front. Think of people standing
                      in a line — the first person to join the line is the first one served.
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            {/* ─── Section 2: Stack ──────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Stack (LIFO)
              </h2>
              <div>
                <ul className="list-disc pl-5 space-y-2 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A stack stores items in a line, one on top of another.</li>
                  <li>
                    It follows the <strong>Last‑In‑First‑Out (LIFO)</strong> rule — like a pile of plates: the last
                    plate you put on top is the first one you take off.
                  </li>
                  <li>You can only add or remove items from the top — never the middle or bottom.</li>
                  <li>Computers use stacks to remember what to do next, like keeping track of function calls.</li>
                  <li>Stacks also power undo/redo buttons and check things like matching brackets in code.</li>
                </ul>
              </div>
              <StackLifoAnimation />
            </div>

            {/* ─── Section 3: Stack Operations ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack-ops'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Key Operations on a Stack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Push</h4>
                  <StackOpIllustration type="push" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adds an element to the top of the stack.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Pop</h4>
                  <StackOpIllustration type="pop" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Removes the top element from the stack.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Peek / Top</h4>
                  <StackOpIllustration type="peek" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Returns the top element without removing it.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">IsEmpty / IsFull</h4>
                  <StackOpIllustration type="state" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Checks if the stack is empty or full (for fixed‑size implementations).</p>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Stack Implementation ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack-impl'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Implementation of a Stack
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  This is the simplest C++ stack. It uses the built-in std::stack, so push, top, pop, size and empty are ready to use.
                </p>
              <CodeBlock code={stackCode} title="stack_implementation.cpp" id="stackCode" />
            </div>

            {/* ─── Section 5: Stack Applications ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack-apps'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Applications of Stacks
              </h2>
              <ol className="list-decimal pl-6 space-y-3 text-base text-slate-700 dark:text-slate-300 leading-relaxed marker:font-bold marker:text-black dark:marker:text-white">
                <li>Function Call Stack (recursion)</li>
                <li>Undo/Redo functionality</li>
                <li>Backtracking algorithms (e.g., maze solving)</li>
                <li>Expression evaluation (infix, postfix, prefix)</li>
                <li>Browser history (back/forward)</li>
                <li>Balancing parentheses / syntax checking</li>
              </ol>
            </div>

            {/* ─── Section 6: Queue ───────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Queue (FIFO)
              </h2>
              <div>
                <ul className="list-disc pl-5 space-y-2 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A queue stores items in a line, one after another.</li>
                  <li>
                    It follows the <strong>First-In-First-Out (FIFO)</strong> rule - like people in a line: the first
                    person to join is the first one served.
                  </li>
                  <li>You add items at the back (rear) and remove items from the front.</li>
                  <li>Computers use queues to do things in order, like print jobs and tasks waiting for the CPU.</li>
                  <li>Queues also handle keyboard input and help search a graph level by level (BFS).</li>
                </ul>
              </div>
              <QueueFifoAnimation />
            </div>

            {/* ─── Section 7: Queue Operations ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue-ops'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Queue Operations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Enqueue</h4>
                  <QueueOpIllustration type="enqueue" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adds an element to the rear of the queue.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Dequeue</h4>
                  <QueueOpIllustration type="dequeue" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Removes the front element from the queue.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Peek / Front</h4>
                  <QueueOpIllustration type="peek" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Returns the front element without removing it.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">IsEmpty</h4>
                  <QueueOpIllustration type="empty" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Checks if the queue is empty.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 8: Queue Implementation ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue-impl'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Implementation of a Queue
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                This is the simplest C++ queue. It uses the built-in std::queue, so push, front, pop, size and empty are ready to use.
              </p>
              <CodeBlock code={queueCode} title="queue_implementation.cpp" id="queueCode" />
            </div>

            {/* ─── Section 9: Circular Queue ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['circular'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Circular Queue
              </h2>
              <div>
                <ul className="list-disc pl-5 space-y-2 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A circular queue is a queue where the end joins back to the start, like a ring.</li>
                  <li>
                    It still follows <strong>FIFO</strong> - the first item in is the first item out.
                  </li>
                  <li>When the rear reaches the last place, it goes back to place 0 if that place is free.</li>
                  <li>
                    This reuses empty places, so we never shift items. The trick is{' '}
                    <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">(index + 1) % size</code>.
                  </li>
                  <li>It is also called a <strong>ring buffer</strong>. It is used for keyboard and streaming buffers.</li>
                </ul>
              </div>
              <CircularQueueAnimation />
            </div>

            {/* ─── Section 10: Priority Queue ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['priority'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Priority Queue
              </h2>
              <div>
                <ul className="list-disc pl-5 space-y-2 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A priority queue is a queue where every item has a priority.</li>
                  <li>
                    The item with the <strong>highest priority</strong> leaves first, not the oldest item.
                  </li>
                  <li>If two items have the same priority, the one that came first leaves first (FIFO).</li>
                  <li>Computers use it to run important tasks first, and in Dijkstra's algorithm.</li>
                  <li>It is usually built with a <strong>heap</strong>, so adding and removing takes O(log n) time.</li>
                </ul>
              </div>
              <PriorityQueueAnimation />
            </div>

            {/* ─── Section 11: Queue Applications ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue-apps'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Applications of Queues
              </h2>
              <ol className="list-decimal pl-6 space-y-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed marker:font-bold marker:text-black dark:marker:text-white">
                <li>
                  <strong>Breadth-First Search (BFS)</strong> - a queue holds the nodes to visit next, so a graph is
                  explored level by level.
                </li>
                <li>
                  <strong>Print Queue</strong> - print jobs wait in line. The first job sent is the first one printed.
                </li>
                <li>
                  <strong>Task Scheduling</strong> - the operating system keeps waiting tasks in a queue and gives each
                  one a turn on the CPU.
                </li>
                <li>
                  <strong>Simulation</strong> - a queue models real lines, like cars at a traffic light or customers
                  at a bank.
                </li>
                <li>
                  <strong>Keyboard Buffer</strong> - keys you press are stored in a queue, so the computer reads them
                  in the same order you typed them.
                </li>
                <li>
                  <strong>Call Center Queues</strong> - incoming calls wait in line until an agent is free. The
                  longest-waiting caller is answered first.
                </li>
                <li>
                  <strong>Producer-Consumer Problem</strong> - one process adds data to a queue and another process
                  takes it out, so the two can work at different speeds.
                </li>
              </ol>
            </div>

            {/* ─── Section 12: Comparison Table ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Stack vs Queue Comparison
              </h2>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
                    <tr>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                        Stack
                      </th>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                        Queue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { stack: 'The last item in is the first one out.', queue: 'The first item in is the first one out.' },
                      { stack: 'Push adds a new item to the top.', queue: 'Enqueue adds a new item to the back.' },
                      { stack: 'Pop removes the item from the top.', queue: 'Dequeue removes the item from the front.' },
                      { stack: 'Peek looks at the top item.', queue: 'Peek looks at the front item.' },
                      { stack: 'Only one end is used, the top.', queue: 'Both ends are used, front and back.' },
                      { stack: 'Works like a pile of plates.', queue: 'Works like people standing in a line.' },
                      { stack: 'Used for undo/redo and function calls.', queue: 'Used for print jobs and task scheduling.' },
                      { stack: 'Basic operations run in O(1) time.', queue: 'Basic operations run in O(1) time.' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0a0a0b]' : 'bg-slate-50 dark:bg-[#121212]'}>
                        <td className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                          {row.stack}
                        </td>
                        <td className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                          {row.queue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ─── Section 13: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                    Stack (LIFO)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">
                    The last item you add is the first one you remove.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    <li><strong className="text-slate-900 dark:text-white">Push</strong> — add to the top</li>
                    <li><strong className="text-slate-900 dark:text-white">Pop</strong> — remove from the top</li>
                    <li><strong className="text-slate-900 dark:text-white">Peek</strong> — see the top item</li>
                    <li><strong className="text-slate-900 dark:text-white">IsEmpty</strong> — check if it's empty</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    Good for: undo/redo, function calls, checking matching brackets.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    Queue (FIFO)
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">
                    The first item you add is the first one you remove.
                  </p>
                  <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    <li><strong className="text-slate-900 dark:text-white">Enqueue</strong> — add to the back</li>
                    <li><strong className="text-slate-900 dark:text-white">Dequeue</strong> — remove from the front</li>
                    <li><strong className="text-slate-900 dark:text-white">Peek</strong> — see the front item</li>
                    <li><strong className="text-slate-900 dark:text-white">IsEmpty</strong> — check if it's empty</li>
                  </ul>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    Good for: BFS, print queues, task scheduling.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
                  <p className="text-sm font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-3">
                    Variants & Complexity
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                    <p><strong className="text-slate-900 dark:text-white">Circular Queue</strong> — reuses empty space, so nothing needs to shift</p>
                    <p><strong className="text-slate-900 dark:text-white">Priority Queue</strong> — the most important item leaves first, usually built with a heap</p>
                    <p><strong className="text-slate-900 dark:text-white">Time</strong> — O(1) for the basic operations</p>
                    <p><strong className="text-slate-900 dark:text-white">Space</strong> — O(n), one slot per stored item</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    Can be built with an array, a linked list, or the STL's own stack/queue containers.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <Lightbulb size={20} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    When asked to compare stack and queue, lead with LIFO vs FIFO, then back it up with one
                    real‑world example each — a pile of plates for a stack, a line of people for a queue.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Push it. Pop it. Enqueue it. Dequeue it. Master it. 🚀</p>
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
                <strong className="text-white">Stack</strong> follows LIFO (Last‑In‑First‑Out) – operations:
                Push, Pop, Peek. Ideal for recursion, undo/redo, and expression evaluation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Queue</strong> follows FIFO (First‑In‑First‑Out) – operations:
                Enqueue, Dequeue, Peek. Used in BFS, task scheduling, and buffering.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Implementations</strong> include arrays (static/dynamic) and
                linked lists. The STL provides <code className="bg-white/10 px-1 rounded">std::stack</code> and
                <code className="bg-white/10 px-1 rounded">std::queue</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Variants</strong> – circular queue (efficient space) and priority
                queue (ordered by priority, implemented with heap).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from understanding the principles,
                comparing them, and knowing real‑world applications.
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
            Sidemann Academic Registry • Simply Easy Stack & Queue 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;