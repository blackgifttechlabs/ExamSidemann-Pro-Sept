import React, { type ReactNode } from 'react';
import { Plane, Seg, Dot, Tag, delay, type Frame, VIOLET, BLUE, RED, GREEN, INK } from './geometryDiagrams';

const Curve = ({ f, fn, from, to, color = VIOLET, at = 0, dashed, width = 3.5 }: { f: Frame; fn: (x: number) => number; from: number; to: number; color?: string; at?: number; dashed?: boolean; width?: number }) => {
  let d = '';
  for (let i = 0; i <= 200; i++) { const x = from + (to - from) * i / 200, y = fn(x); d += `${i ? 'L' : 'M'}${f.X(x).toFixed(1)},${f.Y(y).toFixed(1)} `; }
  return <path className={dashed ? 'geo-fade' : 'geo-draw'} pathLength={1} style={delay(at)} d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={dashed ? '6 4' : undefined} />;
};
const Point = ({ f, at, p = 0.5, color = VIOLET, r = 5 }: { f: Frame; at: [number, number]; p?: number; color?: string; r?: number }) =>
  <circle className="geo-fade" style={delay(p)} cx={f.X(at[0])} cy={f.Y(at[1])} r={r} fill={color} />;
const Frame2 = ({ label, children, caption }: { label: string; children: ReactNode; caption: string }) =>
  <svg viewBox="0 0 590 360" className="mx-auto w-full max-w-2xl" role="img" aria-label={label}><title>{label}</title><rect width="590" height="360" fill="white" />{children}
    <text x="295" y="350" textAnchor="middle" fontSize="14" fill="#334155">{caption}</text></svg>;

const SequenceDiagram = () => <Plane label="A sequence is a list of values. The graph of uₙ = 3n − 2 is a set of separate points, not a line" xMin={-0.5} xMax={7} yMin={-1} yMax={18} equal={false} yStep={2} caption="uₙ = 3n − 2 is a set of separate points">{f => <>
  {[1, 2, 3, 4, 5, 6].map(k => <g key={k}><Point f={f} at={[k, 3 * k - 2]} p={0.2 * k} /><Tag f={f} at={[k + 0.15, 3 * k - 2 - 1.1]} text={`u${'₁₂₃₄₅₆'[k - 1]} = ${3 * k - 2}`} p={0.2 * k + 0.2} /></g>)}
  <Tag f={f} at={[0.3, 16.5]} text="uₙ = 3n − 2" color={VIOLET} p={0.4} /></>}</Plane>;
const APDiagram = () => <Plane label="An arithmetic progression adds the same amount each time: 2, 5, 8, 11, … The points lie on a straight line" xMin={-0.5} xMax={7.5} yMin={-1} yMax={19} equal={false} yStep={2} caption="AP: the same amount is added each time">{f => <>
  <Seg f={f} a={[1, 2]} b={[6, 17]} color="#c4b5fd" width={2} dashed />
  {[1, 2, 3, 4, 5, 6].map(k => <Point key={k} f={f} at={[k, 3 * k - 1]} p={0.2 * k} />)}
  {[1, 2, 3].map(k => <g key={k}><Seg f={f} a={[k, 3 * k - 1]} b={[k + 1, 3 * k - 1]} color={BLUE} at={1.2 + k * 0.3} width={2.5} /><Seg f={f} a={[k + 1, 3 * k - 1]} b={[k + 1, 3 * k + 2]} color={RED} at={1.4 + k * 0.3} width={2.5} arrow="r" /></g>)}
  <Tag f={f} at={[4.6, 6.2]} text="+3 each step: d = 3" color={RED} p={2.4} /><Tag f={f} at={[0.3, 18]} text="uₙ = a + (n − 1)d" color={VIOLET} p={0.6} /></>}</Plane>;
const GPDiagram = () => <Plane label="A geometric progression multiplies by the same amount each time: 3, 6, 12, 24, 48, 96, …" xMin={0} xMax={7.5} yMin={0} yMax={105} equal={false} yStep={10} caption="GP: the same multiplier each time">{f => <>
  {[1, 2, 3, 4, 5, 6].map(k => { const v = 3 * 2 ** (k - 1); return <g key={k}>
    <rect className="geo-fade" style={delay(0.2 * k)} x={f.X(k - 0.3)} y={f.Y(v)} width={f.X(k + 0.3) - f.X(k - 0.3)} height={f.Y(0) - f.Y(v)} fill={VIOLET} opacity="0.8" />
    <Tag f={f} at={[k, v + 4]} text={`${v}`} anchor="middle" p={0.2 * k + 0.2} /></g>; })}
  <Tag f={f} at={[0.5, 98]} text="uₙ = ar^(n − 1), r = 2" color={VIOLET} p={0.5} /><Tag f={f} at={[1.6, 60]} text="× 2 each step" color={RED} p={1.8} /></>}</Plane>;
