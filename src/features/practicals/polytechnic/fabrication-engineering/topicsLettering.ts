/**
 * Lettering styles, drawn stroke by stroke.
 *
 * Six sheets, one per style. They are not six fonts — they are six sets of
 * decisions about width, slope, case and whether a straight edge is used at
 * all, and every one of them is examined by drawing the alphabet between guide
 * lines and then lettering something real with it.
 *
 * The letters here come out of `strokeLettering`, which holds each character as
 * the paths a hand would take. So the pencil on the board walks the strokes in
 * order — down the stem, round the bowl — which is the only part of lettering
 * that actually has to be taught.
 */

import { pt, type Mark } from '../technical-drawing/drawingGeometry';
import type { DrawTopic, LessonLine } from '../technical-drawing/drawingLessonTypes';
import { fabSheet, line, text } from './fabricationGeometry';
import { letterMarks, letteringGuides, letterWidth, type LetterStyle } from './strokeLettering';

const LEFT = 40;
const ROW_A = 74;
const ROW_B = 108;
const ROW_C = 142;
const TITLE_ROW = 190;
const CAP = 9;
const TITLE_CAP = 7;

interface LetteringSpec {
  id: string;
  title: string;
  subtitle: string;
  goal: string;
  number: string;
  /** Lettered heading on the sheet. */
  heading: string;
  style: LetterStyle;
  slope: number;
  lowercase: boolean;
  freehand: boolean;
  /** The three rows of specimen characters. */
  rows: [string, string, string];
  /** The real piece of lettering the style is then used for. */
  applied: string;
  what: { tip: string; lines: LessonLine[] };
  guides: { tip: string; lines: LessonLine[] };
  strokesA: { tip?: string; lines: LessonLine[] };
  strokesB: { tip?: string; lines: LessonLine[] };
  apply: { tip: string; lines: LessonLine[]; extra?: Mark[] };
}

function letteringTopic(spec: LetteringSpec): DrawTopic {
  const common = {
    height: CAP,
    style: spec.style,
    slope: spec.slope,
    freehand: spec.freehand,
  } as const;

  const rowGuides = (baseline: number, value: string) =>
    letteringGuides(pt(LEFT, baseline), CAP, letterWidth(value, { height: CAP, style: spec.style }) + 6, {
      lowercase: spec.lowercase,
      slope: spec.slope || undefined,
      slopeEvery: 14,
    });

  return {
    id: spec.id,
    title: spec.title,
    subtitle: spec.subtitle,
    goal: spec.goal,
    minutes: 25,
    level: 'Basic',
    tools: spec.freehand
      ? ['T-square (for the guide lines only)', 'HB and 2H pencils']
      : ['T-square', '45° set square', '30/60 set square', 'HB and 2H pencils'],
    base: fabSheet({ title: spec.heading, number: spec.number, scale: '—' }),
    steps: [
      {
        id: `${spec.id}-what`,
        title: 'What this style is for',
        tool: 'hand',
        focus: { at: pt(200, 120), r: 165 },
        tip: spec.what.tip,
        lines: spec.what.lines,
        marks: [],
      },
      {
        id: `${spec.id}-guides`,
        title: 'Guide lines first, always',
        tool: 'tsquare',
        teeY: ROW_A,
        focus: { at: pt(120, 110), r: 100 },
        tip: spec.guides.tip,
        lines: spec.guides.lines,
        marks: [
          ...rowGuides(ROW_A, spec.rows[0]),
          ...rowGuides(ROW_B, spec.rows[1]),
          ...rowGuides(ROW_C, spec.rows[2]),
        ],
      },
      {
        id: `${spec.id}-strokes-a`,
        title: 'The first row, stroke by stroke',
        tool: 'pencil',
        focus: { at: pt(110, 72), r: 84 },
        tip: spec.strokesA.tip,
        lines: spec.strokesA.lines,
        marks: letterMarks(spec.rows[0], { at: pt(LEFT, ROW_A), ...common, seed: 3 }),
      },
      {
        id: `${spec.id}-strokes-b`,
        title: 'The rest of the alphabet, and the figures',
        tool: 'pencil',
        focus: { at: pt(110, 126), r: 92 },
        tip: spec.strokesB.tip,
        lines: spec.strokesB.lines,
        marks: [
          ...letterMarks(spec.rows[1], { at: pt(LEFT, ROW_B), ...common, seed: 11 }),
          ...letterMarks(spec.rows[2], { at: pt(LEFT, ROW_C), ...common, seed: 19 }),
        ],
      },
      {
        id: `${spec.id}-apply`,
        title: 'Now letter something real',
        tool: 'pencil',
        focus: { at: pt(160, 182), r: 118 },
        tip: spec.apply.tip,
        lines: spec.apply.lines,
        marks: [
          ...letteringGuides(
            pt(LEFT, TITLE_ROW),
            TITLE_CAP,
            letterWidth(spec.applied, { height: TITLE_CAP, style: spec.style }) + 6,
            { lowercase: spec.lowercase, slope: spec.slope || undefined, slopeEvery: 12 }
          ),
          ...letterMarks(spec.applied, {
            at: pt(LEFT, TITLE_ROW),
            height: TITLE_CAP,
            style: spec.style,
            slope: spec.slope,
            freehand: spec.freehand,
            seed: 27,
          }),
          ...(spec.apply.extra ?? []),
        ],
      },
    ],
  };
}

