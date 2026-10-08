/*
 * Lesson content for the Probabilities page. Same block format as
 * variationLessonData.ts, plus { diagram: 'name', caption? } for the SVG figures
 * in probabilityDiagrams.tsx.
 *
 * Cards with a "Source:" line come from the ZIMSEC papers listed there (wording
 * shortened). Cards that say "Practice question" were written in the same style.
 *
 * Probability questions found in the six papers we could read
 * (Nov 2020 P2, Nov 2021 P1, Nov 2022 P1, Jun 2023 P1, Nov 2023 P1, Nov 2025 P2):
 *   Nov 2020 P2 Q10(e)  two seedlings picked at random (no replacement)
 *   Nov 2022 P1 Q21(b)  two balls from a bag, ball replaced
 *   Jun 2023 P1 Q20(c)  two learners chosen at random (no replacement)
 *   Nov 2023 P1 Q22     tree diagram, striker scoring in two halves
 *   Nov 2025 P2 Q10(f)  one learner chosen from a frequency table
 */

type Solver = { title: string; problem: string; steps: { text: string; why?: string }[]; answer: string };

/* ---------------------------------------------------------------- real past-paper working */

const SOLVE_N2025_Q10F: Solver = {
  title: 'ZIMSEC November 2025, Paper 2, Question 10(f)',
  problem: '30 learners were measured: 6 are 150-160 cm, 9 are 160-170 cm, 13 are 170-190 cm and 2 are 190-200 cm. One learner is chosen at random. Find P(height is more than 170 and up to 190).',
  steps: [
    { text: 'P = ways we want ÷ all outcomes', why: 'The same formula as always.' },
    { text: 'Learners in 170 to 190 cm: 13', why: 'Read this from the table.' },
    { text: 'All learners: 6 + 9 + 13 + 2 = 30', why: 'Add every frequency.' },
    { text: 'P = 13/30', why: 'This fraction does not cancel.' },
  ],
  answer: 'P = 13/30',
};

const SOLVE_N2022_Q21B: Solver = {
  title: 'ZIMSEC November 2022, Paper 1, Question 21(b)',
  problem: 'A bag has 20 balls: 3 green, 5 red, 12 brown. One ball is picked, its colour noted and it is replaced. A second ball is picked. Find P(both balls are the same colour).',
  steps: [
    { text: 'Same colour: GG or RR or BB', why: 'There are three ways to get the same colour.' },
    { text: 'P(GG) = 3/20 × 3/20 = 9/400', why: 'Replaced, so the second pick is still out of 20.' },
    { text: 'P(RR) = 5/20 × 5/20 = 25/400', why: '' },
    { text: 'P(BB) = 12/20 × 12/20 = 144/400', why: '' },
    { text: 'Add: 9/400 + 25/400 + 144/400', why: 'OR means add the paths.' },
    { text: '= 178/400 = 89/200', why: 'Cancel by 2. As a decimal this is 0.445.' },
  ],
  answer: 'P(same colour) = 89/200',
};

const SOLVE_J2023_Q20C: Solver = {
  title: 'ZIMSEC June 2023, Paper 1, Question 20(c)',
  problem: 'A school has 128 learners in Form 1, 127 in Form 2, 125 in Form 3 and 120 in Form 4. Two learners are chosen at random. Find P(both are in Form 3).',
  steps: [
    { text: 'All learners: 128 + 127 + 125 + 120 = 500', why: 'Add the four forms.' },
    { text: 'P(1st in Form 3) = 125/500', why: '' },
    { text: 'P(2nd in Form 3) = 124/499', why: 'One Form 3 learner has gone, so 124 are left out of 499.' },
    { text: 'P(both) = 125/500 × 124/499', why: 'AND means multiply.' },
    { text: '= 15500/249500 = 31/499', why: 'Cancel by 500. This is about 0.062.' },
  ],
  answer: 'P(both in Form 3) = 31/499',
};