const ConvergenceDiagram = () => {
  const S = (k: number) => 16 * (1 - 0.5 ** k);
  return <Plane label="Partial sums of 8 + 4 + 2 + 1 + … get closer and closer to 16, the sum to infinity" xMin={-0.5} xMax={9} yMin={0} yMax={18} equal={false} yStep={2} caption="Partial sums approach the sum to infinity">{f => <>
    <Seg f={f} a={[0, 16]} b={[9, 16]} color={RED} dashed at={0.3} />
    {[1, 2, 3, 4, 5, 6, 7, 8].map(k => <Point key={k} f={f} at={[k, S(k)]} p={0.25 * k} />)}
    {[1, 2, 3, 4].map(k => <Tag key={k} f={f} at={[k + 0.25, S(k) - 0.9]} text={`S${'₁₂₃₄'[k - 1]} = ${S(k)}`} p={0.25 * k + 0.2} />)}
    <Tag f={f} at={[8.9, 16.7]} text="S∞ = 16" color={RED} anchor="end" p={0.5} /></>}</Plane>;
};
const SigmaDiagram = () => {
  const cell = 34, ox = 150, oy = 300;
  return <Frame2 label="Adding 1 + 2 + 3 + 4 + 5 twice makes a rectangle 5 wide and 6 tall, so the sum is 5 × 6 ÷ 2 = 15" caption="Σr = n(n + 1)/2: two copies fit together to make an n by (n + 1) rectangle">
    {[1, 2, 3, 4, 5].map(c => <g key={c}>
      {Array.from({ length: c }, (_, k) => <circle key={`a${k}`} className="geo-fade" style={delay(0.15 * c)} cx={ox + c * cell} cy={oy - k * cell} r="11" fill={VIOLET} />)}
      {Array.from({ length: 6 - c }, (_, k) => <circle key={`b${k}`} className="geo-fade" style={delay(1.2 + 0.15 * c)} cx={ox + c * cell} cy={oy - (c + k) * cell} r="11" fill={BLUE} />)}</g>)}
    <text x="400" y="150" fontSize="15" fontWeight="700" fill={VIOLET}>1 + 2 + 3 + 4 + 5</text><text x="400" y="176" fontSize="15" fontWeight="700" fill={BLUE}>5 + 4 + 3 + 2 + 1</text>
    <text x="400" y="210" fontSize="15" fontWeight="700" fill={INK}>2Σr = 5 × 6 = 30</text><text x="400" y="236" fontSize="15" fontWeight="700" fill={INK}>Σr = 15</text></Frame2>;
};
const TelescopeDiagram = () => {
  const terms: [string, string][] = [['1', '1/2'], ['1/2', '1/3'], ['1/3', '1/4'], ['1/4', '1/5']];
  return <Frame2 label="In a telescoping sum, the second part of each bracket cancels the first part of the next" caption="Σ 1/[r(r + 1)]: everything cancels except the very first and very last parts">
    {terms.map(([a, b], i) => { const x = 40 + i * 130;
      return <g key={i}><rect className="geo-fade" style={delay(0.2 * i)} x={x} y="110" width="112" height="56" rx="12" fill="#f5f3ff" stroke={VIOLET} strokeWidth="2" />
        <text className="geo-fade" style={delay(0.2 * i)} x={x + 56} y="146" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK}>{a} − {b}</text>
        {i < 3 && <path className="geo-draw" pathLength={1} style={delay(1.2 + 0.3 * i)} d={`M${x + 90},112 Q${x + 120},60 ${x + 150},112`} fill="none" stroke={RED} strokeWidth="2.5" />}
        {i < 3 && <text className="geo-fade" style={delay(1.5 + 0.3 * i)} x={x + 120} y="72" textAnchor="middle" fontSize="13" fontWeight="700" fill={RED}>cancel</text>}</g>; })}
    <text className="geo-fade" style={delay(2.6)} x="295" y="240" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK}>Sum = 1 − 1/5   (first part and last part)</text>
    <text className="geo-fade" style={delay(2.8)} x="295" y="270" textAnchor="middle" fontSize="15" fill="#475569">With n brackets the sum is 1 − 1/(n + 1)</text></Frame2>;
};
const PascalDiagram = () => {
  const rows = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1], [1, 6, 15, 20, 15, 6, 1]];
  return <Frame2 label="Pascal's triangle: each number is the sum of the two above it. Row n gives the coefficients of (a + b)ⁿ" caption="Row 4 is 1, 4, 6, 4, 1, so (1 + x)⁴ = 1 + 4x + 6x² + 4x³ + x⁴">
    {rows.map((row, i) => row.map((v, j) => { const x = 295 + (j - (row.length - 1) / 2) * 60, y = 40 + i * 42;
      return <g key={`${i}-${j}`} className="geo-fade" style={delay(0.15 * i)}><text x={x} y={y + 6} textAnchor="middle" fontSize="20" fontWeight={i === 4 ? 800 : 500} fill={i === 4 ? RED : INK}>{v}</text></g>; }))}
    <text className="geo-fade" style={delay(1.4)} x="40" y="40" fontSize="13" fill="#64748b">row 0</text><text className="geo-fade" style={delay(1.4)} x="40" y="208" fontSize="13" fontWeight="700" fill={RED}>row 4</text>
    <text className="geo-fade" style={delay(1.6)} x="470" y="124" fontSize="14" fontWeight="700" fill={GREEN}>3 + 3 = 6</text></Frame2>;
};
const BinomApproxDiagram = () => <Plane label="Adding terms of the binomial series makes the polynomial hug √(1 + x) more closely, but only for |x| < 1" xMin={-1.2} xMax={2.2} yMin={0} yMax={2} caption="The series fits only inside −1 < x < 1">{f => <>
  <Seg f={f} a={[-1, 0]} b={[-1, 2]} color={RED} dashed /><Seg f={f} a={[1, 0]} b={[1, 2]} color={RED} dashed />
  <Curve f={f} fn={x => 1 + x / 2} from={-1} to={2.2} color="#94a3b8" at={0.3} width={2.5} />
  <Curve f={f} fn={x => 1 + x / 2 - x * x / 8} from={-1} to={2.2} color={BLUE} at={0.8} width={2.5} />
  <Curve f={f} fn={x => 1 + x / 2 - x * x / 8 + x ** 3 / 16} from={-1} to={2.2} color={GREEN} at={1.3} width={2.5} />
  <Curve f={f} fn={x => Math.sqrt(1 + x)} from={-1} to={2.2} color={VIOLET} at={0} width={4} />
  <Tag f={f} at={[-0.95, 1.9]} text="valid: −1 < x < 1" color={RED} p={1.8} /><Tag f={f} at={[1.5, 1.28]} text="√(1 + x)" color={VIOLET} p={1.8} /><Tag f={f} at={[-0.4, 0.15]} text="1 + x/2" color="#64748b" p={1.8} /></>}</Plane>;
