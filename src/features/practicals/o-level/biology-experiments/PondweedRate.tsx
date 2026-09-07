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
import { labSounds } from "../../../../lib/audio/labSounds";
import { ExperimentResultsGraph, type GraphPoint } from "../../common/ExperimentResultsGraph";

interface PondweedSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.lime;
const PAPER_FILENAME = "light-intensity-and-rate-of-photosynthesis.html";

/* ------------------------------------------------------------------ Science */

/** Lamp distances in centimetres, as set along a metre rule. */
const DISTANCES = [10, 15, 20, 25, 30, 40, 50];

/** Counting period, in simulated seconds. */
const COUNT_PERIOD_S = 60;
/** Simulated seconds per real second — a one-minute count takes ~10 s to watch. */
const TIME_SCALE = 6;

/** Maximum rate once light is no longer the limiting factor. */
const MAX_RATE = 60;
/** Light intensity at which the rate is half of its maximum. */
const HALF_SATURATION = 25;

/**
 * Light intensity follows an inverse-square law: doubling the distance from the
 * lamp quarters the intensity reaching the pondweed. The arbitrary units are
 * scaled so that 10 cm gives an intensity of 100.
 */
function lightIntensity(distanceCm: number): number {
  return 10000 / (distanceCm * distanceCm);
}

/**
 * Bubbles per minute. The response saturates: at high light intensity some
 * other factor (carbon dioxide concentration or temperature) becomes limiting,
 * so the graph levels off instead of rising for ever.
 */
function bubblesPerMinute(distanceCm: number): number {
  const intensity = lightIntensity(distanceCm);
  return (MAX_RATE * intensity) / (intensity + HALF_SATURATION);
}

