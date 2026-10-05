import { ExperimentLabelProvider, LabLabel } from "./RustingOfIronLabels";
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";

import { useMobileExperimentViewport } from "./RustingOfIronControls";
import {
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "./RustingOfIronControls";

interface RustingSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.amber;

type TubeKind = "waterAir" | "boiledOil" | "dryingAgent";

const DAYS = 7;
const RUN_DURATION_MS = 9000;
const RUSTING_PAPER_FILENAME = "rusting-of-iron-conditions.html";

const TUBES: { kind: TubeKind; x: number; title: string; sub: string; rusts: boolean }[] = [
  { kind: "waterAir", x: -0.62, title: "Water + air", sub: "Nail in tap water", rusts: true },
  { kind: "boiledOil", x: 0, title: "Boiled water + oil", sub: "No dissolved air", rusts: false },
  { kind: "dryingAgent", x: 0.62, title: "Dry air", sub: "Calcium chloride drying agent", rusts: false },
];

const RUSTING_MISSIONS: GameMission[] = [
  { short: "Set up", title: "Set up three tubes", detail: "Tube 1: nail in water and air. Tube 2: nail in boiled water sealed under oil. Tube 3: nail in dry air over calcium chloride.", symbol: "🧫" },
  { short: "Day 2", title: "After two days", detail: "Watch closely — which nail starts to change colour first?", symbol: "📅" },
  { short: "Day 5", title: "After five days", detail: "Only one nail is building up orange-brown rust.", symbol: "🟠" },
  { short: "Day 7", title: "After a week", detail: "Compare all three nails and decide what rusting needs.", symbol: "🔎" },
];

const rustingTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What causes rusting?",
    text: "Iron rusts to form hydrated iron(III) oxide. Three test tubes each hold an iron nail but under different conditions, so we can find out exactly what is needed.",
    mode: "modal",
  },
  {
    title: "The three tubes",
    text: "Tube 1 has water and air. Tube 2 has boiled water (no dissolved oxygen) sealed with oil. Tube 3 has dry air kept dry by calcium chloride.",
    mode: "bubble",
    selector: '[data-experiment-tour="rusting-scene"]',
  },
  {
    title: "Let time pass",
    text: "Run the time-lapse, or step forward a day at a time, and watch which nail rusts.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "The conclusion",
    text: "Only the nail with both water and oxygen rusts. Rusting needs water AND air (oxygen).",
    mode: "bubble",
    selector: '[data-experiment-tour="rusting-scene"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function Nail({ rust }: { rust: number }) {
  const steel = new THREE.Color("#aeb6bd");
  const rustColor = new THREE.Color("#8a4b24");
  const color = steel.clone().lerp(rustColor, THREE.MathUtils.clamp(rust, 0, 1));
  return (
    <group rotation={[0.06, 0, 0.04]}>
      {/* Head */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
        <meshStandardMaterial color={`#${color.getHexString()}`} metalness={0.9 - rust * 0.7} roughness={0.25 + rust * 0.55} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.5, 14]} />
        <meshStandardMaterial color={`#${color.getHexString()}`} metalness={0.9 - rust * 0.7} roughness={0.25 + rust * 0.55} />
      </mesh>
      {/* Point */}
      <mesh position={[0, -0.24, 0]} castShadow>
        <coneGeometry args={[0.022, 0.08, 14]} />
        <meshStandardMaterial color={`#${color.getHexString()}`} metalness={0.9 - rust * 0.7} roughness={0.25 + rust * 0.55} />
      </mesh>
      {/* Rust patches grow with time */}
      {rust > 0.15 &&
        [
          [0.02, 0.14, 0.02],
          [-0.02, -0.02, 0.02],
          [0.015, -0.12, -0.02],
          [-0.018, 0.06, -0.02],
        ].map(([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]} scale={0.4 + rust}>
            <sphereGeometry args={[0.022, 8, 6]} />
            <meshStandardMaterial color="#9a4b1f" transparent opacity={THREE.MathUtils.clamp(rust, 0, 1) * 0.85} roughness={0.95} />
          </mesh>
        ))}
    </group>
  );
}

