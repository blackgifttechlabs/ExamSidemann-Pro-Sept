import React from 'react';

// Flat illustration: water at 30 cm³ before, and 50 cm³ after a solid is lowered in.
const BOTTOM = 215, PER = 3, TOP = 25;
const y = (v: number) => BOTTOM - v * PER;

function Cylinder({ x, level, solid }: { x: number; level: number; solid: boolean }) {
  const left = x, right = x + 70;
  return <g>
    <rect x={left + 2} y={y(level)} width={66} height={BOTTOM - y(level)} fill="#0b73c9" />
    {solid && <path d={`M${x + 18} ${BOTTOM - 8} Q${x + 14} ${BOTTOM - 28} ${x + 30} ${BOTTOM - 34} Q${x + 44} ${BOTTOM - 42} ${x + 54} ${BOTTOM - 28} Q${x + 62} ${BOTTOM - 14} ${x + 50} ${BOTTOM - 8} Q${x + 34} ${BOTTOM - 3} ${x + 18} ${BOTTOM - 8} Z`} fill="#7b8794" stroke="#4b5563" strokeWidth={2} />}
    <path d={`M${left} ${TOP} V${BOTTOM} H${right} V${TOP}`} fill="none" stroke="#334155" strokeWidth={4} strokeLinejoin="round" />
    <rect x={left - 14} y={BOTTOM} width={98} height={9} rx={4.5} fill="#3d4a5c" />
    {Array.from({ length: 13 }, (_, i) => i * 5).map(v => <g key={v}>
      <path d={`M${right + 2} ${y(v)} h${v % 10 === 0 ? 14 : 8}`} stroke="#0f172a" strokeWidth={v % 10 === 0 ? 2.5 : 1.8} />
      {v % 10 === 0 && v > 0 && <text x={right + 19} y={y(v) + 4} fontSize={11} fontWeight={700} fill="#0f172a">{v}</text>}
    </g>)}
  </g>;
}

export default function DisplacementScene() {
  return <div className="w-full">
    <svg viewBox="0 0 320 245" className="h-auto w-full max-w-lg rounded-2xl" role="img" aria-label="Two measuring cylinders: the water reads 30 cm³ before and 50 cm³ after a solid is lowered in">
      <rect width={320} height={245} rx={16} fill="#c3d9f0" />
      <Cylinder x={38} level={30} solid={false} />
      <Cylinder x={182} level={50} solid />
    </svg>
    <div className="mt-2 grid max-w-lg grid-cols-2 gap-2 text-center text-base font-bold text-slate-800">
      <span>Before: 30 cm³</span><span>After: 50 cm³</span>
    </div>
    <p className="mt-2 max-w-lg rounded-xl border-2 border-amber-400 bg-amber-100 p-2 text-center font-extrabold text-slate-900">Volume of the solid = 50 − 30 = 20 cm³</p>
  </div>;
}
