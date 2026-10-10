import type { LessonSection } from '../../../o-level/form-4/mathematics/LessonPage';
import { GEOMETRY_QUESTION_BANKS, GEOMETRY_FINDINGS } from './geometryQuestionBanks';
import { textTransferScene, type TextMove, type WorkingScene } from './algebraWorkingAnimations';

// Form 5 Geometry and Vectors: original explanations and worked examples.
// Scope is described in SOURCES.md. Practice questions are generated and checked by
// scripts/generateLower6GeometryPractice.py.
type Step = [string, string, WorkingScene?];
const worked = (title: string, problem: string, answer: string, steps: Step[]) => ({
  solver: { title, problem, answer, stepGrid: true, manualStart: false, controlsUnderQuestion: true, steps: steps.map(([text, why, scene]) => ({ text, why, scene })) },
});
const practice = (questions: string[], answers: string[]) => ({ practice: questions, answers });
/** Each number is matched, in order, to its first unused whole-number place in the source and in the new line. */
const scene = (source: string, operation: string, pairs: (string | [string, string])[], why: string) => {
  const used = { source: [] as [number, number][], operation: [] as [number, number][] };
  const place = (text: string, value: string, claimed: [number, number][]) => {
    let at = -1, occurrence = -1;
    for (;;) {
      at = text.indexOf(value, at + 1); if (at < 0) throw new Error(`Cannot place ${value} in ${text}`);
      occurrence++;
      const before = text[at - 1] ?? ' ', after = text[at + value.length] ?? ' ';
      const whole = !/[0-9.]/.test(before) && !(/[0-9]/.test(value[0]) && before === '−') && !/[0-9.]/.test(after);
      if (whole && claimed.every(([a, b]) => at + value.length <= a || at >= b)) { claimed.push([at, at + value.length]); return occurrence; }
    }
  };
  const moves: TextMove[] = pairs.map(pair => {
    const [from, to] = typeof pair === 'string' ? [pair, pair] : pair;
    return { from, to, fromOccurrence: place(source, from, used.source), toOccurrence: place(operation, to, used.operation) };
  });
  return textTransferScene(source, operation, moves, why);
};
const section = (id: string, title: string, intro: string, lesson: any[]): LessonSection => ({
  id, title, heading: title, intro,
  lesson: [
    ...lesson.filter(block => !block.exam && !block.c),
    { c: true }, { exam: GEOMETRY_QUESTION_BANKS[id], title: '', examFindings: GEOMETRY_FINDINGS[id] },
  ],
});

