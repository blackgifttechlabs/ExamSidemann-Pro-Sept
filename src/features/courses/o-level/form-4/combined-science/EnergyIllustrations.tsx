import React from 'react';

// Flat, animated illustrations for the Energy lesson. Everything loops by itself with SMIL and is
// switched off for people who prefer reduced motion.
const BLUE = '#2563eb', RED = '#dc2626', GREEN = '#16a34a', ORANGE = '#f97316', DARK = '#334155', GREY = '#94a3b8', WATER = '#38bdf8', YELLOW = '#facc15', WOOD = '#b0773a';
export const still = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function Fig({ label, note, children, h = 220, w = 400 }: { label: string; note?: React.ReactNode; children: React.ReactNode; h?: number; w?: number }) {
  return <figure className="mx-auto w-full max-w-lg rounded-xl border border-slate-200 p-3 text-center">
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img" aria-label={label}>{children}</svg>
    {note ? <figcaption className="text-base text-slate-700">{note}</figcaption> : null}
  </figure>;
}
export const T = ({ x, y, size = 14, color = '#0f172a', anchor = 'middle', weight = 800, children }: { x: number; y: number; size?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number; children: React.ReactNode }) =>
  <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={color}>{children}</text>;
export const Anim = ({ attr, values, dur, keyTimes, off, begin, discrete }: { attr: string; values: string; dur: string; keyTimes?: string; off: boolean; begin?: string; discrete?: boolean }) =>
  off ? null : <animate attributeName={attr} values={values} dur={dur} repeatCount="indefinite" {...(keyTimes ? { keyTimes } : {})} {...(begin ? { begin } : {})} {...(discrete ? { calcMode: 'discrete' } : {})} />;
export const Move = ({ values, dur, off, keyTimes, type = 'translate', ease = true }: { values: string; dur: string; off: boolean; keyTimes?: string; type?: 'translate' | 'rotate' | 'scale'; ease?: boolean }) => {
  if (off) return null;
  const n = values.split(';').length;
  const kt = keyTimes ?? Array.from({ length: n }, (_, i) => (i / (n - 1)).toFixed(3)).join(';');
  return <animateTransform attributeName="transform" type={type} values={values} dur={dur} repeatCount="indefinite" keyTimes={kt}
    {...(ease ? { calcMode: 'spline', keySplines: Array.from({ length: n - 1 }, () => '0.45 0 0.55 1').join(';') } : {})} />;
};
export const Flow = ({ d, off, color = WATER, w = 5, dash = '7 7' }: { d: string; off: boolean; color?: string; w?: number; dash?: string }) =>
  <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={dash}>{off ? null : <animate attributeName="stroke-dashoffset" values="14;0" dur="0.8s" repeatCount="indefinite" />}</path>;
const Right = ({ x1, x2, y, c, w = 5 }: { x1: number; x2: number; y: number; c: string; w?: number }) => <g><path d={`M${x1} ${y} H${x2 - 10}`} stroke={c} strokeWidth={w} strokeLinecap="round" /><path d={`M${x2} ${y} l-15 -8 v16 z`} fill={c} /></g>;

/* ---------- a table that turns into two-per-row cards on a phone ---------- */
export function PicTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <>
    <div className="hidden overflow-x-auto sm:block"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map((h, i) => <th key={i} scope="col" className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className="border border-slate-200 p-3 align-top">{c}</td>)}</tr>)}</tbody></table></div>
    <div className="grid grid-cols-2 items-start gap-3 sm:hidden">
      {rows.map((r, i) => <div key={i} className="rounded-xl border border-slate-200 p-2">
        <p className="mb-2 text-base font-bold leading-snug text-slate-900">{r[1]}</p><div className="mb-2">{r[0]}</div>
        {r.slice(2).map((c, j) => <p key={j} className="mt-1 text-sm leading-snug">{c}</p>)}
      </div>)}
    </div>
  </>;
}

