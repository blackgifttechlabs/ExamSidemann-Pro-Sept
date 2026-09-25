"use client";

import React, { Suspense, useEffect, useMemo, type ReactNode } from 'react';
import { useLabAsset as useGLTF } from './LabAssets';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import type { PlayerBounds } from './PlayerController';

RectAreaLightUniformsLib.init();
const LAB_URL = '/models/science-lab/science-lab.glb?v=lab-20260924-compressed3';
const SOURCE_BENCH_TOP = 0.9575;
export type LabLayout = {
  width?: number; depth?: number; height?: number; floorY?: number; centerZ?: number;
  worktopY?: number;
  clearRearFixtures?: boolean;
  wallColor?: string;
};
const DEFAULT_LAYOUT = {
  width: 32,
  depth: 24,
  height: 12.5,
  floorY: 0,
  centerZ: 0,
  worktopY: 1.36,
  clearRearFixtures: false,
  wallColor: "#d3dbd4",
};

/** Scenery colliders use the same conversion as the Blender room; experiment benches stay caller-owned. */
export function blenderLabObstacles(layout: LabLayout = {}): PlayerBounds[] {
  const { width, depth, centerZ } = { ...DEFAULT_LAYOUT, ...layout };
  const sx = width / 12, sz = depth / 10;
  return [
    [-5.55, 3.3, -4.96, -3.72], // preparation cupboards / sinks
    [3.78, 5.64, -4.98, -3.5], // fume cupboard
    [4.34, 5.46, -1.2, -0.5], // trolley
    [4.65, 5.9, 2.43, 2.97], // waste containers
  ].map(([minX, maxX, minZ, maxZ]) => ({ minX: minX * sx, maxX: maxX * sx, minZ: centerZ + minZ * sz, maxZ: centerZ + maxZ * sz }));
}

class AssetBoundary extends React.Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

/** Bake static Blender meshes by material: hundreds of decorative pieces become a few dozen draw calls. */
function batchMeshes(source: THREE.Object3D, select: (mesh: THREE.Mesh) => boolean, transform: (mesh: THREE.Mesh) => THREE.Matrix4) {
  source.updateMatrixWorld(true);
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  source.traverse(object => {
    if (!(object instanceof THREE.Mesh) || !select(object)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    const original = object.geometry.index ? object.geometry.toNonIndexed() : object.geometry.clone();
    original.applyMatrix4(transform(object));
    if (!original.attributes.normal) original.computeVertexNormals();
    if (!original.attributes.uv) original.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(original.attributes.position.count * 2), 2));
    for (const name of Object.keys(original.attributes)) if (!['position', 'normal', 'uv'].includes(name)) original.deleteAttribute(name);
    const groups = materials.length > 1 ? original.groups : [{ start: 0, count: original.attributes.position.count, materialIndex: 0 }];
    for (const group of groups) {
      const geometry = new THREE.BufferGeometry();
      for (const name of ['position', 'normal', 'uv']) {
        const attr = original.getAttribute(name);
        geometry.setAttribute(name, new THREE.Float32BufferAttribute(attr.array.slice(group.start * attr.itemSize, (group.start + group.count) * attr.itemSize), attr.itemSize));
      }
      const material = materials[group.materialIndex ?? 0];
      const list = batches.get(material) ?? []; list.push(geometry); batches.set(material, list);
    }
    original.dispose();
  });
  const result = new THREE.Group();
  for (const [material, geometries] of batches) {
    const merged = mergeGeometries(geometries, false);
    geometries.forEach(g => g.dispose());
    if (!merged) continue;
    merged.computeBoundingSphere();
    // Background glass does not need a full-screen refraction pass on every simulation frame.
    let displayMaterial = material;
    if (material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0) {
      const glass = material.clone();
      glass.transmission = 0;
      glass.transparent = true;
      glass.opacity = material.name.includes('Amber') ? 0.65 : 0.3;
      glass.depthWrite = false;
      glass.roughness = Math.max(0.14, glass.roughness);
      glass.userData.blenderLabOwned = true;
      displayMaterial = glass;
    }
    const mesh = new THREE.Mesh(merged, displayMaterial);
    mesh.castShadow = !(material instanceof THREE.MeshPhysicalMaterial && material.transmission > 0);
    mesh.receiveShadow = true;
    result.add(mesh);
  }
  return result;
}

