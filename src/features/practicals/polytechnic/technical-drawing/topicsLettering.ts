/**
 * The language of the drawing: line types, and the lettering that goes with
 * them.
 *
 * Before a student draws anything worth marking they have to know that a drawn
 * line is not just a line — its thickness and its pattern say what it is. And
 * they have to letter, because a beautifully drawn view with scruffy figures
 * loses marks in every technical drawing paper there is.
 *
 * The specimen lines below are drawn with the same styles the rest of the board
 * uses, so what the student sees named here is exactly what they will meet on
 * every other sheet.
 */

import { pt, type Mark, type Pt } from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/* ========================================================================= 29
 * Types of line
 * ======================================================================= */

const ROW_X = 60;
const ROW_LEN = 90;
const NAME_X = ROW_X + ROW_LEN + 12;
const FIRST_ROW = 50;
const ROW_GAP = 21;

const rowY = (index: number) => FIRST_ROW + index * ROW_GAP;

/** A specimen line, its name, and what it is used for. */
function lineRow(index: number, name: string, use: string, specimen: Mark[]): Mark[] {
  return [
    ...specimen,
    { kind: 'text', at: pt(NAME_X, rowY(index) - 2), text: name, size: 3.4, align: 'left', bold: true },
    { kind: 'text', at: pt(NAME_X, rowY(index) + 5), text: use, size: 2.8, align: 'left' },
  ];
}

const specimen = (index: number, style: Mark['style']): Mark[] => [
  { kind: 'line', style, a: pt(ROW_X, rowY(index)), b: pt(ROW_X + ROW_LEN, rowY(index)) },
];

