/**
 * Circuit symbols — hydraulic, pneumatic and auto-electrical.
 *
 * A circuit diagram is not a picture of the machine. It is a drawing of what is
 * connected to what, built from symbols everybody has agreed on (ISO 1219 for
 * fluid power, and the usual automotive symbols for the wiring). A pump is a
 * circle with a filled triangle pointing out of it whether it is the size of a
 * fist or the size of a drum, and the line between two components says nothing
 * about how long the pipe is.
 *
 * Every symbol below is drawn about a centre so it can be dropped anywhere on
 * the sheet, and each one is the size the standard draws it at relative to its
 * neighbours.
 */

import { polar, pt, type Mark, type Pt } from './drawingGeometry';

/** A pipe run. Working lines are continuous; pilot and drain lines are dashed. */
export function pipe(points: Pt[], style: Mark['style'] = 'outline'): Mark {
  return { kind: 'poly', style, points };
}

/** The arrowhead that shows which way the fluid or the drive is going. */
export function flowArrow(at: Pt, angle: number, size = 4): Mark {
  return {
    kind: 'poly',
    style: 'outline',
    close: true,
    points: [polar(at, size, angle), polar(at, size, angle + 140), polar(at, size, angle - 140)],
  };
}

/**
 * A hydraulic pump: a circle with a solid triangle pointing out along the
 * delivery line. Two triangles would make it a bi-directional pump.
 */
export function pump(centre: Pt, r = 10, angle = 0): Mark[] {
  return [
    { kind: 'circle', style: 'outline', c: centre, r },
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [polar(centre, r, angle), polar(centre, r * 0.55, angle + 118), polar(centre, r * 0.55, angle - 118)],
    },
  ];
}

/** A motor is a pump with the triangle pointing in. */
export function hydraulicMotor(centre: Pt, r = 10, angle = 180): Mark[] {
  return pump(centre, r, angle);
}

/** The reservoir: an open-topped box. Return lines end above the fluid. */
export function reservoir(topLeft: Pt, width = 40, height = 16): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'outline',
      points: [
        pt(topLeft.x, topLeft.y),
        pt(topLeft.x, topLeft.y + height),
        pt(topLeft.x + width, topLeft.y + height),
        pt(topLeft.x + width, topLeft.y),
      ],
    },
  ];
}

/**
 * A double-acting cylinder: the barrel, the piston and the rod out of one end.
 * `stroke` is how far along the barrel the piston sits.
 */
export function cylinder(
  topLeft: Pt,
  length = 60,
  bore = 22,
  strokeFraction = 0.45,
  rodRight = true
): Mark[] {
  const pistonX = topLeft.x + length * strokeFraction;
  const rodY = topLeft.y + bore / 2;
  return [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(topLeft.x, topLeft.y),
        pt(topLeft.x + length, topLeft.y),
        pt(topLeft.x + length, topLeft.y + bore),
        pt(topLeft.x, topLeft.y + bore),
      ],
    },
    // Piston and rod.
    { kind: 'line', style: 'outline', a: pt(pistonX, topLeft.y), b: pt(pistonX, topLeft.y + bore) },
    {
      kind: 'line',
      style: 'outline',
      a: pt(pistonX, rodY),
      b: rodRight ? pt(topLeft.x + length + 22, rodY) : pt(topLeft.x - 22, rodY),
    },
  ];
}

/**
 * A single-acting spring-return cylinder — the ram on a tipper, drawn upright.
 */
export function ramCylinder(base: Pt, length = 60, bore = 20, extension = 0.5): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(base.x - bore / 2, base.y),
        pt(base.x + bore / 2, base.y),
        pt(base.x + bore / 2, base.y - length),
        pt(base.x - bore / 2, base.y - length),
      ],
    },
    { kind: 'line', style: 'outline', a: pt(base.x - bore / 2, base.y - length * extension), b: pt(base.x + bore / 2, base.y - length * extension) },
    { kind: 'line', style: 'outline', a: pt(base.x, base.y - length * extension), b: pt(base.x, base.y - length - 26) },
  ];
}

