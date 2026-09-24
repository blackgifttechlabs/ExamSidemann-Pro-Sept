"use client";

import { BlenderLabEnvironment, BlenderLabBench, blenderLabObstacles } from "../../common/BlenderLabEnvironment";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { HeaderModeToggle } from "../../common/CombinedScienceGame";
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import { VirtualJoystick } from "../../common/VirtualJoystick";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";
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
import { HOOKE_NARRATION_TRACKS } from "../../../../lib/audio/narration/hookesLaw";
import * as THREE from "three";


const BLENDER_LAB_LAYOUT = { width: 22, depth: 18, height: 12, floorY: -4, centerZ: 4.35, worktopY: -1.94 };
// ---------------------------------------------------------------------------
// Physics constants & helpers
// ---------------------------------------------------------------------------

// World units per real metre — chosen so a ~0.5 m spring reads nicely in frame.
const WORLD_SCALE = 6;
const ANCHOR_Y = 3.35; // world-space y of the spring's fixed support
const COIL_TURNS = 18;
const WIRE_RADIUS_BASE = 0.032;
const SUBSTEPS = 6;
const MIN_MASS_KG = 0.01; // below this, treat as unloaded — skip integration to avoid divide-by-clamped-mass jitter
const MIN_EXTENSION_M = -0.13;
const MAX_EXTENSION_M = 0.42; // keeps the hanger above the bench at every camera angle
const BENCH_TOP_Y = -1.94;
const NATURAL_LENGTH_M = 0.35;

// ---------------------------------------------------------------------------
// Doing Mode: free-roam bounds, obstacles, and world-space interaction stations
// ---------------------------------------------------------------------------

// The player roams the floor around the bench at a comfortable working height
// rather than the room's literal (much lower) floor plane — matching the
// stylized "bench-top height" convention used by the other Doing Mode rigs.
const PLAYER_BOUNDS: PlayerBounds = { minX: -9, maxX: 9, minZ: -3.4, maxZ: 6.6 };
const BENCH_OBSTACLES: PlayerBounds[] = [{ minX: -4.4, maxX: 4.4, minZ: -1.9, maxZ: 1.9 }, ...blenderLabObstacles(BLENDER_LAB_LAYOUT)];
const PLAYER_SPAWN = new THREE.Vector3(0, 0, 4.6);
const PLAYER_EYE_HEIGHT = 0.5;
const INTERACTION_RADIUS = 5.2;

// World-space stations, positioned near the real apparatus they control.
const SPRING_STATION_POS = new THREE.Vector3(-1.08, 1.15, 0.05);
const MASS_STATION_POS = new THREE.Vector3(0, -0.25, 0.3);
const RECORD_STATION_POS = new THREE.Vector3(1.18, 0.55, 0.15);
const CONSOLE_DAMPING_POS = new THREE.Vector3(2.55, -1.55, 0.85);
const CONSOLE_YIELD_POS = new THREE.Vector3(2.95, -1.55, 0.85);

const DAMPING_PRESETS = [0.2, 0.6, 1.0, 1.5, 2.0];

interface SpringParams {
  massKg: number; // hanging mass, kg
  stiffness: number; // N/m ("k" — the unknown being verified)
  damping: number; // N·s/m
  gravity: number; // m/s^2
  naturalLengthM: number; // unstretched length, metres
}

interface Reading {
  massKg: number;
  extensionM: number;
}

const hookesTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Level Start: Hooke's Law",
    text: "You are testing how the extension of a spring changes when different loads are added.",
    mode: "modal",
  },
  {
    title: "How It Works",
    text: "Choose a spring, add a known mass, wait for the motion to settle, then compare the measured extension with the predicted value.",
    mode: "modal",
  },
  {
    title: "Recording Your Paper",
    text: "Record settled readings for several masses. The Paper report uses those readings to show load, extension, and the Hooke's Law graph.",
    mode: "modal",
  },
  {
    title: "Live Status",
    text: "This HUD shows the current extension and whether the load is still moving or settled enough to record.",
    mode: "bubble",
    selector: '[data-experiment-tour="hooke-hud"]',
  },
  {
    title: "Spring And Load",
    text: "Watch the spring stretch under the selected mass. Let it stop oscillating before recording the reading.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="hooke-scene"]',
    sceneBox: { x: 0.36, y: 0.12, w: 0.42, h: 0.52 },
  },
  {
    title: "Game Controls",
    text: "Use Spring, Load, Damping, Yield, Record, and Reset controls to collect a clean set of results.",
    mode: "bubble",
    selector: '[data-experiment-tour="hooke-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Paper Button",
    text: "Open Paper after recording readings to generate the practical report and graph.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

const hookesHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Hooke's Law",
    text: "Follow this sample run. Choose a spring or load, wait for the spring to settle, record a reading, then download the paper.",
    mode: "modal",
  },
  {
    title: "Step 1: Choose Spring Or Load",
    text: "Tap Load or Spring. Use this to set the sample load before taking a reading.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="load"], [data-mobile-experiment-action="spring"], [data-experiment-tour="hooke-spring"]',
    actionSelector: '[data-mobile-experiment-action="load"], [data-mobile-experiment-action="spring"], [data-experiment-tour="hooke-spring"]',
    actionLabel: "Tap Load or Spring",
  },
  {
    title: "Step 2: Wait For Settled",
    text: "Watch the status. When it says Settled, the extension is stable enough to record.",
    mode: "bubble",
    selector: '[data-experiment-tour="hooke-hud"]',
  },
  {
    title: "Step 3: Record Reading",
    text: "Tap Record to save the extension reading in the results table.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="record"], [data-experiment-tour="hooke-record"]',
    actionSelector: '[data-mobile-experiment-action="record"], [data-experiment-tour="hooke-record"]',
    actionLabel: "Tap Record",
  },
  {
    title: "Step 4: Open Paper",
    text: "Tap Paper to open the practical report and graph.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
    actionSelector: '[data-experiment-tour="paper"] button',
    actionLabel: "Tap Paper",
  },
  {
    title: "Step 5: Download Paper",
    text: "Tap Download to save the generated Hooke's Law paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper-download"]',
    actionSelector: '[data-experiment-tour="paper-download"]',
    actionLabel: "Tap Download",
  },
  {
    title: "Congratulations",
    text: "You now know how to run Hooke's Law, change loads, wait for a settled spring, record readings, and download the paper.",
    mode: "modal",
  },
];

// Equilibrium extension for a given mass (used for the "ghost" preview and
// for auto-settling once the sim is left alone).
function equilibriumExtension(massKg: number, stiffness: number, gravity: number) {
  if (stiffness <= 0) return 0;
  return (massKg * gravity) / stiffness;
}

// Simple least-squares linear regression through the origin-free line
// Load (N) = k * extension (m) + c, returning slope, intercept, and R^2.
function linearRegression(points: { x: number; y: number }[]) {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: 0, r2: 0 };
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;
  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - meanX) * (p.y - meanY);
    den += (p.x - meanX) * (p.x - meanX);
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;

  let ssTot = 0;
  let ssRes = 0;
  for (const p of points) {
    const predicted = slope * p.x + intercept;
    ssRes += (p.y - predicted) ** 2;
    ssTot += (p.y - meanY) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
  return { slope, intercept, r2 };
}

// ---------------------------------------------------------------------------
// Procedural helix geometry for the spring coil
// ---------------------------------------------------------------------------

function buildHelixCurve(lengthWorld: number, turns: number) {
  const points: THREE.Vector3[] = [];
  const segmentsPerTurn = 20;
  const totalSegments = Math.max(2, Math.round(turns * segmentsPerTurn));
  const radius = 0.19;
  for (let i = 0; i <= totalSegments; i++) {
    const tNorm = i / totalSegments;
    const angle = tNorm * turns * Math.PI * 2;
    const y = -tNorm * lengthWorld;
    const taper =
      tNorm < 0.045 ? tNorm / 0.045 : tNorm > 0.955 ? (1 - tNorm) / 0.045 : 1;
    const r = radius * (0.08 + 0.92 * taper);
    points.push(new THREE.Vector3(Math.cos(angle) * r, y, Math.sin(angle) * r));
  }
  return new THREE.CatmullRomCurve3(points);
}

