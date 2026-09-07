/**
 * The rest of projection: converting a pictorial view into orthographic, third
 * angle, freehand first angle, circles and ellipses in isometric, the isometric
 * scale, and sectioning in first angle.
 *
 * The circles here are not drawn by eye. `fourCentreArcs` runs the real
 * four-centre construction — the two obtuse corners of the isometric square
 * give the big arcs, and the crossings on the long diagonal give the small ones
 * — so what appears on the board is what the compass would give a student
 * working the same construction on paper.
 */

import {
  bearing,
  dist,
  isoEdgeMarks,
  isoPoint,
  blockIsoVisibleEdges,
  BLOCK,
  blockProfile,
  lineIntersection,
  mid,
  polar,
  pt,
  rad,
  shortWayTo,
  v3,
  type Mark,
  type Pt,
} from './drawingGeometry';
import { hatchRect } from './drawingConventions';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/* ------------------------------------------------- the isometric circle */

/** The four corners of the isometric square a circle of `d` sits in. */
export function isoSquare(centre: Pt, d: number, axisA: number, axisB: number): Pt[] {
  const a = d / 2;
  const u = (angle: number, r: number) => polar(pt(0, 0), r, angle);
  const ua = u(axisA, a);
  const ub = u(axisB, a);
  const add = (...points: Pt[]) =>
    points.reduce((sum, p) => pt(sum.x + p.x, sum.y + p.y), pt(centre.x, centre.y));
  const neg = (p: Pt) => pt(-p.x, -p.y);
  return [add(ua, ub), add(ua, neg(ub)), add(neg(ua), neg(ub)), add(neg(ua), ub)];
}

interface CentreArc {
  centre: Pt;
  radius: number;
  from: number;
  to: number;
}

/**
 * The four-centre construction for a circle lying in an isometric face.
 *
 * The two blunt corners of the rhombus are the centres of the two long arcs,
 * each swung from the midpoint of one far side to the midpoint of the other.
 * Lines from those corners to the same midpoints cross on the long diagonal,
 * and those crossings are the centres of the two short arcs. The result is
 * tangential at all four midpoints, which is why the approximation looks right.
 */
export function fourCentreArcs(square: Pt[]): CentreArc[] {
  const [p0, p1, p2, p3] = square;
  // The short diagonal joins the blunt corners.
  const shortIs02 = dist(p0, p2) < dist(p1, p3);
  const [blunt1, blunt2] = shortIs02 ? [p0, p2] : [p1, p3];
  const [sharp1, sharp2] = shortIs02 ? [p1, p3] : [p0, p2];

  const m11 = mid(sharp1, blunt2);
  const m12 = mid(sharp2, blunt2);
  const m21 = mid(sharp1, blunt1);
  const m22 = mid(sharp2, blunt1);

  const bigRadius = dist(blunt1, m11);
  const small1 = lineIntersection(blunt1, m11, blunt2, m21) ?? sharp1;
  const small2 = lineIntersection(blunt1, m12, blunt2, m22) ?? sharp2;

  const arc = (centre: Pt, from: Pt, to: Pt): CentreArc => {
    const fromAngle = bearing(centre, from);
    return {
      centre,
      radius: dist(centre, from),
      from: fromAngle,
      to: shortWayTo(fromAngle, bearing(centre, to)),
    };
  };

  return [
    { ...arc(blunt1, m11, m12), radius: bigRadius },
    { ...arc(blunt2, m21, m22), radius: bigRadius },
    arc(small1, m11, m21),
    arc(small2, m12, m22),
  ];
}

const arcMarks = (arcs: CentreArc[], style: Mark['style'] = 'outline'): Mark[] =>
  arcs.map((a) => ({ kind: 'arc', style, c: a.centre, r: a.radius, from: a.from, to: a.to }));

/* ========================================================================= 34
 * Orthographic from a pictorial view
 * ======================================================================= */

const PICT_ORIGIN = pt(78, 96);
const FRONT_ORIGIN = pt(70, 190);
const VIEW_GAP = 34;

