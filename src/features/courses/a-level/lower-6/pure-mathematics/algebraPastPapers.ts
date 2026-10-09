// Equations and data visually checked against the original scanned question papers.
// Wording condensed. Solutions are our own, independently checked, not official mark schemes.
export const PAPER_SOURCES = {
  j20: 'https://sytbay.co.zw/downloads/zimsec-a-level-pure-mathematics-paper-1-6042-1-june-2020-pdf/',
  n21: 'https://sytbay.co.zw/downloads/zimsec-a-level-pure-mathematics-paper-1-6042-1-november-2021-pdf/',
};
const real = (paper: 'j20' | 'n21', question: string, marks: number, topic: string, lines: string[], solution: string[]) => ({
  level: marks <= 4 ? 'Easy / Medium' : 'Medium / Hard', topic, lines,
  skill: `Source: ZIMSEC ${paper === 'j20' ? 'June 2020' : 'November 2021'}, Pure Mathematics 6042/1, Q${question} [${marks} marks]. Question checked against the scan; wording condensed.`,
  solution,
});
export const PAST = {
  indices: real('j20', '1', 4, 'Fractional indices', ['Find x: `x^(1/3) − 3x^(−1/3) = 2`.'], [
    'x ≠ 0. Put y = ∛x, so y ≠ 0.', 'y − 3/y = 2', 'Multiply by y: y² − 2y − 3 = 0', '(y − 3)(y + 1) = 0', 'y = 3 or y = −1', 'x = y³: x = 27 or x = −1.', 'Both satisfy the original equation.',
  ]),
  variation: real('n21', '4', 5, 'Inverse variation with a cube root', ['`M ∝ 1/∛(n − 1)`; M = 5 when n = 9.', 'Find M in terms of n, then n when M = 25.'], [
    'M = k/∛(n − 1), n ≠ 1', '5 = k/∛8 = k/2, so k = 10', 'M = 10/∛(n − 1)', '25 = 10/∛(n − 1)', '∛(n − 1) = 2/5', 'n − 1 = 8/125', 'n = 133/125',
  ]),
  square: real('n21', '5', 6, 'Complete the square and solve', ['Write `2x² + 3x + 1` as `a(x + b)² + c`.', 'Then solve `2x² + 3x + 1 = 0`.'], [
    '2(x² + 3x/2) + 1', '2[(x + 3/4)² − 9/16] + 1', '2(x + 3/4)² − 1/8', 'a = 2, b = 3/4, c = −1/8', '2(x + 3/4)² = 1/8', 'x + 3/4 = ±1/4', 'x = −1/2 or x = −1',
  ]),
  quadraticInequality: real('j20', '3', 5, 'Square form and a quadratic inequality', ['Complete the square in `6x² − 24x − 25`.', 'Solve exactly: `6x² − 24x − 25 > 0`.'], [
    '6(x² − 4x) − 25 = 6(x − 2)² − 49', 'A = 6, B = −2, C = −49', '6(x − 2)² > 49', '|x − 2| > 7/√6', 'x < 2 − 7√6/6 or x > 2 + 7√6/6', 'Strict inequality: exclude both boundary values.',
  ]),
  factor: real('j20', '11', 9, 'Factor and remainder theorems', ['`P(x) = 2x³ − 11x² + ax + b`.', '`x − 2` is a factor; division by `x + 1` leaves −36.', 'Find a and b; factorise P completely.'], [
    'P(2) = 0: 16 − 44 + 2a + b = 0', '2a + b = 28', 'P(−1) = −36: −2 − 11 − a + b = −36', '−a + b = −23', 'Subtract: 3a = 51, so a = 17', 'b = −6', 'P(x) = (x − 2)(2x² − 7x + 3)', 'P(x) = (x − 2)(2x − 1)(x − 3)',
  ]),
  partial: real('n21', '11(a)', 4, 'Three linear factors', ['Decompose `2x/[(x + 2)(x − 2)(x − 1)]`.'], [
    'x ≠ −2, 1, 2', 'Use A/(x + 2) + B/(x − 2) + C/(x − 1)', '2x = A(x − 2)(x − 1)', '       + B(x + 2)(x − 1) + C(x + 2)(x − 2)', 'x = −2: −4 = 12A, so A = −1/3', 'x = 2: 4 = 4B, so B = 1', 'x = 1: 2 = −3C, so C = −2/3', '−1/[3(x + 2)] + 1/(x − 2) − 2/[3(x − 1)]',
  ]),
  improper: real('j20', '12(a)', 5, 'Improper partial fractions', ['Write `x³/(x² − 5x + 6)` as', '`Ax + B + C/(x − 2) + D/(x − 3)`.'], [
    'Exclude x = 2 and x = 3.', 'Divide first: x³/(x² − 5x + 6)', '= x + 5 + (19x − 30)/(x² − 5x + 6)', '19x − 30 = C(x − 3) + D(x − 2)', 'x = 2: 8 = −C, so C = −8', 'x = 3: 27 = D', 'A = 1, B = 5, C = −8, D = 27', 'x + 5 − 8/(x − 2) + 27/(x − 3)',
  ]),
  rationalInequality: real('n21', '11(b)', 4, 'A rational inequality', ['Solve `2x/[(x + 2)(x − 2)(x − 1)] < 0`.'], [
    'Critical values: −2, 0, 1, 2.', 'Exclude denominator zeros: −2, 1, 2.', 'Signs on the five intervals: +, −, +, −, +.', 'The fraction is negative on (−2, 0) and (1, 2).', '−2 < x < 0 or 1 < x < 2.', 'Exclude 0 too, since the inequality is strict.',
  ]),
  exponential: real('n21', '1', 3, 'Quadratic in an exponential', ['Solve exactly: `2e^(2x) − 7e^x + 6 = 0`.'], [
    'Put u = e^x, so u > 0.', '2u² − 7u + 6 = 0', '(2u − 3)(u − 2) = 0', 'u = 3/2 or u = 2', 'x = ln(3/2) or x = ln 2',
  ]),
  log: real('n21', '8(a)', 3, 'Logs after rearranging', ['Solve `(2^x + 1)/(2^x − 1) = 5` (3 s.f.).'], [
    '2^x ≠ 1, so x ≠ 0.', '2^x + 1 = 5(2^x − 1)', '6 = 4 × 2^x', '2^x = 3/2', 'x = ln(3/2)/ln 2', 'x = 0.585 (3 s.f.)',
  ]),
  growth: real('j20', '7', 7, 'Population growth', ['A population of 500 000 grows by 5% each year.', 'Find P(n), P(10) to the nearest thousand, and the first year above 1 000 000.'], [
    'Annual multiplier = 1.05', 'P(n) = 500000(1.05)^n', 'P(10) = 814447.313… ≈ 814000', '500000(1.05)^n > 1000000', 'n > ln 2/ln 1.05 = 14.206…', 'First whole year: n = 15.',
  ]),
  modulus: real('n21', '8(b)', 5, 'Modulus inequality', ['Solve `|x − 3| > 2|3x + 1|`.'], [
    'Both sides are non-negative; squaring is safe.', '(x − 3)² > 4(3x + 1)²', '−35x² − 30x + 5 > 0', '7x² + 6x − 1 < 0', '(7x − 1)(x + 1) < 0', '−1 < x < 1/7',
  ]),
  inverse: real('j20', '8', 8, 'Rational function and inverse', ['`f(x) = 2 − 1/x`, x > 0.', 'Sketch f, state its range, find its inverse and solve `f(x) = f⁻¹(x)`.'], [
    'For x > 0: f(x) < 2.', 'Asymptotes: x = 0 and y = 2; intercept (1/2, 0).', 'y = 2 − 1/x gives x = 1/(2 − y).', 'f⁻¹(x) = 1/(2 − x), domain x < 2.', 'Both expressions exist for 0 < x < 2.', '2 − 1/x = 1/(2 − x)', '(2x − 1)(2 − x) = x', '−2x² + 4x − 2 = 0', '(x − 1)² = 0, so x = 1.',
  ]),
  intersections: real('n21', '10', 8, 'Modulus graphs and intersections', ['Sketch `y = 2 − |x|` and `y = x/3 + 1`.', 'Find their intersections.'], [
    '2 − |x| is an upside-down V with vertex (0, 2).', 'The line passes through (0, 1) and (−3, 0).', 'For x ≥ 0: 2 − x = x/3 + 1.', 'x = 3/4, y = 5/4.', 'For x < 0: 2 + x = x/3 + 1.', 'x = −3/2, y = 1/2.', 'Intersections: (3/4, 5/4) and (−3/2, 1/2).',
  ]),
};
