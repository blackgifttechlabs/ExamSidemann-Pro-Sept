/*
 * Lesson content for the graph lessons: Graphs and Gradient, and Speed-Time graphs.
 * Same block format as variationLessonData.ts, with { diagram: 'name' } figures
 * from graphDiagrams.tsx.
 *
 * Cards with a "Source:" line come from the ZIMSEC papers named there (wording
 * shortened). Cards that say "Practice question" are written in the same style.
 *
 * Graph questions found in the six papers we could read
 * (Nov 2020 P2, Nov 2021 P1, Nov 2022 P1, Jun 2023 P1, Nov 2023 P1, Nov 2025 P2):
 *   Nov 2020 P2 Q8    curve h = 10 + 25t - 5t²: table, greatest height, tangent, read-off
 *   Nov 2021 P1 Q21   speed-time graph: acceleration, distance
 *   Nov 2021 P1 Q23   gradient, equation of a line, parallel line
 *   Nov 2022 P1 Q17   speed given by a formula v = 5 + 4t - t²
 *   Nov 2023 P1 Q19   speed-time graph: acceleration, distance, average speed
 *   Nov 2025 P2 Q9    y = 12/x: table, tangent gradient, line and curve
 */

type Solver = { title: string; problem: string; steps: { text: string; why?: string }[]; answer: string };

/* ---------------------------------------------------------------- real past-paper working */

const SOLVE_N2021_Q23: Solver = {
  title: 'ZIMSEC November 2021, Paper 1, Question 23',
  problem: 'A straight line l passes through the origin and the point (1, 2). Find (a) the gradient of l, (b) the equation of l, (c) the equation of the line through (0, -1) that is parallel to l.',
  steps: [
    { text: 'm = (2 - 0) ÷ (1 - 0)', why: '(a) Gradient from two points: (0, 0) and (1, 2).' },
    { text: 'm = 2', why: '' },
    { text: 'y = 2x + c', why: '(b) Use y = mx + c with m = 2.' },
    { text: '0 = 2(0) + c, so c = 0', why: 'The line goes through the origin (0, 0).' },
    { text: 'y = 2x', why: '' },
    { text: 'Parallel, so m = 2', why: '(c) Parallel lines have the same gradient.' },
    { text: 'It cuts the y-axis at (0, -1)', why: 'So c = -1. No sums needed.' },
    { text: 'y = 2x - 1', why: '' },
  ],
  answer: '(a) m = 2   (b) y = 2x   (c) y = 2x - 1',
};

const SOLVE_N2020_Q8: Solver = {
  title: 'ZIMSEC November 2020, Paper 2, Question 8',
  problem: 'A ball is thrown up. After t seconds its height is h = 10 + 25t - 5t² metres. Find m in the table when t = 2. Then use the graph to find the greatest height, the velocity at t = 5, and the times when h = 21.',
  steps: [
    { text: 'h = 10 + 25(2) - 5(2²)', why: '(a) Put t = 2 into the formula.' },
    { text: 'h = 10 + 50 - 20 = 40', why: 'So m = 40.' },
    { text: 'Greatest height: the top of the curve', why: '(c)(i) Look for where the curve stops rising.' },
    { text: 'Top at t = 2.5, h = 41.25', why: 'Read it from your graph. About 41 m.' },
    { text: 'Velocity at t = 5: draw the tangent', why: '(ii) Velocity is the gradient of the curve.' },
    { text: 'Points on it: (4, 35) and (6, -15)', why: 'Choose two points far apart on the tangent.' },
    { text: 'gradient = (-15 - 35) ÷ (6 - 4)', why: '' },
    { text: 'velocity = -50 ÷ 2 = -25 m/s', why: 'Negative, because the ball is coming down.' },
    { text: 'h = 21: draw a line across at 21', why: '(iii) Go across from 21 until you meet the curve.' },
    { text: 't = 0.5 s and t = 4.5 s', why: 'Read both values. Once going up, once coming down.' },
  ],
  answer: 'm = 40, about 41 m, -25 m/s, and t = 0.5 s and 4.5 s',
};

const SOLVE_N2025_Q9C: Solver = {
  title: 'ZIMSEC November 2025, Paper 2, Question 9(c)(i)',
  problem: 'The curve y = 12/x has been drawn for 1 ≤ x ≤ 6. Use the graph to find the gradient of the curve at x = 3.',
  steps: [
    { text: 'At x = 3, y = 12 ÷ 3 = 4', why: 'The point on the curve is (3, 4).' },
    { text: 'Draw the tangent at (3, 4)', why: 'Lay a ruler so it just touches the curve at that point.' },
    { text: 'Two points on it: (1.5, 6) and (4.5, 2)', why: 'Choose points far apart so the answer is more accurate.' },
    { text: 'rise = 2 - 6 = -4', why: '' },
    { text: 'run = 4.5 - 1.5 = 3', why: '' },
    { text: 'gradient = -4 ÷ 3 = -1.33', why: 'Negative, because the curve goes down. A hand-drawn tangent gives an answer close to -1.3.' },
  ],
  answer: 'gradient ≈ -1.3 (exactly -4/3)',
};

const SOLVE_N2023_Q19: Solver = {
  title: 'ZIMSEC November 2023, Paper 1, Question 19',
  problem: 'A speed-time graph: 20 m/s from 0 to 3 s, then speeding up to 30 m/s at 7 s, then slowing to rest at 10 s. Find (a) the acceleration from t = 3 to t = 7, (b) the distance at constant speed, (c) the average speed for the 10 seconds.',
  steps: [
    { text: 'acceleration = change in speed ÷ time', why: '(a) Acceleration is the gradient of the line.' },
    { text: '= (30 - 20) ÷ (7 - 3)', why: 'Speed goes from 20 to 30 while time goes from 3 to 7.' },
    { text: '= 10 ÷ 4 = 2.5 m/s²', why: '' },
    { text: 'Constant speed: from t = 0 to t = 3', why: '(b) The flat part of the graph.' },
    { text: 'distance = 20 × 3 = 60 m', why: 'Rectangle: speed × time.' },
    { text: 'Trapezium: ½(20 + 30) × 4 = 100', why: '(c) Find the other areas too.' },
    { text: 'Triangle: ½ × 30 × 3 = 45', why: '' },
    { text: 'Total distance = 60 + 100 + 45 = 205 m', why: 'Add all three areas.' },
    { text: 'average speed = 205 ÷ 10 = 20.5 m/s', why: 'Total distance ÷ total time.' },
  ],
  answer: '(a) 2.5 m/s²   (b) 60 m   (c) 20.5 m/s',
};

