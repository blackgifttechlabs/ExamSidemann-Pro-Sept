import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Environment } from './sceneParts';

// Realistic 3D versions of Newton's laws: the bus that brakes, two trolleys with the same push,
// and two skaters pushing apart. Straight-on view, loops by itself, not interactive.
const ease = (x: number) => { const c = Math.min(1, Math.max(0, x)); return c * c * (3 - 2 * c); };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const reducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function useT(loop: number, still: boolean, restAt: number) {
  const t = useRef(restAt);
  return (clock: THREE.Clock) => { t.current = still ? restAt : (clock.elapsedTime % loop) / loop; return t.current; };
}

function Arrow3D({ length, color, flip = false }: { length: number; color: string; flip?: boolean }) {
  const head = 0.28;
  return <group rotation={[0, flip ? Math.PI : 0, 0]}>
    <mesh position={[(length - head) / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><cylinderGeometry args={[0.05, 0.05, length - head, 16]} /><meshStandardMaterial color={color} roughness={0.5} /></mesh>
    <mesh position={[length - head / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.14, head, 20]} /><meshStandardMaterial color={color} roughness={0.5} /></mesh>
  </group>;
}

function Wheel({ x, y, z = 0, r, spin }: { x: number; y: number; z?: number; r: number; spin: React.RefObject<THREE.Group | null> }) {
  return <group position={[x, y, z]} ref={spin as React.RefObject<THREE.Group>}>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[r, r, r * 0.7, 32]} /><meshStandardMaterial color="#1c1c1f" roughness={0.9} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, r * 0.36]}><cylinderGeometry args={[r * 0.55, r * 0.55, 0.02, 24]} /><meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[r * 0.3, 0, r * 0.38]}><boxGeometry args={[r * 0.35, r * 0.12, 0.02]} /><meshStandardMaterial color="#dc2626" /></mesh>
  </group>;
}

