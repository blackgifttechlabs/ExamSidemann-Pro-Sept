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
import { labSounds } from "../../../../lib/audio/labSounds";

interface BoyleSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.lime;
const PAPER_FILENAME = "boyles-law-pressure-and-volume.html";

/** Atmospheric pressure, in kilopascals, at which the tube starts. */
const ATMOSPHERIC = 100;
const START_VOLUME = 50; // cm³ of trapped air at atmospheric pressure
/** For a fixed mass of gas at constant temperature, P × V is constant. */
const BOYLE_CONSTANT = ATMOSPHERIC * START_VOLUME;
const MAX_PRESSURE = 320;
const MIN_PRESSURE = 100;
const PRESSURE_STEP = 25;
/** Full scale of the graduated tube. */
const TUBE_MAX_VOLUME = 60;
const TUBE_VISUAL_LENGTH = 1.5;

interface Reading {
  id: string;
  pressure: number;
  volume: number;
}

const BOYLE_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Read the starting values",
    detail: "With the tap open to the air, note the volume of the trapped air column and the pressure on the Bourdon gauge.",
    symbol: "🧪",
  },
  {
    short: "Pump",
    title: "Increase the pressure",
    detail: "Work the pump to force oil up the tube. Wait a few seconds after each pump so the air returns to room temperature.",
    symbol: "🔧",
  },
  {
    short: "Record",
    title: "Take several readings",
    detail: "Record the pressure and the volume of trapped air for at least five different pressures.",
    symbol: "📝",
  },
  {
    short: "Graph",
    title: "Plot P against 1/V",
    detail: "A straight line through the origin shows that P is inversely proportional to V, so P × V is constant.",
    symbol: "📈",
  },
];

const boyleTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Boyle's law",
    text: "For a fixed mass of gas kept at constant temperature, the pressure is inversely proportional to the volume: P ∝ 1/V, so P × V is a constant.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "Air is trapped in a graduated glass tube above a column of oil. A pump pushes oil up the tube and a Bourdon gauge reads the pressure of the trapped air.",
    mode: "bubble",
    selector: '[data-experiment-tour="boyle-scene"]',
  },
  {
    title: "Pump and record",
    text: "Raise the pressure step by step, waiting each time for the gas to return to room temperature, then record the volume.",
    mode: "bubble",
    selector: '[data-experiment-tour="boyle-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Two graphs",
    text: "P against V gives a curve, but P against 1/V gives a straight line through the origin — that is the proof of the law.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
];

const volumeAt = (pressure: number) => BOYLE_CONSTANT / pressure;

/* ------------------------------------------------------------------ 3D bits */

