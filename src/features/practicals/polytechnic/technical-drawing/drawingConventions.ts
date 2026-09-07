/**
 * Conventional representations — the shorthand every engineering drawing uses
 * so that long, repetitive or fine detail does not have to be drawn in full.
 *
 * These are the conventions in BS 308 / BS 8888 and ISO 2162 (springs), built
 * out of the same millimetre geometry as everything else on the board: a break
 * line really is a wave through the section, hatching really is a set of 45°
 * lines clipped to the cut face, a spline tooth really is a straight-sided
 * flank standing on the root circle. Nothing here is a decorative squiggle.
 */

import {
  polar,
  pt,
  rad,
  type Mark,
  type Pt,
  type LineStyle,
} from './drawingGeometry';

/* ------------------------------------------------------------- break lines */

/**
 * One wave of a break line, running from `top` down to `bottom` and bulging
 * `bulge` mm each side of the straight path. This is the S the convention asks
 * for on a solid round bar: out one side, back through the middle, out the
 * other side.
 */
export function breakWave(top: Pt, bottom: Pt, bulge: number, samples = 26): Pt[] {
  return Array.from({ length: samples + 1 }, (_, index) => {
    const t = index / samples;
    return {
      x: top.x + (bottom.x - top.x) * t + bulge * Math.sin(2 * Math.PI * t),
      y: top.y + (bottom.y - top.y) * t,
    };
  });
}

/**
 * The conventional break in a **solid round bar**: a single S wave across the
 * full diameter. The bulge is taken as a fifth of the diameter, which is what
 * it looks like drawn freehand on the bench.
 */
export function roundBarBreak(centre: Pt, radius: number, style: LineStyle = 'outline'): Mark[] {
  return [
    {
      kind: 'poly',
      style,
      points: breakWave(pt(centre.x, centre.y - radius), pt(centre.x, centre.y + radius), radius * 0.42),
    },
  ];
}

/**
 * The conventional break in a **tube**: the same wave on the two walls, so the
 * bore is left open between them and the wall thickness reads at a glance.
 */
export function tubeBreak(
  centre: Pt,
  outerRadius: number,
  innerRadius: number,
  style: LineStyle = 'outline'
): Mark[] {
  const wall = (outer: number, inner: number, sign: number): Mark => ({
    kind: 'poly',
    style,
    points: breakWave(
      pt(centre.x, centre.y + sign * outer),
      pt(centre.x, centre.y + sign * inner),
      sign * (outer - inner) * 0.55
    ),
  });
  return [wall(outerRadius, innerRadius, -1), wall(outerRadius, innerRadius, 1)];
}

/**
 * The zigzag break used on flat and rectangular material: a straight line with
 * one sharp z in the middle of it.
 */
export function zigzagBreak(a: Pt, b: Pt, amplitude = 3, style: LineStyle = 'thin'): Mark {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const nx = -dy / Math.hypot(dx, dy);
  const ny = dx / Math.hypot(dx, dy);
  const at = (t: number, side: number): Pt => ({
    x: a.x + dx * t + nx * amplitude * side,
    y: a.y + dy * t + ny * amplitude * side,
  });
  return {
    kind: 'poly',
    style,
    points: [a, at(0.42, 0), at(0.5, 1), at(0.5, -1), at(0.58, 0), b],
  };
}

/* ----------------------------------------------------------------- hatching */

/**
 * Section hatching: continuous thin lines at 45° to the main outline, evenly
 * spaced. Everything below clips those lines to the shape of the cut face —
 * hatching that runs outside the material is the classic exam howler.
 */
const HATCH_ANGLE = 45;
const HATCH_SPACING = 3.5;

/**
 * Hatches an axis-aligned rectangle at any angle.
 *
 * The family of parallel lines is stepped along the normal to the hatch
 * direction and each one is clipped to the rectangle by the slab method, so the
 * angle can be 45° one way for one part and 135° the other way for the part
 * next to it — which is exactly what two mating parts in one section need.
 */
