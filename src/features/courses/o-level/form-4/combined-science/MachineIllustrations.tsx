import React from 'react';

// Small flat pictures of the six simple machines.
const WOOD = '#b0773a', GREY = '#94a3b8', DARK = '#334155', BLUE = '#2563eb', RED = '#dc2626', BOX = '#9a6b3b';
const Arrow = ({ x, y1, y2, c = RED }: { x: number; y1: number; y2: number; c?: string }) => {
  const d = y2 >= y1 ? 1 : -1;
  return <g><path d={`M${x} ${y1} V${y2 - d * 8}`} stroke={c} strokeWidth={4} strokeLinecap="round" /><path d={`M${x} ${y2} l-7 ${-d * 12} h14 z`} fill={c} /></g>;
};

function gearPath(cx: number, cy: number, r: number, teeth: number) {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2, rr = i % 2 ? r : r + 6;
    pts.push(`${cx + Math.cos(a0) * rr},${cy + Math.sin(a0) * rr} ${cx + Math.cos((a0 + a1) / 2) * rr},${cy + Math.sin((a0 + a1) / 2) * rr}`);
  }
  return pts.join(' ');
}
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Each picture moves on its own and loops: the lever rocks, the load rises on the pulley,
// the box slides up the ramp, the wheel turns, the wedge drives in and the screw winds down.
export function MachinePic({ kind }: { kind: 'lever' | 'pulley' | 'ramp' | 'wheel' | 'wedge' | 'screw' | 'gears' }) {
  const still = reduced();
  const T = (values: string, dur: string, type: 'translate' | 'rotate' = 'translate', extra: Record<string, string> = {}) => still ? null :
    <animateTransform attributeName="transform" type={type} values={values} dur={dur} repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" keyTimes="0;0.5;1" {...extra} />;
  const body = (() => {
    switch (kind) {
      case 'lever': return <>
        <path d="M80 70 L66 92 H94 Z" fill={GREY} stroke={DARK} strokeWidth={2} strokeLinejoin="round" />
        <g>
          <rect x={14} y={62} width={132} height={8} rx={3} fill={WOOD} stroke="#6b3f14" strokeWidth={2} />
          <rect x={20} y={34} width={26} height={28} fill={BOX} stroke="#5b3a17" strokeWidth={2} />
          <Arrow x={138} y1={16} y2={58} />
          {T('-9 80 66;9 80 66;-9 80 66', '3.6s', 'rotate')}
        </g>
      </>;
      case 'pulley': return <>
        <path d="M30 8 H130" stroke={DARK} strokeWidth={5} strokeLinecap="round" /><path d="M80 8 V20" stroke={DARK} strokeWidth={3} />
        <circle cx={80} cy={34} r={14} fill="#e2e8f0" stroke={DARK} strokeWidth={3} /><circle cx={80} cy={34} r={3} fill={DARK} />
        <path d="M66 34 V84" stroke="#a16207" strokeWidth={3}>{still ? null : <animate attributeName="d" values="M66 34 V84;M66 34 V56;M66 34 V84" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}</path>
        <g>
          <rect x={52} y={84} width={28} height={22} fill={BOX} stroke="#5b3a17" strokeWidth={2} />
          {T('0 0;0 -28;0 0', '4s')}
        </g>
        <path d="M94 34 V62" stroke="#a16207" strokeWidth={3}>{still ? null : <animate attributeName="d" values="M94 34 V62;M94 34 V90;M94 34 V62" dur="4s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />}</path>
        <g>
          <Arrow x={94} y1={62} y2={100} />
          {T('0 0;0 28;0 0', '4s')}
        </g>
      </>;
      case 'ramp': return <>
        <path d="M12 98 H150 V40 Z" fill="#cbd5e1" stroke={DARK} strokeWidth={2.5} strokeLinejoin="round" />
        <g transform="translate(12 98) rotate(-22.8)">
          <g>
            <rect x={14} y={-24} width={30} height={23} fill={BOX} stroke="#5b3a17" strokeWidth={2} />
            {T('0 0;80 0;0 0', '4.4s')}
          </g>
        </g>
      </>;
      case 'wheel': return <>
        <g>
          <circle cx={80} cy={55} r={42} fill="#f8fafc" stroke={DARK} strokeWidth={4} />
          {[0, 60, 120].map(a => <path key={a} d="M80 13 V97" stroke={GREY} strokeWidth={3} transform={`rotate(${a} 80 55)`} />)}
          <circle cx={80} cy={55} r={11} fill={DARK} /><circle cx={80} cy={55} r={4} fill="#e2e8f0" /><circle cx={80} cy={17} r={4} fill={RED} />
          {still ? null : <animateTransform attributeName="transform" type="rotate" values="0 80 55;360 80 55" dur="5s" repeatCount="indefinite" />}
        </g>
      </>;
      case 'wedge': return <>
        <rect x={20} y={72} width={120} height={28} rx={3} fill={BOX} stroke="#5b3a17" strokeWidth={2} />
        <g>
          <path d="M80 14 L100 78 H60 Z" fill="#cbd5e1" stroke={DARK} strokeWidth={2.5} strokeLinejoin="round" />
          <Arrow x={80} y1={0} y2={14} />
          {T('0 -2;0 16;0 -2', '3s')}
        </g>
      </>;
      case 'gears': return <>
        <g>
          <polygon points={gearPath(52, 58, 30, 10)} fill="#cbd5e1" stroke={DARK} strokeWidth={2.5} strokeLinejoin="round" /><circle cx={52} cy={58} r={8} fill={DARK} />
          {still ? null : <animateTransform attributeName="transform" type="rotate" values="0 52 58;360 52 58" dur="6s" repeatCount="indefinite" />}
        </g>
        <g>
          <polygon points={gearPath(110, 58, 22, 7)} fill="#fde68a" stroke={DARK} strokeWidth={2.5} strokeLinejoin="round" /><circle cx={110} cy={58} r={6} fill={DARK} />
          {still ? null : <animateTransform attributeName="transform" type="rotate" values="12 110 58;-348 110 58" dur="4.2s" repeatCount="indefinite" />}
        </g>
      </>;
      default: return <>
        <defs><clipPath id="screwShaft"><path d="M60 24 H100 V92 L80 106 L60 92 Z" /></clipPath></defs>
        <g>
          <rect x={52} y={14} width={56} height={10} rx={3} fill={GREY} stroke={DARK} strokeWidth={2} />
          <path d="M60 24 H100 V92 L80 106 L60 92 Z" fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} strokeLinejoin="round" />
          <g clipPath="url(#screwShaft)"><g>
            {[16, 28, 40, 52, 64, 76, 88].map(y => <path key={y} d={`M56 ${y} L104 ${y + 6}`} stroke={DARK} strokeWidth={2.5} />)}
            {still ? null : <animateTransform attributeName="transform" type="translate" values="0 0;0 12" dur="1.4s" repeatCount="indefinite" />}
          </g></g>
          {T('0 -4;0 8;0 -4', '4.2s')}
        </g>
      </>;
    }
  })();
  return <svg viewBox="0 0 160 112" className="block h-auto w-full max-w-[12rem] sm:w-40" role="img" aria-label={`A ${kind === 'ramp' ? 'ramp (inclined plane)' : kind === 'wheel' ? 'wheel and axle' : kind === 'gears' ? 'pair of gears' : kind}, shown moving`}>{body}</svg>;
}
