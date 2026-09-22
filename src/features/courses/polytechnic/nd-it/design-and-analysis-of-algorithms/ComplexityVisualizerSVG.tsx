import React, { useEffect, useState } from 'react';

const MAX_N = 8;
const BASELINE = 200;
const CHART_TOP = 40;
const MAX_BAR_HEIGHT = BASELINE - CHART_TOP; // 160
const MAX_STEPS = Math.pow(2, MAX_N);

interface Bar {
  key: string;
  label: string;
  color: string;
  fn: (n: number) => number;
}

const BARS: Bar[] = [
  { key: 'o1', label: 'O(1)', color: '#34d399', fn: () => 1 },
  { key: 'ologn', label: 'O(log n)', color: '#3b82f6', fn: (n) => Math.log2(n + 1) },
  { key: 'on', label: 'O(n)', color: '#f59e0b', fn: (n) => n },
  { key: 'on2', label: 'O(n\u00b2)', color: '#f97316', fn: (n) => n * n },
  { key: 'o2n', label: 'O(2\u207f)', color: '#8b5cf6', fn: (n) => Math.pow(2, n) },
];

export const ComplexityVisualizerSVG: React.FC = () => {
  const [n, setN] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setN((prev) => (prev >= MAX_N ? 1 : prev + 1));
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const barWidth = 64;
  const gap = 24;
  const chartWidth = BARS.length * barWidth + (BARS.length - 1) * gap + 40;

  return (
    <div className="w-full max-w-3xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a0a0b] p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Input size (n): <span className="text-slate-900 dark:text-slate-100">{n}</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${chartWidth} 260`} className="w-full h-[280px]" preserveAspectRatio="xMidYMid meet">
        <line
          x1="20"
          y1={BASELINE}
          x2={chartWidth - 20}
          y2={BASELINE}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-slate-400 dark:text-slate-600"
        />

        {BARS.map((bar, i) => {
          const rawSteps = bar.fn(n);
          const ratio = Math.log(rawSteps + 1) / Math.log(MAX_STEPS + 1);
          const height = Math.max(6, Math.min(1, ratio) * MAX_BAR_HEIGHT);
          const x = 20 + i * (barWidth + gap);
          const barTop = BASELINE - height;
          const labelY = Math.max(barTop - 10, CHART_TOP - 12);

          return (
            <g key={bar.key}>
              <text x={x + barWidth / 2} y={labelY} textAnchor="middle" fontSize="12" fontWeight="700" fill={bar.color}>
                {Math.round(rawSteps)}
              </text>
              <rect
                x={x}
                y={barTop}
                width={barWidth}
                height={height}
                rx="6"
                fill={bar.color}
                style={{ transition: 'y 0.4s ease, height 0.4s ease' }}
              />
              <text
                x={x + barWidth / 2}
                y={BASELINE + 18}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                className="fill-slate-800 dark:fill-slate-200"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default ComplexityVisualizerSVG;
