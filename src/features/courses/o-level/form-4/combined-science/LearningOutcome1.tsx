import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Food chain
const foodChainSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 120" width="100%" height="100%">
  <rect width="600" height="120" fill="white" />
  <text x="300" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Food Chain</text>
  <rect x="20" y="40" width="80" height="40" rx="8" fill="#22c55e" />
  <text x="60" y="65" text-anchor="middle" font-size="12" fill="white">Grass</text>
  <line x1="100" y1="60" x2="140" y2="60" stroke="#1e293b" stroke-width="2" marker-end="url(#arrow)" />
  <rect x="140" y="40" width="80" height="40" rx="8" fill="#eab308" />
  <text x="180" y="65" text-anchor="middle" font-size="12" fill="white">Locust</text>
  <line x1="220" y1="60" x2="260" y2="60" stroke="#1e293b" stroke-width="2" marker-end="url(#arrow)" />
  <rect x="260" y="40" width="80" height="40" rx="8" fill="#f59e0b" />
  <text x="300" y="65" text-anchor="middle" font-size="12" fill="white">Lizard</text>
  <line x1="340" y1="60" x2="380" y2="60" stroke="#1e293b" stroke-width="2" marker-end="url(#arrow)" />
  <rect x="380" y="40" width="80" height="40" rx="8" fill="#ef4444" />
  <text x="420" y="65" text-anchor="middle" font-size="12" fill="white">Bird</text>
  <text x="480" y="65" font-size="11" fill="#475569">Arrows show the</text>
  <text x="480" y="79" font-size="11" fill="#475569">flow of energy</text>
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#1e293b" />
    </marker>
  </defs>
</svg>
`;

// Matching vector diagrams keep labels sharp at every screen size.
const ecologicalPyramidSvg = (kind: 'numbers' | 'biomass') => {
  const isNumbers = kind === 'numbers';
  const rows = [
    { y: 106, width: 40, fill: '#be123c', name: 'Hawks', role: 'Tertiary consumers', value: '100' },
    { y: 164, width: 80, fill: '#c2410c', name: 'Lizards', role: 'Secondary consumers', value: '200' },
    { y: 222, width: 160, fill: '#a16207', name: 'Locusts', role: 'Primary consumers', value: '400' },
    { y: 280, width: 320, fill: '#15803d', name: 'Grass plants', role: 'Producers', value: '800' },
  ];
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" role="img" aria-labelledby="title desc">
  <title id="title">Pyramid of ${isNumbers ? 'numbers' : 'biomass'}</title>
  <desc id="desc">An illustrative grassland pyramid with producers at the base and consumers above. Bar widths represent ${isNumbers ? 'the number of organisms' : 'total dry mass per square metre'}. Values halve at each higher level.</desc>
  <rect width="640" height="400" rx="18" fill="#ffffff"/>
  <g font-family="Arial, sans-serif">
    <text x="28" y="40" font-size="25" font-weight="700" fill="#0f172a">Pyramid of ${isNumbers ? 'Numbers' : 'Biomass'}</text>
    <text x="28" y="65" font-size="16" fill="#64748b">${isNumbers ? 'Counts individual organisms' : 'Measures total dry mass (g/m²)'}</text>
    ${rows.map(row => `
      <rect x="${200 - row.width / 2}" y="${row.y}" width="${row.width}" height="44" rx="5" fill="${row.fill}"/>
      <path d="M${200 + row.width / 2 + 8} ${row.y + 22}H382" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="395" y="${row.y + 16}" font-size="18" font-weight="700" fill="#0f172a">${row.name} · ${row.value}${isNumbers ? '' : ' g/m²'}</text>
      <text x="395" y="${row.y + 37}" font-size="14" fill="#64748b">${row.role}</text>
    `).join('')}
    <line x1="40" y1="335" x2="360" y2="335" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="28" y="366" font-size="15" fill="#475569">Wider bar = ${isNumbers ? 'more organisms' : 'greater dry mass'}</text>
    <text x="28" y="387" font-size="13" fill="#64748b">Illustrative grassland example • producers form the base</text>
  </g>
</svg>`;
};
const pyramidNumbersSvg = ecologicalPyramidSvg('numbers');
const pyramidBiomassSvg = ecologicalPyramidSvg('biomass');

// Aerobic respiration word equation
const aerobicEquationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 350" role="img" aria-labelledby="aer-title aer-desc">
  <title id="aer-title">Aerobic respiration: word equation followed by symbol equation</title>
  <desc id="aer-desc">First: glucose plus oxygen yields carbon dioxide plus water plus energy. Second: C6H12O6 plus 6O2 yields 6CO2 plus 6H2O plus energy.</desc>
  <rect width="720" height="350" rx="18" fill="#ffffff"/>
  <g font-family="Arial, sans-serif">
    <text x="360" y="38" text-anchor="middle" font-size="28" font-weight="700" fill="#0f172a">Aerobic Respiration</text>
    <rect x="20" y="58" width="680" height="125" rx="12" fill="#f0fdf4" stroke="#86efac"/>
    <text x="40" y="85" font-size="16" font-weight="700" fill="#166534">WORD EQUATION</text>
    <text x="360" y="120" text-anchor="middle" font-size="25" font-weight="700" fill="#14532d">Glucose + Oxygen →</text>
    <text x="360" y="159" text-anchor="middle" font-size="25" font-weight="700" fill="#14532d">Carbon dioxide + Water + Energy</text>
    <rect x="20" y="198" width="680" height="125" rx="12" fill="#eff6ff" stroke="#93c5fd"/>
    <text x="40" y="225" font-size="16" font-weight="700" fill="#1e40af">SYMBOL EQUATION</text>
    <text x="360" y="260" text-anchor="middle" font-size="28" font-weight="700" fill="#1e3a8a">C₆H₁₂O₆ + 6O₂ →</text>
    <text x="360" y="301" text-anchor="middle" font-size="28" font-weight="700" fill="#1e3a8a">6CO₂ + 6H₂O + energy</text>
  </g>
</svg>
`;

// Blood cells
const bloodCellsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 150" width="100%" height="100%">
  <rect width="500" height="150" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Blood Cells</text>
  <ellipse cx="100" cy="80" rx="40" ry="25" fill="#ef4444" />
  <ellipse cx="100" cy="78" rx="30" ry="15" fill="#fca5a5" />
  <text x="100" y="120" text-anchor="middle" font-size="11" fill="#1e293b">Red blood cell</text>
  <text x="100" y="135" text-anchor="middle" font-size="9" fill="#475569">(no nucleus)</text>
  <circle cx="250" cy="80" r="30" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <circle cx="240" cy="72" r="10" fill="#3b82f6" />
  <circle cx="260" cy="88" r="8" fill="#3b82f6" />
  <circle cx="245" cy="90" r="6" fill="#3b82f6" />
  <text x="250" y="125" text-anchor="middle" font-size="11" fill="#1e293b">White blood cell</text>
  <text x="250" y="140" text-anchor="middle" font-size="9" fill="#475569">(has nucleus)</text>
  <circle cx="380" cy="70" r="10" fill="#f59e0b" />
  <circle cx="410" cy="80" r="12" fill="#f59e0b" />
  <circle cx="390" cy="90" r="8" fill="#f59e0b" />
  <text x="395" y="120" text-anchor="middle" font-size="11" fill="#1e293b">Platelets</text>
  <text x="395" y="135" text-anchor="middle" font-size="9" fill="#475569">(no nucleus)</text>
</svg>
`;

/* ---------- Image paths ----------
   Shared Combined Science images already in the repo live in:
     public/images/courses/o-level/combined-science/
   New Form 4 artwork must be saved into:
     public/images/courses/o-level/combined-science/form-4/
   The exact file names to save each new picture as are listed below and are
   documented (with drawing prompts) in docs/FORM4_COMBINED_SCIENCE_IMAGE_PROMPTS.md
------------------------------------ */
const csImage = (fileName: string) =>
  `/images/courses/o-level/combined-science/${encodeURIComponent(fileName)}`;

const f4Image = (fileName: string) =>
  `/images/courses/o-level/combined-science/form-4/${fileName}`;

const bioImages = {
  /* ----- SVG diagrams drawn in code ----- */
  foodChain: f4Image('bio-food-chain.webp'),
  organismRoles: f4Image('bio-producers-consumers-decomposers.webp'),
  pyramidBiomass: svgToDataUri(pyramidBiomassSvg),
  aerobicEquation: svgToDataUri(aerobicEquationSvg),
  bloodCells: svgToDataUri(bloodCellsSvg),

  /* ----- Re-used Form 3 artwork ----- */
  transpirationOverview: csImage('transpirationinplants.png'),
  potometer: csImage('Potometer Apparatus.png'),
  arteryCrossSection: csImage('Artery Cross-Section.png'),
  veinCrossSection: csImage('Vein Cross-Section.png'),
  capillaryCrossSection: csImage('Capillary Cross-Section.png'),
  maleReproductiveSystem: f4Image('bio-male-reproductive-system.webp'),
  femaleReproductiveSystem: f4Image('bio-female-reproductive-system.webp'),
  menstrualCycle: f4Image('bio-menstrual-cycle.svg'),
  fertilisationToImplantation: csImage('fertilisationimplantation.png'),

  /* ----- New Form 4 artwork (save with these exact names) ----- */
  ecosystemComponents: f4Image('bio-ecosystem-components.webp'),
  foodWeb: f4Image('bio-food-web.webp'),
  energyFlow: f4Image('bio-trophic-levels-energy-flow.png'),
  pyramidOfNumbers: svgToDataUri(pyramidNumbersSvg),
  carbonCycle: f4Image('bio-carbon-cycle.webp'),
  nitrogenCycle: f4Image('bio-nitrogen-cycle.webp'),
  decomposition: f4Image('bio-decomposition.png'),
  quadratStep1: f4Image('bio-quadrat-step1.png'),
  quadratStep2: f4Image('bio-quadrat-step2.png'),
  quadratStep3: f4Image('bio-quadrat-step3.png'),
  quadratStep4: f4Image('bio-quadrat-step4.png'),
  naturalVsArtificial: f4Image('bio-natural-vs-artificial-ecosystem.webp'),
  biodiversityThreats: f4Image('bio-biodiversity-threats.png'),
  eutrophication: f4Image('bio-eutrophication.png'),

  balancedDietPlate: f4Image('bio-balanced-diet-plate.png'),
  nutrientSources: f4Image('bio-nutrient-sources.png'),
  deficiencyDiseases: f4Image('bio-deficiency-diseases.png'),
  energyNeedsGraph: f4Image('bio-energy-needs-graph.png'),
  foodTestStarch: f4Image('bio-food-test-starch.png'),
  foodTestBenedicts: f4Image('bio-food-test-benedicts.png'),
  foodTestBiuret: f4Image('bio-food-test-biuret.png'),
  foodTestFats: f4Image('bio-food-test-fats.png'),
  foodTestsResults: f4Image('bio-food-tests-results-chart.png'),

  mitochondrion: f4Image('bio-mitochondrion.png'),
  anaerobicComparison: f4Image('bio-anaerobic-comparison.png'),
  oxygenDebtGraph: f4Image('bio-oxygen-debt-graph.png'),
  respirationCo2Step1: f4Image('bio-respiration-co2-step1.png'),
  respirationCo2Step2: f4Image('bio-respiration-co2-step2.png'),
  respirationCo2Step3: f4Image('bio-respiration-co2-step3.png'),
  respirationCo2Step4: f4Image('bio-respiration-co2-step4.png'),
  respirationHeatStep1: f4Image('bio-respiration-heat-step1.png'),
  respirationHeatStep2: f4Image('bio-respiration-heat-step2.png'),
  respirationHeatStep3: f4Image('bio-respiration-heat-step3.png'),
  fermentationApparatus: f4Image('bio-fermentation-apparatus.png'),

  cobaltChlorideStep1: f4Image('bio-cobalt-chloride-step1.png'),
  cobaltChlorideStep2: f4Image('bio-cobalt-chloride-step2.png'),
  cobaltChlorideStep3: f4Image('bio-cobalt-chloride-step3.png'),
  leafWaterSavingAdaptations: f4Image('bio-leaf-water-saving-adaptations.png'),
  bloodComposition: f4Image('bio-blood-composition.png'),
  bloodVesselsComparison: f4Image('bio-blood-vessels-comparison.webp'),
  heartStructure: f4Image('bio-heart-structure.webp'),
  doubleCirculation: f4Image('bio-double-circulation.svg'),
  bloodClotting: f4Image('bio-blood-clotting.png'),

  vegetativeNatural: f4Image('bio-vegetative-natural.png'),
  vegetativeArtificial: f4Image('bio-vegetative-artificial.png'),
  contraceptionMethods: f4Image('bio-contraception-methods.png'),

  bodyDefences: f4Image('bio-body-defences.png'),
  phagocytosis: f4Image('bio-phagocytosis.png'),
  antibodyResponseGraph: f4Image('bio-antibody-response-graph.png'),
  hivAttack: f4Image('bio-hiv-attack-on-white-blood-cell.png'),
  hivTransmission: f4Image('bio-hiv-transmission-routes.png'),
  vaccinationSchedule: f4Image('bio-vaccination-schedule.png'),
  breastfeedingBenefits: f4Image('bio-breastfeeding-benefits.png'),
};

