/**
 * The maths behind the Fabrication Engineering drawing sheets.
 *
 * Everything a plater actually has to work out is worked out here, in the same
 * A3 millimetres `drawingGeometry` uses: the ordinate heights of a cylinder cut
 * by a plane, the curve where a dome meets a boiler shell, the width of a gore,
 * the sector angle of a cone, the rise of an arc too big to strike. The lessons
 * then only *place* those numbers on the sheet.
 *
 * That split is deliberate. A template that is drawn by eye rolls into a plate
 * that does not fit, and the whole point of a development is that the flat
 * shape, cut out and rolled, closes on itself. Every curve below is sampled
 * from its own equation, so it does.
 */

import {
  LINE_STYLES,
  bearing,
  dist,
  frameMarks,
  lerpPt,
  projectionSymbol,
  pt,
  polar,
  rad,
  titleBlockLettering,
  titleBlockMarks,
  type LineStyle,
  type Mark,
  type Pt,
} from '../technical-drawing/drawingGeometry';

export { LINE_STYLES };

/* ========================================================== small utilities */

/** A polyline mark through a list of points. */
export const poly = (points: Pt[], style: LineStyle = 'outline', close = false): Mark => ({
  kind: 'poly',
  style,
  points,
  close,
});

export const line = (a: Pt, b: Pt, style: LineStyle = 'outline'): Mark => ({ kind: 'line', style, a, b });

export const text = (
  at: Pt,
  value: string,
  size = 3.2,
  options: { align?: 'left' | 'center' | 'right'; bold?: boolean; colour?: string; rotate?: number } = {}
): Mark => ({
  kind: 'text',
  at,
  text: value,
  size,
  align: options.align ?? 'center',
  baseline: 'middle',
  bold: options.bold ?? false,
  colour: options.colour,
  rotate: options.rotate,
});

/**
 * A curve is only ever drawn as a dense polyline — but the points come from the
 * equation, not from smoothing a handful of plotted ordinates. Sixteen samples
 * between stations is past the point where a 0.7 mm pencil could tell.
 */
export function sampleCurve(from: number, to: number, steps: number, at: (t: number) => Pt): Pt[] {
  return Array.from({ length: steps + 1 }, (_, index) => at(from + ((to - from) * index) / steps));
}

/**
 * A deterministic wobble, for the freehand sheets.
 *
 * Freehand work in this trade is not scribble — it is a straight line drawn
 * without a straight edge, so the deviation is small, smooth and never repeats
 * the same way twice. A hash of the seed and the index gives that, and gives it
 * identically on every render, which matters because the pencil animation walks
 * the same points the preview drew.
 */
function noise(seed: number, index: number): number {
  const value = Math.sin(seed * 127.1 + index * 311.7) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

/**
 * Freehand version of a polyline: the corners stay exactly where they were —
 * a sketch that misses its own corners is a wrong sketch — and only the runs
 * between them bow off the true line by a fraction of a millimetre.
 */
export function freehand(points: Pt[], seed = 1, wobble = 0.55, per = 12): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const steps = Math.max(2, Math.round(dist(a, b) / per));
    const across = bearing(a, b) + 90;
    for (let s = 0; s < steps; s += 1) {
      const t = s / steps;
      const base = lerpPt(a, b, t);
      // Zero at both ends, so the joints stay tight.
      const swell = Math.sin(Math.PI * t) * wobble * noise(seed + i, s);
      out.push(polar(base, swell, across));
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/** A freehand circle — an ellipse the hand did not quite close on. */
export function freehandCircle(centre: Pt, r: number, seed = 1, wobble = 0.5, steps = 48): Pt[] {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const angle = (index / steps) * 360;
    const swell = wobble * Math.sin(rad(angle * 2 + seed * 37)) * 0.6 + wobble * noise(seed, index) * 0.4;
    return polar(centre, r + swell, angle);
  });
}

