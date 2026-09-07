"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
import { labSounds } from "../../../../lib/audio/labSounds";

interface CurveSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.indigo;
const PAPER_FILENAME = "heating-and-cooling-curve.html";

const ROOM_TEMP = 22;
/** Power delivered to the tube by the water bath. */
const HEATING_POWER = 12; // W
const RECORD_INTERVAL = 30; // s between recorded readings
const RUN_DURATION_MS = 11000;

type Mode = "heating" | "cooling";
type Phase = "solid" | "changing" | "liquid";

interface Substance {
  id: "naphthalene" | "stearic" | "water";
  label: string;
  /** Melting (= freezing) point in °C. */
  meltingPoint: number;
  massKg: number;
  cSolid: number;
  cLiquid: number;
  /** Specific latent heat of fusion, J kg⁻¹. */
  latentHeat: number;
  solidColour: string;
  liquidColour: string;
  solidName: string;
  liquidName: string;
  topTemp: number;
  bottomTemp: number;
  /** Where the tube starts on a heating run. */
  startTemp: number;
  /** Temperature of the surroundings the tube cools into on a cooling run. */
  surroundings: number;
  /** Newton cooling constant for that setup, in W per °C. */
  coolingK: number;
  /** What the tube is stood in to cool. */
  coolingIn: string;
}

const SUBSTANCES: Substance[] = [
  {
    id: "naphthalene",
    label: "Naphthalene",
    meltingPoint: 80,
    massKg: 0.02,
    cSolid: 1300,
    cLiquid: 1700,
    latentHeat: 148000,
    solidColour: "#f8fafc",
    liquidColour: "#e2e8f0",
    solidName: "white crystals",
    liquidName: "clear liquid",
    topTemp: 95,
    bottomTemp: 45,
    startTemp: 22,
    surroundings: ROOM_TEMP,
    coolingK: 0.15,
    coolingIn: "air",
  },
  {
    id: "stearic",
    label: "Stearic acid",
    meltingPoint: 69,
    massKg: 0.02,
    cSolid: 1600,
    cLiquid: 2300,
    latentHeat: 199000,
    solidColour: "#fef9c3",
    liquidColour: "#fde68a",
    solidName: "waxy white solid",
    liquidName: "pale oily liquid",
    topTemp: 88,
    bottomTemp: 40,
    startTemp: 22,
    surroundings: ROOM_TEMP,
    coolingK: 0.15,
    coolingIn: "air",
  },
  {
    id: "water",
    label: "Ice and water",
    meltingPoint: 0,
    massKg: 0.02,
    cSolid: 2100,
    cLiquid: 4200,
    latentHeat: 334000,
    solidColour: "#e0f2fe",
    liquidColour: "#7dd3fc",
    solidName: "crushed ice",
    liquidName: "water",
    topTemp: 30,
    bottomTemp: -12,
    startTemp: -10,
    // Water cannot freeze in a room, so the cooling run stands the tube in an ice-and-salt freezing mixture.
    surroundings: -18,
    coolingK: 0.5,
    coolingIn: "a freezing mixture of ice and salt",
  },
];

interface Sample {
  time: number;
  temp: number;
  phase: Phase;
}

const CURVE_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Set up the tube",
    detail: "Put the solid in a test tube with a thermometer in it and stand the tube in a water bath.",
    symbol: "🧪",
  },
  {
    short: "Record",
    title: "Record every 30 seconds",
    detail: "Start the stopwatch and write down the temperature every half a minute.",
    symbol: "⏱️",
  },
  {
    short: "Plateau",
    title: "Watch the plateau",
    detail: "While the solid is melting the temperature stops rising even though heat is still going in.",
    symbol: "➖",
  },
  {
    short: "Graph",
    title: "Plot and read off",
    detail: "Plot temperature against time. The flat part of the graph gives the melting point.",
    symbol: "📈",
  },
];

const curveTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Heating and cooling curves",
    text: "When a pure solid melts, its temperature stays constant even though heat is still being supplied. The energy is used to break the forces between the particles — this is the latent heat of fusion.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "The substance is in a test tube with a thermometer. A water bath heats it gently and evenly so the whole sample is at the same temperature.",
    mode: "bubble",
    selector: '[data-experiment-tour="curve-scene"]',
  },
  {
    title: "Heating or cooling",
    text: "Choose the substance and whether to heat it up or take it out of the bath and let it cool. Both give a plateau at the same temperature.",
    mode: "bubble",
    selector: '[data-experiment-tour="curve-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Reading the melting point",
    text: "The flat section of the graph is the melting point on heating, and the freezing point on cooling — for a pure substance these are the same temperature.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/** Builds the full temperature–time curve, second by second, with a latent-heat plateau. */
function simulateCurve(substance: Substance, mode: Mode): Sample[] {
  const samples: Sample[] = [];
  const latentTotal = substance.massKg * substance.latentHeat;
  const heatCapacitySolid = substance.massKg * substance.cSolid;
  const heatCapacityLiquid = substance.massKg * substance.cLiquid;

  if (mode === "heating") {
    let temp = substance.startTemp;
    let latentAbsorbed = 0;
    for (let time = 0; time <= 1800; time += 1) {
      const phase: Phase =
        temp < substance.meltingPoint - 1e-6 ? "solid" : latentAbsorbed < latentTotal ? "changing" : "liquid";
      samples.push({ time, temp, phase });
      if (temp >= substance.topTemp) break;
      if (phase === "solid") {
        temp = Math.min(substance.meltingPoint, temp + HEATING_POWER / heatCapacitySolid);
      } else if (phase === "changing") {
        latentAbsorbed += HEATING_POWER;
      } else {
        temp += HEATING_POWER / heatCapacityLiquid;
      }
    }
    return samples;
  }

  let temp = substance.topTemp;
  let latentReleased = 0;
  for (let time = 0; time <= 1800; time += 1) {
    const phase: Phase =
      temp > substance.meltingPoint + 1e-6 ? "liquid" : latentReleased < latentTotal ? "changing" : "solid";
    samples.push({ time, temp, phase });
    if (temp <= substance.bottomTemp) break;
    const lossRate = substance.coolingK * (temp - substance.surroundings);
    // Once the tube has reached the temperature of its surroundings it can cool no further.
    if (lossRate <= 0.01) break;
    if (phase === "liquid") {
      temp = Math.max(substance.meltingPoint, temp - lossRate / heatCapacityLiquid);
    } else if (phase === "changing") {
      latentReleased += Math.max(0.2, lossRate);
    } else {
      temp -= lossRate / heatCapacitySolid;
    }
  }
  return samples;
}

/* ------------------------------------------------------------------ 3D bits */

function BunsenFlame({ on }: { on: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!flameRef.current) return;
    const flicker = 1 + Math.sin(clock.elapsedTime * 14) * 0.06 + Math.sin(clock.elapsedTime * 23) * 0.03;
    flameRef.current.scale.set(flicker, flicker, flicker);
  });
  return (
    <group position={[0, BENCH_TOP_Y, -0.02]}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.06, 20]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.42, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.42} />
      </mesh>
      {on && (
        <>
          <mesh ref={flameRef} position={[0, 0.6, 0]}>
            <coneGeometry args={[0.05, 0.34, 16]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0.53, 0]}>
            <coneGeometry args={[0.026, 0.18, 14]} />
            <meshBasicMaterial color="#1d4ed8" transparent opacity={0.75} />
          </mesh>
          <pointLight position={[0, 0.62, 0]} intensity={1.4} distance={2.2} color="#93c5fd" />
        </>
      )}
    </group>
  );
}

