import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OXYGEN_BENCH_Y } from "./OxygenLabRoom";
import { OXYGEN_APPARATUS as DIM, advanceOxygenBubble, gasWaterEquilibrium } from "./oxygenPhysics";

const GLASS = { color: "#edf8f8", transparent: true, opacity: 0.32, transmission: 0.86,
  roughness: 0.025, thickness: 0.009, ior: 1.47, depthWrite: false, side: THREE.DoubleSide };

function WaterColumn({ height }: { height: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shown = useRef(height);
  const geometry = useMemo(() => {
    const profile = [new THREE.Vector2(0, 0), new THREE.Vector2(DIM.tubeRadius, 0)];
    for (let i = 1; i <= 16; i++) profile.push(new THREE.Vector2(DIM.tubeRadius, i / 16));
    profile.push(new THREE.Vector2(0, 1));
    return new THREE.LatheGeometry(profile, 48);
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, delta) => {
    shown.current = THREE.MathUtils.damp(shown.current, height, 8, delta);
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const ring = i % 19;
      const angle = Math.floor(i / 19) / 48 * Math.PI * 2;
      const y = ring === 0 || ring === 1 ? 0 : ring === 18 ? shown.current : (ring - 1) / 16 * shown.current;
      const domeY = Math.max(0, y - DIM.tubeStraightLength);
      const radius = ring === 0 || ring === 18 ? 0 : Math.sqrt(Math.max(0, DIM.tubeRadius ** 2 - domeY ** 2));
      vertices.setXYZ(i, Math.sin(angle) * radius, y, Math.cos(angle) * radius);
    }
    vertices.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  });
  return <mesh ref={meshRef} geometry={geometry} renderOrder={8}>
    <meshPhysicalMaterial color="#d8ecef" transparent opacity={1} transmission={0.6}
      roughness={0.03} ior={1.33} depthWrite={false} side={THREE.DoubleSide} />
  </mesh>;
}

