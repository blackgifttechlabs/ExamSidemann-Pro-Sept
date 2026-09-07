"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The dynamics trolley used on the runway experiments — the little four-wheeled
 * cart that carries the mass bricks. Three practicals share it (Force & Motion,
 * Conservation of Momentum and the Inclined Plane), so it is modelled once here
 * with the detail a real one has: a pressed-steel deck with a rolled lip, a
 * visible axle running through rubber tyres on chromed hubs, dowel holes down
 * the centre line, a sprung buffer at one end and a pin at the other.
 *
 * It also carries the game feel. Give it `speed` and it leans back under
 * acceleration and dips under braking, its wheels spin at the right rate for
 * how far it has actually travelled, and `impact` squashes the springs for a
 * moment after a collision.
 */

export const TROLLEY_LENGTH = 0.46;
export const TROLLEY_WIDTH = 0.3;
export const TROLLEY_WHEEL_RADIUS = 0.055;
/** Height of the deck above the running surface. */
export const TROLLEY_DECK_Y = 0.125;

export type TrolleyCoupling = "spring" | "pin" | "cork" | "none";

export interface LabTrolleyProps {
  /** Body colour of the painted steel deck. */
  colour?: string;
  /** Number of mass bricks stacked on the deck. */
  bricks?: number;
  /** Which way the coupling at the working end points. */
  facing?: 1 | -1;
  /** Coupling fitted at the working end. */
  coupling?: TrolleyCoupling;
  /**
   * Distance travelled along the track, in world units. The wheels are rotated
   * to match, so they never look like they are skidding.
   */
  distance?: number;
  /** Current speed in world units per second — drives the body lean. */
  speed?: number;
  /**
   * Rises to 1 the instant the trolley is hit and decays away, squashing the
   * suspension and rocking the body.
   */
  impact?: number;
  /** Fit the card blade that breaks a light gate beam. */
  lightGateCard?: boolean;
  /** Ticker tape attachment point at the back. */
  tapeClip?: boolean;
  /** Number painted on the side, so two trolleys can be told apart. */
  label?: string;
}

