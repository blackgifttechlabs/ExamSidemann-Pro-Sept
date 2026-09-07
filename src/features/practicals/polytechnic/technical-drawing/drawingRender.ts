/**
 * One renderer for every place a sheet appears.
 *
 * The same function paints the CanvasTexture stuck to the paper on the 3D
 * drawing board, the "this is what you are going to draw" preview card and the
 * printable summary. There is deliberately no second implementation: if the
 * hexagon is right on the board it is right on the preview, because they are
 * the same pixels drawn at a different scale.
 *
 * The renderer also knows how to draw a mark *half finished*, which is what
 * makes the board look like someone is working on it rather than like slides
 * being flipped over.
 */

import {
  LINE_STYLES,
  SHEET,
  bearing,
  dist,
  lerpPt,
  markPointAt,
  polar,
  rad,
  type Mark,
  type Pt,
} from './drawingGeometry';

export interface SheetRenderOptions {
  /** Pixels per millimetre. */
  scale: number;
  /** Marks already finished, drawn in full. */
  marks: Mark[];
  /** The mark currently under the pencil, and how far along it is. */
  drawing?: { mark: Mark; t: number } | null;
  /** The finished drawing, ghosted underneath as a target to aim at. */
  ghost?: Mark[] | null;
  /** Paints the paper, the tooth and the shadow under the edges. */
  paper?: boolean;
  /** Tints the marks added by the current step so they stand out. */
  highlight?: Mark[] | null;
}

const LETTERING = '"Arial Narrow", "Helvetica Neue", Helvetica, Arial, sans-serif';

/**
 * Lettering is never rendered smaller than this, in pixels.
 *
 * Drawing lettering is 3 to 5 mm high, which on a whole sheet shown small comes
 * out at four or five pixels — a grey blur where a figure should be. The floor
 * costs a little truthfulness at thumbnail size and buys a drawing that can
 * still be read.
 */
const MIN_TEXT_PX = 8;
const textPx = (mm: number, scale: number) => Math.max(MIN_TEXT_PX, mm * scale);

/* ---------------------------------------------------------------- the paper */