/**
 * A directional control valve: `positions` boxes side by side, each one showing
 * how the ports are joined when that box is pushed across into the pipe run.
 */
export function valve(topLeft: Pt, positions = 3, box = 22): Mark[] {
  const marks: Mark[] = [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(topLeft.x, topLeft.y),
        pt(topLeft.x + box * positions, topLeft.y),
        pt(topLeft.x + box * positions, topLeft.y + box),
        pt(topLeft.x, topLeft.y + box),
      ],
    },
  ];
  for (let index = 1; index < positions; index += 1) {
    marks.push({
      kind: 'line',
      style: 'outline',
      a: pt(topLeft.x + box * index, topLeft.y),
      b: pt(topLeft.x + box * index, topLeft.y + box),
    });
  }
  return marks;
}

/** Straight-through flow arrows inside one box of a valve. */
export function valveThrough(boxTopLeft: Pt, box = 22): Mark[] {
  const midY = boxTopLeft.y + box / 2;
  return [
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + 3, midY - 5), b: pt(boxTopLeft.x + box - 3, midY - 5) },
    flowArrow(pt(boxTopLeft.x + box - 3, midY - 5), 0, 3),
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + box - 3, midY + 5), b: pt(boxTopLeft.x + 3, midY + 5) },
    flowArrow(pt(boxTopLeft.x + 3, midY + 5), 180, 3),
  ];
}

/** Crossed flow arrows — the box that reverses the cylinder. */
export function valveCrossed(boxTopLeft: Pt, box = 22): Mark[] {
  return [
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + 3, boxTopLeft.y + 5), b: pt(boxTopLeft.x + box - 3, boxTopLeft.y + box - 5) },
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + 3, boxTopLeft.y + box - 5), b: pt(boxTopLeft.x + box - 3, boxTopLeft.y + 5) },
  ];
}

/** A blocked port — the box that holds the cylinder still. */
export function valveBlocked(boxTopLeft: Pt, box = 22): Mark[] {
  const midY = boxTopLeft.y + box / 2;
  return [
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + 4, midY - 5), b: pt(boxTopLeft.x + box - 4, midY - 5) },
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + 4, midY + 5), b: pt(boxTopLeft.x + box - 4, midY + 5) },
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + box / 2, midY - 8), b: pt(boxTopLeft.x + box / 2, midY - 2) },
    { kind: 'line', style: 'outline', a: pt(boxTopLeft.x + box / 2, midY + 2), b: pt(boxTopLeft.x + box / 2, midY + 8) },
  ];
}

/** A relief valve: a box with an arrow held shut by a spring. */
export function reliefValve(topLeft: Pt, box = 20): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(topLeft.x, topLeft.y),
        pt(topLeft.x + box, topLeft.y),
        pt(topLeft.x + box, topLeft.y + box),
        pt(topLeft.x, topLeft.y + box),
      ],
    },
    { kind: 'line', style: 'outline', a: pt(topLeft.x + box / 2, topLeft.y + box - 3), b: pt(topLeft.x + box / 2, topLeft.y + 5) },
    flowArrow(pt(topLeft.x + box / 2, topLeft.y + 5), 90, 3.4),
    // The spring that holds it closed.
    {
      kind: 'poly',
      style: 'outline',
      points: [
        pt(topLeft.x + box, topLeft.y + box / 2),
        pt(topLeft.x + box + 4, topLeft.y + box / 2 - 4),
        pt(topLeft.x + box + 8, topLeft.y + box / 2 + 4),
        pt(topLeft.x + box + 12, topLeft.y + box / 2 - 4),
        pt(topLeft.x + box + 16, topLeft.y + box / 2),
      ],
    },
  ];
}

/** A filter or strainer: a diamond with a dashed line across it. */
export function filter(centre: Pt, size = 9): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(centre.x, centre.y - size),
        pt(centre.x + size, centre.y),
        pt(centre.x, centre.y + size),
        pt(centre.x - size, centre.y),
      ],
    },
    { kind: 'line', style: 'hidden', a: pt(centre.x - size, centre.y), b: pt(centre.x + size, centre.y) },
  ];
}