/* ==================================================== 1 — open style caps */

const OPEN = letteringTopic({
  id: 'lettering-open',
  title: 'Open style',
  subtitle: 'Upright capitals at their proper width — the standard hand.',
  goal: 'Letter the alphabet and figures in upright open capitals between guide lines.',
  number: 'F-30',
  heading: 'OPEN STYLE CAPITALS',
  style: 'open',
  slope: 0,
  lowercase: false,
  freehand: false,
  rows: ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '1234567890'],
  applied: 'FABRICATION ENG',
  what: {
    tip: 'Open style: upright, and each letter drawn at its natural width — roughly 0.6 of its height for most of the alphabet.',
    lines: [
      { text: 'Lettering on a drawing is not handwriting. It is drawn, the same as everything else.' },
      { text: 'Open style is the standard hand. Upright, capitals, and each letter at its full width.' },
      { text: 'Full width means about six tenths of the height, for most of the alphabet.' },
      { text: 'Some are wider. M and W are nearly square. Some are narrow — I is a single stroke.' },
      { text: 'It is called open because the letters are not squeezed. They are given their room.' },
      { text: 'It is the most readable of all the styles, and it is what you use unless told otherwise.' },
      { text: 'Every letter is built from strokes. Learn the strokes and the letters look after themselves.' },
    ],
  },
  guides: {
    tip: 'Two guide lines for capitals: the base line and the cap line. Draw them in 2H and leave them on.',
    lines: [
      { text: 'Nothing gets lettered without guide lines. Nothing.' },
      { text: 'For capitals you need two. The base line, and the cap line above it.' },
      { text: 'The gap between them is the height of the letters. Nine millimetres here.' },
      { text: 'Rule them with the T-square in two H, light, and leave them on the sheet.' },
      { text: 'Three rows, so six lines. Space them out so the rows do not run into each other.' },
      { text: 'Every letter you draw now touches both lines. That alone fixes most bad lettering.' },
    ],
  },
  strokesA: {
    tip: 'Verticals downwards, horizontals left to right, curves in two halves. Same order every time.',
    lines: [
      { text: 'A first. Two sloping strokes meeting at the top, then the bar across, a third of the way up.' },
      { text: 'B. Down the stem, then the top bowl, then the bottom bowl. Bottom bowl slightly bigger.' },
      { text: 'C. One stroke, from the top round to the bottom. Do not close it up.' },
      { text: 'D. Stem, then one big bowl straight off the top and round to the bottom.' },
      { text: 'E and F. Stem, then the arms. E has three, F has two, and the middle arm is shorter.' },
      { text: 'Keep going. Verticals downwards, horizontals left to right, and curves in one sweep.' },
      { text: 'Always the same order. That is what makes lettering come out even.' },
    ],
  },
  strokesB: {
    tip: 'Figures are the same height as capitals. A 1 is narrow, a 0 is a full oval — do not make them all the same width.',
    lines: [
      { text: 'N, then O — a full oval touching both lines.' },
      { text: 'P and R. Same top as B, but R gets the leg out to the bottom right.' },
      { text: 'S is the difficult one. Two curves, and the bottom one bigger than the top.' },
      { text: 'A top-heavy S is the commonest fault in the whole alphabet. Look at yours.' },
      { text: 'W is four strokes and it is wide. Do not squash it to match the others.' },
      { text: 'Now the figures, the same height as the capitals.' },
      { text: 'One is narrow, zero is a full oval. Do not make them all the same width.' },
    ],
  },
  apply: {
    tip: 'Set the height first, work out the width of the whole phrase, and start it where it will end up centred.',
    lines: [
      { text: 'Now letter something for real, a bit smaller. Seven millimetre capitals.' },
      { text: 'Before you start, work out where it ends. Count the letters, multiply by the width.' },
      { text: 'Then start it so it finishes where you want it. That is how a title comes out centred.' },
      { text: 'Guide lines on. Then letter it, one character at a time, touching both lines.' },
      { text: 'Even spacing between letters matters as much as the letters themselves.' },
      { text: 'Not equal gaps — equal looking gaps. An L next to an A needs less space than two Hs.' },
      { text: 'Stand back and look. If a word looks lumpy, it is the spacing, not the letters.' },
    ],
  },
});

