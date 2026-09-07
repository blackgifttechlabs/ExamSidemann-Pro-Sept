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

interface MicroscopySimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.indigo;
const PAPER_FILENAME = "preparing-and-observing-cell-slides.html";

/* ------------------------------------------------------------------ Science */

type SpecimenId = "onion" | "cheek";

interface Structure {
  id: string;
  label: string;
  /** Where the label line points, as a fraction of the field of view. */
  x: number;
  y: number;
  description: string;
}

interface Specimen {
  id: SpecimenId;
  name: string;
  short: string;
  kind: "plant" | "animal";
  stain: string;
  stainColour: string;
  /** Typical length of one cell, in micrometres. */
  cellLengthUm: number;
  cellWidthUm: number;
  structures: Structure[];
  absent: string[];
  prepSteps: { label: string; detail: string }[];
}

const SPECIMENS: Record<SpecimenId, Specimen> = {
  onion: {
    id: "onion",
    name: "Onion epidermis (plant cells)",
    short: "Onion",
    kind: "plant",
    stain: "Iodine solution",
    stainColour: "#b4763a",
    cellLengthUm: 250,
    cellWidthUm: 60,
    structures: [
      { id: "cellWall", label: "Cell wall", x: 0.5, y: 0.16, description: "A rigid layer of cellulose outside the membrane. It gives the cell its regular brick shape and supports the plant." },
      { id: "cellMembrane", label: "Cell membrane", x: 0.26, y: 0.42, description: "Pressed tightly against the inside of the cell wall. It controls what enters and leaves the cell." },
      { id: "cytoplasm", label: "Cytoplasm", x: 0.68, y: 0.34, description: "A thin layer just inside the wall, because the large vacuole fills most of the cell." },
      { id: "vacuole", label: "Large central vacuole", x: 0.5, y: 0.52, description: "A permanent sap-filled space that takes up most of the cell and helps keep it turgid." },
      { id: "nucleus", label: "Nucleus", x: 0.36, y: 0.66, description: "Stained darker by the iodine. It contains the chromosomes and controls the cell's activities." },
    ],
    absent: [
      "No chloroplasts — the onion epidermis is not green and never photosynthesises, so do NOT draw chloroplasts here.",
      "Cells are packed together in rows with no gaps between them.",
    ],
    prepSteps: [
      { label: "Peel one layer", detail: "Snap a piece of onion and use forceps to peel off a single, very thin layer of epidermis. One cell thick is what you want — a thick piece lets no light through." },
      { label: "Mount in water", detail: "Lay the peel flat on a clean slide in a drop of water. Make sure it is not folded over, or the cells overlap and cannot be seen clearly." },
      { label: "Add iodine stain", detail: "Add one drop of iodine solution. Stains make the nuclei and cell walls stand out — without a stain the cells are almost transparent." },
      { label: "Lower the coverslip", detail: "Rest the coverslip on a mounted needle at about 45° and lower it slowly. Lowering it slowly is what stops air bubbles being trapped." },
      { label: "Blot the edges", detail: "Blot away surplus stain with filter paper, so the slide is clean and the coverslip does not slide about." },
    ],
  },
  cheek: {
    id: "cheek",
    name: "Cheek cells (animal cells)",
    short: "Cheek",
    kind: "animal",
    stain: "Methylene blue",
    stainColour: "#3b5fc0",
    cellLengthUm: 60,
    cellWidthUm: 55,
    structures: [
      { id: "cellMembrane", label: "Cell membrane", x: 0.72, y: 0.3, description: "The only boundary of an animal cell. It is flexible, which is why the cell has an irregular shape." },
      { id: "cytoplasm", label: "Cytoplasm", x: 0.38, y: 0.36, description: "Fills most of the cell. It is where many chemical reactions of the cell take place." },
      { id: "nucleus", label: "Nucleus", x: 0.5, y: 0.5, description: "Stained deep blue by methylene blue, sitting roughly in the centre of the cell." },
    ],
    absent: [
      "No cell wall — that is why the cells are irregular in shape rather than brick-shaped.",
      "No chloroplasts and no large permanent vacuole.",
      "The cells lie separately in the smear, not packed in rows.",
    ],
    prepSteps: [
      { label: "Rinse your mouth", detail: "Rinse your mouth with clean water first, to wash away food particles that would clutter the slide." },
      { label: "Take the sample", detail: "Rub the inside of your cheek gently with a clean cotton bud. Use it once and put it straight into disinfectant afterwards." },
      { label: "Smear on the slide", detail: "Roll the bud gently across a clean slide to leave a thin smear. A thick smear gives a pile of overlapping cells." },
      { label: "Add methylene blue", detail: "Add one drop of methylene blue and leave it for a minute. It stains the nucleus deep blue so it can be seen." },
      { label: "Lower the coverslip", detail: "Lower the coverslip slowly from 45° with a mounted needle, then blot the edges with filter paper." },
    ],
  },
};

/** Eyepiece is ×10 on a standard school microscope. */
const EYEPIECE_MAGNIFICATION = 10;
const OBJECTIVES = [
  { magnification: 4, label: "×4", note: "Low power. Always start here — it has the widest field of view, so the specimen is easy to find." },
  { magnification: 10, label: "×10", note: "Medium power. Centre the part you want before you turn to high power." },
  { magnification: 40, label: "×40", note: "High power. Use the FINE focus only — the coarse knob can drive the objective into the slide." },
];

/** Field of view diameter in micrometres at each total magnification. */
const FIELD_OF_VIEW_UM: Record<number, number> = { 40: 4500, 100: 1800, 400: 450 };

/** Focus is correct in the middle of the range; either side of it the image blurs. */
const IDEAL_FOCUS = 55;
const FOCUS_TOLERANCE = 9;

