/**
 * Machine elements drawn by convention — bars, tubes, shafts, springs, splines
 * and serrations.
 *
 * These are the parts nobody draws in full. A three metre bar is not drawn
 * three metres long, a spring's helix is not drawn as a helix, and a splined
 * shaft's forty teeth are not all drawn round the shaft. Instead the drawing
 * carries a conventional representation that every fitter and every examiner
 * reads the same way — which is the whole point of a standard.
 *
 * The shapes come from `drawingConventions.ts`, so a break line really is a
 * wave through the section, a hatched face really is clipped to the material,
 * and a spline tooth really stands on the root circle.
 */

import {
  hatchAnnulus,
  hatchCircle,
  hatchRect,
  compressionSpring,
  externalSplineEndView,
  internalSplineEndView,
  roundBarBreak,
  serrationEndView,
  tensionSpring,
  tubeBreak,
  zigzagBreak,
} from './drawingConventions';
import { polar, pt, type Mark, type Pt } from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/** A centre line running through a horizontal part. */
const centreLine = (y: number, from: number, to: number): Mark => ({
  kind: 'line',
  style: 'centre',
  a: pt(from - 6, y),
  b: pt(to + 6, y),
});

/** The two ends and two sides of a part drawn in an interrupted view. */
function interruptedBody(
  left: number,
  right: number,
  top: number,
  bottom: number,
  breakLeft: number,
  breakRight: number
): Mark[] {
  return [
    { kind: 'line', style: 'outline', a: pt(left, top), b: pt(breakLeft, top) },
    { kind: 'line', style: 'outline', a: pt(breakRight, top), b: pt(right, top) },
    { kind: 'line', style: 'outline', a: pt(left, bottom), b: pt(breakLeft, bottom) },
    { kind: 'line', style: 'outline', a: pt(breakRight, bottom), b: pt(right, bottom) },
    { kind: 'line', style: 'outline', a: pt(left, top), b: pt(left, bottom) },
    { kind: 'line', style: 'outline', a: pt(right, top), b: pt(right, bottom) },
  ];
}

/* ========================================================================= 15
 * Bars
 * ======================================================================= */

const BAR_LEFT = 55;
const BAR_RIGHT = 205;
const BAR_BREAK_A = 118;
const BAR_BREAK_B = 142;

const ROUND_Y = 62;
const ROUND_R = 15;
const SQUARE_Y = 132;
const SQUARE_H = 15;
const HEX_Y = 202;
/** Across flats. A hexagon bar is always ordered and measured across flats. */
const HEX_AF = 30;
const HEX_AC = HEX_AF / Math.cos(Math.PI / 6);

const END_X = 275;

const hexPoints = (centre: Pt): Pt[] =>
  Array.from({ length: 6 }, (_, index) => polar(centre, HEX_AC / 2, 30 + index * 60));

const BARS: DrawTopic = {
  id: 'bars',
  title: 'Bars',
  subtitle: 'Draw long material short, using the conventional break.',
  goal: 'Represent round, square and hexagon bar in an interrupted view, section the end, and dimension the full length even though only part of it is drawn.',
  minutes: 25,
  level: 'Core',
  tools: ['T-square', '45° set square', 'HB pencil'],
  base: preparedSheet('BARS — CONVENTIONAL REPRESENTATION', '15'),
  steps: [
    {
      id: 'why-break',
      title: 'Why we break a bar',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 210 },
      tip: 'A break line lets you draw a long part short. The dimension still gives the true length.',
      lines: [
        { text: 'Today we draw bars — round bar, square bar and hexagon bar.' },
        { text: 'A bar is long. Three metres of it will not fit on your sheet.' },
        { text: 'So we use a convention. We draw both ends, and break out the middle.' },
        { text: 'The break line says: the part carries on, I have just taken a piece out.' },
        { text: 'The dimension still says the true length. The drawing is short, the bar is not.' },
      ],
      marks: [],
    },
    {
      id: 'round-bar',
      title: 'Round bar and its break',
      tool: 'tsquare',
      teeY: ROUND_Y - ROUND_R,
      focus: { at: pt(130, ROUND_Y), r: 120 },
      tip: 'The break in a solid round bar is an S shape drawn freehand across the section.',
      lines: [
        { text: 'Start with the round bar. Two lines along the T-square, thirty apart.' },
        { text: 'Close both ends with a short vertical line.', at: pt(BAR_LEFT, ROUND_Y) },
        { text: 'Now put in the centre line, thin and long-short-long.', at: pt(130, ROUND_Y) },
        { text: 'Here comes the break. Freehand, not with the square.', at: pt(BAR_BREAK_A, ROUND_Y), label: 'S break' },
        { text: 'It waves out one side, back through the middle, and out the other side.' },
        { text: 'That S is the sign for solid round material. Learn it — it is examined.' },
      ],
      markLines: [0, 0, 0, 0, 1, 1, 2, 3, 4, 5],
      marks: [
        ...interruptedBody(BAR_LEFT, BAR_RIGHT, ROUND_Y - ROUND_R, ROUND_Y + ROUND_R, BAR_BREAK_A, BAR_BREAK_B),
        centreLine(ROUND_Y, BAR_LEFT, BAR_RIGHT),
        ...roundBarBreak(pt(BAR_BREAK_A, ROUND_Y), ROUND_R),
        ...roundBarBreak(pt(BAR_BREAK_B, ROUND_Y), ROUND_R),
        { kind: 'text', at: pt(BAR_LEFT - 8, ROUND_Y), text: 'ROUND', size: 3, align: 'right', baseline: 'middle' },
      ],
    },
    {
      id: 'round-section',
      title: 'Cut it and hatch it',
      tool: 'compass',
      compassRadius: ROUND_R,
      focus: { at: pt(END_X, ROUND_Y), r: 70 },
      tip: 'Section hatching is thin continuous lines at 45°, evenly spaced, inside the cut face only.',
      lines: [
        { text: 'Beside it we show the section — what you see if you saw the bar through.' },
        { text: 'Swing a circle of the same diameter.', at: pt(END_X, ROUND_Y), label: 'Ø30' },
        { text: 'Now hatch it. Thin lines at forty-five degrees, evenly spaced.' },
        { text: 'Hatching must stop on the outline. Never let it run outside the metal.' },
        { text: 'Solid section, so the hatching goes right across. Nothing is hollow here.' },
      ],
      markLines: [1, 2, 2, 2, 2, 3, 3, 4, 4, 1, 1],
      marks: [
        { kind: 'circle', style: 'outline', c: pt(END_X, ROUND_Y), r: ROUND_R },
        ...hatchCircle(pt(END_X, ROUND_Y), ROUND_R),
        centreLine(ROUND_Y, END_X - ROUND_R, END_X + ROUND_R),
        { kind: 'line', style: 'centre', a: pt(END_X, ROUND_Y - ROUND_R - 6), b: pt(END_X, ROUND_Y + ROUND_R + 6) },
      ],
    },
    {
      id: 'square-bar',
      title: 'Square bar, zigzag break',
      tool: 'tsquare',
      teeY: SQUARE_Y - SQUARE_H,
      focus: { at: pt(160, SQUARE_Y), r: 140 },
      tip: 'Flat and square material takes the zigzag break, not the S.',
      lines: [
        { text: 'Square bar next, thirty across the flats.' },
        { text: 'The break is different. Square and flat material takes a zigzag.' },
        { text: 'One sharp z in the middle of the line, drawn freehand.', at: pt(BAR_BREAK_A, SQUARE_Y) },
        { text: 'The end view is a square, hatched the same forty-five degrees.', at: pt(END_X, SQUARE_Y) },
      ],
      markLines: [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
      marks: [
        ...interruptedBody(BAR_LEFT, BAR_RIGHT, SQUARE_Y - SQUARE_H, SQUARE_Y + SQUARE_H, BAR_BREAK_A, BAR_BREAK_B),
        centreLine(SQUARE_Y, BAR_LEFT, BAR_RIGHT),
        zigzagBreak(pt(BAR_BREAK_A, SQUARE_Y - SQUARE_H), pt(BAR_BREAK_A, SQUARE_Y + SQUARE_H)),
        zigzagBreak(pt(BAR_BREAK_B, SQUARE_Y - SQUARE_H), pt(BAR_BREAK_B, SQUARE_Y + SQUARE_H)),
        { kind: 'text', at: pt(BAR_LEFT - 8, SQUARE_Y), text: 'SQUARE', size: 3, align: 'right', baseline: 'middle' },
        {
          kind: 'poly',
          style: 'outline',
          close: true,
          points: [
            pt(END_X - SQUARE_H, SQUARE_Y - SQUARE_H),
            pt(END_X + SQUARE_H, SQUARE_Y - SQUARE_H),
            pt(END_X + SQUARE_H, SQUARE_Y + SQUARE_H),
            pt(END_X - SQUARE_H, SQUARE_Y + SQUARE_H),
          ],
        },
        ...hatchRect(END_X - SQUARE_H, SQUARE_Y - SQUARE_H, SQUARE_H * 2, SQUARE_H * 2),
      ],
    },
    {
      id: 'hex-bar',
      title: 'Hexagon bar across flats',
      tool: 'set30',
      focus: { at: pt(160, HEX_Y), r: 140 },
      tip: 'Hexagon bar is ordered and dimensioned across the flats — A/F — never across the corners.',
      lines: [
        { text: 'Hexagon bar last. This is the material every nut and bolt head is made from.' },
        { text: 'In the side view it looks like square bar, so we letter it A slash F.' },
        { text: 'The end view is a true hexagon. Use the thirty-sixty set square.', at: pt(END_X, HEX_Y) },
        { text: 'Across the flats is thirty. Across the corners is bigger — thirty four point six.' },
        { text: 'The stores will ask you for across flats. Give them that, not the corners.' },
      ],
      markLines: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3],
      marks: [
        ...interruptedBody(BAR_LEFT, BAR_RIGHT, HEX_Y - HEX_AF / 2, HEX_Y + HEX_AF / 2, BAR_BREAK_A, BAR_BREAK_B),
        centreLine(HEX_Y, BAR_LEFT, BAR_RIGHT),
        zigzagBreak(pt(BAR_BREAK_A, HEX_Y - HEX_AF / 2), pt(BAR_BREAK_A, HEX_Y + HEX_AF / 2)),
        zigzagBreak(pt(BAR_BREAK_B, HEX_Y - HEX_AF / 2), pt(BAR_BREAK_B, HEX_Y + HEX_AF / 2)),
        { kind: 'text', at: pt(BAR_LEFT - 8, HEX_Y), text: 'HEX', size: 3, align: 'right', baseline: 'middle' },
        // Looking across the flats you see the two corner edges as well, one
        // quarter of the across-corners size each side of centre. Without them
        // a hexagon bar is indistinguishable from square bar.
        { kind: 'line', style: 'outline', a: pt(BAR_LEFT, HEX_Y - HEX_AC / 4), b: pt(BAR_BREAK_A, HEX_Y - HEX_AC / 4) },
        { kind: 'line', style: 'outline', a: pt(BAR_BREAK_B, HEX_Y - HEX_AC / 4), b: pt(BAR_RIGHT, HEX_Y - HEX_AC / 4) },
        { kind: 'line', style: 'outline', a: pt(BAR_LEFT, HEX_Y + HEX_AC / 4), b: pt(BAR_BREAK_A, HEX_Y + HEX_AC / 4) },
        { kind: 'line', style: 'outline', a: pt(BAR_BREAK_B, HEX_Y + HEX_AC / 4), b: pt(BAR_RIGHT, HEX_Y + HEX_AC / 4) },
        { kind: 'poly', style: 'outline', close: true, points: hexPoints(pt(END_X, HEX_Y)) },
        ...hatchCircle(pt(END_X, HEX_Y), HEX_AF / 2 - 0.6),
      ],
    },
    {
      id: 'dimension-bars',
      title: 'Dimension the true length',
      tool: 'pencil',
      focus: { at: pt(180, 140), r: 200 },
      tip: 'A dimension across a break is the full size of the part, not the length you drew.',
      lines: [
        { text: 'Last job: the sizes.' },
        { text: 'Diameter thirty on the round bar. The symbol is a circle with a stroke through it.' },
        { text: 'Thirty across flats on the square and the hexagon.' },
        { text: 'And the length — two hundred and fifty — written across the break.' },
        { text: 'That is the convention working for you. Short drawing, true size.' },
      ],
      markLines: [1, 3, 2, 2],
      marks: [
        { kind: 'dim', a: pt(BAR_LEFT, ROUND_Y - ROUND_R), b: pt(BAR_LEFT, ROUND_Y + ROUND_R), offset: 14, label: 'Ø30' },
        { kind: 'dim', a: pt(BAR_LEFT, ROUND_Y + ROUND_R), b: pt(BAR_RIGHT, ROUND_Y + ROUND_R), offset: -16, label: '250' },
        { kind: 'dim', a: pt(END_X - SQUARE_H, SQUARE_Y + SQUARE_H), b: pt(END_X + SQUARE_H, SQUARE_Y + SQUARE_H), offset: -12, label: '30' },
        { kind: 'dim', a: pt(END_X, HEX_Y - HEX_AF / 2), b: pt(END_X, HEX_Y + HEX_AF / 2), offset: 20, label: '30 A/F' },
      ],
    },
  ],
};

