import "./oxygenFromPondweed.css";
import { useExperimentPerformance } from '../../common/CombinedScienceExperience';
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { FlaskConical, Lightbulb, Play } from "lucide-react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { PlayerController } from "../../common/PlayerController";
import { OxygenLabRoom, OXYGEN_BENCH_Y as BENCH_TOP_Y, OXYGEN_LAB_BOUNDS, OXYGEN_LAB_OBSTACLES, OXYGEN_PLAYER_SPAWN } from "./OxygenLabRoom";
import { OxygenApparatus } from "./OxygenApparatus";
import { OxygenMatchTest } from "./OxygenMatchTest";
import {
  HeaderModeToggle,
} from "../../common/CombinedScienceGame";

interface OxygenFromPondweedSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const PAPER_FILENAME = "is-oxygen-produced-during-photosynthesis.html";

/* ------------------------------------------------------------------ Science */

/** Which of the two identical set-ups the learner is watching. */
type Setup = "light" | "dark";

interface SetupSpec {
  id: Setup;
  short: string;
  title: string;
  /** Bubbles released per minute from the cut stem. */
  bubbleRate: number;
  /** Simulated hours needed before the tube holds enough gas to test. */
  hoursToFill: number;
  emoji: string;
  summary: string;
}

const SETUPS: Record<Setup, SetupSpec> = {
  light: {
    id: "light",
    short: "Light",
    title: "Apparatus in bright light",
    bubbleRate: 46,
    hoursToFill: 6,
    emoji: "💡",
    summary:
      "The pondweed stands 15 cm from a bright lamp. Bubbles stream steadily from the cut end of the stem and collect in the test tube.",
  },
  dark: {
    id: "dark",
    short: "Dark",
    title: "Control kept in the dark",
    bubbleRate: 0,
    hoursToFill: Number.POSITIVE_INFINITY,
    emoji: "🌑",
    summary:
      "An identical set-up is covered with a black cloth. Without light the pondweed cannot photosynthesise, so no gas collects — this is the control.",
  },
};

/** Fraction of the tube that must be filled before the splint test is worth doing. */
const TESTABLE_FRACTION = 0.62;

type SplintResult = "relit" | "stayedGlowing";

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Does photosynthesis really give off oxygen?",
    text: "The equation says carbon dioxide + water → glucose + oxygen. This experiment collects the gas a water plant gives off in the light and identifies it, instead of just assuming it is oxygen.",
    mode: "modal",
  },
  {
    title: "Why pondweed and not a leafy plant?",
    text: "Pondweed lives under water, so the gas it releases forms bubbles you can see and collect. A land plant would release the gas straight into the air.",
    mode: "bubble",
    selector: '[data-experiment-tour="pondweed-scene"]',
  },
  {
    title: "Run the light set-up and the dark control",
    text: "Collect gas in the light, then repeat in the dark. Only the light set-up should give gas — that is what links the gas to photosynthesis rather than to the plant simply being alive.",
    mode: "bubble",
    selector: '[data-experiment-tour="setup-controls"], [data-experiment-tour="lab-controls"]',
  },
  {
    title: "Glowing splint, not a burning one",
    text: "A splint that is still burning tells you nothing — it burns in air too. A splint that is glowing only relights if the gas is much richer in oxygen than air.",
    mode: "bubble",
    selector: '[data-experiment-tour="lab-controls"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** Adjustable metal task lamp aimed down towards the pondweed. */
function BenchLamp({ on }: { on: boolean }) {
  const target = useMemo(() => new THREE.Object3D(), []);
  target.position.set(-0.55, BENCH_TOP_Y + 0.32, 0.05);
  const cable = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.12, 0.04, -0.08), new THREE.Vector3(-0.3, 0.025, -0.2),
    new THREE.Vector3(-0.46, 0.025, -0.5), new THREE.Vector3(-0.42, -0.1, -1.48),
  ]), []);
  return <>
    <primitive object={target} />
    <group position={[-1.65, BENCH_TOP_Y, 0.05]} name="Adjustable photosynthesis lamp">
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.19, 0.21, 0.07, 64]} />
        <meshStandardMaterial color="#303a40" metalness={0.65} roughness={0.3} />
      </mesh>
      <mesh position={[0.09, 0.075, 0.06]}><boxGeometry args={[0.04, 0.015, 0.055]} /><meshStandardMaterial color="#171e22" /></mesh>
      <mesh position={[0, 0.39, 0]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.66, 24]} /><meshStandardMaterial color="#aab6bd" metalness={0.9} roughness={0.22} /></mesh>
      <mesh position={[0.16, 0.77, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow><cylinderGeometry args={[0.014, 0.014, 0.37, 24]} /><meshStandardMaterial color="#aab6bd" metalness={0.9} roughness={0.22} /></mesh>
      <mesh position={[0, 0.71, 0]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.055, 24]} /><meshStandardMaterial color="#303a40" metalness={0.65} roughness={0.3} /></mesh>
      <group position={[0.32, 0.86, 0]} rotation={[0, 0, Math.PI / 3]}>
        <mesh castShadow><cylinderGeometry args={[0.065, 0.18, 0.24, 64, 1, true]} /><meshStandardMaterial color="#34454f" metalness={0.7} roughness={0.28} side={THREE.DoubleSide} /></mesh>
        <mesh position={[0, -0.12, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.18, 0.008, 12, 64]} /><meshStandardMaterial color="#aab6bd" metalness={0.85} roughness={0.25} /></mesh>
        <mesh position={[0, -0.065, 0]}><sphereGeometry args={[0.055, 32, 24]} /><meshStandardMaterial color="#fff6dc" emissive="#ffe3ac" emissiveIntensity={on ? 3 : 0} roughness={0.22} /></mesh>
      </group>
      <mesh><tubeGeometry args={[cable, 48, 0.008, 8, false]} /><meshStandardMaterial color="#20272b" roughness={0.8} /></mesh>
    </group>
    {on && <spotLight position={[-1.24, BENCH_TOP_Y + 0.81, 0.05]} target={target}
      intensity={16} distance={4} angle={0.65} penumbra={0.65} decay={2} color="#fff1d2" castShadow shadow-normalBias={0.015} />}
  </>;
}

