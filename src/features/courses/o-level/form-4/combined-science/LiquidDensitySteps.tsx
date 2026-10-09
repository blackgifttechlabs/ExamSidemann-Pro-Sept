import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from './sceneParts';

// Three animated 3D steps for the density of a liquid. Each loops by itself.
const LOOP = 7;
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const phase = (clock: THREE.Clock, still: boolean) => (still ? 0.95 : (clock.elapsedTime % LOOP) / LOOP);

const CR = 0.22, CH = 1.3, ML = CH / 100, PAN_TOP = 0.725;

function scaleTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 1024;
  const ctx = c.getContext('2d')!;
  ctx.strokeStyle = '#020617'; ctx.fillStyle = '#020617'; ctx.textBaseline = 'middle';
  for (let v = 0; v <= 100; v += 5) {
    const y = 1024 - 24 - (v / 100) * 960, major = v % 20 === 0, mid = v % 10 === 0;
    ctx.lineWidth = major ? 9 : 5;
    ctx.beginPath(); ctx.moveTo(150, y); ctx.lineTo(major ? 250 : mid ? 215 : 190, y); ctx.stroke();
    if (major && v > 0) { ctx.font = 'bold 76px sans-serif'; ctx.textAlign = 'right'; ctx.fillText(String(v), 138, y); }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function BalanceAndCylinder({ step, still }: { step: 1 | 2; still: boolean }) {
  const canvas = useMemo(() => { const c = document.createElement('canvas'); c.width = 512; c.height = 128; return c; }, []);
  const texture = useMemo(() => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t; }, [canvas]);
  const scale = useMemo(() => scaleTexture(), []);
  const shown = useRef('');
  const cyl = useRef<THREE.Group>(null);
  const water = useRef<THREE.Mesh>(null);
  const planeH = (CH * 1024) / 960;
  useFrame(({ clock }) => {
    const t = phase(clock, still);
    let reading = 0, level = 0, lift = 0;
    if (step === 1) { lift = (1 - seg(t, 0.1, 0.35)) * 1.5; reading = 40 * seg(t, 0.38, 0.62); }
    else { level = 50 * seg(t, 0.15, 0.55); reading = 40 + level; }
    if (cyl.current) cyl.current.position.y = PAN_TOP + lift;
    if (water.current) { const h = Math.max(0.0001, level * ML); water.current.scale.y = h; water.current.position.y = h / 2 + 0.03; water.current.visible = level > 0.05; }
    const text = reading.toFixed(1);
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
    <group ref={cyl} position={[0, PAN_TOP, -0.25]}>
      <mesh position={[0, 0.015, 0]}><cylinderGeometry args={[CR * 1.5, CR * 1.6, 0.03, 40]} /><meshPhysicalMaterial color="#dbeafe" transparent opacity={0.55} roughness={0.1} /></mesh>
      <mesh position={[0, 0.03 + CH / 2, 0]}><cylinderGeometry args={[CR, CR, CH, 40, 1, true]} /><meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.2} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh ref={water} visible={false}><cylinderGeometry args={[CR - 0.012, CR - 0.012, 1, 40]} /><meshPhysicalMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.05} /></mesh>
      <mesh position={[0, 0.03 + planeH / 2 - 24 * (planeH / 1024), CR + 0.004]}><planeGeometry args={[CR * 2, planeH]} /><meshBasicMaterial map={scale} transparent toneMapped={false} /></mesh>
    </group>
  </group>;
}

function WorkingStep({ still }: { still: boolean }) {
  const make = (lines: [string, string][]) => {
    const c = document.createElement('canvas'); c.width = 1024; c.height = 256;
    const ctx = c.getContext('2d')!;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 118px sans-serif';
    lines.forEach(([text, color]) => { ctx.fillStyle = color; ctx.fillText(text, 512, 128); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  };
  const a = useMemo(() => make([['90 − 40 = 50 g', '#0f172a']]), []);
  const b = useMemo(() => make([['50 ÷ 50 = 1.0 g/cm³', '#15803d']]), []);
  const ra = useRef<THREE.Mesh>(null), rb = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = phase(clock, still);
    const set = (m: THREE.Mesh | null, k: number) => { if (!m) return; m.scale.setScalar(0.7 + 0.3 * k); (m.material as THREE.MeshBasicMaterial).opacity = k; };
    set(ra.current, seg(t, 0.1, 0.3)); set(rb.current, seg(t, 0.38, 0.58));
  });
  return <group>
    <mesh ref={ra} position={[0, 1.25, 0]}><planeGeometry args={[3.2, 0.8]} /><meshBasicMaterial map={a} transparent opacity={0} toneMapped={false} depthWrite={false} /></mesh>
    <mesh ref={rb} position={[0, 0.45, 0]}><planeGeometry args={[3.2, 0.8]} /><meshBasicMaterial map={b} transparent opacity={0} toneMapped={false} depthWrite={false} /></mesh>
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

export default function LiquidDensitySteps() {
  const still = useMemo(reducedMotion, []);
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
    <Panel n={1} text="Weigh the empty, dry measuring cylinder. This is 40 g." camera={[0, 1.5, 12]} look={1.5}><BalanceAndCylinder step={1} still={still} /></Panel>
    <Panel n={2} text="Pour in the liquid. Read the volume at the bottom of the curve (50 cm³), then weigh again (90 g)." camera={[0, 1.5, 12]} look={1.5}><BalanceAndCylinder step={2} still={still} /></Panel>
    <Panel n={3} text="Take away the empty mass to get the mass of the liquid. Then divide mass by volume." camera={[0, 0.85, 7.5]} look={0.85}><WorkingStep still={still} /></Panel>
  </div>;
}