const SOLVE_N2021_Q21: Solver = {
  title: 'ZIMSEC November 2021, Paper 1, Question 21',
  problem: 'An object slows down uniformly at 3 m/s² from V m/s to 15 m/s in 5 s. It keeps 15 m/s for 5 s more, then slows down and stops after 3 s. Find (a) V, (b) the deceleration in the last 3 s, (c) the distance in the last 8 s.',
  steps: [
    { text: 'Speed lost = 3 × 5 = 15 m/s', why: '(a) 3 m/s lost every second, for 5 seconds.' },
    { text: 'V = 15 + 15 = 30', why: 'It ended at 15, so it started 15 higher.' },
    { text: 'deceleration = 15 ÷ 3 = 5 m/s²', why: '(b) Speed falls from 15 to 0 in 3 seconds.' },
    { text: 'Last 8 s = the flat part + the slowing part', why: '(c) From t = 5 to t = 13.' },
    { text: 'Rectangle: 15 × 5 = 75', why: '' },
    { text: 'Triangle: ½ × 15 × 3 = 22.5', why: '' },
    { text: 'distance = 75 + 22.5 = 97.5 m', why: '' },
  ],
  answer: '(a) V = 30   (b) 5 m/s²   (c) 97.5 m',
};

const SOLVE_N2022_Q17: Solver = {
  title: 'ZIMSEC November 2022, Paper 1, Question 17(a)',
  problem: 'The velocity v m/s of a moving particle after t seconds is v = 5 + 4t - t². Calculate (i) v when t = 3, (ii) t when v = 0.',
  steps: [
    { text: 'v = 5 + 4(3) - 3²', why: '(i) Put t = 3 into the formula.' },
    { text: 'v = 5 + 12 - 9 = 8', why: '' },
    { text: '0 = 5 + 4t - t²', why: '(ii) Put v = 0.' },
    { text: 't² - 4t - 5 = 0', why: 'Move everything to one side and tidy up.' },
    { text: '(t - 5)(t + 1) = 0', why: 'Factorise: two numbers that multiply to -5 and add to -4.' },
    { text: 't = 5 or t = -1', why: '' },
    { text: 't = 5', why: 'Time cannot be negative, so reject -1.' },
  ],
  answer: '(i) 8 m/s   (ii) t = 5 s',
};

/* ---------------------------------------------------------------- exam cards */

