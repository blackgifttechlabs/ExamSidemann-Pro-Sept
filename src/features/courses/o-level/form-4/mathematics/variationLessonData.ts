/*
 * Lesson content for the Inverse, Joint and Partial variation sections and the
 * Example Library. It uses the same block format as DIRECT_LESSON in Variation.tsx:
 *
 *   { h }       heading            { p }      paragraph
 *   { f }       formula line       { table }  rows of cells
 *   { c: true } start a new container
 *   { solver }  pen-written working   { exam } exam-style question cards
 *
 * Inline markup in text: `maths` is bold italic, **text** is bold.
 *
 * Questions tagged with a `source` were read from the ZIMSEC papers listed there
 * (the wording is shortened). Questions without a source are practice questions
 * written in the same style.
 */

type Solver = { title: string; problem: string; steps: { text: string; why?: string }[]; answer: string };

/* ---------------------------------------------------------------- real past-paper questions */

// ZIMSEC June 2023, Paper 1 (4004/1), Question 7
const SOLVE_J2023_Q7: Solver = {
  title: 'ZIMSEC June 2023, Paper 1, Question 7',
  problem: 'P varies directly as the cube of r. P = 2 when r = 4. Find the formula, then P when r = 8.',
  steps: [
    { text: 'P = kr³', why: '"Directly as the cube of r" means P = k × r³.' },
    { text: '2 = k(4³)', why: 'Put in P = 2 and r = 4.' },
    { text: '2 = 64k', why: '4³ = 64.' },
    { text: 'k = 2 ÷ 64 = 1/32', why: 'Divide both sides by 64.' },
    { text: 'P = r³/32', why: 'This is the formula. Now use it for r = 8.' },
    { text: 'P = 8³/32 = 512/32', why: '8³ = 512.' },
    { text: 'P = 16', why: '512 ÷ 32 = 16.' },
  ],
  answer: 'P = r³/32, and P = 16 when r = 8',
};

// ZIMSEC November 2021, Paper 1 (4004/1), Question 18
const SOLVE_N2021_Q18: Solver = {
  title: 'ZIMSEC November 2021, Paper 1, Question 18',
  problem: 'D varies jointly as S and T. D = 24 when S = 4 and T = 2. Find k, then T when D = 50 and S = 10.',
  steps: [
    { text: 'D = kST', why: '"Varies jointly" means multiply S and T, then put k in front.' },
    { text: '24 = k(4)(2)', why: 'Put in D = 24, S = 4 and T = 2.' },
    { text: '24 = 8k', why: '4 × 2 = 8.' },
    { text: 'k = 3', why: 'Divide both sides by 8.' },
    { text: 'D = 3ST', why: 'Now we have the formula.' },
    { text: '50 = 3(10)T', why: 'Put in D = 50 and S = 10.' },
    { text: '50 = 30T', why: '3 × 10 = 30.' },
    { text: 'T = 50 ÷ 30 = 5/3', why: 'Divide both sides by 30.' },
  ],
  answer: 'k = 3, and T = 5/3 (or 1.67)',
};

// ZIMSEC November 2020, Paper 2 (4004/2), Question 6(c)
const SOLVE_N2020_Q6C: Solver = {
  title: 'ZIMSEC November 2020, Paper 2, Question 6(c)',
  problem: 'The average expenditure E of a family is partly constant and partly varies as the number of people n. For 5 people E = $55 and for 3 people E = $45. Find h and k.',
  steps: [
    { text: 'E = h + kn', why: 'Partly constant (h) and partly varies as n (kn).' },
    { text: '55 = h + 5k', why: 'Put in n = 5 and E = 55.' },
    { text: '45 = h + 3k', why: 'Put in n = 3 and E = 45.' },
    { text: '55 - 45 = 5k - 3k', why: 'Subtract the second equation from the first. This removes h.' },
    { text: '10 = 2k', why: '' },
    { text: 'k = 5', why: 'Divide both sides by 2.' },
    { text: '45 = h + 3(5)', why: 'Put k = 5 into the second equation.' },
    { text: 'h = 45 - 15 = 30', why: '' },
  ],
  answer: 'E = 30 + 5n',
};

