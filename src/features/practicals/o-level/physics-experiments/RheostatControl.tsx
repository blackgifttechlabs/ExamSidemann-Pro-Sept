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
  FilamentLamp,
  PowerSupply,
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

interface RheostatSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.orange;
const PAPER_FILENAME = "using-a-rheostat.html";

/* ------------------------------------------------------------------ Science */

/** Supply e.m.f., lamp resistance and full rheostat resistance. */
const SUPPLY_VOLTAGE = 6;
const LAMP_RESISTANCE = 5;
const RHEOSTAT_MAX = 20;
/** Current at which the lamp is at its normal, full brightness. */
const LAMP_RATED_CURRENT = 1.2;

type Connection = "series" | "divider";

interface Reading {
  id: string;
  /** Rheostat resistance in circuit, in ohms. */
  resistance: number;
  current: number;
  voltage: number;
  connection: Connection;
}

/**
 * With the rheostat in series the lamp always gets some current, because the
 * supply is shared between the lamp and the coil. Wired as a potential divider
 * the slider can tap off anything from zero to the full supply voltage, so the
 * lamp can be taken right down to off.
 */
function circuitValues(connection: Connection, slider: number) {
  const inCircuit = slider * RHEOSTAT_MAX;

  if (connection === "series") {
    const current = SUPPLY_VOLTAGE / (LAMP_RESISTANCE + inCircuit);
    return { resistance: inCircuit, current, voltage: current * LAMP_RESISTANCE };
  }

  /** Potential divider: the lamp sits across the lower part of the coil. */
  const lower = Math.max(slider * RHEOSTAT_MAX, 0.001);
  const upper = Math.max((1 - slider) * RHEOSTAT_MAX, 0.001);
  const parallel = (lower * LAMP_RESISTANCE) / (lower + LAMP_RESISTANCE);
  const voltage = (SUPPLY_VOLTAGE * parallel) / (parallel + upper);
  return { resistance: inCircuit, current: voltage / LAMP_RESISTANCE, voltage };
}

const RHEOSTAT_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Put the rheostat in series",
    detail: "Connect the supply, switch, rheostat, ammeter and lamp in one loop, using only one end terminal and the slider terminal of the rheostat.",
    symbol: "🔌",
  },
  {
    short: "Slide",
    title: "Move the slider",
    detail: "Push the slider from one end of the coil to the other and watch the ammeter reading and the brightness of the lamp change together.",
    symbol: "🎚️",
  },
  {
    short: "Record",
    title: "Record I for each setting",
    detail: "Note the current at six settings of the slider, together with the p.d. across the lamp.",
    symbol: "📝",
  },
  {
    short: "Compare",
    title: "Try the potential divider",
    detail: "Reconnect the rheostat using all three terminals and compare the range of currents you can now get.",
    symbol: "🔀",
  },
];

const rheostatTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What a rheostat does",
    text: "A rheostat is a variable resistor. Sliding its contact changes how much of the resistance wire is in the circuit, and so changes the current.",
    mode: "modal",
  },
  {
    title: "The circuit",
    text: "The rheostat, the ammeter and the lamp are all in series, so the same current goes through all of them. The voltmeter reads the p.d. across the lamp.",
    mode: "bubble",
    selector: '[data-experiment-tour="rheostat-scene"]',
  },
  {
    title: "More coil, less current",
    text: "Sliding the contact so that more of the coil is in circuit raises the total resistance, so by I = V ÷ R the current falls and the lamp dims.",
    mode: "bubble",
    selector: '[data-experiment-tour="rheostat-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Two ways to wire it",
    text: "In series the lamp never goes right out. Wired as a potential divider, using all three terminals, the p.d. can be varied from zero up to the full supply voltage.",
    mode: "bubble",
    selector: '[data-experiment-tour="rheostat-graph"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function RheostatScene({
  connection,
  slider,
  switchClosed,
  current,
  voltage,
  resistance,
  mode,
  isMobile,
  moveVectorRef,
}: {
  connection: Connection;
  slider: number;
  switchClosed: boolean;
  current: number;
  voltage: number;
  resistance: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 3.2, 3.1] : [0.1, 2.9, 2.6];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.15, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const brightness = switchClosed ? Math.min(1, (current / LAMP_RATED_CURRENT) ** 1.4) : 0;

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#ea580c"
        benchColor="#eff1f5"
        posterA={{
          title: "RHEOSTAT",
          lines: [
            "A rheostat is a variable resistor",
            "More coil in circuit = less current",
            "I = V ÷ R",
            "Two terminals: series · three: divider",
          ],
        }}
        posterB={{
          title: "WHERE IT IS USED",
          lines: ["Dimmer switches and fan speeds", "Protecting a circuit while setting it up", "Setting the current in an experiment"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          <PowerSupply position={[-1.4, 0.02, -0.7]} voltage={SUPPLY_VOLTAGE} on={switchClosed} />
          <CircuitSwitch position={[-0.65, 0.02, -0.95]} closed={switchClosed} />
          <RheostatBox position={[0.15, 0.02, -0.72]} fraction={slider} ohmsInCircuit={resistance} />
          <AnalogueMeter position={[1.35, 0.02, -0.5]} kind="ammeter" value={current} max={1.4} decimals={2} label="ammeter" />
          <AnalogueMeter position={[0.95, 0.02, 0.62]} kind="voltmeter" value={voltage} max={6} decimals={2} label="p.d. across lamp" />
          <FilamentLamp position={[-0.35, 0.02, 0.55]} brightness={brightness} label="filament lamp" />

          {/* Supply → switch */}
          <CircuitLead
            points={[
              [-1.24, 0.3, -0.54],
              [-1.24, 0.07, -1.05],
              [-0.79, 0.07, -1.05],
              [-0.79, 0.06, -0.95],
            ]}
            colour="#b91c1c"
          />
          {/* Switch → rheostat left-hand terminal */}
          <CircuitLead
            points={[
              [-0.51, 0.06, -0.95],
              [-0.35, 0.07, -1.0],
              [-0.38, 0.17, -0.62],
            ]}
            colour="#111827"
          />
          {/* Rheostat slider → ammeter */}
          <CircuitLead
            points={[
              [0.15, 0.37, -0.72],
              [0.85, 0.16, -0.75],
              [1.22, 0.29, -0.33],
            ]}
            colour="#111827"
          />
          {/* Ammeter → lamp */}
          <CircuitLead
            points={[
              [1.48, 0.29, -0.33],
              [1.5, 0.08, 0.3],
              [-0.22, 0.08, 0.69],
            ]}
            colour="#111827"
          />
          {/* Lamp → supply */}
          <CircuitLead
            points={[
              [-0.48, 0.08, 0.69],
              [-1.75, 0.06, 0.5],
              [-1.56, 0.3, -0.54],
            ]}
            colour="#111827"
          />
          {/* Voltmeter across the lamp */}
          <CircuitLead points={[[0.82, 0.29, 0.79], [0.2, 0.1, 0.9], [-0.22, 0.09, 0.72]]} colour="#1d4ed8" />
          <CircuitLead points={[[1.08, 0.29, 0.79], [0.3, 0.1, 1.05], [-0.48, 0.09, 0.72]]} colour="#1d4ed8" />

          {/* The third lead that turns the rheostat into a potential divider */}
          {connection === "divider" && (
            <CircuitLead
              points={[
                [0.85, 0.17, -0.62],
                [1.05, 0.06, 0.1],
                [-1.7, 0.06, 0.45],
              ]}
              colour="#059669"
            />
          )}
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.15, 0]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.46} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function RheostatPaper({ readings, onClose }: { readings: Reading[]; onClose: () => void }) {
  const seriesReadings = readings.filter((reading) => reading.connection === "series");
  const dividerReadings = readings.filter((reading) => reading.connection === "divider");

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Using a Rheostat to Control the Current in a Circuit</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To use a rheostat as a variable resistor to control the current in a circuit, and to compare the range of control obtained with the rheostat wired in series and wired as a potential divider.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>A 6 V d.c. supply, a rheostat (0–20 Ω), an ammeter (0–1.5 A), a voltmeter (0–6 V), a filament lamp in a holder, a switch and connecting leads.</p>
        <h2 className="mt-5 font-bold uppercase">Method — rheostat in series</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The supply, switch, rheostat, ammeter and lamp were connected in series, using one end terminal and the slider terminal of the rheostat.</li>
          <li>The voltmeter was connected across the lamp.</li>
          <li>The slider was set so that the whole coil was in circuit, and the switch was closed.</li>
          <li>The ammeter and voltmeter readings were recorded, along with the resistance in circuit.</li>
          <li>The slider was moved in equal steps towards the other end and the readings repeated.</li>
          <li>The brightness of the lamp was observed at each setting.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Method — rheostat as a potential divider</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The rheostat was reconnected using all three terminals: the supply was joined across the two ends of the coil, and the lamp was connected between the slider and one end.</li>
          <li>The slider was moved from one end to the other and the readings recorded again.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Connection</th>
              <th className="border border-slate-400 p-2">Resistance in circuit / Ω</th>
              <th className="border border-slate-400 p-2">Current I / A</th>
              <th className="border border-slate-400 p-2">p.d. across lamp / V</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading) => (
              <tr key={reading.id}>
                <td className="border border-slate-400 p-2 text-center">{reading.connection === "series" ? "Series" : "Divider"}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.resistance.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.current.toFixed(2)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.voltage.toFixed(2)}</td>
              </tr>
            ))}
            {!readings.length &&
              [0, 1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {Array.from({ length: 4 }, (_, cell) => (
                    <td key={cell} className="border border-slate-400 p-2">
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">Observations</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Moving the slider so that more of the coil was in circuit made the ammeter reading fall and the lamp grow dimmer.</li>
          <li>With the rheostat in series the current could be varied between about {seriesReadings.length ? `${Math.min(...seriesReadings.map((r) => r.current)).toFixed(2)} A and ${Math.max(...seriesReadings.map((r) => r.current)).toFixed(2)} A` : "0.24 A and 1.20 A"}. The lamp never went out completely, because the lamp and the coil share the supply voltage.</li>
          <li>Wired as a potential divider the lamp could be dimmed right down to nothing{dividerReadings.length ? "" : ""}, because the slider can tap off any p.d. between zero and the full supply voltage.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          A rheostat controls the current in a circuit by changing how much resistance wire is included in it. Since
          I = V ÷ R, increasing the resistance decreases the current, and the graph of current against resistance in
          circuit is a curve, not a straight line — the current falls quickly at first and then more slowly. Wired in
          series a rheostat can only reduce the current to a certain minimum; wired as a potential divider it gives
          full control from zero to maximum, which is why light dimmers and volume controls are wired that way.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Before switching on, the slider was set for maximum resistance, so that the circuit started with the smallest current.</li>
          <li>The switch was opened between readings, so that the coil and the lamp did not overheat.</li>
          <li>The ammeter was connected in series with the correct polarity, and the voltmeter in parallel with the lamp.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function RheostatControlSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: RheostatSimProps) {
  const [connection, setConnection] = useState<Connection>("series");
  const [slider, setSlider] = useState(1);
  const [switchClosed, setSwitchClosed] = useState(false);
  const [readings, setReadings] = useState<Reading[]>([]);
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

  const values = useMemo(() => circuitValues(connection, slider), [connection, slider]);
  const current = switchClosed ? values.current : 0;
  const voltage = switchClosed ? values.voltage : 0;
  const brightness = switchClosed ? Math.min(1, (values.current / LAMP_RATED_CURRENT) ** 1.4) : 0;

  const recordReading = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (!switchClosed) return;
    setReadings((existing) => {
      const duplicate = existing.some(
        (reading) => reading.connection === connection && Math.abs(reading.resistance - values.resistance) < 0.4,
      );
      if (duplicate || existing.length >= 14) return existing;
      return [
        ...existing,
        {
          id: `${Date.now()}-${existing.length}`,
          resistance: values.resistance,
          current: values.current,
          voltage: values.voltage,
          connection,
        },
      ].sort((a, b) => a.resistance - b.resistance);
    });
  }, [connection, switchClosed, values]);

  const resetAll = useCallback(() => {
    clearTimers();
    setReadings([]);
    setSlider(1);
    setSwitchClosed(false);
    setConnection("series");
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
    setConnection("series");
    setSlider(1);
    setSwitchClosed(true);

    /** Sweeps the slider the whole way, recording six settings on the way. */
    const settings = [1, 0.8, 0.6, 0.4, 0.2, 0];
    settings.forEach((value, index) => {
      const start = 400 + index * 950;
      timers.current.push(window.setTimeout(() => setSlider(value), start));
      timers.current.push(
        window.setTimeout(() => {
          const computed = circuitValues("series", value);
          setReadings((existing) =>
            [
              ...existing,
              {
                id: `demo-${index}`,
                resistance: computed.resistance,
                current: computed.current,
                voltage: computed.voltage,
                connection: "series" as Connection,
              },
            ].sort((a, b) => a.resistance - b.resistance),
          );
        }, start + 520),
      );
    });

    const afterSeries = 400 + settings.length * 950;
    /** Then shows how far down the potential divider can take the lamp. */
    timers.current.push(
      window.setTimeout(() => {
        setConnection("divider");
        setSlider(1);
      }, afterSeries),
    );
    [0.75, 0.5, 0.25, 0].forEach((value, index) => {
      timers.current.push(window.setTimeout(() => setSlider(value), afterSeries + 500 + index * 620));
    });
    timers.current.push(window.setTimeout(() => setDemoActive(false), afterSeries + 3400));
  }, [clearTimers, demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const seriesReadings = readings.filter((reading) => reading.connection === "series");
  const dividerReadings = readings.filter((reading) => reading.connection === "divider");
  const complete = seriesReadings.length >= 5 && dividerReadings.length >= 1;
  const step = complete ? 3 : seriesReadings.length >= 5 ? 3 : seriesReadings.length >= 1 ? 2 : switchClosed ? 1 : 0;
  const progress = Math.min(1, (seriesReadings.length + dividerReadings.length) / 6);

  const points = useMemo(
    () => seriesReadings.map((reading) => ({ x: reading.resistance, y: reading.current })),
    [seriesReadings],
  );
  const comparison = useMemo(
    () => (dividerReadings.length ? dividerReadings.map((reading) => ({ x: reading.resistance, y: reading.current })) : undefined),
    [dividerReadings],
  );

  const status = complete
    ? "Both connections tried. In series the current only falls to a minimum; as a potential divider it can be taken all the way down to zero."
    : !switchClosed
      ? "Set the slider for maximum resistance first, then close the switch."
      : connection === "divider"
        ? `Potential divider: the lamp gets ${voltage.toFixed(2)} V of the 6 V supply, so I = ${current.toFixed(2)} A.`
        : `${values.resistance.toFixed(1)} Ω in circuit gives I = ${current.toFixed(2)} A and ${voltage.toFixed(2)} V across the lamp. ${brightness < 0.2 ? "The lamp is very dim." : brightness > 0.85 ? "The lamp is at full brightness." : "The lamp is part way up."}`;

  const observation = complete
    ? "Current against resistance is a curve: I = V ÷ (R_lamp + R_rheostat), so the current falls steeply at first and then levels off."
    : connection === "series"
      ? "Putting more of the coil in circuit raises the total resistance, so the current falls and the lamp dims."
      : "With all three terminals used, the slider taps off any p.d. from zero up to the full supply.";

  const primaryLabel = complete
    ? "Start again"
    : !switchClosed
      ? "Close the switch"
      : "Record this setting";

  const controlPanel = (
    <div data-experiment-tour="rheostat-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Connection</span>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(["series", "divider"] as Connection[]).map((item) => (
          <button
            key={item}
            onClick={() => setConnection(item)}
            disabled={demoActive}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              connection === item
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item === "series" ? "2 terminals" : "3 terminals"}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[9px] font-bold text-slate-500">
        {connection === "series"
          ? "In series the rheostat simply adds resistance — the lamp always gets some current."
          : "As a potential divider the slider taps off part of the supply, so the lamp can be dimmed to nothing."}
      </p>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Slider</span>
        <span className="text-sm font-black" style={{ color: ACCENT.text }}>
          {values.resistance.toFixed(1)} Ω
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={slider}
        onChange={(event) => setSlider(Number(event.target.value))}
        disabled={demoActive}
        className="mt-1.5 w-full accent-orange-400"
      />
      <div className="mt-0.5 flex justify-between text-[8px] font-black uppercase text-slate-500">
        <span>none of the coil</span>
        <span>all of it</span>
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
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            I
          </div>
          <div className="text-sm font-black text-white">{current.toFixed(2)}</div>
          <div className="text-[7px] text-slate-500">amps</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">V lamp</div>
          <div className="text-sm font-black text-white">{voltage.toFixed(2)}</div>
          <div className="text-[7px] text-slate-500">volts</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Lamp</div>
          <div className="text-sm font-black text-white">{(brightness * 100).toFixed(0)}%</div>
          <div className="text-[7px] text-slate-500">brightness</div>
        </div>
      </div>
    </div>
  );

  const tablePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Readings</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {seriesReadings.length}/5 series · {dividerReadings.length} divider
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Nothing recorded yet.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">Wiring</th>
              <th className="py-0.5 text-right font-black uppercase">R/Ω</th>
              <th className="py-0.5 text-right font-black uppercase">I/A</th>
              <th className="py-0.5 text-right font-black uppercase">V/V</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{reading.connection === "series" ? "Series" : "Divider"}</td>
                <td className="py-1 text-right">{reading.resistance.toFixed(1)}</td>
                <td className="py-1 text-right font-black">{reading.current.toFixed(2)}</td>
                <td className="py-1 text-right">{reading.voltage.toFixed(2)}</td>
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
        Record I and V
      </button>
    </div>
  );

  const graphPanel = (
    <div data-experiment-tour="rheostat-graph" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <ExperimentResultsGraph
        points={points}
        comparison={comparison}
        seriesLabel="In series"
        comparisonLabel="Potential divider"
        xLabel="Resistance in circuit / Ω"
        yLabel="Current I / A"
        accentHex={ACCENT.base}
        caption="Current against resistance in circuit"
        xMin={0}
        xMax={RHEOSTAT_MAX}
        yMax={1.3}
        footer={<span>I = V ÷ R, so the curve falls steeply at first and then flattens out.</span>}
      />
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Rheostat Control Bench"
          subtitle="Controlling current with a variable resistor"
          symbol="🎚️"
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

      <div data-experiment-tour="rheostat-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.1, 2.9, 2.6], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <RheostatScene
            connection={connection}
            slider={slider}
            switchClosed={switchClosed}
            current={current}
            voltage={voltage}
            resistance={values.resistance}
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
            emoji="🎚️"
            cornerEmoji="💡"
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
          title="The Rheostat"
          tagline="Controlling current with a variable resistor"
          missions={RHEOSTAT_MISSIONS}
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
            { id: "controls", label: "Rheostat", value: `${values.resistance.toFixed(1)} Ω`, content: controlPanel },
            { id: "table", label: "Table", value: `${readings.length}`, content: tablePanel },
            { id: "graph", label: "Graph", value: `${current.toFixed(2)} A`, content: graphPanel },
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
            { id: "controls", label: "Rheostat", value: `${values.resistance.toFixed(1)} Ω`, content: controlPanel },
            { id: "table", label: "Table", value: `${readings.length}`, content: tablePanel },
            { id: "graph", label: "Graph", value: `${current.toFixed(2)} A`, content: graphPanel },
          ]}
        />
      )}

      {showPaper && <RheostatPaper readings={readings} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={rheostatTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
