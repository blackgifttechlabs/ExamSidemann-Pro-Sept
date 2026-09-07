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

interface SeedRespirationSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.orange;
const PAPER_FILENAME = "respiration-in-germinating-seeds.html";

/* ------------------------------------------------------------------ Science */

const TOTAL_HOURS = 48;
/** Real milliseconds for the whole 48-hour time-lapse. */
const RUN_DURATION_MS = 12000;
const ROOM_TEMPERATURE = 20;
/** Temperature the germinating flask rises to after 48 h. */
const GERMINATING_PEAK = 28.5;
/** A rise this large in the dead-seed flask means microbes are respiring. */
const CONTAMINATED_PEAK = 24.5;
const READING_INTERVAL_H = 6;

/**
 * Germinating seeds are alive and respiring, so they release carbon dioxide and
 * heat. Boiled seeds are dead and release neither — unless they were not
 * disinfected, in which case microorganisms growing on them respire instead and
 * spoil the control.
 */
function temperatureAt(hours: number, peak: number): number {
  // Warming levels off as heat loss through the flask balances heat released.
  const fraction = 1 - Math.exp(-hours / 16);
  return ROOM_TEMPERATURE + (peak - ROOM_TEMPERATURE) * fraction;
}

/** How milky the limewater has gone, 0 (clear) to 1 (thick milky white). */
function limewaterCloudiness(hours: number, respiring: boolean, strength = 1): number {
  if (!respiring) return 0;
  return THREE.MathUtils.clamp((hours / 26) * strength, 0, 1);
}

function cloudinessLabel(cloudiness: number): string {
  if (cloudiness < 0.06) return "clear";
  if (cloudiness < 0.3) return "slightly cloudy";
  if (cloudiness < 0.7) return "cloudy";
  return "milky white";
}

