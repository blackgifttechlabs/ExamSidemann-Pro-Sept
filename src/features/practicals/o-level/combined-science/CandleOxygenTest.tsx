"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { MobileGtaNavigation, useMobileExperimentViewport } from "../../common/MobileGtaNavigation";
import { CandleRoom, CANDLE_BOUNDS, CANDLE_OBSTACLES, CANDLE_SPAWN } from "./CandleRoom";
import { PlayerController } from "../../common/PlayerController";
import "./oxygenFromPondweed.css";
import "./candleOxygen.css";
import { candlePosition, collectionJarPose, lidClosure, lidPosition, oxygenAtTime, MOTION_SECONDS, JAR_POSITIONS, type CandleStage } from "./candleMotion";
const BENCH_TOP_Y = 1.36;
import {
  CombinedScienceHud,
  EXPERIMENT_ACCENTS,
} from "../../common/CombinedScienceGame";

interface CandleOxygenSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.orange;
const PAPER_FILENAME = "comparing-oxygen-content-using-a-candle.html";

/* ------------------------------------------------------------------ Science */

type Jar = "inhaled" | "exhaled";

interface JarSpec {
  id: Jar;
  short: string;
  title: string;
  /** Rough percentage of oxygen in this sample of air. */
  oxygenPercent: number;
  /** How long an identical candle keeps burning in the sealed jar, in seconds. */
  burnSeconds: number;
  emoji: string;
  summary: string;
}

// Illustrative oxygen budget for equal gas volumes and an identical wick.
const EXTINCTION_OXYGEN = 13.8;
const OXYGEN_USE_PER_SECOND = (21 - EXTINCTION_OXYGEN) / 22.4;
const modelBurnSeconds = (oxygen: number) => Math.max(0, (oxygen - EXTINCTION_OXYGEN) / OXYGEN_USE_PER_SECOND);

const JARS: Record<Jar, JarSpec> = {
  inhaled: {
    id: "inhaled",
    short: "Inhaled",
    title: "Jar A · inhaled air",
    oxygenPercent: 21,
    burnSeconds: modelBurnSeconds(21),
    emoji: "🌬️",
    summary:
      "Jar A is simply filled with air from the room — the same air you breathe in. It contains about 21% oxygen.",
  },
  exhaled: {
    id: "exhaled",
    short: "Exhaled",
    title: "Jar B · exhaled air",
    oxygenPercent: 16,
    burnSeconds: modelBurnSeconds(16),
    emoji: "🫁",
    summary:
      "Jar B is filled with exhaled air by breathing through a delivery tube into a jar full of water, so the water is pushed out and only your breath is left. It contains about 16% oxygen.",
  },
};

/**
 * The stopwatch runs faster than real time so a whole class experiment fits into
 * a few seconds on screen. The number shown is always the true stopwatch value.
 */
const TIME_SCALE = 2;

type Stage = CandleStage;

const tutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "How much oxygen is left in the air you breathe out?",
    text: "Breathing out does not use up all the oxygen — a candle still burns in exhaled air, just not for as long. Timing the burn in each jar turns 'less oxygen' into a number you can compare.",
    mode: "modal",
  },
  {
    title: "Collect the exhaled air over water",
    text: "A jar full of water is inverted in a trough. Breathing down the delivery tube pushes the water out, so the jar ends up holding your breath and nothing else.",
    mode: "bubble",
    selector: '[data-experiment-tour="candle-scene"]',
  },
  {
    title: "Keep everything else the same",
    text: "Same candle, same size jar, same lid, same starting flame. Only the air inside the jar is different — that is what makes it a fair test.",
    mode: "bubble",
    selector: '[aria-label="Experiment guide"]',
  },
  {
    title: "Why the flame goes out at all",
    text: "The candle uses up oxygen and fills the jar with carbon dioxide. Once the oxygen falls too low to keep the reaction going, the flame dies — sooner in exhaled air.",
    mode: "bubble",
    selector: '[aria-label="Experiment guide"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

/** Candle flame that shrinks as the oxygen in the jar is used up. */
function CandleFlame({ lit, strength }: { lit: boolean; strength: number }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const amount = useRef(0);
  const shape = useMemo(() => new THREE.LatheGeometry([
    new THREE.Vector2(.002, 0), new THREE.Vector2(.012, .012), new THREE.Vector2(.016, .029),
    new THREE.Vector2(.011, .05), new THREE.Vector2(.005, .067), new THREE.Vector2(0, .085),
  ], 24), []);
  useEffect(() => () => shape.dispose(), [shape]);
  useFrame(({ clock }, dt) => {
    amount.current = THREE.MathUtils.damp(amount.current, lit ? strength : 0, 12, Math.min(dt, .05));
    if (!group.current || !light.current) return;
    const t = clock.elapsedTime;
    const flicker = 1 + Math.sin(t * 13) * .05 + Math.sin(t * 23) * .025;
    group.current.visible = amount.current > .005;
    group.current.scale.set(.65 + amount.current * .35, amount.current * flicker, .65 + amount.current * .35);
    group.current.rotation.z = Math.sin(t * 8) * .035;
    light.current.intensity = .28 * amount.current * flicker;
  });
  return <group position={[0, .084, 0]}>
    <group ref={group}>
      <mesh geometry={shape}><meshBasicMaterial color="#ffb329" transparent opacity={.65} depthWrite={false} /></mesh>
      <mesh geometry={shape} scale={[.55, .72, .55]}><meshBasicMaterial color="#fff2b5" transparent opacity={.92} depthWrite={false} /></mesh>
      <mesh position={[0, .006, 0]} scale={[.008, .01, .008]}><sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#5ca4ec" transparent opacity={.65} depthWrite={false} /></mesh>
    </group>
    <pointLight ref={light} position={[0, .035, 0]} intensity={0} distance={.8} decay={2} color="#ffb65b" />
  </group>;
}

/** Smoke has its own start time rather than jumping into a global looping cycle. */
function Smoke({ visible }: { visible: boolean }) {
  const group = useRef<THREE.Group>(null);
  const age = useRef(10);
  const previous = useRef(false);
  useFrame((_, dt) => {
    if (visible && !previous.current) age.current = 0;
    previous.current = visible;
    age.current += Math.min(dt, .05);
    if (!group.current) return;
    group.current.visible = age.current < 3;
    group.current.children.forEach((child, i) => {
      const t = Math.max(0, age.current - i * .12);
      child.position.set(Math.sin(t * 2 + i) * .015 * t, .015 + t * .095, Math.cos(t * 1.5 + i) * .007 * t);
      child.scale.setScalar(.5 + t * .65);
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, .13 * (1 - t / 2.5)) * Math.min(1, t * 8);
    });
  });
  return <group ref={group}>{Array.from({ length: 6 }, (_, i) => <mesh key={i}><sphereGeometry args={[.011, 12, 8]} /><meshBasicMaterial color="#c9ceca" transparent depthWrite={false} opacity={0} /></mesh>)}</group>;
}

/** Candle on a deflagrating spoon, lowered into whichever jar is being tested. */
function CandleOnSpoon({
  lit,
  strength,
  smoking,
}: {
  lit: boolean;
  strength: number;
  smoking: boolean;
}) {
  return (
    <group>
      {/* Spoon handle running back out of the jar */}
      <mesh position={[0, 0.36, -0.035]}>
        <cylinderGeometry args={[0.006, 0.006, 0.72, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Small metal pan */}
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[0.045, 0.04, 0.012, 18]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Candle */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.06, 16]} />
        <meshStandardMaterial color="#fdf6e3" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.078, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.012, 6]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} />
      </mesh>
      <CandleFlame lit={lit} strength={strength} />
      <group position={[0, 0.08, 0]}>
        <Smoke visible={smoking} />
      </group>
    </group>
  );
}

/** Printed paper labels follow the apparatus surface and occlude naturally. */
function ApparatusSticker({ title, detail, curved = false, active = false }: { title: string; detail: string; curved?: boolean; active?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 320;
    const context = canvas.getContext("2d")!;
    context.fillStyle = "#fffdf5";
    context.fillRect(0, 0, 768, 320);
    context.strokeStyle = active ? "#b96b31" : "#a8a291";
    context.lineWidth = 12;
    context.strokeRect(8, 8, 752, 304);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#303936";
    context.font = "bold 64px Arial, sans-serif";
    context.fillText(title, 384, 115, 690);
    context.fillStyle = "#626b65";
    context.font = "48px Arial, sans-serif";
    context.fillText(detail, 384, 218, 690);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 8;
    return result;
  }, [title, detail, active]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh>
    {curved ? <cylinderGeometry args={[.162, .162, .115, 48, 1, true, -.76, 1.52]} /> : <planeGeometry args={[.24, .085]} />}
    <meshStandardMaterial map={texture} roughness={.92} metalness={0} side={THREE.FrontSide} />
  </mesh>;
}

/**
 * A gas jar. The exhaled-air jar shows its water level while it is being filled
 * by displacement; the inhaled jar is simply full of air.
 */
