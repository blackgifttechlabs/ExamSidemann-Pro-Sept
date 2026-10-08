import React from 'react';

// Shared by Form 3 and Form 4 Combined Science. Scope follows the supplied
// document points: tallies, tables, bar graphs, straight-line graphs, pie charts
// and line graphs; construction, interpretation and analysis of these displays.
const survey = [
  { category: 'White', count: 4, colour: '#64748b' },
  { category: 'Purple', count: 7, colour: '#7c3aed' },
  { category: 'Pink', count: 9, colour: '#db2777' },
];
const total = survey.reduce((sum, item) => sum + item.count, 0);
const straightData = [{ x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 6 }, { x: 4, y: 8 }];
const lineData = [{ x: 0, y: 60 }, { x: 2, y: 52 }, { x: 4, y: 46 }, { x: 6, y: 42 }];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><h3 className="mb-4 text-xl font-bold text-slate-900">{title}</h3><div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j} className="border border-slate-200 p-3 align-middle">{v}</td>)}</tr>)}</tbody></table></div>;
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
function BarGraph() {
  return <Figure title="Petal colours in an example survey" caption="White: 4 flowers; purple: 7; pink: 9. Equal-width bars have gaps because the colours are separate categories.">
    {[0, 2, 4, 6, 8, 10].map(n => <g key={n}><path d={`M80 ${270 - n * 20} H500`} stroke="#cbd5e1" /><text x={66} y={275 - n * 20} textAnchor="end" fontSize={14}>{n}</text></g>)}
    <path d="M80 65 V270 H505" fill="none" stroke="#334155" strokeWidth={2} />
    {survey.map((item, i) => <g key={item.category}><rect data-bar-count={item.count} x={125 + i * 130} y={270 - item.count * 20} width={70} height={item.count * 20} rx={3} fill={item.colour} /><text x={160 + i * 130} y={260 - item.count * 20} textAnchor="middle" fontSize={15} fontWeight={700}>{item.count}</text><text x={160 + i * 130} y={296} textAnchor="middle" fontSize={15}>{item.category}</text></g>)}
    <text x={290} y={326} textAnchor="middle" fontSize={15}>Petal colour</text><text transform="translate(24 170) rotate(-90)" textAnchor="middle" fontSize={15}>Number of flowers</text>
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
  return <Figure title="Petal colours: parts of the same total" caption="The 20 flowers form one whole: white 20% (72°), purple 35% (126°), pink 45% (162°). Sector angles total 360°.">
    {survey.map(item => {
      const next = angle + item.count / total * 2 * Math.PI;
      const path = `M175 180 L${175 + 110 * Math.cos(angle)} ${180 + 110 * Math.sin(angle)} A110 110 0 ${next - angle > Math.PI ? 1 : 0} 1 ${175 + 110 * Math.cos(next)} ${180 + 110 * Math.sin(next)} Z`;
      const mid = (angle + next) / 2; angle = next;
      return <g key={item.category}><path data-sector-angle={item.count * 360 / total} d={path} fill={item.colour} stroke="#fff" strokeWidth={2} /><text x={175 + 73 * Math.cos(mid)} y={185 + 73 * Math.sin(mid)} textAnchor="middle" fontSize={17} fontWeight={700} fill="white">{item.count * 100 / total}%</text></g>;
    })}
    {survey.map((item, i) => <g key={item.category}><rect x={320} y={115 + i * 55} width={16} height={16} rx={3} fill={item.colour} /><text x={347} y={128 + i * 55} fontSize={16}>{item.category}: {item.count} flowers</text><text x={347} y={150 + i * 55} fontSize={14}>{item.count * 100 / total}% · {item.count * 360 / total}°</text></g>)}
  </Figure>;
}