// ZIMSEC November 2023, Paper 1 (4004/1), Question 21
const SOLVE_N2023_Q21: Solver = {
  title: 'ZIMSEC November 2023, Paper 1, Question 21',
  problem: 'The cost C of registering for an examination is partly constant and partly varies as the number of subjects N. It costs $70 for 2 subjects and $85 for 3 subjects. Find an equation connecting C and N, then the cost for 5 subjects.',
  steps: [
    { text: 'C = a + kN', why: 'Partly constant (a) and partly varies as N (kN).' },
    { text: '70 = a + 2k', why: 'Put in N = 2 and C = 70.' },
    { text: '85 = a + 3k', why: 'Put in N = 3 and C = 85.' },
    { text: '85 - 70 = 3k - 2k', why: 'Subtract the first equation from the second.' },
    { text: 'k = 15', why: '' },
    { text: '70 = a + 2(15)', why: 'Put k = 15 into the first equation.' },
    { text: 'a = 70 - 30 = 40', why: '' },
    { text: 'C = 40 + 15N', why: 'This is the equation.' },
    { text: 'C = 40 + 15(5) = 115', why: 'Now put in N = 5.' },
  ],
  answer: 'C = 40 + 15N, and the cost for 5 subjects is $115',
};

// ZIMSEC November 2025, Paper 2 (4004/2), Question 7(a)
const SOLVE_N2025_Q7A: Solver = {
  title: 'ZIMSEC November 2025, Paper 2, Question 7(a)',
  problem: 'P varies directly with r and inversely with (q² - 3). P = 10 when q = 5 and r = 11. Find k, then the two values of q when r = 9.2 and P = 4.',
  steps: [
    { text: 'P = kr/(q² - 3)', why: 'Directly with r goes on top. Inversely with (q² - 3) goes underneath.' },
    { text: '10 = k(11)/(5² - 3)', why: 'Put in P = 10, r = 11 and q = 5.' },
    { text: '10 = 11k/22', why: '5² - 3 = 22.' },
    { text: '10 = k/2', why: '11 ÷ 22 = 1/2.' },
    { text: 'k = 20', why: 'Multiply both sides by 2.' },
    { text: '4 = 20(9.2)/(q² - 3)', why: 'Now use P = 4 and r = 9.2.' },
    { text: '4(q² - 3) = 184', why: 'Multiply both sides by (q² - 3). 20 × 9.2 = 184.' },
    { text: 'q² - 3 = 46', why: 'Divide both sides by 4.' },
    { text: 'q² = 49', why: '' },
    { text: 'q = 7 or q = -7', why: 'A square root can be positive or negative. That is why there are two values.' },
  ],
  answer: 'k = 20, and q = 7 or q = -7',
};

/* ---------------------------------------------------------------- exam question cards */