function Meniscus({ radius, height, ripple = 0 }: { radius: number; height: number; ripple?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const shownHeight = useRef(height);
  const geometry = useMemo(() => new THREE.RingGeometry(0, radius, 48, 8).rotateX(-Math.PI / 2), [radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state, delta) => {
    shownHeight.current = THREE.MathUtils.damp(shownHeight.current, height, 8, delta);
    if (meshRef.current) meshRef.current.position.y = shownHeight.current;
    const vertices = geometry.attributes.position;
    const age = state.clock.elapsedTime - ripple;
    for (let i = 0; i < vertices.count; i++) {
      const distance = Math.hypot(vertices.getX(i), vertices.getZ(i));
      const rim = 0.003 * (distance / radius) ** 6;
      const wave = ripple > 0 && age < 1.3 ? 0.0018 * Math.sin(distance / radius * 13 - age * 12) * Math.exp(-age * 3) : 0;
      vertices.setY(i, rim + wave);
    }
    vertices.needsUpdate = true;
    geometry.computeVertexNormals();
  });
  return <mesh ref={meshRef} geometry={geometry} position={[0, height, 0]} renderOrder={9}>
    <meshPhysicalMaterial color="#e4f3f4" transparent opacity={1} transmission={0.68}
      roughness={0.025} ior={1.33} side={THREE.DoubleSide} depthWrite={false} />
  </mesh>;
}

type Bubble = { active: boolean; y: number; velocity: number; radius: number; seed: number };
function OxygenBubbles({ rate, interfaceHeight, tubeLifted, onArrival }: {
  rate: number; interfaceHeight: number; tubeLifted: boolean; onArrival: (time: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const bubbles = useMemo<Bubble[]>(() => Array.from({ length: 20 }, (_, i) => ({
    active: false, y: DIM.stemTip, velocity: 0, radius: 0.007 + (i % 5) * 0.0012, seed: i * 2.399,
  })), []);
  const emission = useRef(0);
  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const dt = Math.min(delta, 0.08);
    // Sample the time-lapse with representative bubbles rather than rendering every gas molecule.
    if (rate > 0) emission.current += dt * rate / 60 * 6;
    else emission.current = 0;
    while (emission.current >= 1) {
      emission.current -= 1;
      const next = bubbles.find(bubble => !bubble.active);
      if (!next) break;
      next.active = true; next.y = DIM.stemTip; next.velocity = 0;
    }
    bubbles.forEach((bubble, index) => {
      const mesh = group.children[index] as THREE.Mesh;
      if (!bubble.active) { mesh.visible = false; return; }
      const step = advanceOxygenBubble(bubble.y, bubble.velocity, bubble.radius, dt);
      bubble.y = step.y; bubble.velocity = step.velocity;
      const destination = tubeLifted ? DIM.reservoirLevel : interfaceHeight;
      if (bubble.y >= destination) {
        bubble.active = false; mesh.visible = false; onArrival(state.clock.elapsedTime); return;
      }
      mesh.visible = true;
      // The funnel guides bubbles into its narrow neck before they enter the tube.
      const channelRadius = bubble.y < 0.38 ? 0.018 * (0.38 - bubble.y) / 0.09 : 0.006;
      mesh.position.set(Math.sin(bubble.seed + bubble.y * 17) * channelRadius, bubble.y,
        Math.cos(bubble.seed + bubble.y * 13) * channelRadius);
      const depth = Math.max(0, DIM.reservoirLevel - bubble.y);
      const expansion = Math.cbrt(101325 / (101325 + 998 * 9.81 * depth));
      mesh.scale.setScalar(bubble.radius * expansion);
      mesh.scale.y *= 0.88 + bubble.velocity * 0.35;
    });
  });
  return <group ref={groupRef}>{bubbles.map((_, index) => <mesh key={index} visible={false}>
    <sphereGeometry args={[1, 16, 12]} />
    <meshPhysicalMaterial color="#f1fdff" transparent opacity={1} transmission={0.75}
      roughness={0.02} ior={1.0} depthWrite={false} />
  </mesh>)}</group>;
}

export function OxygenApparatus({ setup, collected, lampOn, tubeLifted }: {
  setup: "light" | "dark"; collected: number; lampOn: boolean; tubeLifted: boolean;
}) {
  const tubeRef = useRef<THREE.Group>(null);
  const weedRef = useRef<THREE.Group>(null);
  const shownAmount = useRef(collected);
  const equilibrium = gasWaterEquilibrium(collected);
  const ripple = useRef(0);
  const beakerWaterRef = useRef<THREE.Mesh>(null);
  const tubeProfile = useMemo(() => {
    const r = DIM.tubeRadius;
    const outer = r + 0.007;
    const length = DIM.tubeStraightLength;
    const points = [new THREE.Vector2(outer, 0), new THREE.Vector2(outer, length)];
    for (let i = 1; i <= 16; i++) {
      const angle = i / 16 * Math.PI / 2;
      points.push(new THREE.Vector2(outer * Math.cos(angle), length + outer * Math.sin(angle)));
    }
    for (let i = 16; i >= 0; i--) {
      const angle = i / 16 * Math.PI / 2;
      points.push(new THREE.Vector2(r * Math.cos(angle), length + r * Math.sin(angle)));
    }
    points.push(new THREE.Vector2(r, 0), new THREE.Vector2(outer, 0));
    return points;
  }, []);
  const beakerProfile = useMemo(() => [
    new THREE.Vector2(0, 0), new THREE.Vector2(0.37, 0), new THREE.Vector2(0.412, 0.025),
    new THREE.Vector2(0.425, 0.065), new THREE.Vector2(0.425, 0.73), new THREE.Vector2(0.435, 0.77),
    new THREE.Vector2(0.435, 0.79), new THREE.Vector2(0.412, 0.79), new THREE.Vector2(0.405, 0.74),
    new THREE.Vector2(0.405, 0.07), new THREE.Vector2(0.385, 0.033), new THREE.Vector2(0, 0.027),
  ], []);
  const beakerGeometry = useMemo(() => {
    const geometry = new THREE.LatheGeometry(beakerProfile, 96);
    const vertices = geometry.attributes.position;
    // Pull a small section of the rolled lip into a pouring spout.
    for (let i = 0; i < vertices.count; i++) {
      const y = vertices.getY(i);
      const angle = Math.atan2(vertices.getX(i), vertices.getZ(i));
      const flare = Math.exp(-(((angle + Math.PI / 2) / 0.19) ** 2)) * Math.max(0, (y - 0.71) / 0.08);
      vertices.setX(i, vertices.getX(i) - flare * 0.055);
      vertices.setY(i, y - flare * 0.012);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [beakerProfile]);
  useEffect(() => () => beakerGeometry.dispose(), [beakerGeometry]);
  const funnelProfile = useMemo(() => [
    new THREE.Vector2(0.263, 0.07), new THREE.Vector2(0.26, 0.09), new THREE.Vector2(0.036, 0.38),
    new THREE.Vector2(0.036, 0.65), new THREE.Vector2(0.027, 0.65), new THREE.Vector2(0.027, 0.38),
    new THREE.Vector2(0.251, 0.083), new THREE.Vector2(0.263, 0.07),
  ], []);
  useFrame((state, delta) => {
    shownAmount.current = THREE.MathUtils.damp(shownAmount.current, collected, 8, delta);
    if (tubeRef.current) tubeRef.current.position.y = THREE.MathUtils.damp(tubeRef.current.position.y,
      tubeLifted ? 0.86 : DIM.tubeMouth, 3.5, delta);
    if (weedRef.current) weedRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.015;
    if (beakerWaterRef.current) {
      const level = gasWaterEquilibrium(shownAmount.current).reservoirLevel;
      beakerWaterRef.current.scale.y = level - 0.028;
      beakerWaterRef.current.position.y = (level + 0.028) / 2;
    }
  });
  return <group position={[-0.55, OXYGEN_BENCH_Y, 0.05]} name="Photosynthesis oxygen collector">
    <mesh renderOrder={20} geometry={beakerGeometry}><meshPhysicalMaterial {...GLASS} /></mesh>
    <mesh position={[0, 0.79, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={22}>
      <torusGeometry args={[0.425, 0.008, 10, 96]} /><meshPhysicalMaterial {...GLASS} opacity={0.5} />
    </mesh>
    {[0.16, 0.27, 0.38, 0.49, 0.6].map((y, index) => <mesh key={y} position={[0.291, y, 0.305]} rotation={[0, Math.PI / 4, 0]}>
      <boxGeometry args={[index % 2 ? 0.045 : 0.08, 0.004, 0.002]} /><meshBasicMaterial color="#63766f" />
    </mesh>)}
    <mesh ref={beakerWaterRef} position={[0, 0.345, 0]} scale={[1, 0.63, 1]} renderOrder={5}>
      <cylinderGeometry args={[DIM.beakerRadius, DIM.beakerRadius, 1, 64]} />
      <meshPhysicalMaterial color="#d8ecef" transparent opacity={1} transmission={0.66} ior={1.33} roughness={0.035} depthWrite={false} />
    </mesh>
    <Meniscus radius={DIM.beakerRadius} height={equilibrium.reservoirLevel} ripple={ripple.current} />
    <group ref={weedRef} position={[0, 0.045, 0]}>
      <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.006, 0.009, 0.245, 12]} /><meshStandardMaterial color="#407243" roughness={0.85} /></mesh>
      {Array.from({ length: 6 }, (_, index) => <group key={index} position={[0, 0.025 + index * 0.035, 0]} rotation={[0, index * 1.15, 0]}>
        {[0, 1, 2].map(leaf => <group key={leaf} rotation={[0, leaf * Math.PI * 2 / 3, 0]}>
          <mesh position={[0.043, 0.007, 0]} rotation={[0, 0, 0.25]} scale={[0.051, 0.0025, 0.012]}>
            <sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color={index % 2 ? "#568d49" : "#356838"} roughness={0.7} />
          </mesh>
          <mesh position={[0.044, 0.01, 0]} rotation={[0, 0, Math.PI / 2 + 0.25]}>
            <cylinderGeometry args={[0.0006, 0.0008, 0.082, 6]} /><meshStandardMaterial color="#80a35a" roughness={0.8} />
          </mesh>
        </group>)}
      </group>)}
      <mesh position={[0, 0.246, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.006, 12]} /><meshStandardMaterial color="#b4ce8b" /></mesh>
    </group>
    <mesh renderOrder={18}><latheGeometry args={[funnelProfile, 64]} /><meshPhysicalMaterial {...GLASS} opacity={0.25} /></mesh>
    {[0, 2.1, 4.2].map(angle => <mesh key={angle} position={[Math.cos(angle) * 0.22, 0.045, Math.sin(angle) * 0.22]}>
      <cylinderGeometry args={[0.01, 0.012, 0.07, 12]} /><meshPhysicalMaterial {...GLASS} />
    </mesh>)}
    <group ref={tubeRef} position={[0, DIM.tubeMouth, 0]} name="Collected oxygen tube">
      <mesh renderOrder={24}><latheGeometry args={[tubeProfile, 64]} /><meshPhysicalMaterial {...GLASS} opacity={0.4} /></mesh>
      <WaterColumn height={equilibrium.waterHeight} />
      <Meniscus radius={DIM.tubeRadius} height={equilibrium.waterHeight} ripple={ripple.current} />
      {[0.1, 0.2, 0.3, 0.4, 0.5].map(y => <mesh key={y} position={[0.04, y, 0.051]} rotation={[0, 0.6, 0]}>
        <boxGeometry args={[0.026, 0.002, 0.001]} /><meshBasicMaterial color="#64776e" />
      </mesh>)}
    </group>
    <OxygenBubbles rate={lampOn && setup === "light" ? 46 : 0}
      interfaceHeight={DIM.tubeMouth + equilibrium.waterHeight} tubeLifted={tubeLifted}
      onArrival={time => { ripple.current = time; }} />
    <group position={[0.3, 0, -0.17]}>
      <mesh position={[0, 0.025, 0]} castShadow><boxGeometry args={[0.28, 0.05, 0.26]} /><meshStandardMaterial color="#54665f" metalness={0.65} roughness={0.35} /></mesh>
      <mesh position={[0, 0.69, 0]} castShadow><cylinderGeometry args={[0.012, 0.012, 1.35, 16]} /><meshStandardMaterial color="#a9b9ae" metalness={0.82} roughness={0.24} /></mesh>
      <mesh position={[-0.15, 0.92, 0.085]} rotation={[0, 0.51, Math.PI / 2]}><cylinderGeometry args={[0.009, 0.009, 0.34, 12]} /><meshStandardMaterial color="#a9b9ae" metalness={0.82} roughness={0.24} /></mesh>
    </group>
    <group position={[0, 0.92, 0]} name="Rubber-lined tube clamp">
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.072, 0.009, 12, 48, Math.PI * 1.65]} />
        <meshStandardMaterial color="#a9b9ae" metalness={0.85} roughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.004, 8, 48, Math.PI * 1.65]} />
        <meshStandardMaterial color="#343b3a" roughness={0.9} />
      </mesh>
      <mesh position={[0.095, 0, 0.025]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.055, 16]} />
        <meshStandardMaterial color="#3d4845" roughness={0.6} />
      </mesh>
    </group>
    {setup === "dark" && <group name="Opaque dark-control cover">
      <mesh position={[0, 0.61, 0]}><cylinderGeometry args={[0.49, 0.51, 1.22, 64, 1, true]} /><meshStandardMaterial color="#222a28" roughness={0.98} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 1.22, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.49, 64]} /><meshStandardMaterial color="#222a28" roughness={0.98} side={THREE.DoubleSide} /></mesh>
    </group>}
  </group>;
}
