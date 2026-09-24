import { FirstPersonScienceActor, useExperimentPerformance } from '../../common/CombinedScienceExperience';
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
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";

interface CandleOxygenSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.orange;
const PAPER_FILENAME = "comparing-oxygen-content-using-a-candle.html";

/* ------------------------------------------------------------------ Science */

type Jar = "inhaled" | "exhaled";

interface JarSpec {
  id: Jar;
  short: string;
  title: string;
  /** Rough percentage of oxygen in this sample of air. */
  oxygenPercent: number;
  /** How long an identical candle keeps burning in the sealed jar, in seconds. */
  burnSeconds: number;
  emoji: string;
  summary: string;
}

const JARS: Record<Jar, JarSpec> = {
  inhaled: {
    id: "inhaled",
    short: "Inhaled",
    title: "Jar A · inhaled air",
    oxygenPercent: 21,
    burnSeconds: 22.4,
    emoji: "🌬️",
    summary:
      "Jar A is simply filled with air from the room — the same air you breathe in. It contains about 21% oxygen.",
  },
  exhaled: {
    id: "exhaled",
    short: "Exhaled",
    title: "Jar B · exhaled air",
    oxygenPercent: 16,
    burnSeconds: 6.8,
    emoji: "🫁",
    summary:
      "Jar B is filled with exhaled air by breathing through a delivery tube into a jar full of water, so the water is pushed out and only your breath is left. It contains about 16% oxygen.",
  },
};

/**
 * The stopwatch runs faster than real time so a whole class experiment fits into
 * a few seconds on screen. The number shown is always the true stopwatch value.
 */
const TIME_SCALE = 4;

type Stage = "collect" | "ready" | "burning" | "out";

const MISSIONS: GameMission[] = [
  {
    short: "Collect",
    title: "Collect a jar of exhaled air",
    detail: "Fill a gas jar with water, invert it in a trough and breathe through the delivery tube until the water is pushed out.",
    symbol: "🫧",
  },
  {
    short: "Light",
    title: "Light the candle",
    detail: "A short candle is fixed to a deflagrating spoon and lit. The same candle is used for both jars so the test is fair.",
    symbol: "🕯️",
  },
  {
    short: "Time",
    title: "Lower it in and time the burn",
    detail: "Lower the burning candle into the jar, cover it, and start the stopwatch. Stop it the moment the flame goes out.",
    symbol: "⏱️",
  },
  {
    short: "Compare",
    title: "Compare the two times",
    detail: "The candle burns longer in the air that contains more oxygen. Compare the two stopwatch readings.",
    symbol: "📊",
  },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "How much oxygen is left in the air you breathe out?",
    text: "Breathing out does not use up all the oxygen — a candle still burns in exhaled air, just not for as long. Timing the burn in each jar turns 'less oxygen' into a number you can compare.",
    mode: "modal",
  },
  {
    title: "Collect the exhaled air over water",
    text: "A jar full of water is inverted in a trough. Breathing down the delivery tube pushes the water out, so the jar ends up holding your breath and nothing else.",
    mode: "bubble",
    selector: '[data-experiment-tour="candle-scene"]',
  },
  {
    title: "Keep everything else the same",
    text: "Same candle, same size jar, same lid, same starting flame. Only the air inside the jar is different — that is what makes it a fair test.",
    mode: "bubble",
    selector: '[data-experiment-tour="jar-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Why the flame goes out at all",
    text: "The candle uses up oxygen and fills the jar with carbon dioxide. Once the oxygen falls too low to keep the reaction going, the flame dies — sooner in exhaled air.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** Candle flame that shrinks as the oxygen in the jar is used up. */
function CandleFlame({ lit, strength }: { lit: boolean; strength: number }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const flame = flameRef.current;
    if (!flame) return;
    const flicker = 0.9 + Math.sin(state.clock.elapsedTime * 17) * 0.06 + Math.sin(state.clock.elapsedTime * 29) * 0.04;
    const scale = Math.max(0.12, strength) * flicker;
    flame.scale.set(scale, scale * (0.85 + strength * 0.3), scale);
  });

  if (!lit) return null;

  return (
    <group position={[0, 0.075, 0]}>
      <mesh ref={flameRef}>
        <coneGeometry args={[0.022, 0.075, 14]} />
        <meshStandardMaterial color="#ffd166" emissive="#ff9a1c" emissiveIntensity={2.6} transparent opacity={0.94} />
      </mesh>
      <pointLight position={[0, 0.05, 0]} intensity={2.2 + strength * 2.4} distance={1.5} color="#ffb347" />
    </group>
  );
}

