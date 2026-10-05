import { ExperimentLabelProvider, LabLabel } from "./SeparationLabels";
"use client";

import "./separationControls.css";
import { RealisticBunsenBurner } from "./SeparationRealisticBunsenBurner";

import { BlenderLabProp, BlenderSteam } from './SeparationBlenderLabApparatus';
import { SeparationRoom, SeparationWorkbench } from "./SeparationRoom";

import type { ReactNode, MutableRefObject } from "react";
import { Fragment, Suspense, useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Html, useGLTF } from "@react-three/drei";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "./SeparationControls";
import { ExperimentTopBar } from "../../common/ExperimentGameChrome";
import { ExperimentHeaderPortal } from "../../common/ExperimentHeaderSlots";
import { FlaskConical, Play, BookOpen, Hand } from "lucide-react";
import { type PlayerBounds } from "./SeparationControls";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";
import * as THREE from "three";


// ---------------------------------------------------------------------------
// Constants & small helpers
// ---------------------------------------------------------------------------

type Stage = "mixing" | "filtering" | "drying" | "evaporating" | "results";

type EvapOutcome = "pending" | "perfect" | "wet" | "overheated";

const separationTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Level Start: Separation",
    text: "You are separating a salt and sand mixture using dissolving, filtration, drying, and evaporation.",
    mode: "modal",
  },
  {
    title: "How It Works",
    text: "Salt dissolves in water but sand does not. Filter out the sand, dry it, then evaporate the filtrate to recover salt crystals.",
    mode: "modal",
  },
  {
    title: "Recording Your Paper",
    text: "Each stage contributes observations. The Paper report records your method, recovered masses, efficiency, and conclusion.",
    mode: "modal",
  },
  {
    title: "Stage HUD",
    text: "This shows which stage you are on and the current progress for dissolving, filtering, drying, evaporation, or results.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-hud"]',
  },
  {
    title: "Lab Apparatus",
    text: "Watch the beakers, funnel, filter paper, burner, and evaporating basin as the experiment moves from stage to stage.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="separation-scene"]',
    sceneBox: { x: 0.08, y: 0.18, w: 0.84, h: 0.58 },
  },
  {
    title: "Game Controls",
    text: "Use the controls to add water, stir, pour, rinse, dry, heat, stop heating, and move to the next stage.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Paper Button",
    text: "Open Paper after the final result to generate the salt and sand separation practical report.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

const separationHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Separation",
    text: "Follow the practical in order: dissolve salt in water, filter out sand, rinse the residue, dry the sand, evaporate the filtrate, then inspect the recovered salt and sand.",
    mode: "modal",
  },
  {
    title: "1. Open Controls",
    text: "Tap Controls on mobile, or use the controls panel on desktop.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="controls"], [data-experiment-tour="separation-controls"]',
    actionSelector: '[data-mobile-experiment-action="controls"], [data-experiment-tour="separation-controls"]',
    actionLabel: "Tap Controls",
  },
  {
    title: "2. Add Water",
    text: "Click Add water. The water beaker pours into the mixture, then returns to its place.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-stage-action"]',
    actionSelector: '[data-experiment-tour="separation-stage-action"]',
    actionLabel: "Tap Add warm distilled water",
  },
  {
    title: "3. Dissolve Salt",
    text: "Hold the stir button until the salt dissolved bar reaches 100%. White salt particles disappear into solution while brown sand remains undissolved.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-stir"]',
    sceneSelector: '[data-experiment-tour="separation-scene"]',
    sceneBox: { x: 0.08, y: 0.2, w: 0.42, h: 0.48 },
  },
  {
    title: "4. Go To Filtration",
    text: "When dissolving reaches 100%, move to filtration. The next setup shows the funnel, filter paper, and receiving beaker.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="filtering"], [data-experiment-tour="separation-to-filtering"]',
    actionSelector: '[data-mobile-experiment-action="filtering"], [data-experiment-tour="separation-to-filtering"]',
    actionLabel: "Tap Proceed to filtration",
  },
  {
    title: "5. Pour Mixture",
    text: "Tap Pour mixture into funnel. The beaker lifts, tilts, and pours slurry into the filter. Sand collects on the filter paper while clear filtrate drips below.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-pour"]',
    actionSelector: '[data-experiment-tour="separation-pour"]',
    actionLabel: "Tap Pour mixture into funnel",
  },
  {
    title: "6. Rinse Residue",
    text: "After the beaker returns to the bench, rinse the filter residue. Rinse water washes remaining salt solution through while sand stays behind.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-rinse"]',
    actionSelector: '[data-experiment-tour="separation-rinse"]',
    actionLabel: "Tap Rinse residue",
  },
  {
    title: "7. Go To Drying",
    text: "Move to drying after filtration and rinsing. The sand residue is transferred to the drying mat and filter paper.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="drying"], [data-experiment-tour="separation-to-drying"]',
    actionSelector: '[data-mobile-experiment-action="drying"], [data-experiment-tour="separation-to-drying"]',
    actionLabel: "Tap Proceed to drying",
  },
  {
    title: "8. Dry Sand",
    text: "Use Fast-forward to dry the sand. The residue becomes lighter as water leaves it.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-fast-forward"]',
    actionSelector: '[data-experiment-tour="separation-fast-forward"]',
    actionLabel: "Tap Fast-forward",
  },
  {
    title: "9. Go To Evaporation",
    text: "When sand drying reaches 100%, move to evaporation. The filtrate is now heated in an evaporating basin.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="evap"], [data-experiment-tour="separation-to-evaporation"]',
    actionSelector: '[data-mobile-experiment-action="evap"], [data-experiment-tour="separation-to-evaporation"]',
    actionLabel: "Tap Proceed to evaporation",
  },
  {
    title: "10. Heat Filtrate",
    text: "Strike the Bunsen burner. The flame heats the basin, vapor rises, the water level falls, and salt crystals gradually appear.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-strike"]',
    actionSelector: '[data-experiment-tour="separation-strike"]',
    actionLabel: "Tap Strike Bunsen burner",
  },
  {
    title: "11. Stop Heating",
    text: "Turn off the burner as the solution becomes concentrated and crystals appear. Stopping too early leaves excess water; heating too long causes spitting and sample loss.",
    mode: "bubble",
    selector: '[data-experiment-tour="separation-stop-heating"]',
    actionSelector: '[data-experiment-tour="separation-stop-heating"]',
    actionLabel: "Tap Turn off burner",
  },
  {
    title: "12. See Results",
    text: "Open final results to compare recovered sand and salt. The table shows a visible pile of recovered salt crystals.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="results"], [data-experiment-tour="separation-to-results"]',
    actionSelector: '[data-mobile-experiment-action="results"], [data-experiment-tour="separation-to-results"]',
    actionLabel: "Tap See final results",
  },
  {
    title: "13. Inspect The Apparatus",
    text: "Review the final scene: dry sand remains on the filter paper and recovered salt crystals are shown on the table.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="separation-scene"]',
    sceneBox: { x: 0.06, y: 0.16, w: 0.88, h: 0.64 },
  },
  {
    title: "14. Open Paper",
    text: "Tap Paper to open the salt and sand separation practical report.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
    actionSelector: '[data-experiment-tour="paper"] button',
    actionLabel: "Tap Paper",
  },
  {
    title: "15. Download Paper",
    text: "Tap Download to save the generated separation practical paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper-download"]',
    actionSelector: '[data-experiment-tour="paper-download"]',
    actionLabel: "Tap Download",
  },
  {
    title: "Congratulations",
    text: "You now know the full salt and sand separation practical: dissolving, filtration, rinsing, drying, evaporation, final observations, and paper download.",
    mode: "modal",
  },
];

const BASE_MIXTURE_MASS = 10.0; // grams
const BASE_SAND_FRACTION = 0.54;
const BASE_SALT_FRACTION = 1 - BASE_SAND_FRACTION;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

const safePlay = (audio: HTMLAudioElement) => {
  void audio.play().catch(() => undefined);
};
const stopAudio = (audio: HTMLAudioElement) => {
  audio.pause();
  audio.currentTime = 0;
};

// Positions used by the rig, kept in one place so every stage agrees on where
// things sit on the bench.
const MIX_BEAKER_POS = new THREE.Vector3(-3.6, 0, 1.1);
const RECEIVER_BEAKER_POS = new THREE.Vector3(-0.4, 0, 1.1);
const FUNNEL_POS = new THREE.Vector3(-0.4, 1.05, 1.1);
const TRIPOD_POS = new THREE.Vector3(2.6, 0, -0.4);
const BASIN_POS = new THREE.Vector3(2.6, 0.86, -0.4);
const BURNER_POS = new THREE.Vector3(2.6, 0, -0.4);
const RECOVERED_SALT_POS = new THREE.Vector3(0.8, 0, 2.65);
const MAT_AREA_POS = new THREE.Vector3(-3.6, 0.02, -1.6);
const WASH_BOTTLE_POS = new THREE.Vector3(RECEIVER_BEAKER_POS.x + 0.95, 0, RECEIVER_BEAKER_POS.z + 0.08);

// Doing Mode: the player walks up and down the working surface at bench-top
// height, staying within reach of every station rather than on the room's
// literal floor plane (which sits far below this stylized scene's bench datum).
// The player roams the whole floor — well back from the bench and around
// either side of it — rather than being glued to a narrow strip against it.
const PLAYER_BOUNDS: PlayerBounds = { minX: -20.5, maxX: 20.5, minZ: -9, maxZ: 20.5 };
const BENCH_OBSTACLES: PlayerBounds[] = [
  { minX: -8, maxX: 8, minZ: -4, maxZ: 4 },
  { minX: -11.2, maxX: -8.8, minZ: -2, maxZ: 4.4 },
  { minX: 8.8, maxX: 11.2, minZ: -2, maxZ: 4.4 },
];
const PLAYER_SPAWN = new THREE.Vector3(0, 0, 5.5);
const INTERACTION_RADIUS = 3.9;

const WATER_STREAM_START_PROGRESS = 25;
const WATER_CONTACT_PROGRESS = 33;
const WATER_STREAM_END_PROGRESS = 78;
const SPLASH_COLORS = ["#bfe4ff", "#e0f2fe", "#93c5fd"];
const DRIP_COLORS = ["#bfe4ff", "#dbeafe"];
const RINSE_COLORS = ["#bae6fd", "#e0f2fe"];

const smoothstep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

// ---------------------------------------------------------------------------
// Reusable particle burst (splash / steam / drip / crystal sparkle)
// ---------------------------------------------------------------------------

interface BurstState {
  key: number;
  origin: THREE.Vector3;
}

function ParticleBurst({
  burst,
  colors,
  count,
  duration,
  spread,
  rise,
  size,
  continuous = false,
}: {
  burst: BurstState;
  colors: string[];
  count: number;
  duration: number;
  spread: number;
  rise: number;
  size: number;
  continuous?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(duration + 1);
  const lastKeyRef = useRef(burst.key);
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.15 + Math.random() * spread;
        return {
          start: new THREE.Vector3((Math.random() - 0.5) * spread * 0.2, 0, (Math.random() - 0.5) * spread * 0.2),
          velocity: new THREE.Vector3(Math.cos(angle) * speed, Math.random() * rise, Math.sin(angle) * speed),
          delay: Math.random() * 0.3,
          lifetime: 0.5 + Math.random() * 0.5,
          scale: 0.5 + Math.random() * 0.9,
          color: colors[index % colors.length],
        };
      }),
    [colors, count, rise, spread]
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (!continuous && lastKeyRef.current !== burst.key) {
      lastKeyRef.current = burst.key;
      elapsedRef.current = 0;
    }
    group.position.copy(burst.origin);

    if (continuous) {
      elapsedRef.current += delta;
      group.visible = true;
    } else {
      elapsedRef.current += delta;
      const progress = elapsedRef.current / duration;
      if (progress >= 1) {
        group.visible = false;
        return;
      }
      group.visible = true;
    }

    const loopT = continuous ? elapsedRef.current % duration : elapsedRef.current;
    const progress = loopT / duration;

    group.children.forEach((child, index) => {
      const particle = particles[index];
      const localProgress = clamp((progress - particle.delay) / particle.lifetime, 0, 1);
      const opacity = localProgress <= 0 ? 0 : Math.sin(Math.min(1, localProgress * 1.6) * Math.PI * 0.5) * (1 - localProgress) * 0.8;
      child.position.set(
        particle.start.x + particle.velocity.x * localProgress,
        particle.start.y + particle.velocity.y * localProgress,
        particle.start.z + particle.velocity.z * localProgress
      );
      child.scale.setScalar(size * particle.scale * (0.6 + localProgress * 0.5));
      const material = (child as THREE.Mesh).material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = opacity;
      }
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {particles.map((particle, index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// School laboratory and bench apparatus
// ---------------------------------------------------------------------------

function WallClockFace() {
  const clockTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const cx = 128;
    const cy = 128;
    const r = 118;

    context.fillStyle = "#fbfbf7";
    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2);
    context.fill();
    context.lineWidth = 6;
    context.strokeStyle = "#1f2937";
    context.stroke();

    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      const isMajor = index % 3 === 0;
      context.lineWidth = isMajor ? 5 : 2.5;
      context.strokeStyle = "#1f2937";
      const outer = r - 8;
      const inner = outer - (isMajor ? 18 : 10);
      context.beginPath();
      context.moveTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
      context.lineTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      context.stroke();
    }

    context.strokeStyle = "#111827";
    context.lineCap = "round";
    context.lineWidth = 7;
    context.beginPath();
    context.moveTo(cx, cy);
    const hourAngle = -Math.PI / 2 + (Math.PI * 2 * 10) / 12;
    context.lineTo(cx + Math.cos(hourAngle) * 56, cy + Math.sin(hourAngle) * 56);
    context.stroke();
    context.lineWidth = 4.5;
    context.beginPath();
    context.moveTo(cx, cy);
    const minuteAngle = -Math.PI / 2 + (Math.PI * 2 * 20) / 60;
    context.lineTo(cx + Math.cos(minuteAngle) * 92, cy + Math.sin(minuteAngle) * 92);
    context.stroke();

    context.fillStyle = "#111827";
    context.beginPath();
    context.arc(cx, cy, 6, 0, Math.PI * 2);
    context.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useEffect(() => () => clockTexture?.dispose(), [clockTexture]);

  return (
    <group position={[-1.55, 4.55, -7.0]}>
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[0.38, 40]} />
        <meshStandardMaterial color="#1f2937" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.34, 40]} />
        <meshBasicMaterial map={clockTexture ?? undefined} color={clockTexture ? "#ffffff" : "#fbfbf7"} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RadiatorPanel({ position, width = 2.6 }: { position: [number, number, number]; width?: number }) {
  const ribCount = Math.max(4, Math.round(width / 0.12));
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[width, 0.62, 0.1]} />
        <meshStandardMaterial color="#f4f6f2" roughness={0.42} metalness={0.15} />
      </mesh>
      {Array.from({ length: ribCount }, (_, index) => (
        <mesh key={index} position={[-width / 2 + 0.06 + index * ((width - 0.12) / (ribCount - 1)), 0, 0.058]}>
          <boxGeometry args={[0.02, 0.56, 0.012]} />
          <meshStandardMaterial color="#dfe4de" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// A small low-poly tree, glimpsed through the window glass to suggest grounds outside.
function LeafyTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.6, 6]} />
        <meshStandardMaterial color="#5b4632" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.75, 0]}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial color="#3f7d4a" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[0.14, 0.62, 0.08]}>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial color="#4f9059" roughness={0.95} flatShading />
      </mesh>
      <mesh position={[-0.16, 0.66, -0.06]}>
        <icosahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial color="#3f7d4a" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}