const ORTHO_FROM_PICTORIAL: DrawTopic = {
  id: 'ortho-from-pictorial',
  title: 'Orthographic from a pictorial drawing',
  subtitle: 'Turn one picture of a solid into the three flat views.',
  goal: 'Read a pictorial drawing of a solid and produce its front view, plan and end view in first angle projection.',
  minutes: 35,
  level: 'Exam',
  tools: ['T-square', '30/60 set square', '45° set square', 'HB pencil'],
  base: preparedSheet('PICTORIAL TO ORTHOGRAPHIC', '34'),
  steps: [
    {
      id: 'pictorial-read',
      title: 'Read the picture first',
      tool: 'hand',
      focus: { at: PICT_ORIGIN, r: 130 },
      tip: 'Find the three overall sizes on the pictorial before you draw a single line.',
      lines: [
        { text: 'The exam gives you a picture of the solid and asks for the flat views.' },
        { text: 'Before you draw anything, read the picture.' },
        { text: 'How long is it? Eighty. How deep? Fifty. How high? Sixty.' },
        { text: 'And what has been taken out of it? A step, forty long and thirty deep.' },
        { text: 'Those four numbers are the whole job. Everything else follows.' },
      ],
      marks: isoEdgeMarks(PICT_ORIGIN, blockIsoVisibleEdges(), 'outline'),
    },
    {
      id: 'pictorial-front',
      title: 'Choose and draw the front view',
      tool: 'tsquare',
      teeY: FRONT_ORIGIN.y,
      focus: { at: pt(FRONT_ORIGIN.x + 40, FRONT_ORIGIN.y - 30), r: 90 },
      tip: 'The front view is the one that shows the most about the shape — not necessarily the front of the object.',
      lines: [
        { text: 'The front view is not the front of the object. It is the most useful face.' },
        { text: 'Here it is the L shape, because that is what the step makes.' },
        { text: 'Draw it first, and draw it properly. Everything else is projected off it.' },
        { text: 'Eighty along, sixty up, with the forty by thirty step cut out.' },
      ],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: blockProfile(FRONT_ORIGIN) },
        { kind: 'text', at: pt(FRONT_ORIGIN.x + 40, FRONT_ORIGIN.y + 10), text: 'FRONT VIEW', size: 3, align: 'center' },
      ],
    },
    {
      id: 'pictorial-plan',
      title: 'Project the plan',
      tool: 'tsquare',
      teeY: FRONT_ORIGIN.y + VIEW_GAP,
      focus: { at: pt(FRONT_ORIGIN.x + 40, FRONT_ORIGIN.y + VIEW_GAP + 25), r: 90 },
      tip: 'In first angle the plan goes below the front view — you look down, and the view goes on the far side.',
      lines: [
        { text: 'First angle. You look down on it, and the view goes underneath.' },
        { text: 'Project every corner straight down from the front view.', at: pt(FRONT_ORIGIN.x + 40, FRONT_ORIGIN.y + 12) },
        { text: 'The plan is a plain rectangle, eighty by fifty.' },
        { text: 'The step shows as a line across it, because from above you can see the edge.' },
      ],
      marks: [
        { kind: 'line', style: 'construction', a: pt(FRONT_ORIGIN.x, FRONT_ORIGIN.y), b: pt(FRONT_ORIGIN.x, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth) },
        { kind: 'line', style: 'construction', a: pt(FRONT_ORIGIN.x + BLOCK.stepLength, FRONT_ORIGIN.y), b: pt(FRONT_ORIGIN.x + BLOCK.stepLength, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth) },
        { kind: 'line', style: 'construction', a: pt(FRONT_ORIGIN.x + BLOCK.length, FRONT_ORIGIN.y), b: pt(FRONT_ORIGIN.x + BLOCK.length, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth) },
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(FRONT_ORIGIN.x, FRONT_ORIGIN.y + VIEW_GAP),
          pt(FRONT_ORIGIN.x + BLOCK.length, FRONT_ORIGIN.y + VIEW_GAP),
          pt(FRONT_ORIGIN.x + BLOCK.length, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth),
          pt(FRONT_ORIGIN.x, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth),
        ] },
        { kind: 'line', style: 'outline', a: pt(FRONT_ORIGIN.x + BLOCK.stepLength, FRONT_ORIGIN.y + VIEW_GAP), b: pt(FRONT_ORIGIN.x + BLOCK.stepLength, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth) },
        { kind: 'text', at: pt(FRONT_ORIGIN.x + 40, FRONT_ORIGIN.y + VIEW_GAP + BLOCK.depth + 10), text: 'PLAN', size: 3, align: 'center' },
      ],
    },
    {
      id: 'pictorial-end',
      title: 'And the end view',
      tool: 'tsquare',
      teeY: FRONT_ORIGIN.y - BLOCK.height,
      focus: { at: pt(FRONT_ORIGIN.x + 150, FRONT_ORIGIN.y - 30), r: 90 },
      tip: 'In first angle, the view looking from the left is drawn on the right.',
      lines: [
        { text: 'Now look at it from the left-hand end.' },
        { text: 'In first angle, that view goes on the right. The far side, again.' },
        { text: 'Project the heights straight across from the front view.' },
        { text: 'Fifty wide, sixty high, and the step shows as a hidden edge.' },
      ],
      marks: [
        { kind: 'line', style: 'construction', a: pt(FRONT_ORIGIN.x + BLOCK.length, FRONT_ORIGIN.y - BLOCK.height), b: pt(FRONT_ORIGIN.x + 200, FRONT_ORIGIN.y - BLOCK.height) },
        { kind: 'line', style: 'construction', a: pt(FRONT_ORIGIN.x + BLOCK.length, FRONT_ORIGIN.y - BLOCK.stepHeight), b: pt(FRONT_ORIGIN.x + 200, FRONT_ORIGIN.y - BLOCK.stepHeight) },
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(FRONT_ORIGIN.x + 130, FRONT_ORIGIN.y),
          pt(FRONT_ORIGIN.x + 130 + BLOCK.depth, FRONT_ORIGIN.y),
          pt(FRONT_ORIGIN.x + 130 + BLOCK.depth, FRONT_ORIGIN.y - BLOCK.height),
          pt(FRONT_ORIGIN.x + 130, FRONT_ORIGIN.y - BLOCK.height),
        ] },
        { kind: 'line', style: 'hidden', a: pt(FRONT_ORIGIN.x + 130, FRONT_ORIGIN.y - BLOCK.stepHeight), b: pt(FRONT_ORIGIN.x + 130 + BLOCK.depth, FRONT_ORIGIN.y - BLOCK.stepHeight) },
        { kind: 'text', at: pt(FRONT_ORIGIN.x + 155, FRONT_ORIGIN.y + 10), text: 'END VIEW', size: 3, align: 'center' },
      ],
    },
  ],
};

/* ========================================================================= 35
 * Third angle projection
 * ======================================================================= */

const TA_FRONT = pt(150, 170);

