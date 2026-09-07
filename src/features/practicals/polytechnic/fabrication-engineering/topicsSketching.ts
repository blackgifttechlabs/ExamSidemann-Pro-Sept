/**
 * Freehand sketching, and reading a pictorial drawing back into flat views.
 *
 * Every job in a fabrication shop starts as a sketch on the back of something.
 * These four sheets teach the hand before they teach the instrument: getting
 * proportion right with a matchstick figure, getting the three isometric axes
 * down without a set square, choosing which two views actually describe a part,
 * and finally reading a pictorial drawing and turning it into first angle.
 */

import { isoPoint, pt, v3, type Mark, type Pt, type Vec3 } from '../technical-drawing/drawingGeometry';
import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import { fabSheet, freehand, freehandCircle, line, poly, text } from './fabricationGeometry';

/** A freehand polyline through the given corners. */
const sketch = (points: Pt[], seed: number, wobble = 0.7): Mark =>
  poly(freehand(points, seed, wobble, 10), 'outline');

const isoEdge = (origin: Pt, a: Vec3, b: Vec3, style: 'outline' | 'construction' | 'hidden' = 'outline'): Mark =>
  line(isoPoint(origin, a), isoPoint(origin, b), style);

/* ==========================================================================
 * 1 — Matchstick man and woman
 * ======================================================================== */

const MAN = pt(120, 112);
const WOMAN = pt(240, 112);

/** Head, body, arms, legs — the whole point being the proportions between them. */
function matchstickFigure(head: Pt, skirt: boolean, seed: number): Mark[] {
  const HEAD_R = 9;
  const neck = pt(head.x, head.y + HEAD_R);
  const shoulders = pt(head.x, head.y + HEAD_R + 6);
  const hip = pt(head.x, head.y + HEAD_R + 44);
  const foot = head.y + HEAD_R + 44 + 40;

  const marks: Mark[] = [
    poly(freehandCircle(head, HEAD_R, seed, 0.5), 'outline', true),
    sketch([neck, hip], seed + 1),
    sketch([pt(shoulders.x - 22, shoulders.y + 20), shoulders, pt(shoulders.x + 22, shoulders.y + 20)], seed + 2),
  ];

  if (skirt) {
    const waist = pt(head.x, head.y + HEAD_R + 30);
    marks.push(sketch([waist, pt(head.x - 18, hip.y), pt(head.x + 18, hip.y), waist], seed + 3));
    marks.push(sketch([pt(head.x - 9, hip.y), pt(head.x - 7, foot)], seed + 4));
    marks.push(sketch([pt(head.x + 9, hip.y), pt(head.x + 7, foot)], seed + 5));
  } else {
    marks.push(sketch([pt(head.x - 15, foot), hip, pt(head.x + 15, foot)], seed + 3));
  }

  marks.push(sketch([pt(head.x - 15, foot), pt(head.x - 22, foot)], seed + 6));
  marks.push(sketch([pt(head.x + 15, foot), pt(head.x + 22, foot)], seed + 7));
  return marks;
}