function disposeBatches(group: THREE.Group) {
  group.traverse(o => {
    if (!(o instanceof THREE.Mesh)) return;
    o.geometry.dispose();
    const materials = Array.isArray(o.material) ? o.material : [o.material];
    materials.forEach(material => { if (material.userData.blenderLabOwned) material.dispose(); });
  });
}

function ReflectionLighting() {
  const { gl, scene, invalidate } = useThree();
  useEffect(() => {
    const previous = scene.environment;
    const previousTransmissionResolution = gl.transmissionResolutionScale;
    gl.transmissionResolutionScale = 0.5;
    const previousIntensity = scene.environmentIntensity;
    scene.environmentIntensity = 0.3;
    if (previous) return () => { scene.environmentIntensity = previousIntensity; gl.transmissionResolutionScale = previousTransmissionResolution; };
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, 0.04);
    room.dispose(); generator.dispose();
    scene.environment = environment.texture;
    invalidate();
    return () => { gl.transmissionResolutionScale = previousTransmissionResolution; scene.environmentIntensity = previousIntensity; if (scene.environment === environment.texture) scene.environment = previous; environment.dispose(); };
  }, [gl, scene, invalidate]);
  return null;
}

function LabCeiling({ width, depth, height }: { width: number; depth: number; height: number }) {
  const { scene } = useGLTF('/models/science-lab/props/ceiling.glb?v=lab-20260924-compressed3');
  const model = useMemo(() => batchMeshes(scene, () => true, mesh => mesh.matrixWorld), [scene]);
  useEffect(() => () => disposeBatches(model), [model]);
  return <primitive object={model} position={[0, height, 0]} scale={[width / 12, 1, depth / 10]} />;
}

function LoadedRoom({ width, depth, height, floorY, centerZ, worktopY, clearRearFixtures, wallColor }: Required<LabLayout>) {
  const { scene } = useGLTF(LAB_URL);
  const model = useMemo(() => batchMeshes(scene, mesh => {
    let node: THREE.Object3D | null = mesh;
    while (node) {
      // Reserve the complete central teaching area for live experiment apparatus.
      if (/^Workstation/.test(node.name)) return false;
      if (
        clearRearFixtures &&
        /(Upper cabinet|Glazed cabinet|Stored reagent|Periodic table|Fume cupboard|Fume hood|First aid cabinet|Right rear display wall|Prep wash bottle)/i.test(node.name)
      ) return false;
      node = node.parent;
    }
    return !/^(Display_board|Lab_practice|Electrical_outlet|Outlet_slot|Gas_service|Gas_tap)/.test(mesh.name);
  }, mesh => {
    const architectural = /^(Floor|Tiled_floor|Rear_wall|Window|Roller_blind|Partially_lowered|Blind|Back_skirting|Right_rear|Suspended_LED|LED_diffuser|Luminaire)/.test(mesh.name);
    const sy = architectural ? height / 3.7 : (worktopY - floorY) / SOURCE_BENCH_TOP;
    return new THREE.Matrix4().makeScale(width / 12, sy, depth / 10).multiply(mesh.matrixWorld);
  }), [scene, width, depth, height, worktopY, floorY, clearRearFixtures]);
  useEffect(() => () => disposeBatches(model), [model]);
  return <group position={[0, floorY, centerZ]} name="Blender science laboratory">
    <primitive object={model} dispose={null} />
    {/* The source is a presentation cutaway; these surfaces enclose the walkable lesson room. */}
    <mesh position={[0, height / 2, depth / 2 + 0.06]} receiveShadow><boxGeometry args={[width, height, 0.12]} /><meshStandardMaterial color={wallColor} roughness={0.85} /></mesh>
    <mesh position={[width / 2 + 0.08, height / 2, 0]} receiveShadow><boxGeometry args={[0.12, height, depth]} /><meshStandardMaterial color={wallColor} roughness={0.85} /></mesh>
    {clearRearFixtures && (
      <mesh position={[0, height / 2, -depth / 2 + 0.08]} receiveShadow>
        <boxGeometry args={[width, height, 0.12]} />
        <meshStandardMaterial color={wallColor} roughness={0.88} />
      </mesh>
    )}
    <LabCeiling width={width} depth={depth} height={height} />

  </group>;
}