const SOLVE_N2020_Q10E: Solver = {
  title: 'ZIMSEC November 2020, Paper 2, Question 10(e)',
  problem: '30 seedlings: 5 are at most 20 cm tall, 6 are 20-25 cm, 10 are 25-35 cm and 9 are more than 35 cm. Two seedlings are picked at random. Find P(one is at most 20 cm and the other is more than 35 cm).',
  steps: [
    { text: 'Two orders: short then tall, or tall then short', why: 'The question does not say which comes first, so find both and add.' },
    { text: 'Short then tall: 5/30 × 9/29 = 45/870', why: 'Not put back, so the second pick is out of 29.' },
    { text: 'Tall then short: 9/30 × 5/29 = 45/870', why: '' },
    { text: 'Add: 45/870 + 45/870 = 90/870', why: '' },
    { text: '= 3/29', why: 'Cancel by 30.' },
  ],
  answer: 'P = 3/29',
};

const SOLVE_N2023_Q22: Solver = {
  title: 'ZIMSEC November 2023, Paper 1, Question 22',
  problem: 'Den scores in the first half with probability 0.6. If he scores in the first half, he scores in the second half with probability 0.8. If he does not, he scores in the second half with probability 0.5. Find P(scores in both halves) and P(scores only once).',
  steps: [
    { text: 'Both halves: score, then score', why: 'Follow the top path on the tree.' },
    { text: 'P = 0.6 × 0.8 = 0.48', why: 'Multiply along the branches.' },
    { text: 'Only once: S then N, or N then S', why: 'Two paths. Find each, then add.' },
    { text: 'S then N: 0.6 × 0.2 = 0.12', why: 'If he scored, the chance he does not is 1 - 0.8 = 0.2.' },
    { text: 'N then S: 0.4 × 0.5 = 0.20', why: 'The chance he did not score first is 1 - 0.6 = 0.4.' },
    { text: 'Add: 0.12 + 0.20 = 0.32', why: '' },
  ],
  answer: 'Both halves: 0.48. Only once: 0.32',
};

/* ---------------------------------------------------------------- exam cards */