const CobwebDiagram = () => {
  const g = (x: number) => Math.cbrt(x + 1); const path: [number, number][] = [[1, 0]]; let x = 1;
  for (let i = 0; i < 5; i++) { const y = g(x); path.push([x, y]); path.push([y, y]); x = y; }
  return <Plane label="Iteration x → ∛(x + 1) starting at 1 spirals in to the root near 1.3247, where the curve meets y = x" xMin={0} xMax={2.2} yMin={0} yMax={2.2} caption="Iteration spirals in to the root">{f => <>
    <Curve f={f} fn={g} from={0} to={2.2} color={VIOLET} at={0} /><Seg f={f} a={[0, 0]} b={[2.2, 2.2]} color={BLUE} at={0.3} />
    {path.slice(1).map((pt, i) => <Seg key={i} f={f} a={path[i]} b={pt} color={RED} at={1 + i * 0.35} width={2} />)}
    <Dot f={f} at={[1.3247, 1.3247]} name="root ≈ 1.3247" dx={-132} dy={-12} p={3} color={GREEN} /><Tag f={f} at={[1.55, 1.18]} text="y = ∛(x + 1)" color={VIOLET} p={1} /><Tag f={f} at={[0.15, 1.85]} text="y = x" color={BLUE} p={1} /></>}</Plane>;
};
const Sources = () => <div className="space-y-3 p-3 text-sm leading-relaxed">
  <h4 className="font-bold text-slate-900">About these questions</h4>
  <p>All 100 questions in this topic are practice questions written for the Form 5 Series and Sequences scope. Every answer was calculated by computer from the numbers in the question, then the written steps were read through. None is copied from a past paper, so none is labelled as a ZIMSEC question.</p>
  <p>To practise with real ZIMSEC questions, look for Pure Mathematics 6042 Paper 1 and Paper 2 on the official ZIMSEC website, and for the examiner reports, which explain where marks were lost.</p>
  <a href="https://www5.zimsec.co.zw/download/advanced-level-pure-mathematics-6042-02-november-2022-examiner-report/" target="_blank" rel="noopener noreferrer" className="block font-semibold text-violet-700 underline">ZIMSEC examiner report • Pure Mathematics 6042/2 • November 2022</a>
  <p>Treat topic labels in this lesson as a study guide, and check them against your own copy of the syllabus.</p>
</div>;
export const SERIES_DIAGRAMS = {
  sources: Sources, sequence: SequenceDiagram, ap: APDiagram, gp: GPDiagram, convergence: ConvergenceDiagram, sigma: SigmaDiagram,
  telescope: TelescopeDiagram, pascal: PascalDiagram, binomapprox: BinomApproxDiagram, cobweb: CobwebDiagram,
};
