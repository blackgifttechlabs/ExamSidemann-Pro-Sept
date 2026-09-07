'use client';

import { useEffect, useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SHEET, bearing, dist, markPointAt, markTangentAt, rad, type Mark, type Pt } from './drawingGeometry';
import { drawMark, renderSheet } from './drawingRender';
import { boardRailFace, setSquareFace, tSquareFace } from './instrumentTextures';
import type { ToolId } from './drawingLessonTypes';
import type { SceneAnchorPoints } from '../../common/ExperimentNarrationCaptions';

/**
 * The 3D drawing board — a white A3 board with parallel motion, the kind sold
 * to first-year students, with instruments that carry real printed scales.
 *
 * Everything the lesson changes 60 times a second — the marks on the paper, the
 * pencil position, which instrument is in hand — arrives through a single
 * mutable ref rather than through props. The React tree inside `<Canvas>` is
 * therefore mounted once and never reconciled again; the frame loop reads the
 * ref, repaints the paper texture and slides the instruments. That is the
 * difference between a board that runs at 60 fps on a college laptop and one
 * that stutters.
 */

/* ------------------------------------------------------------ board layout */

/** Scene units are metres, so the sheet really is 420 × 297 mm. */
const MM = 0.001;
const PAPER_W = SHEET.width * MM;
const PAPER_H = SHEET.height * MM;

const BOARD_W = 0.545;
const BOARD_H = 0.405;
const BOARD_T = 0.018;
/** Width of the printed rail down the left and along the top. */
const RAIL = 0.03;
/** The board leans back on its stand, far edge raised. */
const TILT = 0.3;

/** Paper sits inside the rails, low and left, the way a student is taught. */
const PAPER_OFFSET_X = -0.012;
const PAPER_OFFSET_Y = -0.028;

/** The board's left edge, expressed in the paper's own coordinates. */
const BOARD_LEFT = -BOARD_W / 2 - PAPER_OFFSET_X;

/** Millimetres on the sheet → metres in the paper's local frame. */
const toLocal = (p: Pt): [number, number] => [
  (p.x - SHEET.width / 2) * MM,
  (SHEET.height / 2 - p.y) * MM,
];

/* --------------------------------------------------------------- the state */

export interface BoardState {
  marks: Mark[];
  drawing: { mark: Mark; t: number } | null;
  /**
   * What this step has put on the sheet, kept warm so the learner can tell it
   * apart from everything that was already there. It is the difference between
   * "there is a drawing on the board" and "that arc is the one he just swung".
   */
  fresh: Mark[] | null;
  ghost: Mark[] | null;
  tool: ToolId;
  /** Forced T-square blade position, in sheet mm down the page. */
  teeY?: number;
  compassRadius?: number;
  /** The region of the sheet the camera should lean towards when idle. */
  focus?: { at: Pt; r: number };
  /** Where the narration is pointing, in sheet mm. */
  focusPoint: Pt | null;
  /** A part of the instrument the narration is calling attention to. */
  alert?: { part: 'screw'; forbidden?: boolean } | null;
  /** Changes when the step changes, so the paper can be repainted from scratch. */
  revision: number;
}

export const emptyBoardState = (): BoardState => ({
  marks: [],
  drawing: null,
  fresh: null,
  ghost: null,
  tool: 'hand',
  focusPoint: null,
  revision: 0,
});

/* --------------------------------------------------------------- the paper */

/** Texture resolution. 4 px/mm keeps a 0.25 mm construction line a real line. */
const PX_PER_MM = 4;
/** The texture is re-uploaded at this rate; the instruments still move at 60. */
const REPAINT_MS = 34;