const REAL = {
  nov25q10f: {
    level: 'Easy / Medium',
    topic: 'Probability from a table',
    lines: ['The heights of 30 learners are shown: 150-160 cm has 6 learners, 160-170 cm has 9, 170-190 cm has 13 and 190-200 cm has 2.', 'Find the probability that a learner chosen at random has a height in the range 170 < h ≤ 190.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 10(f). Skill: ways we want ÷ all outcomes.',
    solution: ['Learners in the range: 13', 'All learners: 6 + 9 + 13 + 2 = 30', '**P = 13/30**'],
  },
  nov22q21b: {
    level: 'Medium',
    topic: 'Two picks with replacement',
    lines: ['A bag has 20 balls, all the same except for colour: 3 green, 5 red and 12 brown.', 'One ball is picked at random, its colour noted, and it is replaced. A second ball is picked and its colour noted.', 'Calculate the probability that both balls are the same colour.'],
    skill: 'Source: ZIMSEC November 2022, Paper 1, Question 21(b). Skill: multiply along a path, add the paths.',
    solution: ['`P(GG) = 3/20 × 3/20 = 9/400`', '`P(RR) = 5/20 × 5/20 = 25/400`', '`P(BB) = 12/20 × 12/20 = 144/400`', '`9/400 + 25/400 + 144/400 = 178/400`', '**P = 89/200**'],
  },
  jun23q20c: {
    level: 'Medium',
    topic: 'Two picks without replacement',
    lines: ['A school has 128 learners in Form 1, 127 in Form 2, 125 in Form 3 and 120 in Form 4.', 'Two learners are chosen at random from the school.', 'Calculate the probability that both learners are in Form 3.'],
    skill: 'Source: ZIMSEC June 2023, Paper 1, Question 20(c). Skill: the numbers go down by 1 for the second pick.',
    solution: ['All learners: 500', '`P = 125/500 × 124/499`', '`= 15500/249500`', '**P = 31/499**'],
  },
  nov23q22: {
    level: 'Medium',
    topic: 'Tree diagram',
    lines: ['Den is a striker. The probability that he scores in the first half is 0.6.', 'If he scores in the first half, the probability that he scores in the second half is 0.8. If he does not, it is 0.5.', '(a) Complete the tree diagram.', '(b) Find the probability that he scores (i) in both halves, (ii) only once.'],
    skill: 'Source: ZIMSEC November 2023, Paper 1, Question 22. Skill: multiply along, add the paths.',
    solution: ['(a) First half: 0.6 and 0.4', 'After scoring: 0.8 and 0.2', 'After not scoring: 0.5 and 0.5', '(b)(i) `0.6 × 0.8 =` **0.48**', '(ii) `0.6 × 0.2 + 0.4 × 0.5 = 0.12 + 0.20 =` **0.32**'],
  },
  nov20q10e: {
    level: 'Medium / Hard',
    topic: 'One of each kind, without replacement',
    lines: ['30 seedlings were measured: 5 are at most 20 cm tall, 6 are 20-25 cm, 10 are 25-35 cm and 9 are more than 35 cm.', 'Two seedlings are picked at random.', 'Find the probability that one is at most 20 cm tall and the other is more than 35 cm tall.'],
    skill: 'Source: ZIMSEC November 2020, Paper 2, Question 10(e). Skill: two orders, then add.',
    solution: ['Short then tall: `5/30 × 9/29 = 45/870`', 'Tall then short: `9/30 × 5/29 = 45/870`', 'Add: `90/870 =` **3/29**'],
  },
};

/* ---------------------------------------------------------------- 1. BASICS */

export const BASICS_LESSON = [
  { h: 'What is probability?' },
  { p: 'Probability tells us **how likely** something is to happen. We measure it with a number from 0 to 1.' },
  { diagram: 'probScale', caption: '**0** means it cannot happen. **1** means it is certain. **1/2** means an even chance, like a coin landing on heads.' },
  { p: 'We can write a probability as a fraction, a decimal or a percentage: `1/2 = 0.5 = 50%`. A probability is never less than 0 and never more than 1.' },

  { c: true },
  { h: 'The probability formula' },
  { p: 'Every probability question uses one idea. Count the ways you **want** it to happen. Divide by **all** the ways it can happen.' },
  { f: 'P(event) = ways it can happen ÷ all possible outcomes' },
  { p: 'We write `P(A)` for "the probability of A". Each possible result is called an **outcome**. The outcomes must be equally likely.' },
  { diagram: 'dieFaces', caption: 'A fair die has 6 equally likely outcomes. Three are even, so `P(even) = 3/6 = 1/2`.' },

  { c: true },
  { h: 'Finding a probability from a bag' },
  { diagram: 'bagBalls', caption: 'The probabilities of all the colours add up to 1.' },
  { solver: {
    title: 'Find P(red)',
    problem: 'A bag has 20 balls: 3 green, 5 red and 12 brown. One ball is picked at random. Find P(red).',
    steps: [
      { text: 'P(red) = red balls ÷ all balls', why: 'Ways we want ÷ all possible outcomes.' },
      { text: 'P(red) = 5 ÷ 20', why: 'There are 5 red balls and 20 balls altogether.' },
      { text: 'P(red) = 1/4', why: 'Cancel by 5. As a decimal this is 0.25. As a percentage it is 25%.' },
    ],
    answer: 'P(red) = 1/4',
  } },

  { h: 'The chance that it does NOT happen' },
  { p: 'Something either happens or it does not, so the two probabilities add up to 1.' },
  { f: 'P(not A) = 1 - P(A)' },
  { solver: {
    title: 'Find P(not red)',
    problem: 'Using the same bag, find P(not red).',
    steps: [
      { text: 'P(not red) = 1 - P(red)', why: 'The two chances add up to 1.' },
      { text: 'P(not red) = 1 - 5/20', why: 'We found P(red) = 5/20.' },
      { text: 'P(not red) = 15/20', why: '1 = 20/20, so 20/20 - 5/20 = 15/20.' },
      { text: 'P(not red) = 3/4', why: 'Cancel by 5.' },
    ],
    answer: 'P(not red) = 3/4',
  } },

  { c: true },
  { h: 'Relative frequency and expected number' },
  { p: 'Sometimes we cannot count the outcomes, so we do an experiment. The **relative frequency** is how often it happened out of all the tries.' },
  { f: 'relative frequency = times it happened ÷ number of tries' },
  { p: 'A drawing pin is dropped 200 times and lands point up 130 times. The relative frequency is `130/200 = 0.65`. The more tries you do, the closer this gets to the true probability.' },
  { p: 'If you know the probability, you can work out how many times to **expect** it.' },
  { solver: {
    title: 'Expected number',
    problem: 'The probability that a seed grows is 0.9. How many of 200 seeds are expected to grow?',
    steps: [
      { text: 'expected number = P × tries', why: 'Probability times the number of tries.' },
      { text: 'expected number = 0.9 × 200', why: '' },
      { text: 'expected number = 180', why: 'Out of 200 seeds, about 180 should grow.' },
    ],
    answer: '180 seeds',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Find a probability', lines: ['A fair die is thrown.', 'Find the probability of getting a number greater than 4.'], skill: 'Practice question. Skill: ways we want ÷ all outcomes.', solution: ['Numbers greater than 4: 5 and 6', '2 ways out of 6', '`P = 2/6 =` **1/3**'] },
    { level: 'Easy', topic: 'Find a probability from a bag', lines: ['A bag has 3 green, 5 red and 12 brown balls.', 'Find the probability that a ball picked at random is brown.'], skill: 'Practice question. Skill: count the colour, divide by the total.', solution: ['`P(brown) = 12/20`', '**P = 3/5**'] },
    REAL.nov25q10f,
    { level: 'Medium', topic: 'Not happening, then expected number', lines: ['The probability that a bus is late is 2/7.', '(a) Find the probability that the bus is not late.', '(b) In 63 days, on how many days is the bus expected to be late?'], skill: 'Practice question. Skill: 1 - P, then P × tries.', solution: ['(a) `1 - 2/7 =` **5/7**', '(b) `2/7 × 63 =` **18 days**'] },
    { level: 'Medium', topic: 'Expected number', lines: ['The probability that a bulb is faulty is 0.04.', 'A box holds 250 bulbs.', 'How many faulty bulbs should you expect?'], skill: 'Practice question. Skill: expected number = P × number of tries.', solution: ['`0.04 × 250 =` **10 bulbs**'] },
  ] },
  { p: '**The one thing to remember:** probability = **ways we want ÷ all possible outcomes**. The answer is always between 0 and 1.' },
];

/* ---------------------------------------------------------------- 2. MUTUALLY EXCLUSIVE */

export const MUTUAL_LESSON = [
  { h: 'What does "mutually exclusive" mean?' },
  { p: 'Two events are **mutually exclusive** when they **cannot happen at the same time**. When you throw one die, you cannot get a 2 and a 5 on the same throw.' },
  { diagram: 'vennMutual', caption: 'Left: the circles do not overlap, so the events are mutually exclusive. Right: "even" and "less than 3" both include 2, so they are not.' },
  { p: '**In simple English:** if one happens, the other cannot.' },

  { c: true },
  { h: 'The OR rule' },
  { p: 'When a question asks for "A **or** B" and A and B cannot happen together, **add** the probabilities.' },
  { f: 'P(A or B) = P(A) + P(B)' },
  { p: 'Memory trick: **OR means add**. This works only when the events are mutually exclusive.' },
  { solver: {
    title: 'A die: 2 or 5',
    problem: 'A fair die is thrown. Find P(2 or 5).',
    steps: [
      { text: 'P(2 or 5) = P(2) + P(5)', why: 'The two events cannot happen together, so add.' },
      { text: 'P(2 or 5) = 1/6 + 1/6', why: 'Each number has a 1 in 6 chance.' },
      { text: 'P(2 or 5) = 2/6', why: 'Add the tops. The bottom stays 6.' },
      { text: 'P(2 or 5) = 1/3', why: 'Cancel by 2.' },
    ],
    answer: 'P(2 or 5) = 1/3',
  } },
  { solver: {
    title: 'A bag: green or red',
    problem: 'A ball is picked from the bag (3 green, 5 red, 12 brown). Find P(green or red).',
    steps: [
      { text: 'P(G or R) = P(G) + P(R)', why: 'One ball cannot be green and red, so add.' },
      { text: 'P(G or R) = 3/20 + 5/20', why: '' },
      { text: 'P(G or R) = 8/20', why: '' },
      { text: 'P(G or R) = 2/5', why: 'Cancel by 4.' },
    ],
    answer: 'P(green or red) = 2/5',
  } },

  { c: true },
  { h: 'A useful shortcut' },
  { p: 'The colours cannot happen together and they cover every ball, so `P(green) + P(red) + P(brown) = 1`. That means `P(brown) = 1 - 2/5 = 3/5`.' },
  { p: 'In ZIMSEC papers the OR rule usually sits inside a bigger question. For example, "both balls are the same colour" means you add the paths. You will see this in the last two sections.' },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'A die: 5 or 6', lines: ['A fair die is thrown.', 'Find the probability of getting a 5 or a 6.'], skill: 'Practice question. Skill: OR means add.', solution: ['`P(5 or 6) = 1/6 + 1/6`', '`= 2/6 =` **1/3**'] },
    { level: 'Easy', topic: 'A bag: red or brown', lines: ['A bag has 3 green, 5 red and 12 brown balls.', 'Find the probability that a ball picked at random is red or brown.'], skill: 'Practice question. Skill: add the two colours.', solution: ['`P(R or B) = 5/20 + 12/20`', '**P = 17/20**'] },
    { level: 'Easy / Medium', topic: 'A pack of cards', lines: ['A card is picked at random from a pack of 52 cards.', 'Find the probability that it is a heart or a diamond.'], skill: 'Practice question. Skill: events that cannot overlap.', solution: ['There are 13 hearts and 13 diamonds', '`P = 13/52 + 13/52 = 26/52`', '**P = 1/2**'] },
    { level: 'Medium', topic: 'Missing probability', lines: ['A learner gets to school by walking, bus, car or bicycle.', 'P(walk) = 0.4, P(bus) = 0.35 and P(car) = 0.15.', 'Find P(walk or bicycle).'], skill: 'Practice question. Skill: all probabilities add up to 1.', solution: ['`P(bicycle) = 1 - 0.4 - 0.35 - 0.15 = 0.1`', '`P(walk or bicycle) = 0.4 + 0.1 =` **0.5**'] },
    { level: 'Medium', topic: 'A spinner', lines: ['A fair spinner is numbered 1 to 8.', 'Find the probability of a number less than 3 or greater than 6.'], skill: 'Practice question. Skill: list the numbers, then count.', solution: ['Less than 3: 1, 2. Greater than 6: 7, 8', '4 numbers out of 8', '`P = 4/8 =` **1/2**'] },
  ] },
  { p: '**The one thing to remember:** **OR → add**, but only when the two events cannot happen together.' },
];

