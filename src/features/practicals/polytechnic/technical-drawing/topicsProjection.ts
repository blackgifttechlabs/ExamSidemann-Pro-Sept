/**
 * The two pictorial / projection lessons, which follow the twelve geometrical
 * constructions. They share one solid — an L-shaped step block defined once in
 * `drawingGeometry` — so a student meets the same object twice: first taken
 * apart into three flat views, then rebuilt as a single solid picture.
 */

import {
  BLOCK,
  blockIsoVisibleEdges,
  blockProfile,
  crateIsoVisibleEdges,
  isoEdgeMarks,
  isoPoint,
  pt,
  v3,
  type Mark,
} from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/* ==========================================================================
 * 4 — First angle orthographic projection
 * ======================================================================== */

/** Bottom-left corner of the front view on the sheet. */
const FV = pt(70, 120);
const PLAN_TOP = 150;
const EV_LEFT = 180;
const { length: L, depth: D, height: H, stepLength: S, stepHeight: T } = BLOCK;

/** The 45° mitre line passes through the corner that maps plan depth to end-view width. */
const MITRE_ORIGIN = pt(EV_LEFT, PLAN_TOP);
const PICTORIAL_ORIGIN = pt(320, 150);

/**
 * The front view is kept as six separate sides rather than one closed shape, so
 * each side can be drawn on the sentence that calls for it: "up the right side,
 * only thirty" puts the pencil on that side and nowhere else. The points come
 * back in drawing order — across, up, left, up, across, down — which is the
 * order the narration walks them in.
 */
const FV_PROFILE = blockProfile(FV);

