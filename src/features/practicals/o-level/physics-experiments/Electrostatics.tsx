"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentResultsGraph } from "../../common/ExperimentResultsGraph";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { BENCH_TOP_Y, LabLighting, LabPlayer, LabRoom } from "../../common/LabEnvironment";
import { AnalogueMeter, BatteryPack, CircuitLead, ResistorBlock } from "../../common/ElectricalApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface ElectrostaticsSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.cyan;
const PAPER_FILENAME = "electrostatics-and-charging-a-capacitor.html";

/* ------------------------------------------------------------------ Science */

type Station = "friction" | "capacitor";
type RodKind = "polythene" | "acetate";

interface RodSpec {
  kind: RodKind;
  name: string;
  cloth: string;
  /** Sign of the charge the rod ends up with after rubbing. */
  sign: 1 | -1;
  colour: string;
  explanation: string;
}

/**
 * Rubbing transfers electrons, never protons. Polythene holds electrons more
 * strongly than wool, so it gains them and becomes negative; acetate gives
 * electrons up to silk, so it is left positive.
 */
const RODS: Record<RodKind, RodSpec> = {
  polythene: {
    kind: "polythene",
    name: "Polythene rod",
    cloth: "woollen cloth",
    sign: -1,
    colour: "#1f2937",
    explanation:
      "The polythene pulls electrons off the wool, so the rod gains electrons and is left negatively charged. The wool, having lost them, is left equally positive.",
  },
  acetate: {
    kind: "acetate",
    name: "Acetate rod",
    cloth: "silk cloth",
    sign: 1,
    colour: "#e2e8f0",
    explanation:
      "The silk pulls electrons off the acetate, so the rod loses electrons and is left positively charged. Charge is not created — it is only moved.",
  },
};

/** Capacitor kit: values are the ones used in a school RC experiment. */
const CAPACITANCES = [1000, 2200, 4700]; // microfarads
const RESISTANCES = [4.7, 10, 22]; // kilohms
const CAPACITOR_SUPPLY = 6; // volts

const FRICTION_MISSIONS: GameMission[] = [
  {
    short: "Charge",
    title: "Charge the rods by rubbing",
    detail: "Rub the polythene rod with wool and the acetate rod with silk. Electrons move from one to the other.",
    symbol: "🧻",
  },
  {
    short: "Repel",
    title: "Show that like charges repel",
    detail: "Hang a charged polythene rod in the stirrup and bring the other charged polythene rod up to it.",
    symbol: "↔️",
  },
  {
    short: "Attract",
    title: "Show that unlike charges attract",
    detail: "Now bring the charged acetate rod up to the suspended polythene rod instead.",
    symbol: "🧲",
  },
  {
    short: "Test",
    title: "Use the gold-leaf electroscope",
    detail: "Charge the electroscope by contact, then test the sign of an unknown charge by watching whether the leaf rises or falls.",
    symbol: "🔬",
  },
];

const CAPACITOR_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Build the charging circuit",
    detail: "Connect the capacitor in series with a resistor, a milliammeter and a two-way switch, with the voltmeter across the capacitor.",
    symbol: "🔌",
  },
  {
    short: "Charge",
    title: "Charge the capacitor",
    detail: "Move the switch to charge, and record the current and the p.d. across the capacitor every ten seconds.",
    symbol: "⚡",
  },
  {
    short: "Graph",
    title: "Plot the curves",
    detail: "The p.d. rises towards the supply voltage while the current falls away — both curves flatten out.",
    symbol: "📈",
  },
  {
    short: "Discharge",
    title: "Discharge it again",
    detail: "Move the switch the other way and watch the current flow the opposite way as the capacitor empties.",
    symbol: "🔻",
  },
];

const electrostaticsTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Static electricity",
    text: "Rubbing two insulators together moves electrons from one to the other. The one that gains electrons becomes negative and the one that loses them becomes positive.",
    mode: "modal",
  },
  {
    title: "The bench",
    text: "A charged rod hangs freely in a stirrup so that it can turn. The gold-leaf electroscope beside it detects charge: the leaf rises when the electroscope is charged.",
    mode: "bubble",
    selector: '[data-experiment-tour="static-scene"]',
  },
  {
    title: "Like and unlike",
    text: "Bring a second rod up to the suspended one. Like charges repel, unlike charges attract, and an uncharged object is attracted to either.",
    mode: "bubble",
    selector: '[data-experiment-tour="static-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "The capacitor bench",
    text: "Switch to the capacitor station to charge a capacitor through a resistor and watch the current die away while the p.d. builds up.",
    mode: "bubble",
    selector: '[data-experiment-tour="static-results"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** A charged rod. Small sparks around it hint at the charge it carries. */
function ChargedRod({
  rod,
  charged,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: {
  rod: RodSpec;
  charged: boolean;
  rotation?: [number, number, number];
  position?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.9, 18]} />
        <meshStandardMaterial
          color={rod.colour}
          roughness={rod.kind === "polythene" ? 0.5 : 0.24}
          metalness={0.06}
          emissive={charged ? new THREE.Color(rod.sign > 0 ? "#f43f5e" : "#38bdf8") : new THREE.Color("#000000")}
          emissiveIntensity={charged ? 0.18 : 0}
        />
      </mesh>
      {charged &&
        Array.from({ length: 6 }, (_, index) => (
          <Html
            key={index}
            position={[0.09, -0.36 + index * 0.145, 0]}
            center
            distanceFactor={6}
            style={{ pointerEvents: "none" }}
          >
            <div className={`text-[10px] font-black ${rod.sign > 0 ? "text-rose-300" : "text-sky-300"}`}>
              {rod.sign > 0 ? "+" : "−"}
            </div>
          </Html>
        ))}
    </group>
  );
}

