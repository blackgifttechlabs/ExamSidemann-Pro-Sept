/**
 * Sheet geometry for the polytechnic Technical Drawing practicals.
 *
 * Everything on the board is described in **millimetres on an A3 sheet**, with
 * the origin at the top-left corner, x to the right and y down — the same way a
 * student measures off the paper with a scale rule. Nothing here is eyeballed:
 * a bisector really is the intersection of two equal arcs, a hexagon vertex
 * really is the compass radius stepped round the circle, and the orthographic
 * views really are projections of one solid. Get the maths right here and the
 * canvas renderer, the 3D board and the preview all inherit it.
 *
 * Angles are in degrees, measured the way a protractor reads on the page:
 * 0° points right, 90° points **up** the sheet. Because y grows downwards, the
 * conversion to a screen vector flips the sine — see `polar`.
 */

export interface Pt {
  x: number;
  y: number;
}

/** A3 landscape, the sheet size these practicals are drawn on. */
export const SHEET = { width: 420, height: 297 } as const;

/**
 * Frame margins. 20 mm down the left is the filing margin — the edge that gets
 * punched and bound — and 10 mm on the other three sides.
 */
export const MARGIN = { left: 20, right: 10, top: 10, bottom: 10 } as const;

export const FRAME = {
  left: MARGIN.left,
  top: MARGIN.top,
  right: SHEET.width - MARGIN.right,
  bottom: SHEET.height - MARGIN.bottom,
} as const;

/* ------------------------------------------------------------------ helpers */

export const rad = (degrees: number) => (degrees * Math.PI) / 180;
export const deg = (radians: number) => (radians * 180) / Math.PI;

export const pt = (x: number, y: number): Pt => ({ x, y });

/** A point `r` away from `c` at `angle` degrees, read as on a protractor. */
export const polar = (c: Pt, r: number, angle: number): Pt => ({
  x: c.x + r * Math.cos(rad(angle)),
  y: c.y - r * Math.sin(rad(angle)),
});

export const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

export const mid = (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Point a fraction `t` of the way from `a` to `b`. */
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

/** Direction of `a`→`b` in protractor degrees. */
export const bearing = (a: Pt, b: Pt) => deg(Math.atan2(a.y - b.y, b.x - a.x));

/** Slides `p` by `d` mm in the direction `angle`. */
export const shift = (p: Pt, angle: number, d: number): Pt => polar(p, d, angle);

/** Extends the segment `a`→`b` by `d` mm past `b`. */
export const extend = (a: Pt, b: Pt, d: number): Pt => shift(b, bearing(a, b), d);

/**
 * The two points where circles of radius `r1` about `c1` and `r2` about `c2`
 * cross. This is the workhorse of every compass construction on the board —
 * bisectors, perpendiculars and the hexagon all come out of it. Returns null
 * when the circles miss each other or are concentric.
 */
export function circleIntersections(c1: Pt, r1: number, c2: Pt, r2: number): [Pt, Pt] | null {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const d = Math.hypot(dx, dy);
  if (d === 0 || d > r1 + r2 || d < Math.abs(r1 - r2)) return null;

  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h2 = r1 * r1 - a * a;
  const h = Math.sqrt(Math.max(0, h2));
  const base = { x: c1.x + (a * dx) / d, y: c1.y + (a * dy) / d };

  return [
    { x: base.x + (h * dy) / d, y: base.y - (h * dx) / d },
    { x: base.x - (h * dy) / d, y: base.y + (h * dx) / d },
  ];
}

/** The point on line a→b nearest to p — the foot of the perpendicular. */
export function perpFoot(p: Pt, a: Pt, b: Pt): Pt {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return a;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared;
  return { x: a.x + dx * t, y: a.y + dy * t };
}

/**
 * Points along an ellipse, which is exactly what the concentric-circles
 * construction produces: the x from the major circle and the y from the minor
 * circle, taken at the same angle.
 */
export function ellipsePoints(c: Pt, semiMajor: number, semiMinor: number, count: number): Pt[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * 360;
    return {
      x: c.x + semiMajor * Math.cos(rad(angle)),
      y: c.y - semiMinor * Math.sin(rad(angle)),
    };
  });
}

