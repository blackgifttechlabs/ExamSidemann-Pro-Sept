import React, { useEffect, useState } from 'react';

// Shared by Form 3 and Form 4 Combined Science. Written in plain, spoken
// English for exam answers: tallies, tables, bar graphs, straight-line graphs,
// pie charts and line graphs.
const survey = [
  { category: 'White', count: 4, colour: '#94a3b8' },
  { category: 'Brown', count: 7, colour: '#b45309' },
  { category: 'Black', count: 9, colour: '#1e293b' },
];
const total = survey.reduce((sum, item) => sum + item.count, 0);
const straightData = [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 }];
const lineData = [{ x: 0, y: 60 }, { x: 2, y: 52 }, { x: 4, y: 46 }, { x: 6, y: 42 }];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-b border-slate-300 pb-6 last:border-b-0">{title && <h3 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h3>}<div className="space-y-4 text-lg leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j} className="border border-slate-200 p-3 align-middle">{v}</td>)}</tr>)}</tbody></table></div>;
}
function Figure({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) {
  return <figure className="my-4"><svg viewBox="0 0 560 340" className="mx-auto block h-auto w-full rounded-xl border border-slate-200 bg-slate-50" style={{ maxHeight: 'min(60svh, 440px)' }} role="img" aria-label={`${title}. ${caption}`}><g fontFamily="system-ui, sans-serif" fill="#0f172a"><text x={280} y={28} textAnchor="middle" fontSize={18} fontWeight={700}>{title}</text>{children}</g></svg><figcaption className="mt-2 text-sm text-slate-600">{caption}</figcaption></figure>;
}
function Tally({ count }: { count: number }) {
  const groups = Math.floor(count / 5), remainder = count % 5;
  return <svg data-tally={count} viewBox={`0 0 ${Math.max(32, (groups + (remainder ? 1 : 0)) * 34)} 28`} className="h-7 w-auto max-w-full" role="img" aria-label={`${count} tally marks, grouped in fives`}>
    {Array.from({ length: groups }, (_, i) => <g key={i} data-tally-group={5} transform={`translate(${i * 34} 0)`} stroke="#334155" strokeWidth={2}>{[6, 12, 18, 24].map(x => <line key={x} x1={x} y1={4} x2={x} y2={24} />)}<line x1={3} y1={24} x2={27} y2={4} /></g>)}
    <g data-tally-remainder={remainder} transform={`translate(${groups * 34} 0)`} stroke="#334155" strokeWidth={2}>{Array.from({ length: remainder }, (_, i) => <line key={i} x1={6 + i * 6} y1={4} x2={6 + i * 6} y2={24} />)}</g>
  </svg>;
}
function Thumb({ children }: { children: React.ReactNode }) {
  return <svg viewBox="0 0 120 60" className="h-14 w-auto" role="img" aria-hidden="true">{children}</svg>;
}
const tallyFarm = [
  { colour: 'White', count: 4, body: '#f1f5f9', stroke: '#94a3b8' },
  { colour: 'Brown', count: 8, body: '#b45309', stroke: '#78350f' },
  { colour: 'Black', count: 5, body: '#1e293b', stroke: '#0f172a' },
];
function Chicken({ body, stroke }: { body: string; stroke: string }) {
  return <svg viewBox="0 0 40 40" className="h-9 w-9 animate-[chickenIn_.4s_ease-out]" aria-hidden="true">
    <ellipse cx={20} cy={25} rx={13} ry={10} fill={body} stroke={stroke} strokeWidth={1.5} />
    <circle cx={29} cy={13} r={6} fill={body} stroke={stroke} strokeWidth={1.5} />
    <path d="M34 12 L39 14 L34 16 Z" fill="#f59e0b" /><circle cx={30} cy={12} r={1.2} fill="#0f172a" />
    <path d="M27 7 q2 -4 4 0" fill="#ef4444" stroke="#ef4444" strokeWidth={1.5} />
    <path d="M17 35 v4 M23 35 v4" stroke="#f59e0b" strokeWidth={2} />
  </svg>;
}
function TallyAnimation() {
  const max = Math.max(...tallyFarm.map(f => f.count));
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setStep(max); return; }
    const id = setInterval(() => setStep(n => (n >= max + 3 ? 0 : n + 1)), 700);
    return () => clearInterval(id);
  }, [max]);
  return <div className="grid grid-cols-3 gap-3">
    {tallyFarm.map(f => {
      const shown = Math.min(step, f.count);
      return <div key={f.colour} className="rounded-xl border border-slate-200 p-3 text-center">
        <p className="font-bold text-slate-900">{f.colour}</p>
        <div className="flex min-h-[5.5rem] flex-wrap content-start justify-center gap-1 py-2">{Array.from({ length: shown }, (_, i) => <Chicken key={i} body={f.body} stroke={f.stroke} />)}</div>
        <div className="flex min-h-8 justify-center border-t border-slate-200 pt-2">{shown > 0 && <Tally count={shown} />}</div>
        <p className="mt-1 text-sm text-slate-600">{shown} of {f.count}</p>
      </div>;
    })}
  </div>;
}
function BarGraph() {
  return <Figure title="Chickens in the kraal by colour" caption="White: 4 chickens; brown: 7; black: 9. The bars have gaps because the colours are separate groups.">
    {[0, 2, 4, 6, 8, 10].map(n => <g key={n}><path d={`M80 ${270 - n * 20} H500`} stroke="#cbd5e1" /><text x={66} y={275 - n * 20} textAnchor="end" fontSize={14}>{n}</text></g>)}
    <path d="M80 65 V270 H505" fill="none" stroke="#334155" strokeWidth={2} />
    {survey.map((item, i) => <g key={item.category}><rect data-bar-count={item.count} x={125 + i * 130} y={270 - item.count * 20} width={70} height={item.count * 20} rx={3} fill={item.colour} /><text x={160 + i * 130} y={260 - item.count * 20} textAnchor="middle" fontSize={15} fontWeight={700}>{item.count}</text><text x={160 + i * 130} y={296} textAnchor="middle" fontSize={15}>{item.category}</text></g>)}
    <text x={290} y={326} textAnchor="middle" fontSize={15}>Chicken colour</text><text transform="translate(24 170) rotate(-90)" textAnchor="middle" fontSize={15}>Number of chickens</text>
  </Figure>;
}
function LineGraph({ straight }: { straight: boolean }) {
  const points = straight ? straightData : lineData;
  const xMax = straight ? 4 : 6, yMin = straight ? 0 : 40, yMax = straight ? 8 : 60;
  const x = (value: number) => 80 + value / xMax * 420;
  const y = (value: number) => 270 - (value - yMin) / (yMax - yMin) * 200;
  const yTicks = straight ? [0, 2, 4, 6, 8] : [40, 45, 50, 55, 60];
  const xTicks = straight ? [0, 1, 2, 3, 4] : [0, 2, 4, 6];
  return <Figure title={straight ? 'Straight-line graph: distance and time' : 'Line graph: water temperature and time'} caption={straight ? 'Plot (1, 2), (2, 4), (3, 6) and (4, 8). The points lie on a straight line; at 3 s, the distance is 6 cm.' : 'The example temperature falls from 60 °C to 42 °C. Adjacent readings are joined in time order; this line is not a single straight line.'}>
    {yTicks.map(n => <g key={n}><path d={`M80 ${y(n)} H500`} stroke="#cbd5e1" /><text x={67} y={y(n) + 5} textAnchor="end" fontSize={14}>{n}</text></g>)}
    {xTicks.map(n => <g key={n}><path d={`M${x(n)} 70 V270`} stroke="#e2e8f0" /><text x={x(n)} y={295} textAnchor="middle" fontSize={14}>{n}</text></g>)}
    <path d="M80 60 V270 H510" fill="none" stroke="#334155" strokeWidth={2} />
    <polyline points={points.map(p => `${x(p.x)},${y(p.y)}`).join(' ')} fill="none" stroke="#0284c7" strokeWidth={3} />
    {points.map(p => <path key={p.x} data-point={`${p.x},${p.y}`} d={`M${x(p.x) - 4} ${y(p.y) - 4} l8 8 M${x(p.x) + 4} ${y(p.y) - 4} l-8 8`} stroke="#0f172a" strokeWidth={2} />)}
    <text x={290} y={326} textAnchor="middle" fontSize={15}>{straight ? 'Time (s)' : 'Time (min)'}</text><text transform="translate(24 170) rotate(-90)" textAnchor="middle" fontSize={15}>{straight ? 'Distance (cm)' : 'Temperature (°C)'}</text>
  </Figure>;
}
function PieChart() {
  let angle = -Math.PI / 2;
  return <Figure title="Chickens in the kraal: parts of one whole" caption="All 20 chickens make one whole: white 20% (72°), brown 35% (126°), black 45% (162°). The angles add up to 360°.">
    {survey.map(item => {
      const next = angle + item.count / total * 2 * Math.PI;
      const path = `M175 180 L${175 + 110 * Math.cos(angle)} ${180 + 110 * Math.sin(angle)} A110 110 0 ${next - angle > Math.PI ? 1 : 0} 1 ${175 + 110 * Math.cos(next)} ${180 + 110 * Math.sin(next)} Z`;
      const mid = (angle + next) / 2; angle = next;
      return <g key={item.category}><path data-sector-angle={item.count * 360 / total} d={path} fill={item.colour} stroke="#fff" strokeWidth={2} /><text x={175 + 73 * Math.cos(mid)} y={185 + 73 * Math.sin(mid)} textAnchor="middle" fontSize={17} fontWeight={700} fill="white">{item.count * 100 / total}%</text></g>;
    })}
    {survey.map((item, i) => <g key={item.category}><rect x={320} y={115 + i * 55} width={16} height={16} rx={3} fill={item.colour} /><text x={347} y={128 + i * 55} fontSize={16}>{item.category}: {item.count} chickens</text><text x={347} y={150 + i * 55} fontSize={14}>{item.count * 100 / total}% · {item.count * 360 / total}°</text></g>)}
  </Figure>;
}

