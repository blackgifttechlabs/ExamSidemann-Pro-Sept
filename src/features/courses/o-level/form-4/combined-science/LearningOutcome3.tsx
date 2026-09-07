import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Pressure in liquids - container with holes
const pressureLiquidSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="white" />
  <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Pressure in Liquids</text>
  <rect x="130" y="60" width="140" height="180" rx="5" fill="none" stroke="#3b82f6" stroke-width="2" />
  <rect x="135" y="80" width="130" height="155" fill="#dbeafe" opacity="0.6" />
  <line x1="130" y1="100" x2="80" y2="100" stroke="#3b82f6" stroke-width="2" />
  <text x="52" y="95" font-size="9" fill="#2563eb">A (short jet)</text>
  <path d="M80 100 Q60 120 50 140" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,2" />
  <line x1="130" y1="140" x2="80" y2="140" stroke="#3b82f6" stroke-width="2" />
  <text x="42" y="135" font-size="9" fill="#2563eb">B (medium jet)</text>
  <path d="M80 140 Q50 170 40 200" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,2" />
  <line x1="130" y1="180" x2="80" y2="180" stroke="#3b82f6" stroke-width="2" />
  <text x="46" y="175" font-size="9" fill="#2563eb">C (long jet)</text>
  <path d="M80 180 Q30 220 20 260" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4,2" />
  <text x="200" y="265" text-anchor="middle" font-size="11" fill="#475569">Water squirts furthest from the lowest hole: pressure increases with depth</text>
</svg>
`;

// Manometer
const manometerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
  <rect width="400" height="300" fill="white" />
  <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Manometer</text>
  <path d="M140 100 L140 200 Q200 240 260 200 L260 100" fill="none" stroke="#3b82f6" stroke-width="3" />
  <rect x="140" y="160" width="60" height="40" fill="#dbeafe" />
  <rect x="200" y="120" width="60" height="80" fill="#dbeafe" />
  <text x="170" y="185" text-anchor="middle" font-size="10" fill="#2563eb">Liquid</text>
  <text x="230" y="150" text-anchor="middle" font-size="10" fill="#2563eb">Liquid</text>
  <text x="112" y="90" font-size="11" fill="#475569">Gas</text>
  <text x="248" y="90" font-size="11" fill="#475569">Atmosphere</text>
  <line x1="140" y1="160" x2="200" y2="160" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,2" />
  <line x1="140" y1="160" x2="140" y2="150" stroke="#ef4444" stroke-width="1" />
  <line x1="200" y1="160" x2="200" y2="150" stroke="#ef4444" stroke-width="1" />
  <text x="170" y="152" text-anchor="middle" font-size="10" fill="#ef4444">h</text>
  <text x="200" y="270" text-anchor="middle" font-size="12" fill="#475569">P(gas) = P(atmosphere) + h&#961;g</text>
</svg>
`;

// Thermos flask diagram
const thermosFlaskSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
  <rect width="300" height="400" fill="white" />
  <text x="150" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Thermos Flask</text>
  <rect x="80" y="50" width="140" height="280" rx="10" fill="none" stroke="#6b7280" stroke-width="2" />
  <text x="150" y="348" text-anchor="middle" font-size="10" fill="#6b7280">Outer plastic casing</text>
  <rect x="100" y="70" width="100" height="240" rx="8" fill="none" stroke="#3b82f6" stroke-width="2" />
  <rect x="102" y="72" width="96" height="236" rx="6" fill="none" stroke="#eab308" stroke-width="1" stroke-dasharray="2,2" />
  <text x="212" y="118" font-size="9" fill="#eab308">Silvered walls</text>
  <text x="150" y="200" text-anchor="middle" font-size="10" fill="#475569">Vacuum</text>
  <rect x="130" y="50" width="40" height="20" rx="3" fill="#d1d5db" />
  <text x="150" y="44" text-anchor="middle" font-size="9" fill="#6b7280">Insulating stopper</text>
  <rect x="105" y="250" width="90" height="55" fill="#dbeafe" opacity="0.6" />
  <text x="150" y="280" text-anchor="middle" font-size="10" fill="#2563eb">Hot / cold liquid</text>
  <text x="212" y="180" font-size="9" fill="#475569">Double-walled</text>
  <text x="212" y="194" font-size="9" fill="#475569">glass vessel</text>
  <text x="212" y="240" font-size="9" fill="#475569">Foam supports</text>
</svg>
`;

// Sound waves (compression/rarefaction)
const soundWavesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 160" width="100%" height="100%">
  <rect width="600" height="160" fill="white" />
  <text x="300" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Sound Waves (Longitudinal)</text>
  <text x="50" y="52" font-size="10" fill="#475569">Compression</text>
  <text x="200" y="52" font-size="10" fill="#475569">Rarefaction</text>
  <text x="350" y="52" font-size="10" fill="#475569">Compression</text>
  <text x="480" y="52" font-size="10" fill="#475569">Rarefaction</text>
  <g transform="translate(40,85)">
    <circle cx="0" cy="0" r="5" fill="#3b82f6" />
    <circle cx="10" cy="0" r="5" fill="#3b82f6" />
    <circle cx="20" cy="0" r="5" fill="#3b82f6" />
    <circle cx="30" cy="0" r="5" fill="#3b82f6" />
    <circle cx="55" cy="0" r="5" fill="#3b82f6" />
    <circle cx="85" cy="0" r="5" fill="#3b82f6" />
    <circle cx="115" cy="0" r="5" fill="#3b82f6" />
    <circle cx="150" cy="0" r="5" fill="#3b82f6" />
    <circle cx="175" cy="0" r="5" fill="#3b82f6" />
    <circle cx="195" cy="0" r="5" fill="#3b82f6" />
    <circle cx="215" cy="0" r="5" fill="#3b82f6" />
    <circle cx="240" cy="0" r="5" fill="#3b82f6" />
    <circle cx="270" cy="0" r="5" fill="#3b82f6" />
    <circle cx="300" cy="0" r="5" fill="#3b82f6" />
    <circle cx="335" cy="0" r="5" fill="#3b82f6" />
    <circle cx="355" cy="0" r="5" fill="#3b82f6" />
    <circle cx="375" cy="0" r="5" fill="#3b82f6" />
    <circle cx="395" cy="0" r="5" fill="#3b82f6" />
    <circle cx="420" cy="0" r="5" fill="#3b82f6" />
    <circle cx="450" cy="0" r="5" fill="#3b82f6" />
    <circle cx="480" cy="0" r="5" fill="#3b82f6" />
  </g>
  <line x1="40" y1="108" x2="360" y2="108" stroke="#ef4444" stroke-width="1" stroke-dasharray="4,2" />
  <line x1="40" y1="103" x2="40" y2="113" stroke="#ef4444" stroke-width="1" />
  <line x1="360" y1="103" x2="360" y2="113" stroke="#ef4444" stroke-width="1" />
  <text x="200" y="126" text-anchor="middle" font-size="10" fill="#ef4444">One wavelength (&#955;)</text>
  <text x="300" y="150" text-anchor="middle" font-size="11" fill="#475569">Particles vibrate in the SAME direction as the wave travels</text>
</svg>
`;

/* ---------- Image paths ----------
   New Form 4 artwork must be saved into:
     public/images/courses/o-level/combined-science/form-4/
   Drawing prompts for every file name below are in
     docs/FORM4_COMBINED_SCIENCE_IMAGE_PROMPTS.md
------------------------------------ */
const f4Image = (fileName: string) =>
  `/images/courses/o-level/combined-science/form-4/${fileName}`;

const physImages = {
  /* ----- SVG diagrams drawn in code ----- */
  pressureLiquid: svgToDataUri(pressureLiquidSvg),
  manometerSvg: svgToDataUri(manometerSvg),
  thermosFlaskSvg: svgToDataUri(thermosFlaskSvg),
  soundWaves: svgToDataUri(soundWavesSvg),

  /* ----- New Form 4 artwork (save with these exact names) ----- */
  resultsTable: f4Image('phys-results-table.png'),
  pieChartExample: f4Image('phys-pie-chart-example.png'),
  barGraphExample: f4Image('phys-bar-graph-example.png'),
  lineGraphGradient: f4Image('phys-line-graph-gradient.png'),

  measuringInstruments: f4Image('phys-measuring-instruments.png'),
  vernierCallipers: f4Image('phys-vernier-callipers-reading.png'),
  micrometerReading: f4Image('phys-micrometer-reading.png'),
  measuringCylinderMeniscus: f4Image('phys-measuring-cylinder-meniscus.png'),
  densityStep1: f4Image('phys-density-step1.png'),
  densityStep2: f4Image('phys-density-step2.png'),
  densityStep3: f4Image('phys-density-step3.png'),
  densityStep4: f4Image('phys-density-step4.png'),
  ammeterVoltmeterCircuit: f4Image('phys-ammeter-voltmeter-circuit.png'),

  pressureForceArea: f4Image('phys-pressure-force-area.png'),
  pressureDepthExperiment: f4Image('phys-pressure-depth-experiment.png'),
  pressureAllDirections: f4Image('phys-pressure-all-directions.png'),
  manometerLabelled: f4Image('phys-manometer-labelled.png'),
  mercuryBarometer: f4Image('phys-mercury-barometer.png'),
  crushingCan: f4Image('phys-crushing-can.png'),
  damWall: f4Image('phys-dam-wall.png'),

  liftPumpStrokes: f4Image('phys-lift-pump-strokes.png'),
  forcePumpStrokes: f4Image('phys-force-pump-strokes.png'),
  bushPump: f4Image('phys-bush-pump.png'),
  hydraulicPress: f4Image('phys-hydraulic-press.png'),
  hydraulicBrakes: f4Image('phys-hydraulic-brakes.png'),
  bicyclePump: f4Image('phys-bicycle-pump.png'),

  heatTransferThreeWays: f4Image('phys-heat-transfer-three-ways.png'),
  solarCooker: f4Image('phys-solar-cooker.png'),
  solarWaterHeater: f4Image('phys-solar-water-heater.png'),
  solarPvSystem: f4Image('phys-solar-pv-system.png'),
  thermosFlaskLabelled: f4Image('phys-thermos-flask-labelled.png'),

  waveParts: f4Image('phys-wave-parts.png'),
  soundInMedia: f4Image('phys-sound-in-media.png'),
  analogueVsDigital: f4Image('phys-analogue-vs-digital.png'),
  telephoneSystem: f4Image('phys-telephone-system.png'),
  cellphoneNetwork: f4Image('phys-cellphone-network.png'),
  transmissionMedia: f4Image('phys-transmission-media.png'),
  opticalFibreTir: f4Image('phys-optical-fibre-tir.png'),
  satelliteCommunication: f4Image('phys-satellite-communication.png'),
  emSpectrum: f4Image('phys-em-spectrum.png'),

  thermalPowerStation: f4Image('phys-thermal-power-station.png'),
  hydroelectricStation: f4Image('phys-hydroelectric-station.png'),
  nationalGrid: f4Image('phys-national-grid.png'),
  transformer: f4Image('phys-transformer.png'),
  houseWiring: f4Image('phys-house-wiring.png'),
  threePinPlug: f4Image('phys-three-pin-plug.png'),
  fuseAndBreaker: f4Image('phys-fuse-and-breaker.png'),
  applianceRatingPlate: f4Image('phys-appliance-rating-plate.png'),
  prepaidMeter: f4Image('phys-prepaid-meter.png'),
};

