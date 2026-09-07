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

interface MachineSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.orange;
const PAPER_FILENAME = "efficiency-of-a-pulley-system.html";

/** The load is always raised through the same small height. */
const LOAD_RISE = 0.1; // m
const VISUAL_SCALE = 3; // three.js units per metre of rope travel
const BEAM_Y = BENCH_TOP_Y + 2.15;
const LOWER_BLOCK_REST_Y = BENCH_TOP_Y + 0.95;
const RUN_DURATION_MS = 2600;

interface SystemConfig {
  id: "fixed" | "movable" | "tackle3" | "tackle4";
  label: string;
  short: string;
  /** Velocity ratio = number of rope sections supporting the movable block. */
  vr: number;
  upperSheaves: number;
  lowerSheaves: number;
  /** Weight of the movable (lower) pulley block, which the effort must also lift. */
  blockWeight: number;
}

const SYSTEMS: SystemConfig[] = [
  { id: "fixed", label: "Single fixed pulley", short: "VR 1", vr: 1, upperSheaves: 1, lowerSheaves: 0, blockWeight: 0 },
  { id: "movable", label: "One fixed + one movable", short: "VR 2", vr: 2, upperSheaves: 1, lowerSheaves: 1, blockWeight: 1.2 },
  { id: "tackle3", label: "Block and tackle (3 ropes)", short: "VR 3", vr: 3, upperSheaves: 2, lowerSheaves: 1, blockWeight: 2 },
  { id: "tackle4", label: "Block and tackle (4 ropes)", short: "VR 4", vr: 4, upperSheaves: 2, lowerSheaves: 2, blockWeight: 2.6 },
];

const LOAD_OPTIONS = [5, 10, 15, 20, 30, 40] as const;

interface Reading {
  id: string;
  systemId: SystemConfig["id"];
  vr: number;
  load: number;
  effort: number;
}

const MACHINE_MISSIONS: GameMission[] = [
  {
    short: "Rig it",
    title: "Rig the pulley system",
    detail: "Choose the pulley system and count the rope sections that support the movable block — that number is the velocity ratio.",
    symbol: "🪝",
  },
  {
    short: "Effort",
    title: "Find the effort",
    detail: "Add effort to the spring balance until the load just rises steadily. Read the effort in newtons.",
    symbol: "🎣",
  },
  {
    short: "Distances",
    title: "Measure both distances",
    detail: "Measure how far the load rises and how far the effort end of the rope moves down.",
    symbol: "📏",
  },
  {
    short: "Efficiency",
    title: "Work out the efficiency",
    detail: "Calculate MA = load ÷ effort and VR = effort distance ÷ load distance, then efficiency = (MA ÷ VR) × 100%.",
    symbol: "📊",
  },
];

const machineTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Efficiency of a machine",
    text: "A machine lets a small effort raise a large load, but never gives out more work than is put in. Efficiency compares the useful work output with the total work input.",
    mode: "modal",
  },
  {
    title: "The pulley system",
    text: "The rope runs over the fixed upper block and under the movable lower block. The load hangs from the movable block; the effort is applied to the free end of the rope.",
    mode: "bubble",
    selector: '[data-experiment-tour="machine-scene"]',
  },
  {
    title: "Choose load and system",
    text: "Try different pulley systems and different loads. Watch how the effort and the efficiency change.",
    mode: "bubble",
    selector: '[data-experiment-tour="machine-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Where the work goes",
    text: "Efficiency is always below 100% because some work is used to lift the movable block itself and to overcome friction in the pulleys.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/** Effort needed to raise the load steadily: shares the load and block weight, plus friction. */
function effortFor(system: SystemConfig, load: number) {
  const friction = 0.5 + 0.12 * system.vr;
  return (load + system.blockWeight) / system.vr + friction;
}

/* ------------------------------------------------------------------ 3D bits */

function Sheave({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.085, 0.085, 0.045, 22]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.32} />
      </mesh>
      {/* Groove */}
      <mesh>
        <cylinderGeometry args={[0.066, 0.066, 0.052, 22]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.45} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.016, 0.016, 0.07, 10]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function PulleyBlock({ sheaves, hook }: { sheaves: number; hook: "up" | "down" }) {
  const width = Math.max(0.22, sheaves * 0.14 + 0.1);
  return (
    <group>
      {/* Cheek plates */}
      {[-0.035, 0.035].map((z) => (
        <mesh key={z} position={[0, 0, z]} castShadow>
          <boxGeometry args={[width, 0.24, 0.012]} />
          <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.42} />
        </mesh>
      ))}
      {Array.from({ length: sheaves }, (_, index) => (
        <Sheave key={index} position={[(index - (sheaves - 1) / 2) * 0.14, 0, 0]} />
      ))}
      {/* Hook / shackle */}
      <mesh position={[0, hook === "up" ? 0.16 : -0.16, 0]} castShadow>
        <torusGeometry args={[0.032, 0.009, 8, 18]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.28} />
      </mesh>
    </group>
  );
}

