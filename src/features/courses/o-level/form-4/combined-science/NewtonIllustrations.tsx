import React from 'react';

// Flat illustrations and worked examples for mass, weight, inertia, momentum and Newton's laws.
const BLUE = '#2563eb', RED = '#dc2626', GREEN = '#16a34a', DARK = '#334155', BOX = '#9a6b3b', EDGE = '#5b3a17', GREY = '#94a3b8';

function Fig({ label, note, children, h = 170 }: { label: string; note?: React.ReactNode; children: React.ReactNode; h?: number }) {
  return <figure className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 p-3 text-center">
    <svg viewBox={`0 0 400 ${h}`} className="h-auto w-full" role="img" aria-label={label}>{children}</svg>
    {note ? <figcaption className="text-base text-slate-700">{note}</figcaption> : null}
  </figure>;
}
const T = ({ x, y, size = 14, color = '#0f172a', anchor = 'middle', weight = 800, children }: { x: number; y: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; children: React.ReactNode }) =>
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color}>{children}</text>;
const Crate = ({ x, y, w, h, label, fill = BOX }: { x: number; y: number; w: number; h: number; label?: string; fill?: string }) => <g>
  <rect x={x} y={y} width={w} height={h} rx={3} fill={fill} stroke={EDGE} strokeWidth={2.5} />
  {label ? <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{label}</text> : null}
</g>;
const Hz = ({ x1, x2, y, c, label, above = true }: { x1: number; x2: number; y: number; c: string; label?: string; above?: boolean }) => {
  const d = x2 >= x1 ? 1 : -1;
  return <g><path d={`M${x1} ${y} H${x2 - d * 10}`} stroke={c} strokeWidth={5} strokeLinecap="round" /><path d={`M${x2} ${y} l${-d * 16} -9 v18 z`} fill={c} />
    {label ? <T x={(x1 + x2) / 2} y={above ? y - 12 : y + 24} color={c} size={14}>{label}</T> : null}</g>;
};
const Vt = ({ x, y1, y2, c, label }: { x: number; y1: number; y2: number; c: string; label?: string }) => {
  const d = y2 >= y1 ? 1 : -1;
  return <g><path d={`M${x} ${y1} V${y2 - d * 10}`} stroke={c} strokeWidth={5} strokeLinecap="round" /><path d={`M${x} ${y2} l-9 ${-d * 16} h18 z`} fill={c} />
    {label ? <T x={x + 12} y={(y1 + y2) / 2 + 5} anchor="start" color={c}>{label}</T> : null}</g>;
};
const Ground = ({ y = 130 }: { y?: number }) => <path d={`M10 ${y} H390`} stroke="#7c6a4a" strokeWidth={4} strokeLinecap="round" />;

const still = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
// Small helper for the looping SMIL animations. Nothing is rendered for people who prefer reduced motion.
function Anim({ type = 'translate', values, dur, keyTimes, spline, off }: { type?: 'translate' | 'rotate'; values: string; dur: string; keyTimes?: string; spline?: string; off: boolean }) {
  if (off) return null;
  return <animateTransform attributeName="transform" type={type} values={values} dur={dur} repeatCount="indefinite"
    {...(keyTimes ? { keyTimes } : {})} {...(spline ? { calcMode: 'spline', keySplines: spline } : {})} />;
}

