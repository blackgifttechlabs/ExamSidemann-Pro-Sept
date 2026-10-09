import React, { useMemo } from 'react';
import { Environment, Stone } from './sceneParts';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Realistic 3D zero-error scene: an empty balance reading +2.0 g next to the same
// balance with a stone reading 52.0 g. Static, straight-on view.

function lcdTexture(text: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, '#c4d6cf'); g.addColorStop(1, '#a9bfb8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = '#16231f'; ctx.font = 'bold 84px "Courier New", monospace';
  ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 440, 68);
  ctx.font = 'bold 44px "Courier New", monospace'; ctx.textAlign = 'left';
  ctx.fillText('g', 456, 78);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

function Balance({ x, reading, stone }: { x: number; reading: string; stone: boolean }) {
  const texture = useMemo(() => lcdTexture(reading), [reading]);
  return <group position={[x, 0, 0]}>
    <RoundedBox args={[2.5, 0.62, 1.7]} radius={0.09} smoothness={4} position={[0, 0.36, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#dfe1e4" roughness={0.45} metalness={0.15} />
    </RoundedBox>
    {[[-1.05, -0.65], [1.05, -0.65], [-1.05, 0.65], [1.05, 0.65]].map(([fx, fz]) => <mesh key={`${fx}${fz}`} position={[fx, 0.03, fz]}><cylinderGeometry args={[0.1, 0.1, 0.06, 16]} /><meshStandardMaterial color="#1b1b1d" roughness={0.8} /></mesh>)}
    <mesh position={[0, 0.4, 0.856]}><planeGeometry args={[1.6, 0.4]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    <mesh position={[0, 0.4, 0.852]}><planeGeometry args={[1.72, 0.5]} /><meshStandardMaterial color="#4b5563" roughness={0.6} /></mesh>
    {[-0.7, -0.23, 0.23, 0.7].map(bx => <RoundedBox key={bx} args={[0.36, 0.1, 0.08]} radius={0.03} position={[bx, 0.1, 0.86]}><meshStandardMaterial color="#6b7280" roughness={0.5} /></RoundedBox>)}
    <mesh position={[0, 0.7, -0.25]} castShadow receiveShadow><cylinderGeometry args={[0.78, 0.8, 0.05, 64]} /><meshStandardMaterial color="#d7dbe0" roughness={0.22} metalness={1} /></mesh>
    <mesh position={[0, 0.69, -0.25]}><cylinderGeometry args={[0.12, 0.12, 0.08, 16]} /><meshStandardMaterial color="#9ca3af" roughness={0.4} metalness={0.9} /></mesh>
    {stone && <group position={[0, 0.725, -0.25]}><Stone /></group>}
  </group>;
}

export default function ZeroErrorScene() {
  return <div className="w-full">
    <div className="h-[260px] w-full sm:h-[320px]">
      <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ position: [0, 0.6, 14], fov: 17 }} frameloop="demand" style={{ pointerEvents: 'none' }} onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)} aria-label="Two balances seen straight on: an empty one reading +2.0 g and one with a stone reading 52.0 g">
        <Environment />
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 4, 6]} intensity={1.6} />
        <Balance x={-1.65} reading="+2.0" stone={false} />
        <Balance x={1.65} reading="52.0" stone />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.4} scale={9} blur={2.4} far={2} />
      </Canvas>
    </div>
    <div className="mt-2 grid grid-cols-2 gap-2 text-center text-sm font-bold text-slate-800">
      <span>Empty balance should read 0 g</span><span>Stone on the balance</span>
    </div>
    <p className="mt-2 rounded-xl border-2 border-amber-400 bg-amber-100 p-2 text-center font-extrabold text-slate-900">Corrected mass = 52.0 − 2.0 = 50.0 g</p>
    <p className="mt-1 text-center text-sm text-slate-600">Check or reset zero before measuring.</p>
  </div>;
}