const THIRD_ANGLE: DrawTopic = {
  id: 'third-angle',
  title: 'Third angle projection',
  subtitle: 'The same solid, with every view on the near side instead.',
  goal: 'Set out the same object in third angle projection, place each view on the side you looked from, and draw the third angle symbol.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'HB pencil'],
  base: preparedSheet('THIRD ANGLE PROJECTION', '35'),
  steps: [
    {
      id: 'third-idea',
      title: 'Near side, not far side',
      tool: 'hand',
      focus: { at: pt(190, 140), r: 220 },
      tip: 'First angle: the view goes on the far side. Third angle: the view goes on the side you looked from.',
      lines: [
        { text: 'You already know first angle. The view goes on the far side.' },
        { text: 'Third angle is the opposite. The view goes on the side you looked from.' },
        { text: 'Look down on it, the plan goes above.' },
        { text: 'Look from the left, that view goes on the left.' },
        { text: 'Same object. Same shapes. Different places on the sheet.' },
      ],
      marks: [],
    },
    {
      id: 'third-front',
      title: 'Front view in the middle',
      tool: 'tsquare',
      teeY: TA_FRONT.y,
      focus: { at: pt(TA_FRONT.x + 40, TA_FRONT.y - 30), r: 90 },
      tip: 'Set the front view out with room above it and to its left — that is where the other views land.',
      lines: [
        { text: 'Front view first again, but leave room above it and to its left.' },
        { text: 'That is where the other two are going this time.' },
        { text: 'Students who set out for first angle and then read third angle run out of paper.' },
      ],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: blockProfile(TA_FRONT) },
        { kind: 'text', at: pt(TA_FRONT.x + 40, TA_FRONT.y + 10), text: 'FRONT VIEW', size: 3, align: 'center' },
      ],
    },
    {
      id: 'third-plan-above',
      title: 'Plan goes above',
      tool: 'tsquare',
      teeY: TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth,
      focus: { at: pt(TA_FRONT.x + 40, TA_FRONT.y - BLOCK.height - 45), r: 100 },
      tip: 'You looked down from above, so in third angle the plan is drawn above.',
      lines: [
        { text: 'You looked down on it from above.' },
        { text: 'So in third angle the plan is drawn above.' },
        { text: 'Project straight up from the front view. Same widths, every time.' },
        { text: 'Eighty by fifty, with the step edge across it.' },
      ],
      marks: [
        { kind: 'line', style: 'construction', a: pt(TA_FRONT.x, TA_FRONT.y - BLOCK.height), b: pt(TA_FRONT.x, TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth) },
        { kind: 'line', style: 'construction', a: pt(TA_FRONT.x + BLOCK.length, TA_FRONT.y - BLOCK.height), b: pt(TA_FRONT.x + BLOCK.length, TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth) },
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(TA_FRONT.x, TA_FRONT.y - BLOCK.height - VIEW_GAP),
          pt(TA_FRONT.x + BLOCK.length, TA_FRONT.y - BLOCK.height - VIEW_GAP),
          pt(TA_FRONT.x + BLOCK.length, TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth),
          pt(TA_FRONT.x, TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth),
        ] },
        { kind: 'line', style: 'outline', a: pt(TA_FRONT.x + BLOCK.stepLength, TA_FRONT.y - BLOCK.height - VIEW_GAP), b: pt(TA_FRONT.x + BLOCK.stepLength, TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth) },
        { kind: 'text', at: pt(TA_FRONT.x + 40, TA_FRONT.y - BLOCK.height - VIEW_GAP - BLOCK.depth - 6), text: 'PLAN', size: 3, align: 'center' },
      ],
    },
    {
      id: 'third-end-left',
      title: 'Left view goes left',
      tool: 'tsquare',
      teeY: TA_FRONT.y - BLOCK.height,
      focus: { at: pt(TA_FRONT.x - 45, TA_FRONT.y - 30), r: 90 },
      tip: 'Looking from the left, the view is drawn on the left. That is the whole of third angle.',
      lines: [
        { text: 'Look from the left-hand end.' },
        { text: 'The view goes on the left. Same side you looked from.' },
        { text: 'Project the heights across, exactly as before.' },
        { text: 'That is the whole difference. Where the view lands, nothing else.' },
      ],
      marks: [
        { kind: 'line', style: 'construction', a: pt(TA_FRONT.x - 70, TA_FRONT.y), b: pt(TA_FRONT.x, TA_FRONT.y) },
        { kind: 'line', style: 'construction', a: pt(TA_FRONT.x - 70, TA_FRONT.y - BLOCK.height), b: pt(TA_FRONT.x, TA_FRONT.y - BLOCK.height) },
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(TA_FRONT.x - 20 - BLOCK.depth, TA_FRONT.y),
          pt(TA_FRONT.x - 20, TA_FRONT.y),
          pt(TA_FRONT.x - 20, TA_FRONT.y - BLOCK.height),
          pt(TA_FRONT.x - 20 - BLOCK.depth, TA_FRONT.y - BLOCK.height),
        ] },
        { kind: 'line', style: 'hidden', a: pt(TA_FRONT.x - 20 - BLOCK.depth, TA_FRONT.y - BLOCK.stepHeight), b: pt(TA_FRONT.x - 20, TA_FRONT.y - BLOCK.stepHeight) },
        { kind: 'text', at: pt(TA_FRONT.x - 20 - BLOCK.depth / 2, TA_FRONT.y + 10), text: 'END VIEW', size: 3, align: 'center' },
      ],
    },
    {
      id: 'third-symbol',
      title: 'The symbol says which',
      tool: 'compass',
      compassRadius: 9,
      focus: { at: pt(300, 220), r: 60 },
      tip: 'The cone symbol in the title block is the only thing telling the reader which projection you used.',
      lines: [
        { text: 'A drawing must say which projection it is in. Always.' },
        { text: 'The symbol is a truncated cone, drawn in two views.' },
        { text: 'In third angle, the small circle is on the same side as the small end.', at: pt(300, 220) },
        { text: 'In first angle it is on the opposite side.' },
        { text: 'It goes in the title block, and it is worth marks on its own.' },
      ],
      marks: [
        { kind: 'circle', style: 'outline', c: pt(292, 220), r: 9 },
        { kind: 'circle', style: 'outline', c: pt(292, 220), r: 4.5 },
        { kind: 'poly', style: 'outline', close: true, points: [pt(312, 211), pt(330, 215.5), pt(330, 224.5), pt(312, 229)] },
        { kind: 'line', style: 'centre', a: pt(278, 220), b: pt(340, 220) },
        { kind: 'text', at: pt(305, 244), text: 'THIRD ANGLE', size: 3, align: 'center', bold: true },
      ],
    },
  ],
};

