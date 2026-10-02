"use client";

import { RoundedBox } from "@react-three/drei";
import "./oxygenFromPondweed.css";
import "./respiration.css";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import {
  ExperimentTutorialOverlay,
  type ExperimentTutorialStep,
} from "../../common/ExperimentTutorialOverlay";
import { ExperimentTopBar } from "../../common/ExperimentGameChrome";
import { ExperimentHeaderPortal } from "../../common/ExperimentHeaderSlots";
import { MobileExperimentTopBar } from "../../common/MobileExperimentTopBar";
import {
  MobileGtaNavigation,
  useMobileExperimentViewport,
} from "../../common/MobileGtaNavigation";
import { PlayerController, type PlayerBounds } from "../../common/PlayerController";
import {
  resolveActiveInteractable,
  type Interactable,
} from "../../common/InteractionSystem";


const RESPIRATION_STEPS = [
  "Place seeds in the flask",
  "Seal the apparatus",
  "Observe the limewater",
] as const;

const TABLE_HEIGHT_SCALE = 4;
const APPARATUS_Y = 1.14 + 1.12 * (TABLE_HEIGHT_SCALE - 1);

const RESPIRATION_DURATIONS = [2200, 2400, 6500] as const;

const RESPIRATION_PLAYER_BOUNDS: PlayerBounds = {
  minX: -14.4,
  maxX: 14.4,
  minZ: -10.45,
  maxZ: 10.45,
};
const RESPIRATION_PLAYER_SPAWN = new THREE.Vector3(7.2, 0, 9.1);
const RESPIRATION_PLAYER_INITIAL_YAW = Math.atan2(
  RESPIRATION_PLAYER_SPAWN.x,
  RESPIRATION_PLAYER_SPAWN.z,
);
const RESPIRATION_PLAYER_INITIAL_PITCH = -0.12;
const RESPIRATION_INTERACTION_RADIUS = 3.8;
const RESPIRATION_STATION_POSITIONS = [
  new THREE.Vector3(-2.15, APPARATUS_Y + 0.9, 0.05),
  new THREE.Vector3(0, APPARATUS_Y + 1.2, 0.05),
  new THREE.Vector3(2.25, APPARATUS_Y + 0.9, 0.05),
] as const;
const RESPIRATION_PLAYER_OBSTACLES: PlayerBounds[] = [
  { minX: -4.6, maxX: 4.6, minZ: -1.85, maxZ: 1.85 },
  { minX: -9.8, maxX: -7.1, minZ: -5.7, maxZ: -3.15 }];

const respirationTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Respiration Produces Carbon Dioxide",
    text: "Germinating seeds are living. This airtight apparatus carries the gas they release into fresh limewater.",
    mode: "modal",
  },
  {
    title: "Choose a Fair Control",
    text: "Use germinating seeds for the test, then compare them with boiled seeds. Boiled seeds are not living and should not release carbon dioxide.",
    mode: "bubble",
    selector: '[data-experiment-tour="respiration-sample"]',
  },
  {
    title: "Complete the Apparatus",
    text: "Place the seeds, fit the airtight stopper and delivery tube, then allow the gas to bubble through the limewater.",
    mode: "bubble",
    selector:
      '[data-experiment-tour="respiration-method"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Read the Evidence",
    text: "Milky limewater is a positive test for carbon dioxide. Clear limewater is the expected boiled-seed control result.",
    mode: "bubble",
    selector: '[data-experiment-tour="respiration-result"]',
  },
];

const respirationHowToSteps: ExperimentTutorialStep[] = [
  {
    title: "How To: Respiration",
    text: "Choose the seed sample, enter Doing mode, then complete the apparatus by walking to each highlighted station.",
    mode: "modal",
  },
  {
    title: "1. Choose the Seed Sample",
    text: "Start with Germinating. You can repeat later with the Boiled control while keeping mass, temperature, time and limewater volume unchanged.",
    mode: "bubble",
    selector: '[data-experiment-tour="respiration-sample"]',
  },
  {
    title: "2. Enter Doing Mode",
    text: "Select Doing. The instruction panel closes and the lab becomes walkable.",
    mode: "bubble",
    selector:
      '[data-experiment-tour="respiration-mode-toggle"], .experiment-mobile-topbar',
  },
  {
    title: "3. Walk and Look",
    text: "Use WASD or the mobile joystick to move. Aim at the highlighted apparatus until the Press E or Use prompt appears.",
    mode: "modal",
  },
  {
    title: "4. Complete Three Stations",
    text: "Load the seed flask, seal the stopper and delivery tube, then move to the limewater station to observe the gas test.",
    mode: "modal",
  },
  {
    title: "5. Read the Result",
    text: "Germinating seeds turn limewater milky because they release carbon dioxide during respiration. The boiled control remains clear.",
    mode: "bubble",
    selector: '[data-experiment-tour="respiration-result"]',
  },
  {
    title: "6. Open Paper",
    text: "Open Paper to review the method, variables, observation and conclusion from the sample you tested.",
    mode: "bubble",
    selector: '[data-experiment-tour="paper"]',
  },
];

interface RespirationSimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

function RespirationCamera() {
  const { camera, size } = useThree();
  const mobile = size.width < 640;

  useEffect(() => {
    camera.position.set(
      mobile ? 6.8 : 8.2,
      APPARATUS_Y + (mobile ? 3.3 : 4.1),
      mobile ? 9.4 : 10.8,
    );
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = mobile ? 56 : 50;
    }
    camera.near = 0.08;
    camera.far = 110;
    camera.lookAt(0, APPARATUS_Y + 1.1, 0);
    camera.updateProjectionMatrix();
  }, [camera, mobile]);

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      target={[0, APPARATUS_Y + 1.1, 0]}
      minDistance={5.6}
      maxDistance={14}
      maxPolarAngle={1.5}
      enableDamping
      dampingFactor={0.075}
    />
  );
}