function BicarbonateBottle() {
  const sticker = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 320;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#f7edd4"; context.fillRect(0, 0, 512, 320);
    context.strokeStyle = "#9d8e6b"; context.lineWidth = 6; context.strokeRect(14, 14, 484, 292);
    context.fillStyle = "#243936"; context.textAlign = "center"; context.textBaseline = "middle";
    context.font = "bold 78px Arial"; context.fillText("NaHCO₃", 256, 110);
    context.font = "30px Arial"; context.fillText("SODIUM", 256, 185);
    context.fillText("HYDROGENCARBONATE", 256, 230, 450);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
  useEffect(() => () => sticker?.dispose(), [sticker]);
  return <group position={[0.3, BENCH_TOP_Y + 0.02, -0.4]}>
    <mesh castShadow>
      <latheGeometry args={[[
        new THREE.Vector2(0, 0), new THREE.Vector2(0.085, 0.005), new THREE.Vector2(0.09, 0.025),
        new THREE.Vector2(0.09, 0.23), new THREE.Vector2(0.08, 0.255), new THREE.Vector2(0.035, 0.29),
        new THREE.Vector2(0.035, 0.32), new THREE.Vector2(0.028, 0.32), new THREE.Vector2(0.028, 0.29),
        new THREE.Vector2(0.076, 0.25), new THREE.Vector2(0.083, 0.025), new THREE.Vector2(0, 0.014),
      ], 48]} />
      <meshPhysicalMaterial color="#eef9fb" transparent opacity={0.3} transmission={0.85}
        thickness={0.008} ior={1.47} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
    <mesh position={[0, 0.105, 0]}>
      <cylinderGeometry args={[0.079, 0.079, 0.18, 48]} />
      <meshPhysicalMaterial color="#e0eff3" transparent opacity={0.25} transmission={0.7} roughness={0.04} ior={1.33} />
    </mesh>
    <mesh position={[0, 0.325, 0]} castShadow>
      <cylinderGeometry args={[0.039, 0.04, 0.055, 32]} />
      <meshStandardMaterial color="#272d31" roughness={0.68} />
    </mesh>
    <mesh position={[0, 0.14, 0]}>
      <cylinderGeometry args={[0.091, 0.091, 0.12, 48, 1, true, -0.9, 1.8]} />
      <meshBasicMaterial map={sticker} color={sticker ? "#ffffff" : "#f7edd4"} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  </group>;
}

