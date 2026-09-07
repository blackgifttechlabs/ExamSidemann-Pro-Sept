/**
 * Boiler plate work: the developments that come off a shell rather than off a
 * flat cut.
 *
 * A dome standing on a barrel, a pipe running between a boiler and a
 * superheater, a flanged front plate, the plates of an egg-ended boiler —
 * these are the jobs where the length of an element is set by *another curved
 * surface*, so the ordinate is read off a circle instead of off a straight
 * line. The arithmetic changes; the method does not.
 */

import { pt, rad, type Mark, type Pt } from '../technical-drawing/drawingGeometry';
import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import {
  bendAllowance,
  eggProfile,
  fabSheet,
  girth,
  goreOutline,
  line,
  meridian,
  numberedPlan,
  poly,
  saddleCurve,
  saddleCut,
  saddleHoleInShell,
  sampleCurve,
  stations,
  text,
} from './fabricationGeometry';

const dot = (at: Pt): Mark => ({ kind: 'dot', style: 'outline', at });

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
 * 4 — Plates for a dome to fit on top of a boiler
 * ======================================================================== */

const DOME = (() => {
  const SHELL_R = 60;
  const SHELL = pt(95, 205);
  const R = 25;
  const AX = SHELL.x;
  const TOP_Y = 105;
  /** Height of the dome's top above the shell's axis. */
  const HEIGHT = SHELL.y - TOP_Y;
  const FOOT_Y = SHELL.y - Math.sqrt(SHELL_R * SHELL_R - R * R);
  const PLAN = pt(AX, 62);
  const DEV = pt(185, 200);
  const HOLE = pt(300, 106);
  const G = girth(R);
  const marked = stations(R, 12, 180);
  return { SHELL_R, SHELL, R, AX, TOP_Y, HEIGHT, FOOT_Y, PLAN, DEV, HOLE, G, marked };
})();

