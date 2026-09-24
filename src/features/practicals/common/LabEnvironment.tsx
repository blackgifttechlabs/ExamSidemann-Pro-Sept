"use client";

import { BlenderLabEnvironment, BlenderLabBench, blenderLabObstacles } from "./BlenderLabEnvironment";

import { useEffect, useMemo, type ReactNode } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { PlayerController, type PlayerBounds } from "./PlayerController";

/**
 * Shared O Level laboratory: Blender-authored scenery and workbenches, with
 * experiment-specific posters, apparatus and navigation at their existing coordinates.
 * Source asset: public/models/science-lab/science-lab.glb.
 */

export const LAB_PLAYER_BOUNDS: PlayerBounds = { minX: -14.65, maxX: 14.65, minZ: -10.65, maxZ: 10.65 };
export const LAB_PLAYER_SPAWN = new THREE.Vector3(0, 0, -8.6);
export const LAB_PLAYER_OBSTACLES: PlayerBounds[] = [
  { minX: -4.3, maxX: 4.3, minZ: -2.2, maxZ: 2.2 },
  { minX: -10.15, maxX: -7.55, minZ: 3.35, maxZ: 5.85 },
  { minX: 7.55, maxX: 10.15, minZ: 3.35, maxZ: 5.85 },
  ...blenderLabObstacles(),
];
/** Height of the central bench top surface (standing lab-bench height). */
export const BENCH_TOP_Y = 1.36;

/* ------------------------------------------------------------- canvas art */

export function makeLabPosterTexture(title: string, lines: string[], accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 820;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#f8fafc");
  gradient.addColorStop(1, "#dbe5ea");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = accent;
  context.fillRect(0, 0, canvas.width, 118);
  context.fillStyle = "#ffffff";
  context.font = "800 42px Arial";
  context.textAlign = "center";
  context.fillText(title, canvas.width / 2, 72);
  context.textAlign = "left";
  context.font = "700 29px Arial";
  lines.forEach((line, index) => {
    const y = 175 + index * 112;
    context.fillStyle = accent;
    context.beginPath();
    context.arc(58, y - 8, 14, 0, Math.PI * 2);
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
        rowY += 37;
      } else {
        row = next;
      }
    });
    context.fillText(row.trim(), 92, rowY);
  });
  context.strokeStyle = "#94a3b8";
  context.lineWidth = 8;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makePeriodicTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 620;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = "#0f172a";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f8fafc";
  context.font = "800 44px Arial";
  context.textAlign = "center";
  context.fillText("PERIODIC TABLE", canvas.width / 2, 62);

  const families = ["#f97316", "#facc15", "#22c55e", "#38bdf8", "#a78bfa", "#f472b6", "#e2e8f0"];
  const symbols = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Fe", "Cu", "Zn", "Ag", "Au", "Pb"];
  const cell = 46;
  const gap = 6;
  const startX = 40;
  const startY = 92;
  let symbolIndex = 0;
  for (let row = 0; row < 9; row += 1) {
    const cols = row < 1 ? 18 : row < 3 ? 18 : 18;
    for (let col = 0; col < cols; col += 1) {
      // Sketch a periodic-table silhouette (gaps in the first rows).
      if (row === 0 && col > 0 && col < 17) continue;
      if ((row === 1 || row === 2) && col > 1 && col < 12) continue;
      const x = startX + col * (cell + gap);
      const y = startY + row * (cell + gap);
      context.fillStyle = families[(row + col) % families.length];
      context.globalAlpha = 0.92;
      context.fillRect(x, y, cell, cell);
      context.globalAlpha = 1;
      context.strokeStyle = "rgba(15,23,42,0.7)";
      context.lineWidth = 1.5;
      context.strokeRect(x, y, cell, cell);
      context.fillStyle = "#0f172a";
      context.font = "800 18px Arial";
      context.fillText(symbols[symbolIndex % symbols.length], x + cell / 2, y + cell / 2 + 6);
      symbolIndex += 1;
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* ---------------------------------------------------------------- posters */

export function LabPoster({
  position,
  rotation = [0, Math.PI, 0],
  title,
  lines,
  accent,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  title: string;
  lines: string[];
  accent: string;
}) {
  const contentKey = lines.join("|");
  const texture = useMemo(() => makeLabPosterTexture(title, lines, accent), [accent, contentKey, title]);
  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[3.05, 3.7, 0.12]} />
        <meshStandardMaterial color="#27313b" metalness={0.42} roughness={0.32} />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[2.84, 3.48]} />
        <meshStandardMaterial map={texture} roughness={0.72} />
      </mesh>
    </group>
  );
}

