"use client";

import { BlenderLabEnvironment, BlenderLabBench, blenderLabObstacles } from "../../common/BlenderLabEnvironment";

import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { HeaderModeToggle } from "../../common/CombinedScienceGame";
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import { VirtualJoystick } from "../../common/VirtualJoystick";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";


const BLENDER_LAB_LAYOUT = { width: 18, depth: 18, height: 8.4, floorY: -1.22, centerZ: 1, worktopY: -0.5875 };
interface TerminalVelocitySimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

interface FluidSpec {
  id: string;
  name: string;
  density: number;
  viscosity: number;
  color: string;
  surface: string;
}

interface SphereSpec {
  id: string;
  name: string;
  density: number;
  color: string;
  metalness: number;
  roughness: number;
}

interface Telemetry {
  time: number;
  distance: number;
  velocity: number;
  acceleration: number;
  reynolds: number;
  drag: number;
  buoyancy: number;
  gateOneTime: number | null;
  gateTwoTime: number | null;
  terminalReachedAt: number | null;
}

interface Trial {
  id: number;
  fluid: string;
  sphere: string;
  radiusMm: number;
  terminalVelocity: number;
  measuredVelocity: number;
  reynolds: number;
  regime: string;
}

const FLUIDS: FluidSpec[] = [
  { id: "water", name: "Water", density: 998, viscosity: 0.001, color: "#75d6ed", surface: "#ddfbff" },
  { id: "oil", name: "Vegetable oil", density: 910, viscosity: 0.065, color: "#d7b84c", surface: "#fff3ad" },
  { id: "glycerin", name: "Glycerin", density: 1260, viscosity: 0.95, color: "#b7d9d7", surface: "#f0ffff" },
];

const SPHERES: SphereSpec[] = [
  { id: "steel", name: "Steel ball", density: 7850, color: "#aeb9c4", metalness: 0.9, roughness: 0.2 },
  { id: "glass", name: "Glass ball", density: 2500, color: "#dff8ff", metalness: 0.05, roughness: 0.04 },
  { id: "aluminium", name: "Aluminium ball", density: 2700, color: "#d8dde2", metalness: 0.78, roughness: 0.3 },
];

const DROP_DISTANCE_M = 1.35;
const GATE_ONE_M = 0.3;
const GATE_TWO_M = 1.05;
const TUBE_RADIUS_M = 0.075;
const FLUID_TOP_Y = 2.58;
const FLUID_BOTTOM_Y = -0.42;
const VISUAL_DROP = FLUID_TOP_Y - FLUID_BOTTOM_Y;

// Doing Mode: the player walks freely around the lab floor. The big central
// bench (which the falling-ball apparatus stands on) is a solid obstacle, so
// reaching the apparatus, the fluid rack, and the sphere tray means walking
// around it rather than through it — same idea as the other Doing Mode labs.
const PLAYER_BOUNDS: PlayerBounds = { minX: -8.3, maxX: 8.3, minZ: -6.4, maxZ: 8.4 };
const BENCH_OBSTACLES: PlayerBounds[] = [{ minX: -4.9, maxX: 4.9, minZ: -1.9, maxZ: 2.5 }, ...blenderLabObstacles(BLENDER_LAB_LAYOUT)];
const PLAYER_SPAWN = new THREE.Vector3(0, 0, 6);
const INTERACTION_RADIUS = 3.8;

// World-space stations for Doing Mode's walk-up-and-press interactions. Each
// one is purely a physical stand-in for a control that already exists in the
// guided panel — pressing E on it calls the exact same setter/handler.
const FLUID_STATION_POS = new THREE.Vector3(3.65, 0.15, 0.18);
const SPHERE_STATION_POS = new THREE.Vector3(-2.55, 0.1, 0.55);
const RADIUS_DIAL_POS = new THREE.Vector3(1.35, 1.1, 0.35);
const GRAVITY_DIAL_POS = new THREE.Vector3(-1.42, 1.3, -0.18);
const RELEASE_STATION_POS = new THREE.Vector3(0, 2.35, 0.32);
const RECORD_STATION_POS = new THREE.Vector3(0, -0.2, 0.9);

const RADIUS_STEPS_MM = [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7];
const GRAVITY_PRESETS = [1.62, 3.71, 9.81, 14];

const emptyTelemetry = (): Telemetry => ({
  time: 0,
  distance: 0,
  velocity: 0,
  acceleration: 0,
  reynolds: 0,
  drag: 0,
  buoyancy: 0,
  gateOneTime: null,
  gateTwoTime: null,
  terminalReachedAt: null,
});

const clamp = (value: number, minimum: number, maximum: number) => Math.min(maximum, Math.max(minimum, value));

const formatForceNewtons = (value: number) => {
  const magnitude = Math.abs(value);
  if (magnitude >= 1) return value.toFixed(2);
  if (magnitude >= 0.01) return value.toFixed(3);
  if (magnitude >= 0.001) return value.toFixed(4);
  return value.toExponential(2);
};

function dragCoefficient(reynolds: number) {
  if (reynolds <= 1e-8) return 0;
  return 24 / reynolds * (1 + 0.15 * Math.pow(reynolds, 0.687)) + 0.42 / (1 + 42500 / Math.pow(reynolds, 1.16));
}

function sphereForces(fluid: FluidSpec, sphere: SphereSpec, radiusMm: number, gravity: number, velocity: number) {
  const radius = radiusMm / 1000;
  const volume = 4 / 3 * Math.PI * radius ** 3;
  const area = Math.PI * radius ** 2;
  const mass = sphere.density * volume;
  const reynolds = 2 * radius * fluid.density * Math.abs(velocity) / fluid.viscosity;
  const coefficient = dragCoefficient(reynolds);
  const radiusRatio = radius / TUBE_RADIUS_M;
  const freeVelocityRatio = clamp(
    1 - 2.1044 * radiusRatio + 2.0888 * radiusRatio ** 3 - 0.948 * radiusRatio ** 5,
    0.35,
    1,
  );
  const wallDragMultiplier = 1 / freeVelocityRatio;
  const drag = velocity === 0
    ? 0
    : 0.5 * fluid.density * coefficient * area * velocity * Math.abs(velocity) * wallDragMultiplier;
  const buoyancy = fluid.density * volume * gravity;
  const weight = mass * gravity;
  const acceleration = (weight - buoyancy - drag) / mass;
  return { acceleration, reynolds, drag: Math.abs(drag), buoyancy, weight };
}