function TestTube({ kind, rust, x }: { kind: TubeKind; rust: number; x: number }) {
  const tubeHeight = 0.95;
  const base = BENCH_TOP_Y + 0.22;
  const granules = useMemo(
    () =>
      Array.from({ length: 12 }, () => ({
        x: (Math.random() - 0.5) * 0.16,
        z: (Math.random() - 0.5) * 0.16,
        y: 0.06 + Math.random() * 0.08,
      })),
    [],
  );
  return (
    <group position={[x, base, 0]}>
      {/* Glass wall */}
      <mesh position={[0, tubeHeight / 2, 0]}>
        <cylinderGeometry args={[0.12, 0.12, tubeHeight, 28, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={1} transmission={0.94} roughness={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Rounded bottom */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.12, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={1} transmission={0.94} roughness={0.06} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {kind === "waterAir" && (
        <>
          <mesh position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.108, 0.108, 0.66, 24]} />
            <meshStandardMaterial color="#bfe3f5" transparent opacity={0.5} roughness={0.2} />
          </mesh>
          {rust > 0.4 && (
            <mesh position={[0, 0.04, 0]}>
              <cylinderGeometry args={[0.1, 0.09, 0.05, 20]} />
              <meshStandardMaterial color="#b45309" transparent opacity={(rust - 0.4) * 1.1} roughness={0.95} />
            </mesh>
          )}
        </>
      )}
      {kind === "boiledOil" && (
        <>
          <mesh position={[0, 0.32, 0]}>
            <cylinderGeometry args={[0.108, 0.108, 0.6, 24]} />
            <meshStandardMaterial color="#c6eef5" transparent opacity={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.108, 0.108, 0.08, 24]} />
            <meshStandardMaterial color="#f4d06a" transparent opacity={0.75} roughness={0.3} />
          </mesh>
        </>
      )}
      {kind === "dryingAgent" && (
        <>
          {granules.map((granule, index) => (
            <mesh key={index} position={[granule.x, granule.y, granule.z]}>
              <boxGeometry args={[0.03, 0.03, 0.03]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
            </mesh>
          ))}
          {/* Cotton wool plug holding the nail up out of the granules */}
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.1, 12, 10]} />
            <meshStandardMaterial color="#fafafa" roughness={1} />
          </mesh>
        </>
      )}

      {/* Nail — suspended in the tube */}
      <group position={[0, kind === "dryingAgent" ? 0.62 : 0.22, 0]}>
        <Nail rust={rust} />
      </group>
    </group>
  );
}