export interface BlendArc {
  centre: Pt;
  /** Where the arc meets each straight line. */
  from: Pt;
  to: Pt;
  radius: number;
  /** Protractor angles of `from` and `to` measured at the centre. */
  fromAngle: number;
  toAngle: number;
}

/**
 * The arc of radius `r` that joins two straight lines meeting at `vertex`,
 * touching both without a corner. Its centre sits on the bisector at
 * `r / sin(half-angle)` from the vertex, and the tangent points are the feet of
 * the perpendiculars from there — which is precisely the construction taught
 * for fillets, so the drawing and the working agree.
 */
export function blendArc(vertex: Pt, alongA: number, alongB: number, r: number): BlendArc {
  const half = ((alongB - alongA + 360) % 360) / 2;
  const centre = polar(vertex, r / Math.sin(rad(half)), alongA + half);
  const from = perpFoot(centre, vertex, polar(vertex, 100, alongB));
  const to = perpFoot(centre, vertex, polar(vertex, 100, alongA));
  const fromAngle = bearing(centre, from);
  return {
    centre,
    from,
    to,
    radius: r,
    fromAngle,
    // The blend is always the *short* way round — the other way would sweep a
    // reflex arc right across the drawing.
    toAngle: shortWayTo(fromAngle, bearing(centre, to)),
  };
}

/** `to`, shifted by whole turns so the sweep from `from` is 180° or less. */
export function shortWayTo(from: number, to: number): number {
  let target = to;
  while (target - from > 180) target -= 360;
  while (target - from < -180) target += 360;
  return target;
}

/** Where the infinite lines a1→a2 and b1→b2 cross, or null if parallel. */
export function lineIntersection(a1: Pt, a2: Pt, b1: Pt, b2: Pt): Pt | null {
  const d1x = a2.x - a1.x;
  const d1y = a2.y - a1.y;
  const d2x = b2.x - b1.x;
  const d2y = b2.y - b1.y;
  const denominator = d1x * d2y - d1y * d2x;
  if (Math.abs(denominator) < 1e-9) return null;

  const t = ((b1.x - a1.x) * d2y - (b1.y - a1.y) * d2x) / denominator;
  return { x: a1.x + d1x * t, y: a1.y + d1y * t };
}

/* -------------------------------------------------------------- mark styles */

/**
 * The line types of BS 8888, which is what the pencil grades on the board are
 * actually for: thin light construction lines that stay on the sheet, thick
 * continuous outlines, dashed hidden detail and long-chain centre lines.
 */
export type LineStyle =
  | 'construction'
  | 'outline'
  | 'hidden'
  | 'centre'
  | 'dimension'
  | 'border'
  | 'thin'
  /** Chain thin double-dash: an alternate position, or a part in front. */
  | 'phantom'
  /** Chain thick: the cutting plane, and only ever the cutting plane. */
  | 'cutting';

export interface StyleSpec {
  colour: string;
  /** Pencil width in mm on the sheet. */
  width: number;
  /** Dash pattern in mm, empty for a continuous line. */
  dash: number[];
  /**
   * The thinnest this line may ever be drawn, in pixels.
   *
   * An A3 sheet seen whole — on the board with the camera pulled back, or on a
   * topic card — is only a couple of pixels to the millimetre, and at that size
   * a truthful 0.25 mm line is a third of a pixel and simply is not there. The
   * floor keeps every line type on the screen at any size, and keeping the
   * floors in the same order as the widths keeps the hierarchy honest: a thick
   * outline still reads as thicker than the construction lines under it.
   */
  minPx: number;
}

