import type { LessonSection } from '../../../o-level/form-4/mathematics/LessonPage';
import { PAST } from './algebraPastPapers';

// Form 5 competency matrix: printed pages 10–11 of the user's 2015–2022 syllabus.
// Original explanations and worked examples; past-paper questions are kept separately.
const worked = (title: string, problem: string, answer: string, steps: [string, string][]) => ({
  solver: { title, problem, answer, steps: steps.map(([text, why]) => ({ text, why })) },
});
const practice = (questions: string[], answers: string[]) => ({ practice: questions, answers });
const exam = (...items: (typeof PAST)[keyof typeof PAST][]) => ({ exam: items, title: 'What ZIMSEC has asked' });
const section = (id: string, title: string, intro: string, lesson: any[]): LessonSection => ({ id, title, heading: title, intro, lesson: lesson.flatMap(block => block.exam ? [{ c: true }, block] : [block]) });

export const ALGEBRA_SECTIONS: LessonSection[] = [
  section('indices', 'Laws of Indices', 'Moving from O Level Mathematics to A Level Pure Mathematics starts with ideas you may already know: squares, cubes and powers. We will build from simple numbers to expressions with letters, one step at a time.', [
    { h: 'Start with repeated multiplication' },
    { p: 'You may have seen a number squared, such as `3²`, or a number cubed, such as `2³`. These are short ways of writing repeated multiplication: `3² = 3 × 3 = 9` and `2³ = 2 × 2 × 2 = 8`.' },
    { p: 'In `2³`, the **base** is 2: this is the number being multiplied. The small raised 3 is the **index**, also called the power or exponent. It tells us to use three factors of 2. One index, several indices.' },
    { p: '**Be careful:** `2³` is not `2 × 3`. It means `2 × 2 × 2`. The same idea works with letters: `x³ = x × x × x`, even when we do not yet know the value of x.' },
    { h: 'Why do we need rules?' },
    { p: 'Writing out every factor is useful at first, but it takes time when the powers are large. The laws of indices give us a shorter way to work. Let us see where the first rule comes from.' },
    worked('Why we add the powers', 'Simplify 2² × 2³.', '2⁵ = 32', [
      ['2² × 2³ = (2 × 2)(2 × 2 × 2)', 'Write each power as repeated multiplication.'],
      ['= 2 × 2 × 2 × 2 × 2', 'There are two factors of 2 in the first group and three in the second.'],
      ['= 2⁵ = 2^(2+3)', 'Five factors of the same base give a power of 5.'],
      ['= 32', 'Multiply the five factors, or evaluate 2⁵.'],
    ]),
    { p: 'So, when we **multiply powers with the same base**, we add their indices. For example, `x² × x³ = x⁵`. The base stays the same. Powers with different bases, such as `2² × 3³`, do not use this rule.' },
    { h: 'From O Level to A Level' },
    { p: 'At A Level, we also work with zero, negative and fractional indices, and use these ideas to solve equations. We will explain those meanings as we reach them. First, use the table below to learn the basic rules. In the table, a and b stand for bases; m and n stand for powers.' },
    { tableSize: 'large', table: [['Rule', 'Meaning'], ['a^m × a^n = a^(m+n)', 'Same base: add powers'], ['a^m ÷ a^n = a^(m−n)', 'Same non-zero base: subtract powers'], ['(a^m)^n = a^(mn)', 'A power of a power: multiply powers'], ['(ab)^n = a^n b^n', 'Apply the power to each factor'], ['(a/b)^n = a^n/b^n', 'b must not be zero'], ['a⁰ = 1', 'a must not be zero'], ['a^(−n) = 1/a^n', 'A negative power means a reciprocal']] },
    worked('Combine the powers', 'Simplify (3x²y³)(2x⁴y)/(6xy²), x,y ≠ 0.', 'x⁵y²', [
      ['(3 × 2)/6 = 1', 'Simplify the numbers first.'], ['x^(2+4−1) = x⁵', 'Multiply: add powers. Divide: subtract powers.'], ['y^(3+1−2) = y²', 'Use the same rule for y.'], ['Answer = x⁵y²', 'Write the remaining factors together.'],
    ]),
    { p: '**Common mistake:** `a² + a³` cannot become `a⁵`. The add-powers rule is for multiplication, not addition. Also, `(a + b)²` is not `a² + b²`.' },
    practice(['Simplify `x⁴ × x³ ÷ x²`, x ≠ 0.', 'Evaluate `5⁰ + 2^(−3)`.', 'Simplify `(2a³)²`.'], ['x⁵', '9/8', '4a⁶']),
  ]),
  section('rational-indices', 'Rational Indices', 'A fractional power tells you to take a root.', [
    { f: 'a^(m/n) = (ⁿ√a)^m' },
    { p: 'The denominator n tells you the root. The numerator m tells you the power. For a positive base, either order gives the same result. An even root needs a non-negative number when working with real numbers.' },
    worked('Root first, then power', 'Evaluate 27^(2/3) and 16^(−3/4).', '9 and 1/8', [
      ['27^(2/3) = (∛27)² = 3² = 9', 'Take the cube root, then square.'], ['16^(−3/4) = 1/(⁴√16)³', 'The negative sign means take a reciprocal.'], ['= 1/2³ = 1/8', 'The fourth root of 16 is 2.'],
    ]),
    { p: 'If an equation contains `x^(1/3)` and `x^(−1/3)`, put `u = ∛x`. The second term becomes `1/u`. Remember `x ≠ 0` and convert u back to x at the end.' },
    worked('An index equation', 'Solve 4^(x+1) = 8^x.', 'x = 2', [
      ['2^(2x+2) = 2^(3x)', 'Write 4 and 8 using base 2.'], ['2x + 2 = 3x', 'Equal powers of the same positive base, other than 1, have equal indices.'], ['x = 2', 'Subtract 2x from both sides.'],
    ]),
    practice(['Evaluate `32^(2/5)`.', 'Evaluate `81^(−1/2)`.', 'Solve `9^x = 27`.'], ['4', '1/9', 'x = 3/2']),
    exam(PAST.indices),
  ]),
  section('direct-inverse', 'Direct & Inverse Variation', 'Turn the relationship into a formula before putting in numbers.', [
    { p: '**Direct variation:** `y ∝ x` means `y = kx`. The ratio y/x stays fixed. **Inverse variation:** `y ∝ 1/x` means `y = k/x`. The product xy stays fixed. The constant k must be found from the given values.' },
    { diagram: 'variation', caption: 'Direct variation doubles y when x doubles. Inverse variation halves y when x doubles.' },
    worked('Direct variation with a power', 'y varies directly as x². y = 12 when x = 2. Find y when x = 5.', 'y = 75', [
      ['y = kx²', 'Translate the words: directly as the square of x.'], ['12 = k × 4, so k = 3', 'Use the pair of given values.'], ['y = 3x²', 'Write the complete model.'], ['y = 3 × 25 = 75', 'Now use x = 5.'],
    ]),
    worked('Inverse variation', 'y varies inversely as x. y = 6 when x = 4. Find x when y = 3.', 'x = 8', [
      ['y = k/x', 'Inverse means x goes in the denominator.'], ['6 = k/4, so k = 24', 'Multiply by 4 to find k.'], ['3 = 24/x', 'Use the new value of y.'], ['3x = 24, so x = 8', 'Solve the equation.'],
    ]),
    { p: '**Check:** if x increases, an inverse relationship with positive k and positive x makes y decrease. Do not write `y = kx` for an inverse question.' },
    practice(['y ∝ x³. y = 16 when x = 2. Find y when x = 3.', 'y ∝ 1/x². y = 8 when x = 3. Find y when x = 6.'], ['54', '2']),
    exam(PAST.variation),
  ]),
  section('joint-partial', 'Joint & Partial Variation', 'Joint variation combines quantities. Partial variation adds separate parts.', [
    { p: '**Joint:** if y varies directly as x and inversely as z², write `y = kx/z²`. **Partial:** if y is partly constant and partly varies as x, write `y = a + bx`. Partial variation usually needs two sets of values to find two constants.' },
    worked('Joint variation', 'y ∝ x/z². y = 6 when x = 3, z = 2. Find y when x = 5, z = 4.', 'y = 5/2', [
      ['6 = k × 3/4', 'Use both given quantities.'], ['k = 8, so y = 8x/z²', 'Find the constant before using the new values.'], ['y = 8 × 5/16 = 5/2', 'Square z in the denominator.'],
    ]),
    worked('A fixed charge and a variable charge', 'C = a + bd. C = 14 when d = 2; C = 26 when d = 5. Find C when d = 8.', 'C = 38', [
      ['a + 2b = 14; a + 5b = 26', 'Each pair gives an equation.'], ['3b = 12, so b = 4', 'Subtract the first equation from the second.'], ['a + 8 = 14, so a = 6', 'Substitute b = 4.'], ['C = 6 + 4d', '6 is the fixed charge; 4 is the charge per unit.'], ['C = 6 + 32 = 38', 'Use d = 8.'],
    ]),
    { p: 'A quantity can also be partly proportional to x and partly proportional to x²: `y = ax + bx²`. Build one equation from each given pair and solve for a and b.' },
    practice(['y = kxz. y = 24 when x = 2, z = 3. Find y when x = 5, z = 2.', 'y = a + bx. y = 7 when x = 1 and y = 13 when x = 3. Find a and b.'], ['40', 'a = 4, b = 3']),
  ]),
  section('polynomials', 'Polynomial Operations', 'A polynomial has whole-number powers of x that are zero or positive.', [
    { p: '`3x³ − 2x + 7` is a polynomial of degree 3. Its leading coefficient is 3 and its constant term is 7. `1/x` and `√x` are not polynomials in x. Write missing powers with coefficient zero when dividing.' },
    worked('Add and subtract like terms', 'P = 2x² + 3x − 1; Q = x² − 4x + 5. Find P − Q.', 'x² + 7x − 6', [
      ['P − Q = 2x² + 3x − 1', 'Write P first.'], ['          − x² + 4x − 5', 'Change every sign in Q when subtracting it.'], ['= x² + 7x − 6', 'Collect terms with the same power.'],
    ]),
    worked('Multiply polynomials', 'Expand (x + 2)(x² − 3x + 4).', 'x³ − x² − 2x + 8', [
      ['x(x² − 3x + 4) + 2(x² − 3x + 4)', 'Multiply every term by x and by 2.'], ['x³ − 3x² + 4x + 2x² − 6x + 8', 'Expand both products.'], ['x³ − x² − 2x + 8', 'Collect like terms.'],
    ]),
    practice(['Find `(3x² − x + 2) + (x² + 4x − 5)`.', 'Expand `(2x − 1)(x² + x + 3)`.'], ['4x² + 3x − 3', '2x³ + x² + 5x − 3']),
  ]),
  section('division', 'Polynomial Division', 'Divide, multiply, subtract, and repeat.', [
    { f: 'P(x) = divisor × quotient + remainder' },
    { p: 'Put terms in descending powers. Include missing terms such as 0x². At each stage divide the first remaining term by the first term of the divisor. The remainder must have a lower degree than the divisor.' },
    worked('Long division', 'Divide x³ − 2x² − 5x + 6 by x − 3.', 'Quotient x² + x − 2; remainder 0', [
      ['x³ ÷ x = x²', 'This is the first term of the quotient.'], ['Subtract x²(x − 3): x² − 5x + 6', 'Subtract the whole product, including its signs.'], ['x² ÷ x = x', 'This is the second term.'], ['Subtract x(x − 3): −2x + 6', 'Keep the remaining terms.'], ['−2x ÷ x = −2', 'This is the last term.'], ['Subtract −2(x − 3): 0', 'No remainder is left.'], ['P(x) = (x − 3)(x² + x − 2)', 'Multiply back to check.'],
    ]),
    { p: 'If the remainder is r, the divided expression is `Q(x) + r/(x − a)`, with `x ≠ a`. Do not forget the denominator under the remainder.' },
    practice(['Divide `x³ + 1` by `x + 1`.', 'Divide `x² + 1` by `x − 1`.'], ['Quotient x² − x + 1; remainder 0', 'Quotient x + 1; remainder 2']),
  ]),
  section('factor-remainder', 'Factor & Remainder Theorems', 'Substitution can tell you a remainder without long division.', [
    { p: 'When P(x) is divided by `x − a`, the remainder is `P(a)`. If `P(a) = 0`, then `x − a` is a factor. For `x + 2`, use a = −2. For `2x − 1`, use x = 1/2.' },
    { p: '**Why it works:** `P(x) = (x − a)Q(x) + r`. Put x = a: the product vanishes, so `P(a) = r`. A zero remainder means exact division.' },
    worked('Find a remainder', 'Find the remainder when x³ − 2x + 5 is divided by x + 1.', 'Remainder = 6', [
      ['x + 1 = 0 gives x = −1', 'Use the zero of the divisor.'], ['P(−1) = (−1)³ − 2(−1) + 5', 'Keep brackets around negative numbers.'], ['= −1 + 2 + 5 = 6', 'This value is the remainder.'],
    ]),
    worked('Find an unknown coefficient', 'x − 2 is a factor of x³ + kx − 10. Find k.', 'k = 1', [
      ['P(2) = 0', 'A factor gives remainder zero.'], ['8 + 2k − 10 = 0', 'Substitute x = 2.'], ['2k = 2, so k = 1', 'Solve for the coefficient.'],
    ]),
    { p: 'To solve a cubic, find a factor, divide out that factor, then solve the remaining quadratic. Integer-root candidates divide the constant term; rational-root candidates also depend on the leading coefficient. Check each candidate by substitution.' },
    practice(['Find the remainder for `P(x) = 2x³ − x + 4` divided by `x − 2`.', 'Factorise `x³ − 2x² − 5x + 6` fully.'], ['18', '(x − 3)(x − 1)(x + 2)']),
    exam(PAST.factor),
  ]),
  section('quadratics', 'Quadratics & Completing the Square', 'Square form shows the turning point and helps solve equations.', [
    { p: 'For `ax² + bx + c`, factor a out of the x² and x terms first. Inside the bracket, halve the coefficient of x, square it, then add and subtract that square.' },
    worked('Complete the square', 'Write 2x² + 8x + 3 in square form.', '2(x + 2)² − 5; minimum −5 at x = −2', [
      ['2(x² + 4x) + 3', 'Factor 2 out of the first two terms.'], ['2[(x + 2)² − 4] + 3', 'Half of 4 is 2; subtract 2² inside.'], ['2(x + 2)² − 5', 'Multiply out the constant: −8 + 3.'], ['Minimum = −5 when x = −2', 'A real square is at least zero.'],
    ]),
    { p: 'Solve a quadratic by factorising, completing the square or using the formula. Always rearrange to `ax² + bx + c = 0` before reading a, b and c.' },
    { f: 'x = (−b ± √(b² − 4ac))/(2a)' },
    worked('Formula with exact roots', 'Solve 2x² + x − 4 = 0.', 'x = (−1 ± √33)/4', [
      ['a = 2, b = 1, c = −4', 'Read the signs from the equation.'], ['b² − 4ac = 1 + 32 = 33', 'Work out the number under the root.'], ['x = (−1 ± √33)/4', 'Keep the exact root when no rounding is requested.'],
    ]),
    practice(['Complete the square: `x² − 6x + 5`.', 'Solve `x² − 6x + 5 = 0`.'], ['(x − 3)² − 4', 'x = 1 or x = 5']),
    exam(PAST.square),
  ]),
  section('discriminant', 'The Discriminant', 'Count the real roots without finding them.', [
    { f: 'D = b² − 4ac, with a ≠ 0' },
    { table: [['Value of D', 'Real roots'], ['D > 0', 'Two different real roots'], ['D = 0', 'One repeated real root'], ['D < 0', 'No real roots']] },
    worked('A condition on a parameter', 'Find k for which x² − 4x + k = 0 has equal roots.', 'k = 4', [
      ['D = (−4)² − 4(1)(k)', 'Use a = 1, b = −4, c = k.'], ['D = 16 − 4k', 'Simplify.'], ['16 − 4k = 0', 'Equal roots require D = 0.'], ['k = 4', 'The equation becomes (x − 2)² = 0.'],
    ]),
    { p: 'For two different real roots use `D > 0`, not `D ≥ 0`. For at least one real root use `D ≥ 0`. Check that a parameter has not made the x² coefficient zero.' },
    practice(['How many real roots does `3x² + 2x + 1 = 0` have?', 'For which k does `x² + 2x + k = 0` have two distinct real roots?'], ['No real roots: D = −8', 'k < 1']),
  ]),
  section('identities', 'Identities & Coefficients', 'An identity is true for every allowed value of x.', [
    { p: '`2(x + 1) ≡ 2x + 2` is an identity. `2(x + 1) = 6` is an equation to solve. In a polynomial identity, the coefficients of matching powers must be equal.' },
    worked('Compare coefficients', 'Find a,b,c if ax² + bx + c ≡ (2x − 1)(x + 3).', 'a = 2, b = 5, c = −3', [
      ['(2x − 1)(x + 3) = 2x² + 5x − 3', 'Expand the right side.'], ['a = 2', 'Compare the x² coefficients.'], ['b = 5; c = −3', 'Compare the x coefficient and the constant.'],
    ]),
    { p: 'Substituting convenient x values also gives equations for unknown constants. You need enough independent equations. A single substitution does not prove an identity.' },
    practice(['Find A and B if `3x + 7 ≡ A(x − 1) + B(x + 2)`.'], ['A = −1/3; B = 10/3']),
  ]),
  section('simultaneous', 'Simultaneous Equations', 'Use the linear equation to replace one unknown in the other equation.', [
    worked('A line and a quadratic', 'Solve y = x + 1 and x² + y² = 13.', '(2, 3) and (−3, −2)', [
      ['x² + (x + 1)² = 13', 'Replace y using the linear equation.'], ['2x² + 2x − 12 = 0', 'Expand and collect terms.'], ['x² + x − 6 = 0', 'Divide by 2.'], ['(x + 3)(x − 2) = 0', 'Factorise.'], ['x = −3 or x = 2', 'Set each factor to zero.'], ['y = −2 or y = 3 respectively', 'Keep each y paired with its own x.'], ['Check: 9 + 4 = 13; 4 + 9 = 13', 'Both pairs work in both original equations.'],
    ]),
    { p: 'There can be two pairs, one pair or no real pairs. The discriminant of the substituted quadratic tells you which case occurs. If you multiply by a variable expression, record where it could be zero and check the answers.' },
    practice(['Solve `y = 2x` and `x² + y² = 20`.'], ['(2, 4) and (−2, −4)']),
  ]),
  section('partial-fractions', 'Partial Fractions', 'Split a rational expression into simpler fractions.', [
    { p: 'First factor the denominator. If the numerator degree is at least the denominator degree, divide first. Then choose a numerator for every denominator factor, multiply by the full denominator, and find the constants.' },
    { table: [['Denominator factor', 'Required terms'], ['(x − a)(x − b)', 'A/(x − a) + B/(x − b)'], ['(x − a)²', 'A/(x − a) + B/(x − a)²'], ['x² + 1 (irreducible quadratic)', '(Ax + B)/(x² + 1)']] },
    worked('Two different linear factors', 'Express (3x + 5)/[(x + 1)(x + 2)] in partial fractions.', '2/(x + 1) + 1/(x + 2), x ≠ −1,−2', [
      ['A/(x + 1) + B/(x + 2)', 'Use a constant numerator over each linear factor.'], ['3x + 5 = A(x + 2) + B(x + 1)', 'Multiply by both factors.'], ['x = −1: 2 = A', 'This removes the B term.'], ['x = −2: −1 = −B, so B = 1', 'This removes the A term.'], ['2/(x + 1) + 1/(x + 2)', 'Substitute the constants.'],
    ]),
    { p: 'The cleared equation is a polynomial identity, so we may use the factor zeros to find A and B. Those values remain excluded from the original fraction.' },
    practice(['Decompose `5/[(x + 1)(x + 6)]`.'], ['1/(x + 1) − 1/(x + 6); x ≠ −1,−6']),
    exam(PAST.partial),
  ]),
  section('advanced-partial', 'Repeated & Improper Fractions', 'Keep every power of a repeated factor, and divide improper fractions first.', [
    worked('A repeated linear factor', 'Decompose (2x + 3)/[x(x + 1)²].', '3/x − 3/(x + 1) − 1/(x + 1)²', [
      ['A/x + B/(x + 1) + C/(x + 1)²', 'Both powers of x + 1 need their own term.'], ['2x + 3 = A(x + 1)² + Bx(x + 1) + Cx', 'Clear the full denominator.'], ['x = 0: A = 3', 'Remove B and C.'], ['x = −1: 1 = −C, so C = −1', 'Remove A and B.'], ['x² coefficients: A + B = 0', 'Compare coefficients to find the last constant.'], ['B = −3', 'Remember x ≠ 0, −1.'],
    ]),
    worked('An irreducible quadratic factor', 'Decompose (x + 1)/[x(x² + 1)].', '1/x + (−x + 1)/(x² + 1)', [
      ['A/x + (Bx + C)/(x² + 1)', 'A quadratic factor needs a linear numerator.'], ['x + 1 = A(x² + 1) + (Bx + C)x', 'Clear the denominator.'], ['A = 1, C = 1, A + B = 0', 'Compare constant, x and x² coefficients.'], ['B = −1', 'x ≠ 0.'],
    ]),
    { p: '**Improper fraction:** divide until the remaining numerator has lower degree than the denominator. Keep the polynomial quotient and decompose only the remainder fraction.' },
    practice(['Decompose `(x² + 1)/[x(x + 1)]`.'], ['1 + 1/x − 2/(x + 1); x ≠ 0,−1']),
    exam(PAST.improper),
  ]),
  section('inequalities', 'Polynomial Inequalities', 'Find boundary points, then test the intervals between them.', [
    { p: 'Rearrange so one side is zero. Factorise or find the roots. Put those roots in order on a number line. Test one value in each interval. Include roots for ≤ or ≥; exclude them for < or >. Dividing by a negative number reverses an inequality.' },
    worked('A quadratic inequality', 'Solve x² − x − 6 ≤ 0.', '−2 ≤ x ≤ 3', [
      ['(x + 2)(x − 3) ≤ 0', 'Factorise.'], ['Boundary points: −2 and 3', 'Set each factor to zero.'], ['At x = −3: product is positive', 'Test left of −2.'], ['At x = 0: product is negative', 'Test between the roots.'], ['At x = 4: product is positive', 'Test right of 3.'], ['−2 ≤ x ≤ 3', 'Choose negative or zero, including both boundaries.'],
    ]),
    { diagram: 'signs', caption: 'The product (x + 2)(x − 3) is negative between the roots and positive outside.' },
    { p: 'For cubics and higher powers, test every interval. A repeated even-power factor does not change sign when you cross its root. Do not assume every question uses the interval between two roots.' },
    practice(['Solve `−2x + 3 > 7`.', 'Solve `(x − 1)(x + 4) > 0`.'], ['x < −2', 'x < −4 or x > 1']),
    exam(PAST.quadraticInequality),
  ]),
  section('rational-inequalities', 'Rational Inequalities', 'A denominator can change sign, so use a sign chart.', [
    { p: 'Find zeros of both numerator and denominator. These split the number line into intervals. Test the sign on each interval. A denominator zero is always excluded, even with ≤ or ≥. Do not multiply by a denominator of unknown sign.' },
    worked('A rational inequality', 'Solve (x − 1)/(x + 2) ≥ 0.', 'x < −2 or x ≥ 1', [
      ['Critical values: −2 and 1', 'The denominator is zero at −2; the numerator at 1.'], ['x = −3 gives (−4)/(−1) > 0', 'The left interval is positive.'], ['x = 0 gives (−1)/2 < 0', 'The middle interval is negative.'], ['x = 2 gives 1/4 > 0', 'The right interval is positive.'], ['x < −2 or x ≥ 1', 'Include the zero at 1, but exclude the pole at −2.'],
    ]),
    practice(['Solve `x/(x − 2) < 0`.'], ['0 < x < 2']),
    exam(PAST.rationalInequality),
  ]),
  section('functions', 'Functions & Inverses', 'A function gives exactly one output for each input in its domain.', [
    { p: 'The **domain** is the set of allowed inputs. The **range** is the set of outputs actually reached. `f(3)` means replace x by 3 in the rule. `fg(x)` means `f(g(x))`: apply g first.' },
    worked('A composite function', 'f(x) = 2x + 1 and g(x) = x². Find fg(x) and gf(x).', 'fg(x) = 2x² + 1; gf(x) = (2x + 1)²', [
      ['fg(x) = f(x²) = 2x² + 1', 'Use the output of g as the input of f.'], ['gf(x) = g(2x + 1) = (2x + 1)²', 'Reverse the order; the answer usually changes.'],
    ]),
    { p: 'An inverse undoes a function. Write y = f(x), swap x and y, then solve for y. An inverse function exists when the original function is one-to-one on its domain. For example, x² needs a restriction such as x ≥ 0 to have a single-valued inverse.' },
    worked('Find an inverse', 'f(x) = 3x − 2 for all real x. Find f⁻¹(x).', 'f⁻¹(x) = (x + 2)/3', [
      ['y = 3x − 2', 'Write the original rule.'], ['x = 3y − 2', 'Swap input and output.'], ['y = (x + 2)/3', 'Solve for y.'], ['f(f⁻¹(x)) = x', 'Check that the inverse undoes the original rule.'],
    ]),
    { p: '`f⁻¹(x)` means inverse function; it does not mean `1/f(x)`. For composites, x must be in the inner function’s domain and its output must be in the outer function’s domain.' },
    practice(['If `f(x) = x²`, find `f(−3)`.', 'Find the inverse of `f(x) = 2x + 5`.'], ['9', 'f⁻¹(x) = (x − 5)/2']),
  ]),
  section('exponentials', 'Exponential Functions', 'In an exponential function, the variable is in the power.', [
    { p: '`y = a^x`, where a > 0 and a ≠ 1, has domain all real numbers and range y > 0. It passes through (0,1) and approaches y = 0 without touching it. It grows when a > 1 and decreases when 0 < a < 1. The number e is about 2.718; `e^x` is the natural exponential.' },
    { diagram: 'exponential', caption: 'y = 2^x passes through (−1, 1/2), (0, 1) and (1, 2). Its horizontal asymptote is y = 0.' },
    worked('Exponential growth model', 'A culture starts with 200 cells and grows by 10% per hour. Find the count after 3 hours.', '266.2 by the model, about 266 cells', [
      ['Multiplier = 1 + 10/100 = 1.1', 'A 10% increase leaves 110% of the previous amount.'], ['N(t) = 200(1.1)^t', 'Multiply by 1.1 once for each hour.'], ['N(3) = 200(1.1)³ = 266.2', 'The model can give a non-whole count; round for actual cells.'],
    ]),
    { p: 'For decay by r% per time period, the multiplier is `1 − r/100`. For continuous growth use `N = N₀e^(kt)`; k > 0 gives growth and k < 0 gives decay. Keep units for t consistent with the rate.' },
    practice(['A value of 1000 decreases by 20% per year. Find its value after 2 years.'], ['640']),
    exam(PAST.exponential, PAST.growth),
  ]),
  section('logarithms', 'Logarithms', 'A logarithm answers: what power gives this number?', [
    { f: 'logₐ b = c means a^c = b' },
    { p: 'Use a > 0, a ≠ 1 and b > 0. `log x` usually means base 10; `ln x` means base e. Logarithms and exponentials undo each other: `ln(e^x) = x` and `e^(ln x) = x` for x > 0.' },
    { table: [['Law (u,v > 0)', 'Rule'], ['logₐ(uv)', 'logₐ u + logₐ v'], ['logₐ(u/v)', 'logₐ u − logₐ v'], ['logₐ(u^r)', 'r logₐ u'], ['Change of base', 'logₐ u = ln u / ln a']] },
    worked('Solve a logarithmic equation', 'Solve ln(x − 1) + ln(x + 1) = ln 8.', 'x = 3', [
      ['Domain: x − 1 > 0 and x + 1 > 0', 'Every original log argument must be positive.'], ['So x > 1', 'Combine the domain restrictions.'], ['ln[(x − 1)(x + 1)] = ln 8', 'A sum of logs becomes the log of a product.'], ['x² − 1 = 8', 'Equal logs have equal positive arguments.'], ['x = ±3', 'Solve the quadratic.'], ['Accept x = 3 only', '−3 fails the original log domain.'],
    ]),
    { p: '**Common mistake:** `ln(u + v)` is not `ln u + ln v`. For logarithmic inequalities, base greater than 1 preserves the inequality; base between 0 and 1 reverses it. Always keep the positive-argument restrictions.' },
    worked('Logarithmic inequality', 'Solve ln(x − 1) < ln 3.', '1 < x < 4', [
      ['x > 1', 'The log argument must be positive.'], ['x − 1 < 3', 'Natural log is increasing.'], ['x < 4, so 1 < x < 4', 'Combine the answer with the domain.'],
    ]),
    practice(['Evaluate `log₂ 32`.', 'Solve `3^x = 7` exactly.', 'Solve `log₂(x + 1) ≥ 3`.'], ['5', 'x = ln 7/ln 3', 'x ≥ 7']),
    exam(PAST.log),
  ]),
  section('linearising', 'Linearising Relationships', 'Take logs to turn a curved relationship into a straight-line form.', [
    { p: 'For `y = Axⁿ` with x,y,A > 0, taking logs gives `ln y = n ln x + ln A`. Plot ln y vertically against ln x horizontally: gradient n, intercept ln A. For `y = Ae^(kx)`, plot ln y against x: gradient k, intercept ln A.' },
    worked('Read a model from a straight line', 'A plot of ln y against ln x has gradient 2 and intercept ln 3. Find y in terms of x.', 'y = 3x²', [
      ['ln y = 2 ln x + ln 3', 'Use vertical = gradient × horizontal + intercept.'], ['ln y = ln(x²) + ln 3', 'Move the coefficient into the power.'], ['ln y = ln(3x²)', 'Combine the logarithms.'], ['y = 3x²', 'Undo the logarithm.'],
    ]),
    { p: 'The intercept is ln A, not A. If the intercept is c, then A = e^c. With base-10 logs, A = 10^c. Label the transformed axes so the gradient is interpreted correctly.' },
    practice(['A plot of ln y against x has gradient −0.2 and intercept ln 5. Find the model.'], ['y = 5e^(−0.2x)']),
  ]),
  section('rational-functions', 'Rational Functions & Graphs', 'A rational function is a fraction of polynomials.', [
    { p: 'Exclude every value that makes the original denominator zero. Find intercepts by putting x = 0 or y = 0 where allowed. An **asymptote** is a line that a graph approaches. A cancelled denominator factor creates a missing point, not a restored domain value.' },
    worked('Domain, range and asymptotes', 'For f(x) = 1/(x − 2) + 3, find its domain, range and intercepts.', 'x ≠ 2; y ≠ 3; intercepts (0, 5/2), (5/3, 0)', [
      ['x − 2 ≠ 0, so x ≠ 2', 'The denominator cannot be zero.'], ['Vertical asymptote x = 2', 'The fraction becomes unbounded near 2.'], ['Horizontal asymptote y = 3', 'The fraction approaches zero for large |x|.'], ['y ≠ 3', '1/(x − 2) never equals zero.'], ['f(0) = −1/2 + 3 = 5/2', 'Find the y-intercept.'], ['0 = 1/(x − 2) + 3', 'For the x-intercept set y to zero.'], ['x − 2 = −1/3, so x = 5/3', 'Solve, keeping the domain.'],
    ]),
    { diagram: 'rational', caption: 'The June 2020 question uses only the x > 0 branch of y = 2 − 1/x. Its range is y < 2.' },
    practice(['Find the domain of `(x + 1)/(x² − 9)`.', 'Simplify `(x² − 1)/(x − 1)` and state the restriction.'], ['x ≠ −3,3', 'x + 1, with x ≠ 1; a missing point at (1,2)']),
    exam(PAST.inverse),
  ]),
  section('modulus', 'Modulus Functions', 'The modulus of a number is its distance from zero.', [
    { p: '`|x| = x` when x ≥ 0, and `|x| = −x` when x < 0. A modulus is never negative. The graph of y = |x| is a V with vertex (0,0). For y = |x − a| + b the vertex moves to (a,b).' },
    worked('A modulus equation', 'Solve |2x − 1| = 5.', 'x = 3 or x = −2', [
      ['2x − 1 = 5 or 2x − 1 = −5', 'A distance of 5 can come from +5 or −5.'], ['x = 3 or x = −2', 'Solve both linear equations.'], ['|6 − 1| = 5; |−4 − 1| = 5', 'Check both in the original equation.'],
    ]),
    { p: 'For c > 0, `|u| < c` means `−c < u < c`. `|u| > c` means `u < −c` or `u > c`. If the right side depends on x, check its sign before squaring or splitting cases.' },
    worked('A modulus inequality', 'Solve |2x − 1| < 5.', '−2 < x < 3', [
      ['−5 < 2x − 1 < 5', 'The value lies within distance 5 of zero.'], ['−4 < 2x < 6', 'Add 1 to all three parts.'], ['−2 < x < 3', 'Divide all three parts by positive 2.'],
    ]),
    { diagram: 'modulus', caption: 'y = 2 − |x| meets y = x/3 + 1 at (−3/2, 1/2) and (3/4, 5/4).' },
    practice(['Solve `|x + 2| = 4`.', 'Solve `|x − 1| ≥ 3`.'], ['x = 2 or x = −6', 'x ≤ −2 or x ≥ 4']),
    exam(PAST.modulus, PAST.intersections),
  ]),
  section('revision', 'Revision & Question Library', 'Try a mixed set, then return to any skill you need to practise.', [
    { h: 'Choose the method' },
    { table: [['Question clue', 'First step'], ['“varies as”', 'Write a model with an unknown constant'], ['“factor” or “remainder”', 'Substitute the zero of the divisor'], ['“equal roots”', 'Set the discriminant to zero'], ['“partial fractions”', 'Check degree, then factor the denominator'], ['“solve an inequality”', 'Find domain and boundary values; test signs'], ['“exact answer”', 'Keep fractions, surds and logarithms'], ['“inverse”', 'Swap x and y; check one-to-one domain']] },
    practice(['Evaluate `64^(−2/3)`.', 'y ∝ 1/√x. y = 4 when x = 9. Find y when x = 36.', 'Find the remainder of `x³ + 2x² − x + 4` divided by `x + 2`.', 'Solve `x² − 5x + 6 ≤ 0`.', 'Decompose `(3x + 1)/[x(x + 1)]`.', 'Solve `e^(2x) − 5e^x + 6 = 0`.', 'Find the inverse of `f(x) = (x − 1)/2`.', 'Solve `|x + 1| > 2`.'], ['1/16', '2', '6', '2 ≤ x ≤ 3', '1/x + 2/(x + 1); x ≠ 0,−1', 'x = ln 2 or ln 3', 'f⁻¹(x) = 2x + 1', 'x < −3 or x > 1']),
    { c: true },
    { h: 'Checked past-paper library' },
    { p: 'These are the same verified cards used beside the matching lessons, gathered here for revision. The library covers selected Algebra questions from the two scans, not every question in every ZIMSEC paper.' },
    { diagram: 'sources' },
    exam(PAST.indices, PAST.exponential, PAST.log, PAST.partial, PAST.rationalInequality, PAST.variation, PAST.square, PAST.quadraticInequality, PAST.factor, PAST.improper, PAST.growth, PAST.modulus, PAST.inverse, PAST.intersections),
  ]),
];
