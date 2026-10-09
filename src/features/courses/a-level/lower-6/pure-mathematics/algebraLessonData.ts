import type { LessonSection } from '../../../o-level/form-4/mathematics/LessonPage';
import { PAST } from './algebraPastPapers';
import { ALGEBRA_QUESTION_BANKS, ALGEBRA_PAPER_FINDINGS } from './algebraQuestionBanks';
import { ADD_TWO_AND_THREE, SIMPLIFY_NUMBERS, COMBINE_X_POWERS, COMBINE_Y_POWERS, ROOT_FROM_FRACTION, EVALUATE_CUBE_ROOT, SQUARE_THREE, NEGATIVE_FRACTION_POWER, FOURTH_ROOT_BELOW, EVALUATE_FOURTH_ROOT, CUBE_TWO_BELOW, COMMON_BASE_TWO, type WorkingScene } from './algebraWorkingAnimations';
import type { FractionProblem } from '../../../o-level/form-4/mathematics/mathPowers';

// Form 5 competency matrix: printed pages 10–11 of the user's 2015–2022 syllabus.
// Original explanations and worked examples; past-paper questions are kept separately.
const worked = (title: string, problem: string, answer: string, steps: [string, string, WorkingScene?][], problemFraction?: FractionProblem) => ({
  solver: { title, problem, problemFraction, answer, stepGrid: true, manualStart: false, controlsUnderQuestion: true, steps: steps.map(([text, why, scene]) => ({ text, why, scene })) },
});
const practice = (questions: string[], answers: string[]) => ({ practice: questions, answers });
const exam = (...items: (typeof PAST)[keyof typeof PAST][]) => ({ exam: items, title: 'What ZIMSEC has asked' });
const section = (id: string, title: string, intro: string, lesson: any[]): LessonSection => ({
  id, title, heading: title, intro,
  lesson: [
    ...lesson.filter(block => !block.exam && !block.c),
    { c: true }, { exam: ALGEBRA_QUESTION_BANKS[id], title: '', examFindings: ALGEBRA_PAPER_FINDINGS[id] },
  ],
});