/* ================================================================== scales */

export interface ScaleBar {
  /** The whole bar, as marks. */
  marks: Mark[];
  /** Sheet x of the zero line — everything is read from here. */
  zeroX: number;
  /** Drawn length of one main unit, in sheet mm. */
  unitMm: number;
}

export interface PlainScaleSpec {
  /** Top-left corner of the bar. */
  at: Pt;
  height: number;
  /** Main divisions drawn to the right of zero. */
  units: number;
  /** The unit to the left of zero is cut into this many parts. */
  subUnits: number;
  /** Drawn length of one main unit, in sheet mm. */
  unitMm: number;
  /** Figures under the main divisions, left to right from zero. */
  unitLabels: string[];
  subLabels?: string[];
  unitName: string;
  subName: string;
  style?: LineStyle;
}

/**
 * A plain scale: one row of main units to the right of a zero, and a single
 * unit to the left of it cut into parts. Two orders of size, and no more —
 * which is exactly what separates it from the diagonal scale.
 */
export function plainScale(spec: PlainScaleSpec): ScaleBar {
  const { at, height, units, subUnits, unitMm, style = 'outline' } = spec;
  const zeroX = at.x + unitMm;
  const right = zeroX + units * unitMm;
  const bottom = at.y + height;
  const marks: Mark[] = [];

  // The bar itself, and the line that halves it: main divisions run the full
  // height, sub-divisions only the bottom half, so the eye can tell them apart.
  marks.push(poly([pt(at.x, at.y), pt(right, at.y), pt(right, bottom), pt(at.x, bottom)], style, true));
  marks.push(line(pt(at.x, at.y + height / 2), pt(right, at.y + height / 2), 'thin'));

  for (let index = 0; index <= units; index += 1) {
    const x = zeroX + index * unitMm;
    marks.push(line(pt(x, at.y), pt(x, bottom), 'thin'));
  }
  for (let index = 1; index < subUnits; index += 1) {
    const x = at.x + (index * unitMm) / subUnits;
    marks.push(line(pt(x, at.y + height / 2), pt(x, bottom), 'thin'));
  }

  // Figures sit under the division line they belong to, not under the space:
  // a scale is read at a line.
  spec.unitLabels.forEach((label, index) => {
    marks.push(text(pt(zeroX + index * unitMm, bottom + 4), label, 3, { align: 'center' }));
  });
  (spec.subLabels ?? []).forEach((label, index) => {
    const x = at.x + (index * unitMm) / subUnits;
    marks.push(text(pt(x, at.y - 3.4), label, 2.6, { align: 'center' }));
  });

  marks.push(text(pt((zeroX + right) / 2, bottom + 9.5), spec.unitName, 2.8, { align: 'center', colour: '#64748b' }));
  marks.push(text(pt(at.x + unitMm / 2, at.y - 8.5), spec.subName, 2.8, { align: 'center', colour: '#64748b' }));

  return { marks, zeroX, unitMm };
}

export interface DiagonalScaleSpec {
  at: Pt;
  height: number;
  units: number;
  unitMm: number;
  unitLabels: string[];
  unitName: string;
  subName: string;
  hundredthName: string;
}

/**
 * A diagonal scale, and the reason it works.
 *
 * The height is cut into ten, the sub-unit to the left of zero is cut into ten,
 * and each diagonal runs from a division on the bottom to the **next** division
 * on the top. Over the full height it therefore walks left by exactly one
 * tenth of a sub-division — so reading it on the k-th horizontal picks off
 * k hundredths of a unit. That single rule is the whole instrument.
 */
export interface DiagonalScale extends ScaleBar {
  /** Sheet y of each of the eleven horizontals, row 0 at the bottom. */
  rows: number[];
  subMm: number;
  /** The bar and its whole-unit divisions — the plain-scale part of it. */
  frame: Mark[];
  /** The ten horizontals and the tenths cut on the top and bottom edge. */
  tenths: Mark[];
  /** The diagonals, which are what make it a diagonal scale. */
  diagonals: Mark[];
  /** Figures and unit names. */
  labels: Mark[];
}

