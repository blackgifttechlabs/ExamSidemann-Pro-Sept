/**
 * Scale drawings.
 *
 * Six sheets that all answer one question: *what does one millimetre on this
 * paper stand for?* Full size, half size, twice size, two units on one bar, and
 * the two constructed scales — plain and diagonal — that a plater rules for
 * himself when the job is set out on a representative fraction his rule does
 * not carry.
 *
 * The rule that runs through all six, and the one that is examined hardest:
 * **the figures on a drawing are always the real size of the job.** Only the
 * lines change length when the scale changes.
 */

import { pt, type LineStyle, type Mark, type Pt } from '../technical-drawing/drawingGeometry';
import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import { diagonalScale, fabSheet, line, plainScale, poly, text } from './fabricationGeometry';

/* ------------------------------------------------- the part drawn three ways */

/**
 * One packing plate, 120 × 80 × 10, with a 40 bore and two 12 holes. The first
 * three lessons draw this same plate at 1:1 and at 1:2, so the only thing that
 * changes between the sheets is the scale — which is the entire point.
 */
function packingPlate(origin: Pt, s: number, style: LineStyle = 'outline'): Mark[] {
  const P = (x: number, y: number) => pt(origin.x + x * s, origin.y - y * s);
  const hole = (x: number, y: number, r: number): Mark[] => [
    { kind: 'circle', style, c: P(x, y), r: r * s },
    line(P(x - r - 4, y), P(x + r + 4, y), 'centre'),
    line(P(x, y - r - 4), P(x, y + r + 4), 'centre'),
  ];

  return [
    poly([P(0, 0), P(120, 0), P(120, 55), P(95, 80), P(0, 80)], style, true),
    ...hole(60, 40, 20),
    ...hole(20, 20, 6),
    ...hole(100, 20, 6),
  ];
}

/** The washer the enlargement sheet is drawn from: 30 outside, 12 bore. */
function shimWasher(centre: Pt, s: number): Mark[] {
  return [
    { kind: 'circle', style: 'outline', c: centre, r: 15 * s },
    { kind: 'circle', style: 'outline', c: centre, r: 6 * s },
    line(pt(centre.x - 19 * s, centre.y), pt(centre.x + 19 * s, centre.y), 'centre'),
    line(pt(centre.x, centre.y - 19 * s), pt(centre.x, centre.y + 19 * s), 'centre'),
    // The 3 mm tongue that stops the shim turning in its housing.
    poly(
      [
        pt(centre.x - 1.5 * s, centre.y - 6 * s),
        pt(centre.x - 1.5 * s, centre.y - 9 * s),
        pt(centre.x + 1.5 * s, centre.y - 9 * s),
        pt(centre.x + 1.5 * s, centre.y - 6 * s),
      ],
      'outline'
    ),
  ];
}

/* ==========================================================================
 * 1 — Full size, 1:1
 * ======================================================================== */

const FULL_ORIGIN = pt(75, 165);