/* ---------- Small presentation helpers ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** Image that quietly removes itself if the artwork has not been added yet. */
const Figure: React.FC<{ src: string; alt: string; caption?: string; className?: string; compact?: boolean; maxHeight?: string }> = ({
  src,
  alt,
  caption,
  className = '',
  compact = false,
  maxHeight = 'min(360px, 50svh)',
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className={`mt-3 ${compact ? 'mx-auto w-full max-w-[780px]' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="mx-auto block rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
        style={compact
          ? { width: 'auto', maxWidth: '100%', maxHeight }
          : { width: '100%' }}
      />
      {caption && (
        <figcaption className="mt-2 text-sm font-semibold text-slate-600">{caption}</figcaption>
      )}
    </figure>
  );
};

const SyllabusTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full border-collapse text-left text-base text-slate-700">
      <thead className="bg-slate-50"><tr>{headers.map(h => <th key={h} scope="col" className="border p-3">{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0
        ? <th key={j} scope="row" className="border p-3 align-top font-semibold">{cell}</th>
        : <td key={j} className="border p-3 align-top">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const NutritionGallery: React.FC<{ items: { name: string; file: string; description: string }[] }> = ({ items }) => (
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    {items.map(item => (
      <figure key={item.file} className="min-w-0 rounded-xl border border-slate-200 bg-white p-3">
        <img src={f4Image(`bio-nutrition-${item.file}.webp`)} alt={item.description}
          loading="lazy" decoding="async" width={300} height={380}
          className="mx-auto block h-40 w-full object-contain sm:h-44" />
        <figcaption className="mt-2 text-center">
          <span className="block text-base font-bold text-slate-900">{item.name}</span>
          <span className="mt-1 block text-sm leading-snug text-slate-600">{item.description}</span>
        </figcaption>
      </figure>
    ))}
  </div>
);

const Definition: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Definition</p>
    <p className="mt-1 text-base leading-relaxed text-slate-800">
      <strong>{term}</strong> — {children}
    </p>
  </div>
);

const Example: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Example',
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

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">{title}</h4>
    <div className="mt-2 space-y-2 text-base leading-relaxed text-slate-700">{children}</div>
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

const sections: TopicSection[] = [
  /* =======================================================================
     1. ECOLOGY
  ======================================================================= */
  {
    id: 'ecology',
    title: 'Ecology',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Ecology</strong> is the study of how living things interact with one another and
              with the non-living things around them. Nothing in nature lives alone: a maize plant
              needs sunlight, water and soil minerals; a locust needs the maize plant; a lizard needs
              the locust. Ecology is simply the science of following those connections and working out
              what happens when one of them is broken.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-slate-700">
              Before you can answer any ecology question you must be comfortable with five words that
              examiners use constantly. They describe the same piece of nature at bigger and bigger
              scales, so learn them as a ladder, from smallest to largest.
            </p>
          </div>

          <Card title="The Five Ecology Words (smallest to largest)">
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Word</th>
                  <th className="border p-2 text-left">What it means in simple English</th>
                  <th className="border p-2 text-left">Zimbabwean example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Habitat</td>
                  <td className="border p-2">The particular place where an organism lives</td>
                  <td className="border p-2">The muddy edge of a dam where a frog lives</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Population</td>
                  <td className="border p-2">
                    All the members of <em>one</em> species living in the same area at the same time
                  </td>
                  <td className="border p-2">All the impala in Hwange National Park</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Community</td>
                  <td className="border p-2">
                    All the different populations (all the species) living together in one area
                  </td>
                  <td className="border p-2">
                    The impala, zebra, lions, grasses and msasa trees of Hwange together
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Ecosystem</td>
                  <td className="border p-2">
                    The community <em>plus</em> the non-living surroundings it depends on
                  </td>
                  <td className="border p-2">
                    Lake Kariba: the fish, weeds and birds together with the water, mud and sunlight
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Biosphere</td>
                  <td className="border p-2">
                    Every part of the Earth where life is found, all added together
                  </td>
                  <td className="border p-2">The whole living surface of the planet</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Definition term="Ecosystem">
            a community of living organisms together with the non-living parts of their environment,
            working together as one unit in which energy flows and materials are recycled. A fish pond,
            a maize field, a rotting log and the whole of Lake Kariba are all ecosystems — an ecosystem
            can be tiny or enormous.
          </Definition>

          <Card title="The Two Halves of Every Ecosystem">
            <p>
              Every ecosystem is built from two kinds of components. If a question asks you to
              &ldquo;describe the components of an ecosystem&rdquo;, you must give examples from{' '}
              <strong>both</strong> halves to get full marks.
            </p>
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Component</th>
                  <th className="border p-2 text-left">Meaning</th>
                  <th className="border p-2 text-left">Examples</th>
                  <th className="border p-2 text-left">Why it matters to living things</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Abiotic (non-living / physical)</td>
                  <td className="border p-2">The physical and chemical surroundings</td>
                  <td className="border p-2">
                    Sunlight, temperature, water, air, soil, pH, humidity, wind, minerals
                  </td>
                  <td className="border p-2">
                    Decides which organisms can survive there — e.g. no light means no plants, so no
                    food is made
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Biotic (living)</td>
                  <td className="border p-2">All the living organisms</td>
                  <td className="border p-2">
                    Producers (green plants), consumers (herbivores, carnivores, omnivores),
                    decomposers (bacteria and fungi)
                  </td>
                  <td className="border p-2">
                    Supply food to one another and recycle nutrients back into the abiotic part
                  </td>
                </tr>
              </tbody>
            </table>
            <Figure
              compact src={bioImages.ecosystemComponents}
              alt="Labelled ecosystem showing abiotic and biotic components"
              caption="Fig 1.1 — Abiotic components include sunlight, water, air and soil. Biotic components include producers, consumers and decomposers. Both interact within one ecosystem."
            />
          </Card>

          <Card title="Producers, Consumers and Decomposers">
            <p>
              The living things in an ecosystem are grouped by <strong>how they get their food</strong>,
              not by how big they are.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Producers</strong> are green plants and algae. They make their own food by
                photosynthesis, so they start every food chain. They are also called{' '}
                <em>autotrophs</em> (&ldquo;self-feeders&rdquo;).
              </li>
              <li>
                <strong>Consumers</strong> cannot make their own food, so they eat other organisms.
                They are also called <em>heterotrophs</em> (&ldquo;other-feeders&rdquo;).
                <ul className="ml-5 mt-1 list-inside list-disc space-y-1">
                  <li>
                    <strong>Herbivores</strong> eat only plants (cattle, goats, locusts).
                  </li>
                  <li>
                    <strong>Carnivores</strong> eat only other animals (lion, snake, kingfisher).
                  </li>
                  <li>
                    <strong>Omnivores</strong> eat both plants and animals (humans, baboons, chickens).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Decomposers</strong> are bacteria and fungi that feed on dead bodies and waste.
                They break down the complex substances in dead material and release simple nutrients
                back into the soil. Without them, dead plants and animals would pile up and the soil
                would run out of minerals within a few seasons.
              </li>
            </ul>
            <Figure
              compact src={bioImages.organismRoles}
              alt="Plants as producers, animals as consumers, and fungi and bacteria as decomposers"
              caption="Fig 1.2 — Producers make food using sunlight, consumers eat other organisms, and decomposers break down dead material and return nutrients to the soil."
            />
          </Card>

          <Card title="Food Chains">
            <Definition term="Food chain">
              a diagram that shows how energy and food pass from one organism to the next, starting
              with a producer. The arrow always means <strong>&ldquo;is eaten by&rdquo;</strong> and
              always points in the direction the energy travels.
            </Definition>
            <Figure compact src={bioImages.foodChain} alt="Simple grassland food chain" />
            <p>
              Reading the chain above: the grass is eaten by the locust, the locust is eaten by the
              lizard, and the lizard is eaten by the bird. Notice that the chain begins with a plant.
              Every food chain on Earth begins with a producer, because producers are the only
              organisms that can capture the Sun&rsquo;s energy and turn it into food.
            </p>
            <p>Each feeding position in the chain has a name — its trophic level:</p>
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Trophic level</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">In the chain above</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">1st</td>
                  <td className="border p-2 font-semibold">Producer</td>
                  <td className="border p-2">Grass</td>
                </tr>
                <tr>
                  <td className="border p-2">2nd</td>
                  <td className="border p-2 font-semibold">Primary consumer (herbivore)</td>
                  <td className="border p-2">Locust</td>
                </tr>
                <tr>
                  <td className="border p-2">3rd</td>
                  <td className="border p-2 font-semibold">Secondary consumer (carnivore)</td>
                  <td className="border p-2">Lizard</td>
                </tr>
                <tr>
                  <td className="border p-2">4th</td>
                  <td className="border p-2 font-semibold">Tertiary consumer (top carnivore)</td>
                  <td className="border p-2">Bird</td>
                </tr>
              </tbody>
            </table>
            <WatchOut>
              <p>
                The arrow does <strong>not</strong> mean &ldquo;eats&rdquo;. Drawing{' '}
                <em>lizard &rarr; locust</em> because the lizard eats the locust is one of the
                commonest ways students lose an easy mark. The arrow shows where the energy{' '}
                <em>goes</em>, so it must point from the food to the feeder: locust &rarr; lizard.
              </p>
            </WatchOut>
          </Card>

          <Card title="Food Webs">
            <Definition term="Food web">
              two or more food chains joined together, showing all the feeding relationships in a
              community. A food web is more realistic than a single chain because most animals eat more
              than one kind of food and are eaten by more than one kind of predator.
            </Definition>
            <Figure
              compact src={bioImages.foodWeb}
              alt="Savanna food web with interconnected food chains"
              caption="Fig 1.3 — A savanna food web. Follow any single path of arrows from a plant to a top carnivore and you have picked out one food chain from inside the web."
            />
            <Example title="Why food webs matter">
              <p>
                Suppose a disease wipes out all the locusts in the web above. The lizards lose a food
                source, so their numbers fall; the birds that eat lizards then have less food too. But
                because the birds can also eat mice, they survive — the web has given them an
                alternative. A community with a complicated food web is therefore more{' '}
                <strong>stable</strong> than one with a single chain, which is a favourite exam
                question.
              </p>
            </Example>
          </Card>

          <Card title="Energy Flow: Why Food Chains Are Short">
            <p>
              Energy enters an ecosystem as sunlight and leaves it as heat. It flows in{' '}
              <strong>one direction only</strong> — it is never recycled. At every step of a food chain
              roughly <strong>90% of the energy is lost</strong> and only about{' '}
              <strong>10% is passed on</strong> to the next level. The energy is lost because it is:
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>used up in <strong>respiration</strong> to keep the animal alive, moving and warm;</li>
              <li>released as <strong>heat</strong> to the surroundings;</li>
              <li>lost in <strong>faeces and urine</strong> (not all food eaten is digested);</li>
              <li>left behind in parts that are not eaten, such as bones, hooves and roots.</li>
            </ul>
            <Figure
              src={bioImages.energyFlow}
              alt="Energy flow through trophic levels showing 10 percent transfer"
              caption="Fig 1.4 — Energy flow through four trophic levels. Only about a tenth of the energy at each level is passed upwards; the rest escapes as heat, respiration losses and waste."
            />
            <Example title="Worked example">
              <p>
                A field of grass captures <strong>10 000 kJ</strong> of energy. How much reaches the
                bird at the fourth level?
              </p>
              <p>
                Grass 10 000 kJ &rarr; locusts 1 000 kJ &rarr; lizards 100 kJ &rarr; bird{' '}
                <strong>10 kJ</strong>.
              </p>
              <p>
                Only 10 kJ out of 10 000 kJ is left — that is why food chains almost never have more
                than four or five links. There is simply not enough energy left to support another
                level.
              </p>
            </Example>
          </Card>

          <Card title="Pyramids of Numbers and Biomass">
            <p>
              A <strong>pyramid</strong> is a bar chart drawn on its side, with the producers at the
              bottom and each higher trophic level stacked above. The width of each bar shows how much
              there is at that level.
            </p>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-4 md:grid-cols-2">
              <div className="w-full min-w-0">
                <Figure
                  className="text-center [&>img]:!w-full" compact src={bioImages.pyramidOfNumbers}
                  alt="Grassland pyramid of numbers showing organism counts at each trophic level"
                  caption="Fig 1.5 — Pyramid of numbers: each bar shows how many individual organisms there are."
                />
              </div>
              <div className="w-full min-w-0">
                <Figure
                  className="text-center [&>img]:!w-full" compact src={bioImages.pyramidBiomass}
                  alt="Pyramid of biomass"
                  caption="Fig 1.6 — Pyramid of biomass: each bar shows the total dry mass of living material."
                />
              </div>
            </div>
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Type of pyramid</th>
                  <th className="border p-2 text-left">What the bars measure</th>
                  <th className="border p-2 text-left">Can it be upside-down?</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Pyramid of numbers</td>
                  <td className="border p-2">The number of individual organisms at each level</td>
                  <td className="border p-2">
                    Yes. One big msasa tree can feed hundreds of caterpillars, so the producer bar is
                    narrower than the level above it
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pyramid of biomass</td>
                  <td className="border p-2">
                    The total dry mass of living material at each level (measured in g/m&sup2;)
                  </td>
                  <td className="border p-2">
                    Almost never on land — one tree has a far greater mass than all its caterpillars,
                    so the pyramid keeps its proper shape
                  </td>
                </tr>
              </tbody>
            </table>
            <ExamTip>
              <p>
                If a question shows a strange, top-heavy pyramid, it is almost certainly a{' '}
                <strong>pyramid of numbers with a large plant (a tree) as producer</strong>. Say so,
                then explain that a pyramid of biomass for the same food chain would be the normal
                shape because mass, not number, is being measured.
              </p>
            </ExamTip>
          </Card>

          <Card title="The Carbon Cycle">
            <p>
              Unlike energy, <strong>matter is recycled</strong>. There is a fixed amount of carbon on
              Earth and it moves round and round between the air, living things and the soil. The
              carbon cycle explains how.
            </p>
            <Figure
              compact src={bioImages.carbonCycle}
              alt="Labelled carbon cycle diagram"
              caption="Fig 1.7 — The carbon cycle. Photosynthesis is the only process that removes carbon dioxide from the air; respiration, decomposition and combustion all put it back."
            />
            <p className="font-semibold text-slate-800">Follow one carbon atom round the cycle:</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                The atom starts as part of a <strong>carbon dioxide</strong> molecule in the air.
              </li>
              <li>
                A green plant absorbs it and, by <strong>photosynthesis</strong>, builds it into glucose
                and then into starch, cellulose and protein. The carbon is now locked inside the plant.
              </li>
              <li>
                An animal <strong>eats</strong> the plant, so the carbon becomes part of the animal.
              </li>
              <li>
                The plant or animal <strong>respires</strong>, breaking glucose down again and breathing
                the carbon out as carbon dioxide. The atom is back in the air.
              </li>
              <li>
                If instead the organism dies, <strong>decomposers</strong> feed on the remains and
                release the carbon dioxide as they respire.
              </li>
              <li>
                If the dead material is buried under pressure for millions of years it becomes{' '}
                <strong>coal, oil or natural gas</strong>. Burning these fossil fuels
                (<strong>combustion</strong>) releases the carbon dioxide again — which is why burning
                fossil fuels raises the amount of carbon dioxide in the atmosphere.
              </li>
            </ol>
            <ExamTip>
              <p>
                Learn the four processes by heart:{' '}
                <strong>photosynthesis takes carbon dioxide out of the air</strong>, while{' '}
                <strong>respiration, decomposition and combustion put it back in</strong>. Almost every
                carbon cycle question is testing whether you can name these four.
              </p>
            </ExamTip>
          </Card>

          <Card title="The Nitrogen Cycle">
            <p>
              Plants and animals need nitrogen to make <strong>proteins</strong> and{' '}
              <strong>DNA</strong>. About 78% of the air is nitrogen gas, but this gas is so unreactive
              that plants cannot use it directly. The nitrogen cycle is the story of how nitrogen is
              turned into a usable form and then returned to the air.
            </p>
            <Figure
              compact src={bioImages.nitrogenCycle}
              alt="Labelled nitrogen cycle diagram"
              caption="Fig 1.8 — The nitrogen cycle. Four groups of bacteria do most of the work, so learn their names and what each one does."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Process</th>
                  <th className="border p-2 text-left">Who does it</th>
                  <th className="border p-2 text-left">What happens</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Nitrogen fixation</td>
                  <td className="border p-2">
                    Nitrogen-fixing bacteria (in root nodules of legumes such as beans, groundnuts and
                    soya, and free in the soil); also lightning
                  </td>
                  <td className="border p-2">
                    Nitrogen gas from the air is changed into nitrates that plants can absorb
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Absorption</td>
                  <td className="border p-2">Plant roots</td>
                  <td className="border p-2">
                    Nitrates are taken up from the soil and used to build plant proteins
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Feeding</td>
                  <td className="border p-2">Animals</td>
                  <td className="border p-2">
                    Animals eat plants and change plant protein into animal protein
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Decomposition (putrefaction)</td>
                  <td className="border p-2">Decomposing bacteria and fungi</td>
                  <td className="border p-2">
                    Dead bodies, urine and faeces are broken down into ammonia
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Nitrification</td>
                  <td className="border p-2">Nitrifying bacteria</td>
                  <td className="border p-2">
                    Ammonia is changed to nitrites and then to nitrates, ready for plants again
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Denitrification</td>
                  <td className="border p-2">
                    Denitrifying bacteria (they thrive in waterlogged soil with little oxygen)
                  </td>
                  <td className="border p-2">
                    Nitrates are broken back down into nitrogen gas, which escapes to the air
                  </td>
                </tr>
              </tbody>
            </table>
            <Example title="Why farmers plant beans between maize crops">
              <p>
                Beans, groundnuts and soya are <strong>legumes</strong>. Their roots carry swellings
                called <strong>root nodules</strong> that house nitrogen-fixing bacteria. Growing a
                legume in a field adds nitrates to the soil naturally, so the next maize crop grows
                better and the farmer buys less fertiliser. This is why crop rotation is recommended by
                agricultural extension officers.
              </p>
            </Example>
            <ExamTip>
              <p>
                Remember the two bacteria that sound alike but do opposite jobs.{' '}
                <strong>Nitrifying</strong> bacteria <em>build</em> nitrates (good for plants).{' '}
                <strong>Denitrifying</strong> bacteria <em>destroy</em> nitrates (bad for plants) — the
                &ldquo;de-&rdquo; means undoing, just like &ldquo;de-starch&rdquo;.
              </p>
            </ExamTip>
          </Card>

          <Card title="Natural and Artificial Ecosystems">
            <p>
              A <strong>natural ecosystem</strong> develops on its own without human interference, such
              as a stretch of miombo woodland or an undisturbed wetland. An{' '}
              <strong>artificial ecosystem</strong> is one that people have created or heavily altered,
              such as a maize field, a fish pond, a plantation or a garden.
            </p>
            <Figure
              compact src={bioImages.naturalVsArtificial}
              alt="Side by side comparison of a natural woodland and an artificial maize field"
              caption="Fig 1.9 — A natural savanna pond (left) supports many species; an artificial maize field (right) is planted and managed by people."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">Natural ecosystem</th>
                  <th className="border p-2 text-left">Artificial ecosystem</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Species diversity</td>
                  <td className="border p-2">High — many different species living together</td>
                  <td className="border p-2">Low — often a single crop species (a monoculture)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Human input needed</td>
                  <td className="border p-2">None; it maintains itself</td>
                  <td className="border p-2">
                    Constant — watering, fertiliser, pesticides, weeding, feeding
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Food webs</td>
                  <td className="border p-2">Complex and stable</td>
                  <td className="border p-2">Simple, so pests and disease can spread quickly</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Recycling of nutrients</td>
                  <td className="border p-2">Complete — everything is decomposed on site</td>
                  <td className="border p-2">
                    Incomplete — the harvest removes nutrients, so they must be replaced
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Biodiversity and the Threats to It">
            <Definition term="Biodiversity">
              the variety of different species of living organisms found in an area. High biodiversity
              means many different kinds of plants, animals and micro-organisms; low biodiversity means
              only a few.
            </Definition>
            <p>
              Biodiversity matters because it keeps ecosystems stable, supplies us with food, timber and
              medicines, protects the soil and supports tourism — a major source of income in Zimbabwe.
            </p>
            <Figure
              src={bioImages.biodiversityThreats}
              alt="Six threats to biodiversity illustrated"
              caption="Fig 1.10 — The main threats to biodiversity in Zimbabwe."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Threat</th>
                  <th className="border p-2 text-left">How it reduces biodiversity</th>
                  <th className="border p-2 text-left">What can be done</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Deforestation</td>
                  <td className="border p-2">
                    Cutting trees for firewood, tobacco curing and farmland destroys habitats
                  </td>
                  <td className="border p-2">
                    Afforestation, woodlots, fuel-efficient stoves, use of gas and solar
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pollution</td>
                  <td className="border p-2">
                    Sewage, mine waste and litter poison water and kill aquatic organisms
                  </td>
                  <td className="border p-2">
                    Treat waste before discharge, recycle, enforce environmental laws
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Poaching and over-harvesting</td>
                  <td className="border p-2">
                    Removes animals faster than they can breed, pushing species towards extinction
                  </td>
                  <td className="border p-2">
                    Anti-poaching patrols, national parks, CAMPFIRE community projects, quotas
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Invasive alien species</td>
                  <td className="border p-2">
                    Species such as water hyacinth and lantana out-compete native species
                  </td>
                  <td className="border p-2">Physical removal, biological control, strict quarantine</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Veld fires</td>
                  <td className="border p-2">
                    Destroy grass, seedlings, insects and small animals over huge areas
                  </td>
                  <td className="border p-2">Fireguards, controlled early burning, community education</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Overgrazing and stream-bank cultivation</td>
                  <td className="border p-2">
                    Strips vegetation, causes soil erosion and silting of rivers
                  </td>
                  <td className="border p-2">
                    Paddock grazing, destocking, contour ridges, leaving river banks uncultivated
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Eutrophication — a Chain of Events You Must Be Able to Explain">
            <p>
              Eutrophication is what happens when too many nutrients, usually nitrates and phosphates
              from fertilisers or sewage, wash into a river or lake. Questions on this topic ask you to
              explain the whole sequence, so learn it as a chain of five steps.
            </p>
            <Figure
              src={bioImages.eutrophication}
              alt="Five stage eutrophication sequence in a lake"
              caption="Fig 1.11 — Eutrophication: fertiliser run-off ends with dead fish, even though fertiliser itself is not poisonous."
            />
            <ol className="list-inside list-decimal space-y-1">
              <li>Rain washes nitrate fertiliser off the fields into the river (leaching and run-off).</li>
              <li>
                The extra nitrates make algae and water weeds grow very fast — an{' '}
                <strong>algal bloom</strong> covers the surface.
              </li>
              <li>
                The thick surface layer blocks light from reaching the plants below, so those plants die.
              </li>
              <li>
                <strong>Decomposing bacteria</strong> multiply rapidly as they feed on the dead plants,
                and they use up the dissolved oxygen in the water while respiring.
              </li>
              <li>
                With the oxygen gone, fish and other aquatic animals suffocate and die. The water becomes
                smelly and unfit for use.
              </li>
            </ol>
            <WatchOut>
              <p>
                Do not write that &ldquo;the fertiliser poisons the fish&rdquo;. The fish die because{' '}
                <strong>bacteria use up the oxygen</strong>. Marks are given for naming the bacteria and
                the lack of oxygen, not for the word &ldquo;pollution&rdquo;.
              </p>
            </WatchOut>
          </Card>
        </div>

      </div>
    ),
  },

  /* =======================================================================
     2. NUTRITION
  ======================================================================= */
  {
    id: 'nutrition',
    title: 'Nutrition',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Nutrition</strong> is the way an organism takes in and uses food. Food does three
              jobs in the body: it supplies <strong>energy</strong> for every activity from breathing to
              running, it supplies <strong>materials for growth and repair</strong> of cells and tissues,
              and it supplies substances that <strong>protect us from disease</strong>. If any one of
              these is missing the body cannot work properly, no matter how full the stomach feels.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-slate-700">
              This is why a person can eat a large plate of sadza every day and still be malnourished.
              Sadza is almost pure carbohydrate: it fills the stomach and gives energy, but on its own it
              gives almost no protein, no vitamins and very little mineral content. What the body needs
              is a <strong>balanced diet</strong>.
            </p>
          </div>

          <Card title="The Human Digestive System">
            <p>
              The <strong>digestive system</strong> breaks food down into small, soluble molecules that
              can be absorbed and used by the body. The <strong>alimentary canal</strong> is the continuous
              tube from the mouth to the anus. The salivary glands, liver and pancreas make substances
              that help digestion, but food does not pass through these organs.
            </p>
            <p>
              <strong>Mechanical digestion</strong> breaks food into smaller pieces by chewing and
              churning. <strong>Chemical digestion</strong> uses enzymes to break large food molecules
              into smaller ones: carbohydrates into simple sugars, proteins into amino acids, and fats
              into fatty acids and glycerol. <strong>Peristalsis</strong>, waves of muscle contraction,
              moves food along the gut.
            </p>
            <p>
              Most digestion and absorption happen in the <strong>small intestine</strong>. Its villi
              provide a large surface area for absorption. Digested sugars and amino acids enter the
              blood; most absorbed fats enter the lymph first. Absorbed nutrients are then used by cells
              for energy, growth and repair — this is <strong>assimilation</strong>. Undigested material
              passes into the large intestine, where more water is absorbed, and leaves as faeces through
              the anus — this is <strong>egestion</strong>.
            </p>
            <p className="rounded-lg bg-slate-50 p-3 text-base font-semibold text-slate-800">
              Food pathway: Mouth → Oesophagus → Stomach → Small intestine → Large intestine → Rectum → Anus
            </p>
            <Figure
              compact
              maxHeight="min(600px, 70svh)"
              src={f4Image('bio-human-digestive-system.webp')}
              alt="Labelled human digestive system showing the mouth, salivary glands, oesophagus, liver, gall bladder, stomach, pancreas, small intestine, large intestine, rectum and anus"
              caption="The alimentary canal and the accessory organs that help digest food. Food passes through the gut, not through the liver, gall bladder or pancreas."
            />
            <p className="text-center">
              <a href={f4Image('bio-human-digestive-system.webp')} target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-700 underline underline-offset-4">
                View the labelled diagram at full size
              </a>
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <caption className="sr-only">Parts of the human digestive system and their functions</caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="border-b border-r p-3">Part</th>
                    <th scope="col" className="border-b p-3">Function</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Mouth, teeth and tongue', 'Takes in food (ingestion). Teeth chew it into smaller pieces; the tongue mixes it with saliva and helps swallowing.'],
                    ['Salivary glands', 'Produce saliva to moisten food. Salivary amylase begins breaking starch down into maltose.'],
                    ['Oesophagus', 'Carries swallowed food to the stomach by peristalsis.'],
                    ['Stomach', 'Stores and churns food. Hydrochloric acid kills many microbes and provides an acidic environment for pepsin, which begins protein digestion.'],
                    ['Liver', 'Produces bile, which helps neutralise acidic material entering the small intestine and emulsifies fats into small droplets. Bile is not an enzyme.'],
                    ['Gall bladder', 'Stores and concentrates bile, then releases it into the duodenum.'],
                    ['Pancreas', 'Releases pancreatic juice into the duodenum. It contains amylase, proteases and lipase, plus bicarbonate to help neutralise stomach acid.'],
                    ['Small intestine (duodenum and ileum)', 'Completes most chemical digestion. Villi absorb digested nutrients; sugars and amino acids enter blood capillaries, while most fats enter lacteals.'],
                    ['Large intestine (colon)', 'Absorbs remaining water and salts from undigested material, helping form faeces.'],
                    ['Rectum', 'Temporarily stores faeces before egestion.'],
                    ['Anus', 'Sphincter muscles control the release of faeces from the body.'],
                  ].map(([part, role]) => (
                    <tr key={part} className="border-b border-slate-200 last:border-b-0">
                      <th scope="row" className="border-r p-3 align-top font-semibold">{part}</th>
                      <td className="p-3 align-top">{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ExamTip>
              <p>
                <strong>Egestion</strong> removes undigested food as faeces. <strong>Excretion</strong>
                {' '}removes metabolic waste made by cells, such as urea and carbon dioxide. Absorption
                is the movement of nutrients out of the gut; assimilation is their use by body cells.
              </p>
            </ExamTip>
          </Card>

          <Card title="Types of Teeth and Their Functions">
            <p>
              Human teeth have different shapes because they do different jobs. Adults normally have
              <strong> 32 permanent teeth</strong>, including wisdom teeth; children have 20 milk teeth.
              Teeth help break food into smaller pieces before it is swallowed.
            </p>
            <Figure compact src={f4Image('bio-types-of-teeth.webp')}
              alt="Incisor with a cutting edge, pointed canine, two-cusped premolar and broad molar, labelled with their functions"
              caption="Incisors cut, canines tear, and premolars and molars crush and grind food." />
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <caption className="sr-only">Types of teeth, their shapes and functions</caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="border-b border-r p-3">Type of tooth</th>
                    <th scope="col" className="border-b border-r p-3">Shape</th>
                    <th scope="col" className="border-b p-3">Function</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Incisors', 'Sharp, chisel-shaped cutting edge', 'Cutting and biting food.'],
                    ['Canines', 'Pointed crown', 'Tearing and gripping food.'],
                    ['Premolars', 'Broad crown with cusps', 'Crushing and grinding food.'],
                    ['Molars', 'Large, broad crown with several cusps', 'Grinding food during chewing.'],
                  ].map(([name, shape, role]) => (
                    <tr key={name} className="border-b border-slate-200 last:border-b-0">
                      <th scope="row" className="border-r p-3 align-top font-semibold">{name}</th>
                      <td className="border-r p-3 align-top">{shape}</td>
                      <td className="p-3 align-top">{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h5 className="pt-3 text-xl font-bold text-slate-900">Chewing (mastication)</h5>
            <p>
              Chewing is <strong>mechanical digestion</strong>: the teeth break food into smaller
              pieces without changing its chemical composition. The tongue moves food between the
              teeth and mixes it with saliva to form a soft ball called a <strong>bolus</strong>, which
              is easier to swallow. Smaller pieces have a larger total surface area, so digestive
              enzymes can act on food more quickly.
            </p>
            <h5 className="pt-3 text-xl font-bold text-slate-900">Mechanical and Chemical Digestion</h5>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-bold text-slate-900">Mechanical digestion</p>
                <p>Physical breakdown into smaller pieces. Examples include chewing in the mouth and churning in the stomach.</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="font-bold text-slate-900">Chemical digestion</p>
                <p>Enzymes break large food molecules into smaller, soluble molecules. In the mouth, salivary amylase begins breaking starch down into maltose.</p>
              </div>
            </div>
            <ExamTip>
              <p>Both types of digestion begin in the mouth: teeth carry out mechanical digestion, while salivary amylase carries out chemical digestion. Teeth do not make digestive enzymes.</p>
            </ExamTip>
          </Card>

          <Card title="Why Digestion Is Important">
            <p>
              Many food molecules, such as starch and proteins, are too large to pass through the wall
              of the small intestine. Digestion breaks them into <strong>small, soluble molecules</strong>
              that can be absorbed and transported to cells. Cells use these nutrients to release
              <strong> energy</strong> through respiration, build new tissue, and repair damaged tissue.
            </p>
            <p>
              Mechanical digestion increases the surface area available to enzymes. Chemical digestion
              changes the molecules themselves. Both processes help the body obtain nutrients from food.
            </p>
          </Card>

          <Card title="Digestive Enzymes and the End Products of Digestion">
            <Definition term="Enzyme">
              a biological catalyst, usually a protein, that speeds up a chemical reaction without
              being used up. Each digestive enzyme acts on a particular type of food molecule.
            </Definition>
            <p>
              <strong>Amylase</strong> is found in saliva and pancreatic juice. It breaks
              <strong> starch into maltose</strong>. In the small intestine, a different enzyme,
              <strong> maltase</strong>, breaks maltose into <strong>glucose</strong>, which can be absorbed.
              Amylase does not directly turn starch into glucose.
            </p>
            <p className="rounded-lg bg-slate-50 p-3 font-semibold text-slate-900">
              Starch → (amylase) → Maltose → (maltase) → Glucose
            </p>
            <p>
              Enzymes work best at particular temperatures and pH values. Very high temperatures can
              change their shape (<strong>denaturation</strong>), so they stop working. Stomach proteases
              work in acidic conditions; many intestinal enzymes work best in neutral or slightly
              alkaline conditions.
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <caption className="sr-only">Food molecules, digestive enzymes and their end products</caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="border p-3">Food molecule</th>
                    <th scope="col" className="border p-3">Enzymes</th>
                    <th scope="col" className="border p-3">End products</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><th scope="row" className="border p-3 font-semibold">Starch</th><td className="border p-3">Amylase, then maltase</td><td className="border p-3"><strong>Glucose</strong> (maltose is an intermediate)</td></tr>
                  <tr><th scope="row" className="border p-3 font-semibold">Proteins</th><td className="border p-3">Proteases and peptidases</td><td className="border p-3"><strong>Amino acids</strong></td></tr>
                  <tr><th scope="row" className="border p-3 font-semibold">Fats and oils</th><td className="border p-3">Lipase</td><td className="border p-3"><strong>Fatty acids and glycerol</strong></td></tr>
                </tbody>
              </table>
            </div>
            <ExamTip>
              <p>Bile emulsifies fats into small droplets, increasing their surface area for lipase. Bile is not an enzyme and does not chemically digest fat.</p>
            </ExamTip>
          </Card>

          <Card title="Testing for Glucose, Proteins and Fats">
            <p>
              Food tests identify nutrients by a characteristic colour change or appearance.
              Test a food extract alongside a <strong>distilled-water control</strong> to compare results.
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <caption className="sr-only">Food tests and positive results for glucose, proteins and fats</caption>
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="border p-3">Nutrient and test</th>
                    <th scope="col" className="border p-3">How to test</th>
                    <th scope="col" className="border p-3">Positive result</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className="border p-3 align-top font-semibold">Glucose — Benedict’s test</th>
                    <td className="border p-3 align-top">Add Benedict’s solution to the food extract and heat in a hot water bath.</td>
                    <td className="border p-3 align-top">Blue changes to green, yellow, orange or a brick-red precipitate, depending on the amount of reducing sugar.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="border p-3 align-top font-semibold">Protein — Biuret test</th>
                    <td className="border p-3 align-top">Add sodium hydroxide solution, then a few drops of dilute copper(II) sulphate solution. Mix; no heating is needed.</td>
                    <td className="border p-3 align-top">The mixture turns purple or lilac. A negative result stays blue.</td>
                  </tr>
                  <tr>
                    <th scope="row" className="border p-3 align-top font-semibold">Fat — ethanol emulsion test</th>
                    <td className="border p-3 align-top">Shake the sample with ethanol, then add the ethanol extract to water. Do not heat.</td>
                    <td className="border p-3 align-top">A cloudy white emulsion forms. A negative result remains clear.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>Benedict’s test detects reducing sugars</strong>, including glucose and maltose;
              it does not prove that glucose is the only sugar present. For fats, a permanent translucent
              spot on filter paper is another simple positive test.
            </p>
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-slate-700">
              <strong>Laboratory safety:</strong> Work under teacher supervision, wear eye protection,
              use a water bath for heating, and keep flammable ethanol away from flames.
            </p>
            <ExamTip>
              <p>Remember: reducing sugar = brick red with heat; protein = purple; fat = cloudy white emulsion.</p>
            </ExamTip>
          </Card>

          <Definition term="Balanced diet">
            a diet that contains all seven classes of nutrients — carbohydrates, proteins, fats,
            vitamins, mineral salts, water and roughage — in the correct amounts and correct proportions
            for that particular person, so that the body stays healthy.
          </Definition>

          <Card title="The Seven Components of a Balanced Diet">
            <NutritionGallery items={[
              { name: 'Carbohydrates', file: 'carbohydrates', description: 'Sadza, bread and potatoes provide energy.' },
              { name: 'Proteins', file: 'proteins', description: 'Beans, eggs and fish support growth and repair.' },
              { name: 'Fats and oils', file: 'fats', description: 'Oil, avocado and groundnuts store energy.' },
              { name: 'Vitamins', file: 'vitamins', description: 'Fruit and vegetables supply vitamins.' },
              { name: 'Mineral salts', file: 'minerals', description: 'Milk, whole fish and greens supply minerals.' },
              { name: 'Water', file: 'water', description: 'Water supports transport and temperature control.' },
              { name: 'Roughage (fibre)', file: 'fibre', description: 'Whole grains, beans and vegetables aid bowel movement.' },
            ]} />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Nutrient</th>
                  <th className="border p-2 text-left">What the body uses it for</th>
                  <th className="border p-2 text-left">Local food sources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Carbohydrates</td>
                  <td className="border p-2">
                    The body&rsquo;s main and cheapest source of energy; broken down to glucose and used
                    in respiration
                  </td>
                  <td className="border p-2">
                    Maize meal (sadza), rice, bread, potatoes, sweet potatoes, sugar cane
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Proteins</td>
                  <td className="border p-2">
                    Growth of new tissue, repair of damaged tissue, and making enzymes, antibodies and
                    some hormones
                  </td>
                  <td className="border p-2">
                    Beans, groundnuts, soya, meat, fish, kapenta, eggs, milk, mopane worms
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Fats and oils</td>
                  <td className="border p-2">
                    A concentrated store of energy (more than twice as much per gram as carbohydrate),
                    insulation against cold, and protection for organs such as the kidneys
                  </td>
                  <td className="border p-2">
                    Cooking oil, margarine, butter, avocado, groundnuts, fatty meat
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vitamins</td>
                  <td className="border p-2">
                    Needed in tiny amounts to keep chemical reactions and the immune system working
                  </td>
                  <td className="border p-2">
                    Fruits (mango, orange, guava), vegetables (muriwo, carrots), liver, eggs
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Mineral salts</td>
                  <td className="border p-2">
                    Building bones and teeth, making haemoglobin, making hormones, nerve function
                  </td>
                  <td className="border p-2">Milk, small fish eaten whole, green vegetables, iodised salt</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Water</td>
                  <td className="border p-2">
                    Makes up about 70% of the body; used as a solvent, a transport medium in blood, and
                    for cooling by sweating
                  </td>
                  <td className="border p-2">Drinking water, tea, fruits, vegetables, milk</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Roughage (dietary fibre)</td>
                  <td className="border p-2">
                    Cannot be digested, but gives the gut muscles something to push against so food moves
                    along; prevents constipation and bowel disease
                  </td>
                  <td className="border p-2">
                    Bran, whole-grain meal, vegetables, fruit skins, beans
                  </td>
                </tr>
              </tbody>
            </table>

          </Card>

          <Card title="Important Vitamins and Minerals">
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Nutrient</th>
                  <th className="border p-2 text-left">Job in the body</th>
                  <th className="border p-2 text-left">Good sources</th>
                  <th className="border p-2 text-left">Disease if it is missing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Vitamin A</td>
                  <td className="border p-2">Healthy eyes, especially seeing in dim light; healthy skin</td>
                  <td className="border p-2">Carrots, pumpkin, liver, milk, dark green vegetables</td>
                  <td className="border p-2">Night blindness</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vitamin C</td>
                  <td className="border p-2">Keeps skin, gums and blood vessels healthy; helps wounds heal</td>
                  <td className="border p-2">Oranges, lemons, guava, mango, tomatoes, raw vegetables</td>
                  <td className="border p-2">Scurvy (bleeding gums, painful joints, slow healing)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vitamin D</td>
                  <td className="border p-2">Helps the body absorb calcium so bones harden properly</td>
                  <td className="border p-2">Sunlight on the skin, eggs, fish, milk</td>
                  <td className="border p-2">Rickets in children, soft bones in adults</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Calcium</td>
                  <td className="border p-2">Strong bones and teeth; needed for blood clotting</td>
                  <td className="border p-2">Milk, sour milk, cheese, kapenta eaten whole, green vegetables</td>
                  <td className="border p-2">Rickets, weak bones and teeth</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Iron</td>
                  <td className="border p-2">Makes haemoglobin, which carries oxygen in red blood cells</td>
                  <td className="border p-2">Liver, red meat, beans, dark green vegetables</td>
                  <td className="border p-2">Anaemia (tiredness, pale skin, breathlessness)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Iodine</td>
                  <td className="border p-2">Needed by the thyroid gland to make the hormone thyroxine</td>
                  <td className="border p-2">Iodised table salt, sea fish</td>
                  <td className="border p-2">Goitre (swelling of the thyroid gland in the neck)</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Malnutrition and Deficiency Diseases">
            <Definition term="Malnutrition">
              a condition caused by a diet that is unbalanced. It includes eating <em>too little</em> of
              a nutrient (undernutrition) and eating <em>too much</em> of one (overnutrition) — an obese
              person is just as malnourished as a starving one.
            </Definition>
            <NutritionGallery items={[
              { name: 'Kwashiorkor', file: 'kwashiorkor', description: 'Swollen abdomen and feet (oedema).' },
              { name: 'Marasmus', file: 'marasmus', description: 'Severe wasting of muscles and body fat.' },
              { name: 'Rickets', file: 'rickets', description: 'Soft bones can cause bowed legs.' },
              { name: 'Goitre', file: 'goitre', description: 'An enlarged thyroid causes swelling in the neck.' },
            ]} />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Condition</th>
                  <th className="border p-2 text-left">Cause</th>
                  <th className="border p-2 text-left">Signs</th>
                  <th className="border p-2 text-left">Treatment / prevention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Kwashiorkor</td>
                  <td className="border p-2">
                    Lack of protein, though enough carbohydrate is eaten; common when a child is weaned
                    onto sadza only
                  </td>
                  <td className="border p-2">
                    Swollen belly and feet (oedema), thin reddish hair, flaky skin, poor growth, tiredness
                  </td>
                  <td className="border p-2">Add beans, groundnuts, eggs, milk or fish to the diet</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Marasmus</td>
                  <td className="border p-2">
                    Severe lack of <em>both</em> protein and energy — near starvation
                  </td>
                  <td className="border p-2">
                    Very thin body, wasted muscles, ribs visible, old-looking wrinkled face, no oedema
                  </td>
                  <td className="border p-2">Careful re-feeding with high-energy, high-protein food</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Rickets</td>
                  <td className="border p-2">Lack of calcium and/or vitamin D</td>
                  <td className="border p-2">Soft bones that bend, so the legs become bowed</td>
                  <td className="border p-2">Milk, small whole fish, eggs and safe exposure to sunlight</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Anaemia</td>
                  <td className="border p-2">Lack of iron</td>
                  <td className="border p-2">Tiredness, weakness, pale inner eyelids, breathlessness</td>
                  <td className="border p-2">Liver, meat, beans, dark green vegetables, iron tablets</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Goitre</td>
                  <td className="border p-2">Lack of iodine</td>
                  <td className="border p-2">Visible swelling of the thyroid gland at the front of the neck</td>
                  <td className="border p-2">Use iodised salt</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Obesity</td>
                  <td className="border p-2">
                    Taking in more energy than the body uses, especially from fats and sugars
                  </td>
                  <td className="border p-2">
                    Excess body fat, raising the risk of diabetes, high blood pressure and heart disease
                  </td>
                  <td className="border p-2">Balanced diet with less fat and sugar, plus regular exercise</td>
                </tr>
              </tbody>
            </table>
            <WatchOut>
              <p>
                Kwashiorkor and marasmus are easy to mix up. The quick test:{' '}
                <strong>kwashiorkor is swollen, marasmus is wasted</strong>. A kwashiorkor patient looks
                puffy because of fluid, and eats enough sadza but not enough protein; a marasmus patient
                looks like skin and bone because there is not enough of anything.
              </p>
            </WatchOut>
          </Card>

          <Card title="Different People Need Different Amounts">
            <p>
              A balanced diet is not the same for everybody. The amount of energy and protein a person
              needs depends on their age, sex, body size, job and health.
            </p>
            <Figure
              src={bioImages.energyNeedsGraph}
              alt="Bar chart of daily energy requirements for different people"
              caption="Fig 2.4 — Daily energy requirements. A manual labourer may need twice as much energy as an office worker of the same age."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Growing children and teenagers</strong> need extra protein and calcium for new
                tissue and bones.
              </li>
              <li>
                <strong>Pregnant women</strong> need extra protein, iron, calcium and folic acid for the
                developing baby.
              </li>
              <li>
                <strong>Breastfeeding mothers</strong> need extra energy, protein, calcium and fluids to
                produce milk.
              </li>
              <li>
                <strong>People doing heavy manual work</strong> (farming, mining, construction) need much
                more energy than people who sit at a desk.
              </li>
              <li>
                <strong>Elderly people</strong> need less energy but still need protein, calcium and
                vitamins.
              </li>
              <li>
                <strong>Sick people, especially those living with HIV</strong>, need extra energy and
                protein to help the body fight infection and repair itself.
              </li>
            </ul>
          </Card>

        </div>

      </div>
    ),
  },

  /* =======================================================================
     3. RESPIRATION
  ======================================================================= */
  {
    id: 'respiration',
    title: 'Respiratory Systems',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Every living cell needs energy all the time — to build new molecules, to move substances
              across membranes, to contract muscles, to send nerve impulses and to keep warm. That energy
              is locked up inside glucose, and the process that releases it is called{' '}
              <strong>respiration</strong>.
            </p>
          </div>

          <Definition term="Respiration">
            the chemical breakdown of glucose inside living cells to release energy. It happens in{' '}
            <strong>every cell of every living organism, every second of the day and night</strong> — in
            plants as well as animals.
          </Definition>

          <WatchOut>
            <p>
              <strong>Respiration is not breathing.</strong> Breathing (properly called{' '}
              <em>ventilation</em>) is the physical movement of air in and out of the lungs. Respiration
              is a chemical reaction that happens inside cells. A person under anaesthetic can be
              ventilated by a machine, but it is still their own cells that respire. Earthworms and
              plants respire without having lungs at all.
            </p>
          </WatchOut>

          <Card title="Respiratory Gases and the Composition of Air">
            <p>
              The respiratory gases are <strong>oxygen</strong>, used in aerobic respiration, and
              <strong> carbon dioxide</strong>, released during respiration and removed by the lungs.
              Nitrogen and rare gases are not used up in this exchange.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <caption className="sr-only">Comparison of inhaled and exhaled air</caption>
                <thead className="bg-slate-50"><tr>{['Component', 'Inhaled air', 'Exhaled air', 'Explanation'].map(h => <th key={h} scope="col" className="border p-3">{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    ['Nitrogen', 'About 78%', 'About 78%', 'Not used in respiration; the proportion stays approximately unchanged.'],
                    ['Oxygen', 'About 20% (often rounded to 21%)', 'About 16%', 'Some oxygen diffuses into the blood and is used by cells.'],
                    ['Carbon dioxide', '0.03% in the supplied syllabus figures', 'About 4%', 'Carbon dioxide made by cells passes from blood into the alveoli.'],
                    ['Rare gases', 'Small amounts, mainly argon', 'Approximately unchanged', 'These gases do not take part in respiration.'],
                    ['Water vapour', 'Variable; usually less', 'More; usually near saturation', 'Air gains moisture from the respiratory surfaces.'],
                    ['Temperature', 'Varies with the surroundings', 'Usually warmer', 'Air is warmed inside the body.'],
                  ].map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row" className="border p-3 align-top font-semibold">{cell}</th> : <td key={i} className="border p-3 align-top">{cell}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-600">These are approximate school comparison values. Use the percentages supplied in an examination question; the rounded figures are not an exact total for every air sample.</p>
            <ExamTip><p>Exhaled air still contains oxygen. The body uses only part of the oxygen in each breath.</p></ExamTip>
          </Card>

          <Card title="Tests for Carbon Dioxide and Oxygen">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <thead className="bg-slate-50"><tr>{['Gas', 'Test', 'Positive result'].map(h => <th key={h} scope="col" className="border p-3">{h}</th>)}</tr></thead>
                <tbody>
                  <tr><th scope="row" className="border p-3">Carbon dioxide</th><td className="border p-3">Pass the gas through fresh limewater.</td><td className="border p-3">Clear limewater turns milky or cloudy.</td></tr>
                  <tr><th scope="row" className="border p-3">Carbon dioxide concentration</th><td className="border p-3">Use hydrogencarbonate (bicarbonate) indicator.</td><td className="border p-3">Normal air gives red/orange; more carbon dioxide gives yellow; less carbon dioxide gives purple.</td></tr>
                  <tr><th scope="row" className="border p-3">Oxygen</th><td className="border p-3">Insert a glowing wooden splint into a collected sample rich in oxygen.</td><td className="border p-3">The glowing splint relights.</td></tr>
                </tbody>
              </table>
            </div>
            <p>A glowing splint is a test for oxygen-rich gas, not a reliable way to measure the difference between ordinary inhaled and exhaled air.</p>
          </Card>

          <Card title="The Human Respiratory System">
            <p>Air travels through the nose or mouth, down the trachea, through the bronchi and bronchioles, and into the alveoli. The lungs contain the gas-exchange surfaces; the ribs, intercostal muscles and diaphragm help ventilate them.</p>
            <Figure compact src={f4Image('bio-human-respiratory-system.webp')}
              alt="Labelled respiratory organs: nasal cavity, mouth, larynx, trachea, bronchi, bronchioles, lungs and diaphragm"
              caption="The airways carry air to the alveoli, where oxygen and carbon dioxide are exchanged." />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <thead className="bg-slate-50"><tr><th scope="col" className="border p-3">Part</th><th scope="col" className="border p-3">Function</th></tr></thead>
                <tbody>{[
                  ['Nasal cavity', 'Filters, warms and moistens incoming air.'],
                  ['Larynx', 'Voice box at the entrance to the trachea.'],
                  ['Trachea', 'Carries air; cartilage keeps it open. Mucus traps particles, and cilia move mucus towards the throat.'],
                  ['Bronchi', 'Two main branches carrying air into the lungs.'],
                  ['Bronchioles', 'Smaller branching airways distributing air to the alveoli.'],
                  ['Alveoli', 'Tiny air sacs where gases diffuse between air and blood.'],
                  ['Ribs and intercostal muscles', 'Protect the lungs and move the rib cage during breathing.'],
                  ['Diaphragm', 'Muscular sheet beneath the lungs that changes chest volume when it contracts or relaxes.'],
                ].map(([part, role]) => <tr key={part}><th scope="row" className="border p-3 align-top font-semibold">{part}</th><td className="border p-3">{role}</td></tr>)}</tbody>
              </table>
            </div>
          </Card>

          <Card title="Breathing Mechanism: Inhaling and Exhaling">
            <Figure compact src={f4Image('bio-breathing-mechanism.webp')}
              alt="Inhalation and exhalation showing opposite rib and diaphragm movements and pressure changes"
              caption="Air moves from higher pressure to lower pressure as chest volume changes." />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <thead className="bg-slate-50"><tr>{['Feature', 'Inhalation (breathing in)', 'Exhalation at rest (breathing out)'].map(h => <th key={h} scope="col" className="border p-3">{h}</th>)}</tr></thead>
                <tbody>{[
                  ['External intercostal muscles', 'Contract; ribs move up and out', 'Relax; ribs move down and in'],
                  ['Diaphragm', 'Contracts and flattens downwards', 'Relaxes and returns to a dome shape'],
                  ['Chest volume', 'Increases', 'Decreases'],
                  ['Pressure inside lungs', 'Falls below atmospheric pressure', 'Rises above atmospheric pressure'],
                  ['Air movement', 'Air enters the lungs', 'Air leaves the lungs'],
                ].map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i} className="border p-3 align-top">{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <p><strong>Breathing model:</strong> a sealed bell jar represents the chest, balloons represent the lungs, a Y-shaped tube represents the trachea and bronchi, and a rubber sheet represents the diaphragm. Pulling the sheet down increases the volume and lowers the pressure, so the balloons inflate. Pushing it up makes them deflate.</p>
            <p><strong>Limitation:</strong> the model has rigid sides and cannot show rib movement; a flat rubber sheet also differs from the real dome-shaped diaphragm.</p>
          </Card>

          <Card title="Gaseous Exchange in the Alveoli">
            <p><strong>Diffusion</strong> is the net movement of particles from a region of higher concentration to a region of lower concentration. Oxygen diffuses from alveolar air into the blood; carbon dioxide diffuses from the blood into the alveoli and is breathed out.</p>
            <Figure compact src={f4Image('bio-alveoli-gaseous-exchange.webp')}
              alt="Alveolus and surrounding capillary showing oxygen diffusing into blood and carbon dioxide into alveolar air"
              caption="Oxygen and carbon dioxide diffuse in opposite directions across the thin alveolar and capillary walls." />
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-base text-slate-700">
                <thead className="bg-slate-50"><tr><th scope="col" className="border p-3">Adaptation</th><th scope="col" className="border p-3">How it helps gas exchange</th></tr></thead>
                <tbody>{[
                  ['One-cell-thick walls', 'Alveolar and capillary walls give a very short diffusion distance.'],
                  ['Moist lining', 'Gases dissolve before crossing the exchange surface.'],
                  ['Large surface area', 'Many tiny alveoli allow much gas to diffuse at once.'],
                  ['Dense network of capillaries', 'Blood brings carbon dioxide and carries oxygen away, helping maintain concentration gradients.'],
                  ['Continuous ventilation', 'Replaces alveolar air, supplying oxygen and removing carbon dioxide.'],
                ].map(([feature, role]) => <tr key={feature}><th scope="row" className="border p-3 align-top font-semibold">{feature}</th><td className="border p-3">{role}</td></tr>)}</tbody>
              </table>
            </div>
          </Card>







          <Card title="Aerobic Respiration">
            <Definition term="Aerobic respiration">
              the complete breakdown of glucose using oxygen, releasing a large amount of energy and
              producing carbon dioxide and water as waste. &ldquo;Aerobic&rdquo; means &ldquo;with
              air&rdquo;.
            </Definition>
            <Figure compact src={bioImages.aerobicEquation} alt="Glucose and oxygen form carbon dioxide and water, releasing energy as ATP and heat" />
            <p>
              <strong>Word equation:</strong> Glucose + Oxygen &rarr; Carbon dioxide + Water + Energy
            </p>
            <p>
              <strong>Symbol equation:</strong> C₆H₁₂O₆ + 6O₂ &rarr; 6CO₂ + 6H₂O + energy (about 2 900 kJ
              per mole of glucose; some energy is transferred to ATP and some is released as heat)
            </p>
            <p>
              Aerobic respiration takes place mainly inside the <strong>mitochondria</strong>, tiny
              sausage-shaped organelles in the cytoplasm. Cells that need a lot of energy — muscle cells,
              sperm cells and the cells lining the small intestine — contain very large numbers of
              mitochondria, which is a favourite &ldquo;explain the adaptation&rdquo; question.
            </p>
            <Figure
              src={bioImages.mitochondrion}
              alt="Labelled mitochondrion showing outer membrane, inner folded membrane and matrix"
              caption="Fig 3.1 — A mitochondrion. Its inner membrane is deeply folded, which gives a very large surface area for the reactions of aerobic respiration."
            />
            <Card title="What the released energy is used for">
              <ul className="list-inside list-disc space-y-1">
                <li>Contracting muscles so that we can move</li>
                <li>Building large molecules such as proteins from smaller ones</li>
                <li>Active transport — pulling substances across membranes against the concentration gradient</li>
                <li>Cell division for growth and repair</li>
                <li>Transmitting nerve impulses</li>
                <li>Keeping the body at a steady warm temperature (in mammals and birds)</li>
              </ul>
            </Card>
          </Card>

          <Card title="Anaerobic Respiration">
            <Definition term="Anaerobic respiration">
              the incomplete breakdown of glucose <em>without</em> oxygen, releasing a much smaller
              amount of energy. &ldquo;An-aerobic&rdquo; means &ldquo;without air&rdquo;.
            </Definition>
            <p>
              Because the glucose is only partly broken down, the products still contain a lot of unused
              chemical energy, which is why so little energy is released. Anaerobic respiration gives
              different products in different organisms.
            </p>
            <Figure
              src={bioImages.anaerobicComparison}
              alt="Comparison of anaerobic respiration in yeast and in human muscle"
              caption="Fig 3.2 — Anaerobic respiration in yeast produces ethanol and carbon dioxide; in human muscle it produces lactic acid only."
            />
            <div className="rounded-lg bg-slate-50 p-3 text-base">
              <p className="font-semibold text-slate-800">In yeast and other micro-organisms (fermentation):</p>
              <p className="mt-1">Glucose &rarr; Ethanol + Carbon dioxide + Energy</p>
              <p>C₆H₁₂O₆ &rarr; 2C₂H₅OH + 2CO₂ + energy (about 118 kJ, roughly 2 ATP)</p>
              <p className="mt-2 font-semibold text-slate-800">In human muscle cells:</p>
              <p className="mt-1">Glucose &rarr; Lactic acid + less energy</p>
              <p>C₆H₁₂O₆ &rarr; 2C₃H₆O₃ + energy</p>
            </div>
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">Aerobic respiration</th>
                  <th className="border p-2 text-left">Anaerobic respiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Oxygen needed?</td>
                  <td className="border p-2">Yes</td>
                  <td className="border p-2">No</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Breakdown of glucose</td>
                  <td className="border p-2">Complete</td>
                  <td className="border p-2">Incomplete</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Energy released</td>
                  <td className="border p-2">Much larger than anaerobic respiration</td>
                  <td className="border p-2">Small (about 2 ATP)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Products</td>
                  <td className="border p-2">Carbon dioxide + water</td>
                  <td className="border p-2">
                    Ethanol + carbon dioxide (yeast) <em>or</em> lactic acid (muscle)
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Where in the cell</td>
                  <td className="border p-2">Mainly in the mitochondria</td>
                  <td className="border p-2">In the cytoplasm</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Oxygen Debt — Why You Keep Panting After a Race">
            <p>
              During hard exercise your heart and lungs cannot deliver oxygen to the leg muscles fast
              enough. The muscles switch to anaerobic respiration so that they can keep working, but this
              produces <strong>lactic acid</strong>. Lactate production increases during intense exercise; fatigue has several causes.
            </p>
            <Definition term="Oxygen debt">
              the extra oxygen that must be taken in after exercise in order to break down the lactic
              acid that built up in the muscles during the exercise.
            </Definition>
            <p>
              This is why an athlete goes on breathing deeply and quickly for several minutes after
              crossing the finishing line: the extra oxygen is being used to oxidise the lactic acid into
              harmless carbon dioxide and water. The debt is being &ldquo;repaid&rdquo;.
            </p>
            <Figure
              src={bioImages.oxygenDebtGraph}
              alt="Graph of breathing rate before, during and after exercise showing oxygen debt repayment"
              caption="Fig 3.3 — Breathing rate before, during and after exercise. The shaded area after exercise stops is the oxygen debt being repaid."
            />
          </Card>

          <div className="rounded-xl border-2 border-slate-200 bg-slate-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-slate-700">
              Experiment 4: Showing that Respiration Releases Heat
            </h4>
            <p className="mb-3 text-base text-slate-700">
              <strong>Aim:</strong> To show that germinating seeds release heat energy as they respire.
            </p>
            <p className="mb-3 text-base text-slate-700">
              <strong>Materials:</strong> Two vacuum (thermos) flasks, two thermometers, germinating
              seeds, an equal mass of boiled and disinfected seeds, cotton wool.
            </p>
            <p className="mb-2 text-base font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={bioImages.respirationHeatStep1} alt="Filling two vacuum flasks with living and dead seeds">
                Fill flask A with living germinating seeds and flask B with the same mass of boiled,
                disinfected seeds.
              </Step>
              <Step n={2} src={bioImages.respirationHeatStep2} alt="Inserting thermometers and plugging both flasks with cotton wool">
                Push a thermometer into each flask so its bulb sits among the seeds, plug the necks with
                cotton wool (this keeps heat in but still lets air reach the seeds), and record the
                starting temperature of each.
              </Step>
              <Step n={3} src={bioImages.respirationHeatStep3} alt="Reading both thermometers after 24 hours">
                Leave both flasks for 24 hours in the same place, then read both thermometers again.
              </Step>
            </div>
            <p className="mt-3 text-base text-slate-700">
              <strong>Results:</strong> The temperature in flask A (living seeds) <strong>rises</strong>,
              often by several degrees. The temperature in flask B (dead seeds) stays about the same.
            </p>
            <p className="mt-2 text-base text-slate-700">
              <strong>Conclusion:</strong> Respiration in living cells releases heat energy. The dead
              seeds cannot respire, so no heat is produced. Both flasks are kept in the same place so that
              room temperature is a <strong>controlled variable</strong>.
            </p>
          </div>

          <Card title="Related Topic: Tobacco Smoking">
            <p>See <strong>Health and Diseases → Smoking, Alcohol and Drugs</strong> for emphysema, chronic bronchitis, lung cancer and low birth weight.</p>
          </Card>

          <Card title="Fermentation and Its Uses">
            <p>
              Anaerobic respiration in yeast is called <strong>fermentation</strong>, and people have used
              it for thousands of years.
            </p>
            <Figure
              src={bioImages.fermentationApparatus}
              alt="Fermentation apparatus with glucose and yeast connected to limewater"
              caption="Fig 3.4 — Fermentation apparatus. The oil layer keeps air out so that the yeast must respire anaerobically; the limewater turns milky as carbon dioxide bubbles through."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Baking:</strong> yeast in the dough produces carbon dioxide bubbles that make the
                bread rise. The ethanol evaporates during baking.
              </li>
              <li>
                <strong>Brewing:</strong> yeast converts the sugars in grain or fruit into ethanol, which
                is what makes beer and traditional brews alcoholic.
              </li>
              <li>
                <strong>Biogas:</strong> anaerobic bacteria break down animal dung in a digester,
                producing methane that can be burnt for cooking and lighting.
              </li>
              <li>
                <strong>Silage and sour milk:</strong> anaerobic bacteria produce lactic acid, which
                preserves the food by making it too acidic for spoilage organisms.
              </li>
            </ul>
          </Card>

          <ExamTip>
            <p>
              Three marks that are regularly thrown away in respiration questions: (1) writing
              &ldquo;energy is produced&rdquo; instead of &ldquo;energy is <strong>released</strong>&rdquo;
              — energy cannot be created; (2) forgetting that <strong>plants respire day and night</strong>,
              not only at night; (3) leaving out the boiled-seed <strong>control</strong> when asked to
              describe a respiration experiment.
            </p>
          </ExamTip>
        </div>

      </div>
    ),
  },

  /* =======================================================================
     4. TRANSPORT
  ======================================================================= */
  {
    id: 'transport',
    title: 'Transport Systems',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Large organisms have a problem: the cells deep inside the body are a long way from the food
              and oxygen they need, and a long way from anywhere to dump their waste. Diffusion alone is
              far too slow over those distances. Both plants and animals therefore have{' '}
              <strong>transport systems</strong> — plants move water and food in xylem and phloem, while
              animals pump blood through a system of vessels.
            </p>
          </div>

          <Card title="Diffusion, Osmosis and Active Uptake">
            <SyllabusTable headers={['Process', 'Meaning', 'Example in a plant']} rows={[
              ['Diffusion', 'Net movement of particles from higher to lower concentration; no metabolic energy is needed.', 'Carbon dioxide diffuses into a leaf for photosynthesis.'],
              ['Osmosis', 'Net movement of water through a partially permeable membrane from higher water potential (more dilute) to lower water potential (more concentrated).', 'Water enters a root hair cell from moist soil.'],
              ['Active uptake', 'Movement of ions against their concentration gradient using transport proteins and energy from respiration.', 'Root hairs absorb mineral ions even when their concentration is lower in soil than inside the cells.'],
            ]} />
            <p><strong>Water and ion uptake:</strong> root hairs provide a large surface area. Water enters by osmosis and crosses the cortex into the xylem. Mineral ions can enter by active transport; they are not absorbed by osmosis. Mitochondria supply energy for active uptake.</p>
          </Card>

          <Card title="Water Movement Through a Plant">
            <p className="rounded-lg bg-slate-50 p-3 font-semibold">Soil → root hairs → cortex → root xylem → stem xylem → leaf cells → air spaces → stomata → atmosphere</p>
            <p>Evaporation from leaf cells and diffusion through stomata create a <strong>transpiration pull</strong>. Cohesion between water molecules helps maintain a continuous column in xylem. The water carries dissolved mineral salts upwards; phloem carries dissolved sugars between sources and sinks.</p>
            <p><strong>Dye activity:</strong> place a cut celery or other suitable leafy shoot in coloured water, methylene blue or a teacher-prepared dilute potassium permanganate solution. After dye has moved upwards, examine teacher-cut transverse sections. Stained xylem reveals the route and arrangement of water-conducting tissue. Keep a similar shoot in plain water as a control.</p>
            <p className="text-sm">Use eye protection where instructed; a teacher handles stains and sharp blades. Dye traces water movement in cut tissue, rather than directly showing ion uptake by intact roots.</p>
          </Card>

          <Card title="Internal Structure of a Dicotyledonous Root and Stem">
            <p>The <strong>epidermis</strong> forms the outer layer and the <strong>cortex</strong> lies beneath it. Xylem, phloem and cambium form the vascular tissues, but their arrangement differs between a young dicot root and stem.</p>
            <SyllabusTable headers={['Tissue', 'Function', 'Arrangement']} rows={[
              ['Epidermis', 'Protection; root hairs absorb water and ions.', 'Outermost layer of root and stem.'],
              ['Cortex', 'Storage and movement of water through living cells.', 'Between epidermis and vascular tissue.'],
              ['Xylem', 'Carries water and mineral salts; provides support.', 'Central star-shaped xylem in a typical young dicot root; towards the inside of each stem vascular bundle.'],
              ['Phloem', 'Transports dissolved sugars and other organic solutes.', 'Between the arms of root xylem; towards the outside of stem vascular bundles.'],
              ['Cambium', 'Dividing cells make new xylem and phloem as the plant thickens.', 'Between xylem and phloem; forms a continuous ring during secondary growth.'],
            ]} />
            <p><strong>Slide activity:</strong> view prepared transverse sections of a dicot root and stem. Identify the epidermis, cortex and vascular tissues. In the stem, look for bundles arranged in a ring around the pith; in the root, look for the central xylem and phloem between its arms. Compare these observations with the stained xylem in the dye activity.</p>
          </Card>

          <Card title="Plasmolysis and Turgidity">
            <SyllabusTable headers={['Condition', 'Water movement', 'Effect on the cell']} rows={[
              ['Turgid cell', 'Water enters by osmosis in a more dilute surrounding solution.', 'The vacuole expands and the contents press against the cell wall. Turgor helps support soft plant tissues.'],
              ['Flaccid cell', 'Water loss reduces turgor pressure.', 'The cell becomes less firm; many flaccid cells cause wilting.'],
              ['Plasmolysed cell', 'More water leaves in a sufficiently concentrated solution.', 'The protoplast shrinks and the cell membrane pulls away from the cell wall. The wall keeps its shape.'],
            ]} />
            <p><strong>Potato-strip activity:</strong> cut equal-sized strips, blot and measure their starting masses. Place them in equal volumes of distilled water and different sugar or salt solutions for the same time and temperature. Blot consistently and reweigh. Strips usually gain mass and firmness in water and lose mass and firmness in concentrated solutions.</p>
            <p className="rounded-lg bg-slate-50 p-3 font-semibold">Percentage mass change = (final mass − initial mass) ÷ initial mass × 100</p>
            <p>Use a video or microscope view of suitable epidermal cells to observe the membrane pulling away during plasmolysis; potato mass changes alone do not show that separation. Visking tubing filled with sugar solution and immersed in water can model a partially permeable membrane, but it is not a living cell.</p>
          </Card>

          <Definition term="Transpiration">
            the loss of water vapour from a plant, mainly through the stomata on the leaves, by
            evaporation and diffusion.
          </Definition>

          <Card title="How Transpiration Works">
            <p>
              Water evaporates from the wet cell walls inside the leaf into the air spaces of the spongy
              mesophyll layer. It then diffuses out through the <strong>stomata</strong> — small pores in
              the lower epidermis, each controlled by a pair of bean-shaped <strong>guard cells</strong>.
            </p>
            <p>
              As water leaves the top of the plant, more water is pulled up the xylem vessels from the
              roots in an unbroken column. This continuous flow is called the{' '}
              <strong>transpiration stream</strong>, and it is what carries dissolved mineral salts from
              the soil all the way up to the leaves.
            </p>
            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.transpirationOverview}
              alt="Transpiration in a plant showing water uptake, transport and loss"
              caption="Fig 4.1 — The transpiration stream: water enters at the root hairs, travels up the xylem and evaporates from the leaves."
            />
            <Card title="Why transpiration is useful to the plant">
              <ul className="list-inside list-disc space-y-1">
                <li>It pulls water up from the roots to every leaf.</li>
                <li>It carries dissolved mineral salts up with that water.</li>
                <li>Evaporation cools the leaf on a hot day, just as sweating cools us.</li>
                <li>
                  It keeps cells <strong>turgid</strong> (firm and full of water), which supports soft
                  green stems and keeps leaves spread out to catch light.
                </li>
                <li>It supplies the water needed as a raw material for photosynthesis.</li>
              </ul>
            </Card>
          </Card>

          <Card title="Factors That Change the Rate of Transpiration">
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Factor</th>
                  <th className="border p-2 text-left">Effect on the rate</th>
                  <th className="border p-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Higher temperature</td>
                  <td className="border p-2">Increases</td>
                  <td className="border p-2">
                    Water molecules gain energy, so evaporation and diffusion both speed up
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Windy conditions</td>
                  <td className="border p-2">Increases</td>
                  <td className="border p-2">
                    Wind blows away the humid air just outside the stomata, keeping the concentration
                    gradient steep
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">High humidity</td>
                  <td className="border p-2">Decreases</td>
                  <td className="border p-2">
                    The air is already full of water vapour, so there is a smaller concentration gradient
                    for water to diffuse down
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Bright light</td>
                  <td className="border p-2">Increases</td>
                  <td className="border p-2">
                    Stomata open wide in the light to let carbon dioxide in for photosynthesis, and water
                    escapes through the same pores
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Larger leaf surface area</td>
                  <td className="border p-2">Increases</td>
                  <td className="border p-2">More stomata, so more places for water vapour to escape</td>
                </tr>
                <tr><td className="border p-2 font-semibold">More stomata per unit area</td><td className="border p-2">Usually increases, if other factors are equal</td><td className="border p-2">More open pores provide more routes for water vapour to escape.</td></tr>
              </tbody>
            </table>
          </Card>

          <Card title="How Plants Reduce Water Loss">
            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.leafWaterSavingAdaptations}
              alt="Leaf adaptations that reduce water loss"
              caption="Fig 4.2 — Adaptations that cut water loss: a thick waxy cuticle, few stomata on the upper surface, sunken stomata, hairy leaves and rolled or spiny leaves."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>A waxy cuticle</strong> on the upper surface is waterproof, so almost no water
                escapes through the top of the leaf.
              </li>
              <li>
                <strong>Most stomata are on the lower surface</strong>, which is shaded and cooler, so
                less evaporation occurs.
              </li>
              <li>
                <strong>Stomata close at night</strong> and in very dry conditions, shutting off the main
                escape route.
              </li>
              <li>
                <strong>Hairs on the leaf surface</strong> trap a layer of still, humid air next to the
                stomata, reducing the concentration gradient.
              </li>
              <li>
                <strong>Sunken stomata</strong> sit in pits, which also traps humid air.
              </li>
              <li>
                <strong>Desert plants</strong> such as cacti and aloes have leaves reduced to spines, and
                store water in thick fleshy stems.
              </li>
            </ul>
          </Card>

          <Card title="Measuring the Rate of Transpiration — the Potometer">
            <p>
              A <strong>potometer</strong> measures how quickly a leafy shoot takes up water, and since
              almost all of the water taken up is lost by transpiration, this gives a good estimate of the
              transpiration rate.
            </p>
            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.potometer}
              alt="Potometer apparatus for measuring transpiration rate"
              caption="Fig 4.3 — A simple potometer. As the shoot transpires, the air bubble moves along the capillary tube; the distance it travels in a set time gives the rate."
            />
            <p>
              To use it, cut the shoot <strong>under water</strong> so no air enters the xylem, seal every
              joint with petroleum jelly so the only water lost is through the leaves, introduce a single
              air bubble, and time how far the bubble travels along the scale in, say, five minutes. Then
              change one factor at a time — put a fan next to it for wind, a lamp for light, or a plastic
              bag over the shoot for humidity — and repeat.
            </p>
          </Card>

          <Card title="Investigating Transpiration and Leaf Adaptations">
            <p><strong>Potometer calculations:</strong> water uptake rate = bubble distance ÷ time. If the tube cross-sectional area is known, volume uptake rate = area × distance ÷ time. This estimates transpiration; some water is retained or used in the plant.</p>
            <p>Change one factor at a time: fan speed, temperature, humidity or light intensity. Keep leaf area, apparatus, measurement time and other conditions constant. A lamp can change both light and temperature, so control its heating effect. Repeat readings and compare means.</p>
            <p><strong>Stomata and water loss:</strong> use comparable leaves or shoots with petroleum jelly on the upper surface, lower surface, both surfaces, or neither. Compare mass loss over equal times while limiting water loss from soil and cut surfaces. In many land plants, coating the lower surface reduces loss more because it has more stomata; distribution differs among species. Inspect prepared epidermal slides or teacher-prepared leaf impressions to compare stomatal numbers.</p>
            <p><strong>Field observation:</strong> identify leaves with small or reduced surface area, thick waxy cuticles, fewer or sheltered stomata, and hairs that trap still humid air. Observe and photograph leaves on living plants; <strong>do not pluck them</strong>.</p>
            <p><strong>Importance:</strong> transpiration supports water and mineral-salt uptake and transport. Evaporation also cools leaves.</p>
          </Card>

          <Card title="Blood — What It Is Made Of">
            <p>
              Blood is a tissue. An adult has about 5 litres of it, and it is made of a straw-coloured
              liquid with three kinds of cell floating in it.
            </p>
            <Figure compact maxHeight="min(280px, 40svh)" src={f4Image('bio-blood-components-drawing.webp')}
              alt="Test tube of separated blood showing plasma, buffy coat and red cells"
              caption="Fig 4.4 — Blood separated by spinning: plasma on top (about 55%), a thin layer of white cells and platelets, and red blood cells at the bottom (about 45%)."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Structure</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Plasma</td>
                  <td className="border p-2">
                    A pale yellow liquid, about 90% water, making up just over half the blood
                  </td>
                  <td className="border p-2">
                    Transports digested food, carbon dioxide, urea, hormones, antibodies, mineral salts and
                    heat around the body
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Red blood cells (erythrocytes)</td>
                  <td className="border p-2">
                    Biconcave discs with <strong>no nucleus</strong>, packed full of the red pigment{' '}
                    <strong>haemoglobin</strong>
                  </td>
                  <td className="border p-2">
                    Carry oxygen. Haemoglobin joins with oxygen in the lungs to form oxyhaemoglobin and
                    releases it in the tissues
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">White blood cells (leucocytes)</td>
                  <td className="border p-2">
                    Larger cells that <strong>do</strong> have a nucleus; two main types
                  </td>
                  <td className="border p-2">
                    Defence. <em>Phagocytes</em> engulf and digest germs; <em>lymphocytes</em> make
                    antibodies
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Platelets</td>
                  <td className="border p-2">Tiny fragments of cells with no nucleus</td>
                  <td className="border p-2">
                    Start the clotting process at a wound, sealing it and keeping germs out
                  </td>
                </tr>
              </tbody>
            </table>
            <Example title="Why red blood cells are shaped the way they are">
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <strong>No nucleus</strong> — leaves more room inside for haemoglobin, so each cell
                  carries more oxygen.
                </li>
                <li>
                  <strong>Biconcave disc</strong> (dented on both sides) — gives a larger surface area for
                  oxygen to diffuse across.
                </li>
                <li>
                  <strong>Small and flexible</strong> — can squeeze in single file through the narrowest
                  capillaries.
                </li>
              </ul>
            </Example>
          </Card>

          <Card title="Functions of Blood">
            <SyllabusTable headers={['Function', 'Examples']} rows={[
              ['Transport', 'Carries oxygen, carbon dioxide, nutrients, hormones and urea; distributes heat.'],
              ['Defence', 'White blood cells engulf pathogens or participate in antibody responses; platelets help clotting.'],
              ['Homeostasis', 'Helps maintain temperature, pH and fluid balance.'],
            ]} />
            <p><strong>Slide activity:</strong> observe a prepared stained blood smear. Identify numerous red blood cells and fewer larger white blood cells with nuclei; platelets appear as small fragments. Plasma is the liquid component and is not a cell. Use prepared slides rather than collecting blood.</p>
          </Card>

          <Card title="Blood Clotting">
            <p>
              When a blood vessel is cut, platelets stick to the damaged edges and release chemicals.
              These change the soluble plasma protein <strong>fibrinogen</strong> into insoluble threads
              of <strong>fibrin</strong>, which form a mesh across the wound. Red blood cells become
              trapped in the mesh, forming a clot that hardens into a scab.
            </p>
            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.bloodClotting}
              alt="Three stage diagram of blood clotting at a cut"
              caption="Fig 4.5 — Clotting: platelets gather, fibrin threads form a mesh, and trapped red cells create a clot that becomes a scab."
            />
            <p>
              Clotting matters for two reasons: it stops further loss of blood, and it seals the wound
              against bacteria. People with <em>haemophilia</em> lack one of the clotting chemicals, so
              even small cuts bleed for a long time.
            </p>
          </Card>

          <Card title="Blood Vessels">

            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.bloodVesselsComparison}
              alt="Side by side comparison of artery, vein and capillary structure"
              caption="Fig 4.6 — Schematic vessel structures (not to scale): compare wall thickness, lumen and valves."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">Artery</th>
                  <th className="border p-2 text-left">Vein</th>
                  <th className="border p-2 text-left">Capillary</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Direction of flow</td>
                  <td className="border p-2">Away from the heart</td>
                  <td className="border p-2">Towards the heart</td>
                  <td className="border p-2">Between arteries and veins, through the tissues</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Wall</td>
                  <td className="border p-2">Thick, muscular and elastic</td>
                  <td className="border p-2">Thin, with less muscle</td>
                  <td className="border p-2">One cell thick</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Lumen (inner space)</td>
                  <td className="border p-2">Narrow</td>
                  <td className="border p-2">Wide</td>
                  <td className="border p-2">Extremely narrow — one red cell at a time</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Blood pressure</td>
                  <td className="border p-2">High, and comes in surges (you can feel a pulse)</td>
                  <td className="border p-2">Low and steady</td>
                  <td className="border p-2">Falling as blood passes through</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Valves</td>
                  <td className="border p-2">None</td>
                  <td className="border p-2">Present, to stop blood flowing backwards</td>
                  <td className="border p-2">None</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Main job</td>
                  <td className="border p-2">Carry blood at high pressure from the heart</td>
                  <td className="border p-2">Return blood to the heart</td>
                  <td className="border p-2">
                    Exchange oxygen, food, carbon dioxide and waste with the cells
                  </td>
                </tr>
              </tbody>
            </table>
            <p><strong>Drawing activity:</strong> draw and label an artery, vein and capillary. Mark the lumen, vessel wall and a vein valve; explain how the structures relate to pressure, flow direction and exchange. These diagrams are schematic, not to scale.</p>
            <WatchOut>
              <p>
                Arteries do <strong>not</strong> always carry oxygenated blood. The{' '}
                <strong>pulmonary artery</strong> carries deoxygenated blood from the heart to the lungs,
                and the <strong>pulmonary vein</strong> carries oxygenated blood back. The names artery
                and vein describe <em>direction</em>, not oxygen content.
              </p>
            </WatchOut>
          </Card>

          <Card title="The Heart and Double Circulation">
            <p>
              The heart is a muscular pump about the size of your fist, made of a special{' '}
              <strong>cardiac muscle</strong> adapted for repeated contractions. It has four chambers: two thin-walled{' '}
              <strong>atria</strong> at the top that receive blood, and two thick-walled{' '}
              <strong>ventricles</strong> below that pump it out.
            </p>
            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.heartStructure}
              alt="Labelled diagram of the human heart with chambers, valves and main vessels"
              caption="Fig 4.7 — The human heart. Blue shows deoxygenated blood on the right side, red shows oxygenated blood on the left side."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Right atrium</td>
                  <td className="border p-2">Receives deoxygenated blood from the body via the vena cava</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Right ventricle</td>
                  <td className="border p-2">Pumps deoxygenated blood to the lungs through the pulmonary artery</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Left atrium</td>
                  <td className="border p-2">Receives oxygenated blood from the lungs via the pulmonary vein</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Left ventricle</td>
                  <td className="border p-2">
                    Pumps oxygenated blood to the whole body through the aorta — it has the thickest wall
                    because it must generate the highest pressure
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Valves (bicuspid, tricuspid, semilunar)</td>
                  <td className="border p-2">
                    Make sure blood flows in one direction only; the &ldquo;lub-dub&rdquo; heart sound is
                    the valves snapping shut
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Septum</td>
                  <td className="border p-2">
                    The wall down the middle that keeps oxygenated and deoxygenated blood completely
                    separate
                  </td>
                </tr>
              </tbody>
            </table>
            <p><strong>Valve positions:</strong> the tricuspid valve lies between the right atrium and right ventricle; the bicuspid (mitral) valve lies between the left atrium and left ventricle. Semilunar valves guard the exits into the pulmonary artery and aorta, preventing backflow into the ventricles.</p>
            <p className="rounded-lg bg-slate-50 p-3 font-semibold">Body → vena cava → right atrium → tricuspid valve → right ventricle → pulmonary artery → lungs → pulmonary veins → left atrium → bicuspid valve → left ventricle → aorta → body</p>
            <p><strong>Drawing activity:</strong> examine a heart model, then draw and label the four chambers, septum, valves and main vessels. Use arrows to show blood flow. On a front-view drawing, the person’s right side appears on your left. Watch a simulation to link atrial contraction, ventricular contraction and relaxation to valve opening and closing.</p>
            <Definition term="Double circulation">
              a circulatory system in which blood passes through the heart <strong>twice</strong> for
              every one complete circuit of the body — once on the way to and from the lungs (pulmonary
              circulation) and once on the way to and from the rest of the body (systemic circulation).
            </Definition>
            <Figure compact maxHeight="min(280px, 40svh)" src={bioImages.doubleCirculation}
              alt="Double circulation diagram showing pulmonary and systemic circuits"
              caption="Fig 4.8 — Double circulation. The blood is re-pressurised by the heart before being sent round the body, so it travels faster and delivers oxygen more efficiently."
            />
            <Card title="Looking after your heart">
              <ul className="list-inside list-disc space-y-1">
                <li>Take regular exercise — it strengthens the cardiac muscle.</li>
                <li>Eat less saturated fat and salt, to reduce fatty deposits in the arteries and lower blood pressure.</li>
                <li>Do not smoke — nicotine raises blood pressure and carbon monoxide reduces the oxygen the blood can carry.</li>
                <li>Avoid excessive alcohol and keep body mass in a healthy range.</li>
              </ul>
            </Card>
          </Card>
        </div>

      </div>
    ),
  },

  /* =======================================================================
     5. REPRODUCTION
  ======================================================================= */
  {
    id: 'reproduction',
    title: 'Reproductive Systems',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Reproduction</strong> is the process by which living organisms produce new
              individuals of their own kind. It is the only one of the seven life processes that an
              individual can live without — but without it a species would disappear in a single
              generation.
            </p>
          </div>

          <Card title="Structure of a Simple Flower">
            <p>A flower contains the reproductive organs of a flowering plant. The <strong>stamen</strong> is the male structure (anther and filament); the <strong>carpel</strong> is the female structure (stigma, style and ovary).</p>
            <Figure compact src={f4Image('bio-simple-flower-structure.webp')}
              alt="Simple flower labelled with stigma, style, ovary, ovules, anther, filament, petal, sepal and receptacle; brackets group the carpel and stamen"
              caption="The carpel consists of the stigma, style and ovary. Each stamen consists of an anther and filament." />
            <SyllabusTable headers={['Part', 'Function']} rows={[
              ['Petals and sepals', 'Petals often attract pollinators; sepals protect the flower bud.'],
              ['Anther and filament', 'The anther produces pollen grains; the filament supports it. Pollen carries the male gametes.'],
              ['Stigma and style', 'The stigma receives pollen; the style provides the route for a pollen tube towards the ovary.'],
              ['Ovary and ovule', 'The ovary contains ovules; each ovule contains an egg cell. After fertilisation, an ovule becomes a seed and the ovary usually develops into a fruit.'],
            ]} />
            <p><strong>Pollination</strong> is transfer of pollen from an anther to a stigma of the same species. After compatible pollen lands, a pollen tube grows down the style into an ovule. A male nucleus fuses with the egg nucleus: this is <strong>fertilisation</strong>. The zygote develops into the embryo.</p>
            <p><strong>Observation:</strong> examine a suitable flower with a hand lens or bio-viewer and identify its parts. Pollination is pollen transfer; fertilisation is fusion of gamete nuclei.</p>
          </Card>

          <Card title="Wind and Insect Pollinated Flowers">
            <Figure compact src={f4Image('bio-wind-insect-pollinated-flowers.webp')} alt="Labelled wind pollinated and insect pollinated flower structures" caption="Required drawing: compare exposed anthers and feathery stigmas with bright petals and enclosed reproductive parts." />
            <SyllabusTable headers={['Feature', 'Wind pollinated', 'Insect pollinated']} rows={[
              ['Petals', 'Small or inconspicuous', 'Often large and brightly coloured'],
              ['Scent and nectar', 'Usually absent', 'Often present to attract insects'],
              ['Anthers', 'Exposed, often hanging outside', 'Usually inside, positioned to touch visitors'],
              ['Stigma', 'Large, feathery and exposed', 'Sticky and positioned to receive pollen from insects'],
              ['Pollen', 'Very abundant, light and usually smooth', 'Usually fewer grains; often sticky or textured'],
            ]} />
            <p><strong>Drawing activity:</strong> examine specimens, draw one wind-pollinated and one insect-pollinated flower, and label the anthers, stigmas, petals and ovary. Link each feature to how pollen is transferred.</p>
          </Card>

          <Card title="Maize and Bean Seeds">
            <Figure compact src={f4Image('bio-maize-bean-seeds.webp')}
              alt="Drawn maize and bean seed sections labelled with seed coat, cotyledons, endosperm, plumule and radicle"
              caption="Maize has one cotyledon and a large endosperm; bean has two food-storing cotyledons." />
            <SyllabusTable headers={['Feature', 'Maize (monocotyledon)', 'Bean (dicotyledon)']} rows={[
              ['Cotyledons', 'One cotyledon (scutellum); transfers stored food to the embryo', 'Two cotyledons; store much of the seed’s food'],
              ['Endosperm', 'Large food store surrounding the embryo', 'Largely absorbed during seed development; food is stored in cotyledons'],
              ['Testa', 'Protective seed coat, fused with the fruit wall in a maize grain', 'Protective seed coat surrounding the cotyledons'],
              ['Radicle', 'Embryonic root', 'Embryonic root'],
              ['Plumule', 'Embryonic shoot', 'Embryonic shoot'],
            ]} />
            <p><strong>Comparison activity:</strong> examine dry and soaked maize and bean seeds. Compare the external coats, then use teacher-prepared sections to identify the cotyledons, endosperm, plumule and radicle.</p>
          </Card>

          <Card title="Germination and Percentage Germination">
            <p><strong>Germination</strong> is the beginning of growth of the embryo into a seedling. Water is absorbed, enzymes become active, stored food is digested, and respiration provides energy. The radicle usually emerges first, followed by the shoot. Stored food supports the seedling until its leaves can photosynthesise.</p>
            <SyllabusTable headers={['Condition', 'Why it is needed', 'Comparison activity']} rows={[
              ['Moisture', 'Activates enzymes and supports reactions and growth', 'Compare moist and dry seeds.'],
              ['Suitable warmth', 'Allows enzymes to work at an appropriate rate', 'Compare moist seeds at suitable room temperature and in cold conditions.'],
              ['Oxygen', 'Needed for aerobic respiration', 'Use a teacher-prepared low-oxygen treatment alongside aerated moist seeds.'],
            ]} />
            <p>Use the same species, number and quality of seeds, change one condition at a time, and observe over the same period. Light is not essential for all seeds; requirements vary with species.</p>
            <p className="rounded-lg bg-slate-50 p-3 font-semibold">Percentage germination = number of seeds germinated ÷ total seeds tested × 100</p>
            <p><strong>Example:</strong> 18 out of 25 seeds germinate: 18 ÷ 25 × 100 = <strong>72%</strong>. State a consistent criterion, such as emergence of the radicle, when counting.</p>
          </Card>

          <Card title="Two Kinds of Reproduction">
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left"></th>
                  <th className="border p-2 text-left">Asexual reproduction</th>
                  <th className="border p-2 text-left">Sexual reproduction</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Parents needed</td>
                  <td className="border p-2">One</td>
                  <td className="border p-2">Two (usually)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Gametes (sex cells)</td>
                  <td className="border p-2">Not involved</td>
                  <td className="border p-2">Two gametes fuse at fertilisation</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Offspring</td>
                  <td className="border p-2">
                    Genetically identical to the parent — <strong>clones</strong>
                  </td>
                  <td className="border p-2">Genetically different from the parents and each other</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Variation</td>
                  <td className="border p-2">None</td>
                  <td className="border p-2">Plenty</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Speed</td>
                  <td className="border p-2">Fast</td>
                  <td className="border p-2">Slower</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Definition term="Vegetative reproduction (vegetative propagation)">
            a type of asexual reproduction in flowering plants in which a new plant grows from a part of
            the parent plant — a root, a stem or a leaf — without any seeds, flowers or fertilisation
            being involved.
          </Definition>

          <Card title="Natural Vegetative Reproduction">
            <Figure
              src={bioImages.vegetativeNatural}
              alt="Six natural vegetative structures: rhizome, stem tuber, root tuber, bulb, corm and runner"
              caption="Fig 5.1 — Natural vegetative structures. In each case a swollen underground or creeping part stores food and grows into a new plant."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Structure</th>
                  <th className="border p-2 text-left">What it is</th>
                  <th className="border p-2 text-left">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Rhizome</td>
                  <td className="border p-2">
                    A swollen underground <em>stem</em> that grows horizontally and sends up new shoots
                  </td>
                  <td className="border p-2">Ginger, couch grass, canna lily</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Stem tuber</td>
                  <td className="border p-2">
                    The swollen tip of an underground stem, storing food; the &ldquo;eyes&rdquo; are buds
                  </td>
                  <td className="border p-2">Irish potato</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Root tuber</td>
                  <td className="border p-2">A swollen <em>root</em> packed with stored food</td>
                  <td className="border p-2">Sweet potato, cassava, dahlia</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Bulb</td>
                  <td className="border p-2">
                    A short stem surrounded by fleshy leaf bases packed with stored food
                  </td>
                  <td className="border p-2">Onion, garlic, daffodil</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Corm</td>
                  <td className="border p-2">A short, swollen, upright underground stem</td>
                  <td className="border p-2">Gladiolus, taro (madhumbe)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Runner (stolon)</td>
                  <td className="border p-2">
                    A stem that creeps along the ground and grows roots where it touches the soil
                  </td>
                  <td className="border p-2">Strawberry, kikuyu grass</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Sucker</td>
                  <td className="border p-2">A shoot growing from the base of the parent stem</td>
                  <td className="border p-2">Banana, pineapple, sisal</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Artificial Vegetative Propagation">
            <p>
              These are methods farmers and gardeners use to multiply plants deliberately, because they
              produce offspring identical to a parent with desirable qualities.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { name: 'Cuttings', file: 'cuttings', note: 'Plant a piece of stem with buds. Roots develop from the cutting; examples include cassava, sugar cane, roses and hibiscus.' },
                { name: 'Layering', file: 'layering', note: 'Bend and bury part of a branch while it is still attached to the parent. Separate it once roots form; examples include jasmine and raspberries.' },
                { name: 'Grafting', file: 'grafting', note: 'Join a scion shoot to a rooted stock and bind the union so their tissues join. Common in citrus, mango, avocado and grapes.' },
                { name: 'Budding', file: 'budding', note: 'Insert one bud under the bark of the stock and secure it while the tissues join. Common in roses and citrus.' },
                { name: 'Tissue culture', file: 'tissue-culture', note: 'Grow small pieces of plant tissue on sterile nutrient medium. Many plants can be produced; starting with suitable disease-free material helps avoid spreading infections.' },
              ].map(method => (
                <figure key={method.file} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
                  <img src={f4Image(`bio-propagation-${method.file}.webp`)} alt={`Textbook drawing of ${method.name.toLowerCase()}`}
                    width={360} height={360} loading="lazy" decoding="async"
                    className="mx-auto block h-44 w-full object-contain" />
                  <figcaption className="mt-3">
                    <span className="block text-lg font-bold text-slate-900">{method.name}</span>
                    <span className="mt-1 block text-base leading-relaxed text-slate-700">{method.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Advantages of vegetative reproduction</th>
                  <th className="border p-2 text-left">Disadvantages</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">
                    Offspring are identical to the parent, so a good variety is preserved exactly
                  </td>
                  <td className="border p-2">
                    No genetic variation, so the whole crop can be wiped out by one disease or pest
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">Only one parent is needed — no pollination or seed required</td>
                  <td className="border p-2">Overcrowding, since new plants grow close to the parent</td>
                </tr>
                <tr>
                  <td className="border p-2">
                    New plants grow quickly using the food already stored in the tuber, bulb or corm
                  </td>
                  <td className="border p-2">
                    Poor dispersal, so the plants compete with each other for light, water and minerals
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">Useful for plants that produce few or no viable seeds</td>
                  <td className="border p-2">Diseases in the parent are passed straight to the offspring</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Advantages and Disadvantages of Asexual Reproduction">
            <p>Rhizomes (such as ginger), stem tubers (such as potatoes), and cuttings can produce new plants without fusion of gametes. The offspring are usually genetically identical clones of the parent, apart from mutations.</p>
            <SyllabusTable headers={['Advantages', 'Disadvantages']} rows={[
              ['Only one parent is needed; no pollination or fertilisation is required.', 'Little genetic variation can make the population vulnerable to the same disease or environmental change.'],
              ['Rapid multiplication preserves useful characteristics.', 'Crowding can increase competition for light, water and minerals.'],
              ['Stored reserves may support early growth.', 'Disease can be passed from parent material to the offspring.'],
            ]} />
            <p><strong>Activity:</strong> compare a rhizome, tuber and cutting; identify buds that can grow into shoots. Compare cloning with sexual reproduction, where gamete fusion produces variation.</p>
          </Card>

          <h3 className="border-t border-slate-200 pt-8 text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">Reproduction in Animals</h3>

          <Card title="Puberty">
            <Figure compact src={f4Image('bio-puberty-changes.webp')}
              alt="Labelled drawing of puberty changes with a female figure on the left and a male figure on the right"
              caption="Typical changes at puberty. The timing and pattern of development vary from person to person." />
            <p><strong>Puberty</strong> is the stage when hormonal changes lead to sexual maturity. Timing varies from person to person. Both sexes usually develop pubic and underarm hair and have a growth spurt.</p>
            <SyllabusTable headers={['Typical changes in girls', 'Typical changes in boys']} rows={[
              ['Breasts develop; the pelvis widens.', 'Facial hair develops; the voice deepens.'],
              ['Ovulation and menstruation begin.', 'Testes and penis grow; sperm production begins.'],
            ]} />
            <p>Pre-menstrual symptoms may include breast tenderness, mood changes and abdominal cramps. Period pain can occur before or during menstruation. Discuss these changes respectfully; severe or persistent pain should be discussed with a trusted adult or healthcare professional.</p>
          </Card>

          <Card title="The Human Male Reproductive System">
            <Figure
              compact src={bioImages.maleReproductiveSystem}
              alt="Labelled human male reproductive system"
              caption="Fig 5.3 — The male reproductive system."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Testes</td>
                  <td className="border p-2">Produce sperm cells and the hormone testosterone</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Scrotum</td>
                  <td className="border p-2">
                    A bag of skin holding the testes outside the body, keeping them about 2&nbsp;&deg;C
                    cooler than body temperature, which sperm need in order to develop
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Epididymis</td>
                  <td className="border p-2">Stores sperm while they mature</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Sperm duct (vas deferens)</td>
                  <td className="border p-2">Carries sperm from the testis towards the urethra</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Prostate gland and seminal vesicles</td>
                  <td className="border p-2">
                    Add fluids to semen: seminal vesicles supply fructose-rich fluid, while the prostate adds fluid that supports sperm function; sperm plus these fluids form semen
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Urethra</td>
                  <td className="border p-2">Carries either urine or semen out through the penis</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Penis</td>
                  <td className="border p-2">Places semen inside the female reproductive tract</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="The Human Female Reproductive System">
            <Figure
              compact src={bioImages.femaleReproductiveSystem}
              alt="Labelled human female reproductive system"
              caption="Fig 5.4 — The female reproductive system."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Ovaries</td>
                  <td className="border p-2">
                    Produce egg cells (ova) and the hormones oestrogen and progesterone; one egg is
                    normally released each month
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Oviduct (fallopian tube)</td>
                  <td className="border p-2">
                    Carries the egg towards the uterus; <strong>fertilisation happens here</strong>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Uterus (womb)</td>
                  <td className="border p-2">
                    A muscular bag with a thick blood-rich lining where the embryo implants and develops
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Cervix</td>
                  <td className="border p-2">
                    The ring of muscle at the neck of the uterus; it holds the baby in during pregnancy
                    and widens during birth
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vagina</td>
                  <td className="border p-2">Receives the penis during intercourse and is the birth canal</td>
                </tr>
              </tbody>
            </table>
            <p><strong>Drawing activity:</strong> draw and label the male and female reproductive systems. Include the epididymis and sperm duct on the male drawing, and the ovary, oviduct, uterus, cervix and vagina on the female drawing. State the function of each.</p>
          </Card>

          <Card title="Sex Cells and Fertilisation">
            <Figure compact src={f4Image('bio-sperm-and-ovum.webp')} alt="Labelled sperm and ovum showing nucleus, acrosome, mitochondria, tail, cytoplasm and membrane" caption="Required drawing: label the structures of both sex cells. The illustrations are not to scale." />
            <SyllabusTable headers={['Cell or structure', 'Function or adaptation']} rows={[
              ['Sperm nucleus', 'Contains the male genetic information; half the usual chromosome number.'],
              ['Acrosome', 'Contains enzymes that help the sperm pass through coverings of the ovum.'],
              ['Midpiece and tail', 'Mitochondria supply energy; the tail propels the sperm.'],
              ['Ovum nucleus', 'Contains female genetic information; half the usual chromosome number.'],
              ['Ovum cytoplasm and outer coverings', 'Cytoplasm supports early development; coverings protect the cell and participate in sperm recognition.'],
            ]} />
            <p><strong>Route of sperm:</strong> testes → epididymis → sperm duct → urethra → vagina → cervix → uterus → oviduct. After ovulation, the ovum enters an oviduct. Fertilisation usually occurs there.</p>
            <Definition term="Fertilisation">fusion of the nuclei of a male and female gamete to form a zygote with the full chromosome number.</Definition>
            <p>The zygote divides as it travels towards the uterus. The resulting embryo implants in the uterine lining. <strong>Drawing activity:</strong> draw and label a sperm and an ovum and link their structures to their functions.</p>
          </Card>

          <Card title="The Menstrual Cycle">
            <p>The menstrual cycle prepares the uterus for pregnancy. <strong>Day 1</strong> is the first day of menstruation. A 28-day cycle is an illustration, not a fixed pattern for everyone; cycle length and the timing of ovulation vary.</p>
            <Figure compact src={bioImages.menstrualCycle} alt="Illustrated 28-day example showing menstruation, lining repair, ovulation and maintenance of the uterine lining" caption="Required illustration: stages of an example cycle, with roles of oestrogen and progesterone." />
            <SyllabusTable headers={['Stage (example only)', 'What happens']} rows={[
              ['Days 1–5: menstruation', 'The uterine lining is shed as blood and tissue when hormone levels fall.'],
              ['Before ovulation', 'Oestrogen supports repair and thickening of the uterine lining.'],
              ['Around day 14 in this example', 'An ovum is released from an ovary: ovulation.'],
              ['After ovulation', 'Progesterone helps maintain the lining. If pregnancy does not occur, hormone levels fall and menstruation begins again.'],
            ]} />
            <p><strong>Illustration activity:</strong> draw a timeline or cycle, mark menstruation and ovulation, and explain how oestrogen and progesterone affect the lining. Do not use the example dates as a reliable way to predict an individual’s fertile days.</p>
          </Card>

          <Card title="The Placenta">
            <p>The <strong>placenta</strong> is an exchange organ between maternal and fetal blood. The blood supplies normally remain separate; substances cross a thin exchange barrier. The umbilical cord links the fetus to the placenta.</p>
            <SyllabusTable headers={['Direction', 'Substances exchanged']} rows={[
              ['Mother to fetus', 'Oxygen, glucose, amino acids, water, mineral ions and some maternal antibodies.'],
              ['Fetus to mother', 'Carbon dioxide and metabolic wastes such as urea.'],
            ]} />
            <p>The mother’s lungs and kidneys remove the fetal wastes after they enter her circulation. The placenta also produces hormones that help maintain pregnancy. It is not a complete barrier: some drugs, alcohol and pathogens can cross.</p>
            <p><strong>Activity:</strong> watch a simulation of placental exchange and list the substances moving in each direction.</p>
          </Card>



          <Card title="Birth Control and Contraception">
            <Definition term="Contraception">
              the deliberate prevention of pregnancy, for example by preventing ovulation or preventing sperm from reaching and fertilising an egg.
            </Definition>
            <Figure
              src={bioImages.contraceptionMethods}
              alt="Chart of contraception methods grouped as natural, barrier, hormonal and surgical"
              caption="Fig 5.7 — Contraception methods grouped into four families. Only condoms also give protection against sexually transmitted infections."
            />
            <table className="w-full border-collapse text-base text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">Method</th>
                  <th className="border p-2 text-left">How it works</th>
                  <th className="border p-2 text-left">Points to note</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Natural</td>
                  <td className="border p-2">Abstinence</td>
                  <td className="border p-2">No sexual intercourse takes place</td>
                  <td className="border p-2">
                    Avoiding vaginal intercourse prevents pregnancy through intercourse; STI risks depend on other sexual contact.
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Natural</td>
                  <td className="border p-2">Rhythm (safe-period) method</td>
                  <td className="border p-2">
                    Avoiding intercourse around the fertile days near ovulation
                  </td>
                  <td className="border p-2">
                    Free, but unreliable because cycle length varies; no protection against STIs
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Barrier</td>
                  <td className="border p-2">Male condom / female condom</td>
                  <td className="border p-2">Physically stops sperm from entering the vagina or uterus</td>
                  <td className="border p-2">
                    The <strong>only</strong> methods that also reduce the spread of HIV and other STIs
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Barrier</td>
                  <td className="border p-2">Diaphragm or cap (used with spermicide)</td>
                  <td className="border p-2">Covers the cervix so sperm cannot enter the uterus</td>
                  <td className="border p-2">Must be fitted correctly by a health worker</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Hormonal</td>
                  <td className="border p-2">Contraceptive pill, injection, implant</td>
                  <td className="border p-2">
                    Hormones prevent the ovary from releasing an egg (they stop ovulation)
                  </td>
                  <td className="border p-2">
                    Very effective if used correctly, but no protection against STIs; may have side effects
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Intra-uterine</td>
                  <td className="border p-2">IUD (loop / coil)</td>
                  <td className="border p-2">
                    A copper IUD releases copper that impairs sperm and mainly prevents fertilisation; a hormonal intrauterine system thickens cervical mucus.
                  </td>
                  <td className="border p-2">Long lasting; must be fitted by a trained health worker</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Surgical</td>
                  <td className="border p-2">Vasectomy (male)</td>
                  <td className="border p-2">The sperm ducts are cut and tied, so semen contains no sperm</td>
                  <td className="border p-2">Permanent; does not change the ability to have intercourse</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Surgical</td>
                  <td className="border p-2">Tubal ligation (female)</td>
                  <td className="border p-2">The oviducts are cut and tied, so sperm cannot reach an egg</td>
                  <td className="border p-2">Permanent; menstruation continues normally</td>
                </tr>
                <tr><td className="border p-2 font-semibold">Chemical (spermicide)</td><td className="border p-2">Spermicidal gel or cream</td><td className="border p-2">Impairs sperm movement; commonly used with a diaphragm or cap.</td><td className="border p-2">Less reliable alone, may cause irritation and does not protect against STIs.</td></tr>
              </tbody>
            </table>
            <ExamTip>
              <p>
                A very common question asks why condoms are recommended even when a woman is already on the
                pill. The answer: the pill prevents pregnancy but gives{' '}
                <strong>no protection against HIV and other sexually transmitted infections</strong>, while
                a condom does both. This is called dual protection.
              </p>
            </ExamTip>
          </Card>
        </div>

      </div>
    ),
  },

  /* =======================================================================
     6. HEALTH AND DISEASES
  ======================================================================= */
  {
    id: 'health-diseases',
    title: 'Health and Diseases',
    content: (
      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-slate-700">Health includes physical, mental and social wellbeing. This topic covers hygiene, disease transmission, common infections, harmful substances and immunity.</p>

        <Card title="A Healthy Person">
          <p>A healthy person is <strong>physically, mentally and socially well</strong>, not simply free from a diagnosed disease.</p>
          <SyllabusTable headers={['Aspect', 'What it means']} rows={[
            ['Physical wellbeing', 'The body functions well and the person can carry out normal activities.'],
            ['Mental wellbeing', 'The person can think, manage emotions and cope with everyday challenges.'],
            ['Social wellbeing', 'The person can form supportive relationships and participate in their community.'],
          ]} />
          <p><strong>Activity:</strong> discuss examples of the three aspects and how they affect one another.</p>
        </Card>

        <Card title="Personal and Food Hygiene">
          <p><strong>Personal hygiene</strong> reduces the spread of pathogens: wash hands after using the toilet and before preparing or eating food, keep the body and clothes clean, and use clean toilet facilities.</p>
          <p><strong>Food hygiene</strong> includes safe water, clean preparation surfaces, thorough cooking, covered food, and separating raw food from ready-to-eat food. These measures prevent contamination and reduce food-borne illness.</p>
          <p><strong>Activities:</strong> clean classrooms with brooms and mops, discuss toilet cleaning, and observe teacher-supervised cleaning and disinfection of drains. Remove dirt before applying an appropriate disinfectant according to its label; never mix cleaning chemicals. Use ICT, print media or an EMA resource person to discuss hygiene.</p>
        </Card>

        <Card title="Waste Disposal: Advantages and Disadvantages">
          <SyllabusTable headers={['Method', 'Advantages', 'Disadvantages']} rows={[
            ['Burying', 'Can contain appropriate waste in a designated disposal site and reduce exposed litter.', 'Uses land; poorly chosen sites can contaminate soil or water. Hazardous waste needs specialist disposal.'],
            ['Recycling', 'Conserves materials and reduces waste sent for disposal.', 'Needs sorting, collection and suitable recycling facilities; not every material can be recycled.'],
            ['Burning', 'Reduces the volume of combustible waste.', 'Open burning produces smoke and can release toxic substances, particularly from plastics; it creates fire risks. Controlled facilities require resources.'],
          ]} />
          <p><strong>Activity:</strong> collect ordinary litter with gloves or tools, sort recyclable material, and discuss or demonstrate burial only for suitable waste at an approved site. Do not handle sharps, medical waste or unknown chemicals, or burn plastics.</p>
        </Card>

        <Card title="Disease Causes and Transmission">
          <Figure compact maxHeight="min(300px, 42svh)" src={f4Image('bio-disease-transmission.webp')}
            alt="Four illustrated disease transmission routes: contaminated water, food, mosquito vectors and infected body-fluid contact" caption="Examples of transmission routes. Preventing exposure helps break the chain of infection." />
          <p className="text-center"><a href={f4Image('bio-disease-transmission.webp')} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">View full-size diagram</a></p>
          <p>Infectious diseases are caused by <strong>pathogens</strong>, including bacteria, viruses, protozoa and parasitic worms. Contaminated food, water or air can carry pathogens; they are routes of exposure rather than the organisms that cause the disease.</p>
          <SyllabusTable headers={['Route', 'Example', 'How transmission occurs']} rows={[
            ['Water', 'Cholera', 'Swallowing water contaminated by faeces containing cholera bacteria.'],
            ['Food', 'Typhoid or cholera', 'Eating food contaminated by pathogens, often through unsafe water or poor hand hygiene.'],
            ['Contact', 'Ebola', 'Direct contact with infected blood or body fluids, or items contaminated by them.'],
            ['Vector', 'Malaria', 'An infected female Anopheles mosquito introduces parasites during a bite.'],
            ['Snail-associated freshwater transmission', 'Bilharzia', 'Freshwater snails are intermediate hosts; larvae released into water penetrate human skin.'],
            ['Air', 'Some respiratory infections', 'Inhaling infectious droplets or particles released by an infected person.'],
          ]} />
          <p><strong>Activity:</strong> discuss the transmission routes and identify where hygiene, safe water or vector control can break the chain. Although grouped with vector-associated diseases in the syllabus, bilharzia is not transmitted by a snail bite.</p>
        </Card>

        <Card title="Bilharzia (Schistosomiasis)">
          <Figure compact maxHeight="min(300px, 42svh)" src={f4Image('bio-bilharzia-life-cycle.webp')}
            alt="Drawing of the human–snail bilharzia cycle, with eggs reaching water and snail-released larvae penetrating human skin" caption="Bilharzia larvae enter through skin contact with infected freshwater; snails are intermediate hosts." />
          <p className="text-center"><a href={f4Image('bio-bilharzia-life-cycle.webp')} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">View full-size diagram</a></p>
          <p>Bilharzia is caused by <strong>Schistosoma</strong> parasitic worms. Humans and suitable freshwater snails are hosts.</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Infected people pass eggs in urine or faeces into freshwater.</li>
            <li>Eggs hatch; larvae enter suitable freshwater snails and multiply.</li>
            <li>Snails release another larval stage into the water.</li>
            <li>These larvae penetrate the skin of a person in contact with infected water.</li>
            <li>The parasites mature in human blood vessels and produce eggs, continuing the cycle.</li>
          </ol>
          <SyllabusTable headers={['Aspect', 'Key points']} rows={[
            ['Signs and symptoms', 'Blood in urine or stools, abdominal discomfort, fever and fatigue; symptoms depend on the species and stage.'],
            ['Treatment', 'Health workers use anti-parasitic medicine, commonly praziquantel.'],
            ['Prevention', 'Avoid swimming or playing in potentially infected freshwater; use safe water and sanitation, prevent urine/faeces entering water, and support treatment and snail-control programmes.'],
          ]} />
          <p><strong>Activity:</strong> use a life-cycle chart or multimedia to trace the human–snail cycle, identify symptoms and discuss prevention. Infection is not limited to visibly stagnant water.</p>
        </Card>

        <Card title="Sexually Transmitted Infections (STIs)">
          <p>STIs can be transmitted through sexual contact. Some infections have no obvious symptoms, so appearance alone cannot establish whether someone is infected.</p>
          <SyllabusTable headers={['Infection and cause', 'Signs, symptoms and effects', 'Treatment']} rows={[
            ['Gonorrhoea — Neisseria gonorrhoeae (bacterium)', 'May cause discharge and painful urination, or no symptoms. Untreated infection can damage reproductive organs and affect fertility.', 'Clinician-prescribed antibiotics; partners also need assessment and appropriate treatment.'],
            ['Syphilis — Treponema pallidum (bacterium)', 'An early sore is often painless; later rash and other symptoms may occur. Untreated disease can damage major organs.', 'Antibiotics, usually an appropriate penicillin preparation, prescribed according to the stage.'],
            ['Chancroid — Haemophilus ducreyi (bacterium)', 'Painful genital ulcers and tender swollen groin lymph nodes.', 'Appropriate clinician-prescribed antibiotics and partner assessment.'],
            ['Genital herpes — herpes simplex virus (HSV)', 'Painful blisters or sores may recur; some infections are unrecognised. The virus remains in the body.', 'Antiviral medicines reduce symptoms and outbreaks but do not eliminate the virus.'],
          ]} />
          <p><strong>Control:</strong> abstaining from sexual contact prevents sexual transmission. Correct condom use reduces risk but cannot fully protect against infections spread from uncovered skin. Testing, prompt treatment and confidential contact tracing help prevent onward spread and reinfection.</p>
          <p><strong>Activity:</strong> discuss causes, signs and effects using educational videos or bio-viewers. Symptoms overlap; diagnosis and treatment should be provided by a health worker, not guessed from a symptom list.</p>
        </Card>

        <Card title="Malaria, Typhoid, Ebola and Cholera">
          <SyllabusTable headers={['Disease and cause', 'Signs and symptoms', 'Treatment', 'Control']} rows={[
            ['Malaria — Plasmodium parasites', 'Fever, chills, headache and fatigue; severe disease can cause serious complications.', 'Prompt testing and antimalarial medicines selected by health workers; severe disease needs urgent hospital care.', 'Insecticide-treated nets, indoor residual spraying and mosquito-breeding control.'],
            ['Typhoid — Salmonella Typhi bacteria', 'Prolonged fever, headache, weakness and abdominal symptoms; diarrhoea or constipation may occur.', 'Appropriate antibiotics and fluids; drug choice depends on resistance and clinical assessment.', 'Safe water, sanitation, food hygiene and vaccination where recommended.'],
            ['Ebola — ebolaviruses', 'Fever, marked weakness and muscle pain; vomiting and diarrhoea may follow. Bleeding can occur but is not universal.', 'Specialist care, fluids and supportive treatment; specific treatments depend on the virus species and availability.', 'Avoid infected body fluids; professional infection control, contact tracing and safe burial practices.'],
            ['Cholera — Vibrio cholerae bacteria', 'Sudden watery diarrhoea, sometimes vomiting, with potentially rapid severe dehydration.', 'Rapid rehydration with oral rehydration solution; severe cases need intravenous fluids and sometimes antibiotics.', 'Safe water, sanitation, food hygiene and vaccination where indicated.'],
          ]} />
          <p><strong>Activity:</strong> compare symptom patterns, causes and control methods using print media. These are learning summaries, not diagnostic rules; suspected serious infection requires prompt medical assessment.</p>
        </Card>

        <Card title="The Malaria Parasite Life Cycle">
          <Figure compact maxHeight="min(300px, 42svh)" src={f4Image('bio-malaria-parasite-life-cycle.webp')}
            alt="Drawing of malaria parasite development in the liver, red blood cells and Anopheles mosquitoes" caption="The parasite develops in both humans and mosquitoes; this differs from the mosquito’s own developmental cycle." />
          <p className="text-center"><a href={f4Image('bio-malaria-parasite-life-cycle.webp')} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">View full-size diagram</a></p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>An infected female <strong>Anopheles</strong> mosquito injects parasites during a bite.</li>
            <li>The parasites reach the liver and multiply, then enter the bloodstream.</li>
            <li>They infect red blood cells, multiply and rupture the cells; some develop into sexual stages.</li>
            <li>Another mosquito takes up these sexual stages while feeding on infected blood.</li>
            <li>Sexual reproduction and further development occur in the mosquito; parasites reach its salivary glands and can infect the next person it bites.</li>
          </ol>
          <SyllabusTable headers={['Mosquito stage', 'Control method']} rows={[
            ['Eggs, larvae and pupae in water', 'Remove suitable breeding water where feasible; authorised programmes may use appropriate larval control.'],
            ['Adults', 'Use insecticide-treated nets, screened openings and approved indoor residual spraying.'],
          ]} />
          <p><strong>Activity:</strong> distinguish the parasite’s human–mosquito cycle from the mosquito’s own egg → larva → pupa → adult development. Discuss control at each mosquito stage.</p>
        </Card>

        <Card title="Smoking, Alcohol and Drugs">
          <Figure compact maxHeight="min(300px, 42svh)" src={f4Image('bio-emphysema-alveoli.webp')}
            alt="Drawing comparing intact alveolar walls with damaged, merged air spaces in emphysema" caption="Emphysema destroys alveolar walls and reduces the surface area available for gas exchange." />
          <p className="text-center"><a href={f4Image('bio-emphysema-alveoli.webp')} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">View full-size diagram</a></p>
          <SyllabusTable headers={['Substance', 'Effects on health and life']} rows={[
            ['Tobacco smoking', 'Emphysema damages alveolar walls; chronic bronchitis affects airways; carcinogens increase lung-cancer risk. Smoking during pregnancy can cause poor fetal growth and low birth weight.'],
            ['Excessive alcohol', 'Can cause liver cirrhosis; slows reaction time and impairs judgement, increasing accident risk. Dependence can contribute to problems in relationships, school, work and finances.'],
            ['Mandrax (methaqualone)', 'A sedative drug that can cause dependence, impaired coordination and dangerous depression of breathing; misuse can alter perception.'],
            ['Cannabis', 'Can impair memory, judgement and coordination and lead to dependence. Some users experience altered perception, hallucinations or paranoia.'],
            ['Breathing solvents', 'Can cause addiction, muscle weakness or injury, damage to the heart and nervous system, dangerous heart rhythms and sudden death.'],
          ]} />
          <p><strong>Activity:</strong> discuss the physical and social effects using reliable multimedia. Hallucinations are perceptions without a matching external stimulus; addiction involves compulsive use despite harm.</p>
        </Card>

        <Card title="Immunity: Active, Passive, Natural and Artificial">
          <Figure compact maxHeight="min(300px, 42svh)" src={f4Image('bio-types-of-immunity.webp')}
            alt="Two-by-two drawing comparing active and passive immunity acquired naturally or artificially" caption="Active immunity involves the body’s own response; passive immunity supplies ready-made antibodies." />
          <p className="text-center"><a href={f4Image('bio-types-of-immunity.webp')} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">View full-size diagram</a></p>
          <Definition term="Immunity">the ability to resist a particular infection through the body’s defence mechanisms.</Definition>
          <SyllabusTable headers={['Type', 'How it develops', 'Example']} rows={[
            ['Natural active', 'The person’s immune system responds to an infection and may form memory cells.', 'Immunity following some infections.'],
            ['Artificial active', 'Vaccination stimulates the person’s immune system without requiring the full disease.', 'Routine immunisation.'],
            ['Natural passive', 'Ready-made maternal antibodies are transferred to the infant.', 'Antibodies across the placenta and antibodies in breast milk.'],
            ['Artificial passive', 'Ready-made antibodies are supplied through a medical preparation.', 'Immunoglobulin treatment when indicated.'],
          ]} />
          <p>Active immunity can be long-lasting because the body develops its own response and memory. Passive immunity acts quickly but is temporary and does not give the recipient the same immune memory.</p>
          <p><strong>Infants:</strong> maternal antibodies and breastfeeding provide passive protection while the infant’s immune system develops. Breast milk, especially colostrum, contains antibodies that help protect mucosal surfaces. Vaccination builds active protection; follow the current national immunisation schedule and the child’s clinic record. Breastfeeding does not replace immunisation.</p>
          <p><strong>Activities:</strong> classify examples of immunity and discuss infant protection with a health resource person. Use the current clinic schedule rather than assuming one fixed timetable applies everywhere.</p>
        </Card>

        <Card title="HIV and AIDS">
          <Figure compact maxHeight="min(300px, 42svh)" src={f4Image('bio-hiv-immune-system.webp')}
            alt="Three-panel drawing showing HIV infecting and damaging CD4 immune cells and weakening defence against infection" caption="HIV damages the immune system; treatment can protect immune function." />
          <p className="text-center"><a href={f4Image('bio-hiv-immune-system.webp')} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-700 underline underline-offset-4">View full-size diagram</a></p>
          <p><strong>HIV</strong> is the human immunodeficiency virus. It damages CD4 immune cells, reducing the body’s ability to resist infections. <strong>AIDS</strong> is an advanced stage of HIV infection with severe immune damage; HIV and AIDS are not identical terms.</p>
          <SyllabusTable headers={['Topic', 'Key points']} rows={[
            ['Transmission', 'Sexual exposure to infected fluids, sharing contaminated needles, unsafe blood exposure, and mother-to-child transmission during pregnancy, birth or breastfeeding.'],
            ['Effects', 'Loss of immune function increases vulnerability to opportunistic infections and some cancers.'],
            ['Control', 'Prevent sexual exposure, use condoms correctly, avoid sharing needles, ensure screened blood and sterile equipment, and support HIV testing and antiretroviral treatment.'],
          ]} />
          <p>HIV is not spread by ordinary social contact, sharing classrooms or mosquito bites. Treatment protects health and greatly reduces transmission; effective treatment during pregnancy and breastfeeding reduces mother-to-child transmission.</p>
          <p><strong>Activity:</strong> discuss transmission and prevention with a health resource person, correcting myths and avoiding stigma.</p>
        </Card>
      </div>
    ),
  },

  /* =======================================================================
     7. REVISION SUMMARY
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
              Do not just re-read. Cover the page and try to write out the carbon cycle, the nitrogen
              cycle and the four food tests from memory, then check what you missed.
            </li>
            <li>
              Learn the three respiration equations word-perfect. They are quick marks and they come up
              nearly every year.
            </li>
            <li>
              For every experiment be able to say the <strong>aim</strong>, the <strong>control</strong>,
              one <strong>controlled variable</strong> and the <strong>conclusion</strong> in one sentence
              each.
            </li>
            <li>
              Practise drawing and labelling the heart, the blood vessels and the male and female
              reproductive systems — labelling questions are guaranteed marks if you have practised.
            </li>
            <li>
              Read command words carefully. &ldquo;State&rdquo; wants one short fact;
              &ldquo;describe&rdquo; wants what happens; &ldquo;explain&rdquo; wants the reason{' '}
              <em>why</em>.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-slate-800">Common Mistakes to Avoid</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
            <li>
              Drawing food chain arrows the wrong way. The arrow means &ldquo;is eaten by&rdquo; and
              points the way the energy travels.
            </li>
            <li>
              Saying that energy is recycled. <strong>Energy flows one way and is lost as heat; only
              matter (carbon, nitrogen) is recycled.</strong>
            </li>
            <li>
              Confusing <strong>respiration</strong> (a chemical reaction in every cell) with{' '}
              <strong>breathing</strong> (moving air in and out of the lungs).
            </li>
            <li>
              Writing that plants only respire at night. Plants respire{' '}
              <strong>all the time</strong>; they only photosynthesise in the light.
            </li>
            <li>
              Mixing up kwashiorkor (swollen, protein missing) with marasmus (wasted, everything missing).
            </li>
            <li>
              Saying arteries always carry oxygenated blood — the pulmonary artery does not.
            </li>
            <li>
              Confusing <strong>active</strong> immunity (your body makes the antibodies) with{' '}
              <strong>passive</strong> immunity (you are given ready-made antibodies).
            </li>
            <li>
              Saying HIV is cured by ARVs. ARVs <strong>control</strong> the virus; there is no cure.
            </li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h4 className="text-lg font-bold text-slate-700">Ecology</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Ecosystem = biotic + abiotic</li>
              <li>Food chains, food webs, trophic levels</li>
              <li>Pyramids of numbers and biomass</li>
              <li>Carbon and nitrogen cycles</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Exam tip: only about 10% of energy passes to the next trophic level — the rest is lost as
              heat, in respiration and in waste.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <h4 className="text-lg font-bold text-slate-700">Nutrition</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Seven nutrient classes</li>
              <li>Deficiency diseases</li>
              <li>Four food tests</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Must memorise: starch = blue-black · reducing sugar = brick red (heat) · protein = purple ·
              fat = cloudy emulsion.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🫁</span>
              <h4 className="text-lg font-bold text-slate-700">Respiration</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Aerobic vs anaerobic</li>
              <li>Mitochondria, ATP, lactic acid</li>
              <li>Limewater and thermos-flask experiments</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Every respiration experiment needs a control of dead (boiled) seeds.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <h4 className="text-lg font-bold text-slate-700">Transport</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>Transpiration and its factors</li>
              <li>Blood: plasma, RBC, WBC, platelets</li>
              <li>Arteries, veins, capillaries; the heart</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Quick check: &ldquo;away from heart&rdquo; = artery, &ldquo;towards heart&rdquo; = vein —
              not oxygen content.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h4 className="text-lg font-bold text-slate-700">Reproduction</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>
                Vegetative: rhizome, stem tuber, root tuber, bulb, corm, runner, sucker — all produce
                clones
              </li>
              <li>Artificial: cuttings, layering, grafting, budding, tissue culture</li>
              <li>Male: testes, sperm ducts, prostate, urethra, penis</li>
              <li>Female: ovaries, oviducts, uterus, cervix, vagina — fertilisation in the oviduct</li>
              <li>Contraception: natural, barrier, hormonal, intra-uterine, surgical</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Only condoms give dual protection: against pregnancy <em>and</em> against STIs including HIV.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">💊</span>
              <h4 className="text-lg font-bold text-slate-700">Health &amp; Diseases</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
              <li>First and second lines of defence</li>
              <li>Phagocytosis and antibody production</li>
              <li>Four types of immunity, and how vaccines work</li>
              <li>HIV/AIDS: transmission, prevention, ARVs, stigma</li>
              <li>Breastfeeding gives natural passive immunity</li>
            </ul>
            <p className="mt-2 text-sm font-semibold text-slate-700">
              Key distinction: bacteria are killed by antibiotics; viruses (including HIV) are not.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-slate-300 bg-slate-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <h4 className="text-lg font-bold text-slate-800">Final Checklist Before the Exam</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-base text-slate-700">
            <li>I can define ecosystem, habitat, population, community and biodiversity.</li>
            <li>I can draw and explain the carbon cycle and the nitrogen cycle.</li>
            <li>I can name the seven nutrients, their jobs and one deficiency disease each.</li>
            <li>I can describe all four food tests, including which one needs heating.</li>
            <li>I can write the aerobic and both anaerobic equations without looking.</li>
            <li>I can describe two experiments proving that respiration releases CO₂ and heat.</li>
            <li>I can label the heart and state the job of each chamber and valve.</li>
            <li>I can compare artery, vein and capillary in a table.</li>
            <li>I can list natural and artificial vegetative propagation methods with examples.</li>
            <li>I can explain how a vaccine produces immunity, and distinguish HIV from AIDS.</li>
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
    <div className="mb-6">
      <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">{section.id === 'reproduction' ? 'Reproduction in Plants' : section.title}</h2>
    </div>
    <div className="prose prose-slate max-w-none">{section.content}</div>
  </section>
);

interface LearningOutcome1Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome1: React.FC<LearningOutcome1Props> = ({
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
      <div className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
            BIOLOGY
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Biology: Ecology, Nutrition, Respiration, Transport, Reproduction &amp; Health
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Full Form 4 notes in plain English — every term defined, every process explained step by step,
            with worked examples, labelled diagrams and complete practical write-ups.
          </p>
        </div>
      </div>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-4 sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-base">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ecology:</strong> ecosystems have biotic and abiotic
                  components; energy flows one way and about 90% is lost at each trophic level, while
                  carbon and nitrogen are recycled by bacteria and fungi.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Nutrition:</strong> a balanced diet needs all seven
                  nutrient classes; missing one causes a specific deficiency disease, and four simple
                  colour tests identify starch, sugar, protein and fat.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Respiration:</strong> aerobic respiration in mitochondria
                  releases far more energy than anaerobic respiration; anaerobic respiration gives ethanol
                  in yeast and lactic acid in muscle, causing an oxygen debt.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Transport:</strong> transpiration pulls water up the
                  xylem, while blood carries oxygen, food and waste through arteries, capillaries and
                  veins driven by a four-chambered heart.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Reproduction:</strong> vegetative propagation makes
                  clones quickly but with no variation; the human systems produce gametes that fuse in the
                  oviduct, and contraception works by blocking one step in that pathway.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Health:</strong> immunity may be active or passive,
                  natural or artificial; vaccines create memory cells, while HIV destroys the very white
                  blood cells the immune system depends on.
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

export default LearningOutcome1;