function terminalVelocity(fluid: FluidSpec, sphere: SphereSpec, radiusMm: number, gravity: number) {
  if (sphere.density <= fluid.density) return 0;
  let low = 0;
  let high = 0.25;
  while (sphereForces(fluid, sphere, radiusMm, gravity, high).acceleration > 0 && high < 80) high *= 2;
  for (let index = 0; index < 72; index += 1) {
    const middle = (low + high) / 2;
    if (sphereForces(fluid, sphere, radiusMm, gravity, middle).acceleration > 0) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}

function flowRegime(reynolds: number) {
  if (reynolds < 1) return "Stokes / laminar";
  if (reynolds < 1000) return "Transitional";
  return "Inertial / turbulent wake";
}

const terminalTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Terminal Velocity & Motion in Fluids",
    text: "Investigate how sphere size, material, fluid density, and viscosity change acceleration, drag, and terminal speed.",
    mode: "modal",
  },
  {
    title: "Real force model",
    text: "The released sphere is driven by weight, opposed by buoyancy and Reynolds-number-dependent drag. Terminal velocity is reached when the resultant force approaches zero.",
    mode: "modal",
  },
  {
    title: "Falling-ball apparatus",
    text: "The release head holds the sphere above the fluid. The ruler and two optical gates measure its motion without touching it.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="terminal-scene"]',
    sceneBox: { x: 0.22, y: 0.08, w: 0.58, h: 0.82 },
  },
  {
    title: "Controls and observations",
    text: "Choose the fluid and sphere, set the radius and gravity, release the ball, and compare measured speed with the predicted terminal speed.",
    mode: "bubble",
    selector: '[data-experiment-tour="terminal-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Experiment paper",
    text: "Record several trials, then open Paper to download your method, results, force analysis, and conclusion.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

const terminalHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Terminal Velocity",
    text: "Run one guided falling-ball trial, read the timing gates, record it, and open the paper.",
    mode: "modal",
  },
  {
    title: "Step 1: Configure",
    text: "Open Setup and choose a sphere and fluid. Glycerin gives a slow, clearly visible approach to terminal speed.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="setup"], [data-experiment-tour="terminal-setup"]',
  },
  {
    title: "Step 2: Release",
    text: "Tap Release. Watch the sphere pass the two optical gates while velocity and acceleration update.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="release"], [data-experiment-tour="terminal-release"]',
    actionSelector: '[data-mobile-experiment-action="release"], [data-experiment-tour="terminal-release"]',
    actionLabel: "Tap Release",
  },
  {
    title: "Step 3: Record",
    text: "When the sphere reaches the catcher, record the trial and compare measured gate speed with the theoretical terminal velocity.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="record"], [data-experiment-tour="terminal-record"]',
  },
  {
    title: "Step 4: Paper",
    text: "Open Paper to review and download the completed practical report.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

function makeWallTexture(title: string, subtitle: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 420;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#061b22");
  gradient.addColorStop(1, "#082d31");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = accent;
  context.lineWidth = 12;
  context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  context.fillStyle = "#ecfeff";
  context.font = "700 62px Georgia";
  context.textAlign = "center";
  context.fillText(title, canvas.width / 2, 155);
  context.fillStyle = accent;
  context.font = "600 31px Arial";
  context.fillText(subtitle, canvas.width / 2, 225);
  context.strokeStyle = "rgba(255,255,255,0.18)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(100, 270);
  context.lineTo(canvas.width - 100, 270);
  context.stroke();
  context.fillStyle = "#b8d9db";
  context.font = "500 24px Arial";
  context.fillText("Weight − upthrust − drag = ma", canvas.width / 2, 330);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeRulerTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 1200;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f4e7b7";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#392f22";
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (let index = 0; index <= 135; index += 1) {
    const y = 40 + index / 135 * (canvas.height - 80);
    const major = index % 10 === 0;
    const medium = index % 5 === 0;
    context.fillRect(canvas.width - (major ? 88 : medium ? 60 : 38), y, major ? 82 : medium ? 54 : 32, major ? 4 : 2);
    if (major) {
      context.font = "700 27px Arial";
      context.fillText(String(index), canvas.width - 98, y);
    }
  }
  context.save();
  context.translate(25, canvas.height / 2);
  context.rotate(-Math.PI / 2);
  context.font = "700 24px Arial";
  context.textAlign = "center";
  context.fillText("CENTIMETRES", 0, 0);
  context.restore();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeLabelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { canvas, texture };
}

function drawLabelTexture(canvas: HTMLCanvasElement, text: string, color: string) {
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(2, 8, 15, 0.88)";
  context.beginPath();
  context.roundRect(8, 8, canvas.width - 16, canvas.height - 16, 28);
  context.fill();
  context.strokeStyle = color;
  context.lineWidth = 7;
  context.stroke();
  context.fillStyle = color;
  let fontSize = 50;
  context.font = `800 ${fontSize}px Arial`;
  while (context.measureText(text).width > canvas.width - 48 && fontSize > 25) {
    fontSize -= 2;
    context.font = `800 ${fontSize}px Arial`;
  }
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 2, canvas.width - 48);
}

function SceneLabel({
  text,
  color,
  position,
  scale = [0.9, 0.225, 1],
}: {
  text: string;
  color: string;
  position: [number, number, number];
  scale?: [number, number, number];
}) {
  const labelTexture = useMemo(() => makeLabelTexture(), []);
  useEffect(() => {
    drawLabelTexture(labelTexture.canvas, text, color);
    labelTexture.texture.needsUpdate = true;
  }, [color, labelTexture, text]);
  useEffect(() => () => labelTexture.texture.dispose(), [labelTexture]);

  return (
    <sprite position={position} scale={scale} renderOrder={90}>
      <spriteMaterial map={labelTexture.texture} transparent depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  );
}

function AnimatedForceArrow({
  direction,
  length,
  color,
  label,
  labelOffsetX,
  active,
}: {
  direction: 1 | -1;
  length: number;
  color: string;
  label: string;
  labelOffsetX: number;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const safeLength = clamp(length, 0.08, 1.05);
  const tipLength = Math.min(0.16, safeLength * 0.42);
  const shaftLength = Math.max(0.045, safeLength - tipLength);

  useFrame(({ clock }) => {
    const pulse = active ? 1 + Math.sin(clock.elapsedTime * 5.5) * 0.045 : 1;
    groupRef.current?.scale.set(pulse, pulse, pulse);
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = active ? 0.75 + Math.sin(clock.elapsedTime * 5.5) * 0.22 : 0.32;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, direction * shaftLength / 2, 0]} renderOrder={82}>
        <cylinderGeometry args={[0.027, 0.027, shaftLength, 18]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.55}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      <mesh
        position={[0, direction * (shaftLength + tipLength / 2), 0]}
        rotation={[direction < 0 ? Math.PI : 0, 0, 0]}
        renderOrder={83}
      >
        <coneGeometry args={[0.09, tipLength, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.65} depthTest={false} depthWrite={false} />
      </mesh>
      <SceneLabel
        text={label}
        color={color}
        position={[labelOffsetX, direction * safeLength * 0.66, 0.02]}
        scale={[Math.min(1.55, Math.max(0.9, label.length * 0.066)), 0.3, 1]}
      />
    </group>
  );
}

// A pulsing ring dropped over whichever apparatus station the player is
// currently looking at in Doing Mode — the "you can interact with this"
// affordance shared with the other free-roam labs.
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
    <mesh ref={ringRef} position={[position.x, position.y + 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]} visible={active} renderOrder={95}>
      <ringGeometry args={[0.32, 0.4, 40]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.85} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

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

// A decorative fire-exit style door on the side wall — visible and walkable
// up to, but purely scenery: there's no "outside" behind it to actually leave to.
function LabExitDoor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.72, 2.85, 0.12]} />
        <meshStandardMaterial color="#3a3f38" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0.05]} castShadow>
        <boxGeometry args={[1.42, 2.62, 0.08]} />
        <meshStandardMaterial color="#5c6b57" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.55, 0.095]}>
        <planeGeometry args={[0.55, 0.62]} />
        <meshPhysicalMaterial color="#cfe0da" roughness={0.2} transmission={0.4} clearcoat={0.6} />
      </mesh>
      {[-0.16, 0, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.098]}>
          <boxGeometry args={[0.012, 0.62, 0.004]} />
          <meshBasicMaterial color="#3a3f38" />
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

