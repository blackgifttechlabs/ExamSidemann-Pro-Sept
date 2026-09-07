export type MonsterOperation = "addition" | "subtraction";
export const MONSTER_INTROS = {
  addition: "[excited] Welcome to the monster picnic! Two groups of little monsters are joining the party. Count them all, then tap the answer!",
  subtraction: "[playful] Welcome to the monster hide-and-seek! Some monsters hide. Count the monsters still here, then tap the answer!",
};
export const MONSTER_FEEDBACK = {
  correct: "[cheers] Yes! You counted the monsters! Fantastic!",
  retry: "[warmly] Let's count the little monsters again. Have another go!",
  finished: "[happy laugh] Hooray! You finished the monster challenge. You are a maths star!",
};
const pairs = {
  addition: [[1, 1], [2, 1], [2, 2], [3, 2], [4, 2], [3, 4], [5, 3], [5, 5]],
  subtraction: [[2, 1], [3, 1], [4, 2], [5, 2], [5, 5], [7, 3], [8, 2], [10, 3]],
};
export const monsterRounds = (operation: MonsterOperation) => pairs[operation].map(([a, b], index) => {
  const answer = operation === "addition" ? a + b : a - b;
  const script = operation === "addition"
    ? `${a} ${a === 1 ? "monster is" : "monsters are"} here. ${b} more ${b === 1 ? "joins" : "join"} ${a === 1 ? "in" : "them"}. What is ${a} plus ${b}? Tap how many monsters there are altogether.`
    : `${a} monsters are here. ${b} ${b === 1 ? "hides" : "hide"}. What is ${a} take away ${b}? Tap how many monsters are left.`;
  // Six distinct answers within 0–10, with the correct position changing each round.
  const choices = [answer, ...Array.from({ length: 11 }, (_, n) => n).filter(n => n !== answer)
    .sort((x, y) => Math.abs(x - answer) - Math.abs(y - answer)).slice(0, 5)];
  const shift = (index * 5 + 2) % choices.length;
  return { id: `${a}-${b}`, a, b, answer, script, choices: [...choices.slice(shift), ...choices.slice(0, shift)] };
});
