import {Environment,Lightformer} from "@react-three/drei";
import {useMemo, type ReactNode} from "react";
import * as THREE from "three";
export const CANDLE_BOUNDS = { minX: -11.7, maxX: 11.7, minZ: -9.3, maxZ: 11.7 };
export const CANDLE_OBSTACLES = [{ minX: -1.9, maxX: 1.9, minZ: -0.9, maxZ: 0.9 }];
export const CANDLE_SPAWN = new THREE.Vector3(0, 0, 3.4);
export function CandleRoom({ children }: { children: ReactNode }) {
  const target=useMemo(()=>{const value=new THREE.Object3D();value.position.set(0,1.36,0);return value;},[]);
  return <>
    <Environment frames={1} resolution={64}><Lightformer form="rect" intensity={2.4} color="#fff7e8" position={[0,4.8,0]} rotation={[Math.PI/2,0,0]} scale={[4,3,1]}/><Lightformer form="rect" intensity={1.2} color="#edf7ff" position={[-4,3,-1]} rotation={[0,Math.PI/2,0]} scale={[3,2,1]}/></Environment>
    <color attach="background" args={["#526b6c"]} />
    <ambientLight intensity={0.3}/><hemisphereLight args={["#c1cfdd","#26303a",0.5]}/><primitive object={target}/><spotLight position={[0,5.2,0.4]} target={target} intensity={145} distance={10} angle={0.65} penumbra={0.85} color="#fff5e6" castShadow/>
    <directionalLight position={[-3, 5, 3]} intensity={0.7} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-6} shadow-camera-right={6} shadow-camera-top={6} shadow-camera-bottom={-6} shadow-bias={-0.0002} />
    <pointLight position={[3, 3.8, -2]} intensity={3} color="#ffe9cf" />
    <group name="Expanded candle laboratory architecture" scale={[2.4, 3, 2.4]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[10, 10]} /><meshStandardMaterial color="#303a43" roughness={0.88} /></mesh>
    {[[0, 2.3, -4, 10, 4.6, .18], [-5, 2.3, .5, .18, 4.6, 9], [5, 2.3, .5, .18, 4.6, 9], [0, 2.3, 5, 10, 4.6, .18]].map((p, i) => <mesh key={i} position={[p[0], p[1], p[2]]} receiveShadow><boxGeometry args={[p[3], p[4], p[5]]} /><meshStandardMaterial color={i === 0 ? "#465662" : "#3e4b56"} roughness={.95} /></mesh>)}
    {[-4, 5].map(z => <mesh key={z} position={[0, .09, z]}><boxGeometry args={[10, .18, .22]} /><meshStandardMaterial color="#374b48" /></mesh>)}
    <mesh position={[0, 4.6, .5]}><boxGeometry args={[10, .12, 9]} /><meshStandardMaterial color="#303b45" /></mesh>
    {/* Recessed window and joinery, deliberately free of wall charts. */}
    <group position={[-4.88, 2.6, 0]} rotation={[0, Math.PI / 2, 0]}>
      <mesh><boxGeometry args={[2.5, 2.1, .06]} /><meshStandardMaterial color="#b0cad0" emissive="#afcbd6" emissiveIntensity={.35} roughness={.22} /></mesh>
      {[-1.3, 0, 1.3].map(x => <mesh key={x} position={[x, 0, .06]}><boxGeometry args={[.07, 2.25, .08]} /><meshStandardMaterial color="#344946" /></mesh>)}
      {[-1.1, 1.1].map(y => <mesh key={y} position={[0, y, .06]}><boxGeometry args={[2.65, .07, .08]} /><meshStandardMaterial color="#344946" /></mesh>)}
    </group>
    </group>
    <mesh position={[0, 1.29, 0]} castShadow receiveShadow><boxGeometry args={[3.6, .14, 1.6]} /><meshStandardMaterial color="#45535a" roughness={.38} /></mesh>
    <mesh position={[0, .65, -.1]} castShadow receiveShadow><boxGeometry args={[3.35, 1.16, 1.25]} /><meshStandardMaterial color="#92775b" roughness={.65} /></mesh>
    {[-1.1, 0, 1.1].map(x => <group key={x}><mesh position={[x, .67, .535]}><boxGeometry args={[1.05, 1.02, .04]} /><meshStandardMaterial color="#a48b6e" roughness={.7} /></mesh><mesh position={[x, 1.02, .57]}><boxGeometry args={[.3, .025, .03]} /><meshStandardMaterial color="#9fa7a9" metalness={.8} roughness={.25} /></mesh></group>)}
    <mesh position={[0,5.1,0.4]}><boxGeometry args={[1.6,0.07,0.6]}/><meshStandardMaterial color="#f4eee0" emissive="#fff0ce" emissiveIntensity={1.4}/></mesh>
    {[-0.5,0.5].map(x=><mesh key={`lamp-suspension-${x}`} position={[x,9.45,0.4]}><cylinderGeometry args={[0.008,0.008,8.7,8]}/><meshStandardMaterial color="#76858e" metalness={0.7} roughness={0.4}/></mesh>)}
    {children}
  </>;
}
