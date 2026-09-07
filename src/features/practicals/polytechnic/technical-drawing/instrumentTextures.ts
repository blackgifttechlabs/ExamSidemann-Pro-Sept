/**
 * The printed faces of the drawing instruments.
 *
 * A ruler without graduations is just a stick, and a set square without a
 * protractor is just a triangle — you cannot teach "measure sixty-five" on
 * either. So every instrument gets a real printed face: millimetre ticks,
 * centimetre numbers, and degree scales, drawn into a canvas and mapped onto a
 * thin decal sitting a fraction of a millimetre above the plastic.
 *
 * Decals rather than a texture on the body itself, because the bodies are
 * translucent acrylic: a single map would have to carry both the tint and the
 * markings, and the tick marks would go see-through with the plastic.
 */

import * as THREE from 'three';

/** Canvas pixels per millimetre. Enough that a 2.5 mm figure survives a zoom. */
const PX = 6;

const INK = '#1e293b';
const INK_SOFT = '#64748b';
const RED = '#b91c1c';

function makeCanvas(widthMm: number, heightMm: number) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(widthMm * PX));
  canvas.height = Math.max(1, Math.round(heightMm * PX));
  const ctx = canvas.getContext('2d');
  return { canvas, ctx };
}

function finish(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

const font = (sizeMm: number, weight = '700') =>
  `${weight} ${sizeMm * PX}px "Arial Narrow", "Helvetica Neue", Helvetica, Arial, sans-serif`;

/* ---------------------------------------------------------------- edge scale */

interface EdgeScaleOptions {
  /** Length of the graduated run, in mm. */
  lengthMm: number;
  /** Height of the strip the scale is printed on, in mm. */
  heightMm: number;
  /** Where zero sits along the strip, in mm from the left. */
  originMm?: number;
  /** Ticks hang down from the top edge when `down`, otherwise up from the bottom. */
  direction?: 'down' | 'up';
  /** Print the numbers as centimetres (1, 2, 3…) rather than millimetres. */
  unit?: 'cm' | 'mm';
}

/**
 * Draws a millimetre scale along one edge: a short tick every millimetre, a
 * medium one every five, and a long numbered one every ten. That is exactly how
 * a real rule is divided, and it is what lets the narration say "measure sixty
 * five" and have the learner count it off on screen.
 */
function drawEdgeScale(ctx: CanvasRenderingContext2D, options: EdgeScaleOptions) {
  const { lengthMm, heightMm, originMm = 0, direction = 'down', unit = 'cm' } = options;
  const top = direction === 'down' ? 0 : heightMm;
  const sign = direction === 'down' ? 1 : -1;

  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineCap = 'butt';

  for (let mm = 0; originMm + mm <= lengthMm; mm += 1) {
    const x = (originMm + mm) * PX;
    const major = mm % 10 === 0;
    const medium = mm % 5 === 0;
    const tick = major ? 4.2 : medium ? 2.8 : 1.6;

    ctx.lineWidth = major ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(x, top * PX);
    ctx.lineTo(x, (top + sign * tick) * PX);
    ctx.stroke();

    if (major && mm > 0) {
      ctx.font = font(2.6);
      ctx.textAlign = 'center';
      ctx.textBaseline = direction === 'down' ? 'top' : 'bottom';
      ctx.fillText(String(unit === 'cm' ? mm / 10 : mm), x, (top + sign * (tick + 0.8)) * PX);
    }
  }

  // The zero mark is red on most rules, and it is the one students lose.
  ctx.strokeStyle = RED;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(originMm * PX, top * PX);
  ctx.lineTo(originMm * PX, (top + sign * 5) * PX);
  ctx.stroke();
  ctx.fillStyle = RED;
  ctx.font = font(2.8);
  ctx.textAlign = 'left';
  ctx.textBaseline = direction === 'down' ? 'top' : 'bottom';
  ctx.fillText('0', originMm * PX + 2, (top + sign * 5.6) * PX);
}

/* ------------------------------------------------------------- the T-square */

/**
 * The blade face: a millimetre scale down the working edge, plus the maker's
 * marking a real blade carries.
 */
export function tSquareFace(lengthMm: number, heightMm: number): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(lengthMm, heightMm);
  if (!ctx) return finish(canvas);

  // Milky acrylic body with a clear strip along the drawing edge.
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(226,240,252,0.75)';
  ctx.fillRect(0, 0, canvas.width, 7 * PX);

  ctx.strokeStyle = 'rgba(30,41,59,0.35)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, 7 * PX);
  ctx.lineTo(canvas.width, 7 * PX);
  ctx.stroke();

  drawEdgeScale(ctx, { lengthMm, heightMm, originMm: 60, direction: 'down' });

  ctx.fillStyle = INK_SOFT;
  ctx.font = font(3.4, '800');
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('T-SQUARE  ·  600 mm', 70 * PX, heightMm * 0.74 * PX);

  return finish(canvas);
}

/* ---------------------------------------------------------- the set squares */

/**
 * A set square face: a scale along each of the two straight edges and a
 * protractor arc about the right angle, so an angle can actually be read off
 * the instrument the way it is in the workshop.
 */
