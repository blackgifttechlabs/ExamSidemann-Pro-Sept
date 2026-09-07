/**
 * The twelve geometrical constructions — the first half of every polytechnic
 * Technical Drawing course, and the part every student must be able to do with
 * a compass alone.
 *
 * Nothing here is placed by eye. A bisector is the crossing of two equal arcs,
 * a perpendicular is the crossing of two arcs about two points on the line, a
 * blend arc's centre is `r / sin(half-angle)` along the bisector, and the
 * ellipse points come from the two auxiliary circles. If a construction is
 * right in the classroom it is right on this board, because the board runs the
 * same arithmetic.
 *
 * The narration is deliberately plain: short sentences, one idea each, for a
 * student meeting both the drawing board and English technical vocabulary at
 * the same time.
 */

import {
  bearing,
  blendArc,
  circleIntersections,
  dist,
  ellipsePoints,
  lerpPt,
  lineIntersection,
  mid,
  perpFoot,
  polar,
  pt,
  shortWayTo,
  type Mark,
  type Pt,
} from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/** Picks the crossing of two arcs that lies furthest from a reference point. */
const farther = (pair: [Pt, Pt], from: Pt) =>
  dist(pair[0], from) > dist(pair[1], from) ? pair[0] : pair[1];
const nearer = (pair: [Pt, Pt], from: Pt) =>
  dist(pair[0], from) > dist(pair[1], from) ? pair[1] : pair[0];

const cross = (c1: Pt, r1: number, c2: Pt, r2: number) =>
  circleIntersections(c1, r1, c2, r2) as [Pt, Pt];

/* ========================================================================== 1
 * Bisecting a line
 * ======================================================================== */

const L1A = pt(110, 110);
const L1B = pt(250, 110);
const L1R = 90;
const [L1Top, L1Bottom] = cross(L1A, L1R, L1B, L1R);
const L1M = mid(L1A, L1B);

const BISECT_LINE: DrawTopic = {
  id: 'bisect-line',
  title: 'Bisecting a line',
  subtitle: 'Find the exact middle of a line with a compass — and a right angle for free.',
  goal: 'Cut a line into two equal halves without measuring it, and understand why the bisector is also a perpendicular.',
  minutes: 20,
  level: 'Start here',
  tools: ['T-square', '45° set square', 'Compass', 'HB pencil'],
  base: preparedSheet('BISECTING A LINE', '01'),
  steps: [
    {
      id: 'what-is-bisect',
      title: 'What bisect means',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 200 },
      tip: 'Bisect = cut into two equal parts. Bi means two, sect means cut.',
      lines: [
        { text: 'Welcome to the drawing board. We start with the very first construction.' },
        { text: 'The word for today is bisect.' },
        { text: 'Bisect means to cut something into two equal parts.' },
        { text: 'Bi means two. Sect means cut. Cut into two.' },
        { text: 'Now here is the rule that surprises everybody.' },
        { text: 'You may not use your ruler to find the middle. That is measuring, not constructing.' },
        { text: 'When the exam says construct, it means use a compass, and leave your arcs on the paper.' },
        { text: 'Never rub out your arcs. Those arcs are your working, and they carry marks.' },
      ],
      marks: [],
    },
    {
      id: 'draw-line',
      title: 'Draw and letter the line',
      tool: 'tsquare',
      teeY: L1A.y,
      focus: { at: L1M, r: 110 },
      tip: 'Always letter your points. An unlabelled construction is hard to mark.',
      lines: [
        { text: 'First we need a line to cut.' },
        { text: 'Slide the T-square to where you want it and draw a line one hundred and forty long.', at: L1M, label: '140 mm' },
        { text: 'Put a small dot at each end.', at: L1A },
        { text: 'Letter the left end A, and the right end B.', at: L1B, label: 'B' },
        { text: 'We call it line AB.' },
      ],
      // Ruled while he says "draw a line", lettered while he letters it.
      markLines: [1, 3, 3],
      marks: [
        { kind: 'line', style: 'outline', a: L1A, b: L1B },
        { kind: 'dot', at: L1A, label: 'A', labelAngle: 200 },
        { kind: 'dot', at: L1B, label: 'B', labelAngle: -20 },
      ],
    },
    {
      id: 'set-compass',
      title: 'Open the compass past halfway',
      tool: 'compass',
      compassRadius: L1R,
      focus: { at: L1M, r: 120 },
      tip: 'Any opening more than half the line works. Less than half and the arcs never meet.',
      // The compass opens as it is explained: shut at first, out to the halfway
      // mark while the sum is done, then past it to the ninety actually used.
      // The last two lines are the warning, so the camera goes in on the nut.
      lines: [
        {
          text: 'Take the compass and open it to more than half the line.',
          // Opening, but not yet claiming a size — the sum on the next line is
          // what lands it on seventy, and the line after that on ninety.
          compassRadius: 45,
          focus: { at: L1M, r: 90 },
        },
        {
          text: 'The line is one hundred and forty. Half is seventy. So open it bigger than seventy.',
          compassRadius: 70,
          at: L1M,
          label: 'half = 70',
          focus: { at: L1M, r: 100 },
        },
        {
          text: 'I am using ninety. Any size over seventy will work.',
          compassRadius: L1R,
          at: pt(L1A.x, L1A.y - 24),
          label: '90 mm',
          focus: { at: L1M, r: 100 },
        },
        {
          text: 'Why more than half? Because if it is less, the two arcs will never reach each other.',
          compassRadius: L1R,
          focus: { at: L1M, r: 130 },
        },
        {
          text: 'And now the rule that matters most today. Do not touch that screw again.',
          compassRadius: L1R,
          alert: { part: 'screw', forbidden: true },
          focus: { at: L1M, r: 45 },
        },
        {
          text: 'The opening must stay exactly the same for all four arcs.',
          compassRadius: L1R,
          alert: { part: 'screw', forbidden: true },
          focus: { at: L1M, r: 60 },
        },
      ],
      // The sum is shown as it is spoken: half of the line, then the opening
      // actually used. Deliberately no dot at the middle — measuring the middle
      // is the very thing this lesson tells the student not to do. These two
      // sizes are about the compass, not about where M is.
      markLines: [1, 2],
      marks: [
        // The sum, written on the sheet as working rather than as a second
        // dimension: the final drawing already proves 70 each side.
        { kind: 'text', at: pt(34, L1A.y - 14), text: '140 ÷ 2 = 70', size: 4, align: 'left' },
        { kind: 'dim', a: L1A, b: pt(L1A.x + L1R, L1A.y), offset: 40, label: 'opening 90' },
      ],
    },
    {
      id: 'arcs-from-a',
      title: 'Swing two arcs from A',
      tool: 'compass',
      compassRadius: L1R,
      focus: { at: L1M, r: 120 },
      lines: [
        { text: 'Put the sharp needle point exactly on A.', at: L1A, label: 'needle on A' },
        { text: 'Press it in a little so it cannot slip.' },
        { text: 'Swing an arc above the line.', at: polar(L1A, L1R, 55), label: 'above' },
        { text: 'Hold the compass by the top knob only. Never hold the legs.' },
        { text: 'Now swing another arc below the line, from the same point A.', at: polar(L1A, L1R, -55), label: 'below' },
        { text: 'Make them long. A short arc will miss the one coming the other way.' },
      ],
      markLines: [2, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: L1A, r: L1R, from: 26, to: 76 },
        { kind: 'arc', style: 'construction', c: L1A, r: L1R, from: -76, to: -26 },
      ],
    },
    {
      id: 'arcs-from-b',
      title: 'Swing two arcs from B',
      tool: 'compass',
      compassRadius: L1R,
      focus: { at: L1M, r: 120 },
      tip: 'The two crossings are the whole answer. Everything else was getting there.',
      lines: [
        { text: 'Move the needle to B. Do not change the opening.', at: L1B, label: 'needle on B' },
        { text: 'Swing an arc above, crossing the first one.', at: L1Top, label: 'they cross' },
        { text: 'Look at that. The two arcs cut each other. Mark that crossing.' },
        { text: 'Now swing an arc below as well.', at: L1Bottom, label: 'and here' },
        { text: 'Call the top crossing C, and the bottom crossing D.', at: L1Top, label: 'C' },
      ],
      markLines: [1, 3, 4, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: L1B, r: L1R, from: 104, to: 154 },
        { kind: 'arc', style: 'construction', c: L1B, r: L1R, from: -154, to: -104 },
        { kind: 'dot', at: L1Top, label: 'C', labelAngle: 120 },
        { kind: 'dot', at: L1Bottom, label: 'D', labelAngle: -120 },
      ],
    },
    {
      id: 'join-bisector',
      title: 'Join C to D',
      tool: 'set45',
      teeY: L1A.y,
      focus: { at: L1M, r: 115 },
      tip: 'The bisector is perpendicular to AB, so this one construction also gives you 90°.',
      lines: [
        { text: 'Join C to D with a straight line.', at: L1M, label: 'join C to D' },
        { text: 'Where it crosses AB, call that point M.', at: L1M, label: 'M' },
        { text: 'M is the exact middle. Measure it if you like. Seventy each side.' },
        { text: 'But look at the corner where the two lines meet.', at: L1M },
        { text: 'It is a right angle. Ninety degrees, perfectly square.' },
        { text: 'So one construction gave you two things. The middle, and a perpendicular.' },
        { text: 'That is why its full name is the perpendicular bisector.' },
      ],
      // Ruled as he joins them, M lettered as he names it, the seventies
      // measured as he claims them, and the square corner as he points at it.
      markLines: [0, 1, 4, 2, 2],
      marks: [
        { kind: 'line', style: 'outline', a: lerpPt(L1Top, L1Bottom, -0.06), b: lerpPt(L1Top, L1Bottom, 1.06) },
        { kind: 'dot', at: L1M, label: 'M', labelAngle: -35 },
        { kind: 'angle', at: L1M, from: 0, to: 90, r: 8, square: true },
        { kind: 'dim', a: L1A, b: L1M, offset: 32, label: '70' },
        { kind: 'dim', a: L1M, b: L1B, offset: 32, label: '70' },
      ],
    },
  ],
};

/* ========================================================================== 2
 * A perpendicular from a given point on a line
 * ======================================================================== */

const L2A = pt(70, 155);
const L2B = pt(330, 155);
const L2P = pt(180, 155);
const L2_STEP = 42;
const L2Left = pt(L2P.x - L2_STEP, L2P.y);
const L2Right = pt(L2P.x + L2_STEP, L2P.y);
const L2_ARC = 64;
const L2Top = nearer(cross(L2Left, L2_ARC, L2Right, L2_ARC), pt(L2P.x, 0));

