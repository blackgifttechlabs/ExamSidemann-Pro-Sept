import React, { Suspense, lazy, useRef, useState } from 'react';

const ZeroErrorScene = lazy(() => import('./ZeroErrorScene'));
const DisplacementScene = lazy(() => import('./DisplacementScene'));
const DensityScene = lazy(() => import('./DensityScene'));
const DensitySteps = lazy(() => import('./DensitySteps'));
const AmmeterVoltmeterScene = lazy(() => import('./AmmeterVoltmeterScene'));
const LiquidDensitySteps = lazy(() => import('./LiquidDensitySteps'));

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Diagram({ name, alt, caption = true }: { name: string; alt: string; caption?: boolean }) {
  return <figure className="my-5"><img src={`${imageRoot}phys-measurements-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-auto max-w-full rounded-2xl border border-slate-200" style={{ maxHeight: 'min(60svh, 560px)' }} />{caption && <figcaption className="mt-2 text-left text-sm leading-relaxed text-slate-600">{alt}</figcaption>}</figure>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-b border-slate-300 pb-6 last:border-b-0"><h3 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h3><div className="space-y-4 text-lg leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows, plain = false }: { headers: string[]; rows: React.ReactNode[][]; plain?: boolean }) {
  const cell = plain ? 'border-b border-slate-200 p-3' : 'border border-slate-200 p-3';
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className={`${cell} font-bold text-slate-900`}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j} className={`${cell} align-top`}>{v}</td>)}</tr>)}</tbody></table></div>;
}
function PlaySound({ src, label }: { src: string; label: string }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    if (!audio.current) {
      audio.current = new Audio(src);
      audio.current.onended = () => setPlaying(false);
    }
    if (playing) { audio.current.pause(); audio.current.currentTime = 0; setPlaying(false); return; }
    audio.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };
  return <button type="button" onClick={toggle} aria-label={playing ? `Stop: ${label}` : `Play: ${label}`} className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 align-middle text-white hover:bg-violet-700">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">{playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}</svg>
  </button>;
}
function StepCard({ n, text, extra, children }: { n: number; text: string; extra?: React.ReactNode; children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <p className="font-extrabold text-violet-700">Step {n}</p>
    <svg viewBox="0 0 120 90" className="mx-auto my-2 h-28 w-auto" role="img" aria-label={text}>{children}</svg>
    <p className="text-base text-slate-700">{text}</p>
    {extra}
  </div>;
}
function BalanceBase({ reading }: { reading: string }) {
  return <g><rect x={12} y={66} width={96} height={18} rx={4} fill="#cbd5e1" stroke="#64748b" strokeWidth={2} /><rect x={36} y={70} width={48} height={10} rx={2} fill="#e2e8f0" stroke="#64748b" /><text x={60} y={78.5} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0f172a">{reading}</text><rect x={26} y={60} width={68} height={6} rx={2} fill="#94a3b8" /></g>;
}
function ParallaxSvg() {
  return <svg viewBox="0 0 380 190" className="h-auto w-full max-w-md" role="img" aria-label="Parallax error: looking from above or below the pointer gives a wrong reading; looking straight on gives the correct reading.">
    <path d="M10 90 Q80 30 150 90" fill="none" stroke="#334155" strokeWidth={2} />
    {Array.from({ length: 11 }, (_, i) => { const t = i / 10, x = 10 + 140 * t, y = (1 - t) * (1 - t) * 90 + 2 * t * (1 - t) * 30 + t * t * 90; return <path key={i} d={`M${x} ${y} v${i % 5 === 0 ? 14 : 8}`} stroke="#334155" strokeWidth={1.5} />; })}
    <path d="M80 165 V60" stroke="#0f172a" strokeWidth={4} strokeLinecap="round" /><path d="M80 72 V60" stroke="#ef4444" strokeWidth={4} strokeLinecap="round" />
    <circle cx={80} cy={165} r={7} fill="#64748b" />
    <text x={90} y={130} fontSize={11} fill="#475569">pointer</text>
    <path d="M238 20 L82 60" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 4" />
    <g transform="translate(274 20) scale(-1 1)"><path d="M0 0 L24 -11 Q34 0 24 11 Z" fill="#fff" stroke="#ef4444" strokeWidth={2.5} strokeLinejoin="round" /><circle cx={22} cy={0} r={4.5} fill="#ef4444" /></g>
    <text x={282} y={19} fontSize={11} fontWeight={700} fill="#0f172a">Above:</text><text x={282} y={33} fontSize={11} fontWeight={700} fill="#0f172a">wrong view</text>
    <path d="M238 60 L82 60" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 4" />
    <g transform="translate(274 60) scale(-1 1)"><path d="M0 0 L24 -11 Q34 0 24 11 Z" fill="#fff" stroke="#2563eb" strokeWidth={2.5} strokeLinejoin="round" /><circle cx={22} cy={0} r={4.5} fill="#2563eb" /></g>
    <text x={282} y={59} fontSize={11} fontWeight={700} fill="#0f172a">Straight on:</text><text x={282} y={73} fontSize={11} fontWeight={700} fill="#0f172a">correct view</text>
    <path d="M238 100 L82 60" stroke="#16a34a" strokeWidth={2} strokeDasharray="5 4" />
    <g transform="translate(274 100) scale(-1 1)"><path d="M0 0 L24 -11 Q34 0 24 11 Z" fill="#fff" stroke="#16a34a" strokeWidth={2.5} strokeLinejoin="round" /><circle cx={22} cy={0} r={4.5} fill="#16a34a" /></g>
    <text x={282} y={99} fontSize={11} fontWeight={700} fill="#0f172a">Below:</text><text x={282} y={113} fontSize={11} fontWeight={700} fill="#0f172a">wrong view</text>
    <rect x={140} y={148} width={230} height={26} rx={6} fill="#fef3c7" stroke="#f59e0b" />
    <text x={255} y={165} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0f172a">Read straight in front of the pointer</text>
  </svg>;
}
function ImageStep({ n, text, name, alt }: { n: number; text: string; name: string; alt: string }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <p className="font-extrabold text-violet-700">Step {n}</p>
    <img src={`${imageRoot}phys-measurements-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="mx-auto my-2 block h-auto w-full rounded-lg" />
    <p className="text-base text-slate-700">{text}</p>
  </div>;
}
function Formula({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>; }
function Sub({ children }: { children: React.ReactNode }) { return <p className="text-xl font-bold text-slate-900">{children}</p>; }
function List({ children }: { children: React.ReactNode }) { return <ul className="list-disc space-y-1 pl-6">{children}</ul>; }
function Steps({ children }: { children: React.ReactNode }) { return <ol className="list-decimal space-y-1 pl-6">{children}</ol>; }

export default function Measurements() {
  return <div className="not-prose space-y-6">
    <p className="text-lg leading-relaxed text-slate-700"><strong>Measuring</strong> means finding out how big, how heavy, how long or how hot something is, by using an instrument and writing the answer as a number with a unit.</p>
    <p className="text-lg leading-relaxed text-slate-700">So when we measure, we do three things:</p>
    <List>
      <li>choose the right instrument,</li>
      <li>read it the correct way,</li>
      <li>and write the number with its unit.</li>
    </List>
    <p className="text-lg leading-relaxed text-slate-700">A number on its own means nothing in the exam. "5" is not an answer. "5 cm" is.</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 p-3 text-center">
        <svg viewBox="0 0 120 60" className="mx-auto h-16 w-auto" aria-hidden="true"><rect x={8} y={18} width={104} height={26} rx={3} fill="#fde68a" stroke="#b45309" strokeWidth={2} />{Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${16 + i * 9.4} 18 v${i % 5 === 0 ? 14 : 8}`} stroke="#78350f" strokeWidth={1.5} />)}</svg>
        <p className="mt-1 font-bold text-slate-900">1. Choose</p>
        <p className="text-base text-slate-600">A ruler for length, not a stopwatch.</p>
      </div>
      <div className="rounded-xl border border-slate-200 p-3 text-center">
        <svg viewBox="0 0 120 60" className="mx-auto h-16 w-auto" aria-hidden="true"><path d="M10 30 Q60 -5 110 30 Q60 65 10 30 Z" fill="#fff" stroke="#334155" strokeWidth={2.5} /><circle cx={60} cy={30} r={13} fill="#0284c7" /><circle cx={60} cy={30} r={6} fill="#0f172a" /></svg>
        <p className="mt-1 font-bold text-slate-900">2. Read</p>
        <p className="text-base text-slate-600">Look straight at the scale.</p>
      </div>
      <div className="rounded-xl border border-slate-200 p-3 text-center">
        <div className="flex h-16 items-center justify-center gap-4 text-2xl font-extrabold"><span className="text-red-600">5 ✗</span><span className="text-green-700">5 cm ✓</span></div>
        <p className="mt-1 font-bold text-slate-900">3. Write the unit</p>
        <p className="text-base text-slate-600">No unit, no mark.</p>
      </div>
    </div>
    <hr className="border-slate-300" />
    <Card title="Instruments and the Quantities They Measure">
      <List>
        <li>A <strong>quantity</strong> is the thing you want to find out, like length, mass, time or temperature.</li>
        <li>An <strong>instrument</strong> is the tool you use to measure it, like a ruler, a balance, a stopwatch or a thermometer.</li>
        <li>Each quantity has its own instrument and its own unit.</li>
      </List>
      <Diagram name="tools" caption={false} alt="Measuring tools: metre rule, thermometer, balance, stopwatch, measuring cylinder, overflow can, vernier callipers, ammeter and voltmeter." />
      <p>Each thing you measure has its own instrument and its own SI unit:</p>
      <Table headers={['Quantity', 'Instrument', 'SI unit', 'Symbol']} rows={[
        ['Length', 'Metre rule', 'metre', 'm'], ['Mass', 'Balance', 'kilogram', 'kg'], ['Time', 'Stopwatch', 'second', 's'], ['Temperature', 'Thermometer', 'kelvin', 'K'],
      ]} />
      <p>At school your thermometer usually reads in °C. Kelvin (K) is the SI unit and has no degree sign.</p>
      <Sub>How to measure well</Sub>
      <Steps>
        <li>Guess the answer first. This helps you spot a silly mistake later.</li>
        <li>Pick an instrument that suits the size of what you measure.</li>
        <li>Check that it starts at zero, and see what one small division is worth.</li>
        <li>Read from the right position and write the reading to the nearest division, with the unit.</li>
      </Steps>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div><p className="text-xl font-bold text-slate-900">Parallax error</p><ParallaxSvg /></div>
        <div><p className="text-xl font-bold text-slate-900">Zero error</p><Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><ZeroErrorScene /></Suspense></div>
      </div>
      <Table headers={['', 'Parallax error', 'Zero error']} rows={[
        ['When it happens', 'When you look at the scale from the side. From above or below you get a different reading; looking straight on gives the correct one.', 'When the instrument shows a number when it should show zero, like an empty balance showing 2.0 g.'],
        ['How to fix it', 'Put your eye straight in front of the mark. For a liquid, put your eye level with the liquid.', 'Reset it to zero if you can. If you cannot, correct your answer.'],
        ['How to correct the reading', 'No sum needed. Just read again from the right position.', <>
          <strong>Correct reading = reading shown − zero error</strong><br /><br />
          The empty balance shows +2.0 g and you read 52.0 g. So 52.0 − 2.0 = <strong>50.0 g</strong>.<br /><br />
          If the zero error is −2.0 g and you read 48.0 g, then 48.0 − (−2.0) = <strong>50.0 g</strong>.
        </>],
      ]} />
      <Sub>Accuracy and Precision</Sub>
      <p>Say a stone really weighs <strong>50 g</strong>. You weigh it three times.</p>
      <Table headers={['Your readings', 'What it means']} rows={[
        ['50 g, 51 g, 49 g', <><strong>Accurate</strong>: your readings are close to the true value (50 g).</>],
        ['58 g, 58 g, 58 g', <><strong>Precise</strong>: you get the same answer every time. But it is not close to 50 g, so it is not accurate.</>],
        ['50 g, 50 g, 50 g', <>Both <strong>accurate and precise</strong>. This is what you want.</>],
      ]} />
      <List>
        <li><strong>Accurate</strong> = close to the true answer.</li>
        <li><strong>Precise</strong> = same answer each time.</li>
        <li>A zero error makes you precise but not accurate, because every reading is wrong by the same amount.</li>
      </List>
    </Card>
    <Card title="Units and Conversions">
      <p>Prefixes tell you how big the unit is:</p>
      <Table headers={['Prefix', 'Symbol', 'Meaning']} rows={[
        ['kilo', 'k', '1000 times the unit'], ['centi', 'c', 'One hundredth of the unit'], ['milli', 'm', 'One thousandth of the unit'],
      ]} />
      <Formula>1 m = 100 cm = 1000 mm<br />1 kg = 1000 g<br />1 min = 60 s</Formula>
      <Sub>How to convert</Sub>
      <Table headers={['Change', 'What you do', 'Example']} rows={[
        ['m to cm', 'multiply by 100', '2.5 m = 250 cm'], ['m to mm', 'multiply by 1000', '0.12 m = 120 mm'], ['kg to g', 'multiply by 1000', '0.75 kg = 750 g'], ['min to s', 'multiply by 60', '2.5 min = 150 s'],
      ]} />
      <Sub>Going the other way</Sub>
      <List>
        <li>To go back, <strong>divide</strong> by the same number. Example: 250 cm ÷ 100 = 2.5 m.</li>
        <li>Check your answer. A small unit gives a big number: 2.5 m is 250 cm. A big unit gives a small number: 250 cm is 2.5 m.</li>
      </List>
      <Sub>Do not mix up the letters</Sub>
      <List>
        <li><strong>m</strong> on its own means metre.</li>
        <li><strong>m</strong> in front of another letter means milli, like <strong>mm</strong> (millimetre).</li>
        <li>Minutes are written <strong>min</strong>.</li>
      </List>
    </Card>
    <Card title="Mass and Volume">
      <Table headers={['', 'Mass', 'Volume']} rows={[
        ['What it is', 'The amount of matter (stuff) in an object.', 'The amount of space an object takes up.'],
        ['In simple words', 'How much is in it.', 'How much room it takes.'],
        ['Instrument used', 'Balance', 'Measuring cylinder'],
        ['Units', 'kg, g', <>m³, cm³ <PlaySound src="/sounds/cubic-centimetres.mp3" label="how cm³ is spelled" /> (for liquids: litres, mL)</>],
      ]} />
      <p>Example: a bucket full of sand and a bucket full of feathers take up the same space, so they have the <strong>same volume</strong>. But the sand has more matter in it, so it has more <strong>mass</strong>.</p>
      <div className="pt-6"><Sub>How to find the mass of a liquid</Sub></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StepCard n={1} text="Weigh the empty, dry container.">
          <BalanceBase reading="40 g" /><path d="M42 24 H78 L74 60 H46 Z" fill="#f1f5f9" stroke="#334155" strokeWidth={2.5} />
        </StepCard>
        <StepCard n={2} text="Pour in the liquid and weigh again.">
          <BalanceBase reading="90 g" /><path d="M42 24 H78 L74 60 H46 Z" fill="#f1f5f9" stroke="#334155" strokeWidth={2.5} /><path d="M44 38 H76 L74 60 H46 Z" fill="#38bdf8" opacity={0.8} /><path d="M60 4 v14 M54 12 l6 7 6 -7" fill="none" stroke="#0284c7" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </StepCard>
        <StepCard n={3} text="Take away the empty container's mass.">
          <text x={60} y={34} textAnchor="middle" fontSize={16} fontWeight={800} fill="#0f172a">90 − 40</text><text x={60} y={64} textAnchor="middle" fontSize={22} fontWeight={800} fill="#15803d">= 50 g</text>
        </StepCard>
      </div>
      <div className="pt-6"><Sub>How to read the volume of a liquid</Sub></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StepCard n={1} text="Stand the measuring cylinder on a flat table.">
          <rect x={8} y={62} width={104} height={8} fill="#d6a05a" stroke="#92400e" /><path d="M50 10 V62 H70 V10" fill="#f8fafc" stroke="#334155" strokeWidth={2.5} /><path d="M51 34 Q60 40 69 34 V61 H51 Z" fill="#38bdf8" opacity={0.8} />
        </StepCard>
        <StepCard n={2} text="Put your eye level with the liquid.">
          <rect x={8} y={62} width={104} height={8} fill="#d6a05a" stroke="#92400e" /><path d="M50 10 V62 H70 V10" fill="#f8fafc" stroke="#334155" strokeWidth={2.5} /><path d="M51 34 Q60 40 69 34 V61 H51 Z" fill="#38bdf8" opacity={0.8} />
          <g transform="translate(32 0) scale(-1 1)"><path d="M11 26 Q-1 38 11 50 L31 38 Z" fill="#fff" stroke="#0369a1" strokeWidth={2.5} strokeLinejoin="round" /><circle cx={21} cy={38} r={4.5} fill="#0369a1" /></g><path d="M33 38 H49" stroke="#0369a1" strokeWidth={2} strokeDasharray="3 3" /><text x={16} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0369a1">eye</text>
        </StepCard>
        <StepCard n={3} text="Read the bottom of the curve (the meniscus).">
          <rect x={8} y={62} width={104} height={8} fill="#d6a05a" stroke="#92400e" /><path d="M50 10 V62 H70 V10" fill="#f8fafc" stroke="#334155" strokeWidth={2.5} /><path d="M51 34 Q60 40 69 34 V61 H51 Z" fill="#38bdf8" opacity={0.8} />
          <defs><clipPath id="meniscusZoom"><circle cx={97} cy={24} r={18}><animate attributeName="r" values="3;18;18;3" keyTimes="0;0.4;0.9;1" dur="3.5s" repeatCount="indefinite" /></circle></clipPath></defs>
          <circle cx={60} cy={37} r={2.5} fill="#ef4444"><animate attributeName="r" values="2;4;2" dur="1.2s" repeatCount="indefinite" /></circle>
          <path d="M64 35 L80 27" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3"><animate attributeName="stroke-dashoffset" values="12;0" dur="0.8s" repeatCount="indefinite" /></path>
          <g clipPath="url(#meniscusZoom)"><rect x={79} y={6} width={36} height={36} fill="#fff" /><path d="M79 14 Q97 38 115 14 V42 H79 Z" fill="#38bdf8" opacity={0.85} /><path d="M79 14 Q97 38 115 14" fill="none" stroke="#334155" strokeWidth={2} /><path d="M79 26 H115" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" /><circle cx={97} cy={26} r={3} fill="#ef4444" /></g>
          <circle cx={97} cy={24} r={18} fill="none" stroke="#334155" strokeWidth={2}><animate attributeName="r" values="3;18;18;3" keyTimes="0;0.4;0.9;1" dur="3.5s" repeatCount="indefinite" /></circle>
          <text x={97} y={55} textAnchor="middle" fontSize={9} fontWeight={800} fill="#ef4444">read here</text>
        </StepCard>
      </div>
      <p>Remember: <strong>1 mL = 1 cm³</strong>.</p>
      <div className="pt-6"><Sub>How to find the volume of a solid</Sub></div>
      <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><DisplacementScene /></Suspense>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StepCard n={1} text="Pour water in and write down the volume.">
          <rect x={45.5} y={38} width={29} height={30} fill="#0b73c9" /><path d="M44 8 V68 H76 V8" fill="none" stroke="#334155" strokeWidth={3} strokeLinejoin="round" /><rect x={36} y={68} width={48} height={6} rx={3} fill="#3d4a5c" /><text x={92} y={41} fontSize={10} fontWeight={800} fill="#0b73c9">30</text><path d="M78 38 H88" stroke="#0b73c9" strokeWidth={2} />
        </StepCard>
        <StepCard n={2} text="Tie the solid to a string and lower it in slowly.">
          <rect x={45.5} y={38} width={29} height={30} fill="#0b73c9" /><path d="M60 2 V54" stroke="#92400e" strokeWidth={1.5} /><path d="M52 56 Q50 48 57 45 Q65 42 70 48 Q73 55 68 57 Q60 59 52 56 Z" fill="#7b8794" stroke="#4b5563" strokeWidth={1.5} /><path d="M44 8 V68 H76 V8" fill="none" stroke="#334155" strokeWidth={3} strokeLinejoin="round" /><rect x={36} y={68} width={48} height={6} rx={3} fill="#3d4a5c" />
        </StepCard>
        <StepCard n={3} text="Read the new volume. The rise is the volume of the solid." extra={<p className="mt-2 rounded-lg bg-sky-50 p-2 text-sm font-semibold text-sky-950">Volume of solid = final reading − first reading<br />50 cm³ − 30 cm³ = 20 cm³</p>}>
          <rect x={45.5} y={26} width={29} height={42} fill="#0b73c9" /><path d="M52 66 Q50 58 57 55 Q65 52 70 58 Q73 65 68 67 Q60 69 52 66 Z" fill="#7b8794" stroke="#4b5563" strokeWidth={1.5} /><path d="M60 2 V56" stroke="#92400e" strokeWidth={1.5} /><path d="M44 8 V68 H76 V8" fill="none" stroke="#334155" strokeWidth={3} strokeLinejoin="round" /><rect x={36} y={68} width={48} height={6} rx={3} fill="#3d4a5c" /><text x={92} y={29} fontSize={10} fontWeight={800} fill="#0b73c9">50</text><path d="M78 26 H88" stroke="#0b73c9" strokeWidth={2} />
        </StepCard>
      </div>
      <div className="pt-6"><Sub>How to use an overflow can</Sub></div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StepCard n={1} text="Fill the can until water drips from the spout. Wait until it stops, then put a cup under the spout.">
          <rect x={16} y={42} width={46} height={34} fill="#0b73c9" /><rect x={14} y={30} width={50} height={46} fill="#cbd5e1" stroke="#475569" strokeWidth={2.5} /><path d="M64 36 L84 42 L84 46 L64 42 Z" fill="#cbd5e1" stroke="#475569" strokeWidth={2} /><circle cx={85} cy={52} r={2.2} fill="#0b73c9" /><path d="M78 58 H102 L99 76 H81 Z" fill="#f1f5f9" stroke="#475569" strokeWidth={2} />
        </StepCard>
        <StepCard n={2} text="Lower the solid in gently. The water that runs out fills the cup.">
          <path d="M39 4 V50" stroke="#92400e" strokeWidth={1.5} /><rect x={16} y={42} width={46} height={34} fill="#0b73c9" /><path d="M28 60 Q26 52 33 49 Q41 46 46 52 Q49 59 44 61 Q36 63 28 60 Z" fill="#7b8794" stroke="#4b5563" strokeWidth={1.5} /><rect x={14} y={30} width={50} height={46} fill="#cbd5e1" stroke="#475569" strokeWidth={2.5} /><path d="M64 36 L84 42 L84 46 L64 42 Z" fill="#cbd5e1" stroke="#475569" strokeWidth={2} /><path d="M84 46 Q86 52 85 56" fill="none" stroke="#0b73c9" strokeWidth={3} strokeLinecap="round" /><path d="M78 58 H102 L99 76 H81 Z" fill="#f1f5f9" stroke="#475569" strokeWidth={2} /><path d="M81.0 66 H99.0 L99 76 H81 Z" fill="#0b73c9" />
        </StepCard>
        <StepCard n={3} text="Pour the water from the cup into a measuring cylinder. That is the volume of the solid.">
          <path d="M70 34 V80 H102 V34" fill="none" stroke="#334155" strokeWidth={3} strokeLinejoin="round" /><rect x={71.5} y={60} width={29} height={20} fill="#0b73c9" /><rect x={62} y={80} width={48} height={6} rx={3} fill="#3d4a5c" />
          <path d="M62 14 L78 28 L60 49 L44 35 Z" fill="#f1f5f9" stroke="#475569" strokeWidth={2} strokeLinejoin="round" /><path d="M66 22 L74 29 L60 45 L52 37 Z" fill="#0b73c9" opacity={0.85} />
          <path d="M78 28 Q88 30 87 60" fill="none" stroke="#0b73c9" strokeWidth={3} strokeLinecap="round" />
        </StepCard>
      </div>
      <div className="pt-6"><Sub>How to determine the thickness, mass and volume of very small things</Sub></div>
      <p>One sheet of paper is too thin to measure. So measure many and share out the answer.</p>
      <p>Example: 100 sheets are 20 mm thick, so one sheet is 20 ÷ 100 = 0.20 mm. Count sheets, not page numbers.</p>
      <Table headers={['Find', 'What you do', 'Calculation']} rows={[
        ['Thickness of one sheet', 'Measure a stack of sheets (not the covers) and count them.', 'stack thickness ÷ number of sheets'],
        ['Mass of one seed or pin', 'Weigh many together and count them.', 'total mass ÷ number of objects'],
        ['Volume of one pin', 'Put many pins in water and see how much the water rises.', 'total rise ÷ number of pins'],
      ]} />
      <Diagram name="small-objects" alt="A stack of 100 sheets is 20 mm thick; its average thickness per sheet is 0.20 mm. Book covers are excluded." />
    </Card>
    <Card title="Density">
      <p><strong>Density</strong> is how tightly packed the stuff inside something is.</p>
      <List>
        <li>Tightly packed: <strong>high density</strong>, like a brick.</li>
        <li>Loosely packed: <strong>low density</strong>, like a sponge.</li>
      </List>
      <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><DensityScene /></Suspense>
      <div className="pt-6"><Sub>How to calculate the density of an irregular object</Sub></div>
      <p>An <strong>irregular object</strong> is something with a shape that is not even, like a stone (<em>dombo</em>).</p>
      <p>To find density, they always give you the mass and the volume. Use this formula:</p>
      <Formula>Density = mass ÷ volume<br />ρ = m ÷ V</Formula>
      <div className="pt-6"><Sub>How to find it</Sub></div>
      <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><DensitySteps /></Suspense>
      <div className="pt-6"><Sub>How to find the density of a liquid</Sub></div>
      <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><LiquidDensitySteps /></Suspense>
    </Card>
    <Card title="Vernier Callipers, Ammeters and Voltmeters">
      <p>A ruler, a balance and a measuring cylinder cannot measure everything. These three instruments are used for jobs that those cannot do:</p>
      <List>
        <li><strong>Vernier callipers</strong> measure small lengths more exactly than a ruler, such as the thickness of a coin or the inside width of a pipe.</li>
        <li><strong>Ammeter</strong> measures current (how much electricity flows).</li>
        <li><strong>Voltmeter</strong> measures voltage (how hard the electricity is pushed).</li>
      </List>
      <Sub>Vernier callipers</Sub>
      <Diagram name="vernier-diagram" caption={false} alt="Vernier callipers with the main scale in millimetres and a vernier scale of 0.02 mm divisions, with outside jaws at the bottom and inside jaws at the top." />
      <List>
        <li><strong>Outside jaws:</strong> measure thickness, or how wide something is.</li>
        <li><strong>Inside jaws:</strong> measure the inside diameter of a pipe or a cup.</li>
        <li>Close the jaws first and check that it reads zero.</li>
      </List>
      <Sub>How to read it</Sub>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ImageStep n={1} name="vernier-step-1" text="Read the main scale just before the zero of the sliding scale." alt="The zero of the sliding scale sits just past 24 mm on the main scale, so the main scale reading is 24 mm." />
        <ImageStep n={2} name="vernier-step-2" text="Find the line on the sliding scale that lines up with any line on the main scale." alt="The 15th line on the sliding scale lines up with a line on the main scale." />
        <ImageStep n={3} name="vernier-step-3" text="Multiply that line number by the least count, and add it to the first reading." alt="15 times 0.02 is 0.30 mm. 24 plus 0.30 gives 24.3 mm." />
      </div>
      <Formula>Reading = main scale reading + lined-up number × least count</Formula>
      <p>The <strong>least count</strong> is the smallest step the instrument can measure. In our example it is 0.02 mm: 24.0 + 15 × 0.02 = <strong>24.3 mm</strong>. Always check the least count on your own instrument.</p>
      <div className="pt-6"><Sub>Ammeter and voltmeter</Sub></div>
      <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><AmmeterVoltmeterScene /></Suspense>
      <List>
        <li><strong>Ammeter</strong> measures current. Connect it in <strong>series</strong>, in line with the component.</li>
        <li><strong>Voltmeter</strong> measures voltage. Connect it in <strong>parallel</strong>, across the component.</li>
        <li>Check the zero, choose a suitable range, and connect + to + and − to −.</li>
      </List>
    </Card>
    <Card title="Derived Units">
      <p><strong>To derive</strong> means to make something new from things you already have.</p>
      <List>
        <li>The <strong>base units</strong> are the basic units we start with. In this lesson you need four: metre (m), kilogram (kg), second (s) and ampere (A).</li>
        <li>A <strong>derived unit</strong> is a new unit made by multiplying or dividing base units.</li>
        <li>Example: speed = distance ÷ time, so its unit is m ÷ s = <strong>m/s</strong>.</li>
      </List>
      <Sub>What you will do here</Sub>
      <p>You will take a unit like the newton and write it using only base units. For example, force = mass × acceleration:</p>
      <Formula>kg × m/s² = kg·m/s²<br />So 1 N = 1 kg·m·s⁻²</Formula>
      <p>The table below shows the derived units you must know, with their base units.</p>
      <Table headers={['Quantity', 'SI unit', 'Symbol', 'In base units']} rows={[
        ['Force', 'newton', 'N', 'kg·m·s⁻²'], ['Energy / work', 'joule', 'J', 'kg·m²·s⁻²'], ['Power', 'watt', 'W', 'kg·m²·s⁻³'], ['Voltage', 'volt', 'V', 'kg·m²·s⁻³·A⁻¹'], ['Electric current', 'ampere', 'A', 'A — already a base unit'],
      ]} />
      <p>Careful: the <strong>ampere is a base unit</strong>, not a derived one. Newton, joule, watt and volt are derived.</p>
      <Formula>1 N = 1 kg·m·s⁻²<br />1 J = 1 N·m = 1 kg·m²·s⁻²<br />1 W = 1 J/s = 1 kg·m²·s⁻³<br />1 V = 1 W/A = 1 kg·m²·s⁻³·A⁻¹</Formula>
    </Card>
  </div>;
}