function PeriodicTablePoster({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const texture = useMemo(() => makePeriodicTexture(), []);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[4.2, 2.85, 0.12]} />
        <meshStandardMaterial color="#0b1220" metalness={0.35} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[3.98, 2.6]} />
        <meshStandardMaterial map={texture} roughness={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------- furniture */

export function LabTable({
  position,
  size,
  topColor = "#f1f5f9",
  height = BENCH_TOP_Y,
}: {
  position: [number, number, number];
  size: [number, number];
  topColor?: string;
  height?: number;
}) { return <BlenderLabBench position={position} size={size} height={height} topColor={topColor} />; }

export function LabStool({ position }: { position: [number, number, number] }) {
  const seatY = 0.94;
  return (
    <group position={position}>
      {/* Cushioned seat */}
      <mesh position={[0, seatY, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.1, 28]} />
        <meshStandardMaterial color="#1f3b47" roughness={0.55} />
      </mesh>
      <mesh position={[0, seatY - 0.06, 0]}>
        <cylinderGeometry args={[0.3, 0.26, 0.05, 28]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} />
      </mesh>
      {/* Gas-lift column */}
      <mesh position={[0, seatY / 2 + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, seatY - 0.2, 16]} />
        <meshStandardMaterial color="#c7d1d5" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Foot ring */}
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.24, 0.02, 10, 28]} />
        <meshStandardMaterial color="#9aa4ad" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Splayed base */}
      {[0, 1, 2, 3, 4].map((index) => {
        const angle = (index / 5) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.2, 0.08, Math.sin(angle) * 0.2]}
            rotation={[0, -angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.34, 0.05, 0.07]} />
            <meshStandardMaterial color="#3b444d" metalness={0.6} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------------------------------------------------------- lab equipment */

function ReagentBottle({
  position,
  color = "#8a5a2b",
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.075, 0.22, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.25} transmission={0.25} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.07, 0.07, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.25} transmission={0.25} transparent opacity={0.92} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.05, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.335, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.03, 12]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0.072]}>
        <planeGeometry args={[0.09, 0.11]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
    </group>
  );
}

const BOTTLE_COLOURS = ["#8a5a2b", "#1e3a8a", "#166534", "#7f1d1d", "#a16207", "#0e7490", "#cbd5e1", "#6d28d9"];

function BottleRow({ count = 6, spacing = 0.26, y = 0 }: { count?: number; spacing?: number; y?: number }) {
  const start = -((count - 1) * spacing) / 2;
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <ReagentBottle
          key={index}
          position={[start + index * spacing, y, 0]}
          color={BOTTLE_COLOURS[index % BOTTLE_COLOURS.length]}
          scale={0.85 + (index % 3) * 0.12}
        />
      ))}
    </>
  );
}

function WallShelf({
  position,
  rotation = [0, 0, 0],
  width = 2.6,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0.13]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.06, 0.34]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
      {[-width / 2 + 0.2, width / 2 - 0.2].map((x) => (
        <mesh key={x} position={[x, -0.12, 0.06]}>
          <boxGeometry args={[0.04, 0.24, 0.16]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </mesh>
      ))}
      <group position={[0, 0.04, 0.13]}>
        <BottleRow count={Math.max(4, Math.round(width * 2.2))} spacing={0.28} />
      </group>
    </group>
  );
}

function WallCabinet({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[2.9, 1.7, 0.5]} />
        <meshStandardMaterial color="#dfe6ea" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Interior shelf + bottles */}
      <group position={[0, -0.2, 0.05]}>
        <BottleRow count={7} spacing={0.34} />
      </group>
      <group position={[0, 0.42, 0.05]}>
        <BottleRow count={7} spacing={0.34} />
      </group>
      {/* Glass doors */}
      {[-0.72, 0.72].map((x) => (
        <mesh key={x} position={[x, 0, 0.26]}>
          <boxGeometry args={[1.4, 1.62, 0.04]} />
          <meshPhysicalMaterial color="#bfe0ea" transparent opacity={0.32} transmission={0.6} roughness={0.06} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.27]}>
        <boxGeometry args={[0.05, 1.62, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} />
      </mesh>
    </group>
  );
}

