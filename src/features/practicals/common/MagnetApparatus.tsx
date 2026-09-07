"use client";

import { useMemo } from "react";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";

/**
 * Apparatus and field maths shared by the O Level magnetism practicals.
 *
 * Everything works in the horizontal x–z plane — the plane of the sheet of
 * paper lying on the bench — so a "position" here is a pair of bench
 * coordinates and an "angle" is measured anticlockwise from the +x axis when
 * looking down on the bench.
 */

/** Poles are modelled as two point charges a short distance apart. */
export interface MagnetSpec {
  /** Centre of the magnet on the bench, in metres. */
  x: number;
  z: number;
  /** Rotation about the vertical axis, in radians. 0 puts N towards +x. */
  angle?: number;
  length?: number;
  /** Pole strength. Negative flips the magnet so S faces +x. */
  strength?: number;
}

export const MAGNET_LENGTH = 1.1;
export const MAGNET_WIDTH = 0.26;
export const MAGNET_HEIGHT = 0.14;

interface Pole {
  position: THREE.Vector2;
  /** Positive for a north pole (field lines leave), negative for south. */
  charge: number;
}

/** The two poles of a magnet, as points in the bench plane. */
export function magnetPoles(magnet: MagnetSpec): Pole[] {
  const angle = magnet.angle ?? 0;
  const length = magnet.length ?? MAGNET_LENGTH;
  const strength = magnet.strength ?? 1;
  /** Poles sit slightly inside the ends, which is where the flux concentrates. */
  const half = (length / 2) * 0.82;
  const axis = new THREE.Vector2(Math.cos(angle), -Math.sin(angle));
  const centre = new THREE.Vector2(magnet.x, magnet.z);

  return [
    { position: centre.clone().addScaledVector(axis, half), charge: strength },
    { position: centre.clone().addScaledVector(axis, -half), charge: -strength },
  ];
}

/**
 * Field of the magnets at a point on the bench, ignoring the earth's field.
 * Each pole contributes an inverse-square field directed away from a north
 * pole and towards a south pole.
 */
export function magnetFieldAt(point: THREE.Vector2, magnets: MagnetSpec[]): THREE.Vector2 {
  const field = new THREE.Vector2(0, 0);
  magnets.forEach((magnet) => {
    magnetPoles(magnet).forEach((pole) => {
      const offset = point.clone().sub(pole.position);
      const distance = Math.max(offset.length(), 0.06);
      field.addScaledVector(offset.normalize(), pole.charge / (distance * distance));
    });
  });
  return field;
}

/**
 * The earth's magnetic field runs roughly south to north along the bench. A
 * plotting compass well away from the magnet lines up with it, and it is what
 * produces the neutral points either side of a magnet lying N–S.
 */
export const EARTH_FIELD_STRENGTH = 0.55;

export function totalFieldAt(
  point: THREE.Vector2,
  magnets: MagnetSpec[],
  includeEarth: boolean,
): THREE.Vector2 {
  const field = magnetFieldAt(point, magnets);
  if (includeEarth) field.add(new THREE.Vector2(0, -EARTH_FIELD_STRENGTH));
  return field;
}

/** Direction a compass needle points, in radians, measured as an angle in the x–z plane. */
export function fieldAngleAt(
  point: THREE.Vector2,
  magnets: MagnetSpec[],
  includeEarth = false,
): number {
  const field = totalFieldAt(point, magnets, includeEarth);
  return Math.atan2(-field.y, field.x);
}

/**
 * Follows the field from a starting point, one small step at a time, the way a
 * learner follows a plotting compass across the paper. Stops at a south pole,
 * at the edge of the paper, or where the field cancels out.
 */
export function traceFieldLine(
  start: THREE.Vector2,
  magnets: MagnetSpec[],
  {
    includeEarth = false,
    step = 0.055,
    maxSteps = 260,
    bounds = 3.1,
  }: { includeEarth?: boolean; step?: number; maxSteps?: number; bounds?: number } = {},
): THREE.Vector2[] {
  const points: THREE.Vector2[] = [start.clone()];
  const current = start.clone();
  const southPoles = magnets.flatMap((magnet) => magnetPoles(magnet).filter((pole) => pole.charge < 0));

  for (let index = 0; index < maxSteps; index += 1) {
    const field = totalFieldAt(current, magnets, includeEarth);
    if (field.length() < 1e-4) break;
    /** Midpoint step, so the line curves smoothly instead of drifting outwards. */
    const half = current.clone().addScaledVector(field.normalize(), step / 2);
    const midField = totalFieldAt(half, magnets, includeEarth);
    if (midField.length() < 1e-4) break;
    current.addScaledVector(midField.normalize(), step);
    points.push(current.clone());

    if (Math.abs(current.x) > bounds || Math.abs(current.y) > bounds) break;
    if (southPoles.some((pole) => current.distanceTo(pole.position) < step * 1.2)) break;
  }

  return points;
}