/** An air receiver or accumulator: a capsule standing on end. */
export function receiver(centre: Pt, width = 24, height = 40): Mark[] {
  const half = width / 2;
  return [
    { kind: 'line', style: 'outline', a: pt(centre.x - half, centre.y - height / 2 + half), b: pt(centre.x - half, centre.y + height / 2 - half) },
    { kind: 'line', style: 'outline', a: pt(centre.x + half, centre.y - height / 2 + half), b: pt(centre.x + half, centre.y + height / 2 - half) },
    { kind: 'arc', style: 'outline', c: pt(centre.x, centre.y - height / 2 + half), r: half, from: 0, to: 180 },
    { kind: 'arc', style: 'outline', c: pt(centre.x, centre.y + height / 2 - half), r: half, from: 180, to: 360 },
  ];
}

/* ------------------------------------------------------------- electrical */

/** A battery: long thin plate positive, short thick plate negative. */
export function battery(centre: Pt, cells = 3): Mark[] {
  const marks: Mark[] = [];
  for (let index = 0; index < cells; index += 1) {
    const x = centre.x - (cells - 1) * 4 + index * 8;
    marks.push({ kind: 'line', style: 'outline', a: pt(x, centre.y - 7), b: pt(x, centre.y + 7) });
    marks.push({ kind: 'line', style: 'outline', a: pt(x + 4, centre.y - 4), b: pt(x + 4, centre.y + 4) });
  }
  return marks;
}

/** A lamp: a circle with a cross through it. */
export function lamp(centre: Pt, r = 7): Mark[] {
  return [
    { kind: 'circle', style: 'outline', c: centre, r },
    { kind: 'line', style: 'outline', a: polar(centre, r, 45), b: polar(centre, r, 225) },
    { kind: 'line', style: 'outline', a: polar(centre, r, 135), b: polar(centre, r, 315) },
  ];
}

/** A switch: a hinged blade lifted off its contact. */
export function switchSymbol(at: Pt, span = 16, closed = false): Mark[] {
  return [
    { kind: 'dot', at },
    { kind: 'dot', at: pt(at.x + span, at.y) },
    {
      kind: 'line',
      style: 'outline',
      a: at,
      b: closed ? pt(at.x + span, at.y) : polar(at, span, 30),
    },
  ];
}

/** A fuse: a small rectangle in the line. */
export function fuse(centre: Pt, width = 16, height = 7): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(centre.x - width / 2, centre.y - height / 2),
        pt(centre.x + width / 2, centre.y - height / 2),
        pt(centre.x + width / 2, centre.y + height / 2),
        pt(centre.x - width / 2, centre.y + height / 2),
      ],
    },
    { kind: 'line', style: 'outline', a: pt(centre.x - width / 2, centre.y), b: pt(centre.x + width / 2, centre.y) },
  ];
}

/** The earth symbol — on a vehicle, the body of the vehicle itself. */
export function earth(at: Pt): Mark[] {
  return [
    { kind: 'line', style: 'outline', a: at, b: pt(at.x, at.y + 6) },
    { kind: 'line', style: 'outline', a: pt(at.x - 7, at.y + 6), b: pt(at.x + 7, at.y + 6) },
    { kind: 'line', style: 'outline', a: pt(at.x - 4.5, at.y + 9), b: pt(at.x + 4.5, at.y + 9) },
    { kind: 'line', style: 'outline', a: pt(at.x - 2, at.y + 12), b: pt(at.x + 2, at.y + 12) },
  ];
}

/** A coil — a relay winding, a solenoid or a motor field. */
export function coil(topLeft: Pt, width = 22, height = 12): Mark[] {
  return [
    {
      kind: 'poly',
      style: 'outline',
      close: true,
      points: [
        pt(topLeft.x, topLeft.y),
        pt(topLeft.x + width, topLeft.y),
        pt(topLeft.x + width, topLeft.y + height),
        pt(topLeft.x, topLeft.y + height),
      ],
    },
    { kind: 'line', style: 'outline', a: pt(topLeft.x, topLeft.y), b: pt(topLeft.x + width, topLeft.y + height) },
  ];
}