function RespirationCeilingLight({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3.1, 0.14, 0.68]} />
        <meshStandardMaterial
          color="#d9e2df"
          metalness={0.32}
          roughness={0.36}
        />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[2.78, 0.035, 0.48]} />
        <meshStandardMaterial
          color="#f8fffb"
          emissive="#effff8"
          emissiveIntensity={1.75}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, -0.5, 0]}
        color="#f5fff8"
        intensity={90}
        distance={35}
        decay={2}
      />
    </group>
  );
}

function RespirationLabTable({
  position,
  size,
  topColor = "#283c55",
}: {
  position: [number, number, number];
  size: [number, number];
  topColor?: string;
}) {
  return <group position={position} scale={[1, TABLE_HEIGHT_SCALE, 1]}>
    <RoundedBox args={[size[0], 0.16, size[1]]} radius={0.06} smoothness={4} position={[0, 1.04, 0]} castShadow receiveShadow><meshStandardMaterial color={topColor} roughness={0.32} /></RoundedBox>
    <RoundedBox args={[size[0] - 0.3, 0.8, size[1] - 0.3]} radius={0.035} position={[0, 0.5, 0]} castShadow><meshStandardMaterial color="#b77745" roughness={0.65} /></RoundedBox>
    {[-1, 1].map(side => <mesh key={side} position={[side * size[0] * 0.25, 0.5, size[1] / 2 - 0.14]}><boxGeometry args={[0.045, 0.65, 0.04]} /><meshStandardMaterial color="#a5b5ae" metalness={0.8} roughness={0.25} /></mesh>)}
    <mesh position={[0, 0.08, 0]}><boxGeometry args={[size[0] - 0.5, 0.16, size[1] - 0.5]} /><meshStandardMaterial color="#283442" /></mesh>
  </group>;
}

function RespirationExitDoor() {
  return (
    <group position={[15.83, 0, -7]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[2.22, 4.3, 0.18]} />
        <meshStandardMaterial color="#335b8e" roughness={0.58} />
      </mesh>
      <mesh position={[0, 2.15, 0.105]}>
        <boxGeometry args={[1.78, 3.86, 0.045]} />
        <meshStandardMaterial color="#7395c0" roughness={0.72} />
      </mesh>
      <mesh
        position={[0, 1.72, 0.15]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.055, 0.055, 1.22, 14]} />
        <meshStandardMaterial
          color="#d1dad8"
          metalness={0.82}
          roughness={0.22}
        />
      </mesh>
      <Html
        position={[0, 4.75, 0.12]}
        center
        distanceFactor={9}
        style={{ pointerEvents: "none" }}
      >
        <div className="rounded bg-emerald-700 px-4 py-1 text-xs font-black uppercase tracking-wide text-white shadow-lg">
          Exit
        </div>
      </Html>
    </group>
  );
}

function RespirationWindow() {
  return (
    <group position={[-15.84, 5.2, -3.55]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[4.8, 2.8, 0.2]} />
        <meshStandardMaterial
          color="#dfe9e4"
          roughness={0.4}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[4.42, 2.42]} />
        <meshPhysicalMaterial
          color="#a7e0ee"
          emissive="#72cfe5"
          emissiveIntensity={0.24}
          transparent
          opacity={0.55}
          transmission={0.35}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[0.1, 2.48, 0.08]} />
        <meshStandardMaterial color="#edf5f1" metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[4.45, 0.1, 0.08]} />
        <meshStandardMaterial color="#edf5f1" metalness={0.35} />
      </mesh>
      <mesh position={[0, -1.48, 0.2]} castShadow><boxGeometry args={[5.1,0.12,0.6]} /><meshStandardMaterial color="#b0bab0" roughness={0.55} /></mesh>
    </group>
  );
}

function RespirationPlant({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.34, 0.56, 28]} />
        <meshStandardMaterial color="#8b4a2a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.08, 28]} />
        <meshStandardMaterial color="#2b1a13" roughness={0.95} />
      </mesh>
      {Array.from({ length: 9 }, (_, index) => {
        const angle = index * 0.7;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 0.24,
              1.03 + (index % 3) * 0.08,
              Math.sin(angle) * 0.24,
            ]}
            rotation={[0.75, angle, 0]}
            scale={[0.55, 0.9, 1]}
            castShadow
          >
            <circleGeometry args={[0.28, 28]} />
            <meshStandardMaterial
              color={index % 2 ? "#2f8a49" : "#3aa75a"}
              roughness={0.78}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function RespirationSideEquipment() {
  return (
    <>
      <group position={[-8.45, 1.16, -4.45]}>
        <mesh position={[-0.55, 0.35, 0]} castShadow>
          <boxGeometry args={[0.85, 0.7, 0.72]} />
          <meshStandardMaterial
            color="#d9e6e0"
            metalness={0.25}
            roughness={0.42}
          />
        </mesh>
        <mesh position={[-0.55, 0.38, 0.365]}>
          <planeGeometry args={[0.58, 0.35]} />
          <meshStandardMaterial
            color="#16393b"
            emissive="#1f8588"
            emissiveIntensity={0.38}
          />
        </mesh>
        {[0, 1, 2, 3].map((index) => (
          <group
            key={index}
            position={[0.35 + (index % 2) * 0.38, 0.02, -0.3 + Math.floor(index / 2) * 0.55]}
          >
            <mesh position={[0, 0.36, 0]} renderOrder={20}>
              <cylinderGeometry args={[0.12, 0.1, 0.72, 24, 1, true]} />
              <meshPhysicalMaterial
                color="#eaffff"
                transparent
                opacity={0.28}
                transmission={0.72}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.09, 0.085, 0.26, 22]} />
              <meshPhysicalMaterial
                color={index % 2 ? "#b9f4d0" : "#d6f4ff"}
                transparent
                opacity={0.58}
              />
            </mesh>
          </group>
        ))}
      </group>

    </>
  );
}

