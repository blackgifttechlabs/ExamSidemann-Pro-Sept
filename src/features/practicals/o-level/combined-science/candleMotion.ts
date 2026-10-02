export type CandleStage = 'collect' | 'ready' | 'inserting' | 'withdrawing' | 'transferring' | 'burning' | 'out';
export type Point3 = [number, number, number];
export const BENCH_Y = 1.36;
export const CANDLE_HOME: Point3 = [0, BENCH_Y + .027, .45];
export const JAR_POSITIONS = { inhaled: [-.6, BENCH_Y + .012, .12], exhaled: [.6, BENCH_Y + .012, .25] } satisfies Record<string, Point3>;
export const MOTION_SECONDS = { inserting: 3.4, withdrawing: 2.8, transferring: 4.6 };
const ease = (t: number) => { const x = Math.max(0, Math.min(1, t)); return x * x * (3 - 2 * x); };
const mix = (a: Point3, b: Point3, t: number): Point3 => a.map((v, i) => v + (b[i] - v) * ease(t)) as Point3;
function path(points: Point3[], stops: number[], t: number): Point3 {
  const index = stops.findIndex((stop, i) => i > 0 && t <= stop);
  if (index < 0) return points[points.length - 1];
  return mix(points[index - 1], points[index], (t - stops[index - 1]) / (stops[index] - stops[index - 1]));
}
export function candlePosition(stage: CandleStage, jar: 'inhaled' | 'exhaled', progress: number): Point3 {
  const base = JAR_POSITIONS[jar];
  const inside: Point3 = [base[0], base[1] + .04, base[2]];
  const above: Point3 = [base[0], BENCH_Y + .85, base[2]];
  const lifted: Point3 = [CANDLE_HOME[0], BENCH_Y + .85, CANDLE_HOME[2]];
  if (stage === 'inserting') return path([CANDLE_HOME, lifted, above, inside, inside], [0, .25, .5, .82, 1], progress);
  if (stage === 'withdrawing') return path([inside, inside, above, lifted, CANDLE_HOME], [0, .16, .48, .75, 1], progress);
  if (stage === 'burning' || stage === 'out') return inside;
  return CANDLE_HOME;
}
export function collectionJarPose(stage: CandleStage, filled: boolean, progress: number): { position: Point3; angle: number } {
  if (!filled && stage !== 'transferring') return { position: [.65, BENCH_Y + .695, -.35], angle: Math.PI };
  if (stage !== 'transferring') return { position: JAR_POSITIONS.exhaled, angle: 0 };
  const centre = path([[.65, BENCH_Y + .385, -.35], [.65, BENCH_Y + .385, -.35], [.65, BENCH_Y + .95, -.35], [.65, BENCH_Y + .95, -.35], [.6, BENCH_Y + .95, .25], [.6, BENCH_Y + .322, .25]], [0, .15, .35, .6, .82, 1], progress);
  const angle = Math.PI * (1 - ease((progress - .35) / .25));
  // Rotate around the centre of the jar, keeping its closed base and mouth attached.
  return { position: [centre[0], centre[1] - .31 * Math.cos(angle), centre[2] - .31 * Math.sin(angle)], angle };
}
export function lidClosure(stage: CandleStage, progress: number, sealed: boolean): number {
  if (stage === 'inserting') {
    if (sealed && progress < .18) return 1 - ease(progress / .18);
    return ease((progress - .82) / .18);
  }
  if (stage === 'withdrawing') return 1 - ease(progress / .16);
  return sealed ? 1 : 0;
}
export function oxygenAtTime(initial: number, elapsed: number, cutoff: number, rate: number): number {
  return Math.max(cutoff, initial - Math.max(0, elapsed) * rate);
}

export function lidPosition(closure: number, collecting: boolean): Point3 {
  if (collecting) return [-.32 * (1 - closure), .668 - .036 * closure, 0];
  return path([[-.36, .012, .25], [-.36, .82, .25], [0, .82, 0], [0, .632, 0]], [0, .4, .75, 1], closure);
}