/**
 * Returned in the order it is drawn, because the lesson draws it in three
 * goes: the bar and its units, then the two sets of tenths, then the
 * diagonals. A student who is handed the finished instrument learns nothing.
 */
export function diagonalScale(spec: DiagonalScaleSpec): DiagonalScale {
  const { at, height, units, unitMm } = spec;
  const zeroX = at.x + unitMm;
  const right = zeroX + units * unitMm;
  const bottom = at.y + height;
  const subMm = unitMm / 10;

  const frame: Mark[] = [
    poly([pt(at.x, at.y), pt(right, at.y), pt(right, bottom), pt(at.x, bottom)], 'outline', true),
  ];
  for (let index = 0; index <= units; index += 1) {
    const x = zeroX + index * unitMm;
    frame.push(line(pt(x, at.y), pt(x, bottom), 'thin'));
  }

  const rows: number[] = [];
  const tenths: Mark[] = [];
  for (let index = 0; index <= 10; index += 1) {
    const y = bottom - (index * height) / 10;
    rows.push(y);
    if (index > 0 && index < 10) tenths.push(line(pt(at.x, y), pt(right, y), 'thin'));
  }
  for (let index = 1; index < 10; index += 1) {
    const x = zeroX - index * subMm;
    tenths.push(line(pt(x, bottom), pt(x, bottom - height / 10), 'thin'));
    tenths.push(line(pt(x, at.y), pt(x, at.y + height / 10), 'thin'));
  }

  // The diagonals: bottom division j to top division j + 1.
  const diagonals: Mark[] = [];
  for (let index = 0; index <= 9; index += 1) {
    diagonals.push(line(pt(zeroX - index * subMm, bottom), pt(zeroX - (index + 1) * subMm, at.y), 'thin'));
  }

  const labels: Mark[] = [];
  spec.unitLabels.forEach((label, index) => {
    labels.push(text(pt(zeroX + index * unitMm, bottom + 4.2), label, 3, { align: 'center' }));
  });
  for (let index = 2; index <= 10; index += 2) {
    labels.push(text(pt(at.x - 4, bottom - (index * height) / 10), String(index), 2.4, { align: 'right' }));
  }
  labels.push(text(pt(zeroX - unitMm / 2, at.y - 4), spec.subName, 2.6, { align: 'center', colour: '#64748b' }));
  labels.push(text(pt((zeroX + right) / 2, bottom + 9.5), spec.unitName, 2.8, { align: 'center', colour: '#64748b' }));
  labels.push(text(pt(at.x - 4, bottom + 6), spec.hundredthName, 2.4, { align: 'right', colour: '#64748b' }));

  return {
    marks: [...frame, ...tenths, ...diagonals, ...labels],
    zeroX,
    unitMm,
    rows,
    subMm,
    frame,
    tenths,
    diagonals,
    labels,
  };
}

/* ============================================== stretch-outs and ordinates */

export interface Station {
  /** Which of the equal parts of the circle this is, 0-based. */
  index: number;
  /** Angle round the plan, in protractor degrees. */
  angle: number;
  /** Distance along the stretch-out from the seam, in mm. */
  along: number;
  /** Offset of this element from the axis, across the sheet, in mm. */
  offset: number;
}

/**
 * The twelve (or however many) equal parts a plater divides a circle into, and
 * where each one lands on the flat sheet.
 *
 * `along` walks the true circumference, πD, so the stretch-out really is the
 * girth of the pipe. `offset` is what that element measures from the axis when
 * you look at the elevation, which is what sets its length at the cut.
 *
 * The seam is put on the **shortest** element — index 0 sits at 180°, the far
 * side of the plan — because that is where a plater puts it: the shortest
 * element is the least awkward joint to weld and the least wasteful to mark off.
 */
