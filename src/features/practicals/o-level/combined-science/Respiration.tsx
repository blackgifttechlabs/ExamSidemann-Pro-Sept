"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import {
  ExperimentTutorialOverlay,
  type ExperimentTutorialStep,
} from "../../common/ExperimentTutorialOverlay";
import { MobileExperimentControls } from "../../common/MobileExperimentControls";
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
  new THREE.Vector3(-2.15, 0.12, 0.05),
  new THREE.Vector3(0, 0.12, 0.05),
  new THREE.Vector3(2.25, 0.12, 0.05),
] as const;
const RESPIRATION_PLAYER_OBSTACLES: PlayerBounds[] = [
  { minX: -4.6, maxX: 4.6, minZ: -1.85, maxZ: 1.85 },
  { minX: -9.8, maxX: -7.1, minZ: 3.2, maxZ: 5.8 },
  { minX: 7.1, maxX: 9.8, minZ: 3.2, maxZ: 5.8 },
  { minX: -9.8, maxX: -7.1, minZ: -5.7, maxZ: -3.15 },
];

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
      mobile ? 4.4 : 5.2,
      mobile ? 9.4 : 10.8,
    );
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = mobile ? 56 : 50;
    }
    camera.near = 0.08;
    camera.far = 110;
    camera.lookAt(0, 1.25, 0);
    camera.updateProjectionMatrix();
  }, [camera, mobile]);

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      target={[0, 1.2, 0]}
      minDistance={5.6}
      maxDistance={17.5}
      maxPolarAngle={1.5}
      enableDamping
      dampingFactor={0.075}
    />
  );
}

function makeRespirationPosterTexture(
  title: string,
  lines: string[],
  accent: string,
) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 820;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  context.fillStyle = "#eef5f1";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(0, 0, canvas.width, 122);
  context.fillStyle = "#ffffff";
  context.font = "800 40px Arial";
  context.textAlign = "center";
  context.fillText(title, canvas.width / 2, 75);
  context.textAlign = "left";
  context.font = "700 29px Arial";

  lines.forEach((line, index) => {
    const y = 180 + index * 108;
    context.fillStyle = accent;
    context.beginPath();
    context.arc(58, y - 9, 14, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#172033";
    const words = line.split(" ");
    let row = "";
    let rowY = y;
    words.forEach((word) => {
      const next = `${row}${word} `;
      if (context.measureText(next).width > 500) {
        context.fillText(row.trim(), 92, rowY);
        row = `${word} `;
        rowY += 36;
      } else {
        row = next;
      }
    });
    context.fillText(row.trim(), 92, rowY);
  });

  context.strokeStyle = "#91a39a";
  context.lineWidth = 8;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function RespirationWallPoster({
  position,
  title,
  lines,
  accent,
}: {
  position: [number, number, number];
  title: string;
  lines: string[];
  accent: string;
}) {
  const contentKey = lines.join("|");
  const texture = useMemo(
    () => makeRespirationPosterTexture(title, lines, accent),
    [accent, contentKey, title],
  );

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group position={position} rotation={[0, Math.PI, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.95, 3.55, 0.12]} />
        <meshStandardMaterial
          color="#2f3c36"
          metalness={0.32}
          roughness={0.38}
        />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[2.72, 3.32]} />
        <meshStandardMaterial map={texture} roughness={0.72} />
      </mesh>
    </group>
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
        intensity={0.74}
        distance={8.5}
        decay={2}
      />
    </group>
  );
}