function Sheet({ stateRef }: { stateRef: MutableRefObject<BoardState> }) {
  // Two canvases: everything finished is painted once onto `base`, and each
  // repaint copies that and adds only the mark currently under the pencil.
  const { texture, base, live, baseCtx, liveCtx } = useMemo(() => {
    const width = Math.round(SHEET.width * PX_PER_MM);
    const height = Math.round(SHEET.height * PX_PER_MM);
    const baseCanvas = document.createElement('canvas');
    const liveCanvas = document.createElement('canvas');
    baseCanvas.width = width;
    baseCanvas.height = height;
    liveCanvas.width = width;
    liveCanvas.height = height;
    const map = new THREE.CanvasTexture(liveCanvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return {
      texture: map,
      base: baseCanvas,
      live: liveCanvas,
      baseCtx: baseCanvas.getContext('2d'),
      liveCtx: liveCanvas.getContext('2d'),
    };
  }, []);

  const painted = useRef({ count: -1, revision: -1, ghost: false, last: 0, activeT: -1 });

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame(() => {
    if (!baseCtx || !liveCtx) return;
    const state = stateRef.current;
    const now = performance.now();
    const memo = painted.current;

    const ghostOn = Boolean(state.ghost && state.ghost.length > 0);
    const baseStale =
      memo.count !== state.marks.length || memo.revision !== state.revision || memo.ghost !== ghostOn;
    const activeT = state.drawing ? state.drawing.t : -1;
    const liveStale = baseStale || Math.abs(activeT - memo.activeT) > 0.002;

    if (!liveStale || now - memo.last < REPAINT_MS) return;

    if (baseStale) {
      renderSheet(baseCtx, {
        scale: PX_PER_MM,
        marks: state.marks,
        ghost: state.ghost,
        highlight: state.fresh,
        paper: true,
      });
      memo.count = state.marks.length;
      memo.revision = state.revision;
      memo.ghost = ghostOn;
    }

    liveCtx.setTransform(1, 0, 0, 1, 0, 0);
    liveCtx.clearRect(0, 0, live.width, live.height);
    liveCtx.drawImage(base, 0, 0);
    if (state.drawing) drawMark(liveCtx, state.drawing.mark, state.drawing.t, PX_PER_MM, '#b45309');

    memo.activeT = activeT;
    memo.last = now;
    texture.needsUpdate = true;
  });

  return (
    <mesh receiveShadow>
      <planeGeometry args={[PAPER_W, PAPER_H]} />
      {/* The sheet carries its own light. Lit purely by the lamp it goes grey
          wherever the board turns away from it, and grey paper makes 2H
          construction lines invisible — so the same texture is fed back as an
          emissive map. White paper stays white; the graphite, being dark in the
          map, emits nothing and stays dark. */}
      <meshStandardMaterial
        map={texture}
        emissive="#ffffff"
        emissiveMap={texture}
        emissiveIntensity={0.5}
        roughness={0.95}
        metalness={0}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------- the tools */

/**
 * Where each instrument sits this frame.
 *
 * The instrument is chosen by the **mark being drawn**, not by the step. A step
 * may be labelled "compass" and still letter a point at the end of it, and an
 * arc must be swung by a compass whatever the step is called. Picking the tool
 * from the mark is what stops lines appearing on the paper with nothing in the
 * hand that could have drawn them.
 */
interface Pose {
  /** T-square drawing edge, in paper-local metres up the page. */
  bladeY: number;
  /** Straight edge laid along the stroke, or null when none is in use. */
  square: { kind: 'set45' | 'set30'; x: number; y: number; angle: number; flip: boolean } | null;
  /** Pencil tip and the direction it is travelling, in radians on the page. */
  pencil: { x: number; y: number; angle: number; down: boolean };
  /** Compass centre, opening, and where the lead currently is. */
  compass: { at: [number, number]; radius: number; lead: number } | null;
  eraser: { x: number; y: number } | null;
  /** A part of an instrument the narration is warning about. */
  alert: BoardState['alert'];
  /** True while a mark is actively being drawn. */
  drawing: boolean;
}

/** Idle parking spots, chosen to stay on the board rather than off its edge. */
const PARK_PENCIL: [number, number] = [0.145, -PAPER_H / 2 - 0.013];
const PARK_ERASER: [number, number] = [-0.15, -PAPER_H / 2 - 0.014];
const PARK_BLADE_Y = -PAPER_H / 2 - 0.012;
const PARK_SQUARE: [number, number] = [0.06, PAPER_H / 2 + 0.028];

/** A line within this many degrees of horizontal is drawn along the blade. */
const HORIZONTAL_TOLERANCE = 1.5;

/**
 * The straight run the pencil is on right now. A polygon is ruled one side at a
 * time — the square is lifted and re-laid for each — so the pose has to know
 * which side is being drawn, not just where the point is.
 */
function activeSegment(mark: Mark & { kind: 'line' | 'poly' }, t: number): [Pt, Pt] {
  if (mark.kind === 'line') return [mark.a, mark.b];

  const points = mark.close && mark.points.length > 2 ? [...mark.points, mark.points[0]] : mark.points;
  const spans = points.slice(1).map((point, index) => dist(points[index], point));
  const total = spans.reduce((sum, span) => sum + span, 0) || 1;
  let walked = Math.min(1, Math.max(0, t)) * total;
  for (let index = 0; index < spans.length; index += 1) {
    if (walked <= spans[index] || index === spans.length - 1) return [points[index], points[index + 1]];
    walked -= spans[index];
  }
  return [points[0], points[1] ?? points[0]];
}

function poseFor(state: BoardState): Pose {
  const mark = state.drawing?.mark;
  const t = state.drawing?.t ?? 0;
  const action = mark ? markPointAt(mark, t) : null;
  const tip: [number, number] = action ? toLocal(action) : PARK_PENCIL;
  const heading = mark ? markTangentAt(mark, t) : 0;

  /** Which square a step prefers when a slanting line needs one. */
  const preferredSquare: 'set45' | 'set30' = state.tool === 'set30' ? 'set30' : 'set45';

  let bladeY = state.teeY !== undefined ? toLocal({ x: 0, y: state.teeY })[1] : PARK_BLADE_Y;
  let square: Pose['square'] = null;
  let compass: Pose['compass'] = null;
  let eraser: Pose['eraser'] = null;
  let pencilDown = false;

  if (mark && (mark.kind === 'circle' || mark.kind === 'arc')) {
    // Swung, not slid: needle in the centre, lead on the point being drawn.
    // `lead` is the bearing from centre to lead — the direction the pair of
    // legs is pointing — not the tangent the pencil is travelling along.
    compass = { at: toLocal(mark.c), radius: mark.r * MM, lead: bearing(mark.c, action ?? mark.c) };
  } else if (mark && mark.kind === 'angle' && !mark.square) {
    compass = { at: toLocal(mark.at), radius: mark.r * MM, lead: bearing(mark.at, action ?? mark.at) };
  } else if (mark && (mark.kind === 'line' || mark.kind === 'poly')) {
    pencilDown = true;
    // Placed against the *whole* segment, not against the moving pencil. A
    // straight edge that slides along with the point is not how anybody draws:
    // you set the rule down, hold it, and run the pencil along it.
    const [from, to] = activeSegment(mark, t);
    const along = ((bearing(from, to) % 180) + 180) % 180;
    const flat = Math.abs(Math.sin(rad(along))) < Math.sin(rad(HORIZONTAL_TOLERANCE));
    const a = toLocal(from);
    const b = toLocal(to);

    if (flat) {
      // Horizontal work rides the blade itself — that is what a T-square is for.
      bladeY = a[1];
    } else {
      // Anchor the square's right angle at the lower end of the segment so its
      // upright edge runs up the whole line, and flip it over for lines leaning
      // the other way, exactly as you would turn the real thing over.
      const anchor = a[1] <= b[1] ? a : b;
      square = {
        kind: preferredSquare,
        x: anchor[0],
        y: anchor[1],
        angle: rad(along - 90),
        flip: along > 90,
      };
      bladeY = anchor[1] - 0.032;
    }
  } else if (mark) {
    // Dots, dimensions and lettering: freehand, pencil only.
    pencilDown = true;
  } else if (state.tool === 'compass' && state.compassRadius !== undefined) {
    // Nothing being drawn, but the step is about the compass itself — setting
    // the opening. Stand it on the sheet at the opening it is being set to, so
    // the learner watches it open as the narrator talks them through it. A
    // radius of zero is a shut compass, which is how a step that opens one
    // starts: it must be on screen and closed, not missing.
    const centre = state.focus?.at ?? { x: SHEET.width / 2, y: SHEET.height / 2 };
    compass = { at: toLocal(centre), radius: state.compassRadius * MM, lead: 0 };
  }

  if (state.tool === 'eraser') eraser = action ? { x: tip[0], y: tip[1] } : { x: PARK_ERASER[0], y: PARK_ERASER[1] };

  // The compass borrows the pencil, so the loose pencil goes back on the board.
  const pencil = compass
    ? { x: PARK_PENCIL[0], y: PARK_PENCIL[1], angle: 0, down: false }
    : { x: tip[0], y: tip[1], angle: rad(heading), down: pencilDown };

  // Nobody swings a compass over a straight edge. The moment the compass comes
  // out, the blade and the set square go back down to the foot of the board —
  // otherwise a circle is drawn straight across a T-square lying on the paper.
  if (compass) {
    bladeY = PARK_BLADE_Y;
    square = null;
  }

  return {
    bladeY,
    square:
      square ??
      (state.tool === 'set45' || state.tool === 'set30'
        ? { kind: preferredSquare, x: PARK_SQUARE[0], y: PARK_SQUARE[1], angle: 0, flip: false }
        : null),
    pencil,
    compass,
    eraser,
    alert: state.alert ?? null,
    drawing: action !== null,
  };
}

/** Eases a value towards a target at a rate that is frame-rate independent. */
const ease = (current: number, target: number, delta: number, rate = 9) =>
  current + (target - current) * (1 - Math.exp(-rate * delta));

/** Eases an angle the short way round, so it never spins the long way. */
const easeAngle = (current: number, target: number, delta: number, rate = 9) => {
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-rate * delta));
};
/* ----------------------------------------------------------------- T-square */

const BLADE_H = 0.052;
const BLADE_L = 0.56;

function TSquare({ poseRef }: { poseRef: MutableRefObject<Pose> }) {
  const group = useRef<THREE.Group>(null);
  const face = useMemo(() => tSquareFace(BLADE_L / MM, BLADE_H / MM), []);
  useEffect(() => () => face.dispose(), [face]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    // The blade is always on the board. Hiding it left steps where a line
    // appeared with no straight edge anywhere near it.
    node.position.y = ease(node.position.y, poseRef.current.bladeY - BLADE_H / 2, delta, 7);
  });

  return (
    <group ref={group} position={[0, -0.2, 0.0016]}>
      <mesh position={[BOARD_LEFT + BLADE_L / 2, 0, 0]} castShadow>
        <boxGeometry args={[BLADE_L, BLADE_H, 0.0032]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.28} metalness={0.04} transparent opacity={0.94} />
      </mesh>
      {/* The printed face, sitting a hair above the blade. */}
      <mesh position={[BOARD_LEFT + BLADE_L / 2, 0, 0.0018]}>
        <planeGeometry args={[BLADE_L, BLADE_H]} />
        <meshBasicMaterial map={face} transparent />
      </mesh>
      {/* The head: the part that must stay pressed against the board edge. */}
      <mesh position={[BOARD_LEFT - 0.014, 0, 0.004]} castShadow>
        <boxGeometry args={[0.028, 0.175, 0.014]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.42} metalness={0.15} />
      </mesh>
      <mesh position={[BOARD_LEFT - 0.014, 0, 0.0115]}>
        <boxGeometry args={[0.02, 0.16, 0.001]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------- set squares */

const SQUARE_SPEC = {
  set45: { run: 0.15, rise: 0.15, tint: 'rgba(253,186,116,0.42)', body: '#fb923c' },
  set30: { run: 0.17 / Math.tan(Math.PI / 3), rise: 0.17, tint: 'rgba(134,239,172,0.42)', body: '#4ade80' },
} as const;

function SetSquare({ poseRef, kind }: { poseRef: MutableRefObject<Pose>; kind: 'set45' | 'set30' }) {
  const group = useRef<THREE.Group>(null);
  const spec = SQUARE_SPEC[kind];

  const { geometry, face } = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(spec.run, 0);
    shape.lineTo(0, spec.rise);
    shape.closePath();
    return {
      geometry: new THREE.ExtrudeGeometry(shape, { depth: 0.0026, bevelEnabled: false }),
      face: setSquareFace(spec.run / MM, spec.rise / MM, spec.tint),
    };
  }, [spec]);

  useEffect(
    () => () => {
      geometry.dispose();
      face.dispose();
    },
    [geometry, face]
  );

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const square = poseRef.current.square;
    node.visible = square?.kind === kind;
    if (!square) return;
    node.position.x = ease(node.position.x, square.x, delta, 8);
    node.position.y = ease(node.position.y, square.y, delta, 8);
    // Turned so its upright working edge lies along the line being ruled, and
    // turned over so the body sits clear of the line rather than across it.
    node.rotation.z = easeAngle(node.rotation.z, square.angle, delta, 8);
    node.scale.x = ease(node.scale.x, square.flip ? -1 : 1, delta, 8);
  });

  return (
    <group ref={group} position={[0, -0.2, 0.0024]}>
      <mesh geometry={geometry} castShadow>
        <meshPhysicalMaterial
          color={spec.body}
          transparent
          opacity={0.26}
          roughness={0.07}
          metalness={0}
          transmission={0.4}
          thickness={0.003}
        />
      </mesh>
      {/* Printed scales and protractor, on a plane matching the triangle's box. */}
      <mesh position={[spec.run / 2, spec.rise / 2, 0.0029]}>
        <planeGeometry args={[spec.run, spec.rise]} />
        <meshBasicMaterial map={face} transparent />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ pencil */

/**
 * One pencil, built once and used twice: loose in the hand, and clamped into
 * the compass. Yellow hexagonal barrel, ribbed ferrule, pink eraser, and a
 * sharpened wood cone ending in a fine graphite point that sits at z = 0 —
 * the plane of the paper — so the point and the line can never drift apart.
 */
const BARREL_R = 0.0042;
/** Exposed lead, then the wood cone behind it — a properly sharpened pencil. */
const GRAPHITE = 0.0062;
const WOOD = 0.023;
const TIP = GRAPHITE * 0.62 + WOOD;

function PencilBody({ length = 0.15 }: { length?: number }) {
  return (
    <group>
      {/* Cones point their apex along +Y, and rotating -90° about X swings that
          onto -Z — towards the paper. Rotating +90° instead turns the pencil
          inside out and leaves a flat disc where the point should be. */}
      {/* Graphite point, apex exactly on the paper at z = 0. */}
      <mesh position={[0, 0, GRAPHITE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.0014, GRAPHITE, 14]} />
        <meshStandardMaterial color="#171b24" roughness={0.42} />
      </mesh>
      {/* The long sharpened wood, opening out to the full barrel width. */}
      <mesh position={[0, 0, GRAPHITE * 0.62 + WOOD / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[BARREL_R, WOOD, 18]} />
        <meshStandardMaterial color="#f0dcb4" roughness={0.72} />
      </mesh>
      {/* Hexagonal barrel. */}
      <mesh position={[0, 0, TIP + length / 2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[BARREL_R, BARREL_R, length, 6]} />
        <meshStandardMaterial color="#f0a830" roughness={0.34} />
      </mesh>
      {/* Ribbed silver ferrule. */}
      <mesh position={[0, 0, TIP + length + 0.007]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[BARREL_R + 0.0004, BARREL_R + 0.0004, 0.014, 16]} />
        <meshStandardMaterial color="#c3ccd6" roughness={0.26} metalness={0.75} />
      </mesh>
      {/* Pink eraser, domed at the end. */}
      <mesh position={[0, 0, TIP + length + 0.0185]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[BARREL_R, BARREL_R, 0.009, 16]} />
        <meshStandardMaterial color="#ef4a9b" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, TIP + length + 0.023]}>
        <sphereGeometry args={[BARREL_R, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ef4a9b" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Pencil({ poseRef }: { poseRef: MutableRefObject<Pose> }) {
  const group = useRef<THREE.Group>(null);
  const lean = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node || !lean.current) return;
    const pose = poseRef.current.pencil;
    // While the point is on the paper the tip is pinned exactly to the end of
    // the line: easing here leaves the pencil trailing a millimetre behind its
    // own stroke, which reads as the pencil drawing somewhere it is not. The
    // easing is kept for the travel between marks, where it is the difference
    // between a hand moving and a pencil teleporting.
    if (pose.down) {
      node.position.x = pose.x;
      node.position.y = pose.y;
    } else {
      node.position.x = ease(node.position.x, pose.x, delta, 18);
      node.position.y = ease(node.position.y, pose.y, delta, 18);
    }
    // Trailing behind the stroke, the way a pencil is actually pulled.
    node.rotation.z = easeAngle(node.rotation.z, pose.angle + Math.PI, delta, 10);
    // Standing up to draw; laid down on the board when it is not needed.
    lean.current.rotation.x = easeAngle(lean.current.rotation.x, pose.down ? -0.62 : -1.42, delta, 6);
  });

  return (
    <group ref={group}>
      <group ref={lean} rotation={[-0.62, 0, 0]}>
        <PencilBody />
      </group>
    </group>
  );
}

/* ----------------------------------------------------------------- compass */

/**
 * A spring-bow compass: flat chrome blade legs hinged under a thumb ring, a
 * curved wing bar with a knurled adjusting nut, a steel needle on one leg and
 * a real pencil clamped to the other.
 *
 * Both legs are the same length, so the hinge rides up as the opening closes —
 * which means the needle lands on the centre and the lead lands on the radius
 * without either being faked.
 */
const LEG = 0.135;

function CompassLeg({ tint = '#d6dde5', length = LEG }: { tint?: string; length?: number }) {
  const geometry = useMemo(() => {
    // A tapered blade running from the hinge (y = 0) down to the point. The
    // -90° rotation below swings that onto -Z, so the blade already starts at
    // the hinge — it must not be offset again.
    const shape = new THREE.Shape();
    shape.moveTo(-0.0042, 0);
    shape.lineTo(0.0042, 0);
    shape.lineTo(0.0013, length);
    shape.lineTo(-0.0013, length);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.0018, bevelEnabled: false });
  }, [length]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.0009, 0]} castShadow>
      <meshStandardMaterial color={tint} roughness={0.22} metalness={0.85} />
    </mesh>
  );
}

