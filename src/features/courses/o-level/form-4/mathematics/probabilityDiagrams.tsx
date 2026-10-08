import React, { type ReactNode } from 'react';

/*
 * SVG diagrams for the Probabilities lesson.
 *
 * Each diagram is drawn on a fixed viewBox, scales with its container and never
 * drops below a readable width (the figure wrapper scrolls sideways on very
 * small screens). Colour is never the only signal: every highlighted part also
 * carries a label or a number.
 */

const INK = '#0f172a';
const MUTED = '#64748b';
const GRID = '#cbd5e1';
const VIOLET = '#7c3aed';
const VIOLET_SOFT = '#ede9fe';
const TEAL = '#0d9488';
const GREEN = '#16a34a';
const RED = '#dc2626';
const BROWN = '#92400e';
const AMBER = '#f59e0b';

const Svg = ({ viewBox, label, minWidth = 460, maxWidth = 680, children }: { viewBox: string; label: string; minWidth?: number; maxWidth?: number; children: ReactNode }) => (
  <svg viewBox={viewBox} role="img" aria-label={label} style={{ display: 'block', margin: '0 auto', width: '100%', minWidth, maxWidth, height: 'auto' }}>
    {children}
  </svg>
);

// Text with a white halo so it stays readable over lines and fills.
const Halo = ({ children, ...props }: React.SVGProps<SVGTextElement>) => (
  <text {...props} stroke="#fff" strokeWidth={4} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);

/* ------------------------------------------------------------------ 1. probability scale */

export const ProbScale = () => {
  const x0 = 50;
  const w = 540;
  const at = (p: number) => x0 + p * w;
  const marks = [
    { p: 0, word: 'Impossible', frac: '0', pct: '0%' },
    { p: 0.25, word: 'Unlikely', frac: '1/4', pct: '25%' },
    { p: 0.5, word: 'Even chance', frac: '1/2', pct: '50%' },
    { p: 0.75, word: 'Likely', frac: '3/4', pct: '75%' },
    { p: 1, word: 'Certain', frac: '1', pct: '100%' },
  ];
  const examples = [
    { p: 0, text: 'Rolling a 7 on one die', anchor: 'start' as const },
    { p: 0.5, text: 'Tossing a head', anchor: 'middle' as const },
    { p: 1, text: 'Rolling less than 7', anchor: 'end' as const },
  ];
  return (
    <Svg viewBox="0 0 640 200" label="Probability scale from 0 (impossible) to 1 (certain), with 1/2 an even chance">
      <defs>
        <linearGradient id="pscale" x1="0" x2="1">
          <stop offset="0" stopColor="#fca5a5" />
          <stop offset="0.5" stopColor="#fde68a" />
          <stop offset="1" stopColor="#86efac" />
        </linearGradient>
      </defs>
      {examples.map((e) => (
        <g key={e.text}>
          <text x={at(e.p)} y={26} textAnchor={e.anchor} fontSize={15} fontWeight={700} fill={INK}>{e.text}</text>
          <path d={`M ${at(e.p)} 64 l -8 -12 h 16 z`} fill={VIOLET} />
        </g>
      ))}
      <rect x={x0} y={68} width={w} height={28} rx={14} fill="url(#pscale)" stroke={GRID} />
      {marks.map((m) => (
        <g key={m.word}>
          <line x1={at(m.p)} y1={68} x2={at(m.p)} y2={104} stroke={INK} strokeWidth={2} />
          <text x={at(m.p)} y={126} textAnchor={m.p === 0 ? 'start' : m.p === 1 ? 'end' : 'middle'} dx={m.p === 0 ? -8 : m.p === 1 ? 8 : 0} fontSize={15} fontWeight={800} fill={INK}>{m.word}</text>
          <text x={at(m.p)} y={150} textAnchor="middle" fontSize={18} fontWeight={800} fill={VIOLET}>{m.frac}</text>
          <text x={at(m.p)} y={172} textAnchor="middle" fontSize={13} fill={MUTED}>{m.pct}</text>
        </g>
      ))}
    </Svg>
  );
};

/* ------------------------------------------------------------------ 2. die faces */

const PIPS: Record<number, [number, number][]> = {
  1: [[0.5, 0.5]],
  2: [[0.28, 0.28], [0.72, 0.72]],
  3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
  4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
  5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
  6: [[0.28, 0.25], [0.72, 0.25], [0.28, 0.5], [0.72, 0.5], [0.28, 0.75], [0.72, 0.75]],
};