/** Wisp of smoke shown for a moment after the flame goes out. */
function Smoke({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((child, index) => {
      const travel = ((state.clock.elapsedTime * 0.35 + index * 0.33) % 1);
      child.position.y = 0.08 + travel * 0.22;
      child.position.x = Math.sin(travel * 6 + index) * 0.02;
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = 0.28 * (1 - travel);
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.016 + index * 0.004, 8, 6]} />
          <meshStandardMaterial color="#cbd5e1" transparent opacity={0.24} />
        </mesh>
      ))}
    </group>
  );
}

/** Candle on a deflagrating spoon, lowered into whichever jar is being tested. */
function CandleOnSpoon({
  lit,
  strength,
  smoking,
  lowered,
}: {
  lit: boolean;
  strength: number;
  smoking: boolean;
  lowered: boolean;
}) {
  return (
    <group position={[0, lowered ? 0.2 : 0.52, 0]}>
      {/* Spoon handle running back out of the jar */}
      <mesh position={[0, 0.02, -0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.44, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Small metal pan */}
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.012, 18]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Candle */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.06, 16]} />
        <meshStandardMaterial color="#fdf6e3" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.078, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.012, 6]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} />
      </mesh>
      <CandleFlame lit={lit} strength={strength} />
      <group position={[0, 0.08, 0]}>
        <Smoke visible={smoking} />
      </group>
    </group>
  );
}

/**
 * A gas jar. The exhaled-air jar shows its water level while it is being filled
 * by displacement; the inhaled jar is simply full of air.
 */
