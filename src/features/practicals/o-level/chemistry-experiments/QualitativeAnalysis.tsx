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
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";

interface QualitativeAnalysisSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.violet;
const PAPER_FILENAME = "qualitative-analysis-of-ions.html";

/* ------------------------------------------------------------------ Science */

type Family = "cations" | "anions";

/** What a tube looks like after a reagent has been added. */
interface Outcome {
  /** Colour of the contents; null keeps the original solution colour. */
  colour: string | null;
  /** 0 = clear solution, 1 = dense precipitate. */
  precipitate: number;
  /** Bubbles of gas rising in the tube. */
  gas: boolean;
  observation: string;
}

interface CationTest {
  id: string;
  ion: string;
  formula: string;
  name: string;
  /** Colour of the original solution in the tube. */
  solutionColour: string;
  /** A few drops of sodium hydroxide solution. */
  naohLittle: Outcome;
  /** Sodium hydroxide added until it is in excess. */
  naohExcess: Outcome;
  /** A few drops of aqueous ammonia. */
  ammoniaLittle: Outcome;
  /** Aqueous ammonia added until it is in excess. */
  ammoniaExcess: Outcome;
  /** The single observation that pins this ion down. */
  keyPoint: string;
}

/**
 * Cation tests. The pattern that identifies the ion is not the first
 * precipitate on its own — it is whether that precipitate then dissolves when
 * more reagent is added. Pb²⁺ and Zn²⁺ both give a white precipitate soluble in
 * excess sodium hydroxide, so aqueous ammonia is what separates them.
 */