function GasJar({
  position,
  spec,
  waterLevel,
  cloudy,
  active,
  children,
  inverted = false,
  rotationX,
  closure = 0,
}: {
  position: [number, number, number];
  spec: JarSpec;
  waterLevel: number;
  cloudy: boolean;
  active: boolean;
  children?: React.ReactNode;
  inverted?: boolean;
  rotationX?: number;
  closure?: number;
}) {
  const jarHeight = 0.62;
  const waterHeight = Math.max(0.001, jarHeight * waterLevel);
  const lidGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, .172, 0, Math.PI * 2, false);
    const slot = new THREE.Path();
    slot.absarc(0, -.035, .009, 0, Math.PI * 2, true);
    shape.holes.push(slot);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: .018, bevelEnabled: false, curveSegments: 48 });
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }, []);
  useEffect(() => () => lidGeometry.dispose(), [lidGeometry]);

  return (
    <group position={position} rotation={[rotationX ?? (inverted ? Math.PI : 0), 0, 0]}>
      {/* Jar walls */}
      <mesh position={[0, jarHeight / 2, 0]}>
        <cylinderGeometry args={[0.16, 0.16, jarHeight, 30, 1, true]} />
        <meshPhysicalMaterial
          color="#eaf5fd"
          transparent
          opacity={active ? 0.24 : 0.18}
          transmission={0.85}
          roughness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.008, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.016, 30]} />
        <meshPhysicalMaterial color="#eaf5fd" transparent opacity={0.35} roughness={0.08} />
      </mesh>

      {/* Water still to be displaced */}
      {waterLevel > 0.01 && (
        <mesh position={[0, inverted ? jarHeight - waterHeight / 2 : waterHeight / 2 + 0.01, 0]}>
          <cylinderGeometry args={[0.152, 0.152, waterHeight, 28]} />
          <meshPhysicalMaterial color="#f1fafc" transparent opacity={0.42} transmission={0.92} thickness={0.08} ior={1.333} roughness={0.025} depthWrite={false} />
        </mesh>
      )}

      {/* A faint haze once the candle has filled the jar with its products */}
      {cloudy && (
        <mesh position={[0, jarHeight / 2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, jarHeight - 0.04, 24]} />
          <meshStandardMaterial color="#e2e8f0" transparent opacity={0.1} />
        </mesh>
      )}

      {/* Greased glass lid */}
      <mesh position={lidPosition(closure, inverted)} geometry={lidGeometry}>
        <meshPhysicalMaterial color="#e2eef7" transparent opacity={.35} transmission={.65} roughness={.08} depthWrite={false} />
      </mesh>

      {children}

      <group position={[0, jarHeight * .46, 0]} rotation={[0, 0, 0]}>
        <ApparatusSticker title={spec.id === "inhaled" ? "JAR A" : "JAR B"} detail={`${spec.short.toUpperCase()} AIR`} curved active={active} />
      </group>
    </group>
  );
}

/** Trough of water with the delivery tube used to collect exhaled air. */
function CollectionTrough({ collecting, fill }: { collecting: boolean; fill: number }) {
  const waterHeight = .07 + (Math.PI * .152 ** 2 * .60 * fill) / (.98 * .5);
  return (
    <group position={[.65, BENCH_TOP_Y + .02, -.35]}>
      <mesh position={[0, .008, 0]} receiveShadow><boxGeometry args={[1, .016, .52]} /><meshPhysicalMaterial color="#dfeaf2" transparent opacity={.35} roughness={.1} /></mesh>
      {[-.26, .26].map(z => <mesh key={z} position={[0, .11, z]}><boxGeometry args={[1, .22, .012]} /><meshPhysicalMaterial color="#dfeaf2" transparent opacity={.3} depthWrite={false} roughness={.1} /></mesh>)}
      {[-.5, .5].map(x => <mesh key={x} position={[x, .11, 0]}><boxGeometry args={[.012, .22, .52]} /><meshPhysicalMaterial color="#dfeaf2" transparent opacity={.3} depthWrite={false} roughness={.1} /></mesh>)}
      <mesh position={[0, .016 + waterHeight / 2, 0]}>
        <boxGeometry args={[.98, waterHeight, .5]} />
        <meshPhysicalMaterial color="#f1fafc" transparent opacity={0.3} transmission={0.94} thickness={0.08} ior={1.333} roughness={0.025} depthWrite={false} />
      </mesh>
      {/* Delivery tube dipping into the trough */}
      <mesh position={[0, .065, .12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.4, 10]} />
        <meshPhysicalMaterial color="#e2f1fb" transparent opacity={0.55} transmission={0.5} roughness={0.1} />
      </mesh>
      <group position={[0, .08, .266]}><ApparatusSticker title="WATER TROUGH" detail={collecting ? "Collecting air" : "Clean water"} /></group>
    </group>
  );
}

