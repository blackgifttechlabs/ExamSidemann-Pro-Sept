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

interface OxygenFromPondweedSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.cyan;
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

const MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Set up the apparatus",
    detail:
      "Stand cut pondweed under an inverted filter funnel in a beaker of water with sodium hydrogencarbonate, then fill a test tube with water and invert it over the funnel stem.",
    symbol: "🔧",
  },
  {
    short: "Light",
    title: "Switch on the lamp",
    detail: "Bright light lets the pondweed photosynthesise. Bubbles rise from the cut stem, through the funnel and into the tube.",
    symbol: "💡",
  },
  {
    short: "Collect",
    title: "Collect the gas",
    detail: "The gas displaces the water in the test tube. Leave it until enough gas has collected to test — about six hours of bright light.",
    symbol: "🫧",
  },
  {
    short: "Test",
    title: "Test the gas with a glowing splint",
    detail: "Lift the tube out, keeping it upright, and push a glowing splint into the gas. If it relights, the gas is oxygen.",
    symbol: "🔥",
  },
];

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
    selector: '[data-experiment-tour="setup-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Glowing splint, not a burning one",
    text: "A splint that is still burning tells you nothing — it burns in air too. A splint that is glowing only relights if the gas is much richer in oxygen than air.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** A single bubble rising from the cut stem up into the test tube. */
function RisingBubbles({ rate, collected }: { rate: number; collected: number }) {
  const groupRef = useRef<THREE.Group>(null);
  // Fewer bubbles once the tube is nearly full, so the scene calms down.
  const count = rate > 0 ? 9 : 0;

  const seeds = useMemo(
    () => Array.from({ length: 9 }, (_, index) => ({ offset: index / 9, x: (index % 3) * 0.018 - 0.018, scale: 0.011 + (index % 4) * 0.003 })),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const speed = 0.32 + (rate / 60) * 0.22;
    group.children.forEach((child, index) => {
      const seed = seeds[index];
      if (!seed) return;
      // Each bubble climbs from the stem to the funnel neck, then wraps round.
      const travel = ((state.clock.elapsedTime * speed + seed.offset) % 1);
      child.position.y = travel * 0.52;
      child.position.x = seed.x + Math.sin(travel * 9 + index) * 0.008;
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = 0.55 * (1 - Math.max(0, travel - 0.86) / 0.14);
    });
  });

  if (count === 0 || collected >= 1) return null;

  return (
    <group ref={groupRef} position={[0, 0.04, 0]}>
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, 0, 0]}>
          <sphereGeometry args={[seed.scale, 10, 8]} />
          <meshStandardMaterial color="#e8fbff" transparent opacity={0.5} roughness={0.1} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The classic set-up: beaker of water, pondweed under an inverted funnel, and a
 * water-filled test tube over the funnel stem. `collected` (0–1) drives how far
 * the gas has pushed the water down the tube.
 */