const CATIONS: CationTest[] = [
  {
    id: "na",
    ion: "Na⁺",
    formula: "NaCl(aq)",
    name: "Sodium",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: null, precipitate: 0, gas: false, observation: "No precipitate — the solution stays colourless." },
    naohExcess: { colour: null, precipitate: 0, gas: false, observation: "Still no precipitate." },
    ammoniaLittle: { colour: null, precipitate: 0, gas: false, observation: "No precipitate." },
    ammoniaExcess: { colour: null, precipitate: 0, gas: false, observation: "No precipitate." },
    keyPoint: "Group 1 hydroxides are soluble, so Na⁺ gives no precipitate with either reagent. A flame test is needed — sodium burns yellow.",
  },
  {
    id: "k",
    ion: "K⁺",
    formula: "KCl(aq)",
    name: "Potassium",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: null, precipitate: 0, gas: false, observation: "No precipitate." },
    naohExcess: { colour: null, precipitate: 0, gas: false, observation: "Still no precipitate." },
    ammoniaLittle: { colour: null, precipitate: 0, gas: false, observation: "No precipitate." },
    ammoniaExcess: { colour: null, precipitate: 0, gas: false, observation: "No precipitate." },
    keyPoint: "Like Na⁺, no precipitate with either reagent. Identify it by flame test — potassium burns lilac.",
  },
  {
    id: "ca",
    ion: "Ca²⁺",
    formula: "CaCl₂(aq)",
    name: "Calcium",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: "#f5f7fa", precipitate: 0.75, gas: false, observation: "White precipitate of calcium hydroxide forms." },
    naohExcess: { colour: "#f5f7fa", precipitate: 0.75, gas: false, observation: "White precipitate is INSOLUBLE in excess — it stays." },
    ammoniaLittle: { colour: null, precipitate: 0.05, gas: false, observation: "No precipitate (or only a very slight cloudiness)." },
    ammoniaExcess: { colour: null, precipitate: 0.05, gas: false, observation: "No precipitate." },
    keyPoint: "White precipitate with NaOH that does NOT dissolve in excess, and no precipitate with ammonia. Flame test is brick-red.",
  },
  {
    id: "nh4",
    ion: "NH₄⁺",
    formula: "NH₄Cl(aq)",
    name: "Ammonium",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: null, precipitate: 0, gas: false, observation: "No precipitate — but warm the tube and test the gas." },
    naohExcess: { colour: null, precipitate: 0, gas: true, observation: "On warming, ammonia gas is given off: pungent smell, and damp RED litmus turns BLUE." },
    ammoniaLittle: { colour: null, precipitate: 0, gas: false, observation: "No change — ammonia is already the reagent." },
    ammoniaExcess: { colour: null, precipitate: 0, gas: false, observation: "No change." },
    keyPoint: "The only cation that gives a GAS rather than a precipitate. NaOH + warming releases NH₃, which turns damp red litmus blue.",
  },
  {
    id: "cu",
    ion: "Cu²⁺",
    formula: "CuSO₄(aq)",
    name: "Copper(II)",
    solutionColour: "#4aa3d8",
    naohLittle: { colour: "#7fc4e8", precipitate: 0.8, gas: false, observation: "Light blue precipitate of copper(II) hydroxide." },
    naohExcess: { colour: "#7fc4e8", precipitate: 0.8, gas: false, observation: "Light blue precipitate is INSOLUBLE in excess." },
    ammoniaLittle: { colour: "#7fc4e8", precipitate: 0.8, gas: false, observation: "Light blue precipitate forms." },
    ammoniaExcess: { colour: "#1e3fd0", precipitate: 0, gas: false, observation: "Precipitate DISSOLVES in excess to give a DEEP BLUE solution." },
    keyPoint: "The deep blue solution in excess ammonia is unique to Cu²⁺ and is the definitive test.",
  },
  {
    id: "fe2",
    ion: "Fe²⁺",
    formula: "FeSO₄(aq)",
    name: "Iron(II)",
    solutionColour: "#9dc9a4",
    naohLittle: { colour: "#4f9b5c", precipitate: 0.8, gas: false, observation: "Green precipitate of iron(II) hydroxide." },
    naohExcess: { colour: "#4f9b5c", precipitate: 0.8, gas: false, observation: "Green precipitate is INSOLUBLE in excess. It slowly turns brown at the surface as it oxidises in air." },
    ammoniaLittle: { colour: "#4f9b5c", precipitate: 0.8, gas: false, observation: "Green precipitate forms." },
    ammoniaExcess: { colour: "#4f9b5c", precipitate: 0.8, gas: false, observation: "Green precipitate is INSOLUBLE in excess." },
    keyPoint: "GREEN precipitate, insoluble in excess of either reagent. Left standing it turns brown as Fe²⁺ oxidises to Fe³⁺.",
  },
  {
    id: "fe3",
    ion: "Fe³⁺",
    formula: "FeCl₃(aq)",
    name: "Iron(III)",
    solutionColour: "#c98a4b",
    naohLittle: { colour: "#8a4a1e", precipitate: 0.85, gas: false, observation: "Red-brown precipitate of iron(III) hydroxide." },
    naohExcess: { colour: "#8a4a1e", precipitate: 0.85, gas: false, observation: "Red-brown precipitate is INSOLUBLE in excess." },
    ammoniaLittle: { colour: "#8a4a1e", precipitate: 0.85, gas: false, observation: "Red-brown precipitate forms." },
    ammoniaExcess: { colour: "#8a4a1e", precipitate: 0.85, gas: false, observation: "Red-brown precipitate is INSOLUBLE in excess." },
    keyPoint: "RED-BROWN precipitate, insoluble in excess of either reagent. The colour alone separates it from Fe²⁺.",
  },
  {
    id: "pb",
    ion: "Pb²⁺",
    formula: "Pb(NO₃)₂(aq)",
    name: "Lead(II)",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate of lead(II) hydroxide." },
    naohExcess: { colour: null, precipitate: 0, gas: false, observation: "Precipitate DISSOLVES in excess to give a colourless solution." },
    ammoniaLittle: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate forms." },
    ammoniaExcess: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate is INSOLUBLE in excess ammonia." },
    keyPoint: "White, soluble in excess NaOH but INSOLUBLE in excess ammonia — that is what separates Pb²⁺ from Zn²⁺. Confirm with KI: a yellow precipitate of lead(II) iodide.",
  },
  {
    id: "zn",
    ion: "Zn²⁺",
    formula: "ZnSO₄(aq)",
    name: "Zinc",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate of zinc hydroxide." },
    naohExcess: { colour: null, precipitate: 0, gas: false, observation: "Precipitate DISSOLVES in excess to give a colourless solution." },
    ammoniaLittle: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate forms." },
    ammoniaExcess: { colour: null, precipitate: 0, gas: false, observation: "Precipitate DISSOLVES in excess ammonia to give a colourless solution." },
    keyPoint: "White, soluble in excess of BOTH reagents. Only Zn²⁺ behaves this way.",
  },
  {
    id: "al",
    ion: "Al³⁺",
    formula: "AlCl₃(aq)",
    name: "Aluminium",
    solutionColour: "#eaf4fb",
    naohLittle: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate of aluminium hydroxide." },
    naohExcess: { colour: null, precipitate: 0, gas: false, observation: "Precipitate DISSOLVES in excess to give a colourless solution." },
    ammoniaLittle: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate forms." },
    ammoniaExcess: { colour: "#f5f7fa", precipitate: 0.8, gas: false, observation: "White precipitate is INSOLUBLE in excess ammonia." },
    keyPoint: "Behaves like Pb²⁺ with these two reagents. Use the KI test to tell them apart — Al³⁺ gives no yellow precipitate.",
  },
];

interface AnionTest {
  id: string;
  ion: string;
  name: string;
  reagent: string;
  /** Why the sample is acidified before the reagent is added. */
  acidStep: string;
  outcome: Outcome;
  equation: string;
  keyPoint: string;
}

