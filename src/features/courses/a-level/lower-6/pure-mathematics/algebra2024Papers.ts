// Original scans inspected: June 2024 printed pp.2–3; November 2024 pp.2–4.
// Shortened questions, original mathematical data, independently worked solutions.
export const SOURCES_2024 = {
  j24: 'https://unopasa.com/zimbabwe/a-level/pure-mathematics/question-papers/zimsec-paper-1-june-2024-dowikru',
  n24: 'https://unopasa.com/zimbabwe/a-level/pure-mathematics/question-papers/zimsec-paper-1-november-2024-adwpdhh',
};
const R = (paper: keyof typeof SOURCES_2024, question: string, topic: string, lines: string[], solution: string[]) => ({
  level: 'Hard', stepGrid: true, manualStart: true, topic, lines, solution,
  sourceUrl: SOURCES_2024[paper],
  skill: `Verified ZIMSEC question: ${paper === 'j24' ? 'June' : 'November'} 2024, Pure Mathematics 6042/1, Q${question}. Mathematical data checked against the original scan; wording shortened.`,
});
export const PAPER_2024_QUESTIONS = {
  indices: R('n24', '1', 'Fractional and negative powers', ['Simplify `[(x²)^(1/3)(x^(−1/2))³]/[x^(−1/6)x^(−2/3)]`.'], [
    'Use x > 0 for these real fractional powers.', 'Power above the line: 2/3 − 3/2 = −5/6.', 'Power below the line: −1/6 − 2/3 = −5/6.', 'Divide: subtract the powers: −5/6 − (−5/6) = 0.', 'x⁰ = 1. Answer: 1.',
  ]),
  joint: R('n24', '3', 'Joint variation with roots', ['`Y = k√x/z³`. Y = 16 when x = 9, z = 1/2.', 'Find the formula and z when Y = 2.5, x = 900.'], [
    '16 = k × 3/(1/2)³ = 24k.', 'k = 2/3, so Y = 2√x/(3z³).', '2.5 = (2/3) × 30/z³ = 20/z³.', 'z³ = 8, so z = 2.',
  ]),
  partial: R('n24', '4', 'Three different factors', ['Split `(3 − x + 6x²)/[(1 − x)(x + 2)(1 + 2x)]` into partial fractions.'], [
    'Exclude x = 1, −2 and −1/2.', 'Use A/(1 − x) + B/(x + 2) + C/(1 + 2x).', '3 − x + 6x² = A(x + 2)(1 + 2x) + B(1 − x)(1 + 2x) + C(1 − x)(x + 2).', 'x = 1: 8 = 9A, so A = 8/9.', 'x = −2: 29 = −9B, so B = −29/9.', 'x = −1/2: 5 = (9/4)C, so C = 20/9.', 'Answer: 8/[9(1 − x)] − 29/[9(x + 2)] + 20/[9(1 + 2x)].',
  ]),
  quartic: R('n24', '5', 'Division, coefficients and factors', ['`h(x) = x⁴ + 3x³ + ax + 3` has factor `x² − x + 1`.', 'Find a and factorise h completely.'], [
    'Include the missing term 0x² when dividing.', 'Divide by x² − x + 1: quotient x² + 4x + 3; remainder (a − 1)x.', 'A factor leaves remainder zero, so a − 1 = 0.', 'a = 1.', 'x² + 4x + 3 = (x + 1)(x + 3).', 'Answer: h(x) = (x² − x + 1)(x + 1)(x + 3). The first factor has no real linear factors.',
  ]),
  modulus: R('n24', '6', 'Modulus inequality', ['Solve `3|x − 2| > |2x − 1|`.'], [
    'Both sides are zero or positive, so squaring keeps the same comparison.', '9(x − 2)² > (2x − 1)².', '5x² − 32x + 35 > 0.', '(5x − 7)(x − 5) > 0.', 'The product is positive outside its roots.', 'Answer: x < 7/5 or x > 5. Leave out both end values.',
  ]),
  inverse: R('n24', '11(a,b)', 'An inverse on a limited domain', ['`f(x) = x² − 6x + 8`, with `0 ≤ x ≤ 3`.', 'Find f⁻¹ and state its domain.'], [
    'y = (x − 3)² − 1.', 'On 0 ≤ x ≤ 3, x − 3 is zero or negative.', 'x − 3 = −√(y + 1), so x = 3 − √(y + 1).', 'Answer: f⁻¹(x) = 3 − √(x + 1).', 'f(0) = 8 and f(3) = −1. f is decreasing on the given domain.', 'Domain of f⁻¹: −1 ≤ x ≤ 8; its range is 0 ≤ y ≤ 3.',
  ]),
  dataLine: R('n24', '16', 'A straight line from exponential data', ['For `y = ab^(−x)`, the pairs (x,y) are (1,4), (1.5,5.7), (2,8), (2.5,11.3), (3,16).', 'Use a straight-line graph to estimate a and b.'], [
    'ln y = ln a − x ln b. Plot ln y vertically against x horizontally.', 'ln y values are about 1.3863, 1.7405, 2.0794, 2.4248, 2.7726.', 'Draw a straight line of best fit through the plotted points.', 'Using the end points, gradient ≈ (ln 16 − ln 4)/(3 − 1) = ln 2.', 'Intercept ≈ ln 4 − ln 2 = ln 2, so a ≈ 2.', '−ln b ≈ ln 2, so b ≈ 1/2.', 'Answer: a ≈ 2, b ≈ 0.5. Small differences from a drawn best-fit line are expected.',
  ]),
  line: R('j24', '2', 'Read constants from a log graph', ['`y = ae^(bx)`. The (x, ln y) line goes through (0, ln 2) and (3, ln 5).', 'Find a and b exactly.'], [
    'ln y = ln a + bx.', 'At x = 0, ln a = ln 2, so a = 2.', 'b = gradient = (ln 5 − ln 2)/3.', 'Answer: a = 2 and b = ln(5/2)/3.',
  ]),
  repeated: R('j24', '3', 'A repeated denominator factor', ['Split `(2x − 3)/[x²(x² − 4)]` into partial fractions.'], [
    'x² − 4 = (x − 2)(x + 2). Exclude x = 0, 2, −2.', 'Use A/x + B/x² + C/(x − 2) + D/(x + 2).', '2x − 3 = Ax(x² − 4) + B(x² − 4) + Cx²(x + 2) + Dx²(x − 2).', 'x = 0: −3 = −4B, so B = 3/4.', 'x = 2: 1 = 16C, so C = 1/16.', 'x = −2: −7 = −16D, so D = 7/16.', 'x coefficients: 2 = −4A, so A = −1/2.', 'Answer: −1/(2x) + 3/(4x²) + 1/[16(x − 2)] + 7/[16(x + 2)].',
  ]),
  exponential: R('j24', '4', 'An exponential and its inverse power', ['Solve exactly: `(e^(2x) + e^(−2x))/5 = 1`.'], [
    'Put u = e^(2x), so u > 0 and e^(−2x) = 1/u.', 'u + 1/u = 5. Multiply by u: u² − 5u + 1 = 0.', 'u = (5 ± √21)/2. Both values are positive.', 'Answer: x = (1/2)ln[(5 + √21)/2] or x = (1/2)ln[(5 − √21)/2].',
  ]),
  inequality: R('j24', '5', 'A square and a linear expression', ['Solve exactly: `(x − 3)² > 2x + 1`.'], [
    'Expand: x² − 6x + 9 > 2x + 1.', 'x² − 8x + 8 > 0.', '(x − 4)² − 8 > 0, so |x − 4| > 2√2.', 'Answer: x < 4 − 2√2 or x > 4 + 2√2.',
  ]),
  square: R('j24', '9(a,b)', 'Square form and the turning point', ['Complete the square in `x² + 6x + 5` and state the turning point.'], [
    'Half of 6 is 3; 3² = 9.', 'x² + 6x + 5 = (x + 3)² − 9 + 5.', 'Answer: (x + 3)² − 4.', 'The square is zero when x = −3. Turning point: (−3, −4).',
  ]),
  range: R('j24', '9(c)', 'Range using a square or the discriminant', ['Find the range of `y = 1/(x² + 6x + 5)` for real x where the fraction is defined.'], [
    'Exclude x = −5 and −1. Also y cannot be zero.', 'Rearrange: yx² + 6yx + 5y − 1 = 0.', 'For real x, the discriminant must be zero or positive.', 'D = (6y)² − 4y(5y − 1) = 4y(4y + 1).', '4y(4y + 1) ≥ 0 gives y ≤ −1/4 or y ≥ 0.', 'Remove y = 0: Answer: y ≤ −1/4 or y > 0.', 'The value −1/4 is reached at x = −3.',
  ]),
  function: R('j24', '11(a)(ii)', 'An inverse of a quadratic rule', ['Find the inverse of `f(x) = x² + 2x`, with x ≥ −1.'], [
    'y = (x + 1)² − 1.', 'x ≥ −1, so x + 1 ≥ 0. Use the positive square root.', 'x = −1 + √(y + 1).', 'Answer: f⁻¹(x) = −1 + √(x + 1), with domain x ≥ −1.',
  ]),
};
