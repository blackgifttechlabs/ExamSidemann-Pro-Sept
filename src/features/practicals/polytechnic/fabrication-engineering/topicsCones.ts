/**
 * Cone work, and the two sums that go with it.
 *
 * A cone develops into a sector — exactly, with no approximation anywhere. The
 * difficulty is never the geometry, it is the size: on any shallow taper the
 * apex lands somewhere off the edge of the board, and a compass that will not
 * open to 300 mm is no use at all. So the pattern is set out from a **chord and
 * a rise** instead, which is what these two lessons are really about.
 */

import { polar, pt, rad, type Mark, type Pt } from '../technical-drawing/drawingGeometry';
import type { DrawTopic } from '../technical-drawing/drawingLessonTypes';
import {
  coneDevelopment,
  fabSheet,
  line,
  radiusFromChordAndRise,
  riseFromChordAndRadius,
  text,
} from './fabricationGeometry';

const dot = (at: Pt): Mark => ({ kind: 'dot', style: 'outline', at });

/* ==========================================================================
 * 8 — The taper of a frustum of a cone, not continued to a point
 * ======================================================================== */

const FRUSTUM = (() => {
  const BIG_R = 50;
  const SMALL_R = 40;
  const HEIGHT = 60;
  const dev = coneDevelopment(BIG_R, SMALL_R, HEIGHT);
  /** Where the crown of the big-end arc sits on the sheet. */
  const CROWN = pt(205, 108);
  /** The apex, which is deliberately a long way below the paper. */
  const APEX = pt(CROWN.x, CROWN.y + dev.slant);
  const half = dev.sector / 2;
  const innerChord = 2 * dev.innerSlant * Math.sin(rad(half));
  const innerRise = riseFromChordAndRadius(innerChord, dev.innerSlant);
  const BASE_Y = 85;
  const TOP_Y = BASE_Y - HEIGHT;
  const AX = 95;
  return { BIG_R, SMALL_R, HEIGHT, dev, CROWN, APEX, half, innerChord, innerRise, BASE_Y, TOP_Y, AX };
})();

/** The ordinates a batten is sprung through, measured off the chord. */
function batten(chordMid: Pt, halfChord: number, radius: number, rise: number, count = 4): Mark[] {
  const marks: Mark[] = [];
  for (let index = -count; index <= count; index += 1) {
    const d = (halfChord * index) / count;
    const height = Math.sqrt(Math.max(0, radius * radius - d * d)) - (radius - rise);
    marks.push(line(pt(chordMid.x + d, chordMid.y), pt(chordMid.x + d, chordMid.y - height), 'construction'));
    marks.push(dot(pt(chordMid.x + d, chordMid.y - height)));
  }
  return marks;
}

