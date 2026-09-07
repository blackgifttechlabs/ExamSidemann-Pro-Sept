"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentResultsGraph } from "../../common/ExperimentResultsGraph";
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
  ResistanceWireOnRule,
  RheostatBox,
} from "../../common/ElectricalApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface ResistanceSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.amber;
const PAPER_FILENAME = "resistance-of-a-wire.html";

/* ------------------------------------------------------------------ Science */

interface WireSpec {
  id: string;
  material: string;
  /** Resistivity in Ω m at room temperature. */
  resistivity: number;
  colour: string;
}

const WIRES: WireSpec[] = [
  { id: "constantan", material: "Constantan", resistivity: 4.9e-7, colour: "#a8a29e" },
  { id: "nichrome", material: "Nichrome", resistivity: 1.1e-6, colour: "#78716c" },
  { id: "copper", material: "Copper", resistivity: 1.68e-8, colour: "#b45309" },
];

/** Standard wire gauges kept in the physics prep room, as diameters in mm. */
const DIAMETERS = [0.19, 0.27, 0.38, 0.56];

/** Supply e.m.f. and the protective resistance left permanently in circuit. */
const SUPPLY_VOLTAGE = 3;
const PROTECTIVE_RESISTANCE = 3.3;

type Investigation = "length" | "thickness";

interface Reading {
  id: string;
  /** Length under test, in metres. */
  length: number;
  /** Diameter in mm. */
  diameter: number;
  area: number;
  voltage: number;
  current: number;
  resistance: number;
}

const crossSection = (diameterMm: number) => Math.PI * (diameterMm / 1000 / 2) ** 2;

const wireResistance = (wire: WireSpec, lengthMetres: number, diameterMm: number) =>
  (wire.resistivity * lengthMetres) / crossSection(diameterMm);

const RESISTANCE_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Build the circuit",
    detail: "Connect the supply, switch, ammeter and rheostat in series with the wire, and the voltmeter across the wire only.",
    symbol: "🔌",
  },
  {
    short: "Measure",
    title: "Read V and I",
    detail: "Slide the crocodile clip to a chosen length, close the switch just long enough to read both meters, then open it again.",
    symbol: "🔎",
  },
  {
    short: "Record",
    title: "Work out R = V ÷ I",
    detail: "Take at least six lengths spread over the whole metre, and calculate the resistance for each one.",
    symbol: "📝",
  },
  {
    short: "Graph",
    title: "Plot R against length",
    detail: "A straight line through the origin shows that R ∝ L. Then change the thickness and see what happens.",
    symbol: "📈",
  },
];

const resistanceTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What decides resistance?",
    text: "The resistance of a wire depends on its length, its cross-sectional area, what it is made of, and its temperature. This experiment changes one of those at a time.",
    mode: "modal",
  },
  {
    title: "The circuit",
    text: "The ammeter goes in series so it reads the current through the wire; the voltmeter goes across the wire so it reads the p.d. across it. Then R = V ÷ I.",
    mode: "bubble",
    selector: '[data-experiment-tour="resistance-scene"]',
  },
  {
    title: "Change one thing at a time",
    text: "Slide the crocodile clip to change the length with the same wire. To investigate thickness, keep the length fixed and swap to a different gauge.",
    mode: "bubble",
    selector: '[data-experiment-tour="resistance-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Keeping it fair",
    text: "Close the switch only while you take the reading. Current warms the wire, and a hot wire has a higher resistance, which would spoil the results.",
    mode: "bubble",
    selector: '[data-experiment-tour="resistance-graph"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function ResistanceScene({
  wire,
  tapped,
  diameter,
  switchClosed,
  current,
  voltage,
  heat,
  mode,
  isMobile,
  moveVectorRef,
}: {
  wire: WireSpec;
  tapped: number;
  diameter: number;
  switchClosed: boolean;
  current: number;
  voltage: number;
  heat: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 3.3, 3.2] : [0.1, 3.0, 2.7];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.1, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const wireY = 0.08;

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#d97706"
        benchColor="#eef1f4"
        posterA={{
          title: "RESISTANCE",
          lines: [
            "R = V ÷ I",
            "R ∝ length of wire",
            "R ∝ 1 ÷ cross-sectional area",
            "R = ρL ÷ A",
          ],
        }}
        posterB={{
          title: "FAIR TESTING",
          lines: ["Same wire, same temperature", "Switch on only to read", "Change one variable at a time"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {/* Wire stretched along a metre rule at the front of the bench */}
          <ResistanceWireOnRule
            position={[0, 0.02, 0.72]}
            tapped={tapped}
            wireColour={wire.colour}
            wireRadius={0.006 + diameter * 0.02}
            hot={heat}
          />

          <PowerSupply position={[-1.35, 0.02, -0.75]} voltage={SUPPLY_VOLTAGE} on={switchClosed} />
          <CircuitSwitch position={[-0.5, 0.02, -0.85]} closed={switchClosed} />
          <AnalogueMeter position={[0.35, 0.02, -0.8]} kind="ammeter" value={current} max={1.2} decimals={2} label="ammeter (series)" />
          <AnalogueMeter position={[1.3, 0.02, -0.8]} kind="voltmeter" value={voltage} max={3} decimals={2} label="voltmeter (across wire)" />
          <RheostatBox position={[-0.15, 0.02, -0.05]} fraction={0.55} ohmsInCircuit={PROTECTIVE_RESISTANCE} />

          {/* Leads: supply → switch → ammeter → rheostat → wire → back to supply */}
          <CircuitLead
            points={[
              [-1.19, wireY + 0.28, -0.59],
              [-1.19, wireY + 0.06, -0.95],
              [-0.64, wireY + 0.06, -0.95],
              [-0.64, wireY + 0.06, -0.85],
            ]}
            colour="#b91c1c"
          />
          <CircuitLead
            points={[
              [-0.36, wireY + 0.06, -0.85],
              [-0.1, wireY + 0.06, -0.98],
              [0.22, wireY + 0.21, -0.63],
            ]}
            colour="#111827"
          />
          <CircuitLead
            points={[
              [0.48, wireY + 0.21, -0.63],
              [0.55, wireY + 0.06, -0.3],
              [0.32, wireY + 0.09, -0.05],
            ]}
            colour="#111827"
          />
          <CircuitLead
            points={[
              [-0.68, wireY + 0.09, 0.05],
              [-0.9, wireY + 0.02, 0.4],
              [-1.1, wireY - 0.01, 0.72],
            ]}
            colour="#111827"
          />
          <CircuitLead
            points={[
              [-1.51, wireY + 0.28, -0.59],
              [-1.7, wireY + 0.02, 0.4],
              [-1.15, wireY - 0.01, 0.78],
            ]}
            colour="#111827"
          />
          {/* Voltmeter leads, connected across the length under test only */}
          <CircuitLead
            points={[
              [1.17, wireY + 0.21, -0.63],
              [1.0, wireY + 0.04, 0.2],
              [-1.1, wireY - 0.01, 0.74],
            ]}
            colour="#1d4ed8"
          />
          <CircuitLead
            points={[
              [1.43, wireY + 0.21, -0.63],
              [1.5, wireY + 0.04, 0.35],
              [-1.1 + tapped * 2.2, wireY - 0.01, 0.74],
            ]}
            colour="#1d4ed8"
          />
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.1, 0]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.46} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function ResistancePaper({
  wire,
  readings,
  investigation,
  resistivity,
  onClose,
}: {
  wire: WireSpec;
  readings: Reading[];
  investigation: Investigation;
  resistivity: number | null;
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Factors Affecting the Resistance of a Wire</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To investigate how the resistance of a metal wire depends on its length and on its cross-sectional area, and to use the results to find the resistivity of the wire.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>A metre rule with {wire.material.toLowerCase()} wire stretched along it, two crocodile clips, a low-voltage d.c. supply, a switch, a rheostat, an ammeter (0–1 A), a voltmeter (0–3 V), connecting leads and a micrometer screw gauge.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The wire was stretched along the metre rule and fastened at each end, and the circuit was connected with the supply, switch, ammeter, rheostat and wire in series.</li>
          <li>The voltmeter was connected across the length of wire between the two crocodile clips.</li>
          <li>The diameter of the wire was measured at three points along it with a micrometer screw gauge and the mean value taken. The cross-sectional area was found from A = πd² ÷ 4.</li>
          <li>The sliding crocodile clip was set to a length of 100 cm.</li>
          <li>The switch was closed, the ammeter and voltmeter readings were taken quickly, and the switch was opened again.</li>
          <li>The resistance was calculated from R = V ÷ I.</li>
          <li>Steps 4–6 were repeated for lengths of 90, 80, 70, 60, 50, 40, 30 and 20 cm.</li>
          <li>A graph of resistance against length was plotted.</li>
          <li>The whole procedure was then repeated with wires of different diameters, keeping the length fixed, and a graph of resistance against 1 ÷ A was plotted.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Length L / m</th>
              <th className="border border-slate-400 p-2">Diameter d / mm</th>
              <th className="border border-slate-400 p-2">p.d. V / V</th>
              <th className="border border-slate-400 p-2">Current I / A</th>
              <th className="border border-slate-400 p-2">R = V/I / Ω</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading) => (
              <tr key={reading.id}>
                <td className="border border-slate-400 p-2 text-center">{reading.length.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.diameter.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.voltage.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.current.toFixed(3)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.resistance.toFixed(2)}</td>
              </tr>
            ))}
            {!readings.length &&
              [0, 1, 2, 3, 4, 5].map((row) => (
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
        <h2 className="mt-5 font-bold uppercase">Graph</h2>
        <p>
          {investigation === "length"
            ? "The graph of resistance against length was a straight line passing through the origin, which shows that the resistance of the wire is directly proportional to its length."
            : "The graph of resistance against 1 ÷ A was a straight line passing through the origin, which shows that the resistance is inversely proportional to the cross-sectional area — a thicker wire has a lower resistance."}
        </p>
        <h2 className="mt-5 font-bold uppercase">Calculation</h2>
        <p>
          Since R = ρL ÷ A, the gradient of the graph of R against L is ρ ÷ A, so ρ = gradient × A.
          {resistivity !== null
            ? ` From these results the resistivity of the ${wire.material.toLowerCase()} wire was ${resistivity.toExponential(2)} Ω m, which agrees with the accepted value of ${wire.resistivity.toExponential(2)} Ω m.`
            : ""}
        </p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The resistance of a wire is directly proportional to its length and inversely proportional to its
          cross-sectional area, and it also depends on the material the wire is made of. Doubling the length doubles the
          resistance, because the electrons have twice as far to travel against the opposition of the lattice; doubling
          the area halves the resistance, because there are twice as many paths for the charge to flow along. These are
          summed up by R = ρL ÷ A, where ρ is the resistivity of the material.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The switch was closed only while readings were being taken, so that the wire did not warm up — a hot wire has a higher resistance.</li>
          <li>A rheostat was kept in the circuit to limit the current for the same reason.</li>
          <li>The wire was kept straight and taut against the rule, since kinks make the measured length too short.</li>
          <li>The diameter was measured at several places and averaged, because the wire is not perfectly uniform, and the area depends on the square of the diameter so any error in d is doubled in A.</li>
          <li>Constantan or nichrome is used rather than copper: their resistance is high enough to measure easily and changes very little with temperature.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function ResistanceOfAWireSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ResistanceSimProps) {
  const [wireId, setWireId] = useState(WIRES[0].id);
  const [investigation, setInvestigation] = useState<Investigation>("length");
  const [lengthCm, setLengthCm] = useState(100);
  const [diameter, setDiameter] = useState(DIAMETERS[1]);
  const [switchClosed, setSwitchClosed] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [heat, setHeat] = useState(0);
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

  const wire = useMemo(() => WIRES.find((item) => item.id === wireId) ?? WIRES[0], [wireId]);
  const lengthMetres = lengthCm / 100;
  const area = crossSection(diameter);
  const resistance = wireResistance(wire, lengthMetres, diameter);
  const current = switchClosed ? SUPPLY_VOLTAGE / (resistance + PROTECTIVE_RESISTANCE) : 0;
  const voltage = current * resistance;

  /** Leaving the switch closed warms the wire, which is the classic error here. */
  useEffect(() => {
    if (!switchClosed) {
      const cool = window.setInterval(() => setHeat((value) => Math.max(0, value - 0.06)), 220);
      return () => window.clearInterval(cool);
    }
    const warm = window.setInterval(() => setHeat((value) => Math.min(1, value + 0.045)), 220);
    return () => window.clearInterval(warm);
  }, [switchClosed]);

  const recordReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (!switchClosed) return;
    setReadings((existing) => {
      const duplicate = existing.some(
        (reading) => Math.abs(reading.length - lengthMetres) < 0.01 && Math.abs(reading.diameter - diameter) < 0.001,
      );
      if (duplicate || existing.length >= 10) return existing;
      const entry: Reading = {
        id: `${Date.now()}-${existing.length}`,
        length: lengthMetres,
        diameter,
        area,
        voltage,
        current,
        resistance,
      };
      return [...existing, entry].sort((a, b) => (investigation === "length" ? a.length - b.length : a.area - b.area));
    });
  }, [area, current, diameter, investigation, lengthMetres, resistance, switchClosed, voltage]);

  const resetAll = useCallback(() => {
    clearTimers();
    setReadings([]);
    setSwitchClosed(false);
    setLengthCm(100);
    setDiameter(DIAMETERS[1]);
    setInvestigation("length");
    setWireId(WIRES[0].id);
    setHeat(0);
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
    setInvestigation("length");
    setDiameter(DIAMETERS[1]);

    /** Works down the rule in 20 cm steps, closing the switch just to read. */
    const lengths = [100, 80, 60, 40, 20];
    lengths.forEach((value, index) => {
      const start = index * 1350;
      timers.current.push(
        window.setTimeout(() => {
          setLengthCm(value);
          setSwitchClosed(false);
        }, start),
      );
      timers.current.push(window.setTimeout(() => {
            labSounds.play("switchClick", { volume: 0.55 });
            labSounds.play("lampOn", { volume: 0.4 });
            setSwitchClosed(true);
          }, start + 380));
      timers.current.push(
        window.setTimeout(() => {
          const metres = value / 100;
          const resistanceValue = wireResistance(wire, metres, DIAMETERS[1]);
          const currentValue = SUPPLY_VOLTAGE / (resistanceValue + PROTECTIVE_RESISTANCE);
          setReadings((existing) =>
            [
              ...existing,
              {
                id: `demo-${value}`,
                length: metres,
                diameter: DIAMETERS[1],
                area: crossSection(DIAMETERS[1]),
                voltage: currentValue * resistanceValue,
                current: currentValue,
                resistance: resistanceValue,
              },
            ].sort((a, b) => a.length - b.length),
          );
        }, start + 900),
      );
      timers.current.push(window.setTimeout(() => setSwitchClosed(false), start + 1080));
    });

    timers.current.push(window.setTimeout(() => setDemoActive(false), lengths.length * 1350 + 400));
  }, [clearTimers, demoActive, wire]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const points = useMemo(
    () =>
      readings.map((reading) => ({
        x: investigation === "length" ? reading.length : 1 / (reading.area * 1e6),
        y: reading.resistance,
      })),
    [investigation, readings],
  );

  /** Gradient of R against L, from a least-squares fit through the origin. */
  const gradient = useMemo(() => {
    const usable = readings.filter((reading) => Math.abs(reading.diameter - diameter) < 0.001);
    if (usable.length < 2) return null;
    const sumXY = usable.reduce((total, reading) => total + reading.length * reading.resistance, 0);
    const sumXX = usable.reduce((total, reading) => total + reading.length * reading.length, 0);
    if (sumXX === 0) return null;
    return sumXY / sumXX;
  }, [diameter, readings]);

  const resistivity = gradient !== null ? gradient * area : null;

  const complete = readings.length >= 6;
  const step = complete ? 3 : readings.length >= 2 ? 2 : switchClosed ? 1 : 0;
  const progress = Math.min(1, readings.length / 6);

  const status = complete
    ? investigation === "length"
      ? `R against L is a straight line through the origin, so R ∝ L.${resistivity !== null ? ` The gradient gives a resistivity of ${resistivity.toExponential(2)} Ω m.` : ""}`
      : "R against 1/A is a straight line through the origin, so the thicker the wire, the lower the resistance."
    : heat > 0.6
      ? "The wire is getting hot — open the switch. A warm wire has a higher resistance and would spoil the results."
      : switchClosed
        ? `V = ${voltage.toFixed(2)} V and I = ${current.toFixed(3)} A, so R = ${resistance.toFixed(2)} Ω. Record it and open the switch.`
        : readings.length
          ? `${readings.length} of 6 readings taken. Move the clip to a new length and close the switch again.`
          : "Set the sliding clip to 100 cm, close the switch and read both meters quickly.";

  const observation = complete
    ? `Doubling the length doubles the resistance; doubling the area halves it. R = ρL ÷ A.`
    : `At ${lengthCm} cm of ${wire.material.toLowerCase()} of diameter ${diameter.toFixed(2)} mm, R should be about ${resistance.toFixed(2)} Ω.`;

  const primaryLabel = complete
    ? "Start again"
    : switchClosed
      ? "Record V and I"
      : "Close the switch";

  const circuitPanel = (
    <div data-experiment-tour="resistance-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Investigating</span>
        <span className="text-[9px] font-bold text-slate-500">change one thing at a time</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(["length", "thickness"] as Investigation[]).map((item) => (
          <button
            key={item}
            onClick={() => {
              setInvestigation(item);
              setReadings([]);
              if (item === "thickness") setLengthCm(100);
            }}
            disabled={demoActive}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              investigation === item
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item === "length" ? "Length" : "Thickness"}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Length under test</span>
        <span className="text-sm font-black" style={{ color: ACCENT.text }}>
          {lengthCm} cm
        </span>
      </div>
      <input
        type="range"
        min={10}
        max={100}
        step={5}
        value={lengthCm}
        onChange={(event) => setLengthCm(Number(event.target.value))}
        disabled={demoActive || investigation === "thickness"}
        className="mt-1.5 w-full accent-amber-400 disabled:opacity-40"
      />

      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Diameter</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {diameter.toFixed(2)} mm
        </span>
      </div>
      <div className="mt-1.5 grid grid-cols-4 gap-1">
        {DIAMETERS.map((value) => (
          <button
            key={value}
            onClick={() => setDiameter(value)}
            disabled={demoActive || investigation === "length"}
            className="rounded-lg px-1 py-1.5 text-[9px] font-black transition disabled:opacity-30"
            style={
              Math.abs(diameter - value) < 0.001
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {value.toFixed(2)}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1">
        {WIRES.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setWireId(item.id);
              setReadings([]);
            }}
            disabled={demoActive}
            className="rounded-lg px-1 py-1.5 text-[9px] font-black uppercase transition disabled:opacity-40"
            style={
              wireId === item.id
                ? { background: ACCENT.soft, color: ACCENT.text, border: `1px solid ${ACCENT.ring}` }
                : { background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            {item.material}
          </button>
        ))}
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
          <div className="text-[7px] text-slate-500">volts</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">I</div>
          <div className="text-sm font-black text-white">{current.toFixed(3)}</div>
          <div className="text-[7px] text-slate-500">amps</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            R = V/I
          </div>
          <div className="text-sm font-black text-white">{switchClosed ? resistance.toFixed(2) : "—"}</div>
          <div className="text-[7px] text-slate-500">ohms</div>
        </div>
      </div>

      <div
        className="mt-2 rounded-xl px-2 py-1.5 text-center text-[9px] font-black uppercase tracking-wide"
        style={
          heat > 0.55
            ? { background: "rgba(239,68,68,0.18)", color: "#fecaca" }
            : { background: "rgba(16,185,129,0.15)", color: "#a7f3d0" }
        }
      >
        {heat > 0.55 ? "Wire warming up — open the switch" : "Wire at room temperature"}
      </div>
    </div>
  );

  const tablePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length}/6
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">No readings yet — close the switch and record V and I.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">L/m</th>
              <th className="py-0.5 text-right font-black uppercase">d/mm</th>
              <th className="py-0.5 text-right font-black uppercase">V</th>
              <th className="py-0.5 text-right font-black uppercase">I</th>
              <th className="py-0.5 text-right font-black uppercase">R/Ω</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{reading.length.toFixed(2)}</td>
                <td className="py-1 text-right">{reading.diameter.toFixed(2)}</td>
                <td className="py-1 text-right">{reading.voltage.toFixed(2)}</td>
                <td className="py-1 text-right">{reading.current.toFixed(3)}</td>
                <td className="py-1 text-right font-black">{reading.resistance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        onClick={recordReading}
        disabled={!switchClosed || demoActive || readings.length >= 10}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        {switchClosed ? "Record this reading" : "Close the switch first"}
      </button>
    </div>
  );

  const graphPanel = (
    <div data-experiment-tour="resistance-graph" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <ExperimentResultsGraph
        points={points}
        xLabel={investigation === "length" ? "Length L / m" : "1 / A  (mm⁻²)"}
        yLabel="Resistance R / Ω"
        accentHex={ACCENT.base}
        caption={investigation === "length" ? "Resistance against length" : "Resistance against 1 ÷ area"}
        footer={
          gradient !== null && investigation === "length" ? (
            <span>
              Gradient = {gradient.toFixed(2)} Ω m⁻¹ · ρ = gradient × A ={" "}
              {resistivity !== null ? resistivity.toExponential(2) : "—"} Ω m
            </span>
          ) : (
            <span>Take at least six readings, then draw the best straight line through the origin.</span>
          )
        }
      />
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Resistance of a Wire"
          subtitle="How length, thickness and material change R"
          symbol="⚡"
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

      <div data-experiment-tour="resistance-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.1, 3.0, 2.7], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <ResistanceScene
            wire={wire}
            tapped={lengthCm / 100}
            diameter={diameter}
            switchClosed={switchClosed}
            current={current}
            voltage={voltage}
            heat={heat}
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
            emoji="⚡"
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
          title="Resistance of a Wire"
          tagline="How length, thickness and material change R"
          missions={RESISTANCE_MISSIONS}
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
            { id: "circuit", label: "Circuit", value: `${lengthCm} cm`, content: circuitPanel },
            { id: "table", label: "Table", value: `${readings.length}/6`, content: tablePanel },
            { id: "graph", label: "Graph", value: switchClosed ? `${resistance.toFixed(1)} Ω` : "—", content: graphPanel },
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
            { id: "circuit", label: "Circuit", value: `${lengthCm} cm`, content: circuitPanel },
            { id: "table", label: "Table", value: `${readings.length}/6`, content: tablePanel },
            { id: "graph", label: "Graph", value: switchClosed ? `${resistance.toFixed(1)} Ω` : "—", content: graphPanel },
          ]}
        />
      )}

      {showPaper && (
        <ResistancePaper
          wire={wire}
          readings={readings}
          investigation={investigation}
          resistivity={resistivity}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={resistanceTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