/* ---------------------------------------------------------------- 3. INDEPENDENT */

export const INDEPENDENT_LESSON = [
  { h: 'What does "independent" mean?' },
  { p: 'Two events are **independent** when one does not change the chance of the other. If you toss a coin and then throw a die, the coin cannot change what the die shows.' },
  { diagram: 'coinDieGrid', caption: 'There are 2 × 6 = 12 equally likely outcomes. Only one of them is (Head, 6).' },

  { c: true },
  { h: 'The AND rule' },
  { p: 'When a question asks for "A **and** B" and the events are independent, **multiply** the probabilities.' },
  { f: 'P(A and B) = P(A) × P(B)' },
  { p: 'Memory trick: **AND means multiply**.' },
  { solver: {
    title: 'A coin and a die',
    problem: 'A coin is tossed and a die is thrown. Find P(head and a 6).',
    steps: [
      { text: 'P(H and 6) = P(H) × P(6)', why: 'The coin and the die do not affect each other, so multiply.' },
      { text: 'P(H and 6) = 1/2 × 1/6', why: '' },
      { text: 'P(H and 6) = 1/12', why: 'Multiply the tops and the bottoms. This matches the grid above.' },
    ],
    answer: 'P(head and 6) = 1/12',
  } },

  { c: true },
  { h: 'Picking with or without replacement' },
  { p: 'When you pick two things one after the other, ask: **is the first one put back?**' },
  { diagram: 'replacementBags' },
  { p: '**With replacement:** the bag is the same for the second pick. The events are independent and the bottom numbers stay the same.' },
  { p: '**Without replacement:** the bag has changed, so the second pick depends on the first. The bottom number goes down by 1. If the first pick was the same colour, the top number goes down by 1 too.' },

  { h: 'With replacement: both the same colour' },
  { solver: SOLVE_N2022_Q21B },

  { c: true },
  { h: 'Without replacement' },
  { p: 'Watch the bottom numbers. The first pick is out of the whole total. The second pick is out of **one less**.' },
  { solver: SOLVE_J2023_Q20C },
  { p: 'Sometimes you want "one of each kind". That can happen in **two orders**, so find both orders and add them.' },
  { solver: SOLVE_N2020_Q10E },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Two coins', lines: ['A coin is tossed twice.', 'Find the probability of getting a head both times.'], skill: 'Practice question. Skill: AND means multiply.', solution: ['`P(H and H) = 1/2 × 1/2`', '**P = 1/4**'] },
    { level: 'Easy / Medium', topic: 'With replacement', lines: ['A bag has 5 red and 3 blue balls.', 'A ball is picked and replaced, then a second ball is picked.', 'Find the probability that both balls are red.'], skill: 'Practice question. Skill: the bottom number stays 8.', solution: ['`P(R and R) = 5/8 × 5/8`', '**P = 25/64**'] },
    { level: 'Medium', topic: 'Without replacement', lines: ['A bag has 5 red and 3 blue balls.', 'Two balls are picked without replacement.', 'Find the probability that both balls are red.'], skill: 'Practice question. Skill: the second pick is out of 7, with 4 red left.', solution: ['`P(R and R) = 5/8 × 4/7`', '`= 20/56 =` **5/14**'] },
    REAL.nov22q21b,
    REAL.jun23q20c,
    REAL.nov20q10e,
    { level: 'Medium / Hard', topic: 'Same colour, without replacement', lines: ['A bag has 4 red and 6 blue balls.', 'Two balls are picked without replacement.', 'Find the probability that both balls are the same colour.'], skill: 'Practice question. Skill: add the two same-colour paths.', solution: ['`P(R, R) = 4/10 × 3/9 = 12/90`', '`P(B, B) = 6/10 × 5/9 = 30/90`', '`12/90 + 30/90 = 42/90 =` **7/15**'] },
  ] },
  { p: '**The one thing to remember:** **AND → multiply**. If the first pick is not put back, the second pick has one fewer in the bottom number.' },
];

