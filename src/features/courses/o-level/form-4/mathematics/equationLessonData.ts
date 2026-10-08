/*
 * Lesson content for the Equations topic (15 sub-topics). Same block format as
 * the other lessons, with { diagram: 'name' } figures from equationDiagrams.tsx.
 *
 * Cards with a "Source:" line come from the ZIMSEC papers named there (wording
 * shortened; answers checked against the examiners' mark schemes where we had
 * one). Cards that say "Practice question" were written in the same style.
 *
 * Papers read: Nov 2020 P2, Nov 2021 P1, Nov 2022 P1, Jun 2023 P1, Nov 2023 P1,
 * Nov 2025 P2. Equations were set in every one of them. Where no question on a
 * sub-topic was found (for example the discriminant) the lesson says so.
 */

type Solver = { title: string; problem: string; steps: { text: string; why?: string }[]; answer: string };
type Level = 'Easy' | 'Easy / Medium' | 'Medium' | 'Medium / Hard' | 'Hard';

// A real past-paper card.
const R = (level: Level, topic: string, lines: string[], source: string, skill: string, solution: string[]) => ({
  level, topic, lines, skill: `Source: ${source}. Skill: ${skill}.`, solution,
});
// A practice card.
const P = (level: Level, topic: string, lines: string[], skill: string, solution: string[]) => ({
  level, topic, lines, skill: `Practice question. Skill: ${skill}.`, solution,
});

const N20 = 'ZIMSEC November 2020, Paper 2';
const N21 = 'ZIMSEC November 2021, Paper 1';
const N22 = 'ZIMSEC November 2022, Paper 1';
const J23 = 'ZIMSEC June 2023, Paper 1';
const N23 = 'ZIMSEC November 2023, Paper 1';
const N25 = 'ZIMSEC November 2025, Paper 2';

/* ================================================================ real question cards */

const REAL = {
  n22q2a: R('Easy / Medium', 'Solve a simple equation', ['Solve the equation `13x = 377`.'], `${N22}, Question 2(a)`, 'divide both sides by 13',
    ['`x = 377 ÷ 13`', '**x = 29**']),
  n23q4b: R('Medium', 'Solve from a function', ['Given that `f(x) = 3x - 1`, find `x` if `f(x) = 5`.'], `${N23}, Question 4(b)`, 'replace f(x) with 5, then solve',
    ['`3x - 1 = 5`', '`3x = 6`', '**x = 2**']),
  n25q2c: R('Medium', 'An equation with brackets', ['Solve the equation `3(2x - 1) - (2 - x) = 7`.'], `${N25}, Question 2(c)`, 'expand carefully, including the minus sign',
    ['`6x - 3 - 2 + x = 7`', '`7x - 5 = 7`, so `7x = 12`', '**x = 12/7 = 1 5/7**']),
  j23q15a: R('Medium', 'x on both sides, with a bracket', ['Solve `3(x - 2) = 5x + 3`.'], `${J23}, Question 15(a)`, 'expand, then collect x-terms',
    ['`3x - 6 = 5x + 3`', '`-9 = 2x`', '**x = -4.5**']),
  n23q15b: R('Medium', 'Fractions: cross multiply', ['Solve the equation `2/(3n - 1) = 3/(n + 2)`.'], `${N23}, Question 15(b)`, 'cross multiply, then expand',
    ['`2(n + 2) = 3(3n - 1)`', '`2n + 4 = 9n - 3`', '`7 = 7n`', '**n = 1**']),
  n21q20b: R('Medium', 'A fraction equal to a fraction', ['Given that `f(x) = 3/(x + 2)`, find the value of `x` for which `f(x) = -3/4`.'], `${N21}, Question 20(b)`, 'cross multiply',
    ['`3/(x + 2) = -3/4`', '`12 = -3(x + 2) = -3x - 6`', '`18 = -3x`', '**x = -6**']),
  n21q22b: R('Hard', 'Fractions to a ratio', ['Given that `(7t - s)/2 = (s - 5t)/3`, find the ratio `t : s`.'], `${N21}, Question 22(b)`, 'clear the fractions, then collect t and s',
    ['`3(7t - s) = 2(s - 5t)`', '`21t - 3s = 2s - 10t`', '`31t = 5s`', '**t : s = 5 : 31**']),
  n22q8: R('Medium', 'Simultaneous equations (add)', ['Solve the simultaneous equations:', '`3m - n = -7`', '`2m + n = 17`'], `${N22}, Question 8`, 'add to remove n',
    ['Add: `5m = 10`, so **m = 2**', '`2(2) + n = 17`', '**n = 13**']),
  n25q3d: R('Medium', 'Simultaneous equations (substitute)', ['Solve the simultaneous equations:', '`3m + n = -5`', '`m = 1 - 3n`'], `${N25}, Question 3(d)`, 'substitute m into the first equation',
    ['`3(1 - 3n) + n = -5`', '`3 - 8n = -5`, so `n = 1`', '`m = 1 - 3(1) =` **-2**']),
  n21q11: R('Medium', 'Simultaneous equations', ['Solve the simultaneous equations:', '`2x + y = 4`', '`5y - 4x = 13`'], `${N21}, Question 11`, 'make y the subject of the first, then substitute',
    ['`y = 4 - 2x`', '`5(4 - 2x) - 4x = 13`, so `20 - 14x = 13`', '**x = 1/2**', '`y = 4 - 1 =` **3**']),
  n23q6: R('Medium / Hard', 'Simultaneous equations (multiply first)', ['Solve the simultaneous equations:', '`3x + 2y = 8`', '`5x + 3y = 4.5`'], `${N23}, Question 6`, 'make the y numbers equal, then subtract',
    ['(1) × 3: `9x + 6y = 24`', '(2) × 2: `10x + 6y = 9`', 'Subtract: **x = -15**', '`3(-15) + 2y = 8`, so **y = 26.5**']),
  n22q7b: R('Medium', 'Quadratic from a function', ['Given that `f(d) = d² - 3d`, find the values of `d` for which `f(d) = 10`.'], `${N22}, Question 7(b)`, 'make one side 0, then factorise',
    ['`d² - 3d - 10 = 0`', '`(d - 5)(d + 2) = 0`', '**d = 5 or d = -2**']),
  n25q2b: R('Medium', 'Factorise a quadratic', ['Factorise `2x² - 3x + 1`.'], `${N25}, Question 2(b)`, 'split the middle term, then group',
    ['`2x² - 2x - x + 1`', '`2x(x - 1) - 1(x - 1)`', '**(2x - 1)(x - 1)**']),
  n22q14a: R('Medium / Hard', 'Difference of two squares', ['Factorise completely `36p⁴ - 4q²`.'], `${N22}, Question 14(a)`, 'common factor first, then difference of squares',
    ['`4(9p⁴ - q²)`', '**4(3p² - q)(3p² + q)**']),
  n22q14b: R('Medium / Hard', 'Factorise by grouping', ['Factorise completely `10my + 15ny + 6m + 9n`.'], `${N22}, Question 14(b)`, 'group in pairs',
    ['`5y(2m + 3n) + 3(2m + 3n)`', '**(5y + 3)(2m + 3n)**']),
  n21q9: R('Medium / Hard', 'Factorise completely', ['Factorise completely `x²(y + 1) - y - 1`.'], `${N21}, Question 9`, 'take out (y + 1), then difference of squares',
    ['`x²(y + 1) - 1(y + 1)`', '`(x² - 1)(y + 1)`', '**(x + 1)(x - 1)(y + 1)**']),
  n22q6: R('Medium', 'Solve by factorising', ['Solve the equation `2x² - 5x - 3 = 0`.'], `${N22}, Question 6`, 'split the middle term, then use the zero rule',
    ['`(x - 3)(2x + 1) = 0`', '**x = 3 or x = -1/2**']),
  n23q15a: R('Medium', 'Factorised form', ['Solve the equation `(5m - 3)(2m + 1) = 0`.'], `${N23}, Question 15(a)`, 'the zero rule',
    ['`5m - 3 = 0` or `2m + 1 = 0`', '**m = 3/5 or m = -1/2**']),
  n22q15b: R('Medium', 'A singular matrix gives a quadratic', ['The matrix `A` has rows (m, 6) and (12, 2m). `A` is singular. Find the two possible values of `m`.'], `${N22}, Question 15(b)`, 'determinant = 0, then square root',
    ['`2m² - 72 = 0`', '`m² = 36`', '**m = 6 or m = -6**']),
  n22q18a: R('Medium', 'A square root gives two answers', ['The magnitude of the vector with components (x, 3) is 5.', 'Find the possible values of `x`.'], `${N22}, Question 18(a)`, 'square both sides, then take both roots',
    ['`x² + 9 = 25`', '`x² = 16`', '**x = 4 or x = -4**']),
  j23q22b: R('Medium / Hard', 'A singular matrix gives a quadratic', ['The matrix `N` has rows (y², 6) and (3, 2). `N` is singular.', 'Find the possible values of `y`.'], `${J23}, Question 22(b)`, 'determinant = 0',
    ['`2y² - 18 = 0`', '`y² = 9`', '**y = 3 or y = -3**']),
  j23q15b: R('Medium', 'A perfect square equals a number', ['Solve `(q - 2/9)² = 49/81`.'], `${J23}, Question 15(b)`, 'take the square root of both sides',
    ['`q - 2/9 = ±7/9`', '`q = 2/9 + 7/9 =` **1**', 'or `q = 2/9 - 7/9 =` **-5/9**']),
  n20q7c: R('Medium', 'The quadratic formula', ['Solve the equation `3x² + 5x - 18 = 0`, giving the answers correct to three significant figures.'], `${N20}, Question 7(c)`, 'quadratic formula',
    ['`a = 3, b = 5, c = -18`', '`x = (-5 ± √241) ÷ 6`', '**x = 1.75 or x = -3.42**']),
  j23q8: R('Medium', 'A line and a quadratic', ['Given that `m + 3n = 5` and `m² - 9n² = -15`, find', '(a) the value of `m - 3n`, (b) the values of `m` and `n`.'], `${J23}, Question 8`, 'difference of two squares',
    ['(a) `m² - 9n² = (m - 3n)(m + 3n)`', '`(m - 3n) × 5 = -15`, so **m - 3n = -3**', '(b) add: `2m = 2`, so **m = 1**', '`3n = 4`, so **n = 4/3**']),
  j23q6b: R('Medium', 'Angles of a quadrilateral', ['A quadrilateral has interior angles of `x°`, `2x°`, `(x + 10)°` and `(x + 50)°`.', 'Calculate the value of `x`.'], `${J23}, Question 6(b)`, 'angles add up to 360°',
    ['`x + 2x + (x + 10) + (x + 50) = 360`', '`5x + 60 = 360`', '**x = 60**']),
  n23q9a: R('Easy / Medium', 'Find a missing value from the mean', ['A student scored 14, x, 15, 19, 15 and 13 in 6 tests.', 'Find the value of `x` if the mean of the marks is 13.'], `${N23}, Question 9(a)`, 'mean = total ÷ number',
    ['`(76 + x) ÷ 6 = 13`', '`76 + x = 78`', '**x = 2**']),
  n22q21a: R('Medium', 'Angles of a regular polygon', ['The interior angle of a regular polygon is `13x°` and the exterior angle is `2x°`.', '(i) Calculate the value of `x`. (ii) Find the number of sides.'], `${N22}, Question 21(a)`, 'interior + exterior = 180°',
    ['(i) `13x + 2x = 180`, so **x = 12**', '(ii) exterior angle = 24°', '`360 ÷ 24 =` **15 sides**']),
  n22q23a: R('Medium / Hard', 'A trapezium and its perimeter', ['ABCD is an isosceles trapezium with AB = 5 cm, DC = 17 cm and AD = BC. AB is parallel to DC. The perimeter is 42 cm.', 'Calculate the perpendicular distance between the two parallel sides.'], `${N22}, Question 23(a)`, 'equation from the perimeter, then Pythagoras',
    ['`5 + 17 + 2x = 42`, so `x = 10`', 'Sideways: `(17 - 5) ÷ 2 = 6`', '`height² = 10² - 6² = 64`', '**height = 8 cm**']),
  n20q7: R('Hard', 'Rectangle: perimeter and area', ['A rectangle has width `(x + 2)` cm and perimeter `(8x + 2)` cm.', '(a) Find an expression for the length.', '(b) The area is 16 cm². Show that `3x² + 5x - 18 = 0`.', '(c) Solve it (3 s.f.). (d) Hence find the perimeter.'], `${N20}, Question 7`, 'form an equation, then solve',
    ['(a) **length = 3x - 1**', '(b) `(3x - 1)(x + 2) = 16`, so `3x² + 5x - 18 = 0`', '(c) **x = 1.75** (or -3.42, rejected)', '(d) `8(1.75) + 2 =` **16 cm**']),
  n21q17a: R('Medium', 'Make a the subject', ['Given that `v² = u² + 2as`, make `a` the subject of the formula.'], `${N21}, Question 17(a)`, 'undo + u², then ÷ 2s',
    ['`v² - u² = 2as`', '**a = (v² - u²) ÷ 2s**']),
  n22q17b: R('Medium', 'Make h the subject', ['Make `h` the subject of the formula `A = 2πr² + 2πrh`.'], `${N22}, Question 17(b)`, 'undo + 2πr², then ÷ 2πr',
    ['`A - 2πr² = 2πrh`', '**h = (A - 2πr²) ÷ 2πr**']),
  n23q14b: R('Medium', 'Make a the subject (with a root)', ['Given the formula `1/c = √(b - a)`, make `a` the subject.'], `${N23}, Question 14(b)`, 'square both sides first',
    ['`1/c² = b - a`', '**a = b - 1/c²**']),
  j23q9: R('Medium / Hard', 'Make m the subject (fraction)', ['Given that `p = q/(q + m)`, (a) make `m` the subject, (b) find `m` when `q = 3` and `p = 2`.'], `${J23}, Question 9`, 'multiply to clear the fraction',
    ['(a) `p(q + m) = q`, so `pm = q - pq`', '**m = (q - pq) ÷ p**', '(b) `m = (3 - 6) ÷ 2 =` **-1.5**']),
  n21q17b: R('Medium', 'Substitute into a formula', ['Use `a = (v² - u²) ÷ 2s` to find `a` when `s = 5`, `u = 2` and `v = 2`.'], `${N21}, Question 17(b)`, 'put the numbers in',
    ['`a = (2² - 2²) ÷ (2 × 5)`', '`= 0 ÷ 10 =` **0**']),
  n22q17a: R('Medium', 'Substitute into a formula', ['The velocity `v` m/s is given by `v = 5 + 4t - t²`.', 'Calculate `v` when `t = 3`.'], `${N22}, Question 17(a)(i)`, 'put t = 3 in',
    ['`v = 5 + 4(3) - 3²`', '`= 5 + 12 - 9 =` **8**']),
  n23q14a: R('Medium', 'Substitute negative numbers', ['Given the formula `1/c = √(b - a)`, find `c` if `a = -4` and `b = 21`.'], `${N23}, Question 14(a)`, 'brackets for the negative number',
    ['`1/c = √(21 - (-4)) = √25 = 5`', '**c = 1/5**']),
  n23q4a: R('Easy / Medium', 'Substitute into a function', ['Given that `f(x) = 3x - 1`, find `f(-2)`.'], `${N23}, Question 4(a)`, 'put -2 in brackets',
    ['`f(-2) = 3(-2) - 1`', '`= -6 - 1 =` **-7**']),
};