/** The vertical rope sections between the two blocks, plus the free effort end. */
function Ropes({ system, upperY, lowerY, effortY }: { system: SystemConfig; upperY: number; lowerY: number; effortY: number }) {
  const supporting = system.lowerSheaves > 0 ? system.vr : 0;
  const spacing = 0.14;
  const segments: number[] = [];
  for (let index = 0; index < supporting; index += 1) {
    segments.push((index - (supporting - 1) / 2) * spacing);
  }
  const gap = upperY - lowerY;

  return (
    <group>
      {segments.map((x, index) => (
        <mesh key={index} position={[x, lowerY + gap / 2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, Math.max(0.02, gap), 6]} />
          <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
        </mesh>
      ))}
      {/* Free end running down to the spring balance */}
      <mesh position={[0.42, (upperY + effortY) / 2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, Math.max(0.02, upperY - effortY), 6]} />
        <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
      </mesh>
      {/* Short run across the top of the upper block */}
      <mesh position={[0.21, upperY + 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.008, 0.008, 0.42, 6]} />
        <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
      </mesh>
    </group>
  );
}

function SpringBalance({ effort }: { effort: number }) {
  /** Needle sweeps across a 0–50 N scale. */
  const fraction = THREE.MathUtils.clamp(effort / 50, 0, 1);
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.13, 0.42, 0.05]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.028]}>
        <boxGeometry args={[0.03, 0.34, 0.006]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Needle */}
      <mesh position={[0, 0.16 - fraction * 0.32, 0.034]}>
        <boxGeometry args={[0.09, 0.012, 0.004]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <torusGeometry args={[0.025, 0.007, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
      </mesh>
      <Html position={[0.19, 0, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="rounded-lg border border-orange-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[7px] font-black uppercase text-orange-200">Effort</div>
          <div className="text-[10px] font-black text-white">{effort.toFixed(1)} N</div>
        </div>
      </Html>
    </group>
  );
}

function LoadWeights({ load }: { load: number }) {
  const discs = Math.max(1, Math.round(load / 5));
  return (
    <group>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.1, 8]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.32} />
      </mesh>
      {Array.from({ length: Math.min(discs, 8) }, (_, index) => (
        <mesh key={index} position={[0, -0.11 - index * 0.042, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.038, 22]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#44403c" : "#57534e"} metalness={0.65} roughness={0.5} />
        </mesh>
      ))}
      <Html position={[-0.24, -0.18, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="rounded-lg border border-white/25 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[7px] font-black uppercase text-slate-300">Load</div>
          <div className="text-[10px] font-black text-white">{load} N</div>
        </div>
      </Html>
    </group>
  );
}

function Rig({
  system,
  load,
  effort,
  lift,
}: {
  system: SystemConfig;
  load: number;
  effort: number;
  lift: number;
}) {
  const loadRise = lift * LOAD_RISE * VISUAL_SCALE;
  const effortDrop = lift * LOAD_RISE * system.vr * VISUAL_SCALE;
  const upperY = BEAM_Y - 0.22;
  const lowerY = (system.lowerSheaves > 0 ? LOWER_BLOCK_REST_Y : upperY) + loadRise;
  const effortY = BEAM_Y - 0.55 - effortDrop;

  return (
    <group>
      {/* Two stands carrying a rigid cross beam */}
      {[-1.5, 1.5].map((x) => (
        <group key={x} position={[x, BENCH_TOP_Y, 0]}>
          <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.07, 0.42]} />
            <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.55} />
          </mesh>
          <mesh position={[0, (BEAM_Y - BENCH_TOP_Y) / 2, 0]} castShadow>
            <cylinderGeometry args={[0.028, 0.028, BEAM_Y - BENCH_TOP_Y, 14]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, BEAM_Y, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 3.2, 14]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Upper (fixed) block hanging from the beam */}
      <group position={[0, upperY, 0]}>
        <PulleyBlock sheaves={system.upperSheaves} hook="up" />
      </group>

      {/* Lower (movable) block carrying the load — only present when there is one */}
      {system.lowerSheaves > 0 ? (
        <group position={[0, lowerY, 0]}>
          <PulleyBlock sheaves={system.lowerSheaves} hook="down" />
          <group position={[0, -0.18, 0]}>
            <LoadWeights load={load} />
          </group>
        </group>
      ) : (
        <group position={[-0.42, upperY - 0.5 + loadRise, 0]}>
          <LoadWeights load={load} />
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.56, 6]} />
            <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
          </mesh>
        </group>
      )}

      {system.lowerSheaves > 0 && <Ropes system={system} upperY={upperY - 0.02} lowerY={lowerY + 0.02} effortY={effortY} />}
      {system.lowerSheaves === 0 && (
        <>
          <mesh position={[0.42, (upperY + effortY) / 2, 0]}>
            <cylinderGeometry args={[0.008, 0.008, Math.max(0.02, upperY - effortY), 6]} />
            <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
          </mesh>
          <mesh position={[0, upperY + 0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.84, 6]} />
            <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
          </mesh>
        </>
      )}

      <group position={[0.42, effortY, 0]}>
        <SpringBalance effort={effort} />
      </group>

      <Html position={[0, BEAM_Y + 0.28, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="rounded-lg border border-orange-300/35 bg-slate-950/92 px-2 py-1 text-center">
          <div className="text-[8px] font-black uppercase text-orange-200">{system.label}</div>
          <div className="text-[7px] font-bold text-slate-300">velocity ratio = {system.vr}</div>
        </div>
      </Html>
    </group>
  );
}

function MachineScene({
  system,
  load,
  effort,
  lift,
  mode,
  isMobile,
  moveVectorRef,
}: {
  system: SystemConfig;
  load: number;
  effort: number;
  lift: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.5, 3.3, 4.4] : [0.8, 3.15, 3.9];
    camera.position.set(...position);
    camera.lookAt(0, 2.5, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#ea580c"
        benchColor="#eef2f4"
        posterA={{
          title: "MACHINES",
          lines: [
            "MA = load ÷ effort",
            "VR = effort distance ÷ load distance",
            "efficiency = (MA ÷ VR) × 100%",
            "= useful work out ÷ total work in",
          ],
        }}
        posterB={{
          title: "WHY < 100%",
          lines: ["Work is used lifting the movable block", "Friction in the pulley bearings", "Stiffness of the rope"],
        }}
      >
        <Rig system={system} load={load} effort={effort} lift={lift} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.5, 0]} minDistance={2} maxDistance={10} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* ---------------------------------------------------------- Efficiency plot */

function EfficiencyPlot({ readings, system }: { readings: Reading[]; system: SystemConfig }) {
  const curve = LOAD_OPTIONS.map((load) => {
    const effort = effortFor(system, load);
    return { load, efficiency: ((load / effort) / system.vr) * 100 };
  });
  const width = 220;
  const height = 108;
  const maxLoad = LOAD_OPTIONS[LOAD_OPTIONS.length - 1];
  const px = (load: number) => 28 + (load / maxLoad) * width;
  const py = (efficiency: number) => height + 6 - (efficiency / 100) * height;

  return (
    <svg viewBox={`0 0 ${width + 40} ${height + 32}`} className="w-full">
      <line x1={28} y1={4} x2={28} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      <line x1={28} y1={height + 6} x2={width + 32} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      {[25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line x1={26} y1={py(tick)} x2={width + 32} y2={py(tick)} stroke="#1e293b" strokeWidth={0.6} />
          <text x={4} y={py(tick) + 3} fill="#64748b" fontSize={7}>
            {tick}
          </text>
        </g>
      ))}
      <polyline
        points={curve.map((point) => `${px(point.load)},${py(point.efficiency)}`).join(" ")}
        fill="none"
        stroke="#f97316"
        strokeWidth={1.8}
      />
      {readings
        .filter((reading) => reading.systemId === system.id)
        .map((reading) => (
          <circle
            key={reading.id}
            cx={px(reading.load)}
            cy={py(((reading.load / reading.effort) / reading.vr) * 100)}
            r={3.2}
            fill="#fed7aa"
            stroke="#f97316"
            strokeWidth={1}
          />
        ))}
      <text x={2} y={12} fill="#94a3b8" fontSize={7} fontWeight={800}>
        η / %
      </text>
      <text x={width + 8} y={height + 22} fill="#94a3b8" fontSize={8} fontWeight={800}>
        load / N
      </text>
      <text x={34} y={16} fill="#fdba74" fontSize={8} fontWeight={800}>
        efficiency rises with load
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function MachinePaper({ readings, onClose }: { readings: Reading[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Efficiency of a Simple Machine (Pulley System)</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To determine the mechanical advantage, velocity ratio and efficiency of a pulley system, and to investigate how efficiency varies with load.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Pulley blocks (single fixed, single movable and block-and-tackle sets), retort stands and a rigid cross beam, string, spring balance, slotted weights for the load, metre rule.</p>
        <h2 className="mt-5 font-bold uppercase">Theory</h2>
        <p>
          Mechanical advantage MA = load ÷ effort. Velocity ratio VR = distance moved by effort ÷ distance moved by load,
          and for a pulley system this equals the number of rope sections supporting the movable block. Efficiency is the
          fraction of the work put in that appears as useful work:
        </p>
        <p className="mt-2 text-center font-bold">
          efficiency = (work output ÷ work input) × 100% = (load × d<sub>L</sub>) ÷ (effort × d<sub>E</sub>) × 100% = (MA ÷ VR) × 100%
        </p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The pulley system was rigged from the cross beam and the number of supporting rope sections counted to give the velocity ratio.</li>
          <li>A known load was hung from the movable block and its starting height above the bench measured.</li>
          <li>The effort was increased on the spring balance until the load rose steadily, and the effort read in newtons.</li>
          <li>The distance moved by the load and the distance moved by the effort end were both measured.</li>
          <li>The procedure was repeated for several loads and for pulley systems with different velocity ratios.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-slate-400 p-1.5">System</th>
              <th className="border border-slate-400 p-1.5">Load / N</th>
              <th className="border border-slate-400 p-1.5">Effort / N</th>
              <th className="border border-slate-400 p-1.5">d<sub>L</sub> / m</th>
              <th className="border border-slate-400 p-1.5">d<sub>E</sub> / m</th>
              <th className="border border-slate-400 p-1.5">MA</th>
              <th className="border border-slate-400 p-1.5">VR</th>
              <th className="border border-slate-400 p-1.5">Efficiency / %</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading) => {
              const ma = reading.load / reading.effort;
              return (
                <tr key={reading.id}>
                  <td className="border border-slate-400 p-1.5 text-center">VR {reading.vr}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{reading.load}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{reading.effort.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{LOAD_RISE.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{(LOAD_RISE * reading.vr).toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{ma.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{reading.vr}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{((ma / reading.vr) * 100).toFixed(1)}</td>
                </tr>
              );
            })}
            {!readings.length &&
              [0, 1, 2, 3].map((row) => (
                <tr key={row}>
                  {Array.from({ length: 8 }, (_, cell) => (
                    <td key={cell} className="border border-slate-400 p-1.5">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The efficiency of every pulley system was less than 100%. Some of the work put in is used to raise the movable
          pulley block itself and to overcome friction in the bearings and the stiffness of the rope, so the useful work
          output is always smaller than the work input. Efficiency increased as the load increased, because the extra work
          lifting the block and overcoming friction became a smaller fraction of the total. Systems with a larger velocity
          ratio gave a larger mechanical advantage but a lower efficiency, since more pulleys mean more friction and a
          heavier movable block.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function MachineEfficiencySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MachineSimProps) {
  const [systemId, setSystemId] = useState<SystemConfig["id"]>("movable");
  const [load, setLoad] = useState<number>(20);
  const [lift, setLift] = useState(0);
  const [running, setRunning] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  const system = SYSTEMS.find((each) => each.id === systemId)!;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const effort = effortFor(system, load);
  const ma = load / effort;
  const efficiency = (ma / system.vr) * 100;
  const workOutput = load * LOAD_RISE;
  const workInput = effort * LOAD_RISE * system.vr;
  const lifted = lift >= 1;

  const step = readings.length >= 3 ? 3 : lifted ? 2 : running ? 1 : 0;
  const complete = readings.length >= 3;
  const progress = running ? lift : Math.min(1, readings.length / 3);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      setLift(fraction);
      if (fraction >= 1) {
        setRunning(false);
        setLift(1);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const raiseLoad = useCallback(() => {
    setLift(0);
    startRef.current = performance.now();
    setRunning(true);
  }, []);

  const recordReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (!lifted) return;
    setReadings((current) => {
      if (current.length >= 8) return current;
      return [...current, { id: `${Date.now()}-${current.length}`, systemId, vr: system.vr, load, effort }];
    });
  }, [effort, lifted, load, system.vr, systemId]);

  const changeSetting = useCallback((apply: () => void) => {
    apply();
    setRunning(false);
    setLift(0);
  }, []);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setReadings([]);
    setRunning(false);
    setLift(0);
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
    setReadings([]);
    /** Same system, three increasing loads — shows efficiency rising with load. */
    const script = [10, 20, 40];
    script.forEach((demoLoad, index) => {
      demoTimers.current.push(
        window.setTimeout(() => {
          setLoad(demoLoad);
          setLift(0);
          startRef.current = performance.now();
          setRunning(true);
        }, index * 3600),
      );
      demoTimers.current.push(
        window.setTimeout(() => {
          setReadings((current) => [
            ...current,
            { id: `demo-${index}`, systemId, vr: system.vr, load: demoLoad, effort: effortFor(system, demoLoad) },
          ]);
        }, index * 3600 + 2900),
      );
    });
    demoTimers.current.push(window.setTimeout(() => setDemoActive(false), script.length * 3600));
  }, [demoActive, system, systemId]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? `Three readings taken. Efficiency is always below 100% and rises as the load increases — currently ${efficiency.toFixed(0)}%.`
    : lifted
      ? `The load rose ${(LOAD_RISE * 100).toFixed(0)} cm while the effort end moved ${(LOAD_RISE * system.vr * 100).toFixed(0)} cm. Efficiency = ${efficiency.toFixed(0)}%.`
      : running
        ? "Pulling the effort end down — the load is rising steadily."
        : `${system.label}: an effort of ${effort.toFixed(1)} N is needed to raise a ${load} N load. Pull to find out why.`;

  const observation = complete
    ? `MA = ${ma.toFixed(2)}, VR = ${system.vr}, so efficiency = ${efficiency.toFixed(1)}%. The missing work lifts the movable block and overcomes friction.`
    : "Work input is always greater than work output, so no machine is 100% efficient.";

  const primaryLabel = complete ? "Start again" : lifted ? "Record this reading" : running ? "Lifting…" : "Pull the effort";

  const setupControls = (
    <div data-experiment-tour="machine-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Pulley system</span>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {SYSTEMS.map((option) => {
            const active = option.id === systemId;
            return (
              <button
                key={option.id}
                onClick={() => changeSetting(() => setSystemId(option.id))}
                className="rounded-xl px-2 py-2 text-left text-[10px] font-black transition"
                style={active ? { background: ACCENT.base, color: "#1c0a02" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
              >
                {option.short}
                <span className="mt-0.5 block text-[8px] font-bold leading-tight opacity-85">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Load</span>
          <span className="text-lg font-black" style={{ color: ACCENT.text }}>
            {load} N
          </span>
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1">
          {LOAD_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setLoad(option))}
              className="rounded-lg px-1 py-1.5 text-[9px] font-black transition"
              style={option === load ? { background: ACCENT.base, color: "#1c0a02" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const calculationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Calculations</span>
      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">MA</div>
          <div className="text-sm font-black text-white">{ma.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">VR</div>
          <div className="text-sm font-black text-white">{system.vr}</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            η
          </div>
          <div className="text-sm font-black text-white">{efficiency.toFixed(0)}%</div>
        </div>
      </div>
      <table className="mt-2 w-full text-[9px]">
        <tbody className="text-slate-200">
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Effort</td>
            <td className="py-1 text-right font-black">{effort.toFixed(2)} N</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Load distance d_L</td>
            <td className="py-1 text-right font-black">{LOAD_RISE.toFixed(2)} m</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Effort distance d_E</td>
            <td className="py-1 text-right font-black">{(LOAD_RISE * system.vr).toFixed(2)} m</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Work output</td>
            <td className="py-1 text-right font-black">{workOutput.toFixed(2)} J</td>
          </tr>
          <tr>
            <td className="py-1 font-bold text-slate-400">Work input</td>
            <td className="py-1 text-right font-black">{workInput.toFixed(2)} J</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-1.5 rounded-xl bg-white/[0.04] px-2 py-1.5 text-[9px] font-bold text-slate-300">
        {(workInput - workOutput).toFixed(2)} J of the work put in is wasted lifting the movable block and overcoming friction.
      </div>
    </div>
  );

  const plotPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Efficiency vs load</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length}/3
        </span>
      </div>
      <div className="mt-1.5">
        <EfficiencyPlot readings={readings} system={system} />
      </div>
      <button
        onClick={recordReading}
        disabled={!lifted || readings.length >= 8}
        className="mt-1.5 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        Record this reading
      </button>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Machines Lab"
          subtitle="efficiency = (MA ÷ VR) × 100%"
          symbol="🪝"
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

      <div data-experiment-tour="machine-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.8, 3.15, 3.9], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <MachineScene
            system={system}
            load={load}
            effort={effort}
            lift={lift}
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
            emoji="🪝"
            cornerEmoji="⚙️"
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
          title="Efficiency of a Machine"
          tagline="efficiency = (MA ÷ VR) × 100%"
          missions={MACHINE_MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : lifted ? "📝" : "▶"}
          onPrimary={complete ? resetAll : lifted ? recordReading : raiseLoad}
          primaryDisabled={running}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Rig", value: system.short, content: setupControls },
            { id: "calc", label: "Results", value: `${efficiency.toFixed(0)}%`, content: calculationPanel },
            { id: "plot", label: "Graph", value: `${readings.length}/3`, content: plotPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "pull", label: running ? "Lifting" : "Pull", onClick: raiseLoad, disabled: running, tone: "green" },
            { id: "record", label: "Record", onClick: recordReading, disabled: !lifted, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Rig", value: system.short, content: setupControls },
            { id: "calc", label: "Results", value: `${efficiency.toFixed(0)}%`, content: calculationPanel },
            { id: "plot", label: "Graph", value: `${readings.length}/3`, content: plotPanel },
          ]}
        />
      )}

      {showPaper && <MachinePaper readings={readings} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={machineTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