const CONE_FRUSTUM: DrawTopic = {
  id: 'dev-cone-frustum',
  title: 'Development of the taper of a frustum of a cone, not continued to a point',
  subtitle: 'A shallow taper whose apex is 300 mm off the edge of the board.',
  goal: 'Develop a frustum without using its apex, by calculating the developed radii and striking each arc from a chord and a rise.',
  minutes: 50,
  level: 'Exam',
  tools: ['T-square', 'Compass', 'Scale rule', 'Calculator', 'Batten or trammel', 'HB and 2H pencils'],
  base: fabSheet({ title: 'FRUSTUM NOT TO A POINT', number: 'F-28', scale: '1:1' }),
  steps: [
    {
      id: 'frustum-problem',
      title: 'The apex is off the paper',
      tool: 'hand',
      focus: { at: pt(200, 140), r: 175 },
      tip: 'A cone develops into a sector of a circle struck from the apex. The flatter the taper, the further away the apex goes.',
      lines: [
        { text: 'A cone opens out into a piece of a circle. A sector.' },
        { text: 'The centre of that circle is the apex of the cone, and the radius is its slant length.' },
        { text: 'That is easy on a steep cone. The apex is close.' },
        { text: 'But this job is a hundred at the bottom, eighty at the top, and sixty high.' },
        { text: 'A very gentle taper. Ten millimetres of it over sixty of height.' },
        { text: 'Carry those sides on and they do not meet until three hundred millimetres up.' },
        { text: 'The apex is off the board. So we develop it without ever going there.' },
      ],
      marks: [],
    },
    {
      id: 'frustum-elevation',
      title: 'Draw it and find the true lengths',
      tool: 'tsquare',
      teeY: FRUSTUM.BASE_Y,
      focus: { at: pt(95, 58), r: 70 },
      tip: 'The extreme element of a cone lies in the plane of the elevation, so its length on the paper is its true length. Only that element.',
      lines: [
        { text: 'Elevation first. Centre line, then the base, a hundred across.' },
        { text: 'Sixty up, and the top, eighty across.' },
        { text: 'Join the corners. That sloping side is a true length — sixty point eight three.' },
        { text: 'True, because that element lies flat in the plane you are drawing in.' },
        { text: 'Now the two radii we need. From the apex to the big end, and to the small end.' },
        { text: 'Similar triangles. The apex is three hundred above the base, so the big radius is…' },
        { text: 'Root of fifty squared plus three hundred squared. Three hundred and four point one.' },
        { text: 'And the small one is four fifths of that. Two hundred and forty three point three.' },
        { text: 'Check: the difference is sixty point eight three. The slant side. It has to be.' },
      ],
      markLines: [0, 0, 1, 1, 2],
      marks: [
        line(pt(FRUSTUM.AX, FRUSTUM.BASE_Y + 10), pt(FRUSTUM.AX, FRUSTUM.TOP_Y - 10), 'centre'),
        line(pt(FRUSTUM.AX - FRUSTUM.BIG_R, FRUSTUM.BASE_Y), pt(FRUSTUM.AX + FRUSTUM.BIG_R, FRUSTUM.BASE_Y), 'outline'),
        line(pt(FRUSTUM.AX - FRUSTUM.SMALL_R, FRUSTUM.TOP_Y), pt(FRUSTUM.AX + FRUSTUM.SMALL_R, FRUSTUM.TOP_Y), 'outline'),
        line(pt(FRUSTUM.AX - FRUSTUM.BIG_R, FRUSTUM.BASE_Y), pt(FRUSTUM.AX - FRUSTUM.SMALL_R, FRUSTUM.TOP_Y), 'outline'),
        line(pt(FRUSTUM.AX + FRUSTUM.BIG_R, FRUSTUM.BASE_Y), pt(FRUSTUM.AX + FRUSTUM.SMALL_R, FRUSTUM.TOP_Y), 'outline'),
        { kind: 'dim', a: pt(FRUSTUM.AX - FRUSTUM.BIG_R, FRUSTUM.BASE_Y), b: pt(FRUSTUM.AX + FRUSTUM.BIG_R, FRUSTUM.BASE_Y), offset: -14, label: 'Ø100' },
        { kind: 'dim', a: pt(FRUSTUM.AX + FRUSTUM.SMALL_R, FRUSTUM.TOP_Y), b: pt(FRUSTUM.AX - FRUSTUM.SMALL_R, FRUSTUM.TOP_Y), offset: -12, label: 'Ø80' },
        {
          kind: 'dim',
          a: pt(FRUSTUM.AX + FRUSTUM.BIG_R, FRUSTUM.BASE_Y),
          b: pt(FRUSTUM.AX + FRUSTUM.SMALL_R, FRUSTUM.TOP_Y),
          offset: -18,
          label: 'TRUE 60.83',
        },
        text(pt(150, 30), 'R = 304.1', 3.2, { align: 'left', bold: true }),
        text(pt(150, 38), 'r = 243.3', 3.2, { align: 'left', bold: true }),
        text(pt(150, 46), 'R − r = 60.83', 2.8, { align: 'left', colour: '#64748b' }),
      ],
    },
    {
      id: 'frustum-sector',
      title: 'How far round does it go?',
      tool: 'pencil',
      focus: { at: pt(290, 45), r: 96 },
      tip: 'Sector angle = 360 × base radius ÷ slant length. It has to be, because the arc it strikes must come out as the girth of the base.',
      lines: [
        { text: 'Next question. How far round does the sector go?' },
        { text: 'The outer arc has to be exactly as long as the way round the big end.' },
        { text: 'That is pi times a hundred. Three hundred and fourteen point two.' },
        { text: 'An arc of radius three hundred and four point one, that is three fourteen point two long…' },
        { text: '…subtends three sixty times fifty over three hundred and four point one.' },
        { text: 'Fifty nine point two degrees. Not quite a sixth of a circle.' },
        { text: 'Write that down. It is the only angle in the whole problem.' },
      ],
      marks: [
        text(pt(238, 24), 'SECTOR ANGLE', 3.4, { align: 'left', bold: true }),
        text(pt(238, 33), 'ARC = GIRTH = π × 100 = 314.2', 3, { align: 'left' }),
        text(pt(238, 42), 'θ = 360 × 50 ÷ 304.1', 3, { align: 'left' }),
        line(pt(238, 47), pt(330, 47), 'thin'),
        text(pt(238, 55), 'θ = 59.19°', 3.4, { align: 'left', bold: true }),
      ],
    },
    {
      id: 'frustum-chord-rise',
      title: 'Chord and rise instead of a centre',
      tool: 'pencil',
      focus: { at: pt(290, 82), r: 90 },
      tip: 'chord = 2R·sin(θ/2). rise = R − √(R² − (chord/2)²). Two sums and you never need the centre at all.',
      lines: [
        { text: 'Now the trick. You cannot put a compass point on the apex. It is not on the paper.' },
        { text: 'But an arc is fixed by three points, and you can find three points without a centre.' },
        { text: 'The straight line joining the two ends of the arc is the chord.' },
        { text: 'Two R sine half theta. Two times three oh four point one, times sine twenty nine point six.' },
        { text: 'Three hundred point four.' },
        { text: 'And the rise is how far the arc bellies out from that chord in the middle.' },
        { text: 'R minus the root of R squared minus half the chord squared. Thirty nine point seven.' },
        { text: 'Do the same for the small end. Two forty point four, and thirty one point eight.' },
      ],
      marks: [
        text(pt(238, 70), 'CHORD AND RISE', 3.4, { align: 'left', bold: true }),
        text(pt(238, 79), 'BIG   c = 2R sin(θ/2) = 300.4   v = 39.7', 3, { align: 'left' }),
        text(pt(238, 88), 'SMALL c = 240.3                 v = 31.8', 3, { align: 'left' }),
      ],
    },
    {
      id: 'frustum-strike',
      title: 'Spring a batten through the points',
      tool: 'tsquare',
      focus: { at: pt(205, 150), r: 165 },
      tip: 'Four ordinates each side of centre gives nine points. A batten sprung through nine points is truer than any compass you own.',
      lines: [
        { text: 'Draw the chord. Three hundred point four, straight across the sheet.' },
        { text: 'Find its middle, and set the rise up from it. Thirty nine point seven.' },
        { text: 'Three points already. But three is thin for an arc this long, so take a few more.' },
        { text: 'Quarter way along the chord, the arc stands thirty point three above it. Then less, then less.' },
        { text: 'Mark them all. Now spring a thin batten round the outside of your pencil dots.' },
        { text: 'Hold it, and run the pencil along it. That is the big end of the pattern.' },
        { text: 'Now the same again for the small end, on its own chord and rise.' },
        { text: 'Join the two ends, and the pattern is closed. No apex was ever needed.' },
      ],
      markLines: [0, 1, 3, 4, 6, 6, 7, 7],
      marks: [
        line(
          pt(FRUSTUM.CROWN.x - FRUSTUM.dev.chord / 2, FRUSTUM.CROWN.y + FRUSTUM.dev.rise),
          pt(FRUSTUM.CROWN.x + FRUSTUM.dev.chord / 2, FRUSTUM.CROWN.y + FRUSTUM.dev.rise),
          'construction'
        ),
        line(
          pt(FRUSTUM.CROWN.x, FRUSTUM.CROWN.y + FRUSTUM.dev.rise),
          FRUSTUM.CROWN,
          'construction'
        ),
        ...batten(
          pt(FRUSTUM.CROWN.x, FRUSTUM.CROWN.y + FRUSTUM.dev.rise),
          FRUSTUM.dev.chord / 2,
          FRUSTUM.dev.slant,
          FRUSTUM.dev.rise
        ),
        {
          kind: 'arc',
          style: 'outline',
          c: FRUSTUM.APEX,
          r: FRUSTUM.dev.slant,
          from: 90 - FRUSTUM.half,
          to: 90 + FRUSTUM.half,
        },
        ...batten(
          pt(FRUSTUM.CROWN.x, FRUSTUM.APEX.y - FRUSTUM.dev.innerSlant + FRUSTUM.innerRise),
          FRUSTUM.innerChord / 2,
          FRUSTUM.dev.innerSlant,
          FRUSTUM.innerRise
        ),
        {
          kind: 'arc',
          style: 'outline',
          c: FRUSTUM.APEX,
          r: FRUSTUM.dev.innerSlant,
          from: 90 - FRUSTUM.half,
          to: 90 + FRUSTUM.half,
        },
        line(
          polar(FRUSTUM.APEX, FRUSTUM.dev.slant, 90 - FRUSTUM.half),
          polar(FRUSTUM.APEX, FRUSTUM.dev.innerSlant, 90 - FRUSTUM.half),
          'outline'
        ),
        line(
          polar(FRUSTUM.APEX, FRUSTUM.dev.slant, 90 + FRUSTUM.half),
          polar(FRUSTUM.APEX, FRUSTUM.dev.innerSlant, 90 + FRUSTUM.half),
          'outline'
        ),
        {
          kind: 'dim',
          a: pt(FRUSTUM.CROWN.x - FRUSTUM.dev.chord / 2, FRUSTUM.CROWN.y + FRUSTUM.dev.rise),
          b: pt(FRUSTUM.CROWN.x + FRUSTUM.dev.chord / 2, FRUSTUM.CROWN.y + FRUSTUM.dev.rise),
          offset: -64,
          label: 'CHORD 300.4',
        },
        text(pt(FRUSTUM.CROWN.x + 8, FRUSTUM.CROWN.y + FRUSTUM.dev.rise / 2), 'RISE 39.7', 2.8, { align: 'left', colour: '#64748b' }),
      ],
    },
  ],
};