/* ========================================================================= 16
 * Tubes
 * ======================================================================= */

const TUBE_Y = 95;
const TUBE_OR = 20;
const TUBE_IR = 14;
const TUBE_END = 300;

const TUBES: DrawTopic = {
  id: 'tubes',
  title: 'Tubes',
  subtitle: 'Show the bore and the wall thickness with one break.',
  goal: 'Draw tube in an interrupted view so the wall reads at a glance, section it correctly, and dimension outside diameter, bore and wall thickness.',
  minutes: 25,
  level: 'Core',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('TUBES — CONVENTIONAL REPRESENTATION', '16'),
  steps: [
    {
      id: 'tube-vs-bar',
      title: 'A tube is a bar with a hole',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 200 },
      tip: 'Outside diameter minus bore, divided by two, is the wall thickness.',
      lines: [
        { text: 'A tube is a bar with a hole down the middle.' },
        { text: 'That hole is called the bore.' },
        { text: 'The metal left round it is the wall.' },
        { text: 'Outside diameter, take away the bore, divide by two. That is your wall thickness.' },
        { text: 'Forty outside, twenty-eight bore. Forty take twenty-eight is twelve, halved is six.' },
      ],
      marks: [],
    },
    {
      id: 'tube-body',
      title: 'Draw the tube',
      tool: 'tsquare',
      teeY: TUBE_Y - TUBE_OR,
      focus: { at: pt(150, TUBE_Y), r: 130 },
      tip: 'The bore is shown by hidden lines when it cannot be seen — dashes, evenly spaced.',
      lines: [
        { text: 'Two outside lines, forty apart, along the T-square.' },
        { text: 'Inside them, two more for the bore.', at: pt(150, TUBE_Y - TUBE_IR) },
        { text: 'The bore is inside the metal, so you cannot see it. Draw it hidden — short dashes.' },
        { text: 'Centre line down the middle, long-short-long.' },
        { text: 'Close the ends. Now it is a tube, not four lines.' },
      ],
      markLines: [0, 0, 0, 0, 4, 4, 1, 1, 2, 2, 3],
      marks: [
        ...interruptedBody(60, 230, TUBE_Y - TUBE_OR, TUBE_Y + TUBE_OR, 132, 158),
        { kind: 'line', style: 'hidden', a: pt(60, TUBE_Y - TUBE_IR), b: pt(132, TUBE_Y - TUBE_IR) },
        { kind: 'line', style: 'hidden', a: pt(158, TUBE_Y - TUBE_IR), b: pt(230, TUBE_Y - TUBE_IR) },
        { kind: 'line', style: 'hidden', a: pt(60, TUBE_Y + TUBE_IR), b: pt(132, TUBE_Y + TUBE_IR) },
        { kind: 'line', style: 'hidden', a: pt(158, TUBE_Y + TUBE_IR), b: pt(230, TUBE_Y + TUBE_IR) },
        centreLine(TUBE_Y, 60, 230),
      ],
    },
    {
      id: 'tube-break',
      title: 'Break it open',
      tool: 'pencil',
      focus: { at: pt(145, TUBE_Y), r: 70 },
      tip: 'On a tube the break waves on the wall only — the bore is left open between the two waves.',
      lines: [
        { text: 'The break on a tube is not one wave. It is one on each wall.' },
        { text: 'Top wall waves through its own thickness.', at: pt(132, TUBE_Y - TUBE_OR) },
        { text: 'Bottom wall does the same.', at: pt(132, TUBE_Y + TUBE_OR) },
        { text: 'The gap in the middle is the bore, left open.' },
        { text: 'Anybody looking at this knows straight away: hollow, and that thick.' },
      ],
      // Both top walls on "top wall", both bottom walls on "bottom wall": the
      // two breaks are the same feature drawn twice, one each side of the gap.
      markLines: [1, 2, 1, 2],
      marks: [
        ...tubeBreak(pt(132, TUBE_Y), TUBE_OR, TUBE_IR),
        ...tubeBreak(pt(158, TUBE_Y), TUBE_OR, TUBE_IR),
      ],
    },
    {
      id: 'tube-section',
      title: 'Section the tube',
      tool: 'compass',
      compassRadius: TUBE_OR,
      focus: { at: pt(TUBE_END, TUBE_Y), r: 80 },
      tip: 'Hatch the ring only. The bore is a hole — there is no metal there to hatch.',
      lines: [
        { text: 'Two circles for the end view: outside diameter, then the bore.' },
        { text: 'Cut it through and you get a ring.' },
        { text: 'Hatch the ring. Do not hatch the hole.', at: pt(TUBE_END, TUBE_Y), label: 'ring only' },
        { text: 'Hatching in the bore is the commonest mistake in the whole paper.' },
      ],
      markLines: [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
      markWords: ['outside', 'bore'],
      marks: [
        { kind: 'circle', style: 'outline', c: pt(TUBE_END, TUBE_Y), r: TUBE_OR },
        { kind: 'circle', style: 'outline', c: pt(TUBE_END, TUBE_Y), r: TUBE_IR },
        ...hatchAnnulus(pt(TUBE_END, TUBE_Y), TUBE_OR, TUBE_IR),
        centreLine(TUBE_Y, TUBE_END - TUBE_OR, TUBE_END + TUBE_OR),
        { kind: 'line', style: 'centre', a: pt(TUBE_END, TUBE_Y - TUBE_OR - 6), b: pt(TUBE_END, TUBE_Y + TUBE_OR + 6) },
      ],
    },
    {
      id: 'tube-dims',
      title: 'Three sizes, no more',
      tool: 'pencil',
      focus: { at: pt(220, TUBE_Y + 30), r: 170 },
      tip: 'Give outside diameter and bore. The wall follows from them — do not over-dimension.',
      lines: [
        { text: 'Outside diameter forty. Bore twenty-eight.' },
        { text: 'Those two fix everything. The wall is already decided.' },
        { text: 'If you dimension all three you have over-dimensioned the drawing.' },
        { text: 'Over-dimensioning loses marks, because two workshops can then argue about which one to work to.' },
      ],
      markLines: [0, 0, 1],
      markWords: ['outside', 'bore'],
      marks: [
        { kind: 'dim', a: pt(60, TUBE_Y - TUBE_OR), b: pt(60, TUBE_Y + TUBE_OR), offset: 16, label: 'Ø40' },
        { kind: 'dim', a: pt(TUBE_END, TUBE_Y - TUBE_IR), b: pt(TUBE_END, TUBE_Y + TUBE_IR), offset: -26, label: 'Ø28' },
        { kind: 'text', at: pt(TUBE_END, TUBE_Y + TUBE_OR + 16), text: 'WALL 6 THICK', size: 3, align: 'center' },
      ],
    },
  ],
};

