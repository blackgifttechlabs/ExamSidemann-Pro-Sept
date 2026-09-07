"use client";

import type { ReactNode } from "react";

/**
 * A compact results plot for the experiment rails.
 *
 * Usually one measured quantity against one control variable, in which case the
 * caption names the series and no legend is needed. Passing `comparison` adds a
 * second series (a control run) and a legend, so identity is never carried by
 * colour alone. Axes and grid stay recessive; only the data marks are coloured,
 * and all text uses the slate ink scale rather than a series colour.
 */

/** Neutral ink for the control series — clearly separable from every accent. */
const COMPARISON_HEX = "#94a3b8";

export interface GraphPoint {
  x: number;
  y: number;
  /** Marks a point the learner has not measured yet (drawn hollow). */
  pending?: boolean;
  label?: string;
}

export function ExperimentResultsGraph({
  points,
  xLabel,
  yLabel,
  accentHex,
  caption,
  xMin,
  xMax,
  yMax,
  yMin = 0,
  joinPoints = true,
  width = 250,
  height = 168,
  footer,
  seriesLabel,
  comparison,
  comparisonLabel,
}: {
  points: GraphPoint[];
  xLabel: string;
  yLabel: string;
  accentHex: string;
  caption: string;
  xMin?: number;
  xMax?: number;
  yMax?: number;
  /** Lift the y-axis baseline — useful for temperatures that start well above 0. */
  yMin?: number;
  /** Join measured points with a smooth-ish line (false for a scatter only). */
  joinPoints?: boolean;
  width?: number;
  height?: number;
  footer?: ReactNode;
  /** Names the main series in the legend; only needed alongside `comparison`. */
  seriesLabel?: string;
  /** An optional second series, drawn in neutral ink as the control run. */
  comparison?: GraphPoint[];
  comparisonLabel?: string;
}) {
  const padLeft = 30;
  const padBottom = 26;
  const padTop = 8;
  const padRight = 8;

  const measured = points.filter((point) => !point.pending);
  const comparisonMeasured = (comparison ?? []).filter((point) => !point.pending);
  const allPoints = [...points, ...(comparison ?? [])];

  const domainMinX = xMin ?? Math.min(0, ...allPoints.map((point) => point.x));
  const domainMaxX = xMax ?? Math.max(1, ...allPoints.map((point) => point.x));
  const domainMaxY = yMax ?? Math.max(1, ...allPoints.map((point) => point.y)) * 1.15;

  const spanX = domainMaxX - domainMinX || 1;
  const spanY = domainMaxY - yMin || 1;
  const plotWidth = width - padLeft - padRight;
  const plotHeight = height - padTop - padBottom;

  const toPx = (x: number, y: number) => ({
    px: padLeft + ((x - domainMinX) / spanX) * plotWidth,
    py: padTop + plotHeight - ((y - yMin) / spanY) * plotHeight,
  });

  const pathFor = (series: GraphPoint[]) =>
    series
      .slice()
      .sort((a, b) => a.x - b.x)
      .map((point) => {
        const { px, py } = toPx(point.x, point.y);
        return `${px.toFixed(1)},${py.toFixed(1)}`;
      })
      .join(" ");

  const measuredPath = pathFor(measured);
  const comparisonPath = pathFor(comparisonMeasured);

  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="mb-1 text-[10px] font-black uppercase tracking-wide text-slate-300">{caption}</div>
      <svg width={width} height={height} role="img" aria-label={caption} className="overflow-visible">
        {/* Recessive grid */}
        {gridLines.map((fraction) => (
          <line
            key={fraction}
            x1={padLeft}
            y1={padTop + plotHeight - fraction * plotHeight}
            x2={width - padRight}
            y2={padTop + plotHeight - fraction * plotHeight}
            stroke="#1e293b"
            strokeWidth={1}
          />
        ))}

        {/* Axes */}
        <line x1={padLeft} y1={padTop + plotHeight} x2={width - padRight} y2={padTop + plotHeight} stroke="#475569" strokeWidth={1} />
        <line x1={padLeft} y1={padTop} x2={padLeft} y2={padTop + plotHeight} stroke="#475569" strokeWidth={1} />

        {/* A zero line, when the scale spans negative values — the crossing point matters */}
        {yMin < 0 && domainMaxY > 0 && (
          <>
            <line
              x1={padLeft}
              y1={toPx(domainMinX, 0).py}
              x2={width - padRight}
              y2={toPx(domainMinX, 0).py}
              stroke="#64748b"
              strokeWidth={1}
            />
            <text x={padLeft - 4} y={toPx(domainMinX, 0).py + 3} fill="#64748b" fontSize={8} textAnchor="end">
              0
            </text>
          </>
        )}

        {/* Axis labels */}
        <text x={padLeft + plotWidth / 2} y={height - 2} fill="#94a3b8" fontSize={9} textAnchor="middle">
          {xLabel}
        </text>
        <text
          x={9}
          y={padTop + plotHeight / 2}
          fill="#94a3b8"
          fontSize={9}
          textAnchor="middle"
          transform={`rotate(-90 9 ${padTop + plotHeight / 2})`}
        >
          {yLabel}
        </text>

        {/* Scale ticks */}
        <text x={padLeft - 4} y={padTop + plotHeight + 3} fill="#64748b" fontSize={8} textAnchor="end">
          {yMin >= 10 ? Math.round(yMin) : yMin}
        </text>
        <text x={padLeft - 4} y={padTop + 6} fill="#64748b" fontSize={8} textAnchor="end">
          {domainMaxY >= 10 ? Math.round(domainMaxY) : domainMaxY.toFixed(1)}
        </text>
        <text x={padLeft} y={height - 14} fill="#64748b" fontSize={8} textAnchor="middle">
          {domainMinX}
        </text>
        <text x={width - padRight} y={height - 14} fill="#64748b" fontSize={8} textAnchor="middle">
          {domainMaxX}
        </text>

        {/* Control series first, so the main series reads on top of it. */}
        {joinPoints && comparisonMeasured.length >= 2 && (
          <polyline
            points={comparisonPath}
            fill="none"
            stroke={COMPARISON_HEX}
            strokeWidth={2}
            strokeDasharray="5 3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {comparisonMeasured.map((point, index) => {
          const { px, py } = toPx(point.x, point.y);
          return <circle key={`c-${index}`} cx={px} cy={py} r={3.5} fill={COMPARISON_HEX} stroke="#0b0f22" strokeWidth={2} />;
        })}

        {joinPoints && measured.length >= 2 && (
          <polyline points={measuredPath} fill="none" stroke={accentHex} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        )}

        {points.map((point, index) => {
          const { px, py } = toPx(point.x, point.y);
          if (point.pending) {
            return <circle key={index} cx={px} cy={padTop + plotHeight} r={2.5} fill="#334155" />;
          }
          return (
            <circle
              key={index}
              cx={px}
              cy={py}
              r={4}
              fill={accentHex}
              // 2px surface ring keeps overlapping marks readable
              stroke="#0b0f22"
              strokeWidth={2}
            />
          );
        })}
      </svg>

      {/* Legend — present whenever there are two series, so colour is never the only cue. */}
      {comparison && (
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-semibold text-slate-300">
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3.5 rounded-full" style={{ background: accentHex }} />
            {seriesLabel ?? "Test"}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-0.5 w-3.5 rounded-full border-t border-dashed" style={{ background: COMPARISON_HEX }} />
            {comparisonLabel ?? "Control"}
          </span>
        </div>
      )}

      {footer && <div className="mt-1 text-[10px] leading-snug text-slate-300">{footer}</div>}
    </div>
  );
}
