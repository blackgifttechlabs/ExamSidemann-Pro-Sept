import { ExperimentLabelProvider, LabLabel } from "./FoodTestsLabels";
import { BlenderLabProp, BlenderSteam } from './FoodTestsBlenderLabApparatus';
"use client";

import { FoodTestsRoom, FoodTestsWorkbench } from "./FoodTestsRoom";
import { RealisticBunsenBurner } from "./FoodTestsRealisticBunsenBurner";
import { PhotosynthesisBeakerModel } from "./FoodTestsPhotosynthesisBeakerModel";
import "./foodTestsApparatus.css";
import "./foodTestsDesign.css";

import type { ReactNode, MutableRefObject } from "react";
import { Fragment, useEffect, useRef, useState, useMemo, useCallback } from "react";
import { FlaskConical, Lightbulb, Play } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { ExperimentPaperModal, ExperimentPaperButton, ExperimentHowToButton } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "./FoodTestsControls";
import { HeaderModeToggle } from "./FoodTestsControls";
import { ExperimentSceneLoader } from "../../common/ExperimentSceneLoader";
import { type PlayerBounds } from "./FoodTestsControls";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";
import * as THREE from "three";


// ---------------------------------------------------------------------------
// Domain data: food samples & test chemistry
// ---------------------------------------------------------------------------

type TestId = "starch" | "sugar" | "protein" | "fat";

interface FoodSample {
  id: string;
  name: string;
  emoji: string;
  // Approximate relative concentration of each nutrient, 0 - 1.
  starch: number;
  sugar: number;
  protein: number;
  fat: number;
}

const FOOD_SAMPLES: FoodSample[] = [
  { id: "bread", name: "Bread", emoji: "🍞", starch: 0.9, sugar: 0.15, protein: 0.1, fat: 0.05 },
  { id: "potato", name: "Irish Potato", emoji: "🥔", starch: 0.95, sugar: 0.05, protein: 0.05, fat: 0.02 },
  { id: "cassava", name: "Cassava", emoji: "🍠", starch: 0.92, sugar: 0.05, protein: 0.02, fat: 0.01 },
  { id: "egg-white", name: "Egg White", emoji: "🥚", starch: 0, sugar: 0, protein: 0.95, fat: 0.02 },
  { id: "milk", name: "Milk", emoji: "🥛", starch: 0, sugar: 0.4, protein: 0.35, fat: 0.3 },
  { id: "cooking-oil", name: "Cooking Oil", emoji: "🫗", starch: 0, sugar: 0, protein: 0, fat: 1.0 },
  { id: "glucose", name: "Glucose Solution", emoji: "🧪", starch: 0, sugar: 0.95, protein: 0, fat: 0 },
  { id: "groundnuts", name: "Groundnuts", emoji: "🥜", starch: 0.05, sugar: 0.05, protein: 0.7, fat: 0.75 },
  { id: "apple-juice", name: "Apple Juice", emoji: "🧃", starch: 0, sugar: 0.55, protein: 0.02, fat: 0 },
  { id: "butter", name: "Butter", emoji: "🧈", starch: 0, sugar: 0.02, protein: 0.05, fat: 0.95 },
];

interface TestMeta {
  id: TestId;
  title: string;
  reagentName: string;
  positiveResult: string;
  negativeResult: string;
  accent: string;
  icon: string;
}

const TEST_META: Record<TestId, TestMeta> = {
  starch: {
    id: "starch",
    title: "Starch Test",
    reagentName: "Iodine solution",
    positiveResult: "Blue-black colour",
    negativeResult: "Stays orange-brown",
    accent: "#1e293b",
    icon: "🟤",
  },
  sugar: {
    id: "sugar",
    title: "Reducing Sugars Test",
    reagentName: "Benedict's solution",
    positiveResult: "Brick-red precipitate (on heating)",
    negativeResult: "Stays blue",
    accent: "#b45309",
    icon: "🔥",
  },
  protein: {
    id: "protein",
    title: "Proteins Test",
    reagentName: "Biuret reagent",
    positiveResult: "Purple / violet colour",
    negativeResult: "Stays pale blue",
    accent: "#6d28d9",
    icon: "🟣",
  },
  fat: {
    id: "fat",
    title: "Fats Test",
    reagentName: "Ethanol, then water",
    positiveResult: "White cloudy emulsion",
    negativeResult: "Stays clear",
    accent: "#0369a1",
    icon: "💧",
  },
};

const POSITIVE_THRESHOLD = 0.15;

// Iodine / starch colours
const IODINE_COLOR = "#a15c1e";
const STARCH_POSITIVE_COLOR = "#181830";

// Benedict's colour ladder — the real, graded response.
const BENEDICT_STOPS: Array<{ at: number; color: string; label: string }> = [
  { at: 0, color: "#1d4ed8", label: "Blue (no change)" },
  { at: 0.28, color: "#16a34a", label: "Green" },
  { at: 0.52, color: "#eab308", label: "Yellow" },
  { at: 0.76, color: "#f97316", label: "Orange" },
  { at: 1, color: "#b91c1c", label: "Brick-red precipitate" },
];

// Biuret colours
const BIURET_BASE = "#bfdbfe";
const BIURET_POSITIVE = "#7c3aed";

const REAGENT_BOTTLES: Array<{
  id: "iodine" | "benedict" | "biuret" | "ethanol" | "water";
  label: string;
  color: string;
  position: [number, number, number];
  fill: number;
}> = [
  { id: "iodine", label: "Iodine", color: "#914b16", position: [-3.05, -0.4, 0.62], fill: 0.48 },
  { id: "benedict", label: "Benedict's", color: "#168fc4", position: [-2.2, -0.4, 0.62], fill: 0.54 },
  { id: "biuret", label: "Biuret", color: "#6e9edb", position: [-1.35, -0.4, 0.62], fill: 0.46 },
  { id: "ethanol", label: "Ethanol", color: "#e8f8fb", position: [2.1, -0.4, 0.62], fill: 0.5 },
  { id: "water", label: "Water", color: "#bcecf4", position: [2.95, -0.4, 0.72], fill: 0.52 },
];

function reagentForTest(test: TestId) {
  if (test === "starch") return REAGENT_BOTTLES[0];
  if (test === "sugar") return REAGENT_BOTTLES[1];
  if (test === "protein") return REAGENT_BOTTLES[2];
  return REAGENT_BOTTLES[3];
}

function foodSampleColor(sample: FoodSample) {
  if (sample.id.includes("egg")) return "#e9e4ca";
  if (sample.id.includes("milk")) return "#eef2ff";
  if (sample.id.includes("oil") || sample.id.includes("butter")) return "#fde68a";
  if (sample.id.includes("apple")) return "#d9a744";
  if (sample.id.includes("groundnuts")) return "#a16207";
  if (sample.id.includes("glucose")) return "#dbeafe";
  if (sample.id.includes("potato") || sample.id.includes("cassava")) return "#e7d3a1";
  return "#c69c6d";
}

function foodSampleAccentColor(sample: FoodSample) {
  if (sample.id.includes("egg")) return "#ffffff";
  if (sample.id.includes("milk")) return "#dbeafe";
  if (sample.id.includes("oil") || sample.id.includes("butter")) return "#facc15";
  if (sample.id.includes("apple")) return "#dc6b5f";
  if (sample.id.includes("groundnuts")) return "#713f12";
  if (sample.id.includes("glucose")) return "#eff6ff";
  if (sample.id.includes("potato") || sample.id.includes("cassava")) return "#bca477";
  return "#8b5e34";
}

function hexLerp(hexA: string, hexB: string, t: number) {
  const a = new THREE.Color(hexA);
  const b = new THREE.Color(hexB);
  return a.lerp(b, Math.max(0, Math.min(1, t))).getHexString();
}

interface TestResult {
  colorHex: string;
  colorLabel: string;
  positive: boolean;
  cloudLevel?: number;
  precipitate?: boolean;
}

type ReagentTransferStage =
  | "idle"
  | "uncapping"
  | "lifting"
  | "approaching"
  | "drawing"
  | "moving"
  | "dispensing"
  | "returning"
  | "recapping";

function getStarchResult(sample: FoodSample): TestResult {
  const positive = sample.starch > POSITIVE_THRESHOLD;
  const t = positive ? Math.min(1, 0.62 + sample.starch * 0.42) : 0;
  return {
    colorHex: "#" + hexLerp(IODINE_COLOR, STARCH_POSITIVE_COLOR, t),
    colorLabel: positive ? "Blue-black" : "Orange-brown (no change)",
    positive,
  };
}

function getSugarResult(sample: FoodSample, heatProgress: number): TestResult {
  const detectableSugar = sample.sugar > POSITIVE_THRESHOLD
    ? (sample.sugar - POSITIVE_THRESHOLD) / (1 - POSITIVE_THRESHOLD)
    : 0;
  const effective = Math.min(1, detectableSugar * heatProgress * 1.18);
  let color = BENEDICT_STOPS[0].color;
  let label = BENEDICT_STOPS[0].label;
  for (let i = 0; i < BENEDICT_STOPS.length - 1; i++) {
    const cur = BENEDICT_STOPS[i];
    const next = BENEDICT_STOPS[i + 1];
    if (effective >= cur.at && effective <= next.at) {
      const localT = (effective - cur.at) / (next.at - cur.at || 1);
      color = "#" + hexLerp(cur.color, next.color, localT);
      label = localT > 0.5 ? next.label : cur.label;
      break;
    }
  }
  if (effective >= 1) {
    color = BENEDICT_STOPS[BENEDICT_STOPS.length - 1].color;
    label = BENEDICT_STOPS[BENEDICT_STOPS.length - 1].label;
  }
  const positive = sample.sugar > POSITIVE_THRESHOLD && heatProgress > 0.15;
  return {
    colorHex: color,
    colorLabel: label,
    positive,
    precipitate: effective > 0.82,
  };
}

function getProteinResult(sample: FoodSample, mixed: boolean): TestResult {
  const positive = mixed && sample.protein > POSITIVE_THRESHOLD;
  const t = positive ? Math.min(1, 0.58 + sample.protein * 0.44) : 0;
  return {
    colorHex: "#" + hexLerp(BIURET_BASE, BIURET_POSITIVE, t),
    colorLabel: !mixed ? "Not yet mixed" : positive ? "Purple / violet" : "Pale blue (no change)",
    positive,
  };
}

function getFatResult(sample: FoodSample, waterAdded: boolean): TestResult {
  const positive = waterAdded && sample.fat > POSITIVE_THRESHOLD;
  const cloudLevel = positive ? Math.min(1, 0.45 + sample.fat * 0.72) : 0;
  return {
    colorHex: "#eaf6ff",
    colorLabel: !waterAdded ? "Dissolved in ethanol (clear)" : positive ? "White cloudy emulsion" : "Stays clear",
    positive,
    cloudLevel,
  };
}

// ---------------------------------------------------------------------------
// Tutorial steps
// ---------------------------------------------------------------------------

const foodTestTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Level Start: Testing Food Substances",
    text: "You will test food samples for starch, reducing sugars, proteins and fats using the correct reagent for each nutrient.",
    mode: "modal",
  },
  {
    title: "Choose A Test",
    text: "Start by picking which nutrient you want to test for. Each test uses a different reagent and procedure.",
    mode: "bubble",
    selector: '[data-experiment-tour="test-menu"]',
  },
  {
    title: "Choose A Food Sample",
    text: "Next, pick a food sample from the shelf. You can test as many samples as you like against the same test.",
    mode: "bubble",
    selector: '[data-experiment-tour="sample-menu"]',
  },
  {
    title: "Follow The Procedure",
    text: "Work through the numbered steps on the right — add the reagent, heat or shake if required, then record your observation.",
    mode: "bubble",
    selector: '[data-experiment-tour="lab-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Results Log",
    text: "Every sample you record is added to your results table, ready to appear in the experiment paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="results-log"]',
  },
  {
    title: "Paper Button",
    text: "Open Paper at any time to generate a full practical write-up from everything you have tested so far.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

const foodTestHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Testing Food Substances",
    text: "Follow this sample run: pick a test, pick a food, run the procedure, then check the paper.",
    mode: "modal",
  },
  {
    title: "Step 1: Pick A Test",
    text: "Tap Starch Test to begin with the simplest procedure.",
    mode: "bubble",
    selector: '[data-experiment-tour="test-menu"]',
  },
  {
    title: "Step 2: Pick A Sample",
    text: "Tap a food sample, for example Bread, which is known to contain starch.",
    mode: "bubble",
    selector: '[data-experiment-tour="sample-menu"]',
  },
  {
    title: "Step 3: Add The Reagent",
    text: "Tap Add Iodine to add the reagent to the test tube and watch for a colour change.",
    mode: "bubble",
    selector: '[data-experiment-tour="action-primary"]',
    actionSelector: '[data-experiment-tour="action-primary"]',
    actionLabel: "Tap Add Iodine",
  },
  {
    title: "Step 4: Record Observation",
    text: "Tap Record Observation to log the colour and verdict into your results table.",
    mode: "bubble",
    selector: '[data-experiment-tour="action-record"]',
    actionSelector: '[data-experiment-tour="action-record"]',
    actionLabel: "Tap Record Observation",
  },
  {
    title: "Step 5: Open Paper",
    text: "Tap Paper to open the practical write-up generated from your results.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
    actionSelector: '[data-experiment-tour="paper"] button',
    actionLabel: "Tap Paper",
  },
  {
    title: "Congratulations",
    text: "You now know how to run a food substance test, record observations, and generate a report.",
    mode: "modal",
  },
];

// ---------------------------------------------------------------------------
// 3D building blocks
// ---------------------------------------------------------------------------

const WATER_BATH_TUBE_POSITION: [number, number, number] = [4.35, 0.72, -0.72];
const TUBE_STATION_POSITION: [number, number, number] = [0.15, -0.02, 0];

// Doing Mode: world-space stations, kept in one place so the free-roam rig
// and the guided panel agree on where every apparatus item sits on the bench.
const TUBE_STATION_POS = new THREE.Vector3(TUBE_STATION_POSITION[0], 0, TUBE_STATION_POSITION[2]);
const IODINE_POS = new THREE.Vector3(-3.05, 0, 0.62);
const BENEDICT_POS = new THREE.Vector3(-2.2, 0, 0.62);
const BIURET_POS = new THREE.Vector3(-1.35, 0, 0.62);
const ETHANOL_POS = new THREE.Vector3(2.1, 0, 0.62);
const WATER_BOTTLE_POS = new THREE.Vector3(2.95, 0, 0.72);
const WATER_BATH_POS = new THREE.Vector3(WATER_BATH_TUBE_POSITION[0], 0, WATER_BATH_TUBE_POSITION[2]);
const CHANGE_TEST_POS = new THREE.Vector3(-5.6, 0, 1.4);
const CHANGE_SAMPLE_POS = new THREE.Vector3(5.6, 0, 1.4);

