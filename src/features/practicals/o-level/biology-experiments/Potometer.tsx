"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { BENCH_TOP_Y, LabLighting, LabPlayer, LabRoom } from "../../common/LabEnvironment";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { ExperimentResultsGraph, type GraphPoint } from "../../common/ExperimentResultsGraph";

interface PotometerSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.sky;
const PAPER_FILENAME = "transpiration-rate-with-a-potometer.html";

/* ------------------------------------------------------------------ Science */

interface ConditionSpec {
  id: string;
  label: string;
  short: string;
  /** Rate relative to still air in the laboratory. */
  factor: number;
  emoji: string;
  explanation: string;
}

/**
 * Transpiration is the loss of water vapour from the leaves, mostly through the
 * stomata. Anything that steepens the water-vapour gradient between the leaf air
 * spaces and the outside air speeds it up.
 */
const CONDITIONS: ConditionSpec[] = [
  {
    id: "normal",
    label: "Still air, room light",
    short: "Normal",
    factor: 1,
    emoji: "🌡️",
    explanation: "The baseline. Every other condition is compared with this one.",
  },
  {
    id: "wind",
    label: "Windy (fan on)",
    short: "Wind",
    factor: 2.1,
    emoji: "💨",
    explanation:
      "Moving air blows away the humid layer of water vapour just outside the stomata. The concentration gradient stays steep, so diffusion out of the leaf is faster.",
  },
  {
    id: "bright",
    label: "Bright light",
    short: "Light",
    factor: 1.6,
    emoji: "💡",
    explanation:
      "Light makes the stomata open wider so the plant can take in carbon dioxide. More open stomata mean more water vapour escapes.",
  },
  {
    id: "dark",
    label: "Darkness",
    short: "Dark",
    factor: 0.35,
    emoji: "🌑",
    explanation: "In the dark the stomata close, so very little water vapour can escape. The rate falls sharply.",
  },
  {
    id: "humid",
    label: "Humid (plastic bag)",
    short: "Humid",
    factor: 0.4,
    emoji: "💧",
    explanation:
      "Humid air already holds a lot of water vapour, so the gradient between the leaf and the air is shallow and less water diffuses out.",
  },
  {
    id: "hot",
    label: "Warm (25 → 35 °C)",
    short: "Warm",
    factor: 1.75,
    emoji: "🔥",
    explanation:
      "Warmth gives water molecules more kinetic energy so they evaporate and diffuse faster, and warm air can hold more vapour.",
  },
];

/** Distance the bubble moves in the capillary tube, in mm, under normal conditions. */
const BASE_RATE_MM_PER_MIN = 6;
/** Length of the graduated capillary tube in mm. */
const TUBE_LENGTH_MM = 100;
const READING_PERIOD_MIN = 10;
/** Simulated minutes per real second — a 10-minute reading takes ~12 s. */
const TIME_SCALE = 0.85;
/** Cross-sectional area of the capillary tube, in mm². */
const TUBE_AREA_MM2 = 0.8;

function ratePerMinute(factor: number): number {
  return BASE_RATE_MM_PER_MIN * factor;
}

/** Volume of water taken up per minute, in mm³. */
function volumePerMinute(factor: number): number {
  return ratePerMinute(factor) * TUBE_AREA_MM2;
}

