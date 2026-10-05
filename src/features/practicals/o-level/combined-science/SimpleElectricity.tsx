import { ExperimentLabelProvider, LabLabel } from "./SimpleElectricityLabels";
"use client";
import "./electricityGuide.css";
import "./simpleElectricity.css";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ExperimentPaperModal } from "../../common/ExperimentPaper";
import { ExperimentTutorialOverlay, type ExperimentTutorialStep } from "../../common/ExperimentTutorialOverlay";

import { labSounds } from "../../../../lib/audio/labSounds";
type CircuitType = "series" | "parallel";
interface CircuitReading {
    id: string;
    circuit: CircuitType;
    bulbs: number;
    totalCurrent: number;
    bulbVoltage: number;
    brightness: number;
}
interface SimpleElectricitySimProps {
    showPaper: boolean;
    onClosePaper: () => void;
    tutorialRequestKey?: number;
    tutorialMode?: "tour" | "howto";
    onRequestPaper?: () => void;
    onRequestHowTo?: () => void;
    onBack?: () => void;
}
const BATTERY_VOLTAGE = 6;
const BULB_RESISTANCE = 6;
const WIRE_Y = 0.36;
const TOP_BUS_Z = 1.45;
const BOTTOM_BUS_Z = -1.45;
const BATTERY_X = -3.3;
const SWITCH_LEFT_X = -2.42;
const SWITCH_RIGHT_X = -1.58;
const SWITCH_X = (SWITCH_LEFT_X + SWITCH_RIGHT_X) / 2;
const electricityTutorialSteps: ExperimentTutorialStep[] = [
    {
        title: "Simple Electric Circuits",
        text: "Enter the electricity laboratory and build a circuit with a 6 V battery, switch and identical bulbs. Compare series and parallel connections.",
        mode: "modal",
    },
    {
        title: "Explore the Laboratory",
        text: "Drag to inspect the circuit and zoom to follow the leads. The camera stays in inspection view throughout the experiment.",
        mode: "bubble",
        selector: '[data-experiment-tour="electric-scene"]',
    },
    {
        title: "Choose the Arrangement",
        text: "In series there is one path for current. In parallel every bulb has its own branch across the battery.",
        mode: "bubble",
        selector: '[data-experiment-tour="electric-layout"]',
    },
    {
        title: "Add Bulbs and Close the Switch",
        text: "Choose one to three bulbs, then close the switch. Watch the glow and compare current, voltage and resistance.",
        mode: "bubble",
        selector: '[data-experiment-tour="electric-controls"], [data-mobile-experiment-controls="true"]',
    },
    {
        title: "Record Evidence",
        text: "Save readings for both arrangements. More series bulbs reduce current and brightness; parallel bulbs remain bright because each gets the full battery voltage.",
        mode: "bubble",
        selector: '[data-experiment-tour="electric-readings"]',
    },
];
function makePosterTexture(title: string, lines: string[], accent: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 820;
    const context = canvas.getContext("2d");
    if (!context)
        return new THREE.CanvasTexture(canvas);
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
    context.fillStyle = "#172033";
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
            }
            else {
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
function WallPoster({ position, title, lines, accent, }: {
    position: [
        number,
        number,
        number
    ];
    title: string;
    lines: string[];
    accent: string;
}) {
    const contentKey = lines.join("|");
    const texture = useMemo(() => makePosterTexture(title, lines, accent), [accent, contentKey, title]);
    useEffect(() => () => texture.dispose(), [texture]);
    return (<group position={position} rotation={[0, Math.PI, 0]}>
      <mesh castShadow>
        <boxGeometry args={[3.05, 3.7, 0.12]}/>
        <meshStandardMaterial color="#27313b" metalness={0.42} roughness={0.32}/>
      </mesh>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[2.84, 3.48]}/>
        <meshStandardMaterial map={texture} roughness={0.72}/>
      </mesh>
    </group>);
}
function makeTvTexture(circuit: CircuitType, bulbs: number, closed: boolean, current: number) {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 560;
    const context = canvas.getContext("2d");
    if (!context)
        return new THREE.CanvasTexture(canvas);
    context.fillStyle = "#071521";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const glow = context.createRadialGradient(720, 260, 20, 720, 260, 420);
    glow.addColorStop(0, "rgba(34,211,238,.22)");
    glow.addColorStop(1, "rgba(2,6,23,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#67e8f9";
    context.font = "800 36px Arial";
    context.fillText("CIRCUIT LAB // LIVE", 55, 62);
    context.fillStyle = "#f8fafc";
    context.font = "900 64px Arial";
    context.fillText(circuit.toUpperCase(), 55, 145);
    context.font = "700 30px Arial";
    context.fillStyle = closed ? "#86efac" : "#fda4af";
    context.fillText(closed ? "CIRCUIT CLOSED" : "SWITCH OPEN", 58, 198);
    context.fillStyle = "#cbd5e1";
    context.fillText(`${bulbs} bulb${bulbs === 1 ? "" : "s"}  •  ${current.toFixed(2)} A`, 58, 250);
    const railTop = 330;
    const railBottom = 468;
    context.strokeStyle = "#ef4444";
    context.lineWidth = 12;
    context.beginPath();
    context.moveTo(100, railTop);
    context.lineTo(890, railTop);
    context.stroke();
    context.strokeStyle = "#111827";
    context.beginPath();
    context.moveTo(100, railBottom);
    context.lineTo(890, railBottom);
    context.stroke();
    const count = Math.max(1, bulbs);
    for (let index = 0; index < count; index += 1) {
        const x = 330 + index * 205;
        if (circuit === "parallel") {
            context.strokeStyle = "#facc15";
            context.lineWidth = 8;
            context.beginPath();
            context.moveTo(x, railTop);
            context.lineTo(x, railBottom);
            context.stroke();
        }
        context.beginPath();
        context.arc(x, circuit === "parallel" ? 399 : railTop, 34, 0, Math.PI * 2);
        context.fillStyle = closed ? "#fde68a" : "#334155";
        context.fill();
        context.strokeStyle = "#f8fafc";
        context.lineWidth = 5;
        context.stroke();
    }
    context.strokeStyle = "#164e63";
    context.lineWidth = 4;
    for (let y = 0; y < canvas.height; y += 40) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
}
function WallTelevision({ circuit, bulbs, closed, current, }: {
    circuit: CircuitType;
    bulbs: number;
    closed: boolean;
    current: number;
}) {
    const texture = useMemo(() => makeTvTexture(circuit, bulbs, closed, current), [bulbs, circuit, closed, current]);
    useEffect(() => () => texture.dispose(), [texture]);
    return (<group position={[0, 5.65, 11.82]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0, -0.18]} castShadow>
        <boxGeometry args={[5.75, 3.2, 0.24]}/>
        <meshStandardMaterial color="#10151b" metalness={0.72} roughness={0.24}/>
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[5.38, 2.82]}/>
        <meshStandardMaterial map={texture} emissive="#0b4050" emissiveIntensity={0.4} toneMapped={false}/>
      </mesh>
      <mesh position={[2.62, -1.38, 0.08]}>
        <sphereGeometry args={[0.035, 12, 8]}/>
        <meshBasicMaterial color={closed ? "#22c55e" : "#ef4444"}/>
      </mesh>
      <mesh position={[0, -1.82, -0.22]} castShadow>
        <boxGeometry args={[0.46, 0.55, 0.22]}/>
        <meshStandardMaterial color="#202831" metalness={0.5}/>
      </mesh>
    </group>);
}
function CeilingFixture({ position, powered = false }: {
    position: [
        number,
        number,
        number
    ];
    powered?: boolean;
}) {
    return (<group position={position}>
      <mesh castShadow>
        <boxGeometry args={[3.05, 0.14, 0.72]}/>
        <meshStandardMaterial color="#d4dce0" metalness={0.38} roughness={0.38}/>
      </mesh>
      <mesh position={[0, -0.085, 0]}>
        <boxGeometry args={[2.75, 0.035, 0.52]}/>
        <meshStandardMaterial color="#f8fdff" emissive="#e5f8ff" emissiveIntensity={1.9} toneMapped={false}/>
      </mesh>
      {powered && <pointLight position={[0, -0.45, 0]} color="#e9f8ff" intensity={5} distance={12} decay={2}/>}
    </group>);
}
function LabTable({ position, size, topColor = "#294754", }: {
    position: [
        number,
        number,
        number
    ];
    size: [
        number,
        number
    ];
    topColor?: string;
}) { return <group position={position}><mesh position={[0, 2.54, 0]} castShadow receiveShadow><boxGeometry args={[size[0], .16, size[1]]}/><meshStandardMaterial color={topColor} roughness={.5}/></mesh>{[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}-${z}`} position={[x * (size[0] / 2 - .18), 1.25, z * (size[1] / 2 - .18)]} castShadow><boxGeometry args={[.12, 2.5, .12]}/><meshStandardMaterial color="#647078" metalness={.7} roughness={.3}/></mesh>))}</group>; }
function LabStool({ position }: {
    position: [
        number,
        number,
        number
    ];
}) {
    return (<group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.38, 0.38, 0.13, 28]}/>
        <meshStandardMaterial color="#263e4a" roughness={0.42}/>
      </mesh>
      {[0, 1, 2, 3].map((index) => {
            const angle = index * (Math.PI / 2) + Math.PI / 4;
            return (<mesh key={index} position={[Math.cos(angle) * 0.24, 0.34, Math.sin(angle) * 0.24]} rotation={[0, 0, Math.cos(angle) * 0.08]} castShadow>
            <cylinderGeometry args={[0.035, 0.045, 0.7, 10]}/>
            <meshStandardMaterial color="#303b43" metalness={0.65} roughness={0.28}/>
          </mesh>);
        })}
    </group>);
}
function Multimeter({ position }: {
    position: [
        number,
        number,
        number
    ];
}) {
    return (<group position={position} rotation={[-0.15, 0.12, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.82, 0.23, 1.18]}/>
        <meshStandardMaterial color="#e0a314" roughness={0.42}/>
      </mesh>
      <mesh position={[0, 0.13, -0.26]}>
        <boxGeometry args={[0.58, 0.025, 0.32]}/>
        <meshStandardMaterial color="#223239" emissive="#3e7778" emissiveIntensity={0.45}/>
      </mesh>
      <mesh position={[0, 0.15, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.05, 30]}/>
        <meshStandardMaterial color="#29333b" roughness={0.55}/>
      </mesh>
      {[-0.22, 0.22].map((x, index) => (<mesh key={x} position={[x, 0.15, 0.48]}>
          <cylinderGeometry args={[0.06, 0.06, 0.05, 14]}/>
          <meshStandardMaterial color={index === 0 ? "#111827" : "#dc2626"} metalness={0.3}/>
        </mesh>))}
    </group>);
}
function EquipmentTray({ position, color }: {
    position: [
        number,
        number,
        number
    ];
    color: string;
}) {
    return (<group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.55, 0.15, 1.05]}/>
        <meshStandardMaterial color="#24323b" metalness={0.38} roughness={0.45}/>
      </mesh>
      {[[0, .13, .5, 1.55, .26, .05], [0, .13, -.5, 1.55, .26, .05], [-.75, .13, 0, .05, .26, 1], [.75, .13, 0, .05, .26, 1]].map(([x, y, z, w, h, d], i) => <mesh key={`rim-${i}`} position={[x, y, z]} castShadow><boxGeometry args={[w, h, d]}/><meshStandardMaterial color="#24323b" roughness={.55}/></mesh>)}
      {Array.from({ length: 8 }, (_, index) => (<mesh key={index} position={[-0.52 + (index % 4) * 0.34, 0.16, -0.22 + Math.floor(index / 4) * 0.42]} rotation={[0, index * 0.7, Math.PI / 2]} castShadow>
          <torusGeometry args={[0.12, 0.028, 8, 20]}/>
          <meshStandardMaterial color={color} roughness={0.62}/>
        </mesh>))}
    </group>);
}
function ExitDoor() {
    const signTexture = useMemo(() => makePosterTexture("EXIT", ["Push bar", "Keep clear"], "#15803d"), []);
    useEffect(() => () => signTexture.dispose(), [signTexture]);
    return (<group position={[14.84, 0, -7.15]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 2.15, 0]} castShadow>
        <boxGeometry args={[2.25, 4.3, 0.18]}/>
        <meshStandardMaterial color="#314b58" roughness={0.58} metalness={0.18}/>
      </mesh>
      <mesh position={[0, 2.15, -0.105]}>
        <boxGeometry args={[1.82, 3.86, 0.045]}/>
        <meshStandardMaterial color="#58727d" roughness={0.72}/>
      </mesh>
      <mesh position={[0, 1.72, -0.15]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 1.22, 14]}/>
        <meshStandardMaterial color="#c7d1d5" metalness={0.82} roughness={0.22}/>
      </mesh>
      <mesh position={[0, 4.7, -0.12]}>
        <planeGeometry args={[1.5, 0.72]}/>
        <meshStandardMaterial map={signTexture} emissive="#14532d" emissiveIntensity={0.6}/>
      </mesh>
      <mesh position={[0.73, 2.45, -0.17]}>
        <sphereGeometry args={[0.085, 18, 12]}/>
        <meshStandardMaterial color="#d8b86a" metalness={0.8} roughness={0.22}/>
      </mesh>
    </group>);
}
function LabWindow() {
    return (<group position={[-14.84, 5.25, -3.45]} rotation={[0, Math.PI / 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[4.8, 2.85, 0.2]}/>
        <meshStandardMaterial color="#dce7eb" roughness={0.4} metalness={0.22}/>
      </mesh>
      <mesh position={[0, 0, -0.13]}>
        <planeGeometry args={[4.42, 2.48]}/>
        <meshPhysicalMaterial color="#8ed7f0" emissive="#4b9dbd" emissiveIntensity={0.24} transparent opacity={0.56} transmission={0.35} roughness={0.08} side={THREE.DoubleSide}/>
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[0.1, 2.52, 0.08]}/>
        <meshStandardMaterial color="#e7f0f2" metalness={0.38}/>
      </mesh>
      <mesh position={[0, 0, -0.17]}>
        <boxGeometry args={[4.45, 0.1, 0.08]}/>
        <meshStandardMaterial color="#e7f0f2" metalness={0.38}/>
      </mesh>
      <mesh position={[-1.45, -0.3, -0.21]}>
        <coneGeometry args={[0.62, 1.45, 8]}/>
        <meshStandardMaterial color="#356b47" roughness={0.92}/>
      </mesh>
      <mesh position={[1.25, -0.38, -0.2]}>
        <coneGeometry args={[0.52, 1.25, 8]}/>
        <meshStandardMaterial color="#4b7a51" roughness={0.92}/>
      </mesh>
    </group>);
}
function LaboratoryRoom({ circuit, bulbs, closed, current, }: {
    circuit: CircuitType;
    bulbs: number;
    closed: boolean;
    current: number;
}) {
    return <group><group name="Expanded electricity laboratory architecture" scale={[1.25, 2, 1.5]}><mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[30, 24]}/><meshStandardMaterial color="#303a43" roughness={.85}/></mesh>{[[0, 4, 12, 30, 8, .2], [-15, 4, 0, .2, 8, 24], [15, 4, 0, .2, 8, 24], [0, 4, -12, 30, 8, .2]].map(([x, y, z, w, h, d], i) => <mesh key={i} position={[x, y, z]} receiveShadow><boxGeometry args={[w, h, d]}/><meshStandardMaterial color={i === 0 ? "#465662" : "#3e4b56"} roughness={.9}/></mesh>)}<LabWindow /><ExitDoor /><CeilingFixture position={[-5, 7, -2]} powered/><CeilingFixture position={[5, 7, 2]} powered/>
    <WallTelevision circuit={circuit} bulbs={bulbs} closed={closed} current={current}/>
    <WallPoster position={[-10.35, 5.65, 11.82]} title="LAB RULES" accent="#0369a1" lines={[
            "Switch off before changing connections",
            "Use dry hands and insulated leads",
            "Report damaged wires immediately",
            "Keep aisles and the exit clear",
            "Never short-circuit the battery",
        ]}/>
    <WallPoster position={[7.65, 5.65, 11.82]} title="CIRCUIT RULES" accent="#b45309" lines={[
            "Series: current is the same everywhere",
            "Series: supply voltage is shared",
            "Parallel: each branch gets full voltage",
            "Parallel: branch currents add",
            "Resistance controls current",
        ]}/>
    <mesh position={[0, 8, 0]}><boxGeometry args={[30, .2, 24]} /><meshStandardMaterial color="#3e4b56" roughness={.9} /></mesh>
    </group>
    <LabTable position={[0, 0, 0]} size={[8.3, 4.4]} topColor="#284a58"/>
    <LabTable position={[-8.85, 0, 4.6]} size={[2.6, 2.5]} topColor="#365462"/>
    <LabTable position={[8.85, 0, 4.6]} size={[2.6, 2.5]} topColor="#365462"/>
    <LabTable position={[-8.85, 0, -4.6]} size={[2.4, 2.5]} topColor="#405a64"/>
    <Multimeter position={[-8.85, 2.72, 4.6]}/>
    <EquipmentTray position={[8.85, 2.68, 4.6]} color="#dc2626"/>
    <EquipmentTray position={[-8.85, 2.68, -4.6]} color="#2563eb"/>
    <LabStool position={[-4.8, 0, 1.35]}/>
    <LabStool position={[4.8, 0, 1.35]}/>
    <LabStool position={[-4.8, 0, -1.35]}/>
    <LabStool position={[4.8, 0, -1.35]}/>
    <LabStool position={[-8.85, 0, 6.35]}/>
    <LabStool position={[8.85, 0, 6.35]}/></group>;
}
function Battery() {
    return (<group position={[BATTERY_X, 0.25, 0]}>
      <mesh position={[0, -0.08, 0]} castShadow>
        <boxGeometry args={[1.05, 0.2, 1.65]}/>
        <meshStandardMaterial color="#111820" roughness={0.42} metalness={0.38}/>
      </mesh>
      <mesh castShadow>
        <boxGeometry args={[0.92, 0.72, 1.5]}/>
        <meshStandardMaterial color="#26333d" roughness={0.34} metalness={0.18}/>
      </mesh>
      <mesh position={[0, 0.37, 0]}>
        <boxGeometry args={[0.72, 0.09, 1.18]}/>
        <meshStandardMaterial color="#0e151b" roughness={0.5}/>
      </mesh>
      {[-0.5, 0.5].map((z, index) => (<group key={z} position={[0, 0.49, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.115, 0.14, 0.24, 24]}/>
            <meshStandardMaterial color={index === 0 ? "#1f2937" : "#d53c36"} metalness={0.6} roughness={0.28}/>
          </mesh>
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.08, 20]}/>
            <meshStandardMaterial color="#d6b261" metalness={0.88} roughness={0.18}/>
          </mesh>
        </group>))}
      <LabLabel position={[0.47, 0.18, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="rounded border border-white/20 bg-slate-950/92 px-2 py-1 text-[9px] font-black text-white">
          6 V DC
        </div>
      </LabLabel>
      <LabLabel position={[0, 0.72, 0.5]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="text-xs font-black text-red-300">+</div>
      </LabLabel>
      <LabLabel position={[0, 0.72, -0.5]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="text-xs font-black text-slate-200">−</div>
      </LabLabel>
    </group>);
}
function CircuitSwitch({ closed }: {
    closed: boolean;
}) {
    return (<group position={[SWITCH_X, 0.09, TOP_BUS_Z]}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.16, 0.7]}/>
        <meshStandardMaterial color="#e7dfc8" roughness={0.62}/>
      </mesh>
      {[-0.42, 0.42].map((x) => (<group key={x} position={[x, 0.17, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.11, 0.12, 0.18, 20]}/>
            <meshStandardMaterial color="#b98a3d" metalness={0.82} roughness={0.2}/>
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.1, 18, 12]}/>
            <meshStandardMaterial color="#d5b56a" metalness={0.84} roughness={0.18}/>
          </mesh>
        </group>))}
      <group position={[-0.42, 0.32, 0]} rotation={[0, 0, closed ? 0 : 0.62]}>
        <mesh position={[0.42, 0, 0]} castShadow>
          <boxGeometry args={[0.84, 0.075, 0.12]}/>
          <meshStandardMaterial color="#c69b50" metalness={0.88} roughness={0.16}/>
        </mesh>
        <mesh position={[0.1, 0.08, 0]}>
          <boxGeometry args={[0.18, 0.12, 0.2]}/>
          <meshStandardMaterial color="#5e3520" roughness={0.48}/>
        </mesh>
      </group>
      <LabLabel position={[0, 0.18, 0.58]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className={`whitespace-nowrap rounded-full border px-2 py-1 text-[8px] font-black uppercase ${closed ? "border-emerald-300/30 bg-emerald-950/90 text-emerald-200" : "border-rose-300/30 bg-rose-950/90 text-rose-200"}`}>
          {closed ? "Closed" : "Open"}
        </div>
      </LabLabel>
    </group>);
}
function Bulb({ position, brightness, index, axis, }: {
    position: [
        number,
        number,
        number
    ];
    brightness: number;
    index: number;
    axis: "x" | "z";
}) {
    const [glow, setGlow] = useState(0);
    useFrame((_, delta) => {
        const target = THREE.MathUtils.clamp(brightness, 0, 1);
        setGlow(previous => Math.abs(previous - target) < .001 ? target : THREE.MathUtils.lerp(previous, target, 1 - Math.exp(-Math.min(delta, .05) * 12)));
    });
    const filamentColor = new THREE.Color("#6b371d").lerp(new THREE.Color("#fff4a6"), glow);
    const filamentPoints = Array.from({ length: 17 }, (_, pointIndex) => {
        const t = pointIndex / 16;
        return [
            -0.16 + t * 0.32,
            0.83 + Math.sin(t * Math.PI * 8) * 0.035,
            Math.cos(t * Math.PI * 8) * 0.025,
        ] as [
            number,
            number,
            number
        ];
    });
    const terminalA: [
        number,
        number,
        number
    ] = axis === "x" ? [-0.36, 0.15, 0] : [0, 0.15, 0.36];
    const terminalB: [
        number,
        number,
        number
    ] = axis === "x" ? [0.36, 0.15, 0] : [0, 0.15, -0.36];
    return (<group position={position}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.46, 0.23, 36]}/>
        <meshStandardMaterial color="#e3ded0" roughness={0.68}/>
      </mesh>
      {[terminalA, terminalB].map((terminal, terminalIndex) => (<mesh key={terminalIndex} position={terminal} castShadow>
          <cylinderGeometry args={[0.075, 0.085, 0.16, 18]}/>
          <meshStandardMaterial color="#c3974e" metalness={0.82} roughness={0.2}/>
        </mesh>))}
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.29, 0.42, 32]}/>
        <meshStandardMaterial color="#aaa89f" metalness={0.72} roughness={0.28}/>
      </mesh>
      {[0.24, 0.31, 0.38, 0.45].map((y) => (<mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.27, 0.018, 8, 30]}/>
          <meshStandardMaterial color="#c2bba9" metalness={0.75} roughness={0.24}/>
        </mesh>))}
      <mesh position={[0, 0.83, 0]} renderOrder={25} castShadow>
        <sphereGeometry args={[0.48, 48, 34]}/>
        <meshPhysicalMaterial color={glow > 0 ? "#fff5c2" : "#d7e5e7"} emissive={glow > 0 ? "#ffb735" : "#000000"} emissiveIntensity={glow * 2} transparent opacity={0.34 + glow * 0.25} transmission={0.55} thickness={0.08} roughness={0.06} depthWrite={false}/>
      </mesh>
      <mesh position={[0, 0.59, 0]} renderOrder={24}>
        <cylinderGeometry args={[0.22, 0.19, 0.34, 28, 1, true]}/>
        <meshPhysicalMaterial color="#e9f5f6" transparent opacity={1} transmission={0.94} side={THREE.DoubleSide} depthWrite={false}/>
      </mesh>
      <Line points={[terminalA, [-0.12, 0.76, 0]]} color="#5b4739" lineWidth={1.5}/>
      <Line points={[terminalB, [0.12, 0.76, 0]]} color="#5b4739" lineWidth={1.5}/>
      <Line points={filamentPoints} color={filamentColor} lineWidth={glow > 0 ? 3.2 : 1.8}/>
      {glow > 0 && (<pointLight position={[0, 0.88, 0]} color="#ffd866" intensity={0.5 + glow * 1.7} distance={3.1} decay={2}/>)}
      <LabLabel position={[0, 1.42, 0]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="grid h-5 w-5 place-items-center rounded-full border border-white/20 bg-slate-950/90 text-[9px] font-black text-white">
          {index + 1}
        </div>
      </LabLabel>
    </group>);
}
function WireSegment({ start, end, color, }: {
    start: THREE.Vector3;
    end: THREE.Vector3;
    color: string;
}) {
    const midpoint = useMemo(() => start.clone().add(end).multiplyScalar(0.5), [end, start]);
    const length = useMemo(() => start.distanceTo(end), [end, start]);
    const quaternion = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize()), [end, start]);
    return (<mesh position={midpoint} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[0.038, 0.038, length, 12]}/>
      <meshStandardMaterial color={color} roughness={0.48} metalness={0.14}/>
    </mesh>);
}
function VolumetricWire({ points, color }: {
    points: THREE.Vector3[];
    color: string;
}) {
    const geometry = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(points, false, "centripetal");
        return new THREE.TubeGeometry(curve, Math.max(24, points.length * 16), .032, 10, false);
    }, [points]);
    useEffect(() => () => geometry.dispose(), [geometry]);
    return <mesh geometry={geometry} castShadow><meshStandardMaterial color={color} roughness={.6} metalness={.05}/></mesh>;
}
const point = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
function seriesBulbPositions(bulbs: number) {
    if (bulbs === 1)
        return [0.72];
    if (bulbs === 2)
        return [0.15, 1.72];
    return [-0.08, 1.18, 2.42];
}
function parallelBulbPositions(bulbs: number) {
    return [-0.05, 1.2, 2.45].slice(0, bulbs);
}
function CircuitWires({ circuit, bulbs }: {
    circuit: CircuitType;
    bulbs: number;
}) {
    const commonPositive = [
        point(BATTERY_X, WIRE_Y, 0.5),
        point(BATTERY_X, WIRE_Y, TOP_BUS_Z),
        point(SWITCH_LEFT_X, WIRE_Y, TOP_BUS_Z),
    ];
    const commonNegative = [
        point(BATTERY_X, WIRE_Y, BOTTOM_BUS_Z),
        point(BATTERY_X, WIRE_Y, -0.5),
    ];
    if (circuit === "series") {
        const positions = seriesBulbPositions(bulbs);
        const redSections: THREE.Vector3[][] = [];
        let previousX = SWITCH_RIGHT_X;
        positions.forEach((x) => {
            redSections.push([
                point(previousX, WIRE_Y, TOP_BUS_Z),
                point(x - 0.36, WIRE_Y, TOP_BUS_Z),
            ]);
            previousX = x + 0.36;
        });
        const returnWire = [
            point(previousX, WIRE_Y, TOP_BUS_Z),
            point(3.15, WIRE_Y, TOP_BUS_Z),
            point(3.15, WIRE_Y, BOTTOM_BUS_Z),
            point(BATTERY_X, WIRE_Y, BOTTOM_BUS_Z),
        ];
        return (<>
        <VolumetricWire points={commonPositive} color="#d9423a"/>
        {redSections.map((section, index) => (<VolumetricWire key={index} points={section} color="#d9423a"/>))}
        <VolumetricWire points={returnWire} color="#17212b"/>
        <VolumetricWire points={commonNegative} color="#17212b"/>
      </>);
    }
    const branches = parallelBulbPositions(bulbs);
    return (<>
      <VolumetricWire points={commonPositive} color="#d9423a"/>
      <VolumetricWire points={[
            point(SWITCH_RIGHT_X, WIRE_Y, TOP_BUS_Z),
            point(3.15, WIRE_Y, TOP_BUS_Z),
        ]} color="#d9423a"/>
      <VolumetricWire points={[
            point(3.15, WIRE_Y, BOTTOM_BUS_Z),
            point(BATTERY_X, WIRE_Y, BOTTOM_BUS_Z),
        ]} color="#17212b"/>
      <VolumetricWire points={commonNegative} color="#17212b"/>
      {branches.map((x) => (<group key={x}>
          <VolumetricWire points={[
                point(x, WIRE_Y, TOP_BUS_Z),
                point(x, WIRE_Y, 0.36),
            ]} color="#e2ad1a"/>
          <VolumetricWire points={[
                point(x, WIRE_Y, -0.36),
                point(x, WIRE_Y, BOTTOM_BUS_Z),
            ]} color="#246aa3"/>
        </group>))}
    </>);
}
interface PathMetric {
    points: THREE.Vector3[];
    segmentLengths: number[];
    cumulative: number[];
    total: number;
}
function makeClosedPathMetric(points: THREE.Vector3[]): PathMetric {
    const segmentLengths = points.map((start, index) => start.distanceTo(points[(index + 1) % points.length]));
    const cumulative = [0];
    segmentLengths.forEach((length) => cumulative.push(cumulative[cumulative.length - 1] + length));
    return { points, segmentLengths, cumulative, total: cumulative[cumulative.length - 1] };
}
function sampleClosedPath(metric: PathMetric, distance: number, target: THREE.Vector3) {
    const wrapped = ((distance % metric.total) + metric.total) % metric.total;
    let segmentIndex = 0;
    while (segmentIndex < metric.segmentLengths.length - 1 &&
        metric.cumulative[segmentIndex + 1] <= wrapped) {
        segmentIndex += 1;
    }
    const segmentLength = Math.max(metric.segmentLengths[segmentIndex], 0.0001);
    const local = (wrapped - metric.cumulative[segmentIndex]) / segmentLength;
    return target
        .copy(metric.points[segmentIndex])
        .lerp(metric.points[(segmentIndex + 1) % metric.points.length], local);
}
function makeChargePaths(circuit: CircuitType, bulbs: number) {
    const positive = point(BATTERY_X, WIRE_Y + 0.08, 0.5);
    const negative = point(BATTERY_X, WIRE_Y + 0.08, -0.5);
    const start = [
        positive,
        point(BATTERY_X, WIRE_Y + 0.08, TOP_BUS_Z),
        point(SWITCH_LEFT_X, WIRE_Y + 0.08, TOP_BUS_Z),
        point(SWITCH_RIGHT_X, WIRE_Y + 0.08, TOP_BUS_Z),
    ];
    if (circuit === "series") {
        const path = [...start];
        seriesBulbPositions(bulbs).forEach((x) => {
            path.push(point(x - 0.36, WIRE_Y + 0.08, TOP_BUS_Z), point(x - 0.14, WIRE_Y + 0.3, TOP_BUS_Z), point(x, WIRE_Y + 0.69, TOP_BUS_Z), point(x + 0.14, WIRE_Y + 0.3, TOP_BUS_Z), point(x + 0.36, WIRE_Y + 0.08, TOP_BUS_Z));
        });
        path.push(point(3.15, WIRE_Y + 0.08, TOP_BUS_Z), point(3.15, WIRE_Y + 0.08, BOTTOM_BUS_Z), point(BATTERY_X, WIRE_Y + 0.08, BOTTOM_BUS_Z), negative);
        return [path];
    }
    return parallelBulbPositions(bulbs).map((x) => [
        ...start,
        point(x, WIRE_Y + 0.08, TOP_BUS_Z),
        point(x, WIRE_Y + 0.08, 0.36),
        point(x, WIRE_Y + 0.3, 0.14),
        point(x, WIRE_Y + 0.69, 0),
        point(x, WIRE_Y + 0.3, -0.14),
        point(x, WIRE_Y + 0.08, -0.36),
        point(x, WIRE_Y + 0.08, BOTTOM_BUS_Z),
        point(BATTERY_X, WIRE_Y + 0.08, BOTTOM_BUS_Z),
        negative,
    ]);
}
function ChargeFlow({ closed, speed, circuit, bulbs, }: {
    closed: boolean;
    speed: number;
    circuit: CircuitType;
    bulbs: number;
}) {
    const chargesRef = useRef<THREE.Group>(null);
    const travelledRef = useRef(0);
    const sampleRef = useRef(new THREE.Vector3());
    const metrics = useMemo(() => makeChargePaths(circuit, bulbs).map(makeClosedPathMetric), [bulbs, circuit]);
    const descriptors = useMemo(() => metrics.flatMap((metric, pathIndex) => {
        const count = circuit === "series" ? 16 : 7;
        return Array.from({ length: count }, (_, particleIndex) => ({
            pathIndex,
            offset: (particleIndex / count) * metric.total,
        }));
    }), [circuit, metrics]);
    useEffect(() => {
        travelledRef.current = 0;
    }, [bulbs, circuit]);
    useFrame((_, delta) => {
        if (!chargesRef.current || !closed)
            return;
        const unitsPerSecond = speed * 1.64;
        travelledRef.current += delta * unitsPerSecond;
        chargesRef.current.children.forEach((child, index) => {
            const descriptor = descriptors[index];
            const metric = metrics[descriptor.pathIndex];
            sampleClosedPath(metric, travelledRef.current + descriptor.offset, sampleRef.current);
            child.position.copy(sampleRef.current);
        });
    });
    return (<group ref={chargesRef} visible={closed}>
      {descriptors.map((descriptor, index) => (<mesh key={`${descriptor.pathIndex}-${index}`}>
          <sphereGeometry args={[0.055, 14, 10]}/>
          <meshStandardMaterial color="#8ff7ff" emissive="#22d3ee" emissiveIntensity={2.2} toneMapped={false}/>
        </mesh>))}
    </group>);
}
function ElectricityScene({ circuit, bulbs, closed, brightness, totalCurrent, branchCurrent, mode, isMobile, moveVectorRef, }: {
    circuit: CircuitType;
    bulbs: number;
    closed: boolean;
    brightness: number;
    totalCurrent: number;
    branchCurrent: number;
    mode: "learning" | "doing";
    isMobile: boolean;
    moveVectorRef: MutableRefObject<{
        x: number;
        y: number;
    }>;
}) {
    const benchLightTarget=useMemo(()=>{const target=new THREE.Object3D();target.position.set(0,2.68,0);return target;},[]);
  const seriesX = seriesBulbPositions(bulbs);
    const parallelX = parallelBulbPositions(bulbs);
    const { camera } = useThree();
    useEffect(() => {
        if (mode !== "learning")
            return;
        const position: [
            number,
            number,
            number
        ] = isMobile ? [6.8, 7.4, 9.2] : [8.2, 7.2, 10.8];
        camera.position.set(...position);
        camera.lookAt(0, 2.8, 0);
        if ("fov" in camera) {
            camera.fov = isMobile ? 54 : 50;
            camera.near = 0.1;
            camera.far = 110;
            camera.updateProjectionMatrix();
        }
    }, [camera, isMobile, mode]);
    return (<>
      <color attach="background" args={["#3d4b57"]}/>
      <fog attach="fog" args={["#3d4b57", 20, 38]}/>
      <primitive object={benchLightTarget}/><spotLight position={[0,7.2,0.8]} target={benchLightTarget} intensity={125} distance={13} angle={0.72} penumbra={0.85} color="#fff5e6" castShadow/>
      <ambientLight intensity={0.3}/>
      <hemisphereLight args={["#eafaff", "#26303a", 0.5]}/>
      <directionalLight position={[-8, 10, -3]} intensity={1.8} color="#f5fbff" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-camera-near={1} shadow-camera-far={32} shadow-bias={-0.0002}/>
      <pointLight position={[-8.7, 4.1, -2.1]} color="#8edcff" intensity={1.4} distance={11} decay={2}/>

      <LaboratoryRoom circuit={circuit} bulbs={bulbs} closed={closed} current={closed ? totalCurrent : 0}/>

      <group position={[0, 2.64, 0]}>
        <mesh position={[0, 0.035, 0]} receiveShadow>
          <boxGeometry args={[7.55, 0.07, 3.65]}/>
          <meshStandardMaterial color="#495966" roughness={0.34} metalness={0.12}/>
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[7.25, 0.035, 3.35]}/>
          <meshStandardMaterial color="#5b6b74" roughness={0.58}/>
        </mesh>
        <CircuitWires circuit={circuit} bulbs={bulbs}/>
        <Battery />
        <CircuitSwitch closed={closed}/>
        {circuit === "series"
            ? seriesX.map((x, index) => (<Bulb key={x} position={[x, 0.08, TOP_BUS_Z]} brightness={closed ? brightness : 0} index={index} axis="x"/>))
            : parallelX.map((x, index) => (<Bulb key={x} position={[x, 0.08, 0]} brightness={closed ? brightness : 0} index={index} axis="z"/>))}
        <ChargeFlow closed={closed} speed={branchCurrent} circuit={circuit} bulbs={bulbs}/>
        <LabLabel position={[0, 0.16, -1.84]} center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-full border border-cyan-200/25 bg-slate-950/90 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-cyan-100">
            {circuit === "series" ? "One continuous path · series" : `${bulbs} independent branch${bulbs === 1 ? "" : "es"} · parallel`}
          </div>
        </LabLabel>
      </group>

      <ContactShadows position={[0, 2.76, 0]} opacity={0.36} scale={9} blur={2.2} far={3} frames={1}/>
      <OrbitControls makeDefault enablePan={false} target={[0, 2.8, 0]} minDistance={5.5} maxDistance={14} minPolarAngle={0.4} maxPolarAngle={1.42}/>

    </>);
}
function ElectricityPaper({ readings, circuit, bulbs, onClose, }: {
    readings: CircuitReading[];
    circuit: CircuitType;
    bulbs: number;
    onClose: () => void;
}) {
    return (<ExperimentPaperModal filename="simple-electricity-series-parallel.html" onClose={onClose}>
      <div className="px-8 py-8 font-serif leading-relaxed sm:px-12">
        <h1 className="text-center text-xl font-bold uppercase">Series and Parallel Circuits</h1>
        <h2 className="mt-6 font-bold uppercase">Aim</h2>
        <p>To investigate how circuit arrangement and the number of identical bulbs affect current and brightness.</p>
        <h2 className="mt-5 font-bold uppercase">Apparatus</h2>
        <p>6 V battery, switch, connecting wires and three identical 6 Ω bulbs.</p>
        <h2 className="mt-5 font-bold uppercase">Method</h2>
        <ol className="list-decimal space-y-1 pl-6">
          <li>A complete circuit was assembled with one bulb and the switch was closed.</li>
          <li>The current, voltage across each bulb and relative brightness were recorded.</li>
          <li>More bulbs were added in series and the observations were repeated.</li>
          <li>The bulbs were then connected in parallel and the same measurements were compared.</li>
        </ol>
        <h2 className="mt-5 font-bold uppercase">Results</h2>
        {readings.length > 0 ? (<table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-400 p-2">Circuit</th>
                <th className="border border-slate-400 p-2">Bulbs</th>
                <th className="border border-slate-400 p-2">Total current / A</th>
                <th className="border border-slate-400 p-2">Voltage per bulb / V</th>
                <th className="border border-slate-400 p-2">Brightness / %</th>
              </tr>
            </thead>
            <tbody>
              {readings.map((reading) => (<tr key={reading.id}>
                  <td className="border border-slate-400 p-2 capitalize">{reading.circuit}</td>
                  <td className="border border-slate-400 p-2 text-center">{reading.bulbs}</td>
                  <td className="border border-slate-400 p-2 text-center">{reading.totalCurrent.toFixed(2)}</td>
                  <td className="border border-slate-400 p-2 text-center">{reading.bulbVoltage.toFixed(2)}</td>
                  <td className="border border-slate-400 p-2 text-center">{reading.brightness}</td>
                </tr>))}
            </tbody>
          </table>) : (<p>No readings have been saved yet. The current setup is {bulbs} bulb{bulbs === 1 ? "" : "s"} in {circuit}.</p>)}
        <h2 className="mt-5 font-bold uppercase">Conclusion</h2>
        <p>
          Adding bulbs in series increases total resistance, so current decreases and the bulbs become dimmer.
          In parallel, each bulb receives the full battery voltage and remains bright; adding branches increases
          the total current supplied by the battery.
        </p>
      </div>
    </ExperimentPaperModal>);
}
export default function SimpleElectricitySim({ showPaper, onClosePaper, tutorialRequestKey = 0, onRequestPaper, onRequestHowTo, onBack, }: SimpleElectricitySimProps) {
    const [circuit, setCircuit] = useState<CircuitType>("series");
    const [bulbs, setBulbs] = useState(1);
    const [closed, setClosed] = useState(false);
    const [readings, setReadings] = useState<CircuitReading[]>([]);
    const [showTutorial, setShowTutorial] = useState(false);
    const mode = "learning" as const;
    const [selectedMode, setSelectedMode] = useState<"see" | "learn" | null>(null);
    const [guideStep, setGuideStep] = useState(0);
    const [demoActive, setDemoActive] = useState(false);
    const [demoIndex, setDemoIndex] = useState(0);
    const [changeSubtitle, setChangeSubtitle] = useState("");
    useEffect(() => {
        if (!changeSubtitle) return;
        const timer = window.setTimeout(() => setChangeSubtitle(""), 3000);
        return () => window.clearTimeout(timer);
    }, [changeSubtitle]);
    const moveVectorRef = useRef({ x: 0, y: 0 });
    const isMobileViewport = useMobileExperimentViewport();
    useEffect(() => {
        if (tutorialRequestKey > 0)
            setShowTutorial(true);
    }, [tutorialRequestKey]);
    const measurements = useMemo(() => {
        if (circuit === "series") {
            const totalResistance = BULB_RESISTANCE * bulbs;
            const totalCurrent = BATTERY_VOLTAGE / totalResistance;
            const bulbVoltage = BATTERY_VOLTAGE / bulbs;
            const brightness = Math.round(100 / (bulbs * bulbs));
            return {
                totalResistance,
                totalCurrent,
                branchCurrent: totalCurrent,
                bulbVoltage,
                brightness,
                visualBrightness: brightness / 100,
            };
        }
        const totalResistance = BULB_RESISTANCE / bulbs;
        const branchCurrent = BATTERY_VOLTAGE / BULB_RESISTANCE;
        const totalCurrent = branchCurrent * bulbs;
        return {
            totalResistance,
            totalCurrent,
            branchCurrent,
            bulbVoltage: BATTERY_VOLTAGE,
            brightness: 100,
            visualBrightness: 1,
        };
    }, [bulbs, circuit]);
    const chooseCircuit = useCallback((next: CircuitType) => {
        setClosed(false);
        setCircuit(next);
        setChangeSubtitle(`Now changing to ${next} with ${bulbs} bulb${bulbs === 1 ? "" : "s"}.`);
    }, [bulbs]);
    const chooseBulbs = useCallback((next: number) => {
        setClosed(false);
        setBulbs(next);
        setChangeSubtitle(`Now changing to ${next} bulb${next === 1 ? "" : "s"} in ${circuit}.`);
    }, [circuit]);
    const recordReading = useCallback(() => {
        labSounds.play("readingRecorded", { volume: 0.5 });
        if (!closed)
            return;
        setReadings((current) => {
            const next: CircuitReading = {
                id: `${circuit}-${bulbs}`,
                circuit,
                bulbs,
                totalCurrent: measurements.totalCurrent,
                bulbVoltage: measurements.bulbVoltage,
                brightness: measurements.brightness,
            };
            return [...current.filter((reading) => reading.id !== next.id), next].sort((a, b) => a.circuit === b.circuit ? a.bulbs - b.bulbs : a.circuit.localeCompare(b.circuit));
        });
    }, [bulbs, circuit, closed, measurements]);
    const reset = useCallback(() => {
        setClosed(false);
        setCircuit("series");
        setBulbs(1);
        setReadings([]);
        setChangeSubtitle("");
    }, []);
    useEffect(() => {
        if (!demoActive)
            return;
        const count = demoIndex % 3 + 1;
        const arrangement: CircuitType = demoIndex < 3 ? "series" : "parallel";
        setCircuit(arrangement);
        setBulbs(count);
        setClosed(false);
        setGuideStep(1);
        const close = window.setTimeout(() => setClosed(true), 1400);
        const next = window.setTimeout(() => {
            const voltage = arrangement === "series" ? BATTERY_VOLTAGE / count : BATTERY_VOLTAGE;
            setReadings(previous => [...previous.filter(r => r.id !== `${arrangement}-${count}`), { id: `${arrangement}-${count}`, circuit: arrangement, bulbs: count, totalCurrent: arrangement === "series" ? BATTERY_VOLTAGE / (BULB_RESISTANCE * count) : count * BATTERY_VOLTAGE / BULB_RESISTANCE, bulbVoltage: voltage, brightness: Math.round(100 * (voltage / BATTERY_VOLTAGE) ** 2) }]);
            if (demoIndex < 5)
                setDemoIndex(i => i + 1);
            else {
                setDemoActive(false);
                setGuideStep(2);
            }
        }, 5500);
        return () => { window.clearTimeout(close); window.clearTimeout(next); };
    }, [demoActive, demoIndex]);
    const startAgain = () => { setDemoActive(false); setDemoIndex(0); setGuideStep(0); reset(); };
    const startDemo = () => { startAgain(); setSelectedMode("see"); setDemoActive(true); };
    const subtitle = demoActive
        ? !closed ? `Now changing to ${circuit} with ${bulbs} bulb${bulbs === 1 ? "" : "s"}.`
            : `${bulbs} bulb${bulbs === 1 ? "" : "s"} in ${circuit} — ${circuit === "series" ? "one path for current" : "a separate path for each bulb"}.`
        : changeSubtitle;
    const ready = readings.some(r => r.circuit === "series" && r.bulbs > 1 && readings.some(p => p.circuit === "parallel" && p.bulbs === r.bulbs));
    return (<ExperimentLabelProvider><div className={`electricity-design electricity-design ${isMobileViewport ? "electricity-design--mobile" : ""} relative flex h-full w-full overflow-hidden bg-slate-950 text-white`}>
      <div data-experiment-tour="electric-scene" className="electricity-scene relative min-h-0 min-w-0 flex-1">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [8.2, 7.2, 10.8], fov: 50, near: .1, far: 110 }} style={{ touchAction: "none" }}><ElectricityScene circuit={circuit} bulbs={bulbs} closed={closed} brightness={measurements.visualBrightness} totalCurrent={closed ? measurements.totalCurrent : 0} branchCurrent={closed ? measurements.branchCurrent : 0} mode={mode} isMobile={isMobileViewport} moveVectorRef={moveVectorRef}/></Canvas>
        <nav className="absolute left-3 top-3 flex gap-2 rounded-xl bg-white/95 p-2 text-xs text-slate-800 shadow" aria-label="Experiment navigation">{onBack && <button className="p-2" onClick={onBack}>Back</button>}<button className="p-2" onClick={() => setShowTutorial(true)}>Guide</button>{onRequestPaper && <button className="p-2" onClick={onRequestPaper}>Lab paper</button>}</nav>
        <div className="absolute right-3 top-3 z-30 flex gap-1 rounded-full bg-white p-1 text-xs font-semibold text-slate-800 shadow" aria-label="Choose experiment mode"><button type="button" aria-pressed={demoActive} onClick={() => demoActive ? setDemoActive(false) : startDemo()} className={`rounded-full px-3 py-2 ${demoActive ? "bg-cyan-600 text-white" : ""}`}>{demoActive ? "Stop See" : "See"}</button><button type="button" aria-pressed={!demoActive && selectedMode === "learn"} onClick={() => { setDemoActive(false); setSelectedMode("learn"); }} className={`rounded-full px-3 py-2 ${!demoActive && selectedMode === "learn" ? "bg-cyan-600 text-white" : ""}`}>Learn</button></div>
        <div className="electricity-scene-hint pointer-events-none absolute bottom-4 left-4 rounded-xl bg-white/95 p-3 text-xs text-slate-700 shadow">{closed ? `${circuit} · ${measurements.totalCurrent.toFixed(2)} A` : "Switch open · no current"}<br />Drag to inspect · scroll to zoom</div>
        {selectedMode !== null && subtitle && <div key={subtitle} className="electricity-see-subtitle electricity-subtitle" role="status" aria-live="polite"><p>{subtitle}</p><span>{demoActive ? !closed ? "Opening the switch and reconnecting the leads." : circuit === "series" ? `Each bulb receives ${measurements.bulbVoltage.toFixed(1)} V. Adding bulbs makes them dimmer.` : "Each bulb receives the full 6 V and stays bright." : "Close the switch to observe the new circuit."}</span></div>}
      </div>
      <section data-mobile-experiment-controls={isMobileViewport ? "true" : undefined} inert={selectedMode === null} className="electricity-controls" aria-label="Experiment guide">
        <header className="electricity-controls__header"><strong>Simple Electricity</strong><button onClick={startAgain}>Start again</button></header>
        <div className="electricity-guide__progress"><div><span>Step {guideStep + 1} of 3</span><span>{readings.length} readings</span></div><progress max={3} value={guideStep + (ready ? 1 : 0)} aria-label="Experiment progress"/></div>
        <div className="electricity-guide__step" aria-live="polite"><p className="electricity-guide__eyebrow">{demoActive ? "Demonstration" : "Your experiment"}</p><h2>{["Check the apparatus", "Build and measure", "Compare the circuits"][guideStep]}</h2>
          <p>{guideStep === 0 ? "Follow the leads from the 6 V supply through the switch and bulb holders. Current needs a closed path. Open the switch before changing connections." : guideStep === 1 ? "Try two or three bulbs in each arrangement. Close the switch and save matching readings." : "In series, voltage is shared and bulb power falls. In parallel, each bulb receives 6 V and the supply current is the sum of branch currents."}</p>
          {guideStep === 1 && <div className="mt-5 space-y-4"><div data-experiment-tour="electric-layout" className="electricity-guide__choices">{(["series", "parallel"] as const).map(t => <button key={t} disabled={demoActive} aria-pressed={circuit === t} onClick={() => chooseCircuit(t)}>{t}</button>)}</div><div data-experiment-tour="electric-controls" className="electricity-guide__choices">{[1, 2, 3].map(n => <button key={n} disabled={demoActive} aria-pressed={bulbs === n} onClick={() => chooseBulbs(n)}>{n} bulb{n > 1 ? "s" : ""}</button>)}</div><button disabled={demoActive} className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold" onClick={() => setClosed(v => !v)}>{closed ? "Open switch" : "Close switch"}</button></div>}
          {guideStep > 0 && <dl className="electricity-guide__results"><div><dt>Total current · I = V / R</dt><dd>{closed ? measurements.totalCurrent.toFixed(2) : "0.00"} A</dd></div><div><dt>Voltage per bulb</dt><dd>{closed ? measurements.bulbVoltage.toFixed(2) : "0.00"} V</dd></div><div><dt>Power per bulb · P = V² / R</dt><dd>{closed ? (measurements.bulbVoltage ** 2 / BULB_RESISTANCE).toFixed(2) : "0.00"} W</dd></div></dl>}
          {guideStep === 2 && <div className="mt-4 space-y-2">{readings.map(r => <p key={r.id} className="text-sm">{r.circuit} · {r.bulbs} bulbs: {r.totalCurrent.toFixed(2)} A, {r.bulbVoltage.toFixed(2)} V per bulb</p>)}</div>}
          <p className="mt-5 text-xs text-slate-500">Ideal 6 V supply and identical 6 Ω resistive lamps. Glow represents relative electrical power. Real filament resistance varies with temperature. Dots illustrate conventional current.</p>
        </div>
        <footer className="electricity-guide__actions"><button className="electricity-guide__next" disabled={demoActive || selectedMode === null || (guideStep === 1 && !ready)} onClick={() => guideStep < 2 ? setGuideStep(v => v + 1) : startAgain()}>{guideStep === 0 ? "Next" : guideStep === 1 ? "Compare results" : "Start again"}</button>{guideStep === 1 && <button data-experiment-tour="electric-readings" className="electricity-guide__demo" disabled={!closed || demoActive} onClick={recordReading}>Record reading</button>}<button className="electricity-guide__demo" onClick={() => demoActive ? setDemoActive(false) : startDemo()}>{demoActive ? "Stop demonstration" : "Watch demonstration"}</button><button className="electricity-guide__demo" onClick={() => { startAgain(); setSelectedMode(null); }}>Change mode</button></footer>
      </section>
      {selectedMode === null && <div className="absolute inset-0 z-[220] grid place-items-center bg-slate-950/15 p-5 backdrop-blur-[7px]"><div role="dialog" aria-modal="true" aria-labelledby="electricity-mode-title" className="w-full max-w-[360px] rounded-2xl bg-white p-6 text-center text-slate-900 shadow-2xl"><p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Electric circuits</p><h2 id="electricity-mode-title" className="mt-2 text-2xl font-bold">Select mode</h2><p className="mt-2 text-sm text-slate-500">Compare bulbs in series and parallel.</p><button autoFocus className="mt-5 w-full rounded-xl bg-cyan-600 p-3 text-left font-bold text-white" onClick={startDemo}>See the animation <span className="float-right">▶</span></button><button className="mt-3 w-full rounded-xl border border-teal-200 bg-teal-50 p-3 text-left font-bold text-teal-950" onClick={() => { startAgain(); setSelectedMode("learn"); }}>Learn <span className="float-right">→</span></button></div></div>}
      {showPaper && (<ElectricityPaper readings={readings} circuit={circuit} bulbs={bulbs} onClose={onClosePaper}/>)}
      {showTutorial && (<ExperimentTutorialOverlay key={tutorialRequestKey} steps={electricityTutorialSteps} onClose={() => setShowTutorial(false)}/>)}
    </div></ExperimentLabelProvider>);
}

function useMobileExperimentViewport() {
 const [mobile,setMobile] = useState(false);
 useEffect(() => {
  const query=window.matchMedia("(max-width: 639px), (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse)");
  const update=()=>setMobile(query.matches);update();query.addEventListener("change",update);
  return ()=>query.removeEventListener("change",update);
 },[]);
 return mobile;
}
