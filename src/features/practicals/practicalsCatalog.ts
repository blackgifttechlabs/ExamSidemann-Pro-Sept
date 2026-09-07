import React, { useEffect } from 'react';
import {
  Activity,
  Anchor,
  Aperture,
  Apple,
  AppWindow,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRightLeft,
  Atom,
  Binary,
  Bold,
  Box,
  Boxes,
  Braces,
  Cable,
  Calculator,
  Camera,
  ChevronRight,
  Circle,
  CircleDot,
  CircuitBoard,
  ClipboardList,
  Code2,
  Cog,
  Compass,
  Component,
  Copy,
  CornerUpLeft,
  Crosshair,
  Cylinder,
  Database,
  Disc2,
  Disc3,
  Droplet,
  Droplets,
  Equal,
  Expand,
  EyeOff,
  Filter,
  Flame,
  FlaskConical,
  FlaskRound,
  FlipHorizontal,
  Gauge,
  Globe,
  GraduationCap,
  Hexagon,
  Italic,
  CaseLower,
  Laptop,
  Layers,
  Leaf,
  Lightbulb,
  LineChart,
  Link,
  Magnet,
  Microscope,
  Minus,
  Monitor,
  Orbit,
  Palette,
  PenTool,
  PenLine,
  Users,
  Ruler,
  Scale,
  Scaling,
  Scissors,
  Search,
  Settings,
  Settings2,
  Slice,
  SlidersHorizontal,
  Spline,
  Split,
  Sprout,
  SquareStack,
  Sun,
  Table2,
  Terminal,
  TestTube,
  TestTubes,
  Thermometer,
  Timer,
  TreePine,
  TrendingUp,
  Triangle,
  Truck,
  Type,
  Utensils,
  Wand2,
  Waves,
  Weight,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';

export interface Experiment {
  title: string;
  blurb: string;
  route: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  /** Optional illustration shown in place of the icon. */
  image?: string;
}

export interface Category {
  id: string;
  title: string;
  blurb: string;
  route: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  /** Illustration shown on the category card in place of the icon. */
  image?: string;
  /** Scales up illustrations that carry a lot of transparent padding. */
  imageZoom?: string;
  /** Illustrations on a solid plate fill the band instead of letterboxing. */
  imageFit?: 'cover' | 'contain';
  /** Tailwind is loaded from the Play CDN here, so these are written out in full. */
  tile: string;
  /** Backdrop for this subject's block in the Experiments list. */
  band: string;
  /**
   * Gradient for the hero on this subject's own page, so the header carries the
   * same accent as the card you clicked to get there — green for Biology, sky
   * for Physics, and so on. Written out in full: Tailwind is loaded from the
   * Play CDN here, so class names cannot be composed at runtime.
   */
  hero: string;
  iconColor: string;
  ring: string;
  /**
   * What a single entry is called here, when the subject disagrees with its
   * level — Computer Science sits under O and A Level but is sat as a practical
   * paper on a machine, not as an experiment. Falls back to the level's noun.
   */
  itemNoun?: string;
  experiments: Experiment[];
}

export interface Level {
  id: string;
  label: string;
  route: string;
  /** Heading above the category cards — Polytechnic calls them courses. */
  categoriesLabel?: string;
  /** What this level calls a single entry: Polytechnic runs practicals. */
  itemNoun?: string;
  categories: Category[];
}

const OLEVEL_PHYSICS: Experiment[] = [
  {
    title: 'Projectile Motion',
    blurb: 'Launch a ball and track its flight.',
    route: '/practicals/olevel/physics/projectile-motion',
    Icon: Crosshair,
  },
  {
    title: "Hooke's Law",
    blurb: 'Stretch a spring with weights.',
    route: '/practicals/olevel/physics/hookes-law',
    Icon: Activity,
  },
  {
    title: 'Simple Pendulum',
    blurb: 'Time a swinging pendulum.',
    route: '/practicals/olevel/physics/pendulum',
    Icon: Timer,
  },
  {
    title: 'Density of Regular & Irregular Solids',
    blurb: 'Find mass, volume and density.',
    route: '/practicals/olevel/physics/density',
    Icon: Weight,
  },
  {
    title: 'Principle of Moments',
    blurb: 'Balance weights on a metre rule.',
    route: '/practicals/olevel/physics/moments',
    Icon: Scale,
  },
  {
    title: 'Centre of Gravity of a Lamina',
    blurb: 'Find the balance point of a shape.',
    route: '/practicals/olevel/physics/centre-of-gravity',
    Icon: Triangle,
  },
  {
    title: 'Acceleration on an Inclined Plane',
    blurb: 'Roll a trolley down a slope.',
    route: '/practicals/olevel/physics/inclined-plane',
    Icon: TrendingUp,
  },
  {
    title: 'Conservation of Momentum',
    blurb: 'Crash two trolleys together.',
    route: '/practicals/olevel/physics/momentum',
    Icon: ArrowRightLeft,
  },
  {
    title: 'Efficiency of a Simple Machine',
    blurb: 'Lift loads with pulley systems.',
    route: '/practicals/olevel/physics/machine-efficiency',
    Icon: Cog,
  },
  {
    title: 'Terminal Velocity & Motion in Fluids',
    blurb: 'Drop balls through thick liquids.',
    route: '/practicals/olevel/physics/terminal-velocity',
    Icon: Droplet,
  },
  {
    title: 'Specific Heat Capacity of a Solid',
    blurb: 'Heat a metal block and take readings.',
    route: '/practicals/olevel/physics/specific-heat-solid',
    Icon: Thermometer,
  },
  {
    title: 'Specific Heat Capacity of a Liquid',
    blurb: 'Heat a liquid and take readings.',
    route: '/practicals/olevel/physics/specific-heat-liquid',
    Icon: Flame,
  },
  {
    title: 'Heating & Cooling Curves',
    blurb: 'Watch ice melt and water boil.',
    route: '/practicals/olevel/physics/heating-cooling-curve',
    Icon: LineChart,
  },
  {
    title: 'Expansion of Solids',
    blurb: 'See how metals grow when heated.',
    route: '/practicals/olevel/physics/expansion-of-solids',
    Icon: Expand,
  },
  {
    title: "Boyle's Law",
    blurb: 'Squeeze air and read the pressure.',
    route: '/practicals/olevel/physics/boyles-law',
    Icon: Gauge,
  },
  {
    title: 'Plotting Magnetic Field Lines',
    blurb: 'Map the field around a magnet.',
    route: '/practicals/olevel/physics/magnetic-field-lines',
    Icon: Magnet,
  },
  {
    title: 'Magnetic and Non-Magnetic Materials',
    blurb: 'Find which metals a magnet pulls.',
    route: '/practicals/olevel/physics/magnetic-materials',
    Icon: Compass,
  },
  {
    title: 'Magnetising a Steel Bar',
    blurb: 'Turn a steel bar into a magnet.',
    route: '/practicals/olevel/physics/magnetisation',
    Icon: Wand2,
  },
  {
    title: 'Resistance of a Wire',
    blurb: 'Measure the resistance of a wire.',
    route: '/practicals/olevel/physics/resistance-of-a-wire',
    Icon: Cable,
  },
  {
    title: 'Using a Rheostat',
    blurb: 'Dim a lamp with a rheostat.',
    route: '/practicals/olevel/physics/rheostat',
    Icon: SlidersHorizontal,
  },
  {
    title: 'Resistors in Series and Parallel',
    blurb: 'Wire resistors two different ways.',
    route: '/practicals/olevel/physics/resistor-combinations',
    Icon: CircuitBoard,
  },
  {
    title: 'Electrostatics and Capacitors',
    blurb: 'Make static charge and test it.',
    route: '/practicals/olevel/physics/electrostatics',
    Icon: Zap,
  },
];

const OLEVEL_CHEMISTRY: Experiment[] = [
  {
    title: 'Paper Chromatography of Dyes and Inks',
    blurb: 'Separate ink colours on paper.',
    route: '/practicals/olevel/chemistry/chromatography',
    Icon: Palette,
  },
  {
    title: 'Acid–Alkali Titration',
    blurb: 'Titrate acid against alkali.',
    route: '/practicals/olevel/chemistry/titration',
    Icon: Droplets,
  },
  {
    title: 'Qualitative Analysis of Ions',
    blurb: 'Name unknown ions from their tests.',
    route: '/practicals/olevel/chemistry/qualitative-analysis',
    Icon: TestTubes,
  },
];

const OLEVEL_BIOLOGY: Experiment[] = [
  {
    title: 'Food Tests',
    blurb: 'Test food for sugar, starch and fat.',
    route: '/practicals/olevel/biology/food-tests',
    Icon: Apple,
  },
  {
    title: 'Effect of Temperature & pH on Enzymes',
    blurb: 'Test enzymes in hot and cold water.',
    route: '/practicals/olevel/biology/enzyme-activity',
    Icon: Thermometer,
  },
  {
    title: 'Catalase & Hydrogen Peroxide',
    blurb: 'Test catalase in liver and potato.',
    route: '/practicals/olevel/biology/catalase',
    Icon: FlaskRound,
  },
  {
    title: 'Testing a Leaf for Starch',
    blurb: 'Use iodine to find starch in a leaf.',
    route: '/practicals/olevel/biology/leaf-starch-test',
    Icon: Leaf,
  },
  {
    title: 'Light, Chlorophyll & Carbon Dioxide',
    blurb: 'What a plant needs to make food.',
    route: '/practicals/olevel/biology/limiting-factors',
    Icon: Sun,
  },
  {
    title: 'Light Intensity & Rate of Photosynthesis',
    blurb: 'Count bubbles as the light moves.',
    route: '/practicals/olevel/biology/pondweed-rate',
    Icon: Lightbulb,
  },
  {
    title: 'Carbon Dioxide from Germinating Seeds',
    blurb: 'Test the gas seeds breathe out.',
    route: '/practicals/olevel/biology/respiration-carbon-dioxide',
    Icon: Wind,
  },
  {
    title: 'Germinating vs Non-Germinating Seeds',
    blurb: 'Compare living and boiled seeds.',
    route: '/practicals/olevel/biology/seed-respiration',
    Icon: Sprout,
  },
  {
    title: 'Osmosis in Potato Tissue',
    blurb: 'Soak potato strips in sugar water.',
    route: '/practicals/olevel/biology/osmosis',
    Icon: Droplet,
  },
  {
    title: 'Diffusion in Liquids & Gases',
    blurb: 'Watch colour and smell spread out.',
    route: '/practicals/olevel/biology/diffusion',
    Icon: Waves,
  },
  {
    title: 'Transpiration with a Potometer',
    blurb: 'See how fast a plant loses water.',
    route: '/practicals/olevel/biology/potometer',
    Icon: TreePine,
  },
  {
    title: 'Microscopy, Cells & Biological Drawing',
    blurb: 'View onion and cheek cells close up.',
    route: '/practicals/olevel/biology/microscopy',
    Icon: Microscope,
  },
  {
    title: 'Experimental Skills & Data Handling',
    blurb: 'Plan, record and write conclusions.',
    route: '/practicals/olevel/biology/skills',
    Icon: ClipboardList,
  },
];

/**
 * The Computer Science practical paper is sat on a machine: a Visual Basic
 * program, an Access database and a web page. The same three tools serve O and
 * A Level — the syllabus difference is in what you are asked to build, not in
 * the software — so both levels point at these entries.
 */
const COMPUTER_SCIENCE: Experiment[] = [
  {
    title: 'Visual Basic .NET',
    blurb: 'Design a Windows form and write the code.',
    route: '/practicals/tools/vbnet',
    Icon: AppWindow,
    image: '/images/prac/visualbasic.png',
  },
  {
    title: 'Microsoft Access Database',
    blurb: 'Build tables, queries, forms and reports.',
    route: '/practicals/tools/access',
    Icon: Database,
    image: '/images/prac/Microsoft_Access-Logo.png',
  },
  {
    title: 'Web Design',
    blurb: 'Write HTML, CSS and JavaScript live.',
    route: '/practicals/tools/webdev',
    Icon: Globe,
    image: '/images/prac/webdesign.png',
  },
];

const OLEVEL_COMBINED: Experiment[] = [
  {
    title: 'Salt & Sand Separation',
    blurb: 'Get salt back out of sandy water.',
    route: '/practicals/olevel/combined-science/separation',
    Icon: Filter,
  },
  {
    title: 'Food Tests',
    blurb: 'Test food for sugar, starch and fat.',
    route: '/practicals/olevel/combined-science/food-tests',
    Icon: Utensils,
  },
  {
    title: 'Photosynthesis',
    blurb: 'Test a leaf for starch with iodine.',
    route: '/practicals/olevel/combined-science/photosynthesis',
    Icon: Leaf,
  },
  {
    title: 'Oxygen from Photosynthesis',
    blurb: 'Collect the gas pondweed gives off.',
    route: '/practicals/olevel/combined-science/oxygen-from-photosynthesis',
    Icon: Sun,
  },
  {
    title: 'Respiration',
    blurb: 'Respiration in germinating seeds.',
    route: '/practicals/olevel/combined-science/respiration',
    Icon: Sprout,
  },
  {
    title: 'Inhaled and Exhaled Air',
    blurb: 'Compare carbon dioxide with limewater.',
    route: '/practicals/olevel/combined-science/inhaled-exhaled-air',
    Icon: Wind,
  },
  {
    title: 'Oxygen Content and a Candle',
    blurb: 'Time a candle burning in two gas jars.',
    route: '/practicals/olevel/combined-science/candle-oxygen-test',
    Icon: Flame,
  },
  {
    title: 'Simple Electricity',
    blurb: 'Build series and parallel circuits.',
    route: '/practicals/olevel/combined-science/simple-electricity',
    Icon: Lightbulb,
  },
  {
    title: 'Rate of Reaction',
    blurb: 'Marble chips and hydrochloric acid.',
    route: '/practicals/olevel/combined-science/rates-of-reaction',
    Icon: Timer,
  },
  {
    title: 'Testing Acids & Bases with Litmus',
    blurb: 'Red and blue litmus paper on the bench.',
    route: '/practicals/olevel/combined-science/titration',
    Icon: TestTube,
  },
  {
    title: 'Rusting of Iron',
    blurb: 'Find out what makes iron rust.',
    route: '/practicals/olevel/combined-science/rusting',
    Icon: Droplets,
  },
  {
    title: 'Force and Motion',
    blurb: 'Ticker tape on a ramp.',
    route: '/practicals/olevel/combined-science/force-and-motion',
    Icon: TrendingUp,
  },
];

/**
 * A Level lists every O Level practical, but without Combined Science as a
 * category of its own: those experiments are folded into the science they
 * belong to, and anything already covered by that subject is left out.
 */
const combinedFor = (routes: string[]) =>
  OLEVEL_COMBINED.filter((experiment) => routes.includes(experiment.route));

const mergeExperiments = (...groups: Experiment[][]) => {
  const seen = new Set<string>();
  return groups.flat().filter((experiment) => {
    if (seen.has(experiment.title)) return false;
    seen.add(experiment.title);
    return true;
  });
};

const ALEVEL_PHYSICS = mergeExperiments(
  OLEVEL_PHYSICS,
  combinedFor([
    '/practicals/olevel/combined-science/simple-electricity',
    '/practicals/olevel/combined-science/force-and-motion',
  ])
);

const ALEVEL_CHEMISTRY = mergeExperiments(
  OLEVEL_CHEMISTRY,
  combinedFor([
    '/practicals/olevel/combined-science/separation',
    '/practicals/olevel/combined-science/rates-of-reaction',
    '/practicals/olevel/combined-science/titration',
    '/practicals/olevel/combined-science/rusting',
    '/practicals/olevel/combined-science/candle-oxygen-test',
  ])
);

const ALEVEL_BIOLOGY = mergeExperiments(
  OLEVEL_BIOLOGY,
  combinedFor([
    '/practicals/olevel/combined-science/food-tests',
    '/practicals/olevel/combined-science/photosynthesis',
    '/practicals/olevel/combined-science/oxygen-from-photosynthesis',
    '/practicals/olevel/combined-science/respiration',
    '/practicals/olevel/combined-science/inhaled-exhaled-air',
  ])
);

const mathematicsTutor = (level: 'olevel' | 'alevel'): Experiment[] => [{
  title: 'Wake Teacher',
  blurb: 'Show Sidemann a maths problem and work through it one step at a time.',
  route: `/practicals/${level}/mathematics`,
  Icon: Camera,
}];

export const LEVELS: Level[] = [
  {
    id: 'olevel',
    label: 'O Level',
    route: '/practicals/olevel',
    categories: [
      {
        id: 'biology',
        title: 'Biology',
        blurb: 'Cells, nutrition, transport and observation practicals.',
        route: '/practicals/olevel/biology',
        Icon: Microscope,
        image: '/images/prac/biology-image.png',
        tile: 'bg-green-100 dark:bg-green-500/10',
        iconColor: 'text-green-700 dark:text-green-400',
        ring: 'hover:border-green-400 dark:hover:border-green-400/60',
        band: 'bg-green-100/70 dark:bg-green-500/[0.08]',
        hero: 'from-green-600 via-emerald-700 to-teal-800 dark:from-green-900 dark:via-emerald-900 dark:to-teal-950',
        experiments: OLEVEL_BIOLOGY,
      },
      {
        id: 'physics',
        title: 'Physics',
        blurb: 'Motion, forces, heat, magnetism and electricity.',
        route: '/practicals/olevel/physics',
        Icon: Atom,
        image: '/images/prac/physicss.png',
        tile: 'bg-sky-100 dark:bg-sky-500/10',
        iconColor: 'text-sky-600 dark:text-sky-400',
        ring: 'hover:border-sky-400 dark:hover:border-sky-400/60',
        band: 'bg-sky-50 dark:bg-sky-500/[0.07]',
        hero: 'from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-900 dark:via-blue-950 dark:to-indigo-950',
        experiments: OLEVEL_PHYSICS,
      },
      {
        id: 'chemistry',
        title: 'Chemistry',
        blurb: 'Separation, titration and analysis on the bench.',
        route: '/practicals/olevel/chemistry',
        Icon: FlaskConical,
        image: '/images/prac/chemistry-imagee.png',
        imageZoom: 'scale-[1.12]',
        tile: 'bg-pink-100 dark:bg-pink-500/10',
        iconColor: 'text-pink-600 dark:text-pink-400',
        ring: 'hover:border-pink-400 dark:hover:border-pink-400/60',
        band: 'bg-pink-50 dark:bg-pink-500/[0.07]',
        hero: 'from-pink-500 via-rose-600 to-fuchsia-700 dark:from-pink-900 dark:via-rose-950 dark:to-fuchsia-950',
        experiments: OLEVEL_CHEMISTRY,
      },
      {
        id: 'combined-science',
        title: 'Combined Science',
        blurb: 'Integrated Physics, Chemistry and Biology activities.',
        route: '/practicals/olevel/combined-science',
        Icon: Orbit,
        image: '/images/prac/combinedscie.png',
        imageZoom: 'scale-[1.45]',
        tile: 'bg-orange-100 dark:bg-orange-500/10',
        iconColor: 'text-orange-600 dark:text-orange-400',
        ring: 'hover:border-orange-400 dark:hover:border-orange-400/60',
        band: 'bg-orange-50 dark:bg-orange-500/[0.07]',
        hero: 'from-orange-500 via-amber-600 to-orange-700 dark:from-orange-900 dark:via-amber-950 dark:to-orange-950',
        experiments: OLEVEL_COMBINED,
      },
      {
        id: 'computer-science',
        title: 'Computer Science',
        blurb: 'Visual Basic, Access databases and web design.',
        route: '/practicals/olevel/computer-science',
        Icon: Laptop,
        image: '/images/prac/computer_science.png',
        imageFit: 'cover',
        // Maroon, after the Office and Access chrome the practicals run in.
        tile: 'bg-red-100 dark:bg-red-500/10',
        iconColor: 'text-red-800 dark:text-red-400',
        ring: 'hover:border-red-400 dark:hover:border-red-400/60',
        band: 'bg-red-50 dark:bg-red-500/[0.07]',
        hero: 'from-red-800 via-red-900 to-stone-900 dark:from-red-950 dark:via-stone-950 dark:to-neutral-950',
        itemNoun: 'practical',
        experiments: COMPUTER_SCIENCE,
      },
      {
        id: 'mathematics',
        title: 'Mathematics',
        blurb: 'Camera-guided help for equations, graphs, geometry and written problems.',
        route: '/practicals/olevel/mathematics',
        Icon: Calculator,
        tile: 'bg-violet-100 dark:bg-violet-500/10',
        iconColor: 'text-violet-700 dark:text-violet-300',
        ring: 'hover:border-violet-400 dark:hover:border-violet-400/60',
        band: 'bg-violet-50 dark:bg-violet-500/[0.07]',
        hero: 'from-violet-600 via-purple-700 to-fuchsia-800 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950',
        itemNoun: 'tool',
        experiments: mathematicsTutor('olevel'),
      },
    ],
  },
  {
    id: 'alevel',
    label: 'A Level',
    route: '/practicals/alevel',
    categories: [
      {
        id: 'alevel-biology',
        title: 'Biology',
        blurb: 'Cells, enzymes, transport and the full practical skill set.',
        route: '/practicals/alevel/biology',
        Icon: Microscope,
        image: '/images/prac/biology-image.png',
        tile: 'bg-green-100 dark:bg-green-500/10',
        iconColor: 'text-green-700 dark:text-green-400',
        ring: 'hover:border-green-400 dark:hover:border-green-400/60',
        band: 'bg-green-100/70 dark:bg-green-500/[0.08]',
        hero: 'from-green-600 via-emerald-700 to-teal-800 dark:from-green-900 dark:via-emerald-900 dark:to-teal-950',
        experiments: ALEVEL_BIOLOGY,
      },
      {
        id: 'alevel-physics',
        title: 'Physics',
        blurb: 'Advanced mechanics, waves, thermal and measurement.',
        route: '/practicals/alevel/physics',
        Icon: Atom,
        image: '/images/prac/physicss.png',
        tile: 'bg-sky-100 dark:bg-sky-500/10',
        iconColor: 'text-sky-600 dark:text-sky-400',
        ring: 'hover:border-sky-400 dark:hover:border-sky-400/60',
        band: 'bg-sky-50 dark:bg-sky-500/[0.07]',
        hero: 'from-sky-600 via-blue-700 to-indigo-800 dark:from-sky-900 dark:via-blue-950 dark:to-indigo-950',
        experiments: ALEVEL_PHYSICS,
      },
      {
        id: 'alevel-chemistry',
        title: 'Chemistry',
        blurb: 'Quantitative analysis, organic chemistry and energetics.',
        route: '/practicals/alevel/chemistry',
        Icon: FlaskConical,
        image: '/images/prac/chemistry-imagee.png',
        imageZoom: 'scale-[1.12]',
        tile: 'bg-pink-100 dark:bg-pink-500/10',
        iconColor: 'text-pink-600 dark:text-pink-400',
        ring: 'hover:border-pink-400 dark:hover:border-pink-400/60',
        band: 'bg-pink-50 dark:bg-pink-500/[0.07]',
        hero: 'from-pink-500 via-rose-600 to-fuchsia-700 dark:from-pink-900 dark:via-rose-950 dark:to-fuchsia-950',
        experiments: ALEVEL_CHEMISTRY,
      },
      {
        id: 'alevel-computer-science',
        title: 'Computer Science',
        blurb: 'Visual Basic, Access databases and web design.',
        route: '/practicals/alevel/computer-science',
        Icon: Laptop,
        image: '/images/prac/computer_science.png',
        imageFit: 'cover',
        // Maroon, after the Office and Access chrome the practicals run in.
        tile: 'bg-red-100 dark:bg-red-500/10',
        iconColor: 'text-red-800 dark:text-red-400',
        ring: 'hover:border-red-400 dark:hover:border-red-400/60',
        band: 'bg-red-50 dark:bg-red-500/[0.07]',
        hero: 'from-red-800 via-red-900 to-stone-900 dark:from-red-950 dark:via-stone-950 dark:to-neutral-950',
        itemNoun: 'practical',
        experiments: COMPUTER_SCIENCE,
      },
      {
        id: 'alevel-mathematics',
        title: 'Mathematics',
        blurb: 'Camera-guided help for advanced algebra, calculus, statistics and mechanics.',
        route: '/practicals/alevel/mathematics',
        Icon: Calculator,
        tile: 'bg-violet-100 dark:bg-violet-500/10',
        iconColor: 'text-violet-700 dark:text-violet-300',
        ring: 'hover:border-violet-400 dark:hover:border-violet-400/60',
        band: 'bg-violet-50 dark:bg-violet-500/[0.07]',
        hero: 'from-violet-600 via-purple-700 to-fuchsia-800 dark:from-violet-950 dark:via-purple-950 dark:to-fuchsia-950',
        itemNoun: 'tool',
        experiments: mathematicsTutor('alevel'),
      },
    ],
  },
  {
    id: 'polytechnic',
    label: 'Polytechnic',
    route: '/practicals/polytechnic',
    categoriesLabel: 'Courses',
    itemNoun: 'practical',
    categories: [
      {
        id: 'poly-it',
        title: 'Information Technology',
        blurb: 'Software, databases, web development and networking.',
        route: '/practicals/polytechnic/it',
        Icon: Binary,
        image: '/images/prac/IT.png',
        imageFit: 'cover',
        tile: 'bg-blue-100 dark:bg-blue-500/10',
        iconColor: 'text-blue-600 dark:text-blue-400',
        ring: 'hover:border-blue-400 dark:hover:border-blue-400/60',
        band: 'bg-blue-50 dark:bg-blue-500/[0.07]',
        hero: 'from-blue-600 via-indigo-700 to-blue-900 dark:from-blue-900 dark:via-indigo-950 dark:to-blue-950',
        experiments: [
          {
            title: 'Linux Terminal',
            blurb: 'A live command-line shell.',
            route: '/practicals/tools/linux',
            Icon: Terminal,
            image: '/images/prac/kaliwhite.avif',
          },
          {
            title: 'C# Programming',
            blurb: 'Write and run C# in the browser.',
            route: '/practicals/tools/csharp',
            Icon: Code2,
            image: '/images/prac/csharpwhite.avif',
          },
          {
            title: 'C++ Programming',
            blurb: 'Practise C++ in the browser.',
            route: '/practicals/tools/cpp',
            Icon: Braces,
            image: '/images/prac/cpp.png',
          },
          {
            title: 'MySQL Engine',
            blurb: 'Run SQL on a practice database.',
            route: '/sql-practice',
            Icon: Database,
            image: '/images/prac/dbwhite.avif',
          },
          {
            title: 'Microsoft Access Database',
            blurb: 'Build tables, queries, forms and reports.',
            route: '/practicals/tools/access',
            Icon: Table2,
            image: '/images/prac/Microsoft_Access-Logo.png',
          },
          {
            title: 'Web Dev IDE',
            blurb: 'Build web pages in a live editor.',
            route: '/practicals/tools/webdev',
            Icon: Globe,
            image: 'https://i.ibb.co/Kpn4DH90/webwhite.avif',
          },
        ],
      },
      {
        // Technical Drawing is examined across almost every engineering trade —
        // DPF, Automotive, Mechanical, Fabrication, Electrical, Civil — so the
        // one board is reached from all of them rather than sitting under a
        // single department.
        id: 'poly-drawing',
        title: 'Technical Drawing',
        blurb: 'Board, T-square and set squares.',
        route: '/practicals/polytechnic/drawing',
        Icon: Compass,
        image: '/images/prac/technical_drawing.png',
        imageFit: 'cover',
        itemNoun: 'Drawing',
        tile: 'bg-amber-100 dark:bg-amber-500/10',
        iconColor: 'text-amber-600 dark:text-amber-400',
        ring: 'hover:border-amber-400 dark:hover:border-amber-400/60',
        band: 'bg-amber-50 dark:bg-amber-500/[0.07]',
        hero: 'from-amber-500 via-orange-600 to-amber-800 dark:from-amber-900 dark:via-orange-950 dark:to-amber-950',
        experiments: [
          {
            title: 'Bisecting a line',
            blurb: 'Find the middle of a line.',
            route: '/practicals/polytechnic/drawing/bisect-line',
            Icon: Scissors,
          },
          {
            title: 'A perpendicular from a given point to a line',
            blurb: 'Square up from a point on a line.',
            route: '/practicals/polytechnic/drawing/perpendicular-on-line',
            Icon: CornerUpLeft,
          },
          {
            title: 'A line divided into proportional parts',
            blurb: 'Split a line into equal parts.',
            route: '/practicals/polytechnic/drawing/divide-line',
            Icon: Ruler,
          },
          {
            title: 'A perpendicular from any point to a line',
            blurb: 'Drop a square line onto a line.',
            route: '/practicals/polytechnic/drawing/perpendicular-from-point',
            Icon: ArrowDownToLine,
          },
          {
            title: 'Parallel lines',
            blurb: 'Draw lines that never meet.',
            route: '/practicals/polytechnic/drawing/parallel-lines',
            Icon: Equal,
          },
          {
            title: 'Bisecting an angle',
            blurb: 'Cut an angle in half.',
            route: '/practicals/polytechnic/drawing/bisect-angle',
            Icon: Split,
          },
          {
            title: 'Various angles constructed without a protractor',
            blurb: 'Build angles with a compass only.',
            route: '/practicals/polytechnic/drawing/angles-without-protractor',
            Icon: Triangle,
          },
          {
            title: 'A copied angle',
            blurb: 'Copy an angle without measuring.',
            route: '/practicals/polytechnic/drawing/copied-angle',
            Icon: Copy,
          },
          {
            title: 'The centre of a given arc or circle',
            blurb: 'Recover a lost centre from two chords.',
            route: '/practicals/polytechnic/drawing/arc-centre',
            Icon: Crosshair,
          },
          {
            title: 'Various geometrical shapes',
            blurb: 'Shapes drawn inside one circle.',
            route: '/practicals/polytechnic/drawing/geometric-shapes',
            Icon: Hexagon,
          },
          {
            title: 'Straight lines joined to curves by an arc',
            blurb: 'Join a line to a curve smoothly.',
            route: '/practicals/polytechnic/drawing/blend-arcs',
            Icon: Spline,
          },
          {
            title: 'An ellipse and scales',
            blurb: 'Draw an ellipse and a plain scale.',
            route: '/practicals/polytechnic/drawing/ellipse-and-scales',
            Icon: Circle,
          },
          {
            title: 'First angle orthographic projection',
            blurb: 'Front view, plan and end view.',
            route: '/practicals/polytechnic/drawing/orthographic',
            Icon: Box,
          },
          {
            title: 'Isometric drawing',
            blurb: 'Draw a solid on three axes.',
            route: '/practicals/polytechnic/drawing/isometric',
            Icon: Boxes,
          },
          {
            title: 'Bars',
            blurb: 'Round, square and hex bar with breaks.',
            route: '/practicals/polytechnic/drawing/bars',
            Icon: Cylinder,
          },
          {
            title: 'Tubes',
            blurb: 'Show a bore through a broken tube.',
            route: '/practicals/polytechnic/drawing/tubes',
            Icon: CircleDot,
          },
          {
            title: 'Shafts',
            blurb: 'Stepped shaft with chamfer and keyway.',
            route: '/practicals/polytechnic/drawing/shafts',
            Icon: Cog,
          },
          {
            title: 'Compression springs',
            blurb: 'Coils drawn between two envelope lines.',
            route: '/practicals/polytechnic/drawing/compression-springs',
            Icon: Waves,
          },
          {
            title: 'Tension springs',
            blurb: 'Closed coils with end loops.',
            route: '/practicals/polytechnic/drawing/tension-springs',
            Icon: Activity,
          },
          {
            title: 'Splined shafts (external)',
            blurb: 'Splines on the outside of a shaft.',
            route: '/practicals/polytechnic/drawing/splined-shaft-external',
            Icon: Disc3,
          },
          {
            title: 'Splined shafts (internal)',
            blurb: 'Splines cut inside a bore.',
            route: '/practicals/polytechnic/drawing/splined-shaft-internal',
            Icon: Disc2,
          },
          {
            title: 'Serrated shafts (external)',
            blurb: 'Fine serrations round a shaft.',
            route: '/practicals/polytechnic/drawing/serrated-shaft-external',
            Icon: Settings,
          },
          {
            title: 'Serrated shafts (internal)',
            blurb: 'Serrations inside a clamped boss.',
            route: '/practicals/polytechnic/drawing/serrated-shaft-internal',
            Icon: Settings2,
          },
          {
            title: 'Functional dimensioning',
            blurb: 'Dimension the sizes that make it work.',
            route: '/practicals/polytechnic/drawing/dimension-functional',
            Icon: Ruler,
          },
          {
            title: 'Non-functional dimensioning',
            blurb: 'Size the rest of the part.',
            route: '/practicals/polytechnic/drawing/dimension-non-functional',
            Icon: Scale,
          },
          {
            title: 'Auxiliary dimensioning',
            blurb: 'Reference sizes shown in brackets.',
            route: '/practicals/polytechnic/drawing/dimension-auxiliary',
            Icon: SlidersHorizontal,
          },
          {
            title: 'Chain dimensioning',
            blurb: 'Sizes taken end to end.',
            route: '/practicals/polytechnic/drawing/dimension-chain',
            Icon: Link,
          },
          {
            title: 'Datum dimensioning',
            blurb: 'Every size from one face.',
            route: '/practicals/polytechnic/drawing/dimension-datum',
            Icon: Anchor,
          },
          {
            title: 'Types of line',
            blurb: 'Outline, hidden, centre and break lines.',
            route: '/practicals/polytechnic/drawing/line-types',
            Icon: Minus,
          },
          {
            title: 'Freehand letters and numerals',
            blurb: 'Print neatly between guide lines.',
            route: '/practicals/polytechnic/drawing/freehand-lettering',
            Icon: Type,
          },
          {
            title: 'Bold lettering for title blocks',
            blurb: 'Head up a drawing sheet.',
            route: '/practicals/polytechnic/drawing/title-block-lettering',
            Icon: Bold,
          },
          {
            title: 'Basic assembly drawings',
            blurb: 'Parts drawn together and ballooned.',
            route: '/practicals/polytechnic/drawing/assembly-drawing',
            Icon: Layers,
          },
          {
            title: 'Exploded diagrams',
            blurb: 'Pull the parts apart on one axis.',
            route: '/practicals/polytechnic/drawing/exploded-diagram',
            Icon: Component,
          },
          {
            title: 'Orthographic from a pictorial drawing',
            blurb: 'Turn a 3D view into three views.',
            route: '/practicals/polytechnic/drawing/ortho-from-pictorial',
            Icon: SquareStack,
          },
          {
            title: 'Third angle projection',
            blurb: 'Plan above, end view on the left.',
            route: '/practicals/polytechnic/drawing/third-angle',
            Icon: FlipHorizontal,
          },
          {
            title: 'Freehand sketches in first angle',
            blurb: 'Sketch three views without instruments.',
            route: '/practicals/polytechnic/drawing/freehand-first-angle',
            Icon: PenTool,
          },
          {
            title: 'Isometric circles',
            blurb: 'Four-centre circles on a sloping face.',
            route: '/practicals/polytechnic/drawing/isometric-circles',
            Icon: Orbit,
          },
          {
            title: 'Isometric ellipses',
            blurb: 'Ellipses on all three faces.',
            route: '/practicals/polytechnic/drawing/isometric-ellipses',
            Icon: Aperture,
          },
          {
            title: 'The isometric scale',
            blurb: 'Shorten true lengths for isometric.',
            route: '/practicals/polytechnic/drawing/isometric-scale',
            Icon: Scaling,
          },
          {
            title: 'Sectioned diagrams in first angle',
            blurb: 'Cut a part and hatch the cut face.',
            route: '/practicals/polytechnic/drawing/sectioned-first-angle',
            Icon: Slice,
          },
          {
            title: 'Hydraulic power steering',
            blurb: 'Pump, relief valve, control valve and ram.',
            route: '/practicals/polytechnic/drawing/hydraulic-power-steering',
            Icon: Droplets,
          },
          {
            title: 'Hydraulic power brakes',
            blurb: 'Pressure supply to the wheel cylinders.',
            route: '/practicals/polytechnic/drawing/hydraulic-power-brakes',
            Icon: Droplet,
          },
          {
            title: 'Hydraulic tipping mechanisms',
            blurb: 'Raise and lower a tipping body.',
            route: '/practicals/polytechnic/drawing/hydraulic-tipping',
            Icon: Truck,
          },
          {
            title: 'Heavy vehicle air brakes',
            blurb: 'Compressed air to the brake chambers.',
            route: '/practicals/polytechnic/drawing/pneumatic-air-brakes',
            Icon: Wind,
          },
          {
            title: 'Basic auto-electrical circuits',
            blurb: 'Battery, fuse, switch and earth return.',
            route: '/practicals/polytechnic/drawing/auto-electrical',
            Icon: Zap,
          },
        ],
      },
      {
        // Fabrication draws its own paper: scales, line-work, projection,
        // lettering and — the half nobody else sits — template development,
        // where the answer is the flat plate that rolls up into the job.
        id: 'poly-fabrication',
        title: 'Fabrication Engineering Drawing',
        blurb: 'Scales, line-work, projection and template development.',
        route: '/practicals/polytechnic/fabrication',
        Icon: Layers,
        image: '/images/prac/fabrication.png',
        imageFit: 'cover',
        itemNoun: 'Drawing',
        tile: 'bg-slate-200 dark:bg-slate-500/15',
        iconColor: 'text-slate-700 dark:text-slate-300',
        ring: 'hover:border-slate-400 dark:hover:border-slate-400/60',
        band: 'bg-slate-50 dark:bg-slate-500/[0.07]',
        hero: 'from-slate-600 via-slate-800 to-zinc-900 dark:from-slate-800 dark:via-zinc-900 dark:to-neutral-950',
        experiments: [
          {
            title: 'Full size (1:1)',
            blurb: 'The drawing and the job are the same.',
            route: '/practicals/polytechnic/fabrication/scale-full-size',
            Icon: Ruler,
          },
          {
            title: 'Reduction scale (1:2)',
            blurb: 'Half size, with true figures on it.',
            route: '/practicals/polytechnic/fabrication/scale-reduction',
            Icon: Minus,
          },
          {
            title: 'Enlargement scale (2:1)',
            blurb: 'A small part drawn twice size.',
            route: '/practicals/polytechnic/fabrication/scale-enlargement',
            Icon: Expand,
          },
          {
            title: 'Dual scale',
            blurb: 'Metres and feet off one bar.',
            route: '/practicals/polytechnic/fabrication/scale-dual',
            Icon: ArrowRightLeft,
          },
          {
            title: 'Diagonal scale',
            blurb: 'Three orders of size from one scale.',
            route: '/practicals/polytechnic/fabrication/scale-diagonal',
            Icon: Scaling,
          },
          {
            title: 'Plain scale',
            blurb: 'Whole units and tenths.',
            route: '/practicals/polytechnic/fabrication/scale-plain',
            Icon: Scale,
          },
          {
            title: 'Stepped block in third angle',
            blurb: 'Plan above, end view on the left.',
            route: '/practicals/polytechnic/fabrication/ortho-third-angle-stepped',
            Icon: FlipHorizontal,
          },
          {
            title: 'Stepped block in first angle',
            blurb: 'Plan below, end view on the right.',
            route: '/practicals/polytechnic/fabrication/ortho-first-angle-stepped',
            Icon: Box,
          },
          {
            title: 'Auxiliary views',
            blurb: 'True shape of a sloping face.',
            route: '/practicals/polytechnic/fabrication/ortho-auxiliary-views',
            Icon: Triangle,
          },
          {
            title: 'Outline',
            blurb: 'Continuous thick — the visible edges.',
            route: '/practicals/polytechnic/fabrication/line-outline',
            Icon: Minus,
          },
          {
            title: 'Centre line',
            blurb: 'Chain thin, through every hole and axis.',
            route: '/practicals/polytechnic/fabrication/line-centre',
            Icon: Crosshair,
          },
          {
            title: 'Projection line',
            blurb: 'Carries a point between views.',
            route: '/practicals/polytechnic/fabrication/line-projection',
            Icon: ArrowDownToLine,
          },
          {
            title: 'Construction line',
            blurb: 'The setting out you leave on.',
            route: '/practicals/polytechnic/fabrication/line-construction',
            Icon: PenTool,
          },
          {
            title: 'Dimension line',
            blurb: 'Arrowheads, spacing and the figure.',
            route: '/practicals/polytechnic/fabrication/line-dimension',
            Icon: Ruler,
          },
          {
            title: 'Leader line',
            blurb: 'Takes a note to a feature.',
            route: '/practicals/polytechnic/fabrication/line-leader',
            Icon: Link,
          },
          {
            title: 'Limit line',
            blurb: 'Where a partial view stops.',
            route: '/practicals/polytechnic/fabrication/line-limit',
            Icon: Slice,
          },
          {
            title: 'Phantom line',
            blurb: 'An alternate position, in chain double dash.',
            route: '/practicals/polytechnic/fabrication/line-phantom',
            Icon: Copy,
          },
          {
            title: 'Extension line',
            blurb: 'Brings a feature out to its size.',
            route: '/practicals/polytechnic/fabrication/line-extension',
            Icon: Expand,
          },
          {
            title: 'Break line',
            blurb: 'A long bar drawn short.',
            route: '/practicals/polytechnic/fabrication/line-break',
            Icon: Split,
          },
          {
            title: 'Cutting plane line',
            blurb: 'Where the job was cut open.',
            route: '/practicals/polytechnic/fabrication/line-cutting-plane',
            Icon: Scissors,
          },
          {
            title: 'Hidden detail line',
            blurb: 'An edge behind the metal.',
            route: '/practicals/polytechnic/fabrication/line-hidden',
            Icon: EyeOff,
          },
          {
            title: 'Open style lettering',
            blurb: 'Upright capitals at full width.',
            route: '/practicals/polytechnic/fabrication/lettering-open',
            Icon: Type,
          },
          {
            title: 'Condensed style lettering',
            blurb: 'Narrowed to fit a tight box.',
            route: '/practicals/polytechnic/fabrication/lettering-condensed',
            Icon: Bold,
          },
          {
            title: 'Sloping style lettering',
            blurb: 'Capitals leaning 15°.',
            route: '/practicals/polytechnic/fabrication/lettering-sloping',
            Icon: Italic,
          },
          {
            title: 'Open style lower case',
            blurb: 'x-height, ascenders and descenders.',
            route: '/practicals/polytechnic/fabrication/lettering-open-lowercase',
            Icon: CaseLower,
          },
          {
            title: 'Open style freehand',
            blurb: 'The same hand with no straight edge.',
            route: '/practicals/polytechnic/fabrication/lettering-open-freehand',
            Icon: PenTool,
          },
          {
            title: 'Sloping style freehand',
            blurb: 'Leaning letters, freehand.',
            route: '/practicals/polytechnic/fabrication/lettering-sloping-freehand',
            Icon: PenLine,
          },
          {
            title: 'Matchstick man and woman',
            blurb: 'A freehand proportion exercise.',
            route: '/practicals/polytechnic/fabrication/sketch-matchstick',
            Icon: Users,
          },
          {
            title: 'Isometric axis sketch',
            blurb: 'Three axes, 120° apart, freehand.',
            route: '/practicals/polytechnic/fabrication/sketch-isometric-axes',
            Icon: Boxes,
          },
          {
            title: 'Most representative views',
            blurb: 'Choosing the front view and top view.',
            route: '/practicals/polytechnic/fabrication/sketch-representative-views',
            Icon: SquareStack,
          },
          {
            title: 'Isometric to first angle',
            blurb: 'Read a pictorial, draw three views.',
            route: '/practicals/polytechnic/fabrication/sketch-iso-to-first-angle',
            Icon: Component,
          },
          {
            title: 'Cylinder cut by a plane',
            blurb: 'The first template: a mitred pipe.',
            route: '/practicals/polytechnic/fabrication/dev-cylinder-cut',
            Icon: Cylinder,
          },
          {
            title: 'Junction of equal cylinders',
            blurb: 'A tee that meets in straight lines.',
            route: '/practicals/polytechnic/fabrication/dev-equal-cylinders',
            Icon: Spline,
          },
          {
            title: 'Rake of a ship funnel',
            blurb: 'A cylinder cut by two sloping planes.',
            route: '/practicals/polytechnic/fabrication/dev-funnel-rake',
            Icon: Anchor,
          },
          {
            title: 'Plates for a boiler dome',
            blurb: 'A dome saddled onto a curved shell.',
            route: '/practicals/polytechnic/fabrication/dev-boiler-dome',
            Icon: CircleDot,
          },
          {
            title: 'Boiler to superheater pipe',
            blurb: 'One pipe, saddled at both ends.',
            route: '/practicals/polytechnic/fabrication/dev-boiler-superheater-pipe',
            Icon: Waves,
          },
          {
            title: 'Overhanging boiler front',
            blurb: 'A flanged blank and its bend allowance.',
            route: '/practicals/polytechnic/fabrication/dev-boiler-front',
            Icon: Disc2,
          },
          {
            title: 'Plates of an egg-ended boiler',
            blurb: 'Barrel strakes and end gores.',
            route: '/practicals/polytechnic/fabrication/dev-egg-ended-boiler',
            Icon: Layers,
          },
          {
            title: 'Frustum not continued to a point',
            blurb: 'A taper whose apex is off the board.',
            route: '/practicals/polytechnic/fabrication/dev-cone-frustum',
            Icon: Filter,
          },
          {
            title: 'Rise and radius of a cone',
            blurb: 'Arcs bigger than your compass.',
            route: '/practicals/polytechnic/fabrication/dev-rise-and-radius',
            Icon: Orbit,
          },
        ],
      },
    ],
  },
];

/**
 * Tailwind is loaded from the Play CDN here, so the scroll-reveal keyframes are
 * written out as plain CSS. Anything carrying data-reveal="out" is hidden and is
 * flipped to "in" by the observer below once it scrolls into view — and back to
 * "out" when it leaves, so scrolling the other way replays the move in reverse.
 * Items grow from their centre as they enter, matching the page transition.
 */
export const REVEAL_STYLES = `
  [data-reveal] {
    will-change: opacity, transform;
    transition: opacity 0.45s ease, transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  [data-reveal='out'] {
    opacity: 0;
    transform: scale(0.9);
  }
  [data-reveal='out'][data-reveal-dir='up'] {
    transform: scale(0.9);
  }
  [data-reveal='in'] {
    opacity: 1;
    transform: none;
  }
  /* While a level is sliding across, everything travels with it — the
     scroll reveal would otherwise fade the incoming page in from nothing. */
  .practicals-reveal-hold [data-reveal] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .practicals-header-in {
    animation: practicalsHeaderIn 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both;
    transform-origin: center center;
  }
  .practicals-page-grow {
    animation: practicalsPageGrow 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: center center;
  }
  @keyframes practicalsHeaderIn {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: none; }
  }
  @keyframes practicalsPageGrow {
    from { opacity: 0; transform: scale(0.86); filter: blur(6px); }
    to { opacity: 1; transform: scale(1); filter: blur(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    [data-reveal],
    .practicals-header-in,
    .practicals-page-grow {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
    }
  }
`;

/**
 * Reveals every [data-reveal] descendant as it scrolls into view and hides it
 * again once it leaves, so the move replays in reverse when you scroll back.
 */
export const useScrollReveal = (
  containerRef: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-reveal]')
    );
    if (nodes.length === 0) return;

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.setAttribute('data-reveal', 'in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.setAttribute('data-reveal', 'in');
            return;
          }
          // Remember which edge it left through so it returns the way it went.
          const rootTop = entry.rootBounds?.top ?? 0;
          target.setAttribute(
            'data-reveal-dir',
            entry.boundingClientRect.top < rootTop ? 'up' : 'down'
          );
          target.setAttribute('data-reveal', 'out');
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
