"use client";

import { BlenderLabEnvironment, BlenderLabBench, blenderLabObstacles } from "../../common/BlenderLabEnvironment";

import type { MutableRefObject } from "react";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
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
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import { VirtualJoystick } from "../../common/VirtualJoystick";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";


const BLENDER_LAB_LAYOUT = { width: 28, depth: 20, height: 9.25, floorY: -1.25, centerZ: 5.3, worktopY: -0.5475 };
// ---------------------------------------------------------------------------
// Constants & shared types
// ---------------------------------------------------------------------------

const WATER_DENSITY = 1.0; // g/cm3 (= g/mL)
const CYL_AREA_CM2 = 12; // cross-sectional area of the main measuring cylinder
const CATCH_AREA_CM2 = 8; // cross-sectional area of the eureka-can catch cylinder
const BASE_LEVEL_CM = 5; // starting water height in the main cylinder
const EUREKA_LEVEL_CM = 13.2; // fixed water line at the overflow spout
const WAVE_POINTS = 34;
const WAVE_SPEED2 = 7.8; // v^2 in the wave equation
const WAVE_DAMP = 18; // beta
const DENSITY_TRANSFER_DURATION_MS = 2300;
const DISPLACEMENT_START_MS = 1640;

type TransferOrigin = "balance" | "tray";

// Doing Mode: world-space stations, roughly matching where the balance,
// vessel and specimen tray sit inside DensityScene3D's bench group. The
// player free-roams the room and presses/holds the context button at each
// station to trigger the exact same handlers the drag-and-drop path uses.
const TRAY_STATION_POS = new THREE.Vector3(4.05, -0.4, 0.42);
const BALANCE_STATION_POS = new THREE.Vector3(-2.45, -0.4, 0.35);
const VESSEL_STATION_POS = new THREE.Vector3(1.3, -0.4, 0.17);
const PLAYER_BOUNDS: PlayerBounds = { minX: -13, maxX: 13, minZ: -4, maxZ: 12.5 };
const BENCH_OBSTACLES: PlayerBounds[] = [{ minX: -5.4, maxX: 5.7, minZ: -2.1, maxZ: 2.8 }, ...blenderLabObstacles(BLENDER_LAB_LAYOUT)];
const PLAYER_SPAWN = new THREE.Vector3(0, 0, 7.2);
const INTERACTION_RADIUS = 3.6;

type SolidKind = "regular-cylinder" | "regular-cuboid" | "irregular-rock" | "custom";
type Location = "palette" | "balance" | "cylinder" | "removed";

interface SolidDef {
  id: string;
  name: string;
  kind: SolidKind;
  color: string;
  massG: number;
  volumeCm3: number; // ground truth, drives the physics — this is what the student is measuring
  polygon?: { x: number; y: number }[]; // normalized -1..1 cross-section, for rock/custom rendering
}

interface Reading {
  solidName: string;
  massG: number;
  measuredVolumeCm3: number;
  measuredDensity: number;
  trueDensity: number;
}

const densityTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Level Start: Density",
    text: "You are determining density by measuring mass and volume, then calculating density as mass divided by volume.",
    mode: "modal",
  },
  {
    title: "How It Works",
    text: "Drag a dry solid to the balance, then lower it completely into the water with the immersion cradle. The water rise or collected overflow equals its volume.",
    mode: "modal",
  },
  {
    title: "Recording Your Paper",
    text: "Record each settled trial. The Paper report uses your mass, volume, and density readings to build the practical results.",
    mode: "modal",
  },
  {
    title: "Measurement HUD",
    text: "This readout shows the current mass, displaced volume, and calculated density.",
    mode: "bubble",
    selector: '[data-experiment-tour="density-hud"]',
  },
  {
    title: "Apparatus Zone",
    text: "Use the digital balance, retort stand, immersion cradle, and measuring cylinder together. Read the bottom of the meniscus only after the water settles.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="density-scene"]',
    sceneBox: { x: 0.08, y: 0.18, w: 0.84, h: 0.55 },
  },
  {
    title: "Game Controls",
    text: "Open Solids to choose objects, toggle Eureka mode if needed, record readings, and clear or empty the apparatus.",
    mode: "bubble",
    selector: '[data-experiment-tour="density-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Paper Button",
    text: "Open Paper after recording trials to generate the density practical report.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

const densityHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Density",
    text: "Follow this sample run. Choose a solid, measure it, record the reading, then download the practical paper.",
    mode: "modal",
  },
  {
    title: "Step 1: Choose A Solid",
    text: "Tap Solids on mobile or choose a solid from the desktop panel. This is the object you will measure.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="solids"], [data-experiment-tour="density-solids"]',
    actionSelector: '[data-mobile-experiment-action="solids"], [data-experiment-tour="density-solids"]',
    actionLabel: "Tap Solids",
  },
  {
    title: "Step 2: Use The Apparatus",
    text: "Drag the solid to the balance for its dry mass, then into the vessel. The cradle fully immerses even the wood block so its complete volume is displaced.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="density-scene"]',
    sceneBox: { x: 0.08, y: 0.18, w: 0.84, h: 0.55 },
  },
  {
    title: "Step 3: Record Reading",
    text: "After measuring mass and volume, tap Record to save the density reading.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="record"], [data-experiment-tour="density-record"]',
    actionSelector: '[data-mobile-experiment-action="record"], [data-experiment-tour="density-record"]',
    actionLabel: "Tap Record",
  },
  {
    title: "Step 4: Open Paper",
    text: "Tap Paper to open the density practical report.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
    actionSelector: '[data-experiment-tour="paper"] button',
    actionLabel: "Tap Paper",
  },
  {
    title: "Step 5: Download Paper",
    text: "Tap Download to save the generated density paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper-download"]',
    actionSelector: '[data-experiment-tour="paper-download"]',
    actionLabel: "Tap Download",
  },
  {
    title: "Congratulations",
    text: "You now know how to run the Density experiment, measure mass and volume, record density, and download the paper.",
    mode: "modal",
  },
];

const MATERIAL_LIBRARY = [
  { name: "Copper", density: 8.96 },
  { name: "Aluminium", density: 2.7 },
  { name: "Granite", density: 2.65 },
  { name: "Oak wood", density: 0.6 },
  { name: "Iron", density: 7.87 },
];

function closestMaterial(density: number) {
  let best = MATERIAL_LIBRARY[0];
  let bestDiff = Infinity;
  for (const m of MATERIAL_LIBRARY) {
    const diff = Math.abs(m.density - density);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = m;
    }
  }
  return best;
}

// Procedural jagged rock outline — a circle perturbed with pseudo-random
// per-vertex noise, regenerated with a fresh seed each time.
function proceduralRockPolygon(seed: number, points = 12) {
  const poly: { x: number; y: number }[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 16807) % 2147483647;
    return (s / 2147483647) % 1;
  };
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const r = 0.62 + rand() * 0.38;
    poly.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return poly;
}