export function hatchRect(
  x: number,
  y: number,
  width: number,
  height: number,
  angle = HATCH_ANGLE,
  spacing = HATCH_SPACING
): Mark[] {
  const dir = { x: Math.cos(rad(angle)), y: -Math.sin(rad(angle)) };
  const normal = { x: -dir.y, y: dir.x };
  const corners = [
    { x, y },
    { x: x + width, y },
    { x, y: y + height },
    { x: x + width, y: y + height },
  ];
  const projections = corners.map((corner) => corner.x * normal.x + corner.y * normal.y);
  const from = Math.min(...projections);
  const to = Math.max(...projections);

  const marks: Mark[] = [];
  for (let offset = from + spacing; offset < to; offset += spacing) {
    // A point on this line, and the run of it that lies inside the rectangle.
    const origin = { x: normal.x * offset, y: normal.y * offset };
    let near = -Infinity;
    let far = Infinity;

    const slab = (originComponent: number, dirComponent: number, low: number, high: number) => {
      if (Math.abs(dirComponent) < 1e-9) {
        // Parallel to this pair of edges: either wholly inside or wholly out.
        if (originComponent < low || originComponent > high) {
          near = Infinity;
          far = -Infinity;
        }
        return;
      }
      const t1 = (low - originComponent) / dirComponent;
      const t2 = (high - originComponent) / dirComponent;
      near = Math.max(near, Math.min(t1, t2));
      far = Math.min(far, Math.max(t1, t2));
    };

    slab(origin.x, dir.x, x, x + width);
    slab(origin.y, dir.y, y, y + height);

    if (far - near > 0.05) {
      marks.push({
        kind: 'line',
        style: 'thin',
        a: pt(origin.x + dir.x * near, origin.y + dir.y * near),
        b: pt(origin.x + dir.x * far, origin.y + dir.y * far),
      });
    }
  }
  return marks;
}

/**
 * Hatches a circular cut face — the section through a solid round bar. Each
 * hatch line is a chord, so it stops exactly on the outline.
 */
export function hatchCircle(centre: Pt, radius: number, angle = HATCH_ANGLE, spacing = HATCH_SPACING): Mark[] {
  const marks: Mark[] = [];
  const dirX = Math.cos(rad(angle));
  const dirY = -Math.sin(rad(angle));
  // Perpendicular to the hatch direction, stepped across the circle.
  for (let offset = -radius + spacing; offset < radius; offset += spacing) {
    const half = Math.sqrt(Math.max(0, radius * radius - offset * offset));
    const base = { x: centre.x - dirY * offset, y: centre.y + dirX * offset };
    marks.push({
      kind: 'line',
      style: 'thin',
      a: pt(base.x - dirX * half, base.y - dirY * half),
      b: pt(base.x + dirX * half, base.y + dirY * half),
    });
  }
  return marks;
}

/**
 * Hatches the ring left when a tube is cut: the same chords, with the part
 * crossing the bore taken out, so each line becomes two short ones.
 */
export function hatchAnnulus(
  centre: Pt,
  outerRadius: number,
  innerRadius: number,
  angle = HATCH_ANGLE,
  spacing = HATCH_SPACING
): Mark[] {
  const marks: Mark[] = [];
  const dirX = Math.cos(rad(angle));
  const dirY = -Math.sin(rad(angle));
  for (let offset = -outerRadius + spacing; offset < outerRadius; offset += spacing) {
    const outerHalf = Math.sqrt(Math.max(0, outerRadius * outerRadius - offset * offset));
    const base = { x: centre.x - dirY * offset, y: centre.y + dirX * offset };
    const along = (d: number) => pt(base.x + dirX * d, base.y + dirY * d);

    if (Math.abs(offset) >= innerRadius) {
      marks.push({ kind: 'line', style: 'thin', a: along(-outerHalf), b: along(outerHalf) });
      continue;
    }
    const innerHalf = Math.sqrt(Math.max(0, innerRadius * innerRadius - offset * offset));
    marks.push({ kind: 'line', style: 'thin', a: along(-outerHalf), b: along(-innerHalf) });
    marks.push({ kind: 'line', style: 'thin', a: along(innerHalf), b: along(outerHalf) });
  }
  return marks;
}