export const ALGEBRA_SECTIONS: LessonSection[] = [
  section('indices', 'Laws of Indices', 'Moving from O Level Mathematics to A Level Pure Mathematics starts with ideas you may already know: squares, cubes and powers. We will build from simple numbers to expressions with letters, one step at a time.', [
    { p: 'When a question says **simplify**, write the expression in a shorter form with the same value. When it says **evaluate**, work out its number value.' },
    { h: 'Start with repeated multiplication' },
    { p: 'You may have seen a number squared, such as `3²`, or a number cubed, such as `2³`. These are short ways of writing repeated multiplication: `3² = 3 × 3 = 9` and `2³ = 2 × 2 × 2 = 8`.' },
    { p: 'In `2³`, the **base** is 2: this is the number being multiplied. The small raised 3 is the **index**, also called the power or exponent. It tells us to multiply three 2s together. The word indices means more than one index.' },
    { p: '**Be careful:** `2³` is not `2 × 3`. It means `2 × 2 × 2`. The same idea works with letters: `x³ = x × x × x`, even when we do not yet know the value of x.' },
    { h: 'Why do we need rules?' },
    { p: 'Writing out every number being multiplied is useful at first, but it takes time when the powers are large. The laws of indices give us a shorter way to work. Let us see where the first rule comes from.' },
    worked('Why we add the powers', 'Simplify 2² × 2³.', '2⁵ = 32', [
      ['2² × 2³ = (2 × 2)(2 × 2 × 2)', 'Write each power as repeated multiplication.'],
      ['= 2 × 2 × 2 × 2 × 2', 'The first group has two 2s. The second group has three 2s.'],
      ['= 2^(2+3) = 2⁵', 'We multiply five 2s together, so the power is 5.', ADD_TWO_AND_THREE],
      ['= 32', 'Multiply the five 2s to find the answer.'],
    ]),
    { p: 'So, when we **multiply powers with the same base**, we add their indices. For example, `x² × x³ = x⁵`. The base stays the same. Powers with different bases, such as `2² × 3³`, do not use this rule.' },
    { h: 'From O Level to A Level' },
    { p: 'At A Level, we also work with zero, negative and fractional indices, and use these ideas to solve equations. We will explain those meanings as we reach them. First, use the table below to learn the basic rules. In the table, a and b stand for bases; m and n stand for powers.' },
    { tableSize: 'large', table: [['Rule', 'Meaning'], ['a^m × a^n = a^(m+n)', 'Same base: add powers'], ['a^m ÷ a^n = a^(m−n)', 'Same base: subtract powers; the base cannot be zero'], ['(a^m)^n = a^(mn)', 'A power of a power: multiply powers'], ['(ab)^n = a^n b^n', 'Raise each number or letter in the bracket to this power'], ['(a/b)^n = a^n/b^n', 'b must not be zero'], ['a⁰ = 1', 'a must not be zero'], ['a^(−n) = 1/a^n', 'Put 1 on top and the positive power below the fraction line']] },
    worked('Combine the powers', 'Simplify (3x²y³)(2x⁴y)/(6xy²), x,y ≠ 0.', 'x⁵y²', [
      ['3 × 2 = 6; 6/6 = 1', 'Simplify the numbers first.', SIMPLIFY_NUMBERS], ['x^(2+4−1) = x⁵', 'Multiply: add powers. Divide: subtract powers.', COMBINE_X_POWERS], ['y^(3+1−2) = y²', 'Use the same rule for y.', COMBINE_Y_POWERS], ['Answer = x⁵y²', 'Write the x part and the y part together.'],
    ], { prefix: 'Simplify ', numerator: '(3x²y³)(2x⁴y)', denominator: '6xy²', suffix: ', x,y ≠ 0.' }),
    { p: '**Common mistake:** `a² + a³` cannot become `a⁵`. The add-powers rule is for multiplication, not addition. Also, `(a + b)²` is not `a² + b²`.' },
    practice(['Simplify `x⁴ × x³ ÷ x²`, x ≠ 0.', 'Evaluate `5⁰ + 2^(−3)`.', 'Simplify `(2a³)²`.'], ['x⁵', '9/8', '4a⁶']),
  ]),
  section('rational-indices', 'Rational Indices', 'A power written as a fraction tells you which root to find and which power to use.', [
    { p: 'A **square root** is a number that gives the starting number when multiplied by itself: √9 = 3 because 3 × 3 = 9. A **cube root** uses three equal factors: ∛27 = 3 because 3 × 3 × 3 = 27. A fourth root uses four equal factors. We use the positive root for a positive number when reading the root symbol.' },
    { f: 'a^(m/n) = (ⁿ√a)^m' },
    { p: 'In a fraction, the **numerator** is the top number and the **denominator** is the bottom number. In the power m/n, the bottom number n tells you which root to find. The top number m tells you which power to use. For example, 2/3 means find the cube root, then square it. For a positive base, you can also square first and find the cube root afterwards. A square root, fourth root or other even root needs a number that is zero or greater if we want a real-number answer.' },
    worked('Root first, then power', 'Evaluate 27^(2/3).', '9', [
      ['27^(2/3) = (∛27)²', 'Find the cube root first, then square it.', ROOT_FROM_FRACTION],
      ['= 3²', '3 × 3 × 3 = 27, so the cube root of 27 is 3.', EVALUATE_CUBE_ROOT],
      ['= 9', '3 × 3 = 9.', SQUARE_THREE],
    ]),
    worked('A negative fractional power', 'Evaluate 16^(−3/4).', '1/8', [
      ['16^(−3/4) = 1/(16^(3/4))', 'Put 1 on top and 16 with the positive power below the line.', NEGATIVE_FRACTION_POWER],
      ['= 1/(⁴√16)³', 'Below the line, find the fourth root and then cube it.', FOURTH_ROOT_BELOW],
      ['= 1/2³', '2 × 2 × 2 × 2 = 16, so the fourth root of 16 is 2.', EVALUATE_FOURTH_ROOT],
      ['= 1/8', '2 × 2 × 2 = 8. Keep 1 on top.', CUBE_TWO_BELOW],
    ]),
    { p: 'If an equation contains `x^(1/3)` and `x^(−1/3)`, put `u = ∛x`. The second term becomes `1/u`. x cannot be zero. At the end, use `x = u³` to find x from each value of u.' },
    worked('An index equation', 'Solve 4^(x+1) = 8^x.', 'x = 2', [
      ['2^(2x+2) = 2^(3x)', 'Write 4 and 8 using base 2.', COMMON_BASE_TWO], ['2x + 2 = 3x', 'Both sides use base 2. For the answers to be equal, their powers must be equal too.'], ['x = 2', 'Subtract 2x from both sides.'],
    ]),
    practice(['Evaluate `32^(2/5)`.', 'Evaluate `81^(−1/2)`.', 'Solve `9^x = 27`.'], ['4', '1/9', 'x = 3/2']),
    exam(PAST.indices),
  ]),
  section('direct-inverse', 'Direct & Inverse Variation', 'Write a formula for how the quantities change together, then put in the given numbers.', [
    { p: 'The sign **∝** means varies as: it tells us how one quantity changes when another changes. We replace ∝ with an equals sign and a constant k to make a formula.' },
    { p: '**Direct variation:** `y ∝ x` means `y = kx`. Dividing y by x always gives the same number. **Inverse variation:** `y ∝ 1/x` means `y = k/x`. Multiplying x by y always gives the same number. In both rules, k is a **constant**: a number that stays the same. Use the given x and y values to find k.' },
    { diagram: 'variation', caption: 'Direct variation doubles y when x doubles. Inverse variation halves y when x doubles.' },
    worked('Direct variation with a power', 'y varies directly as x². y = 12 when x = 2. Find y when x = 5.', 'y = 75', [
      ['y = kx²', 'The words tell us to multiply x² by a constant k.'], ['12 = k × 4, so k = 3', 'Use the pair of given values.'], ['y = 3x²', 'Write the formula with the value of k.'], ['y = 3 × 25 = 75', 'Now use x = 5.'],
    ]),
    worked('Inverse variation', 'y varies inversely as x. y = 6 when x = 4. Find x when y = 3.', 'x = 8', [
      ['y = k/x', 'Here, x goes below the fraction line.'], ['6 = k/4, so k = 24', 'Multiply by 4 to find k.'], ['3 = 24/x', 'Use the new value of y.'], ['3x = 24, so x = 8', 'Solve the equation.'],
    ]),
    { p: '**Check:** if x increases, an inverse relationship with positive k and positive x makes y decrease. Do not write `y = kx` for an inverse question.' },
    practice(['y ∝ x³. y = 16 when x = 2. Find y when x = 3.', 'y ∝ 1/x². y = 8 when x = 3. Find y when x = 6.'], ['54', '2']),
    exam(PAST.variation),
  ]),
  section('joint-partial', 'Joint & Partial Variation', 'Joint variation uses more than one changing quantity. Partial variation adds two or more parts.', [
    { p: '**Joint:** if y varies directly as x and inversely as z², write `y = kx/z²`. **Partial:** if y is partly constant and partly varies as x, write `y = a + bx`. Partial variation usually needs two sets of values to find two constants.' },
    worked('Joint variation', 'y ∝ x/z². y = 6 when x = 3, z = 2. Find y when x = 5, z = 4.', 'y = 5/2', [
      ['6 = k × 3/4', 'Put in the given values of x and z.'], ['k = 8, so y = 8x/z²', 'Find the constant before using the new values.'], ['y = 8 × 5/16 = 5/2', 'Square z below the fraction line.'],
    ]),
    worked('A fixed charge and a variable charge', 'C = a + bd. C = 14 when d = 2; C = 26 when d = 5. Find C when d = 8.', 'C = 38', [
      ['a + 2b = 14; a + 5b = 26', 'Each pair gives an equation.'], ['3b = 12, so b = 4', 'Take the first equation away from the second.'], ['a + 8 = 14, so a = 6', 'Put 4 in place of b.'], ['C = 6 + 4d', '6 is the fixed charge; 4 is the charge per unit.'], ['C = 6 + 32 = 38', 'Use d = 8.'],
    ]),
    { p: 'A quantity can also be partly proportional to x and partly proportional to x²: `y = ax + bx²`. Write an equation using each pair of given values. Use the two equations to find a and b.' },
    practice(['y = kxz. y = 24 when x = 2, z = 3. Find y when x = 5, z = 2.', 'y = a + bx. y = 7 when x = 1 and y = 13 when x = 3. Find a and b.'], ['40', 'a = 4, b = 3']),
  ]),
  section('polynomials', 'Polynomial Operations', 'A polynomial has whole-number powers of x that are zero or positive.', [
    { p: 'A **polynomial** is made by adding or subtracting terms such as 3x³, −2x and 7. In `3x³ − 2x + 7`, the highest power is 3. We call this the **degree**. A **coefficient** is the number multiplying a letter: 3 multiplies x³, and −2 multiplies x. The **leading coefficient** is the number beside the highest power, so it is 3 here.' },
    { p: 'The **constant term** has no x, so it is 7. `1/x` and `√x` are not polynomials in x. When dividing, write any missing power with a zero in front, such as 0x².' },
    { p: '**Expand** means multiply out brackets. **Like terms** have the same letter part, such as 2x² and 3x². **Factorise** means write an expression as things multiplied together, for example x² − 1 = (x − 1)(x + 1).' },
    worked('Add and subtract like terms', 'P = 2x² + 3x − 1; Q = x² − 4x + 5. Find P − Q.', 'x² + 7x − 6', [
      ['P − Q = 2x² + 3x − 1', 'Write P first.'], ['          − x² + 4x − 5', 'Change every sign in Q when subtracting it.'], ['= x² + 7x − 6', 'Collect terms with the same power.'],
    ]),
    worked('Multiply polynomials', 'Expand (x + 2)(x² − 3x + 4).', 'x³ − x² − 2x + 8', [
      ['x(x² − 3x + 4) + 2(x² − 3x + 4)', 'Multiply every term by x and by 2.'], ['x³ − 3x² + 4x + 2x² − 6x + 8', 'Multiply out both brackets.'], ['x³ − x² − 2x + 8', 'Add or subtract terms with the same power of x.'],
    ]),
    practice(['Find `(3x² − x + 2) + (x² + 4x − 5)`.', 'Expand `(2x − 1)(x² + x + 3)`.'], ['4x² + 3x − 3', '2x³ + x² + 5x − 3']),
  ]),
  section('division', 'Polynomial Division', 'Divide, multiply, subtract, and repeat.', [
    { f: 'P(x) = divisor × quotient + remainder' },
    { p: 'Write the highest power first, then work down to the smallest power. Include missing terms, such as 0x². The **divisor** is what we divide by. The **quotient** is the answer from dividing. The **remainder** is what is left over. At each step, divide the first term you have left by the first term of the divisor. Stop when what is left has a smaller highest power than the divisor.' },
    worked('Long division', 'Divide x³ − 2x² − 5x + 6 by x − 3.', 'Quotient x² + x − 2; remainder 0', [
      ['x³ ÷ x = x²', 'This is the first part of the division answer.'], ['Subtract x²(x − 3): x² − 5x + 6', 'Subtract everything you get after multiplying. Take care with the minus signs.'], ['x² ÷ x = x', 'This is the second term.'], ['Subtract x(x − 3): −2x + 6', 'Keep the terms that are left.'], ['−2x ÷ x = −2', 'This is the last term.'], ['Subtract −2(x − 3): 0', 'No remainder is left.'], ['P(x) = (x − 3)(x² + x − 2)', 'Multiply back to check.'],
    ]),
    { p: 'If the remainder is r, the divided expression is `Q(x) + r/(x − a)`, with `x ≠ a`. Keep the divisor below the remainder in the fraction.' },
    practice(['Divide `x³ + 1` by `x + 1`.', 'Divide `x² + 1` by `x − 1`.'], ['Quotient x² − x + 1; remainder 0', 'Quotient x + 1; remainder 2']),
  ]),
  section('factor-remainder', 'Factor & Remainder Theorems', 'Putting a number in place of x can tell you what is left over after division.', [
    { p: 'When P(x) is divided by `x − a`, the remainder is `P(a)`. If `P(a) = 0`, then `x − a` is a factor. For `x + 2`, use a = −2. For `2x − 1`, use x = 1/2.' },
    { p: '**Why it works:** `P(x) = (x − a)Q(x) + r`. Put x = a. Then x − a becomes zero, so the part being multiplied becomes zero too. This leaves `P(a) = r`. If the remainder is zero, the division leaves nothing over.' },
    worked('Find a remainder', 'Find the remainder when x³ − 2x + 5 is divided by x + 1.', 'Remainder = 6', [
      ['x + 1 = 0 gives x = −1', 'Use x = −1 because it makes x + 1 equal zero.'], ['P(−1) = (−1)³ − 2(−1) + 5', 'Keep brackets around negative numbers.'], ['= −1 + 2 + 5 = 6', 'This value is the remainder.'],
    ]),
    worked('Find an unknown coefficient', 'x − 2 is a factor of x³ + kx − 10. Find k.', 'k = 1', [
      ['P(2) = 0', 'A factor gives remainder zero.'], ['8 + 2k − 10 = 0', 'Put 2 in place of x.'], ['2k = 2, so k = 1', 'Find the unknown number k.'],
    ]),
    { p: 'A **cubic** has highest power 3. To solve a cubic equation, first find a factor, divide by it, then solve the quadratic that is left. A **root of an equation** is a value of x that makes the equation true. If a polynomial has whole-number coefficients, possible whole-number roots are positive or negative factors of its constant term.' },
    { p: 'Possible fraction roots have a factor of the constant term on top and a factor of the leading coefficient below. Try each value in the original polynomial to see whether it gives zero.' },
    practice(['Find the remainder for `P(x) = 2x³ − x + 4` divided by `x − 2`.', 'Factorise `x³ − 2x² − 5x + 6` fully.'], ['18', '(x − 3)(x − 1)(x + 2)']),
    exam(PAST.factor),
  ]),
  section('quadratics', 'Quadratics & Completing the Square', 'Square form shows the turning point and helps solve equations.', [
    { p: 'A **quadratic** has highest power 2, like x² + 3x + 2. **Completing the square** means rewriting it using a squared bracket, like (x + 2)². The **turning point** is where the curve changes from going down to going up, or from going up to going down. An **exact answer** keeps fractions and square roots instead of using rounded decimals.' },
    { p: 'For `ax² + bx + c`, factor a out of the x² and x terms first. Inside the bracket, divide the number beside x by 2. Square your result, then add and subtract that square.' },
    worked('Complete the square', 'Write 2x² + 8x + 3 in square form.', '2(x + 2)² − 5; minimum −5 at x = −2', [
      ['2(x² + 4x) + 3', 'Factor 2 out of the first two terms.'], ['2[(x + 2)² − 4] + 3', 'Half of 4 is 2; subtract 2² inside.'], ['2(x + 2)² − 5', 'Multiply out the constant: −8 + 3.'], ['Minimum = −5 when x = −2', 'Squaring a real number gives zero or a positive number.'],
    ]),
    { p: 'Solve a quadratic by factorising, completing the square or using the formula. Always rearrange to `ax² + bx + c = 0` before reading a, b and c.' },
    { f: 'x = (−b ± √(b² − 4ac))/(2a)' },
    worked('Formula with exact roots', 'Solve 2x² + x − 4 = 0.', 'x = (−1 ± √33)/4', [
      ['a = 2, b = 1, c = −4', 'Read the signs from the equation.'], ['b² − 4ac = 1 + 32 = 33', 'Work out the number under the root.'], ['x = (−1 ± √33)/4', 'Leave √33 in the answer. Only use a rounded decimal if the question asks for it.'],
    ]),
    practice(['Complete the square: `x² − 6x + 5`.', 'Solve `x² − 6x + 5 = 0`.'], ['(x − 3)² − 4', 'x = 1 or x = 5']),
    exam(PAST.square),
  ]),
  section('discriminant', 'The Discriminant', 'Use b² − 4ac to find how many real-number answers a quadratic equation has.', [
    { p: 'The **discriminant** is the number b² − 4ac in the quadratic formula. A **real root** means a real-number answer for x. A **repeated root** means both answers are the same.' },
    { f: 'D = b² − 4ac, with a ≠ 0' },
    { table: [['Value of D', 'Real roots'], ['D > 0', 'Two different real roots'], ['D = 0', 'One repeated real root'], ['D < 0', 'No real roots']] },
    worked('Find a value of k', 'Find k for which x² − 4x + k = 0 has equal roots.', 'k = 4', [
      ['D = (−4)² − 4(1)(k)', 'Use a = 1, b = −4, c = k.'], ['D = 16 − 4k', 'Simplify.'], ['16 − 4k = 0', 'For the two answers to be the same, D must be zero.'], ['k = 4', 'The equation becomes (x − 2)² = 0.'],
    ]),
    { p: 'For two different real roots use `D > 0`, not `D ≥ 0`. For at least one real root use `D ≥ 0`. Also check that the number beside x² is not zero. Otherwise the equation is no longer quadratic.' },
    practice(['How many real roots does `3x² + 2x + 1 = 0` have?', 'For which k does `x² + 2x + k = 0` have two different real-number answers?'], ['No real roots: D = −8', 'k < 1']),
  ]),
  section('identities', 'Identities & Coefficients', 'An identity is true for every allowed value of x.', [
    { p: '`2(x + 1) ≡ 2x + 2` is an identity. `2(x + 1) = 6` is an equation to solve. If two polynomials are equal for every x, the numbers beside each matching power of x must be equal.' },
    worked('Compare coefficients', 'Find a,b,c if ax² + bx + c ≡ (2x − 1)(x + 3).', 'a = 2, b = 5, c = −3', [
      ['(2x − 1)(x + 3) = 2x² + 5x − 3', 'Expand the right side.'], ['a = 2', 'Match the numbers beside x² on both sides.'], ['b = 5; c = −3', 'Match the numbers beside x, then match the terms with no x.'],
    ]),
    { p: 'You can also try simple values of x to make equations for the unknown numbers. For two unknown numbers, you need two equations that give different information. An equation that is just a copy or a multiple of the first one does not help. Showing that both sides are equal for just one x value does not show that they are equal for every x.' },
    practice(['Find A and B if `3x + 7 ≡ A(x − 1) + B(x + 2)`.'], ['A = −1/3; B = 10/3']),
  ]),
  section('simultaneous', 'Simultaneous Equations', 'Use the equation with no squared unknowns to replace one letter in the other equation.', [
    worked('A line and a quadratic', 'Solve y = x + 1 and x² + y² = 13.', '(2, 3) and (−3, −2)', [
      ['x² + (x + 1)² = 13', 'Replace y using the linear equation.'], ['2x² + 2x − 12 = 0', 'Multiply out the brackets, then add or subtract matching terms.'], ['x² + x − 6 = 0', 'Divide by 2.'], ['(x + 3)(x − 2) = 0', 'Factorise.'], ['x = −3 or x = 2', 'Set each factor to zero.'], ['When x = −3, y = −2; when x = 2, y = 3', 'Keep each y paired with its own x.'], ['Check: 9 + 4 = 13; 4 + 9 = 13', 'Both pairs work in both original equations.'],
    ]),
    { p: 'You may get two pairs of answers, one pair or no real-number answers. After replacing one letter, use b² − 4ac for the quadratic you get to check how many answers are possible. If you multiply by an expression with x or y in it, check whether that expression can be zero. Check each answer in both starting equations.' },
    practice(['Solve `y = 2x` and `x² + y² = 20`.'], ['(2, 4) and (−2, −4)']),
  ]),
  section('partial-fractions', 'Partial Fractions', 'Write one algebraic fraction as a sum of simpler fractions.', [
    { p: 'First write the bottom expression as factors multiplied together. If the highest power on top is equal to or bigger than the highest power below, divide first. Write a separate fraction for each factor below. Multiply both sides by the full bottom expression to remove the fractions, then find the unknown numbers.' },
    { p: 'A **linear factor** has highest power 1, like x + 1. A **quadratic factor** has highest power 2, like x² + 1. Use a number such as A above a linear factor, but use Ax + B above a quadratic factor that will not split further.' },
    { table: [['Denominator factor', 'Required terms'], ['(x − a)(x − b)', 'A/(x − a) + B/(x − b)'], ['(x − a)²', 'A/(x − a) + B/(x − a)²'], ['x² + 1 (cannot split into real linear factors)', '(Ax + B)/(x² + 1)']] },
    worked('Two different linear factors', 'Express (3x + 5)/[(x + 1)(x + 2)] in partial fractions.', '2/(x + 1) + 1/(x + 2), x ≠ −1,−2', [
      ['A/(x + 1) + B/(x + 2)', 'Put an unknown number above each factor with highest power 1.'], ['3x + 5 = A(x + 2) + B(x + 1)', 'Multiply both sides by (x + 1)(x + 2).'], ['x = −1: 2 = A', 'This removes the B term.'], ['x = −2: −1 = −B, so B = 1', 'This removes the A term.'], ['2/(x + 1) + 1/(x + 2)', 'Put A = 2 and B = 1 into the fractions.'],
    ]),
    { p: 'After multiplying to remove the fractions, both sides are polynomials that are equal for every x. We can now use x = −1 and x = −2 to find A and B. These values are still not allowed in the starting fraction, because they make its bottom zero.' },
    practice(['Split into partial fractions: `5/[(x + 1)(x + 6)]`.'], ['1/(x + 1) − 1/(x + 6); x ≠ −1,−6']),
    exam(PAST.partial),
  ]),
  section('advanced-partial', 'Repeated & Improper Fractions', 'If the same factor appears more than once below the line, include a fraction for each power of it. If the highest power on top is not smaller than the highest power below, divide first.', [
    { p: 'A **linear factor** has highest power 1, like x + 1. A **repeated factor** appears more than once, like (x + 1)². An **irreducible quadratic** has highest power 2 and will not split into real linear factors, like x² + 1.' },
    worked('A repeated linear factor', 'Split into partial fractions: (2x + 3)/[x(x + 1)²].', '3/x − 3/(x + 1) − 1/(x + 1)²', [
      ['A/x + B/(x + 1) + C/(x + 1)²', 'Both powers of x + 1 need their own term.'], ['2x + 3 = A(x + 1)² + Bx(x + 1) + Cx', 'Multiply both sides by x(x + 1)² to remove the fractions.'], ['x = 0: A = 3', 'Remove B and C.'], ['x = −1: 1 = −C, so C = −1', 'Remove A and B.'], ['x² coefficients: A + B = 0', 'Match the numbers beside x² to find B.'], ['B = −3', 'Remember x ≠ 0, −1.'],
    ]),
    worked('A quadratic that will not split into real linear factors', 'Split into partial fractions: (x + 1)/[x(x² + 1)].', '1/x + (−x + 1)/(x² + 1)', [
      ['A/x + (Bx + C)/(x² + 1)', 'Above the x² + 1 factor, use Bx + C, with two unknown numbers.'], ['x + 1 = A(x² + 1) + (Bx + C)x', 'Multiply both sides by x(x² + 1) to remove the fractions.'], ['A = 1, C = 1, A + B = 0', 'Match the terms with no x, then the numbers beside x and x².'], ['B = −1', 'x ≠ 0.'],
    ]),
    { p: 'An **improper algebraic fraction** has a highest power on top that is equal to or bigger than the highest power below. Divide first, until the highest power on top is smaller. Keep the answer from dividing, then split only the fraction that is left into simpler fractions.' },
    practice(['Split into partial fractions: `(x² + 1)/[x(x + 1)]`.'], ['1 + 1/x − 2/(x + 1); x ≠ 0,−1']),
    exam(PAST.improper),
  ]),
  section('inequalities', 'Polynomial Inequalities', 'Find the values where the answer changes sign, then test each part of the number line.', [
    { p: 'An **inequality** compares values using <, >, ≤ or ≥. For example, x < 3 means x is less than 3. x ≤ 3 means x can also equal 3.' },
    { p: 'Move all terms to one side so the other side is zero. Find the values that make the expression zero. Mark them in order on a number line. Test one number in each part of the line. Include the end values when the sign is ≤ or ≥, but leave them out when it is < or >. When you divide by a negative number, turn the sign around: < becomes >, and ≤ becomes ≥.' },
    worked('A quadratic inequality', 'Solve x² − x − 6 ≤ 0.', '−2 ≤ x ≤ 3', [
      ['(x + 2)(x − 3) ≤ 0', 'Factorise.'], ['End values: −2 and 3', 'Set each factor to zero.'], ['At x = −3: the answer is positive', 'Test left of −2.'], ['At x = 0: the answer is negative', 'Test between the roots.'], ['At x = 4: the answer is positive', 'Test right of 3.'], ['−2 ≤ x ≤ 3', 'Choose the part where the answer is negative or zero. Include both end values.'],
    ]),
    { diagram: 'signs', caption: 'Multiplying (x + 2) by (x − 3) gives a negative answer between −2 and 3, and a positive answer outside.' },
    { p: 'For cubics and higher powers, test each part of the number line. A factor such as (x − 1)² has an even power: it has the same sign on both sides of x = 1. The answer is not always the part between two roots.' },
    practice(['Solve `−2x + 3 > 7`.', 'Solve `(x − 1)(x + 4) > 0`.'], ['x < −2', 'x < −4 or x > 1']),
    exam(PAST.quadraticInequality),
  ]),
  section('rational-inequalities', 'Rational Inequalities', 'Check whether the top and bottom are positive or negative in each part of the number line.', [
    { p: 'Find the x values that make the top or bottom zero. Mark them on a number line, then test whether the fraction is positive or negative in each part. Never include a value that makes the bottom zero, even if the question uses ≤ or ≥. Do not multiply by the bottom expression unless you know whether it is positive or negative.' },
    worked('A rational inequality', 'Solve (x − 1)/(x + 2) ≥ 0.', 'x < −2 or x ≥ 1', [
      ['Values to mark on the number line: −2 and 1', 'The denominator is zero at −2; the numerator at 1.'], ['x = −3 gives (−4)/(−1) > 0', 'The fraction is positive to the left of −2.'], ['x = 0 gives (−1)/2 < 0', 'The fraction is negative between −2 and 1.'], ['x = 2 gives 1/4 > 0', 'The fraction is positive to the right of 1.'], ['x < −2 or x ≥ 1', 'Include x = 1 because the fraction is zero there. Leave out x = −2 because division by zero is not allowed.'],
    ]),
    practice(['Solve `x/(x − 2) < 0`.'], ['0 < x < 2']),
    exam(PAST.rationalInequality),
  ]),
  section('functions', 'Functions & Inverses', 'A function is a rule: put in an allowed number and the rule gives one answer.', [
    { p: 'The **domain** means all the input numbers we are allowed to use. The **range** means all the answers the rule can give. `f(3)` means replace x by 3 in the rule. `fg(x)` means `f(g(x))`: use the rule g first, then put its answer into f.' },
    { p: 'A **composite function** means using one function after another. An **inverse function** undoes a rule and takes you back to the input you started with.' },
    worked('A composite function', 'f(x) = 2x + 1 and g(x) = x². Find fg(x) and gf(x).', 'fg(x) = 2x² + 1; gf(x) = (2x + 1)²', [
      ['fg(x) = f(x²) = 2x² + 1', 'Use the output of g as the input of f.'], ['gf(x) = g(2x + 1) = (2x + 1)²', 'Reverse the order; the answer usually changes.'],
    ]),
    { p: 'An inverse undoes a function. Write y = f(x), swap x and y, then solve for y. For an inverse to give one answer, different allowed inputs must give different outputs. This is called **one-to-one**. For example, x² gives 4 for both x = 2 and x = −2. To undo it with one answer, we can allow only x ≥ 0.' },
    worked('Find an inverse', 'f(x) = 3x − 2 for all real x. Find f⁻¹(x).', 'f⁻¹(x) = (x + 2)/3', [
      ['y = 3x − 2', 'Write the original rule.'], ['x = 3y − 2', 'Swap input and output.'], ['y = (x + 2)/3', 'Solve for y.'], ['f(f⁻¹(x)) = x', 'Check that the inverse undoes the original rule.'],
    ]),
    { p: '`f⁻¹(x)` means inverse function; it does not mean `1/f(x)`. When using one function after another, check that x is allowed in the first rule. Then check that its answer is allowed in the second rule.' },
    practice(['If `f(x) = x²`, find `f(−3)`.', 'Find the inverse of `f(x) = 2x + 5`.'], ['9', 'f⁻¹(x) = (x − 5)/2']),
  ]),
  section('exponentials', 'Exponential Functions', 'In an exponential function, x is in the power, as in 2^x.', [
    { p: '`y = a^x`, where a > 0 and a ≠ 1, allows any real number as x, and every answer y is positive. It passes through (0,1) and approaches y = 0 without touching it. It grows when a > 1 and decreases when 0 < a < 1. The number e is about 2.718; `e^x` is the natural exponential.' },
    { diagram: 'exponential', caption: 'y = 2^x passes through (−1, 1/2), (0, 1) and (1, 2). The graph gets closer and closer to the line y = 0.' },
    worked('Exponential growth model', 'A group of cells starts with 200 cells and grows by 10% per hour. Find the count after 3 hours.', '266.2 by the model, about 266 cells', [
      ['Multiplier = 1 + 10/100 = 1.1', 'A 10% increase leaves 110% of the previous amount.'], ['N(t) = 200(1.1)^t', 'Multiply by 1.1 once for each hour.'], ['N(3) = 200(1.1)³ = 266.2', 'The formula gives 266.2, but we count cells in whole numbers, so round to 266.'],
    ]),
    { p: 'For a decrease of r% each time, multiply by `1 − r/100`. When the amount changes all the time, rather than once per year or hour, use `N = N₀e^(kt)`. Here N₀ is the starting amount. If k > 0, the amount grows; if k < 0, it decreases. Use the same time units as the rate: if the rate is per hour, t must be in hours.' },
    practice(['A value of 1000 decreases by 20% per year. Find its value after 2 years.'], ['640']),
    exam(PAST.exponential, PAST.growth),
  ]),
  section('logarithms', 'Logarithms', 'A logarithm answers: what power gives this number?', [
    { p: 'For example, log₂ 8 = 3 because 2³ = 8. We are asking: what power of 2 gives 8? The answer is 3.' },
    { f: 'logₐ b = c means a^c = b' },
    { p: 'Use a > 0, a ≠ 1 and b > 0. `log x` usually means base 10; `ln x` means base e. Logarithms and exponentials undo each other: `ln(e^x) = x` and `e^(ln x) = x` for x > 0.' },
    { table: [['Law (u,v > 0)', 'Rule'], ['logₐ(uv)', 'logₐ u + logₐ v'], ['logₐ(u/v)', 'logₐ u − logₐ v'], ['logₐ(u^r)', 'r logₐ u'], ['Change of base', 'logₐ u = ln u / ln a']] },
    worked('Solve a logarithmic equation', 'Solve ln(x − 1) + ln(x + 1) = ln 8.', 'x = 3', [
      ['Domain: x − 1 > 0 and x + 1 > 0', 'The number inside each log must be greater than zero.'], ['So x > 1', 'Keep the x values that work for both logs.'], ['ln[(x − 1)(x + 1)] = ln 8', 'Adding two logs gives the log of the numbers multiplied together.'], ['x² − 1 = 8', 'Both logs use the same base, so the positive numbers inside them must be equal.'], ['x = ±3', 'Solve the quadratic.'], ['Accept x = 3 only', 'x = −3 makes the numbers inside the logs negative, so it is not allowed.'],
    ]),
    { p: '**Common mistake:** `ln(u + v)` is not `ln u + ln v`. For log inequalities with a base greater than 1, keep the sign pointing the same way. With a base between 0 and 1, turn it around. In both cases, the numbers inside the logs must be greater than zero.' },
    worked('Logarithmic inequality', 'Solve ln(x − 1) < ln 3.', '1 < x < 4', [
      ['x > 1', 'The number inside ln must be greater than zero.'], ['x − 1 < 3', 'ln gives a bigger answer for a bigger positive input, so keep the < sign.'], ['x < 4, so 1 < x < 4', 'Keep only the values that also make x − 1 positive.'],
    ]),
    practice(['Evaluate `log₂ 32`.', 'Solve `3^x = 7` exactly.', 'Solve `log₂(x + 1) ≥ 3`.'], ['5', 'x = ln 7/ln 3', 'x ≥ 7']),
    exam(PAST.log),
  ]),
  section('linearising', 'Making a Straight-Line Graph', 'Use logs to change a curved graph into a straight-line graph. This is called linearising.', [
    { p: 'For `y = Axⁿ` with x,y,A > 0, taking logs gives `ln y = n ln x + ln A`. Put ln y on the up-and-down axis and ln x on the left-to-right axis. The slope, called the gradient, is n. The line crosses the up-and-down axis at ln A. For `y = Ae^(kx)`, put ln y on the up-and-down axis and x on the left-to-right axis. The slope is k, and the line crosses the up-and-down axis at ln A.' },
    worked('Read a model from a straight line', 'A plot of ln y against ln x has gradient 2 and intercept ln 3. Find y in terms of x.', 'y = 3x²', [
      ['ln y = 2 ln x + ln 3', 'Use the straight-line rule: vertical value = slope × horizontal value + starting value.'], ['ln y = ln(x²) + ln 3', 'Use the log rule: 2 ln x = ln(x²).'], ['ln y = ln(3x²)', 'Use the log rule to put the two parts together.'], ['y = 3x²', 'Undo the logarithm.'],
    ]),
    { p: 'The intercept is ln A, not A. If the intercept is c, then A = e^c. With base-10 logs, A = 10^c. Write clearly what each axis shows, so you know what the slope tells you.' },
    practice(['A plot of ln y against x has gradient −0.2 and intercept ln 5. Find the model.'], ['y = 5e^(−0.2x)']),
  ]),
  section('rational-functions', 'Rational Functions & Graphs', 'A rational function has a polynomial above the fraction line and another below it.', [
    { p: 'Leave out every x value that makes the bottom of the starting fraction zero. An **intercept** is where a graph crosses an axis: try x = 0 for the up-and-down axis, and y = 0 for the left-to-right axis. An **asymptote** is a line the graph gets closer and closer to. If you cancel a factor from the bottom, the x value that made that factor zero is still not allowed. It leaves a hole in the graph.' },
    worked('Domain, range and asymptotes', 'For f(x) = 1/(x − 2) + 3, find its domain, range and intercepts.', 'x ≠ 2; y ≠ 3; intercepts (0, 5/2), (5/3, 0)', [
      ['x − 2 ≠ 0, so x ≠ 2', 'The denominator cannot be zero.'], ['Vertical asymptote x = 2', 'As x gets close to 2, the fraction can become very large and positive or very large and negative.'], ['Horizontal asymptote y = 3', 'When x is very far from zero, the fraction gets close to zero.'], ['y ≠ 3', '1/(x − 2) never equals zero.'], ['f(0) = −1/2 + 3 = 5/2', 'Find the y-intercept.'], ['0 = 1/(x − 2) + 3', 'For the x-intercept set y to zero.'], ['x − 2 = −1/3, so x = 5/3', 'Solve, then check that x is allowed in the starting fraction.'],
    ]),
    { diagram: 'rational', caption: 'The June 2020 question uses only the part of y = 2 − 1/x where x > 0. Every answer y is less than 2.' },
    practice(['Find the domain of `(x + 1)/(x² − 9)`.', 'Simplify `(x² − 1)/(x − 1)` and state the restriction.'], ['x ≠ −3,3', 'x + 1, with x ≠ 1; a missing point at (1,2)']),
    exam(PAST.inverse),
  ]),
  section('modulus', 'Modulus Functions', 'The modulus of a number is its distance from zero.', [
    { p: '`|x| = x` when x ≥ 0, and `|x| = −x` when x < 0. A modulus is never negative. The graph of y = |x| is a V. Its corner, called the **vertex**, is at (0,0). For y = |x − a| + b, the corner moves to (a,b).' },
    worked('A modulus equation', 'Solve |2x − 1| = 5.', 'x = 3 or x = −2', [
      ['2x − 1 = 5 or 2x − 1 = −5', 'A distance of 5 can come from +5 or −5.'], ['x = 3 or x = −2', 'Solve both linear equations.'], ['|6 − 1| = 5; |−4 − 1| = 5', 'Check both in the original equation.'],
    ]),
    { p: 'For c > 0, `|u| < c` means `−c < u < c`. `|u| > c` means `u < −c` or `u > c`. If the right side depends on x, check whether it is positive, zero or negative before squaring or working through separate cases.' },
    worked('A modulus inequality', 'Solve |2x − 1| < 5.', '−2 < x < 3', [
      ['−5 < 2x − 1 < 5', 'The value lies within distance 5 of zero.'], ['−4 < 2x < 6', 'Add 1 to all three parts.'], ['−2 < x < 3', 'Divide all three parts by positive 2.'],
    ]),
    { diagram: 'modulus', caption: 'y = 2 − |x| meets y = x/3 + 1 at (−3/2, 1/2) and (3/4, 5/4).' },
    practice(['Solve `|x + 2| = 4`.', 'Solve `|x − 1| ≥ 3`.'], ['x = 2 or x = −6', 'x ≤ −2 or x ≥ 4']),
    exam(PAST.modulus, PAST.intersections),
  ]),
  section('revision', 'Revision & Question Library', 'Try a mixed set, then return to any skill you need to practise.', [
    { h: 'Choose the method' },
    { table: [['Question clue', 'First step'], ['“varies as”', 'Write a formula with an unknown number k'], ['“factor” or “remainder”', 'Use the x value that makes the divisor zero'], ['“equal roots”', 'Set the discriminant to zero'], ['“partial fractions”', 'Check degree, then factor the denominator'], ['“solve an inequality”', 'Find allowed x values and end points; test each part'], ['“exact answer”', 'Keep fractions, surds and logarithms'], ['“inverse”', 'Swap x and y; check that each output comes from one input']] },
    practice(['Evaluate `64^(−2/3)`.', 'y ∝ 1/√x. y = 4 when x = 9. Find y when x = 36.', 'Find the remainder of `x³ + 2x² − x + 4` divided by `x + 2`.', 'Solve `x² − 5x + 6 ≤ 0`.', 'Split into partial fractions: `(3x + 1)/[x(x + 1)]`.', 'Solve `e^(2x) − 5e^x + 6 = 0`.', 'Find the inverse of `f(x) = (x − 1)/2`.', 'Solve `|x + 1| > 2`.'], ['1/16', '2', '6', '2 ≤ x ≤ 3', '1/x + 2/(x + 1); x ≠ 0,−1', 'x = ln 2 or ln 3', 'f⁻¹(x) = 2x + 1', 'x < −3 or x > 1']),
    { c: true },
    { h: 'Mixed practice' },
    { p: 'Try the ten mixed questions below. They use different Algebra skills, and every card includes its worked answer. Click Show me working when you are ready.' },
    { diagram: 'sources' },
    exam(PAST.indices, PAST.exponential, PAST.log, PAST.partial, PAST.rationalInequality, PAST.variation, PAST.square, PAST.quadraticInequality, PAST.factor, PAST.improper, PAST.growth, PAST.modulus, PAST.inverse, PAST.intersections),
  ]),
];
