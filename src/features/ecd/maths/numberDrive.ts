/**
 * Number Drive — the levels the child works through.
 *
 * Each level is a run of counting numbers collected in order. The ranges
 * deliberately overlap at the join (…5, then 5…) so the number a child
 * finished on is the one they start the next level with.
 */

export interface DriveLevel {
  /** 1-based, shown on the badge. */
  number: number;
  from: number;
  to: number;
  /** Seconds for a pair of blocks to travel the length of the road. */
  travelSeconds: number;
}

export const DRIVE_LEVELS: DriveLevel[] = [
  { number: 1, from: 1, to: 5, travelSeconds: 5.2 },
  { number: 2, from: 5, to: 10, travelSeconds: 4.8 },
  { number: 3, from: 10, to: 15, travelSeconds: 4.4 },
  { number: 4, from: 15, to: 20, travelSeconds: 4 },
];

/** Every number in a level, in the order they must be collected. */
export const levelNumbers = (level: DriveLevel) =>
  Array.from({ length: level.to - level.from + 1 }, (_, index) => level.from + index);

/**
 * A plausible wrong answer: near the target so the choice is a real reading of
 * the numeral rather than a glance at which block is bigger, but never the
 * target itself and never below 1.
 */
export const decoyFor = (target: number, level: DriveLevel) => {
  const spread = [-2, -1, 1, 2, 3];
  const candidates = spread
    .map((offset) => target + offset)
    .filter((value) => value >= 1 && value !== target && value <= level.to + 3);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? target + 1;
};