function paintPaper(ctx: CanvasRenderingContext2D, scale: number) {
  const w = SHEET.width * scale;
  const h = SHEET.height * scale;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // The faintest cool vignette, only enough to stop the sheet reading as a flat
  // fill. Anything stronger and cartridge paper turns into grey card, which is
  // what it looked like before.
  const glow = ctx.createRadialGradient(w * 0.42, h * 0.34, w * 0.05, w * 0.5, h * 0.5, w * 0.82);
  glow.addColorStop(0, 'rgba(255,255,255,0)');
  glow.addColorStop(1, 'rgba(226,232,240,0.3)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
}

/* ---------------------------------------------------------------- one mark */

/**
 * Stroke width in pixels: the true pencil width, but never so thin that the
 * line disappears when the whole sheet is in view. See `StyleSpec.minPx`.
 */
function strokePx(spec: { width: number; minPx: number }, scale: number) {
  return Math.max(spec.minPx, spec.width * scale);
}

function applyStyle(ctx: CanvasRenderingContext2D, mark: Mark, scale: number, tint?: string) {
  const spec = LINE_STYLES[mark.style ?? 'outline'];
  ctx.strokeStyle = tint ?? spec.colour;
  ctx.lineWidth = strokePx(spec, scale);
  // Where the width had to be floored, the dashes are lengthened by the same
  // factor: a hidden line drawn thicker than its gaps reads as a solid smear.
  const inflated = ctx.lineWidth / Math.max(0.01, spec.width * scale);
  ctx.setLineDash(spec.dash.map((segment) => segment * scale * Math.max(1, inflated)));
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

const P = (p: Pt, scale: number): [number, number] => [p.x * scale, p.y * scale];

/** Anticlockwise-on-the-page degrees → the angle canvas wants (y points down). */
const canvasAngle = (degrees: number) => -rad(degrees);

function strokeArc(
  ctx: CanvasRenderingContext2D,
  centre: Pt,
  r: number,
  from: number,
  to: number,
  scale: number
) {
  ctx.beginPath();
  ctx.arc(
    centre.x * scale,
    centre.y * scale,
    r * scale,
    canvasAngle(from),
    canvasAngle(to),
    to > from // sweeping to a larger protractor angle is anticlockwise on screen
  );
  ctx.stroke();
}

function arrowHead(ctx: CanvasRenderingContext2D, tip: Pt, from: Pt, scale: number) {
  const angle = bearing(from, tip);
  // 2.6 mm, but never less than six pixels, or the arrowheads vanish and the
  // dimension turns into a plain line.
  const size = Math.max(2.6, 6 / scale);
  const left = polar(tip, size, angle + 165);
  const right = polar(tip, size, angle - 165);
  ctx.beginPath();
  ctx.moveTo(...P(tip, scale));
  ctx.lineTo(...P(left, scale));
  ctx.lineTo(...P(right, scale));
  ctx.closePath();
  ctx.fill();
}

function drawText(ctx: CanvasRenderingContext2D, mark: Mark & { kind: 'text' }, t: number, scale: number, tint?: string) {
  const size = textPx(mark.size ?? 3.5, scale);
  const shown = t >= 1 ? mark.text : mark.text.slice(0, Math.ceil(mark.text.length * t));
  if (!shown) return;

  ctx.save();
  ctx.setLineDash([]);
  ctx.font = `${mark.bold ? '700 ' : ''}${size}px ${LETTERING}`;
  ctx.fillStyle = tint ?? mark.colour ?? LINE_STYLES[mark.style ?? 'outline'].colour;
  ctx.textAlign = mark.align ?? 'left';
  ctx.textBaseline = mark.baseline ?? 'alphabetic';
  // Engineering lettering is spaced out and upright; the tracking is what stops
  // it looking like a word processor dropped a caption on the drawing.
  try {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.06}px`;
  } catch {
    /* Safari < 17 has no letterSpacing; the lettering simply sits tighter. */
  }
  ctx.translate(mark.at.x * scale, mark.at.y * scale);
  if (mark.rotate) ctx.rotate(canvasAngle(mark.rotate));
  ctx.fillText(shown, 0, 0);
  ctx.restore();
}

function drawDimension(ctx: CanvasRenderingContext2D, mark: Mark & { kind: 'dim' }, t: number, scale: number) {
  const spec = LINE_STYLES.dimension;
  const offset = mark.offset ?? 0;
  const along = bearing(mark.a, mark.b);
  const outward = along + 90;

  const a = polar(mark.a, offset, outward);
  const b = polar(mark.b, offset, outward);
  const shown = lerpPt(a, b, Math.min(1, t / 0.7));

  ctx.save();
  ctx.strokeStyle = spec.colour;
  ctx.fillStyle = spec.colour;
  ctx.lineWidth = strokePx(spec, scale);
  ctx.setLineDash([]);

  // Projection lines run from just clear of the feature to just past the
  // dimension line, exactly as BS 8888 asks for.
  if (offset !== 0) {
    for (const [foot, head] of [
      [mark.a, a],
      [mark.b, b],
    ] as [Pt, Pt][]) {
      ctx.beginPath();
      ctx.moveTo(...P(polar(foot, 1.5 * Math.sign(offset), outward), scale));
      ctx.lineTo(...P(polar(head, 2 * Math.sign(offset), outward), scale));
      ctx.stroke();
    }
  }

  ctx.beginPath();
  ctx.moveTo(...P(a, scale));
  ctx.lineTo(...P(shown, scale));
  ctx.stroke();

  if (t > 0.7) {
    arrowHead(ctx, a, b, scale);
    arrowHead(ctx, b, a, scale);
  }

  if (t > 0.75) {
    const label = mark.label ?? `${Math.round(dist(mark.a, mark.b))}`;
    const centre = lerpPt(a, b, 0.5);
    const flipped = Math.abs(along) > 90;
    ctx.translate(centre.x * scale, centre.y * scale);
    ctx.rotate(canvasAngle(flipped ? along + 180 : along));
    const size = textPx(3.2, scale);
    ctx.font = `700 ${size}px ${LETTERING}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    // Knock the line out behind the figure so the dimension reads cleanly.
    const width = ctx.measureText(label).width;
    ctx.fillStyle = '#fbfaf6';
    ctx.fillRect(-width / 2 - size * 0.44, -size * 1.44, width + size * 0.88, size * 1.44);
    ctx.fillStyle = spec.colour;
    ctx.fillText(label, 0, -size * 0.34);
  }

  ctx.restore();
}

function drawDot(ctx: CanvasRenderingContext2D, mark: Mark & { kind: 'dot' }, t: number, scale: number, tint?: string) {
  const colour = tint ?? LINE_STYLES[mark.style ?? 'outline'].colour;
  ctx.save();
  ctx.setLineDash([]);
  ctx.strokeStyle = colour;
  ctx.fillStyle = colour;
  ctx.lineWidth = Math.max(1, 0.3 * scale);

  // A pencil point is under a millimetre across; on a sheet shown small that is
  // less than a pixel, so the dot gets the same floor the lettering does.
  const radius = Math.max(1.3, 0.9 * scale);
  ctx.beginPath();
  ctx.arc(mark.at.x * scale, mark.at.y * scale, radius * Math.min(1, t * 2), 0, Math.PI * 2);
  ctx.fill();

  if (mark.label && t > 0.4) {
    const at = polar(mark.at, 5, mark.labelAngle ?? 60);
    ctx.font = `700 ${textPx(3.6, scale)}px ${LETTERING}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mark.label, at.x * scale, at.y * scale);
  }
  ctx.restore();
}

function drawAngle(ctx: CanvasRenderingContext2D, mark: Mark & { kind: 'angle' }, t: number, scale: number) {
  ctx.save();
  applyStyle(ctx, { ...mark, style: mark.style ?? 'dimension' }, scale);

  if (mark.square) {
    // The little box that says "this really is a right angle".
    const side = mark.r;
    const p1 = polar(mark.at, side, mark.from);
    const p3 = polar(mark.at, side, mark.to);
    const p2 = { x: p1.x + (p3.x - mark.at.x), y: p1.y + (p3.y - mark.at.y) };
    ctx.beginPath();
    ctx.moveTo(...P(p1, scale));
    ctx.lineTo(...P(p2, scale));
    ctx.lineTo(...P(p3, scale));
    ctx.stroke();
  } else {
    strokeArc(ctx, mark.at, mark.r, mark.from, mark.from + (mark.to - mark.from) * t, scale);
  }

  if (mark.label && t > 0.6) {
    const at = polar(mark.at, mark.r + 5.5, (mark.from + mark.to) / 2);
    ctx.setLineDash([]);
    ctx.fillStyle = LINE_STYLES.dimension.colour;
    ctx.font = `700 ${textPx(3.2, scale)}px ${LETTERING}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mark.label, at.x * scale, at.y * scale);
  }
  ctx.restore();
}

