import { examWorkingSteps } from './algebraExamAnimations';
import type { WorkingScene } from './algebraWorkingAnimations';
import practiceCandidates from './algebraPracticeBank.json';
import { PAST, PAPER_SOURCES } from './algebraPastPapers';
import { PAPER_2024_QUESTIONS as N, SOURCES_2024 } from './algebra2024Papers';

export type AlgebraQuestion = {
  level: string; topic: string; lines: string[]; solution: string[]; skill: string;
  workingSteps?: { text: string; scene?: WorkingScene }[]; manualStart: boolean; stepGrid: boolean; sourceUrl?: string; kind?: 'past-paper' | 'practice';
};
const old = (question: (typeof PAST)[keyof typeof PAST]): AlgebraQuestion => ({
  ...question, manualStart: true, stepGrid: true, kind: 'past-paper',
  sourceUrl: question.skill.includes('June 2020') ? PAPER_SOURCES.j20 : PAPER_SOURCES.n21,
});
const curveLine: AlgebraQuestion = {
  level: 'Hard', topic: 'A line and a rational curve', stepGrid: true, manualStart: true, kind: 'past-paper',
  lines: ['Find the points where `y = 10 − 5/x` and `y + x = 6` meet.'],
  sourceUrl: PAPER_SOURCES.n21,
  skill: 'Verified ZIMSEC question: November 2021, Pure Mathematics 6042/1, Q13(a). Original scan checked; wording shortened.',
  solution: ['x ≠ 0. The line gives y = 6 − x.', '6 − x = 10 − 5/x.', 'Multiply by x: 6x − x² = 10x − 5.', 'x² + 4x − 5 = (x − 1)(x + 5) = 0.', 'x = 1 or −5. Find the matching y from the line.', 'Answer: (1,5) and (−5,11). Both work in both original rules.'],
};
const verified: Record<string, AlgebraQuestion[]> = {
  indices: [N.indices], 'rational-indices': [old(PAST.indices), N.indices],
  'direct-inverse': [old(PAST.variation)], 'joint-partial': [N.joint],
  polynomials: [N.quartic], division: [N.quartic], 'factor-remainder': [old(PAST.factor), N.quartic],
  quadratics: [old(PAST.square), { ...N.square, level: 'Medium' }], discriminant: [N.range], identities: [N.quartic],
  simultaneous: [curveLine], 'partial-fractions': [old(PAST.partial), N.partial],
  'advanced-partial': [old(PAST.improper), N.repeated], inequalities: [old(PAST.quadraticInequality), N.inequality],
  'rational-inequalities': [old(PAST.rationalInequality)],
  functions: [old(PAST.inverse), N.function, N.inverse],
  exponentials: [old(PAST.exponential), old(PAST.growth), N.exponential], logarithms: [old(PAST.log)],
  linearising: [N.line, N.dataLine], 'rational-functions': [old(PAST.inverse), N.range],
  modulus: [old(PAST.modulus), old(PAST.intersections), N.modulus],
  revision: [N.joint, N.partial, N.line],
};
const simpleLevel = (level: string) => level === 'Easy' ? 'Easy' : level === 'Hard' || level.includes('Hard') ? 'Hard' : 'Medium';
const rank: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
export const ALGEBRA_QUESTION_BANKS: Record<string, AlgebraQuestion[]> = Object.fromEntries(
  Object.entries(practiceCandidates).map(([id, candidates]) => {
    const real = (verified[id] ?? []).map(question => ({ ...question, kind: 'past-paper' as const, level: simpleLevel(question.level) }));
    const practice = candidates.slice(0, 10 - real.length).map(question => ({ ...question, kind: 'practice' as const }));
    const items = [...practice, ...real].sort((a, b) => rank[a.level] - rank[b.level]);
    if (items.length !== 10) throw new Error(`Expected 10 questions for ${id}.`);
    return [id, items.map(question => ({ ...question, workingSteps: examWorkingSteps(question) }))];
  }),
);

