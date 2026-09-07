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

interface CatalaseSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.teal;
const PAPER_FILENAME = "catalase-and-hydrogen-peroxide.html";

/* ------------------------------------------------------------------ Science */

interface Tissue {
  id: string;
  label: string;
  short: string;
  /** Relative catalase activity — liver is the richest source. */
  activity: number;
  colour: string;
  note: string;
}

/**
 * Catalase breaks hydrogen peroxide down into water and oxygen:
 *   2H₂O₂ → 2H₂O + O₂
 * Liver contains far more catalase than plant storage tissue, and boiling
 * denatures the enzyme so no oxygen is released at all.
 */
const TISSUES: Tissue[] = [
  {
    id: "liver",
    label: "Fresh liver",
    short: "Liver",
    activity: 1,
    colour: "#7f2534",
    note: "Liver cells are packed with catalase because the liver breaks down toxins. Vigorous frothing.",
  },
  {
    id: "potato",
    label: "Fresh potato",
    short: "Potato",
    activity: 0.45,
    colour: "#e8d9a8",
    note: "Potato tissue contains catalase, but less per gram than liver, so oxygen is released more slowly.",
  },
  {
    id: "celery",
    label: "Fresh celery",
    short: "Celery",
    activity: 0.3,
    colour: "#9fc46a",
    note: "Celery has the least catalase of the three tissues, so the slowest rate.",
  },
  {
    id: "boiled",
    label: "Boiled liver",
    short: "Boiled",
    activity: 0,
    colour: "#a08076",
    note: "CONTROL. Boiling denatures catalase — the active site loses its shape, so no oxygen is produced.",
  },
  {
    id: "none",
    label: "No tissue",
    short: "None",
    activity: 0,
    colour: "#cbd5e1",
    note: "CONTROL. Hydrogen peroxide alone decomposes far too slowly to measure, proving the gas comes from enzyme action.",
  },
];

/** Hydrogen peroxide concentrations, and the oxygen each finally yields. */
const CONCENTRATIONS = [
  { percent: 2, maxVolume: 12 },
  { percent: 4, maxVolume: 24 },
  { percent: 6, maxVolume: 36 },
  { percent: 8, maxVolume: 48 },
];

const SYRINGE_CAPACITY = 60; // cm³
const MAX_TIME_S = 120;
const READING_INTERVAL_S = 10;
/** Simulated seconds per real second — a full run takes about 15 s to watch. */
const TIME_SCALE = 8;
/** First-order rate constant at full catalase activity (per simulated second). */
const BASE_K = 0.02;

/**
 * Oxygen collected after t seconds. The reaction is first-order in the
 * remaining hydrogen peroxide, so the volume rises steeply then levels off as
 * the substrate is used up.
 */
function volumeAt(t: number, activity: number, maxVolume: number): number {
  if (activity <= 0) return 0;
  const k = BASE_K * activity;
  return Math.min(SYRINGE_CAPACITY, maxVolume * (1 - Math.exp(-k * t)));
}

/** Initial rate in cm³/s, taken over the first 10 s as students are taught. */
function initialRate(activity: number, maxVolume: number): number {
  return volumeAt(READING_INTERVAL_S, activity, maxVolume) / READING_INTERVAL_S;
}