/* ---------- a question with a plain answer ---------- */
export function QA({ q, a }: { q: string; a: React.ReactNode }) {
  return <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-4">
    <p className="mb-2 border-b border-slate-200 pb-2 text-lg font-semibold text-slate-800">{q}</p>
    <p className="text-lg"><span className="mr-2 font-bold text-slate-500">Answer:</span>{a}</p>
  </div>;
}

/* ---------- energy chain: boxes joined by arrows, lit one after the other ---------- */
export function Chain({ items, title }: { items: string[]; title?: string }) {
  return <div className="rounded-xl border border-slate-200 p-3">
    <style>{`@keyframes chainLit{0%,12%{background:#fff;transform:scale(1)}18%,40%{background:#fef3c7;transform:scale(1.04)}50%,100%{background:#fff;transform:scale(1)}}@media (prefers-reduced-motion: reduce){.chain-box{animation:none!important}}`}</style>
    {title ? <p className="mb-2 text-lg font-bold text-slate-900">{title}</p> : null}
    <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {items.map((x, i) => <React.Fragment key={i}>
        {i > 0 ? <span className="text-xl font-bold text-orange-500" aria-hidden="true">→</span> : null}
        <span className="chain-box rounded-lg border border-slate-300 px-3 py-1.5 text-base font-semibold text-slate-800" style={{ animation: `chainLit ${items.length * 0.9 + 1.5}s ease-in-out ${i * 0.9}s infinite` }}>{x}</span>
      </React.Fragment>)}
    </div>
  </div>;
}