/* ================================================================ real working (pen solvers) */

const S = (title: string, problem: string, steps: [string, string?][], answer: string): Solver => ({
  title, problem, steps: steps.map(([text, why]) => ({ text, why: why ?? '' })), answer,
});

const SOLVE_N2025_Q2C = S(`${N25}, Question 2(c)`, 'Solve 3(2x - 1) - (2 - x) = 7.', [
  ['3(2x - 1) - (2 - x) = 7', 'Expand both brackets first.'],
  ['6x - 3 - 2 + x = 7', 'Careful: -(2 - x) = -2 + x. Every sign flips.'],
  ['7x - 5 = 7', 'Collect: 6x + x = 7x and -3 - 2 = -5.'],
  ['7x = 7 + 5', 'Add 5 to both sides.'],
  ['7x = 12', ''],
  ['x = 12/7 = 1 5/7', 'Divide both sides by 7. As a decimal this is about 1.71.'],
], 'x = 12/7');

const SOLVE_J2023_Q15A = S(`${J23}, Question 15(a)`, 'Solve 3(x - 2) = 5x + 3.', [
  ['3(x - 2) = 5x + 3', ''],
  ['3x - 6 = 5x + 3', 'Expand the bracket first.'],
  ['-6 - 3 = 5x - 3x', 'Numbers to the left, x-terms to the right. The bigger x stays positive.'],
  ['-9 = 2x', ''],
  ['x = -4.5', 'Divide both sides by 2.'],
], 'x = -4.5');

const SOLVE_N2023_Q15B = S(`${N23}, Question 15(b)`, 'Solve 2/(3n - 1) = 3/(n + 2).', [
  ['2/(3n - 1) = 3/(n + 2)', ''],
  ['2(n + 2) = 3(3n - 1)', 'Cross multiply: top of one side × bottom of the other.'],
  ['2n + 4 = 9n - 3', 'Expand both brackets.'],
  ['4 + 3 = 9n - 2n', 'Numbers to the left, n-terms to the right.'],
  ['7 = 7n', ''],
  ['n = 1', 'Divide both sides by 7.'],
], 'n = 1');

const SOLVE_N2021_Q20B = S(`${N21}, Question 20(b)`, 'f(x) = 3/(x + 2). Find x when f(x) = -3/4.', [
  ['3/(x + 2) = -3/4', 'Put f(x) = -3/4.'],
  ['3 × 4 = -3(x + 2)', 'Cross multiply.'],
  ['12 = -3x - 6', 'Expand the bracket.'],
  ['12 + 6 = -3x', 'Add 6 to both sides.'],
  ['18 = -3x', ''],
  ['x = -6', 'Divide both sides by -3.'],
], 'x = -6');

const SOLVE_N2021_Q22B = S(`${N21}, Question 22(b)`, '(7t - s)/2 = (s - 5t)/3. Find the ratio t : s.', [
  ['(7t - s)/2 = (s - 5t)/3', ''],
  ['3(7t - s) = 2(s - 5t)', 'Multiply both sides by 6. The 2 and 3 both go into 6.'],
  ['21t - 3s = 2s - 10t', 'Expand.'],
  ['21t + 10t = 2s + 3s', 'All t on the left, all s on the right.'],
  ['31t = 5s', ''],
  ['t ÷ s = 5 ÷ 31', 'Divide both sides by 31s.'],
  ['t : s = 5 : 31', ''],
], 't : s = 5 : 31');

const SOLVE_N2022_Q8 = S(`${N22}, Question 8`, 'Solve 3m - n = -7 (1) and 2m + n = 17 (2).', [
  ['The n terms are -n and +n', 'Opposite signs, so adding will remove n.'],
  ['Add (1) and (2)', ''],
  ['5m = 10', '3m + 2m = 5m. -7 + 17 = 10.'],
  ['m = 2', ''],
  ['2(2) + n = 17', 'Put m = 2 into (2).'],
  ['4 + n = 17', ''],
  ['n = 13', ''],
  ['Check (1): 3(2) - 13 = -7', 'It works.'],
], 'm = 2 and n = 13');

