import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from './sceneParts';

// Two analogue meters seen straight on. The needle swings up to its reading when
// the page loads. Not interactive.
interface MeterSpec { letter: string; unit: string; max: number; major: number; minor: number; reading: number; decimals: number }

const W = 1024, Hh = 768, PX = 512, PY = 640, RAD = 430, SPAN = 50; // degrees either side of vertical

function faceTexture(m: MeterSpec) {
  const c = document.createElement('canvas'); c.width = W; c.height = Hh;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f6f3e8'; ctx.fillRect(0, 0, W, Hh);
  const pt = (v: number, r: number): [number, number] => {
    const a = ((-SPAN + (2 * SPAN * v) / m.max) * Math.PI) / 180;
    return [PX + Math.sin(a) * r, PY - Math.cos(a) * r];
  };
  ctx.strokeStyle = '#111827'; ctx.fillStyle = '#111827'; ctx.lineCap = 'round';
  ctx.lineWidth = 5; ctx.beginPath();
  for (let a = -SPAN; a <= SPAN; a += 1) { const r = (a * Math.PI) / 180; const x = PX + Math.sin(r) * RAD, y = PY - Math.cos(r) * RAD; a === -SPAN ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
  ctx.stroke();
  for (let v = 0; v <= m.max + 1e-9; v += m.minor) {
    const major = Math.abs(v / m.major - Math.round(v / m.major)) < 1e-6;
    const [x1, y1] = pt(v, RAD), [x2, y2] = pt(v, RAD - (major ? 52 : 28));
    ctx.lineWidth = major ? 6 : 3; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    if (major) { const [tx, ty] = pt(v, RAD - 100); ctx.font = 'bold 58px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(v.toFixed(m.decimals), tx, ty); }
  }
  ctx.font = 'bold 120px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(m.letter, PX, 478);
  ctx.font = 'bold 40px sans-serif'; ctx.fillText(m.unit, PX, 552);
  ctx.font = 'bold 56px sans-serif'; ctx.fillStyle = '#dc2626'; ctx.fillText('+', 110, 700); ctx.fillStyle = '#111827'; ctx.fillText('−', 914, 700);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function Meter({ spec, still }: { spec: MeterSpec; still: boolean }) {
  const face = useMemo(() => faceTexture(spec), [spec]);
  const needle = useRef<THREE.Group>(null);
  const state = useRef({ ang: -SPAN - 4, vel: 0 });
  const target = -SPAN + (2 * SPAN * spec.reading) / spec.max;
  useFrame((_, dt) => {
    const s = state.current;
    if (still) s.ang = target;
    else { const k = 60, d = 9, f = Math.min(dt, 0.033); s.vel += (k * (target - s.ang) - d * s.vel) * f; s.ang += s.vel * f; }
    if (needle.current) needle.current.rotation.z = (-s.ang * Math.PI) / 180;
  });
  const fx = 2.0, fy = 1.5;
  const py = (Hh / 2 - PY) / Hh * fy;
  return <group>
    <RoundedBox args={[2.5, 2.0, 0.55]} radius={0.12} smoothness={5} position={[0, 0, 0]}><meshStandardMaterial color="#17181b" roughness={0.45} metalness={0.2} /></RoundedBox>
    <mesh position={[0, 0.12, 0.278]}><planeGeometry args={[fx, fy]} /><meshStandardMaterial map={face} roughness={0.85} /></mesh>
    <group position={[0, 0.12 + py, 0.3]}>
      <group ref={needle}><mesh position={[0, 0.4, 0]}><boxGeometry args={[0.014, 0.82, 0.008]} /><meshStandardMaterial color="#111827" roughness={0.4} /></mesh><mesh position={[0, -0.08, 0]}><boxGeometry args={[0.02, 0.18, 0.008]} /><meshStandardMaterial color="#dc2626" /></mesh></group>
      <mesh position={[0, 0, 0.006]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 32]} /><meshStandardMaterial color="#111827" metalness={0.6} roughness={0.3} /></mesh>
    </group>
    <mesh position={[0, 0.12, 0.34]}><planeGeometry args={[fx, fy]} /><meshPhysicalMaterial color="#ffffff" transparent opacity={0.04} roughness={0.05} clearcoat={1} depthWrite={false} /></mesh>
    {[[-0.78, '#dc2626'], [0.78, '#111827']].map(([x, col]) => <group key={String(x)} position={[x as number, -0.82, 0.3]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.19, 0.19, 0.12, 32]} /><meshStandardMaterial color="#d6d9de" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.09, 32]} /><meshStandardMaterial color={col as string} roughness={0.4} /></mesh>
    </group>)}
  </group>;
}

const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function Panel({ spec, title, note, still }: { spec: MeterSpec; title: string; note: string; still: boolean }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <div className="h-[200px] w-full sm:h-[280px]">
      <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ position: [0, 0, 7.2], fov: 22 }} style={{ pointerEvents: 'none' }} aria-label={`${title}: ${note}`}>
        <Environment />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 3, 6]} intensity={1.3} />
        <Meter spec={spec} still={still} />
        <ContactShadows position={[0, -1.02, 0]} opacity={0.35} scale={5} blur={2.2} far={1.5} />
      </Canvas>
    </div>
    <p className="text-lg font-bold text-slate-900">{title}</p>
    <p className="text-base text-slate-700">{note}</p>
  </div>;
}

export default function AmmeterVoltmeterScene() {
  const still = useMemo(reducedMotion, []);
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    <Panel still={still} spec={{ letter: 'A', unit: 'amperes', max: 1, major: 0.2, minor: 0.05, reading: 0.6, decimals: 1 }} title="Ammeter (A)" note="Measures current. Connect it in series." />
    <Panel still={still} spec={{ letter: 'V', unit: 'volts', max: 15, major: 5, minor: 1, reading: 9, decimals: 0 }} title="Voltmeter (V)" note="Measures voltage. Connect it in parallel." />
  </div>;
}