function SpringCoil({ lengthWorld, wireThinning }: { lengthWorld: number; wireThinning: number }) {
  const curve = useMemo(() => buildHelixCurve(Math.max(lengthWorld, 0.3), COIL_TURNS), [lengthWorld]);
  const tubeRadius = WIRE_RADIUS_BASE * wireThinning;
  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 360, tubeRadius, 12, false]} />
        <meshPhysicalMaterial color="#c7cbd0" metalness={0.92} roughness={0.2} clearcoat={0.45} />
      </mesh>
      <mesh position={[0, 0.085, 0.005]} rotation={[0, 0, 0.45]} castShadow>
        <torusGeometry args={[0.105, tubeRadius, 10, 32, Math.PI * 1.72]} />
        <meshPhysicalMaterial color="#d7dade" metalness={0.95} roughness={0.18} />
      </mesh>
      <mesh position={[0, -lengthWorld - 0.085, 0.005]} rotation={[0, 0, -2.55]} castShadow>
        <torusGeometry args={[0.105, tubeRadius, 10, 32, Math.PI * 1.72]} />
        <meshPhysicalMaterial color="#d7dade" metalness={0.95} roughness={0.18} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Textures used by real objects in the room (rather than floating HTML labels)
// ---------------------------------------------------------------------------

function makeCanvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D, width: number, height: number) => void
) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  draw(context, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

// ---------------------------------------------------------------------------
// A physical metre rule alongside the spring, marked in centimetres
// ---------------------------------------------------------------------------

function MetreRule() {
  const heightWorld = ANCHOR_Y - -1.5;
  const texture = useMemo(
    () =>
      makeCanvasTexture(256, 1800, (context, width, height) => {
        const wood = context.createLinearGradient(0, 0, width, 0);
        wood.addColorStop(0, "#d7a95c");
        wood.addColorStop(0.42, "#f0ce87");
        wood.addColorStop(1, "#c58b3c");
        context.fillStyle = wood;
        context.fillRect(0, 0, width, height);
        context.fillStyle = "rgba(99,57,19,0.16)";
        for (let y = 24; y < height; y += 64) context.fillRect(0, y, width, 2);
        const maxCm = Math.floor((heightWorld / WORLD_SCALE) * 100);
        context.strokeStyle = "#25190f";
        context.fillStyle = "#25190f";
        context.textBaseline = "middle";
        context.font = "bold 31px ui-monospace, monospace";
        for (let cm = 0; cm <= maxCm; cm += 1) {
          const y = (cm / maxCm) * (height - 8) + 4;
          const major = cm % 10 === 0;
          const medium = cm % 5 === 0;
          const tickLength = major ? 102 : medium ? 74 : 44;
          context.lineWidth = major ? 5 : medium ? 3.5 : 2;
          context.beginPath();
          context.moveTo(width, y);
          context.lineTo(width - tickLength, y);
          context.stroke();
          if (major) context.fillText(String(cm), 14, y);
        }
        const initialLengthY = (NATURAL_LENGTH_M * 100 * (height - 8)) / maxCm + 4;
        context.fillStyle = "#9a3412";
        context.fillRect(0, initialLengthY - 5, width, 10);
        context.font = "bold 30px system-ui, sans-serif";
        context.fillText("L₀", 16, initialLengthY - 27);
        context.fillStyle = "#25190f";
        context.font = "bold 25px system-ui, sans-serif";
        context.save();
        context.translate(55, height * 0.56);
        context.rotate(-Math.PI / 2);
        context.fillText("centimetres", 0, 0);
        context.restore();
      }),
    [heightWorld]
  );

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <group position={[1.18, (ANCHOR_Y - 1.5) / 2, -0.035]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.57, heightWorld + 0.08, 0.075]} />
        <meshStandardMaterial color="#9b632f" roughness={0.66} />
      </mesh>
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[0.53, heightWorld]} />
        <meshStandardMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#dfb968"} roughness={0.72} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Retort stand, clamp and support hardware
// ---------------------------------------------------------------------------

function RetortStand() {
  return (
    <group>
      <mesh position={[-0.52, -1.82, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.05, 0.22, 0.92]} />
        <meshPhysicalMaterial color="#22272b" metalness={0.72} roughness={0.32} clearcoat={0.35} />
      </mesh>
      {[-1.35, 0.3].map((x) => (
        <mesh key={x} position={[x, -1.945, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.18, 0.08, 20]} />
          <meshStandardMaterial color="#171717" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[-1.08, 0.81, 0]} castShadow>
        <cylinderGeometry args={[0.052, 0.052, 5.18, 24]} />
        <meshPhysicalMaterial color="#747b82" metalness={0.95} roughness={0.18} />
      </mesh>
      <mesh position={[-1.08, ANCHOR_Y, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.24, 24]} />
        <meshStandardMaterial color="#23282c" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[-0.53, ANCHOR_Y, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 1.1, 20]} />
        <meshPhysicalMaterial color="#8d949a" metalness={0.95} roughness={0.16} />
      </mesh>
      <mesh position={[-1.08, ANCHOR_Y, 0.19]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.38, 18]} />
        <meshStandardMaterial color="#161a1d" metalness={0.65} roughness={0.35} />
      </mesh>
      <mesh position={[-1.08, ANCHOR_Y, 0.42]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.055, 18]} />
        <meshStandardMaterial color="#242a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.02, ANCHOR_Y, 0]} castShadow>
        <boxGeometry args={[0.2, 0.18, 0.22]} />
        <meshStandardMaterial color="#22272b" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[-0.02, ANCHOR_Y - 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.22, 16]} />
        <meshPhysicalMaterial color="#aeb4b8" metalness={0.95} roughness={0.16} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Hanging mass — stacked slotted weights, count scales with load
// ---------------------------------------------------------------------------

function SlottedMass({ massKg, y }: { massKg: number; y: number }) {
  const discCount = Math.max(0, Math.round(massKg / 0.05)); // one brass disc per 50 g
  const discs: React.ReactNode[] = [];
  const discHeight = 0.071;
  for (let i = 0; i < discCount; i++) {
    discs.push(
      <group key={i} position={[0, -0.59 + i * discHeight, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.29, 0.29, discHeight * 0.88, 36]} />
          <meshPhysicalMaterial color={i % 2 === 0 ? "#c89b38" : "#b7832c"} metalness={0.82} roughness={0.25} clearcoat={0.25} />
        </mesh>
        <mesh position={[0, discHeight * 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.225, 0.012, 7, 32]} />
          <meshStandardMaterial color="#f1d37a" metalness={0.78} roughness={0.22} />
        </mesh>
        <mesh position={[0.245, discHeight * 0.47, 0.07]}>
          <boxGeometry args={[0.1, 0.01, 0.12]} />
          <meshStandardMaterial color="#5d431e" metalness={0.45} roughness={0.42} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, -0.075, 0]} rotation={[0, 0, -2.45]} castShadow>
        <torusGeometry args={[0.095, 0.019, 9, 28, Math.PI * 1.6]} />
        <meshPhysicalMaterial color="#c9cdd1" metalness={0.95} roughness={0.17} />
      </mesh>
      <mesh position={[0, -0.355, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.61, 16]} />
        <meshPhysicalMaterial color="#aeb4b8" metalness={0.95} roughness={0.18} />
      </mesh>
      <mesh position={[0, -0.655, 0]} castShadow>
        <cylinderGeometry args={[0.315, 0.29, 0.055, 36]} />
        <meshPhysicalMaterial color="#5d6266" metalness={0.88} roughness={0.22} />
      </mesh>
      {discs}
      {/* A real pointer fixed to the lower spring hook reads against the rule. */}
      <mesh position={[0.43, -0.018, 0.025]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.013, 0.013, 0.78, 12]} />
        <meshStandardMaterial color="#b91c1c" metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0.84, -0.018, 0.025]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.055, 0.16, 16]} />
        <meshStandardMaterial color="#ef2d2d" roughness={0.35} />
      </mesh>
    </group>
  );
}

