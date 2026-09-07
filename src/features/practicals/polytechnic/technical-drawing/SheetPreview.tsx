'use client';

import { useEffect, useRef } from 'react';
import { SHEET, type Mark } from './drawingGeometry';
import { renderSheet } from './drawingRender';

/**
 * A flat A3 sheet drawn into a canvas — the same renderer the 3D board uses, so
 * the thumbnail on the topic card and the "this is what you will draw" preview
 * are pixel-for-pixel the drawing the lesson ends on.
 *
 * It redraws on resize rather than scaling a bitmap up, which matters here:
 * 0.18 mm construction lines vanish the moment a canvas is stretched.
 */
export function SheetPreview({
  marks,
  className = '',
  /** Caps the backing resolution so a wall of thumbnails stays cheap. */
  maxWidth = 1400,
  label,
}: {
  marks: Mark[];
  className?: string;
  maxWidth?: number;
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const paint = () => {
      const width = Math.min(maxWidth, Math.max(1, canvas.clientWidth) * Math.min(2, window.devicePixelRatio || 1));
      const scale = width / SHEET.width;
      const height = Math.round(SHEET.height * scale);
      if (canvas.width !== Math.round(width) || canvas.height !== height) {
        canvas.width = Math.round(width);
        canvas.height = height;
      }
      const ctx = canvas.getContext('2d');
      if (ctx) renderSheet(ctx, { scale, marks, paper: true });
    };

    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [marks, maxWidth]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="block h-auto w-full"
        style={{ aspectRatio: `${SHEET.width} / ${SHEET.height}` }}
        role="img"
        aria-label={label ?? 'Finished technical drawing'}
      />
    </div>
  );
}
