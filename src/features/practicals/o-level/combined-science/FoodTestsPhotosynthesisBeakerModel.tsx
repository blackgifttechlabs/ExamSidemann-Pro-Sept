import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
function LoadedBeaker({ radius, height }: { radius: number; height: number }) {
  const { scene } = useGLTF("/models/science-lab/props/photosynthesis-beaker.glb");
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((node) => { if (node instanceof THREE.Mesh) { node.castShadow = true; node.receiveShadow = true; } });
    return copy;
  }, [scene]);
  return <primitive object={model} dispose={null} position={[-radius * .105, -height * .065 / 8.4, 0]}
    rotation={[0, Math.PI, 0]} scale={[radius / 3.28, height / 8.4, radius / 3.28]} />;
}
export function PhotosynthesisBeakerModel(props: { radius: number; height: number }) {
  return <Suspense fallback={null}><LoadedBeaker {...props} /></Suspense>;
}