// Doing Mode: the player roams the whole classroom floor, well back from the
// bench and around either side of it, rather than being glued to a narrow
// strip against it. The bench itself is a solid obstacle to walk around.
const PLAYER_BOUNDS: PlayerBounds = { minX: -20.5, maxX: 20.5, minZ: -9, maxZ: 20.5 };
const BENCH_OBSTACLES: PlayerBounds[] = [{ minX: -8, maxX: 8, minZ: -4, maxZ: 4 }, { minX: -11.2, maxX: -8.8, minZ: -2, maxZ: 4.4 }, { minX: 8.8, maxX: 11.2, minZ: -2, maxZ: 4.4 }];
const PLAYER_SPAWN = new THREE.Vector3(0.5, 0, 5.5);
const INTERACTION_RADIUS = 4.4;

function drawWrappedCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = Number.POSITIVE_INFINITY,
) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth || !currentLine) {
      currentLine = candidate;
      return;
    }
    lines.push(currentLine);
    currentLine = word;
  });
  if (currentLine) lines.push(currentLine);

  const visibleLines = lines.slice(0, maxLines);
  if (lines.length > maxLines && visibleLines.length > 0) {
    let finalLine = visibleLines[visibleLines.length - 1];
    while (context.measureText(`${finalLine}...`).width > maxWidth && finalLine.length > 1) {
      finalLine = finalLine.slice(0, -1).trimEnd();
    }
    visibleLines[visibleLines.length - 1] = `${finalLine}...`;
  }

  visibleLines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
}

function createCanvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
) {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return null;
  draw(context, canvas);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return { canvas, texture };
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

// A small brass gas-tap riser, echoing the Bunsen-burner supply points on a real bench.
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

function ExitSignSurface() {
  const sign = useMemo(
    () =>
      createCanvasTexture(256, 96, (context, canvas) => {
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
      }),
    [],
  );

  useEffect(() => () => sign?.texture.dispose(), [sign]);

  return (
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[0.62, 0.23]} />
      <meshBasicMaterial map={sign?.texture ?? null} color={sign ? "#ffffff" : "#065f46"} toneMapped={false} />
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

// Simplified extra student bench rows glimpsed further into the room, so the
// lab reads as a full classroom rather than a single isolated workstation.
function BackgroundBenchRow({ x }: { x: number }) {
  return (
    <group position={[x, 0, 1.2]}>
      <mesh position={[0, -0.55, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.4, 0.32, 6.4]} />
        <meshStandardMaterial color="#9fcbb0" roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.365, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.025, 6.4]} />
        <meshPhysicalMaterial color="#f4f5f0" roughness={0.28} clearcoat={0.35} clearcoatRoughness={0.3} />
      </mesh>
      {[-2.6, 0, 2.6].map((z) => (
        <mesh key={z} position={[0, -1.66, z]} castShadow>
          <boxGeometry args={[2.05, 1.9, 0.4]} />
          <meshStandardMaterial color="#465159" metalness={0.5} roughness={0.42} />
        </mesh>
      ))}
      <BenchSinkInsert position={[0, -0.34, -1.6]} />
      <GasTapRiser position={[0, -0.34, 1.4]} />
    </group>
  );
}