const REAL = {
  jun23q7: {
    level: 'Medium / Hard',
    topic: 'Direct variation with a power',
    lines: ['`P` varies directly as the cube of `r`. Given that `P = 2` and `r = 4`, find the', '(a) formula connecting `P` and `r`,', '(b) value of `P` when `r = 8`.'],
    skill: 'Source: ZIMSEC June 2023, Paper 1, Question 7. Skill: using P = kr³.',
    solution: ['(a) `P = kr³`', '`2 = k(4³) = 64k`, so `k = 1/32`', '**P = r³/32**', '(b) `P = 8³/32 = 512/32 =` **16**'],
  },
  nov21q18: {
    level: 'Medium',
    topic: 'Joint variation',
    lines: ['`D` varies jointly as `S` and `T`.', '(a) Find an equation connecting `D`, `S`, `T` and a constant `k`.', '(b) Find `k` given that `D = 24` when `S = 4` and `T = 2`.', '(c) Find `T` given that `D = 50` and `S = 10`, using the value of `k` in (b).'],
    skill: 'Source: ZIMSEC November 2021, Paper 1, Question 18. Skill: D = kST.',
    solution: ['(a) **D = kST**', '(b) `24 = k(4)(2) = 8k`, so **k = 3**', '(c) `50 = 3(10)T = 30T`', '`T = 50 ÷ 30 =` **5/3**'],
  },
  nov20q6c: {
    level: 'Medium',
    topic: 'Partial variation with two unknown constants',
    lines: ['The average expenditure `E` of a family over a certain period is partly constant and partly varies as the number of people `n` in the family.', '(i) Find a relationship between `E` and `n` using constants `h` and `k`.', '(ii) The expenditure for 5 people is $55 and for 3 people is $45. Find `h` and `k`.'],
    skill: 'Source: ZIMSEC November 2020, Paper 2, Question 6(c). Skill: two equations, two unknowns.',
    solution: ['(i) **E = h + kn**', '(ii) `55 = h + 5k` and `45 = h + 3k`', 'Subtract: `10 = 2k`, so **k = 5**', '`45 = h + 3(5)`, so **h = 30**'],
  },
  nov23q21: {
    level: 'Medium',
    topic: 'Partial variation: cost of registering',
    lines: ['The cost `C` of registering for an examination is partly constant and partly varies as the number of subjects `N`. It costs $70 for 2 subjects and $85 for 3 subjects.', '(a) Find an equation connecting `C` and `N`.', '(b) Find the total cost of registering for 5 subjects.'],
    skill: 'Source: ZIMSEC November 2023, Paper 1, Question 21. Skill: C = a + kN.',
    solution: ['(a) `70 = a + 2k` and `85 = a + 3k`', 'Subtract: **k = 15**, then `a = 70 - 30 =` **40**', '**C = 40 + 15N**', '(b) `C = 40 + 15(5) =` **$115**'],
  },
  nov25q7a: {
    level: 'Hard',
    topic: 'Direct and inverse variation together',
    lines: ['`P` varies directly with `r` and inversely with `(q² - 3)`. `P = 10` when `q = 5` and `r = 11`. Find the', '(i) value of `k`, the constant of variation,', '(ii) two possible values of `q` when `r = 9.2` and `P = 4`.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 7(a). Skill: P = kr/(q² - 3).',
    solution: ['(i) `P = kr/(q² - 3)`', '`10 = 11k/22 = k/2`, so **k = 20**', '(ii) `4 = 20(9.2)/(q² - 3)`', '`4(q² - 3) = 184`, so `q² - 3 = 46`', '`q² = 49`, so **q = 7 or q = -7**'],
  },
  nov25q7b: {
    level: 'Medium',
    topic: 'Partial variation with two variables',
    lines: ['The price `B` of a jacket partly varies as the cost `C` of its material and partly as the time `T` taken to make it.', 'Express `B` in terms of `C`, `T` and two constants `m` and `n`.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 7(b)(i). The next parts find m and n using two equations.',
    solution: ['`B = mC + nT`', 'First part: mC (cost of material).', 'Second part: nT (time taken).'],
  },
};

/* ---------------------------------------------------------------- INVERSE */

export const INVERSE_LESSON = [
  { h: 'What does "varies inversely" mean?' },
  { p: 'Think about a journey of 120 km. The faster you travel, the less time it takes.' },
  { table: [['Speed (km/h)', '20', '40', '60', '120'], ['Time (hours)', '6', '3', '2', '1']] },
  { p: 'When the speed doubles, the time is cut in half. When the speed triples, the time is divided by 3. One quantity goes up while the other comes down, in the same proportion. This is called **inverse variation**.' },
  { p: '**In simple English:** inverse means opposite. If one quantity doubles, the other halves.' },

  { h: 'How can we recognise inverse variation?' },
  { p: 'In direct variation we divide `y ÷ x`. In inverse variation we **multiply** `y × x`. Look at this table.' },
  { table: [['x', '1', '2', '3', '6'], ['y', '12', '6', '4', '2']] },
  { p: '`1 × 12 = 12`, `2 × 6 = 12`, `3 × 4 = 12`, `6 × 2 = 12`. The product is always 12, so `y` varies inversely as `x`. We write `y ∝ 1/x`.' },

  { c: true },
  { h: 'The important rule' },
  { p: 'When a question says "`y` varies inversely as `x`", write:' },
  { f: 'y = k/x' },
  { p: 'The letter `k` is the constant of proportionality, as before. Memory trick: **inverse means divide**, `y = k ÷ x`. The four steps are the same as direct variation: write the equation, find `k`, write the formula, find the unknown.' },

  { h: 'Finding the constant k' },
  { solver: {
    title: 'Find k',
    problem: 'y varies inversely as x. When x = 4, y = 6. Find k.',
    steps: [
      { text: 'y = k/x', why: 'It says "varies inversely", so write y = k/x.' },
      { text: '6 = k/4', why: 'Put in the values: y = 6 and x = 4.' },
      { text: '6 × 4 = k', why: 'k is divided by 4, so multiply both sides by 4.' },
      { text: 'k = 24', why: 'This is the constant of proportionality.' },
    ],
    answer: 'k = 24',
  } },

  { h: 'Finding the complete formula' },
  { solver: {
    title: 'Find the formula',
    problem: 'We found k = 24. Write the formula connecting y and x, then find y when x = 8.',
    steps: [
      { text: 'y = k/x', why: 'Start with the inverse variation formula.' },
      { text: 'y = 24/x', why: 'Replace k with 24. This is the formula.' },
      { text: 'y = 24/8', why: 'To find y when x = 8, put 8 in place of x.' },
      { text: 'y = 3', why: 'Divide: 24 ÷ 8 = 3.' },
    ],
    answer: 'y = 24/x, and y = 3 when x = 8',
  } },

  { h: 'The method to remember' },
  { p: '(1) Write `y = k/x`; (2) use the numbers in the question to find `k`; (3) put `k` into the formula; (4) use the formula to find the unknown.' },

  { c: true },
  { h: "Let's try one together" },
  { p: 'Watch the working being written. The second question finds the **input**, so we have to rearrange.' },
  { solver: {
    title: 'Find k',
    problem: 'p varies inversely as q. When q = 5, p = 8. Find k.',
    steps: [
      { text: 'p = k/q', why: 'It says "varies inversely", so write p = k/q.' },
      { text: '8 = k/5', why: 'Put in the values: p = 8 and q = 5.' },
      { text: '8 × 5 = k', why: 'Multiply both sides by 5.' },
      { text: 'k = 40', why: 'So the equation is p = 40/q.' },
    ],
    answer: 'k = 40, so p = 40/q',
  } },
  { solver: {
    title: 'Find another value',
    problem: 'Using p = 40/q, find q when p = 20.',
    steps: [
      { text: 'p = 40/q', why: 'We already know the formula.' },
      { text: '20 = 40/q', why: 'Put 20 in place of p.' },
      { text: '20q = 40', why: 'Multiply both sides by q to get q out of the bottom.' },
      { text: 'q = 40 ÷ 20 = 2', why: 'Divide both sides by 20.' },
    ],
    answer: 'q = 2',
  } },

  { c: true },
  { h: 'Inverse variation with a square' },
  { p: 'If `y` varies inversely as the square of `x`, then `y ∝ 1/x²` and:' },
  { f: 'y = k/x²' },
  { p: 'Example: `y = 5` when `x = 2`. Then `5 = k/2²`, so `5 = k/4` and `k = 20`. The formula is **y = 20/x²**.' },

  { h: 'Direct and inverse together' },
  { p: 'Some questions use both. "`P` varies directly as `r` and inversely as `(q² - 3)`" means `P = kr/(q² - 3)`. The direct quantity goes on top. The inverse quantity goes underneath. Find `k` first, then use the formula. A question like this was set in ZIMSEC November 2025. It is in the cards below.' },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Find the constant', lines: ['`y` varies inversely as `x`.', 'When `x = 3`, `y = 12`. Find `k`.'], skill: 'Practice question. Skill: writing y = k/x and solving for k.', solution: ['`y = k/x`', '`12 = k/3`', '`k = 12 × 3 =` **36**'] },
    { level: 'Easy', topic: 'Write the equation', lines: ['`R` varies inversely as `T`.', 'When `T = 8`, `R = 4`.', 'Find the equation connecting `R` and `T`.'], skill: 'Practice question. Skill: finding k, then writing the equation.', solution: ['`R = k/T`', '`4 = k/8`, so `k = 32`', 'The equation is **R = 32/T**'] },
    { level: 'Easy / Medium', topic: 'Find a missing value', lines: ['`y` varies inversely as `x`.', 'When `x = 3`, `y = 2`.', 'Find `y` when `x = 6`.'], skill: 'Practice question. Skill: finding k first, then using the formula.', solution: ['`y = k/x`', '`2 = k/3`, so `k = 6`', '`y = 6/6 =` **1**'] },
    { level: 'Medium', topic: 'Find the input', lines: ['`P` is inversely proportional to `Q`.', 'When `Q = 4`, `P = 5`.', 'Find `Q` when `P = 25`.'], skill: 'Practice question. Skill: rearranging to find the bottom number.', solution: ['`P = k/Q`', '`5 = k/4`, so `k = 20`', '`25 = 20/Q`, so `25Q = 20`', '`Q = 20 ÷ 25 =` **0.8**'] },
    { level: 'Medium', topic: 'Speed and time', lines: ['The time `T` taken for a journey varies inversely as the speed `S`.', 'At 60 km/h the journey takes 4 hours.', 'How long does it take at 80 km/h?'], skill: 'Practice question. Skill: turning a word problem into T = k/S.', solution: ['`T = k/S`', '`4 = k/60`, so `k = 240`', '`T = 240/80 =` **3 hours**'] },
    { level: 'Medium / Hard', topic: 'Inverse square', lines: ['`x` varies inversely as the square of `y`.', 'When `y = 1/2`, `x = 4`.', 'Find `x` when `y = 5`.'], skill: 'Practice question. Skill: using x = k/y².', solution: ['`x = k/y²`', '`4 = k/(1/2)² = k/(1/4) = 4k`, so `k = 1`', '`x = 1/5² =` **1/25**'] },
    REAL.nov25q7a,
  ] },
  { p: '**The one thing to remember:** when you see "varies inversely as", think **inverse → divide**, then write `y = k/x`. For the square, write `y = k/x²`.' },
];

