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

interface TitrationSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.rose;
const PAPER_FILENAME = "acid-alkali-titration.html";

/* ------------------------------------------------------------------ Science */

type AcidId = "hcl" | "h2so4";
type IndicatorId = "phenolphthalein" | "methyl-orange";

interface Acid {
  id: AcidId;
  name: string;
  formula: string;
  concentration: number;
  /** Moles of H⁺ supplied by one mole of the acid. */
  basicity: number;
  equation: string;
}

const ACIDS: Record<AcidId, Acid> = {
  hcl: {
    id: "hcl",
    name: "Hydrochloric acid",
    formula: "HCl",
    concentration: 0.1,
    basicity: 1,
    equation: "HCl + NaOH → NaCl + H₂O",
  },
  h2so4: {
    id: "h2so4",
    name: "Sulfuric acid",
    formula: "H₂SO₄",
    concentration: 0.05,
    basicity: 2,
    equation: "H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O",
  },
};

interface Indicator {
  id: IndicatorId;
  name: string;
  inAlkali: string;
  inAcid: string;
  atEndPoint: string;
  colourAlkali: string;
  colourAcid: string;
  colourEnd: string;
  note: string;
}

const INDICATORS: Record<IndicatorId, Indicator> = {
  phenolphthalein: {
    id: "phenolphthalein",
    name: "Phenolphthalein",
    inAlkali: "pink",
    inAcid: "colourless",
    atEndPoint: "the very first drop that turns it colourless",
    colourAlkali: "#f472b6",
    colourAcid: "#e2e8f0",
    colourEnd: "#fbcfe8",
    note: "Sharpest with a strong alkali in the flask: the end point is the drop at which the pink just disappears.",
  },
  "methyl-orange": {
    id: "methyl-orange",
    name: "Methyl orange",
    inAlkali: "yellow",
    inAcid: "red",
    atEndPoint: "the first permanent orange tinge",
    colourAlkali: "#fbbf24",
    colourAcid: "#dc2626",
    colourEnd: "#fb923c",
    note: "Useful when the acid is in the flask, or with a weak base; the end point is the first permanent orange.",
  },
};

/** The alkali being analysed: 25.0 cm³ of sodium hydroxide of unknown concentration. */
const PIPETTE_VOLUME = 25;
const TRUE_ALKALI_CONCENTRATION = 0.096;
const BURETTE_CAPACITY = 50;
/** Two titres this close together count as concordant. */
const CONCORDANCE = 0.1;

interface Titration {
  id: string;
  label: string;
  initial: number;
  final: number;
  titre: number;
}

/** How far past the exact end point the flask is, as a fraction of the alkali present. */
function neutralisedFraction(acid: Acid, volumeAdded: number) {
  const molesAlkali = (TRUE_ALKALI_CONCENTRATION * PIPETTE_VOLUME) / 1000;
  const molesHydrogen = (acid.concentration * acid.basicity * volumeAdded) / 1000;
  return molesAlkali > 0 ? molesHydrogen / molesAlkali : 0;
}

/** The exact volume of this acid needed to neutralise the alkali in the flask. */
function equivalenceVolume(acid: Acid) {
  return (TRUE_ALKALI_CONCENTRATION * PIPETTE_VOLUME) / (acid.concentration * acid.basicity);
}

const TITRATION_MISSIONS: GameMission[] = [
  {
    short: "Prepare",
    title: "Rinse and fill",
    detail: "Rinse the burette with the acid and the pipette with the alkali, then run the burette down to fill the jet and record the initial reading.",
    symbol: "🧪",
  },
  {
    short: "Rough",
    title: "Do a rough titration",
    detail: "Run the acid in quickly to find roughly where the end point is. This titre is not used in the average.",
    symbol: "⏱️",
  },
  {
    short: "Accurate",
    title: "Titrate drop by drop",
    detail: "Repeat, adding the last cubic centimetre a drop at a time and swirling, until the indicator just changes colour.",
    symbol: "💧",
  },
  {
    short: "Calculate",
    title: "Concordant titres and the answer",
    detail: "Average two titres agreeing within 0.10 cm³, then work out the concentration of the alkali.",
    symbol: "🧮",
  },
];

const titrationTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Titration",
    text: "A titration finds the exact volume of acid needed to neutralise a measured volume of alkali. From that volume the unknown concentration can be calculated.",
    mode: "modal",
  },
  {
    title: "The apparatus",
    text: "The burette holds the acid and measures the volume added. The pipette has delivered exactly 25.0 cm³ of alkali into the conical flask, which stands on a white tile.",
    mode: "bubble",
    selector: '[data-experiment-tour="titration-scene"]',
  },
  {
    title: "Adding the acid",
    text: "Run the acid in quickly at first, swirling all the time. Near the end point add it one drop at a time — a single drop changes the colour.",
    mode: "bubble",
    selector: '[data-experiment-tour="titration-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Concordant results",
    text: "Repeat until two titres agree to within 0.10 cm³. Average only those, and never include the rough titration in the average.",
    mode: "bubble",
    selector: '[data-experiment-tour="titration-results"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function Burette({
  volumeLeft,
  tapOpen,
  acidColour,
}: {
  volumeLeft: number;
  tapOpen: boolean;
  acidColour: string;
}) {
  const barrelHeight = 1.5;
  const fillHeight = (volumeLeft / BURETTE_CAPACITY) * barrelHeight;

  return (
    <group position={[0, 1.05, 0]}>
      {/* Glass barrel */}
      <mesh position={[0, barrelHeight / 2, 0]}>
        <cylinderGeometry args={[0.07, 0.07, barrelHeight, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.22}
          transmission={0.88}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Acid inside — the level falls from the top as acid is run out */}
      <mesh position={[0, fillHeight / 2, 0]}>
        <cylinderGeometry args={[0.064, 0.064, fillHeight, 24]} />
        <meshStandardMaterial color={acidColour} transparent opacity={0.5} roughness={0.14} />
      </mesh>

      {/* Graduations, numbered downwards as on a real burette */}
      {Array.from({ length: 11 }, (_, index) => (
        <mesh key={index} position={[0.072, barrelHeight - (index / 10) * barrelHeight, 0]}>
          <boxGeometry args={[0.03, 0.004, 0.004]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Tap and jet */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[0.14, 0.1, 0.1]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>
      <mesh position={[0.1, -0.05, 0]} rotation={[0, 0, tapOpen ? Math.PI / 2 : 0]} castShadow>
        <boxGeometry args={[0.14, 0.03, 0.03]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.014, 0.008, 0.14, 12]} />
        <meshPhysicalMaterial color="#e0f2fe" transmission={0.85} roughness={0.06} transparent opacity={0.5} />
      </mesh>

      {/* A drop falling from the jet */}
      {tapOpen && (
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.016, 10, 8]} />
          <meshStandardMaterial color={acidColour} transparent opacity={0.8} />
        </mesh>
      )}

      <Html position={[0.3, barrelHeight - fillHeight, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-lg border border-rose-300/35 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[10px] font-black text-white">{(BURETTE_CAPACITY - volumeLeft).toFixed(2)}</div>
          <div className="text-[6px] font-black uppercase text-rose-200">burette reading cm³</div>
        </div>
      </Html>
    </group>
  );
}

function ConicalFlask({
  colour,
  fill,
  swirling,
}: {
  colour: string;
  fill: number;
  swirling: boolean;
}) {
  const flaskRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!flaskRef.current) return;
    /** Swirling tips the flask round in a small circle, as your hand does. */
    const amount = swirling ? 0.09 : 0;
    flaskRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 7) * amount;
    flaskRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 7) * amount;
  });

  return (
    <group ref={flaskRef} position={[0, 0.04, 0]}>
      {/* Body of the flask */}
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.28, 0.34, 30, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.22}
          transmission={0.88}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.22, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transparent
          opacity={0.22}
          transmission={0.88}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -0.005, 0]} receiveShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.014, 30]} />
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.34} transmission={0.8} roughness={0.06} />
      </mesh>

      {/* The solution, whose colour is the indicator's colour */}
      <mesh position={[0, 0.03 + fill * 0.06, 0]}>
        <coneGeometry args={[0.2 + fill * 0.04, 0.1 + fill * 0.1, 28]} />
        <meshStandardMaterial color={colour} transparent opacity={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

function TitrationScene({
  volumeLeft,
  tapOpen,
  flaskColour,
  fill,
  swirling,
  acid,
  mode,
  isMobile,
  moveVectorRef,
}: {
  volumeLeft: number;
  tapOpen: boolean;
  flaskColour: string;
  fill: number;
  swirling: boolean;
  acid: Acid;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.15, 3.3, 2.7] : [0.2, 3.05, 2.2];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.9, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#e11d48"
        benchColor="#eef1f4"
        posterA={{
          title: "TITRATION",
          lines: [
            "moles = concentration × volume ÷ 1000",
            "Use the equation for the mole ratio",
            "Average concordant titres only",
            "Titres agree to within 0.10 cm³",
          ],
        }}
        posterB={{
          title: "APPARATUS RULES",
          lines: ["Rinse burette with acid, pipette with alkali", "Read the bottom of the meniscus", "White tile under the flask"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          {/* Retort stand and burette clamp */}
          <mesh position={[-0.42, 0.03, -0.1]} receiveShadow castShadow>
            <boxGeometry args={[0.42, 0.06, 0.34]} />
            <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[-0.42, 1.3, -0.1]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 2.5, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.72} roughness={0.3} />
          </mesh>
          <mesh position={[-0.21, 1.9, -0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.42, 10]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
          </mesh>

          <Burette volumeLeft={volumeLeft} tapOpen={tapOpen} acidColour={acid.id === "hcl" ? "#dbeafe" : "#e9d5ff"} />

          {/* White tile, so the colour change shows up clearly */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[0.7, 0.03, 0.7]} />
            <meshStandardMaterial color="#fafafa" roughness={0.35} />
          </mesh>

          <ConicalFlask colour={flaskColour} fill={fill} swirling={swirling} />

          {/* Pipette and its filler resting on the bench */}
          <group position={[1.15, 0.06, 0.35]} rotation={[0, 0.4, 0.08]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 1.1, 12]} />
              <meshPhysicalMaterial color="#e0f2fe" transmission={0.85} roughness={0.06} transparent opacity={0.55} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <sphereGeometry args={[0.075, 18, 14]} />
              <meshPhysicalMaterial color="#e0f2fe" transmission={0.85} roughness={0.06} transparent opacity={0.55} />
            </mesh>
            <Html position={[0, 0.16, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
                25.0 cm³ pipette
              </div>
            </Html>
          </group>

          {/* Reagent bottles at the back of the bench */}
          {[
            { x: -1.5, colour: "#dbeafe", label: acid.formula },
            { x: -1.05, colour: "#e2e8f0", label: "NaOH" },
          ].map((bottle) => (
            <group key={bottle.x} position={[bottle.x, 0.02, -0.75]}>
              <mesh position={[0, 0.18, 0]} castShadow>
                <cylinderGeometry args={[0.14, 0.14, 0.36, 22]} />
                <meshPhysicalMaterial color={bottle.colour} transparent opacity={0.45} transmission={0.6} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.09, 16]} />
                <meshStandardMaterial color="#1f2937" roughness={0.6} />
              </mesh>
              <Html position={[0, 0.2, 0.15]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
                <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1 py-0.5 text-[7px] font-black text-slate-100">
                  {bottle.label}
                </div>
              </Html>
            </group>
          ))}
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.9, 0]} minDistance={1.4} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function TitrationPaper({
  acid,
  indicator,
  titrations,
  meanTitre,
  concentration,
  onClose,
}: {
  acid: Acid;
  indicator: Indicator;
  titrations: Titration[];
  meanTitre: number | null;
  concentration: number | null;
  onClose: () => void;
}) {
  const molesAcid = meanTitre !== null ? (acid.concentration * meanTitre) / 1000 : null;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Titration of {acid.name} against Sodium Hydroxide</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To find the concentration of a solution of sodium hydroxide by titrating it against a standard solution of {acid.name.toLowerCase()} of concentration {acid.concentration.toFixed(3)} mol/dm³, using {indicator.name.toLowerCase()} as the indicator.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>A 50 cm³ burette, a burette stand and clamp, a 25.0 cm³ pipette and safety filler, a 250 cm³ conical flask, a white tile, a small funnel, beakers, a wash bottle of distilled water and {indicator.name.toLowerCase()} indicator.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The burette was washed with distilled water and then rinsed with a little of the {acid.name.toLowerCase()}, which was run out through the tap.</li>
          <li>The burette was clamped upright and filled with the acid using a small funnel. The funnel was removed, the tap was opened briefly to fill the jet below the tap, and the initial reading was taken from the bottom of the meniscus with the eye level with it.</li>
          <li>The pipette was rinsed with a little of the sodium hydroxide solution, and 25.0 cm³ of the solution was then transferred to the conical flask using the safety filler.</li>
          <li>Two or three drops of {indicator.name.toLowerCase()} were added to the flask, which turned {indicator.inAlkali}. The flask was stood on a white tile.</li>
          <li>The acid was run in from the burette while the flask was swirled continuously. A rough titration was done first, adding the acid quickly, to find the approximate end point.</li>
          <li>The titration was repeated. This time the acid was run in quickly to about 1 cm³ before the rough titre, and then added a drop at a time, swirling after each drop, until {indicator.atEndPoint}.</li>
          <li>The final burette reading was taken and the titre calculated as final reading − initial reading.</li>
          <li>The titration was repeated until two titres agreed to within 0.10 cm³.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">&nbsp;</th>
              {(titrations.length ? titrations : [{ id: "a", label: "Rough" }, { id: "b", label: "1" }, { id: "c", label: "2" }]).map(
                (titration) => (
                  <th key={titration.id} className="border border-slate-400 p-2">
                    {titration.label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2">Final reading / cm³</td>
              {(titrations.length ? titrations : [null, null, null]).map((titration, index) => (
                <td key={index} className="border border-slate-400 p-2 text-center">
                  {titration ? titration.final.toFixed(2) : ""}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Initial reading / cm³</td>
              {(titrations.length ? titrations : [null, null, null]).map((titration, index) => (
                <td key={index} className="border border-slate-400 p-2 text-center">
                  {titration ? titration.initial.toFixed(2) : ""}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">Titre / cm³</td>
              {(titrations.length ? titrations : [null, null, null]).map((titration, index) => (
                <td key={index} className="border border-slate-400 p-2 text-center font-bold">
                  {titration ? titration.titre.toFixed(2) : ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        {meanTitre !== null && (
          <p className="mt-2">Mean of the concordant titres = {meanTitre.toFixed(2)} cm³. The rough titration is not included in the average.</p>
        )}
        <h2 className="mt-5 font-bold uppercase">Equation</h2>
        <p>{acid.equation}</p>
        <h2 className="mt-5 font-bold uppercase">Calculation</h2>
        {meanTitre !== null && concentration !== null && molesAcid !== null ? (
          <ol className="list-decimal space-y-1 pl-6">
            <li>
              Moles of {acid.formula} used = concentration × volume ÷ 1000 = {acid.concentration.toFixed(3)} ×{" "}
              {meanTitre.toFixed(2)} ÷ 1000 = {molesAcid.toExponential(3)} mol.
            </li>
            <li>
              From the equation, 1 mole of {acid.formula} reacts with {acid.basicity} mole
              {acid.basicity > 1 ? "s" : ""} of NaOH, so moles of NaOH = {acid.basicity} ×{" "}
              {molesAcid.toExponential(3)} = {(molesAcid * acid.basicity).toExponential(3)} mol.
            </li>
            <li>
              Concentration of NaOH = moles ÷ volume in dm³ = {(molesAcid * acid.basicity).toExponential(3)} ÷ (
              {PIPETTE_VOLUME.toFixed(1)} ÷ 1000) = {concentration.toFixed(3)} mol/dm³.
            </li>
            <li>
              In g/dm³: {concentration.toFixed(3)} × 40 = {(concentration * 40).toFixed(1)} g/dm³, since the relative
              formula mass of NaOH is 40.
            </li>
          </ol>
        ) : (
          <p>Moles of acid = concentration × volume ÷ 1000; the mole ratio from the equation then gives the moles of alkali, and dividing by the volume in dm³ gives its concentration.</p>
        )}
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {concentration !== null
            ? `The concentration of the sodium hydroxide solution was ${concentration.toFixed(3)} mol/dm³, which is ${(concentration * 40).toFixed(1)} g/dm³.`
            : "The concentration of the sodium hydroxide solution is found from the mean concordant titre."}{" "}
          At the end point the acid and the alkali have exactly reacted; there is no excess of either, and the solution
          contains only sodium {acid.id === "hcl" ? "chloride" : "sulfate"} and water.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions and sources of error</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The burette was rinsed with the acid and the pipette with the alkali, so that water left inside did not dilute the solutions.</li>
          <li>The jet below the tap was filled before the initial reading was taken; an air bubble there would leave the titre too large.</li>
          <li>Readings were taken from the bottom of the meniscus with the eye level with it, to avoid parallax error.</li>
          <li>The flask was swirled throughout, so that the acid mixed properly with the alkali.</li>
          <li>The sides of the flask were washed down with distilled water near the end point, so that no acid was left clinging to them. This does not affect the result, because it does not change the number of moles present.</li>
          <li>Only two or three drops of indicator were used; the indicator is itself a weak acid, and too much would affect the end point.</li>
          <li>The rough titre was excluded and only concordant titres, agreeing to within 0.10 cm³, were averaged.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function AcidAlkaliTitrationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: TitrationSimProps) {
  const [acidId, setAcidId] = useState<AcidId>("hcl");
  const [indicatorId, setIndicatorId] = useState<IndicatorId>("phenolphthalein");
  const [initialReading, setInitialReading] = useState(0);
  const [added, setAdded] = useState(0);
  const [tapOpen, setTapOpen] = useState(false);
  const [swirling, setSwirling] = useState(false);
  const [titrations, setTitrations] = useState<Titration[]>([]);
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

  const acid = ACIDS[acidId];
  const indicator = INDICATORS[indicatorId];
  const fraction = neutralisedFraction(acid, added);
  const endPoint = equivalenceVolume(acid);

  /**
   * With a strong acid and a strong alkali the pH falls almost vertically at
   * the end point, so the colour changes over a fraction of a cubic centimetre.
   */
  const flaskColour = useMemo(() => {
    if (fraction < 0.995) return indicator.colourAlkali;
    if (fraction > 1.005) return indicator.colourAcid;
    /** In the transition the colours blend, which is the end point tint. */
    const t = (fraction - 0.995) / 0.01;
    return new THREE.Color(indicator.colourAlkali).lerp(new THREE.Color(indicator.colourAcid), t).getStyle();
  }, [fraction, indicator]);

  const atEndPoint = fraction >= 0.997 && fraction <= 1.004;
  const overshot = fraction > 1.02;

  const runIn = useCallback(
    (volume: number) => {
      setTapOpen(true);
      setAdded((current) => Math.min(BURETTE_CAPACITY - initialReading, current + volume));
      timers.current.push(window.setTimeout(() => setTapOpen(false), 220));
    },
    [initialReading],
  );

  /** Runs acid in quickly to just short of where the end point is expected. */
  const runToNearEnd = useCallback(() => {
    labSounds.play("tapSqueak", { volume: 0.4 });
        labSounds.play("dropletDrip", { volume: 0.4 });
    clearTimers();
    const target = Math.max(0, (titrations.length ? titrations[0].titre : endPoint) - 1);
    if (added >= target) return;
    setTapOpen(true);
    setSwirling(true);
    const steps = 20;
    const startVolume = added;
    for (let index = 1; index <= steps; index += 1) {
      timers.current.push(
        window.setTimeout(() => setAdded(startVolume + ((target - startVolume) * index) / steps), index * 55),
      );
    }
    timers.current.push(
      window.setTimeout(() => {
        setTapOpen(false);
        setSwirling(false);
      }, steps * 55 + 200),
    );
  }, [added, clearTimers, endPoint, titrations]);

  const recordTitre = useCallback(() => {
    labSounds.play("readingRecorded", { volume: 0.5 });
    if (added <= 0) return;
    setTitrations((existing) => {
      if (existing.length >= 5) return existing;
      const label = existing.length === 0 ? "Rough" : `${existing.length}`;
      return [
        ...existing,
        {
          id: `${Date.now()}-${existing.length}`,
          label,
          initial: initialReading,
          final: initialReading + added,
          titre: added,
        },
      ];
    });
    /** Refill the burette and put a fresh 25.0 cm³ of alkali in the flask. */
    setAdded(0);
    setInitialReading(0);
  }, [added, initialReading]);

  const resetAll = useCallback(() => {
    clearTimers();
    setAdded(0);
    setInitialReading(0);
    setTitrations([]);
    setTapOpen(false);
    setSwirling(false);
    setDemoActive(false);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      setTapOpen(false);
      setSwirling(false);
      return;
    }
    setDemoActive(true);
    setTitrations([]);
    setAdded(0);
    setInitialReading(0);

    const target = equivalenceVolume(ACIDS[acidId]);
    let elapsed = 300;

    /** Rough titration: run it in fast and overshoot a little. */
    const roughSteps = 18;
    for (let index = 1; index <= roughSteps; index += 1) {
      timers.current.push(window.setTimeout(() => setAdded(((target + 0.4) * index) / roughSteps), elapsed + index * 55));
    }
    timers.current.push(window.setTimeout(() => setTapOpen(true), elapsed));
    timers.current.push(window.setTimeout(() => setTapOpen(false), elapsed + roughSteps * 55));
    elapsed += roughSteps * 55 + 500;
    timers.current.push(
      window.setTimeout(() => {
        setTitrations((existing) => [
          ...existing,
          { id: "demo-rough", label: "Rough", initial: 0, final: target + 0.4, titre: target + 0.4 },
        ]);
        setAdded(0);
      }, elapsed),
    );
    elapsed += 500;

    /** Two accurate titrations, drop by drop at the end. */
    [0, 1].forEach((run) => {
      const fastSteps = 14;
      const fastTarget = target - 0.8;
      for (let index = 1; index <= fastSteps; index += 1) {
        timers.current.push(window.setTimeout(() => setAdded((fastTarget * index) / fastSteps), elapsed + index * 45));
      }
      timers.current.push(window.setTimeout(() => setSwirling(true), elapsed));
      elapsed += fastSteps * 45 + 250;

      const drops = 17;
      for (let index = 1; index <= drops; index += 1) {
        timers.current.push(window.setTimeout(() => setAdded(fastTarget + index * 0.05), elapsed + index * 130));
      }
      elapsed += drops * 130 + 400;
      timers.current.push(
        window.setTimeout(() => {
          const titre = fastTarget + drops * 0.05;
          setSwirling(false);
          setTitrations((existing) => [
            ...existing,
            { id: `demo-${run}`, label: `${run + 1}`, initial: 0, final: titre, titre },
          ]);
          setAdded(0);
        }, elapsed),
      );
      elapsed += 500;
    });

    timers.current.push(window.setTimeout(() => setDemoActive(false), elapsed + 300));
  }, [acidId, clearTimers, demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  /** Concordant titres: two or more accurate titres within 0.10 cm³ of each other. */
  const accurateTitres = useMemo(
    () => titrations.filter((titration) => titration.label !== "Rough").map((titration) => titration.titre),
    [titrations],
  );

  const concordant = useMemo(() => {
    for (let i = 0; i < accurateTitres.length; i += 1) {
      const group = accurateTitres.filter((titre) => Math.abs(titre - accurateTitres[i]) <= CONCORDANCE);
      if (group.length >= 2) return group;
    }
    return [];
  }, [accurateTitres]);

  const meanTitre = concordant.length ? concordant.reduce((total, titre) => total + titre, 0) / concordant.length : null;
  const concentration =
    meanTitre !== null
      ? ((acid.concentration * meanTitre) / 1000) * acid.basicity * (1000 / PIPETTE_VOLUME)
      : null;

  const complete = meanTitre !== null;
  const step = complete ? 3 : accurateTitres.length >= 1 ? 2 : titrations.length >= 1 ? 1 : 0;
  const progress = Math.min(1, titrations.length / 3);

  const status = complete
    ? `Mean concordant titre ${meanTitre.toFixed(2)} cm³ → the sodium hydroxide is ${concentration!.toFixed(3)} mol/dm³ (${(concentration! * 40).toFixed(1)} g/dm³).`
    : overshot
      ? `Overshot — the solution is now ${indicator.inAcid} and there is excess acid. Discard it and start this titration again.`
      : atEndPoint
        ? `End point! The colour has just changed from ${indicator.inAlkali} to ${indicator.inAcid}. Read the burette and record the titre.`
        : added > 0
          ? `${added.toFixed(2)} cm³ run in. The flask is still ${indicator.inAlkali}${added > endPoint - 1.5 ? " — go a drop at a time now, swirling after each drop." : "."}`
          : titrations.length
            ? `${titrations.length} titration${titrations.length === 1 ? "" : "s"} done. Refill the burette, pipette a fresh 25.0 cm³ and repeat.`
            : "Run the acid in from the burette, swirling all the time, until the indicator just changes colour.";

  const observation = complete
    ? `${acid.equation}. From the mole ratio, ${acid.basicity} mol of NaOH reacts with 1 mol of ${acid.formula}.`
    : indicator.note;

  const primaryLabel = complete
    ? "Start again"
    : atEndPoint || overshot
      ? "Record the titre"
      : added > endPoint - 1.5
        ? "Add one drop (0.05 cm³)"
        : "Run in 1.00 cm³";

  const onPrimary = useCallback(() => {
    if (complete) {
      resetAll();
      return;
    }
    if (atEndPoint || overshot) {
      recordTitre();
      return;
    }
    runIn(added > endPoint - 1.5 ? 0.05 : 1);
  }, [added, atEndPoint, complete, endPoint, overshot, recordTitre, resetAll, runIn]);

  const buretteReading = initialReading + added;

  const controlPanel = (
    <div data-experiment-tour="titration-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Acid in the burette</span>
        <span className="text-[9px] font-bold text-slate-500">{acid.concentration.toFixed(3)} mol/dm³</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(Object.keys(ACIDS) as AcidId[]).map((id) => (
          <button
            key={id}
            onClick={() => {
              setAcidId(id);
              resetAll();
            }}
            disabled={demoActive}
            className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              acidId === id
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {ACIDS[id].formula}
          </button>
        ))}
      </div>

      <div className="mt-2.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Indicator</div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        {(Object.keys(INDICATORS) as IndicatorId[]).map((id) => (
          <button
            key={id}
            onClick={() => setIndicatorId(id)}
            disabled={demoActive}
            className="rounded-xl px-1 py-2 text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
            style={
              indicatorId === id
                ? { background: ACCENT.base, color: "#0f172a" }
                : { background: "rgba(255,255,255,0.06)", color: "#cbd5e1" }
            }
          >
            {INDICATORS[id].name}
          </button>
        ))}
      </div>
      <p className="mt-1.5 text-[9px] font-bold text-slate-400">
        {indicator.inAlkali} in alkali → {indicator.inAcid} in acid.
      </p>

      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <button
          onClick={() => runIn(1)}
          disabled={demoActive}
          className="rounded-xl px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
          style={{ background: ACCENT.base }}
        >
          Run in 1.00 cm³
        </button>
        <button
          onClick={() => runIn(0.05)}
          disabled={demoActive}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
        >
          One drop 0.05 cm³
        </button>
        <button
          onClick={runToNearEnd}
          disabled={demoActive}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
        >
          Run to near end point
        </button>
        <button
          onMouseDown={() => setSwirling(true)}
          onMouseUp={() => setSwirling(false)}
          onMouseLeave={() => setSwirling(false)}
          onTouchStart={() => setSwirling(true)}
          onTouchEnd={() => setSwirling(false)}
          disabled={demoActive}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-2 py-2 text-[9px] font-black uppercase tracking-wide text-slate-200 transition disabled:opacity-40"
        >
          Swirl the flask
        </button>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Initial</div>
          <div className="text-sm font-black text-white">{initialReading.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/[0.03] px-1 py-1.5">
          <div className="text-[8px] font-black uppercase text-slate-400">Reading</div>
          <div className="text-sm font-black text-white">{buretteReading.toFixed(2)}</div>
        </div>
        <div className="rounded-xl border px-1 py-1.5" style={{ borderColor: ACCENT.ring, background: ACCENT.soft }}>
          <div className="text-[8px] font-black uppercase" style={{ color: ACCENT.text }}>
            Titre
          </div>
          <div className="text-sm font-black text-white">{added.toFixed(2)}</div>
        </div>
      </div>

      <div
        className="mt-2 rounded-xl px-2 py-1.5 text-center text-[9px] font-black uppercase tracking-wide"
        style={
          overshot
            ? { background: "rgba(239,68,68,0.18)", color: "#fecaca" }
            : atEndPoint
              ? { background: "rgba(16,185,129,0.18)", color: "#a7f3d0" }
              : { background: "rgba(255,255,255,0.05)", color: "#94a3b8" }
        }
      >
        {overshot ? `Overshot — excess acid, discard and repeat` : atEndPoint ? "End point reached" : `Flask is ${indicator.inAlkali}`}
      </div>
    </div>
  );

  const resultsPanel = (
    <div data-experiment-tour="titration-results" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Titration table</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {titrations.length} runs
        </span>
      </div>
      {titrations.length === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Do a rough titration first, then two accurate ones.</p>
      ) : (
        <table className="mt-2 w-full text-[9px]">
          <thead>
            <tr className="text-slate-400">
              <th className="py-0.5 text-left font-black uppercase">Run</th>
              <th className="py-0.5 text-right font-black uppercase">Final</th>
              <th className="py-0.5 text-right font-black uppercase">Initial</th>
              <th className="py-0.5 text-right font-black uppercase">Titre</th>
            </tr>
          </thead>
          <tbody>
            {titrations.map((titration) => {
              const isConcordant = titration.label !== "Rough" && concordant.includes(titration.titre);
              return (
                <tr key={titration.id} className="border-t border-white/5" style={{ color: isConcordant ? "#a7f3d0" : "#cbd5e1" }}>
                  <td className="py-1 font-bold">{titration.label}</td>
                  <td className="py-1 text-right">{titration.final.toFixed(2)}</td>
                  <td className="py-1 text-right">{titration.initial.toFixed(2)}</td>
                  <td className="py-1 text-right font-black">{titration.titre.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <button
        onClick={recordTitre}
        disabled={added <= 0 || demoActive}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        Record this titre and refill
      </button>
      {meanTitre !== null ? (
        <p className="mt-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-2 text-[9px] font-bold text-emerald-100">
          Concordant titres average {meanTitre.toFixed(2)} cm³. The rough titre is left out of the average.
        </p>
      ) : (
        accurateTitres.length >= 1 && (
          <p className="mt-2 text-[9px] font-bold text-slate-500">
            No two accurate titres agree within {CONCORDANCE.toFixed(2)} cm³ yet — repeat the titration.
          </p>
        )
      )}
    </div>
  );

  const calculationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">The calculation</span>
      <div className="mt-2 space-y-1 text-[9px] font-bold text-slate-300">
        <p className="text-white">{acid.equation}</p>
        {meanTitre !== null && concentration !== null ? (
          <>
            <p>
              Moles of {acid.formula} = {acid.concentration.toFixed(3)} × {meanTitre.toFixed(2)} ÷ 1000 ={" "}
              {((acid.concentration * meanTitre) / 1000).toExponential(3)} mol
            </p>
            <p>
              Mole ratio {acid.formula} : NaOH = 1 : {acid.basicity}, so moles of NaOH ={" "}
              {(((acid.concentration * meanTitre) / 1000) * acid.basicity).toExponential(3)} mol
            </p>
            <p>
              Concentration of NaOH = moles ÷ 0.025 dm³ ={" "}
              <span className="text-white">{concentration.toFixed(3)} mol/dm³</span>
            </p>
            <p>
              In g/dm³: × 40 = <span className="text-white">{(concentration * 40).toFixed(1)} g/dm³</span>
            </p>
          </>
        ) : (
          <>
            <p>1. Moles of acid = concentration × titre ÷ 1000</p>
            <p>2. Use the equation to get the moles of alkali</p>
            <p>3. Concentration of alkali = moles ÷ (25.0 ÷ 1000)</p>
            <p>4. For g/dm³, multiply by the relative formula mass (NaOH = 40)</p>
          </>
        )}
      </div>
    </div>
  );

  const fillFraction = 0.6;

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Titration Bench"
          subtitle="Find the concentration of the sodium hydroxide"
          symbol="⚗️"
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

      <div data-experiment-tour="titration-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.2, 3.05, 2.2], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <TitrationScene
            volumeLeft={BURETTE_CAPACITY - buretteReading}
            tapOpen={tapOpen}
            flaskColour={flaskColour}
            fill={fillFraction}
            swirling={swirling}
            acid={acid}
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
            emoji="⚗️"
            cornerEmoji="💧"
            status={status}
            running={demoActive || tapOpen}
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
          title="Acid–Alkali Titration"
          tagline="Find the concentration of the sodium hydroxide"
          missions={TITRATION_MISSIONS}
          step={step}
          running={demoActive || tapOpen}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : atEndPoint ? "📝" : "💧"}
          onPrimary={onPrimary}
          primaryDisabled={demoActive}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "controls", label: "Burette", value: `${buretteReading.toFixed(2)} cm³`, content: controlPanel },
            { id: "results", label: "Titres", value: `${titrations.length}`, content: resultsPanel },
            { id: "calc", label: "Calc", value: meanTitre !== null ? `${meanTitre.toFixed(2)}` : "—", content: calculationPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "run", label: "1 cm³", onClick: () => runIn(1), disabled: demoActive, tone: "blue" },
            { id: "drop", label: "Drop", onClick: () => runIn(0.05), disabled: demoActive, tone: "green" },
            { id: "record", label: "Record", onClick: recordTitre, disabled: added <= 0 || demoActive, tone: "orange" },
          ]}
          panels={[
            { id: "controls", label: "Burette", value: `${buretteReading.toFixed(2)} cm³`, content: controlPanel },
            { id: "results", label: "Titres", value: `${titrations.length}`, content: resultsPanel },
            { id: "calc", label: "Calc", value: meanTitre !== null ? `${meanTitre.toFixed(2)}` : "—", content: calculationPanel },
          ]}
        />
      )}

      {showPaper && (
        <TitrationPaper
          acid={acid}
          indicator={indicator}
          titrations={titrations}
          meanTitre={meanTitre}
          concentration={concentration}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={titrationTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