/* ========================================================================= 36
 * Freehand first angle sketching
 * ======================================================================= */

const SKETCH_ORIGIN = pt(90, 180);

/** A line drawn with a slight wobble, the way a hand draws it. */
function freehandLine(a: Pt, b: Pt, wobble = 0.8, style: Mark['style'] = 'outline'): Mark {
  const steps = 12;
  return {
    kind: 'poly',
    style,
    points: Array.from({ length: steps + 1 }, (_, index): Pt => {
      const t = index / steps;
      const drift = Math.sin(t * Math.PI * 2.3) * wobble * (t > 0 && t < 1 ? 1 : 0);
      const angle = bearing(a, b) + 90;
      const base = pt(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
      return polar(base, drift, angle);
    }),
  };
}

const FREEHAND_FIRST_ANGLE: DrawTopic = {
  id: 'freehand-first-angle',
  title: 'Freehand sketches in first angle',
  subtitle: 'No instruments — but the same rules and the same layout.',
  goal: 'Sketch a component freehand in first angle projection, keeping the views in line and the proportions right without measuring anything.',
  minutes: 25,
  level: 'Core',
  tools: ['HB pencil'],
  base: preparedSheet('FREEHAND SKETCH — FIRST ANGLE', '36'),
  steps: [
    {
      id: 'freehand-why',
      title: 'The drawing you do on the job',
      tool: 'hand',
      focus: { at: pt(180, 140), r: 220 },
      tip: 'A freehand sketch is judged on proportion and layout, not on how straight the lines are.',
      lines: [
        { text: 'Out on the job you will not have a board.' },
        { text: 'You will have a notebook and a pencil, and somebody waiting.' },
        { text: 'So you sketch it freehand — and it still has to be first angle.' },
        { text: 'The marks are for proportion and layout, not for straight lines.' },
        { text: 'A wobbly line in the right place beats a ruled line in the wrong one.' },
      ],
      marks: [],
    },
    {
      id: 'freehand-boxes',
      title: 'Box the views in first',
      tool: 'pencil',
      focus: { at: pt(150, 165), r: 140 },
      tip: 'Sketch light boxes for all three views before drawing anything inside them.',
      lines: [
        { text: 'Do not start with the shape. Start with three boxes.' },
        { text: 'One for the front view, one under it for the plan, one to the right for the end.' },
        { text: 'Light strokes, from the shoulder, not the fingers.' },
        { text: 'Get those boxes in proportion and the sketch is already half right.' },
      ],
      marks: [
        freehandLine(pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y - 60), pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y - 60), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y), pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y - 60), pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y - 60), pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y + 20), pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y + 20), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y + 70), pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y + 70), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y + 20), pt(SKETCH_ORIGIN.x, SKETCH_ORIGIN.y + 70), 0.7, 'construction'),
        freehandLine(pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y + 20), pt(SKETCH_ORIGIN.x + 80, SKETCH_ORIGIN.y + 70), 0.7, 'construction'),
      ],
    },
    {
      id: 'freehand-front',
      title: 'Sketch the front view',
      tool: 'pencil',
      focus: { at: pt(SKETCH_ORIGIN.x + 40, SKETCH_ORIGIN.y - 30), r: 80 },
      tip: 'Long strokes, drawn in one movement. Short scratchy strokes are what makes a sketch look untidy.',
      lines: [
        { text: 'Now the shape inside the box.' },
        { text: 'One long stroke per line. Do not scratch at it.' },
        { text: 'Look at where the line is going to finish, not at the pencil point.' },
        { text: 'Your hand follows your eye. That is the whole trick to sketching straight.' },
      ],
      marks: blockProfile(SKETCH_ORIGIN)
        .map((point, index, all) => freehandLine(point, all[(index + 1) % all.length], 0.8))
        .concat([{ kind: 'text', at: pt(SKETCH_ORIGIN.x + 40, SKETCH_ORIGIN.y + 10), text: 'FRONT', size: 3, align: 'center' }]),
    },
    {
      id: 'freehand-project',
      title: 'Keep the views in line',
      tool: 'pencil',
      focus: { at: pt(SKETCH_ORIGIN.x + 40, SKETCH_ORIGIN.y + 45), r: 90 },
      tip: 'Even freehand, the plan sits directly under the front view. Views out of line lose the marks.',
      lines: [
        { text: 'The plan goes underneath — first angle, remember.' },
        { text: 'It must sit directly under the front view.' },
        { text: 'Sketch light projection lines down if it helps. Nobody minds.' },
        { text: 'Views out of line is the fault that costs most marks in a sketching question.' },
      ],
      marks: [
        freehandLine(pt(SKETCH_ORIGIN.x + BLOCK.stepLength, SKETCH_ORIGIN.y + 20), pt(SKETCH_ORIGIN.x + BLOCK.stepLength, SKETCH_ORIGIN.y + 70), 0.6),
        { kind: 'text', at: pt(SKETCH_ORIGIN.x + 40, SKETCH_ORIGIN.y + 80), text: 'PLAN', size: 3, align: 'center' },
        freehandLine(pt(SKETCH_ORIGIN.x + 110, SKETCH_ORIGIN.y - 60), pt(SKETCH_ORIGIN.x + 160, SKETCH_ORIGIN.y - 60), 0.8),
        freehandLine(pt(SKETCH_ORIGIN.x + 110, SKETCH_ORIGIN.y), pt(SKETCH_ORIGIN.x + 160, SKETCH_ORIGIN.y), 0.8),
        freehandLine(pt(SKETCH_ORIGIN.x + 110, SKETCH_ORIGIN.y - 60), pt(SKETCH_ORIGIN.x + 110, SKETCH_ORIGIN.y), 0.8),
        freehandLine(pt(SKETCH_ORIGIN.x + 160, SKETCH_ORIGIN.y - 60), pt(SKETCH_ORIGIN.x + 160, SKETCH_ORIGIN.y), 0.8),
        freehandLine(pt(SKETCH_ORIGIN.x + 110, SKETCH_ORIGIN.y - 30), pt(SKETCH_ORIGIN.x + 160, SKETCH_ORIGIN.y - 30), 0.8, 'hidden'),
        { kind: 'text', at: pt(SKETCH_ORIGIN.x + 135, SKETCH_ORIGIN.y + 10), text: 'END', size: 3, align: 'center' },
      ],
    },
  ],
};