// A small rack of empty test tubes, sitting further back on the bench as
// decorative apparatus detail.
function TestTubeRackDecor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.09, 0]} castShadow>
        <boxGeometry args={[0.86, 0.09, 0.28]} />
        <meshStandardMaterial color="#4b3320" roughness={0.7} />
      </mesh>
      {[-0.32, -0.11, 0.11, 0.32].map((x, index) => (
        <mesh key={x} position={[x, 0.42, 0]} rotation={[0.03 * (index % 2 === 0 ? 1 : -1), 0, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.66, 20]} />
          <meshPhysicalMaterial
            color="#f8fdff"
            transparent
            opacity={1}
            roughness={0.05}
            transmission={0.94}
            thickness={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function LaboratoryRoom({
  reactionMessage,
  observationStatus,
  observationColorHex,
  observationIsActive,
}: {
  reactionMessage: string;
  observationStatus: string;
  observationColorHex: string;
  observationIsActive: boolean;
}) { return <group><group position={[0, -0.345, 0]}><FoodTestsRoom /><FoodTestsWorkbench /></group>
<BenchSinkInsert position={[-6.4, -0.34, -1.3]} />
<GasTapRiser position={[6.2, -0.34, -1.3]} />
<TestTubeRackDecor position={[-1.6, -0.32, -2.7]} />
<BackgroundBenchRow x={-10} />
<BackgroundBenchRow x={10} /></group>; }

function TestTube({
  targetColorHex,
  liquidLevel,
  cloudLevel = 0,
  precipitate = false,
  shakeKey = 0,
  impactKey = 0,
  sample,
  position = [0, 0, 0] as [number, number, number],
  moveToBath = false,
  bathPosition = WATER_BATH_TUBE_POSITION,
}: {
  targetColorHex: string;
  liquidLevel: number;
  cloudLevel?: number;
  precipitate?: boolean;
  shakeKey?: number;
  impactKey?: number;
  sample: FoodSample;
  position?: [number, number, number];
  moveToBath?: boolean;
  bathPosition?: [number, number, number];
}) {
  const tubeHeight = 1.9;
  const liquidHeight = tubeHeight * 0.62;
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const liquidShellRef = useRef<THREE.Mesh>(null);
  const liquidSurfaceRef = useRef<THREE.Mesh>(null);
  const swirlRef = useRef<THREE.Group>(null);
  const impactRippleRef = useRef<THREE.Group>(null);
  const reactionPlumeRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const precipitateRef = useRef<THREE.Group>(null);
  const currentColor = useRef(new THREE.Color(targetColorHex));
  const displayedLevel = useRef(liquidLevel);
  const displayedCloud = useRef(cloudLevel);
  const displayedPrecipitate = useRef(precipitate ? 1 : 0);
  const shakeElapsed = useRef(999);
  const lastShakeKey = useRef(shakeKey);
  const impactElapsed = useRef(999);
  const lastImpactKey = useRef(impactKey);
  const bathMoveElapsed = useRef(moveToBath ? 3.6 : 999);
  const lastMoveToBath = useRef(moveToBath);
  const startPosition = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position[0], position[1], position[2]],
  );
  const bathTarget = useMemo(
    () => new THREE.Vector3(bathPosition[0], bathPosition[1], bathPosition[2]),
    [bathPosition[0], bathPosition[1], bathPosition[2]],
  );
  const glassProfile = useMemo(
    () => [
      new THREE.Vector2(0, 0.015),
      new THREE.Vector2(0.11, 0.025),
      new THREE.Vector2(0.2, 0.075),
      new THREE.Vector2(0.245, 0.15),
      new THREE.Vector2(0.255, 0.24),
      new THREE.Vector2(0.265, tubeHeight - 0.11),
      new THREE.Vector2(0.285, tubeHeight - 0.035),
      new THREE.Vector2(0.285, tubeHeight),
      new THREE.Vector2(0.255, tubeHeight),
      new THREE.Vector2(0.242, tubeHeight - 0.035),
      new THREE.Vector2(0.237, 0.25),
      new THREE.Vector2(0.224, 0.17),
      new THREE.Vector2(0.178, 0.1),
      new THREE.Vector2(0.09, 0.065),
      new THREE.Vector2(0, 0.06),
    ],
    [],
  );
  const sampleTexture = useMemo(() => createCanvasTexture(256, 256, (context, canvas) => {
    context.fillStyle = "#b9b9b9";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const bread = sample.id === "bread";
    for (let i = 0; i < 420; i++) {
      const x = (i * 73.37) % 256;
      const y = (i * 131.71) % 256;
      context.fillStyle = i % 3 ? "#d6d6d6" : "#545454";
      context.beginPath();
      context.ellipse(x, y, bread ? 1 + i % 5 : 0.8, bread ? 1 + i % 3 : 2 + i % 6, i, 0, Math.PI * 2);
      context.fill();
    }
  }), [sample.id]);
  useEffect(() => () => sampleTexture?.texture.dispose(), [sampleTexture]);
  const crumbGeometry = useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(1, 2);
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
      const grain = 1 + 0.12 * Math.sin(x * 17 + y * 23) * Math.cos(z * 19 - y * 11);
      vertices.setXYZ(i, x * grain, y * grain, z * grain);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => crumbGeometry.dispose(), [crumbGeometry]);
  const reactionSeeds = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) => ({
        angle: index * 2.399,
        radius: 0.035 + ((index * 29) % 100) / 100 * 0.12,
        delay: index * 0.1,
        size: 0.022 + (index % 4) * 0.007,
      })),
    [],
  );
  const precipitateSeeds = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        angle: index * 2.399,
        radius: 0.025 + Math.sqrt(((index * 43) % 100) / 100) * 0.15,
        threshold: ((index * 31) % 100) / 120,
        bedHeight: 0.025 + (index % 5) * 0.012,
        size: 0.014 + (index % 4) * 0.004,
      })),
    [],
  );

  useFrame((_, delta) => {
    currentColor.current.lerp(new THREE.Color(targetColorHex), Math.min(1, delta * 0.72));
    displayedLevel.current = THREE.MathUtils.lerp(displayedLevel.current, liquidLevel, Math.min(1, delta * 1.35));
    displayedCloud.current = THREE.MathUtils.lerp(displayedCloud.current, cloudLevel, Math.min(1, delta * 0.9));
    displayedPrecipitate.current = THREE.MathUtils.lerp(
      displayedPrecipitate.current,
      precipitate ? 1 : 0,
      Math.min(1, delta * 0.82),
    );
    const shownLevel = Math.max(0.001, displayedLevel.current);
    const shownHeight = tubeHeight * 0.62 * shownLevel;
    const mat = liquidRef.current?.material;
    if (mat instanceof THREE.MeshStandardMaterial) {
      mat.color.copy(currentColor.current);
    }
    const shellMat = liquidShellRef.current?.material;
    if (shellMat instanceof THREE.MeshStandardMaterial) {
      shellMat.color.copy(currentColor.current);
      shellMat.emissive.copy(currentColor.current);
      shellMat.opacity = 0.72 + Math.sin(shownLevel * 4) * 0.035;
    }
    if (liquidRef.current) {
      liquidRef.current.scale.y = shownLevel;
      liquidRef.current.position.y = shownHeight / 2 + 0.05;
    }
    if (liquidShellRef.current) {
      liquidShellRef.current.visible = shownLevel > 0.01;
      liquidShellRef.current.scale.y = shownLevel;
      liquidShellRef.current.position.y = shownHeight / 2 + 0.05;
    }
    if (liquidSurfaceRef.current) {
      liquidSurfaceRef.current.visible = shownLevel > 0.01;
      liquidSurfaceRef.current.position.y = shownHeight + 0.055;
      liquidSurfaceRef.current.rotation.z += delta * 0.7;
      const surfaceMat = liquidSurfaceRef.current.material;
      if (surfaceMat instanceof THREE.MeshStandardMaterial) {
        surfaceMat.color.copy(currentColor.current);
      }
    }
    if (cloudRef.current) {
      const cloudAmount = displayedCloud.current;
      cloudRef.current.visible = cloudAmount > 0.01 && shownLevel > 0.01;
      cloudRef.current.position.y = shownHeight / 2 + 0.05;
      cloudRef.current.scale.y = shownLevel;
      const cloudMaterial = cloudRef.current.material;
      if (cloudMaterial instanceof THREE.MeshStandardMaterial) {
        cloudMaterial.opacity = Math.min(0.72, cloudAmount * 0.68);
      }
    }
    if (precipitateRef.current) {
      const precipitateAmount = displayedPrecipitate.current;
      precipitateRef.current.visible = precipitateAmount > 0.01 && shownLevel > 0.01;
      precipitateRef.current.children.forEach((child, index) => {
        const seed = precipitateSeeds[index];
        const settle = THREE.MathUtils.clamp((precipitateAmount - seed.threshold) * 5.5, 0, 1);
        child.visible = settle > 0.01;
        child.position.set(
          Math.cos(seed.angle) * seed.radius,
          0.08 + seed.bedHeight + (1 - settle) * shownHeight * 0.62,
          Math.sin(seed.angle) * seed.radius,
        );
        child.rotation.x += delta * (0.25 + index * 0.006);
        child.rotation.y += delta * (0.4 + index * 0.008);
        child.scale.setScalar(seed.size * (0.55 + settle * 0.45));
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.opacity = Math.min(0.94, settle * 1.4);
        }
      });
    }
    if (swirlRef.current) {
      swirlRef.current.visible = shownLevel > 0.02;
      swirlRef.current.position.y = shownHeight * 0.62 + 0.05;
      swirlRef.current.rotation.y += delta * (shakeElapsed.current < 0.9 ? 8 : 1.4);
      swirlRef.current.children.forEach((child, index) => {
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = (shakeElapsed.current < 0.9 ? 0.12 : 0.025) + Math.sin(index + shownLevel * 5) * 0.04;
        }
      });
    }

    if (lastImpactKey.current !== impactKey) {
      lastImpactKey.current = impactKey;
      impactElapsed.current = 0;
    }
    impactElapsed.current += delta;

    const impactRipple = impactRippleRef.current;
    if (impactRipple) {
      const rippleProgress = THREE.MathUtils.clamp(impactElapsed.current / 1.05, 0, 1);
      impactRipple.visible = impactElapsed.current < 1.05 && shownLevel > 0.01;
      impactRipple.position.y = shownHeight + 0.065;
      impactRipple.scale.setScalar(0.35 + rippleProgress * 0.9);
      impactRipple.children.forEach((child, index) => {
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.color.copy(currentColor.current);
          material.opacity = Math.max(0, (0.52 - index * 0.12) * (1 - rippleProgress));
        }
      });
    }

    const plume = reactionPlumeRef.current;
    if (plume) {
      const active = impactElapsed.current < 2.9 && shownLevel > 0.01;
      plume.visible = active;
      plume.children.forEach((child, index) => {
        const seed = reactionSeeds[index];
        const localTime = impactElapsed.current - seed.delay;
        const plumeProgress = THREE.MathUtils.clamp(localTime / 2.2, 0, 1);
        child.visible = active && localTime > 0 && plumeProgress < 1;
        child.position.set(
          Math.cos(seed.angle + plumeProgress * 2.2) * seed.radius * (1 - plumeProgress * 0.3),
          0.08 + shownHeight * (0.94 - plumeProgress * 0.74),
          Math.sin(seed.angle + plumeProgress * 2.2) * seed.radius * (1 - plumeProgress * 0.3),
        );
        const pulse = Math.sin(plumeProgress * Math.PI);
        child.scale.setScalar(seed.size * (0.8 + plumeProgress * 2.4));
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.color.copy(currentColor.current);
          material.opacity = Math.max(0, pulse * 0.32);
        }
      });
    }

    const group = groupRef.current;
    if (group) {
      if (lastMoveToBath.current !== moveToBath) {
        lastMoveToBath.current = moveToBath;
        bathMoveElapsed.current = 0;
      }
      bathMoveElapsed.current += delta;
      let transportTilt = 0;
      if (moveToBath) {
        const travel = THREE.MathUtils.clamp(bathMoveElapsed.current / 3.6, 0, 1);
        // Keep the sealed end above the water-bath rim for the entire carry.
        // Only lower once the tube is centred over the open beaker.
        const safeCarryHeight = Math.max(startPosition.y, bathTarget.y) + 1.22;
        const liftedStart = new THREE.Vector3(startPosition.x, safeCarryHeight, startPosition.z);
        const liftedTarget = new THREE.Vector3(bathTarget.x, safeCarryHeight, bathTarget.z);
        if (travel < 0.3) {
          group.position.lerpVectors(startPosition, liftedStart, THREE.MathUtils.smoothstep(travel / 0.3, 0, 1));
        } else if (travel < 0.72) {
          const across = THREE.MathUtils.smoothstep((travel - 0.3) / 0.42, 0, 1);
          group.position.lerpVectors(liftedStart, liftedTarget, across);
          group.position.y += Math.sin(across * Math.PI) * 0.08;
          transportTilt = Math.sin(across * Math.PI) * -0.025;
        } else {
          group.position.lerpVectors(
            liftedTarget,
            bathTarget,
            THREE.MathUtils.smoothstep((travel - 0.72) / 0.28, 0, 1),
          );
        }
      } else {
        group.position.copy(startPosition);
      }

      if (lastShakeKey.current !== shakeKey) {
        lastShakeKey.current = shakeKey;
        shakeElapsed.current = 0;
      }
      shakeElapsed.current += delta;
      const duration = 0.9;
      if (shakeElapsed.current < duration) {
        const progress = shakeElapsed.current / duration;
        const falloff = Math.sin(progress * Math.PI) * 0.12;
        group.rotation.z = transportTilt + Math.sin(shakeElapsed.current * 17) * falloff;
      } else {
        group.rotation.z = transportTilt;
      }
    }
  });

  const sampleColor = foodSampleColor(sample);
  const sampleAccentColor = foodSampleAccentColor(sample);
  const sampleIsLiquid =
    sample.id.includes("milk") ||
    sample.id.includes("oil") ||
    sample.id.includes("juice") ||
    sample.id.includes("glucose") ||
    sample.id.includes("egg");
  const sampleIsButter = sample.id === "butter";

  return (
    <group ref={groupRef} position={position} scale={[0.78, 1, 0.78]}>
      {/* Thick borosilicate tube with a rounded sealed base and open rim. */}
      <mesh renderOrder={40} castShadow>
        <latheGeometry args={[glassProfile, 72]} />
        <meshPhysicalMaterial
          color="#f8fdff"
          transparent
          opacity={1}
          roughness={0.025}
          metalness={0}
          transmission={0.94}
          thickness={0.015}
          ior={1.46}
          clearcoat={1}
          clearcoatRoughness={0.02}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, tubeHeight + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={44}>
        <torusGeometry args={[0.276, 0.021, 12, 72]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={0.72} roughness={0.015} transmission={0.42} />
      </mesh>
      <mesh position={[0, tubeHeight + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={43}>
        <torusGeometry args={[0.245, 0.008, 8, 64]} />
        <meshBasicMaterial color="#dff6ff" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[-0.18, 1.02, 0.22]} rotation={[0, 0, -0.035]} renderOrder={45}>
        <planeGeometry args={[0.009, 1.42]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      {[0.72, 0.92, 1.12, 1.32].map((y, index) => (
        <mesh key={y} position={[0.225, y, 0.11]} renderOrder={45}>
          <boxGeometry args={[index % 2 === 0 ? 0.07 : 0.045, 0.008, 0.009]} />
          <meshBasicMaterial color="#e0f2fe" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}

      <group position={[0, 0.22, 0]}>
        {sampleIsLiquid ? (
          <>
            <mesh position={[0, 0.11, 0]} renderOrder={18}>
              <cylinderGeometry args={[0.2, 0.185, 0.22, 48]} />
              <meshStandardMaterial
                color={sampleColor}
                transparent
                opacity={sample.id === "milk" ? 0.98 : sample.id === "egg-white" ? 0.38 : 0.62}
                roughness={sample.id === "milk" ? 0.28 : 0.08}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0.225, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={19}>
              <circleGeometry args={[0.2, 48]} />
              <meshStandardMaterial color={sampleColor} transparent opacity={0.96} roughness={0.06} depthWrite={false} />
            </mesh>
            {Array.from({ length: 9 }, (_, index) => {
              const angle = index * 2.399;
              const radius = 0.035 + ((index * 31) % 100) / 100 * 0.12;
              return (
                <mesh
                  key={index}
                  position={[Math.cos(angle) * radius, 0.06 + (index % 4) * 0.04, Math.sin(angle) * radius]}
                  renderOrder={20}
                >
                  <sphereGeometry args={[0.01 + (index % 3) * 0.003, 8, 6]} />
                  <meshBasicMaterial color={sampleAccentColor} transparent opacity={0.58} depthWrite={false} />
                </mesh>
              );
            })}
          </>
        ) : sampleIsButter ? (
          <>
            <mesh position={[0, 0.1, 0]} scale={[1.15, 0.58, 0.92]} castShadow renderOrder={18}>
              <sphereGeometry args={[0.16, 24, 16]} />
              <meshStandardMaterial color={sampleColor} emissive={sampleAccentColor} emissiveIntensity={0.04} roughness={0.72} />
            </mesh>
            {Array.from({ length: 8 }, (_, index) => (
              <mesh
                key={index}
                position={[
                  Math.cos(index * 2.399) * (0.05 + (index % 3) * 0.035),
                  0.16 + (index % 2) * 0.035,
                  Math.sin(index * 2.399) * (0.05 + (index % 3) * 0.035),
                ]}
                scale={[1, 0.65, 0.85]}
                renderOrder={19}
              >
                <sphereGeometry args={[0.032, 10, 8]} />
                <meshStandardMaterial color={index % 3 === 0 ? sampleAccentColor : sampleColor} roughness={0.78} />
              </mesh>
            ))}
          </>
        ) : (
          <>
            {Array.from({ length: 34 }, (_, index) => {
              const angle = index * 2.399;
              const distance = Math.sqrt(((index * 37) % 100) / 100) * 0.17;
              const isBread = sample.id === "bread";
              return (
                <mesh
                  key={index}
                  position={[
                    Math.cos(angle) * distance,
                    0.045 + ((index * 11) % 100) / 100 * 0.2,
                    Math.sin(angle) * distance,
                  ]}
                  rotation={[index * 0.17, index * 0.31, index * 0.11]}
                  scale={[
                    (0.022 + (index % 4) * 0.006) * (sample.id === "groundnuts" ? 1.3 : 1),
                    (0.018 + (index % 3) * 0.006) * (isBread ? 0.85 : 1),
                    0.02 + (index % 5) * 0.004,
                  ]}
                  castShadow
                  renderOrder={18}
                >
                  <primitive object={crumbGeometry} attach="geometry" />
                  <meshStandardMaterial
                    color={index % 4 === 0 ? sampleAccentColor : index % 5 === 0 ? "#f8fafc" : sampleColor}
                    bumpMap={sampleTexture?.texture}
                    bumpScale={isBread ? 0.012 : 0.004}
                    roughness={sample.id === "groundnuts" ? 0.65 : 0.92}
                  />
                </mesh>
              );
            })}
          </>
        )}
      </group>

      {liquidLevel > 0.01 && (
        <mesh ref={liquidRef} position={[0, liquidHeight / 2 + 0.05, 0]} renderOrder={24}>
          <cylinderGeometry args={[0.214, 0.2, liquidHeight, 64]} />
          <meshStandardMaterial
            color={targetColorHex}
            roughness={0.12}
            transparent
            opacity={0.58}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      <mesh ref={liquidShellRef} position={[0, liquidHeight / 2 + 0.05, 0]} visible={false} renderOrder={25}>
        <cylinderGeometry args={[0.219, 0.205, liquidHeight, 64, 1, true]} />
        <meshStandardMaterial
          color={targetColorHex}
          emissive={targetColorHex}
          emissiveIntensity={0.08}
          roughness={0.14}
          transparent
          opacity={0.72}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={liquidSurfaceRef} position={[0, liquidHeight + 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false} renderOrder={32}>
        <circleGeometry args={[0.214, 48]} />
        <meshStandardMaterial color={targetColorHex} roughness={0.06} transparent opacity={0.68} depthWrite={false} />
        <mesh position={[0, 0, 0.002]}>
          <torusGeometry args={[0.211, 0.004, 8, 64]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={1} roughness={0.04}
            transmission={0.94} depthWrite={false} />
        </mesh>
      </mesh>
      <group ref={impactRippleRef} visible={false}>
        {[0, 1].map((index) => (
          <mesh key={index} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.035 + index * 0.035, 0.044 + index * 0.035, 48]} />
            <meshBasicMaterial color={targetColorHex} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
      <group ref={reactionPlumeRef} visible={false}>
        {reactionSeeds.map((seed, index) => (
          <mesh key={index} scale={seed.size}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshBasicMaterial color={targetColorHex} transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <group ref={swirlRef} visible={false}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} rotation={[-Math.PI / 2, 0, index * 1.8]}>
            <ringGeometry args={[0.04 + index * 0.04, 0.048 + index * 0.04, 48, 1, 0, Math.PI * 1.45]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <mesh ref={cloudRef} position={[0, liquidHeight / 2 + 0.05, 0]} visible={false} renderOrder={29}>
        <cylinderGeometry args={[0.216, 0.202, liquidHeight, 48]} />
        <meshStandardMaterial
          color="#f8fafc"
          emissive="#e0f2fe"
          emissiveIntensity={0.08}
          transparent
          opacity={0}
          roughness={0.68}
          depthWrite={false}
        />
      </mesh>

      <group ref={precipitateRef} visible={false}>
        {precipitateSeeds.map((seed, index) => (
          <mesh key={index} scale={seed.size} renderOrder={31}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={index % 4 === 0 ? "#c2410c" : "#991b1b"}
              emissive="#7f1d1d"
              emissiveIntensity={0.08}
              transparent
              opacity={0}
              roughness={0.9}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function TestTubeClampStand({
  children,
  tubePosition,
}: {
  children: ReactNode;
  tubePosition: [number, number, number];
}) {
  const [tubeX, , tubeZ] = tubePosition;
  const rodX = tubeX + 0.78;
  const clampY = 1.46;

  return (
    <group>
      <mesh position={[rodX, -0.31, tubeZ + 0.18]} castShadow receiveShadow>
        <boxGeometry args={[0.92, 0.12, 0.72]} />
        <meshStandardMaterial color="#252a30" metalness={0.68} roughness={0.3} />
      </mesh>
      <mesh position={[rodX, 0.72, tubeZ + 0.18]} castShadow>
        <cylinderGeometry args={[0.038, 0.045, 2.02, 24]} />
        <meshStandardMaterial color="#aeb7c2" metalness={0.88} roughness={0.18} />
      </mesh>
      <mesh position={[rodX, clampY, tubeZ + 0.18]} castShadow>
        <cylinderGeometry args={[0.115, 0.115, 0.17, 32]} />
        <meshStandardMaterial color="#343a40" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh
        position={[(rodX + tubeX) / 2 + 0.04, clampY, tubeZ + 0.12]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.027, 0.027, Math.abs(rodX - tubeX) - 0.08, 20]} />
        <meshStandardMaterial color="#c2cad3" metalness={0.9} roughness={0.16} />
      </mesh>
      <mesh position={[tubeX, clampY, tubeZ]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.237, 0.026, 12, 64]} />
        <meshStandardMaterial color="#464d55" metalness={0.64} roughness={0.28} />
      </mesh>
      <mesh position={[tubeX, clampY, tubeZ]} rotation={[Math.PI / 2, 0, 0]} renderOrder={46}>
        <torusGeometry args={[0.217, 0.012, 10, 64]} />
        <meshStandardMaterial color="#18202a" roughness={0.8} />
      </mesh>
      <mesh position={[rodX + 0.13, clampY, tubeZ + 0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.22, 24]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      {children}
    </group>
  );
}

function ReagentBottle({
  label,
  color,
  position,
  fill = 0.72,
  active = false,
  transferStage = "idle",
}: {
  label: string;
  color: string;
  position: [number, number, number];
  fill?: number;
  active?: boolean;
  transferStage?: ReagentTransferStage;
}) {
  const capRef = useRef<THREE.Group>(null);
  const capOpenAmount = useRef(0);
  const liquidTop = 0.18 + 0.86 * fill;
  const bottleProfile = useMemo(
    () => [
      new THREE.Vector2(0, 0.02),
      new THREE.Vector2(0.25, 0.02),
      new THREE.Vector2(0.31, 0.05),
      new THREE.Vector2(0.35, 0.11),
      new THREE.Vector2(0.36, 0.19),
      new THREE.Vector2(0.36, 0.72),
      new THREE.Vector2(0.34, 0.82),
      new THREE.Vector2(0.29, 0.9),
      new THREE.Vector2(0.19, 1),
      new THREE.Vector2(0.16, 1.03),
      new THREE.Vector2(0.16, 1.1),
      new THREE.Vector2(0.139, 1.1),
      new THREE.Vector2(0.139, 1.025),
      new THREE.Vector2(0.17, 0.98),
      new THREE.Vector2(0.27, 0.88),
      new THREE.Vector2(0.318, 0.79),
      new THREE.Vector2(0.338, 0.19),
      new THREE.Vector2(0.29, 0.08),
      new THREE.Vector2(0, 0.065),
    ],
    [],
  );
  const liquidProfile = useMemo(
    () => [
      new THREE.Vector2(0, 0.09),
      new THREE.Vector2(0.23, 0.09),
      new THREE.Vector2(0.28, 0.11),
      new THREE.Vector2(0.3, 0.17),
      new THREE.Vector2(0.3, liquidTop - 0.02),
      new THREE.Vector2(0.285, liquidTop),
      new THREE.Vector2(0, liquidTop),
    ],
    [liquidTop],
  );
  const sticker = useMemo(
    () => createCanvasTexture(768, 384, (context, canvas) => {
      context.fillStyle = "#f5ead0";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#9a8762";
      context.lineWidth = 6;
      context.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);
      context.fillStyle = "#24251f";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = "bold 76px Arial, sans-serif";
      context.fillText(label.toUpperCase(), canvas.width / 2, 168, canvas.width - 80);
      context.font = "32px Arial, sans-serif";
      context.fillText("FOOD TEST • LAB REAGENT", canvas.width / 2, 270);
    }),
    [label],
  );
  useEffect(() => () => sticker?.texture.dispose(), [sticker]);
  const isClearLiquid = label === "Ethanol" || label === "Water";

  useFrame((_, delta) => {
    const cap = capRef.current;
    if (!cap) return;
    const capOnBench = transferStage !== "idle" && transferStage !== "recapping";
    capOpenAmount.current = THREE.MathUtils.lerp(
      capOpenAmount.current,
      capOnBench ? 1 : 0,
      Math.min(1, delta * 3.8),
    );
    const eased = capOpenAmount.current * capOpenAmount.current * (3 - 2 * capOpenAmount.current);
    const landingX = position[0] < 0 ? -0.42 : 0.42;
    if (eased < 0.24) {
      const unscrew = eased / 0.24;
      cap.position.set(0, 1.18 + unscrew * 0.2, 0);
      cap.rotation.set(0, unscrew * Math.PI * 3.5, 0);
    } else {
      const travel = THREE.MathUtils.smoothstep((eased - 0.24) / 0.76, 0, 1);
      const inverse = 1 - travel;
      cap.position.set(
        inverse * inverse * 0 + 2 * inverse * travel * landingX * 0.72 + travel * travel * landingX,
        inverse * inverse * 1.38 + 2 * inverse * travel * 1.52 + travel * travel * 0.17,
        2 * inverse * travel * 0.34 + travel * travel * 0.62,
      );
      cap.rotation.set(
        Math.sin(travel * Math.PI) * 0.12,
        Math.PI * 3.5 + travel * Math.PI * 0.5,
        Math.sin(travel * Math.PI) * 0.16,
      );
    }
  });

  return (
    <group position={position}>
      {active && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.5, 48]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.34} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh renderOrder={10}>
        <latheGeometry args={[liquidProfile, 72]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isClearLiquid ? 0.04 : 0.1}
          transparent
          opacity={isClearLiquid ? 0.62 : 0.9}
          roughness={0.16}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, liquidTop + 0.006, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={12}>
        <torusGeometry args={[0.235, 0.006, 8, 72]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh renderOrder={20} castShadow>
        <latheGeometry args={[bottleProfile, 72]} />
        <meshPhysicalMaterial
          color={label === "Iodine" ? "#d6b485" : "#f4fbff"}
          transparent
          opacity={1}
          roughness={0.045}
          transmission={0.94}
          ior={1.47}
          thickness={0.015}
          side={THREE.DoubleSide}
          clearcoat={1}
          clearcoatRoughness={0.02}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={22}>
        <torusGeometry args={[0.16, 0.012, 10, 48]} />
        <meshPhysicalMaterial color="#f4fbff" transparent opacity={0.5} roughness={0.04} transmission={0.35} />
      </mesh>
      <mesh position={[0, 1.096, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={18}>
        <circleGeometry args={[0.125, 48]} />
        <meshBasicMaterial color="#090d14" transparent opacity={0.76} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.035, 0]} renderOrder={17}>
        <cylinderGeometry args={[0.13, 0.145, 0.13, 48, 1, true]} />
        <meshPhysicalMaterial color="#dff6ff" transparent opacity={1} roughness={0.04} transmission={0.94} side={THREE.DoubleSide} />
      </mesh>
      <group ref={capRef} position={[0, 1.18, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.145, 0.17, 0.28, 32]} />
          <meshStandardMaterial color="#111827" roughness={0.42} />
        </mesh>
        {[-0.1, -0.05, 0, 0.05].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.157, 0.006, 6, 32]} />
            <meshStandardMaterial color="#374151" roughness={0.55} />
          </mesh>
        ))}
        {Array.from({ length: 28 }, (_, index) => {
          const angle = index / 28 * Math.PI * 2;
          return <mesh key={`grip-${index}`} position={[Math.sin(angle) * 0.158, 0.005, Math.cos(angle) * 0.158]}
            rotation={[0, angle, 0]}>
            <boxGeometry args={[0.009, 0.19, 0.008]} />
            <meshStandardMaterial color="#272c32" roughness={0.72} />
          </mesh>;
        })}
        <mesh position={[0, -0.142, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.135, 32]} />
          <meshStandardMaterial color="#d1d5db" roughness={0.72} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[0, 0.55, 0]} renderOrder={24}>
        <cylinderGeometry args={[0.367, 0.367, 0.34, 36, 1, true, -0.76, 1.52]} />
        <meshBasicMaterial map={sticker?.texture ?? null} color={sticker ? "#ffffff" : "#f5ead0"}
          toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Dropper({
  origin,
  target,
  triggerKey,
  color = "#7dd3fc",
  onStageChange,
  onReagentContact,
  onComplete,
  liquidLevel,
}: {
  origin: [number, number, number];
  target: [number, number, number];
  triggerKey: number;
  color?: string;
  onStageChange?: (stage: ReagentTransferStage) => void;
  onReagentContact?: () => void;
  onComplete?: () => void;
  liquidLevel: number;
}) {
  const duration = 8.55;
  const groupRef = useRef<THREE.Group>(null);
  const dropsRef = useRef<THREE.Group>(null);
  const bulbRef = useRef<THREE.Mesh>(null);
  const pipetteLiquidRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(999);
  const lastKey = useRef(triggerKey);
  const notifiedStage = useRef<ReagentTransferStage>("idle");
  const contactSent = useRef(false);
  const landingHeight = useRef(0.5);
  const shownLiquidLevel = useRef(liquidLevel);
  const completionSent = useRef(true);
  const animating = useRef(false);
  const originV = useMemo(() => new THREE.Vector3(...origin), [origin]);
  const targetV = useMemo(() => new THREE.Vector3(...target), [target]);
  const restPosition = useMemo(() => new THREE.Vector3(1.02, -0.18, 1.22), []);
  const clearancePosition = useMemo(() => originV.clone().add(new THREE.Vector3(0.52, 1, 0.28)), [originV]);
  const bottleHover = useMemo(() => originV.clone().add(new THREE.Vector3(0, 0.35, 0)), [originV]);
  const immersedPosition = useMemo(() => originV.clone().add(new THREE.Vector3(0, -0.62, 0)), [originV]);
  const travelTarget = useMemo(() => targetV.clone().add(new THREE.Vector3(0, 0.34, 0)), [targetV]);
  const restQuaternion = useMemo(
    () => new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, 0.16, -Math.PI / 2)),
    [],
  );
  const uprightQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const motionPosition = useRef(new THREE.Vector3());
  const motionQuaternion = useRef(new THREE.Quaternion());

  useFrame((_, delta) => {
    const group = groupRef.current;
    const drops = dropsRef.current;
    if (!group || !drops) return;

    if (lastKey.current !== triggerKey) {
      lastKey.current = triggerKey;
      elapsed.current = 0;
      landingHeight.current = targetV.y - 1.84 + Math.max(0.5, 1.9 * 0.62 * liquidLevel + 0.055);
      notifiedStage.current = "idle";
      contactSent.current = false;
      completionSent.current = false;
      animating.current = triggerKey > 0;
      group.visible = true;
    }

    if (!animating.current) {
      group.visible = true;
      group.position.copy(restPosition);
      group.quaternion.copy(restQuaternion);
      drops.visible = false;
      if (pipetteLiquidRef.current) pipetteLiquidRef.current.visible = false;
      if (bulbRef.current) bulbRef.current.scale.set(1, 1.22, 1);
      return;
    }

    elapsed.current += delta;
    const time = elapsed.current;
    const phase = (start: number, end: number) => THREE.MathUtils.smoothstep(time, start, end);
    let stage: ReagentTransferStage = "uncapping";
    let barrelFill = 0;
    let bulbScaleY = 1;
    group.quaternion.copy(uprightQuaternion);

    if (time < 1.1) {
      motionPosition.current.copy(restPosition);
      group.quaternion.copy(restQuaternion);
    } else if (time < 1.85) {
      stage = "lifting";
      const lift = phase(1.1, 1.85);
      motionPosition.current.lerpVectors(restPosition, clearancePosition, lift);
      motionPosition.current.y += Math.sin(lift * Math.PI) * 0.2;
      motionQuaternion.current.copy(restQuaternion).slerp(uprightQuaternion, lift);
      group.quaternion.copy(motionQuaternion.current);
    } else if (time < 2.65) {
      stage = "approaching";
      if (time < 2.24) {
        motionPosition.current.lerpVectors(clearancePosition, bottleHover, phase(1.85, 2.24));
      } else {
        motionPosition.current.lerpVectors(bottleHover, immersedPosition, phase(2.24, 2.65));
        bulbScaleY = THREE.MathUtils.lerp(1, 0.7, phase(2.28, 2.62));
      }
    } else if (time < 3.4) {
      stage = "drawing";
      const draw = phase(2.65, 3.4);
      motionPosition.current.copy(immersedPosition);
      barrelFill = draw;
      bulbScaleY = THREE.MathUtils.lerp(0.7, 1, draw);
    } else if (time < 3.85) {
      stage = "drawing";
      motionPosition.current.lerpVectors(immersedPosition, bottleHover, phase(3.4, 3.85));
      barrelFill = 1;
    } else if (time < 4.8) {
      stage = "moving";
      const travel = phase(3.85, 4.8);
      motionPosition.current.lerpVectors(bottleHover, travelTarget, travel);
      motionPosition.current.y += Math.sin(travel * Math.PI) * 0.34;
      group.rotation.z = -Math.sin(travel * Math.PI) * 0.08;
      barrelFill = 1;
    } else if (time < 6.1) {
      stage = "dispensing";
      const dispense = phase(4.9, 6.02);
      motionPosition.current.copy(travelTarget);
      barrelFill = THREE.MathUtils.lerp(1, 0.06, dispense);
      bulbScaleY = THREE.MathUtils.lerp(1, 0.68, dispense);
    } else if (time < 7.3) {
      stage = "returning";
      if (time < 6.7) {
        const clearTube = phase(6.1, 6.7);
        motionPosition.current.lerpVectors(travelTarget, clearancePosition, clearTube);
        motionPosition.current.y += Math.sin(clearTube * Math.PI) * 0.22;
      } else {
        const replace = phase(6.7, 7.3);
        motionPosition.current.lerpVectors(clearancePosition, restPosition, replace);
        motionPosition.current.y += Math.sin(replace * Math.PI) * 0.12;
        motionQuaternion.current.copy(uprightQuaternion).slerp(restQuaternion, replace);
        group.quaternion.copy(motionQuaternion.current);
      }
      barrelFill = THREE.MathUtils.lerp(0.06, 0, phase(6.1, 6.8));
      bulbScaleY = THREE.MathUtils.lerp(0.68, 1, phase(6.1, 6.7));
    } else {
      stage = "recapping";
      motionPosition.current.copy(restPosition);
      group.quaternion.copy(restQuaternion);
    }

    if (notifiedStage.current !== stage) {
      notifiedStage.current = stage;
      onStageChange?.(stage);
    }

    group.position.copy(motionPosition.current);

    if (bulbRef.current) {
      const widthScale = 1 + (1 - bulbScaleY) * 0.16;
      bulbRef.current.scale.set(widthScale, bulbScaleY * 1.22, widthScale);
    }
    if (pipetteLiquidRef.current) {
      pipetteLiquidRef.current.visible = barrelFill > 0.015;
      pipetteLiquidRef.current.scale.y = Math.max(0.001, barrelFill);
      pipetteLiquidRef.current.position.y = -0.09 + 0.21 * barrelFill;
    }

    shownLiquidLevel.current = THREE.MathUtils.lerp(shownLiquidLevel.current, liquidLevel, Math.min(1, delta * 1.35));
    landingHeight.current = targetV.y - 1.84 + Math.max(0.5, 1.9 * 0.62 * shownLiquidLevel.current + 0.055);
    const tipHeight = travelTarget.y - 0.216;
    const fallDistance = Math.max(0.1, tipHeight - landingHeight.current);
    const gravity = 9.81;
    const fallSeconds = Math.sqrt(2 * fallDistance / gravity);
    drops.visible = time >= 4.98 && time < 5.5 + fallSeconds;
    drops.children.forEach((child, index) => {
      const age = time - (4.98 + index * 0.13);
      const falling = age >= 0 && age < fallSeconds;
      child.visible = drops.visible && falling;
      child.position.set(0, -0.216 - 0.5 * gravity * Math.max(0, age) ** 2, 0);
      const stretch = 1 + Math.min(0.65, Math.max(0, age) * 1.5);
      child.scale.set(1 / Math.sqrt(stretch), stretch, 1 / Math.sqrt(stretch));
    });
    if (!contactSent.current && time >= 4.98 + fallSeconds) {
      contactSent.current = true;
      onReagentContact?.();
    }

    if (time >= duration) {
      animating.current = false;
      group.visible = true;
      group.position.copy(restPosition);
      group.quaternion.copy(restQuaternion);
      drops.visible = false;
      if (!completionSent.current) {
        completionSent.current = true;
        onComplete?.();
      }
    }
  });

  return (
    <>
      <group position={[1.02, -0.335, 1.22]}>
        <mesh receiveShadow>
          <boxGeometry args={[1.18, 0.05, 0.4]} />
          <meshStandardMaterial color="#6b7280" metalness={0.72} roughness={0.26} />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[1.08, 0.025, 0.3]} />
          <meshStandardMaterial color="#dbe4ea" roughness={0.62} />
        </mesh>
      </group>
      <group ref={groupRef} position={[1.02, -0.18, 1.22]}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.05, 0.065, 0.7, 24]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={1} roughness={0.015} transmission={0.94} thickness={0.015} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={pipetteLiquidRef} position={[0, -0.09, 0]} visible={false}>
        <cylinderGeometry args={[0.037, 0.043, 0.42, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.08} transparent opacity={0.82} roughness={0.12} depthWrite={false} />
      </mesh>
      {[0.12, 0.22, 0.32].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.054, 0.0025, 5, 24]} />
          <meshBasicMaterial color="#64748b" transparent opacity={0.46} />
        </mesh>
      ))}
      <mesh ref={bulbRef} position={[0, 0.59, 0]} scale={[1, 1.22, 1]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial color="#a91419" roughness={0.58} />
      </mesh>
      <mesh position={[0, 0.47, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.065, 0.014, 8, 28]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.052, 0.018, 0.2, 24]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={0.48} roughness={0.04} transmission={0.42} />
      </mesh>
      <mesh position={[0, -0.17, 0]}>
        <cylinderGeometry args={[0.012, 0.02, 0.09, 16]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={1} roughness={0.03} transmission={0.94} />
      </mesh>
      <mesh position={[0, -0.216, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={44}>
        <ringGeometry args={[0.004, 0.012, 20]} />
        <meshBasicMaterial color="#17202a" side={THREE.DoubleSide} />
      </mesh>
      <group ref={dropsRef} visible={false}>
        {[0, 1, 2, 3, 4].map((index) => (
          <group key={index}>
            <mesh renderOrder={42}>
              <sphereGeometry args={[0.025 + (index % 2) * 0.002, 20, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.015}
                transparent
                opacity={0.95}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[-0.008, 0.009, 0.019]} renderOrder={43}>
              <sphereGeometry args={[0.005, 8, 6]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.72} depthWrite={false} />
            </mesh>

          </group>
        ))}
      </group>
      </group>
    </>
  );
}

function PouringContainer({ triggerKey, color, label }: {
  triggerKey: number; color: string; label: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const streamRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(999);
  const lastKey = useRef(triggerKey);
  const start = useMemo(() => new THREE.Vector3(1.15, 1.15, 0.25), []);
  const pouring = useMemo(() => new THREE.Vector3(0.57, 2.15, 0), []);
  const lip = useMemo(() => new THREE.Vector3(), []);
  const landing = useMemo(() => new THREE.Vector3(0.15, TUBE_STATION_POSITION[1] + 1.9 * 0.62 + 0.055, 0), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  useFrame((_, delta) => {
    const group = groupRef.current;
    const stream = streamRef.current;
    if (!group || !stream) return;
    if (lastKey.current !== triggerKey) {
      lastKey.current = triggerKey;
      elapsed.current = 0;
    }
    elapsed.current += delta;
    const time = elapsed.current;
    group.visible = triggerKey > 0 && time < 2.8;
    const lift = THREE.MathUtils.smoothstep(time, 0, 0.6);
    const returnToBench = THREE.MathUtils.smoothstep(time, 2.05, 2.8);
    group.position.lerpVectors(start, pouring, lift * (1 - returnToBench));
    group.rotation.z = 1.02 * THREE.MathUtils.smoothstep(time, 0.6, 0.85)
      * (1 - THREE.MathUtils.smoothstep(time, 1.8, 2.05));
    if (liquidRef.current) {
      const remaining = 1 - 0.8 * THREE.MathUtils.smoothstep(time, 0.75, 1.8);
      liquidRef.current.scale.y = remaining;
      liquidRef.current.position.y = -0.28 + 0.21 * remaining;
      liquidRef.current.rotation.z = -group.rotation.z * 0.6;
    }
    stream.visible = group.visible && time >= 0.75 && time < 1.85;
    group.updateMatrixWorld();
    lip.set(-0.24, 0.34, 0).applyMatrix4(group.matrixWorld);
    direction.subVectors(lip, landing);
    stream.position.copy(lip).add(landing).multiplyScalar(0.5);
    stream.quaternion.setFromUnitVectors(up, direction.clone().normalize());
    const flow = Math.min(1, (time - 0.75) / 0.1, (1.85 - time) / 0.12);
    stream.scale.set(0.014 * Math.max(0.1, flow), direction.length(), 0.014 * Math.max(0.1, flow));
  });
  return <>
    <group ref={groupRef} visible={false} name={`${label} pouring beaker`}>
      <mesh castShadow>
        <cylinderGeometry args={[0.24, 0.27, 0.68, 48, 1, true]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={1} roughness={0.035}
          transmission={0.94} thickness={0.025} ior={1.47} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.025, 48]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={1} transmission={0.94} roughness={0.04} />
      </mesh>
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.012, 12, 48]} />
        <meshPhysicalMaterial color="#f8fdff" transparent opacity={1} transmission={0.94} roughness={0.04} />
      </mesh>
      <mesh ref={liquidRef} position={[0, -0.07, 0]}>
        <cylinderGeometry args={[0.21, 0.23, 0.42, 48]} />
        <meshPhysicalMaterial color={color} transparent opacity={1} roughness={0.06}
          transmission={0.5} ior={1.33} depthWrite={false} />
      </mesh>
      {[0, 1, 2, 3].map(i => <mesh key={i} position={[0.21, -0.15 + i * 0.1, 0.11]}>
        <boxGeometry args={[i % 2 ? 0.04 : 0.07, 0.006, 0.004]} />
        <meshBasicMaterial color="#62716f" />
      </mesh>)}
    </group>
    <mesh ref={streamRef} visible={false}>
      <cylinderGeometry args={[0.72, 1, 1, 16]} />
      <meshPhysicalMaterial color={color} transparent opacity={0.65} roughness={0.04}
        transmission={0.35} ior={1.33} depthWrite={false} />
    </mesh>
  </>;
}

function HeatedWaterBath({
  burnerLit,
  heatProgress,
  readyToLight,
  onLight,
  position,
}: {
  burnerLit: boolean;
  heatProgress: number;
  readyToLight: boolean;
  onLight: () => void;
  position: [number, number, number];
}) {
  const flameGroupRef = useRef<THREE.Group>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const waterSurfaceRef = useRef<THREE.Group>(null);
  const bubbleGroupRef = useRef<THREE.Group>(null);
  const convectionGroupRef = useRef<THREE.Group>(null);
  const steamGroupRef = useRef<THREE.Group>(null);
  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: 30 }, (_, index) => ({
        angle: index * 2.399,
        radius: 0.08 + ((index * 37) % 100) / 100 * 0.42,
        offset: ((index * 29) % 100) / 100,
        speed: 0.28 + (index % 7) * 0.055,
        size: 0.012 + (index % 5) * 0.0045,
        threshold: 0.3 + (index % 8) * 0.045,
      })),
    [],
  );
  const convectionSeeds = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        angle: index * 2.399,
        radius: 0.18 + (index % 5) * 0.055,
        offset: ((index * 17) % 100) / 100,
        speed: 0.07 + (index % 4) * 0.014,
      })),
    [],
  );
  const steamSeeds = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        angle: index * 2.399,
        radius: 0.04 + (index % 4) * 0.045,
        offset: ((index * 23) % 100) / 100,
        speed: 0.12 + (index % 5) * 0.018,
        size: 0.035 + (index % 4) * 0.012,
      })),
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const retainedHeat = heatProgress >= 1 ? 0.72 : heatProgress;
    const thermalActivity = burnerLit ? heatProgress : retainedHeat;

    if (flameGroupRef.current) {
      flameGroupRef.current.visible = burnerLit;
      const flicker = 1 + Math.sin(time * 18) * 0.055 + Math.sin(time * 31) * 0.025;
      flameGroupRef.current.scale.set(1 / Math.sqrt(flicker), flicker, 1 / Math.sqrt(flicker));
      flameGroupRef.current.position.x = Math.sin(time * 13) * 0.012;
    }
    if (flameLightRef.current) {
      flameLightRef.current.intensity = burnerLit ? 1.15 + Math.sin(time * 21) * 0.16 : 0;
    }

    if (waterRef.current?.material instanceof THREE.MeshStandardMaterial) {
      const cool = new THREE.Color("#88d7e8");
      const hot = new THREE.Color("#d9f4f3");
      waterRef.current.material.color.copy(cool.lerp(hot, heatProgress * 0.68));
      waterRef.current.material.opacity = 0.46 + heatProgress * 0.12;
    }
    if (waterSurfaceRef.current) {
      waterSurfaceRef.current.rotation.y = Math.sin(time * (0.7 + thermalActivity * 1.8)) * 0.045;
      waterSurfaceRef.current.children.forEach((child, index) => {
        const pulse = 0.84 + ((time * (0.25 + thermalActivity * 0.45) + index * 0.32) % 1) * 0.22;
        child.scale.setScalar(pulse);
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = (0.1 + thermalActivity * 0.22) * (1.1 - pulse);
        }
      });
    }

    if (convectionGroupRef.current) {
      convectionGroupRef.current.visible = thermalActivity > 0.08;
      convectionGroupRef.current.children.forEach((child, index) => {
        const seed = convectionSeeds[index];
        const phase = (time * seed.speed * (1 + thermalActivity * 2.4) + seed.offset) % 1;
        const angle = phase * Math.PI * 2 + seed.angle;
        child.position.set(
          Math.cos(seed.angle) * seed.radius + Math.sin(angle) * 0.045,
          1.48 + Math.sin(angle) * 0.3,
          Math.sin(seed.angle) * seed.radius * 0.72,
        );
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = Math.min(0.5, thermalActivity * 0.52) * (0.55 + Math.sin(angle) * 0.25);
          material.color.set(phase < 0.5 ? "#eafcff" : "#fbbf77");
        }
      });
    }

    if (bubbleGroupRef.current) {
      bubbleGroupRef.current.visible = thermalActivity > 0.22;
      bubbleGroupRef.current.children.forEach((child, index) => {
        const seed = bubbleSeeds[index];
        const bubbleStrength = THREE.MathUtils.clamp((thermalActivity - seed.threshold) * 4.5, 0, 1);
        const cycle = (time * seed.speed * (1 + thermalActivity * 2.3) + seed.offset) % 1;
        child.visible = bubbleStrength > 0.01;
        child.position.set(
          Math.cos(seed.angle) * seed.radius + Math.sin(cycle * Math.PI * 2) * 0.018,
          1.1 + cycle * 0.77,
          Math.sin(seed.angle) * seed.radius,
        );
        child.scale.setScalar(seed.size * (0.7 + cycle * 0.85 + thermalActivity * 0.45));
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = bubbleStrength * Math.sin(cycle * Math.PI) * 0.72;
        }
      });
    }

    if (steamGroupRef.current) {
      steamGroupRef.current.visible = thermalActivity > 0.62;
      steamGroupRef.current.children.forEach((child, index) => {
        const seed = steamSeeds[index];
        const cycle = (time * seed.speed * (1 + thermalActivity) + seed.offset) % 1;
        child.position.set(
          Math.cos(seed.angle + cycle * 1.2) * seed.radius * (1 + cycle * 1.8),
          2.15 + cycle * 0.92,
          Math.sin(seed.angle + cycle * 1.2) * seed.radius,
        );
        child.scale.setScalar(seed.size * (0.8 + cycle * 2.7));
        const material = (child as THREE.Mesh).material;
        if (material instanceof THREE.MeshBasicMaterial) {
          material.opacity = (thermalActivity - 0.6) * 0.65 * Math.sin(cycle * Math.PI);
        }
      });
    }
  });

  const stageLabel = heatProgress >= 1
    ? "Heating complete"
    : heatProgress >= 0.76
      ? "Hot water - steam rising"
      : heatProgress >= 0.46
        ? "Fine bubbles increasing"
        : heatProgress >= 0.16
          ? "Convection currents starting"
          : burnerLit
            ? "Water beginning to warm"
            : "Water bath ready";

  return (
    <group position={position}>
      {/* Dedicated heatproof station keeps the water bath separate from the reagent workspace. */}
      <mesh position={[0, 0.045, 0]} receiveShadow>
        <boxGeometry args={[1.9, 0.035, 1.72]} />
        <meshStandardMaterial color="#20262b" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.066, 0]}>
        <boxGeometry args={[1.72, 0.006, 1.54]} />
        <meshStandardMaterial color="#353d43" roughness={0.88} />
      </mesh>

      <group scale={[1.25,1.6,1.25]}><RealisticBunsenBurner lit={burnerLit} heat={heatProgress} hoseEnd={[1.48, .08, -.464]} /></group>

      {/* Tripod and wire gauze supporting the beaker. */}
      {[
        { position: [-0.48, 0.48, 0.36] as [number, number, number], rotation: [0.18, 0, -0.19] as [number, number, number] },
        { position: [0.48, 0.48, 0.36] as [number, number, number], rotation: [0.18, 0, 0.19] as [number, number, number] },
        { position: [0, 0.48, -0.49] as [number, number, number], rotation: [-0.22, 0, 0] as [number, number, number] },
      ].map((leg, index) => (
        <mesh key={index} position={leg.position} rotation={leg.rotation} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.93, 18]} />
          <meshStandardMaterial color="#33383c" metalness={0.84} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 0.94, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.69, 0.035, 12, 64]} />
        <meshStandardMaterial color="#30363b" metalness={0.86} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.98, 0]} receiveShadow>
        <boxGeometry args={[1.22, 0.025, 1.22]} />
        <meshStandardMaterial color="#555b60" metalness={0.72} roughness={0.52} transparent opacity={0.76} />
      </mesh>
      {[-0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45].map((offset) => (
        <group key={offset} position={[0, 1.002, 0]}>
          <mesh position={[offset, 0, 0]}>
            <boxGeometry args={[0.009, 0.008, 1.12]} />
            <meshStandardMaterial color="#252b30" metalness={0.85} roughness={0.34} />
          </mesh>
          <mesh position={[0, 0, offset]}>
            <boxGeometry args={[1.12, 0.008, 0.009]} />
            <meshStandardMaterial color="#252b30" metalness={0.85} roughness={0.34} />
          </mesh>
        </group>
      ))}

      <group position={[0, 1.01, 0]}><PhotosynthesisBeakerModel radius={0.656} height={1.12} /></group>
      <mesh ref={waterRef} position={[0, 1.48, 0]} renderOrder={20}>
        <cylinderGeometry args={[0.605, 0.575, 0.78, 72]} />
        <meshStandardMaterial color="#88d7e8" transparent opacity={0.48} roughness={0.1} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <group ref={waterSurfaceRef} position={[0, 1.875, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={31}>
          <circleGeometry args={[0.605, 72]} />
          <meshStandardMaterial color="#c8f4fa" transparent opacity={0.52} roughness={0.05} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
        {[0.17, 0.34, 0.5].map((radius) => (
          <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]} renderOrder={32}>
            <ringGeometry args={[radius, radius + 0.012, 64]} />
            <meshBasicMaterial color="#f0fdff" transparent opacity={0.1} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      <group ref={convectionGroupRef} visible={false}>
        {convectionSeeds.map((_, index) => (
          <mesh key={index} scale={[0.014, 0.038, 0.014]} renderOrder={28}>
            <sphereGeometry args={[1, 8, 6]} />
            <meshBasicMaterial color="#eafcff" transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <group ref={bubbleGroupRef} visible={false}>
        {bubbleSeeds.map((seed, index) => (
          <mesh key={index} scale={seed.size} renderOrder={30}>
            <sphereGeometry args={[1, 12, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} wireframe />
          </mesh>
        ))}
      </group>
      <BlenderSteam active={heatProgress > .62} heat={heatProgress} position={[0,2.13,0]} />

      <LabLabel position={[0, 2.6, 0]} center distanceFactor={8.2} occlude={false} zIndexRange={[8, 0]} style={{ pointerEvents: "none" }}>
        <div className="food-apparatus-marker food-tests-marker">
          <div className="food-apparatus-marker__tag"><span className="food-apparatus-marker__title">Water bath</span><span className="food-apparatus-marker__mass">{Math.round(heatProgress * 100)}%</span></div>
          <span className="food-apparatus-marker__stem" /><span className="food-apparatus-marker__arrow" />
        </div>
      </LabLabel>

      {readyToLight && !burnerLit && heatProgress < 1 && (
        <Html position={[-0.98, 0.62, 0.5]} center distanceFactor={7.5} occlude={false} zIndexRange={[60, 50]}>
          <div className="food-tests-burner-action">
            <button
              type="button"
              onClick={onLight}
              className="food-tests-burner-action__button"
            >
              Light burner
            </button>
          </div>
        </Html>
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
    <mesh ref={ringRef} position={[position.x, position.y + 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]} visible={active} renderOrder={50}>
      <ringGeometry args={[0.4, 0.5, 40]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.85} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function FoodSeeCamera({ test, transferStage, tubeInBath }: {
  test: TestId; transferStage: ReagentTransferStage; tubeInBath: boolean;
}) {
  const { camera, size } = useThree();
  const look = useRef(new THREE.Vector3());
  const position = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  useEffect(() => {
    camera.getWorldDirection(look.current).multiplyScalar(5).add(camera.position);
  }, [camera]);
  useFrame((_, delta) => {
    const atBottle = ["uncapping", "lifting", "approaching", "drawing", "returning", "recapping"].includes(transferStage);
    const location = atBottle ? reagentForTest(test).position
      : test === "sugar" && tubeInBath ? WATER_BATH_TUBE_POSITION : TUBE_STATION_POSITION;
    target.current.set(location[0], atBottle ? 0.5 : 1.0, location[2]);
    const aspect = Math.max(.25, size.width / Math.max(1, size.height));
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
    const halfFov = THREE.MathUtils.degToRad(fov / 2);
    const distance = Math.max(3.2, 1.4 / Math.sin(Math.min(halfFov, Math.atan(Math.tan(halfFov) * aspect))));
    position.current.set(target.current.x + distance * .15, target.current.y + distance * .25, target.current.z + distance * .96);
    camera.position.lerp(position.current, 1 - Math.exp(-delta * 1.75));
    look.current.lerp(target.current, 1 - Math.exp(-delta * 2.25));
    camera.lookAt(look.current);
  });
  return null;
}

interface SceneProps {
  demoActive?: boolean;
  test: TestId;
  sample: FoodSample;
  liquidColorHex: string;
  reactionMessage: string;
  liquidLevel: number;
  cloudLevel: number;
  precipitate: boolean;
  shakeKey: number;
  reagentImpactKey: number;
  dropTrigger: number;
  waterPourTrigger: number;
  heating: boolean;
  heatProgress: number;
  tubeInBath: boolean;
  bathReady: boolean;
  transferStage: ReagentTransferStage;
  reactionSettled: boolean;
  onLightBurner: () => void;
  onTransferStageChange: (stage: ReagentTransferStage) => void;
  onReagentContact: () => void;
  onTransferComplete: () => void;
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: MutableRefObject<{ x: number; y: number }>;
  onTargetChange?: (target: Interactable | null) => void;
}

function Scene({
  demoActive = false,
  test,
  sample,
  liquidColorHex,
  reactionMessage,
  liquidLevel,
  cloudLevel,
  precipitate,
  shakeKey,
  reagentImpactKey,
  dropTrigger,
  waterPourTrigger,
  heating,
  heatProgress,
  tubeInBath,
  bathReady,
  transferStage,
  reactionSettled,
  onLightBurner,
  onTransferStageChange,
  onReagentContact,
  onTransferComplete,
  mode = "learning",
  isMobile = false,
  interactables = [],
  activeTargetId = null,
  moveVectorRef,
  onTargetChange,
}: SceneProps) {
  const { camera, size } = useThree();
  const tableLightTargets = useMemo(() => [-3.8, 0, 4.2].map((x) => {
    const target = new THREE.Object3D(); target.position.set(x, 0.1, 0); return target;
  }), []);
  const isMobileFrame = isMobile || size.width < 640;
  const cameraTargetX = isMobileFrame ? 0.7 : 0.85;
  const cameraTargetY = isMobileFrame ? 0.55 : 0.82;
  const mobileCameraDistance = Math.min(13, Math.max(8.8, 4 / (Math.tan(THREE.MathUtils.degToRad(29)) * (Math.max(1, size.width) / Math.max(1, size.height)))));
  const tubePosition: [number, number, number] = TUBE_STATION_POSITION;

  useEffect(() => {
    if (mode !== "learning" || demoActive) return;
    const cameraPosition: [number, number, number] = isMobileFrame ? [0.7, 3.2, mobileCameraDistance] : [4.45, 2.7, 6.7];
    camera.position.set(...cameraPosition);
    camera.lookAt(cameraTargetX, cameraTargetY, 0);
    if ("fov" in camera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      perspectiveCamera.fov = isMobileFrame ? 58 : 50;
      perspectiveCamera.far = 80;
    }
    camera.updateProjectionMatrix();
  }, [camera, cameraTargetX, cameraTargetY, isMobileFrame, mobileCameraDistance, mode, demoActive]);

  const meta = TEST_META[test];
  const activeReagent = reagentForTest(test);
  const dropperOrigin: [number, number, number] = [
    activeReagent.position[0],
    activeReagent.position[1] + 1.35,
    activeReagent.position[2],
  ];
  const reagentIsInPipette =
    transferStage === "drawing" || transferStage === "moving" || transferStage === "dispensing";
  const observationColorHex = liquidLevel > 0
    ? liquidColorHex
    : reagentIsInPipette
      ? activeReagent.color
      : foodSampleColor(sample);
  const observationIsActive = transferStage !== "idle" || !reactionSettled || heating;
  const observationStatus = transferStage !== "idle"
    ? "Reagent transfer"
    : heating
      ? "Heating reaction"
      : liquidLevel > 0 && !reactionSettled
        ? "Reaction developing"
        : liquidLevel > 0
          ? "Stable observation"
          : "Sample ready";

  return (
    <>
      <color attach="background" args={["#3c4954"]} />
      <fog attach="fog" args={["#3c4954", 18, 38]} />
      <ambientLight intensity={0.24} />
      <directionalLight position={[4, 6, 4]} intensity={0.4} castShadow />
      <hemisphereLight args={["#f3ffff", "#26303a", 0.35]} />
      {tableLightTargets.map((target, index) => <Fragment key={index}>
        <primitive object={target} />
        <spotLight position={[target.position.x, 4.2, 0.8]} target={target} color="#fffaf2"
          intensity={70} distance={9} decay={2} angle={0.65} penumbra={0.8} />
      </Fragment>)}
      <pointLight position={[0.2, 2.3, 3.2]} intensity={2} distance={6} decay={2} color="#eef6ff" />

      <LaboratoryRoom
        reactionMessage={reactionMessage}
        observationStatus={observationStatus}
        observationColorHex={observationColorHex}
        observationIsActive={observationIsActive}
      />

      <mesh position={[tubePosition[0], -0.337, tubePosition[2]]} receiveShadow>
        <boxGeometry args={[1.35, 0.016, 1.15]} />
        <meshStandardMaterial color="#111513" roughness={0.96} />
      </mesh>
      {!tubeInBath && <LabLabel position={[tubePosition[0], tubePosition[1] + 2.35, tubePosition[2]]}
        center distanceFactor={9} occlude={false} zIndexRange={[8, 0]} style={{ pointerEvents: "none" }}>
        <div className="food-apparatus-marker food-tests-marker">
          <div className="food-apparatus-marker__tag"><span className="food-apparatus-marker__title">Food sample</span><span className="food-apparatus-marker__mass">{sample.name}</span></div>
          <span className="food-apparatus-marker__stem" /><span className="food-apparatus-marker__arrow" />
        </div>
      </LabLabel>}

      <TestTubeClampStand tubePosition={tubePosition}>
        <TestTube
          targetColorHex={liquidColorHex}
          liquidLevel={liquidLevel}
          cloudLevel={cloudLevel}
          precipitate={precipitate}
          shakeKey={shakeKey}
          impactKey={reagentImpactKey}
          sample={sample}
          position={tubePosition}
          moveToBath={tubeInBath}
          bathPosition={WATER_BATH_TUBE_POSITION}
        />
      </TestTubeClampStand>

      <group>
        {REAGENT_BOTTLES.map((bottle) => (
          <ReagentBottle
            key={bottle.id}
            label={bottle.label}
            color={bottle.color}
            position={bottle.position}
            active={bottle.id === activeReagent.id || (test === "fat" && bottle.id === "water")}
            transferStage={bottle.id === activeReagent.id ? transferStage : "idle"}
            fill={bottle.fill}
          />
        ))}
      </group>

      <Dropper
        origin={dropperOrigin}
        target={[tubePosition[0], tubePosition[1] + 1.84, tubePosition[2]]}
        triggerKey={dropTrigger}
        liquidLevel={liquidLevel}
        color={activeReagent.color}
        onStageChange={onTransferStageChange}
        onReagentContact={onReagentContact}
        onComplete={onTransferComplete}
      />
      {test === "sugar" && (
        <HeatedWaterBath
          burnerLit={heating}
          heatProgress={heatProgress}
          readyToLight={bathReady}
          onLight={onLightBurner}
          position={[WATER_BATH_TUBE_POSITION[0], -0.4, WATER_BATH_TUBE_POSITION[2]]}
        />
      )}
      {test === "fat" && <PouringContainer triggerKey={waterPourTrigger} color="#7dd3fc" label="Water" />}



      {demoActive ? (
        <FoodSeeCamera test={test} transferStage={transferStage} tubeInBath={tubeInBath} />
      ) : (
        <OrbitControls
          makeDefault
          target={[cameraTargetX, cameraTargetY, 0]}
          minDistance={isMobileFrame ? 6.5 : 3}
          maxDistance={14}
          minPolarAngle={1.08}
          maxPolarAngle={Math.PI / 2.1}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
          enablePan={false}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Experiment Paper
// ---------------------------------------------------------------------------

interface ResultLogEntry {
  id: string;
  testId: TestId;
  sampleName: string;
  reagentName: string;
  colorLabel: string;
  heatSeconds: number;
  verdict: boolean;
}

function FoodTestPaper({ log, onClose }: { log: ResultLogEntry[]; onClose: () => void }) {
  const testsUsed = Array.from(new Set(log.map((entry) => entry.testId)));

  return (
    <ExperimentPaperModal filename="food-substance-tests-experiment-paper.pdf" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase tracking-wide">
          Testing Food Substances for Starch, Reducing Sugars, Proteins and Fats
        </h1>

        <h2 className="mt-6 text-base font-bold uppercase">Aim</h2>
        <p className="mt-1">
          To test a range of food samples using appropriate reagents in order to identify the
          presence of starch, reducing sugars, proteins and fats.
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Apparatus &amp; Materials</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Test tubes and test tube rack</li>
          <li>Dropper / pipette</li>
          <li>Iodine solution (starch test)</li>
          <li>Benedict's solution and a water bath / heat source (reducing sugars test)</li>
          <li>Biuret reagent (proteins test)</li>
          <li>Ethanol and water (fats / emulsion test)</li>
          <li>Food samples as listed in the results table below</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Methodology</h2>
        <ol className="mt-1 list-decimal space-y-1 pl-6">
          <li>A small, equal-sized sample of each food was placed into a clean test tube.</li>
          <li>
            For the starch test, iodine solution was added directly to the sample and the colour
            change was observed immediately, with no heating required.
          </li>
          <li>
            For the reducing sugars test, Benedict's solution was added and the tube was heated in
            a water bath, with the colour observed as it changed over time.
          </li>
          <li>
            For the proteins test, Biuret reagent was added and the tube was shaken to mix the
            reagent thoroughly before the colour was observed.
          </li>
          <li>
            For the fats test, the sample was first dissolved in ethanol, then poured into a tube
            of water, and the appearance of the resulting mixture was observed.
          </li>
          <li>Each observation was recorded in the results table below.</li>
        </ol>

        <h2 className="mt-6 text-base font-bold uppercase">Results</h2>
        {log.length > 0 ? (
          <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-400 px-2 py-1 text-left">Food Sample</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Test</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Reagent</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Time Heated</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Colour Observed</th>
                <th className="border border-slate-400 px-2 py-1 text-left">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {log.map((entry) => (
                <tr key={entry.id}>
                  <td className="border border-slate-400 px-2 py-1">{entry.sampleName}</td>
                  <td className="border border-slate-400 px-2 py-1">{TEST_META[entry.testId].title}</td>
                  <td className="border border-slate-400 px-2 py-1">{entry.reagentName}</td>
                  <td className="border border-slate-400 px-2 py-1">
                    {entry.testId === "sugar" ? `${entry.heatSeconds.toFixed(0)} s` : "—"}
                  </td>
                  <td className="border border-slate-400 px-2 py-1">{entry.colorLabel}</td>
                  <td className="border border-slate-400 px-2 py-1">
                    {entry.verdict ? "Positive" : "Negative"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-1 italic text-slate-500">
            No trials have been recorded yet. Run at least one test, then reopen this paper to
            record results.
          </p>
        )}

        <h2 className="mt-6 text-base font-bold uppercase">Sources of Error &amp; Precautions</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Using different amounts of food sample between trials can make colour intensity harder to compare fairly.</li>
          <li>Insufficient heating time in the reducing sugars test can make a weak positive appear negative.</li>
          <li>Reagents must be shaken or mixed thoroughly, particularly for the Biuret test, or a positive result may be missed.</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Conclusion</h2>
        <p className="mt-1">
          {log.length > 0
            ? `Testing was carried out for ${testsUsed
                .map((id) => TEST_META[id].title.replace(" Test", "").toLowerCase())
                .join(", ")}. Of the samples tested, ${
                log.filter((entry) => entry.verdict).length
              } out of ${log.length} trials gave a positive result, indicating the presence of the nutrient being tested for in those foods.`
            : "The aim will be addressed once trials have been run and recorded."}
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

type Stage = "menu" | "sample" | "lab";

interface FoodSubstanceTestsSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

export default function FoodSubstanceTestsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: FoodSubstanceTestsSimProps) {
  const [entryMode, setEntryMode] = useState<"see" | "learn" | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [runRevision, setRunRevision] = useState(0);
  const [stage, setStage] = useState<Stage>("menu");
  const [labLoaderVisible, setLabLoaderVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestId | null>(null);
  const [selectedSample, setSelectedSample] = useState<FoodSample | null>(null);

  // Procedure state
  const [reagentAdded, setReagentAdded] = useState(false);
  const [heating, setHeating] = useState(false);
  const [heatSeconds, setHeatSeconds] = useState(0);
  const [tubeInBath, setTubeInBath] = useState(false);
  const [bathReady, setBathReady] = useState(false);
  const [mixed, setMixed] = useState(false);
  const [waterAdded, setWaterAdded] = useState(false);
  const [observed, setObserved] = useState(false);
  const [showResultSubtitle, setShowResultSubtitle] = useState(false);
  const [transferStage, setTransferStage] = useState<ReagentTransferStage>("idle");
  const [reactionSettled, setReactionSettled] = useState(true);
  const [dropTrigger, setDropTrigger] = useState(0);
  const [reagentImpactKey, setReagentImpactKey] = useState(0);
  const [waterPourTrigger, setWaterPourTrigger] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const reactionTimerRef = useRef<number | null>(null);
  const waterContactTimerRef = useRef<number | null>(null);
  const bathMoveTimerRef = useRef<number | null>(null);
  const burnerAudioRef = useRef<HTMLAudioElement | null>(null);
  const transferTimersRef = useRef<number[]>([]);

  const [resultsLog, setResultsLog] = useState<ResultLogEntry[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(
    () => () => {
      if (reactionTimerRef.current !== null) window.clearTimeout(reactionTimerRef.current);
      if (waterContactTimerRef.current !== null) window.clearTimeout(waterContactTimerRef.current);
      if (bathMoveTimerRef.current !== null) window.clearTimeout(bathMoveTimerRef.current);
      transferTimersRef.current.forEach((timer) => window.clearTimeout(timer));
      burnerAudioRef.current?.pause();
    },
    [],
  );

  const scheduleReactionSettle = useCallback((durationMs: number) => {
    if (reactionTimerRef.current !== null) window.clearTimeout(reactionTimerRef.current);
    setReactionSettled(false);
    reactionTimerRef.current = window.setTimeout(() => {
      setReactionSettled(true);
      reactionTimerRef.current = null;
    }, durationMs);
  }, []);

  // One complete Benedict's observation cycle lasts 30 seconds.
  useEffect(() => {
    if (!heating) return;
    const interval = window.setInterval(() => {
      setHeatSeconds((seconds) => Math.min(30, seconds + 0.2));
    }, 200);
    return () => window.clearInterval(interval);
  }, [heating]);

  useEffect(() => {
    if (heating && heatSeconds >= 30) setHeating(false);
  }, [heatSeconds, heating]);

  useEffect(() => {
    if (!burnerAudioRef.current) {
      burnerAudioRef.current = new Audio("/sounds/burner.mp3");
      burnerAudioRef.current.loop = true;
      burnerAudioRef.current.volume = 0.28;
    }
    const audio = burnerAudioRef.current;
    if (heating) {
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [heating]);

  const heatProgress = Math.min(1, heatSeconds / 30);

  const currentResult: TestResult | null = useMemo(() => {
    if (!selectedTest || !selectedSample || !reagentAdded) return null;
    switch (selectedTest) {
      case "starch":
        return getStarchResult(selectedSample);
      case "sugar":
        return getSugarResult(selectedSample, heatProgress);
      case "protein":
        return getProteinResult(selectedSample, mixed);
      case "fat":
        return getFatResult(selectedSample, waterAdded);
      default:
        return null;
    }
  }, [selectedTest, selectedSample, reagentAdded, heatProgress, mixed, waterAdded]);

  const liquidColorHex = currentResult?.colorHex ?? (selectedTest ? reagentForTest(selectedTest).color : "#e2e8f0");
  const liquidLevel = reagentAdded ? 1 : 0;
  const cloudLevel = currentResult?.cloudLevel ?? 0;
  const precipitate = currentResult?.precipitate ?? false;
  const reactionMessage = useMemo(() => {
    if (!selectedTest || !selectedSample) return "choose a food sample, then add the correct reagent.";
    const reagentName = TEST_META[selectedTest].reagentName;
    if (transferStage === "uncapping") return `The ${reagentName} cap is being unscrewed, lifted clear, and placed upright on the bench.`;
    if (transferStage === "lifting") return "The clean pipette is lifting from its tray and turning upright.";
    if (transferStage === "approaching") return `The pipette is lowering carefully through the open neck of the ${reagentName} bottle.`;
    if (transferStage === "drawing") return `${reagentName} is rising naturally into the pipette barrel.`;
    if (transferStage === "moving") return `The filled pipette is moving above the test tube.`;
    if (transferStage === "dispensing") return `The ${reagentName} is being released drop by drop into the sample.`;
    if (transferStage === "returning") return "The pipette is lifting clear and returning gently to its tray.";
    if (transferStage === "recapping") return `The ${reagentName} cap is being retrieved and screwed securely back onto the bottle.`;
    if (!reagentAdded) return `${selectedSample.name} is in the test tube. Add ${TEST_META[selectedTest].reagentName}.`;
    if (!reactionSettled) {
      if (selectedTest === "starch") return "The iodine is spreading through the sample; the colour is developing gradually.";
      if (selectedTest === "protein" && mixed) return "Gentle shaking is dispersing the Biuret reagent; the new colour is developing.";
      if (selectedTest === "fat" && waterAdded) return "Fine fat droplets are dispersing in water and the emulsion is becoming cloudy.";
      if (selectedTest === "fat") return "The ethanol mixture is pouring into the water; cloudiness will form after contact.";
      return `The ${reagentName} is mixing through the sample. Watch the colour become even.`;
    }
    if (selectedTest === "starch") {
      return currentResult?.positive
        ? `The orange-brown iodine has changed evenly to ${currentResult.colorLabel.toLowerCase()}.`
        : "The iodine remains orange-brown, so no starch colour change is visible.";
    }
    if (selectedTest === "sugar" && !tubeInBath) {
      return "Benedict's solution is evenly mixed and blue. Move the clamped tube safely into the water bath.";
    }
    if (selectedTest === "sugar" && !bathReady) {
      return "The clamp has released the tube; it is being lifted, carried across, and lowered into the beaker of water.";
    }
    if (selectedTest === "sugar" && heatSeconds < 0.1 && !heating) {
      return "The test tube is immersed in the water bath, but the burner is off. Use the burner helper to light it.";
    }
    if (selectedTest === "sugar" && heating) {
      if (heatProgress < 0.16) return "The blue flame is heating the beaker base. The water is mostly still and the solution remains blue.";
      if (heatProgress < 0.46) return "Warm water is rising and cooler water is sinking; visible convection currents are carrying heat to the tube.";
      if (heatProgress < 0.76) {
        return currentResult?.positive
          ? `Fine bubbles are increasing while the solution changes gradually towards ${currentResult.colorLabel.toLowerCase()}.`
          : "Fine bubbles are increasing, but the Benedict's solution is staying blue.";
      }
      return currentResult?.positive
        ? `Steam is rising and brick-red particles are forming and settling as the final colour develops.`
        : "The water is hot and steaming, but the solution still remains blue.";
    }
    if (selectedTest === "sugar" && heatProgress >= 1) {
      return `Heating stopped automatically after 30 seconds. The final mixture is ${currentResult?.colorLabel.toLowerCase()}.`;
    }
    if (selectedTest === "sugar") return "The water bath is ready for the 30-second heating cycle.";
    if (selectedTest === "protein" && !mixed) return "Biuret reagent is evenly added. Shake gently so it can react throughout the sample.";
    if (selectedTest === "protein") return `After mixing, the solution is evenly ${currentResult?.colorLabel.toLowerCase()}.`;
    if (selectedTest === "fat" && !waterAdded) return "The sample has dissolved in ethanol. Pour the mixture into water to test for fat.";
    if (selectedTest === "fat") return `The mixture now shows ${currentResult?.colorLabel.toLowerCase()}.`;
    return "The reaction has reached a stable result.";
  }, [bathReady, currentResult, heatProgress, heatSeconds, heating, reagentAdded, reactionSettled, selectedSample, selectedTest, mixed, transferStage, tubeInBath, waterAdded]);

  const resetTube = useCallback(() => {
    setDemoActive(false);
    setRunRevision(value => value + 1);
    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
      reactionTimerRef.current = null;
    }
    if (waterContactTimerRef.current !== null) {
      window.clearTimeout(waterContactTimerRef.current);
      waterContactTimerRef.current = null;
    }
    if (bathMoveTimerRef.current !== null) {
      window.clearTimeout(bathMoveTimerRef.current);
      bathMoveTimerRef.current = null;
    }
    transferTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transferTimersRef.current = [];
    setReagentAdded(false);
    setHeating(false);
    setHeatSeconds(0);
    setTubeInBath(false);
    setBathReady(false);
    setMixed(false);
    setWaterAdded(false);
    setObserved(false);
    setShowResultSubtitle(false);
    setTransferStage("idle");
    setReactionSettled(true);
  }, []);

  const handlePickTest = (testId: TestId) => {
    setEntryMode(null);
    setSelectedTest(testId);
    setStage("sample");
  };

  const handlePickSample = (sample: FoodSample) => {
    setEntryMode(null);
    setMode("learning");
    setSelectedSample(sample);
    resetTube();
    setLabLoaderVisible(true);
    setStage("lab");
  };

  const handleAddReagent = () => {
    if (reagentAdded || transferStage !== "idle") return;
    transferTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transferTimersRef.current = [
      window.setTimeout(() => setTransferStage("lifting"), 1100),
      window.setTimeout(() => setTransferStage("approaching"), 1850),
      window.setTimeout(() => setTransferStage("drawing"), 2650),
      window.setTimeout(() => setTransferStage("moving"), 3850),
      window.setTimeout(() => setTransferStage("dispensing"), 4800),
      window.setTimeout(() => setTransferStage("returning"), 6100),
      window.setTimeout(() => setTransferStage("recapping"), 7300),
    ];
    setReactionSettled(false);
    setTransferStage("uncapping");
    setDropTrigger((k) => k + 1);
  };

  const handleReagentContact = useCallback(() => {
    setReagentAdded(true);
    setReagentImpactKey((key) => key + 1);
    scheduleReactionSettle(selectedTest === "starch" ? 3200 : 2200);
  }, [scheduleReactionSettle, selectedTest]);

  const handleTransferComplete = useCallback(() => {
    transferTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    transferTimersRef.current = [];
    setTransferStage("idle");
  }, []);

  const handleAddWater = () => {
    if (!reactionSettled || transferStage !== "idle") return;
    setReactionSettled(false);
    setWaterPourTrigger((k) => k + 1);
    if (waterContactTimerRef.current !== null) window.clearTimeout(waterContactTimerRef.current);
    waterContactTimerRef.current = window.setTimeout(() => {
      setWaterAdded(true);
      setShakeKey((k) => k + 1);
      scheduleReactionSettle(3000);
      waterContactTimerRef.current = null;
    }, 850);
  };

  const handleShake = () => {
    if (!reactionSettled || transferStage !== "idle") return;
    setMixed(true);
    setShakeKey((k) => k + 1);
    scheduleReactionSettle(3000);
  };

  const handleMoveTubeToBath = () => {
    if (!reagentAdded || !reactionSettled || transferStage !== "idle" || tubeInBath) return;
    setTubeInBath(true);
    setBathReady(false);
    if (bathMoveTimerRef.current !== null) window.clearTimeout(bathMoveTimerRef.current);
    bathMoveTimerRef.current = window.setTimeout(() => {
      setBathReady(true);
      bathMoveTimerRef.current = null;
    }, 3600);
  };

  const handleLightBurner = useCallback(() => {
    if (!bathReady || heating || heatSeconds >= 30) return;
    setHeating(true);
  }, [bathReady, heatSeconds, heating]);

  const handleRecord = () => {
    if (!selectedTest || !selectedSample || !currentResult) return;
    setObserved(true);
    setShowResultSubtitle(true);
    setHeating(false);
    const entry: ResultLogEntry = {
      id: `${selectedTest}-${selectedSample.id}-${Date.now()}`,
      testId: selectedTest,
      sampleName: selectedSample.name,
      reagentName: TEST_META[selectedTest].reagentName,
      colorLabel: currentResult.colorLabel,
      heatSeconds,
      verdict: currentResult.positive,
    };
    setResultsLog((log) => [...log, entry]);
  };

  const handleTestAnotherSample = () => {
    setEntryMode(null);
    setLabLoaderVisible(false);
    setStage("sample");
    resetTube();
  };

  const handleChangeTest = () => {
    setEntryMode(null);
    setLabLoaderVisible(false);
    setStage("menu");
    setSelectedTest(null);
    setSelectedSample(null);
    resetTube();
  };

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

  const meta = selectedTest ? TEST_META[selectedTest] : null;
  const transferInProgress = transferStage !== "idle";

  // Primary action button per test/step
  let primaryAction: { label: string; onClick: () => void; disabled?: boolean } | null = null;
  let secondaryAction: { label: string; onClick: () => void; disabled?: boolean } | null = null;

  if (selectedTest && !observed) {
    if (selectedTest === "starch") {
      primaryAction = reagentAdded
        ? null
        : {
            label: transferInProgress ? "Transferring Iodine..." : "Add Iodine",
            onClick: handleAddReagent,
            disabled: transferInProgress,
          };
    } else if (selectedTest === "sugar") {
      if (!reagentAdded) {
        primaryAction = {
          label: transferInProgress ? "Drawing Benedict's Solution..." : "Add Benedict's Solution",
          onClick: handleAddReagent,
          disabled: transferInProgress,
        };
      } else if (!reactionSettled || transferInProgress) {
        primaryAction = {
          label: transferInProgress ? "Finishing Reagent Transfer..." : "Reaction Developing...",
          onClick: handleMoveTubeToBath,
          disabled: true,
        };
      } else if (!tubeInBath) {
        primaryAction = {
          label: "Move Test Tube To Water Bath",
          onClick: handleMoveTubeToBath,
        };
      } else if (!bathReady) {
        primaryAction = {
          label: "Moving Tube To Water Bath...",
          onClick: handleMoveTubeToBath,
          disabled: true,
        };
      } else if (heatProgress < 1) {
        primaryAction = {
          label: heating ? `Heating... ${Math.max(0, Math.ceil(30 - heatSeconds))}s` : "Light Burner",
          onClick: handleLightBurner,
          disabled: heating,
        };
      }
    } else if (selectedTest === "protein") {
      if (!reagentAdded) {
        primaryAction = {
          label: transferInProgress ? "Drawing Biuret Reagent..." : "Add Biuret Reagent",
          onClick: handleAddReagent,
          disabled: transferInProgress,
        };
      } else if (!mixed) {
        primaryAction = {
          label: !reactionSettled ? "Reagent Dispersing..." : "Shake To Mix",
          onClick: handleShake,
          disabled: transferInProgress || !reactionSettled,
        };
      }
    } else if (selectedTest === "fat") {
      if (!reagentAdded) {
        primaryAction = {
          label: transferInProgress ? "Drawing Ethanol..." : "Dissolve In Ethanol",
          onClick: handleAddReagent,
          disabled: transferInProgress,
        };
      } else if (!waterAdded) {
        primaryAction = {
          label: !reactionSettled ? "Pouring Into Water..." : "Pour Into Water",
          onClick: handleAddWater,
          disabled: transferInProgress || !reactionSettled,
        };
      }
    }

    const canRecord =
      reagentAdded &&
      reactionSettled &&
      !transferInProgress &&
      (selectedTest !== "sugar" || (heatSeconds >= 30 && !heating)) &&
      (selectedTest !== "protein" || mixed) &&
      (selectedTest !== "fat" || waterAdded);
    secondaryAction = { label: "Record Observation", onClick: handleRecord, disabled: !canRecord };
  }

  const demoActionRef = useRef<(() => void) | null>(null);
  demoActionRef.current = primaryAction && !primaryAction.disabled
    ? primaryAction.onClick : !primaryAction && secondaryAction && !secondaryAction.disabled
      ? secondaryAction.onClick : null;
  useEffect(() => {
    if (!demoActive || stage !== "lab" || labLoaderVisible || entryMode === null) return;
    if (observed) { setDemoActive(false); return; }
    if (!demoActionRef.current) return;
    const timer = window.setTimeout(() => demoActionRef.current?.(), 1000);
    return () => window.clearTimeout(timer);
  }, [demoActive, stage, labLoaderVisible, entryMode, observed, primaryAction?.label,
    primaryAction?.disabled, secondaryAction?.disabled, transferStage, reactionSettled]);

  const startDemo = () => {
    if (!selectedTest || !selectedSample) return;
    resetTube();
    setMode("learning");
    setShowTutorial(false);
    setEntryMode("see");
    setDemoActive(true);
  };
  const handleModeChange = (next: "learning" | "doing") => {
    if (!demoActive && entryMode !== null) setMode(next);
  };

  // Doing Mode's world-space stations: whatever primaryAction/secondaryAction
  // currently is (the exact same guided-button logic above), just reached by
  // walking up to the relevant reagent bottle / water bath / tube instead of
  // tapping a panel button — no second source of truth.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing" || !selectedTest) return [];
    const list: Interactable[] = [];

    if (primaryAction) {
      const isBathOrBurner = primaryAction.onClick === handleMoveTubeToBath || primaryAction.onClick === handleLightBurner;
      const position = isBathOrBurner
        ? WATER_BATH_POS
        : primaryAction.onClick === handleAddReagent
          ? new THREE.Vector3(...reagentForTest(selectedTest).position)
          : TUBE_STATION_POS;
      list.push({
        id: "primary-action",
        position,
        radius: INTERACTION_RADIUS,
        label: primaryAction.label,
        disabled: primaryAction.disabled,
        onActivate: primaryAction.onClick,
      });
    }

    if (secondaryAction) {
      list.push({
        id: "secondary-action",
        position: TUBE_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: secondaryAction.label,
        disabled: secondaryAction.disabled,
        onActivate: secondaryAction.onClick,
      });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedTest, primaryAction, secondaryAction]);


  const testStepCount = selectedTest === "sugar" ? 4 : selectedTest === "starch" ? 2 : 3;
  const testStep = !reagentAdded || transferInProgress ? 1
    : selectedTest === "sugar" ? (!tubeInBath || !bathReady ? 2 : heatProgress < 1 ? 3 : 4)
    : selectedTest === "protein" ? (!mixed ? 2 : 3)
    : selectedTest === "fat" ? (!waterAdded ? 2 : 3) : 2;
  const transferFraction = ({ idle: 0, uncapping: .08, lifting: .2, approaching: .3, drawing: .45, moving: .6, dispensing: .75, returning: .88, recapping: .96 })[transferStage];
  const stepFraction = testStep === 1 ? transferFraction
    : selectedTest === "sugar" && testStep === 3 ? heatProgress
    : secondaryAction && !secondaryAction.disabled ? .85 : 0;
  const testProgress = observed ? 100 : Math.round((testStep - 1 + stepFraction) / testStepCount * 100);
  const stepTitle = observed ? "Your result"
    : testStep === 1 ? `Add ${selectedTest === "starch" ? "iodine" : selectedTest === "sugar" ? "Benedict’s solution" : selectedTest === "protein" ? "Biuret reagent" : "ethanol"}`
    : selectedTest === "sugar" && testStep === 2 ? "Move the tube into water"
    : selectedTest === "sugar" && testStep === 3 ? "Heat the sample"
    : selectedTest === "protein" && testStep === 2 ? "Mix the sample"
    : selectedTest === "fat" && testStep === 2 ? "Pour into water"
    : "Look at the result";
  const nutrient = selectedTest === "sugar" ? "reducing sugar" : selectedTest === "protein" ? "protein" : selectedTest === "fat" ? "fat" : "starch";
  const stepSummary = observed ? currentResult?.positive
    ? `This test found ${nutrient} in ${selectedSample?.name.toLowerCase()}.`
    : `This test did not find ${nutrient} in ${selectedSample?.name.toLowerCase()}.`
    : testStep === 1 ? `The sample is ready. Add ${meta?.reagentName.toLowerCase()} to start the test.`
    : selectedTest === "sugar" && testStep === 2 ? "Place the tube in the water bath. The water will heat the sample gently."
    : selectedTest === "sugar" && testStep === 3 ? "Light the burner. Watch the colour while the sample heats for 30 seconds."
    : selectedTest === "protein" && testStep === 2 ? "Gently shake the tube to mix the sample with the reagent."
    : selectedTest === "fat" && testStep === 2 ? "Pour the mixture into water. A cloudy white mixture shows that fat is present."
    : "Look at the final colour. Select Next to record what you see.";
  const nextAction = primaryAction ?? secondaryAction;
  const nextDisabled = demoActive || !nextAction || !!nextAction.disabled || transferInProgress || !reactionSettled;
  const stepInstruction = transferInProgress ? "Adding the reagent. Please wait."
    : heating ? `Heating: ${Math.max(0, Math.ceil(30 - heatSeconds))} seconds left.`
    : !reactionSettled ? "Wait for the colour to settle."
    : tubeInBath && !bathReady ? "Moving the tube. Please wait."
    : demoActive ? "Watch this step. The demonstration will continue automatically." : "";
  const displayStep = observed ? testStepCount + 1 : testStep;
  const resultColour = selectedTest === "fat"
    ? currentResult?.positive ? "a cloudy white mixture" : "a clear mixture"
    : currentResult?.colorLabel.replace(/\s*\([^)]*\)/g, "").replace("Purple / violet", "purple").replace("Brick-red precipitate", "brick-red").toLowerCase();



return (<ExperimentLabelProvider>
    <div className={`relative flex h-full w-full flex-col overflow-hidden bg-slate-950 sm:flex-row food-tests-design ${isMobileViewport ? "food-tests-design--mobile" : ""}`}>
      <MobileExperimentTopBar
        demoActive={demoActive}
        onDemo={() => { if (demoActive) { setDemoActive(false); setHeating(false); } else startDemo(); }}
        onBack={onBack}
        onRequestHowTo={onRequestHowTo}
        onRequestPaper={onRequestPaper}
        mode={stage === "lab" && !labLoaderVisible ? mode : undefined}
        onModeChange={stage === "lab" && !labLoaderVisible ? handleModeChange : undefined}
        contextLabel={stage === "menu" ? "Choose test" : stage === "sample" ? "Choose sample" : "Loading lab"}
      />

      {stage === "lab" && labLoaderVisible && (
        <ExperimentSceneLoader
          label={`Preparing ${selectedSample?.name ?? "food"} test`}
          onComplete={() => setLabLoaderVisible(false)}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* Stage: Test menu                                               */}
      {/* ------------------------------------------------------------- */}
      {stage === "menu" && (
        <div
          data-experiment-tour="test-menu"
          className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-950 to-slate-900 px-6 pb-6 pt-16 sm:p-6"
        >
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-100">Food tests</h1>
            <p className="mt-1 text-sm text-slate-400">Choose a nutrient test to begin</p>
          </div>
          <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {(Object.keys(TEST_META) as TestId[]).map((id) => {
              const m = TEST_META[id];
              return (
                <button
                  key={id}
                  onClick={() => handlePickTest(id)}
                  className="group flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/[0.07]"
                >
                  <span className="text-3xl">{m.icon}</span>
                  <span className="text-lg font-black text-slate-100">{m.title}</span>
                  <span className="text-xs font-medium text-slate-400">Reagent: {m.reagentName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Stage: Sample menu                                             */}
      {/* ------------------------------------------------------------- */}
      {stage === "sample" && meta && (
        <div
          data-experiment-tour="sample-menu"
          className="flex h-full w-full flex-col items-center gap-5 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900 px-6 pb-6 pt-16 sm:p-6"
        >
          <div className="w-full max-w-3xl">
            <button
              onClick={handleChangeTest}
              className="mb-2 text-xs font-bold text-slate-400 hover:text-orange-200"
            >
              ← Back to tests
            </button>
            <div className="text-center">
              <h1 className="text-xl font-black text-slate-100">{meta.title}</h1>
              <p className="mt-1 text-sm text-slate-400">Pick a food sample to test</p>
            </div>
          </div>
          <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {FOOD_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handlePickSample(sample)}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/40 hover:bg-white/[0.07]"
              >
                <span className="text-3xl">{sample.emoji}</span>
                <span className="text-center text-xs font-bold text-slate-200">{sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Stage: Lab bench                                               */}
      {/* ------------------------------------------------------------- */}
      {stage === "lab" && !labLoaderVisible && meta && selectedSample && (
        <>
          <div inert={entryMode === null} className="relative min-h-0 flex-1">
            <Canvas
              shadows
              dpr={[1, 1.5]}
              camera={{ position: [3.4, 2.6, 6.4], fov: 50, far: 80 }}
              className="h-full w-full"
            >
              <Scene
                key={runRevision}
                demoActive={demoActive}
                test={meta.id}
                sample={selectedSample}
                liquidColorHex={liquidColorHex}
                reactionMessage={reactionMessage}
                liquidLevel={liquidLevel}
                cloudLevel={cloudLevel}
                precipitate={precipitate}
                shakeKey={shakeKey}
                reagentImpactKey={reagentImpactKey}
                dropTrigger={dropTrigger}
                waterPourTrigger={waterPourTrigger}
                heating={heating}
                heatProgress={heatProgress}
                tubeInBath={tubeInBath}
                bathReady={bathReady}
                transferStage={transferStage}
                reactionSettled={reactionSettled}
                onTransferStageChange={setTransferStage}
                onReagentContact={handleReagentContact}
                onTransferComplete={handleTransferComplete}
                onLightBurner={demoActive || entryMode === null ? () => undefined : handleLightBurner}
                mode={mode}
                isMobile={isMobileViewport}
                interactables={interactables}
                activeTargetId={activeInteractableMeta?.id ?? null}
                moveVectorRef={moveVectorRef}
                onTargetChange={handleTargetChange}
              />
        </Canvas>

            {observed && currentResult && showResultSubtitle && (
              <div className="food-result-subtitle">
                <button type="button" className="food-result-subtitle__close" aria-label="Close result subtitle" onClick={() => setShowResultSubtitle(false)}>×</button>
                <div role="status" aria-live="polite" aria-atomic="true">
                  <p>Our result came out as {resultColour}.</p>
                  <span>{currentResult.positive
                    ? `This means ${selectedSample.name.toLowerCase()} contains ${nutrient}.`
                    : `This test did not find ${nutrient} in ${selectedSample.name.toLowerCase()}.`}</span>
                </div>
              </div>
            )}

            <HeaderModeToggle demoActive={demoActive} onDemo={() => { if (demoActive) { setDemoActive(false); setHeating(false); } else startDemo(); }} disabled={demoActive || entryMode === null} />



            <div className="absolute left-2 top-2 z-10 flex items-center gap-2 sm:hidden">
              <button
                onClick={handleChangeTest}
                className="rounded-lg border border-white/15 bg-slate-900/80 px-2 py-1 text-[11px] font-bold text-slate-200"
              >
                ← Tests
              </button>
              <button
                onClick={handleTestAnotherSample}
                className="rounded-lg border border-white/15 bg-slate-900/80 px-2 py-1 text-[11px] font-bold text-slate-200"
              >
                Change sample
              </button>
            </div>

            <div className="absolute inset-x-2 top-10 z-10 flex items-center justify-between gap-2 sm:hidden">
              <div className="rounded-lg border border-white/10 bg-slate-900/85 px-3 py-1.5 text-[11px] font-bold text-slate-100">
                {selectedSample.emoji} {selectedSample.name}
              </div>
              {selectedTest === "sugar" && (
                <div className="rounded-lg border border-white/10 bg-slate-900/85 px-3 py-1.5 text-[11px] font-bold text-orange-200">
                  {heatSeconds.toFixed(0)}s
                </div>
              )}
            </div>
          </div>

          <section inert={entryMode === null} data-experiment-tour="lab-controls" aria-label="Food test guide"
            className={`food-guide ${mode === "learning" ? "food-guide--visible" : ""}`}>
            <header className="food-guide__header">
              <strong>Experiment guide</strong>
              <button type="button" onClick={resetTube}>Start again</button>
            </header>
            <div className="food-guide__progress">
              <div><span>Step {displayStep} of {testStepCount + 1}</span><span>{testProgress}%</span></div>
              <progress aria-label="Food test progress" value={testProgress} max={100} />
            </div>
            <div className="food-guide__step" aria-live="polite">
              <p className="food-guide__eyebrow">{selectedSample.name} · {meta.title}</p>
              <h2>{stepTitle}</h2>
              <p>{stepSummary}</p>
              {stepInstruction && <p className="food-guide__status">{stepInstruction}</p>}
              {currentResult && <div className="food-guide__observation">
                <span className="food-tests-controls__swatch" style={{ backgroundColor: reactionSettled ? currentResult.colorHex : reagentForTest(meta.id).color }} />
                <span>{reactionSettled ? currentResult.colorLabel : "Colour changing…"}</span>
              </div>}
            </div>
            <footer className="food-guide__actions">
              <button type="button" data-experiment-tour={observed ? undefined : primaryAction ? "action-primary" : "action-record"}
                onClick={observed ? handleTestAnotherSample : () => { if (!nextDisabled) nextAction?.onClick(); }}
                disabled={!observed && nextDisabled} className="food-guide__next">
                {observed ? "Try another sample" : demoActive ? "Showing this step…" : nextDisabled ? "Please wait…" : "Next"}
              </button>
              <button type="button" className="food-guide__demo" onClick={demoActive ? () => { setDemoActive(false); setHeating(false); } : startDemo}>
                {demoActive ? "Stop demonstration" : observed ? "Replay demonstration" : "Watch demonstration"}
              </button>
              {observed && !showResultSubtitle && <button type="button" className="food-guide__demo" onClick={() => setShowResultSubtitle(true)}>Show result</button>}
              <div className="food-guide__change">
                <button type="button" onClick={handleChangeTest}>Change test</button>
                <button type="button" onClick={handleTestAnotherSample}>Change sample</button>
              </div>
            </footer>
            {observed && <details data-experiment-tour="results-log" className="food-tests-controls__log">
              <summary>Previous results ({resultsLog.length})</summary>
              <div>{resultsLog.slice(-6).reverse().map(entry => <div key={entry.id} className="food-tests-controls__log-row">
                <span>{entry.sampleName} · {TEST_META[entry.testId].title}</span><strong>{entry.verdict ? "Positive" : "Negative"}</strong>
              </div>)}</div>
            </details>}
          </section>


        </>
      )}

      {stage === "lab" && !labLoaderVisible && selectedTest && selectedSample && entryMode === null && (
        <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/15 p-5 backdrop-blur-[7px]">
          <div role="dialog" aria-modal="true" aria-labelledby="food-mode-title" className="w-full max-w-[360px] rounded-2xl border border-white/80 bg-white p-5 text-center text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,.28)] sm:p-6">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><FlaskConical size={20} aria-hidden="true" /></div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">{TEST_META[selectedTest].title}</p>
            <h2 id="food-mode-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Select mode</h2>
            <p className="mt-2 text-sm text-slate-500">Sample: {selectedSample.name}</p>
            <div className="mt-5 space-y-2.5">
              <button autoFocus type="button" onClick={startDemo} className="flex w-full items-center justify-between rounded-xl bg-cyan-500 px-4 py-3 text-left text-white transition hover:bg-cyan-600 focus-visible:ring-4 focus-visible:ring-cyan-200">
                <span className="text-sm font-bold">See</span><Play size={17} fill="currentColor" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => { setEntryMode("learn"); setMode("learning"); }} className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-emerald-950 transition hover:bg-emerald-100 focus-visible:ring-4 focus-visible:ring-emerald-100">
                <span className="text-sm font-bold">Learn</span><Lightbulb size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaper && <FoodTestPaper log={resultsLog} onClose={onClosePaper} />}

      {showTutorial && !labLoaderVisible && !(stage === "lab" && entryMode === null) && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? foodTestHowToSteps : foodTestTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  </ExperimentLabelProvider>);
}