const SOLVE_N2023_Q6 = S(`${N23}, Question 6`, 'Solve 3x + 2y = 8 (1) and 5x + 3y = 4.5 (2).', [
  ['Make the y numbers equal: 2 and 3 → 6', 'Find a number both 2 and 3 go into.'],
  ['(1) × 3:  9x + 6y = 24', ''],
  ['(2) × 2:  10x + 6y = 9', ''],
  ['Subtract: 10x - 9x = 9 - 24', 'Both have +6y, so subtract to remove y.'],
  ['x = -15', ''],
  ['3(-15) + 2y = 8', 'Put x = -15 into (1).'],
  ['-45 + 2y = 8', ''],
  ['2y = 53', 'Add 45 to both sides.'],
  ['y = 26.5', ''],
], 'x = -15 and y = 26.5');

const SOLVE_N2025_Q3D = S(`${N25}, Question 3(d)`, 'Solve 3m + n = -5 and m = 1 - 3n.', [
  ['m = 1 - 3n is already given', 'm is on its own, so put it into the other equation.'],
  ['3(1 - 3n) + n = -5', ''],
  ['3 - 9n + n = -5', 'Expand the bracket.'],
  ['3 - 8n = -5', ''],
  ['-8n = -8', 'Take 3 from both sides.'],
  ['n = 1', ''],
  ['m = 1 - 3(1)', 'Put n = 1 into m = 1 - 3n.'],
  ['m = -2', ''],
], 'm = -2 and n = 1');

const SOLVE_N2021_Q11 = S(`${N21}, Question 11`, 'Solve 2x + y = 4 (1) and 5y - 4x = 13 (2).', [
  ['From (1): y = 4 - 2x', 'Make y the subject of the easier equation.'],
  ['5(4 - 2x) - 4x = 13', 'Put it into (2).'],
  ['20 - 10x - 4x = 13', 'Expand.'],
  ['20 - 14x = 13', ''],
  ['7 = 14x', 'Add 14x to both sides, take 13 from both sides.'],
  ['x = 1/2', ''],
  ['y = 4 - 2(1/2) = 3', 'Put x back into y = 4 - 2x.'],
], 'x = 1/2 and y = 3');

const SOLVE_N2022_Q6 = S(`${N22}, Question 6`, 'Solve 2x² - 5x - 3 = 0.', [
  ['a × c = 2 × (-3) = -6', 'Multiply the first and last numbers.'],
  ['Multiply to -6, add to -5: -6 and +1', 'Find two numbers that do both.'],
  ['2x² - 6x + x - 3 = 0', 'Split the middle term -5x into -6x + x.'],
  ['2x(x - 3) + 1(x - 3) = 0', 'Take out a common factor from each pair.'],
  ['(x - 3)(2x + 1) = 0', 'Both pairs share the bracket (x - 3).'],
  ['x - 3 = 0 or 2x + 1 = 0', 'The zero rule: one bracket must be 0.'],
  ['x = 3 or x = -1/2', ''],
], 'x = 3 or x = -1/2');

const SOLVE_N2023_Q15A = S(`${N23}, Question 15(a)`, 'Solve (5m - 3)(2m + 1) = 0.', [
  ['(5m - 3)(2m + 1) = 0', 'Already factorised.'],
  ['5m - 3 = 0 or 2m + 1 = 0', 'One bracket must be 0.'],
  ['5m = 3 or 2m = -1', ''],
  ['m = 3/5 or m = -1/2', ''],
], 'm = 3/5 or m = -1/2');

const SOLVE_N2022_Q18A = S(`${N22}, Question 18(a)`, 'The magnitude of the vector (x, 3) is 5. Find the possible values of x.', [
  ['√(x² + 3²) = 5', 'Magnitude = square root of (x² + y²).'],
  ['x² + 9 = 25', 'Square both sides.'],
  ['x² = 16', ''],
  ['x = 4 or x = -4', 'Both 4 and -4 give 16 when squared.'],
], 'x = 4 or x = -4');

const SOLVE_J2023_Q15B = S(`${J23}, Question 15(b)`, 'Solve (q - 2/9)² = 49/81.', [
  ['(q - 2/9)² = 49/81', 'A perfect square equals a number.'],
  ['q - 2/9 = ±7/9', 'Take the square root of both sides. Remember ±. √49 = 7 and √81 = 9.'],
  ['q = 2/9 + 7/9 = 1', 'Use the + first.'],
  ['or q = 2/9 - 7/9 = -5/9', 'Now use the -.'],
], 'q = 1 or q = -5/9');

const SOLVE_N2020_Q7C = S(`${N20}, Question 7(c)`, 'Solve 3x² + 5x - 18 = 0, giving the answers correct to three significant figures.', [
  ['a = 3, b = 5, c = -18', 'Read them off, with their signs.'],
  ['x = (-5 ± √(5² - 4(3)(-18))) ÷ (2 × 3)', 'Put them into the formula, in brackets.'],
  ['b² - 4ac = 25 + 216 = 241', '-4 × 3 × (-18) = +216. Minus times minus is plus.'],
  ['x = (-5 ± √241) ÷ 6', ''],
  ['√241 = 15.52', 'Use your calculator.'],
  ['x = (-5 + 15.52) ÷ 6 = 1.75', 'Use the + first.'],
  ['x = (-5 - 15.52) ÷ 6 = -3.42', 'Now use the -.'],
], 'x = 1.75 or x = -3.42');

const SOLVE_J2023_Q8 = S(`${J23}, Question 8`, 'm + 3n = 5 and m² - 9n² = -15. Find (a) m - 3n, (b) m and n.', [
  ['m² - 9n² = (m - 3n)(m + 3n)', 'Difference of two squares.'],
  ['(m - 3n)(5) = -15', 'We know m + 3n = 5.'],
  ['m - 3n = -3', '(a) Divide both sides by 5.'],
  ['m + 3n = 5 and m - 3n = -3', '(b) Now we have two simple equations.'],
  ['Add: 2m = 2', 'The 3n and -3n cancel.'],
  ['m = 1', ''],
  ['1 + 3n = 5', 'Put m = 1 into m + 3n = 5.'],
  ['3n = 4', ''],
  ['n = 4/3', ''],
], '(a) -3   (b) m = 1 and n = 4/3');

const SOLVE_J2023_Q6B = S(`${J23}, Question 6(b)`, 'A quadrilateral has angles x°, 2x°, (x + 10)° and (x + 50)°. Find x.', [
  ['Angles in a quadrilateral add up to 360°', ''],
  ['x + 2x + (x + 10) + (x + 50) = 360', ''],
  ['5x + 60 = 360', 'x + 2x + x + x = 5x, and 10 + 50 = 60.'],
  ['5x = 300', 'Take 60 from both sides.'],
  ['x = 60', 'Divide both sides by 5.'],
], 'x = 60');

const SOLVE_N2023_Q9A = S(`${N23}, Question 9(a)`, 'A student scored 14, x, 15, 19, 15, 13 in 6 tests. The mean is 13. Find x.', [
  ['mean = total ÷ number of tests', ''],
  ['(14 + x + 15 + 19 + 15 + 13) ÷ 6 = 13', ''],
  ['(76 + x) ÷ 6 = 13', '14 + 15 + 19 + 15 + 13 = 76.'],
  ['76 + x = 78', 'Multiply both sides by 6.'],
  ['x = 2', ''],
], 'x = 2');

const SOLVE_N2022_Q21A = S(`${N22}, Question 21(a)`, 'The interior angle of a regular polygon is 13x° and the exterior angle is 2x°. Find x and the number of sides.', [
  ['Interior + exterior = 180°', 'They sit on a straight line.'],
  ['13x + 2x = 180', ''],
  ['15x = 180', ''],
  ['x = 12', ''],
  ['Exterior angle = 2 × 12 = 24°', ''],
  ['sides = 360 ÷ 24 = 15', 'The exterior angles of any polygon add up to 360°.'],
], 'x = 12 and 15 sides');

const SOLVE_N2022_Q23A = S(`${N22}, Question 23(a)`, 'Isosceles trapezium: AB = 5, DC = 17, AD = BC, perimeter 42 cm. Find the distance between the parallel sides.', [
  ['Let AD = BC = x', 'The two slanting sides are equal.'],
  ['5 + 17 + x + x = 42', 'Perimeter = all four sides.'],
  ['22 + 2x = 42', ''],
  ['2x = 20, so x = 10', ''],
  ['Sideways overhang = (17 - 5) ÷ 2 = 6', 'The extra 12 cm is shared by both ends.'],
  ['height² = 10² - 6²', 'Pythagoras in the small right-angled triangle.'],
  ['height² = 100 - 36 = 64', ''],
  ['height = 8 cm', ''],
], 'height = 8 cm');

const SOLVE_N2020_Q7 = S(`${N20}, Question 7`, 'A rectangle has width (x + 2) cm and perimeter (8x + 2) cm. Its area is 16 cm². Find the length, form an equation, solve it, and find the perimeter.', [
  ['8x + 2 = 2(l + x + 2)', 'Perimeter = 2 × (length + width). Let the length be l.'],
  ['4x + 1 = l + x + 2', 'Divide both sides by 2.'],
  ['l = 3x - 1', '(a) The length.'],
  ['(3x - 1)(x + 2) = 16', '(b) Area = length × width.'],
  ['3x² + 6x - x - 2 = 16', 'Expand.'],
  ['3x² + 5x - 18 = 0', 'Take 16 from both sides. This is what the question asked us to show.'],
  ['x = 1.75 (quadratic formula)', '(c) The other answer, -3.42, is rejected: a length cannot be negative.'],
  ['perimeter = 8(1.75) + 2', '(d) Put x = 1.75 into 8x + 2.'],
  ['perimeter = 16 cm', ''],
], 'x = 1.75 and the perimeter is 16 cm');

const SOLVE_N2021_Q17A = S(`${N21}, Question 17(a)`, 'Make a the subject of v² = u² + 2as.', [
  ['v² = u² + 2as', ''],
  ['v² - u² = 2as', 'Take u² from both sides.'],
  ['(v² - u²) ÷ 2s = a', 'Divide both sides by 2s.'],
  ['a = (v² - u²) ÷ 2s', 'Write it with a on the left.'],
], 'a = (v² - u²) ÷ 2s');

