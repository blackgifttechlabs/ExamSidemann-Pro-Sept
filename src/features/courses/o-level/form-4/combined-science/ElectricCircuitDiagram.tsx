import React, { useId } from 'react';
export type CircuitKind = 'symbols' | 'meters' | 'resistors';
const Text = ({ x, y, children }: { x: number; y: number; children: React.ReactNode }) => <text x={x} y={y} textAnchor="middle" fill="#0f172a" stroke="none" fontSize="17" fontFamily="system-ui, sans-serif">{children}</text>;
function Resistor({ x, y, label }: { x: number; y: number; label?: string }) { return <><rect x={x-35} y={y-14} width="70" height="28" fill="white" />{label && <Text x={x} y={y-25}>{label}</Text>}</>; }
function Cell({ x, y }: { x: number; y: number }) { return <><path d={`M${x-24} ${y-10}h48 M${x-13} ${y+10}h26`} /><Text x={x-39} y={y-5}>+</Text><Text x={x-39} y={y+16}>−</Text></>; }
function Meter({ x, y, letter }: { x: number; y: number; letter: string }) { return <><circle cx={x} cy={y} r="24" fill="white" /><Text x={x} y={y+6}>{letter}</Text></>; }
function Junction({ x, y }: { x: number; y: number }) { return <circle cx={x} cy={y} r="4" fill="#0f172a" stroke="none" />; }
export default function ElectricCircuitDiagram({ kind }: { kind: CircuitKind }) {
  const titleId = useId(); const markerId = useId();
  const height = kind === 'symbols' ? 530 : 420;
  return <figure className="my-5 min-w-0"><svg role="img" aria-labelledby={titleId} viewBox={`0 0 640 ${height}`} className="mx-auto block h-auto w-full rounded-2xl border border-slate-200 bg-white" style={{ maxHeight: 'min(60svh, 600px)' }}>
    <title id={titleId}>{kind === 'symbols' ? 'Standard symbols and a complete d.c circuit' : kind === 'meters' ? 'Ammeter in series and voltmeter across a resistor' : 'Series and parallel resistor circuits'}</title>
    <defs><marker id={markerId} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#0f172a" /></marker></defs>
    <g fill="none" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'symbols' && <>
        <Text x={320} y={32}>A complete d.c circuit</Text>
        <path d="M80 80H185 M185 56V104 M205 66V94 M205 80H310 M310 80H365 M365 80H550V115 M550 165V230H355 M285 230H80V80" />
        <Junction x={310} y={80} /><Junction x={365} y={80} />
        <circle cx="550" cy="140" r="25" fill="white" /><path d="M533 123L567 157 M533 157L567 123" />
        <Resistor x={320} y={230} /><Text x={195} y={49}>Cell</Text><Text x={340} y={61}>Closed switch</Text><Text x={505} y={142}>Lamp</Text><Text x={320} y={260}>Resistor</Text>
        <Text x={320} y={306}>Standard symbols</Text>
        <g transform="translate(110 347)"><path d="M-45 0H-8 M-8 -22V22 M8 -12V12 M8 0H45" /><Text x={0} y={43}>Cell</Text></g>
        <g transform="translate(320 347)"><path d="M-60 0H-25 M-25 -22V22 M-10 -12V12 M-10 0H10 M10 -22V22 M25 -12V12 M25 0H60" /><Text x={0} y={43}>Battery</Text></g>
        <g transform="translate(530 347)"><path d="M-55 0H-22L20 -23 M22 0H55" /><circle cx="-22" cy="0" r="3" /><circle cx="22" cy="0" r="3" /><Text x={0} y={43}>Open switch</Text></g>
        <g transform="translate(110 445)"><path d="M-55 0H-35 M35 0H55" /><Resistor x={0} y={0} /><Text x={0} y={44}>Resistor</Text></g>
        <g transform="translate(320 445)"><path d="M-55 0H-35 M35 0H55" /><Resistor x={0} y={0} /><path d="M-29 25L29 -25" markerEnd={`url(#${markerId})`} /><Text x={0} y={44}>Variable resistor</Text></g>
        <g transform="translate(530 445)"><path d="M-55 0H55" /><rect x="-35" y="-14" width="70" height="28" /><Text x={0} y={44}>Fuse</Text></g>
      </>}
      {kind === 'meters' && <>
        <Text x={320} y={34}>Measure the resistor’s current and voltage</Text>
        <path d="M80 170V90H150 M150 90H205 M205 90H276 M324 90H405 M475 90H560V345H80V190" />
        <Cell x={80} y={180} /><Junction x={150} y={90} /><Junction x={205} y={90} /><Meter x={300} y={90} letter="A" /><Resistor x={440} y={90} label="Resistor" />
        <path d="M380 90V210H416 M464 210H510V90" /><Junction x={380} y={90} /><Junction x={510} y={90} /><Meter x={440} y={210} letter="V" />
        <Text x={300} y={144}>A in series</Text><Text x={440} y={265}>V in parallel</Text><Text x={160} y={213}>Cell</Text>
        <Text x={320} y={390}>No wire bypasses the resistor.</Text>
      </>}
      {kind === 'resistors' && <>
        <Text x={320} y={28}>Series: R = 2 + 4 = 6 Ω</Text>
        <path d="M80 95V65H205 M275 65H395 M465 65H560V175H80V115" /><Cell x={80} y={105} /><Resistor x={240} y={65} label="2 Ω" /><Resistor x={430} y={65} label="4 Ω" /><Text x={320} y={154}>One path: same current</Text>
        <Text x={320} y={227}>Parallel: 1/R = 1/6 + 1/6 → R = 3 Ω</Text>
        <path d="M80 305V270H180 M180 270H285 M355 270H500 M180 270V340H285 M355 340H500V270 M500 270H560V390H80V325" /><Cell x={80} y={315} /><Resistor x={320} y={270} label="6 Ω" /><Resistor x={320} y={340} label="6 Ω" /><Junction x={180} y={270} /><Junction x={500} y={270} />
        <Text x={320} y={380}>Two branches: same voltage</Text>
      </>}
    </g>
  </svg><figcaption className="mt-2 text-sm leading-relaxed text-slate-600">{kind === 'symbols' ? 'SVG: trace the complete path and compare standard circuit symbols.' : kind === 'meters' ? 'SVG: the voltmeter’s branch connects to the resistor’s two ends.' : 'SVG: compare a single series path with two parallel branches.'}</figcaption></figure>;
}