/** Fixed seeds and a local phase keep bubbles continuous between React updates. */
function CollectionBubbles({ active, fill }: { active: boolean; fill: number }) {
  const ref = useRef<THREE.Group>(null);
  const phase = useRef(0);
  useFrame((_, dt) => {
    phase.current += Math.min(dt, .05) * .65;
    if (!ref.current) return;
    ref.current.visible = active;
    const height = Math.max(.025, .60 * (1 - fill));
    ref.current.children.forEach((bubble, i) => {
      const t = (phase.current + i / 10) % 1;
      bubble.position.set(.65 + Math.sin(i * 7 + t * 4) * .025, BENCH_TOP_Y + .085 + t * height, -.35 + Math.cos(i * 3 + t * 5) * .02);
      bubble.scale.setScalar(.7 + t * .45);
    });
  });
  return <group ref={ref}>{Array.from({ length: 10 }, (_, i) => <mesh key={i}><sphereGeometry args={[.006 + (i % 3) * .001, 12, 8]} /><meshPhysicalMaterial color="#eefaff" transparent opacity={.45} roughness={.04} depthWrite={false} /></mesh>)}</group>;
}

function CandleCamera({ stage, jar, auto, recenterKey, mode }: { stage: Stage; jar: Jar; auto: boolean; recenterKey: number; mode: "learning" | "doing" }) {
  const { camera, size } = useThree();
  const orbit = useRef<any>(null);
  const framing = useRef(true);
  const look = useRef(new THREE.Vector3(0, 1.9, 0));
  useEffect(() => {
    if (mode !== "learning") return;
    camera.getWorldDirection(look.current).multiplyScalar(3).add(camera.position);
    framing.current = true;
    if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 46; camera.updateProjectionMatrix(); }
  }, [camera, mode, recenterKey, size.width, size.height]);
  useFrame((_, delta) => {
    if (mode !== "learning" || (!auto && !framing.current) || !orbit.current) return;
    orbit.current.enabled = false;
    const focus = auto && (stage === "burning" || stage === "inserting" || stage === "out") ? JAR_POSITIONS[jar][0] * .5 : 0;
    const target = new THREE.Vector3(focus, BENCH_TOP_Y + .47, -.02);
    // Fit the whole lifting path, including the spoon handle, in narrow canvases.
    const aspect = Math.max(.25, size.width / Math.max(1, size.height));
    const halfFov = THREE.MathUtils.degToRad(46) / 2;
    const distance = Math.max(3.4, 1.65 / (Math.tan(halfFov) * aspect), 1.55 / Math.tan(halfFov));
    const desired = target.clone().add(new THREE.Vector3(.35, .38, 1).normalize().multiplyScalar(distance));
    const blend = 1 - Math.exp(-Math.min(delta, .05) * 3);
    camera.position.lerp(desired, blend);
    look.current.lerp(target, blend);
    orbit.current.target.copy(look.current);
    camera.lookAt(look.current);
    orbit.current.update();
    if (!auto && camera.position.distanceTo(desired) < .015 && look.current.distanceTo(target) < .015) { framing.current = false; orbit.current.enabled = true; }
  });
  return mode === "learning" ? <OrbitControls ref={orbit} makeDefault enabled={!auto} enableDamping dampingFactor={.08} enablePan={false} minDistance={2.2} maxDistance={12} maxPolarAngle={1.48} /> : null;
}