export const LINE_STYLES: Record<LineStyle, StyleSpec> = {
  // Construction lines are drawn 2H and light — they are meant to be left on
  // the sheet, not rubbed out. Light, though, not invisible: this is the line
  // the whole lesson is about, so it has to survive being looked at from across
  // the room.
  construction: { colour: '#8ba1c2', width: 0.25, dash: [], minPx: 1 },
  outline: { colour: '#1b2330', width: 0.7, dash: [], minPx: 1.6 },
  hidden: { colour: '#334155', width: 0.5, dash: [4, 2], minPx: 1.2 },
  centre: { colour: '#0f766e', width: 0.35, dash: [9, 2, 1.5, 2], minPx: 1.1 },
  dimension: { colour: '#1d4ed8', width: 0.35, dash: [], minPx: 1.1 },
  border: { colour: '#111827', width: 1, dash: [], minPx: 1.8 },
  thin: { colour: '#1b2330', width: 0.4, dash: [], minPx: 1.1 },
  // Long dash, two short: the pattern that separates a phantom line from a
  // centre line at a glance, which is the whole reason the standard has both.
  phantom: { colour: '#6d28d9', width: 0.35, dash: [9, 2, 1.5, 2, 1.5, 2], minPx: 1.1 },
  // The cutting plane is drawn thick at its ends and at every change of
  // direction, thin in between; the thick weight is what carries the arrows.
  cutting: { colour: '#0f766e', width: 0.7, dash: [9, 2, 1.5, 2], minPx: 1.6 },
};

/* --------------------------------------------------------------- mark types */

interface MarkBase {
  style?: LineStyle;
}

export interface LineMark extends MarkBase {
  kind: 'line';
  a: Pt;
  b: Pt;
}

export interface PolyMark extends MarkBase {
  kind: 'poly';
  points: Pt[];
  close?: boolean;
}

export interface CircleMark extends MarkBase {
  kind: 'circle';
  c: Pt;
  r: number;
}

/** An arc swept anticlockwise on the page from `from`° to `to`°. */
export interface ArcMark extends MarkBase {
  kind: 'arc';
  c: Pt;
  r: number;
  from: number;
  to: number;
}

export interface TextMark extends MarkBase {
  kind: 'text';
  at: Pt;
  text: string;
  /** Cap height in mm — 3.5 and 5 are the usual lettering sizes. */
  size?: number;
  align?: 'left' | 'center' | 'right';
  baseline?: 'top' | 'middle' | 'alphabetic';
  colour?: string;
  bold?: boolean;
  /** Rotation in protractor degrees, for lettering up the side of a view. */
  rotate?: number;
}

/** A dimension line with arrowheads, projection lines and the size on top. */
export interface DimensionMark extends MarkBase {
  kind: 'dim';
  a: Pt;
  b: Pt;
  /** How far the dimension line is set off the feature, +ve to the left of a→b. */
  offset?: number;
  /** Defaults to the true measured length rounded to the millimetre. */
  label?: string;
}

/** A small ring and letter marking a construction point, e.g. the centre. */
export interface DotMark extends MarkBase {
  kind: 'dot';
  at: Pt;
  label?: string;
  /** Where the letter sits relative to the dot, in protractor degrees. */
  labelAngle?: number;
}

/** An angle arc between two arms, with the size lettered on it. */
export interface AngleMark extends MarkBase {
  kind: 'angle';
  at: Pt;
  from: number;
  to: number;
  r: number;
  label?: string;
  /** Draws the square corner box instead of an arc. */
  square?: boolean;
}

export type Mark =
  | LineMark
  | PolyMark
  | CircleMark
  | ArcMark
  | TextMark
  | DimensionMark
  | DotMark
  | AngleMark;

/* ------------------------------------------------- measuring along the marks */

