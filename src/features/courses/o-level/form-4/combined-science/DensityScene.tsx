import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from './sceneParts';

// A brick and a sponge of the same size, seen straight on, with their particles shown. Static render.
function rand(seed: number) {
  let t = seed;
  return () => { t = (t * 1664525 + 1013904223) % 4294967296; return t / 4294967296; };
}

function makeTexture(kind: 'brick' | 'sponge') {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  const r = rand(kind === 'brick' ? 7 : 21);
  if (kind === 'brick') {
    ctx.fillStyle = '#b4513a'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 5000; i++) {
      const light = r() > 0.5;
      ctx.fillStyle = light ? 'rgba(226,150,120,0.35)' : 'rgba(90,30,20,0.35)';
      ctx.fillRect(r() * 512, r() * 512, 2 + r() * 4, 2 + r() * 4);
    }
  } else {
    ctx.fillStyle = '#f2d03b'; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 260; i++) {
      const x = r() * 512, y = r() * 512, rad = 5 + r() * 15;
      ctx.fillStyle = 'rgba(255,240,150,0.9)'; ctx.beginPath(); ctx.ellipse(x, y, rad + 2, rad * 0.8 + 2, r() * 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a97d1c'; ctx.beginPath(); ctx.ellipse(x, y, rad, rad * 0.8, r() * 3, 0, Math.PI * 2); ctx.fill();
    }
  }
  const t = new THREE.CanvasTexture(canvas);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

const BOX: [number, number, number] = [1.5, 0.9, 0.9];

function particlePositions(kind: 'brick' | 'sponge') {
  const out: [number, number, number][] = [];
  if (kind === 'brick') {
    for (let ix = 0; ix < 7; ix++) for (let iy = 0; iy < 4; iy++) for (let iz = 0; iz < 4; iz++) out.push([-0.6 + ix * 0.2, -0.3 + iy * 0.2, -0.3 + iz * 0.2]);
  } else {
    const r = rand(5);
    let guard = 0;
    while (out.length < 12 && guard++ < 2000) {
      const p: [number, number, number] = [-0.6 + r() * 1.2, -0.3 + r() * 0.6, -0.3 + r() * 0.6];
      if (out.every(q => Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) > 0.34)) out.push(p);
    }
  }
  return out;
}

function Block({ x, kind }: { x: number; kind: 'brick' | 'sponge' }) {
  const map = useMemo(() => makeTexture(kind), [kind]);
  const particles = useMemo(() => particlePositions(kind), [kind]);
  return <group position={[x, 0.45, 0]}>
    <RoundedBox args={BOX} radius={kind === 'brick' ? 0.04 : 0.14} smoothness={4}>
      <meshStandardMaterial map={map} transparent opacity={0.38} roughness={1} metalness={0} depthWrite={false} />
    </RoundedBox>
    {particles.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.088, 20, 20]} /><meshStandardMaterial color="#1d4ed8" roughness={0.3} metalness={0.2} /></mesh>)}
  </group>;
}

function Panel({ kind, title, note }: { kind: 'brick' | 'sponge'; title: string; note: string }) {
  return <div className="rounded-xl border border-slate-200 p-3 text-center">
    <div className="h-[200px] w-full sm:h-[280px]">
      <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ position: [0, 0.45, 5.6], fov: 17 }} frameloop="demand" style={{ pointerEvents: 'none' }} onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)} aria-label={`${title} with its particles: ${note}`}>
        <Environment />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 4, 6]} intensity={1.4} />
        <Block x={0} kind={kind} />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.4} scale={4} blur={2.2} far={1.5} />
      </Canvas>
    </div>
    <p className="text-base font-bold text-slate-800">{title}</p>
    <p className="text-sm font-semibold text-slate-600">{note}</p>
  </div>;
}

export default function DensityScene() {
  return <div className="w-full">
    <div className="grid grid-cols-2 gap-3">
      <Panel kind="brick" title="Brick" note="heavy = high density" />
      <Panel kind="sponge" title="Sponge (Chisukiso)" note="light = low density" />
    </div>
    <p className="mt-2 text-center text-sm text-slate-600">Same size. Each blue dot is a tiny piece of the material. The brick has lots packed close together; the sponge has only a few, far apart.</p>
  </div>;
}
