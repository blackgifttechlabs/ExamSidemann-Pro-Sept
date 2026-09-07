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
import { BarMagnet, PlottingCompass } from "../../common/MagnetApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface MagnetisationSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.indigo;
const PAPER_FILENAME = "magnetising-a-steel-bar.html";

type Method = "stroking" | "solenoid";
type Core = "steel" | "iron";
/** Most paper clips a fully magnetised bar will hold in a chain. */
const MAX_CLIPS = 8;
const BAR_LENGTH = 1.15;
const BAR_WIDTH = 0.16;

const MAGNETISE_MISSIONS: GameMission[] = [
  {
    short: "Check",
    title: "Start with unmagnetised steel",
    detail: "Hold the bare steel bar over the paper clips. It picks up none of them, so it is not yet a magnet.",
    symbol: "🔩",
  },
  {
    short: "Magnetise",
    title: "Stroke it, or use a solenoid",
    detail: "Stroke the bar with one pole of a permanent magnet, always the same way round, or place it in a solenoid and switch on a direct current.",
    symbol: "🧲",
  },
  {
    short: "Test",
    title: "Count the paper clips",
    detail: "Dip the end of the bar into the clips. The more clips it holds, the more strongly it has been magnetised.",
    symbol: "📎",
  },
  {
    short: "Poles",
    title: "Find the poles, then destroy them",
    detail: "Use a plotting compass to identify N and S, then demagnetise the bar with alternating current, or by heating and hammering it.",
    symbol: "🧭",
  },
];

const magnetiseTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Making a magnet",
    text: "A piece of steel becomes a magnet when the tiny magnetic regions inside it — its domains — are turned so that they all point the same way.",
    mode: "modal",
  },
  {
    title: "The bar and the domains",
    text: "The arrows drawn inside the bar are its domains. In unmagnetised steel they point in all directions and cancel out; as you magnetise the bar they line up.",
    mode: "bubble",
    selector: '[data-experiment-tour="magnetise-scene"]',
  },
  {
    title: "Two methods",
    text: "Stroking uses a permanent magnet and needs many strokes. A solenoid carrying a direct current does it in one go, and is the method used in industry.",
    mode: "bubble",
    selector: '[data-experiment-tour="magnetise-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Testing and undoing it",
    text: "Count the paper clips the bar can hold to compare strengths. Heating, hammering, or an alternating current all jumble the domains up again.",
    mode: "bubble",
    selector: '[data-experiment-tour="magnetise-results"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ Science */

/**
 * Domain arrows inside the bar. At zero magnetisation they point every which
 * way; as the bar is magnetised they swing round to lie along it.
 */
function domainAngles(count: number) {
  return Array.from({ length: count }, (_, index) => Math.sin(index * 12.9898) * Math.PI);
}

/* ------------------------------------------------------------------ 3D bits */

function SteelBar({
  magnetisation,
  polarityFlipped,
  showDomains,
}: {
  magnetisation: number;
  polarityFlipped: boolean;
  showDomains: boolean;
}) {
  const rows = 2;
  const columns = 7;
  const scattered = useMemo(() => domainAngles(rows * columns), []);
  const strength = THREE.MathUtils.clamp(magnetisation, 0, 1);

  return (
    <group>
      <BarMagnet
        magnet={{ x: 0, z: 0, angle: 0, length: BAR_LENGTH, strength: polarityFlipped ? -1 : 1 }}
        y={0.09}
        magnetisation={strength}
      />

      {showDomains && (
        <group position={[0, 0.175, 0]}>
          {scattered.map((scatterAngle, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);
            const x = -BAR_LENGTH / 2 + 0.1 + column * ((BAR_LENGTH - 0.2) / (columns - 1));
            const z = -BAR_WIDTH / 4 + row * (BAR_WIDTH / 2);
            /** Aligned direction is along the bar, reversed if the poles are the other way round. */
            const aligned = polarityFlipped ? Math.PI : 0;
            const angle = THREE.MathUtils.lerp(scatterAngle, aligned, strength);
            return (
              <group key={index} position={[x, 0, z]} rotation={[0, angle, 0]}>
                <mesh>
                  <boxGeometry args={[0.075, 0.006, 0.012]} />
                  <meshBasicMaterial color={strength > 0.6 ? "#818cf8" : "#94a3b8"} />
                </mesh>
                <mesh position={[0.05, 0, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.016, 0.038, 3]} />
                  <meshBasicMaterial color={strength > 0.6 ? "#818cf8" : "#94a3b8"} />
                </mesh>
              </group>
            );
          })}
          <Html position={[0, 0.08, -0.28]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded border border-indigo-300/30 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-indigo-200">
              domains {strength > 0.9 ? "fully lined up" : strength > 0.35 ? "lining up" : "jumbled"}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

/** The permanent magnet used for stroking, sliding along the bar. */
function StrokingMagnet({ progress, active }: { progress: number; active: boolean }) {
  const x = THREE.MathUtils.lerp(-BAR_LENGTH / 2 - 0.15, BAR_LENGTH / 2 + 0.15, progress);
  /** Lifted high on the return so the stroke is only ever in one direction. */
  const lift = active ? 0.24 : 0.62;

  return (
    <group position={[x, lift, 0]} rotation={[0, 0, -0.32]}>
      <BarMagnet magnet={{ x: 0, z: 0, angle: 0, length: 0.6 }} y={0} />
      <Html position={[0, 0.2, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
          stroking magnet
        </div>
      </Html>
    </group>
  );
}

/** The solenoid: a coil of insulated copper wire on a former, with the bar inside. */
function Solenoid({ current, alternating }: { current: number; alternating: boolean }) {
  const turns = 22;
  const glow = THREE.MathUtils.clamp(current / 4, 0, 1);
  const coilRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!coilRef.current) return;
    /** Alternating current makes the whole coil shimmer as the field reverses. */
    if (alternating && current > 0) {
      coilRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 26) * 0.012);
    } else {
      coilRef.current.scale.setScalar(1);
    }
  });

  return (
    <group>
      {/* Cardboard former */}
      <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.19, 0.19, BAR_LENGTH * 0.86, 24, 1, true]} />
        <meshStandardMaterial color="#d6bd94" roughness={0.86} side={THREE.DoubleSide} transparent opacity={0.35} />
      </mesh>

      <group ref={coilRef}>
        {Array.from({ length: turns }, (_, index) => {
          const x = -BAR_LENGTH * 0.41 + (index / (turns - 1)) * BAR_LENGTH * 0.82;
          return (
            <mesh key={index} position={[x, 0.09, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <torusGeometry args={[0.2, 0.017, 8, 26]} />
              <meshStandardMaterial
                color="#b45309"
                metalness={0.82}
                roughness={0.3}
                emissive={new THREE.Color("#f97316")}
                emissiveIntensity={glow * 0.45}
              />
            </mesh>
          );
        })}
      </group>

      {/* Leads down to the supply */}
      <mesh position={[-BAR_LENGTH * 0.44, 0.02, 0.24]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.55, 10]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.6} />
      </mesh>
      <mesh position={[BAR_LENGTH * 0.44, 0.02, 0.24]} rotation={[0.4, 0, 0]}>
        <cylinderGeometry args={[0.016, 0.016, 0.55, 10]} />
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </mesh>

      <Html position={[0, 0.36, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap rounded border px-1.5 py-0.5 text-[7px] font-black uppercase"
          style={
            current > 0
              ? { borderColor: "rgba(129,140,248,0.4)", background: "rgba(2,6,23,0.92)", color: "#c7d2fe" }
              : { borderColor: "rgba(148,163,184,0.3)", background: "rgba(2,6,23,0.9)", color: "#94a3b8" }
          }
        >
          {current > 0 ? `${alternating ? "a.c." : "d.c."} ${current.toFixed(1)} A` : "supply off"}
        </div>
      </Html>
    </group>
  );
}

/** A hanging chain of paper clips — the test of how strong the magnet is. */
function PaperClipChain({ count, testing }: { count: number; testing: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = testing ? Math.sin(state.clock.elapsedTime * 3.2) * 0.05 : 0;
  });

  return (
    <group position={[BAR_LENGTH / 2 - 0.04, 0.02, 0]}>
      <group ref={groupRef}>
        {Array.from({ length: count }, (_, index) => (
          <group key={index} position={[0, -index * 0.11, 0]} rotation={[Math.PI / 2, 0, index * 0.35]}>
            <mesh castShadow>
              <torusGeometry args={[0.05, 0.008, 8, 20]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.86} roughness={0.24} />
            </mesh>
            <mesh position={[0.02, 0, 0.012]} castShadow>
              <torusGeometry args={[0.034, 0.008, 8, 20]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.86} roughness={0.24} />
            </mesh>
          </group>
        ))}
      </group>
      {count > 0 && (
        <Html position={[0.3, -count * 0.055, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-lg border border-indigo-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
            <div className="text-[10px] font-black text-white">{count}</div>
            <div className="text-[7px] font-black uppercase text-indigo-200">clips held</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/** A dish of loose paper clips to dip the bar into. */
function ClipDish({ remaining }: { remaining: number }) {
  return (
    <group position={[1.35, 0.02, 0.5]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.26, 0.06, 26]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
      {Array.from({ length: remaining }, (_, index) => (
        <group
          key={index}
          position={[Math.cos(index * 2.4) * 0.13, 0.06, Math.sin(index * 2.4) * 0.13]}
          rotation={[Math.PI / 2, 0, index * 1.1]}
        >
          <mesh>
            <torusGeometry args={[0.05, 0.008, 6, 18]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.26} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function MagnetiseScene({
  method,
  core,
  magnetisation,
  polarityFlipped,
  showDomains,
  strokeProgress,
  stroking,
  current,
  alternating,
  clips,
  testing,
  showCompass,
  mode,
  isMobile,
  moveVectorRef,
}: {
  method: Method;
  core: Core;
  magnetisation: number;
  polarityFlipped: boolean;
  showDomains: boolean;
  strokeProgress: number;
  stroking: boolean;
  current: number;
  alternating: boolean;
  clips: number;
  testing: boolean;
  showCompass: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.1, 3.15, 2.9] : [0.2, 2.85, 2.4];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.1, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 47;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  /** A compass at the far end of the bar shows which pole is which. */
  const compassAngle = magnetisation < 0.12 ? -Math.PI / 2 : polarityFlipped ? Math.PI : 0;

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#4f46e5"
        benchColor="#eceef4"
        posterA={{
          title: "MAGNETISATION",
          lines: [
            "Stroking: one pole, one direction, many times",
            "Solenoid: steel bar inside, switch on d.c.",
            "Last end stroked = opposite pole to the stroker",
            "Domains line up when magnetised",
          ],
        }}
        posterB={{
          title: "DEMAGNETISING",
          lines: ["Alternating current, then withdraw slowly", "Heat the magnet strongly", "Hammer it while lying E–W"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {/* Wooden work surface */}
          <mesh position={[0, 0.01, 0]} receiveShadow>
            <boxGeometry args={[3.2, 0.02, 1.5]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.86} />
          </mesh>

          <SteelBar magnetisation={magnetisation} polarityFlipped={polarityFlipped} showDomains={showDomains} />

          {method === "stroking" ? (
            <StrokingMagnet progress={strokeProgress} active={stroking} />
          ) : (
            <Solenoid current={current} alternating={alternating} />
          )}

          <PaperClipChain count={clips} testing={testing} />
          <ClipDish remaining={Math.max(0, MAX_CLIPS - clips)} />

          {showCompass && (
            <PlottingCompass position={[-BAR_LENGTH / 2 - 0.32, 0]} angle={compassAngle} y={0.03} highlight />
          )}

          <Html position={[0, 0.62, -0.55]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-lg border border-white/15 bg-slate-950/90 px-2 py-1 text-[8px] font-black uppercase text-slate-200">
              {core === "steel" ? "hard steel bar" : "soft iron bar"}
            </div>
          </Html>
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.1, 0]} minDistance={1.4} maxDistance={8} maxPolarAngle={1.46} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function MagnetisePaper({
  strokes,
  clipsByStroke,
  onClose,
}: {
  strokes: number;
  clipsByStroke: { strokes: number; clips: number }[];
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Magnetising a Steel Bar by Stroking and by a Solenoid</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To magnetise a steel bar by the single-touch stroking method and by passing a direct current through a solenoid, to find the poles produced, and to demagnetise the bar again.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>An unmagnetised steel bar, a soft iron bar, a strong permanent bar magnet, a solenoid of insulated copper wire, a low-voltage d.c. supply, an a.c. supply, a plotting compass, a rheostat, an ammeter and a box of steel paper clips.</p>
        <h2 className="mt-5 font-bold uppercase">Method A — single-touch stroking</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The steel bar was laid on the bench and dipped into the paper clips to show that it picked up none of them.</li>
          <li>One pole of the permanent magnet was placed at one end of the bar and drawn along it to the other end.</li>
          <li>The magnet was then lifted well clear, carried back through the air, and the stroke repeated from the same end — always in the same direction and always with the same pole.</li>
          <li>After every few strokes the bar was dipped into the paper clips and the number it held was counted.</li>
          <li>The strokes were continued until the number of clips stopped increasing, showing that the bar was saturated.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Method B — the solenoid</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A demagnetised steel bar was placed inside a solenoid connected in series with a rheostat, an ammeter and a low-voltage d.c. supply.</li>
          <li>The current was switched on for a few seconds and then switched off, and the bar was removed and tested with the paper clips.</li>
          <li>The polarity was found with a plotting compass and checked against the end rule: looking at the end of the solenoid, the end at which the current flows anticlockwise is a north pole.</li>
          <li>The experiment was repeated with a soft iron bar in place of the steel bar.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Number of strokes</th>
              <th className="border border-slate-400 p-2">Paper clips held</th>
            </tr>
          </thead>
          <tbody>
            {(clipsByStroke.length ? clipsByStroke : [{ strokes: 0, clips: 0 }]).map((row) => (
              <tr key={row.strokes}>
                <td className="border border-slate-400 p-2 text-center">{row.strokes}</td>
                <td className="border border-slate-400 p-2 text-center">{row.clips}</td>
              </tr>
            ))}
            {!clipsByStroke.length &&
              [0, 1, 2, 3].map((row) => (
                <tr key={`blank-${row}`}>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>
        <p className="mt-2">{strokes > 0 ? `The bar was given ${strokes} strokes in total.` : ""}</p>
        <h2 className="mt-5 font-bold uppercase">Observations</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The bare steel bar picked up no paper clips at all.</li>
          <li>The number of clips held rose steadily as more strokes were given, and then stopped rising — the bar had reached saturation.</li>
          <li>The end of the bar at which the stroking pole was lifted off gained the polarity opposite to that of the stroking pole.</li>
          <li>The solenoid magnetised the bar in a few seconds. The steel bar kept its magnetism when the current was switched off; the soft iron bar lost nearly all of its magnetism at once.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Demagnetising</h2>
        <p>
          The bar was placed inside the solenoid, an alternating current was switched on, and the bar was then withdrawn
          slowly from the coil while it lay east–west. The rapidly reversing field jumbles the domains, and the field it
          feels dies away gradually as the bar is drawn out, leaving it unmagnetised. Heating the magnet strongly, or
          hammering it while it lies east–west, has the same effect.
        </p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          A steel bar can be magnetised by stroking it repeatedly with one pole of a permanent magnet, always in the same
          direction, or much more quickly by placing it inside a solenoid carrying a direct current. Inside the bar are
          regions called domains, each of which behaves like a tiny magnet. In unmagnetised steel these point in all
          directions and cancel out; magnetising turns them so that they all point the same way, and the bar behaves as a
          magnet with a north pole at one end and a south pole at the other. Once every domain is lined up the bar is
          saturated and cannot be made any stronger.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The stroking magnet was lifted high on the return journey; stroking to and fro would undo the magnetism just produced.</li>
          <li>The same pole of the stroking magnet was used for every stroke.</li>
          <li>The current in the solenoid was switched on only briefly, since the coil warms up quickly.</li>
          <li>The bar was tested with the same box of clips each time, so that the comparison was fair.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function MagnetisationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MagnetisationSimProps) {
  const [method, setMethod] = useState<Method>("stroking");
  const [core, setCore] = useState<Core>("steel");
  const [strokes, setStrokes] = useState(0);
  const [magnetisation, setMagnetisation] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState(0);
  const [stroking, setStroking] = useState(false);
  const [current, setCurrent] = useState(0);
  const [alternating, setAlternating] = useState(false);
  const [polarityFlipped, setPolarityFlipped] = useState(false);
  const [showDomains, setShowDomains] = useState(true);
  const [showCompass, setShowCompass] = useState(false);
  const [clips, setClips] = useState(0);
  const [testing, setTesting] = useState(false);
  const [readings, setReadings] = useState<{ strokes: number; clips: number }[]>([]);
  const [demagnetised, setDemagnetised] = useState(false);
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

  /** Each stroke lines up a few more domains, with diminishing returns. */
  const stroke = useCallback(() => {
    labSounds.play("magnetSlide", { volume: 0.45, throttleMs: 150 });
    if (stroking) return;
    setStroking(true);
    setClips(0);
    const frames = 16;
    for (let index = 1; index <= frames; index += 1) {
      timers.current.push(window.setTimeout(() => setStrokeProgress(index / frames), index * 34));
    }
    timers.current.push(
      window.setTimeout(() => {
        setStrokes((current) => {
          const next = current + 1;
          setMagnetisation(1 - Math.exp(-next / 4.2));
          return next;
        });
        setDemagnetised(false);
        setStroking(false);
        setStrokeProgress(0);
      }, frames * 34 + 120),
    );
  }, [stroking]);

  /** The solenoid magnetises the bar as soon as a direct current flows. */
  const applyCurrent = useCallback(
    (value: number) => {
      setCurrent(value);
      if (alternating) return;
      if (value <= 0) {
        /** Soft iron loses almost everything the moment the current stops. */
        if (core === "iron") setMagnetisation((existing) => existing * 0.08);
        return;
      }
      setDemagnetised(false);
      setMagnetisation(Math.min(1, value / 3.2));
      setClips(0);
    },
    [alternating, core],
  );

  /** Dipping the bar into the clips: the chain builds up one clip at a time. */
  const testStrength = useCallback(() => {
    clearTimers();
    const held = Math.round(magnetisation * MAX_CLIPS);
    setTesting(true);
    setClips(0);
    for (let index = 1; index <= held; index += 1) {
      timers.current.push(window.setTimeout(() => setClips(index), index * 150));
    }
    timers.current.push(
      window.setTimeout(() => {
        setTesting(false);
        setReadings((existing) => {
          if (existing.some((row) => row.strokes === strokes)) return existing;
          return [...existing, { strokes, clips: held }].sort((a, b) => a.strokes - b.strokes);
        });
      }, held * 150 + 320),
    );
  }, [clearTimers, magnetisation, strokes]);

  /** Alternating current, withdrawn slowly, leaves the domains jumbled again. */
  const demagnetise = useCallback(() => {
    clearTimers();
    setAlternating(true);
    setCurrent(2.5);
    setClips(0);
    const frames = 22;
    for (let index = 1; index <= frames; index += 1) {
      timers.current.push(
        window.setTimeout(() => setMagnetisation((existing) => existing * (1 - index / frames) ** 0.6), index * 70),
      );
    }
    timers.current.push(
      window.setTimeout(() => {
        setMagnetisation(0);
        setCurrent(0);
        setAlternating(false);
        setStrokes(0);
        setDemagnetised(true);
      }, frames * 70 + 220),
    );
  }, [clearTimers]);

  const resetAll = useCallback(() => {
    clearTimers();
    setMethod("stroking");
    setCore("steel");
    setStrokes(0);
    setMagnetisation(0);
    setStrokeProgress(0);
    setStroking(false);
    setCurrent(0);
    setAlternating(false);
    setPolarityFlipped(false);
    setShowCompass(false);
    setClips(0);
    setTesting(false);
    setReadings([]);
    setDemagnetised(false);
    setDemoActive(false);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      setStroking(false);
      setTesting(false);
      return;
    }
    setDemoActive(true);
    setMethod("stroking");
    setStrokes(0);
    setMagnetisation(0);
    setReadings([]);
    setClips(0);
    setDemagnetised(false);

    /** Ten strokes, testing the strength every few strokes. */
    let elapsed = 300;
    for (let strokeNumber = 1; strokeNumber <= 10; strokeNumber += 1) {
      const start = elapsed;
      timers.current.push(window.setTimeout(() => setStroking(true), start));
      for (let frame = 1; frame <= 10; frame += 1) {
        timers.current.push(window.setTimeout(() => setStrokeProgress(frame / 10), start + frame * 30));
      }
      timers.current.push(
        window.setTimeout(() => {
          setStroking(false);
          setStrokeProgress(0);
          setStrokes(strokeNumber);
          setMagnetisation(1 - Math.exp(-strokeNumber / 4.2));
        }, start + 340),
      );
      elapsed += 420;

      if (strokeNumber % 5 === 0) {
        const heldAt = Math.round((1 - Math.exp(-strokeNumber / 4.2)) * MAX_CLIPS);
        const testStart = elapsed;
        for (let index = 1; index <= heldAt; index += 1) {
          timers.current.push(window.setTimeout(() => setClips(index), testStart + index * 90));
        }
        timers.current.push(
          window.setTimeout(() => {
            setReadings((existing) =>
              existing.some((row) => row.strokes === strokeNumber)
                ? existing
                : [...existing, { strokes: strokeNumber, clips: heldAt }].sort((a, b) => a.strokes - b.strokes),
            );
          }, testStart + heldAt * 90 + 150),
        );
        elapsed += heldAt * 90 + 600;
      }
    }

    timers.current.push(window.setTimeout(() => setShowCompass(true), elapsed));
    timers.current.push(window.setTimeout(() => setDemoActive(false), elapsed + 900));
  }, [clearTimers, demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const saturated = magnetisation > 0.9;
  const complete = readings.length >= 2 && saturated && (showCompass || demagnetised);
  const step = complete ? 3 : saturated || readings.length >= 2 ? 3 : readings.length >= 1 ? 2 : magnetisation > 0.05 ? 1 : 0;
  const progress = Math.min(1, magnetisation);

  const status = demagnetised
    ? "Demagnetised. The alternating field, dying away as the bar was drawn out of the coil, has jumbled the domains again."
    : testing
      ? "Dipping the bar into the clips — count how many hang from the end in a chain."
      : saturated
        ? `Saturated after ${strokes || "a few"} strokes. Every domain is lined up, so no amount of extra stroking makes it stronger.`
        : magnetisation > 0.05
          ? `Magnetisation ${(magnetisation * 100).toFixed(0)}%. Keep going — always the same pole, always the same direction.`
          : method === "stroking"
            ? "Stroke the bar with one pole of the permanent magnet, lifting it well clear on the way back."
            : "Place the bar inside the solenoid and turn up the direct current.";

  const observation = saturated
    ? "The bar picks up a chain of clips at each end, and a plotting compass shows a north pole at one end and a south pole at the other."
    : core === "iron" && method === "solenoid"
      ? "Soft iron magnetises easily but loses nearly all of it the moment the current stops — that is why electromagnet cores are made of it."
      : "Each stroke lines up a few more domains, so the bar picks up a few more clips.";

  const primaryLabel = demagnetised
    ? "Start magnetising again"
    : method === "stroking"
      ? stroking
        ? "Stroking…"
        : `Stroke the bar (${strokes})`
      : current > 0
        ? "Switch the current off"
        : "Switch the current on";

  const onPrimary = useCallback(() => {
    if (method === "stroking") {
      stroke();
      return;
    }
    applyCurrent(current > 0 ? 0 : 3);
  }, [applyCurrent, current, method, stroke]);

  const methodPanel = (
    <div data-experiment-tour="magnetise-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Method</span>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(["stroking", "solenoid"] as Method[]).map((item) => (
          <button
            key={item}
            onClick={() => {
              setMethod(item);
              setCurrent(0);
              setClips(0);
            }}
            disabled={demoActive}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              method === item
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item === "stroking" ? "✋ Stroking" : "🔌 Solenoid"}
          </button>
        ))}
      </div>

      {method === "solenoid" && (
        <>
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Current</span>
            <span className="text-sm font-black" style={{ color: ACCENT.text }}>
              {current.toFixed(1)} A
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={4}
            step={0.5}
            value={current}
            onChange={(event) => applyCurrent(Number(event.target.value))}
            disabled={demoActive}
            className="mt-1.5 w-full accent-indigo-400"
          />
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {(["steel", "iron"] as Core[]).map((item) => (
              <button
                key={item}
                onClick={() => {
                  setCore(item);
                  setMagnetisation(0);
                  setClips(0);
                  setStrokes(0);
                }}
                disabled={demoActive}
                className="rounded-xl px-2 py-1.5 text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
                style={
                  core === item
                    ? { background: ACCENT.soft, color: ACCENT.text, border: `1px solid ${ACCENT.ring}` }
                    : { background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {item === "steel" ? "Hard steel core" : "Soft iron core"}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Strokes</div>
          <div className="text-sm font-black text-white">{strokes}</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            Magnetised
          </div>
          <div className="text-sm font-black text-white">{(magnetisation * 100).toFixed(0)}%</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Clips</div>
          <div className="text-sm font-black text-white">{clips}</div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <button
          onClick={() => setShowDomains((value) => !value)}
          className="rounded-xl border border-white/10 px-1 py-1.5 text-[8px] font-black uppercase tracking-wide"
          style={showDomains ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          Domains
        </button>
        <button
          onClick={() => setShowCompass((value) => !value)}
          className="rounded-xl border border-white/10 px-1 py-1.5 text-[8px] font-black uppercase tracking-wide"
          style={showCompass ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          Compass
        </button>
        <button
          onClick={() => setPolarityFlipped((value) => !value)}
          disabled={demoActive || magnetisation < 0.1}
          className="rounded-xl border border-white/10 px-1 py-1.5 text-[8px] font-black uppercase tracking-wide disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          Reverse
        </button>
      </div>
    </div>
  );

  const resultsPanel = (
    <div data-experiment-tour="magnetise-results" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Strength test</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {clips}/{MAX_CLIPS} clips
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Dip the bar into the clips to measure how strong it is.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">Strokes</th>
              <th className="py-0.5 text-right font-black uppercase">Clips held</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((row) => (
              <tr key={row.strokes} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{row.strokes}</td>
                <td className="py-1 text-right font-black">{row.clips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={testStrength}
          disabled={testing || demoActive}
          className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          Test with clips
        </button>
        <button
          onClick={demagnetise}
          disabled={demoActive || magnetisation < 0.05}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
        >
          Demagnetise
        </button>
      </div>
    </div>
  );

  const theoryPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Rules to quote</span>
      <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-300">
        <p>
          <span className="text-white">Stroking: </span>the end where the stroking pole is lifted off takes the opposite polarity to the stroking pole.
        </p>
        <p>
          <span className="text-white">Solenoid end rule: </span>look at the end of the coil — a<span className="text-white">N</span>ticlockwise current means a <span className="text-white">N</span>orth pole; clock<span className="text-white">W</span>ise means a South pole.
        </p>
        <p>
          <span className="text-white">Saturation: </span>once every domain is lined up the magnet cannot be made stronger.
        </p>
        <p>
          <span className="text-white">Demagnetising: </span>a.c. in a solenoid while withdrawing the bar slowly, strong heating, or hammering it lying east–west.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Magnetisation Bench"
          subtitle="Stroking, solenoids, saturation and domains"
          symbol="🧲"
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

      <div data-experiment-tour="magnetise-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.2, 2.85, 2.4], fov: 47, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <MagnetiseScene
            method={method}
            core={core}
            magnetisation={magnetisation}
            polarityFlipped={polarityFlipped}
            showDomains={showDomains}
            strokeProgress={strokeProgress}
            stroking={stroking}
            current={current}
            alternating={alternating}
            clips={clips}
            testing={testing}
            showCompass={showCompass}
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
            emoji="🧲"
            cornerEmoji="📎"
            status={status}
            running={demoActive || stroking || testing}
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
          title="Making a Magnet"
          tagline="Stroking, solenoids, saturation and domains"
          missions={MAGNETISE_MISSIONS}
          step={step}
          running={demoActive || stroking || testing}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={method === "stroking" ? "✋" : "🔌"}
          onPrimary={onPrimary}
          primaryDisabled={stroking || demoActive}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "method", label: "Method", value: method === "stroking" ? `${strokes} strokes` : `${current.toFixed(1)} A`, content: methodPanel },
            { id: "results", label: "Strength", value: `${clips} clips`, content: resultsPanel },
            { id: "rules", label: "Rules", content: theoryPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: method === "stroking" ? "Stroke" : "Power", onClick: onPrimary, disabled: stroking || demoActive, tone: "orange" },
            { id: "test", label: "Clips", onClick: testStrength, disabled: testing || demoActive, tone: "green" },
            { id: "demag", label: "Demag", onClick: demagnetise, disabled: demoActive || magnetisation < 0.05, tone: "red" },
          ]}
          panels={[
            { id: "method", label: "Method", value: method === "stroking" ? `${strokes} strokes` : `${current.toFixed(1)} A`, content: methodPanel },
            { id: "results", label: "Strength", value: `${clips} clips`, content: resultsPanel },
            { id: "rules", label: "Rules", content: theoryPanel },
          ]}
        />
      )}

      {showPaper && <MagnetisePaper strokes={strokes} clipsByStroke={readings} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={magnetiseTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
