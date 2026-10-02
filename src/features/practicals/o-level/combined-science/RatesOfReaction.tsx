"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";

import { useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import {
  CombinedScienceGoalCard,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface RatesSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.rose;

type SurfaceId = "large" | "small" | "powder";
type TempId = "cold" | "room" | "warm";
type ConcId = "dilute" | "conc";

const SURFACE_OPTIONS: { id: SurfaceId; label: string; factor: number; note: string }[] = [
  { id: "large", label: "Large chips", factor: 1.0, note: "Small surface area" },
  { id: "small", label: "Small chips", factor: 1.65, note: "More surface area" },
  { id: "powder", label: "Powder", factor: 2.8, note: "Largest surface area" },
];
const TEMP_OPTIONS: { id: TempId; label: string; celsius: number; factor: number }[] = [
  { id: "cold", label: "10 °C", celsius: 10, factor: 0.55 },
  { id: "room", label: "25 °C", celsius: 25, factor: 1.0 },
  { id: "warm", label: "40 °C", celsius: 40, factor: 1.95 },
];
const CONC_OPTIONS: { id: ConcId; label: "1.0 M" | "2.0 M"; molar: number; factor: number }[] = [
  { id: "dilute", label: "1.0 M", molar: 1, factor: 1.0 },
  { id: "conc", label: "2.0 M", molar: 2, factor: 1.95 },
];

const V_MAX = 78; // cm³ of CO₂ — marble is the limiting reagent, so the final volume is fixed
const SYRINGE_CAPACITY = 100; // cm³
const BASE_K = 0.045; // baseline rate constant (per modelled reaction-second)
const REACTION_SECONDS = 90; // x-axis span of the rate graph
const RUN_DURATION_MS = 7400; // wall-clock length of one animated run
const RATES_PAPER_FILENAME = "rates-of-reaction-marble-acid.html";

const RATES_MISSIONS: GameMission[] = [
  { short: "Baseline", title: "Baseline run", detail: "Large chips, room temperature, dilute acid — measure the reference rate.", symbol: "⚗️" },
  { short: "Surface", title: "Surface area", detail: "Powder the marble and compare — more surface area, faster reaction.", symbol: "🧂" },
  { short: "Temp", title: "Temperature", detail: "Warm the acid to 40 °C — higher temperature speeds particles up.", symbol: "🔥" },
  { short: "Conc.", title: "Concentration", detail: "Use 2.0 M acid — more particles per volume collide more often.", symbol: "💧" },
];

const ratesTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Rate of Reaction",
    text: "Marble chips (calcium carbonate) react with hydrochloric acid to give calcium chloride, water and carbon dioxide gas. You will measure how fast the gas is produced.",
    mode: "modal",
  },
  {
    title: "Change one factor",
    text: "Pick the surface area of the marble, the temperature of the acid and the acid concentration. Change one factor at a time to keep it a fair test.",
    mode: "bubble",
    selector: '[data-experiment-tour="rates-factors"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Start the reaction",
    text: "The gas syringe fills as carbon dioxide is made. A steeper graph means a faster reaction.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Read the rate",
    text: "The initial rate is the gradient of the curve at the start. Faster runs reach the same final volume sooner.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

const configKey = (surface: SurfaceId, temp: TempId, conc: ConcId) => `${surface}-${temp}-${conc}`;

function rateConstant(surface: SurfaceId, temp: TempId, conc: ConcId) {
  const s = SURFACE_OPTIONS.find((o) => o.id === surface)!.factor;
  const t = TEMP_OPTIONS.find((o) => o.id === temp)!.factor;
  const c = CONC_OPTIONS.find((o) => o.id === conc)!.factor;
  return BASE_K * s * t * c;
}
const volumeAt = (k: number, tau: number) => V_MAX * (1 - Math.exp(-k * tau));
const initialRate = (k: number) => V_MAX * k; // cm³/s (gradient at t = 0)

interface RunRecord {
  id: string;
  surface: SurfaceId;
  temp: TempId;
  conc: ConcId;
  surfaceLabel: string;
  tempLabel: string;
  concLabel: string;
  rate: number;
}

const DEMO_SEQUENCE: { surface: SurfaceId; temp: TempId; conc: ConcId }[] = [
  { surface: "large", temp: "room", conc: "dilute" },
  { surface: "powder", temp: "room", conc: "dilute" },
  { surface: "large", temp: "warm", conc: "dilute" },
  { surface: "large", temp: "room", conc: "conc" },
];

/* ------------------------------------------------------------------ 3D bits */

function Bubbles({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: 22 }, () => ({
        x: (Math.random() - 0.5) * 0.34,
        z: (Math.random() - 0.5) * 0.34,
        phase: Math.random(),
        speed: 0.5 + Math.random() * 0.7,
        scale: 0.02 + Math.random() * 0.03,
      })),
    [],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((child, index) => {
      const seed = seeds[index];
      seed.phase += delta * seed.speed * (0.25 + intensity);
      if (seed.phase > 1) seed.phase -= 1;
      child.position.set(seed.x, 0.02 + seed.phase * 0.28, seed.z);
      const visible = intensity > 0.02;
      child.visible = visible;
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = visible ? (1 - seed.phase) * 0.6 : 0;
    });
  });

  return (
    <group ref={groupRef}>
      {seeds.map((seed, index) => (
        <mesh key={index} scale={seed.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#eaf6ff" transparent opacity={0.5} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function MarbleContents({ surface }: { surface: SurfaceId }) {
  if (surface === "powder") {
    return (
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.34, 0.36, 0.07, 24]} />
        <meshStandardMaterial color="#e8e4d8" roughness={0.95} />
      </mesh>
    );
  }
  const count = surface === "small" ? 14 : 6;
  const size = surface === "small" ? 0.075 : 0.13;
  const chips = Array.from({ length: count }, (_, index) => {
    const angle = index * 2.399;
    const radius = 0.05 + (index / count) * 0.28;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      y: 0.04 + (index % 3) * 0.02,
      rot: angle,
    };
  });
  return (
    <group>
      {chips.map((chip, index) => (
        <mesh key={index} position={[chip.x, chip.y, chip.z]} rotation={[chip.rot, chip.rot * 0.6, 0]} castShadow>
          <dodecahedronGeometry args={[size, 0]} />
          <meshStandardMaterial color="#ece7db" roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function ConicalFlask({ surface, intensity }: { surface: SurfaceId; intensity: number }) {
  return (
    <group>
      {/* Glass cone */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.5, 0.84, 40, 1, true]} />
        <meshPhysicalMaterial
          color="#cfeaf2"
          transparent
          opacity={0.26}
          transmission={0.7}
          roughness={0.08}
          thickness={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.14, 0.16, 0.28, 32, 1, true]} />
        <meshPhysicalMaterial color="#cfeaf2" transparent opacity={0.28} transmission={0.7} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Base disc */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.04, 40]} />
        <meshPhysicalMaterial color="#cfeaf2" transparent opacity={0.3} transmission={0.6} roughness={0.1} />
      </mesh>
      {/* Acid */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.3, 0.46, 0.42, 40]} />
        <meshStandardMaterial color="#e6f4f8" transparent opacity={0.55} roughness={0.25} />
      </mesh>
      <MarbleContents surface={surface} />
      <group position={[0, 0.12, 0]}>
        <Bubbles intensity={intensity} />
      </group>
      {/* Rubber bung */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.145, 0.12, 24]} />
        <meshStandardMaterial color="#2b2019" roughness={0.7} />
      </mesh>
    </group>
  );
}