/* ================================================= 2 — condensed style caps */

const CONDENSED = letteringTopic({
  id: 'lettering-condensed',
  title: 'Condensed style',
  subtitle: 'The same letters squeezed narrower — to get a long title into a short box.',
  goal: 'Letter in condensed capitals and know when narrowing is the right answer instead of shrinking.',
  number: 'F-31',
  heading: 'CONDENSED STYLE',
  style: 'condensed',
  slope: 0,
  lowercase: false,
  freehand: false,
  rows: ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '1234567890'],
  applied: 'WELDED STEEL FABRICATION',
  what: {
    tip: 'Condensed keeps the height and reduces the width to about two thirds. Never reduce the height instead — small lettering does not photocopy.',
    lines: [
      { text: 'Sooner or later a title is too long for the box it has to go in.' },
      { text: 'There are two ways out, and only one of them is right.' },
      { text: 'The wrong way is to make the letters smaller. Then nobody can read them.' },
      { text: 'Drawings get folded, copied and taken into workshops. Small lettering does not survive that.' },
      { text: 'The right way is to keep the height and narrow the letters. That is condensed style.' },
      { text: 'About two thirds of the normal width. Same height, same strokes, less room.' },
      { text: 'The letters are still upright and still capitals. Only the width has changed.' },
    ],
  },
  guides: {
    tip: 'The guide lines are identical to open style. Condensing changes the width, never the height.',
    lines: [
      { text: 'Guide lines exactly as before. Base line and cap line, nine apart.' },
      { text: 'Notice they have not changed. Condensing does not touch the height.' },
      { text: 'What changes is how far the pencil moves along before the next letter starts.' },
      { text: 'Rule three rows and we will letter the same alphabet again.' },
    ],
  },
  strokesA: {
    tip: 'Same strokes, less width. Curved letters suffer most, so keep the bowls even.',
    lines: [
      { text: 'Same strokes. A, B, C, D — the pencil goes the same way round.' },
      { text: 'They are just narrower. The bowls of B and D become ovals instead of circles.' },
      { text: 'Watch the curves. A squeezed O should still be a smooth oval, not a rectangle with corners.' },
      { text: 'And keep the verticals truly vertical. Narrow letters show a lean much more.' },
      { text: 'Compare it against the open style sheet. Same height, and it takes up two thirds of the room.' },
    ],
  },
  strokesB: {
    tip: 'M and W condense the most, because they were the widest to begin with.',
    lines: [
      { text: 'N through Z. The wide ones change most — M and W especially.' },
      { text: 'They were nearly square in open style. Now they are clearly tall.' },
      { text: 'The narrow ones barely change. I is one stroke either way.' },
      { text: 'That is worth knowing: condensing a word full of Ms saves a lot, a word full of Is saves nothing.' },
      { text: 'Figures too. Narrow them the same amount, or the numbers will not match the words.' },
    ],
  },
  apply: {
    tip: 'Never mix condensed and open lettering in the same title block. Pick one and hold it.',
    lines: [
      { text: 'Here is the sort of title that forces the issue. Welded steel fabrication.' },
      { text: 'Twenty four characters. In open style at this height it would run off the sheet.' },
      { text: 'Condensed, it fits, and it is still seven millimetres high and still readable.' },
      { text: 'Letter it, and keep every letter the same narrowness. That is the hard part.' },
      { text: 'One drifts wider, one drifts narrower, and the word looks wrong without anybody seeing why.' },
      { text: 'And one rule for the whole drawing: do not mix condensed and open in the same title block.' },
      { text: 'Pick one and hold it to the end.' },
    ],
  },
});

