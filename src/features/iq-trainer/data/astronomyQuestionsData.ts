export interface AstronomyQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  topic: 'Solar System' | 'Deep Space' | 'Cosmology' | 'Space Missions';
}

export const ASTRONOMY_QUESTIONS: AstronomyQuestion[] = [
  {
    id: 'a1',
    question: 'Which planet in our solar system has the most extensive and visible ring system?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correctAnswer: 'Saturn',
    explanation: 'Saturn possesses the most prominent and majestic ring system, composed mostly of water ice particles and rocky debris.',
    topic: 'Solar System',
  },
  {
    id: 'a2',
    question: 'What is the closest star system to our Sun, located approximately 4.24 light-years away?',
    options: ['Sirius', 'Alpha Centauri', 'Betelgeuse', 'Vega'],
    correctAnswer: 'Alpha Centauri',
    explanation: 'Alpha Centauri is a triple star system, with Proxima Centauri being the closest individual star to our Sun at ~4.24 light-years.',
    topic: 'Deep Space',
  },
  {
    id: 'a3',
    question: 'Which NASA mission first landed humans on the Moon on July 20, 1969?',
    options: ['Apollo 8', 'Apollo 11', 'Apollo 13', 'Gemini 4'],
    correctAnswer: 'Apollo 11',
    explanation: 'Apollo 11 carried astronauts Neil Armstrong, Buzz Aldrin, and Michael Collins to lunar orbit and the Sea of Tranquility.',
    topic: 'Space Missions',
  },
  {
    id: 'a4',
    question: 'What is the boundary around a black hole beyond which no light or radiation can escape?',
    options: ['Photon Sphere', 'Singularity', 'Event Horizon', 'Accretion Disk'],
    correctAnswer: 'Event Horizon',
    explanation: 'The event horizon is the threshold where the escape velocity of the gravitational field equals the speed of light.',
    topic: 'Cosmology',
  },
  {
    id: 'a5',
    question: 'Which planet is known as the "Red Planet" due to widespread iron oxide rust on its surface?',
    options: ['Venus', 'Mars', 'Mercury', 'Jupiter'],
    correctAnswer: 'Mars',
    explanation: 'Mars appears reddish-orange because its regolith is saturated with ferric oxide (iron oxide minerals/rust).',
    topic: 'Solar System',
  },
  {
    id: 'a6',
    question: 'What is the largest moon in the Solar System, even bigger than the planet Mercury?',
    options: ['Titan', 'Ganymede', 'Callisto', 'Europa'],
    correctAnswer: 'Ganymede',
    explanation: 'Ganymede, orbiting Jupiter, has a diameter of 5,268 km, making it larger than Mercury and Pluto.',
    topic: 'Solar System',
  },
  {
    id: 'a7',
    question: 'Which space telescope launched on Christmas Day 2021 observes the universe primarily in infrared?',
    options: ['Hubble', 'James Webb Space Telescope (JWST)', 'Spitzer', 'Kepler'],
    correctAnswer: 'James Webb Space Telescope (JWST)',
    explanation: 'The JWST was launched on December 25, 2021, and orbits the Sun-Earth L2 Lagrange point to view early cosmic structures.',
    topic: 'Space Missions',
  },
  {
    id: 'a8',
    question: 'What galaxy is on a collision course with our Milky Way, predicted to merge in about 4.5 billion years?',
    options: ['Triangulum Galaxy', 'Andromeda Galaxy', 'Sombrero Galaxy', 'Large Magellanic Cloud'],
    correctAnswer: 'Andromeda Galaxy',
    explanation: 'Andromeda (M31) is approaching the Milky Way at roughly 110 km/s and will merge into a giant elliptical galaxy dubbed Milkomeda.',
    topic: 'Deep Space',
  }
];