function PhysicsLabRoom() { return <group><BlenderLabEnvironment {...BLENDER_LAB_LAYOUT} /><BlenderLabBench position={[0, -1.22, 0.3]} size={[9.9, 4.45]} height={0.6325} />
</group>; }

function OpticalGate({ y, active, passed }: { y: number; active: boolean; passed: boolean }) {
  const color = passed ? "#22c55e" : active ? "#22d3ee" : "#64748b";
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.73, 0.026, 12, 72]} />
        <meshStandardMaterial color="#26323a" metalness={0.72} roughness={0.28} />
      </mesh>
      {[-0.73, 0.73].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.17, 0.2, 0.34]} />
            <meshStandardMaterial color="#1d2932" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[x < 0 ? 0.087 : -0.087, 0, 0]}>
            <circleGeometry args={[0.032, 18]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active || passed ? 2.8 : 0.2} />
          </mesh>
        </group>
      ))}
      <Line points={[[-0.62, 0, 0], [0.62, 0, 0]]} color={color} lineWidth={1.25} transparent opacity={active ? 0.5 : 0.2} />
    </group>
  );
}

interface MotionState extends Telemetry {
  finished: boolean;
  lastEmit: number;
}

function FallingSphere({
  fluid,
  sphere,
  radiusMm,
  gravity,
  predictedTerminal,
  running,
  runId,
  resetId,
  telemetry,
  onTelemetry,
  onFinish,
}: {
  fluid: FluidSpec;
  sphere: SphereSpec;
  radiusMm: number;
  gravity: number;
  predictedTerminal: number;
  running: boolean;
  runId: number;
  resetId: number;
  telemetry: Telemetry;
  onTelemetry: (telemetry: Telemetry) => void;
  onFinish: () => void;
}) {
  const sphereRef = useRef<THREE.Group>(null);
  const trailRef = useRef<THREE.Group>(null);
  const modelRef = useRef<MotionState>({ ...emptyTelemetry(), finished: false, lastEmit: 0 });

  const resetModel = useCallback(() => {
    modelRef.current = { ...emptyTelemetry(), finished: false, lastEmit: 0 };
    if (sphereRef.current) sphereRef.current.position.y = FLUID_TOP_Y;
    onTelemetry(emptyTelemetry());
  }, [onTelemetry]);

  useEffect(() => resetModel(), [fluid.id, gravity, radiusMm, resetId, runId, sphere.id, resetModel]);

  useFrame((_, frameDelta) => {
    const model = modelRef.current;
    if (!running || model.finished) return;
    let remaining = Math.min(frameDelta, 0.05);
    while (remaining > 0) {
      const dt = Math.min(remaining, 1 / 480);
      const before = model.distance;
      const forces = sphereForces(fluid, sphere, radiusMm, gravity, model.velocity);
      model.velocity = Math.max(0, model.velocity + forces.acceleration * dt);
      model.distance = Math.min(DROP_DISTANCE_M, model.distance + model.velocity * dt);
      model.time += dt;
      model.acceleration = forces.acceleration;
      model.reynolds = forces.reynolds;
      model.drag = forces.drag;
      model.buoyancy = forces.buoyancy;
      if (model.gateOneTime === null && before < GATE_ONE_M && model.distance >= GATE_ONE_M) model.gateOneTime = model.time;
      if (model.gateTwoTime === null && before < GATE_TWO_M && model.distance >= GATE_TWO_M) model.gateTwoTime = model.time;
      if (model.terminalReachedAt === null && predictedTerminal > 0 && model.velocity >= predictedTerminal * 0.98) {
        model.terminalReachedAt = model.time;
      }
      remaining -= dt;
    }

    const sceneY = FLUID_TOP_Y - model.distance / DROP_DISTANCE_M * VISUAL_DROP;
    if (sphereRef.current) sphereRef.current.position.y = sceneY;
    if (trailRef.current) {
      trailRef.current.visible = model.velocity > 0.04;
      trailRef.current.children.forEach((child, index) => {
        child.position.y = 0.1 + index * (0.07 + Math.min(0.08, model.velocity * 0.025));
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) material.opacity = 0.16 * (1 - index / 6);
      });
    }

    if (model.time - model.lastEmit >= 0.045 || model.distance >= DROP_DISTANCE_M) {
      model.lastEmit = model.time;
      onTelemetry({
        time: model.time,
        distance: model.distance,
        velocity: model.velocity,
        acceleration: model.acceleration,
        reynolds: model.reynolds,
        drag: model.drag,
        buoyancy: model.buoyancy,
        gateOneTime: model.gateOneTime,
        gateTwoTime: model.gateTwoTime,
        terminalReachedAt: model.terminalReachedAt,
      });
    }

    if (model.distance >= DROP_DISTANCE_M) {
      model.finished = true;
      onFinish();
    }
  });

  const visualRadius = 0.085 + (radiusMm - 2) / 5 * 0.075;
  const displayedForces = sphereForces(fluid, sphere, radiusMm, gravity, telemetry.velocity);
  const forceReference = Math.max(displayedForces.weight, 1e-8);
  const weightArrowLength = 0.82;
  const upthrustArrowLength = weightArrowLength * clamp(displayedForces.buoyancy / forceReference, 0, 1.25);
  const dragArrowLength = weightArrowLength * clamp(displayedForces.drag / forceReference, 0, 1.25);

  return (
    <group ref={sphereRef} position={[0, FLUID_TOP_Y, 0]}>
      <mesh castShadow renderOrder={34}>
        <sphereGeometry args={[visualRadius, 48, 32]} />
        <meshPhysicalMaterial
          color={sphere.color}
          metalness={sphere.metalness}
          roughness={sphere.roughness}
          transmission={sphere.id === "glass" ? 0.52 : 0}
          thickness={sphere.id === "glass" ? 0.12 : 0}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <mesh position={[-visualRadius * 0.32, visualRadius * 0.35, visualRadius * 0.72]} renderOrder={36}>
        <sphereGeometry args={[visualRadius * 0.19, 18, 12]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.58} depthWrite={false} />
      </mesh>
      <group ref={trailRef} visible={false}>
        {Array.from({ length: 6 }, (_, index) => (
          <mesh key={index} scale={1 - index * 0.09}>
            <sphereGeometry args={[visualRadius * 0.55, 14, 10]} />
            <meshBasicMaterial color={fluid.surface} transparent opacity={0.1} depthWrite={false} />
          </mesh>
        ))}
      </group>
      {running && telemetry.velocity > 0.005 && (
        <group position={[0, 0, 0.34]}>
          <group position={[0, -visualRadius * 0.4, 0]}>
            <AnimatedForceArrow
              direction={-1}
              length={weightArrowLength}
              color="#fb7185"
              label={`WEIGHT ${formatForceNewtons(displayedForces.weight)} N`}
              labelOffsetX={0.56}
              active
            />
          </group>
          <group position={[-visualRadius * 1.9, visualRadius * 0.35, 0]}>
            <AnimatedForceArrow
              direction={1}
              length={upthrustArrowLength}
              color="#38bdf8"
              label={`UPTHRUST ${formatForceNewtons(displayedForces.buoyancy)} N`}
              labelOffsetX={-0.64}
              active
            />
          </group>
          <group position={[visualRadius * 1.9, visualRadius * 0.35, 0]}>
            <AnimatedForceArrow
              direction={1}
              length={dragArrowLength}
              color="#fbbf24"
              label={`DRAG ${formatForceNewtons(displayedForces.drag)} N`}
              labelOffsetX={0.56}
              active
            />
          </group>
        </group>
      )}
    </group>
  );
}