/** Where the magnet's field exactly cancels the earth's field, if such a point exists. */
export function findNeutralPoints(magnets: MagnetSpec[]): THREE.Vector2[] {
  const found: THREE.Vector2[] = [];
  const searchStep = 0.05;

  for (let x = -2.4; x <= 2.4; x += searchStep) {
    for (let z = -2.4; z <= 2.4; z += searchStep) {
      const point = new THREE.Vector2(x, z);
      if (magnets.some((magnet) => point.distanceTo(new THREE.Vector2(magnet.x, magnet.z)) < 0.34)) continue;
      const strength = totalFieldAt(point, magnets, true).length();
      if (strength > 0.055) continue;
      /** Keep one marker per cancellation region rather than a cluster of them. */
      if (found.some((existing) => existing.distanceTo(point) < 0.5)) continue;
      found.push(point);
    }
  }

  return found;
}

/* ------------------------------------------------------------------ 3D bits */

/** Sheet of white paper the magnet is stood on and the field is plotted on. */
export function PlottingPaper({
  size = 5,
  y = 0.012,
  outline,
}: {
  size?: number;
  y?: number;
  /** Pencil outline traced around the magnet before it is lifted off. */
  outline?: MagnetSpec | null;
}) {
  return (
    <group>
      <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size * 0.78]} />
        <meshStandardMaterial color="#fdfdfb" roughness={0.94} />
      </mesh>
      {outline && (
        <group position={[outline.x, y + 0.002, outline.z]} rotation={[0, outline.angle ?? 0, 0]}>
          <Line
            points={[
              [-MAGNET_LENGTH / 2, 0, -MAGNET_WIDTH / 2],
              [MAGNET_LENGTH / 2, 0, -MAGNET_WIDTH / 2],
              [MAGNET_LENGTH / 2, 0, MAGNET_WIDTH / 2],
              [-MAGNET_LENGTH / 2, 0, MAGNET_WIDTH / 2],
              [-MAGNET_LENGTH / 2, 0, -MAGNET_WIDTH / 2],
            ]}
            color="#94a3b8"
            lineWidth={1.4}
            dashed
            dashSize={0.05}
            gapSize={0.035}
          />
        </group>
      )}
    </group>
  );
}

/**
 * A laboratory bar magnet. The north-seeking pole is painted red and the
 * south-seeking pole blue, as on the magnets in the school prep room.
 */