function CandleScene({ jar, stage, fill, collecting, motionProgress, flameStrength, smoking, mode, isMobile, moveVectorRef, demoActive, recenterKey }: {
  jar: Jar; stage: Stage; fill: number; collecting: boolean; motionProgress: number; flameStrength: number; smoking: boolean;
  mode: "learning" | "doing"; isMobile: boolean; moveVectorRef: MutableRefObject<{ x: number; y: number }>;
  demoActive: boolean; recenterKey: number;
}) {
  const inJar = stage === "burning" || stage === "out";
  const jarPose = collectionJarPose(stage, fill >= .999, motionProgress);
  const closureA = jar === "inhaled" ? lidClosure(stage, motionProgress, inJar) : 0;
  const closureB = stage === "transferring" ? Math.min(1, motionProgress / .15) : jar === "exhaled" ? lidClosure(stage, motionProgress, inJar || (fill >= .999 && (stage === "ready" || stage === "inserting"))) : 0;
  const candle = candlePosition(stage, jar, motionProgress);
  const lit = stage === "ready" || stage === "inserting" || stage === "burning";
  return <>
    <CandleRoom>
      <CollectionTrough collecting={collecting} fill={fill} />
      <GasJar position={JAR_POSITIONS.inhaled} spec={JARS.inhaled} waterLevel={0} closure={closureA} cloudy={false} active={jar === "inhaled"} />
      <GasJar position={jarPose.position} rotationX={jarPose.angle} inverted={jarPose.angle > .01} spec={JARS.exhaled} waterLevel={1 - fill} closure={closureB} cloudy={false} active={jar === "exhaled"} />
      <group position={candle}><CandleOnSpoon lit={lit} strength={flameStrength} smoking={smoking} /></group>
      <CollectionBubbles active={collecting} fill={fill} />
    </CandleRoom>
    <ContactShadows position={[0, BENCH_TOP_Y + .005, 0]} opacity={.23} scale={5} blur={2} far={2} frames={Infinity} />
    <CandleCamera stage={stage} jar={jar} auto={demoActive} recenterKey={recenterKey} mode={mode} />
    {mode === "doing" && <PlayerController bounds={CANDLE_BOUNDS} obstacles={CANDLE_OBSTACLES} spawn={CANDLE_SPAWN} eyeHeight={1.65} initialYaw={0} initialPitch={-.12} isMobile={isMobile} enabled moveVector={moveVectorRef} onUpdate={() => {}} />}
  </>;
}

/* -------------------------------------------------------------------- Paper */