const ANIONS: AnionTest[] = [
  {
    id: "carbonate",
    ion: "CO₃²⁻",
    name: "Carbonate",
    reagent: "Dilute hydrochloric acid",
    acidStep: "No separate acidification — the acid IS the test.",
    outcome: { colour: null, precipitate: 0, gas: true, observation: "Rapid effervescence. The gas turns limewater milky, so it is carbon dioxide." },
    equation: "CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g)",
    keyPoint: "Fizzing with dilute acid, and the gas turns limewater milky. Always test carbonate FIRST, because carbonate also gives white precipitates in the sulfate and chloride tests.",
  },
  {
    id: "sulfate",
    ion: "SO₄²⁻",
    name: "Sulfate",
    reagent: "Barium chloride solution",
    acidStep: "Add dilute hydrochloric acid FIRST, to remove any carbonate — barium carbonate is also a white precipitate and would give a false positive.",
    outcome: { colour: "#f5f7fa", precipitate: 0.85, gas: false, observation: "Dense white precipitate of barium sulfate, which does not dissolve." },
    equation: "Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)",
    keyPoint: "White precipitate with acidified barium chloride. The acid is what makes the test reliable.",
  },
  {
    id: "chloride",
    ion: "Cl⁻",
    name: "Chloride",
    reagent: "Silver nitrate solution",
    acidStep: "Add dilute nitric acid FIRST, to remove carbonate. Nitric acid is used, not hydrochloric — hydrochloric acid would add chloride ions and guarantee a positive result.",
    outcome: { colour: "#f5f7fa", precipitate: 0.85, gas: false, observation: "White precipitate of silver chloride, which dissolves in aqueous ammonia and darkens in sunlight." },
    equation: "Ag⁺(aq) + Cl⁻(aq) → AgCl(s)",
    keyPoint: "White precipitate with acidified silver nitrate. Bromide gives a CREAM precipitate and iodide a YELLOW one.",
  },
  {
    id: "nitrate",
    ion: "NO₃⁻",
    name: "Nitrate",
    reagent: "Sodium hydroxide and aluminium foil",
    acidStep: "Make the solution alkaline with sodium hydroxide, then add aluminium foil and warm gently.",
    outcome: { colour: null, precipitate: 0, gas: true, observation: "Ammonia gas is given off on warming: pungent, and it turns damp RED litmus BLUE." },
    equation: "NO₃⁻ + Al + OH⁻ + H₂O → NH₃(g) + AlO₂⁻ (reduction of nitrate to ammonia)",
    keyPoint: "The aluminium reduces nitrate to ammonia. Check first that no ammonium ion is present, or the gas would come from that instead.",
  },
];