function RespirationLabRoom() {
  return <group>
    <mesh position={[0, -0.12, 0]} receiveShadow><boxGeometry args={[32, 0.24, 32]} /><meshStandardMaterial color="#c9b89d" roughness={0.82} /></mesh>
    {Array.from({length: 15}, (_, i) => <mesh key={`floor-${i}`} position={[-14 + i * 2, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.018, 32]} /><meshStandardMaterial color="#a7967e" /></mesh>)}
    {Array.from({length: 11}, (_, i) => <mesh key={`cross-${i}`} position={[0, 0.004, -10 + i * 2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[32, 0.018]} /><meshStandardMaterial color="#a7967e" /></mesh>)}
    {([{position:[0,10,-16],size:[32,20,0.24]}, {position:[0,10,16],size:[32,20,0.24]}, {position:[-16,10,0],size:[0.24,20,32]}, {position:[16,10,0],size:[0.24,20,32]}] as {position:[number,number,number];size:[number,number,number]}[]).map((wall,i) => <group key={i}>
      <mesh position={wall.position} receiveShadow><boxGeometry args={wall.size} /><meshStandardMaterial color={i % 2 ? '#dde5ef' : '#bbcbdc'} roughness={0.9} /></mesh>
      <mesh position={[wall.position[0],0.18,wall.position[2]]}><boxGeometry args={[wall.size[0]+0.04,0.36,wall.size[2]+0.04]} /><meshStandardMaterial color="#4b5e78" roughness={0.6} /></mesh>
    </group>)}
    <mesh position={[0,20.1,0]}><boxGeometry args={[32,0.2,32]} /><meshStandardMaterial color="#f0eee7" roughness={0.95} /></mesh>
    <RespirationCeilingLight position={[-5,19.85,0]} /><RespirationCeilingLight position={[5,19.85,0]} />
    <RespirationWindow /><RespirationExitDoor />
    <RespirationLabTable position={[0,0,0]} size={[9.2,3.7]} />
    <RespirationLabTable position={[-8.45,0,-4.45]} size={[2.7,2.55]} />
    <group position={[0, 1.12 * (TABLE_HEIGHT_SCALE - 1), 0]}><RespirationSideEquipment /></group>
    <RespirationPlant position={[13.5,0,-9]} />
    <RespirationPlant position={[-12.5,0,8.5]} />
    <RespirationPlant position={[12.5,0,8.5]} />
  </group>;
}

/** Straight delivery-tube legs with rounded elbows; no spline overshoot. */
const deliveryPath = () => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const point = (x: number, y: number) => new THREE.Vector3(x, y, 0.02);
  path.add(new THREE.LineCurve3(point(-2.15, 1.68), point(-2.15, 2.38)));
  path.add(new THREE.QuadraticBezierCurve3(point(-2.15, 2.38), point(-2.15, 2.66), point(-1.87, 2.66)));
  path.add(new THREE.LineCurve3(point(-1.87, 2.66), point(1.97, 2.66)));
  path.add(new THREE.QuadraticBezierCurve3(point(1.97, 2.66), point(2.25, 2.66), point(2.25, 2.38)));
  path.add(new THREE.LineCurve3(point(2.25, 2.38), point(2.25, 0.38)));
  return path;
};

function seedDrop(progress: number, index: number, restingY: number) {
  const elapsed = progress * RESPIRATION_DURATIONS[0] / 1000 - 0.35 - index * 0.065;
  const startY = 2.7;
  const gravity = 9.81;
  const impactTime = Math.sqrt(2 * (startY - restingY) / gravity);
  let y = startY;
  if (elapsed >= 0 && elapsed < impactTime) y -= gravity * elapsed * elapsed / 2;
  else if (elapsed >= impactTime) {
    const bounceTime = elapsed - impactTime;
    const reboundSpeed = gravity * impactTime * 0.08;
    y = restingY + Math.max(0, reboundSpeed * bounceTime - gravity * bounceTime * bounceTime / 2);
  }
  return { y, spread: THREE.MathUtils.smoothstep(0.95 - y, 0, 0.7), visible: elapsed >= 0 };
}

/** Kidney-shaped bean with a pale hilum on the inward curve. */
function BeanSeed({ germinating, variant = 0 }: { germinating: boolean; variant?: number }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.19, -0.04);
    shape.bezierCurveTo(-0.22, 0.15, -0.08, 0.22, 0.08, 0.16);
    shape.bezierCurveTo(0.24, 0.1, 0.23, -0.15, 0.08, -0.17);
    shape.bezierCurveTo(-0.02, -0.19, -0.04, -0.07, -0.1, -0.07);
    shape.bezierCurveTo(-0.14, -0.06, -0.16, -0.1, -0.19, -0.04);
    const bean = new THREE.ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.035, bevelThickness: 0.035, curveSegments: 20 });
    bean.translate(0, 0, -0.06);
    bean.computeVertexNormals();
    return bean;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group scale={0.82 + (variant % 4) * 0.055}>
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial color={germinating ? ['#bd7450', '#a95539', '#cf8b60'][variant % 3] : ['#8c4936', '#9c6149', '#ad7154'][variant % 3]} roughness={0.4} clearcoat={0.25} clearcoatRoughness={0.45} />
    </mesh>
    <mesh position={[-0.105, -0.045, 0.087]} rotation={[0, 0, -0.4]} scale={[1, 0.4, 0.22]}>
      <sphereGeometry args={[0.055, 16, 10]} /><meshStandardMaterial color="#f3ddbb" roughness={0.7} />
    </mesh>
  </group>;
}