const LINE_TYPES: DrawTopic = {
  id: 'line-types',
  title: 'Types of line',
  subtitle: 'Every line on a drawing says something. Learn what each one says.',
  goal: 'Draw and name each type of line used in technical drawing, and state what each one is used for.',
  minutes: 25,
  level: 'Start here',
  tools: ['T-square', 'HB pencil', '2H pencil'],
  base: preparedSheet('TYPES OF LINE', '29'),
  steps: [
    {
      id: 'lines-speak',
      title: 'A line is a word',
      tool: 'hand',
      focus: { at: pt(180, 130), r: 220 },
      tip: 'Thick means you can see it. Thin means it is information about it.',
      lines: [
        { text: 'On a drawing, a line is not just a line. It is a word.' },
        { text: 'Its thickness and its pattern tell the reader what it is.' },
        { text: 'Thick means: this is a real edge, you can see it.' },
        { text: 'Thin means: this is information about the part, not the part itself.' },
        { text: 'Learn these nine and you can read any drawing put in front of you.' },
      ],
      marks: [],
    },
    {
      id: 'lines-continuous',
      title: 'Continuous lines',
      tool: 'tsquare',
      teeY: rowY(0),
      focus: { at: pt(150, rowY(1)), r: 90 },
      tip: 'Two thicknesses only: thick for what you can see, thin for everything else.',
      lines: [
        { text: 'First the two continuous lines. No dashes at all.' },
        { text: 'Continuous thick. Visible outlines and visible edges.', at: pt(ROW_X + 40, rowY(0)) },
        { text: 'That is the line the part is drawn with. Press firmly with the HB.' },
        { text: 'Continuous thin. Dimension lines, projection lines, hatching, leaders.', at: pt(ROW_X + 40, rowY(1)) },
        { text: 'Same pencil, lighter hand. Or use a 2H if yours is heavy.' },
      ],
      marks: [
        ...lineRow(0, 'CONTINUOUS THICK', 'Visible outlines and edges', specimen(0, 'outline')),
        ...lineRow(1, 'CONTINUOUS THIN', 'Dimensions, projection, hatching, leaders', specimen(1, 'thin')),
      ],
    },
    {
      id: 'lines-hidden-centre',
      title: 'Hidden and centre lines',
      tool: 'pencil',
      focus: { at: pt(150, rowY(3)), r: 90 },
      tip: 'A hidden line is short dashes. A centre line is long, short, long.',
      lines: [
        { text: 'Dashed thin. Hidden edges — the ones inside the part.', at: pt(ROW_X + 40, rowY(2)) },
        { text: 'Short dashes, all the same length, with small even gaps.' },
        { text: 'Chain thin. Centre lines and lines of symmetry.', at: pt(ROW_X + 40, rowY(3)) },
        { text: 'Long, short, long, short. And it must start and finish on a long dash.' },
        { text: 'Where two centre lines cross, they cross on their long dashes. Never on a gap.' },
      ],
      marks: [
        ...lineRow(2, 'DASHED THIN', 'Hidden outlines and hidden edges', specimen(2, 'hidden')),
        ...lineRow(3, 'CHAIN THIN', 'Centre lines and lines of symmetry', specimen(3, 'centre')),
      ],
    },
    {
      id: 'lines-breaks',
      title: 'The two break lines',
      tool: 'pencil',
      focus: { at: pt(150, rowY(5)), r: 90 },
      tip: 'Short break: freehand wavy line. Long break: a straight line with a zigzag in it.',
      lines: [
        { text: 'Two ways to say I have taken a piece out.' },
        { text: 'Continuous thin freehand — the short break.', at: pt(ROW_X + 40, rowY(4)) },
        { text: 'Drawn freehand, on purpose. It is meant to look hand drawn.' },
        { text: 'Continuous thin with zigzags — the long break.', at: pt(ROW_X + 40, rowY(5)) },
        { text: 'Ruled, with one z in it. Used when you break a long bar right out.' },
      ],
      marks: [
        ...lineRow(
          4,
          'THIN FREEHAND',
          'Short break — limit of a partial view',
          [
            {
              kind: 'poly',
              style: 'thin',
              points: Array.from({ length: 41 }, (_, index): Pt => {
                const t = index / 40;
                return pt(ROW_X + t * ROW_LEN, rowY(4) + Math.sin(t * Math.PI * 6) * 1.6);
              }),
            },
          ]
        ),
        ...lineRow(5, 'THIN WITH ZIGZAG', 'Long break — long parts drawn short', [
          {
            kind: 'poly',
            style: 'thin',
            points: [
              pt(ROW_X, rowY(5)),
              pt(ROW_X + 38, rowY(5)),
              pt(ROW_X + 44, rowY(5) - 4),
              pt(ROW_X + 50, rowY(5) + 4),
              pt(ROW_X + 56, rowY(5)),
              pt(ROW_X + ROW_LEN, rowY(5)),
            ],
          },
        ]),
      ],
    },
    {
      id: 'lines-cutting',
      title: 'Cutting planes and neighbours',
      tool: 'pencil',
      focus: { at: pt(150, rowY(7)), r: 95 },
      tip: 'The cutting plane is a chain line made thick at its ends and at every change of direction.',
      lines: [
        { text: 'Chain thin, thick at the ends. That is the cutting plane.', at: pt(ROW_X + 40, rowY(6)) },
        { text: 'It shows where you have sawn the part in half, with arrows for the way you look.' },
        { text: 'Chain thick. Surfaces that get a special treatment — hardening, plating.', at: pt(ROW_X + 40, rowY(7)) },
        { text: 'And chain thin double dashed, for a part next door that is not this drawing.', at: pt(ROW_X + 40, rowY(8)) },
        { text: 'Nine line types. That is the whole vocabulary.' },
      ],
      marks: [
        ...lineRow(6, 'CHAIN, THICK ENDS', 'Cutting planes', [
          { kind: 'line', style: 'outline', a: pt(ROW_X, rowY(6)), b: pt(ROW_X + 14, rowY(6)) },
          { kind: 'line', style: 'centre', a: pt(ROW_X + 14, rowY(6)), b: pt(ROW_X + ROW_LEN - 14, rowY(6)) },
          { kind: 'line', style: 'outline', a: pt(ROW_X + ROW_LEN - 14, rowY(6)), b: pt(ROW_X + ROW_LEN, rowY(6)) },
          { kind: 'text', at: pt(ROW_X - 4, rowY(6)), text: 'A', size: 3.2, align: 'right', baseline: 'middle', bold: true },
          { kind: 'text', at: pt(ROW_X + ROW_LEN + 4, rowY(6)), text: 'A', size: 3.2, align: 'left', baseline: 'middle', bold: true },
        ]),
        ...lineRow(7, 'CHAIN THICK', 'Surfaces needing special treatment', [
          { kind: 'line', style: 'outline', a: pt(ROW_X, rowY(7)), b: pt(ROW_X + 22, rowY(7)) },
          { kind: 'line', style: 'outline', a: pt(ROW_X + 28, rowY(7)), b: pt(ROW_X + 31, rowY(7)) },
          { kind: 'line', style: 'outline', a: pt(ROW_X + 37, rowY(7)), b: pt(ROW_X + 59, rowY(7)) },
          { kind: 'line', style: 'outline', a: pt(ROW_X + 65, rowY(7)), b: pt(ROW_X + 68, rowY(7)) },
          { kind: 'line', style: 'outline', a: pt(ROW_X + 74, rowY(7)), b: pt(ROW_X + ROW_LEN, rowY(7)) },
        ]),
        ...lineRow(8, 'CHAIN, DOUBLE DASH', 'Outline of an adjacent part', [
          { kind: 'line', style: 'thin', a: pt(ROW_X, rowY(8)), b: pt(ROW_X + 20, rowY(8)) },
          { kind: 'line', style: 'thin', a: pt(ROW_X + 25, rowY(8)), b: pt(ROW_X + 28, rowY(8)) },
          { kind: 'line', style: 'thin', a: pt(ROW_X + 33, rowY(8)), b: pt(ROW_X + 36, rowY(8)) },
          { kind: 'line', style: 'thin', a: pt(ROW_X + 41, rowY(8)), b: pt(ROW_X + 61, rowY(8)) },
          { kind: 'line', style: 'thin', a: pt(ROW_X + 66, rowY(8)), b: pt(ROW_X + 69, rowY(8)) },
          { kind: 'line', style: 'thin', a: pt(ROW_X + 74, rowY(8)), b: pt(ROW_X + 77, rowY(8)) },
          { kind: 'line', style: 'thin', a: pt(ROW_X + 82, rowY(8)), b: pt(ROW_X + ROW_LEN, rowY(8)) },
        ]),
      ],
    },
  ],
};

