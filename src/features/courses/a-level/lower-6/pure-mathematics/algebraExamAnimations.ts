import { textTransferScene, type TextMove, type WorkingScene } from './algebraWorkingAnimations';

type Entry = [step: number, source: string, calculation: string, moves: (string | TextMove)[], why: string];
// Step numbers are one-based and refer to the checked teaching solution.
// Every movement is authored from actual terms; new results are pen-written.
const plans: Record<string, Entry[]> = {
  'Fractional indices': [
    [2, 'x^(1/3) − 3x^(−1/3) = 2', 'y − 3/y = 2', [{from:'x^(1/3)',to:'y'},{from:'3x^(−1/3)',to:'3/y'}], 'Call the cube root y. The negative power becomes 1/y, so the second term is 3/y.'],
    [3, 'y − 3/y = 2', 'y² − 3 = 2y', ['3','2'], 'Multiply every term by y. The y below the fraction line cancels.'],
    [6, 'y = 3 or y = −1', 'x = 3³ or x = (−1)³', ['3','−1'], 'We set y equal to the cube root of x. Cube each y value to get x.'],
  ],
  'Fractional and negative powers': [
    [2, '(x²)^(1/3)(x^(−1/2))³', 'x^(2/3) × x^(−3/2)', [{from:'(x²)^(1/3)',to:'x^(2/3)'},{from:'(x^(−1/2))³',to:'x^(−3/2)'}], 'Multiply the powers in each bracket, then add the two powers above the line.'],
    [4, 'x^(−5/6)/x^(−5/6)', 'x^(−5/6 − (−5/6)) = x⁰', [{from:'x^(−5/6)/x^(−5/6)',to:'x^(−5/6 − (−5/6))'}], 'Division means subtract the bottom power. A minus followed by a minus gives a plus.'],
  ],
  'Inverse variation with a cube root': [
    [2, 'M = k/∛(n − 1); M = 5, n = 9', '5 = k/∛(9 − 1) = k/2', ['5','9'], 'Put the given M and n into their places. The cube root of 8 is 2.'],
    [5, '25 = 10/∛(n − 1)', '∛(n − 1) = 10/25 = 2/5', ['10','25'], 'Multiply by the cube root, then divide by 25.'],
    [7, 'n − 1 = 8/125', 'n = 8/125 + 1 = 133/125', ['8/125'], 'Add 1 to both sides. Write 1 as 125/125 to add the fractions.'],
  ],
  'Joint variation with roots': [
    [1, 'Y = k√x/z³; Y = 16, x = 9, z = 1/2', '16 = k√9/(1/2)³ = 24k', ['16','9','1/2'], 'Put each given value into its place. √9 is 3 and (1/2)³ is 1/8.'],
    [2, '16 = 24k', 'k = 16/24 = 2/3', ['16','24'], 'Divide both sides by 24. Reduce the fraction to 2/3.'],
    [4, '2.5 = 20/z³', 'z³ = 20/2.5 = 8', ['20','2.5'], 'Multiply by z³, divide by 2.5, then take the cube root of 8.'],
  ],
  'Complete the square and solve': [
    [2, '2(x² + 3x/2) + 1', '2[(x + 3/4)² − 9/16] + 1', ['2','1'], 'Half of 3/2 is 3/4. Add its square inside the bracket and subtract the same square.'],
    [5, '2(x + 3/4)² − 1/8 = 0', '2(x + 3/4)² = 1/8', [{from:'1/8'}], 'Add 1/8 to both sides. Its value stays the same.'],
  ],
  'Square form and a quadratic inequality': [
    [1, '6x² − 24x − 25', '6(x² − 4x) − 25', ['6','25'], 'Take 6 out of the two x terms. 24 divided by 6 gives 4.'],
    [3, '6(x − 2)² − 49 > 0', '6(x − 2)² > 49', ['49'], 'Add 49 to both sides. Then divide by the positive number 6.'],
  ],
  'Factor and remainder theorems': [
    [1, 'P(x) = 2x³ − 11x² + ax + b; x = 2', 'P(2) = 2(2)³ − 11(2)² + 2a + b = 0', [{from:'2',fromOccurrence:1,toOccurrence:2},'11'], 'A factor x − 2 means P(2) is zero. Put 2 into each x place.'],
    [5, '2a + b = 28; −a + b = −23', '3a = 28 − (−23) = 51', ['28','−23'], 'Subtract the second equation from the first. The two b terms cancel.'],
    [6, '2a + b = 28; a = 17', 'b = 28 − 2 × 17 = −6', ['28','17'], 'Use a = 17 in the first equation to find b.'],
  ],
  'Three linear factors': [
    [5, '2x = A(x − 2)(x − 1) + B(x + 2)(x − 1) + C(x + 2)(x − 2); x = −2', '−4 = 12A; A = −4/12 = −1/3', ['A'], 'Put x = −2. Terms with x + 2 become zero, leaving just the A term.'],
    [6, '2x = A(x − 2)(x − 1) + B(x + 2)(x − 1) + C(x + 2)(x − 2); x = 2', '4 = 4B; B = 1', ['B'], 'Put x = 2. The A and C terms become zero.'],
    [7, '2x = A(x − 2)(x − 1) + B(x + 2)(x − 1) + C(x + 2)(x − 2); x = 1', '2 = −3C; C = −2/3', ['C'], 'Put x = 1. The A and B terms become zero.'],
  ],
  'Improper partial fractions': [
    [3, 'x³/(x² − 5x + 6)', 'x + 5 + (19x − 30)/(x² − 5x + 6)', ['x² − 5x + 6'], 'Divide first because the top degree is larger. Keep the remainder above the original bottom.'],
    [5, '19x − 30 = C(x − 3) + D(x − 2); x = 2', '8 = −C; C = −8', ['C'], 'Put x = 2. The D term is zero, and x − 3 becomes −1.'],
    [6, '19x − 30 = C(x − 3) + D(x − 2); x = 3', '27 = D', ['D'], 'Put x = 3. The C term is zero, and x − 2 becomes 1.'],
  ],
  'A rational inequality': [
    [1, '2x/[(x + 2)(x − 2)(x − 1)] < 0', 'x + 2 = 0; x − 2 = 0; x − 1 = 0; 2x = 0', ['x + 2','x − 2','x − 1','2x'], 'Find where each factor is zero. These values split the number line into parts.'],
  ],
  'Quadratic in an exponential': [
    [2, '2e^(2x) − 7e^x + 6 = 0; u = e^x', '2u² − 7u + 6 = 0', [{from:'e^(2x)',to:'u²'},{from:'e^x',to:'u',toOccurrence:1}], 'e^(2x) is (e^x)². Replace e^x by u and its square by u².'],
    [5, 'u = 3/2 or u = 2; u = e^x', 'x = ln(3/2) or x = ln 2', ['3/2',{from:'2',fromOccurrence:1,toOccurrence:1}], 'Take natural logs of both positive u values to find x.'],
  ],
  'Logs after rearranging': [
    [2, '(2^x + 1)/(2^x − 1) = 5', '2^x + 1 = 5(2^x − 1)', ['2^x − 1','5'], 'Multiply both sides by the whole bottom of the fraction.'],
    [5, '2^x = 3/2', 'x = ln(3/2)/ln 2', ['3/2'], 'Take logs, then divide by ln 2 to get x on its own.'],
  ],
  'Population growth': [
    [2, 'P(0) = 500000; each year multiply by 1.05', 'P(n) = 500000(1.05)^n', ['500000','1.05'], 'Start with 500000 and multiply by 1.05 once for each year.'],
    [5, '(1.05)^n > 2', 'n > ln 2/ln 1.05', ['1.05','2'], 'Take natural logs. ln 1.05 is positive, so division keeps the inequality pointing the same way.'],
  ],
  'Modulus inequality (2024)': [
    [2, '3|x − 2| > |2x − 1|', '9(x − 2)² > (2x − 1)²', ['x − 2','2x − 1'], 'Both sides are non-negative. Square the whole of each side; the 3 becomes 9.'],
    [4, '5x² − 32x + 35 > 0', '(5x − 7)(x − 5) > 0', ['5'], 'Factor the quadratic. Its product is positive outside the two roots.'],
  ],
  'Modulus inequality': [
    [2, '|x − 3| > 2|3x + 1|', '(x − 3)² > 4(3x + 1)²', ['x − 3','3x + 1'], 'Both sides are non-negative. Square the whole of each side, including the 2.'],
    [5, '7x² + 6x − 1 < 0', '(7x − 1)(x + 1) < 0', ['7'], 'Factor the quadratic. Its product is negative between the two roots.'],
  ],
  'Rational function and inverse': [
    [3, 'y = 2 − 1/x', '2 − y = 1/x; x = 1/(2 − y)', ['2'], 'Add 1/x and subtract y on both sides. Then solve for x.'],
    [7, '2 − 1/x = 1/(2 − x)', '(2x − 1)(2 − x) = x', ['2 − x'], 'Both bottoms are non-zero in the shared domain. Multiply by x(2 − x).'],
  ],
  'Modulus graphs and intersections': [
    [4, '2 − x = x/3 + 1', '6 − 3x = x + 3; 4x = 3; x = 3/4', [{from:'x/3',to:'x'}], 'Multiply the full equation by 3, then collect the x terms.'],
    [6, '2 + x = x/3 + 1', '6 + 3x = x + 3; 2x = −3; x = −3/2', ['2'], 'For negative x, |x| = −x. Solve this branch and check x is negative.'],
  ],
  'Three different factors': [
    [4, '3 − x + 6x² = A(x + 2)(1 + 2x) + B(1 − x)(1 + 2x) + C(1 − x)(x + 2); x = 1', '8 = 9A; A = 8/9', ['A'], 'Put x = 1. Both terms containing 1 − x become zero.'],
    [5, '3 − x + 6x² = A(x + 2)(1 + 2x) + B(1 − x)(1 + 2x) + C(1 − x)(x + 2); x = −2', '29 = −9B; B = −29/9', ['B'], 'Put x = −2. Both terms containing x + 2 become zero.'],
    [6, '3 − x + 6x² = A(x + 2)(1 + 2x) + B(1 − x)(1 + 2x) + C(1 − x)(x + 2); x = −1/2', '5 = (9/4)C; C = 20/9', ['C'], 'Put x = −1/2. Both terms containing 1 + 2x become zero.'],
  ],
  'Division, coefficients and factors': [
    [2, '(x⁴ + 3x³ + 0x² + ax + 3)/(x² − x + 1)', 'x² + 4x + 3 + (a − 1)x/(x² − x + 1)', ['x² − x + 1'], 'Long division gives x² + 4x + 3. Keep the remainder (a − 1)x over the original divisor.'],
    [4, '(a − 1)x = 0 for every x', 'a − 1 = 0; a = 1', ['a'], 'The remainder must be the zero polynomial because the divisor is a factor.'],
    [5, 'x² + 4x + 3', '(x + 1)(x + 3)', ['3'], 'Find two numbers with product 3 and sum 4: 1 and 3.'],
  ],
  'An inverse on a limited domain': [
    [1, 'y = x² − 6x + 8', 'y = (x − 3)² − 1', ['y'], 'Half of −6 is −3. Add and subtract 9 to complete the square.'],
    [3, 'y + 1 = (x − 3)²; x − 3 ≤ 0', 'x = 3 − √(y + 1)', ['y + 1'], 'Use the negative square root because the given x values make x − 3 non-positive.'],
  ],
  'A straight line from exponential data': [
    [1, 'y = ab^(−x)', 'ln y = ln a − x ln b', ['a','b'], 'Logs turn the product into a sum and bring the power −x down in front.'],
    [4, '(x, ln y): (1, ln 4), (3, ln 16)', 'gradient = (ln 16 − ln 4)/(3 − 1) = ln 2', ['ln 16','ln 4','3',{from:'1',toOccurrence:1}], 'Take change in vertical value divided by change in horizontal value.'],
  ],
  'Read constants from a log graph': [
    [2, 'ln y = ln a + bx; (x, ln y) = (0, ln 2)', 'ln 2 = ln a + b × 0; a = 2', ['ln 2','0'], 'At x = 0 the bx term is zero. The vertical intercept is ln a.'],
    [3, '(x, ln y): (0, ln 2), (3, ln 5)', 'b = (ln 5 − ln 2)/(3 − 0)', ['ln 5','ln 2','3','0'], 'The gradient is b. Use both points to find change in height divided by change in x.'],
  ],
  'A repeated denominator factor': [
    [4, '2x − 3 = Ax(x² − 4) + B(x² − 4) + Cx²(x + 2) + Dx²(x − 2); x = 0', '−3 = −4B; B = 3/4', ['B'], 'Put x = 0. Every term with an outside x becomes zero, leaving B.'],
    [5, '2x − 3 = Ax(x² − 4) + B(x² − 4) + Cx²(x + 2) + Dx²(x − 2); x = 2', '1 = 16C; C = 1/16', ['C'], 'Put x = 2. Only the C term remains.'],
    [6, '2x − 3 = Ax(x² − 4) + B(x² − 4) + Cx²(x + 2) + Dx²(x − 2); x = −2', '−7 = −16D; D = 7/16', ['D'], 'Put x = −2. Only the D term remains.'],
  ],
  'An exponential and its inverse power': [
    [1, 'e^(2x) + e^(−2x) = 5', 'u + 1/u = 5; u = e^(2x)', [{from:'e^(2x)',to:'u'},{from:'e^(−2x)',to:'1/u'}], 'Call e^(2x) u. The negative power gives 1/u.'],
    [2, 'u + 1/u = 5', 'u² + 1 = 5u; u² − 5u + 1 = 0', ['5'], 'Multiply every term by the positive number u to remove the fraction.'],
  ],
  'A square and a linear expression': [
    [1, '(x − 3)² > 2x + 1', 'x² − 6x + 9 > 2x + 1', ['2x + 1'], 'Multiply (x − 3) by itself. Keep the other side unchanged.'],
    [2, 'x² − 6x + 9 > 2x + 1', 'x² − 8x + 8 > 0', ['x²'], 'Subtract 2x and 1 from both sides, then collect matching terms.'],
  ],
  'Square form and the turning point': [
    [1, 'x² + 6x + 5', '6/2 = 3; 3² = 9', ['6'], 'Half the coefficient of x, then square the result.'],
    [2, 'x² + 6x + 5', '(x + 3)² − 9 + 5', ['5'], 'The square adds 9, so subtract 9 as well to keep the same value.'],
  ],
  'Range using a square or the discriminant': [
    [2, 'y = 1/(x² + 6x + 5)', 'yx² + 6yx + 5y − 1 = 0', ['y'], 'Multiply by the non-zero bottom and bring 1 to the left. Treat this as a quadratic in x.'],
    [4, 'yx² + 6yx + (5y − 1) = 0', 'D = (6y)² − 4y(5y − 1)', ['6y','5y − 1'], 'Use a = y, b = 6y, c = 5y − 1 in b² − 4ac.'],
  ],
  'An inverse of a quadratic rule': [
    [1, 'y = x² + 2x', 'y = (x + 1)² − 1', ['y'], 'Half of 2 is 1. Add and subtract 1 to complete the square.'],
    [3, 'y + 1 = (x + 1)²; x + 1 ≥ 0', 'x = −1 + √(y + 1)', ['y + 1'], 'Use the positive square root because the given domain makes x + 1 non-negative.'],
  ],
  'A line and a rational curve': [
    [2, 'y = 10 − 5/x; y = 6 − x', '6 − x = 10 − 5/x', ['6 − x','10 − 5/x'], 'Both rules give the same y where the line and curve meet. Set them equal.'],
    [3, '6 − x = 10 − 5/x', '6x − x² = 10x − 5', ['6','10','5'], 'Multiply the whole equation by x, which is non-zero.'],
  ],
};
export function examWorkingSteps(question: { topic: string; solution: string[]; kind?: string; skill?: string }) {
  const scenes = new Map<number, { scene: WorkingScene }>();
  if (question.kind === 'past-paper') {
    const key = question.topic === 'Modulus inequality' && question.skill?.includes('November 2024') ? 'Modulus inequality (2024)' : question.topic;
    for (const [step, source, operation, moves, why] of plans[key] ?? []) {
      scenes.set(step - 1, { scene: textTransferScene(source, operation, moves.map(move => typeof move === 'string' ? { from: move } : move), why) });
    }
  }
  return question.solution.map((text, index) => ({ text, scene: scenes.get(index)?.scene }));
}