function BenchSinkInsert({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[0.62, 0.02, 0.42]} />
        <meshStandardMaterial color="#c3c9cb" metalness={0.75} roughness={0.32} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.18, 24]} />
        <meshStandardMaterial color="#a9b0b2" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.24, -0.14]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.34, 12]} />
        <meshStandardMaterial color="#8b9396" metalness={0.85} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.4, -0.14]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
        <meshStandardMaterial color="#8b9396" metalness={0.85} roughness={0.24} />
      </mesh>
    </group>
  );
}

function GasTapRiser({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial color="#e9e4d3" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.14, 14]} />
        <meshStandardMaterial color="#8a6d3a" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.09, 0.24, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.16, 12]} />
        <meshStandardMaterial color="#c7922f" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Simplified extra student bench rows, seen further into the room, so the lab
// reads as a full classroom rather than a single isolated workstation.
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

function BackgroundBenchRow({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.2]}>
      <mesh position={[0, -0.16, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.32, 6.4]} />
        <meshStandardMaterial color="#e4e7e3" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.012, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.025, 6.4]} />
        <meshPhysicalMaterial color="#f4f5f0" roughness={0.28} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
      {[-2.6, 0, 2.6].map((z) => (
        <mesh key={z} position={[0, -1.11, z]} castShadow>
          <boxGeometry args={[2.05, 1.9, 0.4]} />
          <meshStandardMaterial color="#465159" metalness={0.5} roughness={0.42} />
        </mesh>
      ))}
      <BenchSinkInsert position={[0, 0.03, -1.6]} />
      <GasTapRiser position={[0, 0.03, 1.4]} />
    </group>
  );
}

function LaboratoryRoom() {
  return <group>
    <SeparationRoom />
    <BackgroundBenchRow x={-10} />
    <BackgroundBenchRow x={10} />
  </group>;
}

function Bench() { return <group><SeparationWorkbench /><BenchSinkInsert position={[-5.6, 0.03, -1.3]} />
<GasTapRiser position={[5.3, 0.03, -1.3]} /></group>; }

function LiquidFill({ radius, level, color, motion = 0, tilt = 0, capacity = Infinity }: {
  radius: number; level: number; color: string; opacity?: number; motion?: number; tilt?: number; capacity?: number;
}) {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const shimmerRef = useRef<THREE.Mesh>(null);
  const energyRef = useRef(0);
  const angleRef = useRef(0);
  const innerRadius = radius * 0.88;
  const surfaceGeometry = useMemo(() => new THREE.RingGeometry(0, innerRadius, 64, 10).rotateX(-Math.PI / 2), [innerRadius]);
  const bodyGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(innerRadius, innerRadius, 1, 64, 8);
    geometry.translate(0, 0.5, 0);
    return geometry;
  }, [innerRadius]);
  const bodyHeights = useMemo(() => {
    const positions = bodyGeometry.getAttribute("position");
    return Float32Array.from({ length: positions.count }, (_, index) => positions.getY(index));
  }, [bodyGeometry]);
  useEffect(() => () => { surfaceGeometry.dispose(); bodyGeometry.dispose(); }, [surfaceGeometry, bodyGeometry]);

  useFrame((_, delta) => {
    const target = clamp(motion, 0, 1);
    energyRef.current = THREE.MathUtils.damp(energyRef.current, target, target > energyRef.current ? 6 : 1.8, delta);
    const energy = energyRef.current;
    angleRef.current += energy * delta * 7;
    const depth = Math.min(level * 0.12, 0.035 * energy * energy);
    // Gravity keeps the liquid surface horizontal as the vessel tilts. A
    // shallow central depression forms only when angular momentum builds.
    const topAt = (x: number, z: number) => {
      const r2 = (x * x + z * z) / (innerRadius * innerRadius);
      const wave = Math.sin(Math.atan2(z, x) * 2 - angleRef.current) * energy * 0.003 * r2;
      return clamp(level - x * Math.tan(tilt) + depth * (r2 - 0.5) + wave, 0.001, capacity);
    };
    const surface = surfaceGeometry.getAttribute("position");
    for (let i = 0; i < surface.count; i++) surface.setY(i, topAt(surface.getX(i), surface.getZ(i)));
    surface.needsUpdate = true;
    surfaceGeometry.computeVertexNormals();
    const body = bodyGeometry.getAttribute("position");
    for (let i = 0; i < body.count; i++) body.setY(i, bodyHeights[i] * topAt(body.getX(i), body.getZ(i)));
    body.needsUpdate = true;
    bodyGeometry.computeVertexNormals();
    if (shimmerRef.current) {
      shimmerRef.current.visible = Math.abs(tilt) < 0.15;
      shimmerRef.current.rotation.z = -angleRef.current;
      shimmerRef.current.position.y = level + 0.004;
    }
  });
  if (level <= 0.002) return null;
  return (
    <group>
      <mesh ref={bodyRef} geometry={bodyGeometry} renderOrder={5}>
        <meshPhysicalMaterial color={color} transparent opacity={0.3} transmission={0.25} roughness={0.08} depthWrite={false} />
      </mesh>
      <mesh ref={surfaceRef} geometry={surfaceGeometry} renderOrder={6}>
        <meshPhysicalMaterial color={color} transparent opacity={0.5} roughness={0.06} metalness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={shimmerRef} position={[0, level + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={8}>
        <ringGeometry args={[innerRadius * 0.38, innerRadius * 0.4, 64, 1, 0.2, Math.PI * 0.55]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function GrainBed({
  radius,
  sandFraction,
  saltFraction,
  height = 0.16,
  rinsing = false,
}: {
  radius: number;
  sandFraction: number;
  saltFraction: number;
  height?: number;
  rinsing?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const grains = useMemo(
    () =>
      Array.from({ length: 220 }, (_, index) => {
        const isSalt = index % 3 === 0;
        const angle = index * 2.399;
        const distance = Math.sqrt(((index * 37) % 100) / 100) * radius * 0.78;
        return {
          isSalt,
          x: Math.cos(angle) * distance,
          z: Math.sin(angle) * distance,
          y: ((index * 17) % 100) / 100,
          size: isSalt ? 0.012 + ((index * 7) % 4) * 0.0015 : 0.011 + ((index * 11) % 6) * 0.0015,
          phase: index * 0.73,
        };
      }),
    [radius]
  );
  const sandVisible = clamp(sandFraction / BASE_SAND_FRACTION, 0, 1);
  const saltVisible = clamp(saltFraction / BASE_SALT_FRACTION, 0, 1);
  const visibleAmount = Math.max(sandVisible, saltVisible);
  // Per-grain eased height so the bed settles under gravity instead of
  // snapping to its target level the instant visibleAmount changes.
  const settledHeightRef = useRef<Float32Array | null>(null);
  if (!settledHeightRef.current || settledHeightRef.current.length !== grains.length) {
    settledHeightRef.current = new Float32Array(grains.length).fill(0.035);
  }

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const settled = settledHeightRef.current;
    groupRef.current.children.forEach((child, index) => {
      const grain = child.userData.grain as (typeof grains)[number] | undefined;
      if (!grain || !settled) return;
      const agitation = rinsing ? (grain.isSalt ? 1 : 0.22) : 0;
      const targetHeight = 0.035 + grain.y * height * visibleAmount;
      // Denser sand settles quickly under gravity; dissolved salt fades in
      // more gently since it's precipitating rather than falling.
      const settleRate = grain.isSalt ? 2.6 : 5.4;
      settled[index] += (targetHeight - settled[index]) * clamp(delta * settleRate, 0, 1);
      child.position.set(
        grain.x + Math.sin(t * 5 + grain.phase) * 0.006 * agitation,
        settled[index] + Math.sin(t * 8 + grain.phase) * 0.004 * agitation,
        grain.z + Math.cos(t * 5.4 + grain.phase) * 0.006 * agitation
      );
    });
  });

  if (visibleAmount <= 0.01) return null;

  return (
    <group ref={groupRef}>
      <mesh position={[0, height * 0.28 * visibleAmount, 0]}>
        <cylinderGeometry args={[radius * 0.82, radius * 0.68, Math.max(height * 0.28 * visibleAmount, 0.025), 24]} />
        <meshStandardMaterial color="#8b7350" transparent opacity={0.38} roughness={1} />
      </mesh>
      {grains.map((grain, index) => {
        const visible = grain.isSalt ? index / 220 < saltVisible * 0.34 : index / 220 < sandVisible;
        if (!visible) return null;
        return (
          <mesh key={index} userData={{ grain }} position={[grain.x, 0.035 + grain.y * height * visibleAmount, grain.z]} castShadow>
            {grain.isSalt ? (
              <boxGeometry args={[grain.size * 1.7, grain.size * 1.7, grain.size * 1.7]} />
            ) : (
              <dodecahedronGeometry args={[grain.size, 0]} />
            )}
            <meshStandardMaterial
              color={grain.isSalt ? "#f8fafc" : index % 2 === 0 ? "#8a6f47" : "#b08a55"}
              roughness={grain.isSalt ? 0.35 : 1}
              metalness={0}
              emissive={grain.isSalt ? "#e2e8f0" : "#000000"}
              emissiveIntensity={grain.isSalt ? 0.08 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Use the same glass model and materials as the photosynthesis experiment.
function PhotosynthesisBeakerShell({ radius, height }: { radius: number; height: number }) {
  const { scene } = useGLTF("/models/science-lab/props/photosynthesis-beaker.glb");
  const model = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return copy;
  }, [scene]);

  return (
    <primitive object={model} dispose={null}
      position={[-radius * 0.105, -height / 2 - height * (0.065 / 8.4), 0]}
      rotation={[0, Math.PI, 0]}
      scale={[radius / 3.28, height / 8.4, radius / 3.28]} />
  );
}

function Beaker({
  position,
  name,
  radius = 0.55,
  height = 1.1,
  liquidLevel = 0,
  liquidColor = "#bfe4ff",
  sandFraction = 0,
  saltFraction = 0,
  tilt = 0,
  liquidMotion = 0,
  label,
  labelPosition,
}: {
  position: THREE.Vector3;
  name?: string;
  radius?: number;
  height?: number;
  liquidLevel?: number;
  liquidColor?: string;
  sandFraction?: number;
  saltFraction?: number;
  tilt?: number;
  liquidMotion?: number;
  label?: string;
  labelPosition?: [number, number, number];
}) {
  const labelPos = labelPosition ?? [0, -0.04, radius + 0.035];
  return (
    // Treat position.y as the bench contact point so the beaker sits on top of
    // the table instead of being centered through it.
    <group name={name} position={[position.x, position.y + height / 2, position.z]} rotation={[0, 0, tilt]}>
      <Suspense fallback={null}>
        <PhotosynthesisBeakerShell radius={radius} height={height} />
      </Suspense>
      <group position={[0, -height / 2 + 0.02, 0]}>
        <GrainBed radius={radius} sandFraction={sandFraction} saltFraction={saltFraction} height={0.16} />
        <LiquidFill radius={radius} level={liquidLevel} color={liquidColor} motion={liquidMotion} tilt={tilt} capacity={height - 0.04} />
      </group>
      {label && (
        <LabLabel position={labelPos} center transform distanceFactor={7.2} occlude zIndexRange={[4, 0]} style={{ pointerEvents: "none" }}>
          <div className="w-[92px] border border-stone-300 bg-stone-50 px-1.5 py-1 text-center text-[8px] font-bold leading-tight text-stone-800 shadow-sm">
            {label}
          </div>
        </LabLabel>
      )}
    </group>
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
    <mesh ref={ringRef} position={[position.x, position.y + 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]} visible={active} renderOrder={30}>
      <ringGeometry args={[0.4, 0.5, 40]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.85} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function StirRod({ position, stirring, speed, height = 1.3 }: { position: THREE.Vector3; stirring: boolean; speed: number; height?: number }) {
  const ref = useRef<THREE.Group>(null);
  const angleRef = useRef(0);
  const speedRef = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = stirring ? clamp(speed / 100, 0, 1) : 0;
    speedRef.current = THREE.MathUtils.damp(speedRef.current, target, 10, delta);
    angleRef.current += delta * speedRef.current * 7;
    const angle = angleRef.current;
    const orbit = 0.19;
    ref.current.position.set(position.x + Math.cos(angle) * orbit, position.y + 0.075, position.z + Math.sin(angle) * orbit);
    // The bottom stays above the glass base; a small inward lean keeps the
    // upper rod clear of the rim throughout its circular path.
    ref.current.rotation.set(-Math.sin(angle) * 0.1, 0, Math.cos(angle) * 0.1);
  });
  return (
    <group ref={ref} position={[position.x + 0.19, position.y + 0.075, position.z]}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.018, 0.018, height, 16]} />
        <meshPhysicalMaterial color="#eefaff" transparent opacity={1} roughness={0.025} transmission={0.94} thickness={0.015} ior={1.46} clearcoat={1} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshPhysicalMaterial color="#eefaff" transparent opacity={1} roughness={0.025} transmission={0.94} thickness={0.015} ior={1.46} clearcoat={1} />
      </mesh>
    </group>
  );
}

function MovingSaltSpecks({ active, inFilter = false }: { active: boolean; inFilter?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const specks = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        offset: index / 30,
        phase: index * 0.91,
        size: 0.009 + (index % 3) * 0.0015,
      })),
    []
  );
  const from = FUNNEL_POS.clone().add(new THREE.Vector3(0.02, -0.16, 0));
  const to = RECEIVER_BEAKER_POS.clone().add(new THREE.Vector3(0.05, 0.86, 0));
  const mid = from.clone().add(to).multiplyScalar(0.5).add(new THREE.Vector3(0, -0.12, 0));
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(from, mid, to), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, index) => {
      const speck = specks[index];
      const p = curve.getPoint((speck.offset + t * 0.55) % 1);
      if (inFilter) {
        const swirl = (speck.offset + t * 0.45) % 1;
        const angle = speck.phase + t * 5 + swirl * Math.PI * 2;
        const radius = 0.22 * (1 - swirl * 0.55);
        child.position.set(Math.cos(angle) * radius, -0.11 - swirl * 0.07, Math.sin(angle) * radius);
      } else {
        child.position.set(p.x + Math.sin(t * 8 + speck.phase) * 0.012, p.y, p.z + Math.cos(t * 7 + speck.phase) * 0.012);
      }
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {specks.map((speck, index) => (
        <mesh key={index}>
          <sphereGeometry args={[speck.size, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.82} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function MovingSlurryParticles({ active, from, to }: { active: boolean; from: THREE.Vector3; to: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useMemo(
    () =>
      Array.from({ length: 46 }, (_, index) => ({
        isSand: index % 4 !== 0,
        offset: index / 46,
        phase: index * 0.77,
        size: index % 4 === 0 ? 0.008 : 0.01 + (index % 3) * 0.0015,
      })),
    []
  );
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5)
      .setY(from.y - Math.min(Math.max(0, from.y - to.y) * 0.15, 0.24));
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }, [from, to]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, index) => {
      const particle = particles[index];
      const p = curve.getPoint((particle.offset + t / Math.max(0.12, Math.sqrt(2 * Math.max(0.05, from.y - to.y) / 9.81))) % 1);
      child.position.set(
        p.x, p.y, p.z
      );
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {particles.map((particle, index) => (
        <mesh key={index}>
          <sphereGeometry args={[particle.size, 7, 6]} />
          <meshBasicMaterial color={particle.isSand ? (index % 2 === 0 ? "#7c5f38" : "#b08a55") : "#ffffff"} transparent opacity={particle.isSand ? 0.92 : 0.78} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FilterSurfaceAction({ pouring, rinsing }: { pouring: boolean; rinsing: boolean }) {
  const rippleRef = useRef<THREE.Mesh>(null);
  const poolRef = useRef<THREE.Mesh>(null);
  const centerFlowRef = useRef<THREE.Mesh>(null);
  const washRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (poolRef.current) {
      poolRef.current.visible = pouring || rinsing;
      poolRef.current.scale.set(1 + Math.sin(t * 5) * 0.04, 1 + Math.cos(t * 4.4) * 0.035, 1);
      const material = poolRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = pouring ? 0.34 : rinsing ? 0.24 : 0;
      }
    }
    if (rippleRef.current) {
      rippleRef.current.visible = pouring || rinsing;
      rippleRef.current.scale.setScalar(0.75 + (t % 0.9) * 0.45);
      const material = rippleRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = (pouring ? 0.26 : 0.18) * (1 - (t % 0.9) / 0.9);
      }
    }
    if (centerFlowRef.current) {
      centerFlowRef.current.visible = pouring || rinsing;
      centerFlowRef.current.rotation.y = t * 1.4;
      const material = centerFlowRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = 0.28 + Math.sin(t * 10) * 0.07;
      }
    }
    if (washRef.current) {
      washRef.current.visible = rinsing;
      washRef.current.rotation.z = Math.sin(t * 6) * 0.2;
      const material = washRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = 0.2 + Math.sin(t * 8) * 0.06;
      }
    }
  });

  return (
    <group position={[0, -0.16, 0]}>
      <mesh ref={poolRef} position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false} renderOrder={16}>
        <circleGeometry args={[0.31, 48]} />
        <meshBasicMaterial color="#bdefff" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={rippleRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.08, 0.24, 42]} />
        <meshBasicMaterial color="#dff7ff" transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={centerFlowRef} position={[0, -0.055, 0]} visible={false} renderOrder={17}>
        <cylinderGeometry args={[0.028, 0.045, 0.13, 14]} />
        <meshBasicMaterial color="#e0f7ff" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh ref={washRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[0.27, 42]} />
        <meshBasicMaterial color="#bae6fd" transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function FallingSandInFilter({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const grains = useMemo(
    () =>
      Array.from({ length: 38 }, (_, index) => ({
        x: (index % 7 - 3) * 0.022,
        z: (((index * 7) % 7) - 3) * 0.02,
        offset: index / 38,
        size: 0.009 + (index % 4) * 0.0015,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child, index) => {
      const grain = grains[index];
      const fall = (grain.offset + t * 0.8) % 1;
      child.position.set(grain.x, 0.12 - fall * 0.24, grain.z);
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {grains.map((grain, index) => (
        <mesh key={index}>
          <sphereGeometry args={[grain.size, 7, 6]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#7c5f38" : "#b08a55"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function RetortStand() {
  return (
    <group position={[FUNNEL_POS.x, FUNNEL_POS.y, FUNNEL_POS.z]}>
      <mesh position={[-0.92, -1.005, -0.56]} castShadow receiveShadow>
        <boxGeometry args={[1.28, 0.1, 0.62]} />
        <meshStandardMaterial color="#27333a" metalness={0.62} roughness={0.42} />
      </mesh>
      <mesh position={[-0.92, 0.12, -0.56]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 2.28, 16]} />
        <meshStandardMaterial color="#a8b2b5" metalness={0.82} roughness={0.22} />
      </mesh>
      <mesh position={[-0.92, 0.17, -0.56]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.16, 18]} />
        <meshStandardMaterial color="#27333a" metalness={0.65} roughness={0.36} />
      </mesh>
      <mesh position={[-0.47, 0.17, -0.56]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.9, 14]} />
        <meshStandardMaterial color="#a8b2b5" metalness={0.8} roughness={0.24} />
      </mesh>
      <mesh position={[-0.03, 0.17, -0.29]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.55, 14]} />
        <meshStandardMaterial color="#a8b2b5" metalness={0.8} roughness={0.24} />
      </mesh>
      <mesh position={[-0.03, 0.17, -0.56]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.15, 16]} />
        <meshStandardMaterial color="#27333a" metalness={0.68} roughness={0.34} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.455, 0.022, 10, 56]} />
        <meshStandardMaterial color="#3c474d" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[-0.44, 0.17, 0]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.1]} />
        <meshStandardMaterial color="#303b40" metalness={0.68} roughness={0.34} />
      </mesh>
    </group>
  );
}

function FunnelAndFilter({ residueHeight, rinseProgress, sandFalling, hasPaper = true }: { residueHeight: number; rinseProgress: number; sandFalling: boolean; hasPaper?: boolean }) {
  const rinseFraction = clamp(rinseProgress / 100, 0, 1);
  const wetness = rinseProgress > 0 && rinseProgress < 100 ? Math.sin(rinseFraction * Math.PI) : 0;
  const cleanResidueColor = new THREE.Color("#a9926a")
    .lerp(new THREE.Color("#725637"), wetness * 0.72)
    .lerp(new THREE.Color("#c6ae7c"), rinseFraction * 0.48);
  const saltLeftOnResidue = residueHeight > 0.01 ? BASE_SALT_FRACTION * 0.34 * (1 - clamp(rinseProgress / 100, 0, 1)) : 0;
  const sandOnResidue = residueHeight > 0.01 ? BASE_SAND_FRACTION : 0;
  return (
    <group position={[FUNNEL_POS.x, FUNNEL_POS.y, FUNNEL_POS.z]}>
      <mesh rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.43, 0.56, 48, 1, true]} />
        <meshPhysicalMaterial color="#edfaff" transparent opacity={1} roughness={0.025} transmission={0.94} thickness={0.015} ior={1.46} clearcoat={1} clearcoatRoughness={0.02} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.47, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.037, 0.48, 24, 1, true]} />
        <meshPhysicalMaterial color="#edfaff" transparent opacity={1} roughness={0.025} transmission={0.94} thickness={0.015} ior={1.46} clearcoat={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.425, 0.018, 10, 64]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={1} roughness={0.02} transmission={0.94} />
      </mesh>
      <mesh visible={hasPaper} rotation={[Math.PI, 0, 0]} position={[0, -0.02, 0]}>
        <coneGeometry args={[0.4, 0.52, 24, 1, true]} />
        <meshStandardMaterial color="#f6f0dc" roughness={0.93} side={THREE.DoubleSide} transparent opacity={0.94} />
      </mesh>
      <mesh visible={hasPaper} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.385, 0.011, 8, 56]} />
        <meshStandardMaterial color="#e4dcc6" roughness={0.92} />
      </mesh>
      <FilterSurfaceAction pouring={sandFalling} rinsing={rinseProgress > 0 && rinseProgress < 100} />
      <FallingSandInFilter active={sandFalling} />
      {residueHeight > 0.01 && (
        <group position={[0, -0.18, 0]}>
          <mesh position={[0, residueHeight / 2, 0]}>
            <coneGeometry args={[0.3, residueHeight, 20]} />
            <meshStandardMaterial color={cleanResidueColor} transparent opacity={0.28} roughness={1} />
          </mesh>
          <GrainBed radius={0.28} sandFraction={sandOnResidue} saltFraction={saltLeftOnResidue} height={Math.max(residueHeight, 0.06)} rinsing={rinseProgress > 0 && rinseProgress < 100} />
        </group>
      )}
      <MovingSaltSpecks active={rinseProgress > 0 && rinseProgress < 72} inFilter />
      <MovingSaltSpecks active={rinseProgress > 28 && rinseProgress < 100} />
    </group>
  );
}

