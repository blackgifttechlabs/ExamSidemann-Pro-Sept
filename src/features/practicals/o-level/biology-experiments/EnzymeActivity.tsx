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

interface EnzymeActivitySimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.violet;
const PAPER_FILENAME = "effect-of-temperature-and-ph-on-amylase.html";

/* ------------------------------------------------------------------ Science */

type Variable = "temperature" | "ph";

interface Condition {
  /** Numeric value of the control variable (°C or pH units). */
  value: number;
  label: string;
  /** Relative activity of salivary amylase, 1.00 at the optimum. */
  activity: number;
  /** Why the enzyme behaves this way — shown when the condition is selected. */
  note: string;
}

/**
 * Salivary amylase has an optimum near 37 °C and pH 7. Below the optimum the
 * enzyme is not damaged, only slow — molecules have too little kinetic energy
 * for frequent successful collisions. Above roughly 50 °C, and at extreme pH,
 * the active site loses its shape permanently: the enzyme is denatured.
 */
const TEMPERATURE_CONDITIONS: Condition[] = [
  { value: 0, label: "0 °C", activity: 0.02, note: "Ice bath. Molecules move very slowly, so almost no collisions with the active site. The enzyme is inactive but NOT denatured." },
  { value: 10, label: "10 °C", activity: 0.1, note: "Still cold. Kinetic energy is low, so digestion is very slow." },
  { value: 20, label: "20 °C", activity: 0.3, note: "Room temperature. Digestion happens, but well below the optimum rate." },
  { value: 30, label: "30 °C", activity: 0.72, note: "Approaching body temperature — the rate is climbing steeply." },
  { value: 37, label: "37 °C", activity: 1.0, note: "Body temperature: the OPTIMUM for salivary amylase. Fastest digestion." },
  { value: 45, label: "45 °C", activity: 0.62, note: "Past the optimum. Some enzyme molecules are beginning to denature, so the rate falls." },
  { value: 60, label: "60 °C", activity: 0.05, note: "Most active sites have lost their shape. The enzyme is largely denatured — cooling it will NOT bring it back." },
  { value: 80, label: "80 °C", activity: 0, note: "Fully denatured. The starch is never digested, so iodine stays blue-black." },
];

/**
 * pH series run in buffer solutions at the optimum temperature (37 °C), so pH
 * is the only variable being changed.
 */
const PH_CONDITIONS: Condition[] = [
  { value: 3, label: "pH 3", activity: 0, note: "Strongly acidic. Amylase is denatured — this is why starch digestion stops in the stomach." },
  { value: 5, label: "pH 5", activity: 0.28, note: "Acidic. The active site is distorted, so the rate is low." },
  { value: 6, label: "pH 6", activity: 0.78, note: "Just below the optimum — digestion is fast but not fastest." },
  { value: 7, label: "pH 7", activity: 1.0, note: "Neutral: the OPTIMUM for salivary amylase (about pH 6.8–7.0)." },
  { value: 8, label: "pH 8", activity: 0.66, note: "Slightly alkaline. The rate has fallen away from the optimum." },
  { value: 9, label: "pH 9", activity: 0.2, note: "Alkaline. Bonds holding the active site in shape are being disrupted." },
  { value: 11, label: "pH 11", activity: 0, note: "Strongly alkaline. Amylase is denatured and starch is never digested." },
];

/** Wells on the spotting tile, sampled at fixed intervals. */
const WELL_COUNT = 12;
const SAMPLE_INTERVAL_S = 20;
const MAX_TIME_S = WELL_COUNT * SAMPLE_INTERVAL_S; // 240 s
/** Simulated seconds elapsed per real second, so a run takes ~12 s to watch. */
const TIME_SCALE = 20;
/** Simulated seconds for starch to disappear at the optimum. */
const BASE_CLEAR_TIME_S = 40;

/** Simulated seconds for the starch to be fully digested, or null if never. */
function clearTimeFor(activity: number): number | null {
  if (activity <= 0.001) return null;
  const time = BASE_CLEAR_TIME_S / activity;
  return time > MAX_TIME_S ? null : time;
}