const BOILER_DOME: DrawTopic = {
  id: 'dev-boiler-dome',
  title: 'Development of plates for a dome to fit on a boiler',
  subtitle: 'A steam dome standing on a curved shell — and the seat it cuts in the plate.',
  goal: 'Develop the dome plate and the hole in the shell, taking each element down to the curve of the boiler instead of to a flat cut.',
  minutes: 50,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'BOILER DOME PLATES', number: 'F-24', scale: '1:1' }),
  steps: [
    {
      id: 'dome-idea',
      title: 'A flat cut is easy. A shell is not.',
      tool: 'hand',
      focus: { at: pt(150, 150), r: 150 },
      tip: 'The dome sits on a curve, so the plate is longest at the sides — the sides sit furthest down the round of the shell.',
      lines: [
        { text: 'A steam dome is a short cylinder standing on top of the boiler.' },
        { text: 'The boiler is round. So the bottom of the dome cannot be cut straight.' },
        { text: 'It has to be cut to sit down on the curve. That is called a saddle.' },
        { text: 'Now think about which part of the dome is longest.' },
        { text: 'The front and the back of the dome sit on the very top of the shell — high up.' },
        { text: 'The two sides sit further round the curve — lower down. So the sides are longer.' },
        { text: 'Get that the wrong way round and the dome rocks. Let us find the real lengths.' },
      ],
      marks: [],
    },
    {
      id: 'dome-elevation',
      title: 'The end elevation of the shell',
      tool: 'compass',
      compassRadius: DOME.SHELL_R,
      focus: { at: pt(95, 160), r: 90 },
      tip: 'Draw the shell as a full circle in the end view. That circle is what every dome length is read off.',
      lines: [
        { text: 'Look at the boiler from the end. The shell becomes a circle.' },
        { text: 'Centre here, radius sixty. Swing the arc across the top.' },
        { text: 'Now the dome. Twenty five each side of the centre line.' },
        { text: 'Bring the two sides down until they touch the shell.' },
        { text: 'And look where they land. Not at the top of the circle — down the side of it.' },
        { text: 'Sixty by fifty four and a half, if you work it. Five and a half millimetres lower.' },
        { text: 'Now the top of the dome, cut level, one hundred above the shell centre.' },
      ],
      markLines: [1, 1, 2, 3, 3, 6],
      marks: [
        line(pt(DOME.AX, 92), pt(DOME.AX, DOME.SHELL.y + 12), 'centre'),
        line(pt(DOME.AX - DOME.SHELL_R - 12, DOME.SHELL.y), pt(DOME.AX + DOME.SHELL_R + 12, DOME.SHELL.y), 'centre'),
        { kind: 'arc', style: 'outline', c: DOME.SHELL, r: DOME.SHELL_R, from: 18, to: 162 },
        line(pt(DOME.AX - DOME.R, DOME.TOP_Y), pt(DOME.AX - DOME.R, DOME.FOOT_Y), 'outline'),
        line(pt(DOME.AX + DOME.R, DOME.TOP_Y), pt(DOME.AX + DOME.R, DOME.FOOT_Y), 'outline'),
        line(pt(DOME.AX - DOME.R, DOME.TOP_Y), pt(DOME.AX + DOME.R, DOME.TOP_Y), 'outline'),
        {
          kind: 'dim',
          a: pt(DOME.AX, DOME.SHELL.y),
          b: pt(DOME.AX, DOME.TOP_Y),
          offset: -76,
          label: '100',
        },
      ],
    },
    {
      id: 'dome-plan',
      title: 'Plan of the dome, twelve parts',
      tool: 'compass',
      compassRadius: DOME.R,
      focus: { at: DOME.PLAN, r: 52 },
      tip: 'The plan is drawn over the elevation here so the ordinates drop straight down onto the shell circle.',
      lines: [
        { text: 'Above the elevation, draw the plan of the dome. A circle, twenty five radius.' },
        { text: 'Divide it into twelve and number from the left.' },
        { text: 'Points one and seven are the ends — they sit on the crown of the boiler.' },
        { text: 'Points four and ten are the sides. Those are the ones that reach furthest down.' },
        { text: 'Now drop every point straight down onto the shell circle.' },
        { text: 'Where each line touches the circle, that is where that element of the dome stops.' },
        { text: 'Dot every one of them.' },
      ],
      markLines: [0, 0, 0, 1],
      marks: [
        line(pt(DOME.AX, DOME.PLAN.y - DOME.R - 8), pt(DOME.AX, DOME.PLAN.y + DOME.R + 8), 'centre'),
        line(pt(DOME.AX - DOME.R - 8, DOME.PLAN.y), pt(DOME.AX + DOME.R + 8, DOME.PLAN.y), 'centre'),
        { kind: 'circle', style: 'outline', c: DOME.PLAN, r: DOME.R },
        { kind: 'dim', a: pt(DOME.AX - DOME.R, DOME.PLAN.y), b: pt(DOME.AX + DOME.R, DOME.PLAN.y), offset: 34, label: 'Ø50' },
        ...numberedPlan(DOME.PLAN, DOME.R, 12, 180),
        ...[0, 1, 2, 3, 4, 5, 6].flatMap((index) => {
          const station = DOME.marked[index];
          const x = DOME.AX + station.offset;
          const onShell = DOME.SHELL.y - Math.sqrt(
            Math.max(0, DOME.SHELL_R * DOME.SHELL_R - station.offset * station.offset)
          );
          return [
            line(pt(x, DOME.PLAN.y - DOME.R * Math.sin(rad(station.angle))), pt(x, onShell), 'construction'),
            dot(pt(x, onShell)),
          ];
        }),
      ],
    },
    {
      id: 'dome-template',
      title: 'Develop the dome plate',
      tool: 'tsquare',
      teeY: DOME.DEV.y,
      focus: { at: pt(263, 175), r: 105 },
      tip: 'Girth = π × 50 = 157.1 mm. The plate runs 40 at the ends and 45.5 at the sides — a gentle wave, but a real one.',
      lines: [
        { text: 'Stretch-out to the right. Pi times fifty — one hundred and fifty seven point one.' },
        { text: 'Twelve divisions, a light line up from each.' },
        { text: 'Carry the heights across from the elevation. Top of the dome down to the shell.' },
        { text: 'Element one is forty. Element four is forty five and a half.' },
        { text: 'Plot them all and join with a smooth curve.' },
        { text: 'Two shallow humps, because the dome dips onto the shell twice going round.' },
        { text: 'That is the dome plate. Roll it, and it beds down on the boiler with no gap to fill.' },
      ],
      markLines: [0, 1, 2, 4],
      marks: [
        line(DOME.DEV, pt(DOME.DEV.x + DOME.G, DOME.DEV.y), 'construction'),
        { kind: 'dim', a: DOME.DEV, b: pt(DOME.DEV.x + DOME.G, DOME.DEV.y), offset: -12, label: 'GIRTH 157.1' },
        ...stretchTicks(DOME.DEV, DOME.R, 56),
        ...Array.from({ length: 13 }, (_, index) => {
          const station = DOME.marked[index % 12];
          return dot(
            pt(
              DOME.DEV.x + (DOME.G * index) / 12,
              DOME.DEV.y - saddleCut(DOME.HEIGHT, DOME.SHELL_R, DOME.R, station.angle)
            )
          );
        }),
        poly(saddleCurve(DOME.DEV, DOME.R, DOME.SHELL_R, DOME.HEIGHT, 180, 160), 'outline'),
        line(DOME.DEV, pt(DOME.DEV.x, DOME.DEV.y - saddleCut(DOME.HEIGHT, DOME.SHELL_R, DOME.R, 180)), 'outline'),
        line(
          pt(DOME.DEV.x + DOME.G, DOME.DEV.y),
          pt(DOME.DEV.x + DOME.G, DOME.DEV.y - saddleCut(DOME.HEIGHT, DOME.SHELL_R, DOME.R, 180)),
          'outline'
        ),
        line(DOME.DEV, pt(DOME.DEV.x + DOME.G, DOME.DEV.y), 'outline'),
        text(pt(DOME.DEV.x + DOME.G / 2, DOME.DEV.y + 12), 'DOME PLATE', 3.6, { bold: true }),
      ],
    },
    {
      id: 'dome-seat',
      title: 'The hole in the shell',
      tool: 'pencil',
      focus: { at: DOME.HOLE, r: 62 },
      tip: 'Round the shell the hole opens to 51.6, along it stays 50. Mark a 50 circle and the dome will not go in.',
      lines: [
        { text: 'One more template. The hole to cut in the boiler shell.' },
        { text: 'Along the boiler, the plate is straight, so the hole stays fifty.' },
        { text: 'Round the boiler, the plate is curved, so the hole has to open out.' },
        { text: 'Fifty one point six, measured round the plate as an arc.' },
        { text: 'It is only one and a half millimetres. But the dome is either in the hole or it is not.' },
        { text: 'Draw the oval, wrap the template on the shell, scribe it, and burn it out.' },
        { text: 'The smaller the boiler, the bigger that difference gets. Never assume a circle.' },
      ],
      markLines: [5, 5],
      marks: [
        poly(saddleHoleInShell(DOME.HOLE, DOME.R, DOME.SHELL_R, 96), 'outline', true),
        line(pt(DOME.HOLE.x - 34, DOME.HOLE.y), pt(DOME.HOLE.x + 34, DOME.HOLE.y), 'centre'),
        line(pt(DOME.HOLE.x, DOME.HOLE.y - 34), pt(DOME.HOLE.x, DOME.HOLE.y + 34), 'centre'),
        {
          kind: 'dim',
          a: pt(DOME.HOLE.x - DOME.SHELL_R * Math.asin(DOME.R / DOME.SHELL_R), DOME.HOLE.y),
          b: pt(DOME.HOLE.x + DOME.SHELL_R * Math.asin(DOME.R / DOME.SHELL_R), DOME.HOLE.y),
          offset: -38,
          label: 'ROUND SHELL 51.6',
        },
        text(pt(DOME.HOLE.x, DOME.HOLE.y - 40), 'SEAT TEMPLATE', 3.2, { bold: true }),
      ],
    },
  ],
};

