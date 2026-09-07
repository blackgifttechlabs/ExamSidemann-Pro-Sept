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

interface LimitingFactorsSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.emerald;
const PAPER_FILENAME = "requirements-for-photosynthesis.html";

/* ------------------------------------------------------------------ Science */

type Investigation = "light" | "chlorophyll" | "carbonDioxide";

interface InvestigationSpec {
  id: Investigation;
  title: string;
  short: string;
  /** What is removed from the test leaf. */
  factorRemoved: string;
  setup: string;
  control: string;
  /** Where starch is found after the starch test. */
  result: string;
  conclusion: string;
  emoji: string;
}

const INVESTIGATIONS: Record<Investigation, InvestigationSpec> = {
  light: {
    id: "light",
    title: "Is light needed?",
    short: "Light",
    factorRemoved: "light",
    setup: "A strip of the leaf is covered on both surfaces with aluminium foil, then the plant stands in bright light for six hours.",
    control: "The uncovered part of the SAME leaf is the control — it has light, chlorophyll and carbon dioxide.",
    result: "The parts that were in the light go blue-black. The strip that was under the foil stays orange-brown.",
    conclusion:
      "Starch was only made where light reached the leaf, so light is needed for photosynthesis. Using one leaf means the two areas are identical in every other way.",
    emoji: "🔆",
  },
  chlorophyll: {
    id: "chlorophyll",
    title: "Is chlorophyll needed?",
    short: "Chlorophyll",
    factorRemoved: "chlorophyll",
    setup: "A variegated leaf is used — its green parts contain chlorophyll and its cream/white parts do not. The plant stands in bright light for six hours.",
    control: "The green parts of the same leaf act as the control.",
    result: "Only the parts that were green go blue-black. The cream parts stay orange-brown.",
    conclusion:
      "Starch was made only where chlorophyll was present, so chlorophyll is needed to absorb the light energy used in photosynthesis. Sketch the leaf BEFORE testing, because the colours are lost when the chlorophyll is removed.",
    emoji: "🍃",
  },
  carbonDioxide: {
    id: "carbonDioxide",
    title: "Is carbon dioxide needed?",
    short: "CO₂",
    factorRemoved: "carbon dioxide",
    setup: "The destarched plant is sealed under a bell jar with a dish of soda lime, which absorbs all the carbon dioxide from the air inside. It stands in bright light for six hours.",
    control: "An identical plant under a second bell jar with a dish of sodium hydrogencarbonate solution, which supplies carbon dioxide.",
    result: "The leaf from the soda lime jar stays orange-brown. The leaf from the control jar goes blue-black.",
    conclusion:
      "No starch was made when carbon dioxide was removed, so carbon dioxide is needed for photosynthesis. Both plants had light and chlorophyll, so carbon dioxide was the only difference.",
    emoji: "🫙",
  },
};

/** Which leaf is being tested — the experimental one or its control. */
type LeafChoice = "test" | "control";

/** Stages of the starch test, in the order they must be done. */
const TEST_STEPS = [
  {
    id: "boilWater",
    label: "Boil in water",
    detail: "Boiling in water for one minute kills the leaf, stops all enzyme reactions and breaks down the cell walls so reagents can get in.",
  },
  {
    id: "ethanol",
    label: "Boil in ethanol",
    detail: "The leaf is boiled in ethanol in a water bath to dissolve out the chlorophyll. The ethanol turns green and the leaf turns cream. The Bunsen must be turned OFF first — ethanol is highly flammable.",
  },
  {
    id: "rinse",
    label: "Rinse in hot water",
    detail: "Ethanol makes the leaf hard and brittle, so it is dipped in hot water to soften it and spread it out flat.",
  },
  {
    id: "iodine",
    label: "Add iodine",
    detail: "The leaf is spread on a white tile and covered with iodine solution. Blue-black shows starch; orange-brown shows no starch.",
  },
] as const;

type TestStepId = (typeof TEST_STEPS)[number]["id"];

/** Simulated hours of light exposure needed before starch can be detected. */
const REQUIRED_HOURS = 6;
const DESTARCH_HOURS = 48;

