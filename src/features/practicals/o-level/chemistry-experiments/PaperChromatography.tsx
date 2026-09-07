"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
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

interface ChromatographySimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.teal;
const PAPER_FILENAME = "paper-chromatography-of-dyes.html";

/* ------------------------------------------------------------------ Science */

type Solvent = "water" | "ethanol";

interface Dye {
  id: string;
  name: string;
  colour: string;
  /** Rf value in each solvent. A dye that will not dissolve does not move at all. */
  rf: Record<Solvent, number>;
}

/**
 * The reference dyes kept in the prep room. Rf depends on the solvent as well
 * as on the dye, which is why an Rf value is only ever quoted together with
 * the solvent used.
 */
const DYES: Record<string, Dye> = {
  yellow: { id: "yellow", name: "Yellow (tartrazine)", colour: "#facc15", rf: { water: 0.84, ethanol: 0.9 } },
  red: { id: "red", name: "Red (carmoisine)", colour: "#e11d48", rf: { water: 0.55, ethanol: 0.66 } },
  blue: { id: "blue", name: "Blue (brilliant blue)", colour: "#2563eb", rf: { water: 0.28, ethanol: 0.42 } },
  green: { id: "green", name: "Green (fast green)", colour: "#16a34a", rf: { water: 0.4, ethanol: 0.52 } },
  /** A pigment that will not dissolve in water at all — it stays on the base line. */
  oil: { id: "oil", name: "Oil-based black pigment", colour: "#292524", rf: { water: 0.02, ethanol: 0.72 } },
};

interface Sample {
  id: string;
  name: string;
  short: string;
  /** Which dyes the sample is a mixture of. */
  components: string[];
  spotColour: string;
  note: string;
}

const SAMPLES: Sample[] = [
  {
    id: "black-ink",
    name: "Black ink from a felt pen",
    short: "Black ink",
    components: ["yellow", "red", "blue"],
    spotColour: "#1f2937",
    note: "Black ink is not a single dye. It separates into yellow, red and blue, which together look black on the paper.",
  },
  {
    id: "green-dye",
    name: "Green food colouring",
    short: "Green dye",
    components: ["yellow", "blue"],
    spotColour: "#15803d",
    note: "Green food colouring is a mixture of a yellow dye and a blue dye — the classic way to show that a colour can be a mixture.",
  },
  {
    id: "unknown",
    name: "Ink from the note (unknown)",
    short: "Unknown",
    components: ["red", "blue"],
    spotColour: "#6d28d9",
    note: "The unknown ink gives two spots that match the red and the blue references exactly, so it is a mixture of those two dyes.",
  },
  {
    id: "pure-red",
    name: "Reference: red dye",
    short: "Red ref",
    components: ["red"],
    spotColour: "#e11d48",
    note: "A pure substance gives one spot only. That is how chromatography tells a pure substance from a mixture.",
  },
  {
    id: "pure-blue",
    name: "Reference: blue dye",
    short: "Blue ref",
    components: ["blue"],
    spotColour: "#2563eb",
    note: "A single spot again — pure blue dye.",
  },
  {
    id: "oil-black",
    name: "Oil-based marker",
    short: "Oil marker",
    components: ["oil"],
    spotColour: "#292524",
    note: "In water this stays put on the base line, because it does not dissolve. In ethanol it moves well up the paper — the solvent has to dissolve the substance for chromatography to work.",
  },
];

/** Length of paper above the base line, in centimetres. */
const RUN_LENGTH = 8;

interface RfReading {
  sampleId: string;
  dyeId: string;
  spotDistance: number;
  frontDistance: number;
  rf: number;
}

const CHROMATOGRAPHY_MISSIONS: GameMission[] = [
  {
    short: "Spot",
    title: "Draw the base line and spot it",
    detail: "Rule a pencil line 1 cm from the bottom of the paper, and put a small spot of each sample on the line.",
    symbol: "✏️",
  },
  {
    short: "Run",
    title: "Stand it in the solvent",
    detail: "Lower the paper into the beaker so the solvent is below the base line, cover it, and let the solvent rise.",
    symbol: "🫙",
  },
  {
    short: "Mark",
    title: "Mark the solvent front",
    detail: "Take the paper out before the solvent reaches the top, and mark the solvent front at once in pencil.",
    symbol: "📏",
  },
  {
    short: "Rf",
    title: "Measure and calculate Rf",
    detail: "Rf = distance moved by the spot ÷ distance moved by the solvent. Compare the unknown with the references.",
    symbol: "🧮",
  },
];

const chromatographyTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Paper chromatography",
    text: "Chromatography separates a mixture of soluble substances. The solvent carries each dye up the paper at its own rate, so a mixture spreads out into separate spots.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "The paper hangs from a glass rod so that its bottom edge dips into the solvent, but the base line and the spots stay above the solvent surface.",
    mode: "bubble",
    selector: '[data-experiment-tour="chroma-scene"]',
  },
  {
    title: "Spot the samples",
    text: "Choose which samples to spot on the base line, then start the run. A pure substance gives one spot; a mixture gives several.",
    mode: "bubble",
    selector: '[data-experiment-tour="chroma-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Rf values",
    text: "Rf = distance moved by the spot ÷ distance moved by the solvent front. It has no units, it is always less than 1, and it is the same for a given dye in a given solvent.",
    mode: "bubble",
    selector: '[data-experiment-tour="chroma-results"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** The chromatography paper, hanging from the glass rod, with the spots on it. */
function ChromatogramPaper({
  samples,
  solvent,
  frontFraction,
  lowered,
  frontMarked,
}: {
  samples: Sample[];
  solvent: Solvent;
  frontFraction: number;
  lowered: boolean;
  frontMarked: boolean;
}) {
  const paperWidth = 0.9;
  const paperHeight = 1.1;
  /** Where the pencil base line sits, measured up from the bottom of the paper. */
  const baseLineY = 0.14;
  const runHeight = paperHeight - baseLineY - 0.08;

  return (
    <group position={[0, lowered ? 0.34 : 0.85, 0]}>
      {/* The paper strip */}
      <mesh position={[0, paperHeight / 2, 0]} castShadow>
        <boxGeometry args={[paperWidth, paperHeight, 0.005]} />
        <meshStandardMaterial color="#fdfdf8" roughness={0.95} />
      </mesh>

      {/* Wet region behind the solvent front */}
      <mesh position={[0, (baseLineY + frontFraction * runHeight) / 2, 0.004]}>
        <planeGeometry args={[paperWidth - 0.02, baseLineY + frontFraction * runHeight]} />
        <meshStandardMaterial color={solvent === "water" ? "#e0f2fe" : "#ede9fe"} roughness={0.9} transparent opacity={0.75} />
      </mesh>

      {/* Pencil base line */}
      <Line
        points={[
          [-paperWidth / 2 + 0.03, baseLineY, 0.005],
          [paperWidth / 2 - 0.03, baseLineY, 0.005],
        ]}
        color="#64748b"
        lineWidth={1.4}
      />
      <Html position={[-paperWidth / 2 - 0.16, baseLineY, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap text-[7px] font-black uppercase text-slate-400">base line</div>
      </Html>

      {/* Solvent front, marked in pencil when the paper is taken out */}
      {frontMarked && (
        <>
          <Line
            points={[
              [-paperWidth / 2 + 0.03, baseLineY + frontFraction * runHeight, 0.005],
              [paperWidth / 2 - 0.03, baseLineY + frontFraction * runHeight, 0.005],
            ]}
            color="#475569"
            lineWidth={1.4}
            dashed
            dashSize={0.04}
            gapSize={0.03}
          />
          <Html
            position={[paperWidth / 2 + 0.2, baseLineY + frontFraction * runHeight, 0]}
            center
            distanceFactor={6}
            style={{ pointerEvents: "none" }}
          >
            <div className="whitespace-nowrap text-[7px] font-black uppercase text-slate-300">solvent front</div>
          </Html>
        </>
      )}

      {/* One lane per sample */}
      {samples.map((sample, index) => {
        const laneX = samples.length === 1 ? 0 : -paperWidth / 2 + 0.16 + index * ((paperWidth - 0.32) / Math.max(1, samples.length - 1));
        return (
          <group key={sample.id} position={[laneX, 0, 0.006]}>
            {/* The original spot fades as the dyes leave the base line */}
            <mesh position={[0, baseLineY, 0]}>
              <circleGeometry args={[0.035, 16]} />
              <meshBasicMaterial
                color={sample.spotColour}
                transparent
                opacity={Math.max(0.12, 1 - frontFraction * 1.4)}
              />
            </mesh>

            {sample.components.map((dyeId) => {
              const dye = DYES[dyeId];
              const travelled = dye.rf[solvent] * frontFraction * runHeight;
              /** Spots spread out a little as they climb, as real ones do. */
              const spread = 0.032 + frontFraction * 0.014;
              return (
                <mesh key={dyeId} position={[0, baseLineY + travelled, 0]}>
                  <circleGeometry args={[spread, 18]} />
                  <meshBasicMaterial color={dye.colour} transparent opacity={0.45 + frontFraction * 0.45} />
                </mesh>
              );
            })}

            <Html position={[0, -0.06, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/88 px-1 py-0.5 text-[6px] font-black uppercase text-slate-200">
                {sample.short}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function ChromatographyScene({
  samples,
  solvent,
  frontFraction,
  lowered,
  frontMarked,
  lidOn,
  mode,
  isMobile,
  moveVectorRef,
}: {
  samples: Sample[];
  solvent: Solvent;
  frontFraction: number;
  lowered: boolean;
  frontMarked: boolean;
  lidOn: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0, 2.9, 2.5] : [0.05, 2.75, 2.05];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.6, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 45;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0d9488"
        benchColor="#eef2f3"
        posterA={{
          title: "CHROMATOGRAPHY",
          lines: [
            "Separates soluble coloured substances",
            "One spot = pure · several = mixture",
            "Rf = spot distance ÷ solvent distance",
            "Rf has no units and is less than 1",
          ],
        }}
        posterB={{
          title: "COMMON MISTAKES",
          lines: ["Base line in pencil, never ink", "Solvent must start below the spots", "Cover the beaker to stop evaporation"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {/* Beaker */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.62, 0.6, 0.84, 34, 1, true]} />
            <meshPhysicalMaterial
              color="#dbeafe"
              transparent
              opacity={0.2}
              transmission={0.88}
              roughness={0.05}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 0.012, 0]} receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.024, 34]} />
            <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.32} transmission={0.8} roughness={0.06} />
          </mesh>
          {/* The solvent */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.585, 0.585, 0.22, 34]} />
            <meshPhysicalMaterial
              color={solvent === "water" ? "#bae6fd" : "#ddd6fe"}
              transparent
              opacity={0.6}
              transmission={0.5}
              roughness={0.12}
            />
          </mesh>
          <Html position={[0.78, 0.16, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
              {solvent === "water" ? "water" : "ethanol"}
            </div>
          </Html>

          {/* Glass rod across the top, with the paper hanging from it */}
          <mesh position={[0, 0.92, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 1.5, 14]} />
            <meshPhysicalMaterial color="#e0f2fe" transmission={0.8} roughness={0.06} transparent opacity={0.55} />
          </mesh>

          <ChromatogramPaper
            samples={samples}
            solvent={solvent}
            frontFraction={frontFraction}
            lowered={lowered}
            frontMarked={frontMarked}
          />

          {/* Watch-glass lid */}
          {lidOn && (
            <mesh position={[0, 0.9, 0]} rotation={[Math.PI, 0, 0]}>
              <sphereGeometry args={[0.62, 26, 12, 0, Math.PI * 2, 0, Math.PI / 6]} />
              <meshPhysicalMaterial
                color="#dbeafe"
                transparent
                opacity={0.3}
                transmission={0.8}
                roughness={0.06}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Ruler on the bench for measuring the distances */}
          <group position={[1.25, 0.02, 0.15]}>
            <mesh position={[0, 0.008, 0]} receiveShadow>
              <boxGeometry args={[0.14, 0.016, 1.3]} />
              <meshStandardMaterial color="#f5e6c8" roughness={0.78} />
            </mesh>
            {Array.from({ length: 14 }, (_, index) => (
              <mesh key={index} position={[-0.04, 0.018, -0.6 + index * 0.092]}>
                <boxGeometry args={[index % 5 === 0 ? 0.06 : 0.035, 0.002, 0.004]} />
                <meshStandardMaterial color="#3f3f46" />
              </mesh>
            ))}
          </group>
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.6, 0]} minDistance={1.3} maxDistance={8} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function ChromatographyPaper({
  samples,
  solvent,
  readings,
  onClose,
}: {
  samples: Sample[];
  solvent: Solvent;
  readings: RfReading[];
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Separating a Mixture of Dyes by Paper Chromatography</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To separate the coloured substances in inks and food colourings by paper chromatography, to find out whether each sample is a pure substance or a mixture, and to calculate the Rf value of each dye.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>A strip of chromatography paper, a 250 cm³ beaker, a watch glass to act as a lid, a glass rod, a pencil, a ruler, fine capillary tubes or melting-point tubes for spotting, and the solvent ({solvent === "water" ? "distilled water" : "ethanol"}).</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A line was ruled across the chromatography paper in pencil, about 1 cm from the bottom edge. This is the base line.</li>
          <li>A small spot of each sample was placed on the base line, well apart, using a fresh capillary tube for each one. Each spot was allowed to dry and was then spotted again, so that it was small but concentrated.</li>
          <li>The solvent was poured into the beaker to a depth of about 0.5 cm — below the level of the base line.</li>
          <li>The paper was hung from a glass rod so that only the bottom edge dipped into the solvent, and the beaker was covered with a watch glass.</li>
          <li>The solvent was allowed to rise up the paper without disturbing the beaker.</li>
          <li>Before the solvent reached the top, the paper was taken out and the position of the solvent front was marked immediately in pencil.</li>
          <li>The paper was left to dry, and the distance moved by each spot and by the solvent front was measured from the base line to the centre of each spot.</li>
          <li>The Rf value of each dye was calculated.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Sample</th>
              <th className="border border-slate-400 p-2">Colour of spot</th>
              <th className="border border-slate-400 p-2">Distance moved by spot / cm</th>
              <th className="border border-slate-400 p-2">Distance moved by solvent / cm</th>
              <th className="border border-slate-400 p-2">Rf</th>
            </tr>
          </thead>
          <tbody>
            {(readings.length ? readings : []).map((reading, index) => (
              <tr key={`${reading.sampleId}-${reading.dyeId}-${index}`}>
                <td className="border border-slate-400 p-2">{SAMPLES.find((item) => item.id === reading.sampleId)?.short}</td>
                <td className="border border-slate-400 p-2">{DYES[reading.dyeId]?.name}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.spotDistance.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.frontDistance.toFixed(1)}</td>
                <td className="border border-slate-400 p-2 text-center">{reading.rf.toFixed(2)}</td>
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
        <h2 className="mt-5 font-bold uppercase">Treatment of results</h2>
        <p>
          Rf = distance moved by the spot ÷ distance moved by the solvent, both measured from the base line to the centre
          of the spot. Rf has no units, because it is a ratio of two lengths, and it is always less than 1, because a
          spot can never travel further than the solvent that carries it.
        </p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {samples.some((sample) => sample.components.length > 1)
            ? "The samples that gave more than one spot are mixtures; those that gave a single spot are pure substances. "
            : ""}
          The black ink separated into three dyes and the green food colouring into two, so both are mixtures. The
          reference dyes each gave a single spot, showing that they are pure. The unknown ink gave spots with the same Rf
          values as the red and the blue references, run under the same conditions on the same paper, so it contains
          those two dyes. Substances separate because each one is held on to the paper to a different extent while the
          solvent carries it along: a dye that dissolves well in the solvent, and is held only weakly by the paper,
          travels a long way and has a high Rf value.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The base line was drawn in pencil, not in ink, because ink would dissolve in the solvent and run up the paper with the samples.</li>
          <li>The solvent level was kept below the base line, or the spots would dissolve straight into the solvent instead of moving up the paper.</li>
          <li>The beaker was covered, so that the solvent did not evaporate from the paper and the atmosphere inside stayed saturated.</li>
          <li>The spots were kept small, so that they did not overlap and blur into one another.</li>
          <li>The solvent front was marked at once on removing the paper, because the solvent evaporates and the front cannot be seen when the paper is dry.</li>
          <li>Rf values are only comparable when the samples are run on the same paper, in the same solvent, at the same temperature.</li>
          <li>Ethanol is flammable and must be kept away from naked flames.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function PaperChromatographySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ChromatographySimProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(["black-ink", "unknown", "pure-red", "pure-blue"]);
  const [solvent, setSolvent] = useState<Solvent>("water");
  const [lowered, setLowered] = useState(false);
  const [lidOn, setLidOn] = useState(false);
  const [frontFraction, setFrontFraction] = useState(0);
  const [frontMarked, setFrontMarked] = useState(false);
  const [running, setRunning] = useState(false);
  const [readings, setReadings] = useState<RfReading[]>([]);
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

  const samples = useMemo(
    () => SAMPLES.filter((sample) => selectedIds.includes(sample.id)),
    [selectedIds],
  );

  const toggleSample = useCallback((id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 5) return current;
      return [...current, id];
    });
  }, []);

  /** The solvent creeps up the paper; without a lid it evaporates and stops short. */
  const startRun = useCallback(() => {
    if (running || !samples.length) return;
    clearTimers();
    setLowered(true);
    setFrontMarked(false);
    setFrontFraction(0);
    setReadings([]);
    setRunning(true);

    const ceiling = lidOn ? 1 : 0.72;
    const steps = 44;
    for (let index = 1; index <= steps; index += 1) {
      timers.current.push(window.setTimeout(() => setFrontFraction((index / steps) * ceiling), 260 + index * 180));
    }
    timers.current.push(window.setTimeout(() => setRunning(false), 260 + steps * 180 + 200));
  }, [clearTimers, lidOn, running, samples.length]);

  /** Taking the paper out and marking the front is what freezes the chromatogram. */
  const removeAndMark = useCallback(() => {
    clearTimers();
    setRunning(false);
    setLowered(false);
    setFrontMarked(true);

    const frontDistance = frontFraction * RUN_LENGTH;
    const measured: RfReading[] = [];
    samples.forEach((sample) => {
      sample.components.forEach((dyeId) => {
        const dye = DYES[dyeId];
        const spotDistance = dye.rf[solvent] * frontDistance;
        measured.push({
          sampleId: sample.id,
          dyeId,
          spotDistance,
          frontDistance,
          rf: frontDistance > 0 ? spotDistance / frontDistance : 0,
        });
      });
    });
    setReadings(measured);
  }, [clearTimers, frontFraction, samples, solvent]);

  const resetAll = useCallback(() => {
    clearTimers();
    setLowered(false);
    setLidOn(false);
    setFrontFraction(0);
    setFrontMarked(false);
    setRunning(false);
    setReadings([]);
    setDemoActive(false);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setSelectedIds(["black-ink", "green-dye", "unknown", "pure-red", "pure-blue"]);
    setSolvent("water");
    setLidOn(true);
    setLowered(true);
    setFrontMarked(false);
    setFrontFraction(0);
    setReadings([]);
    setRunning(true);

    const steps = 34;
    for (let index = 1; index <= steps; index += 1) {
      timers.current.push(window.setTimeout(() => setFrontFraction(index / steps), 400 + index * 120));
    }
    timers.current.push(
      window.setTimeout(() => {
        setRunning(false);
        setLowered(false);
        setFrontMarked(true);
        const frontDistance = RUN_LENGTH;
        const measured: RfReading[] = [];
        ["black-ink", "green-dye", "unknown", "pure-red", "pure-blue"].forEach((sampleId) => {
          const sample = SAMPLES.find((item) => item.id === sampleId);
          sample?.components.forEach((dyeId) => {
            const spotDistance = DYES[dyeId].rf.water * frontDistance;
            measured.push({ sampleId, dyeId, spotDistance, frontDistance, rf: spotDistance / frontDistance });
          });
        });
        setReadings(measured);
      }, 400 + steps * 120 + 250),
    );
    timers.current.push(window.setTimeout(() => setDemoActive(false), 400 + steps * 120 + 900));
  }, [clearTimers, demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = frontMarked && readings.length >= 3;
  const step = complete ? 3 : frontMarked ? 3 : frontFraction > 0.15 ? 2 : lowered ? 1 : 0;
  const progress = frontMarked ? 1 : frontFraction;

  /** Does the unknown match the two references? */
  const unknownIdentified =
    readings.some((reading) => reading.sampleId === "unknown" && reading.dyeId === "red") &&
    readings.some((reading) => reading.sampleId === "pure-red");

  const status = complete
    ? `Solvent front at ${(frontFraction * RUN_LENGTH).toFixed(1)} cm. ${unknownIdentified ? "The unknown ink has spots with the same Rf values as the red and blue references, so it is a mixture of those two dyes." : "Rf values calculated for every spot."}`
    : running
      ? `The solvent is rising — it has reached ${(frontFraction * RUN_LENGTH).toFixed(1)} cm. The dyes are separating as they are carried up.`
      : lowered
        ? "The paper is in the solvent. Check that the solvent is below the base line, then let it run."
        : `${samples.length} sample${samples.length === 1 ? "" : "s"} spotted on the base line. Lower the paper into the solvent and start the run.`;

  const observation = complete
    ? "A pure substance gives one spot; a mixture gives several. Rf is a ratio, so it has no units and can never be more than 1."
    : !lidOn && running
      ? "Without a lid the solvent evaporates from the paper, so the front stops short and the spots do not travel as far."
      : solvent === "ethanol"
        ? "Ethanol dissolves the oil-based pigment, which water cannot move at all — the choice of solvent matters."
        : "Each dye is held by the paper to a different extent, so each one travels its own distance up the paper.";

  const primaryLabel = complete
    ? "New sheet of paper"
    : frontFraction > 0.35 && running
      ? "Take it out and mark the front"
      : running
        ? "Solvent rising…"
        : lowered
          ? "Start the run"
          : "Lower the paper in";

  const onPrimary = useCallback(() => {
    if (complete) {
      resetAll();
      return;
    }
    if (running && frontFraction > 0.35) {
      removeAndMark();
      return;
    }
    if (!lowered) {
      setLowered(true);
      return;
    }
    startRun();
  }, [complete, frontFraction, lowered, removeAndMark, resetAll, running, startRun]);

  const setupPanel = (
    <div data-experiment-tour="chroma-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Samples to spot</span>
        <span className="text-[9px] font-bold text-slate-500">{samples.length}/5</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => toggleSample(sample.id)}
            disabled={demoActive || running}
            className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              selectedIds.includes(sample.id)
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: sample.spotColour }} />
            <span className="truncate">{sample.short}</span>
          </button>
        ))}
      </div>

      <div className="mt-2.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Solvent</div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(["water", "ethanol"] as Solvent[]).map((item) => (
          <button
            key={item}
            onClick={() => {
              setSolvent(item);
              resetAll();
            }}
            disabled={demoActive || running}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              solvent === item
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {item === "water" ? "💧 Water" : "🧴 Ethanol"}
          </button>
        ))}
      </div>

      <button
        onClick={() => setLidOn((value) => !value)}
        disabled={demoActive || running}
        className="mt-2 w-full rounded-xl border border-white/10 px-2 py-2 text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
        style={lidOn ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
      >
        {lidOn ? "Watch glass on — solvent cannot evaporate" : "No lid — the solvent will evaporate"}
      </button>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={startRun}
          disabled={demoActive || running || !samples.length}
          className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          Start the run
        </button>
        <button
          onClick={removeAndMark}
          disabled={demoActive || frontFraction < 0.2}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
        >
          Take out & mark
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Solvent front</div>
          <div className="text-sm font-black text-white">{(frontFraction * RUN_LENGTH).toFixed(1)} cm</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            Spots seen
          </div>
          <div className="text-sm font-black text-white">
            {samples.reduce((total, sample) => total + sample.components.length, 0)}
          </div>
        </div>
      </div>
    </div>
  );

  const resultsPanel = (
    <div data-experiment-tour="chroma-results" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Rf values</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {readings.length} spots
        </span>
      </div>
      {readings.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">
          Run the chromatogram, then take the paper out and mark the solvent front to measure the distances.
        </p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">Sample</th>
              <th className="py-0.5 text-left font-black uppercase">Spot</th>
              <th className="py-0.5 text-right font-black uppercase">d/cm</th>
              <th className="py-0.5 text-right font-black uppercase">Rf</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((reading, index) => (
              <tr key={`${reading.sampleId}-${reading.dyeId}-${index}`} className="border-t border-white/5 text-slate-200">
                <td className="py-1 font-bold">{SAMPLES.find((item) => item.id === reading.sampleId)?.short}</td>
                <td className="py-1">
                  <span className="inline-block h-2 w-2 rounded-full align-middle" style={{ background: DYES[reading.dyeId].colour }} />
                </td>
                <td className="py-1 text-right">{reading.spotDistance.toFixed(1)}</td>
                <td className="py-1 text-right font-black">{reading.rf.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {complete && (
        <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[9px] font-bold text-slate-300">
          Rf = distance moved by the spot ÷ distance moved by the solvent, both measured from the base line to the centre
          of the spot.
        </p>
      )}
    </div>
  );

  const notesPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Exam points</span>
      <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-300">
        <p>
          <span className="text-white">Pencil, not ink. </span>An ink base line would dissolve and run up the paper with the samples.
        </p>
        <p>
          <span className="text-white">Solvent below the base line. </span>Otherwise the spots dissolve straight into the solvent in the beaker.
        </p>
        <p>
          <span className="text-white">Cover the beaker. </span>It stops the solvent evaporating off the paper, so the front rises evenly.
        </p>
        <p>
          <span className="text-white">One spot = pure. </span>Several spots means the sample is a mixture.
        </p>
      </div>
      {samples.length > 0 && (
        <p className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] p-2 text-[9px] font-bold text-slate-300">
          {samples[samples.length - 1].note}
        </p>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Chromatography Bench"
          subtitle="Separate the dyes and find their Rf values"
          symbol="🧫"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to O Level Chemistry"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={complete ? 4 : step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="chroma-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.05, 2.75, 2.05], fov: 45, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <ChromatographyScene
            samples={samples}
            solvent={solvent}
            frontFraction={frontFraction}
            lowered={lowered}
            frontMarked={frontMarked}
            lidOn={lidOn}
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
            emoji="🧫"
            cornerEmoji="🎨"
            status={status}
            running={running || demoActive}
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
          title="Paper Chromatography"
          tagline="Separate the dyes and find their Rf values"
          missions={CHROMATOGRAPHY_MISSIONS}
          step={step}
          running={running || demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : "🧫"}
          onPrimary={onPrimary}
          primaryDisabled={demoActive || (running && frontFraction <= 0.35)}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "setup", label: "Set-up", value: `${samples.length} spots`, content: setupPanel },
            { id: "results", label: "Rf", value: `${readings.length}`, content: resultsPanel },
            { id: "notes", label: "Notes", content: notesPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "run", label: "Run", onClick: startRun, disabled: demoActive || running || !samples.length, tone: "green" },
            { id: "mark", label: "Mark", onClick: removeAndMark, disabled: demoActive || frontFraction < 0.2, tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "setup", label: "Set-up", value: `${samples.length} spots`, content: setupPanel },
            { id: "results", label: "Rf", value: `${readings.length}`, content: resultsPanel },
            { id: "notes", label: "Notes", content: notesPanel },
          ]}
        />
      )}

      {showPaper && (
        <ChromatographyPaper samples={samples} solvent={solvent} readings={readings} onClose={onClosePaper} />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={chromatographyTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
