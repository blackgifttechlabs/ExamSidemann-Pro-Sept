/**
 * Orthographic projection, with every construction and projection line left on
 * the sheet.
 *
 * Two sheets of the same stepped block — once in third angle, once in first —
 * so the only difference a student has to hold in their head is *where the
 * views go*, and one sheet on auxiliary views, where a face that is sloping in
 * every ordinary view is turned square to the observer to get its true shape.
 *
 * The projection lines are not tidied away at the end. They are the working,
 * they are marked, and a plate marker uses exactly the same lines on the steel.
 */

import { bearing, polar, pt, rad, type Mark, type Pt } from '../technical-drawing/drawingGeometry';
import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import { fabSheet, line, poly, text } from './fabricationGeometry';

/* --------------------------------------------------------------- the block */

/** 90 long × 50 deep × 60 high, cut down in two steps of 20. */
const BLOCK = { length: 90, depth: 50, height: 60 } as const;

/** The staircase profile, seen on the front view. Y is measured up from the base. */
const STEP_PROFILE: [number, number][] = [
  [0, 0],
  [90, 0],
  [90, 20],
  [60, 20],
  [60, 40],
  [30, 40],
  [30, 60],
  [0, 60],
];

const frontProfile = (origin: Pt): Pt[] =>
  STEP_PROFILE.map(([x, y]) => pt(origin.x + x, origin.y - y));

/* ==========================================================================
 * 7 — Third angle
 * ======================================================================== */

const THIRD = (() => {
  const FV = pt(110, 190);
  const PLAN_FRONT = 110;
  const PLAN_BACK = PLAN_FRONT - BLOCK.depth;
  const EV_RIGHT = 80;
  const EV_LEFT = EV_RIGHT - BLOCK.depth;
  /** The mitre passes through the corner that ties plan depth to end-view width. */
  const MITRE = pt(EV_RIGHT, PLAN_FRONT);
  return { FV, PLAN_FRONT, PLAN_BACK, EV_RIGHT, EV_LEFT, MITRE };
})();