// A cart that really sits on the ground: the wheels touch the ground line and the body rests on the wheels.
function Cart({ x, ground, w, h, label, fill, r, off, spinDur = '1.2s' }: { x: number; ground: number; w: number; h: number; label?: string; fill: string; r: number; off: boolean; spinDur?: string }) {
  const bottom = ground - r * 1.5, cy = ground - r;
  const Wheel = ({ cx }: { cx: number }) => <g>
    <circle cx={cx} cy={cy} r={r} fill={DARK} stroke="#0f172a" strokeWidth={1.5} />
    <g>{[0, 90].map(a => <path key={a} d={`M${cx - r * 0.7} ${cy} H${cx + r * 0.7}`} stroke="#e2e8f0" strokeWidth={1.8} transform={`rotate(${a} ${cx} ${cy})`} />)}
      {off ? null : <animateTransform attributeName="transform" type="rotate" values={`0 ${cx} ${cy};360 ${cx} ${cy}`} dur={spinDur} repeatCount="indefinite" />}</g>
  </g>;
  return <g>
    <rect x={x} y={bottom - h} width={w} height={h} rx={4} fill={fill} stroke={EDGE} strokeWidth={2.5} />
    {label ? <text x={x + w / 2} y={bottom - h / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{label}</text> : null}
    <Wheel cx={x + w * 0.22} /><Wheel cx={x + w * 0.78} />
  </g>;
}

export function MassFigure() {
  const off = still();
  const Balance = ({ x, where, delay }: { x: number; where: string; delay: string }) => <g>
    <T x={x} y={24} size={15}>{where}</T>
    <g>
      <Crate x={x - 25} y={70} w={50} h={42} label="5 kg" />
      <Anim values="0 -34;0 0;0 0;0 -34" keyTimes="0;0.25;0.85;1" dur="4s" off={off} spline="0.4 0 0.2 1;0 0 1 1;0.4 0 0.2 1" />
    </g>
    <rect x={x - 55} y={112} width={110} height={34} rx={8} fill="#e5e7eb" stroke="#64748b" strokeWidth={2.5} />
    <rect x={x - 32} y={119} width={64} height={20} rx={3} fill="#bae6fd" stroke="#0369a1" strokeWidth={2} /><T x={x} y={134} size={14}>5.0 kg</T>
  </g>;
  return <Fig label="The same 5 kg on a balance on Earth and on the Moon. The balance reads 5 kg in both places, so mass does not change." note={<>The same object gives the same reading on Earth and on the Moon. <strong>Mass does not change.</strong></>} h={165}>
    <Balance x={100} where="On Earth" delay="0s" /><Balance x={300} where="On the Moon" delay="0s" />
  </Fig>;
}

export function WeightFigure() {
  const off = still();
  const Spring = ({ x, where, reading, bounce }: { x: number; where: string; reading: string; bounce: number }) => <g>
    <T x={x} y={22} size={15}>{where}</T>
    <path d={`M${x} 30 V44`} stroke={DARK} strokeWidth={3} /><circle cx={x} cy={30} r={5} fill="none" stroke={DARK} strokeWidth={3} />
    <rect x={x - 14} y={44} width={28} height={58} rx={6} fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} />
    <path d={`M${x - 14} 62 h10 M${x - 14} 74 h10 M${x - 14} 86 h10`} stroke={DARK} strokeWidth={2} />
    <g>
      <path d={`M${x} 102 V114`} stroke={DARK} strokeWidth={3} />
      <Crate x={x - 25} y={114} w={50} h={36} label="5 kg" />
      <Vt x={x + 40} y1={118} y2={160} c={RED} />
      <Anim values={`0 0;0 ${bounce};0 ${-bounce / 3};0 ${bounce / 5};0 0`} keyTimes="0;0.2;0.4;0.6;1" dur="3.4s" off={off} />
    </g>
    <T x={x + 34} y={78} anchor="start" color={RED} size={17}>{reading}</T>
  </g>;
  return <Fig label="The same 5 kg hung from a spring balance. On Earth the balance reads 50 N. On the Moon it reads about 8 N, because gravity is weaker there." note={<>Same mass, but <strong>weight changes</strong>. The Moon pulls less, so the object weighs less.</>} h={175}>
    <Spring x={100} where="On Earth (g = 10)" reading="50 N" bounce={9} /><Spring x={300} where="On the Moon (g = 1.6)" reading="8 N" bounce={2} />
  </Fig>;
}