/* ========================================================================= 17
 * Shafts
 * ======================================================================= */

const SHAFT_Y = 110;
const SHAFT_LEFT = 55;
/** Three diameters, stepped down each way from the big centre bearing seat. */
const STEP_A = { from: SHAFT_LEFT, to: 105, r: 12 };
const STEP_B = { from: 105, to: 205, r: 20 };
const STEP_C = { from: 205, to: 250, r: 15 };
const KEYWAY = { from: 130, to: 180, depth: 5 };

const SHAFTS: DrawTopic = {
  id: 'shafts',
  title: 'Shafts',
  subtitle: 'A stepped shaft with its chamfers, keyway and centre line.',
  goal: 'Draw a stepped shaft with chamfered ends and a sunk keyway, and dimension every diameter and length from one datum face.',
  minutes: 30,
  level: 'Core',
  tools: ['T-square', '45° set square', 'Compass', 'HB pencil'],
  base: preparedSheet('STEPPED SHAFT', '17'),
  steps: [
    {
      id: 'shaft-job',
      title: 'What a shaft has to do',
      tool: 'hand',
      focus: { at: pt(160, 120), r: 200 },
      tip: 'Every step on a shaft is there for a reason: a bearing, a gear, or a shoulder to locate against.',
      lines: [
        { text: 'A shaft carries the drive. It turns, so it is round.' },
        { text: 'It is not one diameter all the way. It is stepped.' },
        { text: 'Each step is there for something: a bearing here, a gear there.' },
        { text: 'The face where one step meets the next is called a shoulder.' },
        { text: 'The shoulder is what stops the bearing sliding along. It locates it.' },
      ],
      marks: [],
    },
    {
      id: 'shaft-centre',
      title: 'Centre line first',
      tool: 'tsquare',
      teeY: SHAFT_Y,
      focus: { at: pt(150, SHAFT_Y), r: 130 },
      tip: 'Every round part is built out from its centre line. Draw it before anything else.',
      lines: [
        { text: 'A round part starts with its centre line. Always.' },
        { text: 'Long, short, long. Thin. Running past both ends of the part.' },
        { text: 'Everything else is measured off this line, half a diameter each way.' },
      ],
      markLines: [0],
      marks: [centreLine(SHAFT_Y, SHAFT_LEFT, STEP_C.to)],
    },
    {
      id: 'shaft-steps',
      title: 'Step the diameters out',
      tool: 'tsquare',
      teeY: SHAFT_Y - STEP_B.r,
      focus: { at: pt(150, SHAFT_Y), r: 130 },
      tip: 'Work above the centre line, then repeat the same sizes below it. Never measure the whole diameter freehand.',
      lines: [
        { text: 'Twelve above the line and twelve below gives you twenty-four diameter.' },
        { text: 'Then twenty each way for the forty bearing seat.', at: pt(155, SHAFT_Y - STEP_B.r) },
        { text: 'Then fifteen each way for the thirty on the output end.' },
        { text: 'Join the steps with vertical lines. Those are your shoulders.' },
        { text: 'Leave a gap along the top of the bearing seat. The keyway is cut there.', at: pt(155, SHAFT_Y - STEP_B.r) },
      ],
      // The bottom outline runs the whole length in one mark, so it goes down on
      // the first size; the top is already split either side of the keyway.
      markLines: [1, 2, 0, 3, 3],
      marks: [
        // The top outline stops each side of the keyway: the keyway is cut into
        // the highest part of the shaft, so it takes the outline with it.
        { kind: 'poly', style: 'outline', points: [
          pt(STEP_A.from, SHAFT_Y - STEP_A.r),
          pt(STEP_A.to, SHAFT_Y - STEP_A.r),
          pt(STEP_A.to, SHAFT_Y - STEP_B.r),
          pt(KEYWAY.from, SHAFT_Y - STEP_B.r),
        ] },
        { kind: 'poly', style: 'outline', points: [
          pt(KEYWAY.to, SHAFT_Y - STEP_B.r),
          pt(STEP_B.to, SHAFT_Y - STEP_B.r),
          pt(STEP_B.to, SHAFT_Y - STEP_C.r),
          pt(STEP_C.to, SHAFT_Y - STEP_C.r),
        ] },
        { kind: 'poly', style: 'outline', points: [
          pt(STEP_A.from, SHAFT_Y + STEP_A.r),
          pt(STEP_A.to, SHAFT_Y + STEP_A.r),
          pt(STEP_A.to, SHAFT_Y + STEP_B.r),
          pt(STEP_B.to, SHAFT_Y + STEP_B.r),
          pt(STEP_B.to, SHAFT_Y + STEP_C.r),
          pt(STEP_C.to, SHAFT_Y + STEP_C.r),
        ] },
        { kind: 'line', style: 'outline', a: pt(STEP_A.from, SHAFT_Y - STEP_A.r), b: pt(STEP_A.from, SHAFT_Y + STEP_A.r) },
        { kind: 'line', style: 'outline', a: pt(STEP_C.to, SHAFT_Y - STEP_C.r), b: pt(STEP_C.to, SHAFT_Y + STEP_C.r) },
      ],
    },
    {
      id: 'shaft-chamfer',
      title: 'Chamfer both ends',
      tool: 'set45',
      focus: { at: pt(SHAFT_LEFT + 10, SHAFT_Y), r: 55 },
      tip: 'A chamfer is written as 2 × 45°. It removes the sharp edge and helps the part start into a hole.',
      lines: [
        { text: 'Never leave a sharp corner on the end of a shaft.' },
        { text: 'Take a small chamfer with the forty-five set square.', at: pt(SHAFT_LEFT, SHAFT_Y - STEP_A.r) },
        { text: 'Two by forty-five degrees is the usual one.' },
        { text: 'It saves fingers, and it helps the shaft start into the bearing.' },
      ],
      markLines: [1, 1, 2, 2, 2],
      marks: [
        { kind: 'line', style: 'outline', a: pt(SHAFT_LEFT, SHAFT_Y - STEP_A.r + 2), b: pt(SHAFT_LEFT + 2, SHAFT_Y - STEP_A.r) },
        { kind: 'line', style: 'outline', a: pt(SHAFT_LEFT, SHAFT_Y + STEP_A.r - 2), b: pt(SHAFT_LEFT + 2, SHAFT_Y + STEP_A.r) },
        { kind: 'line', style: 'outline', a: pt(STEP_C.to - 2, SHAFT_Y - STEP_C.r), b: pt(STEP_C.to, SHAFT_Y - STEP_C.r + 2) },
        { kind: 'line', style: 'outline', a: pt(STEP_C.to - 2, SHAFT_Y + STEP_C.r), b: pt(STEP_C.to, SHAFT_Y + STEP_C.r - 2) },
        { kind: 'text', at: pt(SHAFT_LEFT - 4, SHAFT_Y - STEP_A.r - 10), text: '2 × 45°', size: 2.8, align: 'left' },
      ],
    },
    {
      id: 'shaft-keyway',
      title: 'Cut the keyway',
      tool: 'pencil',
      focus: { at: pt(155, SHAFT_Y - STEP_B.r), r: 60 },
      tip: 'A key stops the gear turning on the shaft. The keyway is the slot the key sits in.',
      lines: [
        { text: 'The gear must not spin on the shaft. So we key it.' },
        { text: 'A key is a rectangular block sitting half in the shaft, half in the gear.' },
        { text: 'The slot in the shaft is the keyway.', at: pt(155, SHAFT_Y - STEP_B.r), label: 'keyway' },
        { text: 'Draw it on the bearing seat, five deep, and let it break the outline.' },
        { text: 'And show the end view, so the width and the depth can both be seen.' },
      ],
      markLines: [3, 3, 3, 4, 4, 4, 4],
      marks: [
        { kind: 'line', style: 'outline', a: pt(KEYWAY.from, SHAFT_Y - STEP_B.r), b: pt(KEYWAY.from, SHAFT_Y - STEP_B.r + KEYWAY.depth) },
        { kind: 'line', style: 'outline', a: pt(KEYWAY.from, SHAFT_Y - STEP_B.r + KEYWAY.depth), b: pt(KEYWAY.to, SHAFT_Y - STEP_B.r + KEYWAY.depth) },
        { kind: 'line', style: 'outline', a: pt(KEYWAY.to, SHAFT_Y - STEP_B.r), b: pt(KEYWAY.to, SHAFT_Y - STEP_B.r + KEYWAY.depth) },
        // An outside view of the end, not a section: there is nothing to gain
        // from cutting a shaft in half, and hatching would bury the keyway.
        { kind: 'circle', style: 'outline', c: pt(320, SHAFT_Y), r: STEP_B.r },
        {
          kind: 'poly',
          style: 'outline',
          points: [
            pt(314, SHAFT_Y - STEP_B.r),
            pt(314, SHAFT_Y - STEP_B.r + KEYWAY.depth),
            pt(326, SHAFT_Y - STEP_B.r + KEYWAY.depth),
            pt(326, SHAFT_Y - STEP_B.r),
          ],
        },
        centreLine(SHAFT_Y, 320 - STEP_B.r, 320 + STEP_B.r),
        { kind: 'line', style: 'centre', a: pt(320, SHAFT_Y - STEP_B.r - 6), b: pt(320, SHAFT_Y + STEP_B.r + 6) },
      ],
    },
    {
      id: 'shaft-dims',
      title: 'Dimension from one face',
      tool: 'pencil',
      focus: { at: pt(160, SHAFT_Y + 40), r: 180 },
      tip: 'Lengths taken from one datum face do not add up their errors. Chained lengths do.',
      lines: [
        { text: 'Diameters first. Twenty-four, then forty, then thirty.' },
        { text: 'Now the lengths. Take them all from the left-hand face.' },
        { text: 'That face is the datum. Everything is measured from it.' },
        { text: 'If you chain the lengths instead, every small error adds to the next one.' },
        { text: 'From one datum, each length is wrong on its own only. That is why we do it.' },
      ],
      markLines: [0, 0, 0, 1, 1, 2],
      markWords: ['twenty-four', 'forty', 'thirty'],
      marks: [
        { kind: 'dim', a: pt(STEP_A.from, SHAFT_Y - STEP_A.r), b: pt(STEP_A.from, SHAFT_Y + STEP_A.r), offset: 14, label: 'Ø24' },
        { kind: 'dim', a: pt(155, SHAFT_Y - STEP_B.r), b: pt(155, SHAFT_Y + STEP_B.r), offset: 0, label: 'Ø40' },
        { kind: 'dim', a: pt(228, SHAFT_Y - STEP_C.r), b: pt(228, SHAFT_Y + STEP_C.r), offset: 0, label: 'Ø30' },
        { kind: 'dim', a: pt(SHAFT_LEFT, SHAFT_Y + 30), b: pt(STEP_A.to, SHAFT_Y + 30), offset: -8, label: '50' },
        { kind: 'dim', a: pt(SHAFT_LEFT, SHAFT_Y + 30), b: pt(STEP_B.to, SHAFT_Y + 30), offset: -20, label: '150' },
        { kind: 'dim', a: pt(SHAFT_LEFT, SHAFT_Y + 30), b: pt(STEP_C.to, SHAFT_Y + 30), offset: -32, label: '195' },
      ],
    },
  ],
};