/**
 * The red no-entry sign: a ring with a bar across it, turned to face the
 * camera. It is what "do not touch that screw" looks like without words.
 */
function ForbiddenSign() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (group.current) group.current.quaternion.copy(camera.quaternion);
  });
  return (
    <group ref={group}>
      <mesh>
        <torusGeometry args={[0.016, 0.0038, 10, 28]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.03, 0.0072, 0.0038]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

/** Two full red pulses, then the colour is held so the warning stays readable. */
const FLASH_SECONDS = 1.7;

function Compass({ poseRef }: { poseRef: MutableRefObject<Pose> }) {
  const group = useRef<THREE.Group>(null);
  const legNeedle = useRef<THREE.Group>(null);
  const legPencil = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const nut = useRef<THREE.Mesh>(null);
  const sign = useRef<THREE.Group>(null);
  /** The opening actually on screen, which chases the one being asked for. */
  const opening = useRef(0);
  /** Seconds the current alert has been up, or null when there is none. */
  const alertAge = useRef<number | null>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node || !legNeedle.current || !legPencil.current || !hinge.current) return;

    /* ------------------------------------------------- the warning on the nut */
    const alert = poseRef.current.alert;
    alertAge.current = alert ? (alertAge.current ?? 0) + delta : null;

    const nutMaterial = nut.current?.material as THREE.MeshStandardMaterial | undefined;
    if (nutMaterial) {
      const age = alertAge.current;
      // Two pulses over FLASH_SECONDS, then held on so it stays obvious.
      const pulse =
        age === null ? 0 : age < FLASH_SECONDS ? Math.abs(Math.sin((age / FLASH_SECONDS) * Math.PI * 2)) : 0.72;
      nutMaterial.emissive.setHex(0xdc2626);
      nutMaterial.emissiveIntensity = pulse;
      nutMaterial.color.setHex(pulse > 0.15 ? 0x991b1b : 0x1f2937);
    }
    if (sign.current) {
      // The sign arrives once the flashing has said its piece.
      const wanted = alert?.forbidden && (alertAge.current ?? 0) > FLASH_SECONDS * 0.55 ? 1 : 0;
      const scale = ease(sign.current.scale.x, wanted, delta, 9);
      sign.current.scale.setScalar(scale);
      // Kept in the scene until it has shrunk away, so it eases out rather than
      // vanishing the moment the narrator moves on.
      sign.current.visible = scale > 0.02;
    }

    const pose = poseRef.current.compass;
    node.visible = pose !== null;
    if (!pose) return;

    const [cx, cy] = pose.at;
    const wanted = Math.min(pose.radius, LEG * 1.85);
    // The legs open, they do not jump: a step that talks the learner through
    // setting the opening — shut, out to halfway, then past it — is only worth
    // anything if the opening can be watched changing. But an arc being swung
    // takes its radius exactly, or the lead would ride off the arc it is
    // supposed to be drawing.
    // The lesson already ramps the opening across the sentence that asks for
    // it, so this only has to take the edge off a step change rather than do
    // the opening itself — hence a rate that tracks closely.
    opening.current = poseRef.current.drawing
      ? wanted
      : ease(opening.current, wanted, delta, 7);
    const radius = opening.current;

    // A protractor bearing on the sheet is the same angle counter-clockwise in
    // the paper's own frame, so it can drive the rotation directly.
    const lead = rad(pose.lead);

    // The group sits midway between needle and lead and turns to face the lead.
    node.position.x = ease(node.position.x, cx + (Math.cos(lead) * radius) / 2, delta, 16);
    node.position.y = ease(node.position.y, cy + (Math.sin(lead) * radius) / 2, delta, 16);
    node.rotation.z = easeAngle(node.rotation.z, lead, delta, 16);

    const half = Math.min(radius / 2, LEG * 0.92);
    const splay = Math.asin(half / LEG);
    hinge.current.position.z = Math.sqrt(Math.max(0.0001, LEG * LEG - half * half));
    legNeedle.current.rotation.y = splay;
    legPencil.current.rotation.y = -splay;
  });

  return (
    <group ref={group}>
      <group ref={hinge} position={[0, 0, 0.12]}>
        {/* Hinge boss and the thumb ring you spin it by. */}
        <mesh position={[0, 0, 0.006]}>
          <cylinderGeometry args={[0.0068, 0.0068, 0.014, 18]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.24} metalness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.011, 0.0022, 10, 26]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.24} metalness={0.9} />
        </mesh>

        {/* Needle leg, carrying the curved wing bar and its knurled nut. */}
        <group ref={legNeedle}>
          <CompassLeg />
          <mesh position={[0, 0, -LEG + 0.007]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.0016, 0.014, 12]} />
            <meshStandardMaterial color="#e8edf3" roughness={0.14} metalness={0.95} />
          </mesh>
          {/* The wing: a curved bar sweeping from straight-down across towards
              the other leg, with the knurled adjusting nut riding on it. */}
          <group rotation={[0, Math.PI / 2, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.046, 0.0016, 8, 26, 1.0]} />
              <meshStandardMaterial color="#d6dde5" roughness={0.22} metalness={0.85} />
            </mesh>
          </group>
          {/* The knurled adjusting nut — the screw the narration warns about. */}
          <mesh ref={nut} position={[0, 0, -0.046]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.0044, 0.0044, 0.008, 16]} />
            <meshStandardMaterial color="#1f2937" roughness={0.55} />
          </mesh>
          <group ref={sign} position={[0, 0.026, -0.046]} scale={0}>
            <ForbiddenSign />
          </group>
        </group>

        {/* Pencil leg: the blade stops short and a real pencil is clamped on. */}
        <group ref={legPencil}>
          <CompassLeg length={LEG * 0.66} />
          {/* Clamp block and its thumbscrew. */}
          <mesh position={[0.0032, 0, -LEG * 0.66]}>
            <boxGeometry args={[0.013, 0.009, 0.014]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.28} metalness={0.82} />
          </mesh>
          <mesh position={[0.0105, 0, -LEG * 0.66]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.0032, 0.0032, 0.008, 12]} />
            <meshStandardMaterial color="#1f2937" roughness={0.5} />
          </mesh>
          {/* The pencil itself, point on the paper. */}
          {/* The pencil, clamped on with its point on the paper at z = -LEG. */}
          <group position={[0.0052, 0, -LEG]}>
            <PencilBody length={0.062} />
          </group>
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ eraser */

