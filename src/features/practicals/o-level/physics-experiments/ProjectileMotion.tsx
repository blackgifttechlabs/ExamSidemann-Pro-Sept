"use client";

import { useEffect, useRef, useState, useMemo, useCallback, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line, Html, Sky } from "@react-three/drei";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import { HeaderModeToggle } from "../../common/CombinedScienceGame";
import { useExperimentNarrator } from "../../../../lib/audio/experimentNarrator";
import {
  ExperimentNarrationDock,
  WalkthroughStatusPill,
  useNarratedWalkthrough,
  type NarrationClip,
  type WalkthroughStep,
} from "../../common/ExperimentNarration";
import {
  NarrationCaptionBar,
  NarrationMeasureOverlay,
  NarrationPointerHand,
  type SceneAnchorPoints,
} from "../../common/ExperimentNarrationCaptions";
import { NarrationSceneAnchors } from "../../common/NarrationSceneAnchors";
import {
  cueTimeMs,
  trackDurationMs,
  useNarrationCueRunner,
  useNarrationPlayback,
} from "../../../../lib/audio/narrationCaptions";
import { PROJECTILE_NARRATION_TRACKS } from "../../../../lib/audio/narration/projectileMotion";
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import { VirtualJoystick } from "../../common/VirtualJoystick";
import { resolveActiveInteractable, type Interactable } from "../../common/InteractionSystem";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Physics constants & helpers
// ---------------------------------------------------------------------------

const degToRad = (deg: number) => (deg * Math.PI) / 180;

// Scale factor so the numbers feel good in a 3D scene (1 unit = 1 meter here,
// but you can tweak this if your launch velocities make the trajectory too
// big/small for the camera framing).
const WORLD_SCALE = 1;
const CANNON_PIVOT = new THREE.Vector3(-1.25, 0.42, 0);
const CANNON_BARREL_LENGTH = 1.9;
const CANNON_MUZZLE_OFFSET = 0.18;
const PROJECTILE_RADIUS = 0.105;
const MIN_GRAVITY = 1;
const SMOKE_COLORS = ["#e8e5dc", "#c9c6bc", "#98968f", "#d8d4ca"];
const FLARE_COLORS = ["#fde047", "#fb923c", "#f97316", "#ef4444"];
const DUST_COLORS = ["#cfbc98", "#b19b76", "#927655", "#725c42", "#c4ad86"];
const RANGE_TERRAIN_START_X = -500;
const RANGE_TERRAIN_END_X = 3200;
const RANGE_TERRAIN_WIDTH = 900;
const PAVILION_CEILING_Y = 3.0;
const PAVILION_CEILING_MIN_X = -4.63;
const PAVILION_CEILING_MAX_X = 0.07;

// Doing Mode: the player roams a small firing platform around the cannon
// rather than the whole (effectively infinite) range — the range itself is
// only ever an automatically-tracked flight path, not a place to walk to.
const PLAYER_BOUNDS: PlayerBounds = { minX: -9, maxX: 9, minZ: -9, maxZ: 9 };
const CARRIAGE_OBSTACLES: PlayerBounds[] = [{ minX: -3.4, maxX: 0.4, minZ: -0.9, maxZ: 0.9 }];
const PLAYER_SPAWN = new THREE.Vector3(2.6, 0, -3.6);
const INTERACTION_RADIUS = 3.2;

// World-space stations for Doing Mode, positioned around the cannon so the
// player can walk up to each control instead of using the side panel sliders.
const ANGLE_STATION_POS = new THREE.Vector3(CANNON_PIVOT.x, 0, 1.15);
const POWER_STATION_POS = new THREE.Vector3(CANNON_PIVOT.x, 0, -1.15);
const GRAVITY_STATION_POS = new THREE.Vector3(CANNON_PIVOT.x - 2.6, 0, 0);
const LAUNCH_STATION_POS = new THREE.Vector3(CANNON_PIVOT.x, 0, 0.4);
const SPEED_STATION_POS = new THREE.Vector3(CANNON_PIVOT.x + 2.6, 0, 0);
const FUSE_END_POS = new THREE.Vector3(2.75, 0.12, 1.9);
const FUSE_BURN_DURATION_MS = 3300;

// Doing Mode simplifies the continuous sliders to a "walk up, tap to cycle a
// preset" interaction — the same setters the guided sliders call, just
// stepped through in fixed increments instead of dragged freely.
const ANGLE_PRESETS = [15, 30, 45, 60, 75, 90, 0];
const VELOCITY_PRESETS = [8, 12, 18, 24, 32, 40, 50];
const GRAVITY_PRESETS: { label: string; value: number }[] = [
  { label: "Earth", value: 9.8 },
  { label: "Moon", value: 1.6 },
  { label: "Mars", value: 3.7 },
];

function cycleNumericPreset(current: number, presets: number[]): number {
  const idx = presets.findIndex((p) => Math.abs(p - current) < 0.05);
  const nextIdx = idx === -1 ? 0 : (idx + 1) % presets.length;
  return presets[nextIdx];
}

function cycleGravityPreset(current: number): number {
  const idx = GRAVITY_PRESETS.findIndex((p) => Math.abs(p.value - current) < 0.05);
  const nextIdx = idx === -1 ? 0 : (idx + 1) % GRAVITY_PRESETS.length;
  return GRAVITY_PRESETS[nextIdx].value;
}

interface LaunchParams {
  angleDeg: number; // 0 - 90
  velocity: number; // m/s
  gravity: number; // m/s^2
}

const safePlay = (audio: HTMLAudioElement) => {
  void audio.play().catch(() => undefined);
};

const stopAudio = (audio: HTMLAudioElement) => {
  audio.pause();
  audio.currentTime = 0;
};

const LANDING_SOUND_START_SECONDS = 0.021;
const LANDING_SOUND_END_SECONDS = 3.63;
const LANDING_SOUND_PLAY_MS =
  (LANDING_SOUND_END_SECONDS - LANDING_SOUND_START_SECONDS) * 1000;
const mathJaxConfig = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
  },
};

const projectileTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Level Start: Projectile Motion",
    text: "You are investigating how launch angle, initial velocity, and gravity affect range, maximum height, and time of flight.",
    mode: "modal",
  },
  {
    title: "How It Works",
    text: "Set the angle and power, then launch. The projectile moves forward while gravity pulls it downward, forming a curved path.",
    mode: "modal",
  },
  {
    title: "Recording Your Paper",
    text: "After a launch, use the observed range, height, and time values in the Paper report together with the calculation section.",
    mode: "modal",
  },
  {
    title: "Observation Figures",
    text: "These digital displays update with range, height, and time so you can observe the effect of changing variables.",
    mode: "bubble",
    selector: '[data-experiment-tour="projectile-hud"]',
  },
  {
    title: "Launch Area",
    text: "The cannon angle and trajectory preview show where the projectile will travel before you press Launch.",
    mode: "bubble",
    sceneSelector: '[data-experiment-tour="projectile-scene"]',
    sceneBox: { x: 0.05, y: 0.25, w: 0.62, h: 0.46 },
  },
  {
    title: "Game Controls",
    text: "Use Launch, Reset, Angle, Power, Gravity, and Speed controls to run fair tests with one variable changed at a time.",
    mode: "bubble",
    selector: '[data-experiment-tour="projectile-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Paper Button",
    text: "Open Paper after testing to generate the practical write-up from your current simulation values.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

const projectileHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Projectile Motion",
    text: "Follow this sample run. Change the launch angle, launch the projectile, open the paper, then download your report.",
    mode: "modal",
  },
  {
    title: "Step 1: Set The Angle",
    text: "Tap Angle on mobile or click the angle slider on desktop. Set it near 45 degrees so the sample produces a clear curved path.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="angle"], [data-experiment-tour="projectile-angle"]',
    actionSelector: '[data-mobile-experiment-action="angle"], [data-experiment-tour="projectile-angle"]',
    actionLabel: "Tap Angle or adjust the angle slider",
  },
  {
    title: "Step 2: Launch",
    text: "Tap Launch. Wait while the projectile travels across the grid and the observation figures update.",
    mode: "bubble",
    selector: '[data-mobile-experiment-action="launch"], [data-experiment-tour="projectile-launch"]',
    actionSelector: '[data-mobile-experiment-action="launch"], [data-experiment-tour="projectile-launch"]',
    actionLabel: "Tap Launch",
  },
  {
    title: "Step 3: Read Observations",
    text: "Check the range, maximum height, and time. These are the values you will use in the experiment paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="projectile-hud"]',
  },
  {
    title: "Step 4: Open Paper",
    text: "Tap Paper to open the practical write-up generated from your current projectile readings.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
    actionSelector: '[data-experiment-tour="paper"] button',
    actionLabel: "Tap Paper",
  },
  {
    title: "Step 5: Download Paper",
    text: "Tap Download to save the generated experiment paper.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper-download"]',
    actionSelector: '[data-experiment-tour="paper-download"]',
    actionLabel: "Tap Download",
  },
  {
    title: "Congratulations",
    text: "You now know how to run the Projectile Motion experiment, change variables, launch a trial, read observations, and download the paper.",
    mode: "modal",
  },
];

function launchOrigin({ angleDeg }: Pick<LaunchParams, "angleDeg">) {
  const theta = degToRad(angleDeg);
  const direction = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
  return CANNON_PIVOT.clone().add(
    direction.multiplyScalar(CANNON_BARREL_LENGTH + CANNON_MUZZLE_OFFSET)
  );
}

function launchDirection({ angleDeg }: Pick<LaunchParams, "angleDeg">) {
  const theta = degToRad(angleDeg);
  return new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
}

// Given the params, compute total flight time from cannon muzzle until ground.
function totalFlightTime({ angleDeg, velocity, gravity }: LaunchParams) {
  const theta = degToRad(angleDeg);
  const vy0 = velocity * Math.sin(theta);
  const origin = launchOrigin({ angleDeg });
  const safeGravity = Math.max(MIN_GRAVITY, gravity);
  // y(t) = y0 + vy0*t - 0.5*g*t^2 = 0
  return (vy0 + Math.sqrt(vy0 * vy0 + 2 * safeGravity * origin.y)) / safeGravity;
}

// Position at time t
function positionAt(t: number, { angleDeg, velocity, gravity }: LaunchParams) {
  const theta = degToRad(angleDeg);
  const origin = launchOrigin({ angleDeg });
  const vx0 = velocity * Math.cos(theta);
  const vy0 = velocity * Math.sin(theta);
  const safeGravity = Math.max(MIN_GRAVITY, gravity);
  const x = origin.x + vx0 * t * WORLD_SCALE;
  const y = origin.y + (vy0 * t - 0.5 * safeGravity * t * t) * WORLD_SCALE;
  return { x, y };
}

function horizontalRange(params: LaunchParams) {
  const origin = launchOrigin(params);
  const landing = positionAt(totalFlightTime(params), params);
  return Math.max(0, landing.x - origin.x);
}

// Instantaneous speed (m/s) at time t — sqrt(vx^2 + vy^2)
function speedAt(t: number, { angleDeg, velocity, gravity }: LaunchParams) {
  const theta = degToRad(angleDeg);
  const vx = velocity * Math.cos(theta);
  const vy = velocity * Math.sin(theta) - Math.max(MIN_GRAVITY, gravity) * t;
  return Math.sqrt(vx * vx + vy * vy);
}

// Sample the full arc up-front, for the live "ghost" preview line that
// updates as sliders move, before the ball is launched.
function sampleTrajectory(params: LaunchParams, samples = 40) {
  const flightTime = totalFlightTime(params);
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (flightTime * i) / samples;
    const { x, y } = positionAt(t, params);
    points.push(new THREE.Vector3(x, y, 0));
  }
  return points;
}

// ---------------------------------------------------------------------------
// The ball + trail, animated inside the R3F render loop
// ---------------------------------------------------------------------------

interface BallProps {
  params: LaunchParams;
  playing: boolean;
  paused: boolean;
  resetKey: number;
  onLanded: () => void;
  onCeilingHit?: (position: THREE.Vector3) => void;
  speedMultiplier: number;
  onTick?: (height: number, speed: number, distance: number, elapsedTime: number) => void;
}

interface ShakeState {
  key: number;
  intensity: number;
}

interface BurstState {
  key: number;
  origin: THREE.Vector3;
  direction?: THREE.Vector3;
}

interface LandingScratch {
  id: number;
  x: number;
  z: number;
  rotation: number;
  length: number;
}