/* ==========================================================================
 * 5 — A connecting pipe between a boiler and a superheater
 * ======================================================================== */

const LINK = (() => {
  const R = 25;
  const AX = 95;
  const HEADER = pt(AX, 58);
  const HEADER_R = 40;
  const SHELL = pt(AX, 250);
  const SHELL_R = 70;
  const SECTION_Y = 142;
  const DEV = pt(185, SHELL.y);
  const G = girth(R);
  const marked = stations(R, 12, 180);
  const topY = (offset: number) => HEADER.y + Math.sqrt(Math.max(0, HEADER_R * HEADER_R - offset * offset));
  const bottomY = (offset: number) => SHELL.y - Math.sqrt(Math.max(0, SHELL_R * SHELL_R - offset * offset));
  return { R, AX, HEADER, HEADER_R, SHELL, SHELL_R, SECTION_Y, DEV, G, marked, topY, bottomY };
})();

const CONNECTING_PIPE: DrawTopic = {
  id: 'dev-boiler-superheater-pipe',
  title: 'Development of a connecting pipe between a boiler and a superheater',
  subtitle: 'One pipe, saddled at both ends — onto a big shell below and a small header above.',
  goal: 'Develop a pipe that is cut to two different curved surfaces, taking the length of every element between the two.',
  minutes: 50,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Compass', 'Scale rule', 'HB and 2H pencils'],
  base: fabSheet({ title: 'BOILER TO SUPERHEATER PIPE', number: 'F-25', scale: '1:1' }),
  steps: [
    {
      id: 'link-idea',
      title: 'Cut at both ends',
      tool: 'hand',
      focus: { at: pt(120, 150), r: 150 },
      tip: 'Two saddles on one pipe. Neither end is straight, and the two curves are different because the two cylinders are different sizes.',
      lines: [
        { text: 'Steam leaves the boiler and goes up to the superheater header to be dried out.' },
        { text: 'The pipe between them has a problem at both ends.' },
        { text: 'At the bottom it sits on the boiler shell — a big cylinder, seventy radius.' },
        { text: 'At the top it fits under the superheater header — a small one, forty radius.' },
        { text: 'So both ends are saddles, and they are different saddles.' },
        { text: 'Nothing new in the method. Just twice as many ordinates.' },
        { text: 'The pipe itself is fifty diameter and it runs straight between them.' },
      ],
      marks: [],
    },
    {
      id: 'link-elevation',
      title: 'Draw both vessels and the pipe',
      tool: 'compass',
      compassRadius: LINK.HEADER_R,
      focus: { at: pt(95, 150), r: 130 },
      tip: 'Draw the two cylinders first, in the end view, then run the pipe between them. The pipe is trimmed by whatever it meets.',
      lines: [
        { text: 'Centre line down the sheet — both vessels and the pipe share it.' },
        { text: 'The superheater header at the top. Circle, forty radius.' },
        { text: 'The boiler shell at the bottom. Only the crown of it fits on the paper, so draw the arc.' },
        { text: 'Seventy radius, struck from a centre well below the sheet line.' },
        { text: 'Now the pipe. Twenty five each side of the centre line, running from one to the other.' },
        { text: 'Stop the sides where they meet each curve. They do not go through.' },
      ],
      markLines: [0, 1, 3, 4, 4],
      marks: [
        line(pt(LINK.AX, 14), pt(LINK.AX, 214), 'centre'),
        { kind: 'circle', style: 'outline', c: LINK.HEADER, r: LINK.HEADER_R },
        { kind: 'arc', style: 'outline', c: LINK.SHELL, r: LINK.SHELL_R, from: 45, to: 135 },
        line(pt(LINK.AX - LINK.R, LINK.topY(-LINK.R)), pt(LINK.AX - LINK.R, LINK.bottomY(-LINK.R)), 'outline'),
        line(pt(LINK.AX + LINK.R, LINK.topY(LINK.R)), pt(LINK.AX + LINK.R, LINK.bottomY(LINK.R)), 'outline'),
        text(pt(LINK.AX, LINK.HEADER.y), 'HEADER', 3, { colour: '#64748b' }),
        text(pt(LINK.AX, LINK.SHELL.y - LINK.SHELL_R + 9), 'BOILER SHELL', 3, { colour: '#64748b' }),
      ],
    },
    {
      id: 'link-halfplan',
      title: 'A half plan on the pipe itself',
      tool: 'compass',
      compassRadius: LINK.R,
      focus: { at: pt(95, 150), r: 62 },
      tip: 'When there is no room for a plan, draw a half section square across the pipe. Six divisions give you all twelve by symmetry.',
      lines: [
        { text: 'We need the twelve divisions, but there is no room for a plan view.' },
        { text: 'So do what a plater does. Draw the section straight onto the pipe.' },
        { text: 'A line square across, and a half circle on it, twenty five radius.' },
        { text: 'Divide the half circle into six. That gives you all twelve, by symmetry.' },
        { text: 'Number one to seven, left to right.' },
        { text: 'Now project each one up and down, to both curves.' },
        { text: 'Every line gives two dots — one on the header, one on the shell.' },
      ],
      markLines: [2, 2, 3],
      marks: [
        line(pt(LINK.AX - LINK.R, LINK.SECTION_Y), pt(LINK.AX + LINK.R, LINK.SECTION_Y), 'thin'),
        { kind: 'arc', style: 'thin', c: pt(LINK.AX, LINK.SECTION_Y), r: LINK.R, from: 180, to: 360 },
        ...[0, 1, 2, 3, 4, 5, 6].flatMap((index) => {
          const station = LINK.marked[index];
          const x = LINK.AX + station.offset;
          return [
            line(pt(x, LINK.topY(station.offset)), pt(x, LINK.bottomY(station.offset)), 'construction'),
            dot(pt(x, LINK.topY(station.offset))),
            dot(pt(x, LINK.bottomY(station.offset))),
          ];
        }),
        ...[0, 1, 2, 3, 4, 5, 6].map((index) =>
          text(
            pt(LINK.AX + LINK.marked[index].offset, LINK.SECTION_Y + LINK.R * Math.abs(Math.sin(rad(LINK.marked[index].angle))) + 5),
            String(index + 1),
            2.4,
            { colour: '#64748b' }
          )
        ),
      ],
    },
    {
      id: 'link-template',
      title: 'Two curves on one stretch-out',
      tool: 'tsquare',
      teeY: LINK.DEV.y,
      focus: { at: pt(263, 145), r: 130 },
      tip: 'The plate is shortest where both ends are flattest — at 1 and 7 — and longest at the sides. 80 against 93.4.',
      lines: [
        { text: 'Stretch-out on the right. Pi times fifty, one hundred and fifty seven point one.' },
        { text: 'Twelve divisions, line up from each one.' },
        { text: 'Now carry both sets of heights across. The header dots first.' },
        { text: 'Then the shell dots. Same levels, straight across, no measuring.' },
        { text: 'Plot and join. Two curves, and the plate is the strip between them.' },
        { text: 'Element one is eighty long. Element four is ninety three and a half.' },
        { text: 'Thirteen millimetres of difference on a fifty bore pipe. That is why you draw it.' },
      ],
      markLines: [0, 1, 2, 3, 4],
      marks: [
        line(LINK.DEV, pt(LINK.DEV.x + LINK.G, LINK.DEV.y), 'construction'),
        { kind: 'dim', a: LINK.DEV, b: pt(LINK.DEV.x + LINK.G, LINK.DEV.y), offset: -6, label: 'GIRTH 157.1' },
        ...stretchTicks(LINK.DEV, LINK.R, 172),
        ...Array.from({ length: 13 }, (_, index) => {
          const station = LINK.marked[index % 12];
          return dot(pt(LINK.DEV.x + (LINK.G * index) / 12, LINK.bottomY(station.offset)));
        }),
        ...Array.from({ length: 13 }, (_, index) => {
          const station = LINK.marked[index % 12];
          return dot(pt(LINK.DEV.x + (LINK.G * index) / 12, LINK.topY(station.offset)));
        }),
        poly(
          sampleCurve(0, 1, 160, (t) => {
            const offset = LINK.R * Math.cos(rad(180 + t * 360));
            return pt(LINK.DEV.x + LINK.G * t, LINK.bottomY(offset));
          }),
          'outline'
        ),
        poly(
          sampleCurve(0, 1, 160, (t) => {
            const offset = LINK.R * Math.cos(rad(180 + t * 360));
            return pt(LINK.DEV.x + LINK.G * t, LINK.topY(offset));
          }),
          'outline'
        ),
        line(pt(LINK.DEV.x, LINK.bottomY(-LINK.R)), pt(LINK.DEV.x, LINK.topY(-LINK.R)), 'outline'),
        line(pt(LINK.DEV.x + LINK.G, LINK.bottomY(-LINK.R)), pt(LINK.DEV.x + LINK.G, LINK.topY(-LINK.R)), 'outline'),
        text(pt(LINK.DEV.x + LINK.G / 2, 145), 'PIPE TEMPLATE', 3.6, { bold: true }),
      ],
    },
  ],
};