/* ================================================== 3 — sloping style caps */

const SLOPING = letteringTopic({
  id: 'lettering-sloping',
  title: 'Sloping style',
  subtitle: 'Capitals leaning forward 15° — and the guide lines that keep the lean honest.',
  goal: 'Letter sloping capitals at a constant 15° using slope guide lines.',
  number: 'F-32',
  heading: 'SLOPING STYLE',
  style: 'open',
  slope: 15,
  lowercase: false,
  freehand: false,
  rows: ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '1234567890'],
  applied: 'ITALIC TITLE 15',
  what: {
    tip: 'Sloping lettering leans 15° from the vertical — 75° to the base line. It is a shear, not a rotation: the base line stays level.',
    lines: [
      { text: 'Sloping style is the same alphabet, leaning forward.' },
      { text: 'Fifteen degrees off upright. Seventy five degrees to the base line. Same thing said twice.' },
      { text: 'Some drawing offices letter everything sloping. Some use it only for notes.' },
      { text: 'Either way, once you start you keep it up. Half a drawing sloping is worse than none.' },
      { text: 'Understand what is leaning, though. The letters lean. The line of lettering does not.' },
      { text: 'The base line stays dead level. It is a shear, not a rotation.' },
      { text: 'Letters written up a slope is a different mistake, and it looks like a mistake.' },
    ],
  },
  guides: {
    tip: 'Add slope guides — light lines at 15° from vertical, every 12 mm or so — and lean every stroke on them.',
    lines: [
      { text: 'Base line and cap line as usual, level.' },
      { text: 'Now the extra ones. Light lines at fifteen degrees, running up through both.' },
      { text: 'Space them every ten or twelve millimetres, right along the row.' },
      { text: 'Those are the slope guides, and they are what makes this style possible by hand.' },
      { text: 'Without them the first letters lean fifteen degrees and the last ones lean thirty.' },
      { text: 'You cannot see that happening while you do it. You can see it afterwards, and so can the examiner.' },
    ],
  },
  strokesA: {
    tip: 'Every stroke that was vertical is now parallel to the slope guides. Horizontals stay horizontal.',
    lines: [
      { text: 'Every stroke that used to go straight up now follows a slope guide.' },
      { text: 'The stem of the B. The stem of the D. Straight along the guide line.' },
      { text: 'But the horizontals do not change. The arms of the E stay level.' },
      { text: 'Only the uprights lean. That is what shearing means.' },
      { text: 'The curves lean with them, so the O becomes an oval tipped forward.' },
      { text: 'Take the A carefully. Both sloping strokes shift, and the left one gets steeper.' },
    ],
  },
  strokesB: {
    tip: 'A tipped O is still a smooth oval. If it comes out with a point at the top, the stroke was rushed.',
    lines: [
      { text: 'N to Z. The letters with a lot of upright in them show the slope most — H, I, L, T.' },
      { text: 'The round ones show it least, but they must still tip, or they look like they fell out of the word.' },
      { text: 'A tipped O is a smooth oval. If it has a point on it, you rushed the stroke.' },
      { text: 'Figures lean too. All of them, the same amount.' },
      { text: 'An upright figure in a sloping row is the thing the eye picks up immediately.' },
    ],
  },
  apply: {
    tip: 'Keep every letter on the same lean. One upright letter in a sloping line is more obvious than a wrong letter.',
    lines: [
      { text: 'Letter a title in it, seven high, with the slope guides drawn first.' },
      { text: 'Go slowly. The lean is the whole style, and it is the only thing being marked.' },
      { text: 'Check every few letters by looking along the row from the side.' },
      { text: 'Any letter standing more upright than its neighbours jumps straight out at you.' },
      { text: 'And the base line is still level. Put a straight edge under the word to check.' },
      { text: 'Sloping letters, level line. Get both and the style is right.' },
    ],
  },
});

