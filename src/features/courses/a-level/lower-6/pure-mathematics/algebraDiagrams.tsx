import React from 'react';
import { powerTokens } from '../../../o-level/form-4/mathematics/mathPowers';
import { PAPER_SOURCES } from './algebraPastPapers';
type Curve = { fn: (x: number) => number; color: string; from?: number };
const Graph = ({ label, curves, points = [], xMin = -4, xMax = 4, yMin = -3, yMax = 5, asymptotes = [] }: {
  label: string; curves: Curve[]; points?: [number, number, string][];
  xMin?: number; xMax?: number; yMin?: number; yMax?: number;
  asymptotes?: { axis: 'x' | 'y'; value: number; label: string }[];
}) => {
  const X = (x: number) => 55 + (x - xMin) * 480 / (xMax - xMin);
  const Y = (y: number) => 315 - (y - yMin) * 275 / (yMax - yMin);
  const path = (curve: Curve) => {
    let d = '', joined = false;
    const from = curve.from ?? xMin;
    for (let i = 0; i <= 500; i++) {
      const x = from + (xMax - from) * i / 500, y = curve.fn(x);
      if (!Number.isFinite(y) || y < yMin || y > yMax) { joined = false; continue; }
      d += `${joined ? 'L' : 'M'}${X(x).toFixed(2)},${Y(y).toFixed(2)} `;
      joined = true;
    }
    return d;
  };
  return <svg viewBox="0 0 590 360" className="mx-auto w-full max-w-2xl" role="img" aria-label={label}>
    <title>{label}</title><rect width="590" height="360" fill="white" />
    {Array.from({ length: Math.floor(xMax) - Math.ceil(xMin) + 1 }, (_, i) => i + Math.ceil(xMin)).map(x => <g key={`x${x}`}><line x1={X(x)} x2={X(x)} y1="40" y2="315" stroke="#e2e8f0" /><text x={X(x)} y={Y(0) + 18} textAnchor="middle" fontSize="12" fill="#475569">{x}</text></g>)}
    {Array.from({ length: Math.floor(yMax) - Math.ceil(yMin) + 1 }, (_, i) => i + Math.ceil(yMin)).map(y => <g key={`y${y}`}><line x1="55" x2="535" y1={Y(y)} y2={Y(y)} stroke="#e2e8f0" />{y !== 0 && <text x={X(0) - 10} y={Y(y) + 4} textAnchor="end" fontSize="12" fill="#475569">{y}</text>}</g>)}
    <line x1="55" x2="545" y1={Y(0)} y2={Y(0)} stroke="#334155" strokeWidth="1.5" /><line x1={X(0)} x2={X(0)} y1="30" y2="315" stroke="#334155" strokeWidth="1.5" />
    <text x="552" y={Y(0) + 5} fontSize="15">x</text><text x={X(0) + 8} y="27" fontSize="15">y</text>
    {asymptotes.map((a, i) => <g key={i}><line x1={a.axis === 'x' ? X(a.value) : 55} x2={a.axis === 'x' ? X(a.value) : 535} y1={a.axis === 'y' ? Y(a.value) : 40} y2={a.axis === 'y' ? Y(a.value) : 315} stroke="#e11d48" strokeDasharray="6 4" /><text x={a.axis === 'x' ? X(a.value) + 8 : 440} y={a.axis === 'y' ? Y(a.value) - 8 : 52} fontSize="13" fill="#be123c">{a.label}</text></g>)}
    {curves.map((curve, i) => <path key={i} d={path(curve)} fill="none" stroke={curve.color} strokeWidth="3" />)}
    {points.map(([x, y, name], i) => <g key={i}><circle cx={X(x)} cy={Y(y)} r="4" fill="#0f172a" /><text x={X(x) + 7} y={Y(y) - 9} fontSize="13" fill="#0f172a">{name}</text></g>)}
    <text x="295" y="346" textAnchor="middle" fontSize="15" fill="#334155">{powerTokens(label).map((token, i) => <tspan key={i} baselineShift={token.power ? 'super' : 'baseline'} fontSize={token.power ? 11 : 15}>{token.text}</tspan>)}</text>
  </svg>;
};
const Sources = () => <div className="space-y-3 p-3 text-sm leading-relaxed">
  <h4 className="font-bold text-slate-900">Read the original questions</h4>
  <a href={PAPER_SOURCES.j20} target="_blank" rel="noopener noreferrer" className="block font-semibold text-violet-700 underline">ZIMSEC June 2020 • Pure Mathematics 6042/1 • scanned paper</a>
  <p>Checked printed pages 2–3: Q1, Q3, Q7, Q8, Q11 and Q12(a). Only the Algebra part of Q12 is included here.</p>
  <a href={PAPER_SOURCES.n21} target="_blank" rel="noopener noreferrer" className="block font-semibold text-violet-700 underline">ZIMSEC November 2021 • Pure Mathematics 6042/1 • scanned paper</a>
  <p>Checked printed pages 2–3: Q1, Q4, Q5, Q8, Q10 and Q11. Transcriptions keep the mathematical data; wording is shortened. Solutions were checked independently.</p>
  <h4 className="pt-2 font-bold text-slate-900">Further explanations</h4>
  <p>OpenStax Precalculus 2e provides additional explanations of these methods:</p>
  <div className="flex flex-wrap gap-x-4 gap-y-2">
    {[
      ['3-5-dividing-polynomials', 'Polynomial division'], ['3-6-zeros-of-polynomial-functions', 'Factor and remainder theorems'],
      ['9-4-partial-fractions', 'Partial fractions'], ['4-3-logarithmic-functions', 'Logarithmic functions'],
      ['4-6-exponential-and-logarithmic-equations', 'Exponential and logarithmic equations'],
    ].map(([slug, title]) => <a key={slug} href={`https://openstax.org/books/precalculus-2e/pages/${slug}`} target="_blank" rel="noopener noreferrer" className="text-violet-700 underline">{title}</a>)}
  </div>