export function InertiaFigure() {
  const off = still();
  return <Fig label="The same push moves a small light trolley a long way but a big heavy truck only a little. The heavy truck has more inertia." note={<>The same push. The <strong>heavy</strong> truck hardly moves: it has more inertia.</>} h={150}>
    <Ground y={118} />
    <g><Cart x={40} ground={118} w={44} h={30} label="1 kg" fill="#0ea5e9" r={7} off={off} /><Hz x1={10} x2={40} y={92} c={BLUE} />
      <Anim values="0 0;100 0;100 0;0 0" keyTimes="0;0.4;0.8;1" dur="4s" off={off} spline="0.3 0 0.4 1;0 0 1 1;0.4 0 0.2 1" /></g>
    <g><Cart x={215} ground={118} w={130} h={58} label="2000 kg" fill="#b45309" r={10} off={off} spinDur="9s" /><Hz x1={178} x2={215} y={92} c={BLUE} />
      <Anim values="0 0;8 0;8 0;0 0" keyTimes="0;0.4;0.8;1" dur="4s" off={off} spline="0.3 0 0.4 1;0 0 1 1;0.4 0 0.2 1" /></g>
    <T x={60} y={40} size={13} color="#475569">moves easily</T><T x={280} y={30} size={13} color="#475569">hard to move</T>
  </Fig>;
}

export function MomentumFigure() {
  const off = still();
  const mv = <Anim values="0 0;40 0;0 0" keyTimes="0;0.5;1" dur="4s" off={off} spline="0.4 0 0.6 1;0.4 0 0.6 1" />;
  return <Fig label="A 2 kg ball moving at 3 m/s has momentum 6 kg m/s. A 1000 kg car moving at 3 m/s has much more momentum, 3000 kg m/s." note={<>Momentum = mass × velocity. The heavier object moving at the same speed has <strong>more momentum</strong>.</>} h={165}>
    <Ground y={118} />
    <T x={70} y={34} size={13} color="#475569">2 kg, 3 m/s</T><T x={230} y={34} size={13} color="#475569">1000 kg, 3 m/s</T>
    <g><circle cx={44} cy={100} r={16} fill="#f59e0b" stroke="#b45309" strokeWidth={2.5} /><path d="M28 102 H60" stroke="#b45309" strokeWidth={0} /><Hz x1={66} x2={110} y={100} c={GREEN} />{mv}</g>
    <g><Cart x={170} ground={118} w={110} h={48} label="1000 kg" fill="#2563eb" r={9} off={off} spinDur="2.4s" /><Hz x1={286} x2={334} y={92} c={GREEN} />{mv}</g>
    <T x={85} y={150} size={14} color={GREEN}>p = 6 kg m/s</T><T x={250} y={150} size={14} color={GREEN}>p = 3000 kg m/s</T>
  </Fig>;
}

export function FirstLawFigure() {
  const off = still();
  return <Fig label="A bus brakes and stops. The passengers keep moving forward because no force stops them, so they lean forward. A seat belt gives the stopping force." note={<>The bus stops, but the passenger <strong>keeps moving forward</strong>. A seat belt gives the force that stops them.</>} h={175}>
    <Ground y={140} />
    <g>
      <rect x={30} y={60} width={200} height={66} rx={10} fill="#facc15" stroke="#a16207" strokeWidth={2.5} />
      <rect x={44} y={70} width={32} height={22} fill="#e0f2fe" stroke="#a16207" strokeWidth={2} /><rect x={90} y={70} width={32} height={22} fill="#e0f2fe" stroke="#a16207" strokeWidth={2} />
      <circle cx={70} cy={130} r={10} fill={DARK} stroke="#0f172a" strokeWidth={1.5} /><circle cx={190} cy={130} r={10} fill={DARK} stroke="#0f172a" strokeWidth={1.5} />
      <g>
        <circle cx={160} cy={84} r={9} fill="#d9a07a" stroke="#a16207" strokeWidth={2} />
        <path d="M160 94 V118" stroke={DARK} strokeWidth={6} strokeLinecap="round" />
        <Anim type="rotate" values="0 160 118;0 160 118;32 160 118;32 160 118;0 160 118" keyTimes="0;0.45;0.6;0.9;1" dur="5s" off={off} />
      </g>
      <Anim values="0 0;40 0;40 0;0 0" keyTimes="0;0.42;0.95;1" dur="5s" off={off} spline="0.3 0 0.5 1;0 0 1 1;0.4 0 0.2 1" />
    </g>
    <T x={300} y={74} size={14} color={RED} anchor="start">Bus brakes:</T><T x={300} y={94} size={13} color="#475569" anchor="start" weight={700}>a force stops the</T><T x={300} y={110} size={13} color="#475569" anchor="start" weight={700}>bus, not the</T><T x={300} y={126} size={13} color="#475569" anchor="start" weight={700}>passenger</T>
  </Fig>;
}

