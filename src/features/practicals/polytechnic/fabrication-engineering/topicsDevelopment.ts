/**
 * Template development — the plater's half of this course.
 *
 * Every sheet here answers the same question in a different shape: *what flat
 * plate, cut out and rolled, becomes this job?* The answer is never guessed. It
 * comes off an ordinate: divide the girth into twelve, find how long each of
 * those twelve elements has to be, set the twelve lengths out on a straight
 * stretch-out, and join the tops. The lessons differ only in what decides the
 * length — a flat cut, another pipe, a boiler shell, a curved end.
 *
 * The lengths themselves come from `fabricationGeometry`, which works them out
 * from the equation of the intersection rather than by scaling them off a
 * drawing. A template that is 2 mm out closes 2 mm out.
 */

import {
  dist,
  lerpPt,
  polar,
  pt,
  rad,
  type Mark,
  type Pt,
} from '../technical-drawing/drawingGeometry';
import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import {
  branchCurve,
  branchCut,
  cutCylinderCurve,
  cutLength,
  fabSheet,
  girth,
  line,
  numberedPlan,
  poly,
  saddleCurve,
  saddleCut,
  saddleHoleInShell,
  sampleCurve,
  stations,
  text,
} from './fabricationGeometry';

/** A pencil dot marking a plotted point. */
const dot = (at: Pt): Mark => ({ kind: 'dot', style: 'outline', at });

/** The ticks a plater walks along a stretch-out, numbered 1 to 12 and back to 1. */
function stretchTicks(origin: Pt, radius: number, height: number, count = 12): Mark[] {
  const total = girth(radius);
  const marks: Mark[] = [];
  for (let index = 0; index <= count; index += 1) {
    const x = origin.x + (total * index) / count;
    marks.push(line(pt(x, origin.y), pt(x, origin.y - height), 'construction'));
    marks.push(text(pt(x, origin.y + 5), String((index % count) + 1), 2.6, { colour: '#64748b' }));
  }
  return marks;
}

/* ==========================================================================
 * 1 — A cylinder cut by a plane at an angle
 * ======================================================================== */

const CUT = (() => {
  const R = 30;
  const AX = 95;
  const BASE = 120;
  const AXIS_HEIGHT = 60;
  const ANGLE = 30;
  const PLAN = pt(AX, 162);
  const DEV = pt(180, 120);
  const G = girth(R);
  const marked = stations(R, 12, 180);

  const cutY = (offset: number) => BASE - cutLength(AXIS_HEIGHT, offset, ANGLE);
  const shortest = cutLength(AXIS_HEIGHT, -R, ANGLE);
  const longest = cutLength(AXIS_HEIGHT, R, ANGLE);

  return { R, AX, BASE, AXIS_HEIGHT, ANGLE, PLAN, DEV, G, marked, cutY, shortest, longest };
})();