export function LabTrolley({
  colour = "#0ea5e9",
  bricks = 0,
  facing = 1,
  coupling = "spring",
  distance = 0,
  speed = 0,
  impact = 0,
  lightGateCard = false,
  tapeClip = false,
  label,
}: LabTrolleyProps) {
  const bodyRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group>(null);

  const wheelPositions = useMemo<[number, number][]>(
    () => [
      [-0.15, 0.135],
      [0.15, 0.135],
      [-0.15, -0.135],
      [0.15, -0.135],
    ],
    [],
  );

  // Smoothed lean, so a step change in speed does not snap the body over.
  const leanRef = useRef(0);

  useFrame((_, delta) => {
    const spin = -distance / TROLLEY_WHEEL_RADIUS;
    if (wheelsRef.current) wheelsRef.current.rotation.z = spin;

    if (!bodyRef.current) return;
    // Weight transfer: the body pitches back as it picks up speed and nose-dives
    // when it is stopped, exactly like a real trolley on its springy wheels.
    const targetLean = THREE.MathUtils.clamp(speed * 0.02, -0.06, 0.06);
    leanRef.current = THREE.MathUtils.damp(leanRef.current, targetLean, 6, delta);
    bodyRef.current.rotation.z = leanRef.current - impact * 0.05 * facing;
    bodyRef.current.position.y = -impact * 0.012;
  });

  const rubber = { color: "#111827", roughness: 0.92, metalness: 0.02 };
  const chrome = { color: "#cbd5e1", roughness: 0.24, metalness: 0.92 };

  return (
    <group>
      {/* --------------------------------------------------------- wheels */}
      <group ref={wheelsRef}>
        {wheelPositions.map(([x, z]) => (
          <group key={`${x}-${z}`} position={[x, TROLLEY_WHEEL_RADIUS, z]} rotation={[Math.PI / 2, 0, 0]}>
            {/* Rubber tyre */}
            <mesh castShadow>
              <cylinderGeometry args={[TROLLEY_WHEEL_RADIUS, TROLLEY_WHEEL_RADIUS, 0.028, 24]} />
              <meshStandardMaterial {...rubber} />
            </mesh>
            {/* Chromed hub, set slightly proud of the tyre on the outer face */}
            <mesh position={[0, z > 0 ? 0.016 : -0.016, 0]}>
              <cylinderGeometry args={[TROLLEY_WHEEL_RADIUS * 0.52, TROLLEY_WHEEL_RADIUS * 0.52, 0.006, 20]} />
              <meshStandardMaterial {...chrome} />
            </mesh>
            {/* Hub nut, which is what makes the spin readable */}
            <mesh position={[0, z > 0 ? 0.021 : -0.021, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.008, 6]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Axle rods running right through, visible under the deck */}
      {[-0.15, 0.15].map((x) => (
        <mesh key={x} position={[x, TROLLEY_WHEEL_RADIUS, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, TROLLEY_WIDTH + 0.02, 10]} />
          <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.9} />
        </mesh>
      ))}

      {/* ------------------------------------------------ body on its springs */}
      <group ref={bodyRef}>
        {/* Chassis rails between the axles */}
        {[-0.11, 0.11].map((z) => (
          <mesh key={z} position={[0, 0.085, z]} castShadow>
            <boxGeometry args={[TROLLEY_LENGTH - 0.06, 0.02, 0.022]} />
            <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.65} />
          </mesh>
        ))}

        {/* Deck: painted pressed steel */}
        <mesh position={[0, TROLLEY_DECK_Y, 0]} castShadow receiveShadow>
          <boxGeometry args={[TROLLEY_LENGTH, 0.022, TROLLEY_WIDTH]} />
          <meshStandardMaterial color={colour} roughness={0.34} metalness={0.55} />
        </mesh>

        {/* Rolled lip around the deck, so bricks cannot slide off */}
        {[
          { pos: [0, TROLLEY_DECK_Y + 0.018, TROLLEY_WIDTH / 2 - 0.006] as const, args: [TROLLEY_LENGTH, 0.016, 0.012] as const },
          { pos: [0, TROLLEY_DECK_Y + 0.018, -TROLLEY_WIDTH / 2 + 0.006] as const, args: [TROLLEY_LENGTH, 0.016, 0.012] as const },
          { pos: [TROLLEY_LENGTH / 2 - 0.006, TROLLEY_DECK_Y + 0.018, 0] as const, args: [0.012, 0.016, TROLLEY_WIDTH] as const },
          { pos: [-TROLLEY_LENGTH / 2 + 0.006, TROLLEY_DECK_Y + 0.018, 0] as const, args: [0.012, 0.016, TROLLEY_WIDTH] as const },
        ].map((lip, index) => (
          <mesh key={index} position={lip.pos} castShadow>
            <boxGeometry args={lip.args} />
            <meshStandardMaterial color={colour} roughness={0.3} metalness={0.6} />
          </mesh>
        ))}

        {/* Dowel holes down the centre line, for the retaining rod */}
        {[-0.12, 0, 0.12].map((x) => (
          <mesh key={x} position={[x, TROLLEY_DECK_Y + 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.004, 14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.95} />
          </mesh>
        ))}

        {/* Corner screws */}
        {[
          [-TROLLEY_LENGTH / 2 + 0.03, TROLLEY_WIDTH / 2 - 0.035],
          [TROLLEY_LENGTH / 2 - 0.03, TROLLEY_WIDTH / 2 - 0.035],
          [-TROLLEY_LENGTH / 2 + 0.03, -TROLLEY_WIDTH / 2 + 0.035],
          [TROLLEY_LENGTH / 2 - 0.03, -TROLLEY_WIDTH / 2 + 0.035],
        ].map(([x, z]) => (
          <mesh key={`${x}-${z}`} position={[x, TROLLEY_DECK_Y + 0.012, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.004, 8]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        ))}

        {/* Painted identification patch on the side */}
        {label && (
          <mesh position={[0, TROLLEY_DECK_Y - 0.004, TROLLEY_WIDTH / 2 + 0.002]}>
            <planeGeometry args={[0.07, 0.03]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} />
          </mesh>
        )}

        {/* Mass bricks, with a slight stagger so the stack reads as separate pieces */}
        {Array.from({ length: bricks }, (_, index) => (
          <group key={index} position={[index % 2 === 0 ? 0.004 : -0.004, TROLLEY_DECK_Y + 0.05 + index * 0.072, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.068, 0.22]} />
              <meshStandardMaterial color="#4b5563" roughness={0.55} metalness={0.6} />
            </mesh>
            {/* Cast-in grip slot along the top of each brick */}
            <mesh position={[0, 0.036, 0]}>
              <boxGeometry args={[0.1, 0.006, 0.03]} />
              <meshStandardMaterial color="#1f2937" roughness={0.9} />
            </mesh>
          </group>
        ))}

        {/* Card blade for the light gates */}
        {lightGateCard && (
          <mesh position={[0, TROLLEY_DECK_Y + 0.12 + bricks * 0.072, 0]} castShadow>
            <boxGeometry args={[0.1, 0.17, 0.0025]} />
            <meshStandardMaterial color="#0f172a" roughness={0.95} />
          </mesh>
        )}

        {/* Ticker-tape clip at the back */}
        {tapeClip && (
          <mesh position={[-facing * (TROLLEY_LENGTH / 2 - 0.01), TROLLEY_DECK_Y + 0.03, 0]} castShadow>
            <boxGeometry args={[0.016, 0.03, 0.05]} />
            <meshStandardMaterial {...chrome} />
          </mesh>
        )}

        <TrolleyCoupling kind={coupling} facing={facing} impact={impact} />
      </group>
    </group>
  );
}

/** The buffer fitted to the working end: a coil spring, a pin, or a cork. */
function TrolleyCoupling({
  kind,
  facing,
  impact,
}: {
  kind: TrolleyCoupling;
  facing: 1 | -1;
  impact: number;
}) {
  if (kind === "none") return null;

  const x = facing * (TROLLEY_LENGTH / 2);
  const y = TROLLEY_DECK_Y - 0.01;

  if (kind === "pin") {
    return (
      <group position={[x, y, 0]}>
        {/* Mounting boss */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.016, 0.016, 0.02, 12]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.85} />
        </mesh>
        {/* The spike itself */}
        <mesh position={[facing * 0.05, 0, 0]} rotation={[0, 0, -facing * Math.PI / 2]} castShadow>
          <coneGeometry args={[0.008, 0.08, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.22} metalness={0.95} />
        </mesh>
      </group>
    );
  }

  if (kind === "cork") {
    return (
      <group position={[x, y, 0]}>
        <mesh position={[facing * 0.03, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.026, 0.055, 16]} />
          <meshStandardMaterial color="#c8a165" roughness={0.95} />
        </mesh>
      </group>
    );
  }

  // Springy buffer — a short coil that visibly compresses on impact.
  const compression = 1 - Math.min(0.55, impact * 0.55);
  return (
    <group position={[x, y, 0]} scale={[compression, 1, 1]}>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.016, 10]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.35} metalness={0.85} />
      </mesh>
      {[0, 1, 2, 3].map((coil) => (
        <mesh
          key={coil}
          position={[facing * (0.018 + coil * 0.014), 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <torusGeometry args={[0.018, 0.0035, 8, 20]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.28} metalness={0.9} />
        </mesh>
      ))}
      {/* Rubber pad on the nose */}
      <mesh position={[facing * 0.075, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.012, 16]} />
        <meshStandardMaterial color="#1f2937" roughness={0.95} />
      </mesh>
    </group>
  );
}

/**
 * Tracks collisions so a caller only has to say "they just hit at this speed".
 * Returns a value that jumps to 1 on impact and decays, ready to feed the
 * trolley's `impact` prop and to pick a soft or hard collision sound.
 */
export function useImpactDecay(halfLifeMs = 220) {
  const impactRef = useRef(0);
  const lastRef = useRef(0);

  useFrame((_, delta) => {
    if (impactRef.current <= 0.001) return;
    impactRef.current *= Math.pow(0.5, (delta * 1000) / halfLifeMs);
  });

  return {
    get value() {
      return impactRef.current;
    },
    trigger(strength = 1) {
      const now = performance.now();
      // Ignore a second hit in the same frame or two.
      if (now - lastRef.current < 60) return false;
      lastRef.current = now;
      impactRef.current = Math.min(1, strength);
      return true;
    },
  };
}