export const GEOMETRY_SECTIONS: LessonSection[] = [
  section('distance', 'Distance, Midpoint & Gradient', 'Coordinate geometry uses numbers to describe shapes. We start with three tools: the distance between two points, the midpoint of a line, and the gradient.', [
    { p: 'A point is written as `(x, y)`. The first number, the **x-coordinate**, tells us how far across to go. The second, the **y-coordinate**, tells us how far up or down. The **origin** is `(0, 0)`. Two points, A and B, are joined by a straight line segment AB.' },
    { h: 'Distance between two points' },
    { p: 'To find how far A(x₁, y₁) is from B(x₂, y₂), draw a right-angled triangle with AB as the longest side. The across side has length `x₂ − x₁` and the up side has length `y₂ − y₁`. Pythagoras\' theorem gives the rule below.' },
    { diagram: 'distance', caption: 'From A(1, 2) to B(4, 6): across 3, up 4. Since 3² + 4² = 25, the distance is 5.' },
    { f: 'd = √[(x₂ − x₁)² + (y₂ − y₁)²]' },
    worked('Distance with negative coordinates', 'Find the distance between A(−2, 3) and B(4, −5).', 'AB = 10', [
      ['d² = (4 − (−2))² + (−5 − 3)²', 'Take B minus A for the x values and for the y values. Keep brackets round negative numbers.', scene('A(−2, 3), B(4, −5)', 'd² = (4 − (−2))² + (−5 − 3)²', ['4', '−2', '−5', '3'], 'Put the x values in the first bracket and the y values in the second. B comes first in each.')],
      ['d² = 6² + (−8)² = 36 + 64 = 100', 'A negative number squared is positive.'],
      ['d = √100 = 10', 'Take the positive square root, because a distance is never negative.'],
    ]),
    { p: '**Tip:** work out d² first. If d² is not a perfect square, leave the answer as a surd, such as `√50 = 5√2`.' },
    { h: 'Midpoint of a line' },
    { p: 'The **midpoint** is halfway between A and B. Its x-coordinate is the average of the two x-coordinates, and its y-coordinate is the average of the two y-coordinates.' },
    { f: 'M = ((x₁ + x₂)/2, (y₁ + y₂)/2)' },
    worked('Finding an end point', 'M(2, −1) is the midpoint of AB. A is (5, 3). Find B.', 'B(−1, −5)', [
      ['(5 + x)/2 = 2', 'The x-coordinate of M is the average of the x values of A and B.'],
      ['5 + x = 4, so x = −1', 'Multiply both sides by 2, then subtract 5.'],
      ['(3 + y)/2 = −1, so 3 + y = −2 and y = −5', 'Do the same for the y values.'],
      ['B = (−1, −5)', 'Check: the average of 5 and −1 is 2, and the average of 3 and −5 is −1.'],
    ]),
    { h: 'Gradient' },
    { p: 'The **gradient** m measures how steep a line is: how far it rises for each step across. If the line goes up as you move right, m is positive. If it goes down, m is negative.' },
    { f: 'm = (y₂ − y₁)/(x₂ − x₁)' },
    { diagram: 'gradient', caption: 'On y = 2x − 1, moving 2 across takes you 4 up, so the gradient is 4/2 = 2.' },
    { table: [['Line', 'Gradient'], ['Goes up to the right', 'Positive'], ['Goes down to the right', 'Negative'], ['Horizontal, y = c', '0'], ['Vertical, x = c', 'Not defined']] },
    worked('Gradient from two points', 'Find the gradient of the line through P(−1, 4) and Q(3, −2).', 'm = −3/2', [
      ['m = (−2 − 4)/(3 − (−1))', 'Subtract the y values on top and the x values below, in the same order.', scene('P(−1, 4), Q(3, −2)', 'm = (−2 − 4)/(3 − (−1))', ['−2', '4', '3', '−1'], 'Q comes first on top and on the bottom. Both use the same order.')],
      ['m = −6/4 = −3/2', 'Divide top and bottom by 2.'],
    ]),
    { p: '**Common mistake:** do not mix the order. `(y₂ − y₁)/(x₁ − x₂)` has the wrong sign. The gradient of a line also tells its angle: `m = tan θ`, where θ is the angle the line makes with the positive x axis. So a gradient of 1 means 45°.' },
    practice(['Find the distance between (1, 1) and (7, 9).', 'Find the midpoint of (−3, 2) and (5, 8).', 'Find the gradient through (2, 7) and (6, 3).'], ['10', '(1, 5)', '−1']),
  ]),
  section('lines', 'Equations of Straight Lines', 'Every straight line has an equation. It lets us find any point on the line and compare lines.', [
    { p: 'An equation of a line is true for every point on the line, and false for any point off it. There are three common ways to write it. You will need to move between them.' },
    { table: [['Form', 'Use it when you know'], ['y = mx + c', 'The gradient m and where the line meets the y axis (0, c)'], ['y − y₁ = m(x − x₁)', 'The gradient and one point (x₁, y₁)'], ['ax + by + c = 0', 'The answer must have whole-number coefficients']] },
    { p: 'The best all-purpose form is `y − y₁ = m(x − x₁)`. It comes from the gradient rule: the gradient between (x₁, y₁) and any point (x, y) on the line is `(y − y₁)/(x − x₁) = m`. Multiply both sides by `x − x₁`.' },
    worked('A point and a gradient', 'Find the equation of the line through (2, 5) with gradient 3.', 'y = 3x − 1', [
      ['y − 5 = 3(x − 2)', 'Put x₁ = 2, y₁ = 5 and m = 3 into y − y₁ = m(x − x₁).', scene('(2, 5), m = 3', 'y − 5 = 3(x − 2)', ['5', '3', '2'], 'The point gives y₁ and x₁. The gradient gives m.')],
      ['y − 5 = 3x − 6', 'Expand the bracket.'],
      ['y = 3x − 1', 'Add 5 to both sides.'],
    ]),
    { h: 'A line through two points' },
    { p: 'First find the gradient from the two points. Then use either point in `y − y₁ = m(x − x₁)`. Using the other point gives the same line.' },
    worked('Two points', 'Find the line through A(1, 3) and B(4, 9).', 'y = 2x + 1', [
      ['m = (9 − 3)/(4 − 1) = 6/3 = 2', 'Gradient first.'],
      ['y − 3 = 2(x − 1)', 'Use A. Check with B: 9 − 3 = 2(4 − 1) is 6 = 6.'],
      ['y = 2x + 1', 'Expand and simplify.'],
    ]),
    { h: 'Changing the form' },
    worked('General form', 'Write y = 2x/3 − 4 as ax + by + c = 0 with whole numbers.', '2x − 3y − 12 = 0', [
      ['3y = 2x − 12', 'Multiply every term by 3 to clear the fraction.'],
      ['0 = 2x − 3y − 12', 'Move every term to one side.'],
      ['2x − 3y − 12 = 0', 'The coefficients 2, −3 and −12 are whole numbers. It is usual to make the x coefficient positive.'],
    ]),
    { p: 'To find where a line meets the axes, put `x = 0` for the y intercept and `y = 0` for the x intercept. To find where two lines meet, solve their equations together.' },
    worked('Where two lines meet', 'Find the point where y = x + 1 and 2x + y = 7 meet.', '(2, 3)', [
      ['2x + (x + 1) = 7', 'Replace y in the second equation by x + 1.'],
      ['3x = 6, so x = 2', 'Collect the x terms and solve.'],
      ['y = 2 + 1 = 3', 'Put x = 2 in the first equation.'],
      ['(2, 3)', 'Check in 2x + y = 7: 4 + 3 = 7.'],
    ]),
    practice(['Find the line through (0, 4) with gradient −2.', 'Find the line through (−1, 1) and (3, 9).', 'Where does 3x + 4y = 24 meet the axes?'], ['y = −2x + 4', 'y = 2x + 3', '(0, 6) and (8, 0)']),
  ]),
  section('perp', 'Parallel & Perpendicular Lines', 'Gradients tell us at a glance whether two lines are parallel or meet at a right angle.', [
    { p: '**Parallel** lines never meet, because they slope the same way by the same amount. So parallel lines have equal gradients: `m₁ = m₂`.' },
    { p: '**Perpendicular** lines meet at 90°. Their gradients multiply to −1: `m₁ × m₂ = −1`. Equivalently, `m₂ = −1/m₁`: turn the fraction upside down and change the sign.' },
    { diagram: 'perpendicular', caption: 'These lines cross at a right angle. Their gradients are 2 and −1/2, and 2 × (−1/2) = −1.' },
    { p: '**Why?** A line with gradient m goes across 1 and up m. Turn that step through 90° anticlockwise: it now goes across −m and up 1. That is a gradient of `1/(−m) = −1/m`.' },
    { table: [['If the gradient is', 'A parallel line has', 'A perpendicular line has'], ['3', '3', '−1/3'], ['−2/5', '−2/5', '5/2'], ['−1', '−1', '1']] },
    worked('Parallel and perpendicular', 'Line L is 4x − 2y = 5. Find the parallel line through (3, 2) and the perpendicular line through (0, 3).', 'Parallel: y = 2x − 4. Perpendicular: y = −x/2 + 3', [
      ['−2y = −4x + 5, so y = 2x − 5/2', 'Make y the subject to read the gradient.'],
      ['m = 2', 'The gradient of L.'],
      ['Parallel: y − 2 = 2(x − 3), so y = 2x − 4', 'Same gradient, through (3, 2).'],
      ['Perpendicular gradient = −1/2', 'Turn 2 upside down and change the sign.'],
      ['y − 3 = −1/2(x − 0), so y = −x/2 + 3', 'Through (0, 3).'],
    ]),
    { h: 'Perpendicular bisector' },
    { p: 'The **perpendicular bisector** of AB is the line that cuts AB in half at a right angle. Every point on it is the same distance from A and from B. To find it: (1) find the midpoint, (2) find the gradient of AB, (3) use the perpendicular gradient through the midpoint.' },
    worked('Perpendicular bisector', 'Find the perpendicular bisector of P(2, −1) and Q(6, 5).', '2x + 3y − 14 = 0', [
      ['Midpoint = ((2 + 6)/2, (−1 + 5)/2) = (4, 2)', 'The bisector passes through the midpoint.'],
      ['Gradient PQ = (5 − (−1))/(6 − 2) = 6/4 = 3/2', 'We need the gradient of PQ.'],
      ['Perpendicular gradient = −2/3', 'Turn 3/2 upside down and change the sign.'],
      ['y − 2 = −2/3(x − 4)', 'Use the midpoint.'],
      ['3y − 6 = −2x + 8, so 2x + 3y − 14 = 0', 'Multiply by 3 and collect terms.'],
    ]),
    { p: '**Common mistake:** a vertical line (gradient not defined) is perpendicular to a horizontal line (gradient 0). The rule `m₁m₂ = −1` does not apply there, so check for these two cases first.' },
    practice(['Is `y = 3x + 1` perpendicular to `x + 3y = 6`?', 'Find the line through (1, 2) parallel to `2x + y = 5`.'], ['Yes: 3 × (−1/3) = −1', 'y = −2x + 4']),
  ]),
  section('circle', 'Equation of a Circle', 'A circle is all the points that are the same distance from one point, the centre.', [
    { p: 'The **centre** is the fixed point. The **radius** r is the distance from the centre to the circle. A **diameter** passes through the centre and is twice the radius. Use the distance rule: a point (x, y) is on the circle when its distance from the centre (a, b) equals r.' },
    { f: '(x − a)² + (y − b)² = r²' },
    { diagram: 'circle', caption: 'Centre (3, −2) and radius 4 give (x − 3)² + (y + 2)² = 16. Notice that y + 2 means b = −2.' },
    { p: 'Take care with signs: the centre is `(a, b)` in `(x − a)² + (y − b)²`. So `(x + 2)²` means a = −2. If the centre is the origin, the equation is `x² + y² = r²`.' },
    worked('Equation from centre and radius', 'Find the equation of the circle with centre (−2, 3) and radius 5.', '(x + 2)² + (y − 3)² = 25', [
      ['a = −2, b = 3, r² = 25', 'Read off the centre and square the radius.'],
      ['(x − (−2))² + (y − 3)² = 25', 'Put them into the formula.'],
      ['(x + 2)² + (y − 3)² = 25', 'Subtracting −2 is adding 2.'],
    ]),
    { h: 'The general form' },
    { p: 'If you expand the circle equation, you get `x² + y² + 2gx + 2fy + c = 0`. The x² and y² have the same coefficient. To find the centre and radius, **complete the square** on x and on y. Alternatively, use these results: centre `(−g, −f)` and radius `r = √(g² + f² − c)`.' },
    worked('Complete the squares', 'Find the centre and radius of x² + y² + 6x − 4y − 12 = 0.', 'Centre (−3, 2), radius 5', [
      ['(x² + 6x) + (y² − 4y) = 12', 'Group x terms and y terms. Move the constant to the right.'],
      ['(x + 3)² − 9 + (y − 2)² − 4 = 12', 'Half of 6 is 3, and half of −4 is −2. Subtract the extra squares.', scene('(x² + 6x) + (y² − 4y) = 12', '(x + 3)² − 9 + (y − 2)² − 4 = 12', [['6', '3'], ['4', '2']], 'Half the coefficient of x is 3. Half the coefficient of y is −2. Their squares are added and then taken away again.')],
      ['(x + 3)² + (y − 2)² = 25', 'Add 9 and 4 to both sides: 12 + 9 + 4 = 25.'],
      ['Centre (−3, 2); radius = √25 = 5', 'Read the centre from the brackets; r² is on the right.'],
    ]),
    { p: '**Check:** if the right side is zero, the "circle" is a single point. If it is negative, there is no circle at all.' },
    { h: 'Circle on a diameter' },
    worked('Ends of a diameter', 'A(1, 2) and B(7, 10) are the ends of a diameter. Find the circle.', '(x − 4)² + (y − 6)² = 25', [
      ['Centre = midpoint of AB = (4, 6)', 'The centre is halfway along a diameter.'],
      ['r² = (1 − 4)² + (2 − 6)² = 9 + 16 = 25', 'The radius is the distance from the centre to A.'],
      ['(x − 4)² + (y − 6)² = 25', 'Substitute into the formula.'],
    ]),
    practice(['Write the circle with centre (1, −1) and radius 3.', 'Find the centre and radius of `x² + y² − 2x + 6y − 6 = 0`.'], ['(x − 1)² + (y + 1)² = 9', 'Centre (1, −3); radius 4']),
  ]),
  section('circle-line', 'Circles & Lines', 'Lines and circles can cut, touch or miss each other. Algebra tells us which.', [
    { p: 'A **tangent** touches the circle at exactly one point. A **normal** to the circle at a point is the line at right angles to the tangent there. Key fact: the **tangent is perpendicular to the radius** at the point of contact. This means the normal passes through the centre.' },
    { diagram: 'tangent', caption: 'On x² + y² = 25, the radius OP has gradient 4/3. The tangent at P(3, 4) has gradient −3/4.' },
    worked('Tangent at a point', 'Find the tangent to x² + y² = 20 at P(2, 4).', 'x + 2y = 10', [
      ['2² + 4² = 20', 'Check that P is on the circle.'],
      ['Gradient of OP = 4/2 = 2', 'The centre is the origin.'],
      ['Tangent gradient = −1/2', 'The tangent is perpendicular to the radius.'],
      ['y − 4 = −1/2(x − 2)', 'Use the point P.'],
      ['2y − 8 = −x + 2, so x + 2y = 10', 'Multiply by 2 and collect.'],
    ]),
    { h: 'Where a line meets a circle' },
    { p: 'Replace y in the circle equation using the line. This gives a quadratic equation in x. The **discriminant** `b² − 4ac` tells us how many meeting points there are.' },
    { table: [['Discriminant', 'Number of points', 'Meaning'], ['b² − 4ac > 0', 'Two', 'The line cuts the circle'], ['b² − 4ac = 0', 'One', 'The line is a tangent'], ['b² − 4ac < 0', 'None', 'The line misses the circle']] },
    worked('Line meets circle', 'Find where y = x + 1 meets x² + y² = 13.', '(2, 3) and (−3, −2)', [
      ['x² + (x + 1)² = 13', 'Replace y by x + 1.'],
      ['2x² + 2x − 12 = 0, so x² + x − 6 = 0', 'Expand, collect and divide by 2.'],
      ['(x − 2)(x + 3) = 0, so x = 2 or x = −3', 'Factorise.'],
      ['y = 3 or y = −2', 'Use y = x + 1 for each x.'],
      ['(2, 3) and (−3, −2)', 'Check in the circle: 4 + 9 = 13 and 9 + 4 = 13.'],
    ]),
    worked('A tangent condition', 'For what values of k is y = 2x + k a tangent to x² + y² = 5?', 'k = 5 or k = −5', [
      ['x² + (2x + k)² = 5', 'Replace y.'],
      ['5x² + 4kx + (k² − 5) = 0', 'Expand and collect.'],
      ['(4k)² − 4(5)(k² − 5) = 0', 'A tangent touches once, so the discriminant is zero.'],
      ['16k² − 20k² + 100 = 0, so k² = 25', 'Simplify.'],
      ['k = 5 or k = −5', 'There are two tangents with this gradient, one on each side of the circle.'],
    ]),
    { h: 'Length of a tangent' },
    { p: 'From an outside point T, draw the tangent to the point of contact P and the line from T to the centre C. Since CP ⟂ TP, Pythagoras gives `TP² = CT² − r²`.' },
    worked('Tangent length', 'T(7, 9). Circle: (x − 1)² + (y − 1)² = 4. Find the tangent length from T.', '4√6', [
      ['Centre C(1, 1); r = 2', 'Read from the equation.'],
      ['CT² = (7 − 1)² + (9 − 1)² = 36 + 64 = 100', 'Distance from T to the centre, squared.'],
      ['TP² = 100 − 4 = 96', 'Subtract r².'],
      ['TP = √96 = 4√6', 'Simplify the surd.'],
    ]),
    practice(['Is the point (4, 3) on `x² + y² = 25`? Find the tangent there.', 'How many points does `y = x + 5` share with `x² + y² = 9`?'], ['Yes; 4x + 3y = 25', 'None: the discriminant is negative']),
  ]),
  section('vectors', 'Vectors in 2D & 3D', 'A vector has size and direction. A scalar has size only.', [
    { p: 'A **scalar** is just a number, such as a time or a mass. A **vector** has a size and a direction, such as a velocity or a force. A vector from A to B is written **AB** (arrow notation). A single vector can also be written as a bold letter such as **a**, or an underlined a.' },
    { p: 'In **component form** we use unit vectors: **i** is 1 unit along the x axis, **j** is 1 unit along the y axis, and **k** is 1 unit along the z axis. In three dimensions, the point (x, y, z) has the position vector `xi + yj + zk`. In this lesson, i, j and k are written in plain letters.' },
    { diagram: 'vectors2d', caption: 'a = 4i + j and b = i + 3j. Adding the components gives a + b = 5i + 4j, the diagonal of the parallelogram.' },
    { p: 'Add or subtract vectors by adding or subtracting the matching components. A **scalar multiple** `λa` multiplies every component by λ. If λ is negative, the direction reverses.' },
    worked('Adding and scaling', 'a = 2i + j − 3k and b = i − 4j + k. Find a + b and 2a − b.', 'a + b = 3i − 3j − 2k; 2a − b = 3i + 6j − 7k', [
      ['a + b: i: 2 + 1 = 3; j: 1 − 4 = −3; k: −3 + 1 = −2', 'Match i with i, j with j and k with k.', scene('a = (2, 1, −3); b = (1, −4, 1)', 'i: 2 + 1 = 3; j: 1 + (−4) = −3; k: −3 + 1 = −2', ['2', '1', '1', '−4', '−3', '1'], 'Pair the i parts, the j parts and the k parts, then add each pair.')],
      ['2a = 4i + 2j − 6k', 'Multiply each component by 2.'],
      ['2a − b: i: 4 − 1 = 3; j: 2 − (−4) = 6; k: −6 − 1 = −7', 'Subtract matching components.'],
    ]),
    { h: 'Magnitude and unit vectors' },
    { p: 'The **magnitude** (size) of `a = xi + yj + zk` is `|a| = √(x² + y² + z²)`. This is Pythagoras\' theorem in two or three dimensions. A **unit vector** has magnitude 1. To make one in the direction of a, divide a by its magnitude: `â = a/|a|`.' },
    worked('A unit vector', 'Find the unit vector in the direction of 2i − 3j + 6k.', '(2i − 3j + 6k)/7', [
      ['|a| = √(2² + (−3)² + 6²)', 'Square each component.', scene('a = (2, −3, 6)', '|a| = √(2² + (−3)² + 6²)', ['2', '−3', '6'], 'Every component is squared, then the squares are added.')],
      ['|a| = √(4 + 9 + 36) = √49 = 7', 'Add, then take the square root.'],
      ['â = (2i − 3j + 6k)/7 = 2i/7 − 3j/7 + 6k/7', 'Divide every component by 7. Check: (2/7)² + (3/7)² + (6/7)² = 49/49 = 1.'],
    ]),
    { h: 'Parallel vectors' },
    { p: 'Two vectors are **parallel** if one is a multiple of the other: `b = λa`. Compare components to find λ.' },
    worked('Finding unknowns', 'a = 2i − 4j + 6k and b = pi + 2j + qk are parallel. Find p and q.', 'p = −1, q = −3', [
      ['b = λa', 'Parallel vectors are multiples of each other.'],
      ['j: 2 = −4λ, so λ = −1/2', 'The j components have no unknown, so they give λ.'],
      ['p = λ × 2 = −1', 'Compare the i components.'],
      ['q = λ × 6 = −3', 'Compare the k components.'],
    ]),
    practice(['Find `|3i − 4j + 12k|`.', 'Find the unit vector in the direction of `3i + 4j`.'], ['13', '(3i + 4j)/5']),
  ]),
  section('position', 'Position Vectors & Ratios', 'A position vector shows where a point is, measured from the origin O.', [
    { p: 'The **position vector** of a point A is **OA**, the vector from the origin to A. If A is the point (2, 5, −1), then `OA = 2i + 5j − k`. We often write a for OA and b for OB.' },
    { p: 'To go from A to B, travel back to O and then out to B: `AB = AO + OB = −a + b = b − a`. Remember it as **"end minus start"**.' },
    { diagram: 'position', caption: 'AB = b − a. Point P is one third of the way from A to B, so it divides AB in the ratio 1 : 2.' },
    worked('Vector and distance', 'OA = 2i + j and OB = 6i + 9j. Find AB and |AB|.', 'AB = 4i + 8j; |AB| = 4√5', [
      ['AB = OB − OA = (6i + 9j) − (2i + j)', 'End minus start.', scene('OA = 2i + j; OB = 6i + 9j', 'AB = (6i + 9j) − (2i + j)', ['6i + 9j', '2i + j'], 'B comes first, then A is taken away.')],
      ['AB = 4i + 8j', 'Subtract matching components.'],
      ['|AB| = √(16 + 64) = √80 = 4√5', 'The distance between A and B.'],
    ]),
    { h: 'Midpoints and ratios' },
    { p: 'The midpoint M of AB has position vector `OM = (a + b)/2`. For a point P that divides AB in the ratio `m : n` (so AP : PB = m : n), P is `m/(m + n)` of the way from A to B.' },
    { f: 'OP = (n·a + m·b)/(m + n)' },
    worked('Dividing in a ratio', 'OA = 2i + j and OB = 6i + 9j. P divides AB in the ratio 3 : 1. Find OP.', 'OP = 5i + 7j', [
      ['m = 3, n = 1, m + n = 4', 'AP : PB = 3 : 1, so P is 3/4 of the way from A to B.'],
      ['OP = (1(2i + j) + 3(6i + 9j))/4', 'Use OP = (n·a + m·b)/(m + n). The ratio part nearest A multiplies b.'],
      ['OP = (20i + 28j)/4 = 5i + 7j', 'Add, then divide by 4. Check: AP = 3i + 6j is 3/4 of AB = 4i + 8j.'],
    ]),
    { h: 'Collinear points and parallelograms' },
    { p: 'Points are **collinear** if they lie on one line. To prove it, show that AB and BC are parallel (one is a multiple of the other). They share the point B, so all three points are on one line. In a parallelogram ABCD, opposite sides are equal and parallel, so `AB = DC` and `AD = BC`.' },
    worked('Collinear points', 'Show A(1, 2, −1), B(4, 3, 2) and C(10, 5, 8) are collinear.', 'BC = 2AB', [
      ['AB = (3, 1, 3)', 'B minus A.'],
      ['BC = (6, 2, 6)', 'C minus B.'],
      ['BC = 2AB', 'Every component of BC is twice the matching one in AB.'],
      ['AB ∥ BC and B is common, so A, B, C are collinear', 'In fact AB : BC = 1 : 2, so B divides AC in the ratio 1 : 2.'],
    ]),
    practice(['A(1, 4), B(7, 1). Find the midpoint of AB.', 'A(0, 0), B(10, 5). P divides AB in the ratio 2 : 3. Find OP.'], ['(4, 5/2)', '(4, 2)']),
  ]),
  section('scalar', 'The Scalar Product', 'The scalar product multiplies two vectors and gives a single number. It helps us find angles.', [
    { p: 'The **scalar product** (dot product) of a and b has two equivalent forms. The first uses the angle θ between the vectors when both start at the same point. The second uses components.' },
    { f: 'a · b = |a||b| cos θ = a₁b₁ + a₂b₂ + a₃b₃' },
    { diagram: 'scalar', caption: 'The angle θ is measured between the two vectors, both starting at O. Here a · b = 4(1) + 1(3) = 7.' },
    { table: [['Value of a · b', 'Angle θ'], ['Positive', 'Acute (less than 90°)'], ['Zero', 'Exactly 90°: the vectors are perpendicular'], ['Negative', 'Obtuse (more than 90°)']] },
    { p: 'Useful facts: `a · b = b · a`; `a · a = |a|²`; and `i · i = 1`, `i · j = 0`. Careful: the answer is a **number**, not a vector. Never write a · b as a vector.' },
    worked('Working out a scalar product', 'Find a · b when a = 2i − j + 3k and b = i + 4j − k.', 'a · b = −5', [
      ['a · b = (2)(1) + (−1)(4) + (3)(−1)', 'Multiply matching components.', scene('a = (2, −1, 3); b = (1, 4, −1)', '(2)(1) + (−1)(4) + (3)(−1)', ['2', '1', '−1', '4', '3', '−1'], 'Pair the i parts, the j parts and the k parts. Multiply each pair.')],
      ['= 2 − 4 − 3 = −5', 'Add the three products.'],
    ]),
    { h: 'The angle between two vectors' },
    { p: 'Rearranging the first form gives `cos θ = (a · b)/(|a||b|)`. Find the three numbers, work out the cosine, then use inverse cos on your calculator.' },
    worked('Finding an angle', 'Find the angle between a = 2i + 2j − k and b = 6i + 3j + 2k.', 'θ = 40.4°', [
      ['a · b = 12 + 6 − 2 = 16', 'Multiply matching components and add.'],
      ['|a| = √(4 + 4 + 1) = 3 and |b| = √(36 + 9 + 4) = 7', 'Magnitudes of each vector.'],
      ['cos θ = 16/(3 × 7) = 16/21', 'Put the numbers into the formula.', scene('a · b = 16; |a| = 3; |b| = 7', 'cos θ = 16/(3 × 7)', ['16', '3', '7'], 'The scalar product goes on top. The two magnitudes are multiplied below.')],
      ['θ = cos⁻¹(16/21) = 40.4° (1 d.p.)', 'Use the inverse cosine. Check that your calculator is in degree mode.'],
    ]),
    { h: 'Perpendicular vectors' },
    { p: 'If two non-zero vectors are perpendicular, `cos 90° = 0`, so `a · b = 0`. Use this to find an unknown.' },
    worked('Find an unknown', 'a = 3i + pj + 2k and b = pi − 2j + k are perpendicular. Find p.', 'p = −2', [
      ['a · b = 0', 'Perpendicular vectors have zero scalar product.'],
      ['3p + p(−2) + 2(1) = 0', 'Multiply matching components.'],
      ['p + 2 = 0, so p = −2', 'Collect the p terms: 3p − 2p = p.'],
    ]),
    { p: '**Angle in a triangle:** to find angle ABC, use the vectors BA and BC, both starting at B. A common mistake is to use AB instead of BA, which gives the supplementary angle.' },
    practice(['Find `(i + 2j + 3k) · (4i − j + k)`.', 'Show that `2i + j` and `i − 2j` are perpendicular.'], ['5', '2(1) + 1(−2) = 0']),
  ]),
  section('vline', 'Vector Equation of a Line', 'A line in vector form says: start at a point, then move along a direction.', [
    { p: 'A line through the point A with position vector **a**, in the direction of **d**, has the vector equation below. **r** is the position vector of any point on the line. The number λ (lambda) is a **parameter**: each value of λ gives one point.' },
    { f: 'r = a + λd' },
    { diagram: 'vline', caption: 'r = (1, 1) + λ(2, 1). Each step of λ = 1 moves 2 across and 1 up.' },
    { p: 'The direction **d** can be any multiple of the true direction. Also, a can be any point on the line. So the same line has many correct equations. If the question gives two points A and B, the direction is `AB = b − a`.' },
    worked('Line through two points', 'Find a vector equation of the line through A(1, −2, 4) and B(3, 1, −2).', 'r = (1, −2, 4) + λ(2, 3, −6)', [
      ['d = AB = (3 − 1, 1 − (−2), −2 − 4) = (2, 3, −6)', 'End minus start gives the direction.'],
      ['r = (1, −2, 4) + λ(2, 3, −6)', 'Use A as the starting point.'],
    ]),
    { h: 'Is a point on the line?' },
    { p: 'Put the point equal to `a + λd` and solve for λ from each component. If every component gives the same λ, the point is on the line. If not, it is not.' },
    worked('Testing a point', 'Does C(5, 4, −8) lie on the line above?', 'Yes, at λ = 2', [
      ['x: 1 + 2λ = 5, so λ = 2', 'Use the first component.'],
      ['y: −2 + 3λ = 4, so λ = 2', 'The second component gives the same λ.'],
      ['z: 4 − 6λ = −8, so λ = 2', 'The third component also gives λ = 2.'],
      ['All three agree, so C is on the line', 'If one had disagreed, C would not be on the line.'],
    ]),
    { h: 'Cartesian form' },
    { p: 'From `x = x₀ + λd₁`, `y = y₀ + λd₂`, `z = z₀ + λd₃`, make λ the subject of each. The line in **Cartesian form** is `(x − x₀)/d₁ = (y − y₀)/d₂ = (z − z₀)/d₃`. If a direction component is 0, that coordinate is fixed, for example `z = 5`.' },
    worked('Cartesian form', 'Write r = (1, −2, 4) + λ(2, 3, −6) in Cartesian form.', '(x − 1)/2 = (y + 2)/3 = (z − 4)/(−6)', [
      ['x = 1 + 2λ, y = −2 + 3λ, z = 4 − 6λ', 'Write the three component equations.'],
      ['λ = (x − 1)/2, λ = (y + 2)/3, λ = (z − 4)/(−6)', 'Make λ the subject of each.'],
      ['(x − 1)/2 = (y + 2)/3 = (z − 4)/(−6)', 'They all equal λ, so they equal each other.'],
    ]),
    { p: '**Angle between two lines:** use the angle between their direction vectors. If cos θ is negative, give the acute angle, which is `180° − θ` (or use the positive value of the dot product).' },
    practice(['Find a vector equation of the line through (2, 0) with direction i + 3j.', 'Does (4, 6) lie on `r = (2, 0) + λ(1, 3)`?'], ['r = 2i + λ(i + 3j)', 'Yes: λ = 2 in both components']),
  ]),
  section('lintersect', 'Intersecting & Skew Lines', 'Two lines in three dimensions can cross, run parallel, or pass each other without meeting.', [
    { p: 'In two dimensions two lines that are not parallel always meet. In three dimensions they might not. Lines that are **not parallel and never meet** are called **skew** lines.' },
    { diagram: 'skew', caption: 'l₁ runs along the y direction at height 0. l₂ runs along the x direction at height 3. They are not parallel and never meet.' },
    { table: [['Directions', 'Do they share a point?', 'The lines are'], ['Parallel', 'Yes', 'The same line'], ['Parallel', 'No', 'Parallel and different'], ['Not parallel', 'Yes', 'Intersecting'], ['Not parallel', 'No', 'Skew']] },
    { h: 'Method' },
    { p: '1. Write each line with a different parameter: λ for the first line and μ for the second. 2. Put the i, j and k components equal. 3. Solve any two equations for λ and μ. 4. Test the third equation. If it works, the lines meet, and you substitute λ (or μ) to find the point. If it fails, the lines are skew.' },
    worked('Lines that meet', 'l₁: r = (1, 0, 2) + λ(1, 1, −1) and l₂: r = (0, 1, −1) + μ(3, 1, 1). Show that they meet and find the point.', '(3, 2, 0)', [
      ['i: 1 + λ = 3μ;  j: λ = 1 + μ;  k: 2 − λ = −1 + μ', 'Put each component equal.'],
      ['1 + (1 + μ) = 3μ, so 2 = 2μ and μ = 1', 'Replace λ in the first equation using the second.'],
      ['λ = 1 + 1 = 2', 'Find λ.'],
      ['k: 2 − 2 = 0 and −1 + 1 = 0', 'The third equation works, so the lines meet.'],
      ['Point: (1 + 2, 0 + 2, 2 − 2) = (3, 2, 0)', 'Put λ = 2 in l₁.'],
    ]),
    worked('Skew lines', 'l₁ as above and l₂: r = (0, 1, 0) + μ(3, 1, 1). Show that they are skew.', 'Skew', [
      ['Directions (1, 1, −1) and (3, 1, 1) are not multiples', 'The lines are not parallel.'],
      ['i: 1 + λ = 3μ;  j: λ = 1 + μ gives μ = 1 and λ = 2', 'Solve the first two equations.'],
      ['k: 2 − 2 = 0 but 0 + 1 = 1', 'The third equation fails, because 0 is not 1.'],
      ['The lines do not meet and are not parallel: skew', 'Conclusion.'],
    ]),
    { h: 'Distance from a point to a line' },
    { p: 'Let F be the foot of the perpendicular from P to the line. F is a general point `a + λd`. Then `PF = F − P` depends on λ. The shortest distance has PF perpendicular to the line, so `PF · d = 0`. Solve for λ and find |PF|.' },
    worked('Shortest distance', 'Find the shortest distance from P(3, 1, 5) to the line r = (0, 1, 2) + λ(1, 2, 2).', '3', [
      ['F = (λ, 1 + 2λ, 2 + 2λ)', 'A general point on the line.'],
      ['PF = (λ − 3, 2λ, 2λ − 3)', 'F minus P.'],
      ['PF · d = (λ − 3) + 4λ + 2(2λ − 3) = 0', 'The shortest distance is perpendicular to d = (1, 2, 2).'],
      ['9λ − 9 = 0, so λ = 1', 'Collect terms and solve.'],
      ['F = (1, 3, 4); PF = (−2, 2, −1)', 'Put λ = 1 in F and in PF.'],
      ['|PF| = √(4 + 4 + 1) = 3', 'This is the shortest distance.'],
    ]),
    { p: '**Angle between lines that meet:** use the direction vectors. For l₁ and l₂ above, `cos θ = (3 + 1 − 1)/(√3 × √11) = 3/√33`, so `θ = 58.5°`.' },
    practice(['Do `r = (0, 0, 0) + λ(1, 1, 1)` and `r = (1, 0, 1) + μ(0, 1, 1)` meet?', 'Are `(2, 4, 6)` and `(−1, −2, −3)` directions of parallel lines?'], ['No: they are skew', 'Yes: the first is −2 times the second']),
  ]),
  section('mixed', 'Revision & Question Library', 'Choose the right method, then try a mixed set.', [
    { h: 'Choose the method' },
    { table: [['Question clue', 'First step'], ['“distance between”', 'd² = (Δx)² + (Δy)², then square root'], ['“perpendicular bisector”', 'Midpoint, then the perpendicular gradient'], ['“tangent to a circle”', 'Radius gradient, then the perpendicular gradient'], ['“line meets circle”', 'Substitute and solve; check the discriminant'], ['“divides in the ratio”', 'OP = (n·a + m·b)/(m + n)'], ['“angle between”', 'cos θ = (a · b)/(|a||b|)'], ['“perpendicular vectors”', 'a · b = 0'], ['“do the lines meet”', 'Equate components; test the third'], ['“shortest distance” to a line', 'Perpendicular: PF · d = 0']] },
    practice(['Find the distance between (−1, 2) and (4, 14).', 'Find the equation of the circle with diameter ends (0, 0) and (6, 8).', 'Find the unit vector in the direction of `2i + 2j − k`.', 'Find the angle between `i + j` and `i + 2j`.'], ['13', '(x − 3)² + (y − 4)² = 25', '(2i + 2j − k)/3', '18.4°']),
    { c: true },
    { h: 'Mixed practice' },
    { p: 'Try the ten mixed questions below. They use different skills from this topic. Every card includes a worked answer. Click Show me working when you are ready.' },
    { diagram: 'sources' },
  ]),
];