function SeatedPerson({ shirt, lean }: { shirt: string; lean: React.RefObject<THREE.Group | null> }) {
  const skin = '#d9a07a', trousers = '#1e3a8a';
  return <group>
    {/* legs: thighs go forward along the seat, shins go down to the floor */}
    {[-0.09, 0.09].map(z => <group key={z}>
      <mesh position={[0.15, 0.08, z]} rotation={[0, 0, -Math.PI / 2]}><capsuleGeometry args={[0.075, 0.2, 6, 12]} /><meshStandardMaterial color={trousers} roughness={0.8} /></mesh>
      <mesh position={[0.33, -0.12, z]}><capsuleGeometry args={[0.06, 0.2, 6, 12]} /><meshStandardMaterial color={trousers} roughness={0.8} /></mesh>
      <mesh position={[0.37, -0.31, z]}><boxGeometry args={[0.18, 0.06, 0.1]} /><meshStandardMaterial color="#111827" roughness={0.6} /></mesh>
    </group>)}
    {/* body: leans forward from the hips */}
    <group ref={lean as React.RefObject<THREE.Group>} position={[0, 0.08, 0]}>
      <mesh position={[0, 0.27, 0]}><capsuleGeometry args={[0.14, 0.26, 8, 16]} /><meshStandardMaterial color={shirt} roughness={0.7} /></mesh>
      <mesh position={[0, 0.6, 0]}><capsuleGeometry args={[0.04, 0.05, 4, 8]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>
      <mesh position={[0.02, 0.76, 0]}><sphereGeometry args={[0.12, 24, 24]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>
      <mesh position={[0.08, 0.32, 0.15]} rotation={[0, 0, -1.1]}><capsuleGeometry args={[0.045, 0.26, 6, 10]} /><meshStandardMaterial color={skin} roughness={0.7} /></mesh>
    </group>
  </group>;
}

/* ---------- 1. The bus hits a barrier, the passenger keeps going ---------- */
const BUS_START = -4.6, BUS_HIT = 1.38, T_HIT = 0.38;
function BusScene({ still }: { still: boolean }) {
  const next = useT(8, still, 0.7);
  const bus = useRef<THREE.Group>(null), pg = useRef<THREE.Group>(null), tilt = useRef<THREE.Group>(null);
  const lean = useRef<THREE.Group>(null), glass = useRef<THREE.Mesh>(null), force = useRef<THREE.Group>(null), fwd = useRef<THREE.Group>(null);
  const w1 = useRef<THREE.Group>(null), w2 = useRef<THREE.Group>(null), barrier = useRef<THREE.Group>(null), burst = useRef<THREE.Group>(null);
  const sparks = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ a: (i / 9) * Math.PI, d: 0.5 + (i % 3) * 0.25 })), []);
  useFrame(({ clock }, dt) => {
    const t = next(clock);
    // The bus speeds up, hits the barrier and stops almost at once.
    const run = seg(t, 0.02, T_HIT);
    let x = lerp(BUS_START, BUS_HIT, Math.pow(run, 1.6));
    if (t > T_HIT) x = BUS_HIT - 0.14 * Math.sin(Math.min(1, (t - T_HIT) / 0.1) * Math.PI) * (t < T_HIT + 0.1 ? 1 : 0);
    if (bus.current) bus.current.position.x = x;
    if (tilt.current) tilt.current.rotation.z = -0.05 * Math.sin(Math.min(1, Math.max(0, (t - T_HIT) / 0.12)) * Math.PI);
    const driving = t < T_HIT && !still ? 1 : 0;
    [w1.current, w2.current].forEach(w => { if (w) w.rotation.z -= 0.35 * driving * (dt * 60) * 0.5; });
    if (barrier.current) barrier.current.position.x = 3.4 + (t > T_HIT && t < T_HIT + 0.08 ? 0.04 : 0);
    if (glass.current) glass.current.visible = t < T_HIT;
    // The passenger moves with the bus, then keeps going on his own: through the windscreen, over the barrier and onto the road.
    const px = BUS_HIT - 0.32;
    const u = Math.min(1, Math.max(0, (t - T_HIT) / 0.26));
    if (pg.current) {
      if (t < T_HIT) { pg.current.position.set(x - 0.32, 0.82, -0.05); pg.current.rotation.set(0, 0, 0); }
      else {
        const e = u;
        pg.current.position.set(px + 3.3 * e, 0.82 + 2.4 * e * (1 - e) - 0.62 * e * e, -0.05);
        pg.current.rotation.set(0, 0, -(0.35 + 1.3 * e));
      }
    }
    if (lean.current) lean.current.rotation.z = -0.35 * seg(t, T_HIT, T_HIT + 0.05);
    if (force.current) force.current.visible = (t > T_HIT && t < T_HIT + 0.2) || still;
    if (fwd.current && pg.current) { fwd.current.visible = (t > T_HIT && t < 0.7) || still; fwd.current.position.set(pg.current.position.x - 0.2, pg.current.position.y + 1.0, 0.1); }
    if (burst.current) {
      const k = seg(t, T_HIT, T_HIT + 0.12), fade = 1 - seg(t, T_HIT + 0.05, T_HIT + 0.2);
      burst.current.visible = t > T_HIT && t < T_HIT + 0.2;
      burst.current.scale.setScalar(0.2 + k * 1.2);
      burst.current.children.forEach(c => { const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial; m.opacity = fade; });
    }
  });
  return <group>
    <mesh position={[0, -0.04, 0]}><boxGeometry args={[16, 0.08, 1.8]} /><meshStandardMaterial color="#3f3f46" roughness={0.95} /></mesh>
    {[-6, -4.4, -2.8, -1.2, 0.4, 2, 3.6, 5.2].map(x => <mesh key={x} position={[x, 0.005, 0.7]}><boxGeometry args={[0.8, 0.01, 0.06]} /><meshStandardMaterial color="#fafafa" /></mesh>)}
    <group ref={barrier} position={[3.4, 0, 0]}>
      <RoundedBox args={[0.5, 0.7, 1.3]} radius={0.04} smoothness={3} position={[0, 0.35, 0]}><meshStandardMaterial color="#9ca3af" roughness={0.9} /></RoundedBox>
      <mesh position={[-0.255, 0.55, 0]}><boxGeometry args={[0.02, 0.14, 1.3]} /><meshStandardMaterial color="#dc2626" /></mesh>
      <mesh position={[-0.255, 0.3, 0]}><boxGeometry args={[0.02, 0.14, 1.3]} /><meshStandardMaterial color="#fafafa" /></mesh>
    </group>
    <group ref={bus}>
      <group ref={tilt} position={[0, 0.3, 0]}><group position={[0, -0.3, 0]}>
        <RoundedBox args={[3.4, 0.14, 1.1]} radius={0.04} smoothness={3} position={[0, 0.44, 0]}><meshStandardMaterial color="#8a6a1a" roughness={0.8} /></RoundedBox>
        <RoundedBox args={[3.4, 0.16, 1.1]} radius={0.06} smoothness={3} position={[0, 1.88, 0]}><meshStandardMaterial color="#f5c518" roughness={0.45} /></RoundedBox>
        <mesh position={[-1.65, 1.16, 0]}><boxGeometry args={[0.1, 1.45, 1.1]} /><meshStandardMaterial color="#f5c518" roughness={0.45} /></mesh>
        <mesh position={[1.65, 0.7, 0]}><boxGeometry args={[0.1, 0.52, 1.1]} /><meshStandardMaterial color="#f5c518" roughness={0.45} /></mesh>
        <mesh position={[1.65, 1.77, 0]}><boxGeometry args={[0.1, 0.24, 1.1]} /><meshStandardMaterial color="#f5c518" roughness={0.45} /></mesh>
        <mesh ref={glass} position={[1.68, 1.3, 0]}><boxGeometry args={[0.04, 0.7, 0.9]} /><meshPhysicalMaterial color="#bfe8ff" transparent opacity={0.55} roughness={0.05} /></mesh>
        <mesh position={[0, 1.16, -0.52]}><boxGeometry args={[3.3, 1.45, 0.06]} /><meshStandardMaterial color="#f5c518" roughness={0.45} /></mesh>
        {[-1.1, -0.4, 0.3, 1.0].map(x => <mesh key={x} position={[x, 1.42, -0.485]}><boxGeometry args={[0.55, 0.5, 0.02]} /><meshPhysicalMaterial color="#8fd0f5" roughness={0.1} metalness={0.2} /></mesh>)}
        <mesh position={[0, 0.58, 0.56]}><boxGeometry args={[3.4, 0.2, 0.04]} /><meshStandardMaterial color="#b45309" roughness={0.6} /></mesh>
        <mesh position={[0, 0.72, 0.54]}><boxGeometry args={[3.38, 0.04, 0.02]} /><meshStandardMaterial color="#c2410c" /></mesh>
        <mesh position={[0, 1.66, 0.53]}><boxGeometry args={[3.38, 0.06, 0.04]} /><meshStandardMaterial color="#f5c518" roughness={0.45} /></mesh>
        <mesh position={[-0.2, 0.62, -0.05]}><boxGeometry args={[0.8, 0.22, 0.55]} /><meshStandardMaterial color="#1e293b" roughness={0.8} /></mesh>
        <mesh position={[-0.2, 0.77, -0.05]}><boxGeometry args={[0.8, 0.1, 0.55]} /><meshStandardMaterial color="#1d4ed8" roughness={0.8} /></mesh>
        <mesh position={[-0.55, 1.08, -0.05]}><boxGeometry args={[0.1, 0.6, 0.55]} /><meshStandardMaterial color="#1d4ed8" roughness={0.8} /></mesh>
        <mesh position={[1.72, 0.65, 0.3]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#fde68a" emissive="#fde68a" emissiveIntensity={0.6} /></mesh>
      </group></group>
      <Wheel x={-1.0} y={0.3} z={0.5} r={0.3} spin={w1} />
      <Wheel x={1.0} y={0.3} z={0.5} r={0.3} spin={w2} />
    </group>
    <group ref={pg}><group scale={0.88}><SeatedPerson shirt="#ef4444" lean={lean} /></group></group>
    <group ref={burst} position={[BUS_HIT + 1.95, 0.7, 0.5]} visible={false}>
      {sparks.map((p, i) => <mesh key={i} position={[Math.cos(p.a) * p.d * 0.6, Math.sin(p.a) * p.d * 0.9, 0]}><sphereGeometry args={[0.07, 10, 10]} /><meshBasicMaterial color={i % 2 ? '#f97316' : '#fde047'} transparent /></mesh>)}
    </group>
    <group ref={force} position={[BUS_HIT + 2.6, 1.55, 0.7]} visible={false}><Arrow3D length={0.9} color="#dc2626" flip /></group>
    <group ref={fwd} visible={false}><Arrow3D length={0.9} color="#16a34a" /></group>
  </group>;
}