/* ---------- Small presentation helpers ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** Image that quietly removes itself if the artwork has not been added yet. */
const Figure: React.FC<{ src: string; alt: string; caption?: string; className?: string }> = ({
  src,
  alt,
  caption,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className={`mt-3 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-xs font-semibold text-slate-600">{caption}</figcaption>
      )}
    </figure>
  );
};

const Definition: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
  <div className="rounded-xl bg-blue-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Definition</p>
    <p className="mt-1 text-sm leading-relaxed text-slate-800">
      <strong>{term}</strong> — {children}
    </p>
  </div>
);

const Example: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Worked example',
  children,
}) => (
  <div className="rounded-xl bg-amber-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">{title}</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const ExamTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-emerald-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Exam tip</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const WatchOut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-rose-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-700">Watch out</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Safety: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-orange-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">Safety</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 className="font-bold text-blue-700">{title}</h4>
    <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">{children}</div>
  </div>
);

const Step: React.FC<{ n: number; src?: string; alt?: string; children: React.ReactNode }> = ({
  n,
  src,
  alt,
  children,
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <p className="mb-1 text-xs font-bold text-blue-600">Step {n}</p>
    <p className="text-sm leading-relaxed text-slate-700">{children}</p>
    {src && <Figure src={src} alt={alt ?? `Step ${n}`} className="mt-2" />}
  </div>
);

const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg bg-slate-900 px-4 py-3 text-center font-mono text-sm text-white shadow-sm">
    {children}
  </div>
);

const KeyList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-bold text-blue-700">{title}</h3>
    <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const sections: TopicSection[] = [
  /* =======================================================================
     1. DATA PRESENTATION
  ======================================================================= */
  {
    id: 'data-presentation',
    title: 'Data Presentation',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              A page of numbers tells you almost nothing at a glance. Turn the same numbers into a graph and
              a pattern jumps out immediately. That is the whole purpose of{' '}
              <strong>data presentation</strong>: organising measurements so that trends, comparisons and
              relationships become obvious. Choosing the right kind of chart is a skill examiners test
              directly, so start by learning which chart fits which job.
            </p>
          </div>

          <Card title="Choosing the Right Display">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Display</th>
                  <th className="border p-2 text-left">Use it when you want to show…</th>
                  <th className="border p-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Table</td>
                  <td className="border p-2">Exact recorded values, neatly organised</td>
                  <td className="border p-2">Current and voltage readings from a circuit</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pie chart</td>
                  <td className="border p-2">
                    How a whole is divided up — <strong>proportions</strong> of a total
                  </td>
                  <td className="border p-2">Percentage of Zimbabwe&rsquo;s electricity from each source</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Bar graph</td>
                  <td className="border p-2">
                    <strong>Comparisons</strong> between separate categories
                  </td>
                  <td className="border p-2">Rainfall in each of ten provinces</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Line graph</td>
                  <td className="border p-2">
                    How one continuously changing quantity <strong>depends on</strong> another
                  </td>
                  <td className="border p-2">How the extension of a spring changes with load</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Recording Data in a Table">
            <Figure
              src={physImages.resultsTable}
              alt="A correctly drawn results table with headings, units and consistent decimal places"
              caption="Fig 1.1 — A properly set-out results table. Units go in the column heading, never beside each number."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                Put the quantity and its unit in the <strong>column heading</strong>, separated by a slash —
                for example &ldquo;Load / N&rdquo; and &ldquo;Extension / cm&rdquo;.
              </li>
              <li>Never write the unit next to every reading; it clutters the table.</li>
              <li>
                Give every reading in a column the <strong>same number of decimal places</strong>, decided by
                the instrument you used.
              </li>
              <li>Put the quantity you changed (the independent variable) in the first column.</li>
              <li>Draw all lines with a ruler.</li>
            </ul>
          </Card>

          <Card title="Pie Charts">
            <Definition term="Pie chart">
              a circular chart divided into sectors, in which the angle of each sector is proportional to the
              quantity it represents. The whole circle is 360&deg; and stands for the whole of the data.
            </Definition>
            <Figure
              src={physImages.pieChartExample}
              alt="Labelled pie chart with each sector showing its percentage and angle"
              caption="Fig 1.2 — A pie chart with each sector labelled with the category, its percentage and its angle."
            />
            <p className="font-semibold text-slate-800">How to construct one:</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Add up all the values to get the total.</li>
              <li>
                For each item work out its angle:{' '}
                <strong>angle = (value &divide; total) &times; 360&deg;</strong>
              </li>
              <li>Check that all the angles add up to 360&deg;.</li>
              <li>Draw a circle with compasses and one radius as a starting line.</li>
              <li>Measure each angle with a protractor, working round in the same direction.</li>
              <li>Shade or colour each sector differently, then label it or add a key.</li>
            </ol>
            <Example>
              <p>
                A school of 200 pupils travels to school as follows: walk 90, bus 60, bicycle 30, car 20.
                Find the angle for each sector.
              </p>
              <p>Walk: (90 &divide; 200) &times; 360 = <strong>162&deg;</strong></p>
              <p>Bus: (60 &divide; 200) &times; 360 = <strong>108&deg;</strong></p>
              <p>Bicycle: (30 &divide; 200) &times; 360 = <strong>54&deg;</strong></p>
              <p>Car: (20 &divide; 200) &times; 360 = <strong>36&deg;</strong></p>
              <p>Check: 162 + 108 + 54 + 36 = <strong>360&deg;</strong> ✓</p>
            </Example>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-emerald-700">Advantages</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Very easy to understand at a glance</li>
                  <li>Shows clearly which category is largest and which is smallest</li>
                  <li>Summarises a lot of data in one simple picture</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-rose-700">Disadvantages</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Exact values cannot be read off unless they are written on</li>
                  <li>Cannot show how something changes over time</li>
                  <li>Cannot show a relationship between two variables</li>
                  <li>Hard to compare sectors that are almost the same size</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card title="Bar Graphs">
            <p>
              A bar graph compares <strong>separate categories</strong>. The bars are all the same width, and
              there are gaps between them because the categories are not continuous.
            </p>
            <Figure
              src={physImages.barGraphExample}
              alt="Bar graph with labelled axes, uniform bars and equal gaps"
              caption="Fig 1.3 — A bar graph. Both axes are labelled with quantity and unit, bars are of equal width and evenly spaced."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>Label both axes with the quantity and the unit.</li>
              <li>Start the vertical scale at zero, or the comparison will be misleading.</li>
              <li>Keep the bars the same width, with equal gaps between them.</li>
              <li>Give the graph a clear title.</li>
            </ul>
          </Card>

          <Card title="Line Graphs">
            <p>
              A line graph is the most powerful of the three because it shows a{' '}
              <strong>relationship</strong> between two continuously changing quantities, and lets you read
              off values you never actually measured.
            </p>
            <Figure
              src={physImages.lineGraphGradient}
              alt="Line graph with labelled axes, plotted points, line of best fit and a gradient triangle"
              caption="Fig 1.4 — A line graph with a line of best fit and a large gradient triangle drawn on it."
            />
            <p className="font-semibold text-slate-800">Rules for drawing one:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Put the <strong>independent variable</strong> (the one you deliberately changed) on the{' '}
                <strong>horizontal x-axis</strong>, and the <strong>dependent variable</strong> (the one you
                measured) on the <strong>vertical y-axis</strong>.
              </li>
              <li>
                Choose a scale that uses at least half the grid, and use easy steps such as 1, 2, 5 or 10 per
                square — never 3 or 7.
              </li>
              <li>Label both axes with the quantity and the unit.</li>
              <li>Plot points accurately with a sharp pencil, using a small cross or a dot in a circle.</li>
              <li>
                Draw a smooth <strong>line of best fit</strong> — a single smooth line or straight line with
                roughly as many points above it as below. Do not join the dots zig-zag fashion.
              </li>
              <li>Any point far off the line is an <strong>anomalous result</strong>; circle it and ignore it when drawing the line.</li>
            </ul>
            <Example title="Worked example — finding a gradient">
              <p>
                A distance&ndash;time graph is a straight line through the origin. Two points on the line are
                (2 s, 10 m) and (8 s, 40 m). Find the gradient and say what it represents.
              </p>
              <p>gradient = change in y &divide; change in x</p>
              <p>gradient = (40 &minus; 10) &divide; (8 &minus; 2) = 30 &divide; 6 = <strong>5</strong></p>
              <p>
                The units are m/s, so the gradient of a distance&ndash;time graph is the{' '}
                <strong>speed</strong> — 5 m/s.
              </p>
            </Example>
            <ExamTip>
              <p>
                When you calculate a gradient, draw the biggest triangle that fits on your line. A small
                triangle magnifies any small reading error and loses you accuracy marks. Always take the two
                points <strong>from your line</strong>, not from your table of results.
              </p>
            </ExamTip>
          </Card>

          <Card title="Reading What a Graph Means">
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>A straight line through the origin</strong> means the two quantities are{' '}
                <strong>directly proportional</strong> — double one and the other doubles.
              </li>
              <li>
                <strong>A straight line not through the origin</strong> means there is a steady relationship
                but with a starting value, for example a spring that already has an initial length.
              </li>
              <li>
                <strong>A curve that flattens off</strong> means the quantity is reaching a maximum, for
                example a falling object reaching terminal velocity.
              </li>
              <li>
                <strong>A downward curve</strong> may show an inverse relationship — as one goes up the other
                goes down.
              </li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Data Presentation Key Points"
            items={[
              'Pie chart – proportions of a whole',
              'Bar graph – comparing separate categories',
              'Line graph – relationship between two variables',
              'Pie angle = (value ÷ total) × 360°',
              'Independent variable goes on the x-axis',
              'Label axes with quantity AND unit',
              'Draw a line of best fit, not dot-to-dot',
              'Gradient = change in y ÷ change in x',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Marks are given for</h3>
            <p className="text-sm text-slate-700">
              Sensible scale · both axes labelled with units · points plotted accurately · a smooth line of
              best fit · a large gradient triangle with the working shown.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     2. MEASUREMENTS
  ======================================================================= */
  {
    id: 'measurements',
    title: 'Measurements',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Physics is built on measurement. A number on its own is meaningless — &ldquo;the length is
              5&rdquo; could be 5 millimetres or 5 kilometres. Every measurement must therefore be given as a{' '}
              <strong>number plus a unit</strong>. To make sure that scientists everywhere mean the same
              thing, the world uses one agreed set of units, the{' '}
              <strong>SI system (Système International)</strong>.
            </p>
          </div>

          <Card title="Base Quantities and Derived Quantities">
            <p>
              <strong>Base quantities</strong> are the seven fundamental quantities that cannot be made out
              of anything simpler. <strong>Derived quantities</strong> are built from them by multiplying or
              dividing.
            </p>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Base quantity</th>
                  <th className="border p-2 text-left">SI unit</th>
                  <th className="border p-2 text-left">Symbol</th>
                  <th className="border p-2 text-left">Measured with</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Length</td>
                  <td className="border p-2">metre</td>
                  <td className="border p-2">m</td>
                  <td className="border p-2">Ruler, tape measure, vernier callipers, micrometer</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Mass</td>
                  <td className="border p-2">kilogram</td>
                  <td className="border p-2">kg</td>
                  <td className="border p-2">Beam balance, electronic balance</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Time</td>
                  <td className="border p-2">second</td>
                  <td className="border p-2">s</td>
                  <td className="border p-2">Stopwatch, clock</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Temperature</td>
                  <td className="border p-2">kelvin</td>
                  <td className="border p-2">K</td>
                  <td className="border p-2">Thermometer</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Electric current</td>
                  <td className="border p-2">ampere</td>
                  <td className="border p-2">A</td>
                  <td className="border p-2">Ammeter</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Amount of substance</td>
                  <td className="border p-2">mole</td>
                  <td className="border p-2">mol</td>
                  <td className="border p-2">Calculated from mass</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Luminous intensity</td>
                  <td className="border p-2">candela</td>
                  <td className="border p-2">cd</td>
                  <td className="border p-2">Light meter</td>
                </tr>
              </tbody>
            </table>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Derived quantity</th>
                  <th className="border p-2 text-left">How it is worked out</th>
                  <th className="border p-2 text-left">Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Area</td>
                  <td className="border p-2">length &times; width</td>
                  <td className="border p-2">m&sup2;</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Volume</td>
                  <td className="border p-2">length &times; width &times; height</td>
                  <td className="border p-2">m&sup3; (or cm&sup3;)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Density</td>
                  <td className="border p-2">mass &divide; volume</td>
                  <td className="border p-2">kg/m&sup3; (or g/cm&sup3;)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Speed / velocity</td>
                  <td className="border p-2">distance &divide; time</td>
                  <td className="border p-2">m/s</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Acceleration</td>
                  <td className="border p-2">change in velocity &divide; time</td>
                  <td className="border p-2">m/s&sup2;</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Force</td>
                  <td className="border p-2">mass &times; acceleration</td>
                  <td className="border p-2">newton, N</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pressure</td>
                  <td className="border p-2">force &divide; area</td>
                  <td className="border p-2">pascal, Pa (= N/m&sup2;)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Work / energy</td>
                  <td className="border p-2">force &times; distance</td>
                  <td className="border p-2">joule, J</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Power</td>
                  <td className="border p-2">work &divide; time</td>
                  <td className="border p-2">watt, W</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Potential difference</td>
                  <td className="border p-2">work &divide; charge</td>
                  <td className="border p-2">volt, V</td>
                </tr>
              </tbody>
            </table>
            <Example>
              <p>
                A force of 20 N pushes a box 6 m along the floor in 4 s. Find the work done and the power
                developed.
              </p>
              <p>Work = force &times; distance = 20 &times; 6 = <strong>120 J</strong></p>
              <p>Power = work &divide; time = 120 &divide; 4 = <strong>30 W</strong></p>
            </Example>
          </Card>

          <Card title="Prefixes and Conversions">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Prefix</th>
                  <th className="border p-2 text-left">Symbol</th>
                  <th className="border p-2 text-left">Means</th>
                  <th className="border p-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">milli</td>
                  <td className="border p-2">m</td>
                  <td className="border p-2">one thousandth (&divide; 1 000)</td>
                  <td className="border p-2">1 mm = 0.001 m</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">centi</td>
                  <td className="border p-2">c</td>
                  <td className="border p-2">one hundredth (&divide; 100)</td>
                  <td className="border p-2">1 cm = 0.01 m</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">kilo</td>
                  <td className="border p-2">k</td>
                  <td className="border p-2">one thousand (&times; 1 000)</td>
                  <td className="border p-2">1 kW = 1 000 W</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">mega</td>
                  <td className="border p-2">M</td>
                  <td className="border p-2">one million (&times; 1 000 000)</td>
                  <td className="border p-2">1 MJ = 1 000 000 J</td>
                </tr>
              </tbody>
            </table>
            <p>
              Useful conversions: 1 cm = 10 mm · 1 m = 100 cm = 1 000 mm · 1 km = 1 000 m · 1 kg = 1 000 g ·
              1 litre = 1 000 cm&sup3; · 1 cm&sup3; = 1 ml · 1 m&sup3; = 1 000 000 cm&sup3;.
            </p>
          </Card>

          <Card title="Measuring Length Accurately">
            <Figure
              src={physImages.measuringInstruments}
              alt="Ruler, tape measure, vernier callipers and micrometer screw gauge side by side"
              caption="Fig 2.1 — Choosing an instrument: the smaller the object, the more precise the instrument you need."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Instrument</th>
                  <th className="border p-2 text-left">Smallest division</th>
                  <th className="border p-2 text-left">Best used for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Metre rule</td>
                  <td className="border p-2">1 mm</td>
                  <td className="border p-2">Lengths from a few centimetres up to a metre</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Tape measure</td>
                  <td className="border p-2">1 mm</td>
                  <td className="border p-2">Long distances and curved surfaces</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vernier callipers</td>
                  <td className="border p-2">0.1 mm (0.01 cm)</td>
                  <td className="border p-2">
                    Diameter of a test tube, thickness of a block, internal and external diameters
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Micrometer screw gauge</td>
                  <td className="border p-2">0.01 mm</td>
                  <td className="border p-2">Diameter of a wire, thickness of a sheet of paper</td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={physImages.vernierCallipers}
              alt="Vernier callipers with main scale and vernier scale enlarged for reading"
              caption="Fig 2.2 — Reading vernier callipers: read the main scale before the zero of the vernier, then find the vernier line that lines up exactly with a main-scale line."
            />
            <Example title="Reading vernier callipers">
              <p>The vernier zero lies just past 2.4 cm on the main scale, and the 6th vernier division lines up with a main-scale line.</p>
              <p>Main scale reading = 2.4 cm</p>
              <p>Vernier reading = 6 &times; 0.01 cm = 0.06 cm</p>
              <p>Total = 2.4 + 0.06 = <strong>2.46 cm</strong></p>
            </Example>
            <Figure
              src={physImages.micrometerReading}
              alt="Micrometer screw gauge with sleeve and thimble scales enlarged"
              caption="Fig 2.3 — Reading a micrometer: sleeve reading plus thimble reading. Always use the ratchet so you do not over-tighten and crush the object."
            />
          </Card>

          <Card title="Measuring Volume">
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Regular solid:</strong> measure the sides with a ruler and calculate. A cuboid is
                length &times; width &times; height; a cylinder is &pi;r&sup2;h.
              </li>
              <li>
                <strong>Liquid:</strong> pour it into a measuring cylinder standing on a level bench and read
                the bottom of the <strong>meniscus</strong> with your eye level with it.
              </li>
              <li>
                <strong>Irregular solid:</strong> use the <strong>displacement method</strong> — the object
                pushes aside its own volume of water.
              </li>
            </ul>
            <Figure
              src={physImages.measuringCylinderMeniscus}
              alt="Measuring cylinder showing correct eye position at the bottom of the meniscus"
              caption="Fig 2.4 — Read the bottom of the meniscus with the eye level with it. Reading from above or below gives a parallax error."
            />
          </Card>

          <Card title="Density">
            <Definition term="Density">
              the mass of a substance per unit volume — in plain English, how much matter is packed into a
              given space.
            </Definition>
            <Formula>density (&rho;) = mass (m) &divide; volume (V)</Formula>
            <p>
              The SI unit is kg/m&sup3;, but g/cm&sup3; is often more convenient in the laboratory. To
              convert, remember that <strong>1 g/cm&sup3; = 1 000 kg/m&sup3;</strong>. Water has a density of
              1 g/cm&sup3; or 1 000 kg/m&sup3;, which makes it a handy reference: anything less dense than
              water floats on it, and anything denser sinks.
            </p>
            <Example title="Worked example 1 — regular solid">
              <p>
                A rectangular block measures 4 cm &times; 3 cm &times; 2 cm and has a mass of 96 g. Find its
                density.
              </p>
              <p>Volume = 4 &times; 3 &times; 2 = 24 cm&sup3;</p>
              <p>Density = 96 &divide; 24 = <strong>4 g/cm&sup3;</strong> (= 4 000 kg/m&sup3;)</p>
            </Example>
            <Example title="Worked example 2 — a liquid">
              <p>
                An empty measuring cylinder has a mass of 55 g. When 40 cm&sup3; of cooking oil is poured in,
                the total mass is 91 g. Find the density of the oil.
              </p>
              <p>Mass of oil = 91 &minus; 55 = 36 g</p>
              <p>Density = 36 &divide; 40 = <strong>0.9 g/cm&sup3;</strong></p>
              <p>Since 0.9 is less than 1, the oil floats on water — which is exactly what you see in a pan.</p>
            </Example>
          </Card>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-blue-700">
              Experiment 1: Finding the Density of an Irregular Solid
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To determine the density of a small irregularly shaped stone.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> The stone, an electronic or beam balance, a measuring cylinder,
              water, thread, a paper towel.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={physImages.densityStep1} alt="Weighing the dry stone on a balance">
                Dry the stone and find its mass on the balance. Record the mass in grams.
              </Step>
              <Step n={2} src={physImages.densityStep2} alt="Reading the initial water level in a measuring cylinder">
                Pour water into the measuring cylinder until it is about half full, and record the volume
                V₁, reading the bottom of the meniscus at eye level.
              </Step>
              <Step n={3} src={physImages.densityStep3} alt="Lowering the stone into the water on a thread">
                Tie the thread to the stone and lower it gently into the water until it is fully submerged.
                Lowering it gently prevents splashing, which would lose water and spoil the result.
              </Step>
              <Step n={4} src={physImages.densityStep4} alt="Reading the new water level to find the displaced volume">
                Record the new volume V₂. The volume of the stone is V₂ &minus; V₁, because the stone has
                pushed aside exactly its own volume of water.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Specimen results:</strong> mass = 78 g; V₁ = 50 cm&sup3;; V₂ = 80 cm&sup3;.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Calculation:</strong> volume of stone = 80 &minus; 50 = 30 cm&sup3;; density = 78
              &divide; 30 = <strong>2.6 g/cm&sup3;</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Precautions:</strong> dry the stone before weighing it; make sure it is completely
              submerged but not touching the sides; read both volumes at eye level; keep the cylinder on a
              level bench.
            </p>
          </div>

          <Card title="Mass and Weight — Not the Same Thing">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left"></th>
                  <th className="border p-2 text-left">Mass</th>
                  <th className="border p-2 text-left">Weight</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">What it is</td>
                  <td className="border p-2">The amount of matter in an object</td>
                  <td className="border p-2">The pull of gravity on that object</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Unit</td>
                  <td className="border p-2">kilogram (kg)</td>
                  <td className="border p-2">newton (N)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Measured with</td>
                  <td className="border p-2">Balance</td>
                  <td className="border p-2">Spring balance (newton meter)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Does it change with place?</td>
                  <td className="border p-2">No — it is the same everywhere</td>
                  <td className="border p-2">Yes — less on the Moon, where gravity is weaker</td>
                </tr>
              </tbody>
            </table>
            <Formula>weight (W) = mass (m) &times; gravitational field strength (g), with g &asymp; 10 N/kg</Formula>
            <Example>
              <p>Find the weight of a 50 kg pupil on Earth.</p>
              <p>W = 50 &times; 10 = <strong>500 N</strong></p>
              <p>
                On the Moon, where g is about 1.6 N/kg, the same pupil would weigh only 80 N — but their mass
                would still be 50 kg.
              </p>
            </Example>
          </Card>

          <Card title="Measuring Current and Voltage">
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Current (I)</strong> is the rate of flow of electric charge. Unit: the{' '}
                <strong>ampere (A)</strong>. It is measured with an <strong>ammeter connected in
                series</strong>, because the same current must pass through the meter as through the
                component.
              </li>
              <li>
                <strong>Potential difference (V)</strong>, or voltage, is the energy transferred per unit
                charge. Unit: the <strong>volt (V)</strong>. It is measured with a{' '}
                <strong>voltmeter connected in parallel</strong> across the component, because it compares
                the energy on either side of it.
              </li>
            </ul>
            <Figure
              src={physImages.ammeterVoltmeterCircuit}
              alt="Circuit diagram with a cell, switch, resistor, ammeter in series and voltmeter in parallel"
              caption="Fig 2.5 — The ammeter (A) is in the main circuit; the voltmeter (V) is connected across the resistor."
            />
            <Formula>V = W &divide; Q &nbsp;&nbsp;(voltage = energy transferred &divide; charge)</Formula>
          </Card>

          <Card title="Errors in Measurement">
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Parallax error</strong> — reading a scale from an angle instead of straight on. Cure:
                get your eye level with the mark.
              </li>
              <li>
                <strong>Zero error</strong> — an instrument that does not read zero when it should. Cure:
                check before use and subtract the zero reading from every measurement.
              </li>
              <li>
                <strong>Random errors</strong> — small unpredictable variations. Cure: repeat the measurement
                several times and take an average.
              </li>
              <li>
                <strong>Instrument choice</strong> — using a metre rule for the diameter of a wire. Cure:
                pick an instrument precise enough for the job.
              </li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Measurement Key Points"
            items={[
              'Every measurement = number + unit',
              'Base units: m, kg, s, K, A, mol, cd',
              'Density = mass ÷ volume',
              '1 g/cm³ = 1000 kg/m³; water = 1 g/cm³',
              'Displacement method for irregular solids',
              'Mass in kg (balance); weight in N (spring balance)',
              'W = mg, with g ≈ 10 N/kg',
              'Ammeter in series; voltmeter in parallel',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Formula triangle</h3>
            <p className="text-sm text-slate-700">
              Cover the quantity you want in the triangle for ρ = m / V: cover ρ to get m ÷ V, cover m to get
              ρ × V, cover V to get m ÷ ρ. The same trick works for speed, pressure and power.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     3. FORCE - PRESSURE IN FLUIDS
  ======================================================================= */
  {
    id: 'force-pressure',
    title: 'Force – Pressure in Fluids',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Push a drawing pin into a board with your thumb and the point sinks in easily, while your thumb
              is unharmed. The force is exactly the same at both ends of the pin — what differs is the{' '}
              <strong>area</strong> it acts on. Squeeze a force into a tiny area and you get an enormous
              pressure; spread the same force over a large area and the pressure becomes gentle. That single
              idea explains knives, camel feet, tractor tyres, snowshoes and dam walls.
            </p>
          </div>

          <Definition term="Pressure">
            the force acting at right angles on each unit of area of a surface. Its SI unit is the{' '}
            <strong>pascal (Pa)</strong>, where 1 Pa = 1 N/m&sup2;.
          </Definition>
          <Formula>pressure (P) = force (F) &divide; area (A)</Formula>

          <Card title="Force, Area and Everyday Life">
            <Figure
              src={physImages.pressureForceArea}
              alt="Comparison of high pressure and low pressure examples such as a drawing pin, a knife, tractor tyres and a camel foot"
              caption="Fig 3.1 — Small area gives high pressure (pin, knife, high-heeled shoe); large area gives low pressure (tractor tyres, camel foot, wide backpack straps)."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                A <strong>sharp knife</strong> cuts better than a blunt one because its thin edge has a very
                small area, so the same push produces far greater pressure.
              </li>
              <li>
                <strong>Tractor tyres are wide</strong> so the tractor&rsquo;s weight is spread over a large
                area; the pressure on the soil is low and the tractor does not sink into soft ground.
              </li>
              <li>
                A <strong>camel&rsquo;s broad foot</strong> spreads its weight over the sand for the same
                reason.
              </li>
              <li>
                <strong>Wide straps on a school bag</strong> spread the load over more of your shoulder, so
                the pressure — and the pain — is less.
              </li>
              <li>
                <strong>Foundations of a building</strong> are made wide so the weight of the building is
                spread over enough ground for the soil to support it.
              </li>
            </ul>
            <Example title="Worked example 1">
              <p>
                A box weighing 600 N stands on the floor. Its base measures 2 m by 1.5 m. Find the pressure
                on the floor.
              </p>
              <p>Area = 2 &times; 1.5 = 3 m&sup2;</p>
              <p>Pressure = 600 &divide; 3 = <strong>200 Pa</strong></p>
            </Example>
            <Example title="Worked example 2 — the same weight, a different face">
              <p>
                The same 600 N box is now stood on its end, where the face measures 1.5 m by 0.5 m. What is
                the new pressure?
              </p>
              <p>Area = 1.5 &times; 0.5 = 0.75 m&sup2;</p>
              <p>Pressure = 600 &divide; 0.75 = <strong>800 Pa</strong></p>
              <p>
                The weight has not changed at all, but the pressure is four times greater because the area is
                four times smaller.
              </p>
            </Example>
          </Card>

          <Card title="Pressure in Liquids">
            <p>
              A <strong>fluid</strong> is anything that flows — both liquids and gases. Pressure in a fluid
              behaves according to three rules you must know.
            </p>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                <strong>Pressure increases with depth.</strong> The deeper you go, the greater the weight of
                fluid above pressing down.
              </li>
              <li>
                <strong>Pressure acts equally in all directions</strong> at any given depth — sideways and
                upwards as well as downwards.
              </li>
              <li>
                <strong>Pressure increases with the density of the fluid.</strong> Mercury produces far more
                pressure than water at the same depth because it is much denser.
              </li>
            </ol>
            <p>
              A fourth point catches people out: pressure at a given depth does <strong>not</strong> depend on
              the shape or width of the container. A narrow pipe of water 5 m deep gives exactly the same
              pressure at its base as a huge tank 5 m deep.
            </p>
            <Figure src={physImages.pressureLiquid} alt="Pressure in liquids increases with depth" />
            <Formula>P = h &rho; g &nbsp;&nbsp;(depth &times; density &times; gravitational field strength)</Formula>
            <Example>
              <p>
                Find the pressure due to the water at the bottom of a tank 4 m deep. Take the density of water
                as 1 000 kg/m&sup3; and g as 10 N/kg.
              </p>
              <p>P = h &rho; g = 4 &times; 1 000 &times; 10 = <strong>40 000 Pa</strong> (40 kPa)</p>
              <p>
                The total pressure at the bottom is this plus atmospheric pressure: 40 000 + 100 000 ={' '}
                <strong>140 000 Pa</strong>.
              </p>
            </Example>
          </Card>

          <div className="rounded-xl border-2 border-sky-200 bg-sky-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-sky-700">
              Experiment 2: Showing that Pressure Increases with Depth
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To show that the pressure in a liquid increases as the depth increases.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> A tall plastic bottle or tin can, a nail or drill, water, a tray to
              catch the water, sticky tape.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
              <li>
                Make three identical holes in a vertical line up the side of the bottle — near the bottom, in
                the middle and near the top. The holes must be the same size so the test is fair.
              </li>
              <li>Cover the holes with tape, stand the bottle on the tray and fill it with water.</li>
              <li>Remove the tape and watch the three jets of water.</li>
            </ol>
            <Figure
              src={physImages.pressureDepthExperiment}
              alt="Bottle with three holes showing water jets of different lengths"
              caption="Fig 3.2 — The jet from the lowest hole travels furthest, because the pressure there is greatest."
            />
            <p className="mt-3 text-sm text-slate-700">
              <strong>Observation:</strong> The jet from the <strong>lowest</strong> hole squirts out
              furthest; the jet from the top hole barely dribbles out.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Pressure in a liquid increases with depth, because there is a
              greater weight of water above the lower hole pushing outwards.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Application:</strong> This is why the wall of a dam such as Kariba is built{' '}
              <strong>much thicker at the base than at the top</strong> — it has to withstand the greatest
              pressure at the deepest point.
            </p>
            <Figure
              src={physImages.damWall}
              alt="Cross-section of a dam wall thicker at the base with pressure arrows increasing with depth"
              caption="Fig 3.3 — A dam wall in cross-section. The arrows show the water pressure growing steadily with depth."
            />
          </div>

          <Card title="Pressure Acts in All Directions">
            <Figure
              src={physImages.pressureAllDirections}
              alt="Thistle funnel with a rubber membrane turned in different directions at the same depth in water"
              caption="Fig 3.4 — At one fixed depth, the membrane bulges by the same amount whichever way the funnel faces, proving that pressure acts equally in all directions."
            />
            <p>
              Stretch a thin rubber sheet over the mouth of a thistle funnel, connect it to a manometer and
              lower it into water. At a fixed depth, turning the funnel to face downwards, sideways or upwards
              gives exactly the same reading. Go deeper and the reading increases. This is why a submarine
              hull has to be strong all the way round, not just on top.
            </p>
          </Card>

          <Card title="The Manometer">
            <Definition term="Manometer">
              a U-shaped tube partly filled with liquid, used to measure the pressure of a gas supply by
              comparing it with atmospheric pressure.
            </Definition>
            <Figure src={physImages.manometerSvg} alt="Manometer diagram" />
            <Figure
              src={physImages.manometerLabelled}
              alt="Labelled U-tube manometer connected to a gas tap with the height difference marked"
              caption="Fig 3.5 — A manometer connected to a gas tap. The difference in the two liquid levels, h, is what matters."
            />
            <p>
              One arm is connected to the gas supply and the other is open to the air. If the gas pressure is
              greater than atmospheric pressure, it pushes the liquid down its arm and up the open arm, giving
              a height difference h.
            </p>
            <Formula>P(gas) = P(atmosphere) + h &rho; g</Formula>
            <Example>
              <p>
                A water manometer shows a height difference of 20 cm. Atmospheric pressure is 100 000 Pa, the
                density of water is 1 000 kg/m&sup3; and g = 10 N/kg. Find the gas pressure.
              </p>
              <p>First convert: h = 20 cm = 0.20 m</p>
              <p>Extra pressure = h &rho; g = 0.20 &times; 1 000 &times; 10 = 2 000 Pa</p>
              <p>Gas pressure = 100 000 + 2 000 = <strong>102 000 Pa</strong></p>
            </Example>
            <WatchOut>
              <p>
                Always convert the height into <strong>metres</strong> before using h&rho;g. Leaving it in
                centimetres makes the answer a hundred times too big, and is the single most common error in
                these questions.
              </p>
            </WatchOut>
          </Card>

          <Card title="Atmospheric Pressure">
            <p>
              We live at the bottom of an ocean of air about 100 km deep, and its weight presses on everything
              from all sides. At sea level this <strong>atmospheric pressure</strong> is about{' '}
              <strong>100 000 Pa</strong> (often written as 1 atmosphere, or 760 mm of mercury). We do not
              feel it because the pressure inside our bodies pushes outwards by the same amount.
            </p>
            <Figure
              src={physImages.mercuryBarometer}
              alt="Simple mercury barometer showing a 760 mm column supported by atmospheric pressure"
              caption="Fig 3.6 — A simple mercury barometer. Atmospheric pressure supports a column of mercury 760 mm high; above the mercury is a vacuum."
            />
            <p>
              Atmospheric pressure <strong>falls as you go higher</strong>, because there is less air above
              you. Zimbabwe sits high on a plateau — Harare is about 1 500 m above sea level — so atmospheric
              pressure here is noticeably lower than at the coast, and water boils at about 96 &deg;C instead
              of 100 &deg;C.
            </p>
            <Figure
              src={physImages.crushingCan}
              alt="Metal can being crushed by atmospheric pressure after steam inside condenses"
              caption="Fig 3.7 — The crushing can demonstration: steam drives the air out, the can is sealed and cooled, the steam condenses leaving low pressure inside, and the atmosphere crushes the can."
            />
            <p className="font-semibold text-slate-800">Things that work because of atmospheric pressure:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Drinking straw</strong> — you lower the pressure in your mouth, and the atmosphere
                pushes the drink up the straw.
              </li>
              <li>
                <strong>Syringe</strong> — pulling the plunger back lowers the pressure inside so liquid is
                pushed in.
              </li>
              <li>
                <strong>Rubber sucker</strong> — squeezing out the air leaves low pressure behind, so the
                atmosphere holds the sucker firmly against the wall.
              </li>
              <li>
                <strong>Lift pump</strong> — the atmosphere pushes water up the pipe when the piston reduces
                the pressure above it.
              </li>
              <li>
                <strong>Siphon</strong> — atmospheric pressure pushes liquid up and over the bend and down the
                longer arm.
              </li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Pressure Key Points"
            items={[
              'P = F ÷ A, in pascals (1 Pa = 1 N/m²)',
              'Small area → high pressure',
              'P = hρg for pressure inside a liquid',
              'Pressure increases with depth and density',
              'Pressure acts equally in all directions',
              'Shape of the container makes no difference',
              'Atmospheric pressure ≈ 100 000 Pa at sea level',
              'Always convert the depth to metres first',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Quick self-test</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
              <li>Why is the base of a dam wall thicker than the top?</li>
              <li>Find the pressure of 900 N acting on 0.3 m².</li>
              <li>Find the pressure 5 m below the surface of water (ρ = 1000 kg/m³).</li>
              <li>Explain how a drinking straw works.</li>
            </ol>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     4. PUMPS AND HYDRAULICS
  ======================================================================= */
  {
    id: 'pumps-hydraulics',
    title: 'Pumps and Hydraulics',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Liquids have a property that makes them extraordinarily useful in machines: they{' '}
              <strong>cannot be squashed</strong>. Push on a liquid at one point and every part of it feels
              that push at once, undiminished. That is why a person can lift a whole car with one hand on a
              hydraulic jack, and why a light touch on a brake pedal can stop a lorry.
            </p>
          </div>

          <Definition term="Pascal's principle">
            pressure applied to an enclosed liquid is transmitted equally and undiminished to every part of
            that liquid and to the walls of the container.
          </Definition>

          <Card title="Why Liquids and Not Gases">
            <p>
              Gases <strong>are</strong> compressible: squeeze a gas and the particles simply move closer
              together, absorbing your push instead of passing it on. Liquid particles are already touching,
              so they have nowhere to go and must pass the push straight along. This is why hydraulic systems
              use oil or brake fluid and why an air bubble in a brake line is dangerous — the bubble squashes
              and the braking force is lost.
            </p>
          </Card>

          <Card title="The Lift Pump">
            <p>
              A lift pump raises water from a well using <strong>atmospheric pressure</strong>. It has a
              cylinder, a piston with a valve in it (valve A) and a second valve at the bottom of the cylinder
              (valve B).
            </p>
            <Figure
              src={physImages.liftPumpStrokes}
              alt="Lift pump shown on the upstroke and on the downstroke with valve positions marked"
              caption="Fig 4.1 — The lift pump. Left: upstroke, valve B open and valve A closed. Right: downstroke, valve B closed and valve A open."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Stroke</th>
                  <th className="border p-2 text-left">What happens</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Upstroke (handle pushed down, piston rises)</td>
                  <td className="border p-2">
                    Valve A closes and valve B opens. The pressure below the piston falls, so atmospheric
                    pressure on the well water pushes water up the pipe into the cylinder. At the same time,
                    any water already above the piston is lifted and pours out of the spout.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Downstroke (piston falls)</td>
                  <td className="border p-2">
                    Valve B closes so water cannot go back down the pipe, and valve A opens so water passes
                    up through the piston, ready to be lifted on the next upstroke.
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="font-semibold text-slate-800">Limitations</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                It cannot lift water from deeper than about <strong>10 m</strong> in theory, and about 8&ndash;9 m
                in practice, because that is the greatest height that atmospheric pressure can support a
                column of water.
              </li>
              <li>
                It usually needs <strong>priming</strong> — pouring water in at the top first to seal the
                piston and valves so they can create suction.
              </li>
              <li>Water is delivered only on the upstroke, so the flow comes in spurts rather than steadily.</li>
            </ul>
            <Example title="Why 10 metres?">
              <p>
                Atmospheric pressure is about 100 000 Pa. Rearranging P = h&rho;g gives h = P &divide; &rho;g.
              </p>
              <p>h = 100 000 &divide; (1 000 &times; 10) = <strong>10 m</strong></p>
              <p>
                No suction pump anywhere in the world can lift water higher than this, no matter how well it
                is made.
              </p>
            </Example>
          </Card>

          <Card title="The Force Pump">
            <p>
              A force pump overcomes the lift pump&rsquo;s limitation by <strong>pushing</strong> water rather
              than relying on suction alone. It has a solid piston, an inlet valve, an outlet valve and an air
              chamber.
            </p>
            <Figure
              src={physImages.forcePumpStrokes}
              alt="Force pump shown on the upstroke and downstroke with air chamber labelled"
              caption="Fig 4.2 — The force pump. The air chamber is the key extra part: the trapped air is compressed on the downstroke and pushes water out steadily between strokes."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Stroke</th>
                  <th className="border p-2 text-left">What happens</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Upstroke</td>
                  <td className="border p-2">
                    The inlet valve opens and the outlet valve closes. Atmospheric pressure pushes water up
                    into the barrel.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Downstroke</td>
                  <td className="border p-2">
                    The inlet valve closes and the outlet valve opens. The piston forces water through into
                    the air chamber, compressing the air trapped there. That compressed air then pushes water
                    steadily out even while the piston is rising again.
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">
              <strong>Advantages over the lift pump:</strong> it can raise water far higher than 10 m, because
              the height now depends on how hard you push, not on atmospheric pressure; and the air chamber
              gives a continuous flow instead of spurts.
            </p>
          </Card>

          <Card title="The Bush Pump">
            <p>
              The <strong>Zimbabwe Bush Pump</strong> (developed from the Blair pump) is a hand pump designed
              for rural boreholes and deep wells. It combines the lift and force pump principles, with the
              cylinder placed down inside the water so that it pushes water up rather than trying to suck it
              from the surface.
            </p>
            <Figure
              src={physImages.bushPump}
              alt="Labelled diagram of a Zimbabwe Bush Pump on a borehole"
              caption="Fig 4.3 — The Zimbabwe Bush Pump: head assembly, pump rod, rising main, cylinder and foot valve down in the water."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>Because the cylinder sits below the water level, it can raise water from far deeper than 10 m.</li>
              <li>Made largely of steel and plastic parts that are cheap, tough and easy to replace locally.</li>
              <li>Simple enough for a village pump-minder to repair without specialist tools.</li>
              <li>No lubricating oil is used, so the water stays clean, colourless and odourless.</li>
              <li>Needs no fuel or electricity — it is worked entirely by hand.</li>
            </ul>
          </Card>

          <Card title="The Hydraulic Press and Jack">
            <p>
              A hydraulic machine uses Pascal&rsquo;s principle to turn a small force into a large one. It has
              a narrow piston (where you push) connected by liquid to a wide piston (where the load sits).
              Because the pressure is the same throughout the liquid, the wide piston, having a much larger
              area, experiences a much larger force.
            </p>
            <Figure
              src={physImages.hydraulicPress}
              alt="Hydraulic press with a small effort piston and a large load piston labelled with areas and forces"
              caption="Fig 4.4 — A hydraulic press. The pressure is the same everywhere in the liquid, so the force is multiplied in proportion to the piston areas."
            />
            <Formula>F₁ &divide; A₁ = F₂ &divide; A₂ &nbsp;&nbsp;(pressure is the same on both pistons)</Formula>
            <Example title="Worked example 1">
              <p>
                An effort of 20 N is applied to a piston of area 10 cm&sup2;. The load piston has an area of
                100 cm&sup2;. What load can be lifted?
              </p>
              <p>Pressure = 20 &divide; 10 = 2 N/cm&sup2;</p>
              <p>Force on the large piston = 2 &times; 100 = <strong>200 N</strong></p>
              <p>The machine has multiplied the force ten times, because the area is ten times greater.</p>
            </Example>
            <p className="font-semibold text-slate-800">Machine performance</p>
            <Formula>
              MA = load &divide; effort &nbsp;&nbsp;·&nbsp;&nbsp; VR = A(load) &divide; A(effort)
              &nbsp;&nbsp;·&nbsp;&nbsp; efficiency = (MA &divide; VR) &times; 100%
            </Formula>
            <Example title="Worked example 2">
              <p>
                In the press above, MA = 200 &divide; 20 = 10 and VR = 100 &divide; 10 = 10, so efficiency =
                (10 &divide; 10) &times; 100 = <strong>100%</strong>.
              </p>
              <p>
                A real machine is never 100% efficient, because some energy is always lost overcoming friction
                between the pistons and the cylinder walls, and some liquid may leak past the seals.
              </p>
            </Example>
            <WatchOut>
              <p>
                A hydraulic press multiplies force, but it does <strong>not</strong> create energy. The small
                piston has to move a long way to make the large piston move a short way. Energy in = energy
                out; nothing is gained for free.
              </p>
            </WatchOut>
          </Card>

          <Card title="Hydraulic Brakes">
            <Figure
              src={physImages.hydraulicBrakes}
              alt="Car hydraulic braking system from pedal and master cylinder to wheel cylinders and brake pads"
              caption="Fig 4.5 — A hydraulic braking system. One master cylinder operates all four wheels, and because the pressure is transmitted equally the braking force is the same at each wheel."
            />
            <ol className="list-inside list-decimal space-y-1">
              <li>The driver presses the brake pedal, which pushes the piston in the master cylinder.</li>
              <li>Pressure is created in the brake fluid.</li>
              <li>That pressure is transmitted equally through the pipes to the cylinders at every wheel.</li>
              <li>
                The wheel cylinder pistons, having a larger area, push with a bigger force, pressing the brake
                pads or shoes against the disc or drum.
              </li>
              <li>Friction slows the wheel and the car stops.</li>
            </ol>
            <Safety>
              <p>
                Air bubbles must never be allowed into the brake fluid. Air is compressible, so instead of
                transmitting the pressure it simply squashes, and the pedal goes soft or right to the floor.
                This is why brakes are &ldquo;bled&rdquo; after any repair.
              </p>
            </Safety>
          </Card>

          <Card title="The Bicycle Pump">
            <p>
              A bicycle pump is a simple <strong>gas</strong> pump — and here compressibility is exactly what
              you want.
            </p>
            <Figure
              src={physImages.bicyclePump}
              alt="Bicycle pump in cross-section showing the leather cup washer on the push and pull strokes"
              caption="Fig 4.6 — The cup washer acts as a one-way valve: it seals against the barrel on the push stroke and folds inwards to let air past on the pull stroke."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Push stroke:</strong> the leather or rubber cup washer presses tightly against the
                barrel wall, so the air is trapped and compressed until its pressure is high enough to force
                open the tyre valve and flow in.
              </li>
              <li>
                <strong>Pull stroke:</strong> the tyre valve closes so no air escapes back, and the edge of
                the cup washer folds inwards, letting fresh air past into the barrel ready for the next push.
              </li>
            </ul>
            <p>
              The pump barrel becomes noticeably warm during use, partly because compressing a gas raises its
              temperature and partly because of friction between the washer and the barrel.
            </p>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Pumps & Hydraulics Key Points"
            items={[
              'Liquids are incompressible; gases are not',
              "Pascal: pressure is transmitted equally throughout",
              'Lift pump limited to about 10 m; needs priming',
              'Force pump: air chamber gives continuous flow',
              'Bush pump: cylinder below water, works at great depth',
              'F₁/A₁ = F₂/A₂ for a hydraulic press',
              'MA = load ÷ effort; VR = area ratio',
              'Air in brake fluid makes brakes fail',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">The valve rule</h3>
            <p className="text-sm text-slate-700">
              In every pump question, work out which valve is open and which is closed on each stroke. Water
              can only move in one direction through a valve — trace the path and the answer follows.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     5. ENERGY
  ======================================================================= */
  {
    id: 'energy',
    title: 'Energy – Solar & Thermos Flask',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Energy</strong> is the ability to do work, and it is measured in{' '}
              <strong>joules (J)</strong>. It cannot be created or destroyed — only changed from one form
              into another. That statement is the <strong>law of conservation of energy</strong>, and every
              device in this section is simply a clever way of steering an energy change in a useful
              direction.
            </p>
          </div>

          <Card title="Renewable and Non-Renewable Sources">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left"></th>
                  <th className="border p-2 text-left">Renewable</th>
                  <th className="border p-2 text-left">Non-renewable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Meaning</td>
                  <td className="border p-2">Will not run out; replaced naturally as fast as it is used</td>
                  <td className="border p-2">Once used it is gone; took millions of years to form</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Examples</td>
                  <td className="border p-2">Solar, wind, hydroelectric, biomass, geothermal, tidal</td>
                  <td className="border p-2">Coal, crude oil, natural gas, nuclear fuel</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pollution</td>
                  <td className="border p-2">Little or none while operating</td>
                  <td className="border p-2">Produces carbon dioxide, sulphur dioxide and ash</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Reliability</td>
                  <td className="border p-2">
                    Varies with weather and season — no sun at night, no power without wind
                  </td>
                  <td className="border p-2">Available on demand, day or night</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="The Three Ways Heat Travels">
            <p>
              You cannot understand a solar cooker or a thermos flask until you can name and describe the
              three ways heat moves. Every one of the devices below either encourages one of them or blocks
              it.
            </p>
            <Figure
              src={physImages.heatTransferThreeWays}
              alt="Conduction along a metal rod, convection current in water, and radiation from a fire"
              caption="Fig 5.1 — Conduction needs a solid; convection needs a fluid that can flow; radiation needs no material at all."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Method</th>
                  <th className="border p-2 text-left">How it works</th>
                  <th className="border p-2 text-left">Where it happens</th>
                  <th className="border p-2 text-left">Everyday example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Conduction</td>
                  <td className="border p-2">
                    Heat passes from particle to particle as they vibrate against their neighbours; the
                    particles themselves do not move along
                  </td>
                  <td className="border p-2">
                    Mainly in solids, especially metals; poor in liquids, gases and a vacuum (impossible)
                  </td>
                  <td className="border p-2">
                    The handle of a metal spoon left in hot porridge becomes hot
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Convection</td>
                  <td className="border p-2">
                    Heated fluid expands, becomes less dense and rises; cooler denser fluid sinks to take its
                    place, setting up a circulating current
                  </td>
                  <td className="border p-2">Liquids and gases only; impossible in solids or a vacuum</td>
                  <td className="border p-2">
                    Water circulating in a kettle; warm air rising above a fire
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Radiation</td>
                  <td className="border p-2">
                    Heat travels as infrared waves, needing no material at all
                  </td>
                  <td className="border p-2">Through a vacuum, air, or anything transparent</td>
                  <td className="border p-2">
                    Feeling the Sun&rsquo;s warmth across 150 million km of empty space
                  </td>
                </tr>
              </tbody>
            </table>
            <ExamTip>
              <p>
                Remember two rules about radiation: <strong>dull black surfaces</strong> are the best emitters
                and the best absorbers of heat radiation, while <strong>shiny silvery surfaces</strong> are
                the worst emitters and the best reflectors. Every question about painting something black or
                silvering it comes back to this.
              </p>
            </ExamTip>
          </Card>

          <Card title="The Solar Cooker">
            <p>
              A solar cooker uses the Sun&rsquo;s radiation to cook food, with no firewood, paraffin or
              electricity at all.
            </p>
            <Figure
              src={physImages.solarCooker}
              alt="Parabolic solar cooker and box solar cooker labelled with reflector, focus and black pot"
              caption="Fig 5.2 — Left: a parabolic (curved mirror) cooker concentrates the rays onto the focus. Right: a box cooker traps heat under a glass lid."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                The <strong>shiny curved reflector</strong> reflects the parallel rays from the Sun and brings
                them together at one point — the <strong>focus</strong> — where the pot sits. Concentrating
                the radiation from a large area onto a small area is what makes it hot enough to cook.
              </li>
              <li>
                The <strong>pot is painted dull black</strong> so it absorbs as much of the radiation as
                possible.
              </li>
              <li>
                In a box cooker, a <strong>glass lid</strong> lets short-wavelength radiation in but traps the
                longer-wavelength radiation given off inside — the same greenhouse effect that warms a parked
                car.
              </li>
              <li>The box is lined with insulation to stop heat escaping by conduction.</li>
              <li>The cooker must be turned every so often to keep it facing the Sun.</li>
            </ul>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-emerald-700">Advantages</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>The fuel is free and will never run out</li>
                  <li>No smoke, so no chest illness and no air pollution</li>
                  <li>Saves trees and reduces deforestation</li>
                  <li>No risk of a cooking fire spreading</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-rose-700">Disadvantages</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Useless at night or on a cloudy day</li>
                  <li>Cooking is slower than on a fire or stove</li>
                  <li>Must be moved to follow the Sun</li>
                  <li>The initial cost of a good cooker is high</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card title="The Solar Water Heater">
            <Figure
              src={physImages.solarWaterHeater}
              alt="Roof mounted solar water heater with black collector panel, copper pipes, glass cover and storage tank"
              caption="Fig 5.3 — A solar water heater. Hot water rises naturally into the tank and cold water sinks back into the panel, so no pump is needed."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                A flat <strong>collector panel</strong> is mounted on the roof, tilted to face the Sun.
              </li>
              <li>
                Inside it, <strong>copper pipes</strong> carry the water. Copper is used because it is an
                excellent conductor of heat.
              </li>
              <li>
                The pipes and the backing plate are <strong>painted dull black</strong> so they absorb the
                maximum radiation.
              </li>
              <li>
                A <strong>glass cover</strong> lets radiation in and traps the heat, while also keeping wind
                off the pipes.
              </li>
              <li>
                <strong>Insulation</strong> behind the panel stops heat being conducted away into the roof.
              </li>
              <li>
                The <strong>storage tank sits above the panel</strong> so that a natural convection current (a
                thermosiphon) carries hot water up into the tank while cooler water sinks back down into the
                panel.
              </li>
            </ul>
          </Card>

          <Card title="Solar Panels (Photovoltaic Cells)">
            <p>
              A solar water heater turns sunlight into <strong>heat</strong>. A photovoltaic panel is
              different — it turns sunlight directly into <strong>electricity</strong>.
            </p>
            <Figure
              src={physImages.solarPvSystem}
              alt="Solar photovoltaic system from panel through charge controller and battery to inverter and appliances"
              caption="Fig 5.4 — A household PV system. The battery stores energy for night-time use and the inverter converts 12 V DC into 230 V AC for ordinary appliances."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                The <strong>panel</strong> is made of many photovoltaic cells that produce direct current
                (DC) when light falls on them.
              </li>
              <li>
                The <strong>charge controller</strong> stops the battery from being overcharged or drained too
                far.
              </li>
              <li>
                The <strong>battery</strong> stores the energy so it can be used at night or on cloudy days.
              </li>
              <li>
                The <strong>inverter</strong> changes the low-voltage DC into 230 V alternating current, which
                is what ordinary household appliances need.
              </li>
            </ul>
          </Card>

          <Card title="The Vacuum (Thermos) Flask">
            <p>
              A thermos flask is the perfect exam question, because it is a single object designed to block{' '}
              <strong>all three</strong> methods of heat transfer at once. It works equally well at keeping
              hot things hot and cold things cold, because in both cases it is simply slowing heat transfer
              down.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <Figure src={physImages.thermosFlaskSvg} alt="Thermos flask cross-section" />
              <Figure
                src={physImages.thermosFlaskLabelled}
                alt="Detailed labelled thermos flask cross-section with arrows showing blocked heat transfer"
                caption="Fig 5.5 — Each feature blocks one route by which heat could escape."
              />
            </div>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">What it stops</th>
                  <th className="border p-2 text-left">How</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Vacuum between the double walls</td>
                  <td className="border p-2">Conduction and convection</td>
                  <td className="border p-2">
                    There are no particles in a vacuum, so heat cannot be passed from particle to particle and
                    no convection current can form
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Silvered inner surfaces</td>
                  <td className="border p-2">Radiation</td>
                  <td className="border p-2">
                    Shiny surfaces are poor emitters and good reflectors, so heat radiation is bounced back
                    into the liquid (or kept out, for a cold drink)
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Insulating plastic or cork stopper</td>
                  <td className="border p-2">Conduction, convection and evaporation</td>
                  <td className="border p-2">
                    Plastic and cork are poor conductors, and the stopper seals in the hot vapour that would
                    otherwise carry energy away
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Glass vessel</td>
                  <td className="border p-2">Conduction</td>
                  <td className="border p-2">Glass is a much poorer conductor of heat than metal</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Foam or cork supports</td>
                  <td className="border p-2">Conduction</td>
                  <td className="border p-2">
                    Hold the inner vessel away from the outer casing so there is almost no direct contact for
                    heat to travel through
                  </td>
                </tr>
              </tbody>
            </table>
            <WatchOut>
              <p>
                A thermos flask does not &ldquo;keep the cold in&rdquo;. Cold is not a substance. What the
                flask does is slow down the movement of <strong>heat</strong> — outwards from a hot drink or
                inwards to a cold one.
              </p>
            </WatchOut>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Energy Key Points"
            items={[
              'Energy is measured in joules and cannot be created or destroyed',
              'Renewable: solar, wind, hydro, biomass',
              'Conduction – solids; convection – fluids; radiation – no medium',
              'Dull black: best absorber and emitter',
              'Shiny silver: best reflector, worst emitter',
              'Solar cooker: reflector concentrates rays at the focus',
              'Solar heater: black copper pipes under glass, tank above',
              'Thermos flask blocks all three heat transfers',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Answer structure</h3>
            <p className="text-sm text-slate-700">
              For &ldquo;explain how the thermos flask reduces heat loss&rdquo;, give three separate points —
              one for conduction, one for convection and one for radiation — and name the feature responsible
              in each case. Three points, three marks.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     6. TELECOMMUNICATION
  ======================================================================= */
  {
    id: 'telecommunication',
    title: 'Telecommunication',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Telecommunication</strong> means communicating over a distance. In every system the same
              three things happen: a message is <strong>converted into a signal</strong>, the signal is{' '}
              <strong>transmitted</strong> through some medium, and at the far end it is{' '}
              <strong>converted back</strong> into a form a person can understand. Understanding that pattern
              makes every device in this topic easier to follow.
            </p>
          </div>

          <Card title="Sound Waves">
            <Definition term="Sound">
              a form of energy produced by a vibrating object, which travels as a{' '}
              <strong>longitudinal wave</strong> through a material medium. Sound cannot travel through a
              vacuum, because there are no particles to pass the vibration along.
            </Definition>
            <Figure src={physImages.soundWaves} alt="Longitudinal sound wave with compressions and rarefactions" />
            <p>
              In a longitudinal wave the particles vibrate <strong>backwards and forwards along the same
              direction</strong> in which the wave is travelling. Where the particles are pushed together you
              get a <strong>compression</strong> (high pressure); where they are pulled apart you get a{' '}
              <strong>rarefaction</strong> (low pressure).
            </p>
            <Figure
              src={physImages.waveParts}
              alt="Wave diagram with wavelength, amplitude, crest and trough labelled"
              caption="Fig 6.1 — The parts of a wave. Amplitude controls loudness; frequency controls pitch."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Quantity</th>
                  <th className="border p-2 text-left">Meaning</th>
                  <th className="border p-2 text-left">Unit</th>
                  <th className="border p-2 text-left">What we hear</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Wavelength (&lambda;)</td>
                  <td className="border p-2">Distance from one compression to the next</td>
                  <td className="border p-2">metre (m)</td>
                  <td className="border p-2">—</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Frequency (f)</td>
                  <td className="border p-2">Number of complete waves passing a point each second</td>
                  <td className="border p-2">hertz (Hz)</td>
                  <td className="border p-2">
                    <strong>Pitch</strong> — high frequency means a high note
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Amplitude</td>
                  <td className="border p-2">Maximum distance a particle moves from its rest position</td>
                  <td className="border p-2">metre (m)</td>
                  <td className="border p-2">
                    <strong>Loudness</strong> — large amplitude means a loud sound
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Period (T)</td>
                  <td className="border p-2">Time for one complete wave to pass</td>
                  <td className="border p-2">second (s)</td>
                  <td className="border p-2">T = 1 &divide; f</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Speed (v)</td>
                  <td className="border p-2">How fast the wave travels</td>
                  <td className="border p-2">m/s</td>
                  <td className="border p-2">About 340 m/s in air</td>
                </tr>
              </tbody>
            </table>
            <Formula>v = f &lambda; &nbsp;&nbsp;(speed = frequency &times; wavelength)</Formula>
            <Example>
              <p>A sound wave has a frequency of 680 Hz and travels through air at 340 m/s. Find its wavelength.</p>
              <p>&lambda; = v &divide; f = 340 &divide; 680 = <strong>0.5 m</strong></p>
            </Example>
            <p>
              The <strong>audible range</strong> for a healthy young person is about{' '}
              <strong>20 Hz to 20 000 Hz</strong>. Sound above 20 kHz is called <strong>ultrasound</strong>,
              and is used for pre-natal scanning, cleaning delicate instruments and finding cracks in metal.
            </p>
            <Figure
              src={physImages.soundInMedia}
              alt="Bar chart comparing the speed of sound in air, water and steel"
              caption="Fig 6.2 — Sound travels fastest in solids, where the particles are closest together and pass the vibration on most quickly."
            />
            <p>
              Sound travels at about <strong>340 m/s in air</strong>, <strong>1 500 m/s in water</strong> and{' '}
              <strong>5 000 m/s in steel</strong>. An <strong>echo</strong> is sound reflected from a hard
              surface, and it is used in <strong>sonar</strong> to measure the depth of the sea and in
              medicine to build images of the body.
            </p>
          </Card>

          <Card title="Analogue and Digital Signals">
            <Figure
              src={physImages.analogueVsDigital}
              alt="A smooth continuous analogue waveform beside a square digital pulse train"
              caption="Fig 6.3 — An analogue signal varies smoothly and continuously; a digital signal is a stream of on/off pulses representing 1s and 0s."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left"></th>
                  <th className="border p-2 text-left">Analogue</th>
                  <th className="border p-2 text-left">Digital</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Form</td>
                  <td className="border p-2">A continuously varying wave</td>
                  <td className="border p-2">Separate pulses — only two values, 1 and 0</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Effect of noise</td>
                  <td className="border p-2">
                    Noise is added to the signal and cannot be removed, so quality falls with distance
                  </td>
                  <td className="border p-2">
                    A pulse is either there or not, so the original can be rebuilt exactly
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Amplification</td>
                  <td className="border p-2">Amplifying the signal amplifies the noise too</td>
                  <td className="border p-2">Pulses are regenerated cleanly at each repeater</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Quantity of data</td>
                  <td className="border p-2">Less information per second</td>
                  <td className="border p-2">Far more; can be compressed and encrypted</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="The Telephone">
            <Figure
              src={physImages.telephoneSystem}
              alt="Landline telephone system showing microphone, transmission line and earpiece"
              caption="Fig 6.4 — A landline call: sound energy → electrical energy → back to sound energy."
            />
            <p>
              <strong>Landline:</strong> the <strong>mouthpiece</strong> contains a microphone. Sound waves
              make a diaphragm vibrate, and this changes an electric current so that the current copies the
              pattern of the sound. The varying current travels along the wires. At the other end the{' '}
              <strong>earpiece</strong> contains a small loudspeaker that turns the varying current back into
              vibrations of a diaphragm, and so back into sound.
            </p>
            <p className="font-semibold text-slate-800">Energy changes:</p>
            <p>sound energy &rarr; electrical energy &rarr; sound energy</p>
            <Figure
              src={physImages.cellphoneNetwork}
              alt="Cellphone call routed through base station masts and an exchange to another phone"
              caption="Fig 6.5 — A mobile call: the phone converts your voice into a digital radio signal, which travels to the nearest mast and on through the network."
            />
            <p>
              <strong>Cellphone:</strong> the microphone converts your voice into an electrical signal, which
              is digitised and transmitted as <strong>radio waves</strong> to the nearest base station
              (mast). The network routes the call — by cable, microwave link or satellite — to the mast
              nearest the person you are calling, which transmits it to their handset, where the process is
              reversed.
            </p>
          </Card>

          <Card title="Transmission Media">
            <Figure
              src={physImages.transmissionMedia}
              alt="Cross-sections of twisted pair, coaxial cable and optical fibre beside wireless media icons"
              caption="Fig 6.6 — Guided media carry the signal along a physical path; unguided (wireless) media send it through open space."
            />
            <p className="font-semibold text-slate-800">Guided media (the signal travels along a cable)</p>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Medium</th>
                  <th className="border p-2 text-left">What it is</th>
                  <th className="border p-2 text-left">Advantages</th>
                  <th className="border p-2 text-left">Disadvantages</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Twisted pair</td>
                  <td className="border p-2">
                    Pairs of insulated copper wires twisted together (CAT5, CAT6, telephone cable)
                  </td>
                  <td className="border p-2">Cheap, easy to install, widely available</td>
                  <td className="border p-2">
                    Low bandwidth, signal weakens quickly (high attenuation), picks up interference
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Coaxial cable</td>
                  <td className="border p-2">
                    A central copper core surrounded by insulation and a braided metal shield
                  </td>
                  <td className="border p-2">
                    Higher bandwidth than twisted pair; the shield keeps out interference
                  </td>
                  <td className="border p-2">Bulkier and more expensive; still slower than fibre</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Optical fibre</td>
                  <td className="border p-2">
                    Very thin strands of glass that carry pulses of light
                  </td>
                  <td className="border p-2">
                    Enormous bandwidth, very low signal loss over long distances, completely immune to
                    electrical interference, hard to tap into
                  </td>
                  <td className="border p-2">
                    Expensive to buy and to install; fragile; needs specialist equipment to join
                  </td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={physImages.opticalFibreTir}
              alt="Light ray bouncing along an optical fibre by total internal reflection"
              caption="Fig 6.7 — Light travels along an optical fibre by total internal reflection, bouncing off the inside surface without escaping, even around bends."
            />
            <p className="font-semibold text-slate-800">Unguided media (wireless — the signal travels through space)</p>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Medium</th>
                  <th className="border p-2 text-left">Typical use</th>
                  <th className="border p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Radio waves</td>
                  <td className="border p-2">Radio and television broadcasting, cellphones</td>
                  <td className="border p-2">Travel long distances and bend around obstacles</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Microwaves</td>
                  <td className="border p-2">Point-to-point links between towers, mobile backhaul</td>
                  <td className="border p-2">
                    Need a clear line of sight; heavy rain can weaken the signal
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Satellite</td>
                  <td className="border p-2">International calls, television, GPS, rural internet</td>
                  <td className="border p-2">
                    Covers huge areas including remote places, but expensive and there is a noticeable delay
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Infrared</td>
                  <td className="border p-2">TV remote controls, short-range data links</td>
                  <td className="border p-2">Very short range and cannot pass through walls</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Bluetooth</td>
                  <td className="border p-2">Headphones, speakers, file transfer between phones</td>
                  <td className="border p-2">Short range (about 10 m), low power, low cost</td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={physImages.satelliteCommunication}
              alt="Satellite communication showing uplink from a ground station and downlink to another"
              caption="Fig 6.8 — Satellite communication. The signal goes up (uplink), is amplified and re-transmitted by the satellite, and comes back down (downlink) over a huge area."
            />
          </Card>

          <Card title="The Electromagnetic Spectrum">
            <Figure
              src={physImages.emSpectrum}
              alt="Electromagnetic spectrum from radio waves to gamma rays with uses labelled"
              caption="Fig 6.9 — The electromagnetic spectrum. All these waves travel at 3 × 10⁸ m/s in a vacuum; only the wavelength and frequency differ."
            />
            <p>
              In order of increasing frequency (and decreasing wavelength):{' '}
              <strong>radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays</strong>.
              A useful mnemonic is <em>&ldquo;Really Made In Very eXpensive Great ovens&rdquo;</em> — but note
              that visible light sits between infrared and ultraviolet.
            </p>
          </Card>

          <Card title="Modern Telecommunication — the Good and the Bad">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-emerald-700">Benefits</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Instant contact with family, business and emergency services</li>
                  <li>Mobile money and online banking</li>
                  <li>Access to education, e-learning and information</li>
                  <li>Faster warnings about storms, floods and disease outbreaks</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-rose-700">Problems</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Cost of data and handsets excludes some people</li>
                  <li>Spread of false information and online fraud</li>
                  <li>Loss of privacy and cyber-bullying</li>
                  <li>Less face-to-face contact and screen addiction</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Telecom Key Points"
            items={[
              'Sound is a longitudinal wave; it needs a medium',
              'Compressions and rarefactions',
              'Frequency → pitch; amplitude → loudness',
              'v = fλ; sound ≈ 340 m/s in air',
              'Audible range 20 Hz – 20 000 Hz',
              'Digital signals resist noise better than analogue',
              'Guided: twisted pair, coaxial, optical fibre',
              'Optical fibre works by total internal reflection',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Energy-change questions</h3>
            <p className="text-sm text-slate-700">
              For any communication device, write the energy chain: microphone = sound → electrical;
              loudspeaker = electrical → sound; solar cell = light → electrical; lamp = electrical → light and
              heat.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     7. ELECTRICITY
  ======================================================================= */
  {
    id: 'electricity',
    title: 'Electricity – Generation, Transmission & Safety',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Electricity is not a source of energy — it is a very convenient way of <strong>moving</strong>{' '}
              energy from where it is produced to where it is needed. In almost every power station the same
              basic chain occurs: some energy source is used to <strong>spin a turbine</strong>, the turbine
              spins a <strong>generator</strong>, and the generator produces electricity.
            </p>
          </div>

          <Card title="Generating Electricity">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Station type</th>
                  <th className="border p-2 text-left">Energy changes</th>
                  <th className="border p-2 text-left">In Zimbabwe</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Thermal (coal)</td>
                  <td className="border p-2">
                    Chemical &rarr; heat &rarr; kinetic (steam and turbine) &rarr; electrical
                  </td>
                  <td className="border p-2">Hwange, Munyati, Bulawayo, Harare</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Hydroelectric (HEP)</td>
                  <td className="border p-2">
                    Gravitational potential &rarr; kinetic (falling water) &rarr; electrical
                  </td>
                  <td className="border p-2">Kariba South</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Solar (photovoltaic)</td>
                  <td className="border p-2">Light &rarr; electrical (no turbine at all)</td>
                  <td className="border p-2">Solar farms and rooftop systems across the country</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Wind</td>
                  <td className="border p-2">Kinetic (moving air) &rarr; electrical</td>
                  <td className="border p-2">Limited — Zimbabwe&rsquo;s wind speeds are generally low</td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={physImages.thermalPowerStation}
              alt="Thermal power station from coal store and boiler through turbine and generator to cooling tower"
              caption="Fig 7.1 — A coal-fired thermal station: coal burns in the boiler, steam spins the turbine, the turbine spins the generator, and the used steam is condensed in the cooling towers."
            />
            <Figure
              src={physImages.hydroelectricStation}
              alt="Cross-section of a hydroelectric dam showing reservoir, penstock, turbine and generator"
              caption="Fig 7.2 — A hydroelectric station like Kariba. Water stored high behind the dam falls through the penstock and spins the turbine."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Source</th>
                  <th className="border p-2 text-left">Advantages</th>
                  <th className="border p-2 text-left">Disadvantages</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Coal</td>
                  <td className="border p-2">
                    Large reserves at Hwange; works day and night whatever the weather; reliable output
                  </td>
                  <td className="border p-2">
                    Produces CO₂, sulphur dioxide (acid rain) and ash; non-renewable; mining damages land
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Hydroelectric</td>
                  <td className="border p-2">
                    Renewable, no fuel cost, no air pollution, and the reservoir supports fishing, irrigation
                    and tourism
                  </td>
                  <td className="border p-2">
                    Very high building cost; floods land and displaces people; output falls badly in a drought
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Solar</td>
                  <td className="border p-2">
                    Renewable, no pollution, no fuel, and works in remote areas without a grid connection
                  </td>
                  <td className="border p-2">
                    Nothing at night, less on cloudy days; batteries are expensive; needs a large area
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Wind</td>
                  <td className="border p-2">Renewable, no pollution, land beneath can still be farmed</td>
                  <td className="border p-2">
                    Unreliable, noisy, spoils the view, and kills some birds
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Transmission — Why Such High Voltages?">
            <p>
              Power stations are far from the towns they supply, and every kilometre of cable has some
              resistance. Current flowing through resistance produces heat, and that heat is wasted energy.
              The energy wasted depends on the <strong>square of the current</strong>, so the trick is to make
              the current as small as possible.
            </p>
            <p>
              Since <strong>power = voltage &times; current</strong>, the same amount of power can be
              delivered at a high voltage with a small current, or a low voltage with a large current.
              Transmitting at hundreds of thousands of volts keeps the current small and therefore keeps the
              losses small.
            </p>
            <Figure
              src={physImages.nationalGrid}
              alt="National grid from power station through step-up transformer, pylons, substations and step-down transformer to homes"
              caption="Fig 7.3 — The national grid. Voltage is stepped up for transmission and stepped back down in stages for factories, then for homes at 230 V."
            />
            <Figure
              src={physImages.transformer}
              alt="Step-up and step-down transformer diagrams with coil turns labelled"
              caption="Fig 7.4 — A transformer: more turns on the secondary coil steps the voltage up; fewer turns steps it down. Transformers work only with alternating current."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>Generators produce alternating current at about 11 kV.</li>
              <li>A <strong>step-up transformer</strong> raises this to as much as 330&ndash;500 kV for the long-distance lines.</li>
              <li>Overhead cables on pylons carry the power across the country.</li>
              <li>
                <strong>Step-down transformers</strong> at substations reduce the voltage in stages —
                33 kV, then 11 kV, then <strong>230 V</strong> for houses.
              </li>
              <li>Even so, roughly 10&ndash;15% of the energy is still lost as heat on the way.</li>
            </ul>
            <ExamTip>
              <p>
                The reason for high-voltage transmission is worth stating in full:{' '}
                <strong>high voltage means low current; low current means less heat lost in the cables;
                less heat lost means the electricity is cheaper and thinner cables can be used.</strong>
              </p>
            </ExamTip>
          </Card>

          <Card title="Wiring in the Home">
            <Figure
              src={physImages.houseWiring}
              alt="Domestic wiring from the supply and meter through the consumer unit to ring main and lighting circuits"
              caption="Fig 7.5 — Domestic wiring: the supply comes in through the meter to the consumer unit, which splits it into separate protected circuits."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Wire</th>
                  <th className="border p-2 text-left">Colour</th>
                  <th className="border p-2 text-left">Job</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Live</td>
                  <td className="border p-2">Brown (older wiring: red)</td>
                  <td className="border p-2">
                    Carries the current in at 230 V — this is the dangerous one
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Neutral</td>
                  <td className="border p-2">Blue (older wiring: black)</td>
                  <td className="border p-2">Completes the circuit, carrying current back; stays near 0 V</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Earth</td>
                  <td className="border p-2">Green and yellow stripes</td>
                  <td className="border p-2">
                    A safety wire connected to the metal case of an appliance, giving any leaking current a
                    safe path into the ground
                  </td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={physImages.threePinPlug}
              alt="Correctly wired three pin plug with live neutral and earth identified and the fuse in place"
              caption="Fig 7.6 — A correctly wired three-pin plug. The fuse is always in the live wire, the earth pin is longest, and the cable grip clamps the outer sheath."
            />
            <p className="font-semibold text-slate-800">Rules for wiring a plug</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Brown to the live pin (the one nearest the fuse), blue to neutral, green-and-yellow to earth.</li>
              <li>The fuse must be in the <strong>live</strong> wire, so that a blown fuse cuts the appliance off from the dangerous 230 V.</li>
              <li>The switch must also be in the live wire, for the same reason.</li>
              <li>The cable grip must clamp the outer covering, not the individual wires.</li>
              <li>No bare copper should be visible outside the terminals, and all screws must be tight.</li>
            </ul>
          </Card>

          <Card title="Safety Devices and Hazards">
            <Figure
              src={physImages.fuseAndBreaker}
              alt="A cartridge fuse and a miniature circuit breaker shown side by side"
              caption="Fig 7.7 — A fuse melts and must be replaced; a circuit breaker trips and can simply be switched back on."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Device</th>
                  <th className="border p-2 text-left">How it protects you</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Fuse</td>
                  <td className="border p-2">
                    A thin wire that melts and breaks the circuit if the current rises above its rating,
                    preventing overheating and fire. It must be replaced after it blows.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Circuit breaker</td>
                  <td className="border p-2">
                    An automatic switch that trips instantly on excess current. Faster than a fuse and can be
                    reset rather than replaced.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Earth wire</td>
                  <td className="border p-2">
                    If a live wire touches the metal case, the current flows to earth instead of through you.
                    The large current blows the fuse and disconnects the appliance.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Earth leakage circuit breaker (ELCB / RCD)</td>
                  <td className="border p-2">
                    Detects a tiny difference between the current going out and coming back, and cuts the
                    supply within milliseconds — fast enough to prevent a fatal shock.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Double insulation</td>
                  <td className="border p-2">
                    Appliances with plastic casings have no exposed metal, so they need no earth wire.
                  </td>
                </tr>
              </tbody>
            </table>
            <Safety>
              <ul className="list-inside list-disc space-y-1">
                <li>Never touch switches or appliances with wet hands, and keep electrical equipment away from water.</li>
                <li>Replace worn or cracked insulation immediately; do not patch it with ordinary tape.</li>
                <li>Do not overload a socket with a multi-plug adaptor — the wiring overheats and can start a fire.</li>
                <li>Never replace a blown fuse with wire, foil or a nail. The fuse is what stands between the fault and a fire.</li>
                <li>Switch off at the wall and unplug before repairing or cleaning any appliance.</li>
                <li>Bury or insulate cables where people walk, and keep them away from hot surfaces.</li>
              </ul>
            </Safety>
          </Card>

          <Card title="Electrical Power and the Cost of Electricity">
            <Formula>power (P) = voltage (V) &times; current (I) &nbsp;&nbsp;·&nbsp;&nbsp; energy = power &times; time</Formula>
            <Figure
              src={physImages.applianceRatingPlate}
              alt="Appliance rating plate showing voltage, power and frequency"
              caption="Fig 7.8 — Every appliance carries a rating plate. The power rating tells you how fast it uses energy — and therefore how much it will cost to run."
            />
            <Example title="Worked example 1 — finding the current">
              <p>An electric iron is rated 1 000 W, 230 V. What current does it take?</p>
              <p>I = P &divide; V = 1 000 &divide; 230 = <strong>4.35 A</strong></p>
              <p>A 5 A fuse would be the correct choice for this appliance.</p>
            </Example>
            <Definition term="Kilowatt-hour (kWh)">
              the energy used by a 1 kilowatt appliance running for 1 hour. It is the &ldquo;unit&rdquo; of
              electricity that you buy. 1 kWh = 1 000 W &times; 3 600 s ={' '}
              <strong>3 600 000 J = 3.6 MJ</strong>.
            </Definition>
            <Formula>units used (kWh) = power in kW &times; time in hours</Formula>
            <Formula>cost = units used &times; price per unit</Formula>
            <Example title="Worked example 2 — the cost of lighting">
              <p>A 60 W lamp is left on for 20 hours. Electricity costs $0.15 per unit. Find the cost.</p>
              <p>Power in kilowatts = 60 &divide; 1 000 = 0.06 kW</p>
              <p>Units used = 0.06 &times; 20 = 1.2 kWh</p>
              <p>Cost = 1.2 &times; $0.15 = <strong>$0.18</strong></p>
            </Example>
            <Example title="Worked example 3 — a household bill">
              <p>
                In one month a family uses a 2 kW geyser for 2 hours a day and a 1.5 kW stove for 1 hour a
                day, for 30 days. At $0.15 per unit, what do these two appliances cost?
              </p>
              <p>Geyser: 2 &times; 2 &times; 30 = 120 kWh</p>
              <p>Stove: 1.5 &times; 1 &times; 30 = 45 kWh</p>
              <p>Total = 165 kWh; cost = 165 &times; $0.15 = <strong>$24.75</strong></p>
            </Example>
            <Figure
              src={physImages.prepaidMeter}
              alt="Prepaid electricity meter display showing remaining units and the keypad"
              caption="Fig 7.9 — A prepaid meter. You buy a token, enter the number, and the meter counts down the units as you use them."
            />
            <WatchOut>
              <p>
                Convert watts to <strong>kilowatts</strong> and minutes to <strong>hours</strong> before you
                calculate units. Forgetting to divide by 1 000 makes the answer a thousand times too big and
                is the most common mistake in these questions.
              </p>
            </WatchOut>
          </Card>

          <Card title="Saving Electricity">
            <ul className="list-inside list-disc space-y-1">
              <li>Replace filament bulbs with LED or energy-saving bulbs, which give the same light for a fraction of the power.</li>
              <li>Switch off lights, televisions and chargers when they are not being used — standby still uses energy.</li>
              <li>Fit a geyser timer and a geyser blanket, and lower the thermostat setting.</li>
              <li>Use a solar water heater or solar panels where possible.</li>
              <li>Cook with lids on pots, and use the right-sized plate for the pot.</li>
              <li>Iron a whole batch of clothes at once rather than one item at a time.</li>
              <li>Keep the fridge door closed and its seals in good condition, and defrost it regularly.</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Electricity Key Points"
            items={[
              'Turbine spins generator in nearly every station',
              'Thermal: chemical → heat → kinetic → electrical',
              'HEP: potential → kinetic → electrical',
              'High voltage → low current → less heat lost',
              'Transformers step voltage up and down (AC only)',
              'Live brown, neutral blue, earth green/yellow',
              'Fuse and switch always go in the LIVE wire',
              '1 kWh = 3.6 MJ; cost = kW × hours × price',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Fuse rating rule</h3>
            <p className="text-sm text-slate-700">
              Work out the normal current with I = P ÷ V, then choose the next fuse{' '}
              <strong>above</strong> it. A 3 A fuse suits appliances up to about 700 W; a 13 A fuse suits
              kettles, irons and heaters.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     8. REVISION SUMMARY
  ======================================================================= */
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <h4 className="text-lg font-bold text-amber-800">Last-Minute Study Strategy</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>
              Write every formula on one card: P = F/A, P = hρg, ρ = m/V, W = mg, v = fλ, P = VI, cost = kW ×
              h × price. Learn the <strong>unit</strong> that goes with each one.
            </li>
            <li>
              Physics marks come from working, not just answers. Always write the formula, substitute the
              numbers, then give the answer with its unit.
            </li>
            <li>
              Practise unit conversions until they are automatic: cm to m, g to kg, W to kW, minutes to hours.
              More marks are lost here than anywhere else.
            </li>
            <li>
              Learn to label three diagrams perfectly: the three-pin plug, the thermos flask and the lift
              pump.
            </li>
            <li>
              For each device, be ready to say <strong>what energy change</strong> takes place inside it.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-rose-800">Common Mistakes to Avoid</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>Using centimetres in P = hρg. Always convert the depth to <strong>metres</strong> first.</li>
            <li>Forgetting to divide watts by 1 000 when working out kilowatt-hours.</li>
            <li>Confusing <strong>mass</strong> (kg, from a balance) with <strong>weight</strong> (N, from a spring balance).</li>
            <li>Saying a thermos flask &ldquo;keeps the cold in&rdquo;. Cold is not a substance; the flask slows heat transfer.</li>
            <li>Putting the fuse or switch in the neutral wire. Both go in the <strong>live</strong> wire.</li>
            <li>Claiming a hydraulic press &ldquo;creates&rdquo; energy. It multiplies force, and the small piston travels much further.</li>
            <li>Saying sound can travel through a vacuum. It cannot — light can, sound cannot.</li>
            <li>Joining graph points dot-to-dot instead of drawing a line of best fit.</li>
            <li>Leaving the unit off a final answer.</li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h4 className="text-lg font-bold text-blue-700">Data &amp; Measurement</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Pie chart, bar graph, line graph — know when to use each</li>
              <li>Pie angle = (value ÷ total) × 360°</li>
              <li>Density = mass ÷ volume</li>
              <li>Displacement method for irregular solids</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Gradient = change in y ÷ change in x, using a large triangle.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <h4 className="text-lg font-bold text-blue-700">Pressure</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>P = F ÷ A (pascals)</li>
              <li>P = hρg inside a liquid</li>
              <li>Pressure acts equally in all directions</li>
              <li>Manometer and barometer</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Atmospheric pressure ≈ 100 000 Pa and falls with altitude.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              <h4 className="text-lg font-bold text-blue-700">Pumps &amp; Hydraulics</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Lift pump — about 10 m limit, needs priming</li>
              <li>Force pump — air chamber, continuous flow</li>
              <li>Bush pump — cylinder below the water</li>
              <li>F₁/A₁ = F₂/A₂</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Trace the valves: which is open, which is closed, on each stroke.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <h4 className="text-lg font-bold text-blue-700">Energy</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Conduction, convection, radiation</li>
              <li>Dull black absorbs; shiny silver reflects</li>
              <li>Solar cooker, water heater, PV panel</li>
              <li>Thermos flask blocks all three transfers</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Energy is never created or destroyed, only changed in form.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">📡</span>
              <h4 className="text-lg font-bold text-blue-700">Telecommunication</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Sound is longitudinal: compressions and rarefactions</li>
              <li>Frequency → pitch; amplitude → loudness; v = fλ</li>
              <li>Analogue is continuous; digital is pulses and resists noise</li>
              <li>Guided: twisted pair, coaxial, optical fibre</li>
              <li>Unguided: radio, microwave, satellite, infrared, Bluetooth</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Optical fibre carries light by total internal reflection and is immune to interference.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h4 className="text-lg font-bold text-blue-700">Electricity</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Thermal, hydro, solar and wind generation, with advantages and disadvantages</li>
              <li>High-voltage transmission keeps the current — and the losses — small</li>
              <li>Live brown, neutral blue, earth green/yellow; fuse in the live wire</li>
              <li>Fuse, circuit breaker, earth wire and ELCB</li>
              <li>P = VI; 1 kWh = 3.6 MJ; cost = kW × hours × price</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Never replace a fuse with wire or foil — that removes the protection completely.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <h4 className="text-lg font-bold text-emerald-800">Final Checklist Before the Exam</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>I can calculate the angles for a pie chart and find the gradient of a line graph.</li>
            <li>I can find the density of a regular solid, a liquid and an irregular solid.</li>
            <li>I can use P = F/A and P = hρg, converting units correctly.</li>
            <li>I can explain why a dam wall is thicker at the base.</li>
            <li>I can describe the upstroke and downstroke of a lift pump and a force pump.</li>
            <li>I can use F₁/A₁ = F₂/A₂ and calculate MA, VR and efficiency.</li>
            <li>I can explain the thermos flask in terms of all three heat transfers.</li>
            <li>I can describe a solar cooker and a solar water heater and say why each part is used.</li>
            <li>I can use v = fλ and describe a longitudinal wave.</li>
            <li>I can wire a three-pin plug and explain the fuse and the earth wire.</li>
            <li>I can calculate the cost of running an appliance in kWh.</li>
          </ul>
        </div>
      </div>
    ),
  },
];

/* ---------- Components ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeId === s.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: TopicSection }> = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
    </div>
    <div className="prose prose-slate max-w-none">{section.content}</div>
  </section>
);

interface CombinedSciencePhysics2Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const CombinedSciencePhysics2: React.FC<CombinedSciencePhysics2Props> = ({
  onNextTopic,
  nextTopicTitle = 'Next Topic',
}) => {
  const [active, setActive] = useLessonState('chapter', sections[0].id);
  const activeIndex = Math.max(sections.findIndex((section) => section.id === active), 0);
  const activeSection = sections[activeIndex];
  const isLastChapter = activeIndex >= sections.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isLastChapter) {
      setActive(sections[activeIndex + 1].id);
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNextTopic?.();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            PHYSICS – PART 2
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Data, Measurement, Pressure, Hydraulics, Energy, Telecoms &amp; Electricity
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Full Form 4 notes in plain English — every formula explained and worked through, with labelled
            apparatus, complete practical write-ups and step-by-step calculations.
          </p>
        </div>
      </div>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Data presentation:</strong> pie charts show proportions, bar
                  graphs compare categories and line graphs show relationships; the gradient of a line has a
                  physical meaning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Measurement:</strong> every reading needs a unit; density is
                  mass ÷ volume, and the displacement method gives the volume of an irregular solid.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Pressure:</strong> P = F/A explains knives and tractor tyres;
                  P = hρg explains dam walls, manometers and why water squirts furthest from the lowest hole.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Pumps and hydraulics:</strong> a lift pump relies on
                  atmospheric pressure and cannot beat 10 m, while hydraulic machines multiply force because
                  liquids transmit pressure equally.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Energy:</strong> heat travels by conduction, convection and
                  radiation; solar devices encourage the transfer they want and a thermos flask blocks all
                  three.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Telecommunication:</strong> sound is a longitudinal wave with
                  v = fλ; digital signals and optical fibre carry far more information with far less noise.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Electricity:</strong> generated by spinning turbines,
                  transmitted at high voltage to keep losses low, and made safe in the home by fuses, circuit
                  breakers and the earth wire.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'Ready for the next section?' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>
                In the next section, we will learn about <span className="text-blue-600">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-blue-600">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Section'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export const LearningOutcome3 = CombinedSciencePhysics2;

export default LearningOutcome3;
