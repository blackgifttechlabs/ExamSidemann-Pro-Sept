/**
 * Assembly drawings — how the parts go together, and how they come apart.
 *
 * A detail drawing answers "what shape is this part?". An assembly drawing
 * answers a different question: "what goes where?". So it is dimensioned
 * differently (hardly at all), sectioned differently (fasteners are never cut),
 * and it carries a parts list with balloons pointing at every item.
 *
 * The subject here is a wheel hub and stub axle, because every motor vehicle
 * student has had one apart and can picture it.
 */

import { hatchRect } from './drawingConventions';
import { polar, pt, type Mark, type Pt } from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/* ---------------------------------------------------------------- balloons */

/** An item balloon: a circle with the item number, on a leader to the part. */
function balloon(at: Pt, from: Pt, item: number): Mark[] {
  return [
    { kind: 'line', style: 'thin', a: from, b: at },
    { kind: 'circle', style: 'thin', c: at, r: 6 },
    { kind: 'text', at: pt(at.x, at.y + 2), text: String(item), size: 4, align: 'center', bold: true },
  ];
}

/* ========================================================================= 32
 * Basic assembly drawing
 * ======================================================================= */

const AXIS_Y = 120;
const AXLE = { left: 70, right: 250, r: 14 };
const HUB = { left: 140, right: 220, outer: 52, bore: 14 };
const BEARING = { left: 150, right: 176, outer: 34, inner: 14 };
const BEARING_B = { left: 190, right: 216, outer: 34, inner: 14 };
const NUT = { left: 252, right: 268, r: 22 };

/** A ring of material above and below the axis, hatched one way or the other. */
function ringSection(
  left: number,
  right: number,
  outer: number,
  inner: number,
  angle: number
): Mark[] {
  const width = right - left;
  const thickness = outer - inner;
  return [
    ...hatchRect(left, AXIS_Y - outer, width, thickness, angle),
    ...hatchRect(left, AXIS_Y + inner, width, thickness, angle),
    { kind: 'poly', style: 'outline', close: true, points: [
      pt(left, AXIS_Y - outer), pt(right, AXIS_Y - outer), pt(right, AXIS_Y - inner), pt(left, AXIS_Y - inner),
    ] },
    { kind: 'poly', style: 'outline', close: true, points: [
      pt(left, AXIS_Y + inner), pt(right, AXIS_Y + inner), pt(right, AXIS_Y + outer), pt(left, AXIS_Y + outer),
    ] },
  ];
}

