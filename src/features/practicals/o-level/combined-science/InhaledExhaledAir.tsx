import { ExperimentLabelProvider } from "./InhaledExhaledAirLabels";
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BreathingRoom, BREATHING_BOUNDS, BREATHING_OBSTACLES, BREATHING_SPAWN } from "./BreathingRoom";
import "./breathingGuide.css";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "./InhaledExhaledAirControls";
import { useMobileExperimentViewport } from "./InhaledExhaledAirControls";
const BENCH_TOP_Y = 1.36;
import {
  CombinedScienceHud,
  EXPERIMENT_ACCENTS,
} from "./InhaledExhaledAirControls";

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
const CLOUD_PER_BREATH: Record<Tube, number> = { inhaled: 0.0023, exhaled: 0.23 };

/** Cloudiness at which limewater is described as "milky". */
const MILKY_THRESHOLD = 0.85;

type BreathPhase = "idle" | "in" | "out";

const PHASE_MS = 1150;

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
    selector: '[aria-label="Experiment guide"]',
  },
  {
    title: "Safety",
    text: "Never suck limewater into your mouth. Breathe gently, keep the delivery tubes the right way round, and stop if the liquid rises up a tube.",
    mode: "bubble",
    selector: '[aria-label="Experiment guide"]',
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
    () => Array.from({ length: 12 }, (_, index) => ({ offset: index / 12, x: (index % 3) * 0.012 - 0.012, scale: 0.012 + (index % 3) * 0.003 })),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    group.children.forEach((child, index) => {
      const seed = seeds[index];
      if (!seed) return;
      const travel = (state.clock.elapsedTime * 0.9 + seed.offset) % 1;
      child.position.y = travel * 0.20;
      child.scale.setScalar(.75 + travel * .25);
      child.position.x = seed.x + Math.sin(travel * 12 + index) * 0.006;
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, 0, 0]}>
          <sphereGeometry args={[seed.scale, 20, 12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} depthWrite={false} />
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
  cloudiness,
  bubbling,
  longTube,
}: {
  position: [number, number, number];
  cloudiness: number;
  bubbling: boolean;
  longTube: boolean;
}) {
  const liquidHeight = 0.22;
  const liquidRef = useRef<THREE.MeshStandardMaterial>(null);
  const liquidBaseRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((_, delta) => {
    const material = liquidRef.current;
    if (!material) return;
    const blend = 1 - Math.exp(-delta * 2);
    material.color.lerp(limewaterColour(cloudiness), blend);
    material.opacity = THREE.MathUtils.lerp(material.opacity, .25 + cloudiness * .7, blend);
    material.roughness = THREE.MathUtils.lerp(material.roughness, .15 + cloudiness * .6, blend);
    if (liquidBaseRef.current) {
      liquidBaseRef.current.color.copy(material.color);
      liquidBaseRef.current.opacity = material.opacity;
      liquidBaseRef.current.roughness = material.roughness;
    }
  });

  return (
    <group position={position}>
      {/* Boiling tube */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.52, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#eaf5fd"
          transparent
          opacity={1}
          transmission={0.94}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <sphereGeometry args={[0.075, 48, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#eaf5fd" transparent opacity={1} transmission={0.94} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh position={[0, .52, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[.075, .003, 12, 64]} />
        <meshPhysicalMaterial color="#eaf5fd" transmission={.9} roughness={.06} thickness={.005} />
      </mesh>
      {/* Limewater */}
      <mesh position={[0, liquidHeight / 2 + 0.01, 0]}>
        <cylinderGeometry args={[0.068, 0.068, liquidHeight, 64]} />
        <meshStandardMaterial
          ref={liquidRef}
          color="#dbeafe"
          transparent
          opacity={0.45 + cloudiness * 0.5}
          roughness={0.25 + cloudiness * 0.5}
        />
      </mesh>

      <mesh position={[0, .01, 0]}>
        <sphereGeometry args={[.068, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial ref={liquidBaseRef} color="#dbeafe" transparent opacity={.25} roughness={.15} />
      </mesh>
      <group position={[longTube ? 0 : .03, 0.03, longTube ? 0 : -.035]}>
        <TubeBubbles active={bubbling} />
      </group>

      {/* Delivery tube — long one dips into the liquid, short one stops above it */}
      <mesh position={[0, longTube ? 0.32 : 0.44, 0]}>
        <cylinderGeometry args={[0.011, 0.011, longTube ? 0.56 : 0.32, 12]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={1} transmission={0.94} roughness={0.1} />
      </mesh>

      <mesh position={[0.03, !longTube ? .40 : .46, -.035]}>
        <cylinderGeometry args={[.009, .009, !longTube ? .72 : .28, 32]} />
        <meshPhysicalMaterial color="#e2f1fb" transmission={.85} roughness={.08} thickness={.004} />
      </mesh>
      {/* Rubber bung */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.078, 0.07, 0.07, 20]} />
        <meshStandardMaterial color="#4a3b32" roughness={0.9} />
      </mesh>

    </group>
  );
}

/** The T-piece and mouthpiece the learner breathes through. */
function Mouthpiece({ phase }: { phase: BreathPhase }) {
  const glow = phase === "in" ? "#38bdf8" : phase === "out" ? "#fb7185" : "#64748b";

  return (
    <group position={[0, BENCH_TOP_Y + 0.70, 0]}>
      {/* Horizontal connector across the two tubes */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.8, 32]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={1} transmission={0.94} roughness={0.1} />
      </mesh>
      {[-.22, .22].map(x => <group key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh><cylinderGeometry args={[.023, .023, .06, 32]} /><meshStandardMaterial color="#ced8d6" roughness={.35} /></mesh>
        <mesh><cylinderGeometry args={[.024, .024, .008, 32]} /><meshStandardMaterial color="#647d77" roughness={.5} /></mesh>
      </group>)}
      {/* Stub out towards the learner, ending in the mouthpiece */}
      <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.011, 0.011, 0.28, 32]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={1} transmission={0.94} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.028, 0.02, 0.07, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} emissive={glow} emissiveIntensity={phase === "idle" ? 0 : 0.7} />
      </mesh>

    </group>
  );
}

/** Moving arrowheads show the direction of each breath along the actual air line. */
function BreathAirflow({ phase }: { phase: BreathPhase }) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const path = useMemo(() => {
    const points = phase === "in"
      ? [[-.37, .86, -.035], [-.37, .13, -.035], [-.37, .33, -.035], [-.4, .33, 0], [-.4, .70, 0], [0, .70, 0], [0, .70, .38]]
      : [[0, .70, .38], [0, .70, 0], [.4, .70, 0], [.4, .14, 0], [.4, .33, 0], [.43, .33, -.035], [.43, .76, -.035]];
    return points.map(p => new THREE.Vector3(p[0], BENCH_TOP_Y + p[1], p[2]));
  }, [phase]);
  const curve = useMemo(() => {
    const result = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 1; i < path.length; i++) result.add(new THREE.LineCurve3(path[i - 1], path[i]));
    return result;
  }, [path]);
  useEffect(() => { elapsed.current = 0; }, [phase]);
  useFrame((_, delta) => {
    elapsed.current += delta;
    groupRef.current?.children.forEach((arrow, index) => {
      const progress = (elapsed.current * .95 + index / 9) % 1;
      arrow.position.copy(curve.getPointAt(progress));
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), curve.getTangentAt(progress).normalize());
    });
  });
  if (phase === "idle") return null;
  return <group ref={groupRef}>
    {Array.from({ length: 9 }, (_, index) => <mesh key={index}>
      <coneGeometry args={[.018, .045, 12]} />
      <meshBasicMaterial color={phase === "in" ? "#38bdf8" : "#fb7185"} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>)}
  </group>;
}