function Tripod() {
  return (
    <group position={[0, BENCH_TOP_Y, -0.02]}>
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle) => (
        <mesh
          key={angle}
          position={[Math.cos(angle) * 0.24, 0.42, Math.sin(angle) * 0.24]}
          rotation={[0, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.012, 0.012, 0.84, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.84, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.25, 0.014, 8, 26]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Gauze */}
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function WaterBath({ hot, present }: { hot: number; present: boolean }) {
  if (!present) return null;
  const water = new THREE.Color("#bfdbfe").lerp(new THREE.Color("#fca5a5"), THREE.MathUtils.clamp(hot, 0, 1) * 0.35);
  return (
    <group position={[0, BENCH_TOP_Y + 0.86, -0.02]}>
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.44, 30, 1, true]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.22} transmission={0.85} roughness={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.01, 30]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.3} transmission={0.8} roughness={0.06} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.3, 30]} />
        <meshStandardMaterial color={`#${water.getHexString()}`} transparent opacity={0.55} roughness={0.18} />
      </mesh>
    </group>
  );
}

function TestTube({ substance, temp, phase, meltFraction }: { substance: Substance; temp: number; phase: Phase; meltFraction: number }) {
  const granules = useMemo(
    () =>
      Array.from({ length: 14 }, () => ({
        x: (Math.random() - 0.5) * 0.1,
        z: (Math.random() - 0.5) * 0.1,
        y: 0.03 + Math.random() * 0.14,
        scale: 0.7 + Math.random() * 0.6,
      })),
    [],
  );
  const solidFraction = 1 - THREE.MathUtils.clamp(meltFraction, 0, 1);

  return (
    <group>
      {/* Glass */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.56, 24, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.2} transmission={0.8} roughness={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.015, 0]}>
        <sphereGeometry args={[0.09, 22, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.22} transmission={0.8} roughness={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Melted liquid pools at the bottom; solid granules sit above what is left */}
      <mesh position={[0, 0.015 + (meltFraction * 0.2) / 2, 0]}>
        <cylinderGeometry args={[0.082, 0.082, Math.max(0.002, meltFraction * 0.2), 22]} />
        <meshStandardMaterial color={substance.liquidColour} transparent opacity={0.75} roughness={0.15} />
      </mesh>
      {granules.slice(0, Math.round(granules.length * solidFraction)).map((granule, index) => (
        <mesh key={index} position={[granule.x, granule.y + meltFraction * 0.16, granule.z]} scale={granule.scale}>
          <boxGeometry args={[0.028, 0.028, 0.028]} />
          <meshStandardMaterial color={substance.solidColour} roughness={0.85} />
        </mesh>
      ))}

      {/* Thermometer down the middle */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.86, 14]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.35} transmission={0.85} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.2 + (THREE.MathUtils.clamp((temp + 20) / 120, 0.05, 1) * 0.74) / 2, 0]}>
        <cylinderGeometry args={[0.0065, 0.0065, THREE.MathUtils.clamp((temp + 20) / 120, 0.05, 1) * 0.74, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.016, 12, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      <Html position={[0.26, 0.78, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="w-[86px] rounded-lg border border-indigo-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[11px] font-black text-white">{temp.toFixed(1)} °C</div>
          <div className="text-[7px] font-black uppercase text-indigo-200">
            {phase === "changing" ? "changing state" : phase === "solid" ? substance.solidName : substance.liquidName}
          </div>
        </div>
      </Html>
    </group>
  );
}

function CurveScene({
  substance,
  mode,
  temp,
  phase,
  meltFraction,
  heating,
  viewMode,
  isMobile,
  moveVectorRef,
}: {
  substance: Substance;
  mode: Mode;
  temp: number;
  phase: Phase;
  meltFraction: number;
  heating: boolean;
  viewMode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (viewMode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.8, 2.95, 3.1] : [1, 2.85, 2.7];
    camera.position.set(...position);
    camera.lookAt(0, 2.1, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, viewMode]);

  /** In cooling mode the tube is lifted out of the bath and clamped in the air. */
  const inBath = mode === "heating";

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#4f46e5"
        benchColor="#eef2f4"
        posterA={{
          title: "CHANGE OF STATE",
          lines: [
            "Melting point = freezing point",
            "Temperature stays constant while melting",
            "Energy goes to latent heat, not temperature",
            "Q = m L for the change of state",
          ],
        }}
        posterB={{
          title: "PARTICLES",
          lines: ["Solid: particles vibrate in fixed places", "Melting: forces between particles are broken", "Liquid: particles slide over each other"],
        }}
      >
        <Tripod />
        <BunsenFlame on={heating && inBath} />
        <WaterBath hot={(temp - ROOM_TEMP) / 70} present={inBath} />

        {/* Retort stand holding the test tube */}
        <group position={[0.72, BENCH_TOP_Y, -0.02]}>
          <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.42, 0.06, 0.34]} />
            <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[-0.36, inBath ? 1.35 : 1.55, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.013, 0.013, 0.72, 10]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
          </mesh>
        </group>

        <group position={[0, BENCH_TOP_Y + (inBath ? 0.92 : 1.42), -0.02]}>
          <TestTube substance={substance} temp={temp} phase={phase} meltFraction={meltFraction} />
        </group>

        <Html position={[-0.72, BENCH_TOP_Y + 1.5, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="rounded-lg border border-white/20 bg-slate-950/92 px-2 py-1 text-center">
            <div className="text-[8px] font-black uppercase text-indigo-200">
              {mode === "heating" ? "Heating in a water bath" : `Cooling in ${substance.coolingIn}`}
            </div>
            <div className="text-[7px] font-bold text-slate-300">
              {substance.label} · m.p. {substance.meltingPoint} °C
            </div>
          </div>
        </Html>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {viewMode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.1, 0]} minDistance={1.5} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* --------------------------------------------------------------- The graph */

function CurveGraph({ samples, substance, total }: { samples: Sample[]; substance: Substance; total: number }) {
  if (samples.length < 2) {
    return <p className="text-[10px] font-bold text-slate-500">Start the run to plot the curve.</p>;
  }
  const width = 220;
  const height = 116;
  const minTemp = Math.min(-15, substance.bottomTemp - 5);
  const maxTemp = substance.topTemp + 8;
  const px = (time: number) => 30 + (time / total) * width;
  const py = (temp: number) => height + 6 - ((temp - minTemp) / (maxTemp - minTemp)) * height;

  return (
    <svg viewBox={`0 0 ${width + 42} ${height + 30}`} className="w-full">
      <line x1={30} y1={4} x2={30} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      <line x1={30} y1={height + 6} x2={width + 34} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      {/* Melting-point guide line */}
      <line x1={30} y1={py(substance.meltingPoint)} x2={width + 34} y2={py(substance.meltingPoint)} stroke="#818cf8" strokeWidth={0.9} strokeDasharray="4 3" />
      <text x={2} y={py(substance.meltingPoint) + 3} fill="#a5b4fc" fontSize={7} fontWeight={800}>
        {substance.meltingPoint}
      </text>
      {[minTemp, maxTemp].map((tick) => (
        <text key={tick} x={2} y={py(tick) + 3} fill="#64748b" fontSize={7}>
          {Math.round(tick)}
        </text>
      ))}
      <polyline
        points={samples.map((sample) => `${px(sample.time)},${py(sample.temp)}`).join(" ")}
        fill="none"
        stroke="#6366f1"
        strokeWidth={2}
      />
      {/* Highlight the plateau */}
      <polyline
        points={samples
          .filter((sample) => sample.phase === "changing")
          .map((sample) => `${px(sample.time)},${py(sample.temp)}`)
          .join(" ")}
        fill="none"
        stroke="#fbbf24"
        strokeWidth={3}
      />
      <text x={2} y={12} fill="#94a3b8" fontSize={7} fontWeight={800}>
        θ / °C
      </text>
      <text x={width + 6} y={height + 22} fill="#94a3b8" fontSize={8} fontWeight={800}>
        t / s
      </text>
      <text x={38} y={16} fill="#fcd34d" fontSize={8} fontWeight={800}>
        flat section = melting point
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function CurvePaper({
  substance,
  mode,
  readings,
  plateauStart,
  plateauEnd,
  onClose,
}: {
  substance: Substance;
  mode: Mode;
  readings: Sample[];
  plateauStart: number | null;
  plateauEnd: number | null;
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          {mode === "heating" ? "Heating Curve and the Melting Point of a Solid" : "Cooling Curve and the Freezing Point of a Liquid"}
        </h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To follow the temperature of {substance.label.toLowerCase()} as it {mode === "heating" ? "is heated and melts" : "cools and solidifies"}, and
          to find its {mode === "heating" ? "melting" : "freezing"} point from the flat part of the temperature–time graph.
        </p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Test tube containing {substance.label.toLowerCase()}, thermometer (−10 to 110 °C), beaker of water (water bath), tripod, gauze, Bunsen burner, retort stand and clamp, stopwatch, graph paper.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The test tube containing the {substance.solidName} was clamped with a thermometer in the substance.</li>
          <li>The tube was stood in a beaker of water, which was heated gently with a Bunsen burner so the sample warmed slowly and evenly.</li>
          <li>The stopwatch was started and the temperature recorded every {RECORD_INTERVAL} s.</li>
          {mode === "cooling" ? (
            <li>Once the substance had melted the tube was lifted out of the bath and allowed to cool in {substance.coolingIn}, the temperature still being recorded every {RECORD_INTERVAL} s.</li>
          ) : (
            <li>Readings were continued until the substance had completely melted and the temperature was rising again.</li>
          )}
          <li>A graph of temperature against time was plotted.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Time / s</th>
              <th className="border border-slate-400 p-2">Temperature / °C</th>
              <th className="border border-slate-400 p-2">Observation</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading) => (
              <tr key={reading.time}>
                <td className="border border-slate-400 p-2 text-center">{reading.time}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.temp.toFixed(1)}</td>
                <td className="border border-slate-400 p-2">
                  {reading.phase === "changing"
                    ? mode === "heating"
                      ? "Solid and liquid together — temperature constant"
                      : "Liquid and solid together — temperature constant"
                    : reading.phase === "solid"
                      ? `All ${substance.solidName}`
                      : `All ${substance.liquidName}`}
                </td>
              </tr>
            ))}
            {!readings.length &&
              [0, 1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  <td className="border border-slate-400 p-2 text-center">{row * RECORD_INTERVAL}</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Graph</h2>
        <p>
          Temperature was plotted on the y-axis against time on the x-axis. The graph
          {mode === "heating" ? " rose, then flattened out, then rose again." : " fell, then flattened out, then fell again."}
          {plateauStart !== null && plateauEnd !== null
            ? ` The flat section ran from about ${plateauStart} s to ${plateauEnd} s, a total of ${plateauEnd - plateauStart} s.`
            : ""}
        </p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The {mode === "heating" ? "melting" : "freezing"} point of {substance.label.toLowerCase()} is{" "}
          {substance.meltingPoint} °C, read from the flat part of the graph. During this flat section heat was still being
          {mode === "heating" ? " supplied" : " lost"}, but the temperature did not change: the energy was used to
          {mode === "heating" ? " break the forces holding the particles in the solid lattice" : " let the particles settle back into a solid lattice"}.
          This energy is the latent heat of fusion. A sharp, level plateau is also evidence that the substance is pure —
          an impure sample melts over a range of temperatures.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function HeatingCoolingCurveSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: CurveSimProps) {
  const [substanceId, setSubstanceId] = useState<Substance["id"]>("naphthalene");
  const [runMode, setRunMode] = useState<Mode>("heating");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [viewMode, setViewMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  const substance = SUBSTANCES.find((each) => each.id === substanceId)!;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const fullRun = useMemo(() => simulateCurve(substance, runMode), [runMode, substance]);
  const totalTime = fullRun[fullRun.length - 1].time;
  const index = Math.min(fullRun.length - 1, Math.round(elapsed));
  const samples = fullRun.slice(0, index + 1);
  const currentSample = fullRun[index];
  const finished = elapsed >= totalTime;

  const changingSamples = fullRun.filter((sample) => sample.phase === "changing");
  const plateauStart = changingSamples.length ? changingSamples[0].time : null;
  const plateauEnd = changingSamples.length ? changingSamples[changingSamples.length - 1].time : null;

  /** How much of the sample has changed state so far, for the 3D tube. */
  const meltFraction = useMemo(() => {
    const seen = samples.filter((sample) => sample.phase === "changing").length;
    const totalChanging = changingSamples.length || 1;
    if (runMode === "heating") {
      return currentSample.phase === "liquid" ? 1 : seen / totalChanging;
    }
    return currentSample.phase === "solid" ? 0 : 1 - seen / totalChanging;
  }, [changingSamples.length, currentSample.phase, runMode, samples]);

  const readings = useMemo(
    () => samples.filter((sample) => sample.time % RECORD_INTERVAL === 0),
    [samples],
  );

  const progress = elapsed / totalTime;
  const inPlateau = currentSample.phase === "changing";
  const step = finished ? 3 : inPlateau ? 2 : running ? 1 : 0;
  const complete = finished;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      setElapsed(fraction * totalTime);
      if (fraction >= 1) {
        setRunning(false);
        setElapsed(totalTime);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running, totalTime]);

  const startRun = useCallback(() => {
    labSounds.play("bunsenIgnite", { volume: 0.5 });
    labSounds.loop("bunsenFlame", { volume: 0.2 });
    setElapsed(0);
    startRef.current = performance.now();
    setRunning(true);
  }, []);

  const changeSetting = useCallback((apply: () => void) => {
    apply();
    setRunning(false);
    setElapsed(0);
  }, []);

  const resetAll = useCallback(() => {
    setDemoActive(false);
    setRunning(false);
    setElapsed(0);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setElapsed(0);
    startRef.current = performance.now();
    setRunning(true);
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setViewMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? `The flat part of the graph sits at ${substance.meltingPoint} °C — that is the ${runMode === "heating" ? "melting" : "freezing"} point of ${substance.label.toLowerCase()}.`
    : inPlateau
      ? `${currentSample.temp.toFixed(1)} °C and holding. Heat is still ${runMode === "heating" ? "going in" : "coming out"}, but the temperature is not changing — this is the latent heat.`
      : running
        ? `${currentSample.temp.toFixed(1)} °C at ${Math.round(elapsed)} s — the temperature is ${runMode === "heating" ? "rising" : "falling"} steadily.`
        : `${substance.label} at ${fullRun[0].temp.toFixed(0)} °C. Start the ${runMode === "heating" ? "heating" : "cooling"} run and record every ${RECORD_INTERVAL} s.`;

  const observation = complete
    ? `Plateau from ${plateauStart} s to ${plateauEnd} s at ${substance.meltingPoint} °C — a sharp, level plateau shows a pure substance.`
    : "While a pure substance changes state its temperature stays constant.";

  const primaryLabel = complete ? "Run again" : running ? "Recording…" : runMode === "heating" ? "Light the Bunsen" : "Lift out and cool";

  const setupControls = (
    <div data-experiment-tour="curve-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Substance</span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {SUBSTANCES.map((option) => (
            <button
              key={option.id}
              onClick={() => changeSetting(() => setSubstanceId(option.id))}
              className="rounded-xl px-1 py-2 text-[9px] font-black leading-tight transition"
              style={option.id === substanceId ? { background: ACCENT.base, color: "#0b0a24" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option.label}
              <span className="mt-0.5 block text-[8px] font-bold opacity-80">{option.meltingPoint} °C</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Run</span>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {(["heating", "cooling"] as Mode[]).map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setRunMode(option))}
              className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition"
              style={option === runMode ? { background: ACCENT.base, color: "#0b0a24" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option === "heating" ? "Heating" : "Cooling"}
              <span className="mt-0.5 block text-[8px] font-bold opacity-80">
                {option === "heating" ? "melting point" : "freezing point"}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const graphPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Temperature–time</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {currentSample.temp.toFixed(1)} °C
        </span>
      </div>
      <div className="mt-1.5">
        <CurveGraph samples={samples} substance={substance} total={totalTime} />
      </div>
      {complete && plateauStart !== null && plateauEnd !== null && (
        <div className="mt-1.5 rounded-xl bg-amber-500/15 px-2 py-1.5 text-[9px] font-bold text-amber-200">
          Plateau lasted {plateauEnd - plateauStart} s at {substance.meltingPoint} °C — the latent heat of fusion.
        </div>
      )}
    </div>
  );

  const tablePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Readings every {RECORD_INTERVAL} s</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length}
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Start the run to fill the table.</p>
      ) : (
        <div className="mt-2 max-h-40 overflow-y-auto">
          <table className="w-full text-[9px]">
            <thead>
              <tr className="text-slate-400">
                <th className="py-0.5 text-left font-black uppercase">t / s</th>
                <th className="py-0.5 text-right font-black uppercase">θ / °C</th>
                <th className="py-0.5 text-right font-black uppercase">State</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading) => (
                <tr key={reading.time} className="border-t border-white/5 text-slate-200">
                  <td className="py-1 font-bold">{reading.time}</td>
                  <td className="py-1 text-right font-black">{reading.temp.toFixed(1)}</td>
                  <td
                    className="py-1 text-right font-black"
                    style={{ color: reading.phase === "changing" ? "#fcd34d" : "#94a3b8" }}
                  >
                    {reading.phase === "changing" ? "melting" : reading.phase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Change of State Lab"
          subtitle="the plateau gives the melting point"
          symbol="🌡️"
          accent={ACCENT}
          mode={viewMode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={complete ? 4 : step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="curve-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1, 2.85, 2.7], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <CurveScene
            substance={substance}
            mode={runMode}
            temp={currentSample.temp}
            phase={currentSample.phase}
            meltFraction={meltFraction}
            heating={running}
            viewMode={viewMode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
          />
        </Canvas>

        {viewMode === "doing" && isMobileViewport && <MobileGtaNavigation moveVector={moveVectorRef} />}

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={viewMode}
          onModeChange={handleModeChange}
        />

        {viewMode === "learning" && (
          <CombinedScienceGoalCard
            accent={ACCENT}
            emoji="🌡️"
            cornerEmoji="🧊"
            status={status}
            running={running}
            progress={progress}
            complete={complete}
          />
        )}

        {viewMode === "learning" && !isMobileViewport && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">
            Drag to look around · scroll to zoom
          </div>
        )}
        {viewMode === "doing" && !isMobileViewport && (
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
          title="Heating & Cooling Curves"
          tagline="the plateau gives the melting point"
          missions={CURVE_MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : running ? "⏳" : "🔥"}
          onPrimary={startRun}
          primaryDisabled={running}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Set up", value: substance.label, content: setupControls },
            { id: "graph", label: "Graph", value: `${currentSample.temp.toFixed(0)}°C`, content: graphPanel },
            { id: "table", label: "Table", value: `${readings.length}`, content: tablePanel },
          ]}
        />
      )}

      {viewMode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "start", label: running ? "Recording" : "Start", onClick: startRun, disabled: running, tone: "red" },
            {
              id: "mode",
              label: runMode === "heating" ? "Cool it" : "Heat it",
              onClick: () => changeSetting(() => setRunMode(runMode === "heating" ? "cooling" : "heating")),
              tone: "blue",
            },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Set up", value: substance.label, content: setupControls },
            { id: "graph", label: "Graph", value: `${currentSample.temp.toFixed(0)}°C`, content: graphPanel },
            { id: "table", label: "Table", value: `${readings.length}`, content: tablePanel },
          ]}
        />
      )}

      {showPaper && (
        <CurvePaper
          substance={substance}
          mode={runMode}
          readings={readings}
          plateauStart={plateauStart}
          plateauEnd={plateauEnd}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={curveTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