/** Rough drawn length of a mark in mm — used to pace the pencil along it. */
export function markLength(mark: Mark): number {
  switch (mark.kind) {
    case 'line':
      return dist(mark.a, mark.b);
    case 'poly': {
      let total = 0;
      for (let i = 1; i < mark.points.length; i += 1) total += dist(mark.points[i - 1], mark.points[i]);
      if (mark.close && mark.points.length > 2) total += dist(mark.points[mark.points.length - 1], mark.points[0]);
      return total;
    }
    case 'circle':
      return 2 * Math.PI * mark.r;
    case 'arc':
      return (Math.abs(mark.to - mark.from) / 360) * 2 * Math.PI * mark.r;
    case 'dim':
      return dist(mark.a, mark.b);
    case 'angle':
      return (Math.abs(mark.to - mark.from) / 360) * 2 * Math.PI * mark.r;
    case 'text':
      return (mark.size ?? 3.5) * mark.text.length * 0.8;
    case 'dot':
      return 6;
    default:
      return 10;
  }
}

/**
 * Where the pencil sits when a mark is `t` of the way drawn. The 3D pencil and
 * compass ride this, so the tip is always on the line appearing on the paper.
 */
export function markPointAt(mark: Mark, t: number): Pt {
  const clamped = Math.min(1, Math.max(0, t));
  switch (mark.kind) {
    case 'line':
    case 'dim':
      return lerpPt(mark.a, mark.b, clamped);
    case 'poly': {
      const points = mark.close && mark.points.length > 2 ? [...mark.points, mark.points[0]] : mark.points;
      const spans = points.slice(1).map((point, index) => dist(points[index], point));
      const total = spans.reduce((sum, span) => sum + span, 0);
      if (total === 0) return points[0];
      let walked = clamped * total;
      for (let i = 0; i < spans.length; i += 1) {
        if (walked <= spans[i] || i === spans.length - 1) {
          return lerpPt(points[i], points[i + 1], spans[i] === 0 ? 0 : walked / spans[i]);
        }
        walked -= spans[i];
      }
      return points[points.length - 1];
    }
    case 'circle':
      return polar(mark.c, mark.r, 90 - clamped * 360);
    case 'arc':
      return polar(mark.c, mark.r, mark.from + (mark.to - mark.from) * clamped);
    case 'angle':
      return polar(mark.at, mark.r, mark.from + (mark.to - mark.from) * clamped);
    case 'text':
      return mark.at;
    case 'dot':
      return mark.at;
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Which way the stroke is heading at `t`, in protractor degrees. The pencil is
 * turned to this, and a straight edge is laid along it, so the instrument on
 * screen is always pointing the way the line is actually going.
 */
export function markTangentAt(mark: Mark, t: number): number {
  const step = 0.02;
  const before = markPointAt(mark, Math.max(0, Math.min(1 - step, t - step)));
  const after = markPointAt(mark, Math.max(step, Math.min(1, t + step)));
  if (before.x === after.x && before.y === after.y) return 0;
  return bearing(before, after);
}

/* ------------------------------------------------------- the standard sheet */

/**
 * Border and title block, drawn on every sheet before anything else. The title
 * block is 150 × 30 sitting in the bottom-right corner of the frame, ruled into
 * the boxes a polytechnic sheet is marked on: name, class, title, scale, date,
 * drawing number and the projection symbol.
 */
export const TITLE_BLOCK = {
  width: 150,
  height: 30,
  get left() {
    return FRAME.right - this.width;
  },
  get top() {
    return FRAME.bottom - this.height;
  },
} as const;

export function frameMarks(): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'border',
      close: true,
      points: [
        pt(FRAME.left, FRAME.top),
        pt(FRAME.right, FRAME.top),
        pt(FRAME.right, FRAME.bottom),
        pt(FRAME.left, FRAME.bottom),
      ],
    },
  ];
}