function FallingBallApparatus({
  fluid,
  sphere,
  radiusMm,
  gravity,
  predictedTerminal,
  running,
  runId,
  resetId,
  telemetry,
  onTelemetry,
  onFinish,
}: {
  fluid: FluidSpec;
  sphere: SphereSpec;
  radiusMm: number;
  gravity: number;
  predictedTerminal: number;
  running: boolean;
  runId: number;
  resetId: number;
  telemetry: Telemetry;
  onTelemetry: (telemetry: Telemetry) => void;
  onFinish: () => void;
}) {
  const rulerTexture = useMemo(() => makeRulerTexture(), []);
  useEffect(() => () => rulerTexture.dispose(), [rulerTexture]);
  const gateOneY = FLUID_TOP_Y - GATE_ONE_M / DROP_DISTANCE_M * VISUAL_DROP;
  const gateTwoY = FLUID_TOP_Y - GATE_TWO_M / DROP_DISTANCE_M * VISUAL_DROP;
  const activity = clamp(telemetry.velocity / Math.max(0.1, predictedTerminal), 0, 1);
  const visualRadius = 0.085 + (radiusMm - 2) / 5 * 0.075;
  const sphereIsSuspended = !running && telemetry.distance < 0.001;

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.505, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.93, 1.04, 0.18, 64]} />
        <meshStandardMaterial color="#27343b" metalness={0.76} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.395, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.08, 64]} />
        <meshStandardMaterial color="#1f2930" roughness={0.52} />
      </mesh>
      <mesh position={[0, 1.22, 0]} renderOrder={24} castShadow>
        <cylinderGeometry args={[0.7, 0.67, 3.28, 96, 1, true]} />
        <meshPhysicalMaterial
          color="#eefcff"
          transparent
          opacity={0.18}
          transmission={0.88}
          thickness={0.055}
          ior={1.46}
          roughness={0.015}
          clearcoat={1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.08, 0]} renderOrder={16}>
        <cylinderGeometry args={[0.655, 0.64, 3.0, 96]} />
        <meshPhysicalMaterial
          color={fluid.color}
          transparent
          opacity={fluid.id === "oil" ? 0.42 : 0.34}
          transmission={0.38}
          roughness={0.08}
          thickness={0.15}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group position={[0, FLUID_TOP_Y, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={30}>
          <circleGeometry args={[0.655, 96]} />
          <meshPhysicalMaterial color={fluid.surface} transparent opacity={0.58} roughness={0.03} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {[0.16, 0.34, 0.53].map((radius, index) => (
          <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} scale={1 + activity * 0.012 * index} renderOrder={31}>
            <ringGeometry args={[radius, radius + 0.012, 64]} />
            <meshBasicMaterial color="#efffff" transparent opacity={0.14 + activity * 0.06} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 2.86, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={33}>
        <torusGeometry args={[0.7, 0.027, 14, 96]} />
        <meshPhysicalMaterial color="#f2fdff" transparent opacity={0.78} transmission={0.35} roughness={0.025} />
      </mesh>

      <mesh position={[-1.42, 1.42, -0.18]} castShadow>
        <cylinderGeometry args={[0.045, 0.052, 4.35, 24]} />
        <meshStandardMaterial color="#909ba3" metalness={0.88} roughness={0.2} />
      </mesh>
      <mesh position={[-1.42, -0.49, -0.18]} castShadow>
        <boxGeometry args={[0.72, 0.13, 0.72]} />
        <meshStandardMaterial color="#303941" metalness={0.7} roughness={0.32} />
      </mesh>
      <mesh position={[-0.72, 3.48, -0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.036, 0.036, 1.38, 20]} />
        <meshStandardMaterial color="#aab4ba" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[0, 3.48, -0.18]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.14, 36]} />
        <meshStandardMaterial color="#262f35" metalness={0.64} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.37, -0.18]}>
        <cylinderGeometry args={[0.105, 0.105, 0.09, 32]} />
        <meshStandardMaterial color={running ? "#64748b" : "#22d3ee"} emissive={running ? "#111827" : "#0891b2"} emissiveIntensity={running ? 0.1 : 1.2} />
      </mesh>
      {sphereIsSuspended && (
        <group>
          <Line
            points={[[0, 3.32, -0.08], [0, FLUID_TOP_Y + visualRadius, 0]]}
            color="#f8fafc"
            lineWidth={1.6}
            dashed
            dashSize={0.08}
            gapSize={0.045}
            transparent
            opacity={0.9}
          />
          <mesh position={[0, FLUID_TOP_Y + visualRadius + 0.035, 0]} renderOrder={40}>
            <torusGeometry args={[visualRadius * 0.72, 0.015, 10, 32]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1.1} />
          </mesh>
          <SceneLabel text="RELEASE CLAMP" color="#67e8f9" position={[0.78, 3.27, 0.18]} scale={[1.06, 0.265, 1]} />
        </group>
      )}

      <mesh position={[1.17, 1.12, 0.1]} renderOrder={28}>
        <planeGeometry args={[0.45, 3.42]} />
        <meshStandardMaterial map={rulerTexture} roughness={0.68} />
      </mesh>
      <mesh position={[1.2, 1.12, 0.04]}>
        <boxGeometry args={[0.5, 3.44, 0.035]} />
        <meshStandardMaterial color="#8a6b39" roughness={0.65} />
      </mesh>

      <OpticalGate y={gateOneY} active={running && telemetry.gateOneTime === null} passed={telemetry.gateOneTime !== null} />
      <OpticalGate y={gateTwoY} active={running && telemetry.gateOneTime !== null && telemetry.gateTwoTime === null} passed={telemetry.gateTwoTime !== null} />

      <FallingSphere
        fluid={fluid}
        sphere={sphere}
        radiusMm={radiusMm}
        gravity={gravity}
        predictedTerminal={predictedTerminal}
        running={running}
        runId={runId}
        resetId={resetId}
        telemetry={telemetry}
        onTelemetry={onTelemetry}
        onFinish={onFinish}
      />
    </group>
  );
}

