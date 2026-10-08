import React, { type ReactNode } from 'react';
import { INK, MUTED, GRID, VIOLET, TEAL, AMBER, RED, GREEN, BLUE, Svg, Halo, Plot, Dot, curvePath } from './graphDiagrams';

/*
 * SVG diagrams for the Equations topic. Every picture uses the same numbers as
 * the worked example next to it.
 */

const SOFT_VIOLET = '#ede9fe';
const SOFT_TEAL = '#ccfbf1';
const SOFT_AMBER = '#fef3c7';

/* ------------------------------------------------------------------ 1. balance scales */

type Pile = { x: number; u: number };
type BalanceStep = { label: string; left: Pile; right: Pile };

const pileItems = (pile: Pile, width: number) => {
  const items: ('x' | 'u')[] = [...Array(pile.x).fill('x'), ...Array(pile.u).fill('u')];
  const placed: { kind: 'x' | 'u'; px: number; row: number }[] = [];
  let px = 0;
  let row = 0;
  items.forEach((kind) => {
    const w = kind === 'x' ? 38 : 25;
    if (px + w > width) { px = 0; row += 1; }
    placed.push({ kind, px, row });
    px += w;
  });
  return placed;
};

const Balance = ({ step, y }: { step: BalanceStep; y: number }) => {
  const beamY = y + 128;
  const side = (pile: Pile, left: number) => pileItems(pile, 196).map((it, i) => {
    const cx = left + 6 + it.px + (it.kind === 'x' ? 17 : 11);
    const cy = beamY - 20 - it.row * 36;
    return it.kind === 'x'
      ? <g key={i}><rect x={cx - 17} y={cy - 17} width={34} height={34} rx={7} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={2.5} /><text x={cx} y={cy + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill={VIOLET}>x</text></g>
      : <g key={i}><circle cx={cx} cy={cy + 3} r={11} fill={SOFT_AMBER} stroke={AMBER} strokeWidth={2.5} /><text x={cx} y={cy + 7.5} textAnchor="middle" fontSize={12} fontWeight={800} fill="#b45309">1</text></g>;
  });
  return (
    <g>
      <text x={0} y={y + 22} fontSize={16} fontWeight={800} fill={INK}>{step.label}</text>
      {side(step.left, 40)}
      {side(step.right, 290)}
      <rect x={40} y={beamY} width={200} height={9} rx={4} fill="#475569" />
      <rect x={290} y={beamY} width={200} height={9} rx={4} fill="#475569" />
      <path d={`M 240 ${beamY + 5} H 290`} stroke="#475569" strokeWidth={4} />
      <path d={`M 265 ${beamY + 5} L 247 ${beamY + 34} H 283 Z`} fill="#94a3b8" />
      <text x={265} y={beamY - 26} textAnchor="middle" fontSize={26} fontWeight={800} fill={INK}>=</text>
    </g>
  );
};

const BalanceSteps = ({ steps, label }: { steps: BalanceStep[]; label: string }) => {
  const h = 170;
  return (
    <Svg viewBox={`0 0 530 ${steps.length * h + 10}`} minWidth={440} label={label}>
      {steps.map((st, i) => <Balance key={i} step={st} y={i * h + 4} />)}
    </Svg>
  );
};

export const BalanceLinear = () => (
  <BalanceSteps
    label="A balance showing 2x + 3 = 11. Take 3 from each side to get 2x = 8. Share into two equal groups to get x = 4."
    steps={[
      { label: 'Start: 2x + 3 = 11', left: { x: 2, u: 3 }, right: { x: 0, u: 11 } },
      { label: 'Take 3 away from BOTH sides:  2x = 8', left: { x: 2, u: 0 }, right: { x: 0, u: 8 } },
      { label: 'Share into 2 equal groups:  x = 4', left: { x: 1, u: 0 }, right: { x: 0, u: 4 } },
    ]}
  />
);

export const BalanceBoth = () => (
  <BalanceSteps
    label="A balance showing 5x + 3 = 3x + 11. Take 3x from both sides to get 2x + 3 = 11. Take 3 from both sides to get 2x = 8. So x = 4."
    steps={[
      { label: 'Start: 5x + 3 = 3x + 11', left: { x: 5, u: 3 }, right: { x: 3, u: 11 } },
      { label: 'Take 3x away from BOTH sides:  2x + 3 = 11', left: { x: 2, u: 3 }, right: { x: 0, u: 11 } },
      { label: 'Take 3 away from BOTH sides:  2x = 8', left: { x: 2, u: 0 }, right: { x: 0, u: 8 } },
      { label: 'Share into 2 equal groups:  x = 4', left: { x: 1, u: 0 }, right: { x: 0, u: 4 } },
    ]}
  />
);

/* ------------------------------------------------------------------ 2. brackets */

export const BracketBox = () => (
  <Svg viewBox="0 0 640 270" minWidth={500} label="Area picture for 3(x + 4): a rectangle 3 high and (x + 4) wide splits into 3x and 12. The right side shows a minus sign outside a bracket flipping every sign inside.">
    <text x={10} y={22} fontSize={15} fontWeight={800} fill={INK}>Multiply EVERY term inside the bracket</text>
    <rect x={40} y={50} width={160} height={110} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={3} />
    <rect x={200} y={50} width={90} height={110} fill={SOFT_AMBER} stroke={AMBER} strokeWidth={3} />
    <text x={120} y={110} textAnchor="middle" fontSize={22} fontWeight={800} fill={VIOLET}>3x</text>
    <text x={245} y={110} textAnchor="middle" fontSize={22} fontWeight={800} fill="#b45309">12</text>
    <text x={120} y={44} textAnchor="middle" fontSize={15} fontWeight={800} fill={VIOLET}>x</text>
    <text x={245} y={44} textAnchor="middle" fontSize={15} fontWeight={800} fill="#b45309">4</text>
    <text x={26} y={110} textAnchor="end" fontSize={15} fontWeight={800} fill={INK}>3</text>
    <text x={165} y={190} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>3(x + 4) = 3x + 12</text>
    <text x={165} y={212} textAnchor="middle" fontSize={13} fill={MUTED}>height 3, width x + 4</text>

    <text x={350} y={22} fontSize={15} fontWeight={800} fill={INK}>A minus sign outside flips every sign</text>
    <rect x={345} y={40} width={285} height={110} rx={12} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
    <text x={366} y={78} fontSize={20} fontWeight={800} fill={INK}>-(2 - x)</text>
    <text x={366} y={118} fontSize={20} fontWeight={800} fill={RED}>= -2 + x</text>
    <text x={500} y={78} fontSize={14} fill={MUTED}>-1 × 2 = -2</text>
    <text x={500} y={118} fontSize={14} fill={MUTED}>-1 × (-x) = +x</text>
    <rect x={345} y={166} width={285} height={78} rx={12} fill="#fef2f2" stroke={RED} strokeWidth={2} />
    <text x={487} y={192} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>Most mistakes: forgetting the sign</text>
    <text x={487} y={214} textAnchor="middle" fontSize={14} fill={INK}>-(2 - x) is NOT -2 - x</text>
    <text x={487} y={234} textAnchor="middle" fontSize={14} fontWeight={800} fill={RED}>The x changes sign too.</text>
  </Svg>
);

/* ------------------------------------------------------------------ 3. cross multiply */

export const CrossMultiply = () => (
  <Svg viewBox="0 0 640 260" minWidth={480} label="To solve 2 over (3n - 1) equals 3 over (n + 2), multiply each numerator by the opposite denominator: 2 times (n + 2) equals 3 times (3n - 1).">
    <g fontSize={28} fontWeight={800} fill={INK} textAnchor="middle">
      <text x={150} y={92}>2</text>
      <line x1={90} y1={108} x2={210} y2={108} stroke={INK} strokeWidth={3} />
      <text x={150} y={148}>3n - 1</text>
      <text x={380} y={92}>3</text>
      <line x1={320} y1={108} x2={440} y2={108} stroke={INK} strokeWidth={3} />
      <text x={380} y={148}>n + 2</text>
    </g>
    <line x1={335} y1={132} x2={196} y2={98} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
    <path d="M 190 96 l 16 1 l -9 12 z" fill={VIOLET} />
    <line x1={205} y1={132} x2={344} y2={98} stroke={TEAL} strokeWidth={4} strokeLinecap="round" />
    <path d="M 350 96 l -16 1 l 9 12 z" fill={TEAL} />
    <text x={265} y={124} textAnchor="middle" fontSize={34} fontWeight={800} fill={INK} stroke="#fff" strokeWidth={5} paintOrder="stroke">=</text>
    <text x={20} y={24} fontSize={15} fontWeight={800} fill={INK}>Cross multiply: bottom of one side × top of the other side</text>
    <text x={150} y={236} textAnchor="middle" fontSize={20} fontWeight={800} fill={VIOLET}>2(n + 2)</text>
    <text x={265} y={236} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK}>=</text>
    <text x={400} y={236} textAnchor="middle" fontSize={20} fontWeight={800} fill={TEAL}>3(3n - 1)</text>
    <text x={560} y={130} textAnchor="middle" fontSize={13} fill={MUTED}>No fractions left,</text>
    <text x={560} y={148} textAnchor="middle" fontSize={13} fill={MUTED}>so solve as normal.</text>
  </Svg>
);