const REAL = {
  nov21q23: {
    level: 'Medium',
    topic: 'Equation of a line, parallel line',
    lines: ['A straight line `l` passes through the origin and the point (1, 2). Find the', '(a) gradient of line `l`,', '(b) equation of line `l`,', '(c) equation of the straight line through the point (0, -1) which is parallel to line `l`.'],
    skill: 'Source: ZIMSEC November 2021, Paper 1, Question 23. Skill: y = mx + c, parallel means same m.',
    solution: ['(a) `m = (2 - 0) ÷ (1 - 0) =` **2**', '(b) through the origin, so `c = 0`', '**y = 2x**', '(c) parallel, so `m = 2`. It cuts the y-axis at -1.', '**y = 2x - 1**'],
  },
  nov20q8: {
    level: 'Medium / Hard',
    topic: 'Reading a curve and its tangent',
    lines: ['A particle is thrown up. Its height h metres after t seconds is `h = 10 + 25t - 5t²`.', 'The table has t = 0, 1, 2, 3, 4, 5, 6 and h = 10, 30, m, 40, 30, 10, -20. (a) Find the value of m.', '(c) Use the graph to find (i) the greatest height, (ii) the velocity when t = 5, (iii) the times when the particle is 21 m above the ground.'],
    skill: 'Source: ZIMSEC November 2020, Paper 2, Question 8. Skill: reading a graph, tangent gradient.',
    solution: ['(a) `h = 10 + 25(2) - 5(4) =` **40**', '(c)(i) the top of the curve: about **41 m**', '(ii) tangent at t = 5 through (4, 35) and (6, -15)', '`gradient = -50 ÷ 2 =` **-25 m/s**', '(iii) **t = 0.5 s and t = 4.5 s**'],
  },
  nov25q9c: {
    level: 'Medium',
    topic: 'Gradient of a curve at a point',
    lines: ['The curve `y = 12/x` has been drawn for 1 ≤ x ≤ 6.', 'Use the graph to find the gradient of the curve at x = 3.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 9(c)(i). Skill: draw a tangent, then rise ÷ run.',
    solution: ['The point is (3, 4). Draw the tangent there.', 'Two points on it: (1.5, 6) and (4.5, 2)', '`gradient = (2 - 6) ÷ (4.5 - 1.5) = -4 ÷ 3`', '**about -1.3**'],
  },
  nov23q19: {
    level: 'Medium',
    topic: 'Speed-time graph: acceleration, distance, average speed',
    lines: ['The speed-time graph shows a moving object for 10 seconds. The speed is 20 m/s from 0 to 3 s, rises steadily to 30 m/s at 7 s, then falls steadily to 0 at 10 s.', 'Calculate the (a) acceleration from t = 3 to t = 7, (b) distance covered at constant speed, (c) average speed for the 10 seconds.'],
    skill: 'Source: ZIMSEC November 2023, Paper 1, Question 19. Skill: gradient is acceleration, area is distance.',
    solution: ['(a) `(30 - 20) ÷ (7 - 3) =` **2.5 m/s²**', '(b) `20 × 3 =` **60 m**', '(c) total distance `= 60 + 100 + 45 = 205 m`', '`average speed = 205 ÷ 10 =` **20.5 m/s**'],
  },
  nov21q21: {
    level: 'Medium',
    topic: 'Speed-time graph: slowing down',
    lines: ['An object slows down uniformly at 3 m/s² from `V` m/s to 15 m/s in 5 seconds. It keeps 15 m/s for a further 5 seconds. It then slows down uniformly and stops after 3 seconds.', 'Calculate (a) `V`, (b) the deceleration in the last 3 seconds, (c) the distance travelled in the last 8 seconds.'],
    skill: 'Source: ZIMSEC November 2021, Paper 1, Question 21. Skill: gradient and area.',
    solution: ['(a) `V = 15 + 3 × 5 =` **30**', '(b) `15 ÷ 3 =` **5 m/s²**', '(c) `15 × 5 = 75` and `½ × 15 × 3 = 22.5`', '**97.5 m**'],
  },
  nov25q9a: {
    level: 'Easy / Medium',
    topic: 'Complete a table for y = 12/x',
    lines: ['The table shows values of `y = 12/x`: x = 1, 1.5, 2, 3, 4, 5, 6 and y = 12, m, 6, 4, 3, n, 2.', 'Find the value of `m` and the value of `n`.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 9(a). Skill: put x into the formula.',
    solution: ['`m = 12 ÷ 1.5 =` **8**', '`n = 12 ÷ 5 =` **2.4**'],
  },
  nov25q9d: {
    level: 'Medium / Hard',
    topic: 'Solve an equation with a line and a curve',
    lines: ['(i) On the same axes draw the graph of `y = 3x + 1`.', '(ii) Hence use the graph to solve the equation `12/x = 3x + 1`.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 9(d). Skill: read where the line crosses the curve.',
    solution: ['(i) Two points: (1, 4) and (2, 7). Join with a ruler.', '(ii) Read the x-value where the line meets the curve.', '**x ≈ 1.8**'],
  },
  nov25q9cii: {
    level: 'Hard',
    topic: 'Area under a curve (estimate)',
    lines: ['Use the graph of `y = 12/x` to estimate the area of the region bounded by the curve, the x-axis and the lines x = 2 and x = 4.'],
    skill: 'Source: ZIMSEC November 2025, Paper 2, Question 9(c)(ii). Skill: split the area into trapezia.',
    solution: ['The heights at x = 2, 3, 4 are 6, 4 and 3', 'Trapezium 1: `½(6 + 4) × 1 = 5`', 'Trapezium 2: `½(4 + 3) × 1 = 3.5`', '**area ≈ 8.5 square units** (a close estimate; the exact area is about 8.3)'],
  },
  nov22q17: {
    level: 'Easy / Medium',
    topic: 'Speed given by a formula',
    lines: ['The velocity `v` m/s of a moving particle after `t` seconds is `v = 5 + 4t - t²`.', 'Calculate (i) `v` when `t = 3`, (ii) `t` when `v = 0`.'],
    skill: 'Source: ZIMSEC November 2022, Paper 1, Question 17(a). Skill: substitute, then solve a quadratic.',
    solution: ['(i) `v = 5 + 12 - 9 =` **8**', '(ii) `5 + 4t - t² = 0`, so `t² - 4t - 5 = 0`', '`(t - 5)(t + 1) = 0`', '**t = 5** (time cannot be negative)'],
  },
};

/* ---------------------------------------------------------------- GRADIENT 1: basics */

export const GRADIENT_BASICS = [
  { h: 'What is gradient?' },
  { p: 'The **gradient** of a line tells us **how steep** it is. A steep hill has a big gradient. A flat road has a gradient of 0.' },
  { diagram: 'gradTriangle', caption: 'Pick two points on the line. Count how far you go **across** (the run) and how far you go **up** (the rise).' },
  { f: 'gradient = rise ÷ run' },
  { p: 'We often use the letter `m` for gradient. In simple English: **how much the line goes up for every 1 step across**.' },

  { c: true },
  { h: 'Gradient from two points' },
  { p: 'You do not have to draw the line. If you know two points `(x₁, y₁)` and `(x₂, y₂)`, use this:' },
  { f: 'm = (y₂ - y₁) ÷ (x₂ - x₁)' },
  { p: 'Subtract the y-values on top. Subtract the x-values underneath. Keep the **same order** on the top and the bottom.' },
  { diagram: 'twoPointGradient' },
  { solver: {
    title: 'Find the gradient',
    problem: 'Find the gradient of the line through P(2, 3) and Q(6, 11).',
    steps: [
      { text: 'm = (y2 - y1) ÷ (x2 - x1)', why: 'The two-point formula.' },
      { text: 'm = (11 - 3) ÷ (6 - 2)', why: 'Put in the numbers. Same order on top and bottom.' },
      { text: 'm = 8 ÷ 4', why: '' },
      { text: 'm = 2', why: 'The line goes up 2 for every 1 across.' },
    ],
    answer: 'm = 2',
  } },
  { solver: {
    title: 'A negative gradient',
    problem: 'Find the gradient of the line through A(1, 7) and B(5, 3).',
    steps: [
      { text: 'm = (3 - 7) ÷ (5 - 1)', why: 'Take B minus A on the top and on the bottom.' },
      { text: 'm = -4 ÷ 4', why: '' },
      { text: 'm = -1', why: 'The line goes down, so the gradient is negative.' },
    ],
    answer: 'm = -1',
  } },

  { c: true },
  { h: 'Four kinds of gradient' },
  { diagram: 'slopeTypes' },
  { p: 'A line that **rises** to the right has a positive gradient. A line that **falls** has a negative gradient. A **flat** line, `y = c`, has a gradient of 0. A **vertical** line, `x = a`, has no gradient.' },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Gradient from two points', lines: ['Find the gradient of the line through (2, 1) and (4, 5).'], skill: 'Practice question. Skill: rise ÷ run.', solution: ['`m = (5 - 1) ÷ (4 - 2)`', '`= 4 ÷ 2 =` **2**'] },
    { level: 'Easy', topic: 'A falling line', lines: ['Find the gradient of the line through (1, 7) and (3, 1).'], skill: 'Practice question. Skill: a negative gradient.', solution: ['`m = (1 - 7) ÷ (3 - 1)`', '`= -6 ÷ 2 =` **-3**'] },
    { level: 'Easy / Medium', topic: 'Negative numbers in the points', lines: ['Find the gradient of the line through (-2, 3) and (4, -3).'], skill: 'Practice question. Skill: careful with negative numbers.', solution: ['`m = (-3 - 3) ÷ (4 - (-2))`', '`= -6 ÷ 6 =` **-1**'] },
    { level: 'Medium', topic: 'Find a missing coordinate', lines: ['The line through (2, 1) and (6, k) has a gradient of 3/4.', 'Find the value of `k`.'], skill: 'Practice question. Skill: put the numbers in, then solve.', solution: ['`(k - 1) ÷ (6 - 2) = 3/4`', '`k - 1 = 3`', '**k = 4**'] },
    { level: 'Medium / Hard', topic: 'A missing coordinate with a fraction', lines: ['The line through (6, k) and (4, 1) has a gradient of 3/5.', 'Find `k`.'], skill: 'Practice question. Skill: solve an equation with fractions.', solution: ['`(k - 1) ÷ (6 - 4) = 3/5`', '`k - 1 = 6/5`', '**k = 11/5 = 2.2**'] },
  ] },
  { p: '**The one thing to remember:** gradient = **rise ÷ run** = **(y₂ - y₁) ÷ (x₂ - x₁)**.' },
];

/* ---------------------------------------------------------------- GRADIENT 2: y = mx + c */

export const GRADIENT_LINES = [
  { h: 'The equation y = mx + c' },
  { p: 'Every straight line has an equation that looks like this:' },
  { f: 'y = mx + c' },
  { p: '`m` is the **gradient**. `c` is where the line **cuts the y-axis**. In `y = 2x + 1` the gradient is 2 and the line cuts the y-axis at (0, 1).' },
  { diagram: 'lineMxC' },
  { p: 'The equation must start with `y =` before you read `m` and `c`. If it does not, rearrange it first.' },
  { solver: {
    title: 'Find m and c',
    problem: 'Find the gradient of the line 4x + 2y = 5, and where it cuts the y-axis.',
    steps: [
      { text: '4x + 2y = 5', why: 'We need y on its own.' },
      { text: '2y = -4x + 5', why: 'Move 4x to the other side. Its sign changes.' },
      { text: 'y = -2x + 5/2', why: 'Divide every term by 2.' },
      { text: 'm = -2 and c = 5/2', why: 'Read them off: the number with x, and the number on its own.' },
    ],
    answer: 'gradient -2, cuts the y-axis at (0, 2.5)',
  } },

  { c: true },
  { h: 'Drawing a line from a table' },
  { p: 'Choose some x-values. Work out each y. Plot the points and join them with a ruler. If the points are not in a straight line, check your sums.' },
  { table: [['x', '-1', '0', '1', '2'], ['y', '-1', '1', '3', '5']] },
  { solver: {
    title: 'Fill in the table',
    problem: 'Find y for x = -1, 0, 1 and 2 on the line y = 2x + 1.',
    steps: [
      { text: 'x = -1: y = 2(-1) + 1 = -1', why: '' },
      { text: 'x = 0: y = 2(0) + 1 = 1', why: 'This is the point where the line cuts the y-axis.' },
      { text: 'x = 1: y = 2(1) + 1 = 3', why: '' },
      { text: 'x = 2: y = 2(2) + 1 = 5', why: '' },
    ],
    answer: 'Points: (-1, -1), (0, 1), (1, 3), (2, 5)',
  } },

  { c: true },
  { h: 'The quick method: the two intercepts' },
  { p: 'To sketch a line fast, find where it cuts the axes. Put `x = 0` to find where it cuts the **y-axis**. Put `y = 0` to find where it cuts the **x-axis**. Then join the two points.' },
  { diagram: 'interceptMethod' },
  { solver: {
    title: 'Find the intercepts',
    problem: 'Sketch the line 3x + 2y = 6 by finding where it cuts the axes.',
    steps: [
      { text: 'x = 0: 2y = 6, so y = 3', why: 'Put x = 0 to find the y-axis crossing.' },
      { text: 'Point (0, 3)', why: '' },
      { text: 'y = 0: 3x = 6, so x = 2', why: 'Put y = 0 to find the x-axis crossing.' },
      { text: 'Point (2, 0)', why: '' },
      { text: 'Join (0, 3) and (2, 0)', why: 'Use a ruler and extend the line a little each way.' },
    ],
    answer: 'The line cuts the axes at (0, 3) and (2, 0)',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Read m and c', lines: ['Write down the gradient and the y-intercept of `y = 3x - 4`.'], skill: 'Practice question. Skill: y = mx + c.', solution: ['**gradient = 3**', '**y-intercept = -4**, the point (0, -4)'] },
    { level: 'Easy', topic: 'Complete a table', lines: ['Complete the table for `y = 3x - 2` when x = -1, 0, 1, 2.'], skill: 'Practice question. Skill: substitute, then work out.', solution: ['`x = -1: y = -5`', '`x = 0: y = -2`', '`x = 1: y = 1`', '`x = 2: y = 4`'] },
    { level: 'Easy / Medium', topic: 'Rearrange first', lines: ['Find the gradient of the line `4x - 2y + 1 = 0`.'], skill: 'Practice question. Skill: get y on its own.', solution: ['`2y = 4x + 1`', '`y = 2x + 1/2`', '**gradient = 2**'] },
    { level: 'Medium', topic: 'Intercepts', lines: ['Find where the line `5x - 2y = 5` cuts the axes.'], skill: 'Practice question. Skill: put x = 0, then y = 0.', solution: ['`x = 0: -2y = 5`, so `y = -5/2`', '`y = 0: 5x = 5`, so `x = 1`', '**(0, -2.5) and (1, 0)**'] },
    { level: 'Medium / Hard', topic: 'Sketch from the gradient and a point', lines: ['A line has gradient -2 and passes through (3, 1).', 'Where does it cut the y-axis?'], skill: 'Practice question. Skill: find c.', solution: ['`y = -2x + c`', '`1 = -2(3) + c`, so `c = 7`', '**It cuts the y-axis at (0, 7).**'] },
  ] },
  { p: '**The one thing to remember:** in `y = mx + c`, **m is the gradient** and **c is where the line cuts the y-axis**.' },
];

/* ---------------------------------------------------------------- GRADIENT 3: equation of a line */

export const GRADIENT_EQUATION = [
  { h: 'Finding the equation of a line' },
  { p: 'You can always find the equation of a line in three steps.' },
  { p: '(1) Find the gradient `m`. (2) Put it into `y = mx + c`, then put one point in to find `c`. (3) Write the equation.' },

  { h: 'From the gradient and one point' },
  { solver: {
    title: 'Gradient and a point',
    problem: 'A line has gradient -2 and passes through (3, 1). Find its equation.',
    steps: [
      { text: 'y = mx + c', why: 'Start with the general equation.' },
      { text: 'y = -2x + c', why: 'The gradient is -2.' },
      { text: '1 = -2(3) + c', why: 'Put in the point: x = 3 and y = 1.' },
      { text: '1 = -6 + c', why: '' },
      { text: 'c = 7', why: 'Add 6 to both sides.' },
      { text: 'y = -2x + 7', why: 'Put m and c back in.' },
    ],
    answer: 'y = -2x + 7',
  } },

  { c: true },
  { h: 'From two points' },
  { p: 'Find the gradient first. Then use **one** of the points to find `c`.' },
  { solver: {
    title: 'Two points',
    problem: 'Find the equation of the line through (1, 2) and (3, 8).',
    steps: [
      { text: 'm = (8 - 2) ÷ (3 - 1)', why: 'Gradient from two points.' },
      { text: 'm = 6 ÷ 2 = 3', why: '' },
      { text: 'y = 3x + c', why: '' },
      { text: '2 = 3(1) + c', why: 'Use the point (1, 2). Either point works.' },
      { text: 'c = -1', why: '' },
      { text: 'y = 3x - 1', why: 'Check with the other point: 3(3) - 1 = 8. Correct.' },
    ],
    answer: 'y = 3x - 1',
  } },

  { c: true },
  { h: 'Parallel lines' },
  { p: 'Parallel lines never meet, because they slope the same way. They have the **same gradient**. To find a line parallel to `y = 2x`, keep `m = 2` and use the new point to find `c`.' },
  { diagram: 'parallelLines', caption: 'Both lines go up 2 for every 1 across. A question like this was set in ZIMSEC November 2021.' },
  { solver: SOLVE_N2021_Q23 },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Gradient and y-intercept given', lines: ['A line has gradient 4 and cuts the y-axis at (0, 3).', 'Write down its equation.'], skill: 'Practice question. Skill: y = mx + c.', solution: ['`m = 4` and `c = 3`', '**y = 4x + 3**'] },
    { level: 'Easy / Medium', topic: 'Gradient and a point', lines: ['A line has gradient 1.5 and passes through (2, 3).', 'Find its equation.'], skill: 'Practice question. Skill: find c.', solution: ['`3 = 1.5(2) + c`', '`3 = 3 + c`, so `c = 0`', '**y = 1.5x**'] },
    REAL.nov21q23,
    { level: 'Medium', topic: 'Two points', lines: ['Find the equation of the line through (0, 5) and (4, 13).'], skill: 'Practice question. Skill: gradient, then c.', solution: ['`m = (13 - 5) ÷ (4 - 0) = 2`', 'It cuts the y-axis at 5, so `c = 5`', '**y = 2x + 5**'] },
    { level: 'Medium / Hard', topic: 'Parallel to a given line', lines: ['Find the equation of the line parallel to `y = 3x - 2` that passes through (2, 1).'], skill: 'Practice question. Skill: same gradient, new c.', solution: ['Same gradient, so `m = 3`', '`1 = 3(2) + c`, so `c = -5`', '**y = 3x - 5**'] },
  ] },
  { p: '**The one thing to remember:** find **m** first, then use a point to find **c**. **Parallel lines have the same m.**' },
];