const THIRD_ANGLE: DrawTopic = {
  id: 'ortho-third-angle-stepped',
  title: 'A stepped block in third angle projection',
  subtitle: 'Plan above, view from the left on the left — with every projection line shown.',
  goal: 'Project three views of a stepped block in third angle, using a mitre line to carry depth from the plan into the end view.',
  minutes: 45,
  level: 'Core',
  tools: ['T-square', '45° set square', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'STEPPED BLOCK — THIRD ANGLE', number: 'F-07', scale: '1:1', angle: 'third' }),
  steps: [
    {
      id: 'third-idea',
      title: 'Third angle puts the view where you looked from',
      tool: 'hand',
      focus: { at: pt(140, 130), r: 145 },
      tip: 'Third angle: the view goes on the side you looked from. Look from above, draw above. Look from the left, draw on the left.',
      lines: [
        { text: 'The block is a staircase. Ninety long, fifty deep, sixty high, cut down in two steps of twenty.' },
        { text: 'Three views will describe it completely. Front view, plan, and one end view.' },
        { text: 'The question is only where to put them, and that is what the angle decides.' },
        { text: 'Third angle is the easy one to remember, because it does what you expect.' },
        { text: 'The view goes on the side you looked from.' },
        { text: 'Look from above — draw it above. Look from the left — draw it on the left.' },
        { text: 'And the edge of each view nearest the front view is the near side of the block.' },
        { text: 'Hold on to that sentence. It answers most third angle questions on its own.' },
      ],
      marks: [],
    },
    {
      id: 'third-front',
      title: 'The front view first',
      tool: 'tsquare',
      teeY: THIRD.FV.y,
      focus: { at: pt(155, 160), r: 68 },
      tip: 'Always start with the view showing the most shape. Here that is the front view — it carries the whole staircase.',
      lines: [
        { text: 'Start with the view that shows the most shape. That is the front view.' },
        { text: 'Base line, ninety long.' },
        { text: 'Up the right hand side, twenty. That is the bottom step.' },
        { text: 'Left thirty, then up twenty again. The middle step.' },
        { text: 'Left thirty, up twenty again. Now you are at sixty.' },
        { text: 'Across thirty to the left, and down sixty to close it.' },
        { text: 'A staircase, and the whole shape of the job is in that one view.' },
      ],
      markLines: [1, 6],
      marks: [poly(frontProfile(THIRD.FV), 'outline', true)],
    },
    {
      id: 'third-plan',
      title: 'Project up to the plan',
      tool: 'tsquare',
      teeY: THIRD.PLAN_FRONT,
      focus: { at: pt(155, 130), r: 92 },
      tip: 'Every vertical projection line is shared between the front view and the plan. Never measure the length twice — project it.',
      lines: [
        { text: 'The plan goes above. Third angle — you looked down, so it is drawn up.' },
        { text: 'Take every corner of the front view and run a light line straight up.' },
        { text: 'Those are the projection lines. Leave them on the sheet. They are your working.' },
        { text: 'Now the depth. Fifty, and it only comes from the drawing you were given.' },
        { text: 'The near edge of the plan is the edge closest to the front view.' },
        { text: 'Fifty back from it is the far edge.' },
        { text: 'Then the two step edges show up as lines across the plan, at thirty and sixty.' },
        { text: 'Visible lines, not hidden. Looking down, you can see straight onto those steps.' },
      ],
      markLines: [1, 1, 1, 4, 5, 6, 6],
      marks: [
        ...[0, 30, 60, 90].map((x) =>
          line(pt(THIRD.FV.x + x, THIRD.FV.y), pt(THIRD.FV.x + x, THIRD.PLAN_BACK - 12), 'construction')
        ),
        line(pt(THIRD.FV.x, THIRD.PLAN_FRONT), pt(THIRD.FV.x + BLOCK.length, THIRD.PLAN_FRONT), 'outline'),
        line(pt(THIRD.FV.x, THIRD.PLAN_BACK), pt(THIRD.FV.x + BLOCK.length, THIRD.PLAN_BACK), 'outline'),
        line(pt(THIRD.FV.x, THIRD.PLAN_FRONT), pt(THIRD.FV.x, THIRD.PLAN_BACK), 'outline'),
        line(pt(THIRD.FV.x + BLOCK.length, THIRD.PLAN_FRONT), pt(THIRD.FV.x + BLOCK.length, THIRD.PLAN_BACK), 'outline'),
        line(pt(THIRD.FV.x + 30, THIRD.PLAN_FRONT), pt(THIRD.FV.x + 30, THIRD.PLAN_BACK), 'outline'),
        line(pt(THIRD.FV.x + 60, THIRD.PLAN_FRONT), pt(THIRD.FV.x + 60, THIRD.PLAN_BACK), 'outline'),
        text(pt(THIRD.FV.x + 45, THIRD.PLAN_BACK - 6), 'PLAN', 3.4, { bold: true }),
      ],
    },
    {
      id: 'third-mitre',
      title: 'The mitre line, and why it exists',
      tool: 'set45',
      focus: { at: pt(95, 105), r: 72 },
      tip: 'The mitre turns a vertical distance in the plan into a horizontal distance in the end view. It is a 45° line, so the two are equal.',
      lines: [
        { text: 'Now the end view, on the left, because that is where you looked from.' },
        { text: 'Its height comes straight across from the front view. Easy.' },
        { text: 'But its width is the depth, and the depth is in the plan, running up and down.' },
        { text: 'So you have to turn a vertical distance into a horizontal one.' },
        { text: 'That is all a mitre line does. Forty five degrees, so in equals out.' },
        { text: 'Draw it from the corner of the plan area, at forty five, up and to the left.' },
        { text: 'Run a line left from the plan until it hits the mitre, then straight down. Depth transferred.' },
      ],
      markLines: [5, 6],
      marks: [
        line(pt(THIRD.MITRE.x + 8, THIRD.MITRE.y + 8), pt(THIRD.MITRE.x - 62, THIRD.MITRE.y - 62), 'construction'),
        text(pt(THIRD.MITRE.x - 34, THIRD.MITRE.y - 22), '45° MITRE', 2.8, { colour: '#64748b', rotate: 45 }),
      ],
    },
    {
      id: 'third-end',
      title: 'The end view, and the hidden steps',
      tool: 'tsquare',
      teeY: THIRD.FV.y,
      focus: { at: pt(80, 165), r: 78 },
      tip: 'Looking from the left you see one flat face. The two step edges are behind it, so they are drawn as hidden detail.',
      lines: [
        { text: 'Carry the depth down off the mitre. Two vertical lines, fifty apart.' },
        { text: 'Carry the height across from the front view. Base line and top.' },
        { text: 'That gives a rectangle. Fifty by sixty.' },
        { text: 'Now think about what you can actually see, looking from the left.' },
        { text: 'One flat face, the full sixty high. The steps are behind it.' },
        { text: 'So the two step edges go on as hidden detail. Short dashes, evenly spaced.' },
        { text: 'And remember which edge is which. The one nearest the front view is the front of the block.' },
      ],
      markLines: [0, 0, 1, 1, 5, 5],
      marks: [
        line(pt(THIRD.EV_LEFT, THIRD.PLAN_FRONT), pt(THIRD.EV_LEFT, THIRD.FV.y), 'construction'),
        line(pt(THIRD.EV_RIGHT, THIRD.PLAN_FRONT), pt(THIRD.EV_RIGHT, THIRD.FV.y), 'construction'),
        line(pt(THIRD.EV_LEFT - 12, THIRD.FV.y), pt(THIRD.FV.x, THIRD.FV.y), 'construction'),
        line(pt(THIRD.EV_LEFT - 12, THIRD.FV.y - BLOCK.height), pt(THIRD.FV.x, THIRD.FV.y - BLOCK.height), 'construction'),
        poly(
          [
            pt(THIRD.EV_LEFT, THIRD.FV.y),
            pt(THIRD.EV_RIGHT, THIRD.FV.y),
            pt(THIRD.EV_RIGHT, THIRD.FV.y - BLOCK.height),
            pt(THIRD.EV_LEFT, THIRD.FV.y - BLOCK.height),
          ],
          'outline',
          true
        ),
        line(pt(THIRD.EV_LEFT, THIRD.FV.y - 20), pt(THIRD.EV_RIGHT, THIRD.FV.y - 20), 'hidden'),
        line(pt(THIRD.EV_LEFT, THIRD.FV.y - 40), pt(THIRD.EV_RIGHT, THIRD.FV.y - 40), 'hidden'),
        text(pt(THIRD.EV_LEFT + 25, THIRD.FV.y + 8), 'VIEW FROM THE LEFT', 2.8, { colour: '#64748b' }),
        text(pt(THIRD.FV.x + 45, THIRD.FV.y + 8), 'FRONT VIEW', 3.4, { bold: true }),
      ],
    },
    {
      id: 'third-finish',
      title: 'Dimension it and mark the angle',
      tool: 'pencil',
      focus: { at: pt(140, 140), r: 140 },
      tip: 'The projection symbol is not decoration. Without it, first and third angle drawings of this block look identical apart from the layout.',
      lines: [
        { text: 'Dimension the overall sizes, and the steps.' },
        { text: 'Ninety long, sixty high, fifty deep. Then thirty and twenty for each step.' },
        { text: 'Put every size on the view that shows the shape best. Never repeat a size.' },
        { text: 'And the last thing, which people forget and lose marks for.' },
        { text: 'The projection symbol, in the title block. The cone with the circles.' },
        { text: 'Third angle: the circles go on the same side as the small end of the cone.' },
        { text: 'Without that symbol, nobody can tell which way round to read your drawing.' },
      ],
      markLines: [1, 1, 1],
      marks: [
        {
          kind: 'dim',
          a: pt(THIRD.FV.x, THIRD.FV.y),
          b: pt(THIRD.FV.x + BLOCK.length, THIRD.FV.y),
          offset: -22,
          label: '90',
        },
        {
          kind: 'dim',
          a: pt(THIRD.FV.x + BLOCK.length, THIRD.FV.y),
          b: pt(THIRD.FV.x + BLOCK.length, THIRD.FV.y - BLOCK.height),
          offset: -24,
          label: '60',
        },
        {
          kind: 'dim',
          a: pt(THIRD.FV.x + BLOCK.length + 14, THIRD.PLAN_FRONT),
          b: pt(THIRD.FV.x + BLOCK.length + 14, THIRD.PLAN_BACK),
          offset: -12,
          label: '50',
        },
      ],
    },
  ],
};