export function stations(radius: number, count = 12, seamAngle = 180): Station[] {
  const step = 360 / count;
  const girth = 2 * Math.PI * radius;
  return Array.from({ length: count + 1 }, (_, index) => {
    const angle = seamAngle + index * step;
    return {
      index,
      angle,
      along: (girth * index) / count,
      offset: radius * Math.cos(rad(angle)),
    };
  });
}

/** The full circumference of a circle — the length of any stretch-out. */
export const girth = (radius: number) => 2 * Math.PI * radius;

/* ------------------------------------------------- cylinder cut by a plane */

/**
 * How long each element of a cylinder is when the cylinder is cut by a plane.
 *
 * The plane is inclined at `angle` degrees to a section square across the axis,
 * and passes through the axis at `atAxis` measured along it. An element that
 * stands `offset` from the axis is therefore cut at
 *
 *     length = atAxis + offset · tan(angle)
 *
 * and nothing else. Plot that against the stretch-out and the curve you get is
 * a sine curve — which is why the development of every mitre, every raked
 * funnel and every elbow in this course is the same shape.
 */
export const cutLength = (atAxis: number, offset: number, angle: number) =>
  atAxis + offset * Math.tan(rad(angle));

/**
 * The development curve of a cylinder cut by one plane, sampled from the
 * equation rather than joined up between the twelve plotted points.
 */
export function cutCylinderCurve(
  origin: Pt,
  radius: number,
  atAxis: number,
  angle: number,
  seamAngle = 180,
  steps = 144
): Pt[] {
  const total = girth(radius);
  return sampleCurve(0, 1, steps, (t) => {
    const along = total * t;
    const round = seamAngle + t * 360;
    return pt(origin.x + along, origin.y - cutLength(atAxis, radius * Math.cos(rad(round)), angle));
  });
}

/* ------------------------------------- two cylinders of equal diameter, 90° */

/**
 * Where a branch meets a main pipe of the **same** diameter at a right angle.
 *
 * Put the main pipe's axis along x and the branch's straight down it. A point
 * on the branch at angle φ round its plan sits `r·sin φ` off the main pipe's
 * axis, and the main pipe's surface is there at a height `√(r² − r²sin²φ)`,
 * which is `r·|cos φ|`. So the branch is cut to
 *
 *     length = height − r·|cos φ|
 *
 * The two ends of that are `height` and `height − r`, and in the elevation the
 * joint comes out as two straight lines at 45° — the one case in the whole
 * subject where the curve of intersection is straight, and the reason equal
 * diameters are the first junction anybody is taught.
 */
export const branchCut = (height: number, radius: number, angle: number) =>
  height - radius * Math.abs(Math.cos(rad(angle)));

export function branchCurve(origin: Pt, radius: number, height: number, seamAngle = 180, steps = 144): Pt[] {
  const total = girth(radius);
  return sampleCurve(0, 1, steps, (t) =>
    pt(origin.x + total * t, origin.y - branchCut(height, radius, seamAngle + t * 360))
  );
}

/* ------------------------------------------- small cylinder on a big shell */

/**
 * A dome (or a branch, or a manhole) of radius `r` standing square on a boiler
 * shell of radius `R`, both axes crossing.
 *
 * At angle φ round the dome, the point sits `r·sin φ` across the shell, and the
 * shell's surface is `√(R² − r²sin²φ)` above the shell's axis. Measure the
 * plate from a datum `height` above that axis and the dome plate is cut to
 *
 *     length = height − √(R² − r² sin²φ)
 *
 * With R = r that collapses back to the equal-diameter case above, which is a
 * fair check that it is right.
 */
export const saddleCut = (height: number, shellRadius: number, radius: number, angle: number) =>
  height - Math.sqrt(Math.max(0, shellRadius * shellRadius - (radius * Math.sin(rad(angle))) ** 2));