/* ---------- 1. forms of energy: a small moving picture for each ---------- */
export function FormPic({ kind }: { kind: 'kinetic' | 'gpe' | 'elastic' | 'chemical' | 'light' | 'thermal' | 'electrical' | 'sound' }) {
  const off = still();
  const body = (() => {
    switch (kind) {
      case 'kinetic': return <>
        <path d="M10 66 H150" stroke="#7c6a4a" strokeWidth={4} strokeLinecap="round" />
        <g><circle cx={40} cy={50} r={14} fill={ORANGE} stroke="#b45309" strokeWidth={2.5} /><path d="M6 44 H22 M2 52 H20 M8 59 H22" stroke={GREY} strokeWidth={3} strokeLinecap="round" /><Move off={off} values="0 0;90 0;0 0" dur="3s" /></g>
      </>;
      case 'gpe': return <>
        <path d="M10 70 H150" stroke="#7c6a4a" strokeWidth={4} strokeLinecap="round" /><rect x={20} y={30} width={44} height={6} fill="#a16207" /><path d="M26 36 V70 M58 36 V70" stroke="#a16207" strokeWidth={4} />
        <g><rect x={30} y={14} width={24} height={16} fill="#b4513a" stroke="#7c2d12" strokeWidth={2} /><Move off={off} values="0 0;0 0;0 40;0 40;0 0" keyTimes="0;0.3;0.55;0.85;1" dur="3.4s" ease={false} /></g>
        <rect x={100} y={54} width={24} height={16} fill="#b4513a" stroke="#7c2d12" strokeWidth={2} /><T x={112} y={90} size={10} color="#475569">on the floor</T><T x={42} y={90} size={10} color="#475569">held high</T>
      </>;
      case 'elastic': return <>
        <rect x={10} y={22} width={8} height={40} fill={DARK} />
        <g><path d="M18 42 l8 -14 l8 28 l8 -28 l8 28 l8 -28 l8 28 l8 -28 l8 28 l8 -14" fill="none" stroke={DARK} strokeWidth={3} strokeLinejoin="round" /><Move off={off} type="scale" values="1 1;0.55 1;1 1;1.35 1;1 1" keyTimes="0;0.25;0.5;0.75;1" dur="3.6s" /></g>
      </>;
      case 'chemical': return <>
        <rect x={42} y={26} width={64} height={30} rx={4} fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} /><rect x={106} y={34} width={9} height={14} fill={DARK} /><rect x={42} y={26} width={22} height={30} rx={4} fill="#16a34a" />
        <T x={53} y={46} size={14} color="#fff">+</T><T x={90} y={46} size={12} color={DARK}>cell</T>
        <path d="M14 72 q8 -12 0 -22 q16 6 12 22 z" fill={ORANGE} stroke="#b45309" strokeWidth={1.5}>{off ? null : <animate attributeName="opacity" values="1;0.4;1" dur="1.2s" repeatCount="indefinite" />}</path>
        <T x={22} y={86} size={10} color="#475569">fuel</T>
      </>;
      case 'light': return <>
        <circle cx={80} cy={44} r={14} fill={YELLOW} stroke="#ca8a04" strokeWidth={2.5} />
        <g stroke="#ca8a04" strokeWidth={3} strokeLinecap="round">{Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return <path key={i} d={`M${80 + Math.cos(a) * 22} ${44 + Math.sin(a) * 22} L${80 + Math.cos(a) * 32} ${44 + Math.sin(a) * 32}`} />; })}
          {off ? null : <animate attributeName="opacity" values="1;0.3;1" dur="1.6s" repeatCount="indefinite" />}</g>
      </>;
      case 'thermal': return <>
        <path d="M80 72 C56 66 52 46 70 34 C68 46 78 48 80 40 C90 48 98 52 94 62 C92 68 86 72 80 72 Z" fill={ORANGE} stroke="#b45309" strokeWidth={2}>
          {off ? null : <animateTransform attributeName="transform" type="scale" values="1 1;1 1.08;1 0.95;1 1" dur="1s" repeatCount="indefinite" additive="sum" />}</path>
        <path d="M70 72 C70 62 76 60 80 52 C84 60 90 62 90 72 Z" fill={YELLOW} />
        <path d="M60 80 H100" stroke={DARK} strokeWidth={4} strokeLinecap="round" />
      </>;
      case 'electrical': return <>
        <path d="M14 70 H40 M120 70 H146" stroke={DARK} strokeWidth={3} /><rect x={40} y={56} width={80} height={28} rx={4} fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} />
        <path d="M84 30 L66 54 H80 L74 76 L96 48 H82 Z" fill={YELLOW} stroke="#ca8a04" strokeWidth={2}>{off ? null : <animate attributeName="opacity" values="1;0.2;1;1;0.2;1" keyTimes="0;0.1;0.2;0.6;0.7;1" dur="1.8s" repeatCount="indefinite" />}</path>
        <T x={80} y={75} size={10} color={DARK}>circuit</T>
      </>;
      default: return <>
        <rect x={28} y={34} width={22} height={30} rx={3} fill={DARK} /><path d="M50 38 L72 24 V74 L50 60 Z" fill="#475569" />
        {[0, 1, 2].map(i => <path key={i} d={`M${84 + i * 14} ${38 - i * 4} q${8 + i * 2} ${12 + i * 4} 0 ${24 + i * 8}`} fill="none" stroke={BLUE} strokeWidth={3} strokeLinecap="round">{off ? null : <animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={`${i * 0.25}s`} repeatCount="indefinite" />}</path>)}
      </>;
    }
  })();
  return <svg viewBox="0 0 160 100" className="block h-auto w-full max-w-[11rem] sm:w-36" role="img" aria-label={`${kind} energy`}>{body}</svg>;
}

