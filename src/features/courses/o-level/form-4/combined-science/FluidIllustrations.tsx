import React from 'react';

// Flat illustrations for pressure, fluid systems and pumps. Flows and pistons loop by themselves.
const BLUE = '#2563eb', RED = '#dc2626', GREEN = '#16a34a', WATER = '#38bdf8', DARK = '#334155', GREY = '#94a3b8';
const still = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Fig({ label, note, children, h = 220 }: { label: string; note?: React.ReactNode; children: React.ReactNode; h?: number }) {
  return <figure className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 p-3 text-center">
    <svg viewBox={`0 0 400 ${h}`} className="h-auto w-full" role="img" aria-label={label}>{children}</svg>
    {note ? <figcaption className="text-base text-slate-700">{note}</figcaption> : null}
  </figure>;
}
const T = ({ x, y, size = 14, color = '#0f172a', anchor = 'middle', weight = 800, children }: { x: number; y: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; children: React.ReactNode }) =>
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color}>{children}</text>;
const Down = ({ x, y1, y2, c, w = 5 }: { x: number; y1: number; y2: number; c: string; w?: number }) => <g><path d={`M${x} ${y1} V${y2 - 9}`} stroke={c} strokeWidth={w} strokeLinecap="round" /><path d={`M${x} ${y2} l-8 -14 h16 z`} fill={c} /></g>;
const Up = ({ x, y1, y2, c, w = 5 }: { x: number; y1: number; y2: number; c: string; w?: number }) => <g><path d={`M${x} ${y1} V${y2 + 9}`} stroke={c} strokeWidth={w} strokeLinecap="round" /><path d={`M${x} ${y2} l-8 14 h16 z`} fill={c} /></g>;
function Move({ values, dur, off, keyTimes }: { values: string; dur: string; off: boolean; keyTimes?: string }) {
  if (off) return null;
  return <animateTransform attributeName="transform" type="translate" values={values} dur={dur} repeatCount="indefinite" calcMode="spline" keyTimes={keyTimes ?? '0;0.5;1'} keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />;
}
function Flow({ d, off, color = WATER, w = 5 }: { d: string; off: boolean; color?: string; w?: number }) {
  return <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray="7 7">
    {off ? null : <animate attributeName="stroke-dashoffset" values="14;0" dur="0.7s" repeatCount="indefinite" />}</path>;
}

export function PressureAreaFigure() {
  return <Fig label="The same 100 N force pressing on a small area and on a large area. The small area gives a big pressure, so it sinks into the sand. The large area gives a small pressure." h={215}
    note={<>The <strong>same force</strong>. A small area gives a <strong>big pressure</strong>. A large area gives a <strong>small pressure</strong>.</>}>
    <rect x={10} y={150} width={380} height={40} fill="#f5deb3" />
    <path d="M10 150 H70 L82 168 L98 168 L110 150 H390" fill="none" stroke="#b08a4e" strokeWidth={3} />
    <rect x={64} y={80} width={52} height={50} rx={4} fill="#9a6b3b" stroke="#5b3a17" strokeWidth={2.5} />
    <path d="M82 130 H98 V168 H82 Z" fill="#475569" stroke="#0f172a" strokeWidth={2} />
    <Down x={90} y1={36} y2={76} c={BLUE} /><T x={90} y={26} size={15} color={BLUE}>100 N</T>
    <T x={90} y={208} size={13} color={RED}>small area</T><T x={90} y={140} size={0}>{''}</T>
    <rect x={240} y={118} width={120} height={32} rx={4} fill="#9a6b3b" stroke="#5b3a17" strokeWidth={2.5} />
    <path d="M240 150 H360" stroke="#475569" strokeWidth={5} />
    <Down x={300} y1={36} y2={114} c={BLUE} /><T x={300} y={26} size={15} color={BLUE}>100 N</T>
    <T x={300} y={208} size={13} color={GREEN}>large area</T>
  </Fig>;
}

