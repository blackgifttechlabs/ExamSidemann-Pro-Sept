import React, { useEffect, useState } from 'react';

// ──────────────────────────────────────────────────────────────────────────
// BIG O NOTATION GRID — one illustrated card per notation
// ──────────────────────────────────────────────────────────────────────────
interface NotationCard {
  key: string;
  notation: string;
  name: string;
  explanation: string;
  example: string;
  color: string;
  path: string; // mini growth curve, viewBox 0 0 280 140
}

const CARDS: NotationCard[] = [
  {
    key: 'o1',
    notation: 'O(1)',
    name: 'Constant',
    explanation:
      'The time stays the same no matter how big the input gets. Nothing to worry about here – it never slows down.',
    example: 'Grabbing the first item in an array.',
    color: '#34d399',
    path: 'M 25 150 L 260 150',
  },
  {
    key: 'ologn',
    notation: 'O(log n)',
    name: 'Logarithmic',
    explanation:
      'The time grows very slowly because the problem gets cut in half at every step. Great performance, even for huge input.',
    example: 'Binary search in a sorted list.',
    color: '#e11d48',
    path: 'M 25 150 C 90 150 140 120 260 110',
  },
  {
    key: 'on',
    notation: 'O(n)',
    name: 'Linear',
    explanation:
      'The time grows at the same rate as the input – double the input, double the time. Simple and predictable.',
    example: 'Checking every item in a list one by one.',
    color: '#3b82f6',
    path: 'M 25 150 L 250 70',
  },
  {
    key: 'onlogn',
    notation: 'O(n log n)',
    name: 'Linearithmic',
    explanation:
      'A little slower than linear. Usually comes from splitting the input up and then combining it back together.',
    example: 'Merge sort, quicksort.',
    color: '#f59e0b',
    path: 'M 25 150 C 110 150 170 105 245 78',
  },
  {
    key: 'on2',
    notation: 'O(n²)',
    name: 'Quadratic',
    explanation:
      'The time grows much faster than the input – usually from comparing every item to every other item.',
    example: 'Bubble sort, selection sort.',
    color: '#f97316',
    path: 'M 25 150 C 70 150 150 85 220 58',
  },
  {
    key: 'o2n',
    notation: 'O(2ⁿ)',
    name: 'Exponential',
    explanation:
      'The time doubles with every extra piece of input. It gets unusably slow very quickly as n grows.',
    example: 'Naive recursive Fibonacci, trying every combination.',
    color: '#8b5cf6',
    path: 'M 25 150 C 55 150 110 85 170 60',
  },
  {
    key: 'onf',
    notation: 'O(n!)',
    name: 'Factorial',
    explanation:
      'The worst of the worst – the time explodes almost immediately. Only usable for very small inputs.',
    example: 'Trying every possible ordering (brute-force travelling salesman).',
    color: '#64748b',
    path: 'M 25 150 C 42 150 85 82 130 58',
  },
];

const MiniGraph: React.FC<{ card: NotationCard; runId: number }> = ({ card, runId }) => (
  <svg viewBox="0 0 280 180" className="block w-full h-[220px] overflow-visible" preserveAspectRatio="xMidYMid meet">
    {/* Axes */}
    <line x1="25" y1="150" x2="25" y2="10" stroke="#000000" strokeWidth="1.5" />
    <line x1="25" y1="150" x2="265" y2="150" stroke="#000000" strokeWidth="1.5" />

    {/* Tick marks and labels */}
    {[65, 120, 175, 230].map((x, idx) => (
      <g key={`x-tick-${idx}`}>
        <line x1={x} y1="150" x2={x} y2="154" stroke="#000000" strokeWidth="1" />
        <text x={x} y="167" textAnchor="middle" fill="#111827" fontSize="8" fontWeight="600">
          {idx + 1}
        </text>
      </g>
    ))}
    {[150, 110, 70, 30].map((y, idx) => (
      <g key={`y-tick-${idx}`}>
        <line x1="25" y1={y} x2="29" y2={y} stroke="#000000" strokeWidth="1" />
        <text x="18" y={y + 3} textAnchor="middle" fill="#111827" fontSize="8" fontWeight="600">
          {idx + 1}
        </text>
      </g>
    ))}

    <text x="10" y="82" fill="#111827" fontSize="10" fontWeight="600" transform="rotate(-90 10 82)">
      Time
    </text>
    <text x="145" y="176" textAnchor="middle" fill="#111827" fontSize="10" fontWeight="600">
      Input Size (n) →
    </text>

    <path
      key={`${card.key}-${runId}`}
      d={card.path}
      fill="none"
      stroke={card.color}
      strokeWidth="2.5"
      strokeLinecap="round"
      pathLength={1000}
      style={{
        strokeDasharray: '1000',
        strokeDashoffset: '1000',
        animation: 'bigOGrowDraw 5s ease-in-out infinite',
        animationDelay: '0.4s',
      }}
    />
  </svg>
);

export const BigONotationGrid: React.FC = () => {
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setRunId((id) => id + 1);
  }, []);

  return (
    <div>
      <style>{`
        @keyframes bigOGrowDraw {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          50% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
        }
      `}</style>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-white/[0.03] p-4 shadow-sm"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {card.notation}
              </span>
              <span className="text-xs font-semibold text-black uppercase tracking-wide">
                {card.name}
              </span>
            </div>
            <p className="text-sm text-black leading-relaxed">
              {card.explanation}
            </p>
            <p className="text-sm text-black mt-1">
              <strong>Example:</strong> {card.example}
            </p>
            <div className="mt-3 rounded-lg bg-white dark:bg-[#0a0a0b] border border-slate-100 dark:border-white/5 p-2 overflow-visible min-h-[220px]">
              <MiniGraph card={card} runId={runId} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BigONotationGrid;