function SeedPlasticBag({ progress, germinating }: { progress: number; germinating: boolean }) {
  // The bottom corner remains over the flask mouth while the bag tips to pour.
  const pouring = progress > 0 && progress < 1;
  const lift = THREE.MathUtils.smoothstep(progress, 0, 0.15);
  const retract = THREE.MathUtils.smoothstep(progress, 0.88, 1);
  const tip = lift * (1 - retract);
  const plastic = useMemo(() => {
    const geometry = new THREE.BoxGeometry(0.85, 1.12, 0.35, 12, 16, 2);
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
      const taper = 0.86 + 0.14 * Math.cos(y * 2.8);
      vertices.setXYZ(i, x * taper, y, z + Math.sin(x * 27 + y * 19) * 0.025);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  useEffect(() => () => plastic.dispose(), [plastic]);
  return <group position={[
    THREE.MathUtils.lerp(1.1, 0, lift) + retract * 1.1,
    THREE.MathUtils.lerp(0.65, 2.7, lift) - retract * 2.05,
    THREE.MathUtils.lerp(-0.6, 0, lift) - retract * 0.6,
  ]} rotation={[0, 0, pouring ? -0.65 * tip : 0]}>
    <mesh position={[0.32, 0.55, 0]} geometry={plastic} renderOrder={26}>
      <meshPhysicalMaterial color="#eaf6ff" transparent opacity={0.24} roughness={0.18} metalness={0} side={THREE.FrontSide} depthWrite={false} />
    </mesh>
    {[0, 1, 2, 3, 4].map(i => <mesh key={i} position={[0.02 + i * 0.14, 0.56, 0.18]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.12]}>
      <boxGeometry args={[0.008, 0.96, 0.008]} /><meshStandardMaterial color="#f5fbff" transparent opacity={0.35} depthWrite={false} />
    </mesh>)}
    <mesh position={[0.32, 1.1, 0]}><boxGeometry args={[0.85, 0.04, 0.36]} /><meshStandardMaterial color="#d6eaf0" transparent opacity={0.55} depthWrite={false} /></mesh>
    {Array.from({ length: 16 }, (_, i) => <group key={i} position={[0.08 + (i % 3) * 0.2, 0.16 + Math.floor(i / 3) * 0.13, (i % 2) * 0.08 - 0.04]} rotation={[0.2, i * 1.7, i * 0.8]} visible={!seedDrop(progress, i, 0.22).visible}><BeanSeed germinating={germinating} variant={i} /></group>)}
  </group>;
}

function SeedFlask({
  loadProgress,
  sealProgress,
  germinating,
}: {
  loadProgress: number;
  sealProgress: number;
  germinating: boolean;
}) {
  const seedLayout = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => {
        const angle = index * 2.17;
        const radius = 0.16 + (index % 4) * 0.14;
        return {
          x: Math.cos(angle) * radius,
          y: 0.22 + (index % 3) * 0.14,
          z: Math.sin(angle) * radius,
          rotation: [0.3, angle, index * 0.33] as [
            number,
            number,
            number,
          ],
        };
      }),
    [],
  );
  const flaskProfile = useMemo(() => [
    [0,0.04],[0.72,0.04],[0.88,0.1],[0.9,0.18],[0.86,0.3],
    [0.36,1.35],[0.26,1.48],[0.25,1.85],[0.28,1.88],
  ].map(([r,y]) => new THREE.Vector2(r,y)), []);
  const easedLoad = loadProgress;
  const easedSeal = THREE.MathUtils.smoothstep(sealProgress, 0, 1);

  return (
    <group position={[-2.15, 0.102, 0]}>
      <mesh renderOrder={24}>
        <latheGeometry args={[flaskProfile, 96]} />
        <meshPhysicalMaterial
          thickness={0.04}
          ior={1.46}
          color="#e8fbff"
          transparent
          opacity={0.2}
          transmission={0.88}
          roughness={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <SeedPlasticBag progress={loadProgress} germinating={germinating} />
      {seedLayout.map((seed, index) => {
        const drop = seedDrop(easedLoad, index, seed.y);
        return (
          <group key={index}
            position={[seed.x * drop.spread, drop.y, seed.z * drop.spread]}
            rotation={seed.rotation}
            visible={loadProgress > 0 && drop.visible}>
            <BeanSeed germinating={germinating} variant={index} />
          </group>
        );
      })}

      {germinating &&
        seedLayout.slice(0, 8).map((seed, index) => {
          const drop = seedDrop(easedLoad, index, seed.y);
          return (
            <group
              key={`sprout-${index}`}
              position={[seed.x * drop.spread, drop.y + 0.18, seed.z * drop.spread]}
              visible={loadProgress > 0 && drop.visible}
            >
              <mesh rotation={[0, 0, 0.55]}>
                <cylinderGeometry args={[0.018, 0.03, 0.34, 9]} />
                <meshStandardMaterial color="#e5ddd0" roughness={0.8} />
              </mesh>
              <mesh
                position={[0.11, 0.13, 0]}
                rotation={[0, 0, -0.72]}
                scale={[0.5, 0.82, 0.5]}
              >
                <sphereGeometry args={[0.09, 12, 9]} />
                <meshStandardMaterial color="#7faa62" roughness={0.9} />
              </mesh>
            </group>
          );
        })}

      <mesh
        position={[0, THREE.MathUtils.lerp(2.45, 1.92, easedSeal), 0]}
        visible={sealProgress > 0.005}
        castShadow
      >
        <cylinderGeometry args={[0.27, 0.3, 0.3, 32]} />
        <meshStandardMaterial color="#3b302a" roughness={0.9} />
      </mesh>

      <Html
        position={[0, -0.2, 0.5]}
        center
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/88 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-white">
          {germinating ? "Germinating seeds" : "Boiled seeds · control"}
        </div>
      </Html>
    </group>
  );
}

function DeliveryTube({ sealProgress }: { sealProgress: number }) {
  const curve = useMemo(deliveryPath, []);
  const fitting = THREE.MathUtils.smoothstep(sealProgress, 0, 1);
  return (
    <mesh position={[0, (1 - fitting) * 0.65, -(1 - fitting) * 0.65]} castShadow>
      <tubeGeometry args={[curve, 128, 0.065, 16, false]} />
      <meshStandardMaterial color="#087f8c" roughness={0.38} metalness={0.05} />
    </mesh>
  );
}