export function BarMagnet({
  magnet,
  y = 0.09,
  labelled = true,
  /** 0 = unmagnetised steel, 1 = fully magnetised. Fades the pole colours. */
  magnetisation = 1,
}: {
  magnet: MagnetSpec;
  y?: number;
  labelled?: boolean;
  magnetisation?: number;
}) {
  const length = magnet.length ?? MAGNET_LENGTH;
  const flipped = (magnet.strength ?? 1) < 0;
  const strength = THREE.MathUtils.clamp(magnetisation, 0, 1);
  const northColour = new THREE.Color("#9aa3ad").lerp(new THREE.Color("#dc2626"), strength);
  const southColour = new THREE.Color("#9aa3ad").lerp(new THREE.Color("#2563eb"), strength);
  const northEnd = flipped ? -1 : 1;

  return (
    <group position={[magnet.x, y, magnet.z]} rotation={[0, magnet.angle ?? 0, 0]}>
      {/* Bare steel in the middle */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length * 0.5, MAGNET_HEIGHT, MAGNET_WIDTH]} />
        <meshStandardMaterial color="#c3cad2" metalness={0.72} roughness={0.34} />
      </mesh>
      {/* Painted pole ends */}
      <mesh position={[(length * 0.375) * northEnd, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[length * 0.25, MAGNET_HEIGHT, MAGNET_WIDTH]} />
        <meshStandardMaterial color={northColour} metalness={0.42} roughness={0.44} />
      </mesh>
      <mesh position={[-(length * 0.375) * northEnd, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[length * 0.25, MAGNET_HEIGHT, MAGNET_WIDTH]} />
        <meshStandardMaterial color={southColour} metalness={0.42} roughness={0.44} />
      </mesh>

      {labelled && strength > 0.15 && (
        <>
          <Html position={[(length * 0.375) * northEnd, MAGNET_HEIGHT * 0.62, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="text-[11px] font-black text-white drop-shadow">N</div>
          </Html>
          <Html position={[-(length * 0.375) * northEnd, MAGNET_HEIGHT * 0.62, 0]} center distanceFactor={7} style={{ pointerEvents: "none" }}>
            <div className="text-[11px] font-black text-white drop-shadow">S</div>
          </Html>
        </>
      )}
    </group>
  );
}

/**
 * A plotting compass — the small pivoted needle used to find the direction of
 * the field at a point. The red half of the needle is the north-seeking end.
 */
export function PlottingCompass({
  position,
  angle,
  y = 0.02,
  radius = 0.14,
  highlight = false,
}: {
  position: [number, number];
  angle: number;
  y?: number;
  radius?: number;
  highlight?: boolean;
}) {
  return (
    <group position={[position[0], y, position[1]]}>
      {/* Clear plastic case */}
      <mesh position={[0, 0.012, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, 0.024, 26]} />
        <meshStandardMaterial color={highlight ? "#fef3c7" : "#f8fafc"} roughness={0.42} transparent opacity={0.94} />
      </mesh>
      <mesh position={[0, 0.026, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 28]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Needle: red half points along the field */}
      <group position={[0, 0.03, 0]} rotation={[0, angle, 0]}>
        <mesh position={[radius * 0.36, 0, 0]}>
          <boxGeometry args={[radius * 0.72, 0.008, 0.022]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-radius * 0.36, 0, 0]}>
          <boxGeometry args={[radius * 0.72, 0.008, 0.022]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      </group>
      <mesh position={[0, 0.034, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.01, 10]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Iron filings sprinkled over the paper. Each filing is a tiny sliver that
 * turns to lie along the field, and they crowd together where the field is
 * strong — which is what makes the pattern visible.
 */
export function IronFilings({
  magnets,
  includeEarth = false,
  spacing = 0.19,
  extent = 2.35,
  y = 0.018,
}: {
  magnets: MagnetSpec[];
  includeEarth?: boolean;
  spacing?: number;
  extent?: number;
  y?: number;
}) {
  const filings = useMemo(() => {
    const items: { key: string; x: number; z: number; angle: number; strength: number }[] = [];
    for (let x = -extent; x <= extent; x += spacing) {
      for (let z = -extent * 0.78; z <= extent * 0.78; z += spacing) {
        /** A little jitter, so the filings do not look like a printed grid. */
        const jitterX = x + (Math.sin(x * 37.1 + z * 11.7) * spacing) / 3;
        const jitterZ = z + (Math.cos(x * 13.3 + z * 29.4) * spacing) / 3;
        const point = new THREE.Vector2(jitterX, jitterZ);
        const inMagnet = magnets.some((magnet) => {
          const local = point.clone().sub(new THREE.Vector2(magnet.x, magnet.z));
          local.rotateAround(new THREE.Vector2(0, 0), magnet.angle ?? 0);
          return Math.abs(local.x) < (magnet.length ?? MAGNET_LENGTH) / 2 + 0.03 && Math.abs(local.y) < MAGNET_WIDTH / 2 + 0.03;
        });
        if (inMagnet) continue;

        const field = totalFieldAt(point, magnets, includeEarth);
        const strength = field.length();
        if (strength < 0.08) continue;
        items.push({
          key: `${jitterX.toFixed(3)}-${jitterZ.toFixed(3)}`,
          x: jitterX,
          z: jitterZ,
          angle: Math.atan2(-field.y, field.x),
          strength,
        });
      }
    }
    return items;
  }, [extent, includeEarth, magnets, spacing]);

  return (
    <group>
      {filings.map((filing) => (
        <mesh
          key={filing.key}
          position={[filing.x, y, filing.z]}
          rotation={[0, filing.angle, 0]}
        >
          <boxGeometry args={[spacing * 0.68, 0.006, 0.014]} />
          <meshStandardMaterial
            color="#1f2937"
            roughness={0.62}
            metalness={0.45}
            transparent
            opacity={THREE.MathUtils.clamp(0.32 + filing.strength * 0.55, 0.3, 0.95)}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Draws a traced field line on the paper with an arrowhead showing N → S. */
export function FieldLine({
  points,
  colour = "#0f172a",
  y = 0.016,
  showArrow = true,
  lineWidth = 1.8,
}: {
  points: THREE.Vector2[];
  colour?: string;
  y?: number;
  showArrow?: boolean;
  lineWidth?: number;
}) {
  const path = useMemo(
    () => points.map((point) => [point.x, y, point.y] as [number, number, number]),
    [points, y],
  );

  const arrow = useMemo(() => {
    if (!showArrow || points.length < 6) return null;
    const index = Math.floor(points.length * 0.45);
    const here = points[index];
    const next = points[Math.min(points.length - 1, index + 2)];
    return { x: here.x, z: here.y, angle: Math.atan2(-(next.y - here.y), next.x - here.x) };
  }, [points, showArrow]);

  if (path.length < 2) return null;

  return (
    <group>
      <Line points={path} color={colour} lineWidth={lineWidth} />
      {arrow && (
        <mesh position={[arrow.x, y + 0.002, arrow.z]} rotation={[Math.PI / 2, 0, -arrow.angle + Math.PI / 2]}>
          <coneGeometry args={[0.035, 0.09, 3]} />
          <meshStandardMaterial color={colour} />
        </mesh>
      )}
    </group>
  );
}

/** A wooden stand that holds a small object up in front of a magnet. */
export function SpecimenStand({ position, height = 0.3 }: { position: [number, number, number]; height?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.015, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.16, 0.03, 20]} />
        <meshStandardMaterial color="#78350f" roughness={0.82} />
      </mesh>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, height, 12]} />
        <meshStandardMaterial color="#a16207" roughness={0.78} />
      </mesh>
    </group>
  );
}