export const DataPresentationLesson: React.FC = () => <div className="not-prose space-y-6">
  <style>{`@keyframes chickenIn{from{opacity:0;transform:scale(.3) translateY(8px)}to{opacity:1;transform:none}}`}</style>
  <Card title="">
    <p className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">Data presentation <span className="font-bold text-slate-600">simply means:</span></p>
    <ul className="list-disc space-y-1 pl-6">
      <li>taking your raw data,</li>
      <li>arranging it in a neat way,</li>
      <li>so that anyone can look at it and understand it quickly.</li>
    </ul>
    <p><strong>So what is data?</strong> Data is simply the numbers you have after counting, or the text you have after reading. It is raw, meaning it does not make sense yet. For example, you count the chickens in your kraal and write: white 4, brown 7, black 9. Those numbers are data.</p>
    <p>A list of numbers is hard to read. So we show data in a neat way, and there are six ways to do it:</p>
    <Table headers={['Way', 'How it looks', 'Use it when you are...']} rows={[
      [<strong key="a">Tally</strong>, <Tally key="a" count={7} />, 'counting things one by one'],
      [<strong key="b">Table</strong>, <Thumb key="b"><rect x={6} y={8} width={108} height={44} fill="none" stroke="#334155" strokeWidth={2} /><path d="M6 22 H114 M6 37 H114 M48 8 V52" stroke="#334155" strokeWidth={2} /></Thumb>, 'writing the counts down neatly'],
      [<strong key="c">Bar graph</strong>, <Thumb key="c"><path d="M12 6 V54 H112" fill="none" stroke="#334155" strokeWidth={2} /><rect x={24} y={34} width={18} height={20} fill="#94a3b8" /><rect x={52} y={24} width={18} height={30} fill="#b45309" /><rect x={80} y={12} width={18} height={42} fill="#1e293b" /></Thumb>, 'comparing separate groups, like white, brown and black'],
      [<strong key="d">Pie chart</strong>, <Thumb key="d"><circle cx={60} cy={30} r={25} fill="#94a3b8" /><path d="M60 30 L60 5 A25 25 0 0 1 82 42 Z" fill="#b45309" /><path d="M60 30 L82 42 A25 25 0 0 1 38 42 Z" fill="#1e293b" /></Thumb>, 'showing how a whole is shared out'],
      [<strong key="e">Straight-line graph</strong>, <Thumb key="e"><path d="M12 6 V54 H112" fill="none" stroke="#334155" strokeWidth={2} /><path d="M16 50 L106 10" stroke="#0284c7" strokeWidth={3} /></Thumb>, 'showing two things that go up together steadily'],
      [<strong key="f">Line graph</strong>, <Thumb key="f"><path d="M12 6 V54 H112" fill="none" stroke="#334155" strokeWidth={2} /><polyline points="16,12 40,26 64,34 90,38 106,46" fill="none" stroke="#0284c7" strokeWidth={3} /></Thumb>, 'showing something that changes over time'],
    ]} />
  </Card>
  <Card title="Tallies">
    <p>A tally is how you count things one by one without losing count. For every chicken you see, you draw one upright line.</p>
    <ul className="list-disc space-y-1 pl-6">
      <li>Draw four upright lines.</li>
      <li>On the fifth chicken, draw a line across the four.</li>
      <li>That is one group of five. Start a new group for the next chicken.</li>
    </ul>
    <p>Watch it happen. There are 4 white chickens, 8 brown chickens and 5 black chickens. Each chicken gets one line.</p>
    <TallyAnimation />
  </Card>
  <Card title="Tables">
    <p>Put the counts in a table. The total for each colour is called the <strong>frequency</strong>, which just means "how many".</p>
    <Table headers={['Chicken colour', 'Tally', 'Frequency']} rows={survey.map(item => [item.category, <Tally key={item.category} count={item.count} />, item.count])} />
  </Card>
  <Card title="Bar Graphs">
    <p>Show the same numbers as bars. The taller the bar, the more chickens.</p>
    <BarGraph />
    <p><strong>To draw one:</strong> write a title, put the colours along the bottom, put the numbers up the side starting at zero in equal steps, draw bars of equal width with gaps, and label both lines.</p>
    <p className="text-2xl font-bold text-slate-900">How to read the graph</p>
    <ul className="list-disc space-y-1 pl-6">
      <li>The tallest bar is black. So black has the most chickens (9).</li>
      <li>The shortest bar is white. So white has the fewest chickens (4).</li>
      <li>How many more black than white? Take away: 9 − 4 = 5 more.</li>
      <li>How many chickens in all? Add them up: 4 + 7 + 9 = 20.</li>
    </ul>
  </Card>
  <Card title="Pie Charts">
    <p>A pie chart is a circle cut into slices like a loaf of bread. The whole circle is all your chickens, and each slice is one colour. The whole circle is <strong>360°</strong>.</p>
    <PieChart />
    <p className="rounded-xl bg-sky-50 p-3 font-semibold">Angle = number in the group ÷ total × 360°</p>
    <Table headers={['Colour', 'Number', 'Angle of the slice']} rows={survey.map(item => [item.category, item.count, `${item.count} ÷ ${total} × 360° = ${item.count * 360 / total}°`])} />
    <p><strong>To draw one:</strong> work out the angles and check they add up to 360°. Draw a circle with a compass, draw a line from the centre to the edge, then use a protractor to measure each angle one after the other. Label the slices and give a title.</p>
    <p className="text-2xl font-bold text-slate-900">How to read the pie chart</p>
    <ul className="list-disc space-y-1 pl-6">
      <li>The biggest slice is black (45%). So black has the most chickens.</li>
      <li>The smallest slice is white (20%). So white has the fewest.</li>
      <li>Brown and white together? Add the slices: 35% + 20% = 55%.</li>
    </ul>
  </Card>
  <Card title="Straight-Line Graphs">
    <p>When two things go up together at a steady rate, like a child walking at the same speed, the graph is a straight line.</p>
    <Table headers={['Time (s)', 'Distance (cm)']} rows={straightData.map(p => [p.x, p.y])} />
    <LineGraph straight />
    <p><strong>To draw one:</strong> write a title, label both lines with units, choose an equal scale, plot each pair with a small cross, then draw one straight line with a ruler through the crosses.</p>
    <p className="text-2xl font-bold text-slate-900">How to read the straight-line graph</p>
    <ul className="list-disc space-y-1 pl-6">
      <li>Start at 3 s on the bottom. Go up to the line, then go across to the side.</li>
      <li>You land on 6 cm. So at 3 s the distance is 6 cm.</li>
      <li>Look at the pattern: every 1 s, the distance goes up by 2 cm.</li>
    </ul>
  </Card>
  <Card title="Line Graphs">
    <p>Use a line graph when something changes over time, like hot water cooling on a table.</p>
    <Table headers={['Time (min)', 'Water temperature (°C)']} rows={lineData.map(p => [p.x, p.y])} />
    <LineGraph straight={false} />
    <p><strong>To draw one:</strong> time goes along the bottom, what you measured goes up the side. Plot each reading with a cross and join them in order from left to right. The line can bend.</p>
    <p className="text-2xl font-bold text-slate-900">How to read the line graph</p>
    <ul className="list-disc space-y-1 pl-6">
      <li>The line goes down. So the water is getting cooler.</li>
      <li>It started at 60 °C and ended at 42 °C. That is 60 − 42 = 18 °C lower.</li>
      <li>The line drops most in the first 2 minutes (8 °C). So the water cooled fastest at the start.</li>
    </ul>
  </Card>
  <Card title="Which One Do I Use in the Exam?">
    <ul className="list-disc space-y-2 pl-6">
      <li>Counting separate groups: tally, table, then <strong>bar graph</strong>.</li>
      <li>Sharing out a whole: <strong>pie chart</strong>.</li>
      <li>Two things going up steadily together: <strong>straight-line graph</strong>.</li>
      <li>Change over time: <strong>line graph</strong>.</li>
    </ul>
    <p>Before handing in, check: a title, labels with units on both lines, an equal scale, and pie-chart angles that add up to 360°.</p>
  </Card>
</div>;

export default DataPresentationLesson;