/* ---------------------------------------------------------------- GRADIENT 4: curves */

export const GRADIENT_CURVES = [
  { h: 'A curve has a different gradient at every point' },
  { p: 'On a straight line the gradient is the same everywhere. On a curve it **keeps changing**. To find the gradient at one point, draw a **tangent**: a straight line that just touches the curve at that point. The gradient of the tangent is the gradient of the curve.' },
  { diagram: 'tangentsOnCurve', caption: 'This curve is the height of a ball thrown upwards: `h = 10 + 25t - 5t²`. Its gradient is the ball\'s speed. ZIMSEC set this graph in November 2020.' },
  { p: 'The **sign** of the gradient tells you what is happening. **Positive:** going up. **Zero:** the top, where the curve is flat for a moment. **Negative:** coming down.' },

  { c: true },
  { h: 'How to find the gradient at a point' },
  { p: '(1) Mark the point on the curve. (2) Lay a ruler so it just touches the curve there, and draw the tangent. (3) Choose two points far apart on the tangent. (4) Gradient = rise ÷ run.' },
  { diagram: 'tangentInverse' },
  { solver: SOLVE_N2025_Q9C },

  { c: true },
  { h: 'Reading a curve' },
  { p: 'Exam questions ask you to read three things from a curve: the highest point, the gradient at a point, and the x-values where the curve reaches a given height.' },
  { solver: SOLVE_N2020_Q8 },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Gradient of a tangent', lines: ['The tangent to the curve `y = x²` at the point (2, 4) passes through (1, 0) and (3, 8).', 'Find the gradient of the curve at x = 2.'], skill: 'Practice question. Skill: rise ÷ run on the tangent.', solution: ['`gradient = (8 - 0) ÷ (3 - 1)`', '`= 8 ÷ 2 =` **4**'] },
    { level: 'Easy / Medium', topic: 'What the sign means', lines: ['At one point on a curve the tangent is horizontal.', 'What is the gradient there, and what does the curve look like at that point?'], skill: 'Practice question. Skill: gradient zero means flat.', solution: ['The gradient is **0**.', 'The curve is at a **turning point**: the top or the bottom.'] },
    REAL.nov25q9c,
    REAL.nov20q8,
  ] },
  { p: '**The one thing to remember:** the gradient of a curve at a point is the gradient of the **tangent** there.' },
];

