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

interface InhaledExhaledAirSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.violet;
const PAPER_FILENAME = "comparing-inhaled-and-exhaled-air.html";

/* ------------------------------------------------------------------ Science */

/** Tube A carries the air breathed IN, tube B the air breathed OUT. */
type Tube = "inhaled" | "exhaled";

/**
 * Cloudiness added to each tube per breath. Atmospheric air is about 0.04%
 * carbon dioxide and exhaled air about 4%, so tube B goes milky in a handful of
 * breaths while tube A stays clear for the whole lesson.
 */
const CLOUD_PER_BREATH: Record<Tube, number> = { inhaled: 0.012, exhaled: 0.23 };

/** Cloudiness at which limewater is described as "milky". */
const MILKY_THRESHOLD = 0.85;

type BreathPhase = "idle" | "in" | "out";

const PHASE_MS = 1150;

const MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Set up the two tubes",
    detail: "Put equal volumes of fresh limewater in boiling tubes A and B, then fit the bung with the delivery tubes and the mouthpiece.",
    symbol: "🔧",
  },
  {
    short: "Breathe in",
    title: "Breathe in through the mouthpiece",
    detail: "Air from the room is drawn through the limewater in tube A. This is the inhaled air.",
    symbol: "⬅️",
  },
  {
    short: "Breathe out",
    title: "Breathe out through the mouthpiece",
    detail: "Your breath bubbles through the limewater in tube B. This is the exhaled air.",
    symbol: "➡️",
  },
  {
    short: "Compare",
    title: "Compare the two tubes",
    detail: "Keep breathing gently in and out until one tube changes. The tube that turns milky contains far more carbon dioxide.",
    symbol: "🔍",
  },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What is different about the air you breathe out?",
    text: "Respiration in your cells uses oxygen and produces carbon dioxide. If that is true, the air leaving your lungs should carry much more carbon dioxide than the air going in. Limewater is the test that shows it.",
    mode: "modal",
  },
  {
    title: "One mouthpiece, two paths",
    text: "Breathe IN and room air is pulled through tube A. Breathe OUT and your breath is pushed through tube B. The same limewater, the same volume, the same number of breaths — only the air is different.",
    mode: "bubble",
    selector: '[data-experiment-tour="breathing-scene"]',
  },
  {
    title: "Breathe gently, and count",
    text: "Take slow breaths and count them. Recording how many breaths it takes for a tube to turn milky turns this into a measurement instead of just a colour change.",
    mode: "bubble",
    selector: '[data-experiment-tour="breath-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Safety",
    text: "Never suck limewater into your mouth. Breathe gently, keep the delivery tubes the right way round, and stop if the liquid rises up a tube.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/** Limewater colour: clear at 0, chalky white at 1. */
function limewaterColour(cloudiness: number) {
  const clear = new THREE.Color("#dbeafe");
  const milky = new THREE.Color("#f8fafc");
  return clear.clone().lerp(milky, Math.min(1, cloudiness));
}

/* ------------------------------------------------------------------ 3D bits */

/** Bubbles rising through the limewater in the tube that is currently active. */
function TubeBubbles({ active }: { active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () => Array.from({ length: 7 }, (_, index) => ({ offset: index / 7, x: (index % 3) * 0.012 - 0.012, scale: 0.008 + (index % 3) * 0.003 })),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((child, index) => {
      const seed = seeds[index];
      if (!seed) return;
      const travel = (state.clock.elapsedTime * 0.9 + seed.offset) % 1;
      child.position.y = travel * 0.17;
      child.position.x = seed.x + Math.sin(travel * 12 + index) * 0.006;
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, 0, 0]}>
          <sphereGeometry args={[seed.scale, 8, 6]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.55} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * One boiling tube of limewater with its delivery tube. The long delivery tube
 * dips under the surface — that is the end the air has to bubble through.
 */
function LimewaterTube({
  position,
  label,
  sublabel,
  cloudiness,
  bubbling,
  longTube,
}: {
  position: [number, number, number];
  label: string;
  sublabel: string;
  cloudiness: number;
  bubbling: boolean;
  longTube: boolean;
}) {
  const liquidHeight = 0.22;
  const colour = useMemo(() => limewaterColour(cloudiness), [cloudiness]);

  return (
    <group position={position}>
      {/* Boiling tube */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.52, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#eaf5fd"
          transparent
          opacity={0.2}
          transmission={0.84}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <sphereGeometry args={[0.075, 22, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#eaf5fd" transparent opacity={0.2} transmission={0.84} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Limewater */}
      <mesh position={[0, liquidHeight / 2 + 0.01, 0]}>
        <cylinderGeometry args={[0.068, 0.068, liquidHeight, 24]} />
        <meshStandardMaterial
          color={colour}
          transparent
          opacity={0.45 + cloudiness * 0.5}
          roughness={0.25 + cloudiness * 0.5}
        />
      </mesh>

      <group position={[0, 0.03, 0]}>
        <TubeBubbles active={bubbling} />
      </group>

      {/* Delivery tube — long one dips into the liquid, short one stops above it */}
      <mesh position={[0, longTube ? 0.32 : 0.44, 0]}>
        <cylinderGeometry args={[0.011, 0.011, longTube ? 0.56 : 0.32, 12]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={0.55} transmission={0.5} roughness={0.1} />
      </mesh>

      {/* Rubber bung */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.078, 0.07, 0.07, 20]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.9} />
      </mesh>

      <Html position={[0, 0.78, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[132px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">{label}</div>
          <div
            className="mt-0.5 text-[7px] font-black uppercase"
            style={{ color: cloudiness >= MILKY_THRESHOLD ? "#e9d5ff" : "#94a3b8" }}
          >
            {cloudiness >= MILKY_THRESHOLD ? "milky" : cloudiness > 0.25 ? "going cloudy" : "clear"}
          </div>
          <div className="mt-0.5 text-[7px] font-bold uppercase text-slate-400">{sublabel}</div>
        </div>
      </Html>
    </group>
  );
}

/** The T-piece and mouthpiece the learner breathes through. */
function Mouthpiece({ phase }: { phase: BreathPhase }) {
  const glow = phase === "in" ? "#38bdf8" : phase === "out" ? "#fb7185" : "#64748b";

  return (
    <group position={[0, BENCH_TOP_Y + 0.66, 0]}>
      {/* Horizontal connector across the two tubes */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.72, 12]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={0.55} transmission={0.5} roughness={0.1} />
      </mesh>
      {/* Stub out towards the learner, ending in the mouthpiece */}
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.28, 12]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={0.55} transmission={0.5} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.02, 0.07, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} emissive={glow} emissiveIntensity={phase === "idle" ? 0 : 0.6} />
      </mesh>

      <Html position={[0, 0.16, 0.3]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase"
          style={{
            borderColor: phase === "idle" ? "rgba(148,163,184,0.4)" : glow,
            background: "rgba(2,6,23,0.9)",
            color: phase === "idle" ? "#cbd5e1" : glow,
          }}
        >
          {phase === "in" ? "breathing in — through A" : phase === "out" ? "breathing out — through B" : "mouthpiece"}
        </div>
      </Html>
    </group>
  );
}

/** Simple wooden rack the two boiling tubes stand in. */
function TubeRack() {
  return (
    <group position={[0, BENCH_TOP_Y + 0.02, 0]}>
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.04, 0.3]} />
        <meshStandardMaterial color="#8b6b45" roughness={0.85} />
      </mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.16, -0.12]} castShadow>
          <boxGeometry args={[0.05, 0.28, 0.04]} />
          <meshStandardMaterial color="#8b6b45" roughness={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, -0.12]} castShadow>
        <boxGeometry args={[0.9, 0.04, 0.05]} />
        <meshStandardMaterial color="#7a5c3b" roughness={0.85} />
      </mesh>
    </group>
  );
}

function BreathingScene({
  phase,
  cloudiness,
  mode,
  isMobile,
  moveVectorRef,
}: {
  phase: BreathPhase;
  cloudiness: Record<Tube, number>;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [2.4, 3.2, 4.2] : [2.5, 3.0, 4.3];
    camera.position.set(...position);
    camera.lookAt(0, 2.0, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#7c3aed"
        benchColor="#f1eff7"
        posterA={{
          title: "RESPIRATION",
          lines: [
            "glucose + oxygen → carbon dioxide + water",
            "Energy is released in every living cell",
            "Exhaled air carries the carbon dioxide away",
            "About 4% CO₂ out, 0.04% CO₂ in",
          ],
        }}
        posterB={{
          title: "LIMEWATER TEST",
          lines: [
            "Limewater is calcium hydroxide solution",
            "CO₂ turns it milky (calcium carbonate)",
            "More CO₂ = milky in fewer breaths",
            "Never suck limewater into your mouth",
          ],
        }}
      >
        <TubeRack />
        <LimewaterTube
          position={[-0.4, BENCH_TOP_Y + 0.06, 0]}
          label="Tube A · inhaled air"
          sublabel="air drawn in from the room"
          cloudiness={cloudiness.inhaled}
          bubbling={phase === "in"}
          longTube
        />
        <LimewaterTube
          position={[0.4, BENCH_TOP_Y + 0.06, 0]}
          label="Tube B · exhaled air"
          sublabel="breath pushed out of the lungs"
          cloudiness={cloudiness.exhaled}
          bubbling={phase === "out"}
          longTube
        />
        <Mouthpiece phase={phase} />

        {/* Spare bottle of limewater on the bench */}
        <group position={[1.25, BENCH_TOP_Y + 0.02, -0.2]}>
          <mesh position={[0, 0.13, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.26, 18]} />
            <meshPhysicalMaterial color="#e9eef5" transparent opacity={0.6} transmission={0.45} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.06, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          <Html position={[0, 0.44, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-full border border-violet-300/40 bg-violet-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-violet-100">
              fresh limewater
            </div>
          </Html>
        </group>
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

function BreathingPaper({
  breaths,
  cloudiness,
  milkyAtBreath,
  onClose,
}: {
  breaths: number;
  cloudiness: Record<Tube, number>;
  milkyAtBreath: number | null;
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Comparing Inhaled and Exhaled Air Using Limewater</h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To compare the amount of carbon dioxide in inhaled air and in exhaled air.</p>

        <h2 className="mt-5 font-bold uppercase">Principle</h2>
        <p>
          Limewater (calcium hydroxide solution) turns milky when carbon dioxide is bubbled through it, because insoluble
          calcium carbonate is formed. The tube that turns milky in fewer breaths contains the air with more carbon
          dioxide.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Two boiling tubes (A and B), limewater, a two-holed bung and delivery tubes fitted with a mouthpiece, a
          stopwatch, and a clean disinfected mouthpiece for each learner.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Equal volumes of fresh limewater were placed in boiling tubes A and B.</li>
          <li>The delivery tubes were fitted so that both dipped below the surface of the limewater.</li>
          <li>Breathing IN through the mouthpiece drew room air through the limewater in tube A.</li>
          <li>Breathing OUT through the mouthpiece pushed exhaled air through the limewater in tube B.</li>
          <li>Gentle breaths were taken in and out through the mouthpiece and counted.</li>
          <li>Both tubes were watched and the number of breaths needed for a change was recorded.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Tube</td>
              <td className="border border-slate-400 p-2 font-bold">Air passing through</td>
              <td className="border border-slate-400 p-2 font-bold">Appearance after {breaths} breaths</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">A</td>
              <td className="border border-slate-400 p-2">Inhaled (atmospheric) air</td>
              <td className="border border-slate-400 p-2">
                {cloudiness.inhaled >= MILKY_THRESHOLD ? "Milky" : cloudiness.inhaled > 0.25 ? "Very slightly cloudy" : "Stayed clear"}
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">B</td>
              <td className="border border-slate-400 p-2">Exhaled air</td>
              <td className="border border-slate-400 p-2">
                {cloudiness.exhaled >= MILKY_THRESHOLD
                  ? `Turned milky${milkyAtBreath ? ` after ${milkyAtBreath} breaths` : ""}`
                  : cloudiness.exhaled > 0.25
                    ? "Going cloudy"
                    : "Still clear"}
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {cloudiness.exhaled >= MILKY_THRESHOLD
            ? `The limewater in tube B turned milky${milkyAtBreath ? ` after only ${milkyAtBreath} breaths` : ""} while the limewater in tube A stayed clear. Exhaled air therefore contains far more carbon dioxide than inhaled air, because carbon dioxide is produced by respiration in the body's cells.`
            : "Keep breathing gently through the mouthpiece until one of the tubes changes, then compare the two."}
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Both tubes must hold the same volume of fresh limewater, or the comparison is not fair.</li>
          <li>Breathe gently. Breathing hard can suck limewater up the delivery tube and into the mouth.</li>
          <li>Inhaled air does contain a little carbon dioxide (about 0.04%), so tube A goes very faintly cloudy after a long time.</li>
          <li>The test shows that there is more carbon dioxide, not how much — a gas syringe or a CO₂ sensor would measure the actual percentage.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function InhaledExhaledAirSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: InhaledExhaledAirSimProps) {
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [breaths, setBreaths] = useState(0);
  const [cloudiness, setCloudiness] = useState<Record<Tube, number>>({ inhaled: 0, exhaled: 0 });
  const [milkyAtBreath, setMilkyAtBreath] = useState<number | null>(null);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [autoBreathing, setAutoBreathing] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const exhaledMilky = cloudiness.exhaled >= MILKY_THRESHOLD;
  const complete = exhaledMilky && breaths >= 6;

  /** One half of a breath: air through tube A (in) or tube B (out). */
  const runPhase = useCallback((next: "in" | "out") => {
    setPhase(next);
    const tube: Tube = next === "in" ? "inhaled" : "exhaled";
    setCloudiness((current) => ({
      ...current,
      [tube]: Math.min(1, current[tube] + CLOUD_PER_BREATH[tube]),
    }));
    if (next === "out") setBreaths((count) => count + 1);
  }, []);

  /* Each phase lasts a fixed time, then the apparatus settles. */
  useEffect(() => {
    if (phase === "idle") return;
    const timer = window.setTimeout(() => setPhase("idle"), PHASE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  /* Record the breath on which tube B first went milky. */
  useEffect(() => {
    if (milkyAtBreath !== null) return;
    if (cloudiness.exhaled >= MILKY_THRESHOLD) setMilkyAtBreath(breaths);
  }, [cloudiness.exhaled, breaths, milkyAtBreath]);

  const takeBreath = useCallback(() => {
    if (phase !== "idle") return;
    runPhase("in");
    window.setTimeout(() => runPhase("out"), PHASE_MS + 120);
  }, [phase, runPhase]);

  /* Auto-breathing keeps a steady rhythm going until it is switched off. */
  useEffect(() => {
    if (!autoBreathing) return;
    if (phase !== "idle") return;
    const timer = window.setTimeout(takeBreath, 260);
    return () => window.clearTimeout(timer);
  }, [autoBreathing, phase, takeBreath]);

  /* The demo breathes until tube B is milky, then stops on the result. */
  useEffect(() => {
    if (!demoActive) return;
    if (exhaledMilky && phase === "idle") {
      setDemoActive(false);
      setAutoBreathing(false);
    }
  }, [demoActive, exhaledMilky, phase]);

  const resetAll = useCallback(() => {
    setPhase("idle");
    setBreaths(0);
    setCloudiness({ inhaled: 0, exhaled: 0 });
    setMilkyAtBreath(null);
    setAutoBreathing(false);
    setDemoActive(false);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setAutoBreathing(false);
      return;
    }
    setBreaths(0);
    setCloudiness({ inhaled: 0, exhaled: 0 });
    setMilkyAtBreath(null);
    setDemoActive(true);
    setAutoBreathing(true);
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const step = breaths === 0 ? 0 : phase === "in" ? 1 : !exhaledMilky ? 2 : 3;
  const progress = Math.min(1, cloudiness.exhaled);

  const status =
    breaths === 0
      ? "Both tubes hold the same fresh limewater and both are clear. Breathe in and out through the mouthpiece and count your breaths."
      : phase === "in"
        ? "Breathing in — room air is being drawn through the limewater in tube A."
        : phase === "out"
          ? "Breathing out — your breath is bubbling through the limewater in tube B."
          : exhaledMilky
            ? `Tube B went milky after ${milkyAtBreath ?? breaths} breaths. Tube A is still clear, so exhaled air has far more carbon dioxide.`
            : `${breaths} breath${breaths === 1 ? "" : "s"} taken. Tube B is starting to go cloudy while tube A is unchanged — keep going.`;

  const observation = exhaledMilky
    ? `Tube B (exhaled air): milky after ${milkyAtBreath ?? breaths} breaths. Tube A (inhaled air): still clear. Exhaled air contains more carbon dioxide.`
    : breaths > 0
      ? `Tube A ${cloudiness.inhaled > 0.1 ? "very faintly cloudy" : "clear"} · Tube B ${cloudiness.exhaled > 0.25 ? "going cloudy" : "clear"} after ${breaths} breaths.`
      : "Take gentle breaths through the mouthpiece and watch which tube changes first.";

  const primaryLabel = autoBreathing ? "Stop breathing rhythm" : exhaledMilky ? "Take another breath" : "Take a breath";
  const onPrimary = autoBreathing ? () => setAutoBreathing(false) : takeBreath;

  /* ------------------------------------------------------------ UI panels */

  const breathPanel = (
    <div data-experiment-tour="breath-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Breathing</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => phase === "idle" && runPhase("in")}
          disabled={phase !== "idle"}
          className="rounded-xl px-1 py-2 text-[9px] font-black transition disabled:opacity-40"
          style={{ background: "rgba(56,189,248,0.18)", color: "#bae6fd", border: "1px solid rgba(56,189,248,0.35)" }}
        >
          ⬅️ Breathe in
        </button>
        <button
          onClick={() => phase === "idle" && runPhase("out")}
          disabled={phase !== "idle"}
          className="rounded-xl px-1 py-2 text-[9px] font-black transition disabled:opacity-40"
          style={{ background: "rgba(251,113,133,0.18)", color: "#fecdd3", border: "1px solid rgba(251,113,133,0.35)" }}
        >
          ➡️ Breathe out
        </button>
      </div>
      <button
        onClick={() => setAutoBreathing((on) => !on)}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[9px] font-black uppercase transition"
        style={
          autoBreathing
            ? { background: ACCENT.base, color: "#1a0b2e" }
            : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
        }
      >
        {autoBreathing ? "Stop the rhythm" : "Breathe steadily"}
      </button>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-950/50 px-2 py-1.5 text-[9px] font-black uppercase">
        <span className="text-slate-400">Breaths counted</span>
        <span style={{ color: ACCENT.text }}>{breaths}</span>
      </div>
      <div className="mt-2 rounded-xl bg-amber-950/40 p-2 text-[9px] leading-snug text-amber-100">
        Breathe gently. Never suck limewater up the delivery tube.
      </div>
    </div>
  );

  const tubesPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">The two tubes</div>
      <div className="mt-2 space-y-2">
        {(
          [
            { tube: "inhaled" as Tube, name: "Tube A · inhaled air", note: "air drawn in from the room" },
            { tube: "exhaled" as Tube, name: "Tube B · exhaled air", note: "breath pushed out of the lungs" },
          ]
        ).map((row) => {
          const value = cloudiness[row.tube];
          const milky = value >= MILKY_THRESHOLD;
          return (
            <div key={row.tube} className="rounded-xl border border-white/8 bg-white/[0.03] p-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white">{row.name}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-black"
                  style={
                    milky
                      ? { background: "rgba(233,213,255,0.22)", color: "#f5f3ff" }
                      : { background: "rgba(255,255,255,0.08)", color: "#94a3b8" }
                  }
                >
                  {milky ? "milky" : value > 0.25 ? "cloudy" : "clear"}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-900">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${Math.max(2, value * 100)}%`, background: milky ? "#e9d5ff" : "#475569" }}
                />
              </div>
              <div className="mt-1 text-[9px] leading-snug text-slate-400">{row.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const resultPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</div>
      <div className="mt-2 overflow-hidden rounded-xl border border-white/10">
        <div className="grid grid-cols-2 bg-white/[0.06] px-2 py-1.5 text-[9px] font-black uppercase text-slate-300">
          <span>Tube</span>
          <span>After {breaths} breaths</span>
        </div>
        <div className="grid grid-cols-2 px-2 py-1.5 text-[9px] font-bold text-slate-200">
          <span>A · inhaled</span>
          <span>{cloudiness.inhaled > 0.25 ? "very slightly cloudy" : "stayed clear"}</span>
        </div>
        <div className="grid grid-cols-2 bg-white/[0.03] px-2 py-1.5 text-[9px] font-bold text-slate-200">
          <span>B · exhaled</span>
          <span>{exhaledMilky ? `milky (${milkyAtBreath ?? breaths} breaths)` : cloudiness.exhaled > 0.25 ? "going cloudy" : "still clear"}</span>
        </div>
      </div>
      {exhaledMilky && (
        <div className="mt-2 rounded-xl bg-violet-950/40 p-2 text-[9px] leading-snug text-violet-100">
          Exhaled air contains about 4% carbon dioxide against 0.04% in inhaled air — a hundred times more — because
          respiration in your cells produces it.
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Inhaled vs Exhaled Air"
          subtitle="the limewater test"
          symbol="🫁"
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

      <div data-experiment-tour="breathing-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [2.5, 3.0, 4.3], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <BreathingScene
            phase={phase}
            cloudiness={cloudiness}
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
            emoji="🫁"
            cornerEmoji={phase === "in" ? "⬅️" : phase === "out" ? "➡️" : "🧪"}
            status={status}
            running={phase !== "idle"}
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
          title="Inhaled vs Exhaled Air"
          tagline="which tube turns milky?"
          missions={MISSIONS}
          step={step}
          running={phase !== "idle"}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={phase === "idle" ? "▶" : "⏳"}
          onPrimary={onPrimary}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "breath", label: "Breathing", value: `${breaths}`, content: breathPanel },
            { id: "tubes", label: "Tubes", value: exhaledMilky ? "B milky" : "clear", content: tubesPanel },
            { id: "results", label: "Results", value: milkyAtBreath ? `${milkyAtBreath} breaths` : "—", content: resultPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "in", label: "Breathe in", onClick: () => phase === "idle" && runPhase("in"), tone: "blue", disabled: phase !== "idle" },
            { id: "out", label: "Breathe out", onClick: () => phase === "idle" && runPhase("out"), tone: "red", disabled: phase !== "idle" },
            { id: "auto", label: autoBreathing ? "Stop" : "Steady", onClick: () => setAutoBreathing((on) => !on), tone: "green" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "breath", label: "Breathing", value: `${breaths}`, content: breathPanel },
            { id: "tubes", label: "Tubes", value: exhaledMilky ? "B milky" : "clear", content: tubesPanel },
            { id: "results", label: "Results", value: milkyAtBreath ? `${milkyAtBreath} breaths` : "—", content: resultPanel },
          ]}
        />
      )}

      {showPaper && (
        <BreathingPaper breaths={breaths} cloudiness={cloudiness} milkyAtBreath={milkyAtBreath} onClose={onClosePaper} />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
