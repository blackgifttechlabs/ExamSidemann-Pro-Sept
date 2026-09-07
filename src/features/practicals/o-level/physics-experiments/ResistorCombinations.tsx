"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { BENCH_TOP_Y, LabLighting, LabPlayer, LabRoom } from "../../common/LabEnvironment";
import {
  AnalogueMeter,
  CircuitLead,
  CircuitSwitch,
  PowerSupply,
  ResistorBlock,
} from "../../common/ElectricalApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface ResistorCombinationsSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.violet;
const PAPER_FILENAME = "resistors-in-series-and-parallel.html";

/* ------------------------------------------------------------------ Science */

/** The three resistors in the kit, in ohms. */
const RESISTORS = [10, 15, 30];
const SUPPLY_VOLTAGE = 6;

type Arrangement = "single" | "series2" | "series3" | "parallel2" | "parallel3";

interface ArrangementSpec {
  id: Arrangement;
  label: string;
  short: string;
  /** Which of the three resistors are in circuit. */
  used: number[];
  parallel: boolean;
  formula: string;
}

const ARRANGEMENTS: ArrangementSpec[] = [
  { id: "single", label: "R₁ on its own", short: "R₁", used: [0], parallel: false, formula: "R = V ÷ I" },
  { id: "series2", label: "R₁ and R₂ in series", short: "R₁+R₂", used: [0, 1], parallel: false, formula: "R = R₁ + R₂" },
  { id: "series3", label: "All three in series", short: "Series ×3", used: [0, 1, 2], parallel: false, formula: "R = R₁ + R₂ + R₃" },
  { id: "parallel2", label: "R₁ and R₂ in parallel", short: "R₁∥R₂", used: [0, 1], parallel: true, formula: "1/R = 1/R₁ + 1/R₂" },
  { id: "parallel3", label: "All three in parallel", short: "Parallel ×3", used: [0, 1, 2], parallel: true, formula: "1/R = 1/R₁ + 1/R₂ + 1/R₃" },
];

function combinedResistance(spec: ArrangementSpec) {
  const values = spec.used.map((index) => RESISTORS[index]);
  if (!spec.parallel) return values.reduce((total, value) => total + value, 0);
  return 1 / values.reduce((total, value) => total + 1 / value, 0);
}

interface Reading {
  id: string;
  arrangement: Arrangement;
  label: string;
  predicted: number;
  voltage: number;
  current: number;
  measured: number;
}

const COMBINATION_MISSIONS: GameMission[] = [
  {
    short: "Alone",
    title: "Measure one resistor",
    detail: "Connect a single resistor with the ammeter in series and the voltmeter across it, and find R from V ÷ I.",
    symbol: "🔎",
  },
  {
    short: "Series",
    title: "Join two in series",
    detail: "Put the resistors end to end. Predict the total from R = R₁ + R₂, then measure it and compare.",
    symbol: "➖",
  },
  {
    short: "Parallel",
    title: "Join them in parallel",
    detail: "Connect both across the same two points. Predict from 1/R = 1/R₁ + 1/R₂, then measure.",
    symbol: "🔀",
  },
  {
    short: "Compare",
    title: "Look at the pattern",
    detail: "The series total is bigger than the biggest resistor; the parallel total is smaller than the smallest.",
    symbol: "📊",
  },
];

const combinationTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Combining resistors",
    text: "Resistors joined end to end are in series and their resistances simply add. Resistors joined across the same two points are in parallel and the total is worked out from 1/R = 1/R₁ + 1/R₂.",
    mode: "modal",
  },
  {
    title: "The circuit",
    text: "The ammeter is in series with the combination, so it reads the total current. The voltmeter is across the whole combination, so it reads the p.d. across it.",
    mode: "bubble",
    selector: '[data-experiment-tour="combination-scene"]',
  },
  {
    title: "Predict, then measure",
    text: "Work out what the total should be from the formula before you close the switch. Then measure R = V ÷ I and see how close you were.",
    mode: "bubble",
    selector: '[data-experiment-tour="combination-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "The pattern to learn",
    text: "In series the current is the same everywhere and the p.d.s add up. In parallel the p.d. is the same across each branch and the currents add up.",
    mode: "bubble",
    selector: '[data-experiment-tour="combination-table"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function CombinationBoard({
  spec,
  switchClosed,
}: {
  spec: ArrangementSpec;
  switchClosed: boolean;
}) {
  const used = spec.used;

  return (
    <group position={[0.15, 0.02, 0.35]}>
      {/* Mounting board */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[1.9, 0.02, 1.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.72} />
      </mesh>

      {used.map((resistorIndex, position) => {
        const x = spec.parallel ? 0 : -0.62 + position * 0.62;
        const z = spec.parallel ? -0.3 + position * 0.3 : 0;
        return (
          <ResistorBlock
            key={resistorIndex}
            position={[x, 0.02, z]}
            ohms={RESISTORS[resistorIndex]}
            highlighted={switchClosed}
          />
        );
      })}

      {/* Connecting links between the resistors */}
      {!spec.parallel &&
        used.slice(0, -1).map((_, index) => (
          <CircuitLead
            key={index}
            points={[
              [-0.62 + index * 0.62 + 0.18, 0.09, 0],
              [-0.62 + (index + 1) * 0.62 - 0.18, 0.09, 0],
            ]}
            colour="#111827"
          />
        ))}
      {spec.parallel && (
        <>
          <CircuitLead
            points={used.map((_, index) => [-0.28, 0.09, -0.3 + index * 0.3] as [number, number, number])}
            colour="#111827"
          />
          <CircuitLead
            points={used.map((_, index) => [0.28, 0.09, -0.3 + index * 0.3] as [number, number, number])}
            colour="#111827"
          />
          {used.map((_, index) => (
            <group key={index}>
              <CircuitLead
                points={[
                  [-0.28, 0.09, -0.3 + index * 0.3],
                  [-0.18, 0.09, -0.3 + index * 0.3],
                ]}
                colour="#111827"
              />
              <CircuitLead
                points={[
                  [0.18, 0.09, -0.3 + index * 0.3],
                  [0.28, 0.09, -0.3 + index * 0.3],
                ]}
                colour="#111827"
              />
            </group>
          ))}
        </>
      )}

      <Html position={[0, 0.45, 0.5]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-lg border border-violet-300/30 bg-slate-950/92 px-2 py-1 text-center">
          <div className="text-[9px] font-black text-white">{spec.label}</div>
          <div className="text-[7px] font-black uppercase text-violet-200">{spec.formula}</div>
        </div>
      </Html>
    </group>
  );
}

function CombinationScene({
  spec,
  switchClosed,
  current,
  voltage,
  mode,
  isMobile,
  moveVectorRef,
}: {
  spec: ArrangementSpec;
  switchClosed: boolean;
  current: number;
  voltage: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 3.35, 3.0] : [0.1, 3.0, 2.5];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.12, 0.1);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#7c3aed"
        benchColor="#eef0f5"
        posterA={{
          title: "COMBINING RESISTORS",
          lines: [
            "Series: R = R₁ + R₂ + R₃",
            "Parallel: 1/R = 1/R₁ + 1/R₂ + 1/R₃",
            "Series total > the largest resistor",
            "Parallel total < the smallest resistor",
          ],
        }}
        posterB={{
          title: "CURRENT AND P.D.",
          lines: ["Series: same I, p.d.s add up", "Parallel: same V, currents add up", "Measure R from V ÷ I"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          <PowerSupply position={[-1.45, 0.02, -0.75]} voltage={SUPPLY_VOLTAGE} on={switchClosed} />
          <CircuitSwitch position={[-0.7, 0.02, -0.95]} closed={switchClosed} />
          <AnalogueMeter position={[0.15, 0.02, -0.85]} kind="ammeter" value={current} max={1.4} decimals={2} label="ammeter" />
          <AnalogueMeter position={[1.3, 0.02, -0.65]} kind="voltmeter" value={voltage} max={6} decimals={2} label="voltmeter" />
          <CombinationBoard spec={spec} switchClosed={switchClosed} />

          <CircuitLead
            points={[
              [-1.29, 0.3, -0.59],
              [-1.29, 0.07, -1.1],
              [-0.84, 0.07, -1.1],
              [-0.84, 0.06, -0.95],
            ]}
            colour="#b91c1c"
          />
          <CircuitLead
            points={[
              [-0.56, 0.06, -0.95],
              [-0.2, 0.07, -1.08],
              [0.02, 0.29, -0.68],
            ]}
            colour="#111827"
          />
          <CircuitLead
            points={[
              [0.28, 0.29, -0.68],
              [0.4, 0.09, -0.35],
              [-0.13, 0.11, 0.35],
            ]}
            colour="#111827"
          />
          <CircuitLead
            points={[
              [0.43, 0.11, 0.35],
              [1.6, 0.07, 0.5],
              [-1.75, 0.06, 0.6],
              [-1.61, 0.3, -0.59],
            ]}
            colour="#111827"
          />
          {/* Voltmeter across the whole combination */}
          <CircuitLead points={[[1.17, 0.29, -0.48], [0.7, 0.1, 0.05], [-0.13, 0.12, 0.36]]} colour="#1d4ed8" />
          <CircuitLead points={[[1.43, 0.29, -0.48], [1.1, 0.1, 0.2], [0.43, 0.12, 0.36]]} colour="#1d4ed8" />
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.12, 0.1]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.46} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function CombinationPaper({ readings, onClose }: { readings: Reading[]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Resistors in Series and in Parallel</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To measure the resistance of single resistors and of combinations of them, and to check the results against the formulae for resistors in series and in parallel.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Three resistors of {RESISTORS.join(" Ω, ")} Ω, a 6 V d.c. supply, an ammeter (0–1.5 A), a voltmeter (0–6 V), a switch, a mounting board and connecting leads.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The first resistor was connected in series with the switch, the ammeter and the supply, and the voltmeter was connected across the resistor.</li>
          <li>The switch was closed, the ammeter and voltmeter readings were taken, and the switch was opened again.</li>
          <li>The resistance was calculated from R = V ÷ I and compared with the marked value.</li>
          <li>Two resistors were then joined end to end, in series, and the measurement repeated.</li>
          <li>The same two resistors were then connected across the same pair of points, in parallel, and the measurement repeated.</li>
          <li>Finally all three resistors were measured, first in series and then in parallel.</li>
          <li>For each arrangement the expected value was calculated from the formula and compared with the measured value.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Arrangement</th>
              <th className="border border-slate-400 p-2">Expected R / Ω</th>
              <th className="border border-slate-400 p-2">V / V</th>
              <th className="border border-slate-400 p-2">I / A</th>
              <th className="border border-slate-400 p-2">Measured R = V/I / Ω</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading) => (
              <tr key={reading.id}>
                <td className="border border-slate-400 p-2">{reading.label}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.predicted.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.voltage.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.current.toFixed(3)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.measured.toFixed(1)}</td>
              </tr>
            ))}
            {!readings.length &&
              [0, 1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  {Array.from({ length: 5 }, (_, cell) => (
                    <td key={cell} className="border border-slate-400 p-2">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The measured resistances agreed with the values calculated from the formulae within the accuracy of the meters.
          For resistors in series R = R₁ + R₂ + R₃, and the total is always greater than the largest single resistance,
          because the charge has to pass through every resistor in turn. For resistors in parallel
          1/R = 1/R₁ + 1/R₂ + 1/R₃, and the total is always less than the smallest single resistance, because adding
          another branch gives the charge another path to flow along. In a series circuit the current is the same at
          every point and the p.d.s across the resistors add up to the supply p.d.; in a parallel circuit the p.d. across
          each branch is the same and the branch currents add up to the total current.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The switch was closed only while the readings were being taken, so that the resistors did not warm up and change value.</li>
          <li>The ammeter was connected in series and the voltmeter in parallel, both with the correct polarity.</li>
          <li>Readings were taken looking squarely at the scale, to avoid parallax error.</li>
          <li>The connections were checked for tightness, since a loose crocodile clip adds resistance of its own.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function ResistorCombinationsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ResistorCombinationsSimProps) {
  const [arrangementId, setArrangementId] = useState<Arrangement>("single");
  const [switchClosed, setSwitchClosed] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [prediction, setPrediction] = useState("");
  const [predictionChecked, setPredictionChecked] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const timers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const spec = useMemo(
    () => ARRANGEMENTS.find((item) => item.id === arrangementId) ?? ARRANGEMENTS[0],
    [arrangementId],
  );
  const predicted = useMemo(() => combinedResistance(spec), [spec]);
  const current = switchClosed ? SUPPLY_VOLTAGE / predicted : 0;
  const voltage = switchClosed ? SUPPLY_VOLTAGE : 0;
  const measured = current > 0 ? voltage / current : 0;

  /** Branch currents in parallel, or p.d.s across each resistor in series. */
  const branchDetail = useMemo(
    () =>
      spec.used.map((index) => {
        const ohms = RESISTORS[index];
        if (spec.parallel) {
          return { ohms, current: switchClosed ? SUPPLY_VOLTAGE / ohms : 0, voltage: switchClosed ? SUPPLY_VOLTAGE : 0 };
        }
        return { ohms, current, voltage: current * ohms };
      }),
    [current, spec, switchClosed],
  );

  const recordReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (!switchClosed) return;
    setReadings((existing) => {
      if (existing.some((reading) => reading.arrangement === spec.id)) return existing;
      return [
        ...existing,
        {
          id: `${Date.now()}-${spec.id}`,
          arrangement: spec.id,
          label: spec.label,
          predicted,
          voltage,
          current,
          measured,
        },
      ];
    });
  }, [current, measured, predicted, spec, switchClosed, voltage]);

  const selectArrangement = useCallback((id: Arrangement) => {
    setArrangementId(id);
    setSwitchClosed(false);
    setPrediction("");
    setPredictionChecked(false);
  }, []);

  const resetAll = useCallback(() => {
    clearTimers();
    setReadings([]);
    setArrangementId("single");
    setSwitchClosed(false);
    setPrediction("");
    setPredictionChecked(false);
    setDemoActive(false);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      setSwitchClosed(false);
      return;
    }
    setDemoActive(true);
    setReadings([]);

    /** Works through all five arrangements, recording each one. */
    ARRANGEMENTS.forEach((item, index) => {
      const start = index * 1500;
      timers.current.push(
        window.setTimeout(() => {
          setArrangementId(item.id);
          setSwitchClosed(false);
        }, start),
      );
      timers.current.push(window.setTimeout(() => {
            labSounds.play("switchClick", { volume: 0.55 });
            labSounds.play("lampOn", { volume: 0.4 });
            setSwitchClosed(true);
          }, start + 420));
      timers.current.push(
        window.setTimeout(() => {
          const expected = combinedResistance(item);
          const flow = SUPPLY_VOLTAGE / expected;
          setReadings((existing) =>
            existing.some((reading) => reading.arrangement === item.id)
              ? existing
              : [
                  ...existing,
                  {
                    id: `demo-${item.id}`,
                    arrangement: item.id,
                    label: item.label,
                    predicted: expected,
                    voltage: SUPPLY_VOLTAGE,
                    current: flow,
                    measured: expected,
                  },
                ],
          );
        }, start + 980),
      );
      timers.current.push(window.setTimeout(() => setSwitchClosed(false), start + 1180));
    });

    timers.current.push(window.setTimeout(() => setDemoActive(false), ARRANGEMENTS.length * 1500 + 400));
  }, [clearTimers, demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = readings.length >= ARRANGEMENTS.length;
  const hasSeries = readings.some((reading) => reading.arrangement.startsWith("series"));
  const hasParallel = readings.some((reading) => reading.arrangement.startsWith("parallel"));
  const step = complete ? 3 : hasParallel ? 3 : hasSeries ? 2 : readings.length >= 1 ? 1 : 0;
  const progress = Math.min(1, readings.length / ARRANGEMENTS.length);

  const predictionValue = Number(prediction);
  const predictionClose = Number.isFinite(predictionValue) && Math.abs(predictionValue - predicted) < Math.max(0.5, predicted * 0.05);

  const status = complete
    ? "All five arrangements measured. The series totals came out bigger than the biggest resistor, and the parallel totals smaller than the smallest."
    : switchClosed
      ? `V = ${voltage.toFixed(2)} V and I = ${current.toFixed(3)} A, so R = ${measured.toFixed(1)} Ω. The formula gives ${predicted.toFixed(1)} Ω.`
      : predictionChecked
        ? predictionClose
          ? `Good prediction. Close the switch and check it: ${spec.formula} gives ${predicted.toFixed(1)} Ω.`
          : `Not quite — ${spec.formula} gives ${predicted.toFixed(1)} Ω. Close the switch and see.`
        : `${spec.label}. Work out what R should be from ${spec.formula}, then close the switch and measure it.`;

  const observation = complete
    ? "In series the resistances add. In parallel the total is always less than the smallest branch, because you have given the current another route."
    : spec.parallel
      ? "Each branch has the full 6 V across it, so each carries its own current — and those currents add up."
      : "The same current passes through every resistor, and the p.d.s across them add up to the supply p.d.";

  const primaryLabel = complete ? "Start again" : switchClosed ? "Record V and I" : "Close the switch";

  const controlPanel = (
    <div data-experiment-tour="combination-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Arrangement</span>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {ARRANGEMENTS.map((item) => {
          const done = readings.some((reading) => reading.arrangement === item.id);
          return (
            <button
              key={item.id}
              onClick={() => selectArrangement(item.id)}
              disabled={demoActive}
              className="flex items-center justify-between gap-1 rounded-xl px-2 py-1.5 text-left text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
              style={
                arrangementId === item.id
                  ? { background: ACCENT.base, color: "#0f172a" }
                  : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
              }
            >
              <span className="truncate">{item.short}</span>
              {done && <span>✓</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-2">
        <div className="text-[9px] font-black uppercase text-slate-400">Predict first</div>
        <div className="mt-1 text-[10px] font-black text-white">{spec.formula}</div>
        <div className="mt-1.5 flex gap-1.5">
          <input
            value={prediction}
            onChange={(event) => {
              setPrediction(event.target.value);
              setPredictionChecked(false);
            }}
            inputMode="decimal"
            placeholder="R in Ω"
            className="w-full rounded-lg border border-white/10 bg-slate-950/60 px-2 py-1.5 text-[10px] font-bold text-white outline-none placeholder:text-slate-600"
          />
          <button
            onClick={() => setPredictionChecked(true)}
            disabled={!prediction}
            className="shrink-0 rounded-lg px-2 py-1.5 text-[9px] font-black uppercase text-slate-950 disabled:opacity-40"
            style={{ background: ACCENT.base }}
          >
            Check
          </button>
        </div>
        {predictionChecked && (
          <p className="mt-1.5 text-[9px] font-black uppercase" style={{ color: predictionClose ? "#a7f3d0" : "#fecdd3" }}>
            {predictionClose ? `Correct — ${predicted.toFixed(1)} Ω` : `The formula gives ${predicted.toFixed(1)} Ω`}
          </p>
        )}
      </div>

      <button
        onClick={() => setSwitchClosed((value) => !value)}
        disabled={demoActive}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
        style={switchClosed ? { background: "#dc2626", color: "#fff" } : { background: ACCENT.base, color: "#0f172a" }}
      >
        {switchClosed ? "Open the switch" : "Close the switch"}
      </button>

      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">V</div>
          <div className="text-sm font-black text-white">{voltage.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">I</div>
          <div className="text-sm font-black text-white">{current.toFixed(3)}</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            R = V/I
          </div>
          <div className="text-sm font-black text-white">{switchClosed ? measured.toFixed(1) : "—"}</div>
        </div>
      </div>
    </div>
  );

  const branchPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">
        {spec.parallel ? "Current in each branch" : "P.d. across each resistor"}
      </span>
      <table className="mt-2 w-full text-[9px]">
        <thead>
          <tr className="text-slate-400">
            <th className="py-0.5 text-left font-black uppercase">Resistor</th>
            <th className="py-0.5 text-right font-black uppercase">I / A</th>
            <th className="py-0.5 text-right font-black uppercase">V / V</th>
          </tr>
        </thead>
        <tbody>
          {branchDetail.map((branch, index) => (
            <tr key={index} className="border-t border-white/5 text-slate-200">
              <td className="py-1 font-bold">{branch.ohms} Ω</td>
              <td className="py-1 text-right font-black">{branch.current.toFixed(3)}</td>
              <td className="py-1 text-right font-black">{branch.voltage.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="border-t border-white/15 text-white">
            <td className="py-1 text-[9px] font-black uppercase">Total</td>
            <td className="py-1 text-right font-black">{current.toFixed(3)}</td>
            <td className="py-1 text-right font-black">{voltage.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-1.5 text-[9px] font-bold text-slate-400">
        {spec.parallel
          ? "Same p.d. across every branch; the branch currents add up to the total."
          : "Same current everywhere; the p.d.s add up to the supply p.d."}
      </p>
    </div>
  );

  const tablePanel = (
    <div data-experiment-tour="combination-table" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length}/{ARRANGEMENTS.length}
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Nothing recorded yet.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">Set-up</th>
              <th className="py-0.5 text-right font-black uppercase">Expected</th>
              <th className="py-0.5 text-right font-black uppercase">Measured</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{ARRANGEMENTS.find((item) => item.id === reading.arrangement)?.short}</td>
                <td className="py-1 text-right">{reading.predicted.toFixed(1)} Ω</td>
                <td className="py-1 text-right font-black">{reading.measured.toFixed(1)} Ω</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={recordReading}
        disabled={!switchClosed || demoActive}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        Record this arrangement
      </button>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Series and Parallel Bench"
          subtitle="Predict the total, then measure it"
          symbol="🔀"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to O Level Physics"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={complete ? 4 : step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="combination-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.1, 3.0, 2.5], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <CombinationScene
            spec={spec}
            switchClosed={switchClosed}
            current={current}
            voltage={voltage}
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
            emoji="🔀"
            cornerEmoji="🔌"
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
          title="Series and Parallel"
          tagline="Predict the total, then measure it"
          missions={COMBINATION_MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : switchClosed ? "📝" : "🔌"}
          onPrimary={complete ? resetAll : switchClosed ? recordReading : () => {
            labSounds.play("switchClick", { volume: 0.55 });
            labSounds.play("lampOn", { volume: 0.4 });
            setSwitchClosed(true);
          }}
          primaryDisabled={demoActive}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "controls", label: "Set-up", value: spec.short, content: controlPanel },
            { id: "branches", label: spec.parallel ? "Branches" : "P.d.s", content: branchPanel },
            { id: "table", label: "Results", value: `${readings.length}/${ARRANGEMENTS.length}`, content: tablePanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "switch",
              label: switchClosed ? "Open" : "Close",
              onClick: () => setSwitchClosed((value) => !value),
              disabled: demoActive,
              tone: switchClosed ? "red" : "green",
            },
            { id: "record", label: "Record", onClick: recordReading, disabled: !switchClosed || demoActive, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "controls", label: "Set-up", value: spec.short, content: controlPanel },
            { id: "branches", label: spec.parallel ? "Branches" : "P.d.s", content: branchPanel },
            { id: "table", label: "Results", value: `${readings.length}/${ARRANGEMENTS.length}`, content: tablePanel },
          ]}
        />
      )}

      {showPaper && <CombinationPaper readings={readings} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={combinationTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