/* ==========================================================================
 * 6 — The plate forming the overhanging front of a boiler
 * ======================================================================== */

const FRONT = (() => {
  /** Full-size sizes, in millimetres; the sheet is drawn at 1:5. */
  const SHELL_OD = 500;
  const OVERHANG = 30;
  const PLATE_OD = SHELL_OD + 2 * OVERHANG;
  const THICKNESS = 12;
  const BEND_R = 25;
  const FLANGE = 55;
  /** Radius on the flat face where the bend begins. */
  const TANGENT_R = PLATE_OD / 2 - (BEND_R + THICKNESS);
  const ALLOWANCE = bendAllowance(90, BEND_R, THICKNESS);
  const BLANK_R = TANGENT_R + ALLOWANCE + FLANGE;

  const S = 1 / 5;
  const AXIS_Y = 150;
  const FACE_X = 118;
  const BLANK = pt(288, 152);
  return {
    SHELL_OD,
    OVERHANG,
    PLATE_OD,
    THICKNESS,
    BEND_R,
    FLANGE,
    TANGENT_R,
    ALLOWANCE,
    BLANK_R,
    S,
    AXIS_Y,
    FACE_X,
    BLANK,
  };
})();

const BOILER_FRONT: DrawTopic = {
  id: 'dev-boiler-front',
  title: 'Development of a plate forming the overhanging front of a boiler',
  subtitle: 'A flanged front plate that stands proud of the shell — and the blank it is cut from.',
  goal: 'Set out the half section of a flanged overhanging front and calculate the blank, working the bend allowance on the neutral line.',
  minutes: 40,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'Scale rule', 'Calculator', 'HB and 2H pencils'],
  base: fabSheet({ title: 'OVERHANGING BOILER FRONT', number: 'F-26', scale: '1:5' }),
  steps: [
    {
      id: 'front-idea',
      title: 'Why this one is arithmetic, not ordinates',
      tool: 'hand',
      focus: { at: pt(200, 150), r: 165 },
      tip: 'A flanged plate is developed on the neutral line — halfway through the thickness. Plate stretches on the outside of a bend and squeezes on the inside; the middle does neither.',
      lines: [
        { text: 'This one is different. There is no rolling and no ordinates.' },
        { text: 'The front of the boiler is one flat plate with its rim turned back — flanged.' },
        { text: 'The turned rim fits over the shell. The flat part stands proud of it — it overhangs.' },
        { text: 'So the development is a plain circle. The only question is how big.' },
        { text: 'And that is where the bend catches people out.' },
        { text: 'When you bend plate, the outside stretches and the inside squeezes.' },
        { text: 'Only the middle of the thickness stays the same length. That line is the neutral line.' },
        { text: 'Measure the blank on the neutral line and it comes out right. Any other line and it does not.' },
      ],
      marks: [],
    },
    {
      id: 'front-section',
      title: 'Half section through the front',
      tool: 'tsquare',
      teeY: FRONT.AXIS_Y,
      focus: { at: pt(100, 118), r: 84 },
      tip: 'Overhang = (560 − 500) ÷ 2 = 30 all round.',
      lines: [
        { text: 'Draw a half section — the boiler cut down the middle, top half only.' },
        { text: 'Centre line of the boiler, straight across.' },
        { text: 'The shell, five hundred outside diameter. At one to five that is fifty up from the centre.' },
        { text: 'Now the front plate. Five hundred and sixty outside — fifty six up.' },
        { text: 'The difference is the overhang. Thirty millimetres, all the way round.' },
        { text: 'The rim is flanged back fifty five, and it fits over the shell.' },
        { text: 'And the corner is not sharp. It is bent on a twenty five radius inside.' },
      ],
      markLines: [1, 2, 3, 5, 5, 6],
      marks: [
        line(pt(30, FRONT.AXIS_Y), pt(160, FRONT.AXIS_Y), 'centre'),
        line(pt(30, FRONT.AXIS_Y - FRONT.SHELL_OD / 2 * FRONT.S), pt(FRONT.FACE_X, FRONT.AXIS_Y - FRONT.SHELL_OD / 2 * FRONT.S), 'outline'),
        line(
          pt(FRONT.FACE_X, FRONT.AXIS_Y - FRONT.TANGENT_R * FRONT.S),
          pt(FRONT.FACE_X, FRONT.AXIS_Y),
          'outline'
        ),
        line(
          pt(FRONT.FACE_X - FRONT.FLANGE * FRONT.S, FRONT.AXIS_Y - FRONT.PLATE_OD / 2 * FRONT.S),
          pt(FRONT.FACE_X - (FRONT.BEND_R + FRONT.THICKNESS) * FRONT.S, FRONT.AXIS_Y - FRONT.PLATE_OD / 2 * FRONT.S),
          'outline'
        ),
        line(
          pt(FRONT.FACE_X - FRONT.FLANGE * FRONT.S, FRONT.AXIS_Y - (FRONT.PLATE_OD / 2 - FRONT.THICKNESS) * FRONT.S),
          pt(FRONT.FACE_X - (FRONT.BEND_R + FRONT.THICKNESS) * FRONT.S, FRONT.AXIS_Y - (FRONT.PLATE_OD / 2 - FRONT.THICKNESS) * FRONT.S),
          'outline'
        ),
        {
          kind: 'arc',
          style: 'outline',
          c: pt(FRONT.FACE_X - (FRONT.BEND_R + FRONT.THICKNESS) * FRONT.S, FRONT.AXIS_Y - FRONT.TANGENT_R * FRONT.S),
          r: (FRONT.BEND_R + FRONT.THICKNESS) * FRONT.S,
          from: 0,
          to: 90,
        },
        {
          kind: 'arc',
          style: 'outline',
          c: pt(FRONT.FACE_X - (FRONT.BEND_R + FRONT.THICKNESS) * FRONT.S, FRONT.AXIS_Y - FRONT.TANGENT_R * FRONT.S),
          r: FRONT.BEND_R * FRONT.S,
          from: 0,
          to: 90,
        },
        line(
          pt(FRONT.FACE_X - FRONT.THICKNESS * FRONT.S, FRONT.AXIS_Y - FRONT.TANGENT_R * FRONT.S),
          pt(FRONT.FACE_X - FRONT.THICKNESS * FRONT.S, FRONT.AXIS_Y),
          'outline'
        ),
        {
          kind: 'dim',
          a: pt(FRONT.FACE_X - 3, FRONT.AXIS_Y - FRONT.SHELL_OD / 2 * FRONT.S),
          b: pt(FRONT.FACE_X - 3, FRONT.AXIS_Y - FRONT.PLATE_OD / 2 * FRONT.S),
          offset: -26,
          label: 'OVERHANG 30',
        },
      ],
    },
    {
      id: 'front-neutral',
      title: 'Walk the neutral line',
      tool: 'pencil',
      focus: { at: pt(95, 205), r: 92 },
      tip: 'Bend allowance = (π/180) × angle × (inside radius + half the thickness). Here (π/2) × 31 = 48.7 mm.',
      lines: [
        { text: 'Now walk the neutral line, from the centre outwards, in three pieces.' },
        { text: 'First the flat part, out to where the bend starts. Two hundred and forty three.' },
        { text: 'Then round the bend. Not the inside, not the outside — the middle.' },
        { text: 'Twenty five inside radius, plus half of twelve, is thirty one.' },
        { text: 'A quarter turn of a thirty one radius is pi over two times thirty one. Forty eight point seven.' },
        { text: 'Then the straight flange. Fifty five.' },
        { text: 'Add them. Two forty three, plus forty eight point seven, plus fifty five.' },
        { text: 'Three hundred and forty six point seven. That is the radius of the flat blank.' },
      ],
      marks: [
        text(pt(34, 196), 'BLANK CALCULATION', 3.4, { align: 'left', bold: true }),
        text(pt(34, 205), 'FLAT TO TANGENT      R = 243.0', 3, { align: 'left' }),
        text(pt(34, 213), 'BEND ALLOWANCE   = (π/2)(25 + 12/2)', 3, { align: 'left' }),
        text(pt(34, 221), '                                    =  48.7', 3, { align: 'left' }),
        text(pt(34, 229), 'STRAIGHT FLANGE   =  55.0', 3, { align: 'left' }),
        line(pt(34, 234), pt(158, 234), 'thin'),
        text(pt(34, 241), 'BLANK RADIUS          = 346.7', 3.2, { align: 'left', bold: true }),
        text(pt(34, 250), 'BLANK DIAMETER    = 693.4', 3.2, { align: 'left', bold: true }),
      ],
    },
    {
      id: 'front-blank',
      title: 'Strike the blank',
      tool: 'compass',
      compassRadius: FRONT.BLANK_R * FRONT.S,
      focus: { at: FRONT.BLANK, r: 88 },
      tip: 'Mark the bend line on the blank before it leaves the marking-off table. Once the plate is in the press it is too late.',
      lines: [
        { text: 'Now the blank itself. One circle, six hundred and ninety three point four across.' },
        { text: 'At one to five that is a hundred and thirty eight point seven on the paper.' },
        { text: 'Swing it from the centre.' },
        { text: 'Then, inside it, put the bend line on — two hundred and forty three radius.' },
        { text: 'That is where the plate leaves the flat and goes into the press.' },
        { text: 'Mark it while the plate is flat and on the table. You cannot mark it afterwards.' },
        { text: 'Everything outside that line becomes the flange. Everything inside stays the front.' },
      ],
      markLines: [0, 2, 3, 3],
      marks: [
        line(pt(FRONT.BLANK.x - FRONT.BLANK_R * FRONT.S - 8, FRONT.BLANK.y), pt(FRONT.BLANK.x + FRONT.BLANK_R * FRONT.S + 8, FRONT.BLANK.y), 'centre'),
        line(pt(FRONT.BLANK.x, FRONT.BLANK.y - FRONT.BLANK_R * FRONT.S - 8), pt(FRONT.BLANK.x, FRONT.BLANK.y + FRONT.BLANK_R * FRONT.S + 8), 'centre'),
        { kind: 'circle', style: 'outline', c: FRONT.BLANK, r: FRONT.BLANK_R * FRONT.S },
        { kind: 'circle', style: 'phantom', c: FRONT.BLANK, r: FRONT.TANGENT_R * FRONT.S },
        {
          kind: 'dim',
          a: pt(FRONT.BLANK.x - FRONT.BLANK_R * FRONT.S, FRONT.BLANK.y),
          b: pt(FRONT.BLANK.x + FRONT.BLANK_R * FRONT.S, FRONT.BLANK.y),
          offset: -78,
          label: 'Ø693.4 BLANK',
        },
        text(pt(FRONT.BLANK.x, FRONT.BLANK.y - FRONT.TANGENT_R * FRONT.S - 5), 'BEND LINE R243', 2.8, { colour: '#6d28d9' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 7 — The plates of an egg-ended boiler
 * ======================================================================== */

const EGG = (() => {
  /** Drawn 1:20. Barrel 1200 diameter × 2400 long, ends 900 deep. */
  const R = 30;
  const LENGTH = 120;
  const DEPTH = 22.5;
  const AXIS_Y = 62;
  const LEFT = 45;
  const RIGHT = LEFT + LENGTH;
  const GORES = 8;
  const profile = meridian(eggProfile(R, DEPTH), 160);
  const MERIDIAN_LENGTH = profile[profile.length - 1].along;
  const BARREL = pt(200, 25);
  const BARREL_GIRTH = girth(R);
  const GORE = pt(62, 152);
  const END_VIEW = pt(150, 205);
  return {
    R,
    LENGTH,
    DEPTH,
    AXIS_Y,
    LEFT,
    RIGHT,
    GORES,
    profile,
    MERIDIAN_LENGTH,
    BARREL,
    BARREL_GIRTH,
    GORE,
    END_VIEW,
  };
})();

const EGG_ENDED_BOILER: DrawTopic = {
  id: 'dev-egg-ended-boiler',
  title: 'Development of the plates of an egg-ended boiler',
  subtitle: 'A barrel that unrolls into a rectangle, and two ends that unroll into nothing at all.',
  goal: 'Develop the barrel strakes and set out one gore of an egg end, understanding why a curved end can only be approximated.',
  minutes: 50,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'Scale rule', 'French curve', 'HB and 2H pencils'],
  base: fabSheet({ title: 'EGG-ENDED BOILER PLATES', number: 'F-27', scale: '1:20' }),
  steps: [
    {
      id: 'egg-idea',
      title: 'One shape develops, one does not',
      tool: 'hand',
      focus: { at: pt(200, 120), r: 175 },
      tip: 'A cylinder and a cone are developable — they unroll exactly. A sphere or an egg end is not, so it is plated in gores and the plate is dished.',
      lines: [
        { text: 'An egg-ended boiler is a barrel with a rounded end stuck on each end.' },
        { text: 'The barrel is a cylinder. Cut it down one side and it unrolls flat, perfectly.' },
        { text: 'Now the ends. They are curved two ways at once — round, and round again.' },
        { text: 'You cannot unroll that. Not exactly. Not ever. Try it with an orange peel.' },
        { text: 'So it is done in strips, like an orange is peeled. Each strip is called a gore.' },
        { text: 'Each gore is narrow enough that the little bit of stretch left in it can be dished out.' },
        { text: 'That is the whole trade in one sentence: exact for the barrel, approximate for the end.' },
      ],
      marks: [],
    },
    {
      id: 'egg-elevation',
      title: 'Draw the boiler',
      tool: 'tsquare',
      teeY: EGG.AXIS_Y,
      focus: { at: pt(105, 62), r: 92 },
      lines: [
        { text: 'Centre line first, all the way across.' },
        { text: 'The barrel. Twelve hundred diameter — at one to twenty, thirty each side.' },
        { text: 'Twenty four hundred long, so a hundred and twenty on the paper.' },
        { text: 'Now the ends. Nine hundred deep, so twenty two and a half each end.' },
        { text: 'They are not half circles. They are half ellipses — deeper than a hemisphere is flat.' },
        { text: 'Draw them through, top and bottom, and the boiler is there.' },
      ],
      markLines: [0, 1, 2, 3],
      marks: [
        line(pt(14, EGG.AXIS_Y), pt(200, EGG.AXIS_Y), 'centre'),
        line(pt(EGG.LEFT, EGG.AXIS_Y - EGG.R), pt(EGG.RIGHT, EGG.AXIS_Y - EGG.R), 'outline'),
        line(pt(EGG.LEFT, EGG.AXIS_Y + EGG.R), pt(EGG.RIGHT, EGG.AXIS_Y + EGG.R), 'outline'),
        line(pt(EGG.LEFT, EGG.AXIS_Y - EGG.R), pt(EGG.LEFT, EGG.AXIS_Y + EGG.R), 'thin'),
        line(pt(EGG.RIGHT, EGG.AXIS_Y - EGG.R), pt(EGG.RIGHT, EGG.AXIS_Y + EGG.R), 'thin'),
        poly(
          EGG.profile.map((station) => pt(EGG.LEFT - EGG.DEPTH + station.rise, EGG.AXIS_Y - station.radius)),
          'outline'
        ),
        poly(
          EGG.profile.map((station) => pt(EGG.LEFT - EGG.DEPTH + station.rise, EGG.AXIS_Y + station.radius)),
          'outline'
        ),
        poly(
          EGG.profile.map((station) => pt(EGG.RIGHT + EGG.DEPTH - station.rise, EGG.AXIS_Y - station.radius)),
          'outline'
        ),
        poly(
          EGG.profile.map((station) => pt(EGG.RIGHT + EGG.DEPTH - station.rise, EGG.AXIS_Y + station.radius)),
          'outline'
        ),
        { kind: 'dim', a: pt(EGG.LEFT, EGG.AXIS_Y + EGG.R), b: pt(EGG.RIGHT, EGG.AXIS_Y + EGG.R), offset: -30, label: '2400' },
      ],
    },
    {
      id: 'egg-barrel',
      title: 'The barrel plate is a rectangle',
      tool: 'tsquare',
      teeY: EGG.BARREL.y,
      focus: { at: pt(294, 85), r: 105 },
      tip: 'Girth = π × 1200 = 3770 mm. At 1:20 that is 188.5 on the sheet — the same number as a 60 mm pipe at full size, which is worth noticing.',
      lines: [
        { text: 'The barrel first, because it is the easy one.' },
        { text: 'Cut a cylinder along one line and roll it out. You get a rectangle. Nothing else.' },
        { text: 'One side is the length — twenty four hundred.' },
        { text: 'The other is the girth — pi times twelve hundred. Three thousand seven hundred and seventy.' },
        { text: 'Nobody rolls a plate that big in one piece, so it is made in strakes.' },
        { text: 'Two here, each twelve hundred wide, with the seams staggered on the real job.' },
        { text: 'Add lap for the riveting or the weld prep. The drawing gives the finished size.' },
      ],
      markLines: [1, 2, 3, 5],
      marks: [
        poly(
          [
            EGG.BARREL,
            pt(EGG.BARREL.x + EGG.BARREL_GIRTH, EGG.BARREL.y),
            pt(EGG.BARREL.x + EGG.BARREL_GIRTH, EGG.BARREL.y + EGG.LENGTH),
            pt(EGG.BARREL.x, EGG.BARREL.y + EGG.LENGTH),
          ],
          'outline',
          true
        ),
        {
          kind: 'dim',
          a: pt(EGG.BARREL.x, EGG.BARREL.y + EGG.LENGTH),
          b: pt(EGG.BARREL.x + EGG.BARREL_GIRTH, EGG.BARREL.y + EGG.LENGTH),
          offset: -14,
          label: 'GIRTH 3770',
        },
        {
          kind: 'dim',
          a: pt(EGG.BARREL.x + EGG.BARREL_GIRTH, EGG.BARREL.y),
          b: pt(EGG.BARREL.x + EGG.BARREL_GIRTH, EGG.BARREL.y + EGG.LENGTH),
          offset: -16,
          label: '2400',
        },
        line(
          pt(EGG.BARREL.x, EGG.BARREL.y + EGG.LENGTH / 2),
          pt(EGG.BARREL.x + EGG.BARREL_GIRTH, EGG.BARREL.y + EGG.LENGTH / 2),
          'phantom'
        ),
        text(pt(EGG.BARREL.x + EGG.BARREL_GIRTH / 2, EGG.BARREL.y + EGG.LENGTH / 4), 'STRAKE 1', 3.4, { bold: true }),
        text(pt(EGG.BARREL.x + EGG.BARREL_GIRTH / 2, EGG.BARREL.y + (3 * EGG.LENGTH) / 4), 'STRAKE 2', 3.4, { bold: true }),
      ],
    },
    {
      id: 'egg-gore',
      title: 'One gore of the end',
      tool: 'pencil',
      focus: { at: pt(105, 195), r: 105 },
      tip: 'Gore half-width = π × radius ÷ number of gores. Its length is the arc length of the meridian, not the depth of the end.',
      lines: [
        { text: 'Now one gore. Eight of them make the end, so each one carries an eighth of the way round.' },
        { text: 'Its length first. Not the depth of the end — the distance over the curve.' },
        { text: 'Walk the curve from the crown to the joint. That comes to eight hundred and twenty nine.' },
        { text: 'The end is only nine hundred deep, but over the curve it is eight two nine. Longer than it looks.' },
        { text: 'Now its width. At any point, the gore has to carry an eighth of that circle of latitude.' },
        { text: 'So half the width is pi times the radius there, divided by eight.' },
        { text: 'At the joint the radius is six hundred, so the half width is two hundred and thirty six.' },
        { text: 'At the crown the radius is nothing, so the gore comes to a point. Plot it and join it.' },
      ],
      markLines: [4, 5, 7],
      marks: [
        line(pt(EGG.GORE.x, EGG.GORE.y - 6), pt(EGG.GORE.x, EGG.GORE.y + EGG.MERIDIAN_LENGTH + 6), 'centre'),
        poly(goreOutline(EGG.GORE, EGG.profile, EGG.GORES), 'outline', true),
        {
          kind: 'dim',
          a: pt(EGG.GORE.x - (Math.PI * EGG.R) / EGG.GORES, EGG.GORE.y + EGG.MERIDIAN_LENGTH),
          b: pt(EGG.GORE.x + (Math.PI * EGG.R) / EGG.GORES, EGG.GORE.y + EGG.MERIDIAN_LENGTH),
          offset: -14,
          label: '471',
        },
        {
          kind: 'dim',
          a: pt(EGG.GORE.x + 16, EGG.GORE.y),
          b: pt(EGG.GORE.x + 16, EGG.GORE.y + EGG.MERIDIAN_LENGTH),
          offset: -12,
          label: '829 ON THE CURVE',
        },
        text(pt(EGG.GORE.x, EGG.GORE.y + EGG.MERIDIAN_LENGTH + 22), 'ONE GORE OF EIGHT', 3.2, { bold: true }),
      ],
    },
    {
      id: 'egg-end-view',
      title: 'Eight gores and a crown plate',
      tool: 'compass',
      compassRadius: EGG.R,
      focus: { at: EGG.END_VIEW, r: 58 },
      tip: 'More gores means less dishing per plate but more welding. Eight is the usual compromise on a boiler this size.',
      lines: [
        { text: 'Look at the end face on. Eight gores round it, like the segments of an orange.' },
        { text: 'They all come to a point at the middle, and you cannot weld eight points together.' },
        { text: 'So the middle is cut off and a round crown plate is put in instead.' },
        { text: 'Every gore is the same template. Mark one, cut eight.' },
        { text: 'Each one is then dished — pressed or hammered — to take up the little bit that would not lie flat.' },
        { text: 'More gores, less dishing, more welding. Eight is the usual bargain.' },
      ],
      markLines: [0, 0, 2],
      marks: [
        { kind: 'circle', style: 'outline', c: EGG.END_VIEW, r: EGG.R },
        ...Array.from({ length: EGG.GORES }, (_, index) => {
          const angle = (index * 360) / EGG.GORES;
          return line(
            pt(EGG.END_VIEW.x + 9 * Math.cos(rad(angle)), EGG.END_VIEW.y - 9 * Math.sin(rad(angle))),
            pt(EGG.END_VIEW.x + EGG.R * Math.cos(rad(angle)), EGG.END_VIEW.y - EGG.R * Math.sin(rad(angle))),
            'thin'
          );
        }),
        { kind: 'circle', style: 'outline', c: EGG.END_VIEW, r: 9 },
        text(pt(EGG.END_VIEW.x, EGG.END_VIEW.y + EGG.R + 8), 'CROWN PLATE IN THE MIDDLE', 2.8, { colour: '#64748b' }),
      ],
    },
  ],
};

export const BOILER_TOPICS: DrawTopic[] = [BOILER_DOME, CONNECTING_PIPE, BOILER_FRONT, EGG_ENDED_BOILER];
