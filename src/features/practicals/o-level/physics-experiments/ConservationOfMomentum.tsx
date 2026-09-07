"use client";

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { BENCH_TOP_Y, LabLighting, LabPlayer, LabRoom } from "../../common/LabEnvironment";
import { LabTrolley } from "../../common/LabTrolley";
import { labSounds } from "../../../../lib/audio/labSounds";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";

interface MomentumSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.fuchsia;
const PAPER_FILENAME = "conservation-of-momentum-trolleys.html";

/** Half-length of the track, in metres, in the modelled world. */
const TRACK_HALF = 1.35;
const TRACK_VISUAL_HALF = 2.5;
const M_TO_UNITS = TRACK_VISUAL_HALF / TRACK_HALF;
/** Trolleys touch when their centres are this far apart. */
const CONTACT_GAP = 0.28;
/** Playback is slowed so the collision is easy to watch. */
const TIME_SCALE = 0.55;

type CollisionKind = "sticky" | "springy";

const MASS_OPTIONS = [0.8, 1.3, 1.8] as const;
const SPEED_OPTIONS = [0.4, 0.6, 0.8, 1] as const;

interface RunRecord {
  id: string;
  kind: CollisionKind;
  m1: number;
  m2: number;
  u1: number;
  u2: number;
  v1: number;
  v2: number;
}

const MOMENTUM_MISSIONS: GameMission[] = [
  {
    short: "Track",
    title: "Compensate the track",
    detail: "Tilt the runway just enough that a trolley given a push keeps moving at constant speed — friction is now cancelled out.",
    symbol: "🛤️",
  },
  {
    short: "Masses",
    title: "Measure the masses",
    detail: "Weigh each trolley, including any extra bricks stacked on it, and record the masses in kilograms.",
    symbol: "⚖️",
  },
  {
    short: "Collide",
    title: "Make them collide",
    detail: "Push the first trolley into the second and let the light gates time both before and after the collision.",
    symbol: "💥",
  },
  {
    short: "Compare",
    title: "Compare the momentum",
    detail: "Add up mv before the collision and after it. The two totals should agree to within a few per cent.",
    symbol: "🧮",
  },
];

const momentumTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Conservation of momentum",
    text: "Momentum is mass × velocity. When two bodies collide and no outside force acts, the total momentum before the collision equals the total momentum after it.",
    mode: "modal",
  },
  {
    title: "The trolley track",
    text: "Two trolleys sit on a friction-compensated runway with light gates to time them. Card blades on top break the light beams.",
    mode: "bubble",
    selector: '[data-experiment-tour="momentum-scene"]',
  },
  {
    title: "Set up the collision",
    text: "Choose the masses, the speed of the first trolley, and whether the trolleys stick together (pin and cork) or bounce apart (springy buffers).",
    mode: "bubble",
    selector: '[data-experiment-tour="momentum-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Check the totals",
    text: "The momentum table adds up m₁u₁ + m₂u₂ before and m₁v₁ + m₂v₂ after. Compare them and work out the percentage difference.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
];

/** Velocities after the collision, from conservation of momentum (and of kinetic energy when springy). */
function collisionResult(kind: CollisionKind, m1: number, m2: number, u1: number, u2: number) {
  if (kind === "sticky") {
    const v = (m1 * u1 + m2 * u2) / (m1 + m2);
    return { v1: v, v2: v };
  }
  return {
    v1: ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2),
    v2: ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2),
  };
}

/* ------------------------------------------------------------------ 3D bits */

function Trolley({
  colour,
  bricks,
  kind,
  facing,
  distance,
  speed,
  impact,
  label,
}: {
  colour: string;
  bricks: number;
  kind: CollisionKind;
  facing: 1 | -1;
  distance: number;
  speed: number;
  impact: number;
  label: string;
}) {
  return (
    <LabTrolley
      colour={colour}
      bricks={bricks}
      facing={facing}
      // Pin and cork lock together; springy buffers bounce apart.
      coupling={kind === "sticky" ? (facing === 1 ? "pin" : "cork") : "spring"}
      distance={distance}
      speed={speed}
      impact={impact}
      lightGateCard
      label={label}
    />
  );
}