/* ========================================================================= 18
 * Compression springs
 * ======================================================================= */

const SPRING_X = 110;
const SPRING_TOP = 55;
const SPRING_MEAN = 34;
const SPRING_WIRE = 5;
const SPRING_PITCH = 18;
const SPRING_COILS = 6;
const SPRING_FREE = SPRING_COILS * SPRING_PITCH;

const COMPRESSION_SPRINGS: DrawTopic = {
  id: 'compression-springs',
  title: 'Compression springs',
  subtitle: 'Draw a helix as straight lines, the way the standard asks.',
  goal: 'Draw a helical compression spring in its conventional straight-line form, show the closed and ground ends, and give the four sizes a spring is ordered by.',
  minutes: 30,
  level: 'Core',
  tools: ['T-square', '45° set square', 'HB pencil'],
  base: preparedSheet('COMPRESSION SPRING', '18'),
  steps: [
    {
      id: 'spring-idea',
      title: 'Nobody draws a real helix',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 210 },
      tip: 'Free length, outside diameter, wire diameter and number of coils — those four order a spring.',
      lines: [
        { text: 'A spring is a helix. A helix is a curve going round and along at the same time.' },
        { text: 'Drawing that curve properly takes an hour and nobody does it.' },
        { text: 'So the standard says: draw the coils as straight sloping lines.' },
        { text: 'Everyone reads it as a spring. That is a convention doing its job.' },
        { text: 'A compression spring is pushed. It gets shorter under load.' },
      ],
      marks: [],
    },
    {
      id: 'spring-envelope',
      title: 'Set out the envelope',
      tool: 'tsquare',
      teeY: SPRING_TOP,
      focus: { at: pt(SPRING_X, SPRING_TOP + SPRING_FREE / 2), r: 90 },
      tip: 'Outside diameter = mean diameter + one wire diameter. Set the envelope out before any coil.',
      lines: [
        { text: 'First the box the spring lives in.' },
        { text: 'Centre line down the middle.' },
        { text: 'Two lines each side for the outside diameter.', at: pt(SPRING_X, SPRING_TOP + 20) },
        { text: 'Top and bottom lines for the free length — the length with no load on it.' },
        { text: 'Mean diameter is the middle of the wire. Outside is mean plus one wire.' },
      ],
      markLines: [1, 2, 2],
      marks: [
        { kind: 'line', style: 'centre', a: pt(SPRING_X, SPRING_TOP - 10), b: pt(SPRING_X, SPRING_TOP + SPRING_FREE + 10) },
        { kind: 'line', style: 'construction', a: pt(SPRING_X - 24, SPRING_TOP), b: pt(SPRING_X + 24, SPRING_TOP) },
        { kind: 'line', style: 'construction', a: pt(SPRING_X - 24, SPRING_TOP + SPRING_FREE), b: pt(SPRING_X + 24, SPRING_TOP + SPRING_FREE) },
      ],
    },
    {
      id: 'spring-coils',
      title: 'Slope the coils in',
      tool: 'set30',
      focus: { at: pt(SPRING_X, SPRING_TOP + SPRING_FREE / 2), r: 90 },
      tip: 'Front of the coil slopes one way, back of the coil the other. That is what makes it read as a helix.',
      lines: [
        { text: 'Now the coils, one pitch apart.' },
        { text: 'The front of each coil slopes down from left to right.' },
        { text: 'The back of the same coil comes back the other way.', at: pt(SPRING_X, SPRING_TOP + SPRING_PITCH) },
        { text: 'Front, back, front, back. Six coils here.' },
        { text: 'Keep every line the same slope. A spring with a wandering pitch looks broken.' },
      ],
      // The first coil is walked through front then back, because that is the
      // move being taught; the other five go down while he counts them off.
      markLines: [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      marks: compressionSpring({
        top: pt(SPRING_X, SPRING_TOP),
        meanDiameter: SPRING_MEAN,
        wire: SPRING_WIRE,
        pitch: SPRING_PITCH,
        coils: SPRING_COILS,
      }),
    },
    {
      id: 'spring-ends',
      title: 'Closed and ground ends',
      tool: 'pencil',
      focus: { at: pt(SPRING_X, SPRING_TOP), r: 60 },
      tip: 'Closed and ground ends let the spring stand square. Open ends make it lean under load.',
      lines: [
        { text: 'Look at the top and bottom coil. They lie flat.' },
        { text: 'That is called closed and ground.' },
        { text: 'Closed means the last coil touches the one below it.' },
        { text: 'Ground means it has been flattened on a wheel so it sits square.' },
        { text: 'Without that the spring leans over when you press it. It must sit flat.' },
      ],
      markLines: [1, 1],
      marks: [
        { kind: 'text', at: pt(SPRING_X + 30, SPRING_TOP), text: 'CLOSED & GROUND', size: 2.6, align: 'left', baseline: 'middle' },
        { kind: 'line', style: 'construction', a: pt(SPRING_X + 18, SPRING_TOP), b: pt(SPRING_X + 29, SPRING_TOP) },
      ],
    },
    {
      id: 'spring-dims',
      title: 'The four sizes',
      tool: 'pencil',
      focus: { at: pt(150, SPRING_TOP + SPRING_FREE / 2), r: 130 },
      tip: 'A spring drawing without the number of coils is not a spring drawing.',
      lines: [
        { text: 'Free length one hundred and eight.' },
        { text: 'Outside diameter thirty-nine. Wire diameter five.' },
        { text: 'And six coils — write that on as a note, you cannot dimension a count.' },
        { text: 'Those four sizes let anybody wind the same spring again.' },
      ],
      markLines: [0, 1, 1, 2, 3],
      markWords: [undefined, 'outside', 'wire'],
      marks: [
        { kind: 'dim', a: pt(SPRING_X + 30, SPRING_TOP), b: pt(SPRING_X + 30, SPRING_TOP + SPRING_FREE), offset: -18, label: '108 FREE' },
        { kind: 'dim', a: pt(SPRING_X - SPRING_MEAN / 2 - SPRING_WIRE / 2, SPRING_TOP + SPRING_FREE + 14), b: pt(SPRING_X + SPRING_MEAN / 2 + SPRING_WIRE / 2, SPRING_TOP + SPRING_FREE + 14), offset: -10, label: 'Ø39 O/D' },
        { kind: 'text', at: pt(200, SPRING_TOP + 20), text: 'WIRE Ø5', size: 3, align: 'left' },
        { kind: 'text', at: pt(200, SPRING_TOP + 30), text: '6 COILS, RH', size: 3, align: 'left' },
        { kind: 'text', at: pt(200, SPRING_TOP + 40), text: 'ENDS CLOSED & GROUND', size: 3, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 19
 * Tension springs
 * ======================================================================= */

const TENSION_X = 110;
const TENSION_TOP = 80;
const TENSION_MEAN = 26;
const TENSION_WIRE = 4;
const TENSION_COILS = 14;

/**
 * The whole spring, built once and then split between two steps: the coils are
 * drawn with the set square while he closes them up, and the two end loops are
 * held back for the compass step that explains them. `tensionSpring` returns the
 * coils first and the two loops last, which is the order they are taught in.
 */
const TENSION_MARKS = tensionSpring({
  top: pt(TENSION_X, TENSION_TOP),
  meanDiameter: TENSION_MEAN,
  wire: TENSION_WIRE,
  pitch: TENSION_WIRE,
  coils: TENSION_COILS,
});
const TENSION_COIL_MARKS = TENSION_MARKS.slice(0, TENSION_COILS * 2);
const TENSION_LOOP_MARKS = TENSION_MARKS.slice(TENSION_COILS * 2);

const TENSION_SPRINGS: DrawTopic = {
  id: 'tension-springs',
  title: 'Tension springs',
  subtitle: 'Coils touching, and a loop at each end to pull on.',
  goal: 'Draw a helical tension spring with its coils closed and a full loop at each end, and say how it differs from a compression spring.',
  minutes: 25,
  level: 'Core',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('TENSION SPRING', '19'),
  steps: [
    {
      id: 'tension-idea',
      title: 'Pulled, not pushed',
      tool: 'hand',
      focus: { at: pt(170, 130), r: 200 },
      tip: 'Compression springs are pushed and have gaps. Tension springs are pulled and have none.',
      lines: [
        { text: 'A tension spring is pulled. A compression spring is pushed.' },
        { text: 'That one difference changes the whole drawing.' },
        { text: 'A pushed spring needs gaps between the coils, so it has somewhere to go.' },
        { text: 'A pulled spring needs none. Its coils touch when it is at rest.' },
        { text: 'And it needs something to pull on. That is the loop at each end.' },
      ],
      marks: [],
    },
    {
      id: 'tension-coils',
      title: 'Close the coils up',
      tool: 'set30',
      focus: { at: pt(TENSION_X, TENSION_TOP + 30), r: 80 },
      tip: 'On a tension spring the pitch equals the wire diameter, because the coils are touching.',
      lines: [
        { text: 'Same sloping lines as before, but no gaps.' },
        { text: 'The pitch is the wire diameter. Four wire, four pitch.' },
        { text: 'Fourteen coils, all touching.' },
        { text: 'It should look tight, like a coil of wire, not like a slinky.' },
      ],
      // Two coils to show the move, four while he gives the pitch, and the rest
      // as he counts them — so fourteen coils are not rattled off in a second.
      markLines: TENSION_COIL_MARKS.map((_, index) => (index < 4 ? 0 : index < 10 ? 1 : 2)),
      marks: TENSION_COIL_MARKS,
    },
    {
      id: 'tension-loops',
      title: 'The loops carry the load',
      tool: 'compass',
      compassRadius: TENSION_MEAN * 0.4,
      focus: { at: pt(TENSION_X, TENSION_TOP), r: 45 },
      tip: 'The loop is the weakest point of a tension spring — it is where they nearly always break.',
      lines: [
        { text: 'The last coil is turned up to make a loop.' },
        { text: 'Swing it with the compass so it is a true half circle.', at: pt(TENSION_X, TENSION_TOP - 10) },
        { text: 'One at each end, both in the same plane.' },
        { text: 'The loop is where the load goes in — and where the spring breaks first.' },
      ],
      markLines: [0, 2, 3],
      marks: [
        TENSION_LOOP_MARKS[0],
        TENSION_LOOP_MARKS[1],
        { kind: 'text', at: pt(TENSION_X + 26, TENSION_TOP - 12), text: 'FULL LOOP', size: 2.8, align: 'left', baseline: 'middle' },
      ],
    },
    {
      id: 'tension-dims',
      title: 'Length over the loops',
      tool: 'pencil',
      focus: { at: pt(150, TENSION_TOP + 30), r: 120 },
      tip: 'A tension spring is measured over the loops, not over the coils.',
      lines: [
        { text: 'Careful with the length on this one.' },
        { text: 'The free length of a tension spring is measured over the loops.' },
        { text: 'Not over the coils. Over the loops, outside to outside.' },
        { text: 'Then outside diameter, wire diameter and the number of coils, same as before.' },
      ],
      markLines: [1, 3, 3],
      markWords: [undefined, 'wire', 'coils'],
      marks: [
        {
          kind: 'dim',
          a: pt(TENSION_X + 26, TENSION_TOP - TENSION_MEAN * 0.4 * 2),
          b: pt(TENSION_X + 26, TENSION_TOP + TENSION_COILS * TENSION_WIRE + TENSION_MEAN * 0.4 * 2),
          offset: -14,
          label: 'OVER LOOPS',
        },
        { kind: 'text', at: pt(200, TENSION_TOP + 20), text: 'WIRE Ø4', size: 3, align: 'left' },
        { kind: 'text', at: pt(200, TENSION_TOP + 30), text: '14 COILS CLOSED', size: 3, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 20
 * Splined shafts — external
 * ======================================================================= */

const SPLINE_CENTRE = pt(120, 120);
const SPLINE_MAJOR = 60;
const SPLINE_MINOR = 54;
const SPLINE_COUNT = 6;
const SPLINE_SIDE_Y = 120;

/** The side view of a splined shaft: tips thick, roots thin, over the run. */
function splineSideView(left: number, right: number, y: number, major: number, minor: number): Mark[] {
  return [
    { kind: 'line', style: 'outline', a: pt(left, y - major / 2), b: pt(right, y - major / 2) },
    { kind: 'line', style: 'outline', a: pt(left, y + major / 2), b: pt(right, y + major / 2) },
    { kind: 'line', style: 'thin', a: pt(left, y - minor / 2), b: pt(right, y - minor / 2) },
    { kind: 'line', style: 'thin', a: pt(left, y + minor / 2), b: pt(right, y + minor / 2) },
    { kind: 'line', style: 'outline', a: pt(left, y - major / 2), b: pt(left, y + major / 2) },
    { kind: 'line', style: 'outline', a: pt(right, y - major / 2), b: pt(right, y + major / 2) },
    centreLine(y, left, right),
  ];
}

const SPLINE_EXTERNAL: DrawTopic = {
  id: 'splined-shaft-external',
  title: 'Splined shafts (external)',
  subtitle: 'Show six splines without drawing all six along the shaft.',
  goal: 'Draw an externally splined shaft by convention: full outline for the tips, thin line for the roots, and the true tooth form only in the end view.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('SPLINED SHAFT — EXTERNAL', '20'),
  steps: [
    {
      id: 'spline-what',
      title: 'A spline is many keys',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 210 },
      tip: 'One key carries the drive at one point. Six splines carry it at six, so the shaft can be smaller.',
      lines: [
        { text: 'You already know the key and the keyway.' },
        { text: 'A spline is the same idea, but many keys, cut into the shaft itself.' },
        { text: 'Six of them, evenly round the shaft.' },
        { text: 'Six teeth share the drive, so each one works less and nothing shears off.' },
        { text: 'And the hub can still slide along, which is exactly what a gearbox needs.' },
      ],
      marks: [],
    },
    {
      id: 'spline-circles',
      title: 'Two circles first',
      tool: 'compass',
      compassRadius: SPLINE_MAJOR / 2,
      focus: { at: SPLINE_CENTRE, r: 60 },
      tip: 'Major diameter is the tips of the splines. Minor diameter is the bottom of the spaces.',
      lines: [
        { text: 'Start the end view with two circles.' },
        { text: 'The big one is the major diameter — the tips of the splines.', at: SPLINE_CENTRE, label: 'Ø60 major' },
        { text: 'The small one is the minor diameter — the root, the bottom of the spaces.' },
        { text: 'Sixty and fifty-four. The splines stand three millimetres proud.' },
      ],
      markLines: [1, 2, 0, 0],
      marks: [
        { kind: 'circle', style: 'construction', c: SPLINE_CENTRE, r: SPLINE_MAJOR / 2 },
        { kind: 'circle', style: 'construction', c: SPLINE_CENTRE, r: SPLINE_MINOR / 2 },
        { kind: 'line', style: 'centre', a: pt(SPLINE_CENTRE.x - 38, SPLINE_CENTRE.y), b: pt(SPLINE_CENTRE.x + 38, SPLINE_CENTRE.y) },
        { kind: 'line', style: 'centre', a: pt(SPLINE_CENTRE.x, SPLINE_CENTRE.y - 38), b: pt(SPLINE_CENTRE.x, SPLINE_CENTRE.y + 38) },
      ],
    },
    {
      id: 'spline-teeth',
      title: 'Straight-sided teeth',
      tool: 'pencil',
      focus: { at: SPLINE_CENTRE, r: 55 },
      tip: 'The flanks of a straight-sided spline are parallel to the tooth centre line — they are not radial.',
      lines: [
        { text: 'Now the teeth. Six of them, sixty degrees apart.' },
        { text: 'Here is the part people get wrong.' },
        { text: 'The sides of the tooth are parallel to each other.' },
        { text: 'They do not point at the centre. They are straight-sided.' },
        { text: 'Each tooth stands on the root circle and is capped by the major circle.' },
      ],
      // Four marks make one tooth — two flanks and two arcs. The first is drawn
      // as he introduces them, the rest across the three sentences that explain
      // the form, so a tooth appears on every point he makes about it.
      markLines: Array.from({ length: SPLINE_COUNT * 4 }, (_, index) => {
        const tooth = Math.floor(index / 4);
        if (tooth === 0) return 0;
        return tooth < 3 ? 2 : tooth < 5 ? 3 : 4;
      }),
      marks: externalSplineEndView({
        centre: SPLINE_CENTRE,
        majorDiameter: SPLINE_MAJOR,
        minorDiameter: SPLINE_MINOR,
        count: SPLINE_COUNT,
      }),
    },
    {
      id: 'spline-side',
      title: 'The side view is easy',
      tool: 'tsquare',
      teeY: SPLINE_SIDE_Y - SPLINE_MAJOR / 2,
      focus: { at: pt(280, SPLINE_SIDE_Y), r: 90 },
      tip: 'In the side view the splines are shown by the two diameters only, not by every tooth.',
      lines: [
        { text: 'Along the shaft you do not draw all six splines. Nobody does.' },
        { text: 'Thick line for the tips, top and bottom.', at: pt(280, SPLINE_SIDE_Y - SPLINE_MAJOR / 2) },
        { text: 'Thin line just inside it for the roots.' },
        { text: 'That is the whole convention. Two thick, two thin, and the end view tells the rest.' },
      ],
      markLines: [1, 1, 2, 2, 0, 0, 0],
      marks: splineSideView(225, 340, SPLINE_SIDE_Y, SPLINE_MAJOR, SPLINE_MINOR),
    },
    {
      id: 'spline-dims',
      title: 'Call it out properly',
      tool: 'pencil',
      focus: { at: pt(230, 190), r: 170 },
      tip: 'A spline is specified by a note — number of splines, major and minor diameter, and the width.',
      lines: [
        { text: 'You cannot dimension six teeth one at a time. Use a note.' },
        { text: 'Six splines. Major diameter sixty. Minor fifty-four. Width fifteen.' },
        { text: 'Written once, under the view. That is how the standard wants it.' },
      ],
      markLines: [1, 1, 2],
      markWords: [undefined, 'six'],
      marks: [
        { kind: 'dim', a: pt(SPLINE_CENTRE.x - SPLINE_MAJOR / 2, SPLINE_CENTRE.y), b: pt(SPLINE_CENTRE.x + SPLINE_MAJOR / 2, SPLINE_CENTRE.y), offset: 46, label: 'Ø60' },
        { kind: 'text', at: pt(120, 190), text: '6 SPLINES', size: 3.2, align: 'center', bold: true },
        { kind: 'text', at: pt(120, 200), text: 'Ø60 MAJOR × Ø54 MINOR × 15 WIDE', size: 2.8, align: 'center' },
      ],
    },
  ],
};

/* ========================================================================= 21
 * Splined shafts — internal
 * ======================================================================= */

const HUB_CENTRE = pt(120, 120);
const HUB_OUTSIDE = 86;

const SPLINE_INTERNAL: DrawTopic = {
  id: 'splined-shaft-internal',
  title: 'Splined shafts (internal)',
  subtitle: 'The hub the splined shaft slides into.',
  goal: 'Draw an internal spline — the mating hub — and show it in section with the teeth and the shaft it accepts.',
  minutes: 30,
  level: 'Exam',
  tools: ['Compass', 'T-square', 'HB pencil'],
  base: preparedSheet('SPLINED HUB — INTERNAL', '21'),
  steps: [
    {
      id: 'internal-idea',
      title: 'The other half of the joint',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 210 },
      tip: 'Internal splines are cut in the hub; external splines are cut on the shaft. They must match.',
      lines: [
        { text: 'A splined shaft is no use on its own. Something has to slide onto it.' },
        { text: 'That something is the hub — a gear, a coupling, a propshaft yoke.' },
        { text: 'Its bore is splined too, but inside out.' },
        { text: 'Where the shaft has a tooth, the hub has a space.' },
        { text: 'Same number, same diameters, or they will not go together.' },
      ],
      marks: [],
    },
    {
      id: 'internal-bore',
      title: 'Hub and bore',
      tool: 'compass',
      compassRadius: HUB_OUTSIDE / 2,
      focus: { at: HUB_CENTRE, r: 70 },
      tip: 'Draw the outside of the hub first, then the splined bore inside it.',
      lines: [
        { text: 'Outside of the hub first — eighty-six diameter.' },
        { text: 'Centre lines through it, both ways.' },
        { text: 'Then the two spline circles inside, exactly as on the shaft.' },
      ],
      marks: [
        { kind: 'circle', style: 'outline', c: HUB_CENTRE, r: HUB_OUTSIDE / 2 },
        { kind: 'line', style: 'centre', a: pt(HUB_CENTRE.x - 50, HUB_CENTRE.y), b: pt(HUB_CENTRE.x + 50, HUB_CENTRE.y) },
        { kind: 'line', style: 'centre', a: pt(HUB_CENTRE.x, HUB_CENTRE.y - 50), b: pt(HUB_CENTRE.x, HUB_CENTRE.y + 50) },
      ],
    },
    {
      id: 'internal-teeth',
      title: 'Teeth into the bore',
      tool: 'pencil',
      focus: { at: HUB_CENTRE, r: 55 },
      tip: 'In the hub the minor diameter is the tips of its teeth — the opposite way round to the shaft.',
      lines: [
        { text: 'Now the splines, pointing inwards.' },
        { text: 'On the shaft the tips were the big circle.' },
        { text: 'In the hub the tips are the small circle. It is turned inside out.' },
        { text: 'Six spaces to take the six splines, and they must line up.' },
      ],
      marks: internalSplineEndView({
        centre: HUB_CENTRE,
        majorDiameter: SPLINE_MAJOR,
        minorDiameter: SPLINE_MINOR,
        count: SPLINE_COUNT,
        hubDiameter: HUB_OUTSIDE,
      }),
    },
    {
      id: 'internal-section',
      title: 'Section through the hub',
      tool: 'tsquare',
      teeY: 120 - HUB_OUTSIDE / 2,
      focus: { at: pt(290, 120), r: 90 },
      tip: 'Hatch the metal of the hub. The splined bore is a hole — leave it clear.',
      lines: [
        { text: 'Cut the hub in half and look at it from the side.' },
        { text: 'The bore shows as two lines, the width of the minor diameter.' },
        { text: 'Hatch the metal each side of the bore.', at: pt(290, 96) },
        { text: 'The hole itself is never hatched. There is no metal in a hole.' },
      ],
      marks: [
        ...hatchRect(250, 120 - HUB_OUTSIDE / 2, 80, (HUB_OUTSIDE - SPLINE_MINOR) / 2),
        ...hatchRect(250, 120 + SPLINE_MINOR / 2, 80, (HUB_OUTSIDE - SPLINE_MINOR) / 2),
        { kind: 'poly', style: 'outline', points: [
          pt(250, 120 - HUB_OUTSIDE / 2),
          pt(330, 120 - HUB_OUTSIDE / 2),
          pt(330, 120 + HUB_OUTSIDE / 2),
          pt(250, 120 + HUB_OUTSIDE / 2),
        ], close: true },
        { kind: 'line', style: 'outline', a: pt(250, 120 - SPLINE_MINOR / 2), b: pt(330, 120 - SPLINE_MINOR / 2) },
        { kind: 'line', style: 'outline', a: pt(250, 120 + SPLINE_MINOR / 2), b: pt(330, 120 + SPLINE_MINOR / 2) },
        { kind: 'line', style: 'thin', a: pt(250, 120 - SPLINE_MAJOR / 2), b: pt(330, 120 - SPLINE_MAJOR / 2) },
        { kind: 'line', style: 'thin', a: pt(250, 120 + SPLINE_MAJOR / 2), b: pt(330, 120 + SPLINE_MAJOR / 2) },
        centreLine(120, 250, 330),
      ],
    },
    {
      id: 'internal-note',
      title: 'Match the note to the shaft',
      tool: 'pencil',
      focus: { at: pt(180, 190), r: 160 },
      tip: 'The hub note repeats the shaft note. If the two notes disagree, the parts will not assemble.',
      lines: [
        { text: 'The note on the hub says the same thing as the note on the shaft.' },
        { text: 'Six splines, sixty major, fifty-four minor.' },
        { text: 'If the two drawings disagree, the parts will not go together.' },
        { text: 'And you will only find out on the bench, which is far too late.' },
      ],
      marks: [
        { kind: 'text', at: pt(120, 190), text: '6 SPLINES INTERNAL', size: 3.2, align: 'center', bold: true },
        { kind: 'text', at: pt(120, 200), text: 'TO SUIT SHAFT DRG 20', size: 2.8, align: 'center' },
      ],
    },
  ],
};

/* ========================================================================= 22
 * Serrated shafts — external
 * ======================================================================= */

const SERR_CENTRE = pt(120, 118);
const SERR_MAJOR = 62;
const SERR_MINOR = 54;
const SERR_COUNT = 30;

const SERRATION_EXTERNAL: DrawTopic = {
  id: 'serrated-shaft-external',
  title: 'Serrated shafts (external)',
  subtitle: 'Fine vee teeth, and only a few of them drawn.',
  goal: 'Draw an externally serrated shaft, show a few teeth at the ends and leave the rest to the note, and say where serrations are used instead of splines.',
  minutes: 25,
  level: 'Exam',
  tools: ['Compass', 'T-square', 'HB pencil'],
  base: preparedSheet('SERRATED SHAFT — EXTERNAL', '22'),
  steps: [
    {
      id: 'serration-idea',
      title: 'Splines gone fine',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 210 },
      tip: 'Serrations are vee teeth at 60°, used where a part must be set at any angle and clamped.',
      lines: [
        { text: 'Serrations are splines gone fine.' },
        { text: 'Instead of six square teeth you get thirty little vees.' },
        { text: 'The vee is sixty degrees included — the same angle as a thread.' },
        { text: 'Thirty teeth means you can set a part at any of thirty positions.' },
        { text: 'That is why a steering drop arm is serrated, not splined.' },
      ],
      marks: [],
    },
    {
      id: 'serration-circles',
      title: 'Root and crest circles',
      tool: 'compass',
      compassRadius: SERR_MAJOR / 2,
      focus: { at: SERR_CENTRE, r: 60 },
      tip: 'Serration teeth are small: the difference between the two circles is only a few millimetres.',
      lines: [
        { text: 'Two circles again — crest and root.' },
        { text: 'Sixty-two and fifty-four. Only four millimetres of tooth.' },
        { text: 'They are meant to be small. Serrations grip, they do not carry big torque alone.' },
      ],
      marks: [
        { kind: 'circle', style: 'construction', c: SERR_CENTRE, r: SERR_MAJOR / 2 },
        { kind: 'circle', style: 'construction', c: SERR_CENTRE, r: SERR_MINOR / 2 },
        { kind: 'line', style: 'centre', a: pt(SERR_CENTRE.x - 40, SERR_CENTRE.y), b: pt(SERR_CENTRE.x + 40, SERR_CENTRE.y) },
        { kind: 'line', style: 'centre', a: pt(SERR_CENTRE.x, SERR_CENTRE.y - 40), b: pt(SERR_CENTRE.x, SERR_CENTRE.y + 40) },
      ],
    },
    {
      id: 'serration-teeth',
      title: 'Thirty vee teeth',
      tool: 'pencil',
      focus: { at: SERR_CENTRE, r: 50 },
      tip: 'Each tooth is a triangle standing on the root circle with its point on the crest circle.',
      lines: [
        { text: 'Every tooth is a triangle.' },
        { text: 'It stands on the root circle and its point touches the crest circle.' },
        { text: 'Twelve degrees apart, all the way round.' },
        { text: 'In the exam you may show a few and note the rest — but here we draw them all.' },
      ],
      marks: serrationEndView(SERR_CENTRE, SERR_MAJOR, SERR_MINOR, SERR_COUNT),
    },
    {
      id: 'serration-side',
      title: 'Along the shaft',
      tool: 'tsquare',
      teeY: 118 - SERR_MAJOR / 2,
      focus: { at: pt(285, 118), r: 90 },
      tip: 'Show two or three teeth at each end of the serrated length and leave the middle plain.',
      lines: [
        { text: 'In the side view, thick lines for the crests and thin for the roots.' },
        { text: 'Then show two or three teeth at each end of the serrated length.', at: pt(240, 118 - SERR_MAJOR / 2) },
        { text: 'Leave the middle plain. Nobody wants to draw thirty teeth twice.' },
      ],
      marks: [
        ...splineSideView(225, 345, 118, SERR_MAJOR, SERR_MINOR),
        ...Array.from({ length: 6 }, (_, index): Mark => ({
          kind: 'line',
          style: 'thin',
          a: pt(228 + index * 4, 118 - SERR_MAJOR / 2),
          b: pt(228 + index * 4, 118 - SERR_MINOR / 2),
        })),
        ...Array.from({ length: 6 }, (_, index): Mark => ({
          kind: 'line',
          style: 'thin',
          a: pt(318 + index * 4, 118 - SERR_MAJOR / 2),
          b: pt(318 + index * 4, 118 - SERR_MINOR / 2),
        })),
      ],
    },
    {
      id: 'serration-note',
      title: 'Note it, do not dimension it',
      tool: 'pencil',
      focus: { at: pt(180, 185), r: 160 },
      tip: 'Thirty serrations at 60° included — one note says everything a tooth-by-tooth dimension could not.',
      lines: [
        { text: 'Thirty serrations. Sixty degrees included angle.' },
        { text: 'Crest sixty-two, root fifty-four.' },
        { text: 'One note. You would never finish dimensioning thirty teeth.' },
      ],
      marks: [
        { kind: 'text', at: pt(120, 178), text: '30 SERRATIONS', size: 3.2, align: 'center', bold: true },
        { kind: 'text', at: pt(120, 188), text: '60° INCLUDED · Ø62 CREST · Ø54 ROOT', size: 2.8, align: 'center' },
      ],
    },
  ],
};

/* ========================================================================= 23
 * Serrated shafts — internal
 * ======================================================================= */

const SERRATION_INTERNAL: DrawTopic = {
  id: 'serrated-shaft-internal',
  title: 'Serrated shafts (internal)',
  subtitle: 'The serrated eye that clamps onto the shaft.',
  goal: 'Draw an internally serrated boss, show the split and clamp bolt that lets it be set at any tooth, and section it correctly.',
  minutes: 25,
  level: 'Exam',
  tools: ['Compass', 'T-square', 'HB pencil'],
  base: preparedSheet('SERRATED BOSS — INTERNAL', '23'),
  steps: [
    {
      id: 'internal-serration-idea',
      title: 'Where you have met one',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 210 },
      tip: 'A steering drop arm has an internal serration and a clamp bolt — that is how the steering is set.',
      lines: [
        { text: 'Look at a steering box drop arm. It has a serrated eye.' },
        { text: 'The arm can go on at any tooth, so the steering can be set straight.' },
        { text: 'Then a bolt pulls the split closed and clamps it.' },
        { text: 'Same teeth as the shaft, cut inside the boss instead.' },
      ],
      marks: [],
    },
    {
      id: 'internal-serration-boss',
      title: 'Draw the boss',
      tool: 'compass',
      compassRadius: 46,
      focus: { at: pt(120, 118), r: 70 },
      tip: 'The boss wall must be thick enough that the clamp does not split it.',
      lines: [
        { text: 'Outside of the boss, ninety-two diameter.' },
        { text: 'Centre lines both ways.' },
        { text: 'Then the two serration circles inside it.' },
      ],
      marks: [
        { kind: 'circle', style: 'outline', c: pt(120, 118), r: 46 },
        { kind: 'line', style: 'centre', a: pt(66, 118), b: pt(174, 118) },
        { kind: 'line', style: 'centre', a: pt(120, 64), b: pt(120, 172) },
      ],
    },
    {
      id: 'internal-serration-teeth',
      title: 'Teeth in the eye',
      tool: 'pencil',
      focus: { at: pt(120, 118), r: 52 },
      tip: 'In the boss the teeth point inwards — the crest circle is the smaller of the two.',
      lines: [
        { text: 'Thirty vee teeth again, pointing inwards this time.' },
        { text: 'Crest circle is the small one now, root is the big one.' },
        { text: 'They must match the shaft exactly, tooth for tooth.' },
      ],
      marks: serrationEndView(pt(120, 118), SERR_MAJOR, SERR_MINOR, SERR_COUNT),
    },
    {
      id: 'internal-serration-clamp',
      title: 'Split it and bolt it',
      tool: 'tsquare',
      teeY: 88,
      focus: { at: pt(120, 80), r: 60 },
      tip: 'The split must run right through into the bore, or the clamp cannot close.',
      lines: [
        { text: 'Now the split. A saw cut from the outside right through into the bore.' },
        { text: 'If it does not reach the bore, nothing can move and nothing can clamp.' },
        { text: 'A lug each side of the cut, and a bolt through them.', at: pt(120, 68) },
        { text: 'Tighten the bolt, the gap closes, the teeth grip.' },
      ],
      marks: [
        { kind: 'line', style: 'outline', a: pt(117, 118 - 46), b: pt(117, 118 - SERR_MINOR / 2) },
        { kind: 'line', style: 'outline', a: pt(123, 118 - 46), b: pt(123, 118 - SERR_MINOR / 2) },
        { kind: 'poly', style: 'outline', close: true, points: [pt(104, 72), pt(117, 72), pt(117, 60), pt(104, 60)] },
        { kind: 'poly', style: 'outline', close: true, points: [pt(123, 72), pt(136, 72), pt(136, 60), pt(123, 60)] },
        { kind: 'line', style: 'centre', a: pt(98, 66), b: pt(142, 66) },
        { kind: 'circle', style: 'hidden', c: pt(110, 66), r: 4 },
        { kind: 'circle', style: 'hidden', c: pt(130, 66), r: 4 },
        { kind: 'text', at: pt(148, 66), text: 'M8 CLAMP BOLT', size: 2.8, align: 'left', baseline: 'middle' },
      ],
    },
    {
      id: 'internal-serration-section',
      title: 'Section and note',
      tool: 'pencil',
      focus: { at: pt(290, 120), r: 90 },
      tip: 'Two mating serrated parts are hatched in opposite directions so the joint between them can be seen.',
      lines: [
        { text: 'Cut it through and hatch the metal of the boss.' },
        { text: 'When you show the shaft in the same section, hatch it the other way.' },
        { text: 'Opposite hatching is how the eye separates two parts at a joint.' },
        { text: 'Then the note: thirty serrations, to suit the shaft drawing.' },
      ],
      marks: [
        ...hatchRect(250, 118 - 46, 80, 46 - SERR_MINOR / 2),
        ...hatchRect(250, 118 + SERR_MINOR / 2, 80, 46 - SERR_MINOR / 2, 135),
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(250, 118 - 46), pt(330, 118 - 46), pt(330, 118 + 46), pt(250, 118 + 46),
        ] },
        { kind: 'line', style: 'outline', a: pt(250, 118 - SERR_MINOR / 2), b: pt(330, 118 - SERR_MINOR / 2) },
        { kind: 'line', style: 'outline', a: pt(250, 118 + SERR_MINOR / 2), b: pt(330, 118 + SERR_MINOR / 2) },
        centreLine(118, 250, 330),
        { kind: 'text', at: pt(120, 182), text: '30 SERRATIONS INTERNAL', size: 3, align: 'center', bold: true },
      ],
    },
  ],
};

export const MACHINE_ELEMENT_TOPICS: DrawTopic[] = [
  BARS,
  TUBES,
  SHAFTS,
  COMPRESSION_SPRINGS,
  TENSION_SPRINGS,
  SPLINE_EXTERNAL,
  SPLINE_INTERNAL,
  SERRATION_EXTERNAL,
  SERRATION_INTERNAL,
];
