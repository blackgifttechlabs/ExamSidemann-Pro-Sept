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
import { AnalogueMeter } from "../../common/ElectricalApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface SpecificHeatLiquidSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.teal;
const PAPER_FILENAME = "specific-heat-capacity-of-a-liquid.html";

const ROOM_TEMP = 22;
const HEATER_RESISTANCE = 3;
const RUN_DURATION_MS = 8000;

/** Copper calorimeter: its own heat capacity has to be allowed for. */
const CALORIMETER_MASS = 0.08; // kg
const CALORIMETER_C = 385; // J kg⁻¹ °C⁻¹
const CALORIMETER_CAPACITY = CALORIMETER_MASS * CALORIMETER_C;

interface Liquid {
  id: "water" | "oil" | "glycerol";
  label: string;
  colour: string;
  opacity: number;
  trueC: number;
}

const LIQUIDS: Liquid[] = [
  { id: "water", label: "Water", colour: "#7dd3fc", opacity: 0.55, trueC: 4200 },
  { id: "oil", label: "Cooking oil", colour: "#facc15", opacity: 0.72, trueC: 1970 },
  { id: "glycerol", label: "Glycerol", colour: "#d9f99d", opacity: 0.62, trueC: 2430 },
];

const MASS_OPTIONS = [0.15, 0.2, 0.25] as const;
const VOLTAGE_OPTIONS = [8, 10, 12] as const;
const TIME_OPTIONS = [180, 300, 420] as const;

interface Sample {
  time: number;
  temp: number;
}

const LIQUID_MISSIONS: GameMission[] = [
  {
    short: "Weigh",
    title: "Weigh empty, then full",
    detail: "Weigh the empty calorimeter, add the liquid, weigh again. The difference is the mass of the liquid.",
    symbol: "⚖️",
  },
  {
    short: "Set up",
    title: "Fit heater, stirrer, thermometer",
    detail: "Stand the calorimeter in its lagged jacket, then fit the immersion heater, stirrer and thermometer.",
    symbol: "🔌",
  },
  {
    short: "Heat",
    title: "Heat and stir",
    detail: "Switch on, note the voltmeter and ammeter, and stir gently so the liquid heats evenly.",
    symbol: "🔥",
  },
  {
    short: "Calculate",
    title: "Allow for the calorimeter",
    detail: "The calorimeter is heated too, so energy VIt = (m_liquid c_liquid + m_cal c_cal) ΔT.",
    symbol: "🧮",
  },
];

const liquidTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Specific heat capacity of a liquid",
    text: "A measured mass of liquid is heated in a calorimeter by an electrical immersion heater. Because the container is heated too, its heat capacity must be included in the calculation.",
    mode: "modal",
  },
  {
    title: "The calorimeter",
    text: "The copper calorimeter sits inside a lagged jacket that reduces heat loss. A stirrer keeps the temperature the same throughout the liquid.",
    mode: "bubble",
    selector: '[data-experiment-tour="liquid-scene"]',
  },
  {
    title: "Set the conditions",
    text: "Choose the liquid, the mass of liquid, the supply voltage and the heating time.",
    mode: "bubble",
    selector: '[data-experiment-tour="liquid-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Two answers, one better",
    text: "Compare the value you get when you ignore the calorimeter with the value you get when you allow for it — the second is closer to the accepted value.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/** Integrates (m c + C_cal) dT/dt = P − k(T − T_room). */
function simulateHeating(liquid: Liquid, massKg: number, power: number, seconds: number, lagged: boolean): Sample[] {
  const k = lagged ? 0.18 : 0.85;
  const totalCapacity = massKg * liquid.trueC + CALORIMETER_CAPACITY;
  const samples: Sample[] = [{ time: 0, temp: ROOM_TEMP }];
  let temp = ROOM_TEMP;
  for (let second = 1; second <= seconds; second += 1) {
    temp += (power - k * (temp - ROOM_TEMP)) / totalCapacity;
    samples.push({ time: second, temp });
  }
  return samples;
}

/* ------------------------------------------------------------------ 3D bits */

function Stirrer({ stirring }: { stirring: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = stirring ? 0.62 + Math.sin(clock.elapsedTime * 3.4) * 0.06 : 0.62;
  });
  return (
    <group ref={groupRef} position={[0.13, 0.62, 0.09]}>
      <mesh>
        <cylinderGeometry args={[0.008, 0.008, 0.62, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.05, 0.007, 8, 20]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.28} />
      </mesh>
    </group>
  );
}