function TestTubeRack() {
  return (
    <group position={[0, BENCH_TOP_Y, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.12, 0.42]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, -0.16]} castShadow>
        <boxGeometry args={[1.9, 0.5, 0.06]} />
        <meshStandardMaterial color="#7a5636" roughness={0.7} />
      </mesh>
      {TUBES.map((tube) => (
        <mesh key={tube.kind} position={[tube.x, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.13, 0.02, 10, 24]} />
          <meshStandardMaterial color="#8a6440" roughness={0.6} />
        </mesh>
      ))}
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0.24, 0]} castShadow>
          <boxGeometry args={[0.08, 0.36, 0.42]} />
          <meshStandardMaterial color="#7a5636" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function RustingScene({
  day,
  mode,
  isMobile,
  moveVectorRef,
}: {
  day: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {


  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#b45309"
        benchColor="#eef2f4"
        posterA={{
          title: "RUSTING",
          lines: [
            "Rusting needs water AND oxygen (air)",
            "iron + water + oxygen → hydrated iron(III) oxide",
            "Boiled water has no dissolved oxygen",
            "Calcium chloride keeps the air dry",
          ],
        }}
        posterB={{
          title: "PREVENTION",
          lines: ["Painting and greasing keep out air and water", "Galvanising coats iron with zinc", "Alloying makes stainless steel"],
        }}
      >
        <TestTubeRack />
        {TUBES.map((tube) => (
          <group key={tube.kind}>
            <TestTube kind={tube.kind} x={tube.x} rust={tube.rusts ? THREE.MathUtils.clamp(day / DAYS, 0, 1) : 0} />
            <LabLabel position={[tube.x, BENCH_TOP_Y + 1.42, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <div className="w-[92px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
                <div className="text-[8px] font-black uppercase leading-tight text-white">{tube.title}</div>
                <div
                  className={`mt-0.5 text-[7px] font-black uppercase ${
                    tube.rusts && day >= 2 ? "text-orange-300" : "text-emerald-300"
                  }`}
                >
                  {tube.rusts ? (day >= 1 ? "rusting" : "shiny") : "no rust"}
                </div>
              </div>
            </LabLabel>
          </group>
        ))}
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.32} scale={6} blur={2.4} far={3} frames={1} />
      <ObservationCamera focus={[day > 0 ? TUBES[0].x : 0, BENCH_TOP_Y + 0.65, 0]} guided={mode === "doing"} isMobile={isMobile} />
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function RustingPaper({ day, onClose }: { day: number; onClose: () => void }) {
  const observed = day >= DAYS;
  return (
    <ExperimentPaperModal filename={RUSTING_PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Investigating the Conditions Needed for Rusting</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To find out whether water, oxygen, or both are needed for iron to rust.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Three test tubes, three clean iron nails, tap water, boiled (cooled) water, cooking oil, anhydrous calcium chloride, bungs and a test-tube rack.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Tube 1: a nail was left in ordinary tap water so it had both water and air.</li>
          <li>Tube 2: a nail was placed in boiled water (no dissolved oxygen) and a layer of oil was added to keep air out.</li>
          <li>Tube 3: a nail was kept in dry air above anhydrous calcium chloride, which removes water vapour.</li>
          <li>The tubes were left for one week and the nails examined each day.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results {observed ? "(after 7 days)" : `(day ${Math.floor(day)})`}</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Tube</th>
              <th className="border border-slate-400 p-2">Conditions</th>
              <th className="border border-slate-400 p-2">Water?</th>
              <th className="border border-slate-400 p-2">Air (oxygen)?</th>
              <th className="border border-slate-400 p-2">Observation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 text-center">1</td>
              <td className="border border-slate-400 p-2">Water + air</td>
              <td className="border border-slate-400 p-2 text-center">Yes</td>
              <td className="border border-slate-400 p-2 text-center">Yes</td>
              <td className="border border-slate-400 p-2">{observed ? "Nail rusted (orange-brown)" : "Rust developing"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 text-center">2</td>
              <td className="border border-slate-400 p-2">Boiled water + oil</td>
              <td className="border border-slate-400 p-2 text-center">Yes</td>
              <td className="border border-slate-400 p-2 text-center">No</td>
              <td className="border border-slate-400 p-2">No rust — nail stayed shiny</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 text-center">3</td>
              <td className="border border-slate-400 p-2">Dry air + calcium chloride</td>
              <td className="border border-slate-400 p-2 text-center">No</td>
              <td className="border border-slate-400 p-2 text-center">Yes</td>
              <td className="border border-slate-400 p-2">No rust — nail stayed shiny</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Only the nail in tube 1, which had both water and air, rusted. The nails in tubes 2 and 3 did not rust because
          each was missing one condition — oxygen was removed in tube 2 and water was removed in tube 3. Therefore
          rusting of iron requires both water and oxygen.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function RustingOfIronSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: RustingSimProps) {
  const [day, setDay] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const progress = day / DAYS;
  const step = day >= DAYS ? 3 : day >= 5 ? 2 : day >= 2 ? 1 : 0;
  const complete = day >= DAYS;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      setDay(next * DAYS);
      if (next >= 1) {
        setRunning(false);
        setDay(DAYS);
        setDemoActive(false);
    setMode("learning");
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const startTimeLapse = useCallback(() => {
    setDay((current) => {
      startRef.current = performance.now() - (current / DAYS) * RUN_DURATION_MS;
      return current;
    });
    setRunning(true);
  }, []);

  const pause = useCallback(() => setRunning(false), []);

  const stepDay = useCallback((delta: number) => {
    setRunning(false);
    setDemoActive(false);
    setMode("learning");
    setDay((current) => THREE.MathUtils.clamp(Math.round(current) + delta, 0, DAYS));
  }, []);

  const jumpToDay = useCallback((target: number) => {
    setRunning(false);
    setDemoActive(false);
    setMode("learning");
    setDay(THREE.MathUtils.clamp(target, 0, DAYS));
  }, []);

  const resetAll = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setMode("learning");
    setDay(0);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
    setMode("learning");
      setRunning(false);
      return;
    }
    setShowTutorial(false);
    setMode("doing");
    setDemoActive(true);
    setDay(0);
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

  const dayLabel = `Day ${Math.floor(day)}`;
  const status = complete
    ? "After a week only the nail with water and air rusted. Rusting needs both water and oxygen."
    : day >= 2
      ? `${dayLabel}: only the water + air nail is turning orange-brown. The others stay shiny.`
      : day >= 1
        ? `${dayLabel}: rust is just starting on the water + air nail.`
        : "All three nails are shiny. Run the time-lapse to see which one rusts.";

  const observation = complete
    ? "Tube 1 rusted; tubes 2 and 3 did not. Each control removed one condition."
    : "Compare the tubes: one has water + air, one has no air, one has no water.";

  const primaryLabel = running ? "Running…" : complete ? "Reset to Day 0" : day > 0 ? "Continue" : "Start time-lapse";

  const dayControls = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Time</span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {dayLabel}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <button
          onClick={() => stepDay(-1)}
          disabled={day <= 0}
          className="rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black text-slate-200 transition disabled:opacity-40"
        >
          − 1 day
        </button>
        <button
          onClick={() => stepDay(1)}
          disabled={day >= DAYS}
          className="rounded-xl px-2 py-2 text-[10px] font-black text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          + 1 day
        </button>
        <button
          onClick={() => jumpToDay(DAYS)}
          className="rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black text-slate-200 transition"
        >
          Day 7
        </button>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full" style={{ width: `${Math.max(3, progress * 100)}%`, background: ACCENT.base }} />
      </div>
    </div>
  );

  const tubeStatusPanel = (
    <div className="space-y-1.5">
      {TUBES.map((tube) => {
        const rusting = tube.rusts && day >= 1;
        return (
          <div key={tube.kind} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2 text-[10px]">
            <div>
              <div className="font-black text-white">{tube.title}</div>
              <div className="text-[8px] text-slate-500">{tube.sub}</div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-black ${rusting ? "bg-orange-500/20 text-orange-200" : "bg-emerald-500/15 text-emerald-200"}`}>
              {rusting ? "Rusting" : "No rust"}
            </span>
          </div>
        );
      })}
    </div>
  );


return (<ExperimentLabelProvider>
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white">
      {(
        <CombinedScienceHud
          title="Rusting Lab"
          subtitle="iron + water + oxygen → rust"
          symbol="🧫"
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

      <div data-experiment-tour="rusting-scene" className="relative min-h-0 min-w-0 flex-1" style={{marginRight:isMobileViewport ? 0 : 320}}>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.7, 3.22, 5.1], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <RustingScene day={day} mode={mode} isMobile={isMobileViewport} moveVectorRef={moveVectorRef} />
        </Canvas>





        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">
            Drag to look around · scroll to zoom
          </div>
        )}

      </div>

      {!isMobileViewport && (
        <div className="rustingofiron-sidebar absolute bottom-0 right-0 top-14 z-40 w-[320px] overflow-hidden border-l border-slate-200 bg-white"><CombinedScienceObjectiveRail title="Rusting of iron" missions={RUSTING_MISSIONS} step={step} running={running} progress={progress} complete={complete} primaryLabel={primaryLabel} onPrimary={running ? pause : startTimeLapse} onReset={resetAll} onDemo={toggleDemo} demoActive={demoActive} observation={observation} sections={[{id:"setup",label:"Time-lapse",content:dayControls},{id:"results",label:"Tube observations",content:tubeStatusPanel}]}/></div>
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "play", label: running ? "Pause" : "Time-lapse", onClick: running ? pause : startTimeLapse, tone: running ? "red" : "green" },
            { id: "next", label: "+1 day", onClick: () => stepDay(1), disabled: day >= DAYS, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "time", label: "Time", value: dayLabel, content: dayControls },
            { id: "tubes", label: "Tubes", value: complete ? "1 rusted" : `${Math.floor(day)}d`, content: tubeStatusPanel },
          ]}
        />
      )}


      {showPaper && <RustingPaper day={day} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={rustingTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  </ExperimentLabelProvider>);
}

// This practical owns its room, lighting and observation camera.
const BENCH_TOP_Y = 1.36;
function LabLighting() {
 const target=useMemo(()=>{const value=new THREE.Object3D();value.position.set(0,BENCH_TOP_Y,0);return value;},[]);
 return <><primitive object={target}/><ambientLight intensity={0.3}/><hemisphereLight args={["#c1cfdd","#26303a",0.5]}/><spotLight position={[0,6.5,0.8]} target={target} intensity={125} distance={13} decay={2} angle={0.72} penumbra={0.85} color="#fff5e6" castShadow shadow-mapSize={[2048,2048]} shadow-normalBias={0.018}/><directionalLight position={[-4,6,-3]} intensity={0.7} color="#c5dfff"/></>;
}
function LabRoom({ children, posterA, posterB }: { children: ReactNode; accentHex?: string; benchColor?: string; posterA: { title: string; lines: string[] }; posterB: { title: string; lines: string[] } }) {
  return <group>
    <color attach="background" args={["#e5e8dc"]} />
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[32, 32]} /><meshStandardMaterial color="#303a43" roughness={0.92} /></mesh>
    <mesh position={[0, 9, -16]} receiveShadow><boxGeometry args={[32, 18, 0.15]} /><meshStandardMaterial color="#e5e8dc" roughness={0.85} /></mesh>
    <mesh position={[-16, 9, 0]}><boxGeometry args={[0.15, 18, 32]} /><meshStandardMaterial color="#e5e8dc" /></mesh>
    <mesh position={[16, 9, 0]}><boxGeometry args={[0.15, 18, 32]} /><meshStandardMaterial color="#3e4b56" /></mesh>
    <mesh position={[0, 9, 16]}><boxGeometry args={[32, 18, 0.15]} /><meshStandardMaterial color="#3e4b56" /></mesh>
    <mesh position={[0, 18, 0]}><boxGeometry args={[32, 0.15, 32]} /><meshStandardMaterial color="#303b45" /></mesh>
    <mesh position={[0, BENCH_TOP_Y - 0.07, 0]} castShadow receiveShadow><boxGeometry args={[7.2, 0.14, 3.6]} /><meshStandardMaterial color="#47483f" roughness={0.36} metalness={0.15} /></mesh>
    {[-2.8, 2.8].map(x => <group key={x} position={[x, 0.62, 0]}><mesh castShadow><boxGeometry args={[1.25, 1.24, 3.1]} /><meshStandardMaterial color="#719080" roughness={0.5} /></mesh>{[0.35, 0.75, 1.05].map(y => <mesh key={y} position={[0, y - 0.62, 1.57]}><boxGeometry args={[0.55, 0.025, 0.045]} /><meshStandardMaterial color="#aab4ba" metalness={0.85} roughness={0.25} /></mesh>)}</group>)}
    <mesh position={[-3.5, 3.2, -15.88]}><boxGeometry args={[3.3, 2.1, 0.08]} /><meshStandardMaterial color="#d7f1ff" emissive="#cde9fa" emissiveIntensity={0.35} roughness={0.15} /></mesh>
    {[-4.55, -3.5, -2.45].map(x => <mesh key={x} position={[x, 3.2, -15.79]}><boxGeometry args={[0.045, 2.12, 0.04]} /><meshStandardMaterial color="#f8fafc" /></mesh>)}
    {[posterA, posterB].map((poster, i) => <LabLabel key={poster.title} position={[i ? 3.5 : 0.3, 3.2, -15.85]} transform distanceFactor={5}><div style={{width: 210, background: '#faf9f5', borderTop: '8px solid #719080', padding: 16, color: '#26343d', fontSize: 12}}><strong>{poster.title}</strong>{poster.lines.map(line => <p key={line} style={{marginTop: 9}}>{line}</p>)}</div></LabLabel>)}
<group position={[2.3,BENCH_TOP_Y,-0.5]}>{[0,1,2].map(i => <mesh key={i} position={[0,0.02+i*0.045,0]} rotation={[0,i*0.08,0]}><boxGeometry args={[0.65,0.035,0.85]}/><meshStandardMaterial color={i===2 ? '#ddd7bf' : '#7c8261'} roughness={0.9}/></mesh>)}</group>
    <mesh position={[0,6.3,0.4]}><boxGeometry args={[2.6,0.08,0.8]}/><meshStandardMaterial color="#f4eee0" emissive="#fff0ce" emissiveIntensity={1.4}/></mesh>
    {[-8,0,8].map(x=><mesh key={`wall-panel-${x}`} position={[x,9,-15.86]}><boxGeometry args={[0.07,16.9,0.025]}/><meshStandardMaterial color="#62727e" roughness={0.78}/></mesh>)}
    <mesh position={[0,1.05,-15.85]}><boxGeometry args={[32,0.065,0.03]}/><meshStandardMaterial color="#82949e" roughness={0.5}/></mesh>
    {children}
  </group>;
}
function LabTag({ children, position, distanceFactor = 7 }: { children: ReactNode; position: [number, number, number]; tone?: string; distanceFactor?: number }) {
 return <LabLabel position={position} center distanceFactor={distanceFactor} style={{pointerEvents: 'none'}}><div className="whitespace-nowrap rounded-lg border border-slate-200 bg-white/95 px-3 py-1 text-xs font-bold text-slate-800 shadow">{children}</div></LabLabel>;
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
  const distance = Math.min(7.5, (guided ? 2.5 : 5.1) * Math.max(1, 1.15 / aspect));
  destination.current.copy(target.current).add(new THREE.Vector3(distance * 0.38, distance * 0.48, distance));
  camera.position.lerp(destination.current, blend);
  if (!guided && camera.position.distanceTo(destination.current) < 0.02) returning.current = false;
  controls.current.update();
 });
 return <OrbitControls ref={controls} makeDefault enabled={!guided} onStart={() => { returning.current = false; }} enableDamping enablePan={false} minDistance={1.5} maxDistance={10} maxPolarAngle={1.48} />;
}
function CombinedScienceHud({ title, onBack, onRequestPaper, onRequestHowTo, demoActive, onDemo, onModeChange }: { title: string; subtitle?: string; symbol?: string; accent?: unknown; mode: string; modeDisabled?: boolean; badges?: number; onBack?: () => void; onRequestPaper?: () => void; onRequestHowTo?: () => void; demoActive: boolean; onDemo: () => void; onModeChange: (mode: "learning" | "doing") => void }) {
 return <div className="relative z-[80] flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 text-slate-900">
 <button onClick={onBack} aria-label="Back to experiments" className="rounded-lg px-3 py-2">←</button><h1 className="min-w-0 flex-1 text-sm font-bold">{title}</h1>
 <div className="flex rounded-xl bg-slate-100 p-1"><button aria-pressed={demoActive} onClick={() => { if (!demoActive) onDemo(); }} className={`rounded-lg px-4 py-2 text-xs font-bold ${demoActive ? 'bg-sky-500 text-white' : ''}`}>See</button><button aria-pressed={!demoActive} onClick={() => { if (demoActive) onDemo(); onModeChange("learning"); }} className={`rounded-lg px-4 py-2 text-xs font-bold ${!demoActive ? 'bg-emerald-500 text-white' : ''}`}>Learn</button></div>
 <button onClick={onRequestHowTo} className="px-2 text-xs">Guide</button><button onClick={onRequestPaper} className="px-2 text-xs">Paper</button></div>;
}
