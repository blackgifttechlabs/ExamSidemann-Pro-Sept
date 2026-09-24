import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = { asset: string; position?: [number, number, number]; scale?: number | [number, number, number]; color?: string };
function LoadedProp({ asset, color, ...props }: Props) {
  const { scene } = useGLTF(`/models/science-lab/props/${asset}.glb?v=lab-20260924-2`);
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse(node => {
      if (!(node instanceof THREE.Mesh)) return;
      node.castShadow = !/water|steam|flame|bubble|beaker|test-tube|heat-shield/.test(asset);
      node.receiveShadow = true;
      const originals = Array.isArray(node.material) ? node.material : [node.material];
      const materials = originals.map(source => {
        const m = source.clone() as THREE.MeshPhysicalMaterial;
        if (color) m.color.set(color);
        if (m.transmission > 0) { m.transmission = 0; m.transparent = true; m.opacity = asset.startsWith('water') ? .32 : .23; m.depthWrite = false; }
        if (asset === 'steam-puff') { m.transparent = true; m.opacity = .065; m.depthWrite = false; }
        return m;
      });
      node.material = Array.isArray(node.material) ? materials : materials[0];
    });
    return copy;
  }, [scene, color, asset]);
  useEffect(() => () => model.traverse(node => {
    if (node instanceof THREE.Mesh) (Array.isArray(node.material) ? node.material : [node.material]).forEach(m => m.dispose());
  }), [model]);
  return <primitive object={model} {...props} dispose={null} />;
}
export function BlenderLabProp(props: Props) { return <Suspense fallback={null}><LoadedProp {...props} /></Suspense>; }

/** Heat is normalised to 0–1 by the experiment; an unlit burner has no flame. */
export function BlenderBurner({ lit, heat, paused = false }: { lit: boolean; heat: number; paused?: boolean }) {
  const flame = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!flame.current || paused) return;
    const t = clock.elapsedTime;
    flame.current.scale.set(1 + Math.sin(t * 19) * .045, .7 + Math.max(0, Math.min(1, heat)) * .6 + Math.sin(t * 27) * .035, 1);
  });
  return <group><BlenderLabProp asset="bunsen-burner" scale={[7.5, 2.8, 7.5]} />{lit && <group position={[0, .4284, 0]} ref={flame}><BlenderLabProp asset="burner-flame" scale={[7, 4, 7]} /></group>}</group>;
}

/** Rising, expanding mist represents condensed droplets above the hot liquid. */
export function BlenderSteam({ active, heat, position, paused = false }: { active: boolean; heat: number; position: [number, number, number]; paused?: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || !active || paused) return;
    group.current.children.forEach((p, i) => {
      const age = (i / 10 + clock.elapsedTime * (.18 + .16 * heat)) % 1;
      p.position.set(Math.sin(i * 2.4 + age * 2) * (.06 + age * .25), age * 1.8, Math.cos(i * 2.4) * (.06 + age * .2));
      p.scale.setScalar(.09 + age * .22);
      p.traverse(o => { if (o instanceof THREE.Mesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.opacity = .075 * Math.sin(Math.PI * age); }); });
    });
  });
  return <group ref={group} position={position} visible={active}>{Array.from({ length: 10 }, (_, i) => <group key={i}><BlenderLabProp asset="steam-puff" /></group>)}</group>;
}