function LightGate({ x, active, label }: { x: number; active: boolean; label: string }) {
  return (
    <group position={[x, 0, 0]}>
      {[-0.34, 0.34].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.08, 0.32, 0.1]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.34, 0]} castShadow>
            <boxGeometry args={[0.07, 0.1, 0.09]} />
            <meshStandardMaterial color={active ? "#f43f5e" : "#64748b"} emissive={active ? "#f43f5e" : "#000000"} emissiveIntensity={active ? 0.7 : 0} />
          </mesh>
        </group>
      ))}
      {/* The infrared beam between the arms */}
      <mesh position={[0, 0.34, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.62, 6]} />
        <meshStandardMaterial color={active ? "#fb7185" : "#e11d48"} transparent opacity={active ? 0.15 : 0.55} />
      </mesh>
      <Html position={[0, 0.58, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="rounded border border-white/20 bg-slate-950/90 px-1 py-0.5 text-[7px] font-black uppercase text-slate-200">{label}</div>
      </Html>
    </group>
  );
}

function Track({
  x1,
  x2,
  v1,
  v2,
  impact,
  m1Bricks,
  m2Bricks,
  kind,
  stuck,
}: {
  x1: number;
  x2: number;
  v1: number;
  v2: number;
  impact: number;
  m1Bricks: number;
  m2Bricks: number;
  kind: CollisionKind;
  stuck: boolean;
}) {
  return (
    <group position={[0, BENCH_TOP_Y, 0]}>
      {/* Runway, very slightly tilted to compensate for friction */}
      <group rotation={[0, 0, 0.012]}>
        <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
          <boxGeometry args={[TRACK_VISUAL_HALF * 2 + 0.6, 0.07, 0.78]} />
          <meshStandardMaterial color="#a8763e" roughness={0.66} />
        </mesh>
        {[-0.36, 0.36].map((z) => (
          <mesh key={z} position={[0, 0.1, z]} castShadow>
            <boxGeometry args={[TRACK_VISUAL_HALF * 2 + 0.6, 0.06, 0.03]} />
            <meshStandardMaterial color="#8b5e34" roughness={0.7} />
          </mesh>
        ))}

        <group position={[x1 * M_TO_UNITS, 0.075, 0]}>
          <Trolley
            colour="#d946ef"
            bricks={m1Bricks}
            kind={kind}
            facing={1}
            distance={x1 * M_TO_UNITS}
            speed={v1 * M_TO_UNITS}
            impact={impact}
            label="1"
          />
        </group>
        <group position={[x2 * M_TO_UNITS, 0.075, 0]}>
          <Trolley
            colour="#22d3ee"
            bricks={m2Bricks}
            kind={kind}
            facing={-1}
            distance={x2 * M_TO_UNITS}
            speed={v2 * M_TO_UNITS}
            impact={impact}
            label="2"
          />
        </group>

        <LightGate x={-1.5} active={Math.abs(x1 * M_TO_UNITS + 1.5) < 0.16} label="Gate A" />
        <LightGate x={1.5} active={Math.abs(x2 * M_TO_UNITS - 1.5) < 0.16 || Math.abs(x1 * M_TO_UNITS - 1.5) < 0.16} label="Gate B" />
      </group>

      {/* Small shim under the raised end, for friction compensation */}
      <mesh position={[-TRACK_VISUAL_HALF - 0.1, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.03, 0.6]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} />
      </mesh>

      {stuck && (
        <Html position={[((x1 + x2) / 2) * M_TO_UNITS, 0.75, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="rounded-lg border border-fuchsia-300/40 bg-fuchsia-950/90 px-2 py-1 text-center">
            <div className="text-[8px] font-black uppercase text-fuchsia-200">Stuck together</div>
            <div className="text-[7px] font-bold text-fuchsia-100">pin driven into cork</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function MomentumScene({
  x1,
  x2,
  v1,
  v2,
  impact,
  m1Bricks,
  m2Bricks,
  kind,
  stuck,
  mode,
  isMobile,
  moveVectorRef,
}: {
  x1: number;
  x2: number;
  v1: number;
  v2: number;
  impact: number;
  m1Bricks: number;
  m2Bricks: number;
  kind: CollisionKind;
  stuck: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 3.3, 5.9] : [0.2, 3.05, 5.1];
    camera.position.set(...position);
    camera.lookAt(0, 1.75, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 58 : 50;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#c026d3"
        benchColor="#eef2f4"
        benchSize={[9.4, 4.4]}
        posterA={{
          title: "MOMENTUM",
          lines: [
            "momentum p = m v  (kg m s⁻¹)",
            "Total momentum before = total after",
            "True when no external force acts",
            "Sticky collision: they move off together",
          ],
        }}
        posterB={{
          title: "COLLISIONS",
          lines: ["Elastic: kinetic energy also conserved", "Inelastic: some KE becomes heat and sound", "Momentum is conserved in both"],
        }}
      >
        <Track
          x1={x1}
          x2={x2}
          v1={v1}
          v2={v2}
          impact={impact}
          m1Bricks={m1Bricks}
          m2Bricks={m2Bricks}
          kind={kind}
          stuck={stuck}
        />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={8} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.75, 0]} minDistance={2.8} maxDistance={12} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function MomentumPaper({ runs, onClose }: { runs: RunRecord[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Verifying the Conservation of Linear Momentum</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To show that the total momentum of two colliding trolleys before the collision is equal to their total momentum after it.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Two dynamics trolleys, level runway, slotted brick masses, balance, two light gates with a timer (or a ticker-timer and tape), pin-and-cork couplings, springy buffers, metre rule.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The runway was friction-compensated: one end was raised slightly until a trolley, given a gentle push, ran on at constant speed.</li>
          <li>The mass of each trolley, together with any brick masses on it, was measured on a balance.</li>
          <li>Trolley 2 was placed at rest in the middle of the runway and trolley 1 pushed towards it.</li>
          <li>The light gates recorded the velocity of trolley 1 before the collision and the velocities of both trolleys after it.</li>
          <li>The momentum of each trolley (mass × velocity) was calculated before and after the collision and the totals compared.</li>
          <li>The experiment was repeated with different masses, different speeds, and with springy buffers instead of the pin and cork.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="border border-slate-400 p-1.5">Run</th>
              <th className="border border-slate-400 p-1.5">Type</th>
              <th className="border border-slate-400 p-1.5">m₁ / kg</th>
              <th className="border border-slate-400 p-1.5">u₁ / m s⁻¹</th>
              <th className="border border-slate-400 p-1.5">m₂ / kg</th>
              <th className="border border-slate-400 p-1.5">u₂ / m s⁻¹</th>
              <th className="border border-slate-400 p-1.5">v₁ / m s⁻¹</th>
              <th className="border border-slate-400 p-1.5">v₂ / m s⁻¹</th>
              <th className="border border-slate-400 p-1.5">p before</th>
              <th className="border border-slate-400 p-1.5">p after</th>
            </tr>
          </thead>
          <tbody>
            {(runs.length ? runs : []).map((run, index) => {
              const before = run.m1 * run.u1 + run.m2 * run.u2;
              const after = run.m1 * run.v1 + run.m2 * run.v2;
              return (
                <tr key={run.id}>
                  <td className="border border-slate-400 p-1.5 text-center">{index + 1}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.kind === "sticky" ? "Sticks" : "Bounces"}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.m1.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.u1.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.m2.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.u2.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.v1.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{run.v2.toFixed(2)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{before.toFixed(3)}</td>
                  <td className="border border-slate-400 p-1.5 text-center">{after.toFixed(3)}</td>
                </tr>
              );
            })}
            {!runs.length &&
              [0, 1, 2].map((row) => (
                <tr key={row}>
                  <td className="border border-slate-400 p-1.5 text-center">{row + 1}</td>
                  {Array.from({ length: 9 }, (_, cell) => (
                    <td key={cell} className="border border-slate-400 p-1.5">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs">All momentum values are in kg m s⁻¹, taking motion to the right as positive.</p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The runway was friction-compensated so that the only significant force during the collision was between the trolleys.</li>
          <li>The trolleys were kept on the runway so that they moved in a straight line.</li>
          <li>Small losses to friction, sound and heat mean the totals agree only to within a few per cent.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          In every run the total momentum after the collision agreed with the total momentum before it, to within
          experimental error. This verifies the principle of conservation of linear momentum: when no external force
          acts, the total momentum of a system is unchanged by a collision. Note that in the sticking (inelastic)
          collisions kinetic energy was <em>not</em> conserved, even though momentum was.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function ConservationOfMomentumSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MomentumSimProps) {
  const [kind, setKind] = useState<CollisionKind>("sticky");
  const [m1, setM1] = useState<number>(0.8);
  const [m2, setM2] = useState<number>(0.8);
  const [u1, setU1] = useState<number>(0.6);
  const [target2Moving, setTarget2Moving] = useState(false);
  const [x1, setX1] = useState(-1.05);
  const [x2, setX2] = useState(0.15);
  const [collided, setCollided] = useState(false);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const [velocities, setVelocities] = useState({ v1: 0, v2: 0 });
  const [impact, setImpact] = useState(0);

  const stateRef = useRef({ x1: -1.05, x2: 0.15, v1: 0, v2: 0, collided: false, impact: 0 });
  /** Light gates already beeped for this run, so each one only sounds once. */
  const gatesPassedRef = useRef({ a: false, b: false });
  const lastFrame = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const u2 = target2Moving ? -0.35 : 0;
  const { v1, v2 } = collisionResult(kind, m1, m2, u1, u2);
  const pBefore = m1 * u1 + m2 * u2;
  const pAfter = m1 * v1 + m2 * v2;
  const percentDifference = pBefore === 0 ? 0 : Math.abs(((pAfter - pBefore) / pBefore) * 100);
  const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const keAfter = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

  const step = runs.length >= 3 ? 3 : collided ? 2 : running ? 1 : 0;
  const complete = runs.length >= 3;
  const progress = running ? THREE.MathUtils.clamp((x1 + TRACK_HALF) / (2 * TRACK_HALF), 0, 1) : Math.min(1, runs.length / 3);

  /** Physics loop — constant velocity, with one instantaneous momentum exchange on contact. */
  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrame.current) / 1000) * TIME_SCALE;
      lastFrame.current = now;
      const state = stateRef.current;
      const previousX1 = state.x1;
      const previousX2 = state.x2;
      state.x1 += state.v1 * dt;
      state.x2 += state.v2 * dt;
      state.impact *= Math.pow(0.5, dt / 0.22);

      if (!state.collided && state.x2 - state.x1 <= CONTACT_GAP) {
        const approach = Math.abs(state.v1 - state.v2);
        const result = collisionResult(kind, m1, m2, state.v1, state.v2);
        state.v1 = result.v1;
        state.v2 = result.v2;
        state.x1 = state.x2 - CONTACT_GAP;
        state.collided = true;
        state.impact = 1;
        setCollided(true);
        // Pin-and-cork lands as a dull thud; the springy buffers ring.
        labSounds.play(kind === "sticky" ? "trolleyCollisionSoft" : "trolleyCollisionHard", {
          volume: Math.min(1, 0.35 + approach * 0.5),
          rate: 0.9 + Math.min(0.35, approach * 0.3),
        });
      }

      // Light gates: beep the first time a trolley's card crosses the beam.
      const gateAt = -1.5 / M_TO_UNITS;
      const crossed = (before: number, after: number, gate: number) =>
        (before - gate) * (after - gate) <= 0 && before !== after;
      if (!gatesPassedRef.current.a && crossed(previousX1, state.x1, gateAt)) {
        gatesPassedRef.current.a = true;
        labSounds.play("lightGateBeep", { volume: 0.5 });
      }
      if (!gatesPassedRef.current.b && (crossed(previousX2, state.x2, -gateAt) || crossed(previousX1, state.x1, -gateAt))) {
        gatesPassedRef.current.b = true;
        labSounds.play("lightGateBeep", { volume: 0.5, rate: 1.15 });
      }

      // Wheels on wood: pitch and level follow whichever trolley is quicker.
      const fastest = Math.max(Math.abs(state.v1), Math.abs(state.v2));
      if (fastest > 0.02) {
        labSounds.loop("trolleyRoll", { volume: Math.min(0.5, fastest * 0.5), rate: 0.75 + fastest * 0.5 });
      } else {
        labSounds.stop("trolleyRoll");
      }

      setX1(state.x1);
      setX2(state.x2);
      setVelocities({ v1: state.v1, v2: state.v2 });
      setImpact(state.impact);

      const offTrack = state.x2 > TRACK_HALF || state.x1 < -TRACK_HALF - 0.1 || (state.collided && Math.abs(state.v1) < 0.01 && Math.abs(state.v2) < 0.01);
      if (offTrack) {
        labSounds.stop("trolleyRoll");
        labSounds.play("trolleyStop", { volume: 0.4 });
        setRunning(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    lastFrame.current = performance.now();
    frame = window.requestAnimationFrame(animate);
    return () => {
      window.cancelAnimationFrame(frame);
      labSounds.stop("trolleyRoll");
    };
  }, [kind, m1, m2, running]);

  const startRun = useCallback(() => {
    stateRef.current = { x1: -1.05, x2: 0.15, v1: u1, v2: u2, collided: false, impact: 0 };
    gatesPassedRef.current = { a: false, b: false };
    labSounds.play("trolleyRelease", { volume: 0.55 });
    setX1(-1.05);
    setX2(0.15);
    setVelocities({ v1: u1, v2: u2 });
    setImpact(0);
    setCollided(false);
    setRunning(true);
  }, [u1, u2]);

  const recordRun = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (!collided) return;
    setRuns((current) => {
      if (current.length >= 6) return current;
      return [...current, { id: `${Date.now()}-${current.length}`, kind, m1, m2, u1, u2, v1, v2 }];
    });
  }, [collided, kind, m1, m2, u1, u2, v1, v2]);

  const resetPositions = useCallback(() => {
    stateRef.current = { x1: -1.05, x2: 0.15, v1: 0, v2: 0, collided: false, impact: 0 };
    gatesPassedRef.current = { a: false, b: false };
    labSounds.stop("trolleyRoll");
    setRunning(false);
    setCollided(false);
    setX1(-1.05);
    setX2(0.15);
    setVelocities({ v1: 0, v2: 0 });
    setImpact(0);
  }, []);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setRuns([]);
    resetPositions();
  }, [resetPositions]);

  const toggleDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setRuns([]);
    /** Three contrasting collisions: equal sticky, unequal sticky, then springy. */
    const script: { kind: CollisionKind; m1: number; m2: number; u1: number; moving: boolean }[] = [
      { kind: "sticky", m1: 0.8, m2: 0.8, u1: 0.6, moving: false },
      { kind: "sticky", m1: 1.8, m2: 0.8, u1: 0.6, moving: false },
      { kind: "springy", m1: 0.8, m2: 0.8, u1: 0.8, moving: false },
    ];
    script.forEach((set, index) => {
      demoTimers.current.push(
        window.setTimeout(() => {
          setKind(set.kind);
          setM1(set.m1);
          setM2(set.m2);
          setU1(set.u1);
          setTarget2Moving(set.moving);
          stateRef.current = { x1: -1.05, x2: 0.15, v1: set.u1, v2: 0, collided: false, impact: 0 };
          setX1(-1.05);
          setX2(0.15);
          setCollided(false);
          setRunning(true);
        }, index * 4200),
      );
      demoTimers.current.push(
        window.setTimeout(() => {
          const result = collisionResult(set.kind, set.m1, set.m2, set.u1, 0);
          setRuns((current) => [
            ...current,
            { id: `demo-${index}`, kind: set.kind, m1: set.m1, m2: set.m2, u1: set.u1, u2: 0, v1: result.v1, v2: result.v2 },
          ]);
        }, index * 4200 + 3200),
      );
    });
    demoTimers.current.push(window.setTimeout(() => setDemoActive(false), script.length * 4200));
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const changeSetting = useCallback(
    (apply: () => void) => {
      apply();
      resetPositions();
    },
    [resetPositions],
  );

  const status = complete
    ? "Three collisions recorded. In every one the total momentum after the collision matched the total before it."
    : collided
      ? kind === "sticky"
        ? `They stuck together and moved off at ${v1.toFixed(2)} m s⁻¹. Total momentum stayed at ${pAfter.toFixed(3)} kg m s⁻¹.`
        : `They bounced apart at ${v1.toFixed(2)} and ${v2.toFixed(2)} m s⁻¹. Total momentum is still ${pAfter.toFixed(3)} kg m s⁻¹.`
      : running
        ? "Trolley 1 is running towards trolley 2 — the light gates are timing it."
        : `Ready: ${m1.toFixed(1)} kg at ${u1.toFixed(1)} m s⁻¹ into ${m2.toFixed(1)} kg. Push the trolley to collide.`;

  const observation = complete
    ? `Momentum before = ${pBefore.toFixed(3)} kg m s⁻¹, after = ${pAfter.toFixed(3)} kg m s⁻¹ — a difference of ${percentDifference.toFixed(1)}%.`
    : "Momentum is conserved in every collision; kinetic energy is only conserved when the trolleys bounce apart.";

  const primaryLabel = complete ? "Start again" : collided ? "Record this run" : running ? "Colliding…" : "Push trolley 1";

  const setupControls = (
    <div data-experiment-tour="momentum-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Type of collision</span>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {(["sticky", "springy"] as CollisionKind[]).map((option) => {
            const active = option === kind;
            return (
              <button
                key={option}
                onClick={() => changeSetting(() => setKind(option))}
                className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition"
                style={active ? { background: ACCENT.base, color: "#1a0420" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
              >
                {option === "sticky" ? "Pin & cork" : "Springy"}
                <span className="mt-0.5 block text-[8px] font-bold opacity-80">
                  {option === "sticky" ? "stick together" : "bounce apart"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-fuchsia-200">Trolley 1 (moving)</span>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {MASS_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setM1(option))}
              className="rounded-lg px-1 py-1.5 text-[10px] font-black transition"
              style={option === m1 ? { background: ACCENT.base, color: "#1a0420" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option.toFixed(1)} kg
            </button>
          ))}
        </div>
        <label className="mt-2 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Push speed u₁</label>
        <div className="mt-1 grid grid-cols-4 gap-1">
          {SPEED_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setU1(option))}
              className="rounded-lg px-1 py-1.5 text-[10px] font-black transition"
              style={option === u1 ? { background: ACCENT.base, color: "#1a0420" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option.toFixed(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-cyan-200">Trolley 2 (target)</span>
        <div className="mt-1.5 grid grid-cols-3 gap-1">
          {MASS_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => changeSetting(() => setM2(option))}
              className="rounded-lg px-1 py-1.5 text-[10px] font-black transition"
              style={option === m2 ? { background: "#22d3ee", color: "#04202a" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option.toFixed(1)} kg
            </button>
          ))}
        </div>
        <button
          onClick={() => changeSetting(() => setTarget2Moving((current) => !current))}
          className="mt-2 w-full rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition hover:bg-white/15"
        >
          {target2Moving ? "Head-on at 0.35 m s⁻¹" : "At rest — tap for head-on"}
        </button>
      </div>
    </div>
  );

  const momentumPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Momentum check</span>
      <table className="mt-2 w-full text-[9px]">
        <tbody className="text-slate-200">
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Before</td>
            <td className="py-1 text-right font-black">
              {(m1 * u1).toFixed(3)} + {(m2 * u2).toFixed(3)}
            </td>
            <td className="py-1 text-right font-black text-white">{pBefore.toFixed(3)}</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">After</td>
            <td className="py-1 text-right font-black">
              {(m1 * v1).toFixed(3)} + {(m2 * v2).toFixed(3)}
            </td>
            <td className="py-1 text-right font-black text-white">{pAfter.toFixed(3)}</td>
          </tr>
          <tr>
            <td className="py-1 font-bold text-slate-400">KE</td>
            <td className="py-1 text-right font-black">
              {keBefore.toFixed(3)} → {keAfter.toFixed(3)}
            </td>
            <td className="py-1 text-right font-black" style={{ color: kind === "sticky" ? "#fca5a5" : "#6ee7b7" }}>
              {kind === "sticky" ? "lost" : "kept"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 rounded-xl bg-emerald-500/15 px-2 py-1.5 text-center text-[10px] font-black uppercase tracking-wide text-emerald-200">
        Momentum conserved · {percentDifference.toFixed(1)}% difference
      </div>
      <div className="mt-1 text-[8px] font-bold text-slate-500">
        All values in kg m s⁻¹, taking motion to the right as positive.
      </div>
    </div>
  );

  const runsPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {runs.length}/3
        </span>
      </div>
      {runs.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">No runs recorded yet.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">Type</th>
              <th className="py-0.5 text-right font-black uppercase">p before</th>
              <th className="py-0.5 text-right font-black uppercase">p after</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.id} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{run.kind === "sticky" ? "Sticks" : "Bounces"}</td>
                <td className="py-1 text-right font-black">{(run.m1 * run.u1 + run.m2 * run.u2).toFixed(3)}</td>
                <td className="py-1 text-right font-black">{(run.m1 * run.v1 + run.m2 * run.v2).toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={recordRun}
        disabled={!collided || runs.length >= 6}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        Record this run
      </button>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Momentum Track"
          subtitle="m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂"
          symbol="💥"
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

      <div data-experiment-tour="momentum-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.2, 3.05, 5.1], fov: 50, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <MomentumScene
            x1={x1}
            x2={x2}
            v1={velocities.v1}
            v2={velocities.v2}
            impact={impact}
            m1Bricks={MASS_OPTIONS.indexOf(m1 as (typeof MASS_OPTIONS)[number])}
            m2Bricks={MASS_OPTIONS.indexOf(m2 as (typeof MASS_OPTIONS)[number])}
            kind={kind}
            stuck={collided && kind === "sticky"}
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
            emoji="💥"
            cornerEmoji="🚃"
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
          title="Conservation of Momentum"
          tagline="m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂"
          missions={MOMENTUM_MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : collided ? "📝" : "▶"}
          onPrimary={complete ? resetAll : collided ? recordRun : startRun}
          primaryDisabled={running}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Set up", value: kind === "sticky" ? "Sticks" : "Bounces", content: setupControls },
            { id: "momentum", label: "Momentum", value: pAfter.toFixed(2), content: momentumPanel },
            { id: "runs", label: "Runs", value: `${runs.length}/3`, content: runsPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "push", label: running ? "Running" : "Push", onClick: startRun, disabled: running, tone: "green" },
            { id: "record", label: "Record", onClick: recordRun, disabled: !collided, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Set up", value: kind === "sticky" ? "Sticks" : "Bounces", content: setupControls },
            { id: "momentum", label: "Momentum", value: pAfter.toFixed(2), content: momentumPanel },
            { id: "runs", label: "Runs", value: `${runs.length}/3`, content: runsPanel },
          ]}
        />
      )}

      {showPaper && <MomentumPaper runs={runs} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={momentumTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
