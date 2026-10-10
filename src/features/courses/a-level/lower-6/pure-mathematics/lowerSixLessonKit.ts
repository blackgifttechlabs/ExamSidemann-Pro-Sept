import type { LessonSection } from '../../../o-level/form-4/mathematics/LessonPage';
import { textTransferScene, type TextMove, type WorkingScene } from './algebraWorkingAnimations';

// Small helpers shared by the Lower 6 lessons written in the same style.
export type Step = [string, string, WorkingScene?];
export const worked = (title: string, problem: string, answer: string, steps: Step[]) => ({
  solver: { title, problem, answer, stepGrid: true, manualStart: false, controlsUnderQuestion: true, steps: steps.map(([text, why, scene]) => ({ text, why, scene })) },
});
export const practice = (questions: string[], answers: string[]) => ({ practice: questions, answers });
/** Each number is matched, in order, to its first unused whole-number place in the source and in the new line. */
export const scene = (source: string, operation: string, pairs: (string | [string, string])[], why: string) => {
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
export const makeSection = (banks: Record<string, unknown[]>, findings: Record<string, string>) =>
  (id: string, title: string, intro: string, lesson: any[]): LessonSection => ({
    id, title, heading: title, intro,
    lesson: [...lesson.filter(block => !block.exam && !block.c), { c: true }, { exam: banks[id], title: '', examFindings: findings[id] }],
  });
