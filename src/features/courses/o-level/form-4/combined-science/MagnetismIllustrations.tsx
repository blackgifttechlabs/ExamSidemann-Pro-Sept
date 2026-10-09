import React from 'react';
import { Fig, T, Move, Flow, Anim, still } from './EnergyIllustrations';

// Animated illustrations for the Magnetism lesson. They loop by themselves with SMIL and stop for
// people who prefer reduced motion.
const BLUE = '#2563eb', RED = '#dc2626', GREEN = '#16a34a', ORANGE = '#f97316', DARK = '#334155', GREY = '#94a3b8', WATER = '#38bdf8', YELLOW = '#facc15';

/* a bar magnet; the red half is the north pole */
const Mag = ({ x, y, w = 80, h = 28, nRight = true }: { x: number; y: number; w?: number; h?: number; nRight?: boolean }) => <g>
  <rect x={x} y={y} width={w / 2} height={h} fill={nRight ? BLUE : RED} stroke={DARK} strokeWidth={2} />
  <rect x={x + w / 2} y={y} width={w / 2} height={h} fill={nRight ? RED : BLUE} stroke={DARK} strokeWidth={2} />
  <T x={x + w / 4} y={y + h / 2 + 5} size={15} color="#fff">{nRight ? 'S' : 'N'}</T>
  <T x={x + (3 * w) / 4} y={y + h / 2 + 5} size={15} color="#fff">{nRight ? 'N' : 'S'}</T>
</g>;

/* closed field lines that leave the north (right) end and return to the south (left) end */
const FieldLines = ({ cx, cy, half, off }: { cx: number; cy: number; half: number; off: boolean }) => <g>
  {[0.55, 1, 1.55].flatMap((k) => [-1, 1].map((s) =>
    <Flow key={`${k}${s}`} off={off} color={ORANGE} w={3}
      d={`M${cx + half} ${cy} C${cx + half + 60 * k} ${cy + s * 70 * k}, ${cx - half - 60 * k} ${cy + s * 70 * k}, ${cx - half} ${cy}`} />))}
</g>;

/* ---------- like poles repel, unlike poles attract ---------- */
export function PoleLawFigure() {
  const off = still();
  return <Fig label="Unlike poles attract and like poles repel" h={180} note="Top: N faces S, so the magnets pull together. Bottom: N faces N, so they push apart.">
    <T x={200} y={22} size={14}>Unlike poles attract</T>
    <Mag x={60} y={34} />
    <g><Mag x={220} y={34} /><Move off={off} values="0 0;-70 0;-70 0;0 0;0 0" keyTimes="0;0.35;0.6;0.9;1" dur="3.5s" /></g>
    <T x={200} y={104} size={14}>Like poles repel</T>
    <Mag x={60} y={116} />
    <g><Mag x={160} y={116} nRight={false} /><Move off={off} values="0 0;70 0;70 0;0 0;0 0" keyTimes="0;0.35;0.6;0.9;1" dur="3.5s" /></g>
  </Fig>;
}

/* ---------- field of a bar magnet ---------- */
export function BarFieldFigure() {
  const off = still();
  return <Fig label="Magnetic field lines around a bar magnet" h={220} note="Outside the magnet the field runs from N to S. The lines are closest together at the poles.">
    <FieldLines cx={200} cy={110} half={50} off={off} />
    <Mag x={150} y={96} w={100} />
    <circle cx={335} cy={110} r={14} fill="#fff" stroke={DARK} strokeWidth={2} />
    <g><path d="M335 106 H350 L335 110 L350 114 Z" fill="none" /><path d="M322 110 L335 105 V115 Z" fill={BLUE} /><path d="M348 110 L335 105 V115 Z" fill={RED} />
      <Move off={off} type="rotate" values="0 335 110;8 335 110;-8 335 110;0 335 110" dur="3s" /></g>
    <T x={335} y={142} size={11} color="#475569">compass</T>
  </Fig>;
}