const MISSIONS: GameMission[] = [
  { short: "Prepare", title: "Prepare both flasks", detail: "Soak one batch of seeds so they germinate. Boil a second batch to kill them, and disinfect both so no microorganisms respire.", symbol: "🌱" },
  { short: "Assemble", title: "Assemble the apparatus", detail: "Seal each vacuum flask with cotton wool and a thermometer, and connect the air line: soda lime, limewater A, flask, limewater B.", symbol: "🔧" },
  { short: "Run", title: "Leave for 48 hours", detail: "Draw slow, steady air through both sets and read the thermometers and the limewater every six hours.", symbol: "⏳" },
  { short: "Compare", title: "Compare and conclude", detail: "The living seeds warm up and turn their limewater milky. The dead control does neither.", symbol: "📈" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Respiration in seeds",
    text: "Respiration releases energy from glucose, and produces carbon dioxide and heat: glucose + oxygen → carbon dioxide + water (+ energy). Germinating seeds respire fast; dead seeds do not respire at all.",
    mode: "modal",
  },
  {
    title: "Two flasks, one difference",
    text: "Both vacuum flasks hold the same mass of seeds at the same temperature. The only difference is that one batch is alive and germinating and the other has been boiled.",
    mode: "bubble",
    selector: '[data-experiment-tour="respiration-scene"]',
  },
  {
    title: "Two things to measure",
    text: "Limewater turns milky if carbon dioxide is released. The thermometer shows the temperature rise from the energy released.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Why disinfect the seeds?",
    text: "Bacteria and fungi on the seeds also respire. If the seeds are not disinfected, the dead-seed control warms up too and the experiment proves nothing. Try switching the disinfectant off and watch what happens.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** A vacuum (thermos) flask of seeds with a thermometer through cotton wool. */
function SeedFlask({
  position,
  temperature,
  germinating,
  label,
  accentTone,
}: {
  position: [number, number, number];
  temperature: number;
  germinating: boolean;
  label: string;
  accentTone: string;
}) {
  const seeds = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        x: (Math.random() - 0.5) * 0.19,
        z: (Math.random() - 0.5) * 0.19,
        y: 0.09 + Math.random() * 0.16,
        rotation: Math.random() * Math.PI,
        scale: 0.85 + Math.random() * 0.3,
      })),
    [],
  );

  // The mercury thread is scaled over the 18–32 °C range a student would read.
  const threadFraction = THREE.MathUtils.clamp((temperature - 18) / 14, 0, 1);

  return (
    <group position={position}>
      {/* Outer casing of the vacuum flask */}
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.17, 0.56, 26, 1, true]} />
        <meshStandardMaterial color="#d7dce3" metalness={0.42} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.03, 26]} />
        <meshStandardMaterial color="#9aa3ae" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Silvered inner wall */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.54, 24, 1, true]} />
        <meshStandardMaterial color="#eef2f6" metalness={0.85} roughness={0.16} side={THREE.DoubleSide} />
      </mesh>

      {/* Seeds */}
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, seed.y, seed.z]} rotation={[0.3, seed.rotation, 0.2]} scale={seed.scale} castShadow>
          <sphereGeometry args={[0.021, 8, 6]} />
          <meshStandardMaterial color={germinating ? "#c8b072" : "#93806a"} roughness={0.85} />
        </mesh>
      ))}
      {/* Radicles pushing out of the germinating seeds */}
      {germinating &&
        seeds.slice(0, 12).map((seed, index) => (
          <mesh key={`root-${index}`} position={[seed.x + 0.014, seed.y + 0.012, seed.z]} rotation={[0.4, seed.rotation, 0.9]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.038, 6]} />
            <meshStandardMaterial color="#e8f0d8" roughness={0.8} />
          </mesh>
        ))}

      {/* Cotton wool plug */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.15, 14, 10]} />
        <meshStandardMaterial color="#fbfbfa" roughness={1} />
      </mesh>

      {/* Thermometer through the plug */}
      <group position={[0, 0.78, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.016, 0.016, 0.62, 12]} />
          <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.55} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.24 + threadFraction * 0.22, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.06 + threadFraction * 0.44, 8]} />
          <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0, -0.31, 0]}>
          <sphereGeometry args={[0.022, 12, 10]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      <Html position={[0, 1.24, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[118px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">{label}</div>
          <div className="mt-0.5 text-[11px] font-black tabular-nums" style={{ color: accentTone }}>
            {temperature.toFixed(1)} °C
          </div>
        </div>
      </Html>
    </group>
  );
}

/** A boiling tube of limewater; goes milky as carbon dioxide bubbles through. */
function LimewaterTube({
  position,
  cloudiness,
  label,
  sublabel,
  bubbling,
}: {
  position: [number, number, number];
  cloudiness: number;
  label: string;
  sublabel: string;
  bubbling: boolean;
}) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        x: (Math.random() - 0.5) * 0.05,
        y: 0.1 + (index / 7) * 0.28,
        z: (Math.random() - 0.5) * 0.05,
        size: 0.008 + Math.random() * 0.005,
      })),
    [],
  );

  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.56, 22, 1, true]} />
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
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.065, 20, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#e3f2fb" transparent opacity={0.22} transmission={0.84} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Limewater — opacity and whiteness track the calcium carbonate formed */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.058, 0.058, 0.4, 20]} />
        <meshStandardMaterial
          color={new THREE.Color("#e6f5fb").lerp(new THREE.Color("#ffffff"), cloudiness).getStyle()}
          transparent
          opacity={0.35 + cloudiness * 0.6}
          roughness={0.2 + cloudiness * 0.55}
        />
      </mesh>
      {/* Delivery tube dipping under the surface */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 10]} />
        <meshStandardMaterial color="#2f3944" roughness={0.8} />
      </mesh>
      {bubbling &&
        bubbles.map((bubble, index) => (
          <mesh key={index} position={[bubble.x, bubble.y, bubble.z]}>
            <sphereGeometry args={[bubble.size, 8, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
        ))}

      <Html position={[0, 0.76, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[106px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">{label}</div>
          <div className="mt-0.5 text-[7px] font-black uppercase" style={{ color: cloudiness > 0.25 ? "#fed7aa" : "#94a3b8" }}>
            {sublabel}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Tube of soda lime that removes carbon dioxide from the incoming air. */
function SodaLimeTube({ position }: { position: [number, number, number] }) {
  const granules = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: (Math.random() - 0.5) * 0.08,
        y: 0.08 + Math.random() * 0.3,
        z: (Math.random() - 0.5) * 0.08,
      })),
    [],
  );

  return (
    <group position={position}>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.48, 20, 1, true]} />
        <meshPhysicalMaterial color="#e3f2fb" transparent opacity={0.2} transmission={0.82} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {granules.map((granule, index) => (
        <mesh key={index} position={[granule.x, granule.y, granule.z]}>
          <boxGeometry args={[0.022, 0.022, 0.022]} />
          <meshStandardMaterial color="#eef2f6" roughness={0.95} />
        </mesh>
      ))}
      <Html position={[0, 0.66, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[102px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Soda lime</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-slate-400">removes CO₂ from air in</div>
        </div>
      </Html>
    </group>
  );
}

/** One complete train: soda lime → control limewater → flask → test limewater. */
function ApparatusTrain({
  x,
  temperature,
  germinating,
  cloudiness,
  label,
  accentTone,
}: {
  x: number;
  temperature: number;
  germinating: boolean;
  cloudiness: number;
  label: string;
  accentTone: string;
}) {
  return (
    <group position={[x, BENCH_TOP_Y + 0.02, 0]}>
      <SodaLimeTube position={[-0.52, 0, 0.16]} />
      <LimewaterTube position={[-0.26, 0, 0.16]} cloudiness={0} label="Limewater A" sublabel="stays clear" bubbling={false} />
      <SeedFlask position={[0.06, 0, 0]} temperature={temperature} germinating={germinating} label={label} accentTone={accentTone} />
      <LimewaterTube
        position={[0.42, 0, 0.16]}
        cloudiness={cloudiness}
        label="Limewater B"
        sublabel={cloudinessLabel(cloudiness)}
        bubbling={cloudiness > 0.02}
      />

      {/* Connecting tubes across the train */}
      {[
        [-0.39, 0.5],
        [-0.13, 0.58],
        [0.24, 0.58],
      ].map(([tubeX, height], index) => (
        <mesh key={index} position={[tubeX, height, 0.16]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.26, 10]} />
          <meshStandardMaterial color="#2f3944" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function SeedRespirationScene({
  hours,
  disinfected,
  mode,
  isMobile,
  moveVectorRef,
}: {
  hours: number;
  disinfected: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.4, 3.6, 5.6] : [0.6, 3.35, 5.4];
    camera.position.set(...position);
    camera.lookAt(0, 2.1, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 58 : 51;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const livingTemperature = temperatureAt(hours, GERMINATING_PEAK);
  const deadTemperature = temperatureAt(hours, disinfected ? ROOM_TEMPERATURE : CONTAMINATED_PEAK);
  const livingCloudiness = limewaterCloudiness(hours, true);
  const deadCloudiness = limewaterCloudiness(hours, !disinfected, 0.45);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#ea580c"
        benchColor="#f1eee9"
        benchSize={[9.4, 4.4]}
        posterA={{
          title: "RESPIRATION",
          lines: [
            "glucose + oxygen → carbon dioxide + water",
            "Energy is released, some of it as heat",
            "Limewater turns milky with carbon dioxide",
            "Germinating seeds respire quickly",
          ],
        }}
        posterB={{
          title: "FAIR TEST",
          lines: [
            "Boiled seeds are the dead control",
            "Disinfect BOTH batches of seeds",
            "Vacuum flasks stop heat escaping",
            "Soda lime removes CO₂ from the air in",
          ],
        }}
      >
        <ApparatusTrain
          x={-1.15}
          temperature={livingTemperature}
          germinating
          cloudiness={livingCloudiness}
          label="Germinating seeds"
          accentTone="#fdba74"
        />
        <ApparatusTrain
          x={1.15}
          temperature={deadTemperature}
          germinating={false}
          cloudiness={deadCloudiness}
          label="Boiled seeds (control)"
          accentTone={disinfected ? "#cbd5e1" : "#fca5a5"}
        />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.28} scale={8} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.05, 0]} minDistance={2.6} maxDistance={11} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function SeedRespirationPaper({
  hours,
  disinfected,
  onClose,
}: {
  hours: number;
  disinfected: boolean;
  onClose: () => void;
}) {
  const finished = hours >= TOTAL_HOURS;
  const livingTemperature = temperatureAt(hours, GERMINATING_PEAK);
  const deadTemperature = temperatureAt(hours, disinfected ? ROOM_TEMPERATURE : CONTAMINATED_PEAK);

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Comparing Respiration in Germinating and Non-Germinating Seeds
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To show that germinating seeds respire — releasing carbon dioxide and heat — and that dead seeds do not.
        </p>

        <h2 className="mt-5 font-bold uppercase">Word equation</h2>
        <p className="text-center italic">glucose + oxygen → carbon dioxide + water (+ energy released)</p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Two vacuum flasks, two thermometers (−10 to 110 °C), cotton wool, equal masses of soaked germinating bean
          seeds and of boiled bean seeds, disinfectant, boiling tubes of limewater, tubes of soda lime, delivery tubes
          and bungs, filter pump or aspirator, stop-clock.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Two batches of seeds of equal mass were soaked in water for 24 hours so one batch would germinate.</li>
          <li>The second batch was boiled for five minutes to kill the seeds, then cooled.</li>
          <li>
            Both batches were rinsed in disinfectant to kill any bacteria and fungi on the seed coats, so that only the
            seeds themselves could respire.
          </li>
          <li>Each batch was put in a vacuum flask, plugged with cotton wool and fitted with a thermometer.</li>
          <li>
            Air was drawn slowly through each flask. It passed first through soda lime to remove carbon dioxide from the
            atmosphere, then through limewater A to prove the air entering was free of carbon dioxide, then over the
            seeds, and finally through limewater B.
          </li>
          <li>The temperature and the appearance of limewater B were recorded every six hours for 48 hours.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">Whether the seeds are alive (germinating) or dead (boiled)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Temperature in the flask, and whether limewater B turns milky</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Mass and type of seed, starting temperature, rate of air flow, volume of limewater, same disinfection,
                same flasks
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results {finished ? "(after 48 hours)" : `(after ${Math.round(hours)} hours)`}</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Flask</th>
              <th className="border border-slate-400 p-2">Start temperature (°C)</th>
              <th className="border border-slate-400 p-2">Final temperature (°C)</th>
              <th className="border border-slate-400 p-2">Rise (°C)</th>
              <th className="border border-slate-400 p-2">Limewater B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2">Germinating seeds</td>
              <td className="border border-slate-400 p-2 text-center">{ROOM_TEMPERATURE.toFixed(1)}</td>
              <td className="border border-slate-400 p-2 text-center">{livingTemperature.toFixed(1)}</td>
              <td className="border border-slate-400 p-2 text-center">{(livingTemperature - ROOM_TEMPERATURE).toFixed(1)}</td>
              <td className="border border-slate-400 p-2">{cloudinessLabel(limewaterCloudiness(hours, true))}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Boiled seeds (control)</td>
              <td className="border border-slate-400 p-2 text-center">{ROOM_TEMPERATURE.toFixed(1)}</td>
              <td className="border border-slate-400 p-2 text-center">{deadTemperature.toFixed(1)}</td>
              <td className="border border-slate-400 p-2 text-center">{(deadTemperature - ROOM_TEMPERATURE).toFixed(1)}</td>
              <td className="border border-slate-400 p-2">
                {cloudinessLabel(limewaterCloudiness(hours, !disinfected, 0.45))}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The limewater connected to the germinating seeds turned milky, showing that carbon dioxide was released, and
          the temperature in that flask rose by several degrees, showing that energy was released as heat. Both are
          evidence of respiration. Limewater A stayed clear, which proves the carbon dioxide came from the seeds and not
          from the air drawn in.
        </p>
        {disinfected ? (
          <p className="mt-2">
            The boiled seeds gave no change in either measurement. They are dead, so they cannot respire. This control
            shows that the results from the first flask were caused by living seeds.
          </p>
        ) : (
          <p className="mt-2 font-bold">
            In this run the seeds were NOT disinfected, and the dead-seed flask also warmed up and turned its limewater
            slightly cloudy. That carbon dioxide came from bacteria and fungi growing on the seed coats, not from the
            seeds. Without disinfection the control fails and no valid conclusion can be drawn.
          </p>
        )}

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Both batches of seeds must be disinfected, or microorganisms respiring on the dead seeds make the control
            appear to respire.
          </li>
          <li>Vacuum flasks are used because an ordinary beaker would lose the heat to the room too quickly.</li>
          <li>
            Air must be drawn through slowly and at the same rate through both trains, or the amount of carbon dioxide
            carried to the limewater differs.
          </li>
          <li>
            Limewater shows whether carbon dioxide is present but not how much; bubbling the gas through a measured
            volume for a set time and titrating would be quantitative.
          </li>
          <li>Both flasks should start at exactly the same temperature, and the room temperature should be recorded.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function SeedRespirationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: SeedRespirationSimProps) {
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const [disinfected, setDisinfected] = useState(true);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const livingTemperature = temperatureAt(hours, GERMINATING_PEAK);
  const deadPeak = disinfected ? ROOM_TEMPERATURE : CONTAMINATED_PEAK;
  const deadTemperature = temperatureAt(hours, deadPeak);
  const livingCloudiness = limewaterCloudiness(hours, true);
  const deadCloudiness = limewaterCloudiness(hours, !disinfected, 0.45);

  const progress = hours / TOTAL_HOURS;
  const complete = hours >= TOTAL_HOURS;
  const step = complete ? 3 : hours >= 12 ? 2 : hours > 0 ? 1 : 0;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = Math.min(1, (now - startRef.current) / RUN_DURATION_MS);
      setHours(fraction * TOTAL_HOURS);
      if (fraction >= 1) {
        setRunning(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const startRun = useCallback(() => {
    startRef.current = performance.now() - (hours / TOTAL_HOURS) * RUN_DURATION_MS;
    setRunning(true);
  }, [hours]);

  const pause = useCallback(() => setRunning(false), []);

  const resetAll = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setHours(0);
  }, []);

  const stepHours = useCallback((delta: number) => {
    setRunning(false);
    setDemoActive(false);
    setHours((current) => THREE.MathUtils.clamp(current + delta, 0, TOTAL_HOURS));
  }, []);

  const toggleDisinfected = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setHours(0);
    setDisinfected((current) => !current);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setHours(0);
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

  /* Temperature curves for both flasks, sampled every six hours. */
  const { livingPoints, deadPoints } = useMemo(() => {
    const living: GraphPoint[] = [];
    const dead: GraphPoint[] = [];
    for (let t = 0; t <= TOTAL_HOURS; t += READING_INTERVAL_H) {
      const pending = t > hours;
      living.push(pending ? { x: t, y: ROOM_TEMPERATURE, pending: true } : { x: t, y: temperatureAt(t, GERMINATING_PEAK) });
      if (!pending) dead.push({ x: t, y: temperatureAt(t, deadPeak) });
    }
    return { livingPoints: living, deadPoints: dead };
  }, [hours, deadPeak]);

  const status = complete
    ? disinfected
      ? `After 48 h the germinating seeds reached ${livingTemperature.toFixed(1)} °C and turned their limewater milky. The boiled seeds stayed at ${deadTemperature.toFixed(1)} °C with clear limewater.`
      : `After 48 h BOTH flasks warmed up (${livingTemperature.toFixed(1)} °C and ${deadTemperature.toFixed(1)} °C). The seeds were not disinfected, so microorganisms respired too — the control has failed.`
    : running
      ? `${Math.round(hours)} h — germinating flask ${livingTemperature.toFixed(1)} °C, control ${deadTemperature.toFixed(1)} °C. Limewater B is ${cloudinessLabel(livingCloudiness)}.`
      : hours > 0
        ? `Paused at ${Math.round(hours)} h. Compare the two thermometers and the two limewater tubes.`
        : `Both flasks are at ${ROOM_TEMPERATURE} °C with clear limewater. Run the 48-hour time-lapse.`;

  const observation = complete
    ? disinfected
      ? "Living seeds release CO₂ and heat; dead seeds release neither. Respiration only happens in living cells."
      : "Not disinfecting the seeds ruins the control — always sterilise both batches."
    : "Watch both thermometers and both limewater tubes at the same time; the comparison is the evidence.";

  const primaryLabel = running ? "Running…" : complete ? "Reset to 0 h" : hours > 0 ? "Continue" : "Start 48 h time-lapse";

  /* ------------------------------------------------------------ UI panels */

  const timePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Elapsed time</span>
        <span className="text-lg font-black tabular-nums" style={{ color: ACCENT.text }}>
          {Math.round(hours)} h
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <button
          onClick={() => stepHours(-6)}
          disabled={hours <= 0}
          className="rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black text-slate-200 transition disabled:opacity-40"
        >
          − 6 h
        </button>
        <button
          onClick={() => stepHours(6)}
          disabled={hours >= TOTAL_HOURS}
          className="rounded-xl px-2 py-2 text-[10px] font-black text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          + 6 h
        </button>
        <button onClick={() => stepHours(TOTAL_HOURS)} className="rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black text-slate-200 transition">
          48 h
        </button>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full" style={{ width: `${Math.max(2, progress * 100)}%`, background: ACCENT.base }} />
      </div>
    </div>
  );

  const comparisonPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Side-by-side readings</div>
      <div className="mt-2 space-y-1.5">
        {(
          [
            {
              label: "Germinating seeds",
              temperature: livingTemperature,
              cloudiness: livingCloudiness,
              alive: true,
            },
            {
              label: "Boiled seeds (control)",
              temperature: deadTemperature,
              cloudiness: deadCloudiness,
              alive: false,
            },
          ] as { label: string; temperature: number; cloudiness: number; alive: boolean }[]
        ).map((row) => (
          <div key={row.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-white">{row.label}</span>
              <span className="text-[11px] font-black tabular-nums" style={{ color: row.alive ? ACCENT.text : "#cbd5e1" }}>
                {row.temperature.toFixed(1)} °C
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[9px]">
              <span className="text-slate-500">rise {(row.temperature - ROOM_TEMPERATURE).toFixed(1)} °C</span>
              <span
                className="rounded-full px-2 py-0.5 font-black"
                style={
                  row.cloudiness > 0.25
                    ? { background: "rgba(234,88,12,0.2)", color: "#fed7aa" }
                    : { background: "rgba(255,255,255,0.08)", color: "#94a3b8" }
                }
              >
                limewater {cloudinessLabel(row.cloudiness)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const graphPanel = (
    <ExperimentResultsGraph
      points={livingPoints}
      comparison={deadPoints}
      seriesLabel="Germinating"
      comparisonLabel="Boiled (control)"
      xLabel="Time (hours)"
      yLabel="Temperature (°C)"
      accentHex={ACCENT.base}
      caption="Temperature in each flask"
      xMin={0}
      xMax={TOTAL_HOURS}
      yMin={18}
      yMax={32}
      footer="Only the living seeds warm up. The gap between the lines is the energy released by respiration."
    />
  );

  const controlPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Fair-test control</div>
      <button
        onClick={toggleDisinfected}
        className="mt-2 flex w-full items-center justify-between rounded-xl px-2.5 py-2 transition"
        style={{
          background: disinfected ? ACCENT.soft : "rgba(220,38,38,0.16)",
          border: `1px solid ${disinfected ? ACCENT.ring : "rgba(248,113,113,0.4)"}`,
        }}
      >
        <span className="text-[10px] font-black text-white">Seeds disinfected</span>
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-black"
          style={disinfected ? { background: ACCENT.base, color: "#2a1305" } : { background: "#dc2626", color: "#fff" }}
        >
          {disinfected ? "YES" : "NO"}
        </span>
      </button>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
        {disinfected
          ? "Both batches were rinsed in disinfectant, so only the seeds can respire. The dead-seed flask stays at room temperature."
          : "Without disinfectant, bacteria and fungi grow on the boiled seeds and respire. The control warms up too, and the experiment no longer proves anything about the seeds."}
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Seed Respiration"
          subtitle="germinating vs boiled seeds"
          symbol="🌱"
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

      <div data-experiment-tour="respiration-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.6, 3.35, 5.4], fov: 51, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <SeedRespirationScene
            hours={hours}
            disinfected={disinfected}
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
            emoji="🌱"
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
          title="Respiration in Seeds"
          tagline="germinating vs boiled seeds"
          missions={MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : complete ? "↺" : "▶"}
          onPrimary={running ? pause : complete ? resetAll : startRun}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "time", label: "Time", value: `${Math.round(hours)}h`, content: timePanel },
            { id: "compare", label: "Readings", value: `${livingTemperature.toFixed(0)}/${deadTemperature.toFixed(0)}°`, content: comparisonPanel },
            { id: "graph", label: "Graph", value: `${Math.round(hours)}h`, content: graphPanel },
            { id: "control", label: "Control", value: disinfected ? "clean" : "risky", content: controlPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "run",
              label: running ? "Pause" : complete ? "Reset" : "Time-lapse",
              onClick: running ? pause : complete ? resetAll : startRun,
              tone: running ? "red" : "green",
            },
            { id: "next", label: "+6 h", onClick: () => stepHours(6), disabled: hours >= TOTAL_HOURS, tone: "orange" },
            { id: "disinfect", label: disinfected ? "Skip disinfect" : "Disinfect", onClick: toggleDisinfected, tone: "dark" },
          ]}
          panels={[
            { id: "time", label: "Time", value: `${Math.round(hours)}h`, content: timePanel },
            { id: "compare", label: "Readings", value: `${livingTemperature.toFixed(0)}/${deadTemperature.toFixed(0)}°`, content: comparisonPanel },
            { id: "graph", label: "Graph", value: `${Math.round(hours)}h`, content: graphPanel },
            { id: "control", label: "Control", value: disinfected ? "clean" : "risky", content: controlPanel },
          ]}
        />
      )}

      {showPaper && <SeedRespirationPaper hours={hours} disinfected={disinfected} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