function Tripod() {
  const legs = useMemo(() => [0, 1, 2].map((i) => {
    const angle = i * Math.PI * 2 / 3;
    const bottom = new THREE.Vector3(Math.cos(angle) * 0.49, 0.03, Math.sin(angle) * 0.49);
    const top = new THREE.Vector3(Math.cos(angle) * 0.33, 0.82, Math.sin(angle) * 0.33);
    const direction = top.clone().sub(bottom);
    return { bottom, center: top.clone().add(bottom).multiplyScalar(0.5), length: direction.length(), rotation: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()) };
  }), []);
  return (
    <group position={[TRIPOD_POS.x, TRIPOD_POS.y, TRIPOD_POS.z]}>
      {legs.map((leg, i) => <group key={i}>
        <mesh position={leg.center} quaternion={leg.rotation} castShadow><cylinderGeometry args={[0.025, 0.03, leg.length, 16]} /><meshStandardMaterial color="#414746" metalness={0.75} roughness={0.45} /></mesh>
        <mesh position={leg.bottom}><sphereGeometry args={[0.035, 12, 8]} /><meshStandardMaterial color="#2e3432" roughness={0.7} /></mesh>
      </group>)}
      <mesh position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow><torusGeometry args={[0.34, 0.026, 12, 64]} /><meshStandardMaterial color="#454c48" metalness={0.8} roughness={0.4} /></mesh>
      {/* Fine square wire gauze with a ceramic heat-spreading centre. */}
      {Array.from({ length: 19 }, (_, i) => {
        const offset = (i - 9) * 0.038;
        return <group key={i}>
          <mesh position={[offset, 0.85, 0]}><boxGeometry args={[0.006, 0.006, 0.72]} /><meshStandardMaterial color="#858b85" metalness={0.75} roughness={0.6} /></mesh>
          <mesh position={[0, 0.852, offset]}><boxGeometry args={[0.72, 0.006, 0.006]} /><meshStandardMaterial color="#858b85" metalness={0.75} roughness={0.6} /></mesh>
        </group>;
      })}
      <mesh position={[0, 0.857, 0]}><cylinderGeometry args={[0.225, 0.225, 0.008, 48]} /><meshStandardMaterial color="#b6b5a5" roughness={0.96} /></mesh>
    </group>
  );
}

function EvaporatingBasin({ liquidLevel, crystalGrowth, heat = 0 }: { liquidLevel: number; crystalGrowth: number; heat?: number }) {
  const surfaceRef = useRef<THREE.Mesh>(null);
  const fillFraction = clamp(liquidLevel / 100, 0, 1);
  const liquidY = 0.055 + fillFraction * 0.14;
  const bowl = useMemo(() => {
    // Continuous porcelain wall: flat foot, rounded exterior, rolled lip,
    // concave interior and sealed bottom, rather than an open cylinder.
    const profile = [[0, 0], [0.17, 0], [0.22, 0.012], [0.29, 0.035], [0.37, 0.09], [0.445, 0.17], [0.485, 0.235], [0.49, 0.255], [0.475, 0.265], [0.459, 0.25], [0.43, 0.185], [0.355, 0.11], [0.275, 0.065], [0.19, 0.045], [0, 0.045]];
    const geometry = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 96);
    const positions = geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i), y = positions.getY(i);
      const angle = Math.atan2(z, x);
      const spout = Math.exp(-((angle / 0.2) ** 2)) * smoothstep((y - 0.17) / 0.07);
      positions.setX(i, x + spout * 0.065);
      positions.setY(i, y - spout * 0.015);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => bowl.dispose(), [bowl]);
  useFrame(({ clock }) => {
    if (!surfaceRef.current) return;
    surfaceRef.current.position.y = liquidY + Math.sin(clock.elapsedTime * 7) * heat * 0.0015;
  });
  return (
    <group position={[BASIN_POS.x, BASIN_POS.y, BASIN_POS.z]}>
      <mesh geometry={bowl} castShadow receiveShadow><meshPhysicalMaterial color="#f8f5ec" roughness={0.23} metalness={0} clearcoat={0.85} clearcoatRoughness={0.15} /></mesh>
      {liquidLevel > 0.01 && <mesh ref={surfaceRef} position={[0, liquidY, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}>
        <circleGeometry args={[0.21 + Math.sqrt(fillFraction) * 0.22, 64]} />
        <meshPhysicalMaterial color="#dff6ff" transparent opacity={0.38 + fillFraction * 0.18} roughness={0.07} transmission={0.2} clearcoat={1} depthWrite={false} />
      </mesh>}
      {crystalGrowth > 0.01 && <group position={[0, 0.05, 0]}>
        <mesh><cylinderGeometry args={[0.06 + crystalGrowth * 0.18, 0.06 + crystalGrowth * 0.18, 0.005 + crystalGrowth * 0.014, 48]} /><meshStandardMaterial color="#f8fafc" roughness={0.75} /></mesh>
        {Array.from({ length: 48 }, (_, index) => {
          if (index / 48 > crystalGrowth) return null;
          const angle = index * 2.399;
          const distance = Math.sqrt(((index * 41) % 100) / 100) * (0.06 + crystalGrowth * 0.17);
          const size = 0.014 + (index % 4) * 0.004;
          return <mesh key={index} position={[Math.cos(angle) * distance, 0.014, Math.sin(angle) * distance]} rotation={[0, index * 0.71, 0]}>
            <boxGeometry args={[size, size, size]} /><meshPhysicalMaterial color="#ffffff" roughness={0.28} clearcoat={0.5} />
          </mesh>;
        })}
      </group>}
    </group>
  );
}

function BunsenBurner({ lit, heat }: { lit: boolean; heat: number }) {
  return <group position={BURNER_POS}><RealisticBunsenBurner lit={lit} heat={heat} /></group>;
}

function EvaporationPlume({ active, heat, liquidRemaining }: { active: boolean; heat: number; liquidRemaining: number }) {
  return <BlenderSteam active={active && liquidRemaining > 0} heat={heat} position={[BASIN_POS.x, BASIN_POS.y + .28, BASIN_POS.z]} />;
}

