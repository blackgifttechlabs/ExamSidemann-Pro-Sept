import { FirstPersonScienceActor, useExperimentPerformance } from '../../common/CombinedScienceExperience';
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
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
import { LabTrolley } from "../../common/LabTrolley";
import { labSounds } from "../../../../lib/audio/labSounds";

interface ForceSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.sky;

type SlopeId = "gentle" | "medium" | "steep";
type SurfaceId = "smooth" | "rough";

const G = 9.8;
const RAMP_REAL_LENGTH = 2.4; // m — the modelled run length used for the tape and timings
const RAMP_VISUAL_LENGTH = 2.9; // three.js units for the on-screen ramp
const TICK_INTERVAL = 0.02; // s — a 50 Hz ticker-timer
const RUN_DURATION_MS = 3200;
const FORCE_PAPER_FILENAME = "force-and-motion-ticker-tape.html";

const SLOPES: { id: SlopeId; label: string; degrees: number }[] = [
  { id: "gentle", label: "Gentle 12°", degrees: 12 },
  { id: "medium", label: "Medium 22°", degrees: 22 },
  { id: "steep", label: "Steep 32°", degrees: 32 },
];
const SURFACES: { id: SurfaceId; label: string; mu: number }[] = [
  { id: "smooth", label: "Smooth", mu: 0.06 },
  { id: "rough", label: "Rough", mu: 0.22 },
];

const FORCE_MISSIONS: GameMission[] = [
  { short: "Ramp", title: "Set the ramp", detail: "Choose the slope angle and surface. A steeper, smoother ramp gives a larger unbalanced force down the slope.", symbol: "📐" },
  { short: "Release", title: "Release the trolley", detail: "Let the trolley go — it speeds up as it runs down, pulling the ticker tape through the timer.", symbol: "🚗" },
  { short: "Tape", title: "Read the tape", detail: "The dots get further apart, so the trolley is travelling further each tick — it is accelerating.", symbol: "📈" },
  { short: "Result", title: "Force and motion", detail: "An unbalanced (resultant) force makes the trolley accelerate.", symbol: "🎯" },
];

const forceTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Force and Motion",
    text: "A trolley on a ramp is pulled down the slope by a component of its weight. A ticker-timer prints 50 dots a second on a tape attached to the trolley, recording how it moves.",
    mode: "modal",
  },
  {
    title: "Set up the ramp",
    text: "Choose the slope angle and the surface. These change the unbalanced force acting on the trolley.",
    mode: "bubble",
    selector: '[data-experiment-tour="force-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Release and record",
    text: "Release the trolley and watch the tape. Evenly spaced dots mean constant speed; dots that get further apart mean acceleration.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Interpret the tape",
    text: "Because the dots get further apart, the trolley is accelerating — an unbalanced force is acting on it.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

function acceleration(slope: SlopeId, surface: SurfaceId) {
  const theta = (SLOPES.find((s) => s.id === slope)!.degrees * Math.PI) / 180;
  const mu = SURFACES.find((s) => s.id === surface)!.mu;
  return Math.max(0.25, G * (Math.sin(theta) - mu * Math.cos(theta)));
}
const totalTime = (a: number) => Math.sqrt((2 * RAMP_REAL_LENGTH) / a);

interface RunRecord {
  id: string;
  slopeLabel: string;
  surfaceLabel: string;
  accel: number;
  finalV: number;
}

/* ------------------------------------------------------------------ 3D bits */

function Trolley({
  rust = false,
  distance = 0,
  speed = 0,
}: {
  rust?: boolean;
  /** How far down the ramp it has run, so the wheels turn the right amount. */
  distance?: number;
  speed?: number;
}) {
  return (
    <LabTrolley
      colour={rust ? "#b45309" : "#0ea5e9"}
      bricks={1}
      coupling="none"
      tapeClip
      distance={distance}
      speed={speed}
    />
  );
}

function TickerTimer() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.34, 0.22, 0.5]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.05, 20]} />
        <meshStandardMaterial color="#111827" metalness={0.6} />
      </mesh>
      <mesh position={[0.18, 0.03, 0]}>
        <boxGeometry args={[0.06, 0.06, 0.12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function RampSystem({
  slope,
  surface,
  fraction,
  released,
  speed,
}: {
  slope: SlopeId;
  surface: SurfaceId;
  fraction: number;
  released: boolean;
  /** Current speed down the slope, in m/s — drives the body lean. */
  speed: number;
}) {
  const theta = (SLOPES.find((s) => s.id === slope)!.degrees * Math.PI) / 180;
  const L = RAMP_VISUAL_LENGTH;
  const rampThickness = 0.08;
  const bench = BENCH_TOP_Y + 0.05;

  // Bottom-left anchor; the slope rises to the right.
  const bottom = useMemo(() => new THREE.Vector3(-1.35, bench, 0), [bench]);
  const up = useMemo(() => new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0), [theta]);
  const normal = useMemo(() => new THREE.Vector3(-Math.sin(theta), Math.cos(theta), 0), [theta]);

  const center = bottom.clone().add(up.clone().multiplyScalar(L / 2));
  const top = bottom.clone().add(up.clone().multiplyScalar(L));

  const surfaceOffset = normal.clone().multiplyScalar(rampThickness / 2 + 0.07);
  const trolleyPos = top.clone().sub(up.clone().multiplyScalar(fraction * L)).add(surfaceOffset);
  const travelled = fraction * L;

  const timerPos = top.clone().add(up.clone().multiplyScalar(0.15)).add(normal.clone().multiplyScalar(0.12));

  // Tape stretched from the timer down to the trolley.
  const tapeStart = top.clone().add(surfaceOffset).add(normal.clone().multiplyScalar(0.05));
  const tapeLength = tapeStart.distanceTo(trolleyPos.clone().add(normal.clone().multiplyScalar(0.05)));
  const tapeMid = tapeStart.clone().add(trolleyPos.clone().add(normal.clone().multiplyScalar(0.05))).multiplyScalar(0.5);

  return (
    <group>
      {/* Ramp board */}
      <group position={[center.x, center.y, center.z]} rotation={[0, 0, theta]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[L, rampThickness, 0.7]} />
          <meshStandardMaterial color={surface === "rough" ? "#5b4632" : "#c7d2d8"} roughness={surface === "rough" ? 0.95 : 0.35} metalness={0.1} />
        </mesh>
        {/* Side rail */}
        <mesh position={[0, 0.06, -0.33]}>
          <boxGeometry args={[L, 0.05, 0.04]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.3} />
        </mesh>
      </group>

      {/* Support post under the high end */}
      <mesh position={[top.x, (bench + top.y) / 2 - 0.02, 0]} castShadow>
        <boxGeometry args={[0.12, Math.max(0.05, top.y - bench), 0.5]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Stop block at the bottom */}
      <mesh position={[bottom.x - 0.12, bench + 0.09, 0]} castShadow>
        <boxGeometry args={[0.1, 0.18, 0.6]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Ticker timer at the top */}
      <group position={[timerPos.x, timerPos.y, timerPos.z]} rotation={[0, 0, theta]}>
        <TickerTimer />
      </group>

      {/* Tape */}
      <group position={[tapeMid.x, tapeMid.y, tapeMid.z]} rotation={[0, 0, theta]}>
        <mesh>
          <boxGeometry args={[Math.max(0.02, tapeLength), 0.004, 0.06]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Trolley */}
      <group position={[trolleyPos.x, trolleyPos.y, trolleyPos.z]} rotation={[0, 0, theta]}>
        <Trolley distance={travelled} speed={speed} />
      </group>

      <Html position={[center.x + 0.2, center.y + 0.9, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-sky-300/30 bg-slate-950/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-sky-100">
          {released ? "accelerating" : "held at rest"}
        </div>
      </Html>
    </group>
  );
}

function ForceScene({
  slope,
  surface,
  fraction,
  released,
  speed,
  mode,
  isMobile,
  moveVectorRef,
}: {
  slope: SlopeId;
  surface: SurfaceId;
  fraction: number;
  released: boolean;
  speed: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [4.0, 3.32, 5.4] : [4.2, 3.22, 5.6];
    camera.position.set(...position);
    camera.lookAt(0, 2.22, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0369a1"
        benchColor="#eef2f4"
        posterA={{
          title: "FORCES",
          lines: [
            "A resultant (unbalanced) force causes acceleration",
            "F = m × a",
            "Balanced forces → constant velocity or rest",
            "Steeper slope → larger force down the ramp",
          ],
        }}
        posterB={{
          title: "TICKER TAPE",
          lines: ["50 dots are printed each second", "Even spacing = constant speed", "Widening spacing = acceleration"],
        }}
      >
        <RampSystem slope={slope} surface={surface} fraction={fraction} released={released} speed={speed} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.02, 0]} opacity={0.32} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.17, 0]} minDistance={3} maxDistance={11} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* ---------------------------------------------------------------- Ticker tape */

function TickerTape({ accel, reveal, compact = false }: { accel: number; reveal: number; compact?: boolean }) {
  const width = compact ? 240 : 262;
  const height = 54;
  const pad = 10;
  const plotW = width - pad * 2;
  const tTotal = totalTime(accel);
  const revealTime = reveal * tTotal;
  const nTicks = Math.min(120, Math.floor(tTotal / TICK_INTERVAL));

  const dots: { x: number; shown: boolean }[] = [];
  for (let k = 0; k <= nTicks; k += 1) {
    const t = k * TICK_INTERVAL;
    const s = 0.5 * accel * t * t; // distance travelled by tick k
    const x = pad + (s / RAMP_REAL_LENGTH) * plotW;
    dots.push({ x, shown: t <= revealTime + 1e-6 });
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <rect x={pad} y={16} width={plotW} height={22} rx={3} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
      <text x={pad} y={12} fill="#94a3b8" fontSize="8" fontWeight="700">
        start
      </text>
      <text x={pad + plotW - 26} y={12} fill="#94a3b8" fontSize="8" fontWeight="700">
        faster →
      </text>
      {dots.map((dot, index) => (
        <circle
          key={index}
          cx={dot.x}
          cy={27}
          r={dot.shown ? 2 : 1.2}
          fill={dot.shown ? ACCENT.base : "rgba(148,163,184,0.25)"}
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function ForcePaper({ records, onClose }: { records: RunRecord[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={FORCE_PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Force and Motion — Acceleration Down a Ramp</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To show that an unbalanced force makes a trolley accelerate, using a ticker-timer and tape to record the motion.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Runway (ramp), trolley, ticker-timer, ticker tape, power supply, metre rule and blocks to raise one end.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>One end of the runway was raised to make a slope and the ticker-timer was clamped at the top.</li>
          <li>A length of tape was attached to the trolley and threaded through the timer.</li>
          <li>The timer was switched on and the trolley released to run down the slope.</li>
          <li>The spacing of the dots on the tape was examined, and the run repeated for different slopes.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {records.length > 0 ? (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Slope</th>
                <th className="border border-slate-400 p-2">Surface</th>
                <th className="border border-slate-400 p-2">Acceleration / m s⁻²</th>
                <th className="border border-slate-400 p-2">Final speed / m s⁻¹</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="border border-slate-400 p-2">{record.slopeLabel}</td>
                  <td className="border border-slate-400 p-2 text-center">{record.surfaceLabel}</td>
                  <td className="border border-slate-400 p-2 text-center">{record.accel.toFixed(2)}</td>
                  <td className="border border-slate-400 p-2 text-center">{record.finalV.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No runs have been recorded yet. Release the trolley and read the tape to record a result.</p>
        )}
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The dots on the tape get further apart, showing that the trolley travels a greater distance in each equal time
          interval — it is accelerating. The acceleration is caused by the unbalanced force acting down the slope (the
          component of the trolley&rsquo;s weight, less friction). A steeper or smoother slope gives a larger unbalanced
          force and a greater acceleration. This confirms that objects accelerate when acted on by a resultant force
          (F = ma).
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function ForceAndMotionSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ForceSimProps) {
  const [slope, setSlope] = useState<SlopeId>("medium");
  const [surface, setSurface] = useState<SurfaceId>("smooth");
  const [released, setReleased] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [records, setRecords] = useState<RunRecord[]>([]);
  const [read, setRead] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const accel = useMemo(() => acceleration(slope, surface), [slope, surface]);
  const tTotal = totalTime(accel);
  const fraction = released ? progress * progress : 0; // s ∝ t²
  const currentV = accel * (progress * tTotal);
  const finalV = accel * tTotal;
  const atBottom = released && !running && progress >= 1;
  const complete = records.length >= 1;
  const step = running ? 1 : atBottom && !read ? 2 : complete ? 3 : 0;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    // The timer stamps 50 dots a second the whole time the tape is moving.
    labSounds.loop("tickerTimer", { volume: 0.32 });
    const animate = (now: number) => {
      const next = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      setProgress(next);
      // Wheels get louder and higher-pitched as the trolley speeds up.
      labSounds.loop("trolleyRoll", { volume: 0.14 + next * 0.34, rate: 0.7 + next * 0.6 });
      if (next >= 1) {
        setProgress(1);
        setRunning(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      labSounds.stop("trolleyRoll");
      labSounds.stop("tickerTimer");
    };
  }, [running]);

  const release = useCallback(() => {
    labSounds.play("trolleyRelease", { volume: 0.55 });
    setReleased(true);
    setRead(false);
    setProgress(0);
    startRef.current = performance.now();
    setRunning(true);
  }, []);

  const readTape = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    setRead(true);
    const id = `${slope}-${surface}`;
    const record: RunRecord = {
      id,
      slopeLabel: SLOPES.find((s) => s.id === slope)!.label,
      surfaceLabel: SURFACES.find((s) => s.id === surface)!.label,
      accel,
      finalV,
    };
    setRecords((current) => [...current.filter((entry) => entry.id !== id), record]);
  }, [accel, finalV, slope, surface]);

  const resetTrolley = useCallback(() => {
    labSounds.stop("trolleyRoll");
    labSounds.stop("tickerTimer");
    setReleased(false);
    setRunning(false);
    setProgress(0);
    setRead(false);
  }, []);

  const resetAll = useCallback(() => {
    setDemoActive(false);
    resetTrolley();
    setRecords([]);
    setSlope("medium");
    setSurface("smooth");
  }, [resetTrolley]);

  const handlePrimary = useCallback(() => {
    if (running) return;
    if (atBottom && !read) readTape();
    else release();
  }, [atBottom, read, readTape, release, running]);

  const primaryLabel = running ? "Running…" : atBottom && !read ? "Read the tape" : complete ? "Run again" : "Release trolley";

  // Guided demo — release, read and repeat across the three slopes.
  const demoIndexRef = useRef(0);
  const startDemo = useCallback(() => {
    setDemoActive(true);
    setRecords([]);
    demoIndexRef.current = 0;
    setSlope(SLOPES[0].id);
    setSurface("smooth");
    setReleased(true);
    setRead(false);
    setProgress(0);
    startRef.current = performance.now();
    setRunning(true);
  }, []);
  const stopDemo = useCallback(() => {
    setDemoActive(false);
    setRunning(false);
  }, []);
  const toggleDemo = useCallback(() => {
    if (demoActive) stopDemo();
    else startDemo();
  }, [demoActive, startDemo, stopDemo]);

  useEffect(() => {
    if (!demoActive || running || !atBottom) return;
    const timer = window.setTimeout(() => {
      // record this run
      const id = `${slope}-${surface}`;
      setRecords((current) => [
        ...current.filter((entry) => entry.id !== id),
        {
          id,
          slopeLabel: SLOPES.find((s) => s.id === slope)!.label,
          surfaceLabel: SURFACES.find((s) => s.id === surface)!.label,
          accel,
          finalV,
        },
      ]);
      const nextIndex = demoIndexRef.current + 1;
      if (nextIndex >= SLOPES.length) {
        setDemoActive(false);
        setRead(true);
        return;
      }
      demoIndexRef.current = nextIndex;
      setSlope(SLOPES[nextIndex].id);
      setReleased(true);
      setRead(false);
      setProgress(0);
      startRef.current = performance.now();
      setRunning(true);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [demoActive, running, atBottom, slope, surface, accel, finalV]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = running
    ? `Trolley accelerating · ${currentV.toFixed(2)} m/s · a = ${accel.toFixed(2)} m/s²`
    : atBottom && !read
      ? "The dots got further apart — read the tape to record the run."
      : complete
        ? "Widening dot spacing shows acceleration: an unbalanced force acts down the slope."
        : "Set the slope and surface, then release the trolley and watch the ticker tape.";

  const observation = complete
    ? "Steeper or smoother slopes give a bigger unbalanced force and greater acceleration."
    : "Even dot spacing = constant speed. Dots getting further apart = acceleration.";

  const slopeButtons = (
    <div className="grid grid-cols-3 gap-1.5">
      {SLOPES.map((option) => (
        <button
          key={option.id}
          onClick={() => setSlope(option.id)}
          disabled={running}
          className={`rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-50 ${
            slope === option.id ? "text-slate-950" : "bg-white/8 text-slate-300"
          }`}
          style={slope === option.id ? { background: ACCENT.base } : undefined}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
  const surfaceButtons = (
    <div className="grid grid-cols-2 gap-1.5">
      {SURFACES.map((option) => (
        <button
          key={option.id}
          onClick={() => setSurface(option.id)}
          disabled={running}
          className={`rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-50 ${
            surface === option.id ? "bg-cyan-400 text-slate-950" : "bg-white/8 text-slate-300"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const tapePanel = (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Ticker tape</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {running ? `${currentV.toFixed(2)} m/s` : `a = ${accel.toFixed(2)} m/s²`}
        </span>
      </div>
      <TickerTape accel={accel} reveal={progress} />
    </div>
  );

  const readingPanel = (
    <div className="grid grid-cols-2 gap-2 text-center">
      <div className="rounded-xl border border-white/10 bg-black/20 p-2">
        <div className="text-[9px] font-black uppercase text-slate-500">Acceleration</div>
        <div className="text-base font-black" style={{ color: ACCENT.text }}>
          {accel.toFixed(2)}
        </div>
        <div className="text-[8px] text-slate-500">m/s²</div>
      </div>
      <div className="rounded-xl border border-white/10 bg-black/20 p-2">
        <div className="text-[9px] font-black uppercase text-slate-500">Final speed</div>
        <div className="text-base font-black text-white">{(running ? currentV : atBottom ? finalV : 0).toFixed(2)}</div>
        <div className="text-[8px] text-slate-500">m/s</div>
      </div>
    </div>
  );

  const recordsPanel = (
    <div className="space-y-1.5">
      {records.length === 0 ? (
        <p className="rounded-xl bg-white/5 p-2.5 text-[10px] text-slate-400">Read the tape after a run to record the acceleration for each slope.</p>
      ) : (
        records.map((record) => (
          <div key={record.id} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[10px]">
            <span className="font-black">{record.slopeLabel} · {record.surfaceLabel}</span>
            <span style={{ color: ACCENT.text }}>{record.accel.toFixed(2)} m/s²</span>
          </div>
        ))
      )}
    </div>
  );

    useExperimentPerformance({reset:resetAll, prepare:()=>{setMode('learning');setShowTutorial(false);}, actions:[
{id:'release',label:'Release the trolley',target:[-1.8,2.1,0],gesture:'press',perform:release,done:atBottom,seconds:3},
{id:'read',label:'Read and record the ticker tape',target:[1.3,1.55,0],gesture:'grip',perform:readTape,done:read}]});

return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Force & Motion Lab"
          subtitle="unbalanced force → acceleration"
          symbol="🚗"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={Math.min(4, records.length + (complete ? 1 : 0))}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="force-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [4.2, 3.22, 5.6], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <ForceScene
            slope={slope}
            surface={surface}
            fraction={fraction}
            released={released}
            speed={running ? currentV : 0}
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
            emoji="🚗"
            cornerEmoji="📈"
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
          title="Force & Motion"
          tagline="unbalanced force → acceleration"
          missions={FORCE_MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={atBottom && !read ? "📈" : "▶"}
          onPrimary={handlePrimary}
          primaryDisabled={running}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "slope", label: "Slope", value: SLOPES.find((s) => s.id === slope)!.label, content: slopeButtons },
            { id: "surface", label: "Surface", value: SURFACES.find((s) => s.id === surface)!.label, content: surfaceButtons },
            { id: "readings", label: "Readings", value: `${accel.toFixed(2)} m/s²`, content: readingPanel },
            { id: "tape", label: "Tape", value: `${accel.toFixed(1)} m/s²`, content: tapePanel },
            { id: "records", label: "Runs", value: `${records.length}`, content: recordsPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: running ? "Running" : atBottom && !read ? "Read tape" : "Release", onClick: handlePrimary, disabled: running, tone: "green" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "slope", label: "Slope", value: SLOPES.find((s) => s.id === slope)!.label, content: slopeButtons },
            { id: "surface", label: "Surface", value: SURFACES.find((s) => s.id === surface)!.label, content: surfaceButtons },
            { id: "tape", label: "Tape", value: `${accel.toFixed(1)} m/s²`, content: tapePanel },
            { id: "records", label: "Runs", value: `${records.length}`, content: recordsPanel },
          ]}
        />
      )}

      {showPaper && <ForcePaper records={records} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={forceTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