export function DepthJetsFigure() {
  const off = still();
  const jets = [{ y: 74, d: 36 }, { y: 120, d: 78 }, { y: 166, d: 118 }];
  return <Fig label="A tank of water with three holes at different depths. The jet from the deepest hole shoots out furthest, because pressure increases with depth." h={235}
    note={<>The <strong>deeper</strong> the hole, the bigger the pressure and the <strong>stronger the jet</strong>.</>}>
    <rect x={20} y={205} width={360} height={10} fill="#a16207" />
    <rect x={110} y={30} width={150} height={175} fill="#e0f2fe" stroke={DARK} strokeWidth={3} rx={4} />
    <rect x={113} y={55} width={144} height={147} fill={WATER} opacity={0.75} />
    <path d="M113 55 H257" stroke="#0284c7" strokeWidth={3} />
    {jets.map((j, i) => <g key={i}>
      <circle cx={260} cy={j.y} r={5} fill="#fff" stroke={DARK} strokeWidth={2.5} />
      <Flow off={off} d={`M260 ${j.y} Q${260 + j.d * 0.7} ${j.y - 8} ${260 + j.d} 203`} />
    </g>)}
    <path d="M60 55 V202" stroke={DARK} strokeWidth={2} strokeDasharray="4 4" /><path d="M54 62 L60 54 L66 62 M54 195 L60 203 L66 195" fill="none" stroke={DARK} strokeWidth={2} />
    <T x={52} y={130} anchor="end" size={13}>depth</T>
    <T x={330} y={90} size={12} color="#475569" anchor="start">small</T><T x={330} y={140} size={12} color="#475569" anchor="start" weight={700}> </T><T x={338} y={192} size={12} color={RED} anchor="start">biggest</T>
  </Fig>;
}

export function AtmosphereFigure() {
  return <Fig label="Air pushes on a flat surface from every side. This push is atmospheric pressure." h={190}
    note={<>Air is heavy. It pushes on <strong>everything</strong>, from all sides. This push is <strong>atmospheric pressure</strong>.</>}>
    <rect x={150} y={70} width={100} height={50} rx={4} fill="#9a6b3b" stroke="#5b3a17" strokeWidth={2.5} /><T x={200} y={101} size={14} color="#fff">book</T>
    <Down x={170} y1={14} y2={64} c={BLUE} /><Down x={230} y1={14} y2={64} c={BLUE} />
    <Up x={170} y1={176} y2={128} c={BLUE} /><Up x={230} y1={176} y2={128} c={BLUE} />
    <g><path d="M60 84 H138" stroke={BLUE} strokeWidth={5} strokeLinecap="round" /><path d="M146 84 l-14 -8 v16 z" fill={BLUE} /></g>
    <g><path d="M340 106 H262" stroke={BLUE} strokeWidth={5} strokeLinecap="round" /><path d="M254 106 l14 -8 v16 z" fill={BLUE} /></g>
    <T x={200} y={14} size={13} color={BLUE}>air</T>
  </Fig>;
}

export function ManometerFigure() {
  return <Fig label="A U-shaped manometer. One side is joined to a gas supply and the other is open to the air. The liquid is lower on the gas side. The vertical difference between the two levels is h." h={250}
    note={<>The gas pushes its side of the liquid <strong>down</strong>. Measure the <strong>vertical</strong> height difference <strong>h</strong>.</>}>
    <circle cx={90} cy={50} r={32} fill="#fef3c7" stroke={DARK} strokeWidth={3} /><T x={90} y={55} size={16}>gas</T>
    <path d="M122 50 H150" stroke={DARK} strokeWidth={4} /><path d="M150 50 V80" stroke={DARK} strokeWidth={4} />
    <path d="M138 78 V190 Q138 212 160 212 H238 Q260 212 260 190 V40 M162 78 V188 Q162 196 168 196 H230 Q236 196 236 188 V40" fill="none" stroke={DARK} strokeWidth={3} />
    <path d="M139 118 V190 Q139 210 160 210 H238 Q259 210 259 190 V78 H237 V188 Q237 195 231 195 H168 Q161 195 161 188 V118 Z" fill={WATER} opacity={0.8} />
    <path d="M140 118 H160" stroke="#0369a1" strokeWidth={3} /><path d="M238 78 H258" stroke="#0369a1" strokeWidth={3} />
    <path d="M300 118 H178 M300 78 H270" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" />
    <path d="M296 80 V116" stroke={RED} strokeWidth={3} /><path d="M290 88 L296 78 L302 88 M290 108 L296 118 L302 108" fill="none" stroke={RED} strokeWidth={3} />
    <T x={312} y={102} size={20} color={RED} anchor="start">h</T>
    <T x={250} y={28} size={13} color="#475569">open to the air</T>
  </Fig>;
}

