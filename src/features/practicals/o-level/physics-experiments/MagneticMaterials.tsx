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
import { BarMagnet } from "../../common/MagnetApparatus";
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";
import { labSounds } from "../../../../lib/audio/labSounds";

interface MagneticMaterialsSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.sky;
const PAPER_FILENAME = "testing-magnetic-materials.html";

/** Where the magnet holder starts and how close the hand brings it, in metres. */
const MAGNET_FAR_X = 0.95;
const MAGNET_NEAR_X = 0.2;
/** Nominal half-length of a specimen, used to find where it touches the pole. */
const SPECIMEN_HALF_LENGTH = 0.1;
/**
 * Scales the 1/r³ acceleration used for the attraction. Tuned so a specimen is
 * visibly still until the pole is a few centimetres away, then snaps across.
 */
const SPECIMEN_PULL = 0.0016;

/* ------------------------------------------------------------------ Science */

type Shape = "nail" | "clip" | "disc" | "coin" | "wire" | "block" | "sheet" | "bar";

interface Specimen {
  id: string;
  name: string;
  /** What the material is, for the results table. */
  material: string;
  magnetic: boolean;
  /** Ferromagnetic metals are attracted; a few of them are also permanent magnets. */
  isMagnet?: boolean;
  colour: string;
  metalness: number;
  roughness: number;
  shape: Shape;
  note: string;
}

/**
 * At O Level only four metals need to be remembered as magnetic — iron, steel
 * (an alloy of iron), cobalt and nickel — together with alloys containing them.
 * Every other common metal in the lab is not attracted at all, which is the
 * point of testing brass and copper alongside the steel.
 */
const SPECIMENS: Specimen[] = [
  {
    id: "iron-nail",
    name: "Iron nail",
    material: "Iron",
    magnetic: true,
    colour: "#8f9aa6",
    metalness: 0.78,
    roughness: 0.42,
    shape: "nail",
    note: "Strongly attracted. Iron is magnetically soft — it is easy to magnetise but loses its magnetism again straight away.",
  },
  {
    id: "steel-clip",
    name: "Steel paper clip",
    material: "Steel (iron alloy)",
    magnetic: true,
    colour: "#cbd5e1",
    metalness: 0.85,
    roughness: 0.26,
    shape: "clip",
    note: "Strongly attracted. Steel is magnetically hard — harder to magnetise, but it keeps its magnetism, so permanent magnets are made of steel.",
  },
  {
    id: "cobalt",
    name: "Cobalt sample",
    material: "Cobalt",
    magnetic: true,
    colour: "#a8b6c4",
    metalness: 0.72,
    roughness: 0.36,
    shape: "disc",
    note: "Attracted. Cobalt is one of only three magnetic elements at room temperature: iron, cobalt and nickel.",
  },
  {
    id: "nickel",
    name: "Nickel coin",
    material: "Nickel",
    magnetic: true,
    colour: "#c2ccd6",
    metalness: 0.8,
    roughness: 0.3,
    shape: "coin",
    note: "Attracted, though more weakly than iron. Nickel is magnetic; most modern 'silver' coins are nickel-plated steel and are attracted too.",
  },
  {
    id: "steel-magnet",
    name: "Unlabelled steel bar",
    material: "Steel — already magnetised",
    magnetic: true,
    isMagnet: true,
    colour: "#b6bfc9",
    metalness: 0.82,
    roughness: 0.3,
    shape: "bar",
    note: "Attracted at one end and repelled at the other. Repulsion is the only sure test that this bar is itself a magnet.",
  },
  {
    id: "copper",
    name: "Copper wire",
    material: "Copper",
    magnetic: false,
    colour: "#b45309",
    metalness: 0.88,
    roughness: 0.28,
    shape: "wire",
    note: "Not attracted. Copper conducts electricity well but it is not a magnetic material.",
  },
  {
    id: "aluminium",
    name: "Aluminium sheet",
    material: "Aluminium",
    magnetic: false,
    colour: "#d4d9de",
    metalness: 0.86,
    roughness: 0.34,
    shape: "sheet",
    note: "Not attracted, even though it is a shiny metal — being a metal does not make something magnetic.",
  },
  {
    id: "brass",
    name: "Brass screw",
    material: "Brass (copper + zinc)",
    magnetic: false,
    colour: "#c9a227",
    metalness: 0.84,
    roughness: 0.3,
    shape: "nail",
    note: "Not attracted. Brass is a useful check, because it looks like a gold-coloured metal but contains no iron.",
  },
  {
    id: "zinc",
    name: "Zinc strip",
    material: "Zinc",
    magnetic: false,
    colour: "#9ca6b0",
    metalness: 0.7,
    roughness: 0.46,
    shape: "sheet",
    note: "Not attracted. A galvanised nail is attracted, but only because of the steel underneath the zinc coating.",
  },
  {
    id: "wood",
    name: "Wooden block",
    material: "Wood",
    magnetic: false,
    colour: "#a16207",
    metalness: 0.02,
    roughness: 0.9,
    shape: "block",
    note: "Not attracted. Non-metals are never magnetic.",
  },
  {
    id: "plastic",
    name: "Plastic block",
    material: "Plastic",
    magnetic: false,
    colour: "#0ea5e9",
    metalness: 0.04,
    roughness: 0.62,
    shape: "block",
    note: "Not attracted, and the magnet's field passes straight through it — which is why a magnet works through a plastic ruler.",
  },
  {
    id: "glass",
    name: "Glass block",
    material: "Glass",
    magnetic: false,
    colour: "#bae6fd",
    metalness: 0.08,
    roughness: 0.12,
    shape: "block",
    note: "Not attracted. The field goes through glass unchanged, so a magnet still works through a window pane.",
  },
];