function ProjectileBall({
  params,
  playing,
  paused,
  resetKey,
  onLanded,
  onCeilingHit,
  speedMultiplier,
  onTick,
}: BallProps) {
  const ballRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const shadowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsedRef = useRef(0);
  const hudUpdateElapsedRef = useRef(0);
  const landedRef = useRef(false);
  const ceilingHitRef = useRef(false);
  const previousPositionRef = useRef(launchOrigin(params));
  const [trail, setTrail] = useState<THREE.Vector3[]>([]);
  const [groundLine, setGroundLine] = useState<THREE.Vector3[]>([
    new THREE.Vector3(0, 0.035, 0),
    new THREE.Vector3(0, 0.035, 0),
  ]);
  const [stats, setStats] = useState({ height: 0, speed: 0 });

  const flightTime = useMemo(() => totalFlightTime(params), [params]);
  const origin = useMemo(() => launchOrigin(params), [params]);

  // Reset ball + trail whenever resetKey changes (new launch).
  useEffect(() => {
    elapsedRef.current = 0;
    hudUpdateElapsedRef.current = 0;
    landedRef.current = false;
    ceilingHitRef.current = false;
    const start = launchOrigin(params);
    previousPositionRef.current.copy(start);
    if (ballRef.current) {
      ballRef.current.position.set(start.x, start.y, start.z);
      ballRef.current.rotation.set(0, 0, 0);
    }
    if (shadowRef.current) {
      shadowRef.current.position.x = start.x;
      const initialShadowScale = THREE.MathUtils.clamp(1.15 - start.y * 0.035, 0.42, 1.15);
      shadowRef.current.scale.setScalar(initialShadowScale);
    }
    if (shadowMaterialRef.current) {
      shadowMaterialRef.current.opacity = THREE.MathUtils.clamp(0.3 / (1 + start.y * 0.5), 0.025, 0.3);
    }
    setTrail([start]);
    setGroundLine([
      new THREE.Vector3(start.x, 0.035, 0),
      new THREE.Vector3(start.x, 0.035, 0),
    ]);
    setStats({ height: 0, speed: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useFrame((_, delta) => {
    if (!playing || paused || landedRef.current || !ballRef.current) return;

    elapsedRef.current += delta * speedMultiplier;
    let t = elapsedRef.current;

    if (t >= flightTime) {
      t = flightTime;
      landedRef.current = true;
      onLanded();
    }

    const { x, y } = positionAt(t, params);
    const previous = previousPositionRef.current;
    const collisionPlaneY = PAVILION_CEILING_Y - PROJECTILE_RADIUS;
    if (
      !ceilingHitRef.current &&
      previous.y < collisionPlaneY &&
      y >= collisionPlaneY
    ) {
      const crossingProgress = THREE.MathUtils.clamp(
        (collisionPlaneY - previous.y) / Math.max(0.0001, y - previous.y),
        0,
        1,
      );
      const crossingX = THREE.MathUtils.lerp(previous.x, x, crossingProgress);
      if (crossingX >= PAVILION_CEILING_MIN_X && crossingX <= PAVILION_CEILING_MAX_X) {
        ceilingHitRef.current = true;
        onCeilingHit?.(new THREE.Vector3(crossingX, PAVILION_CEILING_Y, 0));
      }
    }
    previousPositionRef.current.set(x, y, 0);
    const visualY = Math.max(PROJECTILE_RADIUS, y);
    ballRef.current.position.set(x, visualY, 0);

    const currentSpeed = speedAt(t, params);
    const currentHeight = Math.max(y, 0);
    const currentDistance = Math.max(0, x - origin.x);
    const spinStep = (currentSpeed * delta * speedMultiplier) / PROJECTILE_RADIUS;
    ballRef.current.rotation.z -= spinStep * 0.16;
    ballRef.current.rotation.x += spinStep * 0.035;

    if (shadowRef.current) {
      shadowRef.current.position.x = x;
      const shadowScale = THREE.MathUtils.clamp(1.15 - currentHeight * 0.035, 0.42, 1.15);
      shadowRef.current.scale.setScalar(shadowScale);
    }
    if (shadowMaterialRef.current) {
      shadowMaterialRef.current.opacity = THREE.MathUtils.clamp(
        0.3 / (1 + currentHeight * 0.5),
        0.025,
        0.3
      );
    }

    hudUpdateElapsedRef.current += delta;
    if (onTick && (hudUpdateElapsedRef.current >= 1 / 15 || landedRef.current)) {
      onTick(currentHeight, currentSpeed, currentDistance, t);
      hudUpdateElapsedRef.current = 0;
    }
    setStats({ height: currentHeight, speed: currentSpeed });
    setGroundLine([new THREE.Vector3(origin.x, 0.035, 0), new THREE.Vector3(x, 0.035, 0)]);

    setTrail((prev) => {
      const last = prev[prev.length - 1];
      const next = new THREE.Vector3(x, Math.max(y, PROJECTILE_RADIUS), 0);
      // Only add a new trail point if it moved meaningfully, to keep the
      // line buffer small. Periodic decimation retains the full arc instead
      // of dropping its beginning on long, low-gravity flights.
      if (!last || last.distanceTo(next) > 0.08) {
        const retained = prev.length >= 359
          ? prev.filter((_, index) => index === 0 || index % 2 === 0)
          : prev;
        return [...retained, next];
      }
      return prev;
    });
  });

  return (
    <>
      <group ref={ballRef} position={[origin.x, origin.y, origin.z]}>
        <mesh castShadow>
          <icosahedronGeometry args={[PROJECTILE_RADIUS, 5]} />
          <meshStandardMaterial color="#34393a" metalness={0.68} roughness={0.32} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 8]}>
          <torusGeometry args={[PROJECTILE_RADIUS * 0.985, 0.0022, 6, 36]} />
          <meshStandardMaterial color="#090a0b" metalness={0.82} roughness={0.45} />
        </mesh>
        <mesh position={[0.074, 0.054, 0.047]} scale={[1, 0.45, 0.7]}>
          <sphereGeometry args={[0.024, 12, 12]} />
          <meshStandardMaterial color="#795238" metalness={0.5} roughness={0.85} />
        </mesh>
        <mesh position={[-0.065, 0.058, -0.052]} scale={[0.75, 0.4, 1]}>
          <sphereGeometry args={[0.018, 10, 10]} />
          <meshStandardMaterial color="#5e4432" metalness={0.45} roughness={0.9} />
        </mesh>

      </group>

      <mesh
        ref={shadowRef}
        position={[origin.x, 0.028, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        renderOrder={2}
      >
        <circleGeometry args={[0.26, 32]} />
        <meshBasicMaterial
          ref={shadowMaterialRef}
          color="#17130e"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {trail.length > 1 && (
        <Line points={trail} color="#22d3ee" lineWidth={2.5} transparent opacity={1} />
      )}

      {trail.length > 1 && (
        <Line
          points={groundLine}
          color="#ffffff"
          lineWidth={1.5}
          dashed
          dashSize={0.32}
          gapSize={0.18}
          transparent
          opacity={0.58}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Live "ghost" preview of the arc, recomputed whenever sliders change
// ---------------------------------------------------------------------------

function PreviewTrajectory({ params }: { params: LaunchParams }) {
  const points = useMemo(() => sampleTrajectory(params), [params]);
  if (points.length < 2) return null;
  return (
    <Line
      points={points}
      color="#facc15"
      lineWidth={1.5}
      dashed
      dashSize={0.28}
      gapSize={0.2}
      transparent
      opacity={0.62}
    />
  );
}

function CameraImpulse({ shake }: { shake: ShakeState }) {
  const { camera } = useThree();
  const elapsedRef = useRef(999);
  const lastShakeKeyRef = useRef(shake.key);
  const previousOffsetRef = useRef(new THREE.Vector3());
  const duration = 0.32;

  useFrame((_, delta) => {
    camera.position.sub(previousOffsetRef.current);
    previousOffsetRef.current.set(0, 0, 0);

    if (lastShakeKeyRef.current !== shake.key) {
      lastShakeKeyRef.current = shake.key;
      elapsedRef.current = 0;
    }

    elapsedRef.current += delta;
    if (elapsedRef.current >= duration || shake.intensity <= 0) return;

    const progress = elapsedRef.current / duration;
    const falloff = (1 - progress) * shake.intensity;
    const wave = elapsedRef.current * 88;
    previousOffsetRef.current.set(
      Math.sin(wave) * falloff,
      Math.sin(wave * 1.37) * falloff * 0.45,
      Math.cos(wave * 0.83) * falloff * 0.35
    );
    camera.position.add(previousOffsetRef.current);
  });

  useEffect(
    () => () => {
      camera.position.sub(previousOffsetRef.current);
    },
    [camera]
  );

  return null;
}

function ParticleBurst({
  burst,
  color,
  colors,
  count,
  duration,
  spread,
  rise,
  size,
  directionPush = 0,
}: {
  burst: BurstState;
  color: string;
  colors?: string[];
  count: number;
  duration: number;
  spread: number;
  rise: number;
  size: number;
  directionPush?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(duration + 1);
  const lastBurstKeyRef = useRef(burst.key);
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const cluster = Math.floor(Math.random() * 5);
        const clusterAngle = (cluster / 5) * Math.PI * 2 + Math.random() * 0.55;
        const angle = clusterAngle + (Math.random() - 0.5) * 1.15;
        const speed = 0.18 + Math.pow(Math.random(), 1.9) * 0.62;
        const lift = (Math.random() - 0.25) * rise * 0.18;
        return {
          start: new THREE.Vector3(
            (Math.random() - 0.5) * spread * 0.16,
            (Math.random() - 0.5) * rise * 0.16,
            (Math.random() - 0.5) * spread * 0.16
          ),
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed * spread,
            lift,
            Math.sin(angle) * speed * spread
          ),
          drift: new THREE.Vector3(
            (Math.random() - 0.5) * spread * 0.38,
            Math.random() * rise * 0.42,
            (Math.random() - 0.5) * spread * 0.38
          ),
          delay: Math.pow(Math.random(), 1.8) * 0.34,
          lifetime: 0.68 + Math.random() * 0.62,
          drag: 0.48 + Math.random() * 0.36,
          buoyancy: 0.18 + Math.random() * 0.42,
          bloomDelay: Math.random() * 0.28,
          bloomRate: 1.25 + Math.random() * 1.7,
          wobble: 7 + Math.random() * 11,
          spin: Math.random() * Math.PI,
          scale: 0.42 + Math.random() * 1.05,
          color: colors?.[index % colors.length] ?? color,
        };
      }),
    [color, colors, count, rise, spread]
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (lastBurstKeyRef.current !== burst.key) {
      lastBurstKeyRef.current = burst.key;
      elapsedRef.current = 0;
      group.visible = true;
      group.position.copy(burst.origin);
    }

    elapsedRef.current += delta;
    const progress = elapsedRef.current / duration;
    if (progress >= 1) {
      group.visible = false;
      return;
    }

    const opacity = (1 - progress) * 0.72;
    const direction = burst.direction?.clone().normalize();
    group.children.forEach((child, index) => {
      const particle = particles[index];
      const localProgress = Math.max(0, Math.min(1, (progress - particle.delay) / particle.lifetime));
      const dragProgress = (1 - Math.exp(-localProgress * 3.2 * particle.drag)) / (1 - Math.exp(-3.2 * particle.drag));
      const bloomProgress = Math.max(0, Math.min(1, (localProgress - particle.bloomDelay) * particle.bloomRate));
      const visibleOpacity =
        localProgress <= 0
          ? 0
          : Math.sin(Math.min(1, localProgress * 1.4) * Math.PI * 0.5) *
            Math.pow(1 - localProgress, 1.15) *
            0.82;
      const wobbleStrength = spread * (0.012 + bloomProgress * 0.045);
      const wobbleX = Math.sin(elapsedRef.current * particle.wobble + particle.spin) * wobbleStrength;
      const wobbleZ = Math.cos(elapsedRef.current * (particle.wobble * 0.77) + particle.spin) * wobbleStrength;
      child.position.set(
        particle.start.x +
          particle.velocity.x * dragProgress +
          particle.drift.x * localProgress +
          wobbleX +
          (direction?.x ?? 0) * directionPush * dragProgress,
        particle.start.y +
          particle.velocity.y * dragProgress +
          particle.drift.y * localProgress +
          Math.pow(localProgress, 1.55) * rise * particle.buoyancy +
          (direction?.y ?? 0) * directionPush * dragProgress,
        particle.start.z +
          particle.velocity.z * dragProgress +
          particle.drift.z * localProgress +
          wobbleZ +
          (direction?.z ?? 0) * directionPush * dragProgress
      );
      child.scale.setScalar(size * particle.scale * (0.55 + bloomProgress * 1.1 + localProgress * 0.18));
      child.rotation.z = particle.spin + localProgress * Math.PI * (0.25 + particle.scale * 0.25);
      const material = (child as THREE.Mesh).material;
      if (material instanceof THREE.MeshBasicMaterial) {
        material.opacity = Math.min(opacity, visibleOpacity);
      }
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {particles.map((particle, index) => (
        <mesh key={index} rotation={[0, 0, particle.spin]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function CeilingShatterBurst({ burst }: { burst: BurstState }) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsedRef = useRef(99);
  const lastKeyRef = useRef(burst.key);
  const fragments = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => {
        const angle = index * 2.399963 + (index % 4) * 0.13;
        const speed = 0.75 + ((index * 31) % 17) / 15;
        return {
          velocity: new THREE.Vector3(
            Math.cos(angle) * speed,
            0.25 + ((index * 19) % 13) / 12,
            Math.sin(angle) * speed * 0.72,
          ),
          size: new THREE.Vector3(
            0.08 + ((index * 7) % 6) * 0.025,
            0.025 + (index % 3) * 0.012,
            0.07 + ((index * 11) % 5) * 0.024,
          ),
          spin: new THREE.Vector3(
            1.8 + (index % 5) * 0.7,
            2.2 + (index % 7) * 0.5,
            2.6 + (index % 4) * 0.8,
          ),
          delay: (index % 6) * 0.018,
          color: index % 5 === 0 ? "#d7d2c3" : index % 3 === 0 ? "#667368" : "#39483e",
        };
      }),
    [],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (lastKeyRef.current !== burst.key) {
      lastKeyRef.current = burst.key;
      elapsedRef.current = 0;
      group.position.copy(burst.origin);
      group.visible = true;
    }

    elapsedRef.current += delta;
    const elapsed = elapsedRef.current;
    if (elapsed > 2.65) {
      group.visible = false;
      return;
    }

    group.children.forEach((child, index) => {
      const fragment = fragments[index];
      const t = Math.max(0, elapsed - fragment.delay);
      child.position.set(
        fragment.velocity.x * t,
        fragment.velocity.y * t - 3.9 * t * t,
        fragment.velocity.z * t,
      );
      child.rotation.set(
        fragment.spin.x * t,
        fragment.spin.y * t,
        fragment.spin.z * t,
      );
      const material = (child as THREE.Mesh).material;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.opacity = THREE.MathUtils.clamp((2.65 - elapsed) / 0.45, 0, 1);
      }
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      {fragments.map((fragment, index) => (
        <mesh key={index} castShadow>
          <boxGeometry args={[fragment.size.x, fragment.size.y, fragment.size.z]} />
          <meshStandardMaterial color={fragment.color} roughness={0.82} metalness={0.04} transparent />
        </mesh>
      ))}
    </group>
  );
}

// A pulsing ring dropped over whichever apparatus the player is currently
// looking at in Doing Mode — the "you can interact with this" affordance.
function InteractionHighlight({ position, active }: { position: THREE.Vector3; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    ringRef.current.visible = active;
    if (!active) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.z = t * 0.6;
    ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
  });

  return (
    <mesh ref={ringRef} position={[position.x, position.y + 0.03, position.z]} rotation={[-Math.PI / 2, 0, 0]} visible={active} renderOrder={30}>
      <ringGeometry args={[0.4, 0.5, 40]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.85} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function IgnitionFuse({
  burning,
  progress,
}: {
  burning: boolean;
  progress: number;
}) {
  const sparkRef = useRef<THREE.Group>(null);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        FUSE_END_POS.clone(),
        new THREE.Vector3(1.75, 0.13, 1.56),
        new THREE.Vector3(0.72, 0.13, 1.12),
        new THREE.Vector3(-0.2, 0.16, 0.78),
        new THREE.Vector3(-0.83, 0.25, 0.54),
        new THREE.Vector3(-1.32, 0.48, 0.31),
      ]),
    [],
  );
  const points = useMemo(() => curve.getPoints(90), [curve]);
  const burnIndex = Math.min(points.length - 1, Math.max(0, Math.floor(progress * (points.length - 1))));
  const burnedPoints = points.slice(0, Math.max(2, burnIndex + 1));
  const livePoints = points.slice(Math.max(0, burnIndex));

  useFrame(({ clock }) => {
    const spark = sparkRef.current;
    if (!spark || !burning) return;
    spark.position.copy(curve.getPointAt(THREE.MathUtils.clamp(progress, 0, 1)));
    const t = clock.elapsedTime;
    spark.children.forEach((child, index) => {
      if (index === 0 || !(child instanceof THREE.Mesh)) return;
      const angle = t * (8 + index * 0.7) + index * 2.1;
      const radius = 0.035 + (index % 4) * 0.018;
      child.position.set(
        Math.cos(angle) * radius,
        0.025 + ((t * (0.18 + index * 0.025) + index * 0.04) % 0.22),
        Math.sin(angle) * radius,
      );
      child.scale.setScalar(0.65 + Math.sin(angle * 1.7) * 0.25);
    });
  });

  return (
    <group>
      <Line points={livePoints.length > 1 ? livePoints : points.slice(-2)} color="#341f16" lineWidth={5.2} />
      {progress > 0 && <Line points={burnedPoints} color="#8a7b6c" lineWidth={3.2} transparent opacity={0.72} />}

      {/* The walk-up ignition end: a raised brass cap keeps it readable on
          grass and marks the exact end the player should light. */}
      <group position={[FUSE_END_POS.x, FUSE_END_POS.y - 0.08, FUSE_END_POS.z]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <cylinderGeometry args={[0.13, 0.18, 0.12, 20]} />
          <meshStandardMaterial color="#7a4b24" metalness={0.42} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.13, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 0.13, 14]} />
          <meshStandardMaterial color={burning ? "#fbbf24" : "#b56a2d"} emissive={burning ? "#f97316" : "#000000"} emissiveIntensity={burning ? 1.8 : 0} roughness={0.62} />
        </mesh>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.27, 28]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.48} depthWrite={false} />
        </mesh>
      </group>

      <group ref={sparkRef} visible={burning}>
        <mesh>
          <sphereGeometry args={[0.075, 18, 14]} />
          <meshBasicMaterial color="#fff7b2" toneMapped={false} />
        </mesh>
        {Array.from({ length: 11 }, (_, index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.018 + (index % 3) * 0.006, 8, 6]} />
            <meshBasicMaterial color={index % 3 === 0 ? "#fff7ae" : index % 2 === 0 ? "#fb923c" : "#ef4444"} toneMapped={false} />
          </mesh>
        ))}
        <pointLight intensity={2.8} distance={2.1} decay={2} color="#ff8a2a" />
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Cannon launcher
// ---------------------------------------------------------------------------

function SpokedWheel({ z }: { z: number }) {
  const spokes = useMemo(() => Array.from({ length: 10 }, (_, index) => (index * Math.PI) / 10), []);

  return (
    <group position={[-1.48, 0.38, z]}>
      <mesh castShadow>
        <torusGeometry args={[0.35, 0.052, 12, 48]} />
        <meshStandardMaterial color="#252829" metalness={0.72} roughness={0.5} />
      </mesh>
      <mesh castShadow>
        <torusGeometry args={[0.292, 0.026, 10, 40]} />
        <meshStandardMaterial color="#6d4124" metalness={0.05} roughness={0.76} />
      </mesh>
      {spokes.map((rotation, index) => (
        <mesh key={index} rotation={[0, 0, rotation]} castShadow>
          <boxGeometry args={[0.565, 0.035, 0.045]} />
          <meshStandardMaterial color="#7d4b29" roughness={0.78} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.105, 0.105, 0.2, 24]} />
        <meshStandardMaterial color="#292c2d" metalness={0.78} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0, z > 0 ? 0.105 : -0.105]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.018, 18]} />
        <meshStandardMaterial color="#6f7474" metalness={0.88} roughness={0.28} />
      </mesh>
    </group>
  );
}

function CannonLauncher({
  angleDeg,
  resetKey,
  playing,
}: {
  angleDeg: number;
  resetKey: number;
  playing: boolean;
}) {
  const theta = degToRad(angleDeg);
  const barrelLength = CANNON_BARREL_LENGTH;
  const pivot = CANNON_PIVOT;
  const direction = new THREE.Vector3(Math.cos(theta), Math.sin(theta), 0);
  const muzzle = launchOrigin({ angleDeg });
  const aimEnd = pivot.clone().add(direction.clone().multiplyScalar(barrelLength + 0.95));
  const carriageRef = useRef<THREE.Group>(null);
  const barrelRef = useRef<THREE.Group>(null);
  const recoilElapsedRef = useRef(99);
  const lastResetKeyRef = useRef(resetKey);
  const protractorTicks = useMemo(() => [0, 15, 30, 45, 60, 75, 90], []);

  useFrame((_, delta) => {
    const carriage = carriageRef.current;
    const barrel = barrelRef.current;
    if (!carriage || !barrel) return;

    if (lastResetKeyRef.current !== resetKey) {
      lastResetKeyRef.current = resetKey;
      recoilElapsedRef.current = playing ? 0 : 99;
    }

    recoilElapsedRef.current += delta;
    const elapsed = recoilElapsedRef.current;
    if (elapsed < 0.58) {
      const kick = Math.sin(Math.min(1, elapsed / 0.055) * Math.PI * 0.5) * Math.exp(-elapsed * 6.8);
      carriage.position.x = -Math.cos(theta) * kick * 0.16;
      carriage.rotation.z = -kick * 0.018;
      barrel.position.set(
        pivot.x - direction.x * kick * 0.09,
        pivot.y - direction.y * kick * 0.09,
        pivot.z
      );
    } else {
      carriage.position.set(0, 0, 0);
      carriage.rotation.set(0, 0, 0);
      barrel.position.set(pivot.x, pivot.y, pivot.z);
    }
  });

  return (
    <group ref={carriageRef}>
      {/* Timber carriage and trail. */}
      <mesh position={[-1.38, 0.24, 0.35]} rotation={[0, 0, -0.035]} castShadow receiveShadow>
        <boxGeometry args={[1.38, 0.18, 0.16]} />
        <meshStandardMaterial color="#704326" roughness={0.82} />
      </mesh>
      <mesh position={[-1.38, 0.24, -0.35]} rotation={[0, 0, -0.035]} castShadow receiveShadow>
        <boxGeometry args={[1.38, 0.18, 0.16]} />
        <meshStandardMaterial color="#704326" roughness={0.82} />
      </mesh>
      <mesh position={[-2.12, 0.15, 0.23]} rotation={[0, 0, 0.035]} castShadow>
        <boxGeometry args={[1.45, 0.13, 0.13]} />
        <meshStandardMaterial color="#654026" roughness={0.86} />
      </mesh>
      <mesh position={[-2.12, 0.15, -0.23]} rotation={[0, 0, 0.035]} castShadow>
        <boxGeometry args={[1.45, 0.13, 0.13]} />
        <meshStandardMaterial color="#654026" roughness={0.86} />
      </mesh>
      <mesh position={[-1.31, 0.29, 0]} castShadow>
        <boxGeometry args={[0.42, 0.16, 0.82]} />
        <meshStandardMaterial color="#79502e" roughness={0.8} />
      </mesh>

      {/* Axle, wheels and forged hardware. */}
      <mesh position={[-1.48, 0.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.072, 0.072, 1.12, 24]} />
        <meshStandardMaterial color="#2a2d2e" metalness={0.84} roughness={0.4} />
      </mesh>
      <SpokedWheel z={0.51} />
      <SpokedWheel z={-0.51} />

      {/* Elevation screw and quadrant scale. */}
      <mesh position={[-1.42, 0.49, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 0.42, 16]} />
        <meshStandardMaterial color="#3c4141" metalness={0.78} roughness={0.38} />
      </mesh>
      <mesh position={[-1.42, 0.71, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.22, 20]} />
        <meshStandardMaterial color="#292d2d" metalness={0.82} roughness={0.34} />
      </mesh>
      <mesh position={[pivot.x, pivot.y, 0.535]}>
        <torusGeometry args={[0.34, 0.012, 6, 48, Math.PI / 2]} />
        <meshStandardMaterial color="#c8ae75" metalness={0.62} roughness={0.38} />
      </mesh>
      {protractorTicks.map((tick) => {
        const tickAngle = degToRad(tick);
        return (
          <mesh
            key={tick}
            position={[
              pivot.x + Math.cos(tickAngle) * 0.34,
              pivot.y + Math.sin(tickAngle) * 0.34,
              0.54,
            ]}
            rotation={[0, 0, tickAngle]}
          >
            <boxGeometry args={[0.065, 0.012, 0.012]} />
            <meshStandardMaterial color="#e2ca92" metalness={0.55} roughness={0.4} />
          </mesh>
        );
      })}

      {/* Rotating cast-iron barrel; local +X is the firing direction. */}
      <group ref={barrelRef} position={[pivot.x, pivot.y, pivot.z]} rotation={[0, 0, theta]}>
        <mesh position={[1.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.155, 0.21, 1.8, 40]} />
          <meshStandardMaterial color="#363d3e" metalness={0.58} roughness={0.38} />
        </mesh>
        <mesh position={[0.03, 0, 0]} scale={[1.15, 1, 1]} castShadow>
          <sphereGeometry args={[0.225, 32, 24]} />
          <meshStandardMaterial color="#323839" metalness={0.6} roughness={0.42} />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.105, 0.105, 1.0, 24]} />
          <meshStandardMaterial color="#303536" metalness={0.86} roughness={0.34} />
        </mesh>
        {[0.27, 1.78].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <torusGeometry args={[x < 1 ? 0.215 : 0.17, 0.026, 10, 36]} />
            <meshStandardMaterial color="#171b1c" metalness={0.88} roughness={0.32} />
          </mesh>
        ))}
        <mesh position={[barrelLength + 0.005, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.17, 0.038, 12, 40]} />
          <meshStandardMaterial color="#171b1c" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[barrelLength + 0.024, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.118, 0.118, 0.018, 32]} />
          <meshStandardMaterial color="#030404" metalness={0.25} roughness={0.88} />
        </mesh>
      </group>

      {/* Subtle aiming cue retained as a teaching overlay. */}
      <Line
        points={[muzzle, aimEnd]}
        color="#f5e8c7"
        lineWidth={1}
        dashed
        dashSize={0.24}
        gapSize={0.2}
        transparent
        opacity={0.52}
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Firing platform, pavilion and apparatus dressing (realism pass)
// ---------------------------------------------------------------------------

function ExitSignSurface() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 96;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#065f46";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#022c22";
    context.lineWidth = 6;
    context.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
    context.fillStyle = "#ffffff";
    context.font = "900 52px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("EXIT", canvas.width / 2, canvas.height / 2 + 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[0.62, 0.23]} />
      <meshBasicMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#065f46"} toneMapped={false} />
    </mesh>
  );
}