/* ---------------------------------------------------------------- GRADIENT 5: library */

export const GRADIENT_LIBRARY = [
  { h: 'How to use this page' },
  { p: 'Every question here was set in a ZIMSEC paper. The working is written out step by step. Watch the pen, then try the question yourself.' },

  { c: true },
  { h: 'Equation of a line' },
  { solver: SOLVE_N2021_Q23 },

  { c: true },
  { h: 'Gradient of a curve' },
  { solver: SOLVE_N2025_Q9C },
  { solver: SOLVE_N2020_Q8 },

  { c: true },
  { exam: [REAL.nov21q23, REAL.nov25q9c, REAL.nov20q8], title: 'Gradient questions found in the ZIMSEC papers' },
];

/* ---------------------------------------------------------------- SPEED-TIME 1: reading the graph */

export const SPEED_READING = [
  { h: 'What a speed-time graph shows' },
  { p: 'A speed-time graph shows **how fast** something is going at each moment. **Time** goes along the bottom. **Speed** goes up the side.' },
  { diagram: 'speedTimeTypes', caption: 'Four shapes you must be able to recognise.' },
  { p: 'Speed is measured in m/s (metres per second). Time is in s (seconds).' },

  { c: true },
  { h: 'Acceleration is the gradient' },
  { p: '**Acceleration** tells us how quickly the speed changes. On a speed-time graph it is the **gradient** of the line.' },
  { f: 'acceleration = change in speed ÷ time taken' },
  { p: 'It is measured in m/s². That means "metres per second, every second". A **negative** acceleration (the line goes down) is called **deceleration**.' },
  { solver: {
    title: 'Find the acceleration',
    problem: 'A car speeds up steadily from 4 m/s to 16 m/s in 6 seconds. Find its acceleration.',
    steps: [
      { text: 'acceleration = change in speed ÷ time', why: 'This is the gradient of the line.' },
      { text: 'a = (16 - 4) ÷ 6', why: 'The speed changes from 4 to 16.' },
      { text: 'a = 12 ÷ 6', why: '' },
      { text: 'a = 2 m/s²', why: 'The speed goes up 2 m/s every second.' },
    ],
    answer: 'a = 2 m/s²',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Constant speed', lines: ['What is the acceleration of an object moving at a constant 15 m/s?'], skill: 'Practice question. Skill: a flat line has gradient 0.', solution: ['The speed does not change.', '**acceleration = 0**'] },
    { level: 'Easy', topic: 'Find the acceleration', lines: ['A cyclist speeds up from 2 m/s to 12 m/s in 5 seconds.', 'Find the acceleration.'], skill: 'Practice question. Skill: change in speed ÷ time.', solution: ['`(12 - 2) ÷ 5 =` **2 m/s²**'] },
    { level: 'Easy / Medium', topic: 'Deceleration', lines: ['A train slows down from 30 m/s to 12 m/s in 6 seconds.', 'Find the deceleration.'], skill: 'Practice question. Skill: a falling line.', solution: ['`(30 - 12) ÷ 6 = 3`', '**deceleration = 3 m/s²** (acceleration = -3 m/s²)'] },
  ] },
  { p: '**The one thing to remember:** on a speed-time graph, **gradient = acceleration**.' },
];

