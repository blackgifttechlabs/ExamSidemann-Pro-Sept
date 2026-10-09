import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import { DataPresentationLesson } from '../../shared/DataPresentationLesson';
import Measurements from './Measurements';
import Force from './Force';
import Magnetism from './Magnetism';
import Energy from './Energy';
import Electricity from './Electricity';
import Robotics from './Robotics';

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
        <figcaption className="mt-2 text-sm font-semibold text-slate-600">{caption}</figcaption>
      )}
    </figure>
  );
};

const Definition: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Definition</p>
    <p className="mt-1 text-base leading-relaxed text-slate-800">
      <strong>{term}</strong> — {children}
    </p>
  </div>
);

const Example: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Worked example',
  children,
}) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">{title}</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const ExamTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Exam tip</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const WatchOut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Watch out</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Safety: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Safety</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 className="font-bold text-slate-700">{title}</h4>
    <div className="mt-2 space-y-2 text-base leading-relaxed text-slate-700">{children}</div>
  </div>
);

const DisplayCard: React.FC<{ title: string; use: string; rules: string[]; children: React.ReactNode }> = ({ title, use, rules, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-start gap-4">
      <div className="h-20 w-28 shrink-0 rounded-lg bg-slate-50 p-2">{children}</div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="mt-1 text-base leading-relaxed text-slate-700">{use}</p>
      </div>
    </div>
    <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-slate-700">How to draw it</p>
    <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-relaxed text-slate-700">
      {rules.map((rule) => <li key={rule}>{rule}</li>)}
    </ul>
  </div>
);

const Step: React.FC<{ n: number; src?: string; alt?: string; children: React.ReactNode }> = ({
  n,
  src,
  alt,
  children,
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <p className="mb-1 text-sm font-bold text-slate-700">Step {n}</p>
    <p className="text-base leading-relaxed text-slate-700">{children}</p>
    {src && <Figure src={src} alt={alt ?? `Step ${n}`} className="mt-2" />}
  </div>
);

const Formula: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg bg-slate-900 px-4 py-3 text-center font-mono text-base text-white shadow-sm">
    {children}
  </div>
);

const KeyList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-bold text-slate-700">{title}</h3>
    <ul className="list-inside list-disc space-y-1 text-base text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const physicsTopics: TopicSection[] = [
  /* =======================================================================
     1. DATA PRESENTATION
  ======================================================================= */
  {
    id: 'data-presentation',
    title: 'Data Presentation',
    content: <DataPresentationLesson />,
  },

  /* =======================================================================
     5. ENERGY
  ======================================================================= */
  {
    id: 'energy',
    title: 'Energy – Solar & Thermos Flask',
    content: (
      <div className="grid gap-8">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
                <p className="mb-1 text-base font-bold text-slate-700">Advantages</p>
                <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
                  <li>The fuel is free and will never run out</li>
                  <li>No smoke, so no chest illness and no air pollution</li>
                  <li>Saves trees and reduces deforestation</li>
                  <li>No risk of a cooking fire spreading</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-base font-bold text-slate-700">Disadvantages</p>
                <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
      <div className="grid gap-8">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
                <p className="mb-1 text-base font-bold text-slate-700">Benefits</p>
                <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
                  <li>Instant contact with family, business and emergency services</li>
                  <li>Mobile money and online banking</li>
                  <li>Access to education, e-learning and information</li>
                  <li>Faster warnings about storms, floods and disease outbreaks</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-base font-bold text-slate-700">Problems</p>
                <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
                  <li>Cost of data and handsets excludes some people</li>
                  <li>Spread of false information and online fraud</li>
                  <li>Loss of privacy and cyber-bullying</li>
                  <li>Less face-to-face contact and screen addiction</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

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
      <div className="grid gap-8">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
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
        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <h4 className="text-lg font-bold text-slate-800">Last-Minute Study Strategy</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
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

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-slate-800">Common Mistakes to Avoid</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
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
              <h4 className="text-lg font-bold text-slate-700">Data &amp; Measurement</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Pie chart, bar graph, line graph — know when to use each</li>
              <li>Pie angle = (value ÷ total) × 360°</li>
              <li>Density = mass ÷ volume</li>
              <li>Displacement method for irregular solids</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Gradient = change in y ÷ change in x, using a large triangle.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <h4 className="text-lg font-bold text-slate-700">Pressure</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>P = F ÷ A (pascals)</li>
              <li>P = hρg inside a liquid</li>
              <li>Pressure acts equally in all directions</li>
              <li>Manometer and barometer</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Atmospheric pressure ≈ 100 000 Pa and falls with altitude.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              <h4 className="text-lg font-bold text-slate-700">Pumps &amp; Hydraulics</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Lift pump — about 10 m limit, needs priming</li>
              <li>Force pump — air chamber, continuous flow</li>
              <li>Bush pump — cylinder below the water</li>
              <li>F₁/A₁ = F₂/A₂</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Trace the valves: which is open, which is closed, on each stroke.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">☀️</span>
              <h4 className="text-lg font-bold text-slate-700">Energy</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Conduction, convection, radiation</li>
              <li>Dull black absorbs; shiny silver reflects</li>
              <li>Solar cooker, water heater, PV panel</li>
              <li>Thermos flask blocks all three transfers</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Energy is never created or destroyed, only changed in form.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">📡</span>
              <h4 className="text-lg font-bold text-slate-700">Telecommunication</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Sound is longitudinal: compressions and rarefactions</li>
              <li>Frequency → pitch; amplitude → loudness; v = fλ</li>
              <li>Analogue is continuous; digital is pulses and resists noise</li>
              <li>Guided: twisted pair, coaxial, optical fibre</li>
              <li>Unguided: radio, microwave, satellite, infrared, Bluetooth</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Optical fibre carries light by total internal reflection and is immune to interference.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h4 className="text-lg font-bold text-slate-700">Electricity</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Thermal, hydro, solar and wind generation, with advantages and disadvantages</li>
              <li>High-voltage transmission keeps the current — and the losses — small</li>
              <li>Live brown, neutral blue, earth green/yellow; fuse in the live wire</li>
              <li>Fuse, circuit breaker, earth wire and ELCB</li>
              <li>P = VI; 1 kWh = 3.6 MJ; cost = kW × hours × price</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Never replace a fuse with wire or foil — that removes the protection completely.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <h4 className="text-lg font-bold text-slate-800">Final Checklist Before the Exam</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
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

const physicsContent = (id: string) => physicsTopics.find(topic => topic.id === id)!.content;
const sections: TopicSection[] = [
  { id: 'data-presentation', title: 'Data Presentation', content: physicsContent('data-presentation') },
  { id: 'measurements', title: 'Measurements', content: <Measurements /> },
  { id: 'force', title: 'Force', content: <Force /> },
  { id: 'energy', title: 'Energy', content: <Energy /> },
  { id: 'magnetism', title: 'Magnetism', content: <Magnetism /> },
  { id: 'electricity', title: 'Electricity', content: <Electricity /> },
  { id: 'robotics', title: 'Robotics', content: <Robotics /> },
];

const legacyPhysicsTopics: Record<string, string> = {
  'force-pressure': 'force',
  'pumps-hydraulics': 'force',
  telecommunication: 'energy',
  'revision-summary': 'data-presentation',
};

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
      <div className="w-full px-4 sm:px-6 md:px-8 relative flex items-center">
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
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap ${
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
    <div className="mb-2">
      <h2 className="-ml-1 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:-ml-1.5 sm:text-5xl">{section.title}</h2>
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
  const activeTopic = legacyPhysicsTopics[active] ?? active;
  const activeIndex = Math.max(sections.findIndex((section) => section.id === activeTopic), 0);
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
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
            PHYSICS – PART 2
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Data Presentation, Measurements, Force, Energy, Magnetism, Electricity &amp; Robotics
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Learn how to present results, measure quantities, explain forces and energy, use magnets and
            electricity, and understand how robots work.
          </p>
        </div>
      </div>

      <TopicNav activeId={activeSection.id} onNavigate={handleNavigate} />

      <div className="w-full px-4 sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="list-inside list-disc space-y-2 text-blue-100 text-base">
              <li><strong className="text-white">Data Presentation:</strong> choose a suitable chart or graph and label it clearly.</li>
              <li><strong className="text-white">Measurements:</strong> use suitable instruments and record values with units.</li>
              <li><strong className="text-white">Force:</strong> explain pushes, pulls, pressure and hydraulic systems.</li>
              <li><strong className="text-white">Energy:</strong> describe energy changes and heat transfer.</li>
              <li><strong className="text-white">Magnetism:</strong> explain magnets, fields, motors, generators and power generation.</li>
              <li><strong className="text-white">Electricity:</strong> explain generation, transmission and safe use.</li>
              <li><strong className="text-white">Robotics:</strong> follow the path from sensors to a controller and actuators.</li>
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
                In the next section, we will learn about <span className="text-slate-700">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-slate-700">{sections[activeIndex + 1].title}</span>
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