function LabWallBoard() {
  const texture = useMemo(
    () =>
      makeCanvasTexture(1100, 560, (context, width, height) => {
        context.fillStyle = "#123f37";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "rgba(222,255,243,0.2)";
        context.lineWidth = 3;
        for (let y = 90; y < height; y += 96) {
          context.beginPath();
          context.moveTo(48, y);
          context.lineTo(width - 48, y);
          context.stroke();
        }
        context.textAlign = "center";
        context.fillStyle = "#f3fbf4";
        context.font = "700 64px Georgia, serif";
        context.fillText("HOOKE'S LAW", width / 2, 104);
        context.fillStyle = "#bbf7d0";
        context.font = "italic 48px Georgia, serif";
        context.fillText("F = kx", width / 2, 210);
        context.textAlign = "left";
        context.fillStyle = "#e6f4ef";
        context.font = "34px system-ui, sans-serif";
        context.fillText("• add known loads", 110, 320);
        context.fillText("• read at eye level", 110, 385);
        context.fillText("• do not exceed the elastic limit", 110, 450);
      }),
    []
  );
  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <group position={[-2.9, 2.1, -4.45]}>
      <mesh castShadow>
        <boxGeometry args={[3.7, 1.92, 0.14]} />
        <meshStandardMaterial color="#6d7478" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.076]}>
        <planeGeometry args={[3.54, 1.76]} />
        <meshStandardMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#123f37"} roughness={0.84} />
      </mesh>
      <mesh position={[0, -1.01, 0.13]} castShadow>
        <boxGeometry args={[3.78, 0.1, 0.28]} />
        <meshStandardMaterial color="#858b8f" metalness={0.55} roughness={0.35} />
      </mesh>
    </group>
  );
}

// A decorative fire-exit style door on the side wall — visible and walkable
// up to, but purely scenery: there's no "outside" behind it to actually leave to.
function ExitSignSurface() {
  const texture = useMemo(
    () =>
      makeCanvasTexture(256, 96, (context, width, height) => {
        context.fillStyle = "#065f46";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "#022c22";
        context.lineWidth = 6;
        context.strokeRect(3, 3, width - 6, height - 6);
        context.fillStyle = "#ffffff";
        context.font = "900 52px Arial, sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText("EXIT", width / 2, height / 2 + 2);
      }),
    []
  );
  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[0.62, 0.23]} />
      <meshBasicMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#065f46"} toneMapped={false} />
    </mesh>
  );
}

function LabExitDoor({ position, rotationY = Math.PI / 2 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.72, 2.85, 0.12]} />
        <meshStandardMaterial color="#384049" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0.05]} castShadow>
        <boxGeometry args={[1.42, 2.62, 0.08]} />
        <meshStandardMaterial color="#576672" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.55, 0.095]}>
        <planeGeometry args={[0.55, 0.62]} />
        <meshPhysicalMaterial color="#cfe0da" roughness={0.2} transmission={0.4} clearcoat={0.6} />
      </mesh>
      {[-0.16, 0, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.098]}>
          <boxGeometry args={[0.012, 0.62, 0.004]} />
          <meshBasicMaterial color="#384049" />
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

// A small bench-top control console housing a rotary damping dial and a
// yield toggle switch — purely a visual anchor for the Doing Mode stations
// that adjust damping and enable/disable plastic deformation.
function ControlConsole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.14, 0.42]} />
        <meshStandardMaterial color="#37414a" roughness={0.45} metalness={0.25} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.045, 24]} />
        <meshStandardMaterial color="#7fa8c9" roughness={0.32} metalness={0.4} />
      </mesh>
      <mesh position={[-0.2, 0.125, 0.06]} castShadow>
        <boxGeometry args={[0.014, 0.03, 0.014]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.22, 0.09, 0]} castShadow>
        <boxGeometry args={[0.16, 0.03, 0.08]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.12, 0]} castShadow>
        <boxGeometry args={[0.045, 0.09, 0.045]} />
        <meshStandardMaterial color="#e6b23a" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function PhysicsLabRoom() { return <group><BlenderLabEnvironment {...BLENDER_LAB_LAYOUT} /><BlenderLabBench position={[0, -4, 0]} size={[8.8, 3.45]} height={2.06} />
<LabWallBoard />
<ControlConsole position={[CONSOLE_DAMPING_POS.x - 0.25, BENCH_TOP_Y, CONSOLE_DAMPING_POS.z - 0.15]} /></group>; }

// ---------------------------------------------------------------------------
// The simulated system: spring + mass, driven each frame
// ---------------------------------------------------------------------------

interface SimHandle {
  extensionM: number;
  velocity: number;
  settled: boolean;
  permanentExtensionM: number;
  beyondElasticLimit: boolean;
}

