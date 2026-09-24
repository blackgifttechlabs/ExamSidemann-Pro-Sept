import { FirstPersonScienceActor, useExperimentPerformance } from '../../common/CombinedScienceExperience';
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
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

interface TitrationSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

type SampleId = "acid" | "base" | "neutral";
type PaperKind = "red" | "blue";
type ProcessAnimation = "idle" | "placing" | "collecting" | "testingRed" | "testingBlue" | "rinsing";

interface Sample {
  id: SampleId;
  name: string;
  shortName: string;
  nature: "Acidic" | "Basic (alkaline)" | "Neutral";
  liquid: string;
  redResult: string;
  blueResult: string;
}

interface ResultRecord {
  sample: SampleId;
  redResult: string;
  blueResult: string;
}

const ACCENT = EXPERIMENT_ACCENTS.fuchsia;
const LITMUS_PAPER_FILENAME = "testing-acids-and-bases-with-litmus.html";

const SAMPLES: Record<SampleId, Sample> = {
  acid: {
    id: "acid",
    name: "Dilute hydrochloric acid",
    shortName: "Sample A",
    nature: "Acidic",
    liquid: "#dbeafe",
    redResult: "Stays red",
    blueResult: "Turns red",
  },
  base: {
    id: "base",
    name: "Dilute sodium hydroxide",
    shortName: "Sample B",
    nature: "Basic (alkaline)",
    liquid: "#e0f2fe",
    redResult: "Turns blue",
    blueResult: "Stays blue",
  },
  neutral: {
    id: "neutral",
    name: "Pure distilled water",
    shortName: "Sample C",
    nature: "Neutral",
    liquid: "#cffafe",
    redResult: "Stays red",
    blueResult: "Stays blue",
  },
};

const SAMPLE_IDS = Object.keys(SAMPLES) as SampleId[];

const PROCESS_DURATION: Record<Exclude<ProcessAnimation, "idle">, number> = {
  placing: 1150,
  collecting: 1900,
  testingRed: 1850,
  testingBlue: 1850,
  rinsing: 2350,
};

const LITMUS_MISSIONS: GameMission[] = [
  { short: "Choose", title: "Choose a sample", detail: "Select the liquid to be tested on the clean spot plate.", symbol: "🧪" },
  { short: "Paper", title: "Place both papers", detail: "Put a small piece of red and blue litmus paper on the clean testing surface.", symbol: "📄" },
  { short: "Collect", title: "Collect one drop", detail: "Use a clean dropper or glass rod to collect a little of the test liquid.", symbol: "💧" },
  { short: "Red", title: "Test red litmus", detail: "Touch one drop to the red litmus paper and observe immediately.", symbol: "🔴" },
  { short: "Blue", title: "Test blue litmus", detail: "Collect a fresh drop, touch the blue paper and observe immediately.", symbol: "🔵" },
  { short: "Clean", title: "Record and rinse", detail: "Record both changes, then rinse and dry the rod before the next sample.", symbol: "🚿" },
];

const litmusTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Testing Acids and Bases with Litmus",
    text: "Litmus is a water-soluble mixture of dyes extracted from lichens. It turns red in acidic environments and blue in basic (alkaline) environments.",
    mode: "modal",
  },
  {
    title: "Always use both colours",
    text: "Red paper stays red in acid and turns blue in a base. Blue paper stays blue in a base and turns red in an acid. A neutral liquid changes neither paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="litmus-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Keep the stock clean",
    text: "Never dip the whole litmus strip into the main chemical container. Put a small piece on a clean watch glass or spot plate, then transfer one drop with a clean rod or dropper.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Observe, rinse and dry",
    text: "Observe each colour immediately. Rinse and dry the stirring rod before testing the next sample to prevent contamination.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

function clamp01(value: number) {
  return THREE.MathUtils.clamp(value, 0, 1);
}

function smooth(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function easeOutBack(value: number) {
  const t = clamp01(value);
  const c = 1.35;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
}

function phaseSeconds(phase: Exclude<ProcessAnimation, "idle">) {
  return PROCESS_DURATION[phase] / 1000;
}

function useAnimationProgress(phase: ProcessAnimation, watchedPhase: Exclude<ProcessAnimation, "idle">) {
  const elapsed = useRef(0);
  const progress = useRef(phase === watchedPhase ? 0 : 1);
  useEffect(() => {
    elapsed.current = 0;
    progress.current = phase === watchedPhase ? 0 : 1;
  }, [phase, watchedPhase]);
  useFrame((_, delta) => {
    if (phase !== watchedPhase) return;
    elapsed.current += Math.min(delta, 0.05);
    progress.current = clamp01(elapsed.current / phaseSeconds(watchedPhase));
  });
  return progress;
}

function paperBaseColour(kind: PaperKind) {
  return kind === "red" ? "#c81e3a" : "#1d4ed8";
}

function paperResultColour(kind: PaperKind, sample: Sample) {
  if (kind === "red" && sample.id === "base") return "#1d4ed8";
  if (kind === "blue" && sample.id === "acid") return "#c81e3a";
  return paperBaseColour(kind);
}

function LeaderLabel({
  anchor,
  labelPosition,
  children,
  selected = false,
  tone = "slate",
}: {
  anchor: [number, number, number];
  labelPosition: [number, number, number];
  children: React.ReactNode;
  selected?: boolean;
  tone?: "slate" | "red" | "blue" | "cyan";
}) {
  const lineColour = selected ? "#e879f9" : tone === "red" ? "#fb7185" : tone === "blue" ? "#60a5fa" : tone === "cyan" ? "#67e8f9" : "#94a3b8";
  const toneClass = tone === "red"
    ? "border-red-300/50 bg-red-950/95 text-red-50"
    : tone === "blue"
      ? "border-blue-300/50 bg-blue-950/95 text-blue-50"
      : tone === "cyan"
        ? "border-cyan-300/50 bg-cyan-950/95 text-cyan-50"
        : selected
          ? "border-fuchsia-300/60 bg-fuchsia-950/95 text-fuchsia-50"
          : "border-slate-300/35 bg-slate-950/95 text-white";
  const elbow: [number, number, number] = [anchor[0], labelPosition[1] - 0.16, anchor[2]];
  return (
    <group>
      <mesh position={anchor}>
        <sphereGeometry args={[0.032, 14, 10]} />
        <meshBasicMaterial color={lineColour} />
      </mesh>
      <Line
        points={[anchor, elbow, [labelPosition[0], labelPosition[1] - 0.16, labelPosition[2]]]}
        color={lineColour}
        lineWidth={1.25}
        dashed
        dashSize={0.055}
        gapSize={0.045}
        transparent
        opacity={0.9}
      />
      <Html position={labelPosition} center distanceFactor={7.2} style={{ pointerEvents: "none" }}>
        <div className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] shadow-xl backdrop-blur ${toneClass}`}>
          {children}
        </div>
      </Html>
    </group>
  );
}

function WetDyePatch({ kind, sample, tested, phase }: { kind: PaperKind; sample: Sample; tested: boolean; phase: ProcessAnimation }) {
  const activePhase = kind === "red" ? "testingRed" : "testingBlue";
  const progress = useAnimationProgress(phase, activePhase);
  const patchRef = useRef<THREE.Group>(null);
  const materials = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const base = useMemo(() => new THREE.Color(paperBaseColour(kind)), [kind]);
  const target = useMemo(() => {
    const result = new THREE.Color(paperResultColour(kind, sample));
    if (result.equals(base)) result.multiplyScalar(0.78);
    return result;
  }, [base, kind, sample]);

  useFrame(() => {
    const raw = tested ? 1 : phase === activePhase ? progress.current : 0;
    const wet = smooth((raw - 0.43) / 0.46);
    if (patchRef.current) {
      const spread = 0.03 + wet * 1.02;
      patchRef.current.scale.set(spread, spread * (0.88 + wet * 0.12), 1);
      patchRef.current.visible = wet > 0.006;
    }
    materials.current.forEach((material, index) => {
      if (!material) return;
      material.color.copy(base).lerp(target, smooth(wet * 1.12));
      material.opacity = (index === 0 ? 0.93 : 0.62) * wet;
      material.roughness = 0.22 + wet * 0.22;
    });
  });

  return (
    <group ref={patchRef} position={[0.16, 0, 0.013]} visible={tested || phase === activePhase}>
      {[
        [0, 0, 0.112],
        [0.075, 0.018, 0.074],
        [-0.068, 0.025, 0.065],
        [0.026, -0.058, 0.071],
        [-0.035, -0.05, 0.056],
      ].map(([x, y, radius], index) => (
        <mesh key={index} position={[x, y, index * 0.0003]}>
          <circleGeometry args={[radius, 36]} />
          <meshStandardMaterial
            ref={(material) => { materials.current[index] = material; }}
            color={paperBaseColour(kind)}
            transparent
            opacity={0}
            roughness={0.3}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      ))}
      <mesh position={[-0.02, 0.012, 0.002]}>
        <circleGeometry args={[0.055, 32]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.15} roughness={0.04} transmission={0.2} />
      </mesh>
    </group>
  );
}

function PaperStrip({ kind, tested, sample, x, phase }: { kind: PaperKind; tested: boolean; sample: Sample; x: number; phase: ProcessAnimation }) {
  const groupRef = useRef<THREE.Group>(null);
  const placingProgress = useAnimationProgress(phase, "placing");
  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const placed = phase === "placing" ? easeOutBack(placingProgress.current) : 1;
    const delay = kind === "red" ? 0 : 0.12;
    const staggered = easeOutBack(clamp01((placed - delay) / (1 - delay)));
    group.position.y = BENCH_TOP_Y + 0.075 + (1 - staggered) * 1.45;
    group.rotation.x = THREE.MathUtils.lerp(-0.18, -Math.PI / 2, staggered);
    group.rotation.z = (kind === "red" ? -0.08 : 0.08) + Math.sin(staggered * Math.PI) * (kind === "red" ? -0.12 : 0.12);
  });
  return (
    <group ref={groupRef} position={[x, BENCH_TOP_Y + 1.5, 0.28]} rotation={[-0.18, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.78, 0.23, 0.012]} />
        <meshStandardMaterial color={paperBaseColour(kind)} roughness={0.92} />
      </mesh>
      {[-0.07, -0.025, 0.025, 0.07].map((y) => (
        <mesh key={y} position={[0, y, 0.007]}>
          <boxGeometry args={[0.72, 0.004, 0.002]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.09} />
        </mesh>
      ))}
      <WetDyePatch kind={kind} sample={sample} tested={tested} phase={phase} />
    </group>
  );
}

function SpotPlate({ papersPlaced, redTested, blueTested, sample, phase }: { papersPlaced: boolean; redTested: boolean; blueTested: boolean; sample: Sample; phase: ProcessAnimation }) {
  const showPapers = papersPlaced || phase === "placing";
  return (
    <group>
      <mesh position={[0, BENCH_TOP_Y + 0.035, 0.28]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.07, 64]} />
        <meshPhysicalMaterial color="#edf6fa" transparent opacity={0.68} transmission={0.34} roughness={0.16} clearcoat={0.65} clearcoatRoughness={0.12} />
      </mesh>
      <mesh position={[0, BENCH_TOP_Y + 0.073, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.93, 1.04, 64]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.4} metalness={0.08} />
      </mesh>
      <mesh position={[0, BENCH_TOP_Y + 0.077, 0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.91, 64]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.18} roughness={0.08} transmission={0.45} />
      </mesh>
      {showPapers && (
        <>
          <PaperStrip kind="red" tested={redTested} sample={sample} x={-0.47} phase={phase} />
          <PaperStrip kind="blue" tested={blueTested} sample={sample} x={0.47} phase={phase} />
          <LeaderLabel anchor={[-0.47, BENCH_TOP_Y + 0.12, 0.28]} labelPosition={[-1.3, BENCH_TOP_Y + 1.45, 0.52]} tone="red">Red litmus paper</LeaderLabel>
          <LeaderLabel anchor={[0.47, BENCH_TOP_Y + 0.12, 0.28]} labelPosition={[1.3, BENCH_TOP_Y + 1.45, 0.52]} tone="blue">Blue litmus paper</LeaderLabel>
        </>
      )}
    </group>
  );
}

function SampleBottle({ sample, selected, x, phase }: { sample: Sample; selected: boolean; x: number; phase: ProcessAnimation }) {
  const capRef = useRef<THREE.Group>(null);
  const rippleRef = useRef<THREE.Mesh>(null);
  const collectingProgress = useAnimationProgress(phase, "collecting");
  useFrame(() => {
    const p = selected && phase === "collecting" ? collectingProgress.current : 0;
    const lift = smooth(p / 0.16) * (1 - smooth((p - 0.75) / 0.2));
    if (capRef.current) {
      capRef.current.position.set(lift * 0.28, 0.79 + lift * 0.34, 0);
      capRef.current.rotation.z = -lift * 0.55;
    }
    if (rippleRef.current) {
      const ripple = smooth((p - 0.3) / 0.2) * (1 - smooth((p - 0.66) / 0.18));
      rippleRef.current.visible = ripple > 0.01;
      rippleRef.current.scale.setScalar(0.55 + ripple * 0.9);
      (rippleRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - ripple) * 0.55;
    }
  });
  return (
    <group position={[x, BENCH_TOP_Y, -0.7]}>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.28, 0.7, 36]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.36} transmission={0.72} roughness={0.08} thickness={0.08} clearcoat={0.9} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.235, 0.255, 0.31, 36]} />
        <meshPhysicalMaterial color={sample.liquid} transparent opacity={0.66} roughness={0.08} transmission={0.18} />
      </mesh>
      <mesh ref={rippleRef} position={[0, 0.345, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.07, 0.085, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.145, 0.165, 0.18, 28, 1, true]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.42} transmission={0.65} roughness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <group ref={capRef} position={[0, 0.79, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.15, 28]} />
          <meshStandardMaterial color={selected ? ACCENT.base : "#475569"} roughness={0.5} />
        </mesh>
        {Array.from({ length: 10 }, (_, index) => (
          <mesh key={index} position={[Math.cos(index * Math.PI / 5) * 0.181, 0, Math.sin(index * Math.PI / 5) * 0.181]}>
            <boxGeometry args={[0.014, 0.12, 0.014]} />
            <meshStandardMaterial color={selected ? "#f0abfc" : "#94a3b8"} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 0.42, 0.254]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.34, 0.22]} />
        <meshStandardMaterial color={selected ? "#fdf4ff" : "#f8fafc"} roughness={0.82} />
      </mesh>
    </group>
  );
}

function AnimatedGlassRod({ phase, loaded, sample }: { phase: ProcessAnimation; loaded: boolean; sample: Sample }) {
  const groupRef = useRef<THREE.Group>(null);
  const dropletRef = useRef<THREE.Mesh>(null);
  const collectProgress = useAnimationProgress(phase, "collecting");
  const redProgress = useAnimationProgress(phase, "testingRed");
  const blueProgress = useAnimationProgress(phase, "testingBlue");
  const rinseProgress = useAnimationProgress(phase, "rinsing");
  const rest = useMemo(() => new THREE.Vector3(1.72, BENCH_TOP_Y + 0.63, 0.36), []);
  const bottleX = (SAMPLE_IDS.indexOf(sample.id) - 1) * 0.78;

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const position = rest.clone();
    let rotation = -1.12;
    let dropVisible = loaded;
    let dropFall = 0;
    let dropScale = 1;

    if (phase === "collecting") {
      const p = collectProgress.current;
      const above = new THREE.Vector3(bottleX, BENCH_TOP_Y + 1.58, -0.7);
      const dipped = new THREE.Vector3(bottleX, BENCH_TOP_Y + 1.05, -0.7);
      if (p < 0.25) position.lerpVectors(rest, above, smooth(p / 0.25));
      else if (p < 0.5) position.lerpVectors(above, dipped, smooth((p - 0.25) / 0.25));
      else if (p < 0.7) position.lerpVectors(dipped, above, smooth((p - 0.5) / 0.2));
      else position.lerpVectors(above, rest, smooth((p - 0.7) / 0.3));
      rotation = THREE.MathUtils.lerp(-1.12, 0.04, Math.sin(Math.PI * smooth(p)));
      dropVisible = p > 0.52;
      dropScale = 0.65 + smooth((p - 0.52) / 0.16) * 0.45;
    } else if (phase === "testingRed" || phase === "testingBlue") {
      const p = phase === "testingRed" ? redProgress.current : blueProgress.current;
      const targetX = phase === "testingRed" ? -0.47 : 0.47;
      const target = new THREE.Vector3(targetX, BENCH_TOP_Y + 0.88, 0.28);
      if (p < 0.36) position.lerpVectors(rest, target, smooth(p / 0.36));
      else if (p < 0.7) position.copy(target);
      else position.lerpVectors(target, rest, smooth((p - 0.7) / 0.3));
      rotation = THREE.MathUtils.lerp(-1.12, 0.05, smooth(Math.min(p / 0.34, (1 - p) / 0.28)));
      const falling = smooth((p - 0.43) / 0.2);
      dropVisible = p > 0.38 && p < 0.7;
      dropFall = falling * 0.38;
      dropScale = 1 - falling * 0.42;
    } else if (phase === "rinsing") {
      const p = rinseProgress.current;
      const rinsePoint = new THREE.Vector3(1.48, BENCH_TOP_Y + 0.6, -0.02);
      if (p < 0.25) position.lerpVectors(rest, rinsePoint, smooth(p / 0.25));
      else if (p < 0.82) {
        position.copy(rinsePoint);
        position.x += Math.sin(state.clock.elapsedTime * 11) * 0.08;
      } else position.lerpVectors(rinsePoint, rest, smooth((p - 0.82) / 0.18));
      rotation = THREE.MathUtils.lerp(-1.12, -0.78, Math.sin(Math.PI * p));
      dropVisible = false;
    }

    group.position.copy(position);
    group.rotation.set(0.08, 0, rotation);
    if (dropletRef.current) {
      dropletRef.current.visible = dropVisible;
      dropletRef.current.position.y = -0.695 - dropFall;
      dropletRef.current.scale.set(0.82 * dropScale, 1.25 * dropScale, 0.82 * dropScale);
    }
  });

  return (
    <group ref={groupRef} position={rest} rotation={[0.08, 0, -1.12]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.024, 0.024, 1.38, 18]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.5} transmission={0.82} roughness={0.04} thickness={0.08} clearcoat={1} />
      </mesh>
      <mesh position={[0.012, 0, 0.016]}>
        <cylinderGeometry args={[0.005, 0.005, 1.28, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.48} />
      </mesh>
      <mesh ref={dropletRef} position={[0, -0.695, 0]} visible={loaded}>
        <sphereGeometry args={[0.052, 24, 18]} />
        <meshPhysicalMaterial color={sample.liquid} transparent opacity={0.84} transmission={0.4} roughness={0.05} clearcoat={1} />
      </mesh>
    </group>
  );
}

function WashBottle({ phase }: { phase: ProcessAnimation }) {
  const bodyRef = useRef<THREE.Group>(null);
  const dropletsRef = useRef<Array<THREE.Mesh | null>>([]);
  const rinseProgress = useAnimationProgress(phase, "rinsing");
  useFrame((state) => {
    const p = phase === "rinsing" ? rinseProgress.current : 0;
    const flowing = p > 0.24 && p < 0.78;
    if (bodyRef.current) {
      const squeeze = flowing ? 1 - Math.sin(p * Math.PI * 8) * 0.035 : 1;
      bodyRef.current.scale.set(squeeze, 1 / squeeze, squeeze);
    }
    dropletsRef.current.forEach((drop, index) => {
      if (!drop) return;
      drop.visible = flowing;
      const travel = (state.clock.elapsedTime * 2.5 + index / dropletsRef.current.length) % 1;
      drop.position.set(-0.34 - travel * 0.76, 0.9 - travel * 0.48, 0.34 + travel * 0.12);
      drop.scale.set(0.7, 1.35, 0.7);
    });
  });
  return (
    <group position={[2.22, BENCH_TOP_Y, -0.42]}>
      <group ref={bodyRef}>
        <mesh position={[0, 0.43, 0]} castShadow>
          <cylinderGeometry args={[0.29, 0.34, 0.78, 36]} />
          <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.48} transmission={0.62} roughness={0.18} thickness={0.12} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.285, 0.325, 0.38, 36]} />
          <meshPhysicalMaterial color="#67e8f9" transparent opacity={0.48} transmission={0.24} roughness={0.12} />
        </mesh>
      </group>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.25, 24]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.42} />
      </mesh>
      <mesh position={[-0.19, 1.03, 0.17]} rotation={[0, 0, Math.PI / 2.65]}>
        <cylinderGeometry args={[0.035, 0.055, 0.55, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.38} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} ref={(mesh) => { dropletsRef.current[index] = mesh; }} visible={false}>
          <sphereGeometry args={[0.027, 14, 10]} />
          <meshPhysicalMaterial color="#67e8f9" transparent opacity={0.78} transmission={0.25} roughness={0.05} />
        </mesh>
      ))}
      <mesh position={[-0.83, 0.055, 0.44]} rotation={[-Math.PI / 2, 0, -0.16]}>
        <planeGeometry args={[0.56, 0.4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.98} />
      </mesh>
    </group>
  );
}

function LitmusScene({
  sample,
  papersPlaced,
  rodLoaded,
  redTested,
  blueTested,
  phase,
  mode,
  isMobile,
  moveVectorRef,
}: {
  sample: Sample;
  papersPlaced: boolean;
  rodLoaded: boolean;
  redTested: boolean;
  blueTested: boolean;
  phase: ProcessAnimation;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    camera.position.set(isMobile ? 3.7 : 4.4, 3.7, isMobile ? 5.5 : 6.1);
    camera.lookAt(0, BENCH_TOP_Y + 0.45, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#c026d3"
        benchColor="#eef2f4"
        posterA={{
          title: "LITMUS RULES",
          lines: ["Acid: blue litmus turns red", "Base: red litmus turns blue", "Neutral: neither paper changes", "Use both colours for an unknown"],
        }}
        posterB={{
          title: "CLEAN TESTING",
          lines: ["Use a 1–2 cm paper piece", "Transfer one drop to the paper", "Do not dip paper into stock", "Rinse and dry the rod between samples"],
        }}
      >
        <SpotPlate papersPlaced={papersPlaced} redTested={redTested} blueTested={blueTested} sample={sample} phase={phase} />
        {SAMPLE_IDS.map((id, index) => (
          <SampleBottle key={id} sample={SAMPLES[id]} selected={sample.id === id} x={(index - 1) * 0.78} phase={phase} />
        ))}
        {SAMPLE_IDS.map((id, index) => {
          const x = (index - 1) * 0.78;
          return (
            <LeaderLabel
              key={`label-${id}`}
              anchor={[x, BENCH_TOP_Y + 0.88, -0.7]}
              labelPosition={[(index - 1) * 1.45, BENCH_TOP_Y + 2.2 + (index === 1 ? 0.18 : 0), -0.78]}
              selected={sample.id === id}
            >
              {SAMPLES[id].shortName}{sample.id === id ? " · selected" : ""}
            </LeaderLabel>
          );
        })}
        <AnimatedGlassRod phase={phase} loaded={rodLoaded} sample={sample} />
        <WashBottle phase={phase} />
        <LeaderLabel anchor={[2.22, BENCH_TOP_Y + 1.08, -0.42]} labelPosition={[2.65, BENCH_TOP_Y + 1.78, -0.5]} tone="cyan">Distilled-water wash bottle</LeaderLabel>
        <LeaderLabel anchor={[0, BENCH_TOP_Y + 0.08, 1.18]} labelPosition={[0, BENCH_TOP_Y + 1.18, 1.38]}>Clean spot plate</LeaderLabel>
      </LabRoom>
      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.34} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.45, 0]} minDistance={3.4} maxDistance={11} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

function LitmusPaper({ records, onClose }: { records: ResultRecord[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={LITMUS_PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Testing Acids and Bases with Litmus Paper</h1>
        <h2 className="mt-6 font-bold uppercase">Background</h2>
        <p>Litmus is a water-soluble mixture of different dyes extracted from lichens. It turns red in acidic environments and blue in basic (alkaline) environments.</p>
        <p><strong>Red litmus paper:</strong> stays red in acids, but turns blue when it touches a base.</p>
        <p><strong>Blue litmus paper:</strong> stays blue in bases, but turns red when it touches an acid.</p>
        <p><strong>Neutral:</strong> a truly neutral substance, such as pure distilled water, causes no significant colour change to either paper.</p>
        <h2 className="mt-5 font-bold uppercase">Aim</h2>
        <p>To use both red and blue litmus paper to classify liquid samples as acidic, basic (alkaline), or neutral.</p>
        <h2 className="mt-5 font-bold uppercase">Equipment</h2>
        <p>Red and blue litmus paper strips, a clean watch glass or spot plate, a glass stirring rod or clean plastic dropper, test liquids, and a distilled-water wash bottle.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Tear off a small piece of each litmus paper, about 1–2 cm, and place both pieces on a clean watch glass or spot plate.</li>
          <li>Do not dip the whole strip into the main chemical container, because this can contaminate the stock solution.</li>
          <li>Dip a clean glass stirring rod or dropper into the test liquid.</li>
          <li>Touch the wet tip to each litmus paper, or place a single drop of liquid onto each paper.</li>
          <li>Observe the colour changes immediately.</li>
          <li>Rinse and dry the stirring rod before testing the next sample.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {records.length > 0 ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead><tr><th className="border border-slate-400 p-2">Sample</th><th className="border border-slate-400 p-2">Red litmus</th><th className="border border-slate-400 p-2">Blue litmus</th><th className="border border-slate-400 p-2">Classification</th></tr></thead>
            <tbody>
              {records.map((record) => {
                const sample = SAMPLES[record.sample];
                return <tr key={record.sample}><td className="border border-slate-400 p-2">{sample.name}</td><td className="border border-slate-400 p-2">{record.redResult}</td><td className="border border-slate-400 p-2">{record.blueResult}</td><td className="border border-slate-400 p-2">{sample.nature}</td></tr>;
              })}
            </tbody>
          </table>
        ) : <p>No results have been recorded yet. Test both litmus papers and record the observation.</p>}
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>An acid is confirmed when blue litmus turns red; a base is confirmed when red litmus turns blue. If neither red nor blue litmus changes colour significantly, the sample is neutral. Both papers must be used to classify an unknown sample reliably.</p>
      </div>
    </ExperimentPaperModal>
  );
}

export default function TitrationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: TitrationSimProps) {
  const [sampleId, setSampleId] = useState<SampleId>("acid");
  const [papersPlaced, setPapersPlaced] = useState(false);
  const [rodLoaded, setRodLoaded] = useState(false);
  const [redTested, setRedTested] = useState(false);
  const [blueTested, setBlueTested] = useState(false);
  const [records, setRecords] = useState<ResultRecord[]>([]);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [phase, setPhase] = useState<ProcessAnimation>("idle");
  const demoTimers = useRef<number[]>([]);
  const processTimer = useRef<number | null>(null);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();
  const sample = SAMPLES[sampleId];

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    if (processTimer.current !== null) window.clearTimeout(processTimer.current);
  }, []);

  const step = !papersPlaced ? 1 : !rodLoaded && !redTested ? 2 : !redTested ? 3 : !blueTested ? 4 : 5;
  const runReady = redTested && blueTested;
  const complete = records.length === SAMPLE_IDS.length;
  const progress = (papersPlaced ? 1 : 0) + (rodLoaded || redTested ? 1 : 0) + (redTested ? 1 : 0) + (blueTested ? 1 : 0);
  const busy = phase !== "idle";
  const handleModeChange = useCallback((nextMode: "learning" | "doing") => {
    if (!busy) setMode(nextMode);
  }, [busy]);

  const placePapers = useCallback(() => {
    if (busy || papersPlaced) return;
    setPhase("placing");
    processTimer.current = window.setTimeout(() => {
      setPapersPlaced(true);
      setPhase("idle");
    }, PROCESS_DURATION.placing);
  }, [busy, papersPlaced]);
  const collectDrop = useCallback(() => {
    if (busy || !papersPlaced || rodLoaded || runReady) return;
    setPhase("collecting");
    processTimer.current = window.setTimeout(() => {
      labSounds.play("dropletDrip", { volume: 0.42, throttleMs: 100 });
      setRodLoaded(true);
      setPhase("idle");
    }, PROCESS_DURATION.collecting);
  }, [busy, papersPlaced, rodLoaded, runReady]);
  const testRed = useCallback(() => {
    if (busy || !rodLoaded || redTested) return;
    setPhase("testingRed");
    window.setTimeout(() => labSounds.play("dropletDrip", { volume: 0.48, throttleMs: 100 }), 780);
    processTimer.current = window.setTimeout(() => {
      setRedTested(true);
      setRodLoaded(false);
      setPhase("idle");
    }, PROCESS_DURATION.testingRed);
  }, [busy, redTested, rodLoaded]);
  const testBlue = useCallback(() => {
    if (busy || !rodLoaded || !redTested || blueTested) return;
    setPhase("testingBlue");
    window.setTimeout(() => labSounds.play("dropletDrip", { volume: 0.48, throttleMs: 100 }), 780);
    processTimer.current = window.setTimeout(() => {
      setBlueTested(true);
      setRodLoaded(false);
      setPhase("idle");
    }, PROCESS_DURATION.testingBlue);
  }, [blueTested, busy, redTested, rodLoaded]);

  const resetBench = useCallback(() => {
    setPapersPlaced(false);
    setRodLoaded(false);
    setRedTested(false);
    setBlueTested(false);
  }, []);

  const recordAndRinse = useCallback(() => {
    if (!runReady || busy) return;
    setPhase("rinsing");
    setRecords((current) => {
      const next = { sample: sampleId, redResult: sample.redResult, blueResult: sample.blueResult };
      return [...current.filter((record) => record.sample !== sampleId), next];
    });
    const nextUntested = SAMPLE_IDS.find((id) => id !== sampleId && !records.some((record) => record.sample === id));
    processTimer.current = window.setTimeout(() => {
      resetBench();
      if (nextUntested) setSampleId(nextUntested);
      setPhase("idle");
    }, PROCESS_DURATION.rinsing);
  }, [busy, records, resetBench, runReady, sample, sampleId]);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    if (processTimer.current !== null) window.clearTimeout(processTimer.current);
    processTimer.current = null;
    setDemoActive(false);
    setPhase("idle");
    setRecords([]);
    setSampleId("acid");
    resetBench();
  }, [resetBench]);

  const handlePrimary = useCallback(() => {
    if (!papersPlaced) placePapers();
    else if (!rodLoaded && !redTested) collectDrop();
    else if (!redTested) testRed();
    else if (!rodLoaded && !blueTested) collectDrop();
    else if (!blueTested) testBlue();
    else recordAndRinse();
  }, [blueTested, collectDrop, papersPlaced, placePapers, recordAndRinse, redTested, rodLoaded, testBlue, testRed]);

  const stopDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setPhase("idle");
    setRodLoaded(false);
  }, []);

  const startDemo = useCallback(() => {
    stopDemo();
    setDemoActive(true);
    setRecords([]);
    setSampleId("acid");
    resetBench();
    setPhase("placing");
    demoTimers.current = [
      window.setTimeout(() => { setPapersPlaced(true); setPhase("idle"); }, 1150),
      window.setTimeout(() => setPhase("collecting"), 1350),
      window.setTimeout(() => { setRodLoaded(true); setPhase("idle"); }, 3250),
      window.setTimeout(() => setPhase("testingRed"), 3450),
      window.setTimeout(() => labSounds.play("dropletDrip", { volume: 0.46, throttleMs: 100 }), 4250),
      window.setTimeout(() => { setRedTested(true); setRodLoaded(false); setPhase("idle"); }, 5300),
      window.setTimeout(() => setPhase("collecting"), 5500),
      window.setTimeout(() => { setRodLoaded(true); setPhase("idle"); }, 7400),
      window.setTimeout(() => setPhase("testingBlue"), 7600),
      window.setTimeout(() => labSounds.play("dropletDrip", { volume: 0.46, throttleMs: 100 }), 8400),
      window.setTimeout(() => { setBlueTested(true); setRodLoaded(false); setPhase("idle"); }, 9450),
      window.setTimeout(() => {
        setRecords([{ sample: "acid", redResult: SAMPLES.acid.redResult, blueResult: SAMPLES.acid.blueResult }]);
        setPhase("rinsing");
      }, 9700),
      window.setTimeout(() => {
        resetBench();
        setSampleId("base");
        setPhase("idle");
        setDemoActive(false);
      }, 12050),
    ];
  }, [resetBench, stopDemo]);

  const toggleDemo = useCallback(() => demoActive ? stopDemo() : startDemo(), [demoActive, startDemo, stopDemo]);

  const chooseSample = useCallback((id: SampleId) => {
    if (papersPlaced || demoActive || busy) return;
    setSampleId(id);
  }, [busy, demoActive, papersPlaced]);

  const primaryLabel = phase === "placing" ? "Placing papers…" : phase === "collecting" ? "Collecting sample…" : phase === "testingRed" ? "Testing red paper…" : phase === "testingBlue" ? "Testing blue paper…" : phase === "rinsing" ? "Rinsing & drying…" : !papersPlaced ? "Place both papers" : !rodLoaded && !redTested ? "Collect sample" : !redTested ? "Test red paper" : !rodLoaded && !blueTested ? "Collect fresh drop" : !blueTested ? "Test blue paper" : "Record, rinse & dry";

  const status = phase === "placing"
    ? "Placing two small litmus-paper pieces onto the clean spot plate."
    : phase === "collecting"
      ? `Opening ${sample.shortName}, dipping the clean glass rod into the liquid, then returning it to the testing area.`
      : phase === "testingRed"
        ? "Transferring one drop to the red litmus paper. Watch the wet patch spread and the dye respond."
        : phase === "testingBlue"
          ? "Transferring a fresh drop to the blue litmus paper. Watch the colour at the wet spot."
          : phase === "rinsing"
            ? "Rinsing the glass rod with distilled water and drying it before the next sample."
            : complete
    ? "All three samples classified correctly using both red and blue litmus paper."
    : runReady
      ? `${sample.shortName}: red paper ${sample.redResult.toLowerCase()}; blue paper ${sample.blueResult.toLowerCase()}. Record the result, then rinse and dry the rod.`
      : !papersPlaced
        ? `Selected ${sample.shortName}. Place small pieces of both red and blue litmus on the clean spot plate.`
        : !rodLoaded && !redTested
          ? "Use the clean rod or dropper to collect one drop. Do not dip litmus paper into the stock solution."
          : !redTested
            ? "Touch the wet tip to the red litmus paper and observe immediately."
            : !rodLoaded
              ? `${sample.redResult}. Collect a fresh drop for the blue litmus paper.`
              : "Touch the wet tip to the blue litmus paper and observe immediately.";

  const observation = runReady
    ? `${sample.redResult}; ${sample.blueResult}. The sample is ${sample.nature.toLowerCase()}.`
    : redTested
      ? `Red litmus: ${sample.redResult}. You still need the blue paper result to classify the sample reliably.`
      : "Use both red and blue litmus paper: one paper alone cannot identify every unknown sample with certainty.";

  const sampleButtons = (
    <div data-experiment-tour="litmus-controls" className="grid grid-cols-3 gap-1.5">
      {SAMPLE_IDS.map((id) => (
        <button key={id} onClick={() => chooseSample(id)} disabled={papersPlaced || demoActive || busy} className={`rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-50 ${sampleId === id ? "text-white" : "bg-white/8 text-slate-300"}`} style={sampleId === id ? { background: ACCENT.base } : undefined}>
          {SAMPLES[id].shortName}
        </button>
      ))}
    </div>
  );

  const resultsPanel = (
    <div className="space-y-1.5">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl bg-red-500/12 p-2"><div className="text-[9px] font-black uppercase text-red-200">Red paper</div><div className="mt-1 text-[10px] font-bold text-white">{redTested ? sample.redResult : "Not tested"}</div></div>
        <div className="rounded-xl bg-blue-500/12 p-2"><div className="text-[9px] font-black uppercase text-blue-200">Blue paper</div><div className="mt-1 text-[10px] font-bold text-white">{blueTested ? sample.blueResult : "Not tested"}</div></div>
      </div>
      <div className={`rounded-lg px-2 py-1.5 text-center text-[10px] font-black ${runReady ? "bg-emerald-500/20 text-emerald-200" : "bg-white/5 text-slate-400"}`}>{runReady ? sample.nature : "Test both papers"}</div>
    </div>
  );

  const recordsPanel = (
    <div className="space-y-1.5">
      {records.length === 0 ? <p className="rounded-xl bg-white/5 p-2.5 text-[10px] text-slate-400">No samples recorded yet.</p> : records.map((record) => <div key={record.sample} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[10px]"><span className="font-black">{SAMPLES[record.sample].shortName}</span><span style={{ color: ACCENT.text }}>{SAMPLES[record.sample].nature}</span></div>)}
    </div>
  );

    useExperimentPerformance({reset:resetAll, prepare:()=>{setMode('learning');setShowTutorial(false);}, actions:[
{id:'papers',label:'Place the litmus papers',target:[.7,1.45,.25],gesture:'grip',perform:placePapers,done:papersPlaced},
{id:'collect-red',label:'Collect a drop with the glass rod',target:[-1,1.8,0],gesture:'grip',perform:collectDrop,done:rodLoaded},
{id:'red',label:'Touch the drop onto red litmus',target:[.5,1.45,.2],gesture:'press',perform:testRed,done:redTested},
{id:'collect-blue',label:'Collect a fresh drop',target:[-1,1.8,0],gesture:'grip',perform:collectDrop,done:rodLoaded},
{id:'blue',label:'Touch the drop onto blue litmus',target:[1,1.45,.2],gesture:'press',perform:testBlue,done:blueTested},
{id:'rinse',label:'Rinse the rod and record the results',target:[1.7,1.65,0],gesture:'rinse',perform:recordAndRinse,done:records.length>0&&!busy,seconds:4}]});

return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && <CombinedScienceHud title="Litmus Testing Lab" subtitle="Acid · Base · Neutral" symbol="🧪" accent={ACCENT} mode={mode} onModeChange={handleModeChange} modeDisabled={demoActive || busy} onBack={onBack} onRequestPaper={onRequestPaper} onRequestHowTo={onRequestHowTo} badges={records.length} demoActive={demoActive} onDemo={toggleDemo} />}

      <div data-experiment-tour="litmus-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [4.4, 3.7, 6.1], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <LitmusScene sample={sample} papersPlaced={papersPlaced} rodLoaded={rodLoaded} redTested={redTested} blueTested={blueTested} phase={phase} mode={mode} isMobile={isMobileViewport} moveVectorRef={moveVectorRef} />
        <FirstPersonScienceActor />
        </Canvas>
        {mode === "doing" && isMobileViewport && <MobileGtaNavigation moveVector={moveVectorRef} />}
        <MobileExperimentTopBar onBack={onBack} onRequestHowTo={onRequestHowTo} onRequestPaper={onRequestPaper} mode={mode} onModeChange={handleModeChange} />
        {mode === "learning" && <CombinedScienceGoalCard accent={ACCENT} emoji="🧪" cornerEmoji="🔴" status={status} running={busy || demoActive} progress={progress / 4} complete={complete} />}
        {mode === "learning" && !isMobileViewport && <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">Drag to look around · scroll to zoom</div>}
        {mode === "doing" && !isMobileViewport && <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"><div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" /><div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">WASD / arrows to move · mouse to look · click to lock</div></div>}
      </div>

      {!isMobileViewport && <CombinedScienceObjectiveRail accent={ACCENT} title="Litmus Testing" tagline="Use both colours for a reliable result" missions={LITMUS_MISSIONS} step={step} running={busy || demoActive} progress={progress / 4} complete={complete} primaryLabel={primaryLabel} primaryEmoji={runReady ? "🚿" : "▶"} onPrimary={handlePrimary} primaryDisabled={busy || demoActive} onReset={resetAll} onDemo={toggleDemo} demoActive={demoActive} observation={observation} sections={[{ id: "samples", label: "Samples", value: sample.shortName, content: sampleButtons }, { id: "results", label: "Results", value: runReady ? sample.nature : `${Number(redTested) + Number(blueTested)}/2`, content: resultsPanel }, { id: "records", label: "Recorded", value: `${records.length}/3`, content: recordsPanel }]} />}

      {mode === "learning" && <MobileExperimentControls actions={[{ id: "primary", label: primaryLabel, onClick: handlePrimary, disabled: busy || demoActive, tone: "green" }, { id: "collect", label: "Collect", onClick: collectDrop, disabled: busy || !papersPlaced || rodLoaded || runReady, tone: "blue" }, { id: "record", label: "Record", onClick: recordAndRinse, disabled: busy || !runReady, tone: "orange" }, { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" }]} panels={[{ id: "samples", label: "Samples", value: sample.shortName, content: sampleButtons }, { id: "results", label: "Results", value: runReady ? sample.nature : `${Number(redTested) + Number(blueTested)}/2`, content: resultsPanel }, { id: "records", label: "Recorded", value: `${records.length}/3`, content: recordsPanel }]} />}

      {showPaper && <LitmusPaper records={records} onClose={onClosePaper} />}
      {showTutorial && <ExperimentTutorialOverlay key={tutorialRequestKey} steps={litmusTutorialSteps} onClose={() => setShowTutorial(false)} />}
    </div>
  );
}
