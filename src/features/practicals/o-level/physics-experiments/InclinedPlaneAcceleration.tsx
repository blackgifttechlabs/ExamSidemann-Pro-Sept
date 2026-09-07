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

interface InclinedPlaneSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.sky;
const PAPER_FILENAME = "acceleration-on-an-inclined-plane.html";

const G = 9.81;
/** Real runway length modelled by the tape, in metres. */
const RUNWAY_LENGTH = 1.6;
const RUNWAY_VISUAL = 3.1;
/**
 * Where the trolley starts and finishes along the board, measured from the
 * pivot at the foot of the runway. It has to stop short of the end stop rather
 * than run off the bottom of the board.
 */
const TROLLEY_START = -RUNWAY_VISUAL + 0.62;
const TROLLEY_END = -0.34;
/** A 50 Hz ticker-timer prints one dot every 0.02 s. */
const TICK_INTERVAL = 0.02;
/** Tapes are cut into strips of 5 ticks, so each strip covers 0.1 s. */
const TICKS_PER_STRIP = 5;
const STRIP_TIME = TICK_INTERVAL * TICKS_PER_STRIP;
const RUN_DURATION_MS = 3400;
const MU = 0.08;

const ANGLES = [8, 12, 16, 20, 25] as const;

interface Strip {
  index: number;
  /** Length of the tape strip in centimetres. */
  lengthCm: number;
  /** Midpoint time of the strip, used when plotting the velocity–time graph. */
  midTime: number;
  velocity: number;
}

const INCLINE_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Set up the runway",
    detail: "Raise one end of the runway and attach the ticker-tape to the trolley. Choose the angle of the slope.",
    symbol: "📐",
  },
  {
    short: "Release",
    title: "Release the trolley",
    detail: "Let the trolley run down. The timer prints 50 dots every second on the tape as it goes.",
    symbol: "🚗",
  },
  {
    short: "Cut tape",
    title: "Cut the tape into strips",
    detail: "Cut the tape every 5 dots. Each strip covers 0.1 s, so its length is the distance travelled in that time.",
    symbol: "✂️",
  },
  {
    short: "Graph",
    title: "Plot velocity against time",
    detail: "Each strip gives a velocity. Plot them against time — the gradient of the straight line is the acceleration.",
    symbol: "📈",
  },
];

const inclineTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Acceleration down a slope",
    text: "A trolley released on a sloping runway speeds up steadily. A ticker-timer records its motion by printing dots on a paper tape at a fixed rate of 50 dots per second.",
    mode: "modal",
  },
  {
    title: "The runway and timer",
    text: "The trolley is at the top of the runway with the tape threaded through the ticker-timer. The steeper the slope, the larger the acceleration.",
    mode: "bubble",
    selector: '[data-experiment-tour="incline-scene"]',
  },
  {
    title: "Choose the slope",
    text: "Change the angle of the runway, then release the trolley and let the timer print the tape.",
    mode: "bubble",
    selector: '[data-experiment-tour="incline-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Read the tape",
    text: "Cut the tape into 5-dot strips. Each strip is 0.1 s of motion, so strip length ÷ 0.1 s gives the average velocity. The strips form a velocity–time graph and its gradient is the acceleration.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
];

function accelerationFor(angleDeg: number) {
  const theta = (angleDeg * Math.PI) / 180;
  return Math.max(0.2, G * (Math.sin(theta) - MU * Math.cos(theta)));
}

/** Positions of every printed dot, in metres from the release point. */
function dotPositions(accel: number) {
  const total = Math.sqrt((2 * RUNWAY_LENGTH) / accel);
  const dots: number[] = [];
  for (let time = 0; time <= total; time += TICK_INTERVAL) {
    dots.push(0.5 * accel * time * time);
  }
  return dots;
}