function SpringSystem({
  params,
  yieldLimitM,
  plasticityEnabled,
  resetKey,
  onTick,
  draggingRef,
  onLoadInteract,
}: {
  params: SpringParams;
  yieldLimitM: number;
  plasticityEnabled: boolean;
  resetKey: number;
  onTick: (state: SimHandle) => void;
  draggingRef: React.MutableRefObject<boolean>;
  onLoadInteract: () => void;
}) {
  const extensionRef = useRef(0); // total extension from the original natural length
  const velocityRef = useRef(0);
  const permanentStretchRef = useRef(0); // irreversible shift of the spring's zero-load length
  const groupRef = useRef<THREE.Group>(null);
  const [, setRenderTick] = useState(0);
  const settleTimerRef = useRef(0);
  const activePointerRef = useRef<number | null>(null);
  const { camera, gl } = useThree();
  const dragRaycaster = useMemo(() => new THREE.Raycaster(), []);
  const dragPointer = useMemo(() => new THREE.Vector2(), []);
  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const dragPoint = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    extensionRef.current = 0;
    velocityRef.current = 0;
    permanentStretchRef.current = 0;
    settleTimerRef.current = 0;
  }, [resetKey]);

  const setExtensionFromWorldY = useCallback(
    (worldY: number) => {
      const totalLenM = (ANCHOR_Y - worldY) / WORLD_SCALE;
      extensionRef.current = THREE.MathUtils.clamp(
        totalLenM - params.naturalLengthM,
        MIN_EXTENSION_M,
        MAX_EXTENSION_M
      );
      velocityRef.current = 0;
      settleTimerRef.current = 0;
    },
    [params.naturalLengthM]
  );

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const isUnloaded = params.massKg <= MIN_MASS_KG;

    let finalNetForce = 0;

    if (isUnloaded && !draggingRef.current) {
      const before = extensionRef.current;
      extensionRef.current = THREE.MathUtils.damp(
        extensionRef.current,
        permanentStretchRef.current,
        9,
        delta
      );
      velocityRef.current = delta > 0 ? (extensionRef.current - before) / delta : 0;
      finalNetForce = -params.stiffness * (extensionRef.current - permanentStretchRef.current);
    } else if (!draggingRef.current) {
      const dt = delta / SUBSTEPS;
      for (let s = 0; s < SUBSTEPS; s++) {
        const totalExtension = extensionRef.current;
        let elasticExtension = totalExtension - permanentStretchRef.current;
        let springForce = params.stiffness * elasticExtension;

        // One-dimensional elastoplastic return mapping with modest strain
        // hardening.  Below yield this is exactly F=kx; beyond yield the
        // spring acquires a permanent set and becomes much less compliant.
        if (plasticityEnabled) {
          const hardening = params.stiffness * 0.45;
          const yieldForce = params.stiffness * yieldLimitM;
          const currentLimit = yieldForce + hardening * Math.abs(permanentStretchRef.current);
          if (Math.abs(springForce) > currentLimit) {
            const sign = Math.sign(springForce) || 1;
            const plasticIncrement =
              ((Math.abs(springForce) - currentLimit) / (params.stiffness + hardening)) * sign;
            permanentStretchRef.current += plasticIncrement;
            elasticExtension = totalExtension - permanentStretchRef.current;
            springForce = params.stiffness * elasticExtension;
          }
        }

        const Fg = params.massKg * params.gravity;
        const Fd = -params.damping * velocityRef.current;
        finalNetForce = Fg - springForce + Fd;
        const a = finalNetForce / Math.max(params.massKg, 0.025);
        velocityRef.current += a * dt;
        extensionRef.current += velocityRef.current * dt;

        if (extensionRef.current > MAX_EXTENSION_M) {
          extensionRef.current = MAX_EXTENSION_M;
          velocityRef.current = -Math.abs(velocityRef.current) * 0.14;
        } else if (extensionRef.current < MIN_EXTENSION_M) {
          extensionRef.current = MIN_EXTENSION_M;
          velocityRef.current = Math.abs(velocityRef.current) * 0.14;
        }
      }
    }

    const settled =
      Math.abs(velocityRef.current) < 0.0035 &&
      Math.abs(finalNetForce) < 0.018 &&
      !draggingRef.current;
    if (settled) settleTimerRef.current += delta;
    else settleTimerRef.current = 0;

    if (groupRef.current) {
      const worldY = ANCHOR_Y - (params.naturalLengthM + extensionRef.current) * WORLD_SCALE;
      groupRef.current.position.y = worldY;
    }

    const elasticExtension = extensionRef.current - permanentStretchRef.current;
    onTick({
      extensionM: extensionRef.current,
      velocity: velocityRef.current,
      settled: settleTimerRef.current > 0.35,
      permanentExtensionM: permanentStretchRef.current,
      beyondElasticLimit:
        Math.abs(elasticExtension) >= yieldLimitM - 0.002 || Math.abs(permanentStretchRef.current) > 0.0005,
    });

    setRenderTick((t) => (t + 1) % 100000);
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation?.();
    onLoadInteract();
    draggingRef.current = true;
    activePointerRef.current = e.pointerId;
    gl.domElement.setPointerCapture?.(e.pointerId);
  }, [draggingRef, gl, onLoadInteract]);

  const releaseDrag = useCallback(() => {
    draggingRef.current = false;
    if (activePointerRef.current !== null) {
      if (gl.domElement.hasPointerCapture?.(activePointerRef.current)) {
        gl.domElement.releasePointerCapture?.(activePointerRef.current);
      }
      activePointerRef.current = null;
    }
  }, [draggingRef, gl]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const bounds = gl.domElement.getBoundingClientRect();
      dragPointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );
      dragRaycaster.setFromCamera(dragPointer, camera);
      if (dragRaycaster.ray.intersectPlane(dragPlane, dragPoint)) {
        setExtensionFromWorldY(dragPoint.y);
      }
    };

    gl.domElement.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", releaseDrag);
    window.addEventListener("pointercancel", releaseDrag);
    return () => {
      gl.domElement.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", releaseDrag);
      window.removeEventListener("pointercancel", releaseDrag);
    };
  }, [camera, dragPlane, dragPoint, dragPointer, dragRaycaster, draggingRef, gl, releaseDrag, setExtensionFromWorldY]);

  const totalLengthWorld = (params.naturalLengthM + extensionRef.current) * WORLD_SCALE;
  const wireThinning = THREE.MathUtils.clamp(1 - Math.max(0, extensionRef.current) * 0.42, 0.72, 1);

  return (
    <>
      <group position={[0, ANCHOR_Y, 0]}>
        <SpringCoil lengthWorld={totalLengthWorld} wireThinning={wireThinning} />
      </group>

      <group
        ref={groupRef}
        onPointerDown={handlePointerDown}
        onPointerUp={releaseDrag}
      >
        <SlottedMass massKg={params.massKg} y={0} />
      </group>
    </>
  );
}

// A pulsing ring dropped over whichever apparatus the player is currently
// looking at in Doing Mode — the "you can interact with this" affordance.
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
    <mesh ref={ringRef} position={[position.x, position.y, position.z]} visible={active} renderOrder={30}>
      <ringGeometry args={[0.22, 0.3, 40]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.85} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

// ---------------------------------------------------------------------------
// Scene wrapper
// ---------------------------------------------------------------------------

interface SceneModeProps {
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: { current: { x: number; y: number } };
  onTargetChange?: (target: Interactable | null) => void;
}