/* ---------- field around a straight wire ---------- */
export function WireFieldFigure() {
  const off = still();
  const ring = (r: number) => `M${200 + r} 110 a${r} ${r} 0 1 0 ${-2 * r} 0 a${r} ${r} 0 1 0 ${2 * r} 0`;
  return <Fig label="Magnetic field around a straight wire carrying current towards you" h={220} note="Current towards you (•) gives an anticlockwise field. Point your right thumb along the current and your fingers curl the way the field goes.">
    {[30, 55, 80].map((r) => <Flow key={r} off={off} d={ring(r)} color={ORANGE} w={3} />)}
    <g><path d="M255 96 L249 108 H261 Z" fill={RED} /><Move off={off} type="rotate" values="0 200 110;-360 200 110" dur="6s" ease={false} /></g>
    <circle cx={200} cy={110} r={11} fill={DARK} /><circle cx={200} cy={110} r={3.5} fill="#fff" />
    <T x={200} y={142} size={11} color="#475569">wire</T>
  </Fig>;
}

/* ---------- solenoid ---------- */
export function SolenoidFigure() {
  const off = still();
  return <Fig label="Magnetic field of a solenoid" h={225} note="A solenoid behaves like a bar magnet. Inside it the field is nearly straight and points towards the north end.">
    <FieldLines cx={200} cy={105} half={60} off={off} />
    <Flow off={off} d="M142 105 H258" color={GREEN} w={4} />
    {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={146 + i * 15.4} cy={105} rx={7} ry={24} fill="none" stroke="#b45309" strokeWidth={4} />)}
    <path d="M146 129 V190 H186 M254 129 V190 H214" fill="none" stroke={DARK} strokeWidth={3} />
    <path d="M190 180 V200 M200 185 V195" stroke={DARK} strokeWidth={4} /><path d="M200 190 H214" stroke={DARK} strokeWidth={3} />
    <T x={200} y={218} size={11} color="#475569">d.c supply</T>
    <T x={276} y={86} size={15} color={RED}>N</T><T x={124} y={86} size={15} color={BLUE}>S</T>
  </Fig>;
}

/* ---------- motor effect ---------- */
export function MotorEffectFigure() {
  const off = still();
  return <Fig label="The motor effect: a current-carrying wire in a magnetic field moves" h={220} note="Field to the right, current towards you: the wire is pushed upwards. Reverse the current or the field and it moves down.">
    <rect x={30} y={50} width={60} height={120} fill={RED} stroke={DARK} strokeWidth={2} /><T x={60} y={118} size={22} color="#fff">N</T>
    <rect x={310} y={50} width={60} height={120} fill={BLUE} stroke={DARK} strokeWidth={2} /><T x={340} y={118} size={22} color="#fff">S</T>
    {[75, 110, 145].map((y) => <Flow key={y} off={off} d={`M92 ${y} H308`} color={ORANGE} w={3} />)}
    <g>
      <circle cx={200} cy={125} r={12} fill={DARK} /><circle cx={200} cy={125} r={3.5} fill="#fff" />
      <path d="M200 104 V76" stroke={GREEN} strokeWidth={4} strokeLinecap="round" /><path d="M200 66 l-8 14 h16 z" fill={GREEN} />
      <T x={232} y={86} size={12} color={GREEN} anchor="start">force</T>
      <Move off={off} values="0 0;0 -26;0 -26;0 0;0 0" keyTimes="0;0.4;0.6;1;1" dur="3s" />
    </g>
  </Fig>;
}

/* ---------- d.c motor, seen from the end of the axle ---------- */
export function MotorFigure() {
  const off = still();
  return <Fig label="A simple d.c motor with a split-ring commutator and carbon brushes" h={220} note="The coil turns between the magnets. Every half-turn the split ring swaps which half touches each brush, which reverses the current and keeps the coil turning the same way.">
    <rect x={20} y={55} width={50} height={110} fill={RED} stroke={DARK} strokeWidth={2} /><T x={45} y={117} size={20} color="#fff">N</T>
    <rect x={330} y={55} width={50} height={110} fill={BLUE} stroke={DARK} strokeWidth={2} /><T x={355} y={117} size={20} color="#fff">S</T>
    {[75, 145].map((y) => <Flow key={y} off={off} d={`M72 ${y} H328`} color={ORANGE} w={3} />)}
    <g>
      <path d="M140 110 H260" stroke="#b45309" strokeWidth={6} strokeLinecap="round" />
      <circle cx={140} cy={110} r={9} fill="#fbbf24" stroke="#b45309" strokeWidth={2} /><circle cx={260} cy={110} r={9} fill="#fbbf24" stroke="#b45309" strokeWidth={2} />
      <path d="M184 110 A16 16 0 0 1 216 110" fill="none" stroke={GREEN} strokeWidth={7} /><path d="M184 110 A16 16 0 0 0 216 110" fill="none" stroke="#7c3aed" strokeWidth={7} />
      <Move off={off} type="rotate" values="0 200 110;360 200 110" dur="3.5s" ease={false} />
    </g>
    <rect x={160} y={104} width={14} height={12} fill={DARK} /><rect x={226} y={104} width={14} height={12} fill={DARK} />
    <T x={167} y={140} size={11} color="#475569">brush</T><T x={233} y={140} size={11} color="#475569">brush</T>
    <T x={200} y={194} size={12} color="#475569">coil + split ring turning</T>
  </Fig>;
}