const PERPENDICULAR_ON_LINE: DrawTopic = {
  id: 'perpendicular-on-line',
  title: 'A perpendicular from a given point to a line',
  subtitle: 'Stand a line up square from a point sitting on the line itself.',
  goal: 'Erect a perpendicular at a marked point on a line — the construction behind every square corner on a drawing.',
  minutes: 22,
  level: 'Basic',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('PERPENDICULAR AT A POINT', '02'),
  steps: [
    {
      id: 'the-problem',
      title: 'What we are asked to do',
      tool: 'hand',
      focus: { at: pt(200, 150), r: 200 },
      tip: 'Perpendicular means at 90°. A perpendicular to a horizontal line is vertical.',
      lines: [
        { text: 'Here is a line, and a point sitting on it.', at: L2P, label: 'point P' },
        { text: 'We must stand a new line straight up from that point.' },
        { text: 'Straight up means at ninety degrees. We call that perpendicular.' },
        { text: 'You could cheat with a set square. But the exam says construct.' },
        { text: 'So we do it with the compass only, and we leave the arcs showing.' },
        { text: 'And notice the point is on the line. That matters. There is a different method when it is not.', focus: { at: L2P, r: 70 } },
      ],
      markLines: [0, 0],
      marks: [
        { kind: 'line', style: 'outline', a: L2A, b: L2B },
        { kind: 'dot', at: L2P, label: 'P', labelAngle: -60 },
      ],
    },
    {
      id: 'equal-both-sides',
      title: 'Step equal distances each side of P',
      tool: 'compass',
      compassRadius: L2_STEP,
      focus: { at: L2P, r: 105 },
      tip: 'The two new points must be the same distance from P. That is what makes the answer square.',
      lines: [
        // The compass is nearly shut when he picks it up and opens to the
        // forty he settles on as he says the number.
        { text: 'Put the needle on P.', at: L2P, label: 'needle on P', compassRadius: 14 },
        { text: 'Open the compass to any small size. Forty is comfortable.', compassRadius: L2_STEP },
        { text: 'Swing a short arc that cuts the line on the left.', at: L2Left, label: 'cuts here' },
        { text: 'Without changing anything, swing one on the right too.', at: L2Right, label: 'and here', alert: { part: 'screw' } },
        { text: 'Call them C and D.' },
        { text: 'C and D are now exactly the same distance from P, one each side.' },
        { text: 'That is the whole trick. P is already the middle of C and D.', focus: { at: L2P, r: 65 } },
      ],
      markLines: [2, 3, 4, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: L2P, r: L2_STEP, from: 160, to: 200 },
        { kind: 'arc', style: 'construction', c: L2P, r: L2_STEP, from: -20, to: 20 },
        { kind: 'dot', at: L2Left, label: 'C', labelAngle: -110 },
        { kind: 'dot', at: L2Right, label: 'D', labelAngle: -70 },
      ],
    },
    {
      id: 'bisect-cd',
      title: 'Now bisect C to D',
      tool: 'compass',
      compassRadius: L2_ARC,
      focus: { at: pt(L2P.x, 135), r: 105 },
      tip: 'You already know this bit — it is the perpendicular bisector from lesson one.',
      lines: [
        { text: 'Now open the compass wider. Bigger than half of C to D.', compassRadius: L2_ARC },
        { text: 'And here is the nice part. You already know what to do.' },
        { text: 'This is just bisecting the line C D, which you learned yesterday.' },
        { text: 'Needle on C, swing an arc above.', at: L2Left, label: 'needle on C' },
        { text: 'Needle on D, same opening, swing an arc that crosses it.', at: L2Top, label: 'they cross' },
        { text: 'Mark the crossing. Call it E.', at: L2Top, label: 'E' },
      ],
      markLines: [3, 4, 5],
      marks: [
        { kind: 'arc', style: 'construction', c: L2Left, r: L2_ARC, from: 30, to: 90 },
        { kind: 'arc', style: 'construction', c: L2Right, r: L2_ARC, from: 90, to: 150 },
        { kind: 'dot', at: L2Top, label: 'E', labelAngle: 110 },
      ],
    },
    {
      id: 'join-perp',
      title: 'Join E down to P',
      tool: 'set45',
      teeY: L2P.y,
      focus: { at: pt(L2P.x, 135), r: 100 },
      tip: 'Check it with your set square. If it is not dead square, one of your arcs slipped.',
      lines: [
        { text: 'Join E to P, and carry the line a little past.', at: mid(L2Top, L2P), label: 'E down to P' },
        { text: 'That is your perpendicular.' },
        { text: 'Look at the corners. Ninety degrees on the left, ninety on the right.', at: L2P },
        { text: 'Stand your set square against it to check. It should sit flat with no gap.' },
        { text: 'One warning. Do not join E to C or E to D. That is not the answer.', focus: { at: L2P, r: 75 } },
        { text: 'The answer goes through P, because P is the point you were given.', at: L2P, label: 'through P' },
      ],
      markLines: [0, 2, 2, 2],
      marks: [
        { kind: 'line', style: 'outline', a: L2Top, b: pt(L2P.x, L2P.y + 18) },
        { kind: 'angle', at: L2P, from: 90, to: 180, r: 10, square: true },
        { kind: 'angle', at: L2P, from: 0, to: 90, r: 10, square: true },
        { kind: 'text', at: pt(L2P.x + 16, 120), text: '90°', size: 4, align: 'left', bold: true, colour: '#1d4ed8' },
      ],
    },
  ],
};

/* ========================================================================== 3
 * A line divided into proportional parts
 * ======================================================================== */

const L3A = pt(70, 210);
const L3B = pt(290, 210);
const L3_PARTS = 7;
const L3_STEP = 22;
const L3_ANGLE = 30;
const L3Steps = Array.from({ length: L3_PARTS }, (_, index) => polar(L3A, L3_STEP * (index + 1), L3_ANGLE));
const L3Last = L3Steps[L3_PARTS - 1];
/** Every division is a line through a step point, parallel to the closing line. */
const L3Divisions = L3Steps.slice(0, -1).map((step) => {
  const along = { x: step.x + (L3B.x - L3Last.x), y: step.y + (L3B.y - L3Last.y) };
  return lineIntersection(step, along, L3A, L3B) as Pt;
});

const DIVIDE_LINE: DrawTopic = {
  id: 'divide-line',
  title: 'A line divided into proportional parts',
  subtitle: 'Cut a line into any number of equal parts — even when the arithmetic will not work.',
  goal: 'Divide a line into equal or proportional parts using a sloping construction line and parallels.',
  minutes: 28,
  level: 'Core',
  tools: ['T-square', '30/60 set square', 'Compass', 'HB pencil'],
  base: preparedSheet('DIVIDING A LINE', '03'),
  steps: [
    {
      id: 'the-problem',
      title: 'Why not just measure?',
      tool: 'hand',
      focus: { at: pt(200, 170), r: 200 },
      tip: 'This construction works for any number of parts, and never leaves a rounding error.',
      lines: [
        { text: 'Today we cut one line into seven equal parts.' },
        { text: 'Your first thought is to measure. Let us try it.' },
        { text: 'The line is two hundred and twenty long. Divide by seven.' },
        { text: 'You get thirty-one point four two eight, and it never ends.' },
        { text: 'You cannot set that on a rule. So measuring fails.' },
        { text: 'The construction does not care. It gives seven exact parts every time.' },
        { text: 'And it works for nine parts, or thirteen, or any number you like.' },
      ],
      markLines: [0, 0, 0],
      marks: [
        { kind: 'line', style: 'outline', a: L3A, b: L3B },
        { kind: 'dot', at: L3A, label: 'A', labelAngle: 200 },
        { kind: 'dot', at: L3B, label: 'B', labelAngle: -20 },
      ],
    },
    {
      id: 'sloping-line',
      title: 'Draw a sloping line from A',
      tool: 'set30',
      teeY: L3A.y,
      focus: { at: pt(150, 175), r: 130 },
      tip: 'The angle does not matter at all. Thirty degrees is just comfortable to work on.',
      lines: [
        { text: 'From A, draw a light line going up at any angle you like.', at: L3Steps[3], label: 'any angle' },
        { text: 'Listen to that. Any angle. It genuinely does not matter.' },
        { text: 'I use thirty degrees because my set square gives it to me instantly.' },
        { text: 'Make it long enough to hold seven marks.' },
        { text: 'This is a construction line, so keep it light. 2H pencil.' },
      ],
      markLines: [0],
      marks: [{ kind: 'line', style: 'construction', a: L3A, b: polar(L3A, L3_STEP * L3_PARTS + 12, L3_ANGLE) }],
    },
    {
      id: 'step-off',
      title: 'Step off seven equal spaces',
      tool: 'compass',
      compassRadius: L3_STEP,
      focus: { at: pt(150, 172), r: 125 },
      tip: 'The spaces can be any size, as long as every one is identical.',
      lines: [
        { text: 'Set your compass to any convenient size.', compassRadius: L3_STEP },
        { text: 'Needle on A, mark the sloping line once.', at: L3Steps[0], label: '1' },
        { text: 'Move the needle into that mark and step again.', at: L3Steps[1], label: '2' },
        { text: 'Keep walking up the line. Three. Four. Five.', at: L3Steps[4] },
        { text: 'Six. And seven.', at: L3Steps[6], label: '7' },
        { text: 'Seven equal spaces, because you never changed the compass.' },
        { text: 'Number them one to seven as you go, or you will lose count.' },
      ],
      // Two marks per space — the dot and its number — counted out on the word
      // that says that number aloud. The dot lands on the count, the figure is
      // written straight after it, and the compass then waits for the next one.
      markLines: [1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4],
      markWords: [
        'mark', undefined,
        'step', undefined,
        'three', undefined,
        'four', undefined,
        'five', undefined,
        'six', undefined,
        'seven', undefined,
      ],
      marks: L3Steps.flatMap<Mark>((point, index) => [
        { kind: 'dot', at: point, style: 'construction' },
        { kind: 'text', at: polar(point, 6, 120), text: `${index + 1}`, size: 3, align: 'center', baseline: 'middle', colour: '#64748b' },
      ]),
    },
    {
      id: 'close-it',
      title: 'Join the last mark to B',
      tool: 'set30',
      teeY: L3A.y,
      focus: { at: pt(200, 175), r: 125 },
      tip: 'The closing line is the key. Every parallel to it cuts AB in the same proportion.',
      lines: [
        { text: 'Now join the seventh mark straight down to B.', at: mid(L3Last, L3B), label: 'seven to B' },
        { text: 'This one line is the key to the whole construction.' },
        { text: 'Every line we draw parallel to it will cut AB in the same proportion.' },
        { text: 'That is a rule of similar triangles, and it is always true.' },
      ],
      markLines: [0],
      marks: [{ kind: 'line', style: 'construction', a: L3Last, b: L3B }],
    },
    {
      id: 'parallels',
      title: 'Draw parallels down to AB',
      tool: 'set30',
      teeY: L3A.y,
      focus: { at: pt(190, 185), r: 125 },
      tip: 'Slide the set square along the T-square to keep every line truly parallel.',
      lines: [
        { text: 'Now line your set square up with that closing line.' },
        { text: 'Hold the T-square hard against it so the angle cannot change.' },
        { text: 'Slide the set square down to mark six, and draw a parallel to AB.', at: L3Divisions[5], label: 'parallel' },
        { text: 'Slide to mark five. Draw again.', at: L3Divisions[4] },
        { text: 'Keep sliding and drawing. Four. Three. Two. One.', at: L3Divisions[1] },
        { text: 'Do not lift the T-square between lines, or they stop being parallel.' },
      ],
      // Drawn in the order he calls them out: six, then five, then the last
      // four counted off a word at a time. Reversed, because the parallels are
      // generated from A upwards and the set square is slid down from the top.
      markLines: [2, 3, 4, 4, 4, 4],
      markWords: ['draw a parallel', 'draw again', 'four', 'three', 'two', 'one'],
      marks: L3Steps.slice(0, -1)
        .map<Mark>((step, index) => ({
          kind: 'line',
          style: 'construction',
          a: step,
          b: L3Divisions[index],
        }))
        .reverse(),
    },
    {
      id: 'the-answer',
      title: 'Read the answer off AB',
      tool: 'pencil',
      teeY: L3A.y,
      focus: { at: pt(180, 205), r: 120 },
      tip: 'For a ratio like 2:5, do not divide into 2 and 5 — divide into 7 and take the 2nd mark.',
      lines: [
        { text: 'Look where the parallels land on AB.', at: L3Divisions[3] },
        { text: 'Seven equal parts. Measure any one and they all match.' },
        { text: 'And we never once divided two hundred and twenty by seven.' },
        { text: 'Now the second half of the title. Proportional parts.' },
        { text: 'Suppose the question says divide AB in the ratio two to five.' },
        { text: 'Two plus five is seven. So divide into seven, exactly as we did.' },
        { text: 'Then take the second mark along.', at: L3Divisions[1], label: 'ratio 2 : 5' },
        { text: 'Two parts on the left, five on the right. That is your ratio.' },
      ],
      // The six division points land as he looks at them, the two sizes as he
      // claims they are equal, and the ratio marker as he reads it off.
      markLines: [0, 0, 0, 0, 0, 0, 1, 1, 6, 7],
      marks: [
        ...L3Divisions.map<Mark>((point) => ({ kind: 'dot', at: point })),
        { kind: 'dim', a: L3A, b: L3Divisions[0], offset: -16 },
        { kind: 'dim', a: L3Divisions[0], b: L3Divisions[1], offset: -16 },
        { kind: 'line', style: 'centre', a: pt(L3Divisions[1].x, L3A.y - 6), b: pt(L3Divisions[1].x, L3A.y + 24) },
        { kind: 'text', at: pt(L3Divisions[1].x, L3A.y + 32), text: 'RATIO 2 : 5', size: 3.6, align: 'center', bold: true, colour: '#1d4ed8' },
      ],
    },
  ],
};

