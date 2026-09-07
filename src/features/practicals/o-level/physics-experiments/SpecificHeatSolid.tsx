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
import { AnalogueMeter, CircuitLead } from "../../common/ElectricalApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface SpecificHeatSolidSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.red;
const PAPER_FILENAME = "specific-heat-capacity-of-a-solid.html";

const ROOM_TEMP = 22;
/** Heater resistance, so the ammeter reading follows the chosen supply voltage. */
const HEATER_RESISTANCE = 3;
const RUN_DURATION_MS = 8000;

/**
 * Bench layout, all relative to the group sitting on the bench top. The heater
 * sits in the left-hand drilled hole and the leads are routed against these, so
 * moving a meter here moves its wiring with it.
 */
const HEATER_X = -0.1;
/** Height of the heater terminals, just above the moulded cap. */
const HEATER_TERMINAL_Y = 0.7;
const SUPPLY_X = -1.35;
const VOLTMETER_X = 0.95;
const VOLTMETER_Z = -0.32;
const AMMETER_X = 0.95;
const AMMETER_Z = 0.36;

interface Metal {
  id: "aluminium" | "copper" | "brass";
  label: string;
  colour: string;
  massKg: number;
  /** Accepted value of the specific heat capacity, in J kg⁻¹ °C⁻¹. */
  trueC: number;
}

const METALS: Metal[] = [
  { id: "aluminium", label: "Aluminium", colour: "#cbd5e1", massKg: 1, trueC: 900 },
  { id: "copper", label: "Copper", colour: "#c2703d", massKg: 1, trueC: 385 },
  { id: "brass", label: "Brass", colour: "#c9a227", massKg: 1, trueC: 370 },
];

const VOLTAGE_OPTIONS = [8, 10, 12] as const;
const TIME_OPTIONS = [180, 300, 420] as const;

interface Sample {
  time: number;
  temp: number;
}

const SHC_MISSIONS: GameMission[] = [
  {
    short: "Weigh",
    title: "Measure the mass",
    detail: "Weigh the metal block on a balance and record its mass in kilograms.",
    symbol: "⚖️",
  },
  {
    short: "Set up",
    title: "Fit heater and thermometer",
    detail: "Slide the immersion heater and the thermometer into the two holes, using a drop of oil for good thermal contact, and lag the block.",
    symbol: "🔌",
  },
  {
    short: "Heat",
    title: "Heat for a measured time",
    detail: "Switch on, note the voltmeter and ammeter readings, and time the heating with a stopwatch.",
    symbol: "🔥",
  },
  {
    short: "Calculate",
    title: "Calculate c",
    detail: "Energy supplied E = VIt. Since E = mcΔT, the specific heat capacity is c = VIt ÷ (mΔT).",
    symbol: "🧮",
  },
];

const shcTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Specific heat capacity",
    text: "The specific heat capacity c of a substance is the energy needed to raise the temperature of 1 kg of it by 1 °C. We supply a measured amount of electrical energy and measure the temperature rise it produces.",
    mode: "modal",
  },
  {
    title: "The heating block",
    text: "The metal block has two holes: one for the immersion heater and one for the thermometer. The lagging around it cuts down heat lost to the room.",
    mode: "bubble",
    selector: '[data-experiment-tour="shc-scene"]',
  },
  {
    title: "Set the conditions",
    text: "Choose the metal, the supply voltage and how long to heat for. Try the same run with and without lagging.",
    mode: "bubble",
    selector: '[data-experiment-tour="shc-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Why c comes out too high",
    text: "Some heat always escapes to the room, so the temperature rise is smaller than it should be and the calculated value of c comes out larger than the true value. Lagging reduces this error.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/**
 * Numerically integrates m·c·dT/dt = P − k(T − T_room) so the block heats
 * realistically and heat loss to the room shows up in the result.
 */
function simulateHeating(metal: Metal, power: number, seconds: number, lagged: boolean): Sample[] {
  const k = lagged ? 0.12 : 0.75;
  const heatCapacity = metal.massKg * metal.trueC;
  const samples: Sample[] = [{ time: 0, temp: ROOM_TEMP }];
  let temp = ROOM_TEMP;
  for (let second = 1; second <= seconds; second += 1) {
    temp += (power - k * (temp - ROOM_TEMP)) / heatCapacity;
    samples.push({ time: second, temp });
  }
  return samples;
}

/* ------------------------------------------------------------------ 3D bits */

function MetalBlock({ metal, hot }: { metal: Metal; hot: number }) {
  /** The block glows faintly as it heats, so the temperature rise is visible. */
  const emissive = new THREE.Color("#ef4444").multiplyScalar(THREE.MathUtils.clamp(hot, 0, 1) * 0.5);
  return (
    <group>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.56, 28]} />
        <meshStandardMaterial
          color={metal.colour}
          metalness={0.82}
          roughness={0.3}
          emissive={`#${emissive.getHexString()}`}
          emissiveIntensity={1}
        />
      </mesh>
      {/* The two drilled holes */}
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.03, 14]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      ))}
    </group>
  );
}