function GraduatedTube({ volume }: { volume: number }) {
  const airLength = (volume / TUBE_MAX_VOLUME) * TUBE_VISUAL_LENGTH;
  const oilLength = TUBE_VISUAL_LENGTH - airLength;
  const graduations = useMemo(() => Array.from({ length: 13 }, (_, index) => index * 5), []);

  return (
    <group>
      {/* Glass wall */}
      <mesh position={[0, TUBE_VISUAL_LENGTH / 2, 0]}>
        <cylinderGeometry args={[0.085, 0.085, TUBE_VISUAL_LENGTH, 26, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.2} transmission={0.85} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Sealed top */}
      <mesh position={[0, TUBE_VISUAL_LENGTH + 0.02, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.04, 26]} />
        <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Trapped air sits at the top of the tube */}
      <mesh position={[0, TUBE_VISUAL_LENGTH - airLength / 2, 0]}>
        <cylinderGeometry args={[0.079, 0.079, airLength, 26]} />
        <meshStandardMaterial color="#ecfccb" transparent opacity={0.3} roughness={0.1} />
      </mesh>
      {/* Oil below it */}
      <mesh position={[0, oilLength / 2, 0]}>
        <cylinderGeometry args={[0.079, 0.079, oilLength, 26]} />
        <meshStandardMaterial color="#a16207" transparent opacity={0.85} roughness={0.24} />
      </mesh>

      {/* Volume scale beside the tube */}
      <mesh position={[0.12, TUBE_VISUAL_LENGTH / 2, 0]}>
        <boxGeometry args={[0.06, TUBE_VISUAL_LENGTH, 0.006]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.85} />
      </mesh>
      {graduations.map((mark) => (
        <mesh key={mark} position={[0.12, (mark / TUBE_MAX_VOLUME) * TUBE_VISUAL_LENGTH, 0.005]}>
          <boxGeometry args={[mark % 10 === 0 ? 0.05 : 0.03, 0.004, 0.002]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Marker at the oil–air boundary */}
      <Html position={[0.34, oilLength, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="w-[86px] rounded-lg border border-lime-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[10px] font-black text-white">{volume.toFixed(1)} cm³</div>
          <div className="text-[7px] font-black uppercase text-lime-200">trapped air</div>
        </div>
      </Html>
    </group>
  );
}

function BourdonGauge({ pressure }: { pressure: number }) {
  /** Needle sweeps 240° over a 0–400 kPa scale. */
  const fraction = THREE.MathUtils.clamp(pressure / 400, 0, 1);
  const angle = Math.PI * 1.2 - fraction * Math.PI * 1.6;

  return (
    <group>
      <mesh rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.07, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.01, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      {/* Needle */}
      <group position={[0, 0, 0.05]} rotation={[0, 0, angle]}>
        <mesh position={[0.09, 0, 0]}>
          <boxGeometry args={[0.19, 0.014, 0.004]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.056]}>
        <cylinderGeometry args={[0.022, 0.022, 0.01, 14]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Connection to the tube */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.32, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.75} roughness={0.35} />
      </mesh>
      <Html position={[0, -0.12, 0.07]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
        <div className="text-center">
          <div className="text-[9px] font-black leading-none text-slate-900">{pressure.toFixed(0)}</div>
          <div className="text-[5px] font-bold uppercase text-slate-600">kPa</div>
        </div>
      </Html>
    </group>
  );
}

function FootPump({ stroke }: { stroke: number }) {
  return (
    <group>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.42, 0.1, 0.34]} />
        <meshStandardMaterial color="#1f2937" roughness={0.6} />
      </mesh>
      {/* Barrel and piston */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.42, 18]} />
        <meshStandardMaterial color="#475569" metalness={0.65} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.6 - stroke * 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.34, 14]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.78 - stroke * 0.16, 0]} castShadow>
        <boxGeometry args={[0.28, 0.05, 0.14]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.8} />
      </mesh>
      {/* Flexible hose towards the oil reservoir */}
      <mesh position={[-0.35, 0.16, 0]} rotation={[0, 0, Math.PI / 2 - 0.35]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.72, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
    </group>
  );
}

function OilReservoir() {
  return (
    <group>
      <mesh position={[0, 0.17, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.34, 24, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.24} transmission={0.85} roughness={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.01, 24]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.3} transmission={0.8} roughness={0.06} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.183, 0.183, 0.2, 24]} />
        <meshStandardMaterial color="#a16207" transparent opacity={0.85} roughness={0.24} />
      </mesh>
    </group>
  );
}