/* ==========================================================================
 * 9 — Calculation of the rise and radius of a cone
 * ======================================================================== */

const RISE = (() => {
  /** Full size: base 600 diameter, 900 high. Drawn 1:10. */
  const BASE_D = 600;
  const HEIGHT = 900;
  const dev = coneDevelopment(BASE_D / 2, 0, HEIGHT);
  const S = 1 / 10;
  const AX = 85;
  const BASE_Y = 130;
  const APEX = pt(255, 60);
  const half = dev.sector / 2;
  /** Working the sum backwards, from a chord and a rise measured on the plate. */
  const backRadius = radiusFromChordAndRise(dev.chord, dev.rise);
  return { BASE_D, HEIGHT, dev, S, AX, BASE_Y, APEX, half, backRadius };
})();

const RISE_AND_RADIUS: DrawTopic = {
  id: 'dev-rise-and-radius',
  title: 'Calculation of the rise and radius of a cone',
  subtitle: 'The two formulae that let you draw an arc bigger than your compass.',
  goal: 'Calculate the developed radius, sector, chord and rise of a cone, then work the sum backwards to recover a radius from a plate.',
  minutes: 35,
  level: 'Core',
  tools: ['T-square', 'Compass', 'Scale rule', 'Calculator', 'HB and 2H pencils'],
  base: fabSheet({ title: 'RISE AND RADIUS OF A CONE', number: 'F-29', scale: '1:10' }),
  steps: [
    {
      id: 'rise-why',
      title: 'Why a plater carries these two sums',
      tool: 'hand',
      focus: { at: pt(200, 130), r: 170 },
      tip: 'Rise is also called the versine, or the mid-ordinate. Same thing: how far the arc stands off its own chord at the middle.',
      lines: [
        { text: 'Two sums. Learn them and you can set out an arc of any radius, on any size of plate.' },
        { text: 'The first goes forwards. You know the cone, you want the pattern.' },
        { text: 'The second goes backwards. You have a curved plate in front of you and you want its radius.' },
        { text: 'Both of them use the same two things — a chord, and a rise.' },
        { text: 'The chord is the straight line across the two ends of the arc.' },
        { text: 'The rise is how far the arc stands above the middle of that chord.' },
        { text: 'Some books call the rise the versine, or the mid-ordinate. Same thing.' },
      ],
      marks: [],
    },
    {
      id: 'rise-cone',
      title: 'The cone, and its slant',
      tool: 'tsquare',
      teeY: RISE.BASE_Y,
      focus: { at: pt(85, 88), r: 76 },
      tip: 'Slant length = √(radius² + height²). It is the hypotenuse, and it becomes the radius of the pattern.',
      lines: [
        { text: 'Here is the cone. Six hundred across the bottom, nine hundred high.' },
        { text: 'Drawn at one to ten, so sixty and ninety on the paper.' },
        { text: 'Base line, centre line, apex, and the two sides down to the corners.' },
        { text: 'The side is the slant length. It is the hypotenuse of three hundred and nine hundred.' },
        { text: 'Root of three hundred squared plus nine hundred squared.' },
        { text: 'Nine hundred and forty eight point seven.' },
        { text: 'That number is the radius the pattern is struck with. Write it down.' },
      ],
      markLines: [2, 2, 2, 3],
      marks: [
        line(pt(RISE.AX, RISE.BASE_Y + 10), pt(RISE.AX, RISE.BASE_Y - RISE.HEIGHT * RISE.S - 10), 'centre'),
        line(
          pt(RISE.AX - (RISE.BASE_D / 2) * RISE.S, RISE.BASE_Y),
          pt(RISE.AX + (RISE.BASE_D / 2) * RISE.S, RISE.BASE_Y),
          'outline'
        ),
        line(
          pt(RISE.AX - (RISE.BASE_D / 2) * RISE.S, RISE.BASE_Y),
          pt(RISE.AX, RISE.BASE_Y - RISE.HEIGHT * RISE.S),
          'outline'
        ),
        line(
          pt(RISE.AX + (RISE.BASE_D / 2) * RISE.S, RISE.BASE_Y),
          pt(RISE.AX, RISE.BASE_Y - RISE.HEIGHT * RISE.S),
          'outline'
        ),
        { kind: 'dim', a: pt(RISE.AX - (RISE.BASE_D / 2) * RISE.S, RISE.BASE_Y), b: pt(RISE.AX + (RISE.BASE_D / 2) * RISE.S, RISE.BASE_Y), offset: -14, label: 'Ø600' },
        {
          kind: 'dim',
          a: pt(RISE.AX, RISE.BASE_Y),
          b: pt(RISE.AX, RISE.BASE_Y - RISE.HEIGHT * RISE.S),
          offset: 44,
          label: '900',
        },
        text(pt(122, 78), 'SLANT 948.7', 3, { align: 'left', bold: true }),
      ],
    },
    {
      id: 'rise-forward',
      title: 'Forwards: cone to chord and rise',
      tool: 'pencil',
      focus: { at: pt(110, 200), r: 105 },
      tip: 'θ = 360 R ÷ L. c = 2L sin(θ/2). v = L − √(L² − (c/2)²). Three lines of arithmetic and the pattern is set out.',
      lines: [
        { text: 'Sector angle first. Three sixty, times the base radius, over the slant.' },
        { text: 'Three sixty times three hundred over nine forty eight point seven.' },
        { text: 'One hundred and thirteen point eight five degrees.' },
        { text: 'Now the chord. Two times the slant, times the sine of half that angle.' },
        { text: 'Fifteen hundred and ninety point three.' },
        { text: 'And the rise. The slant, minus the root of the slant squared less half the chord squared.' },
        { text: 'Four hundred and thirty one point three. Write all four down before you draw anything.' },
      ],
      marks: [
        text(pt(30, 168), 'FORWARDS  — CONE TO PATTERN', 3.4, { align: 'left', bold: true }),
        text(pt(30, 178), 'L = √(300² + 900²)           = 948.7', 3, { align: 'left' }),
        text(pt(30, 187), 'θ = 360 × 300 ÷ 948.7      = 113.85°', 3, { align: 'left' }),
        text(pt(30, 196), 'c = 2 × 948.7 × sin 56.93° = 1590.3', 3, { align: 'left' }),
        text(pt(30, 205), 'v = 948.7 − √(948.7² − 795.2²)', 3, { align: 'left' }),
        line(pt(30, 210), pt(170, 210), 'thin'),
        text(pt(30, 218), 'v = 431.3', 3.4, { align: 'left', bold: true }),
      ],
    },
    {
      id: 'rise-draw',
      title: 'Draw it, then check it',
      tool: 'compass',
      compassRadius: RISE.dev.slant * RISE.S,
      focus: { at: pt(255, 110), r: 105 },
      tip: 'At 1:10 the radius is only 94.9, so you can strike it with a compass and check the chord and rise you calculated. On the real job you cannot — which is the point.',
      lines: [
        { text: 'Now set the pattern out at one to ten, where the compass will reach.' },
        { text: 'Apex here. Radius ninety four point nine. Swing the arc.' },
        { text: 'Open the sector to a hundred and thirteen point eight five degrees, and draw both sides.' },
        { text: 'That is the full development of the cone. One piece.' },
        { text: 'Now check yourself. Measure the chord across the two ends.' },
        { text: 'A hundred and fifty nine. At one to ten, fifteen ninety. It agrees.' },
        { text: 'And the rise, forty three point one. Four thirty one full size. It agrees too.' },
        { text: 'Good. The sums and the drawing are telling you the same thing.' },
      ],
      markLines: [1, 1, 2, 2, 4],
      marks: [
        {
          kind: 'arc',
          style: 'outline',
          c: RISE.APEX,
          r: RISE.dev.slant * RISE.S,
          from: 270 - RISE.half,
          to: 270 + RISE.half,
        },
        line(RISE.APEX, polar(RISE.APEX, RISE.dev.slant * RISE.S, 270 - RISE.half), 'outline'),
        line(RISE.APEX, polar(RISE.APEX, RISE.dev.slant * RISE.S, 270 + RISE.half), 'outline'),
        {
          kind: 'angle',
          at: RISE.APEX,
          from: 270 - RISE.half,
          to: 270 + RISE.half,
          r: 26,
          label: '113.85°',
        },
        line(
          polar(RISE.APEX, RISE.dev.slant * RISE.S, 270 - RISE.half),
          polar(RISE.APEX, RISE.dev.slant * RISE.S, 270 + RISE.half),
          'construction'
        ),
        line(
          pt(RISE.APEX.x, RISE.APEX.y + (RISE.dev.slant - RISE.dev.rise) * RISE.S),
          pt(RISE.APEX.x, RISE.APEX.y + RISE.dev.slant * RISE.S),
          'construction'
        ),
        text(pt(255, 106), 'CHORD 1590', 2.8, { colour: '#64748b' }),
        text(pt(RISE.APEX.x + 5, RISE.APEX.y + (RISE.dev.slant - RISE.dev.rise / 2) * RISE.S), 'v 431', 2.8, {
          align: 'left',
          colour: '#64748b',
        }),
      ],
    },
    {
      id: 'rise-backward',
      title: 'Backwards: plate to radius',
      tool: 'pencil',
      focus: { at: pt(120, 250), r: 95 },
      tip: 'R = c² ÷ 8v + v ÷ 2. Lay a straightedge on any curved plate, measure the chord and the gap in the middle, and you have its radius.',
      lines: [
        { text: 'Now turn it round. Somebody hands you a rolled plate and asks what radius it is.' },
        { text: 'You cannot get to its centre. But you can measure it.' },
        { text: 'Lay a straightedge across it. That is your chord. Measure it.' },
        { text: 'Measure the gap in the middle, between the straightedge and the plate. That is the rise.' },
        { text: 'Then: R equals the chord squared over eight times the rise, plus half the rise.' },
        { text: 'Put our numbers in. Fifteen ninety squared over eight times four thirty one.' },
        { text: 'Plus half of four thirty one. Nine hundred and forty eight point seven.' },
        { text: 'The slant length we started with. The two sums are the same sum, run both ways.' },
      ],
      marks: [
        text(pt(30, 236), 'BACKWARDS — PLATE TO RADIUS', 3.4, { align: 'left', bold: true }),
        text(pt(30, 246), 'R = c² ÷ 8v  +  v ÷ 2', 3, { align: 'left' }),
        text(pt(30, 255), '   = 1590.3² ÷ (8 × 431.3) + 215.6', 3, { align: 'left' }),
        line(pt(30, 260), pt(190, 260), 'thin'),
        text(pt(30, 268), 'R = 948.7   ✓  BACK TO THE SLANT', 3.2, { align: 'left', bold: true }),
      ],
    },
  ],
};

export const CONE_TOPICS: DrawTopic[] = [CONE_FRUSTUM, RISE_AND_RADIUS];