/* ---------- electromagnetic induction ---------- */
export function InductionFigure() {
  const off = still();
  return <Fig label="A magnet moving in and out of a coil makes the galvanometer pointer swing" h={230} note="The pointer swings while the magnet moves in, rests at zero while it is still, and swings the other way as it comes out.">
    <path d="M230 128 V180 H237 M300 128 V180 H293" fill="none" stroke={DARK} strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={232 + i * 13} cy={100} rx={9} ry={28} fill="none" stroke="#b45309" strokeWidth={4} />)}
    <g><Mag x={20} y={86} w={100} /><Move off={off} values="0 0;120 0;120 0;0 0;0 0" keyTimes="0;0.3;0.5;0.8;1" dur="5s" ease={false} /></g>
    <circle cx={265} cy={180} r={28} fill="#fff" stroke={DARK} strokeWidth={3} />
    <T x={265} y={170} size={10} color="#64748b">0</T>
    <g><path d="M265 180 V158" stroke={RED} strokeWidth={3} strokeLinecap="round" />
      <Move off={off} type="rotate" values="0 265 180;-40 265 180;-40 265 180;0 265 180;0 265 180;40 265 180;40 265 180;0 265 180;0 265 180" keyTimes="0;0.03;0.3;0.34;0.5;0.53;0.8;0.84;1" dur="5s" ease={false} /></g>
    <circle cx={265} cy={180} r={4} fill={DARK} />
    <T x={265} y={224} size={11} color="#475569">galvanometer</T>
  </Fig>;
}

/* ---------- a.c and simple d.c output graphs ---------- */
export function OutputGraphFigure() {
  const off = still();
  const N = 80, mid = 105, amp = 50;
  const wave = (f: (a: number) => number, x0: number) => Array.from({ length: N + 1 }, (_, i) => [x0 + (150 * i) / N, mid - amp * f((i / N) * 4 * Math.PI)] as const);
  const path = (p: ReadonlyArray<readonly [number, number]>) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const ac = wave(Math.sin, 35), dc = wave((a) => Math.abs(Math.sin(a)), 235);
  const Graph = ({ x0, pts, title, colour }: { x0: number; pts: ReadonlyArray<readonly [number, number]>; title: string; colour: string }) => <g>
    <T x={x0 + 85} y={26} size={14}>{title}</T>
    <path d={`M${x0} 40 V165 M${x0 - 5} ${mid} H${x0 + 165}`} stroke={DARK} strokeWidth={2} fill="none" />
    <T x={x0 - 8} y={mid + 4} size={11} anchor="end" color="#475569">0</T><T x={x0 + 4} y={38} size={11} anchor="start" color="#475569">V</T><T x={x0 + 165} y={mid + 16} size={11} anchor="end" color="#475569">t</T>
    <path d={path(pts)} fill="none" stroke={colour} strokeWidth={3} strokeLinejoin="round" />
    <circle r={5} fill={YELLOW} stroke={DARK} strokeWidth={1.5} cx={pts[0][0]} cy={pts[0][1]}>
      <Anim off={off} attr="cx" values={pts.map((p) => p[0].toFixed(1)).join(';')} dur="6s" />
      <Anim off={off} attr="cy" values={pts.map((p) => p[1].toFixed(1)).join(';')} dur="6s" />
    </circle>
  </g>;
  return <Fig label="Voltage against time for an a.c generator and a simple d.c generator" h={200} note="A.c crosses zero and reverses. A simple d.c generator stays on one side of zero but pulses.">
    <Graph x0={35} pts={ac} title="A.c generator" colour={BLUE} />
    <Graph x0={235} pts={dc} title="Simple d.c generator" colour={GREEN} />
  </Fig>;
}