function BoyleScene({
  pressure,
  volume,
  stroke,
  mode,
  isMobile,
  moveVectorRef,
}: {
  pressure: number;
  volume: number;
  stroke: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.5, 3.05, 3.4] : [0.75, 2.95, 3];
    camera.position.set(...position);
    camera.lookAt(0, 2.2, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#65a30d"
        benchColor="#eef2f4"
        posterA={{
          title: "BOYLE'S LAW",
          lines: [
            "P ∝ 1/V at constant temperature",
            "P₁V₁ = P₂V₂ for a fixed mass of gas",
            "P against 1/V: straight line through origin",
            "P against V: a smooth curve (hyperbola)",
          ],
        }}
        posterB={{
          title: "PARTICLES",
          lines: ["Squeeze the gas into half the volume", "Particles hit the walls twice as often", "So the pressure doubles"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {/* Baseboard */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[2.2, 0.04, 0.7]} />
            <meshStandardMaterial color="#44403c" roughness={0.85} />
          </mesh>
          {/* Upright supporting the tube */}
          <mesh position={[-0.16, 0.85, -0.14]} castShadow>
            <boxGeometry args={[0.09, 1.66, 0.09]} />
            <meshStandardMaterial color="#57534e" roughness={0.8} />
          </mesh>

          <group position={[0, 0.06, 0]}>
            <GraduatedTube volume={volume} />
          </group>
          <group position={[0.72, 1.1, 0]}>
            <BourdonGauge pressure={pressure} />
          </group>
          <group position={[-0.78, 0.04, 0.05]}>
            <OilReservoir />
          </group>
          <group position={[-0.78, 0.04, 0.05]}>
            <mesh position={[0.4, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.02, 0.02, 0.78, 10]} />
              <meshStandardMaterial color="#0f172a" roughness={0.8} />
            </mesh>
          </group>
          <group position={[-1.45, 0.04, 0.1]}>
            <FootPump stroke={stroke} />
          </group>
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.2, 0]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------- Boyle plots */

function BoylePlots({ readings }: { readings: Reading[] }) {
  const width = 96;
  const height = 92;
  const maxPressure = 350;
  const maxVolume = 60;
  const maxInverse = 0.022;

  const pvPoints = readings.map((reading) => ({
    x: 22 + (reading.volume / maxVolume) * width,
    y: height + 6 - (reading.pressure / maxPressure) * height,
  }));
  const inversePoints = readings.map((reading) => ({
    x: 152 + (1 / reading.volume / maxInverse) * width,
    y: height + 6 - (reading.pressure / maxPressure) * height,
  }));

  /** The smooth P–V curve the readings should sit on. */
  const curve = Array.from({ length: 40 }, (_, index) => {
    const pressure = MIN_PRESSURE + (index / 39) * (maxPressure - MIN_PRESSURE);
    return {
      x: 22 + (volumeAt(pressure) / maxVolume) * width,
      y: height + 6 - (pressure / maxPressure) * height,
    };
  });

  return (
    <svg viewBox={`0 0 ${260} ${height + 32}`} className="w-full">
      {/* Left plot: P against V */}
      <line x1={22} y1={4} x2={22} y2={height + 6} stroke="#475569" strokeWidth={1.1} />
      <line x1={22} y1={height + 6} x2={22 + width + 6} y2={height + 6} stroke="#475569" strokeWidth={1.1} />
      <polyline points={curve.map((point) => `${point.x},${point.y}`).join(" ")} fill="none" stroke="#3f6212" strokeWidth={1.2} />
      {pvPoints.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r={2.6} fill="#bef264" stroke="#65a30d" strokeWidth={0.9} />
      ))}
      <text x={2} y={12} fill="#94a3b8" fontSize={7} fontWeight={800}>
        P
      </text>
      <text x={22 + width - 6} y={height + 20} fill="#94a3b8" fontSize={7} fontWeight={800}>
        V
      </text>
      <text x={26} y={16} fill="#a3e635" fontSize={7} fontWeight={800}>
        P vs V — curve
      </text>

      {/* Right plot: P against 1/V */}
      <line x1={152} y1={4} x2={152} y2={height + 6} stroke="#475569" strokeWidth={1.1} />
      <line x1={152} y1={height + 6} x2={152 + width + 6} y2={height + 6} stroke="#475569" strokeWidth={1.1} />
      <line
        x1={152}
        y1={height + 6}
        x2={152 + (1 / volumeAt(maxPressure) / maxInverse) * width}
        y2={height + 6 - (maxPressure / maxPressure) * height}
        stroke="#84cc16"
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
      {inversePoints.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r={2.6} fill="#bef264" stroke="#65a30d" strokeWidth={0.9} />
      ))}
      <text x={132} y={12} fill="#94a3b8" fontSize={7} fontWeight={800}>
        P
      </text>
      <text x={152 + width - 12} y={height + 20} fill="#94a3b8" fontSize={7} fontWeight={800}>
        1/V
      </text>
      <text x={156} y={16} fill="#a3e635" fontSize={7} fontWeight={800}>
        P vs 1/V — straight
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function BoylePaper({ readings, onClose }: { readings: Reading[]; onClose: () => void }) {
  const products = readings.map((reading) => reading.pressure * reading.volume);
  const meanProduct = products.length ? products.reduce((total, value) => total + value, 0) / products.length : 0;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Boyle's Law: Pressure and Volume of a Fixed Mass of Gas</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To investigate the relationship between the pressure and the volume of a fixed mass of gas at constant temperature.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Boyle's law apparatus — a graduated glass tube containing trapped air above oil, an oil reservoir, a foot pump and a Bourdon pressure gauge — together with graph paper.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>With the tap open to the atmosphere the initial volume of the trapped air column and the pressure on the Bourdon gauge were recorded.</li>
          <li>The tap was closed and the pump used to raise the pressure of the oil, forcing oil up the tube and compressing the trapped air.</li>
          <li>A short time was allowed after each pumping so that the gas, which warms slightly on compression, returned to room temperature.</li>
          <li>The new pressure and the new volume of trapped air were recorded.</li>
          <li>Step 2–4 were repeated for at least five different pressures.</li>
          <li>Graphs of P against V, and of P against 1/V, were plotted.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Pressure P / kPa</th>
              <th className="border border-slate-400 p-2">Volume V / cm³</th>
              <th className="border border-slate-400 p-2">1/V / cm⁻³</th>
              <th className="border border-slate-400 p-2">P × V / kPa cm³</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading) => (
              <tr key={reading.id}>
                <td className="border border-slate-400 p-2 text-center">{reading.pressure.toFixed(0)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.volume.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{(1 / reading.volume).toFixed(4)}</td>
                <td className="border border-slate-400 p-2 text-center">{(reading.pressure * reading.volume).toFixed(0)}</td>
              </tr>
            ))}
            {!readings.length &&
              [0, 1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  {Array.from({ length: 4 }, (_, cell) => (
                    <td key={cell} className="border border-slate-400 p-2">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        {readings.length > 0 && (
          <p className="mt-2">Mean value of P × V = {meanProduct.toFixed(0)} kPa cm³.</p>
        )}
        <h2 className="mt-5 font-bold uppercase">Graphs</h2>
        <p>
          The graph of pressure against volume was a smooth curve falling from left to right, showing that the volume gets
          smaller as the pressure gets larger. The graph of pressure against 1/V was a straight line passing through the
          origin, which shows that P is directly proportional to 1/V — that is, P is inversely proportional to V.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The gas was compressed slowly, and a pause was left after each pumping, so that the temperature stayed constant — compressing a gas quickly warms it.</li>
          <li>The tube was read at eye level to avoid parallax error, and the volume was read from the level of the oil meniscus.</li>
          <li>The apparatus was checked for leaks, since a leak would change the mass of gas trapped in the tube.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Within experimental error the product P × V stayed constant as the pressure was changed, and the graph of P
          against 1/V was a straight line through the origin. This verifies Boyle's law: for a fixed mass of gas at
          constant temperature, the pressure of the gas is inversely proportional to its volume, P₁V₁ = P₂V₂. In terms of
          particles, squeezing the gas into a smaller volume makes the particles strike the walls more often each second,
          so the pressure rises.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function BoylesLawSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: BoyleSimProps) {
  const [pressure, setPressure] = useState(ATMOSPHERIC);
  const [stroke, setStroke] = useState(0);
  const [settling, setSettling] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const timers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => timers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const volume = volumeAt(pressure);
  const product = pressure * volume;
  const alreadyRecorded = readings.some((reading) => Math.abs(reading.pressure - pressure) < 1);

  const complete = readings.length >= 5;
  const step = complete ? 3 : readings.length >= 1 ? 2 : pressure > ATMOSPHERIC ? 1 : 0;
  const progress = Math.min(1, readings.length / 5);

  /** One pump stroke raises the pressure, then the gas is left to return to room temperature. */
  const pump = useCallback(() => {
    labSounds.play("pumpStroke", { volume: 0.5, throttleMs: 120 });
    if (pressure >= MAX_PRESSURE) return;
    setStroke(1);
    setSettling(true);
    setPressure((current) => Math.min(MAX_PRESSURE, current + PRESSURE_STEP));
    timers.current.push(window.setTimeout(() => setStroke(0), 260));
    timers.current.push(window.setTimeout(() => setSettling(false), 1400));
  }, [pressure]);

  const release = useCallback(() => {
    if (pressure <= MIN_PRESSURE) return;
    setSettling(true);
    setPressure((current) => Math.max(MIN_PRESSURE, current - PRESSURE_STEP));
    timers.current.push(window.setTimeout(() => setSettling(false), 900));
  }, [pressure]);

  const recordReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (settling || alreadyRecorded) return;
    setReadings((current) => {
      if (current.length >= 9) return current;
      return [...current, { id: `${Date.now()}-${current.length}`, pressure, volume }].sort((a, b) => a.pressure - b.pressure);
    });
  }, [alreadyRecorded, pressure, settling, volume]);

  const resetAll = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setDemoActive(false);
    setReadings([]);
    setPressure(ATMOSPHERIC);
    setStroke(0);
    setSettling(false);
  }, []);

  const toggleDemo = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);
    setReadings([]);
    setPressure(ATMOSPHERIC);
    /** Steps up through five pressures, recording each one. */
    [100, 150, 200, 250, 300].forEach((target, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setPressure(target);
          setStroke(1);
          timers.current.push(window.setTimeout(() => setStroke(0), 250));
        }, index * 1500),
      );
      timers.current.push(
        window.setTimeout(() => {
          setReadings((current) =>
            [...current, { id: `demo-${index}`, pressure: target, volume: volumeAt(target) }].sort((a, b) => a.pressure - b.pressure),
          );
        }, index * 1500 + 900),
      );
    });
    timers.current.push(window.setTimeout(() => setDemoActive(false), 5 * 1500));
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? `Five readings taken. P × V stayed at about ${product.toFixed(0)} kPa cm³ throughout, and P against 1/V is a straight line through the origin.`
    : settling
      ? "Compressing the gas warms it slightly — wait for it to cool back to room temperature before reading the volume."
      : readings.length
        ? `${pressure.toFixed(0)} kPa and ${volume.toFixed(1)} cm³. Pump again and take another reading — ${5 - readings.length} to go.`
        : `Trapped air: ${volume.toFixed(1)} cm³ at ${pressure.toFixed(0)} kPa. Record this, then pump up the pressure.`;

  const observation = complete
    ? `Every reading gives P × V ≈ ${product.toFixed(0)} kPa cm³, so pressure is inversely proportional to volume at constant temperature.`
    : "Doubling the pressure halves the volume — that is what P ∝ 1/V means.";

  const primaryLabel = complete ? "Start again" : settling ? "Waiting to cool…" : alreadyRecorded ? "Pump up the pressure" : "Record this reading";

  const pressureControls = (
    <div data-experiment-tour="boyle-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Pressure</span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {pressure.toFixed(0)} kPa
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={release}
          disabled={pressure <= MIN_PRESSURE}
          className="rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
        >
          Release −{PRESSURE_STEP}
        </button>
        <button
          onClick={pump}
          disabled={pressure >= MAX_PRESSURE}
          className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          Pump +{PRESSURE_STEP}
        </button>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">P</div>
          <div className="text-sm font-black text-white">{pressure.toFixed(0)}</div>
          <div className="text-[7px] text-slate-500">kPa</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">V</div>
          <div className="text-sm font-black text-white">{volume.toFixed(1)}</div>
          <div className="text-[7px] text-slate-500">cm³</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            P × V
          </div>
          <div className="text-sm font-black text-white">{product.toFixed(0)}</div>
          <div className="text-[7px] text-slate-500">kPa cm³</div>
        </div>
      </div>
      <div
        className={`mt-2 rounded-xl px-2 py-1.5 text-center text-[9px] font-black uppercase tracking-wide ${
          settling ? "bg-amber-500/18 text-amber-200" : "bg-emerald-500/15 text-emerald-200"
        }`}
      >
        {settling ? "Gas still warm — wait before reading" : "At room temperature — safe to read"}
      </div>
    </div>
  );

  const tablePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length}/5
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">No readings yet — record the starting values first.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">P</th>
              <th className="py-0.5 text-right font-black uppercase">V</th>
              <th className="py-0.5 text-right font-black uppercase">1/V</th>
              <th className="py-0.5 text-right font-black uppercase">PV</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{reading.pressure.toFixed(0)}</td>
                <td className="py-1 text-right font-black">{reading.volume.toFixed(1)}</td>
                <td className="py-1 text-right font-black">{(1 / reading.volume).toFixed(4)}</td>
                <td className="py-1 text-right font-black">{(reading.pressure * reading.volume).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={recordReading}
        disabled={settling || alreadyRecorded || readings.length >= 9}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        {alreadyRecorded ? "Already recorded at this pressure" : "Record P and V"}
      </button>
    </div>
  );

  const graphPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Both graphs</span>
      <div className="mt-1.5">
        <BoylePlots readings={readings} />
      </div>
      <div className="mt-1 text-[8px] font-bold text-slate-500">
        Only the P against 1/V graph is a straight line through the origin — that is what proves P ∝ 1/V.
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Boyle's Law Bench"
          subtitle="P × V is constant at constant temperature"
          symbol="💨"
          accent={ACCENT}
          mode={mode}
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

      <div data-experiment-tour="boyle-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.75, 2.95, 3], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <BoyleScene
            pressure={pressure}
            volume={volume}
            stroke={stroke}
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
            emoji="💨"
            cornerEmoji="🧪"
            status={status}
            running={demoActive}
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
          title="Boyle's Law"
          tagline="P × V is constant at constant temperature"
          missions={BOYLE_MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : alreadyRecorded ? "🔧" : "📝"}
          onPrimary={complete ? resetAll : alreadyRecorded ? pump : recordReading}
          primaryDisabled={settling}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "pressure", label: "Gauge", value: `${pressure.toFixed(0)} kPa`, content: pressureControls },
            { id: "table", label: "Table", value: `${readings.length}/5`, content: tablePanel },
            { id: "graphs", label: "Graphs", value: `PV ${product.toFixed(0)}`, content: graphPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "pump", label: "Pump", onClick: pump, disabled: pressure >= MAX_PRESSURE, tone: "green" },
            { id: "record", label: "Record", onClick: recordReading, disabled: settling || alreadyRecorded, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "pressure", label: "Gauge", value: `${pressure.toFixed(0)} kPa`, content: pressureControls },
            { id: "table", label: "Table", value: `${readings.length}/5`, content: tablePanel },
            { id: "graphs", label: "Graphs", value: `PV ${product.toFixed(0)}`, content: graphPanel },
          ]}
        />
      )}

      {showPaper && <BoylePaper readings={readings} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={boyleTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