function FumeCupboard({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base cabinet */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3, 1.2, 1.4]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
      {/* Worktop */}
      <mesh position={[0, 1.24, 0]} castShadow>
        <boxGeometry args={[3.05, 0.08, 1.45]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>
      {/* Back + sides of the hood */}
      <mesh position={[0, 2.9, -0.62]}>
        <boxGeometry args={[3, 3.2, 0.1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      {[-1.48, 1.48].map((x) => (
        <mesh key={x} position={[x, 2.9, 0]}>
          <boxGeometry args={[0.08, 3.2, 1.4]} />
          <meshStandardMaterial color="#dfe6ea" roughness={0.55} />
        </mesh>
      ))}
      {/* Top canopy + duct */}
      <mesh position={[0, 4.55, 0]}>
        <boxGeometry args={[3, 0.4, 1.45]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      <mesh position={[0, 5.4, -0.4]}>
        <cylinderGeometry args={[0.3, 0.3, 1.4, 20]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Raised glass sash */}
      <mesh position={[0, 3.75, 0.66]}>
        <boxGeometry args={[2.86, 1.5, 0.05]} />
        <meshPhysicalMaterial color="#bfe0ea" transparent opacity={0.28} transmission={0.65} roughness={0.05} />
      </mesh>
      <mesh position={[0, 2.98, 0.66]}>
        <boxGeometry args={[2.86, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" metalness={0.6} />
      </mesh>
      {/* Interior light */}
      <mesh position={[0, 4.28, 0.2]}>
        <boxGeometry args={[2.6, 0.06, 0.12]} />
        <meshStandardMaterial color="#fdfdf5" emissive="#f5fbff" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 4.1, 0.2]} color="#eaf6ff" intensity={0.5} distance={4} decay={2} />
      {/* Gas tap + small flask inside */}
      <mesh position={[0.9, 1.4, -0.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.22, 10]} />
        <meshStandardMaterial color="#0f766e" metalness={0.5} />
      </mesh>
      <mesh position={[-0.6, 1.42, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.28, 20]} />
        <meshPhysicalMaterial color="#cfeaf2" transparent opacity={0.4} transmission={0.6} roughness={0.1} />
      </mesh>
      <Html position={[0, 5.1, 0.6]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-white/20 bg-slate-950/85 px-2 py-0.5 text-[8px] font-black uppercase tracking-wide text-cyan-100">
          Fume cupboard
        </div>
      </Html>
    </group>
  );
}

function FireExtinguisher({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.6, 0]}>
        <planeGeometry args={[0.7, 0.9]} />
        <meshStandardMaterial color="#b91c1c" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <planeGeometry args={[0.5, 0.14]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      <group position={[0, 0.42, 0.14]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.5, 20]} />
          <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.14, 14]} />
          <meshStandardMaterial color="#111827" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.16, 0.05, 0.06]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        <mesh position={[0.14, 0.15, 0.02]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.014, 0.014, 0.4, 8]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    </group>
  );
}

function FirstAidBox({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.4, 0.16]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[0.16, 0.05]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[0.05, 0.16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.22, 0.02]}>
        <boxGeometry args={[0.18, 0.03, 0.03]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

function EyewashStation({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.9, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.2, 0.25]} castShadow>
        <cylinderGeometry args={[0.24, 0.18, 0.12, 24]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.28, 0.1]}>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} />
      </mesh>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.36, 0.16]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 14]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0.28, 0.3, 0.16]} rotation={[0, 0, 0.4]}>
        <boxGeometry args={[0.22, 0.05, 0.05]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>
    </group>
  );
}

function WallClock({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 32]} />
        <meshStandardMaterial color="#111827" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.035]}>
        <circleGeometry args={[0.37, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.09, 0.05]}>
        <boxGeometry args={[0.03, 0.2, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0.1, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.02, 0.26, 0.01]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[0, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 12]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </group>
  );
}

