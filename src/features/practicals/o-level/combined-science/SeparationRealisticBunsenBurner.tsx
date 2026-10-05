import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function RealisticBunsenBurner({ lit, heat, hoseEnd = [2.7, 0.08, -0.9] }: { lit: boolean; heat: number; hoseEnd?: [number, number, number] }) {
  const flameRef = useRef<THREE.Group>(null);
  const barrel = useMemo(() => new THREE.LatheGeometry([
    new THREE.Vector2(0.053, 0.13), new THREE.Vector2(0.053, 0.51),
    new THREE.Vector2(0.045, 0.515), new THREE.Vector2(0.037, 0.51),
    new THREE.Vector2(0.037, 0.13),
  ], 48), []);
  const hose = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.15, 0.105, 0), new THREE.Vector3(0.38, 0.08, 0.06),
    new THREE.Vector3(hoseEnd[0] * 0.3, 0.03, 0.38), new THREE.Vector3(hoseEnd[0] * 0.65, 0.03, 0.22),
    new THREE.Vector3(hoseEnd[0] * 0.87, 0.035, hoseEnd[2] * 0.75), new THREE.Vector3(...hoseEnd),
  ]), [hoseEnd[0], hoseEnd[1], hoseEnd[2]]);
  useEffect(() => () => barrel.dispose(), [barrel]);
  useFrame(({ clock }) => {
    if (!flameRef.current) return;
    const flicker = Math.sin(clock.elapsedTime * 21) * 0.025 + Math.sin(clock.elapsedTime * 13) * 0.015;
    flameRef.current.scale.set(1 + flicker, 0.75 + clamp(heat, 0, 1) * 0.3 + flicker, 1 + flicker);
  });
  return (
    <group>
      <mesh position={[0, 0.025, 0]} castShadow receiveShadow><cylinderGeometry args={[0.19, 0.215, 0.05, 64]} /><meshStandardMaterial color="#343b38" metalness={0.65} roughness={0.5} /></mesh>
      <mesh position={[0, 0.06, 0]} castShadow><cylinderGeometry args={[0.08, 0.105, 0.055, 32]} /><meshStandardMaterial color="#68736b" metalness={0.85} roughness={0.3} /></mesh>
      <mesh position={[0, 0.107, 0]} castShadow><cylinderGeometry args={[0.055, 0.065, 0.07, 32]} /><meshStandardMaterial color="#b39853" metalness={0.8} roughness={0.33} /></mesh>
      <mesh geometry={barrel} castShadow><meshStandardMaterial color="#a6afaa" metalness={0.85} roughness={0.28} /></mesh>
      <mesh position={[0, 0.18, 0]}><cylinderGeometry args={[0.059, 0.059, 0.075, 48, 1, true]} /><meshStandardMaterial color="#918766" metalness={0.8} roughness={0.4} /></mesh>
      {[0, Math.PI].map((angle) => <mesh key={angle} position={[Math.sin(angle) * 0.0595, 0.18, Math.cos(angle) * 0.0595]} rotation={[0, angle, 0]}>
        <capsuleGeometry args={[0.008, 0.025, 4, 12]} /><meshStandardMaterial color="#161c18" roughness={0.85} />
      </mesh>)}
      <mesh position={[0.106, 0.105, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.022, 0.024, 0.14, 24]} /><meshStandardMaterial color="#ae9354" metalness={0.8} roughness={0.35} /></mesh>
      <mesh position={[-0.08, 0.105, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.036, 0.036, 0.035, 24]} /><meshStandardMaterial color="#3c443d" metalness={0.3} roughness={0.65} /></mesh>
      <mesh><tubeGeometry args={[hose, 64, 0.024, 12, false]} /><meshStandardMaterial color="#303831" roughness={0.87} /></mesh>
      {lit && <group ref={flameRef} position={[0, 0.515, 0]}>
        <mesh position={[0, 0.13, 0]}><coneGeometry args={[0.047, 0.26, 32, 1, true]} /><meshBasicMaterial color="#2688f5" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh position={[0, 0.07, 0]}><coneGeometry args={[0.029, 0.14, 32, 1, true]} /><meshBasicMaterial color="#70dcff" transparent opacity={0.8} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        <mesh position={[0, 0.025, 0]}><coneGeometry args={[0.017, 0.05, 24]} /><meshBasicMaterial color="#c2f4ff" transparent opacity={0.75} depthWrite={false} /></mesh>
        <pointLight color="#69baff" intensity={0.12} distance={0.8} decay={2} />
      </group>}
    </group>
  );
}

