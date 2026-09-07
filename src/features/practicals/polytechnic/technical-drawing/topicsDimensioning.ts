/**
 * Dimensioning to BS 308 — five lessons on one part.
 *
 * The same bracket is drawn in every one of these topics, and only the
 * dimensions change. That is deliberate: dimensioning is not about the shape,
 * it is about which sizes you choose to state and where you measure them from.
 * Put the same part in front of a student five times and the difference between
 * functional and non-functional, chain and datum, becomes impossible to miss.
 *
 * The rules applied here are the ones BS 308 (now carried into BS 8888) states:
 * projection lines leave a small gap at the outline, dimension lines are thin
 * and continuous with the figure above the line, a size is never repeated, and
 * a size that could be worked out from the others is either left off or put in
 * brackets as auxiliary.
 */

import { pt, type Mark, type Pt } from './drawingGeometry';
import { preparedSheet, type DrawTopic } from './drawingLessonTypes';

/* ------------------------------------------------------------- the bracket */

/**
 * A mounting bracket: a plate with a machined location face on the left, two
 * fixing holes and a bored hole that a shaft runs through. Everything below is
 * measured off this one shape.
 */
const PLATE = { left: 70, top: 70, length: 170, depth: 80 };
const STEP = { x: 70 + 40, y: 70 + 80 };
/** The top face of the step — the left-hand end of the part's bottom edge. */
const STEP_TOP = 70 + 80 - 24;
const BORE = { at: pt(70 + 120, 70 + 34), r: 16 };
// Both fixing holes sit in the full-depth part of the plate, clear of the step
// that is cut out of the bottom left corner.
const FIX_A = pt(70 + 30, 70 + 18);
const FIX_B = pt(70 + 70, 70 + 18);
const FIX_R = 6;

const plateOutline = (): Mark[] => [
  {
    kind: 'poly',
    style: 'outline',
    close: true,
    points: [
      pt(PLATE.left, PLATE.top),
      pt(PLATE.left + PLATE.length, PLATE.top),
      pt(PLATE.left + PLATE.length, PLATE.top + PLATE.depth),
      pt(STEP.x, STEP.y),
      pt(STEP.x, PLATE.top + PLATE.depth - 24),
      pt(PLATE.left, PLATE.top + PLATE.depth - 24),
    ],
  },
];

const plateHoles = (): Mark[] => [
  { kind: 'circle', style: 'outline', c: BORE.at, r: BORE.r },
  { kind: 'line', style: 'centre', a: pt(BORE.at.x - BORE.r - 8, BORE.at.y), b: pt(BORE.at.x + BORE.r + 8, BORE.at.y) },
  { kind: 'line', style: 'centre', a: pt(BORE.at.x, BORE.at.y - BORE.r - 8), b: pt(BORE.at.x, BORE.at.y + BORE.r + 8) },
  { kind: 'circle', style: 'outline', c: FIX_A, r: FIX_R },
  { kind: 'circle', style: 'outline', c: FIX_B, r: FIX_R },
  { kind: 'line', style: 'centre', a: pt(FIX_A.x - FIX_R - 6, FIX_A.y), b: pt(FIX_A.x + FIX_R + 6, FIX_A.y) },
  { kind: 'line', style: 'centre', a: pt(FIX_A.x, FIX_A.y - FIX_R - 6), b: pt(FIX_A.x, FIX_A.y + FIX_R + 6) },
  { kind: 'line', style: 'centre', a: pt(FIX_B.x - FIX_R - 6, FIX_B.y), b: pt(FIX_B.x + FIX_R + 6, FIX_B.y) },
  { kind: 'line', style: 'centre', a: pt(FIX_B.x, FIX_B.y - FIX_R - 6), b: pt(FIX_B.x, FIX_B.y + FIX_R + 6) },
];

/** The bracket, drawn as the first step of every one of these lessons. */
const bracket = (): Mark[] => [...plateOutline(), ...plateHoles()];

/** The step every dimensioning lesson opens with: draw the part, plain. */
const drawTheBracket = (extra: string) => ({
  id: 'draw-part',
  title: 'Draw the bracket',
  tool: 'tsquare' as const,
  teeY: PLATE.top,
  focus: { at: pt(PLATE.left + PLATE.length / 2, PLATE.top + PLATE.depth / 2), r: 130 },
  tip: 'Finish the shape completely before you put a single dimension on it.',
  lines: [
    { text: 'Here is the bracket. The same one every time in this section.' },
    { text: 'A plate, a step, two fixing holes and one bored hole.' },
    { text: 'Draw the shape first and finish it. Outline dark, centre lines thin.' },
    { text: extra },
  ],
  marks: bracket(),
});

