import React, { useEffect, useRef, useState } from 'react';

// One lesson shared by Form 3 and Form 4 Combined Science (Physics: Data Presentation).
// Syllabus Level 2 (Forms 3-4): pie charts, line graphs, interpretation and analysis.

// ──────────────────────────────────────────────────────────────────────────────
// Small building blocks
// ──────────────────────────────────────────────────────────────────────────────
const IntroBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
    <p className="text-base font-medium leading-relaxed text-slate-800">{children}</p>
  </div>
);

const Heading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="mt-2 text-xl font-bold text-slate-900">{children}</h3>
);

const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-base leading-relaxed text-slate-700">{children}</p>
);

const Point: React.FC<{ n: number; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <div>
    <h4 className="mb-1 text-lg font-bold text-slate-900">{n}. {title}</h4>
    <div className="space-y-1 pl-5 text-base leading-relaxed text-slate-700">{children}</div>
  </div>
);

const Panel: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    {title && <h4 className="mb-2 font-bold text-slate-900">{title}</h4>}
    {children}
  </div>
);

const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
};

// Steps through 0..count-1 on its own, with pause / back / next
const useStepper = (count: number, playing: boolean, ms = 2200) => {
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!playing || !auto) return;
    const iv = setInterval(() => setStep((s) => (s + 1) % (count + 1)), ms);
    return () => clearInterval(iv);
  }, [playing, auto, count, ms]);
  const idx = Math.min(step, count - 1);
  const go = (i: number) => { setAuto(false); setStep(Math.max(0, Math.min(count - 1, i))); };
  return { idx, auto, setAuto, go };
};

const Controls: React.FC<{ idx: number; count: number; auto: boolean; setAuto: (f: (a: boolean) => boolean) => void; go: (i: number) => void }> = ({ idx, count, auto, setAuto, go }) => (
  <div className="mt-3 flex items-center gap-2">
    <button onClick={() => go(idx - 1)} aria-label="Previous step" className="h-8 w-8 rounded-full border border-slate-300 text-xs text-slate-700">◀</button>
    <button onClick={() => setAuto((a) => !a)} aria-label={auto ? 'Pause' : 'Play'} className="h-8 w-8 rounded-full bg-slate-800 text-xs text-white">{auto ? '❚❚' : '▶'}</button>
    <button onClick={() => go(idx + 1)} aria-label="Next step" className="h-8 w-8 rounded-full border border-slate-300 text-xs text-slate-700">▶</button>
    <input type="range" min={0} max={count - 1} value={idx} onChange={(e) => go(Number(e.target.value))} className="h-1 flex-1 cursor-pointer accent-slate-700" aria-label="Step" />
    <span className="whitespace-nowrap text-sm tabular-nums text-slate-500">{idx + 1} / {count}</span>
  </div>
);