export function saddleCurve(
  origin: Pt,
  radius: number,
  shellRadius: number,
  height: number,
  seamAngle = 180,
  steps = 160
): Pt[] {
  const total = girth(radius);
  return sampleCurve(0, 1, steps, (t) =>
    pt(origin.x + total * t, origin.y - saddleCut(height, shellRadius, radius, seamAngle + t * 360))
  );
}

/** The seat the dome cuts in the shell, seen looking down on the shell. */
export function saddleHoleInShell(centre: Pt, radius: number, shellRadius: number, steps = 96): Pt[] {
  return sampleCurve(0, 360, steps, (angle) => {
    const across = radius * Math.sin(rad(angle));
    // Along the shell the hole opens out, because the plate is curved away.
    const alongTrue = radius * Math.cos(rad(angle));
    const opened = shellRadius * Math.asin(Math.min(1, Math.max(-1, across / shellRadius)));
    return pt(centre.x + opened, centre.y - alongTrue);
  });
}

/* ================================================================== cones */

export interface ConeDevelopment {
  /** True length of the slant side of the full cone, apex to base. */
  slant: number;
  /** Slant length from the apex to the small end of the frustum. */
  innerSlant: number;
  /** The angle the flat pattern subtends at the apex, in degrees. */
  sector: number;
  /** Rise of the outer arc over its own chord, in mm. */
  rise: number;
  /** Chord across the outer arc, in mm. */
  chord: number;
}

/**
 * Everything about a cone's flat pattern, from the two diameters and the height.
 *
 * The apex is `height · R / (R − r)` above the big end, the slant is
 * `√(R² + apexHeight²)`, and the pattern is a sector of
 *
 *     360° · R / slant
 *
 * because the arc it strikes, `slant · θ`, has to come out as the girth of the
 * big end, `2πR`. Take a frustum's small end off the same apex and the pattern
 * is that sector with its middle cut out.
 */
export function coneDevelopment(bigRadius: number, smallRadius: number, height: number): ConeDevelopment {
  const taper = bigRadius - smallRadius;
  const apexHeight = taper === 0 ? Infinity : (height * bigRadius) / taper;
  const slant = Math.sqrt(bigRadius * bigRadius + apexHeight * apexHeight);
  const innerSlant = taper === 0 ? slant : slant * (smallRadius / bigRadius);
  const sector = (360 * bigRadius) / slant;
  const chord = 2 * slant * Math.sin(rad(sector / 2));
  const rise = slant - Math.sqrt(Math.max(0, slant * slant - (chord / 2) ** 2));
  return { slant, innerSlant, sector, rise, chord };
}

/**
 * The plater's two arc formulae, which is what topic "rise and radius" is
 * about. Given a chord and the rise of the arc over it,
 *
 *     R = c² / 8v  +  v / 2
 *
 * and turned round, the rise of an arc of known radius over a known chord is
 *
 *     v = R − √(R² − (c/2)²)
 *
 * They matter because a development arc is routinely bigger than the beam
 * compass, and three points and a batten are how it gets drawn anyway.
 */
export const radiusFromChordAndRise = (chord: number, rise: number) =>
  (chord * chord) / (8 * rise) + rise / 2;

export const riseFromChordAndRadius = (chord: number, radius: number) =>
  radius - Math.sqrt(Math.max(0, radius * radius - (chord / 2) ** 2));

/* ================================================ surfaces of revolution */

export interface MeridianStation {
  /** Distance of this station from the axis. */
  radius: number;
  /** Distance walked along the meridian from the crown. */
  along: number;
  /** Height of the station above the base of the end. */
  rise: number;
}

/**
 * Walks a meridian — the curve you would get by slicing a dome down the middle —
 * recording how far round it you have gone and how far out from the axis you are.
 *
 * `at(t)` gives the profile as {radius, rise} for t from 0 at the crown to 1 at
 * the joint. The arc length is added up in small steps, which is honest: the
 * meridian of an egg end is an ellipse, and an ellipse has no closed-form arc
 * length to be clever with.
 */