const MISSIONS: GameMission[] = [
  { short: "Sample", title: "Take the unknown", detail: "Put about 2 cm³ of the solution in a clean test tube. Use a fresh sample for every test — never test the same tube twice.", symbol: "🧪" },
  { short: "A little", title: "Add a little reagent", detail: "Add the reagent drop by drop and record the colour of any precipitate that forms.", symbol: "💧" },
  { short: "In excess", title: "Then add it in excess", detail: "Keep adding until the reagent is in excess. Whether the precipitate dissolves is often the deciding observation.", symbol: "🧫" },
  { short: "Identify", title: "Name the ion", detail: "Match your two observations against the pattern and name the ion.", symbol: "🔎" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Identifying an unknown salt",
    text: "Qualitative analysis finds out WHICH ions are present, not how much. Every salt has a cation and an anion, so you test for both.",
    mode: "modal",
  },
  {
    title: "Two reagents, four observations",
    text: "Add sodium hydroxide a little at a time, then in excess. Repeat with aqueous ammonia. Those four observations identify almost every cation on the syllabus.",
    mode: "bubble",
    selector: '[data-experiment-tour="qa-scene"]',
  },
  {
    title: "'Soluble in excess' is the key",
    text: "Pb²⁺, Zn²⁺ and Al³⁺ all give a white precipitate with sodium hydroxide. What separates them is what happens when you add more.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Anions need acid first",
    text: "Acidify before the sulfate and chloride tests, or a carbonate in the sample gives a white precipitate and a false positive.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** A test tube whose contents show the current stage of the test. */
function ReactionTube({
  x,
  label,
  sublabel,
  solutionColour,
  outcome,
  highlighted,
}: {
  x: number;
  label: string;
  sublabel: string;
  solutionColour: string;
  outcome: Outcome | null;
  highlighted: boolean;
}) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        x: (Math.random() - 0.5) * 0.06,
        y: 0.12 + (index / 8) * 0.34,
        z: (Math.random() - 0.5) * 0.06,
        size: 0.007 + Math.random() * 0.006,
      })),
    [],
  );

  const contentColour = outcome?.colour ?? solutionColour;
  const precipitate = outcome?.precipitate ?? 0;

  return (
    <group position={[x, BENCH_TOP_Y + 0.18, 0]}>
      {/* Glass */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.075, 0.075, 0.86, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          transparent
          opacity={0.2}
          transmission={0.82}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.075, 20, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshPhysicalMaterial color="#dbeafe" transparent opacity={0.22} transmission={0.82} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Solution */}
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.066, 0.066, 0.44, 20]} />
        <meshStandardMaterial
          color={contentColour}
          transparent
          opacity={0.42 + precipitate * 0.4}
          roughness={0.2 + precipitate * 0.6}
        />
      </mesh>

      {/* Precipitate settling at the bottom */}
      {precipitate > 0.1 && (
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.063, 0.05, 0.06 + precipitate * 0.08, 18]} />
          <meshStandardMaterial color={contentColour} roughness={0.95} />
        </mesh>
      )}

      {/* Gas bubbles */}
      {outcome?.gas &&
        bubbles.map((bubble, index) => (
          <mesh key={index} position={[bubble.x, bubble.y, bubble.z]}>
            <sphereGeometry args={[bubble.size, 8, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.72} />
          </mesh>
        ))}

      <Html position={[0, 1.02, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div
          className={`w-[104px] rounded-lg border px-1.5 py-1 text-center ${
            highlighted ? "border-violet-300/60 bg-violet-950/92" : "border-white/20 bg-slate-950/90"
          }`}
        >
          <div className="text-[8px] font-black uppercase leading-tight text-white">{label}</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-violet-300">{sublabel}</div>
        </div>
      </Html>
    </group>
  );
}

/** Dropping bottles of the two cation reagents plus the anion reagents. */
function ReagentShelf({ family, activeReagent }: { family: Family; activeReagent: string }) {
  const bottles =
    family === "cations"
      ? [
          { id: "naoh", label: "NaOH(aq)", colour: "#e8f0f8" },
          { id: "ammonia", label: "NH₃(aq)", colour: "#e6f6ef" },
        ]
      : [
          { id: "hcl", label: "HCl(aq)", colour: "#f2f6fa" },
          { id: "bacl2", label: "BaCl₂(aq)", colour: "#eef3f8" },
          { id: "agno3", label: "AgNO₃(aq)", colour: "#f6f2e8" },
          { id: "naoh-al", label: "NaOH + Al", colour: "#e8f0f8" },
        ];

  return (
    <group position={[0, BENCH_TOP_Y, -0.72]}>
      {bottles.map((bottle, index) => {
        const x = (index - (bottles.length - 1) / 2) * 0.32;
        const active = bottle.id === activeReagent;
        return (
          <group key={bottle.id} position={[x, 0, 0]}>
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.062, 0.062, 0.3, 18]} />
              <meshPhysicalMaterial color={bottle.colour} transparent opacity={0.45} transmission={0.5} roughness={0.15} />
            </mesh>
            {/* Dropper cap */}
            <mesh position={[0, 0.33, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.07, 12]} />
              <meshStandardMaterial color="#1f2937" roughness={0.8} />
            </mesh>
            <Html position={[0, 0.5, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <div
                className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase ${
                  active ? "border-violet-300/60 bg-violet-950/92 text-violet-100" : "border-white/15 bg-slate-950/85 text-slate-400"
                }`}
              >
                {bottle.label}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function TestTubeRack() {
  return (
    <group position={[0, BENCH_TOP_Y, 0]}>
      <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.12, 0.42]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, -0.16]} castShadow>
        <boxGeometry args={[1.5, 0.5, 0.06]} />
        <meshStandardMaterial color="#7a5636" roughness={0.7} />
      </mesh>
      {[-0.45, 0, 0.45].map((x) => (
        <mesh key={x} position={[x, 0.42, 0]} castShadow>
          <torusGeometry args={[0.085, 0.016, 10, 22]} />
          <meshStandardMaterial color="#8a6440" roughness={0.6} />
        </mesh>
      ))}
      {[-0.75, 0.75].map((x) => (
        <mesh key={x} position={[x, 0.24, 0]} castShadow>
          <boxGeometry args={[0.08, 0.36, 0.42]} />
          <meshStandardMaterial color="#7a5636" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function QualitativeScene({
  family,
  cation,
  anion,
  stage,
  activeReagent,
  mode,
  isMobile,
  moveVectorRef,
}: {
  family: Family;
  cation: CationTest;
  anion: AnionTest;
  stage: number;
  activeReagent: string;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [1.4, 3.2, 3.7] : [1.5, 3.0, 3.6];
    camera.position.set(...position);
    camera.lookAt(0, 2.05, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  /* Three tubes: the untouched sample, a little reagent, and reagent in excess. */
  const tubes =
    family === "cations"
      ? [
          { x: -0.45, label: "Sample", sublabel: cation.formula, outcome: null as Outcome | null },
          {
            x: 0,
            label: activeReagent === "naoh" ? "+ a little NaOH" : "+ a little NH₃",
            sublabel: stage >= 1 ? "drops added" : "not yet",
            outcome: stage >= 1 ? (activeReagent === "naoh" ? cation.naohLittle : cation.ammoniaLittle) : null,
          },
          {
            x: 0.45,
            label: activeReagent === "naoh" ? "+ excess NaOH" : "+ excess NH₃",
            sublabel: stage >= 2 ? "in excess" : "not yet",
            outcome: stage >= 2 ? (activeReagent === "naoh" ? cation.naohExcess : cation.ammoniaExcess) : null,
          },
        ]
      : [
          { x: -0.45, label: "Sample", sublabel: `contains ${anion.ion}`, outcome: null as Outcome | null },
          {
            x: 0,
            label: "Acidified",
            sublabel: stage >= 1 ? "acid added" : "not yet",
            outcome: stage >= 1 ? { colour: null, precipitate: 0, gas: anion.id === "carbonate", observation: "" } : null,
          },
          {
            x: 0.45,
            label: `+ ${anion.reagent.split(" ")[0]}`,
            sublabel: stage >= 2 ? "reagent added" : "not yet",
            outcome: stage >= 2 ? anion.outcome : null,
          },
        ];

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#7c3aed"
        benchColor="#f0eef6"
        posterA={{
          title: "CATION TESTS",
          lines: [
            "Add NaOH(aq) a little, then in excess",
            "Repeat with NH₃(aq)",
            "Cu²⁺: blue ppt → deep blue in excess NH₃",
            "Zn²⁺: white ppt, soluble in excess of BOTH",
          ],
        }}
        posterB={{
          title: "ANION TESTS",
          lines: [
            "CO₃²⁻: dilute acid → CO₂ → milky limewater",
            "SO₄²⁻: acidify, then BaCl₂ → white ppt",
            "Cl⁻: acidify with HNO₃, then AgNO₃ → white ppt",
            "NO₃⁻: NaOH + Al, warm → NH₃ gas",
          ],
        }}
      >
        <TestTubeRack />
        {tubes.map((tube) => (
          <ReactionTube
            key={tube.x}
            x={tube.x}
            label={tube.label}
            sublabel={tube.sublabel}
            solutionColour={family === "cations" ? cation.solutionColour : "#eaf4fb"}
            outcome={tube.outcome}
            highlighted={tube.outcome !== null}
          />
        ))}
        <ReagentShelf family={family} activeReagent={activeReagent} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.0, 0]} minDistance={1.8} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function QualitativePaper({ tested, onClose }: { tested: Record<string, boolean>; onClose: () => void }) {
  const testedCations = CATIONS.filter((cation) => tested[cation.id]);

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Qualitative Analysis: Identifying Cations and Anions</h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To identify the cation and the anion present in an unknown salt, using sodium hydroxide solution, aqueous
          ammonia and the standard anion tests.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Test tubes and rack, teat pipettes, sodium hydroxide solution, aqueous ammonia, dilute hydrochloric acid,
          dilute nitric acid, barium chloride solution, silver nitrate solution, aluminium foil, limewater, red and blue
          litmus paper, Bunsen burner, test-tube holder.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method — cations</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>About 2 cm³ of the unknown solution was placed in a clean test tube.</li>
          <li>Sodium hydroxide solution was added a few drops at a time and the observation recorded.</li>
          <li>More sodium hydroxide was added until it was in excess, and any change recorded.</li>
          <li>The procedure was repeated with a FRESH sample of the unknown, using aqueous ammonia.</li>
          <li>
            If no precipitate formed, the mixture was warmed and any gas tested with damp red litmus paper to check for
            ammonium ions.
          </li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Results — cations</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Cation</th>
              <th className="border border-slate-400 p-2">A little NaOH(aq)</th>
              <th className="border border-slate-400 p-2">Excess NaOH(aq)</th>
              <th className="border border-slate-400 p-2">A little NH₃(aq)</th>
              <th className="border border-slate-400 p-2">Excess NH₃(aq)</th>
            </tr>
          </thead>
          <tbody>
            {(testedCations.length > 0 ? testedCations : CATIONS).map((cation) => (
              <tr key={cation.id}>
                <td className="border border-slate-400 p-2 font-bold">
                  {cation.ion} <span className="font-normal">({cation.name})</span>
                </td>
                <td className="border border-slate-400 p-2">{cation.naohLittle.observation}</td>
                <td className="border border-slate-400 p-2">{cation.naohExcess.observation}</td>
                <td className="border border-slate-400 p-2">{cation.ammoniaLittle.observation}</td>
                <td className="border border-slate-400 p-2">{cation.ammoniaExcess.observation}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Method and results — anions</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Anion</th>
              <th className="border border-slate-400 p-2">Test</th>
              <th className="border border-slate-400 p-2">Positive result</th>
              <th className="border border-slate-400 p-2">Ionic equation</th>
            </tr>
          </thead>
          <tbody>
            {ANIONS.map((anion) => (
              <tr key={anion.id}>
                <td className="border border-slate-400 p-2 font-bold">
                  {anion.ion} <span className="font-normal">({anion.name})</span>
                </td>
                <td className="border border-slate-400 p-2">{anion.reagent}</td>
                <td className="border border-slate-400 p-2">{anion.outcome.observation}</td>
                <td className="border border-slate-400 p-2 font-mono text-xs">{anion.equation}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Tests for gases</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Carbon dioxide</td>
              <td className="border border-slate-400 p-2">Turns limewater milky</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Oxygen</td>
              <td className="border border-slate-400 p-2">Relights a glowing splint</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Hydrogen</td>
              <td className="border border-slate-400 p-2">Burns with a squeaky pop</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Ammonia</td>
              <td className="border border-slate-400 p-2">Pungent; turns damp red litmus blue</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Chlorine</td>
              <td className="border border-slate-400 p-2">Pale green; bleaches damp litmus paper white</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          A cation is identified from the colour of the hydroxide precipitate and whether it dissolves in excess reagent.
          Pb²⁺, Zn²⁺ and Al³⁺ all give a white precipitate that dissolves in excess sodium hydroxide, so aqueous ammonia
          must be used to separate them: the precipitate dissolves in excess ammonia only for Zn²⁺. Cu²⁺ is confirmed by
          the deep blue solution formed in excess ammonia. An anion is identified by the gas released or the precipitate
          formed with the appropriate reagent.
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Use a fresh sample for every test. Adding a second reagent to a tube that already contains one gives
            meaningless results.
          </li>
          <li>
            Always test for carbonate first, because carbonates give white precipitates with barium chloride and silver
            nitrate and would be mistaken for sulfate or chloride.
          </li>
          <li>
            Use dilute NITRIC acid before the silver nitrate test, never hydrochloric — hydrochloric acid adds chloride
            ions and guarantees a false positive.
          </li>
          <li>Add reagents slowly and drop by drop, or the precipitate may dissolve before it has been seen at all.</li>
          <li>
            Lead and barium compounds are toxic and silver nitrate stains skin; wear eye protection and wash any splashes
            off at once.
          </li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function QualitativeAnalysisSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: QualitativeAnalysisSimProps) {
  const [family, setFamily] = useState<Family>("cations");
  const [cationIndex, setCationIndex] = useState(4); // Cu²⁺ — a clear first example
  const [anionIndex, setAnionIndex] = useState(0);
  const [reagent, setReagent] = useState<"naoh" | "ammonia">("naoh");
  const [stage, setStage] = useState(0); // 0 = sample only, 1 = a little, 2 = excess
  const [tested, setTested] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const cation = CATIONS[cationIndex];
  const anion = ANIONS[anionIndex];

  const currentOutcome: Outcome | null =
    family === "cations"
      ? stage === 0
        ? null
        : stage === 1
          ? reagent === "naoh"
            ? cation.naohLittle
            : cation.ammoniaLittle
          : reagent === "naoh"
            ? cation.naohExcess
            : cation.ammoniaExcess
      : stage === 2
        ? anion.outcome
        : null;

  /* A cation counts as fully tested once both reagents have been taken to excess. */
  const markTested = useCallback(
    (id: string) => setTested((current) => (current[id] ? current : { ...current, [id]: true })),
    [],
  );

  useEffect(() => {
    if (stage < 2) return;
    markTested(family === "cations" ? cation.id : anion.id);
  }, [stage, family, cation.id, anion.id, markTested]);

  const advance = useCallback(() => setStage((current) => Math.min(current + 1, 2)), []);

  const resetTube = useCallback(() => setStage(0), []);

  const selectCation = useCallback((index: number) => {
    setDemoActive(false);
    setCationIndex(index);
    setStage(0);
  }, []);

  const selectAnion = useCallback((index: number) => {
    setDemoActive(false);
    setAnionIndex(index);
    setStage(0);
  }, []);

  const switchReagent = useCallback((next: "naoh" | "ammonia") => {
    setReagent(next);
    setStage(0);
  }, []);

  const switchFamily = useCallback((next: Family) => {
    setDemoActive(false);
    setFamily(next);
    setStage(0);
  }, []);

  const clearResults = useCallback(() => {
    setTested({});
    setStage(0);
    setDemoActive(false);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);
    setStage(0);
    setReagent("naoh");
  }, [demoActive]);

  /* The demo walks one ion through NaOH then ammonia, both to excess. */
  useEffect(() => {
    if (!demoActive) return;
    const timer = window.setTimeout(() => {
      if (stage < 2) {
        setStage((current) => current + 1);
        return;
      }
      if (family === "cations" && reagent === "naoh") {
        setReagent("ammonia");
        setStage(0);
        return;
      }
      setDemoActive(false);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [demoActive, stage, reagent, family]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const testedCount = Object.keys(tested).length;
  const total = CATIONS.length + ANIONS.length;
  const complete = testedCount >= total;
  const step = stage >= 2 ? 3 : stage;
  const progress = stage / 2;

  const activeReagentId =
    family === "cations" ? reagent : anion.id === "sulfate" ? "bacl2" : anion.id === "chloride" ? "agno3" : anion.id === "nitrate" ? "naoh-al" : "hcl";

  const status =
    family === "cations"
      ? stage === 0
        ? `A fresh 2 cm³ sample of ${cation.formula} is in the tube. Add ${reagent === "naoh" ? "sodium hydroxide" : "aqueous ammonia"} drop by drop.`
        : stage === 1
          ? `A little ${reagent === "naoh" ? "NaOH" : "NH₃"}: ${(reagent === "naoh" ? cation.naohLittle : cation.ammoniaLittle).observation}`
          : `In excess: ${(reagent === "naoh" ? cation.naohExcess : cation.ammoniaExcess).observation}`
      : stage === 0
        ? `Testing for ${anion.name.toLowerCase()} (${anion.ion}). ${anion.acidStep}`
        : stage === 1
          ? `Acidified. Now add the ${anion.reagent.toLowerCase()}.`
          : anion.outcome.observation;

  const observation = family === "cations" ? cation.keyPoint : anion.keyPoint;

  const primaryLabel =
    stage === 0
      ? family === "cations"
        ? `Add a little ${reagent === "naoh" ? "NaOH" : "NH₃"}`
        : "Acidify the sample"
      : stage === 1
        ? family === "cations"
          ? "Add until in excess"
          : `Add ${anion.reagent.split(" ")[0]}`
        : "Fresh sample";

  const onPrimary = () => {
    if (stage >= 2) {
      resetTube();
      return;
    }
    advance();
  };

  /* ------------------------------------------------------------ UI panels */

  const familyPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Test for</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(["cations", "anions"] as Family[]).map((item) => (
          <button
            key={item}
            onClick={() => switchFamily(item)}
            className="rounded-xl px-2 py-2 text-[10px] font-black transition"
            style={
              family === item
                ? { background: ACCENT.base, color: "#150a2e" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {item === "cations" ? "Cations (+)" : "Anions (−)"}
          </button>
        ))}
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">
        {family === "cations"
          ? "Positive ions, found with NaOH(aq) and NH₃(aq) — a little, then in excess."
          : "Negative ions, each with its own reagent. Test for carbonate first."}
      </div>
    </div>
  );

  const ionPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Unknown sample</span>
        <span className="text-[12px] font-black" style={{ color: ACCENT.text }}>
          {family === "cations" ? cation.ion : anion.ion}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-1">
        {family === "cations"
          ? CATIONS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => selectCation(index)}
                className="relative rounded-lg px-0.5 py-1.5 text-[9px] font-black transition"
                style={
                  index === cationIndex
                    ? { background: ACCENT.base, color: "#150a2e" }
                    : { background: "rgba(255,255,255,0.08)", color: tested[item.id] ? "#ddd6fe" : "#e2e8f0" }
                }
              >
                {item.ion}
                {tested[item.id] && index !== cationIndex && <span className="absolute right-0 top-0 text-[6px]">✓</span>}
              </button>
            ))
          : ANIONS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => selectAnion(index)}
                className="relative col-span-2 rounded-lg px-0.5 py-1.5 text-[9px] font-black transition first:col-span-2"
                style={
                  index === anionIndex
                    ? { background: ACCENT.base, color: "#150a2e" }
                    : { background: "rgba(255,255,255,0.08)", color: tested[item.id] ? "#ddd6fe" : "#e2e8f0" }
                }
              >
                {item.ion}
                {tested[item.id] && index !== anionIndex && <span className="absolute right-0 top-0 text-[6px]">✓</span>}
              </button>
            ))}
      </div>
      {family === "cations" && (
        <>
          <div className="mt-2.5 text-[10px] font-black uppercase tracking-wide text-slate-300">Reagent</div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {(["naoh", "ammonia"] as const).map((item) => (
              <button
                key={item}
                onClick={() => switchReagent(item)}
                className="rounded-xl px-2 py-2 text-[10px] font-black transition"
                style={
                  reagent === item
                    ? { background: ACCENT.base, color: "#150a2e" }
                    : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
                }
              >
                {item === "naoh" ? "NaOH(aq)" : "NH₃(aq)"}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const observationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Observation</div>
      <div className="mt-2 space-y-1.5">
        {family === "cations" ? (
          <>
            {[
              { label: `A little ${reagent === "naoh" ? "NaOH" : "NH₃"}`, outcome: reagent === "naoh" ? cation.naohLittle : cation.ammoniaLittle, at: 1 },
              { label: `Excess ${reagent === "naoh" ? "NaOH" : "NH₃"}`, outcome: reagent === "naoh" ? cation.naohExcess : cation.ammoniaExcess, at: 2 },
            ].map((row) => (
              <div key={row.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
                <div className="text-[9px] font-black uppercase" style={{ color: stage >= row.at ? ACCENT.text : "#64748b" }}>
                  {row.label}
                </div>
                <div className="mt-0.5 text-[10px] leading-snug text-white">
                  {stage >= row.at ? row.outcome.observation : "— not added yet —"}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
              <div className="text-[9px] font-black uppercase" style={{ color: stage >= 1 ? ACCENT.text : "#64748b" }}>
                Acidify first
              </div>
              <div className="mt-0.5 text-[10px] leading-snug text-white">{anion.acidStep}</div>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
              <div className="text-[9px] font-black uppercase" style={{ color: stage >= 2 ? ACCENT.text : "#64748b" }}>
                Add {anion.reagent}
              </div>
              <div className="mt-0.5 text-[10px] leading-snug text-white">
                {stage >= 2 ? anion.outcome.observation : "— not added yet —"}
              </div>
            </div>
            {stage >= 2 && (
              <div className="rounded-xl bg-slate-950/50 p-2 font-mono text-[9px] leading-snug text-violet-200">
                {anion.equation}
              </div>
            )}
          </>
        )}
      </div>
      {currentOutcome && (
        <div className="mt-2 rounded-xl p-2 text-[9px] leading-snug" style={{ background: ACCENT.soft, color: ACCENT.text }}>
          {family === "cations" ? cation.keyPoint : anion.keyPoint}
        </div>
      )}
    </div>
  );

  /** The whole cation table, which is what students actually have to learn. */
  const summaryPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Cation summary</span>
        <button onClick={clearResults} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-1.5 space-y-0.5">
        <div className="grid grid-cols-[34px_1fr_1fr] gap-1 text-[8px] font-black uppercase text-slate-500">
          <span>Ion</span>
          <span>Excess NaOH</span>
          <span>Excess NH₃</span>
        </div>
        {CATIONS.map((item) => {
          const naohDissolves = item.naohExcess.precipitate === 0 && item.naohLittle.precipitate > 0;
          const ammoniaDissolves = item.ammoniaExcess.precipitate === 0 && item.ammoniaLittle.precipitate > 0;
          const naohNone = item.naohLittle.precipitate === 0;
          return (
            <div
              key={item.id}
              className="grid grid-cols-[34px_1fr_1fr] gap-1 rounded-lg px-1 py-0.5 text-[9px]"
              style={item.id === cation.id ? { background: ACCENT.soft } : undefined}
            >
              <span className="font-black text-white">{item.ion}</span>
              <span className="truncate text-slate-300">
                {naohNone ? "no ppt" : naohDissolves ? "dissolves" : "stays"}
              </span>
              <span className="truncate text-slate-300">
                {item.ammoniaLittle.precipitate === 0
                  ? "no ppt"
                  : ammoniaDissolves
                    ? item.id === "cu"
                      ? "deep blue"
                      : "dissolves"
                    : "stays"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
        Pb²⁺, Zn²⁺ and Al³⁺ all dissolve in excess NaOH. Only Zn²⁺ also dissolves in excess ammonia.
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Qualitative Analysis"
          subtitle="which ions are in the unknown?"
          symbol="🧫"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to Chemistry experiments"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="qa-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1.5, 3.0, 3.6], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <QualitativeScene
            family={family}
            cation={cation}
            anion={anion}
            stage={stage}
            activeReagent={activeReagentId}
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
            cornerEmoji="💧"
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
          title="Qualitative Analysis"
          tagline="which ions are in the unknown?"
          missions={MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={stage >= 2 ? "↺" : "💧"}
          onPrimary={onPrimary}
          onReset={resetTube}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "family", label: "Type", value: family === "cations" ? "cation" : "anion", content: familyPanel },
            { id: "ion", label: "Ion", value: family === "cations" ? cation.ion : anion.ion, content: ionPanel },
            { id: "obs", label: "Result", value: `${stage}/2`, content: observationPanel },
            { id: "summary", label: "Table", value: `${testedCount}/${total}`, content: summaryPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: stage >= 2 ? "Fresh sample" : stage === 1 ? "In excess" : "Add reagent", onClick: onPrimary, tone: "green" },
            {
              id: "next",
              label: "Next ion",
              onClick: () =>
                family === "cations"
                  ? selectCation((cationIndex + 1) % CATIONS.length)
                  : selectAnion((anionIndex + 1) % ANIONS.length),
              tone: "orange",
            },
            { id: "reset", label: "Clear", onClick: clearResults, tone: "dark" },
          ]}
          panels={[
            { id: "family", label: "Type", value: family === "cations" ? "cation" : "anion", content: familyPanel },
            { id: "ion", label: "Ion", value: family === "cations" ? cation.ion : anion.ion, content: ionPanel },
            { id: "obs", label: "Result", value: `${stage}/2`, content: observationPanel },
            { id: "summary", label: "Table", value: `${testedCount}/${total}`, content: summaryPanel },
          ]}
        />
      )}

      {showPaper && <QualitativePaper tested={tested} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
