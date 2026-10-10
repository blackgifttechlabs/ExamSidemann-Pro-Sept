import React, { type ReactNode } from 'react';

type Frame = { X: (x: number) => number; Y: (y: number) => number; unit: number };
const VIOLET = '#7c3aed', BLUE = '#0284c7', RED = '#e11d48', GREEN = '#059669', INK = '#0f172a';
const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

/** Square-unit coordinate plane (equal scales so circles stay round). */
const Plane = ({ label, xMin, xMax, yMin, yMax, children, caption }: {
  label: string; xMin: number; xMax: number; yMin: number; yMax: number; caption?: string; children: (frame: Frame) => ReactNode;
}) => {
  const unit = Math.min(480 / (xMax - xMin), 275 / (yMax - yMin));
  const ox = 55 + (480 - unit * (xMax - xMin)) / 2, oy = 315 - (275 - unit * (yMax - yMin)) / 2;
  const X = (x: number) => ox + (x - xMin) * unit, Y = (y: number) => oy - (y - yMin) * unit;
  const xs = Array.from({ length: Math.floor(xMax) - Math.ceil(xMin) + 1 }, (_, i) => i + Math.ceil(xMin));
  const ys = Array.from({ length: Math.floor(yMax) - Math.ceil(yMin) + 1 }, (_, i) => i + Math.ceil(yMin));
  return <svg viewBox="0 0 590 360" className="mx-auto w-full max-w-2xl" role="img" aria-label={label}>
    <title>{label}</title><rect width="590" height="360" fill="white" />
    <defs>{[['p', VIOLET], ['b', BLUE], ['r', RED], ['g', GREEN], ['k', INK]].map(([id, color]) =>
      <marker key={id} id={`geo-arrow-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={color} /></marker>)}</defs>
    {xs.map(x => <g key={`x${x}`}><line x1={X(x)} x2={X(x)} y1={Y(yMax)} y2={Y(yMin)} stroke="#e2e8f0" />{x !== 0 && <text x={X(x)} y={Y(0) + 16} textAnchor="middle" fontSize="11" fill="#64748b">{x}</text>}</g>)}
    {ys.map(y => <g key={`y${y}`}><line x1={X(xMin)} x2={X(xMax)} y1={Y(y)} y2={Y(y)} stroke="#e2e8f0" />{y !== 0 && <text x={X(0) - 7} y={Y(y) + 4} textAnchor="end" fontSize="11" fill="#64748b">{y}</text>}</g>)}
    <line x1={X(xMin)} x2={X(xMax)} y1={Y(0)} y2={Y(0)} stroke="#334155" strokeWidth="1.5" /><line x1={X(0)} x2={X(0)} y1={Y(yMin)} y2={Y(yMax)} stroke="#334155" strokeWidth="1.5" />
    <text x={X(xMax) + 4} y={Y(0) + 5} fontSize="14">x</text><text x={X(0) + 7} y={Y(yMax) - 3} fontSize="14">y</text>
    {children({ X, Y, unit })}
    <text x="295" y="350" textAnchor="middle" fontSize="14" fill="#334155">{caption ?? label}</text>
  </svg>;
};
const Seg = ({ f, a, b, color = VIOLET, at = 0, width = 3, arrow, dashed }: { f: Frame; a: [number, number]; b: [number, number]; color?: string; at?: number; width?: number; arrow?: string; dashed?: boolean }) =>
  <line className={dashed ? 'geo-fade' : 'geo-draw'} pathLength={1} style={delay(at)} x1={f.X(a[0])} y1={f.Y(a[1])} x2={f.X(b[0])} y2={f.Y(b[1])} stroke={color} strokeWidth={width}
    strokeDasharray={dashed ? '6 4' : undefined} markerEnd={arrow ? `url(#geo-arrow-${arrow})` : undefined} />;
const Dot = ({ f, at, name, p, dx = 8, dy = -9, color = INK }: { f: Frame; at: [number, number]; name: string; p?: number; dx?: number; dy?: number; color?: string }) =>
  <g className="geo-fade" style={delay(p ?? 0.8)}><circle cx={f.X(at[0])} cy={f.Y(at[1])} r="4.5" fill={color} /><text x={f.X(at[0]) + dx} y={f.Y(at[1]) + dy} fontSize="14" fontWeight="700" fill={color}>{name}</text></g>;
const Tag = ({ f, at, text, color = INK, anchor = 'start', p = 1.1 }: { f: Frame; at: [number, number]; text: string; color?: string; anchor?: 'start' | 'middle' | 'end'; p?: number }) =>
  <text className="geo-fade" style={delay(p)} x={f.X(at[0])} y={f.Y(at[1])} fontSize="14" fontWeight="600" textAnchor={anchor} fill={color}>{text}</text>;
/** Small square showing a right angle at a corner; d1, d2 are unit directions in maths coordinates. */
const RightAngle = ({ f, at, d1, d2, size = 14, p = 1.2 }: { f: Frame; at: [number, number]; d1: [number, number]; d2: [number, number]; size?: number; p?: number }) => {
  const cx = f.X(at[0]), cy = f.Y(at[1]); const a = [d1[0] * size, -d1[1] * size], b = [d2[0] * size, -d2[1] * size];
  return <path className="geo-fade" style={delay(p)} d={`M${cx + a[0]},${cy + a[1]} L${cx + a[0] + b[0]},${cy + a[1] + b[1]} L${cx + b[0]},${cy + b[1]}`} fill="none" stroke={INK} strokeWidth="1.5" />;
};
const unitOf = (dx: number, dy: number): [number, number] => { const m = Math.hypot(dx, dy); return [dx / m, dy / m]; };

const DistanceDiagram = () => <Plane label="The distance from A(1, 2) to B(4, 6) is the long side of a 3-4-5 right triangle" xMin={-1} xMax={7} yMin={-1} yMax={8}>{f => <>
  <Seg f={f} a={[1, 2]} b={[4, 2]} color={BLUE} at={0.1} /><Seg f={f} a={[4, 2]} b={[4, 6]} color={BLUE} at={0.6} /><Seg f={f} a={[1, 2]} b={[4, 6]} color={VIOLET} at={1.1} width={4} />
  <RightAngle f={f} at={[4, 2]} d1={[-1, 0]} d2={[0, 1]} />
  <Tag f={f} at={[2.5, 1.4]} text="across 3" color={BLUE} anchor="middle" /><Tag f={f} at={[4.2, 4]} text="up 4" color={BLUE} /><Tag f={f} at={[1.5, 4.5]} text="d = 5" color={VIOLET} anchor="end" />
  <Dot f={f} at={[1, 2]} name="A(1, 2)" dx={-62} dy={5} /><Dot f={f} at={[4, 6]} name="B(4, 6)" dx={8} dy={-8} /></>}</Plane>;
const GradientDiagram = () => <Plane label="Gradient = rise ÷ run. On y = 2x − 1, 4 up for every 2 across gives 2" xMin={-2} xMax={6} yMin={-3} yMax={8}>{f => <>
  <Seg f={f} a={[-1, -3]} b={[4.5, 8]} color={VIOLET} width={3.5} /><Seg f={f} a={[1, 1]} b={[3, 1]} color={BLUE} at={0.7} /><Seg f={f} a={[3, 1]} b={[3, 5]} color={RED} at={1.2} />
  <RightAngle f={f} at={[3, 1]} d1={[-1, 0]} d2={[0, 1]} /><Tag f={f} at={[2, 0.2]} text="run = 2" color={BLUE} anchor="middle" /><Tag f={f} at={[3.2, 3]} text="rise = 4" color={RED} />
  <Dot f={f} at={[1, 1]} name="(1, 1)" dx={-48} dy={14} /><Dot f={f} at={[3, 5]} name="(3, 5)" dx={-52} dy={-6} /><Tag f={f} at={[-1.7, -2]} text="y = 2x − 1" color={VIOLET} /></>}</Plane>;
const PerpendicularDiagram = () => <Plane label="Perpendicular lines through (2, 1): gradients 2 and −1/2 multiply to −1" xMin={-3} xMax={7} yMin={-3} yMax={6}>{f => <>
  <Seg f={f} a={[0.5, -2]} b={[3.5, 4]} color={VIOLET} width={3.5} /><Seg f={f} a={[-2, 3]} b={[6, -1]} color={BLUE} width={3.5} at={0.5} />
  <RightAngle f={f} at={[2, 1]} d1={unitOf(1, 2)} d2={unitOf(2, -1)} size={17} p={1.3} />
  <Dot f={f} at={[2, 1]} name="(2, 1)" dx={12} dy={-6} /><Tag f={f} at={[3.6, 4.4]} text="m = 2" color={VIOLET} /> <Tag f={f} at={[4.6, -1.5]} text="m = −1/2" color={BLUE} /></>}</Plane>;
const CircleDiagram = () => {
  return <Plane label="Circle (x − 3)² + (y + 2)² = 16: centre (3, −2), radius 4" xMin={-3} xMax={9} yMin={-7} yMax={3}>{f => <>
    <circle className="geo-draw" pathLength={1} style={delay(0.1)} cx={f.X(3)} cy={f.Y(-2)} r={4 * f.unit} fill="rgba(124,58,237,.08)" stroke={VIOLET} strokeWidth="3.5" />
    <Seg f={f} a={[3, -2]} b={[7, -2]} color={RED} at={1.2} arrow="r" /><Tag f={f} at={[5, -1.5]} text="r = 4" color={RED} anchor="middle" />
    <Dot f={f} at={[3, -2]} name="C(3, −2)" dx={-26} dy={20} /><Dot f={f} at={[7, -2]} name="" /></>}</Plane>;
};
const TangentDiagram = () => <Plane label="Tangent at P(3, 4) on x² + y² = 25 is perpendicular to the radius OP" xMin={-8} xMax={9} yMin={-7} yMax={8}>{f => <>
  <circle className="geo-draw" pathLength={1} style={delay(0.1)} cx={f.X(0)} cy={f.Y(0)} r={5 * f.unit} fill="rgba(124,58,237,.06)" stroke={VIOLET} strokeWidth="3.5" />
  <Seg f={f} a={[0, 0]} b={[3, 4]} color={RED} at={1} width={3} /><Seg f={f} a={[-1, 7]} b={[9, -0.5]} color={BLUE} at={1.5} width={3.5} />
  <RightAngle f={f} at={[3, 4]} d1={unitOf(-3, -4)} d2={unitOf(4, -3)} size={16} p={2.4} />
  <Dot f={f} at={[3, 4]} name="P(3, 4)" dx={8} dy={-8} p={1.4} /><Dot f={f} at={[0, 0]} name="O" dx={-16} dy={-8} p={0.6} />
  <Tag f={f} at={[1.4, 1.1]} text="m = 4/3" color={RED} /><Tag f={f} at={[5.4, 3.4]} text="tangent m = −3/4" color={BLUE} /></>}</Plane>;
const Vectors2DDiagram = () => <Plane label="Adding vectors: a + b is the diagonal of the parallelogram" xMin={-1} xMax={8} yMin={-1} yMax={6}>{f => <>
  <Seg f={f} a={[0, 0]} b={[4, 1]} color={VIOLET} at={0.1} arrow="p" /><Seg f={f} a={[0, 0]} b={[1, 3]} color={BLUE} at={0.6} arrow="b" />
  <Seg f={f} a={[4, 1]} b={[5, 4]} color={BLUE} at={1.1} dashed arrow="b" /><Seg f={f} a={[1, 3]} b={[5, 4]} color={VIOLET} at={1.1} dashed arrow="p" />
  <Seg f={f} a={[0, 0]} b={[5, 4]} color={RED} at={1.6} width={4} arrow="r" />
  <Tag f={f} at={[2.2, 0.15]} text="a" color={VIOLET} anchor="middle" /><Tag f={f} at={[0.1, 1.7]} text="b" color={BLUE} anchor="end" />
  <Tag f={f} at={[5.6, 5.5]} text="a = 4i + j" color={VIOLET} /><Tag f={f} at={[5.6, 4.9]} text="b = i + 3j" color={BLUE} /><Tag f={f} at={[5.6, 4.3]} text="a + b = 5i + 4j" color={RED} p={2} /></>}</Plane>;
const PositionDiagram = () => <Plane label="OA, OB and AB = OB − OA. P divides AB in the ratio 1 : 2" xMin={-1} xMax={9} yMin={-1} yMax={7}>{f => <>
  <Seg f={f} a={[0, 0]} b={[1, 2]} color={VIOLET} at={0.1} arrow="p" /><Seg f={f} a={[0, 0]} b={[7, 5]} color={BLUE} at={0.5} arrow="b" /><Seg f={f} a={[1, 2]} b={[7, 5]} color={RED} at={1.1} width={3.5} arrow="r" />
  <Dot f={f} at={[1, 2]} name="A" dx={-16} dy={-6} p={0.5} /><Dot f={f} at={[7, 5]} name="B" dx={8} dy={-8} p={0.9} /><Dot f={f} at={[3, 3]} name="P" dx={-4} dy={-12} p={1.7} color={GREEN} />
  <Tag f={f} at={[0.1, 0.6]} text="a" color={VIOLET} /><Tag f={f} at={[4.2, 1.9]} text="b" color={BLUE} /><Tag f={f} at={[5.6, 4.6]} text="AB = b − a" color={RED} anchor="end" p={1.6} />
  <Tag f={f} at={[2.3, 1.9]} text="1 : 2" color={GREEN} anchor="end" p={1.9} /></>}</Plane>;
const ScalarDiagram = () => {
  const a: [number, number] = [4, 1], b: [number, number] = [1, 3];
  const k = (a[0] * b[0] + a[1] * b[1]) / (a[0] * a[0] + a[1] * a[1]); const foot: [number, number] = [k * a[0], k * a[1]];
  const a1 = Math.atan2(a[1], a[0]), a2 = Math.atan2(b[1], b[0]), r = 1.3;
  return <Plane label="a · b = |a||b| cos θ. The dashed line shows the part of b that lies along a" xMin={-1} xMax={6} yMin={-1} yMax={4.5}>{f => <>
    <Seg f={f} a={[0, 0]} b={a} color={VIOLET} at={0.1} arrow="p" /><Seg f={f} a={[0, 0]} b={b} color={BLUE} at={0.6} arrow="b" /><Seg f={f} a={b} b={foot} color={RED} dashed at={1.2} />
    <path className="geo-fade" style={delay(1.3)} d={`M${f.X(r * Math.cos(a1))},${f.Y(r * Math.sin(a1))} A${r * f.unit},${r * f.unit} 0 0 0 ${f.X(r * Math.cos(a2))},${f.Y(r * Math.sin(a2))}`} fill="none" stroke={GREEN} strokeWidth="2.5" />
    <Tag f={f} at={[1.65, 0.95]} text="θ" color={GREEN} p={1.4} /><Tag f={f} at={[4.1, 0.9]} text="a" color={VIOLET} /><Tag f={f} at={[0.55, 3.2]} text="b" color={BLUE} />
    <Tag f={f} at={[5.9, 2.9]} text="a · b = 4(1) + 1(3) = 7" color={INK} anchor="end" p={1.8} /></>}</Plane>;
};
const LineDiagram = () => <Plane label="r = (1, 1) + λ(2, 1): start at (1, 1) and step along the direction (2, 1)" xMin={-1} xMax={9} yMin={-1} yMax={6}>{f => <>
  <Seg f={f} a={[-1, 0]} b={[8.6, 4.8]} color={VIOLET} width={3} />
  <Seg f={f} a={[1, 1]} b={[3, 2]} color={RED} at={0.9} width={4} arrow="r" />
  {[0, 1, 2, 3].map(l => <Dot key={l} f={f} at={[1 + 2 * l, 1 + l]} name={`λ = ${l}`} dx={-6} dy={20} p={0.4 + l * 0.35} color={l === 0 ? GREEN : INK} />)}
  <Tag f={f} at={[2.1, 1.1]} text="d" color={RED} p={1.2} /></>}</Plane>;
const SkewDiagram = () => {
  // Oblique view: i comes towards the viewer (down-left), j goes right, k goes up.
  const P = (x: number, y: number, z: number): [number, number] => [150 + (y - 0.5 * x) * 58, 270 - (z - 0.32 * x) * 50];
  const line = (a: [number, number, number], b: [number, number, number], color: string, at: number) => { const s = P(...a), e = P(...b); return <line className="geo-draw" pathLength={1} style={delay(at)} x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]} stroke={color} strokeWidth="4" />; };
  const O = P(0, 0, 0);
  const axes: [string, [number, number, number]][] = [['i', [4, 0, 0]], ['j', [0, 7, 0]], ['k', [0, 0, 5]]];
  const g1 = P(2, 3, 0), g2 = P(2, 3, 3);
  return <svg viewBox="0 0 590 360" className="mx-auto w-full max-w-2xl" role="img" aria-label="Skew lines: l1 runs along j at height 0, l2 runs along i at height 3. They never meet and are not parallel.">
    <title>Skew lines in three dimensions</title><rect width="590" height="360" fill="white" />
    <defs><marker id="geo-arrow-ax" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#334155" /></marker></defs>
    {axes.map(([name, v]) => { const e = P(...v); return <g key={name}><line x1={O[0]} y1={O[1]} x2={e[0]} y2={e[1]} stroke="#334155" strokeWidth="1.5" markerEnd="url(#geo-arrow-ax)" /><text x={e[0] + 6} y={e[1] + 5} fontSize="15" fontStyle="italic">{name === 'i' ? 'x' : name === 'j' ? 'y' : 'z'}</text></g>; })}
    {line([2, -0.5, 0], [2, 6.2, 0], VIOLET, 0.2)}{line([-0.5, 3, 3], [3.8, 3, 3], BLUE, 0.9)}
    <line className="geo-fade" style={delay(1.6)} x1={g1[0]} y1={g1[1]} x2={g2[0]} y2={g2[1]} stroke={RED} strokeWidth="2.5" strokeDasharray="6 4" />
    <text className="geo-fade" style={{ ...delay(1.8) }} x={g1[0] + 8} y={(g1[1] + g2[1]) / 2} fontSize="14" fontWeight="700" fill={RED}>gap</text>
    <text x={P(2, 6.2, 0)[0] - 6} y={P(2, 6.2, 0)[1] + 20} fontSize="15" fontWeight="700" fill={VIOLET}>l₁</text><text x={P(-0.5, 3, 3)[0] - 4} y={P(-0.5, 3, 3)[1] - 10} fontSize="15" fontWeight="700" fill={BLUE}>l₂</text>
    <text x="295" y="350" textAnchor="middle" fontSize="14" fill="#334155">Skew lines: not parallel, and they never meet</text>
  </svg>;
};

const Sources = () => <div className="space-y-3 p-3 text-sm leading-relaxed">
  <h4 className="font-bold text-slate-900">About these questions</h4>
  <p>All 110 questions in this topic are practice questions written for the Form 5 Geometry and Vectors scope. Every answer was calculated by computer from the numbers in the question, then the written steps were read through. None is copied from a past paper, so none is labelled as a ZIMSEC question.</p>
  <p>To practise with real ZIMSEC questions, look for Pure Mathematics 6042 Paper 1 and Paper 2 on the official ZIMSEC website, and for the examiner reports, which explain where marks were lost. Vectors, lines and planes also appear in the Paper 2 specimen paper.</p>
  <a href="https://www5.zimsec.co.zw/download/advanced-level-pure-mathematics-6042-02-november-2022-examiner-report/" target="_blank" rel="noopener noreferrer" className="block font-semibold text-violet-700 underline">ZIMSEC examiner report • Pure Mathematics 6042/2 • November 2022</a>
  <p>Treat topic labels in this lesson as a study guide, and check them against your own copy of the syllabus.</p>
</div>;

export const GEOMETRY_DIAGRAMS = {
  sources: Sources, distance: DistanceDiagram, gradient: GradientDiagram, perpendicular: PerpendicularDiagram, circle: CircleDiagram, tangent: TangentDiagram,
  vectors2d: Vectors2DDiagram, position: PositionDiagram, scalar: ScalarDiagram, vline: LineDiagram, skew: SkewDiagram,
};
