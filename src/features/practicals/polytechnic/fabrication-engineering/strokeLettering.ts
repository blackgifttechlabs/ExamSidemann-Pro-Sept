/**
 * Single-stroke lettering, drawn the way it is drawn on a board.
 *
 * The lettering topics of this course are not about picking a font. They are
 * about the strokes: where the pencil starts, which way it travels, how wide a
 * letter is against its height, and what changes when the style is condensed or
 * sloped. So the letters here are **paths**, not text — the pencil on the board
 * walks each stroke in order, exactly as a hand would.
 *
 * Every glyph is described in its own box: x from 0 to 1 across the letter,
 * y from 0 at the baseline to 1 at the cap line, and `w` is how far the pen
 * moves on to the next letter, in cap heights. Lower case is drawn in the same
 * box, with the x-height at 0.7 and descenders taken to −0.25, which is the
 * proportion ISO 3098 asks for.
 */

import { pt, type LineStyle, type Mark, type Pt } from '../technical-drawing/drawingGeometry';

/** A point in glyph space. */
type G = [number, number];

interface Glyph {
  /** Advance to the next letter, in cap heights, including the side bearing. */
  w: number;
  strokes: G[][];
}

/** Points round an ellipse in glyph space; angles are ordinary maths degrees. */
function arc(cx: number, cy: number, rx: number, ry: number, from: number, to: number, steps = 18): G[] {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = ((from + ((to - from) * index) / steps) * Math.PI) / 180;
    return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)] as G;
  });
}

const ring = (cx: number, cy: number, rx: number, ry: number): G[] => arc(cx, cy, rx, ry, 0, 360, 28);

/* ----------------------------------------------------------------- capitals */

const CAPITALS: Record<string, Glyph> = {
  A: { w: 0.78, strokes: [[[0, 0], [0.5, 1], [1, 0]], [[0.17, 0.34], [0.83, 0.34]]] },
  B: {
    w: 0.76,
    strokes: [
      [[0, 0], [0, 1]],
      [[0, 1], [0.58, 1], ...arc(0.58, 0.75, 0.34, 0.25, 90, -90), [0, 0.5]],
      [[0, 0.5], [0.6, 0.5], ...arc(0.6, 0.25, 0.38, 0.25, 90, -90), [0, 0]],
    ],
  },
  C: { w: 0.78, strokes: [arc(0.5, 0.5, 0.5, 0.5, 50, 310, 24)] },
  D: { w: 0.78, strokes: [[[0, 0], [0, 1]], [[0, 1], [0.42, 1], ...arc(0.42, 0.5, 0.56, 0.5, 90, -90, 20), [0, 0]]] },
  E: { w: 0.7, strokes: [[[1, 1], [0, 1], [0, 0], [1, 0]], [[0, 0.5], [0.78, 0.5]]] },
  F: { w: 0.66, strokes: [[[1, 1], [0, 1], [0, 0]], [[0, 0.5], [0.76, 0.5]]] },
  G: { w: 0.8, strokes: [[...arc(0.5, 0.5, 0.5, 0.5, 45, 360, 26), [0.6, 0.5]]] },
  H: { w: 0.78, strokes: [[[0, 0], [0, 1]], [[1, 0], [1, 1]], [[0, 0.5], [1, 0.5]]] },
  I: { w: 0.3, strokes: [[[0.5, 0], [0.5, 1]]] },
  J: { w: 0.62, strokes: [[[0.8, 1], [0.8, 0.24], ...arc(0.42, 0.24, 0.38, 0.24, 0, -180, 12)]] },
  K: { w: 0.76, strokes: [[[0, 0], [0, 1]], [[1, 1], [0, 0.42]], [[0.33, 0.6], [1, 0]]] },
  L: { w: 0.64, strokes: [[[0, 1], [0, 0], [0.9, 0]]] },
  M: { w: 0.92, strokes: [[[0, 0], [0, 1], [0.5, 0.22], [1, 1], [1, 0]]] },
  N: { w: 0.8, strokes: [[[0, 0], [0, 1], [1, 0], [1, 1]]] },
  O: { w: 0.82, strokes: [ring(0.5, 0.5, 0.5, 0.5)] },
  P: { w: 0.72, strokes: [[[0, 0], [0, 1]], [[0, 1], [0.56, 1], ...arc(0.56, 0.73, 0.36, 0.27, 90, -90), [0, 0.46]]] },
  Q: { w: 0.82, strokes: [ring(0.5, 0.5, 0.5, 0.5), [[0.62, 0.26], [1.02, -0.08]]] },
  R: {
    w: 0.76,
    strokes: [
      [[0, 0], [0, 1]],
      [[0, 1], [0.54, 1], ...arc(0.54, 0.73, 0.36, 0.27, 90, -90), [0, 0.46]],
      [[0.5, 0.46], [1, 0]],
    ],
  },
  S: {
    w: 0.74,
    strokes: [
      [
        [0.94, 0.82], [0.82, 0.96], [0.5, 1], [0.19, 0.95], [0.06, 0.79], [0.12, 0.63],
        [0.34, 0.54], [0.68, 0.46], [0.9, 0.36], [0.95, 0.2], [0.82, 0.05], [0.5, 0],
        [0.18, 0.04], [0.05, 0.18],
      ],
    ],
  },
  T: { w: 0.72, strokes: [[[0, 1], [1, 1]], [[0.5, 1], [0.5, 0]]] },
  U: { w: 0.8, strokes: [[[0, 1], [0, 0.3], ...arc(0.5, 0.3, 0.5, 0.3, 180, 360, 14), [1, 1]]] },
  V: { w: 0.78, strokes: [[[0, 1], [0.5, 0], [1, 1]]] },
  W: { w: 1, strokes: [[[0, 1], [0.25, 0], [0.5, 0.68], [0.75, 0], [1, 1]]] },
  X: { w: 0.76, strokes: [[[0, 0], [1, 1]], [[0, 1], [1, 0]]] },
  Y: { w: 0.76, strokes: [[[0, 1], [0.5, 0.5], [1, 1]], [[0.5, 0.5], [0.5, 0]]] },
  Z: { w: 0.74, strokes: [[[0, 1], [1, 1], [0, 0], [1, 0]]] },
};

