export interface GKQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  category: 'World History' | 'Science & Nature' | 'World Records' | 'Inventions' | 'Arts & Culture';
}

export const GK_QUESTIONS: GKQuestion[] = [
  {
    id: 'gk1',
    question: 'Who is universally credited with developing the theory of General Relativity in 1915?',
    options: ['Isaac Newton', 'Albert Einstein', 'Niels Bohr', 'Max Planck'],
    correctAnswer: 'Albert Einstein',
    explanation: 'Albert Einstein published his revolutionary field equations of General Relativity in November 1915, replacing Newtonian gravitation.',
    category: 'Science & Nature',
  },
  {
    id: 'gk2',
    question: 'What is the highest mountain peak in Africa, standing at 5,895 meters above sea level?',
    options: ['Mount Kenya', 'Mount Kilimanjaro', 'Mount Stanley', 'Ras Dashen'],
    correctAnswer: 'Mount Kilimanjaro',
    explanation: 'Mount Kilimanjaro in Tanzania is Africa’s highest peak and the highest single free-standing mountain in the world.',
    category: 'World Records',
  },
  {
    id: 'gk3',
    question: 'Which ancient wonder was located in Alexandria, Egypt, guiding seafarers for centuries?',
    options: ['Colossus of Rhodes', 'Lighthouse of Alexandria', 'Hanging Gardens', 'Mausoleum at Halicarnassus'],
    correctAnswer: 'Lighthouse of Alexandria',
    explanation: 'The Pharos of Alexandria was built by the Ptolemaic Kingdom around 280 BC and stood over 100 meters tall.',
    category: 'World History',
  },
  {
    id: 'gk4',
    question: 'What is the only element on the periodic table that is a liquid metal at standard room temperature?',
    options: ['Bromine', 'Mercury', 'Gallium', 'Francium'],
    correctAnswer: 'Mercury',
    explanation: 'Mercury (Hg) is the only metallic element that remains liquid at standard conditions for temperature and pressure.',
    category: 'Science & Nature',
  },
  {
    id: 'gk5',
    question: 'In what year was the United Nations officially established following World War II?',
    options: ['1942', '1945', '1948', '1950'],
    correctAnswer: '1945',
    explanation: 'The United Nations was established on October 24, 1945, after the UN Charter was ratified in San Francisco.',
    category: 'World History',
  },
  {
    id: 'gk6',
    question: 'Who painted the ceiling of the Sistine Chapel in Rome between 1508 and 1512?',
    options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
    correctAnswer: 'Michelangelo',
    explanation: 'Michelangelo Buonarroti spent four years painting the intricate ceiling frescoes commissioned by Pope Julius II.',
    category: 'Arts & Culture',
  },
  {
    id: 'gk7',
    question: 'Which scientist discovered penicillin in 1928, marking the dawn of modern antibiotics?',
    options: ['Louis Pasteur', 'Alexander Fleming', 'Edward Jenner', 'Robert Koch'],
    correctAnswer: 'Alexander Fleming',
    explanation: 'Scottish physician and microbiologist Alexander Fleming noticed a halo of inhibited bacteria around Penicillium notatum mould.',
    category: 'Inventions',
  },
  {
    id: 'gk8',
    question: 'What is the deepest oceanic trench on Earth, plunging nearly 11,000 meters down?',
    options: ['Puerto Rico Trench', 'Mariana Trench', 'Java Trench', 'Tonga Trench'],
    correctAnswer: 'Mariana Trench',
    explanation: 'The Mariana Trench in the western Pacific Ocean contains Challenger Deep, the deepest known point on Earth.',
    category: 'World Records',
  }
];
