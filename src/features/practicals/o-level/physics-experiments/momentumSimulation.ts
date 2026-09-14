import * as THREE from "three";

export const TRACK_HALF = 1.35;
export const TRACK_VISUAL_HALF = 2.5;
export const M_TO_UNITS = TRACK_VISUAL_HALF / TRACK_HALF;
export const TRACK_SURFACE_Y = 0.075;
export const CAR_LENGTH = 0.54;
// Include a 2 mm scene-space clearance between the two front bumpers.
export const CONTACT_GAP = (CAR_LENGTH + 0.002) / M_TO_UNITS;
export const CAR_MODEL = "/models/simple_car_lowpoly_rigged.glb";
const WHEEL_NAMES = ["wheel_FR_3", "wheel_FL_5", "wheel_BR_7", "wheel_BL_9"];

export type CollisionKind = "sticky" | "springy";

export function collisionResult(kind: CollisionKind, m1: number, m2: number, u1: number, u2: number) {
  if (kind === "sticky") {
    const v = (m1 * u1 + m2 * u2) / (m1 + m2);
    return { v1: v, v2: v };
  }
  return {
    v1: ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2),
    v2: ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2),
  };
}

export interface MomentumState {
  x1: number;
  x2: number;
  v1: number;
  v2: number;
  collided: boolean;
}

/** Integrate up to contact, exchange momentum, then finish the same frame. */
export function advanceMomentum(state: MomentumState, dt: number, kind: CollisionKind, m1: number, m2: number) {
  const approach = state.v1 - state.v2;
  const contactTime = !state.collided && approach > 0
    ? Math.max(0, (state.x2 - state.x1 - CONTACT_GAP) / approach)
    : Infinity;
  const hits = contactTime <= dt;
  const before = hits ? contactTime : dt;
  state.x1 += state.v1 * before;
  state.x2 += state.v2 * before;
  if (hits) {
    state.x2 = state.x1 + CONTACT_GAP;
    Object.assign(state, collisionResult(kind, m1, m2, state.v1, state.v2));
    state.collided = true;
    state.x1 += state.v1 * (dt - before);
    state.x2 += state.v2 * (dt - before);
  }
  // Avoid accumulated floating-point drift in the coupled pair.
  if (state.collided && kind === "sticky") state.x2 = state.x1 + CONTACT_GAP;
  return hits;
}

/** Independent wheel pivots and a grounded, centred model, all in scene units. */
export function prepareMomentumCar(source: THREE.Group) {
  const model = source.clone(true);
  model.updateMatrixWorld(true);
  const bounds = new THREE.Box3().setFromObject(model, true);
  const centre = bounds.getCenter(new THREE.Vector3());
  const scale = CAR_LENGTH / (bounds.max.z - bounds.min.z);
  const wheels: { pivot: THREE.Group; radius: number }[] = [];
  let groundY = Infinity;

  for (const name of WHEEL_NAMES) {
    const wheel = model.getObjectByName(name);
    if (!wheel) throw new Error(`Missing car wheel: ${name}`);
    const wheelCentre = new THREE.Box3().setFromObject(wheel, true).getCenter(new THREE.Vector3());
    let radius = 0;
    const vertex = new THREE.Vector3();
    wheel.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      const positions = mesh.geometry.getAttribute("position");
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld);
        radius = Math.max(radius, Math.hypot(vertex.y - wheelCentre.y, vertex.z - wheelCentre.z));
      }
    });
    groundY = Math.min(groundY, wheelCentre.y - radius);
    const pivot = new THREE.Group();
    pivot.name = `${name}_roll`;
    pivot.position.copy(model.worldToLocal(wheelCentre.clone()));
    model.add(pivot);
    model.updateMatrixWorld(true);
    pivot.attach(wheel);
    wheels.push({ pivot, radius: radius * scale });
  }

  model.position.set(-centre.x, -groundY, -centre.z);
  model.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
  // The centring and ground offsets MUST be inside the scaled group. Scaling
  // the primitive itself leaves its position unscaled, floating/overlapping cars.
  const vehicle = new THREE.Group();
  vehicle.scale.setScalar(scale);
  vehicle.add(model);
  return { vehicle, wheels, height: (bounds.max.y - groundY) * scale };
}

export function rollMomentumWheels(wheels: ReturnType<typeof prepareMomentumCar>["wheels"], distance: number, facing: 1 | -1) {
  for (const { pivot, radius } of wheels) pivot.rotation.x = distance * facing / radius;
}