function Scene({
  mode = "learning",
  isMobile = false,
  interactables = [],
  activeTargetId = null,
  moveVectorRef,
  onTargetChange,
  ...apparatusProps
}: Parameters<typeof FallingBallApparatus>[0] & {
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: MutableRefObject<{ x: number; y: number }>;
  onTargetChange?: (target: Interactable | null) => void;
}) {
  const { camera, size } = useThree();
  const isPortraitMobile = size.width < 640 || size.width / Math.max(size.height, 1) < 0.82;
  const cameraTarget = useMemo<[number, number, number]>(() => [0, isPortraitMobile ? 1.12 : 1.0, 0], [isPortraitMobile]);

  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isPortraitMobile ? [0.15, 2.15, 8.45] : [4.9, 2.55, 7.05];
    camera.position.set(...position);
    camera.near = 0.08;
    camera.far = 80;
    if (camera instanceof THREE.PerspectiveCamera) camera.fov = isPortraitMobile ? 53 : 46;
    camera.lookAt(...cameraTarget);
    camera.updateProjectionMatrix();
  }, [camera, cameraTarget, isPortraitMobile, mode]);

  return (
    <>
      <color attach="background" args={["#aab9bb"]} />
      <fog attach="fog" args={["#b6c4c5", 15, 34]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#eaffff", "#5a4637", 0.3]} />
      <directionalLight
        position={[4.5, 7.5, 5.5]}
        intensity={0.85}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={6}
        shadow-camera-bottom={-3}
        shadow-bias={-0.00015}
      />
      <pointLight position={[0, 2.8, 3.8]} intensity={0.65} distance={10} color="#dcfaff" />
      <PhysicsLabRoom />
      <FallingBallApparatus {...apparatusProps} />

      {mode === "doing" &&
        interactables.map((item) => <InteractionHighlight key={item.id} position={item.position} active={item.id === activeTargetId} />)}

      {mode === "learning" ? (
        <OrbitControls
          makeDefault
          target={cameraTarget}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={isPortraitMobile ? 6.5 : 5.2}
          maxDistance={9.8}
          minPolarAngle={0.9}
          maxPolarAngle={1.48}
          minAzimuthAngle={-1.05}
          maxAzimuthAngle={1.05}
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

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

function Readout({ label, value, accent = "text-cyan-200" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 shadow-inner shadow-black/25">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className={`mt-0.5 font-mono text-sm font-black ${accent}`}>{value}</div>
    </div>
  );
}

function VelocityGraph({ history, predicted }: { history: Array<{ time: number; velocity: number }>; predicted: number }) {
  const width = 280;
  const height = 104;
  const maxTime = Math.max(1, history.at(-1)?.time ?? 1);
  const maxVelocity = Math.max(0.1, predicted * 1.18, ...history.map((point) => point.velocity));
  const path = history.length > 1
    ? history.map((point, index) => `${index === 0 ? "M" : "L"}${(point.time / maxTime * width).toFixed(2)},${(height - point.velocity / maxVelocity * (height - 10)).toFixed(2)}`).join(" ")
    : "";
  const terminalY = height - predicted / maxVelocity * (height - 10);
  return (
    <div className="rounded-2xl border border-cyan-400/15 bg-slate-950/65 p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
        <span>Velocity–time trace</span>
        <span className="text-cyan-300">terminal {predicted.toFixed(3)} m/s</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full overflow-visible" role="img" aria-label="Velocity against time graph">
        <line x1="0" y1={height} x2={width} y2={height} stroke="#475569" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2={height} stroke="#475569" strokeWidth="1" />
        <line x1="0" y1={terminalY} x2={width} y2={terminalY} stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="5 4" opacity="0.75" />
        {path && <path d={path} fill="none" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
    </div>
  );
}

const SETUP_STEP_TITLES = ["Choose a fluid", "Choose a sphere", "Set sphere size", "Set gravity"] as const;

function GuidedSetup({
  step,
  complete,
  running,
  fluid,
  sphere,
  fluidId,
  sphereId,
  radiusMm,
  gravity,
  onStepChange,
  onFluidChange,
  onSphereChange,
  onRadiusChange,
  onGravityChange,
  onComplete,
  onEdit,
}: {
  step: number;
  complete: boolean;
  running: boolean;
  fluid: FluidSpec;
  sphere: SphereSpec;
  fluidId: string;
  sphereId: string;
  radiusMm: number;
  gravity: number;
  onStepChange: (step: number) => void;
  onFluidChange: (id: string) => void;
  onSphereChange: (id: string) => void;
  onRadiusChange: (radius: number) => void;
  onGravityChange: (gravity: number) => void;
  onComplete: () => void;
  onEdit: () => void;
}) {
  if (complete) {
    return (
      <div data-experiment-tour="terminal-setup" className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-black text-emerald-300">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400 text-[11px] text-slate-950">✓</span>
              Setup ready
            </div>
            <p className="mt-1 truncate text-[11px] text-slate-400">
              {fluid.name} · {sphere.name} · {radiusMm.toFixed(1)} mm · {gravity.toFixed(2)} m/s²
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            disabled={running}
            className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-200 transition-colors hover:bg-white/10 disabled:opacity-40"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-experiment-tour="terminal-setup" className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">Step {step + 1} of 4</div>
          <h2 className="mt-1 text-base font-black text-white">{SETUP_STEP_TITLES[step]}</h2>
        </div>
        <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[9px] font-bold text-slate-400">Setup</span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1" aria-label={`Setup step ${step + 1} of 4`}>
        {SETUP_STEP_TITLES.map((title, index) => (
          <div
            key={title}
            className={`h-1 rounded-full transition-colors ${index <= step ? "bg-cyan-400" : "bg-white/10"}`}
          />
        ))}
      </div>

      <div className="mt-4 min-h-[122px]">
        {step === 0 && (
          <div className="grid gap-2">
            {FLUIDS.map((item) => {
              const selected = item.id === fluidId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFluidChange(item.id)}
                  disabled={running}
                  aria-pressed={selected}
                  className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors ${selected ? "border-cyan-400/70 bg-cyan-400/10" : "border-white/10 bg-black/20 hover:bg-white/5"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-white">{item.name}</span>
                  </span>
                  <span className="text-[9px] text-slate-400">η {item.viscosity} Pa·s</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-2">
            {SPHERES.map((item) => {
              const selected = item.id === sphereId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSphereChange(item.id)}
                  disabled={running}
                  aria-pressed={selected}
                  className={`flex min-h-11 items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors ${selected ? "border-cyan-400/70 bg-cyan-400/10" : "border-white/10 bg-black/20 hover:bg-white/5"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full border border-white/30" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-bold text-white">{item.name}</span>
                  </span>
                  <span className="text-[9px] text-slate-400">{item.density} kg/m³</span>
                </button>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <label className="block rounded-xl border border-white/10 bg-black/20 p-4 text-xs font-bold text-slate-200">
            <span className="flex items-end justify-between gap-3">
              <span>Sphere radius</span>
              <span className="font-mono text-lg font-black text-cyan-300">{radiusMm.toFixed(1)} mm</span>
            </span>
            <input
              type="range"
              min="2"
              max="7"
              step="0.5"
              value={radiusMm}
              disabled={running}
              onChange={(event) => onRadiusChange(Number(event.target.value))}
              className="mt-5 w-full accent-cyan-400 disabled:opacity-50"
            />
            <span className="mt-2 flex justify-between text-[9px] font-medium text-slate-500"><span>2 mm</span><span>7 mm</span></span>
          </label>
        )}

        {step === 3 && (
          <label className="block rounded-xl border border-white/10 bg-black/20 p-4 text-xs font-bold text-slate-200">
            <span className="flex items-end justify-between gap-3">
              <span>Gravitational field</span>
              <span className="font-mono text-lg font-black text-cyan-300">{gravity.toFixed(2)} m/s²</span>
            </span>
            <input
              type="range"
              min="1.6"
              max="15"
              step="0.01"
              value={gravity}
              disabled={running}
              onChange={(event) => onGravityChange(Number(event.target.value))}
              className="mt-5 w-full accent-cyan-400 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => onGravityChange(9.81)}
              disabled={running}
              className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-slate-300 hover:bg-white/10"
            >
              Use Earth gravity
            </button>
          </label>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => onStepChange(Math.max(0, step - 1))}
          disabled={step === 0 || running}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-30"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => step === 3 ? onComplete() : onStepChange(step + 1)}
          disabled={running}
          className="rounded-xl bg-cyan-400 px-5 py-2 text-xs font-black text-slate-950 transition-colors hover:bg-cyan-300 disabled:opacity-40"
        >
          {step === 3 ? "Finish setup" : "Next"}
        </button>
      </div>
    </div>
  );
}

function TerminalVelocityPaper({ trials, onClose }: { trials: Trial[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename="terminal-velocity-motion-in-fluids-experiment-paper.html" onClose={onClose}>
      <h1>Terminal Velocity &amp; Motion in Fluids</h1>
      <p><strong>Aim:</strong> To investigate how fluid viscosity, sphere radius, and sphere density affect terminal velocity.</p>
      <h2>Apparatus</h2>
      <ul>
        <li>Tall transparent falling-ball tube containing a selected fluid</li>
        <li>Spherical balls, release clamp, metre ruler, optical timing gates and catcher</li>
        <li>Computer timer and safety tray</li>
      </ul>
      <h2>Method</h2>
      <ol>
        <li>Fill the vertical tube with the chosen fluid and allow air bubbles to escape.</li>
        <li>Measure the sphere radius and identify its material.</li>
        <li>Release the sphere centrally without pushing it.</li>
        <li>Use the two optical gates to measure mean speed over a known distance.</li>
        <li>Repeat while changing only one variable at a time.</li>
      </ol>
      <h2>Physics</h2>
      <p>Weight acts downward. Upthrust and drag act upward. The simulation evaluates Reynolds number and a sphere drag coefficient continuously. Terminal speed occurs when weight equals upthrust plus drag, so acceleration becomes approximately zero.</p>
      <table>
        <thead><tr><th>Fluid</th><th>Sphere</th><th>Radius / mm</th><th>Predicted vₜ / m s⁻¹</th><th>Gate speed / m s⁻¹</th><th>Re</th><th>Regime</th></tr></thead>
        <tbody>
          {trials.length === 0 ? (
            <tr><td colSpan={7}>No trials recorded yet.</td></tr>
          ) : trials.map((trial) => (
            <tr key={trial.id}>
              <td>{trial.fluid}</td><td>{trial.sphere}</td><td>{trial.radiusMm.toFixed(1)}</td>
              <td>{trial.terminalVelocity.toFixed(3)}</td><td>{trial.measuredVelocity.toFixed(3)}</td>
              <td>{trial.reynolds.toFixed(0)}</td><td>{trial.regime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Conclusion</h2>
      <p>Greater viscosity produces a lower terminal speed. A larger or denser sphere generally has a greater terminal speed because its effective weight is larger relative to drag.</p>
      <h2>Safety and accuracy</h2>
      <ul>
        <li>Keep the tall tube clamped vertically and use the spill tray.</li>
        <li>Release the ball at the centre so it does not touch the wall.</li>
        <li>Use a long gate separation and repeat readings to reduce timing uncertainty.</li>
      </ul>
    </ExperimentPaperModal>
  );
}

export default function TerminalVelocitySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: TerminalVelocitySimProps) {
  const [fluidId, setFluidId] = useState(FLUIDS[2].id);
  const [sphereId, setSphereId] = useState(SPHERES[0].id);
  const [radiusMm, setRadiusMm] = useState(4);
  const [gravity, setGravity] = useState(9.81);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [runId, setRunId] = useState(0);
  const [resetId, setResetId] = useState(0);
  const [telemetry, setTelemetry] = useState<Telemetry>(emptyTelemetry);
  const [history, setHistory] = useState<Array<{ time: number; velocity: number }>>([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [setupStep, setSetupStep] = useState(0);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupCloseRequestKey, setSetupCloseRequestKey] = useState(0);
  const lastHistoryTimeRef = useRef(-1);

  const fluid = FLUIDS.find((item) => item.id === fluidId) ?? FLUIDS[0];
  const sphere = SPHERES.find((item) => item.id === sphereId) ?? SPHERES[0];
  const predictedTerminal = useMemo(
    () => terminalVelocity(fluid, sphere, radiusMm, gravity),
    [fluid, gravity, radiusMm, sphere],
  );
  const gateSpeed = telemetry.gateOneTime !== null && telemetry.gateTwoTime !== null
    ? (GATE_TWO_M - GATE_ONE_M) / (telemetry.gateTwoTime - telemetry.gateOneTime)
    : 0;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const handleTelemetry = useCallback((next: Telemetry) => {
    setTelemetry(next);
    if (next.time === 0) {
      setHistory([]);
      lastHistoryTimeRef.current = -1;
      return;
    }
    if (next.time - lastHistoryTimeRef.current >= 0.07) {
      lastHistoryTimeRef.current = next.time;
      setHistory((current) => [...current.slice(-139), { time: next.time, velocity: next.velocity }]);
    }
  }, []);

  const handleRelease = useCallback(() => {
    if (running || !setupComplete) return;
    setCompleted(false);
    setTelemetry(emptyTelemetry());
    setHistory([]);
    lastHistoryTimeRef.current = -1;
    setRunId((current) => current + 1);
    setRunning(true);
  }, [running, setupComplete]);

  const handleFinish = useCallback(() => {
    setRunning(false);
    setCompleted(true);
  }, []);

  const handleReset = useCallback(() => {
    setRunning(false);
    setCompleted(false);
    setTelemetry(emptyTelemetry());
    setHistory([]);
    lastHistoryTimeRef.current = -1;
    setResetId((current) => current + 1);
  }, []);

  const handleRecord = useCallback(() => {
    if (!completed || gateSpeed <= 0) return;
    setTrials((current) => [
      ...current,
      {
        id: Date.now(),
        fluid: fluid.name,
        sphere: sphere.name,
        radiusMm,
        terminalVelocity: predictedTerminal,
        measuredVelocity: gateSpeed,
        reynolds: telemetry.reynolds,
        regime: flowRegime(telemetry.reynolds),
      },
    ]);
  }, [completed, fluid.name, gateSpeed, predictedTerminal, radiusMm, sphere.name, telemetry.reynolds]);

  const resetForSetting = useCallback((setter: () => void) => {
    if (running) return;
    setter();
    setCompleted(false);
    setTelemetry(emptyTelemetry());
    setHistory([]);
    setResetId((current) => current + 1);
  }, [running]);

  const handleArmSetup = useCallback(() => {
    setSetupComplete(true);
    setSetupCloseRequestKey((current) => current + 1);
  }, []);

  // --- Doing Mode: free-roam + walk-up-and-press interactions ---------
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [activeInteractableMeta, setActiveInteractableMeta] = useState<{ id: string; label: string; hold: boolean } | null>(null);
  const activeInteractableRef = useRef<Interactable | null>(null);
  const moveVectorRef = useRef({ x: 0, y: 0 });

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

  // Cycling helpers for the Doing Mode "consoles" — each still routes through
  // resetForSetting, the exact same guarded setter the guided wizard uses.
  const cycleFluid = useCallback(() => {
    const index = FLUIDS.findIndex((item) => item.id === fluidId);
    const next = FLUIDS[(index + 1) % FLUIDS.length].id;
    resetForSetting(() => setFluidId(next));
  }, [fluidId, resetForSetting]);

  const cycleSphere = useCallback(() => {
    const index = SPHERES.findIndex((item) => item.id === sphereId);
    const next = SPHERES[(index + 1) % SPHERES.length].id;
    resetForSetting(() => setSphereId(next));
  }, [sphereId, resetForSetting]);

  const cycleRadius = useCallback(() => {
    const index = RADIUS_STEPS_MM.reduce(
      (best, value, candidateIndex) => (Math.abs(value - radiusMm) < Math.abs(RADIUS_STEPS_MM[best] - radiusMm) ? candidateIndex : best),
      0,
    );
    const next = RADIUS_STEPS_MM[(index + 1) % RADIUS_STEPS_MM.length];
    resetForSetting(() => setRadiusMm(next));
  }, [radiusMm, resetForSetting]);

  const cycleGravity = useCallback(() => {
    const index = GRAVITY_PRESETS.reduce(
      (best, value, candidateIndex) => (Math.abs(value - gravity) < Math.abs(GRAVITY_PRESETS[best] - gravity) ? candidateIndex : best),
      0,
    );
    const next = GRAVITY_PRESETS[(index + 1) % GRAVITY_PRESETS.length];
    resetForSetting(() => setGravity(next));
  }, [gravity, resetForSetting]);

  // Doing Mode's world-space stations: same handlers/setters the guided panel
  // already calls, just reached by walking up and pressing E instead of
  // tapping a control. Continuous sliders (radius/gravity) are simplified to
  // "tap to cycle through presets" rather than a free-form drag.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const list: Interactable[] = [];

    list.push({
      id: "select-fluid",
      position: FLUID_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Fluid: ${fluid.name} (tap to cycle)`,
      disabled: running,
      onActivate: cycleFluid,
    });
    list.push({
      id: "select-sphere",
      position: SPHERE_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Sphere: ${sphere.name} (tap to cycle)`,
      disabled: running,
      onActivate: cycleSphere,
    });
    list.push({
      id: "select-radius",
      position: RADIUS_DIAL_POS,
      radius: INTERACTION_RADIUS,
      label: `Radius: ${radiusMm.toFixed(1)} mm (tap to cycle)`,
      disabled: running,
      onActivate: cycleRadius,
    });
    list.push({
      id: "select-gravity",
      position: GRAVITY_DIAL_POS,
      radius: INTERACTION_RADIUS,
      label: `Gravity: ${gravity.toFixed(2)} m/s² (tap to cycle)`,
      disabled: running,
      onActivate: cycleGravity,
    });

    if (!setupComplete) {
      list.push({
        id: "arm-setup",
        position: RELEASE_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: "Arm release clamp",
        onActivate: handleArmSetup,
      });
    } else {
      list.push({
        id: "release",
        position: RELEASE_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: running ? "Falling…" : completed ? "Release again" : "Release sphere",
        disabled: running,
        onActivate: handleRelease,
      });
    }

    if (completed) {
      list.push({
        id: "record",
        position: RECORD_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: "Record trial",
        disabled: gateSpeed <= 0,
        onActivate: handleRecord,
      });
    }

    return list;
  }, [
    mode,
    fluid.name,
    sphere.name,
    radiusMm,
    gravity,
    running,
    completed,
    setupComplete,
    gateSpeed,
    cycleFluid,
    cycleSphere,
    cycleRadius,
    cycleGravity,
    handleArmSetup,
    handleRelease,
    handleRecord,
  ]);

  const setupControls = (
    <GuidedSetup
      step={setupStep}
      complete={setupComplete}
      running={running}
      fluid={fluid}
      sphere={sphere}
      fluidId={fluidId}
      sphereId={sphereId}
      radiusMm={radiusMm}
      gravity={gravity}
      onStepChange={setSetupStep}
      onFluidChange={(id) => resetForSetting(() => setFluidId(id))}
      onSphereChange={(id) => resetForSetting(() => setSphereId(id))}
      onRadiusChange={(radius) => resetForSetting(() => setRadiusMm(radius))}
      onGravityChange={(nextGravity) => resetForSetting(() => setGravity(nextGravity))}
      onComplete={handleArmSetup}
      onEdit={() => {
        handleReset();
        setSetupStep(0);
        setSetupComplete(false);
      }}
    />
  );

  const status = !setupComplete
    ? "Complete setup to arm release"
    : running
    ? telemetry.terminalReachedAt !== null ? "Terminal region reached" : "Sphere accelerating"
    : completed ? "Sphere caught — ready to record" : "Release system armed";

  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden bg-[#071014] text-white">
      <div data-experiment-tour="terminal-scene" className="relative min-w-0 flex-1 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-24 sm:top-0">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [4.2, 2.15, 5.5], fov: 46, near: 0.1, far: 60 }}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            className="h-full w-full"
          >
            <Scene
              fluid={fluid}
              sphere={sphere}
              radiusMm={radiusMm}
              gravity={gravity}
              predictedTerminal={predictedTerminal}
              running={running}
              runId={runId}
              resetId={resetId}
              telemetry={telemetry}
              onTelemetry={handleTelemetry}
              onFinish={handleFinish}
              mode={mode}
              isMobile={isMobileViewport}
              interactables={interactables}
              activeTargetId={activeInteractableMeta?.id ?? null}
              moveVectorRef={moveVectorRef}
              onTargetChange={handleTargetChange}
            />
          </Canvas>
        </div>

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={setMode}
        />

        <div className="pointer-events-none absolute inset-x-0 top-12 z-10 flex h-12 items-stretch border-b border-cyan-300/20 bg-slate-950/90 shadow-lg backdrop-blur-xl sm:hidden">
          <div className="flex min-w-0 flex-1 items-center gap-2 border-r border-white/10 px-2.5">
            <span className={`h-2 w-2 shrink-0 rounded-full ${running ? "animate-pulse bg-cyan-400" : completed ? "bg-emerald-400" : "bg-amber-300"}`} />
            <div className="min-w-0">
              <div className="text-[8px] font-black uppercase tracking-[0.14em] text-cyan-300">Live force analysis</div>
              <div className="truncate text-[10px] font-bold text-white">{status}</div>
            </div>
          </div>
          {mode === "doing" && (
            <button
              type="button"
              onClick={handleReset}
              className="pointer-events-auto shrink-0 self-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] font-bold text-slate-200"
            >
              Reset
            </button>
          )}
          <div className="grid shrink-0 grid-cols-3 divide-x divide-white/10">
            <div className="grid min-w-[58px] place-content-center px-1.5 text-center">
              <span className="font-mono text-[10px] font-black text-cyan-200">{telemetry.velocity.toFixed(2)}</span>
              <span className="text-[7px] font-bold uppercase text-slate-500">m/s</span>
            </div>
            <div className="grid min-w-[58px] place-content-center px-1.5 text-center">
              <span className="font-mono text-[10px] font-black text-amber-200">{telemetry.acceleration.toFixed(1)}</span>
              <span className="text-[7px] font-bold uppercase text-slate-500">m/s²</span>
            </div>
            <div className="grid min-w-[52px] place-content-center px-1.5 text-center">
              <span className="font-mono text-[10px] font-black text-emerald-200">{telemetry.reynolds.toFixed(0)}</span>
              <span className="text-[7px] font-bold uppercase text-slate-500">Re</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute left-5 top-5 hidden w-[330px] rounded-2xl border border-cyan-300/20 bg-slate-950/82 p-3 shadow-2xl backdrop-blur-xl sm:block">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">Live force analysis</div>
              <div className="mt-0.5 text-sm font-black text-white">{status}</div>
            </div>
            <div className="flex items-center gap-2">
              {mode === "doing" && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="pointer-events-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-200 transition-colors hover:border-cyan-300/40 hover:bg-cyan-400/10 hover:text-cyan-100"
                >
                  Reset
                </button>
              )}
              <div className={`h-3 w-3 rounded-full ${running ? "animate-pulse bg-cyan-400" : completed ? "bg-emerald-400" : "bg-amber-300"}`} />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Readout label="Speed" value={`${telemetry.velocity.toFixed(3)} m/s`} />
            <Readout label="Accel." value={`${telemetry.acceleration.toFixed(2)} m/s²`} accent="text-amber-200" />
            <Readout label="Reynolds" value={telemetry.reynolds.toFixed(0)} accent="text-emerald-200" />
          </div>
        </div>

        <HeaderModeToggle mode={mode} onChange={setMode} />

        {mode === "doing" && (
          <>
            {/* Desktop crosshair + contextual prompt */}
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

            {/* Mobile: left joystick + right contextual action button */}
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

            {/* Rotate-to-landscape gate */}
            {isMobileViewport && isPortrait && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-slate-950/95 px-6 text-center text-white">
                <div className="text-4xl">📱↻</div>
                <div className="text-sm font-black uppercase tracking-wide">Rotate your device</div>
                <p className="max-w-xs text-xs text-slate-300">Doing Mode plays best in landscape so you have room for the joystick and action button.</p>
              </div>
            )}
          </>
        )}
      </div>

      <aside
        data-experiment-tour="terminal-controls"
        className={`experiment-desktop-panel experiment-violet-panel h-full w-[380px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#071017]/96 p-4 shadow-2xl lg:w-[410px] ${
          mode === "doing" ? "hidden" : "hidden sm:flex"
        }`}
      >
        <div className="mb-4">
          <div className="text-lg font-black">Terminal Velocity</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">A force-based falling-sphere viscometer with optical timing gates.</p>
        </div>

        <div className="mt-1">{setupControls}</div>

        {setupComplete && (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                type="button"
                data-experiment-tour="terminal-release"
                onClick={handleRelease}
                disabled={running}
                className="rounded-xl bg-cyan-500 px-3 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-950/40 disabled:bg-slate-700 disabled:text-slate-400"
              >
                {running ? "Falling…" : completed ? "Run again" : "Release"}
              </button>
              <button type="button" onClick={handleReset} className="rounded-xl border border-white/12 bg-white/5 px-3 py-2.5 text-xs font-black text-slate-200">Reset</button>
              <button
                type="button"
                data-experiment-tour="terminal-record"
                onClick={handleRecord}
                disabled={!completed || gateSpeed <= 0}
                className="rounded-xl bg-emerald-500 px-3 py-2.5 text-xs font-black text-white disabled:bg-slate-700 disabled:text-slate-400"
              >
                Record
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2" data-experiment-tour="terminal-hud">
              <Readout label="Predicted vₜ" value={`${predictedTerminal.toFixed(3)} m/s`} />
              <Readout label="Gate speed" value={gateSpeed > 0 ? `${gateSpeed.toFixed(3)} m/s` : "—"} accent="text-emerald-200" />
              {(running || completed) && <Readout label="Drag" value={`${telemetry.drag.toExponential(2)} N`} accent="text-orange-200" />}
              {(running || completed) && <Readout label="Upthrust" value={`${telemetry.buoyancy.toExponential(2)} N`} accent="text-sky-200" />}
            </div>

            {(running || completed) && <div className="mt-4"><VelocityGraph history={history} predicted={predictedTerminal} /></div>}

            {(running || completed) && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-xs text-slate-300">
                <div className="flex justify-between"><span>Flow regime</span><strong className="text-white">{flowRegime(telemetry.reynolds)}</strong></div>
                <div className="mt-1 flex justify-between"><span>Gate 1</span><span className="font-mono">{telemetry.gateOneTime === null ? "—" : `${telemetry.gateOneTime.toFixed(3)} s`}</span></div>
                <div className="mt-1 flex justify-between"><span>Gate 2</span><span className="font-mono">{telemetry.gateTwoTime === null ? "—" : `${telemetry.gateTwoTime.toFixed(3)} s`}</span></div>
                <div className="mt-1 flex justify-between"><span>Recorded trials</span><span className="font-mono text-cyan-300">{trials.length}</span></div>
              </div>
            )}
          </>
        )}
      </aside>

      {mode === "learning" && (
      <MobileExperimentControls
        actions={[
          { id: "release", label: running ? "Falling" : "Release", onClick: handleRelease, disabled: running || !setupComplete, tone: "blue" },
          { id: "reset", label: "Reset", onClick: handleReset, tone: "dark" },
        ]}
        panels={[
          {
            id: "setup",
            label: "Setup",
            value: setupComplete ? `${fluid.name} · ${radiusMm.toFixed(1)} mm` : `Step ${setupStep + 1} of 4`,
            content: setupControls,
          },
          {
            id: "results",
            label: "Results",
            value: `${telemetry.velocity.toFixed(3)} m/s`,
            disabled: !setupComplete,
            content: (
              <div>
                <div className="grid grid-cols-2 gap-2">
                  <Readout label="Predicted vₜ" value={`${predictedTerminal.toFixed(3)} m/s`} />
                  <Readout label="Gate speed" value={gateSpeed ? `${gateSpeed.toFixed(3)} m/s` : "—"} />
                  <Readout label="Reynolds" value={telemetry.reynolds.toFixed(0)} />
                  <Readout label="Time" value={`${telemetry.time.toFixed(2)} s`} />
                </div>
                <button
                  type="button"
                  data-experiment-tour="terminal-record"
                  onClick={handleRecord}
                  disabled={!completed || gateSpeed <= 0}
                  className="mt-2 w-full rounded-xl bg-emerald-400 px-3 py-2.5 text-xs font-black text-slate-950 disabled:bg-white/5 disabled:text-slate-500"
                >
                  {completed ? "Record this trial" : "Record available after the ball is caught"}
                </button>
              </div>
            ),
          },
        ]}
        initialPanelId="setup"
        panelCloseRequestKey={setupCloseRequestKey}
        variant="minimal"
        columns={4}
      />
      )}

      {showPaper && <TerminalVelocityPaper trials={trials} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={`${tutorialMode}-${tutorialRequestKey}`}
          steps={tutorialMode === "howto" ? terminalHowToSteps : terminalTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
