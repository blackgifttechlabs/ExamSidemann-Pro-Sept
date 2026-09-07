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

interface DiffusionSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.fuchsia;

/* ------------------------------------------------------------------ Science */

type Demonstration = "permanganate" | "gases";

/** Water temperatures for the potassium manganate(VII) demonstration. */
const WATER_TEMPERATURES = [
  { value: 5, label: "5 °C", note: "Iced water. Particles have little kinetic energy, so the purple colour spreads very slowly." },
  { value: 20, label: "20 °C", note: "Room temperature. A steady spread of colour through the water." },
  { value: 40, label: "40 °C", note: "Warm water. Particles move faster and diffusion is noticeably quicker." },
  { value: 60, label: "60 °C", note: "Hot water. The colour spreads fastest — diffusion increases with temperature." },
];

/** Simulated seconds to run each demonstration. */
const PERMANGANATE_DURATION_S = 600;
const GAS_DURATION_S = 300;
const TIME_SCALE_PERMANGANATE = 40;
const TIME_SCALE_GASES = 20;

/**
 * Relative molecular masses. Ammonia is much lighter than hydrogen chloride, so
 * its molecules move faster and travel further before they meet — the white
 * ring of ammonium chloride forms nearer the hydrochloric acid end.
 */
const MR_AMMONIA = 17;
const MR_HYDROGEN_CHLORIDE = 36.5;

/**
 * Fraction of the tube's length from the ammonia end at which the ring forms.
 * Rate of diffusion is inversely proportional to the square root of Mr, so the
 * distances travelled are in the ratio √Mr(HCl) : √Mr(NH₃).
 */
const RING_POSITION_FRACTION =
  Math.sqrt(MR_HYDROGEN_CHLORIDE) / (Math.sqrt(MR_HYDROGEN_CHLORIDE) + Math.sqrt(MR_AMMONIA));

/** How far the purple colour has spread, 0 to 1, at a given time. */
function permanganateSpread(seconds: number, temperature: number): number {
  // Warmer particles have more kinetic energy, so they diffuse faster.
  const rate = 0.55 + (temperature / 60) * 1.15;
  return THREE.MathUtils.clamp(1 - Math.exp((-seconds / PERMANGANATE_DURATION_S) * rate * 3.2), 0, 1);
}

