export interface IQCategory {
  id: 'math' | 'general' | 'geography' | 'astronomy' | 'cars' | 'logos';
  name: string;
  subLabel: string;
  bottomLabel: string;
  tag: string;
  themeGradient: string;
  accentColor: string;
  image: string;
  description: string;
  badge: string;
  totalQuestions: number;
}

export const IQ_CATEGORIES: IQCategory[] = [
  {
    id: 'math',
    name: 'Mathematics IQ',
    subLabel: 'Patterns & Mental Arithmetic',
    bottomLabel: 'MATH',
    tag: 'LOGIC',
    themeGradient: 'bg-purple-700 text-white',
    accentColor: '#a800d5',
    image: '/images/iq/categories/math.webp',
    description: 'Test sequence solving, numerical patterns, fast mental calculation and arithmetic reasoning.',
    badge: 'bg-white/20 text-white',
    totalQuestions: 25,
  },
  {
    id: 'general',
    name: 'General Knowledge',
    subLabel: 'Trivia, World Facts & Science',
    bottomLabel: 'GK',
    tag: 'TRIVIA',
    themeGradient: 'bg-blue-700 text-white',
    accentColor: '#4700d7',
    image: '/images/iq/categories/general.webp',
    description: 'Explore high-yield world trivia spanning history milestones, global wonders, and discoveries.',
    badge: 'bg-white/20 text-white',
    totalQuestions: 30,
  },
  {
    id: 'geography',
    name: 'World Geography',
    subLabel: 'Interactive 3D Map Quizzes',
    bottomLabel: 'GEO',
    tag: 'MAPS',
    themeGradient: 'bg-teal-700 text-white',
    accentColor: '#008878',
    image: '/images/iq/categories/geography.webp',
    description: 'Explore the interactive world map, find countries by flag, name or world-famous monuments.',
    badge: 'bg-white/20 text-white',
    totalQuestions: 50,
  },
  {
    id: 'astronomy',
    name: 'Astronomy & Cosmos',
    subLabel: 'Stars, Planets & Universe',
    bottomLabel: 'SPACE',
    tag: 'COSMOS',
    themeGradient: 'bg-indigo-800 text-white',
    accentColor: '#6100bb',
    image: '/images/iq/categories/astronomy.webp',
    description: 'Challenge your knowledge of the solar system, galaxies, Apollo missions, and cosmic phenomena.',
    badge: 'bg-white/20 text-white',
    totalQuestions: 25,
  },
  {
    id: 'cars',
    name: 'Car Enthusiast IQ',
    subLabel: 'Supercars & Automakers',
    bottomLabel: 'CARS',
    tag: 'AUTO',
    themeGradient: 'bg-rose-700 text-white',
    accentColor: '#df005d',
    image: '/images/iq/categories/cars.webp',
    description: 'Identify iconic supercars, parent automakers, legendary engines, and automotive origins.',
    badge: 'bg-white/20 text-white',
    totalQuestions: 30,
  },
  {
    id: 'logos',
    name: 'Famous Brand Logos',
    subLabel: 'Guess the Logo & 3D Flip',
    bottomLabel: 'LOGOS',
    tag: 'BRANDS',
    themeGradient: 'bg-cyan-700 text-white',
    accentColor: '#007ea0',
    image: '/images/iq/categories/logos.webp',
    description: 'Test your brand recognition! Pick A, B, C or D and watch the card 3D-flip to reveal the answer and brand story.',
    badge: 'bg-white/20 text-white',
    totalQuestions: 40,
  },
];