// A decorative fire-exit style door on the range control hut — visible and
// walkable up to, but purely scenery: there's no "outside" behind it to
// actually leave to.
function RangeExitDoor({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.72, 2.85, 0.12]} />
        <meshStandardMaterial color="#3a3f38" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0.05]} castShadow>
        <boxGeometry args={[1.42, 2.62, 0.08]} />
        <meshStandardMaterial color="#5c6b57" roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.55, 0.095]}>
        <planeGeometry args={[0.55, 0.62]} />
        <meshPhysicalMaterial color="#cfe0da" roughness={0.2} transmission={0.4} clearcoat={0.6} />
      </mesh>
      {[-0.16, 0, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.098]}>
          <boxGeometry args={[0.012, 0.62, 0.004]} />
          <meshBasicMaterial color="#3a3f38" />
        </mesh>
      ))}
      <mesh position={[0, -0.35, 0.1]} castShadow>
        <boxGeometry args={[0.92, 0.09, 0.05]} />
        <meshStandardMaterial color="#9aa39c" metalness={0.7} roughness={0.3} />
      </mesh>
      <group position={[0, 1.62, 0.02]}>
        <mesh>
          <boxGeometry args={[0.7, 0.28, 0.05]} />
          <meshStandardMaterial color="#1f2937" roughness={0.5} />
        </mesh>
        <ExitSignSurface />
      </group>
    </group>
  );
}

// A small timber-and-corrugated range control hut, standing well clear of
// the firing lane, that hosts the decorative exit door.
function RangeControlHut({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.35, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.4, 2.7, 2.8]} />
        <meshStandardMaterial color="#8a7a5c" roughness={0.82} />
      </mesh>
      <mesh position={[0, 2.86, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.55, 0.9, 4]} />
        <meshStandardMaterial color="#5c4a3a" roughness={0.72} />
      </mesh>
      <mesh position={[1.71, 1.6, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.5, 0.9]} />
        <meshPhysicalMaterial color="#bfe0da" roughness={0.16} transmission={0.5} clearcoat={0.6} />
      </mesh>
      <RangeExitDoor position={[0, 0, 1.41]} rotationY={0} />
    </group>
  );
}

// A wood-decked, low-walled firing platform under and around the cannon so
// Doing Mode has a believable surface to stand on rather than bare dirt.
function FiringPlatform() {
  const plankLines = useMemo(() => Array.from({ length: 14 }, (_, i) => -3.25 + i * 0.5), []);
  return (
    <group position={[-1.25, 0, 0]}>
      <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[4.6, 4.75, 0.1, 48]} />
        <meshStandardMaterial color="#8a6b45" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.101, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.55, 48]} />
        <meshStandardMaterial color="#a3835a" roughness={0.62} />
      </mesh>
      {plankLines.map((z) => (
        <mesh key={z} position={[0, 0.107, z]}>
          <boxGeometry args={[9.1, 0.004, 0.02]} />
          <meshStandardMaterial color="#6b512f" roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[0, -0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.6, 4.95, 48]} />
        <meshStandardMaterial color="#525b52" roughness={0.9} />
      </mesh>
    </group>
  );
}

// A covered gantry above the cannon with hanging lanterns — the "ceiling
// light" detail for an outdoor firing range rather than an indoor room.
function FiringPavilion({
  shattered,
  impactX,
}: {
  shattered: boolean;
  impactX: number | null;
}) {
  const postPositions: [number, number][] = [
    [-3.1, -1.55],
    [-3.1, 1.55],
    [1.05, -1.55],
    [1.05, 1.55],
  ];
  const roofMinX = -3.38;
  const roofMaxX = 1.32;
  const holeHalfWidth = 0.54;
  const holeCenterX = THREE.MathUtils.clamp((impactX ?? -1.25) + 1.25, roofMinX + holeHalfWidth, roofMaxX - holeHalfWidth);
  const leftWidth = Math.max(0.05, holeCenterX - holeHalfWidth - roofMinX);
  const rightWidth = Math.max(0.05, roofMaxX - holeCenterX - holeHalfWidth);

  return (
    <group position={[-1.25, 0, 0]}>
      {postPositions.map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 1.55, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 3.1, 12]} />
          <meshStandardMaterial color="#5c4a34" roughness={0.78} />
        </mesh>
      ))}
      {!shattered ? (
        <>
          <mesh position={[-1.03, 3.14, 0]} receiveShadow castShadow>
            <boxGeometry args={[4.7, 0.12, 3.7]} />
            <meshStandardMaterial color="#3f4d43" roughness={0.55} metalness={0.1} />
          </mesh>
          <mesh position={[-1.03, 3.02, 0]}>
            <boxGeometry args={[4.5, 0.03, 3.5]} />
            <meshStandardMaterial color="#e7e4d8" emissive="#fff7e0" emissiveIntensity={0.9} roughness={0.4} />
          </mesh>
        </>
      ) : (
        <>
          <mesh position={[roofMinX + leftWidth / 2, 3.14, 0]} receiveShadow castShadow>
            <boxGeometry args={[leftWidth, 0.12, 3.7]} />
            <meshStandardMaterial color="#3f4d43" roughness={0.64} metalness={0.08} />
          </mesh>
          <mesh position={[holeCenterX + holeHalfWidth + rightWidth / 2, 3.14, 0]} receiveShadow castShadow>
            <boxGeometry args={[rightWidth, 0.12, 3.7]} />
            <meshStandardMaterial color="#3f4d43" roughness={0.64} metalness={0.08} />
          </mesh>
          <mesh position={[holeCenterX, 3.14, -1.37]} receiveShadow castShadow>
            <boxGeometry args={[holeHalfWidth * 2, 0.12, 0.96]} />
            <meshStandardMaterial color="#3f4d43" roughness={0.64} metalness={0.08} />
          </mesh>
          <mesh position={[holeCenterX, 3.14, 1.37]} receiveShadow castShadow>
            <boxGeometry args={[holeHalfWidth * 2, 0.12, 0.96]} />
            <meshStandardMaterial color="#3f4d43" roughness={0.64} metalness={0.08} />
          </mesh>
          {[-0.62, 0.64].map((offset, index) => (
            <mesh
              key={offset}
              position={[holeCenterX + offset, 2.92 - index * 0.06, index === 0 ? -0.2 : 0.24]}
              rotation={[0.12, index === 0 ? 0.2 : -0.18, index === 0 ? -0.46 : 0.5]}
              castShadow
            >
              <boxGeometry args={[0.5, 0.055, 0.42]} />
              <meshStandardMaterial color="#657269" roughness={0.76} metalness={0.05} />
            </mesh>
          ))}
          <mesh position={[holeCenterX, 3.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.48, 0.66, 12]} />
            <meshStandardMaterial color="#191f1b" roughness={1} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}
      {[-2.6, -1.03, 0.6].map((x) => (
        <group key={x} position={[x, 2.8, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 8]} />
            <meshStandardMaterial color="#2a2d2e" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color="#fff2c8" emissive="#ffd97a" emissiveIntensity={1.6} roughness={0.3} />
          </mesh>
          <pointLight position={[0, -0.2, 0]} intensity={0.55} distance={6} color="#ffe6a8" />
        </group>
      ))}
    </group>
  );
}

// A wooden ammunition crate stacked with cannonballs — doubles as the
// "power" station in Doing Mode.
function AmmoCrate({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.19, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.62, 0.38, 0.46]} />
        <meshStandardMaterial color="#6b4e30" roughness={0.85} />
      </mesh>
      {[0.14, -0.14].map((x) =>
        [0.1, -0.1].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.44, z]} castShadow>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color="#2a2d2e" metalness={0.5} roughness={0.45} />
          </mesh>
        ))
      )}
      <mesh position={[0, 0.5, 0]} castShadow>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#2a2d2e" metalness={0.5} roughness={0.45} />
      </mesh>
    </group>
  );
}