/* ========================================================================== 4
 * A perpendicular from any point to a line
 * ======================================================================== */

const L4A = pt(70, 195);
const L4B = pt(350, 195);
const L4P = pt(200, 115);
const L4_REACH = 100;
const L4Foot = perpFoot(L4P, L4A, L4B);
/** Half the chord the wide arc cuts out of the line — Pythagoras on the standoff. */
const L4Half = Math.sqrt(L4_REACH * L4_REACH - dist(L4P, L4Foot) ** 2);
const L4C = pt(L4Foot.x - L4Half, L4Foot.y);
const L4D = pt(L4Foot.x + L4Half, L4Foot.y);
const L4_ARC = 80;
const L4Below = farther(cross(L4C, L4_ARC, L4D, L4_ARC), L4P);

const PERPENDICULAR_FROM_POINT: DrawTopic = {
  id: 'perpendicular-from-point',
  title: 'A perpendicular from any point to a line',
  subtitle: 'Drop a square line down from a point that is nowhere near the line.',
  goal: 'Drop a perpendicular from a point outside a line, and find the shortest distance from the point to that line.',
  minutes: 22,
  level: 'Basic',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('PERPENDICULAR FROM A POINT', '04'),
  steps: [
    {
      id: 'the-problem',
      title: 'The point is off the line now',
      tool: 'hand',
      focus: { at: pt(200, 160), r: 200 },
      tip: 'The perpendicular is also the shortest distance from the point to the line.',
      lines: [
        { text: 'Last time our point was sitting on the line.' },
        { text: 'This time it is floating above it.', at: L4P, label: 'point P' },
        { text: 'We must drop a line from P straight down onto AB, at ninety degrees.' },
        { text: 'The word is drop, because we are coming down onto the line.' },
        { text: 'And there is a second reason this matters.' },
        { text: 'That perpendicular is the shortest distance from P to the line.' },
        { text: 'Any other line from P to AB is longer. Every single one.' },
      ],
      markLines: [0, 1],
      marks: [
        { kind: 'line', style: 'outline', a: L4A, b: L4B },
        { kind: 'dot', at: L4P, label: 'P', labelAngle: 100 },
      ],
    },
    {
      id: 'arc-cuts-line',
      title: 'Swing one wide arc from P',
      tool: 'compass',
      compassRadius: L4_REACH,
      focus: { at: pt(200, 165), r: 130 },
      tip: 'The radius must be big enough to cut the line in TWO places. If it only touches, open wider.',
      lines: [
        { text: 'Needle on P.', compassRadius: 16, at: L4P, label: 'needle on P' },
        { text: 'Now open the compass wide enough to reach past the line.', compassRadius: 100 },
        { text: 'Swing an arc that cuts the line in two places.', at: pt(200, 195), label: 'cut it twice' },
        { text: 'Two places. Not one. If it only touches at one point, open wider and do it again.' },
        { text: 'Call the two cuts C and D.', at: L4C, label: 'C' },
        { text: 'C and D are the same distance from P, because they are both on the same arc.' },
      ],
      markLines: [2, 4, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: L4P, r: L4_REACH, from: -105, to: -75 },
        { kind: 'dot', at: L4C, label: 'C', labelAngle: -120 },
        { kind: 'dot', at: L4D, label: 'D', labelAngle: -60 },
      ],
    },
    {
      id: 'bisect-below',
      title: 'Bisect C to D, working below',
      tool: 'compass',
      compassRadius: L4_ARC,
      focus: { at: pt(200, 215), r: 120 },
      tip: 'Work on the opposite side from P — the crossing is far from P, so the join is accurate.',
      lines: [
        { text: 'Now it is the same old bisection again.', compassRadius: 80 },
        { text: 'Needle on C, swing an arc below the line.', at: L4C, label: 'needle on C' },
        { text: 'Needle on D, same opening, cross it.', at: L4Below, label: 'they cross' },
        { text: 'Notice we are working below the line, on the far side from P.' },
        { text: 'That is on purpose. The further apart your two points, the straighter your join.' },
        { text: 'Call the crossing E.', at: L4Below, label: 'E' },
      ],
      markLines: [1, 2, 5],
      marks: [
        { kind: 'arc', style: 'construction', c: L4C, r: L4_ARC, from: -75, to: -15 },
        { kind: 'arc', style: 'construction', c: L4D, r: L4_ARC, from: -165, to: -105 },
        { kind: 'dot', at: L4Below, label: 'E', labelAngle: -90 },
      ],
    },
    {
      id: 'join-through',
      title: 'Join P through to E',
      tool: 'set45',
      teeY: L4A.y,
      focus: { at: pt(200, 180), r: 125 },
      tip: 'The line must pass through BOTH P and E. If it only touches one, it is not the answer.',
      lines: [
        { text: 'Now join P all the way down to E.', at: mid(L4P, L4Below), label: 'P through to E' },
        { text: 'It must pass through both of them. Line the rule up on both before you draw.' },
        { text: 'Where it crosses AB, mark the point. Call it F.', at: L4Foot, label: 'F' },
        { text: 'That corner is ninety degrees.', at: L4Foot },
        { text: 'And the length from P down to F is the shortest distance from P to the line.', at: mid(L4P, L4Foot), label: 'shortest' },
        { text: 'In the exam that is often the real question. Find the distance from the point to the line.' },
      ],
      markLines: [0, 2, 3, 4],
      marks: [
        { kind: 'line', style: 'outline', a: L4P, b: L4Below },
        { kind: 'dot', at: L4Foot, label: 'F', labelAngle: -30 },
        { kind: 'angle', at: L4Foot, from: 0, to: 90, r: 9, square: true },
        { kind: 'dim', a: L4P, b: L4Foot, offset: 26, label: '80' },
      ],
    },
  ],
};

/* ========================================================================== 5
 * Parallel lines
 * ======================================================================== */

const L5A = pt(70, 195);
const L5B = pt(340, 195);
const L5P = pt(200, 130);
const L5_GAP = 65;
const L5Q1 = pt(120, 195);
const L5Q2 = pt(290, 195);

const PARALLEL_LINES: DrawTopic = {
  id: 'parallel-lines',
  title: 'Parallel lines',
  subtitle: 'Two ways: slide the set square, or set the compass to the gap.',
  goal: 'Draw a line parallel to another through a given point, with a set square and with a compass.',
  minutes: 20,
  level: 'Basic',
  tools: ['T-square', '45° set square', 'Compass', 'HB pencil'],
  base: preparedSheet('PARALLEL LINES', '05'),
  steps: [
    {
      id: 'what-parallel',
      title: 'What parallel means',
      tool: 'hand',
      focus: { at: pt(200, 165), r: 200 },
      tip: 'Parallel lines stay the same distance apart forever. They never meet.',
      lines: [
        { text: 'Parallel lines run beside each other and never meet.' },
        { text: 'The distance between them is the same everywhere. That is the test.' },
        { text: 'Here is a line, and a point above it.', at: L5P, label: 'point P' },
        { text: 'We must draw a line through P that is parallel to AB.' },
        { text: 'There are two ways, and you should know both.' },
        { text: 'One is fast and uses the set square. One is slower and uses the compass.' },
      ],
      markLines: [2, 2, 2, 2],
      marks: [
        { kind: 'line', style: 'outline', a: L5A, b: L5B },
        { kind: 'dot', at: L5A, label: 'A', labelAngle: 200 },
        { kind: 'dot', at: L5B, label: 'B', labelAngle: -20 },
        { kind: 'dot', at: L5P, label: 'P', labelAngle: 100 },
      ],
    },
    {
      id: 'set-square-way',
      title: 'The fast way: slide the set square',
      tool: 'set45',
      teeY: L5A.y,
      focus: { at: pt(200, 165), r: 140 },
      tip: 'This is how the drawing office actually does it. The T-square is what keeps it honest.',
      lines: [
        { text: 'First the fast way, which you will use every day.' },
        { text: 'Lay one edge of the set square exactly along the line AB.', at: mid(L5A, L5B), label: 'edge on AB' },
        { text: 'Now slide the T-square up until it touches the set square, and hold it there.' },
        { text: 'The T-square is now a track. It cannot move.' },
        { text: 'Slide the set square along that track until its edge reaches P.', at: L5P, label: 'slide to P' },
        { text: 'The edge is still pointing the same way, because the track is straight.' },
        { text: 'Draw. That line is parallel.' },
        { text: 'One rule. Your left hand holds the T-square down the whole time. If it shifts, start again.' },
      ],
      marks: [],
    },
    {
      id: 'set-compass-gap',
      title: 'The compass way: measure the gap',
      tool: 'compass',
      compassRadius: L5_GAP,
      focus: { at: pt(200, 165), r: 135 },
      tip: 'Use this when the line is at an awkward angle, or when the exam says construct.',
      lines: [
        { text: 'Now the compass way. Use this when the exam says construct.' },
        { text: 'First we need the gap. That is the perpendicular distance from P down to the line.' },
        { text: 'You already know how to find it. Drop a perpendicular from P.' },
        { text: 'Here it is sixty-five millimetres.', at: pt(L5P.x, 162), label: '65 mm' },
        { text: 'Set your compass to exactly that. Sixty-five.', compassRadius: L5_GAP },
        { text: 'Do not change it again.', alert: { part: 'screw', forbidden: true } },
      ],
      markLines: [2, 3],
      marks: [
        { kind: 'line', style: 'construction', a: L5P, b: pt(L5P.x, L5A.y) },
        { kind: 'dim', a: pt(L5P.x, L5A.y), b: L5P, offset: 22, label: '65' },
      ],
    },
    {
      id: 'two-arcs',
      title: 'Swing two arcs above the line',
      tool: 'compass',
      compassRadius: L5_GAP,
      focus: { at: pt(200, 160), r: 140 },
      tip: 'Two arcs, far apart. The parallel is the line that just touches the top of both.',
      lines: [
        { text: 'Pick any point on the line, well over to the left.', at: L5Q1, label: 'any point' },
        { text: 'Needle there, and swing an arc above.', at: polar(L5Q1, L5_GAP, 75) },
        { text: 'Now pick another point well over to the right.', at: L5Q2 },
        { text: 'Same opening. Swing another arc above.', at: polar(L5Q2, L5_GAP, 105) },
        { text: 'Put them far apart. Two arcs close together give a wobbly answer.' },
      ],
      markLines: [1, 3],
      marks: [
        { kind: 'arc', style: 'construction', c: L5Q1, r: L5_GAP, from: 58, to: 122 },
        { kind: 'arc', style: 'construction', c: L5Q2, r: L5_GAP, from: 58, to: 122 },
      ],
    },
    {
      id: 'tangent-line',
      title: 'Rest a line on top of both arcs',
      tool: 'set45',
      teeY: L5P.y,
      focus: { at: pt(200, 160), r: 135 },
      tip: 'The line must just kiss both arcs. If it cuts through them, it is not parallel.',
      lines: [
        { text: 'Now lay your rule so it just touches the top of both arcs.', at: L5P, label: 'just touching' },
        { text: 'Just touching. It must not cut into them.' },
        { text: 'When a line touches a curve at one point only, we say it is tangent to it.' },
        { text: 'Draw the line.' },
        { text: 'Look where it goes. Straight through P.', at: L5P },
        { text: 'And it is exactly sixty-five from AB everywhere along its length.' },
        { text: 'That is your parallel, and every arc is still on the paper as your working.' },
      ],
      markLines: [3, 5, 5],
      marks: [
        { kind: 'line', style: 'outline', a: pt(95, L5P.y), b: pt(315, L5P.y) },
        { kind: 'dim', a: pt(150, L5A.y), b: pt(150, L5P.y), offset: 0, label: '65' },
        { kind: 'dim', a: pt(265, L5A.y), b: pt(265, L5P.y), offset: 0, label: '65' },
      ],
    },
  ],
};