function RespirationLabTable({
  position,
  size,
  topColor = "#385248",
}: {
  position: [number, number, number];
  size: [number, number];
  topColor?: string;
}) {
  const [width, depth] = size;
  const legX = width / 2 - 0.32;
  const legZ = depth / 2 - 0.32;

  return (
    <group position={position}>
      <mesh position={[0, 1.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.18, depth]} />
        <meshStandardMaterial
          color={topColor}
          roughness={0.34}
          metalness={0.24}
        />
      </mesh>
      <mesh position={[0, 0.91, 0]} castShadow>
        <boxGeometry args={[width - 0.28, 0.13, depth - 0.28]} />
        <meshStandardMaterial
          color="#21342f"
          metalness={0.52}
          roughness={0.5}
        />
      </mesh>
      {[
        [-legX, legZ],
        [legX, legZ],
        [-legX, -legZ],
        [legX, -legZ],
      ].map(([x, z]) => (
        <mesh key={`${x}-${z}`} position={[x, 0.46, z]} castShadow>
          <boxGeometry args={[0.16, 0.92, 0.16]} />
          <meshStandardMaterial
            color="#273530"
            metalness={0.62}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function RespirationLabStool({
  position,
}: {
  position: [number, number, number];
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.37, 0.13, 28]} />
        <meshStandardMaterial color="#29463b" roughness={0.44} />
      </mesh>
      {[0, 1, 2, 3].map((index) => {
        const angle = index * (Math.PI / 2) + Math.PI / 4;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * 0.23,
              0.34,
              Math.sin(angle) * 0.23,
            ]}
            castShadow
          >
            <cylinderGeometry args={[0.035, 0.045, 0.7, 10]} />
            <meshStandardMaterial
              color="#313d38"
              metalness={0.62}
              roughness={0.28}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function RespirationExitDoor() {
  return (
    <group position={[15.83, 0, -7]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[2.22, 4.3, 0.18]} />
        <meshStandardMaterial color="#49615a" roughness={0.58} />
      </mesh>
      <mesh position={[0, 2.15, -0.105]}>
        <boxGeometry args={[1.78, 3.86, 0.045]} />
        <meshStandardMaterial color="#6d8580" roughness={0.72} />
      </mesh>
      <mesh
        position={[0, 1.72, -0.15]}
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
        position={[0, 4.75, -0.12]}
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
      <mesh position={[0, 0, -0.13]}>
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
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[0.1, 2.48, 0.08]} />
        <meshStandardMaterial color="#edf5f1" metalness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[4.45, 0.1, 0.08]} />
        <meshStandardMaterial color="#edf5f1" metalness={0.35} />
      </mesh>
      <mesh position={[-1.45, -0.35, -0.22]}>
        <coneGeometry args={[0.58, 1.35, 8]} />
        <meshStandardMaterial color="#39764b" roughness={0.92} />
      </mesh>
      <mesh position={[1.35, -0.38, -0.21]}>
        <coneGeometry args={[0.52, 1.22, 8]} />
        <meshStandardMaterial color="#5a8f56" roughness={0.92} />
      </mesh>
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
      <RespirationPlant position={[-8.45, 1.05, 4.5]} />
      <RespirationPlant position={[8.45, 1.05, 4.5]} />
    </>
  );
}

function RespirationLabRoom() {
  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[32, 0.24, 24]} />
        <meshStandardMaterial
          color="#87958d"
          roughness={0.7}
          metalness={0.06}
        />
      </mesh>
      {Array.from({ length: 17 }, (_, index) => -16 + index * 2).map(
        (x) => (
          <mesh key={`resp-floor-x-${x}`} position={[x, 0.012, 0]}>
            <boxGeometry args={[0.018, 0.012, 24]} />
            <meshStandardMaterial color="#64756b" roughness={0.82} />
          </mesh>
        ),
      )}
      {Array.from({ length: 13 }, (_, index) => -12 + index * 2).map(
        (z) => (
          <mesh key={`resp-floor-z-${z}`} position={[0, 0.013, z]}>
            <boxGeometry args={[32, 0.012, 0.018]} />
            <meshStandardMaterial color="#64756b" roughness={0.82} />
          </mesh>
        ),
      )}

      <mesh position={[0, 6.25, -12]} receiveShadow>
        <boxGeometry args={[32, 12.5, 0.24]} />
        <meshStandardMaterial color="#d8e2dc" roughness={0.9} />
      </mesh>
      <mesh position={[0, 6.25, 12]} receiveShadow>
        <boxGeometry args={[32, 12.5, 0.24]} />
        <meshStandardMaterial color="#dbe7df" roughness={0.9} />
      </mesh>
      <mesh position={[-16, 1.25, 0]} receiveShadow>
        <boxGeometry args={[0.24, 2.5, 24]} />
        <meshStandardMaterial color="#cedbd2" roughness={0.9} />
      </mesh>
      <mesh position={[-16, 9.8, 0]} receiveShadow>
        <boxGeometry args={[0.24, 5.4, 24]} />
        <meshStandardMaterial color="#cedbd2" roughness={0.9} />
      </mesh>
      <mesh position={[-16, 5.2, -9.65]} receiveShadow>
        <boxGeometry args={[0.24, 4.1, 4.5]} />
        <meshStandardMaterial color="#cedbd2" roughness={0.9} />
      </mesh>
      <mesh position={[-16, 5.2, 6.15]} receiveShadow>
        <boxGeometry args={[0.24, 4.1, 11.3]} />
        <meshStandardMaterial color="#cedbd2" roughness={0.9} />
      </mesh>
      <mesh position={[16, 6.25, 0]} receiveShadow>
        <boxGeometry args={[0.24, 12.5, 24]} />
        <meshStandardMaterial color="#cedbd2" roughness={0.9} />
      </mesh>
      <mesh position={[0, 12.5, 0]} receiveShadow>
        <boxGeometry args={[32, 0.2, 24]} />
        <meshStandardMaterial color="#eff5f0" roughness={0.86} />
      </mesh>

      {[-10, -3.35, 3.35, 10].flatMap((x) =>
        [-5.2, 5.2].map((z) => (
          <RespirationCeilingLight
            key={`${x}-${z}`}
            position={[x, 12.32, z]}
          />
        )),
      )}

      <RespirationWindow />
      <RespirationExitDoor />
      <RespirationWallPoster
        position={[-10.35, 5.65, 11.82]}
        title="RESPIRATION"
        accent="#15803d"
        lines={[
          "Living cells release energy",
          "Germinating seeds respire",
          "Carbon dioxide enters limewater",
          "Milky limewater is a positive test",
          "Use boiled seeds as a control",
        ]}
      />
      <RespirationWallPoster
        position={[7.65, 5.65, 11.82]}
        title="FAIR TEST"
        accent="#0e7490"
        lines={[
          "Use equal masses of seeds",
          "Keep both flasks at one temperature",
          "Use fresh equal limewater volumes",
          "Seal every joint tightly",
          "Observe for the same length of time",
        ]}
      />

      <RespirationLabTable position={[0, 0, 0]} size={[9.2, 3.7]} />
      <RespirationLabTable
        position={[-8.45, 0, 4.5]}
        size={[2.7, 2.6]}
        topColor="#416052"
      />
      <RespirationLabTable
        position={[8.45, 0, 4.5]}
        size={[2.7, 2.6]}
        topColor="#416052"
      />
      <RespirationLabTable
        position={[-8.45, 0, -4.45]}
        size={[2.7, 2.55]}
        topColor="#4b6257"
      />
      <RespirationLabStool position={[-5.05, 0, 1.45]} />
      <RespirationLabStool position={[5.05, 0, 1.45]} />
      <RespirationLabStool position={[-5.05, 0, -1.45]} />
      <RespirationLabStool position={[5.05, 0, -1.45]} />
      <RespirationSideEquipment />
    </group>
  );
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
  const easedLoad = THREE.MathUtils.smoothstep(loadProgress, 0, 1);
  const easedSeal = THREE.MathUtils.smoothstep(sealProgress, 0, 1);

  return (
    <group position={[-2.15, 0.08, 0]}>
      <mesh position={[0, 0.72, 0]} renderOrder={24} castShadow>
        <coneGeometry args={[0.92, 1.58, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#e8fbff"
          transparent
          opacity={0.2}
          transmission={0.88}
          roughness={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, 1.62, 0]} renderOrder={24}>
        <cylinderGeometry args={[0.25, 0.38, 0.52, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#e8fbff"
          transparent
          opacity={0.2}
          transmission={0.88}
          roughness={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh
        position={[0, 0.03, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        renderOrder={25}
      >
        <cylinderGeometry args={[0.89, 0.89, 0.06, 56]} />
        <meshPhysicalMaterial
          color="#dff7fb"
          transparent
          opacity={0.5}
          transmission={0.5}
        />
      </mesh>

      {seedLayout.map((seed, index) => {
        const stagger = THREE.MathUtils.clamp(
          easedLoad * 1.38 - index * 0.025,
          0,
          1,
        );
        const dropY = THREE.MathUtils.lerp(
          2.7 + (index % 4) * 0.15,
          seed.y,
          THREE.MathUtils.smoothstep(stagger, 0, 1),
        );
        return (
          <mesh
            key={index}
            position={[seed.x, dropY, seed.z]}
            rotation={seed.rotation}
            scale={[1, 0.72, 0.82]}
            visible={loadProgress > 0.005}
            castShadow
          >
            <sphereGeometry args={[0.17, 18, 12]} />
            <meshStandardMaterial
              color={germinating ? "#b8a062" : "#8f7252"}
              roughness={0.88}
            />
          </mesh>
        );
      })}

      {germinating &&
        seedLayout.slice(0, 8).map((seed, index) => {
          const reveal = THREE.MathUtils.clamp(
            easedLoad * 1.4 - index * 0.035,
            0,
            1,
          );
          return (
            <group
              key={`sprout-${index}`}
              position={[seed.x, seed.y + 0.18, seed.z]}
              scale={[reveal, reveal, reveal]}
              visible={reveal > 0.01}
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
  const points = useMemo(
    () => [
      [-2.15, 2.08, 0.02] as [number, number, number],
      [-2.15, 2.62, 0.02] as [number, number, number],
      [2.25, 2.62, 0.02] as [number, number, number],
      [2.25, 1.42, 0.02] as [number, number, number],
    ],
    [],
  );

  return (
    <>
      <Line
        visible={sealProgress > 0.005}
        points={points}
        color="#d7f5f9"
        lineWidth={7}
        transparent
        opacity={0.48 * sealProgress}
      />
      <Line
        visible={sealProgress > 0.005}
        points={points}
        color="#f3feff"
        lineWidth={2}
        transparent
        opacity={0.75 * sealProgress}
      />
    </>
  );
}

function GasFlow({ active }: { active: boolean }) {
  const particlesRef = useRef<THREE.Group>(null);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-2.15, 1.2, 0.02),
          new THREE.Vector3(-2.15, 2.58, 0.02),
          new THREE.Vector3(-0.4, 2.62, 0.02),
          new THREE.Vector3(1.55, 2.62, 0.02),
          new THREE.Vector3(2.25, 2.2, 0.02),
          new THREE.Vector3(2.25, 0.72, 0.02),
        ],
        false,
        "centripetal",
      ),
    [],
  );

  useFrame(({ clock }) => {
    if (!particlesRef.current || !active) return;
    particlesRef.current.children.forEach((child, index) => {
      const distanceProgress =
        (clock.elapsedTime * 0.18 + index / particlesRef.current!.children.length) %
        1;
      child.position.copy(curve.getPointAt(distanceProgress));
      const pulse = 0.82 + Math.sin(clock.elapsedTime * 5 + index) * 0.14;
      child.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={particlesRef} visible={active}>
      {Array.from({ length: 12 }, (_, index) => (
        <mesh key={index}>
          <sphereGeometry args={[0.052, 12, 9]} />
          <meshBasicMaterial
            color="#f6fdff"
            transparent
            opacity={0.82}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function LimewaterTube({
  sealProgress,
  testProgress,
  positive,
  bubbling,
}: {
  sealProgress: number;
  testProgress: number;
  positive: boolean;
  bubbling: boolean;
}) {
  const bubbleRef = useRef<THREE.Group>(null);
  const liquidColor = new THREE.Color("#dff9ff").lerp(
    new THREE.Color("#f8faf5"),
    positive ? testProgress : 0,
  );

  useFrame(({ clock }) => {
    if (!bubbleRef.current || !bubbling) return;
    bubbleRef.current.children.forEach((child, index) => {
      const travel = (clock.elapsedTime * 0.42 + index * 0.13) % 1;
      child.position.set(
        Math.sin(index * 2.2) * 0.16,
        0.17 + travel * 0.72,
        Math.cos(index * 1.7) * 0.13,
      );
      child.scale.setScalar(0.75 + travel * 0.45);
    });
  });

  return (
    <group position={[2.25, 0.06, 0]}>
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
      <mesh position={[0, 1.73, 0]} visible={sealProgress > 0.005}>
        <cylinderGeometry args={[0.42, 0.44, 0.2, 32]} />
        <meshStandardMaterial
          color="#3b302a"
          roughness={0.9}
          transparent
          opacity={sealProgress}
        />
      </mesh>
      <mesh position={[0, 1.37, 0]} visible={sealProgress > 0.005}>
        <cylinderGeometry args={[0.045, 0.045, 0.75, 14]} />
        <meshPhysicalMaterial
          color="#edfefe"
          transparent
          opacity={0.82 * sealProgress}
        />
      </mesh>

      <group ref={bubbleRef} visible={bubbling}>
        {Array.from({ length: 9 }, (_, index) => (
          <mesh key={index}>
            <sphereGeometry args={[0.036 + (index % 3) * 0.008, 10, 8]} />
            <meshBasicMaterial
              color="#f8ffff"
              transparent
              opacity={0.68}
              toneMapped={false}
            />
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
      <color attach="background" args={["#aebbb3"]} />
      <fog attach="fog" args={["#aebbb3", 23, 42]} />
      <ambientLight intensity={0.32} />
      <hemisphereLight args={["#ecffff", "#4b3a2e", 0.58]} />
      <directionalLight
        position={[-7.5, 10.5, 4.5]}
        intensity={1.45}
        color="#f0fff3"
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
        intensity={1.25}
        distance={11}
        decay={2}
      />

      <RespirationLabRoom />

      <group position={[0, 1.14, 0]}>
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
        <GasFlow active={gasActive} />
        <LimewaterTube
          sealProgress={sealProgress}
          testProgress={testProgress}
          positive={germinating}
          bubbling={stage === 2 && running && germinating}
        />

        <group position={[0, 0.08, -0.92]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[1.35, 0.16, 0.68]} />
            <meshStandardMaterial
              color="#315348"
              metalness={0.22}
              roughness={0.48}
            />
          </mesh>
          <mesh position={[0, 0.175, 0.01]}>
            <planeGeometry args={[0.96, 0.36]} />
            <meshStandardMaterial
              color="#0d2724"
              emissive={running ? "#2dd4bf" : "#124a43"}
              emissiveIntensity={running ? 0.42 : 0.16}
            />
          </mesh>
          <Html
            position={[0, 0.19, 0.02]}
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
        position={[0, 1.16, 0]}
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
          eyeHeight={2.85}
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
  const [showTutorial, setShowTutorial] = useState(true);
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
    if (!running || complete) return;
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
  }, [complete, running, stage]);

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
    if (mode !== "doing" || isMobileViewport) return;
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
  }, [isMobileViewport, mode]);

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

  const methodPanel = (
    <div className="space-y-2">
      {RESPIRATION_STEPS.map((label, index) => (
        <div
          key={label}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
            index < stage
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"
              : index === stage
                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                : "border-white/8 bg-white/[0.03] text-slate-500"
          }`}
        >
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black/25 font-black">
            {index < stage ? "✓" : index + 1}
          </span>
          <span className="font-bold">{label}</span>
        </div>
      ))}
    </div>
  );

  const sampleButtons = (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        disabled={stage > 0 || running}
        onClick={() => setGerminating(true)}
        className={`rounded-xl px-3 py-2 text-xs font-black ${
          germinating
            ? "bg-emerald-500 text-white"
            : "bg-white/8 text-slate-300"
        } disabled:opacity-45`}
      >
        Germinating
      </button>
      <button
        type="button"
        disabled={stage > 0 || running}
        onClick={() => setGerminating(false)}
        className={`rounded-xl px-3 py-2 text-xs font-black ${
          !germinating
            ? "bg-slate-600 text-white"
            : "bg-white/8 text-slate-300"
        } disabled:opacity-45`}
      >
        Boiled control
      </button>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      <div
        data-experiment-tour="respiration-scene"
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
            mode={mode}
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
          onModeChange={setMode}
          contextLabel={complete ? "Result ready" : `Step ${stage + 1} of 3`}
        />

        <div
          data-experiment-tour="respiration-mode-toggle"
          className="absolute right-3 top-3 z-20 hidden overflow-hidden rounded-full border border-white/15 bg-slate-950/80 text-[10px] font-black uppercase tracking-wide shadow-xl backdrop-blur sm:flex"
        >
          <button
            type="button"
            onClick={() => setMode("learning")}
            className={`px-3 py-1.5 transition-colors ${
              mode === "learning"
                ? "bg-sky-500 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Learning
          </button>
          <button
            type="button"
            onClick={() => setMode("doing")}
            className={`px-3 py-1.5 transition-colors ${
              mode === "doing"
                ? "bg-orange-500 text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Doing
          </button>
        </div>

        <div
          data-experiment-tour="respiration-result"
          className="absolute inset-x-3 top-14 z-20 rounded-2xl border border-white/12 bg-slate-950/82 p-3 shadow-xl backdrop-blur-xl sm:left-4 sm:right-auto sm:top-4 sm:w-[330px]"
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
        </div>

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

      <aside
        className={`experiment-desktop-panel experiment-violet-panel h-full w-[380px] shrink-0 flex-col gap-4 overflow-y-auto border-l border-white/10 bg-[#071017]/96 p-4 ${
          mode === "doing" ? "hidden" : "hidden sm:flex"
        }`}
      >
        <div>
          <h2 className="text-lg font-black">Respiration</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Pass gas from germinating seeds through limewater and compare the
            result with a boiled-seed control.
          </p>
        </div>

        <div
          data-experiment-tour="respiration-sample"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-3"
        >
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-300">
            Seed sample
          </div>
          {sampleButtons}
        </div>

        <div data-experiment-tour="respiration-method">{methodPanel}</div>

        <button
          type="button"
          onClick={complete ? reset : runStage}
          disabled={running}
          className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 shadow-lg disabled:bg-slate-700 disabled:text-slate-300"
        >
          {running
            ? `${Math.round(progress * 100)}% complete`
            : complete
              ? "Repeat experiment"
              : RESPIRATION_STEPS[stage]}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300"
        >
          Reset
        </button>

        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-xs text-emerald-100">
          <div className="font-black">Fair test</div>
          <p className="mt-1 leading-relaxed">
            Keep seed mass, temperature, time and limewater volume the same.
            Use fresh limewater and an airtight apparatus.
          </p>
        </div>
      </aside>

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            {
              id: "run-stage",
              label: running
                ? `${Math.round(progress * 100)}%`
                : complete
                  ? "Repeat"
                  : `Step ${stage + 1}`,
              onClick: complete ? reset : runStage,
              disabled: running,
              tone: "blue",
            },
            {
              id: "reset",
              label: "Reset",
              onClick: reset,
              tone: "dark",
            },
          ]}
          panels={[
            {
              id: "sample",
              label: "Sample",
              value: germinating ? "germinating" : "control",
              disabled: stage > 0 || running,
              content: sampleButtons,
            },
            {
              id: "method",
              label: "Method",
              value: `${Math.min(stage, 3)}/3`,
              content: methodPanel,
            },
            {
              id: "result",
              label: "Result",
              value: complete
                ? germinating
                  ? "CO₂ present"
                  : "clear"
                : "pending",
              content: (
                <div className="rounded-xl bg-white/5 p-3 text-xs font-bold">
                  {observation}
                </div>
              ),
            },
          ]}
        />
      )}

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