/* ---------- 2. The same push on a light and a heavy trolley ---------- */
function Trolley({ x, y, w, h, color, wr, refGroup, spin }: { x: number; y: number; w: number; h: number; color: string; wr: number; refGroup: React.RefObject<THREE.Group | null>; spin: React.RefObject<THREE.Group | null>[] }) {
  return <group ref={refGroup as React.RefObject<THREE.Group>} position={[x, y, 0]}>
    <RoundedBox args={[w, h, w * 0.6]} radius={0.05} smoothness={3} position={[0, wr * 1.6 + h / 2, 0]}><meshStandardMaterial color={color} roughness={0.55} metalness={0.1} /></RoundedBox>
    <Wheel x={-w * 0.3} y={wr} z={w * 0.3} r={wr} spin={spin[0]} />
    <Wheel x={w * 0.3} y={wr} z={w * 0.3} r={wr} spin={spin[1]} />
  </group>;
}
function TrolleyScene({ still }: { still: boolean }) {
  const next = useT(6, still, 0.7);
  const lg = useRef<THREE.Group>(null), hv = useRef<THREE.Group>(null);
  const s1 = useRef<THREE.Group>(null), s2 = useRef<THREE.Group>(null), s3 = useRef<THREE.Group>(null), s4 = useRef<THREE.Group>(null);
  const pa = useRef<THREE.Group>(null), pb = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    const t = next(clock);
    const k = Math.max(0, t - 0.08) / 0.8; const kk = Math.min(1, k);
    const dLight = 2.6 * kk * kk, dHeavy = 0.9 * kk * kk;
    if (lg.current) lg.current.position.x = -2.2 + dLight;
    if (hv.current) hv.current.position.x = -2.2 + dHeavy;
    [[s1.current, dLight, 0.26], [s2.current, dLight, 0.26], [s3.current, dHeavy, 0.34], [s4.current, dHeavy, 0.34]].forEach(([g, d, r]) => { if (g) (g as THREE.Group).rotation.z = -((d as number) / (r as number)); });
    [pa.current, pb.current].forEach(a => { if (a) { a.visible = t < 0.55 || still; a.position.x = (a === pa.current ? lg.current?.position.x ?? 0 : hv.current?.position.x ?? 0) - 1.25; } });
  });
  return <group>
    <mesh position={[0, 1.18, 0]}><boxGeometry args={[7.6, 0.06, 1.4]} /><meshStandardMaterial color="#a3835a" roughness={0.9} /></mesh>
    <mesh position={[0, -0.03, 0]}><boxGeometry args={[7.6, 0.06, 1.4]} /><meshStandardMaterial color="#a3835a" roughness={0.9} /></mesh>
    <Trolley x={-2.2} y={1.21} w={0.9} h={0.45} color="#0ea5e9" wr={0.15} refGroup={lg} spin={[s1, s2]} />
    <Trolley x={-2.2} y={0} w={1.5} h={0.8} color="#b45309" wr={0.22} refGroup={hv} spin={[s3, s4]} />
    <group ref={pa} position={[-3.4, 1.6, 0.4]}><Arrow3D length={0.8} color="#2563eb" /></group>
    <group ref={pb} position={[-3.4, 0.5, 0.4]}><Arrow3D length={0.8} color="#2563eb" /></group>
  </group>;
}