function stripsFor(accel: number): Strip[] {
  const dots = dotPositions(accel);
  const strips: Strip[] = [];
  for (let start = 0; start + TICKS_PER_STRIP < dots.length; start += TICKS_PER_STRIP) {
    const lengthM = dots[start + TICKS_PER_STRIP] - dots[start];
    const midTime = (start + TICKS_PER_STRIP / 2) * TICK_INTERVAL;
    strips.push({
      index: strips.length,
      lengthCm: lengthM * 100,
      midTime,
      velocity: lengthM / STRIP_TIME,
    });
  }
  return strips;
}

/** Least-squares gradient of the velocity–time points — the measured acceleration. */
function gradient(strips: Strip[]) {
  if (strips.length < 2) return 0;
  const n = strips.length;
  const sumX = strips.reduce((total, strip) => total + strip.midTime, 0);
  const sumY = strips.reduce((total, strip) => total + strip.velocity, 0);
  const sumXY = strips.reduce((total, strip) => total + strip.midTime * strip.velocity, 0);
  const sumXX = strips.reduce((total, strip) => total + strip.midTime * strip.midTime, 0);
  return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
}

/* ------------------------------------------------------------------ 3D bits */

function Trolley({ distance = 0, speed = 0 }: { distance?: number; speed?: number }) {
  return (
    <group>
      <LabTrolley colour="#0ea5e9" bricks={1} coupling="none" tapeClip distance={distance} speed={speed} />
      {/* Peg the ticker tape is tied to */}
      <mesh position={[0.22, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.07, 8]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}

function TickerTimer() {
  return (
    <group>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.18, 0.26]} />
        <meshStandardMaterial color="#1e293b" roughness={0.55} metalness={0.3} />
      </mesh>
      {/* Vibrating arm and carbon paper disc */}
      <mesh position={[0, 0.21, 0.05]} castShadow>
        <boxGeometry args={[0.22, 0.06, 0.05]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.2, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.01, 20]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
      <mesh position={[-0.13, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 10]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** The paper tape trailing behind the trolley, with the dots printed so far. */
function Tape({ dots, travelled }: { dots: number[]; travelled: number }) {
  const visible = dots.filter((position) => position <= travelled);
  return (
    <group>
      <mesh position={[-travelled / 2 - 0.1, 0.26, -0.16]}>
        <boxGeometry args={[Math.max(0.02, travelled + 0.2), 0.001, 0.055]} />
        <meshStandardMaterial color="#fefce8" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {visible.map((position, index) => (
        <mesh key={index} position={[-position - 0.1, 0.262, -0.16]}>
          <cylinderGeometry args={[0.006, 0.006, 0.001, 8]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      ))}
    </group>
  );
}

function Runway({
  angleDeg,
  travelled,
  dots,
  released,
  speed,
}: {
  angleDeg: number;
  travelled: number;
  dots: number[];
  released: boolean;
  /** Current speed down the runway, in m/s. */
  speed: number;
}) {
  const theta = (angleDeg * Math.PI) / 180;
  /**
   * The runway pivots about its lower end, which rests on the bench. A negative
   * Z rotation lifts the far (−x) end: rotating local (−L, 0) by +θ would map it
   * to y = −L sin θ and bury the board in the bench.
   */
  const along = TROLLEY_START + (travelled / RUNWAY_LENGTH) * (TROLLEY_END - TROLLEY_START);
  /** Distance from the pivot to the point the support stack holds up. */
  const supportSpan = RUNWAY_VISUAL - 0.3;
  const supportHeight = Math.max(0.05, 0.05 + supportSpan * Math.sin(theta) - 0.03);

  return (
    <group position={[0, BENCH_TOP_Y, 0]}>
      {/* Wooden blocks stacked under the raised end */}
      <group position={[RUNWAY_VISUAL / 2 - supportSpan * Math.cos(theta), 0, 0]}>
        <mesh position={[0, supportHeight / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.42, supportHeight, 0.5]} />
          <meshStandardMaterial color="#8b5e34" roughness={0.8} />
        </mesh>
        {/* Grain lines, so the stack reads as blocks rather than one slab */}
        {Array.from({ length: Math.max(1, Math.round(supportHeight / 0.09)) }, (_, index) => (
          <mesh key={index} position={[0, (index + 1) * 0.09, 0.252]}>
            <boxGeometry args={[0.42, 0.006, 0.004]} />
            <meshStandardMaterial color="#6b4423" roughness={0.9} />
          </mesh>
        ))}
      </group>

      <group position={[RUNWAY_VISUAL / 2, 0.05, 0]} rotation={[0, 0, -theta]}>
        {/* Runway board */}
        <mesh position={[-RUNWAY_VISUAL / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[RUNWAY_VISUAL, 0.06, 0.62]} />
          <meshStandardMaterial color="#a8763e" roughness={0.66} />
        </mesh>
        {/* Side rails */}
        {[-0.28, 0.28].map((z) => (
          <mesh key={z} position={[-RUNWAY_VISUAL / 2, 0.05, z]} castShadow>
            <boxGeometry args={[RUNWAY_VISUAL, 0.05, 0.03]} />
            <meshStandardMaterial color="#8b5e34" roughness={0.7} />
          </mesh>
        ))}
        {/* End stop at the foot of the runway, so the trolley has something to run into */}
        <mesh position={[-0.02, 0.07, 0]} castShadow>
          <boxGeometry args={[0.04, 0.12, 0.62]} />
          <meshStandardMaterial color="#6b4423" roughness={0.75} />
        </mesh>

        {/* Ticker-timer clamped at the raised end */}
        <group position={[-RUNWAY_VISUAL + 0.24, 0.03, 0]}>
          <TickerTimer />
        </group>

        {/* Trolley, running from the raised end down to the low end */}
        <group position={[along, 0.03, 0]}>
          <Trolley distance={along - TROLLEY_START} speed={speed} />
          {released && (
            <Tape
              dots={dots.map((metres) => (metres / RUNWAY_LENGTH) * (TROLLEY_END - TROLLEY_START))}
              travelled={along - TROLLEY_START}
            />
          )}
        </group>
      </group>

      {/* Angle annotation at the pivot */}
      <Html position={[RUNWAY_VISUAL / 2 - 0.5, 0.24, 0.42]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="rounded-md border border-sky-300/30 bg-slate-950/90 px-1.5 py-0.5 text-[8px] font-black uppercase text-sky-200">
          θ = {angleDeg}°
        </div>
      </Html>
    </group>
  );
}

function InclineScene({
  angleDeg,
  travelled,
  dots,
  released,
  speed,
  mode,
  isMobile,
  moveVectorRef,
}: {
  angleDeg: number;
  travelled: number;
  dots: number[];
  released: boolean;
  /** Current speed down the runway, in m/s. */
  speed: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.6, 3.5, 5.6] : [1.1, 3.3, 4.9];
    camera.position.set(...position);
    camera.lookAt(0, 1.9, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0284c7"
        benchColor="#eef2f4"
        posterA={{
          title: "TICKER TAPE",
          lines: [
            "50 dots per second → 1 tick = 0.02 s",
            "5-tick strip = 0.1 s of motion",
            "velocity = strip length ÷ 0.1 s",
            "acceleration = gradient of v–t graph",
          ],
        }}
        posterB={{
          title: "ON A SLOPE",
          lines: ["a = g sin θ − μg cos θ", "Steeper slope → bigger acceleration", "Friction always reduces a"],
        }}
      >
        <Runway angleDeg={angleDeg} travelled={travelled} dots={dots} released={released} speed={speed} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.9, 0]} minDistance={2.6} maxDistance={11} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* --------------------------------------------------------------- Tape chart */

/** The cut strips stood side by side — the classic "tape chart" velocity–time graph. */
function TapeChart({ strips, accel }: { strips: Strip[]; accel: number }) {
  if (!strips.length) {
    return <p className="text-[10px] font-bold text-slate-500">Release the trolley to print a tape.</p>;
  }
  const maxV = Math.max(...strips.map((strip) => strip.velocity)) * 1.15;
  const width = 230;
  const height = 120;
  const barWidth = width / strips.length;

  return (
    <svg viewBox={`0 0 ${width + 32} ${height + 34}`} className="w-full">
      {/* Axes */}
      <line x1={26} y1={4} x2={26} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      <line x1={26} y1={height + 6} x2={width + 28} y2={height + 6} stroke="#475569" strokeWidth={1.2} />
      {strips.map((strip) => {
        const barHeight = (strip.velocity / maxV) * height;
        return (
          <rect
            key={strip.index}
            x={28 + strip.index * barWidth}
            y={height + 6 - barHeight}
            width={barWidth - 2}
            height={barHeight}
            fill="rgba(14,165,233,0.35)"
            stroke="#38bdf8"
            strokeWidth={0.8}
          />
        );
      })}
      {/* Best-fit line through the tops of the strips */}
      <line
        x1={28 + barWidth / 2}
        y1={height + 6 - (strips[0].velocity / maxV) * height}
        x2={28 + (strips.length - 0.5) * barWidth}
        y2={height + 6 - (strips[strips.length - 1].velocity / maxV) * height}
        stroke="#fbbf24"
        strokeWidth={1.6}
        strokeDasharray="5 3"
      />
      <text x={2} y={12} fill="#94a3b8" fontSize={8} fontWeight={800}>
        v / m s⁻¹
      </text>
      <text x={4} y={height + 4} fill="#94a3b8" fontSize={8}>
        0
      </text>
      <text x={width - 4} y={height + 22} fill="#94a3b8" fontSize={8} fontWeight={800}>
        t / s
      </text>
      <text x={30} y={height + 22} fill="#94a3b8" fontSize={7}>
        each strip = 0.1 s
      </text>
      <text x={30} y={16} fill="#fbbf24" fontSize={9} fontWeight={900}>
        gradient = {accel.toFixed(2)} m s⁻²
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function InclinePaper({
  angleDeg,
  strips,
  measured,
  onClose,
}: {
  angleDeg: number;
  strips: Strip[];
  measured: number;
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Acceleration of a Trolley on an Inclined Plane</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To use a ticker-tape timer to find the acceleration of a trolley running down a sloping runway.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Runway (inclined plane), trolley, ticker-timer with a 50 Hz supply, paper tape, carbon paper disc, wooden blocks, metre rule, scissors, graph paper.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>One end of the runway was raised on blocks so that it made an angle of {angleDeg}° with the bench.</li>
          <li>The ticker-timer was clamped at the raised end and a length of tape attached to the trolley and threaded through the timer.</li>
          <li>The timer was switched on and the trolley released from rest at the top of the runway.</li>
          <li>The tape was cut into strips of five dot-spaces. As the timer prints 50 dots per second, each strip represents 0.1 s.</li>
          <li>The length of each strip was measured, and the average velocity over that strip found from length ÷ 0.1 s.</li>
          <li>The velocities were plotted against time and the gradient of the straight line measured.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <p>Slope angle = {angleDeg}° · Timer frequency = 50 Hz · Time per tick = 0.02 s · Strip length = 5 ticks = 0.1 s</p>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Strip</th>
              <th className="border border-slate-400 p-2">Length / cm</th>
              <th className="border border-slate-400 p-2">Time interval / s</th>
              <th className="border border-slate-400 p-2">Velocity / m s⁻¹</th>
              <th className="border border-slate-400 p-2">Mid-time / s</th>
            </tr>
          </thead>
          <tbody>
            {(strips.length ? strips : []).map((strip) => (
              <tr key={strip.index}>
                <td className="border border-slate-400 p-2 text-center">{strip.index + 1}</td>
                <td className="border border-slate-400 p-2 text-center">{strip.lengthCm.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">0.10</td>
                <td className="border border-slate-400 p-2 text-center">{strip.velocity.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{strip.midTime.toFixed(2)}</td>
              </tr>
            ))}
            {!strips.length &&
              [0, 1, 2, 3].map((row) => (
                <tr key={row}>
                  <td className="border border-slate-400 p-2 text-center">{row + 1}</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2 text-center">0.10</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Graph and calculation</h2>
        <p>
          A graph of velocity (y-axis) against time (x-axis) gave a straight line, showing that the acceleration was
          uniform. Because acceleration is the rate of change of velocity, the gradient of this line is the acceleration:
        </p>
        <p className="mt-2 text-center font-bold">
          a = Δv / Δt = {measured ? measured.toFixed(2) : "…"} m s⁻²
        </p>
        <p className="mt-2">
          For comparison, the theoretical value is a = g sin θ − μg cos θ. With θ = {angleDeg}° and a small friction
          coefficient, this gives about {accelerationFor(angleDeg).toFixed(2)} m s⁻².
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The tape was kept in line with the runway so that friction at the timer did not slow the trolley unevenly.</li>
          <li>The first few dots, which are crowded together, were ignored when cutting the strips.</li>
          <li>The mains frequency was assumed to be exactly 50 Hz.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The tape strips increased in length by the same amount each time, so the trolley gained velocity at a steady
          rate. The velocity–time graph was a straight line whose gradient gave an acceleration of about{" "}
          {measured ? measured.toFixed(2) : "—"} m s⁻² down the slope.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function InclinedPlaneAccelerationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: InclinedPlaneSimProps) {
  const [angleDeg, setAngleDeg] = useState<number>(16);
  const [travelled, setTravelled] = useState(0);
  const [running, setRunning] = useState(false);
  const [released, setReleased] = useState(false);
  const [cut, setCut] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const accel = accelerationFor(angleDeg);
  const dots = useMemo(() => dotPositions(accel), [accel]);
  const allStrips = useMemo(() => stripsFor(accel), [accel]);
  const strips = cut ? allStrips : [];
  const measured = useMemo(() => gradient(allStrips), [allStrips]);
  const finished = travelled >= RUNWAY_LENGTH - 1e-6;

  const progress = travelled / RUNWAY_LENGTH;
  /** v² = u² + 2as with u = 0, so the speed follows straight from how far it has run. */
  const speed = running ? Math.sqrt(2 * accel * travelled) : 0;
  const step = cut && strips.length ? 3 : finished ? 2 : released ? 1 : 0;
  const complete = cut && strips.length > 0;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    // The timer runs the whole way down, stamping 50 dots a second.
    labSounds.loop("tickerTimer", { volume: 0.3 });
    const animate = (now: number) => {
      const fraction = THREE.MathUtils.clamp((now - startRef.current) / RUN_DURATION_MS, 0, 1);
      // Distance grows as t², matching uniform acceleration from rest.
      setTravelled(fraction * fraction * RUNWAY_LENGTH);
      labSounds.loop("trolleyRoll", { volume: 0.12 + fraction * 0.34, rate: 0.7 + fraction * 0.65 });
      if (fraction >= 1) {
        setRunning(false);
        setTravelled(RUNWAY_LENGTH);
        labSounds.play("trolleyStop", { volume: 0.45 });
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
    setCut(false);
    setReleased(true);
    setTravelled(0);
    startRef.current = performance.now();
    setRunning(true);
  }, []);

  const cutTape = useCallback(() => {
    if (!finished) return;
    labSounds.play("paperRustle", { volume: 0.5 });
    setCut(true);
  }, [finished]);

  const changeAngle = useCallback((next: number) => {
    setAngleDeg(next);
    setRunning(false);
    setReleased(false);
    setCut(false);
    setTravelled(0);
  }, []);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setRunning(false);
    setReleased(false);
    setCut(false);
    setTravelled(0);
  }, []);

  const toggleDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setCut(false);
    setReleased(true);
    setTravelled(0);
    startRef.current = performance.now();
    setRunning(true);
    demoTimers.current.push(window.setTimeout(() => setCut(true), RUN_DURATION_MS + 500));
    demoTimers.current.push(window.setTimeout(() => setDemoActive(false), RUN_DURATION_MS + 1400));
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? `The strips get steadily longer, so the velocity–time graph is a straight line. Its gradient gives a = ${measured.toFixed(2)} m s⁻².`
    : finished
      ? "The tape is printed. Now cut it into 5-dot strips to turn it into a velocity–time graph."
      : running
        ? "The trolley is accelerating — watch the dots on the tape spread further and further apart."
        : `Runway set at ${angleDeg}°. Release the trolley to print the tape.`;

  const observation = complete
    ? `Strip lengths rise by roughly the same amount each 0.1 s, giving a uniform acceleration of ${measured.toFixed(2)} m s⁻².`
    : "Dots close together mean slow motion; dots spreading apart mean the trolley is speeding up.";

  const primaryLabel = complete ? "Run again" : finished ? "Cut the tape into strips" : running ? "Running…" : "Release the trolley";

  const angleControls = (
    <div data-experiment-tour="incline-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Slope angle</span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {angleDeg}°
        </span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1">
        {ANGLES.map((option) => {
          const active = option === angleDeg;
          return (
            <button
              key={option}
              onClick={() => changeAngle(option)}
              className="rounded-lg px-1 py-2 text-[10px] font-black transition"
              style={active ? { background: ACCENT.base, color: "#04121c" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option}°
            </button>
          );
        })}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-2 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Theory a</div>
          <div className="text-sm font-black text-white">{accel.toFixed(2)}</div>
          <div className="text-[8px] text-slate-500">m s⁻²</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-2 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Time of run</div>
          <div className="text-sm font-black text-white">{Math.sqrt((2 * RUNWAY_LENGTH) / accel).toFixed(2)}</div>
          <div className="text-[8px] text-slate-500">s</div>
        </div>
      </div>
    </div>
  );

  const chartPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Tape chart</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {strips.length} strips
        </span>
      </div>
      <div className="mt-1.5">
        <TapeChart strips={strips} accel={measured} />
      </div>
    </div>
  );

  const stripTable = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Strip readings</span>
      {strips.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Cut the tape to fill in the table.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">#</th>
              <th className="py-0.5 text-left font-black uppercase">Length / cm</th>
              <th className="py-0.5 text-right font-black uppercase">v / m s⁻¹</th>
            </tr>
          </thead>
          <tbody>
            {strips.map((strip) => (
              <tr key={strip.index} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{strip.index + 1}</td>
                <td className="py-1 font-bold">{strip.lengthCm.toFixed(1)}</td>
                <td className="py-1 text-right font-black">{strip.velocity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Inclined Plane Lab"
          subtitle="ticker tape → velocity–time graph"
          symbol="📐"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={complete ? 4 : step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="incline-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1.1, 3.3, 4.9], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <InclineScene
            angleDeg={angleDeg}
            travelled={travelled}
            dots={dots}
            released={released}
            speed={speed}
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
            emoji="📐"
            cornerEmoji="🚗"
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
          title="Acceleration on a Slope"
          tagline="ticker tape → velocity–time graph"
          missions={INCLINE_MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : finished ? "✂️" : running ? "⏳" : "▶"}
          onPrimary={complete ? release : finished ? cutTape : release}
          primaryDisabled={running}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "angle", label: "Slope", value: `${angleDeg}°`, content: angleControls },
            { id: "chart", label: "Graph", value: complete ? `${measured.toFixed(2)} m/s²` : "—", content: chartPanel },
            { id: "table", label: "Strips", value: `${strips.length}`, content: stripTable },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "release", label: running ? "Running" : "Release", onClick: release, disabled: running, tone: "green" },
            { id: "cut", label: "Cut tape", onClick: cutTape, disabled: !finished || cut, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "angle", label: "Slope", value: `${angleDeg}°`, content: angleControls },
            { id: "chart", label: "Graph", value: complete ? `${measured.toFixed(2)} m/s²` : "—", content: chartPanel },
            { id: "table", label: "Strips", value: `${strips.length}`, content: stripTable },
          ]}
        />
      )}

      {showPaper && <InclinePaper angleDeg={angleDeg} strips={strips} measured={measured} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={inclineTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
