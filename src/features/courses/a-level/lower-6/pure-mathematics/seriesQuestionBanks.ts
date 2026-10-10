import practiceBank from './seriesPracticeBank.json';
import { textTransferScene, type TextMove, type WorkingScene } from './algebraWorkingAnimations';

export type SeriesQuestion = {
  level: string; topic: string; lines: string[]; solution: string[]; skill: string; manualStart: boolean; stepGrid: boolean;
  kind: 'practice'; workingSteps: { text: string; scene?: WorkingScene }[];
};
type Entry = { topic: string; lines: string[]; solution: string[]; skill: string; manualStart: boolean; stepGrid: boolean; level: string;
  anim: [number, string, string, TextMove[], string][] };
const rank: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };

// Practice questions are generated and checked by scripts/generateLower6SeriesPractice.py.
// Steps that have an animation show the numbers travelling from the question into the calculation.
export const SERIES_QUESTION_BANKS: Record<string, SeriesQuestion[]> = Object.fromEntries(
  Object.entries(practiceBank as unknown as Record<string, Entry[]>).map(([id, items]) => {
    if (items.length !== 10) throw new Error(`Expected 10 questions for ${id}.`);
    const questions = items.map(({ anim, ...question }): SeriesQuestion => {
      const scenes = new Map(anim.map(([step, source, operation, moves, why]) => [step - 1, textTransferScene(source, operation, moves, why)]));
      return { ...question, kind: 'practice', workingSteps: question.solution.map((text, index) => ({ text, scene: scenes.get(index) })) };
    });
    return [id, questions.sort((a, b) => rank[a.level] - rank[b.level])];
  }),
);

export const SERIES_FINDINGS: Record<string, string> = {
  sequences: 'Sequence questions ask for terms from a formula or a recurrence, a formula from a pattern, or a proof that a sequence is increasing. These ten are practice questions, ordered from Easy to Hard. They are not copied from past papers.',
  ap: 'Arithmetic progression questions usually give two pieces of information, such as two terms or a term and a sum. Write one equation for each, then solve. These ten are practice questions.',
  gp: 'Geometric progression questions involve a ratio, a sum, or a growth or decay story such as interest. Logs help when the unknown is a power. These ten are practice questions.',
  suminf: 'A sum to infinity only exists when |r| < 1. Recurring decimals, a given sum, and the condition on x are the usual setups. These ten are practice questions.',
  sigma: 'Sigma questions use the standard results for Σr, Σr² and Σr³ to find a formula or evaluate a sum. Split the term, apply each result, then factorise. These ten are practice questions.',
  differences: 'The method of differences starts with partial fractions. Write out the first and last few terms and see what cancels. These ten are practice questions.',
  binomint: 'For a positive whole-number power, use the coefficients from Pascal\'s triangle or ⁿCᵣ. Questions ask for expansions, a single coefficient, or a term independent of x. These ten are practice questions.',
  binomrat: 'For other powers, the series goes on for ever and is only valid for a range of x. Take out any constant first so that you have (1 + u)ⁿ. These ten are practice questions.',
  recurrence: 'A recurrence gives each term from the one before. If it converges, the limit L satisfies L = f(L). These ten are practice questions.',
  mixed: 'This mixed set brings together progressions, sums, the binomial series and recurrences. Choose the method from the clue in the question. All ten are practice questions; the difficulty labels are our teaching guide, not official grades.',
};