/** Draws one mark, `t` of the way from untouched to finished. */
export function drawMark(ctx: CanvasRenderingContext2D, mark: Mark, t: number, scale: number, tint?: string) {
  const clamped = Math.min(1, Math.max(0, t));
  if (clamped <= 0) return;

  switch (mark.kind) {
    case 'text':
      drawText(ctx, mark, clamped, scale, tint);
      return;
    case 'dim':
      drawDimension(ctx, mark, clamped, scale);
      return;
    case 'dot':
      drawDot(ctx, mark, clamped, scale, tint);
      return;
    case 'angle':
      drawAngle(ctx, mark, clamped, scale);
      return;
    default:
      break;
  }

  ctx.save();
  applyStyle(ctx, mark, scale, tint);

  switch (mark.kind) {
    case 'line': {
      const end = lerpPt(mark.a, mark.b, clamped);
      ctx.beginPath();
      ctx.moveTo(...P(mark.a, scale));
      ctx.lineTo(...P(end, scale));
      ctx.stroke();
      break;
    }
    case 'poly': {
      const points = mark.close && mark.points.length > 2 ? [...mark.points, mark.points[0]] : mark.points;
      const spans = points.slice(1).map((point, index) => dist(points[index], point));
      const total = spans.reduce((sum, span) => sum + span, 0) || 1;
      let remaining = clamped * total;

      ctx.beginPath();
      ctx.moveTo(...P(points[0], scale));
      for (let i = 0; i < spans.length && remaining > 0; i += 1) {
        const fraction = Math.min(1, spans[i] === 0 ? 1 : remaining / spans[i]);
        ctx.lineTo(...P(lerpPt(points[i], points[i + 1], fraction), scale));
        remaining -= spans[i];
      }
      ctx.stroke();
      break;
    }
    case 'circle':
      // The compass swings clockwise from the top, so a part-drawn circle looks
      // like a hand turning the knurled head rather than a shape fading in.
      strokeArc(ctx, mark.c, mark.r, 90, 90 - 360 * clamped, scale);
      break;
    case 'arc':
      strokeArc(ctx, mark.c, mark.r, mark.from, mark.from + (mark.to - mark.from) * clamped, scale);
      break;
    default:
      break;
  }

  ctx.restore();
}

/* ------------------------------------------------------------- whole sheet */

export function renderSheet(ctx: CanvasRenderingContext2D, options: SheetRenderOptions) {
  const { scale, marks, drawing, ghost, paper = true, highlight } = options;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, SHEET.width * scale, SHEET.height * scale);
  if (paper) paintPaper(ctx, scale);

  if (ghost && ghost.length > 0) {
    ctx.save();
    ctx.globalAlpha = 0.16;
    for (const mark of ghost) drawMark(ctx, mark, 1, scale);
    ctx.restore();
  }

  const highlighted = highlight ? new Set(highlight) : null;
  for (const mark of marks) {
    drawMark(ctx, mark, 1, scale, highlighted?.has(mark) ? tintFor(mark) : undefined);
  }

  if (drawing && drawing.t > 0) {
    drawMark(ctx, drawing.mark, drawing.t, scale, tintFor(drawing.mark));
  }
}

/**
 * Fresh pencil work is warmed towards the accent so the learner can see what
 * this step put on the sheet. Construction lines keep their own pale blue —
 * highlighting them would defeat the point of them being faint.
 */
function tintFor(mark: Mark): string | undefined {
  if (mark.style === 'construction') return '#5f7fae';
  if (mark.style === 'dimension' || mark.kind === 'dim') return undefined;
  return '#b45309';
}

/** Where the pencil tip should sit for a part-drawn mark. */
export function pencilPoint(mark: Mark, t: number): Pt {
  return markPointAt(mark, t);
}
