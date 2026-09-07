"use client";

import type { CSSProperties, MutableRefObject } from "react";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { HeaderModeToggle } from "../../common/CombinedScienceGame";
import { useExperimentNarrator } from "../../../../lib/audio/experimentNarrator";
import {
  ExperimentNarrationDock,
  WalkthroughStatusPill,
  useNarratedWalkthrough,
  type NarrationClip,
  type WalkthroughStep,
} from "../../common/ExperimentNarration";
import {
  NarrationCaptionBar,
  NarrationMeasureOverlay,
  NarrationPointerHand,
  type SceneAnchorPoints,
} from "../../common/ExperimentNarrationCaptions";
import { NarrationSceneAnchors } from "../../common/NarrationSceneAnchors";
import {
  cueTimeMs,
  trackDurationMs,
  useNarrationCueRunner,
  useNarrationPlayback,
} from "../../../../lib/audio/narrationCaptions";
import { PENDULUM_NARRATION_TRACKS } from "../../../../lib/audio/narration/simplePendulum";
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import { VirtualJoystick } from "../../common/VirtualJoystick";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Physics constants & helpers
// ---------------------------------------------------------------------------

const WORLD_SCALE = 2.75; // world units per real metre
const PIVOT_Y = 2.45; // world-space y of the knife-edge pivot
const BENCH_TOP_Y = -2.04;
const SUBSTEPS = 10;
const MIN_MASS_KG = 0.02;
const MAX_OMEGA = 18; // numerical guard; normal laboratory motion is far below this
const MAX_DRAG_ANGLE = THREE.MathUtils.degToRad(72);
const SETTLED_ANGLE_RAD = THREE.MathUtils.degToRad(0.12);
const SETTLED_OMEGA = 0.012;
const AUDIBLE_OMEGA = 0.045;
const COUNT_MIN_OMEGA = 0.08;
const COUNT_MIN_ANGLE_DEG = 1.2;

// Doing Mode: free-roam world bounds around the physics lab bench. The bench
// itself is a solid obstacle so the player must walk around it, not through it.
const PLAYER_BOUNDS: PlayerBounds = { minX: -13, maxX: 13, minZ: -3.6, maxZ: 9 };
const BENCH_OBSTACLES: PlayerBounds[] = [{ minX: -6.5, maxX: 6.5, minZ: -2.2, maxZ: 2.2 }];
const PLAYER_SPAWN = new THREE.Vector3(0, 0, 6);
const INTERACTION_RADIUS = 4.2;
const DOING_RELEASE_ANGLE_DEG = 30;

const BOB_STATION_POS = new THREE.Vector3(0, 0.4, 0.6);
const GRAVITY_STATION_POS = new THREE.Vector3(-4.8, -0.6, 1.4);
const LENGTH_STATION_POS = new THREE.Vector3(-2.4, -0.6, 1.4);
const MASS_STATION_POS = new THREE.Vector3(2.4, -0.6, 1.4);
const DAMPING_STATION_POS = new THREE.Vector3(4.8, -0.6, 1.4);
const PLAY_RESET_STATION_POS = new THREE.Vector3(0, -0.6, 1.8);
const TIMER_STATION_POS = new THREE.Vector3(0, 0.2, -1.6);

interface PendulumParams {
  lengthM: number;
  massKg: number;
  gravity: number;
  damping: number; // rotational damping coefficient, c
}

function theoreticalPeriod(lengthM: number, gravity: number) {
  return 2 * Math.PI * Math.sqrt(lengthM / gravity);
}

/** Exact ideal-pendulum period at a finite release angle (complete elliptic integral via AGM). */
function finiteAmplitudePeriod(lengthM: number, gravity: number, amplitudeRad: number) {
  const boundedAmplitude = THREE.MathUtils.clamp(Math.abs(amplitudeRad), 0, Math.PI - 0.001);
  const k = Math.sin(boundedAmplitude / 2);
  let a = 1;
  let b = Math.sqrt(Math.max(1 - k * k, 1e-8));
  for (let i = 0; i < 12 && Math.abs(a - b) > 1e-10; i += 1) {
    const nextA = (a + b) / 2;
    b = Math.sqrt(a * b);
    a = nextA;
  }
  const completeEllipticK = Math.PI / (2 * a);
  return 4 * Math.sqrt(lengthM / gravity) * completeEllipticK;
}

function CylinderBetween({
  start,
  end,
  radius,
  color,
  metalness = 0.45,
  roughness = 0.3,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  radius: number;
  color: string;
  metalness?: number;
  roughness?: number;
}) {
  const direction = end.clone().sub(start);
  const length = direction.length();
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize()
  );
  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, length, 18]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  );
}

// A decorative fire-exit style door on the side wall — visible and walkable
// up to, but purely scenery: there's no "outside" behind it to actually leave to.
function ExitSignSurface() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#065f46";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#022c22";
    context.lineWidth = 6;
    context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    context.fillStyle = "#ffffff";
    context.font = "900 52px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("EXIT", canvas.width / 2, canvas.height / 2 + 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[0.62, 0.23]} />
      <meshBasicMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#065f46"} toneMapped={false} />
    </mesh>
  );
}

function LabExitDoor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.72, 2.85, 0.12]} />
        <meshStandardMaterial color="#2c3a38" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0.05]} castShadow>
        <boxGeometry args={[1.42, 2.62, 0.08]} />
        <meshStandardMaterial color="#536663" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.55, 0.095]}>
        <planeGeometry args={[0.55, 0.62]} />
        <meshPhysicalMaterial color="#8fc6d5" roughness={0.2} transmission={0.4} clearcoat={0.6} />
      </mesh>
      {[-0.16, 0, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.098]}>
          <boxGeometry args={[0.012, 0.62, 0.004]} />
          <meshBasicMaterial color="#2c3a38" />
        </mesh>
      ))}
      <mesh position={[0, -0.35, 0.1]} castShadow>
        <boxGeometry args={[0.92, 0.09, 0.05]} />
        <meshStandardMaterial color="#9aa39c" metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0, 1.62, 0.02]}>
        <mesh>
          <boxGeometry args={[0.7, 0.28, 0.05]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
        <ExitSignSurface />
      </group>
    </group>
  );
}