export function SiphonFigure() {
  const off = still();
  const tube = 'M100 118 V30 Q100 16 114 16 H200 Q214 16 214 30 V172';
  return <Fig label="A siphon. A tube full of water goes up over the edge of a high tank and down to an outlet that is lower than the water surface in the high tank. Water flows through the tube into the lower tank." h={262}
    note={<>The tube is full of water and the outlet is <strong>lower</strong> than the water surface in the high tank. The water keeps flowing.</>}>
    {/* high tank */}
    <rect x={20} y={40} width={130} height={110} fill="#e0f2fe" stroke={DARK} strokeWidth={3} rx={4} /><rect x={23} y={72} width={124} height={75} fill={WATER} opacity={0.75} />
    <path d="M23 72 H147" stroke="#0369a1" strokeWidth={2.5} />
    {/* lower tank, directly under the outlet */}
    <rect x={160} y={150} width={140} height={84} fill="#e0f2fe" stroke={DARK} strokeWidth={3} rx={4} /><rect x={163} y={206} width={134} height={25} fill={WATER} opacity={0.75} />
    {/* the tube: full of water, flowing */}
    <path d={tube} fill="none" stroke={DARK} strokeWidth={12} strokeLinecap="round" /><path d={tube} fill="none" stroke="#e0f2fe" strokeWidth={7} strokeLinecap="round" />
    <Flow off={off} d={tube} w={4} />
    <path d="M214 176 V204" stroke={WATER} strokeWidth={5} strokeLinecap="round" strokeDasharray="6 6">{off ? null : <animate attributeName="stroke-dashoffset" values="12;0" dur="0.6s" repeatCount="indefinite" />}</path>
    {/* the height difference */}
    <path d="M150 72 H326" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" /><path d="M326 76 V204" stroke={RED} strokeWidth={2.5} /><path d="M320 84 L326 74 L332 84 M320 196 L326 206 L332 196" fill="none" stroke={RED} strokeWidth={2.5} />
    <path d="M300 206 H332" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" />
    <T x={338} y={132} anchor="start" size={12} color={RED}>outlet is</T><T x={338} y={148} anchor="start" size={12} color={RED}>lower than</T><T x={338} y={164} anchor="start" size={12} color={RED}>the surface</T>
    <T x={85} y={170} size={13} color="#475569">high tank</T><T x={230} y={252} size={13} color="#475569">lower tank</T>
  </Fig>;
}