const Blades = ({ cx, cy, off, r = 20 }: { cx: number; cy: number; off: boolean; r?: number }) => <g>
  <circle cx={cx} cy={cy} r={r} fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} />
  <g><path d={`M${cx} ${cy - r + 3} V${cy + r - 3} M${cx - r + 3} ${cy} H${cx + r - 3} M${cx - 11} ${cy - 11} L${cx + 11} ${cy + 11} M${cx + 11} ${cy - 11} L${cx - 11} ${cy + 11}`} stroke={DARK} strokeWidth={3} strokeLinecap="round" />
    <Move off={off} type="rotate" values={`0 ${cx} ${cy};360 ${cx} ${cy}`} dur="1.2s" ease={false} /></g>
</g>;
const Generator = ({ x, y, off }: { x: number; y: number; off: boolean }) => <g>
  <rect x={x} y={y} width={44} height={40} rx={6} fill="#fde68a" stroke={DARK} strokeWidth={2.5} /><T x={x + 22} y={y + 27} size={20}>G</T>
  <path d={`M${x + 44} ${y + 20} H${x + 74}`} stroke={DARK} strokeWidth={3} />
  <circle cx={x + 90} cy={y + 20} r={12} fill={YELLOW} stroke={DARK} strokeWidth={2}>{off ? null : <animate attributeName="opacity" values="0.35;1;0.35" dur="1.6s" repeatCount="indefinite" />}</circle>
</g>;

/* ---------- hydroelectric power station ---------- */
export function HydroFigure() {
  const off = still();
  return <Fig label="A hydroelectric power station" h={215} note="Stored water (gravitational potential energy) rushes down the penstock, turns the turbine, and the turbine turns the generator.">
    <rect x={0} y={190} width={400} height={25} fill="#d6c7a1" />
    <rect x={10} y={50} width={100} height={125} fill={WATER} opacity={0.6} /><T x={60} y={40} size={12}>Reservoir</T><T x={60} y={112} size={12} color="#0c4a6e">stored water</T>
    <rect x={110} y={50} width={18} height={140} fill={GREY} stroke={DARK} strokeWidth={2} />
    <path d="M128 150 H208" stroke="#64748b" strokeWidth={14} />
    <Flow off={off} d="M128 150 H208" w={5} /><T x={168} y={132} size={11} color="#475569">penstock</T>
    <Blades cx={230} cy={150} off={off} r={22} /><T x={230} y={116} size={12}>Turbine</T>
    <path d="M252 150 H272" stroke={DARK} strokeWidth={6} />
    <Generator x={272} y={130} off={off} /><T x={294} y={122} size={12}>Generator</T>
    <path d="M230 172 V184 H395" fill="none" stroke={WATER} strokeWidth={8} /><Flow off={off} d="M230 172 V184 H395" w={3} color="#fff" />
  </Fig>;
}