/** Like Photosynthesis's WalkthroughCamera, own the camera while See is running. */
function OxygenWalkthroughCamera({ setup, collected, splintState }: {
  setup: Setup;
  collected: number;
  splintState: "idle" | "glowing" | "tested";
}) {
  const { camera, size } = useThree();
  const lookTargetRef = useRef(new THREE.Vector3());
  const desiredPositionRef = useRef(new THREE.Vector3());
  const targetRef = useRef(new THREE.Vector3());
  const mobile = size.width < 640;

  useEffect(() => {
    // Start from the current viewing direction so entering See never snaps.
    camera.getWorldDirection(lookTargetRef.current).multiplyScalar(3).add(camera.position);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = mobile ? 55 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, mobile]);

  useFrame((_, delta) => {
    const testing = splintState !== "idle";
    const dark = setup === "dark";
    const target = targetRef.current.set(
      splintState === "glowing" ? 0.35 : -0.55,
      BENCH_TOP_Y + (dark ? 0.65 : splintState === "glowing" ? 0.48 : testing ? 1.02 : collected < 0.35 ? 0.42 : 0.85),
      0.05,
    );
    // Fit the complete apparatus even when the mobile canvas is narrow.
    const aspect = Math.max(0.25, size.width / Math.max(1, size.height));
    const verticalHalfFov = THREE.MathUtils.degToRad(mobile ? 55 : 48) / 2;
    const limitingHalfFov = Math.min(verticalHalfFov, Math.atan(Math.tan(verticalHalfFov) * aspect));
    const radius = dark ? 0.95 : splintState === "glowing" ? 1.0 : testing ? 0.72 : 0.8;
    const distance = radius / Math.sin(limitingHalfFov);
    const desiredPosition = desiredPositionRef.current.set(
      target.x + distance * 0.2,
      target.y + distance * 0.3,
      target.z + distance * 0.93,
    );
    camera.position.lerp(desiredPosition, 1 - Math.exp(-delta * 1.75));
    lookTargetRef.current.lerp(target, 1 - Math.exp(-delta * 2.25));
    camera.lookAt(lookTargetRef.current);
  });

  return null;
}