function Lagging({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <group>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.58, 28, 1, true]} />
        <meshStandardMaterial color="#f5f5f4" roughness={1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.04, 28]} />
        <meshStandardMaterial color="#e7e5e4" roughness={1} />
      </mesh>
    </group>
  );
}

/**
 * The immersion heater sits in the left-hand drilled hole. The element is
 * mostly buried in the block — only the cap and the two terminals stand proud,
 * which is where the supply leads attach.
 */
function ImmersionHeater({ on }: { on: boolean }) {
  return (
    <group position={[HEATER_X, 0, 0]}>
      {/* Element, sunk into the block so its tip is near the base */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.56, 14]} />
        <meshStandardMaterial
          color="#94a3b8"
          metalness={0.8}
          roughness={0.3}
          emissive={on ? "#f97316" : "#000000"}
          emissiveIntensity={on ? 0.55 : 0}
        />
      </mesh>
      {/* Moulded cap resting on the top face of the block */}
      <mesh position={[0, 0.635, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.042, 0.09, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>
      {/* Terminals the leads run from */}
      {[-0.028, 0.028].map((z, index) => (
        <mesh key={z} position={[0, HEATER_TERMINAL_Y - 0.02, z]} castShadow>
          <cylinderGeometry args={[0.013, 0.015, 0.05, 10]} />
          <meshStandardMaterial
            color={index === 0 ? "#b91c1c" : "#111827"}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
      ))}
    </group>
  );
}

function Thermometer({ temp }: { temp: number }) {
  /** Mercury thread length maps the 0–100 °C range onto the stem. */
  const fill = THREE.MathUtils.clamp((temp - 0) / 100, 0.05, 1);
  return (
    // The bulb sits deep in the second drilled hole, so it reads the block
    // rather than the air above it.
    <group position={[0.1, 0, 0]}>
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.017, 0.017, 0.78, 14]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.35} transmission={0.85} roughness={0.05} />
      </mesh>
      <mesh position={[0, 0.16 + (fill * 0.7) / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, fill * 0.7, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.019, 14, 10]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      <Html position={[0.22, 0.92, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="rounded-lg border border-red-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[7px] font-black uppercase text-red-200">Thermometer</div>
          <div className="text-[11px] font-black text-white">{temp.toFixed(1)} °C</div>
        </div>
      </Html>
    </group>
  );
}

/**
 * Leads from the supply, through the ammeter, to the heater, with the voltmeter
 * connected across the heater terminals. Routed along the bench so every lead
 * visibly starts and ends on a terminal.
 */
function HeaterWiring() {
  const heaterRed: [number, number, number] = [HEATER_X, HEATER_TERMINAL_Y, -0.028];
  const heaterBlack: [number, number, number] = [HEATER_X, HEATER_TERMINAL_Y, 0.028];

  return (
    <group>
      {/* Supply positive → ammeter */}
      <CircuitLead
        colour="#dc2626"
        points={[
          [SUPPLY_X + 0.16, 0.3, -0.05],
          [SUPPLY_X + 0.3, 0.12, 0.5],
          [AMMETER_X - 0.14, 0.12, 0.5],
          [AMMETER_X - 0.13, 0.27, AMMETER_Z + 0.17],
        ]}
      />
      {/* Ammeter → heater positive */}
      <CircuitLead
        colour="#dc2626"
        points={[
          [AMMETER_X + 0.13, 0.27, AMMETER_Z + 0.17],
          [AMMETER_X + 0.1, 0.14, 0.62],
          [HEATER_X + 0.28, 0.16, 0.34],
          [HEATER_X + 0.1, HEATER_TERMINAL_Y + 0.06, 0.06],
          heaterBlack,
        ]}
      />
      {/* Heater negative → supply negative */}
      <CircuitLead
        colour="#0f172a"
        points={[
          heaterRed,
          [HEATER_X - 0.14, HEATER_TERMINAL_Y + 0.04, -0.12],
          [HEATER_X - 0.5, 0.18, -0.4],
          [SUPPLY_X + 0.3, 0.12, -0.4],
          [SUPPLY_X - 0.16, 0.3, -0.05],
        ]}
      />
      {/* Voltmeter across the heater */}
      <CircuitLead
        colour="#0284c7"
        points={[
          [VOLTMETER_X - 0.13, 0.27, VOLTMETER_Z + 0.17],
          [VOLTMETER_X - 0.2, 0.13, -0.5],
          [HEATER_X + 0.1, 0.15, -0.34],
          [HEATER_X + 0.06, HEATER_TERMINAL_Y + 0.04, -0.05],
          heaterRed,
        ]}
      />
      <CircuitLead
        colour="#0284c7"
        points={[
          [VOLTMETER_X + 0.13, 0.27, VOLTMETER_Z + 0.17],
          [VOLTMETER_X + 0.16, 0.13, 0.02],
          [HEATER_X + 0.34, 0.15, 0.1],
          [HEATER_X + 0.12, HEATER_TERMINAL_Y + 0.03, 0.05],
          heaterBlack,
        ]}
      />
    </group>
  );
}

function PowerSupply({ on, voltage }: { on: boolean; voltage: number }) {
  return (
    <group position={[SUPPLY_X, 0, -0.25]}>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.32, 0.4]} />
        <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Output terminals the leads run from */}
      {[-0.16, 0.16].map((x, index) => (
        <mesh key={x} position={[x, 0.3, 0.2]} castShadow>
          <cylinderGeometry args={[0.026, 0.03, 0.05, 12]} />
          <meshStandardMaterial
            color={index === 0 ? "#111827" : "#b91c1c"}
            metalness={0.6}
            roughness={0.34}
          />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0.205]}>
        <boxGeometry args={[0.3, 0.14, 0.01]} />
        <meshStandardMaterial color="#020617" emissive={on ? "#22c55e" : "#000000"} emissiveIntensity={on ? 0.4 : 0} />
      </mesh>
      <mesh position={[0.22, 0.08, 0.205]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 14]} />
        <meshStandardMaterial color={on ? "#ef4444" : "#64748b"} emissive={on ? "#ef4444" : "#000000"} emissiveIntensity={on ? 0.8 : 0} />
      </mesh>
      <Html position={[0, 0.2, 0.22]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
        <div className="text-center">
          <div className="text-[9px] font-black leading-none text-emerald-300">{on ? `${voltage.toFixed(1)} V` : "OFF"}</div>
          <div className="text-[5px] font-bold uppercase text-slate-400">DC supply</div>
        </div>
      </Html>
    </group>
  );
}

