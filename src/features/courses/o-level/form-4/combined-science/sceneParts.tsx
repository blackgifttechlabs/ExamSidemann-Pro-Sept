import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function Environment() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env; invalidate();
    return () => { scene.environment = null; env.dispose(); pmrem.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}

export function Stone() {
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(0.4, 3);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = Math.sin(v.x * 7.1 + v.y * 3.3) * Math.cos(v.z * 6.2 - v.x * 2.1) * 0.07 + Math.sin(v.y * 11 + v.z * 5) * 0.03;
      v.multiplyScalar(1 + n);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);
  return <mesh geometry={geometry} scale={[1.1, 0.75, 0.9]} rotation={[0.2, 0.7, 0.1]} position={[0, 0.3, 0]} castShadow>
    <meshStandardMaterial color="#76797d" roughness={0.95} metalness={0.05} flatShading />
  </mesh>;
}