function PondweedApparatus({
  setup,
  collected,
  lampOn,
  tubeLifted,
}: {
  setup: Setup;
  collected: number;
  lampOn: boolean;
  tubeLifted: boolean;
}) {
  const spec = SETUPS[setup];
  const tubeHeight = 0.44;
  // Water column left in the tube, shortened as gas collects at the closed top.
  const waterHeight = Math.max(0.02, tubeHeight * (1 - collected));
  const tubeY = tubeLifted ? 0.86 : 0.5;

  return (
    <group position={[-0.55, BENCH_TOP_Y, 0.05]}>
      {/* Beaker */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.6, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.18}
          transmission={0.88}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.02, 32]} />
        <meshPhysicalMaterial color="#e4f2fb" transparent opacity={0.3} roughness={0.1} />
      </mesh>
      {/* Water with sodium hydrogencarbonate */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.352, 0.352, 0.53, 32]} />
        <meshStandardMaterial color="#bfe4f5" transparent opacity={0.45} roughness={0.15} />
      </mesh>

      {/* Pondweed: a cut stem with whorls of small leaves */}
      <group position={[0, 0.06, 0]}>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.011, 0.013, 0.22, 8]} />
          <meshStandardMaterial color={setup === "dark" ? "#2f5b33" : "#3d7f42"} roughness={0.8} />
        </mesh>
        {Array.from({ length: 5 }, (_, index) => (
          <group key={index} position={[0, 0.04 + index * 0.042, 0]} rotation={[0, index * 1.2, 0]}>
            {[0, 1, 2].map((leaf) => (
              <mesh key={leaf} position={[0.038, 0, 0]} rotation={[0, (leaf * Math.PI * 2) / 3, 0.35]}>
                <boxGeometry args={[0.07, 0.004, 0.02]} />
                <meshStandardMaterial color={setup === "dark" ? "#35673a" : "#48924c"} roughness={0.75} />
              </mesh>
            ))}
          </group>
        ))}
        <RisingBubbles rate={lampOn ? spec.bubbleRate : 0} collected={collected} />
      </group>

      {/* Inverted filter funnel over the pondweed, standing on small glass feet */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <coneGeometry args={[0.2, 0.28, 26, 1, true]} />
          <meshPhysicalMaterial
            color="#e8f4fc"
            transparent
            opacity={0.22}
            transmission={0.82}
            roughness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 0.2, 18, 1, true]} />
          <meshPhysicalMaterial
            color="#e8f4fc"
            transparent
            opacity={0.24}
            transmission={0.8}
            roughness={0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        {[0, 2.1, 4.2].map((angle) => (
          <mesh key={angle} position={[Math.cos(angle) * 0.17, 0.01, Math.sin(angle) * 0.17]}>
            <cylinderGeometry args={[0.012, 0.012, 0.04, 8]} />
            <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.4} roughness={0.15} />
          </mesh>
        ))}
      </group>

      {/* Test tube over the funnel stem — gas collects at its closed top */}
      <group position={[0, tubeY, 0]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, tubeHeight, 20, 1, true]} />
          <meshPhysicalMaterial
            color="#eaf5fd"
            transparent
            opacity={0.24}
            transmission={0.8}
            roughness={0.04}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
        <mesh position={[0, tubeHeight / 2, 0]}>
          <sphereGeometry args={[0.05, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial color="#eaf5fd" transparent opacity={0.24} transmission={0.8} roughness={0.04} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {/* Remaining water column, measured up from the open bottom end */}
        <mesh position={[0, -tubeHeight / 2 + waterHeight / 2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, waterHeight, 20]} />
          <meshStandardMaterial color="#bfe4f5" transparent opacity={0.6} roughness={0.15} />
        </mesh>

        <Html position={[0.12, tubeHeight / 2 + 0.06, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="w-[116px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
            <div className="text-[8px] font-black uppercase leading-tight text-white">Gas collected</div>
            <div className="mt-0.5 text-[7px] font-black uppercase" style={{ color: collected > 0.05 ? "#a5f3fc" : "#94a3b8" }}>
              {Math.round(collected * 100)}% of the tube
            </div>
          </div>
        </Html>
      </group>

      {/* Black cloth over the dark control */}
      {setup === "dark" && (
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 1.05, 24, 1, true]} />
          <meshStandardMaterial color="#111318" roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.86} />
        </mesh>
      )}

      <Html position={[0, -0.12, 0.4]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-cyan-300/40 bg-cyan-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-cyan-100">
          {spec.title}
        </div>
      </Html>
    </group>
  );
}

/** Bench lamp aimed at the beaker. */
function BenchLamp({ on }: { on: boolean }) {
  return (
    <group position={[-1.55, BENCH_TOP_Y + 0.72, 0.05]}>
      <mesh rotation={[0, 0, -Math.PI / 2.6]} castShadow>
        <coneGeometry args={[0.17, 0.22, 20, 1, true]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.09, -0.04, 0]}>
        <sphereGeometry args={[0.055, 14, 12]} />
        <meshStandardMaterial color={on ? "#fff8dc" : "#5b5b62"} emissive={on ? "#ffe9a8" : "#000000"} emissiveIntensity={on ? 1.7 : 0} />
      </mesh>
      {on && <pointLight position={[0.2, -0.05, 0]} intensity={7} distance={3.6} color="#fff3d0" />}
      <mesh position={[-0.12, -0.36, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.72, 10]} />
        <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.12, -0.71, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.03, 20]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