function shoelaceArea(points: { x: number; y: number }[]) {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

function polygonToSvgPoints(points: { x: number; y: number }[], cx: number, cy: number, scale: number) {
  return points.map((p) => `${cx + p.x * scale},${cy + p.y * scale}`).join(" ");
}

// ---------------------------------------------------------------------------
// 1D Eulerian water-surface wave (finite differences)
// ---------------------------------------------------------------------------

function useWaveSurface() {
  const heightsRef = useRef(new Array(WAVE_POINTS).fill(0));
  const velRef = useRef(new Array(WAVE_POINTS).fill(0));
  const [, force] = useState(0);

  const step = useCallback((dt: number) => {
    const h = heightsRef.current;
    const v = velRef.current;
    const next = h.slice();
    for (let i = 1; i < WAVE_POINTS - 1; i++) {
      const laplacian = h[i - 1] + h[i + 1] - 2 * h[i];
      const accel = WAVE_SPEED2 * laplacian * WAVE_POINTS * WAVE_POINTS * 0.0009 - WAVE_DAMP * v[i];
      v[i] += accel * dt;
      next[i] = h[i] + v[i] * dt;
      if (Math.abs(next[i]) < 0.015 && Math.abs(v[i]) < 0.025) {
        next[i] = 0;
        v[i] = 0;
      }
    }
    next[0] = next[1] * 0.6;
    next[WAVE_POINTS - 1] = next[WAVE_POINTS - 2] * 0.6;
    heightsRef.current = next;
  }, []);

  const perturb = useCallback((strength: number, atIndex?: number) => {
    const idx = atIndex ?? Math.floor(WAVE_POINTS / 2);
    const h = heightsRef.current.slice();
    for (let d = -3; d <= 3; d++) {
      const i = idx + d;
      if (i > 0 && i < WAVE_POINTS - 1) {
        h[i] -= strength * (1 - Math.abs(d) / 4);
      }
    }
    heightsRef.current = h;
  }, []);

  const settled = useMemo(() => {
    return heightsRef.current.every((y) => Math.abs(y) < 0.02) && velRef.current.every((v) => Math.abs(v) < 0.02);
  }, [heightsRef.current]);

  return { heightsRef, step, perturb, forceRender: () => force((t) => (t + 1) % 100000), settled };
}

// ---------------------------------------------------------------------------
// Draggable solid chip (renders differently per kind)
// ---------------------------------------------------------------------------

function SolidGlyph({ solid, wetOpacity }: { solid: SolidDef; wetOpacity: number }) {
  const size = 64;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-lg">
      <defs>
        <linearGradient id={`${solid.id}-metal`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="38%" stopColor={solid.color} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${solid.id}-rock`} cx="34%" cy="24%" r="76%">
          <stop offset="0%" stopColor="#d6d3d1" stopOpacity="0.7" />
          <stop offset="45%" stopColor={solid.color} stopOpacity="1" />
          <stop offset="100%" stopColor="#292524" stopOpacity="0.8" />
        </radialGradient>
        <linearGradient id={`${solid.id}-wood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9a441" />
          <stop offset="48%" stopColor={solid.color} />
          <stop offset="100%" stopColor="#5b3412" />
        </linearGradient>
        <linearGradient id={`${solid.id}-wetSheen`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      {solid.kind === "regular-cylinder" && (
        <g>
          <ellipse cx={cx} cy={cy - 16} rx={18} ry={7} fill={`url(#${solid.id}-metal)`} stroke="#00000055" />
          <rect x={cx - 18} y={cy - 16} width={36} height={32} fill={`url(#${solid.id}-metal)`} opacity={0.96} />
          <path d={`M${cx - 18},${cy - 16} C${cx - 5},${cy - 8} ${cx + 5},${cy - 8} ${cx + 18},${cy - 16}`} stroke="#ffffff66" strokeWidth={1.2} fill="none" />
          <ellipse cx={cx} cy={cy + 16} rx={18} ry={7} fill={solid.color} stroke="#00000055" />
          <rect x={cx - 12} y={cy - 8} width={5} height={20} fill="#ffffff" opacity={0.16} />
        </g>
      )}
      {solid.kind === "regular-cuboid" && (
        <g transform={`translate(${cx - 24}, ${cy - 18})`}>
          <path d="M8 8 L38 2 L48 11 L18 17 Z" fill={solid.name.includes("Oak") ? `url(#${solid.id}-wood)` : "#f8fafc"} opacity={0.95} />
          <path d="M18 17 L48 11 L48 34 L18 40 Z" fill={solid.name.includes("Oak") ? "#8a5a1e" : `url(#${solid.id}-metal)`} opacity={0.98} />
          <path d="M8 8 L18 17 L18 40 L8 30 Z" fill={solid.name.includes("Oak") ? "#6f4417" : "#94a3b8"} opacity={0.95} />
          <path d="M8 8 L38 2 L48 11 L48 34 L18 40 L8 30 Z" fill="none" stroke="#00000055" strokeWidth={1.2} />
          {solid.name.includes("Oak") && (
            <>
              <path d="M14 14 C22 12 29 12 42 8" stroke="#f6c46b66" strokeWidth={1} fill="none" />
              <path d="M18 24 C28 20 35 22 46 17" stroke="#3b210966" strokeWidth={1} fill="none" />
            </>
          )}
        </g>
      )}
      {(solid.kind === "irregular-rock" || solid.kind === "custom") && solid.polygon && (
        <g>
          <polygon
            points={polygonToSvgPoints(solid.polygon, cx, cy, 23)}
            fill={`url(#${solid.id}-rock)`}
            stroke="#00000066"
            strokeWidth={1.5}
          />
          <polygon
            points={polygonToSvgPoints(solid.polygon.slice(0, 5), cx - 2, cy - 2, 15)}
            fill="#ffffff"
            opacity={0.08}
          />
        </g>
      )}
      {wetOpacity > 0 && (
        <rect x={0} y={0} width={size} height={size} fill={`url(#${solid.id}-wetSheen)`} opacity={wetOpacity}>
          <animate
            attributeName="opacity"
            values={`${wetOpacity};${wetOpacity * 0.6};${wetOpacity}`}
            dur="1.8s"
            repeatCount="indefinite"
          />
        </rect>
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Digital balance
// ---------------------------------------------------------------------------

function Balance({
  reading,
  hasSolid,
  solid,
  wetOpacity,
  zoneRef,
  onSolidPointerDown,
  draggingId,
}: {
  reading: number;
  hasSolid: boolean;
  solid: SolidDef | null;
  wetOpacity: number;
  zoneRef: React.RefObject<HTMLDivElement | null>;
  onSolidPointerDown: (id: string, e: React.PointerEvent) => void;
  draggingId: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-full border border-slate-300/60 bg-slate-100/90 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-700 shadow-sm">
        Digital balance · ±0.01 g
      </div>
      <div
        ref={zoneRef}
        className="relative flex h-36 w-48 flex-col items-center rounded-[22px_22px_15px_15px] border border-slate-500/70 bg-gradient-to-b from-[#edf1f3] via-[#aeb6bd] to-[#606971] pt-3 shadow-[0_16px_24px_rgba(15,23,42,0.42),inset_0_2px_1px_rgba(255,255,255,0.85),inset_0_-4px_7px_rgba(15,23,42,0.32)]"
      >
        {/* LCD readout */}
        <div className="absolute bottom-[13px] left-5 z-20 rounded-[4px] border-2 border-[#40484d] bg-[#071910] px-3 py-1 shadow-[inset_0_2px_5px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.5)]">
          <span
            className="font-mono text-[14px] tracking-wider tabular-nums"
            style={{
              color: "#6ee7a8",
              textShadow: hasSolid
                ? "0 0 6px rgba(110,231,168,0.8), 0 0 1px rgba(110,231,168,0.9)"
                : "0 0 3px rgba(110,231,168,0.3)",
            }}
          >
            {reading.toFixed(2)}
            <span className="text-[10px] ml-1 opacity-70">g</span>
          </span>
        </div>
        <div
          className="absolute bottom-[25px] right-[52px] z-20 h-1.5 w-1.5 rounded-full"
          style={{
            background: hasSolid ? "#34d399" : "#475569",
            boxShadow: hasSolid ? "0 0 4px #34d399" : "none",
          }}
        />

        {/* Weighing platform */}
        <div className="relative flex h-[90px] w-full items-start justify-center pt-2">
          <div
            className="absolute top-[62px] rounded-full transition-all duration-200"
            style={{
              width: hasSolid ? 46 : 38,
              height: hasSolid ? 12 : 9,
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)",
            }}
          />
          <svg width="112" height="38" viewBox="0 0 112 38" className="absolute top-1 overflow-visible">
            <defs>
              <radialGradient id="platformGrad" cx="35%" cy="28%" r="80%">
                <stop offset="0%" stopColor="#eef1f4" />
                <stop offset="45%" stopColor="#b6bcc4" />
                <stop offset="100%" stopColor="#767c86" />
              </radialGradient>
            </defs>
            <path d="M13 13 L19 26 Q56 37 93 26 L99 13 Z" fill="#717980" stroke="#4b535a" />
            <ellipse cx="56" cy="13" rx="50" ry="13" fill="url(#platformGrad)" stroke="#68727b" strokeWidth={1.2} />
            <ellipse cx="56" cy="10.5" rx="42" ry="9" fill="none" stroke="#f8fafc" strokeWidth={0.8} opacity={0.75} />
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              return (
                <circle key={i} cx={56 + Math.cos(angle) * 38} cy={13 + Math.sin(angle) * 9} r={0.75} fill="#596168" />
              );
            })}
          </svg>

          {hasSolid && solid && (
            <div
              className="absolute -top-6 z-10 cursor-grab touch-none active:cursor-grabbing"
              style={{ opacity: draggingId === solid.id ? 0.25 : 1 }}
              onPointerDown={(e) => onSolidPointerDown(solid.id, e)}
            >
              <SolidGlyph solid={solid} wetOpacity={wetOpacity} />
            </div>
          )}
        </div>

        <div className="absolute bottom-[15px] right-3 z-20 flex gap-1.5">
          <div className="grid h-6 w-6 place-items-center rounded-full border border-slate-500 bg-slate-300 text-[5px] font-black text-slate-700 shadow-[inset_0_1px_1px_white]">TARE</div>
          <div className="grid h-6 w-6 place-items-center rounded-full border border-slate-500 bg-slate-300 text-[5px] font-black text-slate-700 shadow-[inset_0_1px_1px_white]">ON</div>
        </div>
        <div className="absolute left-1/2 top-[91px] -translate-x-1/2 text-[7px] font-black tracking-[0.2em] text-slate-700">
          SIDEMANN LAB · 200 g
        </div>
        <div className="absolute -bottom-1 left-4 h-2 w-7 rounded-b-lg bg-slate-900 shadow" />
        <div className="absolute -bottom-1 right-4 h-2 w-7 rounded-b-lg bg-slate-900 shadow" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Measuring cylinder (main) with animated water + wave surface + graduations
// ---------------------------------------------------------------------------

function MeasuringCylinder({
  levelCm,
  waveHeightsRef,
  maxLevelCm,
  submergedSolids,
  entryStartedAt,
  bubbles,
  zoneRef,
  eurekaMode,
  overflowing,
  onSolidPointerDown,
  draggingId,
}: {
  levelCm: number;
  waveHeightsRef: React.MutableRefObject<number[]>;
  maxLevelCm: number;
  submergedSolids: SolidDef[];
  entryStartedAt: Record<string, number>;
  bubbles: { id: number; x: number; y: number }[];
  zoneRef: React.RefObject<HTMLDivElement | null>;
  eurekaMode: boolean;
  overflowing: boolean;
  onSolidPointerDown: (id: string, e: React.PointerEvent) => void;
  draggingId: string | null;
}) {
  const width = 190;
  const height = 248;
  const topY = 24;
  const bottomY = 219;
  const leftTopX = eurekaMode ? 27 : 52;
  const rightTopX = eurekaMode ? 139 : 124;
  const leftBottomX = eurekaMode ? 31 : 56;
  const rightBottomX = eurekaMode ? 135 : 120;
  const usableHeight = bottomY - topY;
  const pxPerCm = usableHeight / (maxLevelCm + 1.5);
  const waterTopY = bottomY - levelCm * pxPerCm;
  const sideXAtY = (y: number, side: "left" | "right") => {
    const t = Math.max(0, Math.min(1, (y - topY) / usableHeight));
    return side === "left"
      ? leftTopX + (leftBottomX - leftTopX) * t
      : rightTopX + (rightBottomX - rightTopX) * t;
  };
  const waterLeftX = sideXAtY(waterTopY, "left");
  const waterRightX = sideXAtY(waterTopY, "right");

  const waveHeights = waveHeightsRef.current;
  const surfacePath = waveHeights
    .map((h, i) => {
      const x = waterLeftX + (i / (WAVE_POINTS - 1)) * (waterRightX - waterLeftX);
      const y = waterTopY + h * 10;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const now = performance.now();
  const submergedLayout = submergedSolids.map((s, i) => {
    const density = s.massG / s.volumeCm3;
    // Every specimen is fully immersed. Dense specimens hang just above the
    // base; specimens lighter than water are held below the surface by the
    // rigid immersion cradle shown around them.
    const settledY = density >= WATER_DENSITY
      ? bottomY - 22 - i * 5
      : Math.min(bottomY - 30, waterTopY + 40 + i * 8);
    const entryAge = entryStartedAt[s.id] ? now - entryStartedAt[s.id] : 1000;
    const entryProgress = Math.max(0, Math.min(1, entryAge / 720));
    const eased = 1 - Math.pow(1 - entryProgress, 3);
    const bobY = (topY - 18) * (1 - eased) + settledY * eased + Math.sin(entryProgress * Math.PI * 2) * (1 - entryProgress) * 4;
    const spread = submergedSolids.length > 1 ? (i - (submergedSolids.length - 1) / 2) * 22 : 0;
    return { solid: s, bobY, spread, entryProgress, density };
  });

  const graduations = [];
  for (let mL = 0; mL <= Math.ceil(maxLevelCm * CYL_AREA_CM2); mL += 10) {
    const cm = mL / CYL_AREA_CM2;
    const y = bottomY - cm * pxPerCm;
    if (y < topY + 4 || y > bottomY) continue;
    const major = mL % 20 === 0;
    const rightX = sideXAtY(y, "right");
    graduations.push(
      <g key={mL}>
        <line
          x1={rightX - (major ? 18 : 10)}
          y1={y}
          x2={rightX}
          y2={y}
          stroke={major ? "#475569" : "#64748b"}
          strokeWidth={major ? 1.35 : 0.9}
        />
        {major && (
          <text x={rightX + 7} y={y + 3} fontSize={7.5} fontWeight="700" fill="#334155" textAnchor="start">
            {mL}
          </text>
        )}
      </g>
    );
  }

  return (
    <div ref={zoneRef} className="flex flex-col items-center gap-1.5">
      <div className="rounded-full border border-slate-300/60 bg-slate-100/90 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-700 shadow-sm">
        {eurekaMode ? "Eureka displacement vessel" : "250 mL measuring cylinder"}
      </div>
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="glassBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.22" />
            <stop offset="9%" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="17%" stopColor="#e0f2fe" stopOpacity="0.12" />
            <stop offset="78%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="93%" stopColor="#bae6fd" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id="waterDepth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bff4ff" stopOpacity="0.84" />
            <stop offset="9%" stopColor="#55cce8" stopOpacity="0.66" />
            <stop offset="100%" stopColor="#047eaa" stopOpacity="0.58" />
          </linearGradient>
          <linearGradient id="eurekaRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f8fafc" />
            <stop offset="0.45" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
          <filter id="densityGlassShadow" x="-30%" y="-20%" width="160%" height="160%">
            <feDropShadow dx="2" dy="6" stdDeviation="4" floodColor="#0f172a" floodOpacity="0.35" />
          </filter>
          <clipPath id="densityVesselClip">
            <path d={`M${leftTopX},${topY} L${rightTopX},${topY} L${rightBottomX},${bottomY} L${leftBottomX},${bottomY} Z`} />
          </clipPath>
        </defs>

        {/* Retort stand and rigid immersion cradle. It prevents low-density
            specimens from floating out of the water without adding a hidden
            displacement to the measured result. */}
        <g opacity={submergedSolids.length ? 1 : 0.55}>
          <ellipse cx="13" cy="231" rx="13" ry="4" fill="#1e293b" />
          <rect x="10.5" y="17" width="5" height="214" rx="2.5" fill="#374151" />
          <path d="M13 18 H87" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          <rect x="80" y="13" width="15" height="10" rx="2" fill="#1f2937" />
          <circle cx="87" cy="18" r="3" fill="#aeb7bf" />
        </g>

        <path
          d={`M${leftTopX},${topY} L${rightTopX},${topY} L${rightBottomX},${bottomY} Q${width / 2},${bottomY + 7} ${leftBottomX},${bottomY} Z`}
          fill={eurekaMode ? "#cbd5e144" : "#eff6ff22"}
          stroke={eurekaMode ? "#64748b" : "#dbeafe"}
          strokeWidth={eurekaMode ? 2.2 : 1.8}
          filter="url(#densityGlassShadow)"
        />

        <g clipPath="url(#densityVesselClip)">
          <path d={`${surfacePath} L${rightBottomX},${bottomY} L${leftBottomX},${bottomY} Z`} fill="url(#waterDepth)" />
          <path d={surfacePath} fill="none" stroke="#e0faff" strokeWidth={2.2} opacity={0.96} />
          <path d={`${surfacePath} L${rightBottomX},${bottomY} L${leftBottomX},${bottomY} Z`} fill="#075985" opacity={0.07} />
        </g>

        {/* Glass/acrylic front and curved mouth, rendered after the liquid so
            the highlights remain on the vessel rather than in the water. */}
        <path
          d={`M${leftTopX},${topY} L${rightTopX},${topY} L${rightBottomX},${bottomY} Q${width / 2},${bottomY + 7} ${leftBottomX},${bottomY} Z`}
          fill="url(#glassBody)"
        />
        <ellipse cx={(leftTopX + rightTopX) / 2} cy={topY} rx={(rightTopX - leftTopX) / 2 + 2} ry={eurekaMode ? 7 : 4.5} fill="#dbeafe22" stroke="#e2e8f0" strokeWidth={1.8} />
        <path d={`M${leftTopX + 8},${topY + 7} L${leftBottomX + 7},${bottomY - 12}`} stroke="#ffffff" strokeWidth={eurekaMode ? 5 : 3.5} opacity={0.38} strokeLinecap="round" />

        {eurekaMode && (
          <g>
            <path d={`M${rightTopX - 1} ${waterTopY - 6} H159 Q167 ${waterTopY - 6} 171 ${waterTopY - 1} L174 ${waterTopY + 3} H158 Q151 ${waterTopY + 1} ${rightTopX - 1} ${waterTopY + 1} Z`} fill="url(#eurekaRim)" stroke="#475569" strokeWidth="1" />
            <path d={`M${rightTopX + 2} ${waterTopY - 3} H160 Q166 ${waterTopY - 3} 169 ${waterTopY + 1}`} fill="none" stroke="#c7f2ff" strokeWidth="2" opacity="0.8" />
            {overflowing && (
              <g>
                <path d={`M170 ${waterTopY + 2} C172 ${waterTopY + 18}, 168 ${waterTopY + 29}, 171 ${waterTopY + 44}`} fill="none" stroke="#7ddff2" strokeWidth="3.1" strokeLinecap="round" opacity="0.92" />
                <circle cx="171" cy={waterTopY + 50} r="2.5" fill="#9be9f6">
                  <animate attributeName="cy" values={`${waterTopY + 46};${waterTopY + 67}`} dur="0.42s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0" dur="0.42s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
          </g>
        )}
        {!eurekaMode && graduations}

        {!eurekaMode && (
          <g>
            <rect x="80" y={bottomY + 2} width="15" height="9" rx="2" fill="#d8dee3" stroke="#64748b" />
            <path d={`M48 ${bottomY + 11} H127 L139 ${bottomY + 20} H36 Z`} fill="#9aa4ad" stroke="#59636c" strokeWidth="1.4" />
            <ellipse cx="87.5" cy={bottomY + 13} rx="41" ry="5" fill="#d5dce1" opacity="0.55" />
          </g>
        )}

        {submergedLayout.map(({ solid: s, bobY, spread, entryProgress, density }) => (
          <g key={s.id}>
            {entryProgress < 1 && (
              <ellipse
                cx={width / 2 + spread}
                cy={waterTopY + 2}
                rx={18 + entryProgress * 14}
                ry={3 + entryProgress * 2}
                fill="none"
                stroke="#bae6fd"
                strokeWidth={1.2}
                opacity={(1 - entryProgress) * 0.85}
              />
            )}
            <path
              d={`M87 ${topY + 1} L${width / 2 + spread} ${bobY - 16}`}
              fill="none"
              stroke={density < WATER_DENSITY ? "#64748b" : "#cbd5e1"}
              strokeWidth={density < WATER_DENSITY ? 2.2 : 0.85}
              opacity="0.88"
            />
            <g
              onPointerDown={(e) => onSolidPointerDown(s.id, e)}
              style={{
                transform: `translate(${width / 2 + spread}px, ${bobY}px)`,
                transition: entryProgress >= 1 ? "transform 0.18s ease-out" : "none",
                opacity: draggingId === s.id ? 0.25 : 1,
                cursor: "grab",
                touchAction: "none",
              }}
            >
              {(s.kind === "regular-cylinder" || s.kind === "regular-cuboid") && (
                <g>
                  <rect x={-14} y={-12} width={28} height={24} fill={s.color} opacity={0.97} rx={s.kind === "regular-cylinder" ? 7 : 2} />
                  <path d="M-10 -9 H8" stroke="#fff" strokeWidth="2" opacity="0.28" strokeLinecap="round" />
                </g>
              )}
              {(s.kind === "irregular-rock" || s.kind === "custom") && s.polygon && (
                <polygon points={polygonToSvgPoints(s.polygon, 0, 0, 16)} fill={s.color} opacity={0.95} />
              )}
              {density < WATER_DENSITY && (
                <g fill="none" stroke="#64748b" strokeWidth="1.3" opacity="0.95">
                  <path d="M-19 -17 V17 M19 -17 V17 M-19 17 H19 M-19 -17 H19" />
                  <path d="M-19 -8 H19 M-19 4 H19" opacity="0.65" />
                </g>
              )}
            </g>
          </g>
        ))}

        {bubbles.map((b) => {
          const wobble = Math.sin(b.y * 0.15) * 3;
          const fade = Math.max(0, Math.min(1, (b.y - 20) / 60));
          return (
            <circle
              key={b.id}
              cx={width / 2 + b.x + wobble}
              cy={b.y}
              r={1.6 + Math.sin(b.y * 0.3) * 0.6}
              fill="#e0f2fe"
              opacity={0.75 * fade}
            />
          );
        })}

        <text x={(leftTopX + rightTopX) / 2} y={bottomY - 7} textAnchor="middle" fontSize="6.8" fontWeight="800" fill="#0f4c5c" opacity="0.75">
          {eurekaMode ? "OVERFLOW VESSEL" : "CLASS A · 20 °C"}
        </text>
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Eureka-can catch cylinder (receives overflow drips)
// ---------------------------------------------------------------------------

function CatchCylinder({ levelCm, maxLevelCm }: { levelCm: number; maxLevelCm: number }) {
  const width = 72;
  const height = 146;
  const vesselTop = 8;
  const vesselBottom = 128;
  const pxPerCm = (vesselBottom - vesselTop) / (maxLevelCm + 1);
  const waterTopY = Math.min(vesselBottom, vesselBottom - Math.max(0, levelCm) * pxPerCm);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="rounded-full border border-slate-300/60 bg-slate-100/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-slate-700 shadow-sm">Overflow receiver</div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="catchGlass" x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="0.16" stopColor="#dbeafe" stopOpacity="0.12" />
            <stop offset="0.8" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#94a3b8" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="catchWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bff4ff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#0891b2" stopOpacity="0.62" />
          </linearGradient>
        </defs>
        <clipPath id="catchClip">
          <path d="M14 9 H56 L53 128 H17 Z" />
        </clipPath>
        <g clipPath="url(#catchClip)">
          <rect x={10} y={waterTopY} width={52} height={vesselBottom - waterTopY} fill="url(#catchWater)" />
          {levelCm > 0.02 && <ellipse cx="35" cy={waterTopY} rx="20" ry="2.2" fill="#d6f8ff" opacity="0.92" />}
        </g>
        <path d="M14 9 H56 L53 128 Q35 134 17 128 Z" fill="url(#catchGlass)" stroke="#dbeafe" strokeWidth="1.5" />
        <ellipse cx="35" cy="9" rx="22" ry="4" fill="#e0f2fe22" stroke="#eff6ff" strokeWidth="1.5" />
        <path d="M20 16 L22 118" stroke="white" strokeWidth="2.5" opacity="0.34" strokeLinecap="round" />
        {Array.from({ length: Math.floor(maxLevelCm) }).map((_, i) => {
          const y = height - (i + 1) * pxPerCm;
          return (
            <g key={i}>
              <line x1={45} y1={y - 15} x2={55} y2={y - 15} stroke="#475569" strokeWidth={1} />
              <text x="43" y={y - 12} textAnchor="end" fontSize="6" fill="#334155">{(i + 1) * CATCH_AREA_CM2}</text>
            </g>
          );
        })}
        <rect x="30" y="129" width="10" height="7" rx="1" fill="#aeb7bf" stroke="#64748b" />
        <path d="M12 136 H58 L66 142 H5 Z" fill="#89939d" stroke="#4b5563" />
      </svg>
      <div className="rounded-md bg-slate-900/80 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-100 shadow">{(Math.max(0, levelCm) * CATCH_AREA_CM2).toFixed(1)} mL</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Zoomed meniscus reader
// ---------------------------------------------------------------------------

function MeniscusZoom({ levelCm, areaCm2 }: { levelCm: number; areaCm2: number }) {
  const mL = Math.max(0, levelCm * areaCm2);
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mb-1 flex items-center justify-between text-[11px] text-slate-300">
        <span>Eye-level meniscus</span>
        <span className="text-[9px] font-semibold uppercase tracking-wider text-cyan-200/70">read the bottom</span>
      </div>
      <svg width="100%" height={60} viewBox="0 0 200 70" preserveAspectRatio="none" className="rounded-md overflow-hidden">
        <defs>
          <linearGradient id="meniscusWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a5f3fc" stopOpacity="0.8" />
            <stop offset="1" stopColor="#0284c7" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={200} height={70} fill="#d8e2e8" opacity="0.96" />
        {[10, 23, 36, 49, 62].map((y, i) => (
          <g key={y}>
            <line x1="156" y1={y} x2={i === 2 ? 194 : 181} y2={y} stroke="#334155" strokeWidth={i === 2 ? 1.6 : 1} />
            {i === 2 && <text x="151" y={y + 3} textAnchor="end" fontSize="9" fontWeight="700" fill="#334155">{mL.toFixed(1)}</text>}
          </g>
        ))}
        <path
          d="M0,25 C38,25 62,36 100,36 C138,36 162,25 200,25 L200,70 L0,70 Z"
          fill="url(#meniscusWater)"
        />
        <path d="M0,25 C38,25 62,36 100,36 C138,36 162,25 200,25" fill="none" stroke="#e0fbff" strokeWidth={2} />
        <line x1={20} y1={36} x2={150} y2={36} stroke="#ea580c" strokeDasharray="5 4" strokeWidth={1.4} />
        <circle cx="100" cy="36" r="2.4" fill="#f97316" />
        <path d="M4 4 H196 V66" fill="none" stroke="white" strokeWidth="3" opacity="0.28" />
      </svg>
      <div className="text-xs mt-1">
        Reading: <span className="font-bold text-cyan-200">{mL.toFixed(1)} mL</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom rock creator (click to place polygon vertices)
// ---------------------------------------------------------------------------

function RockCreator({
  onCreate,
  onClose,
}: {
  onCreate: (solid: SolidDef) => void;
  onClose: () => void;
}) {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [thicknessCm, setThicknessCm] = useState(2);
  const [massG, setMassG] = useState(15);
  const size = 220;

  const areaPx2 = points.length >= 3 ? shoelaceArea(points) : 0;
  // Canvas is treated as 6 cm across, so convert px^2 -> cm^2.
  const cmPerPx = 6 / size;
  const areaCm2 = areaPx2 * cmPerPx * cmPerPx;
  const volumeCm3 = areaCm2 * thicknessCm;
  const density = volumeCm3 > 0 ? massG / volumeCm3 : 0;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((prev) => [...prev, { x, y }]);
  };

  const handleUndo = () => setPoints((prev) => prev.slice(0, -1));

  const handleCreate = () => {
    if (points.length < 3) return;
    const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
    const maxR = Math.max(...points.map((p) => Math.hypot(p.x - cx, p.y - cy)), 1);
    const normalized = points.map((p) => ({ x: (p.x - cx) / maxR, y: (p.y - cy) / maxR }));
    onCreate({
      id: `custom-${Date.now()}`,
      name: "Custom rock",
      kind: "custom",
      color: "#94a3b8",
      massG,
      volumeCm3: Math.max(0.5, volumeCm3),
      polygon: normalized,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-white/10 rounded-2xl p-5 w-full max-w-sm space-y-3">
        <h3 className="font-bold text-lg">Draw your own irregular solid</h3>
        <p className="text-xs text-slate-400">
          Click to place vertices of the rock's cross-section. The app estimates its volume from
          the drawn area × an assumed thickness — then you verify that estimate by displacement.
        </p>
        <svg
          width={size}
          height={size}
          onClick={handleClick}
          className="bg-slate-900 rounded-lg border border-white/10 cursor-crosshair"
        >
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill="#f97316" />
          ))}
          {points.length >= 2 && (
            <polyline
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#a855f7"
              strokeWidth={1.5}
            />
          )}
          {points.length >= 3 && (
            <polygon
              points={points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="#a855f733"
              stroke="#a855f7"
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
          )}
        </svg>
        <div className="flex gap-2">
          <button onClick={handleUndo} className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold">
            Undo point
          </button>
          <button
            onClick={() => setPoints([])}
            className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
          >
            Clear
          </button>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <label>Assumed thickness</label>
            <span className="text-purple-300 font-bold">{thicknessCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.1}
            value={thicknessCm}
            onChange={(e) => setThicknessCm(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <label>Dry mass (weigh it yourself later — set for now)</label>
            <span className="text-purple-300 font-bold">{massG} g</span>
          </div>
          <input
            type="range"
            min={2}
            max={80}
            step={1}
            value={massG}
            onChange={(e) => setMassG(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Geometric estimate: area {areaCm2.toFixed(2)} cm² × thickness = volume ≈{" "}
          <span className="text-slate-200 font-semibold">{volumeCm3.toFixed(2)} cm³</span>, implying
          density ≈ <span className="text-slate-200 font-semibold">{density.toFixed(2)} g/cm³</span>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleCreate}
            disabled={points.length < 3}
            className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-400 font-bold text-sm"
          >
            Add to bench
          </button>
          <button onClick={onClose} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

const DEFAULT_SOLIDS: SolidDef[] = [
  { id: "copper", name: "Copper cylinder", kind: "regular-cylinder", color: "#c2703d", massG: 89.6, volumeCm3: 10 },
  { id: "aluminium", name: "Aluminium block", kind: "regular-cuboid", color: "#cbd5e1", massG: 27, volumeCm3: 10 },
  {
    id: "granite",
    name: "Jagged granite",
    kind: "irregular-rock",
    color: "#78716c",
    massG: 26.5,
    volumeCm3: 10,
    polygon: proceduralRockPolygon(7),
  },
  { id: "oak", name: "Oak wood block", kind: "regular-cuboid", color: "#a5772f", massG: 6, volumeCm3: 10 },
];

interface DensityPaperProps {
  eurekaMode: boolean;
  balanceReading: number;
  measuredVolumeCm3: number;
  currentSolid: SolidDef | null;
  readings: Reading[];
  onClose: () => void;
}

function DensityPaper({
  eurekaMode,
  balanceReading,
  measuredVolumeCm3,
  currentSolid,
  readings,
  onClose,
}: DensityPaperProps) {
  const currentDensity = currentSolid ? currentSolid.massG / Math.max(0.01, measuredVolumeCm3) : null;

  return (
    <ExperimentPaperModal filename="density-experiment-paper.html" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase tracking-wide">
          Determination of Density of Regular and Irregular Solids
        </h1>

        <h2 className="mt-6 text-base font-bold uppercase">Aim</h2>
        <p className="mt-1">
          To determine the density of solid objects by measuring mass with an electronic balance
          and volume by water displacement.
        </p>

        <h2 className="mt-6 text-base font-bold uppercase">Apparatus</h2>
        <ul className="mt-1 list-disc pl-6">
          <li>Electronic balance</li>
          <li>Measuring cylinder or eureka can</li>
          <li>Retort stand and tare-corrected immersion cradle</li>
          <li>Water</li>
          <li>Regular and irregular solid objects</li>
        </ul>

        <h2 className="mt-6 text-base font-bold uppercase">Method</h2>
        <ol className="mt-1 list-decimal space-y-1 pl-6">
          <li>Measure the dry mass of the solid using the balance.</li>
          <li>Record the initial water reading with the empty immersion cradle already in position.</li>
          <li>Lower the solid until it is fully immersed, remove trapped air, and allow the meniscus to settle.</li>
          <li>Record the final reading, or the overflow collected when using the eureka can.</li>
          <li>Calculate density using density = mass ÷ volume.</li>
        </ol>

        <h2 className="mt-6 text-base font-bold uppercase">Current Observation</h2>
        <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Method</td>
              <td className="border border-slate-400 px-2 py-1">
                {eurekaMode ? "Eureka can overflow method" : "Measuring cylinder displacement"}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Solid</td>
              <td className="border border-slate-400 px-2 py-1">{currentSolid?.name ?? "Not selected"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Mass reading</td>
              <td className="border border-slate-400 px-2 py-1">{balanceReading.toFixed(2)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Displaced volume</td>
              <td className="border border-slate-400 px-2 py-1">{measuredVolumeCm3.toFixed(1)} cm³</td>
            </tr>
            <tr>
              <td className="border border-slate-400 px-2 py-1">Density</td>
              <td className="border border-slate-400 px-2 py-1">
                {currentDensity ? `${currentDensity.toFixed(2)} g/cm³` : "Not calculated"}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-6 text-base font-bold uppercase">Recorded Results</h2>
        <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-400 px-2 py-1 text-left">Solid</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Mass (g)</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Volume (cm³)</th>
              <th className="border border-slate-400 px-2 py-1 text-left">Density (g/cm³)</th>
            </tr>
          </thead>
          <tbody>
            {readings.length === 0 ? (
              <tr>
                <td className="border border-slate-400 px-2 py-1" colSpan={4}>
                  No trials recorded yet.
                </td>
              </tr>
            ) : (
              readings.map((r, i) => (
                <tr key={i}>
                  <td className="border border-slate-400 px-2 py-1">{r.solidName}</td>
                  <td className="border border-slate-400 px-2 py-1">{r.massG.toFixed(1)}</td>
                  <td className="border border-slate-400 px-2 py-1">{r.measuredVolumeCm3.toFixed(1)}</td>
                  <td className="border border-slate-400 px-2 py-1">{r.measuredDensity.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <h2 className="mt-6 text-base font-bold uppercase">Conclusion</h2>
        <p className="mt-1">
          The density of each solid is found from mass divided by displaced volume. Irregular
          objects are measured by displacement because their volume cannot be found easily from
          length, width, and height.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

function makeDensityWallTexture(
  title: string,
  subtitle: string,
  lines: string[],
  accent = "#64d9cf",
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 520;
  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#062d28");
  gradient.addColorStop(1, "#071d20");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#50605e";
  context.lineWidth = 20;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  context.fillStyle = "#f2f1df";
  context.textAlign = "center";
  context.font = "800 67px Georgia";
  context.fillText(title, canvas.width / 2, 135);
  context.fillStyle = accent;
  context.font = "700 34px Arial";
  context.fillText(subtitle, canvas.width / 2, 204);
  context.strokeStyle = "rgba(255,255,255,.22)";
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(90, 248);
  context.lineTo(canvas.width - 90, 248);
  context.stroke();
  context.fillStyle = "#d7e5df";
  context.font = "600 27px Arial";
  lines.forEach((line, index) => context.fillText(line, canvas.width / 2, 315 + index * 55));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeDensitySafetyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 620;
  canvas.height = 820;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f6f2df";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#087b59";
  context.fillRect(0, 0, canvas.width, 145);
  context.fillStyle = "white";
  context.textAlign = "center";
  context.font = "900 58px Arial";
  context.fillText("LAB SAFETY", canvas.width / 2, 92);
  context.textAlign = "left";
  context.fillStyle = "#273438";
  context.font = "700 31px Arial";
  [
    "1. Dry solids before weighing",
    "2. Lower samples gently",
    "3. Wipe water spills at once",
    "4. Read scales at eye level",
    "5. Keep glassware away from edges",
  ].forEach((line, index) => context.fillText(line, 46, 235 + index * 102));
  context.strokeStyle = "#73817f";
  context.lineWidth = 5;
  context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// A pulsing ring dropped over whichever station the player is currently
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
        <meshStandardMaterial color="#4b5f5a" roughness={0.45} metalness={0.1} />
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

function DensityRoom3D() { return <group><BlenderLabEnvironment {...BLENDER_LAB_LAYOUT} /><BlenderLabBench position={[0, -1.25, 0.35]} size={[10.58, 4.56]} height={0.7025} />
</group>; }

function makeBalanceDisplayTexture(reading: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 520;
  canvas.height = 180;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#04150d";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#253d32";
  context.lineWidth = 14;
  context.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
  context.fillStyle = "#78e2a8";
  context.shadowColor = "#43d98b";
  context.shadowBlur = 18;
  context.textAlign = "right";
  context.font = "700 112px monospace";
  context.fillText(reading.toFixed(2), 410, 126);
  context.shadowBlur = 0;
  context.textAlign = "left";
  context.font = "700 48px Arial";
  context.fillText("g", 430, 124);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeSpecimenStickerTexture(solid: SolidDef) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f8f1d8";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#b8aa79";
  context.lineWidth = 16;
  context.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  context.fillStyle = "#17202a";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "800 64px Arial";
  context.fillText(solid.name.replace(/ (cylinder|block)$/i, ""), canvas.width / 2, 92);
  context.fillStyle = "#4b5563";
  context.font = "700 38px monospace";
  context.fillText(`SPECIMEN ${solid.id.slice(0, 8).toUpperCase()}`, canvas.width / 2, 174);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function SpecimenSticker({ solid, position, scale = [0.38, 0.19, 1] }: {
  solid: SolidDef;
  position: [number, number, number];
  scale?: [number, number, number];
}) {
  const texture = useMemo(() => makeSpecimenStickerTexture(solid), [solid]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} scale={scale} renderOrder={18}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} toneMapped={false} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}

function SolidModel3D({ solid, scale = 1 }: { solid: SolidDef; scale?: number }) {
  const isWood = solid.name.toLowerCase().includes("wood");
  const isMetal = solid.id === "copper" || solid.id === "aluminium";
  const material = (
    <meshPhysicalMaterial
      color={solid.color}
      metalness={isMetal ? 0.86 : 0.025}
      roughness={isWood ? 0.7 : solid.kind === "irregular-rock" || solid.kind === "custom" ? 0.84 : 0.24}
      clearcoat={solid.kind === "regular-cylinder" || solid.kind === "regular-cuboid" ? 0.36 : 0.04}
      clearcoatRoughness={0.28}
    />
  );

  if (solid.kind === "regular-cylinder") {
    return (
      <group scale={scale}>
        <mesh castShadow>{/* 10 cm³ calibration cylinder */}
          <cylinderGeometry args={[0.27, 0.27, 0.58, 48]} />
          {material}
        </mesh>
        <mesh position={[-0.085, 0.12, 0.245]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.047, 18]} />
          <meshBasicMaterial color="#fff4e8" transparent opacity={0.42} />
        </mesh>
        <SpecimenSticker solid={solid} position={[0, -0.02, 0.274]} scale={[0.34, 0.17, 1]} />
      </group>
    );
  }
  if (solid.kind === "regular-cuboid") {
    return (
      <group scale={scale}>
        <mesh castShadow>
          <boxGeometry args={[0.64, 0.48, 0.46]} />
          {material}
        </mesh>
        {isWood && [-0.12, 0.02, 0.14].map((y) => (
          <mesh key={y} position={[0, y, 0.233]}>
            <boxGeometry args={[0.56, 0.018, 0.006]} />
            <meshStandardMaterial color="#5d3818" transparent opacity={0.5} />
          </mesh>
        ))}
        <SpecimenSticker solid={solid} position={[0, -0.02, 0.234]} scale={[0.42, 0.2, 1]} />
      </group>
    );
  }
  return (
    <group scale={scale} rotation={[0.18, 0.45, -0.12]}>
      <mesh castShadow scale={[0.42, 0.37, 0.4]}>
        <dodecahedronGeometry args={[1, 1]} />
        {material}
      </mesh>
      <SpecimenSticker solid={solid} position={[0.08, 0.02, 0.385]} scale={[0.36, 0.18, 1]} />
    </group>
  );
}

function SpecimenTray3D({ solids }: { solids: SolidDef[] }) {
  const visibleSolids = solids.slice(0, 6);
  return (
    <group position={[4.05, -0.49, 0.42]} rotation={[0, -0.08, 0]}>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.35, 0.1, 1.7]} />
        <meshPhysicalMaterial color="#26343a" metalness={0.42} roughness={0.42} clearcoat={0.24} />
      </mesh>
      <mesh position={[0, 0.075, 0]} receiveShadow>
        <boxGeometry args={[2.16, 0.035, 1.51]} />
        <meshStandardMaterial color="#8d6a45" roughness={0.72} />
      </mesh>
      {visibleSolids.map((solid, index) => {
        const column = index % 3;
        const row = Math.floor(index / 3);
        const isCylinder = solid.kind === "regular-cylinder";
        const y = isCylinder ? 0.075 + 0.58 * 0.58 / 2 : 0.075 + 0.48 * 0.58 / 2;
        return (
          <group
            key={solid.id}
            position={[-0.72 + column * 0.72, y, -0.38 + row * 0.78]}
            rotation={[0, -0.2 + index * 0.11, 0]}
          >
            <SolidModel3D solid={solid} scale={0.58} />
          </group>
        );
      })}
      <mesh position={[0, 0.18, 0.79]} rotation={[-Math.PI / 2.35, 0, 0]}>
        <planeGeometry args={[1.6, 0.22]} />
        <meshBasicMaterial color="#e7e2ce" toneMapped={false} />
      </mesh>
    </group>
  );
}

function ProjectedDropZones({
  balanceZoneRef,
  vesselZoneRef,
}: {
  balanceZoneRef: React.RefObject<HTMLDivElement | null>;
  vesselZoneRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { camera, size } = useThree();

  useFrame(() => {
    const updateZone = (element: HTMLDivElement | null, box: THREE.Box3, padding: number) => {
      if (!element) return;
      const corners = [
        [box.min.x, box.min.y, box.min.z], [box.min.x, box.min.y, box.max.z],
        [box.min.x, box.max.y, box.min.z], [box.min.x, box.max.y, box.max.z],
        [box.max.x, box.min.y, box.min.z], [box.max.x, box.min.y, box.max.z],
        [box.max.x, box.max.y, box.min.z], [box.max.x, box.max.y, box.max.z],
      ].map(([x, y, z]) => new THREE.Vector3(x, y, z).project(camera));
      const xs = corners.map((point) => (point.x * 0.5 + 0.5) * size.width);
      const ys = corners.map((point) => (-point.y * 0.5 + 0.5) * size.height);
      const left = THREE.MathUtils.clamp(Math.min(...xs) - padding, 0, size.width);
      const right = THREE.MathUtils.clamp(Math.max(...xs) + padding, 0, size.width);
      const top = THREE.MathUtils.clamp(Math.min(...ys) - padding, 0, size.height);
      const bottom = THREE.MathUtils.clamp(Math.max(...ys) + padding, 0, size.height);
      element.style.left = `${left}px`;
      element.style.top = `${top}px`;
      element.style.width = `${Math.max(0, right - left)}px`;
      element.style.height = `${Math.max(0, bottom - top)}px`;
    };

    updateZone(balanceZoneRef.current, new THREE.Box3(new THREE.Vector3(-3.75, -0.7, -0.65), new THREE.Vector3(-1.15, 1.45, 1.3)), 16);
    updateZone(vesselZoneRef.current, new THREE.Box3(new THREE.Vector3(-0.35, -0.65, -1.0), new THREE.Vector3(3.15, 3.85, 1.2)), 18);
  });

  return null;
}

function DigitalBalance3D({ reading, solid }: { reading: number; solid: SolidDef | null }) {
  const displayTexture = useMemo(() => makeBalanceDisplayTexture(reading), [reading]);
  useEffect(() => () => displayTexture.dispose(), [displayTexture]);

  return (
    <group position={[-2.45, -0.48, 0.35]} rotation={[0, 0.06, 0]}>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.35, 0.56, 1.58]} />
        <meshPhysicalMaterial color="#aeb7bd" metalness={0.42} roughness={0.32} clearcoat={0.55} clearcoatRoughness={0.25} />
      </mesh>
      <mesh position={[0, 0.47, -0.05]} castShadow>
        <boxGeometry args={[1.8, 0.13, 1.25]} />
        <meshStandardMaterial color="#768087" metalness={0.62} roughness={0.26} />
      </mesh>
      <mesh position={[0, 0.58, -0.04]} castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 0.96, 0.16, 64]} />
        <meshPhysicalMaterial color="#cbd2d7" metalness={0.88} roughness={0.19} clearcoat={0.7} />
      </mesh>
      <mesh position={[0, 0.675, -0.04]} receiveShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.035, 64]} />
        <meshStandardMaterial color="#e3e7e9" metalness={0.86} roughness={0.2} />
      </mesh>
      <mesh position={[-0.36, 0.05, 0.796]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.18, 0.39]} />
        <meshBasicMaterial map={displayTexture} toneMapped={false} />
      </mesh>
      {[0.48, 0.83].map((x, index) => (
        <group key={x} position={[x, 0.06, 0.81]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.055, 32]} />
            <meshStandardMaterial color={index === 0 ? "#d8dde0" : "#77a89a"} metalness={0.35} roughness={0.38} />
          </mesh>
          <mesh position={[0, 0, 0.031]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.075, 0.1, 28]} />
            <meshBasicMaterial color="#263238" />
          </mesh>
        </group>
      ))}
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} position={[x, -0.18, 0.52]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.17, 24]} />
          <meshStandardMaterial color="#20282d" roughness={0.72} />
        </mesh>
      ))}
      {solid && <group position={[0, 0.96, -0.03]}><SolidModel3D solid={solid} scale={0.92} /></group>}
    </group>
  );
}

function LiquidSurface3D({ radius, y, disturbed }: { radius: number; y: number; disturbed: boolean }) {
  const surfaceRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!surfaceRef.current) return;
    const amplitude = disturbed ? 0.018 : 0.0025;
    surfaceRef.current.rotation.x = -Math.PI / 2 + Math.sin(clock.elapsedTime * 7.2) * amplitude;
    surfaceRef.current.rotation.y = Math.cos(clock.elapsedTime * 5.9) * amplitude;
    surfaceRef.current.position.y = y + Math.sin(clock.elapsedTime * 8.4) * amplitude * 0.4;
  });
  return (
    <group ref={surfaceRef} position={[0, y, 0]}>
      <mesh renderOrder={34}>
        <circleGeometry args={[radius, 96]} />
        <meshPhysicalMaterial color="#aeeefa" transparent opacity={0.6} roughness={0.025} transmission={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.002]}>
        <ringGeometry args={[radius * 0.89, radius, 96]} />
        <meshBasicMaterial color="#e7fdff" transparent opacity={0.64} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function WaterLevelIndicator3D({
  levelCm,
  maxLevelCm,
  bottomY,
  innerHeight,
}: {
  levelCm: number;
  maxLevelCm: number;
  bottomY: number;
  innerHeight: number;
}) {
  const baselineY = bottomY + innerHeight * BASE_LEVEL_CM / maxLevelCm;
  const currentY = bottomY + innerHeight * Math.min(maxLevelCm, levelCm) / maxLevelCm;
  const riseCm = Math.max(0, levelCm - BASE_LEVEL_CM);
  const displacedMl = riseCm * CYL_AREA_CM2;
  const markerHeight = Math.max(0.025, currentY - baselineY);
  const markerMidpoint = baselineY + markerHeight / 2;

  return (
    <group position={[0.98, 0, 0.47]}>
      <mesh position={[0, bottomY + innerHeight / 2, 0]} renderOrder={44}>
        <boxGeometry args={[0.105, innerHeight + 0.18, 0.045]} />
        <meshPhysicalMaterial color="#07131b" metalness={0.45} roughness={0.28} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, baselineY, 0.035]} renderOrder={45}>
        <boxGeometry args={[0.34, 0.025, 0.03]} />
        <meshBasicMaterial color="#e2e8f0" toneMapped={false} />
      </mesh>
      <mesh position={[0, currentY, 0.05]} renderOrder={46}>
        <boxGeometry args={[0.43, 0.035, 0.035]} />
        <meshBasicMaterial color="#67e8f9" toneMapped={false} />
      </mesh>
      {riseCm > 0.015 && (
        <>
          <mesh position={[0, markerMidpoint, 0.075]} renderOrder={47}>
            <boxGeometry args={[0.035, markerHeight, 0.025]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
          <mesh position={[0, currentY - 0.035, 0.075]} rotation={[0, 0, Math.PI]} renderOrder={47}>
            <coneGeometry args={[0.085, 0.15, 3]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
          <mesh position={[0, baselineY + 0.035, 0.075]} renderOrder={47}>
            <coneGeometry args={[0.085, 0.15, 3]} />
            <meshBasicMaterial color="#ef4444" toneMapped={false} />
          </mesh>
        </>
      )}
      <Html
        position={[0.34, Math.min(bottomY + innerHeight - 0.12, Math.max(currentY + 0.34, baselineY + 0.62)), 0.08]}
        center
        distanceFactor={6.4}
        style={{ pointerEvents: "none" }}
      >
        <div className="min-w-[132px] rounded-xl border border-cyan-200/30 bg-slate-950/92 px-3 py-2 font-sans text-white shadow-[0_12px_30px_rgba(0,0,0,.45),0_0_20px_rgba(34,211,238,.16)] backdrop-blur-md">
          <div className="text-[8px] font-black uppercase tracking-[0.18em] text-cyan-300">Water level</div>
          <div className="mt-1 flex items-end justify-between gap-3">
            <span className="font-mono text-[15px] font-black text-white">{levelCm.toFixed(2)} cm</span>
            <span className="text-[9px] font-black text-red-400">▲ {riseCm.toFixed(2)} cm</span>
          </div>
          <div className="mt-1 border-t border-white/10 pt-1 text-[10px] font-bold text-slate-300">
            Rise volume <span className="text-cyan-200">{displacedMl.toFixed(1)} mL</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function ImmersedSolid3D({
  solid,
  waterSurfaceY,
  vesselBottomY,
  startedAt,
  transferOrigin,
}: {
  solid: SolidDef;
  waterSurfaceY: number;
  vesselBottomY: number;
  startedAt: number;
  transferOrigin: TransferOrigin;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const linkRef = useRef<THREE.Mesh>(null);
  const density = solid.massG / solid.volumeCm3;
  const topY = 3.62;
  const targetY = density >= WATER_DENSITY ? vesselBottomY + 0.36 : Math.max(vesselBottomY + 0.5, waterSurfaceY - 0.5);
  const start = transferOrigin === "balance"
    ? new THREE.Vector3(-3.87, 1.01, 0.14)
    : new THREE.Vector3(2.63, 0.52, 0.24);
  const lifted = new THREE.Vector3(start.x, topY + 0.08, start.z);
  const aboveVessel = new THREE.Vector3(0, topY + 0.08, 0);

  useFrame(() => {
    const age = Math.max(0, performance.now() - startedAt);
    const t = Math.min(1, age / DENSITY_TRANSFER_DURATION_MS);
    const position = new THREE.Vector3();

    if (t < 0.22) {
      const phase = 1 - (1 - t / 0.22) ** 3;
      position.lerpVectors(start, lifted, phase);
    } else if (t < 0.62) {
      const raw = (t - 0.22) / 0.4;
      const phase = raw * raw * (3 - 2 * raw);
      position.lerpVectors(lifted, aboveVessel, phase);
      position.y += Math.sin(raw * Math.PI) * 0.28;
    } else {
      const raw = (t - 0.62) / 0.38;
      const phase = 1 - (1 - raw) ** 3;
      position.lerpVectors(aboveVessel, new THREE.Vector3(0, targetY, 0), phase);
      position.y += Math.sin(raw * Math.PI * 2) * (1 - raw) * 0.055;
    }

    if (groupRef.current) {
      groupRef.current.position.copy(position);
      const swing = t < 0.68 ? Math.sin(t * Math.PI * 5) * (1 - t) * 0.14 : 0;
      groupRef.current.rotation.set(swing * 0.35, swing, -swing * 0.7);
    }
    if (linkRef.current) {
      const anchorY = topY + 0.34;
      const length = Math.max(0.03, anchorY - position.y - 0.28);
      linkRef.current.position.set(position.x, position.y + 0.28 + length / 2, position.z);
      linkRef.current.scale.y = length;
    }
  });

  return (
    <group>
      <mesh ref={linkRef} position={[0, topY, 0]}>
        <cylinderGeometry args={[density < WATER_DENSITY ? 0.018 : 0.008, density < WATER_DENSITY ? 0.018 : 0.008, 1, 14]} />
        <meshStandardMaterial color={density < WATER_DENSITY ? "#64717a" : "#d5dee2"} metalness={0.72} roughness={0.3} />
      </mesh>
      <group ref={groupRef} position={[start.x, start.y, start.z]}>
        <SolidModel3D solid={solid} scale={0.82} />
        <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.31, 0.018, 10, 34, Math.PI * 1.42]} />
          <meshStandardMaterial color="#c5d0d6" metalness={0.82} roughness={0.22} />
        </mesh>
        {density < WATER_DENSITY && (
          <group>
            <mesh position={[0, -0.34, 0]}>
              <torusGeometry args={[0.39, 0.022, 10, 38]} />
              <meshStandardMaterial color="#7b8790" metalness={0.68} roughness={0.32} />
            </mesh>
            {[-0.32, 0.32].map((x) => (
              <mesh key={x} position={[x, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.68, 10]} />
                <meshStandardMaterial color="#7b8790" metalness={0.68} roughness={0.32} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

function RetortStand3D({ vesselRadius }: { vesselRadius: number }) {
  return (
    <group position={[-vesselRadius - 0.52, 0, 0]}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <boxGeometry args={[0.85, 0.12, 0.78]} />
        <meshStandardMaterial color="#26333a" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 3.7, 22]} />
        <meshStandardMaterial color="#9aa5ad" metalness={0.9} roughness={0.18} />
      </mesh>
      <mesh position={[vesselRadius * 0.55 + 0.25, 3.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.028, 0.028, vesselRadius * 2.15, 18]} />
        <meshStandardMaterial color="#7b8790" metalness={0.85} roughness={0.22} />
      </mesh>
      <mesh position={[0, 3.55, 0]} castShadow>
        <boxGeometry args={[0.24, 0.22, 0.25]} />
        <meshStandardMaterial color="#253039" metalness={0.42} roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.55, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.08, 24]} />
        <meshStandardMaterial color="#222a2f" roughness={0.62} />
      </mesh>
    </group>
  );
}

function MeasuringCylinder3D({
  levelCm,
  maxLevelCm,
  solid,
  startedAt,
  transferOrigin,
  disturbed,
}: {
  levelCm: number;
  maxLevelCm: number;
  solid: SolidDef | null;
  startedAt: number;
  transferOrigin: TransferOrigin;
  disturbed: boolean;
}) {
  const vesselHeight = 3.18;
  const bottomY = 0.18;
  const innerHeight = 2.94;
  const liquidHeight = Math.max(0.03, Math.min(innerHeight, innerHeight * levelCm / maxLevelCm));
  const surfaceY = bottomY + liquidHeight;
  return (
    <group position={[1.42, -0.53, 0.18]}>
      <RetortStand3D vesselRadius={0.58} />
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.88, 0.88, 0.12, 6]} />
        <meshStandardMaterial color="#8f9aa2" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.24, 0.18, 42]} />
        <meshStandardMaterial color="#b8c1c7" metalness={0.58} roughness={0.28} />
      </mesh>
      <mesh position={[0, bottomY + vesselHeight / 2, 0]} castShadow renderOrder={38}>
        <cylinderGeometry args={[0.59, 0.56, vesselHeight, 96, 1, true]} />
        <meshPhysicalMaterial color="#e9fbff" transparent opacity={0.2} transmission={0.87} thickness={0.05} ior={1.46} roughness={0.015} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, bottomY + liquidHeight / 2, 0]} renderOrder={20}>
        <cylinderGeometry args={[0.535, 0.515, liquidHeight, 96]} />
        <meshPhysicalMaterial color="#54c7df" transparent opacity={0.42} transmission={0.32} roughness={0.045} thickness={0.18} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <LiquidSurface3D radius={0.535} y={surfaceY} disturbed={disturbed} />
      <mesh position={[0, bottomY + vesselHeight, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={42}>
        <torusGeometry args={[0.585, 0.028, 18, 96]} />
        <meshPhysicalMaterial color="#e8fbff" transparent opacity={0.68} transmission={0.55} roughness={0.02} depthWrite={false} />
      </mesh>
      {Array.from({ length: 16 }, (_, index) => index + 1).map((mark) => {
        const major = mark % 2 === 0;
        const y = bottomY + innerHeight * mark / 17;
        return (
          <mesh key={mark} position={[major ? 0.4 : 0.46, y, 0.43]}>
            <boxGeometry args={[major ? 0.27 : 0.15, 0.014, 0.014]} />
            <meshStandardMaterial color={major ? "#334155" : "#64748b"} roughness={0.7} />
          </mesh>
        );
      })}
      <WaterLevelIndicator3D levelCm={levelCm} maxLevelCm={maxLevelCm} bottomY={bottomY} innerHeight={innerHeight} />
      {solid && (
        <ImmersedSolid3D
          solid={solid}
          waterSurfaceY={surfaceY}
          vesselBottomY={bottomY}
          startedAt={startedAt}
          transferOrigin={transferOrigin}
        />
      )}
    </group>
  );
}

function OverflowStream3D({ y }: { y: number }) {
  const dropsRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!dropsRef.current) return;
    dropsRef.current.children.forEach((child, index) => {
      child.position.y = -((clock.elapsedTime * 1.7 + index * 0.28) % 0.82);
      child.scale.y = 1 + Math.sin(clock.elapsedTime * 10 + index) * 0.25;
    });
  });
  return (
    <group position={[1.5, y - 0.08, 0]}>
      <mesh position={[0, -0.27, 0]}>
        <cylinderGeometry args={[0.025, 0.036, 0.55, 14]} />
        <meshPhysicalMaterial color="#8eeaff" transparent opacity={0.8} transmission={0.3} roughness={0.04} />
      </mesh>
      <group ref={dropsRef}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} position={[0, -index * 0.25, 0]}>
            <sphereGeometry args={[0.045, 18, 12]} />
            <meshPhysicalMaterial color="#b7f3ff" transparent opacity={0.8} transmission={0.35} roughness={0.03} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CatchCylinder3D({ levelCm }: { levelCm: number }) {
  const maxLevel = 6;
  const vesselHeight = 1.35;
  const waterHeight = Math.max(0.015, Math.min(vesselHeight - 0.12, levelCm / maxLevel * (vesselHeight - 0.12)));
  return (
    <group position={[1.53, 0.08, 0]}>
      <mesh position={[0, vesselHeight / 2, 0]} renderOrder={40} castShadow>
        <cylinderGeometry args={[0.34, 0.31, vesselHeight, 64, 1, true]} />
        <meshPhysicalMaterial color="#eefcff" transparent opacity={0.22} transmission={0.86} thickness={0.04} ior={1.46} roughness={0.012} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {levelCm > 0.01 && (
        <>
          <mesh position={[0, waterHeight / 2 + 0.02, 0]} renderOrder={22}>
            <cylinderGeometry args={[0.305, 0.295, waterHeight, 64]} />
            <meshPhysicalMaterial color="#53cce4" transparent opacity={0.45} transmission={0.25} depthWrite={false} />
          </mesh>
          <LiquidSurface3D radius={0.305} y={waterHeight + 0.02} disturbed={true} />
        </>
      )}
      <mesh position={[0, vesselHeight, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={43}>
        <torusGeometry args={[0.335, 0.022, 14, 64]} />
        <meshPhysicalMaterial color="#e8fbff" transparent opacity={0.7} transmission={0.5} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 6]} />
        <meshStandardMaterial color="#8d989f" metalness={0.65} roughness={0.3} />
      </mesh>
    </group>
  );
}

function EurekaCan3D({
  levelCm,
  solid,
  startedAt,
  transferOrigin,
  catchLevelCm,
  overflowing,
  disturbed,
}: {
  levelCm: number;
  solid: SolidDef | null;
  startedAt: number;
  transferOrigin: TransferOrigin;
  catchLevelCm: number;
  overflowing: boolean;
  disturbed: boolean;
}) {
  const vesselHeight = 2.76;
  const bottomY = 0.14;
  const liquidHeight = Math.min(2.55, 2.55 * levelCm / EUREKA_LEVEL_CM);
  const surfaceY = bottomY + liquidHeight;
  return (
    <group position={[1.18, -0.53, 0.15]}>
      <RetortStand3D vesselRadius={0.82} />
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.98, 1.03, 0.13, 64]} />
        <meshStandardMaterial color="#39464d" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, bottomY + vesselHeight / 2, 0]} castShadow renderOrder={38}>
        <cylinderGeometry args={[0.82, 0.78, vesselHeight, 96, 1, true]} />
        <meshPhysicalMaterial color="#eafaff" transparent opacity={0.21} transmission={0.84} thickness={0.065} ior={1.46} roughness={0.02} clearcoat={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, bottomY + liquidHeight / 2, 0]} renderOrder={20}>
        <cylinderGeometry args={[0.755, 0.735, liquidHeight, 96]} />
        <meshPhysicalMaterial color="#52c9e0" transparent opacity={0.4} transmission={0.3} roughness={0.05} thickness={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <LiquidSurface3D radius={0.755} y={surfaceY} disturbed={disturbed} />
      <mesh position={[0, bottomY + vesselHeight, 0]} rotation={[Math.PI / 2, 0, 0]} renderOrder={42}>
        <torusGeometry args={[0.81, 0.035, 18, 96]} />
        <meshPhysicalMaterial color="#e8fbff" transparent opacity={0.68} transmission={0.55} roughness={0.02} depthWrite={false} />
      </mesh>
      <mesh position={[1.04, surfaceY - 0.035, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.11, 0.14, 0.7, 32, 1, true]} />
        <meshPhysicalMaterial color="#e7f9fc" transparent opacity={0.42} transmission={0.68} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[1.39, surfaceY - 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.095, 0.32, 30, 1, true]} />
        <meshPhysicalMaterial color="#e7f9fc" transparent opacity={0.42} transmission={0.68} roughness={0.02} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {overflowing && <OverflowStream3D y={surfaceY - 0.28} />}
      <CatchCylinder3D levelCm={catchLevelCm} />
      {solid && (
        <ImmersedSolid3D
          solid={solid}
          waterSurfaceY={surfaceY}
          vesselBottomY={bottomY}
          startedAt={startedAt}
          transferOrigin={transferOrigin}
        />
      )}
    </group>
  );
}

function DensityCameraControls() {
  const { camera, size } = useThree();
  const isMobile = size.width < 640 || size.width / Math.max(size.height, 1) < 0.82;
  const target = useMemo<[number, number, number]>(() => [0, isMobile ? 1.05 : 0.9, -0.35], [isMobile]);

  useEffect(() => {
    const position: [number, number, number] = isMobile ? [0.1, 2.5, 12.2] : [0.2, 2.25, 9.2];
    camera.position.set(...position);
    camera.near = 0.1;
    camera.far = 80;
    if (camera instanceof THREE.PerspectiveCamera) camera.fov = isMobile ? 56 : 40;
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, isMobile, target]);

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      target={target}
      minDistance={isMobile ? 9.1 : 7.8}
      maxDistance={13.5}
      minPolarAngle={1.08}
      maxPolarAngle={1.48}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
    />
  );
}