function PondweedScene({
  setup,
  collected,
  lampOn,
  splintState,
  splintResult,
  onMatchPrepared,
  demoActive,
  mode,
  isMobile,
  moveVectorRef,
}: {
  setup: Setup;
  collected: number;
  lampOn: boolean;
  splintState: "idle" | "glowing" | "tested";
  splintResult: SplintResult | null;
  onMatchPrepared: () => void;
  demoActive: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera, size } = useThree();
  const cameraDistance = Math.max(3.5, 1.5 / (Math.tan(THREE.MathUtils.degToRad(27.5)) * (Math.max(1, size.width) / Math.max(1, size.height))));
  const targetY = isMobile ? BENCH_TOP_Y + 0.3 : BENCH_TOP_Y + 0.45;
  useEffect(() => {
    if (mode !== "learning" || demoActive) return;
    const position: [number, number, number] = isMobile ? [-0.25, 3.05, cameraDistance] : [2.4, 2.8, 3.8];
    camera.position.set(...position);
    camera.lookAt(-0.25, targetY, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode, demoActive, cameraDistance, targetY]);

  return (
    <>
      <OxygenLabRoom>
        <BenchLamp on={lampOn} />
        <OxygenApparatus setup={setup} collected={collected} lampOn={lampOn} tubeLifted={splintState !== "idle"} />
        <OxygenMatchTest state={splintState} result={splintResult} onPrepared={onMatchPrepared} />

        <BicarbonateBottle />
      </OxygenLabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {demoActive ? (
        <OxygenWalkthroughCamera setup={setup} collected={collected} splintState={splintState} />
      ) : mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[-0.25, targetY, 0]} minDistance={2.4} maxDistance={Math.max(10, cameraDistance * 1.3)} maxPolarAngle={1.5} />
      ) : (
        <PlayerController bounds={OXYGEN_LAB_BOUNDS} obstacles={OXYGEN_LAB_OBSTACLES} spawn={OXYGEN_PLAYER_SPAWN} eyeHeight={2.15} speed={3.25} isMobile={isMobile} enabled moveVector={moveVectorRef} onUpdate={() => undefined} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function PondweedPaper({
  results,
  onClose,
}: {
  results: Record<Setup, { collected: number; tested: boolean }>;
  onClose: () => void;
}) {
  const bothRun = results.light.tested && results.dark.tested;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Investigating Whether Oxygen is Produced During Photosynthesis</h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To collect the gas released by a water plant in the light and to show that the gas is oxygen.</p>

        <h2 className="mt-5 font-bold uppercase">Principle</h2>
        <p>
          The word equation for photosynthesis is carbon dioxide + water → glucose + oxygen. Pondweed lives under water, so
          any gas it releases forms bubbles that can be collected over water. Oxygen relights a glowing splint, so the
          splint test identifies the gas rather than assuming it.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Fresh Canadian pondweed (Elodea), 250 cm³ beaker, filter funnel, test tube, bright lamp, sodium hydrogencarbonate
          solution, black cloth, wooden splint, stopwatch.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A beaker was filled with water containing a little sodium hydrogencarbonate to supply carbon dioxide.</li>
          <li>Pondweed was cut under water and placed in the beaker with the cut ends facing upwards.</li>
          <li>A filter funnel was inverted over the pondweed, resting on small glass feet so that water could circulate.</li>
          <li>A test tube was filled completely with water and inverted over the stem of the funnel without letting air in.</li>
          <li>The apparatus was placed 15 cm from a bright lamp and the bubbles were watched.</li>
          <li>The gas was collected for six hours, until the tube was more than half full.</li>
          <li>The tube was lifted out, kept upright, and a glowing splint was pushed into the gas.</li>
          <li>An identical apparatus was covered with a black cloth as a control and treated in exactly the same way.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Set-up</td>
              <td className="border border-slate-400 p-2 font-bold">Bubbles seen</td>
              <td className="border border-slate-400 p-2 font-bold">Gas collected</td>
              <td className="border border-slate-400 p-2 font-bold">Glowing splint</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">In bright light</td>
              <td className="border border-slate-400 p-2">A steady stream from the cut stems</td>
              <td className="border border-slate-400 p-2">
                {results.light.collected > 0 ? `${Math.round(results.light.collected * 100)}% of the tube` : "—"}
              </td>
              <td className="border border-slate-400 p-2">{results.light.tested ? "Relit — burst into flame" : "—"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">In the dark (control)</td>
              <td className="border border-slate-400 p-2">None</td>
              <td className="border border-slate-400 p-2">
                {results.dark.tested ? "No gas collected" : "—"}
              </td>
              <td className="border border-slate-400 p-2">{results.dark.tested ? "No gas to test" : "—"}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {bothRun
            ? "The gas collected from the pondweed in the light relit a glowing splint, so it was oxygen. No gas collected in the dark, so the oxygen was produced by photosynthesis and not simply by the plant being present in water."
            : "Run both the light set-up and the dark control, then record which one produced a gas that relights a glowing splint."}
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The pondweed must be cut under water, or air bubbles trapped on the stem are collected instead of the gas made by the plant.</li>
          <li>The gas is not pure oxygen — it also contains nitrogen that was dissolved in the water, which is why a glowing splint is used rather than expecting a violent result.</li>
          <li>The lamp warms the water, so a heat shield or a glass tank of water between the lamp and the beaker gives a fairer test.</li>
          <li>Both set-ups must use the same mass of pondweed and the same volume of solution, or the comparison is not valid.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function OxygenFromPondweedSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: OxygenFromPondweedSimProps) {
  const [guideStep, setGuideStep] = useState<"choose" | "ready" | "collect" | "splint" | "test" | "check" | "results">("choose");
  const [setup, setSetup] = useState<Setup>("light");
  const [lampOn, setLampOn] = useState(false);
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const [splintState, setSplintState] = useState<"idle" | "glowing" | "tested">("idle");
  const [splintReady, setSplintReady] = useState(false);
  const onMatchPrepared = useCallback(() => setSplintReady(true), []);
  const [results, setResults] = useState<Record<Setup, { collected: number; tested: boolean }>>({
    light: { collected: 0, tested: false },
    dark: { collected: 0, tested: false },
  });
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [selectedMode, setSelectedMode] = useState<"see" | "learn" | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const baseRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  // In the dark no gas ever collects, however long you wait.
  const collected = setup === "dark" ? 0 : Math.min(1, hours / SETUPS.light.hoursToFill);
  const enoughGas = collected >= TESTABLE_FRACTION;
  const splintResult: SplintResult | null =
    splintState === "tested" ? (setup === "light" ? "relit" : "stayedGlowing") : null;

  /* Time-lapse of the collection period. */
  useEffect(() => {
    if (!running) return;
    const target = SETUPS.light.hoursToFill;
    const durationMs = 7200;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = Math.min(1, (now - startRef.current) / durationMs);
      const value = baseRef.current + fraction * (target - baseRef.current);
      setHours(value);
      if (fraction >= 1) {
        setRunning(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  /* Keep the running record of what each set-up has produced. */
  useEffect(() => {
    setResults((current) => {
      const entry = current[setup];
      if (Math.abs(entry.collected - collected) < 0.001) return current;
      return { ...current, [setup]: { ...entry, collected } };
    });
  }, [collected, setup]);

  const beginCollecting = useCallback(() => {
    if (!lampOn && setup === "light") setLampOn(true);
    baseRef.current = hours;
    startRef.current = performance.now();
    setRunning(true);
  }, [hours, lampOn, setup]);

  const lightSplint = useCallback(() => { setSplintReady(false); setSplintState("glowing"); }, []);

  const testGas = useCallback(() => {
    if (!splintReady || splintState !== "glowing" || (setup === "light" && !enoughGas) || (setup === "dark" && hours < SETUPS.light.hoursToFill)) return;
    setSplintState("tested");
    setResults((current) => ({ ...current, [setup]: { ...current[setup], tested: true } }));
  }, [setup, splintState, splintReady, enoughGas, hours]);

  const selectSetup = useCallback((next: Setup) => {
    setRunning(false);
    setDemoActive(false);
    setSetup(next);
    setGuideStep("choose");
    setHours(0);
    setSplintState("idle");
    setSplintReady(false);
    setLampOn(next === "light");
  }, []);

  const resetAll = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setGuideStep("choose");
    setSetup("light");
    setHours(0);
    setLampOn(false);
    setSplintState("idle");
    setSplintReady(false);
    setResults({ light: { collected: 0, tested: false }, dark: { collected: 0, tested: false } });
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setMode("learning");
    setShowTutorial(false);
    setGuideStep("collect");
    setResults({ light: { collected: 0, tested: false }, dark: { collected: 0, tested: false } });
    setDemoActive(true);
    setSetup("light");
    setHours(0);
    setSplintState("idle");
    setSplintReady(false);
    setLampOn(true);
    baseRef.current = 0;
    startRef.current = performance.now();
    setRunning(true);
  }, [demoActive]);

  /* Run the light experiment, then compare it with an equally timed dark control. */
  useEffect(() => {
    if (!demoActive || running) return;
    if (setup === "dark") {
      if (hours < SETUPS.light.hoursToFill) return;
      setGuideStep("check");
      const timer = window.setTimeout(() => {
        setResults(current => ({ ...current, dark: { collected: 0, tested: true } }));
        setGuideStep("results");
        setDemoActive(false);
      }, 1200);
      return () => window.clearTimeout(timer);
    }
    if (!enoughGas) return;
    if (splintState === "idle") {
      setGuideStep("splint");
      const timer = window.setTimeout(() => { setGuideStep("test"); lightSplint(); }, 900);
      return () => window.clearTimeout(timer);
    }
    if (splintState === "glowing") {
      if (!splintReady) return;
      const timer = window.setTimeout(testGas, 1200);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => {
      setSetup("dark");
      setHours(0);
      setSplintState("idle");
      setSplintReady(false);
      setLampOn(false);
      setGuideStep("collect");
      baseRef.current = 0;
      startRef.current = performance.now();
      setRunning(true);
    }, 4800);
    return () => window.clearTimeout(timer);
  }, [demoActive, running, setup, hours, enoughGas, splintState, splintReady, lightSplint, testGas]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = results.light.tested && results.dark.tested;
  const steps = setup === "light"
    ? ["choose", "ready", "collect", "splint", "test", "results"]
    : ["choose", "ready", "collect", "check", "results"];
  const stepIndex = Math.max(0, steps.indexOf(guideStep));
  const guideProgress = guideStep === "results" ? 100 : Math.round(stepIndex / (steps.length - 1) * 100);
  const collectionFinished = hours >= SETUPS.light.hoursToFill;
  const instructions: Record<typeof guideStep, { title: string; text: string }> = {
    choose: { title: "Choose light or dark", text: "Choose where to place the pondweed. You will try both conditions to compare the results." },
    ready: { title: setup === "light" ? "Place the plant in light" : "Keep the plant in the dark", text: setup === "light"
      ? "The lamp is on. The plant is under a funnel in water. The tube above it will collect the gas."
      : "A black cover blocks the light. Use the same plant and water as the light experiment." },
    collect: { title: setup === "light" ? "Collect the gas" : "Wait in the dark", text: collectionFinished
      ? setup === "light" ? "The tube has collected gas. Select Next to find out which gas it is." : "Six hours have passed. Select Next to check the tube."
      : setup === "light" ? "Watch the bubbles rise into the tube. Wait for six hours of experiment time." : "Wait for the same six hours. Watch for bubbles and gas in the tube." },
    splint: { title: "Prepare a glowing splint", text: "Take a wooden match from the box and strike it. Blow out the flame so the tip still glows. Select Next to prepare it." },
    test: { title: "Test the gas", text: splintReady ? "Put the glowing tip into the collected gas. If the splint lights again, the gas is oxygen. Select Next to test it." : "Watch the match come out of the box and light. Wait until the flame goes out and only the tip is glowing." },
    check: { title: "Check the tube", text: "Look at the tube. No gas has collected in the dark, so there is no gas to test. Select Next to record this result." },
    results: { title: complete ? "Compare your results" : "Your result", text: complete
      ? "The plant made oxygen in the light. No gas collected in the dark. This shows that light is needed for photosynthesis."
      : setup === "light" ? "The glowing splint lit again. The gas is oxygen. Now try the dark condition to compare."
      : "No gas collected in the dark. Now try the light condition to compare." },
  };
  const nextStep = () => {
    if (demoActive || running) return;
    switch (guideStep) {
      case "choose": setLampOn(setup === "light"); setGuideStep("ready"); break;
      case "ready": setGuideStep("collect"); beginCollecting(); break;
      case "collect": if (collectionFinished) setGuideStep(setup === "light" ? "splint" : "check"); break;
      case "splint": lightSplint(); setGuideStep("test"); break;
      case "test": if (splintReady) { testGas(); setGuideStep("results"); } break;
      case "check": setResults(current => ({ ...current, dark: { collected: 0, tested: true } })); setGuideStep("results"); break;
      case "results": if (complete) resetAll(); else selectSetup(setup === "light" ? "dark" : "light"); break;
    }
  };

    useExperimentPerformance({reset:resetAll, prepare:()=>{setMode('learning');setShowTutorial(false);}, actions:[
{id:'lamp',label:'Switch on the lamp and collect oxygen',target:[-1.4,1.9,0],gesture:'press',perform:beginCollecting,done:enoughGas,seconds:8},
{id:'splint',label:'Prepare the glowing splint',target:[1.15,1.75,.2],gesture:'grip',perform:lightSplint,done:splintState==='glowing'},
{id:'test',label:'Test the collected gas with the glowing splint',target:[0,2.25,0],gesture:'grip',perform:testGas,done:splintState==='tested'}]});

return (
    <div className={`oxygen-design relative flex h-full w-full overflow-hidden bg-slate-950 text-white ${isMobileViewport ? "oxygen-design--mobile" : ""}`}>
      <HeaderModeToggle mode={mode} onChange={handleModeChange} disabled={demoActive} />

      <div inert={selectedMode === null} data-experiment-tour="pondweed-scene" className="relative min-h-0 min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.1, 3.1, 4.9], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <PondweedScene
            setup={setup}
            collected={collected}
            lampOn={lampOn && setup === "light"}
            splintState={splintState}
            splintResult={splintResult}
            onMatchPrepared={onMatchPrepared}
            demoActive={demoActive}
            mode={mode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
          />
        </Canvas>

        {demoActive && setup === "dark" && hours < 3.5 && (
          <div className="oxygen-see-subtitle" role="status" aria-live="polite" aria-atomic="true">
            <p>Now let’s see what happens without light.</p>
            <span>Will the plant still make gas?</span>
          </div>
        )}

        {mode === "doing" && isMobileViewport && <MobileGtaNavigation moveVector={moveVectorRef} />}

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={handleModeChange}
        />

        {mode === "learning" && !demoActive && !isMobileViewport && (
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

      {mode === "learning" && <section inert={selectedMode === null} className="oxygen-controls" data-experiment-tour="lab-controls" aria-label="Experiment guide">
        <header className="oxygen-controls__header">
          <strong>Experiment guide</strong>
          <button type="button" onClick={resetAll}>Start again</button>
        </header>
        <div className="oxygen-guide__progress">
          <div><span>Step {stepIndex + 1} of {steps.length}</span><span>{guideProgress}%</span></div>
          <progress aria-label="Experiment progress" max={100} value={guideProgress} />
        </div>
        <div className="oxygen-guide__step" aria-live="polite">
          <p className="oxygen-guide__eyebrow">{demoActive ? "Demonstration" : "Your experiment"}</p>
          <h2>{instructions[guideStep].title}</h2>
          <p>{instructions[guideStep].text}</p>
          {guideStep === "choose" && <div className="oxygen-guide__choices" data-experiment-tour="setup-controls">
            {(["light", "dark"] as const).map(choice => <button key={choice} type="button" aria-pressed={setup === choice} onClick={() => selectSetup(choice)}>
              <strong>{choice === "light" ? "Light" : "Dark"}</strong>
              <span>{choice === "light" ? "Lamp on" : "Covered, no light"}</span>
            </button>)}
          </div>}
          {guideStep === "collect" && <div className="oxygen-guide__collection">
            <div><span>Experiment time</span><strong>{hours.toFixed(1)} / 6 hours</strong></div>
            <progress aria-label="Collection time" value={hours} max={6} />
            <p>{setup === "light" ? `Gas in the tube: ${Math.round(collected * 100)}%` : "Gas in the tube: none"}</p>
            {!collectionFinished && <small>Six hours are shown in a few seconds.</small>}
            {!running && !collectionFinished && !demoActive && <button type="button" onClick={beginCollecting}>Continue waiting</button>}
          </div>}
          {guideStep === "results" && <dl className="oxygen-guide__results">
            {(["light", "dark"] as const).map(condition => <div key={condition}>
              <dt>{condition === "light" ? "In light" : "In the dark"}</dt>
              <dd>{results[condition].tested ? condition === "light" ? "Splint lit again — oxygen" : "No gas collected" : "Not tried yet"}</dd>
            </div>)}
          </dl>}
        </div>
        <footer className="oxygen-guide__actions">
          <button className="oxygen-guide__next" type="button" onClick={nextStep} disabled={demoActive || running || (guideStep === "test" && !splintReady) || (guideStep === "collect" && !collectionFinished)}>
            {demoActive ? "Showing this step…" : running ? "Please wait…" : guideStep === "test" && !splintReady ? "Lighting the match…" : guideStep === "results" ? complete ? "Start again" : `Try ${setup === "light" ? "dark" : "light"}` : "Next"}
          </button>
          <button className="oxygen-guide__demo" type="button" onClick={toggleDemo}>{demoActive ? "Stop demonstration" : complete ? "Replay demonstration" : "Watch demonstration"}</button>
        </footer>
      </section>}

      {selectedMode === null && (
        <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/15 p-5 backdrop-blur-[7px]">
          <div role="dialog" aria-modal="true" aria-labelledby="oxygen-mode-title" className="w-full max-w-[360px] rounded-2xl border border-white/80 bg-white p-5 text-center text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,.28)] sm:p-6">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <FlaskConical size={20} strokeWidth={2.25} aria-hidden="true" />
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Photosynthesis</p>
            <h2 id="oxygen-mode-title" className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Select mode</h2>
            <div className="mt-5 space-y-2.5">
              <button autoFocus type="button" onClick={() => { setSelectedMode("see"); toggleDemo(); }} className="flex w-full items-center justify-between rounded-xl bg-cyan-500 px-4 py-3 text-left text-white shadow-sm transition hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200">
                <span className="text-sm font-bold">See</span>
                <Play size={17} fill="currentColor" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => { setSelectedMode("learn"); setMode("learning"); }} className="flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-emerald-950 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100">
                <span className="text-sm font-bold">Learn</span>
                <Lightbulb size={17} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaper && <PondweedPaper results={results} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