/* ---------------------------------------------------------------- JOINT */

export const JOINT_LESSON = [
  { h: 'What does "varies jointly" mean?' },
  { p: 'Sometimes a quantity depends on **two things at once**. The area of a rectangle depends on its length and its width: `A = l × w`.' },
  { p: 'If the length doubles, the area doubles. If the length and the width both double, the area becomes 4 times bigger. When a quantity changes with two or more others multiplied together, we say it **varies jointly**.' },
  { p: '**In simple English:** it depends on two things at the same time. We write `D ∝ ST` for "D varies jointly as S and T".' },

  { c: true },
  { h: 'The important rule' },
  { p: 'When a question says "`D` varies jointly as `S` and `T`", write:' },
  { f: 'D = kST' },
  { p: 'Memory trick: **jointly means multiply everything together, then put k in front.**' },

  { h: 'Finding the constant k' },
  { solver: {
    title: 'Find k',
    problem: 'D varies jointly as S and T. D = 24 when S = 4 and T = 2. Find k.',
    steps: [
      { text: 'D = kST', why: '"Varies jointly" means multiply S and T, then put k in front.' },
      { text: '24 = k(4)(2)', why: 'Put in D = 24, S = 4 and T = 2.' },
      { text: '24 = 8k', why: '4 × 2 = 8.' },
      { text: 'k = 3', why: 'Divide both sides by 8.' },
    ],
    answer: 'k = 3',
  } },

  { h: 'Using the formula' },
  { solver: {
    title: 'Find another value',
    problem: 'Using D = 3ST, find T when D = 50 and S = 10.',
    steps: [
      { text: 'D = 3ST', why: 'We already know the formula.' },
      { text: '50 = 3(10)T', why: 'Put in D = 50 and S = 10.' },
      { text: '50 = 30T', why: '3 × 10 = 30.' },
      { text: 'T = 50 ÷ 30 = 5/3', why: 'Divide both sides by 30. Keep it as a fraction or write 1.67.' },
    ],
    answer: 'T = 5/3 (or 1.67)',
  } },

  { c: true },
  { h: 'When there is a square' },
  { p: 'If `M` varies jointly as `L` and the **square** of `d`, write `M = kLd²`. Doubling `L` doubles `M`. Doubling `d` makes `M` four times bigger, because `d` is squared.' },
  { solver: {
    title: 'Joint variation with a square',
    problem: 'M varies jointly as L and the square of d. M = 2.8 when L = 100 and d = 2. Find the formula.',
    steps: [
      { text: 'M = kLd²', why: 'Joint with the square of d.' },
      { text: '2.8 = k(100)(2²)', why: 'Put in M = 2.8, L = 100 and d = 2.' },
      { text: '2.8 = 400k', why: '100 × 4 = 400.' },
      { text: 'k = 2.8 ÷ 400 = 0.007', why: 'Divide both sides by 400.' },
      { text: 'M = 0.007Ld²', why: 'Put k back into the formula.' },
    ],
    answer: 'M = 0.007Ld²',
  } },

  { h: 'When one quantity is on the bottom' },
  { p: '"`x` varies directly as `y` and inversely as `z`" means `x = ky/z`. The direct quantity goes on top. The inverse quantity goes underneath.' },
  { solver: {
    title: 'Direct and inverse together',
    problem: 'x varies directly as y and inversely as z. x = 27 when y = 9 and z = 2. Find the formula.',
    steps: [
      { text: 'x = ky/z', why: 'y is direct (top). z is inverse (bottom).' },
      { text: '27 = k(9)/2', why: 'Put in x = 27, y = 9 and z = 2.' },
      { text: '54 = 9k', why: 'Multiply both sides by 2.' },
      { text: 'k = 6', why: 'Divide both sides by 9.' },
      { text: 'x = 6y/z', why: 'Put k back into the formula.' },
    ],
    answer: 'x = 6y/z',
  } },

  { h: 'The method to remember' },
  { p: '(1) Write the equation with `k`; (2) put in the numbers to find `k`; (3) write the full formula; (4) use it to find the unknown.' },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Write the formula', lines: ['`z` varies jointly as `x` and `y`.', 'Write an equation using a constant `k`.'], skill: 'Practice question. Skill: joint variation means multiply.', solution: ['**z = kxy**'] },
    { level: 'Easy / Medium', topic: 'Joint with a square', lines: ['`x` varies jointly as `y` and the square of `z`.', 'When `y = 2` and `z = 3`, `x = 36`.', 'Find the formula, then `x` when `y = 4` and `z = 6`.'], skill: 'Practice question. Skill: using x = kyz².', solution: ['`x = kyz²`', '`36 = k(2)(9) = 18k`, so `k = 2`', 'The formula is **x = 2yz²**', '`x = 2(4)(36) =` **288**'] },
    REAL.nov21q18,
    { level: 'Medium', topic: 'Direct and inverse together', lines: ['`x` varies directly as `y` and inversely as `z`.', '`x = 27` when `y = 9` and `z = 2`.', 'Find `x` when `y = 14` and `z = 12`.'], skill: 'Practice question. Skill: x = ky/z.', solution: ['`x = ky/z`', '`27 = 9k/2`, so `k = 6`', '`x = 6(14)/12 =` **7**'] },
    { level: 'Medium / Hard', topic: 'Mass of a wire', lines: ['The mass `M` of a wire varies jointly as its length `L` and the square of its diameter `d`.', 'A wire 100 m long with diameter 2 mm has a mass of 2.8 kg.', 'Find the mass of a wire 250 m long with diameter 3 mm.'], skill: 'Practice question. Skill: joint variation in a real situation.', solution: ['`M = kLd²`', '`2.8 = k(100)(4)`, so `k = 0.007`', '`M = 0.007(250)(9) =` **15.75 kg**'] },
  ] },
  { p: '**The one thing to remember:** when you see "varies jointly", think **joint → multiply everything together**, then write `D = kST`. Quantities that vary inversely go on the bottom.' },
];