export const DieFaces = () => {
  const size = 72;
  const gap = 16;
  const start = (640 - (6 * size + 5 * gap)) / 2;
  return (
    <Svg viewBox="0 0 640 200" label="The six faces of a die. The even faces 2, 4 and 6 are highlighted: 3 out of 6.">
      {[1, 2, 3, 4, 5, 6].map((n, i) => {
        const x = start + i * (size + gap);
        const even = n % 2 === 0;
        return (
          <g key={n}>
            <rect x={x} y={24} width={size} height={size} rx={14} fill={even ? VIOLET_SOFT : '#f8fafc'} stroke={even ? VIOLET : '#94a3b8'} strokeWidth={even ? 3 : 2} />
            {PIPS[n].map(([px, py], k) => <circle key={k} cx={x + px * size} cy={24 + py * size} r={6.5} fill={even ? VIOLET : INK} />)}
            <text x={x + size / 2} y={128} textAnchor="middle" fontSize={18} fontWeight={800} fill={even ? VIOLET : MUTED}>{n}</text>
          </g>
        );
      })}
      <rect x={start} y={146} width={16} height={16} rx={4} fill={VIOLET_SOFT} stroke={VIOLET} strokeWidth={2} />
      <text x={start + 26} y={159} fontSize={15} fontWeight={700} fill={INK}>Even number: 2, 4, 6 → 3 favourable outcomes out of 6 possible outcomes</text>
      <text x={start + 26} y={183} fontSize={15} fill={MUTED}>P(even) = 3/6 = 1/2</text>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 3. bag of balls */

export const BagOfBalls = () => {
  const colours = [
    ...Array(3).fill(GREEN),
    ...Array(5).fill(RED),
    ...Array(12).fill(BROWN),
  ];
  const cell = 40;
  const gx = 150 - (5 * cell) / 2;
  const gy = 92;
  return (
    <Svg viewBox="0 0 640 290" label="A bag of 20 balls: 3 green, 5 red and 12 brown">
      <path d="M 70 78 C 70 60 120 62 148 54 L 150 36 L 162 36 L 164 54 C 192 62 232 60 232 78 C 262 104 292 150 292 206 C 292 262 240 278 150 278 C 60 278 8 262 8 206 C 8 150 40 104 70 78 Z" fill="#fef3c7" stroke="#b45309" strokeWidth={3} />
      <path d="M 134 36 Q 156 20 178 36" fill="none" stroke="#b45309" strokeWidth={4} strokeLinecap="round" />
      {colours.map((c, i) => (
        <circle key={i} cx={gx + (i % 5) * cell + cell / 2} cy={gy + Math.floor(i / 5) * cell + cell / 2} r={15} fill={c} stroke="#fff" strokeWidth={2} />
      ))}
      <text x={150} y={268} textAnchor="middle" fontSize={15} fontWeight={800} fill="#78350f">20 balls</text>
      {[
        { c: GREEN, n: 3, name: 'green', p: '3/20' },
        { c: RED, n: 5, name: 'red', p: '5/20 = 1/4' },
        { c: BROWN, n: 12, name: 'brown', p: '12/20 = 3/5' },
      ].map((row, i) => (
        <g key={row.name} transform={`translate(340 ${60 + i * 62})`}>
          <circle cx={18} cy={18} r={17} fill={row.c} />
          <text x={48} y={14} fontSize={16} fontWeight={800} fill={INK}>{row.n} {row.name}</text>
          <text x={48} y={36} fontSize={16} fontWeight={700} fill={VIOLET}>P({row.name}) = {row.p}</text>
        </g>
      ))}
      <line x1={340} y1={250} x2={620} y2={250} stroke={GRID} />
      <text x={340} y={274} fontSize={14} fill={MUTED}>3 + 5 + 12 = 20, and 3/20 + 5/20 + 12/20 = 1</text>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 4. Venn: mutually exclusive or not */

export const VennMutual = () => (
  <Svg viewBox="0 0 640 270" label="Two Venn diagrams. Left: circles that do not overlap are mutually exclusive. Right: overlapping circles are not.">
    <text x={160} y={24} textAnchor="middle" fontSize={16} fontWeight={800} fill={GREEN}>Mutually exclusive</text>
    <rect x={10} y={36} width={300} height={170} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
    <circle cx={90} cy={121} r={50} fill="#14b8a6" fillOpacity={0.22} stroke={TEAL} strokeWidth={3} />
    <circle cx={230} cy={121} r={50} fill={VIOLET} fillOpacity={0.2} stroke={VIOLET} strokeWidth={3} />
    <text x={90} y={118} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK}>2</text>
    <text x={90} y={138} textAnchor="middle" fontSize={13} fill={MUTED}>A: get a 2</text>
    <text x={230} y={118} textAnchor="middle" fontSize={20} fontWeight={800} fill={INK}>5</text>
    <text x={230} y={138} textAnchor="middle" fontSize={13} fill={MUTED}>B: get a 5</text>
    <text x={160} y={232} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>The circles do not touch.</text>
    <text x={160} y={252} textAnchor="middle" fontSize={14} fill={MUTED}>A and B cannot happen together.</text>

    <text x={480} y={24} textAnchor="middle" fontSize={16} fontWeight={800} fill={RED}>Not mutually exclusive</text>
    <rect x={330} y={36} width={300} height={170} rx={10} fill="#f8fafc" stroke={GRID} strokeWidth={2} />
    <circle cx={438} cy={121} r={60} fill="#14b8a6" fillOpacity={0.22} stroke={TEAL} strokeWidth={3} />
    <circle cx={512} cy={121} r={60} fill={VIOLET} fillOpacity={0.2} stroke={VIOLET} strokeWidth={3} />
    <text x={412} y={127} textAnchor="middle" fontSize={18} fontWeight={800} fill={INK}>4, 6</text>
    <text x={475} y={127} textAnchor="middle" fontSize={22} fontWeight={800} fill={RED}>2</text>
    <text x={540} y={127} textAnchor="middle" fontSize={18} fontWeight={800} fill={INK}>1</text>
    <text x={412} y={196} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEAL}>Even</text>
    <text x={540} y={196} textAnchor="middle" fontSize={13} fontWeight={700} fill={VIOLET}>Less than 3</text>
    <text x={480} y={232} textAnchor="middle" fontSize={14} fontWeight={700} fill={INK}>The circles overlap at 2.</text>
    <text x={480} y={252} textAnchor="middle" fontSize={14} fill={MUTED}>2 is even AND less than 3.</text>
  </Svg>
);

/* ------------------------------------------------------------------ 5. coin and die grid */

export const CoinDieGrid = () => {
  const cw = 64;
  const ch = 52;
  const gx = 110;
  const gy = 60;
  return (
    <Svg viewBox="0 0 640 230" label="Grid of the 12 outcomes when a coin is tossed and a die is thrown. Only Head with 6 is highlighted: 1 out of 12.">
      <text x={gx + (6 * cw) / 2} y={22} textAnchor="middle" fontSize={14} fontWeight={700} fill={MUTED}>Die</text>
      <text x={40} y={gy + ch} textAnchor="middle" fontSize={14} fontWeight={700} fill={MUTED}>Coin</text>
      {[1, 2, 3, 4, 5, 6].map((n, c) => <text key={n} x={gx + c * cw + cw / 2} y={gy - 10} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{n}</text>)}
      {['H', 'T'].map((side, r) => (
        <g key={side}>
          <text x={gx - 18} y={gy + r * ch + ch / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{side}</text>
          {[1, 2, 3, 4, 5, 6].map((n, c) => {
            const hit = side === 'H' && n === 6;
            return (
              <g key={n}>
                <rect x={gx + c * cw} y={gy + r * ch} width={cw} height={ch} fill={hit ? VIOLET : '#fff'} stroke={GRID} strokeWidth={2} />
                <text x={gx + c * cw + cw / 2} y={gy + r * ch + ch / 2 + 5} textAnchor="middle" fontSize={15} fontWeight={hit ? 800 : 500} fill={hit ? '#fff' : MUTED}>{side},{n}</text>
              </g>
            );
          })}
        </g>
      ))}
      <text x={320} y={196} textAnchor="middle" fontSize={15} fontWeight={700} fill={INK}>12 equally likely outcomes. Only 1 is (Head, 6).</text>
      <text x={320} y={218} textAnchor="middle" fontSize={15} fill={VIOLET} fontWeight={800}>P(head and 6) = 1/2 × 1/6 = 1/12</text>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 6. with / without replacement */

const BagBox = ({ x, y, n, label, colour }: { x: number; y: number; n: number; label: string; colour: string }) => (
  <g>
    <rect x={x} y={y} width={120} height={62} rx={14} fill="#fef3c7" stroke={colour} strokeWidth={3} />
    <text x={x + 60} y={y + 30} textAnchor="middle" fontSize={22} fontWeight={800} fill={INK}>{n}</text>
    <text x={x + 60} y={y + 50} textAnchor="middle" fontSize={13} fill={MUTED}>{label}</text>
  </g>
);

export const ReplacementBags = () => (
  <Svg viewBox="0 0 640 300" label="With replacement the bag still has 20 balls for the second pick. Without replacement it has 19.">
    <text x={160} y={22} textAnchor="middle" fontSize={16} fontWeight={800} fill={GREEN}>With replacement</text>
    <BagBox x={100} y={36} n={20} label="balls in the bag" colour={GREEN} />
    <path d="M 160 100 v 36" stroke={INK} strokeWidth={2.5} markerEnd="none" />
    <path d="M 152 128 l 8 12 l 8 -12 z" fill={INK} />
    <Halo x={172} y={124} fontSize={13} fontWeight={700} fill={INK}>pick one, note it, put it back</Halo>
    <BagBox x={100} y={146} n={20} label="balls again" colour={GREEN} />
    <rect x={20} y={226} width={280} height={56} rx={10} fill="#f0fdf4" stroke={GREEN} />
    <text x={160} y={248} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>The 2nd pick is the same as the 1st.</text>
    <text x={160} y={268} textAnchor="middle" fontSize={14} fill={MUTED}>The bottom number stays 20.</text>

    <text x={480} y={22} textAnchor="middle" fontSize={16} fontWeight={800} fill={RED}>Without replacement</text>
    <BagBox x={420} y={36} n={20} label="balls in the bag" colour={RED} />
    <path d="M 480 100 v 36" stroke={INK} strokeWidth={2.5} />
    <path d="M 472 128 l 8 12 l 8 -12 z" fill={INK} />
    <Halo x={492} y={124} fontSize={13} fontWeight={700} fill={INK}>pick one and keep it out</Halo>
    <BagBox x={420} y={146} n={19} label="balls left" colour={RED} />
    <rect x={340} y={226} width={280} height={56} rx={10} fill="#fef2f2" stroke={RED} />
    <text x={480} y={248} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>The bag has changed.</text>
    <text x={480} y={268} textAnchor="middle" fontSize={14} fill={MUTED}>The bottom number drops to 19.</text>
  </Svg>
);

/* ------------------------------------------------------------------ 7. two dice table */

export const TwoDice = ({ mode }: { mode: 'sum7' | 'six' }) => {
  const cs = 52;
  const gx = 96;
  const gy = 74;
  const hit = (a: number, b: number) => (mode === 'sum7' ? a + b === 7 : a === 6 || b === 6);
  const colour = mode === 'sum7' ? VIOLET : AMBER;
  const count = mode === 'sum7' ? 6 : 11;
  return (
    <Svg viewBox="0 0 440 440" minWidth={300} maxWidth={500} label={mode === 'sum7' ? 'Table of all 36 totals from two dice, with the six totals of 7 highlighted' : 'Table of all 36 totals from two dice, with the 11 cells that contain at least one six highlighted'}>
      <text x={gx + (6 * cs) / 2} y={26} textAnchor="middle" fontSize={14} fontWeight={700} fill={MUTED}>First die</text>
      <text transform={`translate(26 ${gy + (6 * cs) / 2}) rotate(-90)`} textAnchor="middle" fontSize={14} fontWeight={700} fill={MUTED}>Second die</text>
      {[1, 2, 3, 4, 5, 6].map((n, i) => (
        <g key={n}>
          <text x={gx + i * cs + cs / 2} y={gy - 14} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{n}</text>
          <text x={gx - 16} y={gy + i * cs + cs / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={800} fill={INK}>{n}</text>
        </g>
      ))}
      {[1, 2, 3, 4, 5, 6].map((b, r) => [1, 2, 3, 4, 5, 6].map((a, c) => {
        const on = hit(a, b);
        return (
          <g key={`${a}-${b}`}>
            <rect x={gx + c * cs} y={gy + r * cs} width={cs} height={cs} fill={on ? colour : '#fff'} fillOpacity={on ? (mode === 'sum7' ? 1 : 0.9) : 1} stroke={GRID} strokeWidth={1.5} />
            <text x={gx + c * cs + cs / 2} y={gy + r * cs + cs / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={on ? 800 : 500} fill={on ? (mode === 'sum7' ? '#fff' : INK) : MUTED}>{a + b}</text>
          </g>
        );
      }))}
      <text x={gx + (6 * cs) / 2} y={gy + 6 * cs + 30} textAnchor="middle" fontSize={15} fontWeight={700} fill={INK}>
        {mode === 'sum7' ? 'The total is 7 in 6 of the 36 cells' : 'At least one 6 shows in 11 of the 36 cells'}
      </text>
      <text x={gx + (6 * cs) / 2} y={gy + 6 * cs + 54} textAnchor="middle" fontSize={17} fontWeight={800} fill={VIOLET}>
        {mode === 'sum7' ? 'P(total 7) = 6/36 = 1/6' : `P(at least one 6) = ${count}/36`}
      </text>
    </Svg>
  );
};

/* ------------------------------------------------------------------ 8. tree diagrams */

type Leaf = { label: string; p: string; outcome: string; hit?: boolean };
type Branch = { label: string; p: string; colour: string; leaves: Leaf[] };

const Tree = ({ title, first, second, branches, ariaLabel, legend }: { title: string; first: string; second: string; branches: Branch[]; ariaLabel: string; legend: string }) => {
  const rowH = 54;
  const top = 58;
  const rootX = 34;
  const x1 = 196;
  const x2 = 376;
  const leafCount = branches.reduce((n, b) => n + b.leaves.length, 0);
  const height = top + leafCount * rowH + 30;
  let row = 0;
  const laid = branches.map((b) => {
    const leaves = b.leaves.map((l) => ({ ...l, y: top + row++ * rowH + rowH / 2 }));
    return { ...b, leaves, y: (leaves[0].y + leaves[leaves.length - 1].y) / 2 };
  });
  const rootY = (laid[0].y + laid[laid.length - 1].y) / 2;
  // Position a probability label part of the way along a line.
  const mid = (xa: number, ya: number, xb: number, yb: number, t = 0.52) => ({ x: xa + (xb - xa) * t, y: ya + (yb - ya) * t });
  return (
    <Svg viewBox={`0 0 660 ${height}`} minWidth={520} label={ariaLabel}>
      <text x={0} y={18} fontSize={15} fontWeight={800} fill={INK}>{title}</text>
      <text x={x1} y={44} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>{first}</text>
      <text x={x2} y={44} textAnchor="middle" fontSize={13} fontWeight={700} fill={MUTED}>{second}</text>
      <text x={x2 + 36} y={44} fontSize={13} fontWeight={700} fill={MUTED}>Outcome and probability</text>
      {laid.map((b, bi) => {
        const m = mid(rootX, rootY, x1, b.y);
        return (
          <g key={bi}>
            <line x1={rootX} y1={rootY} x2={x1} y2={b.y} stroke="#475569" strokeWidth={2.5} />
            <Halo x={m.x} y={m.y + (bi < branches.length / 2 ? -9 : 20)} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK}>{b.p}</Halo>
            {b.leaves.map((l, li) => {
              const lm = mid(x1, b.y, x2, l.y);
              return (
                <g key={li}>
                  <line x1={x1} y1={b.y} x2={x2} y2={l.y} stroke={l.hit ? VIOLET : '#475569'} strokeWidth={l.hit ? 4 : 2.5} />
                  <Halo x={lm.x} y={lm.y + (li < b.leaves.length / 2 ? -9 : 20)} textAnchor="middle" fontSize={15} fontWeight={800} fill={l.hit ? VIOLET : INK}>{l.p}</Halo>
                  <circle cx={x2} cy={l.y} r={15} fill={l.hit ? VIOLET : '#fff'} stroke={l.hit ? VIOLET : '#475569'} strokeWidth={2.5} />
                  <text x={x2} y={l.y + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill={l.hit ? '#fff' : INK}>{l.label}</text>
                  <text x={x2 + 36} y={l.y + 5} fontSize={15} fontWeight={l.hit ? 800 : 600} fill={l.hit ? VIOLET : INK}>{l.outcome}</text>
                </g>
              );
            })}
            <circle cx={x1} cy={b.y} r={16} fill={b.colour} stroke="#fff" strokeWidth={2} />
            <text x={x1} y={b.y + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill="#fff">{b.label}</text>
          </g>
        );
      })}
      <circle cx={rootX} cy={rootY} r={7} fill={INK} />
      <text x={0} y={height - 8} fontSize={13} fill={MUTED}>{legend}</text>
    </Svg>
  );
};

// ZIMSEC November 2023, Paper 1, Question 22: the striker.
export const TreeStriker = () => (
  <Tree
    legend="S = scores  ·  N = does not score  ·  Purple path = scores in both halves"
    title="Den the striker: scoring in each half"
    first="1st half"
    second="2nd half"
    ariaLabel="Tree diagram for a striker. First half: scores 0.6, does not score 0.4. If he scored, second half: scores 0.8, does not score 0.2. If he did not score, second half: 0.5 and 0.5. Scoring in both halves is 0.6 times 0.8, which is 0.48."
    branches={[
      { label: 'S', p: '0.6', colour: GREEN, leaves: [
        { label: 'S', p: '0.8', outcome: 'S, S:  0.6 × 0.8 = 0.48', hit: true },
        { label: 'N', p: '0.2', outcome: 'S, N:  0.6 × 0.2 = 0.12' },
      ] },
      { label: 'N', p: '0.4', colour: RED, leaves: [
        { label: 'S', p: '0.5', outcome: 'N, S:  0.4 × 0.5 = 0.20' },
        { label: 'N', p: '0.5', outcome: 'N, N:  0.4 × 0.5 = 0.20' },
      ] },
    ]}
  />
);

// Two balls from 3 red and 2 blue, put back each time.
export const TreeWith = () => (
  <Tree
    legend="R = red ball  ·  B = blue ball  ·  Purple paths = the two balls are different colours"
    title="3 red and 2 blue balls. The first ball is put back."
    first="1st ball"
    second="2nd ball"
    ariaLabel="Tree diagram with replacement for 3 red and 2 blue balls. Every second-pick branch has the same probabilities as the first pick. The two paths with different colours are highlighted and total 12 over 25."
    branches={[
      { label: 'R', p: '3/5', colour: RED, leaves: [
        { label: 'R', p: '3/5', outcome: 'R, R:  3/5 × 3/5 = 9/25' },
        { label: 'B', p: '2/5', outcome: 'R, B:  3/5 × 2/5 = 6/25', hit: true },
      ] },
      { label: 'B', p: '2/5', colour: '#2563eb', leaves: [
        { label: 'R', p: '3/5', outcome: 'B, R:  2/5 × 3/5 = 6/25', hit: true },
        { label: 'B', p: '2/5', outcome: 'B, B:  2/5 × 2/5 = 4/25' },
      ] },
    ]}
  />
);

// Two balls from 3 red and 2 blue, not put back.
export const TreeWithout = () => (
  <Tree
    legend="R = red ball  ·  B = blue ball  ·  Purple paths = the two balls are different colours"
    title="3 red and 2 blue balls. The first ball is NOT put back."
    first="1st ball"
    second="2nd ball"
    ariaLabel="Tree diagram without replacement for 3 red and 2 blue balls. After a red the second pick has 2 red and 2 blue left. After a blue it has 3 red and 1 blue left. The two paths with different colours are highlighted and total 12 over 20."
    branches={[
      { label: 'R', p: '3/5', colour: RED, leaves: [
        { label: 'R', p: '2/4', outcome: 'R, R:  3/5 × 2/4 = 6/20' },
        { label: 'B', p: '2/4', outcome: 'R, B:  3/5 × 2/4 = 6/20', hit: true },
      ] },
      { label: 'B', p: '2/5', colour: '#2563eb', leaves: [
        { label: 'R', p: '3/4', outcome: 'B, R:  2/5 × 3/4 = 6/20', hit: true },
        { label: 'B', p: '1/4', outcome: 'B, B:  2/5 × 1/4 = 2/20' },
      ] },
    ]}
  />
);

export const PROBABILITY_DIAGRAMS: Record<string, React.ComponentType> = {
  probScale: ProbScale,
  dieFaces: DieFaces,
  bagBalls: BagOfBalls,
  vennMutual: VennMutual,
  coinDieGrid: CoinDieGrid,
  replacementBags: ReplacementBags,
  twoDiceSeven: () => <TwoDice mode="sum7" />,
  twoDiceSix: () => <TwoDice mode="six" />,
  treeStriker: TreeStriker,
  treeWith: TreeWith,
  treeWithout: TreeWithout,
};