/* ---------- thermal power station ---------- */
export function ThermalFigure() {
  const off = still();
  return <Fig label="A thermal power station" h={210} note="Fuel heats water in the boiler. Steam turns the turbine and generator, then cools in the condenser and is pumped back to the boiler.">
    <rect x={20} y={70} width={80} height={80} rx={8} fill="#fecaca" stroke={DARK} strokeWidth={2.5} />
    <rect x={24} y={108} width={72} height={38} fill={WATER} opacity={0.7} /><T x={60} y={92} size={12}>Boiler</T>
    <path d="M48 180 Q44 165 54 157 Q54 169 60 165 Q60 155 66 149 Q76 163 72 180 Z" fill={ORANGE}>{off ? null : <animate attributeName="opacity" values="0.6;1;0.6" dur="0.9s" repeatCount="indefinite" />}</path>
    <T x={60} y={198} size={11} color="#475569">burning fuel</T>
    <path d="M100 90 H168" stroke={GREY} strokeWidth={10} /><Flow off={off} d="M100 90 H168" color="#fff" w={4} /><T x={134} y={76} size={11} color="#475569">steam</T>
    <Blades cx={190} cy={90} off={off} /><T x={190} y={56} size={12}>Turbine</T>
    <path d="M210 90 H236" stroke={DARK} strokeWidth={6} /><Generator x={236} y={70} off={off} /><T x={258} y={62} size={12}>Generator</T>
    <path d="M190 110 V150" stroke={GREY} strokeWidth={10} /><Flow off={off} d="M190 110 V150" color="#fff" w={4} />
    <rect x={150} y={150} width={80} height={36} rx={6} fill="#bae6fd" stroke={DARK} strokeWidth={2.5} /><T x={190} y={173} size={12}>Condenser</T>
    <path d="M150 168 H112 V125 H100" fill="none" stroke={WATER} strokeWidth={6} /><Flow off={off} d="M150 168 H112 V125 H100" color="#fff" w={2.5} />
    <circle cx={112} cy={150} r={8} fill="#e2e8f0" stroke={DARK} strokeWidth={2} />
  </Fig>;
}

/* ---------- magnetic and non-magnetic materials ---------- */
export function MaterialsFigure() {
  const off = still();
  const Pointer = ({ x, text, colour, up }: { x: number; text: string; colour: string; up: boolean }) => <g opacity={off ? 1 : 0}>
    <T x={x} y={up ? 166 : 114} size={13} color={colour}>{text}</T>
    <path d={up ? `M${x} 152 V140 M${x - 6} 146 L${x} 138 L${x + 6} 146` : `M${x} 122 V136 M${x - 6} 130 L${x} 138 L${x + 6} 130`} fill="none" stroke={colour} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    {off ? null : <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.3;0.38;0.68;0.73;1" dur="5s" repeatCount="indefinite" />}
  </g>;
  const pulled = (dy: number) => off ? { transform: `translate(0 ${dy})` } : {};
  const up = (dy: number) => <Move off={off} values={`0 0;0 0;0 ${dy};0 ${dy};0 0;0 0`} keyTimes="0;0.25;0.32;0.7;0.78;1" dur="5s" ease={false} />;
  const lower = <Move off={off} values="0 -40;0 0;0 0;0 -40;0 -40" keyTimes="0;0.25;0.7;0.9;1" dur="5s" />;
  return <Fig label="A magnet pulls iron and steel but not copper, aluminium or wood" h={215} note="The magnet pulls the iron nail and the steel paper clip up to it. It cannot pull the copper coin, the aluminium can or the wood.">
    <T x={82} y={18} size={14} color={GREEN}>Magnetic</T><T x={310} y={18} size={14} color={RED}>Non-magnetic</T>
    <path d="M200 8 V205" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
    <rect x={0} y={180} width={400} height={5} fill="#a8a29e" />
    <g><Mag x={42} y={70} />{lower}</g><g><Mag x={270} y={70} />{lower}</g>
    <g {...pulled(-50)}><rect x={52} y={152} width={6} height={28} fill="#64748b" /><rect x={48} y={150} width={14} height={4} fill="#475569" />{up(-50)}</g>
    <g {...pulled(-56)}><rect x={104} y={156} width={12} height={24} rx={6} fill="none" stroke="#94a3b8" strokeWidth={3} />{up(-56)}</g>
    <circle cx={240} cy={168} r={12} fill="#c2410c" stroke="#7c2d12" strokeWidth={2} />
    <rect x={292} y={146} width={22} height={34} rx={4} fill="#cbd5e1" stroke={DARK} strokeWidth={2} />
    <rect x={350} y={156} width={34} height={24} fill="#b0773a" stroke="#7c4a1d" strokeWidth={2} />
    <T x={55} y={200} size={10} color="#475569">iron nail</T><T x={110} y={200} size={10} color="#475569">steel clip</T>
    <T x={240} y={200} size={10} color="#475569">copper</T><T x={303} y={200} size={10} color="#475569">aluminium</T><T x={367} y={200} size={10} color="#475569">wood</T>
    <Pointer x={82} text="this is magnetic" colour={GREEN} up />
    <Pointer x={310} text="not magnetic: not pulled" colour={RED} up={false} />
  </Fig>;
}