/* ========================================================================= 30
 * Freehand letters and numerals
 * ======================================================================= */

const LETTER_LEFT = 55;
const LETTER_SIZE = 7;
const LETTER_PITCH = 12;
const LINE_ONE = 70;
const LINE_TWO = 100;
const LINE_THREE = 130;

/** Guide lines are ruled first and everything is lettered between them. */
function guideLines(y: number, width: number): Mark[] {
  return [
    { kind: 'line', style: 'construction', a: pt(LETTER_LEFT - 4, y - LETTER_SIZE), b: pt(LETTER_LEFT + width, y - LETTER_SIZE) },
    { kind: 'line', style: 'construction', a: pt(LETTER_LEFT - 4, y), b: pt(LETTER_LEFT + width, y) },
  ];
}

function lettersOn(y: number, characters: string): Mark[] {
  return characters.split('').map((character, index): Mark => ({
    kind: 'text',
    at: pt(LETTER_LEFT + index * LETTER_PITCH, y),
    text: character,
    size: LETTER_SIZE,
    align: 'left',
    baseline: 'alphabetic',
  }));
}

const FREEHAND_LETTERING: DrawTopic = {
  id: 'freehand-lettering',
  title: 'Freehand letters and numerals',
  subtitle: 'Single stroke capitals, between guide lines, every time.',
  goal: 'Letter freehand in single-stroke capitals of an even height, form the numerals correctly, and letter between ruled guide lines.',
  minutes: 30,
  level: 'Start here',
  tools: ['HB pencil', '2H pencil', 'T-square'],
  base: preparedSheet('FREEHAND LETTERING', '30'),
  steps: [
    {
      id: 'lettering-why',
      title: 'Why lettering carries marks',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 220 },
      tip: 'Single stroke means each part of a letter is one movement of the pencil — no going over it twice.',
      lines: [
        { text: 'A drawing with poor lettering loses marks. Every paper, every year.' },
        { text: 'The rule is single stroke capitals.' },
        { text: 'Single stroke means each part of a letter is one movement.' },
        { text: 'You do not go over a letter twice to thicken it up.' },
        { text: 'Capitals, because a capital cannot be misread. Is that a one or a small L?' },
      ],
      marks: [],
    },
    {
      id: 'lettering-guides',
      title: 'Rule your guide lines',
      tool: 'tsquare',
      teeY: LINE_ONE - LETTER_SIZE,
      focus: { at: pt(180, LINE_ONE), r: 130 },
      tip: 'Nobody letters straight freehand. Two faint guide lines, always.',
      lines: [
        { text: 'Nobody letters in a straight line without help. Nobody.' },
        { text: 'Two guide lines with the T-square, seven millimetres apart.', at: pt(150, LINE_ONE - 4) },
        { text: 'Very light — 2H, so light you can hardly see them.' },
        { text: 'Every letter touches the bottom line and reaches the top line.' },
        { text: 'That one habit fixes ninety per cent of bad lettering.' },
      ],
      marks: guideLines(LINE_ONE, 300),
    },
    {
      id: 'lettering-straight',
      title: 'The straight letters',
      tool: 'pencil',
      focus: { at: pt(180, LINE_ONE), r: 130 },
      tip: 'Start with the letters made only of straight strokes — they set your height and slope.',
      lines: [
        { text: 'Start with the letters that are all straight lines.' },
        { text: 'A, E, F, H, I, K, L, M, N, T, V, W, X, Y, Z.' },
        { text: 'Verticals go down. Horizontals go left to right. Always the same way.' },
        { text: 'Keep them upright. We are doing vertical lettering, not sloping.' },
        { text: 'Even width, even spacing. It should look like a row of fence posts.' },
      ],
      marks: lettersOn(LINE_ONE, 'AEFHIKLMNTVWXYZ'),
    },
    {
      id: 'lettering-curved',
      title: 'The curved letters',
      tool: 'pencil',
      focus: { at: pt(180, LINE_TWO), r: 130 },
      tip: 'Curved letters are drawn slightly wider than straight ones so they look the same size.',
      lines: [
        { text: 'New guide lines, and now the curved ones.' },
        { text: 'B, C, D, G, J, O, P, Q, R, S, U.' },
        { text: 'A round letter is drawn a fraction wider than a straight one.' },
        { text: 'That is not a mistake. A circle next to a square looks smaller than it is.' },
        { text: 'Two strokes for an O — down one side, down the other. Not one whip round.' },
      ],
      marks: [...guideLines(LINE_TWO, 300), ...lettersOn(LINE_TWO, 'BCDGJOPQRSU')],
    },
    {
      id: 'lettering-numerals',
      title: 'The numerals',
      tool: 'pencil',
      focus: { at: pt(180, LINE_THREE), r: 130 },
      tip: 'A figure that can be misread is worse than no figure at all — the workshop will make it wrong.',
      lines: [
        { text: 'Now nought to nine. These matter more than the letters.' },
        { text: 'A letter that is unclear is annoying. A figure that is unclear is scrap metal.' },
        { text: 'Close your sixes and your nines properly.' },
        { text: 'Keep the one plain, with no foot and no flag on it.' },
        { text: 'And never let a seven and a one look alike on the same drawing.' },
      ],
      marks: [...guideLines(LINE_THREE, 130), ...lettersOn(LINE_THREE, '0123456789')],
    },
  ],
};