/* ========================================================================= 37
 * Isometric circles
 * ======================================================================= */

const ISO_CIRCLE_CENTRE = pt(150, 130);
const ISO_CIRCLE_D = 80;

const ISOMETRIC_CIRCLES: DrawTopic = {
  id: 'isometric-circles',
  title: 'Isometric circles',
  subtitle: 'A circle on a sloping face, drawn with four arcs and a compass.',
  goal: 'Construct an isometric circle by the four-centre method, and explain why a circle never looks like a circle in isometric.',
  minutes: 30,
  level: 'Core',
  tools: ['30/60 set square', 'Compass', 'HB pencil'],
  base: preparedSheet('ISOMETRIC CIRCLES', '37'),
  steps: [
    {
      id: 'iso-circle-why',
      title: 'A circle turns into an ellipse',
      tool: 'hand',
      focus: { at: ISO_CIRCLE_CENTRE, r: 130 },
      tip: 'Any circle drawn on an isometric face appears as an ellipse — you can never use the compass on the circle itself.',
      lines: [
        { text: 'Draw a circle on a face that is leaning away from you.' },
        { text: 'It does not look like a circle any more. It looks like an ellipse.' },
        { text: 'So you cannot just swing the compass and be done with it.' },
        { text: 'But you can build that ellipse out of four compass arcs.' },
        { text: 'That is the four-centre method, and it is examined every year.' },
      ],
      marks: [],
    },
    {
      id: 'iso-circle-square',
      title: 'Draw the isometric square',
      tool: 'set30',
      focus: { at: ISO_CIRCLE_CENTRE, r: 90 },
      tip: 'The circle sits inside a square. Draw the square in isometric first — it becomes a rhombus.',
      lines: [
        { text: 'Start with the square the circle would sit in.' },
        { text: 'Eighty by eighty, drawn on the isometric axes.' },
        { text: 'Both sides at thirty degrees, with the set square.' },
        { text: 'A square in isometric is a rhombus. That rhombus is the frame for the ellipse.' },
      ],
      marks: [
        { kind: 'poly', style: 'construction', close: true, points: isoSquare(ISO_CIRCLE_CENTRE, ISO_CIRCLE_D, 30, 150) },
      ],
    },
    {
      id: 'iso-circle-midpoints',
      title: 'Mark the four midpoints',
      tool: 'pencil',
      focus: { at: ISO_CIRCLE_CENTRE, r: 80 },
      tip: 'The ellipse touches the rhombus at the middle of each side, and nowhere else.',
      lines: [
        { text: 'Find the middle of each of the four sides.' },
        { text: 'Those four points are where the ellipse touches the rhombus.' },
        { text: 'It touches there and nowhere else — that is what makes the arcs join smoothly.' },
      ],
      marks: (() => {
        const square = isoSquare(ISO_CIRCLE_CENTRE, ISO_CIRCLE_D, 30, 150);
        return square.map((point, index): Mark => ({
          kind: 'dot',
          at: mid(point, square[(index + 1) % 4]),
        }));
      })(),
    },
    {
      id: 'iso-circle-centres',
      title: 'Find the four centres',
      tool: 'pencil',
      focus: { at: ISO_CIRCLE_CENTRE, r: 85 },
      tip: 'Two blunt corners give the big arcs; the crossings on the long diagonal give the small ones.',
      lines: [
        { text: 'The two blunt corners of the rhombus are the first two centres.' },
        { text: 'From each one, draw a line to the middle of each far side.' },
        { text: 'Those lines cross on the long diagonal.' },
        { text: 'Where they cross are the other two centres. Four centres, four arcs.' },
      ],
      marks: (() => {
        const square = isoSquare(ISO_CIRCLE_CENTRE, ISO_CIRCLE_D, 30, 150);
        const arcs = fourCentreArcs(square);
        const midpoints = square.map((point, index) => mid(point, square[(index + 1) % 4]));
        return [
          ...arcs.flatMap((arc): Mark[] =>
            midpoints.map((m) => ({ kind: 'line', style: 'construction', a: arc.centre, b: m }))
          ),
          ...arcs.map((arc): Mark => ({ kind: 'dot', at: arc.centre })),
        ];
      })(),
    },
    {
      id: 'iso-circle-arcs',
      title: 'Swing the four arcs',
      tool: 'compass',
      compassRadius: ISO_CIRCLE_D * 0.75,
      focus: { at: ISO_CIRCLE_CENTRE, r: 80 },
      tip: 'Two long arcs and two short ones, each stopping exactly on a midpoint.',
      lines: [
        { text: 'Now the compass. Two long arcs from the blunt corners.' },
        { text: 'Each one runs from one midpoint to the other.' },
        { text: 'Then two short arcs from the centres on the long diagonal.' },
        { text: 'Every arc stops on a midpoint, so the join is smooth.' },
        { text: 'That is an isometric circle. It is really four arcs pretending to be an ellipse.' },
      ],
      marks: arcMarks(fourCentreArcs(isoSquare(ISO_CIRCLE_CENTRE, ISO_CIRCLE_D, 30, 150))),
    },
  ],
};

/* ========================================================================= 38
 * Isometric ellipses on all three faces
 * ======================================================================= */

const CUBE_ORIGIN = pt(150, 170);
const CUBE = 70;