const MATCHSTICK: DrawTopic = {
  id: 'sketch-matchstick',
  title: 'Freehand sketch of a matchstick man and woman',
  subtitle: 'The first freehand exercise — because proportion is the hard part, not the lines.',
  goal: 'Sketch two matchstick figures freehand in correct proportion, and use them for shop safety and method sketches.',
  minutes: 25,
  level: 'Start here',
  tools: ['HB pencil', 'Eraser', 'Plain paper'],
  base: fabSheet({ title: 'MATCHSTICK FIGURES', number: 'F-36', scale: '—' }),
  steps: [
    {
      id: 'stick-why',
      title: 'Why a fabricator draws people',
      tool: 'hand',
      focus: { at: pt(190, 140), r: 160 },
      tip: 'A figure on a drawing gives it scale instantly, and it is how every method statement and safety notice is sketched.',
      lines: [
        { text: 'This looks like the easiest thing in the course, and there is a reason it comes first.' },
        { text: 'A matchstick figure is a proportion exercise. Nothing else.' },
        { text: 'There is no line in it that is hard to draw. Every line is straight or a small circle.' },
        { text: 'But get the proportions wrong and everybody sees it, instantly, without being told.' },
        { text: 'That is a very useful thing to practise, because a drawing works the same way.' },
        { text: 'And you will genuinely use it. A figure beside a tank tells you how big the tank is.' },
        { text: 'Every safety notice, every lifting method sketch, every access drawing has one on it.' },
      ],
      marks: [],
    },
    {
      id: 'stick-proportion',
      title: 'Set the proportions before you draw',
      tool: 'pencil',
      focus: { at: pt(160, 160), r: 110 },
      tip: 'An adult is about seven and a half heads tall. Half the height is at the hip, not the waist.',
      lines: [
        { text: 'Start with the head, because everything is measured in heads.' },
        { text: 'An adult stands about seven and a half heads tall. Not five, which is what people draw.' },
        { text: 'Mark the top of the head and the ground. Then find the middle.' },
        { text: 'The middle of a standing person is the hip. Not the waist — the hip.' },
        { text: 'That is the one people get wrong, and it makes the legs come out too short.' },
        { text: 'Shoulders are about one and a half heads down. Arms reach past the hip.' },
        { text: 'Mark those four heights lightly first. Then the figure almost draws itself.' },
      ],
      markLines: [2, 2, 3, 5],
      marks: [
        line(pt(96, MAN.y - 9), pt(280, MAN.y - 9), 'construction'),
        line(pt(96, MAN.y + 9 + 84), pt(280, MAN.y + 9 + 84), 'construction'),
        line(pt(96, MAN.y + 9 + 44), pt(280, MAN.y + 9 + 44), 'construction'),
        line(pt(96, MAN.y + 15), pt(280, MAN.y + 15), 'construction'),
        text(pt(92, MAN.y - 9), 'TOP', 2.6, { align: 'right', colour: '#64748b' }),
        text(pt(92, MAN.y + 15), 'SHOULDER', 2.6, { align: 'right', colour: '#64748b' }),
        text(pt(92, MAN.y + 53), 'HIP — HALF WAY', 2.6, { align: 'right', colour: '#64748b' }),
        text(pt(92, MAN.y + 93), 'GROUND', 2.6, { align: 'right', colour: '#64748b' }),
      ],
    },
    {
      id: 'stick-man',
      title: 'The man',
      tool: 'pencil',
      focus: { at: MAN, r: 76 },
      tip: 'Freehand does not mean shaky. Draw each limb as one confident stroke from the shoulder.',
      lines: [
        { text: 'Head first. A small circle, drawn in one go — do not go round it four times.' },
        { text: 'Neck and body, straight down to the hip line.' },
        { text: 'Arms from the shoulders, out and down. One stroke each.' },
        { text: 'Legs from the hip, out and down to the ground line.' },
        { text: 'Two little feet, turned the same way.' },
        { text: 'That is a person. Five straight lines and a circle.' },
        { text: 'Look at it against your height marks. Everything lands on a line.' },
      ],
      markLines: [0, 1, 2, 3, 4],
      marks: matchstickFigure(MAN, false, 5),
    },
    {
      id: 'stick-woman',
      title: 'The woman, and what changes',
      tool: 'pencil',
      focus: { at: WOMAN, r: 76 },
      tip: 'Both figures use the same height lines. Only the body between waist and hip is drawn differently.',
      lines: [
        { text: 'Same height lines. Do not start again — work off the ones you have.' },
        { text: 'Head, neck and body down to the waist, exactly as before.' },
        { text: 'Then the skirt. A triangle from the waist down to the hip line.' },
        { text: 'Legs come out of the bottom of it, down to the same ground line.' },
        { text: 'Arms the same as the man\'s.' },
        { text: 'The two figures are the same height and the same build. That is deliberate.' },
        { text: 'On a drawing they are both just a person, and a person is a scale reference.' },
      ],
      markLines: [1, 2, 3, 4],
      marks: matchstickFigure(WOMAN, true, 31),
    },
    {
      id: 'stick-use',
      title: 'Put one beside a job',
      tool: 'pencil',
      focus: { at: pt(300, 200), r: 90 },
      tip: 'Nobody dimensions a method sketch. A figure beside the job does the same work in one second.',
      lines: [
        { text: 'Now the reason it earns its place. Here is a tank on a sketch.' },
        { text: 'Without anything beside it, that could be a bucket or it could be a silo.' },
        { text: 'Put a figure next to it and the question is answered before anybody asks it.' },
        { text: 'That is what a method sketch is for. Not accuracy — understanding, fast.' },
        { text: 'Use it for lifting sketches, access sketches, guard rails, working platforms.' },
        { text: 'And keep it in proportion. A seven-head figure beside a tank tells the truth about the tank.' },
      ],
      marks: [
        sketch([pt(320, 230), pt(320, 168), pt(384, 168), pt(384, 230)], 61, 0.8),
        poly(freehandCircle(pt(352, 168), 32, 71, 0.9).map((point) => pt(point.x, Math.min(point.y, 168))), 'outline'),
        line(pt(300, 230), pt(400, 230), 'outline'),
        ...matchstickFigure(pt(296, 148), false, 83),
        text(pt(352, 244), 'A FIGURE GIVES IT SCALE', 2.8, { colour: '#64748b' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 2 — Isometric axis freehand sketch
 * ======================================================================== */

const AXES = pt(120, 200);
const CUBE = pt(280, 210);

const ISO_AXES: DrawTopic = {
  id: 'sketch-isometric-axes',
  title: 'Isometric axis freehand sketch',
  subtitle: 'Three lines at 120° to each other — and every pictorial sketch you will ever draw.',
  goal: 'Sketch the isometric axes freehand and build a cube on them without instruments.',
  minutes: 25,
  level: 'Basic',
  tools: ['HB pencil', 'Eraser', 'Plain paper'],
  base: fabSheet({ title: 'ISOMETRIC AXES', number: 'F-37', scale: '—' }),
  steps: [
    {
      id: 'axes-idea',
      title: 'Three axes, one hundred and twenty apart',
      tool: 'hand',
      focus: { at: pt(190, 160), r: 155 },
      tip: 'Isometric axes: one vertical, two at 30° to the horizontal. All three are 120° apart, and all three carry true lengths.',
      lines: [
        { text: 'A flat view tells you the truth but it does not look like anything.' },
        { text: 'A pictorial sketch looks like the job, and the quickest one is isometric.' },
        { text: 'Isometric is built on three axes and nothing else.' },
        { text: 'One straight up. One going up to the right at thirty degrees. One up to the left at thirty.' },
        { text: 'Look at the angles between them. A hundred and twenty degrees, every time, all three.' },
        { text: 'That is what isometric means — equal measure. The three directions are treated alike.' },
        { text: 'And because of that, you can measure true lengths along all three.' },
        { text: 'Along the axes only. Never along a diagonal — those come out wrong.' },
      ],
      marks: [],
    },
    {
      id: 'axes-draw',
      title: 'Sketch the three axes',
      tool: 'pencil',
      focus: { at: AXES, r: 80 },
      tip: 'Judge 30° as one third of a right angle. Sketch it, then check it against the corner of the sheet.',
      lines: [
        { text: 'Put a dot where the near bottom corner of the job will be.' },
        { text: 'Straight up from it. That is the height axis. Get it truly vertical.' },
        { text: 'Now thirty degrees, up to the right. Judge it — a third of the way up from flat.' },
        { text: 'And thirty degrees up to the left, the same amount.' },
        { text: 'Check them against each other, not against the paper.' },
        { text: 'The two sloping ones should look like a mirror pair. If one is steeper, fix it now.' },
        { text: 'Get this right and everything you build on it comes out right.' },
      ],
      markLines: [0, 1, 2, 3],
      marks: [
        { kind: 'dot', style: 'outline', at: AXES },
        sketch([AXES, pt(AXES.x, AXES.y - 70)], 3, 0.6),
        sketch([AXES, pt(AXES.x + 68, AXES.y - 39.3)], 7, 0.6),
        sketch([AXES, pt(AXES.x - 68, AXES.y - 39.3)], 11, 0.6),
        { kind: 'angle', at: AXES, from: 0, to: 30, r: 34, label: '30°' },
        { kind: 'angle', at: AXES, from: 150, to: 180, r: 34, label: '30°' },
        text(pt(AXES.x + 4, AXES.y - 74), 'HEIGHT', 2.8, { align: 'left', colour: '#64748b' }),
        text(pt(AXES.x + 72, AXES.y - 42), 'LENGTH', 2.8, { align: 'left', colour: '#64748b' }),
        text(pt(AXES.x - 72, AXES.y - 42), 'DEPTH', 2.8, { align: 'right', colour: '#64748b' }),
      ],
    },
    {
      id: 'axes-cube',
      title: 'Build a cube on them',
      tool: 'pencil',
      focus: { at: CUBE, r: 82 },
      tip: 'Only nine edges of a cube are visible. Sketch those and stop — the other three are behind it.',
      lines: [
        { text: 'Now a fifty cube, freehand, on a fresh set of axes.' },
        { text: 'Step fifty along each of the three, from the corner.' },
        { text: 'From each of those three points, sketch lines parallel to the other two axes.' },
        { text: 'Parallel is the whole trick. Every line in an isometric sketch is parallel to one of the three.' },
        { text: 'They close up into three faces — top, left and right.' },
        { text: 'Nine edges visible. The other three are round the back, so leave them off.' },
        { text: 'That is a cube. And any box-shaped job is that cube with pieces taken out.' },
      ],
      markLines: [1, 2, 2, 4],
      marks: [
        ...([
          [v3(0, 0, 0), v3(50, 0, 0)],
          [v3(0, 0, 0), v3(0, 50, 0)],
          [v3(0, 0, 0), v3(0, 0, 50)],
          [v3(50, 0, 0), v3(50, 0, 50)],
          [v3(0, 50, 0), v3(0, 50, 50)],
          [v3(0, 0, 50), v3(50, 0, 50)],
          [v3(0, 0, 50), v3(0, 50, 50)],
          [v3(50, 0, 50), v3(50, 50, 50)],
          [v3(0, 50, 50), v3(50, 50, 50)],
        ] as [Vec3, Vec3][]).map(([a, b], index) =>
          poly(freehand([isoPoint(CUBE, a), isoPoint(CUBE, b)], 40 + index, 0.6, 12), 'outline')
        ),
        text(pt(CUBE.x, CUBE.y + 12), '50 CUBE — 9 EDGES SHOWN', 2.8, { colour: '#64748b' }),
      ],
    },
    {
      id: 'axes-faults',
      title: 'The two faults that spoil it',
      tool: 'pencil',
      focus: { at: pt(200, 100), r: 120 },
      tip: 'A vertical that is not vertical, and two axes at different angles. Both are obvious once you look for them.',
      lines: [
        { text: 'Two faults spoil nearly every beginner\'s isometric sketch.' },
        { text: 'One. The vertical is not vertical. It leans, and the whole box looks like it is falling.' },
        { text: 'Check it against the edge of the paper. That is what the edge is for.' },
        { text: 'Two. The two sloping axes are at different angles.' },
        { text: 'One is at twenty, one is at forty, and the box looks twisted.' },
        { text: 'Sight along them. They should mirror each other exactly.' },
        { text: 'Fix those two and a freehand isometric sketch reads as well as a drawn one.' },
      ],
      marks: [
        text(pt(40, 74), 'FAULT 1  LEANING VERTICAL', 3.2, { align: 'left', bold: true }),
        text(pt(40, 84), 'CHECK IT AGAINST THE SHEET EDGE', 2.8, { align: 'left', colour: '#64748b' }),
        text(pt(40, 100), 'FAULT 2  AXES AT DIFFERENT ANGLES', 3.2, { align: 'left', bold: true }),
        text(pt(40, 110), 'SIGHT ALONG THEM — THEY MUST MIRROR', 2.8, { align: 'left', colour: '#64748b' }),
        sketch([pt(250, 118), pt(256, 74)], 91, 0.5),
        sketch([pt(250, 118), pt(300, 96)], 93, 0.5),
        sketch([pt(250, 118), pt(212, 106)], 95, 0.5),
        text(pt(256, 128), 'WRONG', 3, { bold: true, colour: '#b91c1c' }),
        line(pt(350, 118), pt(350, 74), 'outline'),
        line(pt(350, 118), pt(392, 94), 'outline'),
        line(pt(350, 118), pt(308, 94), 'outline'),
        text(pt(350, 128), 'RIGHT', 3, { bold: true, colour: '#15803d' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 3 — Front view and top view: the most representative views
 * ======================================================================== */

const REP = (() => {
  const PICT = pt(300, 120);
  const FV = pt(70, 200);
  const TV = pt(70, 232);
  return { PICT, FV, TV };
})();

/** The angle bracket the choice is made about: 80 × 60 × 50 with a 20 web. */
const BRACKET_ISO: [Vec3, Vec3][] = [
  [v3(0, 0, 0), v3(80, 0, 0)],
  [v3(80, 0, 0), v3(80, 0, 20)],
  [v3(80, 0, 20), v3(20, 0, 20)],
  [v3(20, 0, 20), v3(20, 0, 60)],
  [v3(20, 0, 60), v3(0, 0, 60)],
  [v3(0, 0, 60), v3(0, 0, 0)],
  [v3(0, 0, 60), v3(0, 50, 60)],
  [v3(0, 50, 60), v3(20, 50, 60)],
  [v3(20, 50, 60), v3(20, 0, 60)],
  [v3(20, 50, 60), v3(20, 50, 20)],
  [v3(20, 50, 20), v3(20, 0, 20)],
  [v3(20, 50, 20), v3(80, 50, 20)],
  [v3(80, 50, 20), v3(80, 0, 20)],
  [v3(80, 50, 20), v3(80, 50, 0)],
  [v3(80, 50, 0), v3(80, 0, 0)],
];

const REPRESENTATIVE_VIEWS: DrawTopic = {
  id: 'sketch-representative-views',
  title: 'Front view and top view — the most representative views',
  subtitle: 'Choosing which two views actually describe the part.',
  goal: 'Choose the front view that shows the most shape, and sketch it with the top view that completes the description.',
  minutes: 30,
  level: 'Core',
  tools: ['HB pencil', 'Eraser', 'Plain paper'],
  base: [
    ...fabSheet({ title: 'MOST REPRESENTATIVE VIEWS', number: 'F-38', scale: '—' }),
    ...BRACKET_ISO.map(([a, b]) =>
      poly(freehand([isoPoint(REP.PICT, a), isoPoint(REP.PICT, b)], 200 + a.x + b.z, 0.55, 12), 'outline')
    ),
    text(pt(REP.PICT.x, REP.PICT.y + 14), 'THE JOB', 3.4, { bold: true, colour: '#64748b' }),
  ],
  steps: [
    {
      id: 'rep-idea',
      title: 'The front view is a choice, not a fact',
      tool: 'hand',
      focus: { at: REP.PICT, r: 110 },
      tip: 'The front view is whichever view shows the most shape — not the view of the end somebody calls the front.',
      lines: [
        { text: 'Every part has six directions you could look at it from. Six possible views.' },
        { text: 'A drawing uses two or three of them, and picking the right ones is a real decision.' },
        { text: 'The main one is called the front view, and that name misleads people.' },
        { text: 'It does not mean the front of the object. The object does not have a front.' },
        { text: 'The front view is whichever view shows the most shape.' },
        { text: 'Three things decide it. Most shape. Fewest hidden lines. Longest dimension across the page.' },
        { text: 'Get the front view right and the other views nearly choose themselves.' },
      ],
      marks: [],
    },
    {
      id: 'rep-try',
      title: 'Try all three directions',
      tool: 'pencil',
      focus: { at: pt(160, 110), r: 120 },
      tip: 'Sketch each candidate small before committing. Two minutes here saves redrawing a whole sheet.',
      lines: [
        { text: 'This is an angle bracket. Eighty long, sixty high, fifty deep, with a twenty web.' },
        { text: 'Sketch each of the three directions small, and compare them.' },
        { text: 'Looking from the end, along the length. You get an L. All the shape is there.' },
        { text: 'Looking from the front, along the depth. A plain rectangle, eighty by sixty.' },
        { text: 'A rectangle tells you nothing. You cannot see the step at all.' },
        { text: 'Looking from above. Another rectangle, eighty by fifty. No better.' },
        { text: 'So the L wins. That view is the front view, whatever it is the front of.' },
      ],
      markLines: [2, 3, 5],
      marks: [
        sketch(
          [pt(50, 108), pt(90, 108), pt(90, 98), pt(60, 98), pt(60, 78), pt(50, 78), pt(50, 108)],
          301,
          0.6
        ),
        text(pt(70, 120), 'A — SHOWS THE SHAPE', 2.8, { colour: '#15803d' }),
        sketch([pt(120, 108), pt(180, 108), pt(180, 78), pt(120, 78), pt(120, 108)], 311, 0.6),
        text(pt(150, 120), 'B — A RECTANGLE', 2.8, { colour: '#b91c1c' }),
        sketch([pt(205, 108), pt(265, 108), pt(265, 83), pt(205, 83), pt(205, 108)], 321, 0.6),
        text(pt(235, 120), 'C — A RECTANGLE', 2.8, { colour: '#b91c1c' }),
      ],
    },
    {
      id: 'rep-front',
      title: 'Sketch the chosen front view',
      tool: 'pencil',
      focus: { at: pt(115, 190), r: 78 },
      tip: 'Put the longest dimension across the page. A part drawn tall and thin wastes the sheet.',
      lines: [
        { text: 'Now sketch it properly, bigger, at the bottom of the sheet.' },
        { text: 'Base line eighty long, up the left side sixty.' },
        { text: 'Across twenty, down forty, across sixty, and close it.' },
        { text: 'The L again, and every bit of the shape is in it.' },
        { text: 'Notice it is wider than it is tall. That is deliberate.' },
        { text: 'Put the longest dimension across the page. A tall thin drawing wastes the sheet.' },
      ],
      markLines: [1, 2, 2],
      marks: [
        sketch(
          [
            REP.FV,
            pt(REP.FV.x + 80, REP.FV.y),
            pt(REP.FV.x + 80, REP.FV.y - 20),
            pt(REP.FV.x + 20, REP.FV.y - 20),
            pt(REP.FV.x + 20, REP.FV.y - 60),
            REP.FV,
          ],
          331,
          0.6
        ),
        line(pt(REP.FV.x, REP.FV.y - 60), pt(REP.FV.x, REP.FV.y), 'outline'),
        text(pt(REP.FV.x + 40, REP.FV.y - 68), 'FRONT VIEW', 3.4, { bold: true }),
      ],
    },
    {
      id: 'rep-top',
      title: 'And the top view that finishes the job',
      tool: 'pencil',
      focus: { at: pt(115, 225), r: 82 },
      tip: 'Two views are enough when the second one supplies the only size the first one is missing.',
      lines: [
        { text: 'One view is never enough. The L tells you nothing about how deep the bracket is.' },
        { text: 'So add the top view, underneath, in first angle.' },
        { text: 'Project the two ends straight down, and put the depth on. Fifty.' },
        { text: 'That is a rectangle, eighty by fifty — and now it is doing useful work.' },
        { text: 'On its own it said nothing. Beside the front view it supplies the one missing size.' },
        { text: 'Two views, and the bracket is fully described. You do not need a third.' },
        { text: 'That is the rule: use as many views as it takes, and not one more.' },
      ],
      markLines: [1, 2, 2, 3],
      marks: [
        line(pt(REP.FV.x, REP.FV.y), pt(REP.FV.x, REP.TV.y + 42), 'construction'),
        line(pt(REP.FV.x + 80, REP.FV.y), pt(REP.FV.x + 80, REP.TV.y + 42), 'construction'),
        line(pt(REP.FV.x + 20, REP.FV.y), pt(REP.FV.x + 20, REP.TV.y + 42), 'construction'),
        sketch(
          [REP.TV, pt(REP.TV.x + 80, REP.TV.y), pt(REP.TV.x + 80, REP.TV.y + 34), pt(REP.TV.x, REP.TV.y + 34), REP.TV],
          341,
          0.6
        ),
        sketch([pt(REP.TV.x + 20, REP.TV.y), pt(REP.TV.x + 20, REP.TV.y + 34)], 347, 0.5),
        { kind: 'dim', a: pt(REP.TV.x + 84, REP.TV.y), b: pt(REP.TV.x + 84, REP.TV.y + 34), offset: -12, label: '50' },
        text(pt(REP.TV.x + 40, REP.TV.y + 44), 'TOP VIEW', 3.4, { bold: true }),
      ],
    },
  ],
};

/* ==========================================================================
 * 4 — Isometric converted to first angle orthographic
 * ======================================================================== */

const CONV = (() => {
  const PICT = pt(300, 118);
  const L = 80;
  const D = 50;
  const H = 45;
  /** A 24 wide slot, 18 deep, cut right through the top from front to back. */
  const SLOT_FROM = 28;
  const SLOT_TO = 52;
  const SLOT_BASE = H - 18;
  const FV = pt(60, 120);
  const PLAN_BACK = 148;
  const EV_LEFT = 175;
  return { PICT, L, D, H, SLOT_FROM, SLOT_TO, SLOT_BASE, FV, PLAN_BACK, EV_LEFT };
})();

const SLOTTED_ISO: [Vec3, Vec3][] = (() => {
  const { L, D, H, SLOT_FROM: S1, SLOT_TO: S2, SLOT_BASE: SB } = CONV;
  return [
    [v3(0, 0, 0), v3(L, 0, 0)],
    [v3(L, 0, 0), v3(L, 0, H)],
    [v3(0, 0, 0), v3(0, 0, H)],
    [v3(0, 0, H), v3(S1, 0, H)],
    [v3(S2, 0, H), v3(L, 0, H)],
    [v3(S1, 0, H), v3(S1, 0, SB)],
    [v3(S1, 0, SB), v3(S2, 0, SB)],
    [v3(S2, 0, SB), v3(S2, 0, H)],
    [v3(0, 0, H), v3(0, D, H)],
    [v3(0, D, H), v3(S1, D, H)],
    [v3(S2, D, H), v3(L, D, H)],
    [v3(L, D, H), v3(L, 0, H)],
    [v3(S1, D, H), v3(S1, D, SB)],
    [v3(S1, D, SB), v3(S2, D, SB)],
    [v3(S2, D, SB), v3(S2, D, H)],
    [v3(S1, D, SB), v3(S1, 0, SB)],
    [v3(S2, D, SB), v3(S2, 0, SB)],
    [v3(L, D, H), v3(L, D, 0)],
    [v3(L, D, 0), v3(L, 0, 0)],
  ] as [Vec3, Vec3][];
})();

const ISO_TO_ORTHO: DrawTopic = {
  id: 'sketch-iso-to-first-angle',
  title: 'An isometric drawing converted to first angle orthographic',
  subtitle: 'Reading a picture and turning it into the three views that get it made.',
  goal: 'Read a pictorial drawing of a slotted block and produce its front view, plan and end view in first angle.',
  minutes: 45,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Scale rule', 'HB and 2H pencils'],
  base: [
    ...fabSheet({ title: 'ISOMETRIC TO FIRST ANGLE', number: 'F-39', scale: '1:1', angle: 'first' }),
    ...SLOTTED_ISO.map(([a, b]) => line(isoPoint(CONV.PICT, a), isoPoint(CONV.PICT, b), 'thin')),
    text(pt(CONV.PICT.x, CONV.PICT.y + 16), 'GIVEN — ISOMETRIC', 3.4, { bold: true, colour: '#64748b' }),
  ],
  steps: [
    {
      id: 'conv-read',
      title: 'Read the picture before you draw anything',
      tool: 'hand',
      focus: { at: CONV.PICT, r: 100 },
      tip: 'Read the overall box first, then what has been taken out of it. Every conversion question is a box with pieces removed.',
      lines: [
        { text: 'This is the sort of question you get in an exam. A pictorial drawing, and convert it.' },
        { text: 'Do not start drawing. Read it first, and read it in a set order.' },
        { text: 'One. What is the overall box? Eighty long, fifty deep, forty five high.' },
        { text: 'Two. What has been taken out of that box?' },
        { text: 'A slot in the top. Twenty four wide, eighteen deep, and it runs right through front to back.' },
        { text: 'That is all. A box, with a slot in it.' },
        { text: 'Every conversion question in this subject is a box with pieces taken out of it.' },
        { text: 'Find the box, find what is missing, and the views are easy.' },
      ],
      marks: [],
    },
    {
      id: 'conv-front',
      title: 'The front view carries the slot',
      tool: 'tsquare',
      teeY: CONV.FV.y,
      focus: { at: pt(100, 100), r: 68 },
      tip: 'Look along the isometric depth axis. Whatever you see is the front view — and here the slot shows in full.',
      lines: [
        { text: 'Look at the isometric along the depth axis, and draw what you see.' },
        { text: 'Base line eighty, sides up forty five.' },
        { text: 'The top is not straight across. The slot is cut into it.' },
        { text: 'Across twenty eight, down eighteen, across twenty four, up eighteen, and across the rest.' },
        { text: 'That gives the notch, and it is drawn in outline because you can see straight into it.' },
        { text: 'Nothing is hidden in this view. That is what makes it the right front view.' },
      ],
      markLines: [1, 3, 3],
      marks: [
        poly(
          [
            CONV.FV,
            pt(CONV.FV.x + CONV.L, CONV.FV.y),
            pt(CONV.FV.x + CONV.L, CONV.FV.y - CONV.H),
            pt(CONV.FV.x + CONV.SLOT_TO, CONV.FV.y - CONV.H),
            pt(CONV.FV.x + CONV.SLOT_TO, CONV.FV.y - CONV.SLOT_BASE),
            pt(CONV.FV.x + CONV.SLOT_FROM, CONV.FV.y - CONV.SLOT_BASE),
            pt(CONV.FV.x + CONV.SLOT_FROM, CONV.FV.y - CONV.H),
            pt(CONV.FV.x, CONV.FV.y - CONV.H),
          ],
          'outline',
          true
        ),
        text(pt(CONV.FV.x + 40, CONV.FV.y + 9), 'FRONT VIEW', 3.4, { bold: true }),
      ],
    },
    {
      id: 'conv-plan',
      title: 'The plan goes below — first angle',
      tool: 'tsquare',
      teeY: CONV.PLAN_BACK,
      focus: { at: pt(100, 150), r: 82 },
      tip: 'First angle: plan below, and the edge of the plan touching the front view is the BACK of the block.',
      lines: [
        { text: 'First angle, so the plan goes underneath.' },
        { text: 'Project the ends and both sides of the slot straight down.' },
        { text: 'Depth is fifty, and it comes from the isometric — nowhere else.' },
        { text: 'The rectangle is eighty by fifty.' },
        { text: 'The two slot sides show as full lines across it, because looking down you see straight into the slot.' },
        { text: 'And remember which edge is which. The one nearest the front view is the back of the block.' },
      ],
      markLines: [1, 1, 2, 4],
      marks: [
        ...[0, CONV.SLOT_FROM, CONV.SLOT_TO, CONV.L].map((x) =>
          line(pt(CONV.FV.x + x, CONV.FV.y), pt(CONV.FV.x + x, CONV.PLAN_BACK + CONV.D + 10), 'construction')
        ),
        poly(
          [
            pt(CONV.FV.x, CONV.PLAN_BACK),
            pt(CONV.FV.x + CONV.L, CONV.PLAN_BACK),
            pt(CONV.FV.x + CONV.L, CONV.PLAN_BACK + CONV.D),
            pt(CONV.FV.x, CONV.PLAN_BACK + CONV.D),
          ],
          'outline',
          true
        ),
        line(pt(CONV.FV.x + CONV.SLOT_FROM, CONV.PLAN_BACK), pt(CONV.FV.x + CONV.SLOT_FROM, CONV.PLAN_BACK + CONV.D), 'outline'),
        line(pt(CONV.FV.x + CONV.SLOT_TO, CONV.PLAN_BACK), pt(CONV.FV.x + CONV.SLOT_TO, CONV.PLAN_BACK + CONV.D), 'outline'),
        text(pt(CONV.FV.x + 40, CONV.PLAN_BACK + CONV.D + 9), 'PLAN', 3.4, { bold: true }),
      ],
    },
    {
      id: 'conv-end',
      title: 'The end view, and where the hidden line comes from',
      tool: 'set45',
      focus: { at: pt(180, 130), r: 96 },
      tip: 'The slot does not reach the end of the block, so from the end you see a solid face with the slot bottom hidden behind it.',
      lines: [
        { text: 'Now the end view. First angle, looking from the left, so it goes on the right.' },
        { text: 'Mitre line, carry the depth across, and bring the height over from the front view.' },
        { text: 'Fifty by forty five. A plain rectangle.' },
        { text: 'But wait — where has the slot gone?' },
        { text: 'The slot does not reach the end of the block. At the end, the block is solid, full height.' },
        { text: 'So looking from the end you see a solid face. The slot is behind it.' },
        { text: 'The bottom of the slot shows as one hidden line across, eighteen down from the top.' },
        { text: 'That hidden line is the whole answer to this view, and it is where the marks are.' },
      ],
      markLines: [1, 1, 2, 6],
      marks: [
        line(pt(CONV.EV_LEFT - 8, CONV.PLAN_BACK - 8), pt(CONV.EV_LEFT + CONV.D + 8, CONV.PLAN_BACK + CONV.D + 8), 'construction'),
        line(pt(CONV.FV.x + CONV.L, CONV.PLAN_BACK), pt(CONV.EV_LEFT, CONV.PLAN_BACK), 'construction'),
        line(pt(CONV.FV.x + CONV.L, CONV.PLAN_BACK + CONV.D), pt(CONV.EV_LEFT + CONV.D, CONV.PLAN_BACK + CONV.D), 'construction'),
        line(pt(CONV.EV_LEFT, CONV.PLAN_BACK), pt(CONV.EV_LEFT, CONV.FV.y - CONV.H - 8), 'construction'),
        line(pt(CONV.EV_LEFT + CONV.D, CONV.PLAN_BACK + CONV.D), pt(CONV.EV_LEFT + CONV.D, CONV.FV.y - CONV.H - 8), 'construction'),
        line(pt(CONV.FV.x + CONV.L, CONV.FV.y), pt(CONV.EV_LEFT + CONV.D + 10, CONV.FV.y), 'construction'),
        line(pt(CONV.FV.x + CONV.L, CONV.FV.y - CONV.H), pt(CONV.EV_LEFT + CONV.D + 10, CONV.FV.y - CONV.H), 'construction'),
        poly(
          [
            pt(CONV.EV_LEFT, CONV.FV.y),
            pt(CONV.EV_LEFT + CONV.D, CONV.FV.y),
            pt(CONV.EV_LEFT + CONV.D, CONV.FV.y - CONV.H),
            pt(CONV.EV_LEFT, CONV.FV.y - CONV.H),
          ],
          'outline',
          true
        ),
        line(pt(CONV.EV_LEFT, CONV.FV.y - CONV.SLOT_BASE), pt(CONV.EV_LEFT + CONV.D, CONV.FV.y - CONV.SLOT_BASE), 'hidden'),
        text(pt(CONV.EV_LEFT + 25, CONV.FV.y + 9), 'END VIEW', 3.4, { bold: true }),
      ],
    },
    {
      id: 'conv-check',
      title: 'Check it back against the picture',
      tool: 'pencil',
      focus: { at: pt(190, 130), r: 150 },
      tip: 'Three checks: every size appears once, every view lines up, and every edge in the pictorial appears in at least one view.',
      lines: [
        { text: 'Before you hand it in, check it back against the isometric. Three checks.' },
        { text: 'One. Do the views line up? Plan directly under the front view, end view directly across.' },
        { text: 'Two. Is every size on the drawing once, and only once?' },
        { text: 'Eighty and forty five on the front view. Fifty on the plan. Twenty four and eighteen on the slot.' },
        { text: 'Three. Take every edge in the pictorial and find it in at least one view.' },
        { text: 'If an edge is nowhere, you have missed a line. If a line matches nothing, you have added one.' },
        { text: 'And the projection symbol goes in. First angle, or the whole drawing can be read backwards.' },
      ],
      marks: [
        { kind: 'dim', a: CONV.FV, b: pt(CONV.FV.x + CONV.L, CONV.FV.y), offset: -18, label: '80' },
        {
          kind: 'dim',
          a: pt(CONV.FV.x + CONV.SLOT_FROM, CONV.FV.y - CONV.H),
          b: pt(CONV.FV.x + CONV.SLOT_TO, CONV.FV.y - CONV.H),
          offset: 14,
          label: '24',
        },
        {
          kind: 'dim',
          a: pt(CONV.FV.x, CONV.FV.y),
          b: pt(CONV.FV.x, CONV.FV.y - CONV.H),
          offset: 16,
          label: '45',
        },
        {
          kind: 'dim',
          a: pt(CONV.EV_LEFT + CONV.D, CONV.FV.y - CONV.H),
          b: pt(CONV.EV_LEFT + CONV.D, CONV.FV.y - CONV.SLOT_BASE),
          offset: -16,
          label: '18',
        },
      ],
    },
  ],
};

export const SKETCHING_TOPICS: DrawTopic[] = [
  MATCHSTICK,
  ISO_AXES,
  REPRESENTATIVE_VIEWS,
  ISO_TO_ORTHO,
];