/* ========================================================================= 24
 * Functional dimensioning
 * ======================================================================= */

const FUNCTIONAL: DrawTopic = {
  id: 'dimension-functional',
  title: 'Functional dimensioning',
  subtitle: 'State the sizes the part must have to do its job.',
  goal: 'Pick out the functional sizes on a part — the ones that decide whether it works — and dimension those directly rather than leaving them to be worked out.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', '45° set square', 'HB pencil'],
  base: preparedSheet('FUNCTIONAL DIMENSIONING — BS 308', '24'),
  steps: [
    {
      id: 'functional-idea',
      title: 'Which sizes actually matter',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 220 },
      tip: 'A functional dimension is one that decides whether the part will work in the assembly.',
      lines: [
        { text: 'Every part has sizes that matter and sizes that do not.' },
        { text: 'A functional dimension is one the part cannot work without.' },
        { text: 'The bore that a shaft runs in. The centres the bolts must line up with.' },
        { text: 'Get those wrong and the machine will not go together.' },
        { text: 'So you dimension them directly. Never leave a functional size to be added up.' },
      ],
      marks: [],
    },
    drawTheBracket('Then we decide which sizes are functional.'),
    {
      id: 'functional-bore',
      title: 'The bore is functional',
      tool: 'pencil',
      focus: { at: BORE.at, r: 70 },
      tip: 'A bore that carries a shaft is always functional — it gets the tolerance as well.',
      lines: [
        { text: 'Start with the bore. A shaft runs in it.' },
        { text: 'Thirty-two diameter, and it carries a tolerance.', at: BORE.at, label: 'Ø32 H7' },
        { text: 'H7 is a hole tolerance. It tells the machinist how much he may be out.' },
        { text: 'That is a functional dimension. It decides whether the shaft turns or seizes.' },
      ],
      marks: [
        // Across the circle through its centre: a diameter dimension needs no
        // projection lines, so the offset stays at zero.
        { kind: 'dim', a: pt(BORE.at.x - BORE.r, BORE.at.y), b: pt(BORE.at.x + BORE.r, BORE.at.y), offset: 0, label: 'Ø32 H7' },
      ],
    },
    {
      id: 'functional-centres',
      title: 'Hole centres are functional',
      tool: 'pencil',
      focus: { at: pt(140, 120), r: 110 },
      tip: 'Fixing centres must match the part it bolts to, so they are dimensioned centre to centre.',
      lines: [
        { text: 'Now the two fixing holes.' },
        { text: 'What matters is not where they are on the plate.' },
        { text: 'What matters is how far apart they are, because they must match the holes they bolt to.' },
        { text: 'So dimension centre to centre. Forty.', at: pt((FIX_A.x + FIX_B.x) / 2, FIX_A.y), label: '40' },
        { text: 'And from the machined face to the first centre line, thirty.' },
      ],
      marks: [
        // Shortest dimension nearest the part, so the projection lines never
        // have to cross one another.
        { kind: 'dim', a: pt(PLATE.left, FIX_A.y), b: FIX_A, offset: 26, label: '30' },
        { kind: 'dim', a: FIX_A, b: FIX_B, offset: 42, label: '40' },
        { kind: 'dim', a: pt(PLATE.left, BORE.at.y), b: BORE.at, offset: -76, label: '120' },
      ],
    },
    {
      id: 'functional-mark',
      title: 'Mark them F',
      tool: 'pencil',
      focus: { at: pt(180, 180), r: 150 },
      tip: 'In an exam, marking the functional dimensions F shows the examiner you know which is which.',
      lines: [
        { text: 'In your exercise book, put a small F beside each functional dimension.' },
        { text: 'It shows you have thought about it, not just measured everything.' },
        { text: 'Three F dimensions here: the bore, the centres, and the distance to the bore.' },
        { text: 'Everything else on this part is along for the ride.' },
      ],
      marks: [
        { kind: 'text', at: pt(BORE.at.x + 26, BORE.at.y - 42), text: 'F', size: 3.4, bold: true },
        { kind: 'text', at: pt((FIX_A.x + FIX_B.x) / 2 + 10, FIX_A.y - 30), text: 'F', size: 3.4, bold: true },
        { kind: 'text', at: pt(PLATE.left + 60, PLATE.top - 50), text: 'F = FUNCTIONAL SIZE', size: 3, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 25
 * Non-functional dimensioning
 * ======================================================================= */

const NON_FUNCTIONAL: DrawTopic = {
  id: 'dimension-non-functional',
  title: 'Non-functional dimensioning',
  subtitle: 'The sizes that only have to be about right.',
  goal: 'Identify the non-functional sizes on a part, dimension them without tolerance, and explain why giving them a close tolerance wastes money.',
  minutes: 25,
  level: 'Exam',
  tools: ['T-square', 'HB pencil'],
  base: preparedSheet('NON-FUNCTIONAL DIMENSIONING — BS 308', '25'),
  steps: [
    {
      id: 'non-functional-idea',
      title: 'Not everything is critical',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 220 },
      tip: 'A tight tolerance on a size that does not matter costs money and buys nothing.',
      lines: [
        { text: 'The same bracket. Now the other sizes.' },
        { text: 'The overall length. The thickness of the step. The corner radii.' },
        { text: 'None of those decide whether the machine works.' },
        { text: 'They are non-functional. They must be about right, and that is all.' },
        { text: 'If you put a tight tolerance on them, somebody pays for accuracy nobody needs.' },
      ],
      marks: [],
    },
    drawTheBracket('This time we look at the sizes that are not critical.'),
    {
      id: 'non-functional-overall',
      title: 'Overall sizes',
      tool: 'pencil',
      focus: { at: pt(160, 175), r: 150 },
      tip: 'Overall sizes are usually non-functional: the part just has to fit in the space.',
      lines: [
        { text: 'Overall length, one hundred and seventy.' },
        { text: 'Overall depth, eighty.' },
        { text: 'No tolerance written, so the general tolerance in the title block applies.' },
        { text: 'Usually plus or minus half a millimetre. Plenty for a size that only has to fit in a space.' },
      ],
      marks: [
        { kind: 'dim', a: pt(PLATE.left, STEP_TOP), b: pt(PLATE.left + PLATE.length, STEP_TOP), offset: -72, label: '170' },
        { kind: 'dim', a: pt(PLATE.left + PLATE.length, PLATE.top), b: pt(PLATE.left + PLATE.length, PLATE.top + PLATE.depth), offset: 26, label: '80' },
      ],
    },
    {
      id: 'non-functional-step',
      title: 'The step and the radii',
      tool: 'pencil',
      focus: { at: pt(STEP.x, STEP.y - 20), r: 80 },
      tip: 'Radii that are only there to remove a sharp corner are noted, not dimensioned one by one.',
      lines: [
        { text: 'The step is there to clear a casting. Forty long, twenty-four deep.' },
        { text: 'Nothing mates with it, so it is non-functional.' },
        { text: 'And the corner radii — one note covers them all.' },
        { text: 'All radii three millimetres unless stated. One line, four corners.' },
      ],
      marks: [
        { kind: 'dim', a: pt(PLATE.left, STEP_TOP), b: pt(STEP.x, STEP_TOP), offset: -56, label: '40' },
        { kind: 'dim', a: pt(STEP.x, STEP_TOP), b: pt(STEP.x, PLATE.top + PLATE.depth), offset: -24, label: '24' },
        { kind: 'text', at: pt(PLATE.left, PLATE.top + PLATE.depth + 48), text: 'ALL RADII R3 UNLESS STATED', size: 3, align: 'left' },
      ],
    },
    {
      id: 'non-functional-mark',
      title: 'Mark them NF',
      tool: 'pencil',
      focus: { at: pt(180, 180), r: 150 },
      tip: 'Functional first, non-functional after — that is the order a drawing is dimensioned in.',
      lines: [
        { text: 'Put NF beside these ones.' },
        { text: 'When you dimension a real part, do the functional sizes first.' },
        { text: 'Then fill in the non-functional ones round them.' },
        { text: 'That way the sizes that matter get the good positions on the drawing.' },
      ],
      marks: [
        { kind: 'text', at: pt(PLATE.left + PLATE.length / 2, PLATE.top + PLATE.depth + 40), text: 'NF', size: 3.4, bold: true, align: 'center' },
        { kind: 'text', at: pt(PLATE.left, PLATE.top - 50), text: 'NF = NON-FUNCTIONAL SIZE', size: 3, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 26
 * Auxiliary dimensioning
 * ======================================================================= */

const AUXILIARY: DrawTopic = {
  id: 'dimension-auxiliary',
  title: 'Auxiliary dimensioning',
  subtitle: 'The extra size, in brackets, that nobody works to.',
  goal: 'Add an auxiliary dimension in brackets for information only, and explain why it must never be given a tolerance.',
  minutes: 25,
  level: 'Exam',
  tools: ['T-square', 'HB pencil'],
  base: preparedSheet('AUXILIARY DIMENSIONING — BS 308', '26'),
  steps: [
    {
      id: 'auxiliary-idea',
      title: 'A size for information only',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 220 },
      tip: 'An auxiliary dimension is written in brackets. It is for information and is never worked to.',
      lines: [
        { text: 'Sometimes a size is useful to know but must not be worked to.' },
        { text: 'That is an auxiliary dimension.' },
        { text: 'It goes in round brackets, and it never gets a tolerance.' },
        { text: 'The brackets say: this is for your information, do not machine to it.' },
      ],
      marks: [],
    },
    drawTheBracket('Then we add one size in brackets and see why.'),
    {
      id: 'auxiliary-chain',
      title: 'The sizes that are worked to',
      tool: 'pencil',
      focus: { at: pt(160, 175), r: 150 },
      tip: 'Dimension the part completely first. The auxiliary size is always the extra one.',
      lines: [
        { text: 'First the real dimensions. Forty to the step, one hundred and twenty to the bore.' },
        { text: 'Those two are machined to.' },
        { text: 'Now somebody in the fitting shop wants to know the distance from the step to the bore.' },
        { text: 'It is eighty. But if we dimension it as eighty, we have over-dimensioned the drawing.' },
      ],
      marks: [
        { kind: 'dim', a: pt(PLATE.left, STEP_TOP), b: pt(STEP.x, STEP_TOP), offset: -38, label: '40' },
        { kind: 'dim', a: pt(PLATE.left, BORE.at.y), b: BORE.at, offset: -76, label: '120' },
      ],
    },
    {
      id: 'auxiliary-bracket',
      title: 'Put it in brackets',
      tool: 'pencil',
      focus: { at: pt(STEP.x + 40, PLATE.top + PLATE.depth + 40), r: 90 },
      tip: 'Brackets mean: this size follows from the others. It cannot be wrong on its own.',
      lines: [
        { text: 'So we write it in brackets. Eighty in round brackets.', at: pt(STEP.x + 40, PLATE.top + PLATE.depth + 36), label: '(80)' },
        { text: 'Now it is auxiliary. It is there to be read, not to be worked to.' },
        { text: 'It cannot be wrong, because it follows from the other two.' },
        { text: 'And it gets no tolerance. Ever. A toleranced auxiliary dimension is a contradiction.' },
      ],
      marks: [
        { kind: 'dim', a: pt(STEP.x, PLATE.top + PLATE.depth), b: pt(BORE.at.x, PLATE.top + PLATE.depth), offset: -14, label: '(80)' },
      ],
    },
    {
      id: 'auxiliary-rule',
      title: 'Why the rule exists',
      tool: 'pencil',
      focus: { at: pt(180, 190), r: 160 },
      tip: 'One feature, one dimension. Everything else that can be worked out goes in brackets or comes off.',
      lines: [
        { text: 'Think about what happens without the brackets.' },
        { text: 'Forty, plus eighty, should be one hundred and twenty.' },
        { text: 'But every one of them has a tolerance. They will not agree.' },
        { text: 'The machinist then has to choose which one to believe, and that is not his job.' },
        { text: 'One feature, one dimension. Anything extra goes in brackets.' },
      ],
      marks: [
        { kind: 'text', at: pt(PLATE.left, PLATE.top - 50), text: '( ) = AUXILIARY, FOR INFORMATION ONLY', size: 3, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 27
 * Chain dimensioning
 * ======================================================================= */

const CHAIN_Y = 200;

const CHAIN: DrawTopic = {
  id: 'dimension-chain',
  title: 'Chain dimensioning',
  subtitle: 'End to end — and the error that builds up as you go.',
  goal: 'Dimension a part in a chain, work out how the tolerances accumulate along it, and say when a chain is the right choice.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', 'HB pencil'],
  base: preparedSheet('CHAIN DIMENSIONING — BS 308', '27'),
  steps: [
    {
      id: 'chain-idea',
      title: 'One after another',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 220 },
      tip: 'In a chain, each dimension starts where the last one finished.',
      lines: [
        { text: 'Chain dimensioning is the easy one to draw.' },
        { text: 'Each size starts where the last one finished.' },
        { text: 'Forty, then eighty, then fifty. End to end, like a chain.' },
        { text: 'It reads well. But it has a problem, and it is a serious one.' },
      ],
      marks: [],
    },
    drawTheBracket('Then we dimension it end to end and count the error.'),
    {
      id: 'chain-dims',
      title: 'Put the chain on',
      tool: 'pencil',
      focus: { at: pt(160, CHAIN_Y - 20), r: 150 },
      tip: 'Dimension lines in a chain sit on one straight line, with the figures above them.',
      lines: [
        { text: 'Project down from each feature with thin lines.' },
        { text: 'Leave a small gap where the projection line leaves the outline.' },
        { text: 'One dimension line straight across, all the sizes on it.' },
        { text: 'Forty. Eighty. Fifty. That is the chain.' },
      ],
      marks: [
        // All three on one line, each one starting where the last finished.
        { kind: 'dim', a: pt(PLATE.left, STEP_TOP), b: pt(STEP.x, STEP_TOP), offset: STEP_TOP - CHAIN_Y, label: '40 ±0.2' },
        { kind: 'dim', a: pt(STEP.x, PLATE.top + PLATE.depth), b: pt(BORE.at.x, PLATE.top + PLATE.depth), offset: PLATE.top + PLATE.depth - CHAIN_Y, label: '80 ±0.2' },
        { kind: 'dim', a: pt(BORE.at.x, PLATE.top + PLATE.depth), b: pt(PLATE.left + PLATE.length, PLATE.top + PLATE.depth), offset: PLATE.top + PLATE.depth - CHAIN_Y, label: '50 ±0.2' },
      ],
    },
    {
      id: 'chain-error',
      title: 'Add up the error',
      tool: 'pencil',
      focus: { at: pt(180, CHAIN_Y + 20), r: 150 },
      tip: 'In a chain the tolerances add. Three at ±0.2 gives ±0.6 at the far end.',
      lines: [
        { text: 'Every size is plus or minus nought point two.' },
        { text: 'Now think about the far end of the part.' },
        { text: 'The first size can be out by nought point two.' },
        { text: 'The second starts from there and adds another nought point two.' },
        { text: 'And the third adds another. Three times nought point two is nought point six.' },
        { text: 'That is tolerance build-up. The chain carried the error along with it.' },
      ],
      marks: [
        { kind: 'text', at: pt(PLATE.left, CHAIN_Y + 22), text: 'BUILD-UP: 0.2 + 0.2 + 0.2 = ±0.6 AT THE END', size: 3, align: 'left' },
      ],
    },
    {
      id: 'chain-when',
      title: 'When a chain is right',
      tool: 'pencil',
      focus: { at: pt(180, CHAIN_Y + 40), r: 160 },
      tip: 'Use a chain when each step matters to its neighbour, not when the far end matters.',
      lines: [
        { text: 'So is a chain always wrong? No.' },
        { text: 'Use it when each feature matters to the one next to it.' },
        { text: 'Teeth on a rack. Rungs on a ladder. Holes in a fence rail.' },
        { text: 'There, the spacing is what counts, and the chain says exactly that.' },
        { text: 'But when the far end has to be right, you need the next lesson.' },
      ],
      marks: [
        { kind: 'text', at: pt(PLATE.left, CHAIN_Y + 34), text: 'USE A CHAIN WHEN THE SPACING MATTERS', size: 3, align: 'left' },
      ],
    },
  ],
};

/* ========================================================================= 28
 * Datum dimensioning
 * ======================================================================= */

const DATUM: DrawTopic = {
  id: 'dimension-datum',
  title: 'Datum dimensioning',
  subtitle: 'Every size from one face, so no error can build up.',
  goal: 'Dimension a part from a single datum face, show why the tolerances no longer accumulate, and choose a datum that the workshop can actually use.',
  minutes: 30,
  level: 'Exam',
  tools: ['T-square', 'HB pencil'],
  base: preparedSheet('DATUM DIMENSIONING — BS 308', '28'),
  steps: [
    {
      id: 'datum-idea',
      title: 'One face to rule them all',
      tool: 'hand',
      focus: { at: pt(180, 120), r: 220 },
      tip: 'A datum is one face, edge or centre line that every other size is measured from.',
      lines: [
        { text: 'The cure for tolerance build-up is a datum.' },
        { text: 'A datum is one face that everything else is measured from.' },
        { text: 'Not from the last hole. From the datum. Every time.' },
        { text: 'Pick a face the workshop can actually use — a machined face they can clamp against.' },
        { text: 'A rough casting edge is a bad datum. Nobody can measure from it twice the same.' },
      ],
      marks: [],
    },
    drawTheBracket('Then every size comes off one face.'),
    {
      id: 'datum-face',
      title: 'Mark the datum',
      tool: 'pencil',
      focus: { at: pt(PLATE.left, PLATE.top + PLATE.depth / 2), r: 80 },
      tip: 'The datum face is lettered A in a box, with a filled triangle sitting on the face itself.',
      lines: [
        { text: 'The left-hand face is machined. That is our datum.' },
        { text: 'Mark it with a small filled triangle sitting on the face.', at: pt(PLATE.left, PLATE.top + 40) },
        { text: 'And a letter in a box. A.' },
        { text: 'Now everybody knows where the sizes come from.' },
      ],
      marks: [
        {
          kind: 'poly',
          style: 'outline',
          close: true,
          points: [pt(PLATE.left, PLATE.top + 40), pt(PLATE.left - 5, PLATE.top + 35), pt(PLATE.left - 5, PLATE.top + 45)],
        },
        { kind: 'line', style: 'thin', a: pt(PLATE.left - 5, PLATE.top + 40), b: pt(PLATE.left - 18, PLATE.top + 40) },
        {
          kind: 'poly',
          style: 'thin',
          close: true,
          points: [pt(PLATE.left - 18, PLATE.top + 34), pt(PLATE.left - 30, PLATE.top + 34), pt(PLATE.left - 30, PLATE.top + 46), pt(PLATE.left - 18, PLATE.top + 46)],
        },
        { kind: 'text', at: pt(PLATE.left - 24, PLATE.top + 40), text: 'A', size: 4, align: 'center', baseline: 'middle', bold: true },
      ],
    },
    {
      id: 'datum-dims',
      title: 'All from face A',
      tool: 'pencil',
      focus: { at: pt(160, CHAIN_Y), r: 160 },
      tip: 'Stack the dimension lines, shortest nearest the part, so none of them cross.',
      lines: [
        { text: 'Now every size starts at face A.' },
        { text: 'Forty to the step. One hundred and twenty to the bore. One hundred and seventy overall.' },
        { text: 'Stack the dimension lines, shortest nearest the part.' },
        { text: 'They never cross, and they all point back to the same face.' },
      ],
      marks: [
        // Stacked, shortest nearest the part, every one starting at face A.
        { kind: 'dim', a: pt(PLATE.left, STEP_TOP), b: pt(STEP.x, STEP_TOP), offset: STEP_TOP - (CHAIN_Y - 14), label: '40 ±0.2' },
        { kind: 'dim', a: pt(PLATE.left, BORE.at.y), b: BORE.at, offset: BORE.at.y - CHAIN_Y, label: '120 ±0.2' },
        { kind: 'dim', a: pt(PLATE.left, STEP_TOP), b: pt(PLATE.left + PLATE.length, STEP_TOP), offset: STEP_TOP - (CHAIN_Y + 14), label: '170 ±0.2' },
      ],
    },
    {
      id: 'datum-no-buildup',
      title: 'No build-up left',
      tool: 'pencil',
      focus: { at: pt(180, CHAIN_Y + 44), r: 150 },
      tip: 'From a datum, each size can only be wrong on its own — errors do not add.',
      lines: [
        { text: 'Look at the far end now.' },
        { text: 'One hundred and seventy, plus or minus nought point two.' },
        { text: 'Not nought point six. Nought point two.' },
        { text: 'Because it was measured from the datum, not from the hole before it.' },
        { text: 'Each size can be wrong on its own. None of them can add to the next.' },
        { text: 'That is why the machine shop asks for datum dimensioning on anything that has to fit.' },
      ],
      marks: [
        { kind: 'text', at: pt(PLATE.left, CHAIN_Y + 46), text: 'NO BUILD-UP: EVERY SIZE ±0.2 FROM FACE A', size: 3, align: 'left' },
      ],
    },
  ],
};

export const DIMENSIONING_TOPICS: DrawTopic[] = [
  FUNCTIONAL,
  NON_FUNCTIONAL,
  AUXILIARY,
  CHAIN,
  DATUM,
];