const CYLINDER_CUT: DrawTopic = {
  id: 'dev-cylinder-cut',
  title: 'Development of a cylinder cut by a plane at an angle',
  subtitle: 'The first template every plater draws: a pipe mitred off at 30°.',
  goal: 'Develop the plate for a 60 mm pipe cut at 30°, by dividing the girth into twelve and setting each element out to its own length.',
  minutes: 45,
  level: 'Core',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'CYLINDER CUT BY A PLANE', number: 'F-21', scale: '1:1' }),
  steps: [
    {
      id: 'cut-what',
      title: 'What a development actually is',
      tool: 'hand',
      focus: { at: pt(200, 130), r: 175 },
      tip: 'A development is the flat plate. Roll it up and it becomes the job — so it must be the true size, not a picture of it.',
      lines: [
        { text: 'A pipe is not made round. It is made flat, and then rolled.' },
        { text: 'So before anybody cuts anything, somebody has to draw the flat shape.' },
        { text: 'That flat shape is called the development, or the template.' },
        { text: 'Today the job is a sixty millimetre pipe, cut off at thirty degrees.' },
        { text: 'One end square, the other end sloped. Very common — every mitred bend starts here.' },
        { text: 'The rule for the whole sheet is this. Around the pipe, the distance is the girth.' },
        { text: 'And up the pipe, every element has its own length, because the cut is sloping.' },
        { text: 'Find those two things and the template draws itself.' },
      ],
      marks: [],
    },
    {
      id: 'cut-elevation',
      title: 'Draw the elevation of the pipe',
      tool: 'tsquare',
      teeY: CUT.BASE,
      focus: { at: pt(95, 85), r: 62 },
      tip: 'Draw the centre line first. Every measurement across the pipe is taken from it.',
      lines: [
        { text: 'Start with the elevation — the pipe seen from the side.' },
        { text: 'Put the centre line down first, with your 2H. Light.', at: pt(95, 90) },
        { text: 'Now the base line, square across. This is the end that is cut square.', at: pt(95, 120) },
        { text: 'Thirty each side of the centre line, and up go the two sides.', at: pt(65, 100) },
        { text: 'Now the sloping cut. Sixty up the centre line, and thirty degrees off the square.', at: pt(95, 60), label: '30°' },
        { text: 'Look at what that does. The left side comes out short — forty two point seven.', at: pt(65, 78), label: 'shortest' },
        { text: 'And the right side is long — seventy seven point three.', at: pt(125, 45), label: 'longest' },
        { text: 'Same pipe. Different lengths. That is the whole problem in one picture.' },
      ],
      markLines: [1, 2, 3, 3, 4, 4, 4],
      marks: [
        line(pt(CUT.AX, CUT.BASE + 12), pt(CUT.AX, 34), 'centre'),
        line(pt(CUT.AX - CUT.R - 10, CUT.BASE), pt(CUT.AX + CUT.R + 10, CUT.BASE), 'outline'),
        line(pt(CUT.AX - CUT.R, CUT.BASE), pt(CUT.AX - CUT.R, CUT.cutY(-CUT.R)), 'outline'),
        line(pt(CUT.AX + CUT.R, CUT.BASE), pt(CUT.AX + CUT.R, CUT.cutY(CUT.R)), 'outline'),
        line(pt(CUT.AX - CUT.R, CUT.cutY(-CUT.R)), pt(CUT.AX + CUT.R, CUT.cutY(CUT.R)), 'outline'),
        line(pt(CUT.AX - CUT.R, CUT.cutY(-CUT.R)), pt(CUT.AX + 4, CUT.cutY(-CUT.R)), 'construction'),
        {
          kind: 'angle',
          at: pt(CUT.AX - CUT.R, CUT.cutY(-CUT.R)),
          from: 0,
          to: CUT.ANGLE,
          r: 20,
          label: '30°',
        },
      ],
    },
    {
      id: 'cut-plan',
      title: 'The plan, divided into twelve',
      tool: 'compass',
      compassRadius: CUT.R,
      focus: { at: CUT.PLAN, r: 56 },
      tip: 'Twelve parts is the trade standard. More parts, more accurate — but twelve is close enough for plate and quick enough to mark off.',
      lines: [
        { text: 'Under the elevation, draw the plan. The pipe seen from above is just a circle.' },
        { text: 'Same centre line, so everything drops straight down.', at: CUT.PLAN },
        { text: 'Compass at thirty. Swing the circle.' },
        { text: 'Now divide it into twelve equal parts. Six on each side, thirty degrees apart.' },
        { text: 'Number them. Start at the far left and go round — one, two, three, all the way to twelve.' },
        { text: 'Why start there? Because that is the shortest element, and that is where the seam goes.' },
        { text: 'A welder would rather have the seam on the short side. Less weld, less waste.' },
      ],
      markLines: [0, 1, 1, 2, 4],
      marks: [
        line(pt(CUT.AX, CUT.PLAN.y - CUT.R - 10), pt(CUT.AX, CUT.PLAN.y + CUT.R + 10), 'centre'),
        line(pt(CUT.AX - CUT.R - 10, CUT.PLAN.y), pt(CUT.AX + CUT.R + 10, CUT.PLAN.y), 'centre'),
        { kind: 'circle', style: 'outline', c: CUT.PLAN, r: CUT.R },
        { kind: 'dim', a: pt(CUT.AX - CUT.R, CUT.PLAN.y), b: pt(CUT.AX + CUT.R, CUT.PLAN.y), offset: -42, label: 'Ø60' },
        ...numberedPlan(CUT.PLAN, CUT.R, 12, 180),
      ],
    },
    {
      id: 'cut-project',
      title: 'Project every point up to the cut',
      tool: 'set45',
      focus: { at: pt(95, 115), r: 88 },
      tip: 'Points 8 to 12 land on the same lines as 6 down to 2. The pipe is symmetrical, so half the work is already done.',
      lines: [
        { text: 'Now project. From every point on the plan, a line straight up into the elevation.' },
        { text: 'Where that line meets the sloping cut, put a dot. That is how long that element is.' },
        { text: 'Point one — up to the cut. Short.' },
        { text: 'Point four, up the middle. That one is exactly sixty.' },
        { text: 'Point seven, on the far right. That is the long one.' },
        { text: 'Now look carefully. Point eight lands on the same line as point six.' },
        { text: 'And nine on five, ten on four, eleven on three, twelve on two.' },
        { text: 'The pipe is symmetrical. So you only ever draw seven lines, and read ten of them off.' },
      ],
      marks: [
        ...[0, 1, 2, 3, 4, 5, 6].flatMap((index) => {
          const station = CUT.marked[index];
          const x = CUT.AX + station.offset;
          const planY = CUT.PLAN.y - CUT.R * Math.sin(rad(station.angle));
          return [line(pt(x, planY), pt(x, CUT.cutY(station.offset)), 'construction')];
        }),
        ...[0, 1, 2, 3, 4, 5, 6].map((index) =>
          dot(pt(CUT.AX + CUT.marked[index].offset, CUT.cutY(CUT.marked[index].offset)))
        ),
      ],
    },
    {
      id: 'cut-stretch',
      title: 'Set out the stretch-out',
      tool: 'tsquare',
      teeY: CUT.DEV.y,
      focus: { at: pt(275, 100), r: 110 },
      tip: 'Girth = π × diameter. 3.142 × 60 = 188.5 mm. Never measure it off the circle with a compass — it will always come out short.',
      lines: [
        { text: 'Move over to the right of the sheet. This is where the template gets built.' },
        { text: 'Draw one long straight line, level with the base of the pipe.' },
        { text: 'How long? The distance right round the pipe. That is the girth.' },
        { text: 'Girth is pi times the diameter. Three point one four two, times sixty.' },
        { text: 'One hundred and eighty eight point five millimetres. Measure it, do not step it off.' },
        { text: 'Now divide that length into twelve equal parts. Fifteen point seven each.' },
        { text: 'Number them one to twelve, and one again at the far end — you finish where you started.' },
        { text: 'Erect a light line at every division. Those are your twelve elements, laid flat.' },
      ],
      markLines: [1, 4, 5, 7],
      marks: [
        line(CUT.DEV, pt(CUT.DEV.x + CUT.G, CUT.DEV.y), 'outline'),
        { kind: 'dim', a: CUT.DEV, b: pt(CUT.DEV.x + CUT.G, CUT.DEV.y), offset: -18, label: 'GIRTH πD = 188.5' },
        ...stretchTicks(CUT.DEV, CUT.R, 86),
      ],
    },
    {
      id: 'cut-transfer',
      title: 'Carry the heights across',
      tool: 'set45',
      focus: { at: pt(225, 90), r: 130 },
      tip: 'Heights always travel horizontally. Nothing is measured twice — it is projected.',
      lines: [
        { text: 'Now the heights. Every one of them comes straight off the elevation.' },
        { text: 'From the dot on element one, run a line across the sheet, dead level.' },
        { text: 'Where it crosses the line marked one on the stretch-out — dot.' },
        { text: 'And the same level serves element one at the far end too, because it is the same element.' },
        { text: 'Do element two. Then three. Straight across, mark where it crosses.' },
        { text: 'Notice you never measure anything here. You project it. That is the point.' },
        { text: 'Measuring introduces your error. Projecting carries the drawing office error, which is nobody\'s.' },
      ],
      marks: [
        ...[0, 1, 2, 3, 4, 5, 6].map((index) => {
          const station = CUT.marked[index];
          const y = CUT.cutY(station.offset);
          const far = CUT.DEV.x + (CUT.G * (12 - index)) / 12;
          return line(pt(CUT.AX + station.offset, y), pt(far, y), 'construction');
        }),
        ...Array.from({ length: 13 }, (_, index) => {
          const station = CUT.marked[index % 12];
          return dot(pt(CUT.DEV.x + (CUT.G * index) / 12, CUT.cutY(station.offset)));
        }),
      ],
    },
    {
      id: 'cut-curve',
      title: 'Join the points and close the plate',
      tool: 'pencil',
      focus: { at: pt(275, 90), r: 108 },
      tip: 'The curve of a cylinder cut by one flat plane is always a sine curve. If yours has a kink in it, a point is plotted wrong.',
      lines: [
        { text: 'Thirteen dots. Join them freehand, in one smooth sweep.' },
        { text: 'No set square here. A french curve if you have one, otherwise your hand.' },
        { text: 'It should come out as a perfectly smooth wave. Low, high, low.' },
        { text: 'If there is a corner anywhere in it, one of your points is wrong. Go back and check it.' },
        { text: 'Now close the ends — one short line at each end, up to the curve.' },
        { text: 'That is the template. Both ends are element one, and they meet at the seam.' },
        { text: 'Cut it out, roll it, and the two ends come together with the cut exactly at thirty degrees.' },
        { text: 'Add your seam allowance before you cut the plate. The drawing gives the finished size.' },
      ],
      markLines: [0, 0, 4, 4, 5],
      marks: [
        poly(cutCylinderCurve(CUT.DEV, CUT.R, CUT.AXIS_HEIGHT, CUT.ANGLE, 180, 144), 'outline'),
        line(CUT.DEV, pt(CUT.DEV.x, CUT.DEV.y - CUT.shortest), 'outline'),
        line(pt(CUT.DEV.x + CUT.G, CUT.DEV.y), pt(CUT.DEV.x + CUT.G, CUT.DEV.y - CUT.shortest), 'outline'),
        text(pt(CUT.DEV.x + CUT.G / 2, CUT.DEV.y - 26), 'DEVELOPMENT', 4, { bold: true }),
        text(pt(CUT.DEV.x - 6, CUT.DEV.y - CUT.shortest / 2), 'SEAM', 2.6, { align: 'right', colour: '#64748b' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 2 — The junction of two cylinders of equal diameter
 * ======================================================================== */

const TEE = (() => {
  const R = 30;
  const AX = 95;
  /** Height of the main pipe's axis on the sheet. */
  const MAIN_Y = 150;
  const MAIN_LEFT = 38;
  const MAIN_RIGHT = 152;
  const BRANCH_TOP = 48;
  /** Length of the branch measured from the main pipe's axis. */
  const HEIGHT = MAIN_Y - BRANCH_TOP;
  const PLAN = pt(AX, 222);
  const DEV = pt(178, 248);
  const HOLE = pt(302, 96);
  const G = girth(R);
  const marked = stations(R, 12, 180);
  return { R, AX, MAIN_Y, MAIN_LEFT, MAIN_RIGHT, BRANCH_TOP, HEIGHT, PLAN, DEV, HOLE, G, marked };
})();

const EQUAL_CYLINDERS: DrawTopic = {
  id: 'dev-equal-cylinders',
  title: 'Development of the junction of two cylinders of equal diameter',
  subtitle: 'A branch the same size as the pipe it stands on — the one joint that comes out straight.',
  goal: 'Develop the branch and the hole for a 60 mm tee, using the fact that equal diameters meet in two straight lines at 45°.',
  minutes: 50,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'JUNCTION OF EQUAL CYLINDERS', number: 'F-22', scale: '1:1' }),
  steps: [
    {
      id: 'tee-idea',
      title: 'Why equal diameters are special',
      tool: 'hand',
      focus: { at: pt(120, 130), r: 130 },
      tip: 'Equal diameters: the curve of intersection projects as two straight lines at exactly 45°. Any other pair of diameters gives a curve.',
      lines: [
        { text: 'Two pipes meeting. A branch standing square on a main run.' },
        { text: 'Normally, where two pipes cross, the joint is a curve, and finding it is work.' },
        { text: 'But when the two pipes are the same diameter, something very useful happens.' },
        { text: 'The joint comes out as two straight lines, at exactly forty five degrees.' },
        { text: 'Not roughly. Exactly. And that is worth knowing, because it saves the whole curve.' },
        { text: 'Both pipes here are sixty. So we get the straight joint.' },
        { text: 'We will develop two things: the branch, and the hole to cut in the main.' },
      ],
      marks: [],
    },
    {
      id: 'tee-elevation',
      title: 'Draw the two pipes',
      tool: 'tsquare',
      teeY: TEE.MAIN_Y,
      focus: { at: pt(95, 120), r: 88 },
      tip: 'The 45° joint lines run from the top corner of the branch down to the centre line of the main.',
      lines: [
        { text: 'Centre line of the main pipe, straight across.', at: pt(95, 150) },
        { text: 'Thirty above it and thirty below. That is the main run, sixty diameter.' },
        { text: 'Now the branch. Its centre line comes down here, square to the main.', at: pt(95, 90) },
        { text: 'Thirty each side again, and up to the top of the branch.' },
        { text: 'Here is the useful bit. From the corner where the branch meets the top of the main…' },
        { text: '…draw a line at forty five degrees, down to the centre line of the main.', at: pt(110, 135), label: '45°' },
        { text: 'And the same from the other corner. The two lines meet on the centre line.' },
        { text: 'That vee is the joint. On equal pipes, it really is two straight lines.' },
      ],
      markLines: [0, 1, 1, 2, 3, 3, 5, 6],
      marks: [
        line(pt(TEE.MAIN_LEFT - 8, TEE.MAIN_Y), pt(TEE.MAIN_RIGHT + 8, TEE.MAIN_Y), 'centre'),
        line(pt(TEE.MAIN_LEFT, TEE.MAIN_Y - TEE.R), pt(TEE.MAIN_RIGHT, TEE.MAIN_Y - TEE.R), 'outline'),
        line(pt(TEE.MAIN_LEFT, TEE.MAIN_Y + TEE.R), pt(TEE.MAIN_RIGHT, TEE.MAIN_Y + TEE.R), 'outline'),
        line(pt(TEE.AX, TEE.BRANCH_TOP - 10), pt(TEE.AX, TEE.MAIN_Y + TEE.R + 10), 'centre'),
        line(pt(TEE.AX - TEE.R, TEE.BRANCH_TOP), pt(TEE.AX - TEE.R, TEE.MAIN_Y - TEE.R), 'outline'),
        line(pt(TEE.AX + TEE.R, TEE.BRANCH_TOP), pt(TEE.AX + TEE.R, TEE.MAIN_Y - TEE.R), 'outline'),
        line(pt(TEE.AX - TEE.R, TEE.BRANCH_TOP), pt(TEE.AX + TEE.R, TEE.BRANCH_TOP), 'outline'),
        line(pt(TEE.AX - TEE.R, TEE.MAIN_Y - TEE.R), pt(TEE.AX, TEE.MAIN_Y), 'outline'),
        line(pt(TEE.AX + TEE.R, TEE.MAIN_Y - TEE.R), pt(TEE.AX, TEE.MAIN_Y), 'outline'),
        {
          kind: 'angle',
          at: pt(TEE.AX + TEE.R, TEE.MAIN_Y - TEE.R),
          from: 180,
          to: 225,
          r: 16,
          label: '45°',
        },
      ],
    },
    {
      id: 'tee-plan',
      title: 'The plan of the branch',
      tool: 'compass',
      compassRadius: TEE.R,
      focus: { at: TEE.PLAN, r: 54 },
      tip: 'Number 1 goes on the shortest element — here that is where the branch sits deepest into the main.',
      lines: [
        { text: 'Below, draw the plan of the branch. A circle, thirty radius.' },
        { text: 'Divide it into twelve, same as before.' },
        { text: 'Number one at the left, then round.' },
        { text: 'Points one and seven are the two ends of the vee, sitting deepest in the main.' },
        { text: 'Points four and ten are at the sides — those are the longest elements.' },
        { text: 'That is the opposite of a plain sloping cut, where long and short were opposite each other.' },
        { text: 'Here the branch is short at both ends and long in the middle. It will show in the template.' },
      ],
      markLines: [0, 0, 0, 1],
      marks: [
        line(pt(TEE.AX, TEE.PLAN.y - TEE.R - 9), pt(TEE.AX, TEE.PLAN.y + TEE.R + 9), 'centre'),
        line(pt(TEE.AX - TEE.R - 9, TEE.PLAN.y), pt(TEE.AX + TEE.R + 9, TEE.PLAN.y), 'centre'),
        { kind: 'circle', style: 'outline', c: TEE.PLAN, r: TEE.R },
        { kind: 'dim', a: pt(TEE.AX - TEE.R, TEE.PLAN.y), b: pt(TEE.AX + TEE.R, TEE.PLAN.y), offset: -40, label: 'Ø60' },
        ...numberedPlan(TEE.PLAN, TEE.R, 12, 180),
      ],
    },
    {
      id: 'tee-project',
      title: 'Project up onto the joint',
      tool: 'set45',
      focus: { at: pt(95, 160), r: 110 },
      tip: 'Every element of the branch stops where it hits the 45° line. Read its length from the top of the branch down.',
      lines: [
        { text: 'Project each plan point straight up, into the elevation.' },
        { text: 'Where the line meets the vee, that is where that element of the branch stops.' },
        { text: 'Point one hits the vee right at the outside — the short element.' },
        { text: 'Point four runs all the way down to the middle of the vee. The long one.' },
        { text: 'Mark every crossing with a dot. Seven distinct heights again, by symmetry.' },
        { text: 'The longest is one hundred and two, the shortest is seventy two. Thirty millimetres of difference.' },
        { text: 'That thirty is exactly the radius of the main pipe. It always is, on equal diameters.' },
      ],
      marks: [
        ...[0, 1, 2, 3, 4, 5, 6].map((index) => {
          const station = TEE.marked[index];
          const x = TEE.AX + station.offset;
          const planY = TEE.PLAN.y - TEE.R * Math.sin(rad(station.angle));
          return line(
            pt(x, planY),
            pt(x, TEE.MAIN_Y - TEE.R * Math.abs(Math.cos(rad(station.angle)))),
            'construction'
          );
        }),
        ...[0, 1, 2, 3, 4, 5, 6].map((index) => {
          const station = TEE.marked[index];
          return dot(pt(TEE.AX + station.offset, TEE.MAIN_Y - TEE.R * Math.abs(Math.cos(rad(station.angle)))));
        }),
      ],
    },
    {
      id: 'tee-branch-template',
      title: 'Develop the branch',
      tool: 'tsquare',
      teeY: TEE.DEV.y,
      focus: { at: pt(268, 190), r: 118 },
      tip: 'Two humps. The branch is long at 4 and 10, short at 1 and 7 — one full wave for each side of the vee.',
      lines: [
        { text: 'Stretch-out to the right. One eighty eight point five again — same pipe, same girth.' },
        { text: 'Twelve divisions, lines up from each.' },
        { text: 'Now carry the heights across from the elevation, exactly as before.' },
        { text: 'Plot them, and join up.' },
        { text: 'Look at the shape you get. Two humps, not one.' },
        { text: 'One hump for each side of the vee. That is the branch, opened out flat.' },
        { text: 'Cut that, roll it, and it drops onto the main pipe with no filing and no packing.' },
      ],
      markLines: [0, 0, 1, 2, 3],
      marks: [
        line(TEE.DEV, pt(TEE.DEV.x + TEE.G, TEE.DEV.y), 'outline'),
        { kind: 'dim', a: TEE.DEV, b: pt(TEE.DEV.x + TEE.G, TEE.DEV.y), offset: -14, label: 'GIRTH 188.5' },
        ...stretchTicks(TEE.DEV, TEE.R, 108),
        ...Array.from({ length: 13 }, (_, index) => {
          const station = TEE.marked[index % 12];
          return dot(pt(TEE.DEV.x + (TEE.G * index) / 12, TEE.DEV.y - branchCut(TEE.HEIGHT, TEE.R, station.angle)));
        }),
        poly(branchCurve(TEE.DEV, TEE.R, TEE.HEIGHT, 180, 144), 'outline'),
        line(TEE.DEV, pt(TEE.DEV.x, TEE.DEV.y - branchCut(TEE.HEIGHT, TEE.R, 180)), 'outline'),
        line(
          pt(TEE.DEV.x + TEE.G, TEE.DEV.y),
          pt(TEE.DEV.x + TEE.G, TEE.DEV.y - branchCut(TEE.HEIGHT, TEE.R, 180)),
          'outline'
        ),
        text(pt(TEE.DEV.x + TEE.G / 2, TEE.DEV.y - 20), 'BRANCH TEMPLATE', 3.6, { bold: true }),
      ],
    },
    {
      id: 'tee-hole',
      title: 'And the hole in the main',
      tool: 'pencil',
      focus: { at: TEE.HOLE, r: 66 },
      tip: 'The hole is not a 60 mm circle. Round the pipe it opens out to 94 mm, because the plate is curved away underneath.',
      lines: [
        { text: 'One thing left. You have to cut a hole in the main pipe for the branch to sit in.' },
        { text: 'And here is where people go wrong. They mark a sixty circle. It is not a circle.' },
        { text: 'Along the pipe, the hole is sixty. That direction is flat.' },
        { text: 'But round the pipe, the plate is curved, and the hole opens out.' },
        { text: 'Round the pipe it measures ninety four — that is the arc, not the chord.' },
        { text: 'So the hole template is an oval, longer round the pipe than along it.' },
        { text: 'Wrap that on, scribe it, and cut. Now the branch drops in.' },
      ],
      markLines: [4, 5, 5],
      marks: [
        poly(saddleHoleInShell(TEE.HOLE, TEE.R, TEE.R, 96), 'outline', true),
        line(pt(TEE.HOLE.x - 56, TEE.HOLE.y), pt(TEE.HOLE.x + 56, TEE.HOLE.y), 'centre'),
        line(pt(TEE.HOLE.x, TEE.HOLE.y - 40), pt(TEE.HOLE.x, TEE.HOLE.y + 40), 'centre'),
        {
          kind: 'dim',
          a: pt(TEE.HOLE.x - Math.PI * TEE.R * 0.5, TEE.HOLE.y),
          b: pt(TEE.HOLE.x + Math.PI * TEE.R * 0.5, TEE.HOLE.y),
          offset: -46,
          label: 'ROUND PIPE 94.2',
        },
        {
          kind: 'dim',
          a: pt(TEE.HOLE.x, TEE.HOLE.y + TEE.R),
          b: pt(TEE.HOLE.x, TEE.HOLE.y - TEE.R),
          offset: -50,
          label: 'ALONG 60',
        },
        text(pt(TEE.HOLE.x, TEE.HOLE.y - 46), 'HOLE TEMPLATE', 3.4, { bold: true }),
      ],
    },
  ],
};

/* ==========================================================================
 * 3 — The rake of a funnel of a steamship
 * ======================================================================== */

const FUNNEL = (() => {
  const R = 30;
  const AX = 95;
  const RAKE = 15;
  /** Vertical height of the funnel between deck and top. */
  const RISE = 120;
  /** True length along the raked axis. */
  const AXIS = RISE / Math.cos(rad(RAKE));
  const BASE_Y = 175;
  const TOP_Y = BASE_Y - AXIS;
  const PLAN = pt(AX, 222);
  const DEV = pt(178, 242);
  const G = girth(R);
  const marked = stations(R, 12, 180);
  const amplitude = R * Math.tan(rad(RAKE));
  return { R, AX, RAKE, RISE, AXIS, BASE_Y, TOP_Y, PLAN, DEV, G, marked, amplitude };
})();

/** A small raked funnel, drawn as the given picture of the job. */
function rakedFunnel(base: Pt, height: number, radius: number, rake: number): Mark[] {
  const lean = Math.tan(rad(rake));
  const axisTop = pt(base.x + height * lean, base.y - height);
  const across = radius / Math.cos(rad(rake));
  return [
    line(pt(base.x - across - 16, base.y), pt(base.x + across + 24, base.y), 'outline'),
    line(pt(base.x - across, base.y), pt(axisTop.x - across, axisTop.y), 'outline'),
    line(pt(base.x + across, base.y), pt(axisTop.x + across, axisTop.y), 'outline'),
    line(pt(axisTop.x - across, axisTop.y), pt(axisTop.x + across, axisTop.y), 'outline'),
    line(base, axisTop, 'centre'),
    line(base, pt(base.x, base.y - height - 8), 'construction'),
    { kind: 'angle', at: base, from: 90, to: 90 - rake, r: height * 0.55, label: `${rake}°` },
  ];
}

const FUNNEL_RAKE: DrawTopic = {
  id: 'dev-funnel-rake',
  title: 'Development of the rake of a funnel of a steamship',
  subtitle: 'A funnel leaning back 15°, cut level top and bottom.',
  goal: 'Develop the plate for a raked funnel, taking the true length along the raked axis and setting both cuts out as sine curves.',
  minutes: 45,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: [
    ...fabSheet({ title: 'RAKE OF A SHIP FUNNEL', number: 'F-23', scale: '1:1' }),
    ...rakedFunnel(pt(292, 96), 62, 16, 15),
    text(pt(292, 108), 'THE JOB', 3.4, { bold: true, colour: '#64748b' }),
  ],
  steps: [
    {
      id: 'rake-idea',
      title: 'The funnel leans, the cuts do not',
      tool: 'hand',
      focus: { at: pt(292, 76), r: 72 },
      tip: 'The funnel is raked 15°, but the deck and the top are level. So the cylinder is cut by two parallel planes, both at 15° to a section square across the axis.',
      lines: [
        { text: 'Ships lean their funnels back. It is called the rake, and it is done for looks and for smoke.' },
        { text: 'This one is raked fifteen degrees.' },
        { text: 'But look at where it is cut. The bottom sits on the deck, which is level.' },
        { text: 'And the top is cut level too.' },
        { text: 'So the funnel is a straight cylinder, cut by two flat planes that are parallel to each other.' },
        { text: 'Not square to the funnel. Fifteen degrees off square, both of them.' },
        { text: 'A plater does not work at that angle. He stands the job upright on the board first.' },
        { text: 'Same cylinder, same two cuts, easier lines. Let us do that.' },
      ],
      marks: [],
    },
    {
      id: 'rake-true-length',
      title: 'The length nobody gets right',
      tool: 'tsquare',
      teeY: FUNNEL.BASE_Y,
      focus: { at: pt(95, 118), r: 92 },
      tip: 'Height 120 vertical, but the funnel is 120 ÷ cos 15° = 124.2 long up its own axis. Use 120 and the funnel comes out short.',
      lines: [
        { text: 'Stand it upright. Centre line down, sides thirty each side.' },
        { text: 'Now the length. The funnel is one hundred and twenty high above the deck.' },
        { text: 'But that is the vertical height. The funnel does not run vertically. It leans.' },
        { text: 'Up its own axis it is longer. One hundred and twenty, divided by cos fifteen.' },
        { text: 'One hundred and twenty four point two. Use one twenty and your funnel is short.' },
        { text: 'Mark that on the centre line. That is where the top cut crosses the axis.' },
        { text: 'Now both cuts, fifteen degrees off the square, and parallel to one another.' },
        { text: 'Bottom one first, then the top. Same angle, same lean.' },
      ],
      markLines: [0, 0, 0, 5, 6, 7],
      marks: [
        line(pt(FUNNEL.AX, FUNNEL.BASE_Y + 16), pt(FUNNEL.AX, FUNNEL.TOP_Y - 14), 'centre'),
        line(pt(FUNNEL.AX - FUNNEL.R, FUNNEL.BASE_Y + FUNNEL.amplitude), pt(FUNNEL.AX - FUNNEL.R, FUNNEL.TOP_Y + FUNNEL.amplitude), 'outline'),
        line(pt(FUNNEL.AX + FUNNEL.R, FUNNEL.BASE_Y - FUNNEL.amplitude), pt(FUNNEL.AX + FUNNEL.R, FUNNEL.TOP_Y - FUNNEL.amplitude), 'outline'),
        {
          kind: 'dim',
          a: pt(FUNNEL.AX, FUNNEL.BASE_Y),
          b: pt(FUNNEL.AX, FUNNEL.TOP_Y),
          offset: 46,
          label: 'TRUE 124.2',
        },
        line(
          pt(FUNNEL.AX - FUNNEL.R, FUNNEL.BASE_Y + FUNNEL.amplitude),
          pt(FUNNEL.AX + FUNNEL.R, FUNNEL.BASE_Y - FUNNEL.amplitude),
          'outline'
        ),
        line(
          pt(FUNNEL.AX - FUNNEL.R, FUNNEL.TOP_Y + FUNNEL.amplitude),
          pt(FUNNEL.AX + FUNNEL.R, FUNNEL.TOP_Y - FUNNEL.amplitude),
          'outline'
        ),
      ],
    },
    {
      id: 'rake-plan',
      title: 'Plan, twelve parts, project up',
      tool: 'compass',
      compassRadius: FUNNEL.R,
      focus: { at: pt(95, 190), r: 96 },
      lines: [
        { text: 'Plan below. Circle, thirty radius, twelve equal parts, numbered from the left.' },
        { text: 'Number one on the short side again — the side that leans away from you.' },
        { text: 'Project every point straight up, through both cuts.' },
        { text: 'Each line gives you two dots now. One on the bottom cut, one on the top.' },
        { text: 'And here is the thing to notice: the gap between those two dots never changes.' },
        { text: 'It is one hundred and twenty four point two, every single time.' },
        { text: 'Of course it is — the two cuts are parallel. That will make the template easy.' },
      ],
      markLines: [0, 0, 0, 0],
      marks: [
        line(pt(FUNNEL.AX, FUNNEL.PLAN.y - FUNNEL.R - 9), pt(FUNNEL.AX, FUNNEL.PLAN.y + FUNNEL.R + 9), 'centre'),
        line(pt(FUNNEL.AX - FUNNEL.R - 9, FUNNEL.PLAN.y), pt(FUNNEL.AX + FUNNEL.R + 9, FUNNEL.PLAN.y), 'centre'),
        { kind: 'circle', style: 'outline', c: FUNNEL.PLAN, r: FUNNEL.R },
        { kind: 'dim', a: pt(FUNNEL.AX - FUNNEL.R, FUNNEL.PLAN.y), b: pt(FUNNEL.AX + FUNNEL.R, FUNNEL.PLAN.y), offset: -38, label: 'Ø60' },
        ...numberedPlan(FUNNEL.PLAN, FUNNEL.R, 12, 180),
        ...[0, 1, 2, 3, 4, 5, 6].flatMap((index) => {
          const station = FUNNEL.marked[index];
          const x = FUNNEL.AX + station.offset;
          const planY = FUNNEL.PLAN.y - FUNNEL.R * Math.sin(rad(station.angle));
          const bottom = FUNNEL.BASE_Y - station.offset * Math.tan(rad(FUNNEL.RAKE));
          const top = FUNNEL.TOP_Y - station.offset * Math.tan(rad(FUNNEL.RAKE));
          return [line(pt(x, planY), pt(x, top), 'construction'), dot(pt(x, bottom)), dot(pt(x, top))];
        }),
      ],
    },
    {
      id: 'rake-template',
      title: 'One stretch-out, two curves',
      tool: 'tsquare',
      teeY: FUNNEL.DEV.y,
      focus: { at: pt(270, 175), r: 125 },
      tip: 'Both edges are the same sine curve. Draw one, then set the other off it at 124.2 measured square — not vertical, square.',
      lines: [
        { text: 'Stretch-out on the right. One eighty eight point five, twelve divisions.' },
        { text: 'Carry the bottom heights across and plot them. Join them up — a smooth wave.' },
        { text: 'Now the top edge. You could project it all across again.' },
        { text: 'But you already know it is the same curve, one twenty four point two higher.' },
        { text: 'So set your compass to one twenty four point two, and step it up from every point.' },
        { text: 'Join those. Two identical waves, and the plate between them.' },
        { text: 'Close the ends. That strip is the funnel, flat.' },
        { text: 'Roll it, weld the seam, and it stands on the deck at fifteen degrees with both ends level.' },
      ],
      markLines: [0, 1, 4, 5, 6],
      marks: [
        line(FUNNEL.DEV, pt(FUNNEL.DEV.x + FUNNEL.G, FUNNEL.DEV.y), 'construction'),
        { kind: 'dim', a: FUNNEL.DEV, b: pt(FUNNEL.DEV.x + FUNNEL.G, FUNNEL.DEV.y), offset: -10, label: 'GIRTH 188.5' },
        ...stretchTicks(FUNNEL.DEV, FUNNEL.R, 138),
        poly(
          sampleCurve(0, 1, 144, (t) =>
            pt(
              FUNNEL.DEV.x + FUNNEL.G * t,
              FUNNEL.DEV.y - FUNNEL.R * Math.cos(rad(180 + t * 360)) * Math.tan(rad(FUNNEL.RAKE)) - 8
            )
          ),
          'outline'
        ),
        poly(
          sampleCurve(0, 1, 144, (t) =>
            pt(
              FUNNEL.DEV.x + FUNNEL.G * t,
              FUNNEL.DEV.y - FUNNEL.R * Math.cos(rad(180 + t * 360)) * Math.tan(rad(FUNNEL.RAKE)) - 8 - FUNNEL.AXIS
            )
          ),
          'outline'
        ),
        line(
          pt(FUNNEL.DEV.x, FUNNEL.DEV.y + FUNNEL.amplitude - 8),
          pt(FUNNEL.DEV.x, FUNNEL.DEV.y + FUNNEL.amplitude - 8 - FUNNEL.AXIS),
          'outline'
        ),
        line(
          pt(FUNNEL.DEV.x + FUNNEL.G, FUNNEL.DEV.y + FUNNEL.amplitude - 8),
          pt(FUNNEL.DEV.x + FUNNEL.G, FUNNEL.DEV.y + FUNNEL.amplitude - 8 - FUNNEL.AXIS),
          'outline'
        ),
        text(pt(FUNNEL.DEV.x + FUNNEL.G / 2, FUNNEL.DEV.y - 70), 'FUNNEL PLATE', 4, { bold: true }),
      ],
    },
  ],
};

export const DEVELOPMENT_TOPICS_A: DrawTopic[] = [CYLINDER_CUT, EQUAL_CYLINDERS, FUNNEL_RAKE];