const MATERIAL_MISSIONS: GameMission[] = [
  {
    short: "Set up",
    title: "Lay out the specimens",
    detail: "Put each specimen on the bench, well apart, and keep the magnet away until you are ready to test.",
    symbol: "🔩",
  },
  {
    short: "Test",
    title: "Bring the magnet close",
    detail: "Move the north pole of the bar magnet slowly up to each specimen in turn and watch whether it is attracted.",
    symbol: "🧲",
  },
  {
    short: "Record",
    title: "Fill in the table",
    detail: "Record each specimen, what it is made of, and whether it was attracted, so the pattern shows up.",
    symbol: "📝",
  },
  {
    short: "Repel",
    title: "Do the repulsion test",
    detail: "Bring a known north pole to each end of the unlabelled bar. Only a magnet is repelled — attraction alone proves nothing.",
    symbol: "↔️",
  },
];

const materialTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Magnetic materials",
    text: "Only a few materials are attracted to a magnet: iron, steel, cobalt and nickel, and alloys made from them. These are called ferromagnetic, or simply magnetic, materials.",
    mode: "modal",
  },
  {
    title: "The specimens",
    text: "The tray holds metals and non-metals. Being a metal is not enough — copper, aluminium, brass and zinc are all metals, and none of them is attracted.",
    mode: "bubble",
    selector: '[data-experiment-tour="materials-scene"]',
  },
  {
    title: "Test one at a time",
    text: "Pick a specimen and bring the magnet up to it. Attraction means it is a magnetic material; no movement means it is not.",
    mode: "bubble",
    selector: '[data-experiment-tour="materials-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "The repulsion test",
    text: "A magnet attracts any magnetic material, but it only repels another magnet. So repulsion — not attraction — is the test for whether something is a magnet.",
    mode: "bubble",
    selector: '[data-experiment-tour="materials-table"], [data-mobile-experiment-controls="true"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function SpecimenMesh({ specimen }: { specimen: Specimen }) {
  const material = (
    <meshStandardMaterial
      color={specimen.colour}
      metalness={specimen.metalness}
      roughness={specimen.roughness}
      transparent={specimen.id === "glass"}
      opacity={specimen.id === "glass" ? 0.55 : 1}
    />
  );

  switch (specimen.shape) {
    case "nail":
      return (
        <group rotation={[0, 0, Math.PI / 2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.022, 0.012, 0.42, 12]} />
            {material}
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.022, 16]} />
            {material}
          </mesh>
        </group>
      );
    case "clip":
      return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <torusGeometry args={[0.075, 0.011, 8, 24]} />
            {material}
          </mesh>
          <mesh position={[0.03, 0, 0.02]} castShadow>
            <torusGeometry args={[0.05, 0.011, 8, 24]} />
            {material}
          </mesh>
        </group>
      );
    case "disc":
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.06, 26]} />
          {material}
        </mesh>
      );
    case "coin":
      return (
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.018, 30]} />
          {material}
        </mesh>
      );
    case "wire":
      return (
        <group>
          {[0, 1, 2].map((turn) => (
            <mesh key={turn} position={[0, 0.02 + turn * 0.028, 0]} rotation={[Math.PI / 2, 0, turn * 0.4]} castShadow>
              <torusGeometry args={[0.12, 0.012, 8, 26]} />
              {material}
            </mesh>
          ))}
        </group>
      );
    case "sheet":
      return (
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.016, 0.2]} />
          {material}
        </mesh>
      );
    case "bar":
      return (
        <mesh castShadow>
          <boxGeometry args={[0.46, 0.075, 0.11]} />
          {material}
        </mesh>
      );
    default:
      return (
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.14, 0.16]} />
          {material}
        </mesh>
      );
  }
}

