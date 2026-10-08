import React, { type ReactNode } from 'react';

/*
 * SVG diagrams for the graph lessons (gradient, speed-time, curves).
 * All of them are drawn from the real numbers used in the worked examples,
 * so what is drawn is exactly what is calculated.
 */

export const INK = '#0f172a';
export const MUTED = '#64748b';
export const GRID = '#e2e8f0';
export const AXIS = '#334155';
export const VIOLET = '#7c3aed';
export const TEAL = '#0d9488';
export const AMBER = '#f59e0b';
export const RED = '#dc2626';
export const GREEN = '#16a34a';
export const BLUE = '#2563eb';

export const Svg = ({ viewBox, label, minWidth = 440, maxWidth = 680, children }: { viewBox: string; label: string; minWidth?: number; maxWidth?: number; children: ReactNode }) => (
  <svg viewBox={viewBox} role="img" aria-label={label} style={{ display: 'block', margin: '0 auto', width: '100%', minWidth, maxWidth, height: 'auto' }}>
    {children}
  </svg>
);

export const Halo = ({ children, ...props }: React.SVGProps<SVGTextElement>) => (
  <text {...props} stroke="#fff" strokeWidth={4} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);

export type Scale = (v: number) => number;
type PlotProps = {
  width?: number;
  height?: number;
  xmin: number; xmax: number; ymin: number; ymax: number;
  xticks: number[]; yticks: number[];
  xlabel: string; ylabel: string;
  pad?: { l: number; r: number; t: number; b: number };
  label: string;
  minWidth?: number;
  children: (sx: Scale, sy: Scale) => ReactNode;
};

// Axes with a light grid, tick numbers, arrow heads and axis titles.
export const Plot = ({ width = 640, height = 340, xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel, pad = { l: 64, r: 28, t: 30, b: 52 }, label, minWidth, children }: PlotProps) => {
  const pw = width - pad.l - pad.r;
  const ph = height - pad.t - pad.b;
  const sx: Scale = (v) => pad.l + ((v - xmin) / (xmax - xmin)) * pw;
  const sy: Scale = (v) => pad.t + ph - ((v - ymin) / (ymax - ymin)) * ph;
  const x0 = Math.min(Math.max(0, xmin), xmax);
  const y0 = Math.min(Math.max(0, ymin), ymax);
  return (
    <Svg viewBox={`0 0 ${width} ${height}`} label={label} minWidth={minWidth}>
      <rect x={pad.l} y={pad.t} width={pw} height={ph} fill="#fff" />
      {xticks.map((t) => <line key={`gx${t}`} x1={sx(t)} y1={pad.t} x2={sx(t)} y2={pad.t + ph} stroke={GRID} strokeWidth={1.2} />)}
      {yticks.map((t) => <line key={`gy${t}`} x1={pad.l} y1={sy(t)} x2={pad.l + pw} y2={sy(t)} stroke={GRID} strokeWidth={1.2} />)}
      {xticks.filter((t) => t !== 0).map((t) => <text key={`tx${t}`} x={sx(t)} y={sy(y0) + 18} textAnchor="middle" fontSize={13} fontWeight={600} fill={MUTED} stroke="#fff" strokeWidth={3} paintOrder="stroke">{t}</text>)}
      {yticks.filter((t) => t !== 0 || (ymin < 0 && xmin >= 0)).map((t) => <text key={`ty${t}`} x={sx(x0) - 8} y={sy(t) + 4.5} textAnchor="end" fontSize={13} fontWeight={600} fill={MUTED} stroke="#fff" strokeWidth={3} paintOrder="stroke">{t}</text>)}
      {xmin <= 0 && ymin <= 0 && !yticks.includes(0) && <text x={sx(0) - 8} y={sy(0) + 17} textAnchor="end" fontSize={13} fontWeight={600} fill={MUTED}>0</text>}
      <line x1={sx(xmin)} y1={sy(y0)} x2={sx(xmax) + 8} y2={sy(y0)} stroke={AXIS} strokeWidth={2} />
      <line x1={sx(x0)} y1={sy(ymin)} x2={sx(x0)} y2={sy(ymax) - 8} stroke={AXIS} strokeWidth={2} />
      <path d={`M ${sx(xmax) + 12} ${sy(y0)} l -8 -4.5 v 9 z`} fill={AXIS} />
      <path d={`M ${sx(x0)} ${sy(ymax) - 12} l -4.5 8 h 9 z`} fill={AXIS} />
      <text x={pad.l + pw / 2} y={height - 10} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>{xlabel}</text>
      <text transform={`translate(16 ${pad.t + ph / 2}) rotate(-90)`} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>{ylabel}</text>
      {children(sx, sy)}
    </Svg>
  );
};

export const Dot = ({ x, y, colour = VIOLET, r = 6 }: { x: number; y: number; colour?: string; r?: number }) => (
  <circle cx={x} cy={y} r={r} fill={colour} stroke="#fff" strokeWidth={2} />
);

const RightAngle = ({ x, y, dx, dy, size = 11 }: { x: number; y: number; dx: 1 | -1; dy: 1 | -1; size?: number }) => (
  <path d={`M ${x + dx * size} ${y} v ${dy * size} h ${-dx * size}`} fill="none" stroke={MUTED} strokeWidth={1.6} />
);

export const curvePath = (f: (v: number) => number, from: number, to: number, sx: Scale, sy: Scale, steps = 80) => {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const v = from + ((to - from) * i) / steps;
    pts.push(`${i === 0 ? 'M' : 'L'} ${sx(v).toFixed(1)} ${sy(f(v)).toFixed(1)}`);
  }
  return pts.join(' ');
};

/* ------------------------------------------------------------------ 1. rise and run */