/* ---------------------------------------------------------------- SPEED-TIME 2: acceleration questions */

export const SPEED_ACCELERATION = [
  { h: 'Using the gradient: Nov 2023' },
  { p: 'Here is the graph from ZIMSEC November 2023. Look at the part from `t = 3` to `t = 7`. The speed goes from 20 to 30, so the speed rises 10 in 4 seconds.' },
  { diagram: 'speedTimeN23', caption: 'Gradient from t = 3 to t = 7: `(30 - 20) ÷ (7 - 3) = 2.5` m/s².' },

  { c: true },
  { h: 'Using the gradient: Nov 2021' },
  { p: 'This graph slows down, then goes flat, then slows to a stop. The first slope is given: 3 m/s² for 5 seconds. So the object loses `3 × 5 = 15` m/s.' },
  { diagram: 'speedTimeN21' },
  { solver: SOLVE_N2021_Q21 },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Find the starting speed', lines: ['An object slows down at 2 m/s² for 4 seconds and ends at 10 m/s.', 'Find its starting speed.'], skill: 'Practice question. Skill: speed lost = deceleration × time.', solution: ['Speed lost `= 2 × 4 = 8`', '`start = 10 + 8 =` **18 m/s**'] },
    { level: 'Easy / Medium', topic: 'Time taken', lines: ['A lorry speeds up from 5 m/s to 20 m/s at 3 m/s².', 'How long does this take?'], skill: 'Practice question. Skill: time = change in speed ÷ acceleration.', solution: ['change `= 20 - 5 = 15`', '`time = 15 ÷ 3 =` **5 s**'] },
    REAL.nov21q21,
    REAL.nov23q19,
  ] },
];

/* ---------------------------------------------------------------- SPEED-TIME 3: distance and average speed */

export const SPEED_DISTANCE = [
  { h: 'Distance is the area' },
  { p: 'The **distance travelled** is the **area under** the speed-time graph. Split the area into simple shapes, find each area, then add.' },
  { p: '**Rectangle:** `speed × time`. **Triangle:** `½ × base × height`. **Trapezium:** `½ × (a + b) × width`, where `a` and `b` are the two parallel sides.' },
  { diagram: 'speedTimeN23', caption: 'Rectangle 60, trapezium 100, triangle 45. The whole distance is 60 + 100 + 45 = 205 m.' },

  { c: true },
  { h: 'Average speed' },
  { f: 'average speed = total distance ÷ total time' },
  { p: 'Find the **total distance** from all the areas. Then divide by the **total time**. Do not just average the speeds.' },
  { solver: SOLVE_N2023_Q19 },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Distance at constant speed', lines: ['An object travels at 12 m/s for 8 seconds.', 'How far does it go?'], skill: 'Practice question. Skill: rectangle, speed × time.', solution: ['`12 × 8 =` **96 m**'] },
    { level: 'Easy / Medium', topic: 'A triangle', lines: ['An object speeds up from rest to 10 m/s in 6 seconds.', 'How far does it go?'], skill: 'Practice question. Skill: triangle, ½ × base × height.', solution: ['`½ × 6 × 10 =` **30 m**'] },
    { level: 'Medium', topic: 'Average speed', lines: ['An object travels 150 m in the first 10 seconds and 90 m in the next 5 seconds.', 'Find its average speed for the 15 seconds.'], skill: 'Practice question. Skill: total distance ÷ total time.', solution: ['total distance `= 150 + 90 = 240`', '`240 ÷ 15 =` **16 m/s**'] },
    REAL.nov23q19,
    REAL.nov21q21,
  ] },
  { p: '**The one thing to remember:** **area = distance** and **gradient = acceleration**.' },
];

/* ---------------------------------------------------------------- SPEED-TIME 4: formula */

export const SPEED_FORMULA = [
  { h: 'When the speed is given by a formula' },
  { p: 'Sometimes you are given a formula for the speed, such as `v = 5 + 4t - t²`. To find the speed at a time, **put the time into the formula**. To find the time for a given speed, **put the speed in** and solve.' },
  { solver: SOLVE_N2022_Q17 },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Put in a time', lines: ['The speed of a particle is `v = 3t + 2` m/s after `t` seconds.', 'Find `v` when `t = 4`.'], skill: 'Practice question. Skill: substitute.', solution: ['`v = 3(4) + 2 =` **14 m/s**'] },
    REAL.nov22q17,
    { level: 'Medium', topic: 'Find the time', lines: ['The speed of a particle is `v = 20 - 2t²` m/s.', 'Find `t` when `v = 12`.'], skill: 'Practice question. Skill: substitute, then solve.', solution: ['`12 = 20 - 2t²`', '`2t² = 8`, so `t² = 4`', '**t = 2 s** (time cannot be negative)'] },
  ] },
];

/* ---------------------------------------------------------------- SPEED-TIME 5: distance-time */