function GasJar({
  position,
  spec,
  waterLevel,
  lidOn,
  cloudy,
  active,
  children,
}: {
  position: [number, number, number];
  spec: JarSpec;
  waterLevel: number;
  lidOn: boolean;
  cloudy: boolean;
  active: boolean;
  children?: React.ReactNode;
}) {
  const jarHeight = 0.62;
  const waterHeight = Math.max(0.001, jarHeight * waterLevel);

  return (
    <group position={position}>
      {/* Jar walls */}
      <mesh position={[0, jarHeight / 2, 0]}>
        <cylinderGeometry args={[0.16, 0.16, jarHeight, 30, 1, true]} />
        <meshPhysicalMaterial
          color="#eaf5fd"
          transparent
          opacity={active ? 0.24 : 0.18}
          transmission={0.85}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.008, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.016, 30]} />
        <meshPhysicalMaterial color="#eaf5fd" transparent opacity={0.35} roughness={0.08} />
      </mesh>

      {/* Water still to be displaced */}
      {waterLevel > 0.01 && (
        <mesh position={[0, waterHeight / 2 + 0.01, 0]}>
          <cylinderGeometry args={[0.152, 0.152, waterHeight, 28]} />
          <meshStandardMaterial color="#bfe4f5" transparent opacity={0.55} roughness={0.15} />
        </mesh>
      )}

      {/* A faint haze once the candle has filled the jar with its products */}
      {cloudy && (
        <mesh position={[0, jarHeight / 2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, jarHeight - 0.04, 24]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.1} />
        </mesh>
      )}

      {/* Greased glass lid */}
      <mesh position={[0, lidOn ? jarHeight + 0.012 : jarHeight + 0.16, lidOn ? 0 : 0.16]}>
        <cylinderGeometry args={[0.172, 0.172, 0.018, 30]} />
        <meshPhysicalMaterial color="#e2eef7" transparent opacity={0.45} transmission={0.5} roughness={0.1} />
      </mesh>

      {children}

      <Html position={[0, jarHeight + 0.3, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div
          className="w-[136px] rounded-lg border px-1.5 py-1 text-center"
          style={{
            borderColor: active ? "rgba(251,146,60,0.6)" : "rgba(255,255,255,0.2)",
            background: "rgba(2,6,23,0.9)",
          }}
        >
          <div className="text-[8px] font-black uppercase leading-tight text-white">{spec.title}</div>
          <div className="mt-0.5 text-[7px] font-black uppercase" style={{ color: active ? "#fdba74" : "#94a3b8" }}>
            {waterLevel > 0.02 ? `${Math.round((1 - waterLevel) * 100)}% filled` : `about ${spec.oxygenPercent}% oxygen`}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Trough of water with the delivery tube used to collect exhaled air. */
function CollectionTrough({ collecting }: { collecting: boolean }) {
  return (
    <group position={[0, BENCH_TOP_Y + 0.02, -0.75]}>
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <boxGeometry args={[0.85, 0.14, 0.36]} />
        <meshPhysicalMaterial color="#dfeaf2" transparent opacity={0.35} transmission={0.5} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.82, 0.1, 0.33]} />
        <meshStandardMaterial color="#bfe4f5" transparent opacity={0.6} roughness={0.15} />
      </mesh>
      {/* Delivery tube dipping into the trough */}
      <mesh position={[-0.3, 0.24, 0.05]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 10]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={0.55} transmission={0.5} roughness={0.1} />
      </mesh>
      <Html position={[0, 0.34, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase"
          style={{
            borderColor: collecting ? "rgba(251,146,60,0.6)" : "rgba(148,163,184,0.4)",
            background: "rgba(2,6,23,0.9)",
            color: collecting ? "#fdba74" : "#cbd5e1",
          }}
        >
          {collecting ? "breathing out through the tube" : "trough of water"}
        </div>
      </Html>
    </group>
  );
}

function CandleScene({
  jar,
  stage,
  fill,
  flameStrength,
  smoking,
  times,
  mode,
  isMobile,
  moveVectorRef,
}: {
  jar: Jar;
  stage: Stage;
  fill: number;
  flameStrength: number;
  smoking: boolean;
  times: Record<Jar, number | null>;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [2.6, 3.2, 4.4] : [2.7, 3.0, 4.5];
    camera.position.set(...position);
    camera.lookAt(0, 2.0, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const inJar = stage === "burning" || stage === "out";

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#ea580c"
        benchColor="#f6f0ea"
        posterA={{
          title: "AIR AND RESPIRATION",
          lines: [
            "Inhaled air: about 21% oxygen",
            "Exhaled air: about 16% oxygen",
            "Only part of the oxygen is used",
            "Exhaled air also carries more CO₂ and water",
          ],
        }}
        posterB={{
          title: "FAIR TEST",
          lines: [
            "Same candle for both jars",
            "Same size of gas jar and lid",
            "Start timing as the lid goes on",
            "Stop the moment the flame dies",
          ],
        }}
      >
        <CollectionTrough collecting={stage === "collect" && fill > 0 && fill < 1} />

        <GasJar
          position={[-0.42, BENCH_TOP_Y + 0.02, 0.1]}
          spec={JARS.inhaled}
          waterLevel={0}
          lidOn={jar === "inhaled" && inJar}
          cloudy={times.inhaled !== null}
          active={jar === "inhaled"}
        >
          {jar === "inhaled" && inJar && (
            <CandleOnSpoon lit={stage === "burning"} strength={flameStrength} smoking={smoking} lowered />
          )}
        </GasJar>

        <GasJar
          position={[0.42, BENCH_TOP_Y + 0.02, 0.1]}
          spec={JARS.exhaled}
          waterLevel={1 - fill}
          lidOn={jar === "exhaled" && inJar}
          cloudy={times.exhaled !== null}
          active={jar === "exhaled"}
        >
          {jar === "exhaled" && inJar && (
            <CandleOnSpoon lit={stage === "burning"} strength={flameStrength} smoking={smoking} lowered />
          )}
        </GasJar>

        {/* The candle waits on the bench until it is lowered into a jar */}
        {!inJar && (
          <group position={[jar === "inhaled" ? -0.42 : 0.42, BENCH_TOP_Y + 0.02, 0.62]}>
            <CandleOnSpoon lit={stage === "ready"} strength={1} smoking={smoking} lowered={false} />
          </group>
        )}
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.0, 0]} minDistance={2} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function CandlePaper({ times, onClose }: { times: Record<Jar, number | null>; onClose: () => void }) {
  const both = times.inhaled !== null && times.exhaled !== null;
  const ratio =
    both && times.exhaled ? (times.inhaled! / times.exhaled!).toFixed(1) : null;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Comparing the Oxygen Content of Inhaled and Exhaled Air</h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To compare how much oxygen is present in inhaled air and in exhaled air by timing how long a candle burns in each.</p>

        <h2 className="mt-5 font-bold uppercase">Principle</h2>
        <p>
          A candle can only keep burning while there is enough oxygen. The richer the air is in oxygen, the longer the
          flame lasts in a sealed jar. Timing the flame therefore compares the oxygen content of two samples of air.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Two identical gas jars with lids, a trough of water, a delivery tube, a short candle on a deflagrating spoon,
          matches and a stopwatch.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Jar A was left full of ordinary room air, which is the air we breathe in.</li>
          <li>Jar B was filled with water, inverted in the trough, and exhaled air was breathed in through a delivery tube until all the water had been displaced.</li>
          <li>Jar B was covered with a greased lid while still under water and stood upright on the bench.</li>
          <li>The candle on the deflagrating spoon was lit.</li>
          <li>The burning candle was lowered into jar A, the lid was replaced and the stopwatch was started.</li>
          <li>The stopwatch was stopped the moment the flame went out and the time was recorded.</li>
          <li>The candle was relit and the same procedure was repeated with jar B.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Gas jar</td>
              <td className="border border-slate-400 p-2 font-bold">Air in the jar</td>
              <td className="border border-slate-400 p-2 font-bold">Time the candle burned (s)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">A</td>
              <td className="border border-slate-400 p-2">Inhaled (atmospheric) air</td>
              <td className="border border-slate-400 p-2">{times.inhaled !== null ? times.inhaled.toFixed(1) : "—"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">B</td>
              <td className="border border-slate-400 p-2">Exhaled air</td>
              <td className="border border-slate-400 p-2">{times.exhaled !== null ? times.exhaled.toFixed(1) : "—"}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {both
            ? `The candle burned for ${times.inhaled!.toFixed(1)} s in inhaled air but only ${times.exhaled!.toFixed(1)} s in exhaled air — about ${ratio} times as long. Exhaled air therefore contains less oxygen than inhaled air, because some of the oxygen has been used up by respiration. The flame did still burn in exhaled air, which shows that exhaled air is not completely without oxygen: roughly 16% remains, compared with about 21% in inhaled air.`
            : "Time the candle in both jars, then compare the two readings."}
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The same candle and the same size of jar must be used, or the times cannot be compared.</li>
          <li>The lid must go on at once, otherwise fresh air keeps reaching the flame and the time is too long.</li>
          <li>Repeat each measurement three times and take a mean — one reading is easily out by a second or two.</li>
          <li>Jar B must have no water left in it, or the volume of exhaled air is smaller than the volume of air in jar A.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function CandleOxygenSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: CandleOxygenSimProps) {
  const [jar, setJar] = useState<Jar>("inhaled");
  const [stage, setStage] = useState<Stage>("ready");
  const [fill, setFill] = useState(0); // how much of jar B holds exhaled air
  const [collecting, setCollecting] = useState(false);
  const [elapsed, setElapsed] = useState(0); // stopwatch seconds
  const [smoking, setSmoking] = useState(false);
  const [times, setTimes] = useState<Record<Jar, number | null>>({ inhaled: null, exhaled: null });
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const spec = JARS[jar];
  const jarReady = jar === "inhaled" || fill >= 0.999;
  const burnSeconds = spec.burnSeconds;
  const flameStrength = stage === "burning" ? Math.max(0.12, 1 - elapsed / burnSeconds) : 1;

  /* Filling jar B by displacement of water. */
  useEffect(() => {
    if (!collecting) return;
    let frame = 0;
    const started = performance.now();
    const from = fill;
    const animate = (now: number) => {
      const fraction = Math.min(1, (now - started) / 3400);
      const value = from + fraction * (1 - from);
      setFill(value);
      if (fraction >= 1) {
        setCollecting(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
    // `fill` is read once when collection starts; re-running on every frame
    // would restart the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collecting]);

  /* The burn itself — the stopwatch runs until the flame dies. */
  useEffect(() => {
    if (stage !== "burning") return;
    let frame = 0;
    startRef.current = performance.now();
    const animate = (now: number) => {
      const seconds = ((now - startRef.current) / 1000) * TIME_SCALE;
      if (seconds >= burnSeconds) {
        setElapsed(burnSeconds);
        setStage("out");
        setSmoking(true);
        setTimes((current) => ({ ...current, [jar]: burnSeconds }));
        window.setTimeout(() => setSmoking(false), 2200);
        return;
      }
      setElapsed(seconds);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [stage, burnSeconds, jar]);

  const lightCandle = useCallback(() => {
    setElapsed(0);
    setStage("ready");
  }, []);

  const lowerIntoJar = useCallback(() => {
    if (!jarReady) return;
    setElapsed(0);
    setSmoking(false);
    setStage("burning");
  }, [jarReady]);

  const selectJar = useCallback(
    (next: Jar) => {
      setJar(next);
      setElapsed(0);
      setSmoking(false);
      setStage(next === "exhaled" && fill < 0.999 ? "collect" : "ready");
    },
    [fill],
  );

  const startCollecting = useCallback(() => {
    setJar("exhaled");
    setStage("collect");
    setCollecting(true);
  }, []);

  const resetAll = useCallback(() => {
    setJar("inhaled");
    setStage("ready");
    setFill(0);
    setCollecting(false);
    setElapsed(0);
    setSmoking(false);
    setTimes({ inhaled: null, exhaled: null });
    setDemoActive(false);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setCollecting(false);
      return;
    }
    setDemoActive(true);
    setFill(0);
    setTimes({ inhaled: null, exhaled: null });
    setJar("inhaled");
    setElapsed(0);
    setStage("burning");
  }, [demoActive]);

  /* Demo: burn in jar A, collect exhaled air, burn in jar B, stop. */
  useEffect(() => {
    if (!demoActive) return;
    if (stage === "burning" || collecting) return;

    if (times.inhaled === null) return;
    if (fill < 0.999) {
      const timer = window.setTimeout(startCollecting, 1100);
      return () => window.clearTimeout(timer);
    }
    if (times.exhaled === null) {
      const timer = window.setTimeout(() => {
        setJar("exhaled");
        setElapsed(0);
        setSmoking(false);
        setStage("burning");
      }, 1100);
      return () => window.clearTimeout(timer);
    }
    setDemoActive(false);
  }, [demoActive, stage, collecting, times, fill, startCollecting]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = times.inhaled !== null && times.exhaled !== null;
  const step = !jarReady ? 0 : stage === "ready" ? 1 : stage === "burning" ? 2 : complete ? 3 : 2;
  const progress = stage === "burning" ? elapsed / burnSeconds : complete ? 1 : jarReady ? 0.4 : fill;

  const status = !jarReady
    ? collecting
      ? `Breathing out through the delivery tube — the water is being pushed out of jar B. ${Math.round(fill * 100)}% filled.`
      : "Jar B is still full of water. Breathe out through the delivery tube until all the water has been displaced by your exhaled air."
    : stage === "burning"
      ? `The candle is burning in ${spec.short.toLowerCase()} air. Stopwatch: ${elapsed.toFixed(1)} s.`
      : stage === "out"
        ? `The flame went out after ${(times[jar] ?? burnSeconds).toFixed(1)} s in ${spec.short.toLowerCase()} air. ${
            complete ? "Now compare the two times." : "Relight the candle and test the other jar."
          }`
        : `Candle lit and ready. Lower it into ${spec.title} and put the lid on as you start the stopwatch.`;

  const observation = complete
    ? `Inhaled air: ${times.inhaled!.toFixed(1)} s. Exhaled air: ${times.exhaled!.toFixed(1)} s. The candle burned about ${(times.inhaled! / times.exhaled!).toFixed(1)} times longer in inhaled air, so inhaled air holds more oxygen.`
    : times.inhaled !== null
      ? `Jar A done: ${times.inhaled.toFixed(1)} s. Now collect a jar of exhaled air and repeat with the same candle.`
      : "Time the candle in ordinary air first, so you have something to compare against.";

  const primaryLabel = !jarReady
    ? collecting
      ? "Collecting…"
      : "Breathe into jar B"
    : stage === "burning"
      ? "Burning…"
      : stage === "out"
        ? complete
          ? "Reset the experiment"
          : "Relight and test the other jar"
        : "Lower into the jar";

  const onPrimary = !jarReady
    ? collecting
      ? () => setCollecting(false)
      : startCollecting
    : stage === "burning"
      ? () => undefined
      : stage === "out"
        ? complete
          ? resetAll
          : () => {
              const next: Jar = jar === "inhaled" ? "exhaled" : "inhaled";
              selectJar(next);
              lightCandle();
            }
        : lowerIntoJar;

  /* ------------------------------------------------------------ UI panels */

  const jarPanel = (
    <div data-experiment-tour="jar-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Which jar</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(Object.keys(JARS) as Jar[]).map((key) => (
          <button
            key={key}
            onClick={() => selectJar(key)}
            disabled={stage === "burning"}
            className="rounded-xl px-1 py-2 text-[9px] font-black transition disabled:opacity-40"
            style={
              jar === key
                ? { background: ACCENT.base, color: "#2a1206" }
                : { background: "rgba(255,255,255,0.08)", color: times[key] !== null ? "#fed7aa" : "#e2e8f0" }
            }
          >
            {JARS[key].emoji} {JARS[key].short}
            {times[key] !== null ? " ✓" : ""}
          </button>
        ))}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{spec.summary}</div>
      {jar === "exhaled" && (
        <>
          <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase">
            <span className="text-slate-400">Jar B filled</span>
            <span style={{ color: fill >= 0.999 ? "#6ee7b7" : ACCENT.text }}>{Math.round(fill * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-900">
            <div className="h-full rounded-full" style={{ width: `${fill * 100}%`, background: fill >= 0.999 ? "#10b981" : "#f97316" }} />
          </div>
          <button
            onClick={startCollecting}
            disabled={collecting || fill >= 0.999}
            className="mt-2 w-full rounded-xl px-2 py-2 text-[9px] font-black uppercase transition disabled:opacity-40"
            style={{ background: "rgba(249,115,22,0.2)", color: "#fed7aa", border: "1px solid rgba(251,146,60,0.35)" }}
          >
            {fill >= 0.999 ? "Jar B is full of exhaled air" : "Breathe out through the tube"}
          </button>
        </>
      )}
    </div>
  );

  const burnPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Stopwatch</div>
      <div className="mt-2 rounded-xl bg-slate-950/60 px-3 py-3 text-center">
        <div className="font-mono text-2xl font-black text-white">{elapsed.toFixed(1)}<span className="ml-1 text-sm text-slate-400">s</span></div>
        <div className="mt-1 text-[9px] font-black uppercase tracking-wide text-slate-400">
          {stage === "burning" ? "flame burning" : stage === "out" ? "flame went out" : "not started"}
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        <button
          onClick={lightCandle}
          disabled={stage === "burning"}
          className="w-full rounded-xl px-2 py-2 text-left text-[10px] font-black text-white transition disabled:opacity-40"
          style={{ background: ACCENT.soft, border: `1px solid ${ACCENT.ring}` }}
        >
          1 · Light the candle
        </button>
        <button
          onClick={lowerIntoJar}
          disabled={!jarReady || stage === "burning"}
          className="w-full rounded-xl px-2 py-2 text-left text-[10px] font-black text-white transition disabled:opacity-40"
          style={{ background: ACCENT.soft, border: `1px solid ${ACCENT.ring}` }}
        >
          2 · Lower it in, lid on, start timing
        </button>
      </div>
      {!jarReady && (
        <div className="mt-2 text-[9px] leading-snug text-slate-500">Fill jar B with exhaled air before testing it.</div>
      )}
    </div>
  );

  const resultPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Burn times</div>
      <div className="mt-2 space-y-2">
        {(Object.keys(JARS) as Jar[]).map((key) => {
          const value = times[key];
          const longest = Math.max(JARS.inhaled.burnSeconds, JARS.exhaled.burnSeconds);
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-[9px] font-black uppercase">
                <span className="text-slate-400">{JARS[key].short} air</span>
                <span style={{ color: value !== null ? "#fed7aa" : "#64748b" }}>{value !== null ? `${value.toFixed(1)} s` : "—"}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${((value ?? 0) / longest) * 100}%`, background: key === "inhaled" ? "#f97316" : "#a855f7" }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {complete && (
        <div className="mt-2 rounded-xl bg-orange-950/40 p-2 text-[9px] leading-snug text-orange-100">
          The candle burned about {(times.inhaled! / times.exhaled!).toFixed(1)}× longer in inhaled air. Exhaled air still
          contains oxygen — roughly 16% against 21% — but less of it, because respiration used some up.
        </div>
      )}
    </div>
  );

    useExperimentPerformance({reset:resetAll, prepare:()=>{setMode('learning');setShowTutorial(false);}, actions:[
{id:'light',label:'Prepare the lit candle',target:[-.75,1.85,0],gesture:'grip',perform:lightCandle},
{id:'lower',label:'Lower the candle into the air jar',target:[0,1.95,0],gesture:'grip',perform:lowerIntoJar,done:stage==='out',seconds:4},
{id:'collect',label:'Collect exhaled air for comparison',target:[1.1,1.8,0],gesture:'grip',perform:startCollecting,done:fill>=.999,seconds:4},
{id:'compare',label:'Compare the candle in exhaled air',target:[0,1.95,0],gesture:'grip',perform:lowerIntoJar,done:stage==='out',seconds:4}]});

return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Oxygen in Inhaled vs Exhaled Air"
          subtitle="timing a candle flame"
          symbol="🕯️"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="candle-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [2.7, 3.0, 4.5], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <CandleScene
            jar={jar}
            stage={stage}
            fill={fill}
            flameStrength={flameStrength}
            smoking={smoking}
            times={times}
            mode={mode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
          />
        <FirstPersonScienceActor />
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
            emoji="🕯️"
            cornerEmoji={spec.emoji}
            status={status}
            running={stage === "burning" || collecting}
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
          title="Oxygen and a Candle"
          tagline="how long does the flame last?"
          missions={MISSIONS}
          step={step}
          running={stage === "burning" || collecting}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={stage === "burning" ? "⏳" : "▶"}
          onPrimary={onPrimary}
          primaryDisabled={stage === "burning"}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "jar", label: "Gas jar", value: spec.short, content: jarPanel },
            { id: "burn", label: "Timing", value: `${elapsed.toFixed(1)} s`, content: burnPanel },
            {
              id: "results",
              label: "Results",
              value: `${Number(times.inhaled !== null) + Number(times.exhaled !== null)}/2`,
              content: resultPanel,
            },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: !jarReady ? "Fill jar B" : stage === "burning" ? "Burning" : "Lower in", onClick: onPrimary, tone: stage === "burning" ? "red" : "green", disabled: stage === "burning" },
            { id: "jar", label: jar === "inhaled" ? "Jar B" : "Jar A", onClick: () => selectJar(jar === "inhaled" ? "exhaled" : "inhaled"), tone: "orange", disabled: stage === "burning" },
            { id: "light", label: "Relight", onClick: lightCandle, tone: "blue", disabled: stage === "burning" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "jar", label: "Gas jar", value: spec.short, content: jarPanel },
            { id: "burn", label: "Timing", value: `${elapsed.toFixed(1)} s`, content: burnPanel },
            {
              id: "results",
              label: "Results",
              value: `${Number(times.inhaled !== null) + Number(times.exhaled !== null)}/2`,
              content: resultPanel,
            },
          ]}
        />
      )}

      {showPaper && <CandlePaper times={times} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