/** Simple wooden rack the two boiling tubes stand in. */
function TubeRack() {
  return (
    <group position={[0, BENCH_TOP_Y + 0.02, 0]}>
      <RoundedBox position={[0, .02, 0]} args={[1.05, .04, .34]} radius={.015} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#8b6b45" roughness={.65} />
      </RoundedBox>
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
    camera.lookAt(0, 1.75, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <BreathingRoom>
        <TubeRack />
        <LimewaterTube
          position={[-0.4, BENCH_TOP_Y + 0.10, 0]}
          cloudiness={cloudiness.inhaled}
          bubbling={phase === "in"}
          longTube={false}
        />
        <LimewaterTube
          position={[0.4, BENCH_TOP_Y + 0.10, 0]}
          cloudiness={cloudiness.exhaled}
          bubbling={phase === "out"}
          longTube
        />
        <Mouthpiece phase={phase} />
        <BreathAirflow phase={phase} />

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
        </group>
      </BreathingRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {(
        <OrbitControls makeDefault enablePan={false} target={[0, 1.75, 0]} minDistance={2} maxDistance={8} maxPolarAngle={1.5} />
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
          <li>Two-holed bungs were fitted: the room-air inlet in A and the mouthpiece inlet in B dipped below the limewater; the corresponding outlets ended above the liquid. One-way valves directed each breath.</li>
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
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"see" | "learn" | null>(null);
  const [guideStep, setGuideStep] = useState(0);
  const breathTimer = useRef<number | null>(null);
  const cycleBusy = useRef(false);
  useEffect(() => () => { if (breathTimer.current !== null) window.clearTimeout(breathTimer.current); }, []);
  const [demoActive, setDemoActive] = useState(false);
  const [autoBreathing, setAutoBreathing] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const exhaledMilky = cloudiness.exhaled >= MILKY_THRESHOLD;
  const complete = exhaledMilky;

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
    if (phase !== "idle" || cycleBusy.current) return;
    cycleBusy.current = true;
    runPhase("in");
    breathTimer.current = window.setTimeout(() => {
      runPhase("out");
      breathTimer.current = window.setTimeout(() => { cycleBusy.current = false; }, PHASE_MS);
    }, PHASE_MS + 120);
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
    if (breathTimer.current !== null) window.clearTimeout(breathTimer.current);
    cycleBusy.current = false;
    setGuideStep(0);
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
    resetAll();
    setGuideStep(1);
    setDemoActive(true);
    setAutoBreathing(true);
  }, [demoActive, resetAll]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const step = breaths === 0 ? 0 : phase === "in" ? 1 : !exhaledMilky ? 2 : 3;

  const status =
    breaths === 0 && phase === "idle"
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

return (<ExperimentLabelProvider>
    <div className={`breathing-design ${isMobileViewport ? "breathing-design--mobile" : ""} relative flex h-full w-full overflow-hidden bg-slate-950 text-white`}>
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

        {phase !== "idle" && (
          <div key={phase} className="breathing-see-subtitle" role="status" aria-live="polite" aria-atomic="true">
            <p style={{ color: phase === "in" ? "#38bdf8" : "#fb7185" }}>
              {phase === "in" ? "Inhale — breathe in" : "Exhale — blow out"}
            </p>
            <span>
              {phase === "in"
                ? "Air moves through the left tube (A) towards the mouthpiece."
                : "Air moves from the mouthpiece into the right tube (B), bubbling through the limewater."}
            </span>
          </div>
        )}



        <MobileExperimentTopBar
          demoActive={demoActive}
          onDemo={toggleDemo}
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={handleModeChange}
        />

        {mode === "learning" && !isMobileViewport && phase === "idle" && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">
            Drag to look around · scroll to zoom
          </div>
        )}

      </div>

      <section inert={selectedMode === null} className="breathing-controls" aria-label="Experiment guide">
        <header className="breathing-controls__header"><strong>Experiment guide</strong><button onClick={resetAll}>Start again</button></header>
        <div className="breathing-guide__progress"><div><span>Step {guideStep + 1} of 3</span><span>{breaths} breaths</span></div><progress max={3} value={guideStep + (complete ? 1 : 0)} aria-label="Experiment progress" /></div>
        <div className="breathing-guide__step" aria-live="polite">
          <p className="breathing-guide__eyebrow">{demoActive ? "Demonstration" : "Your experiment"}</p>
          <h2>{["Check the apparatus", "Take gentle breaths", "Compare the limewater"][guideStep]}</h2>
          <p>{guideStep === 0 ? "Two boiling tubes contain equal volumes of fresh limewater. Follow the separate inlet and outlet tubes to the mouthpiece." : guideStep === 1 ? status : observation}</p>
          {guideStep > 0 && <dl className="breathing-guide__results"><div><dt>Tube A · inhaled air</dt><dd>{cloudiness.inhaled > .25 ? "Slightly cloudy" : "Clear"}</dd></div><div><dt>Tube B · exhaled air</dt><dd>{exhaledMilky ? "Milky" : cloudiness.exhaled > .25 ? "Going cloudy" : "Clear"}</dd></div></dl>}
          {guideStep === 1 && <p className="mt-5 text-sm">Keep breaths gentle. Never draw limewater into the mouthpiece.</p>}
        </div>
        <footer className="breathing-guide__actions">
          <button className="breathing-guide__next" disabled={phase !== "idle" || demoActive || selectedMode === null} onClick={() => { if (guideStep === 0) setGuideStep(1); else if (guideStep === 1 && !complete) takeBreath(); else if (guideStep === 1) setGuideStep(2); else resetAll(); }}>{phase !== "idle" ? "Breathing…" : guideStep === 0 ? "Next" : guideStep === 1 ? complete ? "Compare results" : "Take a breath" : "Start again"}</button>
          <button className="breathing-guide__demo" onClick={() => { setGuideStep(1); toggleDemo(); }}>{demoActive ? "Stop demonstration" : "Watch demonstration"}</button>
          <button className="breathing-guide__demo" onClick={() => { resetAll(); setSelectedMode(null); }}>Change mode</button>
        </footer>
      </section>
      {selectedMode === null && <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/15 p-5 backdrop-blur-[7px]">
        <div role="dialog" aria-modal="true" aria-labelledby="breathing-mode-title" className="w-full max-w-[360px] rounded-2xl bg-white p-6 text-center text-slate-900 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Respiration</p><h2 id="breathing-mode-title" className="mt-2 text-2xl font-bold">Select mode</h2>
          <p className="mt-2 text-sm text-slate-500">Compare inhaled and exhaled air.</p>
          <button autoFocus className="mt-5 w-full rounded-xl bg-cyan-600 p-3 text-left font-bold text-white focus-visible:ring-4 focus-visible:ring-cyan-200" onClick={() => { setSelectedMode("see"); setGuideStep(1); toggleDemo(); }}>See <span className="float-right">▶</span></button>
          <button className="mt-3 w-full rounded-xl border border-teal-200 bg-teal-50 p-3 text-left font-bold text-teal-950 focus-visible:ring-4 focus-visible:ring-teal-200" onClick={() => { setSelectedMode("learn"); resetAll(); }}>Learn <span className="float-right">→</span></button>
        </div>
      </div>}

      {showPaper && (
        <BreathingPaper breaths={breaths} cloudiness={cloudiness} milkyAtBreath={milkyAtBreath} onClose={onClosePaper} />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  </ExperimentLabelProvider>);
}