/* ========================================================================== 6
 * Bisecting an angle
 * ======================================================================== */

const A6V = pt(120, 215);
const A6_ARM = 115;
const A6_OPEN = 60;
const A6Arm0 = polar(A6V, A6_ARM, 0);
const A6Arm60 = polar(A6V, A6_ARM, A6_OPEN);
const A6_ARC = 58;
const A6P = polar(A6V, A6_ARC, 0);
const A6Q = polar(A6V, A6_ARC, A6_OPEN);
const A6_CROSS = 40;
const A6R = farther(cross(A6P, A6_CROSS, A6Q, A6_CROSS), A6V);

const BISECT_ANGLE: DrawTopic = {
  id: 'bisect-angle',
  title: 'Bisecting an angle',
  subtitle: 'Cut any angle exactly in half without ever reading a protractor.',
  goal: 'Bisect an angle with a compass, and use repeated bisection to build angles a protractor cannot give you.',
  minutes: 22,
  level: 'Basic',
  tools: ['T-square', '30/60 set square', 'Compass', 'HB pencil'],
  base: preparedSheet('BISECTING AN ANGLE', '06'),
  steps: [
    {
      id: 'draw-angle',
      title: 'Draw the angle',
      tool: 'set30',
      teeY: A6V.y,
      focus: { at: pt(170, 175), r: 145 },
      tip: 'The corner where two lines meet is called the vertex.',
      lines: [
        { text: 'We already cut a line in half. Now we cut an angle in half.' },
        { text: 'First we need an angle. Draw a horizontal line with your T-square.', at: A6Arm0 },
        { text: 'Put a dot at the left end and call it V, for vertex.', at: A6V, label: 'V' },
        { text: 'The vertex is the corner. It is where the two arms meet.' },
        { text: 'Now take the thirty sixty set square and draw the second arm at sixty degrees.', at: A6Arm60, label: '60°' },
        { text: 'Two arms and a corner. That is an angle.' },
      ],
      markLines: [1, 4, 2, 4],
      marks: [
        { kind: 'line', style: 'outline', a: A6V, b: A6Arm0 },
        { kind: 'line', style: 'outline', a: A6V, b: A6Arm60 },
        { kind: 'dot', at: A6V, label: 'V', labelAngle: 210 },
        { kind: 'angle', at: A6V, from: 0, to: A6_OPEN, r: 22, label: '60°' },
      ],
    },
    {
      id: 'arc-across-arms',
      title: 'Cut both arms with one arc',
      tool: 'compass',
      compassRadius: A6_ARC,
      focus: { at: pt(165, 180), r: 130 },
      tip: 'This first arc can be any size at all, as long as it crosses both arms.',
      lines: [
        { text: 'Put the needle on the vertex.', compassRadius: 14, at: A6V, label: 'needle on V' },
        { text: 'Open the compass to any comfortable size. It really does not matter.', compassRadius: 58 },
        { text: 'Swing one arc that cuts across both arms.', at: polar(A6V, A6_ARC, 30), label: 'cut both arms' },
        { text: 'It crosses the bottom arm here. Call it P.', at: A6P, label: 'P' },
        { text: 'And the top arm here. Call it Q.', at: A6Q, label: 'Q' },
        { text: 'P and Q are now the same distance from V. That is the whole idea.' },
      ],
      markLines: [2, 3, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: A6V, r: A6_ARC, from: -8, to: 72 },
        { kind: 'dot', at: A6P, label: 'P', labelAngle: -70 },
        { kind: 'dot', at: A6Q, label: 'Q', labelAngle: 110 },
      ],
    },
    {
      id: 'cross-arcs',
      title: 'Equal arcs from P and Q',
      tool: 'compass',
      compassRadius: A6_CROSS,
      focus: { at: pt(175, 180), r: 125 },
      tip: 'Same opening from both points. That is what puts the crossing exactly in the middle.',
      lines: [
        { text: 'Move the needle to P.', compassRadius: 40, at: A6P, label: 'needle on P' },
        { text: 'Swing a small arc inside the angle.', at: polar(A6P, A6_CROSS, 75) },
        { text: 'Now the needle to Q. Do not change the opening.', at: A6Q, label: 'needle on Q' },
        { text: 'Swing another arc, crossing the first.', at: A6R, label: 'they cross' },
        { text: 'Mark the crossing. Call it R.', focus: { at: A6V, r: 70 }, at: A6R, label: 'R' },
      ],
      markLines: [1, 3, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: A6P, r: A6_CROSS, from: 62, to: 122 },
        { kind: 'arc', style: 'construction', c: A6Q, r: A6_CROSS, from: -30, to: 30 },
        { kind: 'dot', at: A6R, label: 'R', labelAngle: 45 },
      ],
    },
    {
      id: 'join-bisector',
      title: 'Join V through R',
      tool: 'set45',
      teeY: A6V.y,
      focus: { at: pt(175, 180), r: 130 },
      tip: 'Bisect 60° to get 30°. Bisect again for 15°, again for 7½°. No protractor can do that.',
      lines: [
        { text: 'Draw a line from V, through R, and carry on past.', at: A6R, label: 'V through R' },
        { text: 'That is the bisector.' },
        { text: 'Check it. Sixty was the angle. Now there is thirty on this side.', at: polar(A6V, 36, 15), label: '30°' },
        { text: 'And thirty on this side.', at: polar(A6V, 36, 45), label: '30°' },
        { text: 'Thirty and thirty make sixty. It works.' },
        { text: 'And we never touched a protractor.' },
        { text: 'Bisect the thirty and you get fifteen. Bisect again, seven and a half.' },
        { text: 'That is how you build angles a protractor cannot read.' },
      ],
      markLines: [0, 2, 3],
      marks: [
        { kind: 'line', style: 'outline', a: A6V, b: polar(A6V, A6_ARM, A6_OPEN / 2) },
        { kind: 'angle', at: A6V, from: 0, to: 30, r: 34, label: '30°' },
        { kind: 'angle', at: A6V, from: 30, to: 60, r: 34, label: '30°' },
      ],
    },
  ],
};

/* ========================================================================== 7
 * Various angles constructed without a protractor
 * ======================================================================== */

const A7V = pt(110, 232);
const A7_R = 62;
const A7_ARM = 95;
const A7C = polar(A7V, A7_R, 0);
const A7At60 = polar(A7V, A7_R, 60);
const A7At120 = polar(A7V, A7_R, 120);
const A7Bis = farther(cross(A7C, 45, A7At60, 45), A7V);

const A7V2 = pt(300, 232);
const A7_STEP2 = 35;
const A7L = pt(A7V2.x - A7_STEP2, A7V2.y);
const A7Rt = pt(A7V2.x + A7_STEP2, A7V2.y);
const A7Up = nearer(cross(A7L, 52, A7Rt, 52), pt(A7V2.x, 0));
const A7P45a = polar(A7V2, 45, 0);
const A7P45b = polar(A7V2, 45, 90);
const A7R45 = farther(cross(A7P45a, 32, A7P45b, 32), A7V2);