/* ============================================= 4 — open style lower case */

const LOWERCASE = letteringTopic({
  id: 'lettering-open-lowercase',
  title: 'Open style lowercase',
  subtitle: 'Small letters, three guide lines, and the tails that go below the line.',
  goal: 'Letter open style lowercase with the correct x-height, ascenders and descenders.',
  number: 'F-33',
  heading: 'OPEN LOWER CASE',
  style: 'open',
  slope: 0,
  lowercase: true,
  freehand: false,
  rows: ['abcdefghijklm', 'nopqrstuvwxyz', 'Ab 1234567890'],
  applied: 'Mild steel plate 6 thick',
  what: {
    tip: 'Lowercase x-height is 0.7 of the cap height. Ascenders reach the cap line; descenders drop about 0.25 below the base line.',
    lines: [
      { text: 'Capitals are used for titles, headings and most notes. But not for everything.' },
      { text: 'Long notes are easier to read in lower case, and a lot of drawing offices use it.' },
      { text: 'Lower case needs one more guide line than capitals do.' },
      { text: 'Most small letters only come up part way. That height is called the x-height.' },
      { text: 'Seven tenths of the cap height. So a nine millimetre capital sits with a six point three x-height.' },
      { text: 'Then some letters have ascenders — b, d, f, h, k, l, t — and those reach the cap line.' },
      { text: 'And some have descenders — g, j, p, q, y — and those drop below the base line.' },
      { text: 'So you are working to four lines, not two.' },
    ],
  },
  guides: {
    tip: 'Four lines: descender, base, x-height, cap. Every lowercase letter uses three of the four.',
    lines: [
      { text: 'Base line first, as always.' },
      { text: 'Cap line above it, at the full height. That is where the ascenders will reach.' },
      { text: 'Now the x-height line, seven tenths up. That is the top of most of the letters.' },
      { text: 'And a fourth line below the base line, about a quarter down. That is the descender line.' },
      { text: 'Four lines. Every lowercase letter touches three of them.' },
      { text: 'The extra work here is exactly what makes lower case come out even.' },
    ],
  },
  strokesA: {
    tip: 'a, c, e, m, n, o, r, s, u, v, w, x, z live entirely between the base line and the x-height line.',
    lines: [
      { text: 'a is a small bowl and a stem, both between the base and the x line.' },
      { text: 'b is different. Its stem goes right up to the cap line — that is an ascender.' },
      { text: 'c, then d — another ascender, on the right hand side this time.' },
      { text: 'e is a bowl with a bar across it, and the bar sits halfway.' },
      { text: 'f has an ascender and a crossbar on the x line.' },
      { text: 'g is the awkward one. Bowl on the x line, and a tail below the base line.' },
      { text: 'Keep checking which of the four lines each letter is meant to reach.' },
    ],
  },
  strokesB: {
    tip: 'One capital in the row shows the proportion: the cap is taller than the x-height but the same height as an ascender.',
    lines: [
      { text: 'n through z. p and q drop below the line. y drops below on its tail.' },
      { text: 'The rest sit neatly between the base line and the x line.' },
      { text: 'i and j get their dots up near the cap line, small and round.' },
      { text: 'Now the last row, with a capital A next to a lower case b.' },
      { text: 'Look at that pair. The capital and the ascender reach the same height.' },
      { text: 'And the body of the b is clearly shorter than the A. That is the proportion, in one picture.' },
    ],
  },
  apply: {
    tip: 'A note in lower case still starts with a capital. Capitals inside a sentence are for names and abbreviations only.',
    lines: [
      { text: 'Now a real note. Mild steel plate, six thick.' },
      { text: 'Capital M to start, and everything else lower case.' },
      { text: 'The l and the t reach the cap line. Nothing else does.' },
      { text: 'The p drops below. Watch that it drops the same as any other descender.' },
      { text: 'A note like that is easier to read at arm\'s length than the same words in capitals.' },
      { text: 'Which is why long notes are lettered this way and short headings are not.' },
    ],
  },
});