/** The suspended rod in its stirrup, which turns towards or away from a rod held near it. */
function SuspendedRod({
  rod,
  charged,
  deflection,
}: {
  rod: RodSpec;
  charged: boolean;
  deflection: number;
}) {
  const swingRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!swingRef.current) return;
    swingRef.current.rotation.y = THREE.MathUtils.lerp(swingRef.current.rotation.y, deflection, 0.09);
  });

  return (
    <group position={[-0.65, 0, 0]}>
      {/* Retort stand */}
      <mesh position={[0, 0.02, -0.25]} receiveShadow castShadow>
        <boxGeometry args={[0.34, 0.04, 0.24]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.6, -0.25]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 1.16, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.72} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.16, -0.12]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.28, 10]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.72} roughness={0.3} />
      </mesh>

      {/* Silk thread and paper stirrup */}
      <mesh position={[0, 0.94, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 0.42, 6]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <group ref={swingRef} position={[0, 0.73, 0]}>
        <mesh>
          <torusGeometry args={[0.07, 0.008, 6, 20]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
        </mesh>
        <ChargedRod rod={rod} charged={charged} rotation={[0, 0, Math.PI / 2]} />
      </group>
    </group>
  );
}

/**
 * A gold-leaf electroscope. The leaf hangs from the metal stem inside a glass
 * case; when the electroscope carries charge the leaf and the stem repel and
 * the leaf rises.
 */