/* ---------- 3. A footballer kicks a ball into a wall: zoom in on the impact ---------- */
function brickTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#cbbfae'; ctx.fillRect(0, 0, 512, 512);
  for (let row = 0; row < 8; row++) for (let col = -1; col < 5; col++) {
    const x = col * 128 + (row % 2 ? 64 : 0) + 3, y = row * 64 + 3;
    ctx.fillStyle = ['#b4513a', '#a9462f', '#bd5b43'][(row + col + 6) % 3]; ctx.fillRect(x, y, 122, 58);
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.6, 1.6); t.anisotropy = 4;
  return t;
}
function ballTexture() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#fafafa'; ctx.fillRect(0, 0, 256, 128);
  ctx.fillStyle = '#111827';
  [[40, 40], [128, 28], [216, 40], [84, 96], [172, 96], [128, 64]].forEach(([x, y]) => { ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; ctx.lineTo(x + Math.cos(a) * 16, y + Math.sin(a) * 16); } ctx.closePath(); ctx.fill(); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function label3(text: string, color: string) {
  const c = document.createElement('canvas'); c.width = 768; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = color; ctx.font = 'bold 78px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 384, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function KickScene({ still }: { still: boolean }) {
  const next = useT(10, still, 0.52);
  const { camera } = useThree();
  const ballRef = useRef<THREE.Mesh>(null), legRef = useRef<THREE.Group>(null), armsRef = useRef<THREE.Group>(null), arrows = useRef<THREE.Group>(null), person = useRef<THREE.Group>(null);
  const wallTex = useMemo(() => brickTexture(), []), ballTex = useMemo(() => ballTexture(), []);
  const lab = useMemo(() => ({ onWall: label3('Ball pushes wall', '#1d4ed8'), onBall: label3('Wall pushes ball', '#dc2626') }), []);
  useFrame(({ clock }) => {
    const t = next(clock);
    // the kick
    const swing = seg(t, 0.05, 0.14) - seg(t, 0.14, 0.2);       // leg goes back, then forward through the ball
    // wind up (back), swing through the ball (contact at t = 0.16), follow through, then return
    const kickAngle = lerp(0, -0.7, seg(t, 0.04, 0.12)) + lerp(0, 1.15, seg(t, 0.12, 0.16)) + lerp(0, 0.65, seg(t, 0.16, 0.22)) - lerp(0, 1.1, seg(t, 0.26, 0.38));
    void swing;
    if (legRef.current) legRef.current.rotation.z = kickAngle;
    if (person.current) person.current.rotation.z = -0.1 * seg(t, 0.05, 0.14) + 0.1 * seg(t, 0.14, 0.2);
    // the ball: kicked, flies to the wall, squashes, rebounds
    const fly = seg(t, 0.16, 0.44);
    let bx = lerp(-1.1, 1.82, fly), by = 0.16 + 0.26 * fly, sx = 1, sy = 1;
    const press = seg(t, 0.44, 0.52) - seg(t, 0.52, 0.6);
    sx = 1 - 0.38 * press; sy = 1 + 0.18 * press;
    if (t >= 0.44) { bx = 1.82 + 0.05 - 0.2 * press; }
    const back = seg(t, 0.58, 0.88);
    if (t > 0.6) { bx = lerp(1.87, 0.2, 1 - Math.pow(1 - back, 2)); by = 0.4 - 0.2 * back + Math.abs(Math.sin(back * Math.PI * 2.2)) * 0.12 * (1 - back); }
    if (ballRef.current) { ballRef.current.position.set(bx, Math.max(0.16, by), 0); ballRef.current.scale.set(sx, sy, sy); ballRef.current.rotation.z = -fly * 10 + (t > 0.6 ? back * 6 : 0); }
    if (arrows.current) arrows.current.visible = (t > 0.46 && t < 0.62) || still;
    // camera: wide shot, zoom in on the impact, then zoom back out
    const z = seg(t, 0.34, 0.46) - seg(t, 0.68, 0.84);
    camera.position.set(lerp(0, 1.65, z), lerp(1.4, 0.72, z), lerp(11, 4.3, z));
    camera.lookAt(lerp(0, 1.65, z), lerp(1.0, 0.72, z), 0);
  });
  return <group>
    <mesh position={[0, -0.04, 0]}><boxGeometry args={[14, 0.08, 3]} /><meshStandardMaterial color="#4d8f3a" roughness={1} /></mesh>
    <mesh position={[2.25, 1.1, 0]}><boxGeometry args={[0.5, 2.2, 3]} /><meshStandardMaterial map={wallTex} roughness={0.95} /></mesh>
    <group ref={person} position={[-1.65, 0, 0]}>
      <mesh position={[0, 0.5, -0.07]}><capsuleGeometry args={[0.085, 0.5, 6, 12]} /><meshStandardMaterial color="#1e3a8a" roughness={0.8} /></mesh>
      <mesh position={[-0.02, 0.06, -0.07]}><boxGeometry args={[0.28, 0.08, 0.12]} /><meshStandardMaterial color="#111827" /></mesh>
      <group ref={legRef} position={[0, 0.92, 0.07]}>
        <mesh position={[0, -0.3, 0]}><capsuleGeometry args={[0.085, 0.46, 6, 12]} /><meshStandardMaterial color="#1e3a8a" roughness={0.8} /></mesh>
        <mesh position={[0.06, -0.62, 0]}><boxGeometry args={[0.28, 0.09, 0.13]} /><meshStandardMaterial color="#111827" /></mesh>
      </group>
      <mesh position={[0.02, 1.3, 0]}><capsuleGeometry args={[0.17, 0.4, 8, 16]} /><meshStandardMaterial color="#dc2626" roughness={0.7} /></mesh>
      <mesh position={[0.04, 1.8, 0]}><sphereGeometry args={[0.14, 24, 24]} /><meshStandardMaterial color="#d9a07a" roughness={0.7} /></mesh>
      <group ref={armsRef}>
        <mesh position={[-0.18, 1.32, 0.18]} rotation={[0, 0, 0.7]}><capsuleGeometry args={[0.05, 0.4, 6, 10]} /><meshStandardMaterial color="#d9a07a" roughness={0.7} /></mesh>
        <mesh position={[0.2, 1.32, -0.18]} rotation={[0, 0, -0.7]}><capsuleGeometry args={[0.05, 0.4, 6, 10]} /><meshStandardMaterial color="#d9a07a" roughness={0.7} /></mesh>
      </group>
    </group>
    <mesh ref={ballRef} position={[-1.1, 0.16, 0]}><sphereGeometry args={[0.16, 32, 32]} /><meshStandardMaterial map={ballTex} roughness={0.5} /></mesh>
    <group ref={arrows} visible={false}>
      <group position={[1.42, 1.1, 0.4]}><Arrow3D length={0.56} color="#2563eb" /></group>
      <mesh position={[1.0, 1.32, 0.4]}><planeGeometry args={[1.8, 0.3]} /><meshBasicMaterial map={lab.onWall} transparent toneMapped={false} depthWrite={false} /></mesh>
      <group position={[1.8, 0.62, 0.4]}><Arrow3D length={0.56} color="#dc2626" flip /></group>
      <mesh position={[1.0, 0.84, 0.4]}><planeGeometry args={[1.8, 0.3]} /><meshBasicMaterial map={lab.onBall} transparent toneMapped={false} depthWrite={false} /></mesh>
    </group>
  </group>;
}

function Fit({ half, fov = 22 }: { half: number; fov?: number }) {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const z = Math.max(9, half / (Math.tan((fov * Math.PI) / 360) * aspect));
    camera.position.z = z; camera.updateProjectionMatrix();
  }, [camera, size, half, fov]);
  return null;
}