function Eraser({ poseRef }: { poseRef: MutableRefObject<Pose> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const pose = poseRef.current.eraser;
    node.visible = pose !== null;
    if (!pose) return;
    node.position.x = ease(node.position.x, pose.x, delta, 10);
    node.position.y = ease(node.position.y, pose.y, delta, 10);
  });

  return (
    <group ref={group} position={[0.1, 0, 0.005]}>
      <mesh castShadow>
        <boxGeometry args={[0.044, 0.021, 0.011]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0, 0.0058]}>
        <boxGeometry args={[0.026, 0.013, 0.0006]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.6} />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------------- the board */

function Board({
  stateRef,
  anchorsRef,
}: {
  stateRef: MutableRefObject<BoardState>;
  anchorsRef: MutableRefObject<SceneAnchorPoints>;
}) {
  const poseRef = useRef<Pose>(poseFor(emptyBoardState()));
  const paper = useRef<THREE.Group>(null);

  const topRail = useMemo(() => boardRailFace(BOARD_W / MM, RAIL / MM), []);
  const leftRail = useMemo(() => boardRailFace(BOARD_H / MM, RAIL / MM, true), []);
  useEffect(
    () => () => {
      topRail.dispose();
      leftRail.dispose();
    },
    [topRail, leftRail]
  );

  useFrame(() => {
    poseRef.current = poseFor(stateRef.current);
  });

  return (
    <group rotation={[TILT, 0, 0]}>
      {/* White plastic board, top face at y = 0. */}
      <mesh position={[0, -BOARD_T / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[BOARD_W, BOARD_T, BOARD_H]} />
        <meshStandardMaterial color="#f4f6fa" roughness={0.55} metalness={0.02} />
      </mesh>
      {/* Grey rim around the outside. It has to stay *below* the top face —
          a box that merely surrounds the board would cap it, and the paper
          (which sits less than a millimetre proud) would vanish underneath. */}
      <mesh position={[0, -BOARD_T / 2 - 0.0025, 0]} receiveShadow>
        <boxGeometry args={[BOARD_W + 0.016, BOARD_T, BOARD_H + 0.016]} />
        <meshStandardMaterial color="#b8c2cf" roughness={0.6} metalness={0.05} />
      </mesh>
      {/* The machined edge the T-square head runs against, standing just proud
          of the board so the head has something to hold on to. */}
      <mesh position={[-BOARD_W / 2 - 0.009, -BOARD_T / 2 + 0.002, 0]} receiveShadow>
        <boxGeometry args={[0.014, BOARD_T + 0.006, BOARD_H + 0.016]} />
        <meshStandardMaterial color="#8fa0b4" roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Everything from here on lives in the paper's frame: x right, y up the
          page, z out of the board — so a point in sheet millimetres places
          itself with one call to `toLocal`. */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        {/* Printed rails, positioned in board coordinates rather than paper. */}
        <mesh position={[0, BOARD_H / 2 - RAIL / 2, 0.0004]}>
          <planeGeometry args={[BOARD_W, RAIL]} />
          <meshBasicMaterial map={topRail} />
        </mesh>
        <mesh position={[-BOARD_W / 2 + RAIL / 2, 0, 0.0004]}>
          <planeGeometry args={[RAIL, BOARD_H]} />
          <meshBasicMaterial map={leftRail} />
        </mesh>

        <group ref={paper} position={[PAPER_OFFSET_X, PAPER_OFFSET_Y, 0.0008]}>
          <Sheet stateRef={stateRef} />
          <Tape />
          <TSquare poseRef={poseRef} />
          <SetSquare poseRef={poseRef} kind="set45" />
          <SetSquare poseRef={poseRef} kind="set30" />
          <Compass poseRef={poseRef} />
          <Pencil poseRef={poseRef} />
          <Eraser poseRef={poseRef} />
          <FocusProbe stateRef={stateRef} paperRef={paper} anchors={anchorsRef} />
        </group>
      </group>
    </group>
  );
}

function Tape() {
  const corners: [number, number][] = [
    [-PAPER_W / 2, PAPER_H / 2],
    [PAPER_W / 2, PAPER_H / 2],
    [-PAPER_W / 2, -PAPER_H / 2],
    [PAPER_W / 2, -PAPER_H / 2],
  ];
  return (
    <>
      {corners.map(([x, y], index) => (
        <mesh key={index} position={[x, y, 0.0004]} rotation={[0, 0, index % 2 === 0 ? 0.78 : -0.78]}>
          <planeGeometry args={[0.04, 0.013]} />
          <meshStandardMaterial color="#e7d8a8" transparent opacity={0.7} roughness={0.9} />
        </mesh>
      ))}
    </>
  );
}

/**
 * Projects the point the narration is talking about onto the screen, so the
 * shared pointing hand can sit on it while the camera moves.
 */
function FocusProbe({
  stateRef,
  paperRef,
  anchors,
}: {
  stateRef: MutableRefObject<BoardState>;
  paperRef: MutableRefObject<THREE.Group | null>;
  anchors: MutableRefObject<SceneAnchorPoints>;
}) {
  const { camera, gl } = useThree();
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const point = stateRef.current.focusPoint;
    const node = paperRef.current;
    if (!point || !node) {
      anchors.current = { focus: { x: 0, y: 0, visible: false } };
      return;
    }
    const [lx, ly] = toLocal(point);
    scratch.set(lx, ly, 0.012);
    node.localToWorld(scratch);
    scratch.project(camera);
    const rect = gl.domElement.getBoundingClientRect();
    const x = rect.left + ((scratch.x + 1) / 2) * rect.width;
    const y = rect.top + ((1 - scratch.y) / 2) * rect.height;
    anchors.current = {
      focus: {
        x,
        y,
        visible: scratch.z > -1 && scratch.z < 1 && x > rect.left - 40 && x < rect.right + 40,
      },
    };
  });

  return null;
}