/* ---------- 1b. the ball: potential energy turns into kinetic energy ---------- */
export function BounceFigure() {
  const off = still();
  return <Fig label="A ball drops. As it falls, its gravitational potential energy bar goes down and its kinetic energy bar goes up. At the bottom all the energy is kinetic. When it rises again the bars swap back." h={220}
    note={<>As the ball falls, <strong>gravitational potential energy</strong> turns into <strong>kinetic energy</strong>.</>}>
    <path d="M20 190 H190" stroke="#7c6a4a" strokeWidth={5} strokeLinecap="round" />
    <g><circle cx={105} cy={30} r={16} fill={ORANGE} stroke="#b45309" strokeWidth={2.5} /><Move off={off} values="0 0;0 144;0 0;0 144;0 0" keyTimes="0;0.25;0.5;0.75;1" dur="3.6s" ease={false} /></g>
    <rect x={240} y={20} width={50} height={160} fill="#f1f5f9" stroke={GREY} strokeWidth={2} /><rect x={310} y={20} width={50} height={160} fill="#f1f5f9" stroke={GREY} strokeWidth={2} />
    <rect x={240} y={20} width={50} height={160} fill={RED}><Anim off={off} attr="height" values="160;0;160;0;160" keyTimes="0;0.25;0.5;0.75;1" dur="3.6s" /><Anim off={off} attr="y" values="20;180;20;180;20" keyTimes="0;0.25;0.5;0.75;1" dur="3.6s" /></rect>
    <rect x={310} y={20} width={50} height={160} fill={BLUE}><Anim off={off} attr="height" values="0;160;0;160;0" keyTimes="0;0.25;0.5;0.75;1" dur="3.6s" /><Anim off={off} attr="y" values="180;20;180;20;180" keyTimes="0;0.25;0.5;0.75;1" dur="3.6s" /></rect>
    <T x={265} y={202} size={12} color={RED}>potential</T><T x={335} y={202} size={12} color={BLUE}>kinetic</T>
    <T x={265} y={216} size={11} color="#475569">(stored)</T><T x={335} y={216} size={11} color="#475569">(motion)</T>
  </Fig>;
}