/** The ruled boxes of the title block, without the lettering. */
export function titleBlockMarks(): Mark[] {
  const { left, top, width, height } = TITLE_BLOCK;
  const right = left + width;
  const bottom = top + height;
  const rowA = top + height / 3;
  const rowB = top + (2 * height) / 3;
  const columnA = left + 60;
  const columnB = left + 110;

  return [
    { kind: 'poly', style: 'thin', close: true, points: [pt(left, top), pt(right, top), pt(right, bottom), pt(left, bottom)] },
    { kind: 'line', style: 'thin', a: pt(left, rowA), b: pt(right, rowA) },
    { kind: 'line', style: 'thin', a: pt(left, rowB), b: pt(right, rowB) },
    { kind: 'line', style: 'thin', a: pt(columnA, top), b: pt(columnA, bottom) },
    { kind: 'line', style: 'thin', a: pt(columnB, top), b: pt(columnB, bottom) },
  ];
}

export interface TitleBlockText {
  name?: string;
  course?: string;
  title?: string;
  scale?: string;
  date?: string;
  number?: string;
}

export function titleBlockLettering(fields: TitleBlockText = {}): Mark[] {
  const { left, top, width, height } = TITLE_BLOCK;
  const rowA = top + height / 3;
  const rowB = top + (2 * height) / 3;
  const columnA = left + 60;
  const columnB = left + 110;
  const pad = 2.2;

  const cell = (x: number, y: number, heading: string, value?: string): Mark[] => [
    { kind: 'text', at: pt(x + pad, y + 3.4), text: heading, size: 2.2, align: 'left', baseline: 'middle', colour: '#64748b' },
    { kind: 'text', at: pt(x + pad, y + 7.4), text: value ?? '', size: 3.2, align: 'left', baseline: 'middle', bold: true },
  ];

  return [
    ...cell(left, top, 'NAME', fields.name ?? ''),
    ...cell(left, rowA, 'COURSE', fields.course ?? ''),
    ...cell(left, rowB, 'TITLE', fields.title ?? ''),
    ...cell(columnA, top, 'SCALE', fields.scale ?? '1:1'),
    ...cell(columnA, rowA, 'DATE', fields.date ?? ''),
    ...cell(columnA, rowB, 'DRG No.', fields.number ?? ''),
    { kind: 'text', at: pt(columnB + pad, top + 3.4), text: 'PROJECTION', size: 2.2, align: 'left', baseline: 'middle', colour: '#64748b' },
  ];
}

/**
 * The first-angle projection symbol: a truncated cone with its end view drawn
 * on the side the first-angle rule puts it. Every sheet carries it, and telling
 * the two symbols apart is examinable, so it is drawn properly rather than
 * faked with a couple of circles.
 */
export function projectionSymbol(centre: Pt, scale = 1): Mark[] {
  const big = 5 * scale;
  const small = 3 * scale;
  const length = 11 * scale;
  const gap = 9 * scale;

  // Elevation: the cone on its side, tall end on the left.
  const coneLeft = centre.x - length / 2 - gap;
  const coneRight = coneLeft + length;

  return [
    {
      kind: 'poly',
      style: 'thin',
      close: true,
      points: [
        pt(coneLeft, centre.y - big),
        pt(coneRight, centre.y - small),
        pt(coneRight, centre.y + small),
        pt(coneLeft, centre.y + big),
      ],
    },
    { kind: 'line', style: 'centre', a: pt(coneLeft - 2.5, centre.y), b: pt(coneRight + 2.5, centre.y) },
    // End view: looking from the left, drawn on the right — that is first angle.
    { kind: 'circle', style: 'thin', c: pt(centre.x + gap, centre.y), r: big },
    { kind: 'circle', style: 'thin', c: pt(centre.x + gap, centre.y), r: small },
    { kind: 'line', style: 'centre', a: pt(centre.x + gap - big - 2.5, centre.y), b: pt(centre.x + gap + big + 2.5, centre.y) },
    { kind: 'line', style: 'centre', a: pt(centre.x + gap, centre.y - big - 2.5), b: pt(centre.x + gap, centre.y + big + 2.5) },
  ];
}

/* ------------------------------------------------------- the demonstration solid */