const ORTHOGRAPHIC: DrawTopic = {
  id: 'orthographic',
  title: 'First angle orthographic projection',
  subtitle: 'Turn one solid block into three flat views: front, plan and end.',
  goal: 'Draw the front view, plan and end view of a step block in first angle, with hidden detail shown correctly.',
  minutes: 45,
  level: 'Exam',
  tools: ['T-square', '45° set square', '30/60 set square', 'HB and 2H pencils'],
  base: [
    ...preparedSheet('FIRST ANGLE PROJECTION', '04'),
    ...isoEdgeMarks(PICTORIAL_ORIGIN, blockIsoVisibleEdges(), 'thin'),
    { kind: 'text', at: pt(320, 168), text: 'GIVEN', size: 3.6, align: 'center', bold: true, colour: '#64748b' },
  ],
  steps: [
    {
      id: 'read-the-block',
      title: 'Look at the block first',
      tool: 'hand',
      focus: { at: pt(320, 110), r: 150 },
      tip: 'Three views is the standard answer: front view, plan, and one end view.',
      lines: [
        { text: 'Here is a solid block. Look at it carefully before you draw anything.' },
        { text: 'It is like a step. A tall part on the left, and a low part on the right.', at: pt(300, 100) },
        { text: 'It is eighty long, fifty deep, and sixty high.' },
        { text: 'Now, paper is flat. The block is not flat. So we cannot draw it as it is.' },
        { text: 'Instead we look at it from three directions, and draw what we see each time.' },
        { text: 'Look from the front. That gives the front view, or the elevation.' },
        { text: 'Look from on top, straight down. That gives the plan.' },
        { text: 'Look from the side. That gives the end view.' },
        { text: 'Three flat pictures. Together they describe the whole solid, with no guessing.' },
      ],
      marks: [],
    },
    {
      id: 'set-out',
      title: 'Set out where the views go',
      tool: 'tsquare',
      teeY: FV.y,
      focus: { at: pt(150, 140), r: 145 },
      tip: 'First angle: the plan goes BELOW the front view, and the view from the left goes on the RIGHT.',
      lines: [
        { text: 'Before drawing, we decide where each view will sit. This is called setting out.' },
        { text: 'Beginners skip this, then run out of paper. Do not skip it.' },
        { text: 'The front view goes here, at the top left.', at: pt(FV.x + L / 2, FV.y - H / 2), label: 'front view' },
        { text: 'Now listen, because this is the rule of first angle.' },
        { text: 'In first angle, the view you get by looking from the top is drawn underneath.', at: pt(FV.x + L / 2, PLAN_TOP + D / 2), label: 'plan below' },
        { text: 'And the view you get by looking from the left is drawn on the right.', at: pt(EV_LEFT + D / 2, FV.y - H / 2), label: 'end view right' },
        { text: 'It feels backwards at first. It is because the object is pushed away from you.' },
        { text: 'Leave about thirty millimetres of space between the views, so the drawing can breathe.' },
        { text: 'Draw these boxes very lightly with your 2H. They are only guides.' },
      ],
      markLines: [2, 4, 5],
      marks: [
        { kind: 'poly', style: 'construction', close: true, points: [pt(FV.x, FV.y), pt(FV.x + L, FV.y), pt(FV.x + L, FV.y - H), pt(FV.x, FV.y - H)] },
        { kind: 'poly', style: 'construction', close: true, points: [pt(FV.x, PLAN_TOP), pt(FV.x + L, PLAN_TOP), pt(FV.x + L, PLAN_TOP + D), pt(FV.x, PLAN_TOP + D)] },
        { kind: 'poly', style: 'construction', close: true, points: [pt(EV_LEFT, FV.y), pt(EV_LEFT + D, FV.y), pt(EV_LEFT + D, FV.y - H), pt(EV_LEFT, FV.y - H)] },
      ],
    },
    {
      id: 'front-view',
      title: 'Draw the front view',
      tool: 'set45',
      teeY: FV.y,
      focus: { at: pt(FV.x + L / 2, FV.y - H / 2), r: 78 },
      tip: 'Always start with the view that shows the most shape. Here that is the front view.',
      lines: [
        { text: 'We always start with the view that shows the most shape.' },
        { text: 'Here that is the front view. Looking from the front, the block looks like a letter L.' },
        { text: 'Start at the bottom left corner and go across. Eighty millimetres.', at: pt(FV.x + L / 2, FV.y) },
        { text: 'Now up the right side. Only thirty, because that side is the low part.', at: pt(FV.x + L, FV.y - T / 2), label: '30' },
        { text: 'Now across to the left, forty. This is the top of the step.', at: pt(FV.x + S + 20, FV.y - T), label: 'the step' },
        { text: 'Now up again, thirty more, to reach sixty.', at: pt(FV.x + S, FV.y - (T + H) / 2) },
        { text: 'Now across the top, forty, and finally down the left side.', at: pt(FV.x + S / 2, FV.y - H) },
        { text: 'And you are back where you started. That shape is the front view.' },
      ],
      markLines: [2, 3, 4, 5, 6, 6],
      markWords: [undefined, undefined, undefined, undefined, 'across', 'down'],
      marks: FV_PROFILE.map<Mark>((point, index) => ({
        kind: 'line',
        style: 'outline',
        a: point,
        b: FV_PROFILE[(index + 1) % FV_PROFILE.length],
      })),
    },
    {
      id: 'project-down',
      title: 'Project down to the plan',
      tool: 'set45',
      teeY: PLAN_TOP,
      focus: { at: pt(FV.x + L / 2, 145), r: 120 },
      tip: 'Projectors are thin construction lines. Leave them on the sheet — they show the examiner you projected.',
      lines: [
        { text: 'Now the plan. And here is the part that saves you time.' },
        { text: 'You do not measure the plan again. You bring the sizes down from the front view.' },
        { text: 'Take your set square and drop a light line straight down from every corner.', at: pt(FV.x, 135), label: 'straight down' },
        { text: 'Down from the left edge.', at: pt(FV.x, 140) },
        { text: 'Down from the step.', at: pt(FV.x + S, 140) },
        { text: 'And down from the right edge.', at: pt(FV.x + L, 140) },
        { text: 'These light lines are called projectors. They carry the width downwards.' },
        { text: 'The width of the plan is now fixed. It must match the front view exactly.' },
        { text: 'That is the whole idea of projection. The views line up.' },
      ],
      markLines: [3, 4, 5],
      marks: [
        { kind: 'line', style: 'construction', a: pt(FV.x, FV.y), b: pt(FV.x, PLAN_TOP + D + 8) },
        { kind: 'line', style: 'construction', a: pt(FV.x + S, FV.y), b: pt(FV.x + S, PLAN_TOP + D + 8) },
        { kind: 'line', style: 'construction', a: pt(FV.x + L, FV.y), b: pt(FV.x + L, PLAN_TOP + D + 8) },
      ],
    },
    {
      id: 'draw-plan',
      title: 'Complete the plan',
      tool: 'tsquare',
      teeY: PLAN_TOP,
      focus: { at: pt(FV.x + L / 2, PLAN_TOP + D / 2), r: 80 },
      tip: 'Depth is the only new measurement in the plan. Everything else comes from the front view.',
      lines: [
        { text: 'Now measure the one size the front view cannot give you. The depth.' },
        { text: 'The depth is fifty millimetres.', at: pt(FV.x - 10, PLAN_TOP + D / 2), label: '50 deep' },
        { text: 'Draw the top line and the bottom line of the plan with your T-square.', at: pt(FV.x + L / 2, PLAN_TOP) },
        { text: 'Close the two ends on your projectors.' },
        { text: 'Now one more line. Where the step falls, there is an edge you can see from above.', at: pt(FV.x + S, PLAN_TOP + D / 2), label: 'step edge' },
        { text: 'So draw a full line there, not a dashed one. You can see it, so it is solid.' },
        { text: 'Your plan is a rectangle, eighty by fifty, with one line across it.' },
      ],
      markLines: [2, 4, 1],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: [pt(FV.x, PLAN_TOP), pt(FV.x + L, PLAN_TOP), pt(FV.x + L, PLAN_TOP + D), pt(FV.x, PLAN_TOP + D)] },
        { kind: 'line', style: 'outline', a: pt(FV.x + S, PLAN_TOP), b: pt(FV.x + S, PLAN_TOP + D) },
        { kind: 'dim', a: pt(FV.x, PLAN_TOP + D), b: pt(FV.x, PLAN_TOP), offset: 22, label: '50' },
      ],
    },
    {
      id: 'mitre-line',
      title: 'Draw the 45° mitre line',
      tool: 'set45',
      teeY: PLAN_TOP,
      focus: { at: pt(205, 160), r: 90 },
      tip: 'The mitre line turns a depth measured downwards into the same depth measured sideways.',
      lines: [
        { text: 'Now we need the end view, on the right.' },
        { text: 'The heights come across from the front view. That is easy, they are level.' },
        { text: 'But the depth is in the plan, and the plan is below. The depth is going the wrong way.' },
        { text: 'So we use a clever line. The mitre line.', at: MITRE_ORIGIN, label: 'mitre line' },
        { text: 'Take your forty-five degree set square and draw a line at forty-five degrees.', at: pt(205, 175) },
        { text: 'It starts level with the top of the plan, and under the left of the end view.' },
        { text: 'What does it do? It bends a measurement round a corner.' },
        { text: 'A depth measured going down becomes the same depth measured going across.' },
        { text: 'That is all it is. A corner for measurements to turn on.' },
      ],
      markLines: [4, 4],
      marks: [
        {
          kind: 'line',
          style: 'construction',
          a: pt(MITRE_ORIGIN.x - 14, MITRE_ORIGIN.y - 14),
          b: pt(MITRE_ORIGIN.x + D + 14, MITRE_ORIGIN.y + D + 14),
        },
        { kind: 'angle', at: MITRE_ORIGIN, from: 0, to: -45, r: 15, label: '45°' },
      ],
    },
    {
      id: 'project-across',
      title: 'Bring the sizes to the end view',
      tool: 'tsquare',
      teeY: FV.y - T,
      focus: { at: pt(175, 145), r: 125 },
      tip: 'Heights come across from the front view. Depths come round the mitre line from the plan.',
      lines: [
        { text: 'Now we feed the end view from two directions.' },
        { text: 'First, heights. Draw light lines straight across from the front view.', at: pt(165, FV.y - T), label: 'heights across' },
        { text: 'From the bottom, from the step at thirty, and from the top at sixty.' },
        { text: 'Second, depths. Draw light lines across from the plan until they touch the mitre line.', at: pt(165, PLAN_TOP + D), label: 'to the mitre' },
        { text: 'Where each one touches the mitre line, turn and go straight up.', at: pt(EV_LEFT + D, 165), label: 'then turn up' },
        { text: 'Across, hit the mitre, turn up. Across, hit the mitre, turn up.' },
        { text: 'Those upward lines give you the front and the back of the end view.' },
      ],
      // The three heights land on the words that name them, so "from the bottom,
      // from the step, and from the top" draws them in that order as he counts.
      markLines: [2, 2, 2, 3, 3, 4, 4],
      markWords: ['bottom', 'step', 'top'],
      marks: [
        { kind: 'line', style: 'construction', a: pt(FV.x + L, FV.y), b: pt(EV_LEFT + D + 10, FV.y) },
        { kind: 'line', style: 'construction', a: pt(FV.x + L, FV.y - T), b: pt(EV_LEFT + D + 10, FV.y - T) },
        { kind: 'line', style: 'construction', a: pt(FV.x + S, FV.y - H), b: pt(EV_LEFT + D + 10, FV.y - H) },
        { kind: 'line', style: 'construction', a: pt(FV.x + L, PLAN_TOP), b: pt(MITRE_ORIGIN.x, PLAN_TOP) },
        { kind: 'line', style: 'construction', a: pt(FV.x + L, PLAN_TOP + D), b: pt(MITRE_ORIGIN.x + D, PLAN_TOP + D) },
        { kind: 'line', style: 'construction', a: pt(EV_LEFT, PLAN_TOP), b: pt(EV_LEFT, FV.y - H - 8) },
        { kind: 'line', style: 'construction', a: pt(EV_LEFT + D, PLAN_TOP + D), b: pt(EV_LEFT + D, FV.y - H - 8) },
      ],
    },
    {
      id: 'end-view',
      title: 'Complete the end view',
      tool: 'set45',
      teeY: FV.y,
      focus: { at: pt(EV_LEFT + D / 2, FV.y - H / 2), r: 78 },
      tip: 'An edge you cannot see is drawn as a dashed line — hidden detail. Missing it loses easy marks.',
      lines: [
        { text: 'Now line in the end view, using the crossings you made.' },
        { text: 'It comes out as a plain rectangle. Fifty wide, and sixty high.', at: pt(EV_LEFT + D / 2, FV.y - H / 2) },
        { text: 'Why a plain rectangle? Because you are looking at the tall part, and it hides the step.' },
        { text: 'But wait. The step is still there. It is just behind.' },
        { text: 'And in technical drawing, we never pretend a feature is not there.' },
        { text: 'So we show it with a dashed line, level with the step, at thirty.', at: pt(EV_LEFT + D / 2, FV.y - T), label: 'hidden detail' },
        { text: 'A dashed line means, this edge is there, but you cannot see it from here.' },
        { text: 'We call it hidden detail. Students forget it and lose easy marks. Do not forget it.' },
      ],
      markLines: [1, 5],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: [pt(EV_LEFT, FV.y), pt(EV_LEFT + D, FV.y), pt(EV_LEFT + D, FV.y - H), pt(EV_LEFT, FV.y - H)] },
        { kind: 'line', style: 'hidden', a: pt(EV_LEFT, FV.y - T), b: pt(EV_LEFT + D, FV.y - T) },
      ],
    },
    {
      id: 'dimension-and-label',
      title: 'Dimension and label the views',
      tool: 'pencil',
      teeY: FV.y,
      focus: { at: pt(160, 150), r: 150 },
      tip: 'Give each size once only. A size that appears in two views is a fault, even when both are right.',
      lines: [
        { text: 'Last part. We put the sizes on, and we name the views.' },
        { text: 'Dimension lines are thin, with arrowheads touching the projection lines.', at: pt(FV.x + L / 2, FV.y + 16) },
        { text: 'The number sits on top of the line, in the middle, and you read it from the bottom or from the right.' },
        { text: 'Now a rule that catches everybody.' },
        { text: 'Each size is written once, in one view only. Never twice.' },
        { text: 'If you put eighty on the front view and eighty on the plan, that is a fault.' },
        { text: 'Now letter the name under each view. Front view. Plan. End view.', at: pt(FV.x + L / 2, FV.y - H - 12), label: 'name the views' },
        { text: 'And finally, go over your outlines with the HB so they are black and strong.' },
        { text: 'Leave the light construction lines. Do not rub them out. They are your working.' },
        { text: 'That is a complete first angle drawing. Well done.' },
      ],
      markLines: [1, 1, 2, 6, 6, 6, 9],
      markWords: [undefined, undefined, undefined, 'front view', 'plan', 'end view'],
      marks: [
        { kind: 'dim', a: pt(FV.x, FV.y), b: pt(FV.x + L, FV.y), offset: -18, label: '80' },
        { kind: 'dim', a: pt(FV.x, FV.y), b: pt(FV.x, FV.y - H), offset: 16, label: '60' },
        { kind: 'dim', a: pt(FV.x + S, FV.y - T), b: pt(FV.x + L, FV.y - T), offset: 10, label: '40' },
        { kind: 'text', at: pt(FV.x + L / 2, FV.y - H - 10), text: 'FRONT VIEW', size: 4, align: 'center', bold: true },
        { kind: 'text', at: pt(FV.x + L / 2, PLAN_TOP + D + 14), text: 'PLAN', size: 4, align: 'center', bold: true },
        { kind: 'text', at: pt(EV_LEFT + D / 2, FV.y - H - 10), text: 'END VIEW', size: 4, align: 'center', bold: true },
        { kind: 'text', at: pt(250, 240), text: 'FIRST ANGLE PROJECTION', size: 4.5, align: 'left', bold: true },
      ],
    },
  ],
};

