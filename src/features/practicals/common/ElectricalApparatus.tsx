"use client";

import { useMemo, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The circuit apparatus shared by the O Level electricity practicals — the
 * low-voltage supply, the moving-coil meters, connecting leads, crocodile
 * clips, a switch and a rheostat.
 *
 * Everything is drawn to the same scale as the rest of the lab, and is placed
 * as a child of the group sitting on the bench top.
 */

/* -------------------------------------------------------------------- leads */

function LeadSegment({ start, end, colour }: { start: THREE.Vector3; end: THREE.Vector3; colour: string }) {
  const midpoint = useMemo(() => start.clone().add(end).multiplyScalar(0.5), [end, start]);
  const length = useMemo(() => start.distanceTo(end), [end, start]);
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        end.clone().sub(start).normalize(),
      ),
    [end, start],
  );

  if (length < 1e-4) return null;

  return (
    <mesh position={midpoint} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[0.017, 0.017, length, 10]} />
      <meshStandardMaterial color={colour} roughness={0.52} metalness={0.1} />
    </mesh>
  );
}

/** A connecting lead drawn as a run of straight sections with rounded joints. */
export function CircuitLead({
  points,
  colour = "#111827",
}: {
  points: [number, number, number][];
  colour?: string;
}) {
  const vectors = useMemo(() => points.map((point) => new THREE.Vector3(...point)), [points]);

  return (
    <group>
      {vectors.slice(0, -1).map((vector, index) => (
        <LeadSegment key={index} start={vector} end={vectors[index + 1]} colour={colour} />
      ))}
      {vectors.slice(1, -1).map((vector, index) => (
        <mesh key={`joint-${index}`} position={vector}>
          <sphereGeometry args={[0.019, 8, 6]} />
          <meshStandardMaterial color={colour} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ supply */

/** The school low-voltage d.c. supply, with its output written on the front. */
export function PowerSupply({
  position,
  voltage,
  on = true,
  label = "d.c. supply",
  alternating = false,
}: {
  position: [number, number, number];
  voltage: number;
  on?: boolean;
  label?: string;
  alternating?: boolean;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.32, 0.46]} />
        <meshStandardMaterial color="#1f2937" roughness={0.5} metalness={0.28} />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <boxGeometry args={[0.6, 0.03, 0.36]} />
        <meshStandardMaterial color="#111827" roughness={0.62} />
      </mesh>
      {/* Output terminals */}
      {[-0.16, 0.16].map((x, index) => (
        <mesh key={x} position={[x, 0.34, 0.16]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.06, 16]} />
          <meshStandardMaterial color={index === 0 ? "#b91c1c" : "#111827"} metalness={0.55} roughness={0.34} />
        </mesh>
      ))}
      {/* Indicator lamp */}
      <mesh position={[0.26, 0.24, 0.235]}>
        <sphereGeometry args={[0.028, 12, 10]} />
        <meshStandardMaterial
          color={on ? "#4ade80" : "#334155"}
          emissive={on ? "#22c55e" : "#000000"}
          emissiveIntensity={on ? 1.6 : 0}
        />
      </mesh>
      <Html position={[0, 0.2, 0.24]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/92 px-1.5 py-0.5 text-center">
          <div className="text-[9px] font-black text-white">{voltage.toFixed(1)} V</div>
          <div className="text-[6px] font-black uppercase text-slate-400">{alternating ? "a.c." : label}</div>
        </div>
      </Html>
    </group>
  );
}

/** A cell or battery of cells, drawn on its side on the bench. */
export function BatteryPack({
  position,
  cells = 2,
  emf,
}: {
  position: [number, number, number];
  cells?: number;
  emf: number;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.26 * cells + 0.16, 0.12, 0.34]} />
        <meshStandardMaterial color="#0f172a" roughness={0.55} metalness={0.2} />
      </mesh>
      {Array.from({ length: cells }, (_, index) => (
        <mesh
          key={index}
          position={[-((cells - 1) * 0.26) / 2 + index * 0.26, 0.17, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.085, 0.085, 0.28, 20]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (0.13 * cells + 0.06), 0.17, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.034, 0.05, 14]} />
          <meshStandardMaterial color={side < 0 ? "#111827" : "#b91c1c"} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      <Html position={[0, 0.3, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/92 px-1.5 py-0.5 text-[8px] font-black text-white">
          {emf.toFixed(1)} V
        </div>
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------------ meters */

/** Needle sweep: 0 at the left stop, full scale at the right stop. */
const METER_SWEEP = Math.PI * 1.6;
const METER_ZERO_ANGLE = Math.PI * 1.2;

/**
 * Drives the needle the way a real moving-coil movement behaves: the coil has
 * inertia and the hairspring pulls it back, so it accelerates towards the
 * reading, overshoots slightly and settles after a wobble or two. Meters are
 * deliberately underdamped — an instantly-settling needle is the giveaway that
 * a simulation is drawing a number rather than a movement.
 */
function useNeedleAngle(targetFraction: number) {
  const needle = useRef<THREE.Group>(null);
  const angle = useRef(METER_ZERO_ANGLE);
  const velocity = useRef(0);
  /** Reading shown in the caption, sampled from the needle, not the input. */
  const [displayed, setDisplayed] = useState(0);
  const sinceSample = useRef(0);

  useFrame((_, rawDelta) => {
    // Long frames (tab regains focus) would otherwise fling the needle.
    const delta = Math.min(rawDelta, 0.05);
    const target = METER_ZERO_ANGLE - THREE.MathUtils.clamp(targetFraction, 0, 1) * METER_SWEEP;

    // Torsional spring towards the target with viscous damping; ζ ≈ 0.45.
    const stiffness = 190;
    const damping = 2 * 0.45 * Math.sqrt(stiffness);
    velocity.current += (target - angle.current) * stiffness * delta;
    velocity.current -= velocity.current * damping * delta;
    angle.current += velocity.current * delta;

    // The needle physically cannot travel past its end stops.
    const upper = METER_ZERO_ANGLE;
    const lower = METER_ZERO_ANGLE - METER_SWEEP;
    if (angle.current > upper) {
      angle.current = upper;
      velocity.current = Math.min(0, velocity.current) * 0.25;
    } else if (angle.current < lower) {
      angle.current = lower;
      velocity.current = Math.max(0, velocity.current) * 0.25;
    }

    if (needle.current) needle.current.rotation.y = angle.current;

    // A person reads the dial a few times a second, not every frame.
    sinceSample.current += delta;
    if (sinceSample.current >= 0.1) {
      sinceSample.current = 0;
      setDisplayed((METER_ZERO_ANGLE - angle.current) / METER_SWEEP);
    }
  });

  return { needle, displayed };
}

/**
 * A moving-coil meter. The needle sweeps a 240° arc, and the digital caption
 * below it gives the reading to the number of decimal places a school meter
 * can actually be read to. The caption tracks the needle rather than the input
 * value, so the number and the pointer always agree.
 */
export function AnalogueMeter({
  position,
  rotation = [0, 0, 0],
  kind,
  value,
  max,
  decimals = 2,
  label,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  kind: "ammeter" | "voltmeter" | "milliammeter";
  value: number;
  max: number;
  decimals?: number;
  label?: string;
}) {
  const fraction = THREE.MathUtils.clamp(value / max, 0, 1);
  const { needle, displayed } = useNeedleAngle(fraction);
  const symbol = kind === "voltmeter" ? "V" : kind === "milliammeter" ? "mA" : "A";
  const unit = kind === "voltmeter" ? "V" : kind === "milliammeter" ? "mA" : "A";
  /** Over-range is a real reading error, and the meter should say so. */
  const overRange = value > max * 1.001;

  return (
    <group position={position} rotation={rotation}>
      {/* Case */}
      <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.46, 0.26, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.52} metalness={0.24} />
      </mesh>
      {/* Dial face, tilted towards the learner */}
      <group position={[0, 0.28, 0.02]} rotation={[-Math.PI / 3, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.18, 0.18, 0.012, 30]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.008, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.18, 0.012, 8, 30]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Scale markings: every 1/20 of full scale, long every 1/4 */}
        {Array.from({ length: 21 }, (_, index) => {
          const markAngle = METER_ZERO_ANGLE - (index / 20) * METER_SWEEP;
          const major = index % 5 === 0;
          return (
            <mesh
              key={index}
              position={[Math.cos(markAngle) * (major ? 0.142 : 0.15), 0.008, -Math.sin(markAngle) * (major ? 0.142 : 0.15)]}
              rotation={[0, markAngle, 0]}
            >
              <boxGeometry args={[major ? 0.05 : 0.026, 0.003, major ? 0.006 : 0.004]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          );
        })}
        {/* Numbers against the quarter marks, so the dial can actually be read */}
        {Array.from({ length: 5 }, (_, index) => {
          const markAngle = METER_ZERO_ANGLE - (index / 4) * METER_SWEEP;
          const reading = (max * index) / 4;
          return (
            <Html
              key={index}
              position={[Math.cos(markAngle) * 0.108, 0.012, -Math.sin(markAngle) * 0.108]}
              center
              distanceFactor={4}
              style={{ pointerEvents: "none" }}
            >
              <div className="text-[9px] font-black text-slate-700">
                {reading >= 10 ? reading.toFixed(0) : reading.toFixed(reading % 1 === 0 ? 0 : 1)}
              </div>
            </Html>
          );
        })}
        {/* Needle, driven by the moving-coil model above */}
        <group ref={needle} position={[0, 0.012, 0]}>
          <mesh position={[0.07, 0, 0]}>
            <boxGeometry args={[0.15, 0.004, 0.008]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          {/* Counterweight tail, as on a real movement */}
          <mesh position={[-0.03, 0, 0]}>
            <boxGeometry args={[0.05, 0.004, 0.006]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </group>
        <mesh position={[0, 0.016, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.01, 10]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Html position={[0, 0.02, 0.075]} center distanceFactor={5} style={{ pointerEvents: "none" }}>
          <div className="text-[10px] font-black text-slate-800">{symbol}</div>
        </Html>
      </group>

      {/* Terminals */}
      {[-0.13, 0.13].map((x, index) => (
        <mesh key={x} position={[x, 0.27, 0.17]} castShadow>
          <cylinderGeometry args={[0.028, 0.032, 0.05, 14]} />
          <meshStandardMaterial color={index === 0 ? "#b91c1c" : "#111827"} metalness={0.6} roughness={0.32} />
        </mesh>
      ))}

      <Html position={[0, 0.06, 0.23]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-lg border border-white/15 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className={`text-[10px] font-black ${overRange ? "text-amber-300" : "text-white"}`}>
            {(displayed * max).toFixed(decimals)} {unit}
          </div>
          <div className="text-[6px] font-black uppercase text-slate-400">
            {overRange ? "over range" : label ?? kind}
          </div>
        </div>
      </Html>
    </group>
  );
}

/* ------------------------------------------------------------ switch, clips */

export function CircuitSwitch({
  position,
  closed,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  closed: boolean;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.06, 0.24]} />
        <meshStandardMaterial color="#e7dfc8" roughness={0.62} />
      </mesh>
      {[-0.14, 0.14].map((x) => (
        <mesh key={x} position={[x, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.07, 14]} />
          <meshStandardMaterial color="#b98a3d" metalness={0.8} roughness={0.22} />
        </mesh>
      ))}
      <group position={[-0.14, 0.14, 0]} rotation={[0, 0, closed ? 0 : 0.6]}>
        <mesh position={[0.14, 0, 0]} castShadow>
          <boxGeometry args={[0.29, 0.025, 0.04]} />
          <meshStandardMaterial color="#c69b50" metalness={0.85} roughness={0.18} />
        </mesh>
      </group>
      <Html position={[0, 0.08, 0.2]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div
          className="whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[7px] font-black uppercase"
          style={
            closed
              ? { borderColor: "rgba(52,211,153,0.35)", background: "rgba(2,6,23,0.9)", color: "#a7f3d0" }
              : { borderColor: "rgba(251,113,133,0.35)", background: "rgba(2,6,23,0.9)", color: "#fecdd3" }
          }
        >
          {closed ? "closed" : "open"}
        </div>
      </Html>
    </group>
  );
}

/** A crocodile clip biting onto a wire. */
export function CrocodileClip({
  position,
  rotation = [0, 0, 0],
  colour = "#b91c1c",
  label,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  colour?: string;
  label?: string;
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.12, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.07, 0.06]} />
        <meshStandardMaterial color={colour} roughness={0.48} />
      </mesh>
      {label && (
        <Html position={[0, 0.12, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1 py-0.5 text-[7px] font-black uppercase text-slate-200">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* --------------------------------------------------------------- resistors */

/** A resistor on a mount, colour banded and labelled with its value. */
export function ResistorBlock({
  position,
  ohms,
  highlighted = false,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  ohms: number;
  highlighted?: boolean;
  rotation?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.42, 0.04, 0.22]} />
        <meshStandardMaterial color={highlighted ? "#312e81" : "#1e293b"} roughness={0.66} />
      </mesh>
      <mesh position={[0, 0.11, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.24, 18]} />
        <meshStandardMaterial color="#d8c9a3" roughness={0.6} />
      </mesh>
      {[-0.06, 0, 0.06].map((offset, index) => (
        <mesh key={offset} position={[offset, 0.11, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.057, 0.057, 0.02, 18]} />
          <meshStandardMaterial color={["#7c2d12", "#111827", "#b45309"][index]} roughness={0.5} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.18, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.028, 0.09, 12]} />
          <meshStandardMaterial color="#b98a3d" metalness={0.78} roughness={0.24} />
        </mesh>
      ))}
      <Html position={[0, 0.22, 0]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/92 px-1.5 py-0.5 text-[8px] font-black text-white">
          {ohms} Ω
        </div>
      </Html>
    </group>
  );
}

/**
 * A rheostat — a coil of resistance wire on a ceramic former with a slider
 * that taps off part of the coil. `fraction` is how much of the coil is in
 * the circuit, from 0 (none) to 1 (all of it).
 */
export function RheostatBox({
  position,
  fraction,
  rotation = [0, 0, 0],
  ohmsInCircuit,
}: {
  position: [number, number, number];
  fraction: number;
  rotation?: [number, number, number];
  ohmsInCircuit?: number;
}) {
  const turns = 26;
  const bodyLength = 0.92;
  const sliderX = -bodyLength / 2 + THREE.MathUtils.clamp(fraction, 0, 1) * bodyLength;

  return (
    <group position={position} rotation={rotation}>
      {/* Feet and rail */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (bodyLength / 2 + 0.05), 0.06, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.12, 0.26]} />
          <meshStandardMaterial color="#334155" roughness={0.6} metalness={0.3} />
        </mesh>
      ))}

      {/* Ceramic former with its coil */}
      <mesh position={[0, 0.19, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, bodyLength, 20]} />
        <meshStandardMaterial color="#e7e5e4" roughness={0.85} />
      </mesh>
      {Array.from({ length: turns }, (_, index) => {
        const x = -bodyLength / 2 + 0.03 + (index / (turns - 1)) * (bodyLength - 0.06);
        const inCircuit = x <= sliderX;
        return (
          <mesh key={index} position={[x, 0.19, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.082, 0.009, 6, 20]} />
            <meshStandardMaterial
              color={inCircuit ? "#b45309" : "#78716c"}
              metalness={0.72}
              roughness={0.34}
            />
          </mesh>
        );
      })}

      {/* Slider rail and slider */}
      <mesh position={[0, 0.33, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.016, 0.016, bodyLength + 0.12, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.24} />
      </mesh>
      <group position={[sliderX, 0.33, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.09, 0.1, 0.11]} />
          <meshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.4} />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <boxGeometry args={[0.025, 0.1, 0.025]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* Terminals: one at each end of the coil, one on the slider */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (bodyLength / 2 + 0.05), 0.15, 0.1]} castShadow>
          <cylinderGeometry args={[0.026, 0.03, 0.06, 12]} />
          <meshStandardMaterial color="#b98a3d" metalness={0.78} roughness={0.24} />
        </mesh>
      ))}

      {ohmsInCircuit !== undefined && (
        <Html position={[0, 0.5, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded-lg border border-white/15 bg-slate-950/92 px-1.5 py-1 text-center">
            <div className="text-[9px] font-black text-white">{ohmsInCircuit.toFixed(1)} Ω</div>
            <div className="text-[6px] font-black uppercase text-slate-400">in circuit</div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * A metre rule with a length of resistance wire taped along it, and two
 * crocodile clips tapping off the length under test — the standard set-up for
 * investigating how resistance depends on length.
 */
export function ResistanceWireOnRule({
  position,
  ruleLength = 2.2,
  /** Fraction of the rule between the clips, 0–1. */
  tapped,
  wireColour = "#8a7f6d",
  wireRadius = 0.012,
  hot = 0,
}: {
  position: [number, number, number];
  ruleLength?: number;
  tapped: number;
  wireColour?: string;
  wireRadius?: number;
  /** 0–1: how warm the wire is running, which tints it. */
  hot?: number;
}) {
  const clampedTap = THREE.MathUtils.clamp(tapped, 0.02, 1);
  const leftX = -ruleLength / 2;
  const tapX = leftX + clampedTap * ruleLength;
  const colour = new THREE.Color(wireColour).lerp(new THREE.Color("#f97316"), THREE.MathUtils.clamp(hot, 0, 1) * 0.5);

  return (
    <group position={position}>
      {/* Metre rule */}
      <mesh position={[0, 0.012, 0]} receiveShadow castShadow>
        <boxGeometry args={[ruleLength, 0.024, 0.16]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.78} />
      </mesh>
      {Array.from({ length: 21 }, (_, index) => {
        const x = leftX + (index / 20) * ruleLength;
        return (
          <mesh key={index} position={[x, 0.025, -0.04]}>
            <boxGeometry args={[index % 5 === 0 ? 0.008 : 0.004, 0.002, index % 5 === 0 ? 0.06 : 0.035]} />
            <meshStandardMaterial color="#3f3f46" />
          </mesh>
        );
      })}
      <Html position={[leftX, 0.05, 0.14]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="text-[7px] font-black text-slate-700">0 cm</div>
      </Html>
      <Html position={[-ruleLength / 2 + ruleLength, 0.05, 0.14]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
        <div className="text-[7px] font-black text-slate-700">100 cm</div>
      </Html>

      {/* The resistance wire itself, stretched the whole length of the rule */}
      <mesh position={[0, 0.04, 0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[wireRadius, wireRadius, ruleLength, 10]} />
        <meshStandardMaterial color={colour} metalness={0.62} roughness={0.42} emissive={colour} emissiveIntensity={hot * 0.35} />
      </mesh>

      {/* The two crocodile clips */}
      <CrocodileClip position={[leftX, 0.07, 0.02]} colour="#b91c1c" label="fixed" />
      <CrocodileClip position={[tapX, 0.07, 0.02]} colour="#111827" label="sliding" rotation={[0, Math.PI, 0]} />

      <Html position={[(leftX + tapX) / 2, 0.16, 0.02]} center distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="whitespace-nowrap rounded-lg border border-white/15 bg-slate-950/92 px-1.5 py-1 text-center">
          <div className="text-[9px] font-black text-white">{(clampedTap * 100).toFixed(0)} cm</div>
          <div className="text-[6px] font-black uppercase text-slate-400">length under test</div>
        </div>
      </Html>
    </group>
  );
}

/** A filament lamp in a holder, whose brightness shows the current. */
export function FilamentLamp({
  position,
  brightness,
  label,
}: {
  position: [number, number, number];
  brightness: number;
  label?: string;
}) {
  const glow = THREE.MathUtils.clamp(brightness, 0, 1);

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.19, 0.1, 26]} />
        <meshStandardMaterial color="#e3ded0" roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.17, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 0.17, 24]} />
        <meshStandardMaterial color="#aaa89f" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.35, 0]} renderOrder={25}>
        <sphereGeometry args={[0.19, 32, 22]} />
        <meshPhysicalMaterial
          color={glow > 0.02 ? "#fff5c2" : "#d7e5e7"}
          emissive={glow > 0.02 ? "#ffb735" : "#000000"}
          emissiveIntensity={glow * 2.4}
          transparent
          opacity={0.34 + glow * 0.28}
          transmission={0.55}
          thickness={0.06}
          roughness={0.06}
          depthWrite={false}
        />
      </mesh>
      {glow > 0.03 && (
        <pointLight position={[0, 0.37, 0]} color="#ffd866" intensity={0.4 + glow * 1.6} distance={2.6} decay={2} />
      )}
      {[-0.13, 0.13].map((x, index) => (
        <mesh key={x} position={[x, 0.06, 0.14]} castShadow>
          <cylinderGeometry args={[0.026, 0.03, 0.05, 12]} />
          <meshStandardMaterial color={index === 0 ? "#b91c1c" : "#111827"} metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {label && (
        <Html position={[0, 0.6, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
          <div className="whitespace-nowrap rounded border border-white/15 bg-slate-950/90 px-1.5 py-0.5 text-[7px] font-black uppercase text-slate-200">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}