function CandlePaper({ times, onClose }: { times: Record<Jar, number | null>; onClose: () => void }) {
  const both = times.inhaled !== null && times.exhaled !== null;
  const ratio =
    both && times.exhaled ? (times.inhaled! / times.exhaled!).toFixed(1) : null;

  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Comparing the Oxygen Content of Inhaled and Exhaled Air</h1>

        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To compare how much oxygen is present in inhaled air and in exhaled air by timing how long a candle burns in each.</p>

        <h2 className="mt-5 font-bold uppercase">Principle</h2>
        <p>
          A candle can only keep burning while there is enough oxygen. The richer the air is in oxygen, the longer the
          flame lasts in a sealed jar. Timing the flame therefore compares the oxygen content of two samples of air.
        </p>

        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Two identical gas jars with lids, a trough of water, a delivery tube, a short candle on a deflagrating spoon,
          matches and a stopwatch.
        </p>

        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Jar A was left full of ordinary room air, which is the air we breathe in.</li>
          <li>Jar B was filled with water, inverted in the trough, and exhaled air was breathed in through a delivery tube until all the water had been displaced.</li>
          <li>Jar B was covered with a greased lid while still under water and stood upright on the bench.</li>
          <li>The candle on the deflagrating spoon was lit.</li>
          <li>The burning candle was lowered into jar A, the lid was replaced and the stopwatch was started.</li>
          <li>The stopwatch was stopped the moment the flame went out and the time was recorded.</li>
          <li>The candle was relit and the same procedure was repeated with jar B.</li>
        </ol>

        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <table className="mt-2 w-full border-collapse text-sm">
          <tbody>
            <tr>
              <td className="border border-slate-400 p-2 font-bold">Gas jar</td>
              <td className="border border-slate-400 p-2 font-bold">Air in the jar</td>
              <td className="border border-slate-400 p-2 font-bold">Time the candle burned (s)</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">A</td>
              <td className="border border-slate-400 p-2">Inhaled (atmospheric) air</td>
              <td className="border border-slate-400 p-2">{times.inhaled !== null ? times.inhaled.toFixed(1) : "—"}</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-2">B</td>
              <td className="border border-slate-400 p-2">Exhaled air</td>
              <td className="border border-slate-400 p-2">{times.exhaled !== null ? times.exhaled.toFixed(1) : "—"}</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {both
            ? `The candle burned for ${times.inhaled!.toFixed(1)} s in inhaled air but only ${times.exhaled!.toFixed(1)} s in exhaled air — about ${ratio} times as long. Exhaled air therefore contains less oxygen than inhaled air, because some of the oxygen has been used up by respiration. The flame did still burn in exhaled air, which shows that exhaled air is not completely without oxygen: roughly 16% remains, compared with about 21% in inhaled air.`
            : "Time the candle in both jars, then compare the two readings."}
        </p>

        <h2 className="mt-5 font-bold uppercase">Evaluation</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The same candle and the same size of jar must be used, or the times cannot be compared.</li>
          <li>The lid must go on at once, otherwise fresh air keeps reaching the flame and the time is too long.</li>
          <li>Repeat each measurement three times and take a mean — one reading is easily out by a second or two.</li>
          <li>Jar B must have no water left in it, or the volume of exhaled air is smaller than the volume of air in jar A.</li>
        </ul>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function CandleOxygenSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: CandleOxygenSimProps) {
  const [jar, setJar] = useState<Jar>("inhaled");
  const [stage, setStage] = useState<Stage>("ready");
  const [fill, setFill] = useState(0); // how much of jar B holds exhaled air
  const [collecting, setCollecting] = useState(false);
  const [elapsed, setElapsed] = useState(0); // stopwatch seconds
  const [smoking, setSmoking] = useState(false);
  const [times, setTimes] = useState<Record<Jar, number | null>>({ inhaled: null, exhaled: null });
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"see" | "learn" | null>(null);
  const [guideStep, setGuideStep] = useState(0);
  const [demoActive, setDemoActive] = useState(false);

  const [motionProgress, setMotionProgress] = useState(0);
  const [recenterKey, setRecenterKey] = useState(0);
  const nextJarRef = useRef<Jar>("exhaled");
  const smokeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  const spec = JARS[jar];
  const jarReady = jar === "inhaled" || fill >= 0.999;
  const burnSeconds = spec.burnSeconds; // Illustrative equal-volume, equal-wick calibration; not a quantitative oxygen assay.
  const busy = collecting || stage === "burning" || stage === "inserting" || stage === "withdrawing" || stage === "transferring";
  const oxygen = oxygenAtTime(spec.oxygenPercent, elapsed, EXTINCTION_OXYGEN, OXYGEN_USE_PER_SECOND);
  const flameStrength = stage === "burning" ? Math.max(.03, Math.min(1, (oxygen - EXTINCTION_OXYGEN) / 2.2)) : 1;
  useEffect(() => () => { if (smokeTimerRef.current) clearTimeout(smokeTimerRef.current); }, []);
  useEffect(() => {
    if (!(stage in MOTION_SECONDS)) return;
    const duration = MOTION_SECONDS[stage as keyof typeof MOTION_SECONDS];
    let frame = 0;
    let last = performance.now();
    let time = 0;
    setMotionProgress(0);
    const advance = (now: number) => {
      time += Math.min((now - last) / 1000, .05);
      last = now;
      const progress = Math.min(1, time / duration);
      setMotionProgress(progress);
      if (progress < 1) { frame = requestAnimationFrame(advance); return; }
      if (stage === "inserting") setStage("burning");
      else if (stage === "transferring") setStage("ready");
      else { const next = nextJarRef.current; setJar(next); setStage(next === "exhaled" && fill < .999 ? "collect" : "ready"); }
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [stage]);

  /* Filling jar B by displacement of water. */
  useEffect(() => {
    if (!collecting) return;
    let frame = 0;
    let last = performance.now();
    let time = 0;
    const from = fill;
    const animate = (now: number) => {
      time += Math.min((now - last) / 1000, .05);
      last = now;
      const fraction = Math.min(1, time / 7);
      const flow = fraction - Math.sin(fraction * Math.PI * 6) * .65 / (Math.PI * 6);
      const value = from + flow * (1 - from);
      setFill(value);
      if (fraction >= 1) {
        setCollecting(false);
        setMotionProgress(0);
        setStage("transferring");
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
    // `fill` is read once when collection starts; re-running on every frame
    // would restart the animation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collecting]);

  /* The burn itself — the stopwatch runs until the flame dies. */
  useEffect(() => {
    if (stage !== "burning") return;
    let frame = 0;
    startRef.current = performance.now();
    let seconds = 0;
    const animate = (now: number) => {
      seconds += Math.min((now - startRef.current) / 1000, .05) * TIME_SCALE;
      startRef.current = now;
      if (seconds >= burnSeconds) {
        setElapsed(burnSeconds);
        setStage("out");
        setSmoking(true);
        setTimes((current) => ({ ...current, [jar]: burnSeconds }));
        if (smokeTimerRef.current) clearTimeout(smokeTimerRef.current);
        smokeTimerRef.current = setTimeout(() => setSmoking(false), 2800);
        return;
      }
      setElapsed(seconds);
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [stage, burnSeconds, jar]);



  const lowerIntoJar = useCallback(() => {
    if (!jarReady || stage !== "ready") return;
    setElapsed(0);
    setSmoking(false);
    setMotionProgress(0);
    setStage("inserting");
  }, [jarReady, stage]);

  const selectJar = useCallback((next: Jar) => {
    if (busy || next === jar) return;
    setSmoking(false);
    setElapsed(0);
    if (stage === "out") { nextJarRef.current = next; setMotionProgress(0); setStage("withdrawing"); }
    else { setJar(next); setStage(next === "exhaled" && fill < .999 ? "collect" : "ready"); }
  }, [busy, jar, stage, fill]);
  const startCollecting = useCallback(() => {
    if (busy || fill >= .999 || jar !== "exhaled") return;
    setStage("collect");
    setCollecting(true);
  }, [busy, fill, jar]);

  const resetAll = useCallback(() => {
    if (smokeTimerRef.current) clearTimeout(smokeTimerRef.current);
    setMotionProgress(0);
    setRecenterKey(value => value + 1);
    setGuideStep(0);
    setJar("inhaled");
    setStage("ready");
    setFill(0);
    setCollecting(false);
    setElapsed(0);
    setSmoking(false);
    setTimes({ inhaled: null, exhaled: null });
    setDemoActive(false);
  }, []);

  const toggleDemo = useCallback(() => {
    if (demoActive) { setDemoActive(false); return; }
    resetAll();
    setMode("learning");
    setGuideStep(1);
    setDemoActive(true);
  }, [demoActive, resetAll]);

  /* Each action waits for the previous motion and its observation pause. */
  useEffect(() => {
    if (!demoActive || busy) return;
    const timer = setTimeout(() => {
      if (times.inhaled === null && stage === "ready") lowerIntoJar();
      else if (jar === "inhaled" && stage === "out") selectJar("exhaled");
      else if (stage === "collect" && fill < .999) startCollecting();
      else if (jar === "exhaled" && stage === "ready" && times.exhaled === null) lowerIntoJar();
      else if (times.inhaled !== null && times.exhaled !== null) { setDemoActive(false); setRecenterKey(v => v + 1); }
    }, stage === "out" ? 1800 : 900);
    return () => clearTimeout(timer);
  }, [demoActive, busy, times, jar, stage, fill, lowerIntoJar, selectJar, startCollecting]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const complete = times.inhaled !== null && times.exhaled !== null;
  useEffect(() => {
    if (complete) setGuideStep(3);
    else if (demoActive && times.inhaled !== null) setGuideStep(2);
  }, [complete, demoActive, times.inhaled]);
  const step = !jarReady ? 0 : stage === "ready" ? 1 : stage === "burning" ? 2 : complete ? 3 : 2;

  const status = stage === "inserting" ? "Lift the candle, move it over the opening, lower it gently, then close the lid."
    : stage === "withdrawing" ? "Remove the lid and lift the spoon clear before moving to the other jar."
    : stage === "transferring" ? "Cover the collected air under water, lift the jar, turn it upright, and place it on the bench."
    : !jarReady
    ? collecting
      ? `Breathing out through the delivery tube — the water is being pushed out of jar B. ${Math.round(fill * 100)}% filled.`
      : "Jar B is still full of water. Breathe out through the delivery tube until all the water has been displaced by your exhaled air."
    : stage === "burning"
      ? `The candle is burning in ${spec.short.toLowerCase()} air. Stopwatch: ${elapsed.toFixed(1)} s.`
      : stage === "out"
        ? `The flame went out after ${(times[jar] ?? burnSeconds).toFixed(1)} s in ${spec.short.toLowerCase()} air. ${
            complete ? "Now compare the two times." : "Relight the candle and test the other jar."
          }`
        : `Candle lit and ready. Lower it into ${spec.title} and put the lid on as you start the stopwatch.`;

  const observation = complete
    ? `Inhaled air: ${times.inhaled!.toFixed(1)} s. Exhaled air: ${times.exhaled!.toFixed(1)} s. The candle burned about ${(times.inhaled! / times.exhaled!).toFixed(1)} times longer in inhaled air, so inhaled air holds more oxygen.`
    : times.inhaled !== null
      ? `Jar A done: ${times.inhaled.toFixed(1)} s. Now collect a jar of exhaled air and repeat with the same candle.`
      : "Time the candle in ordinary air first, so you have something to compare against.";

  const primaryLabel = !jarReady
    ? collecting
      ? "Collecting…"
      : "Breathe into jar B"
    : stage === "burning"
      ? "Burning…"
      : stage === "out"
        ? complete
          ? "Reset the experiment"
          : "Relight and test the other jar"
        : "Lower into the jar";

  const onPrimary = busy ? () => undefined : !jarReady
    ? collecting
      ? () => setCollecting(false)
      : startCollecting
    : stage === "burning"
      ? () => undefined
      : stage === "out"
        ? complete
          ? resetAll
          : () => {
              const next: Jar = jar === "inhaled" ? "exhaled" : "inhaled";
              selectJar(next);
            }
        : lowerIntoJar;

return (
    <div className={`candle-design oxygen-design ${isMobileViewport ? "oxygen-design--mobile" : ""} relative flex h-full w-full overflow-hidden bg-slate-950 text-white`}>
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Oxygen in Inhaled vs Exhaled Air"
          subtitle="timing a candle flame"
          symbol="🕯️"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="candle-scene" className="candle-scene relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [2.7, 3.0, 4.5], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <CandleScene
            jar={jar}
            stage={stage}
            fill={fill}
            flameStrength={flameStrength}
            smoking={smoking}
            collecting={collecting}
            motionProgress={motionProgress}
            demoActive={demoActive}
            recenterKey={recenterKey}
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

      <section inert={selectedMode === null} className={`oxygen-controls candle-controls ${isMobileViewport ? "candle-controls--mobile" : ""}`} aria-label="Experiment guide">
        <header className="oxygen-controls__header"><strong>Oxygen and a candle</strong><button onClick={() => { setMode("learning"); setRecenterKey(v => v + 1); }}>Recenter</button><button onClick={resetAll}>Reset</button></header>
        <div className="oxygen-guide__progress"><div><span>Step {guideStep + 1} of 4</span><span>{elapsed.toFixed(1)} s</span></div><progress max={4} value={complete ? 4 : guideStep} aria-label="Experiment progress" /></div>
        <div className="oxygen-guide__step" aria-live="polite">
          <p className="oxygen-guide__eyebrow">{demoActive ? "Demonstration" : "Your experiment"}</p>
          <h2>{["Check the apparatus", "Test room air", "Collect and test exhaled air", "Compare the times"][guideStep]}</h2>
          <p>{guideStep === 0 ? "Use equal gas volumes and an identical candle. Jar A contains room air. Collect jar B over water before testing it." : guideStep === 3 ? observation : status}</p>
          <dl className="oxygen-guide__results">{(Object.keys(JARS) as Jar[]).map(key => <div key={key}><dt>{JARS[key].title}</dt><dd>{times[key] === null ? "Not tested" : `${times[key]!.toFixed(1)} s`}</dd></div>)}</dl>
          {guideStep === 2 && <p className="mt-4 text-sm">Exhaled air collected: {Math.round(fill * 100)}%</p>}
          <p className="mt-4 text-xs text-slate-500">Modelled times · playback at 2× speed. Burn time depends on gas volume, wick and flame size; it does not directly measure oxygen percentage.</p>
        </div>
        <footer className="oxygen-guide__actions">
          <button className="oxygen-guide__next" disabled={busy || demoActive || selectedMode === null} onClick={() => { if (guideStep === 0) setGuideStep(1); else if (guideStep === 3) resetAll(); else if (complete) setGuideStep(3); else if (times.inhaled !== null && jar === "inhaled") { setGuideStep(2); selectJar("exhaled"); } else onPrimary(); }}>{busy ? collecting ? "Collecting…" : stage === "burning" ? "Timing flame…" : "Moving apparatus…" : guideStep === 0 ? "Next" : guideStep === 3 ? "Start again" : complete ? "Compare results" : primaryLabel}</button>
          <button className="oxygen-guide__demo" onClick={toggleDemo}>{demoActive ? "Stop demonstration" : "Watch demonstration"}</button>
          <button className="oxygen-guide__demo" onClick={() => { resetAll(); setSelectedMode(null); }}>Change mode</button>
        </footer>
      </section>
      {selectedMode === null && <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/15 p-5 backdrop-blur-[7px]">
        <div role="dialog" aria-modal="true" aria-labelledby="candle-mode-title" className="w-full max-w-[360px] rounded-2xl bg-white p-6 text-center text-slate-900 shadow-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-700">Respiration</p><h2 id="candle-mode-title" className="mt-2 text-2xl font-bold">Select mode</h2><p className="mt-2 text-sm text-slate-500">Compare oxygen content using a candle.</p>
          <button autoFocus className="mt-5 w-full rounded-xl bg-cyan-600 p-3 text-left font-bold text-white" onClick={() => { setSelectedMode("see"); setGuideStep(1); toggleDemo(); }}>See <span className="float-right">▶</span></button>
          <button className="mt-3 w-full rounded-xl border border-teal-200 bg-teal-50 p-3 text-left font-bold text-teal-950" onClick={() => { setSelectedMode("learn"); resetAll(); }}>Learn <span className="float-right">→</span></button>
        </div>
      </div>}

      {showPaper && <CandlePaper times={times} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={tutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