const ANGLES_WITHOUT_PROTRACTOR: DrawTopic = {
  id: 'angles-without-protractor',
  title: 'Various angles constructed without a protractor',
  subtitle: 'Build 60°, 120°, 30°, 90° and 45° with nothing but a compass.',
  goal: 'Construct the standard angles from first principles, and know which ones bisection can reach.',
  minutes: 32,
  level: 'Core',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('ANGLES BY CONSTRUCTION', '07'),
  steps: [
    {
      id: 'why',
      title: 'Why bother without a protractor?',
      tool: 'hand',
      focus: { at: pt(210, 200), r: 200 },
      tip: 'A protractor is only accurate to about half a degree. A construction is exact.',
      lines: [
        { text: 'You own a protractor. So why learn this?' },
        { text: 'Two reasons, and both matter.' },
        { text: 'First, a protractor is a guess. You read it to about half a degree, if your eyes are good.' },
        { text: 'A construction is exact. Sixty degrees is exactly sixty.' },
        { text: 'Second, the exam often bans it. It will say construct, without a protractor.' },
        { text: 'Today we build sixty, one hundred and twenty, thirty, ninety and forty-five.' },
      ],
      markLines: [1, 1, 4],
      marks: [
        { kind: 'line', style: 'outline', a: pt(60, A7V.y), b: pt(390, A7V.y) },
        { kind: 'dot', at: A7V, label: 'V', labelAngle: -110 },
        { kind: 'dot', at: A7V2, label: 'W', labelAngle: -110 },
      ],
    },
    {
      id: 'sixty',
      title: '60° — the one that starts everything',
      tool: 'compass',
      compassRadius: A7_R,
      focus: { at: pt(125, 195), r: 120 },
      tip: 'The radius of a circle always cuts its own circumference at exactly 60°.',
      lines: [
        { text: 'Sixty degrees comes free from any circle. Watch.', compassRadius: 62 },
        { text: 'Needle on V, swing an arc that crosses the line.', at: A7C, label: 'crosses at C' },
        { text: 'Now move the needle to C. Keep exactly the same opening.', at: A7C, label: 'needle on C' },
        { text: 'Swing again, and cut the first arc.', at: A7At60, label: 'they cross' },
        { text: 'Join V to that crossing.' },
        { text: 'That angle is sixty degrees. Exactly sixty, every time.' },
        { text: 'Why? Because you have just built an equilateral triangle. Three equal sides, three equal angles.' },
        { text: 'One hundred and eighty divided by three is sixty.' },
      ],
      markLines: [1, 3, 4, 5],
      marks: [
        { kind: 'arc', style: 'construction', c: A7V, r: A7_R, from: -6, to: 130 },
        { kind: 'arc', style: 'construction', c: A7C, r: A7_R, from: 100, to: 145 },
        { kind: 'line', style: 'outline', a: A7V, b: polar(A7V, A7_ARM, 60) },
        { kind: 'angle', at: A7V, from: 0, to: 60, r: 26, label: '60°' },
      ],
    },
    {
      id: 'one-twenty',
      title: '120° — step round once more',
      tool: 'compass',
      compassRadius: A7_R,
      focus: { at: pt(110, 190), r: 125 },
      tip: '60 + 60 = 120. Stepping the radius round the arc adds 60° every time.',
      lines: [
        { text: 'Now do not change the compass at all.', alert: { part: 'screw', forbidden: true } },
        { text: 'Move the needle into the sixty degree crossing.', at: A7At60, label: 'needle here' },
        { text: 'Swing once more, further round the arc.', at: A7At120, label: 'next crossing' },
        { text: 'Join V to that.' },
        { text: 'Sixty plus sixty. One hundred and twenty degrees.' },
        { text: 'Every step round the arc adds another sixty. Step again and you would have one hundred and eighty.' },
      ],
      markLines: [2, 3, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: A7At60, r: A7_R, from: 155, to: 200 },
        { kind: 'line', style: 'outline', a: A7V, b: polar(A7V, A7_ARM, 120) },
        { kind: 'angle', at: A7V, from: 60, to: 120, r: 38, label: '120°' },
      ],
    },
    {
      id: 'thirty',
      title: '30° — bisect the 60°',
      tool: 'compass',
      compassRadius: 45,
      focus: { at: pt(140, 200), r: 115 },
      tip: 'Halving is how you reach 30, 15 and 7½. You cannot reach 20° or 40° this way.',
      lines: [
        { text: 'Thirty is just half of sixty, so we bisect.', compassRadius: 45 },
        { text: 'Needle on C, swing an arc inside the angle.', at: A7C, label: 'needle on C' },
        { text: 'Needle on the sixty degree point, same opening, cross it.', at: A7Bis, label: 'they cross' },
        { text: 'Join V through the crossing. That is thirty degrees.' },
        { text: 'Now think about what halving can and cannot reach.' },
        { text: 'From sixty you get thirty, fifteen, seven and a half.' },
        { text: 'You will never reach twenty or forty by halving. That is worth knowing before an exam.' },
      ],
      markLines: [1, 2, 3, 3],
      marks: [
        { kind: 'arc', style: 'construction', c: A7C, r: 45, from: 80, to: 140 },
        { kind: 'arc', style: 'construction', c: A7At60, r: 45, from: -50, to: 10 },
        { kind: 'line', style: 'outline', a: A7V, b: polar(A7V, A7_ARM, 30) },
        { kind: 'angle', at: A7V, from: 0, to: 30, r: 50, label: '30°' },
      ],
    },
    {
      id: 'ninety',
      title: '90° — a perpendicular at W',
      tool: 'compass',
      compassRadius: 52,
      focus: { at: pt(300, 195), r: 120 },
      tip: 'A right angle is just the perpendicular you built in lesson two.',
      lines: [
        { text: 'Now move along to the second vertex, W.', at: A7V2, label: 'W' },
        { text: 'Ninety degrees is nothing new. It is a perpendicular at a point on a line.' },
        { text: 'Step the same distance each side of W.', at: A7L, label: 'equal each side', compassRadius: 52 },
        { text: 'Then open wider and bisect between those two points.', at: A7Up, label: 'cross above' },
        { text: 'Join W to the crossing. That is ninety degrees.' },
      ],
      markLines: [2, 2, 3, 3, 4, 4, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: A7V2, r: A7_STEP2, from: 165, to: 195 },
        { kind: 'arc', style: 'construction', c: A7V2, r: A7_STEP2, from: -15, to: 15 },
        { kind: 'arc', style: 'construction', c: A7L, r: 52, from: 35, to: 90 },
        { kind: 'arc', style: 'construction', c: A7Rt, r: 52, from: 90, to: 145 },
        { kind: 'line', style: 'outline', a: A7V2, b: polar(A7V2, A7_ARM, 90) },
        { kind: 'angle', at: A7V2, from: 0, to: 90, r: 15, square: true },
        { kind: 'text', at: pt(A7V2.x + 6, 205), text: '90°', size: 3.6, align: 'left', bold: true, colour: '#1d4ed8' },
      ],
    },
    {
      id: 'forty-five',
      title: '45° — bisect the right angle',
      tool: 'compass',
      compassRadius: 32,
      focus: { at: pt(320, 195), r: 120 },
      tip: 'Every angle on this sheet came from one arc and one compass. No protractor touched the paper.',
      lines: [
        { text: 'Last one. Forty-five is half of ninety, so we bisect again.', compassRadius: 32 },
        { text: 'Arc from W cutting both arms.', at: A7P45a, label: 'cut both arms' },
        { text: 'Equal arcs from those two cuts, crossing in the middle.', at: A7R45, label: 'they cross' },
        { text: 'Join W through, and there is forty-five.' },
        { text: 'Now look back over the whole sheet.' },
        { text: 'Sixty. One hundred and twenty. Thirty. Ninety. Forty-five.' },
        { text: 'One compass, no protractor, and every one of them exact.' },
      ],
      markLines: [1, 2, 2, 3, 3],
      marks: [
        { kind: 'arc', style: 'construction', c: A7V2, r: 45, from: -6, to: 96 },
        { kind: 'arc', style: 'construction', c: A7P45a, r: 32, from: 70, to: 130 },
        { kind: 'arc', style: 'construction', c: A7P45b, r: 32, from: -20, to: 40 },
        { kind: 'line', style: 'outline', a: A7V2, b: polar(A7V2, A7_ARM, 45) },
        { kind: 'angle', at: A7V2, from: 0, to: 45, r: 58, label: '45°' },
      ],
    },
  ],
};

/* ========================================================================== 8
 * A copied angle
 * ======================================================================== */

const A8V = pt(85, 135);
const A8_OPEN = 55;
const A8_ARM = 85;
const A8_ARC = 45;
const A8P = polar(A8V, A8_ARC, 0);
const A8Q = polar(A8V, A8_ARC, A8_OPEN);
const A8_CHORD = dist(A8P, A8Q);
const A8V2 = pt(235, 135);
const A8P2 = polar(A8V2, A8_ARC, 0);
const A8Q2 = nearer(cross(A8V2, A8_ARC, A8P2, A8_CHORD), pt(A8V2.x, 0));

const COPIED_ANGLE: DrawTopic = {
  id: 'copied-angle',
  title: 'A copied angle',
  subtitle: 'Move an angle to a new place without ever knowing how big it is.',
  goal: 'Transfer an angle exactly, using the chord across an arc as the measurement.',
  minutes: 22,
  level: 'Core',
  tools: ['T-square', 'Compass', 'HB pencil'],
  base: preparedSheet('COPYING AN ANGLE', '08'),
  steps: [
    {
      id: 'the-problem',
      title: 'Copy it without measuring it',
      tool: 'hand',
      focus: { at: pt(220, 130), r: 200 },
      tip: 'You never find out what the angle is. You do not need to.',
      lines: [
        { text: 'Here is an angle at V.', at: A8V, label: 'the original' },
        { text: 'And here is a new line at W, with no angle on it yet.', at: A8V2, label: 'the new line' },
        { text: 'The job is to copy the angle from V onto W.' },
        { text: 'And here is what makes it interesting.' },
        { text: 'You are not told what the angle is. You never find out.' },
        { text: 'You do not need to. The compass carries it across for you.' },
      ],
      markLines: [0, 1, 0, 1, 1],
      marks: [
        { kind: 'line', style: 'outline', a: A8V, b: polar(A8V, A8_ARM, 0) },
        { kind: 'line', style: 'outline', a: A8V, b: polar(A8V, A8_ARM, A8_OPEN) },
        { kind: 'dot', at: A8V, label: 'V', labelAngle: 200 },
        { kind: 'line', style: 'outline', a: A8V2, b: pt(390, A8V2.y) },
        { kind: 'dot', at: A8V2, label: 'W', labelAngle: 200 },
      ],
    },
    {
      id: 'arc-both',
      title: 'One arc, swung at both vertices',
      tool: 'compass',
      compassRadius: A8_ARC,
      focus: { at: pt(190, 120), r: 165 },
      tip: 'The same radius at both corners. If it changes, the copy is wrong.',
      lines: [
        { text: 'Set the compass to any size and put the needle on V.', compassRadius: 45, at: A8V, label: 'needle on V' },
        { text: 'Swing an arc across both arms of the original angle.', at: A8Q, label: 'across both arms' },
        { text: 'Call the cuts P and Q.', at: A8P, label: 'P' },
        { text: 'Now carry that same compass across to W. Do not change it.', alert: { part: 'screw', forbidden: true }, at: A8V2, label: 'needle on W' },
        { text: 'Swing the same arc there. It cuts the new line at one point.', at: A8P2, label: 'call it X' },
        { text: 'Same radius at both corners. That is what makes the copy exact.' },
      ],
      markLines: [1, 2, 2, 4, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: A8V, r: A8_ARC, from: -8, to: 68 },
        { kind: 'dot', at: A8P, label: 'P', labelAngle: -70 },
        { kind: 'dot', at: A8Q, label: 'Q', labelAngle: 110 },
        { kind: 'arc', style: 'construction', c: A8V2, r: A8_ARC, from: -8, to: 80 },
        { kind: 'dot', at: A8P2, label: 'X', labelAngle: -70 },
      ],
    },
    {
      id: 'measure-chord',
      title: 'Pick up the gap from P to Q',
      tool: 'compass',
      compassRadius: A8_CHORD,
      focus: { at: pt(130, 115), r: 105 },
      tip: 'The straight gap across an arc is called a chord. The chord is the angle, in disguise.',
      lines: [
        { text: 'Now change the compass. Open it to the gap from P to Q.', at: mid(A8P, A8Q), label: 'P to Q' },
        { text: 'Needle in one, pencil in the other. That is all.' },
        { text: 'That straight gap across the arc has a name. It is called a chord.' },
        { text: 'And here is the idea of the whole lesson.' },
        { text: 'For a given radius, one chord means one angle. Always.' },
        { text: 'So if you carry the chord across, you carry the angle across.' },
      ],
      markLines: [1],
      marks: [{ kind: 'line', style: 'construction', a: A8P, b: A8Q }],
    },
    {
      id: 'mark-and-join',
      title: 'Step the chord across and join',
      tool: 'compass',
      compassRadius: A8_CHORD,
      focus: { at: pt(285, 115), r: 115 },
      tip: 'Exam trick: to copy a triangle, copy one side then two angles the same way.',
      lines: [
        { text: 'Take the compass to X on the new line.', at: A8P2, label: 'needle on X' },
        { text: 'Swing a small arc that cuts the arc you drew at W.', at: A8Q2, label: 'they cross' },
        { text: 'Mark that crossing. Call it Y.', at: A8Q2, label: 'Y' },
        { text: 'Now join W to Y, and carry it on.' },
        { text: 'Put the two angles side by side and look at them.' },
        { text: 'They are identical. And you still do not know what they measure.' },
        { text: 'That is copying an angle.' },
      ],
      markLines: [1, 2, 3, 4, 4],
      marks: [
        { kind: 'arc', style: 'construction', c: A8P2, r: A8_CHORD, from: 70, to: 130 },
        { kind: 'dot', at: A8Q2, label: 'Y', labelAngle: 110 },
        { kind: 'line', style: 'outline', a: A8V2, b: polar(A8V2, A8_ARM, A8_OPEN) },
        { kind: 'angle', at: A8V, from: 0, to: A8_OPEN, r: 24, label: 'θ' },
        { kind: 'angle', at: A8V2, from: 0, to: A8_OPEN, r: 24, label: 'θ' },
      ],
    },
  ],
};

/* ========================================================================== 9
 * The centre of a given arc or circle
 * ======================================================================== */

const C9O = pt(210, 200);
const C9_R = 85;
const C9A = polar(C9O, C9_R, 140);
const C9B = polar(C9O, C9_R, 90);
const C9C = polar(C9O, C9_R, 40);
const C9_BIS = 52;
const [C9AB1, C9AB2] = cross(C9A, C9_BIS, C9B, C9_BIS);
const [C9BC1, C9BC2] = cross(C9B, C9_BIS, C9C, C9_BIS);