const MISSIONS: GameMission[] = [
  { short: "Destarch", title: "Destarch the plant", detail: "Keep the plant in a dark cupboard for 48 hours so it uses up all its stored starch. Without this the test proves nothing.", symbol: "🌑" },
  { short: "Set up", title: "Remove one factor", detail: "Cover part of a leaf with foil, choose a variegated leaf, or seal the plant over soda lime. Set up the control too.", symbol: "🔧" },
  { short: "Light", title: "Six hours in bright light", detail: "Leave the apparatus in bright light so that any leaf that CAN photosynthesise makes starch.", symbol: "💡" },
  { short: "Test", title: "Test the leaf for starch", detail: "Boil in water, boil in ethanol, rinse in hot water, then add iodine and read the pattern.", symbol: "🧪" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What does a plant need to photosynthesise?",
    text: "Photosynthesis makes glucose, which the leaf stores as starch. So if you can show that starch was made, photosynthesis happened. Remove one factor at a time and see whether starch still appears.",
    mode: "modal",
  },
  {
    title: "Destarch first — always",
    text: "A leaf already holds starch from earlier in the week. Two days in the dark uses that up, so any starch you find afterwards must have been made during your experiment.",
    mode: "bubble",
    selector: '[data-experiment-tour="limiting-scene"]',
  },
  {
    title: "Choose the factor to remove",
    text: "Foil removes light, a variegated leaf removes chlorophyll, and soda lime removes carbon dioxide. Each has its own control.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Then run the starch test",
    text: "Boil in water, boil in ethanol to remove the chlorophyll, rinse in hot water, add iodine. Blue-black means starch was made.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* -------------------------------------------------------- Leaf as a texture */

type LeafAppearance = "fresh" | "boiled" | "decolourised" | "stained";

/**
 * Draws the leaf on a canvas so the iodine pattern can be exact. The alpha
 * channel carries the leaf outline, so the plane it is mapped onto reads as a
 * leaf shape rather than a rectangle.
 */
function makeLeafTexture(
  investigation: Investigation,
  leaf: LeafChoice,
  appearance: LeafAppearance,
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const centreX = size / 2;
  const centreY = size / 2;
  const halfLength = size * 0.44;
  const halfWidth = size * 0.235;

  /** Pointed leaf outline (two quadratic curves meeting at tip and base). */
  const traceLeaf = (inset = 0) => {
    context.beginPath();
    context.moveTo(centreX, centreY - halfLength + inset);
    context.quadraticCurveTo(centreX + halfWidth - inset, centreY - halfLength * 0.35, centreX + halfWidth - inset, centreY + halfLength * 0.1);
    context.quadraticCurveTo(centreX + halfWidth - inset, centreY + halfLength * 0.75, centreX, centreY + halfLength - inset);
    context.quadraticCurveTo(centreX - halfWidth + inset, centreY + halfLength * 0.75, centreX - halfWidth + inset, centreY + halfLength * 0.1);
    context.quadraticCurveTo(centreX - halfWidth + inset, centreY - halfLength * 0.35, centreX, centreY - halfLength + inset);
    context.closePath();
  };

  // Base colour of the whole lamina at this stage of the test.
  const baseColour =
    appearance === "fresh"
      ? "#3f8f43"
      : appearance === "boiled"
        ? "#4b7a45"
        : appearance === "decolourised"
          ? "#efe6cf"
          : "#c47a2a"; // iodine's own orange-brown = no starch

  context.save();
  traceLeaf();
  context.clip();
  context.fillStyle = baseColour;
  context.fillRect(0, 0, size, size);

  /* Regions that differ from the rest of the leaf. */
  const starchColour = "#1b2352"; // iodine + starch = blue-black
  const noStarchColour = "#c47a2a";

  if (investigation === "light") {
    // A foil strip across the middle of the leaf.
    if (appearance === "stained") {
      // Everything except the covered strip made starch (control leaf: all of it).
      context.fillStyle = starchColour;
      context.fillRect(0, 0, size, size);
      if (leaf === "test") {
        context.fillStyle = noStarchColour;
        context.fillRect(0, centreY - size * 0.075, size, size * 0.15);
      }
    } else if (leaf === "test" && appearance !== "decolourised") {
      // The foil itself is still on the leaf before the test.
      context.fillStyle = "#c9ced6";
      context.fillRect(0, centreY - size * 0.075, size, size * 0.15);
    }
  }

  if (investigation === "chlorophyll") {
    // Variegated: green centre, cream margins. The control leaf is all green.
    const drawMargins = (colour: string) => {
      context.fillStyle = colour;
      context.save();
      traceLeaf();
      context.clip();
      context.fillRect(0, 0, size, size);
      context.restore();
      // Cut the green centre back in.
      context.fillStyle = appearance === "stained" ? starchColour : appearance === "decolourised" ? "#efe6cf" : baseColour;
      context.beginPath();
      context.ellipse(centreX, centreY, halfWidth * 0.58, halfLength * 0.82, 0, 0, Math.PI * 2);
      context.fill();
    };

    if (leaf === "test") {
      if (appearance === "fresh" || appearance === "boiled") {
        drawMargins("#e9e3c4"); // cream, chlorophyll-free margin
      } else if (appearance === "stained") {
        drawMargins(noStarchColour);
      } else {
        // Decolourised: the whole leaf is cream, the pattern is invisible.
        context.fillStyle = "#efe6cf";
        context.fillRect(0, 0, size, size);
      }
    } else if (appearance === "stained") {
      context.fillStyle = starchColour;
      context.fillRect(0, 0, size, size);
    }
  }

  if (investigation === "carbonDioxide" && appearance === "stained") {
    // Whole-leaf result: no starch without CO₂, starch throughout with it.
    context.fillStyle = leaf === "test" ? noStarchColour : starchColour;
    context.fillRect(0, 0, size, size);
  }

  /* Midrib and veins, drawn over whatever pattern is showing. */
  const veinColour =
    appearance === "stained"
      ? "rgba(20,20,30,0.30)"
      : appearance === "decolourised"
        ? "rgba(150,140,110,0.55)"
        : "rgba(230,245,225,0.55)";
  context.strokeStyle = veinColour;
  context.lineWidth = 7;
  context.beginPath();
  context.moveTo(centreX, centreY - halfLength * 0.92);
  context.lineTo(centreX, centreY + halfLength * 0.96);
  context.stroke();

  context.lineWidth = 3.4;
  for (let index = -4; index <= 4; index += 1) {
    if (index === 0) continue;
    const y = centreY + index * (halfLength / 5.5);
    context.beginPath();
    context.moveTo(centreX, y);
    context.quadraticCurveTo(centreX + halfWidth * 0.55, y + halfLength * 0.06, centreX + halfWidth * 0.9, y + halfLength * 0.16);
    context.stroke();
    context.beginPath();
    context.moveTo(centreX, y);
    context.quadraticCurveTo(centreX - halfWidth * 0.55, y + halfLength * 0.06, centreX - halfWidth * 0.9, y + halfLength * 0.16);
    context.stroke();
  }
  context.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/* ------------------------------------------------------------------ 3D bits */

function PottedPlant({
  position,
  variegated,
  foilStrip,
  inDark,
  label,
  tone,
}: {
  position: [number, number, number];
  variegated: boolean;
  foilStrip: boolean;
  inDark: boolean;
  label: string;
  tone: "emerald" | "slate";
}) {
  const leaves = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        angle: (index / 7) * Math.PI * 2 + 0.3,
        tilt: 0.5 + (index % 3) * 0.14,
        length: 0.2 + (index % 2) * 0.05,
        height: 0.34 + (index % 4) * 0.07,
      })),
    [],
  );

  const foliage = inDark ? "#3d6b40" : variegated ? "#4d9450" : "#3f9243";

  return (
    <group position={position}>
      {/* Terracotta pot */}
      <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.22, 20]} />
        <meshStandardMaterial color="#a4562f" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.225, 0]}>
        <cylinderGeometry args={[0.165, 0.165, 0.03, 20]} />
        <meshStandardMaterial color="#8d4526" roughness={0.85} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.225, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 20]} />
        <meshStandardMaterial color="#3a2b20" roughness={1} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.02, 0.34, 10]} />
        <meshStandardMaterial color="#4a7c3f" roughness={0.7} />
      </mesh>

      {leaves.map((leaf, index) => (
        <group key={index} position={[0, leaf.height + 0.18, 0]} rotation={[0, leaf.angle, leaf.tilt]}>
          <mesh position={[leaf.length, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <circleGeometry args={[leaf.length * 0.92, 18]} />
            <meshStandardMaterial color={foliage} roughness={0.72} side={THREE.DoubleSide} />
          </mesh>
          {/* Cream margin on a variegated plant */}
          {variegated && (
            <mesh position={[leaf.length, 0.004, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[leaf.length * 0.62, leaf.length * 0.92, 20]} />
              <meshStandardMaterial color="#e7e0bd" roughness={0.75} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      ))}

      {/* Foil wrapped across one leaf */}
      {foilStrip && (
        <group position={[0.2, 0.56, 0.03]} rotation={[Math.PI / 2, 0, 0.4]}>
          <mesh>
            <boxGeometry args={[0.3, 0.07, 0.012]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.75} roughness={0.32} />
          </mesh>
        </group>
      )}

      <Html position={[0, 0.98, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div
          className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[7px] font-black uppercase ${
            tone === "emerald" ? "border-emerald-300/40 bg-emerald-950/90 text-emerald-100" : "border-white/20 bg-slate-950/90 text-slate-200"
          }`}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

function BellJar({
  position,
  contents,
  label,
}: {
  position: [number, number, number];
  contents: "sodaLime" | "bicarbonate";
  label: string;
}) {
  return (
    <group position={position}>
      {/* Glass bell */}
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 1.2, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e6f2fa"
          transparent
          opacity={0.16}
          transmission={0.88}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.34, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#e6f2fa"
          transparent
          opacity={0.16}
          transmission={0.88}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Knob */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.05, 16, 12]} />
        <meshPhysicalMaterial color="#e6f2fa" transparent opacity={0.4} roughness={0.1} />
      </mesh>

      {/* Petri dish of soda lime or sodium hydrogencarbonate solution */}
      <group position={[0.17, 0.04, 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 20]} />
          <meshPhysicalMaterial color="#eef4fa" transparent opacity={0.45} roughness={0.15} />
        </mesh>
        <mesh position={[0, 0.014, 0]}>
          <cylinderGeometry args={[0.083, 0.083, 0.018, 20]} />
          <meshStandardMaterial
            color={contents === "sodaLime" ? "#e2e8ef" : "#cfe9f7"}
            roughness={contents === "sodaLime" ? 0.95 : 0.25}
            transparent={contents === "bicarbonate"}
            opacity={contents === "bicarbonate" ? 0.75 : 1}
          />
        </mesh>
      </group>

      {/* Greased seal on the base plate */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
        <meshStandardMaterial color="#4a4a52" roughness={0.6} />
      </mesh>

      <Html position={[0, 1.78, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[110px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">{label}</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-emerald-300">
            {contents === "sodaLime" ? "soda lime · no CO₂" : "NaHCO₃ · CO₂ supplied"}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Lamp above the bench; switched off while the plant is being destarched. */
function Lamp({ on }: { on: boolean }) {
  return (
    <group position={[-0.9, BENCH_TOP_Y + 1.55, 0.1]}>
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.2, 0.24, 20, 1, true]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.06, 14, 12]} />
        <meshStandardMaterial
          color={on ? "#fff8dc" : "#5b5b62"}
          emissive={on ? "#ffe9a8" : "#000000"}
          emissiveIntensity={on ? 1.6 : 0}
        />
      </mesh>
      {on && <pointLight position={[0, -0.2, 0]} intensity={9} distance={4.6} color="#fff3d0" />}
      {/* Support rod down to the bench */}
      <mesh position={[0.34, -0.5, -0.2]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, 1.1, 10]} />
        <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Water bath with a boiling tube of ethanol, used to decolourise the leaf. */
function EthanolBath({ stage }: { stage: TestStepId | null }) {
  const ethanolGreen = stage === "ethanol" || stage === "rinse" || stage === "iodine";
  const boiling = stage === "boilWater";

  return (
    <group position={[0.15, BENCH_TOP_Y, -0.35]}>
      {/* Beaker of hot water */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.4, 28, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.2}
          transmission={0.84}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.232, 0.232, 0.3, 28]} />
        <meshStandardMaterial color={boiling ? "#dff0f8" : "#dceaf3"} transparent opacity={0.55} roughness={0.2} />
      </mesh>
      {/* Steam when the water is boiling */}
      {boiling &&
        Array.from({ length: 5 }, (_, index) => (
          <mesh key={index} position={[(index - 2) * 0.05, 0.44 + (index % 3) * 0.07, 0.02]}>
            <sphereGeometry args={[0.03, 8, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.16} />
          </mesh>
        ))}

      {/* Boiling tube of ethanol standing in the bath */}
      <group position={[0.02, 0.36, 0.02]}>
        <mesh>
          <cylinderGeometry args={[0.055, 0.055, 0.5, 20, 1, true]} />
          <meshPhysicalMaterial color="#e8f2fa" transparent opacity={0.22} transmission={0.8} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.048, 0.048, 0.24, 20]} />
          <meshStandardMaterial
            color={ethanolGreen ? "#3e7d3a" : "#f2f8ff"}
            transparent
            opacity={ethanolGreen ? 0.8 : 0.42}
            roughness={0.2}
          />
        </mesh>
        <Html position={[0, 0.4, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="w-[104px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
            <div className="text-[8px] font-black uppercase leading-tight text-white">Ethanol</div>
            <div className="mt-0.5 text-[7px] font-black uppercase" style={{ color: ethanolGreen ? "#6ee7b7" : "#94a3b8" }}>
              {ethanolGreen ? "green — chlorophyll out" : "colourless"}
            </div>
          </div>
        </Html>
      </group>

      {/* Tripod and gauze */}
      <mesh position={[0, -0.01, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.014, 24]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.5} />
      </mesh>
      {[0, 2.1, 4.2].map((angle) => (
        <mesh key={angle} position={[Math.cos(angle) * 0.26, -0.16, Math.sin(angle) * 0.26]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 8]} />
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** The leaf laid on a white tile, textured to show the current test stage. */
function LeafOnTile({
  investigation,
  leafChoice,
  appearance,
  showIodine,
}: {
  investigation: Investigation;
  leafChoice: LeafChoice;
  appearance: LeafAppearance;
  showIodine: boolean;
}) {
  const texture = useMemo(
    () => makeLeafTexture(investigation, leafChoice, appearance),
    [investigation, leafChoice, appearance],
  );

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group position={[1.05, BENCH_TOP_Y + 0.02, 0.16]}>
      {/* White tile */}
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.03, 0.62]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Iodine film over the leaf */}
      {showIodine && (
        <mesh position={[0, 0.037, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.25, 28]} />
          <meshStandardMaterial color="#a1541a" transparent opacity={0.22} roughness={0.2} />
        </mesh>
      )}
      {/* The leaf itself */}
      <mesh position={[0, 0.033, 0]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial map={texture} transparent alphaTest={0.42} roughness={0.62} side={THREE.DoubleSide} />
      </mesh>

      <Html position={[0, 0.34, -0.34]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[118px] rounded-lg border border-white/20 bg-slate-950/90 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">
            {leafChoice === "test" ? "Test leaf" : "Control leaf"}
          </div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-emerald-300">
            {appearance === "fresh"
              ? "fresh"
              : appearance === "boiled"
                ? "boiled — cells killed"
                : appearance === "decolourised"
                  ? "decolourised"
                  : "iodine added"}
          </div>
        </div>
      </Html>
    </group>
  );
}

function LimitingFactorsScene({
  investigation,
  leafChoice,
  appearance,
  destarched,
  lightHours,
  stage,
  mode,
  isMobile,
  moveVectorRef,
}: {
  investigation: Investigation;
  leafChoice: LeafChoice;
  appearance: LeafAppearance;
  destarched: boolean;
  lightHours: number;
  stage: TestStepId | null;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [3.1, 3.5, 5.0] : [3.3, 3.3, 5.1];
    camera.position.set(...position);
    camera.lookAt(0, 2.1, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  const lampOn = destarched && lightHours > 0;
  const inDark = !destarched;

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#059669"
        benchColor="#eef3ef"
        posterA={{
          title: "PHOTOSYNTHESIS",
          lines: [
            "carbon dioxide + water → glucose + oxygen",
            "Needs light energy trapped by chlorophyll",
            "Glucose is stored in the leaf as starch",
            "Destarch the plant for 48 h in the dark first",
          ],
        }}
        posterB={{
          title: "STARCH TEST",
          lines: [
            "1. Boil in water — kills the leaf",
            "2. Boil in ethanol — removes chlorophyll",
            "3. Rinse in hot water — softens the leaf",
            "4. Iodine: blue-black = starch",
          ],
        }}
      >
        <Lamp on={lampOn} />

        {investigation === "carbonDioxide" ? (
          <>
            <group position={[-1.15, BENCH_TOP_Y, 0]}>
              <BellJar position={[0, 0, 0]} contents="sodaLime" label="Test plant" />
              <PottedPlant position={[0, 0.02, 0]} variegated={false} foilStrip={false} inDark={inDark} label="" tone="slate" />
            </group>
            <group position={[-0.05, BENCH_TOP_Y, 0.02]}>
              <BellJar position={[0, 0, 0]} contents="bicarbonate" label="Control plant" />
              <PottedPlant position={[0, 0.02, 0]} variegated={false} foilStrip={false} inDark={inDark} label="" tone="slate" />
            </group>
          </>
        ) : (
          <PottedPlant
            position={[-0.95, BENCH_TOP_Y, 0.05]}
            variegated={investigation === "chlorophyll"}
            foilStrip={investigation === "light"}
            inDark={inDark}
            label={investigation === "chlorophyll" ? "Variegated plant" : "Foil on one leaf"}
            tone="emerald"
          />
        )}

        <EthanolBath stage={stage} />
        <LeafOnTile investigation={investigation} leafChoice={leafChoice} appearance={appearance} showIodine={appearance === "stained"} />

        {/* Iodine dropping bottle */}
        <group position={[1.05, BENCH_TOP_Y + 0.02, -0.34]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 18]} />
            <meshPhysicalMaterial color="#c98a3d" transparent opacity={0.55} transmission={0.4} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.23, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.07, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.8} />
          </mesh>
          <Html position={[0, 0.4, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="whitespace-nowrap rounded-full border border-amber-300/40 bg-amber-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-amber-100">
              iodine solution
            </div>
          </Html>
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.05, 0]} minDistance={2.4} maxDistance={10} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function LimitingFactorsPaper({
  investigation,
  testedLeaves,
  onClose,
}: {
  investigation: Investigation;
  testedLeaves: Record<LeafChoice, boolean>;
  onClose: () => void;
}) {
  const spec = INVESTIGATIONS[investigation];
  const bothTested = testedLeaves.test && testedLeaves.control;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Investigating Whether {spec.factorRemoved === "light" ? "Light" : spec.factorRemoved === "chlorophyll" ? "Chlorophyll" : "Carbon Dioxide"} is Needed
          for Photosynthesis
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To find out whether a leaf can make starch when {spec.factorRemoved} is not available.</p>

        <h2 className="mt-5 font-bold uppercase">Principle</h2>
        <p>
          Photosynthesis makes glucose, which a leaf stores as starch. If starch is present after the experiment, then
          photosynthesis must have taken place. The plant is destarched first, so that any starch found was made during
          the investigation and not before it.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Destarched potted plant{investigation === "chlorophyll" ? " with variegated leaves" : ""}, bright lamp,
          {investigation === "light" ? " aluminium foil and paper clips," : ""}
          {investigation === "carbonDioxide" ? " two bell jars, soda lime, sodium hydrogencarbonate solution, petri dishes, vaseline," : ""} beaker
          of water, tripod, gauze, Bunsen burner, boiling tube of ethanol, forceps, white tile, iodine solution,
          dropping pipette.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The plant was kept in a dark cupboard for 48 hours to destarch it.</li>
          <li>{spec.setup}</li>
          <li>{spec.control}</li>
          <li>The apparatus was left in bright light for six hours.</li>
          <li>A leaf was removed and boiled in water for one minute to kill it and break down the cell walls.</li>
          <li>
            The Bunsen burner was turned off and the leaf was boiled in ethanol in a water bath until the ethanol turned
            green and the leaf turned cream. (Ethanol is flammable, so it must never be heated with a naked flame.)
          </li>
          <li>The brittle leaf was dipped in hot water to soften it and then spread out on a white tile.</li>
          <li>Iodine solution was dropped over the whole leaf and the colours recorded.</li>
          <li>The procedure was repeated with the control leaf.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">
                Whether {spec.factorRemoved} is available to the leaf
              </td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Presence of starch, shown by the colour with iodine</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Same plant species and age, same time in the light, same temperature, same destarching period, same
                starch-test procedure
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {!testedLeaves.test && !testedLeaves.control ? (
          <p className="italic">No leaves tested yet — run the starch test on the test leaf and the control leaf.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Part of leaf</th>
                <th className="border border-slate-400 p-2">{spec.factorRemoved} available?</th>
                <th className="border border-slate-400 p-2">Colour with iodine</th>
                <th className="border border-slate-400 p-2">Starch present?</th>
              </tr>
            </thead>
            <tbody>
              {testedLeaves.test && (
                <tr>
                  <td className="border border-slate-400 p-2">
                    {investigation === "light"
                      ? "Area under the foil"
                      : investigation === "chlorophyll"
                        ? "Cream (white) parts"
                        : "Leaf from the soda lime jar"}
                  </td>
                  <td className="border border-slate-400 p-2 text-center">No</td>
                  <td className="border border-slate-400 p-2">Orange-brown (iodine unchanged)</td>
                  <td className="border border-slate-400 p-2 text-center">No</td>
                </tr>
              )}
              {testedLeaves.control && (
                <tr>
                  <td className="border border-slate-400 p-2">
                    {investigation === "light"
                      ? "Area exposed to light"
                      : investigation === "chlorophyll"
                        ? "Green parts"
                        : "Leaf from the sodium hydrogencarbonate jar"}
                  </td>
                  <td className="border border-slate-400 p-2 text-center">Yes</td>
                  <td className="border border-slate-400 p-2">Blue-black</td>
                  <td className="border border-slate-400 p-2 text-center">Yes</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>{spec.conclusion}</p>
        {!bothTested && (
          <p className="mt-2 italic">
            Test both the experimental leaf and its control before writing a conclusion — one result on its own proves
            nothing.
          </p>
        )}

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>If the plant is not fully destarched, starch found at the end may have been there from the start.</li>
          <li>
            {investigation === "carbonDioxide"
              ? "The bell jars must be sealed with vaseline, or carbon dioxide leaks in and the test leaf may still make starch."
              : "The foil must cover both surfaces of the leaf, or light reaches the covered area from underneath."}
          </li>
          <li>Iodine gives a colour, not a quantity — this test shows whether starch is present, not how much.</li>
          <li>
            {investigation === "chlorophyll"
              ? "Draw and label the variegated pattern before testing, because the colours are destroyed by the ethanol."
              : "Six hours of light may not be enough on a dull day; a longer exposure gives a clearer result."}
          </li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function LimitingFactorsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: LimitingFactorsSimProps) {
  const [investigation, setInvestigation] = useState<Investigation>("light");
  const [leafChoice, setLeafChoice] = useState<LeafChoice>("test");
  const [destarchHours, setDestarchHours] = useState(0);
  const [lightHours, setLightHours] = useState(0);
  const [stepIndex, setStepIndex] = useState(-1); // -1 = starch test not started
  const [running, setRunning] = useState<"destarch" | "light" | null>(null);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [testedLeaves, setTestedLeaves] = useState<Record<LeafChoice, boolean>>({ test: false, control: false });

  const startRef = useRef(0);
  const baseRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const spec = INVESTIGATIONS[investigation];
  const destarched = destarchHours >= DESTARCH_HOURS;
  const exposed = lightHours >= REQUIRED_HOURS;
  const stage: TestStepId | null = stepIndex >= 0 ? TEST_STEPS[stepIndex].id : null;

  const appearance: LeafAppearance =
    stepIndex < 0
      ? "fresh"
      : stage === "boilWater"
        ? "boiled"
        : stage === "ethanol" || stage === "rinse"
          ? "decolourised"
          : "stained";

  /* Time-lapse for destarching and for the light exposure. */
  useEffect(() => {
    if (!running) return;
    const target = running === "destarch" ? DESTARCH_HOURS : REQUIRED_HOURS;
    const durationMs = running === "destarch" ? 5200 : 6400;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = Math.min(1, (now - startRef.current) / durationMs);
      const value = baseRef.current + fraction * (target - baseRef.current);
      if (running === "destarch") setDestarchHours(value);
      else setLightHours(value);
      if (fraction >= 1) {
        setRunning(null);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const beginPhase = useCallback(
    (phase: "destarch" | "light") => {
      baseRef.current = phase === "destarch" ? destarchHours : lightHours;
      startRef.current = performance.now();
      setRunning(phase);
    },
    [destarchHours, lightHours],
  );

  const nextTestStep = useCallback(() => {
    setStepIndex((current) => {
      const next = Math.min(current + 1, TEST_STEPS.length - 1);
      if (TEST_STEPS[next].id === "iodine") {
        setTestedLeaves((leaves) => ({ ...leaves, [leafChoice]: true }));
      }
      return next;
    });
  }, [leafChoice]);

  const resetLeaf = useCallback(() => {
    setStepIndex(-1);
  }, []);

  const resetAll = useCallback(() => {
    setRunning(null);
    setDemoActive(false);
    setDestarchHours(0);
    setLightHours(0);
    setStepIndex(-1);
    setTestedLeaves({ test: false, control: false });
  }, []);

  const selectInvestigation = useCallback((next: Investigation) => {
    setRunning(null);
    setDemoActive(false);
    setInvestigation(next);
    setLightHours(0);
    setStepIndex(-1);
    setLeafChoice("test");
    setTestedLeaves({ test: false, control: false });
  }, []);

  const selectLeaf = useCallback((next: LeafChoice) => {
    setLeafChoice(next);
    setStepIndex(-1);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(null);
      return;
    }
    // A full walkthrough: destarch, light, then the four test steps.
    setDemoActive(true);
    setDestarchHours(0);
    setLightHours(0);
    setStepIndex(-1);
    baseRef.current = 0;
    startRef.current = performance.now();
    setRunning("destarch");
  }, [demoActive]);

  /* Chain the demo through its phases. */
  useEffect(() => {
    if (!demoActive || running) return;
    if (destarchHours < DESTARCH_HOURS) return;
    if (lightHours < REQUIRED_HOURS) {
      baseRef.current = lightHours;
      startRef.current = performance.now();
      setRunning("light");
      return;
    }
    if (stepIndex >= TEST_STEPS.length - 1) {
      setDemoActive(false);
      return;
    }
    const timer = window.setTimeout(() => nextTestStep(), 1500);
    return () => window.clearTimeout(timer);
  }, [demoActive, running, destarchHours, lightHours, stepIndex, nextTestStep]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const step = !destarched ? 0 : !exposed ? 1 : stepIndex < 0 ? 2 : 3;
  const complete = testedLeaves.test && testedLeaves.control;
  const progress = !destarched
    ? destarchHours / DESTARCH_HOURS
    : !exposed
      ? lightHours / REQUIRED_HOURS
      : (stepIndex + 1) / TEST_STEPS.length;

  const status = !destarched
    ? running === "destarch"
      ? `In the dark cupboard: ${Math.round(destarchHours)} of ${DESTARCH_HOURS} hours. The plant is using up its stored starch.`
      : "The plant still holds starch from before. Destarch it for 48 hours in the dark, or your result will be meaningless."
    : !exposed
      ? running === "light"
        ? `Under the lamp: ${lightHours.toFixed(1)} of ${REQUIRED_HOURS} hours of bright light.`
        : `Destarched. ${spec.setup} Now switch on the lamp for ${REQUIRED_HOURS} hours.`
      : stepIndex < 0
        ? `Ready to test the ${leafChoice} leaf. Start with step 1: boil it in water.`
        : stage === "iodine"
          ? `${leafChoice === "test" ? "Test" : "Control"} leaf: ${spec.result}`
          : TEST_STEPS[stepIndex].detail;

  const observation = complete
    ? spec.conclusion
    : exposed
      ? `Tested so far: ${testedLeaves.test ? "test leaf ✓" : "test leaf —"}, ${testedLeaves.control ? "control leaf ✓" : "control leaf —"}. You need both.`
      : "Destarch, set up, then give the plant six hours of light before testing any leaf.";

  const primaryLabel = running
    ? running === "destarch"
      ? "Destarching…"
      : "In the light…"
    : !destarched
      ? "Destarch (48 h)"
      : !exposed
        ? "Switch on lamp (6 h)"
        : stepIndex < 0
          ? "Step 1: boil in water"
          : stepIndex < TEST_STEPS.length - 1
            ? `Step ${stepIndex + 2}: ${TEST_STEPS[stepIndex + 1].label}`
            : "Test the other leaf";

  const onPrimary = running
    ? () => setRunning(null)
    : !destarched
      ? () => beginPhase("destarch")
      : !exposed
        ? () => beginPhase("light")
        : stepIndex < TEST_STEPS.length - 1
          ? nextTestStep
          : () => selectLeaf(leafChoice === "test" ? "control" : "test");

  /* ------------------------------------------------------------ UI panels */

  const investigationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Factor to remove</div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {(Object.keys(INVESTIGATIONS) as Investigation[]).map((key) => (
          <button
            key={key}
            onClick={() => selectInvestigation(key)}
            className="rounded-xl px-1 py-2 text-[9px] font-black transition"
            style={
              investigation === key
                ? { background: ACCENT.base, color: "#04231a" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {INVESTIGATIONS[key].emoji} {INVESTIGATIONS[key].short}
          </button>
        ))}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{spec.setup}</div>
      <div className="mt-1.5 rounded-xl bg-emerald-950/40 p-2 text-[9px] leading-snug text-emerald-100">
        <span className="font-black uppercase">Control: </span>
        {spec.control}
      </div>
    </div>
  );

  const timelinePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Preparation</div>
      <div className="mt-2 space-y-2">
        <div>
          <div className="flex items-center justify-between text-[9px] font-black uppercase">
            <span className="text-slate-400">Destarch in the dark</span>
            <span style={{ color: destarched ? "#6ee7b7" : ACCENT.text }}>
              {Math.round(destarchHours)} / {DESTARCH_HOURS} h
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full rounded-full"
              style={{ width: `${(destarchHours / DESTARCH_HOURS) * 100}%`, background: destarched ? "#10b981" : "#475569" }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[9px] font-black uppercase">
            <span className="text-slate-400">Bright light</span>
            <span style={{ color: exposed ? "#6ee7b7" : ACCENT.text }}>
              {lightHours.toFixed(1)} / {REQUIRED_HOURS} h
            </span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-900">
            <div
              className="h-full rounded-full"
              style={{ width: `${(lightHours / REQUIRED_HOURS) * 100}%`, background: exposed ? "#10b981" : "#475569" }}
            />
          </div>
        </div>
      </div>
      {!destarched && (
        <div className="mt-2 rounded-xl bg-amber-950/40 p-2 text-[9px] leading-snug text-amber-100">
          Skipping the destarching is the most common mistake — any starch you find could be old.
        </div>
      )}
    </div>
  );

  const starchTestPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Starch test</span>
        <div className="flex gap-1">
          {(["test", "control"] as LeafChoice[]).map((choice) => (
            <button
              key={choice}
              onClick={() => selectLeaf(choice)}
              className="rounded-lg px-2 py-1 text-[9px] font-black transition"
              style={
                leafChoice === choice
                  ? { background: ACCENT.base, color: "#04231a" }
                  : { background: "rgba(255,255,255,0.08)", color: testedLeaves[choice] ? "#a7f3d0" : "#e2e8f0" }
              }
            >
              {choice === "test" ? "Test" : "Control"}
              {testedLeaves[choice] ? " ✓" : ""}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {TEST_STEPS.map((testStep, index) => {
          const done = stepIndex >= index;
          const current = stepIndex === index;
          return (
            <button
              key={testStep.id}
              onClick={() => exposed && setStepIndex(index)}
              disabled={!exposed}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition disabled:opacity-40"
              style={{
                background: current ? ACCENT.soft : "rgba(255,255,255,0.04)",
                border: `1px solid ${current ? ACCENT.ring : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-black"
                style={{ background: done ? ACCENT.base : "rgba(255,255,255,0.1)", color: done ? "#04231a" : "#94a3b8" }}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className="min-w-0 text-[10px] font-black text-white">{testStep.label}</span>
            </button>
          );
        })}
      </div>
      {stepIndex >= 0 && (
        <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
          {TEST_STEPS[stepIndex].detail}
        </div>
      )}
      {!exposed && (
        <div className="mt-2 text-[9px] leading-snug text-slate-500">
          Complete the destarching and the light exposure before testing a leaf.
        </div>
      )}
    </div>
  );

  const resultPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Iodine results</div>
      <div className="mt-2 space-y-1.5">
        {(
          [
            {
              label:
                investigation === "light"
                  ? "Covered by foil"
                  : investigation === "chlorophyll"
                    ? "Cream (no chlorophyll)"
                    : "Soda lime jar (no CO₂)",
              starch: false,
              tested: testedLeaves.test,
            },
            {
              label:
                investigation === "light"
                  ? "Exposed to light"
                  : investigation === "chlorophyll"
                    ? "Green (chlorophyll)"
                    : "NaHCO₃ jar (CO₂ present)",
              starch: true,
              tested: testedLeaves.control,
            },
          ] as { label: string; starch: boolean; tested: boolean }[]
        ).map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-2.5 py-2">
            <span className="text-[10px] font-black text-white">{row.label}</span>
            {row.tested ? (
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-black"
                style={
                  row.starch
                    ? { background: "rgba(30,41,120,0.5)", color: "#c7d2fe" }
                    : { background: "rgba(180,97,28,0.28)", color: "#fed7aa" }
                }
              >
                {row.starch ? "blue-black · starch" : "orange-brown · none"}
              </span>
            ) : (
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-[9px] font-black text-slate-400">not tested</span>
            )}
          </div>
        ))}
      </div>
      {complete && (
        <div className="mt-2 rounded-xl bg-emerald-950/40 p-2 text-[9px] leading-snug text-emerald-100">{spec.conclusion}</div>
      )}
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Photosynthesis Requirements"
          subtitle="light · chlorophyll · carbon dioxide"
          symbol="🌿"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          backLabel="Back to Biology experiments"
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="limiting-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [3.3, 3.3, 5.1], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <LimitingFactorsScene
            investigation={investigation}
            leafChoice={leafChoice}
            appearance={appearance}
            destarched={destarched}
            lightHours={lightHours}
            stage={stage}
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
            emoji="🌿"
            cornerEmoji={spec.emoji}
            status={status}
            running={running !== null}
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
          title="Needs for Photosynthesis"
          tagline="light · chlorophyll · carbon dioxide"
          missions={MISSIONS}
          step={step}
          running={running !== null}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : "▶"}
          onPrimary={onPrimary}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "factor", label: "Factor", value: spec.short, content: investigationPanel },
            { id: "prep", label: "Prep", value: destarched ? (exposed ? "ready" : "light") : "dark", content: timelinePanel },
            { id: "test", label: "Test", value: stepIndex < 0 ? "—" : `${stepIndex + 1}/4`, content: starchTestPanel },
            { id: "result", label: "Result", value: complete ? "done" : `${Number(testedLeaves.test) + Number(testedLeaves.control)}/2`, content: resultPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: running ? "Pause" : !destarched ? "Destarch" : !exposed ? "Lamp on" : "Next step", onClick: onPrimary, tone: running ? "red" : "green" },
            { id: "leaf", label: leafChoice === "test" ? "Control leaf" : "Test leaf", onClick: () => selectLeaf(leafChoice === "test" ? "control" : "test"), tone: "orange" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "factor", label: "Factor", value: spec.short, content: investigationPanel },
            { id: "prep", label: "Prep", value: destarched ? (exposed ? "ready" : "light") : "dark", content: timelinePanel },
            { id: "test", label: "Test", value: stepIndex < 0 ? "—" : `${stepIndex + 1}/4`, content: starchTestPanel },
            { id: "result", label: "Result", value: complete ? "done" : `${Number(testedLeaves.test) + Number(testedLeaves.control)}/2`, content: resultPanel },
          ]}
        />
      )}

      {showPaper && (
        <LimitingFactorsPaper investigation={investigation} testedLeaves={testedLeaves} onClose={onClosePaper} />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