const MISSIONS: GameMission[] = [
  { short: "Set up", title: "Set up the pondweed", detail: "Put a fresh cut shoot of Elodea in a boiling tube of sodium hydrogencarbonate solution, cut end upwards, and place the heat shield between the lamp and the tube.", symbol: "🌱" },
  { short: "Acclimatise", title: "Let the bubbling settle", detail: "Move the lamp to the chosen distance and wait two minutes so the rate becomes steady before you count.", symbol: "⏳" },
  { short: "Count", title: "Count for one minute", detail: "Count the bubbles leaving the cut stem for exactly one minute, and repeat for a mean.", symbol: "🫧" },
  { short: "Plot", title: "Plot the graph", detail: "Move the lamp to each distance, then plot rate against light intensity (1/d²) and describe the shape.", symbol: "📈" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Counting bubbles of oxygen",
    text: "Pondweed releases oxygen when it photosynthesises. Counting the bubbles from the cut stem gives you a measure of how fast photosynthesis is going.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "The shoot sits in sodium hydrogencarbonate solution, which supplies plenty of carbon dioxide. A glass tank of water between lamp and tube absorbs the lamp's heat, so only the light intensity changes.",
    mode: "bubble",
    selector: '[data-experiment-tour="pondweed-scene"]',
  },
  {
    title: "Move the lamp along the rule",
    text: "The distance is measured on the metre rule. Light intensity is proportional to 1 ÷ distance², so moving the lamp twice as far away quarters the intensity.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Watch for the plateau",
    text: "Close to the lamp the graph levels off. Light is no longer limiting — carbon dioxide or temperature has taken over as the limiting factor.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** Oxygen bubbles rising from the cut stem, at a rate set by the lamp. */
function RisingBubbles({ ratePerMinute, active }: { ratePerMinute: number; active: boolean }) {
  const count = 14;
  const group = useRef<THREE.Group>(null);
  const offsets = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        phase: index / count,
        x: (Math.random() - 0.5) * 0.03,
        z: (Math.random() - 0.5) * 0.03,
        size: 0.008 + Math.random() * 0.006,
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    // Bubbles per second sets how fast each bubble sweeps up the tube.
    const speed = active ? Math.max(0.05, (ratePerMinute / 60) * 0.55) : 0;
    const travel = 0.46;
    group.current.children.forEach((child, index) => {
      const offset = offsets[index];
      if (!offset) return;
      const progress = (offset.phase + state.clock.elapsedTime * speed) % 1;
      child.position.y = progress * travel;
      child.visible = active && ratePerMinute > 0.5 && progress < 0.97;
      const scale = 0.7 + progress * 0.5;
      child.scale.setScalar(scale);
    });
  });

  return (
    <group ref={group}>
      {offsets.map((offset, index) => (
        <mesh key={index} position={[offset.x, 0, offset.z]}>
          <sphereGeometry args={[offset.size, 8, 6]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.72} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function PondweedTube({ ratePerMinute, counting }: { ratePerMinute: number; counting: boolean }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        y: 0.06 + (index / 16) * 0.34,
        angle: index * 1.9,
        length: 0.035 + (index % 3) * 0.008,
      })),
    [],
  );

  return (
    <group position={[0.35, BENCH_TOP_Y + 0.02, 0]}>
      {/* Boiling tube */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.8, 26, 1, true]} />
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
      <mesh position={[0, 0.025, 0]}>
        <sphereGeometry args={[0.075, 22, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#e3f2fb" transparent opacity={0.22} transmission={0.84} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {/* Sodium hydrogencarbonate solution */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.067, 0.067, 0.56, 22]} />
        <meshStandardMaterial color="#d8effa" transparent opacity={0.45} roughness={0.16} />
      </mesh>

      {/* Elodea shoot, cut end upwards */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.44, 8]} />
        <meshStandardMaterial color="#2f6b31" roughness={0.75} />
      </mesh>
      {leaves.map((leaf, index) => (
        <mesh
          key={index}
          position={[Math.cos(leaf.angle) * 0.014, leaf.y + 0.06, Math.sin(leaf.angle) * 0.014]}
          rotation={[0.5, leaf.angle, 0]}
        >
          <planeGeometry args={[leaf.length, leaf.length * 2.2]} />
          <meshStandardMaterial color="#3f8f3c" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Paper clip weighting the shoot down */}
      <mesh position={[0.012, 0.075, 0]} rotation={[0, 0, 0.4]}>
        <torusGeometry args={[0.016, 0.003, 8, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.35} />
      </mesh>

      <group position={[0, 0.5, 0]}>
        <RisingBubbles ratePerMinute={ratePerMinute} active />
      </group>

      <Html position={[0, 0.98, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[112px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Elodea in NaHCO₃</div>
          <div className="mt-0.5 text-[9px] font-black" style={{ color: counting ? "#bef264" : "#94a3b8" }}>
            {ratePerMinute.toFixed(0)} bubbles/min
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Glass tank of water that absorbs the lamp's heat. */
function HeatShield() {
  return (
    <group position={[-0.15, BENCH_TOP_Y + 0.02, 0]}>
      <mesh position={[0, 0.19, 0]}>
        <boxGeometry args={[0.14, 0.38, 0.44]} />
        <meshPhysicalMaterial
          color="#dbeefb"
          transparent
          opacity={0.3}
          transmission={0.8}
          roughness={0.06}
          depthWrite={false}
        />
      </mesh>
      <Html position={[0, 0.52, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[108px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Water heat shield</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-sky-300">keeps temperature constant</div>
        </div>
      </Html>
    </group>
  );
}

/** Lamp sliding along a metre rule; x position encodes the set distance. */
function SlidingLamp({ distanceCm, on }: { distanceCm: number; on: boolean }) {
  // Map 10–50 cm onto the bench so the movement is visible.
  const x = -0.55 - ((distanceCm - 10) / 40) * 1.5;
  const intensityFraction = lightIntensity(distanceCm) / lightIntensity(10);

  return (
    <group position={[x, BENCH_TOP_Y + 0.02, 0]}>
      {/* Base */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.06, 20]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 0.34, 10]} />
        <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Shade pointing at the tube */}
      <mesh position={[0.1, 0.42, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.13, 0.2, 20, 1, true]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.35} roughness={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.16, 0.42, 0]}>
        <sphereGeometry args={[0.05, 14, 12]} />
        <meshStandardMaterial
          color={on ? "#fffbe8" : "#5b5b62"}
          emissive={on ? "#ffef9f" : "#000000"}
          emissiveIntensity={on ? 1.8 : 0}
        />
      </mesh>
      {on && <pointLight position={[0.24, 0.42, 0]} intensity={4 + intensityFraction * 12} distance={3.4} color="#fff6dc" />}

      <Html position={[0, 0.68, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[96px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[10px] font-black leading-tight text-white">{distanceCm} cm</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-lime-300">from the tube</div>
        </div>
      </Html>
    </group>
  );
}

/** Metre rule lying on the bench, used to set the lamp distance. */
function MetreRule() {
  return (
    <group position={[-1.0, BENCH_TOP_Y + 0.005, 0.34]}>
      <mesh receiveShadow>
        <boxGeometry args={[2.4, 0.012, 0.09]} />
        <meshStandardMaterial color="#e8dcb5" roughness={0.75} />
      </mesh>
      {Array.from({ length: 25 }, (_, index) => index).map((index) => (
        <mesh key={index} position={[-1.2 + index * 0.1, 0.008, 0.028]}>
          <boxGeometry args={[0.004, 0.004, 0.03]} />
          <meshStandardMaterial color="#3f3f46" />
        </mesh>
      ))}
    </group>
  );
}

function PondweedScene({
  distanceCm,
  ratePerMinute,
  counting,
  mode,
  isMobile,
  moveVectorRef,
}: {
  distanceCm: number;
  ratePerMinute: number;
  counting: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [1.9, 3.2, 4.4] : [2.1, 3.0, 4.4];
    camera.position.set(...position);
    camera.lookAt(-0.3, 1.95, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 50;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#65a30d"
        benchColor="#eef2ea"
        posterA={{
          title: "LIGHT INTENSITY",
          lines: [
            "Light intensity ∝ 1 ÷ distance²",
            "Move the lamp twice as far → a quarter the light",
            "Count bubbles of oxygen per minute",
            "NaHCO₃ solution supplies carbon dioxide",
          ],
        }}
        posterB={{
          title: "LIMITING FACTORS",
          lines: [
            "Low light: rate rises with light intensity",
            "High light: the graph levels off",
            "Then CO₂ or temperature is limiting",
            "A water tank absorbs the lamp's heat",
          ],
        }}
      >
        <MetreRule />
        <SlidingLamp distanceCm={distanceCm} on />
        <HeatShield />
        <PondweedTube ratePerMinute={ratePerMinute} counting={counting} />

        {/* Test-tube rack holding the boiling tube */}
        <group position={[0.35, BENCH_TOP_Y, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.36, 0.1, 0.3]} />
            <meshStandardMaterial color="#6b4a2f" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.32, -0.12]} castShadow>
            <boxGeometry args={[0.36, 0.42, 0.05]} />
            <meshStandardMaterial color="#7a5636" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <torusGeometry args={[0.085, 0.014, 10, 22]} />
            <meshStandardMaterial color="#8a6440" roughness={0.6} />
          </mesh>
        </group>

        {/* Thermometer in a beaker, checking the temperature stays constant */}
        <group position={[0.78, BENCH_TOP_Y + 0.02, -0.42]}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.075, 0.075, 0.2, 20, 1, true]} />
            <meshPhysicalMaterial color="#e8f0f8" transparent opacity={0.26} transmission={0.7} roughness={0.08} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.075, 0]}>
            <cylinderGeometry args={[0.068, 0.068, 0.13, 20]} />
            <meshStandardMaterial color="#dbeeff" transparent opacity={0.55} roughness={0.2} />
          </mesh>
          <mesh position={[0.02, 0.24, 0]} rotation={[0, 0, 0.18]}>
            <cylinderGeometry args={[0.012, 0.012, 0.44, 10]} />
            <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.55} roughness={0.1} />
          </mesh>
          <Html position={[0, 0.52, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-slate-200">
              25 °C — kept constant
            </div>
          </Html>
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[-0.3, 1.9, 0]} minDistance={2.0} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function PondweedPaper({ results, onClose }: { results: Record<number, number>; onClose: () => void }) {
  const recorded = DISTANCES.filter((distance) => distance in results);

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Investigating the Effect of Light Intensity on the Rate of Photosynthesis
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To find out how light intensity affects the rate of photosynthesis in pondweed, measured by counting the
          bubbles of oxygen released per minute.
        </p>

        <h2 className="mt-5 font-bold uppercase">Word equation</h2>
        <p className="text-center italic">carbon dioxide + water → glucose + oxygen (light energy, chlorophyll)</p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Fresh shoot of Elodea (pondweed) about 8 cm long, boiling tube, test-tube rack, 1% sodium hydrogencarbonate
          solution, bench lamp, metre rule, glass tank of water (heat shield), thermometer, stop-clock, paper clip,
          scissors.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            A fresh shoot of pondweed was cut and placed in a boiling tube of sodium hydrogencarbonate solution with the
            cut end upwards, weighted with a paper clip.
          </li>
          <li>A glass tank of water was placed between the lamp and the tube to absorb the lamp's heat.</li>
          <li>The lamp was set at 10 cm from the tube, measured along a metre rule.</li>
          <li>The pondweed was left for two minutes so that the rate of bubbling became steady.</li>
          <li>The bubbles leaving the cut stem were counted for exactly one minute.</li>
          <li>The count was repeated three times at each distance and a mean calculated.</li>
          <li>Steps 3 to 6 were repeated at 15, 20, 25, 30, 40 and 50 cm.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">Light intensity, changed by moving the lamp (1 ÷ d²)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Number of bubbles of oxygen released per minute</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Same piece of pondweed, temperature (heat shield), carbon dioxide concentration, counting period,
                background light in the room
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {recorded.length === 0 ? (
          <p className="italic">No readings recorded yet — count the bubbles at a few distances first.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Distance d (cm)</th>
                <th className="border border-slate-400 p-2">Light intensity (1/d² × 10⁴)</th>
                <th className="border border-slate-400 p-2">Bubbles per minute</th>
              </tr>
            </thead>
            <tbody>
              {recorded.map((distance) => (
                <tr key={distance}>
                  <td className="border border-slate-400 p-2 text-center">{distance}</td>
                  <td className="border border-slate-400 p-2 text-center">{lightIntensity(distance).toFixed(1)}</td>
                  <td className="border border-slate-400 p-2 text-center">{Math.round(results[distance])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The number of bubbles released per minute increased as the lamp was moved closer to the pondweed, because the
          light intensity increased and more light energy was available for photosynthesis. When rate is plotted against
          light intensity the graph rises steeply at first and then levels off. On the steep part light intensity is the
          limiting factor. On the flat part light is no longer limiting — the rate is being held back by another factor,
          most likely the carbon dioxide concentration or the temperature.
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Counting bubbles assumes every bubble is the same size, which is not exactly true. Collecting the gas in a
            capillary tube and measuring its length or volume is more reliable.
          </li>
          <li>
            Some oxygen dissolves in the water instead of forming bubbles, so the count under-estimates the true rate.
          </li>
          <li>
            Without the water tank the lamp would warm the tube, so temperature as well as light intensity would be
            changing and the experiment would not be a fair test.
          </li>
          <li>Room lighting adds a background intensity, so the true intensity is not exactly 1/d².</li>
          <li>The pondweed should be left to settle at each new distance, and each count repeated for a mean.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function PondweedRateSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: PondweedSimProps) {
  const [distanceIndex, setDistanceIndex] = useState(2); // 20 cm
  const [elapsed, setElapsed] = useState(0);
  const [counting, setCounting] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [results, setResults] = useState<Record<number, number>>({});

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const distance = DISTANCES[distanceIndex];
  const trueRate = bubblesPerMinute(distance);
  /** Bubbles counted so far in this one-minute period. */
  const bubblesCounted = Math.floor((trueRate * elapsed) / COUNT_PERIOD_S);
  const countFinished = elapsed >= COUNT_PERIOD_S;

  useEffect(() => {
    if (!counting) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = Math.min(((now - startRef.current) / 1000) * TIME_SCALE, COUNT_PERIOD_S);
      setElapsed(next);
      if (next >= COUNT_PERIOD_S) {
        setCounting(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [counting]);

  /* Record the count once the minute is up. */
  useEffect(() => {
    if (!countFinished) return;
    setResults((current) => (distance in current ? current : { ...current, [distance]: trueRate }));
  }, [countFinished, distance, trueRate]);

  const startCount = useCallback(() => {
    labSounds.loop("bubbleRelease", { volume: 0.25 });
    startRef.current = performance.now() - (elapsed / TIME_SCALE) * 1000;
    setCounting(true);
  }, [elapsed]);

  const pause = useCallback(() => {
    labSounds.stop("bubbleRelease");
    setCounting(false);
  }, []);

  const resetCount = useCallback(() => {
    labSounds.stop("bubbleRelease");
    setCounting(false);
    setDemoActive(false);
    setElapsed(0);
  }, []);

  const selectDistance = useCallback((index: number) => {
    setCounting(false);
    setDemoActive(false);
    setElapsed(0);
    setDistanceIndex(index);
  }, []);

  const clearResults = useCallback(() => {
    setResults({});
    resetCount();
  }, [resetCount]);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setCounting(false);
      return;
    }
    setDemoActive(true);
    setElapsed(0);
    startRef.current = performance.now();
    setCounting(true);
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const recordedCount = Object.keys(results).length;
  const step = recordedCount >= 4 ? 3 : counting ? 2 : recordedCount > 0 ? 2 : elapsed > 0 ? 1 : 0;
  const complete = recordedCount >= DISTANCES.length;
  const progress = elapsed / COUNT_PERIOD_S;

  /* Rate against light intensity — the plot that reveals the plateau. */
  const graphPoints: GraphPoint[] = DISTANCES.map((item) => {
    if (!(item in results)) return { x: lightIntensity(item), y: 0, pending: true };
    return { x: lightIntensity(item), y: results[item] };
  });

  const status = counting
    ? `${Math.floor(elapsed)} s — ${bubblesCounted} bubbles counted at ${distance} cm.`
    : countFinished
      ? `At ${distance} cm: ${Math.round(trueRate)} bubbles per minute (light intensity ${lightIntensity(distance).toFixed(1)}).`
      : `Lamp set at ${distance} cm. Let the bubbling settle, then count for one minute.`;

  const observation = complete
    ? "The graph rises steeply then levels off. On the flat part light is no longer the limiting factor — CO₂ or temperature is."
    : recordedCount > 0
      ? `${recordedCount} of ${DISTANCES.length} distances recorded. Halving the distance should roughly quadruple the light intensity.`
      : "Count at each distance in turn, then plot rate against 1/d².";

  const primaryLabel = counting ? "Counting…" : countFinished ? "Reset count" : elapsed > 0 ? "Continue" : "Count for 1 minute";

  /* ------------------------------------------------------------ UI panels */

  const distancePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Lamp distance</span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {distance} cm
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {DISTANCES.map((item, index) => {
          const recorded = item in results;
          const active = index === distanceIndex;
          return (
            <button
              key={item}
              onClick={() => selectDistance(index)}
              className="relative rounded-xl px-1 py-2 text-[10px] font-black transition"
              style={
                active
                  ? { background: ACCENT.base, color: "#1a2005" }
                  : { background: "rgba(255,255,255,0.08)", color: recorded ? "#a7f3d0" : "#e2e8f0" }
              }
            >
              {item}
              {recorded && !active && <span className="absolute right-0.5 top-0.5 text-[7px]">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-950/50 px-2 py-1.5 text-[9px]">
        <span className="text-slate-400">Light intensity (1/d² × 10⁴)</span>
        <span className="font-black" style={{ color: ACCENT.text }}>
          {lightIntensity(distance).toFixed(1)}
        </span>
      </div>
    </div>
  );

  const countPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Bubble count</span>
        <span className="text-2xl font-black tabular-nums" style={{ color: ACCENT.text }}>
          {bubblesCounted}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full" style={{ width: `${Math.max(2, progress * 100)}%`, background: ACCENT.base }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase">
        <span className="text-slate-400">
          {Math.floor(elapsed)} s of {COUNT_PERIOD_S} s
        </span>
        <span style={{ color: ACCENT.text }}>{countFinished ? `${Math.round(trueRate)} per min` : "counting…"}</span>
      </div>
    </div>
  );

  const graphPanel = (
    <ExperimentResultsGraph
      points={graphPoints}
      xLabel="Light intensity (1/d²)"
      yLabel="Bubbles / min"
      accentHex={ACCENT.base}
      caption="Rate against light intensity"
      xMin={0}
      xMax={100}
      yMax={MAX_RATE}
      footer="Steep at low intensity, then flat — that flat part is where light stops being the limiting factor."
    />
  );

  const resultsTable = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <button onClick={clearResults} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="grid grid-cols-3 gap-1 text-[8px] font-black uppercase text-slate-500">
          <span>d / cm</span>
          <span className="text-center">1/d²</span>
          <span className="text-right">Bubbles/min</span>
        </div>
        {DISTANCES.map((item) => {
          const recorded = item in results;
          return (
            <div key={item} className="grid grid-cols-3 gap-1 text-[10px]">
              <span className="font-black text-white">{item}</span>
              <span className="text-center text-slate-300">{lightIntensity(item).toFixed(1)}</span>
              <span className="text-right font-black" style={{ color: recorded ? ACCENT.text : "#64748b" }}>
                {recorded ? Math.round(results[item]) : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Pondweed Lab"
          subtitle="count the bubbles of oxygen"
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

      <div data-experiment-tour="pondweed-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [2.1, 3.0, 4.4], fov: 50, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <PondweedScene
            distanceCm={distance}
            ratePerMinute={trueRate}
            counting={counting}
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
            cornerEmoji="💡"
            status={status}
            running={counting}
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
          title="Light Intensity & Photosynthesis"
          tagline="count the bubbles of oxygen"
          missions={MISSIONS}
          step={step}
          running={counting}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={counting ? "⏳" : countFinished ? "↺" : "▶"}
          onPrimary={counting ? pause : countFinished ? resetCount : startCount}
          onReset={resetCount}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "distance", label: "Lamp", value: `${distance}cm`, content: distancePanel },
            { id: "count", label: "Count", value: `${bubblesCounted}`, content: countPanel },
            { id: "graph", label: "Graph", value: `${recordedCount}/${DISTANCES.length}`, content: graphPanel },
            { id: "table", label: "Table", value: `${recordedCount}`, content: resultsTable },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "count",
              label: counting ? "Pause" : countFinished ? "Reset" : "Count 1 min",
              onClick: counting ? pause : countFinished ? resetCount : startCount,
              tone: counting ? "red" : "green",
            },
            {
              id: "next",
              label: "Next distance",
              onClick: () => selectDistance((distanceIndex + 1) % DISTANCES.length),
              tone: "orange",
            },
            { id: "reset", label: "Clear all", onClick: clearResults, tone: "dark" },
          ]}
          panels={[
            { id: "distance", label: "Lamp", value: `${distance}cm`, content: distancePanel },
            { id: "count", label: "Count", value: `${bubblesCounted}`, content: countPanel },
            { id: "graph", label: "Graph", value: `${recordedCount}/${DISTANCES.length}`, content: graphPanel },
            { id: "table", label: "Table", value: `${recordedCount}`, content: resultsTable },
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