// A signpost with a rotating gravity dial and Earth/Moon/Mars placards —
// doubles as the "gravity" station in Doing Mode.
function GravitySignpost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 1.4, 12]} />
        <meshStandardMaterial color="#5c4a34" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.28, 0.03]} castShadow>
        <cylinderGeometry args={[0.16, 0.16, 0.04, 24]} />
        <meshStandardMaterial color="#d7cba3" roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0, 1.28, 0.06]} rotation={[0, 0, Math.PI / 5]}>
        <boxGeometry args={[0.02, 0.13, 0.01]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.4} />
      </mesh>
      {GRAVITY_PRESETS.map((preset, index) => (
        <mesh key={preset.label} position={[0, 1.0 - index * 0.24, 0.03]} castShadow>
          <boxGeometry args={[0.42, 0.16, 0.02]} />
          <meshStandardMaterial color={["#8fbf8a", "#9fb3d4", "#d19a76"][index]} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// A painted range info board — the "protractor / angle scale" apparatus
// detail — doubling as the visual anchor for the "angle" station.
function RangeInfoBoardSurface() {
  const texture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const context = canvas.getContext("2d");
    if (!context) return null;

    context.fillStyle = "#0f3d3a";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#ffffff";
    context.font = "800 34px Arial, sans-serif";
    context.fillText("PROJECTILE RANGE", canvas.width / 2, 46);

    const cx = canvas.width / 2;
    const cy = 210;
    const r = 130;
    context.strokeStyle = "rgba(255,255,255,0.55)";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(cx, cy, r, Math.PI, Math.PI * 2);
    context.stroke();
    for (let deg = 0; deg <= 180; deg += 15) {
      const angle = Math.PI + (deg / 180) * Math.PI;
      const outer = r;
      const inner = r - (deg % 45 === 0 ? 18 : 10);
      context.beginPath();
      context.moveTo(cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer);
      context.lineTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
      context.stroke();
      if (deg % 45 === 0) {
        context.fillStyle = "#bff7e6";
        context.font = "600 16px Arial, sans-serif";
        context.fillText(`${deg}`, cx + Math.cos(angle) * (r + 18), cy + Math.sin(angle) * (r + 18));
      }
    }
    context.fillStyle = "#eafff9";
    context.font = "600 18px Arial, sans-serif";
    context.fillText("Set angle, power and gravity, then launch", cx, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => () => texture?.dispose(), [texture]);

  return (
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[1.6, 1.0]} />
      <meshBasicMaterial map={texture ?? undefined} color={texture ? "#ffffff" : "#0f3d3a"} toneMapped={false} />
    </mesh>
  );
}

function RangeInfoBoard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[-0.02, 0.5, -0.85]} castShadow>
        <cylinderGeometry args={[0.035, 0.045, 1.6, 10]} />
        <meshStandardMaterial color="#5c4a34" roughness={0.8} />
      </mesh>
      <group position={[0, 1.15, -0.85]} rotation={[-0.18, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.7, 1.1, 0.06]} />
          <meshStandardMaterial color="#1b332f" roughness={0.7} />
        </mesh>
        <RangeInfoBoardSurface />
      </group>
    </group>
  );
}

// Groups all the non-flight-path dressing so the Scene stays tidy: the
// platform, the pavilion, the two control-station props and the exit hut.
function RangeDressing({
  ceilingShattered,
  ceilingImpactX,
}: {
  ceilingShattered: boolean;
  ceilingImpactX: number | null;
}) {
  return (
    <group>
      <FiringPlatform />
      <FiringPavilion shattered={ceilingShattered} impactX={ceilingImpactX} />
      <AmmoCrate position={[POWER_STATION_POS.x - 0.35, 0.1, POWER_STATION_POS.z - 0.35]} />
      <GravitySignpost position={[GRAVITY_STATION_POS.x, 0, GRAVITY_STATION_POS.z]} />
      <RangeInfoBoard position={[ANGLE_STATION_POS.x + 0.15, 0, ANGLE_STATION_POS.z + 0.35]} />
      <RangeControlHut position={[-6.4, 0, 5.6]} />
    </group>
  );
}

function Terrain() {
  const length = RANGE_TERRAIN_END_X - RANGE_TERRAIN_START_X;
  const geometry = useMemo(() => {
    const terrain = new THREE.PlaneGeometry(length, RANGE_TERRAIN_WIDTH, 240, 64);
    const positions = terrain.attributes.position as THREE.BufferAttribute;
    const colors: number[] = [];
    const deepGrass = new THREE.Color("#526c35");
    const lightGrass = new THREE.Color("#789451");
    const dryGrass = new THREE.Color("#8c8953");

    for (let index = 0; index < positions.count; index += 1) {
      const localX = positions.getX(index);
      const localZ = positions.getY(index);
      const worldX = localX + RANGE_TERRAIN_START_X + length / 2;
      const laneBlend = THREE.MathUtils.smoothstep(Math.abs(localZ), 3.2, 12);
      const broadWave =
        Math.sin(worldX * 0.075 + localZ * 0.16) * 0.16 +
        Math.cos(worldX * 0.031 - localZ * 0.28) * 0.1;
      const fineWave = Math.sin(worldX * 0.31 + localZ * 0.54) * 0.035;
      const height = laneBlend * (broadWave + fineWave);
      positions.setZ(index, height);

      const colorNoise = (Math.sin(worldX * 0.19 + localZ * 0.37) + 1) * 0.5;
      const color = deepGrass.clone().lerp(lightGrass, 0.28 + colorNoise * 0.46);
      if (height < -0.08 || colorNoise > 0.86) color.lerp(dryGrass, 0.28);
      colors.push(color.r, color.g, color.b);
    }

    terrain.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    terrain.computeVertexNormals();
    return terrain;
  }, [length]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh
      geometry={geometry}
      position={[RANGE_TERRAIN_START_X + length / 2, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial vertexColors roughness={0.98} metalness={0} />
    </mesh>
  );
}

function CloudField() {
  const fieldRef = useRef<THREE.Group>(null);
  const cloudTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) return null;
    const gradient = context.createRadialGradient(60, 54, 7, 64, 64, 62);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.38, "rgba(253,254,255,0.94)");
    gradient.addColorStop(0.7, "rgba(235,243,247,0.5)");
    gradient.addColorStop(1, "rgba(218,230,236,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }, []);
  const cloudLayers = useMemo(() => {
    const nearCenters = Array.from({ length: 9 }, (_, index) => -38 + index * 24);
    const distantCenters = Array.from({ length: 46 }, (_, index) => 190 + index * 66);
    const positions: number[][] = [[], [], []];
    const seeded = (value: number) => {
      const noise = Math.sin(value * 12.9898) * 43758.5453;
      return noise - Math.floor(noise);
    };

    [...nearCenters, ...distantCenters].forEach((centerX, cloudIndex) => {
      const centerY = 16 + ((cloudIndex * 17) % 8);
      const skySide = cloudIndex % 3;
      const sideDistance = 38 + ((cloudIndex * 23) % 30);
      const centerZ = skySide === 0 ? -sideDistance : skySide === 1 ? sideDistance : -22 + ((cloudIndex * 11) % 12);
      const cloudScale = 0.78 + ((cloudIndex * 13) % 7) * 0.07;
      for (let puffIndex = 0; puffIndex < 30; puffIndex += 1) {
        const column = puffIndex % 10;
        const row = Math.floor(puffIndex / 10);
        const horizontal = (column - 4.5) / 4.5;
        const crown = Math.max(0, 1 - horizontal * horizontal);
        const xJitter = (seeded(cloudIndex * 37 + puffIndex * 5 + 1) - 0.5) * 1.5;
        const yJitter = (seeded(cloudIndex * 41 + puffIndex * 7 + 2) - 0.5) * 0.95;
        const zJitter = (seeded(cloudIndex * 43 + puffIndex * 11 + 3) - 0.5) * 4;
        const layerIndex = (puffIndex + cloudIndex) % 3;
        positions[layerIndex].push(
          centerX + horizontal * 8.5 * cloudScale + xJitter,
          centerY + (row - 1) * 0.72 + crown * 2.45 * cloudScale + yJitter,
          centerZ + zJitter,
        );
      }
    });

    return positions.map((layerPositions) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(layerPositions, 3));
      return geometry;
    });
  }, []);

  useEffect(
    () => () => {
      cloudTexture?.dispose();
      cloudLayers.forEach((geometry) => geometry.dispose());
    },
    [cloudLayers, cloudTexture],
  );

  useFrame(({ clock }) => {
    if (!fieldRef.current) return;
    fieldRef.current.position.z = Math.sin(clock.elapsedTime * 0.035) * 1.8;
  });

  return (
    <group ref={fieldRef}>
      {cloudLayers.map((geometry, index) => (
        <points key={index} geometry={geometry} frustumCulled={false}>
          <pointsMaterial
            map={cloudTexture}
            color={index === 0 ? "#dfe9ee" : index === 1 ? "#f1f6f8" : "#ffffff"}
            size={index === 0 ? 10.5 : index === 1 ? 8.3 : 6.6}
            sizeAttenuation
            alphaTest={0.015}
            opacity={index === 0 ? 0.62 : index === 1 ? 0.68 : 0.74}
            fog
            transparent
            depthWrite={false}
          />
        </points>
      ))}
    </group>
  );
}

function RangeFlag({ x, distance, index }: { x: number; distance: number; index: number }) {
  const flagShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.42, -0.12);
    shape.lineTo(0, -0.25);
    shape.closePath();
    return shape;
  }, []);

  return (
    <group position={[x, 0, -1.55]}>
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.017, 1.16, 10]} />
        <meshStandardMaterial color="#ded4bd" metalness={0.25} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.08, 0.008]}>
        <shapeGeometry args={[flagShape]} />
        <meshStandardMaterial
          color={index % 2 === 0 ? "#b7352d" : "#e5b63f"}
          side={THREE.DoubleSide}
          roughness={0.76}
        />
      </mesh>
      <mesh position={[0, 0.045, 0]} receiveShadow>
        <boxGeometry args={[0.035, 0.07, 0.42]} />
        <meshStandardMaterial color="#eee4cd" roughness={0.82} />
      </mesh>
      <Html position={[0, 0.26, 0.14]} center distanceFactor={18} occlude={false}>
        <div className="rounded border border-stone-500/60 bg-stone-100/90 px-1.5 py-0.5 text-[8px] font-black tabular-nums text-stone-800 shadow-sm">
          {distance} m
        </div>
      </Html>
    </group>
  );
}

function RangeTree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.19, 2.3, 10]} />
        <meshStandardMaterial color="#59422e" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.45, 0]} castShadow>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial color="#405d31" roughness={0.98} />
      </mesh>
      <mesh position={[0.58, 2.26, 0.08]} castShadow>
        <icosahedronGeometry args={[0.68, 2]} />
        <meshStandardMaterial color="#4d6a38" roughness={0.98} />
      </mesh>
      <mesh position={[-0.52, 2.2, -0.12]} castShadow>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshStandardMaterial color="#526f3b" roughness={0.98} />
      </mesh>
    </group>
  );
}