const SOLVE_N2022_Q17B = S(`${N22}, Question 17(b)`, 'Make h the subject of A = 2πr² + 2πrh.', [
  ['A = 2πr² + 2πrh', ''],
  ['A - 2πr² = 2πrh', 'Take 2πr² from both sides.'],
  ['h = (A - 2πr²) ÷ 2πr', 'Divide both sides by 2πr.'],
], 'h = (A - 2πr²) ÷ 2πr');

const SOLVE_N2023_Q14B = S(`${N23}, Question 14(b)`, 'Make a the subject of 1/c = √(b - a).', [
  ['1/c = √(b - a)', ''],
  ['1/c² = b - a', 'Square both sides to get rid of the root.'],
  ['a + 1/c² = b', 'Add a to both sides.'],
  ['a = b - 1/c²', 'Take 1/c² from both sides.'],
], 'a = b - 1/c²');

const SOLVE_J2023_Q9 = S(`${J23}, Question 9`, 'p = q/(q + m). (a) Make m the subject. (b) Find m when q = 3 and p = 2.', [
  ['p = q/(q + m)', ''],
  ['p(q + m) = q', 'Multiply both sides by (q + m) to clear the fraction.'],
  ['pq + pm = q', 'Expand the bracket.'],
  ['pm = q - pq', 'Take pq from both sides.'],
  ['m = (q - pq) ÷ p', '(a) Divide both sides by p.'],
  ['m = (3 - 2 × 3) ÷ 2', '(b) Put q = 3 and p = 2 in.'],
  ['m = -3 ÷ 2 = -1.5', ''],
], '(a) m = (q - pq) ÷ p   (b) m = -1.5');

/* ================================================================ 1. linear equations */

export const LINEAR_LESSON = [
  { h: 'What is an equation?' },
  { p: 'An **equation** says that two things are equal. It has an equals sign `=`. A **linear equation** has a letter (the unknown) with no power, like `x`, but no `x²`. To **solve** it means to find the number that makes it true.' },
  { diagram: 'balanceLinear', caption: 'Think of an equation as a balance. Whatever you do to one side, do to the other side, and it stays balanced.' },
  { p: 'The aim is to get `x` **on its own**. Do the **opposite** (inverse) of what has been done to `x`.' },
  { table: [['To undo', 'Do this'], ['+ 5', '- 5'], ['- 5', '+ 5'], ['× 3', '÷ 3'], ['÷ 3', '× 3']] },

  { c: true },
  { h: 'Solving step by step' },
  { solver: S('Solve 2x + 3 = 11', 'Solve 2x + 3 = 11.', [
    ['2x + 3 = 11', 'First undo the + 3.'],
    ['2x + 3 - 3 = 11 - 3', 'Take 3 away from both sides.'],
    ['2x = 8', ''],
    ['2x ÷ 2 = 8 ÷ 2', 'Now undo the × 2. Divide both sides by 2.'],
    ['x = 4', ''],
    ['Check: 2(4) + 3 = 11', 'Put x back in. Both sides match, so x = 4 is right.'],
  ], 'x = 4') },
  { solver: S(`${N22}, Question 2(a)`, 'Solve 13x = 377.', [
    ['13x = 377', 'x is multiplied by 13.'],
    ['x = 377 ÷ 13', 'Undo it: divide both sides by 13.'],
    ['x = 29', 'Check: 13 × 29 = 377.'],
  ], 'x = 29') },
  { p: 'Always **check** by putting your answer back into the original equation.' },

  { c: true },
  { exam: [
    P('Easy', 'Add or subtract', ['Solve `x + 7 = 12`.'], 'undo the + 7', ['`x = 12 - 7 =` **5**']),
    P('Easy', 'Multiply', ['Solve `3x = 21`.'], 'divide both sides by 3', ['`x = 21 ÷ 3 =` **7**']),
    REAL.n22q2a,
    REAL.n23q4b,
    P('Medium', 'Two steps', ['Solve `5x - 7 = 18`.'], 'undo the - 7, then the × 5', ['`5x = 25`', '**x = 5**']),
    P('Medium', 'A minus x', ['Solve `7 - 2x = 1`.'], 'careful with the sign of x', ['`-2x = -6`', '**x = 3**']),
    P('Medium / Hard', 'A fraction', ['Solve `x/4 + 3 = 8`.'], 'undo + 3, then ÷ 4', ['`x/4 = 5`', '**x = 20**']),
  ] },
  { p: '**The one thing to remember:** do the **same thing to both sides**, and use the **opposite** operation to get `x` on its own.' },
];

/* ================================================================ 2. brackets */

export const BRACKETS_LESSON = [
  { h: 'Expanding a bracket' },
  { p: 'A number outside a bracket means "multiply **everything** inside". So `3(x + 4)` means `3 × x + 3 × 4 = 3x + 12`.' },
  { diagram: 'bracketBox', caption: 'The most common mistake is the sign. A minus outside flips every sign inside.' },

  { c: true },
  { h: 'Solving an equation with brackets' },
  { p: '(1) **Expand** the brackets. (2) Collect the `x` terms and the numbers. (3) Solve as normal.' },
  { solver: S('A shortcut', 'Solve 2(x + 5) = 18.', [
    ['2(x + 5) = 18', 'The whole bracket is multiplied by 2.'],
    ['x + 5 = 9', 'Shortcut: divide both sides by 2 first.'],
    ['x = 4', 'Take 5 from both sides.'],
  ], 'x = 4') },
  { solver: SOLVE_N2025_Q2C },

  { c: true },
  { exam: [
    P('Easy', 'One bracket', ['Solve `2(x + 3) = 14`.'], 'expand or divide first', ['`x + 3 = 7`', '**x = 4**']),
    P('Easy / Medium', 'One bracket', ['Solve `5(x - 2) = 20`.'], 'divide both sides by 5', ['`x - 2 = 4`', '**x = 6**']),
    P('Medium', 'Two brackets', ['Solve `4(x + 1) - 2(x - 3) = 16`.'], 'expand both, minus flips the sign', ['`4x + 4 - 2x + 6 = 16`', '`2x + 10 = 16`', '**x = 3**']),
    REAL.n25q2c,
    P('Medium / Hard', 'Brackets on both sides', ['Solve `3(2x - 1) = 2(x + 5)`.'], 'expand, then collect', ['`6x - 3 = 2x + 10`', '`4x = 13`', '**x = 3.25**']),
  ] },
  { p: '**The one thing to remember:** multiply **every** term inside the bracket. A **minus** outside flips **every** sign.' },
];

/* ================================================================ 3. fractions */

export const FRACTIONS_LESSON = [
  { h: 'Equations with fractions' },
  { p: 'Fractions look scary, but there is a trick: **get rid of them first**. Multiply **both sides** by the bottom number (the denominator).' },
  { solver: S('One fraction', 'Solve x/4 + 3 = 8.', [
    ['x/4 + 3 = 8', ''],
    ['x/4 = 5', 'Take 3 from both sides.'],
    ['x = 5 × 4', 'Multiply both sides by 4 to clear the fraction.'],
    ['x = 20', ''],
  ], 'x = 20') },
  { solver: S('Two fractions', 'Solve (x + 1)/2 = (x - 2)/3.', [
    ['(x + 1)/2 = (x - 2)/3', ''],
    ['Multiply both sides by 6', '6 is the smallest number that 2 and 3 both go into.'],
    ['3(x + 1) = 2(x - 2)', '6 ÷ 2 = 3 and 6 ÷ 3 = 2.'],
    ['3x + 3 = 2x - 4', 'Expand.'],
    ['x = -7', 'Take 2x from both sides, then take 3 from both sides. Check: (-7 + 1)/2 = -3 and (-7 - 2)/3 = -3.'],
  ], 'x = -7') },

  { c: true },
  { h: 'Cross multiplying' },
  { p: 'When there is **one fraction on each side** and nothing else, you can **cross multiply**: top of one side times bottom of the other side.' },
  { diagram: 'crossMultiply', caption: 'This is ZIMSEC November 2023, Question 15(b).' },
  { solver: SOLVE_N2023_Q15B },
  { solver: SOLVE_N2021_Q20B },

  { c: true },
  { h: 'Fractions that lead to a ratio' },
  { p: 'Sometimes the answer is a **ratio**, such as `t : s`. Clear the fractions, put all `t` on one side and all `s` on the other, then divide.' },
  { solver: SOLVE_N2021_Q22B },

  { c: true },
  { exam: [
    P('Easy', 'One fraction', ['Solve `x/3 = 4`.'], 'multiply both sides by 3', ['**x = 12**']),
    P('Easy / Medium', 'Fraction plus a number', ['Solve `x/2 + 1 = 6`.'], 'undo + 1, then ÷ 2', ['`x/2 = 5`', '**x = 10**']),
    P('Medium', 'A fraction with a bracket on top', ['Solve `(2x - 1)/3 = 5`.'], 'multiply both sides by 3', ['`2x - 1 = 15`', '`2x = 16`', '**x = 8**']),
    REAL.n23q15b,
    REAL.n21q20b,
    P('Medium / Hard', 'Cross multiply', ['Solve `3/(x - 1) = 6/(x + 4)`.'], 'cross multiply', ['`3(x + 4) = 6(x - 1)`', '`3x + 12 = 6x - 6`', '`18 = 3x`', '**x = 6**']),
    REAL.n21q22b,
  ] },
  { p: '**The one thing to remember:** **clear the fractions first**: multiply both sides by the bottom number, or cross multiply.' },
];

/* ================================================================ 4. unknown on both sides */