function Stage({ children, camera, look, height = 300, half }: { children: React.ReactNode; camera: [number, number, number]; look: number; height?: number; half?: number }) {
  return <div style={{ height }} className="w-full">
    <Canvas dpr={[1, 2]} gl={{ alpha: true }} camera={{ position: camera, fov: 22 }} style={{ pointerEvents: 'none' }} onCreated={({ camera: c }) => c.lookAt(0, look, 0)}>
      <Environment />
      {half ? <Fit half={half} /> : null}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 6]} intensity={1.4} />
      {children}
      <ContactShadows position={[0, 0.001, 0]} opacity={0.35} scale={9} blur={2.4} far={1.5} />
    </Canvas>
  </div>;
}

export function BusBrakeScene() {
  const still = useMemo(reducedMotion, []);
  return <figure className="w-full">
    <Stage camera={[0, 1.4, 14]} look={1.1} height={330} half={6.6}><BusScene still={still} /></Stage>
    <figcaption className="text-center text-base text-slate-700">The bus hits a barrier and stops at once, but the passenger <strong>keeps moving forward</strong> at the same speed and is thrown out. A seat belt gives the force that would stop them.</figcaption>
  </figure>;
}
export function TrolleyPushScene() {
  const still = useMemo(reducedMotion, []);
  return <figure className="w-full">
    <Stage camera={[0, 1.0, 12]} look={0.95} height={300}><TrolleyScene still={still} /></Stage>
    <figcaption className="text-center text-base text-slate-700">The same 12 N push. The <strong>light</strong> 2 kg trolley (top) speeds up more than the <strong>heavy</strong> 6 kg trolley (bottom). F = ma.</figcaption>
  </figure>;
}
export function KickBallScene() {
  const still = useMemo(reducedMotion, []);
  return <figure className="w-full">
    <Stage camera={[0, 1.4, 11]} look={1.0} height={330}><KickScene still={still} /></Stage>
    <figcaption className="text-center text-base text-slate-700">A footballer kicks the ball into a wall. The camera zooms in on the moment of impact: the ball pushes the wall, and the wall pushes the ball back with an <strong>equal and opposite</strong> force. The two forces act on <strong>different objects</strong>.</figcaption>
  </figure>;
}