const ARC_CENTRE: DrawTopic = {
  id: 'arc-centre',
  title: 'The centre of a given arc or circle',
  subtitle: 'Someone drew the curve and lost the centre. Find it again.',
  goal: 'Recover the centre of any arc or circle from two chords and their perpendicular bisectors.',
  minutes: 25,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Compass', 'HB pencil'],
  base: preparedSheet('CENTRE OF AN ARC', '09'),
  steps: [
    {
      id: 'the-problem',
      title: 'A curve with no centre mark',
      tool: 'hand',
      focus: { at: pt(210, 170), r: 190 },
      tip: 'This is a real workshop job: measuring a broken casting to find its original radius.',
      lines: [
        { text: 'Here is an arc. Just the curve, nothing else.' },
        { text: 'Somebody drew it, then rubbed out the centre.' },
        { text: 'Your job is to find where the compass point was.' },
        { text: 'This is not a made-up exam question. It is a real workshop job.' },
        { text: 'A casting arrives broken, with a curved edge, and you must find its radius.' },
        { text: 'You find the centre first. Then you measure out to the curve, and that is the radius.' },
      ],
      markLines: [0],
      marks: [{ kind: 'arc', style: 'outline', c: C9O, r: C9_R, from: 34, to: 146 }],
    },
    {
      id: 'three-points',
      title: 'Mark any three points on the curve',
      tool: 'pencil',
      focus: { at: pt(210, 160), r: 140 },
      tip: 'Any three points on the curve will do — but spread them out for accuracy.',
      lines: [
        { text: 'Pick any three points on the curve.', at: C9B, label: 'any three' },
        { text: 'Anywhere at all. Do not measure them.' },
        { text: 'But spread them out. Three points bunched together give a poor answer.' },
        { text: 'Call them A, B and C.', at: C9A, label: 'A' },
        { text: 'Now join A to B, and B to C, with straight lines.', at: mid(C9A, C9B) },
        { text: 'Each straight line across a curve is a chord. You met that word last lesson.' },
      ],
      markLines: [3, 3, 3, 4, 4],
      marks: [
        { kind: 'dot', at: C9A, label: 'A', labelAngle: 160 },
        { kind: 'dot', at: C9B, label: 'B', labelAngle: 90 },
        { kind: 'dot', at: C9C, label: 'C', labelAngle: 20 },
        { kind: 'line', style: 'construction', a: C9A, b: C9B },
        { kind: 'line', style: 'construction', a: C9B, b: C9C },
      ],
    },
    {
      id: 'bisect-ab',
      title: 'Bisect the first chord',
      tool: 'compass',
      compassRadius: C9_BIS,
      focus: { at: pt(180, 170), r: 130 },
      tip: 'The perpendicular bisector of any chord always passes through the centre.',
      lines: [
        { text: 'Now bisect the chord A B. You know exactly how.', compassRadius: 52 },
        { text: 'Equal arcs from A and from B, above and below.', at: C9AB1, label: 'equal arcs' },
        { text: 'Join the two crossings.' },
        { text: 'Here is the rule that makes this whole lesson work.' },
        { text: 'The perpendicular bisector of a chord always runs through the centre of the circle.' },
        { text: 'Always. So the centre is somewhere on this line.' },
        { text: 'We do not know where yet. We just know it is on it.' },
      ],
      markLines: [1, 1, 1, 1, 2],
      marks: [
        { kind: 'arc', style: 'construction', c: C9A, r: C9_BIS, from: bearing(C9A, C9AB1) - 28, to: bearing(C9A, C9AB1) + 28 },
        { kind: 'arc', style: 'construction', c: C9B, r: C9_BIS, from: bearing(C9B, C9AB1) - 28, to: bearing(C9B, C9AB1) + 28 },
        { kind: 'arc', style: 'construction', c: C9A, r: C9_BIS, from: bearing(C9A, C9AB2) - 28, to: bearing(C9A, C9AB2) + 28 },
        { kind: 'arc', style: 'construction', c: C9B, r: C9_BIS, from: bearing(C9B, C9AB2) - 28, to: bearing(C9B, C9AB2) + 28 },
        { kind: 'line', style: 'construction', a: lerpPt(C9AB1, C9AB2, -0.35), b: lerpPt(C9AB1, C9AB2, 1.35) },
      ],
    },
    {
      id: 'bisect-bc',
      title: 'Bisect the second chord',
      tool: 'compass',
      compassRadius: C9_BIS,
      focus: { at: pt(240, 170), r: 130 },
      tip: 'Two lines fix a point. One chord is never enough.',
      lines: [
        { text: 'Now do exactly the same to the chord B C.' },
        { text: 'Equal arcs from B and from C.', at: C9BC1, label: 'equal arcs' },
        { text: 'Join those crossings too.' },
        { text: 'So now the centre is on this line as well.' },
        { text: 'And if it is on both lines, there is only one place it can be.' },
      ],
      markLines: [1, 1, 1, 1, 2],
      marks: [
        { kind: 'arc', style: 'construction', c: C9B, r: C9_BIS, from: bearing(C9B, C9BC1) - 28, to: bearing(C9B, C9BC1) + 28 },
        { kind: 'arc', style: 'construction', c: C9C, r: C9_BIS, from: bearing(C9C, C9BC1) - 28, to: bearing(C9C, C9BC1) + 28 },
        { kind: 'arc', style: 'construction', c: C9B, r: C9_BIS, from: bearing(C9B, C9BC2) - 28, to: bearing(C9B, C9BC2) + 28 },
        { kind: 'arc', style: 'construction', c: C9C, r: C9_BIS, from: bearing(C9C, C9BC2) - 28, to: bearing(C9C, C9BC2) + 28 },
        { kind: 'line', style: 'construction', a: lerpPt(C9BC1, C9BC2, -0.35), b: lerpPt(C9BC1, C9BC2, 1.35) },
      ],
    },
    {
      id: 'the-centre',
      title: 'Where they cross is the centre',
      tool: 'compass',
      compassRadius: C9_R,
      focus: { at: C9O, r: 130 },
      tip: 'Check your work: put the needle on O and the curve should run straight back through A, B and C.',
      lines: [
        { text: 'Look where the two bisectors cross.', at: C9O, label: 'the centre' },
        { text: 'That is the centre. Call it O.', at: C9O, label: 'O' },
        { text: 'Now check it, because you should always check.' },
        { text: 'Put the needle on O and open the compass out to A.', compassRadius: 85 },
        { text: 'Swing right round.' },
        { text: 'It runs straight through B and through C, and along the whole curve.', at: polar(C9O, C9_R, 60) },
        { text: 'It fits. So O is the centre, and that opening is the radius.' },
        { text: 'If it does not fit, one of your arcs slipped. Do it again.' },
      ],
      markLines: [1, 4, 6],
      marks: [
        { kind: 'dot', at: C9O, label: 'O', labelAngle: -90 },
        { kind: 'circle', style: 'hidden', c: C9O, r: C9_R },
        { kind: 'dim', a: C9O, b: C9B, offset: 0, label: 'R' },
      ],
    },
  ],
};

/* ========================================================================= 10
 * Various geometrical shapes
 * ======================================================================== */

const S10R = 45;
const S10Hex = pt(105, 155);
const S10Tri = pt(235, 155);
const S10Sq = pt(360, 155);
const hexAngles = [90, 30, -30, -90, -150, 150];
const hexPoints = hexAngles.map((angle) => polar(S10Hex, S10R, angle));
const triPoints = [90, -30, 210].map((angle) => polar(S10Tri, S10R, angle));
const sqPoints = [45, 135, 225, 315].map((angle) => polar(S10Sq, S10R, angle));

const GEOMETRIC_SHAPES: DrawTopic = {
  id: 'geometric-shapes',
  title: 'Various geometrical shapes',
  subtitle: 'Triangle, square and hexagon, all built inside one circle.',
  goal: 'Inscribe a regular triangle, square and hexagon in a circle, and know why the compass radius steps round six times.',
  minutes: 30,
  level: 'Core',
  tools: ['T-square', '45° set square', '30/60 set square', 'Compass'],
  base: preparedSheet('SHAPES IN A CIRCLE', '10'),
  steps: [
    {
      id: 'why-circle',
      title: 'Start every regular shape with a circle',
      tool: 'hand',
      focus: { at: pt(230, 155), r: 200 },
      tip: 'Regular means all sides equal and all angles equal. A circle guarantees it.',
      lines: [
        { text: 'Today we draw three shapes. A triangle, a square and a hexagon.' },
        { text: 'All three start the same way. With a circle.' },
        { text: 'Why? Because every corner sits on the circle, so every corner is the same distance from the middle.' },
        { text: 'That is what makes a shape regular. All sides equal, all angles equal.' },
        { text: 'Draw three circles, all the same size, with their centre lines.' },
        { text: 'Now we cut each one up a different way.' },
      ],
      markLines: [4, 4, 4, 4, 4, 4, 4, 4, 4],
      marks: [
        ...[S10Hex, S10Tri, S10Sq].flatMap<Mark>((centre) => [
          { kind: 'line', style: 'centre', a: pt(centre.x - S10R - 10, centre.y), b: pt(centre.x + S10R + 10, centre.y) },
          { kind: 'line', style: 'centre', a: pt(centre.x, centre.y - S10R - 10), b: pt(centre.x, centre.y + S10R + 10) },
          { kind: 'circle', style: 'outline', c: centre, r: S10R },
        ]),
      ],
    },
    {
      id: 'hexagon',
      title: 'Hexagon — step the radius six times',
      tool: 'compass',
      compassRadius: S10R,
      focus: { at: S10Hex, r: 105 },
      tip: 'The radius of a circle steps round its own circumference exactly six times. Not roughly — exactly.',
      lines: [
        { text: 'Start with the hexagon. Hex means six.' },
        { text: 'This is the shape of every nut and every bolt head, so you will draw it often.' },
        { text: 'Here is the beautiful part.' },
        { text: 'The radius of a circle fits round the edge of that same circle exactly six times.' },
        { text: 'So leave the compass at the radius, and put the needle on the top of the circle.', compassRadius: 45, at: hexPoints[0], label: 'start at the top' },
        { text: 'Swing, and it cuts the circle. Move into the cut and swing again.', at: hexPoints[1] },
        { text: 'Walk right round. The sixth one lands exactly where you started.', at: hexPoints[4] },
        { text: 'Join the six points. If it does not close, your compass moved.' },
      ],
      markLines: [5, 5, 5, 6, 6, 6, 7, 7],
      marks: [
        ...hexPoints.map<Mark>((point, index) => ({
          kind: 'arc',
          style: 'construction',
          c: point,
          r: S10R,
          from: hexAngles[index] - 134,
          to: hexAngles[index] - 106,
        })),
        { kind: 'poly', style: 'outline', close: true, points: hexPoints },
        { kind: 'text', at: pt(S10Hex.x, S10Hex.y + 72), text: 'HEXAGON', size: 3.8, align: 'center', bold: true },
      ],
    },
    {
      id: 'triangle',
      title: 'Triangle — join every other point',
      tool: 'compass',
      compassRadius: S10R,
      focus: { at: S10Tri, r: 105 },
      tip: 'A hexagon has six points. Skip every other one and you have an equilateral triangle.',
      lines: [
        { text: 'The triangle is almost free, once you can do the hexagon.' },
        { text: 'Step the radius round exactly as before. Six points.', at: polar(S10Tri, S10R, 30) },
        { text: 'But this time, do not join them all.' },
        { text: 'Join every other one. Skip, join, skip, join.', at: triPoints[0], label: 'skip one' },
        { text: 'Three points instead of six.' },
        { text: 'That is an equilateral triangle. Three equal sides, and every angle sixty degrees.' },
        { text: 'Six points, joined two different ways, give you two different shapes.' },
      ],
      markLines: [1, 1, 1, 1, 1, 1, 3, 4],
      marks: [
        ...[90, 30, -30, -90, -150, 150].map<Mark>((angle) => ({
          kind: 'dot',
          at: polar(S10Tri, S10R, angle),
          style: 'construction',
        })),
        { kind: 'poly', style: 'outline', close: true, points: triPoints },
        { kind: 'text', at: pt(S10Tri.x, S10Tri.y + 72), text: 'EQUILATERAL TRIANGLE', size: 3.8, align: 'center', bold: true },
      ],
    },
    {
      id: 'square',
      title: 'Square — two diameters at 45°',
      tool: 'set45',
      teeY: S10Sq.y,
      focus: { at: S10Sq, r: 105 },
      tip: 'The square is the one shape you do not step round. Its corners are 90° apart, not 60°.',
      lines: [
        { text: 'The square is different, and this catches people out.' },
        { text: 'You cannot step the radius round for a square. That only gives sixties.' },
        { text: 'A square needs ninety degrees between its corners.' },
        { text: 'So take your forty-five degree set square instead.' },
        { text: 'Draw one diameter at forty-five degrees through the centre.', at: sqPoints[0], label: '45°' },
        { text: 'Then flip it over and draw the other one, crossing at ninety.', at: sqPoints[1] },
        { text: 'Now join the four points where those lines meet the circle.' },
        { text: 'A square, sitting neatly inside the circle.' },
      ],
      markLines: [4, 5, 6, 6],
      marks: [
        { kind: 'line', style: 'construction', a: sqPoints[2], b: sqPoints[0] },
        { kind: 'line', style: 'construction', a: sqPoints[1], b: sqPoints[3] },
        { kind: 'poly', style: 'outline', close: true, points: sqPoints },
        { kind: 'text', at: pt(S10Sq.x, S10Sq.y + 72), text: 'SQUARE', size: 3.8, align: 'center', bold: true },
      ],
    },
  ],
};