export const BOTH_SIDES_LESSON = [
  { h: 'x on both sides' },
  { p: 'Sometimes `x` is on the left **and** on the right. Move all the `x` terms to **one side** and all the numbers to the **other side**.' },
  { diagram: 'balanceBoth', caption: 'Take the same amount from both sides and the scale stays balanced.' },
  { p: 'Tip: move the **smaller** `x` term, so that the `x` you are left with stays **positive**.' },

  { c: true },
  { h: 'Solving step by step' },
  { solver: S('x on both sides', 'Solve 5x + 3 = 3x + 11.', [
    ['5x + 3 = 3x + 11', 'The smaller x term is 3x, so take 3x from both sides.'],
    ['5x - 3x + 3 = 11', ''],
    ['2x + 3 = 11', ''],
    ['2x = 11 - 3', 'Take 3 from both sides.'],
    ['2x = 8', ''],
    ['x = 4', 'Check left: 5(4) + 3 = 23. Check right: 3(4) + 11 = 23. They match.'],
  ], 'x = 4') },
  { solver: SOLVE_J2023_Q15A },

  { c: true },
  { exam: [
    P('Easy', 'Simple', ['Solve `4x = 2x + 10`.'], 'take 2x from both sides', ['`2x = 10`', '**x = 5**']),
    P('Easy / Medium', 'With numbers', ['Solve `5x - 2 = 3x + 8`.'], 'collect x and numbers', ['`2x = 10`', '**x = 5**']),
    P('Medium', 'With numbers', ['Solve `7x + 1 = 2x + 16`.'], 'collect x and numbers', ['`5x = 15`', '**x = 3**']),
    REAL.j23q15a,
    P('Medium / Hard', 'A bracket on one side', ['Solve `2(x + 4) = 5x - 7`.'], 'expand first', ['`2x + 8 = 5x - 7`', '`15 = 3x`', '**x = 5**']),
    P('Medium / Hard', 'A bracket and x on both sides', ['Solve `x + 2(x - 1) = 4x - 5`.'], 'expand, then collect', ['`3x - 2 = 4x - 5`', '`3 = x`', '**x = 3**']),
  ] },
  { p: '**The one thing to remember:** all the `x` terms to **one side**, all the numbers to the **other**. Check by putting your answer into **both** sides.' },
];

/* ================================================================ 5. simultaneous linear */

export const SIMULTANEOUS_LESSON = [
  { h: 'Two equations, two unknowns' },
  { p: 'Sometimes you have **two** unknowns, `x` and `y`, and **two** equations. You must find the pair of numbers that makes **both** equations true.' },
  { diagram: 'simLines', caption: 'Each equation is a straight line. The solution is the point where the two lines cross.' },

  { c: true },
  { h: 'Method 1: elimination' },
  { p: 'Get rid of one letter. Make the numbers in front of that letter the **same size**. If the signs are **different**, **add** the equations. If the signs are the **same**, **subtract**.' },
  { solver: SOLVE_N2022_Q8 },
  { p: 'When the numbers are not the same, **multiply** one or both equations first.' },
  { solver: SOLVE_N2023_Q6 },

  { c: true },
  { h: 'Method 2: substitution' },
  { p: 'When one letter is already on its own (or easy to get on its own), **put it into the other equation**.' },
  { solver: SOLVE_N2025_Q3D },
  { solver: SOLVE_N2021_Q11 },

  { c: true },
  { exam: [
    P('Easy', 'Add', ['Solve `x + y = 10` and `x - y = 4`.'], 'add the equations', ['Add: `2x = 14`, so **x = 7**', '`y = 10 - 7 =` **3**']),
    P('Easy / Medium', 'Add', ['Solve `2x + y = 9` and `x - y = 3`.'], 'the y terms cancel when you add', ['Add: `3x = 12`, so **x = 4**', '`4 - y = 3`, so **y = 1**']),
    REAL.n22q8,
    REAL.n25q3d,
    REAL.n21q11,
    P('Medium / Hard', 'A word problem', ['2 pens and 3 books cost $13. 1 pen and 2 books cost $8.', 'Find the price of a pen and of a book.'], 'form two equations', ['`2p + 3b = 13` and `p + 2b = 8`', '`p = 8 - 2b`, so `16 - 4b + 3b = 13`', '**b = 3** and **p = 2**', 'A pen costs $2 and a book costs $3.']),
    REAL.n23q6,
  ] },
  { p: '**The one thing to remember:** remove **one letter** (by adding, subtracting or substituting), find the other, then **put it back** to find the first.' },
];

/* ================================================================ 6. quadratic equations */

export const QUADRATIC_INTRO_LESSON = [
  { h: 'What is a quadratic equation?' },
  { p: 'A **quadratic equation** has an `x²` term as its highest power. Its standard form is:' },
  { f: 'ax² + bx + c = 0' },
  { p: '`a`, `b` and `c` are numbers, and `a` is not 0. Examples: `x² - 5x + 6 = 0` and `2x² - 5x - 3 = 0`. A quadratic usually has **two** answers.' },
  { diagram: 'parabolaRoots', caption: 'The curve `y = x² - 2x - 3` crosses the x-axis at `x = -1` and `x = 3`. These are the two answers of `x² - 2x - 3 = 0`.' },

  { c: true },
  { h: 'Standard form first' },
  { p: 'Before you solve, put the equation in standard form: **everything on one side, and 0 on the other**.' },
  { solver: S(`${N22}, Question 7(b)`, 'f(d) = d² - 3d. Find the values of d for which f(d) = 10.', [
    ['d² - 3d = 10', 'Put f(d) = 10.'],
    ['d² - 3d - 10 = 0', 'Take 10 from both sides, so one side is 0.'],
    ['(d - 5)(d + 2) = 0', 'Factorise: two numbers that multiply to -10 and add to -3 are -5 and +2.'],
    ['d = 5 or d = -2', 'Each bracket can be 0.'],
  ], 'd = 5 or d = -2') },

  { c: true },
  { h: 'Three ways to solve a quadratic' },
  { p: '(1) **Factorise** and use the zero rule: quick when it factorises. (2) **Complete the square**. (3) Use the **quadratic formula**: always works. The next sections teach each one.' },

  { c: true },
  { exam: [
    P('Easy', 'Standard form', ['Write `x² = 5x - 6` in the form `ax² + bx + c = 0`.'], 'one side must be 0', ['`x² - 5x + 6 = 0`']),
    P('Easy / Medium', 'Standard form', ['Write `2x² = 3x + 5` in standard form.'], 'move everything to one side', ['`2x² - 3x - 5 = 0`']),
    P('Easy / Medium', 'Show that', ['Show that `x(x + 3) = 10` can be written `x² + 3x - 10 = 0`.'], 'expand, then move 10 across', ['`x² + 3x = 10`', '`x² + 3x - 10 = 0`']),
    REAL.n22q7b,
  ] },
  { p: '**The one thing to remember:** a quadratic has an `x²`. Put it in standard form (`... = 0`) **before** you solve it.' },
];

/* ================================================================ 7. factorising quadratics */

export const FACTORISING_LESSON = [
  { h: 'What does factorising mean?' },
  { p: 'Factorising is **expanding backwards**. We turn `x² + 5x + 6` back into two brackets: `(x + 2)(x + 3)`.' },
  { diagram: 'factorBox', caption: 'The four parts of the rectangle add up to x² + 5x + 6, and the sides of the rectangle are (x + 2) and (x + 3).' },

  { c: true },
  { h: 'When there is just x² (no number in front)' },
  { p: 'For `x² + bx + c`, find two numbers that **multiply to c** and **add to b**. Signs help: if `c` is positive the two numbers have the **same** sign; if `c` is negative they have **different** signs.' },
  { solver: S('Factorise x² + 5x + 6', 'Factorise x² + 5x + 6.', [
    ['x² + 5x + 6', ''],
    ['Multiply to 6, add to 5', 'Pairs that multiply to 6: 1 × 6 and 2 × 3.'],
    ['2 + 3 = 5', 'So the numbers are 2 and 3.'],
    ['(x + 2)(x + 3)', 'Check: 2 × 3 = 6 and 2 + 3 = 5.'],
  ], '(x + 2)(x + 3)') },
  { solver: S('Factorise x² - x - 12', 'Factorise x² - x - 12.', [
    ['Multiply to -12, add to -1', 'c is negative, so one number is + and one is -.'],
    ['3 × (-4) = -12', 'Try 3 and -4.'],
    ['3 + (-4) = -1', 'It works.'],
    ['(x + 3)(x - 4)', ''],
  ], '(x + 3)(x - 4)') },

  { c: true },
  { h: 'When there is a number in front of x²' },
  { p: 'For `ax² + bx + c`: multiply `a × c`. Find two numbers that multiply to `ac` and add to `b`. **Split** the middle term, then **group** in pairs.' },
  { solver: S(`${N25}, Question 2(b)`, 'Factorise 2x² - 3x + 1.', [
    ['a × c = 2 × 1 = 2', ''],
    ['Multiply to 2, add to -3: -1 and -2', 'Both negative, because they add to -3.'],
    ['2x² - 2x - x + 1', 'Split -3x into -2x and -x.'],
    ['2x(x - 1) - 1(x - 1)', 'Take a common factor from each pair.'],
    ['(x - 1)(2x - 1)', 'Both pairs share the bracket (x - 1).'],
  ], '(2x - 1)(x - 1)') },

  { c: true },
  { h: 'Difference of two squares and grouping' },
  { p: 'If you see **one square minus another square**, use `a² - b² = (a - b)(a + b)`. Always take out a **common factor** first.' },
  { solver: S(`${N22}, Question 14(a)`, 'Factorise completely 36p⁴ - 4q².', [
    ['36p⁴ - 4q²', ''],
    ['4(9p⁴ - q²)', 'Take out the common factor 4.'],
    ['9p⁴ = (3p²)² and q² = (q)²', 'Both are squares.'],
    ['4(3p² - q)(3p² + q)', 'Difference of two squares.'],
  ], '4(3p² - q)(3p² + q)') },
  { solver: S(`${N22}, Question 14(b)`, 'Factorise completely 10my + 15ny + 6m + 9n.', [
    ['(10my + 15ny) + (6m + 9n)', 'Group in pairs.'],
    ['5y(2m + 3n) + 3(2m + 3n)', 'Take a common factor from each pair. Both give (2m + 3n).'],
    ['(5y + 3)(2m + 3n)', ''],
  ], '(5y + 3)(2m + 3n)') },

  { c: true },
  { exam: [
    P('Easy', 'x² + bx + c', ['Factorise `x² + 7x + 12`.'], 'multiply to 12, add to 7', ['3 and 4', '**(x + 3)(x + 4)**']),
    P('Easy', 'Difference of squares', ['Factorise `x² - 9`.'], 'two squares', ['**(x - 3)(x + 3)**']),
    P('Easy / Medium', 'Both numbers negative', ['Factorise `x² - 5x + 6`.'], 'multiply to 6, add to -5', ['-2 and -3', '**(x - 2)(x - 3)**']),
    P('Medium', 'A negative c', ['Factorise `x² + 2x - 15`.'], 'multiply to -15, add to 2', ['5 and -3', '**(x + 5)(x - 3)**']),
    REAL.n25q2b,
    REAL.n22q14a,
    REAL.n22q14b,
    REAL.n21q9,
  ] },
  { p: '**The one thing to remember:** find two numbers that **multiply to c** and **add to b**. Always check by **expanding** your answer.' },
];