const MISSIONS: GameMission[] = [
  { short: "Set up", title: "Set up under water", detail: "Cut the shoot and assemble the potometer with everything submerged, so no air bubble gets into the xylem.", symbol: "✂️" },
  { short: "Seal", title: "Seal and introduce a bubble", detail: "Seal the joints with vaseline, then lift the capillary out of the beaker for a moment to draw in one air bubble.", symbol: "🫧" },
  { short: "Measure", title: "Time the bubble", detail: "Let the plant settle, then measure how far the bubble moves in ten minutes.", symbol: "📏" },
  { short: "Compare", title: "Change one condition", detail: "Reset the bubble with the reservoir tap, change one condition, and compare the rates.", symbol: "💨" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What does a potometer measure?",
    text: "A potometer measures the rate at which a shoot takes up water. Almost all of that water is lost by transpiration from the leaves, so water uptake is used as a measure of the transpiration rate.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "The leafy shoot is sealed into a tube of water that runs down to a graduated capillary tube. As the shoot pulls water up, the air bubble in the capillary moves along the scale.",
    mode: "bubble",
    selector: '[data-experiment-tour="potometer-scene"]',
  },
  {
    title: "Change one condition at a time",
    text: "Switch on the fan, move the lamp, put a bag over the leaves, or darken the room. Each condition changes how steep the water-vapour gradient is.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Uptake is not exactly transpiration",
    text: "A little water is used in photosynthesis and to keep cells turgid, so uptake slightly over-estimates transpiration. It is still the standard measure.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** The leafy shoot sealed into the top of the potometer. */
function LeafyShoot({ wind, bagged, lit }: { wind: boolean; bagged: boolean; lit: boolean }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        y: 0.22 + (index / 9) * 0.56,
        angle: index * 1.75,
        size: 0.085 + (index % 3) * 0.018,
        tilt: 0.45 + (index % 2) * 0.2,
      })),
    [],
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.022, 1.0, 10]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.72} />
      </mesh>

      {leaves.map((leaf, index) => (
        <group key={index} position={[0, leaf.y, 0]} rotation={[0, leaf.angle, leaf.tilt + (wind ? 0.28 : 0)]}>
          <mesh position={[leaf.size, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <circleGeometry args={[leaf.size, 16]} />
            <meshStandardMaterial color={lit ? "#3f9a42" : "#2f7434"} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Clear plastic bag trapping humid air around the leaves */}
      {bagged && (
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.3, 20, 16]} />
          <meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.24} transmission={0.6} roughness={0.2} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

/**
 * The potometer: shoot sealed into a rubber bung on a water-filled tube, with a
 * reservoir tap and a horizontal graduated capillary whose bubble is timed.
 */
function PotometerApparatus({
  bubbleMm,
  condition,
}: {
  bubbleMm: number;
  condition: ConditionSpec;
}) {
  const capillaryLength = 1.3;
  const fraction = THREE.MathUtils.clamp(bubbleMm / TUBE_LENGTH_MM, 0, 1);
  // The bubble starts at the far right of the scale and travels left, towards the plant.
  const bubbleX = 0.5 + (1 - fraction) * (capillaryLength - 0.12);

  return (
    <group position={[-0.7, BENCH_TOP_Y + 0.02, 0]}>
      {/* Shoot in the top of the apparatus */}
      <group position={[0, 0.94, 0]}>
        <LeafyShoot
          wind={condition.id === "wind"}
          bagged={condition.id === "humid"}
          lit={condition.id === "bright" || condition.id === "hot"}
        />
      </group>

      {/* Rubber bung sealing the shoot in */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.072, 0.1, 20]} />
        <meshStandardMaterial color="#4a4038" roughness={0.9} />
      </mesh>
      {/* Vaseline seal */}
      <mesh position={[0, 0.955, 0]}>
        <torusGeometry args={[0.076, 0.009, 8, 20]} />
        <meshStandardMaterial color="#f6f2e4" roughness={0.55} />
      </mesh>

      {/* Wide vertical tube full of water */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.62, 22, 1, true]} />
        <meshPhysicalMaterial
          color="#e3f2fb"
          transparent
          opacity={0.2}
          transmission={0.84}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.067, 0.067, 0.6, 22]} />
        <meshStandardMaterial color="#cfe9f7" transparent opacity={0.5} roughness={0.14} />
      </mesh>

      {/* Reservoir with tap, for resetting the bubble */}
      <group position={[-0.22, 0.62, 0]}>
        <mesh position={[0, 0.14, 0]}>
          <sphereGeometry args={[0.085, 18, 14]} />
          <meshPhysicalMaterial color="#e3f2fb" transparent opacity={0.24} transmission={0.8} roughness={0.06} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <sphereGeometry args={[0.072, 16, 12]} />
          <meshStandardMaterial color="#cfe9f7" transparent opacity={0.5} roughness={0.14} />
        </mesh>
        {/* Tap */}
        <mesh position={[0.06, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} />
        </mesh>
        <Html position={[0, 0.32, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/92 px-2 py-0.5 text-[7px] font-black uppercase text-slate-200">
            reservoir · resets the bubble
          </div>
        </Html>
      </group>

      {/* Bend down to the horizontal capillary */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.14, 14]} />
        <meshPhysicalMaterial color="#eef4fa" transparent opacity={0.4} roughness={0.08} />
      </mesh>

      {/* Horizontal graduated capillary tube */}
      <group position={[0.06, 0.18, 0]}>
        <mesh position={[0.5 + capillaryLength / 2 - 0.5 + 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, capillaryLength, 18, 1, true]} />
          <meshPhysicalMaterial
            color="#eef4fa"
            transparent
            opacity={0.24}
            transmission={0.8}
            roughness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {/* Water column behind the bubble (towards the plant) */}
        <mesh position={[(0.5 + bubbleX - 0.05) / 2 + 0.0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, Math.max(0.02, bubbleX - 0.05), 14]} />
          <meshStandardMaterial color="#cfe9f7" transparent opacity={0.6} roughness={0.14} />
        </mesh>
        {/* Water ahead of the bubble */}
        <mesh
          position={[(bubbleX + 0.05 + (0.5 + capillaryLength)) / 2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.02, 0.02, Math.max(0.02, 0.5 + capillaryLength - bubbleX - 0.05), 14]} />
          <meshStandardMaterial color="#cfe9f7" transparent opacity={0.6} roughness={0.14} />
        </mesh>
        {/* The air bubble itself */}
        <mesh position={[bubbleX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.019, 0.05, 6, 12]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.9} roughness={0.1} />
        </mesh>

        {/* Millimetre scale under the capillary */}
        <mesh position={[0.5 + capillaryLength / 2, -0.06, 0]} receiveShadow>
          <boxGeometry args={[capillaryLength, 0.01, 0.06]} />
          <meshStandardMaterial color="#e8dcb5" roughness={0.75} />
        </mesh>
        {Array.from({ length: 11 }, (_, index) => index).map((index) => (
          <mesh key={index} position={[0.5 + (index / 10) * (capillaryLength - 0.12) + 0.06, -0.052, 0.02]}>
            <boxGeometry args={[0.004, 0.006, 0.024]} />
            <meshStandardMaterial color="#3f3f46" />
          </mesh>
        ))}

        {/* Beaker of water the capillary end sits in */}
        <group position={[0.5 + capillaryLength + 0.08, -0.14, 0]}>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.2, 20, 1, true]} />
            <meshPhysicalMaterial color="#e4f2fb" transparent opacity={0.22} transmission={0.8} roughness={0.06} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.07, 0]}>
            <cylinderGeometry args={[0.103, 0.103, 0.14, 20]} />
            <meshStandardMaterial color="#cfe9f7" transparent opacity={0.5} roughness={0.15} />
          </mesh>
        </group>

        <Html position={[0.5 + capillaryLength / 2, 0.2, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="w-[124px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
            <div className="text-[8px] font-black uppercase leading-tight text-white">Capillary tube</div>
            <div className="mt-0.5 text-[10px] font-black tabular-nums text-sky-200">bubble moved {bubbleMm.toFixed(1)} mm</div>
          </div>
        </Html>
      </group>

      {/* Clamp stand */}
      <mesh position={[0.3, 0.62, -0.2]} castShadow>
        <boxGeometry args={[0.4, 0.04, 0.06]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.52, 0.38, -0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.78, 12]} />
        <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.52, 0.01, -0.2]} receiveShadow>
        <boxGeometry args={[0.32, 0.03, 0.26]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** The fan, lamp and thermometer that set the conditions. */
function ConditionEquipment({ condition }: { condition: ConditionSpec }) {
  const fanOn = condition.id === "wind";
  const lampOn = condition.id === "bright" || condition.id === "hot";

  return (
    <>
      {/* Electric fan */}
      <group position={[-1.55, BENCH_TOP_Y + 0.36, 0.5]} rotation={[0, -0.7, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.07, 22]} />
          <meshStandardMaterial color={fanOn ? "#1d4ed8" : "#3f3f46"} metalness={0.4} roughness={0.5} />
        </mesh>
        {Array.from({ length: 4 }, (_, index) => index).map((index) => (
          <mesh key={index} position={[0, 0.045, 0]} rotation={[0, (index / 4) * Math.PI * 2 + (fanOn ? 0.6 : 0), 0]}>
            <boxGeometry args={[0.13, 0.008, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.4} transparent opacity={fanOn ? 0.55 : 1} />
          </mesh>
        ))}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.09, 0.36, 14]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.6} />
        </mesh>
        <Html position={[0, 0.3, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase ${
              fanOn ? "border-sky-300/50 bg-sky-950/92 text-sky-100" : "border-white/15 bg-slate-950/85 text-slate-500"
            }`}
          >
            fan {fanOn ? "ON" : "off"}
          </div>
        </Html>
      </group>

      {/* Lamp */}
      <group position={[0.62, BENCH_TOP_Y + 0.02, 0.52]}>
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.06, 18]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.58, 10]} />
          <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-0.09, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <coneGeometry args={[0.12, 0.18, 18, 1, true]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.35} roughness={0.45} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[-0.14, 0.6, 0]}>
          <sphereGeometry args={[0.045, 14, 12]} />
          <meshStandardMaterial
            color={lampOn ? "#fffbe8" : "#5b5b62"}
            emissive={lampOn ? "#ffef9f" : "#000000"}
            emissiveIntensity={lampOn ? 1.7 : 0}
          />
        </mesh>
        {lampOn && <pointLight position={[-0.24, 0.6, 0]} intensity={10} distance={3.4} color="#fff6dc" />}
        <Html position={[0, 0.86, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div
            className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase ${
              lampOn ? "border-amber-300/50 bg-amber-950/92 text-amber-100" : "border-white/15 bg-slate-950/85 text-slate-500"
            }`}
          >
            lamp {lampOn ? "ON" : "off"}
          </div>
        </Html>
      </group>
    </>
  );
}

function PotometerScene({
  bubbleMm,
  condition,
  mode,
  isMobile,
  moveVectorRef,
}: {
  bubbleMm: number;
  condition: ConditionSpec;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.5, 3.35, 4.4] : [0.6, 3.1, 4.2];
    camera.position.set(...position);
    camera.lookAt(-0.1, 2.1, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 50;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0284c7"
        benchColor="#eef3f7"
        posterA={{
          title: "TRANSPIRATION",
          lines: [
            "Water evaporates from the leaves",
            "Mostly through the stomata",
            "It pulls water up the xylem",
            "Uptake measures the rate",
          ],
        }}
        posterB={{
          title: "WHAT SPEEDS IT UP",
          lines: [
            "Wind: blows humid air away",
            "Bright light: stomata open wider",
            "Warmth: faster evaporation",
            "Humidity: slows it right down",
          ],
        }}
      >
        <PotometerApparatus bubbleMm={bubbleMm} condition={condition} />
        <ConditionEquipment condition={condition} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[-0.1, 2.05, 0]} minDistance={2.0} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function PotometerPaper({ results, onClose }: { results: Record<string, number>; onClose: () => void }) {
  const recorded = CONDITIONS.filter((condition) => condition.id in results);
  const baseline = results.normal;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Investigating the Effect of Environmental Conditions on the Rate of Transpiration
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To use a bubble potometer to measure the rate of water uptake by a leafy shoot, and to compare that rate in
          still air, moving air, bright light, darkness, humid air and warm air.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Bubble potometer (wide tube, reservoir with tap and graduated capillary tube), leafy shoot, scalpel, bowl of
          water, vaseline, clamp and stand, stop-clock, ruler, electric fan, bench lamp, clear plastic bag, thermometer,
          paper towel.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            A leafy shoot was cut with a slanting cut under water, and the whole potometer was assembled with everything
            submerged, so that no air entered the xylem.
          </li>
          <li>The shoot was sealed into the bung with vaseline to make every joint airtight.</li>
          <li>
            The apparatus was clamped upright and the end of the capillary tube lifted briefly out of the beaker of water
            to draw in a single air bubble.
          </li>
          <li>The shoot was left for five minutes to settle so the rate became steady.</li>
          <li>
            The distance moved by the bubble in ten minutes was measured on the scale, and the rate calculated as
            distance ÷ time.
          </li>
          <li>The reservoir tap was opened to push the bubble back to the start.</li>
          <li>
            One condition was changed at a time — fan on, lamp on, plant in darkness, leaves in a plastic bag, warm room
            — and the measurement repeated.
          </li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">The environmental condition (wind, light, humidity, temperature)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Distance moved by the bubble per minute (rate of water uptake)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Same shoot, same number and area of leaves, same time period, all other conditions kept as they were, no
                air leaks
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {recorded.length === 0 ? (
          <p className="italic">No readings recorded yet — measure the rate in still air first, then change a condition.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Condition</th>
                <th className="border border-slate-400 p-2">Distance in 10 min (mm)</th>
                <th className="border border-slate-400 p-2">Rate (mm/min)</th>
                <th className="border border-slate-400 p-2">Volume uptake (mm³/min)</th>
                <th className="border border-slate-400 p-2">Compared with still air</th>
              </tr>
            </thead>
            <tbody>
              {recorded.map((condition) => {
                const rate = results[condition.id];
                return (
                  <tr key={condition.id}>
                    <td className="border border-slate-400 p-2">{condition.label}</td>
                    <td className="border border-slate-400 p-2 text-center">{(rate * READING_PERIOD_MIN).toFixed(0)}</td>
                    <td className="border border-slate-400 p-2 text-center">{rate.toFixed(2)}</td>
                    <td className="border border-slate-400 p-2 text-center">{(rate * TUBE_AREA_MM2).toFixed(2)}</td>
                    <td className="border border-slate-400 p-2 text-center">
                      {baseline ? `× ${(rate / baseline).toFixed(2)}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Water uptake was fastest in moving air and slowest in humid air and in darkness. Wind blows away the layer of
          saturated air just outside the stomata, keeping the water-vapour gradient steep so diffusion out of the leaf
          stays fast. Bright light makes the stomata open wider for photosynthesis, so more water vapour escapes. Warmth
          gives the water molecules more energy, so they evaporate and diffuse faster. Humid air already contains a lot
          of water vapour, so the gradient is shallow and transpiration is slow, and in darkness the stomata close so
          very little water is lost.
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            A potometer measures water UPTAKE, not transpiration directly. A small amount of water is used in
            photosynthesis and to keep cells turgid, so uptake slightly over-estimates transpiration.
          </li>
          <li>
            Any air bubble that enters the xylem when the shoot is cut breaks the water column and the apparatus stops
            working — this is why it is assembled under water.
          </li>
          <li>All joints must be sealed with vaseline, or a leak lets the bubble move for the wrong reason.</li>
          <li>Only one condition should be changed at a time, and the shoot needs time to settle after each change.</li>
          <li>
            Results from different shoots cannot be compared fairly unless the total leaf area is the same, so the same
            shoot is used throughout.
          </li>
          <li>Each reading should be repeated three times and a mean rate calculated.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function PotometerSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: PotometerSimProps) {
  const [conditionIndex, setConditionIndex] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const condition = CONDITIONS[conditionIndex];
  const rate = ratePerMinute(condition.factor);
  const bubbleMm = Math.min(TUBE_LENGTH_MM, rate * minutes);
  /** The bubble reaches the end of the scale before ten minutes in a fast condition. */
  const finished = minutes >= READING_PERIOD_MIN || bubbleMm >= TUBE_LENGTH_MM;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = Math.min(((now - startRef.current) / 1000) * TIME_SCALE, READING_PERIOD_MIN);
      setMinutes(next);
      if (next >= READING_PERIOD_MIN || ratePerMinute(condition.factor) * next >= TUBE_LENGTH_MM) {
        setRunning(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running, condition.factor]);

  /* Record the rate as soon as the reading period ends. */
  useEffect(() => {
    if (!finished) return;
    setResults((current) => (condition.id in current ? current : { ...current, [condition.id]: rate }));
  }, [finished, condition.id, rate]);

  const startReading = useCallback(() => {
    startRef.current = performance.now() - (minutes / TIME_SCALE) * 1000;
    setRunning(true);
  }, [minutes]);

  const pause = useCallback(() => setRunning(false), []);

  /** Opening the reservoir tap pushes the bubble back to the start of the scale. */
  const resetBubble = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setMinutes(0);
  }, []);

  const selectCondition = useCallback((index: number) => {
    setRunning(false);
    setDemoActive(false);
    setMinutes(0);
    setConditionIndex(index);
  }, []);

  const clearResults = useCallback(() => {
    setResults({});
    resetBubble();
  }, [resetBubble]);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setMinutes(0);
    startRef.current = performance.now();
    setRunning(true);
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const recordedCount = Object.keys(results).length;
  const complete = recordedCount >= CONDITIONS.length;
  const step = recordedCount >= 3 ? 3 : running ? 2 : recordedCount > 0 ? 2 : minutes > 0 ? 1 : 0;
  const progress = minutes / READING_PERIOD_MIN;
  const baseline = results.normal;

  /* Rate against condition — a bar comparison is clearer than a line here. */
  const graphPoints: GraphPoint[] = CONDITIONS.map((item, index) => {
    if (!(item.id in results)) return { x: index, y: 0, pending: true };
    return { x: index, y: results[item.id] };
  });

  const status = running
    ? `${minutes.toFixed(1)} min — the bubble has moved ${bubbleMm.toFixed(1)} mm (${condition.label}).`
    : finished
      ? `${condition.label}: ${bubbleMm.toFixed(0)} mm in ${Math.min(minutes, READING_PERIOD_MIN).toFixed(0)} min, a rate of ${rate.toFixed(2)} mm/min.`
      : `Set to ${condition.label}. Let the shoot settle, then time the bubble for ten minutes.`;

  const observation = complete
    ? "Wind is the fastest, humidity and darkness the slowest. Each condition changes how easily water vapour diffuses out."
    : recordedCount > 0
      ? `${recordedCount} of ${CONDITIONS.length} conditions measured.${baseline ? "" : " Measure still air first, so you have something to compare with."}`
      : "Start with still air to get a baseline, then change one condition at a time.";

  const primaryLabel = running ? "Timing…" : finished ? "Reset bubble (tap)" : minutes > 0 ? "Continue" : "Time for 10 min";

  /* ------------------------------------------------------------ UI panels */

  const conditionPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Condition</span>
        <span className="text-[11px] font-black" style={{ color: ACCENT.text }}>
          {condition.short}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {CONDITIONS.map((item, index) => {
          const recorded = item.id in results;
          const active = index === conditionIndex;
          return (
            <button
              key={item.id}
              onClick={() => selectCondition(index)}
              className="relative rounded-xl px-1 py-2 text-[9px] font-black transition"
              style={
                active
                  ? { background: ACCENT.base, color: "#04202e" }
                  : { background: "rgba(255,255,255,0.08)", color: recorded ? "#bae6fd" : "#e2e8f0" }
              }
            >
              {item.emoji} {item.short}
              {recorded && !active && <span className="absolute right-0.5 top-0.5 text-[7px]">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{condition.explanation}</div>
    </div>
  );

  const readingPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Bubble movement</span>
        <span className="text-lg font-black tabular-nums" style={{ color: ACCENT.text }}>
          {bubbleMm.toFixed(1)} mm
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${Math.max(1, (bubbleMm / TUBE_LENGTH_MM) * 100)}%`, background: ACCENT.base }}
        />
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1 text-center text-[9px]">
        <div>
          <div className="text-slate-500">time</div>
          <div className="font-black text-white">{minutes.toFixed(1)} min</div>
        </div>
        <div>
          <div className="text-slate-500">rate</div>
          <div className="font-black" style={{ color: ACCENT.text }}>
            {rate.toFixed(2)} mm/min
          </div>
        </div>
        <div>
          <div className="text-slate-500">volume</div>
          <div className="font-black text-white">{volumePerMinute(condition.factor).toFixed(1)} mm³/min</div>
        </div>
      </div>
    </div>
  );

  const comparisonPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Rates compared</span>
        <button onClick={clearResults} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-2 space-y-1">
        {CONDITIONS.map((item) => {
          const recorded = item.id in results;
          const value = results[item.id];
          const maxRate = ratePerMinute(Math.max(...CONDITIONS.map((entry) => entry.factor)));
          return (
            <div key={item.id} className="flex items-center gap-2 text-[9px]">
              <span className="w-12 shrink-0 font-black text-white">{item.short}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-900">
                {recorded && (
                  <div className="h-full rounded-full" style={{ width: `${(value / maxRate) * 100}%`, background: ACCENT.base }} />
                )}
              </div>
              <span className="w-9 shrink-0 text-right font-black" style={{ color: recorded ? ACCENT.text : "#64748b" }}>
                {recorded ? value.toFixed(1) : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 text-[9px] leading-snug text-slate-400">Rate in mm per minute along the capillary scale.</div>
    </div>
  );

  const graphPanel = (
    <ExperimentResultsGraph
      points={graphPoints}
      xLabel="Condition (in the order listed)"
      yLabel="Rate (mm/min)"
      accentHex={ACCENT.base}
      caption="Uptake rate by condition"
      xMin={0}
      xMax={CONDITIONS.length - 1}
      yMax={ratePerMinute(2.2)}
      joinPoints={false}
      footer="Plotted as a scatter — these conditions are separate categories, not a continuous scale."
    />
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Potometer Lab"
          subtitle="measuring water uptake with a potometer"
          symbol="💦"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to Biology experiments"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="potometer-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.6, 3.1, 4.2], fov: 50, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <PotometerScene
            bubbleMm={bubbleMm}
            condition={condition}
            mode={mode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
          />
        </Canvas>

        {mode === "doing" && isMobileViewport && <MobileGtaNavigation moveVector={moveVectorRef} />}

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={handleModeChange}
        />

        {mode === "learning" && (
          <CombinedScienceGoalCard
            accent={ACCENT}
            emoji="💦"
            cornerEmoji={condition.emoji}
            status={status}
            running={running}
            progress={progress}
            complete={complete}
          />
        )}

        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">
            Drag to look around · scroll to zoom
          </div>
        )}
        {mode === "doing" && !isMobileViewport && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
            <div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
              WASD / arrows to move · mouse to look · click to lock
            </div>
          </div>
        )}
      </div>

      {!isMobileViewport && (
        <CombinedScienceObjectiveRail
          accent={ACCENT}
          title="Transpiration"
          tagline="measuring water uptake with a potometer"
          missions={MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : finished ? "↺" : "▶"}
          onPrimary={running ? pause : finished ? resetBubble : startReading}
          onReset={resetBubble}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "condition", label: "Condition", value: condition.short, content: conditionPanel },
            { id: "reading", label: "Bubble", value: `${bubbleMm.toFixed(0)}mm`, content: readingPanel },
            { id: "compare", label: "Rates", value: `${recordedCount}/${CONDITIONS.length}`, content: comparisonPanel },
            { id: "graph", label: "Graph", value: `${recordedCount}`, content: graphPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "run",
              label: running ? "Pause" : finished ? "Reset bubble" : "Time 10 min",
              onClick: running ? pause : finished ? resetBubble : startReading,
              tone: running ? "red" : "green",
            },
            {
              id: "next",
              label: "Next condition",
              onClick: () => selectCondition((conditionIndex + 1) % CONDITIONS.length),
              tone: "orange",
            },
            { id: "reset", label: "Clear all", onClick: clearResults, tone: "dark" },
          ]}
          panels={[
            { id: "condition", label: "Condition", value: condition.short, content: conditionPanel },
            { id: "reading", label: "Bubble", value: `${bubbleMm.toFixed(0)}mm`, content: readingPanel },
            { id: "compare", label: "Rates", value: `${recordedCount}/${CONDITIONS.length}`, content: comparisonPanel },
            { id: "graph", label: "Graph", value: `${recordedCount}`, content: graphPanel },
          ]}
        />
      )}

      {showPaper && <PotometerPaper results={results} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