const MISSIONS: GameMission[] = [
  { short: "Set up", title: "Assemble the apparatus", detail: "Put the tissue in the conical flask, fit the bung and connect the delivery tube to the gas syringe.", symbol: "🧪" },
  { short: "Start", title: "Add hydrogen peroxide", detail: "Tip in the hydrogen peroxide, replace the bung at once and start the stop-clock.", symbol: "⏱️" },
  { short: "Record", title: "Read the syringe", detail: "Record the volume of oxygen every 10 seconds until the plunger stops moving.", symbol: "📏" },
  { short: "Compare", title: "Compare and conclude", detail: "Work out the initial rate for each tissue, and check the boiled control produced nothing.", symbol: "📈" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Catalase and hydrogen peroxide",
    text: "Hydrogen peroxide is a poisonous waste product of respiration. The enzyme catalase breaks it down: 2H₂O₂ → 2H₂O + O₂. You will measure how fast the oxygen is released.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "The tissue and hydrogen peroxide react in a sealed conical flask. Oxygen pushes the plunger of the gas syringe out, so the volume can be read directly.",
    mode: "bubble",
    selector: '[data-experiment-tour="catalase-scene"]',
  },
  {
    title: "Change one thing at a time",
    text: "Swap the tissue to compare catalase content, or change the hydrogen peroxide concentration to change the substrate available.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Do not forget the controls",
    text: "Boiled liver and a flask with no tissue must both be tested. If they give no gas, the oxygen really is coming from the enzyme.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function ConicalFlask({
  tissue,
  froth,
  started,
}: {
  tissue: Tissue;
  froth: number;
  started: boolean;
}) {
  const chunks = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => ({
        x: (Math.random() - 0.5) * 0.18,
        z: (Math.random() - 0.5) * 0.18,
        y: 0.05 + (index % 2) * 0.03,
        rotation: Math.random() * Math.PI,
      })),
    [],
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        x: (Math.random() - 0.5) * 0.34,
        z: (Math.random() - 0.5) * 0.34,
        y: Math.random(),
        size: 0.012 + Math.random() * 0.018,
      })),
    [],
  );

  return (
    <group position={[-0.85, BENCH_TOP_Y, 0]}>
      {/* Conical (Erlenmeyer) body */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.11, 0.32, 0.48, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.2}
          transmission={0.84}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.012, 32]} />
        <meshPhysicalMaterial color="#e4f2fb" transparent opacity={0.42} roughness={0.08} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.22, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.2}
          transmission={0.84}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Hydrogen peroxide */}
      {started && (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.22, 0.3, 0.2, 28]} />
          <meshStandardMaterial color="#e8f6ff" transparent opacity={0.5} roughness={0.18} />
        </mesh>
      )}

      {/* Tissue pieces on the bottom */}
      {tissue.id !== "none" &&
        chunks.map((chunk, index) => (
          <mesh key={index} position={[chunk.x, chunk.y, chunk.z]} rotation={[0.2, chunk.rotation, 0.1]} castShadow>
            <boxGeometry args={[0.075, 0.04, 0.06]} />
            <meshStandardMaterial color={tissue.colour} roughness={0.75} />
          </mesh>
        ))}

      {/* Froth of oxygen bubbles — height tracks the reaction rate */}
      {froth > 0.02 &&
        bubbles.map((bubble, index) => (
          <mesh key={index} position={[bubble.x * (1 - bubble.y * 0.4), 0.1 + bubble.y * froth * 0.42, bubble.z * (1 - bubble.y * 0.4)]}>
            <sphereGeometry args={[bubble.size, 8, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.42 + froth * 0.3} roughness={0.2} />
          </mesh>
        ))}

      {/* Rubber bung */}
      <mesh position={[0, 0.71, 0]} castShadow>
        <cylinderGeometry args={[0.082, 0.072, 0.09, 20]} />
        <meshStandardMaterial color="#4a4038" roughness={0.9} />
      </mesh>

      <Html position={[0, 1.0, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[100px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">{tissue.label}</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-teal-300">+ H₂O₂</div>
        </div>
      </Html>
    </group>
  );
}

/** The delivery tube arcing from the bung across to the gas syringe. */
function DeliveryTube() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.85, BENCH_TOP_Y + 0.76, 0),
        new THREE.Vector3(-0.7, BENCH_TOP_Y + 1.0, 0.05),
        new THREE.Vector3(-0.1, BENCH_TOP_Y + 1.02, 0.05),
        new THREE.Vector3(0.34, BENCH_TOP_Y + 0.62, 0.02),
        new THREE.Vector3(0.44, BENCH_TOP_Y + 0.4, 0),
      ]),
    [],
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 40, 0.016, 10, false]} />
      <meshStandardMaterial color="#2f3944" roughness={0.8} />
    </mesh>
  );
}