/* ========================================================================= 11
 * Straight lines joined to curves by an arc
 * ======================================================================== */

const B11Corner = pt(105, 210);
const B11 = blendArc(B11Corner, 0, 90, 40);
const B11Vertex = pt(300, 218);
const B11b = blendArc(B11Vertex, 0, 60, 30);
/** Line-to-circle blend: the centre is R from the line and (r + R) from the circle. */
const B11CircleO = pt(185, 88);
const B11_CR = 32;
const B11_LINE_Y = 148;
const B11_BR = 40;
const B11cCentre = pt(
  B11CircleO.x + Math.sqrt((B11_CR + B11_BR) ** 2 - (B11_LINE_Y - B11_BR - B11CircleO.y) ** 2),
  B11_LINE_Y - B11_BR
);
const B11cOnCircle = lerpPt(B11CircleO, B11cCentre, B11_CR / (B11_CR + B11_BR));
const B11cOnLine = pt(B11cCentre.x, B11_LINE_Y);

const BLEND_ARCS: DrawTopic = {
  id: 'blend-arcs',
  title: 'Straight lines joined to curves by an arc',
  subtitle: 'Turn a sharp corner into a smooth radius that flows into both lines.',
  goal: 'Blend two straight lines, and a line into a circle, with an arc of given radius that touches without a corner.',
  minutes: 35,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'Compass', 'HB pencil'],
  base: preparedSheet('BLENDING WITH ARCS', '11'),
  steps: [
    {
      id: 'what-is-a-blend',
      title: 'A corner that flows',
      tool: 'hand',
      focus: { at: pt(210, 150), r: 200 },
      tip: 'Where the arc meets the line is the tangent point. Mark it — it is often worth a mark on its own.',
      lines: [
        { text: 'Real parts do not have sharp corners. They have rounded ones.' },
        { text: 'A rounded corner is stronger, and it is safer to handle.' },
        { text: 'On a drawing we call it a blend, or a fillet, or just a radius.' },
        { text: 'The arc must flow into the straight line with no kink at all.' },
        { text: 'The place where they meet is called the tangent point.' },
        { text: 'Get the tangent points right and the drawing looks professional. Get them wrong and it looks broken.' },
      ],
      marks: [],
    },
    {
      id: 'right-angle-lines',
      title: 'The two lines to be joined',
      tool: 'set45',
      teeY: B11Corner.y,
      focus: { at: pt(140, 185), r: 110 },
      tip: 'Draw the lines longer than you need. You trim back to the tangent points at the end.',
      lines: [
        { text: 'Start with the easiest case. Two lines meeting at a right angle.' },
        { text: 'Draw them a little longer than you need.', at: B11Corner, label: 'the corner' },
        { text: 'The extra will be rubbed out at the end, once we know where the arc lands.' },
        { text: 'The question says join these with a radius of forty.' },
      ],
      markLines: [1, 1],
      marks: [
        { kind: 'line', style: 'outline', a: pt(B11Corner.x, B11Corner.y - 100), b: B11Corner },
        { kind: 'line', style: 'outline', a: B11Corner, b: pt(B11Corner.x + 120, B11Corner.y) },
      ],
    },
    {
      id: 'right-angle-blend',
      title: 'Find the centre 40 from both lines',
      tool: 'compass',
      compassRadius: 40,
      focus: { at: pt(135, 185), r: 105 },
      tip: 'The centre of a blend arc is always R away from each line it touches.',
      lines: [
        { text: 'Here is the rule for every blend on this sheet.' },
        { text: 'The centre of the arc must be forty away from the first line, and forty away from the second.' },
        { text: 'So draw a light line forty from the upright one, running parallel to it.', at: pt(B11.centre.x, 175), label: '40 away' },
        { text: 'And another forty from the horizontal one.', at: pt(130, B11.centre.y) },
        { text: 'Where those two light lines cross is the centre.', at: B11.centre, label: 'centre' },
        { text: 'Now drop back to each line at ninety degrees. Those are your tangent points.', at: B11.from, label: 'tangent point' },
        { text: 'Needle on the centre, and swing from one tangent point to the other.' },
        { text: 'Then rub out the corner. The arc is the corner now.' },
      ],
      markLines: [2, 3, 4, 5, 5, 6, 7],
      marks: [
        { kind: 'line', style: 'construction', a: pt(B11.centre.x, B11Corner.y - 100), b: pt(B11.centre.x, B11Corner.y + 12) },
        { kind: 'line', style: 'construction', a: pt(B11Corner.x - 12, B11.centre.y), b: pt(B11Corner.x + 120, B11.centre.y) },
        { kind: 'dot', at: B11.centre, label: 'O', labelAngle: 45 },
        { kind: 'dot', at: B11.from },
        { kind: 'dot', at: B11.to },
        { kind: 'arc', style: 'outline', c: B11.centre, r: B11.radius, from: B11.fromAngle, to: B11.toAngle },
        { kind: 'dim', a: B11.centre, b: B11.to, offset: 0, label: 'R40' },
      ],
    },
    {
      id: 'acute-blend',
      title: 'The same rule on a sharp corner',
      tool: 'compass',
      compassRadius: 30,
      focus: { at: pt(330, 190), r: 110 },
      tip: 'Parallel to each line at distance R — that works whatever the angle between them is.',
      lines: [
        { text: 'Now a corner that is not a right angle. Sixty degrees this time.' },
        { text: 'Do not panic. The rule has not changed at all.' },
        { text: 'Draw a light line thirty away from each arm, parallel to it.', at: pt(340, 200), label: 'parallel, 30 away' },
        { text: 'Where they cross is the centre.', at: B11b.centre, label: 'centre' },
        { text: 'Perpendicular back to each arm gives the tangent points.', at: B11b.from, label: 'tangent point' },
        { text: 'And swing the arc between them.' },
        { text: 'Notice the tangent points are not the same distance from the corner as before.' },
        { text: 'That is normal. Never guess them. Always construct them.' },
      ],
      markLines: [0, 0, 2, 2, 3, 5, 5],
      marks: [
        { kind: 'line', style: 'outline', a: B11Vertex, b: polar(B11Vertex, 95, 0) },
        { kind: 'line', style: 'outline', a: B11Vertex, b: polar(B11Vertex, 95, 60) },
        { kind: 'line', style: 'construction', a: pt(B11Vertex.x - 5, B11b.centre.y), b: pt(B11Vertex.x + 95, B11b.centre.y) },
        {
          kind: 'line',
          style: 'construction',
          a: polar(polar(B11Vertex, -8, 60), 30, -30),
          b: polar(polar(B11Vertex, 95, 60), 30, -30),
        },
        { kind: 'dot', at: B11b.centre, label: 'O', labelAngle: 60 },
        { kind: 'arc', style: 'outline', c: B11b.centre, r: B11b.radius, from: B11b.fromAngle, to: B11b.toAngle },
        { kind: 'dim', a: B11b.centre, b: B11b.to, offset: 0, label: 'R30' },
      ],
    },
    {
      id: 'line-to-circle',
      title: 'Joining a straight line to a curve',
      tool: 'compass',
      compassRadius: B11_BR,
      focus: { at: pt(220, 115), r: 120 },
      tip: 'Touching outside: centre distance = r + R. Wrapping around inside: centre distance = R − r.',
      lines: [
        { text: 'Last case, and this is the one the exam likes.' },
        { text: 'A straight line, a circle, and an arc joining them.' },
        { text: 'The line part has not changed. The centre must be forty from the line.', at: pt(250, 118), label: '40 from the line' },
        { text: 'Now the circle. The circle has a radius of thirty-two.' },
        { text: 'Our blend is forty. So the centre must be thirty-two plus forty from the circle centre.' },
        { text: 'That is seventy-two. Add them together.', at: mid(B11CircleO, B11cCentre), label: '32 + 40 = 72' },
        { text: 'So swing an arc of seventy-two from the circle centre, and see where it meets the parallel line.', at: B11cCentre, label: 'centre' },
        { text: 'And here is the last piece. The tangent point on the circle is on the line joining the two centres.', at: B11cOnCircle, label: 'tangent point' },
        { text: 'That is always true when two curves touch. Join the centres, and you cross at the touching point.' },
      ],
      markLines: [1, 1, 1, 2, 6, 6, 7, 7, 8, 8],
      marks: [
        { kind: 'circle', style: 'outline', c: B11CircleO, r: B11_CR },
        { kind: 'dot', at: B11CircleO, label: 'C', labelAngle: 200 },
        { kind: 'line', style: 'outline', a: pt(120, B11_LINE_Y), b: pt(300, B11_LINE_Y) },
        { kind: 'line', style: 'construction', a: pt(120, B11cCentre.y), b: pt(300, B11cCentre.y) },
        { kind: 'arc', style: 'construction', c: B11CircleO, r: B11_CR + B11_BR, from: bearing(B11CircleO, B11cCentre) - 22, to: bearing(B11CircleO, B11cCentre) + 22 },
        { kind: 'dot', at: B11cCentre, label: 'O', labelAngle: 30 },
        { kind: 'line', style: 'construction', a: B11CircleO, b: B11cCentre },
        { kind: 'dot', at: B11cOnCircle },
        { kind: 'arc', style: 'outline', c: B11cCentre, r: B11_BR, from: bearing(B11cCentre, B11cOnCircle), to: shortWayTo(bearing(B11cCentre, B11cOnCircle), bearing(B11cCentre, B11cOnLine)) },
        { kind: 'dim', a: B11cCentre, b: B11cOnLine, offset: 0, label: 'R40' },
      ],
    },
  ],
};

/* ========================================================================= 12
 * An ellipse and scales
 * ======================================================================== */

const E12 = pt(150, 135);
const E12_MAJOR = 80;
const E12_MINOR = 50;
const E12Angles = Array.from({ length: 12 }, (_, index) => index * 30);
const E12Curve = ellipsePoints(E12, E12_MAJOR, E12_MINOR, 72);

/** Plain scale, 1:50, reading up to 5 m in metres and decimetres. */
const SC_LEFT = 120;
const SC_TOP = 232;
const SC_H = 10;
const SC_MAIN = 20;
const SC_ZERO = SC_LEFT + SC_MAIN;