/* ------------------------------------------------------------------ digits */

const DIGITS: Record<string, Glyph> = {
  '0': { w: 0.72, strokes: [ring(0.5, 0.5, 0.42, 0.5)] },
  '1': { w: 0.5, strokes: [[[0.16, 0.8], [0.5, 1], [0.5, 0]], [[0.16, 0], [0.84, 0]]] },
  '2': {
    w: 0.7,
    strokes: [[[0.05, 0.78], [0.16, 0.94], [0.42, 1], [0.7, 0.95], [0.84, 0.79], [0.8, 0.6], [0.58, 0.41], [0.05, 0], [0.92, 0]]],
  },
  '3': {
    w: 0.7,
    strokes: [
      [[0.06, 0.87], [0.26, 1], [0.6, 1], [0.85, 0.88], [0.84, 0.68], [0.6, 0.55], [0.38, 0.55]],
      [[0.6, 0.55], [0.88, 0.43], [0.9, 0.18], [0.62, 0.01], [0.25, 0.02], [0.05, 0.15]],
    ],
  },
  '4': { w: 0.72, strokes: [[[0.72, 0], [0.72, 1], [0.05, 0.27], [0.96, 0.27]]] },
  '5': {
    w: 0.7,
    strokes: [[[0.86, 1], [0.16, 1], [0.1, 0.56], [0.36, 0.63], [0.66, 0.6], [0.87, 0.45], [0.88, 0.2], [0.64, 0.02], [0.27, 0], [0.05, 0.12]]],
  },
  '6': {
    w: 0.7,
    strokes: [[[0.86, 0.9], [0.6, 1], [0.32, 0.94], [0.13, 0.7], [0.06, 0.38], [0.13, 0.16], [0.36, 0.01], [0.62, 0.02], [0.85, 0.17], [0.88, 0.37], [0.72, 0.53], [0.45, 0.56], [0.2, 0.47], [0.1, 0.33]]],
  },
  '7': { w: 0.68, strokes: [[[0.05, 1], [0.95, 1], [0.38, 0]]] },
  '8': { w: 0.7, strokes: [ring(0.5, 0.76, 0.36, 0.24), ring(0.5, 0.26, 0.44, 0.26)] },
  '9': {
    w: 0.7,
    strokes: [[[0.14, 0.1], [0.4, 0], [0.68, 0.06], [0.87, 0.3], [0.94, 0.62], [0.87, 0.84], [0.64, 0.99], [0.38, 0.98], [0.15, 0.83], [0.12, 0.63], [0.28, 0.47], [0.55, 0.44], [0.8, 0.53], [0.9, 0.67]]],
  },
};