function Calorimeter({ liquid, level, hot }: { liquid: Liquid; level: number; hot: number }) {
  const warm = new THREE.Color(liquid.colour).lerp(new THREE.Color("#f97316"), THREE.MathUtils.clamp(hot, 0, 1) * 0.35);
  return (
    <group>
      {/* Lagged outer jacket */}
      <mesh position={[0, 0.24, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.48, 26, 1, true]} />
        <meshStandardMaterial color="#f5f5f4" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.03, 26]} />
        <meshStandardMaterial color="#e7e5e4" roughness={1} />
      </mesh>
      {/* Copper calorimeter can */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.44, 26, 1, true]} />
        <meshStandardMaterial color="#c2703d" metalness={0.8} roughness={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.02, 26]} />
        <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Liquid */}
      <mesh position={[0, 0.06 + (level * 0.36) / 2, 0]}>
        <cylinderGeometry args={[0.192, 0.192, level * 0.36, 26]} />
        <meshStandardMaterial color={`#${warm.getHexString()}`} transparent opacity={liquid.opacity} roughness={0.2} />
      </mesh>
    </group>
  );
}

function ImmersionHeater({ on }: { on: boolean }) {
  return (
    <group position={[-0.09, 0, 0]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.8, 14]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.8}
          roughness={0.3}
          emissive={on ? "#f97316" : "#000000"}
          emissiveIntensity={on ? 0.55 : 0}
        />
      </mesh>
      <mesh position={[0, 0.96, 0]} castShadow>
        <boxGeometry args={[0.085, 0.085, 0.085]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      <mesh position={[-0.42, 1, 0.03]} rotation={[0, 0, Math.PI / 2 + 0.1]}>
        <cylinderGeometry args={[0.011, 0.011, 0.86, 8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.7} />
      </mesh>
      <mesh position={[-0.42, 0.92, -0.03]} rotation={[0, 0, Math.PI / 2 + 0.05]}>
        <cylinderGeometry args={[0.011, 0.011, 0.86, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Thermometer({ temp }: { temp: number }) {
  const fill = THREE.MathUtils.clamp(temp / 100, 0.05, 1);
  return (
    <group position={[0.02, 0, -0.11]}>
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.8, 14]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.35} transmission={0.85} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.3 + (fill * 0.72) / 2, 0]}>
        <cylinderGeometry args={[0.007, 0.007, fill * 0.72, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.018, 14, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <Html position={[0.22, 0.94, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="rounded-lg border border-teal-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[7px] font-black uppercase text-teal-200">Thermometer</div>
          <div className="text-[11px] font-black text-white">{temp.toFixed(1)} °C</div>
        </div>
      </Html>
    </group>
  );
}

function Balance({ reading }: { reading: string }) {
  return (
    <group position={[1.25, BENCH_TOP_Y, 0.3]}>
      <mesh position={[0, 0.055, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.11, 0.42]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.02, 26]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.09, 0.212]}>
        <boxGeometry args={[0.24, 0.06, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Html position={[0, 0.09, 0.23]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
        <div className="text-center">
          <div className="text-[8px] font-black leading-none text-emerald-300">{reading}</div>
          <div className="text-[5px] font-bold uppercase text-slate-400">balance · g</div>
        </div>
      </Html>
    </group>
  );
}

function LiquidScene({
  liquid,
  massKg,
  temp,
  heating,
  voltage,
  current,
  mode,
  isMobile,
  moveVectorRef,
}: {
  liquid: Liquid;
  massKg: number;
  temp: number;
  heating: boolean;
  voltage: number;
  current: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.9, 2.8, 3.3] : [1.1, 2.68, 2.9];
    camera.position.set(...position);
    camera.lookAt(0, 1.8, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const level = THREE.MathUtils.clamp(massKg / 0.3, 0.35, 1);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0d9488"
        benchColor="#eef2f4"
        posterA={{
          title: "LIQUIDS & HEAT",
          lines: [
            "V I t = (m c + m_cal c_cal) ΔT",
            "Stir so the liquid heats evenly",
            "Water has a very large c: 4200 J/kg°C",
            "That is why water is a good coolant",
          ],
        }}
        posterB={{
          title: "REDUCING ERRORS",
          lines: ["Lag the calorimeter", "Start below room temperature, end above", "Stir constantly and read at eye level"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          <mesh position={[0, 0.012, 0]} receiveShadow>
            <boxGeometry args={[0.95, 0.024, 0.8]} />
            <meshStandardMaterial color="#1c1917" roughness={0.95} />
          </mesh>
          <group position={[0, 0.024, 0]}>
            <Calorimeter liquid={liquid} level={level} hot={(temp - ROOM_TEMP) / 40} />
            <ImmersionHeater on={heating} />
            <Thermometer temp={temp} />
            <Stirrer stirring={heating} />
          </group>
          <AnalogueMeter
            position={[-0.95, 0, -0.3]}
            kind="voltmeter"
            value={heating ? voltage : 0}
            max={15}
            decimals={1}
            label="voltmeter"
          />
          <AnalogueMeter
            position={[-0.95, 0, 0.34]}
            kind="ammeter"
            value={heating ? current : 0}
            max={5}
            decimals={2}
            label="ammeter"
          />
        </group>
        <Balance reading={`${((massKg + CALORIMETER_MASS) * 1000).toFixed(0)}`} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.8, 0]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* ------------------------------------------------------------ Heating graph */

function HeatingGraph({ samples, seconds }: { samples: Sample[]; seconds: number }) {
  if (samples.length < 2) {
    return <p className="text-[10px] font-bold text-slate-500">Switch on the heater to plot the temperature.</p>;
  }
  const width = 220;
  const height = 106;
  const maxTemp = Math.max(60, Math.ceil((samples[samples.length - 1].temp + 8) / 10) * 10);
  const px = (time: number) => 28 + (time / seconds) * width;
  const py = (temp: number) => height + 6 - (temp / maxTemp) * height;

  return (
    <svg viewBox={`0 0 ${width + 40} ${height + 30}`} className="w-full">
      <line x1={28} y1={4} x2={28} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      <line x1={28} y1={height + 6} x2={width + 32} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
        <g key={fraction}>
          <line x1={26} y1={py(fraction * maxTemp)} x2={width + 32} y2={py(fraction * maxTemp)} stroke="#1e293b" strokeWidth={0.6} />
          <text x={4} y={py(fraction * maxTemp) + 3} fill="#64748b" fontSize={7}>
            {Math.round(fraction * maxTemp)}
          </text>
        </g>
      ))}
      <polyline
        points={samples.map((sample) => `${px(sample.time)},${py(sample.temp)}`).join(" ")}
        fill="none"
        stroke="#14b8a6"
        strokeWidth={1.9}
      />
      <text x={2} y={12} fill="#94a3b8" fontSize={7} fontWeight={800}>
        θ / °C
      </text>
      <text x={width + 6} y={height + 22} fill="#94a3b8" fontSize={8} fontWeight={800}>
        t / s
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function LiquidPaper({
  liquid,
  massKg,
  voltage,
  current,
  seconds,
  finalTemp,
  cIgnoring,
  cCorrected,
  onClose,
}: {
  liquid: Liquid;
  massKg: number;
  voltage: number;
  current: number;
  seconds: number;
  finalTemp: number;
  cIgnoring: number;
  cCorrected: number;
  onClose: () => void;
}) {
  const energy = voltage * current * seconds;
  const rise = finalTemp - ROOM_TEMP;
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Determination of the Specific Heat Capacity of a Liquid</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To determine the specific heat capacity of {liquid.label.toLowerCase()} using an electrical immersion heater and a calorimeter.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Copper calorimeter with lagged jacket, {liquid.label.toLowerCase()}, 12 V immersion heater, stirrer, thermometer (0–100 °C), low-voltage d.c. supply, voltmeter, ammeter, stopwatch, balance.</p>
        <h2 className="mt-5 font-bold uppercase">Theory</h2>
        <p>
          The electrical energy supplied heats both the liquid and the calorimeter that contains it, so
        </p>
        <p className="mt-2 text-center font-bold">V I t = (m<sub>l</sub> c<sub>l</sub> + m<sub>c</sub> c<sub>c</sub>) ΔT</p>
        <p className="mt-2">which rearranges to give c<sub>l</sub> = (V I t − m<sub>c</sub> c<sub>c</sub> ΔT) ÷ (m<sub>l</sub> ΔT).</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The empty calorimeter was weighed on a balance.</li>
          <li>The liquid was poured in and the calorimeter weighed again; the mass of liquid was found by subtraction.</li>
          <li>The calorimeter was placed in its lagged jacket and the heater, stirrer and thermometer fitted.</li>
          <li>The initial temperature of the liquid was recorded.</li>
          <li>The heater was switched on, the stopwatch started, and the voltmeter and ammeter readings noted.</li>
          <li>The liquid was stirred gently throughout. After {seconds} s the heater was switched off and the highest temperature recorded.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2">Mass of empty calorimeter</td>
              <td className="border border-slate-400 p-2">{(CALORIMETER_MASS * 1000).toFixed(0)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Mass of calorimeter + liquid</td>
              <td className="border border-slate-400 p-2">{((CALORIMETER_MASS + massKg) * 1000).toFixed(0)} g</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Mass of liquid, m<sub>l</sub></td>
              <td className="border border-slate-400 p-2">{(massKg * 1000).toFixed(0)} g = {massKg.toFixed(3)} kg</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Initial temperature</td>
              <td className="border border-slate-400 p-2">{ROOM_TEMP.toFixed(1)} °C</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Final temperature</td>
              <td className="border border-slate-400 p-2">{finalTemp.toFixed(1)} °C</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Temperature rise, ΔT</td>
              <td className="border border-slate-400 p-2">{rise.toFixed(1)} °C</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">V, I and t</td>
              <td className="border border-slate-400 p-2">
                {voltage.toFixed(1)} V, {current.toFixed(2)} A, {seconds} s
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Energy supplied, E = VIt</td>
              <td className="border border-slate-400 p-2">{energy.toFixed(0)} J</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Heat capacity of calorimeter</td>
              <td className="border border-slate-400 p-2">{CALORIMETER_CAPACITY.toFixed(1)} J °C⁻¹</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Calculation</h2>
        <p>Ignoring the calorimeter: c = E ÷ (m<sub>l</sub> ΔT) = {cIgnoring ? cIgnoring.toFixed(0) : "…"} J kg⁻¹ °C⁻¹</p>
        <p className="mt-1">
          Allowing for the calorimeter: c = (E − {CALORIMETER_CAPACITY.toFixed(1)} × ΔT) ÷ (m<sub>l</sub> ΔT) ={" "}
          {cCorrected ? cCorrected.toFixed(0) : "…"} J kg⁻¹ °C⁻¹
        </p>
        <p className="mt-2">Accepted value for {liquid.label.toLowerCase()}: {liquid.trueC} J kg⁻¹ °C⁻¹.</p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The liquid was stirred continuously so that the thermometer read the temperature of the whole liquid.</li>
          <li>The calorimeter was lagged and the heating element kept fully covered by the liquid.</li>
          <li>Heat lost to the surroundings makes the temperature rise smaller than it should be, so the calculated value of c is too large.</li>
          <li>Starting a few degrees below room temperature and finishing the same amount above it makes the heat gained from the room roughly cancel the heat lost to it.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Allowing for the heat capacity of the calorimeter, the specific heat capacity of {liquid.label.toLowerCase()} was
          found to be about {cCorrected ? cCorrected.toFixed(0) : "—"} J kg⁻¹ °C⁻¹, compared with the accepted value of{" "}
          {liquid.trueC} J kg⁻¹ °C⁻¹. Ignoring the calorimeter gives a noticeably larger answer, which shows that the
          container must be included in the energy balance.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function SpecificHeatLiquidSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: SpecificHeatLiquidSimProps) {
  const [liquidId, setLiquidId] = useState<Liquid["id"]>("water");
  const [massKg, setMassKg] = useState<number>(0.2);
  const [voltage, setVoltage] = useState<number>(12);
  const [seconds, setSeconds] = useState<number>(300);
  const [lagged, setLagged] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  const liquid = LIQUIDS.find((each) => each.id === liquidId)!;
  const current = voltage / HEATER_RESISTANCE;
  const power = voltage * current;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const fullRun = useMemo(
    () => simulateHeating(liquid, massKg, power, seconds, lagged),
    [lagged, liquid, massKg, power, seconds],
  );
  const sampleIndex = Math.min(fullRun.length - 1, Math.round(elapsed));
  const samples = fullRun.slice(0, sampleIndex + 1);
  const temp = fullRun[sampleIndex].temp;
  const finalTemp = fullRun[fullRun.length - 1].temp;
  const finished = elapsed >= seconds;

  const rise = finalTemp - ROOM_TEMP;
  const energy = power * seconds;
  const cIgnoring = rise > 0 ? energy / (massKg * rise) : 0;
  const cCorrected = rise > 0 ? (energy - CALORIMETER_CAPACITY * rise) / (massKg * rise) : 0;
  const percentError = ((cCorrected - liquid.trueC) / liquid.trueC) * 100;

  const progress = elapsed / seconds;
  const step = finished ? 3 : running ? 2 : 1;
  const complete = finished;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      setElapsed(fraction * seconds);
      if (fraction >= 1) {
        setRunning(false);
        setElapsed(seconds);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running, seconds]);

  const startHeating = useCallback(() => {
    labSounds.play("bunsenIgnite", { volume: 0.55 });
    labSounds.loop("bunsenFlame", { volume: 0.22 });
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
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? `ΔT = ${rise.toFixed(1)} °C. Allowing for the calorimeter, c = ${cCorrected.toFixed(0)} J kg⁻¹ °C⁻¹ (accepted ${liquid.trueC}).`
    : running
      ? `Heating and stirring: ${elapsed.toFixed(0)} s of ${seconds} s, temperature ${temp.toFixed(1)} °C.`
      : `${(massKg * 1000).toFixed(0)} g of ${liquid.label.toLowerCase()} at ${ROOM_TEMP} °C in a ${(CALORIMETER_MASS * 1000).toFixed(0)} g copper calorimeter.`;

  const observation = complete
    ? `Ignoring the calorimeter gives ${cIgnoring.toFixed(0)} J kg⁻¹ °C⁻¹; allowing for it gives ${cCorrected.toFixed(0)}, which is ${Math.abs(percentError).toFixed(0)}% from the accepted value.`
    : "Water needs far more energy per degree than oil, because its specific heat capacity is much larger.";

  const primaryLabel = complete ? "Repeat the run" : running ? "Heating…" : "Switch on the heater";

  const setupControls = (
    <div data-experiment-tour="liquid-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Liquid</span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {LIQUIDS.map((option) => (
            <button
              key={option.id}
              onClick={() => changeSetting(() => setLiquidId(option.id))}
              className="rounded-xl px-1 py-2 text-[10px] font-black transition"
              style={option.id === liquidId ? { background: ACCENT.base, color: "#04211e" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option.label}
              <span className="mt-0.5 block text-[8px] font-bold opacity-80">{option.trueC}</span>
            </button>
          ))}
        </div>
        <label className="mt-2 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Mass of liquid</label>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          {MASS_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setMassKg(option))}
              className="rounded-lg px-1 py-1.5 text-[10px] font-black transition"
              style={option === massKg ? { background: ACCENT.base, color: "#04211e" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {(option * 1000).toFixed(0)} g
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Heater</span>
          <span className="text-sm font-black text-white">
            {voltage} V · {current.toFixed(2)} A · {power.toFixed(0)} W
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {VOLTAGE_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setVoltage(option))}
              className="rounded-lg px-1 py-1.5 text-[10px] font-black transition"
              style={option === voltage ? { background: ACCENT.base, color: "#04211e" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option} V
            </button>
          ))}
        </div>
        <label className="mt-2 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Heating time</label>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setSeconds(option))}
              className="rounded-lg px-1 py-1.5 text-[10px] font-black transition"
              style={option === seconds ? { background: ACCENT.base, color: "#04211e" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option} s
            </button>
          ))}
        </div>
        <button
          onClick={() => changeSetting(() => setLagged((value) => !value))}
          className="mt-2 w-full rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition hover:bg-white/15"
        >
          {lagged ? "Lagged jacket on — tap to remove" : "No lagging — tap to add jacket"}
        </button>
      </div>
    </div>
  );

  const resultPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Readings</span>
      <table className="mt-2 w-full text-[9px]">
        <tbody className="text-slate-200">
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Calorimeter + liquid</td>
            <td className="py-1 text-right font-black">{((CALORIMETER_MASS + massKg) * 1000).toFixed(0)} g</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Mass of liquid</td>
            <td className="py-1 text-right font-black">{(massKg * 1000).toFixed(0)} g</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">ΔT</td>
            <td className="py-1 text-right font-black">{(temp - ROOM_TEMP).toFixed(1)} °C</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">E = VIt</td>
            <td className="py-1 text-right font-black">{(power * elapsed).toFixed(0)} J</td>
          </tr>
          <tr>
            <td className="py-1 font-bold text-slate-400">Calorimeter capacity</td>
            <td className="py-1 text-right font-black">{CALORIMETER_CAPACITY.toFixed(1)} J/°C</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Ignoring can</div>
          <div className="text-xs font-black text-white">{complete ? cIgnoring.toFixed(0) : "—"}</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            Corrected
          </div>
          <div className="text-xs font-black text-white">{complete ? cCorrected.toFixed(0) : "—"}</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Accepted</div>
          <div className="text-xs font-black text-white">{liquid.trueC}</div>
        </div>
      </div>
    </div>
  );

  const graphPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Temperature–time</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {temp.toFixed(1)} °C
        </span>
      </div>
      <div className="mt-1.5">
        <HeatingGraph samples={samples} seconds={seconds} />
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Calorimetry Lab"
          subtitle="VIt = (m c + m_cal c_cal) ΔT"
          symbol="🧪"
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

      <div data-experiment-tour="liquid-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1.1, 2.68, 2.9], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <LiquidScene
            liquid={liquid}
            massKg={massKg}
            temp={temp}
            heating={running}
            voltage={voltage}
            current={current}
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
            emoji="🧪"
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
          title="Specific Heat of a Liquid"
          tagline="VIt = (m c + m_cal c_cal) ΔT"
          missions={LIQUID_MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : running ? "⏳" : "🔌"}
          onPrimary={startHeating}
          primaryDisabled={running}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Set up", value: liquid.label, content: setupControls },
            { id: "results", label: "Readings", value: complete ? `${cCorrected.toFixed(0)}` : `${temp.toFixed(0)}°C`, content: resultPanel },
            { id: "graph", label: "Graph", value: `${elapsed.toFixed(0)}s`, content: graphPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "heat", label: running ? "Heating" : "Switch on", onClick: startHeating, disabled: running, tone: "red" },
            { id: "lag", label: lagged ? "Remove lag" : "Add lagging", onClick: () => changeSetting(() => setLagged((value) => !value)), tone: "blue" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Set up", value: liquid.label, content: setupControls },
            { id: "results", label: "Readings", value: complete ? `${cCorrected.toFixed(0)}` : `${temp.toFixed(0)}°C`, content: resultPanel },
            { id: "graph", label: "Graph", value: `${elapsed.toFixed(0)}s`, content: graphPanel },
          ]}
        />
      )}

      {showPaper && (
        <LiquidPaper
          liquid={liquid}
          massKg={massKg}
          voltage={voltage}
          current={current}
          seconds={seconds}
          finalTemp={finalTemp}
          cIgnoring={cIgnoring}
          cCorrected={cCorrected}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={liquidTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