export function setSquareFace(runMm: number, riseMm: number, tint: string): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(runMm, riseMm);
  if (!ctx) return finish(canvas);

  // Canvas y grows down; the shape has its right angle at the bottom-left, so
  // flip once here and every measurement below reads like the drawing.
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);

  const outline = () => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(runMm * PX, 0);
    ctx.lineTo(0, riseMm * PX);
    ctx.closePath();
  };

  outline();
  ctx.fillStyle = tint;
  ctx.fill();
  ctx.strokeStyle = 'rgba(30,41,59,0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Everything printed from here on is clipped to the triangle. A graduation
  // hanging off the edge of a set square is not a graduation — you cannot lay
  // it against anything, and it makes the instrument look like a decal.
  ctx.save();
  outline();
  ctx.clip();

  /**
   * How much room is left between the two straight edges at a given height, so
   * a figure is only printed where it fits inside the plastic. The hypotenuse
   * runs from (run, 0) to (0, rise), so the width at height y is
   * run · (1 − y / rise).
   */
  const widthAt = (mm: number) => runMm * (1 - mm / riseMm);
  const heightAt = (mm: number) => riseMm * (1 - mm / runMm);
  /** Figures need this much clear plastic beyond the tick to be readable. */
  const FIGURE_ROOM = 9;

  // Scale along the bottom edge, printed inside the instrument.
  ctx.save();
  ctx.scale(1, -1);
  for (let mm = 0; mm <= runMm - 6; mm += 1) {
    const x = (mm + 4) * PX;
    const major = mm % 10 === 0;
    const tick = major ? 4 : mm % 5 === 0 ? 2.6 : 1.5;
    ctx.strokeStyle = INK;
    ctx.lineWidth = major ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(x, -1.6 * PX);
    ctx.lineTo(x, (-1.6 - tick) * PX);
    ctx.stroke();
    if (major && mm > 0 && heightAt(mm + 4) > tick + FIGURE_ROOM) {
      ctx.fillStyle = INK;
      ctx.font = font(2.4);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(String(mm / 10), x, (-1.6 - tick - 1) * PX);
    }
  }
  ctx.restore();

  // Scale up the upright edge.
  for (let mm = 0; mm <= riseMm - 6; mm += 1) {
    const y = (mm + 4) * PX;
    const major = mm % 10 === 0;
    const tick = major ? 4 : mm % 5 === 0 ? 2.6 : 1.5;
    ctx.strokeStyle = INK;
    ctx.lineWidth = major ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(1.6 * PX, y);
    ctx.lineTo((1.6 + tick) * PX, y);
    ctx.stroke();
    if (major && mm > 0 && widthAt(mm + 4) > tick + FIGURE_ROOM) {
      ctx.save();
      ctx.translate((1.6 + tick + 1.4) * PX, y);
      ctx.scale(1, -1);
      ctx.fillStyle = INK;
      ctx.font = font(2.4);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(mm / 10), 0, 0);
      ctx.restore();
    }
  }

  // Protractor about the right angle — 0° along the bottom edge to 90° up. The
  // radius is taken from the perpendicular distance to the hypotenuse, so the
  // whole scale sits on the plastic however long the two legs are.
  const toHypotenuse = (runMm * riseMm) / Math.hypot(runMm, riseMm);
  const protractor = Math.min(Math.min(runMm, riseMm) * 0.52, toHypotenuse - 6);
  ctx.strokeStyle = 'rgba(30,41,59,0.75)';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, protractor * PX, 0, Math.PI / 2);
  ctx.stroke();

  for (let degrees = 0; degrees <= 90; degrees += 5) {
    const angle = (degrees * Math.PI) / 180;
    const major = degrees % 15 === 0;
    const inner = protractor - (major ? 4.4 : 2.2);
    ctx.strokeStyle = major ? INK : INK_SOFT;
    ctx.lineWidth = major ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner * PX, Math.sin(angle) * inner * PX);
    ctx.lineTo(Math.cos(angle) * protractor * PX, Math.sin(angle) * protractor * PX);
    ctx.stroke();

    if (major) {
      const labelRadius = protractor - 8.5;
      ctx.save();
      ctx.translate(Math.cos(angle) * labelRadius * PX, Math.sin(angle) * labelRadius * PX);
      ctx.scale(1, -1);
      ctx.fillStyle = degrees === 30 || degrees === 45 || degrees === 60 ? RED : INK;
      ctx.font = font(2.6);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(degrees), 0, 0);
      ctx.restore();
    }
  }

  ctx.restore(); // release the triangle clip
  return finish(canvas);
}

/* ------------------------------------------------------------- the board rail */

/**
 * The scale printed into the board's own frame, along the top and down the
 * left, which is what you square the paper against before taping it down.
 */
export function boardRailFace(lengthMm: number, widthMm: number, vertical = false): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(vertical ? widthMm : lengthMm, vertical ? lengthMm : widthMm);
  if (!ctx) return finish(canvas);

  ctx.fillStyle = '#eef2f7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (vertical) {
    ctx.translate(canvas.width, 0);
    ctx.rotate(Math.PI / 2);
  }

  drawEdgeScale(ctx, { lengthMm, heightMm: widthMm, originMm: 10, direction: 'down', unit: 'cm' });

  return finish(canvas);
}