function GoldLeafElectroscope({ divergence, earthed }: { divergence: number; earthed: boolean }) {
  const angle = THREE.MathUtils.clamp(divergence, 0, 1) * 0.85;

  return (
    <group position={[0.85, 0, 0.05]}>
      {/* Base and glass case */}
      <mesh position={[0, 0.03, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.32, 0.06, 26]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.72, 26, 1, true]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          transparent
          opacity={0.2}
          transmission={0.86}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.79, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.03, 26]} />
        <meshStandardMaterial color="#57534e" roughness={0.7} />
      </mesh>

      {/* Brass cap, rod and plate */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.03, 24]} />
        <meshStandardMaterial color="#c9a227" metalness={0.84} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.46, 12]} />
        <meshStandardMaterial color="#c9a227" metalness={0.84} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.11, 0.02, 0.06]} />
        <meshStandardMaterial color="#c9a227" metalness={0.84} roughness={0.22} />
      </mesh>

      {/* The gold leaf itself, and the fixed plate it swings away from */}
      <mesh position={[-0.012, 0.33, 0]}>
        <boxGeometry args={[0.012, 0.3, 0.05] } />
        <meshStandardMaterial color="#a8a29e" metalness={0.5} roughness={0.5} />
      </mesh>
      <group position={[0.006, 0.48, 0]} rotation={[0, 0, -angle]}>
        <mesh position={[0.02, -0.15, 0]}>
          <boxGeometry args={[0.006, 0.3, 0.055]} />
          <meshStandardMaterial color="#facc15" metalness={0.72} roughness={0.36} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {earthed && (
        <mesh position={[0.18, 0.94, 0]} rotation={[0, 0, -0.5]}>
          <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
          <meshStandardMaterial color="#16a34a" roughness={0.6} />
        </mesh>
      )}

      <Html position={[0, 1.14, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-center">
          <div className="text-[7px] font-black uppercase text-slate-200">gold-leaf electroscope</div>
          <div className="text-[8px] font-black text-white">
            {divergence < 0.08 ? "leaf down" : divergence > 0.6 ? "leaf well up" : "leaf part way up"}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Small pieces of paper that jump up to a charged rod. */
function PaperBits({ lifted }: { lifted: number }) {
  return (
    <group position={[0.05, 0.02, 0.75]}>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = index * 2.3;
        const radius = 0.06 + (index % 4) * 0.045;
        const rise = lifted * (0.16 + (index % 3) * 0.05);
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * radius, 0.005 + rise, Math.sin(angle) * radius]}
            rotation={[Math.PI / 2 - lifted * 1.2, angle, 0]}
          >
            <planeGeometry args={[0.035, 0.028]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

/** The electrolytic capacitor on the circuit board. */
function CapacitorCan({ charge, capacitance }: { charge: number; capacitance: number }) {
  return (
    <group position={[0.35, 0.02, 0.35]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.44, 0.04, 0.34]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.4, 26]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* The charge stripe up the side of the can */}
      <mesh position={[0, 0.06 + charge * 0.18, 0.141]}>
        <planeGeometry args={[0.12, 0.03]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 0.02, 26]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      {[-0.06, 0.06].map((x, index) => (
        <mesh key={x} position={[x, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.1, 10]} />
          <meshStandardMaterial color={index === 0 ? "#b91c1c" : "#111827"} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <Html position={[0, 0.68, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-cyan-300/30 bg-slate-950/92 px-1.5 py-0.5 text-center">
          <div className="text-[9px] font-black text-white">{capacitance} µF</div>
          <div className="text-[6px] font-black uppercase text-cyan-200">{(charge * 100).toFixed(0)}% charged</div>
        </div>
      </Html>
    </group>
  );
}

/** The two-way switch that selects charge or discharge. */
function TwoWaySwitch({ position }: { position: "charge" | "discharge" | "off" }) {
  const angle = position === "charge" ? -0.5 : position === "discharge" ? 0.5 : 0;

  return (
    <group position={[-0.75, 0.02, 0.45]}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.06, 0.3]} />
        <meshStandardMaterial color="#e7dfc8" roughness={0.62} />
      </mesh>
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={x} position={[x, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.034, 0.07, 14]} />
          <meshStandardMaterial color="#b98a3d" metalness={0.8} roughness={0.22} />
        </mesh>
      ))}
      <group position={[0, 0.14, 0]} rotation={[0, 0, angle]}>
        <mesh position={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.17, 0.022, 0.04]} />
          <meshStandardMaterial color="#c69b50" metalness={0.85} roughness={0.18} />
        </mesh>
      </group>
      <Html position={[0, 0.1, 0.24]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
          {position === "charge" ? "charging" : position === "discharge" ? "discharging" : "off"}
        </div>
      </Html>
    </group>
  );
}

function StaticScene({
  station,
  suspendedRod,
  suspendedCharged,
  deflection,
  heldRod,
  heldCharged,
  heldNear,
  divergence,
  earthed,
  paperLift,
  capacitorCharge,
  capacitance,
  resistance,
  current,
  voltage,
  switchPosition,
  mode,
  isMobile,
  moveVectorRef,
}: {
  station: Station;
  suspendedRod: RodSpec;
  suspendedCharged: boolean;
  deflection: number;
  heldRod: RodSpec;
  heldCharged: boolean;
  heldNear: number;
  divergence: number;
  earthed: boolean;
  paperLift: number;
  capacitorCharge: number;
  capacitance: number;
  resistance: number;
  current: number;
  voltage: number;
  switchPosition: "charge" | "discharge" | "off";
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 3.0, 2.9] : [0.1, 2.75, 2.4];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.45, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 47;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0891b2"
        benchColor="#eef2f5"
        posterA={{
          title: station === "friction" ? "STATIC ELECTRICITY" : "CHARGING A CAPACITOR",
          lines:
            station === "friction"
              ? [
                  "Rubbing moves electrons, not protons",
                  "Gains electrons → negative",
                  "Loses electrons → positive",
                  "Like repel · unlike attract",
                ]
              : [
                  "Current is largest at the start",
                  "P.d. rises towards the supply",
                  "Both curves flatten out",
                  "Bigger R or C = slower charging",
                ],
        }}
        posterB={{
          title: "GOLD-LEAF ELECTROSCOPE",
          lines: ["Leaf rises when charged", "Same charge near → leaf rises more", "Opposite charge near → leaf falls"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {station === "friction" ? (
            <>
              <SuspendedRod rod={suspendedRod} charged={suspendedCharged} deflection={deflection} />
              <GoldLeafElectroscope divergence={divergence} earthed={earthed} />
              <PaperBits lifted={paperLift} />
              {/* The rod held in the hand, brought up to the suspended one */}
              <group position={[-0.65 + 0.62 - heldNear * 0.34, 0.73, 0.36 - heldNear * 0.3]}>
                <ChargedRod rod={heldRod} charged={heldCharged} rotation={[0, 0, Math.PI / 2]} />
              </group>
              {/* Cloths on the bench */}
              <mesh position={[-1.5, 0.03, 0.6]} rotation={[-Math.PI / 2, 0, 0.3]} receiveShadow>
                <planeGeometry args={[0.36, 0.28]} />
                <meshStandardMaterial color="#a16207" roughness={0.95} side={THREE.DoubleSide} />
              </mesh>
              <mesh position={[-1.5, 0.03, 0.05]} rotation={[-Math.PI / 2, 0, -0.2]} receiveShadow>
                <planeGeometry args={[0.34, 0.26]} />
                <meshStandardMaterial color="#f5d0fe" roughness={0.86} side={THREE.DoubleSide} />
              </mesh>
              <Html position={[-1.5, 0.12, 0.6]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
                <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
                  wool
                </div>
              </Html>
              <Html position={[-1.5, 0.12, 0.05]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
                <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
                  silk
                </div>
              </Html>
            </>
          ) : (
            <>
              <BatteryPack position={[-1.5, 0.02, -0.3]} cells={4} emf={CAPACITOR_SUPPLY} />
              <TwoWaySwitch position={switchPosition} />
              <ResistorBlock position={[-0.15, 0.02, 0.35]} ohms={resistance * 1000} highlighted={switchPosition !== "off"} />
              <CapacitorCan charge={capacitorCharge} capacitance={capacitance} />
              <AnalogueMeter position={[1.2, 0.02, -0.35]} kind="milliammeter" value={Math.abs(current)} max={1.4} decimals={2} label="milliammeter" />
              <AnalogueMeter position={[1.2, 0.02, 0.75]} kind="voltmeter" value={voltage} max={6} decimals={2} label="p.d. across C" />

              <CircuitLead
                points={[
                  [-1.2, 0.19, -0.3],
                  [-0.95, 0.07, 0.1],
                  [-0.9, 0.09, 0.45],
                ]}
                colour="#b91c1c"
              />
              <CircuitLead
                points={[
                  [-0.6, 0.09, 0.45],
                  [-0.38, 0.09, 0.4],
                  [-0.33, 0.09, 0.35],
                ]}
                colour="#111827"
              />
              <CircuitLead
                points={[
                  [0.03, 0.09, 0.35],
                  [0.2, 0.09, 0.35],
                  [0.29, 0.5, 0.35],
                ]}
                colour="#111827"
              />
              <CircuitLead
                points={[
                  [0.41, 0.5, 0.35],
                  [0.9, 0.1, 0.1],
                  [1.07, 0.29, -0.18],
                ]}
                colour="#111827"
              />
              <CircuitLead
                points={[
                  [1.33, 0.29, -0.18],
                  [1.7, 0.07, -0.4],
                  [-1.8, 0.06, -0.5],
                  [-1.8, 0.19, -0.3],
                ]}
                colour="#111827"
              />
              <CircuitLead points={[[1.07, 0.29, 0.92], [0.6, 0.1, 0.7], [0.29, 0.52, 0.36]]} colour="#1d4ed8" />
              <CircuitLead points={[[1.33, 0.29, 0.92], [0.9, 0.1, 0.9], [0.41, 0.52, 0.36]]} colour="#1d4ed8" />
            </>
          )}
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.45, 0]} minDistance={1.5} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function ElectrostaticsPaper({
  chargeReadings,
  capacitance,
  resistance,
  onClose,
}: {
  chargeReadings: { time: number; voltage: number; current: number }[];
  capacitance: number;
  resistance: number;
  onClose: () => void;
}) {
  const timeConstant = (resistance * 1000 * capacitance) / 1e6;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Electrostatics and the Charging of a Capacitor</h1>
        <h2 className="mt-6 font-bold uppercase">Part A — Charging by friction</h2>
        <h3 className="mt-3 font-bold">Aim</h3>
        <p>To charge insulating rods by friction, to show that like charges repel and unlike charges attract, and to use a gold-leaf electroscope to detect and identify charge.</p>
        <h3 className="mt-3 font-bold">Apparatus</h3>
        <p>A polythene rod, an acetate rod, a woollen cloth, a silk cloth, a paper stirrup on a silk thread, a retort stand, small pieces of paper and a gold-leaf electroscope.</p>
        <h3 className="mt-3 font-bold">Method</h3>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The polythene rod was rubbed briskly with the woollen cloth and held over small pieces of paper, which jumped up to it.</li>
          <li>A second charged polythene rod was hung in the paper stirrup so that it could turn freely.</li>
          <li>The first charged polythene rod was brought slowly up to one end of the suspended rod, and the movement observed.</li>
          <li>The acetate rod was rubbed with the silk cloth and brought up to the suspended polythene rod in the same way.</li>
          <li>The charged polythene rod was drawn across the cap of the gold-leaf electroscope, so that some of the charge passed to it, and the leaf was observed.</li>
          <li>A rod of unknown charge was then brought slowly towards the cap of the charged electroscope, and it was noted whether the leaf rose further or fell.</li>
        </ol>
        <h3 className="mt-3 font-bold">Observations and conclusion</h3>
        <ul className="list-disc space-y-1 pl-6">
          <li>The rubbed rod attracted the pieces of paper, showing that it was charged.</li>
          <li>The charged polythene rod pushed the suspended polythene rod away: like charges repel.</li>
          <li>The charged acetate rod pulled the suspended polythene rod towards it: unlike charges attract.</li>
          <li>When the electroscope was charged the leaf rose and stayed up, because the leaf and the stem carried the same charge and repelled each other.</li>
          <li>Bringing a rod of the same sign nearer made the leaf rise further; a rod of the opposite sign made the leaf fall. This is the test for the sign of an unknown charge — an increase in divergence is the only sure test.</li>
        </ul>
        <p className="mt-2">
          Rubbing does not create charge; it only transfers electrons. Polythene gains electrons from wool and becomes
          negative, while acetate loses electrons to silk and becomes positive. In each case the cloth is left with an
          equal and opposite charge, so the total charge is unchanged.
        </p>

        <h2 className="mt-6 font-bold uppercase">Part B — Charging a capacitor</h2>
        <h3 className="mt-3 font-bold">Aim</h3>
        <p>To investigate how the current and the p.d. change while a capacitor is charged through a resistor, and while it discharges.</p>
        <h3 className="mt-3 font-bold">Apparatus</h3>
        <p>A {capacitance} µF electrolytic capacitor, a {resistance} kΩ resistor, a 6 V battery, a two-way switch, a milliammeter, a voltmeter and a stopwatch.</p>
        <h3 className="mt-3 font-bold">Method</h3>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The capacitor was connected in series with the resistor, the milliammeter and one side of the two-way switch, with the battery across the whole circuit.</li>
          <li>The voltmeter was connected across the capacitor.</li>
          <li>The switch was moved to the charging position and the stopwatch started at the same instant.</li>
          <li>The current and the p.d. across the capacitor were recorded every ten seconds until the current had almost fallen to zero.</li>
          <li>The switch was then moved to the discharging position, which connects the capacitor across the resistor alone, and the readings were taken again.</li>
          <li>Graphs of current against time and of p.d. against time were plotted for both charging and discharging.</li>
        </ol>
        <h3 className="mt-3 font-bold">Results</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Time t / s</th>
              <th className="border border-slate-400 p-2">Current I / mA</th>
              <th className="border border-slate-400 p-2">p.d. across C / V</th>
            </tr>
          </thead>
          <tbody>
            {(chargeReadings.length ? chargeReadings : []).map((reading) => (
              <tr key={reading.time}>
                <td className="border border-slate-400 p-2 text-center">{reading.time.toFixed(0)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.current.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.voltage.toFixed(2)}</td>
              </tr>
            ))}
            {!chargeReadings.length &&
              [0, 1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {Array.from({ length: 3 }, (_, cell) => (
                    <td key={cell} className="border border-slate-400 p-2">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <h3 className="mt-3 font-bold">Conclusion</h3>
        <p>
          At the instant the switch was closed the capacitor was empty, so the whole of the supply p.d. was across the
          resistor and the current was at its largest value, I = V ÷ R. As charge collected on the plates the p.d. across
          the capacitor rose, leaving less p.d. across the resistor, so the current fell away. The p.d. across the
          capacitor rose steeply at first and then flattened out as it approached the supply p.d. of {CAPACITOR_SUPPLY} V,
          while the current fell in the mirror-image curve towards zero. On discharging, the current flowed the opposite
          way through the milliammeter and both the current and the p.d. died away in the same shaped curve. Charging is
          faster with a smaller resistance or a smaller capacitance: with {resistance} kΩ and {capacitance} µF the time
          constant RC is about {timeConstant.toFixed(0)} s, which is the time taken for the p.d. to reach about 63% of the
          supply.
        </p>
        <h3 className="mt-3 font-bold">Precautions</h3>
        <ul className="list-disc space-y-1 pl-6">
          <li>The electrolytic capacitor was connected the correct way round, since connecting it in reverse damages it.</li>
          <li>The capacitor was fully discharged before each run, so that every run started from zero.</li>
          <li>The stopwatch was started at the same instant as the switch was moved.</li>
          <li>Readings were taken quickly, because the current changes fastest at the start.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function ElectrostaticsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ElectrostaticsSimProps) {
  const [station, setStation] = useState<Station>("friction");

  /* -------------------------------------------------- friction station state */
  const [suspendedKind, setSuspendedKind] = useState<RodKind>("polythene");
  const [suspendedCharged, setSuspendedCharged] = useState(false);
  const [heldKind, setHeldKind] = useState<RodKind>("polythene");
  const [heldCharged, setHeldCharged] = useState(false);
  const [heldNear, setHeldNear] = useState(0);
  const [electroscopeCharge, setElectroscopeCharge] = useState(0);
  const [earthed, setEarthed] = useState(false);
  const [paperLift, setPaperLift] = useState(0);
  const [seen, setSeen] = useState<Record<string, boolean>>({});

  /* ------------------------------------------------- capacitor station state */
  const [capacitance, setCapacitance] = useState(CAPACITANCES[1]);
  const [resistance, setResistance] = useState(RESISTANCES[1]);
  const [switchPosition, setSwitchPosition] = useState<"charge" | "discharge" | "off">("off");
  const [elapsed, setElapsed] = useState(0);
  const [capacitorVoltage, setCapacitorVoltage] = useState(0);
  const [chargeReadings, setChargeReadings] = useState<{ time: number; voltage: number; current: number }[]>([]);

  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const timers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const suspendedRod = RODS[suspendedKind];
  const heldRod = RODS[heldKind];

  const markSeen = useCallback((key: string) => setSeen((current) => (current[key] ? current : { ...current, [key]: true })), []);

  /* ---------------------------------------------------------- friction logic */

  /**
   * A charged rod brought up to the suspended one turns it away if the charges
   * are alike and towards it if they are opposite. An uncharged rod is always
   * attracted, because the charged rod induces the opposite charge on its near
   * face.
   */
  const deflection = useMemo(() => {
    if (heldNear < 0.2) return 0;
    if (!heldCharged && !suspendedCharged) return 0;
    if (!suspendedCharged || !heldCharged) return -0.4 * heldNear;
    const alike = suspendedRod.sign === heldRod.sign;
    return (alike ? 0.75 : -0.55) * heldNear;
  }, [heldCharged, heldNear, heldRod.sign, suspendedCharged, suspendedRod.sign]);

  /** How far the leaf is splayed, from the charge on the electroscope plus any induced by a rod held near. */
  const divergence = useMemo(() => {
    if (earthed) return 0;
    const induced = heldNear > 0.55 && heldCharged ? 0.7 * heldRod.sign : 0;
    return THREE.MathUtils.clamp(Math.abs(electroscopeCharge + induced), 0, 1);
  }, [earthed, electroscopeCharge, heldCharged, heldNear, heldRod.sign]);

  const rubRod = useCallback(() => {
    labSounds.play("magnetSlide", { volume: 0.45 });
    setHeldCharged(true);
    markSeen("friction");
    setPaperLift(0);
  }, [markSeen]);

  const hangCharged = useCallback(() => {
    setSuspendedCharged(true);
    setSuspendedKind(heldKind);
    markSeen("friction");
  }, [heldKind, markSeen]);

  const bringNear = useCallback(() => {
    clearTimers();
    const frames = 18;
    for (let index = 1; index <= frames; index += 1) {
      timers.current.push(window.setTimeout(() => setHeldNear(index / frames), index * 36));
    }
    timers.current.push(
      window.setTimeout(() => {
        if (heldCharged && suspendedCharged) {
          markSeen(suspendedRod.sign === heldRod.sign ? "repel" : "attract");
        }
      }, frames * 36 + 260),
    );
  }, [clearTimers, heldCharged, heldRod.sign, markSeen, suspendedCharged, suspendedRod.sign]);

  const takeAway = useCallback(() => {
    clearTimers();
    const frames = 12;
    for (let index = 1; index <= frames; index += 1) {
      timers.current.push(window.setTimeout(() => setHeldNear(1 - index / frames), index * 32));
    }
  }, [clearTimers]);

  /** Drawing the charged rod across the cap leaves charge of the same sign behind. */
  const chargeByContact = useCallback(() => {
    labSounds.play("sparkDischarge", { volume: 0.5 });
    if (!heldCharged) return;
    setElectroscopeCharge(heldRod.sign * 0.85);
    setEarthed(false);
    markSeen("electroscope");
  }, [heldCharged, heldRod.sign, markSeen]);

  /** Earthing with a charged rod still near, then removing the rod, leaves the opposite charge. */
  const chargeByInduction = useCallback(() => {
    labSounds.play("sparkDischarge", { volume: 0.35, rate: 1.2 });
    if (!heldCharged || heldNear < 0.55) return;
    setEarthed(true);
    timers.current.push(
      window.setTimeout(() => {
        setEarthed(false);
        setElectroscopeCharge(-heldRod.sign * 0.8);
        markSeen("induction");
        takeAway();
      }, 900),
    );
  }, [heldCharged, heldNear, heldRod.sign, markSeen, takeAway]);

  const testPaper = useCallback(() => {
    clearTimers();
    if (!heldCharged) return;
    const frames = 12;
    for (let index = 1; index <= frames; index += 1) {
      timers.current.push(window.setTimeout(() => setPaperLift(index / frames), index * 40));
    }
    timers.current.push(window.setTimeout(() => markSeen("paper"), frames * 40 + 200));
    timers.current.push(window.setTimeout(() => setPaperLift(0), frames * 40 + 1600));
  }, [clearTimers, heldCharged, markSeen]);

  /* --------------------------------------------------------- capacitor logic */

  const timeConstant = (resistance * 1000 * capacitance) / 1e6;
  const maxCurrent = (CAPACITOR_SUPPLY / (resistance * 1000)) * 1000; // in mA
  const capacitorCurrent =
    switchPosition === "charge"
      ? ((CAPACITOR_SUPPLY - capacitorVoltage) / (resistance * 1000)) * 1000
      : switchPosition === "discharge"
        ? -(capacitorVoltage / (resistance * 1000)) * 1000
        : 0;

  /** Steps the capacitor forward in real time while the switch is over. */
  useEffect(() => {
    if (switchPosition === "off") return;
    const tick = 250;
    const interval = window.setInterval(() => {
      setElapsed((value) => value + tick / 1000);
      setCapacitorVoltage((value) => {
        const target = switchPosition === "charge" ? CAPACITOR_SUPPLY : 0;
        /** Exponential approach to the target, with time constant RC. */
        const factor = Math.exp(-(tick / 1000) / timeConstant);
        return target + (value - target) * factor;
      });
    }, tick);
    return () => window.clearInterval(interval);
  }, [switchPosition, timeConstant]);

  const recordCapacitorReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (switchPosition === "off") return;
    setChargeReadings((existing) => {
      if (existing.length >= 12) return existing;
      if (existing.some((reading) => Math.abs(reading.time - elapsed) < 2)) return existing;
      markSeen("capacitor");
      return [...existing, { time: elapsed, voltage: capacitorVoltage, current: Math.abs(capacitorCurrent) }].sort(
        (a, b) => a.time - b.time,
      );
    });
  }, [capacitorCurrent, capacitorVoltage, elapsed, markSeen, switchPosition]);

  const startCharging = useCallback(() => {
    labSounds.play("switchClick", { volume: 0.5 });
    setSwitchPosition("charge");
    setElapsed(0);
    setCapacitorVoltage(0);
    setChargeReadings([]);
  }, []);

  const startDischarging = useCallback(() => {
    labSounds.play("switchClick", { volume: 0.5, rate: 0.9 });
    setSwitchPosition("discharge");
    setElapsed(0);
    markSeen("discharge");
  }, [markSeen]);

  /* ------------------------------------------------------------------ shared */

  const resetAll = useCallback(() => {
    clearTimers();
    setSuspendedCharged(false);
    setHeldCharged(false);
    setHeldNear(0);
    setElectroscopeCharge(0);
    setEarthed(false);
    setPaperLift(0);
    setSeen({});
    setSwitchPosition("off");
    setElapsed(0);
    setCapacitorVoltage(0);
    setChargeReadings([]);
    setDemoActive(false);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);

    if (station === "friction") {
      setHeldKind("polythene");
      setHeldCharged(false);
      setSuspendedCharged(false);
      setHeldNear(0);
      setElectroscopeCharge(0);

      timers.current.push(window.setTimeout(() => setHeldCharged(true), 500));
      timers.current.push(window.setTimeout(() => markSeen("friction"), 600));
      timers.current.push(
        window.setTimeout(() => {
          setSuspendedCharged(true);
          setSuspendedKind("polythene");
        }, 1100),
      );
      /** Like charges: the suspended rod swings away. */
      for (let index = 1; index <= 14; index += 1) {
        timers.current.push(window.setTimeout(() => setHeldNear(index / 14), 1500 + index * 45));
      }
      timers.current.push(window.setTimeout(() => markSeen("repel"), 2400));
      for (let index = 1; index <= 10; index += 1) {
        timers.current.push(window.setTimeout(() => setHeldNear(1 - index / 10), 3400 + index * 40));
      }
      /** Then the acetate rod, which attracts it. */
      timers.current.push(
        window.setTimeout(() => {
          setHeldKind("acetate");
          setHeldCharged(true);
        }, 4000),
      );
      for (let index = 1; index <= 14; index += 1) {
        timers.current.push(window.setTimeout(() => setHeldNear(index / 14), 4300 + index * 45));
      }
      timers.current.push(window.setTimeout(() => markSeen("attract"), 5200));
      timers.current.push(
        window.setTimeout(() => {
          setElectroscopeCharge(1 * 0.85);
          markSeen("electroscope");
        }, 6000),
      );
      timers.current.push(window.setTimeout(() => setDemoActive(false), 6800));
      return;
    }

    /** Capacitor station: a full charge run with readings every few seconds. */
    setSwitchPosition("charge");
    setElapsed(0);
    setCapacitorVoltage(0);
    setChargeReadings([]);
    for (let index = 0; index < 6; index += 1) {
      timers.current.push(
        window.setTimeout(() => {
          setChargeReadings((existing) => {
            const time = index * timeConstant * 0.5;
            const voltage = CAPACITOR_SUPPLY * (1 - Math.exp(-time / timeConstant));
            return [
              ...existing,
              { time, voltage, current: ((CAPACITOR_SUPPLY - voltage) / (resistance * 1000)) * 1000 },
            ].sort((a, b) => a.time - b.time);
          });
          markSeen("capacitor");
        }, 400 + index * 700),
      );
    }
    timers.current.push(window.setTimeout(() => setSwitchPosition("discharge"), 5200));
    timers.current.push(window.setTimeout(() => markSeen("discharge"), 5400));
    timers.current.push(window.setTimeout(() => setDemoActive(false), 6600));
  }, [clearTimers, demoActive, markSeen, resistance, station, timeConstant]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const frictionDone = ["friction", "repel", "attract", "electroscope"].filter((key) => seen[key]).length;
  const capacitorDone = (chargeReadings.length >= 5 ? 1 : 0) + (seen.discharge ? 1 : 0);
  const complete = station === "friction" ? frictionDone >= 4 : chargeReadings.length >= 5 && Boolean(seen.discharge);
  const step =
    station === "friction"
      ? Math.min(3, frictionDone)
      : complete
        ? 3
        : chargeReadings.length >= 3
          ? 2
          : switchPosition !== "off"
            ? 1
            : 0;
  const progress = station === "friction" ? frictionDone / 4 : Math.min(1, (chargeReadings.length + capacitorDone) / 6);

  const status =
    station === "friction"
      ? complete
        ? "All four observations made: rubbing charges the rod, like charges repel, unlike charges attract, and the leaf of a charged electroscope stays up."
        : heldNear > 0.55 && heldCharged && suspendedCharged
          ? suspendedRod.sign === heldRod.sign
            ? "The suspended rod swings away — like charges repel."
            : "The suspended rod swings towards it — unlike charges attract."
          : !heldCharged
            ? `Rub the ${heldRod.name.toLowerCase()} briskly with the ${heldRod.cloth}.`
            : `The ${heldRod.name.toLowerCase()} is now ${heldRod.sign > 0 ? "positively" : "negatively"} charged. ${heldRod.explanation}`
      : complete
        ? `Charged and discharged. With ${resistance} kΩ and ${capacitance} µF the time constant RC is about ${timeConstant.toFixed(0)} s.`
        : switchPosition === "charge"
          ? `t = ${elapsed.toFixed(0)} s: the p.d. has reached ${capacitorVoltage.toFixed(2)} V and the current has fallen to ${Math.abs(capacitorCurrent).toFixed(2)} mA.`
          : switchPosition === "discharge"
            ? `Discharging: ${capacitorVoltage.toFixed(2)} V left, and the current flows the other way through the meter.`
            : "Move the two-way switch to the charging side and start the stopwatch at the same moment.";

  const observation =
    station === "friction"
      ? seen.electroscope
        ? "A charged electroscope keeps its leaf up. Bring a rod of the same sign near and the leaf rises further — that is the test for the sign of a charge."
        : "Rubbing only moves electrons. The rod and the cloth end up with equal and opposite charges."
      : chargeReadings.length
        ? "The current is largest at the very start and dies away; the p.d. rises quickly at first and then flattens off."
        : "At the instant of switching on, the capacitor is empty, so all the supply p.d. is across the resistor and I = V ÷ R.";

  const primaryLabel =
    station === "friction"
      ? complete
        ? "Start again"
        : !heldCharged
          ? `Rub with ${heldRod.cloth.split(" ")[0]}`
          : heldNear < 0.5
            ? "Bring it near"
            : "Take it away"
      : complete
        ? "Start again"
        : switchPosition === "off"
          ? "Switch to charge"
          : "Record I and V";

  const onPrimary = useCallback(() => {
    if (complete) {
      resetAll();
      return;
    }
    if (station === "friction") {
      if (!heldCharged) {
        rubRod();
        return;
      }
      if (heldNear < 0.5) {
        if (!suspendedCharged) hangCharged();
        bringNear();
        return;
      }
      takeAway();
      return;
    }
    if (switchPosition === "off") {
      startCharging();
      return;
    }
    recordCapacitorReading();
  }, [
    bringNear,
    complete,
    hangCharged,
    heldCharged,
    heldNear,
    recordCapacitorReading,
    resetAll,
    rubRod,
    startCharging,
    station,
    suspendedCharged,
    switchPosition,
    takeAway,
  ]);

  const stationPanel = (
    <div data-experiment-tour="static-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Station</span>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(["friction", "capacitor"] as Station[]).map((item) => (
          <button
            key={item}
            onClick={() => setStation(item)}
            disabled={demoActive}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              station === item
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item === "friction" ? "⚡ Static" : "🔋 Capacitor"}
          </button>
        ))}
      </div>

      {station === "friction" ? (
        <>
          <div className="mt-2.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Rod in your hand</div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {(Object.keys(RODS) as RodKind[]).map((kind) => (
              <button
                key={kind}
                onClick={() => {
                  setHeldKind(kind);
                  setHeldCharged(false);
                  setHeldNear(0);
                }}
                disabled={demoActive}
                className="rounded-xl px-2 py-1.5 text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
                style={
                  heldKind === kind
                    ? { background: ACCENT.soft, color: ACCENT.text, border: `1px solid ${ACCENT.ring}` }
                    : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {RODS[kind].name}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[9px] font-bold text-slate-400">
            Rub with the {heldRod.cloth} → the rod becomes {heldRod.sign > 0 ? "positive" : "negative"}.
          </p>

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={rubRod}
              disabled={demoActive}
              className="rounded-xl px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
              style={{ background: ACCENT.base }}
            >
              Rub the rod
            </button>
            <button
              onClick={hangCharged}
              disabled={demoActive || !heldCharged}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
            >
              Hang one in the stirrup
            </button>
            <button
              onClick={heldNear < 0.5 ? bringNear : takeAway}
              disabled={demoActive}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
            >
              {heldNear < 0.5 ? "Bring it near" : "Take it away"}
            </button>
            <button
              onClick={testPaper}
              disabled={demoActive || !heldCharged}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
            >
              Test on paper bits
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <button
              onClick={chargeByContact}
              disabled={demoActive || !heldCharged}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
            >
              Charge by contact
            </button>
            <button
              onClick={chargeByInduction}
              disabled={demoActive || !heldCharged || heldNear < 0.55}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
            >
              Charge by induction
            </button>
          </div>
          <button
            onClick={() => {
              setElectroscopeCharge(0);
              setEarthed(true);
              timers.current.push(window.setTimeout(() => setEarthed(false), 700));
            }}
            disabled={demoActive}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[9px] font-black uppercase tracking-wide text-slate-300 transition disabled:opacity-40"
          >
            Earth the electroscope (touch the cap)
          </button>
        </>
      ) : (
        <>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Capacitance</span>
            <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
              {capacitance} µF
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {CAPACITANCES.map((value) => (
              <button
                key={value}
                onClick={() => {
                  setCapacitance(value);
                  setSwitchPosition("off");
                  setCapacitorVoltage(0);
                  setChargeReadings([]);
                }}
                disabled={demoActive}
                className="rounded-lg px-1 py-1.5 text-[9px] font-black transition disabled:opacity-40"
                style={
                  capacitance === value
                    ? { background: ACCENT.base, color: "#0f172a" }
                    : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
                }
              >
                {value}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Resistance</span>
            <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
              {resistance} kΩ
            </span>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1">
            {RESISTANCES.map((value) => (
              <button
                key={value}
                onClick={() => {
                  setResistance(value);
                  setSwitchPosition("off");
                  setCapacitorVoltage(0);
                  setChargeReadings([]);
                }}
                disabled={demoActive}
                className="rounded-lg px-1 py-1.5 text-[9px] font-black transition disabled:opacity-40"
                style={
                  resistance === value
                    ? { background: ACCENT.base, color: "#0f172a" }
                    : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
                }
              >
                {value}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button
              onClick={startCharging}
              disabled={demoActive}
              className="rounded-xl px-1 py-2 text-[9px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
              style={{ background: ACCENT.base }}
            >
              Charge
            </button>
            <button
              onClick={startDischarging}
              disabled={demoActive}
              className="rounded-xl border border-white/10 bg-white/[0.06] px-1 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
            >
              Discharge
            </button>
            <button
              onClick={() => setSwitchPosition("off")}
              disabled={demoActive}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-1 py-2 text-[9px] font-black uppercase tracking-wide text-slate-300 transition disabled:opacity-40"
            >
              Off
            </button>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
              <div className="text-[8px] font-black uppercase text-slate-400">t</div>
              <div className="text-sm font-black text-white">{elapsed.toFixed(0)}</div>
              <div className="text-[7px] text-slate-500">seconds</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
              <div className="text-[8px] font-black uppercase text-slate-400">I</div>
              <div className="text-sm font-black text-white">{Math.abs(capacitorCurrent).toFixed(2)}</div>
              <div className="text-[7px] text-slate-500">mA</div>
            </div>
            <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
              <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
                V
              </div>
              <div className="text-sm font-black text-white">{capacitorVoltage.toFixed(2)}</div>
              <div className="text-[7px] text-slate-500">volts</div>
            </div>
          </div>
          <p className="mt-1.5 text-center text-[9px] font-bold text-slate-400">
            Time constant RC = {timeConstant.toFixed(0)} s · maximum current {maxCurrent.toFixed(2)} mA
          </p>
        </>
      )}
    </div>
  );

  const resultsPanel = (
    <div data-experiment-tour="static-results" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      {station === "friction" ? (
        <>
          <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Observations</span>
          <ul className="mt-2 space-y-1 text-[9px] font-bold">
            {[
              { key: "friction", text: "Rubbing charges the rod (it picks up paper)" },
              { key: "repel", text: "Like charges repel" },
              { key: "attract", text: "Unlike charges attract" },
              { key: "electroscope", text: "Charged electroscope keeps its leaf up" },
              { key: "induction", text: "Charging by induction gives the opposite charge" },
            ].map((item) => (
              <li key={item.key} className="flex items-start gap-1.5" style={{ color: seen[item.key] ? "#a7f3d0" : "#94a3b8" }}>
                <span>{seen[item.key] ? "✓" : "○"}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[9px] font-bold text-slate-300">
            <div className="text-[9px] font-black uppercase text-white">Leaf now</div>
            <p className="mt-1">
              {divergence < 0.08
                ? "The leaf hangs straight down — the electroscope is uncharged."
                : `The leaf is ${divergence > 0.6 ? "well up" : "part way up"}, so the electroscope carries ${electroscopeCharge > 0 ? "positive" : "negative"} charge.`}
            </p>
          </div>
        </>
      ) : (
        <ExperimentResultsGraph
          points={chargeReadings.map((reading) => ({ x: reading.time, y: reading.voltage }))}
          comparison={
            chargeReadings.length ? chargeReadings.map((reading) => ({ x: reading.time, y: reading.current })) : undefined
          }
          seriesLabel="p.d. across C / V"
          comparisonLabel="current / mA"
          xLabel="Time t / s"
          yLabel="p.d. / V and I / mA"
          accentHex={ACCENT.base}
          caption="Charging a capacitor through a resistor"
          yMax={Math.max(CAPACITOR_SUPPLY, maxCurrent) * 1.1}
          footer={<span>The p.d. rises towards {CAPACITOR_SUPPLY} V while the current falls away towards zero.</span>}
        />
      )}
    </div>
  );

  const notesPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Exam points</span>
      {station === "friction" ? (
        <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-300">
          <p>
            <span className="text-white">Only electrons move. </span>Never say protons were transferred — the nuclei stay put.
          </p>
          <p>
            <span className="text-white">Attraction proves nothing. </span>A charged rod attracts an uncharged conductor too, by induction. Repulsion is the only sure test that a body is charged.
          </p>
          <p>
            <span className="text-white">Insulators only. </span>The rods must be insulators, otherwise the charge would run away through your hand to earth.
          </p>
          <p>
            <span className="text-white">Dry day. </span>Damp air conducts the charge away, so the experiment fails when it is humid.
          </p>
        </div>
      ) : (
        <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-300">
          <p>
            <span className="text-white">At t = 0: </span>the capacitor is empty, all the supply p.d. is across R, so I is at its maximum, V ÷ R.
          </p>
          <p>
            <span className="text-white">Later: </span>as charge builds up, the p.d. across C rises, less is left across R, so the current falls.
          </p>
          <p>
            <span className="text-white">Fully charged: </span>the p.d. across C equals the supply and no current flows at all.
          </p>
          <p>
            <span className="text-white">Q = CV, </span>and the time constant RC decides how quickly it charges — a bigger R or C makes it slower.
          </p>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-2 py-1.5">
        <span className="text-[9px] font-black uppercase text-slate-400">Readings</span>
        <span className="text-[9px] font-black text-white">
          {station === "friction" ? `${frictionDone}/4 observations` : `${chargeReadings.length}/5 taken`}
        </span>
      </div>
      {station === "capacitor" && (
        <button
          onClick={recordCapacitorReading}
          disabled={switchPosition === "off" || demoActive}
          className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          Record I and V now
        </button>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title={station === "friction" ? "Electrostatics Bench" : "Capacitor Bench"}
          subtitle={station === "friction" ? "Charging by friction, and the electroscope" : "Current dies away as the p.d. builds up"}
          symbol="⚡"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to O Level Physics"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={complete ? 4 : step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="static-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.1, 2.75, 2.4], fov: 47, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <StaticScene
            station={station}
            suspendedRod={suspendedRod}
            suspendedCharged={suspendedCharged}
            deflection={deflection}
            heldRod={heldRod}
            heldCharged={heldCharged}
            heldNear={heldNear}
            divergence={divergence}
            earthed={earthed}
            paperLift={paperLift}
            capacitorCharge={capacitorVoltage / CAPACITOR_SUPPLY}
            capacitance={capacitance}
            resistance={resistance}
            current={capacitorCurrent}
            voltage={capacitorVoltage}
            switchPosition={switchPosition}
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
            emoji="⚡"
            cornerEmoji={station === "friction" ? "🧻" : "🔋"}
            status={status}
            running={demoActive || switchPosition !== "off"}
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
          title={station === "friction" ? "Static Electricity" : "Charging a Capacitor"}
          tagline={station === "friction" ? "Charging by friction, and the electroscope" : "Current dies away as the p.d. builds up"}
          missions={station === "friction" ? FRICTION_MISSIONS : CAPACITOR_MISSIONS}
          step={step}
          running={demoActive || switchPosition !== "off"}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : station === "friction" ? "🧻" : "⚡"}
          onPrimary={onPrimary}
          primaryDisabled={demoActive}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "station", label: station === "friction" ? "Rods" : "Circuit", content: stationPanel },
            {
            id: "results",
            label: station === "friction" ? "Seen" : "Graph",
            value: station === "friction" ? `${frictionDone}/4` : `${capacitorVoltage.toFixed(1)} V`,
            content: resultsPanel,
            },
            { id: "notes", label: "Notes", content: notesPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={
            station === "friction"
              ? [
                  { id: "rub", label: "Rub", onClick: rubRod, disabled: demoActive, tone: "orange" },
                  {
                    id: "near",
                    label: heldNear < 0.5 ? "Near" : "Away",
                    onClick: heldNear < 0.5 ? bringNear : takeAway,
                    disabled: demoActive,
                    tone: "blue",
                  },
                  { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
                ]
              : [
                  { id: "charge", label: "Charge", onClick: startCharging, disabled: demoActive, tone: "green" },
                  { id: "record", label: "Record", onClick: recordCapacitorReading, disabled: switchPosition === "off" || demoActive, tone: "orange" },
                  { id: "discharge", label: "Discharge", onClick: startDischarging, disabled: demoActive, tone: "red" },
                ]
          }
          panels={[
            { id: "station", label: station === "friction" ? "Rods" : "Circuit", content: stationPanel },
            {
              id: "results",
              label: station === "friction" ? "Seen" : "Graph",
              value: station === "friction" ? `${frictionDone}/4` : `${capacitorVoltage.toFixed(1)} V`,
              content: resultsPanel,
            },
            { id: "notes", label: "Notes", content: notesPanel },
          ]}
        />
      )}

      {showPaper && (
        <ElectrostaticsPaper
          chargeReadings={chargeReadings}
          capacitance={capacitance}
          resistance={resistance}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={electrostaticsTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