export const DataPresentationLesson: React.FC = () => <div className="not-prose space-y-6">
  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-base leading-relaxed text-slate-800 sm:p-6"><p>Data means the facts or numbers you collect. In this lesson, you will organise data in tallies and tables, then draw bar graphs, straight-line graphs, pie charts and line graphs. You will practise reading values, comparing results and describing what each display shows.</p></div>
  <Card title="Tallies, Tables and Bar Graphs">
    <p><strong>Learning objectives:</strong> present and interpret data using tallies, tables and bar graphs.</p>
    <BarGraph />
    <p>A <strong>tally</strong> records one mark for each item counted. Draw four upright marks, then a fifth mark across them to make a group of five. A <strong>table</strong> organises the categories and their frequencies. A <strong>bar graph</strong> compares separate categories.</p>
    <Table headers={['Petal colour', 'Tally', 'Frequency']} rows={survey.map(item => [item.category, <Tally key={item.category} count={item.count} />, item.count])} />
    <p><strong>Construction:</strong> give the table and graph a title. Put the categories on the horizontal axis and frequency on the vertical axis. Start the frequency scale at zero, use equal intervals, and draw bars with equal widths and gaps. Label both axes and include units where needed.</p>
    <p><strong>Interpretation:</strong> pink is the most common colour (9 flowers); white is the least common (4). There are 5 more pink than white flowers, and 20 flowers altogether.</p>
    <p><strong>Activity:</strong> collect categorical data, record it with tallies, turn the counts into a table and draw a bar graph. Read and compare the frequencies in each display.</p>
    <p><strong>Resources:</strong> multimedia.</p>
    <p><strong>Biology link — types of variation:</strong> draw a bar graph to show counts in separate categories of living organisms, such as petal colour. This applies the same bar-graph skills to biological data.</p>
  </Card>
  <Card title="Straight-Line Graphs">
    <p><strong>Learning objectives:</strong> construct a straight-line graph from appropriate data and interpret it.</p>
    <LineGraph straight />
    <Table headers={['Time (s)', 'Distance (cm)']} rows={straightData.map(p => [p.x, p.y])} />
    <ol className="list-decimal space-y-2 pl-6"><li>Give the graph a title. Label both axes, with units.</li><li>Choose equal scale intervals that use the available graph paper well.</li><li>Plot each pair of values as a small cross in the correct position.</li><li>For data that follows a straight-line pattern, draw a suitable straight line with a ruler. Do not force it through the origin unless the data supports this.</li></ol>
    <p><strong>Interpretation:</strong> read a value by tracing from one axis to the line and then to the other axis. In this example, the distance is 6 cm at 3 s. The distance rises by the same amount for each 1 s increase in time.</p>
    <p><strong>Activity:</strong> draw a straight-line graph from given data, then answer questions about values and the pattern shown.</p>
    <p><strong>Resources:</strong> multimedia.</p>
  </Card>
  <Card title="Pie Charts">
    <p><strong>Learning objectives:</strong> construct a pie chart; interpret and analyse the information it shows.</p>
    <PieChart />
    <p>A <strong>pie chart</strong> shows how categories make up a whole. The complete circle represents the total; its sectors add up to <strong>360°</strong>.</p>
    <p className="rounded-xl bg-sky-50 p-3 font-semibold">Sector angle = category frequency ÷ total frequency × 360°</p>
    <Table headers={['Category', 'Frequency', 'Sector angle']} rows={survey.map(item => [item.category, item.count, `${item.count} ÷ ${total} × 360° = ${item.count * 360 / total}°`])} />
    <ol className="list-decimal space-y-2 pl-6"><li>Add the frequencies to find the total and calculate each sector angle.</li><li>Draw a circle with compasses and mark its centre. Draw a starting radius.</li><li>Use a protractor to measure each sector angle from the next radius.</li><li>Label each sector or provide a clear key; give the chart a title and check the angles total 360°.</li></ol>
    <p><strong>Interpretation and analysis:</strong> compare the sector sizes and read the labels or key. Pink is the largest share (45%); purple is 35%; white is 20%. Purple and white together make up 55% of the survey.</p>
    <p><strong>Activity:</strong> construct a pie chart and explain data presented in pie charts.</p>
    <p><strong>Resources:</strong> multimedia; graph paper, protractors, compasses and ICT tools for the final-level construction work.</p>
  </Card>
  <Card title="Line Graphs">
    <p><strong>Learning objectives:</strong> construct, interpret and analyse line graphs.</p>
    <LineGraph straight={false} />
    <Table headers={['Time (min)', 'Water temperature (°C)']} rows={lineData.map(p => [p.x, p.y])} />
    <p>A <strong>line graph</strong> shows how a value changes across an ordered quantity such as time. Choose a suitable scale, label both axes with units and plot the readings accurately. For this time-series example, join neighbouring readings in time order.</p>
    <p><strong>Interpretation and analysis:</strong> describe the direction of change and compare readings. The temperature falls from 60 °C to 42 °C, a decrease of 18 °C. The largest decrease between recorded points is 8 °C from 0 to 2 minutes. The reading at 4 minutes is 46 °C.</p>
    <p><strong>Activity:</strong> explain information shown in line graphs, then construct a line graph from given data and interpret and analyse it.</p>
    <p><strong>Resources:</strong> multimedia; graph paper, protractors, compasses and ICT tools are listed for the combined final-level pie-chart and line-graph activities.</p>
  </Card>
  <Card title="Final-Level Construction, Interpretation and Analysis">
    <p>Construct both a pie chart and a line graph from suitable given data. Check the scales, labels, plotted readings and sector angles. Use each display to compare results and explain the patterns shown.</p>
    <p><strong>Resources:</strong> graph paper, protractors, compasses and ICT tools.</p>
  </Card>
</div>;

export default DataPresentationLesson;
