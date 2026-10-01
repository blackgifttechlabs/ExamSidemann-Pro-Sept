import { useEffect, type ReactNode } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export const OXYGEN_BENCH_Y = 1.36;
export const OXYGEN_LAB_BOUNDS = { minX: -5.4, maxX: 5.4, minZ: -5.9, maxZ: 5.9 };
export const OXYGEN_LAB_OBSTACLES = [
  { minX: -2.7, maxX: 2.7, minZ: -1.5, maxZ: 1.5 },
  { minX: -5.7, maxX: -4.6, minZ: -4.9, maxZ: 1.4 },
  { minX: 4.6, maxX: 5.7, minZ: -4.9, maxZ: 1.4 },
];
export const OXYGEN_PLAYER_SPAWN = new THREE.Vector3(0, 2.15, 4.2);
function GlassReflections() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const previous = scene.environment;
    const previousIntensity = scene.environmentIntensity;
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04);
    room.dispose(); generator.dispose();
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.42;
    return () => { scene.environment = previous; scene.environmentIntensity = previousIntensity; environment.dispose(); };
  }, [gl, scene]);
  return null;
}
/** This experiment owns its room and furniture; no shared lab model or wall displays. */
export function OxygenLabRoom({ children }: { children: ReactNode }) {
  return <group name="Oxygen photosynthesis laboratory">
    <color attach="background" args={["#d7e3df"]} />
    <fog attach="fog" args={["#d7e3df", 15, 30]} />
    <GlassReflections />
    <hemisphereLight args={["#f6fbff", "#627565", 1.1]} />
    <directionalLight position={[-4, 7, 1]} intensity={2.2} color="#fff7e6" castShadow
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6}
      shadow-camera-top={6} shadow-camera-bottom={-6} shadow-normalBias={0.025} />
    <pointLight position={[2, 3.8, 2]} intensity={8} distance={10} color="#edf8ff" />
    <mesh position={[0, -0.08, 0]} receiveShadow><boxGeometry args={[12, 0.16, 14]} /><meshStandardMaterial color="#b8c6c0" roughness={0.84} /></mesh>
    {Array.from({ length: 13 }, (_, i) => <mesh key={`floor-${i}`} position={[-6 + i, 0.002, 0]}>
      <boxGeometry args={[0.009, 0.002, 14]} /><meshStandardMaterial color="#a6b5ae" roughness={1} />
    </mesh>)}
    {Array.from({ length: 15 }, (_, i) => <mesh key={`cross-${i}`} position={[0, 0.003, -7 + i]}>
      <boxGeometry args={[12, 0.002, 0.009]} /><meshStandardMaterial color="#a6b5ae" roughness={1} />
    </mesh>)}
    <mesh position={[0, 2.6, -7]} receiveShadow><boxGeometry args={[12, 5.2, 0.14]} /><meshStandardMaterial color="#d9e4dd" roughness={0.95} /></mesh>
    <mesh position={[6, 2.6, 0]}><boxGeometry args={[0.14, 5.2, 14]} /><meshStandardMaterial color="#cddbd3" roughness={0.95} /></mesh>
    <mesh position={[-6, 0.85, 0]}><boxGeometry args={[0.14, 1.7, 14]} /><meshStandardMaterial color="#c4d5cb" roughness={0.95} /></mesh>
    <mesh position={[-6, 4.65, 0]}><boxGeometry args={[0.14, 1.1, 14]} /><meshStandardMaterial color="#e3eae4" roughness={0.95} /></mesh>
    <group position={[-5.95, 2.95, -1]} rotation={[0, Math.PI / 2, 0]}>
      <mesh><planeGeometry args={[10, 2.5]} /><meshBasicMaterial color="#bdd8df" /></mesh>
      {[-5, -2.5, 0, 2.5, 5].map(x => <mesh key={x} position={[x, 0, 0.025]}>
        <boxGeometry args={[0.045, 2.58, 0.06]} /><meshStandardMaterial color="#f3f5ed" roughness={0.5} />
      </mesh>)}
      <mesh position={[0, -1.29, 0.07]}><boxGeometry args={[10.15, 0.1, 0.22]} /><meshStandardMaterial color="#f3f5ed" /></mesh>
    </group>
    <mesh position={[0, 5.2, 0]}><boxGeometry args={[12, 0.12, 14]} /><meshStandardMaterial color="#ebefea" roughness={1} /></mesh>
    {[-2, 2].map(x => <group key={x} position={[x, 4.95, -0.4]}>
      <mesh><boxGeometry args={[1.2, 0.08, 2.5]} /><meshStandardMaterial color="#5e736c" /></mesh>
      <mesh position={[0, -0.045, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[1.12, 2.4]} /><meshBasicMaterial color="#fff9e8" /></mesh>
    </group>)}
    {[-1, 1].map(side => <group key={side} position={[side * 5.15, 0.62, -2.1]}>
      <mesh castShadow receiveShadow><boxGeometry args={[1.15, 1.24, 5.5]} /><meshStandardMaterial color="#627f70" roughness={0.74} /></mesh>
      <mesh position={[0, 0.65, 0]}><boxGeometry args={[1.28, 0.08, 5.65]} /><meshStandardMaterial color="#dce5df" roughness={0.45} /></mesh>
      {[-2, -0.7, 0.7, 2].map(z => <mesh key={z} position={[-side * 0.6, 0, z]}>
        <boxGeometry args={[0.02, 1.08, 1.15]} /><meshStandardMaterial color="#7c9685" roughness={0.8} />
      </mesh>)}
    </group>)}
    <group name="Photosynthesis workbench">
      <mesh position={[0, OXYGEN_BENCH_Y - 0.055, 0]} receiveShadow castShadow><boxGeometry args={[5.4, 0.11, 3]} /><meshStandardMaterial color="#e5e9df" roughness={0.46} /></mesh>
      <mesh position={[0, OXYGEN_BENCH_Y - 0.13, 0]}><boxGeometry args={[5.43, 0.06, 3.03]} /><meshStandardMaterial color="#526f60" roughness={0.58} /></mesh>
      {[-2.3, 2.3].flatMap(x => [-1.12, 1.12].map(z => <mesh key={`${x}-${z}`} position={[x, 0.6, z]} castShadow>
        <boxGeometry args={[0.1, 1.2, 0.1]} /><meshStandardMaterial color="#526b60" metalness={0.65} roughness={0.36} />
      </mesh>))}
      <mesh position={[-0.55, OXYGEN_BENCH_Y + 0.008, 0.05]} receiveShadow><boxGeometry args={[1.02, 0.016, 1.02]} /><meshStandardMaterial color="#80948b" roughness={0.94} /></mesh>
      <mesh position={[0.67, OXYGEN_BENCH_Y + 0.018, 0.22]} receiveShadow><boxGeometry args={[0.8, 0.036, 0.42]} /><meshStandardMaterial color="#d2d8d0" roughness={0.68} metalness={0.18} /></mesh>
    </group>
    {children}
  </group>;
}