/* ==========================================================================
 * 5 — Isometric drawing
 * ======================================================================== */

const ISO = pt(185, 235);
const isoAt = (x: number, y: number, z: number) => isoPoint(ISO, v3(x, y, z));

/** Held in a const so the crate's edges can be shared out across the sentences that build it. */
const CRATE_EDGES = isoEdgeMarks(ISO, crateIsoVisibleEdges(), 'construction');

const ISOMETRIC: DrawTopic = {
  id: 'isometric',
  title: 'Isometric drawing',
  subtitle: 'Draw the same block as a solid picture, using the 30° set square.',
  goal: 'Draw a pictorial view of a solid on three axes — one upright and two at 30° — using the crating method.',
  minutes: 40,
  level: 'Core',
  tools: ['T-square', '30/60 set square', 'HB and 2H pencils', 'Eraser'],
  base: preparedSheet('ISOMETRIC DRAWING', '05'),
  steps: [
    {
      id: 'what-is-isometric',
      title: 'What isometric means',
      tool: 'hand',
      focus: { at: pt(200, 175), r: 200 },
      tip: 'Isometric = equal measure. All three axes are drawn to the same scale, so you measure straight off the sheet.',
      lines: [
        { text: 'Last lesson we cut a block into three flat views.' },
        { text: 'Today we do the opposite. We draw the whole block as one picture.' },
        { text: 'This is called isometric drawing.' },
        { text: 'Isometric means equal measure. Iso is equal. Metric is measure.' },
        { text: 'It has three directions, and only three.' },
        { text: 'Height goes straight up. Always straight up, never slanted.' },
        { text: 'Length goes up to the right, at thirty degrees.' },
        { text: 'Depth goes up to the left, at thirty degrees.' },
        { text: 'Thirty degrees. That is exactly what your set square gives you, so you never guess.' },
      ],
      marks: [],
    },
    {
      id: 'axes',
      title: 'Draw the three axes',
      tool: 'set30',
      teeY: ISO.y,
      focus: { at: pt(190, 200), r: 95 },
      tip: 'The corner where the three axes meet is the corner of the object nearest to you.',
      lines: [
        { text: 'Start with a dot. This will be the front bottom corner of the block.', at: ISO, label: 'start here' },
        { text: 'It is the corner nearest to your eye.' },
        { text: 'From that dot, draw a line straight up. That is the height axis.', at: isoAt(0, 0, 40), label: 'height' },
        { text: 'Now put the thirty sixty set square on your T-square.' },
        { text: 'Draw a line going up to the right at thirty degrees. That is the length axis.', at: isoAt(45, 0, 0), label: 'length' },
        { text: 'Now turn the set square over and draw up to the left, also thirty degrees.', at: isoAt(0, 45, 0), label: 'depth' },
        { text: 'Three lines from one corner. That is your frame for everything else.' },
      ],
      markLines: [0, 2, 4, 5, 4, 5],
      marks: [
        { kind: 'dot', at: ISO },
        { kind: 'line', style: 'construction', a: ISO, b: isoAt(0, 0, H + 12) },
        { kind: 'line', style: 'construction', a: ISO, b: isoAt(L + 12, 0, 0) },
        { kind: 'line', style: 'construction', a: ISO, b: isoAt(0, D + 12, 0) },
        { kind: 'angle', at: ISO, from: 0, to: 30, r: 26, label: '30°' },
        { kind: 'angle', at: ISO, from: 150, to: 180, r: 26, label: '30°' },
      ],
    },
    {
      id: 'mark-sizes',
      title: 'Mark the real sizes on the axes',
      tool: 'pencil',
      teeY: ISO.y,
      focus: { at: pt(200, 190), r: 100 },
      tip: 'On an isometric drawing you measure along the axes only. Never measure across a diagonal.',
      lines: [
        { text: 'Now the sizes. And this is the good news.' },
        { text: 'On these three lines, you measure the real size. No shrinking, no scaling.' },
        { text: 'Eighty long, so measure eighty along the right hand line.', at: isoAt(L, 0, 0), label: '80' },
        { text: 'Fifty deep, so measure fifty along the left hand line.', at: isoAt(0, D, 0), label: '50' },
        { text: 'Sixty high, so measure sixty straight up.', at: isoAt(0, 0, H), label: '60' },
        { text: 'One warning, and it is the biggest mistake in isometric.' },
        { text: 'You may only measure along these three directions.' },
        { text: 'Never put your rule on a slanting corner that is not one of the three. That length is false.' },
      ],
      markLines: [2, 3, 4, 2, 3, 4],
      marks: [
        { kind: 'dot', at: isoAt(L, 0, 0) },
        { kind: 'dot', at: isoAt(0, D, 0) },
        { kind: 'dot', at: isoAt(0, 0, H) },
        { kind: 'dim', a: ISO, b: isoAt(L, 0, 0), offset: -26, label: '80' },
        { kind: 'dim', a: isoAt(0, D, 0), b: ISO, offset: -20, label: '50' },
        { kind: 'dim', a: ISO, b: isoAt(0, 0, H), offset: 22, label: '60' },
      ],
    },
    {
      id: 'crate',
      title: 'Build the crate',
      tool: 'set30',
      teeY: ISO.y,
      focus: { at: pt(205, 172), r: 105 },
      tip: 'The crating method: draw the box the object would just fit inside, then cut pieces off it.',
      lines: [
        { text: 'Now we build a box. We call it the crate.' },
        { text: 'Imagine a wooden box that the block fits into exactly, with no space left over.' },
        { text: 'Eighty by fifty by sixty. Draw it in light construction lines.' },
        { text: 'Every line is parallel to one of your three axes. There are no other directions.', at: isoAt(L, D / 2, H) },
        { text: 'So slide the set square along and keep drawing parallels.' },
        { text: 'It is a box in the air. Take your time and it will look solid.' },
        { text: 'This way of working is called the crating method.' },
        { text: 'You draw the box first, then you cut pieces off it. Like a carpenter.' },
      ],
      // A third of the box per sentence, across the three that describe building
      // it, so the crate grows while he talks rather than after he has finished.
      markLines: CRATE_EDGES.map((_, index) => 2 + Math.floor((index * 3) / CRATE_EDGES.length)),
      marks: CRATE_EDGES,
    },
    {
      id: 'cut-step',
      title: 'Cut the step out of the crate',
      tool: 'set30',
      teeY: ISO.y,
      focus: { at: pt(215, 165), r: 95 },
      tip: 'Mark the cut on the axis first, then carry it round the solid with parallel lines.',
      lines: [
        { text: 'Now we cut the step.' },
        { text: 'The step starts forty millimetres along the length.', at: isoAt(S, 0, 0), label: '40 along' },
        { text: 'Mark that on the bottom front edge, and carry it up the crate.', at: isoAt(S, 0, H / 2) },
        { text: 'The step is thirty millimetres high.', at: isoAt(0, 0, T), label: '30 up' },
        { text: 'Mark thirty up the front corner, and carry it across.', at: isoAt(L / 2, 0, T) },
        { text: 'Where those two meet, the piece above and to the right comes off.', at: isoAt(L * 0.75, D / 2, H * 0.8), label: 'this piece goes' },
        { text: 'Draw the two new faces you have just made.' },
        { text: 'One face standing up, and one face lying flat.' },
      ],
      markLines: [2, 4, 6, 6, 1, 3],
      marks: [
        { kind: 'line', style: 'construction', a: isoAt(S, 0, 0), b: isoAt(S, 0, H) },
        { kind: 'line', style: 'construction', a: isoAt(0, 0, T), b: isoAt(L, 0, T) },
        { kind: 'line', style: 'construction', a: isoAt(S, 0, T), b: isoAt(S, D, T) },
        { kind: 'line', style: 'construction', a: isoAt(S, 0, H), b: isoAt(S, D, H) },
        { kind: 'dim', a: ISO, b: isoAt(S, 0, 0), offset: -13, label: '40' },
        { kind: 'dim', a: ISO, b: isoAt(0, 0, T), offset: 9, label: '30' },
      ],
    },
    {
      id: 'line-in',
      title: 'Line in the finished block',
      tool: 'pencil',
      teeY: ISO.y,
      focus: { at: pt(205, 172), r: 100 },
      tip: 'In a pictorial drawing, hidden edges are normally left out. Show only what the eye can see.',
      lines: [
        { text: 'Now line in. Take the HB and press a little harder.' },
        { text: 'Go over only the edges you can actually see.', at: isoAt(L, 0, T / 2) },
        { text: 'Here is the difference from last lesson.' },
        { text: 'In orthographic we drew hidden edges as dashed lines.' },
        { text: 'In isometric we do not. We leave the hidden edges out completely.' },
        { text: 'There are three of them, and they all meet at the back bottom corner, hiding behind the block.' },
        { text: 'Your outline should now be dark and clear, standing above the light crate lines.' },
        { text: 'Look at it. It looks solid. That is why we draw isometric.' },
        { text: 'One drawing anybody can understand, even someone who cannot read a projection.' },
      ],
      marks: isoEdgeMarks(ISO, blockIsoVisibleEdges(), 'outline'),
    },
    {
      id: 'finish-iso',
      title: 'Tidy up and label',
      tool: 'eraser',
      teeY: ISO.y,
      focus: { at: pt(205, 190), r: 120 },
      tip: 'Isometric drawings are usually not dimensioned. If you must, keep the figures on the axis directions.',
      lines: [
        { text: 'Finally, tidy the sheet.' },
        { text: 'Clean off the loose graphite with a soft eraser or a brush.' },
        { text: 'Do not rub your construction lines away. They are light, and they belong there.' },
        { text: 'Never use your hand to sweep the sheet. Your hand leaves a grey smudge.' },
        { text: 'Letter the title under the drawing.', at: pt(205, 252), label: 'title' },
        { text: 'And fill in the title block in the corner if you have not already.', at: pt(335, 272) },
        { text: 'That is isometric drawing finished.' },
        { text: 'You now know how to set up a sheet, construct with a compass, and draw a solid two different ways.' },
        { text: 'Practise each one three times on real paper. The board teaches your hands, not just your head.' },
      ],
      markLines: [4],
      marks: [
        { kind: 'text', at: pt(205, 252), text: 'ISOMETRIC VIEW OF STEP BLOCK', size: 4.2, align: 'center', bold: true },
      ],
    },
  ],
};

export const PROJECTION_TOPICS: DrawTopic[] = [ORTHOGRAPHIC, ISOMETRIC];