/* ---------------------------------------------------------- camera framing */

const HOME = new THREE.Vector3(0, 0.79, 0.63);
const HOME_TARGET = new THREE.Vector3(0, -0.01, 0.02);
/**
 * Straight out from the face of the tilted board. Putting the camera on this
 * axis gives the learner the draughtsperson's view shown in the reference:
 * the sheet is square to the screen and the T-square edge cannot hide the
 * line through perspective foreshortening.
 */
const BOARD_FACE_NORMAL = new THREE.Vector3(0, Math.cos(TILT), Math.sin(TILT));

/**
 * One close teaching zoom for the whole course. At roughly a 210 mm working
 * window, the A3 width fills a wide player like the reference image instead of
 * leaving the whole board, stand and desk in shot. Individual lesson focus
 * radii used to make compass and set-square steps fall back to distant views.
 */
const TEACHING_VIEW_RADIUS_MM = 105;

/** Sheet millimetres → the world point on the tilted board. */
function sheetToWorld(point: Pt, out: THREE.Vector3) {
  const [lx, ly] = toLocal(point);
  const across = lx + PAPER_OFFSET_X;
  const along = ly + PAPER_OFFSET_Y;
  return out.set(across, Math.sin(TILT) * along, -Math.cos(TILT) * along);
}

