export interface MathQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
  category: 'Sequences' | 'Arithmetic' | 'Logic' | 'Geometry' | 'Algebra';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const MATH_QUESTIONS: MathQuestion[] = [
  {
    id: 'm1',
    question: 'Find the next number in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['38', '40', '42', '44'],
    correctAnswer: '42',
    explanation: 'The differences between consecutive terms increase by 2: +4, +6, +8, +10, +12. Thus, 30 + 12 = 42. (Or n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42).',
    category: 'Sequences',
    difficulty: 'Easy',
  },
  {
    id: 'm2',
    question: 'If a bat and a ball cost $1.10 in total, and the bat costs $1.00 more than the ball, how much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.01'],
    correctAnswer: '$0.05',
    explanation: 'Let ball = x. Bat = x + 1.00. x + (x + 1.00) = 1.10 => 2x = 0.10 => x = $0.05 (5 cents).',
    category: 'Logic',
    difficulty: 'Medium',
  },
  {
    id: 'm3',
    question: 'What is the missing number in the grid pattern? 3, 5, 9, 17, 33, ?',
    options: ['49', '65', '64', '57'],
    correctAnswer: '65',
    explanation: 'Each term is obtained by doubling and subtracting 1: 3*2 - 1 = 5, 5*2 - 1 = 9, 9*2 - 1 = 17, 17*2 - 1 = 33, 33*2 - 1 = 65. (Or add powers of 2: +2, +4, +8, +16, +32).',
    category: 'Sequences',
    difficulty: 'Easy',
  },
  {
    id: 'm4',
    question: 'If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    options: ['100 minutes', '50 minutes', '5 minutes', '1 minute'],
    correctAnswer: '5 minutes',
    explanation: 'Each machine takes 5 minutes to complete 1 widget. With 100 machines working simultaneously, they will produce 100 widgets in the same 5 minutes.',
    category: 'Logic',
    difficulty: 'Medium',
  },
  {
    id: 'm5',
    question: 'Solve for x: 3^(x + 1) = 81',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    explanation: '81 = 3^4. Therefore x + 1 = 4, which means x = 3.',
    category: 'Algebra',
    difficulty: 'Easy',
  },
  {
    id: 'm6',
    question: 'A clock shows 3:15. What is the acute angle between the hour hand and the minute hand?',
    options: ['0°', '7.5°', '15°', '22.5°'],
    correctAnswer: '7.5°',
    explanation: 'At 3:15, the minute hand is exactly at 90°. In 15 minutes, the hour hand has moved 15 * 0.5° = 7.5° past 90°. The angle between them is 7.5°.',
    category: 'Geometry',
    difficulty: 'Hard',
  },
  {
    id: 'm7',
    question: 'What is the sum of the angles in a regular hexagon?',
    options: ['360°', '540°', '720°', '900°'],
    correctAnswer: '720°',
    explanation: 'Formula for the sum of interior angles is (n - 2) * 180°. For a hexagon (n=6), (6 - 2) * 180° = 4 * 180° = 720°.',
    category: 'Geometry',
    difficulty: 'Easy',
  },
  {
    id: 'm8',
    question: 'What is 15% of 80 plus 25% of 60?',
    options: ['27', '25', '30', '28'],
    correctAnswer: '27',
    explanation: '15% of 80 = 12. 25% of 60 = 15. 12 + 15 = 27.',
    category: 'Arithmetic',
    difficulty: 'Easy',
  },
  {
    id: 'm9',
    question: 'What comes next: 1, 1, 2, 3, 5, 8, 13, 21, ?',
    options: ['34', '32', '35', '29'],
    correctAnswer: '34',
    explanation: 'This is the Fibonacci sequence, where each number is the sum of the two preceding numbers: 13 + 21 = 34.',
    category: 'Sequences',
    difficulty: 'Easy',
  },
  {
    id: 'm10',
    question: 'A train traveling at 60 km/h crosses a 500m long bridge in 45 seconds. What is the length of the train?',
    options: ['200 meters', '250 meters', '300 meters', '150 meters'],
    correctAnswer: '250 meters',
    explanation: '60 km/h = 60 * (5/18) = 50/3 m/s. In 45 seconds, distance covered = (50/3) * 45 = 750 meters. Train length = 750m - 500m = 250 meters.',
    category: 'Arithmetic',
    difficulty: 'Hard',
  },
];