/* ==========================================================================
 * 8 — First angle
 * ======================================================================== */

const FIRST = (() => {
  const FV = pt(110, 130);
  const PLAN_BACK = 160;
  const PLAN_FRONT = PLAN_BACK + BLOCK.depth;
  const EV_LEFT = 230;
  const EV_RIGHT = EV_LEFT + BLOCK.depth;
  const MITRE = pt(EV_LEFT, PLAN_BACK);
  return { FV, PLAN_BACK, PLAN_FRONT, EV_LEFT, EV_RIGHT, MITRE };
})();

const FIRST_ANGLE: DrawTopic = {
  id: 'ortho-first-angle-stepped',
  title: 'A stepped block in first angle projection',
  subtitle: 'The same block, the other way round — plan below, view from the left on the right.',
  goal: 'Project the same stepped block in first angle and see exactly which two things changed.',
  minutes: 45,
  level: 'Core',
  tools: ['T-square', '45° set square', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'STEPPED BLOCK — FIRST ANGLE', number: 'F-08', scale: '1:1', angle: 'first' }),
  steps: [
    {
      id: 'first-idea',
      title: 'The same block, pushed away from you',
      tool: 'hand',
      focus: { at: pt(180, 140), r: 165 },
      tip: 'First angle: the view goes on the far side. Look from above, draw below. Look from the left, draw on the right.',
      lines: [
        { text: 'Same block. Same three views. Everything about the shapes is unchanged.' },
        { text: 'Only where they sit on the paper is different.' },
        { text: 'First angle is the opposite of third. The view goes on the far side.' },
        { text: 'Look from above, and it is drawn below. Look from the left, and it is drawn on the right.' },
        { text: 'Think of it as pushing the block away from you onto a screen behind it.' },
        { text: 'And because it flips, the near-and-far rule flips too.' },
        { text: 'In first angle, the edge nearest the front view is the far side of the block.' },
        { text: 'Zimbabwe, and most of Europe, works in first angle. America works in third. Both are on the exam.' },
      ],
      marks: [],
    },
    {
      id: 'first-front',
      title: 'The front view is identical',
      tool: 'tsquare',
      teeY: FIRST.FV.y,
      focus: { at: pt(155, 100), r: 68 },
      tip: 'The front view never changes between the angles. Only the positions of the other views do.',
      lines: [
        { text: 'Front view first, and it is exactly the same drawing as before.' },
        { text: 'Ninety along the base. Up twenty, left thirty. Up twenty, left thirty.' },
        { text: 'Up twenty again, across thirty, and down sixty.' },
        { text: 'Identical. The angle never changes what a view looks like.' },
        { text: 'It only changes where the other views are put.' },
      ],
      markLines: [1],
      marks: [poly(frontProfile(FIRST.FV), 'outline', true)],
    },
    {
      id: 'first-plan',
      title: 'The plan drops below',
      tool: 'tsquare',
      teeY: FIRST.PLAN_BACK,
      focus: { at: pt(155, 165), r: 92 },
      tip: 'First angle plan: the edge touching the front view is the BACK of the object, and the far edge is the front.',
      lines: [
        { text: 'Project every corner of the front view straight down this time.' },
        { text: 'The plan goes underneath. That is the first of the two changes.' },
        { text: 'Depth fifty again, but read it carefully now.' },
        { text: 'The edge nearest the front view is the back of the block.' },
        { text: 'The edge furthest away is the front. That is the second change, and it is the one people miss.' },
        { text: 'The step edges still show at thirty and sixty, still visible.' },
        { text: 'The plan itself looks the same as before. It is only sitting somewhere else.' },
      ],
      markLines: [0, 0, 0, 3, 4, 5, 5],
      marks: [
        ...[0, 30, 60, 90].map((x) =>
          line(pt(FIRST.FV.x + x, FIRST.FV.y), pt(FIRST.FV.x + x, FIRST.PLAN_FRONT + 12), 'construction')
        ),
        line(pt(FIRST.FV.x, FIRST.PLAN_BACK), pt(FIRST.FV.x + BLOCK.length, FIRST.PLAN_BACK), 'outline'),
        line(pt(FIRST.FV.x, FIRST.PLAN_FRONT), pt(FIRST.FV.x + BLOCK.length, FIRST.PLAN_FRONT), 'outline'),
        line(pt(FIRST.FV.x, FIRST.PLAN_BACK), pt(FIRST.FV.x, FIRST.PLAN_FRONT), 'outline'),
        line(pt(FIRST.FV.x + BLOCK.length, FIRST.PLAN_BACK), pt(FIRST.FV.x + BLOCK.length, FIRST.PLAN_FRONT), 'outline'),
        line(pt(FIRST.FV.x + 30, FIRST.PLAN_BACK), pt(FIRST.FV.x + 30, FIRST.PLAN_FRONT), 'outline'),
        line(pt(FIRST.FV.x + 60, FIRST.PLAN_BACK), pt(FIRST.FV.x + 60, FIRST.PLAN_FRONT), 'outline'),
        text(pt(FIRST.FV.x + 45, FIRST.PLAN_FRONT + 8), 'PLAN', 3.4, { bold: true }),
        text(pt(FIRST.FV.x - 8, FIRST.PLAN_BACK), 'BACK', 2.6, { align: 'right', colour: '#64748b' }),
        text(pt(FIRST.FV.x - 8, FIRST.PLAN_FRONT), 'FRONT', 2.6, { align: 'right', colour: '#64748b' }),
      ],
    },
    {
      id: 'first-end',
      title: 'Mitre across, end view on the right',
      tool: 'set45',
      focus: { at: pt(215, 140), r: 105 },
      tip: 'Same mitre trick, mirrored: run right from the plan to the 45° line, then straight up into the end view.',
      lines: [
        { text: 'Now the end view. You looked from the left, so in first angle it is drawn on the right.' },
        { text: 'Mitre line again, at forty five, but running the other way — down to the right.' },
        { text: 'From the plan, run a line right until it meets the mitre, then turn and go straight up.' },
        { text: 'That carries the depth across, exactly as before.' },
        { text: 'Height comes straight across from the front view.' },
        { text: 'Rectangle, fifty by sixty, and the two step edges hidden behind the near face.' },
        { text: 'And check yourself: the edge nearest the front view is the back of the block.' },
      ],
      markLines: [1, 2, 2, 4, 5, 5],
      marks: [
        line(pt(FIRST.MITRE.x - 8, FIRST.MITRE.y - 8), pt(FIRST.MITRE.x + 62, FIRST.MITRE.y + 62), 'construction'),
        line(pt(FIRST.FV.x + BLOCK.length, FIRST.PLAN_BACK), pt(FIRST.EV_LEFT, FIRST.PLAN_BACK), 'construction'),
        line(pt(FIRST.FV.x + BLOCK.length, FIRST.PLAN_FRONT), pt(FIRST.EV_RIGHT, FIRST.PLAN_FRONT), 'construction'),
        line(pt(FIRST.EV_LEFT, FIRST.PLAN_BACK), pt(FIRST.EV_LEFT, FIRST.FV.y - BLOCK.height), 'construction'),
        line(pt(FIRST.EV_RIGHT, FIRST.PLAN_FRONT), pt(FIRST.EV_RIGHT, FIRST.FV.y - BLOCK.height), 'construction'),
        line(pt(FIRST.FV.x + BLOCK.length, FIRST.FV.y), pt(FIRST.EV_RIGHT + 12, FIRST.FV.y), 'construction'),
        line(
          pt(FIRST.FV.x + BLOCK.length, FIRST.FV.y - BLOCK.height),
          pt(FIRST.EV_RIGHT + 12, FIRST.FV.y - BLOCK.height),
          'construction'
        ),
        poly(
          [
            pt(FIRST.EV_LEFT, FIRST.FV.y),
            pt(FIRST.EV_RIGHT, FIRST.FV.y),
            pt(FIRST.EV_RIGHT, FIRST.FV.y - BLOCK.height),
            pt(FIRST.EV_LEFT, FIRST.FV.y - BLOCK.height),
          ],
          'outline',
          true
        ),
        line(pt(FIRST.EV_LEFT, FIRST.FV.y - 20), pt(FIRST.EV_RIGHT, FIRST.FV.y - 20), 'hidden'),
        line(pt(FIRST.EV_LEFT, FIRST.FV.y - 40), pt(FIRST.EV_RIGHT, FIRST.FV.y - 40), 'hidden'),
        text(pt(FIRST.EV_LEFT + 25, FIRST.FV.y - BLOCK.height - 7), 'VIEW FROM THE LEFT', 2.8, { colour: '#64748b' }),
      ],
    },
    {
      id: 'first-compare',
      title: 'Two changes, and nothing else',
      tool: 'pencil',
      focus: { at: pt(200, 150), r: 165 },
      tip: 'First angle symbol: the circles sit on the same side as the BIG end of the cone. Third angle: the small end.',
      lines: [
        { text: 'Put the two sheets side by side and count the differences.' },
        { text: 'One. The plan moved from above the front view to below it.' },
        { text: 'Two. The end view moved from the left of the front view to the right.' },
        { text: 'That is all. The shapes never changed, and neither did any dimension.' },
        { text: 'And because the views swapped sides, near and far swapped with them.' },
        { text: 'Now the symbol. First angle puts the circles beside the big end of the cone.' },
        { text: 'Third angle puts them beside the small end. Learn one and the other is the opposite.' },
      ],
      marks: [
        text(pt(300, 40), 'FIRST ANGLE', 4.4, { align: 'left', bold: true }),
        text(pt(300, 52), 'PLAN            BELOW', 3, { align: 'left' }),
        text(pt(300, 61), 'LEFT VIEW    ON THE RIGHT', 3, { align: 'left' }),
        text(pt(300, 70), 'NEAREST EDGE = FAR SIDE', 3, { align: 'left' }),
        text(pt(300, 86), 'THIRD ANGLE', 4.4, { align: 'left', bold: true }),
        text(pt(300, 98), 'PLAN            ABOVE', 3, { align: 'left' }),
        text(pt(300, 107), 'LEFT VIEW    ON THE LEFT', 3, { align: 'left' }),
        text(pt(300, 116), 'NEAREST EDGE = NEAR SIDE', 3, { align: 'left' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 9 — Auxiliary views from a front view
 * ======================================================================== */

const AUX = (() => {
  const FV = pt(75, 150);
  const LENGTH = 80;
  const DEPTH = 50;
  const LOW = 20;
  const SLOPE = 30;
  const RUN = 60;
  const RISE = RUN * Math.tan(rad(SLOPE));
  const HIGH = LOW + RISE;
  const TRUE_FACE = RUN / Math.cos(rad(SLOPE));

  /** The two ends of the sloping face on the front view. */
  const A = pt(FV.x + LENGTH, FV.y - LOW);
  const B = pt(FV.x + LENGTH - RUN, FV.y - HIGH);
  const along = bearing(A, B);
  const away = along - 90;

  /** The auxiliary view, stood off 30 mm square from the face. */
  const A1 = polar(A, 30, away);
  const B1 = polar(B, 30, away);
  const A2 = polar(A1, DEPTH, away);
  const B2 = polar(B1, DEPTH, away);

  const holeAt = (fromA: number) => polar(polar(A1, fromA, along), DEPTH / 2, away);

  const PLAN_TOP = 178;
  return {
    FV,
    LENGTH,
    DEPTH,
    LOW,
    SLOPE,
    RUN,
    RISE,
    HIGH,
    TRUE_FACE,
    A,
    B,
    along,
    away,
    A1,
    B1,
    A2,
    B2,
    holeAt,
    PLAN_TOP,
  };
})();

const AUXILIARY_VIEWS: DrawTopic = {
  id: 'ortho-auxiliary-views',
  title: 'Auxiliary views drawn from a front view',
  subtitle: 'A sloping face is never its true shape — until you look square at it.',
  goal: 'Project an auxiliary view at right angles to an inclined face and obtain its true shape and true hole centres.',
  minutes: 45,
  level: 'Exam',
  tools: ['T-square', '45° set square', '30/60 set square', 'Compass', 'HB and 2H pencils'],
  base: fabSheet({ title: 'AUXILIARY VIEW', number: 'F-09', scale: '1:1', angle: 'first' }),
  steps: [
    {
      id: 'aux-problem',
      title: 'Why three views are sometimes not enough',
      tool: 'hand',
      focus: { at: pt(160, 130), r: 155 },
      tip: 'A face only shows its true shape in a view taken at right angles to it. On a sloping face, no ordinary view does that.',
      lines: [
        { text: 'This bracket has a face that slopes at thirty degrees.' },
        { text: 'Two holes go through that face, and somebody has to mark them off and drill them.' },
        { text: 'Look at it from the front, and the face is a line. No use.' },
        { text: 'Look at it from above, and the face is squashed. Sixty across, when it is really sixty nine point three.' },
        { text: 'Look at it from the end, and it is squashed the other way.' },
        { text: 'Not one of the three ordinary views gives you the true shape of that face.' },
        { text: 'A face is only true when you look square at it. So we make a view that does.' },
        { text: 'That is an auxiliary view. One extra view, taken at right angles to the slope.' },
      ],
      marks: [],
    },
    {
      id: 'aux-front',
      title: 'The front view and the plan',
      tool: 'tsquare',
      teeY: AUX.FV.y,
      focus: { at: pt(115, 165), r: 90 },
      tip: 'The slope appears at its true angle in the front view, because the face is perpendicular to the paper there.',
      lines: [
        { text: 'Front view first. Eighty along the base, and up twenty on the right.' },
        { text: 'Now the sloping face. Thirty degrees, running up to the left, for sixty across.' },
        { text: 'It rises thirty four point six four in that sixty. Then up the left side and close it.' },
        { text: 'The angle is true here. The face stands square to the paper, so nothing is squashed.' },
        { text: 'The length along the slope is not true, though. That is the whole problem.' },
        { text: 'Now the plan, underneath. Eighty by fifty. First angle.' },
        { text: 'On the plan the sloping face shows as a band, sixty wide. Squashed, as promised.' },
      ],
      markLines: [0, 1, 2, 5, 6],
      marks: [
        poly(
          [
            AUX.FV,
            pt(AUX.FV.x + AUX.LENGTH, AUX.FV.y),
            AUX.A,
            AUX.B,
            pt(AUX.FV.x, AUX.FV.y - AUX.HIGH),
          ],
          'outline',
          true
        ),
        { kind: 'angle', at: AUX.A, from: 180, to: 180 - AUX.SLOPE, r: 22, label: '30°' },
        poly(
          [
            pt(AUX.FV.x, AUX.PLAN_TOP),
            pt(AUX.FV.x + AUX.LENGTH, AUX.PLAN_TOP),
            pt(AUX.FV.x + AUX.LENGTH, AUX.PLAN_TOP + AUX.DEPTH),
            pt(AUX.FV.x, AUX.PLAN_TOP + AUX.DEPTH),
          ],
          'outline',
          true
        ),
        line(pt(AUX.FV.x + AUX.LENGTH - AUX.RUN, AUX.PLAN_TOP), pt(AUX.FV.x + AUX.LENGTH - AUX.RUN, AUX.PLAN_TOP + AUX.DEPTH), 'outline'),
        line(pt(AUX.FV.x + AUX.LENGTH - AUX.RUN, AUX.FV.y), pt(AUX.FV.x + AUX.LENGTH - AUX.RUN, AUX.PLAN_TOP + AUX.DEPTH + 8), 'construction'),
        line(pt(AUX.FV.x + AUX.LENGTH, AUX.FV.y), pt(AUX.FV.x + AUX.LENGTH, AUX.PLAN_TOP + AUX.DEPTH + 8), 'construction'),
        text(pt(AUX.FV.x + 40, AUX.PLAN_TOP + AUX.DEPTH + 8), 'PLAN', 3.2, { bold: true }),
      ],
    },
    {
      id: 'aux-project',
      title: 'Project square off the face',
      tool: 'set30',
      focus: { at: pt(150, 100), r: 100 },
      tip: 'Every auxiliary projection line is at right angles to the inclined face — not vertical, not horizontal. Set the square to the slope.',
      lines: [
        { text: 'Now build the auxiliary. Everything from here is measured off the sloping face.' },
        { text: 'From each end of the face, draw a line at right angles to it.' },
        { text: 'Not up. Not across. Square off the slope, which is sixty degrees to the horizontal.' },
        { text: 'Set your thirty sixty square against the face and run the lines out.' },
        { text: 'Stand the view off about thirty millimetres, so it does not crowd the front view.' },
        { text: 'Draw a base line for the auxiliary, parallel to the face.' },
        { text: 'The distance between those two projection lines is the true length of the face.' },
        { text: 'Sixty nine point three. Not sixty. That is what all this was for.' },
      ],
      markLines: [1, 1, 4, 5],
      marks: [
        line(AUX.A, polar(AUX.A, 92, AUX.away), 'construction'),
        line(AUX.B, polar(AUX.B, 92, AUX.away), 'construction'),
        line(AUX.A1, AUX.B1, 'outline'),
        {
          kind: 'dim',
          a: AUX.A1,
          b: AUX.B1,
          offset: -12,
          label: 'TRUE 69.3',
        },
      ],
    },
    {
      id: 'aux-shape',
      title: 'The depth comes from the plan',
      tool: 'set30',
      focus: { at: pt(158, 78), r: 92 },
      tip: 'Length along the auxiliary comes from the front view; width across it comes from the plan. Every auxiliary view is built that way.',
      lines: [
        { text: 'You have the length. Now you need the width across the face.' },
        { text: 'That is the depth of the block, and the depth only lives in the plan.' },
        { text: 'Fifty. So step fifty out along both projection lines.' },
        { text: 'Join them up. That rectangle is the true shape of the sloping face.' },
        { text: 'Sixty nine point three by fifty. Cut a template that size and it will fit.' },
        { text: 'Say it as a rule: length off the front view, width off the plan.' },
        { text: 'Every auxiliary view in the world is built out of those two.' },
      ],
      markLines: [2, 2, 3],
      marks: [
        line(AUX.A1, AUX.A2, 'outline'),
        line(AUX.B1, AUX.B2, 'outline'),
        line(AUX.A2, AUX.B2, 'outline'),
        {
          kind: 'dim',
          a: AUX.A2,
          b: AUX.A1,
          offset: -12,
          label: '50',
        },
      ],
    },
    {
      id: 'aux-holes',
      title: 'Mark the holes where they can be measured',
      tool: 'compass',
      compassRadius: 7,
      focus: { at: pt(158, 78), r: 88 },
      tip: 'Dimension holes on an inclined face in the auxiliary view only. A size taken off any other view will be short.',
      lines: [
        { text: 'Two holes go in that face, fourteen diameter.' },
        { text: 'Twenty from the low end, and twenty from the high end, both on the centre of the width.' },
        { text: 'Put them on the auxiliary view, because that is the only view where those figures are true.' },
        { text: 'Centre lines first, then the circles.' },
        { text: 'Now dimension them here, and nowhere else.' },
        { text: 'If you dimension them on the front view, the marker off works to a squashed size.' },
        { text: 'He drills the plate, the holes miss, and the plate is scrap. It really is that simple.' },
      ],
      markLines: [3, 3, 4],
      marks: [
        { kind: 'circle', style: 'outline', c: AUX.holeAt(20), r: 7 },
        { kind: 'circle', style: 'outline', c: AUX.holeAt(AUX.TRUE_FACE - 20), r: 7 },
        line(polar(AUX.holeAt(20), 12, AUX.along), polar(AUX.holeAt(20), 12, AUX.along + 180), 'centre'),
        line(polar(AUX.holeAt(20), 12, AUX.away), polar(AUX.holeAt(20), 12, AUX.away + 180), 'centre'),
        line(
          polar(AUX.holeAt(AUX.TRUE_FACE - 20), 12, AUX.along),
          polar(AUX.holeAt(AUX.TRUE_FACE - 20), 12, AUX.along + 180),
          'centre'
        ),
        line(
          polar(AUX.holeAt(AUX.TRUE_FACE - 20), 12, AUX.away),
          polar(AUX.holeAt(AUX.TRUE_FACE - 20), 12, AUX.away + 180),
          'centre'
        ),
        {
          kind: 'dim',
          a: AUX.holeAt(20),
          b: AUX.holeAt(AUX.TRUE_FACE - 20),
          offset: 20,
          label: '29.3 CRS',
        },
        text(pt(258, 108), 'AUXILIARY VIEW', 3.6, { align: 'left', bold: true }),
        text(pt(258, 118), 'TRUE SHAPE OF THE', 3, { align: 'left', colour: '#64748b' }),
        text(pt(258, 127), 'SLOPING FACE — 69.3 × 50', 3, { align: 'left', colour: '#64748b' }),
        text(pt(258, 140), 'LENGTH FROM FRONT VIEW', 3, { align: 'left' }),
        text(pt(258, 149), 'WIDTH  FROM PLAN', 3, { align: 'left' }),
        text(pt(258, 162), '2 HOLES Ø14', 3.4, { align: 'left', bold: true }),
      ],
    },
  ],
};

export const ORTHOGRAPHIC_TOPICS: DrawTopic[] = [THIRD_ANGLE, FIRST_ANGLE, AUXILIARY_VIEWS];
