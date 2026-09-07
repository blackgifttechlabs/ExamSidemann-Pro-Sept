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

interface ExpansionSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.amber;
const PAPER_FILENAME = "expansion-of-solids.html";

const ROOM_TEMP = 22;
const FLAME_TEMP = 320;
const WATER_TEMP = 14;

/** True dimensions of the ball-and-ring apparatus, in millimetres. */
const BALL_DIAMETER_MM = 25;
const RING_HOLE_MM = 25.05;
/** Linear expansivity of steel, per °C. */
const ALPHA_STEEL = 12e-6;
/** The real expansion is far too small to see, so the 3D view exaggerates it. */
const VISUAL_EXAGGERATION = 60;

type Apparatus = "ball" | "strip";
type Stage = "cold" | "hot" | "cooled";

interface Observation {
  stage: Stage;
  temp: number;
  diameter: number;
  fits: boolean;
}

const EXPANSION_MISSIONS: GameMission[] = [
  {
    short: "Cold test",
    title: "Try the cold ball",
    detail: "At room temperature the steel ball passes easily through the ring — it is just small enough.",
    symbol: "⚪",
  },
  {
    short: "Heat",
    title: "Heat the ball strongly",
    detail: "Hold the ball in a hot Bunsen flame for a minute or two so that it expands.",
    symbol: "🔥",
  },
  {
    short: "Hot test",
    title: "Try the ring again",
    detail: "Now the ball will not pass through: its diameter has grown by more than the clearance in the ring.",
    symbol: "🚫",
  },
  {
    short: "Cool",
    title: "Cool it and check",
    detail: "Quench the ball in cold water. It contracts back to its original size and fits through once more.",
    symbol: "💧",
  },
];

const expansionTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Solids expand when heated",
    text: "Heating a solid makes its particles vibrate more strongly about their fixed positions, so they take up slightly more room. The solid expands in every direction.",
    mode: "modal",
  },
  {
    title: "Ball and ring",
    text: "A steel ball is made to just pass through a metal ring at room temperature. Any expansion of the ball then shows up as a failure to fit.",
    mode: "bubble",
    selector: '[data-experiment-tour="expansion-scene"]',
  },
  {
    title: "Heat, test, cool",
    text: "Heat the ball in the flame, try the ring, then quench it in water and try again. Record what happens each time.",
    mode: "bubble",
    selector: '[data-experiment-tour="expansion-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "The bimetallic strip",
    text: "Switch to the bimetallic strip. Brass and iron are riveted together; brass expands more, so on heating the strip curves with the brass on the outside of the bend.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/** Diameter of the steel ball at a given temperature, from d = d₀(1 + αΔT). */
function ballDiameter(temp: number) {
  return BALL_DIAMETER_MM * (1 + ALPHA_STEEL * (temp - ROOM_TEMP));
}

/* ------------------------------------------------------------------ 3D bits */

function GlowMaterial({ temp, base }: { temp: number; base: string }) {
  /** Steel starts to glow a dull red once it is really hot. */
  const glow = THREE.MathUtils.clamp((temp - 180) / 200, 0, 1);
  const colour = new THREE.Color(base).lerp(new THREE.Color("#b91c1c"), glow * 0.7);
  return (
    <meshStandardMaterial
      color={`#${colour.getHexString()}`}
      metalness={0.85 - glow * 0.4}
      roughness={0.28 + glow * 0.3}
      emissive="#ef4444"
      emissiveIntensity={glow * 0.9}
    />
  );
}

function BallAndRing({ temp, attempt, fits }: { temp: number; attempt: number; fits: boolean }) {
  /** Visual radius, with the tiny real expansion scaled up so it can be seen. */
  const realStrain = ALPHA_STEEL * (temp - ROOM_TEMP);
  const ballRadius = 0.14 * (1 + realStrain * VISUAL_EXAGGERATION);
  const ringInner = 0.14 * (RING_HOLE_MM / BALL_DIAMETER_MM);

  /** The ball drops through the ring when it fits, or rests on top when it does not. */
  const passThrough = fits ? attempt : Math.min(attempt, 0.45);
  const ballY = 0.62 - passThrough * (fits ? 0.72 : 0.28);

  return (
    <group>
      {/* Ring on its handle */}
      <group position={[0, 0.42, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[ringInner + 0.035, 0.035, 14, 36]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[ringInner + 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.42, 10]} />
          <meshStandardMaterial color="#78716c" roughness={0.8} />
        </mesh>
        <mesh position={[ringInner + 0.52, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.2, 12]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.85} />
        </mesh>
      </group>

      {/* Ball on its chain */}
      <group position={[0, ballY, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[ballRadius, 28, 20]} />
          <GlowMaterial temp={temp} base="#cbd5e1" />
        </mesh>
        <mesh position={[0, ballRadius + 0.18, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.36, 6]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.4} />
        </mesh>
      </group>

      <Html position={[-0.62, 0.72, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="w-[104px] rounded-lg border border-amber-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[10px] font-black text-white">{temp.toFixed(0)} °C</div>
          <div className="text-[7px] font-black uppercase" style={{ color: fits ? "#6ee7b7" : "#fca5a5" }}>
            {fits ? "passes through" : "will not fit"}
          </div>
          <div className="text-[6px] font-bold text-slate-400">d = {ballDiameter(temp).toFixed(3)} mm</div>
        </div>
      </Html>
    </group>
  );
}

function BimetallicStrip({ temp }: { temp: number }) {
  /**
   * Brass expands about twice as much as iron, so the strip curves with the brass
   * on the outside. Curvature is proportional to the temperature change.
   */
  const curvature = (temp - ROOM_TEMP) * 0.0042;
  const segments = 18;
  const length = 1.05;

  const pieces = useMemo(
    () =>
      Array.from({ length: segments }, (_, index) => {
        const fraction = index / (segments - 1) - 0.5;
        return { fraction, along: fraction * length };
      }),
    [],
  );

  return (
    <group>
      {pieces.map((piece, index) => {
        const angle = curvature * piece.along * 10;
        const x = piece.along;
        // Points on a circular arc of the given curvature.
        const y = (curvature * piece.along * piece.along * 10) / 2;
        return (
          <group key={index} position={[x, y, 0]} rotation={[0, 0, angle]}>
            {/* Brass on top */}
            <mesh position={[0, 0.016, 0]} castShadow>
              <boxGeometry args={[length / segments + 0.004, 0.028, 0.16]} />
              <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.35} />
            </mesh>
            {/* Iron underneath */}
            <mesh position={[0, -0.016, 0]} castShadow>
              <boxGeometry args={[length / segments + 0.004, 0.028, 0.16]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.42} />
            </mesh>
          </group>
        );
      })}
      {/* Clamped end */}
      <mesh position={[-length / 2 - 0.09, 0, 0]} castShadow>
        <boxGeometry args={[0.14, 0.14, 0.22]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      <Html position={[0, 0.34, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="w-[120px] rounded-lg border border-amber-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[10px] font-black text-white">{temp.toFixed(0)} °C</div>
          <div className="text-[7px] font-black uppercase text-amber-200">
            {Math.abs(temp - ROOM_TEMP) < 3
              ? "straight"
              : temp > ROOM_TEMP
                ? "curves — brass on the outside"
                : "curves the other way — iron outside"}
          </div>
        </div>
      </Html>
      <Html position={[0.62, -0.16, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="rounded border border-white/20 bg-slate-950/90 px-1 py-0.5 text-[6px] font-black uppercase text-slate-300">
          brass ▲ · iron ▼
        </div>
      </Html>
    </group>
  );
}

function BunsenBurner({ on, position }: { on: boolean; position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!flameRef.current) return;
    const flicker = 1 + Math.sin(clock.elapsedTime * 15) * 0.07 + Math.sin(clock.elapsedTime * 26) * 0.04;
    flameRef.current.scale.set(flicker, flicker, flicker);
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.13, 0.15, 0.06, 20]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.42, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.42} />
      </mesh>
      {on && (
        <>
          <mesh ref={flameRef} position={[0, 0.66, 0]}>
            <coneGeometry args={[0.06, 0.44, 16]} />
            <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, 0.56, 0]}>
            <coneGeometry args={[0.03, 0.22, 14]} />
            <meshBasicMaterial color="#1d4ed8" transparent opacity={0.75} />
          </mesh>
          <pointLight position={[0, 0.7, 0]} intensity={1.6} distance={2.4} color="#93c5fd" />
        </>
      )}
    </group>
  );
}

function WaterTrough({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.26, 0.24, 0.18, 26, 1, true]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.24} transmission={0.85} roughness={0.06} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.005, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.01, 26]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.3} transmission={0.8} roughness={0.06} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.25, 0.235, 0.13, 26]} />
        <meshStandardMaterial color="#7dd3fc" transparent opacity={0.55} roughness={0.15} />
      </mesh>
    </group>
  );
}