export const SPEED_DISTANCE_TIME = [
  { h: 'Distance-time graphs' },
  { p: 'A **distance-time graph** has distance up the side and time along the bottom. Be careful: it is **not** the same as a speed-time graph.' },
  { diagram: 'distanceTime', caption: 'Going away at 30 km/h, stopped for 1 hour, then coming back home.' },
  { p: 'On a distance-time graph, the **gradient is the speed**. A **flat** line means the object is **stopped**. A line going **down** means it is coming **back**.' },
  { solver: {
    title: 'Find the speed',
    problem: 'A bus travels 60 km in the first 2 hours. Find its speed.',
    steps: [
      { text: 'speed = distance ÷ time', why: 'This is the gradient of the line.' },
      { text: 'speed = 60 ÷ 2', why: '' },
      { text: 'speed = 30 km/h', why: '' },
    ],
    answer: 'speed = 30 km/h',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Read the graph', lines: ['On a distance-time graph, what does a flat line mean?'], skill: 'Practice question.', solution: ['The object is **not moving**. The distance is not changing.'] },
    { level: 'Easy / Medium', topic: 'Find the speed', lines: ['A runner covers 24 km in 3 hours.', 'Find the speed.'], skill: 'Practice question. Skill: gradient = speed.', solution: ['`24 ÷ 3 =` **8 km/h**'] },
    { level: 'Medium', topic: 'A journey with a rest', lines: ['A cyclist rides 30 km in 2 hours, rests for 1 hour, then rides 30 km further in 3 hours.', 'Find the average speed for the whole journey.'], skill: 'Practice question. Skill: total distance ÷ total time.', solution: ['total distance `= 30 + 30 = 60 km`', 'total time `= 2 + 1 + 3 = 6 hours`', '`60 ÷ 6 =` **10 km/h**'] },
  ] },
  { p: '**The one thing to remember:** on a distance-time graph, **gradient = speed**.' },
];

/* ---------------------------------------------------------------- SPEED-TIME 6: library */

export const SPEED_LIBRARY = [
  { h: 'How to use this page' },
  { p: 'Every question here was set in a ZIMSEC paper. The working is written out step by step. Watch the pen, then try the question yourself.' },

  { c: true },
  { h: 'Speed-time graphs' },
  { solver: SOLVE_N2023_Q19 },
  { solver: SOLVE_N2021_Q21 },

  { c: true },
  { h: 'Speed from a formula' },
  { solver: SOLVE_N2022_Q17 },

  { c: true },
  { exam: [REAL.nov22q17, REAL.nov21q21, REAL.nov23q19], title: 'Speed questions found in the ZIMSEC papers' },
];

/* ---------------------------------------------------------------- CURVES: cubic */

export const CUBIC_LESSON = [
  { h: 'What is a cubic graph?' },
  { p: 'A **cubic** function has `x³` as its highest power. The simplest one is `y = x³`. Its graph is a smooth curve shaped like a stretched **S**.' },
  { diagram: 'cubicCurve', caption: 'Negative x gives negative y, because a negative number cubed is negative: `(-2)³ = -8`.' },
  { p: 'We did not find a cubic graph question in the six ZIMSEC papers we read, but cubic graphs are on the syllabus. The cards at the end are practice questions.' },

  { c: true },
  { h: 'Drawing a cubic graph' },
  { p: '(1) Make a table of values. (2) Plot every point. (3) Join them with **one smooth curve**. Do not use a ruler and do not join the points with short straight lines.' },
  { table: [['x', '-2', '-1', '0', '1', '2'], ['y = x³ - 3x', '-2', '2', '0', '-2', '2']] },
  { solver: {
    title: 'Fill in the table',
    problem: 'Find y = x³ - 3x for x = -2, -1, 0, 1 and 2.',
    steps: [
      { text: 'x = -2: y = (-2)³ - 3(-2)', why: 'Put -2 in place of every x.' },
      { text: '= -8 + 6 = -2', why: 'A negative cubed is negative. Minus a negative is plus.' },
      { text: 'x = -1: y = -1 + 3 = 2', why: '' },
      { text: 'x = 0: y = 0 - 0 = 0', why: '' },
      { text: 'x = 1: y = 1 - 3 = -2', why: '' },
      { text: 'x = 2: y = 8 - 6 = 2', why: '' },
    ],
    answer: 'y = -2, 2, 0, -2, 2',
  } },
  { diagram: 'cubicTurning', caption: 'This cubic turns twice: at (−1, 2) and at (1, −2).' },

  { c: true },
  { h: 'Reading answers from the graph' },
  { p: 'The curve cuts the x-axis where `y = 0`. So the solutions of `x³ - 3x = 0` are the x-values where the curve crosses the axis. To solve `x³ - 3x = 1`, draw the line `y = 1` and read where it meets the curve.' },
  { solver: {
    title: 'Solve with the graph',
    problem: 'Use the graph of y = x³ - 3x to solve x³ - 3x = 0.',
    steps: [
      { text: 'x³ - 3x = 0 means y = 0', why: 'The right-hand side is 0, so we want the height 0.' },
      { text: 'Look where the curve cuts the x-axis', why: '' },
      { text: 'It cuts at x ≈ -1.7, 0 and 1.7', why: 'Read the three values from the graph.' },
      { text: 'Check: x(x² - 3) = 0', why: 'So x = 0 or x² = 3, which gives x = ±1.73.' },
    ],
    answer: 'x ≈ -1.7, 0 and 1.7',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Substitute into a cubic', lines: ['Find `y` when `x = -3` for `y = x³`.'], skill: 'Practice question. Skill: a negative cubed is negative.', solution: ['`y = (-3)³ =` **-27**'] },
    { level: 'Easy', topic: 'Complete a table', lines: ['Complete the table for `y = x³ + 1` when x = -2, -1, 0, 1, 2.'], skill: 'Practice question. Skill: cube, then add 1.', solution: ['`x = -2: -8 + 1 = -7`', '`x = -1: -1 + 1 = 0`', '`x = 0: 1`', '`x = 1: 2`', '`x = 2: 9`'] },
    { level: 'Easy / Medium', topic: 'A value between the points', lines: ['Find `y` when `x = 1.5` for `y = x³ - 3x`.'], skill: 'Practice question. Skill: careful with decimals.', solution: ['`1.5³ = 3.375`', '`y = 3.375 - 4.5 =` **-1.125**'] },
    { level: 'Medium', topic: 'Turning points', lines: ['State the coordinates of the two turning points of `y = x³ - 3x`.'], skill: 'Practice question. Skill: read the top and the bottom of the bends.', solution: ['**(-1, 2)** and **(1, -2)**'] },
    { level: 'Medium / Hard', topic: 'Solve with a line', lines: ['Use the graph of `y = x³ - 3x` to solve `x³ - 3x = 1`.'], skill: 'Practice question. Skill: draw y = 1 and read where it meets the curve.', solution: ['Draw the line `y = 1` across the graph.', 'It meets the curve three times.', '**x ≈ -1.5, -0.3 and 1.9**'] },
  ] },
  { p: '**The one thing to remember:** a cubic graph is a **smooth S-shaped curve**. Solve by reading where it meets the x-axis or another line.' },
];

