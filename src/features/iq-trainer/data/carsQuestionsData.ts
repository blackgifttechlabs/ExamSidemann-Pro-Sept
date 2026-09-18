export interface CarQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  category: 'Supercars' | 'Automakers' | 'Engines' | 'History';
}

export const CARS_QUESTIONS: CarQuestion[] = [
  {
    id: 'c1',
    question: 'Which legendary supercar broke the 300 mph (482 km/h) barrier in 2019?',
    options: ['Koenigsegg Agera RS', 'Bugatti Chiron Super Sport 300+', 'Hennessey Venom F5', 'SSC Tuatara'],
    correctAnswer: 'Bugatti Chiron Super Sport 300+',
    explanation: 'Bugatti test driver Andy Wallace piloted a modified Chiron Super Sport 300+ to 304.77 mph (490.48 km/h) at Ehra-Lessien in August 2019.',
    category: 'Supercars',
  },
  {
    id: 'c2',
    question: 'Which major automotive conglomerate owns both Audi and Porsche?',
    options: ['BMW Group', 'Volkswagen Group (VAG)', 'Stellantis', 'Mercedes-Benz Group'],
    correctAnswer: 'Volkswagen Group (VAG)',
    explanation: 'The Volkswagen Group owns Volkswagen, Audi, Porsche, Lamborghini, Bentley, Ducati, and Skoda.',
    category: 'Automakers',
  },
  {
    id: 'c3',
    question: 'What distinctive engine cylinder layout is famously used in the Porsche 911 and Subaru WRX?',
    options: ['Inline-4', 'Rotary Engine', 'Boxer (Flat) Engine', 'V6 Engine'],
    correctAnswer: 'Boxer (Flat) Engine',
    explanation: 'Both Porsche and Subaru champion the boxer (horizontally opposed flat) engine, which provides a lower center of gravity.',
    category: 'Engines',
  },
  {
    id: 'c4',
    question: 'What was the first mass-produced automobile assembled on a moving assembly line in 1913?',
    options: ['Ford Model T', 'Chevrolet Series 490', 'Oldsmobile Curved Dash', 'Volkswagen Beetle'],
    correctAnswer: 'Ford Model T',
    explanation: 'Henry Ford introduced the moving assembly line in Highland Park, Michigan, dramatically cutting Model T production time from 12 hours to 93 minutes.',
    category: 'History',
  },
  {
    id: 'c5',
    question: 'Which country is the birthplace of the supercar manufacturer Koenigsegg?',
    options: ['Denmark', 'Sweden', 'Norway', 'Finland'],
    correctAnswer: 'Sweden',
    explanation: 'Koenigsegg Automotive AB was founded in 1994 in Ängelholm, Sweden, by Christian von Koenigsegg.',
    category: 'Supercars',
  },
  {
    id: 'c6',
    question: 'What quad-turbocharged engine configuration powers the Bugatti Veyron and Chiron?',
    options: ['V12', 'V16', 'W16', 'Twin-Turbo V8'],
    correctAnswer: 'W16',
    explanation: 'Bugatti utilizes an 8.0-liter, 16-cylinder engine arranged in a W configuration with four turbochargers.',
    category: 'Engines',
  },
  {
    id: 'c7',
    question: 'What famous Japanese sports car is nicknamed "Godzilla"?',
    options: ['Toyota Supra MK4', 'Mazda RX-7', 'Nissan GT-R (Skyline)', 'Honda NSX'],
    correctAnswer: 'Nissan GT-R (Skyline)',
    explanation: 'Australian motoring magazine Wheels coined the nickname "Godzilla" for the Nissan Skyline GT-R R32 in 1989 after it dominated touring car races.',
    category: 'Supercars',
  },
  {
    id: 'c8',
    question: 'Which brand produces the iconic luxury off-roader known as the "G-Wagon" (Geländewagen)?',
    options: ['BMW', 'Audi', 'Mercedes-Benz', 'Land Rover'],
    correctAnswer: 'Mercedes-Benz',
    explanation: 'The Mercedes-Benz G-Class, originally developed as a military vehicle in 1979, is affectionately known worldwide as the G-Wagon.',
    category: 'Automakers',
  }
];