export function SecondLawFigure() {
  const off = still();
  const acc = (d: number) => <Anim values={`0 0;${d} 0`} dur="3s" keyTimes="0;1" spline="0.5 0 1 1" off={off} />;
  return <Fig label="The same 12 N push on a light 2 kg trolley and a heavier 6 kg trolley. The light trolley gets a bigger acceleration, 6 metres per second squared, than the heavy one, 2 metres per second squared." note={<>The same force gives the <strong>lighter</strong> trolley a <strong>bigger acceleration</strong>. F = ma.</>} h={175}>
    <T x={110} y={22} size={14} color="#475569">light: a = 6 m/s²</T><T x={290} y={22} size={14} color="#475569">heavy: a = 2 m/s²</T>
    <Ground y={92} />
    <g><Cart x={40} ground={92} w={50} h={34} label="2 kg" fill="#0ea5e9" r={7} off={off} spinDur="0.8s" /><Hz x1={4} x2={40} y={64} c={BLUE} />{acc(240)}</g>
    <Ground y={162} />
    <g><Cart x={40} ground={162} w={72} h={44} label="6 kg" fill="#b45309" r={9} off={off} spinDur="2s" /><Hz x1={4} x2={40} y={128} c={BLUE} />{acc(80)}</g>
    <T x={20} y={46} size={13} color={BLUE} anchor="start">12 N</T><T x={20} y={112} size={13} color={BLUE} anchor="start">12 N</T>
  </Fig>;
}

export function ThirdLawFigure() {
  const off = still();
  return <Fig label="Two skaters push each other. Each pushes with an equal force in opposite directions, so they move apart. The forces act on different objects." note={<>A pushes B, and B pushes A back with an <strong>equal and opposite</strong> force. The two forces act on <strong>different objects</strong>.</>} h={160}>
    <Ground y={128} />
    <g>
      <circle cx={150} cy={58} r={14} fill="#d9a07a" stroke="#a16207" strokeWidth={2} /><rect x={136} y={74} width={28} height={50} rx={8} fill="#0ea5e9" stroke="#0369a1" strokeWidth={2} />
      <T x={150} y={150} size={14}>A</T>
      <Anim values="0 0;0 0;-70 0;-70 0;0 0" keyTimes="0;0.2;0.6;0.9;1" dur="5s" off={off} spline="0 0 1 1;0.3 0 0.4 1;0 0 1 1;0.4 0 0.2 1" />
    </g>
    <g>
      <circle cx={250} cy={58} r={14} fill="#d9a07a" stroke="#a16207" strokeWidth={2} /><rect x={236} y={74} width={28} height={50} rx={8} fill="#16a34a" stroke="#166534" strokeWidth={2} />
      <T x={250} y={150} size={14}>B</T>
      <Anim values="0 0;0 0;70 0;70 0;0 0" keyTimes="0;0.2;0.6;0.9;1" dur="5s" off={off} spline="0 0 1 1;0.3 0 0.4 1;0 0 1 1;0.4 0 0.2 1" />
    </g>
    <g><Hz x1={172} x2={198} y={96} c={BLUE} label="A pushes B" /><Hz x1={228} x2={202} y={96} c={RED} label="B pushes A" />
      {off ? null : <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.2;0.3;0.9;1" dur="5s" repeatCount="indefinite" />}</g>
  </Fig>;
}

// A worked question with its steps, set out the way it is written in the exam.
export function Worked({ n, question, steps, answer }: { n: number; question: string; steps: string[]; answer: string }) {
  return <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-4">
    <p className="mb-2 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-800"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{n}</span>{question}</p>
    {steps.map((s, i) => <p key={i} className="border-b border-slate-200 py-2 text-lg last:border-0"><span className="mr-2 font-bold text-slate-500">Step {i + 1}:</span>{s}</p>)}
    <p className="pt-3 text-lg"><span className="mr-2 font-bold text-slate-500">Answer:</span><span className="text-xl font-bold text-green-700">{answer}</span></p>
  </div>;
}