/* -------------------------------------------------------------- lower case */

const LOWER: Record<string, Glyph> = {
  a: { w: 0.68, strokes: [ring(0.42, 0.35, 0.34, 0.35), [[0.76, 0.7], [0.76, 0]]] },
  b: { w: 0.7, strokes: [[[0.05, 1], [0.05, 0]], ring(0.45, 0.35, 0.4, 0.35)] },
  c: { w: 0.64, strokes: [arc(0.48, 0.35, 0.42, 0.35, 55, 305, 18)] },
  d: { w: 0.7, strokes: [[[0.85, 1], [0.85, 0]], ring(0.45, 0.35, 0.4, 0.35)] },
  e: { w: 0.66, strokes: [[[0.06, 0.35], [0.9, 0.35]], arc(0.48, 0.35, 0.42, 0.35, 0, 310, 20)] },
  f: { w: 0.48, strokes: [[[0.78, 0.95], [0.6, 1], [0.42, 0.93], [0.4, 0.7], [0.4, 0]], [[0.1, 0.7], [0.74, 0.7]]] },
  g: {
    w: 0.7,
    strokes: [ring(0.42, 0.35, 0.34, 0.35), [[0.76, 0.7], [0.76, -0.12], [0.6, -0.24], [0.3, -0.23], [0.14, -0.13]]],
  },
  h: { w: 0.7, strokes: [[[0.05, 1], [0.05, 0]], [[0.05, 0.45], [0.2, 0.64], [0.45, 0.7], [0.68, 0.62], [0.79, 0.45], [0.79, 0]]] },
  i: { w: 0.3, strokes: [[[0.4, 0.7], [0.4, 0]], [[0.4, 0.87], [0.4, 0.93]]] },
  j: { w: 0.34, strokes: [[[0.55, 0.7], [0.55, -0.1], [0.4, -0.24], [0.18, -0.23], [0.06, -0.14]], [[0.55, 0.87], [0.55, 0.93]]] },
  k: { w: 0.66, strokes: [[[0.05, 1], [0.05, 0]], [[0.76, 0.7], [0.09, 0.24]], [[0.32, 0.4], [0.82, 0]]] },
  l: { w: 0.3, strokes: [[[0.4, 1], [0.4, 0]]] },
  m: {
    w: 1.02,
    strokes: [
      [[0.04, 0.7], [0.04, 0]],
      [[0.04, 0.48], [0.16, 0.65], [0.34, 0.7], [0.47, 0.62], [0.5, 0.45], [0.5, 0]],
      [[0.5, 0.48], [0.62, 0.65], [0.79, 0.7], [0.91, 0.62], [0.94, 0.45], [0.94, 0]],
    ],
  },
  n: { w: 0.7, strokes: [[[0.05, 0.7], [0.05, 0]], [[0.05, 0.47], [0.2, 0.64], [0.45, 0.7], [0.68, 0.62], [0.79, 0.45], [0.79, 0]]] },
  o: { w: 0.7, strokes: [ring(0.47, 0.35, 0.42, 0.35)] },
  p: { w: 0.7, strokes: [[[0.05, 0.7], [0.05, -0.27]], ring(0.47, 0.35, 0.4, 0.35)] },
  q: { w: 0.7, strokes: [[[0.87, 0.7], [0.87, -0.27]], ring(0.45, 0.35, 0.4, 0.35)] },
  r: { w: 0.48, strokes: [[[0.1, 0.7], [0.1, 0]], [[0.1, 0.47], [0.28, 0.65], [0.55, 0.7], [0.78, 0.66]]] },
  s: {
    w: 0.6,
    strokes: [[[0.82, 0.6], [0.65, 0.7], [0.35, 0.7], [0.14, 0.62], [0.15, 0.48], [0.36, 0.4], [0.62, 0.33], [0.8, 0.23], [0.77, 0.09], [0.54, 0], [0.24, 0.01], [0.09, 0.09]]],
  },
  t: { w: 0.48, strokes: [[[0.35, 1], [0.35, 0.15], [0.5, 0.02], [0.7, 0.03], [0.84, 0.11]], [[0.06, 0.7], [0.7, 0.7]]] },
  u: { w: 0.7, strokes: [[[0.08, 0.7], [0.08, 0.22], [0.22, 0.04], [0.5, 0], [0.72, 0.08], [0.82, 0.22]], [[0.82, 0.7], [0.82, 0]]] },
  v: { w: 0.64, strokes: [[[0.05, 0.7], [0.47, 0], [0.9, 0.7]]] },
  w: { w: 0.94, strokes: [[[0.03, 0.7], [0.25, 0], [0.48, 0.48], [0.71, 0], [0.93, 0.7]]] },
  x: { w: 0.62, strokes: [[[0.08, 0.7], [0.85, 0]], [[0.08, 0], [0.85, 0.7]]] },
  y: { w: 0.64, strokes: [[[0.05, 0.7], [0.47, 0]], [[0.9, 0.7], [0.28, -0.25]]] },
  z: { w: 0.6, strokes: [[[0.08, 0.7], [0.85, 0.7], [0.08, 0], [0.88, 0]]] },
};