function PhysicsLabRoom() {
  const tileXs = Array.from({ length: 13 }, (_, index) => -9 + index * 1.5);
  const tileYs = Array.from({ length: 6 }, (_, index) => -1.8 + index * 1.15);
  const floorGridXs = Array.from({ length: 15 }, (_, index) => -13 + index * 2);
  const floorGridZs = Array.from({ length: 11 }, (_, index) => -3 + index * 1.9);
  const ceilingGridXs = [-11, -7, -3, 1, 5, 9];
  const ceilingGridZs = [-3, 0.7, 4.4, 8.1];
  return (
    <group>
      <mesh position={[0, 1.66, -4.25]} receiveShadow>
        <boxGeometry args={[30, 9.68, 0.18]} />
        <meshStandardMaterial color="#d9e1df" roughness={0.86} />
      </mesh>
      <mesh position={[-14.9, 1.66, 5.5]} receiveShadow>
        <boxGeometry args={[0.2, 9.68, 20]} />
        <meshStandardMaterial color="#cbd5d3" roughness={0.88} />
      </mesh>
      <mesh position={[14.9, 1.66, 5.5]} receiveShadow>
        <boxGeometry args={[0.2, 9.68, 20]} />
        <meshStandardMaterial color="#cbd5d3" roughness={0.88} />
      </mesh>
      <mesh position={[0, -3.18, 5.5]} receiveShadow>
        <boxGeometry args={[30, 0.18, 20]} />
        <meshStandardMaterial color="#8c9897" roughness={0.92} />
      </mesh>
      {/* Polished vinyl floor grid seams, giving the floor a tiled, walkable feel. */}
      {floorGridXs.map((x) => (
        <mesh key={`floor-grid-x-${x}`} position={[x, -3.086, 5.5]}>
          <boxGeometry args={[0.016, 0.006, 19.8]} />
          <meshStandardMaterial color="#75827f" roughness={1} />
        </mesh>
      ))}
      {floorGridZs.map((z) => (
        <mesh key={`floor-grid-z-${z}`} position={[0, -3.086, z]}>
          <boxGeometry args={[29.6, 0.006, 0.016]} />
          <meshStandardMaterial color="#75827f" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 6.5, 5.5]} receiveShadow>
        <boxGeometry args={[30, 0.18, 20]} />
        <meshStandardMaterial color="#edf2ef" roughness={0.92} />
      </mesh>
      {/* Suspended ceiling grid lines between the recessed light panels. */}
      {ceilingGridXs.map((x) => (
        <mesh key={`ceiling-grid-x-${x}`} position={[x, 6.41, 5.5]}>
          <boxGeometry args={[0.03, 0.008, 19.8]} />
          <meshStandardMaterial color="#c3cac8" roughness={1} />
        </mesh>
      ))}
      {ceilingGridZs.map((z) => (
        <mesh key={`ceiling-grid-z-${z}`} position={[0, 6.41, z]}>
          <boxGeometry args={[29.7, 0.008, 0.03]} />
          <meshStandardMaterial color="#c3cac8" roughness={1} />
        </mesh>
      ))}

      {/* Ceramic wall tiles and grout behind the working area. */}
      <mesh position={[0, -0.18, -4.13]} receiveShadow>
        <planeGeometry args={[19.5, 3.45]} />
        <meshStandardMaterial color="#ecf1ef" roughness={0.72} />
      </mesh>
      {tileXs.map((x) => (
        <mesh key={`tile-x-${x}`} position={[x, -0.18, -4.02]}>
          <boxGeometry args={[0.018, 3.45, 0.012]} />
          <meshStandardMaterial color="#9aa9a8" roughness={0.8} />
        </mesh>
      ))}
      {tileYs.map((y) => (
        <mesh key={`tile-y-${y}`} position={[0, y, -4.02]}>
          <boxGeometry args={[19.5, 0.018, 0.012]} />
          <meshStandardMaterial color="#9aa9a8" roughness={0.8} />
        </mesh>
      ))}

      {/* Deep hardwood laboratory bench with cupboards below. */}
      <mesh position={[0, BENCH_TOP_Y - 0.14, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[12.6, 0.28, 3.65]} />
        <meshPhysicalMaterial color="#87502e" roughness={0.42} clearcoat={0.28} clearcoatRoughness={0.46} />
      </mesh>
      <mesh position={[0, BENCH_TOP_Y + 0.018, -0.05]} receiveShadow>
        <boxGeometry args={[12.45, 0.045, 3.5]} />
        <meshPhysicalMaterial color="#a7673d" roughness={0.36} clearcoat={0.34} />
      </mesh>
      {[-4.55, -1.55, 1.55, 4.55].map((x) => (
        <group key={`cabinet-${x}`} position={[x, -2.7, -0.65]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2.72, 1.02, 1.95]} />
            <meshStandardMaterial color="#536663" roughness={0.68} />
          </mesh>
          {[-0.64, 0.64].map((doorX) => (
            <group key={doorX} position={[doorX, 0, 0.99]}>
              <mesh>
                <boxGeometry args={[1.22, 0.87, 0.045]} />
                <meshStandardMaterial color="#647774" roughness={0.6} />
              </mesh>
              <mesh position={[doorX < 0 ? 0.43 : -0.43, 0, 0.045]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
                <meshStandardMaterial color="#d5dedc" metalness={0.75} roughness={0.24} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Window, notice board, shelves and small room details. */}
      <group position={[4.15, 1.55, -4.02]}>
        <mesh>
          <boxGeometry args={[3.15, 2.05, 0.09]} />
          <meshStandardMaterial color="#53615f" roughness={0.52} />
        </mesh>
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.85, 1.76]} />
          <meshPhysicalMaterial color="#8fc6d5" roughness={0.2} metalness={0.05} clearcoat={0.65} />
        </mesh>
        <mesh position={[0, 0, 0.11]}><boxGeometry args={[0.075, 1.8, 0.06]} /><meshStandardMaterial color="#e5ecea" /></mesh>
        <mesh position={[0, 0, 0.11]}><boxGeometry args={[2.88, 0.075, 0.06]} /><meshStandardMaterial color="#e5ecea" /></mesh>
      </group>
      <group position={[-4.3, 1.62, -4.01]}>
        <mesh castShadow><boxGeometry args={[3.1, 1.72, 0.1]} /><meshStandardMaterial color="#34423f" roughness={0.72} /></mesh>
        <mesh position={[0, 0, 0.061]}><planeGeometry args={[2.85, 1.48]} /><meshStandardMaterial color="#173f35" roughness={0.9} /></mesh>
        {[0.48, 0, -0.48].map((y, i) => (
          <mesh key={y} position={[i === 1 ? 0.18 : -0.22, y, 0.075]}>
            <boxGeometry args={[i === 1 ? 1.7 : 2.2, 0.025, 0.015]} />
            <meshBasicMaterial color={i === 1 ? "#f2cf77" : "#d5e6df"} />
          </mesh>
        ))}
      </group>
      <group position={[0, 0.8, -3.9]}>
        <mesh position={[0, 0, 0]} castShadow><boxGeometry args={[3.1, 0.12, 0.48]} /><meshStandardMaterial color="#52615f" metalness={0.35} roughness={0.42} /></mesh>
        {[-1.05, -0.35, 0.35, 1.05].map((x, index) => (
          <group key={x} position={[x, 0.27, 0.02]}>
            <mesh castShadow><cylinderGeometry args={[0.13, 0.15, 0.52, 20]} /><meshPhysicalMaterial color={["#d7a64d", "#75b7a6", "#8870aa", "#b8624f"][index]} roughness={0.38} clearcoat={0.3} /></mesh>
            <mesh position={[0, 0.29, 0]}><cylinderGeometry args={[0.09, 0.09, 0.08, 18]} /><meshStandardMaterial color="#1f2928" roughness={0.5} /></mesh>
          </group>
        ))}
      </group>

      {ceilingGridXs.map((x) =>
        [-0.7, 3.6].map((z) => (
          <group key={`light-${x}-${z}`} position={[x, 6.28, z]}>
            <mesh castShadow>
              <boxGeometry args={[2.2, 0.12, 0.72]} />
              <meshStandardMaterial color="#dce5e4" roughness={0.45} />
            </mesh>
            <mesh position={[0, -0.07, 0]}>
              <boxGeometry args={[1.94, 0.035, 0.51]} />
              <meshStandardMaterial color="#fff8df" emissive="#fff4cc" emissiveIntensity={2.1} />
            </mesh>
            <pointLight position={[0, -0.35, 0]} color="#fff2d2" intensity={0.95} distance={8.5} decay={2} />
          </group>
        ))
      )}

      <LabExitDoor position={[-14.78, -1.65, 8]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Bench-mounted retort stand, boss head and knife-edge pivot
// ---------------------------------------------------------------------------

function PivotStand() {
  const rodX = -2.45;
  const rodZ = -0.62;
  const horizontalY = PIVOT_Y + 0.2;
  return (
    <group>
      <mesh position={[rodX, BENCH_TOP_Y + 0.09, rodZ]} castShadow receiveShadow>
        <boxGeometry args={[1.48, 0.18, 1.12]} />
        <meshPhysicalMaterial color="#26302f" metalness={0.72} roughness={0.3} clearcoat={0.28} />
      </mesh>
      <mesh position={[rodX, BENCH_TOP_Y + 0.19, rodZ]} castShadow>
        <boxGeometry args={[1.22, 0.055, 0.9]} />
        <meshStandardMaterial color="#4f5a58" metalness={0.68} roughness={0.24} />
      </mesh>
      {[[-0.58, -0.42], [0.58, -0.42], [-0.58, 0.42], [0.58, 0.42]].map(([x, z], index) => (
        <mesh key={index} position={[rodX + x, BENCH_TOP_Y + 0.01, rodZ + z]}>
          <cylinderGeometry args={[0.075, 0.09, 0.055, 16]} />
          <meshStandardMaterial color="#171d1c" roughness={0.72} />
        </mesh>
      ))}

      <CylinderBetween start={new THREE.Vector3(rodX, BENCH_TOP_Y + 0.2, rodZ)} end={new THREE.Vector3(rodX, horizontalY + 0.25, rodZ)} radius={0.055} color="#c3cfcd" metalness={0.88} roughness={0.18} />
      <CylinderBetween start={new THREE.Vector3(rodX - 0.12, horizontalY, rodZ)} end={new THREE.Vector3(0.16, horizontalY, rodZ)} radius={0.05} color="#c3cfcd" metalness={0.88} roughness={0.18} />

      {/* Boss head and tightening screw. */}
      <mesh position={[rodX, horizontalY, rodZ]} castShadow>
        <boxGeometry args={[0.28, 0.28, 0.28]} />
        <meshStandardMaterial color="#343e3d" metalness={0.76} roughness={0.24} />
      </mesh>
      <CylinderBetween start={new THREE.Vector3(rodX, horizontalY, rodZ - 0.12)} end={new THREE.Vector3(rodX, horizontalY, rodZ - 0.42)} radius={0.034} color="#aeb9b7" metalness={0.85} roughness={0.2} />
      <mesh position={[rodX, horizontalY, rodZ - 0.48]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.095, 0.08, 10]} />
        <meshStandardMaterial color="#242b2a" metalness={0.65} roughness={0.3} />
      </mesh>

      {/* Forward clamp keeps the pendulum plane clear of the vertical support. */}
      <CylinderBetween start={new THREE.Vector3(0, horizontalY, rodZ)} end={new THREE.Vector3(0, horizontalY, -0.06)} radius={0.038} color="#b9c5c3" metalness={0.86} roughness={0.2} />
      <mesh position={[0, horizontalY - 0.09, -0.03]} castShadow>
        <boxGeometry args={[0.22, 0.26, 0.22]} />
        <meshStandardMaterial color="#303a38" metalness={0.72} roughness={0.26} />
      </mesh>
      {[-0.078, 0.078].map((x) => (
        <mesh key={x} position={[x, PIVOT_Y + 0.025, 0]} castShadow>
          <boxGeometry args={[0.065, 0.19, 0.12]} />
          <meshStandardMaterial color="#9b6b35" metalness={0.65} roughness={0.28} />
        </mesh>
      ))}
      <mesh position={[0, PIVOT_Y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.23, 24]} />
        <meshPhysicalMaterial color="#d6a63d" metalness={0.88} roughness={0.16} clearcoat={0.35} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Force vector arrow (reused pattern: origin + signed length along a dir)
// ---------------------------------------------------------------------------

function VectorArrow({
  origin,
  dir,
  length,
  color,
}: {
  origin: THREE.Vector3;
  dir: THREE.Vector3; // unit vector
  length: number;
  color: string;
}) {
  if (Math.abs(length) < 0.02) return null;
  const unitDir = dir.clone().normalize();
  const end = origin.clone().add(unitDir.clone().multiplyScalar(length));
  const coneQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), unitDir);
  return (
    <group>
      <Line points={[origin, end]} color={color} lineWidth={1.5} />
      <mesh position={[end.x, end.y, end.z]} quaternion={coneQuat}>
        <coneGeometry args={[0.035, 0.11, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// The bob
// ---------------------------------------------------------------------------

function bobRadiusForMass(massKg: number) {
  return 0.135 * Math.cbrt(Math.max(massKg, MIN_MASS_KG) / 0.1);
}

function Bob({
  massKg,
  position,
  stringDirection,
}: {
  massKg: number;
  position: THREE.Vector3;
  stringDirection: THREE.Vector3;
}) {
  const radius = bobRadiusForMass(massKg);
  const capPosition = stringDirection.clone().normalize().multiplyScalar(radius * 0.92);
  const capQuaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    stringDirection.clone().normalize()
  );
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[radius, 48, 32]} />
        <meshPhysicalMaterial
          color="#b77828"
          metalness={0.92}
          roughness={0.18}
          clearcoat={0.35}
          clearcoatRoughness={0.16}
        />
      </mesh>
      <mesh position={[-radius * 0.28, radius * 0.33, radius * 0.82]}>
        <sphereGeometry args={[radius * 0.12, 16, 12]} />
        <meshBasicMaterial color="#ffe3a0" transparent opacity={0.72} />
      </mesh>
      <group position={capPosition} quaternion={capQuaternion}>
        <mesh castShadow>
          <cylinderGeometry args={[radius * 0.2, radius * 0.25, radius * 0.2, 24]} />
          <meshStandardMaterial color="#7a4c1e" metalness={0.84} roughness={0.22} />
        </mesh>
        <mesh position={[0, radius * 0.12, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[radius * 0.14, radius * 0.04, 10, 24]} />
          <meshStandardMaterial color="#c8923c" metalness={0.9} roughness={0.18} />
        </mesh>
      </group>
    </group>
  );
}

function PivotProtractor({ angleRad }: { angleRad: number }) {
  const tickAngles = Array.from({ length: 13 }, (_, index) => THREE.MathUtils.degToRad(-60 + index * 10));
  const arcSteps = Math.max(2, Math.ceil(Math.abs(angleRad) / THREE.MathUtils.degToRad(3)));
  const angleArc = Array.from({ length: arcSteps + 1 }, (_, index) => {
    const angle = angleRad * (index / arcSteps);
    return new THREE.Vector3(0.51 * Math.sin(angle), PIVOT_Y - 0.51 * Math.cos(angle), -0.085);
  });
  return (
    <group>
      <mesh position={[0, PIVOT_Y, -0.1]}>
        <ringGeometry args={[0.67, 0.73, 64, 1, Math.PI, Math.PI]} />
        <meshPhysicalMaterial color="#d9f1ed" transparent opacity={0.52} roughness={0.22} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[0, PIVOT_Y, -0.082], [0, PIVOT_Y - 0.78, -0.082]]} color="#334b48" lineWidth={1.2} />
      {tickAngles.map((angle, index) => {
        const major = index % 3 === 0;
        const outer = 0.73;
        const inner = major ? 0.62 : 0.66;
        return (
          <Line
            key={angle}
            points={[
              [inner * Math.sin(angle), PIVOT_Y - inner * Math.cos(angle), -0.075],
              [outer * Math.sin(angle), PIVOT_Y - outer * Math.cos(angle), -0.075],
            ]}
            color={major ? "#223b37" : "#59716c"}
            lineWidth={major ? 1.5 : 0.8}
          />
        );
      })}
      {Math.abs(angleRad) > THREE.MathUtils.degToRad(0.4) && (
        <Line points={angleArc} color="#d97706" lineWidth={2.1} />
      )}
    </group>
  );
}

function MetreRule() {
  const ticks = Array.from({ length: 31 }, (_, index) => index);
  const x = -3.25;
  const bottom = BENCH_TOP_Y + 0.23;
  const height = PIVOT_Y - bottom + 0.2;
  return (
    <group>
      <mesh position={[x, bottom + height / 2, -0.28]} castShadow>
        <boxGeometry args={[0.16, height, 0.035]} />
        <meshPhysicalMaterial color="#d9b35f" roughness={0.45} clearcoat={0.18} />
      </mesh>
      {ticks.map((tick) => {
        const y = bottom + 0.08 + (tick / 30) * (height - 0.16);
        const width = tick % 10 === 0 ? 0.11 : tick % 5 === 0 ? 0.085 : 0.055;
        return (
          <mesh key={tick} position={[x + 0.08 - width / 2, y, -0.255]}>
            <boxGeometry args={[width, 0.008, 0.008]} />
            <meshBasicMaterial color="#332714" />
          </mesh>
        );
      })}
    </group>
  );
}

function PhotogateAndTimer({ lengthM, massKg }: { lengthM: number; massKg: number }) {
  const gateY = PIVOT_Y - lengthM * WORLD_SCALE;
  const gap = Math.max(0.34, bobRadiusForMass(massKg) + 0.12);
  const supportX = 1.52;
  const supportZ = 0.52;
  const timerPosition = new THREE.Vector3(3.25, BENCH_TOP_Y + 0.28, 0.48);
  const cableStart = new THREE.Vector3(gap + 0.08, gateY - 0.12, 0.24);
  const cableCurve = new THREE.CatmullRomCurve3([
    cableStart,
    new THREE.Vector3(1.45, Math.max(gateY - 0.65, BENCH_TOP_Y + 0.12), 0.42),
    new THREE.Vector3(2.25, BENCH_TOP_Y + 0.08, 0.52),
    timerPosition.clone().add(new THREE.Vector3(-0.42, 0.02, 0)),
  ]).getPoints(28);
  return (
    <group>
      <mesh position={[supportX, BENCH_TOP_Y + 0.075, supportZ]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.15, 0.72]} />
        <meshStandardMaterial color="#293230" metalness={0.62} roughness={0.32} />
      </mesh>
      <CylinderBetween
        start={new THREE.Vector3(supportX, BENCH_TOP_Y + 0.15, supportZ)}
        end={new THREE.Vector3(supportX, PIVOT_Y + 0.22, supportZ)}
        radius={0.036}
        color="#b9c5c3"
        metalness={0.86}
        roughness={0.2}
      />
      <CylinderBetween
        start={new THREE.Vector3(gap + 0.03, gateY, 0.34)}
        end={new THREE.Vector3(supportX, gateY, supportZ)}
        radius={0.027}
        color="#aab6b4"
        metalness={0.82}
        roughness={0.22}
      />
      <mesh position={[supportX, gateY, supportZ]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color="#303a38" metalness={0.68} roughness={0.28} />
      </mesh>
      <group position={[0, gateY, 0.12]}>
        {[-gap, gap].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.115, 0.46, 0.28]} />
              <meshStandardMaterial color="#202a29" metalness={0.38} roughness={0.38} />
            </mesh>
            <mesh position={[-Math.sign(x) * 0.063, 0, -0.13]}>
              <circleGeometry args={[0.036, 18]} />
              <meshStandardMaterial color={x < 0 ? "#b91c1c" : "#321a1a"} emissive={x < 0 ? "#ef4444" : "#000000"} emissiveIntensity={x < 0 ? 1.4 : 0} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.31, 0.19]} castShadow>
          <boxGeometry args={[gap * 2 + 0.22, 0.055, 0.34]} />
          <meshStandardMaterial color="#2c3735" metalness={0.42} roughness={0.34} />
        </mesh>
        <Line points={[[-gap + 0.06, 0, -0.02], [gap - 0.06, 0, -0.02]]} color="#ef4444" lineWidth={1} transparent opacity={0.6} />
      </group>
      <Line points={cableCurve} color="#171c1b" lineWidth={2.1} />
      <group position={timerPosition} rotation={[-0.18, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.05, 0.5, 0.72]} />
          <meshPhysicalMaterial color="#242e2d" metalness={0.35} roughness={0.38} clearcoat={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0.37]}>
          <planeGeometry args={[0.72, 0.2]} />
          <meshStandardMaterial color="#081f1d" emissive="#0d4f47" emissiveIntensity={0.45} roughness={0.18} />
        </mesh>
        {[-0.23, -0.08, 0.08, 0.23].map((x) => (
          <mesh key={x} position={[x, 0.08, 0.378]}>
            <boxGeometry args={[0.055, 0.12, 0.012]} />
            <meshBasicMaterial color="#7fffc3" />
          </mesh>
        ))}
        {[-0.31, 0, 0.31].map((x, index) => (
          <mesh key={x} position={[x, -0.14, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.025, 20]} />
            <meshStandardMaterial color={["#4ade80", "#fbbf24", "#ef4444"][index]} emissive={["#14532d", "#713f12", "#7f1d1d"][index]} emissiveIntensity={0.45} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// The simulated system: string/rod + bob, driven each frame
// ---------------------------------------------------------------------------

interface SimHandle {
  thetaDeg: number;
  omega: number;
  tension: number;
  slack: boolean;
  settled: boolean;
  periodEstimate: number;
}

function PendulumSystem({
  params,
  resetKey,
  playing,
  onTick,
  draggingRef,
  onDragRelease,
  onDragStart,
  releaseSignal = 0,
  releaseAngleDeg = DOING_RELEASE_ANGLE_DEG,
}: {
  params: PendulumParams;
  resetKey: number;
  playing: boolean;
  onTick: (state: SimHandle, bobWorld: THREE.Vector3, tautDir: THREE.Vector3) => void;
  draggingRef: React.MutableRefObject<boolean>;
  onDragRelease: (omegaKick: number) => void;
  onDragStart: () => void;
  // Doing Mode simplification: walking up to the bob and pressing the action
  // button releases it from a fixed angle instead of requiring a free-form
  // drag gesture. This reuses the exact same refs and callbacks
  // (onDragStart/onDragRelease + thetaRef/omegaRef) as the pointer-drag path,
  // so there is no second source of truth for the physics or the report.
  releaseSignal?: number;
  releaseAngleDeg?: number;
}) {
  const thetaRef = useRef(THREE.MathUtils.degToRad(22)); // radians from the downward vertical
  const omegaRef = useRef(0);
  const amplitudeRef = useRef(Math.abs(thetaRef.current));
  const previousLengthRef = useRef(params.lengthM);
  const slackRef = useRef(false);
  const slackPosRef = useRef(new THREE.Vector2());
  const slackVelRef = useRef(new THREE.Vector2());
  const lastDragAngleRef = useRef<{ angle: number; t: number } | null>(null);

  const groupRef = useRef<THREE.Group>(null);
  const [, forceRender] = useState(0);
  const dragPlaneRef = useRef<THREE.Mesh>(null);

  const updateAngleFromPoint = useCallback((point: THREE.Vector3) => {
    const dx = point.x;
    const dy = point.y - PIVOT_Y;
    const angle = THREE.MathUtils.clamp(Math.atan2(dx, -dy), -MAX_DRAG_ANGLE, MAX_DRAG_ANGLE);
    thetaRef.current = angle;
    amplitudeRef.current = Math.abs(angle);
    slackRef.current = false;
    omegaRef.current = 0;

    const now = performance.now() / 1000;
    const last = lastDragAngleRef.current;
    if (last) {
      const dt = Math.max(now - last.t, 0.001);
      let dAngle = angle - last.angle;
      if (dAngle > Math.PI) dAngle -= 2 * Math.PI;
      if (dAngle < -Math.PI) dAngle += 2 * Math.PI;
      lastDragAngleRef.current = { angle, t: now };
      (updateAngleFromPoint as any).__lastOmega = THREE.MathUtils.clamp(dAngle / dt, -MAX_OMEGA, MAX_OMEGA);
    } else {
      lastDragAngleRef.current = { angle, t: now };
      (updateAngleFromPoint as any).__lastOmega = 0;
    }
  }, []);

  useEffect(() => {
    thetaRef.current = THREE.MathUtils.degToRad(22);
    omegaRef.current = 0;
    amplitudeRef.current = Math.abs(thetaRef.current);
    slackRef.current = false;
  }, [resetKey]);

  useEffect(() => {
    const previousLength = Math.max(previousLengthRef.current, 0.05);
    const nextLength = Math.max(params.lengthM, 0.05);
    if (Math.abs(previousLength - nextLength) > 1e-6 && !draggingRef.current) {
      // If the length is adjusted during a swing, conserve angular momentum mL²ω.
      omegaRef.current = THREE.MathUtils.clamp(
        omegaRef.current * (previousLength * previousLength) / (nextLength * nextLength),
        -MAX_OMEGA,
        MAX_OMEGA
      );
    }
    previousLengthRef.current = nextLength;
  }, [params.lengthM, draggingRef]);

  const lastReleaseSignalRef = useRef(releaseSignal);
  useEffect(() => {
    if (releaseSignal === lastReleaseSignalRef.current) return;
    lastReleaseSignalRef.current = releaseSignal;
    const angle = THREE.MathUtils.clamp(THREE.MathUtils.degToRad(releaseAngleDeg), -MAX_DRAG_ANGLE, MAX_DRAG_ANGLE);
    onDragStart();
    thetaRef.current = angle;
    omegaRef.current = 0;
    amplitudeRef.current = Math.abs(angle);
    slackRef.current = false;
    lastDragAngleRef.current = null;
    onDragRelease(0);
  }, [releaseSignal, releaseAngleDeg, onDragStart, onDragRelease]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const L = Math.max(params.lengthM, 0.05);
    const m = Math.max(params.massKg, MIN_MASS_KG);
    const g = params.gravity;

    if (playing && !draggingRef.current) {
      const dt = delta / SUBSTEPS;
      const dampingRate = params.damping / Math.max(m * L * L, 1e-6);
      const acceleration = (theta: number, angularVelocity: number) =>
        -(g / L) * Math.sin(theta) - dampingRate * angularVelocity;
      for (let s = 0; s < SUBSTEPS; s++) {
        if (!slackRef.current) {
          // Fourth-order Runge-Kutta integration is stable across the full control range.
          const theta0 = thetaRef.current;
          const omega0 = omegaRef.current;
          const k1Theta = omega0;
          const k1Omega = acceleration(theta0, omega0);
          const k2Theta = omega0 + (k1Omega * dt) / 2;
          const k2Omega = acceleration(theta0 + (k1Theta * dt) / 2, omega0 + (k1Omega * dt) / 2);
          const k3Theta = omega0 + (k2Omega * dt) / 2;
          const k3Omega = acceleration(theta0 + (k2Theta * dt) / 2, omega0 + (k2Omega * dt) / 2);
          const k4Theta = omega0 + k3Omega * dt;
          const k4Omega = acceleration(theta0 + k3Theta * dt, omega0 + k3Omega * dt);

          thetaRef.current = theta0 + (dt / 6) * (k1Theta + 2 * k2Theta + 2 * k3Theta + k4Theta);
          omegaRef.current = THREE.MathUtils.clamp(
            omega0 + (dt / 6) * (k1Omega + 2 * k2Omega + 2 * k3Omega + k4Omega),
            -MAX_OMEGA,
            MAX_OMEGA
          );

          if (omega0 * omegaRef.current <= 0 && Math.abs(thetaRef.current) > SETTLED_ANGLE_RAD) {
            amplitudeRef.current = Math.abs(thetaRef.current);
          }

          if (Math.abs(thetaRef.current) < SETTLED_ANGLE_RAD && Math.abs(omegaRef.current) < SETTLED_OMEGA) {
            thetaRef.current = 0;
            omegaRef.current = 0;
          }

          const tension = m * g * Math.cos(thetaRef.current) + m * L * omegaRef.current * omegaRef.current;
          if (tension < 0) {
            // String goes slack — hand off to free 2D projectile motion.
            slackRef.current = true;
            const x = L * Math.sin(thetaRef.current);
            const y = -L * Math.cos(thetaRef.current);
            slackPosRef.current.set(x, y);
            const vx = L * omegaRef.current * Math.cos(thetaRef.current);
            const vy = L * omegaRef.current * Math.sin(thetaRef.current);
            slackVelRef.current.set(vx, vy);
          }
        } else {
          slackVelRef.current.y += -g * dt;
          slackPosRef.current.x += slackVelRef.current.x * dt;
          slackPosRef.current.y += slackVelRef.current.y * dt;
          const dist = slackPosRef.current.length();
          if (dist >= L) {
            // String snaps taut again — kill the radial velocity component
            // (inextensible string), keep the tangential component.
            const radialDir = slackPosRef.current.clone().normalize();
            const radialSpeed = slackVelRef.current.dot(radialDir);
            const radialVel = radialDir.clone().multiplyScalar(radialSpeed);
            const tangentialVel = slackVelRef.current.clone().sub(radialVel);
            const clampedPos = radialDir.clone().multiplyScalar(L);
            thetaRef.current = Math.atan2(clampedPos.x, -clampedPos.y);
            // tangential speed / L, signed by cross product z-component
            const cross = clampedPos.x * tangentialVel.y - clampedPos.y * tangentialVel.x;
            omegaRef.current = THREE.MathUtils.clamp(
              Math.sign(cross || 1) * tangentialVel.length() / L,
              -MAX_OMEGA,
              MAX_OMEGA
            );
            slackRef.current = false;
          }
        }
      }
    }

    const bobLocal = slackRef.current
      ? new THREE.Vector3(slackPosRef.current.x, slackPosRef.current.y, 0)
      : new THREE.Vector3(L * Math.sin(thetaRef.current), -L * Math.cos(thetaRef.current), 0);
    const bobWorld = new THREE.Vector3(0, PIVOT_Y, 0).add(bobLocal.clone().multiplyScalar(WORLD_SCALE));

    if (groupRef.current) {
      groupRef.current.position.copy(bobWorld);
    }

    const tension = slackRef.current
      ? 0
      : m * g * Math.cos(thetaRef.current) + m * L * omegaRef.current * omegaRef.current;
    const settled =
      !slackRef.current &&
      Math.abs(thetaRef.current) < SETTLED_ANGLE_RAD &&
      Math.abs(omegaRef.current) < SETTLED_OMEGA;

    onTick(
      {
        thetaDeg: THREE.MathUtils.radToDeg(thetaRef.current),
        omega: omegaRef.current,
        tension,
        slack: slackRef.current,
        settled,
        periodEstimate: finiteAmplitudePeriod(L, g, amplitudeRef.current),
      },
      bobWorld,
      bobLocal.clone().normalize()
    );

    forceRender((t) => (t + 1) % 100000);
  });

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      draggingRef.current = true;
      onDragStart();
      lastDragAngleRef.current = null;
      updateAngleFromPoint(e.point);
      (e.target as any)?.setPointerCapture?.(e.pointerId);
    },
    [draggingRef, onDragStart, updateAngleFromPoint]
  );

  const handleDragPlaneMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!draggingRef.current) return;
      e.stopPropagation();
      updateAngleFromPoint(e.point);
    },
    [draggingRef, updateAngleFromPoint]
  );

  const handlePointerUp = useCallback(() => {
    if (draggingRef.current) {
      const kick = (updateAngleFromPoint as any).__lastOmega ?? 0;
      const naturalAngularRate = Math.sqrt(params.gravity / Math.max(params.lengthM, 0.05));
      const realisticReleaseLimit = Math.min(2.4, naturalAngularRate * 0.72);
      omegaRef.current = THREE.MathUtils.clamp(kick * 0.36, -realisticReleaseLimit, realisticReleaseLimit);
      onDragRelease(omegaRef.current);
    }
    draggingRef.current = false;
    lastDragAngleRef.current = null;
  }, [draggingRef, onDragRelease, params.gravity, params.lengthM, updateAngleFromPoint]);

  useEffect(() => {
    const releaseOutsideCanvas = () => handlePointerUp();
    window.addEventListener("pointerup", releaseOutsideCanvas);
    window.addEventListener("pointercancel", releaseOutsideCanvas);
    return () => {
      window.removeEventListener("pointerup", releaseOutsideCanvas);
      window.removeEventListener("pointercancel", releaseOutsideCanvas);
    };
  }, [handlePointerUp]);

  const L = Math.max(params.lengthM, 0.05);
  const bobLocal = slackRef.current
    ? new THREE.Vector3(slackPosRef.current.x, slackPosRef.current.y, 0)
    : new THREE.Vector3(L * Math.sin(thetaRef.current), -L * Math.cos(thetaRef.current), 0);
  const bobWorld = new THREE.Vector3(0, PIVOT_Y, 0).add(bobLocal.clone().multiplyScalar(WORLD_SCALE));
  const pivotWorld = new THREE.Vector3(0, PIVOT_Y, 0);
  const m = Math.max(params.massKg, MIN_MASS_KG);
  const g = params.gravity;
  const tension = slackRef.current ? 0 : m * g * Math.cos(thetaRef.current) + m * L * omegaRef.current * omegaRef.current;
  const stringDir = bobWorld.clone().sub(pivotWorld).normalize();
  const stringLength = bobWorld.distanceTo(pivotWorld);
  const stringMidpoint = pivotWorld.clone().add(bobWorld).multiplyScalar(0.5);
  const stringQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), stringDir);
  const tensionDir = pivotWorld.clone().sub(bobWorld).normalize();
  const visibleStringEnd = bobWorld.clone().add(tensionDir.clone().multiplyScalar(bobRadiusForMass(params.massKg) * 0.94));
  const restoringForceMag = Math.abs(m * g * Math.sin(thetaRef.current));
  const thetaSign = Math.sign(thetaRef.current) || 1;
  const restoringDir = new THREE.Vector3(
    -tensionDir.y * thetaSign,
    tensionDir.x * thetaSign,
    0
  );

  // Slack string sags visually — draw a gentle quadratic dip instead of a straight line.
  const stringPoints = useMemo(() => {
    if (!slackRef.current) return [pivotWorld, visibleStringEnd];
    const mid = pivotWorld.clone().add(bobWorld).multiplyScalar(0.5);
    mid.y -= 0.15;
    const curve = new THREE.QuadraticBezierCurve3(pivotWorld, mid, bobWorld);
    return curve.getPoints(16);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bobWorld.x, bobWorld.y, bobWorld.z, visibleStringEnd.x, visibleStringEnd.y, slackRef.current]);

  return (
    <>
      <Line
        points={stringPoints}
        color={slackRef.current ? "#817d74" : "#ded8c8"}
        lineWidth={1.4}
        onPointerDown={handlePointerDown}
      />

      <mesh
        position={stringMidpoint}
        quaternion={stringQuaternion}
        onPointerDown={handlePointerDown}
        onPointerMove={handleDragPlaneMove}
        onPointerUp={handlePointerUp}
      >
        <cylinderGeometry args={[0.1, 0.1, stringLength, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <group
        ref={groupRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handleDragPlaneMove}
        onPointerUp={handlePointerUp}
      >
        <Bob massKg={params.massKg} position={new THREE.Vector3(0, 0, 0)} stringDirection={tensionDir} />
      </group>

      <PivotProtractor angleRad={thetaRef.current} />

      {/* Invisible billboard drag-plane, catches pointer moves anywhere in the swing arc */}
      <mesh
        ref={dragPlaneRef}
        position={[0, PIVOT_Y - 1.2, 0]}
        onPointerMove={handleDragPlaneMove}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Force vectors, only meaningful while taut */}
      {!slackRef.current && (() => {
        const REF_ARROW_LEN = 0.55;
        const forceScale = REF_ARROW_LEN / Math.max(m * g, 0.0001);
        const availableDownwardLength = Math.max(0.08, bobWorld.y - BENCH_TOP_Y - 0.08);
        return (
          <>
            <VectorArrow
              origin={bobWorld.clone().add(new THREE.Vector3(0.05, 0, 0))}
              dir={new THREE.Vector3(0, -1, 0)}
              length={Math.min(m * g * forceScale, availableDownwardLength)}
              color="#ef1235"
            />
            <VectorArrow
              origin={bobWorld.clone().add(tensionDir.clone().multiplyScalar(0.03))}
              dir={tensionDir}
              length={tension * forceScale}
              color="#4038ff"
            />
            <VectorArrow
              origin={bobWorld.clone().add(new THREE.Vector3(-0.05, 0, 0))}
              dir={restoringDir}
              length={restoringForceMag * forceScale * 4.5}
              color="#15891f"
            />
          </>
        );
      })()}
    </>
  );
}

function InteractionHighlight({ position, active }: { position: THREE.Vector3; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.z = t * 0.6;
    ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
  });

  return (
    <mesh ref={ringRef} position={[position.x, position.y + 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]} visible={active} renderOrder={30}>
      <ringGeometry args={[0.4, 0.5, 40]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.85} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

// ---------------------------------------------------------------------------
// Scene wrapper
// ---------------------------------------------------------------------------

interface SceneDoingModeProps {
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: MutableRefObject<{ x: number; y: number }>;
  onTargetChange?: (target: Interactable | null) => void;
}

function Scene({
  mode = "learning",
  isMobile = false,
  interactables = [],
  activeTargetId = null,
  moveVectorRef,
  onTargetChange,
  ...pendulumProps
}: Parameters<typeof PendulumSystem>[0] & SceneDoingModeProps) {
  const { camera, size } = useThree();
  const isMobileFrame = size.width < 640 || size.width / Math.max(size.height, 1) < 0.82;
  const cameraTarget = useMemo<[number, number, number]>(() => [0, isMobileFrame ? 0.3 : 0.15, -0.15], [isMobileFrame]);

  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobileFrame ? [0, 0.75, 10.8] : [0, 0.55, 8.9];
    camera.position.set(...position);
    camera.near = 0.08;
    camera.far = 80;
    if (camera instanceof THREE.PerspectiveCamera) camera.fov = isMobileFrame ? 56 : 50;
    camera.lookAt(...cameraTarget);
    camera.updateProjectionMatrix();
  }, [camera, cameraTarget, isMobileFrame, mode]);

  return (
    <>
      <color attach="background" args={["#cbd4d2"]} />
      <fog attach="fog" args={["#cbd4d2", 18, 34]} />
      <ambientLight intensity={0.46} />
      <hemisphereLight args={["#dff3f1", "#655646", 0.78]} />
      <directionalLight
        position={[6, 9, 7]}
        intensity={1.45}
        color="#fff2d4"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={7}
        shadow-camera-bottom={-5}
      />
      <PhysicsLabRoom />
      <PivotStand />
      <MetreRule />
      <PhotogateAndTimer lengthM={pendulumProps.params.lengthM} massKg={pendulumProps.params.massKg} />
      <PendulumSystem {...pendulumProps} />

      {mode === "doing" &&
        interactables.map((item) => <InteractionHighlight key={item.id} position={item.position} active={item.id === activeTargetId} />)}

      {mode === "learning" ? (
        <OrbitControls
          makeDefault
          target={cameraTarget}
          minDistance={isMobileFrame ? 8.8 : 7.2}
          maxDistance={14}
          enableRotate
          enableZoom
          enablePan={false}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.75}
          maxPolarAngle={Math.PI / 2.04}
        />
      ) : (
        <PlayerController
          bounds={PLAYER_BOUNDS}
          obstacles={BENCH_OBSTACLES}
          spawn={PLAYER_SPAWN}
          isMobile={isMobile}
          enabled
          moveVector={moveVectorRef ?? defaultMoveVectorRef}
          onUpdate={(position, lookDirection) => {
            onTargetChange?.(resolveActiveInteractable(interactables, position, lookDirection));
          }}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Phase-space plot: angular velocity (ω) vs angular position (θ)
// ---------------------------------------------------------------------------

function PhaseSpacePlot({ trail }: { trail: { theta: number; omega: number }[] }) {
  const width = 240;
  const height = 160;
  const pad = 22;
  const maxTheta = Math.PI;
  const maxOmega = 8;

  const toPx = (theta: number, omega: number) => ({
    px: width / 2 + (theta / maxTheta) * (width / 2 - pad),
    py: height / 2 - (omega / maxOmega) * (height / 2 - pad),
  });

  const pathD = trail
    .map((p, i) => {
      const { px, py } = toPx(p.theta, p.omega);
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");

  const last = trail[trail.length - 1];

  return (
    <div className="rounded-xl bg-slate-900/70 border border-white/10 p-3">
      <svg width={width} height={height} className="overflow-visible">
        <line x1={pad} y1={height / 2} x2={width - pad} y2={height / 2} stroke="#475569" strokeWidth={1} />
        <line x1={width / 2} y1={pad} x2={width / 2} y2={height - pad} stroke="#475569" strokeWidth={1} />
        <text x={width - pad} y={height / 2 - 6} fill="#94a3b8" fontSize={9} textAnchor="end">
          θ
        </text>
        <text x={width / 2 + 6} y={pad + 8} fill="#94a3b8" fontSize={9}>
          ω
        </text>
        {trail.length > 1 && <path d={pathD} fill="none" stroke="#a855f7" strokeWidth={1.3} opacity={0.85} />}
        {last && (
          <circle cx={toPx(last.theta, last.omega).px} cy={toPx(last.theta, last.omega).py} r={3.2} fill="#f97316" />
        )}
      </svg>
      <div className="text-[11px] text-slate-400 mt-1">
        Spirals inward toward (0,0) as damping drains energy from the system.
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ZIMSEC-style stopwatch: manual laps vs automatic zero-crossing timing
// ---------------------------------------------------------------------------

function useStopwatch(autoCrossingSignal: number) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [autoLaps, setAutoLaps] = useState<number[]>([]);
  const [manualLaps, setManualLaps] = useState<number[]>([]);
  const startRef = useRef<number | null>(null);
  const lastAutoSignalRef = useRef(autoCrossingSignal);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (running && startRef.current !== null) {
        setElapsed((performance.now() - startRef.current) / 1000);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  useEffect(() => {
    if (autoCrossingSignal !== lastAutoSignalRef.current) {
      lastAutoSignalRef.current = autoCrossingSignal;
      if (running && startRef.current !== null) {
        setAutoLaps((prev) => [...prev, (performance.now() - startRef.current!) / 1000]);
      }
    }
  }, [autoCrossingSignal, running]);

  const start = useCallback(() => {
    startRef.current = performance.now();
    setElapsed(0);
    setAutoLaps([]);
    setManualLaps([]);
    setRunning(true);
  }, []);

  const stop = useCallback(() => setRunning(false), []);

  const recordManualLap = useCallback(() => {
    if (!running || startRef.current === null) return;
    setManualLaps((prev) => [...prev, (performance.now() - startRef.current!) / 1000]);
  }, [running]);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
    setAutoLaps([]);
    setManualLaps([]);
  }, []);

  return { running, elapsed, autoLaps, manualLaps, start, stop, recordManualLap, reset };
}

function periodFromLaps(laps: number[]) {
  if (laps.length === 0) return 0;
  // laps are cumulative one-full-oscillation timestamps
  return laps[laps.length - 1] / laps.length;
}

function periodFromAutomaticCrossings(crossings: number[]) {
  if (crossings.length < 2) return 0;
  // Ignore the partial interval between pressing Start and the first same-direction crossing.
  return (crossings[crossings.length - 1] - crossings[0]) / (crossings.length - 1);
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

const GRAVITY_PRESETS = [
  { label: "Earth", value: 9.8 },
  { label: "Moon", value: 1.6 },
  { label: "Mars", value: 3.7 },
];

interface FuturisticSliderProps {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function FuturisticSlider({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
}: FuturisticSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div
      // Lets the narration hand find this control and ride its thumb.
      data-experiment-tour={`pendulum-${id.replace(/^mobile-(pendulum-)?/, "")}`}
      className="group rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-inner shadow-white/[0.03] transition-all duration-300 hover:border-orange-300/30 hover:bg-white/[0.065]"
    >
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <label htmlFor={id} className="min-w-0 truncate font-semibold text-slate-200">
          {label}
        </label>
        <span className="shrink-0 rounded-full border border-orange-300/20 bg-orange-300/10 px-2 py-0.5 text-xs font-black text-orange-100">
          {displayValue}
        </span>
      </div>
      <div className="relative h-8">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
          <div
            className="futuristic-fill h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-orange-300 shadow-[0_0_18px_rgba(251,146,60,0.45)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="futuristic-range absolute inset-0 h-8 w-full cursor-pointer appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}

interface PendulumPaperProps {
  lengthM: number;
  massKg: number;
  gravity: number;
  damping: number;
  thetaDeg: number;
  omega: number;
  tension: number;
  theoretical: number;
  finitePeriod: number;
  autoPeriod: number | null;
  manualPeriod: number | null;
  autoLaps: number[];
  manualLaps: number[];
  onClose: () => void;
}

function PendulumPaper({
  lengthM,
  massKg,
  gravity,
  damping,
  thetaDeg,
  omega,
  tension,
  theoretical,
  finitePeriod,
  autoPeriod,
  manualPeriod,
  autoLaps,
  manualLaps,
  onClose,
}: PendulumPaperProps) {
  return (
    <ExperimentPaperModal filename="simple-pendulum-experiment-paper.html" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase tracking-wide">
          Determination of the Period of a Simple Pendulum
        </h1>

        <h2 className="mt-6 text-base font-bold uppercase">Aim</h2>
        <p className="mt-1">
          To investigate the motion of a simple pendulum and determine the period of oscillation
          for a given string length.
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Apparatus &amp; Materials</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Simulated pendulum bob and string</li>
          <li>Adjustable string length</li>
          <li>Stopwatch and automatic laser-gate timer</li>
          <li>Gravity setting, g = {gravity.toFixed(1)} m/s²</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Methodology</h2>
        <ol className="mt-1 list-decimal space-y-1 pl-6">
          <li>The string length was set to {lengthM.toFixed(2)} m.</li>
          <li>The bob mass was set to {(massKg * 1000).toFixed(0)} g.</li>
          <li>The bob was displaced and released to oscillate freely.</li>
          <li>The period was estimated using the small-angle formula and compared with timed oscillations.</li>
          <li>Manual timing was compared with automatic laser-gate timing to observe reaction-time effects.</li>
        </ol>

        <h2 className="mt-6 text-base font-bold uppercase">Observations</h2>
        <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-2 py-1 text-left">Quantity</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 px-2 py-1">String length</td>
              <td className="border border-slate-400 px-2 py-1">{lengthM.toFixed(2)} m</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Bob mass</td>
              <td className="border border-slate-400 px-2 py-1">{(massKg * 1000).toFixed(0)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Current angle</td>
              <td className="border border-slate-400 px-2 py-1">{thetaDeg.toFixed(1)}°</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Angular velocity</td>
              <td className="border border-slate-400 px-2 py-1">{omega.toFixed(2)} rad/s</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">String tension</td>
              <td className="border border-slate-400 px-2 py-1">{tension.toFixed(2)} N</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Damping</td>
              <td className="border border-slate-400 px-2 py-1">{damping.toFixed(3)} N·m·s</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-6 text-base font-bold uppercase">Calculations</h2>
        <p className="mt-1">
          For small oscillations, T = 2π√(L/g). With L = {lengthM.toFixed(2)} m and
          g = {gravity.toFixed(1)} m/s², the theoretical period is{" "}
          <strong>{theoretical.toFixed(3)} s</strong>.
        </p>
        <p className="mt-2">
          The finite-amplitude prediction for the recorded release angle is <strong>{finitePeriod.toFixed(3)} s</strong>.
          The string length is measured from the knife-edge pivot to the centre of the spherical bob; bob mass does not
          change the ideal period.
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Timing Results</h2>
        <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-2 py-1 text-left">Timing method</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Oscillations recorded</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Automatic laser-gate</td>
              <td className="border border-slate-400 px-2 py-1">{Math.max(0, autoLaps.length - 1)}</td>
              <td className="border border-slate-400 px-2 py-1">{autoPeriod ? `${autoPeriod.toFixed(3)} s` : "Not recorded"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Manual stopwatch</td>
              <td className="border border-slate-400 px-2 py-1">{manualLaps.length}</td>
              <td className="border border-slate-400 px-2 py-1">{manualPeriod ? `${manualPeriod.toFixed(3)} s` : "Not recorded"}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-6 text-base font-bold uppercase">Conclusion</h2>
        <p className="mt-1">
          The measured period can be compared with the theoretical small-angle value. Larger
          amplitudes and reaction time can cause differences between manual and automatic timing.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

interface PendulumSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

interface TutorialStep {
  title: string;
  text: string;
  mode: "modal" | "bubble";
  target?: "hud" | "pivot" | "bob" | "controls" | "paper";
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Level Start: Simple Pendulum",
    text: "You are investigating how a pendulum swings and how its period changes. Your main job is to observe the angle, tension, time, and motion of the bob.",
    mode: "modal",
  },
  {
    title: "How The Experiment Works",
    text: "Drag the bob or the string to set an angle, then release it. Gravity pulls the bob down, tension acts along the string, and the restoring force pulls it back toward the middle.",
    mode: "modal",
  },
  {
    title: "Recording Your Paper",
    text: "Use the timer controls to measure oscillations. After taking readings, open the Paper button to generate the practical write-up with observations, values, calculations, and conclusion.",
    mode: "modal",
  },
  {
    title: "Observation HUD",
    text: "These live values show the angle, string tension, timer, angular position, and angular velocity while the pendulum moves.",
    mode: "bubble",
    target: "hud",
  },
  {
    title: "Clamped Knife-Edge Pivot",
    text: "The string hangs from the brass knife-edge on a real boss-and-clamp stand. Drag empty space to view the room from either side; rotation is limited to 180° so the camera stays inside the laboratory.",
    mode: "bubble",
    target: "pivot",
  },
  {
    title: "Drag The Bob",
    text: "Touch the bob or string, pull it to a new angle, then release. A quick release gives it a natural flick.",
    mode: "bubble",
    target: "bob",
  },
  {
    title: "Game Controls",
    text: "Use these controls to pause, reset, start timing, record laps, and change gravity, length, mass, or damping.",
    mode: "bubble",
    target: "controls",
  },
  {
    title: "Paper Button",
    text: "When you are ready to write up the experiment, tap Paper. It prepares the report using your current readings and timing results.",
    mode: "bubble",
    target: "paper",
  },
];

function PendulumTutorialOverlay({ onClose }: { onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [spotlightStyle, setSpotlightStyle] = useState<CSSProperties | null>(null);
  const [bubbleStyle, setBubbleStyle] = useState<CSSProperties>({});
  const step = tutorialSteps[stepIndex];
  const isLast = stepIndex === tutorialSteps.length - 1;

  useEffect(() => {
    if (step.mode !== "bubble") {
      setSpotlightStyle(null);
      return;
    }

    const visibleRect = (selector: string) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      const visible = elements.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(element).display !== "none";
      });
      return visible?.getBoundingClientRect() ?? null;
    };

    const sceneRect = () => visibleRect('[data-pendulum-tour="scene"]');

    const targetRect = () => {
      if (step.target === "hud") {
        return visibleRect('[data-pendulum-tour="hud"]');
      }
      if (step.target === "controls") {
        return visibleRect('[data-pendulum-tour="controls"], [data-mobile-experiment-controls="true"]');
      }
      if (step.target === "paper") {
        return visibleRect('[data-pendulum-tour="paper"]');
      }

      const scene = sceneRect();
      if (!scene) return null;
      const isMobile = window.innerWidth < 640;
      if (step.target === "pivot") {
        return new DOMRect(
          scene.left + scene.width * (isMobile ? 0.18 : 0.26),
          scene.top + scene.height * (isMobile ? 0.28 : 0.18),
          scene.width * (isMobile ? 0.64 : 0.36),
          72
        );
      }
      return new DOMRect(
        scene.left + scene.width * (isMobile ? 0.28 : 0.34),
        scene.top + scene.height * (isMobile ? 0.46 : 0.48),
        scene.width * (isMobile ? 0.44 : 0.26),
        scene.height * (isMobile ? 0.26 : 0.28)
      );
    };

    const update = () => {
      const rect = targetRect();
      if (!rect) return;

      const pad = 8;
      const left = Math.max(6, rect.left - pad);
      const top = Math.max(6, rect.top - pad);
      const width = Math.min(window.innerWidth - left - 6, rect.width + pad * 2);
      const height = Math.min(window.innerHeight - top - 6, rect.height + pad * 2);
      setSpotlightStyle({
        left,
        top,
        width,
        height,
        borderRadius: step.target === "bob" ? 999 : 18,
      });

      const bubbleWidth = Math.min(320, window.innerWidth - 24);
      const canPlaceRight = left + width + 16 + bubbleWidth < window.innerWidth;
      const canPlaceLeft = left - 16 - bubbleWidth > 0;
      const belowTop = top + height + 14;
      const aboveTop = top - 14 - 210;
      let bubbleLeft = canPlaceRight ? left + width + 16 : canPlaceLeft ? left - bubbleWidth - 16 : 12;
      let bubbleTop =
        belowTop + 210 < window.innerHeight
          ? belowTop
          : aboveTop > 8
            ? aboveTop
            : Math.max(8, Math.min(window.innerHeight - 230, top));

      if (window.innerWidth >= 640 && step.target === "controls") {
        bubbleLeft = Math.max(16, left - bubbleWidth - 22);
        bubbleTop = Math.max(16, top + 24);
      }
      setBubbleStyle({ left: bubbleLeft, top: bubbleTop, width: bubbleWidth });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const timer = window.setTimeout(update, 150);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.clearTimeout(timer);
    };
  }, [step.mode, step.target]);

  useEffect(() => {
    setTypedText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 2;
      setTypedText(step.text.slice(0, index));
      if (index >= step.text.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [step.text]);

  const goNext = () => {
    if (isLast) onClose();
    else setStepIndex((current) => current + 1);
  };

  const goBack = () => setStepIndex((current) => Math.max(0, current - 1));

  return (
    <div className={`fixed inset-0 z-[120] overflow-hidden text-white ${step.mode === "modal" ? "bg-black/72" : "pointer-events-none bg-transparent"}`}>
      <style>{`
        @keyframes tutorialPop {
          0% { opacity: 0; transform: translateY(18px) scale(0.92); }
          70% { opacity: 1; transform: translateY(-3px) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes tutorialPulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(103,232,249,0.85), 0 0 0 9999px rgba(0,0,0,0.68), 0 0 28px rgba(34,211,238,0.5); }
          50% { box-shadow: 0 0 0 4px rgba(250,204,21,0.9), 0 0 0 9999px rgba(0,0,0,0.68), 0 0 38px rgba(250,204,21,0.6); }
        }
        @keyframes tutorialShine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .tutorial-card {
          animation: tutorialPop 280ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
          box-shadow:
            inset 0 3px 0 rgba(255,255,255,0.28),
            inset 0 -12px 24px rgba(0,0,0,0.3),
            0 24px 70px rgba(0,0,0,0.62),
            0 0 34px rgba(168,85,247,0.42);
        }
        .tutorial-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.22) 45%, transparent 62%);
          animation: tutorialShine 2.6s ease-in-out infinite;
          pointer-events: none;
        }
        .tutorial-spotlight {
          animation: tutorialPulse 1.7s ease-in-out infinite;
        }
      `}</style>

      {step.mode === "bubble" && spotlightStyle && (
        <div className="tutorial-spotlight pointer-events-none fixed border border-cyan-200/90 bg-transparent" style={spotlightStyle} />
      )}

      {step.mode === "modal" ? (
        <div className="grid h-full place-items-center px-4">
          <div className="tutorial-card relative w-[min(92vw,430px)] overflow-hidden rounded-[1.35rem] border-2 border-fuchsia-200/70 bg-[linear-gradient(180deg,#b968ff,#8b1fd5_48%,#4a0874)] p-5 text-center">
            <div className="relative z-10 mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl border-2 border-yellow-200/70 bg-yellow-300 text-5xl font-black text-purple-950 shadow-[inset_0_3px_0_rgba(255,255,255,0.55),inset_0_-7px_0_rgba(0,0,0,0.14),0_10px_22px_rgba(0,0,0,0.28)]">
              !
            </div>
            <div className="relative z-10 mb-2 text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]">
              {step.title}
            </div>
            <p className="relative z-10 min-h-[6rem] rounded-2xl border border-white/20 bg-black/18 px-4 py-3 text-base font-black leading-relaxed text-amber-50 shadow-[inset_0_2px_0_rgba(255,255,255,0.1)] drop-shadow-[0_2px_1px_rgba(0,0,0,0.55)]">
              {typedText}
              <span className="ml-0.5 animate-pulse">|</span>
            </p>
            <div className="relative z-10 mt-5 flex items-center justify-between gap-3">
              <button
                onClick={goBack}
                disabled={stepIndex === 0}
                className="rounded-2xl border border-white/25 bg-white/20 px-4 py-3 text-sm font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-4px_0_rgba(0,0,0,0.2)] disabled:opacity-45"
              >
                Back
              </button>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-white/75">
                {stepIndex + 1}/{tutorialSteps.length}
              </div>
              <button
                onClick={goNext}
                className="rounded-2xl border border-yellow-100/70 bg-gradient-to-b from-yellow-200 via-orange-400 to-orange-600 px-6 py-3 text-sm font-black text-white shadow-[inset_0_3px_0_rgba(255,255,255,0.42),inset_0_-5px_0_rgba(0,0,0,0.22),0_10px_20px_rgba(0,0,0,0.34)]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="tutorial-card pointer-events-auto fixed overflow-hidden rounded-2xl border border-cyan-200/45 bg-[linear-gradient(180deg,rgba(88,28,135,0.96),rgba(31,5,55,0.96))] p-4 shadow-2xl" style={bubbleStyle}>
          <div className="relative z-10 text-lg font-black text-cyan-100">{step.title}</div>
          <p className="relative z-10 mt-2 min-h-[4.5rem] text-sm font-bold leading-relaxed text-slate-100">
            {typedText}
            <span className="ml-0.5 animate-pulse">|</span>
          </p>
          <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
            <button
              onClick={goBack}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-slate-100"
            >
              Back
            </button>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/80">
              {stepIndex + 1}/{tutorialSteps.length}
            </div>
            <button
              onClick={goNext}
              className="rounded-xl border border-cyan-100/60 bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-700 px-5 py-2 text-xs font-black text-white shadow-[inset_0_2px_0_rgba(255,255,255,0.38),inset_0_-4px_0_rgba(0,0,0,0.24),0_8px_18px_rgba(0,0,0,0.34)]"
            >
              {isLast ? "Start" : "Next"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const PENDULUM_NARRATION = {
  intro: "/sounds/simple-pendulum/intro.mp3",
  tinasheIntro: "/sounds/simple-pendulum/tinashe_intro.mp3",
  complete: "/sounds/simple-pendulum/experiment_complete.mp3",
  steps: [
    "/sounds/simple-pendulum/step1_setup.mp3",
    "/sounds/simple-pendulum/step2_measure_length.mp3",
    "/sounds/simple-pendulum/step3_swing_and_time.mp3",
    "/sounds/simple-pendulum/step4_find_period.mp3",
    "/sounds/simple-pendulum/step5_change_length.mp3",
    "/sounds/simple-pendulum/step6_find_g.mp3",
  ],
} as const;

const PENDULUM_EXPLANATIONS: readonly NarrationClip[] = [
  { label: "Introduction", src: PENDULUM_NARRATION.intro },
  { label: "Step 1: Set up the pendulum", src: PENDULUM_NARRATION.steps[0] },
  { label: "Step 2: Measure the length", src: PENDULUM_NARRATION.steps[1] },
  { label: "Step 3: Swing it and time it", src: PENDULUM_NARRATION.steps[2] },
  { label: "Step 4: Work out the period", src: PENDULUM_NARRATION.steps[3] },
  { label: "Step 5: Change the length", src: PENDULUM_NARRATION.steps[4] },
  { label: "Step 6: Find g from the graph", src: PENDULUM_NARRATION.steps[5] },
];

export default function PendulumSim({ showPaper, onClosePaper, tutorialRequestKey = 0, onRequestPaper, onRequestHowTo, onBack }: PendulumSimProps) {
  const [lengthM, setLengthM] = useState(0.8);
  const [massKg, setMassKg] = useState(0.15);
  const [gravity, setGravity] = useState(9.8);
  const [damping, setDamping] = useState(0.02);
  const [playing, setPlaying] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  const [thetaDeg, setThetaDeg] = useState(22);
  const [omega, setOmega] = useState(0);
  const [tension, setTension] = useState(0);
  const [slack, setSlack] = useState(false);
  const [settled, setSettled] = useState(false);
  const [finitePeriod, setFinitePeriod] = useState(() =>
    finiteAmplitudePeriod(0.8, 9.8, THREE.MathUtils.degToRad(22))
  );
  const [crossingTick, setCrossingTick] = useState(0);
  const [trail, setTrail] = useState<{ theta: number; omega: number }[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [mobileSheetMode, setMobileSheetMode] = useState<"expanded" | "collapsed">("expanded");
  const [isDraggingBob, setIsDraggingBob] = useState(false);
  const dragStartYRef = useRef<number | null>(null);
  const bobDraggingRef = useRef(false);
  const pendulumAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendulumVolumeRef = useRef(0);
  const validCenterCrossingsRef = useRef(0);

  const params: PendulumParams = { lengthM, massKg, gravity, damping };
  const theoretical = useMemo(() => theoreticalPeriod(lengthM, gravity), [lengthM, gravity]);

  const stopwatch = useStopwatch(crossingTick);

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const handleTick = useCallback(
    (state: SimHandle, _bobWorld: THREE.Vector3, _tautDir: THREE.Vector3) => {
      setThetaDeg(state.thetaDeg);
      setOmega(state.omega);
      setTension(state.tension);
      setSlack(state.slack);
      setSettled(state.settled);
      setFinitePeriod(state.periodEstimate);

      setTrail((prev) => {
        const next = [...prev, { theta: THREE.MathUtils.degToRad(state.thetaDeg), omega: state.omega }];
        return next.length > 260 ? next.slice(next.length - 260) : next;
      });
    },
    []
  );

  const updatePendulumSound = useCallback((angularSpeed: number, shouldSound: boolean) => {
    if (!pendulumAudioRef.current) {
      const pendulumAudio = new Audio("/sounds/pendulum.mp3");
      pendulumAudio.preload = "auto";
      pendulumAudio.loop = true;
      pendulumAudioRef.current = pendulumAudio;
    }

    const speedRatio = THREE.MathUtils.clamp(Math.abs(angularSpeed) / 6, 0, 1);
    const pendulumAudio = pendulumAudioRef.current;
    const targetVolume = shouldSound ? Math.pow(speedRatio, 1.25) * 0.85 : 0;
    pendulumVolumeRef.current = THREE.MathUtils.damp(
      pendulumVolumeRef.current,
      targetVolume,
      targetVolume > pendulumVolumeRef.current ? 10 : 4.5,
      1 / 60
    );

    pendulumAudio.playbackRate = THREE.MathUtils.lerp(0.85, 1.45, speedRatio);
    pendulumAudio.volume = THREE.MathUtils.clamp(pendulumVolumeRef.current, 0, 0.85);

    if (pendulumAudio.volume > 0.015) {
      void pendulumAudio.play().catch(() => undefined);
    } else {
      pendulumAudio.pause();
      pendulumAudio.currentTime = 0;
      pendulumVolumeRef.current = 0;
    }
  }, []);

  const stopPendulumSoundNow = useCallback(() => {
    if (!pendulumAudioRef.current) return;
    pendulumAudioRef.current.pause();
    pendulumAudioRef.current.currentTime = 0;
    pendulumAudioRef.current.volume = 0;
    pendulumVolumeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      stopPendulumSoundNow();
    };
  }, [stopPendulumSoundNow]);

  useEffect(() => {
    if (isDraggingBob) {
      stopPendulumSoundNow();
      return;
    }
    updatePendulumSound(omega, playing && !slack && !settled && Math.abs(omega) > AUDIBLE_OMEGA);
  }, [omega, playing, slack, settled, isDraggingBob, updatePendulumSound, stopPendulumSoundNow]);

  // Count full oscillations only from meaningful center crossings in the same direction.
  const prevSignRef = useRef(1);
  useEffect(() => {
    const sign = Math.sign(thetaDeg) || prevSignRef.current;
    const crossingIsReal =
      !settled &&
      !slack &&
      Math.abs(omega) > COUNT_MIN_OMEGA &&
      Math.abs(thetaDeg) < COUNT_MIN_ANGLE_DEG;

    if (sign !== prevSignRef.current && crossingIsReal) {
      validCenterCrossingsRef.current += 1;
      if (validCenterCrossingsRef.current % 2 === 0) {
        setCrossingTick((t) => t + 1);
      }
    }
    prevSignRef.current = sign;
  }, [thetaDeg, omega, slack, settled]);

  const handleDragRelease = useCallback(() => {
    setIsDraggingBob(false);
    setSettled(false);
    setPlaying(true);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDraggingBob(true);
    stopPendulumSoundNow();
  }, [stopPendulumSoundNow]);

  const handleReset = useCallback(() => {
    setResetKey((k) => k + 1);
    setTrail([]);
    setSettled(false);
    setCrossingTick(0);
    validCenterCrossingsRef.current = 0;
    prevSignRef.current = 1;
    stopPendulumSoundNow();
    stopwatch.reset();
  }, [stopwatch, stopPendulumSoundNow]);

  const handleSheetPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSheetPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null) return;
    const deltaY = event.clientY - dragStartYRef.current;
    dragStartYRef.current = null;
    if (deltaY < -24) setMobileSheetMode("expanded");
    else if (deltaY > 24) setMobileSheetMode("collapsed");
    else setMobileSheetMode(mobileSheetMode === "expanded" ? "collapsed" : "expanded");
  };

  const mobileSheetTransform = {
    expanded: "translate-y-0",
    collapsed: "translate-y-[calc(100%-76px)]",
  }[mobileSheetMode];

  const autoPeriod = periodFromAutomaticCrossings(stopwatch.autoLaps);
  const manualPeriod = periodFromLaps(stopwatch.manualLaps);

  // --- Doing Mode: free-roam + walk-up interactions --------------------
  const [mode, setMode] = useState<"learning" | "doing">("learning");

  const narrator = useExperimentNarrator();
  const [guideActive, setGuideActive] = useState(false);
  const narrationPlayback = useNarrationPlayback(narrator, PENDULUM_NARRATION_TRACKS);
  // Actions the walkthrough stages inside a step run on the narrator's own
  // clock, so they land on the words that describe them and stop when it does.
  const cueRunner = useNarrationCueRunner(narrator);
  const clearDemoTimers = cueRunner.clear;

  /**
   * World points the narration hand and the on-screen ruler attach to. The
   * length measure runs pivot → `bobRest`, which is the middle of the bob at
   * the bottom of the swing — exactly the measurement the narrator insists on,
   * and `bobTop` is there so the "not to the top of the bob" line can show the
   * wrong one first.
   */
  const sceneAnchorsRef = useRef<Record<string, THREE.Vector3>>({});
  const sceneAnchorPointsRef = useRef<SceneAnchorPoints>({});
  const anchorLength = Math.max(lengthM, 0.05) * WORLD_SCALE;
  const anchorTheta = THREE.MathUtils.degToRad(thetaDeg);
  sceneAnchorsRef.current = {
    pivot: new THREE.Vector3(0, PIVOT_Y, 0),
    bob: new THREE.Vector3(Math.sin(anchorTheta) * anchorLength, PIVOT_Y - Math.cos(anchorTheta) * anchorLength, 0),
    bobRest: new THREE.Vector3(0, PIVOT_Y - anchorLength, 0),
    bobTop: new THREE.Vector3(0, PIVOT_Y - anchorLength + bobRadiusForMass(massKg), 0),
    string: new THREE.Vector3(0, PIVOT_Y - anchorLength / 2, 0),
  };

  /*
   * Step budgets and the timing of every action inside a step come from the
   * caption tracks, which were measured off the recordings themselves (see
   * `scripts/generate_narration_captions.mjs`). Re-recording a clip retimes the
   * scene with it.
   */
  const track = (src: string) => PENDULUM_NARRATION_TRACKS[src];
  const stepDuration = (index: number, fallbackMs: number) =>
    trackDurationMs(track(PENDULUM_NARRATION.steps[index]), fallbackMs);
  const stepCue = (index: number, phrase: string, fallbackMs: number) =>
    cueTimeMs(track(PENDULUM_NARRATION.steps[index]), phrase, fallbackMs);

  const walkthroughSteps: WalkthroughStep[] = [
    {
      label: "Set up the pendulum",
      src: PENDULUM_NARRATION.steps[0],
      durationMs: stepDuration(0, 18100),
      onEnter: () => {
        clearDemoTimers();
        setPlaying(false);
        setGravity(9.8);
        setDamping(0.02);
        setMassKg(0.15);
        setLengthM(0.8);
        handleReset();
      },
    },
    {
      label: "Measure the length",
      src: PENDULUM_NARRATION.steps[1],
      durationMs: stepDuration(1, 30800),
      onEnter: () => {
        cueRunner.schedule([
          { atMs: stepCue(1, "a short string", 20000), run: () => setLengthM(0.6) },
          { atMs: stepCue(1, "and a long string", 23000), run: () => setLengthM(1) },
          { atMs: stepCue(1, "eighty centimetres", 26000), run: () => setLengthM(0.8) },
        ]);
      },
    },
    {
      label: "Swing it and time it",
      src: PENDULUM_NARRATION.steps[2],
      durationMs: stepDuration(2, 34000),
      onEnter: () => {
        setThetaDeg(20);
        setSettled(false);
        setPlaying(true);
        cueRunner.schedule([{ atMs: stepCue(2, "start the stopwatch", 14000), run: () => stopwatch.start() }]);
      },
    },
    {
      label: "Work out the period",
      src: PENDULUM_NARRATION.steps[3],
      durationMs: stepDuration(3, 28100),
      onEnter: () => {
        cueRunner.schedule([{ atMs: stepCue(3, "stop the stopwatch", 1500), run: () => stopwatch.stop() }]);
      },
    },
    {
      label: "Change the length",
      src: PENDULUM_NARRATION.steps[4],
      durationMs: stepDuration(4, 28600),
      onEnter: () => {
        cueRunner.schedule([
          {
            atMs: stepCue(4, "a short pendulum", 3000),
            run: () => {
              setLengthM(0.4);
              setThetaDeg(20);
              setSettled(false);
              setPlaying(true);
            },
          },
          {
            atMs: stepCue(4, "now a long one", 13000),
            run: () => {
              setLengthM(1.2);
              setThetaDeg(20);
              setSettled(false);
            },
          },
        ]);
      },
    },
    {
      label: "Find g from the graph",
      src: PENDULUM_NARRATION.steps[5],
      durationMs: stepDuration(5, 35700),
      onEnter: () => {
        cueRunner.schedule([{ atMs: stepCue(5, "now make your graph", 1500), run: () => setLengthM(0.8) }]);
      },
    },
  ];

  const walkthrough = useNarratedWalkthrough({
    narrator,
    intro: PENDULUM_NARRATION.intro,
    complete: PENDULUM_NARRATION.complete,
    steps: walkthroughSteps,
    onStart: () => {
      clearDemoTimers();
      setGuideActive(false);
      setMode("learning");
      setShowTutorial(false);
    },
    onStop: () => {
      clearDemoTimers();
      stopwatch.reset();
      setLengthM(0.8);
      setPlaying(false);
      handleReset();
    },
    onComplete: () => {
      clearDemoTimers();
      onRequestPaper?.();
    },
  });

  const toggleGuide = useCallback(() => {
    if (walkthrough.active) return;
    if (guideActive) {
      setGuideActive(false);
      narrator.stop();
      return;
    }
    setGuideActive(true);
    setMode("doing");
    narrator.play(PENDULUM_NARRATION.tinasheIntro);
  }, [guideActive, narrator.play, narrator.stop, walkthrough.active]);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [activeInteractableMeta, setActiveInteractableMeta] = useState<{ id: string; label: string; hold: boolean } | null>(null);
  const activeInteractableRef = useRef<Interactable | null>(null);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const [releaseSignal, setReleaseSignal] = useState(0);

  useEffect(() => {
    const widthQuery = window.matchMedia(
      "(max-width: 639px), (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse)"
    );
    const updateWidth = () => setIsMobileViewport(widthQuery.matches);
    updateWidth();
    widthQuery.addEventListener("change", updateWidth);
    return () => widthQuery.removeEventListener("change", updateWidth);
  }, []);

  useEffect(() => {
    const orientationQuery = window.matchMedia("(orientation: portrait)");
    const updateOrientation = () => setIsPortrait(orientationQuery.matches);
    updateOrientation();
    orientationQuery.addEventListener("change", updateOrientation);
    return () => orientationQuery.removeEventListener("change", updateOrientation);
  }, []);

  const handleTargetChange = useCallback((target: Interactable | null) => {
    activeInteractableRef.current = target;
    setActiveInteractableMeta((prev) => {
      if (!target) return prev === null ? prev : null;
      if (prev && prev.id === target.id) return prev;
      return { id: target.id, label: target.label, hold: !!target.hold };
    });
  }, []);

  const handleJoystickChange = useCallback((vector: { x: number; y: number }) => {
    moveVectorRef.current = vector;
  }, []);

  const handleInteractionPress = useCallback(() => {
    activeInteractableRef.current?.onActivate();
  }, []);

  const handleInteractionRelease = useCallback(() => {
    activeInteractableRef.current?.onRelease?.();
  }, []);

  useEffect(() => {
    if (mode !== "doing" || isMobileViewport) return;
    const down = (e: KeyboardEvent) => {
      if (e.code !== "KeyE" && e.code !== "Space") return;
      activeInteractableRef.current?.onActivate();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code !== "KeyE" && e.code !== "Space") return;
      activeInteractableRef.current?.onRelease?.();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [mode, isMobileViewport]);

  useEffect(() => {
    if (mode !== "doing") {
      activeInteractableRef.current = null;
      setActiveInteractableMeta(null);
      moveVectorRef.current = { x: 0, y: 0 };
    }
  }, [mode]);

  const LENGTH_CYCLE_M = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.5];
  const MASS_CYCLE_KG = [0.02, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
  const DAMPING_CYCLE = [0, 0.02, 0.04, 0.06, 0.08, 0.1];

  // Doing Mode's world-space stations: the exact same handlers/state setters
  // the guided controls already call, just reached by walking up and
  // pressing/holding instead of tapping a panel — no second source of truth.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const list: Interactable[] = [];

    list.push({
      id: "release-bob",
      position: BOB_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Release from ${DOING_RELEASE_ANGLE_DEG}°`,
      onActivate: () => setReleaseSignal((s) => s + 1),
    });

    const gravityIndex = GRAVITY_PRESETS.findIndex((p) => Math.abs(p.value - gravity) < 0.01);
    const nextGravity = GRAVITY_PRESETS[(Math.max(0, gravityIndex) + 1) % GRAVITY_PRESETS.length];
    list.push({
      id: "gravity-cycle",
      position: GRAVITY_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle gravity (next: ${nextGravity.label})`,
      onActivate: () => setGravity(nextGravity.value),
    });

    const lengthIndex = LENGTH_CYCLE_M.findIndex((l) => Math.abs(l - lengthM) < 0.005);
    const nextLength = LENGTH_CYCLE_M[(Math.max(0, lengthIndex) + 1) % LENGTH_CYCLE_M.length];
    list.push({
      id: "length-cycle",
      position: LENGTH_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle length (next: ${nextLength.toFixed(2)} m)`,
      onActivate: () => setLengthM(nextLength),
    });

    const massIndex = MASS_CYCLE_KG.findIndex((m) => Math.abs(m - massKg) < 0.005);
    const nextMass = MASS_CYCLE_KG[(Math.max(0, massIndex) + 1) % MASS_CYCLE_KG.length];
    list.push({
      id: "mass-cycle",
      position: MASS_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle mass (next: ${(nextMass * 1000).toFixed(0)} g)`,
      onActivate: () => setMassKg(nextMass),
    });

    const dampingIndex = DAMPING_CYCLE.findIndex((d) => Math.abs(d - damping) < 0.001);
    const nextDamping = DAMPING_CYCLE[(Math.max(0, dampingIndex) + 1) % DAMPING_CYCLE.length];
    list.push({
      id: "damping-cycle",
      position: DAMPING_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle damping (next: ${nextDamping.toFixed(2)})`,
      onActivate: () => setDamping(nextDamping),
    });

    list.push({
      id: "play-toggle",
      position: PLAY_RESET_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: playing ? "Pause" : "Resume",
      onActivate: () => setPlaying((p) => !p),
    });

    list.push({
      id: "reset-pendulum",
      position: PLAY_RESET_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: "Reset",
      onActivate: handleReset,
    });

    list.push({
      id: "timer-toggle",
      position: TIMER_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: stopwatch.running ? "Stop timer" : "Start timer",
      onActivate: stopwatch.running ? stopwatch.stop : stopwatch.start,
    });

    list.push({
      id: "timer-lap",
      position: TIMER_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: "Record lap",
      disabled: !stopwatch.running,
      onActivate: stopwatch.recordManualLap,
    });

    return list;
  }, [mode, gravity, lengthM, massKg, damping, playing, handleReset, stopwatch]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col sm:flex-row">
      <style>{`
        @keyframes futuristicSliderSweep {
          0% { background-position: 0% 50%; filter: brightness(1); }
          50% { background-position: 100% 50%; filter: brightness(1.18); }
          100% { background-position: 0% 50%; filter: brightness(1); }
        }
        @keyframes pendulumHudIn {
          0% { opacity: 0; transform: translateY(-12px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pendulumHudGlow {
          0%, 100% { opacity: 0.38; transform: translateX(-20%); }
          50% { opacity: 0.9; transform: translateX(20%); }
        }
        .futuristic-fill { background-size: 220% 100%; animation: futuristicSliderSweep 2.2s ease-in-out infinite; }
        .futuristic-range::-webkit-slider-runnable-track { height: 32px; background: transparent; }
        .futuristic-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: 5px;
          border-radius: 9999px;
          border: 3px solid rgb(15 23 42);
          background: radial-gradient(circle at 35% 35%, #ffffff, #fbbf24 38%, #f97316 72%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.35), 0 0 18px rgba(251,146,60,0.9), 0 0 34px rgba(45,212,191,0.35);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .futuristic-range:hover::-webkit-slider-thumb {
          transform: scale(1.14);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.6), 0 0 24px rgba(251,146,60,1), 0 0 42px rgba(45,212,191,0.55);
        }
        .futuristic-range::-moz-range-track { height: 32px; background: transparent; }
        .futuristic-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          border: 3px solid rgb(15 23 42);
          background: #f97316;
          box-shadow: 0 0 18px rgba(251,146,60,0.9), 0 0 34px rgba(45,212,191,0.35);
        }
        .pendulum-desktop-game-panel {
          background:
            linear-gradient(180deg, rgba(76,18,110,0.94), rgba(18,3,31,0.96)),
            radial-gradient(circle at 18% 0%, rgba(34,211,238,0.12), transparent 32%);
          box-shadow:
            inset 0 3px 0 rgba(255,255,255,0.14),
            inset 0 -14px 28px rgba(0,0,0,0.28),
            -18px 0 44px rgba(0,0,0,0.46),
            0 0 34px rgba(168,85,247,0.2);
        }
        .pendulum-desktop-game-panel button {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow:
            inset 0 2px 0 rgba(255,255,255,0.18),
            inset 0 -5px 0 rgba(0,0,0,0.22),
            0 8px 18px rgba(0,0,0,0.28);
        }
        .pendulum-desktop-game-panel button::before {
          content: "";
          position: absolute;
          inset: 4px 10px auto 10px;
          height: 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.18);
          pointer-events: none;
        }
        .pendulum-desktop-game-panel .desktop-game-card {
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(15,23,42,0.32);
          box-shadow: inset 0 2px 0 rgba(255,255,255,0.08), inset 0 -5px 0 rgba(0,0,0,0.18);
        }
      `}</style>
      <div data-pendulum-tour="scene" className="relative h-full w-full shrink-0 sm:flex-1">
        <Canvas shadows={{ type: THREE.PCFShadowMap }} dpr={[1, 1.5]} camera={{ position: [0, 0.55, 8.9], fov: 50 }} className="w-full h-full">
          <Scene
            params={params}
            resetKey={resetKey}
            playing={playing}
            onTick={handleTick}
            draggingRef={bobDraggingRef}
            onDragRelease={handleDragRelease}
            onDragStart={handleDragStart}
            releaseSignal={releaseSignal}
            mode={mode}
            isMobile={isMobileViewport}
            interactables={interactables}
            activeTargetId={activeInteractableMeta?.id ?? null}
            moveVectorRef={moveVectorRef}
            onTargetChange={handleTargetChange}
          />
          <NarrationSceneAnchors anchorsRef={sceneAnchorsRef} pointsRef={sceneAnchorPointsRef} />
        </Canvas>

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={setMode}
          contextLabel="Simple Pendulum"
        />

        <ExperimentNarrationDock
          narrator={narrator}
          clips={PENDULUM_EXPLANATIONS}
          walkthrough={walkthrough}
          guideActive={guideActive}
          onToggleGuide={toggleGuide}
          showMeLabel="Watch the narrated pendulum experiment run by itself"
          menuLabel="Simple pendulum explanations"
        />
        <WalkthroughStatusPill walkthrough={walkthrough} />

        <HeaderModeToggle mode={mode} onChange={setMode} />

        {mode === "doing" && (
          <>
            {!isMobileViewport && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
                {activeInteractableMeta && (
                  <div className="absolute top-[58%] rounded-full border border-white/20 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur">
                    Press <span className="text-orange-300">E</span> to {activeInteractableMeta.label.toLowerCase()}
                  </div>
                )}
                <div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
                  WASD/arrows to move · mouse to look · click to lock cursor
                </div>
              </div>
            )}

            {isMobileViewport && (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-end justify-between px-4">
                <VirtualJoystick onChange={handleJoystickChange} />
                <div className="pointer-events-auto flex flex-col items-center gap-1">
                  {activeInteractableMeta && (
                    <button
                      type="button"
                      onPointerDown={handleInteractionPress}
                      onPointerUp={handleInteractionRelease}
                      onPointerLeave={handleInteractionRelease}
                      onPointerCancel={handleInteractionRelease}
                      className="flex h-20 w-20 select-none flex-col items-center justify-center rounded-full border-2 border-white/50 bg-gradient-to-b from-orange-300 via-orange-500 to-orange-700 text-center text-white shadow-[0_10px_26px_rgba(0,0,0,0.45)] active:translate-y-0.5"
                    >
                      <span className="text-xl leading-none">{activeInteractableMeta.hold ? "✊" : "👆"}</span>
                      <span className="mt-1 max-w-[70px] truncate text-[9px] font-black uppercase leading-tight">{activeInteractableMeta.label}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {isMobileViewport && isPortrait && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-slate-950/95 px-6 text-center text-white">
                <div className="text-4xl">📱↻</div>
                <div className="text-sm font-black uppercase tracking-wide">Rotate your device</div>
                <p className="max-w-xs text-xs text-slate-300">Doing Mode plays best in landscape so you have room for the joystick and action button.</p>
              </div>
            )}
          </>
        )}

        {/* Live readout overlay on canvas */}
        <div data-pendulum-tour="hud" className="absolute inset-x-2 top-14 z-10 overflow-hidden rounded-2xl border border-fuchsia-200/20 bg-[linear-gradient(180deg,rgba(76,18,110,0.9),rgba(18,3,31,0.86))] p-2 text-slate-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.16),inset_0_-8px_18px_rgba(0,0,0,0.32),0_14px_34px_rgba(0,0,0,0.48),0_0_24px_rgba(168,85,247,0.28)] backdrop-blur-xl sm:hidden [animation:pendulumHudIn_240ms_ease-out_both]">
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent [animation:pendulumHudGlow_2.2s_ease-in-out_infinite]" />
          <div className="grid grid-cols-3 gap-1.5">
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/24 px-2 py-2 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.12),inset_0_-4px_0_rgba(0,0,0,0.22)]">
              <div className="text-base font-black leading-none text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.72)]">{thetaDeg.toFixed(1)}°</div>
              <div className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Angle</div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/24 px-2 py-2 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.12),inset_0_-4px_0_rgba(0,0,0,0.22)]">
              <div className="text-base font-black leading-none text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.72)]">{tension.toFixed(2)} N</div>
              <div className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Tension</div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/24 px-2 py-2 text-center shadow-[inset_0_2px_0_rgba(255,255,255,0.12),inset_0_-4px_0_rgba(0,0,0,0.22)]">
              <div className="text-base font-black leading-none text-orange-300 drop-shadow-[0_0_10px_rgba(253,186,116,0.72)]">{stopwatch.elapsed.toFixed(2)}s</div>
              <div className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Timer</div>
            </div>
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-center text-[10px] font-bold">
            <div className="rounded-lg border border-white/10 bg-black/18 px-2 py-1 text-fuchsia-200">θ {thetaDeg.toFixed(1)}°</div>
            <div className="rounded-lg border border-white/10 bg-black/18 px-2 py-1 text-fuchsia-200">ω {omega.toFixed(2)} rad/s</div>
            {slack && <div className="col-span-2 rounded-lg border border-red-300/30 bg-red-500/15 px-2 py-1 text-red-200">String slack</div>}
          </div>
        </div>

        <div data-pendulum-tour="hud" className="absolute left-3 top-3 z-10 hidden rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 shadow-2xl backdrop-blur sm:block">
          <div className="grid grid-cols-[auto_auto] gap-x-3 gap-y-1">
            <span className="text-slate-400">θ</span>
            <span className="font-bold text-purple-300">{thetaDeg.toFixed(1)}°</span>
            <span className="text-slate-400">ω</span>
            <span className="font-bold text-purple-300">{omega.toFixed(2)} rad/s</span>
            {slack && <span className="col-span-2 text-red-400 font-bold">String slack</span>}
          </div>
        </div>

        {/* Large captions along the bottom, plus the pointing hand and the ruler. */}
        <NarrationCaptionBar
          playback={narrationPlayback}
          className={`pointer-events-none absolute inset-x-0 z-40 flex justify-center px-2 sm:px-4 sm:pb-4 ${
            // Doing Mode puts the joystick and the action button along the
            // bottom on phones, so lift the captions clear of them.
            mode === "doing" ? "bottom-28 sm:bottom-0" : "bottom-0 pb-2"
          }`}
        />
        <NarrationMeasureOverlay playback={narrationPlayback} sceneAnchorsRef={sceneAnchorPointsRef} />
        <NarrationPointerHand playback={narrationPlayback} sceneAnchorsRef={sceneAnchorPointsRef} />
      </div>

      {/* Control panel: right section matching projectile style */}
      <div
        data-pendulum-tour="controls"
        className={`experiment-desktop-panel experiment-violet-panel pendulum-desktop-game-panel overflow-hidden text-slate-100 ring-1 ring-white/12 backdrop-blur-2xl sm:relative sm:z-20 sm:h-full sm:w-[34%] sm:min-w-[340px] sm:max-w-[440px] sm:border-l sm:border-white/10 ${
          mode === "doing" ? "hidden" : "hidden sm:block"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-orange-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="relative h-full overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black tracking-tight">Controls</h2>
              <p className="text-xs font-medium text-slate-400">Simple Pendulum</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 -mt-2">
            Drag the bob to set the release angle. Length is pivot-to-centre; the motion uses the
            nonlinear pendulum equation with a viscous damping torque.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {GRAVITY_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setGravity(p.value)}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300 ${
                  Math.abs(gravity - p.value) < 0.05
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30"
                    : "bg-white/6 text-slate-200 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-white/10 hover:ring-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <FuturisticSlider
            id="length"
            label="String length (L)"
            value={lengthM}
            displayValue={`${lengthM.toFixed(2)} m`}
            min={0.2}
            max={1.5}
            step={0.01}
            onChange={setLengthM}
          />

          <FuturisticSlider
            id="mass"
            label="Bob mass (m)"
            value={massKg}
            displayValue={`${(massKg * 1000).toFixed(0)} g`}
            min={0.02}
            max={0.6}
            step={0.01}
            onChange={setMassKg}
          />

          <FuturisticSlider
            id="damping"
            label="Damping (c)"
            value={damping}
            displayValue={damping.toFixed(3)}
            min={0}
            max={0.1}
            step={0.002}
            onChange={setDamping}
          />

          <div className="flex gap-2">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex-1 rounded-2xl bg-orange-500 py-3 font-black text-white shadow-lg shadow-orange-950/35 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400"
            >
              {playing ? "Pause" : "Resume"}
            </button>
            <button
              onClick={handleReset}
              className="rounded-2xl bg-white/8 px-5 py-3 font-black text-slate-100 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:ring-white/20"
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs text-slate-400">
            <div className="desktop-game-card px-2 py-3">
              <div className="text-base font-black text-emerald-200">{thetaDeg.toFixed(1)}°</div>
              <div>Angle</div>
            </div>
            <div className="desktop-game-card px-2 py-3">
              <div className="text-base font-black text-emerald-200">{tension.toFixed(2)} N</div>
              <div>Tension</div>
            </div>
            <div className="desktop-game-card px-2 py-3">
              <div className="text-base font-black text-emerald-200">{theoretical.toFixed(3)} s</div>
              <div>T₀ (small-angle)</div>
            </div>
            <div className="desktop-game-card px-2 py-3">
              <div className="text-base font-black text-orange-200">{finitePeriod.toFixed(3)} s</div>
              <div>Finite-angle prediction</div>
            </div>
          </div>

          <div className="desktop-game-card p-3 text-[11px] leading-relaxed text-slate-300">
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 font-bold">
              <span className="text-red-300">● Weight, mg</span>
              <span className="text-indigo-300">● Tension</span>
              <span className="text-green-300">● Tangential restoring force</span>
            </div>
            Changing mass leaves the ideal period unchanged. With the same damping torque, a heavier bob loses
            amplitude more slowly because its rotational inertia is larger.
          </div>

          <div className="desktop-game-card p-3">
            <div className="text-sm font-semibold text-slate-200 mb-2">Phase space (ω vs θ)</div>
            <PhaseSpacePlot trail={trail} />
          </div>

          {/* Stopwatch: manual reaction-time laps vs automatic laser-gate laps */}
          <div data-experiment-tour="pendulum-stopwatch" className="desktop-game-card p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-base font-semibold text-slate-200">Stopwatch — timing 20 oscillations</div>
              <div className="font-mono text-orange-200 font-black">{stopwatch.elapsed.toFixed(2)}s</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={stopwatch.running ? stopwatch.stop : stopwatch.start}
                className="flex-1 rounded-xl bg-orange-500 py-2 text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400"
              >
                {stopwatch.running ? "Stop" : "Start"}
              </button>
              <button
                onClick={stopwatch.recordManualLap}
                disabled={!stopwatch.running}
                className="flex-1 rounded-xl bg-emerald-500 py-2 text-xs font-black text-slate-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 disabled:translate-y-0 disabled:bg-slate-800 disabled:text-slate-500"
              >
                Manual lap
              </button>
              <button
                onClick={stopwatch.reset}
                className="rounded-xl bg-white/8 px-3 py-2 text-xs font-black text-slate-100 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-xl border border-white/10 bg-white/[0.045] p-2">
                <div className="text-slate-400">Auto (laser-gate)</div>
                <div className="font-bold text-emerald-200">{Math.max(0, stopwatch.autoLaps.length - 1)} complete intervals</div>
                <div className="text-slate-400">
                  T ≈ {autoPeriod ? autoPeriod.toFixed(3) : "—"} s
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.045] p-2">
                <div className="text-slate-400">Manual (reaction time)</div>
                <div className="font-bold text-emerald-200">{stopwatch.manualLaps.length} osc.</div>
                <div className="text-slate-400">
                  T ≈ {manualPeriod ? manualPeriod.toFixed(3) : "—"} s
                </div>
              </div>
            </div>

            {(stopwatch.autoLaps.length > 0 || stopwatch.manualLaps.length > 0) && (
              <div className="max-h-28 overflow-y-auto text-[10px] font-mono text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                {stopwatch.manualLaps.map((t, i) => (
                  <div key={i} className="flex justify-between">
                    <span>manual lap {i + 1}</span>
                    <span>{t.toFixed(2)}s</span>
                  </div>
                ))}
              </div>
            )}
            <div className="text-[10px] text-slate-500">
              Compare the manual column's variance against the automatic column — this is exactly
              why the ZIMSEC method asks you to time 20 oscillations rather than 1.
            </div>
          </div>
        </div>
      </div>
      {mode === "learning" && (
      <MobileExperimentControls
        actions={[
          {
            id: "play",
            label: playing ? "Pause" : "Resume",
            onClick: () => setPlaying((p) => !p),
            tone: "orange",
          },
          {
            id: "reset",
            label: "Reset",
            onClick: handleReset,
            tone: "dark",
          },
          {
            id: "timer",
            label: stopwatch.running ? "Stop" : "Start",
            onClick: stopwatch.running ? stopwatch.stop : stopwatch.start,
            tone: stopwatch.running ? "red" : "green",
          },
          {
            id: "lap",
            label: "Lap",
            onClick: stopwatch.recordManualLap,
            disabled: !stopwatch.running,
            tone: "blue",
          },
        ]}
        panels={[
          {
            id: "gravity",
            label: "Gravity",
            value: `${gravity.toFixed(1)} m/s²`,
            content: (
              <div className="grid grid-cols-3 gap-2">
                {GRAVITY_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setGravity(p.value)}
                    className={`rounded-xl px-3 py-2 text-sm font-bold transition-all duration-300 ${
                      Math.abs(gravity - p.value) < 0.05
                        ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30"
                        : "bg-white/6 text-slate-200 ring-1 ring-white/10"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            ),
          },
          {
            id: "length",
            label: "Length",
            value: `${lengthM.toFixed(2)} m`,
            content: (
              <FuturisticSlider
                id="mobile-length"
                label="String length (L)"
                value={lengthM}
                displayValue={`${lengthM.toFixed(2)} m`}
                min={0.2}
                max={1.5}
                step={0.01}
                onChange={setLengthM}
              />
            ),
          },
          {
            id: "mass",
            label: "Mass",
            value: `${(massKg * 1000).toFixed(0)} g`,
            content: (
              <FuturisticSlider
                id="mobile-pendulum-mass"
                label="Bob mass (m)"
                value={massKg}
                displayValue={`${(massKg * 1000).toFixed(0)} g`}
                min={0.02}
                max={0.6}
                step={0.01}
                onChange={setMassKg}
              />
            ),
          },
          {
            id: "damping",
            label: "Damping",
            value: damping.toFixed(3),
            content: (
              <FuturisticSlider
                id="mobile-pendulum-damping"
                label="Damping (c)"
                value={damping}
                displayValue={damping.toFixed(3)}
                min={0}
                max={0.1}
                step={0.002}
                onChange={setDamping}
              />
            ),
          },
        ]}
      />
      )}
      {showPaper && (
        <PendulumPaper
          lengthM={lengthM}
          massKg={massKg}
          gravity={gravity}
          damping={damping}
          thetaDeg={thetaDeg}
          omega={omega}
          tension={tension}
          theoretical={theoretical}
          finitePeriod={finitePeriod}
          autoPeriod={autoPeriod}
          manualPeriod={manualPeriod}
          autoLaps={stopwatch.autoLaps}
          manualLaps={stopwatch.manualLaps}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && <PendulumTutorialOverlay key={tutorialRequestKey} onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