/**
 * The splint test. The splint is glowing before it goes in; if the gas is
 * oxygen it bursts back into flame.
 */
function GlowingSplint({ state }: { state: "idle" | "glowing" | "tested"; result: SplintResult | null }) {
  const flame = state === "tested";

  return (
    <group position={[0.72, BENCH_TOP_Y + 0.02, 0.22]}>
      {/* Wooden splint lying on the bench, or raised into the tube */}
      <group position={flame ? [0, 0.46, 0] : [0, 0.02, 0]} rotation={[0, 0, flame ? 0 : Math.PI / 2]}>
        <mesh castShadow>
          <boxGeometry args={[0.012, 0.34, 0.012]} />
          <meshStandardMaterial color="#c8a56e" roughness={0.9} />
        </mesh>
        {/* Charred, glowing tip */}
        <mesh position={[0, 0.18, 0]}>
          <boxGeometry args={[0.014, 0.03, 0.014]} />
          <meshStandardMaterial
            color={state === "idle" ? "#4b3a24" : "#3a2a18"}
            emissive={state === "idle" ? "#000000" : "#ff7a29"}
            emissiveIntensity={state === "idle" ? 0 : 1.4}
          />
        </mesh>
        {flame && (
          <>
            <mesh position={[0, 0.235, 0]}>
              <coneGeometry args={[0.026, 0.09, 12]} />
              <meshStandardMaterial color="#ffcc4d" emissive="#ff9d1c" emissiveIntensity={2.4} transparent opacity={0.92} />
            </mesh>
            <pointLight position={[0, 0.25, 0]} intensity={3.4} distance={1.4} color="#ffb347" />
          </>
        )}
      </group>

      <Html position={[0, 0.66, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[124px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">
            {state === "idle" ? "Splint" : state === "glowing" ? "Glowing splint" : "Splint relit"}
          </div>
          <div className="mt-0.5 text-[7px] font-black uppercase" style={{ color: flame ? "#fdba74" : "#94a3b8" }}>
            {state === "idle" ? "not lit yet" : state === "glowing" ? "no flame — just glowing" : "burst into flame · oxygen"}
          </div>
        </div>
      </Html>
    </group>
  );
}

function PondweedScene({
  setup,
  collected,
  lampOn,
  splintState,
  splintResult,
  mode,
  isMobile,
  moveVectorRef,
}: {
  setup: Setup;
  collected: number;
  lampOn: boolean;
  splintState: "idle" | "glowing" | "tested";
  splintResult: SplintResult | null;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [2.9, 3.3, 4.8] : [3.1, 3.1, 4.9];
    camera.position.set(...position);
    camera.lookAt(0, 2.05, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0891b2"
        benchColor="#eef3f6"
        posterA={{
          title: "PHOTOSYNTHESIS",
          lines: [
            "carbon dioxide + water → glucose + oxygen",
            "Light energy is trapped by chlorophyll",
            "Pondweed releases the oxygen as bubbles",
            "Sodium hydrogencarbonate supplies the CO₂",
          ],
        }}
        posterB={{
          title: "TESTING THE GAS",
          lines: [
            "Oxygen relights a glowing splint",
            "Carbon dioxide turns limewater milky",
            "Hydrogen burns with a squeaky pop",
            "Always keep the tube upright",
          ],
        }}
      >
        <BenchLamp on={lampOn} />
        <PondweedApparatus setup={setup} collected={collected} lampOn={lampOn} tubeLifted={splintState !== "idle"} />
        <GlowingSplint state={splintState} result={splintResult} />

        {/* Bottle of sodium hydrogencarbonate on the bench */}
        <group position={[0.3, BENCH_TOP_Y + 0.02, -0.4]}>
          <mesh position={[0, 0.11, 0]} castShadow>
            <cylinderGeometry args={[0.062, 0.062, 0.22, 18]} />
            <meshPhysicalMaterial color="#cfe9f7" transparent opacity={0.6} transmission={0.45} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.245, 0]}>
            <cylinderGeometry args={[0.028, 0.028, 0.06, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          <Html position={[0, 0.4, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-full border border-sky-300/40 bg-sky-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-sky-100">
              NaHCO₃ solution
            </div>
          </Html>
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.0, 0]} minDistance={2.4} maxDistance={10} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
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
  const [setup, setSetup] = useState<Setup>("light");
  const [lampOn, setLampOn] = useState(false);
  const [hours, setHours] = useState(0);
  const [running, setRunning] = useState(false);
  const [splintState, setSplintState] = useState<"idle" | "glowing" | "tested">("idle");
  const [results, setResults] = useState<Record<Setup, { collected: number; tested: boolean }>>({
    light: { collected: 0, tested: false },
    dark: { collected: 0, tested: false },
  });
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const baseRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const spec = SETUPS[setup];
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

  const lightSplint = useCallback(() => setSplintState("glowing"), []);

  const testGas = useCallback(() => {
    setSplintState("tested");
    setResults((current) => ({ ...current, [setup]: { ...current[setup], tested: true } }));
  }, [setup]);

  const selectSetup = useCallback((next: Setup) => {
    setRunning(false);
    setDemoActive(false);
    setSetup(next);
    setHours(0);
    setSplintState("idle");
    setLampOn(next === "light");
  }, []);

  const resetAll = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setHours(0);
    setLampOn(false);
    setSplintState("idle");
    setResults({ light: { collected: 0, tested: false }, dark: { collected: 0, tested: false } });
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setSetup("light");
    setHours(0);
    setSplintState("idle");
    setLampOn(true);
    baseRef.current = 0;
    startRef.current = performance.now();
    setRunning(true);
  }, [demoActive]);

  /* Walk the demo through collecting, lighting the splint and testing. */
  useEffect(() => {
    if (!demoActive || running) return;
    if (!enoughGas) return;
    if (splintState === "idle") {
      const timer = window.setTimeout(lightSplint, 900);
      return () => window.clearTimeout(timer);
    }
    if (splintState === "glowing") {
      const timer = window.setTimeout(testGas, 1200);
      return () => window.clearTimeout(timer);
    }
    setDemoActive(false);
  }, [demoActive, running, enoughGas, splintState, lightSplint, testGas]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const step = !lampOn && setup === "light" ? 0 : !enoughGas && setup === "light" ? 2 : splintState === "tested" ? 3 : 2;
  const complete = results.light.tested && results.dark.tested;
  const progress = setup === "dark" ? Math.min(1, hours / SETUPS.light.hoursToFill) : collected;

  const status =
    setup === "dark"
      ? running
        ? `Dark control: ${hours.toFixed(1)} hours gone by and still no bubbles at all.`
        : results.dark.tested
          ? "No gas collected in the dark, so there was nothing to test. The plant only releases the gas when it can photosynthesise."
          : "This is the control. Leave it exactly as long as the light set-up, then check whether any gas has collected."
      : !lampOn
        ? "Switch the lamp on. Nothing happens in the dark, because the pondweed needs light to photosynthesise."
        : !enoughGas
          ? running
            ? `Bubbles are rising from the cut stems — about ${spec.bubbleRate} per minute. ${hours.toFixed(1)} of ${SETUPS.light.hoursToFill} hours, tube ${Math.round(collected * 100)}% full.`
            : `Tube ${Math.round(collected * 100)}% full. Keep collecting until it is over ${Math.round(TESTABLE_FRACTION * 100)}% full.`
          : splintState === "idle"
            ? "Enough gas has collected. Light a splint, blow it out so it is only glowing, then lift the tube out keeping it upright."
            : splintState === "glowing"
              ? "The splint is glowing, not burning. Push it into the gas at the top of the tube."
              : "The splint burst back into flame — the gas is oxygen. Now run the dark control to prove light was needed.";

  const observation = complete
    ? "Gas that relights a glowing splint collected only in the light. Photosynthesis produces oxygen."
    : results.light.tested
      ? "Light set-up done: the splint relit. Now switch to the dark control and give it the same six hours."
      : "Collect the gas in the light first, then repeat the whole thing in the dark.";

  const primaryLabel = running
    ? "Collecting…"
    : setup === "dark"
      ? results.dark.tested
        ? "Back to the light set-up"
        : hours > 0
          ? "Check the tube"
          : "Leave in the dark (6 h)"
      : !lampOn
        ? "Switch on the lamp"
        : !enoughGas
          ? "Collect the gas (6 h)"
          : splintState === "idle"
            ? "Light the splint"
            : splintState === "glowing"
              ? "Test the gas"
              : "Switch to the dark control";

  const onPrimary = running
    ? () => setRunning(false)
    : setup === "dark"
      ? results.dark.tested
        ? () => selectSetup("light")
        : hours > 0
          ? testGas
          : beginCollecting
      : !lampOn
        ? () => setLampOn(true)
        : !enoughGas
          ? beginCollecting
          : splintState === "idle"
            ? lightSplint
            : splintState === "glowing"
              ? testGas
              : () => selectSetup("dark");

  /* ------------------------------------------------------------ UI panels */

  const setupPanel = (
    <div data-experiment-tour="setup-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Which set-up</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(Object.keys(SETUPS) as Setup[]).map((key) => (
          <button
            key={key}
            onClick={() => selectSetup(key)}
            className="rounded-xl px-1 py-2 text-[9px] font-black transition"
            style={
              setup === key
                ? { background: ACCENT.base, color: "#04202a" }
                : { background: "rgba(255,255,255,0.08)", color: results[key].tested ? "#a5f3fc" : "#e2e8f0" }
            }
          >
            {SETUPS[key].emoji} {SETUPS[key].short}
            {results[key].tested ? " ✓" : ""}
          </button>
        ))}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{spec.summary}</div>
      <button
        onClick={() => setLampOn((on) => !on)}
        disabled={setup === "dark"}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[9px] font-black uppercase transition disabled:opacity-40"
        style={lampOn ? { background: "#facc15", color: "#3b2f04" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
      >
        {lampOn ? "Lamp is on" : "Lamp is off"}
      </button>
    </div>
  );

  const collectionPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Collection</div>
      <div className="mt-2 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[9px] font-black uppercase">
            <span className="text-slate-400">Time in the light</span>
            <span style={{ color: ACCENT.text }}>
              {hours.toFixed(1)} / {SETUPS.light.hoursToFill} h
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full rounded-full"
              style={{ width: `${(hours / SETUPS.light.hoursToFill) * 100}%`, background: "#0ea5e9" }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[9px] font-black uppercase">
            <span className="text-slate-400">Gas in the tube</span>
            <span style={{ color: enoughGas ? "#6ee7b7" : ACCENT.text }}>{Math.round(collected * 100)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full rounded-full"
              style={{ width: `${collected * 100}%`, background: enoughGas ? "#10b981" : "#475569" }}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-950/50 px-2 py-1.5 text-[9px] font-black uppercase">
        <span className="text-slate-400">Bubble rate</span>
        <span style={{ color: lampOn && setup === "light" ? "#a5f3fc" : "#64748b" }}>
          {lampOn && setup === "light" ? `${spec.bubbleRate} per minute` : "none"}
        </span>
      </div>
      {setup === "dark" && (
        <div className="mt-2 rounded-xl bg-slate-900/60 p-2 text-[9px] leading-snug text-slate-300">
          The control is only useful if it runs for the same length of time with the same mass of pondweed.
        </div>
      )}
    </div>
  );

  const testPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Glowing splint test</div>
      <div className="mt-2 space-y-1.5">
        <button
          onClick={lightSplint}
          disabled={splintState !== "idle"}
          className="w-full rounded-xl px-2 py-2 text-left text-[10px] font-black text-white transition disabled:opacity-40"
          style={{
            background: splintState === "idle" ? ACCENT.soft : "rgba(255,255,255,0.04)",
            border: `1px solid ${splintState === "idle" ? ACCENT.ring : "rgba(255,255,255,0.06)"}`,
          }}
        >
          1 · Light the splint, then blow it out so it glows
        </button>
        <button
          onClick={testGas}
          disabled={splintState !== "glowing"}
          className="w-full rounded-xl px-2 py-2 text-left text-[10px] font-black text-white transition disabled:opacity-40"
          style={{
            background: splintState === "glowing" ? ACCENT.soft : "rgba(255,255,255,0.04)",
            border: `1px solid ${splintState === "glowing" ? ACCENT.ring : "rgba(255,255,255,0.06)"}`,
          }}
        >
          2 · Push it into the gas at the top of the tube
        </button>
      </div>
      {splintState === "tested" && (
        <div
          className="mt-2 rounded-xl p-2 text-[9px] leading-snug"
          style={
            splintResult === "relit"
              ? { background: "rgba(180,83,9,0.28)", color: "#fed7aa" }
              : { background: "rgba(30,41,59,0.6)", color: "#cbd5e1" }
          }
        >
          {splintResult === "relit"
            ? "The splint relit and burned brightly. Only oxygen does that — the gas from the pondweed is oxygen."
            : "There was no gas to test. Nothing collected in the dark."}
        </div>
      )}
      {!enoughGas && setup === "light" && (
        <div className="mt-2 text-[9px] leading-snug text-slate-500">
          Collect more gas first — testing a nearly empty tube gives no result.
        </div>
      )}
    </div>
  );

  const resultPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results</div>
      <div className="mt-2 space-y-1.5">
        {(Object.keys(SETUPS) as Setup[]).map((key) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
            <span className="text-[10px] font-black text-white">{SETUPS[key].title}</span>
            {results[key].tested ? (
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-black"
                style={
                  key === "light"
                    ? { background: "rgba(180,83,9,0.28)", color: "#fed7aa" }
                    : { background: "rgba(51,65,85,0.6)", color: "#cbd5e1" }
                }
              >
                {key === "light" ? "splint relit · oxygen" : "no gas collected"}
              </span>
            ) : (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[9px] font-black text-slate-400">not tested</span>
            )}
          </div>
        ))}
      </div>
      {complete && (
        <div className="mt-2 rounded-xl bg-cyan-950/40 p-2 text-[9px] leading-snug text-cyan-100">
          Gas collected only where there was light, and that gas relit a glowing splint. Photosynthesis produces oxygen.
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Oxygen from Photosynthesis"
          subtitle="pondweed · glowing splint test"
          symbol="🫧"
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

      <div data-experiment-tour="pondweed-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.1, 3.1, 4.9], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <PondweedScene
            setup={setup}
            collected={collected}
            lampOn={lampOn && setup === "light"}
            splintState={splintState}
            splintResult={splintResult}
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
            cornerEmoji={spec.emoji}
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
          title="Is Oxygen Produced?"
          tagline="collect the gas · test it"
          missions={MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : "▶"}
          onPrimary={onPrimary}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Set-up", value: spec.short, content: setupPanel },
            { id: "collect", label: "Collect", value: `${Math.round(collected * 100)}%`, content: collectionPanel },
            { id: "test", label: "Test", value: splintState === "tested" ? "done" : splintState === "glowing" ? "glowing" : "—", content: testPanel },
            {
              id: "results",
              label: "Results",
              value: `${Number(results.light.tested) + Number(results.dark.tested)}/2`,
              content: resultPanel,
            },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: running ? "Pause" : !lampOn && setup === "light" ? "Lamp on" : enoughGas ? "Splint" : "Collect", onClick: onPrimary, tone: running ? "red" : "green" },
            { id: "setup", label: setup === "light" ? "Dark control" : "Light set-up", onClick: () => selectSetup(setup === "light" ? "dark" : "light"), tone: "blue" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Set-up", value: spec.short, content: setupPanel },
            { id: "collect", label: "Collect", value: `${Math.round(collected * 100)}%`, content: collectionPanel },
            { id: "test", label: "Test", value: splintState === "tested" ? "done" : splintState === "glowing" ? "glowing" : "—", content: testPanel },
            {
              id: "results",
              label: "Results",
              value: `${Number(results.light.tested) + Number(results.dark.tested)}/2`,
              content: resultPanel,
            },
          ]}
        />
      )}

      {showPaper && <PondweedPaper results={results} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