const FULL_SIZE: DrawTopic = {
  id: 'scale-full-size',
  title: 'Full size (1:1)',
  subtitle: 'The drawing and the job are the same length. Start here.',
  goal: 'Draw a packing plate full size, fill in the scale box, and understand what a representative fraction of 1/1 means.',
  minutes: 30,
  level: 'Start here',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'PACKING PLATE — FULL SIZE', number: 'F-01', scale: '1:1' }),
  steps: [
    {
      id: 'full-idea',
      title: 'What a scale actually says',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 160 },
      tip: 'A scale is a ratio: drawing : job. 1:1 is full size, 1:2 is half size, 2:1 is twice size. The first number is always the paper.',
      lines: [
        { text: 'Every drawing carries a scale, in a box in the corner. Never leave it blank.' },
        { text: 'A scale is a ratio. Drawing, to job. In that order, always.' },
        { text: 'One to one means one millimetre on the paper is one millimetre on the plate.' },
        { text: 'Lay the drawing on the plate and they match. That is full size.' },
        { text: 'You will also see it written as a representative fraction. RF equals one over one.' },
        { text: 'Same thing, said the way a surveyor says it.' },
        { text: 'Today the job is a packing plate. One twenty by eighty, ten thick.' },
      ],
      marks: [],
    },
    {
      id: 'full-outline',
      title: 'Draw the plate, measurement for measurement',
      tool: 'tsquare',
      teeY: FULL_ORIGIN.y,
      focus: { at: pt(135, 125), r: 84 },
      tip: 'At 1:1 you read the sizes straight off the ordinary side of your rule. No arithmetic anywhere.',
      lines: [
        { text: 'Base line first, and the left-hand edge square up from it.' },
        { text: 'One hundred and twenty along. Read it straight off your rule — no working out.' },
        { text: 'Eighty up.' },
        { text: 'Now the corner is taken off. Twenty five back along the top, twenty five down the side.' },
        { text: 'Join those two and you have the chamfer.' },
        { text: 'That is the outline. Every line on the paper is the length it is on the plate.' },
      ],
      markLines: [0, 1, 2, 4],
      marks: [poly([
        pt(FULL_ORIGIN.x, FULL_ORIGIN.y),
        pt(FULL_ORIGIN.x + 120, FULL_ORIGIN.y),
        pt(FULL_ORIGIN.x + 120, FULL_ORIGIN.y - 55),
        pt(FULL_ORIGIN.x + 95, FULL_ORIGIN.y - 80),
        pt(FULL_ORIGIN.x, FULL_ORIGIN.y - 80),
      ], 'outline', true)],
    },
    {
      id: 'full-holes',
      title: 'The bore and the fixing holes',
      tool: 'compass',
      compassRadius: 20,
      focus: { at: pt(135, 125), r: 80 },
      tip: 'Centre lines go on before the circle, not after. The compass point wants a cross to sit in.',
      lines: [
        { text: 'Centre lines first. Sixty across, forty up — that is the middle of the plate.' },
        { text: 'Compass to twenty. Swing the forty bore.' },
        { text: 'Now the two fixing holes. Twenty in and twenty up, from each bottom corner.' },
        { text: 'Twelve diameter, so the compass comes down to six.' },
        { text: 'Centre lines on both of them as well. Every hole gets them.' },
      ],
      markLines: [0, 1, 2, 3],
      marks: packingPlate(FULL_ORIGIN, 1).slice(1),
    },
    {
      id: 'full-dimension',
      title: 'Dimension it and fill the scale box',
      tool: 'pencil',
      focus: { at: pt(150, 150), r: 110 },
      tip: 'Even at full size the figures are the job size, not the paper size. That habit is what saves you when the scale changes.',
      lines: [
        { text: 'Now dimension it. Overall length, overall height, the bore, the hole centres.' },
        { text: 'At full size the figures happen to match what you would measure on the paper.' },
        { text: 'Enjoy that, because it is the only sheet in this course where it is true.' },
        { text: 'Last thing: the scale box in the title block. Write one, colon, one.' },
        { text: 'A drawing with no scale in the box is not a drawing. It is a sketch.' },
      ],
      markLines: [0, 0, 0, 0],
      marks: [
        {
          kind: 'dim',
          a: pt(FULL_ORIGIN.x, FULL_ORIGIN.y),
          b: pt(FULL_ORIGIN.x + 120, FULL_ORIGIN.y),
          offset: -16,
          label: '120',
        },
        {
          kind: 'dim',
          a: pt(FULL_ORIGIN.x, FULL_ORIGIN.y),
          b: pt(FULL_ORIGIN.x, FULL_ORIGIN.y - 80),
          offset: 20,
          label: '80',
        },
        {
          kind: 'dim',
          a: pt(FULL_ORIGIN.x + 20, FULL_ORIGIN.y - 20),
          b: pt(FULL_ORIGIN.x + 100, FULL_ORIGIN.y - 20),
          offset: 44,
          label: '80 CRS',
        },
        text(pt(FULL_ORIGIN.x + 84, FULL_ORIGIN.y - 44), 'Ø40', 3.4, { align: 'left', bold: true }),
        text(pt(FULL_ORIGIN.x + 106, FULL_ORIGIN.y - 12), '2 × Ø12', 3, { align: 'left' }),
        text(pt(250, 60), 'SCALE 1 : 1', 5, { align: 'left', bold: true }),
        text(pt(250, 70), 'FULL SIZE', 3.2, { align: 'left', colour: '#64748b' }),
        text(pt(250, 82), 'RF = 1/1', 3.4, { align: 'left' }),
        text(pt(250, 92), 'DRAWING : JOB', 2.8, { align: 'left', colour: '#64748b' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 2 — Reduction scale, 1:2
 * ======================================================================== */

const HALF_ORIGIN = pt(95, 130);

const REDUCTION: DrawTopic = {
  id: 'scale-reduction',
  title: 'Reduction scale (1:2)',
  subtitle: 'The same plate at half size — and the figures that must not change.',
  goal: 'Draw the packing plate at 1:2, construct a 1:2 scale to measure with, and dimension it in true sizes.',
  minutes: 35,
  level: 'Basic',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'PACKING PLATE — HALF SIZE', number: 'F-02', scale: '1:2' }),
  steps: [
    {
      id: 'red-idea',
      title: 'Why anything gets reduced',
      tool: 'hand',
      focus: { at: pt(200, 130), r: 165 },
      tip: '1:2 means the drawing is half the job. A four-metre girder at 1:20 becomes 200 mm — which is the only way it goes on a sheet at all.',
      lines: [
        { text: 'Most of what a fabricator makes will not fit on a sheet of paper.' },
        { text: 'A four metre girder. A boiler. A roof truss. None of them are going on A3 at full size.' },
        { text: 'So the drawing is reduced. One to two, one to five, one to twenty, one to fifty.' },
        { text: 'One to two means the drawing is half the job.' },
        { text: 'A hundred and twenty on the plate is sixty on the paper.' },
        { text: 'Now here is the part people get wrong, and it costs plate.' },
        { text: 'The figures on the drawing do not change. They stay the real size.' },
        { text: 'You write one hundred and twenty, on a line that is sixty long. Every time.' },
      ],
      marks: [],
    },
    {
      id: 'red-scale',
      title: 'Rule yourself a 1:2 scale',
      tool: 'tsquare',
      teeY: 205,
      focus: { at: pt(150, 205), r: 95 },
      tip: 'A constructed scale saves you dividing every single dimension by two. Lay the dividers on it and step it off.',
      lines: [
        { text: 'Before drawing, rule yourself a scale. It saves halving every figure in your head.' },
        { text: 'At one to two, twenty millimetres of job is ten millimetres of paper.' },
        { text: 'So draw a bar a hundred long. That stands for two hundred of job.' },
        { text: 'Divide it into ten. Each division is twenty of job.' },
        { text: 'Number them from a zero — twenty, forty, sixty and so on.' },
        { text: 'Then take the one division to the left of zero and cut it into ten.' },
        { text: 'Now you can read down to two millimetres of job, straight off the bar.' },
      ],
      markLines: [2, 3, 4, 5],
      marks: plainScale({
        at: pt(100, 198),
        height: 9,
        units: 9,
        subUnits: 10,
        unitMm: 10,
        unitLabels: ['0', '20', '40', '60', '80', '100', '120', '140', '160', '180'],
        subLabels: ['20', '', '', '', '', '10', '', '', '', '', '0'],
        unitName: 'MILLIMETRES OF JOB',
        subName: 'mm',
      }).marks,
    },
    {
      id: 'red-plate',
      title: 'Draw the plate at half size',
      tool: 'compass',
      compassRadius: 10,
      focus: { at: pt(125, 110), r: 62 },
      tip: '120 becomes 60. 80 becomes 40. Ø40 becomes Ø20 — so the compass is set to 10, not 20.',
      lines: [
        { text: 'Same plate, half the lines. One twenty becomes sixty, eighty becomes forty.' },
        { text: 'Outline first, then the chamfer — twenty five becomes twelve and a half.' },
        { text: 'The bore is forty diameter, so on the paper it is twenty. Compass to ten.' },
        { text: 'Watch that. Halving a diameter halves the radius too. Set ten, not twenty.' },
        { text: 'And the little holes, twelve diameter, become six. Compass to three.' },
        { text: 'Small circles at half size are fiddly. Sharpen the compass lead.' },
      ],
      markLines: [0, 1, 2, 4],
      marks: packingPlate(HALF_ORIGIN, 0.5),
    },
    {
      id: 'red-dimension',
      title: 'True sizes on halved lines',
      tool: 'pencil',
      focus: { at: pt(135, 115), r: 84 },
      tip: 'Measure a dimensioned drawing with a rule and you will be wrong. Read the figure. That is what it is there for.',
      lines: [
        { text: 'Now dimension it, and remember the rule.' },
        { text: 'The overall length line is sixty long on the paper. You write one hundred and twenty.' },
        { text: 'The bore is drawn twenty across. You write forty diameter.' },
        { text: 'Anyone in the shop who scales a drawing with a rule will get it wrong.' },
        { text: 'That is why every drawing office in the world writes: do not scale the drawing.' },
        { text: 'Read the figure. Cut to the figure.' },
        { text: 'And put one to two in the scale box, so nobody is in any doubt.' },
      ],
      markLines: [1, 2, 4],
      marks: [
        {
          kind: 'dim',
          a: pt(HALF_ORIGIN.x, HALF_ORIGIN.y),
          b: pt(HALF_ORIGIN.x + 60, HALF_ORIGIN.y),
          offset: -14,
          label: '120',
        },
        {
          kind: 'dim',
          a: pt(HALF_ORIGIN.x, HALF_ORIGIN.y),
          b: pt(HALF_ORIGIN.x, HALF_ORIGIN.y - 40),
          offset: 18,
          label: '80',
        },
        text(pt(HALF_ORIGIN.x + 44, HALF_ORIGIN.y - 22), 'Ø40', 3.2, { align: 'left', bold: true }),
        text(pt(215, 96), 'DO NOT SCALE', 5, { align: 'left', bold: true }),
        text(pt(215, 106), 'THE DRAWING', 5, { align: 'left', bold: true }),
        text(pt(215, 118), 'ALL FIGURES ARE TRUE SIZE', 3, { align: 'left', colour: '#64748b' }),
        text(pt(215, 128), 'SCALE 1 : 2      RF = 1/2', 3.4, { align: 'left' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 3 — Enlargement scale, 2:1
 * ======================================================================== */

const SHIM = pt(140, 120);

const ENLARGEMENT: DrawTopic = {
  id: 'scale-enlargement',
  title: 'Enlargement scale (2:1)',
  subtitle: 'A small shim drawn twice size, so the detail can be seen and dimensioned.',
  goal: 'Draw a 30 mm shim washer at 2:1 and understand when an enlargement is the right answer.',
  minutes: 30,
  level: 'Basic',
  tools: ['Compass', 'T-square', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'LOCATING SHIM — TWICE SIZE', number: 'F-03', scale: '2:1' }),
  steps: [
    {
      id: 'enl-idea',
      title: 'When bigger than life is the right answer',
      tool: 'hand',
      focus: { at: pt(200, 130), r: 160 },
      tip: '2:1 means the drawing is twice the job. The first number is the paper, always — so 2:1 grows and 1:2 shrinks.',
      lines: [
        { text: 'Reduction is for things too big for the paper. Enlargement is the opposite problem.' },
        { text: 'Some parts are so small that at full size you cannot see the detail, let alone dimension it.' },
        { text: 'A shim. A washer. A thread form. A weld preparation.' },
        { text: 'So you draw them bigger than they are. Two to one, five to one, ten to one.' },
        { text: 'Two to one means the drawing is twice the job.' },
        { text: 'Keep the order straight. First number is the paper, second is the job.' },
        { text: 'One to two shrinks. Two to one grows. Same two numbers, opposite meanings.' },
      ],
      marks: [],
    },
    {
      id: 'enl-draw',
      title: 'Draw the shim twice size',
      tool: 'compass',
      compassRadius: 30,
      focus: { at: SHIM, r: 52 },
      tip: 'Ø30 at 2:1 is drawn Ø60, so the compass is set to 30. Double the size, double the radius.',
      lines: [
        { text: 'The shim is thirty across, with a twelve bore. Tiny.' },
        { text: 'At two to one it is drawn sixty across, with a twenty four bore.' },
        { text: 'Centre lines first, then the compass to thirty for the outside.' },
        { text: 'Down to twelve for the bore.' },
        { text: 'And the little tongue on the bottom — three wide on the job, six on the paper.' },
        { text: 'Now you can actually see it. That is the whole reason for enlarging.' },
      ],
      markLines: [2, 2, 3, 4],
      marks: shimWasher(SHIM, 2),
    },
    {
      id: 'enl-dimension',
      title: 'The figures are still the real thing',
      tool: 'pencil',
      focus: { at: pt(180, 125), r: 100 },
      tip: 'Enlarging changes nothing about the dimensioning rule: write what the part measures, not what the paper measures.',
      lines: [
        { text: 'Dimension it. And the rule has not changed one bit.' },
        { text: 'The outside circle is drawn sixty across. You write thirty diameter.' },
        { text: 'The bore is drawn twenty four. You write twelve diameter.' },
        { text: 'The tongue is drawn six wide. You write three.' },
        { text: 'Reduction, enlargement, full size — the figures always tell the truth about the job.' },
        { text: 'Only the lines lie, and the scale box is what tells you by how much.' },
      ],
      markLines: [1, 2, 3],
      marks: [
        {
          kind: 'dim',
          a: pt(SHIM.x - 30, SHIM.y),
          b: pt(SHIM.x + 30, SHIM.y),
          offset: -46,
          label: 'Ø30',
        },
        text(pt(SHIM.x + 6, SHIM.y - 6), 'Ø12', 3.2, { align: 'left', bold: true }),
        text(pt(SHIM.x + 10, SHIM.y + 20), '3 WIDE', 3, { align: 'left' }),
        text(pt(240, 176), 'SCALE 2 : 1', 5, { align: 'left', bold: true }),
        text(pt(240, 186), 'TWICE SIZE      RF = 2/1', 3.2, { align: 'left', colour: '#64748b' }),
        text(pt(240, 200), 'THE PAPER IS TWICE THE JOB.', 3, { align: 'left' }),
        text(pt(240, 209), 'THE FIGURES ARE THE JOB.', 3, { align: 'left' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 4 — Dual scale
 * ======================================================================== */

const DUAL_ZERO_X = 132;

const DUAL: DrawTopic = {
  id: 'scale-dual',
  title: 'Dual scale',
  subtitle: 'One bar, two sets of units, one common zero.',
  goal: 'Construct a comparative scale reading metres above and feet below, and use it to convert without arithmetic.',
  minutes: 35,
  level: 'Core',
  tools: ['T-square', 'Dividers', 'Scale rule', 'Calculator', 'HB and 2H pencils'],
  base: fabSheet({ title: 'DUAL (COMPARATIVE) SCALE', number: 'F-04', scale: '1:50' }),
  steps: [
    {
      id: 'dual-idea',
      title: 'A shop with two rules in it',
      tool: 'hand',
      focus: { at: pt(200, 130), r: 165 },
      tip: 'A dual or comparative scale is two scales of the same RF drawn from one zero, so a length in one unit can be read straight off in the other.',
      lines: [
        { text: 'Old drawings are in feet and inches. New drawings are in millimetres.' },
        { text: 'In a fabrication shop you will meet both, often on the same job.' },
        { text: 'So you draw one bar and put both units on it. That is a dual scale.' },
        { text: 'It is also called a comparative scale, because it compares two units directly.' },
        { text: 'One rule for both. Metres on the top, feet on the bottom, one zero shared.' },
        { text: 'Put the dividers on four metres, look underneath, and read thirteen feet.' },
        { text: 'No sums, no calculator, no mistakes at two in the morning.' },
      ],
      marks: [],
    },
    {
      id: 'dual-rf',
      title: 'Work out the two lengths',
      tool: 'pencil',
      focus: { at: pt(110, 65), r: 90 },
      tip: 'Both scales must be the same RF, or the bar lies. Here 1:50 — so 1 m draws 20 mm and 1 ft draws 6.096 mm.',
      lines: [
        { text: 'Both scales have to be the same RF, or the bar is worthless.' },
        { text: 'Take one to fifty. One metre is a thousand millimetres, so it draws twenty.' },
        { text: 'Eight metres will draw one hundred and sixty. That sets the length of the top bar.' },
        { text: 'Now the feet. One foot is nought point three oh four eight of a metre.' },
        { text: 'So one foot draws six point oh nine six millimetres.' },
        { text: 'Five feet draws thirty point four eight. That is a handy division to use.' },
        { text: 'Twenty five feet draws one hundred and fifty two point four.' },
        { text: 'Close to eight metres but not equal to it — and that is exactly the point.' },
      ],
      marks: [
        text(pt(32, 44), 'BOTH SCALES  RF = 1/50', 3.4, { align: 'left', bold: true }),
        text(pt(32, 54), '1 m  = 1000 mm  ÷ 50  = 20.0 mm', 3, { align: 'left' }),
        text(pt(32, 63), '8 m                          = 160.0 mm', 3, { align: 'left' }),
        text(pt(32, 74), '1 ft = 304.8 mm  ÷ 50 = 6.096 mm', 3, { align: 'left' }),
        text(pt(32, 83), '5 ft                          = 30.48 mm', 3, { align: 'left' }),
        text(pt(32, 92), '25 ft                        = 152.4 mm', 3, { align: 'left' }),
      ],
    },
    {
      id: 'dual-metres',
      title: 'The metre scale, above the line',
      tool: 'tsquare',
      teeY: 140,
      focus: { at: pt(190, 138), r: 105 },
      lines: [
        { text: 'Draw the metre bar. One hundred and sixty long, ten deep.' },
        { text: 'Put the zero one full unit in from the left end. Twenty millimetres in.' },
        { text: 'To the right of zero, eight divisions of twenty. Number them one to eight metres.' },
        { text: 'To the left of zero, that spare unit gets cut into ten.' },
        { text: 'Each of those is a decimetre. A tenth of a metre.' },
        { text: 'That is why the spare unit is always on the left. It is where the small readings live.' },
      ],
      markLines: [0, 1, 2, 3],
      marks: plainScale({
        at: pt(DUAL_ZERO_X - 20, 130),
        height: 10,
        units: 8,
        subUnits: 10,
        unitMm: 20,
        unitLabels: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
        subLabels: ['10', '', '', '', '', '5', '', '', '', '', '0'],
        unitName: 'METRES',
        subName: 'DECIMETRES',
      }).marks,
    },
    {
      id: 'dual-feet',
      title: 'The foot scale, below the same zero',
      tool: 'tsquare',
      teeY: 175,
      focus: { at: pt(190, 172), r: 105 },
      tip: 'The two bars must share a zero and be drawn to the same RF. Then anything above the line converts to anything below it.',
      lines: [
        { text: 'Now the feet, underneath, and this is the important bit.' },
        { text: 'Its zero goes on exactly the same vertical line as the metre zero.' },
        { text: 'To the right, divisions of thirty point four eight. Each one is five feet.' },
        { text: 'Number them five, ten, fifteen, twenty, twenty five.' },
        { text: 'The spare unit on the left is cut into five, so each part is one foot.' },
        { text: 'Now try it. Come up from thirteen feet, and read four metres, near enough.' },
        { text: 'Come down from six metres and read just under twenty feet. Both directions work.' },
      ],
      markLines: [1, 2, 3, 4],
      marks: [
        ...plainScale({
          at: pt(DUAL_ZERO_X - 30.48, 165),
          height: 10,
          units: 5,
          subUnits: 5,
          unitMm: 30.48,
          unitLabels: ['0', '5', '10', '15', '20', '25'],
          subLabels: ['5', '4', '3', '2', '1', '0'],
          unitName: 'FEET',
          subName: 'FEET',
        }).marks,
        line(pt(DUAL_ZERO_X, 122), pt(DUAL_ZERO_X, 183), 'phantom'),
        text(pt(DUAL_ZERO_X, 118), 'COMMON ZERO', 2.8, { colour: '#6d28d9' }),
        line(pt(DUAL_ZERO_X + 79.25, 140), pt(DUAL_ZERO_X + 79.25, 165), 'construction'),
        text(pt(DUAL_ZERO_X + 79.25, 155), '13 ft ≈ 3.96 m', 2.8, { colour: '#1d4ed8' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 5 — Diagonal scale
 * ======================================================================== */

const DIAGONAL = diagonalScale({
  at: pt(70, 90),
  height: 30,
  units: 6,
  unitMm: 20,
  unitLabels: ['0', '1', '2', '3', '4', '5', '6'],
  unitName: 'METRES',
  subName: 'DECIMETRES',
  hundredthName: 'CENTIMETRES',
});

const DIAGONAL_SCALE: DrawTopic = {
  id: 'scale-diagonal',
  title: 'Diagonal scale',
  subtitle: 'Three orders of size off one bar — metres, decimetres and centimetres.',
  goal: 'Construct a diagonal scale of RF 1/50 reading to 6 m, and read 4.56 m off it.',
  minutes: 40,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Dividers', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'DIAGONAL SCALE 1:50', number: 'F-05', scale: '1:50' }),
  steps: [
    {
      id: 'diag-idea',
      title: 'Where a plain scale runs out',
      tool: 'hand',
      focus: { at: pt(200, 120), r: 165 },
      tip: 'A plain scale reads two orders — units and tenths. A diagonal scale reads three — units, tenths and hundredths.',
      lines: [
        { text: 'A plain scale gives you two things. Whole units, and tenths of a unit.' },
        { text: 'Metres and decimetres. That is as far as it goes.' },
        { text: 'To read a hundredth as well, you would have to cut a two millimetre space into ten.' },
        { text: 'You cannot. Not with a pencil, and not with your eyes.' },
        { text: 'So instead of cutting it sideways, you cut it upwards. That is the diagonal scale.' },
        { text: 'It gives three orders. Metres, decimetres and centimetres, all off one bar.' },
        { text: 'It is the neatest thing in the whole of scale drawing. Watch how it works.' },
      ],
      marks: [],
    },
    {
      id: 'diag-frame',
      title: 'The rectangle and the units',
      tool: 'tsquare',
      teeY: 120,
      focus: { at: pt(150, 105), r: 95 },
      tip: 'RF 1/50: one metre draws 20 mm. Six metres plus one spare unit is 140 mm of bar.',
      lines: [
        { text: 'One to fifty again, so a metre draws twenty.' },
        { text: 'We want six metres, plus one spare unit on the left. A hundred and forty long.' },
        { text: 'And thirty deep. The depth matters here — it is doing work.' },
        { text: 'Draw the rectangle.' },
        { text: 'Zero goes twenty in from the left. Then six divisions of twenty to the right.' },
        { text: 'Number them, one metre to six.' },
      ],
      markLines: [3, 4, 4],
      marks: DIAGONAL.frame,
    },
    {
      id: 'diag-tenths',
      title: 'Ten rows and ten columns',
      tool: 'set45',
      focus: { at: pt(95, 105), r: 60 },
      tip: 'Ten equal horizontals and ten equal parts of the sub-unit. Both tens are essential — one gives the tenths, the other the hundredths.',
      lines: [
        { text: 'Now cut the depth into ten. Ten equal strips, right across the bar.' },
        { text: 'Then take the spare unit on the left, and cut it into ten too.' },
        { text: 'Do it on the bottom line, and again on the top line, so the marks are directly above one another.' },
        { text: 'Each of those is a decimetre — a tenth of a metre.' },
        { text: 'So far this is only a plain scale with lines across it. The next step is what changes that.' },
      ],
      markLines: [0, 1, 2],
      marks: DIAGONAL.tenths,
    },
    {
      id: 'diag-diagonals',
      title: 'The diagonals, and why they work',
      tool: 'set45',
      focus: { at: pt(85, 105), r: 52 },
      tip: 'Each diagonal runs from a division on the bottom to the NEXT division on the top. Over the full height it walks left by one tenth of a sub-unit.',
      lines: [
        { text: 'Here is the trick. The diagonals do not go corner to corner.' },
        { text: 'Each one runs from a mark on the bottom line, to the next mark along on the top line.' },
        { text: 'So from zero on the bottom, up to the first decimetre mark on the top.' },
        { text: 'From the first on the bottom, to the second on the top. And so on.' },
        { text: 'Now think about what that does. Over the full height, the line slides across by one decimetre.' },
        { text: 'The height is ten strips. So each strip slides it by a tenth of a decimetre.' },
        { text: 'A tenth of a decimetre is a centimetre. There they are. Ten of them, stacked up.' },
      ],
      marks: [...DIAGONAL.diagonals, ...DIAGONAL.labels],
    },
    {
      id: 'diag-read',
      title: 'Read four point five six metres',
      tool: 'pencil',
      focus: { at: pt(130, 105), r: 78 },
      tip: 'Whole units from the right of zero, tenths from the left of zero, hundredths from how far UP you are.',
      lines: [
        { text: 'Let us read four point five six metres off it.' },
        { text: 'Four whole metres. So one point of the dividers goes on the four.' },
        { text: 'Five decimetres. So the other point is on the fifth diagonal, left of zero.' },
        { text: 'And six centimetres. So you take both of those readings on the sixth line up.' },
        { text: 'Not the bottom line. The sixth one up.' },
        { text: 'Open the dividers between those two points, on that line, and that is four point five six.' },
        { text: 'Whole units to the right, tenths to the left, hundredths by how high you go.' },
        { text: 'Say that to yourself in the exam and you cannot get it wrong.' },
      ],
      markLines: [1, 2, 3, 5],
      marks: [
        line(pt(DIAGONAL.zeroX + 4 * 20, 120), pt(DIAGONAL.zeroX + 4 * 20, 90), 'construction'),
        line(pt(70, DIAGONAL.rows[6]), pt(210, DIAGONAL.rows[6]), 'construction'),
        {
          kind: 'dot',
          style: 'outline',
          at: pt(DIAGONAL.zeroX + 4 * 20, DIAGONAL.rows[6]),
        },
        {
          kind: 'dot',
          style: 'outline',
          at: pt(DIAGONAL.zeroX - 5 * DIAGONAL.subMm - (6 / 10) * DIAGONAL.subMm, DIAGONAL.rows[6]),
        },
        {
          kind: 'dim',
          a: pt(DIAGONAL.zeroX - 5 * DIAGONAL.subMm - (6 / 10) * DIAGONAL.subMm, DIAGONAL.rows[6]),
          b: pt(DIAGONAL.zeroX + 4 * 20, DIAGONAL.rows[6]),
          offset: 34,
          label: '4.56 m',
        },
        text(pt(240, 100), 'READ IT LIKE THIS', 3.6, { align: 'left', bold: true }),
        text(pt(240, 111), 'WHOLE METRES   RIGHT OF ZERO', 3, { align: 'left' }),
        text(pt(240, 120), 'DECIMETRES        LEFT OF ZERO', 3, { align: 'left' }),
        text(pt(240, 129), 'CENTIMETRES     HOW FAR UP', 3, { align: 'left' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 6 — Plain scale
 * ======================================================================== */

const PLAIN = plainScale({
  at: pt(90, 110),
  height: 12,
  units: 6,
  subUnits: 10,
  unitMm: 20,
  unitLabels: ['0', '1', '2', '3', '4', '5', '6'],
  subLabels: ['10', '', '', '', '', '5', '', '', '', '', '0'],
  unitName: 'METRES',
  subName: 'DECIMETRES',
});

const PLAIN_SCALE: DrawTopic = {
  id: 'scale-plain',
  title: 'Plain scale',
  subtitle: 'The everyday constructed scale — whole units and tenths.',
  goal: 'Construct a plain scale of RF 1/50 to read 6 m in metres and decimetres, and read 3.7 m off it.',
  minutes: 30,
  level: 'Basic',
  tools: ['T-square', 'Dividers', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'PLAIN SCALE 1:50', number: 'F-06', scale: '1:50' }),
  steps: [
    {
      id: 'plain-idea',
      title: 'When your rule has not got the scale on it',
      tool: 'hand',
      focus: { at: pt(200, 120), r: 160 },
      tip: 'RF = drawn length ÷ real length, in the same units. Work it out before you draw a single line.',
      lines: [
        { text: 'Scale rules come with the common scales on them. One to fifty, one to a hundred.' },
        { text: 'Sooner or later you get a drawing at some scale nobody sells a rule for.' },
        { text: 'Then you rule one yourself. It takes two minutes and it is examined every year.' },
        { text: 'A plain scale carries two orders of size. Whole units, and tenths of one.' },
        { text: 'Metres and decimetres. Or feet and inches. Or millimetres and tenths.' },
        { text: 'Start with the RF. Drawn length, over real length, in the same units.' },
        { text: 'One to fifty. So a metre — a thousand millimetres — is drawn twenty.' },
      ],
      marks: [],
    },
    {
      id: 'plain-length',
      title: 'How long does the bar have to be?',
      tool: 'pencil',
      focus: { at: pt(105, 55), r: 80 },
      tip: 'Draw the scale a little longer than the longest measurement on the drawing, and never shorter.',
      lines: [
        { text: 'First decide how far the scale has to read. Look at the longest size on your job.' },
        { text: 'Say six metres. So the scale reads six metres, and a bit over.' },
        { text: 'Six metres at twenty each is one hundred and twenty millimetres.' },
        { text: 'Then add one more unit on the left for the tenths. Twenty more.' },
        { text: 'One hundred and forty altogether. Write the sum down; the examiner marks it.' },
      ],
      marks: [
        text(pt(34, 44), 'RF = 1/50', 3.6, { align: 'left', bold: true }),
        text(pt(34, 54), '1 m = 1000 mm ÷ 50 = 20 mm', 3, { align: 'left' }),
        text(pt(34, 63), 'READS 6 m           = 120 mm', 3, { align: 'left' }),
        text(pt(34, 72), 'PLUS ONE SPARE UNIT = 20 mm', 3, { align: 'left' }),
        line(pt(34, 77), pt(158, 77), 'thin'),
        text(pt(34, 85), 'LENGTH OF SCALE     = 140 mm', 3.2, { align: 'left', bold: true }),
      ],
    },
    {
      id: 'plain-build',
      title: 'Rule it and divide it',
      tool: 'tsquare',
      teeY: 122,
      focus: { at: pt(160, 118), r: 92 },
      tip: 'The spare unit always goes to the LEFT of zero. That is where the tenths are read, and zero is where you start counting.',
      lines: [
        { text: 'Draw the bar. A hundred and forty long, twelve deep, and rule a line through the middle.' },
        { text: 'Put zero one unit in from the left — twenty millimetres in.' },
        { text: 'To the right, six divisions of twenty. Full-depth lines, so they stand out.' },
        { text: 'Number them from the zero. One, two, three, up to six metres.' },
        { text: 'Now the spare unit on the left. Cut it into ten equal parts.' },
        { text: 'Those are decimetres. Only mark them on the bottom half, so they read differently.' },
        { text: 'Number those from zero going left. That catches people out — they run backwards.' },
      ],
      markLines: [0, 0, 1, 2, 3, 4],
      marks: PLAIN.marks,
    },
    {
      id: 'plain-read',
      title: 'Read three point seven metres',
      tool: 'pencil',
      focus: { at: pt(150, 118), r: 78 },
      tip: 'Whole units to the right of zero, tenths to the left. One divider point in each, and the reading is between them.',
      lines: [
        { text: 'Now use it. Three point seven metres.' },
        { text: 'Three whole metres. One divider point on the three.' },
        { text: 'Seven tenths. The other point on the seventh mark, left of zero.' },
        { text: 'That is it. The distance between them is three point seven metres, at one to fifty.' },
        { text: 'Lift the dividers straight onto the drawing without ever measuring in millimetres.' },
        { text: 'And notice: the number of divisions left of zero is what limits you.' },
        { text: 'Ten of them, so you can read tenths — and no further. For hundredths you need a diagonal scale.' },
      ],
      markLines: [1, 2, 3],
      marks: [
        line(pt(PLAIN.zeroX + 3 * 20, 106), pt(PLAIN.zeroX + 3 * 20, 126), 'construction'),
        line(pt(PLAIN.zeroX - 7 * 2, 106), pt(PLAIN.zeroX - 7 * 2, 126), 'construction'),
        {
          kind: 'dim',
          a: pt(PLAIN.zeroX - 7 * 2, 122),
          b: pt(PLAIN.zeroX + 3 * 20, 122),
          offset: -22,
          label: '3.7 m',
        },
        text(pt(240, 158), 'PLAIN SCALE READS', 3.6, { align: 'left', bold: true }),
        text(pt(240, 169), 'WHOLE UNITS   RIGHT OF ZERO', 3, { align: 'left' }),
        text(pt(240, 178), 'TENTHS            LEFT OF ZERO', 3, { align: 'left' }),
        text(pt(240, 190), 'NO THIRD ORDER — FOR THAT', 3, { align: 'left', colour: '#64748b' }),
        text(pt(240, 199), 'USE A DIAGONAL SCALE.', 3, { align: 'left', colour: '#64748b' }),
      ],
    },
  ],
};

export const SCALE_TOPICS: DrawTopic[] = [
  FULL_SIZE,
  REDUCTION,
  ENLARGEMENT,
  DUAL,
  DIAGONAL_SCALE,
  PLAIN_SCALE,
];