/**
 * The step block every projection topic is built from: an L-shaped prism,
 * 80 long × 50 deep × 60 high, with a 40 × 30 notch taken out of the top right.
 * Topic 4 projects it into three views and topic 5 draws the same solid in
 * isometric, so the learner meets one object twice.
 */
export const BLOCK = { length: 80, depth: 50, height: 60, stepLength: 40, stepHeight: 30 } as const;

/** The L-shaped cross-section, as seen on the front view. */
export function blockProfile(origin: Pt): Pt[] {
  const { length, height, stepLength, stepHeight } = BLOCK;
  return [
    pt(origin.x, origin.y),
    pt(origin.x + length, origin.y),
    pt(origin.x + length, origin.y - stepHeight),
    pt(origin.x + stepLength, origin.y - stepHeight),
    pt(origin.x + stepLength, origin.y - height),
    pt(origin.x, origin.y - height),
  ];
}

/* --------------------------------------------------------------- isometric */

const COS30 = Math.cos(rad(30));
const SIN30 = Math.sin(rad(30));

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const v3 = (x: number, y: number, z: number): Vec3 => ({ x, y, z });

/**
 * Isometric drawing projection about a chosen nearest corner. The length axis
 * runs up to the right at 30°, the depth axis up to the left at 30°, and height
 * stays vertical — exactly the three lines the 30/60 set square gives you.
 * Measurements along all three axes are true lengths, which is what makes this
 * an isometric *drawing* rather than an isometric projection.
 */
export function isoPoint(origin: Pt, p: Vec3): Pt {
  return {
    x: origin.x + (p.x - p.y) * COS30,
    y: origin.y - (p.x + p.y) * SIN30 - p.z,
  };
}

/** The visible edges of the step block in isometric, as pairs of 3D corners. */
export function blockIsoVisibleEdges(): [Vec3, Vec3][] {
  const { length: L, depth: D, height: H, stepLength: S, stepHeight: T } = BLOCK;
  return [
    // Front face, the full L.
    [v3(0, 0, 0), v3(L, 0, 0)],
    [v3(L, 0, 0), v3(L, 0, T)],
    [v3(L, 0, T), v3(S, 0, T)],
    [v3(S, 0, T), v3(S, 0, H)],
    [v3(S, 0, H), v3(0, 0, H)],
    [v3(0, 0, H), v3(0, 0, 0)],
    // Top of the tall part.
    [v3(0, 0, H), v3(0, D, H)],
    [v3(0, D, H), v3(S, D, H)],
    [v3(S, D, H), v3(S, 0, H)],
    // The step riser and the top of the low part.
    [v3(S, D, H), v3(S, D, T)],
    [v3(S, D, T), v3(S, 0, T)],
    [v3(S, D, T), v3(L, D, T)],
    [v3(L, D, T), v3(L, 0, T)],
    // Right-hand end.
    [v3(L, D, T), v3(L, D, 0)],
    [v3(L, D, 0), v3(L, 0, 0)],
  ];
}

/** The visible edges of the plain 80 × 50 × 60 crate the block is drawn inside. */
export function crateIsoVisibleEdges(): [Vec3, Vec3][] {
  const { length: L, depth: D, height: H } = BLOCK;
  return [
    [v3(0, 0, 0), v3(L, 0, 0)],
    [v3(L, 0, 0), v3(L, 0, H)],
    [v3(L, 0, H), v3(0, 0, H)],
    [v3(0, 0, H), v3(0, 0, 0)],
    [v3(0, 0, H), v3(0, D, H)],
    [v3(0, D, H), v3(L, D, H)],
    [v3(L, D, H), v3(L, 0, H)],
    [v3(L, D, H), v3(L, D, 0)],
    [v3(L, D, 0), v3(L, 0, 0)],
  ];
}

export function isoEdgeMarks(origin: Pt, edges: [Vec3, Vec3][], style: LineStyle): Mark[] {
  return edges.map(([a, b]) => ({ kind: 'line', style, a: isoPoint(origin, a), b: isoPoint(origin, b) }));
}
