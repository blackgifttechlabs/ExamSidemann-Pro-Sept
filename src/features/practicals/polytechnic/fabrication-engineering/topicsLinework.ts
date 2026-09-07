/**
 * Line-work: the twelve types of line, each one drawn and named.
 *
 * A drawing is not a picture. It is a code, and the alphabet of that code is
 * the line types. A dashed line does not mean "roughly here" — it means the
 * edge is behind something. A chain line does not mean "important" — it means
 * centre. Every one of these twelve says something specific, and a marker-off
 * in the shop reads them the way you are reading this sentence.
 *
 * Each lesson draws the line on its own, letters its name, and then puts it to
 * work on a real detail — because a line type learnt off a chart is forgotten
 * by Friday.
 */

import { pt, type LineStyle, type Mark, type Pt } from '../technical-drawing/drawingGeometry';
import type { DrawStep, DrawTopic, LessonLine } from '../technical-drawing/drawingLessonTypes';
import { breakWave, hatchRect, zigzagBreak } from '../technical-drawing/drawingConventions';
import { fabSheet, freehand, line, poly, text } from './fabricationGeometry';

/* ------------------------------------------------------------ the specimen */

const SPEC_LEFT = 72;
const SPEC_RIGHT = 232;
const SPEC_Y = 66;

/** The line on its own, full length, with its name and its job lettered on. */
function specimen(name: string, job: string, style: LineStyle, extra: Mark[] = []): Mark[] {
  return [
    line(pt(SPEC_LEFT, SPEC_Y), pt(SPEC_RIGHT, SPEC_Y), style),
    ...extra,
    text(pt(SPEC_LEFT, 50), name, 5, { align: 'left', bold: true }),
    text(pt(SPEC_LEFT, 78), job, 3, { align: 'left', colour: '#64748b' }),
    line(pt(SPEC_LEFT - 6, 86), pt(SPEC_RIGHT + 6, 86), 'thin'),
  ];
}

interface LineworkSpec {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  number: string;
  /** Lettered name of the line type on the specimen strip. */
  name: string;
  /** One line saying what it is for. */
  job: string;
  style: LineStyle;
  /** Anything extra on the specimen strip beyond the plain line. */
  specimenExtra?: Mark[];
  tools?: string[];
  what: { tip: string; lines: LessonLine[] };
  draw: { title: string; tool: DrawStep['tool']; tip?: string; lines: LessonLine[]; marks?: Mark[] };
  use: {
    title: string;
    tool: DrawStep['tool'];
    tip?: string;
    focus: { at: Pt; r: number };
    lines: LessonLine[];
    marks: Mark[];
  };
}

function lineworkTopic(spec: LineworkSpec): DrawTopic {
  return {
    id: spec.id,
    title: spec.title,
    subtitle: spec.subtitle,
    goal: spec.goal,
    minutes: 20,
    level: 'Basic',
    tools: spec.tools ?? ['T-square', '45° set square', 'HB and 2H pencils'],
    base: fabSheet({ title: spec.name, number: spec.number, scale: '1:1' }),
    steps: [
      {
        id: `${spec.id}-what`,
        title: 'What this line says',
        tool: 'hand',
        focus: { at: pt(180, 120), r: 160 },
        tip: spec.what.tip,
        lines: spec.what.lines,
        marks: [],
      },
      {
        id: `${spec.id}-draw`,
        title: spec.draw.title,
        tool: spec.draw.tool,
        teeY: SPEC_Y,
        focus: { at: pt(152, 64), r: 96 },
        tip: spec.draw.tip,
        lines: spec.draw.lines,
        marks: [...specimen(spec.name, spec.job, spec.style, spec.specimenExtra), ...(spec.draw.marks ?? [])],
      },
      {
        id: `${spec.id}-use`,
        title: spec.use.title,
        tool: spec.use.tool,
        focus: spec.use.focus,
        tip: spec.use.tip,
        lines: spec.use.lines,
        marks: spec.use.marks,
      },
    ],
  };
}

/* ------------------------------------------ a plate the examples are drawn on */

/** A 90 × 60 bracket with a 30 bore, used again and again below. */
function bracket(origin: Pt, style: LineStyle = 'outline'): Mark[] {
  return [
    poly(
      [
        origin,
        pt(origin.x + 90, origin.y),
        pt(origin.x + 90, origin.y - 40),
        pt(origin.x + 65, origin.y - 60),
        pt(origin.x, origin.y - 60),
      ],
      style,
      true
    ),
    { kind: 'circle', style, c: pt(origin.x + 30, origin.y - 30), r: 15 },
  ];
}

/* ========================================================== 1 — outline */