/**
 * How far back the camera has to stand for a circle of `radius` millimetres on
 * the sheet to fill the frame.
 *
 * Derived from the lens rather than tuned by hand, because the answer depends
 * on the viewport: the same lesson has to be readable on a laptop and on a
 * phone held upright, where the frame is narrow and the camera must stand
 * further back. Framing by a fixed distance is what left the drawing as a
 * cluster of hairlines in the middle of a big empty sheet.
 */
function fitDistance(camera: THREE.Camera, radiusMm: number) {
  const lens = camera as THREE.PerspectiveCamera;
  const half = Math.tan(rad(lens.fov ?? 30) / 2);
  const aspect = lens.aspect || 1;
  const radius = Math.max(0.018, radiusMm * MM);
  // The board is tilted away from the camera, so what is being framed is
  // foreshortened; the 1.16 covers that and leaves a little air round the edge.
  const distance = (radius / half) * 1.16 / Math.min(1, aspect);
  return THREE.MathUtils.clamp(distance, 0.24, 1.5);
}

function AutoFrame({ stateRef, enabled }: { stateRef: MutableRefObject<BoardState>; enabled: boolean }) {
  const { camera, controls } = useThree();
  const desired = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const orbit = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (!enabled || !orbit) return;

    const state = stateRef.current;
    const topDown = state.tool === 'tsquare';
    const distance = fitDistance(camera, TEACHING_VIEW_RADIUS_MM);

    if (state.drawing) {
      // Follow the lead itself. The generous, fixed teaching frame keeps this
      // movement calm instead of turning it into a tight chase camera.
      sheetToWorld(markPointAt(state.drawing.mark, state.drawing.t), desiredTarget);
    } else if (state.focusPoint) {
      sheetToWorld(state.focusPoint, desiredTarget);
    } else if (state.focus) {
      sheetToWorld(state.focus.at, desiredTarget);
    } else if (topDown) {
      // Begin moving before the pencil touches down. This makes the spoken
      // setup useful camera-transition time instead of spending the opening
      // part of the stroke changing angle.
      sheetToWorld(
        { x: SHEET.width / 2, y: state.teeY ?? SHEET.height / 2 },
        desiredTarget
      );
    } else {
      desiredTarget.copy(HOME_TARGET);
      desired.copy(HOME);
      const homeRate = 1 - Math.exp(-1.6 * delta);
      camera.position.lerp(desired, homeRate);
      orbit.target.lerp(desiredTarget, homeRate);
      orbit.update();
      return;
    }

    // T-square work is watched perpendicular to the board, like looking
    // straight down at a drawing sheet. Other tools retain the slightly
    // oblique workshop view that makes their height and movement readable.
    if (topDown) {
      desired.copy(desiredTarget).addScaledVector(BOARD_FACE_NORMAL, distance);
    } else {
      // Straight in front of whatever is being looked at. Offsetting the camera
      // sideways from the target throws the sheet into the corner of the frame.
      desired.set(
        desiredTarget.x,
        desiredTarget.y + distance * 0.79,
        desiredTarget.z + distance * 0.62
      );
    }

    // Move promptly into the overhead teaching view before much of the ruled
    // line has appeared. Other tools keep the slower, considered push-in.
    const rate = 1 - Math.exp(-(state.drawing ? 2.35 : topDown ? 2.2 : 1.6) * delta);
    camera.position.lerp(desired, rate);
    orbit.target.lerp(desiredTarget, rate);
    orbit.update();
  });

  return null;
}