const ISOMETRIC_ELLIPSES: DrawTopic = {
  id: 'isometric-ellipses',
  title: 'Isometric ellipses',
  subtitle: 'The same construction on the top, the front and the side.',
  goal: 'Draw an isometric ellipse on each of the three faces of a cube, and get the major axis pointing the right way on every one.',
  minutes: 30,
  level: 'Exam',
  tools: ['30/60 set square', 'Compass', 'HB pencil'],
  base: preparedSheet('ISOMETRIC ELLIPSES', '38'),
  steps: [
    {
      id: 'ellipse-three-faces',
      title: 'Three faces, three ellipses',
      tool: 'hand',
      focus: { at: pt(160, 140), r: 200 },
      tip: 'The major axis of the ellipse always lies along the long diagonal of its rhombus.',
      lines: [
        { text: 'A cube in isometric shows three faces: the top, the front and the side.' },
        { text: 'A circle on any of them becomes an ellipse.' },
        { text: 'The construction is the same on all three. Only the rhombus turns.' },
        { text: 'And the long axis of the ellipse always lies along the long diagonal.' },
        { text: 'Get that wrong and the hole looks like it is drilled in the wrong direction.' },
      ],
      marks: [],
    },
    {
      id: 'ellipse-cube',
      title: 'Draw the cube first',
      tool: 'set30',
      focus: { at: pt(CUBE_ORIGIN.x, CUBE_ORIGIN.y - 40), r: 110 },
      tip: 'Draw the crate before the detail. Every isometric drawing starts as a box.',
      lines: [
        { text: 'A cube, seventy on each edge.' },
        { text: 'Thirty degrees up to the right, thirty up to the left, and vertical for height.' },
        { text: 'Three faces of the cube are showing. One ellipse goes on each.' },
      ],
      marks: isoEdgeMarks(
        CUBE_ORIGIN,
        [
          [v3(0, 0, 0), v3(CUBE, 0, 0)],
          [v3(CUBE, 0, 0), v3(CUBE, 0, CUBE)],
          [v3(CUBE, 0, CUBE), v3(0, 0, CUBE)],
          [v3(0, 0, CUBE), v3(0, 0, 0)],
          [v3(0, 0, CUBE), v3(0, CUBE, CUBE)],
          [v3(0, CUBE, CUBE), v3(CUBE, CUBE, CUBE)],
          [v3(CUBE, CUBE, CUBE), v3(CUBE, 0, CUBE)],
          [v3(CUBE, CUBE, CUBE), v3(CUBE, CUBE, 0)],
          [v3(CUBE, CUBE, 0), v3(CUBE, 0, 0)],
        ],
        'outline'
      ),
    },
    {
      id: 'ellipse-top',
      title: 'The ellipse on the top face',
      tool: 'compass',
      compassRadius: 44,
      focus: { at: isoPoint(CUBE_ORIGIN, v3(CUBE / 2, CUBE / 2, CUBE)), r: 70 },
      tip: 'On the top face both axes of the rhombus run at 30°, so the ellipse lies flat.',
      lines: [
        { text: 'The top face first. Both its edges run at thirty degrees.' },
        { text: 'So the rhombus sits flat, and the ellipse lies across it.' },
        { text: 'Four centres, four arcs, exactly as before.' },
      ],
      marks: arcMarks(
        fourCentreArcs(isoSquare(isoPoint(CUBE_ORIGIN, v3(CUBE / 2, CUBE / 2, CUBE)), CUBE, 30, 150))
      ),
    },
    {
      id: 'ellipse-front',
      title: 'And on the two upright faces',
      tool: 'compass',
      compassRadius: 44,
      focus: { at: pt(CUBE_ORIGIN.x, CUBE_ORIGIN.y - 30), r: 110 },
      tip: 'On an upright face one axis of the rhombus is vertical and the other is at 30°.',
      lines: [
        { text: 'Now the front face. One edge runs at thirty degrees, the other straight up.' },
        { text: 'So the rhombus stands up, and the ellipse stands with it.' },
        { text: 'The side face is the mirror image of it.' },
        { text: 'Three ellipses, three different directions, one construction.' },
      ],
      marks: [
        ...arcMarks(
          fourCentreArcs(isoSquare(isoPoint(CUBE_ORIGIN, v3(CUBE / 2, 0, CUBE / 2)), CUBE, 30, 90))
        ),
        ...arcMarks(
          fourCentreArcs(isoSquare(isoPoint(CUBE_ORIGIN, v3(CUBE, CUBE / 2, CUBE / 2)), CUBE, 150, 90))
        ),
      ],
    },
  ],
};

/* ========================================================================= 39
 * The isometric scale
 * ======================================================================= */

const SCALE_ORIGIN = pt(80, 200);
const SCALE_LEN = 160;

