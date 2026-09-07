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
import { ExperimentResultsGraph, type GraphPoint } from "../../common/ExperimentResultsGraph";

interface OsmosisSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.cyan;
const PAPER_FILENAME = "osmosis-in-potato-tissue.html";

/* ------------------------------------------------------------------ Science */

type Apparatus = "potato" | "visking";

/** Sucrose concentrations in mol/dm³. */
const CONCENTRATIONS = [0, 0.2, 0.4, 0.6, 0.8, 1.0];

/**
 * The concentration of sucrose whose water potential matches potato cell sap.
 * Cylinders in this solution neither gain nor lose mass, so the line crosses
 * zero here — this is what the experiment is really measuring.
 */
const ISOTONIC_CONCENTRATION = 0.35;
const MAX_PERCENT_CHANGE = 20;
const CURVE_SCALE = 0.42;

const STARTING_MASS_G = 5;
const SOAK_MINUTES = 30;
const RUN_DURATION_MS = 9000;

/**
 * Percentage change in mass after soaking. Water moves by osmosis from the
 * higher water potential (dilute solution) to the lower one (cell sap), through
 * the partially permeable cell membranes.
 */
function percentChange(concentration: number): number {
  return MAX_PERCENT_CHANGE * Math.tanh((ISOTONIC_CONCENTRATION - concentration) / CURVE_SCALE);
}

function finalMass(concentration: number): number {
  return STARTING_MASS_G * (1 + percentChange(concentration) / 100);
}

function tonicityLabel(concentration: number): string {
  const change = percentChange(concentration);
  if (change > 1.5) return "gained mass — turgid";
  if (change < -1.5) return "lost mass — flaccid";
  return "no change — isotonic";
}

