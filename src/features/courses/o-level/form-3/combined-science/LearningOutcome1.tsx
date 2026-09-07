import React, { useState, useRef, useEffect } from 'react';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- Hook: reveal content on scroll ---------- */
const useInView = (options: IntersectionObserverInit = { threshold: 0.15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

const RevealCard: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
};

/* ---------- SVG diagrams ---------- */

// Animal and Plant Cells
const cellComparisonSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 250" width="100%" height="100%">
  <rect width="600" height="250" fill="white" />
  <text x="150" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Animal Cell</text>
  <text x="450" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Plant Cell</text>
  
  <!-- Animal Cell -->
  <ellipse cx="150" cy="130" rx="80" ry="60" fill="none" stroke="#3b82f6" stroke-width="2" />
  <text x="150" y="60" font-size="11" fill="#475569">Cell membrane</text>
  <circle cx="150" cy="110" r="25" fill="none" stroke="#eab308" stroke-width="2" />
  <text x="150" y="115" text-anchor="middle" font-size="10" fill="#1e293b">Nucleus</text>
  <text x="150" y="180" font-size="11" fill="#475569">Cytoplasm</text>
  
  <!-- Plant Cell -->
  <rect x="380" y="70" width="140" height="120" rx="5" fill="none" stroke="#3b82f6" stroke-width="2" />
  <rect x="390" y="80" width="120" height="100" rx="3" fill="none" stroke="#2563eb" stroke-width="1" stroke-dasharray="2,2" />
  <text x="450" y="95" font-size="11" fill="#475569">Cell wall</text>
  <text x="450" y="115" font-size="11" fill="#475569">Cell membrane</text>
  <circle cx="450" cy="135" r="15" fill="none" stroke="#eab308" stroke-width="2" />
  <text x="450" y="140" text-anchor="middle" font-size="9" fill="#1e293b">Nucleus</text>
  <rect x="430" y="160" width="30" height="20" rx="3" fill="none" stroke="#22c55e" stroke-width="1" />
  <text x="445" y="173" text-anchor="middle" font-size="9" fill="#22c55e">V</text>
  <text x="490" y="175" font-size="11" fill="#475569">Vacuole</text>
  <ellipse cx="410" cy="100" rx="8" ry="5" fill="none" stroke="#22c55e" stroke-width="1" />
  <text x="395" y="105" font-size="9" fill="#22c55e">Chloroplast</text>
</svg>
`;

// Leaf structure
const leafStructureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300" width="100%" height="100%">
  <rect width="500" height="300" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Leaf Structure</text>
  <!-- Cuticle -->
  <rect x="50" y="50" width="400" height="15" fill="#fef9c3" stroke="#eab308" stroke-width="1" />
  <text x="60" y="60" font-size="10" fill="#ca8a04">Cuticle</text>
  <!-- Upper epidermis -->
  <rect x="50" y="65" width="400" height="15" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
  <text x="60" y="75" font-size="10" fill="#2563eb">Upper epidermis</text>
  <!-- Palisade -->
  <rect x="50" y="80" width="400" height="50" fill="#dcfce7" stroke="#22c55e" stroke-width="1" />
  <text x="60" y="100" font-size="10" fill="#16a34a">Palisade layer</text>
  <!-- Spongy -->
  <rect x="50" y="130" width="400" height="40" fill="#e0f2fe" stroke="#3b82f6" stroke-width="1" />
  <text x="60" y="155" font-size="10" fill="#2563eb">Spongy layer</text>
  <!-- Lower epidermis -->
  <rect x="50" y="170" width="400" height="15" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
  <text x="60" y="180" font-size="10" fill="#2563eb">Lower epidermis</text>
  <!-- Stomata -->
  <ellipse cx="200" cy="190" rx="12" ry="6" fill="none" stroke="#3b82f6" stroke-width="1" />
  <text x="200" y="200" text-anchor="middle" font-size="10" fill="#2563eb">Stoma</text>
  <!-- Vascular bundle -->
  <rect x="230" y="90" width="10" height="70" fill="#f59e0b" stroke="#d97706" stroke-width="1" />
  <text x="245" y="130" font-size="10" fill="#d97706">Vein</text>
  <!-- Xylem/Phloem labels -->
  <text x="260" y="110" font-size="9" fill="#475569">Xylem</text>
  <text x="260" y="140" font-size="9" fill="#475569">Phloem</text>
</svg>
`;

 

// Photosynthesis equation
const photosynthesisEquationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 160" width="100%" height="100%">
  <rect width="900" height="160" fill="white" />

  <!-- Carbon dioxide -->
  <rect x="10" y="45" width="140" height="65" rx="10" fill="#f1f5f9" stroke="#64748b" stroke-width="2" />
  <text x="80" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#334155">Carbon dioxide</text>
  <text x="80" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="#0f172a">CO&#8322;</text>

  <text x="168" y="86" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">+</text>

  <!-- Water -->
  <rect x="186" y="45" width="140" height="65" rx="10" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <text x="256" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">Water</text>
  <text x="256" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e3a8a">H&#8322;O</text>

  <!-- Arrow -->
  <line x1="336" y1="77" x2="470" y2="77" stroke="#16a34a" stroke-width="3" marker-end="url(#arrowheadLinear)" />
  <defs>
    <marker id="arrowheadLinear" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#16a34a" />
    </marker>
  </defs>
  <text x="403" y="55" text-anchor="middle" font-size="11" font-weight="bold" fill="#ca8a04">Light</text>
  <text x="403" y="105" text-anchor="middle" font-size="11" font-weight="bold" fill="#16a34a">Chlorophyll</text>

  <!-- Glucose -->
  <rect x="490" y="45" width="150" height="65" rx="10" fill="#fef3c7" stroke="#eab308" stroke-width="2" />
  <text x="565" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#854d0e">Glucose</text>
  <text x="565" y="90" text-anchor="middle" font-size="15" font-weight="bold" fill="#854d0e">C&#8326;H&#8321;&#8322;O&#8326;</text>

  <text x="658" y="86" text-anchor="middle" font-size="24" font-weight="bold" fill="#334155">+</text>

  <!-- Oxygen -->
  <rect x="676" y="45" width="140" height="65" rx="10" fill="#dcfce7" stroke="#22c55e" stroke-width="2" />
  <text x="746" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#166534">Oxygen</text>
  <text x="746" y="90" text-anchor="middle" font-size="16" font-weight="bold" fill="#166534">O&#8322;</text>
</svg>
`;

 

 

 

const combinedScienceImage = (fileName: string) =>
  `/images/courses/o-level/combined-science/${encodeURIComponent(fileName)}`;

const placeholderImageMap: Record<string, string> = {
  starch_test_step1: 'Testing a Leaf for Starch1.png',
  starch_test_step2: 'Testing a Leaf for Starch2.png',
  starch_test_step3: 'Testing a Leaf for Starch3.png',
  starch_test_step4: 'Testing a Leaf for Starch4.png',
  co2_experiment_step1: 'Is Carbon Dioxide Necessary for Photosynthesis1.png',
  co2_experiment_step2: 'Is Carbon Dioxide Necessary for Photosynthesis2.png',
  co2_experiment_step3: 'Is Carbon Dioxide Necessary for Photosynthesis3.png',
  co2_experiment_step4: 'Is Carbon Dioxide Necessary for Photosynthesis4.png',
  chlorophyll_experiment_step1: 'Is Chlorophyll Essential for Photosynthesis1.png',
  chlorophyll_experiment_step2: 'Is Chlorophyll Essential for Photosynthesis2.png',
  sunlight_experiment_step1: 'Is Sunlight Necessary for Photosynthesis1.png',
  sunlight_experiment_step2: 'Is Sunlight Necessary for Photosynthesis2.png',
  sunlight_experiment_step3: 'Is Sunlight Necessary for Photosynthesis3.png',
  sunlight_experiment_step4: 'Is Sunlight Necessary for Photosynthesis4.png',
  oxygen_experiment_step1: 'Is Oxygen Produced During Photosynthesis1.png',
  oxygen_experiment_step2: 'Is Oxygen Produced During Photosynthesis2.png',
  oxygen_experiment_step3: 'Is Oxygen Produced During Photosynthesis3.png',
  oxygen_experiment_step4: 'Is Oxygen Produced During Photosynthesis4.png',
  digestive_system: 'digestivesystem.png',
  teeth_in_mouth_labeled: 'teeth-mouth open.png',
  teeth_individual_types: 'teeth-singlediagram.png',
  food_tests_results: 'food-tests.png',
  alveoli_diagram: 'alveoli.png',
  limewater_step1: 'Comparing Inhaled and Exhaled Air1.png',
  limewater_step2: 'Comparing Inhaled and Exhaled Air2.png',
  limewater_step3: 'Comparing Inhaled and Exhaled Air3.png',
  limewater_step4: 'Comparing Inhaled and Exhaled Air4.png',
  candle_step1: 'Comparing Oxygen Content Using a Candle1.png',
  candle_step2: 'Comparing Oxygen Content Using a Candle2.png',
  candle_step3: 'Comparing Oxygen Content Using a Candle3.png',
  candle_step4: 'Comparing Oxygen Content Using a Candle4.png',
  potometer: 'Potometer Apparatus.png',
  osmosis_diagram: 'Osmosis Diagram:.png',
  turgid_vs_plasmolysed_cells: 'Turgid vsPlasmolysed Plant Cells.png',
};

const placeholderToImage = (placeholder: string) => {
  const key = placeholder.replace(/[{}]/g, '');
  const fileName = placeholderImageMap[key];
  return fileName ? combinedScienceImage(fileName) : undefined;
};

const scienceImages = {
  animalCell: combinedScienceImage('animalcell.png'),
  arteryCrossSection: combinedScienceImage('Artery Cross-Section.png'),
  capillaryCrossSection: combinedScienceImage('Capillary Cross-Section.png'),
  cellComparison: svgToDataUri(cellComparisonSvg),
  leafStructurePhoto: combinedScienceImage('leaf structure.png'),
  plantCell: combinedScienceImage('Simple_diagram_of_plant_cell.webp'),
  photosynthesisEquation: svgToDataUri(photosynthesisEquationSvg),
  leafStructure: svgToDataUri(leafStructureSvg),
  respiratorySystem: combinedScienceImage('respiratorysystem.png'),
  specialisedCells1: combinedScienceImage('specialised cell1.png'),
  specialisedCells2: combinedScienceImage('speacilisedcells2.png'),
  transpirationInPlants: combinedScienceImage('transpirationinplants.png'),
  veinCrossSection: combinedScienceImage('Vein Cross-Section.png'),
  flowerStructure: combinedScienceImage('flowerstructure.png'),
  selfPollination: combinedScienceImage('selfpollination.png'),
  crossPollination: combinedScienceImage('crosspollination.png'),
  fertilisationProcess: combinedScienceImage('fertilisationprocess.png'),
  seedAndFruitFormation: combinedScienceImage('seedfruitformation.png'),
  germinationStages: combinedScienceImage('germinationstages.png'),
  maleReproductiveSystem: combinedScienceImage('malereproductivesystem.png'),
  femaleReproductiveSystem: combinedScienceImage('femalereproductivesystem.png'),
  menstrualCycleChart: combinedScienceImage('menstrualcyclechart.png'),
  placentaAndFoetus: combinedScienceImage('placentafoetus.png'),
  fertilisationToImplantation: combinedScienceImage('fertilisationimplantation.png'),
  malariaLifeCycle: combinedScienceImage('malarialifecycle.png'),
  anophelesMosquito: combinedScienceImage('anophelesmosquito.png'), 
   
   
};

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const PlaceholderImage: React.FC<{ placeholder: string; alt: string; className?: string }> = ({
  placeholder,
  alt,
  className = 'mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm',
}) => {
  const imageSrc = placeholderToImage(placeholder);
  if (!imageSrc) return null;

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};

const experimentRoutes = {
  leafStarch: '/practicals/olevel/combined-science/photosynthesis',
  photosynthesis: '/practicals/olevel/combined-science/photosynthesis',
  oxygenPhotosynthesis: '/practicals/olevel/combined-science/oxygen-from-photosynthesis',
  inhaledExhaledAir: '/practicals/olevel/combined-science/inhaled-exhaled-air',
  candleOxygen: '/practicals/olevel/combined-science/candle-oxygen-test',
};

const DoExperimentButton: React.FC<{ href: string }> = ({ href }) => (
  <a
    href={href}
    className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-950 via-blue-900 to-cyan-700 px-5 py-2.5 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-cyan-900/25 ring-1 ring-white/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-900/35 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
  >
    Do Experiment
    <span aria-hidden="true" className="text-base leading-none">→</span>
  </a>
);

const sections: TopicSection[] = [
  {
    id: 'cells',
    title: 'Cells',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>cell</strong> is the basic unit of the structure and function of all living organisms. Cells cannot be seen with the naked eye; microscopes are needed.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Animal and Plant Cell Structure</h4>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <figure>
                <img src={scienceImages.animalCell} alt="Animal cell structure" className="h-full w-full rounded-xl border border-slate-200 bg-white object-contain" />
                <figcaption className="mt-2 text-xs font-semibold text-slate-600">Animal cell</figcaption>
              </figure>
              <figure>
                <img src={scienceImages.plantCell} alt="Plant cell structure" className="h-full w-full rounded-xl border border-slate-200 bg-white object-contain" />
                <figcaption className="mt-2 text-xs font-semibold text-slate-600">Plant cell</figcaption>
              </figure>
            </div>
            <p className="text-sm text-slate-700 mt-3"><span className="font-semibold">Image:</span> Animal and plant cells showing key organelles.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Comparison: Plant vs Animal Cells</h4>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr><th className="border p-2">Feature</th><th className="border p-2">Plant Cell</th><th className="border p-2">Animal Cell</th></tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Cell wall</td><td className="border p-2">Have a cellulose wall covering the cell membrane</td><td className="border p-2">Don't have a cell wall</td></tr>
                <tr><td className="border p-2">Cell membrane</td><td className="border p-2">Have a cell membrane</td><td className="border p-2">Have a cell membrane</td></tr>
                <tr><td className="border p-2">Cytoplasm</td><td className="border p-2">Have cytoplasm</td><td className="border p-2">Have cytoplasm</td></tr>
                <tr><td className="border p-2">Nucleus</td><td className="border p-2">Have a nucleus</td><td className="border p-2">Have a nucleus</td></tr>
                <tr><td className="border p-2">Chloroplasts</td><td className="border p-2">Often have chloroplasts with chlorophyll in them</td><td className="border p-2">Chloroplasts absent in animal cells</td></tr>
                <tr><td className="border p-2">Vacuole</td><td className="border p-2">Often have large vacuoles containing cell sap</td><td className="border p-2">No vacuoles</td></tr>
                <tr><td className="border p-2">Starch/Glycogen</td><td className="border p-2">Often have starch grains</td><td className="border p-2">Only have glycogen granules present sometimes</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Specialised Cells</h4>
            <p className="text-sm text-slate-700 mb-3">
              Cells become <strong>specialised</strong> (differentiated) when they develop specific structures and shapes that suit a particular job in the body. This is why, even though all cells come from division of a single fertilised egg, cells in different organs look and behave very differently.
            </p>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Cell type</th>
                  <th className="border p-2 text-left">Where it is found</th>
                  <th className="border p-2 text-left">Key adaptation</th>
                  <th className="border p-2 text-left">What it does</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Ciliated cell</td>
                  <td className="border p-2">Lining of the trachea and bronchi</td>
                  <td className="border p-2">Covered in tiny hair-like cilia that beat in waves</td>
                  <td className="border p-2">Sweeps mucus (carrying trapped dust and germs) up and away from the lungs</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Root hair cell</td>
                  <td className="border p-2">Root tips of plants</td>
                  <td className="border p-2">Long, thin extension that gives a large surface area</td>
                  <td className="border p-2">Absorbs water and mineral salts from the soil by osmosis and diffusion</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Palisade mesophyll cell</td>
                  <td className="border p-2">Upper layer of leaf tissue</td>
                  <td className="border p-2">Packed with many chloroplasts; column-shaped, arranged upright</td>
                  <td className="border p-2">Absorbs light efficiently to carry out most of the leaf's photosynthesis</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Sperm cell</td>
                  <td className="border p-2">Testes (male reproductive system)</td>
                  <td className="border p-2">Long tail (flagellum), many mitochondria, acrosome tip</td>
                  <td className="border p-2">Swims to reach the egg; mitochondria provide energy for movement; acrosome releases enzymes to penetrate the egg</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Egg cell (ovum)</td>
                  <td className="border p-2">Ovaries (female reproductive system)</td>
                  <td className="border p-2">Large cell with plenty of cytoplasm and food reserves (yolk)</td>
                  <td className="border p-2">Provides the nutrients needed to support the early embryo after fertilisation</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Red blood cell</td>
                  <td className="border p-2">Blood</td>
                  <td className="border p-2">Biconcave disc shape, no nucleus, full of haemoglobin</td>
                  <td className="border p-2">Carries oxygen from the lungs to body tissues; lack of nucleus leaves more room for haemoglobin</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Nerve cell (neurone)</td>
                  <td className="border p-2">Brain, spinal cord, and nerves throughout the body</td>
                  <td className="border p-2">Long, thread-like fibres (axon and dendrites)</td>
                  <td className="border p-2">Carries electrical impulses quickly between different parts of the body</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Muscle cell</td>
                  <td className="border p-2">Muscles</td>
                  <td className="border p-2">Long, contains many mitochondria and protein filaments</td>
                  <td className="border p-2">Contracts and relaxes to produce movement; mitochondria supply the energy needed</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">White blood cell</td>
                  <td className="border p-2">Blood</td>
                  <td className="border p-2">Has a nucleus; some can change shape</td>
                  <td className="border p-2">Defends the body against disease by engulfing pathogens or producing antibodies</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Platelets</td>
                  <td className="border p-2">Blood</td>
                  <td className="border p-2">Small cell fragments, no nucleus</td>
                  <td className="border p-2">Help blood to clot at wounds, sealing the site and preventing blood loss</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <img src={scienceImages.specialisedCells1} alt="Specialised cells examples" loading="lazy" decoding="async" className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
              <img src={scienceImages.specialisedCells2} alt="More specialised cells examples" loading="lazy" decoding="async" className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Cell Key Points</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Nucleus – controls cell</li>
              <li>Cytoplasm – chemical reactions</li>
              <li>Cell membrane – controls entry/exit</li>
              <li>Cell wall – support (plants)</li>
              <li>Chloroplasts – photosynthesis</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'nutrition-plants',
    title: 'Nutrition in Plants',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Nutrition</strong> is the process by which organisms obtain and use the food materials they need for energy, growth, and repair. Green plants carry out a special type of nutrition called <strong>autotrophic nutrition</strong> — they are able to manufacture their own food (carbohydrates) from simple inorganic substances, using light energy. Because of this ability, green plants are called <strong>producers</strong>: they form the base of almost every food chain, since all other organisms (consumers) depend directly or indirectly on them for food and energy.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              The process green plants use to manufacture their food is called <strong>photosynthesis</strong>, meaning "making with light." It takes place mainly in the leaves, inside chloroplasts, where the green pigment <strong>chlorophyll</strong> traps light energy and converts it into chemical energy stored in glucose.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Photosynthesis Equation</h4>
            <div className="mt-2">
              <img src={scienceImages.photosynthesisEquation} alt="Photosynthesis equation diagram" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-2"><strong>Reactants:</strong> CO₂, H₂O, sunlight. <strong>Products:</strong> Glucose (a carbohydrate), O₂.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Leaf Structure</h4>
            <div className="mt-2">
              <img src={scienceImages.leafStructurePhoto} alt="Leaf structure" className="w-full rounded-xl border border-slate-200 bg-white object-contain" />
            </div>
            <table className="w-full text-sm text-slate-700 border-collapse mt-3">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Layer/Part</th>
                  <th className="border p-2 text-left">Structure</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Cuticle</td>
                  <td className="border p-2">A thin, waxy, transparent layer covering the upper surface of the leaf</td>
                  <td className="border p-2">Waterproof – reduces water loss through evaporation; also lets light through to the cells below</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Upper epidermis</td>
                  <td className="border p-2">A single layer of tightly packed, transparent cells with no chloroplasts</td>
                  <td className="border p-2">Protects inner tissues while allowing light to pass through to the palisade layer</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Palisade layer</td>
                  <td className="border p-2">Tall, column-shaped cells packed closely together just below the upper epidermis, each containing many chloroplasts</td>
                  <td className="border p-2">Main site of photosynthesis – positioned near the top to absorb the most light</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Spongy layer</td>
                  <td className="border p-2">Loosely arranged, irregularly shaped cells with large air spaces between them</td>
                  <td className="border p-2">Allows gases (CO₂ and O₂) to move freely between the stomata and the photosynthesising cells</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Lower epidermis</td>
                  <td className="border p-2">A single layer of cells, similar to the upper epidermis, containing the stomata</td>
                  <td className="border p-2">Protects the lower surface of the leaf and controls gas/water exchange through the stomata</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Stomata</td>
                  <td className="border p-2">Small pores in the lower epidermis, each surrounded by two bean-shaped guard cells</td>
                  <td className="border p-2">Open and close to control the exchange of CO₂, O₂, and water vapour with the atmosphere</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Xylem</td>
                  <td className="border p-2">Tube-like vessels forming the upper part of the vascular bundle (vein)</td>
                  <td className="border p-2">Transports water and dissolved minerals from the roots up to the leaf cells</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Phloem</td>
                  <td className="border p-2">Tube-like vessels forming the lower part of the vascular bundle (vein)</td>
                  <td className="border p-2">Transports dissolved sugars (food made by photosynthesis) away from the leaf to other parts of the plant</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border-2 border-blue-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-1">Experiment 1: Testing a Leaf for Starch</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Aim:</strong> To find out whether a leaf that has been photosynthesising contains starch.</p>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Iodine solution, dropper, alcohol, test tube, burner, stand, white tile, green leaf, beaker.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Dip the leaf in boiling water to kill the cells, stop all chemical reactions, and soften the leaf.</p>
                <PlaceholderImage placeholder="{starch_test_step1}" alt="Dipping leaf in boiling water" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Place the leaf in alcohol to remove the green chlorophyll (this makes color changes easier to see later). Since alcohol is highly flammable, place the test tube of alcohol inside a beaker of boiling water rather than heating it directly.</p>
                <PlaceholderImage placeholder="{starch_test_step2}" alt="Removing chlorophyll with alcohol using water bath" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Dip the decolourised leaf back into hot water briefly to soften it again, since the alcohol makes it brittle and hard.</p>
                <PlaceholderImage placeholder="{starch_test_step3}" alt="Softening leaf in hot water" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Spread the leaf flat on a white tile and cover it with iodine solution using a dropper.</p>
                <PlaceholderImage placeholder="{starch_test_step4}" alt="Applying iodine solution to leaf on white tile" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Observations:</strong> Boiling the leaf in alcohol decolourises it. Removing the green colour makes the colour change between iodine and starch far easier to see. The alcohol treatment leaves the leaf brittle, which is why it must be softened again in hot water.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Results:</strong> The leaf turns <strong>blue-black</strong> where starch is present, and stays <strong>yellowish-brown</strong> where starch is absent.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Since starch is detected in the leaf, this confirms that green plants are able to manufacture their own food.</p>
            <DoExperimentButton href={experimentRoutes.leafStarch} />
          </div>

          <div className="p-4 bg-amber-50/50 rounded-xl border-2 border-amber-200 shadow-sm">
            <h4 className="font-bold text-amber-700 text-lg mb-1">Experiment 2: Is Carbon Dioxide Necessary for Photosynthesis?</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Two potted plants (A and B), soda lime, sodium hydrogen carbonate, starch test kit, polythene bags.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">De-starch both potted plants first, by keeping them in the dark for at least 24 hours so any existing starch is used up.</p>
                <PlaceholderImage placeholder="{co2_experiment_step1}" alt="De-starching potted plants in darkness" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Place an inverted lid or small dish containing soda lime (or calcium carbonate) inside the polythene bag with Plant A. Soda lime absorbs carbon dioxide from the air around the plant.</p>
                <PlaceholderImage placeholder="{co2_experiment_step2}" alt="Placing soda lime dish with Plant A" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Seal both plants in polythene bags. Cover Plant A (with the soda lime) again, and leave Plant B untreated as the <strong>control</strong>, which has all the conditions necessary for photosynthesis.</p>
                <PlaceholderImage placeholder="{co2_experiment_step3}" alt="Sealing plants in polythene bags" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Keep both plants in a well-lit place for 2–3 days, then remove a leaf from each and perform the starch test (as in Experiment 1) on both leaves.</p>
                <PlaceholderImage placeholder="{co2_experiment_step4}" alt="Testing leaves from both plants for starch" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Results:</strong> Plant A (soda lime, no CO₂ available) does <strong>not</strong> photosynthesise, since its carbon dioxide is absorbed by the soda lime before the plant can use it. Plant B makes food normally, since carbon dioxide is freely available and used by the plant.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Carbon dioxide is required for photosynthesis to take place.</p>
            <DoExperimentButton href={experimentRoutes.photosynthesis} />
          </div>

          <div className="p-4 bg-green-50/50 rounded-xl border-2 border-green-200 shadow-sm">
            <h4 className="font-bold text-green-700 text-lg mb-1">Experiment 3: Is Chlorophyll Essential for Photosynthesis?</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> A variegated plant (one with green and white/pale patches on its leaves), starch test kit.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Since it's difficult to remove chlorophyll from a normal leaf without killing it, use a <strong>variegated leaf</strong> instead — one that naturally contains chlorophyll only in patches, with the rest of the leaf pale or white.</p>
                <PlaceholderImage placeholder="{chlorophyll_experiment_step1}" alt="Variegated leaf with green and white patches" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Perform the standard starch test (decolourise in alcohol using a water bath, then apply iodine) on the whole variegated leaf.</p>
                <PlaceholderImage placeholder="{chlorophyll_experiment_step2}" alt="Testing variegated leaf for starch" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Observations:</strong> When iodine solution is added, only the part of the leaf that was originally green turns blue-black. The part that was white/pale (with no chlorophyll) stays brown, showing no starch was made there.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Chlorophyll is necessary for photosynthesis, since starch is only produced in the parts of the leaf that contain it.</p>
            <DoExperimentButton href={experimentRoutes.photosynthesis} />
          </div>

          <div className="p-4 bg-yellow-50/50 rounded-xl border-2 border-yellow-200 shadow-sm">
            <h4 className="font-bold text-yellow-700 text-lg mb-1">Experiment 4: Is Sunlight Necessary for Photosynthesis?</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Aluminium foil (or dark cardboard), a potted green plant, iodine solution.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">De-starch the potted plant by keeping it in complete darkness for at least 24 hours, so any existing starch is used up.</p>
                <PlaceholderImage placeholder="{sunlight_experiment_step1}" alt="De-starching plant in darkness" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Cut a simple shape out of the middle of a piece of aluminium foil, then cover a leaf still attached to the plant with the foil, making sure the cut-out shape faces upward toward the light.</p>
                <PlaceholderImage placeholder="{sunlight_experiment_step2}" alt="Covering leaf with cut-out aluminium foil" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Leave the plant in sunlight for 4–6 hours so photosynthesis can occur in the exposed part of the leaf.</p>
                <PlaceholderImage placeholder="{sunlight_experiment_step3}" alt="Plant with covered leaf left in sunlight" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Remove the foil-covered leaf and test the whole leaf for starch using the standard test.</p>
                <PlaceholderImage placeholder="{sunlight_experiment_step4}" alt="Testing foil-covered leaf for starch" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Results:</strong> The part of the leaf that was left uncovered (exposed to light through the cut-out shape) turns <strong>blue-black</strong> (starch present), matching the shape of the cut-out. The part that was covered by the foil stays <strong>brown</strong> (no starch).</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Sunlight is essential for photosynthesis.</p>
            <DoExperimentButton href={experimentRoutes.photosynthesis} />
          </div>

          <div className="p-4 bg-violet-50/50 rounded-xl border-2 border-violet-200 shadow-sm">
            <h4 className="font-bold text-violet-700 text-lg mb-1">Experiment 5: Is Oxygen Produced During Photosynthesis?</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Water weed (Elodea/pondweed), test tube, beaker, funnel, water, glowing splint, stand.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Place the water weed in a beaker filled with water, and position an inverted funnel over the plant.</p>
                <PlaceholderImage placeholder="{oxygen_experiment_step1}" alt="Water weed placed under inverted funnel in beaker" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Fill a test tube completely with water, and invert it carefully over the stem of the funnel so no air bubbles enter.</p>
                <PlaceholderImage placeholder="{oxygen_experiment_step2}" alt="Inverted water-filled test tube over funnel stem" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Place the whole setup near a window so it receives good sunlight, and leave it until gas has visibly collected and filled the test tube.</p>
                <PlaceholderImage placeholder="{oxygen_experiment_step3}" alt="Apparatus placed in sunlight near window" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Carefully lift the test tube straight upward out of the beaker (keeping it upright so the gas stays trapped inside), then test the gas with a glowing splint.</p>
                <PlaceholderImage placeholder="{oxygen_experiment_step4}" alt="Testing collected gas with a glowing splint" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Results:</strong> The glowing splint bursts back into flame when inserted into the gas, which is the standard test for oxygen.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Oxygen is produced during photosynthesis.</p>
            <DoExperimentButton href={experimentRoutes.oxygenPhotosynthesis} />
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Factors Affecting the Rate of Photosynthesis</h4>
            <p className="text-sm text-slate-700 mb-3">
              The rate at which a plant photosynthesises is not constant — it rises and falls depending on the availability of raw materials and the conditions around it. There are four main <strong>limiting factors</strong>: any one of these, if in short supply, will hold back the whole process no matter how much of the others is available.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>1. Carbon dioxide concentration</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              Carbon dioxide is one of the raw materials directly used to build glucose. As the concentration of CO₂ in the air around the plant increases, the rate of photosynthesis increases too, since more raw material is available for the plant to convert into sugar. However, this only holds up to a point — once CO₂ is no longer the limiting factor, further increases have little extra effect because some other factor (such as light or temperature) then becomes limiting instead.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>2. Light intensity</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              Light provides the energy that chlorophyll traps and uses to split water molecules during photosynthesis. The brighter the light, the faster this energy-trapping process happens, and so the faster the rate of photosynthesis — again, up to a saturation point beyond which extra light no longer speeds things up because another factor becomes limiting.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>3. Temperature</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              Photosynthesis depends on enzymes to carry out its chemical reactions, and enzymes are very sensitive to temperature. At low temperatures, enzymes work slowly, so photosynthesis is sluggish. As temperature rises toward the enzymes' optimum, the rate speeds up. But if the temperature climbs too high, the enzymes become permanently damaged (denatured) and stop working altogether, which brings photosynthesis to a halt rather than simply slowing it down.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>4. Water availability</strong></p>
            <p className="text-sm text-slate-700">
              Water is both a raw material for photosynthesis and essential for keeping plant cells turgid and functioning normally. When water is in short supply, stomata often close to reduce water loss, which also blocks the entry of carbon dioxide — so a shortage of water slows down or can completely stop photosynthesis, even if light and CO₂ would otherwise be sufficient.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-4">
          <RevealCard delay={0}>
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/60 p-5 shadow-sm">
              <h3 className="mb-2 text-base font-bold text-blue-700">The Equation</h3>
              <p className="text-sm text-slate-700 font-semibold">CO₂ + H₂O → C₆H₁₂O₆ + O₂</p>
              <p className="text-xs text-slate-600 mt-1">Only proceeds when light energy and chlorophyll are both present.</p>
            </div>
          </RevealCard>

          <RevealCard delay={100}>
            <div className="rounded-2xl border-2 border-green-200 bg-green-50/60 p-5 shadow-sm">
              <h3 className="mb-2 text-base font-bold text-green-700">Where & How</h3>
              <ul className="space-y-1 text-sm text-slate-700 list-disc list-inside">
                <li>Happens mainly in palisade mesophyll cells</li>
                <li>Chlorophyll in chloroplasts traps the light energy</li>
                <li>Light energy is converted into chemical energy</li>
              </ul>
            </div>
          </RevealCard>

          <RevealCard delay={200}>
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-5 shadow-sm">
              <h3 className="mb-2 text-base font-bold text-amber-700">What's Produced</h3>
              <ul className="space-y-1 text-sm text-slate-700 list-disc list-inside">
                <li>Glucose is stored as starch, or used for growth and respiration</li>
                <li>Oxygen is released as a by-product through the stomata</li>
              </ul>
            </div>
          </RevealCard>

          <RevealCard delay={300}>
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-5 shadow-sm">
              <h3 className="mb-2 text-base font-bold text-violet-700">Transport Reminder</h3>
              <ul className="space-y-1 text-sm text-slate-700 list-disc list-inside">
                <li><strong>Xylem:</strong> carries water and minerals up to the leaf</li>
                <li><strong>Phloem:</strong> carries glucose away to the rest of the plant</li>
              </ul>
            </div>
          </RevealCard>

          <RevealCard delay={400}>
            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-5 shadow-sm">
              <h3 className="mb-2 text-base font-bold text-rose-700">Exam Tip</h3>
              <p className="text-sm text-slate-700">If asked what a plant needs for photosynthesis, always list <strong>all four</strong>: carbon dioxide, water, light, and chlorophyll — leaving one out loses marks.</p>
            </div>
          </RevealCard>
        </aside>
      </div>
    ),
  },
  {
    id: 'nutrition-animals',
    title: 'Animal Nutrition',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Unlike plants, animals cannot manufacture their own food — they must obtain ready-made organic substances by feeding on other organisms. This is called <strong>heterotrophic nutrition</strong>, and animals that feed this way are known as <strong>consumers</strong>. The organ system responsible for processing food in the body is called the <strong>alimentary system</strong> (or digestive system), and it works through four connected stages:
            </p>
            <ul className="list-disc list-inside text-lg text-slate-700 mt-3 space-y-2">
              <li><strong>Ingestion:</strong> Taking food into the body through the mouth.</li>
              <li><strong>Digestion:</strong> Breaking food down into smaller, soluble molecules that the body can absorb. This happens in two ways — <strong>mechanically</strong>, through physical actions like chewing and churning, and <strong>chemically</strong>, through the action of enzymes.</li>
              <li><strong>Absorption:</strong> The digested, soluble food molecules pass through the wall of the intestine into the bloodstream, so they can be transported and used by body cells.</li>
              <li><strong>Egestion:</strong> Removing the undigested waste material (faeces) from the body through the anus.</li>
            </ul>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              These four stages happen in sequence as food travels through the alimentary canal — a long tube running from the mouth to the anus, made up of several specialised organs, each adapted for a particular part of the process.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Digestive System Parts</h4>
            <PlaceholderImage placeholder="{digestive_system}" alt="Labelled human digestive system" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <table className="w-full text-sm text-slate-700 border-collapse mt-3">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">What happens there</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Mouth</td>
                  <td className="border p-2">Ingestion of food; teeth mechanically break it down by chewing; salivary glands release saliva containing the enzyme <strong>amylase</strong>, which begins breaking down starch into maltose.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Oesophagus</td>
                  <td className="border p-2">A muscular tube connecting the mouth to the stomach; food is pushed along by wave-like muscle contractions called <strong>peristalsis</strong>.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Stomach</td>
                  <td className="border p-2">Produces gastric juice containing <strong>pepsin</strong> (digests proteins) and <strong>renin</strong> (curdles milk proteins in young mammals), along with hydrochloric acid (HCl) which kills bacteria and provides the acidic conditions pepsin needs to work.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Duodenum</td>
                  <td className="border p-2">Receives <strong>bile</strong> from the liver (stored in the gall bladder), which emulsifies fats into smaller droplets, and digestive enzymes from the <strong>pancreas</strong> that break down carbohydrates, proteins, and fats further.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Ileum (small intestine)</td>
                  <td className="border p-2">The main site of <strong>absorption</strong>; its inner wall is covered in finger-like projections called <strong>villi</strong>, which greatly increase surface area so digested nutrients can pass efficiently into the bloodstream.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Colon (large intestine)</td>
                  <td className="border p-2">Absorbs excess water from the remaining undigested material, gradually turning it from liquid waste into semi-solid faeces.</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Rectum/Anus</td>
                  <td className="border p-2">The rectum stores faeces temporarily before <strong>egestion</strong> — the removal of undigested waste from the body through the anus.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Types of Digestion</h4>
            <p className="text-sm text-slate-700 mb-3">
              Digestion is the process of breaking large, insoluble food molecules into smaller, soluble ones that can be absorbed into the bloodstream. This breakdown happens in two distinct but complementary ways, working together at different points along the alimentary canal.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>Mechanical digestion</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              This is the <strong>physical</strong> breakdown of food into smaller pieces, without changing its chemical composition. It increases the surface area of the food, which makes chemical digestion (below) much faster and more effective afterward. Examples include the cutting and grinding action of the teeth while chewing in the mouth, and the churning, mixing action of the stomach muscles that turns food into a semi-liquid mixture called chyme.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>Chemical digestion</strong></p>
            <p className="text-sm text-slate-700">
              This is the breakdown of food using <strong>enzymes</strong> — biological catalysts that speed up the splitting of large molecules into smaller, soluble ones through chemical reactions. For example, amylase breaks down starch into maltose, pepsin breaks down proteins into shorter chains of amino acids, and lipase breaks down fats into fatty acids and glycerol. Unlike mechanical digestion, chemical digestion actually changes the food into entirely new, absorbable substances.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Teeth and Dental Health</h4>
            <p className="text-sm text-slate-700 mb-3">
              Teeth are hard structures embedded in the jaw that carry out the first stage of mechanical digestion. Humans have different types of teeth, each shaped for a specific job, and together they make chewing far more effective than a single uniform tooth type would allow. Humans are <strong>diphyodont</strong> (they grow two sets of teeth in a lifetime — milk teeth, then permanent teeth) and <strong>heterodont</strong> (they have differently shaped teeth for different functions).
            </p>

            <div className="mt-2">
              <PlaceholderImage placeholder="{teeth_in_mouth_labeled}" alt="Open mouth showing labeled teeth types" className="w-full rounded-xl border border-slate-200 bg-white object-contain" />
              <p className="text-xs text-slate-500 mt-1 text-center">Open mouth showing the arrangement and position of each tooth type</p>
            </div>

            <table className="w-full text-sm text-slate-700 border-collapse mt-4">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Tooth type</th>
                  <th className="border p-2 text-left">Shape</th>
                  <th className="border p-2 text-left">Position</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Incisors</td>
                  <td className="border p-2">Flat, chisel-shaped with a sharp thin edge</td>
                  <td className="border p-2">At the front of the mouth, top and bottom</td>
                  <td className="border p-2">Cutting and biting off pieces of food</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Canines</td>
                  <td className="border p-2">Pointed and cone-shaped</td>
                  <td className="border p-2">Just behind the incisors, at the "corners" of the mouth</td>
                  <td className="border p-2">Tearing and gripping tougher food</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Premolars</td>
                  <td className="border p-2">Broad with two ridges (cusps) on the biting surface</td>
                  <td className="border p-2">Behind the canines</td>
                  <td className="border p-2">Crushing and grinding food into smaller pieces</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Molars</td>
                  <td className="border p-2">Large and broad with several cusps</td>
                  <td className="border p-2">At the back of the mouth</td>
                  <td className="border p-2">Grinding and chewing food thoroughly before swallowing</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-4">
              <PlaceholderImage placeholder="{teeth_individual_types}" alt="Each tooth type shown individually" className="w-full rounded-xl border border-slate-200 bg-white object-contain" />
              <p className="text-xs text-slate-500 mt-1 text-center">Each tooth type shown individually, side by side, for comparison</p>
            </div>

            <p className="text-sm font-semibold text-slate-800 mt-4 mb-1">Tooth structure</p>
            <p className="text-sm text-slate-700 mb-3">
              Each tooth has three main parts: the <strong>enamel</strong> (a hard, white outer layer that protects the tooth — the hardest substance in the body), the <strong>dentine</strong> (a bone-like layer beneath the enamel), and the <strong>pulp cavity</strong> (the innermost part, containing nerves and blood vessels that keep the tooth alive and sensitive to pain or temperature).
            </p>

            <p className="text-sm font-semibold text-slate-800 mb-1">Tooth decay</p>
            <p className="text-sm text-slate-700 mb-3">
              Tooth decay begins when bacteria naturally present in the mouth feed on sugar left on the teeth (especially after eating sugary foods) and produce acid as a waste product. This acid gradually dissolves the enamel, creating a small hole or cavity. If left untreated, the decay can spread through the dentine and reach the pulp cavity, causing pain, infection, and potentially loss of the tooth.
            </p>

            <p className="text-sm font-semibold text-slate-800 mb-1">Prevention and care</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>Brushing regularly:</strong> Removes food particles and plaque (a sticky bacterial film) before bacteria can produce acid.</li>
              <li><strong>Reducing sugary foods and drinks:</strong> Less sugar means less fuel for decay-causing bacteria.</li>
              <li><strong>Using fluoride toothpaste:</strong> Fluoride strengthens enamel and makes it more resistant to acid attack.</li>
              <li><strong>Regular dental check-ups:</strong> Allows a dentist to catch and treat decay early, before it becomes serious.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Food Tests</h4>
            <p className="text-sm text-slate-700 mb-3">
              Food tests are simple chemical procedures used to identify which nutrients are present in a food sample. Each test relies on a specific reagent that changes colour when it reacts with a particular type of nutrient, allowing us to detect starch, sugar, protein, or fat without needing to know the food's ingredients in advance.
            </p>

            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Food type</th>
                  <th className="border p-2 text-left">Test / reagent</th>
                  <th className="border p-2 text-left">Procedure</th>
                  <th className="border p-2 text-left">Positive result</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Starch</td>
                  <td className="border p-2">Iodine solution</td>
                  <td className="border p-2">Add a few drops of iodine solution directly to the food sample at room temperature — no heating needed</td>
                  <td className="border p-2">Turns <strong>blue-black</strong> if starch is present; stays browny-orange if absent</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Reducing sugar (e.g. glucose)</td>
                  <td className="border p-2">Benedict's solution</td>
                  <td className="border p-2">Add Benedict's solution to the sample, then heat in a hot water bath for a few minutes</td>
                  <td className="border p-2">Solution changes from blue → green → yellow → <strong>brick red</strong> as sugar concentration increases; stays blue if absent</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Protein</td>
                  <td className="border p-2">Biuret solution (or Biuret reagent: sodium hydroxide + copper sulfate)</td>
                  <td className="border p-2">Add sodium hydroxide solution, then a few drops of dilute copper sulfate solution, and mix — no heating needed</td>
                  <td className="border p-2">Turns from blue to <strong>purple/lilac</strong> if protein is present; stays blue if absent</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Fats/lipids</td>
                  <td className="border p-2">Ethanol emulsion test</td>
                  <td className="border p-2">Shake the sample with ethanol until dissolved, then pour the mixture into water in a separate test tube</td>
                  <td className="border p-2">A cloudy white <strong>emulsion</strong> forms if fat is present; the mixture stays clear if absent</td>
                </tr>
              </tbody>
            </table>

            <PlaceholderImage placeholder="{food_tests_results}" alt="Food test tubes showing color change results" className="mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Digestion Summary</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Mouth → oesophagus → stomach → duodenum → ileum → colon → rectum</li>
              <li>Enzymes break down food</li>
              <li>Villi absorb nutrients</li>
              <li>Liver produces bile</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'respiration',
    title: 'Respiratory System',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Respiration</strong> is often confused with breathing, but the two are different processes. <strong>Breathing (ventilation)</strong> is the physical, mechanical movement of air into and out of the lungs. <strong>Respiration</strong> is the chemical process happening inside every living cell, where glucose is broken down to release energy — this is more precisely called <strong>cellular respiration</strong>.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              The job of the <strong>respiratory system</strong> is to bring oxygen into the body and remove carbon dioxide, so that cellular respiration can keep happening. This exchange of gases between the air and the blood is called <strong>gaseous exchange</strong>, and it takes place across a thin, moist surface with a large surface area — in humans, this is the <strong>alveoli</strong> of the lungs.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              In simple terms: air travels down the trachea, into the bronchi, then into smaller bronchioles, finally reaching the alveoli — tiny air sacs surrounded by blood capillaries — where oxygen diffuses into the blood and carbon dioxide diffuses out to be exhaled.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Respiratory System</h4>
            <img src={scienceImages.respiratorySystem} alt="Labelled human respiratory system" loading="lazy" decoding="async" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Inhaled vs Exhaled Air</h4>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr><th className="border p-2">Component</th><th className="border p-2">Inhaled</th><th className="border p-2">Exhaled</th></tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Oxygen</td><td className="border p-2">21%</td><td className="border p-2">16%</td></tr>
                <tr><td className="border p-2">CO₂</td><td className="border p-2">0.03%</td><td className="border p-2">4.1%</td></tr>
                <tr><td className="border p-2">Water vapour</td><td className="border p-2">Small</td><td className="border p-2">Large</td></tr>
                <tr><td className="border p-2">Temperature</td><td className="border p-2">Lower</td><td className="border p-2">Higher</td></tr>
                <tr><td className="border p-2">Nitrogen</td><td className="border p-2">78%</td><td className="border p-2">78%</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Alveoli (Air Sacs)</h4>
            <p className="text-sm text-slate-700 mb-3">
              At the very end of the smallest bronchioles are millions of tiny, thin-walled sacs called <strong>alveoli</strong> (singular: alveolus). These are the actual site of gaseous exchange in the lungs — every breath ultimately delivers air to these microscopic sacs, where oxygen crosses into the blood and carbon dioxide crosses out. Each alveolus is surrounded by a dense network of tiny blood vessels called <strong>capillaries</strong>, which carry blood close enough for gases to diffuse rapidly between the air and the bloodstream.
            </p>
            <div className="mt-2">
              <PlaceholderImage placeholder="{alveoli_diagram}" alt="Alveoli air sacs diagram" className="w-full rounded-xl border border-slate-200 bg-white object-contain" />
            </div>
            <p className="text-sm font-semibold text-slate-800 mt-4 mb-1">Adaptations of the alveoli for efficient gas exchange</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>Millions of alveoli:</strong> Their huge number gives the lungs an enormous total surface area (roughly the size of a tennis court in an adult human), allowing much more gas exchange to happen at once than a single large sac ever could.</li>
              <li><strong>Very thin walls (one cell thick):</strong> This means gases only have a very short distance to diffuse across, so exchange happens quickly.</li>
              <li><strong>Moist inner lining:</strong> Gases dissolve in this thin film of moisture before diffusing across the wall, which speeds up the process.</li>
              <li><strong>Rich capillary network:</strong> A dense mesh of capillaries surrounds each alveolus, maintaining a steep concentration gradient by constantly bringing in oxygen-poor blood and carrying away oxygen-rich blood.</li>
              <li><strong>Good ventilation:</strong> Constant breathing movements keep fresh air flowing in and out, maintaining a high concentration of oxygen and a low concentration of carbon dioxide inside the alveoli at all times.</li>
            </ul>
          </div>

          <div className="p-4 bg-sky-50/50 rounded-xl border-2 border-sky-200 shadow-sm">
            <h4 className="font-bold text-sky-700 text-lg mb-1">Experiment 6: Comparing Inhaled and Exhaled Air (Lime Water Test)</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Aim:</strong> To compare the amount of carbon dioxide in inhaled air versus exhaled air.</p>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Two test tubes, two delivery tubes (one straight, one Y-shaped or two separate setups), lime water, a beaker, a drinking straw or mouthpiece.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Set up two separate test tubes, each containing a small, equal amount of clear lime water.</p>
                <PlaceholderImage placeholder="{limewater_step1}" alt="Two test tubes with clear lime water" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Using a tube connected to a pump (or simply blowing through a straw), gently bubble ordinary air through the lime water in the first test tube.</p>
                <PlaceholderImage placeholder="{limewater_step2}" alt="Bubbling ordinary air through first tube of lime water" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Using a straw, breathe out (exhale) gently and steadily through the lime water in the second test tube.</p>
                <PlaceholderImage placeholder="{limewater_step3}" alt="Exhaling through straw into second tube of lime water" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Compare the appearance of the lime water in both test tubes side by side.</p>
                <PlaceholderImage placeholder="{limewater_step4}" alt="Comparing both test tubes side by side" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Results:</strong> The lime water into which ordinary air was blown stays largely clear, or turns only slightly cloudy after a long time. The lime water into which exhaled breath was blown quickly turns <strong>milky/cloudy</strong>.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Exhaled air contains a much higher concentration of carbon dioxide than inhaled (atmospheric) air, since lime water is a standard test that turns milky in the presence of CO₂.</p>
            <DoExperimentButton href={experimentRoutes.inhaledExhaledAir} />
          </div>

          <div className="p-4 bg-teal-50/50 rounded-xl border-2 border-teal-200 shadow-sm">
            <h4 className="font-bold text-teal-700 text-lg mb-1">Experiment 7: Comparing Oxygen Content Using a Candle</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Aim:</strong> To show that exhaled air contains less oxygen than inhaled (atmospheric) air.</p>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Two identical glass jars, two small candles fixed to jar lids, matches, a large plastic bag or bladder to collect exhaled air, a stopwatch.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Collect a sample of exhaled air by breathing into a large plastic bag or bladder several times.</p>
                <PlaceholderImage placeholder="{candle_step1}" alt="Collecting exhaled air in a plastic bag" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Light one candle and lower it into a jar filled with ordinary (atmospheric) air, then seal the jar with its lid.</p>
                <PlaceholderImage placeholder="{candle_step2}" alt="Lit candle lowered into jar of ordinary air" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Light the second candle and lower it into a separate jar filled instead with the collected exhaled air, then seal it the same way.</p>
                <PlaceholderImage placeholder="{candle_step3}" alt="Lit candle lowered into jar of exhaled air" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Start the stopwatch for both jars at the same time and time how long each candle continues to burn before going out.</p>
                <PlaceholderImage placeholder="{candle_step4}" alt="Timing how long each candle burns" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Results:</strong> The candle in the jar of ordinary air burns for noticeably longer before going out. The candle in the jar of exhaled air goes out much more quickly.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Exhaled air contains less oxygen than atmospheric air, since a flame needs oxygen to keep burning and runs out sooner in air with less of it available.</p>
            <DoExperimentButton href={experimentRoutes.candleOxygen} />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Respiration Facts</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Inhaled: more O₂, less CO₂</li>
              <li>Exhaled: less O₂, more CO₂</li>
              <li>Alveoli – gas exchange</li>
              <li>Lime water – CO₂ indicator</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'transport',
    title: 'Transport Systems',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Transport</strong> is the movement of essential substances — such as water, nutrients, gases, and waste products — from where they are absorbed or produced to where they are needed or removed within an organism. As organisms become larger and more complex, the distance between where a substance enters the body and where it's actually needed becomes too great for simple diffusion alone, so specialised transport systems evolve to move materials efficiently.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              In <strong>plants</strong>, this is achieved partly through <strong>transpiration</strong> — the continuous loss of water vapour from the leaves and stems through the stomata. This constant water loss at the top of the plant creates a "pull" that draws more water up from the roots through the xylem, in what's called the transpiration stream, helping distribute water and dissolved minerals throughout the plant.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              In <strong>animals</strong>, transport is carried out by the <strong>blood circulatory system</strong> — a network of the heart, blood, and blood vessels that continuously pumps blood around the body. This system carries oxygen, digested food, hormones, and waste products to and from every cell, and works together with the heart acting as a pump to keep blood moving under pressure.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Transpiration in Plants</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Transpiration</strong> is the loss of water vapour from the aerial parts of a plant — mainly the leaves, but also the stem — into the atmosphere. Water evaporates from the moist cell walls inside the leaf (mainly the spongy mesophyll layer), and the resulting water vapour then diffuses out through tiny pores called <strong>stomata</strong> into the surrounding air, since the air inside the leaf is usually more humid than the air outside.
            </p>
            <img src={scienceImages.transpirationInPlants} alt="Transpiration in plants" loading="lazy" decoding="async" className="mb-4 mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-sm font-semibold text-slate-800 mb-1">Why transpiration matters</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Water and mineral uptake:</strong> As water is lost from the leaves, it creates a "pull" (tension) that draws more water up through the xylem from the roots — this continuous upward movement is called the <strong>transpiration stream</strong>, and it's the main way water and dissolved mineral salts reach the rest of the plant.</li>
              <li><strong>Cooling effect:</strong> As water evaporates from the leaf surface, it absorbs heat energy in the process, helping to cool the leaf and prevent it from overheating in direct sunlight.</li>
              <li><strong>Maintaining turgidity:</strong> The upward flow of water keeps plant cells firm and supported (turgid), which helps the plant stay upright and rigid.</li>
            </ul>

            <p className="text-sm font-semibold text-slate-800 mb-1">Factors affecting the rate of transpiration</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Temperature:</strong> Higher temperatures give water molecules more energy, increasing the rate of evaporation and diffusion out of the stomata.</li>
              <li><strong>Humidity:</strong> When the surrounding air is already humid (high in water vapour), the diffusion gradient between the leaf and the air is smaller, so transpiration slows down. Dry air increases the rate.</li>
              <li><strong>Light intensity:</strong> Brighter light causes stomata to open wider (since they need to be open for photosynthesis to take in CO₂), which allows more water vapour to escape.</li>
              <li><strong>Wind/air movement:</strong> Moving air quickly carries away water vapour that has just diffused out of the leaf, maintaining a steep diffusion gradient and speeding up transpiration. Still air lets vapour build up around the leaf, slowing the rate.</li>
              <li><strong>Surface area:</strong> Leaves with a larger surface area (or more leaves overall) have more stomata exposed to the air, allowing more water vapour to be lost overall.</li>
            </ul>

            <p className="text-sm font-semibold text-slate-800 mb-1">Measuring transpiration: the potometer</p>
            <p className="text-sm text-slate-700 mb-2">
              A <strong>potometer</strong> is a piece of apparatus used to measure the rate of water uptake by a leafy shoot, which is used as an estimate for the rate of transpiration (since most of the water taken up is eventually lost through transpiration). A leafy shoot is sealed into a tube connected to a graduated capillary tube containing an air bubble; as the plant takes up water, the bubble moves along the scale, and the distance it travels over a set time gives the rate of water uptake.
            </p>
            <PlaceholderImage placeholder="{potometer}" alt="Potometer apparatus setup" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Osmosis and Turgidity</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Osmosis</strong> is the movement of water molecules from a region of higher water concentration (a dilute solution) to a region of lower water concentration (a concentrated solution), through a partially permeable membrane, until the concentration on both sides becomes equal. This process is how plant cells absorb water from the soil and from neighbouring cells, since the cell membrane and cell wall together act as a partially permeable barrier that lets water through but restricts larger dissolved molecules.
            </p>
            <PlaceholderImage placeholder="{osmosis_diagram}" alt="Osmosis across a partially permeable membrane" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-sm font-semibold text-slate-800 mt-4 mb-1">Turgid cells</p>
            <p className="text-sm text-slate-700 mb-3">
              When a plant cell is placed in a dilute solution (or pure water), water moves into the cell by osmosis. The cell swells as its vacuole fills with water, pushing the cytoplasm and cell membrane outward against the rigid cell wall. The cell wall resists further expansion and prevents the cell from bursting, so the cell becomes firm and swollen — this state is called <strong>turgid</strong>. Turgidity is what keeps non-woody plant parts (like leaves and young stems) upright and rigid; without it, plants would wilt even with plenty of water in their tissues.
            </p>

            <p className="text-sm font-semibold text-slate-800 mb-1">Plasmolysed cells</p>
            <p className="text-sm text-slate-700 mb-3">
              When a plant cell is instead placed in a concentrated solution, water moves out of the cell by osmosis. The cytoplasm shrinks and pulls away from the cell wall as the vacuole loses water, and the cell becomes soft and floppy — this state is called <strong>flaccid</strong>. If enough water is lost, the cell membrane and cytoplasm pull away completely from the cell wall, a condition called <strong>plasmolysis</strong>. Plasmolysed cells lose their rigidity, which is why plants wilt when they don't get enough water, or when exposed to very salty or concentrated conditions (such as over-fertilised soil).
            </p>
            <PlaceholderImage placeholder="{turgid_vs_plasmolysed_cells}" alt="Comparison of turgid and plasmolysed plant cells" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Blood Components</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Plasma:</strong> Liquid part – transports nutrients, wastes, hormones.</li>
              <li><strong>Red blood cells:</strong> Carry oxygen (haemoglobin), no nucleus.</li>
              <li><strong>White blood cells:</strong> Fight infection (phagocytes, lymphocytes).</li>
              <li><strong>Platelets:</strong> Blood clotting.</li>
            </ul>
            <PlaceholderImage placeholder="{blood_cells}" alt="Blood cells" />
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Blood Vessels</h4>
            <p className="text-sm text-slate-700 mb-3">
              Blood is transported around the body through three main types of blood vessels, each structurally adapted to the particular job it does. Blood travels from the heart through arteries, into progressively smaller vessels, across capillary beds where exchange happens, and then back to the heart through veins.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>Arteries</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              Arteries carry blood <strong>away from the heart</strong>, usually oxygenated blood at high pressure (the pulmonary artery, carrying deoxygenated blood to the lungs, is the main exception). Because blood leaves the heart in surges with each heartbeat, arteries have <strong>thick, muscular, and elastic walls</strong> that can withstand this high pressure and stretch slightly with each pulse, then recoil to help push blood onward. Their lumen (inner channel) is relatively narrow compared to their wall thickness.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>Veins</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              Veins carry blood <strong>back toward the heart</strong>, usually deoxygenated blood at low pressure (again, the pulmonary vein is the exception, carrying oxygenated blood from the lungs). Since blood pressure has dropped significantly by the time it reaches the veins, they have <strong>thinner walls</strong> than arteries, and a wider lumen to allow blood to flow easily despite the low pressure. Many veins, especially in the limbs, contain <strong>valves</strong> that prevent blood from flowing backward, since the low pressure alone isn't enough to keep blood moving upward against gravity — surrounding muscle contractions help push blood along instead.
            </p>

            <p className="text-sm text-slate-700 mb-1"><strong>Capillaries</strong></p>
            <p className="text-sm text-slate-700 mb-3">
              Capillaries are the smallest blood vessels, connecting the smallest arteries (arterioles) to the smallest veins (venules). Their walls are only <strong>one cell thick</strong>, which allows oxygen, nutrients, carbon dioxide, and waste products to diffuse easily between the blood and body tissues. Capillaries form dense, branching networks that reach almost every cell in the body, giving a very large surface area for this exchange to happen efficiently.
            </p>

            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Vessel</th>
                  <th className="border p-2 text-left">Direction of blood flow</th>
                  <th className="border p-2 text-left">Key structural features</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Artery</td>
                  <td className="border p-2">Away from the heart</td>
                  <td className="border p-2">Thick, muscular, elastic walls; narrow lumen; withstands high pressure</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vein</td>
                  <td className="border p-2">Toward the heart</td>
                  <td className="border p-2">Thin walls; wide lumen; contains valves to prevent backflow</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Capillary</td>
                  <td className="border p-2">Connects arteries to veins</td>
                  <td className="border p-2">Walls one cell thick; permeable; large surface area for diffusion</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <figure>
                <img src={scienceImages.arteryCrossSection} alt="Artery cross-section" loading="lazy" decoding="async" className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
                <figcaption className="mt-2 text-center text-xs font-semibold text-slate-600">Artery</figcaption>
              </figure>
              <figure>
                <img src={scienceImages.veinCrossSection} alt="Vein cross-section" loading="lazy" decoding="async" className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
                <figcaption className="mt-2 text-center text-xs font-semibold text-slate-600">Vein</figcaption>
              </figure>
              <figure>
                <img src={scienceImages.capillaryCrossSection} alt="Capillary cross-section" loading="lazy" decoding="async" className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
                <figcaption className="mt-2 text-center text-xs font-semibold text-slate-600">Capillary</figcaption>
              </figure>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Transport Quick Guide</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Transpiration = water loss</li>
              <li>Osmosis = water movement</li>
              <li>Arteries – away, Veins – towards</li>
              <li>Capillaries – exchange</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'plant-reproduction',
    title: 'Plant Reproduction',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Reproduction</strong> is the process by which organisms produce offspring of their own kind, ensuring the continuation of a species from one generation to the next. Flowering plants are able to reproduce in two fundamentally different ways: <strong>sexual reproduction</strong> and <strong>asexual reproduction</strong>, and most plants are capable of both depending on the conditions they face.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              <strong>Sexual reproduction</strong> involves the fusion of a male gamete (contained in pollen) with a female gamete (contained in the ovule), a process called <strong>fertilisation</strong>. Because the offspring inherit genetic material from two parent plants, sexual reproduction produces <strong>genetic variation</strong> — offspring that are genetically different from their parents and from each other. This variation is valuable because it gives a population a better chance of containing individuals suited to survive if the environment changes, or if a new disease or pest appears. The flower is the structure responsible for sexual reproduction in flowering plants (angiosperms), and it exists specifically to bring together male and female gametes, whether by attracting pollinating animals or by releasing pollen into the wind.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              <strong>Asexual (vegetative) reproduction</strong>, by contrast, does not involve gametes or fertilisation at all. A new plant grows directly from part of the parent plant — such as a bulb, tuber, runner, or cutting — and is therefore <strong>genetically identical</strong> to the parent (a clone). This method has the advantage of being fast and reliable, since it doesn't depend on pollination, weather, or the presence of pollinators, but it produces no genetic variation, meaning an entire population can be equally vulnerable to the same disease or environmental change.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Flower Structure</h4>
            <p className="text-sm text-slate-700 mt-2 mb-3">
              The <strong>flower</strong> is the reproductive structure of a flowering plant, and its parts are organised into two functional groups. The <strong>non-reproductive (accessory) parts</strong> — the petals, sepals, and receptacle — protect the flower and, where relevant, attract pollinators; they play no direct part in producing gametes. The <strong>reproductive parts</strong> are divided further into the <strong>male part</strong> (the <strong>stamen</strong>, made up of the anther and filament, which produces pollen) and the <strong>female part</strong> (the <strong>pistil</strong> or <strong>carpel</strong>, made up of the stigma, style, and ovary, which produces the ovules). Most flowers carry several stamens arranged around a central pistil, so that pollen released nearby has the best chance of reaching the stigma.
            </p>
            <img src={scienceImages.flowerStructure} alt="Labelled flower structure diagram" loading="lazy" decoding="async" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <table className="w-full text-sm text-slate-700 border-collapse mt-4">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Group</th>
                  <th className="border p-2 text-left">Structure</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Petal</td>
                  <td className="border p-2">Accessory</td>
                  <td className="border p-2">Broad, often brightly coloured and scented; arranged in a ring just inside the sepals</td>
                  <td className="border p-2">Attracts pollinating insects and other animals with colour, scent, and often nectar; wind-pollinated flowers usually have small, dull petals or lack them entirely</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Sepal</td>
                  <td className="border p-2">Accessory</td>
                  <td className="border p-2">Small, tough, often green leaf-like structures forming the outermost ring of the flower</td>
                  <td className="border p-2">Encloses and protects the developing flower while it is still a bud, before it opens</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Receptacle</td>
                  <td className="border p-2">Accessory</td>
                  <td className="border p-2">The swollen tip of the flower stalk where all other flower parts are attached</td>
                  <td className="border p-2">Supports and anchors the petals, sepals, stamens, and pistil</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Anther</td>
                  <td className="border p-2">Male (stamen)</td>
                  <td className="border p-2">A small sac-like structure at the tip of the filament</td>
                  <td className="border p-2">Produces and releases pollen grains, which contain the male gametes</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Filament</td>
                  <td className="border p-2">Male (stamen)</td>
                  <td className="border p-2">A thin stalk supporting the anther</td>
                  <td className="border p-2">Holds the anther in a position where pollen can be picked up by pollinators or carried by wind</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Stigma</td>
                  <td className="border p-2">Female (pistil)</td>
                  <td className="border p-2">A sticky or feathery surface at the top of the style</td>
                  <td className="border p-2">Traps and holds pollen grains that land on it, allowing pollination to occur</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Style</td>
                  <td className="border p-2">Female (pistil)</td>
                  <td className="border p-2">A slender stalk connecting the stigma to the ovary</td>
                  <td className="border p-2">Provides a pathway for the pollen tube to grow down from the stigma to reach the ovule inside the ovary</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Ovary</td>
                  <td className="border p-2">Female (pistil)</td>
                  <td className="border p-2">A rounded structure at the base of the pistil, containing one or more ovules</td>
                  <td className="border p-2">Houses the ovules (each containing a female gamete); after fertilisation, the ovary develops into a fruit while the ovules become seeds</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Pollination</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Pollination</strong> is the transfer of pollen grains from the anther of a stamen to the stigma of a pistil. It is a necessary first step before fertilisation can happen, since the male gamete inside the pollen grain must reach the female gamete inside the ovule, and pollination is what brings the pollen close enough for that journey to begin. Pollination itself is <strong>not</strong> fertilisation — it is only the delivery of the pollen; fertilisation is the actual fusion of the male and female gametes that follows once the pollen tube has grown down through the style into the ovary.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Self-pollination</p>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Self-pollination</strong> occurs when pollen from the anther of a flower lands on the stigma of the <strong>same flower</strong>, or on another flower on the <strong>same plant</strong>. Because both gametes come from the same parent, the offspring produced are genetically very similar to the parent plant, meaning little to no genetic variation is introduced. This can be an advantage in a stable environment, since a plant that is already well-suited to its conditions will produce offspring just as well-suited, and self-pollination doesn't depend on the presence of pollinators or wind to succeed — useful for plants growing in isolation.
            </p>
            <img src={scienceImages.selfPollination} alt="Diagram of self-pollination showing pollen transfer within the same flower" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-base font-bold text-slate-800 mb-1">Cross-pollination</p>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Cross-pollination</strong> occurs when pollen from the anther of a flower on one plant is transferred to the stigma of a flower on a <strong>different plant</strong> of the <strong>same species</strong>. Because the two gametes come from genetically different parents, cross-pollination produces offspring with greater <strong>genetic variation</strong>. This variation is important for a species' long-term survival, since a genetically varied population is more likely to include individuals able to cope with disease, pests, or a changing environment — whereas a population produced entirely by self-pollination is more genetically uniform and can be wiped out more easily by a single threat.
            </p>
            <img src={scienceImages.crossPollination} alt="Diagram of cross-pollination showing pollen transfer between flowers on different plants" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-sm font-semibold text-slate-800 mb-1">Agents of pollination</p>
            <p className="text-sm text-slate-700 mb-2">
              Since pollen cannot move on its own, plants rely on an external <strong>agent</strong> to carry it from anther to stigma. The two main agents are insects (or other animals) and wind, and flowers pollinated by each are structurally adapted in very different ways to suit their particular agent.
            </p>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">Insect-pollinated flowers</th>
                  <th className="border p-2 text-left">Wind-pollinated flowers</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Petals</td>
                  <td className="border p-2">Large, brightly coloured, and often scented to attract insects from a distance</td>
                  <td className="border p-2">Small, dull, or absent entirely, since there is no need to attract anything</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Nectar</td>
                  <td className="border p-2">Usually present, rewarding insects for visiting and encouraging repeat visits</td>
                  <td className="border p-2">Absent, since wind cannot be rewarded or attracted</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pollen</td>
                  <td className="border p-2">Produced in smaller quantities; grains are often sticky or spiky so they cling to an insect's body</td>
                  <td className="border p-2">Produced in very large quantities, since most pollen released into the air never reaches another flower; grains are small, light, and smooth to stay airborne</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Anthers</td>
                  <td className="border p-2">Firmly fixed inside the flower, positioned so a visiting insect brushes against them</td>
                  <td className="border p-2">Loosely attached and often dangling outside the flower, so pollen is easily shaken loose by the wind</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Stigma</td>
                  <td className="border p-2">Small and often sticky, positioned inside the flower where a visiting insect will contact it</td>
                  <td className="border p-2">Large, feathery, and hanging outside the flower, providing a bigger surface area to catch drifting pollen</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Fertilisation and Germination</h4>

            <p className="text-base font-bold text-slate-800 mb-1">Fertilisation</p>
            <p className="text-sm text-slate-700 mb-3">
              Once a pollen grain lands on a compatible stigma, it does not yet contain a route to the ovule — it must grow one. The pollen grain absorbs moisture from the stigma and germinates, producing a thin <strong>pollen tube</strong> that grows down through the tissue of the style toward the ovary. The male gamete (nucleus) travels down inside this pollen tube. When the tube reaches an ovule inside the ovary, it penetrates the ovule and releases the male gamete, which fuses with the female gamete (egg cell) contained inside. This fusion of male and female gametes is called <strong>fertilisation</strong>, and it produces a single fertilised cell called a <strong>zygote</strong>, which contains a full set of genetic material combining both parents.
            </p>
            <img src={scienceImages.fertilisationProcess} alt="Diagram of pollen tube growth and fertilisation inside the ovary" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-base font-bold text-slate-800 mb-1">What happens after fertilisation</p>
            <p className="text-sm text-slate-700 mb-3">
              Fertilisation triggers a series of changes throughout the flower, converting its structures from reproductive organs into the structures needed to protect and disperse the next generation. The zygote divides repeatedly by cell division and develops into an <strong>embryo</strong> — a tiny, undeveloped plant. The <strong>ovule</strong> containing this embryo develops a tough protective coat and becomes a <strong>seed</strong>, which also stores a food supply for the embryo to use once it starts growing. Meanwhile, the <strong>ovary wall</strong> surrounding the ovules thickens and develops into a <strong>fruit</strong>, which protects the seeds as they mature and, in many species, later helps disperse them (for example, by attracting animals to eat the fruit and spread the seeds, or by aiding wind or water dispersal). At the same time, since they are no longer needed, the petals, sepals, stamens, stigma, and style typically wither and fall away.
            </p>
            <img src={scienceImages.seedAndFruitFormation} alt="Diagram showing ovule developing into a seed and ovary developing into a fruit" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-base font-bold text-slate-800 mb-1">Germination</p>
            <p className="text-sm text-slate-700 mb-3">
              A mature seed does not grow immediately — it usually enters a resting stage called <strong>dormancy</strong>, during which its metabolism slows dramatically and it can survive for long periods, sometimes years, waiting for the right conditions to arrive. <strong>Germination</strong> is the process by which a dormant seed resumes growth and develops into a young seedling. For germination to begin, three conditions must generally be met at the same time:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Water:</strong> Softens the tough seed coat so it can rupture, and rehydrates the cells inside so metabolic reactions (including enzyme activity) can restart.</li>
              <li><strong>Oxygen:</strong> Required for aerobic respiration, which releases the energy the embryo needs to grow and divide its cells, since the seed cannot yet photosynthesise for itself.</li>
              <li><strong>A suitable temperature:</strong> Enzymes inside the seed control germination, and like all enzymes they work best within a particular temperature range — too cold and the reactions are too slow to sustain growth; too hot and the enzymes are damaged (denatured).</li>
            </ul>
            <p className="text-sm text-slate-700 mb-3">
              Note that light is <strong>not</strong> one of the essential requirements for germination itself (though it does become essential once the seedling emerges and needs to photosynthesise). Once these conditions are met, the embryo absorbs water, swells, and its radicle (embryonic root) is usually the first part to emerge and anchor the seedling in the soil, followed by the plumule (embryonic shoot), which grows upward toward the light.
            </p>
            <img src={scienceImages.germinationStages} alt="Diagram of seed germination stages from dormant seed to young seedling" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-base font-bold text-slate-800 mb-1">Percentage germination</p>
            <p className="text-sm text-slate-700">
              Not every seed in a batch will germinate successfully — some may be too immature, damaged, or simply non-viable. <strong>Percentage germination</strong> is a way of measuring how successful a batch of seeds is at germinating, and is calculated as:
            </p>
            <p className="text-sm text-slate-700 font-semibold mt-2">Percentage germination = (Number of seeds germinated ÷ Total number of seeds planted) × 100</p>
            <p className="text-sm text-slate-700 mt-2">
              This figure is useful to farmers and gardeners for judging seed quality before planting a large area, since a low percentage germination means many seeds will fail to grow and more seeds should be planted to compensate, or a different batch of seeds should be sourced.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Plant Reproduction Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Flower = reproductive organ</li>
              <li>Pollination → fertilisation → seed/fruit</li>
              <li>Germination needs water, O₂, warmth</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'human-reproduction',
    title: 'Human Reproductive Systems',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Like other mammals, humans reproduce <strong>sexually</strong>: a new individual is formed by the fusion of a male gamete (a <strong>sperm cell</strong>) with a female gamete (an <strong>egg cell</strong>, or ovum), a process called <strong>fertilisation</strong>. Because the offspring receives genetic material from two parents, sexual reproduction produces genetic variation between individuals, unlike asexual reproduction where offspring are genetically identical to a single parent.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              To make fertilisation possible, males and females each have a specialised set of organs known as the <strong>reproductive system</strong>. These two systems are structurally very different from each other, but they are complementary — each is adapted to carry out one half of the overall process. The <strong>male reproductive system</strong> is adapted to produce sperm cells in very large numbers and deliver them into the female's body. The <strong>female reproductive system</strong> is adapted to produce egg cells (usually one at a time), provide the site where fertilisation actually takes place, and then support the growth of the resulting embryo and foetus through to birth. Both systems also produce <strong>sex hormones</strong> — testosterone in males, oestrogen and progesterone in females — which control the development of reproductive organs and secondary sexual characteristics, and regulate reproductive cycles and processes such as sperm production and ovulation.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Male Reproductive System</h4>
            <img src={scienceImages.maleReproductiveSystem} alt="Labelled diagram of the male reproductive system" loading="lazy" decoding="async" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <table className="w-full text-sm text-slate-700 border-collapse mt-4">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Structure</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Testes</td>
                  <td className="border p-2">A pair of oval organs suspended outside the main body cavity, inside the scrotum</td>
                  <td className="border p-2">Produce sperm cells (male gametes) by the millions, and produce the hormone testosterone, which controls sperm production and the development of male characteristics</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Scrotum</td>
                  <td className="border p-2">A loose sac of skin hanging outside the abdominal cavity, containing the testes</td>
                  <td className="border p-2">Holds the testes at a temperature slightly below normal body temperature, since sperm production requires cooler conditions than the rest of the body provides</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Sperm duct (vas deferens)</td>
                  <td className="border p-2">A long, muscular tube connecting each testis to the urethra</td>
                  <td className="border p-2">Carries mature sperm away from the testes toward the urethra during ejaculation, propelled by muscular contractions</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Seminal vesicle</td>
                  <td className="border p-2">A small gland attached to each sperm duct near the base of the bladder</td>
                  <td className="border p-2">Produces a nutrient-rich fluid that provides sperm with energy (mainly in the form of sugars), forming part of the semen</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Prostate gland</td>
                  <td className="border p-2">A gland surrounding the urethra just below the bladder</td>
                  <td className="border p-2">Produces an alkaline fluid that neutralises acidity in the urethra and in the vagina, protecting sperm and helping them survive and move effectively</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Urethra</td>
                  <td className="border p-2">A tube running through the length of the penis, connecting to both the bladder and the sperm ducts</td>
                  <td className="border p-2">Provides a shared passage for both semen (during ejaculation) and urine (at other times), though never both at the same time</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Penis</td>
                  <td className="border p-2">An external organ containing spongy, erectile tissue and the urethra</td>
                  <td className="border p-2">Becomes erect and rigid during arousal so it can be inserted into the vagina, allowing semen (containing sperm) to be deposited close to the cervix during ejaculation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Female Reproductive System</h4>
            <img src={scienceImages.femaleReproductiveSystem} alt="Labelled diagram of the female reproductive system" loading="lazy" decoding="async" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <table className="w-full text-sm text-slate-700 border-collapse mt-4">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Part</th>
                  <th className="border p-2 text-left">Structure</th>
                  <th className="border p-2 text-left">Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Ovaries</td>
                  <td className="border p-2">A pair of small, oval organs located on either side of the uterus, inside the abdominal cavity</td>
                  <td className="border p-2">Produce egg cells (ova), usually releasing one mature egg roughly every menstrual cycle (a process called <strong>ovulation</strong>), and produce the hormones oestrogen and progesterone, which regulate the menstrual cycle and support pregnancy</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Oviducts (fallopian tubes)</td>
                  <td className="border p-2">A pair of narrow tubes, each connecting one ovary to the uterus, lined with cilia and muscle</td>
                  <td className="border p-2">Capture the released egg from the ovary and provide the site where <strong>fertilisation</strong> normally takes place; cilia and muscular contractions sweep the egg (or fertilised zygote) toward the uterus</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Uterus (womb)</td>
                  <td className="border p-2">A hollow, muscular, pear-shaped organ with a thick inner lining (the endometrium) that is rebuilt and shed each menstrual cycle</td>
                  <td className="border p-2">Where a fertilised egg implants and develops throughout pregnancy; its thick muscular wall stretches to accommodate the growing foetus and contracts strongly during labour to push the baby out</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Cervix</td>
                  <td className="border p-2">A narrow, ring-like structure of firm tissue forming the lower opening of the uterus</td>
                  <td className="border p-2">Separates the uterus from the vagina; stays narrow and firm throughout most of pregnancy to hold the foetus in, then softens and dilates (widens) during labour to allow the baby to pass through</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Vagina</td>
                  <td className="border p-2">A muscular, elastic tube connecting the cervix to the outside of the body</td>
                  <td className="border p-2">Receives the penis and semen during intercourse, and serves as the birth canal through which the baby passes during delivery</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Fertilisation and Pregnancy</h4>

            <p className="text-base font-bold text-slate-800 mb-1">Fertilisation</p>
            <p className="text-sm text-slate-700 mb-3">
              During sexual intercourse, semen containing millions of sperm cells is deposited near the cervix. Sperm swim up through the uterus and into the oviducts (fallopian tubes), where, if an egg has recently been released, <strong>fertilisation</strong> takes place — a single sperm fuses with the egg cell, combining their genetic material to form a <strong>zygote</strong>. Although millions of sperm may begin the journey, only one is normally needed to fertilise the egg; once fertilisation happens, changes in the egg's outer membrane prevent any further sperm from entering.
            </p>
            <img src={scienceImages.fertilisationToImplantation} alt="Diagram showing fertilisation in the oviduct and the zygote travelling to implant in the uterus" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-sm text-slate-700 mb-3">
              Over the following days, the zygote divides repeatedly as it travels slowly down the oviduct toward the uterus, developing into a small ball of cells called an <strong>embryo</strong>. Around a week after fertilisation, the embryo reaches the uterus and buries itself into the thickened lining (endometrium), a process called <strong>implantation</strong>. From this point onward, the developing embryo can draw nutrients and oxygen from the mother's blood supply.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">The menstrual cycle</p>
            <p className="text-sm text-slate-700 mb-3">
              The <strong>menstrual cycle</strong> is a roughly monthly cycle of changes in the ovaries and uterus, controlled by hormones, that prepares the female body for a possible pregnancy each cycle. A typical cycle lasts about 28 days and is usually counted starting from the first day of menstrual bleeding (day 1).
            </p>
            <img src={scienceImages.menstrualCycleChart} alt="Chart of the menstrual cycle showing menstruation, endometrium thickening, and ovulation over 28 days" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Days 1–5 (menstruation):</strong> If the egg released in the previous cycle was not fertilised, the thickened uterine lining built up to receive it is no longer needed, and it breaks down and is shed from the body as the menstrual flow (period).</li>
              <li><strong>Days 5–13:</strong> The uterine lining (endometrium) begins to rebuild and thicken again, in preparation to receive a fertilised egg, while an egg matures inside one of the ovaries.</li>
              <li><strong>Day 14 (ovulation):</strong> A mature egg is released from the ovary into the oviduct — this is <strong>ovulation</strong>, and it marks the point in the cycle when fertilisation is most likely to succeed if sperm are present.</li>
              <li><strong>Days 14–28:</strong> The uterine lining continues to thicken and develop a rich blood supply, ready to receive and nourish a fertilised egg. If fertilisation and implantation do not occur by the end of this period, the cycle begins again with menstruation.</li>
            </ul>

            <p className="text-base font-bold text-slate-800 mb-1">The placenta and umbilical cord</p>
            <p className="text-sm text-slate-700 mb-3">
              Once implanted, the embryo (later called a <strong>foetus</strong> from about the eighth week of pregnancy onward) develops a specialised organ called the <strong>placenta</strong>, formed partly from the embryo's own tissue and partly from the uterine lining. The placenta is connected to the foetus by the <strong>umbilical cord</strong>, a flexible tube containing blood vessels.
            </p>
            <img src={scienceImages.placentaAndFoetus} alt="Diagram of a foetus in the uterus showing the placenta, umbilical cord, and amniotic sac" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700 mb-3">
              Crucially, the mother's blood and the foetus's blood never actually mix — instead, the placenta provides an extremely large surface area where the two blood supplies run very close together, separated by a thin membrane, allowing substances to <strong>diffuse</strong> across from one to the other. Through the placenta and umbilical cord, the foetus receives oxygen and dissolved nutrients (glucose, amino acids, vitamins) from the mother's blood, while carbon dioxide and other waste products made by the foetus diffuse back into the mother's blood to be removed by her own excretory organs. The placenta also acts as a barrier, helping to block many (though not all) harmful substances and pathogens from reaching the foetus.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">The amnion and amniotic fluid</p>
            <p className="text-sm text-slate-700">
              The developing foetus is enclosed within a thin, tough membrane called the <strong>amnion</strong>, which forms a fluid-filled sac around it. This sac is filled with <strong>amniotic fluid</strong>, a watery liquid that surrounds and cushions the foetus. The amniotic fluid absorbs shocks and sudden movements, protecting the delicate foetus from physical damage, helps maintain a constant temperature around the foetus, and gives it enough space to move and develop its muscles freely without being compressed by the walls of the uterus. Shortly before or during labour, this sac ruptures — commonly known as the mother's "waters breaking" — releasing the fluid before the baby is born.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Reproduction Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Testes – sperm</li>
              <li>Ovaries – eggs</li>
              <li>Fertilisation – oviduct</li>
              <li>Placenta – exchange</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'health-diseases',
    title: 'Health and Diseases',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Health</strong> can be defined as a state of complete physical, mental, and social well-being, not merely the absence of disease. <strong>Disease</strong> is any condition that disrupts the normal functioning of the body, and diseases are broadly grouped according to their cause. <strong>Communicable (infectious) diseases</strong> are caused by <strong>pathogens</strong> — disease-causing microorganisms such as bacteria, viruses, protozoa, and fungi — and can spread from an infected person, animal, or contaminated source to a healthy person. <strong>Non-communicable diseases</strong>, by contrast, cannot be passed from one person to another; among these, <strong>lifestyle diseases</strong> are non-communicable diseases that result largely from an individual's own habits and behaviours, such as smoking, excessive alcohol consumption, poor diet, or lack of exercise, rather than from a pathogen.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Sexually Transmitted Diseases (STDs)</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Sexually transmitted diseases (STDs)</strong>, also called sexually transmitted infections (STIs), are communicable diseases spread mainly through sexual contact, since the pathogens responsible generally cannot survive for long outside the warm, moist conditions of the body. Because transmission usually requires direct contact with infected bodily fluids or sores, avoiding unprotected sexual contact with an infected partner (for example, by using barrier methods such as condoms) greatly reduces the risk of infection. Many STDs can also cause serious long-term complications if left untreated, including infertility, so early diagnosis and treatment are important.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Gonorrhoea</p>
            <p className="text-sm text-slate-700 mb-3">
              Gonorrhoea is caused by the bacterium <em>Neisseria gonorrhoeae</em>, which infects the mucous membranes of the reproductive tract. It typically causes a thick discharge from the genitals and a burning sensation during urination, though some infected individuals show no symptoms at all, which allows the disease to spread unknowingly. Left untreated, gonorrhoea can spread further into the reproductive organs and cause infertility in both men and women. Since it is a bacterial infection, it can be effectively treated with a course of antibiotics.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Syphilis</p>
            <p className="text-sm text-slate-700 mb-3">
              Syphilis is caused by the bacterium <em>Treponema pallidum</em> and is unusual among STDs in that it progresses through <strong>three distinct stages</strong> if left untreated. In the first (primary) stage, a small, painless sore called a chancre appears at the site of infection. In the second (secondary) stage, symptoms can include skin rashes and flu-like illness as the bacteria spread through the bloodstream. If still untreated, the disease can enter a third (tertiary) stage, often years later, during which it can cause severe damage to the heart, brain, and nervous system. Syphilis is straightforward to cure with penicillin if it is caught in its early stages, which is why early testing is so important.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Genital herpes</p>
            <p className="text-sm text-slate-700 mb-3">
              Genital herpes is caused by the herpes simplex virus (HSV) and causes painful, fluid-filled blisters to form around the genitals, which eventually burst and form sores before healing. Because it is a viral infection, there is currently <strong>no cure</strong> that removes the virus from the body entirely — once infected, a person carries the virus for life, and it can periodically reactivate to cause further outbreaks of blisters. However, antiviral drugs are available that can shorten outbreaks, reduce their severity, and lower the chance of passing the virus on to a partner.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Chancroid</p>
            <p className="text-sm text-slate-700">
              Chancroid is caused by the bacterium <em>Haemophilus ducreyi</em> and results in painful open sores (ulcers) on or around the genitals, often accompanied by swollen lymph nodes in the groin. As with other bacterial STDs, chancroid can be effectively treated with a course of antibiotics, and prompt treatment helps prevent the ulcers from causing further tissue damage or spreading infection to a partner.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Other Communicable Diseases</h4>
            <p className="text-sm text-slate-700 mb-3">
              Beyond sexually transmitted infections, a wide range of other communicable diseases are caused by different groups of pathogens, each with its own typical route of transmission. Recognising which pathogen group causes a disease helps explain both how it spreads and how it can be treated or prevented — bacterial diseases can usually be treated with antibiotics, whereas viral diseases generally cannot, since antibiotics only work against bacteria.
            </p>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Pathogen group</th>
                  <th className="border p-2 text-left">Example diseases</th>
                  <th className="border p-2 text-left">Typical transmission</th>
                  <th className="border p-2 text-left">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Bacteria</td>
                  <td className="border p-2">Cholera, Typhoid, Tuberculosis (TB)</td>
                  <td className="border p-2">Cholera and typhoid spread mainly through water or food contaminated with faecal matter; TB spreads through airborne droplets released when an infected person coughs or sneezes</td>
                  <td className="border p-2">Can generally be treated with antibiotics; improved sanitation and clean water supplies greatly reduce the spread of cholera and typhoid</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Protozoa</td>
                  <td className="border p-2">Malaria, Sleeping sickness (trypanosomiasis)</td>
                  <td className="border p-2">Malaria is transmitted by the bite of an infected female Anopheles mosquito; sleeping sickness is transmitted by the bite of an infected tsetse fly</td>
                  <td className="border p-2">Both diseases rely on an insect <strong>vector</strong> to carry the protozoan parasite between hosts; controlling the insect population (e.g. draining stagnant water, insecticide-treated nets) helps prevent spread</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Virus</td>
                  <td className="border p-2">Ebola, HIV/AIDS, Influenza (flu)</td>
                  <td className="border p-2">Ebola and HIV spread mainly through direct contact with infected body fluids (such as blood); influenza spreads through airborne droplets from coughing and sneezing</td>
                  <td className="border p-2">Antibiotics are ineffective against viruses; treatment relies on antiviral drugs (where available) or supportive care, and vaccination is an important prevention method for some viral diseases</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Malaria</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Malaria</strong> is a serious communicable disease caused by a single-celled parasite of the genus <em>Plasmodium</em>. Unlike bacteria or viruses, Plasmodium is a <strong>protozoan</strong> — a more complex, animal-like microorganism — and it cannot spread directly from person to person through the air or through casual contact. Instead, it relies entirely on a <strong>vector</strong> (a carrier organism) to transport it between human hosts: the female <em>Anopheles</em> mosquito. Malaria remains one of the leading causes of illness and death in many tropical and subtropical regions, particularly affecting young children and pregnant women.
            </p>

            <div className="mt-2 mb-4">
              <img src={scienceImages.anophelesMosquito} alt="Diagram of the female Anopheles mosquito, the vector of malaria" loading="lazy" decoding="async" className="w-full rounded-xl border border-slate-200 bg-white object-contain" />
            </div>

            <p className="text-base font-bold text-slate-800 mb-1">The malaria life cycle</p>
            <p className="text-sm text-slate-700 mb-3">
              The Plasmodium parasite has a complex life cycle that alternates between two different hosts — the Anopheles mosquito and a human — and it must complete stages of development in both before it can be passed on again.
            </p>
            <img src={scienceImages.malariaLifeCycle} alt="Diagram of the malaria parasite life cycle showing transmission between mosquito and human hosts" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <ol className="list-decimal list-inside text-sm text-slate-700 space-y-2 mb-3">
              <li><strong>Infection of a human:</strong> When an infected female Anopheles mosquito bites a person to feed on blood, it injects saliva containing immature Plasmodium parasites (called sporozoites) directly into the bloodstream.</li>
              <li><strong>Liver stage:</strong> The parasites travel via the blood to the liver, where they invade liver cells and multiply rapidly without causing symptoms yet. This stage can take anywhere from about a week to several weeks.</li>
              <li><strong>Blood stage:</strong> The parasites then burst out of the liver cells and invade red blood cells, where they continue to multiply. Eventually the infected red blood cells rupture, releasing more parasites to infect further red blood cells — this repeating cycle of invasion and rupture is what causes the recurring fevers and chills characteristic of malaria.</li>
              <li><strong>Transmission back to a mosquito:</strong> Some parasites in the blood develop into a sexual form. If another (uninfected) mosquito bites the infected person, it takes up these sexual-stage parasites along with the blood meal.</li>
              <li><strong>Development inside the mosquito:</strong> Inside the mosquito's gut, the parasites reproduce sexually and develop further, eventually migrating to the mosquito's salivary glands, ready to be injected into the next person the mosquito bites — completing the cycle.</li>
            </ol>

            <p className="text-base font-bold text-slate-800 mb-1">Symptoms</p>
            <p className="text-sm text-slate-700 mb-3">
              Malaria typically causes recurring episodes of high fever, chills and shivering, sweating, headache, and muscle pain, corresponding to the repeated bursting of infected red blood cells. Without prompt treatment, severe cases can lead to anaemia (due to the destruction of red blood cells), organ damage, or death.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Prevention</p>
            <p className="text-sm text-slate-700 mb-3">
              Since malaria depends entirely on the mosquito vector to spread, most prevention strategies focus on breaking this link between mosquito and human, rather than targeting the parasite directly.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Insecticide-treated mosquito nets:</strong> Sleeping under a net treated with insecticide creates a physical and chemical barrier that prevents mosquitoes from biting at night, when Anopheles mosquitoes are most active.</li>
              <li><strong>Insect repellents:</strong> Applied to the skin or clothing, these discourage mosquitoes from landing and biting.</li>
              <li><strong>Draining stagnant water:</strong> Female Anopheles mosquitoes lay their eggs in still water, so removing or draining stagnant pools, puddles, and containers around homes removes their breeding sites and reduces mosquito numbers.</li>
              <li><strong>Indoor spraying and larvicides:</strong> Spraying insecticide on the inner walls of homes kills mosquitoes that land there, while larvicides can be applied to standing water to kill mosquito larvae before they mature.</li>
            </ul>

            <p className="text-base font-bold text-slate-800 mb-1">Treatment</p>
            <p className="text-sm text-slate-700">
              Because Plasmodium is a protozoan parasite and not a bacterium, antibiotics have no effect against it. Instead, malaria is treated with specific <strong>antimalarial drugs</strong>, such as quinine and chloroquine, which act directly on the parasite during its blood stage to kill it or prevent it from multiplying further. Prompt treatment after diagnosis greatly reduces the risk of the disease progressing to a severe or life-threatening stage.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Lifestyle Diseases</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Smoking:</strong> Nicotine (addiction), tar (cancer), CO (heart disease), emphysema.</li>
              <li><strong>Alcohol:</strong> Depressant – liver cirrhosis, Foetal Alcohol Syndrome.</li>
              <li><strong>Drug abuse:</strong> Mandrax, cannabis – loss of control, addiction.</li>
              <li><strong>Glue sniffing:</strong> Hallucinations, heart muscle damage.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Health Key Points</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>STDs – gonorrhea, syphilis</li>
              <li>Malaria – parasite, mosquito</li>
              <li>Smoking – cancer, heart disease</li>
              <li>Alcohol – liver damage, FAS</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="space-y-6">
        <div className="p-5 bg-amber-50 rounded-xl border-2 border-amber-300 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⏱️</span>
            <h4 className="text-lg font-bold text-amber-800">Last-Minute Study Strategy</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Don't re-read everything — test yourself. Cover the notes and try to recall each topic's key equation, diagram, and definitions from memory first.</li>
            <li>Prioritise the topics with the most exam weight: photosynthesis, digestion, respiration, and blood vessels come up almost every paper.</li>
            <li>For every experiment, make sure you can state the <strong>aim</strong>, one key <strong>control variable</strong>, and the <strong>conclusion</strong> in one sentence — that's usually what's actually asked, not the full method.</li>
            <li>Practice drawing the key diagrams from memory (leaf cross-section, flower, alveolus, blood vessels) — labelling diagrams is a very common question type.</li>
            <li>Read every exam question twice before answering — many marks are lost by answering the question you expected rather than the one actually asked (e.g. "explain" vs "describe").</li>
          </ul>
        </div>

        <div className="p-5 bg-rose-50 rounded-xl border-2 border-rose-300 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-rose-800">Common Mistakes to Avoid</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Confusing <strong>respiration</strong> (a chemical process in every cell, releasing energy from glucose) with <strong>breathing</strong> (the physical movement of air in and out of the lungs).</li>
            <li>Writing "plants respire at night, not during the day" — plants respire <strong>all the time</strong>; they only photosynthesise in light.</li>
            <li>Forgetting that photosynthesis needs <strong>all four</strong> factors (CO₂, water, light, chlorophyll) — leaving one out loses marks.</li>
            <li>Mixing up <strong>diffusion</strong> and <strong>osmosis</strong> — osmosis is specifically the movement of <em>water</em> across a partially permeable membrane; diffusion applies to any particle moving from high to low concentration.</li>
            <li>Saying arteries "always carry oxygenated blood" — the pulmonary artery carries deoxygenated blood to the lungs, and the pulmonary vein carries oxygenated blood back; the artery/vein distinction is about direction (away from/towards the heart), not oxygen content.</li>
            <li>Forgetting that <strong>pollination</strong> and <strong>fertilisation</strong> are different — pollination is only the transfer of pollen to the stigma; fertilisation is the actual fusion of gametes afterward.</li>
            <li>Confusing turgid and plasmolysed — turgid cells have taken in water and are firm; plasmolysed cells have lost water and the membrane has pulled away from the wall.</li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧬</span>
              <h4 className="text-lg font-bold text-blue-700">Cells</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
              <li>Animal vs Plant cells</li>
              <li>Nucleus, cytoplasm, membrane</li>
              <li>Specialised cells</li>
            </ul>
            <p className="text-xs text-blue-700 font-semibold mt-2">Exam tip: state adaptation AND function together, e.g. "root hair cells have a long extension, giving a large surface area for water absorption."</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌿</span>
              <h4 className="text-lg font-bold text-blue-700">Plant Nutrition</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
              <li>Photosynthesis equation</li>
              <li>Leaf structure</li>
              <li>Experiments: starch, CO₂, light</li>
              <li>Limiting factors: CO₂, light, temperature, water</li>
            </ul>
            <p className="text-xs text-blue-700 font-semibold mt-2">Must memorise: CO₂ + H₂O → C₆H₁₂O₆ + O₂ (needs light + chlorophyll).</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍽️</span>
              <h4 className="text-lg font-bold text-blue-700">Animal Nutrition</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
              <li>Digestive system: mouth → oesophagus → stomach → duodenum → ileum → colon → rectum</li>
              <li>Mechanical vs chemical digestion</li>
              <li>Enzymes, villi, food tests</li>
            </ul>
            <p className="text-xs text-blue-700 font-semibold mt-2">Food test colours: Starch = blue-black (iodine); Sugar = brick red (Benedict's, heated); Protein = purple (Biuret); Fat = cloudy white emulsion.</p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🫁</span>
              <h4 className="text-lg font-bold text-blue-700">Respiration</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
              <li>Inhaled vs exhaled air</li>
              <li>Alveoli adaptations</li>
              <li>Gaseous exchange</li>
            </ul>
            <p className="text-xs text-blue-700 font-semibold mt-2">Alveoli adaptations to recall: huge number, thin walls (one cell), moist lining, good capillary supply, well ventilated.</p>
          </div>

          <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚚</span>
              <h4 className="text-lg font-bold text-blue-700">Transport</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
              <li>Transpiration, potometer, factors affecting rate</li>
              <li>Osmosis, turgidity, plasmolysis</li>
              <li>Blood: plasma, RBC, WBC, platelets</li>
              <li>Arteries (thick/muscular, away from heart), veins (thin walls, valves, towards heart), capillaries (one cell thick, exchange)</li>
            </ul>
            <p className="text-xs text-blue-700 font-semibold mt-2">Quick check: "away from heart" = artery, "towards heart" = vein — not oxygen content.</p>
          </div>

          <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌸</span>
              <h4 className="text-lg font-bold text-blue-700">Reproduction</h4>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
              <li>Flower: stigma, style, ovary, anther, filament, petals, sepals</li>
              <li>Pollination (insect/wind, self/cross) vs fertilisation (gamete fusion)</li>
              <li>Male/female human systems</li>
              <li>Menstrual cycle (day 14 = ovulation), placenta, amnion</li>
            </ul>
            <p className="text-xs text-blue-700 font-semibold mt-2">Remember the order: pollination → fertilisation → seed (from ovule) + fruit (from ovary) → germination.</p>
          </div>
        </div>

        <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💊</span>
            <h4 className="text-lg font-bold text-blue-700">Health & Diseases</h4>
          </div>
          <p className="text-slate-700 mt-1 text-sm">STDs (gonorrhoea, syphilis, genital herpes, chancroid — know cause and whether treatable with antibiotics), malaria (Plasmodium protozoan, Anopheles mosquito vector, know the life cycle stages), lifestyle diseases (smoking, alcohol), prevention and treatment methods.</p>
          <p className="text-xs text-blue-700 font-semibold mt-2">Key distinction: bacterial diseases → treatable with antibiotics; viral diseases → antibiotics don't work, only antiviral drugs or prevention (vaccines).</p>
        </div>

        <div className="p-5 bg-emerald-50 rounded-xl border-2 border-emerald-300 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✅</span>
            <h4 className="text-lg font-bold text-emerald-800">Final Checklist Before the Exam</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Can I write the photosynthesis word equation from memory?</li>
            <li>Can I list the parts of the alimentary canal in order?</li>
            <li>Can I explain the difference between mechanical and chemical digestion?</li>
            <li>Can I state 3 differences between arteries, veins, and capillaries?</li>
            <li>Can I name the 4 factors affecting the rate of photosynthesis and transpiration?</li>
            <li>Can I label a flower diagram and a human reproductive system diagram?</li>
            <li>Do I know the difference between pollination and fertilisation?</li>
            <li>Can I state the aim, one key variable, and conclusion for each core experiment?</li>
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
    <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
      <div className="w-full px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                activeId === s.id
                  ? 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm'
                  : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
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

interface CombinedScienceProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome1: React.FC<CombinedScienceProps> = ({
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] font-sans text-slate-900 dark:text-slate-100 pb-20">
      {/* Duolingo Gradient Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 border-b-4 border-emerald-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40 shadow-xs">
                BIOLOGY
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                Form 3 • Combined Science
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🌿 {sections.length} Topics
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🧬 Cell & Human Systems
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            Cell Biology, Nutrition, Respiration, Transport, Reproduction & Health
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-emerald-50 font-medium">
            Comprehensive notes covering cell structure, photosynthesis, the digestive and respiratory systems,
            transport in plants and animals, reproduction, and diseases.
          </p>
        </div>
      </header>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 rounded-3xl border-2 border-b-6 border-emerald-800 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h3 className="font-black text-xl sm:text-2xl">Key Takeaways</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-emerald-50 font-medium">
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🔬 Cells:</strong>
                Basic unit of life; plant cells have cell wall, chloroplasts, vacuole; animal cells do not.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">☀️ Photosynthesis:</strong>
                CO₂ + H₂O → carbohydrates + O₂; requires chlorophyll, sunlight, CO₂, and water.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🍽️ Digestion:</strong>
                Mechanical (teeth) and chemical (enzymes); absorption happens primarily in the ileum (villi).
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🫁 Respiration:</strong>
                O₂ taken in, CO₂ expelled; alveoli provide large, moist gas exchange surfaces.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🩸 Transport:</strong>
                Transpiration in plants; blood (plasma, RBC, WBC, platelets) in animals.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🏥 Health:</strong>
                STDs, malaria, lifestyle diseases – understanding causes, symptoms, and active prevention.
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 rounded-3xl border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-sm text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {isLastChapter ? 'Section complete' : `Topic ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
            {isLastChapter ? (
              <>
                Ready for the next section: <span className="text-emerald-600 dark:text-emerald-400">{nextTopicTitle}</span>
              </>
            ) : (
              <>
                Up Next: <span className="text-emerald-600 dark:text-emerald-400">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <div className="flex items-center justify-center gap-4">
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => handleNavigate(sections[activeIndex - 1].id)}
                className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-6 py-3 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5"
              >
                ← Previous Topic
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastChapter && !onNextTopic}
              className="rounded-2xl border-2 border-b-4 border-emerald-800 bg-emerald-600 px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all hover:bg-emerald-500 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400 disabled:shadow-none"
            >
              {isLastChapter ? `Begin ${nextTopicTitle} →` : 'Next Topic →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default export as CombinedScience
export default LearningOutcome1;
