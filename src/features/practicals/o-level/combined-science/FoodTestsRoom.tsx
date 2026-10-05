import * as THREE from 'three';

/** Architecture and furniture made specifically for the food tests practical. */
export function FoodTestsRoom() {
  return (
    <group name="Food chemistry laboratory" position={[0, 1.075, 0]} scale={[1.5, 1.5, 1.5]}>
      <mesh position={[0, -2.22, 3.85]} receiveShadow>
        <boxGeometry args={[30, 0.14, 22]} />
        <meshStandardMaterial color="#303a43" roughness={0.85} />
      </mesh>
      {Array.from({ length: 15 }, (_, i) => (
        <mesh key={`floor-x-${i}`} position={[-14 + i * 2, -2.145, 3.85]}>
          <boxGeometry args={[0.012, 0.002, 22]} /><meshStandardMaterial color="#45515b" roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={`floor-z-${i}`} position={[0, -2.145, -6.15 + i * 2]}>
          <boxGeometry args={[30, 0.002, 0.012]} /><meshStandardMaterial color="#45515b" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 2.675, -7.22]} receiveShadow><boxGeometry args={[30, 9.65, 0.14]} /><meshStandardMaterial color="#83949e" roughness={0.92} /></mesh>
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 15.07, 2.675, 3.85]} receiveShadow><boxGeometry args={[0.14, 9.65, 22]} /><meshStandardMaterial color="#3f5159" roughness={0.9} side={THREE.DoubleSide} /></mesh>
          <mesh position={[side * 14.94, -0.72, 3.85]}><boxGeometry args={[0.08, 2.85, 22]} /><meshStandardMaterial color="#465d69" roughness={0.85} /></mesh>
          <mesh position={[side * 14.88, 0.72, 3.85]}><boxGeometry args={[0.12, 0.045, 22]} /><meshStandardMaterial color="#b8c5bc" roughness={0.4} /></mesh>
          <group position={[side * 14.87, 3.4, 1.4]} rotation={[0, side * -Math.PI / 2, 0]}>
            <mesh><boxGeometry args={[7.2, 2.7, 0.08]} /><meshStandardMaterial color="#d4dedc" metalness={0.35} roughness={0.3} /></mesh>
            <mesh position={[0, 0, 0.05]}><planeGeometry args={[6.95, 2.45]} /><meshBasicMaterial color="#829ca5" /></mesh>
            {[-2.35, 0, 2.35].map((x) => <mesh key={x} position={[x, 0, 0.075]}><boxGeometry args={[0.055, 2.5, 0.06]} /><meshStandardMaterial color="#d4dedc" roughness={0.35} /></mesh>)}
            <mesh position={[0, -1.42, 0.13]}><boxGeometry args={[7.5, 0.12, 0.4]} /><meshStandardMaterial color="#c0ccc5" roughness={0.5} /></mesh>
          </group>
        </group>
      ))}
      <mesh position={[0, 2.675, 14.92]} receiveShadow><boxGeometry args={[30, 9.65, 0.14]} /><meshStandardMaterial color="#83949e" roughness={0.92} /></mesh>
      <mesh position={[0, 7.55, 3.85]}><boxGeometry args={[30, 0.12, 22]} /><meshStandardMaterial color="#303b45" roughness={0.95} /></mesh>
      {[-3.8, 0, 4.2].map((x) => (
        <group key={x} position={[x, 4.6, 0]}>
          <mesh><boxGeometry args={[2.2, 0.12, 0.5]} /><meshStandardMaterial color="#33443e" roughness={0.4} metalness={0.25} /></mesh>
          <mesh position={[0, -0.065, 0]} rotation={[Math.PI / 2, 0, 0]}><planeGeometry args={[2.05, 0.38]} /><meshBasicMaterial color="#fff7e5" /></mesh>
          {[-0.85, 0.85].map((offset) => <mesh key={offset} position={[offset, 1.42, 0]}><cylinderGeometry args={[0.012, 0.012, 2.75, 8]} /><meshStandardMaterial color="#3b4b45" metalness={0.6} roughness={0.35} /></mesh>)}
        </group>
      ))}
      <mesh position={[0, -1.98, -7.12]}><boxGeometry args={[30, 0.3, 0.07]} /><meshStandardMaterial color="#35483e" roughness={0.7} /></mesh>
      <group position={[10.4, -0.1, -6.85]}>
        <mesh><boxGeometry args={[4.8, 4.1, 0.5]} /><meshStandardMaterial color="#53665d" roughness={0.6} /></mesh>
        {[-1.17, 1.17].map((x) => <group key={x} position={[x, 0, 0.29]}>
          <mesh><boxGeometry args={[2.25, 3.9, 0.08]} /><meshStandardMaterial color="#687b72" roughness={0.6} /></mesh>
          <mesh position={[-Math.sign(x) * 0.8, 0, 0.07]}><boxGeometry args={[0.035, 0.55, 0.06]} /><meshStandardMaterial color="#bdc9c1" metalness={0.75} roughness={0.3} /></mesh>
        </group>)}
      </group>
    </group>
  );
}

export function FoodTestsWorkbench() {
  return (
    <group name="Food tests workbench">
      <mesh position={[0, -0.07, 0]} receiveShadow castShadow><boxGeometry args={[16, 0.14, 8]} /><meshStandardMaterial color="#425159" roughness={0.5} metalness={0.03} /></mesh>
      <mesh position={[0, -0.16, 0]}><boxGeometry args={[16.08, 0.07, 8.08]} /><meshStandardMaterial color="#425b68" roughness={0.45} /></mesh>
      {[-5.3, 5.3].map((x) => (
        <group key={x} position={[x, -1.18, 0]}>
          <mesh castShadow receiveShadow><boxGeometry args={[4.7, 1.85, 5.8]} /><meshStandardMaterial color="#3d5360" roughness={0.72} /></mesh>
          {[-1.5, 0, 1.5].map((offset) => <group key={offset} position={[offset, 0, 2.93]}>
            <mesh><boxGeometry args={[1.4, 1.7, 0.06]} /><meshStandardMaterial color="#536b77" roughness={0.65} /></mesh>
            <mesh position={[0, 0.5, 0.05]}><boxGeometry args={[0.46, 0.035, 0.06]} /><meshStandardMaterial color="#c1ccc3" metalness={0.65} roughness={0.3} /></mesh>
          </group>)}
          <mesh position={[0, -0.95, 0]}><boxGeometry args={[4.4, 0.1, 5.5]} /><meshStandardMaterial color="#273c31" roughness={0.85} /></mesh>
        </group>
      ))}
      <mesh position={[0, -0.6, 0]} castShadow><boxGeometry args={[15, 0.1, 0.14]} /><meshStandardMaterial color="#53675a" metalness={0.4} roughness={0.5} /></mesh>
    </group>
  );
}