function Hotplate({ temp }: { temp: TempId }) {
  const warm = temp === "warm";
  const cold = temp === "cold";
  return (
    <group position={[0, -0.02, 0]}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.62, 0.66, 0.1, 40]} />
        <meshStandardMaterial color="#1c232b" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.02, 40]} />
        <meshStandardMaterial
          color="#3a4149"
          emissive="#000000"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.5, 0.14, 0.4]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
        <meshStandardMaterial color={warm ? "#ef4444" : cold ? "#38bdf8" : "#64748b"} metalness={0.5} />
      </mesh>

      {cold &&
        [
          [-0.16, 0.16],
          [0.18, -0.1],
          [0.02, 0.2],
        ].map(([x, z], index) => (
          <mesh key={index} position={[x, 0.16, z]} rotation={[0.3, index, 0.2]}>
            <boxGeometry args={[0.09, 0.09, 0.09]} />
            <meshPhysicalMaterial color="#dbf3ff" transparent opacity={0.7} transmission={0.6} roughness={0.1} />
          </mesh>
        ))}
    </group>
  );
}

function GasSyringe({ fill }: { fill: number }) {
  const travel = 0.9;
  const plungerX = -0.55 + fill * travel;
  return (
    <group position={[1.45, BENCH_TOP_Y + 0.92, 0.2]} rotation={[0, 0, 0]}>
      {/* Barrel */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 1.25, 32, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.32} transmission={0.7} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Graduations */}
      {Array.from({ length: 9 }, (_, index) => -0.55 + index * 0.135).map((x) => (
        <mesh key={x} position={[x, 0.16, 0]}>
          <boxGeometry args={[0.004, 0.05, 0.02]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
      {/* Nozzle */}
      <mesh position={[-0.68, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.05, 0.2, 16]} />
        <meshStandardMaterial color="#cbd5e1" transparent opacity={0.5} />
      </mesh>
      {/* Plunger */}
      <group position={[plungerX, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 24]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
          <meshStandardMaterial color="#1f2937" metalness={0.3} />
        </mesh>
        <mesh position={[0.62, 0, 0]}>
          <boxGeometry args={[0.05, 0.24, 0.24]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    </group>
  );
}

function RetortStand() {
  return (
    <group position={[1.45, BENCH_TOP_Y, 0.62]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[0.7, 0.05, 0.5]} />
        <meshStandardMaterial color="#3b444d" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[-0.28, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.7, 16]} />
        <meshStandardMaterial color="#9aa4ad" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[-0.02, 0.92, -0.42]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.55, 12]} />
        <meshStandardMaterial color="#9aa4ad" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
}

function DeliveryTube() {
  const points = useMemo<[number, number, number][]>(
    () => [
      [0, BENCH_TOP_Y + 1.28, 0.2],
      [0, BENCH_TOP_Y + 1.42, 0.2],
      [0.75, BENCH_TOP_Y + 1.42, 0.2],
      [0.78, BENCH_TOP_Y + 0.92, 0.2],
      [0.77, BENCH_TOP_Y + 0.92, 0.2],
    ],
    [],
  );
  return <Line points={points} color="#1f2937" lineWidth={5} />;
}

function RatesScene({
  surface,
  temp,
  intensity,
  fill,
  volume,
  rate,
  running,
  mode,
  isMobile,
  moveVectorRef,
}: {
  surface: SurfaceId;
  temp: TempId;
  intensity: number;
  fill: number;
  volume: number;
  rate: number;
  running: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {


  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#b91c1c"
        benchColor="#eef2f4"
        posterA={{
          title: "RATE FACTORS",
          lines: [
            "Larger surface area speeds up the reaction",
            "Higher temperature speeds up the reaction",
            "Higher concentration speeds up the reaction",
            "A catalyst speeds it up unchanged",
          ],
        }}
        posterB={{
          title: "SAFETY",
          lines: ["Wear goggles with acids", "Point the flask away from you", "Wipe up acid spills at once"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0.2]}>
          <Hotplate temp={temp} />
          <group position={[0, 0.1, 0]}><ConicalFlask surface={surface} intensity={intensity} /></group>
        </group>
        <RetortStand />
        <GasSyringe fill={fill} />
        <DeliveryTube />
        <LabTag position={[1.45, BENCH_TOP_Y + 1.35, 0.2]} tone="rose" distanceFactor={7}>
          {volume.toFixed(0)} cm³ CO₂
        </LabTag>
        <LabTag position={[0, BENCH_TOP_Y + 1.72, 0.2]} tone={running ? "amber" : "slate"} distanceFactor={7}>
          Rate {rate.toFixed(1)} cm³/s
        </LabTag>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.34} scale={7} blur={2.4} far={3} frames={1} />
      <ObservationCamera focus={[0.45 + fill * 0.6, BENCH_TOP_Y + 0.85, 0.2]} guided={mode === "doing"} isMobile={isMobile} />
    </>
  );
}

/* ---------------------------------------------------------------- Rate graph */

function RateGraph({
  activeK,
  progress,
  records,
  compact = false,
}: {
  activeK: number;
  progress: number;
  records: RunRecord[];
  compact?: boolean;
}) {
  const width = compact ? 240 : 260;
  const height = compact ? 120 : 140;
  const padL = 30;
  const padB = 20;
  const plotW = width - padL - 8;
  const plotH = height - padB - 10;

  const curvePoints = (k: number, upToTau: number) => {
    const samples = 44;
    return Array.from({ length: samples + 1 }, (_, index) => {
      const tau = (index / samples) * upToTau;
      const v = volumeAt(k, tau);
      const x = padL + (tau / REACTION_SECONDS) * plotW;
      const y = 10 + plotH - (v / V_MAX) * plotH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <rect x={padL} y={10} width={plotW} height={plotH} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padL} y1={10 + plotH * f} x2={padL + plotW} y2={10 + plotH * f} stroke="rgba(255,255,255,0.07)" />
      ))}
      <text x={4} y={16} fill="#94a3b8" fontSize="8" fontWeight="700">
        cm³
      </text>
      <text x={padL + plotW - 22} y={height - 6} fill="#94a3b8" fontSize="8" fontWeight="700">
        time
      </text>
      {records.slice(-3).map((record) => (
        <polyline
          key={record.id}
          points={curvePoints(rateConstant(record.surface, record.temp, record.conc), REACTION_SECONDS)}
          fill="none"
          stroke="rgba(148,163,184,0.5)"
          strokeWidth={1.4}
          strokeDasharray="3 3"
        />
      ))}
      <polyline
        points={curvePoints(activeK, Math.max(0.001, progress) * REACTION_SECONDS)}
        fill="none"
        stroke={ACCENT.base}
        strokeWidth={2.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function RatesPaper({ records, onClose }: { records: RunRecord[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={RATES_PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">The Rate of Reaction of Marble with Hydrochloric Acid</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To investigate how surface area, temperature and concentration affect the rate of reaction between marble chips (calcium carbonate) and hydrochloric acid.</p>
        <h2 className="mt-5 font-bold uppercase">Word and symbol equation</h2>
        <p>calcium carbonate + hydrochloric acid &rarr; calcium chloride + water + carbon dioxide</p>
        <p>CaCO₃(s) + 2HCl(aq) &rarr; CaCl₂(aq) + H₂O(l) + CO₂(g)</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Conical flask, marble chips, hydrochloric acid, delivery tube, gas syringe, stop-clock, thermometer and water bath.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A known mass of marble was placed in the flask and acid was added.</li>
          <li>The bung and gas syringe were fitted and the stop-clock started at once.</li>
          <li>The volume of carbon dioxide collected was recorded and the initial rate found from the gradient.</li>
          <li>One factor at a time (surface area, temperature, then concentration) was changed and the run repeated.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {records.length > 0 ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Surface area</th>
                <th className="border border-slate-400 p-2">Temperature</th>
                <th className="border border-slate-400 p-2">Concentration</th>
                <th className="border border-slate-400 p-2">Initial rate / cm³ s⁻¹</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="border border-slate-400 p-2">{record.surfaceLabel}</td>
                  <td className="border border-slate-400 p-2 text-center">{record.tempLabel}</td>
                  <td className="border border-slate-400 p-2 text-center">{record.concLabel}</td>
                  <td className="border border-slate-400 p-2 text-center">{record.rate.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No runs have been recorded yet. Start a reaction to record the initial rate.</p>
        )}
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The rate of reaction increases when the surface area of the marble is increased (powder is fastest), when the
          temperature is raised and when the acid is more concentrated. In every case the same total volume of carbon
          dioxide is produced because the same mass of marble is used; only the speed changes. This is explained by
          collision theory: faster rates come from more frequent and more energetic collisions between reacting particles.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function RatesOfReactionSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: RatesSimProps) {
  const [surface, setSurface] = useState<SurfaceId>("large");
  const [temp, setTemp] = useState<TempId>("room");
  const [conc, setConc] = useState<ConcId>("dilute");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [finishedRuns, setFinishedRuns] = useState(0);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [mobilePanelClose, setMobilePanelClose] = useState(0);

  const startRef = useRef(0);
  const demoIndexRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const k = useMemo(() => rateConstant(surface, temp, conc), [surface, temp, conc]);
  const tau = progress * REACTION_SECONDS;
  const volume = running || progress > 0 ? volumeAt(k, tau) : 0;
  const rate = running ? V_MAX * k * Math.exp(-k * tau) : progress > 0 ? 0 : initialRate(k);
  const intensity = running ? THREE.MathUtils.clamp((rate / 12) * 0.9, 0, 1.4) : 0;
  const fill = THREE.MathUtils.clamp(volume / SYRINGE_CAPACITY, 0, 1);
  const step = Math.min(finishedRuns, RATES_MISSIONS.length);
  const complete = finishedRuns >= RATES_MISSIONS.length;

  const recordRun = useCallback(
    (s: SurfaceId, t: TempId, c: ConcId) => {
      const id = configKey(s, t, c);
      const record: RunRecord = {
        id,
        surface: s,
        temp: t,
        conc: c,
        surfaceLabel: SURFACE_OPTIONS.find((o) => o.id === s)!.label,
        tempLabel: TEMP_OPTIONS.find((o) => o.id === t)!.label,
        concLabel: CONC_OPTIONS.find((o) => o.id === c)!.label,
        rate: initialRate(rateConstant(s, t, c)),
      };
      setRecords((current) => [...current.filter((entry) => entry.id !== id), record]);
    },
    [],
  );

  // Drive the animated run.
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      setProgress(next);
      if (next >= 1) {
        setRunning(false);
        setProgress(1);
        recordRun(surface, temp, conc);
        setFinishedRuns((current) => Math.min(current + 1, RATES_MISSIONS.length));
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => { window.cancelAnimationFrame(frame); labSounds.stop("bubbleRelease"); };
  }, [running, surface, temp, conc, recordRun]);

  const startRun = useCallback(() => {
    labSounds.loop("bubbleRelease", { volume: 0.25 });
    if (running) return;
    setProgress(0);
    startRef.current = performance.now();
    setRunning(true);
  }, [running]);

  const resetFlask = useCallback(() => {
    setRunning(false);
    setProgress(0);
  }, []);

  const resetAll = useCallback(() => {
    setDemoActive(false);
    setMode("learning");
    setRunning(false);
    setProgress(0);
    setRecords([]);
    setFinishedRuns(0);
    setSurface("large");
    setTemp("room");
    setConc("dilute");
  }, []);

  // Guided demo: run through the four scripted comparisons.
  const startDemo = useCallback(() => {
    setShowTutorial(false);
    setMode("doing");
    setDemoActive(true);
    demoIndexRef.current = 0;
    setRecords([]);
    setFinishedRuns(0);
    const first = DEMO_SEQUENCE[0];
    setSurface(first.surface);
    setTemp(first.temp);
    setConc(first.conc);
    setProgress(0);
    startRef.current = performance.now();
    setRunning(true);
  }, []);

  const stopDemo = useCallback(() => {
    setMode("learning");
    setDemoActive(false);
    setMode("learning");
    setRunning(false);
    setProgress(0);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) stopDemo();
    else startDemo();
  }, [demoActive, startDemo, stopDemo]);

  // Advance the demo when a run finishes.
  useEffect(() => {
    if (!demoActive || running) return;
    const nextIndex = demoIndexRef.current + 1;
    if (nextIndex >= DEMO_SEQUENCE.length) {
      const timer = window.setTimeout(() => (setDemoActive(false), setMode("learning")), 900);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      demoIndexRef.current = nextIndex;
      const config = DEMO_SEQUENCE[nextIndex];
      setSurface(config.surface);
      setTemp(config.temp);
      setConc(config.conc);
      setProgress(0);
      startRef.current = performance.now();
      setRunning(true);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [demoActive, running]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? "All four factors investigated — surface area, temperature and concentration each raise the rate."
    : running
      ? `Reacting · ${SURFACE_OPTIONS.find((o) => o.id === surface)!.label.toLowerCase()} at ${TEMP_OPTIONS.find((o) => o.id === temp)!.label} · ${CONC_OPTIONS.find((o) => o.id === conc)!.label} acid`
      : progress > 0
        ? `Reaction complete · initial rate ${initialRate(k).toFixed(1)} cm³/s`
        : "Choose a factor to change, then start the reaction and read the initial rate.";

  const observation =
    records.length >= 2
      ? "Steeper graph = faster rate. The same volume of gas is made each time; only the speed changes."
      : "The gas syringe fills as carbon dioxide forms. A steeper curve means a faster reaction.";

  const surfaceButtons = (
    <div className="grid grid-cols-3 gap-1.5">
      {SURFACE_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setSurface(option.id)}
          disabled={running}
          className={`rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-50 ${
            surface === option.id ? "text-slate-950" : "bg-white/8 text-slate-300"
          }`}
          style={surface === option.id ? { background: ACCENT.base } : undefined}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
  const tempButtons = (
    <div className="grid grid-cols-3 gap-1.5">
      {TEMP_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setTemp(option.id)}
          disabled={running}
          className={`rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-50 ${
            temp === option.id ? "bg-amber-400 text-slate-950" : "bg-white/8 text-slate-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
  const concButtons = (
    <div className="grid grid-cols-2 gap-1.5">
      {CONC_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setConc(option.id)}
          disabled={running}
          className={`rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-50 ${
            conc === option.id ? "bg-cyan-400 text-slate-950" : "bg-white/8 text-slate-300"
          }`}
        >
          {option.label} HCl
        </button>
      ))}
    </div>
  );

  const factorPanel = (
    <div data-experiment-tour="rates-factors" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Surface area</div>
        {surfaceButtons}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Temperature</div>
        {tempButtons}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Acid concentration</div>
        {concButtons}
      </div>
    </div>
  );

  const graphPanel = (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Gas volume vs time</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {volume.toFixed(0)} cm³
        </span>
      </div>
      <RateGraph activeK={k} progress={progress} records={records} />
    </div>
  );


return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white">
      {(
        <CombinedScienceHud
          title="Rate of Reaction Lab"
          subtitle="CaCO₃ + HCl → CO₂"
          symbol="⚗️"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={finishedRuns}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="rates-scene" className="relative min-h-0 min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [5.4, 3.72, 6.6], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <RatesScene
            surface={surface}
            temp={temp}
            intensity={intensity}
            fill={fill}
            volume={volume}
            rate={rate}
            running={running}
            mode={mode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
          />
        </Canvas>




        {mode === "learning" && (
          <CombinedScienceGoalCard
            accent={ACCENT}
            emoji="⚗️"
            cornerEmoji="🫧"
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

      </div>

      {!isMobileViewport && (
        <div className="absolute bottom-5 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4"><div className="rounded-2xl border border-white/70 bg-white/95 p-4 text-slate-900 shadow-[0_18px_55px_rgba(15,23,42,.28)]"><p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-600">Rate of reaction</p><h2 className="mt-1 text-sm font-bold">{complete ? "Experiment complete" : RATES_MISSIONS[Math.min(step, RATES_MISSIONS.length - 1)].title}</h2><p className="mt-1 text-[11px] text-slate-500">{status}</p><button type="button" onClick={running ? resetFlask : startRun} className="mt-3 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">{running ? "Stop reaction" : complete ? "Run again" : "Start reaction"}</button></div></div>
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          panelCloseRequestKey={mobilePanelClose}
          actions={[
            {
              id: "start",
              label: running ? "Reacting" : "Start",
              onClick: startRun,
              disabled: running,
              tone: "green",
            },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "surface", label: "Surface", value: SURFACE_OPTIONS.find((o) => o.id === surface)!.label, content: surfaceButtons },
            { id: "temp", label: "Temp", value: TEMP_OPTIONS.find((o) => o.id === temp)!.label, content: tempButtons },
            { id: "conc", label: "Acid", value: CONC_OPTIONS.find((o) => o.id === conc)!.label, content: concButtons },
            { id: "graph", label: "Graph", value: `${volume.toFixed(0)} cm³`, content: graphPanel },
          ]}
        />
      )}

      {!isMobileViewport && mode === "learning" && <aside className="absolute right-4 top-20 z-30 max-h-[55%] w-64 overflow-y-auto rounded-2xl bg-slate-950/90 p-3 text-white shadow-xl"><details className="border-b border-white/10 py-2"><summary className="cursor-pointer text-xs font-bold">Marble</summary><div className="mt-2">{surfaceButtons}</div></details><details className="border-b border-white/10 py-2"><summary className="cursor-pointer text-xs font-bold">Temperature</summary><div className="mt-2">{tempButtons}</div></details><details className="border-b border-white/10 py-2"><summary className="cursor-pointer text-xs font-bold">Acid</summary><div className="mt-2">{concButtons}</div></details><details className="border-b border-white/10 py-2"><summary className="cursor-pointer text-xs font-bold">Gas volume</summary><div className="mt-2">{graphPanel}</div></details><button onClick={resetAll} className="mt-3 w-full rounded-lg bg-white/10 py-2 text-xs font-bold">Reset experiment</button></aside>}
      {showPaper && <RatesPaper records={records} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? ratesTutorialSteps : ratesTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}

// This practical owns its room, lighting and observation camera.
const BENCH_TOP_Y = 1.36;
function LabLighting() {
  return <><ambientLight intensity={0.65} /><hemisphereLight args={["#eaf4ff", "#827464", 1.2]} /><directionalLight castShadow position={[-3, 7, 4]} intensity={2.1} shadow-mapSize={[2048, 2048]} shadow-camera-left={-7} shadow-camera-right={7} shadow-camera-top={7} shadow-camera-bottom={-7} /><pointLight position={[3, 4, -2]} intensity={16} /></>;
}
function LabRoom({ children, posterA, posterB }: { children: ReactNode; accentHex?: string; benchColor?: string; posterA: { title: string; lines: string[] }; posterB: { title: string; lines: string[] } }) {
  return <group>
    <color attach="background" args={["#e9e1d5"]} />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16, 14]} /><meshStandardMaterial color="#b6b0a5" roughness={0.92} /></mesh>
    <mesh position={[0, 3, -3.8]} receiveShadow><boxGeometry args={[16, 6, 0.15]} /><meshStandardMaterial color="#e9e1d5" roughness={0.85} /></mesh>
    <mesh position={[-6, 3, 0]}><boxGeometry args={[0.15, 6, 8]} /><meshStandardMaterial color="#e9e1d5" /></mesh>
    <mesh position={[0, BENCH_TOP_Y - 0.07, 0]} castShadow receiveShadow><boxGeometry args={[7.2, 0.14, 3.6]} /><meshStandardMaterial color="#384944" roughness={0.36} metalness={0.15} /></mesh>
    {[-2.8, 2.8].map(x => <group key={x} position={[x, 0.62, 0]}><mesh castShadow><boxGeometry args={[1.25, 1.24, 3.1]} /><meshStandardMaterial color="#b65c46" roughness={0.5} /></mesh>{[0.35, 0.75, 1.05].map(y => <mesh key={y} position={[0, y - 0.62, 1.57]}><boxGeometry args={[0.55, 0.025, 0.045]} /><meshStandardMaterial color="#aab4ba" metalness={0.85} roughness={0.25} /></mesh>)}</group>)}
    <mesh position={[-3.5, 3.2, -3.68]}><boxGeometry args={[3.3, 2.1, 0.08]} /><meshStandardMaterial color="#d7f1ff" emissive="#cde9fa" emissiveIntensity={0.35} roughness={0.15} /></mesh>
    {[-4.55, -3.5, -2.45].map(x => <mesh key={x} position={[x, 3.2, -3.59]}><boxGeometry args={[0.045, 2.12, 0.04]} /><meshStandardMaterial color="#f8fafc" /></mesh>)}
    {[posterA, posterB].map((poster, i) => <Html key={poster.title} position={[i ? 3.5 : 0.3, 3.2, -3.65]} transform distanceFactor={5}><div style={{width: 210, background: '#faf9f5', borderTop: '8px solid #b65c46', padding: 16, color: '#26343d', fontSize: 12}}><strong>{poster.title}</strong>{poster.lines.map(line => <p key={line} style={{marginTop: 9}}>{line}</p>)}</div></Html>)}
<group position={[-2.8, BENCH_TOP_Y, -0.9]}><mesh position={[0,0.04,0]}><boxGeometry args={[0.9,0.08,0.7]}/><meshStandardMaterial color="#d8d6cb" roughness={0.7}/></mesh>{[-0.22,0,0.22].map(x => <mesh key={x} position={[x,0.26,0]}><cylinderGeometry args={[0.065,0.08,0.4,24]}/><meshStandardMaterial color="#87603b" roughness={0.35}/></mesh>)}</group>
    {children}
  </group>;
}
function LabTag({ children, position, distanceFactor = 7 }: { children: ReactNode; position: [number, number, number]; tone?: string; distanceFactor?: number }) {
 return <Html position={position} center distanceFactor={distanceFactor} style={{pointerEvents: 'none'}}><div className="whitespace-nowrap rounded-lg border border-slate-200 bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow">{children}</div></Html>;
}
function ObservationCamera({ focus, guided, isMobile }: { focus: [number, number, number]; guided: boolean; isMobile: boolean }) {
 const { camera, size } = useThree();
 const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
 const destination = useRef(new THREE.Vector3());
 const target = useRef(new THREE.Vector3(0, BENCH_TOP_Y + 0.6, 0));
 const returning = useRef(true);
 useEffect(() => { returning.current = true; }, [guided, isMobile, size.width, size.height]);
 useFrame((_, dt) => {
  if (!controls.current || (!guided && !returning.current)) return;
  const blend = 1 - Math.exp(-4 * Math.min(dt, 0.1));
  destination.current.set(...(guided ? focus : [0.35, BENCH_TOP_Y + 0.55, 0] as [number, number, number]));
  // Look below the apparatus to keep it above the procedure dock.
  destination.current.y -= 0.25;
  target.current.lerp(destination.current, blend);
  controls.current.target.copy(target.current);
  const aspect = size.width / Math.max(size.height, 1);
  const distance = (guided ? 3.6 : 5.1) * Math.max(1, 1.15 / aspect);
  destination.current.copy(target.current).add(new THREE.Vector3(distance * 0.38, distance * 0.48, distance));
  camera.position.lerp(destination.current, blend);
  if (!guided && camera.position.distanceTo(destination.current) < 0.02) returning.current = false;
  controls.current.update();
 });
 return <OrbitControls ref={controls} makeDefault enabled={!guided} onStart={() => { returning.current = false; }} enableDamping enablePan={false} minDistance={1.5} maxDistance={14} maxPolarAngle={1.48} />;
}
function CombinedScienceHud({ title, onBack, onRequestPaper, onRequestHowTo, demoActive, onDemo, onModeChange }: { title: string; subtitle?: string; symbol?: string; accent?: unknown; mode: string; modeDisabled?: boolean; badges?: number; onBack?: () => void; onRequestPaper?: () => void; onRequestHowTo?: () => void; demoActive: boolean; onDemo: () => void; onModeChange: (mode: "learning" | "doing") => void }) {
 return <div className="relative z-[80] flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 text-slate-900">
 <button onClick={onBack} aria-label="Back to experiments" className="rounded-lg px-3 py-2">←</button><h1 className="min-w-0 flex-1 text-sm font-bold">{title}</h1>
 <div className="flex rounded-xl bg-slate-100 p-1"><button aria-pressed={demoActive} onClick={() => { if (!demoActive) onDemo(); }} className={`rounded-lg px-4 py-2 text-xs font-bold ${demoActive ? 'bg-sky-500 text-white' : ''}`}>See</button><button aria-pressed={!demoActive} onClick={() => { if (demoActive) onDemo(); onModeChange("learning"); }} className={`rounded-lg px-4 py-2 text-xs font-bold ${!demoActive ? 'bg-emerald-500 text-white' : ''}`}>Learn</button></div>
 <button onClick={onRequestHowTo} className="px-2 text-xs">Guide</button><button onClick={onRequestPaper} className="px-2 text-xs">Paper</button></div>;
}