const Caption: React.FC<{ idx: number; children: React.ReactNode }> = ({ idx, children }) => (
  <div key={idx} className="min-h-[3.5rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-800" style={{ animation: 'dpFade .35s ease-out' }}>
    <span className="mr-1.5 font-bold text-slate-900">Step {idx + 1}.</span>{children}
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// 1. Choosing the right display
// ──────────────────────────────────────────────────────────────────────────────
const DisplayCard: React.FC<{ title: string; use: string; example: string; rules: string[]; children: React.ReactNode }> = ({ title, use, example, rules, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex h-24 items-center justify-center rounded-lg bg-slate-50 p-2">{children}</div>
    <h4 className="mt-3 font-bold text-slate-900">{title}</h4>
    <p className="mt-1 text-base leading-relaxed text-slate-700"><strong>Use it for:</strong> {use}</p>
    <p className="mt-1 text-base leading-relaxed text-slate-700"><strong>Example:</strong> {example}</p>
    <p className="mt-3 text-sm font-bold uppercase tracking-wider text-slate-600">How to draw it</p>
    <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-relaxed text-slate-700">
      {rules.map((r) => <li key={r}>{r}</li>)}
    </ul>
  </div>
);

const DisplayCards: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <DisplayCard
      title="Table"
      use="exact numbers, neatly organised."
      example="voltage and current readings from a circuit."
      rules={[
        'Give it a title.',
        'Write the unit in the column heading, like Voltage (V).',
        'Use the same number of decimal places in a column.',
        'Put the thing you change in the first column.',
      ]}
    >
      <svg viewBox="0 0 120 80" className="h-full text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="A table">
        <rect x="10" y="8" width="100" height="64" rx="3" />
        <rect x="10" y="8" width="100" height="16" rx="3" fill="currentColor" fillOpacity="0.15" />
        <path d="M10 40H110M10 56H110M43 8V72M77 8V72" />
      </svg>
    </DisplayCard>
    <DisplayCard
      title="Pie chart"
      use="showing how a whole is shared out."
      example="where Zimbabwe's electricity comes from."
      rules={[
        'The slices must add up to 360°.',
        'Angle = (value ÷ total) × 360°.',
        'Start at 12 o’clock and go clockwise.',
        'Label every slice.',
      ]}
    >
      <svg viewBox="0 0 120 80" className="h-full text-slate-500" strokeWidth="1.5" role="img" aria-label="A pie chart">
        <circle cx="60" cy="40" r="32" fill="currentColor" fillOpacity="0.2" stroke="currentColor" />
        <path d="M60 40V8A32 32 0 0 1 90.4 50Z" fill="currentColor" fillOpacity="0.55" stroke="currentColor" />
        <path d="M60 40L90.4 50A32 32 0 0 1 40 69.3Z" fill="currentColor" fillOpacity="0.35" stroke="currentColor" />
      </svg>
    </DisplayCard>
    <DisplayCard
      title="Bar graph"
      use="comparing separate groups."
      example="rainfall in each province."
      rules={[
        'Bars have the same width and equal gaps.',
        'Groups go on the x-axis, values on the y-axis.',
        'Start the y-axis at 0.',
        'Label both axes and add a title.',
      ]}
    >
      <svg viewBox="0 0 120 80" className="h-full text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="A bar graph">
        <path d="M16 8V68H112" />
        <rect x="26" y="38" width="14" height="30" fill="currentColor" fillOpacity="0.4" />
        <rect x="50" y="22" width="14" height="46" fill="currentColor" fillOpacity="0.4" />
        <rect x="74" y="46" width="14" height="22" fill="currentColor" fillOpacity="0.4" />
        <rect x="96" y="30" width="10" height="38" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </DisplayCard>
    <DisplayCard
      title="Line graph"
      use="showing how one thing changes when another changes."
      example="how a spring stretches as you add weight."
      rules={[
        'The thing you change goes on the x-axis.',
        'The thing you measure goes on the y-axis.',
        'Plot each point with a small cross.',
        'Join the crosses with a straight line or a smooth curve.',
      ]}
    >
      <svg viewBox="0 0 120 80" className="h-full text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" role="img" aria-label="A line graph">
        <path d="M16 8V68H112" />
        <path d="M24 58L50 44L76 34L102 16" strokeWidth="2" />
        <path d="M20 54l8 8M28 54l-8 8M46 40l8 8M54 40l-8 8M72 30l8 8M80 30l-8 8M98 12l8 8M106 12l-8 8" />
      </svg>
    </DisplayCard>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// 2. Table example
// ──────────────────────────────────────────────────────────────────────────────
const TableExample: React.FC = () => (
  <Panel title="A good results table">
    <div className="overflow-x-auto">
      <table className="w-full max-w-md border-collapse text-base text-slate-800">
        <caption className="mb-2 text-left text-base font-semibold text-slate-700">Table 1: Current through a resistor at different voltages</caption>
        <thead className="bg-slate-100">
          <tr>
            <th className="border border-slate-300 p-2 text-left">Voltage (V)</th>
            <th className="border border-slate-300 p-2 text-left">Current (A)</th>
          </tr>
        </thead>
        <tbody>
          {[['1.0', '0.20'], ['2.0', '0.40'], ['3.0', '0.60'], ['4.0', '0.80']].map(([v, i]) => (
            <tr key={v}>
              <td className="border border-slate-300 p-2">{v}</td>
              <td className="border border-slate-300 p-2">{i}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-slate-700">
      <li>The table has a title.</li>
      <li>The unit is in the heading, so you do not write it beside every number.</li>
      <li>Every number in a column has the same number of decimal places.</li>
      <li>The voltage (the thing we changed) is in the first column.</li>
    </ul>
  </Panel>
);

// ──────────────────────────────────────────────────────────────────────────────
// 3. Pie chart demo (animated, slice by slice)
// ──────────────────────────────────────────────────────────────────────────────
const RAIN: [string, number, string][] = [
  ['Jan', 40, '#64748b'],
  ['Feb', 50, '#94a3b8'],
  ['Mar', 45, '#475569'],
  ['Apr', 35, '#a8b3c4'],
  ['May', 20, '#334155'],
  ['Jun', 10, '#cbd5e1'],
];
const RAIN_TOTAL = RAIN.reduce((sum, r) => sum + r[1], 0);

const PieDemo: React.FC = () => {
  const { ref, visible } = useInView();
  const count = RAIN.length + 2; // total, 6 slices, finished
  const { idx, auto, setAuto, go } = useStepper(count, visible, 2600);
  const cx = 150, cy = 130, r = 90;
  const point = (deg: number, rad: number) => {
    const a = ((deg - 90) * Math.PI) / 180; // 0° is 12 o'clock, going clockwise
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };
  let start = 0;
  const slices = RAIN.map(([name, value, colour], i) => {
    const angle = (value / RAIN_TOTAL) * 360;
    const [x1, y1] = point(start, r);
    const [x2, y2] = point(start + angle, r);
    const [lx, ly] = point(start + angle / 2, r + 24);
    const shown = idx >= i + 1;
    const current = idx === i + 1;
    const node = (
      <g key={name} style={{ opacity: shown ? 1 : 0, transition: 'opacity .4s' }}>
        <path
          d={`M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`}
          fill={colour}
          stroke={current ? '#0f172a' : 'white'}
          strokeWidth={current ? 3 : 2}
        />
        <text x={lx.toFixed(1)} y={ly.toFixed(1)} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-slate-800">{name} {Math.round((value / RAIN_TOTAL) * 1000) / 10}%</text>
      </g>
    );
    start += angle;
    return node;
  });

  const cur = idx >= 1 && idx <= RAIN.length ? RAIN[idx - 1] : null;
  const text =
    idx === 0
      ? `Add up all the values. 40 + 50 + 45 + 35 + 20 + 10 = ${RAIN_TOTAL} mm. This is the whole circle, which is 360°.`
      : cur
        ? `${cur[0]}: ${cur[1]} ÷ ${RAIN_TOTAL} × 360° = ${(cur[1] / RAIN_TOTAL) * 360}°. Draw this slice with a protractor.`
        : 'All the slices fit together. 72° + 90° + 81° + 63° + 36° + 18° = 360°. Always check that your angles add up to 360°.';

  return (
    <div ref={ref}>
      <Panel title="Pie chart: rainfall in six months">
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <svg viewBox="0 0 300 260" className="mx-auto block h-auto w-full max-w-sm" role="img" aria-label="A pie chart being drawn slice by slice">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="2" />
            {slices}
          </svg>
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-base text-slate-800">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-300 p-2 text-left">Month</th>
                    <th className="border border-slate-300 p-2 text-left">Rainfall (mm)</th>
                    <th className="border border-slate-300 p-2 text-left">Angle</th>
                  </tr>
                </thead>
                <tbody>
                  {RAIN.map(([name, value], i) => (
                    <tr key={name} className={idx === i + 1 ? 'bg-slate-100 font-semibold' : ''}>
                      <td className="border border-slate-300 p-2">{name}</td>
                      <td className="border border-slate-300 p-2">{value}</td>
                      <td className="border border-slate-300 p-2">{(value / RAIN_TOTAL) * 360}°</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td className="border border-slate-300 p-2">Total</td>
                    <td className="border border-slate-300 p-2">{RAIN_TOTAL}</td>
                    <td className="border border-slate-300 p-2">360°</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Caption idx={idx}>{text}</Caption>
          </div>
        </div>
        <Controls idx={idx} count={count} auto={auto} setAuto={setAuto} go={go} />
      </Panel>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// 4. Line graph demo (animated plotting, then the gradient)
// ──────────────────────────────────────────────────────────────────────────────
const PTS: [number, number][] = [[0, 0], [2, 10], [4, 20], [6, 30], [8, 40]];
const X = (t: number) => 50 + 35 * t;
const Y = (d: number) => 220 - 4.75 * d;

const LineDemo: React.FC = () => {
  const { ref, visible } = useInView();
  const count = 9;
  const { idx, auto, setAuto, go } = useStepper(count, visible, 2600);
  const captions = [
    'Draw the axes. Time is the thing we change, so it goes on the x-axis. Distance is the thing we measure, so it goes on the y-axis. Write the units.',
    'Choose an even scale. Here every 2 s is the same width, and every 10 m is the same height. Then plot the first point (0, 0) with a small cross.',
    'Plot (2 s, 10 m). Go along to 2 s, then up to 10 m, and make a cross.',
    'Plot (4 s, 20 m).',
    'Plot (6 s, 30 m).',
    'Plot (8 s, 40 m). Now every result is on the graph.',
    'Join the crosses. The points are in a straight line, so use a ruler and draw one straight line through them.',
    'To find the gradient, pick two points far apart on the line, such as (2, 10) and (8, 40). Draw a right-angled triangle between them.',
    'Gradient = rise ÷ run = (40 − 10) ÷ (8 − 2) = 30 ÷ 6 = 5. The unit is m/s, so the gradient of a distance–time graph is the speed: 5 m/s.',
  ];
  const plotted = Math.max(0, Math.min(PTS.length, idx));
  return (
    <div ref={ref}>
      <Panel title="Line graph: distance of a trolley against time">
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <svg viewBox="0 0 360 270" className="mx-auto block h-auto w-full max-w-md" role="img" aria-label="A line graph being drawn step by step">
            {/* grid */}
            {[0, 2, 4, 6, 8].map((t) => <line key={`gx${t}`} x1={X(t)} y1={Y(0)} x2={X(t)} y2={Y(40)} stroke="#e2e8f0" />)}
            {[0, 10, 20, 30, 40].map((d) => <line key={`gy${d}`} x1={X(0)} y1={Y(d)} x2={X(8)} y2={Y(d)} stroke="#e2e8f0" />)}
            {/* axes */}
            <path d={`M${X(0)} ${Y(42)}V${Y(0)}H${X(8.6)}`} fill="none" stroke="#0f172a" strokeWidth="2" />
            {[0, 2, 4, 6, 8].map((t) => <text key={`lx${t}`} x={X(t)} y={Y(0) + 16} textAnchor="middle" fontSize="11" className="fill-slate-700">{t}</text>)}
            {[0, 10, 20, 30, 40].map((d) => <text key={`ly${d}`} x={X(0) - 8} y={Y(d) + 4} textAnchor="end" fontSize="11" className="fill-slate-700">{d}</text>)}
            <text x={X(4)} y={Y(0) + 38} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-slate-800">Time (s)</text>
            <text x="14" y={Y(20)} textAnchor="middle" fontSize="12" fontWeight="700" transform={`rotate(-90 14 ${Y(20)})`} className="fill-slate-800">Distance (m)</text>
            {/* line */}
            <path d={`M${X(0)} ${Y(0)} L${X(8)} ${Y(40)}`} stroke="#334155" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={idx >= 6 ? 0 : 1} style={{ transition: 'stroke-dashoffset .9s ease-out' }} />
            {/* crosses */}
            {PTS.map(([t, d], i) => (
              <g key={`p${i}`} style={{ opacity: plotted > i && idx >= 1 ? 1 : 0, transition: 'opacity .3s' }} stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round">
                <path d={`M${X(t) - 5} ${Y(d) - 5}l10 10M${X(t) + 5} ${Y(d) - 5}l-10 10`} />
              </g>
            ))}
            {/* gradient triangle */}
            <g style={{ opacity: idx >= 7 ? 1 : 0, transition: 'opacity .5s' }}>
              <path d={`M${X(2)} ${Y(10)} H${X(8)} V${Y(40)}`} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" />
              <text x={X(5)} y={Y(10) + 16} textAnchor="middle" fontSize="12" fontWeight="700" className="fill-slate-800">run = 6 s</text>
              <text x={X(8) + 6} y={Y(25)} fontSize="12" fontWeight="700" className="fill-slate-800">rise = 30 m</text>
            </g>
          </svg>
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-base text-slate-800">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border border-slate-300 p-2 text-left">Time (s)</th>
                    <th className="border border-slate-300 p-2 text-left">Distance (m)</th>
                  </tr>
                </thead>
                <tbody>
                  {PTS.map(([t, d], i) => (
                    <tr key={t} className={idx >= 1 && idx === i + 1 ? 'bg-slate-100 font-semibold' : ''}>
                      <td className="border border-slate-300 p-2">{t}</td>
                      <td className="border border-slate-300 p-2">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Caption idx={idx}>{captions[idx]}</Caption>
          </div>
        </div>
        <Controls idx={idx} count={count} auto={auto} setAuto={setAuto} go={go} />
      </Panel>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// 5. Shapes of graphs: what they mean
// ──────────────────────────────────────────────────────────────────────────────
const SHAPES: { title: string; path: string; meaning: string; example: string }[] = [
  { title: 'Straight line through (0, 0)', path: 'M20 66L100 18', meaning: 'The two things are directly proportional. If one doubles, the other doubles.', example: 'A spring that stretches more as you add weight.' },
  { title: 'Straight line up, not through (0, 0)', path: 'M20 50L100 14', meaning: 'It goes up steadily, but it starts above zero.', example: 'A spring that already had some length at the start.' },
  { title: 'Flat (horizontal) line', path: 'M20 40H100', meaning: 'There is no change. The y-value stays the same.', example: 'A car on a distance–time graph that has stopped.' },
  { title: 'Straight line going down', path: 'M20 16L100 62', meaning: 'It goes down steadily. The y-value decreases as x increases.', example: 'Water running out of a tank at a steady rate.' },
  { title: 'Curve that rises then flattens', path: 'M20 66C40 28 60 20 100 18', meaning: 'It rises fast, then slows down and levels off. It is reaching a maximum.', example: 'A falling object reaching its top speed (terminal velocity).' },
  { title: 'Curve that rises, peaks, then falls', path: 'M20 66C40 60 50 14 62 14C74 14 78 50 84 66', meaning: 'There is a best value in the middle. After the peak the y-value drops.', example: 'An enzyme working fastest at its best temperature.' },
];

const ShapesGuide: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {SHAPES.map((s) => (
      <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <svg viewBox="0 0 120 80" className="h-24 w-full rounded-lg bg-slate-50 text-slate-600" fill="none" role="img" aria-label={s.title}>
          <path d="M12 6V70H112" stroke="currentColor" strokeWidth="1.5" />
          <path d={s.path} stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray={1} style={{ animation: 'dpDraw 1.4s ease-out forwards', strokeDashoffset: 1 }} />
        </svg>
        <h4 className="mt-3 font-bold text-slate-900">{s.title}</h4>
        <p className="mt-1 text-base leading-relaxed text-slate-700"><strong>It means:</strong> {s.meaning}</p>
        <p className="mt-1 text-base leading-relaxed text-slate-700"><strong>Example:</strong> {s.example}</p>
      </div>
    ))}
  </div>
);

// ──────────────────────────────────────────────────────────────────────────────
// 6. Quick check
// ──────────────────────────────────────────────────────────────────────────────
const QUESTIONS: { q: string; a: string }[] = [
  { q: 'Which display is best for comparing the rainfall of ten provinces?', a: 'A bar graph. It compares separate groups.' },
  { q: 'In a pie chart the total is 200 and one slice is 50. What is the angle of the slice?', a: '50 ÷ 200 × 360° = 90°.' },
  { q: 'A straight line goes from (0, 0) to (4, 8). What is the gradient?', a: 'Rise ÷ run = 8 ÷ 4 = 2.' },
  { q: 'A distance–time graph is a flat horizontal line. What is happening?', a: 'The object is not moving. The distance does not change as time passes.' },
  { q: 'Which two things must you always write on the axes of a graph?', a: 'The name of the quantity and its unit, for example Time (s).' },
];

const QuickCheck: React.FC = () => (
  <Panel title="Quick check">
    <div className="space-y-3">
      {QUESTIONS.map((item, i) => (
        <details key={item.q} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-base font-semibold text-slate-900">{i + 1}. {item.q}</summary>
          <p className="mt-2 text-base text-slate-700"><strong>Answer:</strong> {item.a}</p>
        </details>
      ))}
    </div>
  </Panel>
);

// ──────────────────────────────────────────────────────────────────────────────
// The lesson
// ──────────────────────────────────────────────────────────────────────────────
export const DataPresentationLesson: React.FC = () => (
  <div className="space-y-6">
    <style>{`
      @keyframes dpFade { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
      @keyframes dpDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    `}</style>

    <IntroBox>
      <strong>Data</strong> means the numbers and facts you collect, for example when you do an experiment.
      <strong> Data presentation</strong> means showing those numbers in a clear way, in a table or a graph, so that
      you can see the pattern quickly.
    </IntroBox>

    <Heading>1. Choose the right display</Heading>
    <Lead>Different data needs a different display. Look at the four displays below and what each one is best for.</Lead>
    <DisplayCards />

    <Heading>2. Tables</Heading>
    <Lead>A table is the first place to write your results. A good table is easy to read and easy to turn into a graph.</Lead>
    <TableExample />

    <Heading>3. Pie charts</Heading>
    <Lead>
      A pie chart is a circle. The whole circle is 360°. Each slice shows one share of the total. The bigger the share,
      the bigger the angle. Watch the chart being drawn, one slice at a time.
    </Lead>
    <PieDemo />
    <Point n={1} title="How to draw a pie chart">
      <p>Add up all the values to get the total.</p>
      <p>For each value work out the angle: <strong>angle = (value ÷ total) × 360°</strong>.</p>
      <p>Check that all your angles add up to 360°.</p>
      <p>Draw a circle. Start at 12 o&apos;clock and draw each slice with a protractor, going clockwise.</p>
      <p>Label each slice with its name and shade it.</p>
    </Point>

    <Heading>4. Line graphs</Heading>
    <Lead>
      A line graph shows how one thing changes when another thing changes. Here is how to draw one, and then how to
      find the gradient (how steep the line is).
    </Lead>
    <LineDemo />
    <Point n={1} title="How to draw a line graph">
      <p>Put the thing you change on the x-axis. Put the thing you measure on the y-axis.</p>
      <p>Choose a scale that uses most of the graph paper. Use the same step size along each axis.</p>
      <p>Label each axis with its name and unit, and give the graph a title.</p>
      <p>Plot each point with a small neat cross. Use a sharp pencil.</p>
      <p>Join the points. Use a ruler for a straight line, or draw a smooth curve by hand. Do not join the dots one by one with short lines.</p>
    </Point>
    <Point n={2} title="How to find the gradient">
      <p><strong>gradient = rise ÷ run</strong>, which is the change in y ÷ the change in x.</p>
      <p>Pick two points on the line that are far apart. A big triangle gives a more accurate answer.</p>
      <p>Take the two points from your line, not from your table.</p>
      <p>Work out the unit. Here m ÷ s = m/s, so the gradient is a speed.</p>
    </Point>

    <Heading>5. Reading and understanding graphs</Heading>
    <Lead>Examiners often ask you to describe a graph. First look at its shape. The shape tells you what is happening.</Lead>
    <ShapesGuide />

    <Point n={1} title="How to read a value from a graph">
      <p>To find the distance after 5 s on the graph above: find 5 s on the x-axis.</p>
      <p>Go straight up until you meet the line.</p>
      <p>Then go straight across to the y-axis and read the value. Here it is 25 m.</p>
    </Point>
    <Point n={2} title="How to describe a graph in words">
      <p>Say what happens to y when x increases. For example: &quot;As time increases, the distance increases.&quot;</p>
      <p>Say if it is steady or changing: &quot;The line is straight, so the speed is constant.&quot;</p>
      <p>Use numbers from the graph to support what you say: &quot;The trolley travels 40 m in 8 s.&quot;</p>
    </Point>

    <Heading>6. Exam tips</Heading>
    <ul className="list-disc space-y-2 pl-8 text-base leading-relaxed text-slate-700">
      <li>Always give your graph a title and label both axes with the name and unit.</li>
      <li>Use a sharp pencil and a ruler.</li>
      <li>Use a scale that fills most of the page, and keep the steps even.</li>
      <li>Plot crosses, not big dots.</li>
      <li>In a pie chart, check that the angles add up to 360°.</li>
      <li>When you work out a gradient, show the rise and the run, and write the unit.</li>
    </ul>

    <QuickCheck />
  </div>
);

export default DataPresentationLesson;