/* ------------------------------------------------------------------ springs */

export interface SpringSpec {
  /** Centre of the spring's axis at the top of the coils. */
  top: Pt;
  /** Mean coil diameter — the diameter the wire's centre travels on. */
  meanDiameter: number;
  /** Wire diameter. */
  wire: number;
  /** Distance from one coil to the next, measured along the axis. */
  pitch: number;
  /** Number of full coils drawn. */
  coils: number;
}

/**
 * A helical **compression** spring in its conventional straight-line form: the
 * helix is drawn as inclined straight lines rather than curves, front coils one
 * way and back coils the other, with the end coils closed and ground flat so
 * the spring stands square. Working from the mean diameter means the outside
 * diameter comes out right: OD = mean + wire.
 */
export function compressionSpring(spec: SpringSpec, style: LineStyle = 'outline'): Mark[] {
  const { top, meanDiameter, wire, pitch, coils } = spec;
  const half = meanDiameter / 2;
  const left = top.x - half;
  const right = top.x + half;
  const marks: Mark[] = [];

  // Closed and ground ends: the first and last half coils lie flat.
  marks.push({ kind: 'line', style, a: pt(left, top.y), b: pt(right, top.y) });

  for (let coil = 0; coil < coils; coil += 1) {
    const y = top.y + coil * pitch;
    // Front of the coil: left up to right, half a pitch lower.
    marks.push({ kind: 'line', style, a: pt(left, y), b: pt(right, y + pitch / 2) });
    // Back of the coil: right across to left, completing the turn.
    marks.push({ kind: 'line', style, a: pt(right, y + pitch / 2), b: pt(left, y + pitch) });
  }

  const bottom = top.y + coils * pitch;
  marks.push({ kind: 'line', style, a: pt(left, bottom), b: pt(right, bottom) });

  // The wire has thickness: the outside and inside envelopes are what a fitter
  // measures, so they are drawn as the limits of the coils.
  const outer = half + wire / 2;
  marks.push({ kind: 'line', style: 'thin', a: pt(top.x - outer, top.y), b: pt(top.x - outer, bottom) });
  marks.push({ kind: 'line', style: 'thin', a: pt(top.x + outer, top.y), b: pt(top.x + outer, bottom) });

  return marks;
}

/**
 * A helical **tension** spring: the same helix, but wound with the coils
 * touching, so the pitch equals the wire diameter and there is no gap between
 * one turn and the next. The loops at the ends are what the load pulls on.
 */
export function tensionSpring(spec: SpringSpec, style: LineStyle = 'outline'): Mark[] {
  const { top, meanDiameter, wire, coils } = spec;
  const half = meanDiameter / 2;
  const left = top.x - half;
  const right = top.x + half;
  const pitch = wire; // coils touch
  const marks: Mark[] = [];

  for (let coil = 0; coil < coils; coil += 1) {
    const y = top.y + coil * pitch;
    marks.push({ kind: 'line', style, a: pt(left, y), b: pt(right, y + pitch / 2) });
    marks.push({ kind: 'line', style, a: pt(right, y + pitch / 2), b: pt(left, y + pitch) });
  }

  const bottom = top.y + coils * pitch;
  const loop = half * 0.8;
  // A full loop at each end, standing in the plane of the spring.
  marks.push({ kind: 'arc', style, c: pt(top.x, top.y - loop), r: loop, from: -30, to: 210 });
  marks.push({ kind: 'arc', style, c: pt(top.x, bottom + loop), r: loop, from: 150, to: 390 });

  return marks;
}

