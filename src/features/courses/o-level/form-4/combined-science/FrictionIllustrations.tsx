import React from 'react';
import { usePlayOnce, PlayButton, END } from './MomentIllustrations';

// Flat illustrations for friction.
const BLUE = '#2563eb', RED = '#dc2626', WOOD = '#b0773a', SKIN = '#d9a07a';

function Card({ title, note, label, children, h = 190, w = 380 }: { title: string; note: React.ReactNode; label: string; children: React.ReactNode; h?: number; w?: number }) {
  return <div className="w-full rounded-xl border border-slate-200 p-3 text-center">
    <p className="text-base font-bold text-slate-900">{title}</p>
    <svg viewBox={`0 0 ${w} ${h}`} className="mx-auto h-auto w-full max-w-[20rem]" role="img" aria-label={`${title}. ${label}`}>{children}</svg>
    <p className="text-sm text-slate-700">{note}</p>
  </div>;
}
function Arrow({ x1, x2, y, color, label }: { x1: number; x2: number; y: number; color: string; label: string }) {
  const d = x2 >= x1 ? 1 : -1;
  return <g><path d={`M${x1} ${y} H${x2 - d * 12}`} stroke={color} strokeWidth={6} strokeLinecap="round" /><path d={`M${x2} ${y} l${-d * 18} -11 v22 z`} fill={color} />
    <text x={x2 + (d > 0 ? 6 : -6)} y={y - 14} textAnchor={d > 0 ? 'end' : 'start'} fontSize={15} fontWeight={800} fill={color}>{label}</text></g>;
}
const Block = ({ x, y = 85 }: { x: number; y?: number }) => <g><rect x={x} y={y} width={90} height={55} rx={4} fill="#9a6b3b" stroke="#5b3a17" strokeWidth={2.5} /><path d={`M${x} ${y + 27} H${x + 90}`} stroke="#5b3a17" strokeWidth={1.5} opacity={0.5} /></g>;
const Bumpy = ({ y = 140, w = 380 }: { y?: number; w?: number }) => <path d={`M10 ${y} ${Array.from({ length: Math.floor((w - 20) / 5) }, (_, i) => `l5 ${i % 2 ? 6 : -6}`).join(' ')}`} fill="none" stroke="#7c6a4a" strokeWidth={3} strokeLinejoin="round" />;
const Flat = ({ y = 140, w = 380 }: { y?: number; w?: number }) => <path d={`M10 ${y} H${w - 10}`} stroke="#7c6a4a" strokeWidth={4} strokeLinecap="round" />;

export function FrictionOpposes() {
  return <Card title="Friction opposes motion" label="A block is pulled to the right. Friction acts to the left, the opposite way." note={<>You pull the block to the right. Friction pushes the <strong>opposite way</strong>, to the left.</>}>
    <Bumpy /><Block x={145} />
    <Arrow x1={235} x2={335} y={112} color={BLUE} label="Pull" />
    <Arrow x1={145} x2={45} y={112} color={RED} label="Friction" />
  </Card>;
}

// Both blocks get the same pull. Press play: the block on the smooth surface slides far, the block
// on the rough surface judders and only moves a little. The finished picture is shown by default.
export function FrictionSurfaces() {
  const { t, playing, play } = usePlayOnce(5);
  const p = Math.min(1, t / END);
  const jitter = playing ? Math.sin(p * 90) * 2.2 * (1 - p * 0.5) : 0;
  const xRough = 120 + 36 * p + jitter;
  const xSmooth = 120 + 110 * Math.pow(p, 1.6);
  const heat = playing ? 0.35 + 0.65 * Math.abs(Math.sin(p * 40)) : 0;
  return <div className="space-y-2">
    <div className="flex justify-end"><PlayButton playing={playing} onClick={play} /></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Card w={440} title="Rough surface" label="On a rough surface the friction arrow is long: big friction. The block moves only a little." note={<>The surfaces catch on each other. <strong>Big friction.</strong></>}>
        <Bumpy w={440} />
        {[0, 1, 2, 3].map(i => <circle key={i} cx={xRough + 12 + i * 22} cy={138} r={3.2} fill="#f97316" opacity={heat * (0.5 + 0.5 * Math.sin(p * 55 + i))} />)}
        <Block x={xRough} />
        <Arrow x1={xRough + 90} x2={xRough + 175} y={112} color={BLUE} label="Pull" />
        <Arrow x1={xRough} x2={xRough - 105} y={112} color={RED} label="Big friction" />
      </Card>
      <Card w={440} title="Smooth surface" label="On a smooth surface the friction arrow is short: small friction. The block slides far." note={<>The surfaces slide easily. <strong>Small friction.</strong></>}>
        <Flat w={440} /><Block x={xSmooth} />
        <Arrow x1={xSmooth + 90} x2={xSmooth + 175} y={112} color={BLUE} label="Pull" />
        <Arrow x1={xSmooth} x2={xSmooth - 60} y={112} color={RED} label="Small" />
      </Card>
    </div>
  </div>;
}

export function FrictionMeasure() {
  return <Card title="Measuring friction with a spring balance" h={200} label="A block is pulled along the table with a spring balance. The reading on the balance equals the friction when the block moves at a steady speed." note={<>Pull the block slowly at a steady speed. The reading on the spring balance is the <strong>friction</strong>.</>}>
    <Flat y={150} /><Block x={40} y={95} />
    <path d="M130 122 H172" stroke="#475569" strokeWidth={3} />
    <rect x={172} y={100} width={120} height={44} rx={8} fill="#e2e8f0" stroke="#475569" strokeWidth={2.5} />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${186 + i * 16} 144 v${i % 2 === 0 ? -14 : -9}`} stroke="#0f172a" strokeWidth={1.5} />)}
    {[0, 2, 4, 6].map((n, i) => <text key={n} x={186 + i * 32} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">{n}</text>)}
    <path d="M250 100 V150" stroke={RED} strokeWidth={3} />
    <path d="M292 122 H318" stroke="#475569" strokeWidth={3} /><rect x={318} y={110} width={14} height={24} rx={6} fill={SKIN} stroke="#a16207" strokeWidth={1.5} />
    <text x={250} y={92} textAnchor="middle" fontSize={15} fontWeight={800} fill={RED}>reads 3 N</text>
    <Arrow x1={338} x2={372} y={122} color={BLUE} label="" />
  </Card>;
}