function GasSyringe({ volume }: { volume: number }) {
  const barrelLength = 0.9;
  const fraction = THREE.MathUtils.clamp(volume / SYRINGE_CAPACITY, 0, 1);
  // Plunger starts near the nozzle and slides out as gas collects.
  const plungerX = 0.5 + fraction * (barrelLength - 0.1);

  return (
    <group position={[0.44, BENCH_TOP_Y + 0.4, 0]}>
      {/* Stand clamp */}
      <mesh position={[0.55, -0.2, -0.14]} castShadow>
        <boxGeometry args={[0.08, 0.06, 0.12]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.55, -0.4, -0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.42, 12]} />
        <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.55, -0.62, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.03, 0.24]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Glass barrel, horizontal */}
      <mesh position={[0.5 + barrelLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.062, 0.062, barrelLength, 28, 1, true]} />
        <meshPhysicalMaterial
          color="#e6f4fb"
          transparent
          opacity={0.22}
          transmission={0.82}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Nozzle into the delivery tube */}
      <mesh position={[0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.017, 0.017, 0.16, 12]} />
        <meshPhysicalMaterial color="#e6f4fb" transparent opacity={0.5} roughness={0.1} />
      </mesh>

      {/* Plunger disc + rod */}
      <mesh position={[plungerX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.058, 0.058, 0.03, 24]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
      <mesh position={[plungerX + 0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.32, 12]} />
        <meshStandardMaterial color="#71717a" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[plungerX + 0.33, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 20]} />
        <meshStandardMaterial color="#71717a" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Graduation ticks every 10 cm³ */}
      {Array.from({ length: 7 }, (_, index) => index).map((index) => (
        <mesh key={index} position={[0.5 + (index / 6) * (barrelLength - 0.1), 0.066, 0]}>
          <boxGeometry args={[0.004, 0.016, 0.004]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}

      <Html position={[0.5 + barrelLength / 2, 0.28, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[108px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Gas syringe</div>
          <div className="mt-0.5 text-[10px] font-black text-teal-300">{volume.toFixed(1)} cm³ O₂</div>
        </div>
      </Html>
    </group>
  );
}

/** Beakers of each hydrogen peroxide concentration waiting at the back. */
function PeroxideBeakers({ activePercent }: { activePercent: number }) {
  return (
    <group position={[0.1, BENCH_TOP_Y, -0.82]}>
      {CONCENTRATIONS.map((concentration, index) => {
        const x = (index - (CONCENTRATIONS.length - 1) / 2) * 0.3;
        const active = concentration.percent === activePercent;
        return (
          <group key={concentration.percent} position={[x, 0, 0]}>
            <mesh position={[0, 0.11, 0]} castShadow>
              <cylinderGeometry args={[0.075, 0.075, 0.22, 20, 1, true]} />
              <meshPhysicalMaterial color="#e8f0f8" transparent opacity={0.28} transmission={0.7} roughness={0.08} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.068, 0.068, 0.14, 20]} />
              <meshStandardMaterial color="#dbeeff" transparent opacity={0.55} roughness={0.2} />
            </mesh>
            <Html position={[0, 0.32, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <div
                className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase ${
                  active ? "border-teal-300/50 bg-teal-950/90 text-teal-100" : "border-white/15 bg-slate-950/80 text-slate-400"
                }`}
              >
                {concentration.percent}% {active ? "· in use" : ""}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function CatalaseScene({
  tissue,
  concentrationPercent,
  volume,
  froth,
  started,
  mode,
  isMobile,
  moveVectorRef,
}: {
  tissue: Tissue;
  concentrationPercent: number;
  volume: number;
  froth: number;
  started: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [2.7, 3.35, 4.5] : [2.9, 3.15, 4.6];
    camera.position.set(...position);
    camera.lookAt(0, 2.05, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 47;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0d9488"
        benchColor="#eaf0f2"
        posterA={{
          title: "CATALASE",
          lines: [
            "2H₂O₂ → 2H₂O + O₂",
            "Catalase is found in almost every living cell",
            "Liver is the richest source",
            "Boiling denatures the enzyme",
          ],
        }}
        posterB={{
          title: "MEASURING RATE",
          lines: [
            "Collect the oxygen in a gas syringe",
            "Rate = volume of gas ÷ time",
            "Initial rate = gradient at the start",
            "The curve levels off when H₂O₂ runs out",
          ],
        }}
      >
        <ConicalFlask tissue={tissue} froth={froth} started={started} />
        <DeliveryTube />
        <GasSyringe volume={volume} />
        <PeroxideBeakers activePercent={concentrationPercent} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.0, 0]} minDistance={2.2} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function CatalasePaper({
  concentrationPercent,
  rates,
  onClose,
}: {
  concentrationPercent: number;
  rates: Record<string, number>;
  onClose: () => void;
}) {
  const recorded = TISSUES.filter((tissue) => tissue.id in rates);

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Investigating the Action of Catalase on Hydrogen Peroxide
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To compare the rate at which oxygen is produced when hydrogen peroxide is broken down by catalase in different
          tissues, and to show that the gas comes from enzyme action.
        </p>

        <h2 className="mt-5 font-bold uppercase">Word equation</h2>
        <p className="text-center italic">hydrogen peroxide → water + oxygen (catalysed by catalase)</p>
        <p className="text-center">2H₂O₂ → 2H₂O + O₂</p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Conical flask, rubber bung fitted with a delivery tube, gas syringe (or inverted measuring cylinder over
          water), clamp and stand, stop-clock, {concentrationPercent}% hydrogen peroxide, equal masses of fresh liver,
          potato and celery, boiled liver, balance, scalpel and tile.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Equal masses (2 g) of each tissue were cut into pieces of the same size.</li>
          <li>One tissue sample was placed in the conical flask.</li>
          <li>
            10 cm³ of {concentrationPercent}% hydrogen peroxide was added, the bung replaced immediately and the
            stop-clock started.
          </li>
          <li>The volume of oxygen in the gas syringe was recorded every 10 seconds for two minutes.</li>
          <li>The flask was washed out and the procedure repeated with each of the other tissues.</li>
          <li>Boiled liver, and a flask containing hydrogen peroxide with no tissue, were used as controls.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">Type of tissue (its catalase content)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Volume of oxygen collected in a given time</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Mass and surface area of tissue, volume and concentration of hydrogen peroxide, temperature, pH, size of
                flask
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {recorded.length === 0 ? (
          <p className="italic">No readings recorded yet — run the reaction with at least one tissue first.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Tissue</th>
                <th className="border border-slate-400 p-2">Initial rate of oxygen production (cm³/s)</th>
                <th className="border border-slate-400 p-2">Observation</th>
              </tr>
            </thead>
            <tbody>
              {recorded.map((tissue) => (
                <tr key={tissue.id}>
                  <td className="border border-slate-400 p-2">{tissue.label}</td>
                  <td className="border border-slate-400 p-2 text-center">{rates[tissue.id].toFixed(2)}</td>
                  <td className="border border-slate-400 p-2">
                    {tissue.activity === 0 ? "No bubbles — no gas collected" : "Steady froth of bubbles, plunger moved out"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Fresh liver produced oxygen fastest, then potato, then celery, showing that liver contains the most catalase.
          Boiled liver produced no oxygen because boiling denatures the enzyme — the active site permanently loses its
          shape and can no longer bind hydrogen peroxide. The flask with no tissue also produced no measurable gas, which
          proves that the oxygen was released by the enzyme and not by the hydrogen peroxide breaking down on its own.
          The graph of volume against time is steepest at the start and then levels off, because the hydrogen peroxide is
          gradually used up.
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Gas can escape while the bung is being replaced, so the first reading is often too low; the peroxide can be
            added through a syringe in the bung instead.
          </li>
          <li>Cutting the tissue into pieces of equal size is difficult, and surface area strongly affects the rate.</li>
          <li>The reaction is exothermic, so the flask warms slightly and the rate is not perfectly constant.</li>
          <li>Each tissue should be tested three times and a mean rate calculated.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function CatalaseActivitySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: CatalaseSimProps) {
  const [tissueIndex, setTissueIndex] = useState(0);
  const [concentrationIndex, setConcentrationIndex] = useState(3); // 8%
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const tissue = TISSUES[tissueIndex];
  const concentration = CONCENTRATIONS[concentrationIndex];
  const volume = started ? volumeAt(elapsed, tissue.activity, concentration.maxVolume) : 0;
  const rate = initialRate(tissue.activity, concentration.maxVolume);

  /** Froth height falls away as the substrate is consumed. */
  const froth = started && tissue.activity > 0 ? tissue.activity * Math.exp(-BASE_K * tissue.activity * elapsed) : 0;
  const runFinished = elapsed >= MAX_TIME_S;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = Math.min(((now - startRef.current) / 1000) * TIME_SCALE, MAX_TIME_S);
      setElapsed(next);
      if (next >= MAX_TIME_S) {
        setRunning(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  /* Record the initial rate once the run has passed the first 10 s reading. */
  useEffect(() => {
    if (!started || elapsed < READING_INTERVAL_S) return;
    setRates((current) => (tissue.id in current ? current : { ...current, [tissue.id]: rate }));
  }, [started, elapsed, tissue.id, rate]);

  const startRun = useCallback(() => {
    setStarted(true);
    startRef.current = performance.now() - (elapsed / TIME_SCALE) * 1000;
    setRunning(true);
  }, [elapsed]);

  const pause = useCallback(() => setRunning(false), []);

  const resetRun = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setStarted(false);
  }, []);

  const selectTissue = useCallback((index: number) => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setStarted(false);
    setTissueIndex(index);
  }, []);

  const selectConcentration = useCallback((index: number) => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setStarted(false);
    setConcentrationIndex(index);
    // Rates depend on concentration, so a change invalidates the comparison.
    setRates({});
  }, []);

  const clearResults = useCallback(() => {
    setRates({});
    resetRun();
  }, [resetRun]);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setElapsed(0);
    setStarted(true);
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

  const recordedCount = Object.keys(rates).length;
  const controlsDone = "boiled" in rates || "none" in rates;
  const step = recordedCount >= 3 && controlsDone ? 3 : started && elapsed >= READING_INTERVAL_S ? 2 : started ? 1 : 0;
  const complete = recordedCount >= TISSUES.length;
  const progress = elapsed / MAX_TIME_S;

  /* Volume against time for the run in progress. */
  const graphPoints: GraphPoint[] = useMemo(() => {
    const points: GraphPoint[] = [];
    for (let t = 0; t <= MAX_TIME_S; t += READING_INTERVAL_S) {
      if (!started || t > elapsed) {
        points.push({ x: t, y: 0, pending: true });
      } else {
        points.push({ x: t, y: volumeAt(t, tissue.activity, concentration.maxVolume) });
      }
    }
    return points;
  }, [started, elapsed, tissue.activity, concentration.maxVolume]);

  const status = running
    ? tissue.activity === 0
      ? `${Math.floor(elapsed)} s — the plunger has not moved. No oxygen is being produced.`
      : `${Math.floor(elapsed)} s — ${volume.toFixed(1)} cm³ of oxygen collected. ${
          froth > tissue.activity * 0.4 ? "Frothing strongly." : "The frothing is slowing as the H₂O₂ is used up."
        }`
    : started && runFinished
      ? tissue.activity === 0
        ? `${tissue.label}: no oxygen at all after 2 minutes. This is the control result you should expect.`
        : `${tissue.label}: ${volume.toFixed(1)} cm³ collected. Initial rate = ${rate.toFixed(2)} cm³/s.`
      : `${tissue.label} is in the flask with ${concentration.percent}% H₂O₂. Add the peroxide and start the clock.`;

  const observation = complete
    ? "All five tested. Liver > potato > celery, and both controls gave no gas — the oxygen comes from catalase."
    : recordedCount > 0
      ? `${recordedCount} of ${TISSUES.length} tissues recorded.${controlsDone ? "" : " Do not forget the boiled and no-tissue controls."}`
      : "Run each tissue in turn and compare the initial rates.";

  const primaryLabel = running ? "Reacting…" : started && runFinished ? "Reset flask" : started ? "Continue" : "Add H₂O₂ & start";

  /* ------------------------------------------------------------ UI panels */

  const tissuePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Tissue in flask</span>
        <span className="text-[11px] font-black" style={{ color: ACCENT.text }}>
          {tissue.short}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {TISSUES.map((item, index) => {
          const recorded = item.id in rates;
          const active = index === tissueIndex;
          return (
            <button
              key={item.id}
              onClick={() => selectTissue(index)}
              className="relative rounded-xl px-1 py-2 text-[9px] font-black transition"
              style={
                active
                  ? { background: ACCENT.base, color: "#04201d" }
                  : { background: "rgba(255,255,255,0.08)", color: recorded ? "#a7f3d0" : "#e2e8f0" }
              }
            >
              {item.short}
              {recorded && !active && <span className="absolute right-0.5 top-0.5 text-[7px]">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{tissue.note}</div>
    </div>
  );

  const concentrationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">H₂O₂ concentration</span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {concentration.percent}%
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {CONCENTRATIONS.map((item, index) => (
          <button
            key={item.percent}
            onClick={() => selectConcentration(index)}
            className="rounded-xl px-1 py-2 text-[10px] font-black transition"
            style={
              index === concentrationIndex
                ? { background: ACCENT.base, color: "#04201d" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {item.percent}%
          </button>
        ))}
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">
        More substrate means a faster start and a larger final volume. Changing this clears the tissue comparison.
      </div>
    </div>
  );

  const syringePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Gas syringe</span>
        <span className="text-lg font-black tabular-nums" style={{ color: ACCENT.text }}>
          {volume.toFixed(1)} cm³
        </span>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-900">
        <div
          className="h-full rounded-full transition-[width]"
          style={{ width: `${Math.max(1, (volume / SYRINGE_CAPACITY) * 100)}%`, background: ACCENT.base }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase">
        <span className="text-slate-400">{Math.floor(elapsed)} s of {MAX_TIME_S} s</span>
        <span style={{ color: ACCENT.text }}>initial rate {rate.toFixed(2)} cm³/s</span>
      </div>
    </div>
  );

  const graphPanel = (
    <ExperimentResultsGraph
      points={graphPoints}
      xLabel="Time (s)"
      yLabel="Volume O₂ (cm³)"
      accentHex={ACCENT.base}
      caption={`Oxygen collected — ${tissue.label}`}
      xMin={0}
      xMax={MAX_TIME_S}
      yMax={SYRINGE_CAPACITY}
      footer="The curve is steepest at the start, then levels off as the hydrogen peroxide runs out."
    />
  );

  const ratesTable = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Initial rates</span>
        <button onClick={clearResults} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-1.5 space-y-1">
        {TISSUES.map((item) => {
          const recorded = item.id in rates;
          const value = rates[item.id];
          const maxRate = initialRate(1, CONCENTRATIONS[concentrationIndex].maxVolume);
          return (
            <div key={item.id} className="flex items-center gap-2 text-[10px]">
              <span className="w-14 shrink-0 font-black text-white">{item.short}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-900">
                {recorded && (
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(1, (value / Math.max(maxRate, 0.01)) * 100)}%`, background: ACCENT.base }}
                  />
                )}
              </div>
              <span className="w-10 shrink-0 text-right font-black" style={{ color: recorded ? ACCENT.text : "#64748b" }}>
                {recorded ? value.toFixed(2) : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 text-[9px] leading-snug text-slate-400">Units: cm³ of oxygen per second.</div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Catalase Lab"
          subtitle="2H₂O₂ → 2H₂O + O₂"
          symbol="🫧"
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

      <div data-experiment-tour="catalase-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [2.9, 3.15, 4.6], fov: 47, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <CatalaseScene
            tissue={tissue}
            concentrationPercent={concentration.percent}
            volume={volume}
            froth={froth}
            started={started}
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
            emoji="🫧"
            cornerEmoji="🥔"
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
          title="Catalase & H₂O₂"
          tagline="2H₂O₂ → 2H₂O + O₂"
          missions={MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : started && runFinished ? "↺" : "▶"}
          onPrimary={running ? pause : started && runFinished ? resetRun : startRun}
          onReset={resetRun}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "tissue", label: "Tissue", value: tissue.short, content: tissuePanel },
            { id: "syringe", label: "Volume", value: `${volume.toFixed(0)}cm³`, content: syringePanel },
            { id: "graph", label: "Graph", value: `${Math.floor(elapsed)}s`, content: graphPanel },
            { id: "conc", label: "H₂O₂", value: `${concentration.percent}%`, content: concentrationPanel },
            { id: "rates", label: "Rates", value: `${recordedCount}/${TISSUES.length}`, content: ratesTable },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "run",
              label: running ? "Pause" : started && runFinished ? "Reset" : "Add H₂O₂",
              onClick: running ? pause : started && runFinished ? resetRun : startRun,
              tone: running ? "red" : "green",
            },
            {
              id: "next",
              label: "Next tissue",
              onClick: () => selectTissue((tissueIndex + 1) % TISSUES.length),
              tone: "orange",
            },
            { id: "reset", label: "Clear all", onClick: clearResults, tone: "dark" },
          ]}
          panels={[
            { id: "tissue", label: "Tissue", value: tissue.short, content: tissuePanel },
            { id: "syringe", label: "Volume", value: `${volume.toFixed(0)}cm³`, content: syringePanel },
            { id: "graph", label: "Graph", value: `${Math.floor(elapsed)}s`, content: graphPanel },
            { id: "conc", label: "H₂O₂", value: `${concentration.percent}%`, content: concentrationPanel },
            { id: "rates", label: "Rates", value: `${recordedCount}/${TISSUES.length}`, content: ratesTable },
          ]}
        />
      )}

      {showPaper && <CatalasePaper concentrationPercent={concentration.percent} rates={rates} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