/* ================================================================ 8. solving by factorisation */

export const SOLVE_FACTOR_LESSON = [
  { h: 'The zero rule' },
  { p: 'If two numbers multiply to give **0**, then at least one of them **is 0**. So if `(x - 3)(2x + 1) = 0`, then `x - 3 = 0` **or** `2x + 1 = 0`.' },
  { diagram: 'zeroProduct' },

  { c: true },
  { h: 'Three steps' },
  { p: '(1) Make one side **0**. (2) **Factorise**. (3) Put each bracket equal to 0 and solve.' },
  { solver: SOLVE_N2022_Q6 },
  { solver: SOLVE_N2023_Q15A },
  { solver: S('A common factor', 'Solve x² = 3x.', [
    ['x² = 3x', 'Do NOT divide by x. You would lose one answer.'],
    ['x² - 3x = 0', 'Make one side 0.'],
    ['x(x - 3) = 0', 'Take out the common factor x.'],
    ['x = 0 or x = 3', 'Both are answers.'],
  ], 'x = 0 or x = 3') },

  { c: true },
  { h: 'When there is only x² (use a square root)' },
  { p: 'If the equation is `x² = 16`, then `x = 4` **or** `x = -4`. Always give **both**. This was used in several ZIMSEC questions where a matrix or a vector led to a quadratic.' },
  { solver: SOLVE_N2022_Q18A },

  { c: true },
  { exam: [
    P('Easy', 'Square root', ['Solve `x² = 49`.'], 'give both answers', ['**x = 7 or x = -7**']),
    P('Easy', 'Zero rule', ['Solve `(x - 2)(x + 5) = 0`.'], 'each bracket can be 0', ['**x = 2 or x = -5**']),
    P('Easy / Medium', 'Factorise', ['Solve `x² - 5x + 6 = 0`.'], 'factorise, then zero rule', ['`(x - 2)(x - 3) = 0`', '**x = 2 or x = 3**']),
    P('Medium', 'A negative c', ['Solve `x² + x - 12 = 0`.'], 'factorise, then zero rule', ['`(x + 4)(x - 3) = 0`', '**x = -4 or x = 3**']),
    REAL.n22q6,
    REAL.n23q15a,
    REAL.n22q15b,
    REAL.n22q18a,
    REAL.j23q22b,
    P('Medium / Hard', 'A number in front', ['Solve `3x² - 7x + 2 = 0`.'], 'split the middle term', ['`3x² - 6x - x + 2 = 0`', '`(x - 2)(3x - 1) = 0`', '**x = 2 or x = 1/3**']),
  ] },
  { p: '**The one thing to remember:** make one side **0**, **factorise**, then set **each bracket to 0**. Give **both** answers.' },
];

/* ================================================================ 9. completing the square */

export const COMPLETE_SQUARE_LESSON = [
  { h: 'Why complete the square?' },
  { p: 'Some quadratics do not factorise. **Completing the square** is another way to solve them. It also shows the lowest or highest point of a curve.' },
  { diagram: 'completeSquare', caption: 'x² + 6x is a square with a corner missing. The missing corner is 3 × 3 = 9.' },

  { c: true },
  { h: 'The method' },
  { p: 'For `x² + bx + c`: (1) Take **half of b**. (2) Write `(x + half)²`. (3) **Take away half squared** to balance. (4) Add `c`.' },
  { f: 'x² + bx = (x + b/2)² - (b/2)²' },
  { solver: S('Complete the square', 'Write x² + 6x + 4 in the form (x + p)² + q.', [
    ['Half of 6 is 3', 'The p in the bracket is half of b.'],
    ['(x + 3)² = x² + 6x + 9', 'Expanding shows an extra 9.'],
    ['x² + 6x = (x + 3)² - 9', 'So take 9 away.'],
    ['x² + 6x + 4 = (x + 3)² - 9 + 4', 'Now add the original 4.'],
    ['x² + 6x + 4 = (x + 3)² - 5', ''],
  ], '(x + 3)² - 5') },
  { p: 'This also tells you the **lowest point** of the curve `y = x² + 6x + 4`: it is at `(-3, -5)`.' },

  { c: true },
  { h: 'Solving an equation' },
  { p: 'Once it is in the form `(x + p)² = number`, take the **square root of both sides**. Remember `±`.' },
  { solver: S('Solve by completing the square', 'Solve x² + 6x + 4 = 0, giving answers to 2 decimal places.', [
    ['(x + 3)² - 5 = 0', 'We just completed the square above.'],
    ['(x + 3)² = 5', 'Add 5 to both sides.'],
    ['x + 3 = ±√5', 'Take the square root. Remember + and -.'],
    ['x = -3 ± 2.236', '√5 = 2.236.'],
    ['x = -0.76 or x = -5.24', '-3 + 2.236 = -0.764 and -3 - 2.236 = -5.236.'],
  ], 'x = -0.76 or x = -5.24') },
  { solver: SOLVE_J2023_Q15B },
  { p: 'If there is a number in front of `x²`, **divide the whole equation by it first**.' },
  { solver: S('A number in front of x²', 'Solve 2x² + 8x - 3 = 0, giving answers to 2 decimal places.', [
    ['2x² + 8x - 3 = 0', ''],
    ['x² + 4x - 1.5 = 0', 'Divide every term by 2.'],
    ['(x + 2)² - 4 - 1.5 = 0', 'Half of 4 is 2. Take 4 away to balance.'],
    ['(x + 2)² = 5.5', 'Add 5.5 to both sides.'],
    ['x + 2 = ±2.345', '√5.5 = 2.345.'],
    ['x = 0.35 or x = -4.35', '-2 + 2.345 = 0.345 and -2 - 2.345 = -4.345.'],
  ], 'x = 0.35 or x = -4.35') },

  { c: true },
  { exam: [
    P('Easy', 'Complete the square', ['Complete the square: `x² + 4x = (x + ?)² - ?`'], 'half of 4', ['**(x + 2)² - 4**']),
    P('Easy / Medium', 'Complete the square', ['Write `x² - 10x + 3` in the form `(x - p)² + q`.'], 'half of -10 is -5', ['`(x - 5)² - 25 + 3`', '**(x - 5)² - 22**']),
    P('Medium', 'Square root', ['Solve `(x - 1)² = 9`.'], 'take the square root, give both', ['`x - 1 = ±3`', '**x = 4 or x = -2**']),
    REAL.j23q15b,
    P('Medium', 'Solve', ['Solve `x² + 4x - 3 = 0` by completing the square. Give answers to 2 decimal places.'], 'complete the square, then root', ['`(x + 2)² = 7`', '`x = -2 ± 2.646`', '**x = 0.65 or x = -4.65**']),
    P('Medium / Hard', 'Lowest point', ['Write `x² - 6x + 11` in the form `(x - p)² + q` and state its minimum value.'], 'the square is never negative', ['`(x - 3)² - 9 + 11 = (x - 3)² + 2`', '**Minimum value 2**, when `x = 3`']),
  ] },
  { p: '**The one thing to remember:** take **half of b**, write `(x + half)²`, and **take away half squared**.' },
];

/* ================================================================ 10. quadratic formula */

export const FORMULA_LESSON = [
  { h: 'When to use the formula' },
  { p: 'The formula **always works**. Use it when the quadratic does not factorise easily, or when the question says "correct to 3 significant figures" or "to 2 decimal places".' },
  { diagram: 'formulaBox' },

  { c: true },
  { h: 'The method' },
  { p: '(1) Write the equation in standard form `ax² + bx + c = 0`. (2) Write down `a`, `b` and `c` **with their signs**. (3) Put them into the formula, **in brackets**. (4) Work out the part under the root first.' },
  { f: 'x = (-b ± √(b² - 4ac)) ÷ 2a' },
  { solver: SOLVE_N2020_Q7C },
  { solver: S('Another example', 'Solve x² - 4x - 3 = 0, giving answers to 2 decimal places.', [
    ['a = 1, b = -4, c = -3', ''],
    ['x = (-(-4) ± √((-4)² - 4(1)(-3))) ÷ (2 × 1)', 'Put in brackets, especially for negative numbers.'],
    ['b² - 4ac = 16 + 12 = 28', '(-4)² = 16 and -4 × 1 × (-3) = +12.'],
    ['x = (4 ± √28) ÷ 2', '-(-4) = +4.'],
    ['x = (4 + 5.292) ÷ 2 = 4.65', 'Use the + first.'],
    ['x = (4 - 5.292) ÷ 2 = -0.65', 'Now use the -.'],
  ], 'x = 4.65 or x = -0.65') },

  { c: true },
  { h: 'Common mistakes' },
  { p: '**Forgetting the ±.** There are two answers. **Forgetting brackets** around a negative `b` or `c`. **Dividing only part of the top:** the `÷ 2a` covers the whole top line. **Signs under the root:** `-4ac` is positive when `c` is negative.' },

  { c: true },
  { exam: [
    P('Easy', 'Find a, b and c', ['Write down `a`, `b` and `c` for `2x² - 3x + 5 = 0`.'], 'keep the signs', ['**a = 2, b = -3, c = 5**']),
    P('Easy / Medium', 'The part under the root', ['Find `b² - 4ac` for `x² + 3x - 4 = 0`.'], 'brackets for negatives', ['`9 - 4(1)(-4) = 9 + 16 =` **25**']),
    P('Medium', 'Solve', ['Solve `x² + 3x - 1 = 0`. Give answers to 2 decimal places.'], 'quadratic formula', ['`b² - 4ac = 9 + 4 = 13`', '`x = (-3 ± 3.606) ÷ 2`', '**x = 0.30 or x = -3.30**']),
    REAL.n20q7c,
    P('Medium / Hard', 'Solve', ['Solve `2x² - 7x + 1 = 0`. Give answers to 2 decimal places.'], 'quadratic formula', ['`b² - 4ac = 49 - 8 = 41`', '`x = (7 ± 6.403) ÷ 4`', '**x = 3.35 or x = 0.15**']),
  ] },
  { p: '**The one thing to remember:** write **a, b, c with signs**, put them into the formula **in brackets**, and give **two answers**.' },
];