/* ========================================================================= 31
 * Title block lettering
 * ======================================================================= */

const BLOCK_LEFT = 60;
const BLOCK_TOP = 90;
const BLOCK_W = 260;
const BLOCK_H = 70;

const TITLE_LETTERING: DrawTopic = {
  id: 'title-block-lettering',
  title: 'Bold lettering for title blocks',
  subtitle: 'The one place on the sheet where letters are drawn big and bold.',
  goal: 'Letter a title block in the correct heights, put the right information in the right box, and letter the drawing number boldly enough to read across a workshop.',
  minutes: 25,
  level: 'Basic',
  tools: ['T-square', 'HB pencil', '2H pencil'],
  base: preparedSheet('TITLE BLOCK LETTERING', '31'),
  steps: [
    {
      id: 'title-why',
      title: 'The block is read first',
      tool: 'hand',
      focus: { at: pt(190, 130), r: 220 },
      tip: 'Title, drawing number, scale, projection, date and name — every title block carries these six.',
      lines: [
        { text: 'The title block is the first thing anybody reads on a drawing.' },
        { text: 'It tells them what the part is, which drawing this is, and what scale it is at.' },
        { text: 'Six things go in it. Title. Drawing number. Scale. Projection. Date. Name.' },
        { text: 'And it is lettered bolder than everything else, so it can be read from across the shop.' },
      ],
      marks: [],
    },
    {
      id: 'title-rule',
      title: 'Rule the block',
      tool: 'tsquare',
      teeY: BLOCK_TOP,
      focus: { at: pt(BLOCK_LEFT + BLOCK_W / 2, BLOCK_TOP + BLOCK_H / 2), r: 150 },
      tip: 'The title block always sits in the bottom right corner, against the frame.',
      lines: [
        { text: 'Here it is drawn large so you can see the lettering.' },
        { text: 'On your sheet it goes in the bottom right corner, tight against the frame.' },
        { text: 'Rule it with the T-square. Thin continuous lines.' },
        { text: 'Three rows, three columns. Every box has a job.' },
      ],
      marks: [
        { kind: 'poly', style: 'thin', close: true, points: [
          pt(BLOCK_LEFT, BLOCK_TOP),
          pt(BLOCK_LEFT + BLOCK_W, BLOCK_TOP),
          pt(BLOCK_LEFT + BLOCK_W, BLOCK_TOP + BLOCK_H),
          pt(BLOCK_LEFT, BLOCK_TOP + BLOCK_H),
        ] },
        { kind: 'line', style: 'thin', a: pt(BLOCK_LEFT, BLOCK_TOP + BLOCK_H / 3), b: pt(BLOCK_LEFT + BLOCK_W, BLOCK_TOP + BLOCK_H / 3) },
        { kind: 'line', style: 'thin', a: pt(BLOCK_LEFT, BLOCK_TOP + (2 * BLOCK_H) / 3), b: pt(BLOCK_LEFT + BLOCK_W, BLOCK_TOP + (2 * BLOCK_H) / 3) },
        { kind: 'line', style: 'thin', a: pt(BLOCK_LEFT + 130, BLOCK_TOP), b: pt(BLOCK_LEFT + 130, BLOCK_TOP + BLOCK_H) },
        { kind: 'line', style: 'thin', a: pt(BLOCK_LEFT + 200, BLOCK_TOP), b: pt(BLOCK_LEFT + 200, BLOCK_TOP + BLOCK_H) },
      ],
    },
    {
      id: 'title-headings',
      title: 'Small headings first',
      tool: 'pencil',
      focus: { at: pt(BLOCK_LEFT + 60, BLOCK_TOP + 12), r: 90 },
      tip: 'Headings are lettered small — 2.5 mm — because they are labels, not information.',
      lines: [
        { text: 'Every box gets a small heading in the top left corner of it.' },
        { text: 'NAME. COURSE. TITLE. SCALE. DATE. DRAWING NUMBER.' },
        { text: 'Two and a half millimetres. They are labels, not the information.' },
        { text: 'Tuck them right up into the corner so the box is left free.' },
      ],
      marks: [
        { kind: 'text', at: pt(BLOCK_LEFT + 3, BLOCK_TOP + 6), text: 'NAME', size: 2.5, align: 'left' },
        { kind: 'text', at: pt(BLOCK_LEFT + 3, BLOCK_TOP + BLOCK_H / 3 + 6), text: 'COURSE', size: 2.5, align: 'left' },
        { kind: 'text', at: pt(BLOCK_LEFT + 3, BLOCK_TOP + (2 * BLOCK_H) / 3 + 6), text: 'TITLE', size: 2.5, align: 'left' },
        { kind: 'text', at: pt(BLOCK_LEFT + 133, BLOCK_TOP + 6), text: 'SCALE', size: 2.5, align: 'left' },
        { kind: 'text', at: pt(BLOCK_LEFT + 133, BLOCK_TOP + BLOCK_H / 3 + 6), text: 'DATE', size: 2.5, align: 'left' },
        { kind: 'text', at: pt(BLOCK_LEFT + 133, BLOCK_TOP + (2 * BLOCK_H) / 3 + 6), text: 'PROJECTION', size: 2.5, align: 'left' },
        { kind: 'text', at: pt(BLOCK_LEFT + 203, BLOCK_TOP + 6), text: 'DRG No.', size: 2.5, align: 'left' },
      ],
    },
    {
      id: 'title-bold',
      title: 'Then the bold information',
      tool: 'pencil',
      focus: { at: pt(BLOCK_LEFT + 90, BLOCK_TOP + 50), r: 110 },
      tip: 'Title 5 mm bold, drawing number 7 mm bold. Everything else 3.5 mm.',
      lines: [
        { text: 'Now the information itself, and this is where you press.' },
        { text: 'The title of the drawing, five millimetres, bold.', at: pt(BLOCK_LEFT + 60, BLOCK_TOP + 62) },
        { text: 'The drawing number, seven millimetres, bolder still.', at: pt(BLOCK_LEFT + 228, BLOCK_TOP + 24) },
        { text: 'That number is how the drawing is found again in two years time.' },
        { text: 'Everything else — name, course, date, scale — three point five.' },
      ],
      marks: [
        { kind: 'text', at: pt(BLOCK_LEFT + 3, BLOCK_TOP + 18), text: 'YOUR NAME', size: 3.5, align: 'left', bold: true },
        { kind: 'text', at: pt(BLOCK_LEFT + 3, BLOCK_TOP + BLOCK_H / 3 + 18), text: 'NC MECHANICAL', size: 3.5, align: 'left', bold: true },
        { kind: 'text', at: pt(BLOCK_LEFT + 3, BLOCK_TOP + (2 * BLOCK_H) / 3 + 19), text: 'BRACKET', size: 5, align: 'left', bold: true },
        { kind: 'text', at: pt(BLOCK_LEFT + 133, BLOCK_TOP + 18), text: '1:1', size: 3.5, align: 'left', bold: true },
        { kind: 'text', at: pt(BLOCK_LEFT + 133, BLOCK_TOP + BLOCK_H / 3 + 18), text: '2026', size: 3.5, align: 'left', bold: true },
        { kind: 'text', at: pt(BLOCK_LEFT + 203, BLOCK_TOP + 22), text: '31', size: 7, align: 'left', bold: true },
      ],
    },
    {
      id: 'title-faults',
      title: 'What loses the marks',
      tool: 'pencil',
      focus: { at: pt(190, 190), r: 170 },
      tip: 'Wandering height and uneven spacing cost more marks than a slightly wobbly letter.',
      lines: [
        { text: 'Three faults, and they are always the same three.' },
        { text: 'One: letters that wander in height because there were no guide lines.' },
        { text: 'Two: spacing that starts wide and ends cramped, because it was not set out.' },
        { text: 'Three: a title block filled in with a biro after the drawing was finished.' },
        { text: 'Letter it in pencil, like the rest of the drawing. It is part of the drawing.' },
      ],
      marks: [
        { kind: 'text', at: pt(BLOCK_LEFT, 195), text: 'GUIDE LINES · EVEN SPACING · PENCIL, NOT PEN', size: 3.2, align: 'left', bold: true },
      ],
    },
  ],
};

export const LETTERING_TOPICS: DrawTopic[] = [LINE_TYPES, FREEHAND_LETTERING, TITLE_LETTERING];