/* ------------------------------------------------------------------ export */

export interface DrawingBoardSceneProps {
  stateRef: MutableRefObject<BoardState>;
  anchorsRef: MutableRefObject<SceneAnchorPoints>;
  /** False once the learner has dragged the view themselves. */
  autoFrame: boolean;
  /** Follows the page, so the studio does not glow in a lit room. */
  theme: 'light' | 'dark';
}

export function DrawingBoardScene({ stateRef, anchorsRef, autoFrame, theme }: DrawingBoardSceneProps) {
  const dark = theme === 'dark';
  const backdrop = dark ? '#0b1020' : '#dfe6ef';
  const desk = dark ? '#243044' : '#c3ccd8';

  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.79, 0.63], fov: 30, near: 0.02, far: 20 }}
      style={{ touchAction: 'none' }}
      // ACES tone mapping is r3f's default and it turns white cartridge paper
      // into grey card. A drawing board wants the paper's real value, so the
      // graphite reads dark against it.
      gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
    >
      <color attach="background" args={[backdrop]} />
      <fog attach="fog" args={[backdrop, 1.6, 4.6]} />

      <ambientLight intensity={dark ? 0.5 : 0.62} />
      <hemisphereLight args={['#ffffff', dark ? '#1e293b' : '#8b98a8', dark ? 0.42 : 0.5]} />
      {/* The drawing office lamp: high and to the left, as a right-handed
          student needs so their own hand does not shadow the line. */}
      <directionalLight
        position={[-0.85, 1.35, 0.75]}
        intensity={dark ? 1.25 : 1.35}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-0.7}
        shadow-camera-right={0.7}
        shadow-camera-top={0.7}
        shadow-camera-bottom={-0.7}
        shadow-bias={-0.0009}
      />
      <pointLight position={[0.55, 0.5, 0.55]} intensity={dark ? 0.35 : 0.2} color="#fde68a" />

      <Board stateRef={stateRef} anchorsRef={anchorsRef} />

      {/* Desk the board is standing on. */}
      <mesh position={[0, -0.088, 0.1]} receiveShadow>
        <boxGeometry args={[1.5, 0.03, 0.9]} />
        <meshStandardMaterial color={desk} roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.052, -0.165]} rotation={[TILT, 0, 0]}>
        <boxGeometry args={[0.34, 0.058, 0.03]} />
        <meshStandardMaterial color={dark ? '#1b2434' : '#9aa6b5'} roughness={0.7} />
      </mesh>
      <ContactShadows position={[0, -0.071, 0.06]} opacity={dark ? 0.42 : 0.3} scale={1.6} blur={2.4} far={0.4} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={0.2}
        maxDistance={1.7}
        minPolarAngle={0.12}
        maxPolarAngle={1.32}
        target={[0, -0.01, 0.02]}
      />
      <AutoFrame stateRef={stateRef} enabled={autoFrame} />
    </Canvas>
  );
}