const MARKS: Record<string, Glyph> = {
  ' ': { w: 0.42, strokes: [] },
  '.': { w: 0.3, strokes: [[[0.32, 0], [0.32, 0.06]]] },
  ',': { w: 0.3, strokes: [[[0.34, 0.07], [0.3, -0.05], [0.18, -0.13]]] },
  '-': { w: 0.56, strokes: [[[0.08, 0.42], [0.82, 0.42]]] },
  ':': { w: 0.3, strokes: [[[0.32, 0.1], [0.32, 0.16]], [[0.32, 0.44], [0.32, 0.5]]] },
  '/': { w: 0.6, strokes: [[[0.04, 0], [0.86, 1]]] },
  '(': { w: 0.4, strokes: [arc(0.7, 0.5, 0.62, 0.6, 145, 215, 12)] },
  ')': { w: 0.4, strokes: [arc(-0.06, 0.5, 0.62, 0.6, 35, -35, 12)] },
  '°': { w: 0.44, strokes: [ring(0.34, 0.82, 0.18, 0.18)] },
  '+': { w: 0.68, strokes: [[[0.1, 0.5], [0.84, 0.5]], [[0.47, 0.15], [0.47, 0.85]]] },
  '×': { w: 0.62, strokes: [[[0.12, 0.22], [0.8, 0.72]], [[0.12, 0.72], [0.8, 0.22]]] },
  '=': { w: 0.68, strokes: [[[0.1, 0.62], [0.84, 0.62]], [[0.1, 0.34], [0.84, 0.34]]] },
  'Ø': { w: 0.82, strokes: [ring(0.5, 0.5, 0.42, 0.5), [[0.06, -0.06], [0.94, 1.06]]] },
};

const GLYPHS: Record<string, Glyph> = { ...CAPITALS, ...DIGITS, ...LOWER, ...MARKS };

/* ------------------------------------------------------------ the styles */

export type LetterStyle = 'open' | 'condensed';

export interface LetterSpec {
  /** Left end of the baseline. */
  at: Pt;
  /** Cap height in mm — 3.5, 5 and 7 are the sizes a drawing office uses. */
  height: number;
  /**
   * Open letters keep their proper width; condensed letters are squeezed to
   * about two thirds of it, which is what gets a long title into a narrow box
   * without dropping the height.
   */
  style?: LetterStyle;
  /** Degrees the letters lean forward from upright. Sloping style is 15°. */
  slope?: number;
  /** Extra space between letters, as a fraction of the cap height. */
  tracking?: number;
  /** Draws it as if by hand: no straight edge, no compass. */
  freehand?: boolean;
  /** Keeps a freehand sample identical between renders. */
  seed?: number;
  lineStyle?: LineStyle;
}

