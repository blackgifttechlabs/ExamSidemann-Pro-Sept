import React from 'react';
import { usePlayOnce, PlayButton, seg, lerp } from './MomentIllustrations';

// Animated working for mechanical advantage. The finished sum is shown by default; press play to watch
// the two numbers fly from the machine into the sum.
const BLUE = '#2563eb', GREEN = '#16a34a', INK = '#0f172a';
const fmt = (n: number) => String(parseFloat(n.toFixed(2)));

function MAWorking({ title, load, effort }: { title: string; load: number; effort: number }) {
  const { t, playing, play } = usePlayOnce(10);
  const ma = load / effort;
  const row = seg(t, 0.06, 0.16), lm = seg(t, 0.2, 0.4), em = seg(t, 0.42, 0.62), div = seg(t, 0.58, 0.66), eq = seg(t, 0.66, 0.74), ans = seg(t, 0.76, 0.9);
  const Tok = ({ x0, y0, x1, y1, k, text, c }: { x0: number; y0: number; x1: number; y1: number; k: number; text: string; c: string }) =>
    <text x={lerp(x0, x1, k)} y={lerp(y0, y1, k)} textAnchor="middle" fontSize={lerp(18, 22, k)} fontWeight={800} fill={k > 0.95 ? INK : c}>{text}</text>;
  const label = `${title}: the load is ${fmt(load)} N and the effort is ${fmt(effort)} N. MA = ${fmt(load)} divided by ${fmt(effort)}, which is ${fmt(ma)}.`;
  return <div className="rounded-xl border border-slate-200 p-2 text-center sm:p-3">
    <div className="mb-1 flex items-center justify-between gap-2"><p className="text-base font-bold text-slate-900">{title}</p><PlayButton playing={playing} onClick={play} /></div>
    <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[22rem]" role="img" aria-label={label}>
      <rect x={20} y={14} width={140} height={62} rx={10} fill="#eff6ff" stroke={BLUE} strokeWidth={2.5} />
      <text x={90} y={36} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>Load</text>
      <text x={72} y={64} textAnchor="end" fontSize={22} fontWeight={800} fill={BLUE} opacity={1 - lm}>{fmt(load)}</text>
      <text x={78} y={64} fontSize={16} fontWeight={800} fill={BLUE}>N</text>
      <rect x={200} y={14} width={140} height={62} rx={10} fill="#f0fdf4" stroke={GREEN} strokeWidth={2.5} />
      <text x={270} y={36} textAnchor="middle" fontSize={14} fontWeight={700} fill={GREEN}>Effort</text>
      <text x={252} y={64} textAnchor="end" fontSize={22} fontWeight={800} fill={GREEN} opacity={1 - em}>{fmt(effort)}</text>
      <text x={258} y={64} fontSize={16} fontWeight={800} fill={GREEN}>N</text>
      <path d="M20 100 H340" stroke="#e2e8f0" strokeWidth={2} />
      <text x={20} y={140} fontSize={20} fontWeight={800} fill={INK} opacity={row}>MA =</text>
      <text x={198} y={140} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK} opacity={div}>÷</text>
      <text x={252} y={140} fontSize={20} fontWeight={800} fill={INK} opacity={eq}>=</text>
      <text x={282} y={140} fontSize={24} fontWeight={800} fill={GREEN} opacity={ans} transform={`translate(${(1 - ans) * 10} 0)`}>{fmt(ma)}</text>
      <text x={20} y={176} fontSize={12} fill="#64748b" opacity={ans}>No units: MA is just a number.</text>
      <Tok x0={65} y0={64} x1={150} y1={140} k={lm} text={fmt(load)} c={BLUE} />
      <Tok x0={245} y0={64} x1={232} y1={140} k={em} text={fmt(effort)} c={GREEN} />
    </svg>
  </div>;
}

export function MechanicalAdvantageExamples() {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <MAWorking title="Example 1" load={80} effort={50} />
    <MAWorking title="Example 2" load={600} effort={200} />
    <MAWorking title="Example 3" load={900} effort={300} />
    <MAWorking title="Example 4" load={45} effort={30} />
  </div>;
}
