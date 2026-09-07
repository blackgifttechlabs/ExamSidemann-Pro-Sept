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

// Pyramid of biomass
const pyramidBiomassSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <rect width="300" height="300" fill="white" />
  <text x="150" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Pyramid of Biomass</text>
  <rect x="110" y="50" width="80" height="30" rx="4" fill="#ef4444" />
  <text x="150" y="70" text-anchor="middle" font-size="10" fill="white">Tertiary</text>
  <rect x="80" y="100" width="140" height="30" rx="4" fill="#f59e0b" />
  <text x="150" y="120" text-anchor="middle" font-size="10" fill="white">Secondary</text>
  <rect x="50" y="150" width="200" height="30" rx="4" fill="#eab308" />
  <text x="150" y="170" text-anchor="middle" font-size="10" fill="white">Primary</text>
  <rect x="20" y="200" width="260" height="30" rx="4" fill="#22c55e" />
  <text x="150" y="220" text-anchor="middle" font-size="10" fill="white">Producers</text>
  <text x="150" y="260" text-anchor="middle" font-size="11" fill="#475569">Biomass decreases up the pyramid</text>
</svg>
`;

// Aerobic respiration word equation
const aerobicEquationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 170" width="100%" height="100%">
  <rect width="900" height="170" fill="white" />
  <text x="450" y="24" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Aerobic Respiration</text>
  <rect x="15" y="55" width="140" height="65" rx="10" fill="#fef3c7" stroke="#eab308" stroke-width="2" />
  <text x="85" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#854d0e">Glucose</text>
  <text x="85" y="100" text-anchor="middle" font-size="14" font-weight="bold" fill="#854d0e">C&#8326;H&#8321;&#8322;O&#8326;</text>
  <text x="172" y="96" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">+</text>
  <rect x="190" y="55" width="130" height="65" rx="10" fill="#dcfce7" stroke="#22c55e" stroke-width="2" />
  <text x="255" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#166534">Oxygen</text>
  <text x="255" y="100" text-anchor="middle" font-size="16" font-weight="bold" fill="#166534">6O&#8322;</text>
  <line x1="330" y1="87" x2="450" y2="87" stroke="#0ea5e9" stroke-width="3" marker-end="url(#arrowAer)" />
  <text x="390" y="72" text-anchor="middle" font-size="11" font-weight="bold" fill="#0369a1">in mitochondria</text>
  <defs>
    <marker id="arrowAer" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#0ea5e9" />
    </marker>
  </defs>
  <rect x="465" y="55" width="150" height="65" rx="10" fill="#f1f5f9" stroke="#64748b" stroke-width="2" />
  <text x="540" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#334155">Carbon dioxide</text>
  <text x="540" y="100" text-anchor="middle" font-size="15" font-weight="bold" fill="#0f172a">6CO&#8322;</text>
  <text x="632" y="96" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">+</text>
  <rect x="650" y="55" width="110" height="65" rx="10" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <text x="705" y="78" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">Water</text>
  <text x="705" y="100" text-anchor="middle" font-size="15" font-weight="bold" fill="#1e3a8a">6H&#8322;O</text>
  <text x="777" y="96" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">+</text>
  <rect x="795" y="55" width="95" height="65" rx="10" fill="#ffe4e6" stroke="#f43f5e" stroke-width="2" />
  <text x="842" y="82" text-anchor="middle" font-size="12" font-weight="bold" fill="#9f1239">ENERGY</text>
  <text x="842" y="102" text-anchor="middle" font-size="11" fill="#9f1239">(38 ATP)</text>
  <text x="450" y="150" text-anchor="middle" font-size="12" fill="#475569">Glucose + Oxygen &#8594; Carbon dioxide + Water + Energy</text>
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
  foodChain: svgToDataUri(foodChainSvg),
  pyramidBiomass: svgToDataUri(pyramidBiomassSvg),
  aerobicEquation: svgToDataUri(aerobicEquationSvg),
  bloodCells: svgToDataUri(bloodCellsSvg),

  /* ----- Re-used Form 3 artwork ----- */
  transpirationOverview: csImage('transpirationinplants.png'),
  potometer: csImage('Potometer Apparatus.png'),
  arteryCrossSection: csImage('Artery Cross-Section.png'),
  veinCrossSection: csImage('Vein Cross-Section.png'),
  capillaryCrossSection: csImage('Capillary Cross-Section.png'),
  maleReproductiveSystem: csImage('malereproductivesystem.png'),
  femaleReproductiveSystem: csImage('femalereproductivesystem.png'),
  menstrualCycle: csImage('menstrualcyclechart.png'),
  fertilisationToImplantation: csImage('fertilisationimplantation.png'),

  /* ----- New Form 4 artwork (save with these exact names) ----- */
  ecosystemComponents: f4Image('bio-ecosystem-components.png'),
  foodWeb: f4Image('bio-food-web.png'),
  energyFlow: f4Image('bio-trophic-levels-energy-flow.png'),
  pyramidOfNumbers: f4Image('bio-pyramid-of-numbers.png'),
  carbonCycle: f4Image('bio-carbon-cycle.png'),
  nitrogenCycle: f4Image('bio-nitrogen-cycle.png'),
  decomposition: f4Image('bio-decomposition.png'),
  quadratStep1: f4Image('bio-quadrat-step1.png'),
  quadratStep2: f4Image('bio-quadrat-step2.png'),
  quadratStep3: f4Image('bio-quadrat-step3.png'),
  quadratStep4: f4Image('bio-quadrat-step4.png'),
  naturalVsArtificial: f4Image('bio-natural-vs-artificial-ecosystem.png'),
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
  bloodVesselsComparison: f4Image('bio-blood-vessels-comparison.png'),
  heartStructure: f4Image('bio-heart-structure.png'),
  doubleCirculation: f4Image('bio-double-circulation.png'),
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
  title = 'Example',
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
     1. ECOLOGY
  ======================================================================= */
  {
    id: 'ecology',
    title: 'Ecology',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
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
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
              src={bioImages.ecosystemComponents}
              alt="Labelled ecosystem showing abiotic and biotic components"
              caption="Fig 1.1 — One pond-and-grassland ecosystem, with the abiotic (non-living) components labelled in blue and the biotic (living) components labelled in green."
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
              src={bioImages.decomposition}
              alt="Decomposers breaking down a fallen log and animal dung"
              caption="Fig 1.2 — Decomposers (fungi and bacteria) break dead material down and return nitrates, phosphates and carbon dioxide to the ecosystem."
            />
          </Card>

          <Card title="Food Chains">
            <Definition term="Food chain">
              a diagram that shows how energy and food pass from one organism to the next, starting
              with a producer. The arrow always means <strong>&ldquo;is eaten by&rdquo;</strong> and
              always points in the direction the energy travels.
            </Definition>
            <Figure src={bioImages.foodChain} alt="Simple grassland food chain" />
            <p>
              Reading the chain above: the grass is eaten by the locust, the locust is eaten by the
              lizard, and the lizard is eaten by the bird. Notice that the chain begins with a plant.
              Every food chain on Earth begins with a producer, because producers are the only
              organisms that can capture the Sun&rsquo;s energy and turn it into food.
            </p>
            <p>Each feeding position in the chain has a name — its trophic level:</p>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
              src={bioImages.foodWeb}
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
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Figure
                  src={bioImages.pyramidOfNumbers}
                  alt="Pyramid of numbers including an inverted example"
                  caption="Fig 1.5 — Pyramid of numbers: each bar shows how many individual organisms there are."
                />
              </div>
              <div>
                <Figure
                  src={bioImages.pyramidBiomass}
                  alt="Pyramid of biomass"
                  caption="Fig 1.6 — Pyramid of biomass: each bar shows the total dry mass of living material."
                />
              </div>
            </div>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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

          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-emerald-700">
              Experiment 1: Estimating a Plant Population Using Quadrats
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To estimate the number of a particular plant (for example
              blackjack) growing in a large field, without having to count every single one.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> A 1 m &times; 1 m quadrat frame, two long tape measures,
              a random number table or calculator, pegs, a notebook and pen.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={bioImages.quadratStep1} alt="Measuring the area of the study field">
                Measure the length and width of the field with the tape measures and work out its total
                area in square metres.
              </Step>
              <Step n={2} src={bioImages.quadratStep2} alt="Choosing random coordinates for quadrat placement">
                Lay the two tapes along two edges of the field to make a grid, then use random numbers
                to pick coordinates. This makes the sampling <strong>random</strong> so that you do not
                unfairly choose the greenest patches.
              </Step>
              <Step n={3} src={bioImages.quadratStep3} alt="Placing the quadrat and counting plants inside it">
                Place the quadrat at each set of coordinates and count every plant of the chosen species
                inside it. Record each count in a table.
              </Step>
              <Step n={4} src={bioImages.quadratStep4} alt="Calculating the mean and estimating the total population">
                Repeat for at least ten quadrats, find the mean number per square metre, then multiply
                by the total area of the field.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Specimen results:</strong> Counts of 4, 6, 3, 5, 7, 5, 4, 6, 8 and 2 plants give a
              total of 50 plants in 10 m&sup2;, so the mean is 5 plants per m&sup2;.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Calculation:</strong> If the field measures 40 m &times; 25 m, its area is
              1 000 m&sup2;. Estimated population = 5 &times; 1 000 ={' '}
              <strong>5 000 plants</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Random quadrat sampling gives a reliable estimate of
              population size. Using more quadrats makes the estimate more accurate, because it reduces
              the effect of any one unusual patch of ground.
            </p>
          </div>

          <Card title="The Carbon Cycle">
            <p>
              Unlike energy, <strong>matter is recycled</strong>. There is a fixed amount of carbon on
              Earth and it moves round and round between the air, living things and the soil. The
              carbon cycle explains how.
            </p>
            <Figure
              src={bioImages.carbonCycle}
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
              src={bioImages.nitrogenCycle}
              alt="Labelled nitrogen cycle diagram"
              caption="Fig 1.8 — The nitrogen cycle. Four groups of bacteria do most of the work, so learn their names and what each one does."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
              src={bioImages.naturalVsArtificial}
              alt="Side by side comparison of a natural woodland and an artificial maize field"
              caption="Fig 1.9 — A natural woodland (left) has many species mixed together; an artificial maize field (right) has one species in rows and needs constant human input."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Ecology Key Points"
            items={[
              'Habitat → population → community → ecosystem → biosphere',
              'Ecosystem = biotic (living) + abiotic (non-living)',
              'Producers → consumers → decomposers',
              'Arrow in a food chain = "is eaten by"',
              'Only ~10% of energy passes to the next level',
              'Energy flows one way; matter is recycled',
              'Photosynthesis removes CO₂; respiration, decay and burning return it',
              'Nitrogen-fixing → nitrifying → denitrifying bacteria',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Must-know definitions</h3>
            <p className="text-sm text-slate-700">
              Ecology, ecosystem, habitat, population, community, producer, consumer, decomposer, food
              chain, food web, trophic level, biomass, biodiversity, eutrophication.
            </p>
          </div>
        </aside>
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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
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

          <Definition term="Balanced diet">
            a diet that contains all seven classes of nutrients — carbohydrates, proteins, fats,
            vitamins, mineral salts, water and roughage — in the correct amounts and correct proportions
            for that particular person, so that the body stays healthy.
          </Definition>

          <Card title="The Seven Components of a Balanced Diet">
            <Figure
              src={bioImages.balancedDietPlate}
              alt="A balanced Zimbabwean meal on a plate with nutrient groups labelled"
              caption="Fig 2.1 — A balanced Zimbabwean plate: sadza (carbohydrate), beans or meat (protein), muriwo and fruit (vitamins, minerals, roughage), cooking oil (fat) and water."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <Figure
              src={bioImages.nutrientSources}
              alt="Grid of foods grouped by nutrient class"
              caption="Fig 2.2 — Everyday foods grouped by the nutrient each is richest in."
            />
          </Card>

          <Card title="Important Vitamins and Minerals">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <Figure
              src={bioImages.deficiencyDiseases}
              alt="Four deficiency diseases illustrated: kwashiorkor, marasmus, rickets and goitre"
              caption="Fig 2.3 — The signs of four common deficiency diseases. Learn one distinctive sign for each."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-blue-700">
              Experiment 2: Testing Food for the Main Nutrients
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To find out which nutrients are present in a sample of food.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Safety:</strong> Wear eye protection. Benedict&rsquo;s solution and sodium
              hydroxide are irritants — wash off any splashes at once. Heat test tubes in a water bath,
              never directly over a flame, and point the mouth of the tube away from everyone.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-blue-700">Test 1 — Starch (iodine test)</p>
                <p className="text-sm text-slate-700">
                  Place a little of the food on a white tile and add 2&ndash;3 drops of iodine solution.
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <strong>Positive result:</strong> the orange-brown iodine turns{' '}
                  <strong>blue-black</strong>. If no starch is present it stays orange-brown.
                </p>
                <Figure src={bioImages.foodTestStarch} alt="Iodine test for starch on a white tile" />
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-blue-700">
                  Test 2 — Reducing sugar (Benedict&rsquo;s test)
                </p>
                <p className="text-sm text-slate-700">
                  Put 2 cm&sup3; of the food solution in a test tube, add an equal volume of
                  Benedict&rsquo;s solution and heat in a boiling water bath for about 5 minutes.
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <strong>Positive result:</strong> the blue solution changes through green and yellow to{' '}
                  <strong>orange or brick red</strong>. The redder the colour, the more sugar is present.
                </p>
                <Figure
                  src={bioImages.foodTestBenedicts}
                  alt="Benedict's test tube heated in a water bath showing colour change"
                />
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-blue-700">Test 3 — Protein (Biuret test)</p>
                <p className="text-sm text-slate-700">
                  Put 2 cm&sup3; of the food solution in a test tube, add an equal volume of dilute
                  sodium hydroxide solution, then add a few drops of dilute copper(II) sulphate solution
                  and shake gently. No heating is needed.
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <strong>Positive result:</strong> the pale blue mixture turns{' '}
                  <strong>purple or violet</strong>.
                </p>
                <Figure src={bioImages.foodTestBiuret} alt="Biuret test showing purple colour for protein" />
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-blue-700">Test 4 — Fats (emulsion and grease-spot)</p>
                <p className="text-sm text-slate-700">
                  <em>Emulsion test:</em> shake the food with 2 cm&sup3; of ethanol, then pour the liquid
                  into a test tube of cold water.
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <strong>Positive result:</strong> a <strong>cloudy white emulsion</strong> forms.
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  <em>Grease-spot test:</em> rub the food on filter paper and hold it up to the light — a
                  permanent <strong>translucent spot</strong> means fat is present.
                </p>
                <Figure src={bioImages.foodTestFats} alt="Emulsion test and grease spot test for fats" />
              </div>
            </div>

            <Figure
              src={bioImages.foodTestsResults}
              alt="Summary chart of food test colours before and after"
              caption="Fig 2.5 — Summary of the four food tests, showing the colour before and after in each case."
            />

            <p className="mt-3 text-sm text-slate-700">
              <strong>Conclusion:</strong> Each nutrient produces its own characteristic colour change,
              so a series of simple tests can identify which nutrients a food contains. Always test a
              control (distilled water) alongside the food so that you can be sure the colour change was
              caused by the food and not by the reagent itself.
            </p>
            <ExamTip>
              <p>
                Memorise the four positive results as a single line:{' '}
                <strong>starch = blue-black, sugar = brick red (heat), protein = purple, fat = cloudy
                white emulsion</strong>. Also remember that Benedict&rsquo;s test is the only one that
                needs heating.
              </p>
            </ExamTip>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Nutrition Key Points"
            items={[
              'Balanced diet = 7 nutrients in the right proportions',
              'Carbohydrates and fats – energy',
              'Proteins – growth and repair',
              'Vitamins and minerals – small amounts, big jobs',
              'Water – transport, solvent, cooling',
              'Roughage – keeps food moving through the gut',
              'Kwashiorkor = swollen; marasmus = wasted',
              'Starch blue-black · sugar brick red · protein purple · fat emulsion',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Quick self-test</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
              <li>Why is sadza alone not a balanced meal?</li>
              <li>Which test needs heating, and what colour shows a positive result?</li>
              <li>Name the disease caused by lack of iodine and describe one sign.</li>
              <li>Give two reasons a pregnant woman needs a different diet.</li>
            </ol>
          </div>
        </aside>
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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
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

          <Card title="Aerobic Respiration">
            <Definition term="Aerobic respiration">
              the complete breakdown of glucose using oxygen, releasing a large amount of energy and
              producing carbon dioxide and water as waste. &ldquo;Aerobic&rdquo; means &ldquo;with
              air&rdquo;.
            </Definition>
            <Figure src={bioImages.aerobicEquation} alt="Aerobic respiration equation diagram" />
            <p>
              <strong>Word equation:</strong> Glucose + Oxygen &rarr; Carbon dioxide + Water + Energy
            </p>
            <p>
              <strong>Symbol equation:</strong> C₆H₁₂O₆ + 6O₂ &rarr; 6CO₂ + 6H₂O + energy (about 2 900 kJ
              per mole of glucose, stored as roughly <strong>38 ATP</strong> molecules)
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
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <p className="font-semibold text-slate-800">In yeast and other micro-organisms (fermentation):</p>
              <p className="mt-1">Glucose &rarr; Ethanol + Carbon dioxide + Energy</p>
              <p>C₆H₁₂O₆ &rarr; 2C₂H₅OH + 2CO₂ + energy (about 118 kJ, roughly 2 ATP)</p>
              <p className="mt-2 font-semibold text-slate-800">In human muscle cells:</p>
              <p className="mt-1">Glucose &rarr; Lactic acid + Energy</p>
              <p>C₆H₁₂O₆ &rarr; 2C₃H₆O₃ + energy</p>
            </div>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
                  <td className="border p-2">Large (about 38 ATP)</td>
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
              produces <strong>lactic acid</strong>. Lactic acid builds up and causes the burning feeling
              and the muscle fatigue and cramp you feel at the end of a sprint.
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

          <div className="rounded-xl border-2 border-violet-200 bg-violet-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-violet-700">
              Experiment 3: Showing that Respiring Organisms Give Out Carbon Dioxide
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To show that germinating seeds release carbon dioxide as they respire.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Two conical flasks, germinating bean seeds, an equal mass of
              seeds that have been boiled and cooled (the control), limewater, delivery tubes and bungs,
              a filter pump or aspirator, disinfectant, cotton wool.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={bioImages.respirationCo2Step1} alt="Preparing flasks of living and boiled seeds">
                Soak the seeds for 24 hours. Put living germinating seeds into flask A. Boil an equal mass
                of seeds to kill them, rinse them in disinfectant to stop micro-organisms growing, and put
                them into flask B — this is the <strong>control</strong>.
              </Step>
              <Step n={2} src={bioImages.respirationCo2Step2} alt="Connecting each flask to limewater in test tubes">
                Fit each flask with a bung and delivery tubes, and connect each one so that air is drawn
                first through soda lime (to remove carbon dioxide from the incoming air), then through the
                flask, and finally through a test tube of clear limewater.
              </Step>
              <Step n={3} src={bioImages.respirationCo2Step3} alt="Drawing air slowly through the apparatus">
                Draw air slowly through both sets of apparatus using the filter pump, and leave the
                experiment for about one hour.
              </Step>
              <Step n={4} src={bioImages.respirationCo2Step4} alt="Comparing the limewater in the two test tubes">
                Compare the limewater from flask A with the limewater from flask B.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Results:</strong> The limewater connected to flask A (living seeds) turns{' '}
              <strong>milky/cloudy white</strong>. The limewater connected to flask B (boiled seeds) stays{' '}
              <strong>clear</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Living, germinating seeds produce carbon dioxide, because
              limewater turns milky only in the presence of carbon dioxide. The dead seeds produce none,
              which proves that the gas came from respiration in living cells and not from the apparatus
              or the air.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Why the soda lime matters:</strong> ordinary air already contains a little carbon
              dioxide. Removing it first means that any carbon dioxide reaching the limewater must have
              come from the seeds — this makes the experiment a <strong>fair test</strong>.
            </p>
          </div>

          <div className="rounded-xl border-2 border-orange-200 bg-orange-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-orange-700">
              Experiment 4: Showing that Respiration Releases Heat
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To show that germinating seeds release heat energy as they respire.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Two vacuum (thermos) flasks, two thermometers, germinating
              seeds, an equal mass of boiled and disinfected seeds, cotton wool.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
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
            <p className="mt-3 text-sm text-slate-700">
              <strong>Results:</strong> The temperature in flask A (living seeds) <strong>rises</strong>,
              often by several degrees. The temperature in flask B (dead seeds) stays about the same.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Respiration in living cells releases heat energy. The dead
              seeds cannot respire, so no heat is produced. Both flasks are kept in the same place so that
              room temperature is a <strong>controlled variable</strong>.
            </p>
          </div>

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

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Respiration Key Points"
            items={[
              'Respiration releases energy from glucose in every cell',
              'Respiration ≠ breathing',
              'Aerobic: glucose + oxygen → CO₂ + water + lots of energy',
              'Aerobic happens in the mitochondria (38 ATP)',
              'Anaerobic in yeast: glucose → ethanol + CO₂',
              'Anaerobic in muscle: glucose → lactic acid',
              'Lactic acid causes fatigue and an oxygen debt',
              'Limewater turns milky = carbon dioxide present',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Learn these equations</h3>
            <p className="text-sm text-slate-700">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy</p>
            <p className="mt-1 text-sm text-slate-700">C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + energy</p>
            <p className="mt-1 text-sm text-slate-700">C₆H₁₂O₆ → 2C₃H₆O₃ + energy</p>
          </div>
        </aside>
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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
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
            <Figure
              src={bioImages.transpirationOverview}
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
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
              </tbody>
            </table>
          </Card>

          <Card title="How Plants Reduce Water Loss">
            <Figure
              src={bioImages.leafWaterSavingAdaptations}
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

          <div className="rounded-xl border-2 border-sky-200 bg-sky-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-sky-700">
              Experiment 5: Comparing Water Loss from the Two Leaf Surfaces
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To show that more water is lost from the lower surface of a leaf than
              from the upper surface.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> A leafy plant, dry blue cobalt chloride paper, two glass
              microscope slides, paper clips or sellotape, a stopwatch, forceps (the paper must be kept
              dry, so never touch it with wet fingers).
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={bioImages.cobaltChlorideStep1} alt="Drying cobalt chloride paper until it is blue">
                Dry the cobalt chloride paper gently until it is clearly <strong>blue</strong>. Blue means
                the paper is dry; it turns pink when it takes up water.
              </Step>
              <Step n={2} src={bioImages.cobaltChlorideStep2} alt="Attaching cobalt chloride paper to both surfaces of a leaf">
                Using forceps, attach one piece of blue paper to the <strong>upper</strong> surface of a
                leaf and another to the <strong>lower</strong> surface of the same leaf. Cover each with a
                glass slide and hold them in place with paper clips, so that water can only come from the
                leaf and not from the surrounding air.
              </Step>
              <Step n={3} src={bioImages.cobaltChlorideStep3} alt="Comparing how quickly each paper turns pink">
                Start the stopwatch and record how long each piece of paper takes to turn completely pink.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Results:</strong> The paper on the <strong>lower</strong> surface turns pink much
              faster than the paper on the upper surface.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> More water is lost from the lower surface, because the lower
              epidermis contains far more stomata than the upper epidermis. The upper surface is also
              covered by a waxy cuticle.
            </p>
          </div>

          <Card title="Measuring the Rate of Transpiration — the Potometer">
            <p>
              A <strong>potometer</strong> measures how quickly a leafy shoot takes up water, and since
              almost all of the water taken up is lost by transpiration, this gives a good estimate of the
              transpiration rate.
            </p>
            <Figure
              src={bioImages.potometer}
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

          <Card title="Blood — What It Is Made Of">
            <p>
              Blood is a tissue. An adult has about 5 litres of it, and it is made of a straw-coloured
              liquid with three kinds of cell floating in it.
            </p>
            <Figure
              src={bioImages.bloodComposition}
              alt="Test tube of separated blood showing plasma, buffy coat and red cells"
              caption="Fig 4.4 — Blood separated by spinning: plasma on top (about 55%), a thin layer of white cells and platelets, and red blood cells at the bottom (about 45%)."
            />
            <Figure src={bioImages.bloodCells} alt="Red blood cells, white blood cells and platelets" />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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

          <Card title="Blood Clotting">
            <p>
              When a blood vessel is cut, platelets stick to the damaged edges and release chemicals.
              These change the soluble plasma protein <strong>fibrinogen</strong> into insoluble threads
              of <strong>fibrin</strong>, which form a mesh across the wound. Red blood cells become
              trapped in the mesh, forming a clot that hardens into a scab.
            </p>
            <Figure
              src={bioImages.bloodClotting}
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
            <div className="grid gap-4 md:grid-cols-3">
              <Figure src={bioImages.arteryCrossSection} alt="Artery cross-section" caption="Artery" />
              <Figure src={bioImages.veinCrossSection} alt="Vein cross-section" caption="Vein" />
              <Figure src={bioImages.capillaryCrossSection} alt="Capillary cross-section" caption="Capillary" />
            </div>
            <Figure
              src={bioImages.bloodVesselsComparison}
              alt="Side by side comparison of artery, vein and capillary structure"
              caption="Fig 4.6 — The three vessel types drawn to the same scale, with wall thickness, lumen size and valves labelled."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
              <strong>cardiac muscle</strong> that never gets tired. It has four chambers: two thin-walled{' '}
              <strong>atria</strong> at the top that receive blood, and two thick-walled{' '}
              <strong>ventricles</strong> below that pump it out.
            </p>
            <Figure
              src={bioImages.heartStructure}
              alt="Labelled diagram of the human heart with chambers, valves and main vessels"
              caption="Fig 4.7 — The human heart. Blue shows deoxygenated blood on the right side, red shows oxygenated blood on the left side."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <Definition term="Double circulation">
              a circulatory system in which blood passes through the heart <strong>twice</strong> for
              every one complete circuit of the body — once on the way to and from the lungs (pulmonary
              circulation) and once on the way to and from the rest of the body (systemic circulation).
            </Definition>
            <Figure
              src={bioImages.doubleCirculation}
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

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Transport Key Points"
            items={[
              'Transpiration = loss of water vapour through stomata',
              'Rate ↑ with heat, wind and light; ↓ with humidity',
              'Cobalt chloride: blue → pink shows water loss',
              'Blood = plasma + red cells + white cells + platelets',
              'Red cells: no nucleus, biconcave, haemoglobin',
              'Artery = away from heart; vein = towards heart',
              'Capillary walls are one cell thick for exchange',
              'Heart has 4 chambers; left ventricle wall is thickest',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Diagram practice</h3>
            <p className="text-sm text-slate-700">
              Be able to draw and label from memory: a potometer, a cross-section through artery, vein and
              capillary, and the human heart showing all four chambers, the four main vessels and the
              direction of blood flow.
            </p>
          </div>
        </aside>
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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Reproduction</strong> is the process by which living organisms produce new
              individuals of their own kind. It is the only one of the seven life processes that an
              individual can live without — but without it a species would disappear in a single
              generation.
            </p>
          </div>

          <Card title="Two Kinds of Reproduction">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <Figure
              src={bioImages.vegetativeArtificial}
              alt="Four artificial propagation methods: cutting, layering, grafting and budding"
              caption="Fig 5.2 — Artificial propagation: taking a cutting, layering a branch into the soil, grafting a scion onto a stock, and budding."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Cuttings:</strong> a piece of stem with a few buds is cut off, often dipped in
                rooting hormone, and planted. Used for cassava, sugar cane, roses and hibiscus.
              </li>
              <li>
                <strong>Layering:</strong> a low branch is bent down and part of it buried while still
                attached to the parent. Once roots have formed the branch is cut off. Used for jasmine and
                raspberries.
              </li>
              <li>
                <strong>Grafting:</strong> a shoot (the <em>scion</em>) from a plant with good fruit is
                joined onto the rooted stem (the <em>stock</em>) of a hardy plant, and the join is bound
                until the tissues unite. Used widely on citrus, mango, avocado and grapes.
              </li>
              <li>
                <strong>Budding:</strong> a single bud, rather than a whole shoot, is slipped under the
                bark of the stock. Common for roses and citrus.
              </li>
              <li>
                <strong>Tissue culture:</strong> tiny pieces of plant tissue are grown on sterile nutrient
                jelly in a laboratory to produce thousands of identical, disease-free plants.
              </li>
            </ul>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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

          <Card title="The Human Male Reproductive System">
            <Figure
              src={bioImages.maleReproductiveSystem}
              alt="Labelled human male reproductive system"
              caption="Fig 5.3 — The male reproductive system."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
                    Add a fluid containing sugar (fructose) that nourishes the sperm and helps them swim;
                    sperm + this fluid = semen
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
              src={bioImages.femaleReproductiveSystem}
              alt="Labelled human female reproductive system"
              caption="Fig 5.4 — The female reproductive system."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
            <Figure
              src={bioImages.menstrualCycle}
              alt="Menstrual cycle chart showing the 28 day cycle"
              caption="Fig 5.5 — The menstrual cycle. Menstruation begins on day 1 and ovulation occurs around day 14 of a 28-day cycle."
            />
            <Figure
              src={bioImages.fertilisationToImplantation}
              alt="From fertilisation in the oviduct to implantation in the uterus"
              caption="Fig 5.6 — Fertilisation occurs in the oviduct; the ball of cells travels down and implants in the uterus lining about a week later."
            />
          </Card>

          <Card title="Birth Control and Contraception">
            <Definition term="Contraception">
              the deliberate prevention of pregnancy, either by stopping sperm from reaching an egg, by
              stopping eggs from being released, or by stopping a fertilised egg from implanting.
            </Definition>
            <Figure
              src={bioImages.contraceptionMethods}
              alt="Chart of contraception methods grouped as natural, barrier, hormonal and surgical"
              caption="Fig 5.7 — Contraception methods grouped into four families. Only condoms also give protection against sexually transmitted infections."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
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
                    The only method that is 100% effective and also prevents STIs completely
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
                    A small device placed in the uterus that prevents implantation and hinders sperm
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

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Reproduction Key Points"
            items={[
              'Asexual = one parent, identical offspring (clones)',
              'Sexual = two gametes fuse, offspring vary',
              'Rhizome, tuber, bulb, corm, runner, sucker',
              'Cuttings, layering, grafting, budding, tissue culture',
              'Testes make sperm; ovaries make eggs',
              'Fertilisation happens in the oviduct',
              'Ovulation ≈ day 14 of a 28-day cycle',
              'Only condoms protect against both pregnancy and STIs',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Careful with the words</h3>
            <p className="text-sm text-slate-700">
              <strong>Stem tuber</strong> (potato) is a swollen stem; <strong>root tuber</strong> (sweet
              potato, cassava) is a swollen root. Grafting uses a <strong>scion</strong> joined to a{' '}
              <strong>stock</strong>. Contraception prevents pregnancy — it is not the same as preventing
              infection.
            </p>
          </div>
        </aside>
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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              We are surrounded by <strong>pathogens</strong> — micro-organisms such as bacteria, viruses,
              fungi and protozoa that cause disease. The reason we are not permanently ill is that the
              body has an impressive set of defences, from the physical barrier of the skin right through
              to specially trained white blood cells that remember an invader for life.
            </p>
          </div>

          <Definition term="Immunity">
            the ability of the body to resist infection by a particular pathogen, because it can destroy
            that pathogen before it causes disease.
          </Definition>

          <Card title="The Body's Lines of Defence">
            <Figure
              src={bioImages.bodyDefences}
              alt="Diagram of the body's first and second lines of defence"
              caption="Fig 6.1 — First line of defence keeps pathogens out; the second line destroys any that get in."
            />
            <p className="font-semibold text-slate-800">First line — keeping pathogens out</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Skin</strong> — a tough, dry, unbroken barrier that most pathogens cannot cross.
              </li>
              <li>
                <strong>Mucus and cilia</strong> in the nose and airways — trap dust and germs, then sweep
                them away from the lungs.
              </li>
              <li>
                <strong>Hydrochloric acid in the stomach</strong> — kills most bacteria swallowed with
                food.
              </li>
              <li>
                <strong>Tears and saliva</strong> — contain the enzyme lysozyme, which destroys bacterial
                cell walls.
              </li>
              <li>
                <strong>Blood clotting</strong> — quickly seals cuts so germs cannot get in.
              </li>
            </ul>
            <p className="mt-2 font-semibold text-slate-800">Second line — destroying invaders that get in</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Phagocytes</strong> flow around a pathogen, engulf it and digest it with enzymes.
                This process is called <strong>phagocytosis</strong>.
              </li>
              <li>
                <strong>Lymphocytes</strong> produce <strong>antibodies</strong> — proteins with a shape
                that fits one particular pathogen, sticking them together and marking them for destruction.
              </li>
              <li>
                Some lymphocytes stay behind as <strong>memory cells</strong>, so if the same pathogen ever
                returns the antibodies are made much faster and in much larger amounts.
              </li>
            </ul>
            <Figure
              src={bioImages.phagocytosis}
              alt="Four stage diagram of a phagocyte engulfing and digesting a bacterium"
              caption="Fig 6.2 — Phagocytosis: the phagocyte moves towards the bacterium, flows around it, encloses it in a vacuole and digests it with enzymes."
            />
          </Card>

          <Card title="Types of Immunity">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Type</th>
                  <th className="border p-2 text-left">How it is gained</th>
                  <th className="border p-2 text-left">Speed &amp; duration</th>
                  <th className="border p-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Natural active</td>
                  <td className="border p-2">
                    You catch the disease; your own lymphocytes make antibodies and memory cells
                  </td>
                  <td className="border p-2">Slow to develop, but long lasting</td>
                  <td className="border p-2">Having measles once and never getting it again</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Artificial active</td>
                  <td className="border p-2">
                    Vaccination — dead or weakened pathogens are injected and your body makes its own
                    antibodies
                  </td>
                  <td className="border p-2">Slow to develop, long lasting (boosters may be needed)</td>
                  <td className="border p-2">BCG vaccine against tuberculosis</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Natural passive</td>
                  <td className="border p-2">
                    Ready-made antibodies pass from mother to baby across the placenta and in breast milk
                  </td>
                  <td className="border p-2">Immediate, but only lasts a few months</td>
                  <td className="border p-2">A newborn protected by its mother&rsquo;s antibodies</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Artificial passive</td>
                  <td className="border p-2">
                    Ready-made antibodies are injected (an antiserum)
                  </td>
                  <td className="border p-2">Immediate, but short-lived</td>
                  <td className="border p-2">Anti-tetanus or anti-snake-venom serum after an injury</td>
                </tr>
              </tbody>
            </table>
            <ExamTip>
              <p>
                Sort out the two pairs of words like this. <strong>Active</strong> = your own body does the
                work of making antibodies (slow but lasting). <strong>Passive</strong> = you are given
                ready-made antibodies (instant but temporary). <strong>Natural</strong> = it happened
                without medical help; <strong>artificial</strong> = a doctor or nurse gave it to you.
              </p>
            </ExamTip>
          </Card>

          <Card title="Vaccination">
            <Definition term="Vaccine">
              a preparation containing dead, weakened or harmless parts of a pathogen, given to make the
              body produce antibodies and memory cells against that pathogen without the person having to
              suffer the disease.
            </Definition>
            <p className="font-semibold text-slate-800">How a vaccine works, step by step:</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>The vaccine, containing harmless antigens from the pathogen, is injected or swallowed.</li>
              <li>Lymphocytes recognise the antigens as foreign.</li>
              <li>They multiply and produce antibodies against them.</li>
              <li>Some become <strong>memory cells</strong> that stay in the blood for years.</li>
              <li>
                If the real pathogen invades later, the memory cells produce antibodies{' '}
                <strong>much faster and in much greater quantity</strong>, so the pathogen is destroyed
                before it can make you ill.
              </li>
            </ol>
            <Figure
              src={bioImages.antibodyResponseGraph}
              alt="Graph comparing primary and secondary antibody responses"
              caption="Fig 6.3 — The secondary response after a second exposure is faster, larger and lasts longer — this is why vaccination works."
            />
            <Figure
              src={bioImages.vaccinationSchedule}
              alt="Zimbabwe childhood immunisation schedule chart"
              caption="Fig 6.4 — Zimbabwe's Expanded Programme on Immunisation. These vaccinations are given free at government clinics."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                Children in Zimbabwe are routinely vaccinated against <strong>tuberculosis (BCG)</strong>,
                polio, diphtheria, whooping cough (pertussis), tetanus, hepatitis B, measles and rubella.
              </li>
              <li>Vitamin A supplements are given to children aged 6&ndash;59 months.</li>
              <li>
                When enough of a population is vaccinated, even unvaccinated people are protected because
                the disease cannot spread easily. This is called <strong>herd immunity</strong>.
              </li>
            </ul>
          </Card>

          <Card title="HIV and AIDS">
            <p>
              <strong>HIV</strong> stands for <strong>Human Immunodeficiency Virus</strong>. It is a virus
              that attacks and destroys a particular type of white blood cell (the helper T-lymphocyte, or
              CD4 cell) — the very cell that normally organises the immune response.
            </p>
            <Figure
              src={bioImages.hivAttack}
              alt="HIV entering and destroying a helper T lymphocyte, with a CD4 count graph"
              caption="Fig 6.5 — HIV enters a helper T-cell, uses it to make copies of itself and destroys it. As CD4 numbers fall, the body loses its ability to fight other infections."
            />
            <p>
              <strong>AIDS</strong> stands for <strong>Acquired Immune Deficiency Syndrome</strong>. It is
              the advanced stage of HIV infection, reached when so many white blood cells have been
              destroyed that the body can no longer fight off infections. The person then suffers{' '}
              <strong>opportunistic infections</strong> — illnesses such as tuberculosis, pneumonia,
              persistent diarrhoea, thrush and certain cancers, which a healthy immune system would
              normally control easily.
            </p>
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              <strong>Important:</strong> HIV and AIDS are not the same thing. A person can be HIV positive
              for many years, look and feel completely healthy, and still pass the virus on. The only way
              to know your status is to be tested.
            </div>
            <Figure
              src={bioImages.hivTransmission}
              alt="Ways HIV is and is not transmitted"
              caption="Fig 6.6 — How HIV is transmitted (left) and the everyday contacts that do NOT transmit it (right)."
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-rose-700">HIV IS transmitted by</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Unprotected sexual intercourse with an infected person</li>
                  <li>Sharing needles, syringes or unsterilised skin-piercing instruments</li>
                  <li>Transfusion of infected blood or blood products</li>
                  <li>From an infected mother to her baby during pregnancy, birth or breastfeeding</li>
                  <li>Contact of open wounds with infected blood</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-emerald-700">HIV is NOT transmitted by</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Shaking hands, hugging or sharing a desk</li>
                  <li>Sharing plates, cups, food or toilets</li>
                  <li>Coughing, sneezing, sweat or tears</li>
                  <li>Mosquito or other insect bites</li>
                  <li>Swimming in the same pool</li>
                </ul>
              </div>
            </div>
            <Card title="Prevention">
              <ul className="list-inside list-disc space-y-1">
                <li><strong>A</strong>bstain from sexual intercourse.</li>
                <li><strong>B</strong>e faithful to one uninfected partner.</li>
                <li><strong>C</strong>ondomise — use a condom correctly and consistently.</li>
                <li>Know your status: voluntary counselling and testing.</li>
                <li>Never share needles, razor blades, or any skin-piercing instrument.</li>
                <li>Screen all blood before transfusion.</li>
                <li>
                  <strong>PMTCT</strong> — prevention of mother-to-child transmission: an HIV-positive
                  mother who takes antiretroviral drugs throughout pregnancy and follows medical advice on
                  feeding has a very small chance of passing the virus to her baby.
                </li>
                <li>Male circumcision reduces (but does not remove) the risk of infection.</li>
              </ul>
            </Card>
            <Card title="Treatment and living positively">
              <ul className="list-inside list-disc space-y-1">
                <li>
                  <strong>Antiretroviral drugs (ARVs)</strong> stop the virus from multiplying. They do{' '}
                  <strong>not cure</strong> HIV, but taken every day for life they keep the viral load so
                  low that the person stays healthy and is far less likely to infect others.
                </li>
                <li>A balanced, high-protein diet supports the immune system.</li>
                <li>Opportunistic infections such as TB must be treated promptly.</li>
                <li>
                  Stigma and discrimination are harmful and unjustified. People living with HIV can work,
                  study, marry and live long, full lives.
                </li>
              </ul>
            </Card>
          </Card>

          <Card title="Breastfeeding">
            <Figure
              src={bioImages.breastfeedingBenefits}
              alt="Chart of the benefits of breastfeeding"
              caption="Fig 6.7 — Why breast milk is recommended for the first six months of life."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                Breast milk contains <strong>all the nutrients a baby needs</strong> in the correct
                proportions for the first six months.
              </li>
              <li>
                It supplies the mother&rsquo;s <strong>antibodies</strong>, giving the baby natural passive
                immunity while its own immune system develops.
              </li>
              <li>
                It is <strong>hygienic</strong> — it comes sterile and at the right temperature, with no
                risk from dirty water or unwashed bottles.
              </li>
              <li>It is free, always available and needs no preparation.</li>
              <li>It helps the mother&rsquo;s uterus return to its normal size and strengthens bonding.</li>
              <li>The first milk, <strong>colostrum</strong>, is especially rich in antibodies and protein.</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Health Key Points"
            items={[
              'Pathogen = a micro-organism that causes disease',
              'First line: skin, mucus, acid, tears, clotting',
              'Second line: phagocytes engulf; lymphocytes make antibodies',
              'Active = you make antibodies; passive = you are given them',
              'Vaccines create memory cells',
              'HIV destroys helper T white blood cells',
              'AIDS is the advanced stage of HIV infection',
              'ARVs control HIV but do not cure it',
            ]}
          />
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-rose-800">Never write this</h3>
            <p className="text-sm text-slate-700">
              &ldquo;HIV is the same as AIDS&rdquo; · &ldquo;antibiotics cure HIV&rdquo; (HIV is a virus —
              antibiotics only work on bacteria) · &ldquo;you can get HIV from a mosquito bite&rdquo; ·
              &ldquo;vaccines contain antibodies&rdquo; (they contain <em>antigens</em>; your body makes
              the antibodies).
            </p>
          </div>
        </aside>
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
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <h4 className="text-lg font-bold text-amber-800">Last-Minute Study Strategy</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
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

        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-rose-800">Common Mistakes to Avoid</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
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
              <h4 className="text-lg font-bold text-blue-700">Ecology</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Ecosystem = biotic + abiotic</li>
              <li>Food chains, food webs, trophic levels</li>
              <li>Pyramids of numbers and biomass</li>
              <li>Carbon and nitrogen cycles</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Exam tip: only about 10% of energy passes to the next trophic level — the rest is lost as
              heat, in respiration and in waste.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🥗</span>
              <h4 className="text-lg font-bold text-blue-700">Nutrition</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Seven nutrient classes</li>
              <li>Deficiency diseases</li>
              <li>Four food tests</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Must memorise: starch = blue-black · reducing sugar = brick red (heat) · protein = purple ·
              fat = cloudy emulsion.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🫁</span>
              <h4 className="text-lg font-bold text-blue-700">Respiration</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Aerobic vs anaerobic</li>
              <li>Mitochondria, ATP, lactic acid</li>
              <li>Limewater and thermos-flask experiments</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Every respiration experiment needs a control of dead (boiled) seeds.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🚚</span>
              <h4 className="text-lg font-bold text-blue-700">Transport</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Transpiration and its factors</li>
              <li>Blood: plasma, RBC, WBC, platelets</li>
              <li>Arteries, veins, capillaries; the heart</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Quick check: &ldquo;away from heart&rdquo; = artery, &ldquo;towards heart&rdquo; = vein —
              not oxygen content.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🌱</span>
              <h4 className="text-lg font-bold text-blue-700">Reproduction</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>
                Vegetative: rhizome, stem tuber, root tuber, bulb, corm, runner, sucker — all produce
                clones
              </li>
              <li>Artificial: cuttings, layering, grafting, budding, tissue culture</li>
              <li>Male: testes, sperm ducts, prostate, urethra, penis</li>
              <li>Female: ovaries, oviducts, uterus, cervix, vagina — fertilisation in the oviduct</li>
              <li>Contraception: natural, barrier, hormonal, intra-uterine, surgical</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Only condoms give dual protection: against pregnancy <em>and</em> against STIs including HIV.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">💊</span>
              <h4 className="text-lg font-bold text-blue-700">Health &amp; Diseases</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>First and second lines of defence</li>
              <li>Phagocytosis and antibody production</li>
              <li>Four types of immunity, and how vaccines work</li>
              <li>HIV/AIDS: transmission, prevention, ARVs, stigma</li>
              <li>Breastfeeding gives natural passive immunity</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Key distinction: bacteria are killed by antibiotics; viruses (including HIV) are not.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <h4 className="text-lg font-bold text-emerald-800">Final Checklist Before the Exam</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
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
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
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

export default LearningOutcome1;