function LimewaterTube({
  testProgress,
  positive,
  bubbling,
}: {
  testProgress: number;
  positive: boolean;
  bubbling: boolean;
}) {
  const bubbleRef = useRef<THREE.Group>(null);
  const bubbleElapsed = useRef(0);
  const liquidColor = new THREE.Color("#dff9ff").lerp(
    new THREE.Color("#f8faf5"),
    positive ? 1 - Math.exp(-4 * testProgress) : 0,
  );

  useFrame((_, delta) => {
    if (!bubbleRef.current) return;
    if (!bubbling) {bubbleElapsed.current = 0; return;}
    bubbleElapsed.current += delta;
    bubbleRef.current.children.forEach((child, index) => {
      const age = bubbleElapsed.current - index * 0.16;
      const travel = Math.max(0, age % 1.6) / 1.6;
      child.position.set(
        Math.sin(index * 2.2 + travel * 4) * 0.035,
        0.22 + travel * 0.66,
        0.02 + Math.cos(index * 1.7 + travel * 3) * 0.035,
      );
      child.scale.setScalar(0.75 + travel * 0.35);
      child.visible = age >= 0 && travel < 0.98;
    });
  });

  return (
    <group position={[2.25, 0.132, 0]}>
      <RoundedBox args={[1.25, 0.08, 1.12]} radius={0.035} position={[0,-0.015,0]} castShadow receiveShadow><meshStandardMaterial color="#314a70" roughness={0.45} metalness={0.3} /></RoundedBox>
      <mesh position={[0, 0.9, 0]} renderOrder={25}>
        <cylinderGeometry args={[0.47, 0.4, 1.78, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#e6fbff"
          transparent
          opacity={0.22}
          transmission={0.88}
          roughness={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 0.49, 0]} renderOrder={18}>
        <cylinderGeometry args={[0.39, 0.37, 0.78, 48]} />
        <meshPhysicalMaterial
          color={liquidColor}
          emissive={positive ? "#e8efe4" : "#000000"}
          emissiveIntensity={positive ? testProgress * 0.18 : 0}
          transparent
          opacity={positive ? 0.38 + testProgress * 0.6 : 0.38}
          transmission={positive ? 0.52 - testProgress * 0.5 : 0.52}
          roughness={positive ? 0.08 + testProgress * 0.76 : 0.08}
          depthWrite={false}
        />
      </mesh>
      <mesh
        position={[0, 1.77, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={26}
      >
        <torusGeometry args={[0.46, 0.025, 10, 48]} />
        <meshPhysicalMaterial color="#efffff" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.04, 0]} renderOrder={26}>
        <cylinderGeometry args={[0.4,0.4,0.08,64]} />
        <meshPhysicalMaterial color="#e6fbff" transparent opacity={0.45} transmission={0.65} roughness={0.04} />
      </mesh>
      <group ref={bubbleRef} visible={bubbling}>
        {Array.from({ length: 9 }, (_, index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.036 + (index % 3) * 0.008, 10, 8]} />
            <meshPhysicalMaterial color="#e9f9ff" transparent opacity={0.55} roughness={0.04} metalness={0.05} />
          </mesh>
        ))}
      </group>

      {positive &&
        testProgress > 0.12 &&
        Array.from({ length: 20 }, (_, index) => {
          const angle = index * 2.32;
          const radius = 0.1 + (index % 4) * 0.075;
          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * radius,
                0.22 + ((index * 0.19 + testProgress * 0.5) % 0.6),
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.025 + (index % 3) * 0.008, 9, 7]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.3 + testProgress * 0.55}
              />
            </mesh>
          );
        })}

      <Html
        position={[0, -0.2, 0.45]}
        center
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div className="whitespace-nowrap rounded-full border border-white/20 bg-slate-950/88 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-white">
          Limewater
        </div>
      </Html>
    </group>
  );
}

function RespirationInteractionHighlight({
  position,
  active,
}: {
  position: THREE.Vector3;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.visible = active;
    if (!active) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 4.5) * 0.09;
    groupRef.current.scale.setScalar(pulse);
    groupRef.current.rotation.y = clock.elapsedTime * 0.45;
  });

  return (
    <group
      ref={groupRef}
      position={[position.x, 1.3, position.z]}
      visible={active}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={50}>
        <ringGeometry args={[0.73, 0.84, 48]} />
        <meshBasicMaterial
          color="#fef08a"
          transparent
          opacity={0.88}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 1.7, 0]} rotation={[Math.PI, 0, 0]} renderOrder={50}>
        <coneGeometry args={[0.18, 0.4, 24]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.95}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0.8, 0]}
        color="#fde68a"
        intensity={0.45}
        distance={2.8}
        decay={2}
      />
    </group>
  );
}

