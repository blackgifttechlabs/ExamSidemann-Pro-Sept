import practiceBank from './geometryPracticeBank.json';
import { textTransferScene, type TextMove, type WorkingScene } from './algebraWorkingAnimations';

export type GeometryQuestion = {
  level: string; topic: string; lines: string[]; solution: string[]; skill: string; manualStart: boolean; stepGrid: boolean;
  kind: 'practice'; workingSteps: { text: string; scene?: WorkingScene }[];
};
type Entry = { topic: string; lines: string[]; solution: string[]; skill: string; manualStart: boolean; stepGrid: boolean; level: string;
  anim: [number, string, string, TextMove[], string][] };
const rank: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

// Practice questions are generated and checked by scripts/generateLower6GeometryPractice.py.
// Steps that have an animation show the numbers travelling from the question into the calculation.
export const GEOMETRY_QUESTION_BANKS: Record<string, GeometryQuestion[]> = Object.fromEntries(
  Object.entries(practiceBank as unknown as Record<string, Entry[]>).map(([id, items]) => {
    if (items.length !== 10) throw new Error(`Expected 10 questions for ${id}.`);
    const questions = items.map(({ anim, ...question }): GeometryQuestion => {
      const scenes = new Map(anim.map(([step, source, operation, moves, why]) => [step - 1, textTransferScene(source, operation, moves, why)]));
      return { ...question, kind: 'practice', workingSteps: question.solution.map((text, index) => ({ text, scene: scenes.get(index) })) };
    });
    return [id, questions.sort((a, b) => rank[a.level] - rank[b.level])];
  }),
);

export const GEOMETRY_FINDINGS: Record<string, string> = {
  distance: 'Questions at this level often start with distances, midpoints and gradients, then use the results in a longer problem about a triangle or a line. These ten are practice questions, ordered from Easy to Hard. They are not copied from past papers.',
  lines: 'A line is usually found from a gradient and a point, or from two points. Exams also ask for the answer in a set form, such as ax + by + c = 0 with whole numbers. These ten practice questions include that form.',
  perp: 'Perpendicular bisectors and perpendicular lines are common building blocks. The method is always: find a gradient, change it if needed, then use a point. Practice questions below; none is a copied past-paper question.',
  circle: 'A circle question often gives a general equation. Complete the squares, read off the centre and radius, then use them. Diameter-end questions are also common. These ten are practice questions.',
  'circle-line': 'Tangent and normal questions combine the circle with straight lines. Substitution and the discriminant decide whether a line cuts, touches or misses a circle. These ten are practice questions.',
  vectors: 'Vector questions at this level use the i, j, k form. Be ready to find a size, a unit vector, or a missing number that makes vectors parallel. These ten are practice questions.',
  position: 'Position vectors lead to AB = b − a, midpoints, ratios and proofs that points lie on one line. Draw the points first. These ten are practice questions.',
  scalar: 'The scalar product is used for angles and to test for perpendicular vectors. Remember that a negative cosine means an angle larger than 90°. These ten are practice questions.',
  vline: 'Write a line as a point plus a multiple of a direction. Then you can test points, convert to Cartesian form and compare directions. These ten are practice questions.',
  lintersect: 'To decide whether two lines meet, solve for λ and μ from two components, then test the third. If it fails, the lines are skew. These ten are practice questions.',
  mixed: 'This mixed set brings together coordinate geometry and vectors. Choose the method from the clue in the question. All ten are practice questions; the difficulty labels are our teaching guide, not official grades.',
};