/* ============================================= 5 — open style freehand */

const OPEN_FREEHAND = letteringTopic({
  id: 'lettering-open-freehand',
  title: 'Open style freehand',
  subtitle: 'The same letters with no straight edge — just guide lines and a steady hand.',
  goal: 'Letter open capitals freehand between guide lines, keeping height and width even without instruments.',
  number: 'F-34',
  heading: 'OPEN FREEHAND',
  style: 'open',
  slope: 0,
  lowercase: false,
  freehand: true,
  rows: ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '1234567890'],
  applied: 'SHOP SKETCH No 4',
  what: {
    tip: 'Freehand lettering still uses guide lines. Freehand means no straight edge for the letters — it does not mean no setting out.',
    lines: [
      { text: 'On the board you have a set square for every stroke. In the shop you have neither.' },
      { text: 'You are up a ladder with a sketch pad, and the fitter wants the sizes now.' },
      { text: 'So all of this has to work freehand, and it does.' },
      { text: 'Freehand lettering means no straight edge for the letters.' },
      { text: 'It does not mean no guide lines. You still rule those, or at least mark them.' },
      { text: 'Everything else is the same. Same strokes, same widths, same height.' },
      { text: 'It will not be perfect and it is not supposed to be. It has to be even, and it has to be readable.' },
    ],
  },
  guides: {
    tip: 'Even a rough sketch gets guide lines. Two pencil ticks and a straight-ish line will do.',
    lines: [
      { text: 'Rule the guide lines. This is the one part where the T-square is still allowed.' },
      { text: 'On site, mark the height at both ends and join them freehand. Close enough.' },
      { text: 'What matters is that a line exists for the letters to sit on and reach up to.' },
      { text: 'Lettering with no guide lines wanders up, wanders down, and changes height.' },
      { text: 'It is the single biggest difference between a sketch that reads and one that does not.' },
    ],
  },
  strokesA: {
    tip: 'Move from the elbow for long strokes, from the fingers for short ones. Rest the hand on the sheet.',
    lines: [
      { text: 'Rest your hand on the paper. Do not letter with your wrist in the air.' },
      { text: 'Long strokes come from the elbow. Short ones from the fingers.' },
      { text: 'Draw each stroke in one go. Do not sketch it in little bits and go over it.' },
      { text: 'A is easy freehand. B is harder — the two bowls want to come out different sizes.' },
      { text: 'The curved letters are always the ones that give you away. C, G, O, S.' },
      { text: 'Take those slower and let the whole arm do the sweep.' },
    ],
  },
  strokesB: {
    tip: 'Even is better than perfect. Twenty letters the same shape read better than twenty nearly-perfect different ones.',
    lines: [
      { text: 'Keep going through to Z, then the figures.' },
      { text: 'Now step back and look at the row as a whole, not letter by letter.' },
      { text: 'Are they all the same height? Do they all sit on the line?' },
      { text: 'Is the spacing even, or is there a hole in the middle of a word?' },
      { text: 'Even beats perfect. Twenty letters the same shape read better than twenty nearly right ones.' },
      { text: 'That is the whole skill, and it only comes from filling pages.' },
    ],
  },
  apply: {
    tip: 'This is the hand that gets used on every site sketch, every cutting list and every job card.',
    lines: [
      { text: 'Letter a heading for a shop sketch. Freehand, guide lines only.' },
      { text: 'Shop sketch, number four.' },
      { text: 'Take your time on the S and the K. They are the two that go wrong.' },
      { text: 'And keep the figure the same height as the capitals.' },
      { text: 'This is the hand you will use more than any other one in this course.' },
      { text: 'Every site sketch, every cutting list, every job card, for the rest of your working life.' },
    ],
  },
});

/* ========================================== 6 — sloping style freehand */

