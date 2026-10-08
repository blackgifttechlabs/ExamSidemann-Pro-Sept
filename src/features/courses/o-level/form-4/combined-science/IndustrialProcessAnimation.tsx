import React, { useEffect, useId, useRef, useState } from 'react';

export type IndustrialProcess = 'peanuts' | 'soap' | 'air' | 'lead' | 'water' | 'plating' | 'haber' | 'contact';
type Stage = { title: string; detail: string; equation?: string };
export const processStages: Record<IndustrialProcess, Stage[]> = {
  peanuts: [
    { title: 'Shell and separate', detail: 'The sheller opens the pods. A winnowing basket helps separate light shell fragments from the kernels.' },
    { title: 'Roast', detail: 'Roast the kernels, then allow them to cool. Roasting develops flavour; the kernels remain the raw material for grinding.' },
    { title: 'Grind', detail: 'The grinding stone, mortar and pestle, or machine breaks the kernels into a paste. Oil already in the kernels is released into the peanut butter.' },
    { title: 'Package peanut butter', detail: 'Collect the paste in clean containers and seal. This is the end of the peanut butter production route.' },
    { title: 'Press paste for oil', detail: 'For the oil route, place some paste in a suitable press. Pressure squeezes oil through the filter while the solid press cake remains behind.' },
    { title: 'Collect the oil', detail: 'Oil drains into the receiver below the press. It can be used in cooking and as a raw material for soap manufacture.' },
  ],
  soap: [
    { title: 'Combine fat and alkali', detail: 'Plant oil or animal fat is mixed with sodium hydroxide solution in a teacher-controlled demonstration.' },
    { title: 'Heat and stir: saponification', detail: 'Heating and stirring help the fat react with sodium hydroxide. Soap and glycerol form.', equation: 'Fat/oil + sodium hydroxide → soap + glycerol' },
    { title: 'Add sodium chloride solution', detail: 'Salt reduces the solubility of the soap: soap separates from the aqueous mixture. Sodium chloride is used for separation, not as the reacting alkali.' },
    { title: 'Separate and form bars', detail: 'Separate the soap, place it in moulds and allow it to dry. The remaining liquid contains glycerol, water and dissolved salts.' },
  ],
  air: [
    { title: 'Clean the air', detail: 'Remove dust, water vapour and carbon dioxide before deep cooling, so solids do not block the equipment.' },
    { title: 'Compress and cool', detail: 'Repeated compression, cooling and expansion lower the temperature until liquid air can be obtained.' },
    { title: 'Feed the fractionating column', detail: 'Liquid air enters the column. Repeated evaporation and condensation separate the gases by their different boiling points.' },
    { title: 'Collect nitrogen and oxygen', detail: 'Nitrogen, boiling at about −196 °C at 1 atm, is more volatile and leaves the colder top. Oxygen, boiling at about −183 °C, is obtained lower down. This is a physical separation.' },
  ],
  lead: [
    { title: 'Solid: ions cannot move', detail: 'In solid lead(II) bromide, ions are fixed in a lattice. The electrolyte cannot carry current even when the DC source is connected.' },
    { title: 'Melt the electrolyte', detail: 'Heating melts PbBr₂ and frees the ions to move. Both carbon electrodes dip into the molten electrolyte without touching each other.' },
    { title: 'Ions move to electrodes', detail: 'Positive Pb²⁺ ions move towards the negative cathode. Negative Br⁻ ions move towards the positive anode. Ions carry charge through the melt; electrons move in the external wires.' },
    { title: 'Discharge and observe', detail: 'At the cathode, Pb²⁺ gains electrons and forms lead. At the anode, bromide loses electrons and forms reddish-brown bromine fumes.', equation: 'Pb²⁺ + 2e⁻ → Pb     |     2Br⁻ → Br₂ + 2e⁻' },
    { title: 'Cool the lead product', detail: 'The lead is molten at the operating temperature. After heating and current stop, it cools into a solid grey bead. Lead bromide and bromine require a teacher demonstration in a fume cupboard.' },
  ],
  water: [
    { title: 'Prepare the cell', detail: 'Dilute sulphuric acid provides ions so the water conducts. Immerse inert electrodes and fill separate inverted collection tubes with the solution.' },
    { title: 'Switch on the DC source', detail: 'Connect the cathode to the negative terminal and the anode to the positive terminal. The gases are collected separately.' },
    { title: 'Hydrogen and oxygen form', detail: 'Hydrogen bubbles at the cathode; oxygen bubbles at the anode. For every two volumes of hydrogen, one volume of oxygen forms at the same temperature and pressure.', equation: '2H₂O(l) → 2H₂(g) + O₂(g)' },
    { title: 'Compare the gas volumes', detail: 'Equal-width collection tubes show twice as much hydrogen as oxygen. Hydrogen feeds the Haber process; oxygen is used in steelmaking and for medical purposes.' },
  ],
  plating: [
    { title: 'Set up copper electroplating', detail: 'Clean the iron nail and connect it to the negative terminal: it is the cathode. Connect a copper electrode to the positive terminal: it is the anode. Both dip into CuSO₄ solution.' },
    { title: 'Copper dissolves at the anode', detail: 'Copper atoms at the positive electrode lose electrons and enter the electrolyte as Cu²⁺ ions. The anode loses mass while copper simultaneously deposits at the nail.', equation: 'Cu(s) → Cu²⁺(aq) + 2e⁻' },
    { title: 'Copper deposits on the nail', detail: 'Cu²⁺ ions gain electrons at the negative nail. The nail gains mass while the copper anode continues dissolving; the two electrode processes happen together.', equation: 'Cu²⁺(aq) + 2e⁻ → Cu(s)' },
    { title: 'Inspect the copper coating', detail: 'Switch off and remove the plated nail. The reddish copper coating improves appearance and can provide a barrier while intact; scratches can expose the iron.' },
  ],
  haber: [
    { title: 'Supply nitrogen and hydrogen', detail: 'In the document’s route, nitrogen comes from fractional distillation of air and hydrogen from electrolysis of water. Mix them in a 1:3 ratio.' },
    { title: 'Compress the feed', detail: 'The compressor raises the pressure to about 200 atm before the gases enter the converter.' },
    { title: 'React over iron catalyst', detail: 'At 450–500 °C over iron, nitrogen and hydrogen react reversibly to form ammonia. Only part of the feed reacts on each pass.', equation: 'N₂(g) + 3H₂(g) ⇌ 2NH₃(g)' },
    { title: 'Cool and separate', detail: 'Cooling under pressure condenses ammonia so it can be withdrawn as liquid. Unreacted nitrogen and hydrogen remain in the gas stream.' },
    { title: 'Recycle unreacted gases', detail: 'Return the unreacted gases to the converter feed. Liquid ammonia is removed as product; it is not recycled with the gases.' },
  ],
  contact: [
    { title: 'Make sulphur dioxide', detail: 'Burn sulphur or roast iron pyrites in air to obtain SO₂. Clean the gas before it reaches the catalyst.', equation: 'S + O₂ → SO₂' },
    { title: 'Convert SO₂ to SO₃', detail: 'Sulphur dioxide reacts with oxygen from air over vanadium(V) oxide at 450–500 °C and about 1 atm.', equation: '2SO₂(g) + O₂(g) ⇌ 2SO₃(g)' },
    { title: 'Absorb in concentrated acid', detail: 'SO₃ dissolves in concentrated sulphuric acid to form oleum. Direct addition of SO₃ to water produces an acid mist and is avoided.', equation: 'SO₃ + H₂SO₄ → H₂S₂O₇' },
    { title: 'Dilute oleum carefully', detail: 'Controlled addition of water converts oleum to sulphuric acid. The sulphur atom passes through SO₂, SO₃ and oleum into the final acid.', equation: 'H₂S₂O₇ + H₂O → 2H₂SO₄' },
  ],
};
const colours = { ink: '#0f172a', blue: '#0284c7', orange: '#ea580c', green: '#059669', violet: '#7c3aed' };
const Txt = ({ x, y, children, size = 16, fill = colours.ink, anchor = 'middle' }: { x: number; y: number; children: React.ReactNode; size?: number; fill?: string; anchor?: 'middle' | 'start' | 'end' }) => <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={fill}>{children}</text>;
const Box = ({ x, y, w = 160, title, sub, active }: { x: number; y: number; w?: number; title: string; sub?: string; active?: boolean }) => <g><rect x={x} y={y} width={w} height={72} rx={12} fill={active ? '#e0f2fe' : '#fff'} stroke={active ? colours.blue : '#cbd5e1'} strokeWidth={active ? 3 : 1.5} /><Txt x={x + w / 2} y={y + 29} size={17}>{title}</Txt>{sub && <Txt x={x + w / 2} y={y + 52} size={13}>{sub}</Txt>}</g>;
const Tube = ({ x, y, w, h, fill = '#e0f2fe' }: { x: number; y: number; w: number; h: number; fill?: string }) => <g><rect x={x + 3} y={y + h * .36} width={w - 6} height={h * .64 - 3} rx={8} fill={fill} /><path d={`M${x} ${y} V${y + h - 12} Q${x} ${y + h} ${x + 12} ${y + h} H${x + w - 12} Q${x + w} ${y + h} ${x + w} ${y + h - 12} V${y}`} fill="none" stroke="#64748b" strokeWidth={3} /></g>;
const Particle = ({ x, y, label, colour = colours.blue, r = 18 }: { x: number; y: number; label?: string; colour?: string; r?: number }) => <g><circle cx={x} cy={y} r={r} fill={colour} />{label && <Txt x={x} y={y + 4} size={12} fill="white">{label}</Txt>}</g>;
const interpolate = (a: number, b: number, t: number) => a + (b - a) * t;
function MovingDots({ points, progress, colour = colours.blue, count = 4, label }: { points: [number, number][]; progress: number; colour?: string; count?: number; label?: string }) {
  const lengths = points.slice(1).map((v, i) => Math.hypot(v[0] - points[i][0], v[1] - points[i][1]));
  const total = lengths.reduce((a, b) => a + b, 0);
  return <g>{Array.from({ length: count }, (_, i) => {
    let d = ((progress + i / count) % 1) * total;
    let seg = 0;
    while (seg < lengths.length - 1 && d > lengths[seg]) { d -= lengths[seg]; seg++; }
    const f = lengths[seg] ? d / lengths[seg] : 0;
    return <Particle key={i} x={interpolate(points[seg][0], points[seg + 1][0], f)} y={interpolate(points[seg][1], points[seg + 1][1], f)} colour={colour} r={label ? 15 : 5} label={label} />;
  })}</g>;
}
function Flow({ d, active, p, colour = colours.blue, marker }: { d: string; active?: boolean; p: number; colour?: string; marker: string }) {
  return <g><path d={d} fill="none" stroke="#cbd5e1" strokeWidth={6} />{active && <path d={d} fill="none" stroke={colour} strokeWidth={4} strokeDasharray="9 7" strokeDashoffset={-p * 120} />}<path d={d} fill="none" stroke={active ? colour : '#94a3b8'} strokeWidth={1.5} markerEnd={`url(#${marker})`} /></g>;
}
function PeanutScene({ s, p }: { s: number; p: number }) {
  const kernel = (x: number, y: number, i: number) => <ellipse key={i} cx={x} cy={y} rx={8} ry={12} fill="#c78b51" stroke="#854d0e" />;
  return <>
    <Box x={30} y={45} title="Sheller" sub="Separate shells" active={s === 0} />
    <Box x={240} y={45} title="Roaster" sub="Roast, then cool" active={s === 1} />
    <Box x={450} y={45} title="Grinder" sub="Kernels → paste" active={s === 2} />
    <Box x={660} y={45} title="Clean jars" sub="Package peanut butter" active={s === 3} />
    {[200, 410, 620].map(x => <Txt key={x} x={x + 15} y={90} size={26}>→</Txt>)}
    <g transform={`translate(100 185)`}><ellipse cx={-12 - (s === 0 ? p * 28 : 28)} cy={0} rx={19} ry={40} fill="#caa472" /><ellipse cx={12 + (s === 0 ? p * 28 : 28)} cy={0} rx={19} ry={40} fill="#caa472" />{kernel(0, -12, 0)}{kernel(0, 13, 1)}</g>
    <Txt x={100} y={265}>Pods open</Txt>
    <g transform={`rotate(${s === 1 ? p * 720 : 0} 320 185)`}><circle cx={320} cy={185} r={43} fill="#fed7aa" stroke="#9a3412" strokeWidth={4} />{Array.from({ length: 6 }, (_, i) => kernel(320 + Math.cos(i) * 25, 185 + Math.sin(i) * 25, i))}</g>
    <Txt x={320} y={265}>Heated drum</Txt>
    <g transform={`rotate(${s === 2 ? p * 1080 : 0} 530 178)`}><circle cx={530} cy={178} r={37} fill="#e2e8f0" stroke="#64748b" strokeWidth={4} /><path d="M503 152 L556 204 M503 204 L556 152" stroke="#64748b" strokeWidth={7} /></g>
    <path d="M530 215 V240 H570" stroke={s >= 2 ? '#a16207' : '#cbd5e1'} strokeWidth={s === 2 ? 5 + p * 9 : 10} fill="none" />
    <Txt x={530} y={280}>Paste releases oil</Txt>
    <rect x={710} y={150} width={54} height={85} rx={8} fill="#fff7ed" stroke="#92400e" strokeWidth={2} /><rect x={710} y={235 - (s >= 3 ? 65 : 0)} width={54} height={s >= 3 ? 65 : 0} rx={7} fill="#a16207" /><rect x={705} y={141} width={64} height={13} rx={4} fill="#64748b" />
    {s >= 4 && <g><rect x={130} y={295} width={330} height={55} rx={8} fill="#ffedd5" stroke="#c2410c" /><rect x={150} y={278 + (s === 4 ? p * 18 : 18)} width={290} height={18} fill="#64748b" /><Txt x={295} y={333} size={15}>Press cake retained in filter</Txt><path d="M460 329 H575 V347" fill="none" stroke="#a16207" strokeWidth={5} /><rect x={550} y={352} width={110} height={22} rx={5} fill="#fde68a" stroke="#a16207" /><Txt x={710} y={365}>Oil collected below</Txt>{(s === 4 || s === 5) && <MovingDots points={[[460, 329], [575, 329], [575, 352]]} progress={p} colour="#d97706" count={3} />}</g>}
  </>;
}
function SoapScene({ s, p }: { s: number; p: number }) {
  const soapHeight = s >= 2 ? (s === 2 ? p : 1) * 40 : 0;
  return <>
    <Box x={35} y={45} title="Plant / animal fat" sub="Oil or fat" active={s === 0} /><Box x={245} y={45} title="NaOH solution" sub="Reacting alkali" active={s <= 1} />
    <Txt x={225} y={88} size={30}>+</Txt><Txt x={445} y={88} size={30}>→</Txt>
    <Tube x={495} y={85} w={200} h={190} fill="#fde68a" />
    <Txt x={595} y={55} size={18}>Reaction vessel</Txt>
    {s <= 1 && <g transform={`rotate(${s === 1 ? Math.sin(p * Math.PI * 6) * 18 : 0} 592 183)`}><path d="M575 95 L620 235" stroke="#64748b" strokeWidth={9} /></g>}
    {s === 0 && <MovingDots points={[[160, 128], [300, 145], [530, 175]]} progress={p} colour="#eab308" count={5} />}
    {s >= 1 && <><path d="M518 304 Q530 278 543 304 Q556 278 569 304 Q582 278 595 304 Q608 278 621 304 Q634 278 647 304" stroke={s === 1 ? '#f97316' : '#cbd5e1'} strokeWidth={5} fill="none" /><Txt x={595} y={334}>Heat + stir</Txt></>}
    {s >= 2 && <><rect x={500} y={155} width={190} height={soapHeight} rx={6} fill="#fff" stroke="#94a3b8" /><Txt x={595} y={179} size={15}>Separated soap</Txt><Txt x={595} y={246} size={13}>Glycerol + salty water</Txt><Box x={735} y={65} w={140} title="NaCl solution" sub="Salt out soap" active={s === 2} />{s === 2 && <MovingDots points={[[790, 143], [675, 150], [645, 188]]} progress={p} colour={colours.blue} />}</>}
    <Txt x={235} y={210} size={20}>{s === 0 ? 'Fat + alkali' : 'Soap + glycerol form'}</Txt><Txt x={235} y={240} size={15}>Saponification is a chemical reaction</Txt>
    {s === 3 && <><rect x={735} y={210} width={110} height={52} rx={14} fill="#dcfce7" stroke="#059669" /><Txt x={790} y={241}>Soap bar</Txt><Txt x={790} y={291} size={14}>Mould and dry</Txt></>}
  </>;
}
function AirScene({ s, p, marker }: { s: number; p: number; marker: string }) {
  return <>
    <Box x={25} y={115} w={135} title="Clean air" sub="Remove H₂O / CO₂" active={s === 0} />
    <Box x={215} y={115} w={170} title="Compress + cool" sub="Repeated cooling" active={s === 1} />
    <Box x={435} y={115} w={125} title="Liquid air" sub="Deeply cooled" active={s === 2} />
    <Flow d="M160 150 H212" p={p} active={s >= 1} marker={marker} /><Flow d="M385 150 H432" p={p} active={s >= 2} marker={marker} /><Flow d="M560 150 H620 V230 H649" p={p} active={s >= 2} marker={marker} />
    {s === 1 && <MovingDots points={[[230, 235], [355 - p * 45, 235]]} progress={p} count={8} />}
    <rect x={650} y={55} width={90} height={245} rx={13} fill="#dbeafe" stroke="#0369a1" strokeWidth={2} />
    {[90, 130, 170, 210, 250].map(y => <path key={y} d={`M657 ${y} H733`} stroke="#64748b" strokeWidth={3} />)}
    <Txt x={695} y={325}>Column trays</Txt>
    <Flow d="M740 85 H845" p={p} active={s >= 3} marker={marker} /><Flow d="M740 265 H845" p={p} active={s >= 3} colour={colours.orange} marker={marker} />
    <Txt x={810} y={53} size={17}>N₂: −196 °C</Txt><Txt x={810} y={113} size={13}>Colder top</Txt>
    <Txt x={815} y={241} size={17}>O₂: −183 °C</Txt><Txt x={815} y={295} size={13}>Warmer lower part</Txt>
    {s >= 2 && <><MovingDots points={s >= 3 ? [[678, 266], [678, 84], [826, 84]] : [[678, 266], [678, 84]]} progress={p} count={5} colour={colours.blue} /><MovingDots points={s >= 3 ? [[712, 105], [712, 265], [825, 265]] : [[712, 105], [712, 265]]} progress={p} count={4} colour={colours.orange} /></>}
    <Txt x={295} y={312}>Separation by boiling point</Txt><Txt x={295} y={340} size={14}>No new substance is formed</Txt>
  </>;
}
function CellWires({ p, on, water = false }: { p: number; on: boolean; water?: boolean }) {
  return <>
    <rect x={400} y={30} width={160} height={50} rx={12} fill={on ? '#dcfce7' : '#e2e8f0'} stroke="#64748b" /><Txt x={480} y={59}>DC source</Txt>
    <Txt x={420} y={99} size={22}>−</Txt><Txt x={540} y={99} size={22}>+</Txt>
    <path d={water ? "M400 54 H175 V316 H234 M560 54 H785 V316 H726" : "M400 54 H240 V142 M560 54 H720 V142"} fill="none" stroke="#64748b" strokeWidth={4} />
    {on && <><MovingDots points={water ? [[400, 54], [175, 54], [175, 316], [234, 316]] : [[400, 54], [240, 54], [240, 142]]} progress={p} label="e⁻" count={3} /><MovingDots points={water ? [[726, 316], [785, 316], [785, 54], [560, 54]] : [[720, 142], [720, 54], [560, 54]]} progress={p} label="e⁻" count={3} /></>}
    <Txt x={240} y={125}>Cathode (−)</Txt><Txt x={720} y={125}>Anode (+)</Txt>
    <Txt x={480} y={120} size={13}>Electrons in wires • ions in electrolyte</Txt>
  </>;
}
function LeadScene({ s, p, marker }: { s: number; p: number; marker: string }) {
  const molten = s > 0 && s < 4; const on = s === 2 || s === 3;
  return <>
    <CellWires p={p} on={on} />
    <Tube x={150} y={165} w={660} h={165} fill={molten ? '#fef3c7' : '#e2e8f0'} />
    <rect x={224} y={143} width={32} height={137} rx={5} fill="#334155" /><rect x={704} y={143} width={32} height={137} rx={5} fill="#334155" />
    {s === 0 && Array.from({ length: 18 }, (_, i) => <Particle key={i} x={330 + i % 6 * 55} y={238 + Math.floor(i / 6) * 28} label={i % 3 ? 'Br⁻' : 'Pb²⁺'} colour={i % 3 ? colours.orange : colours.blue} />)}
    {(s === 1 || s === 2 || s === 3) && <><MovingDots points={[[520, 245], [275, 245]]} progress={on ? p : .2} count={3} label="Pb²⁺" /><MovingDots points={[[410, 287], [680, 287]]} progress={on ? p : .2} count={6} colour={colours.orange} label="Br⁻" /></>}
    {s >= 3 && <><ellipse cx={240} cy={313} rx={s === 3 ? 14 + p * 32 : 46} ry={12} fill={s === 4 ? '#94a3b8' : '#64748b'} /><Txt x={245} y={357} size={15}>{s === 4 ? 'Solid lead after cooling' : 'Molten lead collects'}</Txt></>}
    {s === 3 && <>{Array.from({ length: 6 }, (_, i) => <Particle key={i} x={745 + Math.sin(i) * 16} y={220 - ((p + i / 6) % 1) * 70} r={9} colour="#9a3412" />)}<Txt x={790} y={157} size={14} fill="#9a3412">Br₂ fumes ↑</Txt></>}
    <Txt x={480} y={315} size={15}>{s === 0 ? 'Solid PbBr₂: fixed ions' : s === 4 ? 'Current and heat off' : 'Molten PbBr₂: mobile ions'}</Txt>
    {molten && <><path d="M435 350 Q450 322 465 350 Q480 322 495 350 Q510 322 525 350" stroke="#ea580c" strokeWidth={5} fill="none" /><Txt x={480} y={374} size={13}>Heat maintained</Txt></>}
  </>;
}
function WaterScene({ s, p, marker }: { s: number; p: number; marker: string }) {
  const reaction = s >= 2; const fraction = s === 2 ? p : s > 2 ? 1 : 0;
  const h2 = 120 * fraction; const o2 = 60 * fraction;
  return <>
    <CellWires p={p} on={s >= 1 && s < 3} water />
    <Tube x={145} y={192} w={670} h={137} />
    {[{ x: 206, gas: h2, name: 'H₂', colour: colours.blue }, { x: 686, gas: o2, name: 'O₂', colour: colours.orange }].map(t => <g key={t.name}>
      <path d={`M${t.x} 304 V157 Q${t.x} 144 ${t.x + 13} 144 H${t.x + 55} Q${t.x + 68} 144 ${t.x + 68} 157 V304`} fill="#e0f2fe" stroke="#64748b" strokeWidth={2} />
      <rect data-gas={t.name} x={t.x + 3} y={148} width={62} height={t.gas} rx={10} fill={t.colour === colours.blue ? '#bae6fd' : '#fed7aa'} />
      <path d={`M${t.x + 3} ${148 + t.gas} H${t.x + 65}`} stroke={t.colour} strokeWidth={2} />
      <rect x={t.x + 28} y={285} width={12} height={35} fill="#334155" />
      <Txt x={t.x + 34} y={170} fill={t.colour} size={15}>{t.name}</Txt>
    </g>)}
    {reaction && s === 2 && <>{Array.from({ length: 8 }, (_, i) => <circle key={'h' + i} cx={235 + i % 2 * 12} cy={290 - ((p + i / 8) % 1) * (120 - h2 + 30)} r={4} fill="none" stroke={colours.blue} />)}{Array.from({ length: 4 }, (_, i) => <circle key={'o' + i} cx={720} cy={290 - ((p + i / 4) % 1) * (120 - o2 + 30)} r={4} fill="none" stroke={colours.orange} />)}</>}
    <Txt x={480} y={238} size={18}>Water + dilute H₂SO₄</Txt><Txt x={480} y={270} size={14}>Acid supplies conducting ions</Txt>
    <Txt x={250} y={355} size={16}>Hydrogen: 2 volumes</Txt><Txt x={715} y={355} size={16}>Oxygen: 1 volume</Txt>
    <Txt x={480} y={378} size={15}>At the same temperature and pressure: H₂ : O₂ = 2 : 1</Txt>
  </>;
}
function PlatingScene({ s, p, marker }: { s: number; p: number; marker: string }) {
  const growth = s === 1 ? .5 * p : s === 2 ? .5 + .5 * p : s > 2 ? 1 : 0;
  return <>
    <CellWires p={p} on={s === 1 || s === 2} />
    <Tube x={145} y={165} w={670} h={165} fill="#bae6fd" />
    <path d="M219 146 H260 V160 H248 V285 L240 308 L232 285 V160 H219 Z" fill="#94a3b8" stroke="#64748b" strokeWidth={2} />
    {growth > 0 && <path d="M232 225 V285 L240 308 L248 285 V225" stroke="#c26735" strokeWidth={2 + growth * 9} fill="none" />}
    <rect x={705 + growth * 7} y={143} width={30 - growth * 14} height={152} fill="#c26735" stroke="#9a3412" />
    {(s === 1 || s === 2) && <MovingDots points={[[690, 250], [270, 250]]} progress={p} label="Cu²⁺" count={5} colour={colours.orange} />}
    <Txt x={480} y={313}>CuSO₄ solution</Txt><Txt x={240} y={358} size={15}>Iron nail: gains copper</Txt><Txt x={720} y={358} size={15}>Copper anode: loses copper</Txt>
    {s === 3 && <Txt x={480} y={190} size={17}>Current off • reddish copper coating</Txt>}
  </>;
}
function AmmoniaMolecules({ progress }: { progress: number }) {
  const t = Math.max(0, Math.min(1, (progress - .15) / .65));
  const nStarts: [number, number][] = [[100, 220], [127, 220]];
  const nEnds: [number, number][] = [[95, 247], [255, 247]];
  const hStarts: [number, number][] = [[45, 278], [64, 278], [158, 278], [177, 278], [282, 278], [301, 278]];
  const hEnds: [number, number][] = [[72, 260], [95, 221], [118, 260], [232, 260], [255, 221], [278, 260]];
  const np = nStarts.map((v,i) => [interpolate(v[0],nEnds[i][0],t),interpolate(v[1],nEnds[i][1],t)]);
  const hp = hStarts.map((v,i) => [interpolate(v[0],hEnds[i][0],t),interpolate(v[1],hEnds[i][1],t)]);
  return <g><rect x={20} y={187} width={330} height={156} rx={12} fill="#fff" stroke="#cbd5e1" />
    {t < .5 && <><path d={`M${np[0][0]} ${np[0][1]} L${np[1][0]} ${np[1][1]}`} stroke="#64748b" strokeWidth={3} />{[0,2,4].map(i=><path key={i} d={`M${hp[i][0]} ${hp[i][1]} L${hp[i+1][0]} ${hp[i+1][1]}`} stroke="#64748b" strokeWidth={2} />)}</>}
    {t >= .5 && hp.map((v,i)=><path key={i} d={`M${np[Math.floor(i/3)][0]} ${np[Math.floor(i/3)][1]} L${v[0]} ${v[1]}`} stroke="#64748b" strokeWidth={2} />)}
    {np.map((v,i)=><Particle key={'n'+i} x={v[0]} y={v[1]} label="N" colour={colours.blue} r={14} />)}
    {hp.map((v,i)=><Particle key={'h'+i} x={v[0]} y={v[1]} label="H" colour={colours.green} r={11} />)}
    <Txt x={185} y={324} size={12}>{t === 0 ? 'One reacting set: N₂ + 3H₂' : t < 1 ? 'Atoms rearrange; their numbers stay the same' : 'Two NH₃ molecules: atoms conserved'}</Txt>
  </g>;
}
function SulphurMolecules({ progress }: { progress: number }) {
  const t = Math.max(0, Math.min(1, (progress - .15) / .65));
  const starts: [number,number][] = [[73,255],[127,255],[223,255],[277,255],[145,300],[175,300]];
  const ends: [number,number][] = [[73,255],[127,255],[223,255],[277,255],[100,215],[250,215]];
  const atoms = starts.map((v,i)=>[interpolate(v[0],ends[i][0],t),interpolate(v[1],ends[i][1],t)]);
  return <g><rect x={20} y={187} width={330} height={156} rx={12} fill="#fff" stroke="#cbd5e1" />
    {atoms.map((v,i)=> (i < 4 || t > .5) && <path key={i} d={`M${i < 2 || i === 4 ? 100 : 250} 240 L${v[0]} ${v[1]}`} stroke="#64748b" strokeWidth={2} />)}
    {t < .5 && <path d={`M${atoms[4][0]} ${atoms[4][1]} L${atoms[5][0]} ${atoms[5][1]}`} stroke="#64748b" strokeWidth={2} />}
    {[100,250].map(x=><Particle key={x} x={x} y={240} label="S" colour="#a16207" r={15} />)}
    {atoms.map((v,i)=><Particle key={i} x={v[0]} y={v[1]} label="O" colour={colours.orange} r={11} />)}
    <Txt x={185} y={328} size={13}>{t === 0 ? '2SO₂ + O₂: two S and six O atoms' : t < 1 ? 'Two S and six O atoms rearrange' : '2SO₃: all atoms conserved'}</Txt>
  </g>;
}
function PlantScene({ kind, s, p, marker }: { kind: 'haber' | 'contact'; s: number; p: number; marker: string }) {
  const haber = kind === 'haber';
  const labels = haber ? [ ['N₂ + 3H₂', 'Air + water routes'], ['Compressor', '200 atm'], ['Iron converter', '450–500 °C'], ['Cooler', 'NH₃ condenses'] ] : [ ['Burn sulphur', 'Or roast iron pyrites'], ['V₂O₅ converter', '450–500 °C; 1 atm'], ['Absorb SO₃', 'Concentrated H₂SO₄'], ['Dilute oleum', 'Controlled water addition'] ];
  return <>
    {labels.map(([title, sub], i) => <Box key={title} x={30 + i * 220} y={85} w={175} title={title} sub={sub} active={haber ? s === i || (i === 2 && s === 4) : s === i} />)}
    {[0, 1, 2].map(i => <Flow key={i} d={`M${205 + i * 220} 122 H${246 + i * 220}`} p={p} active={s >= i + 1} marker={marker} />)}
    {haber ? <>
      <Flow d="M777 157 V270 H680" p={p} active={s >= 3} colour={colours.green} marker={marker} />
      <Box x={510} y={240} w={165} title="Liquid ammonia" sub="Product removed" active={s >= 3} />
      <Flow d="M822 157 V335 H495 V160" p={p} active={s === 4} colour={colours.violet} marker={marker} />
      <Txt x={717} y={363} size={15} fill={colours.violet}>Recycle N₂ + H₂ to converter feed</Txt>
      {s >= 3 && <MovingDots points={[[777, 160], [777, 270], [680, 270]]} progress={p} colour={colours.green} count={4} />}
      {s === 4 && <MovingDots points={[[822, 157], [822, 335], [495, 335], [495, 160]]} progress={p} colour={colours.violet} count={6} />}
      {s === 2 ? <AmmoniaMolecules progress={p} /> : <><Txt x={160} y={270} size={17}>1 N₂ + 3 H₂ ⇌ 2 NH₃</Txt><Txt x={175} y={301} size={13}>Partial conversion on each pass</Txt></>}
    </> : <>
      <Txt x={225} y={65} size={15}>SO₂</Txt><Txt x={445} y={65} size={15}>SO₃</Txt><Txt x={667} y={65} size={15}>Oleum</Txt>
      <Flow d="M365 260 V160" p={p} active={s >= 1} marker={marker} /><Txt x={415} y={285} size={14}>O₂ from air</Txt>{s === 1 && <SulphurMolecules progress={p} />}
      <Flow d="M775 157 V275 H850" p={p} active={s === 3} colour={colours.green} marker={marker} /><Txt x={735} y={313} size={17}>H₂SO₄ product</Txt>
      {s >= 1 && <MovingDots points={[[211, 121], [244, 121]]} progress={p} count={2} colour={colours.orange} />}
      {s >= 2 && <MovingDots points={[[430, 121], [465, 121]]} progress={p} count={2} colour={colours.blue} />}
      <Txt x={530} y={230} size={16}>SO₃ + H₂SO₄ → H₂S₂O₇</Txt><Txt x={530} y={265} size={16}>H₂S₂O₇ + H₂O → 2H₂SO₄</Txt>
      <Txt x={450} y={362} size={15}>SO₃ is absorbed in acid first; water is added to oleum.</Txt>
    </>}
    {haber && s === 2 && <MovingDots points={[[497, 175], [620, 175]]} progress={p} colour={colours.green} count={4} />}
  </>;
}

