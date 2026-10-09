import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from './sceneParts';

// One person pushes a brick from behind (5 N); another pulls it with a string (3 N).
// Both forces act the same way, so they add: the resultant is 8 N. Loops by itself.
const LOOP = 8;
const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const SKIN = '#d9a07a';

function label(text: string, color: string, w = 512) {
  const c = document.createElement('canvas'); c.width = w; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = color; ctx.font = 'bold 74px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function Arrow({ length, color }: { length: number; color: string }) {
  const head = 0.22;
  return <group>
    <mesh position={[(length - head) / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.045, 0.045, length - head, 16]} /><meshStandardMaterial color={color} roughness={0.5} /></mesh>
    <mesh position={[length - head / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.12, head, 20]} /><meshStandardMaterial color={color} roughness={0.5} /></mesh>
  </group>;
}

function Hand({ side }: { side: 'push' | 'pull' }) {
  const rot = side === 'push' ? 0.8 : -0.8;
  return <group>
    <RoundedBox args={[0.3, 0.28, 0.3]} radius={0.08} smoothness={4}><meshStandardMaterial color={SKIN} roughness={0.7} /></RoundedBox>
    <group rotation={[0, 0, rot]}>
      <mesh position={[0, 0.55, 0]}><cylinderGeometry args={[0.1, 0.1, 1.1, 20]} /><meshStandardMaterial color={SKIN} roughness={0.7} /></mesh>
      <mesh position={[0, 1.15, 0]}><cylinderGeometry args={[0.15, 0.15, 0.8, 20]} /><meshStandardMaterial color={side === 'push' ? '#2563eb' : '#16a34a'} roughness={0.8} /></mesh>
    </group>
  </group>;
}

function Scene({ still }: { still: boolean }) {
  const mover = useRef<THREE.Group>(null);
  const pushG = useRef<THREE.Group>(null), pullG = useRef<THREE.Group>(null), resG = useRef<THREE.Group>(null);
  const textures = useMemo(() => ({
    push: label('Push 5 N', '#1d4ed8'), pull: label('Pull 3 N', '#15803d'), res: label('Resultant = 5 + 3 = 8 N', '#b91c1c', 1024),
  }), []);
  useFrame(({ clock }) => {
    const t = still ? 0.7 : (clock.elapsedTime % LOOP) / LOOP;
    if (mover.current) mover.current.position.x = -0.5 + 1.0 * seg(t, 0.42, 0.88);
    const pop = (g: THREE.Group | null, k: number) => { if (!g) return; g.visible = k > 0.01; g.scale.setScalar(0.6 + 0.4 * k); };
    pop(pushG.current, seg(t, 0.04, 0.16)); pop(pullG.current, seg(t, 0.04, 0.16)); pop(resG.current, seg(t, 0.22, 0.36));
  });
  return <group>
    <mesh position={[0, -0.05, 0]}><boxGeometry args={[9, 0.1, 1.4]} /><meshStandardMaterial color="#c9a679" roughness={0.9} /></mesh>
    <group ref={mover}>
      <RoundedBox args={[1.0, 0.5, 0.5]} radius={0.03} smoothness={3} position={[0, 0.25, 0]}><meshStandardMaterial color="#b4513a" roughness={0.95} /></RoundedBox>
      <mesh position={[1.05, 0.25, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.012, 0.012, 1.1, 8]} /><meshStandardMaterial color="#f5f1e6" roughness={0.9} /></mesh>
      <group position={[-0.68, 0.25, 0]}><Hand side="push" /></group>
      <group position={[1.62, 0.25, 0]}><Hand side="pull" /></group>
      <group ref={pushG} position={[-1.15, 1.0, 0]}><Arrow length={1.0} color="#2563eb" /><mesh position={[0.45, 0.32, 0]}><planeGeometry args={[1.5, 0.375]} /><meshBasicMaterial map={textures.push} transparent toneMapped={false} depthWrite={false} /></mesh></group>
      <group ref={pullG} position={[0.9, 1.0, 0]}><Arrow length={0.6} color="#16a34a" /><mesh position={[0.3, 0.32, 0]}><planeGeometry args={[1.5, 0.375]} /><meshBasicMaterial map={textures.pull} transparent toneMapped={false} depthWrite={false} /></mesh></group>
      <group ref={resG} position={[-0.8, -0.78, 0]}><Arrow length={1.6} color="#dc2626" /><mesh position={[0.8, 0.34, 0]}><planeGeometry args={[3.2, 0.4]} /><meshBasicMaterial map={textures.res} transparent toneMapped={false} depthWrite={false} /></mesh></group>
    </group>
  </group>;
}

export default function ResultantForceScene() {
  const still = useMemo(reducedMotion, []);
  return <div className="h-[260px] w-full sm:h-[340px]">
    <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ position: [0, 0.5, 10.5], fov: 24 }} style={{ pointerEvents: 'none' }} onCreated={({ camera }) => camera.lookAt(0, 0.45, 0)} aria-label="A person pushes a brick from behind with 5 newtons while another pulls it with a string with 3 newtons. The forces add to a resultant of 8 newtons.">
      <Environment />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 4, 6]} intensity={1.3} />
      <Scene still={still} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={9} blur={2.2} far={1.5} />
    </Canvas>
  </div>;
}