function DensityScene3D({
  levelCm,
  catchLevelCm,
  balanceReading,
  balanceSolid,
  cylinderSolid,
  entryStartedAt,
  transferOrigin,
  eurekaMode,
  overflowing,
  disturbed,
  benchSolids,
  balanceZoneRef,
  vesselZoneRef,
  mode = "learning",
  isMobile = false,
  interactables = [],
  activeTargetId = null,
  moveVectorRef,
  onTargetChange,
}: {
  levelCm: number;
  catchLevelCm: number;
  balanceReading: number;
  balanceSolid: SolidDef | null;
  cylinderSolid: SolidDef | null;
  entryStartedAt: number;
  transferOrigin: TransferOrigin;
  eurekaMode: boolean;
  overflowing: boolean;
  disturbed: boolean;
  benchSolids: SolidDef[];
  balanceZoneRef: React.RefObject<HTMLDivElement | null>;
  vesselZoneRef: React.RefObject<HTMLDivElement | null>;
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: MutableRefObject<{ x: number; y: number }>;
  onTargetChange?: (target: Interactable | null) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.65]}
      camera={{ position: [0.2, 2.25, 9.2], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <color attach="background" args={["#9ca9aa"]} />
      <fog attach="fog" args={["#aeb9b8", 16, 36]} />
      <ambientLight intensity={0.18} color="#dff6f3" />
      <hemisphereLight args={["#eaffff", "#59412f", 0.3]} />
      <directionalLight position={[-4.5, 7.5, 5.5]} intensity={0.85} color="#fff9e8" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-4} />
      <spotLight position={[4.2, 6.5, 3.8]} target-position={[1.2, 0.6, 0]} intensity={1.1} angle={0.52} penumbra={0.55} color="#e9fdff" castShadow />
      <DensityRoom3D />
      <DigitalBalance3D reading={balanceReading} solid={balanceSolid} />
      <SpecimenTray3D solids={benchSolids} />
      {eurekaMode ? (
        <EurekaCan3D levelCm={levelCm} solid={cylinderSolid} startedAt={entryStartedAt} transferOrigin={transferOrigin} catchLevelCm={catchLevelCm} overflowing={overflowing} disturbed={disturbed} />
      ) : (
        <MeasuringCylinder3D levelCm={levelCm} maxLevelCm={16} solid={cylinderSolid} startedAt={entryStartedAt} transferOrigin={transferOrigin} disturbed={disturbed} />
      )}
      <ContactShadows position={[0, -0.525, 0.15]} opacity={0.48} scale={8.5} blur={2.6} far={4.5} color="#1f1712" />

      {mode === "doing" &&
        interactables.map((item) => <InteractionHighlight key={item.id} position={item.position} active={item.id === activeTargetId} />)}

      {mode === "learning" ? (
        <>
          <ProjectedDropZones balanceZoneRef={balanceZoneRef} vesselZoneRef={vesselZoneRef} />
          <DensityCameraControls />
        </>
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
    </Canvas>
  );
}

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

// ---------------------------------------------------------------------------
// Full laboratory environment. All wall graphics are mounted into the scene
// instead of floating above the apparatus, so they keep a believable depth.
// ---------------------------------------------------------------------------

function DensityLaboratoryRoom() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Rear wall and perspective side walls */}
      <div className="absolute inset-x-[6%] bottom-[27%] top-[13%] border-x border-slate-400/40 bg-[#cbd2d1] shadow-[inset_0_20px_70px_rgba(15,23,42,0.13)]">
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage:
              "linear-gradient(rgba(71,85,105,.24) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,.24) 1px, transparent 1px)",
            backgroundSize: "92px 74px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[32%] border-t-4 border-[#67777b] bg-[#9eacab] shadow-[inset_0_9px_20px_rgba(15,23,42,.18)]" />
      </div>
      <div className="absolute bottom-[27%] left-0 top-[13%] w-[12%] bg-gradient-to-r from-[#758285] to-[#abb5b5] [clip-path:polygon(0_0,100%_8%,100%_100%,0_100%)]" />
      <div className="absolute bottom-[27%] right-0 top-[13%] w-[12%] bg-gradient-to-l from-[#748184] to-[#abb5b5] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_8%)]" />

      {/* Ceiling with recessed fluorescent luminaires */}
      <div className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#697477] to-[#aeb7b6] [clip-path:polygon(0_0,100%_0,94%_100%,6%_100%)] shadow-[0_12px_25px_rgba(15,23,42,.22)]" />
      {[28, 58].map((left) => (
        <div key={left} className="absolute top-[3.5%] h-[5%] w-[18%] -skew-x-6 rounded-sm border-4 border-[#c8cdca] bg-[#f4fff9] shadow-[0_0_22px_rgba(236,254,255,.78)]" style={{ left: `${left}%` }}>
          <div className="absolute inset-y-1 left-1/3 w-px bg-slate-400/50" />
          <div className="absolute inset-y-1 right-1/3 w-px bg-slate-400/50" />
        </div>
      ))}

      {/* Mounted teaching board */}
      <div className="absolute left-[31%] top-[16%] h-[14%] w-[38%] -rotate-[0.5deg] border-[7px] border-[#4c5557] bg-[#123f35] px-4 py-2 text-center shadow-[7px_10px_0_rgba(15,23,42,.16),inset_0_0_24px_rgba(0,0,0,.32)]">
        <div className="font-serif text-[clamp(12px,1.8vw,23px)] font-black tracking-[0.12em] text-[#f2f0da] [text-shadow:0_1px_0_rgba(255,255,255,.15)]">DENSITY OF SOLIDS</div>
        <div className="mx-auto mt-1 h-px w-4/5 bg-[#d9e9d4]/55" />
        <div className="mt-1 font-serif text-[clamp(7px,.9vw,12px)] italic text-[#d4e8dd]">density = mass ÷ volume&nbsp;&nbsp;·&nbsp;&nbsp;read a meniscus at eye level</div>
      </div>

      {/* Safety card mounted flush to the wall */}
      <div className="absolute left-[10%] top-[19%] w-[16%] rotate-[0.7deg] border border-slate-400 bg-[#f7f2df] p-2 text-[#263238] shadow-[4px_5px_0_rgba(15,23,42,.14)]">
        <div className="-mx-2 -mt-2 mb-1 bg-[#087b59] py-1 text-center text-[clamp(7px,1vw,12px)] font-black uppercase tracking-wider text-white">Laboratory safety</div>
        <div className="space-y-0.5 text-[clamp(5px,.65vw,8px)] font-semibold leading-tight">
          <div>1. Dry the solid before weighing</div>
          <div>2. Lower objects gently</div>
          <div>3. Wipe spills immediately</div>
          <div>4. Read scales at eye level</div>
        </div>
      </div>

      {/* Window and reagent shelf */}
      <div className="absolute right-[8%] top-[17%] h-[18%] w-[17%] border-[7px] border-[#5c686b] bg-gradient-to-b from-[#82c5d1] to-[#d9eff0] shadow-[5px_7px_0_rgba(15,23,42,.16)]">
        <div className="absolute inset-y-0 left-1/2 w-[5px] -translate-x-1/2 bg-[#68777a]" />
        <div className="absolute inset-x-0 top-1/2 h-[5px] -translate-y-1/2 bg-[#68777a]" />
        <div className="absolute bottom-0 left-[8%] h-[32%] w-[84%] bg-[linear-gradient(145deg,transparent_35%,rgba(70,111,95,.6)_36%_48%,transparent_49%),linear-gradient(35deg,transparent_42%,rgba(70,111,95,.5)_43%_55%,transparent_56%)]" />
      </div>
      <div className="absolute right-[11%] top-[42%] h-2 w-[22%] rounded-sm bg-[#465256] shadow-[0_5px_4px_rgba(15,23,42,.28)]" />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="absolute top-[37%] h-[5.5%] w-[2.2%] rounded-t-md border border-white/45 shadow-sm" style={{ right: `${12.8 + i * 4.5}%`, background: ["#d0a73f", "#55bba6", "#9782bd", "#cf725f"][i] }}>
          <div className="absolute -top-[12%] left-1/2 h-[16%] w-2/3 -translate-x-1/2 rounded-t-sm bg-slate-800" />
        </div>
      ))}

      {/* Rear service counter, intentionally set well behind the front bench */}
      <div className="absolute inset-x-[6%] bottom-[24.2%] h-[5%] bg-gradient-to-b from-[#8a5338] to-[#55301f] shadow-[0_6px_12px_rgba(15,23,42,.32)]" />

      {/* Floor visible between the two benches */}
      <div className="absolute inset-x-0 bottom-0 h-[28%] bg-[#87908e] [clip-path:polygon(6%_0,94%_0,100%_100%,0_100%)]">
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: "linear-gradient(90deg, transparent 49%, #53605f 50%, transparent 51%), linear-gradient(transparent 49%, #53605f 50%, transparent 51%)", backgroundSize: "160px 70px" }} />
      </div>

      {/* Front hardwood laboratory bench and cupboards */}
      <div className="absolute inset-x-[-4%] bottom-[8%] h-[22%] bg-gradient-to-b from-[#a9683e] via-[#815035] to-[#55321f] shadow-[0_-8px_20px_rgba(15,23,42,.28),inset_0_3px_0_rgba(255,219,168,.44)] [transform:perspective(700px)_rotateX(3deg)]">
        <div className="absolute inset-x-0 top-[2px] h-px bg-[#e7b07b]/60" />
        <div className="absolute left-[8%] top-[5%] h-[2px] w-[34%] bg-[#4d2b1c]/60" />
        <div className="absolute right-[11%] top-[14%] h-[2px] w-[27%] bg-[#4d2b1c]/55" />
      </div>
      <div className="absolute inset-x-[2%] bottom-0 h-[10%] bg-[#485351] shadow-[inset_0_4px_10px_rgba(15,23,42,.45)]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="absolute bottom-1 top-2 border border-[#2d3736] bg-gradient-to-b from-[#65716e] to-[#46504e] shadow-[inset_0_1px_0_rgba(255,255,255,.13)]" style={{ left: `${i * 25}%`, width: "25%" }}>
            <div className="absolute left-1/2 top-2 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#1f2928]" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface DensityLabSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const DENSITY_NARRATION = {
  intro: "/sounds/density-irregular/intro.mp3",
  tinasheIntro: "/sounds/density-irregular/tinashe_intro.mp3",
  complete: "/sounds/density-irregular/experiment_complete.mp3",
  steps: [
    "/sounds/density-irregular/step1_setup.mp3",
    "/sounds/density-irregular/step2_measure_mass.mp3",
    "/sounds/density-irregular/step3_first_volume.mp3",
    "/sounds/density-irregular/step4_lower_solid.mp3",
    "/sounds/density-irregular/step5_second_volume.mp3",
    "/sounds/density-irregular/step6_calculate.mp3",
  ],
} as const;

const DENSITY_EXPLANATIONS: readonly NarrationClip[] = [
  { label: "Introduction", src: DENSITY_NARRATION.intro },
  { label: "Step 1: What is on the bench", src: DENSITY_NARRATION.steps[0] },
  { label: "Step 2: Measure the mass", src: DENSITY_NARRATION.steps[1] },
  { label: "Step 3: First water reading", src: DENSITY_NARRATION.steps[2] },
  { label: "Step 4: Lower the solid in", src: DENSITY_NARRATION.steps[3] },
  { label: "Step 5: Second water reading", src: DENSITY_NARRATION.steps[4] },
  { label: "Step 6: Calculate the density", src: DENSITY_NARRATION.steps[5] },
];

export default function DensityLabSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: DensityLabSimProps) {
  const [solids, setSolids] = useState<SolidDef[]>(DEFAULT_SOLIDS);
  const [location, setLocation] = useState<Record<string, Location>>({
    copper: "palette",
    aluminium: "palette",
    granite: "palette",
    oak: "palette",
  });
  const [wetUntil, setWetUntil] = useState<Record<string, number>>({});
  const [balanceReading, setBalanceReading] = useState(0);
  const [eurekaMode, setEurekaMode] = useState(false);
  const [showCreator, setShowCreator] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [measuredMassById, setMeasuredMassById] = useState<Record<string, number>>({});
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  // --- Doing Mode: free-roam + physical station interactions -----------
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

  const cylinderIdsRef = useRef<Set<string>>(new Set());
  const entryStartedAtRef = useRef<Record<string, number>>({});
  const entryOriginRef = useRef<Record<string, TransferOrigin>>({});
  const displacementTimersRef = useRef<Record<string, number>>({});
  const bubblesRef = useRef<{ id: number; x: number; y: number; born: number }[]>([]);
  const bubbleSeq = useRef(0);

  const wave = useWaveSurface();
  const levelRef = useRef(BASE_LEVEL_CM);
  const targetLevelRef = useRef(BASE_LEVEL_CM);
  const levelVelRef = useRef(0);
  const catchLevelRef = useRef(0);
  const catchTargetRef = useRef(0);
  const catchVelRef = useRef(0);

  const draggingRef = useRef<{ id: string; startX: number; startY: number } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const balanceZoneRef = useRef<HTMLDivElement>(null);
  const cylinderZoneRef = useRef<HTMLDivElement>(null);

  const cylinderSolids = solids.filter((s) => cylinderIdsRef.current.has(s.id));
  const cylinderSolid = cylinderSolids.length > 0 ? cylinderSolids[cylinderSolids.length - 1] : null;

  useEffect(
    () => () => {
      Object.values(displacementTimersRef.current).forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  // ---- Main physics/animation loop -----------------------------------
  useEffect(() => {
    let raf: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      wave.step(dt);

      const springStiff = 360;
      const springDamp = 40;
      const lAccel = (targetLevelRef.current - levelRef.current) * springStiff - levelVelRef.current * springDamp;
      levelVelRef.current += lAccel * dt;
      levelRef.current += levelVelRef.current * dt;
      if (Math.abs(levelRef.current - targetLevelRef.current) < 0.05 && Math.abs(levelVelRef.current) < 0.25) {
        levelRef.current = targetLevelRef.current;
        levelVelRef.current = 0;
      }

      const cAccel = (catchTargetRef.current - catchLevelRef.current) * springStiff - catchVelRef.current * springDamp;
      catchVelRef.current += cAccel * dt;
      catchLevelRef.current += catchVelRef.current * dt;
      if (Math.abs(catchLevelRef.current - catchTargetRef.current) < 0.05 && Math.abs(catchVelRef.current) < 0.25) {
        catchLevelRef.current = catchTargetRef.current;
        catchVelRef.current = 0;
      }

      bubblesRef.current = bubblesRef.current
        .map((b) => ({ ...b, y: b.y - 40 * dt }))
        .filter((b) => now - b.born < 1300);

      forceTick((t) => (t + 1) % 1000000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transferInProgress = !!cylinderSolid &&
    performance.now() - (entryStartedAtRef.current[cylinderSolid.id] ?? 0) < DENSITY_TRANSFER_DURATION_MS;
  const settled =
    !transferInProgress &&
    Math.abs(levelRef.current - targetLevelRef.current) < 0.18 &&
    Math.abs(levelVelRef.current) < 0.6 &&
    Math.abs(catchLevelRef.current - catchTargetRef.current) < 0.18 &&
    Math.abs(catchVelRef.current) < 0.6 &&
    wave.heightsRef.current.every((h) => Math.abs(h) < 0.65);

  const measuredVolumeCm3 = Math.max(
    0,
    eurekaMode
      ? catchLevelRef.current * CATCH_AREA_CM2
      : (levelRef.current - BASE_LEVEL_CM) * CYL_AREA_CM2,
  );
  const paletteSolids = solids.filter((s) => location[s.id] === "palette");
  const balanceSolid = solids.find((s) => location[s.id] === "balance") ?? null;
  const activeMassG = cylinderSolid
    ? measuredMassById[cylinderSolid.id] ?? cylinderSolid.massG
    : balanceSolid
      ? balanceReading
      : null;
  const activeDensity = cylinderSolid && activeMassG !== null ? activeMassG / Math.max(0.01, measuredVolumeCm3) : null;

  // ---- Drag handling ----------------------------------------------------
  const beginDrag = useCallback((id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    draggingRef.current = { id, startX: e.clientX, startY: e.clientY };
    setDragId(id);
    setDragPos({ x: e.clientX, y: e.clientY });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const moveDrag = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }, []);

  const placeInCylinder = useCallback(
    (solid: SolidDef) => {
      const previousIds = Array.from(cylinderIdsRef.current).filter((id) => id !== solid.id);
      previousIds.forEach((id) => {
        const timer = displacementTimersRef.current[id];
        if (timer !== undefined) window.clearTimeout(timer);
        delete displacementTimersRef.current[id];
        delete entryOriginRef.current[id];
      });
      if (previousIds.length > 0) {
        setLocation((prev) => {
          const next = { ...prev };
          previousIds.forEach((id) => {
            next[id] = "palette";
          });
          return next;
        });
      }
      cylinderIdsRef.current.clear();
      targetLevelRef.current = eurekaMode ? EUREKA_LEVEL_CM : BASE_LEVEL_CM;
      catchTargetRef.current = 0;
      levelVelRef.current = 0;
      catchVelRef.current = 0;

      cylinderIdsRef.current.add(solid.id);
      entryStartedAtRef.current[solid.id] = performance.now();
      // The retort-stand immersion cradle holds every specimen completely
      // below the surface. Its own displacement is established as the zero,
      // so the subsequent rise/overflow is exactly the specimen's volume.
      const submergedVolume = solid.volumeCm3;

      const existingTimer = displacementTimersRef.current[solid.id];
      if (existingTimer !== undefined) window.clearTimeout(existingTimer);
      displacementTimersRef.current[solid.id] = window.setTimeout(() => {
        delete displacementTimersRef.current[solid.id];
        if (!cylinderIdsRef.current.has(solid.id)) return;

        if (eurekaMode) {
          catchTargetRef.current = submergedVolume / CATCH_AREA_CM2;
        } else {
          targetLevelRef.current = BASE_LEVEL_CM + submergedVolume / CYL_AREA_CM2;
        }

        // Splash size follows displaced volume and begins when the descending
        // specimen reaches the surface, not while it is still over the scale.
        wave.perturb(0.35 + Math.min(1.8, submergedVolume / 9));
        const pxPerCm = (210 - 22) / (16 + 1.5);
        const waterSurfaceY = 210 - levelRef.current * pxPerCm;
        const now = performance.now();
        const splashCount = 3 + Math.round(Math.min(5, submergedVolume / 4));
        for (let i = 0; i < splashCount; i++) {
          bubbleSeq.current += 1;
          bubblesRef.current.push({
            id: bubbleSeq.current,
            x: (Math.random() - 0.5) * 34,
            y: waterSurfaceY - 4 + Math.random() * 10,
            born: now + i * 40,
          });
        }

        if (solid.kind === "irregular-rock" || solid.kind === "custom") {
          for (let i = 0; i < 4; i++) {
            bubbleSeq.current += 1;
            bubblesRef.current.push({
              id: bubbleSeq.current,
              x: (Math.random() - 0.5) * 20,
              y: 200 + Math.random() * 20,
              born: now + 150 + i * 120,
            });
          }
        }
      }, DISPLACEMENT_START_MS);
    },
    [eurekaMode, wave]
  );

  // Removing a specimen from the vessel: shared by drag-release (Learning
  // Mode) and the "remove solid" Doing Mode station so there is exactly one
  // implementation of what happens when a specimen leaves the water.
  const removeFromCylinder = useCallback(
    (solid: SolidDef) => {
      cylinderIdsRef.current.delete(solid.id);
      const displacementTimer = displacementTimersRef.current[solid.id];
      if (displacementTimer !== undefined) window.clearTimeout(displacementTimer);
      delete displacementTimersRef.current[solid.id];
      delete entryStartedAtRef.current[solid.id];
      delete entryOriginRef.current[solid.id];
      const submergedVolume = solid.volumeCm3;
      if (eurekaMode) {
        // Real eureka cans don't un-spill: water that already overflowed into
        // the catch cylinder stays there even after the solid comes back out.
      } else {
        targetLevelRef.current = Math.max(BASE_LEVEL_CM, targetLevelRef.current - submergedVolume / CYL_AREA_CM2);
      }
      setWetUntil((prev) => ({ ...prev, [solid.id]: performance.now() + 5000 }));

      const pxPerCm = (210 - 22) / (16 + 1.5);
      const waterSurfaceY = 210 - levelRef.current * pxPerCm;
      const now = performance.now();
      const dropletCount = 2 + Math.round(Math.min(4, submergedVolume / 5));
      for (let i = 0; i < dropletCount; i++) {
        bubbleSeq.current += 1;
        bubblesRef.current.push({
          id: bubbleSeq.current,
          x: (Math.random() - 0.5) * 26,
          y: waterSurfaceY - 4 + Math.random() * 10,
          born: now + i * 50,
        });
      }
      wave.perturb(0.22 + Math.min(0.85, submergedVolume / 14));
    },
    [eurekaMode, wave]
  );

  // Moving a specimen onto the balance: shared by drag-release and the
  // Doing Mode "place on balance" station.
  const moveSolidToBalance = useCallback(
    (solid: SolidDef) => {
      const wasInCylinder = cylinderIdsRef.current.has(solid.id);
      const previousBalanceId = Object.keys(location).find((id) => id !== solid.id && location[id] === "balance");
      setLocation((prev) => {
        const next: Record<string, Location> = { ...prev, [solid.id]: "balance" };
        if (previousBalanceId) next[previousBalanceId] = "palette";
        return next;
      });
      if (wasInCylinder) removeFromCylinder(solid);
      const settleStart = performance.now();
      const settleDuration = 650;
      const settle = () => {
        const t = Math.min(1, (performance.now() - settleStart) / settleDuration);
        const damped = Math.exp(-6 * t) * Math.cos(t * 18) * 0.5;
        setBalanceReading(Number((solid.massG * (1 + damped * (1 - t))).toFixed(2)));
        if (t < 1) requestAnimationFrame(settle);
        else {
          setBalanceReading(solid.massG);
          setMeasuredMassById((prev) => ({ ...prev, [solid.id]: solid.massG }));
        }
      };
      settle();
    },
    [location, removeFromCylinder]
  );

  // Moving a specimen into the vessel: shared by drag-release and the
  // Doing Mode "lower into vessel" station.
  const moveSolidToCylinder = useCallback(
    (solid: SolidDef) => {
      const wasInCylinder = cylinderIdsRef.current.has(solid.id);
      const wasOnBalance = location[solid.id] === "balance";
      setLocation((prev) => ({ ...prev, [solid.id]: "cylinder" }));
      if (!wasInCylinder) {
        entryOriginRef.current[solid.id] = wasOnBalance ? "balance" : "tray";
        setMeasuredMassById((prev) => ({ ...prev, [solid.id]: prev[solid.id] ?? solid.massG }));
        placeInCylinder(solid);
      }
      if (wasOnBalance) setBalanceReading(0);
    },
    [location, placeInCylinder]
  );

  // Returning a specimen to the palette (tray): shared by drag-release and
  // the Doing Mode "return solid" station.
  const moveSolidToPalette = useCallback(
    (solid: SolidDef) => {
      const wasInCylinder = cylinderIdsRef.current.has(solid.id);
      const wasOnBalance = location[solid.id] === "balance";
      setLocation((prev) => ({ ...prev, [solid.id]: "palette" }));
      if (wasInCylinder) removeFromCylinder(solid);
      if (wasOnBalance) setBalanceReading(0);
    },
    [location, removeFromCylinder]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      const drag = draggingRef.current;
      draggingRef.current = null;
      setDragId(null);
      setDragPos(null);
      if (!drag) return;
      const solid = solids.find((s) => s.id === drag.id);
      if (!solid) return;

      const px = e.clientX;
      const py = e.clientY;
      const balanceRect = balanceZoneRef.current?.getBoundingClientRect();
      const cylinderRect = cylinderZoneRef.current?.getBoundingClientRect();

      const inRect = (r?: DOMRect) => !!r && px >= r.left && px <= r.right && py >= r.top && py <= r.bottom;

      if (inRect(balanceRect)) {
        moveSolidToBalance(solid);
      } else if (inRect(cylinderRect)) {
        moveSolidToCylinder(solid);
      } else {
        moveSolidToPalette(solid);
      }
    },
    [solids, moveSolidToBalance, moveSolidToCylinder, moveSolidToPalette]
  );

  const handleRecordReading = useCallback(() => {
    if (!cylinderSolid) return;
    const massG = measuredMassById[cylinderSolid.id] ?? cylinderSolid.massG;
    const density = massG / Math.max(0.01, measuredVolumeCm3);
    setReadings((prev) => [
      ...prev,
      {
        solidName: cylinderSolid.name,
        massG,
        measuredVolumeCm3,
        measuredDensity: density,
        trueDensity: cylinderSolid.massG / cylinderSolid.volumeCm3,
      },
    ]);
  }, [cylinderSolid, measuredMassById, measuredVolumeCm3]);

  const handleResetCylinder = useCallback(() => {
    const now = performance.now();
    cylinderIdsRef.current.forEach((id) => {
      setLocation((prev) => ({ ...prev, [id]: "palette" }));
      setWetUntil((prev) => ({ ...prev, [id]: now + 5000 }));
    });
    cylinderIdsRef.current.clear();
    entryStartedAtRef.current = {};
    entryOriginRef.current = {};
    Object.values(displacementTimersRef.current).forEach((timer) => window.clearTimeout(timer));
    displacementTimersRef.current = {};
    const resetLevel = eurekaMode ? EUREKA_LEVEL_CM : BASE_LEVEL_CM;
    levelRef.current = resetLevel;
    targetLevelRef.current = resetLevel;
    catchTargetRef.current = 0;
    levelVelRef.current = 0;
    catchVelRef.current = 0;
    wave.perturb(0.4);
  }, [eurekaMode, wave]);


  // --- Narrated walkthrough ("Show me"): the irregular-solid method ------
  const narrator = useExperimentNarrator();
  const [guideActive, setGuideActive] = useState(false);
  const demoTimersRef = useRef<number[]>([]);
  const clearDemoTimers = useCallback(() => {
    demoTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    demoTimersRef.current = [];
  }, []);
  const scheduleDemo = useCallback((action: () => void, delay: number) => {
    demoTimersRef.current.push(window.setTimeout(action, delay));
  }, []);
  useEffect(() => clearDemoTimers, [clearDemoTimers]);

  /** The jagged granite — the solid whose volume can only be found by displacement. */
  const graniteSolid = solids.find((each) => each.kind === "irregular-rock") ?? solids[0];

  const walkthroughSteps: WalkthroughStep[] = [
    {
      label: "What is on the bench",
      src: DENSITY_NARRATION.steps[0],
      durationMs: 12000,
      onEnter: () => {
        clearDemoTimers();
        setEurekaMode(false);
        setReadings([]);
        setLocation((prev) => {
          const next: Record<string, Location> = { ...prev };
          Object.keys(next).forEach((id) => {
            next[id] = "palette";
          });
          return next;
        });
        setBalanceReading(0);
      },
    },
    {
      label: "Measure the mass",
      src: DENSITY_NARRATION.steps[1],
      durationMs: 13000,
      onEnter: () => {
        if (graniteSolid) scheduleDemo(() => moveSolidToBalance(graniteSolid), 2500);
      },
    },
    {
      label: "First water reading",
      src: DENSITY_NARRATION.steps[2],
      durationMs: 12000,
      onEnter: () => {
        if (graniteSolid) scheduleDemo(() => moveSolidToPalette(graniteSolid), 1500);
      },
    },
    {
      label: "Lower the solid in",
      src: DENSITY_NARRATION.steps[3],
      durationMs: 13000,
      onEnter: () => {
        if (graniteSolid) scheduleDemo(() => moveSolidToCylinder(graniteSolid), 2500);
      },
    },
    {
      label: "Second water reading",
      src: DENSITY_NARRATION.steps[4],
      durationMs: 13000,
    },
    {
      label: "Calculate the density",
      src: DENSITY_NARRATION.steps[5],
      durationMs: 16000,
      onEnter: () => {
        scheduleDemo(() => handleRecordReading(), 3500);
      },
    },
  ];

  const walkthrough = useNarratedWalkthrough({
    narrator,
    intro: DENSITY_NARRATION.intro,
    complete: DENSITY_NARRATION.complete,
    steps: walkthroughSteps,
    onStart: () => {
      clearDemoTimers();
      setGuideActive(false);
      setMode("learning");
      setShowTutorial(false);
    },
    onStop: () => {
      clearDemoTimers();
      handleResetCylinder();
      setReadings([]);
      setBalanceReading(0);
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
    narrator.play(DENSITY_NARRATION.tinasheIntro);
  }, [guideActive, narrator.play, narrator.stop, walkthrough.active]);
  const handleEurekaModeChange = useCallback(
    (enabled: boolean) => {
      handleResetCylinder();
      const resetLevel = enabled ? EUREKA_LEVEL_CM : BASE_LEVEL_CM;
      levelRef.current = resetLevel;
      targetLevelRef.current = resetLevel;
      levelVelRef.current = 0;
      catchLevelRef.current = 0;
      catchTargetRef.current = 0;
      catchVelRef.current = 0;
      setEurekaMode(enabled);
    },
    [handleResetCylinder]
  );

  const handleCreateRock = useCallback((solid: SolidDef) => {
    setSolids((prev) => [...prev, solid]);
    setLocation((prev) => ({ ...prev, [solid.id]: "palette" }));
  }, []);

  // Doing Mode's world-space stations: same handlers the drag-and-drop
  // interface already calls, just reached by walking up and pressing/holding
  // instead of dragging a chip. Simplification: rather than free-picking any
  // palette solid, walking up to the tray always offers the next available
  // specimen (shown by name in the prompt) — picking a *specific* one still
  // works fine in Learning Mode's drag interface.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const list: Interactable[] = [];
    const nextPaletteSolid = solids.find((s) => location[s.id] === "palette") ?? null;

    if (nextPaletteSolid) {
      list.push({
        id: "tray-to-balance",
        position: TRAY_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: `Place ${nextPaletteSolid.name} on balance`,
        onActivate: () => moveSolidToBalance(nextPaletteSolid),
      });
    }

    if (balanceSolid) {
      list.push({
        id: "balance-to-vessel",
        position: BALANCE_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: eurekaMode ? `Lower ${balanceSolid.name} into eureka can` : `Lower ${balanceSolid.name} into cylinder`,
        onActivate: () => moveSolidToCylinder(balanceSolid),
      });
    }

    if (cylinderSolid) {
      list.push({
        id: "vessel-remove",
        position: VESSEL_STATION_POS,
        radius: INTERACTION_RADIUS,
        label: `Remove ${cylinderSolid.name}`,
        onActivate: () => moveSolidToPalette(cylinderSolid),
      });
      list.push({
        id: "vessel-record",
        position: VESSEL_STATION_POS.clone().add(new THREE.Vector3(0.6, 0, 0.5)),
        radius: INTERACTION_RADIUS,
        label: settled ? "Record reading" : "Wait for water to settle",
        disabled: !settled || measuredVolumeCm3 <= 0,
        onActivate: handleRecordReading,
      });
    }

    list.push({
      id: "vessel-empty",
      position: VESSEL_STATION_POS.clone().add(new THREE.Vector3(-0.6, 0, -0.5)),
      radius: INTERACTION_RADIUS,
      label: "Empty apparatus",
      disabled: !cylinderSolid,
      onActivate: handleResetCylinder,
    });

    list.push({
      id: "eureka-toggle",
      position: VESSEL_STATION_POS.clone().add(new THREE.Vector3(1.4, 0, -0.9)),
      radius: INTERACTION_RADIUS,
      label: eurekaMode ? "Switch to measuring cylinder" : "Switch to eureka can",
      onActivate: () => handleEurekaModeChange(!eurekaMode),
    });

    return list;
  }, [
    mode,
    solids,
    location,
    balanceSolid,
    cylinderSolid,
    eurekaMode,
    settled,
    measuredVolumeCm3,
    moveSolidToBalance,
    moveSolidToCylinder,
    moveSolidToPalette,
    handleRecordReading,
    handleResetCylinder,
    handleEurekaModeChange,
  ]);

  const wetOpacityFor = (id: string) => {
    const until = wetUntil[id];
    if (!until) return 0;
    const remain = until - performance.now();
    return Math.max(0, Math.min(1, remain / 5000)) * 0.9;
  };

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-slate-100 sm:flex-row"
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
    >
      <style>{`
        @keyframes densityPanelSweep {
          0% { background-position: 0% 50%; filter: brightness(1); }
          50% { background-position: 100% 50%; filter: brightness(1.16); }
          100% { background-position: 0% 50%; filter: brightness(1); }
        }
        .density-glow-line { background-size: 220% 100%; animation: densityPanelSweep 2.4s ease-in-out infinite; }
      `}</style>

      <div data-experiment-tour="density-scene" className="relative h-full min-h-0 w-full shrink-0 overflow-hidden bg-[#9ca9aa] sm:flex-1">
        <DensityScene3D
          levelCm={levelRef.current}
          catchLevelCm={catchLevelRef.current}
          balanceReading={balanceReading}
          balanceSolid={balanceSolid}
          cylinderSolid={cylinderSolid}
          entryStartedAt={cylinderSolid ? entryStartedAtRef.current[cylinderSolid.id] ?? performance.now() : 0}
          transferOrigin={cylinderSolid ? entryOriginRef.current[cylinderSolid.id] ?? "tray" : "tray"}
          eurekaMode={eurekaMode}
          overflowing={eurekaMode && catchTargetRef.current - catchLevelRef.current > 0.025}
          disturbed={!settled}
          benchSolids={paletteSolids}
          balanceZoneRef={balanceZoneRef}
          vesselZoneRef={cylinderZoneRef}
          mode={mode}
          isMobile={isMobileViewport}
          interactables={interactables}
          activeTargetId={activeInteractableMeta?.id ?? null}
          moveVectorRef={moveVectorRef}
          onTargetChange={handleTargetChange}
        />

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={setMode}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-cyan-100/80 to-transparent" />
        <div
          data-experiment-tour="density-hud"
          className={`absolute left-3 top-14 z-30 flex items-center gap-2 rounded-xl border border-white/15 bg-slate-950/78 px-2.5 py-2 text-xs text-slate-200 shadow-2xl backdrop-blur-md sm:top-3 sm:text-sm ${
            mode === "doing" ? "right-32 sm:right-36" : ""
          }`}
        >
          <div className="grid min-w-0 flex-1 grid-cols-[auto_auto] gap-x-2.5 gap-y-0.5 sm:flex-none sm:gap-y-1">
            <span className="text-slate-400">mass</span>
            <span className="font-bold text-emerald-200">{activeMassG !== null ? `${activeMassG.toFixed(2)} g` : "--"}</span>
            <span className="text-slate-400">volume</span>
            <span className="font-bold text-emerald-200">{cylinderSolid ? `${measuredVolumeCm3.toFixed(1)} cm³` : "--"}</span>
            <span className="text-slate-400">density</span>
            <span className="font-bold text-orange-200">
              {activeDensity !== null ? `${activeDensity.toFixed(2)} g/cm³` : "--"}
            </span>
          </div>
          {mode === "doing" && (
            <button
              type="button"
              onClick={handleResetCylinder}
              className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-200 transition-colors hover:border-orange-300/40 hover:bg-orange-400/10 hover:text-orange-100"
            >
              Reset
            </button>
          )}
        </div>

        <ExperimentNarrationDock
          narrator={narrator}
          clips={DENSITY_EXPLANATIONS}
          walkthrough={walkthrough}
          guideActive={guideActive}
          onToggleGuide={toggleGuide}
          showMeLabel="Watch the narrated displacement experiment run by itself"
          menuLabel="Density explanations"
          className="absolute right-3 top-14 z-40 flex items-center gap-2 sm:top-3 sm:right-[10.5rem]"
        />
        <WalkthroughStatusPill walkthrough={walkthrough} />

        <HeaderModeToggle mode={mode} onChange={setMode} />

        {mode === "learning" && (
          <>
            {/* Invisible interaction volumes follow the physical apparatus. They
                retain mouse/touch dragging while the visible scene stays 3D. */}
            <div
              ref={balanceZoneRef}
              className={`absolute z-20 ${balanceSolid ? "pointer-events-auto cursor-grab touch-none active:cursor-grabbing" : "pointer-events-none"}`}
              onPointerDown={balanceSolid ? (event) => beginDrag(balanceSolid.id, event) : undefined}
              aria-label="Digital balance drop zone"
            />
            <div
              ref={cylinderZoneRef}
              className={`absolute z-20 ${cylinderSolid ? "pointer-events-auto cursor-grab touch-none active:cursor-grabbing" : "pointer-events-none"}`}
              onPointerDown={cylinderSolid ? (event) => beginDrag(cylinderSolid.id, event) : undefined}
              aria-label={eurekaMode ? "Eureka can drop zone" : "Measuring cylinder drop zone"}
            />

            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-slate-950/64 px-3 py-1 text-center text-[10px] font-semibold tracking-wide text-slate-200 shadow-lg backdrop-blur">
              Drag a dry solid to the balance, then lower it into the {eurekaMode ? "Eureka vessel" : "measuring cylinder"} · drag the room side-to-side to inspect
            </div>
          </>
        )}

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
                      <span className="text-xl leading-none">👆</span>
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

      <div
        data-experiment-tour="density-controls"
        className={`experiment-desktop-panel experiment-violet-panel overflow-hidden border-t border-white/10 bg-slate-950/94 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/12 backdrop-blur-2xl sm:relative sm:z-20 sm:w-[34%] sm:min-w-[340px] sm:max-w-[420px] sm:border-l sm:border-t-0 ${
          mode === "doing" ? "hidden" : "hidden sm:block"
        }`}
      >
        {mode !== "doing" && null}
        <div className="density-glow-line pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/75 to-transparent" />
        <div className="relative grid h-full grid-rows-[auto_auto_auto_auto_auto_auto_minmax(0,1fr)] gap-2.5 overflow-hidden p-3">
          <div>
            <h2 className="text-base font-black tracking-tight sm:text-lg">Controls</h2>
            <p className="text-xs font-medium text-slate-400">Density practical</p>
          </div>

          <div data-experiment-tour="density-solids" className="rounded-xl border border-white/10 bg-white/[0.045] p-2.5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-slate-200">Solids</div>
              <button
                onClick={() => setShowCreator(true)}
                className="rounded-lg bg-orange-500 px-2.5 py-1 text-xs font-black text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400"
              >
                Add rock
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {paletteSolids.map((s) => (
                <div
                  key={s.id}
                  onPointerDown={(e) => beginDrag(s.id, e)}
                  className="grid h-14 cursor-grab touch-none grid-cols-[46px_minmax(0,1fr)] items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300/30 hover:bg-white/[0.07] active:cursor-grabbing"
                  style={{ opacity: dragId === s.id ? 0.25 : 1 }}
                >
                  <div className="grid h-11 w-11 place-items-center overflow-hidden">
                    <div className="origin-center scale-[0.7]">
                      <SolidGlyph solid={s} wetOpacity={wetOpacityFor(s.id)} />
                    </div>
                  </div>
                  <div className="min-w-0 leading-none">
                    <div className="truncate text-[11px] font-bold leading-tight text-slate-200">{s.name}</div>
                    <div className="mt-1 text-[10px] leading-none text-slate-500">{s.massG.toFixed(1)} g</div>
                  </div>
                </div>
              ))}
              {paletteSolids.length === 0 && (
                <div className="col-span-2 rounded-xl border border-dashed border-slate-700 p-3 text-xs text-slate-500">
                  Empty the apparatus to return solids here.
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-slate-200">
            <span>Eureka can mode</span>
            <input
              type="checkbox"
              checked={eurekaMode}
              onChange={(e) => handleEurekaModeChange(e.target.checked)}
              className="h-5 w-5 accent-orange-500"
            />
          </label>

          <div className="flex gap-2">
            <button
              data-experiment-tour="density-record"
              onClick={handleRecordReading}
              disabled={!cylinderSolid || !settled || measuredVolumeCm3 <= 0}
              className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-black text-white shadow-lg shadow-orange-950/35 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 disabled:translate-y-0 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {!cylinderSolid ? "Drop solid" : settled ? "Record reading" : "Settling"}
            </button>
            <button
              onClick={handleResetCylinder}
              className="rounded-xl bg-white/8 px-4 py-2.5 text-sm font-black text-slate-100 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12"
            >
              Empty
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
            <div className="rounded-xl border border-white/10 bg-white/[0.045] px-2 py-2">
              <div className="text-base font-black text-emerald-200">{activeMassG !== null ? activeMassG.toFixed(1) : "--"}</div>
              <div>Mass g</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.045] px-2 py-2">
              <div className="text-base font-black text-emerald-200">{cylinderSolid ? measuredVolumeCm3.toFixed(1) : "--"}</div>
              <div>cm³</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.045] px-2 py-2">
              <div className="text-base font-black text-emerald-200">
                {activeDensity !== null ? activeDensity.toFixed(2) : "--"}
              </div>
              <div>g/cm³</div>
            </div>
          </div>

          <MeniscusZoom
            levelCm={eurekaMode ? catchLevelRef.current : levelRef.current}
            areaCm2={eurekaMode ? CATCH_AREA_CM2 : CYL_AREA_CM2}
          />

          <div className="min-h-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.045] p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-200">Recorded trials</div>
              {readings.length > 0 && (
                <button onClick={() => setReadings([])} className="text-[11px] font-bold text-orange-200 hover:text-orange-100">
                  Clear
                </button>
              )}
            </div>
            {readings.length === 0 ? (
              <div className="text-xs text-slate-500">No readings yet.</div>
            ) : (
              <div className="max-h-full overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-400">
                      <th className="pr-2 py-1">Solid</th>
                      <th className="pr-2 py-1">m</th>
                      <th className="pr-2 py-1">V</th>
                      <th className="py-1">ρ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readings.map((r, i) => {
                      const match = closestMaterial(r.measuredDensity);
                      return (
                        <tr key={i} className="border-t border-slate-800 align-top">
                          <td className="pr-2 py-1">
                            <div className="font-semibold text-slate-200">{r.solidName}</div>
                            <div className="text-[10px] text-slate-500">{match.name}</div>
                          </td>
                          <td className="pr-2 py-1">{r.massG.toFixed(1)}</td>
                          <td className="pr-2 py-1">{r.measuredVolumeCm3.toFixed(1)}</td>
                          <td className="py-1 font-bold text-orange-200">{r.measuredDensity.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating dragged chip */}
      {dragId && dragPos && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ left: dragPos.x, top: dragPos.y }}
        >
          <SolidGlyph solid={solids.find((s) => s.id === dragId)!} wetOpacity={wetOpacityFor(dragId)} />
        </div>
      )}

      <MobileExperimentControls
        actions={[
          {
            id: "record",
            label: !cylinderSolid ? "Drop" : settled ? "Record" : "Settle",
            onClick: handleRecordReading,
            disabled: !cylinderSolid || !settled || measuredVolumeCm3 <= 0,
            tone: "orange",
          },
          {
            id: "empty",
            label: "Empty",
            onClick: handleResetCylinder,
            tone: "dark",
          },
          {
            id: "add",
            label: "Add Rock",
            onClick: () => setShowCreator(true),
            tone: "green",
          },
        ]}
        panels={[
          {
            id: "solids",
            label: "Solids",
            value: `${paletteSolids.length} ready`,
            content: (
              <div className="grid grid-cols-2 gap-2">
                {paletteSolids.map((s) => (
                  <div
                    key={s.id}
                    onPointerDown={(e) => beginDrag(s.id, e)}
                    className="grid h-14 cursor-grab touch-none grid-cols-[46px_minmax(0,1fr)] items-center gap-2 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1.5 active:cursor-grabbing"
                    style={{ opacity: dragId === s.id ? 0.25 : 1 }}
                  >
                    <div className="grid h-11 w-11 place-items-center overflow-hidden">
                      <div className="origin-center scale-[0.7]">
                        <SolidGlyph solid={s} wetOpacity={wetOpacityFor(s.id)} />
                      </div>
                    </div>
                    <div className="min-w-0 leading-none">
                      <div className="truncate text-[11px] font-bold leading-tight text-slate-200">{s.name}</div>
                      <div className="mt-1 text-[10px] leading-none text-slate-500">{s.massG.toFixed(1)} g</div>
                    </div>
                  </div>
                ))}
                {paletteSolids.length === 0 && (
                  <div className="col-span-2 rounded-xl border border-dashed border-slate-700 p-3 text-xs text-slate-500">
                    Empty the apparatus to return solids here.
                  </div>
                )}
              </div>
            ),
          },
          {
            id: "eureka",
            label: "Eureka",
            value: eurekaMode ? "on" : "off",
            content: (
              <label className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-semibold text-slate-200">
                <span>Eureka can mode</span>
                <input
                  type="checkbox"
                  checked={eurekaMode}
                  onChange={(e) => handleEurekaModeChange(e.target.checked)}
                  className="h-5 w-5 accent-orange-500"
                />
              </label>
            ),
          },
          {
            id: "meniscus",
            label: "Level",
            value: `${measuredVolumeCm3.toFixed(1)} cm³`,
            content: (
              <MeniscusZoom
                levelCm={eurekaMode ? catchLevelRef.current : levelRef.current}
                areaCm2={eurekaMode ? CATCH_AREA_CM2 : CYL_AREA_CM2}
              />
            ),
          },
          {
            id: "trials",
            label: "Trials",
            value: `${readings.length}`,
            content: (
              <div className="max-h-52 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.045] p-2.5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-200">Recorded trials</div>
                  {readings.length > 0 && (
                    <button onClick={() => setReadings([])} className="text-[11px] font-bold text-orange-200">
                      Clear
                    </button>
                  )}
                </div>
                {readings.length === 0 ? (
                  <div className="text-xs text-slate-500">No readings yet.</div>
                ) : (
                  <table className="w-full text-xs">
                    <tbody>
                      {readings.map((r, i) => (
                        <tr key={i} className="border-t border-slate-800 align-top">
                          <td className="pr-2 py-1 font-semibold text-slate-200">{r.solidName}</td>
                          <td className="pr-2 py-1">{r.massG.toFixed(1)}g</td>
                          <td className="pr-2 py-1">{r.measuredVolumeCm3.toFixed(1)}cm³</td>
                          <td className="py-1 font-bold text-orange-200">{r.measuredDensity.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ),
          },
        ]}
        readouts={
          <>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-2 text-center text-[10px] text-slate-400">
              <div className="text-sm font-black text-emerald-200">{activeMassG !== null ? activeMassG.toFixed(1) : "--"}</div>
              <div>Mass g</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-2 text-center text-[10px] text-slate-400">
              <div className="text-sm font-black text-emerald-200">{cylinderSolid ? measuredVolumeCm3.toFixed(1) : "--"}</div>
              <div>cm³</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-2 text-center text-[10px] text-slate-400">
              <div className="text-sm font-black text-emerald-200">{activeDensity !== null ? activeDensity.toFixed(2) : "--"}</div>
              <div>g/cm³</div>
            </div>
          </>
        }
      />

      {showCreator && <RockCreator onCreate={handleCreateRock} onClose={() => setShowCreator(false)} />}

      {showPaper && (
        <DensityPaper
          eurekaMode={eurekaMode}
          balanceReading={activeMassG ?? 0}
          measuredVolumeCm3={measuredVolumeCm3}
          currentSolid={cylinderSolid}
          readings={readings}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? densityHowToSteps : densityTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
