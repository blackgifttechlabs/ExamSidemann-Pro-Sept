import React from 'react';

// Two worked pictures for finding the resultant force: forces in the same direction
// add, forces in opposite directions subtract. 1 N = 20 px.
const N = 20;
const BLUE = '#2563eb', GREEN = '#16a34a', RED = '#dc2626', SKIN = '#d9a07a';

function Arrow({ x1, x2, y, color, label, above = true }: { x1: number; x2: number; y: number; color: string; label: string; above?: boolean }) {
  const dir = x2 >= x1 ? 1 : -1;
  return <g>
    <path d={`M${x1} ${y} H${x2 - dir * 12}`} stroke={color} strokeWidth={6} strokeLinecap="round" />
    <path d={`M${x2} ${y} l${-dir * 16} -10 v20 z`} fill={color} />
    <text x={(x1 + x2) / 2} y={above ? y - 14 : y + 28} textAnchor="middle" fontSize={15} fontWeight={800} fill={color}>{label}</text>
  </g>;
}
const Fist = ({ x, y }: { x: number; y: number }) => <rect x={x} y={y - 12} width={14} height={24} rx={6} fill={SKIN} stroke="#a16207" strokeWidth={1.5} />;
const Crate = () => <g>
  <rect x={165} y={85} width={70} height={50} rx={3} fill="#b4513a" stroke="#7c2d12" strokeWidth={2} />
  <path d="M165 110 H235 M200 85 V135" stroke="#7c2d12" strokeWidth={1.5} opacity={0.5} />
</g>;
const Ground = () => <path d="M10 135 H390" stroke="#a16207" strokeWidth={4} strokeLinecap="round" />;

function Panel({ title, note, label, children }: { title: string; note: React.ReactNode; label: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <p className="text-xl font-bold text-slate-900">{title}</p>
    <svg viewBox="0 0 400 215" className="h-auto w-full" role="img" aria-label={`${title}. ${label}`}>{children}</svg>
    <p className="text-base text-slate-700">{note}</p>
  </div>;
}

export default function ForceDirections() {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <Panel title="Same direction: add" label="Both forces go to the right. 5 N + 3 N = 8 N to the right." note={<>Both forces go to the right. <strong>5 N + 3 N = 8 N</strong> to the right.</>}>
      <Ground /><Crate />
      <Fist x={51} y={110} /><Arrow x1={65} x2={165} y={110} color={BLUE} label="5 N" />
      <path d="M235 110 H330" stroke="#8a7a5a" strokeWidth={2} strokeDasharray="4 3" /><Fist x={330} y={110} />
      <Arrow x1={235} x2={235 + 3 * N} y={110} color={GREEN} label="3 N" />
      <Arrow x1={120} x2={120 + 8 * N} y={172} color={RED} label="Resultant = 8 N" above={false} />
    </Panel>
    <Panel title="Opposite directions: take away" label="7 N goes right and 4 N goes left. 7 N − 4 N = 3 N, and it goes the way of the bigger force: right." note={<>7 N goes right and 4 N goes left. <strong>7 N − 4 N = 3 N</strong>, and it goes the way of the bigger force: right.</>}>
      <Ground /><Crate />
      <Fist x={11} y={110} /><Arrow x1={25} x2={25 + 7 * N} y={110} color={BLUE} label="7 N" />
      <Fist x={321} y={110} /><Arrow x1={321} x2={321 - 4 * N} y={110} color={GREEN} label="4 N" />
      <Arrow x1={170} x2={170 + 3 * N} y={172} color={RED} label="Resultant = 3 N" above={false} />
    </Panel>
  </div>;
}

export function BalancedIllustrations() {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <Panel title="Balanced forces" label="5 N to the right and 5 N to the left. The resultant is 0 N and the crate stays still." note={<>Equal and opposite: <strong>5 N − 5 N = 0 N</strong>. The crate stays still.</>}>
      <Ground /><Crate />
      <Fist x={65} y={110} /><Arrow x1={79} x2={165} y={110} color={BLUE} label="5 N" />
      <Fist x={321} y={110} /><Arrow x1={321} x2={235} y={110} color={GREEN} label="5 N" />
      <circle cx={200} cy={172} r={20} fill="#fee2e2" stroke={RED} strokeWidth={3} />
      <text x={200} y={178} textAnchor="middle" fontSize={16} fontWeight={800} fill={RED}>0 N</text>
      <text x={200} y={208} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>Resultant</text>
    </Panel>
    <Panel title="Unbalanced forces" label="7 N to the right and 4 N to the left. The resultant is 3 N to the right and the crate speeds up." note={<>Not equal: <strong>7 N − 4 N = 3 N</strong> to the right. The crate speeds up.</>}>
      <Ground /><Crate />
      <path d="M150 100 H120 M150 115 H105 M150 128 H125" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" />
      <Fist x={11} y={110} /><Arrow x1={25} x2={25 + 7 * N} y={110} color={BLUE} label="7 N" />
      <Fist x={321} y={110} /><Arrow x1={321} x2={321 - 4 * N} y={110} color={GREEN} label="4 N" />
      <Arrow x1={170} x2={170 + 3 * N} y={172} color={RED} label="Resultant = 3 N" above={false} />
    </Panel>
  </div>;
}