const ELLIPSE_AND_SCALES: DrawTopic = {
  id: 'ellipse-and-scales',
  title: 'An ellipse and scales',
  subtitle: 'Build an ellipse from two circles, then draw a plain scale you can measure with.',
  goal: 'Construct an ellipse by the concentric circle method, and draw a plain scale that reads real distances off a drawing.',
  minutes: 40,
  level: 'Exam',
  tools: ['T-square', '30/60 set square', 'Compass', 'French curve'],
  base: preparedSheet('ELLIPSE AND SCALES', '12'),
  steps: [
    {
      id: 'what-is-an-ellipse',
      title: 'A circle seen from an angle',
      tool: 'hand',
      focus: { at: pt(160, 145), r: 200 },
      tip: 'Major axis = the long way across. Minor axis = the short way. They cross at 90°.',
      lines: [
        { text: 'An ellipse is a squashed circle.' },
        { text: 'You see one every day. Look at a cup from an angle. The round top looks like an ellipse.' },
        { text: 'Any circle drawn on a sloping face becomes an ellipse on your paper.' },
        { text: 'It has two axes. The long way across is the major axis.', at: pt(E12.x, E12.y), label: 'major' },
        { text: 'The short way is the minor axis.' },
        { text: 'They cross in the middle, at ninety degrees.' },
        { text: 'Ours is one hundred and sixty long, and one hundred wide.' },
      ],
      markLines: [3, 4, 6, 6],
      marks: [
        { kind: 'line', style: 'centre', a: pt(E12.x - E12_MAJOR - 12, E12.y), b: pt(E12.x + E12_MAJOR + 12, E12.y) },
        { kind: 'line', style: 'centre', a: pt(E12.x, E12.y - E12_MINOR - 12), b: pt(E12.x, E12.y + E12_MINOR + 12) },
        { kind: 'dim', a: pt(E12.x - E12_MAJOR, E12.y), b: pt(E12.x + E12_MAJOR, E12.y), offset: -68, label: '160' },
        { kind: 'dim', a: pt(E12.x, E12.y + E12_MINOR), b: pt(E12.x, E12.y - E12_MINOR), offset: 100, label: '100' },
      ],
    },
    {
      id: 'two-circles',
      title: 'Draw the two circles',
      tool: 'compass',
      compassRadius: E12_MAJOR,
      focus: { at: E12, r: 120 },
      tip: 'The big circle is the major axis. The small circle is the minor axis. Same centre.',
      lines: [
        { text: 'Now draw two circles, both on the same centre.' },
        { text: 'The big one has the major axis as its diameter. So the radius is eighty.' },
        { text: 'The small one has the minor axis as its diameter. Radius fifty.' },
        { text: 'Remember, the question gives you the full width, and the compass wants half of it.' },
        { text: 'These two circles do all the work for us.' },
      ],
      markLines: [1, 2],
      marks: [
        { kind: 'circle', style: 'construction', c: E12, r: E12_MAJOR },
        { kind: 'circle', style: 'construction', c: E12, r: E12_MINOR },
      ],
    },
    {
      id: 'radial-lines',
      title: 'Draw radial lines every 30°',
      tool: 'set30',
      teeY: E12.y,
      focus: { at: E12, r: 115 },
      tip: 'More lines give a smoother ellipse. Twelve is the usual minimum.',
      lines: [
        { text: 'Now draw lines out from the centre, straight through both circles.' },
        { text: 'Every thirty degrees. Your thirty sixty set square gives you all of them.' },
        { text: 'Twelve lines in total.' },
        { text: 'If you want a smoother curve, draw more. Every fifteen degrees is better.' },
        { text: 'Each line cuts the big circle in one place, and the small circle in another.', at: polar(E12, E12_MAJOR, 30), label: 'two crossings' },
      ],
      // Half of them go down while he names the angle, the rest while he counts
      // them, so the sheet fills as he speaks instead of afterwards.
      markLines: E12Angles.map((_, index) => (index < E12Angles.length / 2 ? 1 : 2)),
      marks: E12Angles.map<Mark>((angle) => ({
        kind: 'line',
        style: 'construction',
        a: polar(E12, -E12_MAJOR, angle),
        b: polar(E12, E12_MAJOR, angle),
      })),
    },
    {
      id: 'plot-points',
      title: 'Across from one circle, down from the other',
      tool: 'set45',
      teeY: E12.y,
      focus: { at: E12, r: 115 },
      tip: 'Vertical from the BIG circle, horizontal from the SMALL circle. Swap them and you get the wrong shape.',
      lines: [
        { text: 'Here is the clever part. Take one radial line at a time.' },
        { text: 'From where it cuts the big circle, drop a line straight down.', at: polar(E12, E12_MAJOR, 30), label: 'straight down' },
        { text: 'From where it cuts the small circle, draw a line straight across.', at: polar(E12, E12_MINOR, 30), label: 'straight across' },
        { text: 'Where those two meet is a point on the ellipse.', at: pt(E12.x + E12_MAJOR * Math.cos(Math.PI / 6), E12.y - E12_MINOR * Math.sin(Math.PI / 6)), label: 'on the ellipse' },
        { text: 'Down from the big one. Across from the small one. Do not mix them up.' },
        { text: 'Now do that for all twelve lines.' },
        { text: 'Twelve points appear, and you can already see the shape.' },
      ],
      /**
       * The first point is walked through a line at a time — down, across,
       * cross — because that is the method. The other eleven are laid down
       * while he says "do that for all twelve lines", and the last one lands on
       * the sentence that says the shape has appeared.
       */
      markLines: E12Angles.flatMap((_, index) => {
        if (index === 0) return [1, 2, 3];
        return index === E12Angles.length - 1 ? [6, 6, 6] : [5, 5, 5];
      }),
      marks: E12Angles.flatMap<Mark>((angle) => {
        const onMajor = polar(E12, E12_MAJOR, angle);
        const onMinor = polar(E12, E12_MINOR, angle);
        const point = pt(onMajor.x, onMinor.y);
        return [
          { kind: 'line', style: 'construction', a: onMajor, b: point },
          { kind: 'line', style: 'construction', a: onMinor, b: point },
          { kind: 'dot', at: point },
        ];
      }),
    },
    {
      id: 'join-curve',
      title: 'Join the points with a French curve',
      tool: 'pencil',
      focus: { at: E12, r: 115 },
      tip: 'Never draw an ellipse with a compass. An ellipse has no single centre.',
      lines: [
        { text: 'Now join the points into a smooth curve.' },
        { text: 'Do not use a compass. An ellipse is not made of arcs, and it has no one centre.' },
        { text: 'Use a French curve. Line it up on three or four points at a time.' },
        { text: 'Draw a little, slide along, and match it to the next points.' },
        { text: 'Always overlap what you have drawn, or you will leave a kink.' },
        { text: 'Take your time here. This is the part the examiner looks at.' },
      ],
      marks: [{ kind: 'poly', style: 'outline', close: true, points: E12Curve }],
    },
    {
      id: 'plain-scale',
      title: 'Now a plain scale',
      tool: 'set45',
      teeY: SC_TOP,
      focus: { at: pt(170, 235), r: 115 },
      tip: 'A scale is a ruler drawn for one particular drawing. It stops you doing arithmetic on every dimension.',
      lines: [
        { text: 'Second half of the lesson. Scales.' },
        { text: 'A drawing at one to fifty means everything is fifty times smaller than real life.' },
        { text: 'You could divide every measurement by fifty. That is slow and you will make mistakes.' },
        { text: 'So instead we draw a ruler for this one drawing. That is a plain scale.' },
        { text: 'We want to read up to five metres.' },
        { text: 'Five metres divided by fifty is one hundred millimetres. So the scale is one hundred long.', at: pt(170, SC_TOP - 6), label: '100 mm long' },
        { text: 'Draw a thin box, one hundred by ten.' },
        { text: 'Then divide it into five equal parts. Each part is one whole metre.', at: pt(SC_ZERO + SC_MAIN, SC_TOP + 5) },
      ],
      markLines: [6, 7, 7, 7, 7],
      marks: [
        {
          kind: 'poly',
          style: 'outline',
          close: true,
          points: [
            pt(SC_LEFT, SC_TOP),
            pt(SC_LEFT + 100, SC_TOP),
            pt(SC_LEFT + 100, SC_TOP + SC_H),
            pt(SC_LEFT, SC_TOP + SC_H),
          ],
        },
        ...[1, 2, 3, 4].map<Mark>((index) => ({
          kind: 'line',
          style: 'thin',
          a: pt(SC_LEFT + index * SC_MAIN, SC_TOP),
          b: pt(SC_LEFT + index * SC_MAIN, SC_TOP + SC_H),
        })),
      ],
    },
    {
      id: 'subdivide-scale',
      title: 'Subdivide the first division',
      tool: 'pencil',
      teeY: SC_TOP,
      focus: { at: pt(160, 238), r: 95 },
      tip: 'Zero never sits at the left end. It sits between the subdivided part and the whole units.',
      lines: [
        { text: 'Now the part everybody gets wrong. Where do we write zero?' },
        { text: 'Not at the left end. Zero goes at the start of the second division.', at: pt(SC_ZERO, SC_TOP + 16), label: 'zero here' },
        { text: 'Everything to the right of zero counts whole metres. One, two, three, four.' },
        { text: 'And that first division, on the left of zero, gets cut into ten small parts.', at: pt(SC_LEFT + 10, SC_TOP + 5), label: 'ten parts' },
        { text: 'Each small part is one tenth of a metre. That is a decimetre.' },
        { text: 'So to measure three point four metres, you put one leg on the three,' },
        { text: 'and the other leg four small parts to the left of zero.' },
        { text: 'Whole units to the right, tenths to the left. Write that down.' },
        { text: 'Always letter what the scale reads, and always write the ratio underneath.' },
      ],
      // The whole-metre figures are cued on the words that count them, so "one,
      // two, three, four" writes 1, 2, 3, 4 as he says them.
      markLines: [3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 2, 2, 2, 2, 3, 4, 7, 8],
      markWords: [
        ...Array.from({ length: 9 }, () => undefined),
        undefined,
        'one',
        'two',
        'three',
        'four',
      ],
      marks: [
        ...Array.from({ length: 9 }, (_, index) => index + 1).map<Mark>((index) => ({
          kind: 'line',
          style: 'thin',
          a: pt(SC_LEFT + index * 2, SC_TOP + SC_H / 2),
          b: pt(SC_LEFT + index * 2, SC_TOP + SC_H),
        })),
        ...[0, 1, 2, 3, 4].map<Mark>((index) => ({
          kind: 'text',
          at: pt(SC_ZERO + index * SC_MAIN, SC_TOP + 16),
          text: `${index}`,
          size: 3.2,
          align: 'center',
          bold: true,
        })),
        { kind: 'text', at: pt(SC_LEFT, SC_TOP + 16), text: '10', size: 3.2, align: 'center', bold: true },
        { kind: 'text', at: pt(SC_LEFT + 10, SC_TOP - 3), text: 'DECIMETRES', size: 2.6, align: 'center', colour: '#64748b' },
        { kind: 'text', at: pt(SC_ZERO + 40, SC_TOP - 3), text: 'METRES', size: 2.6, align: 'center', colour: '#64748b' },
        { kind: 'text', at: pt(SC_LEFT + 50, SC_TOP + 24), text: 'PLAIN SCALE 1:50', size: 3.8, align: 'center', bold: true },
      ],
    },
  ],
};

export const CONSTRUCTION_TOPICS: DrawTopic[] = [
  BISECT_LINE,
  PERPENDICULAR_ON_LINE,
  DIVIDE_LINE,
  PERPENDICULAR_FROM_POINT,
  PARALLEL_LINES,
  BISECT_ANGLE,
  ANGLES_WITHOUT_PROTRACTOR,
  COPIED_ANGLE,
  ARC_CENTRE,
  GEOMETRIC_SHAPES,
  BLEND_ARCS,
  ELLIPSE_AND_SCALES,
];