function ShcScene({
  metal,
  temp,
  hot,
  lagged,
  heating,
  voltage,
  current,
  mode,
  isMobile,
  moveVectorRef,
}: {
  metal: Metal;
  temp: number;
  hot: number;
  lagged: boolean;
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
    const position: [number, number, number] = isMobile ? [0.9, 2.9, 3.4] : [1.15, 2.75, 3];
    camera.position.set(...position);
    camera.lookAt(0, 1.85, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#dc2626"
        benchColor="#eef2f4"
        posterA={{
          title: "SPECIFIC HEAT",
          lines: [
            "E = m c ΔT",
            "Electrical energy E = V I t",
            "so c = V I t ÷ (m ΔT)",
            "Unit of c: J kg⁻¹ °C⁻¹",
          ],
        }}
        posterB={{
          title: "TYPICAL VALUES",
          lines: ["Water 4200 J/kg°C", "Aluminium 900 J/kg°C", "Copper 385 J/kg°C", "Brass 370 J/kg°C"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {/* Heat-proof mat under the block */}
          <mesh position={[0, 0.015, 0]} receiveShadow>
            <boxGeometry args={[0.9, 0.03, 0.7]} />
            <meshStandardMaterial color="#1c1917" roughness={0.95} />
          </mesh>
          <group position={[0, 0.03, 0]}>
            <MetalBlock metal={metal} hot={hot} />
            <Lagging visible={lagged} />
            <ImmersionHeater on={heating} />
            <Thermometer temp={temp} />
          </group>
          <HeaterWiring />
          <AnalogueMeter
            position={[VOLTMETER_X, 0, VOLTMETER_Z]}
            kind="voltmeter"
            value={heating ? voltage : 0}
            max={15}
            decimals={1}
            label="voltmeter"
          />
          <AnalogueMeter
            position={[AMMETER_X, 0, AMMETER_Z]}
            kind="ammeter"
            value={heating ? current : 0}
            max={5}
            decimals={2}
            label="ammeter"
          />
          <PowerSupply on={heating} voltage={voltage} />
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.85, 0]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.5} />
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
  const height = 108;
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
        stroke="#ef4444"
        strokeWidth={1.9}
      />
      <text x={2} y={12} fill="#94a3b8" fontSize={7} fontWeight={800}>
        θ / °C
      </text>
      <text x={width + 6} y={height + 22} fill="#94a3b8" fontSize={8} fontWeight={800}>
        t / s
      </text>
      <text x={34} y={16} fill="#fca5a5" fontSize={8} fontWeight={800}>
        curve flattens as heat is lost
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function ShcPaper({
  metal,
  voltage,
  current,
  seconds,
  lagged,
  startTemp,
  finalTemp,
  measuredC,
  onClose,
}: {
  metal: Metal;
  voltage: number;
  current: number;
  seconds: number;
  lagged: boolean;
  startTemp: number;
  finalTemp: number;
  measuredC: number;
  onClose: () => void;
}) {
  const energy = voltage * current * seconds;
  const rise = finalTemp - startTemp;
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Determination of the Specific Heat Capacity of a Solid</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To determine the specific heat capacity of {metal.label.toLowerCase()} by the electrical method, using an immersion heater to supply a measured amount of energy.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>{metal.label} block drilled with two holes, 12 V immersion heater, thermometer (0–100 °C), low-voltage d.c. supply, voltmeter, ammeter, stopwatch, balance, lagging (felt or cotton wool), heat-proof mat.</p>
        <h2 className="mt-5 font-bold uppercase">Theory</h2>
        <p>
          Electrical energy supplied E = V I t. If all of this energy goes into the block, E = m c ΔT, where m is the mass
          of the block, c its specific heat capacity and ΔT its temperature rise. Therefore
        </p>
        <p className="mt-2 text-center font-bold">c = V I t ÷ (m ΔT)</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The mass of the block was found on a balance.</li>
          <li>The immersion heater and thermometer were placed in the two holes, with a little oil added to improve thermal contact.</li>
          <li>The block was {lagged ? "lagged with felt to reduce heat loss" : "left unlagged"} and stood on a heat-proof mat.</li>
          <li>The initial temperature of the block was recorded.</li>
          <li>The heater was switched on and the stopwatch started. The voltmeter and ammeter readings were noted.</li>
          <li>After {seconds} s the heater was switched off, and the highest temperature reached was recorded (the temperature continues to rise for a short time after switching off).</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2">Mass of block, m</td>
              <td className="border border-slate-400 p-2">{metal.massKg.toFixed(2)} kg</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Initial temperature, θ₁</td>
              <td className="border border-slate-400 p-2">{startTemp.toFixed(1)} °C</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Final temperature, θ₂</td>
              <td className="border border-slate-400 p-2">{finalTemp.toFixed(1)} °C</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Temperature rise, ΔT</td>
              <td className="border border-slate-400 p-2">{rise.toFixed(1)} °C</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Voltmeter reading, V</td>
              <td className="border border-slate-400 p-2">{voltage.toFixed(1)} V</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Ammeter reading, I</td>
              <td className="border border-slate-400 p-2">{current.toFixed(2)} A</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Time of heating, t</td>
              <td className="border border-slate-400 p-2">{seconds} s</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Energy supplied, E = VIt</td>
              <td className="border border-slate-400 p-2">{energy.toFixed(0)} J</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Calculation</h2>
        <p className="mt-2 text-center font-bold">
          c = {energy.toFixed(0)} ÷ ({metal.massKg.toFixed(2)} × {rise.toFixed(1)}) = {measuredC ? measuredC.toFixed(0) : "…"} J kg⁻¹ °C⁻¹
        </p>
        <p className="mt-2">Accepted value for {metal.label.toLowerCase()}: {metal.trueC} J kg⁻¹ °C⁻¹.</p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The block was lagged and stood on an insulating mat so that as little heat as possible escaped to the surroundings.</li>
          <li>A drop of oil in each hole improved thermal contact between the block, heater and thermometer.</li>
          <li>The highest temperature reached after switching off was taken, because heat continues to flow from the heater into the block.</li>
          <li>Heat lost to the room makes ΔT smaller than it should be, so the calculated value of c comes out larger than the true value.</li>
          <li>Energy used in heating the heater element and the thermometer itself is not accounted for.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The specific heat capacity of {metal.label.toLowerCase()} was found to be about {measuredC ? measuredC.toFixed(0) : "—"} J kg⁻¹ °C⁻¹,
          compared with the accepted value of {metal.trueC} J kg⁻¹ °C⁻¹. The experimental value is higher than the accepted
          value because some of the electrical energy supplied is lost to the surroundings rather than heating the block.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function SpecificHeatSolidSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: SpecificHeatSolidSimProps) {
  const [metalId, setMetalId] = useState<Metal["id"]>("aluminium");
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
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  const metal = METALS.find((each) => each.id === metalId)!;
  const current = voltage / HEATER_RESISTANCE;
  const power = voltage * current;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const fullRun = useMemo(() => simulateHeating(metal, power, seconds, lagged), [lagged, metal, power, seconds]);
  const sampleIndex = Math.min(fullRun.length - 1, Math.round(elapsed));
  const samples = fullRun.slice(0, sampleIndex + 1);
  const temp = fullRun[sampleIndex].temp;
  const finalTemp = fullRun[fullRun.length - 1].temp;
  const finished = elapsed >= seconds;

  const rise = finalTemp - ROOM_TEMP;
  const energy = power * seconds;
  const measuredC = rise > 0 ? energy / (metal.massKg * rise) : 0;
  const percentError = ((measuredC - metal.trueC) / metal.trueC) * 100;

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
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setRunning(false);
    setElapsed(0);
  }, []);

  const toggleDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
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
    ? `ΔT = ${rise.toFixed(1)} °C from ${energy.toFixed(0)} J, so c = ${measuredC.toFixed(0)} J kg⁻¹ °C⁻¹ — about ${percentError.toFixed(0)}% above the accepted ${metal.trueC}.`
    : running
      ? `Heating: ${elapsed.toFixed(0)} s of ${seconds} s, temperature now ${temp.toFixed(1)} °C.`
      : `${metal.label} block, ${metal.massKg.toFixed(1)} kg, at ${ROOM_TEMP} °C. Switch on the ${power.toFixed(0)} W heater.`;

  const observation = complete
    ? `Measured c = ${measuredC.toFixed(0)} J kg⁻¹ °C⁻¹ against an accepted ${metal.trueC}. ${lagged ? "Lagging kept the error small." : "Without lagging much more heat escaped, so the error is large."}`
    : "The heating curve bends over because the hotter the block gets, the faster it loses heat to the room.";

  const primaryLabel = complete ? "Repeat the run" : running ? "Heating…" : "Switch on the heater";

  const setupControls = (
    <div data-experiment-tour="shc-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Metal block</span>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {METALS.map((option) => (
            <button
              key={option.id}
              onClick={() => changeSetting(() => setMetalId(option.id))}
              className="rounded-xl px-1 py-2 text-[10px] font-black transition"
              style={option.id === metalId ? { background: ACCENT.base, color: "#1c0505" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option.label}
              <span className="mt-0.5 block text-[8px] font-bold opacity-80">{option.trueC} J/kg°C</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Supply voltage</span>
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
              style={option === voltage ? { background: ACCENT.base, color: "#1c0505" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
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
              style={option === seconds ? { background: ACCENT.base, color: "#1c0505" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option} s
            </button>
          ))}
        </div>
        <button
          onClick={() => changeSetting(() => setLagged((value) => !value))}
          className="mt-2 w-full rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition hover:bg-white/15"
        >
          {lagged ? "Lagged — tap to remove lagging" : "Unlagged — tap to lag the block"}
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
            <td className="py-1 font-bold text-slate-400">Mass m</td>
            <td className="py-1 text-right font-black">{metal.massKg.toFixed(2)} kg</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">θ₁ → θ₂</td>
            <td className="py-1 text-right font-black">
              {ROOM_TEMP.toFixed(1)} → {temp.toFixed(1)} °C
            </td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">ΔT</td>
            <td className="py-1 text-right font-black">{(temp - ROOM_TEMP).toFixed(1)} °C</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">E = VIt</td>
            <td className="py-1 text-right font-black">{(power * elapsed).toFixed(0)} J</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-center">
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            Measured c
          </div>
          <div className="text-sm font-black text-white">{complete ? measuredC.toFixed(0) : "—"}</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Accepted c</div>
          <div className="text-sm font-black text-white">{metal.trueC}</div>
        </div>
      </div>
      {complete && (
        <div className="mt-1.5 rounded-xl bg-amber-500/15 px-2 py-1.5 text-[9px] font-bold text-amber-200">
          {percentError.toFixed(0)}% too high — heat lost to the surroundings makes ΔT smaller than it should be.
        </div>
      )}
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
          title="Specific Heat Lab"
          subtitle="c = VIt ÷ (mΔT)"
          symbol="🔥"
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

      <div data-experiment-tour="shc-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1.15, 2.75, 3], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <ShcScene
            metal={metal}
            temp={temp}
            hot={(temp - ROOM_TEMP) / 45}
            lagged={lagged}
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
            emoji="🔥"
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
          title="Specific Heat of a Solid"
          tagline="c = VIt ÷ (mΔT)"
          missions={SHC_MISSIONS}
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
            { id: "setup", label: "Set up", value: metal.label, content: setupControls },
            { id: "results", label: "Readings", value: complete ? `${measuredC.toFixed(0)}` : `${temp.toFixed(0)}°C`, content: resultPanel },
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
            { id: "setup", label: "Set up", value: metal.label, content: setupControls },
            { id: "results", label: "Readings", value: complete ? `${measuredC.toFixed(0)}` : `${temp.toFixed(0)}°C`, content: resultPanel },
            { id: "graph", label: "Graph", value: `${elapsed.toFixed(0)}s`, content: graphPanel },
          ]}
        />
      )}

      {showPaper && (
        <ShcPaper
          metal={metal}
          voltage={voltage}
          current={current}
          seconds={seconds}
          lagged={lagged}
          startTemp={ROOM_TEMP}
          finalTemp={finalTemp}
          measuredC={measuredC}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={shcTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