export function meridian(at: (t: number) => { radius: number; rise: number }, steps = 240): MeridianStation[] {
  const out: MeridianStation[] = [];
  let along = 0;
  let previous = at(0);
  out.push({ radius: previous.radius, rise: previous.rise, along: 0 });
  for (let index = 1; index <= steps; index += 1) {
    const current = at(index / steps);
    along += Math.hypot(current.radius - previous.radius, current.rise - previous.rise);
    out.push({ radius: current.radius, rise: current.rise, along });
    previous = current;
  }
  return out;
}

/**
 * One gore — one of the orange-peel segments a dome is plated with.
 *
 * At every station the segment has to carry its share of that circle of
 * latitude, so its half-width is `π · radius / gores`. Its length is the arc
 * length of the meridian, unrolled straight. Both halves are returned as one
 * closed outline, crown at the top.
 */
export function goreOutline(origin: Pt, stationsOnMeridian: MeridianStation[], gores: number): Pt[] {
  const halfWidth = (station: MeridianStation) => (Math.PI * station.radius) / gores;
  const right = stationsOnMeridian.map((station) =>
    pt(origin.x + halfWidth(station), origin.y + station.along)
  );
  const left = [...stationsOnMeridian]
    .reverse()
    .map((station) => pt(origin.x - halfWidth(station), origin.y + station.along));
  return [...right, ...left];
}

/** The profile of a hemispherical dome of radius R, crown at t = 0. */
export const domeProfile = (R: number) => (t: number) => ({
  radius: R * Math.sin(rad(90 * t)),
  rise: R * (1 - Math.cos(rad(90 * t))),
});

/**
 * The profile of an egg end: a semi-ellipse of semi-axes `R` across and `depth`
 * along the boiler. Real egg-ended boilers were struck with two radii rather
 * than a true ellipse, but the ellipse is the shape the plates are set out to
 * and it is what a drawing office would draw.
 */
export const eggProfile = (R: number, depth: number) => (t: number) => ({
  radius: R * Math.sin(rad(90 * t)),
  rise: depth * (1 - Math.cos(rad(90 * t))),
});

/** The meridian curve drawn on an elevation, for showing where a gore came from. */
export function meridianOutline(apex: Pt, stationsOnMeridian: MeridianStation[], sign = 1): Pt[] {
  return stationsOnMeridian.map((station) => pt(apex.x + sign * station.radius, apex.y + station.rise));
}

/* ============================================================== bend work */

/**
 * The length of plate a bend eats, worked on the neutral line.
 *
 * `blank = straight + straight + (π/180)·angle·(radius + k·thickness)`, with k
 * taken as 0.5 for the hot-flanged plate work this course is about. Get this
 * wrong and a flanged boiler front comes out short all the way round.
 */
export const bendAllowance = (angle: number, radius: number, thickness: number, k = 0.5) =>
  rad(angle) * (radius + k * thickness);

/* ====================================================== drawing furniture */

/** Ordinate lines dropped from a set of points onto a line, as construction. */
export function ordinates(from: Pt[], toY: number, style: LineStyle = 'construction'): Mark[] {
  return from.map((point) => line(point, pt(point.x, toY), style));
}

/** Horizontal transfer lines, for carrying a height across the sheet. */
export function transfers(from: Pt[], toX: number, style: LineStyle = 'construction'): Mark[] {
  return from.map((point) => line(point, pt(toX, point.y), style));
}