const ASSEMBLY: DrawTopic = {
  id: 'assembly-drawing',
  title: 'Basic assembly drawings',
  subtitle: 'A wheel hub in section, with every part numbered.',
  goal: 'Draw an assembly in section, hatch mating parts in opposite directions, leave fasteners uncut, and number every item to a parts list.',
  minutes: 35,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('WHEEL HUB ASSEMBLY', '32'),
  steps: [
    {
      id: 'assembly-purpose',
      title: 'A different question',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 220 },
      tip: 'A detail drawing says what shape a part is. An assembly drawing says what goes where.',
      lines: [
        { text: 'A detail drawing tells the machinist what shape to make one part.' },
        { text: 'An assembly drawing answers a different question. What goes where?' },
        { text: 'So it carries almost no sizes. Only the ones you need to put it together.' },
        { text: 'What it does carry is a number on every part, and a list to match.' },
        { text: 'We will draw a wheel hub on a stub axle. You have all had one apart.' },
      ],
      marks: [],
    },
    {
      id: 'assembly-axle',
      title: 'Start with the part everything sits on',
      tool: 'tsquare',
      teeY: AXIS_Y - AXLE.r,
      focus: { at: pt(160, AXIS_Y), r: 130 },
      tip: 'Build an assembly outwards from the part everything else locates on.',
      lines: [
        { text: 'Centre line first, right through the assembly.' },
        { text: 'Then the stub axle — the part everything else sits on.', at: pt(120, AXIS_Y) },
        { text: 'Always start an assembly with that part. Never with a small one.' },
        { text: 'The axle is solid, and a shaft is never cut in half in a section.' },
        { text: 'So it stays plain. No hatching on it at all.' },
      ],
      marks: [
        { kind: 'line', style: 'centre', a: pt(AXLE.left - 10, AXIS_Y), b: pt(NUT.right + 14, AXIS_Y) },
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(AXLE.left, AXIS_Y - AXLE.r),
          pt(AXLE.right, AXIS_Y - AXLE.r),
          pt(AXLE.right, AXIS_Y + AXLE.r),
          pt(AXLE.left, AXIS_Y + AXLE.r),
        ] },
      ],
    },
    {
      id: 'assembly-hub',
      title: 'The hub over it',
      tool: 'pencil',
      focus: { at: pt(180, AXIS_Y), r: 110 },
      tip: 'Two parts touching are hatched in opposite directions so the joint between them shows.',
      lines: [
        { text: 'Now the hub, over the axle.' },
        { text: 'It is cut, so it gets hatched.', at: pt(180, AXIS_Y - 40) },
        { text: 'Forty-five degrees one way for the hub.' },
        { text: 'The next part it touches will be hatched the other way.' },
        { text: 'That is the rule. Opposite hatching is how the eye finds the joint.' },
      ],
      marks: ringSection(HUB.left, HUB.right, HUB.outer, HUB.bore + 20, 45),
    },
    {
      id: 'assembly-bearings',
      title: 'Bearings, hatched the other way',
      tool: 'pencil',
      focus: { at: pt(183, AXIS_Y), r: 100 },
      tip: 'Where three parts meet, alternate the hatching, or vary its spacing to keep them apart.',
      lines: [
        { text: 'Two taper roller bearings, one at each end of the hub.' },
        { text: 'They touch the hub, so they hatch the other way.', at: pt(163, AXIS_Y - 24) },
        { text: 'One hundred and thirty-five degrees instead of forty-five.' },
        { text: 'Now look at the drawing. You can see three separate parts without reading a word.' },
      ],
      marks: [
        ...ringSection(BEARING.left, BEARING.right, BEARING.outer, BEARING.inner, 135),
        ...ringSection(BEARING_B.left, BEARING_B.right, BEARING_B.outer, BEARING_B.inner, 135),
      ],
    },
    {
      id: 'assembly-nut',
      title: 'Fasteners are never cut',
      tool: 'pencil',
      focus: { at: pt(NUT.left + 8, AXIS_Y), r: 70 },
      tip: 'Nuts, bolts, washers, keys, pins, rivets and shafts are shown whole even when the section passes through them.',
      lines: [
        { text: 'Last on is the castle nut and its split pin.' },
        { text: 'Here is the rule everybody forgets in the exam.' },
        { text: 'Fasteners are never cut in a section.', at: pt(NUT.left + 8, AXIS_Y - 24), label: 'not cut' },
        { text: 'Nuts, bolts, washers, keys, pins, rivets, shafts. All drawn whole.' },
        { text: 'Cutting a nut in half tells the reader nothing he did not already know.' },
      ],
      marks: [
        { kind: 'poly', style: 'outline', close: true, points: [
          pt(NUT.left, AXIS_Y - NUT.r),
          pt(NUT.right, AXIS_Y - NUT.r),
          pt(NUT.right, AXIS_Y + NUT.r),
          pt(NUT.left, AXIS_Y + NUT.r),
        ] },
        { kind: 'line', style: 'outline', a: pt(NUT.left, AXIS_Y - 11), b: pt(NUT.right, AXIS_Y - 11) },
        { kind: 'line', style: 'outline', a: pt(NUT.left, AXIS_Y + 11), b: pt(NUT.right, AXIS_Y + 11) },
        { kind: 'circle', style: 'outline', c: pt(NUT.left + 8, AXIS_Y), r: 3 },
      ],
    },
    {
      id: 'assembly-balloons',
      title: 'Balloon every item',
      tool: 'pencil',
      focus: { at: pt(190, 90), r: 150 },
      tip: 'One balloon per item, all the same size, on leaders that do not cross.',
      lines: [
        { text: 'Now number the parts. One circle each, all the same size.' },
        { text: 'A thin leader from the circle onto the part, ending on the part itself.' },
        { text: 'Keep the balloons in a line if you can, and never let two leaders cross.' },
        { text: 'Then the parts list: item, name, quantity, material.' },
        { text: 'Item one is usually the biggest part. Work outwards from there.' },
      ],
      marks: [
        ...balloon(pt(100, 60), pt(120, AXIS_Y - AXLE.r), 1),
        ...balloon(pt(150, 52), pt(180, AXIS_Y - HUB.outer), 2),
        ...balloon(pt(200, 52), pt(163, AXIS_Y - BEARING.outer), 3),
        ...balloon(pt(250, 60), pt(NUT.left + 8, AXIS_Y - NUT.r), 4),
        { kind: 'text', at: pt(290, 175), text: 'PARTS LIST', size: 3.4, align: 'left', bold: true },
        { kind: 'text', at: pt(290, 184), text: '1  STUB AXLE      1  STEEL', size: 2.8, align: 'left' },
        { kind: 'text', at: pt(290, 192), text: '2  HUB            1  CAST IRON', size: 2.8, align: 'left' },
        { kind: 'text', at: pt(290, 200), text: '3  TAPER BEARING  2  BOUGHT IN', size: 2.8, align: 'left' },
        { kind: 'text', at: pt(290, 208), text: '4  CASTLE NUT     1  BOUGHT IN', size: 2.8, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 33
 * Exploded diagram
 * ======================================================================= */

const EXPLODE_Y = 130;
/** Every item is pulled apart along one line — the axis it assembles on. */
const EXPLODE = [
  { x: 60, label: 'STUB AXLE' },
  { x: 130, label: 'INNER BEARING' },
  { x: 190, label: 'HUB' },
  { x: 260, label: 'OUTER BEARING' },
  { x: 320, label: 'NUT' },
];

const EXPLODED: DrawTopic = {
  id: 'exploded-diagram',
  title: 'Exploded diagrams',
  subtitle: 'Motor vehicle components pulled apart along one axis.',
  goal: 'Draw an exploded pictorial diagram of a motor vehicle assembly, keep every part on its assembly axis, and use it to show the order of dismantling.',
  minutes: 30,
  level: 'Core',
  tools: ['30/60 set square', 'Compass', 'HB pencil'],
  base: preparedSheet('EXPLODED VIEW — FRONT HUB', '33'),
  steps: [
    {
      id: 'exploded-why',
      title: 'The drawing in the workshop manual',
      tool: 'hand',
      focus: { at: pt(190, 130), r: 220 },
      tip: 'An exploded view shows the order things come apart in, which no sectioned assembly can.',
      lines: [
        { text: 'Open any workshop manual and you will find these.' },
        { text: 'The parts are pulled apart, but each one stays on its own line.' },
        { text: 'That line is the axis they assemble on.' },
        { text: 'It tells you two things a sectioned assembly cannot.' },
        { text: 'Which way round each part goes, and what order they come off in.' },
      ],
      marks: [],
    },
    {
      id: 'exploded-axis',
      title: 'One axis, drawn first',
      tool: 'set30',
      focus: { at: pt(200, EXPLODE_Y), r: 180 },
      tip: 'Draw the assembly axis before any part. Every item is then hung on it.',
      lines: [
        { text: 'The axis comes first, before any part.' },
        { text: 'Everything on this hub assembles along one line, so one axis does the whole job.' },
        { text: 'Draw it as a long chain line, right across the sheet.' },
        { text: 'Now every part gets hung on it, in the order it goes together.' },
      ],
      marks: [
        { kind: 'line', style: 'centre', a: pt(45, EXPLODE_Y), b: pt(360, EXPLODE_Y) },
      ],
    },
    {
      id: 'exploded-parts',
      title: 'Hang the parts on it',
      tool: 'compass',
      compassRadius: 22,
      focus: { at: pt(200, EXPLODE_Y), r: 170 },
      tip: 'Spacing is not to scale — leave whatever gap makes each part readable.',
      lines: [
        { text: 'Each part is drawn as a circle in isometric — an ellipse.' },
        { text: 'Same centre line, different position along it.' },
        { text: 'The spacing is not to scale. Leave whatever gap reads clearly.' },
        { text: 'But the order must be right. That is the whole point of the drawing.' },
      ],
      marks: EXPLODE.flatMap((item, index): Mark[] => {
        const radius = [14, 20, 30, 20, 16][index];
        const centre = pt(item.x, EXPLODE_Y);
        return [
          { kind: 'circle', style: 'outline', c: centre, r: radius },
          { kind: 'circle', style: 'outline', c: centre, r: Math.max(5, radius * 0.42) },
          // A short run of the body behind each face, drawn on the 30° axis.
          { kind: 'line', style: 'outline', a: polar(centre, radius, 90), b: polar(polar(centre, radius, 90), 16, 30) },
          { kind: 'line', style: 'outline', a: polar(centre, radius, 270), b: polar(polar(centre, radius, 270), 16, 30) },
          {
            kind: 'arc',
            style: 'outline',
            c: polar(centre, 16, 30),
            r: radius,
            from: -90,
            to: 90,
          },
        ];
      }),
    },
    {
      id: 'exploded-order',
      title: 'Number them in order',
      tool: 'pencil',
      focus: { at: pt(200, EXPLODE_Y - 50), r: 170 },
      tip: 'Number an exploded view in dismantling order, so it reads as a set of instructions.',
      lines: [
        { text: 'Now number them, and number them in the order they come apart.' },
        { text: 'Nut first, because that is what you undo first.' },
        { text: 'Then the outer bearing, then the hub, then the inner bearing.' },
        { text: 'Read left to right it is assembly. Read right to left it is dismantling.' },
        { text: 'One drawing, both jobs.' },
      ],
      marks: EXPLODE.flatMap((item, index) =>
        balloon(pt(item.x, EXPLODE_Y - 56), pt(item.x, EXPLODE_Y - 32), 5 - index)
      ),
    },
    {
      id: 'exploded-labels',
      title: 'Name the parts',
      tool: 'pencil',
      focus: { at: pt(200, EXPLODE_Y + 50), r: 170 },
      tip: 'A balloon on its own is no use to a storeman — the name is what he orders by.',
      lines: [
        { text: 'A number on its own is no use to the man in the stores.' },
        { text: 'Letter the name of each part underneath it.' },
        { text: 'Small, level, all on one line so the drawing stays tidy.' },
        { text: 'Now anybody can strip that hub with only this sheet in front of them.' },
      ],
      marks: EXPLODE.map((item): Mark => ({
        kind: 'text',
        at: pt(item.x, EXPLODE_Y + 62),
        text: item.label,
        size: 2.8,
        align: 'center',
      })),
    },
  ],
};

export const ASSEMBLY_TOPICS: DrawTopic[] = [ASSEMBLY, EXPLODED];