const MISSIONS: GameMission[] = [
  { short: "Set up", title: "Set up the demonstration", detail: "Drop a crystal of potassium manganate(VII) into still water, or clamp a dry glass tube with cotton wool soaked in ammonia at one end and hydrochloric acid at the other.", symbol: "🔧" },
  { short: "Watch", title: "Do not stir or shake", detail: "Leave the apparatus completely still. Any stirring would mix the particles by convection, not by diffusion.", symbol: "🤫" },
  { short: "Measure", title: "Measure what happens", detail: "Time how long the colour takes to spread, or measure where the white ring forms along the tube.", symbol: "📏" },
  { short: "Explain", title: "Explain the result", detail: "Particles move randomly and spread from where they are concentrated to where they are dilute, all on their own.", symbol: "💡" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What is diffusion?",
    text: "Diffusion is the net movement of particles from a region of high concentration to a region of low concentration, down a concentration gradient. It happens because particles are always moving randomly, and it needs no energy from the cell.",
    mode: "modal",
  },
  {
    title: "Two classic demonstrations",
    text: "A purple crystal spreading through still water shows diffusion in a liquid. Ammonia and hydrogen chloride meeting inside a glass tube shows diffusion in a gas.",
    mode: "bubble",
    selector: '[data-experiment-tour="diffusion-scene"]',
  },
  {
    title: "Change the temperature",
    text: "Warmer particles have more kinetic energy and move faster, so diffusion is quicker. Try 5 °C and then 60 °C and compare.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Why is the ring off-centre?",
    text: "Ammonia molecules are lighter than hydrogen chloride molecules, so they travel faster and further. The white ring forms closer to the hydrochloric acid end.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/**
 * A beaker of still water with a crystal of potassium manganate(VII) at the
 * bottom. The purple colour is built from stacked shells that fade in as the
 * spread grows, which reads as a diffusing cloud.
 */
function PermanganateBeaker({ spread, temperature }: { spread: number; temperature: number }) {
  const shells = 7;

  return (
    <group position={[0, BENCH_TOP_Y + 0.02, 0]}>
      {/* Beaker */}
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.68, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.16}
          transmission={0.88}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.008, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.016, 32]} />
        <meshPhysicalMaterial color="#e4f2fb" transparent opacity={0.4} roughness={0.08} />
      </mesh>
      {/* Water */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.292, 0.292, 0.58, 32]} />
        <meshStandardMaterial color="#dfeff8" transparent opacity={0.3} roughness={0.14} />
      </mesh>

      {/* The crystal, dissolving away as the colour spreads */}
      {spread < 0.9 && (
        <mesh position={[0, 0.035, 0]} rotation={[0.3, 0.6, 0.2]}>
          <boxGeometry args={[0.035, 0.03, 0.035]} />
          <meshStandardMaterial color="#3b0764" roughness={0.6} />
        </mesh>
      )}

      {/* Diffusing purple cloud */}
      {Array.from({ length: shells }, (_, index) => index).map((index) => {
        const shellThreshold = index / shells;
        if (spread <= shellThreshold) return null;
        const local = (spread - shellThreshold) / (1 - shellThreshold);
        const radius = 0.05 + (index / shells) * 0.26;
        // Outer shells are always fainter — that is the concentration gradient.
        const opacity = local * 0.5 * (1 - index / (shells + 1.5));
        return (
          <mesh key={index} position={[0, 0.045 + (index / shells) * 0.3, 0]}>
            <sphereGeometry args={[radius, 20, 14]} />
            <meshStandardMaterial
              color="#7e22ce"
              transparent
              opacity={Math.max(0, opacity)}
              roughness={0.5}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Thermometer in the beaker */}
      <group position={[0.2, 0.6, 0.06]} rotation={[0.08, 0, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.014, 0.014, 0.72, 12]} />
          <meshPhysicalMaterial color="#f8fbff" transparent opacity={0.55} roughness={0.1} />
        </mesh>
        <mesh position={[0, -0.28 + (temperature / 80) * 0.24, 0]}>
          <cylinderGeometry args={[0.006, 0.006, 0.05 + (temperature / 80) * 0.5, 8]} />
          <meshStandardMaterial color="#dc2626" emissive="#7f1d1d" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -0.35, 0]}>
          <sphereGeometry args={[0.02, 12, 10]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      <Html position={[0, 1.02, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[126px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Potassium manganate(VII)</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-fuchsia-300">
            water at {temperature} °C · do not stir
          </div>
        </div>
      </Html>
    </group>
  );
}

/**
 * The long glass tube with ammonia at one end and concentrated hydrochloric
 * acid at the other. A white ring of ammonium chloride forms where the two
 * gases meet, nearer the acid end because ammonia diffuses faster.
 */
function GasDiffusionTube({ progress }: { progress: number }) {
  const tubeLength = 2.0;
  const ringX = -tubeLength / 2 + RING_POSITION_FRACTION * tubeLength;

  // The two gas fronts advance towards each other until they meet at the ring.
  const ammoniaFront = -tubeLength / 2 + progress * (RING_POSITION_FRACTION * tubeLength);
  const acidFront = tubeLength / 2 - progress * ((1 - RING_POSITION_FRACTION) * tubeLength);

  return (
    <group position={[0, BENCH_TOP_Y + 0.62, 0]}>
      {/* Glass tube */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.075, 0.075, tubeLength, 30, 1, true]} />
        <meshPhysicalMaterial
          color="#e6f4fb"
          transparent
          opacity={0.16}
          transmission={0.88}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Ammonia gas creeping in from the left */}
      {progress > 0.02 && (
        <mesh position={[(-tubeLength / 2 + ammoniaFront) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.068, Math.max(0.01, ammoniaFront + tubeLength / 2), 24]} />
          <meshStandardMaterial color="#a7f3d0" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      )}
      {/* Hydrogen chloride gas creeping in from the right */}
      {progress > 0.02 && (
        <mesh position={[(tubeLength / 2 + acidFront) / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.068, 0.068, Math.max(0.01, tubeLength / 2 - acidFront), 24]} />
          <meshStandardMaterial color="#fde68a" transparent opacity={0.2} depthWrite={false} />
        </mesh>
      )}

      {/* White ring of ammonium chloride where the gases meet */}
      {progress >= 0.995 && (
        <mesh position={[ringX, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
          <meshStandardMaterial color="#ffffff" emissive="#e2e8f0" emissiveIntensity={0.35} roughness={0.7} />
        </mesh>
      )}

      {/* Cotton wool plugs, and bungs at both ends */}
      {[
        { x: -tubeLength / 2 + 0.06, colour: "#e6f7ee", label: "ammonia" },
        { x: tubeLength / 2 - 0.06, colour: "#fdf6dd", label: "hydrochloric acid" },
      ].map((plug) => (
        <mesh key={plug.label} position={[plug.x, 0, 0]}>
          <sphereGeometry args={[0.062, 12, 10]} />
          <meshStandardMaterial color={plug.colour} roughness={1} />
        </mesh>
      ))}
      {[-tubeLength / 2 - 0.02, tubeLength / 2 + 0.02].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.078, 0.07, 0.06, 18]} />
          <meshStandardMaterial color="#4a4038" roughness={0.9} />
        </mesh>
      ))}

      {/* Clamps and stands holding the tube level */}
      {[-0.62, 0.62].map((x) => (
        <group key={x} position={[x, 0, -0.16]}>
          <mesh castShadow>
            <boxGeometry args={[0.07, 0.05, 0.14]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.32, -0.06]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.62, 12]} />
            <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.62, -0.06]} receiveShadow>
            <boxGeometry args={[0.3, 0.03, 0.24]} />
            <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Ruler along the tube, for measuring where the ring forms */}
      <mesh position={[0, -0.12, 0.09]} receiveShadow>
        <boxGeometry args={[tubeLength, 0.01, 0.05]} />
        <meshStandardMaterial color="#e8dcb5" roughness={0.75} />
      </mesh>

      {/* End labels */}
      <Html position={[-tubeLength / 2 - 0.02, 0.28, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[104px] rounded-lg border border-emerald-300/40 bg-emerald-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-emerald-100">Ammonia NH₃</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-emerald-300">Mr = 17 · faster</div>
        </div>
      </Html>
      <Html position={[tubeLength / 2 + 0.02, 0.28, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[104px] rounded-lg border border-amber-300/40 bg-amber-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-amber-100">HCl gas</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-amber-300">Mr = 36.5 · slower</div>
        </div>
      </Html>
      {progress >= 0.995 && (
        <Html position={[ringX, -0.3, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="w-[118px] rounded-lg border border-white/30 bg-slate-950/95 px-1.5 py-1 text-center">
            <div className="text-[8px] font-black uppercase leading-tight text-white">White ring NH₄Cl</div>
            <div className="mt-0.5 text-[7px] font-black uppercase text-fuchsia-300">
              {(RING_POSITION_FRACTION * 100).toFixed(0)}% along, from NH₃
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function DiffusionScene({
  demonstration,
  spread,
  gasProgress,
  temperature,
  mode,
  isMobile,
  moveVectorRef,
}: {
  demonstration: Demonstration;
  spread: number;
  gasProgress: number;
  temperature: number;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] =
      demonstration === "gases" ? (isMobile ? [0.1, 3.0, 4.2] : [0.2, 2.85, 3.9]) : isMobile ? [1.5, 2.9, 2.9] : [1.5, 2.7, 2.7];
    camera.position.set(...position);
    camera.lookAt(0, demonstration === "gases" ? 2.05 : 1.85, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 58 : 50;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode, demonstration]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#c026d3"
        benchColor="#f1eef4"
        posterA={{
          title: "DIFFUSION",
          lines: [
            "Net movement from high to low concentration",
            "Caused by the random motion of particles",
            "A passive process — no energy needed",
            "Faster when it is warmer",
          ],
        }}
        posterB={{
          title: "RATE OF DIFFUSION",
          lines: [
            "Higher temperature → faster diffusion",
            "Steeper concentration gradient → faster",
            "Lighter molecules diffuse faster",
            "Larger surface area → faster",
          ],
        }}
      >
        {demonstration === "permanganate" ? (
          <PermanganateBeaker spread={spread} temperature={temperature} />
        ) : (
          <GasDiffusionTube progress={gasProgress} />
        )}
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls
          makeDefault
          enablePan={false}
          target={[0, demonstration === "gases" ? 2.0 : 1.8, 0]}
          minDistance={1.5}
          maxDistance={9}
          maxPolarAngle={1.5}
        />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function DiffusionPaper({
  demonstration,
  times,
  onClose,
}: {
  demonstration: Demonstration;
  times: Record<number, number>;
  onClose: () => void;
}) {
  const recorded = WATER_TEMPERATURES.filter((item) => item.value in times);

  if (demonstration === "gases") {
    return (
      <ExperimentPaperModal filename="diffusion-of-gases-ammonia-and-hcl.html" onClose={onClose}>
        <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
          <h1 className="text-center text-xl font-bold uppercase">Demonstrating Diffusion in Gases</h1>

          <h2 className="mt-6 font-bold uppercase">Aim</h2>
          <p>
            To show that gases diffuse, and that lighter molecules diffuse faster than heavier ones.
          </p>

          <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
          <p>
            Long dry glass tube (about 60 cm), two rubber bungs, cotton wool, concentrated ammonia solution,
            concentrated hydrochloric acid, two clamps and stands, metre rule, forceps. This is a fume-cupboard
            experiment — both liquids give off choking, corrosive fumes.
          </p>

          <h2 className="mt-5 font-bold uppercase">Method</h2>
          <ol className="list-decimal space-y-1 pl-6">
            <li>The clean, dry glass tube was clamped horizontally in a fume cupboard.</li>
            <li>
              A plug of cotton wool soaked in concentrated ammonia solution was placed in one end and the bung inserted.
            </li>
            <li>
              At the same moment, a plug soaked in concentrated hydrochloric acid was placed in the other end and that
              bung inserted.
            </li>
            <li>The tube was left completely undisturbed.</li>
            <li>
              When a white ring appeared, its distance from each end was measured with a metre rule.
            </li>
          </ol>

          <h2 className="mt-5 font-bold uppercase">Results</h2>
          <p>
            A white ring of solid ammonium chloride formed about{" "}
            {(RING_POSITION_FRACTION * 100).toFixed(0)}% of the way along the tube from the ammonia end — that is,
            noticeably closer to the hydrochloric acid end.
          </p>
          <p className="mt-2 text-center italic">ammonia + hydrogen chloride → ammonium chloride</p>
          <p className="text-center">NH₃(g) + HCl(g) → NH₄Cl(s)</p>

          <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
          <p>
            Both gases diffused along the tube without being stirred, which shows that gas particles move randomly and
            spread from a region of high concentration to a region of low concentration. The ring formed nearer the
            hydrochloric acid end because ammonia molecules (Mr = {MR_AMMONIA}) are lighter than hydrogen chloride
            molecules (Mr = {MR_HYDROGEN_CHLORIDE}). Lighter molecules move faster at the same temperature, so the
            ammonia travelled further in the same time.
          </p>

          <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Both plugs must be inserted at the same instant, or one gas has a head start.</li>
            <li>The tube must be dry — the gases dissolve in any water on the glass.</li>
            <li>The tube must not be moved, or the gases mix by convection instead of diffusing.</li>
            <li>The ring is a band rather than a sharp line, so its position can only be measured approximately.</li>
            <li>Both reagents are corrosive and their fumes are toxic; a fume cupboard and gloves are essential.</li>
          </ul>
        </div>
      </ExperimentPaperModal>
    );
  }

  return (
    <ExperimentPaperModal filename="diffusion-in-liquids-potassium-manganate.html" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Investigating Diffusion in Liquids and the Effect of Temperature
        </h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To show that a dissolved substance diffuses through still water, and to find out how temperature affects the
          rate of diffusion.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Beakers, crystals of potassium manganate(VII) of similar size, forceps, thermometer, water baths at 5, 20, 40
          and 60 °C, stop-clock, ruler, white card as a background.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A beaker was filled with water at the chosen temperature and left to become completely still.</li>
          <li>One crystal of potassium manganate(VII) was lowered gently to the bottom with forceps.</li>
          <li>The stop-clock was started and the beaker was not moved or stirred at any point.</li>
          <li>
            The time for the purple colour to spread evenly through the whole beaker was recorded, against a white card
            so the colour was easy to judge.
          </li>
          <li>The procedure was repeated at each temperature, using the same volume of water and crystals of the same size.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">Temperature of the water (°C)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Time for the colour to spread through the water</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Volume of water, size of crystal, size of beaker, no stirring, same judgement of the end point
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {recorded.length === 0 ? (
          <p className="italic">No timings recorded yet — run the demonstration at a few temperatures first.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Temperature (°C)</th>
                <th className="border border-slate-400 p-2">Time to spread evenly (s)</th>
              </tr>
            </thead>
            <tbody>
              {recorded.map((item) => (
                <tr key={item.value}>
                  <td className="border border-slate-400 p-2 text-center">{item.value}</td>
                  <td className="border border-slate-400 p-2 text-center">{Math.round(times[item.value])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          The purple colour spread through the water without any stirring, showing that the dissolved particles moved on
          their own from where they were concentrated to where they were dilute. This is diffusion, caused by the random
          movement of particles. The colour spread fastest in the hottest water, because at a higher temperature the
          particles have more kinetic energy and move faster, so they spread out more quickly.
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Judging when the colour is spread "evenly" is subjective; a colorimeter reading taken at a fixed point would
            be more reliable.
          </li>
          <li>The water must be perfectly still, or convection currents move the colour faster than diffusion.</li>
          <li>Crystals are never exactly the same size, so the amount of solute differs slightly between runs.</li>
          <li>
            The water in the hot beaker cools during the experiment, so the temperature is not perfectly constant.
          </li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function DiffusionSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: DiffusionSimProps) {
  const [demonstration, setDemonstration] = useState<Demonstration>("permanganate");
  const [temperatureIndex, setTemperatureIndex] = useState(1); // 20 °C
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);
  const [times, setTimes] = useState<Record<number, number>>({});

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const temperature = WATER_TEMPERATURES[temperatureIndex];
  const duration = demonstration === "permanganate" ? PERMANGANATE_DURATION_S : GAS_DURATION_S;
  const timeScale = demonstration === "permanganate" ? TIME_SCALE_PERMANGANATE : TIME_SCALE_GASES;

  const spread = permanganateSpread(elapsed, temperature.value);
  const gasProgress = THREE.MathUtils.clamp(elapsed / GAS_DURATION_S, 0, 1);
  /** Time at which the colour counts as evenly spread (spread ≥ 0.97). */
  const spreadTime = useMemo(() => {
    const rate = 0.55 + (temperature.value / 60) * 1.15;
    return (-Math.log(1 - 0.97) / (rate * 3.2)) * PERMANGANATE_DURATION_S;
  }, [temperature.value]);

  const finished = demonstration === "permanganate" ? spread >= 0.97 : gasProgress >= 1;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = Math.min(((now - startRef.current) / 1000) * timeScale, duration);
      setElapsed(next);
      const done = demonstration === "permanganate" ? permanganateSpread(next, temperature.value) >= 0.97 : next >= GAS_DURATION_S;
      if (done || next >= duration) {
        setRunning(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running, timeScale, duration, demonstration, temperature.value]);

  /* Record the timing once the colour has spread. */
  useEffect(() => {
    if (demonstration !== "permanganate" || !finished) return;
    setTimes((current) => (temperature.value in current ? current : { ...current, [temperature.value]: spreadTime }));
  }, [demonstration, finished, temperature.value, spreadTime]);

  const startRun = useCallback(() => {
    startRef.current = performance.now() - (elapsed / timeScale) * 1000;
    setRunning(true);
  }, [elapsed, timeScale]);

  const pause = useCallback(() => setRunning(false), []);

  const resetRun = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
  }, []);

  const selectTemperature = useCallback((index: number) => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setTemperatureIndex(index);
  }, []);

  const switchDemonstration = useCallback((next: Demonstration) => {
    setRunning(false);
    setDemoActive(false);
    setElapsed(0);
    setDemonstration(next);
  }, []);

  const clearResults = useCallback(() => {
    setTimes({});
    resetRun();
  }, [resetRun]);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setElapsed(0);
    startRef.current = performance.now();
    setRunning(true);
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const recordedCount = Object.keys(times).length;
  const complete = demonstration === "permanganate" ? recordedCount >= WATER_TEMPERATURES.length : finished;
  const step = finished ? 3 : running ? 2 : elapsed > 0 ? 1 : 0;
  const progress = demonstration === "permanganate" ? spread : gasProgress;

  const status =
    demonstration === "gases"
      ? finished
        ? `A white ring of ammonium chloride has formed ${(RING_POSITION_FRACTION * 100).toFixed(0)}% of the way from the ammonia end — closer to the acid. Ammonia (Mr ${MR_AMMONIA}) diffused faster than HCl (Mr ${MR_HYDROGEN_CHLORIDE}).`
        : running
          ? `${Math.floor(elapsed)} s — both gases are spreading along the tube towards each other.`
          : "Cotton wool soaked in ammonia sits at one end and hydrochloric acid at the other. Start and watch where they meet."
      : finished
        ? `At ${temperature.label} the colour spread evenly in about ${Math.round(spreadTime)} s.`
        : running
          ? `${Math.floor(elapsed)} s at ${temperature.label} — the purple colour is spreading outwards on its own.`
          : `Water at ${temperature.label} with one crystal on the bottom. Start the clock and do not stir.`;

  const observation =
    demonstration === "gases"
      ? "The off-centre ring is the evidence: lighter molecules diffuse faster than heavier ones."
      : complete
        ? "Diffusion is fastest in the hottest water — particles have more kinetic energy and move faster."
        : recordedCount > 0
          ? `${recordedCount} of ${WATER_TEMPERATURES.length} temperatures timed. Compare the times.`
          : "Time the spread at each temperature and compare.";

  const primaryLabel = running
    ? "Running…"
    : finished
      ? "Reset"
      : elapsed > 0
        ? "Continue"
        : demonstration === "gases"
          ? "Insert both plugs"
          : "Drop the crystal";

  /* ------------------------------------------------------------ UI panels */

  const demonstrationPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Demonstration</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(["permanganate", "gases"] as Demonstration[]).map((item) => (
          <button
            key={item}
            onClick={() => switchDemonstration(item)}
            className="rounded-xl px-2 py-2 text-[9px] font-black transition"
            style={
              demonstration === item
                ? { background: ACCENT.base, color: "#2a052b" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {item === "permanganate" ? "In a liquid" : "In a gas"}
          </button>
        ))}
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">
        {demonstration === "permanganate"
          ? "Potassium manganate(VII) spreading through still water. Vary the temperature."
          : "Ammonia and hydrogen chloride meeting in a glass tube. Fume cupboard only."}
      </div>
    </div>
  );

  const temperaturePanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Water temperature</span>
        <span className="text-lg font-black" style={{ color: ACCENT.text }}>
          {temperature.label}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {WATER_TEMPERATURES.map((item, index) => {
          const recorded = item.value in times;
          const active = index === temperatureIndex;
          return (
            <button
              key={item.value}
              onClick={() => selectTemperature(index)}
              className="relative rounded-xl px-1 py-2 text-[10px] font-black transition"
              style={
                active
                  ? { background: ACCENT.base, color: "#2a052b" }
                  : { background: "rgba(255,255,255,0.08)", color: recorded ? "#f5d0fe" : "#e2e8f0" }
              }
            >
              {item.value}
              {recorded && !active && <span className="absolute right-0.5 top-0.5 text-[7px]">✓</span>}
            </button>
          );
        })}
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">{temperature.note}</div>
    </div>
  );

  const clockPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Stop-clock</span>
        <span className="text-lg font-black tabular-nums" style={{ color: ACCENT.text }}>
          {Math.floor(elapsed)} s
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full" style={{ width: `${Math.max(2, progress * 100)}%`, background: ACCENT.base }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase">
        <span className="text-slate-400">{demonstration === "permanganate" ? "colour spread" : "gases advancing"}</span>
        <span style={{ color: ACCENT.text }}>{(progress * 100).toFixed(0)}%</span>
      </div>
    </div>
  );

  const timesPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Times recorded</span>
        <button onClick={clearResults} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="grid grid-cols-2 gap-1 text-[8px] font-black uppercase text-slate-500">
          <span>Temperature</span>
          <span className="text-right">Time / s</span>
        </div>
        {WATER_TEMPERATURES.map((item) => {
          const recorded = item.value in times;
          return (
            <div key={item.value} className="grid grid-cols-2 gap-1 text-[10px]">
              <span className="font-black text-white">{item.label}</span>
              <span className="text-right font-black" style={{ color: recorded ? ACCENT.text : "#64748b" }}>
                {recorded ? Math.round(times[item.value]) : "—"}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 text-[9px] leading-snug text-slate-400">
        Shorter time means faster diffusion. The hottest water should be quickest.
      </div>
    </div>
  );

  const ringPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Where the ring forms</div>
      <div className="mt-2 space-y-1.5 text-[9px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Ammonia, Mr</span>
          <span className="font-black text-emerald-300">{MR_AMMONIA}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Hydrogen chloride, Mr</span>
          <span className="font-black text-amber-300">{MR_HYDROGEN_CHLORIDE}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-1.5">
          <span className="text-slate-400">Distance from NH₃ end</span>
          <span className="font-black" style={{ color: ACCENT.text }}>
            {finished ? `${(RING_POSITION_FRACTION * 100).toFixed(0)}%` : "—"}
          </span>
        </div>
      </div>
      {/* A simple scale bar showing the ring's position along the tube */}
      <div className="relative mt-2 h-3 overflow-hidden rounded-full bg-gradient-to-r from-emerald-500/30 to-amber-500/30">
        {finished && (
          <div
            className="absolute top-0 h-full w-1 rounded-full bg-white"
            style={{ left: `${RING_POSITION_FRACTION * 100}%` }}
          />
        )}
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/25" />
      </div>
      <div className="mt-1 flex justify-between text-[8px] font-black uppercase text-slate-500">
        <span>NH₃</span>
        <span>midpoint</span>
        <span>HCl</span>
      </div>
      <div className="mt-2 rounded-xl bg-slate-950/50 p-2 text-[9px] leading-snug text-slate-300">
        The ring is past the midpoint because ammonia is lighter, so it diffuses faster and travels further before the
        two gases meet.
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Diffusion Lab"
          subtitle="high concentration → low concentration"
          symbol="🌫️"
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

      <div data-experiment-tour="diffusion-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [1.5, 2.7, 2.7], fov: 50, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <DiffusionScene
            demonstration={demonstration}
            spread={spread}
            gasProgress={gasProgress}
            temperature={temperature.value}
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
            emoji="🌫️"
            cornerEmoji={demonstration === "gases" ? "💨" : "🟣"}
            status={status}
            running={running}
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
          title="Diffusion"
          tagline="high concentration → low concentration"
          missions={MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : finished ? "↺" : "▶"}
          onPrimary={running ? pause : finished ? resetRun : startRun}
          onReset={resetRun}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "demo", label: "Demo", value: demonstration === "permanganate" ? "liquid" : "gas", content: demonstrationPanel },
            { id: "clock", label: "Clock", value: `${Math.floor(elapsed)}s`, content: clockPanel },
            {
            id: "detail",
            label: demonstration === "permanganate" ? "Temp" : "Ring",
            value: demonstration === "permanganate" ? temperature.label : finished ? "formed" : "—",
            content: demonstration === "permanganate" ? temperaturePanel : ringPanel,
            },
            {
            id: "times",
            label: "Times",
            value: `${recordedCount}/${WATER_TEMPERATURES.length}`,
            content: timesPanel,
            disabled: demonstration !== "permanganate",
            },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "run",
              label: running ? "Pause" : finished ? "Reset" : "Start",
              onClick: running ? pause : finished ? resetRun : startRun,
              tone: running ? "red" : "green",
            },
            {
              id: "next",
              label: "Next temp",
              onClick: () => selectTemperature((temperatureIndex + 1) % WATER_TEMPERATURES.length),
              disabled: demonstration !== "permanganate",
              tone: "orange",
            },
            {
              id: "swap",
              label: demonstration === "permanganate" ? "Gas demo" : "Liquid demo",
              onClick: () => switchDemonstration(demonstration === "permanganate" ? "gases" : "permanganate"),
              tone: "dark",
            },
          ]}
          panels={[
            { id: "demo", label: "Demo", value: demonstration === "permanganate" ? "liquid" : "gas", content: demonstrationPanel },
            { id: "clock", label: "Clock", value: `${Math.floor(elapsed)}s`, content: clockPanel },
            {
              id: "detail",
              label: demonstration === "permanganate" ? "Temp" : "Ring",
              value: demonstration === "permanganate" ? temperature.label : finished ? "formed" : "—",
              content: demonstration === "permanganate" ? temperaturePanel : ringPanel,
            },
            {
              id: "times",
              label: "Times",
              value: `${recordedCount}/${WATER_TEMPERATURES.length}`,
              content: timesPanel,
              disabled: demonstration !== "permanganate",
            },
          ]}
        />
      )}

      {showPaper && (
        <DiffusionPaper demonstration={demonstration} times={times} onClose={onClosePaper} />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