function RespirationScene({
  stage,
  running,
  progress,
  germinating,
  mode,
  isMobile,
  moveVectorRef,
  interactables,
  activeTargetId,
  onTargetChange,
}: {
  stage: number;
  running: boolean;
  progress: number;
  germinating: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
  interactables: Interactable[];
  activeTargetId: string | null;
  onTargetChange: (target: Interactable | null) => void;
}) {
  const loadProgress = stage > 0 ? 1 : stage === 0 && running ? progress : 0;
  const sealProgress = stage > 1 ? 1 : stage === 1 && running ? progress : 0;
  const testProgress = stage > 2 ? 1 : stage === 2 && running ? progress : 0;
  const gasActive = stage === 2 && running && germinating;

  return (
    <>
      <color attach="background" args={["#dde5ef"]} />
      <fog attach="fog" args={["#dde5ef", 30, 55]} />
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#f3f7ff", "#b5a28b", 0.85]} />
      <directionalLight
        position={[-7.5, 10.5, 4.5]}
        intensity={1.8}
        color="#fff7ed"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight
        position={[-9.6, 4.35, -2.65]}
        color="#a5f3fc"
        intensity={22}
        distance={30}
        decay={2}
      />

      <RespirationLabRoom />

      <group position={[0, APPARATUS_Y, 0]}>
        <mesh position={[0, 0.035, 0]} receiveShadow>
          <boxGeometry args={[8.45, 0.07, 3.05]} />
          <meshStandardMaterial
            color="#e5ece7"
            roughness={0.36}
            metalness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[8.12, 0.035, 2.76]} />
          <meshStandardMaterial color="#f8fbf7" roughness={0.58} />
        </mesh>

        <SeedFlask
          loadProgress={loadProgress}
          sealProgress={sealProgress}
          germinating={germinating}
        />
        <DeliveryTube sealProgress={sealProgress} />
        <LimewaterTube
          testProgress={testProgress}
          positive={germinating}
          bubbling={gasActive}
        />

        <group position={[0, 0.08, -0.92]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[1.35, 0.16, 0.68]} />
            <meshStandardMaterial
              color="#d89136"
              metalness={0.22}
              roughness={0.48}
            />
          </mesh>
          <mesh position={[0, 0.162, 0.345]}>
            <planeGeometry args={[0.96, 0.36]} />
            <meshStandardMaterial
              color="#0d2724"
              emissive={running ? "#2dd4bf" : "#124a43"}
              emissiveIntensity={running ? 0.42 : 0.16}
            />
          </mesh>
          <Html
            position={[0, 0.162, 0.37]}
            center
            distanceFactor={8}
            style={{ pointerEvents: "none" }}
          >
            <div className="whitespace-nowrap font-mono text-[7px] font-black uppercase tracking-[0.12em] text-emerald-100">
              {stage < 2
                ? "Apparatus setup"
                : running
                  ? `Gas test ${Math.round(progress * 100)}%`
                  : "Gas test ready"}
            </div>
          </Html>
        </group>
      </group>

      <ContactShadows
        position={[0, APPARATUS_Y + 0.102, 0]}
        opacity={0.42}
        scale={9}
        blur={2.4}
        far={4}
      />

      {mode === "doing" &&
        interactables.map((item) => (
          <RespirationInteractionHighlight
            key={item.id}
            position={item.position}
            active={item.id === activeTargetId}
          />
        ))}

      {mode === "doing" ? (
        <PlayerController
          bounds={RESPIRATION_PLAYER_BOUNDS}
          obstacles={RESPIRATION_PLAYER_OBSTACLES}
          spawn={RESPIRATION_PLAYER_SPAWN}
          eyeHeight={APPARATUS_Y + 1.7}
          initialYaw={RESPIRATION_PLAYER_INITIAL_YAW}
          initialPitch={RESPIRATION_PLAYER_INITIAL_PITCH}
          speed={3.1}
          isMobile={isMobile}
          enabled
          moveVector={moveVectorRef}
          onUpdate={(position, lookDirection) => {
            onTargetChange(
              resolveActiveInteractable(
                interactables,
                position,
                lookDirection,
              ),
            );
          }}
        />
      ) : (
        <RespirationCamera />
      )}
    </>
  );
}

