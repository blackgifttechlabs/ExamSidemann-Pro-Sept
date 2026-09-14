"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { BENCH_TOP_Y, LabLighting, LabPlayer, LabRoom } from "../../common/LabEnvironment";
import { labSounds } from "../../../../lib/audio/labSounds";
import { GameModeToggle, EXPERIMENT_ACCENTS } from "../../common/CombinedScienceGame";
import { ExperimentTopBar } from "../../common/ExperimentGameChrome";
import {
  CAR_LENGTH, CAR_MODEL, M_TO_UNITS, TRACK_HALF, TRACK_VISUAL_HALF, TRACK_SURFACE_Y,
  advanceMomentum, collisionResult, prepareMomentumCar, rollMomentumWheels, type CollisionKind,
} from "./momentumSimulation";

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

/** Playback is slowed so the collision is easy to watch. */
const TIME_SCALE = 0.55;

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

const momentumTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Conservation of momentum",
    text: "Momentum is mass × velocity. When two bodies collide and no outside force acts, the total momentum before the collision equals the total momentum after it.",
    mode: "modal",
  },
  {
    title: "The car track",
    text: "Two model cars sit on a runway. Each car interrupts a light gate beam as it passes.",
    mode: "bubble",
    selector: '[data-experiment-tour="momentum-scene"]',
  },
  {
    title: "Set up the collision",
    text: "Open More tools to choose the masses, starting speed, and whether the cars stick together or bounce apart.",
    mode: "bubble",
    selector: '[data-experiment-tour="momentum-sidebar"]',
  },
  {
    title: "Check the totals",
    text: "The momentum table adds up m₁u₁ + m₂u₂ before and m₁v₁ + m₂v₂ after. Compare them and work out the percentage difference.",
    mode: "bubble",
    selector: '[data-experiment-tour="momentum-sidebar"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function Car({
  facing,
  distance,
  label,
}: {
  facing: 1 | -1;
  distance: number;
  label: string;
}) {
  const { scene } = useGLTF(CAR_MODEL);
  const car = useMemo(() => prepareMomentumCar(scene), [scene]);
  useFrame(() => rollMomentumWheels(car.wheels, distance, facing));

  return (
    <group name={`momentum-car-${label}`} rotation={[0, facing * Math.PI / 2, 0]}>
      <primitive object={car.vehicle} />
      <Html position={[0, car.height + 0.22, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={{ whiteSpace: "nowrap", width: "max-content" }} className="rounded border border-white/20 bg-slate-950/90 px-2 py-1 text-[9px] font-bold text-white">Car {label}</div>
      </Html>
    </group>
  );
}

useGLTF.preload(CAR_MODEL);

function LightGate({ x, active, label }: { x: number; active: boolean; label: string }) {
  return (
    <group position={[x, 0, 0]}>
      {[-0.34, 0.34].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 0.16, 0]} castShadow>
            <boxGeometry args={[0.08, 0.32, 0.1]} />
            <meshStandardMaterial color="#334155" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <boxGeometry args={[0.07, 0.1, 0.09]} />
            <meshStandardMaterial color={active ? "#f43f5e" : "#64748b"} emissive={active ? "#f43f5e" : "#000000"} emissiveIntensity={active ? 0.7 : 0} />
          </mesh>
        </group>
      ))}
      {/* A passing car interrupts the beam instead of having it drawn through its body. */}
      {(active ? [-0.26, 0.26] : [0]).map((z) => (
        <mesh key={z} position={[0, 0.22, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.004, 0.004, active ? 0.1 : 0.62, 6]} />
          <meshStandardMaterial color="#fb7185" transparent opacity={0.55} />
        </mesh>
      ))}
      <Html position={[0, 0.9, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div style={{ whiteSpace: "nowrap", width: "max-content" }} className="rounded border border-white/20 bg-slate-950/90 px-2 py-1 text-[9px] font-bold text-slate-200">{label}</div>
      </Html>
    </group>
  );
}