/* -------------------------------------------------------- splines and serrations */

export interface SplineSpec {
  centre: Pt;
  /** Outside diameter of the splines — the tips on a shaft. */
  majorDiameter: number;
  /** Root diameter — the bottom of the spaces on a shaft. */
  minorDiameter: number;
  /** How many splines are cut round the shaft. */
  count: number;
}

/**
 * The end view of a **straight-sided external spline** (the SAE form used on
 * gearbox and propshaft ends). The flanks of every tooth are parallel to the
 * tooth's own centre line — they are not radial — and they stand on the root
 * circle, so the tooth is a rectangle of width `w` capped by the major arc.
 * For the six-spline form `w` is a quarter of the major diameter.
 */
export function externalSplineEndView(spec: SplineSpec, style: LineStyle = 'outline'): Mark[] {
  const { centre, majorDiameter, minorDiameter, count } = spec;
  const major = majorDiameter / 2;
  const minor = minorDiameter / 2;
  const width = majorDiameter * 0.25;
  const marks: Mark[] = [];

  for (let index = 0; index < count; index += 1) {
    const axis = (index * 360) / count;
    // Along the tooth's centre line, and across it.
    const across = axis + 90;
    const flank = width / 2;

    // Where each flank leaves the root circle and where it meets the tip arc.
    const rootOffset = Math.sqrt(Math.max(0, minor * minor - flank * flank));
    const tipOffset = Math.sqrt(Math.max(0, major * major - flank * flank));

    const side = (sign: number) => {
      const foot = polar(polar(centre, rootOffset, axis), sign * flank, across);
      const tip = polar(polar(centre, tipOffset, axis), sign * flank, across);
      return { foot, tip };
    };

    const a = side(1);
    const b = side(-1);
    marks.push({ kind: 'line', style, a: a.foot, b: a.tip });
    marks.push({ kind: 'line', style, a: b.foot, b: b.tip });

    // The tip of the tooth is an arc of the major circle between the flanks.
    const tipHalfAngle = Math.asin(flank / major) * (180 / Math.PI);
    marks.push({ kind: 'arc', style, c: centre, r: major, from: axis - tipHalfAngle, to: axis + tipHalfAngle });

    // …and the space between this tooth and the next is an arc of the root.
    const rootHalfAngle = Math.asin(flank / minor) * (180 / Math.PI);
    marks.push({
      kind: 'arc',
      style,
      c: centre,
      r: minor,
      from: axis + rootHalfAngle,
      to: axis + 360 / count - rootHalfAngle,
    });
  }

  return marks;
}

/**
 * The end view of an **internal spline** — the hub that the shaft above slides
 * into. It is the same profile turned inside out: the teeth of the hub run into
 * the spaces of the shaft, so the hub's minor diameter is the tip circle.
 */
export function internalSplineEndView(
  spec: SplineSpec & { hubDiameter: number },
  style: LineStyle = 'outline'
): Mark[] {
  const { centre, hubDiameter } = spec;
  return [
    { kind: 'circle', style, c: centre, r: hubDiameter / 2 },
    ...externalSplineEndView(spec, style),
  ];
}

/**
 * The end view of a **serrated shaft**: the same idea as a spline but with many
 * fine vee teeth instead of a few square ones. The flanks are radial and the
 * included angle is 60°, so each tooth is a triangle standing on the root
 * circle.
 */
export function serrationEndView(
  centre: Pt,
  majorDiameter: number,
  minorDiameter: number,
  count: number,
  style: LineStyle = 'outline'
): Mark[] {
  const major = majorDiameter / 2;
  const minor = minorDiameter / 2;
  const step = 360 / count;
  const points: Pt[] = [];

  for (let index = 0; index < count; index += 1) {
    const axis = index * step;
    points.push(polar(centre, minor, axis - step / 2));
    points.push(polar(centre, major, axis));
  }

  return [{ kind: 'poly', style, close: true, points }];
}