function FinalSaltOnTable({ amount, recovered }: { amount: number; recovered: boolean }) {
  const saltScale = clamp(amount / (BASE_MIXTURE_MASS * BASE_SALT_FRACTION), 0.35, 1.15);
  const crystals = useMemo(
    () =>
      Array.from({ length: 90 }, (_, index) => {
        const angle = index * 2.399;
        const distance = Math.sqrt(((index * 43) % 100) / 100) * 0.38 * saltScale;
        return {
          x: Math.cos(angle) * distance,
          z: Math.sin(angle) * distance,
          y: ((index * 19) % 100) / 100,
          size: 0.014 + (index % 5) * 0.003,
          rotation: [index * 0.27, index * 0.41, index * 0.19] as [number, number, number],
        };
      }),
    [saltScale]
  );

  return (
    <group position={RECOVERED_SALT_POS}>
      <mesh position={[0, 0.012, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 0.024, 1.2]} />
        <meshStandardMaterial color="#111513" roughness={0.96} metalness={0} />
      </mesh>
      <mesh position={[0, 0.003, 0]} receiveShadow>
        <boxGeometry args={[1.54, 0.006, 1.24]} />
        <meshStandardMaterial color="#303832" roughness={0.9} />
      </mesh>
      {recovered && <group position={[0, 0.025, 0]}>
      <mesh position={[0, 0.06 * saltScale, 0]}>
        <coneGeometry args={[0.38 * saltScale, 0.12 * saltScale, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.42} emissive="#e2e8f0" emissiveIntensity={0.08} />
      </mesh>
      {crystals.map((crystal, index) => (
        <mesh key={index} position={[crystal.x, 0.06 + crystal.y * 0.08 * saltScale, crystal.z]} rotation={crystal.rotation} castShadow>
          <boxGeometry args={[crystal.size * 1.55, crystal.size * 1.55, crystal.size * 1.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.24} emissive="#e2e8f0" emissiveIntensity={0.16} />
        </mesh>
      ))}
      <LabLabel position={[0, 0.8, 0]} center distanceFactor={9} occlude={false} zIndexRange={[8, 0]} style={{ pointerEvents: "none" }}>
        <div className="separation-salt-marker">
          <div className="separation-salt-marker__tag">
            <span className="separation-salt-marker__title">Recovered salt</span>
            <span className="separation-salt-marker__mass">{amount.toFixed(2)} g</span>
          </div>
          <span className="separation-salt-marker__stem" />
          <span className="separation-salt-marker__arrow" />
        </div>
      </LabLabel>
      </group>}
    </group>
  );
}

interface WashBottlePose {
  center: THREE.Vector3;
  rotationZ: number;
  nozzleTip: THREE.Vector3;
  rinseTarget: THREE.Vector3;
  squeeze: number;
  streamActive: boolean;
}

function getWashBottlePose(position: THREE.Vector3, rinseProgress: number): WashBottlePose {
  const progress = clamp(rinseProgress / 100, 0, 1);
  const lift = smoothstep(progress / 0.24);
  const lower = smoothstep((progress - 0.78) / 0.22);
  const engagement = lift * (1 - lower);
  const center = position
    .clone()
    .add(new THREE.Vector3(0, 0.42, 0))
    .lerp(FUNNEL_POS.clone().add(new THREE.Vector3(1.05, 0.72, 0.06)), engagement);
  const rotationZ = engagement * 0.32;
  const nozzleLocal = new THREE.Vector3(-0.59, 0.34, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), rotationZ);
  const nozzleTip = center.clone().add(nozzleLocal);
  const washPhase = clamp((progress - 0.24) / 0.54, 0, 1);
  const sweepAngle = washPhase * Math.PI * 3.2;
  const sweepRadius = 0.14 * Math.sin(washPhase * Math.PI);
  const rinseTarget = FUNNEL_POS.clone().add(
    new THREE.Vector3(Math.cos(sweepAngle) * sweepRadius, 0.16, Math.sin(sweepAngle) * sweepRadius)
  );
  const streamActive = rinseProgress > 24 && rinseProgress < 80;
  const squeeze = streamActive ? 0.91 + Math.sin(washPhase * Math.PI * 8) * 0.035 : 1;
  return { center, rotationZ, nozzleTip, rinseTarget, squeeze, streamActive };
}

function WashBottle({ position, rinseProgress }: { position: THREE.Vector3; rinseProgress: number }) {
  const pose = getWashBottlePose(position, rinseProgress);
  return (
    <group name="performance-wash-bottle" position={[pose.center.x, pose.center.y, pose.center.z]} rotation={[0, 0, pose.rotationZ]}>
      <group scale={[pose.squeeze, 1, 1]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.145, 0.17, 0.5, 28]} />
          <meshPhysicalMaterial color="#d9f7ff" transparent opacity={0.46} roughness={0.16} transmission={0.28} thickness={0.08} ior={1.39} clearcoat={0.45} />
        </mesh>
        <mesh position={[0, -0.1, 0]} renderOrder={3}>
          <cylinderGeometry args={[0.125, 0.145, 0.27, 28]} />
          <meshPhysicalMaterial color="#7dd3fc" transparent opacity={0.4} roughness={0.08} transmission={0.12} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.145, 0.12, 28]} />
          <meshPhysicalMaterial color="#e7fbff" transparent opacity={0.5} roughness={0.14} transmission={0.26} />
        </mesh>
        {[-0.13, 0, 0.13].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.151, 0.008, 8, 32]} />
            <meshStandardMaterial color="#b9e8f3" transparent opacity={0.52} roughness={0.38} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.39, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.065, 0.12, 18]} />
        <meshStandardMaterial color="#e5f4f6" roughness={0.34} />
      </mesh>
      <mesh position={[-0.27, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.026, 0.54, 12]} />
        <meshPhysicalMaterial color="#e6f8fb" transparent opacity={0.72} roughness={0.12} transmission={0.16} />
      </mesh>
      <mesh position={[-0.57, 0.34, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.014, 0.022, 0.08, 12]} />
        <meshStandardMaterial color="#d9eef2" roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.265, 0]}>
        <cylinderGeometry args={[0.14, 0.15, 0.03, 24]} />
        <meshStandardMaterial color="#c7dde1" transparent opacity={0.58} roughness={0.4} />
      </mesh>
    </group>
  );
}

