export type IQDifficulty = 'easy' | 'medium' | 'hard' | 'genius';

export type RebusLayout =
  | 'row'
  | 'stack'
  | 'over'
  | 'under'
  | 'split'
  | 'scattered';

export type IQPuzzle = {
  id: number;
  image: string;
  answer: string;
  acceptableAnswers: string[];
  explanation: string;
  hints: [string, string, string];
  difficulty: IQDifficulty;
  category: string;
  fallback: {
    lines: string[];
    layout: RebusLayout;
    accent?: string;
  };
};

// Add a puzzle by appending one object to this array and placing its image in
// public/images/iq. The trainer automatically picks it up without UI changes.
export const IQ_PUZZLES: IQPuzzle[] = [
  {
    id: 1,
    image: '/images/iq/think-twice.png',
    answer: 'think twice',
    acceptableAnswers: ['think twice', 'thinking twice', 'double think'],
    explanation:
      'Two identical lightbulb thought clouds stacked above a head represent thinking twice.',
    hints: ["It's about repeating a thought.", "Starts with 'Th'.", 'Think twice'],
    difficulty: 'easy',
    category: 'wordplay',
    fallback: { lines: ['THINK', 'THINK'], layout: 'row', accent: '#6c4cff' },
  },
  {
    id: 2,
    image: '/images/iq/tricycle.png',
    answer: 'tricycle',
    acceptableAnswers: ['tricycle', 'tri cycle', 'three cycles'],
    explanation:
      'Three bicycle wheels connected in a triangle formation represent the word “tricycle” (tri-cycle).',
    hints: ['Count what you can see.', "Starts with 'Tri'.", 'Tricycle'],
    difficulty: 'easy',
    category: 'numbers',
    fallback: { lines: ['CYCLE', 'CYCLE', 'CYCLE'], layout: 'row', accent: '#14b8a6' },
  },
  {
    id: 3,
    image: '/images/iq/man-overboard.png',
    answer: 'man overboard',
    acceptableAnswers: ['man overboard', 'a man overboard'],
    explanation:
      'The word MAN positioned directly above BOARD literally represents a man overboard.',
    hints: ['Look at where the person is placed.', "Starts with 'Man'.", 'Man overboard'],
    difficulty: 'easy',
    category: 'position',
    fallback: { lines: ['MAN', 'BOARD'], layout: 'over', accent: '#0ea5e9' },
  },
  {
    id: 4,
    image: '/images/iq/Head%20Over%20Heels.png',
    answer: 'head over heels',
    acceptableAnswers: ['head over heels', 'head over heel'],
    explanation:
      'A person upside down with their head at the bottom and heels at the top literally shows head over heels.',
    hints: ['It is a common expression about falling in love.', "Starts with 'Head'.", 'Head over heels'],
    difficulty: 'easy',
    category: 'phrases',
    fallback: { lines: ['HEAD', 'HEELS'], layout: 'over', accent: '#f43f5e' },
  },
  {
    id: 5,
    image: '/images/iq/i-understand.png',
    answer: 'I understand',
    acceptableAnswers: ['i understand', 'understand', 'I am under stand'],
    explanation:
      'The letter I placed beneath STAND creates “I under stand” — I understand.',
    hints: ['Notice which word is underneath the other.', "Starts with 'I'.", 'I understand'],
    difficulty: 'easy',
    category: 'position',
    fallback: { lines: ['STAND', 'I'], layout: 'under', accent: '#f59e0b' },
  },
  {
    id: 6,
    image: '/images/iq/Reading%20Between%20the%20Lines.png',
    answer: 'read between the lines',
    acceptableAnswers: ['read between the lines', 'reading between the lines'],
    explanation:
      'A magnifying glass focused on the empty gap between text lines illustrates reading between the lines.',
    hints: ['Focus on the two horizontal boundaries.', "Starts with 'Read'.", 'Read between the lines'],
    difficulty: 'medium',
    category: 'phrases',
    fallback: { lines: ['────────', 'READ', '────────'], layout: 'stack', accent: '#8b5cf6' },
  },
  {
    id: 7,
    image: '/images/iq/split-decision.png',
    answer: 'split decision',
    acceptableAnswers: ['split decision', 'a split decision', 'decision split'],
    explanation:
      'The word DECISION split into two separated parts visually represents a split decision.',
    hints: ['One word has been separated.', "Starts with 'Split'.", 'Split decision'],
    difficulty: 'medium',
    category: 'wordplay',
    fallback: { lines: ['DECI', 'SION'], layout: 'split', accent: '#ec4899' },
  },
  {
    id: 8,
    image: '/images/iq/broken-promise.png',
    answer: 'broken promise',
    acceptableAnswers: ['broken promise', 'a broken promise', 'promise broken'],
    explanation:
      'The word PROMISE broken into separated pieces represents a broken promise.',
    hints: ['The word itself has been damaged.', "Starts with 'Broken'.", 'Broken promise'],
    difficulty: 'medium',
    category: 'wordplay',
    fallback: { lines: ['PRO', 'MISE'], layout: 'split', accent: '#ef4444' },
  },
  {
    id: 9,
    image: '/images/iq/backward-glance.png',
    answer: 'backward glance',
    acceptableAnswers: ['backward glance', 'a backward glance', 'glance backwards'],
    explanation:
      'The word GLANCE written backwards visually represents a backward glance.',
    hints: ['Try reading the word in the other direction.', "Starts with 'Backward'.", 'Backward glance'],
    difficulty: 'medium',
    category: 'direction',
    fallback: { lines: ['ECNALG'], layout: 'stack', accent: '#06b6d4' },
  },
  {
    id: 10,
    image: '/images/iq/long-time-no-see.png',
    answer: 'long time no see',
    acceptableAnswers: ['long time no see', 'long time no c'],
    explanation:
      'Repeated TIME followed by NO C creates the sound-alike phrase “long time no see.”',
    hints: ['Sound out the final letter.', "Starts with 'Long'.", 'Long time no see'],
    difficulty: 'medium',
    category: 'phrases',
    fallback: { lines: ['TIME', 'TIME', 'TIME', 'NO C'], layout: 'row', accent: '#22c55e' },
  },
  {
    id: 11,
    image: '/images/iq/crossroads.png',
    answer: 'crossroads',
    acceptableAnswers: ['crossroads', 'cross roads', 'at a crossroads'],
    explanation:
      'Two ROAD words crossing each other visually represent crossroads.',
    hints: ['Two identical words intersect.', "Starts with 'Cross'.", 'Crossroads'],
    difficulty: 'hard',
    category: 'position',
    fallback: { lines: ['ROAD', 'ROAD'], layout: 'scattered', accent: '#f97316' },
  },
  {
    id: 12,
    image: '/images/iq/life-after-death.png',
    answer: 'life after death',
    acceptableAnswers: ['life after death', 'there is life after death'],
    explanation:
      'LIFE placed after DEATH in the reading order represents life after death.',
    hints: ['Read the words in their displayed order.', "Starts with 'Life'.", 'Life after death'],
    difficulty: 'hard',
    category: 'sequence',
    fallback: { lines: ['DEATH', 'LIFE'], layout: 'row', accent: '#84cc16' },
  },
  {
    id: 13,
    image: '/images/iq/just-between-us.png',
    answer: 'just between us',
    acceptableAnswers: ['just between us', 'just in between us'],
    explanation:
      'JUST positioned between the letters U and S creates “just between us.”',
    hints: ['Pay attention to the outside letters.', "Starts with 'Just'.", 'Just between us'],
    difficulty: 'hard',
    category: 'position',
    fallback: { lines: ['U', 'JUST', 'S'], layout: 'row', accent: '#a855f7' },
  },
  {
    id: 14,
    image: '/images/iq/two-left-feet.png',
    answer: 'two left feet',
    acceptableAnswers: ['two left feet', '2 left feet'],
    explanation:
      'Two FEET placed toward a left arrow represent the expression “two left feet.”',
    hints: ['It describes an awkward dancer.', "Starts with 'Two'.", 'Two left feet'],
    difficulty: 'hard',
    category: 'phrases',
    fallback: { lines: ['FEET', 'FEET', '←'], layout: 'row', accent: '#3b82f6' },
  },
  {
    id: 15,
    image: '/images/iq/two-degrees-below-zero.png',
    answer: 'two degrees below zero',
    acceptableAnswers: ['two degrees below zero', '2 degrees below zero'],
    explanation:
      'Two academic degrees written below the number zero represent two degrees below zero.',
    hints: ['Look at the qualifications and their position.', "Starts with 'Two'.", 'Two degrees below zero'],
    difficulty: 'genius',
    category: 'logic',
    fallback: { lines: ['0', 'M.D.  Ph.D.'], layout: 'under', accent: '#6366f1' },
  },
  {
    id: 16,
    image: '/images/iq/standing-ovation.png',
    answer: 'standing ovation',
    acceptableAnswers: ['standing ovation', 'a standing ovation'],
    explanation:
      'The word OVATION arranged upright makes it a literal standing ovation.',
    hints: ['One word is standing upright.', "Starts with 'Standing'.", 'Standing ovation'],
    difficulty: 'genius',
    category: 'wordplay',
    fallback: { lines: ['O', 'V', 'A', 'T', 'I', 'O', 'N'], layout: 'stack', accent: '#eab308' },
  },
  {
    id: 17,
    image: '/images/iq/neon_light.png',
    answer: 'neon light',
    acceptableAnswers: ['neon light', 'neon lights', 'knee on light'],
    explanation:
      'A person kneeling on a glowing green crayon creates the phonetic pun “knee-on” — neon light.',
    hints: ['Say the person’s pose out loud.', "Starts with 'Ne'.", 'Neon light'],
    difficulty: 'easy',
    category: 'sound-alike',
    fallback: { lines: ['🧎', '🟩 LIGHT'], layout: 'over', accent: '#22c55e' },
  },
  {
    id: 18,
    image: '/images/iq/Six%20Feet%20Underground.png',
    answer: 'six feet underground',
    acceptableAnswers: ['six feet underground', 'six foot underground', '6 feet underground'],
    explanation:
      'Exactly six cartoon feet buried beneath soil literally depict six feet underground.',
    hints: ['Count the feet and notice their location.', "Starts with 'Six'.", 'Six feet underground'],
    difficulty: 'easy',
    category: 'numbers',
    fallback: { lines: ['GROUND', '🦶 🦶 🦶 🦶 🦶 🦶'], layout: 'under', accent: '#92400e' },
  },
  {
    id: 19,
    image: '/images/iq/Mind%20Over%20Matter.png',
    answer: 'mind over matter',
    acceptableAnswers: ['mind over matter', 'mind over the matter'],
    explanation:
      'A brain positioned directly above a pile of rocks visually represents mind over matter.',
    hints: ['Compare what is above with what is below.', "Starts with 'Mind'.", 'Mind over matter'],
    difficulty: 'easy',
    category: 'position',
    fallback: { lines: ['🧠 MIND', '🪨 MATTER'], layout: 'over', accent: '#a855f7' },
  },
  {
    id: 20,
    image: '/images/iq/Paradise%20(Pair%20o%27%20Dice).png',
    answer: 'paradise',
    acceptableAnswers: ['paradise', 'pair of dice', "pair o dice", "pair o' dice"],
    explanation:
      'A pair of dice on a tropical island creates the homophone pun “pair o’ dice” — paradise.',
    hints: ['Say what you see quickly.', "Starts with 'Para'.", 'Paradise'],
    difficulty: 'easy',
    category: 'sound-alike',
    fallback: { lines: ['🎲 🎲', '🏝️'], layout: 'stack', accent: '#0ea5e9' },
  },
  {
    id: 21,
    image: '/images/iq/Copycat.png',
    answer: 'copycat',
    acceptableAnswers: ['copycat', 'copy cat', 'a copycat'],
    explanation:
      'A cat beside a photocopier printing an identical duplicate visually illustrates a copycat.',
    hints: ['One character is making a duplicate.', "Starts with 'Copy'.", 'Copycat'],
    difficulty: 'easy',
    category: 'wordplay',
    fallback: { lines: ['COPY', '🐈  🐈'], layout: 'stack', accent: '#6366f1' },
  },
  {
    id: 22,
    image: '/images/iq/Never%20Forget.png',
    answer: 'never forget',
    acceptableAnswers: ['never forget', 'do not forget', "don't forget"],
    explanation:
      'An elephant with a knot tied in its trunk uses two classic memory symbols to represent never forget.',
    hints: ['Think about the animal’s famous memory.', "Starts with 'Never'.", 'Never forget'],
    difficulty: 'easy',
    category: 'idiom',
    fallback: { lines: ['🐘', '🪢 NEVER FORGET'], layout: 'row', accent: '#64748b' },
  },
  {
    id: 23,
    image: '/images/iq/Once%20in%20a%20Blue%20Moon.png',
    answer: 'once in a blue moon',
    acceptableAnswers: ['once in a blue moon', 'one in a blue moon', 'blue moon'],
    explanation:
      'A single blue crescent moon accompanied by exactly one star represents a rare event occurring once in a blue moon.',
    hints: ['This phrase describes something very rare.', "Starts with 'Once'.", 'Once in a blue moon'],
    difficulty: 'easy',
    category: 'idiom',
    fallback: { lines: ['1', '🌙'], layout: 'row', accent: '#2563eb' },
  },
  {
    id: 24,
    image: '/images/iq/Piece%20of%20Cake.jpeg',
    answer: 'piece of cake',
    acceptableAnswers: ['piece of cake', 'a piece of cake', 'cake piece'],
    explanation:
      'A missing jigsaw puzzle piece cut out of a cake slice connects a literal piece to a piece of cake.',
    hints: ['Look at the shape missing from the dessert.', "Starts with 'Piece'.", 'Piece of cake'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['🧩', '🍰'], layout: 'row', accent: '#ec4899' },
  },
  {
    id: 25,
    image: '/images/iq/Raining%20Cats%20and%20Dogs.jpeg',
    answer: 'raining cats and dogs',
    acceptableAnswers: ["it's raining cats and dogs", 'raining cats and dogs', 'rain cats and dogs'],
    explanation:
      'Cartoon cats and dogs falling from a storm cloud instead of raindrops visually depict raining cats and dogs.',
    hints: ['Notice what is falling from the cloud.', "Starts with 'Raining'.", 'Raining cats and dogs'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['🌧️', '🐈 🐕 🐈 🐕'], layout: 'stack', accent: '#0ea5e9' },
  },
  {
    id: 26,
    image: '/images/iq/Ants%20in%20Your%20Pants.png',
    answer: 'ants in your pants',
    acceptableAnswers: ['ants in your pants', 'ants in my pants', 'ants in the pants'],
    explanation:
      'A pair of pants wiggling with ants crawling on them represents feeling fidgety or restless.',
    hints: ['It means someone cannot sit still.', "Starts with 'Ants'.", 'Ants in your pants'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['🐜 🐜 🐜', '👖'], layout: 'over', accent: '#f97316' },
  },
  {
    id: 27,
    image: '/images/iq/Cat%20Got%20Your%20Tongue.png',
    answer: 'cat got your tongue',
    acceptableAnswers: ['cat got your tongue', 'the cat got your tongue', 'cat has your tongue'],
    explanation:
      'A calm cat holding a tongue shape in its paws illustrates being left speechless — cat got your tongue.',
    hints: ['This is asked when someone suddenly goes quiet.', "Starts with 'Cat'.", 'Cat got your tongue'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['🐈', '👅'], layout: 'row', accent: '#f43f5e' },
  },
  {
    id: 28,
    image: '/images/iq/Bookworm.png',
    answer: 'bookworm',
    acceptableAnswers: ['bookworm', 'book worm', 'a bookworm'],
    explanation:
      'A worm wearing glasses and poking out of a book merges being studious with a literal worm in a book.',
    hints: ['This nickname describes someone who loves reading.', "Starts with 'Book'.", 'Bookworm'],
    difficulty: 'medium',
    category: 'wordplay',
    fallback: { lines: ['📖', '🐛'], layout: 'row', accent: '#84cc16' },
  },
  {
    id: 29,
    image: '/images/iq/timeflies.png',
    answer: 'time flies',
    acceptableAnswers: ['time flies', 'time fly', 'flying time'],
    explanation:
      'Cartoon flies orbiting an hourglass create a literal visual pun on time flying.',
    hints: ['Combine the hourglass with the insects.', "Starts with 'Time'.", 'Time flies'],
    difficulty: 'medium',
    category: 'wordplay',
    fallback: { lines: ['🪰 🪰', '⌛', '🪰'], layout: 'scattered', accent: '#eab308' },
  },
  {
    id: 30,
    image: '/images/iq/Butterflies%20in%20My%20Stomach.png',
    answer: 'butterflies in my stomach',
    acceptableAnswers: ['butterflies in my stomach', 'butterflies in your stomach', 'butterflies in the stomach'],
    explanation:
      'Butterflies fluttering inside a transparent belly outline depict the nervous feeling of butterflies in one’s stomach.',
    hints: ['This feeling often happens before a big event.', "Starts with 'Butterflies'.", 'Butterflies in my stomach'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['STOMACH', '🦋 🦋 🦋'], layout: 'under', accent: '#d946ef' },
  },
  {
    id: 31,
    image: '/images/iq/Break%20the%20Ice.png',
    answer: 'break the ice',
    acceptableAnswers: ['break the ice', 'breaking the ice', 'broken ice'],
    explanation:
      'An ice cube with a single clean crack running through it literally depicts breaking the ice.',
    hints: ['The frozen object is no longer whole.', "Starts with 'Break'.", 'Break the ice'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['ICE', '❄️  ❄️'], layout: 'split', accent: '#06b6d4' },
  },
  {
    id: 32,
    image: '/images/iq/Spill%20the%20Beans.png',
    answer: 'spill the beans',
    acceptableAnswers: ['spill the beans', 'spilling the beans', 'spilled the beans'],
    explanation:
      'Coffee beans tumbling out of a tipped jar literally illustrate the phrase spill the beans.',
    hints: ['It means revealing a secret.', "Starts with 'Spill'.", 'Spill the beans'],
    difficulty: 'medium',
    category: 'idiom',
    fallback: { lines: ['🫙', '🫘 🫘 🫘'], layout: 'split', accent: '#92400e' },
  },
  {
    id: 33,
    image: '/images/iq/ironage.jpeg',
    answer: 'iron age',
    acceptableAnswers: ['iron age', 'the iron age', 'iron edge'],
    explanation:
      'A clothes iron sitting on the edge of a cliff creates the sound-alike pun “iron edge” — Iron Age.',
    hints: ['Say the object and its position together.', "Starts with 'Iron'.", 'Iron Age'],
    difficulty: 'hard',
    category: 'sound-alike',
    fallback: { lines: ['IRON', 'EDGE ┐'], layout: 'row', accent: '#475569' },
  },
  {
    id: 34,
    image: '/images/iq/bakersdozen.png',
    answer: "baker's dozen",
    acceptableAnswers: ["baker's dozen", 'bakers dozen', 'thirteen', '13 loaves'],
    explanation:
      'A baker holding a tray with 13 loaves of bread depicts the exact quantity of a baker’s dozen.',
    hints: ['Count the baked items carefully.', "Starts with 'Baker'.", "Baker's dozen"],
    difficulty: 'hard',
    category: 'numbers',
    fallback: { lines: ['👩‍🍳', '🥖 × 13'], layout: 'row', accent: '#f59e0b' },
  },
  {
    id: 35,
    image: '/images/iq/Egg-cellent.jpeg',
    answer: 'egg-cellent',
    acceptableAnswers: ['egg-cellent', 'eggcellent', 'excellent egg', 'excellent'],
    explanation:
      'An egg standing on a first-place podium with a gold medal creates the pun “egg-cellent.”',
    hints: ['Combine the character with a word of praise.', "Starts with 'Egg'.", 'Egg-cellent'],
    difficulty: 'hard',
    category: 'sound-alike',
    fallback: { lines: ['🥇', '🥚'], layout: 'stack', accent: '#eab308' },
  },
  {
    id: 36,
    image: '/images/iq/Under%20the%20Weather.jpeg',
    answer: 'under the weather',
    acceptableAnswers: ['under the weather', 'feeling under the weather', 'i am under the weather'],
    explanation:
      'A sick person in bed beneath an indoor rain cloud illustrates being under the weather.',
    hints: ['The person looks unwell and is below something.', "Starts with 'Under'.", 'Under the weather'],
    difficulty: 'hard',
    category: 'idiom',
    fallback: { lines: ['🌧️ WEATHER', '🤒'], layout: 'under', accent: '#3b82f6' },
  },
  {
    id: 37,
    image: '/images/iq/Let%20the%20Cat%20Out%20of%20the%20Bag.png',
    answer: 'let the cat out of the bag',
    acceptableAnswers: ['let the cat out of the bag', 'cat out of the bag', 'the cat is out of the bag'],
    explanation:
      'A cat poking its head and paws out of an untied bag represents letting the cat out of the bag.',
    hints: ['The picture also means revealing a secret.', "Starts with 'Let'.", 'Let the cat out of the bag'],
    difficulty: 'hard',
    category: 'idiom',
    fallback: { lines: ['🐈', '🛍️ BAG'], layout: 'over', accent: '#a855f7' },
  },
  {
    id: 38,
    image: '/images/iq/On%20Thin%20Ice.png',
    answer: 'on thin ice',
    acceptableAnswers: ['on thin ice', 'walking on thin ice', 'standing on thin ice'],
    explanation:
      'A penguin standing on a small cracked patch of ice above deep water depicts being on thin ice.',
    hints: ['The surface beneath the animal is unsafe.', "Starts with 'On'.", 'On thin ice'],
    difficulty: 'hard',
    category: 'idiom',
    fallback: { lines: ['🐧', '──── THIN ICE'], layout: 'over', accent: '#38bdf8' },
  },
  {
    id: 39,
    image: '/images/iq/Fish%20Out%20of%20Water.jpeg',
    answer: 'fish out of water',
    acceptableAnswers: ['fish out of water', 'a fish out of water', 'fish outside water'],
    explanation:
      'A fish flopping on dry sand beside an empty puddle illustrates a fish out of water.',
    hints: ['The animal is far from where it belongs.', "Starts with 'Fish'.", 'Fish out of water'],
    difficulty: 'hard',
    category: 'idiom',
    fallback: { lines: ['🐟', '🏜️   💧'], layout: 'row', accent: '#0ea5e9' },
  },
  {
    id: 40,
    image: '/images/iq/Couch%20Potato.png',
    answer: 'couch potato',
    acceptableAnswers: ['couch potato', 'a couch potato', 'sofa potato'],
    explanation:
      'A potato character holding a remote while relaxing on a couch represents a couch potato.',
    hints: ['Combine the character with the furniture.', "Starts with 'Couch'.", 'Couch potato'],
    difficulty: 'hard',
    category: 'wordplay',
    fallback: { lines: ['🥔', '🛋️'], layout: 'row', accent: '#ea580c' },
  },
  {
    id: 41,
    image: '/images/iq/elephantintheroom.png',
    answer: 'elephant in the room',
    acceptableAnswers: ['elephant in the room', 'the elephant in the room', 'an elephant in the room'],
    explanation:
      'A giant elephant filling a living room while everyone ignores it represents the elephant in the room.',
    hints: ['It is an obvious issue no one wants to discuss.', "Starts with 'Elephant'.", 'Elephant in the room'],
    difficulty: 'genius',
    category: 'idiom',
    fallback: { lines: ['ROOM', '🐘'], layout: 'under', accent: '#64748b' },
  },
  {
    id: 42,
    image: '/images/iq/Cool%20as%20a%20Cucumber.png',
    answer: 'cool as a cucumber',
    acceptableAnswers: ['cool as a cucumber', 'as cool as a cucumber', 'cool cucumber'],
    explanation:
      'A cucumber wearing sunglasses and relaxing with ice cubes illustrates being cool as a cucumber.',
    hints: ['This describes someone who stays very calm.', "Starts with 'Cool'.", 'Cool as a cucumber'],
    difficulty: 'genius',
    category: 'idiom',
    fallback: { lines: ['🥒 😎', '🧊 🧊'], layout: 'row', accent: '#16a34a' },
  },
];

export const IQ_DIFFICULTY_XP: Record<IQDifficulty, number> = {
  easy: 0,
  medium: 50,
  hard: 140,
  genius: 300,
};

export const IQ_DIFFICULTY_POINTS: Record<IQDifficulty, number> = {
  easy: 10,
  medium: 15,
  hard: 22,
  genius: 30,
};
