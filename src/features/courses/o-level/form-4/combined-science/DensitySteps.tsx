import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Environment, Stone } from './sceneParts';

// Three animated 3D steps for finding density: 1) weigh, 2) find the volume by
// displacement, 3) divide. Each loops by itself. Not interactive.
const LOOP = 7;
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const phase = (clock: THREE.Clock, still: boolean) => (still ? 0.95 : (clock.elapsedTime % LOOP) / LOOP);

function BalanceStep({ still }: { still: boolean }) {
  const canvas = useMemo(() => { const c = document.createElement('canvas'); c.width = 512; c.height = 128; return c; }, []);
  const texture = useMemo(() => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t; }, [canvas]);
  const shown = useRef('');
  const stone = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = phase(clock, still);
    if (stone.current) stone.current.position.y = 0.76 + (1 - seg(t, 0.1, 0.35)) * 1.3;
    const text = (54 * seg(t, 0.38, 0.62)).toFixed(1);
    if (text !== shown.current) {
      shown.current = text;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#b9ccc4'; ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#16231f'; ctx.font = 'bold 84px "Courier New", monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(text, 430, 68);
      ctx.font = 'bold 44px "Courier New", monospace'; ctx.textAlign = 'left'; ctx.fillText('g', 450, 78);
      texture.needsUpdate = true;
    }
  });
  return <group>
    <RoundedBox args={[2.5, 0.62, 1.7]} radius={0.09} smoothness={4} position={[0, 0.36, 0]}><meshStandardMaterial color="#dfe1e4" roughness={0.45} metalness={0.15} /></RoundedBox>
    <mesh position={[0, 0.4, 0.856]}><planeGeometry args={[1.6, 0.4]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    <mesh position={[0, 0.4, 0.852]}><planeGeometry args={[1.72, 0.5]} /><meshStandardMaterial color="#4b5563" roughness={0.6} /></mesh>
    {[-0.7, -0.23, 0.23, 0.7].map(bx => <RoundedBox key={bx} args={[0.36, 0.1, 0.08]} radius={0.03} position={[bx, 0.1, 0.86]}><meshStandardMaterial color="#6b7280" roughness={0.5} /></RoundedBox>)}
    <mesh position={[0, 0.7, -0.25]}><cylinderGeometry args={[0.78, 0.8, 0.05, 64]} /><meshStandardMaterial color="#d7dbe0" roughness={0.22} metalness={1} /></mesh>
    <group ref={stone} position={[0, 2, -0.25]}><Stone /></group>
  </group>;
}

function scaleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.strokeStyle = '#020617'; ctx.fillStyle = '#020617'; ctx.textBaseline = 'middle';
  for (let v = 0; v <= 60; v += 2) {
    const y = 1024 - 24 - (v / 60) * 960, major = v % 10 === 0;
    ctx.lineWidth = major ? 6 : 3;
    ctx.beginPath(); ctx.moveTo(140, y); ctx.lineTo(major ? 250 : 200, y); ctx.stroke();
    if (major) { ctx.font = 'bold 56px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(String(v), 128, y); }
  }
  const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

const ML = 0.05, R = 0.42, H = 60 * ML;
function VolumeStep({ still }: { still: boolean }) {
  const scale = useMemo(() => scaleTexture(), []);
  const water = useRef<THREE.Mesh>(null);
  const stone = useRef<THREE.Group>(null);
  const string = useRef<THREE.Mesh>(null);
  const planeH = (H * 1024) / 960;
  useFrame(({ clock }) => {
    const t = phase(clock, still);
    const level = 30 + 20 * seg(t, 0.32, 0.55);
    if (water.current) { water.current.scale.y = level * ML; water.current.position.y = (level * ML) / 2; }
    const y = H + 0.3 - (H + 0.3 - 0.3) * seg(t, 0.1, 0.42);
    const top = H + 0.9;
    if (stone.current) stone.current.position.y = y;
    if (string.current) { string.current.scale.y = top - y; string.current.position.y = (top + y) / 2; }
  });
  return <group>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[R * 1.6, R * 1.7, 0.1, 48]} /><meshPhysicalMaterial color="#dbeafe" transparent opacity={0.5} roughness={0.1} /></mesh>
    <group position={[0, 0.1, 0]}>
      <mesh position={[0, H / 2, 0]}><cylinderGeometry args={[R, R, H, 48, 1, true]} /><meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.18} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh ref={water}><cylinderGeometry args={[R - 0.015, R - 0.015, 1, 48]} /><meshPhysicalMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.05} /></mesh>
      <mesh position={[0, planeH / 2 - 24 * (planeH / 1024), R + 0.004]}><planeGeometry args={[R * 2, planeH]} /><meshBasicMaterial map={scale} transparent toneMapped={false} /></mesh>
      <group ref={stone} position={[0, H + 0.3, 0]}><group scale={0.5}><Stone /></group></group>
      <mesh ref={string}><cylinderGeometry args={[0.012, 0.012, 1, 8]} /><meshStandardMaterial color="#f5f1e6" roughness={0.9} /></mesh>
    </group>
  </group>;
}

function DivideStep({ still }: { still: boolean }) {
  const texture = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 110px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('54 ÷ 20 = 2.7', 512, 92);
    ctx.fillStyle = '#15803d'; ctx.font = 'bold 84px sans-serif'; ctx.fillText('g/cm³', 512, 205);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }, []);
  const stone = useRef<THREE.Group>(null);
  const label = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = phase(clock, still);
    if (stone.current) stone.current.rotation.y = clock.elapsedTime * 0.8;
    if (label.current) {
      const k = seg(t, 0.2, 0.45);
      label.current.scale.setScalar(0.6 + 0.4 * k);
      (label.current.material as THREE.MeshBasicMaterial).opacity = k;
    }
  });
  return <group>
    <group ref={stone} position={[0, 0.1, 0]} scale={1.15}><Stone /></group>
    <mesh ref={label} position={[0, 1.15, 0.4]}><planeGeometry args={[2.4, 0.6]} /><meshBasicMaterial map={texture} transparent opacity={0} toneMapped={false} depthWrite={false} /></mesh>
  </group>;
}

function Panel({ n, text, camera, look, children }: { n: number; text: string; camera: [number, number, number]; look: number; children: React.ReactNode }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <p className="text-lg font-extrabold text-violet-700">Step {n}</p>
    <div className="h-[240px] w-full sm:h-[280px]">
      <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ position: camera, fov: 17 }} style={{ pointerEvents: 'none' }} onCreated={({ camera: c }) => c.lookAt(0, look, 0)} aria-label={text}>
        <Environment />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 6]} intensity={1.5} />
        {children}
        <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={5} blur={2.2} far={1.5} />
      </Canvas>
    </div>
    <p className="text-base text-slate-700">{text}</p>
  </div>;
}

export default function DensitySteps() {
  const still = useMemo(reducedMotion, []);
  return <div className="space-y-3">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Panel n={1} text="Weigh the object with a balance. That is the mass." camera={[0, 0.9, 8.5]} look={0.9}><BalanceStep still={still} /></Panel>
      <Panel n={2} text="Find the volume. For a block, multiply its length, width and height. For an odd shape, use displacement." camera={[0, 1.9, 13]} look={1.9}><VolumeStep still={still} /></Panel>
      <Panel n={3} text="Divide mass by volume." camera={[0, 0.65, 7.5]} look={0.65}><DivideStep still={still} /></Panel>
    </div>
    <p className="text-lg text-slate-700"><strong>Keep the units matching:</strong> kg and m³ give kg/m³. g and cm³ give g/cm³.</p>
  </div>;
}