const WIDTH_FACTOR: Record<LetterStyle, number> = { open: 1, condensed: 0.62 };

/** Deterministic wobble for freehand lettering. */
function wobble(seed: number, index: number): number {
  const value = Math.sin(seed * 78.233 + index * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

/**
 * The width of a piece of lettering before it is drawn — needed to centre a
 * title in a box, which is the one thing beginners never do.
 */
export function letterWidth(value: string, spec: Pick<LetterSpec, 'height' | 'style' | 'tracking'>): number {
  const factor = WIDTH_FACTOR[spec.style ?? 'open'];
  const tracking = spec.tracking ?? 0.16;
  return [...value].reduce((sum, character) => {
    const glyph = GLYPHS[character] ?? GLYPHS[character.toUpperCase()] ?? MARKS[' '];
    return sum + (glyph.w * factor + tracking) * spec.height;
  }, 0);
}

/**
 * Lettering as strokes on the sheet.
 *
 * The slope is a **shear**, not a rotation: the letters lean but the baseline
 * stays level and the height stays the height, which is exactly the difference
 * between sloping lettering and lettering written up a slope.
 */
export function letterMarks(value: string, spec: LetterSpec): Mark[] {
  const { at, height } = spec;
  const factor = WIDTH_FACTOR[spec.style ?? 'open'];
  const tracking = spec.tracking ?? 0.16;
  const lean = Math.tan(((spec.slope ?? 0) * Math.PI) / 180);
  const style = spec.lineStyle ?? 'outline';
  const seed = spec.seed ?? 7;

  const marks: Mark[] = [];
  let penX = at.x;
  let counter = 0;

  for (const character of value) {
    const glyph = GLYPHS[character] ?? GLYPHS[character.toUpperCase()] ?? MARKS[' '];
    for (const stroke of glyph.strokes) {
      const points: Pt[] = stroke.map(([gx, gy], index) => {
        counter += 1;
        const shake = spec.freehand ? height * 0.022 : 0;
        const x = penX + (gx * factor + gy * lean) * height + shake * wobble(seed, counter);
        const y = at.y - gy * height + shake * wobble(seed + 91, counter);
        return pt(x, y);
      });
      marks.push({ kind: 'poly', style, points });
    }
    penX += (glyph.w * factor + tracking) * height;
    counter += 3;
  }

  return marks;
}

/**
 * The guide lines lettering is built between: baseline, cap line, and — for
 * lower case — the x-height line. Sloping styles get a few slope guides too,
 * because keeping every letter on the same lean is the hard part.
 */
export function letteringGuides(
  at: Pt,
  height: number,
  length: number,
  options: { lowercase?: boolean; slope?: number; slopeEvery?: number } = {}
): Mark[] {
  const marks: Mark[] = [
    { kind: 'line', style: 'construction', a: pt(at.x, at.y), b: pt(at.x + length, at.y) },
    { kind: 'line', style: 'construction', a: pt(at.x, at.y - height), b: pt(at.x + length, at.y - height) },
  ];
  if (options.lowercase) {
    marks.push({
      kind: 'line',
      style: 'construction',
      a: pt(at.x, at.y - height * 0.7),
      b: pt(at.x + length, at.y - height * 0.7),
    });
    marks.push({
      kind: 'line',
      style: 'construction',
      a: pt(at.x, at.y + height * 0.25),
      b: pt(at.x + length, at.y + height * 0.25),
    });
  }
  if (options.slope) {
    const lean = Math.tan((options.slope * Math.PI) / 180);
    const every = options.slopeEvery ?? 12;
    for (let x = at.x; x <= at.x + length; x += every) {
      marks.push({
        kind: 'line',
        style: 'construction',
        a: pt(x, at.y),
        b: pt(x + lean * height, at.y - height),
      });
    }
  }
  return marks;
}