export const ALGEBRA_PAPER_FINDINGS: Record<string, string> = {
  indices: 'November 2024 Q1 combines multiplication, division, powers of powers and negative fractional powers. Use the basic laws together; a short rule can be one part of a longer exam question.',
  'rational-indices': 'June 2020 Q1 asks learners to solve an equation using a cube-root substitution. November 2024 Q1 tests fractional powers in a fraction. Both questions are included below.',
  'direct-inverse': 'November 2021 Q4 uses inverse variation with a cube root, asks for a formula, then asks for an exact value. Find the constant first.',
  'joint-partial': 'November 2024 Q3 combines direct variation as a square root with inverse variation as a cube. That joint-variation question is verified below. No standalone fixed-plus-changing partial-variation question was found in these four checked papers; those questions below are labelled practice.',
  polynomials: 'November 2024 Q5 gives a quartic polynomial with a missing coefficient and a quadratic factor. Finding the coefficient and multiplying or dividing polynomials are part of the same question.',
  division: 'November 2024 Q5 is an exact-division question with a quadratic divisor. The remainder must be zero. The verified card below shows the division used to find the missing coefficient.',
  'factor-remainder': 'June 2020 Q11 uses both a factor and a non-zero remainder to find two coefficients. November 2024 Q5 uses a quadratic factor. Both are included below.',
  quadratics: 'November 2021 Q5 asks for square form and then the roots. June 2024 Q9(a,b) asks for square form and the turning point. Do not round exact fractions or square roots unless asked.',
  discriminant: 'June 2024 Q9(c) asks for the range of a rational function. Its worked answer below uses the discriminant to decide which y values allow real x. This is a verified use of the method; no standalone equal-roots parameter question was found in the four checked papers.',
  identities: 'November 2024 Q5 can be solved by matching coefficients in a polynomial identity after writing the given factor. The original question is included below. It is not a standalone prove-an-identity question; the other cards practise that skill directly.',
  simultaneous: 'November 2021 Q13(a) asks where a line and a rational curve meet. Replacing y using the line leads to a quadratic equation. Both matching pairs must be found and checked.',
  'partial-fractions': 'November 2021 Q11(a) and November 2024 Q4 both ask for partial fractions with three different linear factors. The original questions are included below, with their excluded x values.',
  'advanced-partial': 'June 2020 Q12(a) has an improper fraction, so divide first. June 2024 Q3 has a repeated x factor, so both A/x and B/x² are needed. Both questions are included below.',
  inequalities: 'June 2020 Q3 uses a completed square to solve a quadratic inequality. June 2024 Q5 compares a square with a linear expression. Keep the answer exact and check whether the end values are included.',
  'rational-inequalities': 'November 2021 Q11(b) asks for the negative parts of a rational expression with three denominator factors. Mark numerator and denominator zeros, then test every part of the number line.',
  functions: 'June 2020 Q8, June 2024 Q11(a)(ii) and November 2024 Q11(a,b) ask for inverses. Their domain limits decide which square-root sign is allowed and which inputs the inverse can use.',
  exponentials: 'November 2021 Q1 and June 2024 Q4 become quadratics after a suitable substitution. June 2020 Q7 uses population growth and asks for the first whole year above a target.',
  logarithms: 'November 2021 Q8(a) asks for an exponential equation answer to three significant figures. Logs are needed after rearranging. Its original question is below; the other cards also practise log input restrictions.',
  linearising: 'June 2024 Q2 gives two points on an (x, ln y) line and asks for exact constants. November 2024 Q16 gives a data table for y = ab^(−x) and asks for a straight-line graph and estimated constants.',
  'rational-functions': 'June 2020 Q8 combines a rational graph, range and inverse. June 2024 Q9(c) asks for the full range of a reciprocal quadratic. Do not include denominator zeros or y = 0 when it cannot be reached.',
  modulus: 'November 2021 Q8(b) and November 2024 Q6 ask for modulus inequalities. November 2021 Q10 asks for graph intersections. Check both parts of the modulus rule and the signs of the two sides.',
  revision: 'This mixed set brings together the skills in the checked papers. Three cards are verified 2024 questions; the other seven are labelled practice. Difficulty labels are our teaching guide, not official ZIMSEC grades.',
};
export const CHECKED_PAPER_LINKS = [
  { title: 'June 2020 Paper 1', url: PAPER_SOURCES.j20 },
  { title: 'November 2021 Paper 1', url: PAPER_SOURCES.n21 },
  { title: 'June 2024 Paper 1', url: SOURCES_2024.j24 },
  { title: 'November 2024 Paper 1', url: SOURCES_2024.n24 },
];