/* ================================================================ 11. discriminant */

export const DISCRIMINANT_LESSON = [
  { h: 'What is the discriminant?' },
  { p: 'The part under the square root in the quadratic formula, `b² - 4ac`, is called the **discriminant**. It tells you **how many answers** there are **without solving** the equation.' },
  { diagram: 'discriminantGraphs' },
  { p: '**Positive** (`b² - 4ac > 0`): **two** different answers. **Zero** (`b² - 4ac = 0`): **one** answer (the curve just touches the x-axis). **Negative** (`b² - 4ac < 0`): **no real answers** (the curve never reaches the x-axis).' },
  { p: 'We did not find a discriminant question in the six ZIMSEC papers we read, so the cards below are practice questions. The discriminant is the quick way to check an equation before you use the formula.' },

  { c: true },
  { h: 'Using it' },
  { solver: S('How many roots?', 'Use the discriminant to say how many roots 3x² + 5x - 18 = 0 has.', [
    ['a = 3, b = 5, c = -18', ''],
    ['b² - 4ac = 25 - 4(3)(-18)', ''],
    ['b² - 4ac = 25 + 216 = 241', ''],
    ['241 is positive', ''],
    ['Two different roots', 'This matches the two answers 1.75 and -3.42 we found.'],
  ], 'two different roots') },
  { solver: S('Equal roots', 'How many roots does x² + 4x + 4 = 0 have?', [
    ['a = 1, b = 4, c = 4', ''],
    ['b² - 4ac = 16 - 16 = 0', ''],
    ['The discriminant is 0', ''],
    ['One root only', 'It factorises as (x + 2)² = 0, so x = -2.'],
  ], 'one root, x = -2') },
  { solver: S('No real roots', 'Show that x² + 2x + 5 = 0 has no real roots.', [
    ['a = 1, b = 2, c = 5', ''],
    ['b² - 4ac = 4 - 20', ''],
    ['b² - 4ac = -16', ''],
    ['-16 is negative', 'You cannot take the square root of a negative number.'],
    ['No real roots', 'So the curve never touches the x-axis.'],
  ], 'no real roots') },
  { solver: S('Finding k', 'Find k so that x² + kx + 9 = 0 has equal roots.', [
    ['Equal roots: b² - 4ac = 0', ''],
    ['a = 1, b = k, c = 9', ''],
    ['k² - 4(1)(9) = 0', ''],
    ['k² = 36', ''],
    ['k = 6 or k = -6', 'Two values of k both work.'],
  ], 'k = 6 or k = -6') },

  { c: true },
  { exam: [
    P('Easy', 'Work out b² - 4ac', ['Find the discriminant of `x² + 2x + 1 = 0`.'], 'b² - 4ac', ['`4 - 4 =` **0**']),
    P('Easy', 'Read the sign', ['The discriminant of a quadratic equation is -5.', 'How many real roots does it have?'], 'negative means none', ['**None.** You cannot take the square root of -5.']),
    P('Easy / Medium', 'Two roots', ['How many roots does `2x² + 3x - 5 = 0` have?'], 'b² - 4ac', ['`9 - 4(2)(-5) = 9 + 40 = 49`', '49 is positive, so **two roots**.']),
    P('Medium', 'One root', ['Show that `x² + 6x + 9 = 0` has only one root, and find it.'], 'b² - 4ac = 0', ['`36 - 36 = 0`, so one root', '`(x + 3)² = 0`, so **x = -3**']),
    P('Medium', 'No roots', ['Show that `x² + x + 3 = 0` has no real roots.'], 'b² - 4ac is negative', ['`1 - 12 = -11`', '-11 is negative, so **no real roots**.']),
    P('Medium / Hard', 'Find k', ['Find the values of `k` for which `x² + kx + 16 = 0` has equal roots.'], 'b² - 4ac = 0', ['`k² - 64 = 0`', '**k = 8 or k = -8**']),
  ] },
  { p: '**The one thing to remember:** `b² - 4ac` **positive** = 2 roots, **zero** = 1 root, **negative** = no real roots.' },
];

/* ================================================================ 12. simultaneous linear and quadratic */

export const SIM_QUAD_LESSON = [
  { h: 'A line and a curve' },
  { p: 'Sometimes one equation is a **straight line** and the other is a **quadratic** (it has `x²` or `y²`). The solutions are the points where the line **meets** the curve.' },
  { diagram: 'lineParabolaCases', caption: 'A line can cut a curve twice, touch it once, or miss it completely.' },

  { c: true },
  { h: 'The method: substitution' },
  { p: '(1) Make `y` (or `x`) the subject of the **linear** equation. (2) Put it into the **quadratic**. (3) Solve the quadratic. (4) Put each answer back into the **linear** equation to find the other letter.' },
  { solver: S('A line and a parabola', 'Solve y = x + 2 and y = x².', [
    ['y = x + 2 and y = x²', 'Both equal y, so they equal each other.'],
    ['x² = x + 2', ''],
    ['x² - x - 2 = 0', 'Make one side 0.'],
    ['(x - 2)(x + 1) = 0', 'Factorise.'],
    ['x = 2 or x = -1', ''],
    ['x = 2: y = 2 + 2 = 4', 'Put each x into the linear equation.'],
    ['x = -1: y = -1 + 2 = 1', ''],
  ], '(2, 4) and (-1, 1)') },
  { solver: S('A line and a circle', 'Solve x + y = 5 and x² + y² = 13.', [
    ['y = 5 - x', 'Make y the subject of the linear equation.'],
    ['x² + (5 - x)² = 13', 'Put it into the quadratic.'],
    ['x² + 25 - 10x + x² = 13', 'Expand (5 - x)².'],
    ['2x² - 10x + 12 = 0', 'Collect and make one side 0.'],
    ['x² - 5x + 6 = 0', 'Divide by 2.'],
    ['(x - 2)(x - 3) = 0', ''],
    ['x = 2: y = 3, and x = 3: y = 2', 'Put each x into y = 5 - x.'],
  ], '(2, 3) and (3, 2)') },

  { c: true },
  { h: 'A shortcut: the difference of two squares' },
  { p: 'Sometimes you can spot `m² - 9n²` and use `(m - 3n)(m + 3n)`. This saves a lot of work. ZIMSEC set exactly this in June 2023.' },
  { solver: SOLVE_J2023_Q8 },

  { c: true },
  { exam: [
    P('Easy', 'Line and curve', ['Solve `y = 2x` and `y = x²`.'], 'x² = 2x', ['`x² - 2x = 0`, so `x(x - 2) = 0`', '**(0, 0) and (2, 4)**']),
    P('Easy / Medium', 'Line and curve', ['Solve `y = x + 6` and `y = x²`.'], 'put one into the other', ['`x² - x - 6 = 0`', '`(x - 3)(x + 2) = 0`', '**(3, 9) and (-2, 4)**']),
    P('Medium', 'Sum and product', ['Solve `x + y = 7` and `xy = 12`.'], 'substitute y = 7 - x', ['`x(7 - x) = 12`', '`x² - 7x + 12 = 0`', '**(3, 4) and (4, 3)**']),
    REAL.j23q8,
    P('Medium / Hard', 'Line and circle', ['Solve `y = x - 1` and `x² + y² = 25`.'], 'substitute, then solve the quadratic', ['`x² + (x - 1)² = 25`, so `x² - x - 12 = 0`', '`(x - 4)(x + 3) = 0`', '**(4, 3) and (-3, -4)**']),
  ] },
  { p: '**The one thing to remember:** put the **linear** equation into the **quadratic**, solve, then **put each answer back** to find the other letter.' },
];

/* ================================================================ 13. word problems */

