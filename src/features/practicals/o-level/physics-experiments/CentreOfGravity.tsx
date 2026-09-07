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
import {
  CombinedScienceGoalCard,
  CombinedScienceHud,
  CombinedScienceObjectiveRail,
  EXPERIMENT_ACCENTS,
  type GameMission,
} from "../../common/CombinedScienceGame";

interface CentreOfGravitySimProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

const ACCENT = EXPERIMENT_ACCENTS.emerald;
const PAPER_FILENAME = "centre-of-gravity-lamina.html";

const PIN_Y = BENCH_TOP_Y + 1.62;
const LAMINA_DEPTH = 0.016;
/** Long enough for a traced line to always reach past the far edge. */
const TRACE_LENGTH = 1.8;

/** Outline of the irregular cardboard lamina, in lamina-local units. */
const OUTLINE: [number, number][] = [
  [-0.62, 0.3],
  [-0.3, 0.66],
  [0.18, 0.72],
  [0.58, 0.44],
  [0.7, -0.02],
  [0.42, -0.46],
  [-0.06, -0.62],
  [-0.48, -0.4],
  [-0.7, -0.05],
];

interface Hole {
  id: "a" | "b" | "c";
  label: string;
  point: [number, number];
}

const HOLES: Hole[] = [
  { id: "a", label: "Hole A", point: [-0.28, 0.56] },
  { id: "b", label: "Hole B", point: [0.55, 0.3] },
  { id: "c", label: "Hole C", point: [-0.03, -0.5] },
];

/** Area-weighted centroid of the outline polygon — the true centre of gravity. */
function polygonCentroid(points: [number, number][]) {
  let area = 0;
  let cx = 0;
  let cy = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [x0, y0] = points[index];
    const [x1, y1] = points[(index + 1) % points.length];
    const cross = x0 * y1 - x1 * y0;
    area += cross;
    cx += (x0 + x1) * cross;
    cy += (y0 + y1) * cross;
  }
  area *= 0.5;
  return { x: cx / (6 * area), y: cy / (6 * area), area: Math.abs(area) };
}

const CENTROID = polygonCentroid(OUTLINE);

/** Rotation that puts the centre of gravity directly below the given hole. */
function hangAngle(hole: Hole) {
  const dx = CENTROID.x - hole.point[0];
  const dy = CENTROID.y - hole.point[1];
  return -Math.PI / 2 - Math.atan2(dy, dx);
}

const COG_MISSIONS: GameMission[] = [
  {
    short: "Suspend",
    title: "Suspend the lamina",
    detail: "Hang the irregular card from a pin through a hole near its edge, and let it swing freely until it comes to rest.",
    symbol: "📌",
  },
  {
    short: "Plumb",
    title: "Hang the plumb line",
    detail: "Hang a plumb line from the same pin. When it stops swinging it marks the true vertical through the pin.",
    symbol: "🧵",
  },
  {
    short: "Trace",
    title: "Trace and repeat",
    detail: "Draw along the plumb line, then repeat from a second and third hole.",
    symbol: "✏️",
  },
  {
    short: "Find G",
    title: "Find the centre of gravity",
    detail: "The traced lines all cross at one point — that point is the centre of gravity of the lamina.",
    symbol: "🎯",
  },
];

const cogTutorialSteps: ExperimentTutorialStep[] = [
  {
    title: "Centre of gravity",
    text: "The centre of gravity is the single point through which the whole weight of a body appears to act. For an irregular shape it cannot be worked out by symmetry, so we find it experimentally.",
    mode: "modal",
  },
  {
    title: "Why suspension works",
    text: "A freely suspended body always hangs with its centre of gravity vertically below the point of suspension — otherwise its weight would create a turning moment.",
    mode: "bubble",
    selector: '[data-experiment-tour="cog-scene"]',
  },
  {
    title: "Change the hole",
    text: "Suspend the lamina from each hole in turn and let it settle before you trace.",
    mode: "bubble",
    selector: '[data-experiment-tour="cog-controls"], [data-mobile-experiment-controls="true"]',
  },
  {
    title: "Two lines are enough",
    text: "Two traced lines already cross at the centre of gravity. The third is a check that the first two were accurate.",
    mode: "bubble",
    selector: '[data-experiment-tour="goal-card"]',
  },
];

/* ------------------------------------------------------------------ 3D bits */

function useLaminaGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    OUTLINE.forEach(([x, y], index) => {
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();
    HOLES.forEach((hole) => {
      const path = new THREE.Path();
      path.absarc(hole.point[0], hole.point[1], 0.028, 0, Math.PI * 2, true);
      shape.holes.push(path);
    });
    return new THREE.ExtrudeGeometry(shape, { depth: LAMINA_DEPTH, bevelEnabled: false });
  }, []);
}

/** A pencil line drawn on the card, running from a hole through the centre of gravity. */
function TracedLine({ hole, colour }: { hole: Hole; colour: string }) {
  const dx = CENTROID.x - hole.point[0];
  const dy = CENTROID.y - hole.point[1];
  const angle = Math.atan2(dy, dx);
  const midX = hole.point[0] + (Math.cos(angle) * TRACE_LENGTH) / 2;
  const midY = hole.point[1] + (Math.sin(angle) * TRACE_LENGTH) / 2;
  return (
    <mesh position={[midX, midY, LAMINA_DEPTH + 0.002]} rotation={[0, 0, angle]}>
      <boxGeometry args={[TRACE_LENGTH, 0.009, 0.001]} />
      <meshStandardMaterial color={colour} roughness={0.8} />
    </mesh>
  );
}

function Lamina({
  hole,
  traced,
  revealed,
}: {
  hole: Hole;
  traced: Hole["id"][];
  revealed: boolean;
}) {
  const geometry = useLaminaGeometry();
  const groupRef = useRef<THREE.Group>(null);
  const velocity = useRef(0);
  const target = hangAngle(hole);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const clamped = Math.min(delta, 1 / 30);
    // A damped pendulum swing so the card settles instead of snapping into place.
    let error = target - group.rotation.z;
    error = Math.atan2(Math.sin(error), Math.cos(error));
    velocity.current += error * 34 * clamped;
    velocity.current *= Math.exp(-2.6 * clamped);
    group.rotation.z += velocity.current * clamped;
  });

  const traceColours: Record<Hole["id"], string> = { a: "#1f2937", b: "#7c2d12", c: "#134e4a" };

  return (
    <group position={[0, PIN_Y, 0]} ref={groupRef}>
      <group position={[-hole.point[0], -hole.point[1], 0]}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial color="#d9c39a" roughness={0.92} side={THREE.DoubleSide} />
        </mesh>
        {/* Ringed holes so the suspension points read clearly */}
        {HOLES.map((each) => (
          <mesh key={each.id} position={[each.point[0], each.point[1], LAMINA_DEPTH + 0.001]}>
            <ringGeometry args={[0.028, 0.04, 20]} />
            <meshStandardMaterial color={each.id === hole.id ? "#059669" : "#94a3b8"} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {traced.map((id) => {
          const tracedHole = HOLES.find((each) => each.id === id)!;
          return <TracedLine key={id} hole={tracedHole} colour={traceColours[id]} />;
        })}
        {revealed && (
          <group position={[CENTROID.x, CENTROID.y, LAMINA_DEPTH + 0.004]}>
            <mesh>
              <ringGeometry args={[0.035, 0.05, 24]} />
              <meshStandardMaterial color="#059669" side={THREE.DoubleSide} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.016, 18]} />
              <meshStandardMaterial color="#065f46" side={THREE.DoubleSide} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

function PlumbLine({ settled }: { settled: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // The bob keeps a tiny residual swing until the reading is taken.
    const swing = settled ? 0 : Math.sin(clock.elapsedTime * 4.2) * 0.05;
    groupRef.current.rotation.z = swing;
  });

  return (
    <group position={[0, PIN_Y, 0.14]} ref={groupRef}>
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 1.24, 6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>
      {/* Brass plumb bob */}
      <mesh position={[0, -1.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
        <meshStandardMaterial color="#b8860b" metalness={0.85} roughness={0.28} />
      </mesh>
      <mesh position={[0, -1.4, 0]} castShadow>
        <coneGeometry args={[0.05, 0.14, 16]} />
        <meshStandardMaterial color="#b8860b" metalness={0.85} roughness={0.28} />
      </mesh>
    </group>
  );
}

function RetortStand() {
  return (
    <group position={[0, BENCH_TOP_Y, -0.34]}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.06, 0.4]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.55} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 2.2, 14]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.28} />
      </mesh>
      {/* Boss head and horizontal rod carrying the pin */}
      <mesh position={[0, PIN_Y - BENCH_TOP_Y, 0]} castShadow>
        <boxGeometry args={[0.09, 0.1, 0.09]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, PIN_Y - BENCH_TOP_Y, 0.18]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.38, 12]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}

function CogScene({
  hole,
  traced,
  revealed,
  settled,
  mode,
  isMobile,
  moveVectorRef,
}: {
  hole: Hole;
  traced: Hole["id"][];
  revealed: boolean;
  settled: boolean;
  mode: "learning" | "doing";
  isMobile: boolean;
  moveVectorRef: MutableRefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  useEffect(() => {
    if (mode !== "learning") return;
    const position: [number, number, number] = isMobile ? [0.2, 2.9, 3.9] : [0.35, 2.78, 3.4];
    camera.position.set(...position);
    camera.lookAt(0, 2.35, 0);
    if ("fov" in camera) {
      camera.fov = isMobile ? 54 : 46;
      camera.updateProjectionMatrix();
    }
  }, [camera, isMobile, mode]);

  return (
    <>
      <LabLighting />
      <LabRoom
        accentHex="#059669"
        benchColor="#eef2f4"
        posterA={{
          title: "CENTRE OF GRAVITY",
          lines: [
            "The point where the whole weight seems to act",
            "A hanging body rests with G below the pivot",
            "Two plumb lines cross at G",
            "Low G + wide base = stable",
          ],
        }}
        posterB={{
          title: "STABILITY",
          lines: ["Stable: G rises when tilted", "Unstable: G falls when tilted", "Neutral: G stays at the same height"],
        }}
      >
        <RetortStand />
        <Lamina hole={hole} traced={traced} revealed={revealed} />
        <PlumbLine settled={settled} />
        <Html position={[0.02, PIN_Y + 0.16, 0.2]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="rounded-md border border-white/20 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
            Pin · {hole.label}
          </div>
        </Html>
        {revealed && (
          <Html position={[0.62, PIN_Y - 0.5, 0.2]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
            <div className="rounded-lg border border-emerald-300/40 bg-emerald-950/90 px-2 py-1 text-center">
              <div className="text-[8px] font-black uppercase text-emerald-200">Centre of gravity</div>
              <div className="text-[7px] font-bold text-emerald-100">where the lines cross</div>
            </div>
          </Html>
        )}
      </LabRoom>

      <ContactShadows position={[0, BENCH_TOP_Y + 0.01, 0]} opacity={0.28} scale={6} blur={2.4} far={3} frames={1} />
      {mode === "learning" ? (
        <OrbitControls makeDefault enablePan={false} target={[0, 2.35, 0]} minDistance={1.8} maxDistance={9} maxPolarAngle={1.5} />
      ) : (
        <LabPlayer isMobile={isMobile} moveVector={moveVectorRef} />
      )}
    </>
  );
}

/* ------------------------------------------------------------- 2D lab record */

/** The traced diagram the candidate has to draw up — outline, lines and the marked point. */
function LaminaDiagram({ traced, revealed }: { traced: Hole["id"][]; revealed: boolean }) {
  const scale = 88;
  const toSvg = ([x, y]: [number, number]) => `${120 + x * scale},${100 - y * scale}`;
  const traceColours: Record<Hole["id"], string> = { a: "#f8fafc", b: "#fdba74", c: "#5eead4" };

  return (
    <svg viewBox="0 0 240 190" className="w-full">
      <polygon points={OUTLINE.map(toSvg).join(" ")} fill="rgba(217,195,154,0.16)" stroke="#d9c39a" strokeWidth={1.6} />
      {traced.map((id) => {
        const hole = HOLES.find((each) => each.id === id)!;
        const dx = CENTROID.x - hole.point[0];
        const dy = CENTROID.y - hole.point[1];
        const angle = Math.atan2(dy, dx);
        const far: [number, number] = [
          hole.point[0] + Math.cos(angle) * TRACE_LENGTH,
          hole.point[1] + Math.sin(angle) * TRACE_LENGTH,
        ];
        const near: [number, number] = [
          hole.point[0] - Math.cos(angle) * 0.06,
          hole.point[1] - Math.sin(angle) * 0.06,
        ];
        return (
          <line
            key={id}
            x1={120 + near[0] * scale}
            y1={100 - near[1] * scale}
            x2={120 + far[0] * scale}
            y2={100 - far[1] * scale}
            stroke={traceColours[id]}
            strokeWidth={1.3}
            strokeDasharray="4 3"
          />
        );
      })}
      {HOLES.map((hole) => (
        <g key={hole.id}>
          <circle cx={120 + hole.point[0] * scale} cy={100 - hole.point[1] * scale} r={3.4} fill="none" stroke="#94a3b8" strokeWidth={1.2} />
          <text
            x={120 + hole.point[0] * scale + 6}
            y={100 - hole.point[1] * scale - 5}
            fill="#94a3b8"
            fontSize={8}
            fontWeight={800}
          >
            {hole.id.toUpperCase()}
          </text>
        </g>
      ))}
      {revealed && (
        <g>
          <circle cx={120 + CENTROID.x * scale} cy={100 - CENTROID.y * scale} r={6} fill="none" stroke="#10b981" strokeWidth={2} />
          <circle cx={120 + CENTROID.x * scale} cy={100 - CENTROID.y * scale} r={2} fill="#10b981" />
          <text x={120 + CENTROID.x * scale + 10} y={100 - CENTROID.y * scale + 4} fill="#6ee7b7" fontSize={10} fontWeight={900}>
            G
          </text>
        </g>
      )}
      <text x={8} y={182} fill="#64748b" fontSize={8} fontWeight={700}>
        {revealed ? "Lines intersect at G — the centre of gravity" : "Trace from two different holes to locate G"}
      </text>
    </svg>
  );
}

/* -------------------------------------------------------------------- Paper */

function CogPaper({ traced, onClose }: { traced: Hole["id"][]; onClose: () => void }) {
  return (
    <ExperimentPaperModal filename={PAPER_FILENAME} onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Locating the Centre of Gravity of an Irregular Lamina</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To find, by experiment, the point through which the whole weight of an irregularly shaped lamina acts.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>Irregular cardboard lamina with three small holes near the edge, retort stand with a horizontal rod and pin, plumb line (thread and bob), pencil, ruler.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>The lamina was suspended freely from a pin passed through hole A and allowed to come to rest.</li>
          <li>A plumb line was hung from the same pin and left until it stopped swinging.</li>
          <li>The direction of the plumb line was marked on the lamina with two pencil crosses and the line ruled in.</li>
          <li>Steps 1–3 were repeated with the lamina suspended from hole B and then hole C.</li>
          <li>The point where the ruled lines crossed was marked G.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        <p>
          Lines were traced from {traced.length || "…"} suspension point{traced.length === 1 ? "" : "s"}
          {traced.length ? ` (${traced.map((id) => id.toUpperCase()).join(", ")})` : ""}. All the ruled lines passed through a
          single point, which was marked G on the diagram below.
        </p>
        <div className="mt-3 border border-slate-400 p-4">
          <p className="text-center text-xs font-bold uppercase">Diagram of the lamina</p>
          <div className="mx-auto mt-2 max-w-[320px]">
            <svg viewBox="0 0 240 190" className="w-full">
              <polygon points={OUTLINE.map(([x, y]) => `${120 + x * 88},${100 - y * 88}`).join(" ")} fill="none" stroke="#111827" strokeWidth={1.6} />
              {traced.map((id) => {
                const hole = HOLES.find((each) => each.id === id)!;
                const angle = Math.atan2(CENTROID.y - hole.point[1], CENTROID.x - hole.point[0]);
                return (
                  <line
                    key={id}
                    x1={120 + hole.point[0] * 88}
                    y1={100 - hole.point[1] * 88}
                    x2={120 + (hole.point[0] + Math.cos(angle) * TRACE_LENGTH) * 88}
                    y2={100 - (hole.point[1] + Math.sin(angle) * TRACE_LENGTH) * 88}
                    stroke="#111827"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                );
              })}
              {HOLES.map((hole) => (
                <g key={hole.id}>
                  <circle cx={120 + hole.point[0] * 88} cy={100 - hole.point[1] * 88} r={3.2} fill="none" stroke="#111827" strokeWidth={1} />
                  <text x={120 + hole.point[0] * 88 + 6} y={100 - hole.point[1] * 88 - 5} fontSize={9} fontWeight={700}>
                    {hole.id.toUpperCase()}
                  </text>
                </g>
              ))}
              {traced.length >= 2 && (
                <g>
                  <circle cx={120 + CENTROID.x * 88} cy={100 - CENTROID.y * 88} r={5} fill="none" stroke="#111827" strokeWidth={1.6} />
                  <text x={120 + CENTROID.x * 88 + 9} y={100 - CENTROID.y * 88 + 4} fontSize={11} fontWeight={800}>
                    G
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
        <h2 className="mt-5 font-bold uppercase">Precautions</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>The holes were made near the edge so that the lamina could swing freely on the pin.</li>
          <li>The lamina and the plumb line were allowed to come completely to rest before any line was traced.</li>
          <li>Suspension points well spaced around the lamina were chosen so the ruled lines crossed at a clear angle.</li>
        </ul>
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          A freely suspended body always comes to rest with its centre of gravity vertically below the point of
          suspension. Each plumb line therefore passes through the centre of gravity, and the point where the traced
          lines intersect is the centre of gravity G of the lamina. The third line acts as a check on the first two.
        </p>
      </div>
    </ExperimentPaperModal>
  );
}

/* --------------------------------------------------------------------- Main */

export default function CentreOfGravitySim({
  showPaper,
  onClosePaper,
  tutorialRequestKey = 0,
  onRequestPaper,
  onRequestHowTo,
  onBack,
}: CentreOfGravitySimProps) {
  const [holeId, setHoleId] = useState<Hole["id"]>("a");
  const [traced, setTraced] = useState<Hole["id"][]>([]);
  const [settled, setSettled] = useState(false);
  const [mode, setMode] = useState<"learning" | "doing">("learning");
  const [showTutorial, setShowTutorial] = useState(true);
  const [demoActive, setDemoActive] = useState(false);

  const moveVectorRef = useRef({ x: 0, y: 0 });
  const settleTimer = useRef<number | null>(null);
  const demoTimers = useRef<number[]>([]);
  const isMobileViewport = useMobileExperimentViewport();

  const hole = HOLES.find((each) => each.id === holeId)!;

  useEffect(() => {
    if (tutorialRequestKey > 0) setShowTutorial(true);
  }, [tutorialRequestKey]);

  /** The card and bob need a moment to stop swinging after every change of hole. */
  useEffect(() => {
    setSettled(false);
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => setSettled(true), 1800);
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [holeId]);

  useEffect(() => () => demoTimers.current.forEach((timer) => window.clearTimeout(timer)), []);

  const revealed = traced.length >= 2;
  const complete = traced.length >= 3;
  const step = complete ? 3 : traced.length >= 1 ? 2 : settled ? 1 : 0;
  const progress = Math.min(1, traced.length / 3);
  const alreadyTraced = traced.includes(holeId);

  const traceLine = useCallback(() => {
    if (!settled || alreadyTraced) return;
    setTraced((current) => [...current, holeId]);
  }, [alreadyTraced, holeId, settled]);

  const nextHole = useCallback(() => {
    const remaining = HOLES.find((each) => !traced.includes(each.id) && each.id !== holeId);
    setHoleId(remaining ? remaining.id : HOLES[(HOLES.findIndex((each) => each.id === holeId) + 1) % HOLES.length].id);
  }, [holeId, traced]);

  const resetAll = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    setDemoActive(false);
    setTraced([]);
    setHoleId("a");
  }, []);

  const toggleDemo = useCallback(() => {
    demoTimers.current.forEach((timer) => window.clearTimeout(timer));
    demoTimers.current = [];
    if (demoActive) {
      setDemoActive(false);
      return;
    }
    setDemoActive(true);
    setTraced([]);
    setHoleId("a");
    HOLES.forEach((each, index) => {
      demoTimers.current.push(window.setTimeout(() => setHoleId(each.id), index * 3000));
      demoTimers.current.push(
        window.setTimeout(() => setTraced((current) => (current.includes(each.id) ? current : [...current, each.id])), index * 3000 + 2100),
      );
    });
    demoTimers.current.push(window.setTimeout(() => setDemoActive(false), HOLES.length * 3000));
  }, [demoActive]);

  const handleModeChange = useCallback(
    (next: "learning" | "doing") => {
      if (demoActive) return;
      setMode(next);
    },
    [demoActive],
  );

  const status = complete
    ? "All three lines cross at one point. That point is the centre of gravity of the lamina."
    : revealed
      ? "Two lines already cross at a single point. Trace from the third hole to check it."
      : traced.length === 1
        ? "One line traced. Move the pin to another hole and trace again — the lines will cross at G."
        : settled
          ? `The lamina hangs still from ${hole.label}. Trace along the plumb line.`
          : "The lamina and plumb line are still swinging — wait until they come to rest.";

  const observation = complete
    ? "Lines traced from holes A, B and C all pass through the same point, so the centre of gravity is where they intersect."
    : "A hanging body rests with its centre of gravity vertically below the point of suspension.";

  const primaryLabel = complete ? "Start again" : alreadyTraced ? "Move to the next hole" : settled ? "Trace the plumb line" : "Waiting to settle…";

  const holeControls = (
    <div data-experiment-tour="cog-controls" className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Suspension point</span>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-black ${settled ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"}`}
        >
          {settled ? "At rest" : "Swinging"}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        {HOLES.map((each) => {
          const active = each.id === holeId;
          return (
            <button
              key={each.id}
              onClick={() => setHoleId(each.id)}
              className="rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide transition"
              style={
                active
                  ? { background: ACCENT.base, color: "#04150f" }
                  : { background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }
              }
            >
              {each.label}
              <span className="mt-0.5 block text-[8px] font-bold opacity-80">{traced.includes(each.id) ? "traced" : "not traced"}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={traceLine}
        disabled={!settled || alreadyTraced}
        className="mt-2 w-full rounded-xl px-2 py-2 text-[10px] font-black uppercase tracking-wide text-slate-950 transition disabled:opacity-40"
        style={{ background: ACCENT.base }}
      >
        {alreadyTraced ? "Already traced" : "Trace the plumb line"}
      </button>
    </div>
  );

  const diagramPanel = (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wide text-slate-300">Lab record diagram</span>
        <span className="text-[10px] font-black" style={{ color: ACCENT.text }}>
          {traced.length}/3 lines
        </span>
      </div>
      <div className="mt-1.5">
        <LaminaDiagram traced={traced} revealed={revealed} />
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-slate-950 text-white">
      {!isMobileViewport && (
        <CombinedScienceHud
          title="Centre of Gravity"
          subtitle="plumb lines cross at G"
          symbol="🎯"
          accent={ACCENT}
          mode={mode}
          onModeChange={handleModeChange}
          modeDisabled={demoActive}
          onBack={onBack}
          onRequestPaper={onRequestPaper}
          onRequestHowTo={onRequestHowTo}
          badges={complete ? 4 : step}
          demoActive={demoActive}
          onDemo={toggleDemo}
        />
      )}

      <div data-experiment-tour="cog-scene" className="relative min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0.35, 2.78, 3.4], fov: 46, near: 0.05, far: 120 }} style={{ touchAction: "none" }}>
          <CogScene
            hole={hole}
            traced={traced}
            revealed={revealed}
            settled={settled}
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
            emoji="🎯"
            cornerEmoji="🧵"
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
          title="Centre of Gravity"
          tagline="plumb lines cross at G"
          missions={COG_MISSIONS}
          step={step}
          running={demoActive}
          progress={progress}
          complete={complete}
          primaryLabel={primaryLabel}
          primaryEmoji={complete ? "↺" : alreadyTraced ? "📌" : "✏️"}
          onPrimary={complete ? resetAll : alreadyTraced ? nextHole : traceLine}
          primaryDisabled={!complete && !alreadyTraced && !settled}
          onReset={resetAll}
          onDemo={toggleDemo}
          demoActive={demoActive}
          observation={observation}
          sections={[
            { id: "holes", label: "Pin", value: hole.label, content: holeControls },
            { id: "diagram", label: "Diagram", value: `${traced.length}/3`, content: diagramPanel },
          ]}
        />
      )}

      {mode === "learning" && (
        <MobileExperimentControls
          actions={[
            { id: "trace", label: "Trace", onClick: traceLine, disabled: !settled || alreadyTraced, tone: "green" },
            { id: "next", label: "Next hole", onClick: nextHole, tone: "blue" },
            { id: "reset", label: "Reset", onClick: resetAll, tone: "dark" },
          ]}
          panels={[
            { id: "holes", label: "Pin", value: hole.label, content: holeControls },
            { id: "diagram", label: "Diagram", value: `${traced.length}/3`, content: diagramPanel },
          ]}
        />
      )}

      {showPaper && <CogPaper traced={traced} onClose={onClosePaper} />}
      {showTutorial && (
        <ExperimentTutorialOverlay key={tutorialRequestKey} steps={cogTutorialSteps} onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
}