export function HydraulicFigure() {
  const off = still();
  // The liquid cannot be squeezed: when the small piston goes down 26, the large piston (ten times the area) rises 2.6.
  const spline = { calcMode: 'spline' as const, keyTimes: '0;0.5;1', keySplines: '0.45 0 0.55 1;0.45 0 0.55 1' };
  return <Fig label="A hydraulic system. A small force of 50 newtons on a small piston of area 0.002 square metres makes a pressure that is passed through the liquid. The large piston has an area of 0.020 square metres, ten times bigger, so it gives a force of 500 newtons. It moves one tenth as far." h={262}
    note={<>Pressure in the liquid is the same everywhere. The <strong>small</strong> piston moves a long way down; the <strong>large</strong> piston moves a short way up, with a <strong>bigger</strong> force.</>}>
    {/* liquid: one connected volume, bounded by the two piston faces */}
    <path d="M40 110 H80 V190 H230 V110 H356 V216 H40 Z" fill={WATER} opacity={0.8}>
      {off ? null : <animate attributeName="d" dur="4.5s" repeatCount="indefinite" values="M40 110 H80 V190 H230 V110 H356 V216 H40 Z;M40 136 H80 V190 H230 V107.4 H356 V216 H40 Z;M40 110 H80 V190 H230 V110 H356 V216 H40 Z" {...spline} />}
    </path>
    {/* cylinder walls and pipe */}
    <path d="M38 94 V218 H358 V94" fill="none" stroke={DARK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M82 94 V190 H228 V94" fill="none" stroke={DARK} strokeWidth={4} strokeLinejoin="round" />
    {/* small piston with rod and the 50 N force */}
    <g>
      <rect x={40} y={96} width={40} height={14} rx={3} fill={GREY} stroke={DARK} strokeWidth={2.5} />
      <rect x={57} y={52} width={6} height={44} fill={DARK} />
      <Down x={60} y1={8} y2={48} c={BLUE} /><T x={74} y={24} anchor="start" size={15} color={BLUE}>50 N</T>
      <Move off={off} values="0 0;0 26;0 0" dur="4.5s" />
    </g>
    {/* large piston with the load and the 500 N force */}
    <g>
      <rect x={230} y={96} width={126} height={14} rx={3} fill={GREY} stroke={DARK} strokeWidth={2.5} />
      <rect x={268} y={52} width={50} height={44} rx={3} fill="#9a6b3b" stroke="#5b3a17" strokeWidth={2.5} /><T x={293} y={79} size={13} color="#fff">load</T>
      <Up x={293} y1={46} y2={10} c={RED} /><T x={309} y={28} anchor="start" size={15} color={RED}>500 N</T>
      <Move off={off} values="0 0;0 -2.6;0 0" dur="4.5s" />
    </g>
    <T x={60} y={240} size={12} color="#0f172a">small piston</T><T x={60} y={256} size={12} color="#0f172a">0.002 m²</T>
    <T x={293} y={240} size={12} color="#0f172a">large piston</T><T x={293} y={256} size={12} color="#0f172a">0.020 m²</T>
  </Fig>;
}

export function BicyclePumpFigure() {
  const off = still();
  const fade = (values: string) => off ? null : <animate attributeName="opacity" values={values} keyTimes="0;0.45;0.55;1" dur="4s" repeatCount="indefinite" />;
  return <Fig label="A bicycle pump. On the downstroke the piston pushes down, compresses the air and sends it into the tyre through a one-way valve. On the upstroke the piston rises and air enters the cylinder." h={278}
    note={<><strong>Down:</strong> the air is squeezed into the tyre through a one-way valve. <strong>Up:</strong> air comes into the cylinder.</>}>
    {/* cylinder, piston, rod and handle */}
    <rect x={150} y={92} width={60} height={140} rx={4} fill="#e2e8f0" stroke={DARK} strokeWidth={3} />
    <g>
      <rect x={153} y={122} width={54} height={10} rx={2} fill={DARK} />
      <rect x={177} y={36} width={6} height={86} fill={DARK} /><rect x={120} y={26} width={120} height={10} rx={5} fill={RED} />
      <Move off={off} values="0 0;0 56;0 0" dur="4s" />
    </g>
    {/* hose, one-way valve and tyre */}
    <path d="M210 214 H300" stroke={DARK} strokeWidth={5} />
    <rect x={252} y={203} width={16} height={22} rx={3} fill={GREEN} stroke={DARK} strokeWidth={2} /><T x={262} y={192} size={11} color={GREEN}>one-way valve</T>
    <circle cx={340} cy={214} r={30} fill="none" stroke="#1f2937" strokeWidth={13} /><T x={340} y={218} size={11} color="#475569">air</T>
    <T x={340} y={270} size={13}>tyre</T>
    {/* what is happening now (left column, clear of the pump) */}
    <g>{fade('1;1;0;0')}<T x={10} y={74} anchor="start" size={15} color={RED}>Downstroke</T><T x={10} y={92} anchor="start" size={12} color="#475569" weight={700}>air goes into the tyre</T><Down x={64} y1={104} y2={190} c={RED} /></g>
    <g>{fade('0;0;1;1')}<T x={10} y={74} anchor="start" size={15} color={BLUE}>Upstroke</T><T x={10} y={92} anchor="start" size={12} color="#475569" weight={700}>air comes in</T><Up x={64} y1={200} y2={104} c={BLUE} /></g>
  </Fig>;
}

export function BlairPumpFigure() {
  const off = still();
  const rot = (values: string, keyTimes: string, cx: number, cy: number) => off ? null :
    <animateTransform attributeName="transform" type="rotate" values={values.split(';').map(v => `${v} ${cx} ${cy}`).join(';')} keyTimes={keyTimes} dur="4s" repeatCount="indefinite" />;
  const fade = (values: string) => off ? null : <animate attributeName="opacity" values={values} keyTimes="0;0.45;0.55;1" dur="4s" repeatCount="indefinite" />;
  return <Fig label="A simple Blair pump. On the downstroke the foot valve is shut and water passes through the piston valve towards the spout. On the upstroke the piston valve is shut and the foot valve opens, so water comes in from below." h={285}
    note={<><strong>Down:</strong> the foot valve shuts and water goes through the piston valve. <strong>Up:</strong> the piston valve shuts and the foot valve opens, so water comes in.</>}>
    <rect x={10} y={244} width={380} height={34} fill={WATER} opacity={0.7} /><T x={20} y={266} anchor="start" size={12} color="#075985">water below ground</T>
    {/* cylinder and inlet pipe */}
    <rect x={150} y={84} width={60} height={160} rx={4} fill="#e2e8f0" stroke={DARK} strokeWidth={3} />
    <path d="M180 244 V270" stroke={DARK} strokeWidth={8} />
    <rect x={153} y={150} width={54} height={92} fill={WATER} opacity={0.55} />
    {/* foot valve: shut on the downstroke, open on the upstroke */}
    <g><rect x={158} y={226} width={34} height={7} rx={2} fill={GREEN} stroke={DARK} strokeWidth={1.5} />{rot('0;0;-55;-55;0', '0;0.45;0.55;0.95;1', 158, 229)}</g>
    <T x={222} y={232} anchor="start" size={11} color={GREEN}>foot valve</T>
    {/* piston, rod and handle */}
    <g>
      <rect x={153} y={132} width={54} height={12} rx={2} fill={DARK} />
      <g><rect x={160} y={124} width={26} height={6} rx={2} fill="#facc15" stroke={DARK} strokeWidth={1.5} />{rot('-50;-50;0;0', '0;0.45;0.55;1', 160, 127)}</g>
      <rect x={177} y={32} width={6} height={100} fill={DARK} /><rect x={130} y={24} width={100} height={9} rx={4} fill={RED} />
      <Move off={off} values="0 0;0 56;0 0" dur="4s" />
    </g>
    <T x={215} y={122} anchor="start" size={11} color="#a16207">piston valve</T>
    {/* spout */}
    <path d="M210 100 H300 V84" fill="none" stroke={DARK} strokeWidth={8} /><path d="M300 100 V116" stroke={DARK} strokeWidth={8} />
    <g><path d="M300 118 V170" stroke={WATER} strokeWidth={5} strokeLinecap="round" strokeDasharray="6 6">{off ? null : <animate attributeName="stroke-dashoffset" values="12;0" dur="0.6s" repeatCount="indefinite" />}</path>{fade('1;1;0;0')}</g>
    <T x={312} y={86} anchor="start" size={13}>spout</T>
    {/* what is happening now */}
    <g>{fade('1;1;0;0')}<T x={12} y={50} anchor="start" size={15} color={RED}>Downstroke</T><Down x={96} y1={64} y2={150} c={RED} /></g>
    <g>{fade('0;0;1;1')}<T x={12} y={50} anchor="start" size={15} color={BLUE}>Upstroke</T><Up x={96} y1={190} y2={64} c={BLUE} /></g>
  </Fig>;
}