function ExpansionScene({
  apparatus,
  temp,
  attempt,
  fits,
  flameOn,
  mode,
  isMobile,
  moveVectorRef,
}: {
  apparatus: Apparatus;
  temp: number;
  attempt: number;
  fits: boolean;
  flameOn: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.4, 2.75, 3.1] : [0.6, 2.65, 2.7];
    camera.position.set(...position);
    camera.lookAt(0, 2.02, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#d97706"
        benchColor="#eef2f4"
        posterA={{
          title: "EXPANSION",
          lines: [
            "Heating makes particles vibrate more",
            "l = l₀ (1 + α ΔT)",
            "Steel: α ≈ 12 × 10⁻⁶ per °C",
            "A hole in a solid expands too",
          ],
        }}
        posterB={{
          title: "USES & PROBLEMS",
          lines: ["Bimetallic strip in a thermostat or fire alarm", "Expansion gaps in bridges and railway lines", "Riveting: hot rivets shrink and pull plates together"],
        }}
      >
        <BunsenBurner on={flameOn} position={[-0.95, BENCH_TOP_Y, -0.1]} />
        <WaterTrough position={[0.95, BENCH_TOP_Y, -0.1]} />
        <mesh position={[0, BENCH_TOP_Y + 0.012, 0]} receiveShadow>
          <boxGeometry args={[2.6, 0.024, 0.8]} />
          <meshStandardMaterial color="#1c1917" roughness={0.95} />
        </mesh>

        {/* Retort stand holding whichever apparatus is in use */}
        <group position={[0, BENCH_TOP_Y, -0.36]}>
          <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.46, 0.06, 0.36]} />
            <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.95, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>

        <group position={[0, BENCH_TOP_Y + 0.62, 0]}>
          {apparatus === "ball" ? <BallAndRing temp={temp} attempt={attempt} fits={fits} /> : <BimetallicStrip temp={temp} />}
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.02, 0]} minDistance={1.4} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function ExpansionPaper({ observations, onClose }: { observations: Observation[]; onClose: () => void }) {
  const rows: { stage: Stage; label: string }[] = [
    { stage: "cold", label: "Before heating (room temperature)" },
    { stage: "hot", label: "After heating strongly in the flame" },
    { stage: "cooled", label: "After cooling in water" },
  ];
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Expansion of Solids: Ball and Ring, and the Bimetallic Strip</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To show that a solid expands when it is heated and contracts when it cools, and that different metals expand by different amounts.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Ball-and-ring apparatus (steel ball on a chain and a metal ring on a handle), bimetallic strip of brass and iron, Bunsen burner, tongs, trough of cold water, heat-proof mat, retort stand.</p>
        <h2 className="mt-5 font-bold uppercase">Method — Part A: ball and ring</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>At room temperature the ball was passed through the ring to show that it just fitted.</li>
          <li>The ball was heated strongly in a Bunsen flame for about two minutes.</li>
          <li>The hot ball was held over the ring and an attempt made to pass it through.</li>
          <li>The ball was cooled by dipping it in cold water and the test repeated.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Method — Part B: bimetallic strip</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A straight bimetallic strip of brass riveted to iron was clamped at one end.</li>
          <li>The strip was heated evenly in a Bunsen flame and the direction of bending noted.</li>
          <li>The strip was allowed to cool and then cooled further in iced water, and the bending observed again.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results — Part A</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Condition of the ball</th>
              <th className="border border-slate-400 p-2">Temperature / °C</th>
              <th className="border border-slate-400 p-2">Diameter / mm</th>
              <th className="border border-slate-400 p-2">Does it pass through the ring?</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const observation = observations.find((each) => each.stage === row.stage);
              return (
                <tr key={row.stage}>
                  <td className="border border-slate-400 p-2">{row.label}</td>
                  <td className="border border-slate-400 p-2 text-center">{observation ? observation.temp.toFixed(0) : ""}</td>
                  <td className="border border-slate-400 p-2 text-center">{observation ? observation.diameter.toFixed(3) : ""}</td>
                  <td className="border border-slate-400 p-2 text-center">{observation ? (observation.fits ? "Yes" : "No") : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs">Diameter of the ring hole = {RING_HOLE_MM.toFixed(2)} mm. Diameter of the cold ball = {BALL_DIAMETER_MM.toFixed(2)} mm.</p>
        <h2 className="mt-5 font-bold uppercase">Results — Part B</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Condition of the strip</th>
              <th className="border border-slate-400 p-2">Observation</th>
              <th className="border border-slate-400 p-2">Metal on the outside of the curve</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2">At room temperature</td>
              <td className="border border-slate-400 p-2">Straight</td>
              <td className="border border-slate-400 p-2 text-center">—</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Heated in a Bunsen flame</td>
              <td className="border border-slate-400 p-2">Bends towards the iron side</td>
              <td className="border border-slate-400 p-2 text-center">Brass</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Cooled in iced water</td>
              <td className="border border-slate-400 p-2">Bends the opposite way</td>
              <td className="border border-slate-400 p-2 text-center">Iron</td>
            </tr>
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Calculation</h2>
        <p>
          Using l = l₀(1 + αΔT) with α = 12 × 10⁻⁶ °C⁻¹ for steel, a ball of diameter 25.00 mm heated through 278 °C
          expands by 25.00 × 12 × 10⁻⁶ × 278 = 0.083 mm, giving a diameter of about 25.08 mm. Since this is larger than
          the 25.05 mm hole in the ring, the hot ball cannot pass through.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Tongs were used to handle the hot ball and strip, and both were placed on a heat-proof mat.</li>
          <li>The ball was heated for long enough for the whole of it to reach the temperature of the flame.</li>
          <li>The bimetallic strip was heated evenly along its length rather than at one spot.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The steel ball passed through the ring when cold, would not pass through after being heated, and passed through
          again once it had been cooled. This shows that a solid expands on heating and contracts on cooling. The
          bimetallic strip curved when heated, with the brass on the outside of the curve, showing that brass expands
          more than iron for the same temperature rise. This unequal expansion is what makes bimetallic strips useful in
          thermostats and fire alarms.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function ExpansionOfSolidsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ExpansionSimProps) {
  const [apparatus, setApparatus] = useState<Apparatus>("ball");
  const [temp, setTemp] = useState(ROOM_TEMP);
  const [targetTemp, setTargetTemp] = useState(ROOM_TEMP);
  const [attempt, setAttempt] = useState(0);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  /** The ball heats and cools gradually towards whatever it is being held in. */
  useEffect(() => {
    if (Math.abs(temp - targetTemp) < 0.5) {
      if (temp !== targetTemp) setTemp(targetTemp);
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      setTemp((current) => current + (targetTemp - current) * 0.06);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [targetTemp, temp]);

  const diameter = ballDiameter(temp);
  const fits = diameter <= RING_HOLE_MM;
  const flameOn = targetTemp > ROOM_TEMP + 5;
  const atTarget = Math.abs(temp - targetTemp) < 1;

  const recorded = (stage: Stage) => observations.some((each) => each.stage === stage);
  const step = recorded("cooled") ? 3 : recorded("hot") ? 2 : recorded("cold") ? 1 : 0;
  const complete = observations.length >= 3;
  const progress = Math.min(1, observations.length / 3);

  /** Animates the ball being lowered onto (and possibly through) the ring. */
  const tryTheRing = useCallback(() => {
    setAttempt(0);
    const started = performance.now();
    const animate = (now: number) => {
      const fraction = THREE.MathUtils.clamp((now - started) / 1200, 0, 1);
      setAttempt(fraction);
      if (fraction < 1) window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }, []);

  const recordObservation = useCallback(
    (stage: Stage) => {
      setObservations((current) => {
        if (current.some((each) => each.stage === stage)) return current;
        return [...current, { stage, temp, diameter, fits }];
      });
      tryTheRing();
    },
    [diameter, fits, temp, tryTheRing],
  );

  const heat = useCallback(() => {
    labSounds.play("bunsenIgnite", { volume: 0.5 });
    labSounds.loop("bunsenFlame", { volume: 0.2 });
    setAttempt(0);
    setTargetTemp(FLAME_TEMP);
  }, []);

  const quench = useCallback(() => {
    setAttempt(0);
    setTargetTemp(WATER_TEMP);
  }, []);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setObservations([]);
    setAttempt(0);
    setTemp(ROOM_TEMP);
    setTargetTemp(ROOM_TEMP);
  }, []);

  const toggleDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);
    setApparatus("ball");
    setObservations([]);
    setTemp(ROOM_TEMP);
    setTargetTemp(ROOM_TEMP);
    demoTimers.current.push(window.setTimeout(() => recordObservation("cold"), 900));
    demoTimers.current.push(window.setTimeout(() => setTargetTemp(FLAME_TEMP), 2600));
    demoTimers.current.push(window.setTimeout(() => recordObservation("hot"), 6200));
    demoTimers.current.push(window.setTimeout(() => setTargetTemp(WATER_TEMP), 7800));
    demoTimers.current.push(window.setTimeout(() => recordObservation("cooled"), 11200));
    demoTimers.current.push(window.setTimeout(() => setDemoActive(false), 12600));
  }, [demoActive, recordObservation]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status =
    apparatus === "strip"
      ? Math.abs(temp - ROOM_TEMP) < 3
        ? "The bimetallic strip is straight at room temperature. Heat it and watch which way it bends."
        : temp > ROOM_TEMP
          ? "Heated: the strip curves with the brass on the outside, because brass expands more than iron."
          : "Cooled: the strip curves the other way, because the brass contracts more than the iron."
      : complete
        ? "Cold: fits. Hot: does not fit. Cooled again: fits. The ball expands on heating and contracts on cooling."
        : recorded("hot")
          ? "Now cool the ball in the water trough and try the ring one more time."
          : recorded("cold")
            ? "Heat the ball strongly in the flame, then try the ring again."
            : `The ball is ${diameter.toFixed(3)} mm across and the ring hole is ${RING_HOLE_MM.toFixed(2)} mm. Try it cold first.`;

  const observation = complete
    ? `At ${FLAME_TEMP} °C the ball is ${ballDiameter(FLAME_TEMP).toFixed(3)} mm across — wider than the ${RING_HOLE_MM.toFixed(2)} mm hole, so it will not pass through.`
    : "Expansion is small: a 25 mm steel ball grows only about 0.08 mm when heated through 280 °C.";

  const nextStage: Stage | null = !recorded("cold") ? "cold" : !recorded("hot") ? "hot" : !recorded("cooled") ? "cooled" : null;
  const primaryLabel =
    apparatus === "strip"
      ? temp > ROOM_TEMP
        ? "Let the strip cool"
        : "Heat the strip"
      : complete
        ? "Start again"
        : nextStage === "cold"
          ? "Try the cold ball"
          : nextStage === "hot"
            ? atTarget && flameOn
              ? "Try the hot ball"
              : "Heat the ball"
            : atTarget && !flameOn
              ? "Try the cooled ball"
              : "Cool it in water";

  const handlePrimary = useCallback(() => {
    if (apparatus === "strip") {
      setTargetTemp(temp > ROOM_TEMP ? -8 : FLAME_TEMP);
      return;
    }
    if (complete) {
      resetAll();
      return;
    }
    if (nextStage === "cold") {
      recordObservation("cold");
      return;
    }
    if (nextStage === "hot") {
      if (atTarget && flameOn) recordObservation("hot");
      else heat();
      return;
    }
    if (atTarget && !flameOn) recordObservation("cooled");
    else quench();
  }, [apparatus, atTarget, complete, flameOn, heat, nextStage, quench, recordObservation, resetAll, temp]);

  const apparatusControls = (
    <div data-experiment-tour="expansion-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Apparatus</span>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {(["ball", "strip"] as Apparatus[]).map((option) => (
            <button
              key={option}
              onClick={() => {
                setApparatus(option);
                setAttempt(0);
                setTemp(ROOM_TEMP);
                setTargetTemp(ROOM_TEMP);
              }}
              className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition"
              style={option === apparatus ? { background: ACCENT.base, color: "#1c1005" } : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
            >
              {option === "ball" ? "Ball & ring" : "Bimetallic strip"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Temperature</span>
          <span className="text-lg font-black" style={{ color: ACCENT.text }}>
            {temp.toFixed(0)} °C
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <button
            onClick={() => setTargetTemp(-8)}
            className="rounded-xl bg-white/8 px-1 py-2 text-[10px] font-black text-slate-200 transition hover:bg-white/15"
          >
            Iced water
          </button>
          <button
            onClick={() => setTargetTemp(ROOM_TEMP)}
            className="rounded-xl bg-white/8 px-1 py-2 text-[10px] font-black text-slate-200 transition hover:bg-white/15"
          >
            Room
          </button>
          <button
            onClick={heat}
            className="rounded-xl px-1 py-2 text-[10px] font-black text-slate-950 transition"
            style={{ background: ACCENT.base }}
          >
            Bunsen
          </button>
        </div>
        {apparatus === "ball" && (
          <div className="mt-2 rounded-xl bg-white/[0.04] px-2 py-1.5 text-[9px] font-bold text-slate-300">
            Ball {diameter.toFixed(3)} mm · ring hole {RING_HOLE_MM.toFixed(2)} mm. The 3D view exaggerates the expansion
            ×{VISUAL_EXAGGERATION} so it can be seen.
          </div>
        )}
      </div>
    </div>
  );

  const observationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Observation table</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {observations.length}/3
        </span>
      </div>
      <table className="mt-2 w-full text-[9px]">
        <thead>
          <tr className="text-slate-400">
            <th className="py-0.5 text-left font-black uppercase">Stage</th>
            <th className="py-0.5 text-right font-black uppercase">d / mm</th>
            <th className="py-0.5 text-right font-black uppercase">Fits?</th>
          </tr>
        </thead>
        <tbody>
          {(["cold", "hot", "cooled"] as Stage[]).map((stage) => {
            const entry = observations.find((each) => each.stage === stage);
            return (
              <tr key={stage} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold capitalize">
                  {stage === "cold" ? "Before heating" : stage === "hot" ? "After heating" : "After cooling"}
                </td>
                <td className="py-1 text-right font-black">{entry ? entry.diameter.toFixed(3) : "—"}</td>
                <td
                  className="py-1 text-right font-black"
                  style={{ color: entry ? (entry.fits ? "#6ee7b7" : "#fca5a5") : "#475569" }}
                >
                  {entry ? (entry.fits ? "Yes" : "No") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const theoryPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Working</span>
      <table className="mt-2 w-full text-[9px]">
        <tbody className="text-slate-200">
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Cold diameter d₀</td>
            <td className="py-1 text-right font-black">{BALL_DIAMETER_MM.toFixed(2)} mm</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Expansivity α</td>
            <td className="py-1 text-right font-black">12 × 10⁻⁶ /°C</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">ΔT</td>
            <td className="py-1 text-right font-black">{(temp - ROOM_TEMP).toFixed(0)} °C</td>
          </tr>
          <tr className="border-b border-white/5">
            <td className="py-1 font-bold text-slate-400">Expansion αd₀ΔT</td>
            <td className="py-1 text-right font-black">{(diameter - BALL_DIAMETER_MM).toFixed(4)} mm</td>
          </tr>
          <tr>
            <td className="py-1 font-bold text-slate-400">Clearance in ring</td>
            <td className="py-1 text-right font-black">{(RING_HOLE_MM - BALL_DIAMETER_MM).toFixed(2)} mm</td>
          </tr>
        </tbody>
      </table>
      <div
        className="mt-2 rounded-xl px-2 py-1.5 text-center text-[10px] font-black uppercase tracking-wide"
        style={fits ? { background: "rgba(16,185,129,0.18)", color: "#a7f3d0" } : { background: "rgba(244,63,94,0.16)", color: "#fecdd3" }}
      >
        {fits ? "Expansion is less than the clearance — it fits" : "Expansion exceeds the clearance — it jams"}
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Expansion Lab"
          subtitle="ball and ring · bimetallic strip"
          symbol="🔩"
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

      <div data-experiment-tour="expansion-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.6, 2.65, 2.7], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <ExpansionScene
            apparatus={apparatus}
            temp={temp}
            attempt={attempt}
            fits={fits}
            flameOn={flameOn}
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
            emoji="🔩"
            cornerEmoji="🔥"
            status={status}
            running={demoActive}
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
          title="Expansion of Solids"
          tagline="ball and ring · bimetallic strip"
          missions={EXPANSION_MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : flameOn ? "🔥" : "⚪"}
          onPrimary={handlePrimary}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "apparatus", label: "Set up", value: apparatus === "ball" ? "Ball & ring" : "Strip", content: apparatusControls },
            { id: "observations", label: "Table", value: `${observations.length}/3`, content: observationPanel, disabled: apparatus !== "ball" },
            { id: "theory", label: "Working", value: `${diameter.toFixed(2)} mm`, content: theoryPanel, disabled: apparatus !== "ball" },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "heat", label: "Heat", onClick: heat, tone: "red" },
            { id: "try", label: apparatus === "ball" ? "Try ring" : "Cool", onClick: apparatus === "ball" ? handlePrimary : quench, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "apparatus", label: "Set up", value: apparatus === "ball" ? "Ball & ring" : "Strip", content: apparatusControls },
            { id: "observations", label: "Table", value: `${observations.length}/3`, content: observationPanel, disabled: apparatus !== "ball" },
            { id: "theory", label: "Working", value: `${diameter.toFixed(2)} mm`, content: theoryPanel, disabled: apparatus !== "ball" },
          ]}
        />
      )}

      {showPaper && <ExpansionPaper observations={observations} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={expansionTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
