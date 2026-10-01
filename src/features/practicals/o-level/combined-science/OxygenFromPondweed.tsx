import "./oxygenFromPondweed.css";
import { useExperimentPerformance } from '../../common/CombinedScienceExperience';
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { BENCH_TOP_Y, LabLighting, LabPlayer, LabRoom } from "../../common/LabEnvironment";
import {
  HeaderModeToggle,
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

/** A single bubble rising from the cut stem up into the test tube. */
function RisingBubbles({ rate, collected }: { rate: number; collected: number }) {
  const groupRef = useRef<THREE.Group>(null);
  // Fewer bubbles once the tube is nearly full, so the scene calms down.
  const count = rate > 0 ? 9 : 0;

  const seeds = useMemo(
    () => Array.from({ length: 9 }, (_, index) => ({ offset: index / 9, x: (index % 3) * 0.018 - 0.018, scale: 0.011 + (index % 4) * 0.003 })),
    [],
  );

  const bubbleTime = useRef(0);
  useFrame((_, delta) => {
    bubbleTime.current += delta;
    const group = groupRef.current;
    if (!group) return;
    const speed = 0.32 + (rate / 60) * 0.22;
    group.children.forEach((child, index) => {
      const seed = seeds[index];
      if (!seed) return;
      // Each bubble climbs from the stem to the funnel neck, then wraps round.
      const travel = ((bubbleTime.current * speed + seed.offset) % 1);
      child.position.y = travel * Math.max(0.22, 0.44 * (1 - collected));
      child.position.x = seed.x + Math.sin(travel * 9 + index) * 0.008;
      const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      material.opacity = 0.55 * (1 - Math.max(0, travel - 0.86) / 0.14);
    });
  });

  if (count === 0 || collected >= 1) return null;

  return (
    <group ref={groupRef} position={[0, 0.22, 0]}>
      {seeds.map((seed, index) => (
        <mesh key={index} position={[seed.x, 0, 0]}>
          <sphereGeometry args={[seed.scale, 20, 14]} />
          <meshPhysicalMaterial color="#effcff" transparent opacity={0.4} transmission={0.7} ior={1.0} roughness={0.025} depthWrite={false} />
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
  const tubeRef = useRef<THREE.Group>(null);
  const weedRef = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (tubeRef.current) tubeRef.current.position.y = THREE.MathUtils.damp(tubeRef.current.position.y, tubeLifted ? 0.86 : 0.5, 3.5, delta);
    if (weedRef.current) weedRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.025;
  });
  const tubeHeight = 0.44;
  // Water column left in the tube, shortened as gas collects at the closed top.
  const waterHeight = Math.max(0.02, tubeHeight * (1 - collected));


  return (
    <group position={[-0.55, BENCH_TOP_Y, 0.05]}>
      {/* Beaker */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.36, 0.34, 0.6, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.3}
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
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.36, 0.009, 10, 64]} />
        <meshPhysicalMaterial color="#effaff" transparent opacity={0.5} transmission={0.8} roughness={0.025} />
      </mesh>
      {[0.16, 0.24, 0.32, 0.4, 0.48].map((height, index) => <mesh key={height} position={[0.25, height, 0.25]}>
        <boxGeometry args={[index % 2 ? 0.04 : 0.07, 0.004, 0.003]} />
        <meshBasicMaterial color="#617273" />
      </mesh>)}
      {/* Water with sodium hydrogencarbonate */}
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.352, 0.352, 0.53, 32]} />
        <meshPhysicalMaterial color="#dceef2" transparent opacity={0.22} transmission={0.75} ior={1.33} roughness={0.04} depthWrite={false} />
      </mesh>

      {/* Pondweed: a cut stem with whorls of small leaves */}
      <group ref={weedRef} position={[0, 0.06, 0]}>
        <mesh position={[0, 0.11, 0]}>
          <cylinderGeometry args={[0.011, 0.013, 0.22, 8]} />
          <meshStandardMaterial color={setup === "dark" ? "#2f5b33" : "#3d7f42"} roughness={0.8} />
        </mesh>
        {Array.from({ length: 5 }, (_, index) => (
          <group key={index} position={[0, 0.04 + index * 0.042, 0]} rotation={[0, index * 1.2, 0]}>
            {[0, 1, 2].map((leaf) => (
              <group key={leaf} rotation={[0, leaf * Math.PI * 2 / 3, 0]}>
                <mesh position={[0.038, 0.004, 0]} rotation={[0, 0, 0.3]} scale={[0.046, 0.003, 0.012]}>
                  <sphereGeometry args={[1, 20, 12]} />
                  <meshStandardMaterial color={index % 2 ? "#4e8744" : "#356c37"} roughness={0.72} />
                </mesh>
                <mesh position={[0.035, 0.006, 0]} rotation={[0, 0, Math.PI / 2 + 0.3]}>
                  <cylinderGeometry args={[0.0008, 0.001, 0.07, 6]} />
                  <meshStandardMaterial color="#80a45d" roughness={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        ))}
        <RisingBubbles rate={lampOn ? spec.bubbleRate : 0} collected={collected} />
      </group>

      {/* Inverted filter funnel over the pondweed, standing on small glass feet */}
      <group position={[0, 0.1, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.025, 0.2, 0.28, 48, 1, true]} />
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
      <group ref={tubeRef} position={[0, 0.5, 0]}>
        <mesh>
          <latheGeometry args={[[
            new THREE.Vector2(0.051, -0.22), new THREE.Vector2(0.05, 0.2),
            new THREE.Vector2(0.046, 0.23), new THREE.Vector2(0.032, 0.255), new THREE.Vector2(0, 0.268),
            new THREE.Vector2(0, 0.259), new THREE.Vector2(0.027, 0.246), new THREE.Vector2(0.041, 0.224),
            new THREE.Vector2(0.044, 0.2), new THREE.Vector2(0.044, -0.22), new THREE.Vector2(0.051, -0.22),
          ], 64]} />
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
        {/* Remaining water column, measured up from the open bottom end */}
        <mesh position={[0, -tubeHeight / 2 + waterHeight / 2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, waterHeight, 20]} />
          <meshPhysicalMaterial color="#dceef2" transparent opacity={0.28} transmission={0.7} roughness={0.025} ior={1.33} depthWrite={false} />
        </mesh>
      </group>

      {/* Black cloth over the dark control */}
      {setup === "dark" && (
        <mesh position={[0, 0.52, 0]}>
          <cylinderGeometry args={[0.44, 0.44, 1.05, 24, 1, true]} />
          <meshStandardMaterial color="#111318" roughness={0.95} side={THREE.DoubleSide} transparent opacity={0.86} />
        </mesh>
      )}
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
function GlowingSplint({ state, result }: { state: "idle" | "glowing" | "tested"; result: SplintResult | null }) {
  const splintRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Group>(null);
  const emberRef = useRef<THREE.Mesh>(null);
  const age = useRef(0);
  useEffect(() => { age.current = 0; }, [state, result]);
  const target = useMemo(() => state === "tested"
    ? new THREE.Vector3(-0.55, BENCH_TOP_Y + 0.83, 0.05)
    : state === "glowing" ? new THREE.Vector3(0.35, BENCH_TOP_Y + 0.65, 0.22)
    : new THREE.Vector3(0.72, BENCH_TOP_Y + 0.02, 0.22), [state]);
  useFrame((frame, delta) => {
    age.current += delta;
    if (splintRef.current) {
      splintRef.current.position.lerp(target, 1 - Math.exp(-delta * 4));
      splintRef.current.rotation.z = THREE.MathUtils.damp(splintRef.current.rotation.z,
        state === "idle" ? Math.PI / 2 : state === "glowing" ? -0.45 : 0, 4, delta);
    }
    if (flameRef.current) {
      flameRef.current.visible = state === "tested" && result === "relit" && age.current > 0.95;
      const flicker = 1 + Math.sin(frame.clock.elapsedTime * 19) * 0.12 + Math.sin(frame.clock.elapsedTime * 31) * 0.06;
      flameRef.current.scale.set(1 / Math.sqrt(flicker), flicker, 1 / Math.sqrt(flicker));
      flameRef.current.rotation.z = Math.sin(frame.clock.elapsedTime * 13) * 0.06;
    }
    const ember = emberRef.current?.material;
    if (ember instanceof THREE.MeshStandardMaterial) {
      ember.emissiveIntensity = state === "idle" ? 0 : state === "tested" && result !== "relit"
        ? Math.max(0, 1.1 - age.current * 0.15) : 1.1 + Math.sin(frame.clock.elapsedTime * 6) * 0.15;
    }
  });
  return <group ref={splintRef} position={[0.72, BENCH_TOP_Y + 0.02, 0.22]} rotation={[0, 0, Math.PI / 2]}>
    <mesh castShadow>
      <boxGeometry args={[0.012, 0.34, 0.006]} />
      <meshStandardMaterial color="#c8a56e" roughness={0.92} />
    </mesh>
    {[-0.003, 0.002].map(x => <mesh key={x} position={[x, 0, 0.0032]}>
      <boxGeometry args={[0.0005, 0.33, 0.0002]} />
      <meshStandardMaterial color="#94734a" roughness={1} />
    </mesh>)}
    <mesh ref={emberRef} position={[0, 0.18, 0]}>
      <boxGeometry args={[0.013, 0.03, 0.007]} />
      <meshStandardMaterial color="#31251e" emissive="#ff6223" emissiveIntensity={0} roughness={1} />
    </mesh>
    <group ref={flameRef} position={[0, 0.22, 0]} visible={false}>
      <mesh scale={[1, 1.7, 0.65]}>
        <sphereGeometry args={[0.023, 20, 16]} />
        <meshBasicMaterial color="#f9891c" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.012, 0]} scale={[0.65, 1.15, 0.45]}>
        <sphereGeometry args={[0.023, 20, 16]} />
        <meshBasicMaterial color="#fff3ad" transparent opacity={0.9} depthWrite={false} />
      </mesh>
      <pointLight intensity={1.1} distance={0.8} color="#ffbd69" />
    </group>
  </group>;
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
  const { camera, size } = useThree();
  const cameraDistance = Math.max(3.5, 1.5 / (Math.tan(THREE.MathUtils.degToRad(27.5)) * (Math.max(1, size.width) / Math.max(1, size.height))));
  const targetY = isMobile ? BENCH_TOP_Y + 0.3 : BENCH_TOP_Y + 0.45;
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [-0.25, 3.05, cameraDistance] : [2.4, 2.8, 3.8];
    camera.position.set(...position);
    camera.lookAt(-0.25, targetY, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode, cameraDistance, targetY]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0891b2"
        benchColor="#eef3f6"
        hideWallBoards
      >
        <BenchLamp on={lampOn} />
        <PondweedApparatus setup={setup} collected={collected} lampOn={lampOn} tubeLifted={splintState !== "idle"} />
        <GlowingSplint state={splintState} result={splintResult} />

        <BicarbonateBottle />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[-0.25, targetY, 0]} minDistance={2.4} maxDistance={Math.max(10, cameraDistance * 1.3)} maxPolarAngle={1.5} />
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
  const [controlTab, setControlTab] = useState<"setup" | "collect" | "test" | "results">("setup");
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
    if (splintState !== "glowing" || (setup === "light" && !enoughGas) || (setup === "dark" && hours < SETUPS.light.hoursToFill)) return;
    setSplintState("tested");
    setResults((current) => ({ ...current, [setup]: { ...current[setup], tested: true } }));
  }, [setup, splintState, enoughGas, hours]);

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
    ? "Pause collection"
    : setup === "dark"
      ? results.dark.tested
        ? "Back to the light set-up"
        : hours >= SETUPS.light.hoursToFill
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
        : hours >= SETUPS.light.hoursToFill
          ? () => setResults(current => ({ ...current, dark: { collected: 0, tested: true } }))
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
            aria-pressed={setup === key}
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
        onClick={() => { if (lampOn) setRunning(false); setLampOn(on => !on); }}
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
          disabled={splintState !== "glowing" || (setup === "light" && !enoughGas) || (setup === "dark" && hours < SETUPS.light.hoursToFill)}
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

    useExperimentPerformance({reset:resetAll, prepare:()=>{setMode('learning');setShowTutorial(false);}, actions:[
{id:'lamp',label:'Switch on the lamp and collect oxygen',target:[-1.4,1.9,0],gesture:'press',perform:beginCollecting,done:enoughGas,seconds:8},
{id:'splint',label:'Prepare the glowing splint',target:[1.15,1.75,.2],gesture:'grip',perform:lightSplint,done:splintState==='glowing'},
{id:'test',label:'Test the collected gas with the glowing splint',target:[0,2.25,0],gesture:'grip',perform:testGas,done:splintState==='tested'}]});

return (
    <div className={`oxygen-design relative flex h-full w-full overflow-hidden bg-slate-950 text-white ${isMobileViewport ? "oxygen-design--mobile" : ""}`}>
      <HeaderModeToggle mode={mode} onChange={handleModeChange} disabled={demoActive} />

      <div data-experiment-tour="pondweed-scene" className="relative min-h-0 min-w-0 flex-1">
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

      {mode === "learning" && <section className="oxygen-controls" data-experiment-tour="lab-controls" aria-label="Photosynthesis experiment controls">
        <header className="oxygen-controls__header">
          <strong>{spec.short} set-up</strong>
          <button type="button" onClick={resetAll}>Reset</button>
        </header>
        <div className="oxygen-controls__status" aria-live="polite">{status}</div>
        <div className="oxygen-controls__primary">
          <button type="button" onClick={onPrimary}>{primaryLabel}</button>
          <button type="button" onClick={toggleDemo}>{demoActive ? "Stop demo" : "Show me"}</button>
        </div>
        <nav className="oxygen-controls__tabs" aria-label="Control panels">
          {(["setup", "collect", "test", "results"] as const).map(tab => <button key={tab} type="button"
            aria-pressed={controlTab === tab} onClick={() => setControlTab(tab)}>
            {{setup: "Set-up", collect: "Collect", test: "Test", results: "Results"}[tab]}
          </button>)}
        </nav>
        <div className="oxygen-controls__content">
          {controlTab === "setup" ? setupPanel : controlTab === "collect" ? collectionPanel : controlTab === "test" ? testPanel : resultPanel}
        </div>
        <footer className="oxygen-controls__observation" aria-live="polite">{observation}</footer>
      </section>}

      {showPaper && <PondweedPaper results={results} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