/* ---------------------------------------------------------------- 4. TABLES AND TREES */

export const TREES_LESSON = [
  { h: 'Possibility tables' },
  { p: 'When two things happen together, write every outcome in a table. Then count the cells you want.' },
  { diagram: 'twoDiceSeven', caption: 'Each cell shows the total of the two dice. Six of the 36 cells show 7.' },
  { diagram: 'twoDiceSix', caption: 'This time the highlighted cells are the ones where at least one die shows a 6.' },
  { p: 'Check the second answer another way: `P(at least one 6) = 1 - P(no 6) = 1 - 25/36 = 11/36`.' },

  { c: true },
  { h: 'Tree diagrams' },
  { p: 'A tree diagram shows every possible result in order. Three rules:' },
  { p: '(1) **Multiply along the branches** (AND). (2) **Add the paths** you want (OR). (3) The branches from one point **always add up to 1**.' },
  { diagram: 'treeStriker', caption: 'The purple path is "scores in both halves": `0.6 × 0.8 = 0.48`. A tree like this was set in ZIMSEC November 2023.' },
  { solver: SOLVE_N2023_Q22 },

  { c: true },
  { h: 'Trees with replacement' },
  { p: 'The ball is put back, so the second branches have the **same** probabilities as the first.' },
  { diagram: 'treeWith' },
  { solver: {
    title: 'Different colours (put back)',
    problem: '3 red and 2 blue balls. Two balls are picked and the first is put back. Find P(different colours).',
    steps: [
      { text: 'P(R then B) = 3/5 × 2/5 = 6/25', why: 'Follow the first purple path.' },
      { text: 'P(B then R) = 2/5 × 3/5 = 6/25', why: 'Follow the second purple path.' },
      { text: 'Add the two paths: 6/25 + 6/25', why: 'OR means add.' },
      { text: '= 12/25', why: '' },
    ],
    answer: 'P(different colours) = 12/25',
  } },

  { h: 'Trees without replacement' },
  { p: 'The ball is kept out, so the second branches **change**. After a red is taken, only 2 red and 2 blue are left (2/4 and 2/4). After a blue is taken, 3 red and 1 blue are left (3/4 and 1/4).' },
  { diagram: 'treeWithout' },
  { solver: {
    title: 'Different colours (not put back)',
    problem: '3 red and 2 blue balls. Two balls are picked and the first is NOT put back. Find P(different colours).',
    steps: [
      { text: 'P(R then B) = 3/5 × 2/4 = 6/20', why: 'After a red is taken, 4 balls are left and 2 are blue.' },
      { text: 'P(B then R) = 2/5 × 3/4 = 6/20', why: 'After a blue is taken, 4 balls are left and 3 are red.' },
      { text: 'Add the two paths: 6/20 + 6/20', why: '' },
      { text: '= 12/20 = 3/5', why: 'Cancel by 4.' },
    ],
    answer: 'P(different colours) = 3/5',
  } },

  { c: true },
  { h: 'At least one' },
  { p: '"At least one" is easier to find the other way round.' },
  { f: 'P(at least one) = 1 - P(none)' },
  { solver: {
    title: 'At least one head',
    problem: 'A coin is tossed 3 times. Find P(at least one head).',
    steps: [
      { text: 'P(at least one H) = 1 - P(no H)', why: '"None" is much easier to count.' },
      { text: 'No heads means T, T, T', why: 'Only one way.' },
      { text: 'P(TTT) = 1/2 × 1/2 × 1/2 = 1/8', why: 'AND means multiply.' },
      { text: 'P(at least one H) = 1 - 1/8 = 7/8', why: '' },
    ],
    answer: 'P = 7/8',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Two dice: total 7', lines: ['Two fair dice are thrown.', 'Find the probability that the total is 7.'], skill: 'Practice question. Skill: use the possibility table.', solution: ['6 cells out of 36 show 7', '`P = 6/36 =` **1/6**'] },
    { level: 'Easy / Medium', topic: 'Two dice: total 9 or more', lines: ['Two fair dice are thrown.', 'Find the probability that the total is 9 or more.'], skill: 'Practice question. Skill: count 9, 10, 11 and 12 in the table.', solution: ['Total 9: 4 ways. Total 10: 3 ways', 'Total 11: 2 ways. Total 12: 1 way', '`P = 10/36 =` **5/18**'] },
    { level: 'Medium', topic: 'Tree, without replacement', lines: ['A bag has 6 white and 4 black balls.', 'Two balls are picked without replacement.', 'Find the probability that both are white.'], skill: 'Practice question. Skill: the second branch is out of 9.', solution: ['`P(W, W) = 6/10 × 5/9`', '`= 30/90 =` **1/3**'] },
    REAL.nov23q22,
    { level: 'Medium / Hard', topic: 'At least one six', lines: ['A fair die is thrown 3 times.', 'Find the probability of getting at least one six.'], skill: 'Practice question. Skill: 1 - P(none).', solution: ['`P(no six in one throw) = 5/6`', '`P(no six in 3 throws) = (5/6)³ = 125/216`', '`P(at least one six) = 1 - 125/216 =` **91/216**'] },
  ] },
  { p: '**The one thing to remember:** on a tree, **multiply along the branches, then add the paths you want**.' },
];

/* ---------------------------------------------------------------- 5. EXAMPLE LIBRARY */

export const PROBABILITY_LIBRARY_LESSON = [
  { h: 'How to use this page' },
  { p: 'Every question here was set in a ZIMSEC paper. The working is written out step by step. Watch the pen, then try the question yourself before you look.' },

  { c: true },
  { h: 'One pick from a table' },
  { solver: SOLVE_N2025_Q10F },

  { c: true },
  { h: 'Two picks, ball put back' },
  { solver: SOLVE_N2022_Q21B },

  { c: true },
  { h: 'Two picks, not put back' },
  { solver: SOLVE_J2023_Q20C },
  { solver: SOLVE_N2020_Q10E },

  { c: true },
  { h: 'Tree diagram' },
  { diagram: 'treeStriker', caption: 'Purple path: scores in both halves.' },
  { solver: SOLVE_N2023_Q22 },

  { c: true },
  { exam: [
    REAL.nov25q10f,
    REAL.nov22q21b,
    REAL.jun23q20c,
    REAL.nov23q22,
    REAL.nov20q10e,
  ], title: 'Probability questions found in the ZIMSEC papers' },
];