function Scene(props: Parameters<typeof SpringSystem>[0] & SceneModeProps) {
  const {
    mode = "learning",
    isMobile = false,
    interactables = [],
    activeTargetId = null,
    moveVectorRef,
    onTargetChange,
    ...springProps
  } = props;
  const { camera, size } = useThree();
  const isMobileFrame = size.width < 640;
  const cameraTarget = useMemo<[number, number, number]>(
    () => (isMobileFrame ? [0.05, 0.15, 0] : [0, 0.42, -0.05]),
    [isMobileFrame]
  );

  useEffect(() => {
    if (mode !== "learning") return;
    const cameraPosition: [number, number, number] = isMobileFrame
      ? [0.25, 0.65, 8.8]
      : [4, 1.42, 5.65];

    camera.position.set(...cameraPosition);
    camera.near = 0.08;
    camera.far = 80;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobileFrame ? 56 : 50;
    }
    camera.lookAt(...cameraTarget);
    camera.updateProjectionMatrix();
  }, [camera, cameraTarget, isMobileFrame, mode]);

  return (
    <>
      <color attach="background" args={["#b9c7c8"]} />
      <fog attach="fog" args={["#c4cecd", 16, 34]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#dcefff", "#6e5b48", 0.3]} />
      <directionalLight
        position={[5.5, 8, 6]}
        intensity={0.85}
        color="#fff7e2"
        castShadow
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={7}
        shadow-camera-bottom={-5}
      />
      <PhysicsLabRoom />
      <RetortStand />
      <MetreRule />
      <SpringSystem {...springProps} />

      {mode === "doing" &&
        interactables.map((item) => <InteractionHighlight key={item.id} position={item.position} active={item.id === activeTargetId} />)}

      {mode === "learning" ? (
        <OrbitControls
          makeDefault
          target={cameraTarget}
          minDistance={isMobileFrame ? 6.8 : 4.1}
          maxDistance={10.5}
          enablePan={false}
          minPolarAngle={0.9}
          maxPolarAngle={Math.PI / 1.82}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.07}
        />
      ) : (
        <PlayerController
          bounds={PLAYER_BOUNDS}
          obstacles={BENCH_OBSTACLES}
          spawn={PLAYER_SPAWN}
          eyeHeight={PLAYER_EYE_HEIGHT}
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
// Mini load–extension graph (custom inline SVG, no chart lib dependency)
// ---------------------------------------------------------------------------

function LoadExtensionGraph({ readings, gravity }: { readings: Reading[]; gravity: number }) {
  const width = 240;
  const height = 160;
  const pad = 28;

  const points = readings.map((r) => ({ x: r.extensionM, y: r.massKg * gravity }));
  const maxX = Math.max(0.02, ...points.map((p) => p.x)) * 1.15;
  const maxY = Math.max(0.05, ...points.map((p) => p.y)) * 1.15;

  const { slope, intercept, r2 } = linearRegression(points);

  const toPx = (x: number, y: number) => ({
    px: pad + (x / maxX) * (width - pad * 1.4),
    py: height - pad - (y / maxY) * (height - pad * 1.6),
  });

  const lineStart = toPx(0, intercept);
  const lineEnd = toPx(maxX, slope * maxX + intercept);

  return (
    <div className="rounded-xl bg-slate-900/70 border border-white/10 p-3">
      <svg width={width} height={height} className="overflow-visible">
        {/* axes */}
        <line x1={pad} y1={height - pad} x2={width - 6} y2={height - pad} stroke="#475569" strokeWidth={1} />
        <line x1={pad} y1={height - pad} x2={pad} y2={6} stroke="#475569" strokeWidth={1} />
        <text x={width / 2} y={height - 4} fill="#94a3b8" fontSize={9} textAnchor="middle">
          Extension (m)
        </text>
        <text
          x={10}
          y={height / 2}
          fill="#94a3b8"
          fontSize={9}
          textAnchor="middle"
          transform={`rotate(-90 10 ${height / 2})`}
        >
          Load (N)
        </text>

        {readings.length >= 2 && (
          <line
            x1={lineStart.px}
            y1={lineStart.py}
            x2={lineEnd.px}
            y2={lineEnd.py}
            stroke="#a855f7"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}

        {points.map((p, i) => {
          const { px, py } = toPx(p.x, p.y);
          return <circle key={i} cx={px} cy={py} r={3.2} fill="#f97316" />;
        })}
      </svg>
      <div className="mt-1 text-[11px] text-slate-300 space-y-0.5">
        <div>
          Gradient (k<sub>exp</sub>):{" "}
          <span className="font-bold text-purple-300">
            {readings.length >= 2 ? `${slope.toFixed(2)} N/m` : "— need ≥2 points"}
          </span>
        </div>
        {readings.length >= 2 && (
          <div className="text-slate-400">R² = {r2.toFixed(3)}</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

const SPRING_PRESETS = [
  { label: "Soft", k: 12 },
  { label: "Medium", k: 22 },
  { label: "Stiff", k: 36 },
];

const MASS_OPTIONS_G = [0, 50, 100, 150, 200, 250, 300, 350, 400];

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
    <div data-experiment-tour={`hooke-${id}`} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-inner shadow-white/[0.03] transition-all duration-300 hover:border-orange-300/30 hover:bg-white/[0.065]">
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

interface HookesLawPaperProps {
  stiffness: number;
  massKg: number;
  damping: number;
  gravity: number;
  liveExtension: number;
  predictedExtension: number;
  readings: Reading[];
  settled: boolean;
  permanentExtension: number;
  beyondElasticLimit: boolean;
  onClose: () => void;
}

function HookesLawPaper({
  stiffness,
  massKg,
  damping,
  gravity,
  liveExtension,
  predictedExtension,
  readings,
  settled,
  permanentExtension,
  beyondElasticLimit,
  onClose,
}: HookesLawPaperProps) {
  return (
    <ExperimentPaperModal filename="hookes-law-experiment-paper.html" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase tracking-wide">
          Verification of Hooke's Law
        </h1>

        <h2 className="mt-6 text-base font-bold uppercase">Aim</h2>
        <p className="mt-1">
          To verify that the extension of a spring is directly proportional to the applied load,
          provided the elastic limit is not exceeded.
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Apparatus &amp; Materials</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Retort stand, boss head, clamp and steel helical spring</li>
          <li>Mass hanger and 50 g slotted masses</li>
          <li>Vertical metre rule and rigid pointer</li>
          <li>Digital load-extension graph</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Methodology</h2>
        <ol className="mt-1 list-decimal space-y-1 pl-6">
          <li>The spring under test was selected with spring constant {stiffness} N/m.</li>
          <li>A mass of {(massKg * 1000).toFixed(0)} g was attached to the spring.</li>
          <li>The system was allowed to settle before each extension reading was recorded.</li>
          <li>The load was calculated using W = mg, with g = {gravity.toFixed(1)} m/s².</li>
          <li>The load-extension graph was used to check proportionality.</li>
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
              <td className="border border-slate-400 px-2 py-1">Current mass</td>
              <td className="border border-slate-400 px-2 py-1">{(massKg * 1000).toFixed(0)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Current load</td>
              <td className="border border-slate-400 px-2 py-1">{(massKg * gravity).toFixed(2)} N</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Measured extension</td>
              <td className="border border-slate-400 px-2 py-1">{(Math.max(0, liveExtension) * 100).toFixed(1)} cm</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Predicted extension, mg/k</td>
              <td className="border border-slate-400 px-2 py-1">{(predictedExtension * 100).toFixed(1)} cm</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Metre-rule reading, L</td>
              <td className="border border-slate-400 px-2 py-1">{((NATURAL_LENGTH_M + Math.max(0, liveExtension)) * 100).toFixed(1)} cm</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Permanent set after yielding</td>
              <td className="border border-slate-400 px-2 py-1">{(Math.max(0, permanentExtension) * 100).toFixed(2)} cm</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Damping</td>
              <td className="border border-slate-400 px-2 py-1">{damping.toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Status</td>
              <td className="border border-slate-400 px-2 py-1">
                {beyondElasticLimit ? "Elastic limit exceeded" : settled ? "Settled in elastic range" : "Oscillating"}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-6 text-base font-bold uppercase">Recorded Readings</h2>
        {readings.length > 0 ? (
          <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-1 text-left">Mass / g</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Load / N</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Extension / cm</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading, index) => (
                <tr key={`${reading.massKg}-${index}`}>
                  <td className="border border-slate-400 px-2 py-1">{(reading.massKg * 1000).toFixed(0)}</td>
                  <td className="border border-slate-400 px-2 py-1">{(reading.massKg * gravity).toFixed(2)}</td>
                  <td className="border border-slate-400 px-2 py-1">{(reading.extensionM * 100).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-1 italic text-slate-500">No readings have been recorded yet.</p>
        )}

        <h2 className="mt-6 text-base font-bold uppercase">Conclusion</h2>
        <p className="mt-1">
          If the load-extension graph is a straight line through the origin, the spring obeys
          Hooke's Law within the tested range.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

interface HookesLawSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const HOOKE_NARRATION = {
  intro: "/sounds/hookes-law/intro.mp3",
  tinasheIntro: "/sounds/hookes-law/tinashe_intro.mp3",
  complete: "/sounds/hookes-law/experiment_complete.mp3",
  steps: [
    "/sounds/hookes-law/step1_setup.mp3",
    "/sounds/hookes-law/step2_add_load.mp3",
    "/sounds/hookes-law/step3_more_loads.mp3",
    "/sounds/hookes-law/step4_graph.mp3",
    "/sounds/hookes-law/step5_elastic_limit.mp3",
  ],
} as const;

const HOOKE_EXPLANATIONS: readonly NarrationClip[] = [
  { label: "Introduction", src: HOOKE_NARRATION.intro },
  { label: "Step 1: Set up the spring", src: HOOKE_NARRATION.steps[0] },
  { label: "Step 2: Add the first load", src: HOOKE_NARRATION.steps[1] },
  { label: "Step 3: Add more loads", src: HOOKE_NARRATION.steps[2] },
  { label: "Step 4: The load-extension graph", src: HOOKE_NARRATION.steps[3] },
  { label: "Step 5: The elastic limit", src: HOOKE_NARRATION.steps[4] },
];

export default function HookesLawSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: HookesLawSimProps) {
  const [stiffness, setStiffness] = useState(22);
  const [massKg, setMassKg] = useState(0.1);
  const [damping, setDamping] = useState(0.6);
  const [gravity] = useState(9.8);
  const [plasticityEnabled, setPlasticityEnabled] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const [liveExtension, setLiveExtension] = useState(0);
  const [liveVelocity, setLiveVelocity] = useState(0);
  const [settled, setSettled] = useState(false);
  const [livePermanentStretch, setLivePermanentStretch] = useState(0);
  const [beyondElasticLimit, setBeyondElasticLimit] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [mobileSheetMode, setMobileSheetMode] = useState<"expanded" | "collapsed">("expanded");
  const dragStartYRef = useRef<number | null>(null);
  const massDraggingRef = useRef(false);
  const boingAudioRef = useRef<HTMLAudioElement | null>(null);

  const narrator = useExperimentNarrator();
  const [guideActive, setGuideActive] = useState(false);
  const narrationPlayback = useNarrationPlayback(narrator, HOOKE_NARRATION_TRACKS);
  // Actions the walkthrough stages inside a step run on the narrator's own
  // clock, so they land on the words that describe them and stop when it does.
  const cueRunner = useNarrationCueRunner(narrator);
  const clearDemoTimers = cueRunner.clear;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const naturalLengthM = NATURAL_LENGTH_M;
  const yieldLimitM = 0.32;

  const params: SpringParams = {
    massKg,
    stiffness,
    damping,
    gravity,
    naturalLengthM,
  };
  const isUnloaded = massKg <= MIN_MASS_KG;

  const predictedExtension = useMemo(
    () => equilibriumExtension(massKg, stiffness, gravity),
    [massKg, stiffness, gravity]
  );

  const handleTick = useCallback((state: SimHandle) => {
    setLiveExtension(state.extensionM);
    setLiveVelocity(state.velocity);
    setSettled(state.settled);
    setLivePermanentStretch(state.permanentExtensionM);
    setBeyondElasticLimit(state.beyondElasticLimit);
  }, []);

  const handleRecordReading = useCallback(() => {
    setReadings((prev) => {
      const next = [...prev, { massKg, extensionM: Math.max(0, liveExtension) }];
      next.sort((a, b) => a.massKg - b.massKg);
      return next;
    });
  }, [massKg, liveExtension]);

  const handleClearReadings = useCallback(() => setReadings([]), []);

  const handleResetSpring = useCallback(() => {
    setResetKey((k) => k + 1);
  }, []);

  const playBoing = useCallback((loadMassKg = massKg) => {
    if (!boingAudioRef.current) {
      const boing = new Audio("/sounds/spring_boing.mp3");
      boing.preload = "auto";
      boing.volume = 0.8;
      boingAudioRef.current = boing;
    }
    const boing = boingAudioRef.current;
    const loadRatio = THREE.MathUtils.clamp(loadMassKg / 0.4, 0, 1);
    boing.playbackRate = THREE.MathUtils.lerp(1.35, 0.7, loadRatio);
    boing.currentTime = 0;
    void boing.play().catch(() => undefined);
  }, [massKg]);

  const handleMassSelect = useCallback(
    (nextMassKg: number) => {
      setMassKg(nextMassKg);
      playBoing(nextMassKg);
    },
    [playBoing]
  );

  // --- Doing Mode: free-roam + walk-up interactions --------------------
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

  /**
   * World points the narration hand and the on-screen ruler attach to. The
   * spring hangs at x = 0 from `ANCHOR_Y`, so the natural length and the live
   * extension are both straightforward drops from there — which is exactly the
   * measurement the narrator talks the learner through.
   */
  const sceneAnchorsRef = useRef<Record<string, THREE.Vector3>>({});
  const sceneAnchorPointsRef = useRef<SceneAnchorPoints>({});
  const naturalBottomY = ANCHOR_Y - NATURAL_LENGTH_M * WORLD_SCALE;
  const springBottomY = ANCHOR_Y - (NATURAL_LENGTH_M + Math.max(0, liveExtension)) * WORLD_SCALE;
  sceneAnchorsRef.current = {
    springTop: new THREE.Vector3(0, ANCHOR_Y, 0),
    spring: new THREE.Vector3(0, (ANCHOR_Y + springBottomY) / 2, 0),
    naturalBottom: new THREE.Vector3(0, naturalBottomY, 0),
    springBottom: new THREE.Vector3(0, springBottomY, 0),
    mass: new THREE.Vector3(0, springBottomY - 0.28, 0),
    ruler: new THREE.Vector3(1.18, (ANCHOR_Y + naturalBottomY) / 2, 0),
  };

  // --- Narrated walkthrough ("Show me") --------------------------------
  /*
   * Step budgets and the timing of every action inside a step come from the
   * caption tracks, which were measured off the recordings themselves (see
   * `scripts/generate_narration_captions.mjs`). Re-recording a clip retimes the
   * scene with it.
   */
  const track = (src: string) => HOOKE_NARRATION_TRACKS[src];
  const stepDuration = (index: number, fallbackMs: number) =>
    trackDurationMs(track(HOOKE_NARRATION.steps[index]), fallbackMs);
  const stepCue = (index: number, phrase: string, fallbackMs: number) =>
    cueTimeMs(track(HOOKE_NARRATION.steps[index]), phrase, fallbackMs);

  const walkthroughSteps: WalkthroughStep[] = [
    {
      label: "Set up the spring",
      src: HOOKE_NARRATION.steps[0],
      durationMs: stepDuration(0, 19700),
      onEnter: () => {
        clearDemoTimers();
        setPlasticityEnabled(false);
        setReadings([]);
        setMassKg(MIN_MASS_KG);
        setResetKey((key) => key + 1);
      },
    },
    {
      label: "Add the first load",
      src: HOOKE_NARRATION.steps[1],
      durationMs: stepDuration(1, 26600),
      onEnter: () => {
        setMassKg(0.1);
        playBoing(0.1);
        cueRunner.schedule([
          { atMs: stepCue(1, "record the weight", 21000), run: () => handleRecordReading() },
        ]);
      },
    },
    {
      label: "Add more loads",
      src: HOOKE_NARRATION.steps[2],
      durationMs: stepDuration(2, 30400),
      // Three equal 50 g steps, each landing while the narrator is on the
      // sentence about adding the same extra weight every time.
      onEnter: () => {
        setMassKg(0.15);
        playBoing(0.15);
        cueRunner.schedule([
          { atMs: stepCue(2, "each time, wait", 5000), run: () => handleRecordReading() },
          {
            atMs: stepCue(2, "watch what is happening", 12000),
            run: () => {
              setMassKg(0.2);
              playBoing(0.2);
            },
          },
          {
            atMs: stepCue(2, "every time we add", 15000),
            run: () => {
              handleRecordReading();
              setMassKg(0.25);
              playBoing(0.25);
            },
          },
          { atMs: stepCue(2, "equal loads", 26000), run: () => handleRecordReading() },
        ]);
      },
    },
    {
      label: "Read the graph",
      src: HOOKE_NARRATION.steps[3],
      durationMs: stepDuration(3, 28100),
      onEnter: () => {
        setMassKg(0.3);
        playBoing(0.3);
        cueRunner.schedule([{ atMs: stepCue(3, "your points make", 9000), run: () => handleRecordReading() }]);
      },
    },
    {
      label: "Past the elastic limit",
      src: HOOKE_NARRATION.steps[4],
      durationMs: stepDuration(4, 30700),
      onEnter: () => {
        setPlasticityEnabled(true);
        cueRunner.schedule([
          {
            atMs: stepCue(4, "a very heavy load", 4000),
            run: () => {
              setMassKg(0.42);
              playBoing(0.42);
            },
          },
          {
            // The narrator says the spring does not come back — so the load has
            // to actually come off, or there is nothing to see.
            atMs: stepCue(4, "take the weight off", 18000),
            run: () => {
              setMassKg(MIN_MASS_KG);
              playBoing(MIN_MASS_KG);
            },
          },
        ]);
      },
    },
  ];

  const walkthrough = useNarratedWalkthrough({
    narrator,
    intro: HOOKE_NARRATION.intro,
    complete: HOOKE_NARRATION.complete,
    steps: walkthroughSteps,
    onStart: () => {
      clearDemoTimers();
      setGuideActive(false);
      setMode("learning");
      setShowTutorial(false);
    },
    onStop: () => {
      clearDemoTimers();
      setPlasticityEnabled(false);
      setMassKg(MIN_MASS_KG);
      setReadings([]);
      setResetKey((key) => key + 1);
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
    narrator.play(HOOKE_NARRATION.tinasheIntro);
  }, [guideActive, narrator.play, narrator.stop, walkthrough.active]);

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

  const massOptionsG = MASS_OPTIONS_G;

  // Doing Mode's world-space stations: the exact same handlers/state setters
  // the guided buttons already call, just reached by walking up and
  // pressing/holding instead of tapping a panel — no second source of truth.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const list: Interactable[] = [];

    const springIndex = SPRING_PRESETS.findIndex((p) => Math.abs(p.k - stiffness) < 0.01);
    const nextSpring = SPRING_PRESETS[(Math.max(0, springIndex) + 1) % SPRING_PRESETS.length];
    list.push({
      id: "spring-cycle",
      position: SPRING_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Change spring (next: ${nextSpring.label})`,
      onActivate: () => {
        setStiffness(nextSpring.k);
        handleResetSpring();
        handleClearReadings();
      },
    });

    const massIndex = MASS_OPTIONS_G.findIndex((g) => Math.abs(massKg * 1000 - g) < 1);
    const nextMassG = MASS_OPTIONS_G[(Math.max(0, massIndex) + 1) % MASS_OPTIONS_G.length];
    list.push({
      id: "mass-cycle",
      position: MASS_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Change load (next: ${nextMassG} g)`,
      onActivate: () => handleMassSelect(nextMassG / 1000),
    });

    list.push({
      id: "record-reading",
      position: RECORD_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: settled ? "Record reading" : "Waiting to settle",
      disabled: !settled,
      onActivate: handleRecordReading,
    });

    const dampingIndex = DAMPING_PRESETS.findIndex((d) => Math.abs(d - damping) < 0.01);
    const nextDamping = DAMPING_PRESETS[(Math.max(0, dampingIndex) + 1) % DAMPING_PRESETS.length];
    list.push({
      id: "damping-cycle",
      position: CONSOLE_DAMPING_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle damping (next: ${nextDamping.toFixed(2)})`,
      onActivate: () => setDamping(nextDamping),
    });

    list.push({
      id: "yield-toggle",
      position: CONSOLE_YIELD_POS,
      radius: INTERACTION_RADIUS,
      label: plasticityEnabled ? "Disable yield" : "Enable yield",
      onActivate: () => setPlasticityEnabled((v) => !v),
    });

    return list;
  }, [
    mode,
    stiffness,
    massKg,
    settled,
    damping,
    plasticityEnabled,
    handleResetSpring,
    handleClearReadings,
    handleMassSelect,
    handleRecordReading,
  ]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 sm:flex-row">
      <style>{`
        @keyframes futuristicSliderSweep {
          0% { background-position: 0% 50%; filter: brightness(1); }
          50% { background-position: 100% 50%; filter: brightness(1.18); }
          100% { background-position: 0% 50%; filter: brightness(1); }
        }
        @keyframes hookeHudIn {
          0% { opacity: 0; transform: translateY(-10px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes hookeHudGlow {
          0%, 100% { opacity: 0.35; transform: translateX(-18%); }
          50% { opacity: 0.9; transform: translateX(18%); }
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
      `}</style>
      <div data-experiment-tour="hooke-scene" className="relative min-h-0 flex-1">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          camera={{ position: [4.2, 1.4, 5.4], fov: 50 }}
          dpr={[1, 1.5]}
          className="h-full w-full"
        >
          <Scene
            params={params}
            yieldLimitM={yieldLimitM}
            plasticityEnabled={plasticityEnabled}
            resetKey={resetKey}
            onTick={handleTick}
            draggingRef={massDraggingRef}
            onLoadInteract={playBoing}
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
        />

        <ExperimentNarrationDock
          narrator={narrator}
          clips={HOOKE_EXPLANATIONS}
          walkthrough={walkthrough}
          guideActive={guideActive}
          onToggleGuide={toggleGuide}
          showMeLabel="Watch the narrated spring experiment run by itself"
          menuLabel="Hooke's law explanations"
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

        {/* Compact live readout, mobile */}
        <div data-experiment-tour="hooke-hud" className="absolute left-2 right-2 top-14 z-10 overflow-hidden rounded-2xl border border-fuchsia-200/20 bg-[linear-gradient(180deg,rgba(76,18,110,0.92),rgba(22,4,40,0.88))] p-2 text-xs text-slate-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.16),inset_0_-8px_18px_rgba(0,0,0,0.32),0_14px_34px_rgba(0,0,0,0.48),0_0_24px_rgba(168,85,247,0.28)] backdrop-blur-xl sm:hidden [animation:hookeHudIn_240ms_ease-out_both]">
          <div className="pointer-events-none absolute inset-x-3 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent [animation:hookeHudGlow_2.2s_ease-in-out_infinite]" />
          <div className="grid grid-cols-2 gap-2">
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/24 px-3 py-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.12),inset_0_-4px_0_rgba(0,0,0,0.22)]">
              <div className="pointer-events-none absolute inset-x-2 top-1 h-2 rounded-full bg-white/15 blur-[1px]" />
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Extension</div>
              <div className="mt-0.5 text-lg font-black leading-none text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.72)]">
                {Math.max(0, liveExtension * 100).toFixed(1)}
                <span className="ml-1 text-[10px] text-emerald-200/90">cm</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black/24 px-3 py-2 shadow-[inset_0_2px_0_rgba(255,255,255,0.12),inset_0_-4px_0_rgba(0,0,0,0.22)]">
              <div className="pointer-events-none absolute inset-x-2 top-1 h-2 rounded-full bg-white/15 blur-[1px]" />
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Status</div>
              <div
                className={`mt-0.5 truncate text-lg font-black leading-none ${
                  isUnloaded
                    ? "text-sky-300 drop-shadow-[0_0_10px_rgba(125,211,252,0.72)]"
                    : beyondElasticLimit
                      ? "text-red-300 drop-shadow-[0_0_10px_rgba(252,165,165,0.72)]"
                    : settled
                      ? "text-fuchsia-300 drop-shadow-[0_0_10px_rgba(240,171,252,0.72)]"
                      : "text-orange-300 drop-shadow-[0_0_10px_rgba(253,186,116,0.72)]"
                }`}
              >
                {isUnloaded ? "No load" : beyondElasticLimit ? "Over limit" : settled ? "Settled" : "Moving"}
              </div>
            </div>
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

      {/* Control panel: bottom sheet on mobile, right section on desktop */}
      <div
        data-experiment-tour="hooke-controls"
        className={`experiment-desktop-panel experiment-violet-panel overflow-hidden bg-slate-950/92 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/12 backdrop-blur-2xl sm:static sm:z-auto sm:h-full sm:w-[34%] sm:min-w-[340px] sm:max-w-[440px] sm:rounded-none sm:border-y-0 sm:border-r-0 sm:border-l sm:border-white/10 sm:shadow-none sm:ring-0 ${
          mode === "doing" ? "hidden" : "hidden sm:block"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-orange-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />
        <div
          onPointerDown={handleSheetPointerDown}
          onPointerUp={handleSheetPointerUp}
          className="relative sm:hidden touch-none select-none px-5 pt-3 pb-4"
        >
          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-300/80 shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-base font-black tracking-tight">Hooke's Law</div>
              <div className="text-xs text-slate-400">
                {mobileSheetMode === "expanded" ? "Swipe down to watch" : "Swipe up to edit"}
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-purple-300">{(Math.max(0, liveExtension) * 100).toFixed(1)} cm</div>
              <div className="text-slate-400">extension</div>
            </div>
          </div>
        </div>

        <div className="relative max-h-[78vh] space-y-4 overflow-y-auto p-5 pt-0 sm:h-full sm:max-h-none sm:p-4 sm:pt-4">
          <div className="hidden sm:flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black tracking-tight">Controls</h2>
              <p className="text-xs font-medium text-slate-400">Verification of Hooke's Law</p>
            </div>
          </div>
          <p className="hidden sm:block text-xs text-slate-400 -mt-2">
            Hang known loads, let the spring settle, record each reading, then check that the
            load–extension graph is a straight line through the origin.
          </p>

          {/* Spring stiffness preset — the "unknown" spring under test */}
          <div>
            <div className="text-sm mb-1 text-slate-300">Spring under test</div>
            <div data-experiment-tour="hooke-spring" className="grid grid-cols-3 gap-2">
              {SPRING_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setStiffness(p.k);
                    handleResetSpring();
                    handleClearReadings();
                  }}
                  className={`rounded-xl px-2 py-2 text-sm font-semibold transition-colors ${
                    Math.abs(stiffness - p.k) < 0.01
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30"
                      : "bg-white/6 text-slate-200 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-white/10 hover:ring-white/20"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mass selector — discrete slotted-weight increments */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label>Load (slotted mass)</label>
              <span className="font-bold text-purple-300">{massKg * 1000} g</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {massOptionsG.map((g) => (
                <button
                  key={g}
                  onClick={() => handleMassSelect(g / 1000)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                    Math.abs(massKg * 1000 - g) < 1
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-950/30"
                      : "bg-white/6 text-slate-300 ring-1 ring-white/10 hover:bg-white/10"
                  }`}
                >
                  {g}g
                </button>
              ))}
            </div>
          </div>

          <FuturisticSlider
            id="damping"
            label="Damping"
            value={damping}
            displayValue={damping.toFixed(2)}
            min={0.05}
            max={2}
            step={0.05}
            onChange={setDamping}
          />

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={plasticityEnabled}
              onChange={(e) => setPlasticityEnabled(e.target.checked)}
              className="h-4 w-4 accent-orange-500"
            />
            Enable plastic deformation past yield point
          </label>

          <div className="flex gap-2">
            <button
              data-experiment-tour="hooke-record"
              onClick={handleRecordReading}
              disabled={!settled}
              className="flex-1 rounded-2xl bg-orange-500 py-3 text-sm font-black text-white shadow-lg shadow-orange-950/35 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 disabled:translate-y-0 disabled:bg-slate-700 disabled:text-slate-400"
            >
              {settled ? "Record reading" : "Waiting to settle…"}
            </button>
            <button
              onClick={handleResetSpring}
              className="rounded-2xl bg-white/8 px-4 py-3 text-sm font-black text-slate-100 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:ring-white/20"
            >
              Reset
            </button>
          </div>

          <div data-experiment-tour="hooke-hud" className="grid grid-cols-3 gap-2 text-center text-xs text-slate-400">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-2 py-3">
              <div className="text-base font-black text-emerald-200">
                {(Math.max(0, liveExtension) * 100).toFixed(1)} cm
              </div>
              <div>Extension</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-2 py-3">
              <div className="text-base font-black text-emerald-200">{(predictedExtension * 100).toFixed(1)} cm</div>
              <div>Predicted (mg/k)</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] px-2 py-3">
              <div className="text-base font-black text-emerald-200">{readings.length}</div>
              <div>Readings</div>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-200/15 bg-sky-300/[0.055] px-3 py-2.5 text-xs text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span>Metre-rule reading, L</span>
              <span className="font-mono font-black text-sky-200">
                {((NATURAL_LENGTH_M + Math.max(0, liveExtension)) * 100).toFixed(1)} cm
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-slate-500">
              <span>L₀ = {(NATURAL_LENGTH_M * 100).toFixed(1)} cm</span>
              <span>|v| = {Math.abs(liveVelocity * 100).toFixed(2)} cm/s</span>
            </div>
          </div>

          {beyondElasticLimit && (
            <div className="rounded-2xl border border-red-300/35 bg-red-500/12 px-3 py-2.5 text-xs text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.12)]">
              <div className="font-black uppercase tracking-[0.12em]">Elastic limit exceeded</div>
              <div className="mt-1 text-red-200/80">
                {plasticityEnabled
                  ? `The spring now has ${(Math.max(0, livePermanentStretch) * 100).toFixed(2)} cm permanent set.`
                  : "Remove the load or enable plastic deformation to observe permanent set."}
              </div>
            </div>
          )}

          <div data-experiment-tour="hooke-graph" className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm text-slate-300">Load–extension graph</div>
              {readings.length > 0 && (
                <button
                  onClick={handleClearReadings}
                  className="text-[11px] font-semibold text-purple-300 hover:text-purple-200"
                >
                  Clear
                </button>
              )}
            </div>
            <LoadExtensionGraph readings={readings} gravity={gravity} />
            <div className="text-[11px] text-slate-500 mt-1">
              True spring constant: <span className="text-slate-300 font-semibold">{stiffness} N/m</span>
            </div>
          </div>
        </div>
      </div>
      {mode === "learning" && (
      <MobileExperimentControls
        actions={[
          {
            id: "record",
            label: settled ? "Record" : "Settle",
            onClick: handleRecordReading,
            disabled: !settled,
            tone: "orange",
          },
          {
            id: "reset",
            label: "Reset",
            onClick: handleResetSpring,
            tone: "dark",
          },
        ]}
        panels={[
          {
            id: "spring",
            label: "Spring",
            value: `${stiffness} N/m`,
            content: (
              <div className="grid grid-cols-3 gap-2">
                {SPRING_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setStiffness(p.k);
                      handleResetSpring();
                      handleClearReadings();
                    }}
                    className={`rounded-xl px-2 py-2 text-sm font-semibold transition-colors ${
                      Math.abs(stiffness - p.k) < 0.01
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
            id: "load",
            label: "Load",
            value: `${massKg * 1000} g`,
            content: (
              <div className="flex flex-wrap gap-1.5">
                {massOptionsG.map((g) => (
                  <button
                    key={g}
                    onClick={() => handleMassSelect(g / 1000)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 ${
                      Math.abs(massKg * 1000 - g) < 1
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-950/30"
                        : "bg-white/6 text-slate-300 ring-1 ring-white/10"
                    }`}
                  >
                    {g}g
                  </button>
                ))}
              </div>
            ),
          },
          {
            id: "damping",
            label: "Damping",
            value: damping.toFixed(2),
            content: (
              <FuturisticSlider
                id="mobile-hooke-damping"
                label="Damping"
                value={damping}
                displayValue={damping.toFixed(2)}
                min={0.05}
                max={2}
                step={0.05}
                onChange={setDamping}
              />
            ),
          },
          {
            id: "yield",
            label: "Yield",
            value: plasticityEnabled ? "on" : "off",
            content: (
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={plasticityEnabled}
                  onChange={(e) => setPlasticityEnabled(e.target.checked)}
                  className="h-4 w-4 accent-orange-500"
                />
                Enable plastic deformation past yield point
              </label>
            ),
          },
        ]}
        readouts={
          <>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-2 text-center text-[10px] text-slate-400">
              <div className="text-sm font-black text-emerald-200">{(Math.max(0, liveExtension) * 100).toFixed(1)} cm</div>
              <div>Extension</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-2 text-center text-[10px] text-slate-400">
              <div className="text-sm font-black text-emerald-200">{(predictedExtension * 100).toFixed(1)} cm</div>
              <div>Predicted</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-2 text-center text-[10px] text-slate-400">
              <div className="text-sm font-black text-emerald-200">{readings.length}</div>
              <div>Readings</div>
            </div>
          </>
        }
      />
      )}
      {showPaper && (
        <HookesLawPaper
          stiffness={stiffness}
          massKg={massKg}
          damping={damping}
          gravity={gravity}
          liveExtension={liveExtension}
          predictedExtension={predictedExtension}
          readings={readings}
          settled={settled}
          permanentExtension={livePermanentStretch}
          beyondElasticLimit={beyondElasticLimit}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? hookesHowToSteps : hookesTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