const ISOMETRIC_SCALE: DrawTopic = {
  id: 'isometric-scale',
  title: 'The isometric scale',
  subtitle: 'The difference between an isometric drawing and a true projection.',
  goal: 'Construct an isometric scale with the 30° and 45° lines, and use it to draw a true isometric projection rather than an isometric drawing.',
  minutes: 30,
  level: 'Exam',
  tools: ['45° set square', '30/60 set square', 'HB pencil'],
  base: preparedSheet('THE ISOMETRIC SCALE', '39'),
  steps: [
    {
      id: 'scale-why',
      title: 'Two things with almost the same name',
      tool: 'hand',
      focus: { at: pt(180, 140), r: 220 },
      tip: 'Isometric drawing uses true lengths. Isometric projection uses lengths reduced to 0.816.',
      lines: [
        { text: 'There are two isometrics, and they are not the same.' },
        { text: 'An isometric drawing uses true lengths. Eighty long is drawn eighty.' },
        { text: 'An isometric projection uses shortened lengths. Eighty is drawn sixty-five.' },
        { text: 'The real ratio is nought point eight one six.' },
        { text: 'A projection is what a camera would see. A drawing is what is easy to draw.' },
        { text: 'Almost all workshop drawing is the easy one. But you must know both.' },
      ],
      marks: [],
    },
    {
      id: 'scale-baseline',
      title: 'A true scale at 45°',
      tool: 'set45',
      focus: { at: pt(SCALE_ORIGIN.x + 80, SCALE_ORIGIN.y - 50), r: 120 },
      tip: 'The true scale goes on the 45° line; the isometric scale is read off the 30° line below it.',
      lines: [
        { text: 'Draw a horizontal line, then one at forty-five degrees from the same point.' },
        { text: 'Mark your true millimetres along the forty-five degree line.', at: pt(SCALE_ORIGIN.x + 60, SCALE_ORIGIN.y - 60) },
        { text: 'Ten, twenty, thirty, all the way along. That is the true scale.' },
      ],
      marks: [
        { kind: 'line', style: 'thin', a: SCALE_ORIGIN, b: pt(SCALE_ORIGIN.x + SCALE_LEN, SCALE_ORIGIN.y) },
        { kind: 'line', style: 'outline', a: SCALE_ORIGIN, b: polar(SCALE_ORIGIN, SCALE_LEN, 45) },
        ...Array.from({ length: 8 }, (_, index): Mark => {
          const at = polar(SCALE_ORIGIN, (index + 1) * 18, 45);
          return { kind: 'line', style: 'thin', a: at, b: polar(at, 3, 135) };
        }),
        { kind: 'angle', at: SCALE_ORIGIN, from: 0, to: 45, r: 26, label: '45°' },
      ],
    },
    {
      id: 'scale-thirty',
      title: 'Drop them onto the 30° line',
      tool: 'set30',
      focus: { at: pt(SCALE_ORIGIN.x + 80, SCALE_ORIGIN.y - 35), r: 120 },
      tip: 'Project each true division vertically down onto the 30° line — that is the isometric scale.',
      lines: [
        { text: 'Now a line at thirty degrees from the same point.' },
        { text: 'Drop each mark from the forty-five line straight down onto it.', at: pt(SCALE_ORIGIN.x + 100, SCALE_ORIGIN.y - 40) },
        { text: 'Vertically. Not square to the line — vertically.' },
        { text: 'The marks you get on the thirty degree line are the isometric scale.' },
        { text: 'Measure along that line and every length is automatically shortened.' },
      ],
      marks: [
        { kind: 'line', style: 'outline', a: SCALE_ORIGIN, b: polar(SCALE_ORIGIN, SCALE_LEN, 30) },
        ...Array.from({ length: 8 }, (_, index): Mark[] => {
          const trueAt = polar(SCALE_ORIGIN, (index + 1) * 18, 45);
          const onThirty = lineIntersection(
            trueAt,
            pt(trueAt.x, trueAt.y + 60),
            SCALE_ORIGIN,
            polar(SCALE_ORIGIN, SCALE_LEN, 30)
          );
          if (!onThirty) return [];
          return [
            { kind: 'line', style: 'construction', a: trueAt, b: onThirty },
            { kind: 'line', style: 'thin', a: onThirty, b: polar(onThirty, 3, 120) },
          ];
        }).flat(),
        { kind: 'angle', at: SCALE_ORIGIN, from: 0, to: 30, r: 16, label: '30°' },
      ],
    },
    {
      id: 'scale-use',
      title: 'What it gives you',
      tool: 'pencil',
      focus: { at: pt(SCALE_ORIGIN.x + 90, SCALE_ORIGIN.y - 20), r: 130 },
      tip: 'Isometric projection = true length × 0.816. The scale does that multiplication for you.',
      lines: [
        { text: 'Every division on the thirty degree line is shorter than the one above it.' },
        { text: 'Shorter by that ratio, nought point eight one six.' },
        { text: 'Now you can draw a true isometric projection with the set square alone.' },
        { text: 'No sums, no calculator. The scale does the multiplying for you.' },
      ],
      marks: [
        { kind: 'text', at: pt(SCALE_ORIGIN.x, SCALE_ORIGIN.y + 16), text: 'ISOMETRIC LENGTH = TRUE LENGTH × 0.816', size: 3.2, align: 'left', bold: true },
        { kind: 'text', at: pt(SCALE_ORIGIN.x, SCALE_ORIGIN.y + 26), text: 'DRAWING = TRUE LENGTHS · PROJECTION = SCALED', size: 2.8, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 40
 * Sectioned first angle
 * ======================================================================= */

const SEC_FRONT = pt(75, 150);
const SEC_PLAN_Y = SEC_FRONT.y + 40;

const SECTIONED_FIRST_ANGLE: DrawTopic = {
  id: 'sectioned-first-angle',
  title: 'Sectioned diagrams in first angle',
  subtitle: 'Cut it through, and draw what the saw would show.',
  goal: 'Put a cutting plane on a first angle drawing, letter it, and draw the sectional view with the hatching and hidden detail handled correctly.',
  minutes: 35,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'HB pencil'],
  base: preparedSheet('SECTIONAL VIEW — FIRST ANGLE', '40'),
  steps: [
    {
      id: 'section-why',
      title: 'When hidden lines are not enough',
      tool: 'hand',
      focus: { at: pt(180, 140), r: 220 },
      tip: 'A section replaces a mess of hidden lines with solid ones you can dimension.',
      lines: [
        { text: 'A part with holes and pockets in it fills up with hidden lines.' },
        { text: 'Ten dashed lines crossing each other tell nobody anything.' },
        { text: 'So we cut the part in half and draw what the saw would show.' },
        { text: 'The hidden lines become solid outlines, and you can dimension them.' },
        { text: 'That is a sectional view. It is not a different part, it is a clearer drawing.' },
      ],
      marks: [],
    },
    {
      id: 'section-part',
      title: 'The part, with its hidden detail',
      tool: 'tsquare',
      teeY: SEC_FRONT.y - 50,
      focus: { at: pt(SEC_FRONT.x + 55, SEC_FRONT.y - 25), r: 110 },
      tip: 'Draw the part normally first, so you can see what the section is going to save you.',
      lines: [
        { text: 'Here is the part. A block with a hole bored through it.' },
        { text: 'In the front view the hole is hidden, so it is two dashed lines.' },
        { text: 'Add a counterbore and a second hole and you can no longer read it.' },
        { text: 'That is the problem the section solves.' },
      ],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(SEC_FRONT.x, SEC_FRONT.y),
          pt(SEC_FRONT.x + 110, SEC_FRONT.y),
          pt(SEC_FRONT.x + 110, SEC_FRONT.y - 50),
          pt(SEC_FRONT.x, SEC_FRONT.y - 50),
        ] },
        { kind: 'line', style: 'hidden', a: pt(SEC_FRONT.x + 40, SEC_FRONT.y), b: pt(SEC_FRONT.x + 40, SEC_FRONT.y - 50) },
        { kind: 'line', style: 'hidden', a: pt(SEC_FRONT.x + 70, SEC_FRONT.y), b: pt(SEC_FRONT.x + 70, SEC_FRONT.y - 50) },
        { kind: 'line', style: 'centre', a: pt(SEC_FRONT.x + 55, SEC_FRONT.y + 6), b: pt(SEC_FRONT.x + 55, SEC_FRONT.y - 56) },
      ],
    },
    {
      id: 'section-plane',
      title: 'Put the cutting plane on',
      tool: 'pencil',
      focus: { at: pt(SEC_FRONT.x + 55, SEC_PLAN_Y + 25), r: 110 },
      tip: 'Chain line, thick at the ends, arrows showing the direction of sight, and a letter at each end.',
      lines: [
        { text: 'The cutting plane goes on the view you are cutting through.' },
        { text: 'A chain line, made thick at both ends.' },
        { text: 'Arrows on the ends, pointing the way you are looking.' },
        { text: 'And a capital letter at each end. A dash A.' },
        { text: 'The sectional view is then labelled SECTION A dash A. Both must match.' },
      ],
      marks: [
        { kind: 'line', style: 'outline', a: pt(SEC_FRONT.x - 8, SEC_PLAN_Y + 25), b: pt(SEC_FRONT.x + 8, SEC_PLAN_Y + 25) },
        { kind: 'line', style: 'centre', a: pt(SEC_FRONT.x + 8, SEC_PLAN_Y + 25), b: pt(SEC_FRONT.x + 102, SEC_PLAN_Y + 25) },
        { kind: 'line', style: 'outline', a: pt(SEC_FRONT.x + 102, SEC_PLAN_Y + 25), b: pt(SEC_FRONT.x + 118, SEC_PLAN_Y + 25) },
        { kind: 'line', style: 'outline', a: pt(SEC_FRONT.x - 8, SEC_PLAN_Y + 25), b: pt(SEC_FRONT.x - 8, SEC_PLAN_Y + 13) },
        { kind: 'line', style: 'outline', a: pt(SEC_FRONT.x + 118, SEC_PLAN_Y + 25), b: pt(SEC_FRONT.x + 118, SEC_PLAN_Y + 13) },
        { kind: 'text', at: pt(SEC_FRONT.x - 8, SEC_PLAN_Y + 34), text: 'A', size: 4, align: 'center', bold: true },
        { kind: 'text', at: pt(SEC_FRONT.x + 118, SEC_PLAN_Y + 34), text: 'A', size: 4, align: 'center', bold: true },
      ],
    },
    {
      id: 'section-view',
      title: 'Draw the cut face',
      tool: 'tsquare',
      teeY: 60,
      focus: { at: pt(250, 90), r: 110 },
      tip: 'Everything the saw touched is hatched. Everything behind the cut is drawn as an ordinary outline.',
      lines: [
        { text: 'Now the sectional view, in the first angle position.' },
        { text: 'Where the saw went through metal, hatch it.', at: pt(250, 80) },
        { text: 'Where the hole was, there is no metal — so no hatching.' },
        { text: 'Those dashed lines have become solid outlines. That is the gain.' },
        { text: 'And anything behind the cut is still drawn, as an ordinary outline.' },
      ],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(200, 110), pt(310, 110), pt(310, 60), pt(200, 60),
        ] },
        { kind: 'line', style: 'outline', a: pt(240, 60), b: pt(240, 110) },
        { kind: 'line', style: 'outline', a: pt(270, 60), b: pt(270, 110) },
        ...hatchRect(200, 60, 40, 50),
        ...hatchRect(270, 60, 40, 50),
        { kind: 'line', style: 'centre', a: pt(255, 54), b: pt(255, 116) },
        { kind: 'text', at: pt(255, 126), text: 'SECTION A–A', size: 3.4, align: 'center', bold: true },
      ],
    },
    {
      id: 'section-rules',
      title: 'The rules that catch people out',
      tool: 'pencil',
      focus: { at: pt(190, 200), r: 170 },
      tip: 'Hatch at 45°, never hatch a fastener, and drop the hidden lines that the section has replaced.',
      lines: [
        { text: 'Three rules and they are all easy marks.' },
        { text: 'One: hatch at forty-five degrees, evenly spaced, and stop on the outline.' },
        { text: 'Two: shafts, nuts, bolts, keys and pins are never hatched, even when cut.' },
        { text: 'Three: once a section shows something, take its hidden lines out.' },
        { text: 'Leaving them in defeats the whole purpose of sectioning it.' },
      ],
      marks: [
        { kind: 'text', at: pt(75, 205), text: '45° HATCHING · FASTENERS NOT CUT · NO HIDDEN LINES LEFT', size: 3, align: 'left', bold: true },
      ],
    },
  ],
};

export const PROJECTION_EXTRA_TOPICS: DrawTopic[] = [
  ORTHO_FROM_PICTORIAL,
  THIRD_ANGLE,
  FREEHAND_FIRST_ANGLE,
  ISOMETRIC_CIRCLES,
  ISOMETRIC_ELLIPSES,
  ISOMETRIC_SCALE,
  SECTIONED_FIRST_ANGLE,
];