</div>;
const Signs = () => <svg viewBox="0 0 600 135" className="mx-auto w-full max-w-2xl" role="img" aria-label="Sign chart: positive before −2, negative between −2 and 3, positive after 3.">
  <title>Signs of (x + 2)(x − 3)</title><line x1="30" x2="570" y1="75" y2="75" stroke="#334155" strokeWidth="2" />
  {[180, 420].map((x, i) => <g key={x}><circle cx={x} cy="75" r="6" fill="white" stroke="#7c3aed" strokeWidth="2" /><text x={x} y="103" textAnchor="middle" fontSize="18">{i === 0 ? '−2' : '3'}</text></g>)}
  <text x="100" y="49" textAnchor="middle" fontSize="27" fill="#7c3aed">+</text><text x="300" y="49" textAnchor="middle" fontSize="27" fill="#7c3aed">−</text><text x="500" y="49" textAnchor="middle" fontSize="27" fill="#7c3aed">+</text>
  <line x1="180" x2="420" y1="75" y2="75" stroke="#7c3aed" strokeWidth="5" /><text x="300" y="128" textAnchor="middle" fontSize="15">Include both roots when the question asks for ≤ 0.</text>
</svg>;
export const ALGEBRA_DIAGRAMS = {
  sources: Sources, signs: Signs,
  variation: () => <Graph label="Direct: y = x (purple). Inverse: y = 4/x (blue)." xMin={-1} xMax={6} yMin={-1} yMax={6} curves={[{fn:x => x, color:'#7c3aed', from:0}, {fn:x => 4/x, color:'#0284c7', from:.02}]} />,
  exponential: () => <Graph label="y = 2^x" curves={[{fn:x => 2**x, color:'#7c3aed'}]} points={[[-1,.5,'(−1, 1/2)'], [0,1,'(0, 1)'], [1,2,'(1, 2)']]} />,
  rational: () => <Graph label="y = 2 − 1/x, x > 0" xMin={-1} xMax={5} yMin={-4} yMax={3} curves={[{fn:x => 2 - 1/x, color:'#7c3aed', from:.001}]} asymptotes={[{axis:'x',value:0,label:'x = 0'}, {axis:'y',value:2,label:'y = 2'}]} points={[[.5,0,'(1/2, 0)'], [1,1,'(1, 1)']]} />,
  modulus: () => <Graph label="Purple: y = 2 − |x|. Blue: y = x/3 + 1." curves={[{fn:x => 2 - Math.abs(x),color:'#7c3aed'}, {fn:x => x/3 + 1,color:'#0284c7'}]} points={[[-1.5,.5,'(−3/2, 1/2)'], [.75,1.25,'(3/4, 5/4)']]} />,
};