function RespirationPaper({
  germinating,
  complete,
  onClose,
}: {
  germinating: boolean;
  complete: boolean;
  onClose: () => void;
}) {
  return (
    <ExperimentPaperModal
      filename="respiration-germinating-seeds.html"
      onClose={onClose}
    >
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">
          Respiration in Germinating Seeds
        </h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>
          To test whether {germinating ? "germinating" : "boiled control"} seeds
          produce carbon dioxide.
        </p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>
          Conical flask, germinating seeds, boiled seeds for the control,
          airtight stopper, delivery tube and fresh limewater.
        </p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The selected seeds were placed in a clean conical flask.</li>
          <li>
            The stopper and delivery tube were fitted tightly so outside air
            could not enter.
          </li>
          <li>
            Gas from the seed flask was passed through fresh limewater and the
            change was observed.
          </li>
          <li>
            The result was compared with boiled seeds under the same
            conditions.
          </li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Variables</h2>
        <p>
          Seed condition was changed. Seed mass, temperature, time and
          limewater volume were kept constant.
        </p>
        <h2 className="mt-5 font-bold uppercase">Observation</h2>
        <p>
          {!complete
            ? "The observation stage has not yet been completed."
            : germinating
              ? "The limewater turned milky, showing that carbon dioxide was produced."
              : "The limewater remained clear with boiled seeds."}
        </p>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          {complete && germinating
            ? "Germinating seeds produced carbon dioxide, which is evidence that respiration occurred."
            : complete
              ? "The boiled-seed control did not respire and did not produce a positive limewater test."
              : "A conclusion can be recorded after observing the limewater."}
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

export default function RespirationSim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  tutorialMode = "tour",
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: RespirationSimProps) {
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [germinating, setGerminating] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"see" | "learn" | null>(null);
  const [demoActive, setDemoActive] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [activeInteractableMeta, setActiveInteractableMeta] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const activeInteractableRef = useRef<Interactable | null>(null);
  const startRef = useRef(0);
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const isMobileViewport = useMobileExperimentViewport();
  const complete = stage >= RESPIRATION_STEPS.length;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  useEffect(() => {
    if (!running || complete || selectedMode === null || showTutorial || showPaper) return;
    let frame = 0;
    const animate = (now: number) => {
      const next = THREE.MathUtils.clamp(
        (now - startRef.current) / RESPIRATION_DURATIONS[stage],
        0,
        1,
      );
      setProgress(next);
      if (next >= 1) {
        setRunning(false);
        setProgress(0);
        setStage((current) => current + 1);
        return;
      }
      frame = window.requestAnimationFrame(animate);
    };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [complete, running, stage, selectedMode, showTutorial, showPaper]);

  const runStage = useCallback(() => {
    if (running || complete) return;
    startRef.current = performance.now();
    setProgress(0);
    setRunning(true);
  }, [complete, running]);

  const reset = useCallback(() => {
    setRunning(false);
    setProgress(0);
    setStage(0);
  }, []);

  useEffect(() => {
    if (!demoActive || running || complete || mode !== "learning" || selectedMode === null || showTutorial || showPaper) return;
    const timer = window.setTimeout(runStage, 900);
    return () => window.clearTimeout(timer);
  }, [demoActive, running, complete, mode, runStage, selectedMode, showTutorial, showPaper]);

  const handleTargetChange = useCallback((target: Interactable | null) => {
    activeInteractableRef.current = target;
    setActiveInteractableMeta((current) => {
      if (!target) return current === null ? current : null;
      if (current?.id === target.id && current.label === target.label) {
        return current;
      }
      return { id: target.id, label: target.label };
    });
  }, []);

  const handleInteraction = useCallback(() => {
    activeInteractableRef.current?.onActivate();
  }, []);

  useEffect(() => {
    if (mode !== "doing" || isMobileViewport || selectedMode === null || showTutorial || showPaper) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.code !== "KeyE" && event.code !== "Space") ||
        event.repeat
      ) {
        return;
      }
      if (!activeInteractableRef.current) return;
      event.preventDefault();
      activeInteractableRef.current.onActivate();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileViewport, mode, selectedMode, showTutorial, showPaper]);

  useEffect(() => {
    if (mode === "doing") return;
    activeInteractableRef.current = null;
    setActiveInteractableMeta(null);
    moveVectorRef.current = { x: 0, y: 0 };
  }, [mode]);

  const interactables = useMemo<Interactable[]>(() => {
    if (mode !== "doing") return [];
    const currentStage = Math.min(
      stage,
      RESPIRATION_STEPS.length - 1,
    );
    const labels = [
      `place ${germinating ? "germinating" : "boiled control"} seeds in the flask`,
      "fit the airtight stopper and delivery tube",
      "observe the limewater carbon dioxide test",
    ] as const;

    return [
      {
        id: complete ? "respiration-repeat" : `respiration-step-${currentStage}`,
        position: RESPIRATION_STATION_POSITIONS[currentStage],
        radius: RESPIRATION_INTERACTION_RADIUS,
        label: complete ? "repeat the experiment" : labels[currentStage],
        disabled: running,
        onActivate: complete ? reset : runStage,
      },
    ];
  }, [complete, germinating, mode, reset, runStage, running, stage]);

  const observation = !complete
    ? "Complete the apparatus and observe the limewater."
    : germinating
      ? "Limewater turned milky · CO₂ present"
      : "Limewater remained clear · control";


return (
    <div className={`respiration-design relative flex h-full w-full overflow-hidden bg-slate-950 text-white ${isMobileViewport ? "oxygen-design--mobile" : ""}`}>
      <ExperimentTopBar variant="overlay" title="Respiration" symbol={null}
        onBack={onBack} onRequestHowTo={onRequestHowTo} onRequestPaper={onRequestPaper}
        accentBase="#22c55e" accentText="#bbf7d0" />
      <ExperimentHeaderPortal name="actions">
        <div data-experiment-tour="respiration-mode-toggle" className="flex overflow-hidden rounded-full border border-white/15 bg-[#090b25]/90 text-[9px] font-black uppercase shadow-xl" aria-label="Choose experiment mode">
          {(["see", "learn", "do"] as const).map(choice => <button key={choice} type="button" aria-pressed={choice === "do" ? mode === "doing" : mode === "learning" && selectedMode === choice}
            className={`px-3 py-2 ${choice === "do" && mode === "doing" ? "bg-orange-400 text-slate-950" : mode === "learning" && selectedMode === choice ? "bg-emerald-400 text-slate-950" : "text-slate-300 hover:text-white"}`}
            onClick={() => {setDemoActive(false); if (choice === "do") {setSelectedMode("learn");setMode("doing");} else {setMode("learning");setSelectedMode(choice);if(choice === "see") {reset();setDemoActive(true);}}}}>{choice === "see" ? "See" : choice === "learn" ? "Learn" : "Do"}</button>)}
        </div>
      </ExperimentHeaderPortal>
      <div
        data-experiment-tour="respiration-scene"
        inert={selectedMode === null}
        className="relative min-w-0 flex-1"
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [8.2, 5.2, 10.8],
            fov: 50,
            near: 0.08,
            far: 110,
          }}
          style={{ touchAction: "none" }}
        >
          <RespirationScene
            stage={Math.min(stage, RESPIRATION_STEPS.length)}
            running={running}
            progress={progress}
            germinating={germinating}
            mode={selectedMode === null || showTutorial || showPaper ? "learning" : mode}
            isMobile={isMobileViewport}
            moveVectorRef={moveVectorRef}
            interactables={interactables}
            activeTargetId={activeInteractableMeta?.id ?? null}
            onTargetChange={handleTargetChange}
          />
        </Canvas>

        {mode === "doing" && isMobileViewport && (
          <MobileGtaNavigation moveVector={moveVectorRef} />
        )}

        <MobileExperimentTopBar
          onBack={onBack}
          onRequestHowTo={onRequestHowTo}
          onRequestPaper={onRequestPaper}
          mode={mode}
          onModeChange={(next) => {setDemoActive(false);setMode(next);}}
          contextLabel={complete ? "Result ready" : `Step ${stage + 1} of 3`}
        />

        {(!isMobileViewport || mode === "doing") && <div
          data-experiment-tour="respiration-result"
          className="absolute inset-x-3 top-14 z-20 rounded-2xl border border-white/12 bg-slate-950/82 p-3 shadow-xl backdrop-blur-xl sm:left-4 sm:right-auto sm:top-20 sm:w-[330px]"
        >
          <div className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-300">
            Carbon dioxide test
          </div>
          <div
            className={`mt-1 text-sm font-black ${
              complete && germinating
                ? "text-white"
                : complete
                  ? "text-slate-200"
                  : "text-white"
            }`}
          >
            {running
              ? `${RESPIRATION_STEPS[stage]} · ${Math.round(progress * 100)}%`
              : observation}
          </div>
          {running && (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}
        </div>}

        {mode === "learning" && !isMobileViewport && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950/82 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-slate-200 shadow-xl backdrop-blur-xl">
            Drag to look around · scroll to zoom
          </div>
        )}

        {mode === "doing" && !isMobileViewport && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-white/80 shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
            {activeInteractableMeta && (
              <div className="absolute top-[58%] rounded-full border border-amber-200/30 bg-slate-950/86 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur">
                Press <span className="text-amber-300">E</span> to{" "}
                {activeInteractableMeta.label}
              </div>
            )}
            <div className="absolute bottom-4 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold text-slate-300">
              Walk to the highlighted apparatus · WASD/arrows to move · mouse
              to look
            </div>
          </div>
        )}

        {mode === "doing" &&
          isMobileViewport &&
          activeInteractableMeta && (
            <button
              type="button"
              onClick={handleInteraction}
              className="absolute bottom-[11.5rem] right-4 z-[70] flex h-[76px] w-[76px] touch-manipulation select-none flex-col items-center justify-center rounded-full border-2 border-amber-100/65 bg-gradient-to-b from-amber-300 via-orange-500 to-orange-700 px-1 text-white shadow-[0_10px_28px_rgba(0,0,0,0.48),0_0_22px_rgba(251,146,60,0.25)] active:translate-y-0.5"
              aria-label={`Use apparatus to ${activeInteractableMeta.label}`}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.12em]">
                Use
              </span>
              <span className="mt-0.5 max-w-[66px] text-center text-[8px] font-bold leading-tight">
                {activeInteractableMeta.label}
              </span>
            </button>
          )}
      </div>

      {mode === "learning" && <section className={`oxygen-controls ${isMobileViewport ? "" : "pt-16"}`} inert={selectedMode === null} aria-label="Respiration experiment guide">
        <header className="oxygen-controls__header"><strong>Experiment guide</strong><button type="button" onClick={() => {setDemoActive(false); reset();}}>Start again</button></header>
        <div className="oxygen-guide__progress"><div><span>{complete ? "Complete" : `Step ${stage + 1} of 3`}</span><span>{Math.round((stage + progress) / 3 * 100)}%</span></div><progress aria-label="Experiment progress" max={3} value={stage + progress} /></div>
        <div className="oxygen-guide__step" aria-live="polite" data-experiment-tour="respiration-method">
          <p className="oxygen-guide__eyebrow">{demoActive ? "Demonstration" : `Respiration · ${germinating ? "germinating beans" : "boiled control"}`}</p>
          <h2>{complete ? "Read the result" : RESPIRATION_STEPS[stage]}</h2>
          <p>{complete ? observation : ["Choose living germinating seeds or boiled seeds for the control, then load the flask.","Fit the stopper tightly. The delivery tube must dip below the surface of the limewater.","Watch the gas pass through fresh limewater. Carbon dioxide makes it turn milky."][stage]}</p>
          {stage === 0 && <div className="oxygen-guide__choices" data-experiment-tour="respiration-sample">{([true,false] as const).map(value => <button key={String(value)} type="button" aria-pressed={germinating === value} disabled={running || demoActive} onClick={() => setGerminating(value)}><strong>{value ? "Germinating" : "Boiled control"}</strong><span>{value ? "Living seeds" : "Non-living seeds"}</span></button>)}</div>}
          {(stage === 2 || complete) && <div className="oxygen-guide__collection"><p>{running ? `Observing · ${Math.round(progress * 100)}%` : observation}</p><small>Experiment time is compressed for this simulation.</small></div>}
          <p className="respiration-guide__fair-test mt-6 text-xs">Keep seed mass, temperature, observation time and limewater volume the same for both samples.</p>
        </div>
        <footer className="oxygen-guide__actions"><button type="button" className="oxygen-guide__next" disabled={running || demoActive && !complete} onClick={() => {if (complete) {setDemoActive(false);reset();} else runStage();}}>{running ? "Please wait…" : complete ? "Try again" : "Next"}</button><button type="button" className="oxygen-guide__demo" onClick={() => { if (demoActive) {setDemoActive(false);reset();} else {reset();setDemoActive(true);} }}>{demoActive ? "Stop demonstration" : "Watch demonstration"}</button><div className="respiration-guide__links"><button type="button" className="oxygen-guide__demo" onClick={() => {setDemoActive(false);reset();setSelectedMode(null);}}>Change mode</button><button type="button" className="oxygen-guide__demo" disabled={running || demoActive} onClick={() => {setDemoActive(false);reset();setGerminating(current => !current);}}>Change sample</button></div></footer>
      </section>}

      {selectedMode === null && <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/20 p-5 backdrop-blur-[7px]">
        <div role="dialog" aria-modal="true" aria-labelledby="respiration-mode-title" onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
          const target = event.shiftKey ? buttons[0] : buttons[buttons.length - 1];
          if (document.activeElement === target) {event.preventDefault(); (event.shiftKey ? buttons[buttons.length - 1] : buttons[0]).focus();}
        }} className="w-full max-w-[360px] rounded-2xl bg-white p-6 text-center text-slate-900 shadow-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Respiration</p><h2 id="respiration-mode-title" className="mt-2 text-2xl font-bold">Select mode</h2><p className="mt-2 text-sm text-slate-500">Watch the experiment or complete each step yourself.</p>
          <div className="mt-5 space-y-3"><button autoFocus type="button" className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-left text-sm font-bold text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-cyan-200" onClick={() => {reset();setSelectedMode("see");setMode("learning");setDemoActive(true);}}>See <span className="float-right">▶</span></button><button type="button" className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-bold text-emerald-950 focus-visible:outline focus-visible:outline-4 focus-visible:outline-emerald-200" onClick={() => {setSelectedMode("learn");setMode("learning");setDemoActive(false);}}>Learn <span className="float-right">→</span></button></div>
        </div>
      </div>}

      {showPaper && (
        <RespirationPaper
          germinating={germinating}
          complete={complete}
          onClose={onClosePaper}
        />
      )}

      {showTutorial && (
        <ExperimentTutorialOverlay
          key={tutorialRequestKey}
          steps={
            tutorialMode === "howto"
              ? respirationHowToSteps
              : respirationTutorialSteps
          }
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  );
}
