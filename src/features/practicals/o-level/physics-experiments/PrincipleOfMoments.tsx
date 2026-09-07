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

interface MomentsSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.violet;
const PAPER_FILENAME = "principle-of-moments.html";

/** The metre rule is 100 cm long and pivoted at the 50 cm mark. */
const RULE_LENGTH_CM = 100;
const RULE_VISUAL_LENGTH = 2.6; // three.js units across the full metre rule
const CM_TO_UNITS = RULE_VISUAL_LENGTH / RULE_LENGTH_CM;
const PIVOT_Y = BENCH_TOP_Y + 0.62;
/** Balanced within this many N·cm counts as "balanced" to the eye. */
const BALANCE_TOLERANCE = 0.6;
const MAX_TILT_RAD = 0.2;

interface Reading {
  id: string;
  w1: number;
  d1: number;
  w2: number;
  d2: number;
}

const MOMENTS_MISSIONS: GameMission[] = [
  {
    short: "Balance",
    title: "Balance the bare rule",
    detail: "With no weights the metre rule balances on the knife edge at its centre of gravity — the 50 cm mark.",
    symbol: "📏",
  },
  {
    short: "Load 1",
    title: "Hang the first weight",
    detail: "Hang a known weight on the left-hand side and measure its distance from the pivot. The rule tips down on that side.",
    symbol: "⬅️",
  },
  {
    short: "Load 2",
    title: "Balance with a second weight",
    detail: "Hang the second weight on the right and slide it until the rule is horizontal again.",
    symbol: "➡️",
  },
  {
    short: "Compare",
    title: "Compare the moments",
    detail: "Record at least three balanced sets and check that W₁ × d₁ equals W₂ × d₂ every time.",
    symbol: "⚖️",
  },
];

const momentsTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "The principle of moments",
    text: "A moment is the turning effect of a force: moment = force × perpendicular distance from the pivot. When a body is in equilibrium, the total clockwise moment equals the total anticlockwise moment.",
    mode: "modal",
  },
  {
    title: "The balanced metre rule",
    text: "The metre rule rests on a knife edge at its centre of gravity, so its own weight produces no turning effect about the pivot.",
    mode: "bubble",
    selector: '[data-experiment-tour="moments-scene"]',
  },
  {
    title: "Change the loads",
    text: "Set the size of each weight and slide it along the rule. Watch the rule tip until the two moments are equal.",
    mode: "bubble",
    selector: '[data-experiment-tour="moments-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Record the readings",
    text: "Once the rule is horizontal, record the reading. Three balanced sets are enough to show that the moments are always equal.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function SlottedMass({ weight }: { weight: number }) {
  /** One 0.5 N slotted mass per disc, capped so the stack stays readable. */
  const discs = Math.max(1, Math.min(10, Math.round(weight / 0.5)));
  return (
    <group>
      {/* Hanger wire */}
      <mesh position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.18, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.3} />
      </mesh>
      {/* Hanger rod the discs sit on */}
      <mesh position={[0, -0.24, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.14, 10]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.35} />
      </mesh>
      {Array.from({ length: discs }, (_, index) => (
        <mesh key={index} position={[0, -0.19 - index * 0.035, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.03, 20]} />
          <meshStandardMaterial color={index % 2 === 0 ? "#4b5563" : "#6b7280"} metalness={0.7} roughness={0.45} />
        </mesh>
      ))}
      {/* Retaining nut at the bottom */}
      <mesh position={[0, -0.2 - discs * 0.035, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.02, 8]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

function MetreRule({ tiltTarget }: { tiltTarget: number }) {
  const ruleRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ruleRef.current) return;
    // Ease towards the target tilt so the rule settles like a real balance.
    ruleRef.current.rotation.z = THREE.MathUtils.damp(ruleRef.current.rotation.z, tiltTarget, 6, delta);
  });

  const graduations = useMemo(() => Array.from({ length: 21 }, (_, index) => index * 5), []);

  return (
    <group ref={ruleRef}>
      {/* The rule itself */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[RULE_VISUAL_LENGTH, 0.045, 0.16]} />
        <meshStandardMaterial color="#e8c893" roughness={0.55} />
      </mesh>
      {/* Graduation marks every 5 cm, longer every 10 cm */}
      {graduations.map((cm) => (
        <mesh key={cm} position={[(cm - 50) * CM_TO_UNITS, 0.024, cm % 10 === 0 ? 0.03 : 0.05]}>
          <boxGeometry args={[0.004, 0.002, cm % 10 === 0 ? 0.1 : 0.06]} />
          <meshStandardMaterial color="#3f2d16" />
        </mesh>
      ))}
      {/* Centre-of-gravity marker at the 50 cm mark */}
      <mesh position={[0, 0.025, -0.055]}>
        <boxGeometry args={[0.012, 0.003, 0.05]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
}

function KnifeEdgePivot() {
  return (
    <group position={[0, BENCH_TOP_Y, 0]}>
      {/* Heavy base */}
      <mesh position={[0, 0.035, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.07, 0.34]} />
        <meshStandardMaterial color="#1f2937" roughness={0.55} metalness={0.35} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.5, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.55} roughness={0.4} />
      </mesh>
      {/* Knife edge — a thin wedge the rule balances on */}
      <mesh position={[0, PIVOT_Y - BENCH_TOP_Y - 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.002, 0.22, 3]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function MomentsScene({
  w1,
  d1,
  w2,
  d2,
  tilt,
  mode,
  isMobile,
  moveVectorRef,
}: {
  w1: number;
  d1: number;
  w2: number;
  d2: number;
  tilt: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.4, 2.86, 4.6] : [0.7, 2.72, 4.3];
    camera.position.set(...position);
    camera.lookAt(0, 1.88, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 47;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  /** Hanger positions follow the tilted rule, so the wires stay attached. */
  const hangerPosition = (distanceCm: number, side: -1 | 1) => {
    const along = side * distanceCm * CM_TO_UNITS;
    return [along * Math.cos(tilt), PIVOT_Y + along * Math.sin(tilt), 0] as [number, number, number];
  };

  const left = hangerPosition(d1, -1);
  const right = hangerPosition(d2, 1);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#7c3aed"
        benchColor="#eef2f4"
        posterA={{
          title: "MOMENTS",
          lines: [
            "moment = force × perpendicular distance",
            "Unit: newton metre (N m) or N cm",
            "Equilibrium: Σ clockwise = Σ anticlockwise",
            "Also needs: Σ upward force = Σ downward force",
          ],
        }}
        posterB={{
          title: "EVERYDAY LEVERS",
          lines: ["A spanner: long handle, bigger moment", "A see-saw balances heavy near, light far", "Wheelbarrow, scissors and crowbar are levers"],
        }}
      >
        <KnifeEdgePivot />
        <group position={[0, PIVOT_Y, 0]}>
          <MetreRule tiltTarget={tilt} />
        </group>

        <group position={left}>
          <SlottedMass weight={w1} />
        </group>
        <group position={right}>
          <SlottedMass weight={w2} />
        </group>

        {/* Floating labels for each load */}
        <Html position={[left[0], left[1] + 0.5, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="w-[92px] rounded-lg border border-violet-300/30 bg-slate-950/90 px-1.5 py-1 text-center">
            <div className="text-[8px] font-black uppercase leading-tight text-violet-200">Anticlockwise</div>
            <div className="text-[9px] font-black text-white">
              {w1.toFixed(1)} N · {d1} cm
            </div>
          </div>
        </Html>
        <Html position={[right[0], right[1] + 0.5, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="w-[92px] rounded-lg border border-amber-300/30 bg-slate-950/90 px-1.5 py-1 text-center">
            <div className="text-[8px] font-black uppercase leading-tight text-amber-200">Clockwise</div>
            <div className="text-[9px] font-black text-white">
              {w2.toFixed(1)} N · {d2} cm
            </div>
          </div>
        </Html>
        <Html position={[0, PIVOT_Y - 0.34, 0.24]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="rounded-md border border-white/20 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
            Pivot · 50 cm mark
          </div>
        </Html>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.88, 0]} minDistance={2.2} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function MomentsPaper({ readings, onClose }: { readings: Reading[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Verifying the Principle of Moments</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To show that, for a beam in equilibrium, the sum of the clockwise moments about a pivot equals the sum of the anticlockwise moments.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Metre rule, knife edge (pivot) on a stand, two sets of slotted masses with hangers, thread or loops of cotton.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The metre rule was balanced on the knife edge and the balance point (its centre of gravity) noted at the 50 cm mark.</li>
          <li>A known weight W₁ was hung on the left-hand side and its distance d₁ from the pivot measured.</li>
          <li>A second weight W₂ was hung on the right and slid along the rule until the rule was horizontal again.</li>
          <li>Both weights and both distances were recorded.</li>
          <li>Steps 2–4 were repeated with different weight combinations.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Set</th>
              <th className="border border-slate-400 p-2">W₁ / N</th>
              <th className="border border-slate-400 p-2">d₁ / cm</th>
              <th className="border border-slate-400 p-2">W₂ / N</th>
              <th className="border border-slate-400 p-2">d₂ / cm</th>
              <th className="border border-slate-400 p-2">W₁d₁ / N cm</th>
              <th className="border border-slate-400 p-2">W₂d₂ / N cm</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading, index) => (
              <tr key={reading.id}>
                <td className="border border-slate-400 p-2 text-center">{index + 1}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.w1.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.d1}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.w2.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.d2}</td>
                <td className="border border-slate-400 p-2 text-center">{(reading.w1 * reading.d1).toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{(reading.w2 * reading.d2).toFixed(1)}</td>
              </tr>
            ))}
            {!readings.length &&
              [0, 1, 2].map((row) => (
                <tr key={row}>
                  <td className="border border-slate-400 p-2 text-center">{row + 1}</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                  <td className="border border-slate-400 p-2">&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Precautions</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The rule was first balanced without loads so that its own weight had no turning effect about the pivot.</li>
          <li>Distances were measured from the pivot to the centre of each hanger loop.</li>
          <li>The rule was read at eye level to avoid parallax error.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          For every balanced set the anticlockwise moment W₁ × d₁ was equal (within experimental error) to the clockwise
          moment W₂ × d₂. This verifies the principle of moments: when a body is in equilibrium the sum of the clockwise
          moments about any point equals the sum of the anticlockwise moments about that point.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function PrincipleOfMomentsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MomentsSimProps) {
  const [w1, setW1] = useState(2);
  const [d1, setD1] = useState(20);
  const [w2, setW2] = useState(1);
  const [d2, setD2] = useState(15);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const anticlockwise = w1 * d1;
  const clockwise = w2 * d2;
  const difference = clockwise - anticlockwise;
  const balanced = Math.abs(difference) <= BALANCE_TOLERANCE;

  /** Tilt is proportional to the unbalanced moment, saturating at MAX_TILT_RAD. */
  const tilt = balanced ? 0 : THREE.MathUtils.clamp(difference / 90, -1, 1) * MAX_TILT_RAD;

  const step = readings.length >= 3 ? 3 : balanced && hasLoaded ? 2 : hasLoaded ? 1 : 0;
  const complete = readings.length >= 3;
  const progress = Math.min(1, readings.length / 3);

  const markLoaded = useCallback(() => setHasLoaded(true), []);

  const updateW1 = useCallback(
    (value: number) => {
      markLoaded();
      setW1(value);
    },
    [markLoaded],
  );
  const updateD1 = useCallback(
    (value: number) => {
      markLoaded();
      setD1(value);
    },
    [markLoaded],
  );
  const updateW2 = useCallback(
    (value: number) => {
      markLoaded();
      setW2(value);
    },
    [markLoaded],
  );
  const updateD2 = useCallback(
    (value: number) => {
      markLoaded();
      setD2(value);
    },
    [markLoaded],
  );

  /** Slide the right-hand hanger to the distance that balances the rule. */
  const balanceIt = useCallback(() => {
    markLoaded();
    const target = Math.round((w1 * d1) / w2);
    if (target < 5 || target > 50) {
      // Out of reach on the rule — nudge the weight instead so a balance exists.
      const bestW2 = Math.max(0.5, Math.min(5, Math.round(((w1 * d1) / 40) * 2) / 2));
      setW2(bestW2);
      setD2(THREE.MathUtils.clamp(Math.round((w1 * d1) / bestW2), 5, 50));
      return;
    }
    setD2(target);
  }, [d1, markLoaded, w1, w2]);

  const recordReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (!balanced) return;
    setReadings((current) => {
      if (current.length >= 6) return current;
      return [...current, { id: `${Date.now()}-${current.length}`, w1, d1, w2, d2 }];
    });
  }, [balanced, d1, d2, w1, w2]);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setReadings([]);
    setHasLoaded(false);
    setW1(2);
    setD1(20);
    setW2(1);
    setD2(15);
  }, []);

  const toggleDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);
    setReadings([]);
    setHasLoaded(true);
    /** Three balanced sets played back in sequence. */
    const script: { w1: number; d1: number; w2: number; d2: number }[] = [
      { w1: 2, d1: 20, w2: 1, d2: 40 },
      { w1: 3, d1: 15, w2: 1.5, d2: 30 },
      { w1: 2.5, d1: 24, w2: 3, d2: 20 },
    ];
    script.forEach((set, index) => {
      demoTimers.current.push(
        window.setTimeout(() => {
          setW1(set.w1);
          setD1(set.d1);
          setW2(set.w2);
          setD2(set.d2);
        }, index * 2600),
      );
      demoTimers.current.push(
        window.setTimeout(() => {
          setReadings((current) => [...current, { id: `demo-${index}`, ...set }]);
        }, index * 2600 + 1500),
      );
    });
    demoTimers.current.push(window.setTimeout(() => setDemoActive(false), script.length * 2600));
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? "Three balanced sets recorded — in every one W₁ × d₁ equalled W₂ × d₂. The principle of moments is verified."
    : balanced
      ? `Balanced! Anticlockwise ${anticlockwise.toFixed(1)} N cm = clockwise ${clockwise.toFixed(1)} N cm. Record this reading.`
      : difference > 0
        ? `The rule tips to the right — the clockwise moment (${clockwise.toFixed(1)} N cm) is the bigger one.`
        : `The rule tips to the left — the anticlockwise moment (${anticlockwise.toFixed(1)} N cm) is the bigger one.`;

  const observation = complete
    ? `Every balanced set gave equal moments, e.g. ${readings[0].w1.toFixed(1)} N × ${readings[0].d1} cm = ${(readings[0].w1 * readings[0].d1).toFixed(1)} N cm on both sides.`
    : "Slide the weights until the rule is horizontal, then compare the two moments.";

  const primaryLabel = complete ? "Start again" : balanced ? "Record this reading" : "Balance the rule";

  const loadControls = (
    <div data-experiment-tour="moments-controls" className="space-y-2.5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-violet-200">Left load (anticlockwise)</span>
          <span className="text-sm font-black text-white">
            {w1.toFixed(1)} N · {d1} cm
          </span>
        </div>
        <label className="mt-2 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Weight W₁</label>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={w1}
          onChange={(event) => updateW1(Number(event.target.value))}
          className="w-full accent-violet-400"
        />
        <label className="mt-1 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Distance d₁ from pivot</label>
        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={d1}
          onChange={(event) => updateD1(Number(event.target.value))}
          className="w-full accent-violet-400"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wide text-amber-200">Right load (clockwise)</span>
          <span className="text-sm font-black text-white">
            {w2.toFixed(1)} N · {d2} cm
          </span>
        </div>
        <label className="mt-2 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Weight W₂</label>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={w2}
          onChange={(event) => updateW2(Number(event.target.value))}
          className="w-full accent-amber-400"
        />
        <label className="mt-1 block text-[9px] font-bold uppercase tracking-wide text-slate-400">Distance d₂ from pivot</label>
        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={d2}
          onChange={(event) => updateD2(Number(event.target.value))}
          className="w-full accent-amber-400"
        />
        <button
          onClick={balanceIt}
          className="mt-2 w-full rounded-xl bg-white/8 px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition hover:bg-white/15"
        >
          Slide until it balances
        </button>
      </div>
    </div>
  );

  const momentPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl border border-violet-400/25 bg-violet-500/10 px-2 py-2">
          <div className="text-[8px] font-black uppercase tracking-wide text-violet-200">Anticlockwise</div>
          <div className="text-base font-black text-white">{anticlockwise.toFixed(1)}</div>
          <div className="text-[8px] text-slate-400">N cm</div>
        </div>
        <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-2 py-2">
          <div className="text-[8px] font-black uppercase tracking-wide text-amber-200">Clockwise</div>
          <div className="text-base font-black text-white">{clockwise.toFixed(1)}</div>
          <div className="text-[8px] text-slate-400">N cm</div>
        </div>
      </div>
      <div
        className={`mt-2 rounded-xl px-2 py-1.5 text-center text-[10px] font-black uppercase tracking-wide ${
          balanced ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/15 text-rose-200"
        }`}
      >
        {balanced ? "Balanced — moments equal" : `Out of balance by ${Math.abs(difference).toFixed(1)} N cm`}
      </div>
    </div>
  );

  const readingsPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length}/3
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">No readings yet — balance the rule, then record.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">W₁d₁</th>
              <th className="py-0.5 text-left font-black uppercase">W₂d₂</th>
              <th className="py-0.5 text-right font-black uppercase">Equal?</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => {
              const a = reading.w1 * reading.d1;
              const c = reading.w2 * reading.d2;
              return (
                <tr key={reading.id} className="border-t border-white/5 text-slate-200">
                  <td className="py-1 font-bold">{a.toFixed(1)}</td>
                  <td className="py-1 font-bold">{c.toFixed(1)}</td>
                  <td className="py-1 text-right font-black text-emerald-300">
                    {Math.abs(a - c) <= BALANCE_TOLERANCE ? "✓" : "✗"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button
        onClick={recordReading}
        disabled={!balanced || readings.length >= 6}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        Record reading
      </button>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Moments Bench"
          subtitle="clockwise moment = anticlockwise moment"
          symbol="⚖️"
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

      <div data-experiment-tour="moments-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.7, 2.72, 4.3], fov: 47, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <MomentsScene
            w1={w1}
            d1={d1}
            w2={w2}
            d2={d2}
            tilt={tilt}
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
            emoji="⚖️"
            cornerEmoji="📏"
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
          title="Principle of Moments"
          tagline="clockwise moment = anticlockwise moment"
          missions={MOMENTS_MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : balanced ? "📝" : "⚖️"}
          onPrimary={complete ? resetAll : balanced ? recordReading : balanceIt}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "loads", label: "Loads", value: `${w1.toFixed(1)}N / ${w2.toFixed(1)}N`, content: loadControls },
            { id: "moments", label: "Moments", value: balanced ? "Balanced" : "Tilted", content: momentPanel },
            { id: "table", label: "Table", value: `${readings.length}/3`, content: readingsPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "balance", label: "Balance", onClick: balanceIt, tone: "blue" },
            { id: "record", label: "Record", onClick: recordReading, disabled: !balanced, tone: "green" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "loads", label: "Loads", value: `${w1.toFixed(1)}N / ${w2.toFixed(1)}N`, content: loadControls },
            { id: "moments", label: "Moments", value: balanced ? "Balanced" : "Tilted", content: momentPanel },
            { id: "table", label: "Table", value: `${readings.length}/3`, content: readingsPanel },
          ]}
        />
      )}

      {showPaper && <MomentsPaper readings={readings} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={momentsTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