export const GradTriangle = () => (
  <Plot xmin={0} xmax={7} ymin={0} ymax={5.5} xticks={[1, 2, 3, 4, 5, 6, 7]} yticks={[1, 2, 3, 4, 5]} xlabel="x" ylabel="y" height={330}
    label="A straight line through A(1, 1) and B(5, 4). Run is 4 across, rise is 3 up, so the gradient is 3/4.">
    {(sx, sy) => (
      <>
        <line x1={sx(0.3)} y1={sy(0.475)} x2={sx(6.6)} y2={sy(5.2)} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
        <line x1={sx(1)} y1={sy(1)} x2={sx(5)} y2={sy(1)} stroke={TEAL} strokeWidth={3.5} strokeDasharray="7 5" />
        <line x1={sx(5)} y1={sy(1)} x2={sx(5)} y2={sy(4)} stroke={RED} strokeWidth={3.5} strokeDasharray="7 5" />
        <RightAngle x={sx(5)} y={sy(1)} dx={-1} dy={-1} />
        <Halo x={sx(3)} y={sy(1) + 24} textAnchor="middle" fontSize={16} fontWeight={800} fill={TEAL}>run = 4 (across)</Halo>
        <Halo x={sx(5) + 12} y={sy(2.5) + 5} fontSize={16} fontWeight={800} fill={RED}>rise = 3 (up)</Halo>
        <Dot x={sx(1)} y={sy(1)} />
        <Dot x={sx(5)} y={sy(4)} />
        <Halo x={sx(1) - 10} y={sy(1) - 12} textAnchor="end" fontSize={14} fontWeight={800} fill={INK}>A (1, 1)</Halo>
        <Halo x={sx(5) - 12} y={sy(4) - 12} textAnchor="end" fontSize={14} fontWeight={800} fill={INK}>B (5, 4)</Halo>
        <rect x={sx(0.35)} y={sy(5.2)} width={196} height={52} rx={10} fill="#f5f3ff" stroke={VIOLET} />
        <text x={sx(0.35) + 98} y={sy(5.2) + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>gradient = rise ÷ run</text>
        <text x={sx(0.35) + 98} y={sy(5.2) + 43} textAnchor="middle" fontSize={17} fontWeight={800} fill={VIOLET}>= 3 ÷ 4 = 3/4</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 2. gradient from two points */

export const TwoPointGradient = () => (
  <Plot xmin={0} xmax={9} ymin={0} ymax={13} xticks={[1, 2, 3, 4, 5, 6, 7, 8]} yticks={[2, 4, 6, 8, 10, 12]} xlabel="x" ylabel="y" height={360}
    label="Points P(2, 3) and Q(6, 11). The change in x is 4 and the change in y is 8, so the gradient is 8 divided by 4, which is 2.">
    {(sx, sy) => (
      <>
        <line x1={sx(1)} y1={sy(1)} x2={sx(7.2)} y2={sy(13.4)} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
        <line x1={sx(2)} y1={sy(3)} x2={sx(6)} y2={sy(3)} stroke={TEAL} strokeWidth={3.5} strokeDasharray="7 5" />
        <line x1={sx(6)} y1={sy(3)} x2={sx(6)} y2={sy(11)} stroke={RED} strokeWidth={3.5} strokeDasharray="7 5" />
        <RightAngle x={sx(6)} y={sy(3)} dx={-1} dy={-1} />
        <Halo x={sx(4)} y={sy(3) + 24} textAnchor="middle" fontSize={15} fontWeight={800} fill={TEAL}>x₂ − x₁ = 6 − 2 = 4</Halo>
        <Halo x={sx(6) + 12} y={sy(7) + 5} fontSize={15} fontWeight={800} fill={RED}>y₂ − y₁ = 11 − 3 = 8</Halo>
        <Dot x={sx(2)} y={sy(3)} />
        <Dot x={sx(6)} y={sy(11)} />
        <Halo x={sx(2) - 10} y={sy(3) - 12} textAnchor="end" fontSize={14} fontWeight={800} fill={INK}>P (2, 3)</Halo>
        <Halo x={sx(6) - 12} y={sy(11) - 8} textAnchor="end" fontSize={14} fontWeight={800} fill={INK}>Q (6, 11)</Halo>
        <rect x={sx(6.3)} y={sy(4.4)} width={150} height={44} rx={10} fill="#f5f3ff" stroke={VIOLET} />
        <text x={sx(6.3) + 75} y={sy(4.4) + 28} textAnchor="middle" fontSize={16} fontWeight={800} fill={VIOLET}>m = 8 ÷ 4 = 2</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 3. four kinds of slope */

export const SlopeTypes = () => {
  const panels = [
    { title: 'Positive gradient', note: 'rises to the right', ex: 'e.g. m = 2', colour: GREEN, d: 'M 24 108 L 126 28' },
    { title: 'Negative gradient', note: 'falls to the right', ex: 'e.g. m = −2', colour: RED, d: 'M 24 28 L 126 108' },
    { title: 'Zero gradient', note: 'flat, y = c', ex: 'm = 0', colour: BLUE, d: 'M 24 68 L 126 68' },
    { title: 'No gradient', note: 'vertical, x = a', ex: 'cannot be worked out', colour: AMBER, d: 'M 75 20 L 75 116' },
  ];
  return (
    <Svg viewBox="0 0 640 230" label="Four kinds of line: positive gradient rises, negative gradient falls, zero gradient is flat, and a vertical line has no gradient.">
      {panels.map((p, i) => (
        <g key={p.title} transform={`translate(${12 + i * 157} 8)`}>
          <rect x={0} y={0} width={150} height={134} rx={12} fill="#fff" stroke={GRID} strokeWidth={2} />
          <line x1={14} y1={68} x2={136} y2={68} stroke={GRID} strokeWidth={1.5} />
          <line x1={75} y1={12} x2={75} y2={124} stroke={GRID} strokeWidth={1.5} />
          <path d={p.d} stroke={p.colour} strokeWidth={5} strokeLinecap="round" fill="none" />
          <text x={75} y={160} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>{p.title}</text>
          <text x={75} y={180} textAnchor="middle" fontSize={13} fill={MUTED}>{p.note}</text>
          <text x={75} y={201} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.colour}>{p.ex}</text>
        </g>
      ))}
    </Svg>
  );
};

/* ------------------------------------------------------------------ 4. y = mx + c */

export const LineMxC = () => (
  <Plot xmin={-2.5} xmax={4.5} ymin={-3} ymax={9.5} xticks={[-2, -1, 1, 2, 3, 4]} yticks={[-2, 2, 4, 6, 8]} xlabel="x" ylabel="y" height={360}
    label="The line y = 2x + 1. It cuts the y-axis at (0, 1), so c = 1. Going 1 across means going 2 up, so the gradient m is 2.">
    {(sx, sy) => (
      <>
        <line x1={sx(-2)} y1={sy(-3)} x2={sx(4.2)} y2={sy(9.4)} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
        <line x1={sx(2)} y1={sy(5)} x2={sx(3)} y2={sy(5)} stroke={TEAL} strokeWidth={3.5} strokeDasharray="6 4" />
        <line x1={sx(3)} y1={sy(5)} x2={sx(3)} y2={sy(7)} stroke={RED} strokeWidth={3.5} strokeDasharray="6 4" />
        <Halo x={sx(2.5)} y={sy(5) + 22} textAnchor="middle" fontSize={14} fontWeight={800} fill={TEAL}>1 across</Halo>
        <Halo x={sx(3) + 10} y={sy(6) + 5} fontSize={14} fontWeight={800} fill={RED}>2 up</Halo>
        <Dot x={sx(0)} y={sy(1)} colour={AMBER} r={8} />
        <Halo x={sx(0) - 28} y={sy(1) - 4} textAnchor="end" fontSize={14} fontWeight={800} fill="#b45309">c = 1: cuts the y-axis at (0, 1)</Halo>
        <Halo x={sx(0.3)} y={sy(7.6)} textAnchor="start" fontSize={15} fontWeight={800} fill={VIOLET}>y = 2x + 1</Halo>
        <rect x={sx(-2.3)} y={sy(9.2)} width={200} height={50} rx={10} fill="#f5f3ff" stroke={VIOLET} />
        <text x={sx(-2.3) + 100} y={sy(9.2) + 21} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>y = m x + c</text>
        <text x={sx(-2.3) + 100} y={sy(9.2) + 41} textAnchor="middle" fontSize={14} fontWeight={800} fill={VIOLET}>m = 2 (gradient), c = 1</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 5. intercept method */

export const InterceptMethod = () => (
  <Plot xmin={-1.5} xmax={4.5} ymin={-1.5} ymax={4.8} xticks={[-1, 1, 2, 3, 4]} yticks={[-1, 1, 2, 3, 4]} xlabel="x" ylabel="y" height={340}
    label="The line 3x + 2y = 6 crosses the y-axis at (0, 3) and the x-axis at (2, 0).">
    {(sx, sy) => (
      <>
        <line x1={sx(-0.9)} y1={sy(4.35)} x2={sx(3.6)} y2={sy(-0.9)} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
        <Dot x={sx(0)} y={sy(3)} colour={AMBER} r={8} />
        <Dot x={sx(2)} y={sy(0)} colour={TEAL} r={8} />
        <Halo x={sx(0) + 14} y={sy(3) - 16} fontSize={14} fontWeight={800} fill="#b45309">(0, 3): put x = 0, then 2y = 6</Halo>
        <Halo x={sx(0) + 14} y={sy(-1.05)} fontSize={14} fontWeight={800} fill={TEAL}>(2, 0): put y = 0, then 3x = 6</Halo>
        <Halo x={sx(2.7)} y={sy(1.6)} fontSize={15} fontWeight={800} fill={VIOLET}>3x + 2y = 6</Halo>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 6. parallel lines (Nov 2021 Q23) */

export const ParallelLines = () => (
  <Plot xmin={-2.5} xmax={3.5} ymin={-4} ymax={5.5} xticks={[-2, -1, 1, 2, 3]} yticks={[-3, -2, -1, 1, 2, 3, 4, 5]} xlabel="x" ylabel="y" height={360}
    label="The line y = 2x through the origin and (1, 2), and the parallel line y = 2x − 1 through (0, −1). Both have gradient 2.">
    {(sx, sy) => (
      <>
        <line x1={sx(-1.9)} y1={sy(-3.8)} x2={sx(2.7)} y2={sy(5.4)} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
        <line x1={sx(-1.3)} y1={sy(-3.6)} x2={sx(3.1)} y2={sy(5.2)} stroke={TEAL} strokeWidth={4} strokeLinecap="round" />
        <Dot x={sx(0)} y={sy(0)} />
        <Dot x={sx(1)} y={sy(2)} />
        <Dot x={sx(0)} y={sy(-1)} colour={TEAL} />
        <Halo x={sx(1) - 12} y={sy(2) - 12} textAnchor="end" fontSize={14} fontWeight={800} fill={VIOLET}>(1, 2)</Halo>
        <Halo x={sx(0) - 10} y={sy(0) - 10} textAnchor="end" fontSize={14} fontWeight={800} fill={INK}>(0, 0)</Halo>
        <Halo x={sx(0) + 12} y={sy(-1) + 20} fontSize={14} fontWeight={800} fill={TEAL}>(0, −1)</Halo>
        <Halo x={sx(-1.55)} y={sy(-2.4)} textAnchor="end" fontSize={15} fontWeight={800} fill={VIOLET}>y = 2x</Halo>
        <Halo x={sx(1.2)} y={sy(0.35)} textAnchor="start" fontSize={15} fontWeight={800} fill={TEAL}>y = 2x − 1</Halo>
        <rect x={sx(-2.4)} y={sy(5.3)} width={218} height={52} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
        <text x={sx(-2.4) + 109} y={sy(5.3) + 22} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>Parallel lines have</text>
        <text x={sx(-2.4) + 109} y={sy(5.3) + 42} textAnchor="middle" fontSize={14} fontWeight={800} fill={VIOLET}>the same gradient: 2</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 7. tangents on h = 10 + 25t - 5t^2 (Nov 2020 Q8) */

export const TangentsOnCurve = () => {
  const f = (t: number) => 10 + 25 * t - 5 * t * t;
  const tangent = (sx: Scale, sy: Scale, t0: number, half: number, colour: string) => {
    const m = 25 - 10 * t0;
    return <line x1={sx(t0 - half)} y1={sy(f(t0) - m * half)} x2={sx(t0 + half)} y2={sy(f(t0) + m * half)} stroke={colour} strokeWidth={3.5} strokeLinecap="round" />;
  };
  return (
    <Plot xmin={0} xmax={6.6} ymin={-25} ymax={50} xticks={[1, 2, 3, 4, 5, 6]} yticks={[-20, 0, 10, 20, 30, 40]} xlabel="t (seconds)" ylabel="h (metres)" height={400}
      label="The curve h = 10 + 25t − 5t². At t = 1 the tangent rises with gradient 15. At t = 2.5 the tangent is flat, gradient 0, at the greatest height of 41.25 m. At t = 5 the tangent falls with gradient −25.">
      {(sx, sy) => (
        <>
          <path d={curvePath(f, 0, 6, sx, sy)} fill="none" stroke={INK} strokeWidth={3.5} />
          {tangent(sx, sy, 1, 0.9, GREEN)}
          {tangent(sx, sy, 2.5, 1.0, BLUE)}
          {tangent(sx, sy, 5, 0.55, RED)}
          <Dot x={sx(1)} y={sy(30)} colour={GREEN} />
          <Dot x={sx(2.5)} y={sy(41.25)} colour={BLUE} />
          <Dot x={sx(5)} y={sy(10)} colour={RED} />
          <Halo x={sx(0.1)} y={sy(30) - 22} fontSize={13} fontWeight={800} fill={GREEN}>t = 1: gradient +15</Halo>
          <Halo x={sx(0.1)} y={sy(30) - 6} fontSize={12} fill={MUTED}>going up</Halo>
          <Halo x={sx(2.5)} y={sy(41.25) - 14} textAnchor="middle" fontSize={13} fontWeight={800} fill={BLUE}>t = 2.5: gradient 0 (top)</Halo>
          <Halo x={sx(5) + 12} y={sy(10) - 12} fontSize={13} fontWeight={800} fill={RED}>t = 5: gradient −25</Halo>
          <Halo x={sx(5) + 12} y={sy(10) + 4} fontSize={12} fill={MUTED}>coming down</Halo>
        </>
      )}
    </Plot>
  );
};

/* ------------------------------------------------------------------ 8. tangent to y = 12/x at x = 3 (Nov 2025 Q9) */

export const TangentInverse = () => (
  <Plot xmin={0} xmax={7} ymin={0} ymax={14} xticks={[1, 2, 3, 4, 5, 6]} yticks={[2, 4, 6, 8, 10, 12]} xlabel="x" ylabel="y" height={360}
    label="The curve y = 12/x with the tangent at x = 3, the point (3, 4). The tangent falls 4 units for every 3 units across, so its gradient is −4/3.">
    {(sx, sy) => (
      <>
        <path d={curvePath((x) => 12 / x, 0.9, 6.8, sx, sy)} fill="none" stroke={INK} strokeWidth={3.5} />
        <line x1={sx(1)} y1={sy(8 - 4 / 3)} x2={sx(6)} y2={sy(0)} stroke={VIOLET} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={sx(1.5)} y1={sy(6)} x2={sx(4.5)} y2={sy(6)} stroke={TEAL} strokeWidth={3} strokeDasharray="6 4" />
        <line x1={sx(4.5)} y1={sy(6)} x2={sx(4.5)} y2={sy(2)} stroke={RED} strokeWidth={3} strokeDasharray="6 4" />
        <Dot x={sx(1.5)} y={sy(6)} colour={VIOLET} r={5} />
        <Dot x={sx(4.5)} y={sy(2)} colour={VIOLET} r={5} />
        <Dot x={sx(3)} y={sy(4)} colour={AMBER} r={8} />
        <Halo x={sx(3) + 12} y={sy(4) - 14} fontSize={14} fontWeight={800} fill="#b45309">(3, 4)</Halo>
        <Halo x={sx(3)} y={sy(6) - 10} textAnchor="middle" fontSize={14} fontWeight={800} fill={TEAL}>across 3</Halo>
        <Halo x={sx(4.5) + 10} y={sy(4) + 5} fontSize={14} fontWeight={800} fill={RED}>down 4</Halo>
        <rect x={sx(4.4)} y={sy(12.9)} width={210} height={64} rx={10} fill="#f5f3ff" stroke={VIOLET} />
        <text x={sx(4.4) + 105} y={sy(12.9) + 24} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>gradient of the tangent</text>
        <text x={sx(4.4) + 105} y={sy(12.9) + 49} textAnchor="middle" fontSize={17} fontWeight={800} fill={VIOLET}>= −4 ÷ 3 = −4/3</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 9. speed-time: Nov 2023 Q19 */

export const SpeedTimeN23 = () => (
  <Plot xmin={0} xmax={11} ymin={0} ymax={34} xticks={[0, 3, 7, 10]} yticks={[0, 10, 20, 30]} xlabel="Time (s)" ylabel="Speed (m/s)" height={370}
    label="Speed-time graph: 20 m/s for the first 3 seconds, then speeding up to 30 m/s at 7 seconds, then slowing to rest at 10 seconds. Areas: 60, 100 and 45.">
    {(sx, sy) => (
      <>
        <path d={`M ${sx(0)} ${sy(0)} L ${sx(0)} ${sy(20)} L ${sx(3)} ${sy(20)} L ${sx(3)} ${sy(0)} Z`} fill={AMBER} fillOpacity={0.3} />
        <path d={`M ${sx(3)} ${sy(0)} L ${sx(3)} ${sy(20)} L ${sx(7)} ${sy(30)} L ${sx(7)} ${sy(0)} Z`} fill={TEAL} fillOpacity={0.25} />
        <path d={`M ${sx(7)} ${sy(0)} L ${sx(7)} ${sy(30)} L ${sx(10)} ${sy(0)} Z`} fill={VIOLET} fillOpacity={0.22} />
        {[3, 7].map((t) => <line key={t} x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(t === 3 ? 20 : 30)} stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 4" />)}
        <path d={`M ${sx(0)} ${sy(20)} L ${sx(3)} ${sy(20)} L ${sx(7)} ${sy(30)} L ${sx(10)} ${sy(0)}`} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <text x={sx(1.5)} y={sy(10)} textAnchor="middle" fontSize={14} fontWeight={800} fill="#b45309">rectangle</text>
        <text x={sx(1.5)} y={sy(10) + 20} textAnchor="middle" fontSize={14} fontWeight={800} fill="#b45309">20 × 3 = 60</text>
        <text x={sx(5)} y={sy(20.5)} textAnchor="middle" fontSize={13} fontWeight={800} fill="#0f766e">speeding up</text>
        <text x={sx(5)} y={sy(20.5) + 17} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="#0f766e">gradient = 10 ÷ 4 = 2.5</text>
        <text x={sx(5)} y={sy(10)} textAnchor="middle" fontSize={14} fontWeight={800} fill="#0f766e">trapezium</text>
        <text x={sx(5)} y={sy(10) + 20} textAnchor="middle" fontSize={13} fontWeight={800} fill="#0f766e">½(20+30) × 4 = 100</text>
        <text x={sx(8.2)} y={sy(8)} textAnchor="middle" fontSize={14} fontWeight={800} fill={VIOLET}>triangle</text>
        <text x={sx(8.2)} y={sy(8) + 20} textAnchor="middle" fontSize={13} fontWeight={800} fill={VIOLET}>½ × 30 × 3 = 45</text>
        <Halo x={sx(1.5)} y={sy(20) - 8} textAnchor="middle" fontSize={13} fontWeight={800} fill="#b45309">constant speed</Halo>
        <Halo x={sx(9.3)} y={sy(18)} textAnchor="start" fontSize={13} fontWeight={800} fill={VIOLET}>slowing down</Halo>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 10. speed-time: Nov 2021 Q21 */

export const SpeedTimeN21 = () => (
  <Plot xmin={0} xmax={14.5} ymin={0} ymax={36} xticks={[0, 5, 10, 13]} yticks={[0, 15, 30]} xlabel="Time (s)" ylabel="Speed (m/s)" height={410} pad={{ l: 64, r: 28, t: 30, b: 96 }}
    label="Speed-time graph: slowing from V = 30 m/s to 15 m/s in 5 seconds, steady at 15 m/s until 10 seconds, then slowing to rest at 13 seconds. The last 8 seconds cover 97.5 metres.">
    {(sx, sy) => (
      <>
        <path d={`M ${sx(0)} ${sy(0)} L ${sx(0)} ${sy(30)} L ${sx(5)} ${sy(15)} L ${sx(5)} ${sy(0)} Z`} fill={MUTED} fillOpacity={0.14} />
        <path d={`M ${sx(5)} ${sy(0)} L ${sx(5)} ${sy(15)} L ${sx(10)} ${sy(15)} L ${sx(10)} ${sy(0)} Z`} fill={TEAL} fillOpacity={0.25} />
        <path d={`M ${sx(10)} ${sy(0)} L ${sx(10)} ${sy(15)} L ${sx(13)} ${sy(0)} Z`} fill={VIOLET} fillOpacity={0.22} />
        <line x1={sx(5)} y1={sy(0)} x2={sx(5)} y2={sy(15)} stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={sx(10)} y1={sy(0)} x2={sx(10)} y2={sy(15)} stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 4" />
        <line x1={sx(0)} y1={sy(15)} x2={sx(5)} y2={sy(15)} stroke={MUTED} strokeWidth={1.5} strokeDasharray="5 4" />
        <path d={`M ${sx(0)} ${sy(30)} L ${sx(5)} ${sy(15)} L ${sx(10)} ${sy(15)} L ${sx(13)} ${sy(0)}`} fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <Dot x={sx(0)} y={sy(30)} colour={AMBER} r={7} />
        <Halo x={sx(0) + 12} y={sy(30) - 8} fontSize={14} fontWeight={800} fill="#b45309">V = 15 + 3 × 5 = 30</Halo>
        <Halo x={sx(2.5) + 10} y={sy(22.5) - 8} fontSize={13} fontWeight={800} fill={INK}>loses 3 m/s each second</Halo>
        <text x={sx(7.5)} y={sy(7.5)} textAnchor="middle" fontSize={14} fontWeight={800} fill="#0f766e">rectangle</text>
        <text x={sx(7.5)} y={sy(7.5) + 20} textAnchor="middle" fontSize={14} fontWeight={800} fill="#0f766e">15 × 5 = 75</text>
        <line x1={sx(11.6)} y1={sy(20.5)} x2={sx(11.6)} y2={sy(6.5)} stroke={VIOLET} strokeWidth={1.8} strokeDasharray="4 3" />
        <text x={sx(11.9)} y={sy(26)} textAnchor="middle" fontSize={13} fontWeight={800} fill={VIOLET}>triangle</text>
        <text x={sx(11.9)} y={sy(26) + 17} textAnchor="middle" fontSize={13} fontWeight={800} fill={VIOLET}>½ × 15 × 3 = 22.5</text>
        <path d={`M ${sx(5)} ${sy(0) + 40} v 8 H ${sx(13)} v -8`} fill="none" stroke={INK} strokeWidth={2} />
        <text x={sx(9)} y={sy(0) + 66} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>last 8 s: 75 + 22.5 = 97.5 m</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 11. four kinds of speed-time line */

export const SpeedTimeTypes = () => {
  const panels = [
    { title: 'At rest', note: 'speed stays 0', ex1: 'gradient 0', ex2: '', colour: MUTED, d: 'M 24 108 L 126 108' },
    { title: 'Constant speed', note: 'flat line', ex1: 'gradient 0', ex2: 'no acceleration', colour: BLUE, d: 'M 24 60 L 126 60' },
    { title: 'Speeding up', note: 'line goes up', ex1: 'positive gradient', ex2: '= acceleration', colour: GREEN, d: 'M 24 108 L 126 30' },
    { title: 'Slowing down', note: 'line goes down', ex1: 'negative gradient', ex2: '= deceleration', colour: RED, d: 'M 24 30 L 126 108' },
  ];
  return (
    <Svg viewBox="0 0 640 250" label="Four shapes on a speed-time graph: at rest, constant speed, speeding up and slowing down.">
      {panels.map((p, i) => (
        <g key={p.title} transform={`translate(${12 + i * 157} 8)`}>
          <rect x={0} y={0} width={150} height={134} rx={12} fill="#fff" stroke={GRID} strokeWidth={2} />
          <line x1={16} y1={12} x2={16} y2={118} stroke={AXIS} strokeWidth={2} />
          <line x1={16} y1={118} x2={138} y2={118} stroke={AXIS} strokeWidth={2} />
          <path d={p.d} stroke={p.colour} strokeWidth={5} strokeLinecap="round" fill="none" />
          <text x={75} y={160} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>{p.title}</text>
          <text x={75} y={180} textAnchor="middle" fontSize={13} fill={MUTED}>{p.note}</text>
          <text x={75} y={201} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.colour}>{p.ex1}</text>
          {p.ex2 && <text x={75} y={219} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.colour}>{p.ex2}</text>}
        </g>
      ))}
    </Svg>
  );
};

/* ------------------------------------------------------------------ 12. distance-time */

export const DistanceTime = () => (
  <Plot xmin={0} xmax={6} ymin={0} ymax={92} xticks={[1, 2, 3, 4, 5]} yticks={[20, 40, 60, 80]} xlabel="Time (hours)" ylabel="Distance from home (km)" height={360}
    label="Distance-time graph: 60 km away in 2 hours, stopped for 1 hour, then back home in 2 hours.">
    {(sx, sy) => (
      <>
        <path d={`M ${sx(0)} ${sy(0)} L ${sx(2)} ${sy(60)} L ${sx(3)} ${sy(60)} L ${sx(5)} ${sy(0)}`} fill="none" stroke={VIOLET} strokeWidth={4.5} strokeLinejoin="round" strokeLinecap="round" />
        <Halo x={sx(1.15)} y={sy(14)} fontSize={13} fontWeight={800} fill={GREEN}>going away: 60 ÷ 2 = 30 km/h</Halo>
        <Halo x={sx(2.5)} y={sy(60) + 24} textAnchor="middle" fontSize={13} fontWeight={800} fill={BLUE}>flat = stopped</Halo>
        <Halo x={sx(4.05)} y={sy(38)} textAnchor="start" fontSize={13} fontWeight={800} fill={RED}>coming back</Halo>
        <Halo x={sx(4.05)} y={sy(38) + 17} textAnchor="start" fontSize={12} fill={MUTED}>gradient is negative</Halo>
        <rect x={sx(0.1)} y={sy(90)} width={250} height={48} rx={10} fill="#f5f3ff" stroke={VIOLET} />
        <text x={sx(0.1) + 125} y={sy(90) + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>Gradient of a distance-time graph</text>
        <text x={sx(0.1) + 125} y={sy(90) + 39} textAnchor="middle" fontSize={15} fontWeight={800} fill={VIOLET}>= speed</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 13. cubic y = x^3 */

export const CubicCurve = () => (
  <Plot xmin={-3} xmax={3} ymin={-10} ymax={10} xticks={[-2, -1, 1, 2]} yticks={[-8, -4, 4, 8]} xlabel="x" ylabel="y" height={380}
    label="The graph of y = x³ through (−2, −8), (−1, −1), (0, 0), (1, 1) and (2, 8). It rises from left to right, flattening for a moment at the origin.">
    {(sx, sy) => (
      <>
        <path d={curvePath((x) => x ** 3, -2.15, 2.15, sx, sy)} fill="none" stroke={VIOLET} strokeWidth={4} />
        {[[-2, -8], [-1, -1], [0, 0], [1, 1], [2, 8]].map(([x, y]) => <Dot key={x} x={sx(x)} y={sy(y)} />)}
        <Halo x={sx(2) - 12} y={sy(8) - 4} textAnchor="end" fontSize={13} fontWeight={800} fill={INK}>(2, 8)</Halo>
        <Halo x={sx(-2) + 12} y={sy(-8) + 4} fontSize={13} fontWeight={800} fill={INK}>(−2, −8)</Halo>
        <Halo x={sx(1) - 12} y={sy(1) - 12} textAnchor="end" fontSize={13} fontWeight={800} fill={INK}>(1, 1)</Halo>
        <Halo x={sx(-1) + 12} y={sy(-1) + 20} fontSize={13} fontWeight={800} fill={INK}>(−1, −1)</Halo>
        <Halo x={sx(0.25)} y={sy(0) - 14} fontSize={13} fontWeight={800} fill={INK}>(0, 0)</Halo>
        <Halo x={sx(1.35)} y={sy(4.6)} fontSize={15} fontWeight={800} fill={VIOLET}>y = x³</Halo>
        <rect x={sx(-2.9)} y={sy(9.6)} width={216} height={58} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
        <text x={sx(-2.9) + 108} y={sy(9.6) + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Negative x gives negative y.</text>
        <text x={sx(-2.9) + 108} y={sy(9.6) + 44} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Positive x gives positive y.</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 14. y = 12/x and y = 3x + 1 (Nov 2025 Q9) */

export const InverseWithLine = () => {
  const xi = (-1 + Math.sqrt(145)) / 6; // 12/x = 3x + 1
  return (
    <Plot xmin={0} xmax={7} ymin={0} ymax={14} xticks={[1, 2, 3, 4, 5, 6]} yticks={[2, 4, 6, 8, 10, 12]} xlabel="x" ylabel="y" height={380}
      label="The curve y = 12/x for x from 1 to 6, and the line y = 3x + 1. They meet where x is about 1.8, so 12/x = 3x + 1 has the solution x ≈ 1.8.">
      {(sx, sy) => (
        <>
          <path d={curvePath((x) => 12 / x, 0.9, 6.5, sx, sy)} fill="none" stroke={INK} strokeWidth={3.5} />
          <line x1={sx(0)} y1={sy(1)} x2={sx(4.3)} y2={sy(13.9)} stroke={TEAL} strokeWidth={3.5} strokeLinecap="round" />
          {[[1, 12], [1.5, 8], [2, 6], [3, 4], [4, 3], [5, 2.4], [6, 2]].map(([x, y]) => <Dot key={x} x={sx(x)} y={sy(y)} colour={INK} r={4.5} />)}
          <line x1={sx(xi)} y1={sy(0)} x2={sx(xi)} y2={sy(3 * xi + 1)} stroke={RED} strokeWidth={2.5} strokeDasharray="6 4" />
          <Dot x={sx(xi)} y={sy(3 * xi + 1)} colour={RED} r={8} />
          <Halo x={sx(xi) + 12} y={sy(1.2)} fontSize={14} fontWeight={800} fill={RED}>meet at x ≈ 1.8</Halo>
          <Halo x={sx(6.5)} y={sy(2) - 12} textAnchor="end" fontSize={15} fontWeight={800} fill={INK}>y = 12/x</Halo>
          <Halo x={sx(1.6)} y={sy(11.6)} fontSize={15} fontWeight={800} fill={TEAL}>y = 3x + 1</Halo>
          <rect x={sx(4.45)} y={sy(8.2)} width={190} height={74} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
          <text x={sx(4.45) + 95} y={sy(8.2) + 24} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>To solve 12/x = 3x + 1,</text>
          <text x={sx(4.45) + 95} y={sy(8.2) + 44} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>draw both graphs and read</text>
          <text x={sx(4.45) + 95} y={sy(8.2) + 63} textAnchor="middle" fontSize={13} fontWeight={800} fill={RED}>x where they cross</text>
        </>
      )}
    </Plot>
  );
};


/* ------------------------------------------------------------------ 15. y = x^3 - 3x */

export const CubicTurning = () => (
  <Plot xmin={-2.6} xmax={2.6} ymin={-4} ymax={4.6} xticks={[-2, -1, 1, 2]} yticks={[-3, -2, -1, 1, 2, 3, 4]} xlabel="x" ylabel="y" height={380}
    label="The graph of y = x³ − 3x. It has a turning point at (−1, 2) and another at (1, −2), and it crosses the x-axis at about −1.7, 0 and 1.7.">
    {(sx, sy) => (
      <>
        <path d={curvePath((x) => x ** 3 - 3 * x, -2.15, 2.15, sx, sy)} fill="none" stroke={VIOLET} strokeWidth={4} />
        {[[-2, -2], [-1, 2], [0, 0], [1, -2], [2, 2]].map(([x, y]) => <Dot key={x} x={sx(x)} y={sy(y)} />)}
        {[-Math.sqrt(3), 0, Math.sqrt(3)].map((x) => <Dot key={`r${x}`} x={sx(x)} y={sy(0)} colour={RED} r={7} />)}
        <Halo x={sx(-1) - 12} y={sy(2) - 10} textAnchor="end" fontSize={13} fontWeight={800} fill={INK}>turning point (−1, 2)</Halo>
        <Halo x={sx(1) + 12} y={sy(-2) + 20} fontSize={13} fontWeight={800} fill={INK}>turning point (1, −2)</Halo>
        <Halo x={sx(-Math.sqrt(3)) - 6} y={sy(0) - 14} textAnchor="end" fontSize={13} fontWeight={800} fill={RED}>x ≈ −1.7</Halo>
        <Halo x={sx(Math.sqrt(3)) + 10} y={sy(0) + 38} fontSize={13} fontWeight={800} fill={RED}>x ≈ 1.7</Halo>
        <Halo x={sx(2.05)} y={sy(2) - 10} textAnchor="end" fontSize={15} fontWeight={800} fill={VIOLET}>y = x³ − 3x</Halo>
        <rect x={sx(-2.5)} y={sy(4.4)} width={226} height={52} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
        <text x={sx(-2.5) + 113} y={sy(4.4) + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Where the curve cuts the x-axis,</text>
        <text x={sx(-2.5) + 113} y={sy(4.4) + 41} textAnchor="middle" fontSize={13} fontWeight={800} fill={RED}>y = 0, so x³ − 3x = 0</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 16. hyperbola y = 6/x */

export const Hyperbola = () => (
  <Plot xmin={-7} xmax={7} ymin={-7} ymax={7} xticks={[-6, -4, -2, 2, 4, 6]} yticks={[-6, -4, -2, 2, 4, 6]} xlabel="x" ylabel="y" height={400}
    label="The graph of y = 6/x has two separate branches. It gets closer and closer to the axes but never touches them.">
    {(sx, sy) => (
      <>
        <path d={curvePath((x) => 6 / x, 0.86, 7, sx, sy)} fill="none" stroke={VIOLET} strokeWidth={4} />
        <path d={curvePath((x) => 6 / x, -7, -0.86, sx, sy)} fill="none" stroke={VIOLET} strokeWidth={4} />
        {[[1, 6], [2, 3], [3, 2], [6, 1], [-1, -6], [-2, -3], [-3, -2], [-6, -1]].map(([x, y]) => <Dot key={`${x}${y}`} x={sx(x)} y={sy(y)} r={5} />)}
        <Halo x={sx(1) + 10} y={sy(6) - 8} fontSize={13} fontWeight={800} fill={INK}>(1, 6)</Halo>
        <Halo x={sx(2) + 10} y={sy(3) - 8} fontSize={13} fontWeight={800} fill={INK}>(2, 3)</Halo>
        <Halo x={sx(-1) - 10} y={sy(-6) + 18} textAnchor="end" fontSize={13} fontWeight={800} fill={INK}>(−1, −6)</Halo>
        <Halo x={sx(-2) - 10} y={sy(-3) + 18} textAnchor="end" fontSize={13} fontWeight={800} fill={INK}>(−2, −3)</Halo>
        <Halo x={sx(4.2)} y={sy(2.2)} fontSize={15} fontWeight={800} fill={VIOLET}>y = 6/x</Halo>
        <rect x={sx(-6.9)} y={sy(6.9)} width={232} height={74} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
        <text x={sx(-6.9) + 116} y={sy(6.9) + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Two branches, never joined.</text>
        <text x={sx(-6.9) + 116} y={sy(6.9) + 42} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>The curve comes close to the</text>
        <text x={sx(-6.9) + 116} y={sy(6.9) + 61} textAnchor="middle" fontSize={13} fontWeight={800} fill={RED}>axes but never touches them.</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 17. parabola sketch y = x^2 - x - 12 */

export const ParabolaSketch = () => (
  <Plot xmin={-5} xmax={6.5} ymin={-15} ymax={8} xticks={[-4, -2, 2, 4, 6]} yticks={[-8, -4, 4, 8]} xlabel="x" ylabel="y" height={400}
    label="A sketch of y = x² − x − 12. It cuts the x-axis at (−3, 0) and (4, 0), cuts the y-axis at (0, −12), and has its lowest point at (0.5, −12.25).">
    {(sx, sy) => (
      <>
        <path d={curvePath((x) => x * x - x - 12, -4.3, 5.3, sx, sy, 100)} fill="none" stroke={VIOLET} strokeWidth={4} />
        <line x1={sx(0.5)} y1={sy(8)} x2={sx(0.5)} y2={sy(-15)} stroke={MUTED} strokeWidth={1.6} strokeDasharray="6 5" />
        <Dot x={sx(-3)} y={sy(0)} colour={RED} r={7} />
        <Dot x={sx(4)} y={sy(0)} colour={RED} r={7} />
        <Dot x={sx(0)} y={sy(-12)} colour={AMBER} r={7} />
        <Dot x={sx(0.5)} y={sy(-12.25)} colour={GREEN} r={7} />
        <Halo x={sx(-3) - 8} y={sy(0) - 12} textAnchor="end" fontSize={13} fontWeight={800} fill={RED}>(−3, 0)</Halo>
        <Halo x={sx(4) + 10} y={sy(0) - 12} fontSize={13} fontWeight={800} fill={RED}>(4, 0)</Halo>
        <Halo x={sx(0) - 14} y={sy(-12) - 4} textAnchor="end" fontSize={13} fontWeight={800} fill="#b45309">(0, −12)</Halo>
        <Halo x={sx(0.5) + 4} y={sy(-12.25) + 24} textAnchor="middle" fontSize={13} fontWeight={800} fill={GREEN}>lowest point (0.5, −12.25)</Halo>
        <Halo x={sx(0.5) + 8} y={sy(-3.5)} fontSize={15} fontWeight={800} fill={VIOLET}>y = x² − x − 12</Halo>
        <text x={sx(0.5) + 8} y={sy(7)} fontSize={12} fontWeight={700} fill={MUTED}>line of symmetry x = 0.5</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 18. shapes to know */

export const ShapeGallery = () => {
  const panels = [
    { title: 'Straight line', eq: 'y = mx + c', colour: GREEN, d: 'M 24 112 L 126 28' },
    { title: 'Parabola (smile)', eq: 'y = x² + …', colour: VIOLET, d: 'M 28 24 Q 75 150 122 24' },
    { title: 'Parabola (frown)', eq: 'y = −x² + …', colour: RED, d: 'M 28 112 Q 75 -14 122 112' },
    { title: 'Cubic (S-shape)', eq: 'y = x³ + …', colour: BLUE, d: 'M 28 120 C 62 114 64 76 75 69 C 86 62 88 24 122 18' },
    { title: 'Inverse (hyperbola)', eq: 'y = k/x', colour: AMBER, d: 'M 28 34 C 36 100 50 108 122 112' },
  ];
  return (
    <Svg viewBox="0 0 640 205" minWidth={540} label="Five graph shapes: a straight line, a smile-shaped parabola, a frown-shaped parabola, an S-shaped cubic and an inverse hyperbola.">
      {panels.map((p, i) => (
        <g key={p.title} transform={`translate(${6 + i * 127} 8)`}>
          <rect x={0} y={0} width={120} height={138} rx={12} fill="#fff" stroke={GRID} strokeWidth={2} />
          <line x1={10} y1={69} x2={110} y2={69} stroke={GRID} strokeWidth={1.5} />
          <line x1={60} y1={12} x2={60} y2={126} stroke={GRID} strokeWidth={1.5} />
          <g transform="translate(-15 0)"><path d={p.d} stroke={p.colour} strokeWidth={4.5} strokeLinecap="round" fill="none" /></g>
          <text x={60} y={166} textAnchor="middle" fontSize={12.5} fontWeight={800} fill={INK}>{p.title}</text>
          <text x={60} y={186} textAnchor="middle" fontSize={13} fontWeight={800} fill={p.colour}>{p.eq}</text>
        </g>
      ))}
    </Svg>
  );
};

export const GRAPH_DIAGRAMS: Record<string, React.ComponentType> = {
  gradTriangle: GradTriangle,
  twoPointGradient: TwoPointGradient,
  slopeTypes: SlopeTypes,
  lineMxC: LineMxC,
  interceptMethod: InterceptMethod,
  parallelLines: ParallelLines,
  tangentsOnCurve: TangentsOnCurve,
  tangentInverse: TangentInverse,
  speedTimeN23: SpeedTimeN23,
  speedTimeN21: SpeedTimeN21,
  speedTimeTypes: SpeedTimeTypes,
  distanceTime: DistanceTime,
  cubicCurve: CubicCurve,
  inverseWithLine: InverseWithLine,
  cubicTurning: CubicTurning,
  hyperbola: Hyperbola,
  parabolaSketch: ParabolaSketch,
  shapeGallery: ShapeGallery,
};
