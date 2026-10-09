import React, { useEffect, useRef, useState } from 'react';

// Illustrations for moments: distance from the pivot matters, and the principle of moments.
const BLUE = '#2563eb', GREEN = '#16a34a', RED = '#dc2626', WOOD = '#b0773a';

function Card({ title, note, label, children, h = 200 }: { title: string; note: React.ReactNode; label: string; children: React.ReactNode; h?: number }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <p className="text-xl font-bold text-slate-900">{title}</p>
    <svg viewBox={`0 0 380 ${h}`} className="h-auto w-full" role="img" aria-label={`${title}. ${label}`}>{children}</svg>
    <p className="text-base text-slate-700">{note}</p>
  </div>;
}

function DimLine({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return <g stroke={RED} strokeWidth={2.5} strokeLinecap="round">
    <path d={`M${x1} ${y - 8} V${y + 8}`} /><path d={`M${x1} ${y} H${x2}`} /><path d={`M${x2} ${y - 8} V${y + 8}`} />
    <text x={(x1 + x2) / 2} y={y + 26} textAnchor="middle" fontSize={14} fontWeight={800} fill={RED} stroke="none">{label}</text>
  </g>;
}

function Door({ x, title, note, label, dist }: { x: number; title: string; note: React.ReactNode; label: string; dist: string }) {
  return <Card title={title} label={label} note={note}>
    <path d="M24 80 A30 30 0 0 1 76 80" fill="none" stroke={GREEN} strokeWidth={3.5} strokeLinecap="round" /><path d="M79 85.2 L78.9 69.1 L65.1 77.1 Z" fill={GREEN} strokeLinejoin="round" stroke={GREEN} strokeWidth={1.5} />
    <text x={22} y={62} fontSize={12} fontWeight={700} fill={GREEN}>turns</text>
    <rect x={50} y={100} width={300} height={14} rx={3} fill={WOOD} stroke="#6b3f14" strokeWidth={2} />
    <circle cx={50} cy={107} r={9} fill="#475569" stroke="#0f172a" strokeWidth={2} />
    <text x={50} y={138} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">hinge (pivot)</text>
    <path d={`M${x} 28 V78`} stroke={BLUE} strokeWidth={6} strokeLinecap="round" /><path d={`M${x} 98 l-11 -22 h22 z`} fill={BLUE} />
    <text x={x + 16} y={52} fontSize={15} fontWeight={800} fill={BLUE}>force</text>
    <DimLine x1={50} x2={x} y={160} label={dist} />
  </Card>;
}

export function DoorIllustrations() {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <Door x={105} title="Push close to the hinge" dist="short distance" label="Pushing near the hinge of a door gives a small turning effect." note={<>A <strong>small</strong> turning effect. The door is hard to open.</>} />
    <Door x={310} title="Push far from the hinge" dist="long distance" label="Pushing far from the hinge of a door gives a big turning effect." note={<>A <strong>big</strong> turning effect. The door opens easily.</>} />
  </div>;
}

export function SeesawIllustration() {
  return <Card title="A balanced see-saw" h={235} label="A rule balanced on a pivot: 4 N at 0.30 m to the left and 6 N at 0.20 m to the right, both moments 1.2 N m." note={<>Left: 4 × 0.30 = <strong>1.2 N m</strong> anticlockwise. Right: 6 × 0.20 = <strong>1.2 N m</strong> clockwise. They are equal, so it balances.</>}>
    <path d="M200 124 L172 164 H228 Z" fill="#64748b" stroke="#334155" strokeWidth={2} strokeLinejoin="round" />
    <text x={200} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">pivot</text>
    <rect x={40} y={112} width={320} height={12} rx={3} fill={WOOD} stroke="#6b3f14" strokeWidth={2} />
    <path d="M140 40 V82" stroke={BLUE} strokeWidth={6} strokeLinecap="round" /><path d="M140 108 l-11 -22 h22 z" fill={BLUE} />
    <text x={156} y={64} fontSize={16} fontWeight={800} fill={BLUE}>4 N</text>
    <path d="M240 14 V82" stroke={GREEN} strokeWidth={6} strokeLinecap="round" /><path d="M240 108 l-11 -22 h22 z" fill={GREEN} />
    <text x={256} y={38} fontSize={16} fontWeight={800} fill={GREEN}>6 N</text>
    <path d="M140 128 V196 M240 128 V196 M200 168 V196" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
    <DimLine x1={140} x2={200} y={190} label="0.30 m" />
    <DimLine x1={200} x2={240} y={190} label="0.20 m" />
  </Card>;
}

const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
export const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// Shows the finished working by default. Press play to watch it build up once.
export const END = 0.95;
export function usePlayOnce(seconds: number) {
  const [t, setT] = useState(END);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const stop = () => { cancelAnimationFrame(raf.current); setPlaying(false); setT(END); };
  const play = () => {
    if (playing) { stop(); return; }
    setPlaying(true); setT(0);
    const start = performance.now();
    const tick = (now: number) => {
      const k = ((now - start) / 1000 / seconds) * END;
      if (k >= END) { setPlaying(false); setT(END); return; }
      setT(k); raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { t, playing, play };
}

export function PlayButton({ playing, onClick }: { playing: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-label={playing ? 'Stop the animation' : 'Play the animation'} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-slate-700 active:scale-95">
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">{playing ? <path d="M5 4h5v16H5zM14 4h5v16h-5z" /> : <path d="M6 4l14 8-14 8z" />}</svg>{playing ? 'Stop' : 'Play'}
  </button>;
}

// Animated: measure the distance, move the 0.5 down, bring the 20 down, then multiply to get 10 N m.
export function MomentCalcIllustration() {
  const { t, playing, play } = usePlayOnce(11);
  const draw = seg(t, 0.04, 0.2);          // the distance line is drawn
  const labelIn = seg(t, 0.17, 0.25);       // "0.5" appears on the line
  const dMove = seg(t, 0.3, 0.46);          // 0.5 moves to the formula
  const fMove = seg(t, 0.5, 0.66);          // 20 moves to the formula
  const timesIn = seg(t, 0.64, 0.72), eqIn = seg(t, 0.74, 0.8), ansIn = seg(t, 0.8, 0.9);
  const pre = seg(t, 0.28, 0.36);
  const dx = lerp(190, 240, dMove), dy = lerp(168, 236, dMove);
  const fx = lerp(361, 170, fMove), fy = lerp(60, 236, fMove);
  return <div className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 p-3 text-center">
    <div className="mb-1 flex items-center justify-between gap-2"><p className="text-left text-base font-bold text-slate-900">Example: a spanner turning a nut</p><PlayButton playing={playing} onClick={play} /></div>
    <svg viewBox="0 0 420 255" className="h-auto w-full" role="img" aria-label="A force of 20 N pushes down on a spanner 0.5 m from the nut. The moment is 20 times 0.5, which is 10 N m.">
      <path d="M31.8 81.7 A30 30 0 0 1 83 72.7" fill="none" stroke={GREEN} strokeWidth={3.5} strokeLinecap="round" /><path d="M85.6 75.8 L82.6 61.3 L71.8 70.3 Z" fill={GREEN} stroke={GREEN} strokeWidth={1.5} strokeLinejoin="round" />
      <rect x={60} y={108} width={270} height={16} rx={8} fill="#cbd5e1" stroke="#475569" strokeWidth={2} />
      <polygon points="60,98 77,103 77,129 60,134 43,129 43,103" fill="#94a3b8" stroke="#334155" strokeWidth={2.5} strokeLinejoin="round" />
      <circle cx={60} cy={116} r={5} fill="#334155" />
      <text x={60} y={150} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">nut (pivot)</text>
      <path d="M310 30 V84" stroke={BLUE} strokeWidth={6} strokeLinecap="round" /><path d="M310 106 l-11 -22 h22 z" fill={BLUE} />
      <text x={322} y={66} fontSize={16} fontWeight={800} fill={BLUE}>F =</text><text x={380} y={66} fontSize={16} fontWeight={800} fill={BLUE}>N</text>
      {/* the distance is measured */}
      <g stroke={RED} strokeWidth={2.5} strokeLinecap="round">
        <path d="M60 157 V173" strokeOpacity={draw > 0.02 ? 1 : 0} />
        <path d={`M60 165 H${lerp(60, 310, draw)}`} />
        <path d="M310 157 V173" strokeOpacity={draw > 0.98 ? 1 : 0} />
      </g>
      <text x={178} y={190} textAnchor="end" fontSize={15} fontWeight={800} fill={RED} opacity={labelIn * (1 - dMove)}>d =</text>
      <text x={206} y={190} fontSize={15} fontWeight={800} fill={RED} opacity={labelIn * (1 - dMove)}>m</text>
      {/* the sum, built up from the two numbers */}
      <text x={24} y={236} fontSize={20} fontWeight={800} fill="#0f172a" opacity={pre}>Moment =</text>
      <text x={204} y={236} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f172a" opacity={timesIn}>×</text>
      <text x={276} y={236} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f172a" opacity={eqIn}>=</text>
      <text x={312} y={236} textAnchor="middle" fontSize={22} fontWeight={800} fill={GREEN} opacity={ansIn} transform={`translate(0 ${(1 - ansIn) * 8})`}>10</text>
      <text x={332} y={236} fontSize={20} fontWeight={800} fill={GREEN} opacity={ansIn}>N m</text>
      {/* the moving numbers */}
      <text x={dx} y={dy + (dMove > 0 ? 0 : 22)} textAnchor="middle" fontSize={lerp(15, 20, dMove)} fontWeight={800} fill={dMove > 0.9 ? '#0f172a' : RED} opacity={labelIn}>0.5</text>
      <text x={fx} y={fy} textAnchor="middle" fontSize={lerp(16, 20, fMove)} fontWeight={800} fill={fMove > 0.9 ? '#0f172a' : BLUE}>20</text>
    </svg>
  </div>;
}

function SeesawUnknown() {
  return <Card title="Find the unknown force" h={235} label="A rule balanced on a pivot: 2 N at 0.60 m on the left and an unknown force at 0.30 m on the right. The unknown force is 4 N." note={<>Left: 2 × 0.60 = <strong>1.2 N m</strong>. Right: F × 0.30 = 1.2, so F = 1.2 ÷ 0.30 = <strong>4 N</strong>.</>}>
    <path d="M200 124 L172 164 H228 Z" fill="#64748b" stroke="#334155" strokeWidth={2} strokeLinejoin="round" />
    <text x={200} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">pivot</text>
    <rect x={40} y={112} width={320} height={12} rx={3} fill={WOOD} stroke="#6b3f14" strokeWidth={2} />
    <path d="M80 56 V82" stroke={BLUE} strokeWidth={6} strokeLinecap="round" /><path d="M80 108 l-11 -22 h22 z" fill={BLUE} />
    <text x={96} y={72} fontSize={16} fontWeight={800} fill={BLUE}>2 N</text>
    <path d="M260 30 V82" stroke={GREEN} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 9" /><path d="M260 108 l-11 -22 h22 z" fill={GREEN} />
    <text x={276} y={64} fontSize={18} fontWeight={800} fill={GREEN}>F = ?</text>
    <path d="M80 128 V196 M260 128 V196 M200 168 V196" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 4" />
    <DimLine x1={80} x2={200} y={190} label="0.60 m" />
    <DimLine x1={200} x2={260} y={190} label="0.30 m" />
  </Card>;
}

export function PrincipleIllustrations() {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><SeesawIllustration /><SeesawUnknown /></div>;
}

// Animated working for the principle of moments: the numbers fly from the picture into the sum.
const fmt = (n: number) => String(parseFloat(n.toFixed(2)));

function PrincipleWorking({ title, force, dLeft, dRight }: { title: string; force: number; dLeft: number; dRight: number }) {
  const { t, playing, play } = usePlayOnce(14);
  const left = force * dLeft, unknown = left / dRight;
  const k = 150 / Math.max(dLeft, dRight), xl = 210 - dLeft * k, xr = 210 + dRight * k;
  const ml = (xl + 210) / 2, mr = (210 + xr) / 2;
  const row1 = seg(t, 0.04, 0.12);
  const lab2 = seg(t, 0.12, 0.2), m1 = seg(t, 0.16, 0.32), x2 = seg(t, 0.3, 0.36), a2 = seg(t, 0.34, 0.4);
  const lab3 = seg(t, 0.42, 0.48), m2 = seg(t, 0.46, 0.62), x3 = seg(t, 0.6, 0.66), a3 = seg(t, 0.64, 0.7);
  const ans = seg(t, 0.74, 0.88);
  const ink = '#0f172a';
  const Tok = ({ x0, y0, x1, y1, k: kk, text, c }: { x0: number; y0: number; x1: number; y1: number; k: number; text: string; c: string }) =>
    <text x={lerp(x0, x1, kk)} y={lerp(y0, y1, kk)} textAnchor="middle" fontSize={lerp(14, 18, kk)} fontWeight={800} fill={kk > 0.95 ? ink : c}>{text}</text>;
  const label = `${title}: left moment is ${fmt(force)} times ${fmt(dLeft)}, which is ${fmt(left)}. Right moment is F times ${fmt(dRight)}, also ${fmt(left)}. So F is ${fmt(left)} divided by ${fmt(dRight)}, which is ${fmt(unknown)} N.`;
  const fade = (o: number) => o;
  return <div className="rounded-xl border border-slate-200 p-2 text-center sm:p-3">
    <div className="mb-1 flex items-center justify-between gap-2"><p className="text-base font-bold text-slate-900">{title}</p><PlayButton playing={playing} onClick={play} /></div>
    <svg viewBox="0 0 420 300" className="mx-auto h-auto w-full max-w-[24rem]" role="img" aria-label={label}>
      {/* the picture */}
      <rect x={30} y={70} width={360} height={9} rx={3} fill={WOOD} stroke="#6b3f14" strokeWidth={2} />
      <path d="M210 79 L194 100 H226 Z" fill="#64748b" stroke="#334155" strokeWidth={2} strokeLinejoin="round" />
      <path d={`M${xl} 34 V54`} stroke={BLUE} strokeWidth={5} strokeLinecap="round" /><path d={`M${xl} 69 l-8 -15 h16 z`} fill={BLUE} />
      <path d={`M${xr} 34 V54`} stroke={GREEN} strokeWidth={5} strokeLinecap="round" /><path d={`M${xr} 69 l-8 -15 h16 z`} fill={GREEN} />
      <text x={xl + 10} y={24} fontSize={14} fontWeight={800} fill={BLUE}>N</text>
      <text x={xr + 6} y={24} fontSize={14} fontWeight={800} fill={GREEN}>= ? N</text>
      <path d={`M${xl} 114 H210 M${xl} 108 V120 M210 108 V120`} stroke={RED} strokeWidth={2} fill="none" />
      <path d={`M210 114 H${xr} M${xr} 108 V120`} stroke={RED} strokeWidth={2} fill="none" />
      <text x={ml + 18} y={140} fontSize={14} fontWeight={800} fill={RED}>m</text>
      <text x={mr + 18} y={140} fontSize={14} fontWeight={800} fill={RED}>m</text>
      {/* the working */}
      <path d="M20 156 H400" stroke="#e2e8f0" strokeWidth={2} />
      <text x={24} y={182} fontSize={15} fontWeight={800} fill="#64748b" opacity={row1}>Clockwise = Anticlockwise</text>
      <text x={24} y={216} fontSize={18} fontWeight={800} fill={ink} opacity={lab2}>Left:</text>
      <text x={24} y={248} fontSize={18} fontWeight={800} fill={ink} opacity={lab3}>Right:</text>
      <text x={172} y={216} textAnchor="middle" fontSize={18} fontWeight={800} fill={ink} opacity={x2}>×</text>
      <text x={268} y={216} fontSize={18} fontWeight={800} fill={ink} opacity={a2}>= {fmt(left)}</text>
      <text x={172} y={248} textAnchor="middle" fontSize={18} fontWeight={800} fill={ink} opacity={x3}>×</text>
      <text x={268} y={248} fontSize={18} fontWeight={800} fill={ink} opacity={a3}>= {fmt(left)}</text>
      <Tok x0={xl - 4} y0={24} x1={130} y1={216} k={m1} text={fmt(force)} c={BLUE} />
      <Tok x0={ml - 6} y0={140} x1={218} y1={216} k={m1} text={fmt(dLeft)} c={RED} />
      <Tok x0={xr - 12} y0={24} x1={130} y1={248} k={m2} text="F" c={GREEN} />
      <Tok x0={mr - 6} y0={140} x1={218} y1={248} k={m2} text={fmt(dRight)} c={RED} />
      <text x={24} y={286} fontSize={18} fontWeight={800} fill={GREEN} opacity={fade(ans)} transform={`translate(${(1 - ans) * 14} 0)`}>F = {fmt(left)} ÷ {fmt(dRight)} = {fmt(unknown)} N</text>
    </svg>
  </div>;
}

export function PrincipleWorkingAnimation() {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <PrincipleWorking title="Example 1" force={2} dLeft={0.6} dRight={0.3} />
    <PrincipleWorking title="Example 2" force={6} dLeft={0.2} dRight={0.4} />
    <PrincipleWorking title="Example 3" force={10} dLeft={0.5} dRight={0.25} />
    <PrincipleWorking title="Example 4" force={8} dLeft={0.15} dRight={0.6} />
  </div>;
}
