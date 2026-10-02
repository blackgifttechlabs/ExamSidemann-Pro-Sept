import type { ReactNode } from "react";
import * as THREE from "three";
export const BREATHING_BOUNDS = { minX: -4.7, maxX: 4.7, minZ: -3.7, maxZ: 4.7 };
export const BREATHING_OBSTACLES = [{ minX: -1.9, maxX: 1.9, minZ: -0.9, maxZ: 0.9 }];
export const BREATHING_SPAWN = new THREE.Vector3(0, 0, 3.4);
export function BreathingRoom({ children }: { children: ReactNode }) {
  return <>
    <color attach="background" args={["#526b6c"]} />
    <hemisphereLight args={["#eef6fa", "#5a493a", 1.5]} />
    <directionalLight position={[-3, 5, 3]} intensity={2.4} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0002} />
    <pointLight position={[3, 3.8, -2]} intensity={12} color="#ffe9cf" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 10]} /><meshStandardMaterial color="#807b70" roughness={0.88} /></mesh>
    {[[0, 2.3, -4, 10, 4.6, .18], [-5, 2.3, .5, .18, 4.6, 9], [5, 2.3, .5, .18, 4.6, 9], [0, 2.3, 5, 10, 4.6, .18]].map((p, i) => <mesh key={i} position={[p[0], p[1], p[2]]} receiveShadow><boxGeometry args={[p[3], p[4], p[5]]} /><meshStandardMaterial color={i === 0 ? "#47666a" : "#657d78"} roughness={.95} /></mesh>)}
    {[-4, 5].map(z => <mesh key={z} position={[0, .09, z]}><boxGeometry args={[10, .18, .22]} /><meshStandardMaterial color="#374b48" /></mesh>)}
    <mesh position={[0, 4.6, .5]}><boxGeometry args={[10, .12, 9]} /><meshStandardMaterial color="#a4aaa2" /></mesh>
    {/* Recessed window and joinery, deliberately free of wall charts. */}
    <group position={[-4.88, 2.6, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh><boxGeometry args={[2.5, 2.1, .06]} /><meshStandardMaterial color="#b0cad0" emissive="#afcbd6" emissiveIntensity={.35} roughness={.22} /></mesh>
      {[-1.3, 0, 1.3].map(x => <mesh key={x} position={[x, 0, .06]}><boxGeometry args={[.07, 2.25, .08]} /><meshStandardMaterial color="#344946" /></mesh>)}
      {[-1.1, 1.1].map(y => <mesh key={y} position={[0, y, .06]}><boxGeometry args={[2.65, .07, .08]} /><meshStandardMaterial color="#344946" /></mesh>)}
    </group>
    <mesh position={[0, 1.29, 0]} castShadow receiveShadow><boxGeometry args={[3.6, .14, 1.6]} /><meshStandardMaterial color="#343e40" roughness={.38} /></mesh>
    <mesh position={[0, .65, -.1]} castShadow receiveShadow><boxGeometry args={[3.35, 1.16, 1.25]} /><meshStandardMaterial color="#92775b" roughness={.65} /></mesh>
    {[-1.1, 0, 1.1].map(x => <group key={x}><mesh position={[x, .67, .535]}><boxGeometry args={[1.05, 1.02, .04]} /><meshStandardMaterial color="#a48b6e" roughness={.7} /></mesh><mesh position={[x, 1.02, .57]}><boxGeometry args={[.3, .025, .03]} /><meshStandardMaterial color="#9fa7a9" metalness={.8} roughness={.25} /></mesh></group>)}
    {children}
  </>;
}