function Whiteboard({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[5, 2.5, 0.1]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[4.72, 2.24]} />
        <meshStandardMaterial color="#fbfdff" roughness={0.32} />
      </mesh>
      {/* Marker tray */}
      <mesh position={[0, -1.32, 0.14]}>
        <boxGeometry args={[4.7, 0.08, 0.18]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} />
      </mesh>
      {[["#dc2626", -2], ["#2563eb", -1.7], ["#16a34a", -1.4]].map(([color, x]) => (
        <mesh key={x as number} position={[x as number, -1.28, 0.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.26, 10]} />
          <meshStandardMaterial color={color as string} />
        </mesh>
      ))}
      {/* Faint scribbles */}
      <mesh position={[-1.2, 0.5, 0.065]}>
        <planeGeometry args={[1.6, 0.06]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
      <mesh position={[-0.9, 0.2, 0.065]}>
        <planeGeometry args={[2.2, 0.05]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[1.2, -0.1, 0.065]}>
        <planeGeometry args={[1.2, 0.05]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
    </group>
  );
}

function BenchSink({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Basin */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.5, 0.12, 0.42]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.32]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      {/* Swan-neck tap */}
      <mesh position={[0, 0.16, -0.22]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 12]} />
        <meshStandardMaterial color="#c7d1d5" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.3, -0.14]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 10, 20, Math.PI]} />
        <meshStandardMaterial color="#c7d1d5" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------- room */

function CeilingFixture({ position, powered = false }: { position: [number, number, number]; powered?: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3.05, 0.14, 0.72]} />
        <meshStandardMaterial color="#d4dce0" metalness={0.38} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.085, 0]}>
        <boxGeometry args={[2.75, 0.035, 0.52]} />
        <meshStandardMaterial color="#f8fdff" emissive="#e5f8ff" emissiveIntensity={1.9} toneMapped={false} />
      </mesh>
      {powered && <pointLight position={[0, -0.45, 0]} color="#e9f8ff" intensity={0.7} distance={9} decay={2} />}
    </group>
  );
}

function ExitDoor() {
  const signTexture = useMemo(() => makeLabPosterTexture("EXIT", ["Push bar", "Keep clear"], "#15803d"), []);
  useEffect(() => () => signTexture.dispose(), [signTexture]);
  return (
    <group position={[15.83, 0, -7.15]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[2.25, 4.3, 0.18]} />
        <meshStandardMaterial color="#314b58" roughness={0.58} metalness={0.18} />
      </mesh>
      <mesh position={[0, 2.15, -0.105]}>
        <boxGeometry args={[1.82, 3.86, 0.045]} />
        <meshStandardMaterial color="#58727d" roughness={0.72} />
      </mesh>
      <mesh position={[0, 1.72, -0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 1.22, 14]} />
        <meshStandardMaterial color="#c7d1d5" metalness={0.82} roughness={0.22} />
      </mesh>
      <mesh position={[0, 4.7, -0.12]}>
        <planeGeometry args={[1.5, 0.72]} />
        <meshStandardMaterial map={signTexture} emissive="#14532d" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

function LabWindow() {
  return (
    <group position={[-15.84, 5.25, -3.45]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[4.8, 2.85, 0.2]} />
        <meshStandardMaterial color="#dce7eb" roughness={0.4} metalness={0.22} />
      </mesh>
      <mesh position={[0, 0, -0.13]}>
        <planeGeometry args={[4.42, 2.48]} />
        <meshPhysicalMaterial
          color="#8ed7f0"
          emissive="#4b9dbd"
          emissiveIntensity={0.24}
          transparent
          opacity={0.56}
          transmission={0.35}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[0.1, 2.52, 0.08]} />
        <meshStandardMaterial color="#e7f0f2" metalness={0.38} />
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[4.45, 0.1, 0.08]} />
        <meshStandardMaterial color="#e7f0f2" metalness={0.38} />
      </mesh>
    </group>
  );
}

/**
 * The equipment fitted along the two walls the camera faces (the back −Z wall
 * and the left −X wall). This is what makes the room read as a real lab.
 */