function PouringStream({
  active,
  from,
  to,
  color = "#bfe4ff",
  lineWidth = 4,
  dropletCount = 16,
  sag = -0.18,
  dirty = false,
}: {
  active: boolean;
  from: THREE.Vector3;
  to: THREE.Vector3;
  color?: string;
  lineWidth?: number;
  dropletCount?: number;
  sag?: number;
  dirty?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const curve = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const drop = Math.max(0, from.y - to.y);
    mid.y = from.y - Math.min(drop * 0.15, Math.abs(sag));
    return new THREE.QuadraticBezierCurve3(from, mid, to);
  }, [from.x, from.y, from.z, sag, to.x, to.y, to.z]);
  const streamPoints = useMemo(() => curve.getPoints(28), [curve]);
  const droplets = useMemo(
    () =>
      Array.from({ length: dropletCount }, (_, index) => ({
        offset: index / dropletCount,
        phase: index * 0.87,
        size: 0.022 + (index % 4) * 0.006,
        isSolid: dirty && index % 3 === 0,
      })),
    [dirty, dropletCount]
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    groupRef.current.children.forEach((child) => {
      if (!child.userData.streamDroplet) return;
      const droplet = child.userData.streamDroplet as (typeof droplets)[number];
      const flightTime = Math.max(0.12, Math.sqrt(2 * Math.max(0.05, from.y - to.y) / 9.81));
      const progress = (droplet.offset + t / flightTime) % 1;
      const point = curve.getPoint(progress);
      const tangent = curve.getTangent(progress);
      child.position.set(
        point.x,
        point.y,
        point.z
      );
      child.scale.set(droplet.isSolid ? 1 : 0.74, droplet.isSolid ? 1 : 1.65, droplet.isSolid ? 1 : 0.74);
      child.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.normalize());
    });
  });

  return (
    <group ref={groupRef} visible={active}>
      <mesh renderOrder={18}>
        <tubeGeometry args={[curve, 36, Math.max(0.012, lineWidth * 0.0034), 10, false]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={dirty ? 0.68 : 0.58}
          roughness={0.025}
          transmission={dirty ? 0.05 : 0.34}
          thickness={0.035}
          ior={1.333}
          clearcoat={1}
          clearcoatRoughness={0.02}
          depthWrite={false}
        />
      </mesh>
      <Line points={streamPoints} color="#ffffff" lineWidth={Math.max(0.75, lineWidth * 0.18)} transparent opacity={0.46} />
      {droplets.map((droplet, index) => {
        const p = curve.getPoint(droplet.offset);
        return (
          <mesh key={index} userData={{ streamDroplet: droplet }} position={[p.x, p.y, p.z]} renderOrder={20}>
            <sphereGeometry args={[droplet.size, 10, 8]} />
            <meshBasicMaterial
              color={droplet.isSolid ? (index % 2 === 0 ? "#8a6f47" : "#ffffff") : color}
              transparent
              opacity={droplet.isSolid ? 0.92 : 0.76}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function ReceiverLiquidImpact({ active, level }: { active: boolean; level: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const splashRef = useRef<THREE.Group>(null);
  const surfaceY = RECEIVER_BEAKER_POS.y + 0.04 + Math.max(level, 0.045);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.visible = active && level > 0.02;
      const pulse = (t * 1.8) % 1;
      ringRef.current.scale.setScalar(0.45 + pulse * 0.95);
      const material = ringRef.current.material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = active ? 0.34 * (1 - pulse) : 0;
      }
    }
    if (splashRef.current) {
      splashRef.current.visible = active && level > 0.02;
      splashRef.current.children.forEach((child, index) => {
        const angle = index * 2.399;
        const bob = Math.sin(t * 8 + index) * 0.018;
        child.position.set(Math.cos(angle) * 0.055, bob, Math.sin(angle) * 0.055);
      });
    }
  });
  return (
    <group position={[RECEIVER_BEAKER_POS.x + 0.05, surfaceY, RECEIVER_BEAKER_POS.z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} visible={false} renderOrder={22}>
        <ringGeometry args={[0.08, 0.2, 42]} />
        <meshBasicMaterial color="#e0f7ff" transparent opacity={0.25} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={splashRef} visible={false}>
        {Array.from({ length: 8 }, (_, index) => (
          <mesh key={index} renderOrder={23}>
            <sphereGeometry args={[0.012 + (index % 3) * 0.003, 8, 8]} />
            <meshBasicMaterial color="#f8fdff" transparent opacity={0.7} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function WaterTap({ progress }: { progress: number }) {
  const sourceRadius = 0.46;
  const sourceHeight = 1.2;
  const lift = smoothstep(progress / 24);
  const returnProgress = smoothstep((progress - WATER_STREAM_END_PROGRESS) / (100 - WATER_STREAM_END_PROGRESS));
  const engagement = lift * (1 - returnProgress);
  const pourAmount = smoothstep((progress - 22) / 14) * (1 - smoothstep((progress - 73) / 9));
  const restPosition = MIX_BEAKER_POS.clone().add(new THREE.Vector3(-1.55, 0, 0.18));
  const pouringPosition = MIX_BEAKER_POS.clone().add(new THREE.Vector3(-1.28, 1.34, 0.04));
  const sourcePosition = restPosition.clone().lerp(pouringPosition, engagement);
  const sourceTilt = -1.0 * pourAmount;
  const fill = smoothstep((progress - WATER_CONTACT_PROGRESS) / (WATER_STREAM_END_PROGRESS - WATER_CONTACT_PROGRESS));
  const waterRemaining = 0.55 * (0.55 / sourceRadius) ** 2 * (1 - fill);
  const sourceCenter = sourcePosition.clone().add(new THREE.Vector3(0, sourceHeight / 2, 0));
  const spoutOffset = new THREE.Vector3(sourceRadius * 0.94, sourceHeight / 2 + 0.025, 0)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), sourceTilt);
  const streamOrigin = sourceCenter.add(spoutOffset);
  const streamReach = smoothstep(
    (progress - WATER_STREAM_START_PROGRESS) / (WATER_CONTACT_PROGRESS - WATER_STREAM_START_PROGRESS),
  );
  const receivingFillProgress = fill;
  const impactPoint = MIX_BEAKER_POS.clone().add(new THREE.Vector3(0.06, 0.02 + 0.55 * receivingFillProgress, 0));
  const streamTarget = streamOrigin.clone().lerp(impactPoint, streamReach);
  const streamActive = progress > WATER_STREAM_START_PROGRESS && progress < WATER_STREAM_END_PROGRESS;

  return (
    <group>
      <Beaker name="performance-water-beaker"
        position={sourcePosition}
        radius={sourceRadius}
        height={sourceHeight}
        liquidLevel={waterRemaining}
        liquidColor="#c9f2ff"
        liquidMotion={streamActive ? 0.88 : engagement * 0.35}
        tilt={sourceTilt}
      />
      <PouringStream
        active={streamActive}
        from={streamOrigin}
        to={streamTarget}
        color="#74dcff"
        lineWidth={5.4}
        dropletCount={24}
        sag={0.34}
      />
    </group>
  );
}

function DryingResidue({ dryingProgress, transferProgress = 100, hasResidue = true }: { dryingProgress: number; transferProgress?: number; hasResidue?: boolean }) {
  const progress = smoothstep(transferProgress / 100);
  const position = FUNNEL_POS.clone().add(new THREE.Vector3(0, -0.02, 0))
    .lerp(MAT_AREA_POS.clone().add(new THREE.Vector3(0, 0.05, 0)), progress);
  position.y += Math.sin(Math.PI * progress) * 0.7;
  const unfold = smoothstep((transferProgress - 68) / 32);
  const residueColor = new THREE.Color().lerpColors(
    new THREE.Color("#6f5335"),
    new THREE.Color("#d8bd84"),
    clamp(dryingProgress / 100, 0, 1)
  );

  return (
    <>
      <group position={[MAT_AREA_POS.x, MAT_AREA_POS.y, MAT_AREA_POS.z]}>
        <mesh position={[0, 0.005, 0]} receiveShadow castShadow>
          <boxGeometry args={[1.45, 0.035, 1.22]} />
          <meshStandardMaterial color="#8d3421" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.028, 0]} receiveShadow>
          <boxGeometry args={[1.27, 0.012, 1.03]} />
          <meshStandardMaterial color="#a84c32" roughness={0.88} />
        </mesh>
      </group>
      <group visible={hasResidue} position={position}>
        {transferProgress < 95 && <group position={[0.32, 0.06, 0]} rotation={[0, 0, -0.22]}>
          {[-0.025, 0.025].map((z) => <mesh key={z} position={[0, 0.28, z]}>
            <boxGeometry args={[0.025, 0.58, 0.012]} />
            <meshStandardMaterial color="#a7b1ab" metalness={0.85} roughness={0.26} />
          </mesh>)}
        </group>}
        <mesh visible={unfold > 0} rotation={[-Math.PI / 2, 0, 0]} scale={0.8 + unfold * 0.2} receiveShadow castShadow>
          <circleGeometry args={[0.5, 56]} />
          <meshStandardMaterial color="#f5f0df" roughness={0.96} side={THREE.DoubleSide} />
        </mesh>
        <mesh visible={unfold < 1} rotation={[Math.PI, 0, 0]} scale={[1, Math.max(0.01, 1 - unfold), 1]}>
          <coneGeometry args={[0.4, 0.52, 32, 1, true]} />
          <meshStandardMaterial color="#eee9d7" roughness={0.96} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.14 * (1 - unfold) + 0.038 * unfold, 0]} castShadow>
          <coneGeometry args={[0.28 + unfold * 0.09, 0.075 + (1 - unfold) * 0.08, 48]} />
          <meshStandardMaterial color={residueColor} roughness={1} />
        </mesh>

      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// Digital readout (reused visual language from the projectile sim)
// ---------------------------------------------------------------------------

function DigitalReadout({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="min-w-0 rounded-[14px] border-[3px] border-[#575b60] bg-[#191b1d] px-1.5 pb-2 pt-1.5 text-center shadow-[inset_0_0_0_2px_rgba(0,0,0,0.8),0_8px_18px_rgba(0,0,0,0.45)]">
      <div className="digital-screen mx-auto flex min-h-[40px] min-w-0 items-center justify-center gap-0.5 overflow-hidden rounded-md border border-black bg-[#050505] px-1 py-1.5">
        <span className="digital-value font-mono text-lg font-black text-red-500">{value}</span>
        <span className="pb-0 text-[8px] font-black uppercase text-red-500/90">{unit}</span>
      </div>
      <div className="mt-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
    </div>
  );
}

function ProgressBar({ value, label, tone = "orange" }: { value: number; label: string; tone?: "orange" | "emerald" | "sky" }) {
  const toneClasses = {
    orange: "from-emerald-300 via-cyan-300 to-orange-300",
    emerald: "from-cyan-300 via-emerald-300 to-emerald-400",
    sky: "from-sky-300 via-cyan-300 to-blue-400",
  }[tone];
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className="font-bold text-orange-100">{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${toneClasses} transition-[width] duration-300`}
          style={{ width: `${clamp(value, 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

function CameraRig({ target, position, mobile = false }: { target: THREE.Vector3; position: THREE.Vector3; mobile?: boolean }) {
  const controlsRef = useRef<any>(null);
  const transitionElapsedRef = useRef(0);
  const { camera, size } = useThree();
  const isMobile = mobile || size.width < 640;
  const aspect = Math.max(1, size.width) / Math.max(1, size.height);
  const framedTarget = useMemo(() => target.clone().add(new THREE.Vector3(0, isMobile ? -0.15 : 0, 0)), [target.x, target.y, target.z, isMobile]);
  const framedPosition = useMemo(() => {
    if (!isMobile) return position.clone();
    const distance = Math.min(13, Math.max(7.5, 3.6 / (Math.tan(THREE.MathUtils.degToRad(29)) * aspect)));
    return framedTarget.clone().add(new THREE.Vector3(0.2, 2.7, distance));
  }, [isMobile, aspect, position.x, position.y, position.z, framedTarget.x, framedTarget.y, framedTarget.z]);

  useEffect(() => {
    camera.far = 80;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobile ? 58 : 50;
    }
    camera.updateProjectionMatrix();
  }, [camera, isMobile]);

  useEffect(() => {
    transitionElapsedRef.current = 0;
  }, [framedPosition.x, framedPosition.y, framedPosition.z, framedTarget.x, framedTarget.y, framedTarget.z]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const smoothing = 1 - Math.exp(-delta * 4.2);
    controls.target.lerp(framedTarget, smoothing);
    if (transitionElapsedRef.current < 1.6) {
      controls.object.position.lerp(framedPosition, smoothing * 0.82);
      transitionElapsedRef.current += delta;
    }
    controls.update();
  });
  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.12}
      minDistance={isMobile ? 4.5 : 3.5}
      maxDistance={14}
      minPolarAngle={1.08}
      maxPolarAngle={Math.PI / 2.1}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
      enablePan={false}
    />
  );
}
// ---------------------------------------------------------------------------
// 3D Scene
// ---------------------------------------------------------------------------

function Scene({
  stage,
  mixLiquidLevel,
  waterPourProgress,
  sourceSandFraction,
  sourceSaltFraction,
  stirring,
  stirSpeed,
  pourProgress,
  residueHeight,
  filtrateLevel,
  rinseProgress,
  dryingProgress,
  sandTransferProgress,
  solutionTransferProgress,
  basinLiquidLevel,
  liquidRemaining,
  crystalGrowth,
  saltRecovered,
  burnerLit,
  heat,
  splashBurst,
  dripBurst,
  rinseBurst,
  mode = "learning",
  isMobile = false,
  interactables = [],
  activeTargetId = null,
  moveVectorRef,
  onTargetChange,
}: {
  stage: Stage;
  mixLiquidLevel: number;
  waterPourProgress: number;
  sourceSandFraction: number;
  sourceSaltFraction: number;
  stirring: boolean;
  stirSpeed: number;
  pourProgress: number;
  residueHeight: number;
  filtrateLevel: number;
  rinseProgress: number;
  dryingProgress: number;
  sandTransferProgress: number;
  solutionTransferProgress: number;
  basinLiquidLevel: number;
  liquidRemaining: number;
  crystalGrowth: number;
  saltRecovered: number;
  burnerLit: boolean;
  heat: number;
  splashBurst: BurstState;
  dripBurst: BurstState;
  rinseBurst: BurstState;
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: MutableRefObject<{ x: number; y: number }>;
  onTargetChange?: (target: Interactable | null) => void;
}) {
  const lift = stage === "filtering" ? smoothstep(pourProgress / 24) : 0;
  const returning = stage === "filtering" ? smoothstep((pourProgress - 104) / 12) : 0;
  const flow = clamp((pourProgress - 36) / 60, 0, 1);
  const tipIn = smoothstep((pourProgress - 24) / 12);
  const tipOut = 1 - smoothstep((pourProgress - 96) / 8);
  const mixTilt = stage === "filtering" ? -(1.04 + flow * 0.3) * tipIn * tipOut : 0;
  // Rotate about the pouring lip once raised: the stream stays attached to
  // the spout, rather than starting from an unrelated point beside the glass.
  const uprightSpout = new THREE.Vector3(0.61, 0.55, 0);
  const rotatedSpout = uprightSpout.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), mixTilt);
  const lipTarget = FUNNEL_POS.clone().add(new THREE.Vector3(-0.12, 0.55, 0));
  const liftedBase = lipTarget.clone().sub(uprightSpout).add(new THREE.Vector3(0, -0.55, 0));
  const pouringBeakerPos = MIX_BEAKER_POS.clone().lerp(liftedBase, lift);
  pouringBeakerPos.add(uprightSpout.clone().sub(rotatedSpout).multiplyScalar(lift));
  pouringBeakerPos.lerp(MIX_BEAKER_POS, returning);
  const showMixtureBeaker = true;
  const showFilterSetup = true;
  const showDryingResidue = stage === "drying" || stage === "results";
  const showEvapSetup = true;
  const showEvaporationLiquid = stage === "evaporating" || stage === "results";
  const activeTopPour = stage === "filtering" && pourProgress > 36 && pourProgress < 96;
  const activeFilteredDrip = stage === "filtering" && pourProgress > 42 && pourProgress < 112;
  const activeRinse = stage === "filtering" && rinseProgress > 0 && rinseProgress < 100;
  const activeRinseDrip = stage === "filtering" && rinseProgress > 28 && rinseProgress < 100;
  const slurryFrom = pouringBeakerPos.clone().add(new THREE.Vector3(0, 0.55, 0)).add(rotatedSpout);
  const slurryTo = FUNNEL_POS.clone().add(new THREE.Vector3(-0.08, 0.18, 0));
  const washBottlePose = getWashBottlePose(WASH_BOTTLE_POS, rinseProgress);
  const solutionLift = smoothstep(solutionTransferProgress / 22);
  const solutionReturn = smoothstep((solutionTransferProgress - 86) / 14);
  const solutionFlow = smoothstep((solutionTransferProgress - 32) / 46);
  const solutionTilt = -(1.02 + solutionFlow * 0.32)
    * smoothstep((solutionTransferProgress - 22) / 10)
    * (1 - smoothstep((solutionTransferProgress - 78) / 8));
  const receiverSpout = new THREE.Vector3(0.61, 0.55, 0);
  const tippedReceiverSpout = receiverSpout.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), solutionTilt);
  const bowlLipTarget = BASIN_POS.clone().add(new THREE.Vector3(-0.08, 0.65, 0));
  const raisedReceiverBase = bowlLipTarget.clone().sub(receiverSpout).add(new THREE.Vector3(0, -0.55, 0));
  const receiverPosition = RECEIVER_BEAKER_POS.clone().lerp(raisedReceiverBase, solutionLift);
  receiverPosition.add(receiverSpout.clone().sub(tippedReceiverSpout).multiplyScalar(solutionLift));
  receiverPosition.lerp(RECEIVER_BEAKER_POS, solutionReturn);
  const solutionFrom = receiverPosition.clone().add(new THREE.Vector3(0, 0.55, 0)).add(tippedReceiverSpout);
  const solutionTo = BASIN_POS.clone().add(new THREE.Vector3(0, 0.055 + solutionFlow * 0.14, 0));
  const solutionPouring = stage === "evaporating" && solutionTransferProgress > 32 && solutionTransferProgress < 78;


  const tableLightTargets = useMemo(() => [-3.8, 0, 3.2].map((x) => {
    const target = new THREE.Object3D();
    target.position.set(x, 0.2, 0);
    return target;
  }), []);

  const stageTarget = useMemo(() => {
    switch (stage) {
      case "mixing":
        return new THREE.Vector3(MIX_BEAKER_POS.x, 0.5, MIX_BEAKER_POS.z);
      case "filtering":
        return new THREE.Vector3(
          (MIX_BEAKER_POS.x + FUNNEL_POS.x + RECEIVER_BEAKER_POS.x) / 3,
          0.5,
          (MIX_BEAKER_POS.z + FUNNEL_POS.z + RECEIVER_BEAKER_POS.z) / 3
        );
      case "drying":
        return new THREE.Vector3(MAT_AREA_POS.x, 0.3, MAT_AREA_POS.z);
      case "evaporating":
        return new THREE.Vector3(TRIPOD_POS.x, 0.6, TRIPOD_POS.z);
      case "results":
        return RECOVERED_SALT_POS.clone().add(new THREE.Vector3(0, 0.35, 0));
      default:
        return new THREE.Vector3(0, 0.4, 0);
    }
  }, [stage]);
  const stageCameraPosition = useMemo(() => {
    switch (stage) {
      case "mixing":
        return new THREE.Vector3(-2.6, 2.2, 6.6);
      case "filtering":
        return new THREE.Vector3(0.1, 2.35, 7.2);
      case "drying":
        return new THREE.Vector3(-2.8, 2.15, 5.3);
      case "evaporating":
        return new THREE.Vector3(3.3, 2.25, 5.5);
      case "results":
        return new THREE.Vector3(1.9, 2.5, 7.4);
      default:
        return new THREE.Vector3(2.6, 1.7, 7.4);
    }
  }, [stage]);

  return (
    <>
      <color attach="background" args={["#3f4c53"]} />
      <fog attach="fog" args={["#3f4c53", 18, 38]} />
      <ambientLight intensity={0.24} />
      <hemisphereLight args={["#f3ffff", "#26303a", 0.35]} />
      <directionalLight
        position={[6, 9, 6]}
        intensity={0.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={7}
        shadow-camera-bottom={-5}
        shadow-bias={-0.00015}
      />
      {/* Broad overhead pools keep every work station clear without lighting
          the surrounding room to the same level as the bench. */}
      {tableLightTargets.map((target, index) => (
        <Fragment key={index}>
          <primitive object={target} />
          <spotLight position={[target.position.x, 4.5, 0.8]} target={target}
            color="#fffaf2" intensity={70} distance={9} decay={2}
            angle={0.65} penumbra={0.8} />
        </Fragment>
      ))}
      <pointLight position={[0, 2.6, 3.2]} intensity={2} distance={6} decay={2} color="#eef6ff" />
      <LaboratoryRoom />
      <Bench />
      <WaterTap progress={waterPourProgress} />

      {showMixtureBeaker && (
        <Beaker name="performance-mixture-beaker"
          position={stage === "filtering" ? pouringBeakerPos : MIX_BEAKER_POS}
          liquidLevel={mixLiquidLevel}
          sandFraction={sourceSandFraction}
          saltFraction={sourceSaltFraction}
          tilt={mixTilt}
          liquidMotion={stirring ? stirSpeed / 100 : activeTopPour ? 0.5 : waterPourProgress > WATER_CONTACT_PROGRESS && waterPourProgress < WATER_STREAM_END_PROGRESS ? 0.25 : 0}
        />
      )}
      {stage === "mixing" && <StirRod position={MIX_BEAKER_POS} stirring={stirring} speed={stirSpeed} />}

      {showFilterSetup && (
        <>
          <Beaker
            position={stage === "evaporating" ? receiverPosition : RECEIVER_BEAKER_POS}
            tilt={stage === "evaporating" ? solutionTilt : 0}
            liquidLevel={filtrateLevel * (1 - solutionFlow)}
            liquidColor="#bfe4ff"
            liquidMotion={solutionPouring ? 0.5 : activeFilteredDrip || activeRinseDrip ? 0.25 : 0}
          />
          <RetortStand />
          <FunnelAndFilter hasPaper={stage === "mixing" || stage === "filtering"} residueHeight={stage === "mixing" || stage === "filtering" ? residueHeight : 0} rinseProgress={rinseProgress} sandFalling={activeTopPour} />
          <WashBottle position={WASH_BOTTLE_POS} rinseProgress={rinseProgress} />
          <PouringStream
            active={activeTopPour}
            from={slurryFrom}
            to={slurryTo}
            color="#c7e9ff"
            lineWidth={1.2 + 5 * Math.sin(Math.PI * flow)}
            dropletCount={28}
            sag={-0.24}
            dirty
          />
          <MovingSlurryParticles active={activeTopPour} from={slurryFrom} to={slurryTo} />
          <PouringStream
            active={activeFilteredDrip}
            from={FUNNEL_POS.clone().add(new THREE.Vector3(0, -0.18, 0))}
            to={RECEIVER_BEAKER_POS.clone().add(new THREE.Vector3(0, 0.02 + Math.max(filtrateLevel, 0.005), 0))}
            color="#dbeafe"
            lineWidth={3.8}
            dropletCount={18}
            sag={-0.1}
          />
          <ReceiverLiquidImpact active={activeFilteredDrip || activeRinseDrip} level={filtrateLevel} />
          <PouringStream
            active={activeRinse && washBottlePose.streamActive}
            from={washBottlePose.nozzleTip}
            to={washBottlePose.rinseTarget}
            color="#c9f1ff"
            lineWidth={2.7}
            dropletCount={13}
            sag={-0.13}
          />
          <PouringStream
            active={activeRinseDrip}
            from={FUNNEL_POS.clone().add(new THREE.Vector3(0.02, -0.18, 0))}
            to={RECEIVER_BEAKER_POS.clone().add(new THREE.Vector3(0.05, 0.02 + Math.max(filtrateLevel, 0.005), 0))}
            color="#e0f7ff"
            lineWidth={3.4}
            dropletCount={16}
            sag={-0.1}
          />
        </>
      )}

      <DryingResidue dryingProgress={dryingProgress} transferProgress={sandTransferProgress} hasResidue={showDryingResidue || stage === "evaporating"} />

      {showEvapSetup && (
        <>
          <PouringStream active={solutionPouring} from={solutionFrom} to={solutionTo}
            color="#cbe9f3" lineWidth={1.2 + 3.8 * Math.sin(Math.PI * clamp((solutionTransferProgress - 32) / 46, 0, 1))}
            dropletCount={22} sag={0.12} />
          <Tripod />
          <EvaporatingBasin liquidLevel={showEvaporationLiquid ? basinLiquidLevel : 0} crystalGrowth={stage === "results" ? 0 : crystalGrowth} heat={burnerLit ? heat : 0} />
          <BunsenBurner lit={burnerLit} heat={heat} />
          <EvaporationPlume active={burnerLit && heat > 0.15 && liquidRemaining > 0} heat={heat} liquidRemaining={liquidRemaining} />
          <FinalSaltOnTable amount={saltRecovered} recovered={stage === "results"} />
        </>
      )}

      <ParticleBurst burst={splashBurst} colors={SPLASH_COLORS} count={26} duration={0.6} spread={0.5} rise={0.6} size={0.06} />
      <ParticleBurst
        burst={dripBurst}
        colors={DRIP_COLORS}
        count={10}
        duration={0.5}
        spread={0.06}
        rise={0.02}
        size={0.04}
        continuous={activeFilteredDrip || activeRinseDrip}
      />
      <ParticleBurst burst={rinseBurst} colors={RINSE_COLORS} count={16} duration={0.5} spread={0.3} rise={0.3} size={0.05} />



      {(
        <CameraRig
          mobile={isMobile}
          target={stage === "drying" && sandTransferProgress < 100 ? new THREE.Vector3(-2, 0.7, -0.2)
            : stage === "evaporating" && solutionTransferProgress < 100 ? new THREE.Vector3(1.1, 0.9, 0.35) : stageTarget}
          position={stage === "drying" && sandTransferProgress < 100 ? new THREE.Vector3(-2, 3.4, 7)
            : stage === "evaporating" && solutionTransferProgress < 100 ? new THREE.Vector3(1.1, 3.3, 7) : stageCameraPosition} />
      )}
    </>
  );
}

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

// ---------------------------------------------------------------------------
// Lab report (mirrors the ExperimentPaper pattern from the projectile sim)
// ---------------------------------------------------------------------------

interface LabReportProps {
  rinsed: boolean;
  splashCount: number;
  evapOutcome: EvapOutcome;
  sandRecovered: number;
  saltRecovered: number;
  efficiency: number;
  rank: string;
  onClose: () => void;
}

function LabReport({ rinsed, splashCount, evapOutcome, sandRecovered, saltRecovered, efficiency, rank, onClose }: LabReportProps) {
  const recoveredTotal = sandRecovered + saltRecovered;
  const outcomeText =
    evapOutcome === "perfect"
      ? "The burner was switched off as the solution became concentrated, producing clean white salt crystals."
      : evapOutcome === "wet"
        ? "The burner was switched off too early, leaving excess water with the salt crystals."
        : "Heating continued too long, causing vigorous spitting and loss of part of the salt sample.";

  return (
    <ExperimentPaperModal filename="salt-sand-separation-experiment-paper.html" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase tracking-wide">
          Separation of a Salt and Sand Mixture by Filtration and Evaporation
        </h1>

        <h2 className="mt-6 text-base font-bold uppercase">Aim</h2>
        <p className="mt-1">
          To separate a mixture of sodium chloride (salt) and silica (sand) by exploiting the difference
          in solubility of the two components in water, using dissolving, filtration and evaporation.
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Apparatus &amp; Materials</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Salt and sand mixture, distilled water</li>
          <li>Two beakers (100&ndash;250 mL)</li>
          <li>Filter funnel and filter paper</li>
          <li>Glass stirring rod, wash bottle</li>
          <li>Evaporating basin, tripod, gauze, heatproof mat, Bunsen burner</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Methodology</h2>
        <ol className="mt-1 list-decimal space-y-1 pl-6">
          <li>The salt&ndash;sand mixture was placed in a beaker and warm distilled water was added.</li>
          <li>The mixture was stirred continuously with a glass rod until no more salt dissolved.</li>
          <li>Filter paper was folded into a cone and placed in a funnel over a clean beaker, and the mixture was poured through it.</li>
          <li>{rinsed ? "The residue was rinsed with a small amount of distilled water to recover any remaining salt solution." : "The residue was not rinsed before drying."}</li>
          <li>The sand residue was left to dry in a warm spot until all moisture had evaporated.</li>
          <li>The filtrate was transferred to an evaporating basin and heated gently over a Bunsen burner until crystallisation was complete.</li>
        </ol>

        <h2 className="mt-6 text-base font-bold uppercase">Observations</h2>
        <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-2 py-1 text-left">Quantity</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Observation / Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Residue (on filter paper)</td>
              <td className="border border-slate-400 px-2 py-1">Insoluble sand, pale brown, damp before drying</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Filtrate</td>
              <td className="border border-slate-400 px-2 py-1">Clear, colourless salt solution</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">After evaporation</td>
              <td className="border border-slate-400 px-2 py-1">
                {evapOutcome === "perfect" ? "Clean white cubic salt crystals" : evapOutcome === "wet" ? "Wet white crystals with excess solution" : "Reduced white salt sample after spitting"}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Rinsing performed</td>
              <td className="border border-slate-400 px-2 py-1">{rinsed ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Splashing incidents while stirring</td>
              <td className="border border-slate-400 px-2 py-1">{splashCount}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Mass of sand recovered</td>
              <td className="border border-slate-400 px-2 py-1">{sandRecovered.toFixed(2)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Mass of salt recovered</td>
              <td className="border border-slate-400 px-2 py-1">{saltRecovered.toFixed(2)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Efficiency / accuracy</td>
              <td className="border border-slate-400 px-2 py-1">{efficiency.toFixed(1)}% &mdash; {rank}-Rank</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-6 text-base font-bold uppercase">Mass Conservation Check</h2>
        <p className="mt-1">
          Initial mixture mass = Mass of dry sand recovered + Mass of dry salt recovered
        </p>
        <p className="mt-1">
          {BASE_MIXTURE_MASS.toFixed(1)} g = {sandRecovered.toFixed(2)} g + {saltRecovered.toFixed(2)} g = {recoveredTotal.toFixed(2)} g recovered
        </p>
        <p className="mt-1">
          {recoveredTotal < BASE_MIXTURE_MASS - 0.15
            ? "The recovered mass was lower than the starting mass, indicating some salt solution remained on the sand or was lost while boiling aggressively."
            : "The recovered mass closely matched the starting mass of the mixture."}
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Sources of Error &amp; Precautions</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Stirring too vigorously can cause the mixture to splash out of the beaker, losing material.</li>
          <li>Insufficient rinsing of the residue leaves salt trapped on the sand, reducing salt yield.</li>
          <li>Heating too quickly can cause the solution to spit, ejecting salt from the evaporating basin.</li>
          <li>Continuing to heat a nearly dry basin can cause violent spitting, sample loss and damage to the apparatus.</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Conclusion</h2>
        <p className="mt-1">
          The salt&ndash;sand mixture was successfully separated into its components using dissolving, filtration
          and evaporation. {outcomeText} This trial recovered {sandRecovered.toFixed(2)} g of sand and{" "}
          {saltRecovered.toFixed(2)} g of salt, an overall efficiency of {efficiency.toFixed(1)}%.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

interface SaltSandSeparationSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

export default function SaltSandSeparationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: SaltSandSeparationSimProps) {
  const [stage, setStage] = useState<Stage>("mixing");

  // Mixing
  const [waterAdded, setWaterAdded] = useState(false);
  const [waterPouring, setWaterPouring] = useState(false);
  const [waterPourProgress, setWaterPourProgress] = useState(0);
  const [stirring, setStirring] = useState(false);
  const [dissolveProgress, setDissolveProgress] = useState(0);
  const [stirSpeed, setStirSpeed] = useState(55);
  const [splashCount, setSplashCount] = useState(0);
  const [splashBurst, setSplashBurst] = useState<BurstState>({ key: 0, origin: MIX_BEAKER_POS.clone() });

  // Filtering
  const [pouring, setPouring] = useState(false);
  const [pourProgress, setPourProgress] = useState(0);
  const [rinsed, setRinsed] = useState(false);
  const [rinseProgress, setRinseProgress] = useState(0);
  const [dripBurst] = useState<BurstState>({ key: 0, origin: FUNNEL_POS.clone().add(new THREE.Vector3(0, -0.4, 0)) });
  const [rinseBurst, setRinseBurst] = useState<BurstState>({ key: 0, origin: FUNNEL_POS.clone() });
  const rinseInProgress = rinseProgress > 0 && rinseProgress < 100;

  // Drying
  const [dryingProgress, setDryingProgress] = useState(0);
  const [sandTransferProgress, setSandTransferProgress] = useState(0);
  const [solutionTransferProgress, setSolutionTransferProgress] = useState(0);
  const [fastForward, setFastForward] = useState(false);

  // Evaporating
  const [burnerLit, setBurnerLit] = useState(false);
  const [heat, setHeat] = useState(0);
  const [liquidRemaining, setLiquidRemaining] = useState(100);
  const [evapElapsed, setEvapElapsed] = useState(0);
  const [dryAtSeconds, setDryAtSeconds] = useState<number | null>(null);
  const [evapOutcome, setEvapOutcome] = useState<EvapOutcome>("pending");
  const [crystalGrowth, setCrystalGrowth] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"see" | "learn" | "do" | null>(null);
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  // --- Doing Mode: free-roam + physical pickup interactions -----------
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

  const dissolveIntervalRef = useRef<number | null>(null);
  const dryingIntervalRef = useRef<number | null>(null);
  const evapIntervalRef = useRef<number | null>(null);
  const waterSoundStartedRef = useRef(false);
  const audioRef = useRef<{
    waterPouring: HTMLAudioElement;
    rinsing: HTMLAudioElement;
    burner: HTMLAudioElement;
  } | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const waterPouringAudio = new Audio("/sounds/water_pouring.mp3");
      const rinsingAudio = new Audio("/sounds/rinsing.mp3");
      const burnerAudio = new Audio("/sounds/burner.mp3");
      waterPouringAudio.preload = "auto";
      rinsingAudio.preload = "auto";
      burnerAudio.preload = "auto";
      waterPouringAudio.loop = true;
      rinsingAudio.loop = true;
      burnerAudio.loop = true;
      waterPouringAudio.volume = 0.72;
      rinsingAudio.volume = 0.68;
      burnerAudio.volume = 0.58;
      audioRef.current = { waterPouring: waterPouringAudio, rinsing: rinsingAudio, burner: burnerAudio };
    }
    return audioRef.current;
  }, []);

  const stopAllAudio = useCallback(() => {
    if (!audioRef.current) return;
    stopAudio(audioRef.current.waterPouring);
    audioRef.current.waterPouring.volume = 0.72;
    waterSoundStartedRef.current = false;
    stopAudio(audioRef.current.rinsing);
    stopAudio(audioRef.current.burner);
  }, []);

  useEffect(() => () => stopAllAudio(), [stopAllAudio]);

  // --- Mixing logic ---------------------------------------------------
  useEffect(() => {
    if (!stirring) {
      if (dissolveIntervalRef.current) window.clearInterval(dissolveIntervalRef.current);
      return;
    }
    dissolveIntervalRef.current = window.setInterval(() => {
      const inOptimalBand = stirSpeed >= 40 && stirSpeed <= 78;
      const tooFast = stirSpeed > 88;
      setDissolveProgress((prev) => clamp(prev + (stirSpeed === 0 ? 0 : inOptimalBand ? 2.4 : tooFast ? 0.6 : 1.2 * stirSpeed / 40), 0, 100));
      if (tooFast && Math.random() < 0.35) {
        setSplashCount((c) => c + 1);
        setSplashBurst((b) => ({ key: b.key + 1, origin: MIX_BEAKER_POS.clone().add(new THREE.Vector3(0, 0.6, 0)) }));
      }
    }, 180);
    return () => {
      if (dissolveIntervalRef.current) window.clearInterval(dissolveIntervalRef.current);
    };
  }, [stirring, stirSpeed]);

  const handleAddWater = useCallback(() => {
    if (waterAdded || waterPouring) return;
    const { waterPouring: waterPouringAudio } = getAudio();
    waterPouringAudio.currentTime = 0;
    waterPouringAudio.volume = 0;
    safePlay(waterPouringAudio);
    waterSoundStartedRef.current = false;
    setWaterPourProgress(1);
    setWaterPouring(true);
  }, [getAudio, waterAdded, waterPouring]);

  useEffect(() => {
    const { waterPouring: waterPouringAudio } = getAudio();
    const streamHasHit = waterPourProgress >= WATER_CONTACT_PROGRESS;
    const streamHasEnded = waterPourProgress >= WATER_STREAM_END_PROGRESS;

    if (waterPouring && streamHasHit && !streamHasEnded && !waterSoundStartedRef.current) {
      waterSoundStartedRef.current = true;
      waterPouringAudio.currentTime = 0;
      waterPouringAudio.volume = 0.72;
      safePlay(waterPouringAudio);
      return;
    }

    if (streamHasEnded && waterSoundStartedRef.current) {
      stopAudio(waterPouringAudio);
      waterPouringAudio.volume = 0.72;
      waterSoundStartedRef.current = false;
    }
  }, [getAudio, waterPouring, waterPourProgress]);

  useEffect(() => {
    if (!waterPouring) return;
    const id = window.setInterval(() => {
      setWaterPourProgress((prev) => {
        const next = clamp(prev + 2.1, 0, 100);
        if (next >= 100) {
          window.clearInterval(id);
          stopAudio(getAudio().waterPouring);
          setWaterPouring(false);
          setWaterAdded(true);
        }
        return next;
      });
    }, 80);
    return () => {
      window.clearInterval(id);
      const { waterPouring: waterPouringAudio } = getAudio();
      stopAudio(waterPouringAudio);
      waterPouringAudio.volume = 0.72;
    };
  }, [getAudio, waterPouring]);

  // --- Filtration logic ------------------------------------------------
  useEffect(() => {
    if (!pouring) return;
    const id = window.setInterval(() => {
      setPourProgress((prev) => {
        const next = clamp(prev + 2.45, 0, 116);
        if (next >= 116) {
          window.clearInterval(id);
          stopAudio(getAudio().waterPouring);
          setPouring(false);
        }
        return next;
      });
    }, 90);
    return () => {
      window.clearInterval(id);
      stopAudio(getAudio().waterPouring);
    };
  }, [getAudio, pouring]);

  const handlePour = useCallback(() => {
    if (pourProgress >= 100) return;
    const { waterPouring: waterPouringAudio } = getAudio();
    waterPouringAudio.currentTime = 0;
    safePlay(waterPouringAudio);
    setPouring(true);
  }, [getAudio, pourProgress]);

  const handleStartStirring = useCallback(() => {
    if (!waterAdded || dissolveProgress >= 100) return;
    const { rinsing: rinsingAudio } = getAudio();
    rinsingAudio.currentTime = 0;
    safePlay(rinsingAudio);
    setStirring(true);
  }, [dissolveProgress, getAudio, waterAdded]);

  const handleStopStirring = useCallback(() => {
    stopAudio(getAudio().rinsing);
    setStirring(false);
  }, [getAudio]);

  useEffect(() => {
    if (dissolveProgress < 100) return;
    stopAudio(getAudio().rinsing);
    setStirring(false);
  }, [dissolveProgress, getAudio]);

  const handleRinse = useCallback(() => {
    if (rinsed || rinseProgress > 0 || pourProgress < 116) return;
    const { rinsing: rinsingAudio } = getAudio();
    rinsingAudio.currentTime = 0;
    safePlay(rinsingAudio);
    setRinseProgress(1);
    setRinseBurst((b) => ({ key: b.key + 1, origin: FUNNEL_POS.clone().add(new THREE.Vector3(0, 0.3, 0)) }));
  }, [getAudio, rinsed, rinseProgress, pourProgress]);

  useEffect(() => {
    if (!rinseInProgress) return;
    const id = window.setInterval(() => {
      setRinseProgress((prev) => {
        if (prev <= 0 || prev >= 100) {
          window.clearInterval(id);
          stopAudio(getAudio().rinsing);
          return prev;
        }
        const next = clamp(prev + 2, 0, 100);
        if (next >= 100) {
          window.clearInterval(id);
          stopAudio(getAudio().rinsing);
        }
        return next;
      });
    }, 60);
    return () => {
      window.clearInterval(id);
      stopAudio(getAudio().rinsing);
    };
  }, [getAudio, rinseInProgress]);

  useEffect(() => {
    if (rinseProgress < 100 || rinsed) return;
    stopAudio(getAudio().rinsing);
    setRinsed(true);
  }, [getAudio, rinseProgress, rinsed]);

  useEffect(() => {
    if (stage !== "drying" && stage !== "evaporating") return;
    const setProgress = stage === "drying" ? setSandTransferProgress : setSolutionTransferProgress;
    const duration = stage === "drying" ? 3200 : 5200;
    let frame = 0;
    let started: number | null = null;
    const advance = (time: number) => {
      started ??= time;
      const progress = clamp((time - started - 650) / duration * 100, 0, 100);
      setProgress(progress);
      if (progress < 100) frame = window.requestAnimationFrame(advance);
    };
    frame = window.requestAnimationFrame(advance);
    return () => window.cancelAnimationFrame(frame);
  }, [stage]);

  const solutionPourSoundActive = stage === "evaporating" && solutionTransferProgress > 32 && solutionTransferProgress < 78;
  useEffect(() => {
    if (!solutionPourSoundActive) return;
    const audio = getAudio().waterPouring;
    audio.currentTime = 0;
    audio.volume = 0.6;
    safePlay(audio);
    return () => { stopAudio(audio); audio.volume = 0.72; };
  }, [getAudio, solutionPourSoundActive]);

  // --- Drying logic ------------------------------------------------------
  useEffect(() => {
    if (stage !== "drying" || sandTransferProgress < 100) return;
    const id = window.setInterval(() => {
      setDryingProgress((prev) => clamp(prev + (fastForward ? 4 : 1), 0, 100));
    }, 150);
    dryingIntervalRef.current = id;
    return () => window.clearInterval(id);
  }, [stage, fastForward, sandTransferProgress]);

  // --- Evaporation logic ---------------------------------------------------
  const handleStrike = useCallback(() => {
    if (burnerLit || solutionTransferProgress < 100) return;
    const { burner } = getAudio();
    burner.currentTime = 0;
    safePlay(burner);
    setBurnerLit(true);
  }, [burnerLit, getAudio, solutionTransferProgress]);

  useEffect(() => {
    if (!burnerLit || stage !== "evaporating") return;
    const id = window.setInterval(() => {
      setHeat((currentHeat) => {
        const nextHeat = clamp(currentHeat + 0.03, 0, 1);
        setLiquidRemaining((prev) => {
          const evaporationRate = 0.28 + nextHeat * 0.9;
          const next = clamp(prev - evaporationRate, 0, 100);
          if (next <= 0 && dryAtSeconds === null) {
            setDryAtSeconds(evapElapsed + 0.15);
          }
          // Sodium chloride becomes visible only once the filtrate is highly concentrated.
          setCrystalGrowth(clamp((24 - next) / 24, 0, 1));
          return next;
        });
        return nextHeat;
      });
      setEvapElapsed((t) => t + 0.15);
    }, 150);
    evapIntervalRef.current = id;
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burnerLit, stage, dryAtSeconds]);

  // Prolonged heating of a nearly dry basin causes spitting and sample loss.
  useEffect(() => {
    if (dryAtSeconds === null || evapOutcome !== "pending") return;
    if (evapElapsed - dryAtSeconds > 4.5) {
      stopAudio(getAudio().burner);
      setBurnerLit(false);
      setEvapOutcome("overheated");
    }
  }, [evapElapsed, dryAtSeconds, evapOutcome, getAudio]);

  const handleStopHeating = useCallback(() => {
    if (evapOutcome !== "pending" && !burnerLit) return;
    stopAudio(getAudio().burner);
    setBurnerLit(false);
    if (liquidRemaining > 8) {
      setEvapOutcome("wet");
    } else if (dryAtSeconds !== null && evapElapsed - dryAtSeconds > 4.5) {
      setEvapOutcome("overheated");
    } else {
      setEvapOutcome("perfect");
      setCrystalGrowth(1);
    }
  }, [evapOutcome, burnerLit, liquidRemaining, dryAtSeconds, evapElapsed, getAudio]);

  // --- Stage transitions ----------------------------------------------
  const goToFiltering = useCallback(() => {
    if (dissolveProgress < 100) return;
    setStage("filtering");
  }, [dissolveProgress]);

  const goToDrying = useCallback(() => {
    if (pourProgress < 116 || rinseInProgress) return;
    setStage("drying");
  }, [pourProgress, rinseInProgress]);

  const goToEvaporating = useCallback(() => {
    if (dryingProgress < 100) return;
    setStage("evaporating");
  }, [dryingProgress]);

  const goToResults = useCallback(() => {
    if (evapOutcome === "pending") return;
    setStage("results");
  }, [evapOutcome]);

  const handleResetAll = useCallback(() => {
    stopAllAudio();
    setDemoActive(false);
    setStage("mixing");
    setWaterAdded(false);
    setWaterPouring(false);
    setWaterPourProgress(0);
    setStirring(false);
    setDissolveProgress(0);
    setStirSpeed(55);
    setSplashCount(0);
    setPouring(false);
    setPourProgress(0);
    setRinsed(false);
    setRinseProgress(0);
    setDryingProgress(0);
    setSandTransferProgress(0);
    setSolutionTransferProgress(0);
    setFastForward(false);
    setBurnerLit(false);
    setHeat(0);
    setLiquidRemaining(100);
    setEvapElapsed(0);
    setDryAtSeconds(null);
    setEvapOutcome("pending");
    setCrystalGrowth(0);
  }, [stopAllAudio]);

  // --- Derived results ---------------------------------------------------
  const evapFactor = evapOutcome === "perfect" ? 1 : evapOutcome === "wet" ? 0.7 : 0.6;
  const splashPenalty = clamp(1 - splashCount * 0.02, 0.85, 1);
  const rinseFactor = rinsed ? 0.99 : 0.9;

  const theoreticalSaltMass = BASE_MIXTURE_MASS * BASE_SALT_FRACTION;
  const theoreticalSandMass = BASE_MIXTURE_MASS * BASE_SAND_FRACTION;
  const saltRecovered = clamp(theoreticalSaltMass * evapFactor * rinseFactor, 0, theoreticalSaltMass);
  const sandRecovered = clamp(theoreticalSandMass * splashPenalty * (rinsed ? 1 : 0.98), 0, theoreticalSandMass);
  const efficiency = clamp(((saltRecovered + sandRecovered) / BASE_MIXTURE_MASS) * 100, 0, 100);
  const rank = efficiency >= 97 ? "S" : efficiency >= 90 ? "A" : efficiency >= 80 ? "B" : "C";

  const filteredFlowProgress = smoothstep((pourProgress - 42) / 70);
  const mixturePourProgress = smoothstep((pourProgress - 36) / 60);
  const rinseFlowProgress = clamp((rinseProgress - 28) / 72, 0, 1);
  const waterFillProgress = smoothstep((waterPourProgress - WATER_CONTACT_PROGRESS) / (WATER_STREAM_END_PROGRESS - WATER_CONTACT_PROGRESS));
  const addedWaterLevel = waterAdded ? 0.55 : 0.55 * waterFillProgress;
  const liquidLevelForMix = waterAdded || waterPouring ? (stage === "mixing" ? addedWaterLevel : 0.55 * (1 - mixturePourProgress)) : 0;
  const sourceRemaining = stage === "mixing" ? 1 : 1 - mixturePourProgress;
  const sourceSandFraction = BASE_SAND_FRACTION * sourceRemaining;
  const sourceSaltFraction = (1 - dissolveProgress / 100) * BASE_SALT_FRACTION * sourceRemaining;
  const filtrateLevel = filteredFlowProgress * 0.5 + rinseFlowProgress * 0.08;
  const residueHeight = mixturePourProgress * 0.22;
  const solutionPoured = smoothstep((solutionTransferProgress - 32) / 46);
  const basinLiquidLevel = pourProgress >= 100 ? liquidRemaining * solutionPoured : 0;

  // Doing Mode's world-space stations: same handlers the guided buttons call,
  // just reached by walking up and pressing/holding instead of tapping a panel.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const list: Interactable[] = [];

    if (stage === "mixing") {
      if (!waterAdded && !waterPouring) {
        list.push({ id: "mix-add-water", position: MIX_BEAKER_POS, radius: INTERACTION_RADIUS, label: "Add warm water", onActivate: handleAddWater });
      } else if (dissolveProgress < 100) {
        list.push({
          id: "mix-stir",
          position: MIX_BEAKER_POS,
          radius: INTERACTION_RADIUS,
          label: "Hold to stir",
          hold: true,
          onActivate: handleStartStirring,
          onRelease: handleStopStirring,
        });
      } else {
        list.push({ id: "mix-proceed", position: MIX_BEAKER_POS, radius: INTERACTION_RADIUS, label: "Proceed to filtration", onActivate: goToFiltering });
      }
    }

    if (stage === "filtering") {
      if (pourProgress < 100) {
        list.push({
          id: "filter-pour",
          position: FUNNEL_POS,
          radius: INTERACTION_RADIUS,
          label: pouring ? "Pouring…" : "Pour mixture into funnel",
          disabled: pouring,
          onActivate: handlePour,
        });
      } else if (!rinsed && !rinseInProgress) {
        list.push({ id: "filter-rinse", position: WASH_BOTTLE_POS, radius: INTERACTION_RADIUS, label: "Rinse residue", onActivate: handleRinse });
      } else if (!rinseInProgress) {
        list.push({ id: "filter-proceed", position: FUNNEL_POS, radius: INTERACTION_RADIUS, label: "Proceed to drying", onActivate: goToDrying });
      }
    }

    if (stage === "drying") {
      list.push({
        id: "drying-fast-forward",
        position: MAT_AREA_POS,
        radius: INTERACTION_RADIUS,
        label: dryingProgress >= 100 ? "Proceed to evaporation" : fastForward ? "Fast-forwarding…" : "Fast-forward drying",
        onActivate: dryingProgress >= 100 ? goToEvaporating : () => setFastForward((f) => !f),
      });
    }

    if (stage === "evaporating") {
      if (evapOutcome === "pending") {
        list.push({
          id: "burner-toggle",
          position: BURNER_POS,
          radius: INTERACTION_RADIUS,
          label: burnerLit ? "Stop heating" : "Strike Bunsen burner",
          onActivate: burnerLit ? handleStopHeating : handleStrike,
        });
      } else {
        list.push({ id: "evap-proceed", position: BASIN_POS, radius: INTERACTION_RADIUS, label: "See final results", onActivate: goToResults });
      }
    }

    return list;
  }, [
    mode,
    stage,
    waterAdded,
    waterPouring,
    dissolveProgress,
    pourProgress,
    pouring,
    rinsed,
    rinseInProgress,
    dryingProgress,
    fastForward,
    burnerLit,
    evapOutcome,
    handleAddWater,
    handleStartStirring,
    handleStopStirring,
    goToFiltering,
    handlePour,
    handleRinse,
    goToDrying,
    goToEvaporating,
    handleStrike,
    handleStopHeating,
    goToResults,
  ]);

  const mobileSummary = {
    mixing: `Dissolving: ${Math.round(dissolveProgress)}%`,
    filtering: rinseInProgress ? `Rinsing: ${Math.round(rinseProgress)}%` : `Pouring: ${Math.round(clamp(pourProgress, 0, 100))}%`,
    drying: `Drying: ${Math.round(dryingProgress)}%`,
    evaporating: `Water left: ${Math.round(liquidRemaining)}%`,
    results: `${rank}-Rank · ${efficiency.toFixed(1)}%`,
  }[stage];

  const contextualHowToSteps = useMemo<ExperimentTutorialStep[]>(() => {
    const completeByTitle: Record<string, () => boolean> = {
      "2. Add Water": () => waterAdded,
      "3. Dissolve Salt": () => dissolveProgress >= 100,
      "4. Go To Filtration": () => stage !== "mixing",
      "5. Pour Mixture": () => pourProgress >= 116 || stage !== "filtering",
      "6. Rinse Residue": () => rinsed,
      "7. Go To Drying": () => stage === "drying" || stage === "evaporating" || stage === "results",
      "8. Dry Sand": () => dryingProgress >= 100 || stage === "evaporating" || stage === "results",
      "9. Go To Evaporation": () => stage === "evaporating" || stage === "results",
      "10. Heat Filtrate": () => burnerLit || evapOutcome !== "pending" || stage === "results",
      "11. Stop Heating": () => evapOutcome !== "pending",
      "12. See Results": () => stage === "results",
    };

    return separationHowToSteps.map((step): ExperimentTutorialStep => {
      const isComplete = completeByTitle[step.title];
      if (!isComplete) return step;
      return { ...step, isComplete };
    });
  }, [burnerLit, dissolveProgress, dryingProgress, evapOutcome, pourProgress, rinsed, stage, waterAdded]);

  // Demonstrate the same operations and wait for each real animation to finish.
  const demoTick = useRef<() => void>(() => {});
  demoTick.current = () => {
      if (stage === "mixing") {
        if (!waterAdded && !waterPouring) handleAddWater();
        else if (waterAdded && dissolveProgress < 100 && !stirring) handleStartStirring();
        else if (dissolveProgress >= 100) goToFiltering();
      } else if (stage === "filtering") {
        if (pourProgress < 100 && !pouring) handlePour();
        else if (pourProgress >= 116 && !rinsed && rinseProgress === 0) handleRinse();
        else if (rinsed) { setFastForward(true); goToDrying(); }
      } else if (stage === "drying" && dryingProgress >= 100) goToEvaporating();
      else if (stage === "evaporating") {
        if (evapOutcome !== "pending") goToResults();
        else if (!burnerLit) handleStrike();
        else if (liquidRemaining <= 5) handleStopHeating();
      } else if (stage === "results") setDemoActive(false);
  };
  useEffect(() => {
    if (!demoActive) return;
    const timer = window.setInterval(() => demoTick.current(), 350);
    return () => window.clearInterval(timer);
  }, [demoActive]);

  const selectMode = (next: "see" | "learn" | "do") => {
    handleResetAll();
    setShowTutorial(false);
    onClosePaper();
    setSelectedMode(next);
    setMode(next === "do" ? "doing" : "learning");
    if (next === "see") setDemoActive(true);
  };
  const modeToggle = (
    <div className="flex overflow-hidden rounded-full border border-white/15 bg-[#090b25]/90 text-[9px] font-black uppercase shadow-xl" aria-label="Choose experiment mode">
      {(["see", "learn"] as const).map((item) => (
        <button key={item} type="button" onClick={() => selectMode(item)} aria-pressed={selectedMode === item}
          className={`px-3 py-2 transition-colors ${selectedMode === item ? item === "see" ? "bg-cyan-400 text-slate-950" : item === "learn" ? "bg-emerald-400 text-slate-950" : "bg-orange-400 text-slate-950" : "text-slate-300 hover:text-white"}`}>
          {{ see: "See", learn: "Learn", do: "Do" }[item]}
        </button>
      ))}
    </div>
  );


  const controlStep = {
    mixing: { number: 1, summary: "Here we dissolve the salt.", instruction: "Click Add water, then hold Stir.", progress: dissolveProgress, label: "Salt dissolved" },
    filtering: { number: 2, summary: "Here we filter out the sand.", instruction: "Click Pour mixture, then Rinse sand.", progress: clamp(pourProgress, 0, 100), label: "Mixture filtered" },
    drying: { number: 3, summary: "Here we dry the sand.", instruction: sandTransferProgress < 100 ? "Moving the sand onto the mat…" : "Click Fast-forward to speed it up.", progress: dryingProgress, label: "Sand dried" },
    evaporating: { number: 4, summary: "Here we recover the salt.", instruction: solutionTransferProgress < 100 ? "Pouring the salt solution into the bowl…" : "Click Light burner. Stop when crystals appear.", progress: 100 - liquidRemaining, label: "Water evaporated" },
    results: { number: 4, summary: "Salt and sand separated.", instruction: "Click Start again to repeat.", progress: 100, label: "Complete" },
  }[stage];
  const stepFraction = stage === "mixing" ? (waterAdded ? 20 + dissolveProgress * 0.8 : waterPourProgress * 0.2)
    : stage === "filtering" ? clamp(pourProgress / 116 * 80 + (rinsed ? 20 : rinseProgress * 0.2), 0, 100)
    : stage === "evaporating" && evapOutcome !== "pending" ? 100 : controlStep.progress;
  const experimentProgress = stage === "results" ? 100
    : clamp(((controlStep.number - 1) * 100 + stepFraction) / 4, 0, 100);

  return (<ExperimentLabelProvider>
    <div className={`relative flex h-full w-full flex-col overflow-hidden bg-slate-950 sm:flex-row separation-design ${isMobileViewport ? "separation-design--mobile" : ""}`}>
      <ExperimentTopBar variant="overlay" title="Salt & Sand Separation" symbol={null}
        onBack={onBack} onRequestHowTo={onRequestHowTo} onRequestPaper={onRequestPaper}
        accentBase="#22c55e" accentText="#bbf7d0" />
      <ExperimentHeaderPortal name="actions">{modeToggle}</ExperimentHeaderPortal>
      <div data-experiment-tour="separation-scene" style={{ marginRight: isMobileViewport ? 0 : 320 }} className="relative min-h-0 flex-1">
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          dpr={[1, 1.5]}
          camera={{ position: [2.6, 1.7, 7.4], fov: 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          className="h-full w-full"
        >
          <Scene
            stage={stage}
            mixLiquidLevel={liquidLevelForMix}
            waterPourProgress={waterPourProgress}
            sourceSandFraction={sourceSandFraction}
            sourceSaltFraction={sourceSaltFraction}
            stirring={stirring}
            stirSpeed={stirSpeed}
            pourProgress={pourProgress}
            residueHeight={residueHeight}
            filtrateLevel={filtrateLevel}
            rinseProgress={rinseProgress}
            dryingProgress={dryingProgress}
            sandTransferProgress={sandTransferProgress}
            solutionTransferProgress={solutionTransferProgress}
            basinLiquidLevel={basinLiquidLevel}
            liquidRemaining={liquidRemaining}
            crystalGrowth={crystalGrowth}
            saltRecovered={saltRecovered}
            burnerLit={burnerLit}
            heat={heat}
            splashBurst={splashBurst}
            dripBurst={dripBurst}
            rinseBurst={rinseBurst}
            mode={mode}
            isMobile={isMobileViewport}
            interactables={interactables}
            activeTargetId={activeInteractableMeta?.id ?? null}
            moveVectorRef={moveVectorRef}
            onTargetChange={handleTargetChange}
          />
        </Canvas>

        <MobileExperimentTopBar
          demoActive={demoActive}
          onDemo={() => selectMode(demoActive ? "learn" : "see")}
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
        />

        <div
          data-experiment-tour="separation-hud"
          className={`absolute left-3 top-14 z-10 flex max-w-[min(94vw,520px)] items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 shadow-2xl backdrop-blur sm:top-20 ${
            mode === "doing" ? "right-32 sm:right-36" : "right-3 sm:left-3 sm:right-auto sm:block"
          }`}
        >
          <div className="min-w-0 flex-1 sm:flex-none">
            <div className="truncate font-black uppercase tracking-wide text-orange-200">
              {{ mixing: "1 · Dissolving", filtering: "2 · Filtration", drying: "3 · Drying", evaporating: "4 · Evaporation", results: "5 · Results" }[stage]}
            </div>
            <div className="truncate text-slate-300">{mobileSummary}</div>
          </div>

          <div className="flex gap-2">
            <div className="min-w-[52px] rounded-lg border border-white/10 bg-slate-950/70 px-1.5 py-1 text-center">
              <div className="text-[11px] font-black text-orange-200">{rank}</div>
              <div className="text-[8px] text-slate-400">Rank</div>
            </div>
            <div className="min-w-[52px] rounded-lg border border-white/10 bg-slate-950/70 px-1.5 py-1 text-center">
              <div className="text-[11px] font-black text-emerald-200">{efficiency.toFixed(1)}%</div>
              <div className="text-[8px] text-slate-400">Yield</div>
            </div>
            <div className="min-w-[52px] rounded-lg border border-white/10 bg-slate-950/70 px-1.5 py-1 text-center">
              <div className="text-[11px] font-black text-sky-200">{stage === "evaporating" ? `${Math.round(liquidRemaining)}%` : `${Math.round(dissolveProgress)}%`}</div>
              <div className="text-[8px] text-slate-400">Progress</div>
            </div>
          </div>
        </div>

        {selectedMode === "see" && (
          <div className="absolute inset-x-4 bottom-6 z-20 mx-auto max-w-sm rounded-2xl bg-white/95 p-4 text-center text-slate-900 shadow-xl">
            <p className="text-sm font-bold" aria-live="polite">{stage === "results" ? "Separation complete" : demoActive ? "Watch the experiment" : "Demonstration stopped"}</p>
            <p className="mt-1 text-xs text-slate-600">{mobileSummary}</p>
            <button type="button" onClick={() => demoActive ? handleResetAll() : selectMode("see")} className="mt-3 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-white">
              {demoActive ? "Stop" : "Replay"}
            </button>
          </div>
        )}


      </div>

      <section
        data-experiment-tour="separation-controls"
        aria-label="Experiment steps"
        className={`separation-controls ${selectedMode === "learn" || (!isMobileViewport && selectedMode === "see") ? "separation-controls--visible" : ""}`}
      >
        <header className="separation-controls__header">
          <div className="separation-controls__steps" aria-label={`Step ${controlStep.number} of 4`}>
            {[1, 2, 3, 4].map((number) => (
              <Fragment key={number}>
                {number > 1 && <span className={`separation-controls__connector ${number <= controlStep.number ? "is-complete" : ""}`} />}
                <span className={`separation-controls__dot ${number === controlStep.number ? "is-current" : ""} ${number < controlStep.number || stage === "results" ? "is-complete" : ""}`}
                  aria-current={number === controlStep.number ? "step" : undefined}>
                  {number < controlStep.number || stage === "results" ? "✓" : number}
                </span>
              </Fragment>
            ))}
          </div>
          <div className="separation-controls__header-actions">
            <span className="separation-controls__percentage">{Math.round(experimentProgress)}%</span>
            <button type="button" className="separation-controls__reset" onClick={handleResetAll}>Reset</button>
          </div>
        </header>
        <div className="separation-controls__body">
          <div className="separation-controls__intro">
            <h2>{stage === "results" ? "Complete" : `Step ${controlStep.number}`}</h2>
            <p className="separation-controls__summary">{controlStep.summary}</p>
            <p className="separation-controls__instruction">{controlStep.instruction}</p>
          </div>
          <div className="separation-controls__actions">
            {stage === "mixing" && (
              <>
                <button type="button" data-experiment-tour="separation-stage-action"
                  onClick={handleAddWater} disabled={waterAdded || waterPouring} className="separation-controls__button">
                  {waterAdded ? "Water added ✓" : waterPouring ? "Adding water…" : "Add water"}
                </button>
                <button type="button" data-experiment-tour="separation-stir"
                  onPointerDown={handleStartStirring} onPointerUp={handleStopStirring}
                  onPointerCancel={handleStopStirring} onPointerLeave={handleStopStirring}
                  disabled={!waterAdded || dissolveProgress >= 100} className="separation-controls__button separation-controls__button--secondary select-none">
                  {dissolveProgress >= 100 ? "Dissolved ✓" : stirring ? "Stirring…" : "Hold to stir"}
                </button>
                <div className="separation-controls__slider">
                  <div><label htmlFor="stirSpeed">Stir speed</label><span>{stirSpeed}<span className="separation-controls__hint"> / 100 · ideal 40–78</span></span></div>
                  <input id="stirSpeed" type="range" min={0} max={100} step={1} value={stirSpeed}
                    onChange={(e) => setStirSpeed(Number(e.target.value))} />
                  {stirSpeed > 88 && <span className="separation-controls__warning">Slow down to avoid splashing.</span>}
                </div>
              </>
            )}
            {stage === "filtering" && (
              <>
                <button type="button" data-experiment-tour="separation-pour" onClick={handlePour}
                  disabled={pourProgress >= 100 || pouring} className="separation-controls__button">
                  {pourProgress >= 100 ? "Poured ✓" : pouring ? "Pouring…" : "Pour mixture"}
                </button>
                <button type="button" data-experiment-tour="separation-rinse" onClick={handleRinse}
                  disabled={pourProgress < 116 || rinsed || rinseInProgress} className="separation-controls__button separation-controls__button--secondary">
                  {rinsed ? "Rinsed ✓" : rinseInProgress ? `Rinsing… ${Math.round(rinseProgress)}%` : "Rinse sand"}
                </button>
              </>
            )}
            {stage === "drying" && (
              <button type="button" data-experiment-tour="separation-fast-forward" onClick={() => setFastForward((f) => !f)}
                className="separation-controls__button separation-controls__button--wide"
                aria-pressed={fastForward}>
                {fastForward ? "Normal speed" : "Fast-forward"}
              </button>
            )}
            {stage === "evaporating" && (
              <>
                <button type="button" data-experiment-tour="separation-strike" onClick={handleStrike}
                  disabled={solutionTransferProgress < 100 || burnerLit || evapOutcome !== "pending"} className="separation-controls__button">
                  {solutionTransferProgress < 100 ? "Transferring solution…" : burnerLit ? "Burner lit" : "Light burner"}
                </button>
                <button type="button" data-experiment-tour="separation-stop-heating" onClick={handleStopHeating}
                  disabled={!burnerLit} className="separation-controls__button separation-controls__button--secondary">Stop heating</button>
                {evapOutcome !== "pending" && <p className={`separation-controls__outcome ${evapOutcome === "perfect" ? "is-success" : ""}`}>
                  {evapOutcome === "perfect" ? "Clean salt crystals. Well timed." : evapOutcome === "wet" ? "Stopped early. Some water remains." : "Overheated. Some salt was lost."}
                </p>}
              </>
            )}
            {stage === "results" && (
              <>
                <div className="separation-controls__result"><span>Sand recovered</span><strong>{sandRecovered.toFixed(2)} <small>g</small></strong></div>
                <div className="separation-controls__result"><span>Salt recovered</span><strong>{saltRecovered.toFixed(2)} <small>g</small></strong></div>
                <p className="separation-controls__outcome">{rank}-Rank · {efficiency.toFixed(1)}% efficiency</p>
              </>
            )}
          </div>
        </div>
        <footer className="separation-controls__footer">
          <div className="separation-controls__progress">
            <div className="separation-controls__progress-label"><span>{controlStep.label}</span><span>{Math.round(clamp(controlStep.progress, 0, 100))}%</span></div>
            <div className="separation-controls__track" role="progressbar" aria-label={controlStep.label}
              aria-valuenow={Math.round(clamp(controlStep.progress, 0, 100))} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ width: `${clamp(controlStep.progress, 0, 100)}%` }} />
            </div>
          </div>
          {stage === "mixing" && <button type="button" data-experiment-tour="separation-to-filtering" onClick={goToFiltering}
            disabled={dissolveProgress < 100} className="separation-controls__button separation-controls__next">Next step <span aria-hidden="true">→</span></button>}
          {stage === "filtering" && <button type="button" data-experiment-tour="separation-to-drying" onClick={goToDrying}
            disabled={pourProgress < 116 || rinseInProgress} className="separation-controls__button separation-controls__next">Next step <span aria-hidden="true">→</span></button>}
          {stage === "drying" && <button type="button" data-experiment-tour="separation-to-evaporation" onClick={goToEvaporating}
            disabled={dryingProgress < 100} className="separation-controls__button separation-controls__next">Next step <span aria-hidden="true">→</span></button>}
          {stage === "evaporating" && <button type="button" data-experiment-tour="separation-to-results" onClick={goToResults}
            disabled={evapOutcome === "pending"} className="separation-controls__button separation-controls__next">See results <span aria-hidden="true">→</span></button>}
          {stage === "results" && <button type="button" onClick={handleResetAll}
            className="separation-controls__button separation-controls__next">Start again <span aria-hidden="true">↻</span></button>}
        </footer>
      </section>

      {showPaper && (
        <LabReport
          rinsed={rinsed}
          splashCount={splashCount}
          evapOutcome={evapOutcome}
          sandRecovered={sandRecovered}
          saltRecovered={saltRecovered}
          efficiency={efficiency}
          rank={rank}
          onClose={onClosePaper}
        />
      )}
      {selectedMode === null && (
        <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/15 p-5 backdrop-blur-[7px]">
          <div role="dialog" aria-modal="true" aria-labelledby="separation-mode-title" className="w-full max-w-[360px] rounded-2xl border border-white/80 bg-white p-6 text-center text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,.28)]">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><FlaskConical size={20} /></div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Salt &amp; Sand Separation</p>
            <h2 id="separation-mode-title" className="mt-1 text-2xl font-bold tracking-tight">Select mode</h2>
            <div className="mt-5 space-y-2.5">
              {([
                { id: "see", label: "See", detail: "Watch the complete experiment", Icon: Play, style: "bg-cyan-500 text-white hover:bg-cyan-600" },
                { id: "learn", label: "Learn", detail: "Explore each step with controls", Icon: BookOpen, style: "border border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100" },
              ] as const).map(({ id, label, detail, Icon, style }) => (
                <button key={id} type="button" onClick={() => selectMode(id)} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition focus-visible:ring-4 focus-visible:ring-emerald-200 ${style}`}>
                  <span><span className="block text-sm font-bold">{label}</span><span className="text-[11px] opacity-80">{detail}</span></span><Icon size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? contextualHowToSteps : separationTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  </ExperimentLabelProvider>);
}
