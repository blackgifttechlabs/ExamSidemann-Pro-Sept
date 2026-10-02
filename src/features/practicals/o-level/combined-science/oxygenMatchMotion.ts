/** Scene coordinates relative to the bench. The match tip is 0.12 m above its centre. */
export const MATCH_PREPARATION_SECONDS = 5;
export const MATCH_INSERTION_SECONDS = 2.8;
export function matchPose(state: 'idle' | 'glowing' | 'tested', elapsed: number) {
  const idle = { x: 0.7, y: 0.058, z: 0.28, angle: Math.PI / 2 };
  const held = { x: 0.65, y: 0.74, z: 0.24, angle: -0.18 };
  const frames = state === 'tested'
    ? [{ t: 0, ...held }, { t: 0.8, x: 0.3, y: 0.64, z: 0.18, angle: 0 },
       { t: 1.7, x: -0.55, y: 0.64, z: 0.05, angle: 0 },
       { t: MATCH_INSERTION_SECONDS, x: -0.55, y: 1.16, z: 0.05, angle: 0 }]
    : [{ t: 0, ...idle }, { t: 0.65, ...idle, x: 0.88 },
       { t: 1.35, x: 0.94, y: 0.24, z: 0.28, angle: 0.5 },
       { t: 1.9, x: 0.66, y: 0.05, z: 0.442, angle: Math.PI / 2 },
       { t: 2.18, x: 0.91, y: 0.05, z: 0.442, angle: Math.PI / 2 },
       { t: 3.25, ...held }, { t: MATCH_PREPARATION_SECONDS, ...held }];
  if (state === 'idle') return idle;
  const time = Math.max(0, elapsed);
  for (let i = 1; i < frames.length; i++) {
    if (time <= frames[i].t) {
      const a = frames[i - 1], b = frames[i];
      const fraction = (time - a.t) / (b.t - a.t);
      const ease = fraction * fraction * (3 - 2 * fraction);
      return { x: a.x + (b.x - a.x) * ease, y: a.y + (b.y - a.y) * ease,
        z: a.z + (b.z - a.z) * ease, angle: a.angle + (b.angle - a.angle) * ease };
    }
  }
  return frames[frames.length - 1];
}