export const WORD_LESSON = [
  { h: 'Turn the words into an equation' },
  { p: 'Four steps. (1) Let a letter stand for the **unknown**. (2) Write what the words say as an **equation**. (3) **Solve** it. (4) **Answer in words**, with units, and check that it makes sense.' },
  { diagram: 'quadAngles', caption: 'From ZIMSEC June 2023: the angles of a four-sided shape add up to 360°.' },
  { solver: SOLVE_J2023_Q6B },
  { solver: SOLVE_N2023_Q9A },
  { solver: SOLVE_N2022_Q21A },

  { c: true },
  { h: 'Geometry word problems' },
  { p: 'A diagram helps. Write the lengths on it, then use the **perimeter** or **angles** to make an equation.' },
  { diagram: 'trapeziumWord' },
  { solver: SOLVE_N2022_Q23A },

  { c: true },
  { h: 'A word problem that makes a quadratic' },
  { p: 'When the area is given, you multiply two brackets and get an `x²`. That makes a **quadratic equation**. Solve it, then **reject** any answer that makes no sense (a negative length).' },
  { diagram: 'rectangleWord', caption: 'This is ZIMSEC November 2020, Question 7.' },
  { solver: SOLVE_N2020_Q7 },

  { c: true },
  { exam: [
    P('Easy', 'Think of a number', ['I think of a number, double it and add 5. The answer is 21.', 'What is my number?'], 'let the number be n', ['`2n + 5 = 21`', '`2n = 16`', '**n = 8**']),
    P('Easy', 'Consecutive numbers', ['The sum of three consecutive numbers is 63. Find the numbers.'], 'n, n + 1, n + 2', ['`n + (n + 1) + (n + 2) = 63`', '`3n + 3 = 63`, so `n = 20`', '**20, 21 and 22**']),
    REAL.n23q9a,
    REAL.j23q6b,
    REAL.n22q21a,
    REAL.n22q23a,
    P('Medium / Hard', 'Two consecutive numbers', ['The product of two consecutive positive whole numbers is 56. Find them.'], 'x and x + 1', ['`x(x + 1) = 56`', '`x² + x - 56 = 0`', '`(x + 8)(x - 7) = 0`, so `x = 7`', '**7 and 8**']),
    REAL.n20q7,
  ] },
  { p: '**The one thing to remember:** let a letter stand for the unknown, make an **equation** from the words, solve it, and **check** the answer fits the story.' },
];

/* ================================================================ 14. changing the subject */

export const SUBJECT_LESSON = [
  { h: 'What is the subject?' },
  { p: 'In `v = u + at`, the letter `v` is the **subject**: it is on its own on one side. To **change the subject** means to rearrange the formula so a **different** letter is on its own.' },
  { diagram: 'inverseMachine', caption: 'Undo the steps in the opposite order. Whatever you do to one side, do to the other side.' },

  { c: true },
  { h: 'Step by step' },
  { solver: SOLVE_N2021_Q17A },
  { solver: SOLVE_N2022_Q17B },

  { c: true },
  { h: 'When there is a root or a fraction' },
  { p: 'To remove a **square root**, **square both sides**. To remove a **fraction**, **multiply both sides** by the bottom.' },
  { solver: SOLVE_N2023_Q14B },
  { solver: SOLVE_J2023_Q9 },

  { c: true },
  { exam: [
    P('Easy', 'One step', ['Make `x` the subject of `y = x + 5`.'], 'undo + 5', ['**x = y - 5**']),
    P('Easy', 'One step', ['Make `x` the subject of `y = 3x`.'], 'undo × 3', ['**x = y ÷ 3**']),
    P('Easy / Medium', 'Two steps', ['Make `t` the subject of `v = u + at`.'], 'undo + u, then × a', ['`v - u = at`', '**t = (v - u) ÷ a**']),
    P('Medium', 'A square root', ['Make `u` the subject of `v² = u² + 2as`.'], 'then take the square root', ['`u² = v² - 2as`', '**u = √(v² - 2as)**']),
    REAL.n21q17a,
    REAL.n22q17b,
    REAL.n23q14b,
    REAL.j23q9,
  ] },
  { p: '**The one thing to remember:** do the **same thing to both sides**, and **undo the steps in reverse order**.' },
];

/* ================================================================ 15. substitution */

export const SUBSTITUTION_LESSON = [
  { h: 'What is substitution?' },
  { p: '**Substitute** means "put in a number in place of a letter". A formula tells you how to work something out. You put the numbers in, then calculate.' },
  { diagram: 'substituteBrackets' },
  { p: 'Tips: use **brackets**, especially for negative numbers. Follow **BODMAS**: brackets, powers, then multiply and divide, then add and subtract.' },

  { c: true },
  { h: 'Putting numbers in' },
  { solver: S('Substitute x = -2', 'Find y when x = -2 in y = x² - 3x.', [
    ['y = x² - 3x', ''],
    ['y = (-2)² - 3(-2)', 'Put -2 in brackets in place of each x.'],
    ['y = 4 + 6', '(-2)² = 4. And -3 × (-2) = +6.'],
    ['y = 10', ''],
  ], 'y = 10') },
  { solver: S(`${N23}, Question 4(a)`, 'Given f(x) = 3x - 1, find f(-2).', [
    ['f(x) = 3x - 1', ''],
    ['f(-2) = 3(-2) - 1', 'Put -2 in place of x.'],
    ['f(-2) = -6 - 1', ''],
    ['f(-2) = -7', ''],
  ], 'f(-2) = -7') },
  { solver: S(`${N22}, Question 17(a)(i)`, 'v = 5 + 4t - t². Find v when t = 3.', [
    ['v = 5 + 4t - t²', ''],
    ['v = 5 + 4(3) - 3²', 'Put 3 in place of each t.'],
    ['v = 5 + 12 - 9', '4(3) = 12 and 3² = 9.'],
    ['v = 8', ''],
  ], 'v = 8') },
  { solver: S(`${N23}, Question 14(a)`, '1/c = √(b - a). Find c when a = -4 and b = 21.', [
    ['1/c = √(b - a)', ''],
    ['1/c = √(21 - (-4))', 'Put in a = -4 and b = 21. Brackets around the -4.'],
    ['1/c = √25', '21 - (-4) = 21 + 4 = 25.'],
    ['1/c = 5', ''],
    ['c = 1/5', 'If 1 ÷ c = 5, then c = 1 ÷ 5.'],
  ], 'c = 1/5') },
  { solver: S(`${N21}, Question 17(b)`, 'a = (v² - u²) ÷ 2s. Find a when s = 5, u = 2 and v = 2.', [
    ['a = (v² - u²) ÷ 2s', ''],
    ['a = (2² - 2²) ÷ (2 × 5)', 'Put in the numbers.'],
    ['a = (4 - 4) ÷ 10', ''],
    ['a = 0 ÷ 10', ''],
    ['a = 0', 'Zero divided by anything is 0.'],
  ], 'a = 0') },

  { c: true },
  { h: 'Finding a letter that is not the subject' },
  { p: 'If the letter you want is **not** the subject, put the numbers in first. You then get a normal equation to solve.' },
  { solver: S('Find a', 'v = u + at. Find a when v = 20, u = 8 and t = 4.', [
    ['v = u + at', ''],
    ['20 = 8 + a(4)', 'Put in v = 20, u = 8 and t = 4.'],
    ['12 = 4a', 'Take 8 from both sides.'],
    ['a = 3', 'Divide both sides by 4.'],
  ], 'a = 3') },

  { c: true },
  { exam: [
    P('Easy', 'A simple formula', ['`V = IR`. Find `V` when `I = 3` and `R = 4`.'], 'put the numbers in', ['`V = 3 × 4 =` **12**']),
    P('Easy', 'A linear formula', ['`y = 2x - 1`. Find `y` when `x = 5`.'], 'put the numbers in', ['`y = 2(5) - 1 =` **9**']),
    P('Easy / Medium', 'Negative number', ['`y = x² + 2x`. Find `y` when `x = -3`.'], 'brackets for -3', ['`y = (-3)² + 2(-3)`', '`= 9 - 6 =` **3**']),
    REAL.n23q4a,
    REAL.n22q17a,
    REAL.n23q14a,
    REAL.n21q17b,
    P('Medium / Hard', 'Find a letter that is not the subject', ['`v = u + at`. Find `a` when `v = 20`, `u = 8` and `t = 4`.'], 'put in, then solve', ['`20 = 8 + 4a`', '`4a = 12`', '**a = 3**']),
    P('Medium / Hard', 'Find r', ['`A = πr²`. Find `r` when `A = 154` and `π = 22/7`.'], 'put in, then divide, then root', ['`154 = (22/7) r²`', '`r² = 154 × 7 ÷ 22 = 49`', '**r = 7**']),
  ] },
  { p: '**The one thing to remember:** put the numbers in **brackets**, then work out step by step, following **BODMAS**.' },
];

/* ================================================================ library */

export const EQUATIONS_LIBRARY = [
  { h: 'How to use this page' },
  { p: 'Every question here was set in a ZIMSEC paper (Nov 2020, Nov 2021, Nov 2022, Jun 2023, Nov 2023 and Nov 2025). The working is written out step by step. Watch the pen, then try the question yourself.' },

  { c: true },
  { h: 'Linear equations, brackets and fractions' },
  { solver: SOLVE_N2025_Q2C },
  { solver: SOLVE_J2023_Q15A },
  { solver: SOLVE_N2023_Q15B },
  { solver: SOLVE_N2021_Q22B },

  { c: true },
  { h: 'Simultaneous equations' },
  { solver: SOLVE_N2022_Q8 },
  { solver: SOLVE_N2025_Q3D },
  { solver: SOLVE_N2021_Q11 },
  { solver: SOLVE_N2023_Q6 },

  { c: true },
  { h: 'Quadratic equations' },
  { solver: SOLVE_N2022_Q6 },
  { solver: SOLVE_N2020_Q7C },
  { solver: SOLVE_J2023_Q15B },
  { solver: SOLVE_J2023_Q8 },

  { c: true },
  { h: 'Word problems' },
  { solver: SOLVE_N2020_Q7 },
  { solver: SOLVE_N2022_Q23A },

  { c: true },
  { h: 'Formulae' },
  { solver: SOLVE_N2021_Q17A },
  { solver: SOLVE_J2023_Q9 },

  { c: true },
  { exam: [
    REAL.n22q2a,
    REAL.n23q4b,
    REAL.n23q15b,
    REAL.n21q20b,
    REAL.n22q8,
    REAL.n25q3d,
    REAL.n21q11,
    REAL.n22q6,
    REAL.n23q15a,
    REAL.j23q15b,
    REAL.j23q8,
    REAL.n20q7c,
    REAL.n20q7,
  ], title: 'Equation questions found in the ZIMSEC papers' },
];