/** The tray of untested specimens, laid out in two rows on the bench. */
function SpecimenTray({
  specimens,
  results,
  selectedId,
  onSelect,
}: {
  specimens: Specimen[];
  results: Record<string, boolean>;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <group position={[0, 0, 0.85]}>
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.03, 0.95]} />
        <meshStandardMaterial color="#1f2937" roughness={0.72} />
      </mesh>
      {specimens.map((specimen, index) => {
        const column = index % 6;
        const row = Math.floor(index / 6);
        const x = -1.45 + column * 0.58;
        const z = -0.2 + row * 0.42;
        const tested = results[specimen.id] !== undefined;
        return (
          <group key={specimen.id} position={[x, 0.03, z]}>
            <group
              position={[0, 0.09, 0]}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(specimen.id);
              }}
              onPointerOver={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <SpecimenMesh specimen={specimen} />
            </group>
            <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.2, 24]} />
              <meshBasicMaterial
                color={selectedId === specimen.id ? "#38bdf8" : tested ? (specimen.magnetic ? "#22c55e" : "#64748b") : "#111827"}
                transparent
                opacity={selectedId === specimen.id ? 0.5 : tested ? 0.32 : 0.18}
              />
            </mesh>
            <Html position={[0, 0.24, 0.19]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
              <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/88 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
                {specimen.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/** The specimen under test, on the test pad, with the magnet moving up to it. */
function TestPad({
  specimen,
  approach,
  attracted,
  repelled,
}: {
  specimen: Specimen;
  approach: number;
  attracted: boolean;
  repelled: boolean;
}) {
  const specimenRef = useRef<THREE.Group>(null);
  const magnetRef = useRef<THREE.Group>(null);
  /** The stepped `approach` prop, smoothed into continuous hand movement. */
  const smoothed = useRef(0);
  /** Specimen displacement along the bench, in metres. */
  const offset = useRef(0);
  const velocity = useRef(0);
  const stuck = useRef(false);
  const snapPlayed = useRef(false);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    // The hand moves the magnet smoothly even though `approach` arrives in steps.
    smoothed.current = THREE.MathUtils.damp(smoothed.current, approach, 9, delta);
    const holderX = THREE.MathUtils.lerp(MAGNET_FAR_X, MAGNET_NEAR_X, smoothed.current);
    if (magnetRef.current) {
      magnetRef.current.position.x = holderX + 0.3;
      // A hand-held magnet is never perfectly steady.
      magnetRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.3) * 0.004;
      magnetRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.7) * 0.012;
    }

    /** Face of the pole nearest the specimen. */
    const poleFaceX = holderX - 0.01;
    /** Where the specimen would touch the pole. */
    const contactX = poleFaceX - SPECIMEN_HALF_LENGTH;
    const gap = Math.max(0.004, contactX - offset.current);

    if (attracted && stuck.current) {
      // Once it has jumped it travels with the magnet, even as it is drawn back.
      offset.current = contactX;
      velocity.current = 0;
    } else if (attracted || repelled) {
      /*
       * The force between a magnet and a piece of iron it has induced falls off
       * roughly as 1/r⁴, which is why a specimen sits still until the magnet is
       * almost touching and then jumps the last few millimetres. A linear pull
       * looks nothing like it.
       */
      const force = THREE.MathUtils.clamp(SPECIMEN_PULL / Math.pow(gap, 3), 0, 90);
      velocity.current += (repelled ? -force : force) * delta;
      // Friction against the bench, so it does not drift for ever.
      velocity.current -= velocity.current * 7 * delta;
      offset.current += velocity.current * delta;

      if (attracted && offset.current >= contactX) {
        offset.current = contactX;
        velocity.current = 0;
        stuck.current = true;
        if (!snapPlayed.current) {
          snapPlayed.current = true;
          labSounds.play("magnetSnap", { volume: 0.45 });
        }
      }
      // A repelled specimen is pushed away and stops when it runs out of shove.
      if (repelled) offset.current = Math.max(offset.current, -0.6);
    } else {
      // Nothing happens to a non-magnetic specimen; settle any residual motion.
      velocity.current = 0;
      offset.current = THREE.MathUtils.damp(offset.current, 0, 6, delta);
    }

    // Retracting the magnet far enough releases a stuck specimen.
    if (approach < 0.05) {
      stuck.current = false;
      snapPlayed.current = false;
      offset.current = THREE.MathUtils.damp(offset.current, 0, 6, delta);
      velocity.current = 0;
    }

    if (specimenRef.current) {
      specimenRef.current.position.x = offset.current;
      /*
       * While it is moving it tips in the direction of travel; once it lands on
       * the pole it lies flat and holds still.
       */
      const tip = stuck.current
        ? 0
        : THREE.MathUtils.clamp(velocity.current * 0.05, -0.12, 0.12);
      specimenRef.current.rotation.z = -tip;
      specimenRef.current.position.y = 0.09 + Math.abs(tip) * 0.01;
    }
  });

  return (
    <group position={[0, 0, -0.55]}>
      {/* Wooden test pad */}
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.6, 0.04, 0.62]} />
        <meshStandardMaterial color="#7c4a1e" roughness={0.84} />
      </mesh>

      <group ref={specimenRef} position={[0, 0.09, 0]}>
        <SpecimenMesh specimen={specimen} />
      </group>

      {/* The bar magnet on its holder, approaching from the right */}
      <group ref={magnetRef} position={[MAGNET_FAR_X + 0.3, 0, 0]}>
        <BarMagnet magnet={{ x: 0, z: 0, angle: Math.PI, length: 0.62 }} y={0.11} />
        {/* The hand grip that carries it */}
        <mesh position={[0.42, 0.16, 0]} castShadow>
          <boxGeometry args={[0.24, 0.14, 0.16]} />
          <meshStandardMaterial color="#334155" roughness={0.6} />
        </mesh>
        <Html position={[0, 0.3, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded border border-rose-300/30 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-rose-200">
            N pole
          </div>
        </Html>
      </group>

      {approach > 0.62 && (
        <Html position={[-0.55, 0.42, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div
            className="whitespace-nowrap rounded-lg border px-2 py-1 text-[8px] font-black uppercase"
            style={
              repelled
                ? { borderColor: "rgba(251,113,133,0.4)", background: "rgba(2,6,23,0.92)", color: "#fecdd3" }
                : attracted
                  ? { borderColor: "rgba(34,197,94,0.4)", background: "rgba(2,6,23,0.92)", color: "#bbf7d0" }
                  : { borderColor: "rgba(148,163,184,0.35)", background: "rgba(2,6,23,0.92)", color: "#cbd5e1" }
            }
          >
            {repelled ? "Repelled — it is a magnet" : attracted ? "Attracted" : "No effect"}
          </div>
        </Html>
      )}
    </group>
  );
}

function MaterialsScene({
  specimen,
  approach,
  attracted,
  repelled,
  results,
  selectedId,
  onSelect,
  mode,
  isMobile,
  moveVectorRef,
}: {
  specimen: Specimen;
  approach: number;
  attracted: boolean;
  repelled: boolean;
  results: Record<string, boolean>;
  selectedId: string;
  onSelect: (id: string) => void;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.2, 3.5, 3.3] : [0.3, 3.2, 2.85];
    camera.position.set(...position);
    camera.lookAt(0, BENCH_TOP_Y + 0.1, 0.1);
    if ("fov" in camera) {
      camera.fov = isMobile ? 55 : 47;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0284c7"
        benchColor="#eef2f6"
        posterA={{
          title: "MAGNETIC MATERIALS",
          lines: [
            "Attracted: iron, steel, cobalt, nickel",
            "Not attracted: copper, aluminium, brass, zinc",
            "Non-metals are never magnetic",
            "Soft = iron · Hard = steel",
          ],
        }}
        posterB={{
          title: "TEST FOR A MAGNET",
          lines: ["Attraction happens with any magnetic material", "Only a magnet is REPELLED", "So repulsion is the real test"],
        }}
      >
        <group position={[0, BENCH_TOP_Y, 0]}>
          <TestPad specimen={specimen} approach={approach} attracted={attracted} repelled={repelled} />
          <SpecimenTray specimens={SPECIMENS} results={results} selectedId={selectedId} onSelect={onSelect} />
        </group>
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.005, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, BENCH_TOP_Y + 0.1, 0.1]} minDistance={1.6} maxDistance={9} maxPolarAngle={1.46} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function MaterialsPaper({ results, onClose }: { results: Record<string, boolean>; onClose: () => void }) {
  const tested = SPECIMENS.filter((specimen) => results[specimen.id] !== undefined);

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Testing Materials for Magnetism</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To find out which materials are attracted to a magnet, and to test whether an unlabelled steel bar is itself a magnet.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>A bar magnet, an unlabelled steel bar, and specimens of iron, steel, cobalt, nickel, copper, aluminium, brass, zinc, wood, plastic and glass.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Each specimen was placed on a wooden pad on the bench, well away from the others.</li>
          <li>The north pole of the bar magnet was brought slowly towards the specimen, and any movement of the specimen was observed.</li>
          <li>The result was recorded as attracted or not attracted.</li>
          <li>Step 2 was repeated for every specimen.</li>
          <li>Finally, the north pole of the bar magnet was brought up to each end of the unlabelled steel bar in turn, and it was noted whether the bar was attracted or repelled.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-slate-400 p-2">Specimen</th>
              <th className="border border-slate-400 p-2">Material</th>
              <th className="border border-slate-400 p-2">Attracted?</th>
              <th className="border border-slate-400 p-2">Magnetic or not</th>
            </tr>
          </thead>
          <tbody>
            {(tested.length ? tested : SPECIMENS).map((specimen) => {
              const done = results[specimen.id] !== undefined;
              return (
                <tr key={specimen.id}>
                  <td className="border border-slate-400 p-2">{specimen.name}</td>
                  <td className="border border-slate-400 p-2">{specimen.material}</td>
                  <td className="border border-slate-400 p-2 text-center">{done ? (specimen.magnetic ? "Yes" : "No") : ""}</td>
                  <td className="border border-slate-400 p-2 text-center">{done ? (specimen.magnetic ? "Magnetic" : "Non-magnetic") : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className="mt-5 font-bold uppercase">The repulsion test</h2>
        <p>
          The unlabelled steel bar was attracted when one end was offered to the north pole of the magnet, but pushed away
          when it was turned round. Since a magnet attracts every magnetic material but only repels another magnet,
          repulsion shows that the bar is itself a magnet. Attraction on its own would not have proved it.
        </p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Iron, steel, cobalt and nickel were attracted to the magnet; copper, aluminium, brass, zinc, wood, plastic and
          glass were not. Magnetic materials are therefore iron, cobalt, nickel and alloys containing them, such as steel.
          Being a metal is not enough — several of the metals tested were not attracted at all. Iron is magnetically soft,
          so it is magnetised easily but loses its magnetism at once, which makes it suitable for the core of an
          electromagnet; steel is magnetically hard, so it keeps its magnetism and is used for permanent magnets.
        </p>
        <h2 className="mt-5 font-bold uppercase">Precautions</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Specimens were kept well apart, so that one already-magnetised piece did not attract another and give a false result.</li>
          <li>The magnet was brought up slowly, so that a weak attraction — as with nickel — was not missed.</li>
          <li>The magnet was kept away from watches, phones and the balance.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function MagneticMaterialsSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: MagneticMaterialsSimProps) {
  const [selectedId, setSelectedId] = useState(SPECIMENS[0].id);
  const [approach, setApproach] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [repulsionTested, setRepulsionTested] = useState(false);
  /** Turning the unlabelled bar round is what makes the repulsion show up. */
  const [barReversed, setBarReversed] = useState(false);
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

  const specimen = useMemo(
    () => SPECIMENS.find((item) => item.id === selectedId) ?? SPECIMENS[0],
    [selectedId],
  );

  const repelled = Boolean(specimen.isMagnet) && barReversed;
  const attracted = specimen.magnetic && !repelled;

  /** Slides the magnet in, holds it there, then records what happened. */
  const runTest = useCallback(() => {
    labSounds.play("magnetSnap", { volume: 0.5 });
    clearTimers();
    setApproach(0);
    const frames = 26;
    for (let index = 1; index <= frames; index += 1) {
      timers.current.push(window.setTimeout(() => setApproach(index / frames), index * 34));
    }
    timers.current.push(
      window.setTimeout(() => {
        setResults((current) => ({ ...current, [specimen.id]: specimen.magnetic }));
        if (specimen.isMagnet && barReversed) setRepulsionTested(true);
      }, frames * 34 + 220),
    );
  }, [barReversed, clearTimers, specimen]);

  const selectSpecimen = useCallback(
    (id: string) => {
      clearTimers();
      setApproach(0);
      setSelectedId(id);
    },
    [clearTimers],
  );

  const resetAll = useCallback(() => {
    clearTimers();
    setResults({});
    setApproach(0);
    setRepulsionTested(false);
    setBarReversed(false);
    setDemoActive(false);
    setSelectedId(SPECIMENS[0].id);
  }, [clearTimers]);

  const toggleDemo = useCallback(() => {
    clearTimers();
    if (demoActive) {
      setDemoActive(false);
      setApproach(0);
      return;
    }
    setDemoActive(true);
    setResults({});
    setBarReversed(false);

    /** Works along the tray, testing each specimen for about a second. */
    SPECIMENS.forEach((item, index) => {
      const start = index * 1050;
      timers.current.push(
        window.setTimeout(() => {
          setSelectedId(item.id);
          setApproach(0);
        }, start),
      );
      for (let frame = 1; frame <= 14; frame += 1) {
        timers.current.push(window.setTimeout(() => setApproach(frame / 14), start + 120 + frame * 40));
      }
      timers.current.push(
        window.setTimeout(() => setResults((current) => ({ ...current, [item.id]: item.magnetic })), start + 780),
      );
    });

    const afterTray = SPECIMENS.length * 1050;
    /** Finishes with the repulsion test on the unlabelled bar. */
    timers.current.push(
      window.setTimeout(() => {
        setSelectedId("steel-magnet");
        setBarReversed(true);
        setApproach(0);
      }, afterTray),
    );
    for (let frame = 1; frame <= 16; frame += 1) {
      timers.current.push(window.setTimeout(() => setApproach(frame / 16), afterTray + 140 + frame * 45));
    }
    timers.current.push(window.setTimeout(() => setRepulsionTested(true), afterTray + 1000));
    timers.current.push(window.setTimeout(() => setDemoActive(false), afterTray + 1500));
  }, [clearTimers, demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const testedCount = Object.keys(results).length;
  const allTested = testedCount >= SPECIMENS.length;
  const complete = allTested && repulsionTested;
  const step = complete ? 3 : allTested ? 3 : testedCount >= 1 ? 2 : approach > 0 ? 1 : 0;
  const progress = Math.min(1, (testedCount + (repulsionTested ? 1 : 0)) / (SPECIMENS.length + 1));

  const magneticFound = SPECIMENS.filter((item) => results[item.id] !== undefined && item.magnetic);
  const nonMagneticFound = SPECIMENS.filter((item) => results[item.id] !== undefined && !item.magnetic);

  const status = complete
    ? "All specimens tested. Only iron, steel, cobalt and nickel were attracted — and the unlabelled bar was repelled, so it is itself a magnet."
    : approach > 0.62
      ? repelled
        ? "Pushed away! Only another magnet is repelled, so this bar must be a magnet."
        : attracted
          ? `${specimen.name}: attracted. ${specimen.note}`
          : `${specimen.name}: no movement at all. ${specimen.note}`
      : testedCount
        ? `${testedCount} of ${SPECIMENS.length} tested. Pick the next specimen and bring the magnet up to it.`
        : "Pick a specimen from the tray, then bring the north pole of the magnet slowly up to it.";

  const observation = complete
    ? "Magnetic: iron, steel, cobalt, nickel. Everything else — including the other metals — was unaffected."
    : specimen.note;

  const primaryLabel = complete ? "Start again" : approach > 0.62 ? "Next specimen" : `Test the ${specimen.name.toLowerCase()}`;

  const nextSpecimen = useCallback(() => {
    labSounds.play("objectDropMetal", { volume: 0.4 });
    const untested = SPECIMENS.find((item) => results[item.id] === undefined);
    selectSpecimen((untested ?? SPECIMENS[0]).id);
  }, [results, selectSpecimen]);

  const specimenPanel = (
    <div data-experiment-tour="materials-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Specimen</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {testedCount}/{SPECIMENS.length}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {SPECIMENS.map((item) => {
          const tested = results[item.id] !== undefined;
          return (
            <button
              key={item.id}
              onClick={() => selectSpecimen(item.id)}
              disabled={demoActive}
              className="flex items-center justify-between gap-1 rounded-xl px-2 py-1.5 text-left text-[9px] font-black uppercase tracking-wide transition disabled:opacity-40"
              style={
                selectedId === item.id
                  ? { background: ACCENT.base, color: "#0f172a" }
                  : { background: "rgba(255,255,255,0.05)", color: "#cbd5e1" }
              }
            >
              <span className="truncate">{item.name}</span>
              {tested && <span>{item.magnetic ? "✓" : "✗"}</span>}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => {
          setBarReversed((current) => !current);
          setApproach(0);
        }}
        disabled={demoActive || !specimen.isMagnet}
        className="mt-2 w-full rounded-xl border border-white/10 px-2 py-2 text-[9px] font-black uppercase tracking-wide transition disabled:opacity-30"
        style={barReversed ? { background: ACCENT.soft, color: ACCENT.text } : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
      >
        {specimen.isMagnet ? `Turn the bar round — ${barReversed ? "reversed" : "as it lies"}` : "Turning round only matters for the steel bar"}
      </button>
    </div>
  );

  const tablePanel = (
    <div data-experiment-tour="materials-table" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results</span>
      {testedCount === 0 ? (
        <p className="mt-2 text-[10px] font-bold text-slate-500">Nothing tested yet.</p>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 p-2">
            <div className="text-[9px] font-black uppercase text-emerald-200">Attracted</div>
            <ul className="mt-1 space-y-0.5 text-[9px] font-bold text-emerald-100/90">
              {magneticFound.map((item) => (
                <li key={item.id}>{item.material}</li>
              ))}
              {!magneticFound.length && <li className="text-slate-500">—</li>}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2">
            <div className="text-[9px] font-black uppercase text-slate-400">Not attracted</div>
            <ul className="mt-1 space-y-0.5 text-[9px] font-bold text-slate-300">
              {nonMagneticFound.map((item) => (
                <li key={item.id}>{item.material}</li>
              ))}
              {!nonMagneticFound.length && <li className="text-slate-500">—</li>}
            </ul>
          </div>
        </div>
      )}
      <div
        className="mt-2 rounded-xl px-2 py-1.5 text-center text-[9px] font-black uppercase tracking-wide"
        style={
          repulsionTested
            ? { background: "rgba(16,185,129,0.16)", color: "#a7f3d0" }
            : { background: "rgba(255,255,255,0.05)", color: "#94a3b8" }
        }
      >
        {repulsionTested ? "Repulsion test done — the bar is a magnet" : "Repulsion test still to do"}
      </div>
    </div>
  );

  const theoryPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">What to remember</span>
      <div className="mt-2 space-y-1.5 text-[9px] font-bold text-slate-300">
        <p>
          <span className="text-white">Magnetic materials: </span>iron, cobalt, nickel and alloys of them, such as steel. Nothing else in a school lab is attracted.
        </p>
        <p>
          <span className="text-white">Soft vs hard: </span>soft iron is easy to magnetise and loses it at once (electromagnet cores). Hard steel is harder to magnetise but keeps it (permanent magnets).
        </p>
        <p>
          <span className="text-white">Testing for a magnet: </span>attraction only shows the material is magnetic. Repulsion is the sure test that the specimen is a magnet.
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Magnetic Materials Bench"
          subtitle="Which materials does a magnet attract?"
          symbol="🧲"
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

      <div data-experiment-tour="materials-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.3, 3.2, 2.85], fov: 47, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <MaterialsScene
            specimen={specimen}
            approach={approach}
            attracted={attracted}
            repelled={repelled}
            results={results}
            selectedId={selectedId}
            onSelect={selectSpecimen}
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
            emoji="🧲"
            cornerEmoji="🔩"
            status={status}
            running={demoActive}
            progress={progress}
            complete={complete}
          />
        )}

        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">
            Click a specimen in the tray · drag to look around
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
          title="Magnetic Materials"
          tagline="Which materials does a magnet attract?"
          missions={MATERIAL_MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : approach > 0.62 ? "➡️" : "🧲"}
          onPrimary={complete ? resetAll : approach > 0.62 ? nextSpecimen : runTest}
          primaryDisabled={demoActive}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "specimen", label: "Specimen", value: specimen.name, content: specimenPanel },
            { id: "results", label: "Results", value: `${testedCount}/${SPECIMENS.length}`, content: tablePanel },
            { id: "theory", label: "Notes", content: theoryPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "test", label: "Test", onClick: runTest, disabled: demoActive, tone: "green" },
            { id: "next", label: "Next", onClick: nextSpecimen, disabled: demoActive, tone: "blue" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "specimen", label: "Specimen", value: specimen.name, content: specimenPanel },
            { id: "results", label: "Results", value: `${testedCount}/${SPECIMENS.length}`, content: tablePanel },
            { id: "theory", label: "Notes", content: theoryPanel },
          ]}
        />
      )}

      {showPaper && <MaterialsPaper results={results} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={materialTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