/* ---------------------------------------------------------------- CURVES: inverse */

export const INVERSE_GRAPH_LESSON = [
  { h: 'What is an inverse graph?' },
  { p: 'An **inverse** function has the form `y = k/x`. As `x` gets bigger, `y` gets smaller. The graph is a curve called a **hyperbola**.' },
  { diagram: 'hyperbola', caption: 'The graph of `y = 6/x`. It has two branches that never join.' },
  { p: 'The curve gets very close to the axes but **never touches them**. You cannot divide by 0, and `k/x` is never 0.' },

  { c: true },
  { h: 'Drawing y = 12/x' },
  { p: 'Make a table of values and plot the points. Then join them with a **smooth curve**. Do not use a ruler.' },
  { table: [['x', '1', '1.5', '2', '3', '4', '5', '6'], ['y', '12', 'm', '6', '4', '3', 'n', '2']] },
  { solver: {
    title: 'Fill in the missing values',
    problem: 'Find m and n in the table for y = 12/x.',
    steps: [
      { text: 'm is the value of y when x = 1.5', why: 'Read the table: m sits under 1.5.' },
      { text: 'm = 12 ÷ 1.5 = 8', why: '' },
      { text: 'n is the value of y when x = 5', why: '' },
      { text: 'n = 12 ÷ 5 = 2.4', why: '' },
    ],
    answer: 'm = 8 and n = 2.4',
  } },

  { c: true },
  { h: 'Solving an equation with a line' },
  { p: 'To solve `12/x = 3x + 1`, draw the curve `y = 12/x` and the line `y = 3x + 1` on the same axes. The x-value where they **cross** is the solution.' },
  { diagram: 'inverseWithLine' },
  { solver: {
    title: 'Draw the line, then read',
    problem: 'On the same axes draw y = 3x + 1. Hence solve 12/x = 3x + 1.',
    steps: [
      { text: 'x = 1: y = 3(1) + 1 = 4', why: 'Find two points for the line.' },
      { text: 'x = 2: y = 3(2) + 1 = 7', why: '' },
      { text: 'Plot (1, 4) and (2, 7). Join with a ruler.', why: 'Extend the line across the graph.' },
      { text: 'The line meets the curve where x ≈ 1.8', why: 'Read the x-value at the crossing point.' },
    ],
    answer: 'x ≈ 1.8',
  } },
  { p: 'Check with algebra: `12/x = 3x + 1` gives `3x² + x - 12 = 0`, so `x = (-1 + √145) ÷ 6 = 1.84`.' },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Substitute into y = k/x', lines: ['Find `y` when `x = 3` for `y = 6/x`.'], skill: 'Practice question. Skill: divide k by x.', solution: ['`y = 6 ÷ 3 =` **2**'] },
    REAL.nov25q9a,
    { level: 'Medium', topic: 'A negative x-value', lines: ['Find `y` when `x = -2` for `y = 6/x`.'], skill: 'Practice question. Skill: positive ÷ negative is negative.', solution: ['`y = 6 ÷ (-2) =` **-3**'] },
    REAL.nov25q9c,
    REAL.nov25q9d,
    REAL.nov25q9cii,
  ] },
  { p: '**The one thing to remember:** for `y = k/x`, as x goes **up**, y goes **down**. The curve never touches the axes.' },
];

/* ---------------------------------------------------------------- CURVES: sketching */

export const SKETCH_LESSON = [
  { h: 'Know the shapes' },
  { p: 'A **sketch** does not need exact values. It needs the right **shape** and the **key points**, such as where the graph cuts the axes. First decide the shape from the equation.' },
  { diagram: 'shapeGallery' },
  { p: '`y = mx + c` is a **straight line**. An `x²` with a positive number in front makes a **smile**. A negative number makes a **frown**. An `x³` gives an **S-shape**. `k/x` gives a **hyperbola**.' },

  { c: true },
  { h: 'Sketching a parabola' },
  { p: 'Find three things: where it cuts the **x-axis** (put `y = 0`), where it cuts the **y-axis** (put `x = 0`), and the **lowest or highest point**. The turning point is halfway between the two x-intercepts.' },
  { diagram: 'parabolaSketch' },
  { solver: {
    title: 'Sketch y = x² - x - 12',
    problem: 'Find the key points of y = x² - x - 12.',
    steps: [
      { text: 'x-axis: put y = 0', why: 'Where the graph crosses the x-axis.' },
      { text: '(x - 4)(x + 3) = 0', why: 'Factorise x² - x - 12.' },
      { text: 'x = 4 or x = -3', why: 'Points (4, 0) and (-3, 0).' },
      { text: 'y-axis: put x = 0, y = -12', why: 'Point (0, -12).' },
      { text: 'Halfway: x = (4 + -3) ÷ 2 = 0.5', why: 'The turning point is halfway between the x-intercepts.' },
      { text: 'y = 0.25 - 0.5 - 12 = -12.25', why: 'Smile shape, so this is the lowest point (0.5, -12.25).' },
    ],
    answer: 'Intercepts (-3, 0), (4, 0), (0, -12). Lowest point (0.5, -12.25)',
  } },

  { c: true },
  { exam: [
    { level: 'Easy', topic: 'Name the shape', lines: ['What shape is the graph of `y = -x² + 4`: a smile or a frown?'], skill: 'Practice question. Skill: the sign of x².', solution: ['The number in front of x² is negative.', 'It is a **frown** (an upside-down U).'] },
    { level: 'Easy / Medium', topic: 'Where does it cut the y-axis?', lines: ['Where does `y = x² - 4` cut the y-axis?'], skill: 'Practice question. Skill: put x = 0.', solution: ['`y = 0 - 4 = -4`', '**(0, -4)**'] },
    { level: 'Medium', topic: 'Intercepts', lines: ['Find where `y = x² - 4` cuts the x-axis.'], skill: 'Practice question. Skill: put y = 0.', solution: ['`x² - 4 = 0`, so `x² = 4`', '**(-2, 0) and (2, 0)**'] },
    { level: 'Medium / Hard', topic: 'Turning point', lines: ['`y = x² - 6x + 5` cuts the x-axis at (1, 0) and (5, 0).', 'Find its turning point.'], skill: 'Practice question. Skill: halfway between the intercepts.', solution: ['Halfway: `x = (1 + 5) ÷ 2 = 3`', '`y = 9 - 18 + 5 = -4`', '**(3, -4)**, the lowest point'] },
  ] },
  { p: '**The one thing to remember:** a sketch needs the **shape** and the **points where it cuts the axes**.' },
];