function Track({
  x1,
  x2,
  stuck,
}: {
  x1: number;
  x2: number;
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

        <group position={[x1 * M_TO_UNITS, TRACK_SURFACE_Y, 0]}>
          <Car
            facing={1}
            distance={x1 * M_TO_UNITS}
            label="1"
          />
        </group>
        <group position={[x2 * M_TO_UNITS, TRACK_SURFACE_Y, 0]}>
          <Car
            facing={-1}
            distance={x2 * M_TO_UNITS}
            label="2"
          />
        </group>

        <LightGate x={-1.5} active={Math.abs(x1 * M_TO_UNITS + 1.5) < (CAR_LENGTH / 2) || Math.abs(x2 * M_TO_UNITS + 1.5) < (CAR_LENGTH / 2)} label="Gate A" />
        <LightGate x={1.5} active={Math.abs(x2 * M_TO_UNITS - 1.5) < (CAR_LENGTH / 2) || Math.abs(x1 * M_TO_UNITS - 1.5) < (CAR_LENGTH / 2)} label="Gate B" />
      </group>

      {/* Small shim under the raised end, for friction compensation */}
      <mesh position={[-TRACK_VISUAL_HALF - 0.1, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.03, 0.6]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} />
      </mesh>

      {stuck && (
        <Html position={[((x1 + x2) / 2) * M_TO_UNITS, 1.12, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div style={{ whiteSpace: "nowrap", width: "max-content" }} className="rounded-lg border border-white/20 bg-slate-950/90 px-3 py-1.5 text-[9px] font-bold text-white">Moving together</div>
        </Html>
      )}
    </group>
  );
}

function MomentumScene({
  x1,
  x2,
  stuck,
  mode,
  isMobile,
  moveVectorRef,
}: {
  x1: number;
  x2: number;
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
          stuck={stuck}
        />
      </LabRoom>

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
  const [toolsOpen, setToolsOpen] = useState(false);

  const stateRef = useRef({ x1: -1.05, x2: 0.15, v1: 0, v2: 0, collided: false });
  /** Light gates already beeped for this run, so each one only sounds once. */
  const gatesPassedRef = useRef({ a: false, b: false });
  const lastFrame = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const u2 = target2Moving ? -0.35 : 0;
  const { v1, v2 } = collisionResult(kind, m1, m2, u1, u2);
  const pBefore = m1 * u1 + m2 * u2;
  const pAfter = m1 * v1 + m2 * v2;
  const percentDifference = pBefore === 0 ? 0 : Math.abs(((pAfter - pBefore) / pBefore) * 100);
  const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const keAfter = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;

  const complete = runs.length >= 3;

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
      const approach = Math.abs(state.v1 - state.v2);
      if (advanceMomentum(state, dt, kind, m1, m2)) {
        setCollided(true);
        // Sticky collisions land as a dull thud; elastic collisions ring.
        labSounds.play(kind === "sticky" ? "trolleyCollisionSoft" : "trolleyCollisionHard", {
          volume: Math.min(1, 0.35 + approach * 0.5),
          rate: 0.9 + Math.min(0.35, approach * 0.3),
        });
      }

      // Light gates: beep when the leading edge of a car first reaches a beam.
      const gateAt = -1.5 / M_TO_UNITS;
      const crossed = (before: number, after: number, gate: number) =>
        before !== after && (before - gate + Math.sign(after - before) * CAR_LENGTH / (2 * M_TO_UNITS)) *
          (after - gate + Math.sign(after - before) * CAR_LENGTH / (2 * M_TO_UNITS)) <= 0;
      if (!gatesPassedRef.current.a && (crossed(previousX1, state.x1, gateAt) || crossed(previousX2, state.x2, gateAt))) {
        gatesPassedRef.current.a = true;
        labSounds.play("lightGateBeep", { volume: 0.5 });
      }
      if (!gatesPassedRef.current.b && (crossed(previousX2, state.x2, -gateAt) || crossed(previousX1, state.x1, -gateAt))) {
        gatesPassedRef.current.b = true;
        labSounds.play("lightGateBeep", { volume: 0.5, rate: 1.15 });
      }

      // Wheels on wood: pitch and level follow whichever car is quicker.
      const fastest = Math.max(Math.abs(state.v1), Math.abs(state.v2));
      if (fastest > 0.02) {
        labSounds.loop("trolleyRoll", { volume: Math.min(0.5, fastest * 0.5), rate: 0.75 + fastest * 0.5 });
      } else {
        labSounds.stop("trolleyRoll");
      }

      const reachedEnd = state.x2 >= TRACK_HALF || state.x1 <= -TRACK_HALF;
      if (reachedEnd) {
        if (state.collided && kind === "sticky") {
          const correction = state.x2 >= TRACK_HALF ? TRACK_HALF - state.x2 : -TRACK_HALF - state.x1;
          state.x1 += correction;
          state.x2 += correction;
        } else {
          state.x1 = Math.max(-TRACK_HALF, state.x1);
          state.x2 = Math.min(TRACK_HALF, state.x2);
        }
      }
      setX1(state.x1);
      setX2(state.x2);

      const offTrack = reachedEnd || (state.collided && Math.abs(state.v1) < 0.01 && Math.abs(state.v2) < 0.01);
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
    stateRef.current = { x1: -1.05, x2: 0.15, v1: u1, v2: u2, collided: false };
    gatesPassedRef.current = { a: false, b: false };
    labSounds.play("trolleyRelease", { volume: 0.55 });
    setX1(-1.05);
    setX2(0.15);
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
    stateRef.current = { x1: -1.05, x2: 0.15, v1: 0, v2: 0, collided: false };
    gatesPassedRef.current = { a: false, b: false };
    labSounds.stop("trolleyRoll");
    setRunning(false);
    setCollided(false);
    setX1(-1.05);
    setX2(0.15);
  }, []);

  const resetAll = useCallback(() => {
    setRuns([]);
    resetPositions();
  }, [resetPositions]);

  const handleModeChange = useCallback((next: "learning" | "doing") => setMode(next), []);

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
        ? "Car 1 is moving towards car 2. Watch the collision."
        : `Ready: ${m1.toFixed(1)} kg at ${u1.toFixed(1)} m s⁻¹ into ${m2.toFixed(1)} kg. Press Start to collide.`;

  const observation = complete
    ? `Momentum before = ${pBefore.toFixed(3)} kg m s⁻¹, after = ${pAfter.toFixed(3)} kg m s⁻¹ — a difference of ${percentDifference.toFixed(1)}%.`
    : "Momentum is conserved in every collision; kinetic energy is only conserved when the cars bounce apart.";

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
                {option === "sticky" ? "Sticky" : "Springy"}
                <span className="mt-0.5 block text-[8px] font-bold opacity-80">
                  {option === "sticky" ? "stick together" : "bounce apart"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-fuchsia-200">Car 1 (moving)</span>
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
        <span className="text-[10px] font-black uppercase tracking-wide text-cyan-200">Car 2 (target)</span>
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
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <ExperimentTopBar
          title="Conservation of Momentum"
          symbol={null}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          actions={<GameModeToggle mode={mode} onChange={handleModeChange} />}
        />
      )}

      <div className="relative flex min-h-0 flex-1">
        <div data-experiment-tour="momentum-scene" className="relative min-w-0 flex-1">
          <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.2, 3.05, 5.1], fov: 50, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
            <MomentumScene
              x1={x1}
              x2={x2}
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
          {mode === "learning" && !isMobileViewport && (
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-slate-950/80 px-4 py-2 text-[10px] font-bold text-slate-200">
              Drag to look around · scroll to zoom
            </div>
          )}
          {mode === "doing" && !isMobileViewport && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80" />
              <div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
                WASD / arrows to move · mouse to look · click to lock
              </div>
            </div>
          )}
        </div>

        <aside
          aria-label="Momentum experiment controls"
          data-experiment-tour="momentum-sidebar"
          className={isMobileViewport
            ? "absolute inset-x-3 bottom-3 z-40 max-h-[50%] overflow-y-auto rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-xl"
            : "experiment-desktop-panel w-72 shrink-0 overflow-y-auto border-l border-white/10 bg-slate-950 p-5"}
        >
          <section data-experiment-tour="goal-card" aria-labelledby="momentum-goal-title">
            <h2 id="momentum-goal-title" className="text-xs font-bold uppercase tracking-wider text-slate-400">Experiment goal</h2>
            <p className="mt-2 text-sm leading-relaxed text-white">Compare the total momentum before and after a collision.</p>
            <p aria-live="polite" className="mt-3 text-xs leading-relaxed text-slate-400">{status}</p>
          </section>
          <button
            type="button"
            onClick={startRun}
            disabled={running}
            className="mt-5 w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
          >
            {running ? "Running…" : "Start"}
          </button>
          <section aria-label="Set up collision" className="mt-4">
            {setupControls}
          </section>
          <button
            type="button"
            onClick={() => setToolsOpen((open) => !open)}
            aria-expanded={toolsOpen}
            aria-controls="momentum-more-tools"
            className="mt-2 flex w-full items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
          >
            More tools <span aria-hidden="true">{toolsOpen ? "−" : "+"}</span>
          </button>
          {toolsOpen && (
            <div id="momentum-more-tools" className="mt-5 space-y-5">
              <section aria-label="Momentum measurements">{momentumPanel}</section>
              <section aria-label="Recorded runs">{runsPanel}</section>
              <p className="text-xs leading-relaxed text-slate-400">{observation}</p>
              <button type="button" onClick={resetAll} className="w-full rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5">Reset experiment</button>
            </div>
          )}
        </aside>
      </div>

      {showPaper && <MomentumPaper runs={runs} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={momentumTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