function LabWallEquipment({ accentHex }: { accentHex: string }) {
  return (
    <group>
      {/* ---- Back wall (−Z, faces +Z) ---- */}
      <FumeCupboard position={[-10.2, 0, -10.9]} />
      <Whiteboard position={[-2.7, 5.1, -11.82]} />
      <PeriodicTablePoster position={[3.9, 5.55, -11.82]} />
      <WallCabinet position={[3.9, 8.4, -11.72]} />
      <WallShelf position={[-2.7, 7.4, -11.66]} width={3} />
      <WallClock position={[9.6, 9.4, -11.8]} />
      <FireExtinguisher position={[13.1, 1.7, -11.74]} />
      <LabPoster
        position={[10.2, 5.6, -11.82]}
        rotation={[0, 0, 0]}
        title="LAB SAFETY"
        lines={["Wear goggles at all times", "No food or drink in the lab", "Report all spills and breakages", "Know where the exits are"]}
        accent={accentHex}
      />

      {/* ---- Left wall (−X, faces +X) ---- */}
      <WallCabinet position={[-15.78, 8.2, 6.5]} rotation={[0, Math.PI / 2, 0]} />
      <WallShelf position={[-15.7, 5.4, 4.2]} rotation={[0, Math.PI / 2, 0]} width={3} />
      <FirstAidBox position={[-15.74, 4.6, -8.8]} rotation={[0, Math.PI / 2, 0]} />
      <FireExtinguisher position={[-15.74, 1.7, 8.6]} rotation={[0, Math.PI / 2, 0]} />
      <EyewashStation position={[-15.72, 0, 1.9]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  );
}

export function LabRoom({
  accentHex = "#0369a1",
  posterA,
  posterB,
  benchSize = [8.3, 4.4],
  benchColor = "#f1f5f9",
  children,
}: {
  accentHex?: string;
  posterA: { title: string; lines: string[] };
  posterB: { title: string; lines: string[] };
  benchSize?: [number, number];
  benchColor?: string;
  children?: ReactNode;
}) { return <group>
    <BlenderLabEnvironment />
    <LabPoster position={[-5, 4.6, 11.82]} title={posterA.title} lines={posterA.lines} accent={accentHex} />
    <LabPoster position={[5, 4.6, 11.82]} title={posterB.title} lines={posterB.lines} accent="#334155" />
    <LabTable position={[0, 0, 0]} size={benchSize} topColor={benchColor} />
    <LabTable position={[-8.85, 0, 4.6]} size={[2.8, 2.5]} />
    <LabTable position={[8.85, 0, 4.6]} size={[2.8, 2.5]} />
    <group position={[-8.85, BENCH_TOP_Y, 4.6]}><BenchSink position={[0.55, 0, -0.35]} /><BottleRow count={4} spacing={0.3} /></group>
    <group position={[8.85, BENCH_TOP_Y, 4.6]}><BottleRow count={5} spacing={0.32} /></group>
    <LabStool position={[-4.6, 0, 1.55]} /><LabStool position={[4.6, 0, 1.55]} />
    {children}
  </group>; }

/** Standard lighting rig — call once inside each scene. */
export function LabLighting() {
  return (
    <>
      <color attach="background" args={["#b6c2c6"]} />
      <fog attach="fog" args={["#b6c2c6", 30, 62]} />
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#eafaff", "#4c5860", 0.3]} />
      <directionalLight
        position={[-8, 12, 4]}
        intensity={0.85}
        color="#e8f8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={12}
        shadow-camera-bottom={-10}
        shadow-camera-near={1}
        shadow-camera-far={36}
        shadow-bias={-0.0002}
        shadow-normalBias={0.045}
      />
    </>
  );
}

/** Free-roam player used by every experiment's Play mode. */
export function LabPlayer({
  isMobile,
  moveVector,
}: {
  isMobile: boolean;
  moveVector: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <PlayerController
      bounds={LAB_PLAYER_BOUNDS}
      obstacles={LAB_PLAYER_OBSTACLES}
      spawn={LAB_PLAYER_SPAWN}
      eyeHeight={2.1}
      speed={3.25}
      isMobile={isMobile}
      enabled
      moveVector={moveVector}
      onUpdate={() => undefined}
    />
  );
}

/** A floating tag rendered in 3D space, matching the house style. */
export function LabTag({
  position,
  children,
  tone = "slate",
  distanceFactor = 8,
}: {
  position: [number, number, number];
  children: ReactNode;
  tone?: "slate" | "emerald" | "rose" | "amber" | "cyan" | "fuchsia";
  distanceFactor?: number;
}) {
  const toneClass = {
    slate: "border-white/20 bg-slate-950/90 text-white",
    emerald: "border-emerald-300/30 bg-emerald-950/90 text-emerald-100",
    rose: "border-rose-300/30 bg-rose-950/90 text-rose-100",
    amber: "border-amber-300/30 bg-amber-950/90 text-amber-100",
    cyan: "border-cyan-300/30 bg-cyan-950/90 text-cyan-100",
    fuchsia: "border-fuchsia-300/30 bg-fuchsia-950/90 text-fuchsia-100",
  }[tone];
  return (
    <Html position={position} center distanceFactor={distanceFactor} style={{ pointerEvents: "none" }}>
      <div className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${toneClass}`}>
        {children}
      </div>
    </Html>
  );
}