/* ---------- 3. work done ---------- */
export function WorkFigure() {
  const off = still();
  return <Fig label="A force of 20 newtons pushes a box 3 metres along the floor. Work done is force times distance, which is 60 joules." h={190}
    note={<>Work done = force × distance moved: <strong>20 × 3 = 60 J</strong>.</>}>
    <path d="M10 130 H390" stroke="#7c6a4a" strokeWidth={5} strokeLinecap="round" />
    <g><rect x={60} y={90} width={60} height={40} rx={3} fill="#9a6b3b" stroke="#5b3a17" strokeWidth={2.5} /><Right x1={14} x2={58} y={110} c={BLUE} /><T x={36} y={96} size={14} color={BLUE}>20 N</T>
      <Move off={off} values="0 0;180 0;180 0;0 0" keyTimes="0;0.55;0.9;1" dur="5s" /></g>
    <path d="M60 156 H300 M60 148 V164 M300 148 V164" stroke={RED} strokeWidth={2.5} fill="none" /><T x={180} y={180} size={14} color={RED}>distance = 3 m</T>
    <g><T x={330} y={80} size={16} color={GREEN}>W = 60 J</T>{off ? null : <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.6;0.9;1" dur="5s" repeatCount="indefinite" />}</g>
  </Fig>;
}

/* ---------- 3b. light travels in straight lines ---------- */
export function LightFigure() {
  const off = still();
  const slit = (x: number) => <g><rect x={x} y={20} width={10} height={64} fill="#475569" /><rect x={x} y={104} width={10} height={64} fill="#475569" /></g>;
  return <Fig label="A torch shines light through holes in three cards in a straight line, and the light reaches the screen. When the middle card is moved sideways the hole is not in line, so the light is blocked." h={215}
    note={<>The holes are in a straight line, so the light gets through. Move the middle card and the light is <strong>blocked</strong>.</>}>
    <rect x={14} y={86} width={42} height={30} rx={4} fill="#fbbf24" stroke="#a16207" strokeWidth={2.5} /><T x={35} y={138} size={12} color="#475569">torch</T>
    {slit(120)}
    <g>{slit(200)}<Move off={off} values="0 0;0 0;0 44;0 44;0 0" keyTimes="0;0.35;0.45;0.85;1" dur="6s" ease={false} /></g>
    {slit(280)}
    <rect x={360} y={50} width={12} height={110} fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} /><T x={366} y={182} size={12} color="#475569">screen</T>
    <path d="M56 101 H120" stroke={YELLOW} strokeWidth={6} />
    <path d="M130 101 H200" stroke={YELLOW} strokeWidth={6}>{off ? null : <animate attributeName="d" values="M130 101 H200;M130 101 H200;M130 101 H200;M130 101 H200;M130 101 H200" dur="6s" repeatCount="indefinite" />}</path>
    <path d="M210 101 H280 M290 101 H360" stroke={YELLOW} strokeWidth={6}>{off ? null : <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.35;0.42;0.88;0.95" dur="6s" repeatCount="indefinite" />}</path>
    <g>{off ? null : <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.85;0.95" dur="6s" repeatCount="indefinite" />}<T x={200} y={16} size={13} color={RED}>blocked!</T></g>
  </Fig>;
}

/* ---------- 4. sound needs particles ---------- */
export function SoundJarFigure() {
  const off = still();
  const dots = [[160, 70], [190, 100], [215, 70], [240, 105], [175, 135], [225, 135], [265, 80], [150, 105], [250, 140]];
  return <Fig label="An electric bell rings inside a sealed jar. As air is pumped out, the sound outside becomes quieter, but the bell is still seen vibrating. When air is let back in, the sound is loud again." h={225}
    note={<>No air, no sound: sound needs a <strong>material medium</strong>. Light still gets through, so you can still <strong>see</strong> the bell.</>}>
    <path d="M130 190 V60 Q130 28 205 28 Q280 28 280 60 V190 Z" fill="#e0f2fe" fillOpacity={0.5} stroke={DARK} strokeWidth={3} />
    <rect x={110} y={190} width={190} height={12} rx={3} fill={GREY} stroke={DARK} strokeWidth={2} />
    <g><path d="M190 90 Q205 60 220 90 Z" fill="#eab308" stroke="#a16207" strokeWidth={2} /><circle cx={205} cy={94} r={4} fill="#a16207" />{off ? null : <animateTransform attributeName="transform" type="rotate" values="-4 205 94;4 205 94;-4 205 94" dur="0.18s" repeatCount="indefinite" />}</g>
    <path d="M205 190 V190" stroke={DARK} strokeWidth={0} />
    <g fill={GREY}>{dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.5}>{off ? null : <animate attributeName="opacity" values="1;1;0.1;0.1;1" keyTimes="0;0.2;0.45;0.8;0.95" dur="8s" repeatCount="indefinite" />}</circle>)}</g>
    <g stroke={BLUE} strokeWidth={4} strokeLinecap="round" fill="none">
      {[0, 1, 2].map(i => <path key={i} d={`M${310 + i * 18} ${86 - i * 8} q${10} ${22 + i * 8} 0 ${44 + i * 16}`}>{off ? null : <animate attributeName="opacity" values="1;1;0.12;0.12;1" keyTimes="0;0.2;0.45;0.8;0.95" dur="8s" repeatCount="indefinite" />}</path>)}
    </g>
    <path d="M300 160 H340 V196" fill="none" stroke={DARK} strokeWidth={4} /><rect x={324} y={196} width={36} height={22} rx={4} fill="#e2e8f0" stroke={DARK} strokeWidth={2.5} /><T x={342} y={211} size={11} color={DARK}>pump</T>
    <g>{off ? null : <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.2;0.25;0.9;0.95" dur="8s" repeatCount="indefinite" />}<T x={205} y={16} size={14} color={GREEN}>air in: loud</T></g>
    <g>{off ? null : <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.25;0.5;0.8;0.85" dur="8s" repeatCount="indefinite" />}<T x={205} y={16} size={14} color={RED}>air pumped out: quiet</T></g>
  </Fig>;
}

/* ---------- 5. four-stroke engine ---------- */
export function EngineFigure({ kind }: { kind: 'petrol' | 'diesel' }) {
  const off = still();
  const piston = '0 0;0 66;0 0;0 66;0 0', kt = '0;0.25;0.5;0.75;1', dur = '10s';
  const phase = (values: string, k = '0;0.25;0.5;0.75') => <Anim off={off} attr="opacity" values={values} keyTimes={k} dur={dur} discrete />;
  const names = ['Intake: piston goes down, air' + (kind === 'petrol' ? ' and fuel come in' : ' only comes in'), 'Compression: piston goes up, both valves shut', kind === 'petrol' ? 'Power: the spark lights the mixture. It pushes the piston down' : 'Power: fuel is injected into hot air. It burns and pushes the piston down', 'Exhaust: piston goes up, burnt gases leave'];
  return <Fig label={`A four-stroke ${kind} engine: intake, compression, power and exhaust.`} h={285}
    note={kind === 'petrol' ? <>A <strong>spark plug</strong> lights the fuel and air mixture.</> : <>Compressed air gets so hot that the injected fuel <strong>lights by itself</strong>. No spark plug.</>}>
    {/* cylinder */}
    <rect x={140} y={74} width={120} height={160} fill="#f1f5f9" stroke={DARK} strokeWidth={4} rx={3} />
    <rect x={143} y={77} width={114} height={28} fill="#bfdbfe" opacity={0.9}>
      <Anim off={off} attr="height" values="28;94;28;94;28" keyTimes={kt} dur={dur} /><Anim off={off} attr="fill" values={kind === 'petrol' ? '#bfdbfe;#93c5fd;#fb923c;#cbd5e1' : '#e2e8f0;#cbd5e1;#fb923c;#cbd5e1'} keyTimes="0;0.25;0.5;0.75" dur={dur} discrete />
    </rect>
    <g><rect x={143} y={104} width={114} height={12} fill={DARK} /><rect x={196} y={116} width={8} height={90} fill="#64748b" /><Move off={off} values={piston} keyTimes={kt} dur={dur} /></g>
    <circle cx={200} cy={262} r={18} fill="#e2e8f0" stroke={DARK} strokeWidth={3} /><g><path d="M200 262 H200 V244" stroke={DARK} strokeWidth={4} />{off ? null : <animateTransform attributeName="transform" type="rotate" values="0 200 262;720 200 262" dur={dur} repeatCount="indefinite" />}</g>
    {/* valves: inlet on the left, exhaust on the right */}
    <path d="M170 74 V54 M230 74 V54" stroke={DARK} strokeWidth={5} />
    <g><rect x={160} y={70} width={20} height={6} rx={2} fill={GREEN} /><Move off={off} values="0 0;0 8;0 8;0 0;0 0" keyTimes="0;0.02;0.23;0.25;1" dur={dur} ease={false} /></g>
    <g><rect x={220} y={70} width={20} height={6} rx={2} fill={RED} /><Move off={off} values="0 0;0 0;0 0;0 8;0 8;0 0" keyTimes="0;0.74;0.76;0.78;0.98;1" dur={dur} ease={false} /></g>
    <T x={170} y={44} size={11} color={GREEN}>inlet valve</T><T x={236} y={44} size={11} color={RED}>exhaust valve</T>
    {kind === 'petrol'
      ? <g><path d="M200 74 V60" stroke={DARK} strokeWidth={5} /><path d="M194 82 l6 -16 l6 16 l-6 -4 z" fill={YELLOW} stroke="#ca8a04" strokeWidth={1.5}>{phase('0;0;1;0')}</path><T x={256} y={64} size={11} anchor="start" color={DARK}>spark plug</T></g>
      : <g><path d="M200 74 V56" stroke={DARK} strokeWidth={5} /><g fill={ORANGE}>{[-8, 0, 8].map(dx => <circle key={dx} cx={200 + dx} cy={86} r={2.6} />)}{phase('0;0;1;0')}</g><T x={256} y={64} size={11} anchor="start" color={DARK}>fuel injector</T></g>}
    {names.map((n, i) => <g key={i}>{off ? null : <animate attributeName="opacity" values={['1;0;0;0', '0;1;0;0', '0;0;1;0', '0;0;0;1'][i]} keyTimes="0;0.25;0.5;0.75" dur={dur} repeatCount="indefinite" calcMode="discrete" />}
      <text x={12} y={18} fontSize={13} fontWeight={800} fill={[BLUE, '#a16207', RED, '#475569'][i]}>{n}</text></g>)}
  </Fig>;
}

/* ---------- 6. heat transfer ---------- */
export function ConductionFigure() {
  const off = still();
  return <Fig label="A metal rod heated at one end. The heat travels along the rod from the hot end to the cold end. This is conduction." h={150}
    note={<>Heat passes along the rod from particle to particle. This is <strong>conduction</strong>.</>}>
    <path d="M18 98 q10 -26 0 -44 q24 14 18 44 z" fill={ORANGE} stroke="#b45309" strokeWidth={2}>{off ? null : <animate attributeName="opacity" values="1;0.5;1" dur="0.9s" repeatCount="indefinite" />}</path>
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={50 + i * 46} y={58} width={46} height={32} fill="#94a3b8" stroke={DARK} strokeWidth={2.5}>
      <Anim off={off} attr="fill" values="#94a3b8;#ef4444;#ef4444;#94a3b8" keyTimes="0;0.2;0.85;1" dur="8s" begin={`${i * 0.7}s`} /></rect>)}
    <T x={72} y={118} size={12} color={RED}>hot end</T><T x={340} y={118} size={12} color={BLUE}>cold end</T>
    <Right x1={140} x2={300} y={132} c={RED} w={4} />
  </Fig>;
}
export function ConvectionFigure() {
  const off = still();
  return <Fig label="Water heated at the bottom left of a beaker. The warm water rises on the left, moves across the top, cools and sinks on the right. This circulation is a convection current." h={235}
    note={<>Warm water is lighter, so it <strong>rises</strong>. Cool water is heavier, so it <strong>sinks</strong>. This circle is a <strong>convection current</strong>.</>}>
    <path d="M120 40 V190 Q120 210 140 210 H260 Q280 210 280 190 V40" fill="none" stroke={DARK} strokeWidth={4} /><rect x={123} y={70} width={154} height={138} fill={WATER} opacity={0.45} />
    <Flow off={off} d="M150 190 V90 Q150 76 164 76 H236" color={RED} w={5} /><Flow off={off} d="M236 76 Q250 76 250 90 V190 Q250 196 244 196 H164" color={BLUE} w={5} />
    <path d="M140 232 q6 -14 0 -22 q18 6 12 22 z" fill={ORANGE}>{off ? null : <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite" />}</path>
    <T x={150} y={60} size={12} color={RED}>warm rises</T><T x={252} y={60} size={12} color={BLUE}>cool sinks</T>
  </Fig>;
}
export function RadiationFigure() {
  const off = still();
  return <Fig label="Energy from the Sun travels through empty space to the Earth as thermal radiation. It needs no material to travel through." h={170}
    note={<>The Sun's energy crosses <strong>empty space</strong>. This is <strong>radiation</strong>. It needs no material.</>}>
    <circle cx={50} cy={80} r={34} fill={YELLOW} stroke="#ca8a04" strokeWidth={3} />
    <circle cx={350} cy={80} r={22} fill="#3b82f6" stroke="#1e3a8a" strokeWidth={3} /><path d="M338 70 q8 -6 14 4 q-2 10 -12 8 z M352 90 q8 -2 12 6 q-6 6 -12 -2 z" fill="#16a34a" />
    {[60, 80, 100].map((y, i) => <Flow key={i} off={off} d={`M100 ${y} Q180 ${y - 14} 250 ${y} T320 ${70 + i * 10}`} color={ORANGE} w={3} dash="9 8" />)}
    {[[160, 30], [220, 130], [130, 140], [260, 24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill={GREY} />)}
    <T x={200} y={160} size={13} color="#475569">empty space (nothing to carry the heat)</T>
  </Fig>;
}

/* ---------- 7. solar devices ---------- */
export function SolarCookerFigure() {
  const off = still();
  return <Fig label="A solar cooker. A shiny curved reflector sends the Sun's rays onto a black pot inside a covered, insulated box." h={235}
    note={<>The <strong>shiny</strong> reflector sends sunlight to the <strong>black</strong> pot. The pot absorbs it and heats the food.</>}>
    <circle cx={340} cy={36} r={22} fill={YELLOW} stroke="#ca8a04" strokeWidth={3} />
    {[[300, 60, 170, 170], [320, 66, 200, 176], [340, 72, 240, 180]].map(([x1, y1, x2, y2], i) => <Flow key={i} off={off} d={`M${x1} ${y1} L${x2} ${y2}`} color={YELLOW} w={3} dash="8 7" />)}
    <path d="M70 90 Q100 190 190 200 Q280 190 310 120" fill="none" stroke="#cbd5e1" strokeWidth={9} strokeLinecap="round" /><path d="M70 90 Q100 190 190 200 Q280 190 310 120" fill="none" stroke="#f8fafc" strokeWidth={3} strokeLinecap="round" />
    {[[120, 150], [170, 178], [240, 176]].map(([x, y], i) => <Flow key={i} off={off} d={`M${x} ${y} L190 140`} color={YELLOW} w={3} dash="8 7" />)}
    <rect x={160} y={118} width={60} height={34} rx={6} fill="#111827" stroke="#000" strokeWidth={2} /><T x={190} y={140} size={11} color="#fff">pot</T>
    <path d="M150 112 H230" stroke="#bae6fd" strokeWidth={5} /><T x={190} y={102} size={11} color="#0369a1">clear cover</T>
    <T x={70} y={80} size={12} color="#475569">shiny reflector</T>
  </Fig>;
}
export function SolarHeaterFigure() {
  const off = still();
  return <Fig label="A solar water heater. A dark collector absorbs sunlight and warms the water. The warm water rises into the tank above, and cooler water goes down to the collector, so the water circulates without a pump." h={250}
    note={<>Warm water is lighter, so it <strong>rises</strong> into the tank. Cooler water goes <strong>down</strong> to the collector.</>}>
    <circle cx={50} cy={40} r={22} fill={YELLOW} stroke="#ca8a04" strokeWidth={3} />
    <Flow off={off} d="M72 52 L130 140" color={YELLOW} w={3} dash="8 7" /><Flow off={off} d="M90 40 L180 150" color={YELLOW} w={3} dash="8 7" />
    <rect x={190} y={20} width={150} height={56} rx={26} fill="#e0f2fe" stroke={DARK} strokeWidth={3} /><rect x={196} y={34} width={138} height={28} rx={14} fill={WATER} opacity={0.7} /><T x={265} y={52} size={13}>tank</T>
    <path d="M110 150 L250 214 H300 L180 150 Z" fill="#111827" stroke="#000" strokeWidth={2} /><T x={215} y={196} size={12} color="#fff">collector</T>
    <path d="M300 214 V80 M200 150 V80" fill="none" stroke={DARK} strokeWidth={9} strokeLinecap="round" /><path d="M300 214 V80 M200 150 V80" fill="none" stroke="#e0f2fe" strokeWidth={4} strokeLinecap="round" />
    <Flow off={off} d="M300 210 V86" color={RED} w={3} dash="6 6" /><Flow off={off} d="M200 86 V146" color={BLUE} w={3} dash="6 6" />
    <T x={322} y={150} size={12} color={RED} anchor="start">warm</T><T x={140} y={118} size={12} color={BLUE} anchor="end">cool</T>
  </Fig>;
}