/* ---------------------------------------------------------------- PARTIAL */

export const PARTIAL_LESSON = [
  { h: 'What does "partly constant and partly varies" mean?' },
  { p: 'Think about a taxi. You pay a fixed $3 just to get in, plus $2 for every kilometre.' },
  { table: [['Distance (km)', '0', '1', '2', '3', '4'], ['Cost ($)', '3', '5', '7', '9', '11']] },
  { p: 'The fixed $3 never changes. The $2 per kilometre changes with the distance. The total cost is **partly constant** and **partly varies** with the distance. This is called **partial variation**.' },
  { p: '**In simple English:** one part of the answer stays the same and the other part changes.' },

  { c: true },
  { h: 'The important rule' },
  { p: 'When a question says "`y` is partly constant and partly varies as `x`", write:' },
  { f: 'y = a + kx' },
  { p: '`a` is the **constant part**. It is the value of `y` when `x = 0`. `kx` is the **changing part**. Examination papers may use other letters, for example `E = h + kn`, but the idea is the same. Memory trick: **fixed part + changing part**.' },
  { p: 'The graph is a straight line. `a` is where it cuts the y-axis and `k` is the gradient. It does **not** pass through the origin. That is the difference from direct variation.' },

  { h: 'Finding a and k' },
  { p: 'There are **two** unknowns, so you need **two** pairs of values. Put each pair in to make two equations, then solve them together.' },
  { solver: {
    title: 'Find a and k',
    problem: 'C is partly constant and partly varies as N. C = 70 when N = 2 and C = 85 when N = 3. Find the equation.',
    steps: [
      { text: 'C = a + kN', why: 'Partly constant (a) and partly varies as N (kN).' },
      { text: '70 = a + 2k', why: 'Put in N = 2 and C = 70.' },
      { text: '85 = a + 3k', why: 'Put in N = 3 and C = 85.' },
      { text: '85 - 70 = 3k - 2k', why: 'Subtract the first equation from the second. This removes a.' },
      { text: 'k = 15', why: '' },
      { text: '70 = a + 2(15)', why: 'Put k = 15 into the first equation.' },
      { text: 'a = 70 - 30 = 40', why: '' },
      { text: 'C = 40 + 15N', why: 'Put a and k back into the formula.' },
    ],
    answer: 'C = 40 + 15N',
  } },

  { h: 'Using the equation' },
  { solver: {
    title: 'Find another value',
    problem: 'Using C = 40 + 15N, find C when N = 5.',
    steps: [
      { text: 'C = 40 + 15N', why: 'We already know the formula.' },
      { text: 'C = 40 + 15(5)', why: 'Put 5 in place of N.' },
      { text: 'C = 40 + 75', why: '15 × 5 = 75.' },
      { text: 'C = 115', why: 'Add.' },
    ],
    answer: 'C = 115',
  } },

  { h: 'The method to remember' },
  { p: '(1) Write `y = a + kx`; (2) put in each pair of values to make two equations; (3) subtract to find `k`, then find `a`; (4) write the formula and use it.' },

  { c: true },
  { h: "Let's try one together" },
  { p: 'This question was set in ZIMSEC November 2020. The letters are `h` and `k`, but the working is the same.' },
  { solver: SOLVE_N2020_Q6C },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Write the relationship', lines: ['The cost `C` is partly constant and partly varies as `N`.', 'Write a relationship using constants `a` and `k`.'], skill: 'Practice question. Skill: constant part + changing part.', solution: ['**C = a + kN**'] },
    { level: 'Easy / Medium', topic: 'Find the relationship', lines: ['`x` is partly constant and partly varies as `y`.', 'When `y = 2`, `x = 30`. When `y = 6`, `x = 50`.', 'Find (a) the relationship, (b) `x` when `y = 3`.'], skill: 'Practice question. Skill: two equations, two unknowns.', solution: ['`x = a + ky`', '`30 = a + 2k` and `50 = a + 6k`', 'Subtract: `20 = 4k`, so `k = 5`', '`30 = a + 10`, so `a = 20`', '(a) **x = 20 + 5y**', '(b) `x = 20 + 5(3) =` **35**'] },
    REAL.nov25q7b,
    REAL.nov23q21,
    REAL.nov20q6c,
    { level: 'Medium / Hard', topic: 'Find a value between the two', lines: ['`C` is partly constant and partly varies as `N`.', '`C = 45` when `N = 10`, and `C = 87` when `N = 24`.', 'Find `C` when `N = 18`.'], skill: 'Practice question. Skill: finding the formula first, then using it.', solution: ['`C = a + kN`', '`45 = a + 10k` and `87 = a + 24k`', 'Subtract: `42 = 14k`, so `k = 3`', '`45 = a + 30`, so `a = 15`', '`C = 15 + 3(18) =` **69**'] },
  ] },
  { p: '**The one thing to remember:** when you see "partly constant and partly varies", write **y = a + kx**. You need **two pairs of values** to find `a` and `k`.' },
];