function BoundaryFence({ startX, endX }: { startX: number; endX: number }) {
  const count = Math.min(170, Math.max(24, Math.ceil((endX - startX) / 24)));
  const posts = useMemo(
    () =>
      Array.from({ length: count }, (_, index) =>
        THREE.MathUtils.lerp(startX, endX, index / Math.max(1, count - 1))
      ),
    [count, endX, startX]
  );

  return (
    <group>
      {[-8.5, 8.5].map((z) => (
        <group key={z}>
          {posts.map((x, index) => (
            <mesh key={index} position={[x, 0.55, z]} castShadow>
              <boxGeometry args={[0.09, 1.1, 0.09]} />
              <meshStandardMaterial color="#72543b" roughness={0.9} />
            </mesh>
          ))}
          {[0.35, 0.7].map((y) => (
            <Line
              key={y}
              points={[
                [startX, y, z],
                [endX, y, z],
              ]}
              color="#6c706d"
              lineWidth={0.55}
              transparent
              opacity={0.72}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function LandingScratchMark({ mark }: { mark: LandingScratch }) {
  const half = mark.length / 2;
  return (
    <group position={[mark.x, 0.046, mark.z]} rotation={[0, mark.rotation, 0]}>
      <Line
        points={[
          [-half, 0, 0],
          [-half * 0.45, 0.006, -0.035],
          [0, 0.002, 0.018],
          [half * 0.48, 0.005, -0.025],
          [half, 0, 0.01],
        ]}
        color="#201810"
        lineWidth={3.1}
      />
      <Line
        points={[
          [-half * 0.68, 0.004, 0.09],
          [-half * 0.14, 0.007, 0.035],
          [half * 0.58, 0.003, 0.075],
        ]}
        color="#4b3624"
        lineWidth={1.6}
      />
      <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[half * 0.82, 0.13, 1]} receiveShadow>
        <circleGeometry args={[1, 36]} />
        <meshStandardMaterial color="#34251a" transparent opacity={0.62} roughness={1} />
      </mesh>
    </group>
  );
}

function Ground({
  landingX,
  landingScratches,
  launchX,
  predictedLandingX,
}: {
  landingX: number | null;
  landingScratches: LandingScratch[];
  launchX: number;
  predictedLandingX: number;
}) {
  const endX = RANGE_TERRAIN_END_X;
  const distance = Math.max(0, predictedLandingX - launchX);
  const markerStep = distance <= 80 ? 5 : distance <= 320 ? 25 : distance <= 1200 ? 100 : 250;
  const markerDistances = useMemo(() => {
    const values: number[] = [];
    for (let value = markerStep; value < distance + markerStep * 0.35; value += markerStep) {
      values.push(value);
      if (values.length >= 18) break;
    }
    return values;
  }, [distance, markerStep]);
  const trees = useMemo(() => {
    const nearTrees = Array.from({ length: 14 }, (_, index) => {
      return {
        x: -10 + index * 8.25,
        z: index % 2 === 0 ? -12.5 - (index % 3) * 1.3 : 12.5 + (index % 4) * 1.1,
        scale: 0.72 + ((index * 37) % 6) * 0.075,
      };
    });
    const distantTrees = Array.from({ length: 52 }, (_, index) => ({
      x: 118 + index * 59,
      z: index % 2 === 0 ? -15 - (index % 4) * 1.5 : 15 + (index % 5) * 1.25,
      scale: 0.68 + ((index * 29) % 7) * 0.07,
    }));
    return [...nearTrees, ...distantTrees];
  }, [endX]);

  return (
    <>
      <Terrain />

      {/* Mown central lane and worn soil around the apparatus. */}
      <mesh position={[(endX - 12) / 2, 0.008, 0]} receiveShadow>
        <boxGeometry args={[endX + 12, 0.014, 5.2]} />
        <meshStandardMaterial color="#687d45" roughness={0.98} />
      </mesh>
      <mesh position={[-1.35, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.3, 56]} />
        <meshStandardMaterial color="#786044" roughness={1} />
      </mesh>

      {/* Surveyor's tape and flags retain the measurement lesson without a neon grid. */}
      <Line
        points={[
          [launchX, 0.055, -1.55],
          [predictedLandingX, 0.055, -1.55],
        ]}
        color="#f0d98f"
        lineWidth={1.4}
        transparent
        opacity={0.86}
      />
      {markerDistances.map((markerDistance, index) => (
        <RangeFlag
          key={markerDistance}
          x={launchX + markerDistance}
          distance={markerDistance}
          index={index}
        />
      ))}

      <BoundaryFence startX={-10} endX={endX} />
      {trees.map((tree, index) => (
        <RangeTree key={index} {...tree} />
      ))}

      {/* Launch datum. */}
      <mesh position={[launchX, 0.03, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.025, 24]} />
        <meshStandardMaterial color="#e1c572" metalness={0.22} roughness={0.65} />
      </mesh>

      {landingScratches.map((mark) => (
        <LandingScratchMark key={mark.id} mark={mark} />
      ))}

      {landingX !== null && (
        <group position={[landingX, 0.032, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.34, 36]} />
            <meshStandardMaterial color="#342a20" roughness={1} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.25, 0.39, 40]} />
            <meshStandardMaterial color="#6a543c" roughness={1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </>
  );
}
// ---------------------------------------------------------------------------
// Scene wrapper
// ---------------------------------------------------------------------------

function Scene({
  params,
  playing,
  paused,
  resetKey,
  onLanded,
  onCeilingHit,
  landingX,
  landingScratches,
  ceilingShattered,
  ceilingImpactX,
  ceilingBurst,
  fuseBurning,
  fuseProgress,
  speedMultiplier,
  onTick,
  shake,
  smokeBurst,
  flareBurst,
  dustBurst,
  liveRange,
  liveHeight,
  mode = "learning",
  isMobile = false,
  interactables = [],
  activeTargetId = null,
  moveVectorRef,
  onTargetChange,
}: BallProps & {
  landingX: number | null;
  landingScratches: LandingScratch[];
  ceilingShattered: boolean;
  ceilingImpactX: number | null;
  ceilingBurst: BurstState;
  fuseBurning: boolean;
  fuseProgress: number;
  shake: ShakeState;
  smokeBurst: BurstState;
  flareBurst: BurstState;
  dustBurst: BurstState;
  liveRange: number;
  liveHeight: number;
  mode?: "learning" | "doing";
  isMobile?: boolean;
  interactables?: Interactable[];
  activeTargetId?: string | null;
  moveVectorRef?: MutableRefObject<{ x: number; y: number }>;
  onTargetChange?: (target: Interactable | null) => void;
}) {
  const { camera, size } = useThree();
  const controlsRef = useRef<any>(null);
  const manualCameraOverrideRef = useRef(false);
  const isMobileFrame = size.width < 640;
  const trajectoryBounds = useMemo(() => {
    const points = sampleTrajectory(params, 80);
    const minX = Math.min(-3.2, ...points.map((point) => point.x));
    const maxX = Math.max(8, ...points.map((point) => point.x));
    const maxY = Math.max(3.5, ...points.map((point) => point.y));
    return {
      minX,
      maxX,
      maxY,
      landingX: points[points.length - 1]?.x ?? 8,
    };
  }, [params.angleDeg, params.gravity, params.velocity]);
  const verticalFov = isMobileFrame ? 54 : 50;
  const aspect = Math.max(0.35, size.width / Math.max(1, size.height));
  const horizontalFov = 2 * Math.atan(Math.tan(degToRad(verticalFov) / 2) * aspect);
  const spanX = Math.max(12, trajectoryBounds.maxX - trajectoryBounds.minX);
  const rawCameraDistance = Math.max(
    14,
    (spanX * 0.56) / Math.tan(horizontalFov / 2),
    (trajectoryBounds.maxY * 0.72) / Math.tan(degToRad(verticalFov) / 2)
  );
  const cameraDistance = Math.min(rawCameraDistance, isMobileFrame ? 86 : 120);
  const needsTrackingCamera = rawCameraDistance > cameraDistance + 1;
  const overviewMaxX = needsTrackingCamera
    ? Math.min(trajectoryBounds.maxX, trajectoryBounds.minX + (isMobileFrame ? 44 : 76))
    : trajectoryBounds.maxX;
  const overviewHeight = needsTrackingCamera ? Math.min(trajectoryBounds.maxY, 35) : trajectoryBounds.maxY;
  const cameraTarget = useMemo<[number, number, number]>(
    () => [
      (trajectoryBounds.minX + overviewMaxX) / 2,
      overviewHeight * (isMobileFrame ? 0.31 : 0.28),
      0,
    ],
    [isMobileFrame, overviewHeight, overviewMaxX, trajectoryBounds.minX]
  );
  const launchX = launchOrigin(params).x;
  const activeCameraTarget = useMemo(() => {
    if (!needsTrackingCamera) return new THREE.Vector3(...cameraTarget);
    if (playing) {
      return new THREE.Vector3(launchX + liveRange, Math.max(1.2, liveHeight * 0.92), 0);
    }
    if (landingX !== null) return new THREE.Vector3(landingX, 1.1, 0);
    return new THREE.Vector3(...cameraTarget);
  }, [cameraTarget, landingX, launchX, liveHeight, liveRange, needsTrackingCamera, playing]);
  const cameraStage = playing ? "flight" : landingX !== null ? "landed" : "setup";

  useEffect(() => {
    manualCameraOverrideRef.current = false;
  }, [cameraStage, resetKey]);

  useEffect(() => {
    // Doing Mode hands camera position/fov control to PlayerController — this
    // automatic framing is a Learning Mode-only concern.
    if (mode !== "learning") return;
    if (!manualCameraOverrideRef.current) {
      camera.position.set(
        cameraTarget[0],
        cameraTarget[1] + Math.max(2.8, overviewHeight * 0.2),
        cameraDistance
      );
      controlsRef.current?.target.set(...cameraTarget);
      camera.lookAt(...cameraTarget);
    }
    if ("fov" in camera) {
      const perspectiveCamera = camera as THREE.PerspectiveCamera;
      perspectiveCamera.fov = verticalFov;
      perspectiveCamera.near = 0.05;
      perspectiveCamera.far = Math.max(2000, cameraDistance * 8, trajectoryBounds.maxX * 2.5);
    }
    camera.updateProjectionMatrix();
  }, [camera, cameraDistance, cameraTarget, overviewHeight, trajectoryBounds.maxX, verticalFov, mode]);

  useFrame((_, delta) => {
    if (mode !== "learning") return;
    const controls = controlsRef.current;
    if (!controls || manualCameraOverrideRef.current) return;
    const smoothing = 1 - Math.exp(-delta * 3.2);
    const previousTarget = controls.target.clone();
    controls.target.lerp(activeCameraTarget, smoothing);
    if (needsTrackingCamera) {
      const followDelta = controls.target.clone().sub(previousTarget);
      camera.position.add(followDelta);
    }
    controls.update();
  });

  return (
    <>
      <color attach="background" args={["#bed3dc"]} />
      <fog
        attach="fog"
        args={[
          "#bed3dc",
          Math.max(120, cameraDistance * 2.2),
          Math.max(380, cameraDistance * 5.8),
        ]}
      />
      <Sky
        distance={450000}
        sunPosition={[85, 38, -70]}
        turbidity={5.5}
        rayleigh={1.25}
        mieCoefficient={0.004}
        mieDirectionalG={0.82}
      />
      <CloudField />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={["#d9ecf5", "#596943", 1.05]} />
      <directionalLight
        position={[18, 30, 16]}
        intensity={2.25}
        color="#fff3d6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={35}
        shadow-camera-bottom={-18}
        shadow-bias={-0.00025}
        shadow-normalBias={0.025}
      />
      <CameraImpulse shake={shake} />
      <Ground
        landingX={landingX}
        landingScratches={landingScratches}
        launchX={launchX}
        predictedLandingX={trajectoryBounds.landingX}
      />
      <RangeDressing ceilingShattered={ceilingShattered} ceilingImpactX={ceilingImpactX} />
      {mode === "doing" && <IgnitionFuse burning={fuseBurning} progress={fuseProgress} />}
      <CannonLauncher angleDeg={params.angleDeg} resetKey={resetKey} playing={playing} />
      {!playing && <PreviewTrajectory params={params} />}
      <ProjectileBall
        params={params}
        playing={playing}
        paused={paused}
        resetKey={resetKey}
        onLanded={onLanded}
        onCeilingHit={onCeilingHit}
        speedMultiplier={speedMultiplier}
        onTick={onTick}
      />
      <CeilingShatterBurst burst={ceilingBurst} />
      <ParticleBurst
        burst={smokeBurst}
        color="#c9c6bc"
        colors={SMOKE_COLORS}
        count={90}
        duration={1.55}
        spread={0.82}
        rise={0.9}
        size={0.28}
        directionPush={0.62}
      />
      <ParticleBurst
        burst={flareBurst}
        color="#f97316"
        colors={FLARE_COLORS}
        count={22}
        duration={0.42}
        spread={0.45}
        rise={0.12}
        size={0.2}
        directionPush={1.9}
      />
      <ParticleBurst
        burst={dustBurst}
        color="#a58b66"
        colors={DUST_COLORS}
        count={95}
        duration={1.05}
        spread={1.05}
        rise={0.38}
        size={0.24}
      />

      {mode === "doing" &&
        interactables.map((item) => <InteractionHighlight key={item.id} position={item.position} active={item.id === activeTargetId} />)}

      {mode === "learning" ? (
        <OrbitControls
          ref={controlsRef}
          makeDefault
          onStart={() => {
            manualCameraOverrideRef.current = true;
          }}
          minDistance={3.5}
          maxDistance={Math.max(100, cameraDistance * 3.5)}
          maxPolarAngle={Math.PI / 2.04}
          enableDamping
          dampingFactor={0.075}
        />
      ) : (
        <PlayerController
          bounds={PLAYER_BOUNDS}
          obstacles={CARRIAGE_OBSTACLES}
          spawn={PLAYER_SPAWN}
          isMobile={isMobile}
          enabled
          moveVector={moveVectorRef ?? defaultMoveVectorRef}
          onUpdate={(position, lookDirection) => {
            onTargetChange?.(resolveActiveInteractable(interactables, position, lookDirection));
          }}
        />
      )}
    </>
  );
}

const defaultMoveVectorRef = { current: { x: 0, y: 0 } };

interface FuturisticSliderProps {
  id: string;
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

function FuturisticSlider({
  id,
  label,
  value,
  displayValue,
  min,
  max,
  step,
  disabled = false,
  onChange,
}: FuturisticSliderProps) {
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div data-experiment-tour={`projectile-${id}`} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-3 shadow-inner shadow-white/[0.03] transition-all duration-300 hover:border-orange-300/30 hover:bg-white/[0.065]">
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <label htmlFor={id} className="min-w-0 truncate font-semibold text-slate-200">
          {label}
        </label>
        <span className="shrink-0 rounded-full border border-orange-300/20 bg-orange-300/10 px-2 py-0.5 text-xs font-black text-orange-100">
          {displayValue}
        </span>
      </div>
      <div className="relative h-8">
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
          <div
            className="futuristic-fill h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-orange-300 shadow-[0_0_18px_rgba(251,146,60,0.45)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(Number(event.target.value))}
          className="futuristic-range absolute inset-0 h-8 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed disabled:opacity-45"
        />
      </div>
    </div>
  );
}

const sevenSegmentMap: Record<string, Array<"a" | "b" | "c" | "d" | "e" | "f" | "g">> = {
  "0": ["a", "b", "c", "d", "e", "f"],
  "1": ["b", "c"],
  "2": ["a", "b", "d", "e", "g"],
  "3": ["a", "b", "c", "d", "g"],
  "4": ["b", "c", "f", "g"],
  "5": ["a", "c", "d", "f", "g"],
  "6": ["a", "c", "d", "e", "f", "g"],
  "7": ["a", "b", "c"],
  "8": ["a", "b", "c", "d", "e", "f", "g"],
  "9": ["a", "b", "c", "d", "f", "g"],
  "-": ["g"],
};

type DigitalTone = "red" | "green" | "cyan";

const digitalToneClass = {
  red: {
    active: "bg-red-500 shadow-[0_0_7px_rgba(239,68,68,1),0_0_18px_rgba(239,68,68,0.55)]",
    inactive: "bg-red-950/35",
    dot: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.95)]",
    unit: "text-red-500/90",
  },
  green: {
    active: "bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,1),0_0_18px_rgba(52,211,153,0.55)]",
    inactive: "bg-emerald-950/35",
    dot: "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.95)]",
    unit: "text-emerald-400/90",
  },
  cyan: {
    active: "bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,1),0_0_18px_rgba(34,211,238,0.55)]",
    inactive: "bg-cyan-950/35",
    dot: "bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.95)]",
    unit: "text-cyan-400/90",
  },
};

function SevenSegmentChar({
  char,
  tone = "red",
  compact = false,
}: {
  char: string;
  tone?: DigitalTone;
  compact?: boolean;
}) {
  if (char === ".") {
    return <span className={`${compact ? "mb-0.5 h-0.5 w-0.5" : "mb-1 h-1 w-1"} rounded-full ${digitalToneClass[tone].dot}`} />;
  }

  const activeSegments = sevenSegmentMap[char] ?? [];
  const segmentClassNames = compact
    ? {
        a: "left-[3px] top-0 h-[2px] w-[10px]",
        b: "right-0 top-[2px] h-[8px] w-[2px]",
        c: "right-0 bottom-[2px] h-[8px] w-[2px]",
        d: "bottom-0 left-[3px] h-[2px] w-[10px]",
        e: "bottom-[2px] left-0 h-[8px] w-[2px]",
        f: "left-0 top-[2px] h-[8px] w-[2px]",
        g: "left-[3px] top-[10px] h-[2px] w-[10px]",
      }
    : {
        a: "left-[4px] top-0 h-[3px] w-[15px]",
        b: "right-0 top-[3px] h-[13px] w-[3px]",
        c: "right-0 bottom-[3px] h-[13px] w-[3px]",
        d: "bottom-0 left-[4px] h-[3px] w-[15px]",
        e: "bottom-[3px] left-0 h-[13px] w-[3px]",
        f: "left-0 top-[3px] h-[13px] w-[3px]",
        g: "left-[4px] top-[16px] h-[3px] w-[15px]",
      };
  const isActive = (segment: keyof typeof segmentClassNames) => activeSegments.includes(segment);

  return (
    <span className={`relative inline-block ${compact ? "h-5 w-3.5" : "h-9 w-6"}`}>
      {(Object.keys(segmentClassNames) as Array<keyof typeof segmentClassNames>).map((segment) => (
        <span
          key={segment}
          className={`absolute rounded-full transition-all duration-200 ${
            segmentClassNames[segment]
          } ${
            isActive(segment)
              ? digitalToneClass[tone].active
              : digitalToneClass[tone].inactive
          }`}
        />
      ))}
    </span>
  );
}

function SevenSegmentText({
  value,
  tone = "red",
  compact = false,
}: {
  value: string;
  tone?: DigitalTone;
  compact?: boolean;
}) {
  return (
    <span key={value} className="flex min-w-0 animate-[digitalTick_220ms_ease-out] items-end justify-center gap-px">
      {value.split("").map((char, index) => (
        <SevenSegmentChar key={`${char}-${index}`} char={char} tone={tone} compact={compact} />
      ))}
    </span>
  );
}

function DigitalReadout({
  value,
  unit,
  label,
  tone = "red",
  compact = false,
}: {
  value: string;
  unit: string;
  label: string;
  tone?: DigitalTone;
  compact?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-[14px] border-[3px] border-[#575b60] bg-[#191b1d] text-center shadow-[inset_0_0_0_2px_rgba(0,0,0,0.8),0_8px_18px_rgba(0,0,0,0.45)] ${compact ? "px-1 pb-1 pt-1" : "px-1.5 pb-2 pt-1.5"}`}>
      <div className={`mx-auto flex justify-center ${compact ? "mb-0.5 gap-2" : "mb-1 gap-3"}`}>
        <span className={`${compact ? "h-0.5 w-2" : "h-1 w-3"} rounded-t bg-black`} />
        <span className={`${compact ? "h-0.5 w-2" : "h-1 w-3"} rounded-t bg-black`} />
        <span className={`${compact ? "h-0.5 w-2" : "h-1 w-3"} rounded-t bg-black`} />
      </div>
      <div className={`digital-screen mx-auto flex min-w-0 items-end justify-center gap-0.5 overflow-hidden rounded-md border border-black bg-[#050505] px-1 shadow-[inset_0_0_16px_rgba(0,0,0,0.95)] ${compact ? "min-h-[24px] py-1" : "min-h-[46px] py-1.5"}`}>
        <SevenSegmentText value={value} tone={tone} compact={compact} />
        <span className={`digital-unit font-black uppercase ${digitalToneClass[tone].unit} ${compact ? "pb-0.5 text-[6px]" : "pb-1 text-[8px]"}`}>
          {unit}
        </span>
      </div>
      <div className={`font-black uppercase tracking-[0.16em] text-slate-400 ${compact ? "mt-0.5 text-[7px]" : "mt-1.5 text-[9px]"}`}>
        {label}
      </div>
    </div>
  );
}

interface ExperimentPaperProps {
  angle: number;
  velocity: number;
  gravity: number;
  range: number;
  maxHeight: number;
  flightTime: number;
  landed: boolean;
  onClose: () => void;
}

function ExperimentPaper({
  angle,
  velocity,
  gravity,
  range,
  maxHeight,
  flightTime,
  landed,
  onClose,
}: ExperimentPaperProps) {
  const theta = degToRad(angle);
  const origin = launchOrigin({ angleDeg: angle });
  const vx0 = velocity * Math.cos(theta);
  const vy0 = velocity * Math.sin(theta);
  const safeGravity = Math.max(MIN_GRAVITY, gravity);
  const timeCalc =
    (vy0 + Math.sqrt(vy0 * vy0 + 2 * safeGravity * origin.y)) / safeGravity;
  const rangeCalc = vx0 * timeCalc;
  const heightCalc = origin.y + (vy0 * vy0) / (2 * safeGravity);

  return (
    <ExperimentPaperModal filename="projectile-motion-experiment-paper.html" onClose={onClose}>
      <MathJaxContext config={mathJaxConfig}>
          <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
          <h1 className="text-center text-xl font-bold uppercase tracking-wide">
            Determination of Projectile Range, Height and Time of Flight
          </h1>

          <h2 className="mt-6 text-base font-bold uppercase">Aim</h2>
          <p className="mt-1">
            To investigate the effect of launch angle, initial velocity and gravitational
            acceleration on the horizontal range, maximum height and time of flight of a
            projectile.
          </p>

          <h2 className="mt-6 text-base font-bold uppercase">Apparatus &amp; Materials</h2>
          <ul className="mt-1 list-disc pl-6">
            <li>Simulated spring-loaded cannon launcher</li>
            <li>Angle protractor scale (0° – 90°)</li>
            <li>Digital simulation environment with timer</li>
            <li>Gravitational field setting, g = {safeGravity.toFixed(1)} m/s²</li>
          </ul>

          <h2 className="mt-6 text-base font-bold uppercase">Methodology</h2>
          <ol className="mt-1 list-decimal space-y-1 pl-6">
            <li>The launch angle of the cannon was set to {angle}° using the protractor scale.</li>
            <li>The initial velocity of the projectile was set to {velocity.toFixed(1)} m/s.</li>
            <li>The projectile was released from a muzzle height of {origin.y.toFixed(2)} m above the ground.</li>
            <li>The gravitational acceleration was kept constant at {safeGravity.toFixed(1)} m/s² throughout the trial.</li>
            <li>The projectile was launched and its position was recorded at regular time intervals until it landed.</li>
            <li>The horizontal range, maximum height and total time of flight were recorded.</li>
          </ol>

          <h2 className="mt-6 text-base font-bold uppercase">Observations</h2>
          {landed ? (
            <>
              <p className="mt-1">
                On launch, a smoke and flare burst was observed at the muzzle. The projectile
                followed a curved path and a dust burst was observed at the point of impact.
              </p>
              <table className="mt-3 w-full border-collapse border border-slate-400 text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-400 px-2 py-1 text-left">Quantity</th>
                    <th className="border border-slate-400 px-2 py-1 text-left">Symbol</th>
                    <th className="border border-slate-400 px-2 py-1 text-left">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1">Launch angle</td>
                    <td className="border border-slate-400 px-2 py-1">θ</td>
                    <td className="border border-slate-400 px-2 py-1">{angle}°</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1">Initial velocity</td>
                    <td className="border border-slate-400 px-2 py-1">v₀</td>
                    <td className="border border-slate-400 px-2 py-1">{velocity.toFixed(1)} m/s</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1">Gravity</td>
                    <td className="border border-slate-400 px-2 py-1">g</td>
                    <td className="border border-slate-400 px-2 py-1">{safeGravity.toFixed(1)} m/s²</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1">Horizontal range</td>
                    <td className="border border-slate-400 px-2 py-1">R</td>
                    <td className="border border-slate-400 px-2 py-1">{range.toFixed(2)} m</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1">Maximum height</td>
                    <td className="border border-slate-400 px-2 py-1">H</td>
                    <td className="border border-slate-400 px-2 py-1">{maxHeight.toFixed(2)} m</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1">Time of flight</td>
                    <td className="border border-slate-400 px-2 py-1">T</td>
                    <td className="border border-slate-400 px-2 py-1">{flightTime.toFixed(2)} s</td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <p className="mt-1 italic text-slate-500">
              No trial has been launched yet. Run the simulation, then reopen this paper to
              record results.
            </p>
          )}

          <h2 className="mt-6 text-base font-bold uppercase">Calculations</h2>
          <div className="mt-2 space-y-4 overflow-x-auto text-[15px]">
            <MathJax>
              {`\\[
                T = \\frac{v_{0y}+\\sqrt{v_{0y}^{2}+2gy_0}}{g}
                = \\frac{${vy0.toFixed(2)}+\\sqrt{${vy0.toFixed(2)}^2+2(${safeGravity.toFixed(1)})(${origin.y.toFixed(2)})}}{${safeGravity.toFixed(1)}}
                = \\mathbf{${timeCalc.toFixed(2)}\\,s}
              \\]`}
            </MathJax>
            <MathJax>
              {`\\[
                R = v_{0x}T
                = ${vx0.toFixed(2)} \\times ${timeCalc.toFixed(2)}
                = \\mathbf{${rangeCalc.toFixed(2)}\\,m}
              \\]`}
            </MathJax>
            <MathJax>
              {`\\[
                H = y_0 + \\frac{v_{0y}^{2}}{2g}
                = ${origin.y.toFixed(2)} + \\frac{${vy0.toFixed(2)}^2}{2 \\times ${safeGravity.toFixed(1)}}
                = \\mathbf{${heightCalc.toFixed(2)}\\,m}
              \\]`}
            </MathJax>
          </div>

          <h2 className="mt-6 text-base font-bold uppercase">Sources of Error &amp; Precautions</h2>
          <ul className="mt-1 list-disc pl-6">
            <li>The calculations include the muzzle height above ground, matching the simulation rather than the simplified ground-level formula.</li>
            <li>Simulation time-step rounding introduces small numerical error into recorded readings.</li>
            <li>Playback speed was kept constant during a trial to avoid distorting the recorded time of flight.</li>
          </ul>

          <h2 className="mt-6 text-base font-bold uppercase">Conclusion</h2>
          <p className="mt-1">
            {landed
              ? `Launching at ${angle}° with an initial velocity of ${velocity.toFixed(1)} m/s under a gravitational acceleration of ${safeGravity.toFixed(1)} m/s² produced a horizontal range of ${range.toFixed(2)} m, a maximum height of ${maxHeight.toFixed(2)} m, and a time of flight of ${flightTime.toFixed(2)} s.`
              : "The aim will be addressed once a trial has been launched and recorded."}
          </p>
          </div>
      </MathJaxContext>
    </ExperimentPaperModal>
  );
}
// ---------------------------------------------------------------------------
// Main exported component: 3D canvas + Tailwind control overlay
// ---------------------------------------------------------------------------

interface ProjectileMotionSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const PROJECTILE_NARRATION = {
  intro: "/sounds/projectile-motion/intro.mp3",
  tinasheIntro: "/sounds/projectile-motion/tinashe_intro.mp3",
  complete: "/sounds/projectile-motion/experiment_complete.mp3",
  steps: [
    "/sounds/projectile-motion/step1_setup.mp3",
    "/sounds/projectile-motion/step2_set_angle.mp3",
    "/sounds/projectile-motion/step3_launch.mp3",
    "/sounds/projectile-motion/step4_results.mp3",
    "/sounds/projectile-motion/step5_best_angle.mp3",
  ],
} as const;

const PROJECTILE_EXPLANATIONS: readonly NarrationClip[] = [
  { label: "Introduction", src: PROJECTILE_NARRATION.intro },
  { label: "Step 1: The cannon and the grid", src: PROJECTILE_NARRATION.steps[0] },
  { label: "Step 2: Choose the angle", src: PROJECTILE_NARRATION.steps[1] },
  { label: "Step 3: Launch it", src: PROJECTILE_NARRATION.steps[2] },
  { label: "Step 4: Read the results", src: PROJECTILE_NARRATION.steps[3] },
  { label: "Step 5: The best angle", src: PROJECTILE_NARRATION.steps[4] },
];

export default function ProjectileMotionSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: ProjectileMotionSimProps) {
  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(12);
  const [gravity, setGravity] = useState(9.8);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fuseBurning, setFuseBurning] = useState(false);
  const [fuseProgress, setFuseProgress] = useState(0);
  const fuseStartedAtRef = useRef(0);
  const [resetKey, setResetKey] = useState(0);
  const [landingX, setLandingX] = useState<number | null>(null);
  const [landingScratches, setLandingScratches] = useState<LandingScratch[]>([]);
  const scratchSequenceRef = useRef(0);
  const [ceilingShattered, setCeilingShattered] = useState(false);
  const [ceilingImpactX, setCeilingImpactX] = useState<number | null>(null);
  const [liveHeight, setLiveHeight] = useState(0);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [liveRange, setLiveRange] = useState(0);
  const [liveTime, setLiveTime] = useState(0);
  const [mobileSheetMode, setMobileSheetMode] = useState<"expanded" | "collapsed" | "results">("expanded");
  const [showTutorial, setShowTutorial] = useState(true);
  const [shake, setShake] = useState<ShakeState>({ key: 0, intensity: 0 });
  const [smokeBurst, setSmokeBurst] = useState<BurstState>({
    key: 0,
    origin: launchOrigin({ angleDeg: angle }),
    direction: launchDirection({ angleDeg: angle }),
  });
  const [flareBurst, setFlareBurst] = useState<BurstState>({
    key: 0,
    origin: launchOrigin({ angleDeg: angle }),
    direction: launchDirection({ angleDeg: angle }),
  });
  const [dustBurst, setDustBurst] = useState<BurstState>({
    key: 0,
    origin: new THREE.Vector3(0, 0.05, 0),
  });
  const [ceilingBurst, setCeilingBurst] = useState<BurstState>({
    key: 0,
    origin: new THREE.Vector3(-1.25, PAVILION_CEILING_Y, 0),
  });

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);
  const dragStartYRef = useRef<number | null>(null);

  const audioRef = useRef<{
    launch: HTMLAudioElement;
    landed: HTMLAudioElement;
  } | null>(null);
  const landingStopTimeoutRef = useRef<number | null>(null);

  const clearLandingStopTimeout = useCallback(() => {
    if (landingStopTimeoutRef.current !== null) {
      window.clearTimeout(landingStopTimeoutRef.current);
      landingStopTimeoutRef.current = null;
    }
  }, []);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const launch = new Audio("/sounds/launch_sound.mp3");
      const landed = new Audio("/sounds/landed_sound.wav");
      launch.preload = "auto";
      landed.preload = "auto";
      launch.volume = 0.8;
      landed.volume = 0.9;
      audioRef.current = { launch, landed };
    }
    return audioRef.current;
  }, []);

  const params: LaunchParams = {
    angleDeg: angle,
    velocity,
    gravity: Math.max(MIN_GRAVITY, gravity),
  };

  const range = useMemo(() => {
    return horizontalRange(params);
  }, [angle, velocity, gravity]);

  const maxHeight = useMemo(() => {
    const theta = degToRad(angle);
    const vy0 = velocity * Math.sin(theta);
    return launchOrigin(params).y + (vy0 * vy0) / (2 * params.gravity);
  }, [angle, velocity, gravity]);

  const flightTime = useMemo(() => totalFlightTime(params), [angle, velocity, gravity]);

  /**
   * World positions the narration hand can point at. Refreshed on every render
   * and projected to the screen each frame by `NarrationSceneAnchors`, so the
   * hand tracks the muzzle as the barrel swings and the ball as it flies.
   */
  const sceneAnchorsRef = useRef<Record<string, THREE.Vector3>>({});
  const sceneAnchorPointsRef = useRef<SceneAnchorPoints>({});
  const muzzle = launchOrigin({ angleDeg: angle });
  sceneAnchorsRef.current = {
    cannon: new THREE.Vector3(CANNON_PIVOT.x, CANNON_PIVOT.y + 0.55, 0),
    muzzle,
    grid: new THREE.Vector3(muzzle.x + range * 0.5, 0.08, 0),
    apex: new THREE.Vector3(muzzle.x + range * 0.5, maxHeight, 0),
    landing: new THREE.Vector3(landingX ?? muzzle.x + range, 0.12, 0),
    // Ends for the ruler the narrator holds up over the range and the height.
    launchGround: new THREE.Vector3(muzzle.x, 0.12, 0),
    apexGround: new THREE.Vector3(muzzle.x + range * 0.5, 0.12, 0),
    ball: playing
      ? new THREE.Vector3(muzzle.x + liveRange, Math.max(0.12, liveHeight), 0)
      : new THREE.Vector3(landingX ?? muzzle.x + range, 0.12, 0),
  };

  const handleLaunch = useCallback(() => {
    setLandingX(null);
    setLiveRange(0);
    setLiveHeight(0);
    setLiveTime(0);
    setResetKey((k) => k + 1);
    setPlaying(true);
    setPaused(false);
    setMobileSheetMode("collapsed");
    setShake((current) => ({ key: current.key + 1, intensity: 0.08 }));
    const muzzle = launchOrigin(params);
    const muzzleDirection = launchDirection(params);
    setSmokeBurst((current) => ({
      key: current.key + 1,
      origin: muzzle,
      direction: muzzleDirection,
    }));
    setFlareBurst((current) => ({
      key: current.key + 1,
      origin: muzzle.clone().add(muzzleDirection.clone().multiplyScalar(0.12)),
      direction: muzzleDirection,
    }));

    const { launch, landed } = getAudio();
    clearLandingStopTimeout();
    launch.onended = null;
    stopAudio(landed);
    launch.currentTime = 0;
    safePlay(launch);
  }, [angle, velocity, gravity, range, flightTime, clearLandingStopTimeout, getAudio]);

  const handleLightFuse = useCallback(() => {
    if (playing || fuseBurning) return;
    fuseStartedAtRef.current = performance.now();
    setFuseProgress(0);
    setFuseBurning(true);
  }, [fuseBurning, playing]);

  useEffect(() => {
    if (!fuseBurning) return;
    let frame = 0;
    const advanceFuse = (now: number) => {
      const progress = THREE.MathUtils.clamp(
        (now - fuseStartedAtRef.current) / FUSE_BURN_DURATION_MS,
        0,
        1,
      );
      setFuseProgress(progress);
      if (progress >= 1) {
        setFuseBurning(false);
        handleLaunch();
        return;
      }
      frame = window.requestAnimationFrame(advanceFuse);
    };
    frame = window.requestAnimationFrame(advanceFuse);
    return () => window.cancelAnimationFrame(frame);
  }, [fuseBurning, handleLaunch]);

  const handleTogglePause = useCallback(() => {
    setPaused((p) => {
      const next = !p;
      const { launch } = getAudio();
      if (next) {
        launch.pause();
      }
      return next;
    });
  }, [getAudio]);

  const handleTick = useCallback((height: number, speed: number, distance: number, elapsedTime: number) => {
    setLiveHeight(height);
    setLiveSpeed(speed);
    setLiveRange(distance);
    setLiveTime(elapsedTime);
  }, []);

  const handleLanded = useCallback(() => {
    const landing = positionAt(totalFlightTime(params), params);
    scratchSequenceRef.current += 1;
    const scratchIndex = scratchSequenceRef.current;
    setPlaying(false);
    setPaused(false);
    setLandingX(landing.x);
    setLiveRange(range);
    setLiveHeight(0);
    setLiveTime(flightTime);
    setMobileSheetMode("results");
    setShake((current) => ({ key: current.key + 1, intensity: 0.13 }));
    setDustBurst((current) => ({
      key: current.key + 1,
      origin: new THREE.Vector3(landing.x, 0.08, 0),
    }));
    setLandingScratches((current) => [
      ...current,
      {
        id: scratchIndex,
        x: landing.x,
        z: ((scratchIndex % 5) - 2) * 0.075,
        rotation: ((scratchIndex * 47) % 34 - 17) * (Math.PI / 180),
        length: 0.72 + (scratchIndex % 4) * 0.12,
      },
    ]);

    const { launch, landed } = getAudio();
    clearLandingStopTimeout();
    launch.onended = null;
    stopAudio(launch);
    landed.currentTime = LANDING_SOUND_START_SECONDS;
    safePlay(landed);
    landingStopTimeoutRef.current = window.setTimeout(() => {
      stopAudio(landed);
      landingStopTimeoutRef.current = null;
    }, LANDING_SOUND_PLAY_MS);
  }, [angle, velocity, gravity, clearLandingStopTimeout, getAudio]);

  const handleCeilingHit = useCallback((impact: THREE.Vector3) => {
    if (ceilingShattered) return;
    setCeilingShattered(true);
    setCeilingImpactX(impact.x);
    setCeilingBurst((current) => ({
      key: current.key + 1,
      origin: impact.clone(),
    }));
    setShake((current) => ({ key: current.key + 1, intensity: 0.19 }));
  }, [ceilingShattered]);

  const invalidateCompletedTrial = useCallback(() => {
    if (playing) return;
    setFuseBurning(false);
    setFuseProgress(0);
    setLandingX(null);
    setLiveHeight(0);
    setLiveSpeed(0);
    setLiveRange(0);
    setLiveTime(0);
    setResetKey((key) => key + 1);
    setMobileSheetMode("expanded");
    clearLandingStopTimeout();
    if (audioRef.current) {
      stopAudio(audioRef.current.launch);
      stopAudio(audioRef.current.landed);
    }
  }, [clearLandingStopTimeout, playing]);

  const handleAngleChange = useCallback((nextAngle: number) => {
    if (playing) return;
    setAngle(nextAngle);
    invalidateCompletedTrial();
  }, [invalidateCompletedTrial, playing]);

  const handleVelocityChange = useCallback((nextVelocity: number) => {
    if (playing) return;
    setVelocity(nextVelocity);
    invalidateCompletedTrial();
  }, [invalidateCompletedTrial, playing]);

  const handleGravityChange = useCallback((nextGravity: number) => {
    if (playing) return;
    setGravity(Math.max(MIN_GRAVITY, nextGravity));
    invalidateCompletedTrial();
  }, [invalidateCompletedTrial, playing]);

  const handleReset = useCallback(() => {
    setPlaying(false);
    setPaused(false);
    setFuseBurning(false);
    setFuseProgress(0);
    setLandingX(null);
    setLiveHeight(0);
    setLiveSpeed(0);
    setLiveRange(0);
    setLiveTime(0);
    setResetKey((k) => k + 1);
    setMobileSheetMode("expanded");

    const { launch, landed } = getAudio();
    clearLandingStopTimeout();
    launch.onended = null;
    stopAudio(launch);
    stopAudio(landed);
  }, [clearLandingStopTimeout, getAudio]);

  const handleResetAll = useCallback(() => {
    setAngle(45);
    setVelocity(12);
    setGravity(9.8);
    setSpeedMultiplier(1);
    handleReset();
  }, [handleReset]);

  const applyGravityPreset = handleGravityChange;

  // --- Doing Mode: free-roam + walk-up interactions --------------------
  const [mode, setMode] = useState<"learning" | "doing">("learning");

  const narrator = useExperimentNarrator();
  const [guideActive, setGuideActive] = useState(false);
  const narrationPlayback = useNarrationPlayback(narrator, PROJECTILE_NARRATION_TRACKS);
  // Actions the walkthrough stages inside a step run on the narrator's own
  // clock, so they land on the words that describe them and stop when it does.
  const cueRunner = useNarrationCueRunner(narrator);
  const clearDemoTimers = cueRunner.clear;

  /*
   * Step budgets and the timing of every action inside a step are read out of
   * the caption tracks, which were measured from the recordings themselves
   * (see `scripts/generate_narration_captions.mjs`). So the barrel drops to
   * thirty degrees on the words "at thirty degrees", not a guessed two seconds
   * in, and re-recording a clip re-times the scene with it.
   */
  const track = (src: string) => PROJECTILE_NARRATION_TRACKS[src];
  const stepDuration = (index: number, fallbackMs: number) =>
    trackDurationMs(track(PROJECTILE_NARRATION.steps[index]), fallbackMs);
  const stepCue = (index: number, phrase: string, fallbackMs: number) =>
    cueTimeMs(track(PROJECTILE_NARRATION.steps[index]), phrase, fallbackMs);

  const walkthroughSteps: WalkthroughStep[] = [
    {
      label: "The cannon and the grid",
      src: PROJECTILE_NARRATION.steps[0],
      durationMs: stepDuration(0, 24400),
      onEnter: () => {
        clearDemoTimers();
        setAngle(45);
        setVelocity(12);
        setGravity(9.8);
        setSpeedMultiplier(1);
        handleReset();
      },
    },
    {
      label: "Choose the angle",
      src: PROJECTILE_NARRATION.steps[1],
      durationMs: stepDuration(1, 27600),
      onEnter: () => {
        cueRunner.schedule([
          { atMs: stepCue(1, "at thirty degrees", 9100), run: () => setAngle(30) },
          { atMs: stepCue(1, "at sixty degrees", 15900), run: () => setAngle(60) },
          { atMs: stepCue(1, "put it back", 24200), run: () => setAngle(45) },
        ]);
      },
    },
    {
      label: "Launch it",
      src: PROJECTILE_NARRATION.steps[2],
      durationMs: stepDuration(2, 27500),
      onEnter: () => {
        // At full speed the ball is down in under two seconds, well before the
        // narrator finishes describing the arc. A third of speed stretches the
        // flight across "it goes up, it curves over at the top, and it comes
        // down", which is the whole point of the step.
        setSpeedMultiplier(0.35);
        cueRunner.schedule([{ atMs: stepCue(2, "watch the shape", 3500), run: () => handleLaunch() }]);
      },
    },
    {
      label: "Read the results",
      src: PROJECTILE_NARRATION.steps[3],
      durationMs: stepDuration(3, 27200),
      onEnter: () => {
        setSpeedMultiplier(1);
      },
    },
    {
      label: "The best angle",
      src: PROJECTILE_NARRATION.steps[4],
      durationMs: stepDuration(4, 36800),
      onEnter: () => {
        cueRunner.schedule([
          {
            atMs: stepCue(4, "first, thirty degrees", 6200),
            run: () => {
              setAngle(30);
              handleLaunch();
            },
          },
          {
            atMs: stepCue(4, "next, forty five degrees", 10900),
            run: () => {
              setAngle(45);
              handleLaunch();
            },
          },
          {
            atMs: stepCue(4, "now sixty degrees", 17200),
            run: () => {
              setAngle(60);
              handleLaunch();
            },
          },
        ]);
      },
    },
  ];

  const walkthrough = useNarratedWalkthrough({
    narrator,
    intro: PROJECTILE_NARRATION.intro,
    complete: PROJECTILE_NARRATION.complete,
    steps: walkthroughSteps,
    onStart: () => {
      clearDemoTimers();
      setGuideActive(false);
      setMode("learning");
      setShowTutorial(false);
    },
    onStop: () => {
      clearDemoTimers();
      handleResetAll();
    },
    onComplete: () => {
      clearDemoTimers();
      onRequestPaper?.();
    },
  });

  const toggleGuide = useCallback(() => {
    if (walkthrough.active) return;
    if (guideActive) {
      setGuideActive(false);
      narrator.stop();
      return;
    }
    setGuideActive(true);
    setMode("doing");
    narrator.play(PROJECTILE_NARRATION.tinasheIntro);
  }, [guideActive, narrator.play, narrator.stop, walkthrough.active]);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [activeInteractableMeta, setActiveInteractableMeta] = useState<{ id: string; label: string; hold: boolean } | null>(null);
  const activeInteractableRef = useRef<Interactable | null>(null);
  const moveVectorRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mode === "doing" || !fuseBurning) return;
    setFuseBurning(false);
    setFuseProgress(0);
  }, [fuseBurning, mode]);

  useEffect(() => {
    const widthQuery = window.matchMedia(
      "(max-width: 639px), (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse)"
    );
    const updateWidth = () => setIsMobileViewport(widthQuery.matches);
    updateWidth();
    widthQuery.addEventListener("change", updateWidth);
    return () => widthQuery.removeEventListener("change", updateWidth);
  }, []);

  useEffect(() => {
    const orientationQuery = window.matchMedia("(orientation: portrait)");
    const updateOrientation = () => setIsPortrait(orientationQuery.matches);
    updateOrientation();
    orientationQuery.addEventListener("change", updateOrientation);
    return () => orientationQuery.removeEventListener("change", updateOrientation);
  }, []);

  const handleTargetChange = useCallback((target: Interactable | null) => {
    activeInteractableRef.current = target;
    setActiveInteractableMeta((prev) => {
      if (!target) return prev === null ? prev : null;
      if (prev && prev.id === target.id) return prev;
      return { id: target.id, label: target.label, hold: !!target.hold };
    });
  }, []);

  const handleJoystickChange = useCallback((vector: { x: number; y: number }) => {
    moveVectorRef.current = vector;
  }, []);

  const handleInteractionPress = useCallback(() => {
    activeInteractableRef.current?.onActivate();
  }, []);

  const handleInteractionRelease = useCallback(() => {
    activeInteractableRef.current?.onRelease?.();
  }, []);

  useEffect(() => {
    if (mode !== "doing" || isMobileViewport) return;
    const down = (e: KeyboardEvent) => {
      if (e.code !== "KeyE" && e.code !== "Space") return;
      activeInteractableRef.current?.onActivate();
    };
    const up = (e: KeyboardEvent) => {
      if (e.code !== "KeyE" && e.code !== "Space") return;
      activeInteractableRef.current?.onRelease?.();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [mode, isMobileViewport]);

  useEffect(() => {
    if (mode !== "doing") {
      activeInteractableRef.current = null;
      setActiveInteractableMeta(null);
      moveVectorRef.current = { x: 0, y: 0 };
    }
  }, [mode]);

  const ANGLE_CYCLE_DEG = [15, 30, 45, 60, 75];
  const VELOCITY_CYCLE = [8, 12, 16, 20, 25, 30];
  const SPEED_CYCLE = [0.5, 1, 1.5, 2];

  // Doing Mode's world-space stations: the exact same handlers/state setters
  // the guided controls already call, just reached by walking up and
  // pressing/holding instead of tapping a panel — no second source of truth.
  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const list: Interactable[] = [];

    list.push({
      id: "light-fuse",
      position: FUSE_END_POS,
      radius: INTERACTION_RADIUS,
      label: playing ? "In flight…" : fuseBurning ? `Fuse burning… ${Math.round(fuseProgress * 100)}%` : "Light cannon fuse",
      disabled: playing || fuseBurning,
      onActivate: handleLightFuse,
    });

    list.push({
      id: "reset",
      position: LAUNCH_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: "Reset",
      onActivate: handleReset,
    });

    const nextAngle = cycleNumericPreset(angle, ANGLE_CYCLE_DEG);
    list.push({
      id: "angle-cycle",
      position: ANGLE_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle angle (next: ${nextAngle}°)`,
      disabled: playing || fuseBurning,
      onActivate: () => handleAngleChange(nextAngle),
    });

    const nextVelocity = cycleNumericPreset(velocity, VELOCITY_CYCLE);
    list.push({
      id: "power-cycle",
      position: POWER_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle power (next: ${nextVelocity} m/s)`,
      disabled: playing || fuseBurning,
      onActivate: () => handleVelocityChange(nextVelocity),
    });

    const nextGravity = cycleGravityPreset(gravity);
    const nextGravityLabel = GRAVITY_PRESETS.find((p) => Math.abs(p.value - nextGravity) < 0.05)?.label ?? "Earth";
    list.push({
      id: "gravity-cycle",
      position: GRAVITY_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle gravity (next: ${nextGravityLabel})`,
      disabled: playing || fuseBurning,
      onActivate: () => applyGravityPreset(nextGravity),
    });

    const nextSpeed = cycleNumericPreset(speedMultiplier, SPEED_CYCLE);
    list.push({
      id: "speed-cycle",
      position: SPEED_STATION_POS,
      radius: INTERACTION_RADIUS,
      label: `Cycle playback speed (next: ${nextSpeed}x)`,
      disabled: fuseBurning,
      onActivate: () => setSpeedMultiplier(nextSpeed),
    });

    return list;
  }, [mode, playing, fuseBurning, fuseProgress, angle, velocity, gravity, speedMultiplier, handleLightFuse, handleReset, handleAngleChange, handleVelocityChange, applyGravityPreset]);

  const handleSheetPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSheetPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartYRef.current === null) return;
    const deltaY = event.clientY - dragStartYRef.current;
    dragStartYRef.current = null;

    if (deltaY < -24) {
      setMobileSheetMode("expanded");
    } else if (deltaY > 24) {
      setMobileSheetMode("collapsed");
    } else if (mobileSheetMode === "collapsed" || mobileSheetMode === "results") {
      setMobileSheetMode("expanded");
    } else {
      setMobileSheetMode("collapsed");
    }
  };

  const mobileSheetTransform = {
    expanded: "translate-y-0",
    collapsed: "translate-y-[calc(100%-76px)]",
    results: "translate-y-[calc(100%-156px)]",
  }[mobileSheetMode];

  const gravityPresets = [
    { label: "Earth", value: 9.8 },
    { label: "Moon", value: 1.6 },
    { label: "Mars", value: 3.7 },
  ];
  const displayedRange = playing ? liveRange : range;
  const displayedHeight = playing ? liveHeight : maxHeight;
  const displayedTime = playing ? liveTime : flightTime;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-slate-950 sm:flex-row">
      <style>{`
        @keyframes futuristicSliderSweep {
          0% { background-position: 0% 50%; filter: brightness(1); }
          50% { background-position: 100% 50%; filter: brightness(1.18); }
          100% { background-position: 0% 50%; filter: brightness(1); }
        }
        @keyframes digitalTick {
          0% { transform: translateY(-1px) scaleY(0.92); filter: brightness(1.5); }
          55% { transform: translateY(1px) scaleY(1.05); filter: brightness(1.25); }
          100% { transform: translateY(0) scaleY(1); filter: brightness(1); }
        }
        .futuristic-fill {
          background-size: 220% 100%;
          animation: futuristicSliderSweep 2.2s ease-in-out infinite;
        }
        .digital-screen {
          box-shadow: inset 0 0 18px rgba(255, 0, 48, 0.16), 0 0 12px rgba(255, 0, 48, 0.12);
        }
        .digital-value,
        .digital-unit {
          font-family: "Courier New", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.04em;
          text-shadow: 0 0 8px rgba(239, 68, 68, 0.95), 0 0 18px rgba(239, 68, 68, 0.45);
        }
        .futuristic-range::-webkit-slider-runnable-track {
          height: 32px;
          background: transparent;
        }
        .futuristic-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          margin-top: 5px;
          border-radius: 9999px;
          border: 3px solid rgb(15 23 42);
          background: radial-gradient(circle at 35% 35%, #ffffff, #fbbf24 38%, #f97316 72%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.35), 0 0 18px rgba(251,146,60,0.9), 0 0 34px rgba(45,212,191,0.35);
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .futuristic-range:hover::-webkit-slider-thumb {
          transform: scale(1.14);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.6), 0 0 24px rgba(251,146,60,1), 0 0 42px rgba(45,212,191,0.55);
        }
        .futuristic-range::-moz-range-track {
          height: 32px;
          background: transparent;
        }
        .futuristic-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          border: 3px solid rgb(15 23 42);
          background: #f97316;
          box-shadow: 0 0 18px rgba(251,146,60,0.9), 0 0 34px rgba(45,212,191,0.35);
        }
      `}</style>
      <div data-experiment-tour="projectile-scene" className="relative min-h-0 flex-1">
        <Canvas
          dpr={[1, 1.6]}
          shadows={{ type: THREE.PCFSoftShadowMap }}
          camera={{ position: [18, 4.5, 26], fov: 50, near: 0.05, far: 10000 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.05;
          }}
          className="h-full w-full"
        >
          <Scene
            params={params}
            playing={playing}
            paused={paused}
            resetKey={resetKey}
            onLanded={handleLanded}
            onCeilingHit={handleCeilingHit}
            landingX={landingX}
            landingScratches={landingScratches}
            ceilingShattered={ceilingShattered}
            ceilingImpactX={ceilingImpactX}
            ceilingBurst={ceilingBurst}
            fuseBurning={fuseBurning}
            fuseProgress={fuseProgress}
            speedMultiplier={speedMultiplier}
            onTick={handleTick}
            shake={shake}
            smokeBurst={smokeBurst}
            flareBurst={flareBurst}
            dustBurst={dustBurst}
            liveRange={liveRange}
            liveHeight={liveHeight}
            mode={mode}
            isMobile={isMobileViewport}
            interactables={interactables}
            activeTargetId={activeInteractableMeta?.id ?? null}
            moveVectorRef={moveVectorRef}
            onTargetChange={handleTargetChange}
          />
          <NarrationSceneAnchors anchorsRef={sceneAnchorsRef} pointsRef={sceneAnchorPointsRef} />
        </Canvas>

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={setMode}
          contextLabel="Projectile Motion"
        />

        <ExperimentNarrationDock
          narrator={narrator}
          clips={PROJECTILE_EXPLANATIONS}
          walkthrough={walkthrough}
          guideActive={guideActive}
          onToggleGuide={toggleGuide}
          showMeLabel="Watch the narrated cannon experiment run by itself"
          menuLabel="Projectile motion explanations"
        />
        <WalkthroughStatusPill walkthrough={walkthrough} />

        <HeaderModeToggle mode={mode} onChange={setMode} />

        {mode === "doing" && fuseBurning && (
          <div className="pointer-events-none absolute left-1/2 top-16 z-20 w-[min(78vw,320px)] -translate-x-1/2 rounded-2xl border border-orange-300/35 bg-slate-950/88 px-3 py-2 text-center shadow-[0_12px_34px_rgba(0,0,0,.5),0_0_24px_rgba(249,115,22,.22)] backdrop-blur-xl sm:top-3">
            <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-orange-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400 shadow-[0_0_10px_#fb923c]" />
              Fuse lit · spark travelling to cannon
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 shadow-[0_0_12px_rgba(251,146,60,.8)]"
                style={{ width: `${Math.round(fuseProgress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {mode === "doing" && (
          <>
            {!isMobileViewport && (
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
                {activeInteractableMeta && (
                  <div className="absolute top-[58%] rounded-full border border-white/20 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur">
                    Press <span className="text-orange-300">E</span> to {activeInteractableMeta.label.toLowerCase()}
                  </div>
                )}
                <div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
                  WASD/arrows to move · mouse to look · click to lock cursor
                </div>
              </div>
            )}

            {isMobileViewport && (
              <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex items-end justify-between px-4">
                <VirtualJoystick onChange={handleJoystickChange} />
                <div className="pointer-events-auto flex flex-col items-center gap-1">
                  {activeInteractableMeta && (
                    <button
                      type="button"
                      onPointerDown={handleInteractionPress}
                      onPointerUp={handleInteractionRelease}
                      onPointerLeave={handleInteractionRelease}
                      onPointerCancel={handleInteractionRelease}
                      className="flex h-20 w-20 select-none flex-col items-center justify-center rounded-full border-2 border-white/50 bg-gradient-to-b from-orange-300 via-orange-500 to-orange-700 text-center text-white shadow-[0_10px_26px_rgba(0,0,0,0.45)] active:translate-y-0.5"
                    >
                      <span className="text-xl leading-none">{activeInteractableMeta.hold ? "✊" : "👆"}</span>
                      <span className="mt-1 max-w-[70px] truncate text-[9px] font-black uppercase leading-tight">{activeInteractableMeta.label}</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {isMobileViewport && isPortrait && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-slate-950/95 px-6 text-center text-white">
                <div className="text-4xl">📱↻</div>
                <div className="text-sm font-black uppercase tracking-wide">Rotate your device</div>
                <p className="max-w-xs text-xs text-slate-300">Doing Mode plays best in landscape so you have room for the joystick and action button.</p>
              </div>
            )}
          </>
        )}

        <div data-experiment-tour="projectile-hud" className="absolute inset-x-2 top-14 z-10 grid grid-cols-3 gap-1.5 sm:hidden">
          <DigitalReadout value={displayedRange.toFixed(2)} unit="m" label="Range" tone="red" compact />
          <DigitalReadout value={displayedHeight.toFixed(2)} unit="m" label="Height" tone="green" compact />
          <DigitalReadout value={displayedTime.toFixed(2)} unit="s" label="Time" tone="cyan" compact />
        </div>

        {/* Large captions along the bottom, and a hand on whatever is being described. */}
        <NarrationCaptionBar
          playback={narrationPlayback}
          className={`pointer-events-none absolute inset-x-0 z-40 flex justify-center px-2 sm:px-4 sm:pb-4 ${
            // Doing Mode puts the joystick and the action button along the
            // bottom on phones, so lift the captions clear of them.
            mode === "doing" ? "bottom-28 sm:bottom-0" : "bottom-0 pb-2"
          }`}
        />
        <NarrationMeasureOverlay playback={narrationPlayback} sceneAnchorsRef={sceneAnchorPointsRef} />
        <NarrationPointerHand playback={narrationPlayback} sceneAnchorsRef={sceneAnchorPointsRef} />
      </div>

      {/* Controls: compact mobile game dock, fixed right section on desktop */}
      <div
        data-experiment-tour="projectile-controls"
        className={`experiment-desktop-panel experiment-violet-panel overflow-hidden bg-slate-950/92 text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/12 backdrop-blur-2xl sm:static sm:z-auto sm:h-full sm:w-[30%] sm:min-w-[320px] sm:max-w-[420px] sm:rounded-none sm:border-l sm:border-white/10 sm:shadow-none sm:ring-0 ${
          mode === "doing" ? "hidden" : "hidden sm:block"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-orange-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />
        <div
          onPointerDown={handleSheetPointerDown}
          onPointerUp={handleSheetPointerUp}
          className="relative sm:hidden touch-none select-none px-5 pt-3 pb-4"
        >
          <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-300/80 shadow-[0_0_18px_rgba(255,255,255,0.2)]" />
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-base font-black tracking-tight">
                {mobileSheetMode === "collapsed" ? "Controls" : "Projectile Motion"}
              </div>
              <div className="text-xs text-slate-400">
                {mobileSheetMode === "expanded" ? "Swipe down to watch" : "Swipe up to edit"}
              </div>
            </div>
            {mobileSheetMode === "collapsed" ? (
              <button
                data-experiment-tour="projectile-launch"
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                onClick={handleLaunch}
                disabled={playing}
                className="shrink-0 rounded-xl bg-orange-500 px-4 py-2 text-sm font-black text-white shadow-lg shadow-orange-950/35 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 disabled:translate-y-0 disabled:bg-slate-700 disabled:text-slate-400"
              >
                {playing ? "In flight" : landingX !== null ? "Launch Again" : "Launch"}
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <div className="font-black text-orange-200">{range.toFixed(1)} m</div>
                  <div className="text-slate-400">Range</div>
                </div>
                <div>
                  <div className="font-black text-orange-200">{maxHeight.toFixed(1)} m</div>
                  <div className="text-slate-400">Height</div>
                </div>
                <div>
                  <div className="font-black text-orange-200">{flightTime.toFixed(1)} s</div>
                  <div className="text-slate-400">Time</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative max-h-[72vh] space-y-4 overflow-y-auto p-5 pt-0 sm:flex sm:h-full sm:max-h-none sm:flex-col sm:gap-3 sm:space-y-0 sm:overflow-visible sm:p-4">
        <div className="hidden sm:flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-tight">Controls</h2>
            <p className="text-xs font-medium text-slate-400">Angle, velocity, gravity</p>
          </div>
          <button
            onClick={handleResetAll}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300/40 hover:bg-orange-400/10 hover:text-orange-100"
          >
            Reset all
          </button>
        </div>

        <div className="sm:hidden flex items-center justify-end">
          <button
            onClick={handleResetAll}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold text-slate-200 transition-all duration-300 hover:bg-orange-400/10 hover:text-orange-100"
          >
            Reset all
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {gravityPresets.map((preset) => {
            const active = Math.abs(gravity - preset.value) < 0.05;
            return (
              <button
                key={preset.label}
                onClick={() => applyGravityPreset(preset.value)}
                disabled={playing}
                className={`rounded-xl px-2 py-2 text-sm font-bold transition-all duration-300 disabled:opacity-60 ${
                  active
                    ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30"
                    : "bg-white/6 text-slate-200 ring-1 ring-white/10 hover:-translate-y-0.5 hover:bg-white/10 hover:ring-white/20"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
          <button
            disabled
            className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-slate-500 ring-1 ring-white/10"
          >
            Custom
          </button>
        </div>

        <div className="grid gap-3">
          <FuturisticSlider
            id="angle"
            label="Launch angle (θ)"
            value={angle}
            displayValue={`${angle}°`}
            min={0}
            max={90}
            step={1}
            disabled={playing}
            onChange={handleAngleChange}
          />
          <FuturisticSlider
            id="velocity"
            label="Initial velocity (v₀)"
            value={velocity}
            displayValue={`${velocity} m/s`}
            min={1}
            max={50}
            step={0.5}
            disabled={playing}
            onChange={handleVelocityChange}
          />
          <FuturisticSlider
            id="gravity"
            label="Gravity (g)"
            value={gravity}
            displayValue={`${gravity.toFixed(1)} m/s²`}
            min={MIN_GRAVITY}
            max={20}
            step={0.1}
            disabled={playing}
            onChange={handleGravityChange}
          />
          <FuturisticSlider
            id="speed"
            label="Playback speed"
            value={speedMultiplier}
            displayValue={`${speedMultiplier.toFixed(1)}x`}
            min={0.1}
            max={2}
            step={0.1}
            disabled={playing}
            onChange={setSpeedMultiplier}
          />
        </div>

        <div className="flex gap-2">
          <button
            data-experiment-tour="projectile-launch"
            onClick={handleLaunch}
            disabled={playing}
            className="flex-1 rounded-2xl bg-orange-500 py-3 font-black text-white shadow-lg shadow-orange-950/35 transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-400 disabled:translate-y-0 disabled:bg-slate-700 disabled:text-slate-400"
          >
            {playing ? (paused ? "Paused" : "Launch") : landingX !== null ? "Launch Again" : "Launch"}
          </button>
          <button
            onClick={playing ? handleTogglePause : handleReset}
            className="flex-1 rounded-2xl bg-white/8 py-3 font-black text-slate-100 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/12 hover:ring-white/20 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {playing ? (paused ? "Resume" : "Pause") : "Reset"}
          </button>
        </div>

        <div data-experiment-tour="projectile-hud" className="grid min-w-0 grid-cols-3 gap-1.5 sm:mt-auto">
          <DigitalReadout value={displayedRange.toFixed(2)} unit="m" label="Range" />
          <DigitalReadout value={displayedHeight.toFixed(2)} unit="m" label="Height" />
          <DigitalReadout value={displayedTime.toFixed(2)} unit="s" label="Time" />
        </div>
        </div>
      </div>

      {mode === "learning" && (
      <MobileExperimentControls
        actions={[
          {
            id: "launch",
            label: playing ? (paused ? "Paused" : "Flight") : landingX !== null ? "Again" : "Launch",
            onClick: handleLaunch,
            disabled: playing,
            tone: "orange",
          },
          {
            id: "pause-reset",
            label: playing ? (paused ? "Resume" : "Pause") : "Reset",
            onClick: playing ? handleTogglePause : handleReset,
            tone: playing ? "green" : "dark",
          },
          {
            id: "reset-all",
            label: "Reset All",
            onClick: handleResetAll,
            tone: "red",
          },
        ]}
        panels={[
          {
            id: "angle",
            label: "Angle",
            value: `${angle}°`,
            disabled: playing,
            content: (
              <FuturisticSlider
                id="mobile-angle"
                label="Launch angle (θ)"
                value={angle}
                displayValue={`${angle}°`}
                min={0}
                max={90}
                step={1}
                disabled={playing}
                onChange={handleAngleChange}
              />
            ),
          },
          {
            id: "velocity",
            label: "Power",
            value: `${velocity} m/s`,
            disabled: playing,
            content: (
              <FuturisticSlider
                id="mobile-velocity"
                label="Initial velocity (v₀)"
                value={velocity}
                displayValue={`${velocity} m/s`}
                min={1}
                max={50}
                step={0.5}
                disabled={playing}
                onChange={handleVelocityChange}
              />
            ),
          },
          {
            id: "gravity",
            label: "Gravity",
            value: `${gravity.toFixed(1)} m/s²`,
            disabled: playing,
            content: (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {gravityPresets.map((preset) => {
                    const active = Math.abs(gravity - preset.value) < 0.05;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => applyGravityPreset(preset.value)}
                        disabled={playing}
                        className={`rounded-xl px-2 py-2 text-sm font-bold transition-all duration-300 disabled:opacity-60 ${
                          active
                            ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/30"
                            : "bg-white/6 text-slate-200 ring-1 ring-white/10"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <FuturisticSlider
                  id="mobile-gravity"
                  label="Gravity (g)"
                  value={gravity}
                  displayValue={`${gravity.toFixed(1)} m/s²`}
                  min={MIN_GRAVITY}
                  max={20}
                  step={0.1}
                  disabled={playing}
                  onChange={handleGravityChange}
                />
              </>
            ),
          },
          {
            id: "speed",
            label: "Speed",
            value: `${speedMultiplier.toFixed(1)}x`,
            disabled: playing,
            content: (
              <FuturisticSlider
                id="mobile-speed"
                label="Playback speed"
                value={speedMultiplier}
                displayValue={`${speedMultiplier.toFixed(1)}x`}
                min={0.1}
                max={2}
                step={0.1}
                disabled={playing}
                onChange={setSpeedMultiplier}
              />
            ),
          },
        ]}
      />
      )}

      {showPaper && (
        <ExperimentPaper
          angle={angle}
          velocity={velocity}
          gravity={params.gravity}
          range={range}
          maxHeight={maxHeight}
          flightTime={flightTime}
          landed={landingX !== null}
          onClose={onClosePaper}
        />
      )}
      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={tutorialMode === "howto" ? projectileHowToSteps : projectileTutorialSteps}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
