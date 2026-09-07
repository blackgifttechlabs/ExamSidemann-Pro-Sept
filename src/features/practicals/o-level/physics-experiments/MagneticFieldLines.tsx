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
  BarMagnet,
  FieldLine,
  IronFilings,
  MAGNET_LENGTH,
  PlottingCompass,
  PlottingPaper,
  fieldAngleAt,
  findNeutralPoints,
  traceFieldLine,
  type MagnetSpec,
} from "../../common/MagnetApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface MagneticFieldLinesSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.rose;
const PAPER_FILENAME = "plotting-magnetic-field-lines.html";

/** How many field lines count as a finished plot. */
const LINES_REQUIRED = 5;

type Arrangement = "single" | "attract" | "repel";
type Method = "compass" | "filings";

interface ArrangementSpec {
  id: Arrangement;
  label: string;
  short: string;
  magnets: MagnetSpec[];
  /** Where each traced line is started, in order. */
  starts: [number, number][];
  pattern: string;
}

/** Points spread around a north pole, from which a field line is followed. */
const ringOfStarts = (cx: number, cz: number, radius: number, count: number): [number, number][] =>
  Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index / (count - 1)) * Math.PI;
    return [cx + Math.cos(angle) * radius, cz + Math.sin(angle) * radius] as [number, number];
  });

const ARRANGEMENTS: ArrangementSpec[] = [
  {
    id: "single",
    label: "One bar magnet",
    short: "Single",
    magnets: [{ x: 0, z: 0, angle: 0 }],
    starts: ringOfStarts(MAGNET_LENGTH * 0.41 + 0.16, 0, 0.2, 7),
    pattern:
      "The lines leave the north pole, curve right round the outside of the magnet and enter the south pole. They are closest together at the poles, which is where the field is strongest, and no two lines ever cross.",
  },
  {
    id: "attract",
    label: "Two magnets, N facing S",
    short: "Attract",
    magnets: [
      { x: -0.95, z: 0, angle: 0 },
      { x: 0.95, z: 0, angle: 0 },
    ],
    starts: [
      [-0.36, 0],
      [-0.36, 0.16],
      [-0.36, -0.16],
      [-0.42, 0.34],
      [-0.42, -0.34],
      [-0.5, 0.55],
      [-0.5, -0.55],
    ],
    pattern:
      "Unlike poles face each other, so the lines run straight across the gap from the north pole of one magnet into the south pole of the other. The lines are pulled together in the gap, and the magnets attract.",
  },
  {
    id: "repel",
    label: "Two magnets, N facing N",
    short: "Repel",
    magnets: [
      { x: -0.95, z: 0, angle: 0 },
      { x: 0.95, z: 0, angle: 0, strength: -1 },
    ],
    starts: [
      [-0.36, 0.06],
      [-0.36, -0.06],
      [-0.4, 0.22],
      [-0.4, -0.22],
      [-0.45, 0.42],
      [-0.45, -0.42],
      [-0.5, 0.62],
    ],
    pattern:
      "Like poles face each other, so the lines from the two north poles are pushed apart and curve away sideways. Midway between the magnets the two fields cancel — that point is a neutral point, where a plotting compass cannot settle.",
  },
];

const FIELD_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Draw round the magnet",
    detail: "Lay the bar magnet in the middle of a sheet of plain paper and draw round it in pencil, marking the N and S ends.",
    symbol: "🧲",
  },
  {
    short: "Plot",
    title: "Follow the plotting compass",
    detail: "Put the compass near one pole, mark a dot at each end of the needle, then move the compass so its tail sits on the last dot.",
    symbol: "🧭",
  },
  {
    short: "Trace",
    title: "Join the dots into field lines",
    detail: "Join each set of dots with a smooth curve. Start again from a different point until you have five or six lines.",
    symbol: "✏️",
  },
  {
    short: "Arrows",
    title: "Mark the direction",
    detail: "Put an arrow on every line pointing from the north pole round to the south pole, and label any neutral point with an X.",
    symbol: "➡️",
  },
];

const fieldTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Magnetic field lines",
    text: "A magnetic field is the region round a magnet where a magnetic material feels a force. We draw the field as lines that run from the north pole to the south pole outside the magnet.",
    mode: "modal",
  },
  {
    title: "The paper and the magnet",
    text: "The magnet stands on a sheet of plain paper. Drawing round it first means you can still see where it was after you lift it off.",
    mode: "bubble",
    selector: '[data-experiment-tour="field-scene"]',
  },
  {
    title: "Two ways to see the field",
    text: "A plotting compass gives you the direction at a point, one dot at a time. Iron filings show the whole pattern at once but do not tell you which way round it goes.",
    mode: "bubble",
    selector: '[data-experiment-tour="field-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "What to look for",
    text: "Lines never cross, they are closest together where the field is strongest, and between two like poles there is a neutral point where the field cancels out.",
    mode: "bubble",
    selector: '[data-experiment-tour="field-notes"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function CompassDot({ position }: { position: [number, number] }) {
  return (
    <mesh position={[position[0], 0.017, position[1]]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.017, 10]} />
      <meshBasicMaterial color="#334155" />
    </mesh>
  );
}

function NeutralPointMarker({ position }: { position: THREE.Vector2 }) {
  return (
    <group position={[position.x, 0.02, position.y]}>
      {[Math.PI / 4, -Math.PI / 4].map((angle) => (
        <mesh key={angle} rotation={[-Math.PI / 2, 0, angle]}>
          <planeGeometry args={[0.19, 0.022]} />
          <meshBasicMaterial color="#b91c1c" side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Html position={[0, 0.06, 0.19]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-rose-300/40 bg-slate-950/92 px-1.5 py-0.5 text-[8px] font-black uppercase text-rose-200">
          Neutral point
        </div>
      </Html>
    </group>
  );
}

function FieldScene({
  arrangement,
  method,
  lines,
  activeLine,
  compass,
  neutralPoints,
  showNeutral,
  includeEarth,
  mode,
  isMobile,
  moveVectorRef,
}: {
  arrangement: ArrangementSpec;
  method: Method;
  lines: THREE.Vector2[][];
  activeLine: THREE.Vector2[];
  compass: { position: [number, number]; angle: number } | null;
  neutralPoints: THREE.Vector2[];
  showNeutral: boolean;
  includeEarth: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 4.4, 2.9] : [0, 4.05, 2.5];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#e11d48"
        benchColor="#eceff3"
        posterA={{
          title: "MAGNETIC FIELDS",
          lines: [
            "Lines run N → S outside the magnet",
            "Closer lines = stronger field",
            "Field lines never cross",
            "Neutral point: fields cancel out",
          ],
        }}
        posterB={{
          title: "POLES",
          lines: ["Like poles repel", "Unlike poles attract", "A freely suspended magnet points N–S"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          <PlottingPaper size={5.2} outline={method === "compass" ? arrangement.magnets[0] : null} />

          {arrangement.magnets.map((magnet, index) => (
            <BarMagnet key={index} magnet={magnet} y={0.09} />
          ))}

          {method === "filings" ? (
            <IronFilings magnets={arrangement.magnets} includeEarth={includeEarth} />
          ) : (
            <>
              {lines.map((line, index) => (
                <FieldLine key={index} points={line} colour="#1e293b" />
              ))}
              {activeLine.length > 1 && <FieldLine points={activeLine} colour="#e11d48" showArrow={false} />}
              {activeLine.map((point, index) =>
                index % 4 === 0 ? <CompassDot key={index} position={[point.x, point.y]} /> : null,
              )}
              {compass && <PlottingCompass position={compass.position} angle={compass.angle} highlight />}
            </>
          )}

          {showNeutral && neutralPoints.map((point, index) => <NeutralPointMarker key={index} position={point} />)}
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.28} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y, 0]} minDistance={1.8} maxDistance={9} maxPolarAngle={1.42} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function FieldPaper({ arrangement, lineCount, onClose }: { arrangement: ArrangementSpec; lineCount: number; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Plotting the Magnetic Field Round a Bar Magnet</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To plot the magnetic field pattern round a bar magnet, and round two magnets placed with unlike and with like poles facing, using a plotting compass and iron filings.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Bar magnets, a plotting compass, iron filings in a sprinkler, a sheet of plain paper, a sheet of thin card, a sharp pencil and a ruler.</p>
        <h2 className="mt-5 font-bold uppercase">Method — plotting compass</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The bar magnet was placed in the middle of a sheet of plain paper, and its outline was drawn round in pencil with the N and S ends labelled.</li>
          <li>The plotting compass was placed near the north pole of the magnet, and a pencil dot was made at each end of the needle.</li>
          <li>The compass was moved so that its south-seeking (tail) end lay over the second dot, and a new dot was marked at the head of the needle.</li>
          <li>Step 3 was repeated until the compass reached the south pole of the magnet or ran off the edge of the paper.</li>
          <li>The dots were joined with a smooth curve, and an arrow was added pointing away from the north pole.</li>
          <li>The whole procedure was repeated from {LINES_REQUIRED} different starting points spread round the north pole.</li>
          <li>The two-magnet arrangements were then plotted in the same way, first with a north pole facing a south pole, and then with two north poles facing.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Method — iron filings</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A sheet of thin card was laid over the magnet.</li>
          <li>Iron filings were sprinkled thinly and evenly over the card from a sprinkler held well above it.</li>
          <li>The card was tapped gently. The filings turned and lined up along the field, showing the whole pattern at once.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <p>{lineCount > 0 ? `${lineCount} field ${lineCount === 1 ? "line was" : "lines were"} plotted for the arrangement shown (${arrangement.label.toLowerCase()}).` : "Field lines were plotted for each arrangement of the magnets."} {arrangement.pattern}</p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Outside a magnet the field lines run from the north pole to the south pole. They are crowded together at the poles,
          where the field is strongest, and they spread out at the sides, where it is weaker. Field lines never cross, because
          the field can only have one direction at any one point. Where a north pole faces a north pole the two fields oppose
          each other and there is a neutral point midway between them, at which a plotting compass has no settled direction.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>All other magnets, and any iron or steel objects such as clamp stands and the steel bench frame, were moved well away, since they distort the field.</li>
          <li>The filings were sprinkled thinly — too many filings clump together and hide the pattern.</li>
          <li>A sharp pencil was used, and the compass was moved a small step at a time, so that the dots followed the line closely.</li>
          <li>Iron filings are not used directly on a magnet, because they are very hard to clean off; the card keeps them separate.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function MagneticFieldLinesSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MagneticFieldLinesSimProps) {
  const [arrangementId, setArrangementId] = useState<Arrangement>("single");
  const [method, setMethod] = useState<Method>("compass");
  const [includeEarth, setIncludeEarth] = useState(false);
  const [lines, setLines] = useState<THREE.Vector2[][]>([]);
  const [activeLine, setActiveLine] = useState<THREE.Vector2[]>([]);
  const [showNeutral, setShowNeutral] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [tracing, setTracing] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const timers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  const arrangement = useMemo(
    () => ARRANGEMENTS.find((item) => item.id === arrangementId) ?? ARRANGEMENTS[0],
    [arrangementId],
  );

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /** Changing the arrangement starts a fresh sheet of paper. */
  useEffect(() => {
    clearTimers();
    setLines([]);
    setActiveLine([]);
    setTracing(false);
    setDemoActive(false);
  }, [arrangementId, clearTimers]);

  const neutralPoints = useMemo(
    () => (includeEarth || arrangement.id === "repel" ? findNeutralPoints(arrangement.magnets) : []),
    [arrangement, includeEarth],
  );

  const compass = useMemo(() => {
    if (method !== "compass") return null;
    const head = activeLine.length ? activeLine[activeLine.length - 1] : new THREE.Vector2(...arrangement.starts[Math.min(lines.length, arrangement.starts.length - 1)]);
    return {
      position: [head.x, head.y] as [number, number],
      angle: fieldAngleAt(head, arrangement.magnets, includeEarth),
    };
  }, [activeLine, arrangement, includeEarth, lines.length, method]);

  /** Walks a plotting compass along the field, laying a dot every few steps. */
  const traceNextLine = useCallback(() => {
    labSounds.play("compassSettle", { volume: 0.45 });
    if (tracing || lines.length >= arrangement.starts.length) return;
    const start = new THREE.Vector2(...arrangement.starts[lines.length]);
    const path = traceFieldLine(start, arrangement.magnets, { includeEarth, bounds: 2.6 });
    if (path.length < 3) return;

    setTracing(true);
    setActiveLine([path[0]]);
    const stepDelay = Math.max(9, Math.round(900 / path.length));
    path.forEach((_, index) => {
      if (index === 0) return;
      timers.current.push(
        window.setTimeout(() => setActiveLine(path.slice(0, index + 1)), index * stepDelay),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setLines((current) => [...current, path]);
        setActiveLine([]);
        setTracing(false);
      }, path.length * stepDelay + 160),
    );
  }, [arrangement, includeEarth, lines.length, tracing]);

  const resetAll = useCallback(() => {
    clearTimers();
    setLines([]);
    setActiveLine([]);
    setTracing(false);
    setDemoActive(false);
    setShowNeutral(false);
    setMethod("compass");
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      setTracing(false);
      return;
    }
    setDemoActive(true);
    setMethod("compass");
    setLines([]);
    setActiveLine([]);

    /** Traces the whole set of lines one after the other, then sprinkles filings. */
    const paths = arrangement.starts
      .slice(0, LINES_REQUIRED)
      .map((start) => traceFieldLine(new THREE.Vector2(...start), arrangement.magnets, { includeEarth, bounds: 2.6 }));

    let elapsed = 300;
    paths.forEach((path) => {
      const stepDelay = Math.max(7, Math.round(620 / Math.max(path.length, 1)));
      const duration = path.length * stepDelay;
      path.forEach((_, index) => {
        timers.current.push(window.setTimeout(() => setActiveLine(path.slice(0, index + 1)), elapsed + index * stepDelay));
      });
      timers.current.push(
        window.setTimeout(() => {
          setLines((current) => [...current, path]);
          setActiveLine([]);
        }, elapsed + duration + 120),
      );
      elapsed += duration + 260;
    });

    timers.current.push(window.setTimeout(() => setShowNeutral(true), elapsed));
    timers.current.push(window.setTimeout(() => setDemoActive(false), elapsed + 900));
  }, [arrangement, clearTimers, demoActive, includeEarth]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = lines.length >= LINES_REQUIRED;
  const step = complete ? 3 : lines.length >= 1 ? 2 : method === "filings" || tracing ? 1 : 0;
  const progress = Math.min(1, lines.length / LINES_REQUIRED);

  const status = complete
    ? `${lines.length} field lines plotted. ${arrangement.pattern}`
    : tracing
      ? "Follow the compass — mark a dot at each end of the needle, then move the compass on to the last dot."
      : method === "filings"
        ? "Tap the card gently. The filings turn and line up along the field, showing the whole pattern at once."
        : lines.length
          ? `${lines.length} of ${LINES_REQUIRED} lines drawn. Start again from a different point round the north pole.`
          : "Draw round the magnet, then put the plotting compass near the north pole and start marking dots.";

  const observation = complete
    ? "The lines are crowded together at the poles, where the field is strongest, and they never cross."
    : "Iron filings show the shape of the field; only the compass tells you which way round it goes.";

  const primaryLabel = complete ? "New sheet of paper" : tracing ? "Following the compass…" : `Trace field line ${lines.length + 1}`;

  const arrangementPanel = (
    <div data-experiment-tour="field-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Arrangement</span>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {ARRANGEMENTS.map((item) => (
          <button
            key={item.id}
            onClick={() => setArrangementId(item.id)}
            disabled={demoActive}
            className="rounded-xl px-1 py-2 text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              arrangementId === item.id
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item.short}
          </button>
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Method</span>
        <span className="text-[9px] font-bold text-slate-500">{method === "compass" ? "one point at a time" : "whole pattern at once"}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(["compass", "filings"] as Method[]).map((item) => (
          <button
            key={item}
            onClick={() => setMethod(item)}
            disabled={demoActive}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              method === item
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item === "compass" ? "🧭 Compass" : "🧲 Filings"}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => setIncludeEarth((current) => !current)}
          className="rounded-xl border border-white/10 px-2 py-1.5 text-[9px] font-black uppercase tracking-wide transition"
          style={includeEarth ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          Earth's field {includeEarth ? "on" : "off"}
        </button>
        <button
          onClick={() => setShowNeutral((current) => !current)}
          className="rounded-xl border border-white/10 px-2 py-1.5 text-[9px] font-black uppercase tracking-wide transition"
          style={showNeutral ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
        >
          Neutral points
        </button>
      </div>
      {showNeutral && neutralPoints.length === 0 && (
        <p className="mt-1.5 text-[9px] font-bold text-slate-500">
          No neutral point in this arrangement — try two north poles facing, or switch the earth's field on.
        </p>
      )}
    </div>
  );

  const notesPanel = (
    <div data-experiment-tour="field-notes" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Field lines drawn</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {lines.length}/{LINES_REQUIRED}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all" style={{ width: `${progress * 100}%`, background: ACCENT.base }} />
      </div>
      <p className="mt-2 text-[10px] font-bold leading-relaxed text-slate-300">{arrangement.pattern}</p>
      <ul className="mt-2 space-y-1 text-[9px] font-bold text-slate-400">
        <li>• Lines run N → S outside the magnet, S → N inside it.</li>
        <li>• The closer the lines, the stronger the field.</li>
        <li>• Two field lines can never cross.</li>
      </ul>
    </div>
  );

  const rulesPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Exam points</span>
      <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-300">
        <p>
          <span className="text-white">Why draw round the magnet? </span>So the outline is still there once the magnet is lifted off the paper.
        </p>
        <p>
          <span className="text-white">Why keep other magnets away? </span>Any nearby magnet or piece of iron adds its own field and bends the pattern.
        </p>
        <p>
          <span className="text-white">Neutral point: </span>a place where the fields of the magnets (and the earth) cancel, so the resultant field is zero and the compass will not settle.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Magnetic Field Plotting"
          subtitle="Plot the pattern with a compass and with filings"
          symbol="🧭"
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

      <div data-experiment-tour="field-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 4.05, 2.5], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <FieldScene
            arrangement={arrangement}
            method={method}
            lines={lines}
            activeLine={activeLine}
            compass={compass}
            neutralPoints={neutralPoints}
            showNeutral={showNeutral}
            includeEarth={includeEarth}
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
            emoji="🧭"
            cornerEmoji="🧲"
            status={status}
            running={demoActive || tracing}
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
          title="Magnetic Fields"
          tagline="Plot the pattern with a compass and with filings"
          missions={FIELD_MISSIONS}
          step={step}
          running={demoActive || tracing}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : "🧭"}
          onPrimary={complete ? resetAll : traceNextLine}
          primaryDisabled={tracing || demoActive || method === "filings"}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Set-up", value: arrangement.short, content: arrangementPanel },
            { id: "notes", label: "Pattern", value: `${lines.length}/${LINES_REQUIRED}`, content: notesPanel },
            { id: "exam", label: "Exam", content: rulesPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "trace", label: "Trace", onClick: traceNextLine, disabled: tracing || demoActive || method === "filings", tone: "orange" },
            {
              id: "method",
              label: method === "compass" ? "Filings" : "Compass",
              onClick: () => setMethod(method === "compass" ? "filings" : "compass"),
              tone: "blue",
            },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Set-up", value: arrangement.short, content: arrangementPanel },
            { id: "notes", label: "Pattern", value: `${lines.length}/${LINES_REQUIRED}`, content: notesPanel },
            { id: "exam", label: "Exam", content: rulesPanel },
          ]}
        />
      )}

      {showPaper && <FieldPaper arrangement={arrangement} lineCount={lines.length} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={fieldTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