/* ------------------------------------------------------------------ 4. simultaneous lines */

export const SimLines = () => (
  <Plot xmin={-1} xmax={7} ymin={-2} ymax={7} xticks={[1, 2, 3, 4, 5, 6]} yticks={[-1, 1, 2, 3, 4, 5, 6]} xlabel="x" ylabel="y" height={360}
    label="The lines x + y = 5 and x − y = 1 cross at the point (3, 2). So x = 3 and y = 2 is the only solution of both equations.">
    {(sx, sy) => (
      <>
        <line x1={sx(-0.8)} y1={sy(5.8)} x2={sx(6.2)} y2={sy(-1.2)} stroke={VIOLET} strokeWidth={4} strokeLinecap="round" />
        <line x1={sx(-0.8)} y1={sy(-1.8)} x2={sx(6.2)} y2={sy(5.2)} stroke={TEAL} strokeWidth={4} strokeLinecap="round" />
        <Dot x={sx(3)} y={sy(2)} colour={RED} r={9} />
        <Halo x={sx(3)} y={sy(2) + 32} textAnchor="middle" fontSize={15} fontWeight={800} fill={RED}>(3, 2)</Halo>
        <Halo x={sx(3)} y={sy(2) + 50} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>true for both lines</Halo>
        <Halo x={sx(0.1)} y={sy(5.3)} fontSize={15} fontWeight={800} fill={VIOLET}>x + y = 5</Halo>
        <Halo x={sx(4.7)} y={sy(5.9)} fontSize={15} fontWeight={800} fill={TEAL}>x - y = 1</Halo>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 5. parabola roots */

export const ParabolaRoots = () => (
  <Plot xmin={-3} xmax={5.5} ymin={-5.5} ymax={6} xticks={[-2, -1, 1, 2, 3, 4, 5]} yticks={[-4, -2, 2, 4]} xlabel="x" ylabel="y" height={380}
    label="The curve y = x² − 2x − 3 crosses the x-axis at x = −1 and x = 3. These are the two solutions of x² − 2x − 3 = 0.">
    {(sx, sy) => (
      <>
        <path d={curvePath((x) => x * x - 2 * x - 3, -2.2, 4.6, sx, sy, 100)} fill="none" stroke={VIOLET} strokeWidth={4} />
        <Dot x={sx(-1)} y={sy(0)} colour={RED} r={8} />
        <Dot x={sx(3)} y={sy(0)} colour={RED} r={8} />
        <Halo x={sx(-1) - 10} y={sy(0) - 16} textAnchor="end" fontSize={14} fontWeight={800} fill={RED}>x = -1</Halo>
        <Halo x={sx(3) + 12} y={sy(0) - 16} fontSize={14} fontWeight={800} fill={RED}>x = 3</Halo>
        <Halo x={sx(1)} y={sy(-4) + 26} textAnchor="middle" fontSize={13} fontWeight={800} fill={MUTED}>lowest point (1, -4)</Halo>
        <Halo x={sx(4.1)} y={sy(4.4)} textAnchor="end" fontSize={15} fontWeight={800} fill={VIOLET}>y = x² - 2x - 3</Halo>
        <rect x={sx(-2.95)} y={sy(-3.3)} width={176} height={56} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
        <text x={sx(-2.95) + 88} y={sy(-3.3) + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK}>Solving x² - 2x - 3 = 0</text>
        <text x={sx(-2.95) + 88} y={sy(-3.3) + 42} textAnchor="middle" fontSize={13} fontWeight={800} fill={RED}>means: where is y = 0?</text>
      </>
    )}
  </Plot>
);

/* ------------------------------------------------------------------ 6. factor box */

export const FactorBox = () => {
  const x0 = 130; const y0 = 60;
  const wx = 150; const w3 = 90; const hx = 150; const h2 = 60;
  return (
    <Svg viewBox="0 0 640 300" minWidth={500} label="A rectangle with sides (x + 3) and (x + 2). Its four parts are x², 3x, 2x and 6, so x² + 5x + 6 = (x + 2)(x + 3).">
      <text x={x0 + (wx + w3) / 2} y={40} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>x + 3</text>
      <text x={x0 + wx / 2} y={y0 - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>x</text>
      <text x={x0 + wx + w3 / 2} y={y0 - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>3</text>
      <text transform={`translate(${x0 - 40} ${y0 + (hx + h2) / 2}) rotate(-90)`} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>x + 2</text>
      <text x={x0 - 12} y={y0 + hx / 2 + 5} textAnchor="end" fontSize={13} fontWeight={700} fill={MUTED}>x</text>
      <text x={x0 - 12} y={y0 + hx + h2 / 2 + 5} textAnchor="end" fontSize={13} fontWeight={700} fill={MUTED}>2</text>
      <rect x={x0} y={y0} width={wx} height={hx} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={3} />
      <rect x={x0 + wx} y={y0} width={w3} height={hx} fill={SOFT_TEAL} stroke={TEAL} strokeWidth={3} />
      <rect x={x0} y={y0 + hx} width={wx} height={h2} fill={SOFT_TEAL} stroke={TEAL} strokeWidth={3} />
      <rect x={x0 + wx} y={y0 + hx} width={w3} height={h2} fill={SOFT_AMBER} stroke={AMBER} strokeWidth={3} />
      <text x={x0 + wx / 2} y={y0 + hx / 2 + 8} textAnchor="middle" fontSize={26} fontWeight={800} fill={VIOLET}>x²</text>
      <text x={x0 + wx + w3 / 2} y={y0 + hx / 2 + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill="#0f766e">3x</text>
      <text x={x0 + wx / 2} y={y0 + hx + h2 / 2 + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill="#0f766e">2x</text>
      <text x={x0 + wx + w3 / 2} y={y0 + hx + h2 / 2 + 8} textAnchor="middle" fontSize={22} fontWeight={800} fill="#b45309">6</text>
      <g transform="translate(400 70)">
        <text x={0} y={0} fontSize={15} fontWeight={800} fill={INK}>Add the four parts:</text>
        <text x={0} y={30} fontSize={16} fontWeight={700} fill={INK}>x² + 3x + 2x + 6</text>
        <text x={0} y={60} fontSize={16} fontWeight={700} fill={INK}>= x² + 5x + 6</text>
        <text x={0} y={104} fontSize={15} fontWeight={800} fill={INK}>Read the sides:</text>
        <text x={0} y={134} fontSize={18} fontWeight={800} fill={VIOLET}>= (x + 2)(x + 3)</text>
        <text x={0} y={170} fontSize={13} fill={MUTED}>Check: 2 × 3 = 6 and 2 + 3 = 5</text>
      </g>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 7. zero product */

export const ZeroProduct = () => (
  <Svg viewBox="0 0 640 290" minWidth={480} label="If (x − 3)(2x + 1) = 0 then one bracket must be zero. So x − 3 = 0 giving x = 3, or 2x + 1 = 0 giving x = −1/2.">
    <rect x={150} y={14} width={340} height={56} rx={14} fill="#f5f3ff" stroke={VIOLET} strokeWidth={3} />
    <text x={320} y={50} textAnchor="middle" fontSize={24} fontWeight={800} fill={INK}>(x - 3)(2x + 1) = 0</text>
    <text x={320} y={98} textAnchor="middle" fontSize={14} fontWeight={800} fill={RED}>Two numbers multiply to give 0, so ONE of them must be 0.</text>
    <path d="M 270 112 L 170 150" stroke={INK} strokeWidth={2.5} fill="none" />
    <path d="M 370 112 L 470 150" stroke={INK} strokeWidth={2.5} fill="none" />
    <rect x={60} y={152} width={220} height={50} rx={12} fill={SOFT_TEAL} stroke={TEAL} strokeWidth={3} />
    <text x={170} y={185} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK}>x - 3 = 0</text>
    <rect x={360} y={152} width={220} height={50} rx={12} fill={SOFT_AMBER} stroke={AMBER} strokeWidth={3} />
    <text x={470} y={185} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK}>2x + 1 = 0</text>
    <text x={320} y={182} textAnchor="middle" fontSize={16} fontWeight={800} fill={MUTED}>or</text>
    <path d="M 170 204 v 28" stroke={INK} strokeWidth={2.5} /><path d="M 163 228 l 7 10 l 7 -10 z" fill={INK} />
    <path d="M 470 204 v 28" stroke={INK} strokeWidth={2.5} /><path d="M 463 228 l 7 10 l 7 -10 z" fill={INK} />
    <text x={170} y={266} textAnchor="middle" fontSize={22} fontWeight={800} fill="#0f766e">x = 3</text>
    <text x={470} y={266} textAnchor="middle" fontSize={22} fontWeight={800} fill="#b45309">x = -1/2</text>
  </Svg>
);

/* ------------------------------------------------------------------ 8. completing the square */

export const CompleteSquare = () => {
  const x0 = 70; const y0 = 50; const xs = 150; const t = 60;
  return (
    <Svg viewBox="0 0 720 310" minWidth={520} label="A square of side x + 3 made from an x by x square, two strips of 3x, and a missing 3 by 3 corner of 9. So x² + 6x = (x + 3)² − 9.">
      <text x={x0 + (xs + t) / 2} y={30} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>x + 3</text>
      <text transform={`translate(${x0 - 30} ${y0 + (xs + t) / 2}) rotate(-90)`} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>x + 3</text>
      <rect x={x0} y={y0} width={xs} height={xs} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={3} />
      <rect x={x0 + xs} y={y0} width={t} height={xs} fill={SOFT_TEAL} stroke={TEAL} strokeWidth={3} />
      <rect x={x0} y={y0 + xs} width={xs} height={t} fill={SOFT_TEAL} stroke={TEAL} strokeWidth={3} />
      <rect x={x0 + xs} y={y0 + xs} width={t} height={t} fill="#fff" stroke={AMBER} strokeWidth={3.5} strokeDasharray="8 5" />
      <text x={x0 + xs / 2} y={y0 + xs / 2 + 8} textAnchor="middle" fontSize={28} fontWeight={800} fill={VIOLET}>x²</text>
      <text x={x0 + xs + t / 2} y={y0 + xs / 2 + 7} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f766e">3x</text>
      <text x={x0 + xs / 2} y={y0 + xs + t / 2 + 7} textAnchor="middle" fontSize={20} fontWeight={800} fill="#0f766e">3x</text>
      <text x={x0 + xs + t / 2} y={y0 + xs + t / 2 + 7} textAnchor="middle" fontSize={20} fontWeight={800} fill="#b45309">9</text>
      <g transform="translate(350 70)">
        <text x={0} y={0} fontSize={15} fontWeight={800} fill={INK}>x² + 6x is the violet part and the two teal strips.</text>
        <text x={0} y={28} fontSize={14} fill={MUTED}>It is a square with a corner missing.</text>
        <text x={0} y={72} fontSize={15} fontWeight={800} fill="#b45309">Add the missing 9 to complete the square:</text>
        <text x={0} y={104} fontSize={18} fontWeight={800} fill={INK}>x² + 6x + 9 = (x + 3)²</text>
        <text x={0} y={148} fontSize={15} fontWeight={800} fill={INK}>So:</text>
        <text x={0} y={178} fontSize={18} fontWeight={800} fill={VIOLET}>x² + 6x = (x + 3)² - 9</text>
        <text x={0} y={214} fontSize={13} fill={MUTED}>The 3 is half of the 6.</text>
      </g>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 9. quadratic formula box */

export const FormulaBox = () => (
  <Svg viewBox="0 0 640 330" minWidth={500} label="The quadratic formula x equals minus b plus or minus the square root of b squared minus 4ac, all over 2a, applied to 3x² + 5x − 18 = 0 with a = 3, b = 5 and c = −18.">
    <rect x={20} y={14} width={600} height={92} rx={16} fill="#f5f3ff" stroke={VIOLET} strokeWidth={3} />
    <text x={320} y={50} textAnchor="middle" fontSize={15} fontWeight={800} fill={MUTED}>For ax² + bx + c = 0</text>
    <text x={320} y={90} textAnchor="middle" fontSize={28} fontWeight={800} fill={INK}>x = (-b ± √(b² - 4ac)) ÷ 2a</text>
    <text x={20} y={140} fontSize={15} fontWeight={800} fill={INK}>Example: 3x² + 5x - 18 = 0</text>
    <g fontSize={17} fontWeight={800} textAnchor="middle">
      <rect x={60} y={156} width={150} height={40} rx={10} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={2.5} /><text x={135} y={183} fill={VIOLET}>a = 3</text>
      <rect x={245} y={156} width={150} height={40} rx={10} fill={SOFT_TEAL} stroke={TEAL} strokeWidth={2.5} /><text x={320} y={183} fill="#0f766e">b = 5</text>
      <rect x={430} y={156} width={150} height={40} rx={10} fill={SOFT_AMBER} stroke={AMBER} strokeWidth={2.5} /><text x={505} y={183} fill="#b45309">c = -18</text>
    </g>
    <g fontSize={17} fontWeight={700} fill={INK}>
      <text x={20} y={236}>x = (-5 ± √(5² - 4 × 3 × (-18))) ÷ (2 × 3)</text>
      <text x={20} y={266}>x = (-5 ± √(25 + 216)) ÷ 6</text>
      <text x={20} y={296} fontWeight={800} fill={VIOLET}>x = (-5 ± √241) ÷ 6</text>
    </g>
    <text x={20} y={322} fontSize={13} fill={MUTED}>Careful: -4 × 3 × (-18) is positive, so it becomes + 216.</text>
  </Svg>
);

/* ------------------------------------------------------------------ 10. discriminant */

// Quadratic curve drawn as a Bezier from (34, 18) to (166, 18) with control height cy.
const bezierY = (t: number, cy: number) => (1 - t) * (1 - t) * 18 + 2 * t * (1 - t) * cy + t * t * 18;
const bezierX = (t: number) => (1 - t) * (1 - t) * 34 + 2 * t * (1 - t) * 100 + t * t * 166;

export const DiscriminantGraphs = () => {
  const AXIS_Y = 118;
  const panels = [
    { title: 'b² - 4ac > 0', note: 'two different roots', colour: GREEN, cy: 282, words: 'the curve crosses the x-axis twice' },
    { title: 'b² - 4ac = 0', note: 'one root (it just touches)', colour: BLUE, cy: 218, words: 'the curve touches the x-axis once' },
    { title: 'b² - 4ac < 0', note: 'no real roots', colour: RED, cy: 158, words: 'the curve never reaches the x-axis' },
  ];
  const roots = (cy: number): number[] => {
    // Solve bezierY(t) = AXIS_Y by scanning.
    const found: number[] = [];
    let prev = bezierY(0, cy) - AXIS_Y;
    for (let i = 1; i <= 400; i += 1) {
      const t = i / 400;
      const cur = bezierY(t, cy) - AXIS_Y;
      if (prev * cur < 0) found.push(bezierX(t));
      prev = cur;
    }
    if (Math.abs(bezierY(0.5, cy) - AXIS_Y) < 0.5) return [bezierX(0.5)];
    return found;
  };
  return (
    <Svg viewBox="0 0 640 260" minWidth={520} label="Three parabolas: one that crosses the x-axis twice, one that touches it once, and one that stays above it. These match the discriminant being positive, zero or negative.">
      {panels.map((p, i) => (
        <g key={p.title} transform={`translate(${10 + i * 211} 6)`}>
          <rect x={0} y={0} width={200} height={170} rx={12} fill="#fff" stroke={GRID} strokeWidth={2} />
          <line x1={14} y1={AXIS_Y} x2={186} y2={AXIS_Y} stroke="#334155" strokeWidth={2.2} />
          <path d={`M 34 18 Q 100 ${p.cy} 166 18`} fill="none" stroke={p.colour} strokeWidth={4.5} />
          {roots(p.cy).map((rx) => <circle key={rx} cx={rx} cy={AXIS_Y} r={6.5} fill={p.colour} stroke="#fff" strokeWidth={2} />)}
          <text x={100} y={196} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK}>{p.title}</text>
          <text x={100} y={217} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.colour}>{p.note}</text>
          <text x={100} y={238} textAnchor="middle" fontSize={12} fill={MUTED}>{p.words}</text>
        </g>
      ))}
    </Svg>
  );
};

/* ------------------------------------------------------------------ 11. line and parabola */

export const LineParabolaCases = () => {
  const panels = [
    { title: 'Two solutions', note: 'the line cuts the curve twice', colour: GREEN, line: 'M 20 68.7 L 180 38.9', dots: [[58, 61.6], [156, 43.4]], curve: 'M 30 20 Q 100 150 170 20', rule: 'b² - 4ac > 0' },
    { title: 'One solution', note: 'the line just touches the curve', colour: BLUE, line: 'M 20 78 L 180 78', dots: [[100, 78]], curve: 'M 30 20 Q 100 136 170 20', rule: 'b² - 4ac = 0' },
    { title: 'No solutions', note: 'the line misses the curve', colour: RED, line: 'M 20 50 L 180 50', dots: [] as number[][], curve: 'M 30 90 Q 100 190 170 90', rule: 'b² - 4ac < 0' },
  ];
  return (
    <Svg viewBox="0 0 640 250" minWidth={520} label="A straight line and a parabola can meet at two points, one point or no points. That is two solutions, one solution or no solutions.">
      {panels.map((p, i) => (
        <g key={p.title} transform={`translate(${10 + i * 211} 6)`}>
          <rect x={0} y={0} width={200} height={166} rx={12} fill="#fff" stroke={GRID} strokeWidth={2} />
          <path d={p.curve} fill="none" stroke="#334155" strokeWidth={4} />
          <path d={p.line} fill="none" stroke={p.colour} strokeWidth={4.5} strokeLinecap="round" />
          {p.dots.map(([cx, cy]) => <circle key={cx} cx={cx} cy={cy} r={7} fill={p.colour} stroke="#fff" strokeWidth={2} />)}
          <text x={100} y={192} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK}>{p.title}</text>
          <text x={100} y={213} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={p.colour}>{p.note}</text>
          <text x={100} y={233} textAnchor="middle" fontSize={12.5} fill={MUTED}>{p.rule}</text>
        </g>
      ))}
    </Svg>
  );
};

/* ------------------------------------------------------------------ 12. word problems: rectangle, angles, trapezium */

export const RectangleWord = () => (
  <Svg viewBox="0 0 720 270" minWidth={540} label="A rectangle with width x + 2 and length 3x − 1. Its perimeter is 8x + 2 and its area is 16 square centimetres.">
    <rect x={90} y={60} width={300} height={140} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={4} />
    <text x={240} y={44} textAnchor="middle" fontSize={18} fontWeight={800} fill={VIOLET}>length = 3x - 1</text>
    <text x={76} y={136} textAnchor="end" fontSize={18} fontWeight={800} fill="#0f766e">width</text>
    <text x={76} y={158} textAnchor="end" fontSize={18} fontWeight={800} fill="#0f766e">x + 2</text>
    <text x={240} y={138} textAnchor="middle" fontSize={22} fontWeight={800} fill={INK}>Area = 16 cm²</text>
    <text x={240} y={226} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>Perimeter = 8x + 2</text>
    <g transform="translate(430 70)">
      <text x={0} y={0} fontSize={15} fontWeight={800} fill={INK}>Perimeter = 2 × (length + width)</text>
      <text x={0} y={34} fontSize={15} fontWeight={700} fill={INK}>8x + 2 = 2(length + x + 2)</text>
      <text x={0} y={68} fontSize={15} fontWeight={700} fill={INK}>Half: 4x + 1 = length + x + 2</text>
      <text x={0} y={102} fontSize={15} fontWeight={800} fill={VIOLET}>length = 3x - 1</text>
    </g>
  </Svg>
);

export const QuadAngles = () => (
  <Svg viewBox="0 0 720 280" minWidth={540} label="A four-sided shape with angles x, 2x, x + 10 and x + 50 degrees. The four angles of any quadrilateral add up to 360 degrees.">
    <path d="M 90 220 L 180 50 L 400 80 L 430 220 Z" fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={4} strokeLinejoin="round" />
    <text x={118} y={206} fontSize={17} fontWeight={800} fill={INK}>x°</text>
    <text x={178} y={92} fontSize={17} fontWeight={800} fill={INK}>2x°</text>
    <text x={338} y={110} fontSize={17} fontWeight={800} fill={INK}>(x + 10)°</text>
    <text x={338} y={206} fontSize={17} fontWeight={800} fill={INK}>(x + 50)°</text>
    <g transform="translate(450 80)">
      <text x={0} y={0} fontSize={15} fontWeight={800} fill={RED}>Four angles = 360°</text>
      <text x={0} y={34} fontSize={15} fontWeight={700} fill={INK}>x + 2x + (x + 10) + (x + 50) = 360</text>
      <text x={0} y={64} fontSize={15} fontWeight={700} fill={INK}>5x + 60 = 360</text>
      <text x={0} y={94} fontSize={15} fontWeight={800} fill={VIOLET}>x = 60</text>
    </g>
  </Svg>
);

export const TrapeziumWord = () => (
  <Svg viewBox="0 0 720 270" minWidth={540} label="An isosceles trapezium with parallel sides 5 cm and 17 cm and two equal slanting sides. The perimeter is 42 cm, so each slanting side is 10 cm and the height is 8 cm.">
    <path d="M 190 60 L 330 60 L 400 200 L 120 200 Z" fill={SOFT_TEAL} stroke={TEAL} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 190 60 L 190 200" stroke={RED} strokeWidth={3} strokeDasharray="7 5" />
    <text x={260} y={46} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>AB = 5 cm</text>
    <text x={260} y={228} textAnchor="middle" fontSize={16} fontWeight={800} fill={INK}>DC = 17 cm</text>
    <text x={132} y={118} textAnchor="end" fontSize={15} fontWeight={800} fill="#0f766e">AD = x</text>
    <text x={378} y={118} fontSize={15} fontWeight={800} fill="#0f766e">BC = x</text>
    <text x={180} y={138} textAnchor="end" fontSize={15} fontWeight={800} fill={RED}>height</text>
    <g transform="translate(440 70)">
      <text x={0} y={0} fontSize={15} fontWeight={800} fill={INK}>Perimeter = 42</text>
      <text x={0} y={30} fontSize={15} fontWeight={700} fill={INK}>5 + 17 + x + x = 42</text>
      <text x={0} y={58} fontSize={15} fontWeight={700} fill={INK}>2x = 20, so x = 10</text>
      <text x={0} y={96} fontSize={14} fontWeight={700} fill={RED}>(17 - 5) ÷ 2 = 6 sideways</text>
      <text x={0} y={122} fontSize={14} fontWeight={800} fill={RED}>height² = 10² - 6² = 64</text>
      <text x={0} y={148} fontSize={14} fontWeight={800} fill={VIOLET}>height = 8 cm</text>
    </g>
  </Svg>
);

/* ------------------------------------------------------------------ 13. inverse machine */

export const InverseMachine = () => {
  const box = (x: number, y: number, w: number, text: string, colour: string, fill: string) => (
    <g>
      <rect x={x} y={y} width={w} height={46} rx={12} fill={fill} stroke={colour} strokeWidth={3} />
      <text x={x + w / 2} y={y + 30} textAnchor="middle" fontSize={w > 120 ? 16 : 19} fontWeight={800} fill={INK}>{text}</text>
    </g>
  );
  const right = (x1: number, x2: number, y: number, label: string, colour: string) => (
    <g>
      <line x1={x1} y1={y} x2={x2 - 10} y2={y} stroke={colour} strokeWidth={3.5} />
      <path d={`M ${x2} ${y} l -13 -7 v 14 z`} fill={colour} />
      <text x={(x1 + x2) / 2} y={y - 12} textAnchor="middle" fontSize={15} fontWeight={800} fill={colour}>{label}</text>
    </g>
  );
  const left = (x1: number, x2: number, y: number, label: string, colour: string) => (
    <g>
      <line x1={x1} y1={y} x2={x2 + 10} y2={y} stroke={colour} strokeWidth={3.5} />
      <path d={`M ${x2} ${y} l 13 -7 v 14 z`} fill={colour} />
      <text x={(x1 + x2) / 2} y={y - 12} textAnchor="middle" fontSize={15} fontWeight={800} fill={colour}>{label}</text>
    </g>
  );
  return (
    <Svg viewBox="0 0 640 300" minWidth={520} label="To make a the subject of v² = u² + 2as, undo each step in reverse order: first subtract u², then divide by 2s.">
      <text x={10} y={26} fontSize={15} fontWeight={800} fill={INK}>How the formula is built (what happens to a):</text>
      {box(10, 44, 70, 'a', VIOLET, SOFT_VIOLET)}
      {right(80, 222, 67, '× 2s', GREEN)}
      {box(222, 44, 100, '2as', TEAL, SOFT_TEAL)}
      {right(322, 464, 67, '+ u²', GREEN)}
      {box(464, 44, 166, 'v² = u² + 2as', AMBER, SOFT_AMBER)}
      <text x={10} y={156} fontSize={15} fontWeight={800} fill={RED}>Making a the subject (undo the steps, backwards):</text>
      {box(464, 174, 166, 'v² = u² + 2as', AMBER, SOFT_AMBER)}
      {left(464, 322, 197, '- u²', RED)}
      {box(222, 174, 100, '2as', TEAL, SOFT_TEAL)}
      {left(222, 80, 197, '÷ 2s', RED)}
      {box(10, 174, 70, 'a', VIOLET, SOFT_VIOLET)}
      <text x={10} y={268} fontSize={18} fontWeight={800} fill={VIOLET}>a = (v² - u²) ÷ 2s</text>
      <text x={10} y={290} fontSize={13} fill={MUTED}>Whatever you do to one side, do to the other side.</text>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 14. substitution with brackets */

export const SubstituteBrackets = () => (
  <Svg viewBox="0 0 640 280" minWidth={500} label="Substituting x = −2 into y = x² − 3x: put −2 in brackets for every x. This gives (−2)² − 3(−2) = 4 + 6 = 10.">
    <text x={20} y={30} fontSize={15} fontWeight={800} fill={INK}>Work out y when x = -2</text>
    <text x={20} y={78} fontSize={26} fontWeight={800} fill={INK}>y = <tspan fill={VIOLET}>x</tspan><tspan fill={VIOLET} fontSize={16} dy={-12}>2</tspan><tspan dy={12}> - 3</tspan><tspan fill={VIOLET}>x</tspan></text>
    <text x={20} y={118} fontSize={14} fontWeight={800} fill={MUTED}>Put each x in a bracket with its number:</text>
    <rect x={64} y={138} width={72} height={38} rx={9} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={2.5} />
    <rect x={226} y={138} width={72} height={38} rx={9} fill={SOFT_VIOLET} stroke={VIOLET} strokeWidth={2.5} />
    <text x={20} y={167} fontSize={26} fontWeight={800} fill={INK}>y = <tspan x={72} fill={VIOLET}>(-2)</tspan><tspan fill={VIOLET} fontSize={16} dy={-12}>2</tspan><tspan x={158} dy={12}>- 3</tspan><tspan x={234} fill={VIOLET}>(-2)</tspan></text>
    <text x={20} y={222} fontSize={26} fontWeight={800} fill={INK}>y = 4 + 6</text>
    <text x={20} y={258} fontSize={26} fontWeight={800} fill={GREEN}>y = 10</text>
    <g transform="translate(350 60)">
      <rect x={0} y={0} width={270} height={160} rx={12} fill="#fef2f2" stroke={RED} strokeWidth={2} />
      <text x={135} y={30} textAnchor="middle" fontSize={14} fontWeight={800} fill={RED}>Why brackets matter</text>
      <text x={135} y={64} textAnchor="middle" fontSize={14} fill={INK}>(-2)² = (-2) × (-2) = 4</text>
      <text x={135} y={90} textAnchor="middle" fontSize={14} fill={INK}>-2² would mean -(2 × 2) = -4</text>
      <text x={135} y={122} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>- 3 × (-2) = + 6</text>
      <text x={135} y={144} textAnchor="middle" fontSize={12.5} fill={MUTED}>minus times minus is plus</text>
    </g>
  </Svg>
);

export const EQUATION_DIAGRAMS: Record<string, React.ComponentType> = {
  balanceLinear: BalanceLinear,
  balanceBoth: BalanceBoth,
  bracketBox: BracketBox,
  crossMultiply: CrossMultiply,
  simLines: SimLines,
  parabolaRoots: ParabolaRoots,
  factorBox: FactorBox,
  zeroProduct: ZeroProduct,
  completeSquare: CompleteSquare,
  formulaBox: FormulaBox,
  discriminantGraphs: DiscriminantGraphs,
  lineParabolaCases: LineParabolaCases,
  rectangleWord: RectangleWord,
  quadAngles: QuadAngles,
  trapeziumWord: TrapeziumWord,
  inverseMachine: InverseMachine,
  substituteBrackets: SubstituteBrackets,
};