function blurAmount(focus: number): number {
  const offset = Math.abs(focus - IDEAL_FOCUS);
  if (offset <= FOCUS_TOLERANCE) return 0;
  return Math.min(6, (offset - FOCUS_TOLERANCE) / 5);
}

/** Drawing conventions the examiner looks for in a biological drawing. */
const DRAWING_RULES = [
  "Use a sharp HB pencil, with clean single lines — never sketchy or double lines.",
  "Do not shade or colour in. Draw what you see, not what you remember from a textbook.",
  "Make the drawing large — at least half the space you are given.",
  "Draw only a few representative cells, and show the true proportions.",
  "Label lines must be straight, drawn with a ruler, and must not cross each other.",
  "Every label line must touch the structure it names, and labels go outside the drawing.",
  "Give the drawing a title, and state the magnification or a scale bar.",
];

const MISSIONS: GameMission[] = [
  { short: "Prepare", title: "Prepare the slide", detail: "Mount a thin piece of the specimen, stain it, and lower the coverslip slowly at 45° to avoid air bubbles.", symbol: "🔬" },
  { short: "Focus", title: "Find and focus", detail: "Start on the ×4 objective, focus with the coarse knob, then switch up and use the fine focus only.", symbol: "🎯" },
  { short: "Label", title: "Identify the structures", detail: "Find every structure in the field of view and label it correctly.", symbol: "🏷️" },
  { short: "Draw", title: "Draw and calculate", detail: "Make a labelled biological drawing to the conventions, and work out the magnification.", symbol: "✏️" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Looking at real cells",
    text: "You will prepare two slides — onion epidermis for plant cells and your own cheek cells for animal cells — then observe, draw and label them.",
    mode: "modal",
  },
  {
    title: "The microscope",
    text: "Light passes up through the slide, the objective lens and the eyepiece. Total magnification is the eyepiece magnification multiplied by the objective magnification.",
    mode: "bubble",
    selector: '[data-experiment-tour="microscopy-scene"]',
  },
  {
    title: "Prepare, then focus",
    text: "Work through the slide preparation steps in order, then adjust the focus until the cells are sharp. Always start on the lowest power objective.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Then draw it properly",
    text: "A biological drawing needs clean single pencil lines, no shading, ruled label lines that touch the structures, a title and a magnification.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** A school light microscope, with the turret turned to the chosen objective. */
function Microscope({ objectiveIndex, slideOnStage }: { objectiveIndex: number; slideOnStage: boolean }) {
  return (
    <group position={[-0.55, BENCH_TOP_Y + 0.02, 0]}>
      {/* Horseshoe base */}
      <mesh position={[0, 0.035, -0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.36, 0.07, 0.44]} />
        <meshStandardMaterial color="#2b2f36" metalness={0.4} roughness={0.55} />
      </mesh>
      {/* Curved arm */}
      <mesh position={[0, 0.52, -0.14]} castShadow>
        <boxGeometry args={[0.11, 0.9, 0.1]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.45} roughness={0.5} />
      </mesh>
      {/* Stage */}
      <mesh position={[0, 0.48, 0.06]} castShadow receiveShadow>
        <boxGeometry args={[0.34, 0.026, 0.3] } />
        <meshStandardMaterial color="#22262c" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Stage aperture */}
      <mesh position={[0, 0.48, 0.06]}>
        <cylinderGeometry args={[0.035, 0.035, 0.04, 18]} />
        <meshStandardMaterial color="#0b0d10" />
      </mesh>
      {/* Stage clips */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.5, 0.14]} castShadow>
          <boxGeometry args={[0.05, 0.012, 0.07]} />
          <meshStandardMaterial color="#9aa3ae" metalness={0.7} roughness={0.35} />
        </mesh>
      ))}
      {/* The slide on the stage */}
      {slideOnStage && (
        <>
          <mesh position={[0, 0.497, 0.06]}>
            <boxGeometry args={[0.26, 0.006, 0.11]} />
            <meshPhysicalMaterial color="#eaf4fb" transparent opacity={0.55} transmission={0.6} roughness={0.06} />
          </mesh>
          <mesh position={[0, 0.503, 0.06]}>
            <boxGeometry args={[0.07, 0.002, 0.07]} />
            <meshPhysicalMaterial color="#f4fbff" transparent opacity={0.6} roughness={0.05} />
          </mesh>
        </>
      )}

      {/* Objective turret */}
      <group position={[0, 0.62, 0.06]} rotation={[0, (objectiveIndex * Math.PI * 2) / 3, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.075, 0.075, 0.04, 20]} />
          <meshStandardMaterial color="#3a3f47" metalness={0.5} roughness={0.45} />
        </mesh>
        {OBJECTIVES.map((objective, index) => {
          const angle = (index / 3) * Math.PI * 2;
          const length = 0.06 + index * 0.028;
          return (
            <mesh
              key={objective.magnification}
              position={[Math.sin(angle) * 0.05, -0.03 - length / 2, Math.cos(angle) * 0.05]}
              castShadow
            >
              <cylinderGeometry args={[0.019, 0.015, length, 14]} />
              <meshStandardMaterial color={index === 2 ? "#b91c1c" : index === 1 ? "#1d4ed8" : "#eab308"} metalness={0.4} roughness={0.45} />
            </mesh>
          );
        })}
      </group>

      {/* Body tube and eyepiece */}
      <mesh position={[0, 0.82, 0.04]} rotation={[0.12, 0, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.34, 20]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.02, 0.015]} rotation={[0.12, 0, 0]} castShadow>
        <cylinderGeometry args={[0.042, 0.05, 0.11, 20]} />
        <meshStandardMaterial color="#22262c" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.075, 0.008]} rotation={[0.12, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.01, 20]} />
        <meshStandardMaterial color="#0e1116" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Coarse and fine focus knobs */}
      <mesh position={[0.09, 0.6, -0.14]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.035, 20]} />
        <meshStandardMaterial color="#22262c" metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0.105, 0.6, -0.14]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} />
        <meshStandardMaterial color="#4b5159" metalness={0.35} roughness={0.6} />
      </mesh>

      {/* Condenser, diaphragm and lamp under the stage */}
      <mesh position={[0, 0.4, 0.06]}>
        <cylinderGeometry args={[0.04, 0.05, 0.07, 18]} />
        <meshStandardMaterial color="#3a3f47" metalness={0.5} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.2, 0.06]}>
        <cylinderGeometry args={[0.055, 0.055, 0.05, 18]} />
        <meshStandardMaterial color="#22262c" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.16, 0.06]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshStandardMaterial color="#fff8e1" emissive="#fff3c4" emissiveIntensity={1.4} />
      </mesh>
      <pointLight position={[0, 0.3, 0.06]} intensity={1.6} distance={0.9} color="#fff6dc" />

      <Html position={[0, 1.32, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[122px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Light microscope</div>
          <div className="mt-0.5 text-[10px] font-black text-indigo-200">
            ×{EYEPIECE_MAGNIFICATION} × ×{OBJECTIVES[objectiveIndex].magnification} = ×
            {EYEPIECE_MAGNIFICATION * OBJECTIVES[objectiveIndex].magnification}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Slide-preparation bench: slides, coverslips, stains, forceps, onion, buds. */
function PreparationStation({ specimen, stepIndex }: { specimen: Specimen; stepIndex: number }) {
  return (
    <group position={[0.7, BENCH_TOP_Y + 0.02, 0]}>
      {/* White tile as a working surface */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[0.72, 0.03, 0.5] } />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* The slide being prepared */}
      <group position={[-0.08, 0.035, 0.04]}>
        <mesh>
          <boxGeometry args={[0.3, 0.006, 0.13]} />
          <meshPhysicalMaterial color="#eaf4fb" transparent opacity={0.6} transmission={0.55} roughness={0.06} />
        </mesh>
        {/* Specimen and stain build up as the steps are done */}
        {stepIndex >= 1 && (
          <mesh position={[0, 0.006, 0]}>
            <boxGeometry args={[0.075, 0.003, 0.075]} />
            <meshStandardMaterial
              color={specimen.kind === "plant" ? "#f0e7c8" : "#f2e4e4"}
              transparent
              opacity={0.85}
              roughness={0.5}
            />
          </mesh>
        )}
        {stepIndex >= 2 && (
          <mesh position={[0, 0.009, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.003, 20]} />
            <meshStandardMaterial color={specimen.stainColour} transparent opacity={0.55} roughness={0.3} />
          </mesh>
        )}
        {/* Coverslip, at 45° until it is lowered */}
        {stepIndex >= 3 ? (
          <mesh position={[0, 0.013, 0]}>
            <boxGeometry args={[0.08, 0.0016, 0.08]} />
            <meshPhysicalMaterial color="#f4fbff" transparent opacity={0.62} roughness={0.05} />
          </mesh>
        ) : (
          <mesh position={[0.07, 0.035, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.08, 0.0016, 0.08]} />
            <meshPhysicalMaterial color="#f4fbff" transparent opacity={0.6} roughness={0.05} />
          </mesh>
        )}
      </group>

      {/* Mounted needle */}
      <mesh position={[0.06, 0.06, -0.14]} rotation={[0, 0.4, -0.5]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.22, 10]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.8} />
      </mesh>
      <mesh position={[0.13, 0.032, -0.09]} rotation={[0, 0.4, -0.5]}>
        <cylinderGeometry args={[0.0015, 0.0015, 0.1, 6]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Forceps */}
      <mesh position={[-0.04, 0.036, -0.17]} rotation={[0, -0.25, 0]} castShadow>
        <boxGeometry args={[0.2, 0.005, 0.012]} />
        <meshStandardMaterial color="#9aa3ae" metalness={0.75} roughness={0.3} />
      </mesh>

      {/* Stain dropping bottle */}
      <group position={[0.24, 0.03, 0.16]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 18]} />
          <meshPhysicalMaterial color={specimen.stainColour} transparent opacity={0.6} transmission={0.35} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.185, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.06, 12]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </mesh>
        <Html position={[0, 0.34, 0]} center distanceFactor={6.5} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/92 px-2 py-0.5 text-[7px] font-black uppercase text-slate-200">
            {specimen.stain}
          </div>
        </Html>
      </group>

      {/* The specimen source: half an onion, or cotton buds in a pot */}
      {specimen.kind === "plant" ? (
        <group position={[-0.26, 0.03, -0.15]}>
          <mesh scale={[1, 0.72, 0.92]} castShadow>
            <sphereGeometry args={[0.085, 18, 14]} />
            <meshStandardMaterial color="#f0e2c4" roughness={0.8} />
          </mesh>
          {[0.7, 0.5, 0.3].map((scale) => (
            <mesh key={scale} scale={[scale, 0.72 * scale, 0.92 * scale]} position={[0, 0.001, 0]}>
              <sphereGeometry args={[0.085, 18, 14]} />
              <meshStandardMaterial color="#e6d6b4" roughness={0.85} wireframe />
            </mesh>
          ))}
        </group>
      ) : (
        <group position={[-0.26, 0.03, -0.15]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.1, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
          </mesh>
          {[-0.015, 0, 0.015].map((offset) => (
            <group key={offset} position={[offset, 0.14, 0]} rotation={[0, 0, offset * 8]}>
              <mesh>
                <cylinderGeometry args={[0.003, 0.003, 0.14, 8]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.012, 10, 8]} />
                <meshStandardMaterial color="#ffffff" roughness={1} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* Filter paper for blotting */}
      <mesh position={[0.24, 0.032, -0.15]} rotation={[-Math.PI / 2, 0, 0.2]}>
        <circleGeometry args={[0.07, 24]} />
        <meshStandardMaterial color="#f4f4f0" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      <Html position={[0, 0.36, 0.3]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[132px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Slide preparation</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-indigo-300">
            step {Math.min(stepIndex + 1, specimen.prepSteps.length)} of {specimen.prepSteps.length}
          </div>
        </div>
      </Html>
    </group>
  );
}

function MicroscopyScene({
  specimen,
  objectiveIndex,
  stepIndex,
  slideReady,
  mode,
  isMobile,
  moveVectorRef,
}: {
  specimen: Specimen;
  objectiveIndex: number;
  stepIndex: number;
  slideReady: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [1.3, 3.3, 3.5] : [1.4, 3.05, 3.4];
    camera.position.set(...position);
    camera.lookAt(0, 2.0, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 48;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#4f46e5"
        benchColor="#eeeff6"
        posterA={{
          title: "USING A MICROSCOPE",
          lines: [
            "Total magnification = eyepiece × objective",
            "Always start on the lowest power",
            "On high power use the FINE focus only",
            "Stains make structures visible",
          ],
        }}
        posterB={{
          title: "PLANT vs ANIMAL CELL",
          lines: [
            "Plant: cell wall, large vacuole, regular shape",
            "Animal: no wall, no large vacuole, irregular",
            "Both: nucleus, cytoplasm, cell membrane",
            "Onion epidermis has NO chloroplasts",
          ],
        }}
      >
        <Microscope objectiveIndex={objectiveIndex} slideOnStage={slideReady} />
        <PreparationStation specimen={specimen} stepIndex={stepIndex} />
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.98, 0]} minDistance={1.6} maxDistance={8} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------- The view down the eyepiece */

/**
 * The circular field of view. Cells are drawn as SVG so their outlines stay
 * crisp at any size, and so each structure can be a click target for labelling.
 */
function EyepieceView({
  specimen,
  totalMagnification,
  focus,
  slideReady,
  labelled,
  onLabel,
  size = 260,
}: {
  specimen: Specimen;
  totalMagnification: number;
  focus: number;
  slideReady: boolean;
  labelled: Record<string, boolean>;
  onLabel: (structureId: string) => void;
  size?: number;
}) {
  const blur = blurAmount(focus);
  const fieldUm = FIELD_OF_VIEW_UM[totalMagnification] ?? 1800;
  /** Pixels per micrometre in the drawn field. */
  const scale = size / fieldUm;
  const filterId = `eyepiece-blur-${specimen.id}-${totalMagnification}`;

  /* Cells laid out to fill the field of view at the current magnification. */
  const cells = useMemo(() => {
    if (specimen.kind === "plant") {
      const cellWidth = specimen.cellLengthUm * scale;
      const cellHeight = specimen.cellWidthUm * scale;
      const columns = Math.ceil(size / cellWidth) + 1;
      const rows = Math.ceil(size / cellHeight) + 1;
      const result: { x: number; y: number; w: number; h: number; offset: number }[] = [];
      for (let row = 0; row < rows; row += 1) {
        // Brickwork offset, so the cells look like a real epidermis.
        const offset = (row % 2) * cellWidth * 0.45;
        for (let column = -1; column < columns; column += 1) {
          result.push({
            x: column * cellWidth + offset,
            y: row * cellHeight,
            w: cellWidth,
            h: cellHeight,
            offset,
          });
        }
      }
      return result;
    }
    // Animal cells: scattered, irregular, not touching.
    const spacing = specimen.cellLengthUm * 1.9 * scale;
    const columns = Math.ceil(size / spacing) + 1;
    const rows = Math.ceil(size / spacing) + 1;
    const result: { x: number; y: number; w: number; h: number; offset: number }[] = [];
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        // A deterministic wobble keeps the layout stable between renders.
        const jitterX = ((row * 7 + column * 13) % 11) / 11 - 0.5;
        const jitterY = ((row * 11 + column * 5) % 9) / 9 - 0.5;
        result.push({
          x: column * spacing + jitterX * spacing * 0.5,
          y: row * spacing + jitterY * spacing * 0.5,
          w: specimen.cellLengthUm * scale * (0.85 + ((column + row) % 4) * 0.08),
          h: specimen.cellWidthUm * scale * (0.85 + ((column * 3 + row) % 4) * 0.08),
          offset: 0,
        });
      }
    }
    return result;
  }, [specimen, scale, size]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Down the eyepiece</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          ×{totalMagnification}
        </span>
      </div>

      <div className="relative mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={`View of ${specimen.name} at ×${totalMagnification}`}>
          <defs>
            <clipPath id={`field-${specimen.id}`}>
              <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} />
            </clipPath>
            <filter id={filterId}>
              <feGaussianBlur stdDeviation={blur} />
            </filter>
          </defs>

          {/* The illuminated circular field */}
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill={specimen.kind === "plant" ? "#fdf6e7" : "#f4f5fb"} />

          {!slideReady ? (
            <g clipPath={`url(#field-${specimen.id})`}>
              <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="#e8eaf0" />
              <text x={size / 2} y={size / 2} fill="#94a3b8" fontSize={11} fontWeight={700} textAnchor="middle">
                No slide on the stage
              </text>
            </g>
          ) : (
            <g clipPath={`url(#field-${specimen.id})`} filter={blur > 0 ? `url(#${filterId})` : undefined}>
              {specimen.kind === "plant"
                ? cells.map((cell, index) => (
                    <g key={index}>
                      {/* Cell wall + cytoplasm layer */}
                      <rect
                        x={cell.x}
                        y={cell.y}
                        width={cell.w}
                        height={cell.h}
                        rx={cell.h * 0.18}
                        fill="#f6e6c2"
                        stroke="#a8792f"
                        strokeWidth={2.2}
                      />
                      {/* Large central vacuole */}
                      <rect
                        x={cell.x + cell.w * 0.07}
                        y={cell.y + cell.h * 0.16}
                        width={cell.w * 0.86}
                        height={cell.h * 0.68}
                        rx={cell.h * 0.16}
                        fill="#fbf3de"
                        stroke="#cbb279"
                        strokeWidth={1}
                      />
                      {/* Nucleus, stained by the iodine, pressed against the wall */}
                      <ellipse
                        cx={cell.x + cell.w * 0.28}
                        cy={cell.y + cell.h * 0.5}
                        rx={Math.max(1.5, cell.h * 0.17)}
                        ry={Math.max(1.5, cell.h * 0.22)}
                        fill="#8a5a1c"
                        opacity={0.85}
                      />
                    </g>
                  ))
                : cells.map((cell, index) => (
                    <g key={index}>
                      {/* Irregular flattened cell — no cell wall, so a soft outline */}
                      <ellipse
                        cx={cell.x}
                        cy={cell.y}
                        rx={cell.w / 2}
                        ry={cell.h / 2}
                        fill="#dfe4f6"
                        stroke="#5f6fae"
                        strokeWidth={1.6}
                        transform={`rotate(${(index * 37) % 90} ${cell.x} ${cell.y})`}
                      />
                      {/* Nucleus, stained deep blue by methylene blue */}
                      <circle cx={cell.x} cy={cell.y} r={Math.max(1.5, cell.h * 0.17)} fill="#2f4699" opacity={0.9} />
                    </g>
                  ))}
            </g>
          )}

          {/* Rim of the field of view */}
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="none" stroke="#0b0f22" strokeWidth={4} />
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="none" stroke="#475569" strokeWidth={1} />

          {/* Label lines for the structures already identified */}
          {slideReady &&
            specimen.structures.map((structure) => {
              if (!labelled[structure.id]) return null;
              const px = structure.x * size;
              const py = structure.y * size;
              // Label boxes sit on whichever side the structure is nearer.
              const toRight = structure.x >= 0.5;
              const endX = toRight ? size - 6 : 6;
              return (
                <g key={structure.id}>
                  <line x1={px} y1={py} x2={endX} y2={py} stroke="#0b0f22" strokeWidth={2.5} />
                  <line x1={px} y1={py} x2={endX} y2={py} stroke="#e0e7ff" strokeWidth={1} />
                  <circle cx={px} cy={py} r={3} fill="#e0e7ff" stroke="#0b0f22" strokeWidth={1.5} />
                  <text
                    x={toRight ? endX - 2 : endX + 2}
                    y={py - 4}
                    fill="#e0e7ff"
                    fontSize={9}
                    fontWeight={800}
                    textAnchor={toRight ? "end" : "start"}
                    stroke="#0b0f22"
                    strokeWidth={2.6}
                    paintOrder="stroke"
                  >
                    {structure.label}
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Click targets for labelling — kept out of the SVG so they stay tappable */}
        {slideReady &&
          blur === 0 &&
          specimen.structures.map((structure) => (
            <button
              key={structure.id}
              onClick={() => onLabel(structure.id)}
              aria-label={`Label the ${structure.label}`}
              className="absolute grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[9px] font-black transition"
              style={{
                left: structure.x * size,
                top: structure.y * size,
                borderColor: labelled[structure.id] ? "rgba(224,231,255,0.9)" : ACCENT.ring,
                background: labelled[structure.id] ? "rgba(11,15,34,0.35)" : ACCENT.soft,
                color: "#e0e7ff",
              }}
            >
              {labelled[structure.id] ? "✓" : "?"}
            </button>
          ))}

        {blur > 0 && slideReady && (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
            <span className="rounded-full border border-white/20 bg-slate-950/85 px-2.5 py-1 text-[9px] font-black uppercase text-amber-200">
              out of focus — adjust the focus
            </span>
          </div>
        )}
      </div>

      <div className="mt-1.5 text-[10px] leading-snug text-slate-300">
        {!slideReady
          ? "Finish preparing the slide, then put it on the stage."
          : blur > 0
            ? "Turn the focus knob until the cell outlines are sharp."
            : `Field of view about ${fieldUm} µm across. Tap each marker to label the structure.`}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- Paper */

function MicroscopyPaper({
  specimen,
  totalMagnification,
  labelled,
  onClose,
}: {
  specimen: Specimen;
  totalMagnification: number;
  labelled: Record<string, boolean>;
  onClose: () => void;
}) {
  const drawnLengthMm = 50;
  const actualLengthMm = specimen.cellLengthUm / 1000;
  const drawingMagnification = drawnLengthMm / actualLengthMm;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Preparing and Observing a Slide of {specimen.kind === "plant" ? "Onion Epidermis Cells" : "Human Cheek Cells"}
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To prepare a temporary mount of {specimen.name.toLowerCase()}, observe the cells under the microscope, and make
          a labelled biological drawing.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Light microscope, microscope slides, coverslips, mounted needle, forceps, {specimen.stain.toLowerCase()},
          dropping pipette, filter paper, white tile,{" "}
          {specimen.kind === "plant" ? "an onion, scalpel" : "clean cotton buds, disinfectant, beaker of clean water"}.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          {specimen.prepSteps.map((step) => (
            <li key={step.label}>
              <strong>{step.label}.</strong> {step.detail}
            </li>
          ))}
          <li>
            The slide was placed on the stage and held with the stage clips, and the ×4 objective was turned into
            position.
          </li>
          <li>
            The coarse focus was used on low power to bring the cells into view, then the objective was changed to a
            higher power and the fine focus used to sharpen the image.
          </li>
          <li>A few representative cells were drawn and labelled, and the magnification recorded.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Safety</h2>
        <p>
          {specimen.kind === "plant"
            ? "Iodine solution stains skin and clothing. Cut the onion on a tile with the blade moving away from the fingers."
            : "Each person uses their own cotton bud once only, and puts it straight into disinfectant afterwards. Cotton buds are never shared."}
        </p>

        <h2 className="mt-5 font-bold uppercase">Observations</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Structure</th>
              <th className="border border-slate-400 p-2">Identified?</th>
              <th className="border border-slate-400 p-2">What it does</th>
            </tr>
          </thead>
          <tbody>
            {specimen.structures.map((structure) => (
              <tr key={structure.id}>
                <td className="border border-slate-400 p-2">{structure.label}</td>
                <td className="border border-slate-400 p-2 text-center">{labelled[structure.id] ? "Yes" : "—"}</td>
                <td className="border border-slate-400 p-2">{structure.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">What was NOT seen</h2>
        <ul className="list-disc space-y-1 pl-6">
          {specimen.absent.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>

        <h2 className="mt-5 font-bold uppercase">Magnification</h2>
        <p>
          Total magnification of the microscope = magnification of eyepiece × magnification of objective ={" "}
          {EYEPIECE_MAGNIFICATION} × {totalMagnification / EYEPIECE_MAGNIFICATION} = ×{totalMagnification}.
        </p>
        <p className="mt-2">
          For a drawing, magnification = length of drawing ÷ actual length of the specimen. One{" "}
          {specimen.kind === "plant" ? "epidermis" : "cheek"} cell is about {specimen.cellLengthUm} µm ={" "}
          {actualLengthMm} mm long. If that cell is drawn {drawnLengthMm} mm long, the drawing magnification is{" "}
          {drawnLengthMm} ÷ {actualLengthMm} = ×{Math.round(drawingMagnification)}.
        </p>
        <p className="mt-2">
          Rearranged, actual size = size of image ÷ magnification. Always convert to the same units first (1 mm = 1000
          µm).
        </p>

        <h2 className="mt-5 font-bold uppercase">Drawing conventions</h2>
        <ul className="list-disc space-y-1 pl-6">
          {DRAWING_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {specimen.kind === "plant"
            ? "Onion epidermis cells are regular and brick-shaped because each one is surrounded by a rigid cellulose cell wall. A large central vacuole pushes the cytoplasm into a thin layer around the edge, and the nucleus lies against the wall. There are no chloroplasts, because this layer of the onion is not green and does not photosynthesise."
            : "Cheek cells have no cell wall, so they are irregular in shape and flattened. Each has a cell membrane, cytoplasm and a nucleus stained blue by the methylene blue, but no large permanent vacuole and no chloroplasts. Comparing the two slides shows the differences between a typical plant cell and a typical animal cell."}
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            The specimen must be very thin — one cell thick if possible — because light has to pass through it for the
            cells to be seen.
          </li>
          <li>
            Air bubbles look like round black-edged circles and are easily mistaken for cells. Lowering the coverslip
            slowly from 45° avoids them.
          </li>
          <li>Too much stain darkens the whole field; one drop is enough, and the excess is blotted away.</li>
          <li>
            On high power the objective is very close to the slide, so only the fine focus should be used, and the
            objective should never be racked down while looking through the eyepiece.
          </li>
          <li>A temporary mount dries out, so it should be drawn soon after it is made.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function MicroscopySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MicroscopySimProps) {
  const [specimenId, setSpecimenId] = useState<SpecimenId>("onion");
  const [stepIndex, setStepIndex] = useState(0);
  const [objectiveIndex, setObjectiveIndex] = useState(0);
  const [focus, setFocus] = useState(20);
  const [labelledBySpecimen, setLabelledBySpecimen] = useState<Record<SpecimenId, Record<string, boolean>>>({
    onion: {},
    cheek: {},
  });
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const specimen = SPECIMENS[specimenId];
  const labelled = labelledBySpecimen[specimenId];
  /** The slide only goes on the stage once every preparation step is done. */
  const slideReady = stepIndex >= specimen.prepSteps.length - 1;
  const objective = OBJECTIVES[objectiveIndex];
  const totalMagnification = EYEPIECE_MAGNIFICATION * objective.magnification;
  const inFocus = blurAmount(focus) === 0;
  const labelledCount = specimen.structures.filter((structure) => labelled[structure.id]).length;
  const allLabelled = labelledCount === specimen.structures.length;

  const step = allLabelled ? 3 : slideReady && inFocus ? 2 : slideReady ? 1 : 0;
  const complete = allLabelled;
  const progress = slideReady
    ? inFocus
      ? 0.5 + (labelledCount / specimen.structures.length) * 0.5
      : 0.45
    : (stepIndex + 1) / specimen.prepSteps.length * 0.4;

  const labelStructure = useCallback(
    (structureId: string) => {
      setSelectedStructure(structureId);
      setLabelledBySpecimen((current) => ({
        ...current,
        [specimenId]: { ...current[specimenId], [structureId]: true },
      }));
    },
    [specimenId],
  );

  const nextPrepStep = useCallback(() => {
    setStepIndex((current) => Math.min(current + 1, specimen.prepSteps.length - 1));
  }, [specimen.prepSteps.length]);

  const switchSpecimen = useCallback((next: SpecimenId) => {
    setDemoActive(false);
    setSpecimenId(next);
    setStepIndex(0);
    setObjectiveIndex(0);
    setFocus(20);
    setSelectedStructure(null);
  }, []);

  const resetAll = useCallback(() => {
    setDemoActive(false);
    setStepIndex(0);
    setObjectiveIndex(0);
    setFocus(20);
    setSelectedStructure(null);
    setLabelledBySpecimen((current) => ({ ...current, [specimenId]: {} }));
  }, [specimenId]);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);
    setStepIndex(0);
    setObjectiveIndex(0);
    setFocus(20);
    setLabelledBySpecimen((current) => ({ ...current, [specimenId]: {} }));
  }, [demoActive, specimenId]);

  /* Walk the demo through preparation, focusing and labelling. */
  useEffect(() => {
    if (!demoActive) return;
    const timer = window.setTimeout(() => {
      if (stepIndex < specimen.prepSteps.length - 1) {
        setStepIndex((current) => current + 1);
        return;
      }
      if (objectiveIndex < 1) {
        setObjectiveIndex((current) => current + 1);
        return;
      }
      if (!inFocus) {
        setFocus(IDEAL_FOCUS);
        return;
      }
      const next = specimen.structures.find((structure) => !labelled[structure.id]);
      if (next) {
        labelStructure(next.id);
        return;
      }
      setDemoActive(false);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [demoActive, stepIndex, objectiveIndex, inFocus, specimen, labelled, labelStructure]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = !slideReady
    ? `Step ${stepIndex + 1} of ${specimen.prepSteps.length}: ${specimen.prepSteps[stepIndex].label}. ${specimen.prepSteps[stepIndex].detail}`
    : !inFocus
      ? `Slide is on the stage at ×${totalMagnification}, but the image is blurred. Turn the focus knob.`
      : allLabelled
        ? `All ${specimen.structures.length} structures labelled on the ${specimen.short.toLowerCase()} slide. Now make your drawing to the conventions.`
        : `Sharp image at ×${totalMagnification}. ${labelledCount} of ${specimen.structures.length} structures labelled — tap the markers.`;

  const observation = allLabelled
    ? specimen.kind === "plant"
      ? "Regular brick shapes, a rigid cell wall and a large central vacuole — the signs of a plant cell."
      : "Irregular shape with no cell wall and no large vacuole — the signs of an animal cell."
    : slideReady
      ? "Compare the two slides once you have done both: shape, cell wall, vacuole."
      : "A thin specimen, one drop of stain, and a coverslip lowered slowly — that is the whole skill.";

  const primaryLabel = !slideReady
    ? `Do step ${stepIndex + 2}: ${specimen.prepSteps[Math.min(stepIndex + 1, specimen.prepSteps.length - 1)].label}`
    : !inFocus
      ? "Focus the microscope"
      : !allLabelled
        ? "Label the next structure"
        : specimenId === "onion"
          ? "Now do the cheek cells"
          : "Now do the onion cells";

  const onPrimary = () => {
    if (!slideReady) {
      nextPrepStep();
      return;
    }
    if (!inFocus) {
      setFocus(IDEAL_FOCUS);
      return;
    }
    const next = specimen.structures.find((structure) => !labelled[structure.id]);
    if (next) {
      labelStructure(next.id);
      return;
    }
    switchSpecimen(specimenId === "onion" ? "cheek" : "onion");
  };

  /* ------------------------------------------------------------ UI panels */

  const specimenPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Specimen</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(Object.keys(SPECIMENS) as SpecimenId[]).map((id) => {
          const done = SPECIMENS[id].structures.every((structure) => labelledBySpecimen[id][structure.id]);
          return (
            <button
              key={id}
              onClick={() => switchSpecimen(id)}
              className="relative rounded-xl px-2 py-2 text-[10px] font-black transition"
              style={
                specimenId === id
                  ? { background: ACCENT.base, color: "#0b1035" }
                  : { background: "rgba(255,255,255,0.08)", color: done ? "#c7d2fe" : "#e2e8f0" }
              }
            >
              {SPECIMENS[id].short}
              {done && specimenId !== id && <span className="absolute right-1 top-0.5 text-[7px]">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
        {specimen.name} · stained with {specimen.stain.toLowerCase()}. One cell is about {specimen.cellLengthUm} µm long.
      </div>
    </div>
  );

  const prepPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Slide preparation</div>
      <div className="mt-2 space-y-1">
        {specimen.prepSteps.map((prepStep, index) => {
          const done = stepIndex >= index;
          const current = stepIndex === index;
          return (
            <button
              key={prepStep.label}
              onClick={() => setStepIndex(index)}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition"
              style={{
                background: current ? ACCENT.soft : "rgba(255,255,255,0.04)",
                border: `1px solid ${current ? ACCENT.ring : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-black"
                style={{ background: done ? ACCENT.base : "rgba(255,255,255,0.1)", color: done ? "#0b1035" : "#94a3b8" }}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className="min-w-0 text-[10px] font-black text-white">{prepStep.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
        {specimen.prepSteps[stepIndex].detail}
      </div>
    </div>
  );

  const microscopePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Objective lens</span>
        <span className="text-[11px] font-black" style={{ color: ACCENT.text }}>
          ×{totalMagnification} total
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {OBJECTIVES.map((item, index) => (
          <button
            key={item.magnification}
            onClick={() => setObjectiveIndex(index)}
            className="rounded-xl px-1 py-2 text-[10px] font-black transition"
            style={
              index === objectiveIndex
                ? { background: ACCENT.base, color: "#0b1035" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">{objective.note}</div>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Focus</span>
        <span
          className="rounded-full px-2 py-0.5 text-[9px] font-black"
          style={inFocus ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(245,158,11,0.2)", color: "#fde68a" }}
        >
          {inFocus ? "sharp" : "blurred"}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={focus}
        onChange={(event) => setFocus(Number(event.target.value))}
        aria-label="Focus knob"
        className="mt-1.5 w-full accent-indigo-400"
      />
      <div className="mt-1 flex justify-between text-[8px] font-black uppercase text-slate-500">
        <span>objective low</span>
        <span>objective high</span>
      </div>
    </div>
  );

  const eyepiecePanel = (
    <EyepieceView
      specimen={specimen}
      totalMagnification={totalMagnification}
      focus={focus}
      slideReady={slideReady}
      labelled={labelled}
      onLabel={labelStructure}
      size={isMobileViewport ? 250 : 262}
    />
  );

  const labelPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Structures</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {labelledCount}/{specimen.structures.length}
        </span>
      </div>
      <div className="mt-2 space-y-1">
        {specimen.structures.map((structure) => {
          const found = Boolean(labelled[structure.id]);
          return (
            <button
              key={structure.id}
              onClick={() => setSelectedStructure(structure.id)}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition"
              style={{
                background: selectedStructure === structure.id ? ACCENT.soft : "rgba(255,255,255,0.04)",
                border: `1px solid ${selectedStructure === structure.id ? ACCENT.ring : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[9px] font-black"
                style={{ background: found ? ACCENT.base : "rgba(255,255,255,0.1)", color: found ? "#0b1035" : "#94a3b8" }}
              >
                {found ? "✓" : "?"}
              </span>
              <span className="min-w-0 truncate text-[10px] font-black text-white">{structure.label}</span>
            </button>
          );
        })}
      </div>
      {selectedStructure && (
        <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
          {specimen.structures.find((structure) => structure.id === selectedStructure)?.description}
        </div>
      )}
      <div className="mt-2 space-y-1 rounded-xl bg-amber-950/30 p-2">
        <div className="text-[9px] font-black uppercase text-amber-200">Not present here</div>
        {specimen.absent.map((note) => (
          <div key={note} className="text-[9px] leading-snug text-amber-100/90">
            {note}
          </div>
        ))}
      </div>
    </div>
  );

  const magnificationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Magnification maths</div>
      <div className="mt-2 space-y-1.5 text-[9px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Eyepiece × objective</span>
          <span className="font-black" style={{ color: ACCENT.text }}>
            ×{EYEPIECE_MAGNIFICATION} × ×{objective.magnification} = ×{totalMagnification}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Actual cell length</span>
          <span className="font-black text-white">
            {specimen.cellLengthUm} µm = {(specimen.cellLengthUm / 1000).toFixed(3)} mm
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Field of view</span>
          <span className="font-black text-white">{FIELD_OF_VIEW_UM[totalMagnification] ?? "—"} µm across</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
          <span className="text-slate-400">If drawn 50 mm long</span>
          <span className="font-black" style={{ color: ACCENT.text }}>
            ×{Math.round(50 / (specimen.cellLengthUm / 1000))}
          </span>
        </div>
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
        magnification = size of image ÷ actual size. Rearranged: actual size = size of image ÷ magnification. Convert to
        the same units first — 1 mm = 1000 µm.
      </div>
    </div>
  );

  const drawingPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Drawing conventions</div>
      <ol className="mt-2 space-y-1">
        {DRAWING_RULES.map((rule, index) => (
          <li key={rule} className="flex gap-1.5 text-[9px] leading-snug text-slate-300">
            <span className="shrink-0 font-black" style={{ color: ACCENT.text }}>
              {index + 1}.
            </span>
            {rule}
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Microscopy Lab"
          subtitle="prepare · observe · draw · label"
          symbol="🔬"
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

      <div data-experiment-tour="microscopy-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1.4, 3.05, 3.4], fov: 48, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <MicroscopyScene
            specimen={specimen}
            objectiveIndex={objectiveIndex}
            stepIndex={stepIndex}
            slideReady={slideReady}
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
            emoji="🔬"
            cornerEmoji={specimen.kind === "plant" ? "🧅" : "🧑🏾"}
            status={status}
            running={demoActive}
            progress={progress}
            complete={complete}
          />
        )}

        {/* The eyepiece view floats over the bench on desktop — it is the point of the practical. */}
        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-auto absolute bottom-4 left-4 z-30 w-[300px]">{eyepiecePanel}</div>
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
          title="Microscopy & Cells"
          tagline="prepare · observe · draw · label"
          missions={MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={slideReady ? (inFocus ? "🏷️" : "🎯") : "🔬"}
          onPrimary={onPrimary}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "view", label: "Eyepiece", value: `×${totalMagnification}`, content: eyepiecePanel },
            { id: "specimen", label: "Specimen", value: specimen.short, content: specimenPanel },
            { id: "prep", label: "Prep", value: `${stepIndex + 1}/${specimen.prepSteps.length}`, content: prepPanel },
            { id: "scope", label: "Scope", value: inFocus ? "sharp" : "blur", content: microscopePanel },
            { id: "labels", label: "Labels", value: `${labelledCount}/${specimen.structures.length}`, content: labelPanel },
            { id: "maths", label: "Maths", value: `×${totalMagnification}`, content: magnificationPanel },
            { id: "drawing", label: "Drawing", value: "rules", content: drawingPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: !slideReady ? "Next step" : !inFocus ? "Focus" : "Label", onClick: onPrimary, tone: "green" },
            {
              id: "specimen",
              label: specimenId === "onion" ? "Cheek cells" : "Onion cells",
              onClick: () => switchSpecimen(specimenId === "onion" ? "cheek" : "onion"),
              tone: "orange",
            },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "view", label: "Eyepiece", value: `×${totalMagnification}`, content: eyepiecePanel },
            { id: "specimen", label: "Specimen", value: specimen.short, content: specimenPanel },
            { id: "prep", label: "Prep", value: `${stepIndex + 1}/${specimen.prepSteps.length}`, content: prepPanel },
            { id: "scope", label: "Scope", value: inFocus ? "sharp" : "blur", content: microscopePanel },
            { id: "labels", label: "Labels", value: `${labelledCount}/${specimen.structures.length}`, content: labelPanel },
            { id: "maths", label: "Maths", value: `×${totalMagnification}`, content: magnificationPanel },
            { id: "drawing", label: "Drawing", value: "rules", content: drawingPanel },
          ]}
        />
      )}

      {showPaper && (
        <MicroscopyPaper
          specimen={specimen}
          totalMagnification={totalMagnification}
          labelled={labelled}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