/** Rate of reaction, expressed the way the syllabus asks: 1000 ÷ time. */
function rateFor(clearTime: number | null): number {
  if (clearTime === null) return 0;
  return 1000 / clearTime;
}

/**
 * Iodine colour of a sample drop. With starch present it is blue-black; as the
 * starch is digested to maltose the colour fades through purple and brown to
 * the orange-brown of iodine solution alone.
 */
function iodineColour(sampleTimeS: number, clearTime: number | null): { hex: string; verdict: "starch" | "trace" | "none" } {
  if (clearTime === null) return { hex: "#161a33", verdict: "starch" };
  const ratio = sampleTimeS / clearTime;
  if (ratio >= 1) return { hex: "#b4611c", verdict: "none" };
  if (ratio >= 0.75) return { hex: "#5b2f6b", verdict: "trace" };
  if (ratio >= 0.5) return { hex: "#2b2352", verdict: "starch" };
  return { hex: "#161a33", verdict: "starch" };
}

const MISSIONS: GameMission[] = [
  { short: "Set up", title: "Set up the water bath", detail: "Choose a temperature (or a pH buffer), then leave the starch and amylase to reach that temperature before mixing.", symbol: "🌡️" },
  { short: "Mix", title: "Mix and start timing", detail: "Add amylase to the starch, start the stop-clock and stir.", symbol: "⏱️" },
  { short: "Sample", title: "Spot onto iodine", detail: "Every 20 seconds move one drop onto a fresh well of iodine and watch the colour.", symbol: "🎨" },
  { short: "Repeat", title: "Repeat and plot", detail: "Record the time for the starch to disappear, then repeat at the other values and plot rate against your variable.", symbol: "📈" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What controls enzyme activity?",
    text: "Amylase is an enzyme that digests starch into maltose. Its speed depends on temperature and on pH. You will measure how long the starch takes to disappear under each condition.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "A test tube of starch and amylase stands in a water bath. Beside it, a white spotting tile carries a drop of iodine solution in each well.",
    mode: "bubble",
    selector: '[data-experiment-tour="enzyme-scene"]',
  },
  {
    title: "Spot a drop every 20 seconds",
    text: "Iodine turns blue-black with starch. Once all the starch is digested the drop stays orange-brown — that is your end point.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Rate = 1000 ÷ time",
    text: "A shorter time means a faster reaction. Repeat at every temperature and pH, then read the optimum off your graph.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function WaterBath({ temperature, running }: { temperature: number; running: boolean }) {
  const hot = temperature >= 45;
  const icy = temperature <= 10;

  const bubbles = useMemo(
    () =>
      Array.from({ length: 10 }, () => ({
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        phase: Math.random(),
      })),
    [],
  );

  const iceCubes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        x: (Math.random() - 0.5) * 0.46,
        z: (Math.random() - 0.5) * 0.46,
        rotation: Math.random() * Math.PI,
        y: 0.3 + (index % 2) * 0.06,
      })),
    [],
  );

  // Water colour hints at the temperature without replacing the thermometer.
  const waterColour = icy ? "#cfeaff" : hot ? "#ffd9c2" : "#d6ecf7";

  return (
    <group position={[-0.72, BENCH_TOP_Y, 0]}>
      {/* Beaker */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.68, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e2f1fb"
          transparent
          opacity={0.22}
          transmission={0.82}
          roughness={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.008, 0]} receiveShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.016, 32]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={0.4} roughness={0.1} />
      </mesh>
      {/* Bath water */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.348, 0.348, 0.52, 32]} />
        <meshStandardMaterial color={waterColour} transparent opacity={0.55} roughness={0.18} />
      </mesh>

      {icy &&
        iceCubes.map((cube, index) => (
          <mesh key={index} position={[cube.x, cube.y, cube.z]} rotation={[0, cube.rotation, 0.2]}>
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshPhysicalMaterial color="#f0fbff" transparent opacity={0.72} roughness={0.15} transmission={0.5} />
          </mesh>
        ))}

      {hot &&
        bubbles.map((bubble, index) => (
          <mesh key={index} position={[bubble.x, 0.08 + bubble.phase * 0.42, bubble.z]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        ))}

      {/* Thermometer leaning in the bath */}
      <group position={[0.2, 0.52, 0.14]} rotation={[0.1, 0, 0.22]}>
        <mesh>
          <cylinderGeometry args={[0.016, 0.016, 0.78, 12]} />
          <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.55} roughness={0.1} />
        </mesh>
        {/* Mercury thread rises with temperature */}
        <mesh position={[0, -0.32 + (THREE.MathUtils.clamp(temperature, 0, 100) / 100) * 0.3, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.06 + (THREE.MathUtils.clamp(temperature, 0, 100) / 100) * 0.6, 8]} />
          <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.024, 12, 10]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* Electric hotplate / bath base */}
      <mesh position={[0, -0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.46, 0.5, 0.07, 32]} />
        <meshStandardMaterial color={hot && running ? "#4b2a1c" : "#3f3f46"} roughness={0.6} metalness={0.3} />
      </mesh>
    </group>
  );
}