const OUTLINE = lineworkTopic({
  id: 'line-outline',
  title: 'Outline',
  subtitle: 'Continuous thick — the edges you can actually see.',
  goal: 'Draw a continuous thick outline and see why it must be the heaviest line on the sheet.',
  number: 'F-10',
  name: 'OUTLINE',
  job: 'CONTINUOUS THICK — VISIBLE EDGES AND OUTLINES',
  style: 'outline',
  what: {
    tip: 'Outline is the only thick line on most drawings apart from the cutting plane. That weight is what makes the shape jump off the sheet.',
    lines: [
      { text: 'Start with the most important line of the lot. The outline.' },
      { text: 'Continuous, and thick. Nought point seven of a millimetre, drawn with an HB.' },
      { text: 'It shows every edge of the job you could actually see if it were in front of you.' },
      { text: 'Thick, because it has to win. A drawing is read outline first.' },
      { text: 'If your construction lines are as heavy as your outlines, nobody can see the shape.' },
      { text: 'So the pencil matters. Two H for setting out, HB for the outline.' },
      { text: 'Same hand, different pencil, and the drawing suddenly reads.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'Draw it in one steady pass and come back over it. Never sketch an outline in short strokes.',
    lines: [
      { text: 'Rule one line, a hundred and sixty long. Straight through, no breaks.' },
      { text: 'Now go over it again with the HB, to give it the weight.' },
      { text: 'One pass, steady, and keep the pencil turning so it does not go flat on one side.' },
      { text: 'Letter its name underneath. Outline. Continuous thick.' },
    ],
  },
  use: {
    title: 'Outline a bracket',
    tool: 'tsquare',
    focus: { at: pt(160, 165), r: 88 },
    tip: 'Set out light, then outline. Never try to get the shape right in a thick line.',
    lines: [
      { text: 'Now use it. Here is a bracket — ninety by sixty, with a thirty bore.' },
      { text: 'Set it out in two H first. Light lines, just enough to see.' },
      { text: 'Then come back and outline it in HB.' },
      { text: 'Every edge you could see, standing in front of the plate, gets the thick line.' },
      { text: 'Look at the difference the second pencil makes. The shape is now obvious across the room.' },
      { text: 'And leave the construction lines. They are marked. They are not a mess.' },
    ],
    marks: [
      ...bracket(pt(115, 200), 'construction'),
      ...bracket(pt(115, 200), 'outline'),
      line(pt(105, 170), pt(215, 170), 'centre'),
      line(pt(145, 130), pt(145, 210), 'centre'),
    ],
  },
});

/* ====================================================== 2 — centre line */

const CENTRE = lineworkTopic({
  id: 'line-centre',
  title: 'Centre line',
  subtitle: 'Long chain thin — the middle of every hole, bar and symmetry.',
  goal: 'Draw a long-chain centre line correctly and place it through a hole and a shaft.',
  number: 'F-11',
  name: 'CENTRE LINE',
  job: 'CHAIN THIN — CENTRES, AXES AND LINES OF SYMMETRY',
  style: 'centre',
  what: {
    tip: 'A centre line always starts and ends with a long dash, and crosses another centre line on the long dashes — never on a gap.',
    lines: [
      { text: 'A centre line is a long dash, a gap, a short dash, a gap, and round again.' },
      { text: 'Thin, and it always sticks out a few millimetres past the feature it belongs to.' },
      { text: 'It marks the middle of a hole, the axis of a bar, or a line of symmetry.' },
      { text: 'And it is not decoration. Everything on the job gets measured from it.' },
      { text: 'Two rules that get marked in every exam.' },
      { text: 'One: start and finish on a long dash. Never on a gap.' },
      { text: 'Two: where two centre lines cross, they must cross on the long dashes.' },
      { text: 'A hole whose centre lines cross in a gap has no centre. Nothing to put a compass point in.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'Long dash about 20 mm, gap about 2, short dash about 2. Keep it even down the whole line.',
    lines: [
      { text: 'Rule the line lightly first, then break it up as you go over it.' },
      { text: 'Long dash, roughly twenty. Small gap. Short dash, about two. Small gap.' },
      { text: 'And repeat. Keep the rhythm even — that is what makes it read as a centre line.' },
      { text: 'Finish on a long dash, the same as you started.' },
    ],
  },
  use: {
    title: 'Centre a hole and a shaft',
    tool: 'compass',
    focus: { at: pt(175, 165), r: 96 },
    tip: 'Centre lines go on BEFORE the circle. The compass point wants a proper cross to sit in.',
    lines: [
      { text: 'Here is a plate with a bore, and a shaft beside it.' },
      { text: 'Centre lines go on the plate first — across and down — crossing on the long dashes.' },
      { text: 'Now the compass point drops straight into that cross. That is why they go on first.' },
      { text: 'The shaft gets one centre line down its axis, the whole length.' },
      { text: 'Notice it runs a little past each end. Four or five millimetres is right.' },
      { text: 'The plate is symmetrical top to bottom, so that same line is doing two jobs.' },
      { text: 'Axis of the shaft, and line of symmetry. One line, both meanings.' },
    ],
    marks: [
      poly([pt(120, 200), pt(200, 200), pt(200, 140), pt(120, 140)], 'outline', true),
      line(pt(112, 170), pt(208, 170), 'centre'),
      line(pt(160, 132), pt(160, 208), 'centre'),
      { kind: 'circle', style: 'outline', c: pt(160, 170), r: 20 },
      line(pt(225, 158), pt(310, 158), 'outline'),
      line(pt(225, 182), pt(310, 182), 'outline'),
      line(pt(225, 158), pt(225, 182), 'outline'),
      line(pt(310, 158), pt(310, 182), 'outline'),
      line(pt(218, 170), pt(317, 170), 'centre'),
    ],
  },
});

/* =================================================== 3 — projection line */

const PROJECTION = lineworkTopic({
  id: 'line-projection',
  title: 'Projection line',
  subtitle: 'Continuous thin — carrying a point from one view into the next.',
  goal: 'Use projection lines to place a feature in a second view without measuring it again.',
  number: 'F-12',
  name: 'PROJECTION LINE',
  job: 'CONTINUOUS THIN — CARRIES A POINT BETWEEN VIEWS',
  style: 'construction',
  what: {
    tip: 'A projection line is the whole reason orthographic projection works: a feature is measured once and carried, never measured twice.',
    lines: [
      { text: 'A projection line runs from a point in one view to the same point in another.' },
      { text: 'Thin, light, and left on the sheet when the drawing is finished.' },
      { text: 'It is what makes orthographic projection work at all.' },
      { text: 'Measure a hole once, on the view where it shows best.' },
      { text: 'Then project it into the other views. Never measure it a second time.' },
      { text: 'Because if you measure it twice, sooner or later the two will not agree.' },
      { text: 'And when they do not agree, the drawing is wrong and somebody makes it wrong.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'Two H, light. It must be visible enough to work to, faint enough not to fight the outline.',
    lines: [
      { text: 'Rule it with the two H, and keep the pressure right down.' },
      { text: 'It needs to be seen, but it must never compete with an outline.' },
      { text: 'Straight through, from the point it starts at to the view it is going to.' },
      { text: 'Letter it. Projection line. Continuous thin.' },
    ],
  },
  use: {
    title: 'Carry a hole into the plan',
    tool: 'tsquare',
    focus: { at: pt(180, 175), r: 105 },
    tip: 'Project first, then draw. A feature drawn in the second view and checked afterwards is a feature drawn twice.',
    lines: [
      { text: 'Front view of a plate, with two holes in it. Plan underneath.' },
      { text: 'The hole centres are dimensioned on the front view only. That is the right place for them.' },
      { text: 'Now project both centres straight down into the plan.' },
      { text: 'Where each line lands, that is where the hole is in the plan. No measuring.' },
      { text: 'The edges get projected the same way. Left edge, right edge, both carried down.' },
      { text: 'Every view on the sheet is tied to every other one by these lines.' },
      { text: 'Leave them. An examiner wants to see how you got there.' },
    ],
    marks: [
      poly([pt(120, 175), pt(230, 175), pt(230, 130), pt(120, 130)], 'outline', true),
      { kind: 'circle', style: 'outline', c: pt(150, 152), r: 9 },
      { kind: 'circle', style: 'outline', c: pt(200, 152), r: 9 },
      line(pt(120, 175), pt(120, 245), 'construction'),
      line(pt(230, 175), pt(230, 245), 'construction'),
      line(pt(150, 175), pt(150, 245), 'construction'),
      line(pt(200, 175), pt(200, 245), 'construction'),
      poly([pt(120, 205), pt(230, 205), pt(230, 235), pt(120, 235)], 'outline', true),
      line(pt(150, 205), pt(150, 235), 'hidden'),
      line(pt(200, 205), pt(200, 235), 'hidden'),
      text(pt(175, 252), 'PLAN', 3.2, { bold: true }),
    ],
  },
});

/* ================================================= 4 — construction line */

const CONSTRUCTION = lineworkTopic({
  id: 'line-construction',
  title: 'Construction line',
  subtitle: 'Continuous thin and light — the setting out you leave on the sheet.',
  goal: 'Set a shape out in construction lines before outlining it, and leave the working showing.',
  number: 'F-13',
  name: 'CONSTRUCTION LINE',
  job: 'CONTINUOUS THIN — SETTING OUT, LEFT ON THE DRAWING',
  style: 'construction',
  tools: ['Compass', 'T-square', '2H pencil'],
  what: {
    tip: 'Construction lines are drawn in 2H and are NOT rubbed out. They are the working, and in an exam they carry marks.',
    lines: [
      { text: 'Every drawing is built twice. Once lightly, to find where things go. Once properly.' },
      { text: 'The first pass is construction lines. Two H, and light enough that you can barely see them.' },
      { text: 'Here is the part that surprises people. You do not rub them out.' },
      { text: 'In technical drawing the construction lines stay on the sheet.' },
      { text: 'They are the working, exactly like the working in a maths answer.' },
      { text: 'An examiner who cannot see how you found a point cannot give you the marks for finding it.' },
      { text: 'So set out light, outline heavy, and leave the light lines alone.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'If you can feel the pencil marking the paper, you are pressing too hard.',
    lines: [
      { text: 'Two H, sharpened to a long point, and hardly any pressure at all.' },
      { text: 'Rule the line right across.' },
      { text: 'It should be grey, not black. Just enough to work to.' },
      { text: 'Letter it. Construction line.' },
    ],
  },
  use: {
    title: 'Set out a hexagon before outlining it',
    tool: 'compass',
    focus: { at: pt(180, 170), r: 78 },
    tip: 'The circle, the diameters and the stepped-off arcs are all construction. Only the six sides get the outline.',
    lines: [
      { text: 'A hexagon across a fifty circle. Watch which lines are which.' },
      { text: 'Centre lines. Construction.' },
      { text: 'The circle it sits in. Construction — the circle is not part of the finished job.' },
      { text: 'Step the radius round the circle six times. Those arcs are construction too.' },
      { text: 'Now, and only now, join the six points with the HB.' },
      { text: 'Six thick lines. That is the whole of the outline.' },
      { text: 'Everything else stays on the sheet, pale, showing exactly how you got there.' },
    ],
    marks: [
      line(pt(140, 170), pt(220, 170), 'construction'),
      line(pt(180, 130), pt(180, 210), 'construction'),
      { kind: 'circle', style: 'construction', c: pt(180, 170), r: 30 },
      ...Array.from({ length: 6 }, (_, index) => {
        const angle = index * 60;
        return {
          kind: 'arc' as const,
          style: 'construction' as const,
          c: pt(180 + 30 * Math.cos((angle * Math.PI) / 180), 170 - 30 * Math.sin((angle * Math.PI) / 180)),
          r: 30,
          from: angle + 130,
          to: angle + 230,
        };
      }),
      poly(
        Array.from({ length: 6 }, (_, index) => {
          const angle = index * 60;
          return pt(180 + 30 * Math.cos((angle * Math.PI) / 180), 170 - 30 * Math.sin((angle * Math.PI) / 180));
        }),
        'outline',
        true
      ),
    ],
  },
});

/* ==================================================== 5 — dimension line */

const DIMENSION = lineworkTopic({
  id: 'line-dimension',
  title: 'Dimension line',
  subtitle: 'Continuous thin with arrowheads — and the figure that goes on it.',
  goal: 'Draw dimension lines with correct arrowheads, spacing and figure placement.',
  number: 'F-14',
  name: 'DIMENSION LINE',
  job: 'CONTINUOUS THIN — CARRIES A SIZE, ARROWHEAD EACH END',
  style: 'dimension',
  specimenExtra: [
    poly([pt(SPEC_LEFT, SPEC_Y), pt(SPEC_LEFT + 7, SPEC_Y - 1.4), pt(SPEC_LEFT + 7, SPEC_Y + 1.4)], 'dimension', true),
    poly([pt(SPEC_RIGHT, SPEC_Y), pt(SPEC_RIGHT - 7, SPEC_Y - 1.4), pt(SPEC_RIGHT - 7, SPEC_Y + 1.4)], 'dimension', true),
    text(pt((SPEC_LEFT + SPEC_RIGHT) / 2, SPEC_Y - 4), '160', 3.4, { bold: true, colour: '#1d4ed8' }),
  ],
  what: {
    tip: 'The figure is read from the bottom or from the right-hand side of the sheet — never upside down.',
    lines: [
      { text: 'A dimension line carries a size. Thin, with a solid arrowhead at each end.' },
      { text: 'The arrowheads are narrow — about three times as long as they are wide — and filled in.' },
      { text: 'The figure sits above the line, near the middle, and never touches it.' },
      { text: 'Read it from the bottom of the sheet, or from the right. Never upside down.' },
      { text: 'And keep dimension lines off the job. Ten millimetres clear of the outline is about right.' },
      { text: 'If you have several, step them out — the smallest nearest the job, the overall furthest away.' },
      { text: 'That way none of the arrowheads land on top of one another.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'pencil',
    tip: 'Fill the arrowheads in solid. An open arrowhead is a sketch, not a drawing.',
    lines: [
      { text: 'Thin line, right across.' },
      { text: 'Now the arrowheads. Long and narrow, and filled in solid.' },
      { text: 'Point them outwards, at the two things being measured.' },
      { text: 'And the figure, sitting just above the middle of the line.' },
    ],
  },
  use: {
    title: 'Dimension a plate properly',
    tool: 'pencil',
    focus: { at: pt(190, 175), r: 95 },
    tip: 'Smallest dimension nearest the part, overall size furthest out. Never let dimension lines cross.',
    lines: [
      { text: 'A plate, ninety by sixty, with a hole in it.' },
      { text: 'The overall length goes on first — but furthest out from the plate.' },
      { text: 'The hole position goes nearer the plate, because it is the smaller size.' },
      { text: 'Small in, big out. Then no two dimension lines have to cross.' },
      { text: 'The height goes on the side, read from the right of the sheet.' },
      { text: 'And the bore gets a diameter symbol. Thirty, with the Ø in front of it.' },
      { text: 'Six sizes, and now the plate could be made by somebody who has never seen it.' },
    ],
    marks: [
      poly([pt(140, 200), pt(230, 200), pt(230, 140), pt(140, 140)], 'outline', true),
      { kind: 'circle', style: 'outline', c: pt(170, 170), r: 15 },
      line(pt(155, 170), pt(185, 170), 'centre'),
      line(pt(170, 155), pt(170, 185), 'centre'),
      { kind: 'dim', a: pt(140, 200), b: pt(230, 200), offset: -26, label: '90' },
      { kind: 'dim', a: pt(140, 200), b: pt(170, 200), offset: -13, label: '30' },
      { kind: 'dim', a: pt(230, 200), b: pt(230, 140), offset: -18, label: '60' },
      { kind: 'dim', a: pt(140, 170), b: pt(170, 170), offset: 44, label: '30' },
      text(pt(190, 166), 'Ø30', 3.4, { align: 'left', bold: true, colour: '#1d4ed8' }),
    ],
  },
});

/* ======================================================= 6 — leader line */

const LEADER = lineworkTopic({
  id: 'line-leader',
  title: 'Leader line',
  subtitle: 'Continuous thin at an angle — pointing a note at the thing it is about.',
  goal: 'Draw leader lines with the correct termination — arrowhead on an edge, dot inside an outline.',
  number: 'F-15',
  name: 'LEADER LINE',
  job: 'CONTINUOUS THIN — TAKES A NOTE TO A FEATURE',
  style: 'dimension',
  specimenExtra: [
    line(pt(SPEC_RIGHT, SPEC_Y), pt(SPEC_RIGHT + 22, SPEC_Y - 16), 'dimension'),
    poly([pt(SPEC_LEFT, SPEC_Y), pt(SPEC_LEFT + 7, SPEC_Y - 1.4), pt(SPEC_LEFT + 7, SPEC_Y + 1.4)], 'dimension', true),
  ],
  what: {
    tip: 'Arrowhead when it lands ON a line. Dot when it lands INSIDE an outline. Nothing at all when it lands on a dimension line.',
    lines: [
      { text: 'A leader takes a note to the feature it belongs to.' },
      { text: 'Thin, drawn at an angle — thirty to sixty degrees — never straight up and never straight across.' },
      { text: 'A leader parallel to the lines around it gets lost in them.' },
      { text: 'Now the ends, because this is what is marked.' },
      { text: 'Landing on an edge or an outline, it ends in an arrowhead.' },
      { text: 'Landing inside an outline, on a face, it ends in a dot.' },
      { text: 'And at the note end, it turns into a short horizontal tail that the writing sits on.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'pencil',
    tip: 'Keep every leader on a sheet at roughly the same angle. A page of leaders at random angles looks like a mess.',
    lines: [
      { text: 'Thin line at an angle. Say forty five, or sixty.' },
      { text: 'Arrowhead on the end that points at the job.' },
      { text: 'Short horizontal tail on the other end, for the note to sit on.' },
      { text: 'Letter it. Leader line.' },
    ],
  },
  use: {
    title: 'Two leaders, two different endings',
    tool: 'pencil',
    focus: { at: pt(200, 175), r: 100 },
    tip: 'A leader must never be horizontal, vertical, or parallel to the hatching it crosses.',
    lines: [
      { text: 'Here is a plate with two drilled holes and a chamfered corner.' },
      { text: 'First leader goes to the edge of a hole. It lands on a line, so it gets an arrowhead.' },
      { text: 'The note reads: two holes, twelve diameter, drill.' },
      { text: 'One note covers both holes, because they are the same. Never letter the same note twice.' },
      { text: 'Second leader goes onto the face of the plate. It lands inside an outline, so it gets a dot.' },
      { text: 'That note reads: material, six mild steel.' },
      { text: 'Same line, two endings, and each ending tells you what is being pointed at.' },
    ],
    marks: [
      poly([pt(140, 205), pt(240, 205), pt(240, 155), pt(225, 140), pt(140, 140)], 'outline', true),
      { kind: 'circle', style: 'outline', c: pt(165, 180), r: 6 },
      { kind: 'circle', style: 'outline', c: pt(215, 180), r: 6 },
      line(pt(219, 176), pt(258, 140), 'dimension'),
      line(pt(258, 140), pt(300, 140), 'dimension'),
      poly([pt(219, 176), pt(224, 180), pt(226, 176)], 'dimension', true),
      text(pt(258, 136), '2 HOLES Ø12 DRILL', 3.2, { align: 'left', bold: true, colour: '#1d4ed8' }),
      line(pt(190, 197), pt(258, 224), 'dimension'),
      line(pt(258, 224), pt(300, 224), 'dimension'),
      { kind: 'dot', style: 'dimension', at: pt(190, 197) },
      text(pt(258, 220), 'MATERIAL 6 MILD STEEL', 3.2, { align: 'left', bold: true, colour: '#1d4ed8' }),
    ],
  },
});

/* ======================================================== 7 — limit line */

const LIMIT = lineworkTopic({
  id: 'line-limit',
  title: 'Limit line',
  subtitle: 'Continuous thin — where a partial view or a part section stops.',
  goal: 'Use a limit line to end a partial view, and know when it must be freehand.',
  number: 'F-16',
  name: 'LIMIT LINE',
  job: 'CONTINUOUS THIN — LIMIT OF A PARTIAL VIEW OR SECTION',
  style: 'thin',
  what: {
    tip: 'A limit line marks where a view or a section stops for the draughtsman’s convenience — not where the metal stops.',
    lines: [
      { text: 'Sometimes you only need part of a view, so you draw part of it and stop.' },
      { text: 'The line where you stop is the limit line.' },
      { text: 'And it has to be obvious that the metal carries on past it — you just did not draw it.' },
      { text: 'So it is thin, and it never lines up with an edge of the job.' },
      { text: 'On a part section — half solid, half cut open — the limit line is what divides the two.' },
      { text: 'There it is drawn freehand, wandering, so nobody mistakes it for an edge.' },
      { text: 'A ruled straight limit line on a part section is the classic mistake.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'pencil',
    tip: 'Ruled where it limits a whole view; freehand where it divides a part section from the outside of the job.',
    lines: [
      { text: 'Thin line, ruled, right across. That is the plain limit line.' },
      { text: 'Underneath it, draw the other kind — the same line, freehand.' },
      { text: 'Wandering, but not scribbled. A steady hand, no straight edge.' },
      { text: 'Letter it. Limit line.' },
    ],
    marks: [
      poly(freehand([pt(SPEC_LEFT, SPEC_Y + 12), pt(SPEC_RIGHT, SPEC_Y + 12)], 4, 1.4, 9), 'thin'),
      text(pt(SPEC_RIGHT + 6, SPEC_Y + 12), 'FREEHAND', 2.6, { align: 'left', colour: '#64748b' }),
    ],
  },
  use: {
    title: 'A part section through a boss',
    tool: 'pencil',
    focus: { at: pt(195, 180), r: 92 },
    tip: 'Cut only as much as you need to show. A part section saves a whole extra view.',
    lines: [
      { text: 'A bracket with a boss on it, and a hole bored through the boss.' },
      { text: 'You could draw a whole extra sectional view just to show that hole.' },
      { text: 'Or you could cut away one corner and show it there. That is a part section.' },
      { text: 'Draw the outside as normal. Then cut into it, over the boss only.' },
      { text: 'The limit line between the two goes on freehand.' },
      { text: 'Hatch the cut side, leave the other side alone.' },
      { text: 'One small piece of section, and the whole extra view is saved.' },
    ],
    marks: [
      poly([pt(140, 215), pt(255, 215), pt(255, 150), pt(140, 150)], 'outline', true),
      { kind: 'circle', style: 'outline', c: pt(205, 182), r: 24 },
      line(pt(205, 152), pt(205, 212), 'centre'),
      line(pt(175, 182), pt(235, 182), 'centre'),
      poly(freehand([pt(205, 150), pt(198, 172), pt(212, 196), pt(205, 215)], 9, 2.2, 7), 'thin'),
      ...hatchRect(206, 158, 48, 48, 45, 4).map((mark) => mark),
      { kind: 'circle', style: 'outline', c: pt(205, 182), r: 9 },
      text(pt(255, 232), 'PART SECTION', 3.2, { align: 'right', bold: true }),
    ],
  },
});

/* ====================================================== 8 — phantom line */

const PHANTOM = lineworkTopic({
  id: 'line-phantom',
  title: 'Phantom line',
  subtitle: 'Chain thin, double dash — something that is there but is not this part.',
  goal: 'Show an alternate position with phantom lines and know the three things they are used for.',
  number: 'F-17',
  name: 'PHANTOM LINE',
  job: 'CHAIN THIN DOUBLE DASH — ALTERNATE POSITION OR ADJACENT PART',
  style: 'phantom',
  what: {
    tip: 'Long dash, two short dashes, repeat. That second short dash is the only thing separating it from a centre line.',
    lines: [
      { text: 'A phantom line is a long dash and then two short dashes, over and over.' },
      { text: 'One short dash is a centre line. Two is a phantom line. That is the whole difference.' },
      { text: 'So draw the second dash properly, or you have said something else entirely.' },
      { text: 'It is used for three things.' },
      { text: 'One: where a moving part gets to when it moves. The open position of a flap.' },
      { text: 'Two: a part that is next to this one but is not being made here.' },
      { text: 'Three: an outline that has been cut away, shown so you can see what used to be there.' },
      { text: 'In all three, it means: this is real, but it is not the part on this drawing.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'Keep the two short dashes close together. Spread them out and it starts reading as a centre line with a fault.',
    lines: [
      { text: 'Long dash, about twenty. Gap.' },
      { text: 'Short dash. Gap. Second short dash. Gap.' },
      { text: 'Then the long dash again, and keep going.' },
      { text: 'Letter it. Phantom line. Chain thin, double dash.' },
    ],
  },
  use: {
    title: 'Show a flap in its open position',
    tool: 'pencil',
    focus: { at: pt(205, 180), r: 100 },
    tip: 'Never dimension to a phantom outline. It is information, not the part being made.',
    lines: [
      { text: 'A hinged inspection flap on the side of a hopper.' },
      { text: 'Closed, it lies flat against the side. Draw that in outline — that is the part.' },
      { text: 'Open, it swings up about the hinge. Draw that in phantom.' },
      { text: 'Now anybody reading the drawing can see how much room the flap needs to swing.' },
      { text: 'Which matters, because somebody has to fit it in a corner somewhere.' },
      { text: 'One rule though. Never dimension anything to the phantom outline.' },
      { text: 'It is information about the part. It is not the part.' },
    ],
    marks: [
      line(pt(150, 220), pt(280, 220), 'outline'),
      poly([pt(160, 220), pt(240, 220), pt(240, 210), pt(160, 210)], 'outline', true),
      { kind: 'dot', style: 'outline', at: pt(160, 215), label: 'HINGE', labelAngle: 200 },
      poly([pt(160, 215), pt(216, 158), pt(223, 165), pt(167, 222)], 'phantom', true),
      {
        kind: 'angle',
        at: pt(160, 215),
        from: 0,
        to: 45,
        r: 42,
        label: '45° OPEN',
        style: 'phantom',
      },
      text(pt(200, 236), 'FLAP SHOWN CLOSED, OPEN IN PHANTOM', 2.8, { colour: '#6d28d9' }),
    ],
  },
});

/* ==================================================== 9 — extension line */

const EXTENSION = lineworkTopic({
  id: 'line-extension',
  title: 'Extension line',
  subtitle: 'Continuous thin — bringing a feature out to where its size can be written.',
  goal: 'Draw extension lines with the correct gap at the part and overrun past the dimension line.',
  number: 'F-18',
  name: 'EXTENSION LINE',
  job: 'CONTINUOUS THIN — TAKES A FEATURE OUT TO ITS DIMENSION',
  style: 'dimension',
  specimenExtra: [
    line(pt(SPEC_LEFT, SPEC_Y - 14), pt(SPEC_LEFT, SPEC_Y + 4), 'dimension'),
    line(pt(SPEC_RIGHT, SPEC_Y - 14), pt(SPEC_RIGHT, SPEC_Y + 4), 'dimension'),
  ],
  what: {
    tip: 'Leave about 1.5 mm of clear air between the part and the start of the extension line, and run it about 2 mm past the dimension line.',
    lines: [
      { text: 'You cannot dimension across the middle of a drawing. Nobody could read it.' },
      { text: 'So the feature is brought outside the view, and dimensioned out there in clear air.' },
      { text: 'The thin line that brings it out is the extension line. Sometimes called a projection line.' },
      { text: 'Two details, and both of them are marked.' },
      { text: 'It does not touch the part. Leave about a millimetre and a half of gap.' },
      { text: 'And it runs on a couple of millimetres past the dimension line, and stops.' },
      { text: 'That little gap is what keeps the dimensioning from looking welded onto the job.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'Extension lines are normally square to the feature. They may be drawn at 60° where a square one would run into something.',
    lines: [
      { text: 'Dimension line across, and an extension line coming up at each end.' },
      { text: 'They cross it and stop a couple of millimetres past.' },
      { text: 'At the bottom, they stop short of where the job would be.' },
      { text: 'Letter it. Extension line.' },
    ],
  },
  use: {
    title: 'Dimension a plate from outside it',
    tool: 'pencil',
    focus: { at: pt(190, 175), r: 95 },
    tip: 'Extension lines may cross each other. They should not cross a dimension line if it can be avoided.',
    lines: [
      { text: 'A plate with a step in it. Three sizes to get on.' },
      { text: 'Bring each corner out below the plate on its own extension line.' },
      { text: 'Gap at the plate. Straight down. Two millimetres past the dimension line.' },
      { text: 'Now the dimension lines run between them, out in the open.' },
      { text: 'Nothing is written on top of the job, and nothing is hard to read.' },
      { text: 'Extension lines are allowed to cross each other, if they must.' },
      { text: 'They should not cross a dimension line. Rearrange the sizes instead.' },
    ],
    marks: [
      poly([pt(140, 190), pt(240, 190), pt(240, 160), pt(190, 160), pt(190, 145), pt(140, 145)], 'outline', true),
      line(pt(140, 193), pt(140, 216), 'dimension'),
      line(pt(190, 193), pt(190, 216), 'dimension'),
      line(pt(240, 193), pt(240, 230), 'dimension'),
      { kind: 'dim', a: pt(140, 212), b: pt(190, 212), label: '50' },
      { kind: 'dim', a: pt(190, 212), b: pt(240, 212), label: '50' },
      { kind: 'dim', a: pt(140, 226), b: pt(240, 226), label: '100' },
      text(pt(262, 200), '1.5 GAP AT THE PART', 2.8, { align: 'left', colour: '#64748b' }),
      text(pt(262, 209), '2 PAST THE DIMENSION LINE', 2.8, { align: 'left', colour: '#64748b' }),
    ],
  },
});

/* ======================================================= 10 — break line */

const BREAK = lineworkTopic({
  id: 'line-break',
  title: 'Break line',
  subtitle: 'Continuous thin, freehand or zig-zag — a long piece drawn short.',
  goal: 'Shorten a long bar with a break and dimension it at its full length.',
  number: 'F-19',
  name: 'BREAK LINE',
  job: 'CONTINUOUS THIN FREEHAND OR ZIG-ZAG — PART REMOVED',
  style: 'thin',
  what: {
    tip: 'A break shortens the drawing, never the job. The dimension across a break is always the real length.',
    lines: [
      { text: 'A six metre length of angle iron will not go on a sheet of paper at any useful scale.' },
      { text: 'But nothing happens in the middle of it. So you draw the two ends and break out the middle.' },
      { text: 'The line where you take the middle out is the break line.' },
      { text: 'Two kinds. Freehand, for a short break, drawn as a wavy line.' },
      { text: 'Or ruled with a zig-zag in the middle, for a long one — that is the one used on a long run.' },
      { text: 'And there is one rule that decides whether the job is right or scrap.' },
      { text: 'The dimension across a break is the real length. Six metres, on a bar drawn a hundred long.' },
      { text: 'The break shortens the drawing. It never shortens the steel.' },
    ],
  },
  draw: {
    title: 'Draw both kinds of break',
    tool: 'pencil',
    tip: 'Freehand break for a short one; ruled with a zig-zag for a long one. Both are thin.',
    lines: [
      { text: 'First the freehand one. A steady wandering line, thin, no straight edge.' },
      { text: 'Not a scribble. One smooth wave.' },
      { text: 'Now the long one. Rule it straight, and put a zig-zag in the middle.' },
      { text: 'Letter them both. Break lines.' },
    ],
    marks: [
      poly(breakWave(pt(SPEC_LEFT + 20, SPEC_Y + 10), pt(SPEC_LEFT + 20, SPEC_Y + 30), 3), 'thin'),
      zigzagBreak(pt(SPEC_LEFT + 60, SPEC_Y + 20), pt(SPEC_RIGHT, SPEC_Y + 20), 4, 'thin'),
      text(pt(SPEC_LEFT + 30, SPEC_Y + 20), 'FREEHAND', 2.6, { align: 'left', colour: '#64748b' }),
      text(pt(SPEC_LEFT + 60, SPEC_Y + 32), 'RULED WITH A ZIG-ZAG', 2.6, { align: 'left', colour: '#64748b' }),
    ],
  },
  use: {
    title: 'A 6 metre bar drawn 130 long',
    tool: 'pencil',
    focus: { at: pt(215, 180), r: 100 },
    tip: 'Break both edges of the bar on the same line, and hatch nothing — a break is not a section.',
    lines: [
      { text: 'Fifty by fifty by six angle, six metres long. Draw the two ends only.' },
      { text: 'Top edge, bottom edge, and the two ends properly drawn.' },
      { text: 'Now the break. Both edges get broken on the same line, straight across.' },
      { text: 'A break is not a cut, so nothing gets hatched.' },
      { text: 'Then the dimension. Six thousand.' },
      { text: 'On a line that is a hundred and thirty long on your paper.' },
      { text: 'That is not a mistake and nobody will read it as one. It is how every long bar is drawn.' },
    ],
    marks: [
      line(pt(130, 165), pt(260, 165), 'outline'),
      line(pt(130, 195), pt(260, 195), 'outline'),
      line(pt(130, 165), pt(130, 195), 'outline'),
      line(pt(260, 165), pt(260, 195), 'outline'),
      line(pt(130, 172), pt(260, 172), 'outline'),
      zigzagBreak(pt(195, 163), pt(195, 197), 4, 'thin'),
      { kind: 'dim', a: pt(130, 195), b: pt(260, 195), offset: -22, label: '6000' },
      text(pt(195, 152), '50 × 50 × 6 ANGLE', 3.2, { bold: true }),
    ],
  },
});

/* ================================================ 11 — cutting plane line */

const CUTTING = lineworkTopic({
  id: 'line-cutting-plane',
  title: 'Cutting plane line',
  subtitle: 'Chain thick at the ends — where the job was cut open.',
  goal: 'Mark a cutting plane with the correct ends, arrows and letters, and read the section from it.',
  number: 'F-20',
  name: 'CUTTING PLANE',
  job: 'CHAIN THICK AT ENDS AND AT EVERY CHANGE OF DIRECTION',
  style: 'cutting',
  what: {
    tip: 'The arrows show the direction you look AFTER the near half is taken away — not the direction of the cut.',
    lines: [
      { text: 'To show what is inside something, you pretend to cut it in half and take the near half away.' },
      { text: 'The line showing where you cut is the cutting plane line.' },
      { text: 'It is a chain line, and it is thick — but only at the two ends, and at any corner where it changes direction.' },
      { text: 'In between it is thin. That is so it does not fight the outline it is drawn over.' },
      { text: 'At each end there is an arrow, and beside each arrow a capital letter.' },
      { text: 'The arrows point the way you are looking once the near half is gone.' },
      { text: 'And the sectional view is then titled with those letters. Section A A.' },
      { text: 'Not "section". Section A A. Because a drawing may carry several.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'pencil',
    tip: 'Thick at the ends, thin through the middle, arrows and letters at both ends.',
    lines: [
      { text: 'Chain line right across.' },
      { text: 'Now go back over the last fifteen millimetres at each end and thicken it.' },
      { text: 'Arrow at each end, square to the line, pointing the way you will look.' },
      { text: 'And a capital letter beside each arrow. A at this end, A at the other.' },
    ],
    marks: [
      poly([pt(SPEC_LEFT - 4, SPEC_Y), pt(SPEC_LEFT - 4, SPEC_Y + 14)], 'cutting'),
      poly([pt(SPEC_LEFT - 4, SPEC_Y + 14), pt(SPEC_LEFT - 7, SPEC_Y + 8), pt(SPEC_LEFT - 1, SPEC_Y + 8)], 'cutting', true),
      poly([pt(SPEC_RIGHT + 4, SPEC_Y), pt(SPEC_RIGHT + 4, SPEC_Y + 14)], 'cutting'),
      poly([pt(SPEC_RIGHT + 4, SPEC_Y + 14), pt(SPEC_RIGHT + 1, SPEC_Y + 8), pt(SPEC_RIGHT + 7, SPEC_Y + 8)], 'cutting', true),
      text(pt(SPEC_LEFT - 12, SPEC_Y + 16), 'A', 4, { bold: true, colour: '#0f766e' }),
      text(pt(SPEC_RIGHT + 12, SPEC_Y + 16), 'A', 4, { bold: true, colour: '#0f766e' }),
    ],
  },
  use: {
    title: 'Cut a flanged block and hatch it',
    tool: 'pencil',
    focus: { at: pt(230, 180), r: 115 },
    tip: 'Hatching is thin, at 45°, evenly spaced — and it stops dead on the outline.',
    lines: [
      { text: 'A block with a bore through it. From outside, the bore is hidden detail. Not much use.' },
      { text: 'So put a cutting plane straight down the middle, through the bore.' },
      { text: 'Thick at the ends, arrows pointing to the right, letters A and A.' },
      { text: 'Now draw the sectional view beside it, looking the way the arrows point.' },
      { text: 'Everything the plane cut through gets hatched. Thin lines, forty five degrees, evenly spaced.' },
      { text: 'The bore is now a solid outline, not hidden detail. That is the whole gain.' },
      { text: 'And title it. Section A A. Underneath the view, lettered clearly.' },
    ],
    marks: [
      poly([pt(120, 210), pt(180, 210), pt(180, 145), pt(120, 145)], 'outline', true),
      line(pt(150, 168), pt(150, 188), 'hidden'),
      line(pt(150, 140), pt(150, 216), 'cutting'),
      poly([pt(150, 140), pt(147, 146), pt(153, 146)], 'cutting', true),
      text(pt(142, 138), 'A', 4, { bold: true, colour: '#0f766e' }),
      text(pt(142, 224), 'A', 4, { bold: true, colour: '#0f766e' }),
      poly([pt(230, 210), pt(290, 210), pt(290, 145), pt(230, 145)], 'outline', true),
      ...hatchRect(230, 145, 60, 65, 45, 4),
      poly([pt(248, 168), pt(272, 168), pt(272, 188), pt(248, 188)], 'outline', true),
      line(pt(260, 140), pt(260, 216), 'centre'),
      text(pt(260, 228), 'SECTION A–A', 3.6, { bold: true }),
    ],
  },
});

/* ================================================ 12 — hidden detail line */

const HIDDEN = lineworkTopic({
  id: 'line-hidden',
  title: 'Hidden detail line',
  subtitle: 'Short dashes — an edge that is really there, behind something else.',
  goal: 'Show a hidden edge with correctly started and joined dashes.',
  number: 'F-21',
  name: 'HIDDEN DETAIL',
  job: 'DASHED THIN — EDGES HIDDEN BEHIND THE MATERIAL',
  style: 'hidden',
  what: {
    tip: 'A hidden line starts and ends with a dash touching the line it meets — never with a gap.',
    lines: [
      { text: 'A hidden line shows an edge that is really there, but is behind something.' },
      { text: 'A bore through a block. A recess on the far side. A rib inside a casting.' },
      { text: 'Short dashes, thin, evenly spaced. About three long with a one gap.' },
      { text: 'Even spacing matters. Ragged dashes read as a mistake, not as hidden detail.' },
      { text: 'Two rules that catch people.' },
      { text: 'It starts with a dash touching the line it comes off. Not with a gap.' },
      { text: 'And where a hidden line meets another line, the dashes meet it. They do not stop short.' },
      { text: 'Where there is too much hidden detail to read, stop drawing it and take a section instead.' },
    ],
  },
  draw: {
    title: 'Draw the specimen',
    tool: 'tsquare',
    tip: 'Dash about 3 mm, gap about 1 mm, all the way. Start and finish on a dash.',
    lines: [
      { text: 'Rule it lightly first, then dash over it.' },
      { text: 'Three on, one off. Three on, one off. Keep it even.' },
      { text: 'Start on a dash. Finish on a dash.' },
      { text: 'Letter it. Hidden detail. Dashed thin.' },
    ],
  },
  use: {
    title: 'A bore that cannot be seen',
    tool: 'pencil',
    focus: { at: pt(200, 180), r: 105 },
    tip: 'Hidden detail is usually not dimensioned. If a hidden feature needs sizes, take a section and dimension it there.',
    lines: [
      { text: 'A block, ninety by sixty, with a thirty bore drilled right through it.' },
      { text: 'In the plan the bore is a circle, and you can see straight into it.' },
      { text: 'In the front view you cannot see it at all. The metal is in the way.' },
      { text: 'But it is there, so it is drawn — hidden.' },
      { text: 'Two dashed lines down the front view, thirty apart, projected from the plan.' },
      { text: 'Dashes touching the top edge, dashes touching the bottom edge.' },
      { text: 'And do not dimension it there. If a hidden feature needs sizes, take a section.' },
    ],
    marks: [
      poly([pt(150, 200), pt(240, 200), pt(240, 155), pt(150, 155)], 'outline', true),
      line(pt(180, 200), pt(180, 155), 'hidden'),
      line(pt(210, 200), pt(210, 155), 'hidden'),
      line(pt(195, 150), pt(195, 205), 'centre'),
      line(pt(150, 220), pt(240, 220), 'construction'),
      poly([pt(150, 235), pt(240, 235), pt(240, 275), pt(150, 275)], 'outline', true),
      { kind: 'circle', style: 'outline', c: pt(195, 255), r: 15 },
      line(pt(195, 230), pt(195, 280), 'centre'),
      line(pt(145, 255), pt(245, 255), 'centre'),
      line(pt(180, 200), pt(180, 240), 'construction'),
      line(pt(210, 200), pt(210, 240), 'construction'),
      text(pt(255, 178), 'FRONT VIEW', 3, { align: 'left', colour: '#64748b' }),
      text(pt(255, 255), 'PLAN', 3, { align: 'left', colour: '#64748b' }),
    ],
  },
});

export const LINEWORK_TOPICS: DrawTopic[] = [
  OUTLINE,
  CENTRE,
  PROJECTION,
  CONSTRUCTION,
  DIMENSION,
  LEADER,
  LIMIT,
  PHANTOM,
  EXTENSION,
  BREAK,
  CUTTING,
  HIDDEN,
];