const SLOPING_FREEHAND = letteringTopic({
  id: 'lettering-sloping-freehand',
  title: 'Sloping style freehand',
  subtitle: 'Leaning letters, no straight edge — the hardest of the six, and the most used.',
  goal: 'Letter sloping capitals freehand at a constant lean, using only slope guides.',
  number: 'F-35',
  heading: 'SLOPING FREEHAND',
  style: 'open',
  slope: 15,
  lowercase: false,
  freehand: true,
  rows: ['ABCDEFGHIJKLM', 'NOPQRSTUVWXYZ', '1234567890'],
  applied: 'SITE NOTE 15 SLOPE',
  what: {
    tip: 'The two difficulties compound: keeping the height even and keeping the lean even, with nothing to lean on but guide lines.',
    lines: [
      { text: 'Last of the six, and the hardest, because it puts the two difficulties together.' },
      { text: 'Sloping, so every upright has to lean the same amount.' },
      { text: 'Freehand, so there is nothing to lean it against.' },
      { text: 'Do it badly and the lettering looks like it is falling over, letter by letter.' },
      { text: 'Do it well and it is the fastest readable hand there is, which is why it is used so much.' },
      { text: 'The answer is the slope guides. Draw more of them than you think you need.' },
      { text: 'Then you are never more than a few millimetres from a line telling you the lean.' },
    ],
  },
  guides: {
    tip: 'Draw slope guides closer together than for instrument work — one every 10 mm or so.',
    lines: [
      { text: 'Base line and cap line, level.' },
      { text: 'Then slope guides at fifteen degrees, and put them closer together than usual.' },
      { text: 'Every ten millimetres. Almost one per letter.' },
      { text: 'They are light, they stay on the sheet, and nobody minds them.' },
      { text: 'What they buy you is that your eye always has a lean to copy, right where you are working.' },
      { text: 'Without them, freehand slope drifts. It always drifts, and always in one direction.' },
    ],
  },
  strokesA: {
    tip: 'Lean the paper instead of the hand. Turning the sheet 15° lets you letter with your natural stroke.',
    lines: [
      { text: 'Here is a trick worth having. Turn the paper instead of your hand.' },
      { text: 'Swing the sheet round about fifteen degrees, and letter as if it were upright.' },
      { text: 'Your natural stroke does the leaning for you.' },
      { text: 'Turn it back and the lettering is sloping, and it is even.' },
      { text: 'Whichever way you do it, work along the guides. A, B, C, D.' },
      { text: 'And do not let the round letters stand up straight while the others lean.' },
    ],
  },
  strokesB: {
    tip: 'Check by sighting along the row from the side. A letter out of lean shows instantly from that angle.',
    lines: [
      { text: 'N to Z, then the figures, all on the same lean.' },
      { text: 'Every few letters, lift the sheet and sight along the row from the side.' },
      { text: 'From that angle, one letter out of lean shows up immediately.' },
      { text: 'Straight on, you will never see it. Nor will you see it on your own work at all.' },
      { text: 'That is why you check from an angle, and why you check as you go, not at the end.' },
    ],
  },
  apply: {
    tip: 'Slope, height, spacing. If a piece of lettering looks wrong, it is one of those three — and it is usually spacing.',
    lines: [
      { text: 'Letter one more, a site note, sloping and freehand.' },
      { text: 'Guides in first. Then straight through, without stopping to admire it.' },
      { text: 'Stopping halfway through a word is where the lean changes.' },
      { text: 'When it is done, check three things. Slope, height, spacing.' },
      { text: 'If it looks wrong it is one of those three, and nine times in ten it is the spacing.' },
      { text: 'That is all six styles. Fill a page of each and your lettering is finished for good.' },
    ],
    extra: [
      text(pt(250, 224), 'CHECK THREE THINGS', 3.6, { align: 'left', bold: true }),
      text(pt(250, 234), 'SLOPE     — SAME ON EVERY LETTER', 3, { align: 'left' }),
      text(pt(250, 243), 'HEIGHT    — TOUCHING BOTH GUIDES', 3, { align: 'left' }),
      text(pt(250, 252), 'SPACING  — EVEN TO THE EYE', 3, { align: 'left' }),
      line(pt(246, 218), pt(246, 256), 'thin'),
    ],
  },
});

export const LETTERING_TOPICS: DrawTopic[] = [
  OPEN,
  CONDENSED,
  SLOPING,
  LOWERCASE,
  OPEN_FREEHAND,
  SLOPING_FREEHAND,
];