/** Numbered tick marks round a plan circle — 1 to 12 the way a plater marks off. */
export function numberedPlan(centre: Pt, radius: number, count = 12, seamAngle = 180): Mark[] {
  const marks: Mark[] = [];
  for (let index = 0; index < count; index += 1) {
    const angle = seamAngle + (index * 360) / count;
    const on = polar(centre, radius, angle);
    marks.push({ kind: 'dot', style: 'construction', at: on });
    marks.push(text(polar(centre, radius + 5, angle), String(index + 1), 2.6, { colour: '#64748b' }));
  }
  return marks;
}

/** A row of station numbers along a stretch-out. */
export function numberedStretchOut(origin: Pt, radius: number, count = 12, below = 5): Mark[] {
  const total = girth(radius);
  const marks: Mark[] = [];
  for (let index = 0; index <= count; index += 1) {
    const x = origin.x + (total * index) / count;
    marks.push(text(pt(x, origin.y + below), String((index % count) + 1), 2.6, { colour: '#64748b' }));
  }
  return marks;
}

/** The seam-to-seam base line of a development, with its girth dimensioned. */
export function stretchOutBase(origin: Pt, radius: number, label?: string): Mark[] {
  const total = girth(radius);
  return [
    line(origin, pt(origin.x + total, origin.y), 'outline'),
    {
      kind: 'dim',
      a: origin,
      b: pt(origin.x + total, origin.y),
      offset: -14,
      label: label ?? `GIRTH ${total.toFixed(1)}`,
    },
  ];
}

/* ================================================== the fabrication sheet */

/**
 * The third angle symbol — the same truncated cone, with the end view drawn on
 * the side third angle puts it. Telling the two apart is an exam question in
 * its own right, so the sheet carries whichever one the lesson is actually
 * working in rather than always carrying first angle.
 */
export function thirdAngleSymbol(centre: Pt, scale = 1): Mark[] {
  const big = 5 * scale;
  const small = 3 * scale;
  const length = 11 * scale;
  const gap = 9 * scale;

  const coneLeft = centre.x + gap - length / 2;
  const coneRight = coneLeft + length;

  return [
    // Elevation on the right, tall end away from the end view.
    {
      kind: 'poly',
      style: 'thin',
      close: true,
      points: [
        pt(coneRight, centre.y - big),
        pt(coneLeft, centre.y - small),
        pt(coneLeft, centre.y + small),
        pt(coneRight, centre.y + big),
      ],
    },
    line(pt(coneLeft - 2.5, centre.y), pt(coneRight + 2.5, centre.y), 'centre'),
    // End view on the left: that is what makes it third angle.
    { kind: 'circle', style: 'thin', c: pt(centre.x - gap, centre.y), r: big },
    { kind: 'circle', style: 'thin', c: pt(centre.x - gap, centre.y), r: small },
    line(pt(centre.x - gap - big - 2.5, centre.y), pt(centre.x - gap + big + 2.5, centre.y), 'centre'),
    line(pt(centre.x - gap, centre.y - big - 2.5), pt(centre.x - gap, centre.y + big + 2.5), 'centre'),
  ];
}

export interface SheetSpec {
  title: string;
  number: string;
  scale?: string;
  /** Which projection symbol the sheet carries. */
  angle?: 'first' | 'third';
}

/**
 * The sheet a fabrication lesson opens on: bordered, titled, and carrying the
 * projection symbol the lesson actually works in.
 *
 * Deliberately not `preparedSheet` from the drawing course — that one is fixed
 * at 1:1 and first angle, and half of this course is about the scale box and
 * the other half swaps to third angle.
 */
export function fabSheet(spec: SheetSpec): Mark[] {
  return [
    ...frameMarks(),
    ...titleBlockMarks(),
    ...titleBlockLettering({
      name: 'YOUR NAME',
      course: 'FABRICATION ENG.',
      title: spec.title,
      scale: spec.scale ?? '1:1',
      date: 'TODAY',
      number: spec.number,
    }),
    ...(spec.angle === 'third'
      ? thirdAngleSymbol(pt(390, 276), 0.62)
      : projectionSymbol(pt(390, 276), 0.62)),
  ];
}