const duration = 6000;
export default function IndustrialProcessAnimation({ process, title }: { process: IndustrialProcess; title: string }) {
  const stages = processStages[process];
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const marker = useId().replace(/:/g, '') + '-arrow';
  const max = stages.length * duration;
  const stage = Math.min(stages.length - 1, Math.floor(elapsed / duration));
  const progress = elapsed >= max ? 1 : elapsed % duration / duration;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (!root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(root.current); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || !visible || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setElapsed(t => Math.min(max, t + 80 * speed));
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing, speed, visible, max, reducedMotion]);
  useEffect(() => { if (elapsed >= max) setPlaying(false); }, [elapsed, max]);
  const select = (i: number) => { const target = Math.max(0, Math.min(stages.length - 1, i)); setElapsed(target * duration + duration * .5); setPlaying(false); };
  const props = { s: stage, p: progress, marker };
  return <div ref={root} data-process={process} className="overflow-hidden rounded-2xl border border-sky-200 bg-slate-50 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 bg-white px-4 py-3">
      <p className="font-bold text-slate-900">{title}</p><span className="text-xs font-bold uppercase tracking-wider text-sky-700">Process animation</span>
    </div>
    <div className="w-full" aria-label={`${title} diagram`}>
      <svg viewBox="0 0 900 395" className="mx-auto block h-auto w-full" style={{ maxHeight: 'min(50svh, 440px)' }} role="img" aria-label={`${title}. Stage ${stage + 1}: ${stages[stage].detail}`}>
        <defs><marker id={marker} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#64748b" /></marker></defs>
        <rect width={900} height={395} fill="#f8fafc" />
        <g fontFamily="system-ui, sans-serif" fontWeight={500}>
          {process === 'peanuts' && <PeanutScene {...props} />}{process === 'soap' && <SoapScene {...props} />}{process === 'air' && <AirScene {...props} />}
          {process === 'lead' && <LeadScene {...props} />}{process === 'water' && <WaterScene {...props} />}{process === 'plating' && <PlatingScene {...props} />}
          {(process === 'haber' || process === 'contact') && <PlantScene kind={process} {...props} />}
        </g>
      </svg>
    </div>
    <div className="space-y-3 border-t border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {!reducedMotion && <button type="button" onClick={() => { if (elapsed >= max) setElapsed(0); setPlaying(v => !v); }} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800">{playing ? 'Pause' : elapsed >= max ? 'Replay' : 'Play'}</button>}
        <button type="button" onClick={() => select(stage - 1)} disabled={stage === 0} className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
        <button type="button" onClick={() => select(stage + 1)} disabled={stage === stages.length - 1} className="rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
        <button type="button" onClick={() => { setElapsed(0); setPlaying(false); }} className="rounded-lg border px-3 py-2 text-sm font-semibold">Reset</button>
        {!reducedMotion && <label className="ml-auto flex items-center gap-2 text-sm text-slate-600">Speed <select value={speed} onChange={e => setSpeed(Number(e.target.value))} className="rounded-lg border p-2"><option value={.5}>0.5×</option><option value={1}>1×</option><option value={2}>2×</option></select></label>}
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Process stages">{stages.map((v, i) => <button type="button" key={v.title} onClick={() => select(i)} aria-pressed={stage === i} className={`rounded-lg px-3 py-2 text-left text-xs font-bold ${stage === i ? 'bg-sky-100 text-sky-900 ring-1 ring-sky-400' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{i + 1}. {v.title}</button>)}</div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Playback progress" aria-valuenow={Math.round(elapsed / max * 100)} aria-valuemin={0} aria-valuemax={100}><div className="h-full bg-sky-600" style={{ width: `${elapsed / max * 100}%` }} /></div>
      <div aria-live="polite" aria-atomic="true"><p className="font-bold text-slate-900">{stage + 1} / {stages.length} · {stages[stage].title}</p><p className="mt-1 text-sm leading-relaxed text-slate-600">{stages[stage].detail}</p>{stages[stage].equation && <p className="mt-2 rounded-lg bg-slate-50 p-2 font-mono text-sm font-semibold text-sky-900">{stages[stage].equation}</p>}</div>
      <p className="text-xs text-slate-500">Simplified process model; timing, particle sizes and equipment sizes are illustrative.{reducedMotion ? ' Reduced motion is enabled: use the stage buttons to follow the process.' : ' Pause to inspect a stage, or choose a stage above.'}</p>
    </div>
  </div>;
}