export function BlenderLabEnvironment(layout: LabLayout) {
  const config = { ...DEFAULT_LAYOUT, ...layout };
  const fallback = <mesh position={[0, config.floorY - 0.06, config.centerZ]} receiveShadow><boxGeometry args={[config.width, 0.12, config.depth]} /><meshStandardMaterial color="#a7b1ab" /></mesh>;
  const { width, depth, height, floorY, centerZ } = config;
  return <>
    <group position={[0, floorY, centerZ]}>
    {/* Light sources sit below the ceiling; exterior sunlight alone leaves an enclosed room dark. */}
    <hemisphereLight args={["#fffaf2", "#737f83", 0.26]} />
    {[-1, 1].flatMap(x => [-1, 1].map(z => <rectAreaLight key={`${x}-${z}`} color="#fff8ee" intensity={3.5} width={width * .1} height={depth * .065} position={[x * width / 4, height - .15, z * depth / 4]} rotation={[-Math.PI / 2, 0, 0]} />))}
    <ReflectionLighting />
    </group>
    <AssetBoundary fallback={fallback}><Suspense fallback={fallback}><LoadedRoom {...config} /></Suspense></AssetBoundary>
  </>;

}

type BenchProps = { position?: [number, number, number]; size: [number, number]; height: number; topColor?: string };
function LoadedBench({ position = [0, 0, 0], size, height, topColor }: BenchProps) {
  const { scene } = useGLTF(LAB_URL);
  const bench = useMemo(() => { const model = batchMeshes(scene,
    mesh => /^Workstation_01_(resin_worktop|plywood_substrate|steel_leg|adjustable_foot|long_apron|drawer_cabinet|drawer_front|pull)/.test(mesh.name),
    mesh => new THREE.Matrix4().makeTranslation(2.75, 0, -2.4).multiply(mesh.matrixWorld));
    if (topColor) model.traverse(o => {
      if (!(o instanceof THREE.Mesh) || Array.isArray(o.material) || !/Charcoal[ _]phenolic/.test(o.material.name)) return;
      const material = (o.material as THREE.MeshStandardMaterial).clone();
      material.color.set(topColor).lerp(new THREE.Color('#687d80'), .55);
      material.roughness = .55; material.userData.blenderLabOwned = true; o.material = material;
    });
    return model;
  }, [scene, topColor]);
  useEffect(() => () => disposeBatches(bench), [bench]);
  return <group position={position} scale={[size[0] / 2.9, height / SOURCE_BENCH_TOP, size[1] / 1.35]} name="Blender experiment workbench"><primitive object={bench} dispose={null} /></group>;
}

/** The origin and exact worktop height remain those expected by the experiment's physics. */
export function BlenderLabBench(props: BenchProps) {
  const { position = [0, 0, 0], size, height } = props;
  const fallback = <group position={position}><mesh position={[0, height - 0.04, 0]} receiveShadow><boxGeometry args={[size[0], 0.08, size[1]]} /><meshStandardMaterial color="#41524f" /></mesh></group>;
  return <AssetBoundary fallback={fallback}><Suspense fallback={fallback}><LoadedBench {...props} /></Suspense></AssetBoundary>;
}