const MISSIONS: GameMission[] = [
  { short: "Cut", title: "Cut equal potato cylinders", detail: "Use a cork borer to cut six cylinders of the same length and diameter, blot them dry and weigh each one.", symbol: "🥔" },
  { short: "Soak", title: "Soak for 30 minutes", detail: "Put one cylinder in each sucrose concentration, all at the same temperature and for the same time.", symbol: "⏳" },
  { short: "Weigh", title: "Blot and re-weigh", detail: "Remove each cylinder, blot off the surface liquid and weigh it again. Blotting matters — surface water adds mass that is not inside the cells.", symbol: "⚖️" },
  { short: "Plot", title: "Find the isotonic point", detail: "Plot percentage change in mass against concentration and read off where the line crosses zero.", symbol: "📈" },
];

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "What is osmosis?",
    text: "Osmosis is the movement of water molecules from a dilute solution to a concentrated solution through a partially permeable membrane. Potato cells gain water in dilute solutions and lose it in concentrated ones.",
    mode: "modal",
  },
  {
    title: "Six identical cylinders",
    text: "Every cylinder is cut to the same size and weighed before soaking, so the only thing that differs between the beakers is the sucrose concentration.",
    mode: "bubble",
    selector: '[data-experiment-tour="osmosis-scene"]',
  },
  {
    title: "Why percentage change?",
    text: "The cylinders never start at exactly the same mass, so a percentage change lets you compare them fairly: (change ÷ starting mass) × 100.",
    mode: "bubble",
    selector: '[data-experiment-tour="procedure"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "The isotonic point",
    text: "Where your graph crosses the zero line, the solution has the same water potential as the potato's cell sap. Water still moves, but in and out at equal rates.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** One beaker of sucrose solution with a potato cylinder in it. */
function SucroseBeaker({
  concentration,
  x,
  soakFraction,
  weighed,
  selected,
}: {
  concentration: number;
  x: number;
  soakFraction: number;
  weighed: boolean;
  selected: boolean;
}) {
  const change = percentChange(concentration) * soakFraction;
  // A turgid cylinder swells; a flaccid one shrinks and becomes soft.
  const scale = 1 + change / 220;
  // More concentrated sucrose is drawn very slightly more syrupy.
  const solutionOpacity = 0.32 + (concentration / 1.0) * 0.2;

  return (
    <group position={[x, BENCH_TOP_Y + 0.02, 0]}>
      {/* Beaker */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.32, 24, 1, true]} />
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
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.012, 24]} />
        <meshPhysicalMaterial color="#e4f2fb" transparent opacity={0.42} roughness={0.08} />
      </mesh>
      {/* Sucrose solution */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.124, 0.124, 0.23, 24]} />
        <meshStandardMaterial color="#d5eef8" transparent opacity={solutionOpacity} roughness={0.16} />
      </mesh>

      {/* Potato cylinder standing in the solution */}
      <mesh position={[0, 0.09, 0]} scale={[scale, scale, scale]} castShadow>
        <cylinderGeometry args={[0.032, 0.032, 0.16, 16]} />
        <meshStandardMaterial color={change < -6 ? "#d9c98f" : "#f0e2a8"} roughness={0.78} />
      </mesh>

      {/* Concentration label on the beaker */}
      <Html position={[0, 0.45, 0]} center distanceFactor={6.5} style={{ pointerEvents: "none" }}>
        <div
          className={`w-[80px] rounded-lg border px-1 py-0.5 text-center ${
            selected ? "border-cyan-300/60 bg-cyan-950/92" : "border-white/20 bg-slate-950/90"
          }`}
        >
          <div className="text-[8px] font-black leading-tight text-white">{concentration.toFixed(1)} M</div>
          <div
            className="text-[8px] font-black tabular-nums"
            style={{ color: weighed ? (change > 0 ? "#67e8f9" : "#fca5a5") : "#64748b" }}
          >
            {weighed ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%` : "—"}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Electronic balance; shows the mass of the cylinder currently being weighed. */
function Balance({ reading, active }: { reading: number | null; active: boolean }) {
  return (
    <group position={[0, BENCH_TOP_Y + 0.02, -0.62]}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.1, 0.36]} />
        <meshStandardMaterial color="#e8ecf1" roughness={0.45} />
      </mesh>
      {/* Weighing pan */}
      <mesh position={[0, 0.11, 0.03]}>
        <cylinderGeometry args={[0.13, 0.13, 0.012, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Sample sitting on the pan */}
      {active && (
        <mesh position={[0, 0.2, 0.03]} castShadow>
          <cylinderGeometry args={[0.032, 0.032, 0.16, 16]} />
          <meshStandardMaterial color="#f0e2a8" roughness={0.78} />
        </mesh>
      )}
      {/* Display */}
      <mesh position={[0, 0.075, -0.15]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.24, 0.08, 0.01]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
      <Html position={[0, 0.34, -0.06]} center distanceFactor={6.5} style={{ pointerEvents: "none" }}>
        <div className="w-[96px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[7px] font-black uppercase leading-tight text-slate-400">Balance</div>
          <div className="text-[11px] font-black tabular-nums text-cyan-200">
            {reading === null ? "0.00 g" : `${reading.toFixed(2)} g`}
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Cork borer and tile — how the identical cylinders are cut. */
function CorkBorerStation() {
  return (
    <group position={[-1.28, BENCH_TOP_Y + 0.02, -0.5]}>
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[0.34, 0.03, 0.28]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Half a potato */}
      <mesh position={[-0.05, 0.07, 0]} scale={[1, 0.6, 0.8]} castShadow>
        <sphereGeometry args={[0.09, 16, 12]} />
        <meshStandardMaterial color="#c8a56a" roughness={0.85} />
      </mesh>
      {/* Cork borer */}
      <mesh position={[0.09, 0.1, 0.02]} rotation={[0, 0, 0.35]} castShadow>
        <cylinderGeometry args={[0.017, 0.017, 0.2, 12, 1, true]} />
        <meshStandardMaterial color="#9aa3ae" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0, 0.3, 0]} center distanceFactor={6.5} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/90 px-2 py-0.5 text-[7px] font-black uppercase text-slate-200">
          cork borer · equal cylinders
        </div>
      </Html>
    </group>
  );
}

/**
 * Visking tubing of concentrated sucrose standing in a beaker of water, with a
 * capillary tube showing water entering by osmosis.
 */
function ViskingApparatus({ soakFraction }: { soakFraction: number }) {
  const rise = soakFraction * 0.42;

  return (
    <group position={[0, BENCH_TOP_Y + 0.02, 0]}>
      {/* Beaker of distilled water */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.56, 30, 1, true]} />
        <meshPhysicalMaterial
          color="#e4f2fb"
          transparent
          opacity={0.18}
          transmission={0.86}
          roughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.012, 30]} />
        <meshPhysicalMaterial color="#e4f2fb" transparent opacity={0.4} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.312, 0.312, 0.46, 30]} />
        <meshStandardMaterial color="#d3ecf8" transparent opacity={0.42} roughness={0.15} />
      </mesh>

      {/* Visking tubing — swells as water enters */}
      <mesh position={[0, 0.24, 0]} scale={[1 + soakFraction * 0.16, 1, 1 + soakFraction * 0.16]}>
        <capsuleGeometry args={[0.075, 0.26, 8, 20]} />
        <meshPhysicalMaterial color="#efe6d2" transparent opacity={0.72} roughness={0.4} transmission={0.25} />
      </mesh>
      {/* Concentrated sucrose inside */}
      <mesh position={[0, 0.24, 0]} scale={[1 + soakFraction * 0.14, 1, 1 + soakFraction * 0.14]}>
        <capsuleGeometry args={[0.062, 0.24, 8, 18]} />
        <meshStandardMaterial color="#d8c48f" transparent opacity={0.66} roughness={0.3} />
      </mesh>
      {/* Thread tying the bottom */}
      <mesh position={[0, 0.075, 0]}>
        <torusGeometry args={[0.03, 0.006, 8, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.9} />
      </mesh>

      {/* Capillary tube through the bung, with the rising column */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.017, 0.017, 0.72, 14, 1, true]} />
        <meshPhysicalMaterial color="#eef4fa" transparent opacity={0.44} roughness={0.08} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.46 + rise / 2, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.08 + rise, 12]} />
        <meshStandardMaterial color="#d8c48f" roughness={0.3} />
      </mesh>
      {/* Clamp holding the tube */}
      <mesh position={[0.24, 0.86, -0.16]} castShadow>
        <boxGeometry args={[0.34, 0.04, 0.06]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.42, 0.5, -0.16]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.0, 12]} />
        <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, 0.01, -0.16]} receiveShadow>
        <boxGeometry args={[0.34, 0.03, 0.26]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Level marker */}
      <mesh position={[0.028, 0.5 + rise, 0]}>
        <boxGeometry args={[0.03, 0.004, 0.004]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      <Html position={[0, 1.3, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="w-[128px] rounded-lg border border-white/20 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[8px] font-black uppercase leading-tight text-white">Visking tubing</div>
          <div className="mt-0.5 text-[7px] font-black uppercase text-cyan-300">
            water in · sucrose cannot get out
          </div>
          <div className="mt-0.5 text-[10px] font-black tabular-nums text-cyan-200">
            risen {(rise * 100).toFixed(0)} mm
          </div>
        </div>
      </Html>
    </group>
  );
}

function OsmosisScene({
  apparatus,
  soakFraction,
  weighed,
  selectedIndex,
  balanceReading,
  weighing,
  mode,
  isMobile,
  moveVectorRef,
}: {
  apparatus: Apparatus;
  soakFraction: number;
  weighed: Record<number, boolean>;
  selectedIndex: number;
  balanceReading: number | null;
  weighing: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.2, 3.3, 4.4] : [0.3, 3.05, 4.3];
    camera.position.set(...position);
    camera.lookAt(0, 1.98, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 56 : 50;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#0891b2"
        benchColor="#edf3f6"
        posterA={{
          title: "OSMOSIS",
          lines: [
            "Water moves from dilute to concentrated",
            "Through a partially permeable membrane",
            "Down a water potential gradient",
            "Only water molecules pass through",
          ],
        }}
        posterB={{
          title: "PLANT CELLS",
          lines: [
            "Water in → cell becomes turgid",
            "Water out → cell becomes flaccid",
            "Lose too much → plasmolysis",
            "% change = (change ÷ start mass) × 100",
          ],
        }}
      >
        {apparatus === "potato" ? (
          <>
            <CorkBorerStation />
            <Balance reading={balanceReading} active={weighing} />
            {CONCENTRATIONS.map((concentration, index) => (
              <SucroseBeaker
                key={concentration}
                concentration={concentration}
                x={(index - (CONCENTRATIONS.length - 1) / 2) * 0.36}
                soakFraction={soakFraction}
                weighed={Boolean(weighed[concentration])}
                selected={index === selectedIndex}
              />
            ))}
          </>
        ) : (
          <ViskingApparatus soakFraction={soakFraction} />
        )}
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.3} scale={7} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 1.95, 0]} minDistance={1.9} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------- Paper */

function OsmosisPaper({
  apparatus,
  weighed,
  onClose,
}: {
  apparatus: Apparatus;
  weighed: Record<number, boolean>;
  onClose: () => void;
}) {
  const recorded = CONCENTRATIONS.filter((concentration) => weighed[concentration]);

  if (apparatus === "visking") {
    return (
      <ExperimentPaperModal filename="osmosis-visking-tubing.html" onClose={onClose}>
        <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
          <h1 className="text-center text-xl font-bold uppercase">Demonstrating Osmosis with Visking Tubing</h1>

          <h2 className="mt-6 font-bold uppercase">Aim</h2>
          <p>To show that water moves through a partially permeable membrane by osmosis.</p>

          <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
          <p>
            Visking tubing, thread, concentrated sucrose solution, capillary tube, bung, beaker of distilled water,
            clamp and stand, ruler, stop-clock.
          </p>

          <h2 className="mt-5 font-bold uppercase">Method</h2>
          <ol className="list-decimal space-y-1 pl-6">
            <li>A length of visking tubing was soaked in water to soften it and tied tightly at one end.</li>
            <li>The tubing was filled with concentrated sucrose solution.</li>
            <li>A capillary tube was fitted through a bung into the open end and clamped upright.</li>
            <li>The tubing was lowered into a beaker of distilled water and the starting level marked.</li>
            <li>The height of the liquid in the capillary tube was measured every five minutes for 30 minutes.</li>
          </ol>

          <h2 className="mt-5 font-bold uppercase">Results</h2>
          <p>
            The level in the capillary tube rose steadily, and the visking tubing became swollen and firm.
          </p>

          <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
          <p>
            Water moved from the distilled water, where the water potential is high, through the partially permeable
            visking tubing and into the concentrated sucrose solution, where the water potential is low. This is osmosis.
            The level rose because water entered faster than it left. Sucrose molecules are too large to pass through the
            pores in the membrane, so they stayed inside the tubing — if starch and sucrose could escape, the surrounding
            water would give a positive food test, and it does not.
          </p>

          <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>The tubing must be tied tightly, or the solution leaks out and the rise is not caused by osmosis alone.</li>
            <li>The outside of the tubing should be rinsed before it is lowered in, to remove spilt sucrose.</li>
            <li>A narrower capillary tube gives a larger, more easily measured rise for the same volume of water.</li>
            <li>Visking tubing is not alive, so it models a cell membrane but has no active transport or cytoplasm.</li>
          </ul>
        </div>
      </ExperimentPaperModal>
    );
  }

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Investigating Osmosis in Potato Tissue</h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To find the effect of sucrose concentration on the mass of potato cylinders, and from that to estimate the
          concentration of the potato's cell sap.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Potato, cork borer, scalpel, white tile, ruler, electronic balance (to 0.01 g), six beakers or boiling tubes,
          sucrose solutions of 0.0, 0.2, 0.4, 0.6, 0.8 and 1.0 mol/dm³, paper towel, stop-clock, forceps.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Six cylinders were cut from the same potato with a cork borer and trimmed to the same length.</li>
          <li>Each cylinder was blotted dry and its mass measured to 0.01 g and recorded.</li>
          <li>One cylinder was placed in each of the six sucrose concentrations.</li>
          <li>All six were left for 30 minutes at the same room temperature.</li>
          <li>Each cylinder was removed with forceps, blotted gently to remove surface liquid, and re-weighed.</li>
          <li>
            The percentage change in mass was calculated for each: (change in mass ÷ starting mass) × 100.
          </li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Independent</td>
              <td className="border border-slate-400 p-2">Concentration of sucrose solution (mol/dm³)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Dependent</td>
              <td className="border border-slate-400 p-2">Percentage change in mass of the potato cylinder</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Controlled</td>
              <td className="border border-slate-400 p-2">
                Same potato, same size of cylinder, volume of solution, temperature, time in solution, same blotting
                method
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {recorded.length === 0 ? (
          <p className="italic">No cylinders weighed yet — soak them, then weigh each one.</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Concentration (mol/dm³)</th>
                <th className="border border-slate-400 p-2">Starting mass (g)</th>
                <th className="border border-slate-400 p-2">Final mass (g)</th>
                <th className="border border-slate-400 p-2">Change (g)</th>
                <th className="border border-slate-400 p-2">% change in mass</th>
              </tr>
            </thead>
            <tbody>
              {recorded.map((concentration) => {
                const final = finalMass(concentration);
                const change = final - STARTING_MASS_G;
                return (
                  <tr key={concentration}>
                    <td className="border border-slate-400 p-2 text-center">{concentration.toFixed(1)}</td>
                    <td className="border border-slate-400 p-2 text-center">{STARTING_MASS_G.toFixed(2)}</td>
                    <td className="border border-slate-400 p-2 text-center">{final.toFixed(2)}</td>
                    <td className="border border-slate-400 p-2 text-center">
                      {change > 0 ? "+" : ""}
                      {change.toFixed(2)}
                    </td>
                    <td className="border border-slate-400 p-2 text-center">
                      {change > 0 ? "+" : ""}
                      {percentChange(concentration).toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Cylinders in the dilute solutions gained mass, because the water potential outside was higher than inside the
          cells, so water entered the cells by osmosis and they became turgid. Cylinders in the concentrated solutions
          lost mass, because the water potential outside was lower, so water left the cells and they became flaccid. The
          graph of percentage change against concentration crosses zero at about{" "}
          {ISOTONIC_CONCENTRATION.toFixed(2)} mol/dm³. At that concentration the solution and the cell sap have the same
          water potential, so there is no net movement of water — this is an estimate of the concentration of the cell
          sap.
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Blotting must be gentle and identical for every cylinder. Too much surface water makes the mass gain look
            larger than it is.
          </li>
          <li>All cylinders should come from the same potato, since different potatoes have different sap concentrations.</li>
          <li>
            Percentage change is used rather than change in grams so that small differences in starting mass do not
            affect the comparison.
          </li>
          <li>More concentrations near 0.3–0.4 mol/dm³ would locate the isotonic point more precisely.</li>
          <li>Each concentration should be repeated three times and a mean percentage change calculated.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function OsmosisSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: OsmosisSimProps) {
  const [apparatus, setApparatus] = useState<Apparatus>("potato");
  const [minutes, setMinutes] = useState(0);
  const [running, setRunning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [weighed, setWeighed] = useState<Record<number, boolean>>({});
  const [weighing, setWeighing] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const soakFraction = minutes / SOAK_MINUTES;
  const soaked = minutes >= SOAK_MINUTES;
  const concentration = CONCENTRATIONS[selectedIndex];
  const recordedCount = Object.keys(weighed).length;

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const animate = (now: number) => {
      const fraction = Math.min(1, (now - startRef.current) / RUN_DURATION_MS);
      setMinutes(fraction * SOAK_MINUTES);
      if (fraction >= 1) {
        setRunning(false);
        setDemoActive(false);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [running]);

  const startSoak = useCallback(() => {
    startRef.current = performance.now() - soakFraction * RUN_DURATION_MS;
    setRunning(true);
  }, [soakFraction]);

  const pause = useCallback(() => setRunning(false), []);

  const weighCurrent = useCallback(() => {
    if (!soaked) return;
    setWeighing(true);
    setWeighed((current) => ({ ...current, [concentration]: true }));
    window.setTimeout(() => setWeighing(false), 900);
  }, [soaked, concentration]);

  const resetAll = useCallback(() => {
    setRunning(false);
    setDemoActive(false);
    setMinutes(0);
    setWeighed({});
    setWeighing(false);
  }, []);

  const switchApparatus = useCallback((next: Apparatus) => {
    setRunning(false);
    setDemoActive(false);
    setApparatus(next);
    setMinutes(0);
    setWeighed({});
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) {
      setDemoActive(false);
      setRunning(false);
      return;
    }
    setDemoActive(true);
    setMinutes(0);
    setWeighed({});
    startRef.current = performance.now();
    setRunning(true);
  }, [demoActive]);

  /* In demo mode, weigh every cylinder once the soak has finished. */
  useEffect(() => {
    if (!demoActive || running || !soaked || apparatus !== "potato") return;
    if (recordedCount >= CONCENTRATIONS.length) {
      setDemoActive(false);
      return;
    }
    const timer = window.setTimeout(() => {
      const next = CONCENTRATIONS.find((item) => !weighed[item]);
      if (next === undefined) return;
      setSelectedIndex(CONCENTRATIONS.indexOf(next));
      setWeighed((current) => ({ ...current, [next]: true }));
    }, 550);
    return () => window.clearTimeout(timer);
  }, [demoActive, running, soaked, apparatus, recordedCount, weighed]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = apparatus === "potato" ? recordedCount >= CONCENTRATIONS.length : soaked;
  const step = apparatus === "potato" ? (recordedCount >= CONCENTRATIONS.length ? 3 : recordedCount > 0 ? 2 : soaked ? 2 : minutes > 0 ? 1 : 0) : soaked ? 3 : minutes > 0 ? 2 : 0;
  const progress = soaked && apparatus === "potato" ? recordedCount / CONCENTRATIONS.length : soakFraction;

  const graphPoints: GraphPoint[] = CONCENTRATIONS.map((item) => {
    if (!weighed[item]) return { x: item, y: 0, pending: true };
    return { x: item, y: percentChange(item) };
  });

  /** The isotonic point read off the recorded points, by linear interpolation. */
  const estimatedIsotonic = useMemo(() => {
    const measured = CONCENTRATIONS.filter((item) => weighed[item]).map((item) => ({
      x: item,
      y: percentChange(item),
    }));
    for (let index = 0; index < measured.length - 1; index += 1) {
      const a = measured[index];
      const b = measured[index + 1];
      if (a.y > 0 && b.y <= 0) {
        return a.x + ((0 - a.y) / (b.y - a.y)) * (b.x - a.x);
      }
    }
    return null;
  }, [weighed]);

  const status =
    apparatus === "visking"
      ? soaked
        ? "The level in the capillary tube has risen and the tubing is swollen. Water entered the concentrated sucrose by osmosis, but the sucrose could not get out."
        : running
          ? `${Math.round(minutes)} min — water is entering the visking tubing and the level is climbing.`
          : "Visking tubing of concentrated sucrose sits in distilled water. Run the clock and watch the level."
      : !soaked
        ? running
          ? `${Math.round(minutes)} min of ${SOAK_MINUTES}. The cylinders in dilute solutions are swelling; those in concentrated sucrose are shrinking.`
          : "Six identical cylinders, each 5.00 g, are in the six solutions. Soak them for 30 minutes."
        : weighed[concentration]
          ? `${concentration.toFixed(1)} M: final mass ${finalMass(concentration).toFixed(2)} g, a ${percentChange(concentration) > 0 ? "gain" : "loss"} of ${Math.abs(percentChange(concentration)).toFixed(1)}% — ${tonicityLabel(concentration)}.`
          : `Soak complete. Blot the ${concentration.toFixed(1)} M cylinder and weigh it.`;

  const observation =
    apparatus === "visking"
      ? "Water crosses the membrane; sucrose molecules are too big. That is what 'partially permeable' means."
      : complete
        ? `The line crosses zero at about ${(estimatedIsotonic ?? ISOTONIC_CONCENTRATION).toFixed(2)} mol/dm³ — an estimate of the cell sap concentration.`
        : recordedCount > 0
          ? `${recordedCount} of ${CONCENTRATIONS.length} cylinders weighed. Look for where the values change from + to −.`
          : "Weigh every cylinder, then plot percentage change against concentration.";

  const primaryLabel =
    apparatus === "visking"
      ? running
        ? "Running…"
        : soaked
          ? "Reset"
          : minutes > 0
            ? "Continue"
            : "Start 30 min clock"
      : running
        ? "Soaking…"
        : !soaked
          ? minutes > 0
            ? "Continue soaking"
            : "Soak for 30 min"
          : weighed[concentration]
            ? "Next cylinder"
            : `Weigh ${concentration.toFixed(1)} M cylinder`;

  const onPrimary = () => {
    if (running) {
      pause();
      return;
    }
    if (apparatus === "visking") {
      if (soaked) resetAll();
      else startSoak();
      return;
    }
    if (!soaked) {
      startSoak();
      return;
    }
    if (weighed[concentration]) {
      const next = CONCENTRATIONS.findIndex((item) => !weighed[item]);
      setSelectedIndex(next === -1 ? (selectedIndex + 1) % CONCENTRATIONS.length : next);
      return;
    }
    weighCurrent();
  };

  /* ------------------------------------------------------------ UI panels */

  const apparatusPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="text-[10px] font-black uppercase tracking-wide text-slate-300">Apparatus</div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {(["potato", "visking"] as Apparatus[]).map((item) => (
          <button
            key={item}
            onClick={() => switchApparatus(item)}
            className="rounded-xl px-2 py-2 text-[10px] font-black transition"
            style={
              apparatus === item
                ? { background: ACCENT.base, color: "#04222b" }
                : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
            }
          >
            {item === "potato" ? "Potato cylinders" : "Visking tube"}
          </button>
        ))}
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">
        {apparatus === "potato"
          ? "The quantitative version: measure percentage change in mass and find the isotonic point."
          : "The demonstration: a model cell shows water crossing a partially permeable membrane."}
      </div>
    </div>
  );

  const soakPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Soaking time</span>
        <span className="text-lg font-black tabular-nums" style={{ color: ACCENT.text }}>
          {Math.round(minutes)} min
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-900">
        <div className="h-full rounded-full" style={{ width: `${Math.max(2, soakFraction * 100)}%`, background: ACCENT.base }} />
      </div>
      <div className="mt-2 text-[9px] leading-snug text-slate-400">
        Every cylinder must stay in for the same 30 minutes at the same temperature.
      </div>
    </div>
  );

  const cylinderPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Weigh a cylinder</span>
        <span className="text-[11px] font-black" style={{ color: ACCENT.text }}>
          {concentration.toFixed(1)} M
        </span>
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1">
        {CONCENTRATIONS.map((item, index) => (
          <button
            key={item}
            onClick={() => setSelectedIndex(index)}
            className="relative rounded-lg px-0.5 py-2 text-[9px] font-black transition"
            style={
              index === selectedIndex
                ? { background: ACCENT.base, color: "#04222b" }
                : { background: "rgba(255,255,255,0.08)", color: weighed[item] ? "#a5f3fc" : "#e2e8f0" }
            }
          >
            {item.toFixed(1)}
            {weighed[item] && index !== selectedIndex && <span className="absolute right-0 top-0 text-[7px]">✓</span>}
          </button>
        ))}
      </div>
      <button
        onClick={weighCurrent}
        disabled={!soaked || Boolean(weighed[concentration])}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black transition disabled:opacity-40"
        style={{ background: ACCENT.base, color: "#04222b" }}
      >
        {weighed[concentration] ? "Already weighed" : soaked ? "Blot & weigh" : "Soak first"}
      </button>
      {weighed[concentration] && (
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl bg-slate-950/50 p-2 text-center text-[9px]">
          <div>
            <div className="text-slate-500">start</div>
            <div className="font-black text-white">{STARTING_MASS_G.toFixed(2)} g</div>
          </div>
          <div>
            <div className="text-slate-500">final</div>
            <div className="font-black text-white">{finalMass(concentration).toFixed(2)} g</div>
          </div>
          <div>
            <div className="text-slate-500">% change</div>
            <div className="font-black" style={{ color: percentChange(concentration) > 0 ? "#67e8f9" : "#fca5a5" }}>
              {percentChange(concentration) > 0 ? "+" : ""}
              {percentChange(concentration).toFixed(1)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const graphPanel = (
    <ExperimentResultsGraph
      points={graphPoints}
      xLabel="Sucrose concentration (mol/dm³)"
      yLabel="% change in mass"
      accentHex={ACCENT.base}
      caption="Percentage change against concentration"
      xMin={0}
      xMax={1}
      yMin={-MAX_PERCENT_CHANGE}
      yMax={MAX_PERCENT_CHANGE}
      footer={
        estimatedIsotonic !== null
          ? `Crosses zero at about ${estimatedIsotonic.toFixed(2)} mol/dm³ — the cell sap concentration.`
          : "Where the line crosses zero, the solution matches the potato's cell sap."
      }
    />
  );

  const resultsTable = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Results table</span>
        <button onClick={resetAll} className="rounded-lg bg-white/8 px-2 py-1 text-[9px] font-black text-slate-300">
          Clear
        </button>
      </div>
      <div className="mt-1.5 space-y-1">
        <div className="grid grid-cols-4 gap-1 text-[8px] font-black uppercase text-slate-500">
          <span>Conc</span>
          <span className="text-center">Final g</span>
          <span className="text-center">% chg</span>
          <span className="text-right">State</span>
        </div>
        {CONCENTRATIONS.map((item) => {
          const recorded = Boolean(weighed[item]);
          const change = percentChange(item);
          return (
            <div key={item} className="grid grid-cols-4 gap-1 text-[9px]">
              <span className="font-black text-white">{item.toFixed(1)}</span>
              <span className="text-center text-slate-300">{recorded ? finalMass(item).toFixed(2) : "—"}</span>
              <span className="text-center font-black" style={{ color: recorded ? (change > 0 ? "#67e8f9" : "#fca5a5") : "#64748b" }}>
                {recorded ? `${change > 0 ? "+" : ""}${change.toFixed(1)}` : "—"}
              </span>
              <span className="truncate text-right text-slate-400">
                {recorded ? (change > 1.5 ? "turgid" : change < -1.5 ? "flaccid" : "isotonic") : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Osmosis Lab"
          subtitle="water moves down a water potential gradient"
          symbol="💧"
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

      <div data-experiment-tour="osmosis-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.3, 3.05, 4.3], fov: 50, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <OsmosisScene
            apparatus={apparatus}
            soakFraction={soakFraction}
            weighed={weighed}
            selectedIndex={selectedIndex}
            balanceReading={weighing ? finalMass(concentration) : null}
            weighing={weighing}
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
            emoji="💧"
            cornerEmoji="🥔"
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
          title="Osmosis"
          tagline="water moves down a water potential gradient"
          missions={MISSIONS}
          step={step}
          running={running}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={running ? "⏳" : soaked && apparatus === "potato" ? "⚖️" : "▶"}
          onPrimary={onPrimary}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "apparatus", label: "Setup", value: apparatus === "potato" ? "potato" : "visking", content: apparatusPanel },
            { id: "soak", label: "Soak", value: `${Math.round(minutes)}m`, content: soakPanel },
            { id: "weigh", label: "Weigh", value: `${recordedCount}/6`, content: cylinderPanel, disabled: apparatus !== "potato" },
            { id: "graph", label: "Graph", value: `${recordedCount}/6`, content: graphPanel, disabled: apparatus !== "potato" },
            { id: "table", label: "Table", value: `${recordedCount}`, content: resultsTable, disabled: apparatus !== "potato" },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "primary", label: running ? "Pause" : !soaked ? "Soak 30 min" : "Weigh", onClick: onPrimary, tone: running ? "red" : "green" },
            {
              id: "next",
              label: "Next conc",
              onClick: () => setSelectedIndex((selectedIndex + 1) % CONCENTRATIONS.length),
              disabled: apparatus !== "potato",
              tone: "orange",
            },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "apparatus", label: "Setup", value: apparatus === "potato" ? "potato" : "visking", content: apparatusPanel },
            { id: "soak", label: "Soak", value: `${Math.round(minutes)}m`, content: soakPanel },
            { id: "weigh", label: "Weigh", value: `${recordedCount}/6`, content: cylinderPanel, disabled: apparatus !== "potato" },
            { id: "graph", label: "Graph", value: `${recordedCount}/6`, content: graphPanel, disabled: apparatus !== "potato" },
            { id: "table", label: "Table", value: `${recordedCount}`, content: resultsTable, disabled: apparatus !== "potato" },
          ]}
        />
      )}

      {showPaper && <OsmosisPaper apparatus={apparatus} weighed={weighed} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