/* ---------------------------------------------------------------- EXAMPLE LIBRARY */

export const EXAMPLE_LIBRARY_LESSON = [
  { h: 'How to use this page' },
  { p: 'Every example here is written out step by step, with the reason for each line. Watch the pen, then try the question yourself. The last part lists every variation question that was found in the ZIMSEC papers we checked.' },

  { c: true },
  { h: 'Direct variation' },
  { solver: {
    title: 'Example 1',
    problem: 'D varies directly as T. D = 80 when T = 5. Find (a) the relationship between D and T, (b) T when D = 56.',
    steps: [
      { text: 'D = kT', why: 'Direct variation, so multiply T by k.' },
      { text: '80 = k(5)', why: 'Put in D = 80 and T = 5.' },
      { text: 'k = 80 ÷ 5 = 16', why: 'Divide both sides by 5.' },
      { text: 'D = 16T', why: '(a) This is the relationship.' },
      { text: '56 = 16T', why: '(b) Put in D = 56.' },
      { text: 'T = 56 ÷ 16', why: 'Divide both sides by 16.' },
      { text: 'T = 3.5', why: '' },
    ],
    answer: 'D = 16T, and T = 3.5',
  } },
  { solver: SOLVE_J2023_Q7 },

  { c: true },
  { h: 'Inverse variation' },
  { solver: {
    title: 'Example 2',
    problem: 'The time T hours varies inversely as the speed S km/h. T = 6 when S = 40. Find S when T = 4.',
    steps: [
      { text: 'T = k/S', why: 'Inverse variation, so divide k by S.' },
      { text: '6 = k/40', why: 'Put in T = 6 and S = 40.' },
      { text: 'k = 6 × 40 = 240', why: 'Multiply both sides by 40.' },
      { text: 'T = 240/S', why: 'Now we have the formula.' },
      { text: '4 = 240/S', why: 'Put in T = 4.' },
      { text: '4S = 240', why: 'Multiply both sides by S.' },
      { text: 'S = 240 ÷ 4 = 60', why: 'Divide both sides by 4.' },
    ],
    answer: 'S = 60 km/h',
  } },
  { solver: SOLVE_N2025_Q7A },

  { c: true },
  { h: 'Joint variation' },
  { solver: {
    title: 'Example 3',
    problem: 'M varies jointly as L and the square of d. M = 2.8 when L = 100 and d = 2. Find M when L = 250 and d = 3.',
    steps: [
      { text: 'M = kLd²', why: 'Joint with the square of d.' },
      { text: '2.8 = k(100)(2²)', why: 'Put in M = 2.8, L = 100 and d = 2.' },
      { text: '2.8 = 400k', why: '' },
      { text: 'k = 0.007', why: 'Divide both sides by 400.' },
      { text: 'M = 0.007(250)(3²)', why: 'Put in L = 250 and d = 3.' },
      { text: 'M = 0.007 × 250 × 9', why: '' },
      { text: 'M = 15.75', why: '' },
    ],
    answer: 'M = 15.75 kg',
  } },
  { solver: SOLVE_N2021_Q18 },

  { c: true },
  { h: 'Partial variation' },
  { solver: SOLVE_N2023_Q21 },
  { solver: SOLVE_N2020_Q6C },

  { c: true },
  { title: 'Variation questions found in the ZIMSEC papers', exam: [
    REAL.nov21q18,
    REAL.nov20q6c,
    REAL.nov23q21,
    REAL.nov25q7b,
    REAL.jun23q7,
    REAL.nov25q7a,
  ] },
];

/** Direct variation: the real past-paper question for the "What ZIMSEC usually asks" cards. */
export const DIRECT_REAL_QUESTION = REAL.jun23q7;