function ReactionTube({
  temperature,
  mixed,
  starchRemaining,
}: {
  temperature: number;
  mixed: boolean;
  starchRemaining: number;
}) {
  // Cloudy starch suspension clears as it is digested to maltose solution.
  const cloudiness = mixed ? 0.28 + starchRemaining * 0.42 : 0.7;
  return (
    <group position={[-0.72, BENCH_TOP_Y + 0.18, 0]}>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.86, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          transparent
          opacity={0.2}
          transmission={0.8}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.075, 20, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.22} transmission={0.8} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Starch + amylase mixture */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.066, 0.066, 0.4, 20]} />
        <meshStandardMaterial color="#f6f8fb" transparent opacity={cloudiness} roughness={0.35} />
      </mesh>
      {/* Glass rod for stirring */}
      <mesh position={[0.028, 0.62, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.008, 0.008, 1.0, 10]} />
        <meshPhysicalMaterial color="#f1f5f9" transparent opacity={0.5} roughness={0.1} />
      </mesh>
      <Html position={[0, 1.06, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[104px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Starch + amylase</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-violet-300">{temperature} °C bath</div>
        </div>
      </Html>
    </group>
  );
}

function SpottingTile({
  wells,
  elapsed,
  clearTime,
}: {
  wells: number;
  elapsed: number;
  clearTime: number | null;
}) {
  const columns = 6;
  const rows = Math.ceil(wells / columns);
  const spacing = 0.155;

  return (
    <group position={[0.62, BENCH_TOP_Y + 0.02, 0]}>
      {/* White ceramic tile */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[columns * spacing + 0.12, 0.04, rows * spacing + 0.12]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.45} />
      </mesh>

      {Array.from({ length: wells }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const x = (column - (columns - 1) / 2) * spacing;
        const z = (row - (rows - 1) / 2) * spacing;
        const sampleTime = index * SAMPLE_INTERVAL_S;
        const sampled = elapsed >= sampleTime;
        const { hex } = iodineColour(sampleTime, clearTime);

        return (
          <group key={index} position={[x, 0.04, z]}>
            {/* Well depression */}
            <mesh>
              <cylinderGeometry args={[0.052, 0.044, 0.016, 20]} />
              <meshStandardMaterial color="#e6ebf2" roughness={0.5} />
            </mesh>
            {/* Iodine drop — brown until a sample is added */}
            <mesh position={[0, 0.011, 0]}>
              <cylinderGeometry args={[0.045, 0.04, 0.012, 20]} />
              <meshStandardMaterial
                color={sampled ? hex : "#8a4a12"}
                roughness={0.25}
                transparent
                opacity={sampled ? 0.96 : 0.8}
                emissive={sampled ? hex : "#000000"}
                emissiveIntensity={sampled ? 0.16 : 0}
              />
            </mesh>
            {/* Well number */}
            <Html position={[0, 0.03, 0.075]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
              <div className="text-[7px] font-black text-slate-600">{sampleTime}s</div>
            </Html>
          </group>
        );
      })}

      <Html position={[0, 0.34, -0.28]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[112px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Iodine spotting tile</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-amber-300">blue-black = starch</div>
        </div>
      </Html>
    </group>
  );
}

function DropperPipette({ active, wellIndex }: { active: boolean; wellIndex: number }) {
  const columns = 6;
  const spacing = 0.155;
  const column = wellIndex % columns;
  const row = Math.floor(wellIndex / columns);
  const rows = 2;
  const x = 0.62 + (column - (columns - 1) / 2) * spacing;
  const z = (row - (rows - 1) / 2) * spacing;

  return (
    <group position={active ? [x, BENCH_TOP_Y + 0.34, z] : [-0.3, BENCH_TOP_Y + 0.42, 0.34]} rotation={[0, 0, active ? 0 : 0.4]}>
      <mesh>
        <cylinderGeometry args={[0.018, 0.018, 0.24, 12]} />
        <meshPhysicalMaterial color="#eef2f7" transparent opacity={0.55} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <coneGeometry args={[0.016, 0.1, 12]} />
        <meshPhysicalMaterial color="#eef2f7" transparent opacity={0.55} roughness={0.1} />
      </mesh>
      {/* Rubber teat */}
      <mesh position={[0, 0.16, 0]}>
        <capsuleGeometry args={[0.026, 0.06, 6, 12]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.8} />
      </mesh>
    </group>
  );
}

function BufferBottles({ variable, activeLabel }: { variable: Variable; activeLabel: string }) {
  const bottles = variable === "ph" ? PH_CONDITIONS : TEMPERATURE_CONDITIONS.slice(0, 5);
  return (
    <group position={[0, BENCH_TOP_Y, -0.78]}>
      {bottles.map((condition, index) => {
        const x = (index - (bottles.length - 1) / 2) * 0.24;
        const active = condition.label === activeLabel;
        // Universal-indicator style colours for the buffer bottles.
        const colour =
          variable === "ph"
            ? condition.value <= 3
              ? "#dc2626"
              : condition.value <= 5
                ? "#f97316"
                : condition.value <= 6
                  ? "#facc15"
                  : condition.value <= 7
                    ? "#22c55e"
                    : condition.value <= 8
                      ? "#0ea5e9"
                      : condition.value <= 9
                        ? "#4338ca"
                        : "#6b21a8"
            : "#93c5fd";
        return (
          <group key={condition.label} position={[x, 0, 0]}>
            <mesh position={[0, 0.13, 0]} castShadow>
              <cylinderGeometry args={[0.055, 0.055, 0.26, 18]} />
              <meshPhysicalMaterial color="#e8f0f8" transparent opacity={0.32} transmission={0.7} roughness={0.08} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.18, 18]} />
              <meshStandardMaterial color={colour} transparent opacity={0.82} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.026, 0.026, 0.06, 12]} />
              <meshStandardMaterial color="#111827" roughness={0.7} />
            </mesh>
            {active && (
              <Html position={[0, 0.44, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
                <div className="whitespace-nowrap rounded-full border border-violet-300/40 bg-violet-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-violet-100">
                  in use · {condition.label}
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

function EnzymeScene({
  variable,
  condition,
  elapsed,
  clearTime,
  running,
  mixed,
  starchRemaining,
  latestWell,
  mode,
  isMobile,
  moveVectorRef,
}: {
  variable: Variable;
  condition: Condition;
  elapsed: number;
  clearTime: number | null;
  running: boolean;
  mixed: boolean;
  starchRemaining: number;
  latestWell: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [2.9, 3.25, 3.9] : [3.1, 3.05, 4.1];
    camera.position.set(...position);
    camera.lookAt(0, 2.02, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 52 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const temperature = variable === "temperature" ? condition.value : 37;

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#7c3aed"
        benchColor="#eef2f6"
        posterA={{
          title: "ENZYMES",
          lines: [
            "Enzymes are biological catalysts (proteins)",
            "amylase: starch → maltose",
            "Optimum for salivary amylase: 37 °C, pH 7",
            "Above ~50 °C the active site denatures",
          ],
        }}
        posterB={{
          title: "IODINE TEST",
          lines: [
            "Blue-black = starch present",
            "Orange-brown = no starch left",
            "Rate of reaction = 1000 ÷ time",
            "Denatured enzymes never recover",
          ],
        }}
      >
        <WaterBath temperature={temperature} running={running} />
        <ReactionTube temperature={temperature} mixed={mixed} starchRemaining={starchRemaining} />
        <SpottingTile wells={WELL_COUNT} elapsed={elapsed} clearTime={clearTime} />
        <DropperPipette active={running && mixed} wellIndex={latestWell} />
        <BufferBottles variable={variable} activeLabel={condition.label} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.95, 0]} minDistance={2.1} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function EnzymePaper({
  variable,
  results,
  onClose,
}: {
  variable: Variable;
  results: Record<number, number | null>;
  onClose: () => void;
}) {
  const conditions = variable === "temperature" ? TEMPERATURE_CONDITIONS : PH_CONDITIONS;
  const unit = variable === "temperature" ? "Temperature (°C)" : "pH";
  const recorded = conditions.filter((condition) => condition.value in results);
  const optimum = variable === "temperature" ? "37 °C" : "pH 7";

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Investigating the Effect of {variable === "temperature" ? "Temperature" : "pH"} on the Activity of Amylase
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To find out how {variable === "temperature" ? "temperature" : "pH"} affects the rate at which the enzyme
          amylase digests starch.
        </p>

        <h2 className="mt-5 font-bold uppercase">Hypothesis</h2>
        <p>
          The rate of digestion will increase up to an optimum of about {optimum} and then fall, because beyond the
          optimum the active site of the enzyme is denatured and can no longer bind starch.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          1% starch solution, amylase solution, iodine solution in a dropping bottle, white spotting tile, test tubes and
          rack, syringes or pipettes, water baths, thermometer, stop-clock, glass rod
          {variable === "ph" ? ", buffer solutions of pH 3 to pH 11" : ""}.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A drop of iodine solution was placed in each well of a white spotting tile.</li>
          <li>
            5 cm³ of starch solution and 2 cm³ of amylase were placed in separate tubes and left in the{" "}
            {variable === "temperature" ? "water bath" : "water bath at 37 °C"} for five minutes so both reached the
            same temperature.
          </li>
          {variable === "ph" && <li>2 cm³ of the chosen buffer solution was added to the starch to fix the pH.</li>}
          <li>The amylase was added to the starch, the stop-clock started immediately and the mixture stirred.</li>
          <li>
            Every 20 seconds one drop of the mixture was transferred with a clean pipette to the next well of iodine and
            the colour noted.
          </li>
          <li>
            The time at which the iodine first stayed orange-brown was recorded as the time for all the starch to be
            digested.
          </li>
          <li>
            The experiment was repeated at each {variable === "temperature" ? "temperature" : "pH"}, keeping the volumes
            and concentrations of starch and amylase{variable === "temperature" ? "" : " and the temperature"} the same.
          </li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">{variable === "temperature" ? "Temperature of the water bath" : "pH of the buffer solution"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Time taken for the starch to disappear (used to calculate rate)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Volume and concentration of starch, volume and concentration of amylase, sampling interval, same iodine
                solution{variable === "temperature" ? ", pH" : ", temperature (37 °C)"}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {recorded.length === 0 ? (
          <p className="italic">No readings recorded yet — run the experiment at a few values first.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">{unit}</th>
                <th className="border border-slate-400 p-2">Time for starch to disappear (s)</th>
                <th className="border border-slate-400 p-2">Rate = 1000 ÷ time (s⁻¹)</th>
              </tr>
            </thead>
            <tbody>
              {recorded.map((condition) => {
                const time = results[condition.value];
                return (
                  <tr key={condition.value}>
                    <td className="border border-slate-400 p-2 text-center">{condition.value}</td>
                    <td className="border border-slate-400 p-2 text-center">
                      {time === null ? "not digested in 240 s" : Math.round(time)}
                    </td>
                    <td className="border border-slate-400 p-2 text-center">
                      {time === null ? "0.0" : rateFor(time).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {variable === "temperature" ? (
            <>
              The rate of starch digestion increased as the temperature rose from 0 °C to about 37 °C, because the
              enzyme and substrate molecules gained kinetic energy and collided more often. Above 37 °C the rate fell
              sharply, and at 60 °C and 80 °C the starch was not digested at all. The optimum temperature for amylase is
              therefore about 37 °C. At low temperature the enzyme is only inactive and recovers on warming, but above
              about 50 °C it is denatured — the active site permanently loses its shape, so cooling does not restore
              activity.
            </>
          ) : (
            <>
              Digestion was fastest at pH 7 and slowed on either side of it. At pH 3 and pH 11 the starch was not
              digested at all, because extreme hydrogen-ion concentrations break the bonds that hold the active site in
              shape and denature the enzyme. The optimum pH for salivary amylase is therefore about pH 7.
            </>
          )}
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Sampling only every 20 seconds limits the precision of the end point; shorter intervals would give a more
            accurate time.
          </li>
          <li>Judging the colour change by eye is subjective — a colorimeter would be more reliable.</li>
          <li>
            The tubes must be left in the bath long enough to reach the bath temperature before mixing, or the recorded
            temperature is not the true reaction temperature.
          </li>
          <li>Each reading should be repeated and a mean calculated to reduce the effect of random error.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function EnzymeActivitySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: EnzymeActivitySimProps) {
  const [variable, setVariable] = useState<Variable>("temperature");
  const [conditionIndex, setConditionIndex] = useState(4); // 37 °C
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [mixed, setMixed] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [tempResults, setTempResults] = useState<Record<number, number | null>>({});
  const [phResults, setPhResults] = useState<Record<number, number | null>>({});

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const conditions = variable === "temperature" ? TEMPERATURE_CONDITIONS : PH_CONDITIONS;
  const condition = conditions[Math.min(conditionIndex, conditions.length - 1)];
  const clearTime = useMemo(() => clearTimeFor(condition.activity), [condition.activity]);
  const results = variable === "temperature" ? tempResults : phResults;
  const setResults = variable === "temperature" ? setTempResults : setPhResults;

  const starchRemaining = clearTime === null ? 1 : THREE.MathUtils.clamp(1 - elapsed / clearTime, 0, 1);
  const latestWell = Math.min(WELL_COUNT - 1, Math.floor(elapsed / SAMPLE_INTERVAL_S));
  /** The run ends once the end point is seen, or once the tile is full. */
  const endPointWell = clearTime === null ? null : Math.ceil(clearTime / SAMPLE_INTERVAL_S);
  const endPointReached = endPointWell !== null && elapsed >= endPointWell * SAMPLE_INTERVAL_S;
  const runFinished = endPointReached || elapsed >= MAX_TIME_S;

  /* Animation loop — advances simulated seconds. */
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = ((now - startRef.current) / 1000) * TIME_SCALE;
      const capped = Math.min(next, MAX_TIME_S);
      setElapsed(capped);
      const stop = clearTime === null ? capped >= MAX_TIME_S : capped >= Math.ceil(clearTime / SAMPLE_INTERVAL_S) * SAMPLE_INTERVAL_S;
      if (stop) {
        setRunning(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running, clearTime]);

  /* Record the reading as soon as the run ends. */
  useEffect(() => {
    if (!runFinished || running) return;
    setResults((current) => {
      if (condition.value in current) return current;
      return { ...current, [condition.value]: clearTime };
    });
  }, [runFinished, running, condition.value, clearTime, setResults]);

  const startRun = useCallback(() => {
    setMixed(true);
    startRef.current = performance.now() - (elapsed / TIME_SCALE) * 1000;
    setRunning(true);
  }, [elapsed]);

  const pause = useCallback(() => setRunning(false), []);

  const resetRun = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setMixed(false);
  }, []);

  const selectCondition = useCallback((index: number) => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setMixed(false);
    setConditionIndex(index);
  }, []);

  const switchVariable = useCallback((next: Variable) => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setMixed(false);
    setVariable(next);
    setConditionIndex(next === "temperature" ? 4 : 3); // optimum first
  }, []);

  const clearResults = useCallback(() => {
    if (variable === "temperature") setTempResults({});
    else setPhResults({});
    resetRun();
  }, [variable, resetRun]);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setElapsed(0);
    setMixed(true);
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
  const stepResolved = recordedCount >= 3 ? 3 : running ? 2 : mixed ? 1 : 0;
  const complete = recordedCount >= conditions.length;
  const progress = clearTime === null ? elapsed / MAX_TIME_S : Math.min(1, elapsed / (Math.ceil(clearTime / SAMPLE_INTERVAL_S) * SAMPLE_INTERVAL_S));

  const graphPoints: GraphPoint[] = conditions.map((item) => {
    const time = results[item.value];
    if (!(item.value in results)) return { x: item.value, y: 0, pending: true };
    return { x: item.value, y: rateFor(time ?? null) };
  });

  const bestRecorded = useMemo(() => {
    let best: { value: number; rate: number } | null = null;
    for (const item of conditions) {
      if (!(item.value in results)) continue;
      const rate = rateFor(results[item.value] ?? null);
      if (!best || rate > best.rate) best = { value: item.value, rate };
    }
    return best;
  }, [conditions, results]);

  const unitLabel = variable === "temperature" ? "°C" : "pH";

  const status = running
    ? `${Math.floor(elapsed)} s — spotting well ${latestWell + 1}. ${
        starchRemaining > 0.1 ? "Iodine is still blue-black, so starch remains." : "The colour is fading — the starch is nearly gone."
      }`
    : runFinished && mixed
      ? clearTime === null
        ? `No digestion after 240 s at ${condition.label}. The iodine stayed blue-black — the enzyme is not working here.`
        : `Starch disappeared after about ${Math.round(clearTime)} s at ${condition.label}. Rate = ${rateFor(clearTime).toFixed(1)} s⁻¹.`
      : `Bath set to ${condition.label}. Mix the amylase into the starch and start the clock.`;

  const observation = complete
    ? `All ${conditions.length} values recorded. The optimum is at ${bestRecorded ? `${bestRecorded.value} ${unitLabel}` : "the peak of your graph"}.`
    : bestRecorded
      ? `Fastest so far: ${bestRecorded.value} ${unitLabel} (rate ${bestRecorded.rate.toFixed(1)} s⁻¹). ${recordedCount} of ${conditions.length} recorded.`
      : "Record a reading at each value, then look for the peak of the graph.";

  const primaryLabel = running ? "Timing…" : runFinished && mixed ? "Reset tube" : elapsed > 0 ? "Continue" : "Mix & start clock";

  /* ------------------------------------------------------------ UI panels */

  const variablePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Variable to investigate</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(["temperature", "ph"] as Variable[]).map((item) => (
          <button
            key={item}
            onClick={() => switchVariable(item)}
            className="rounded-xl px-2 py-2 text-[10px] font-black transition"
            style={
              variable === item
                ? { background: ACCENT.base, color: "#0b1020" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {item === "temperature" ? "Temperature" : "pH"}
          </button>
        ))}
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">
        {variable === "temperature"
          ? "pH is held at 7 so temperature is the only variable."
          : "Temperature is held at 37 °C so pH is the only variable."}
      </div>
    </div>
  );

  const conditionPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">
          {variable === "temperature" ? "Water bath" : "Buffer"}
        </span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {condition.label}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {conditions.map((item, index) => {
          const recorded = item.value in results;
          const active = index === conditionIndex;
          return (
            <button
              key={item.value}
              onClick={() => selectCondition(index)}
              className="relative rounded-xl px-1 py-2 text-[10px] font-black transition"
              style={
                active
                  ? { background: ACCENT.base, color: "#0b1020" }
                  : { background: "rgba(255,255,255,0.08)", color: recorded ? "#a7f3d0" : "#e2e8f0" }
              }
            >
              {variable === "temperature" ? item.value : item.label.replace("pH ", "")}
              {recorded && !active && <span className="absolute right-0.5 top-0.5 text-[7px]">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{condition.note}</div>
    </div>
  );

  const clockPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Stop-clock</span>
        <span className="text-lg font-black tabular-nums" style={{ color: ACCENT.text }}>
          {Math.floor(elapsed)} s
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full" style={{ width: `${Math.max(2, progress * 100)}%`, background: ACCENT.base }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase">
        <span className="text-slate-400">Well {latestWell + 1} of {WELL_COUNT}</span>
        <span className={starchRemaining > 0.02 ? "text-indigo-300" : "text-amber-300"}>
          {clearTime === null ? "blue-black" : starchRemaining > 0.02 ? "starch present" : "no starch left"}
        </span>
      </div>
    </div>
  );

  const resultsTable = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <button onClick={clearResults} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="grid grid-cols-3 gap-1 text-[8px] font-black uppercase text-slate-500">
          <span>{variable === "temperature" ? "Temp" : "pH"}</span>
          <span className="text-center">Time / s</span>
          <span className="text-right">Rate</span>
        </div>
        {conditions.map((item) => {
          const recorded = item.value in results;
          const time = results[item.value];
          return (
            <div key={item.value} className="grid grid-cols-3 gap-1 text-[10px]">
              <span className="font-black text-white">{variable === "temperature" ? `${item.value}°` : item.label}</span>
              <span className="text-center text-slate-300">
                {!recorded ? "—" : time === null ? ">240" : Math.round(time)}
              </span>
              <span className="text-right font-black" style={{ color: recorded ? ACCENT.text : "#64748b" }}>
                {!recorded ? "—" : rateFor(time ?? null).toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const graphPanel = (
    <ExperimentResultsGraph
      points={graphPoints}
      xLabel={variable === "temperature" ? "Temperature (°C)" : "pH"}
      yLabel="Rate (1000/t)"
      accentHex={ACCENT.base}
      caption={variable === "temperature" ? "Rate against temperature" : "Rate against pH"}
      xMin={variable === "temperature" ? 0 : 2}
      xMax={variable === "temperature" ? 80 : 12}
      yMax={28}
      footer={
        bestRecorded
          ? `Peak so far at ${bestRecorded.value} ${unitLabel} — this is the optimum.`
          : "Points appear as you record each reading."
      }
    />
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Enzyme Lab"
          subtitle="amylase: starch → maltose"
          symbol="🧬"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to Biology experiments"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={stepResolved}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="enzyme-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.1, 3.05, 4.1], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <EnzymeScene
            variable={variable}
            condition={condition}
            elapsed={elapsed}
            clearTime={clearTime}
            running={running}
            mixed={mixed}
            starchRemaining={starchRemaining}
            latestWell={latestWell}
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
            emoji="🧬"
            cornerEmoji="🌡️"
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
          title="Enzyme Activity"
          tagline="amylase: starch → maltose"
          missions={MISSIONS}
          step={stepResolved}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : runFinished && mixed ? "↺" : "▶"}
          onPrimary={running ? pause : runFinished && mixed ? resetRun : startRun}
          onReset={resetRun}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "variable", label: "Variable", value: variable === "temperature" ? "Temp" : "pH", content: variablePanel },
            { id: "condition", label: "Setting", value: condition.label, content: conditionPanel },
            { id: "clock", label: "Clock", value: `${Math.floor(elapsed)}s`, content: clockPanel },
            { id: "graph", label: "Graph", value: `${recordedCount}/${conditions.length}`, content: graphPanel },
            { id: "table", label: "Table", value: `${recordedCount}`, content: resultsTable },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "run",
              label: running ? "Pause" : runFinished && mixed ? "Reset" : "Mix & start",
              onClick: running ? pause : runFinished && mixed ? resetRun : startRun,
              tone: running ? "red" : "green",
            },
            {
              id: "next",
              label: "Next value",
              onClick: () => selectCondition((conditionIndex + 1) % conditions.length),
              tone: "orange",
            },
            { id: "reset", label: "Clear all", onClick: clearResults, tone: "dark" },
          ]}
          panels={[
            { id: "variable", label: "Variable", value: variable === "temperature" ? "Temp" : "pH", content: variablePanel },
            { id: "condition", label: "Setting", value: condition.label, content: conditionPanel },
            { id: "clock", label: "Clock", value: `${Math.floor(elapsed)}s`, content: clockPanel },
            { id: "graph", label: "Graph", value: `${recordedCount}/${conditions.length}`, content: graphPanel },
            { id: "table", label: "Table", value: `${recordedCount}`, content: resultsTable },
          ]}
        />
      )}

      {showPaper && <EnzymePaper variable={variable} results={results} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
