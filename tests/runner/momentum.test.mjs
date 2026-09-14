import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { build } from 'esbuild';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const { outputFiles } = await build({
  entryPoints: ['src/features/practicals/o-level/physics-experiments/momentumSimulation.ts'],
  bundle: true, write: false, platform: 'node', format: 'esm',
});
const {
  prepareMomentumCar, rollMomentumWheels, advanceMomentum,
  CAR_LENGTH, CONTACT_GAP, M_TO_UNITS, TRACK_SURFACE_Y,
} = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);

// Load the real GLB geometry and node transforms. Textures are irrelevant to
// ground/contact assertions and require browser image APIs, so stub only those.
const loader = new GLTFLoader();
loader.register(() => ({ name: 'geometry-test-textures', loadTexture: () => Promise.resolve(new THREE.Texture()) }));
const bytes = await readFile('public/models/simple_car_lowpoly_rigged.glb');
const { scene } = await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
const original = new THREE.Box3().setFromObject(scene, true).clone();
const cars = [prepareMomentumCar(scene), prepareMomentumCar(scene)];
const roots = cars.map((car, i) => {
  const root = new THREE.Group();
  root.rotation.y = (i === 0 ? 1 : -1) * Math.PI / 2;
  root.position.set(i * CONTACT_GAP * M_TO_UNITS, TRACK_SURFACE_Y, 0);
  root.add(car.vehicle);
  return root;
});

for (let i = 0; i < cars.length; i++) {
  const car = cars[i];
  assert.equal(car.wheels.length, 4);
  const initial = new THREE.Box3().setFromObject(roots[i], true);
  assert.ok(Math.abs(initial.getSize(new THREE.Vector3()).x - CAR_LENGTH) < 1e-6);
  assert.ok(Math.abs((initial.max.x + initial.min.x) / 2 - roots[i].position.x) < 1e-6, 'Scaled car must be centred at its physics position');
  for (let angle = 0; angle <= Math.PI * 2; angle += Math.PI / 12) {
    rollMomentumWheels(car.wheels, angle * car.wheels[0].radius, i === 0 ? 1 : -1);
    roots[i].updateMatrixWorld(true);
    for (const { pivot } of car.wheels) {
      const wheel = new THREE.Box3().setFromObject(pivot, true);
      assert.ok(wheel.min.y >= TRACK_SURFACE_Y - 0.0001, 'Tyres must not sink into the runway');
      assert.ok(wheel.min.y <= TRACK_SURFACE_Y + 0.0005, 'Every tyre must stay on the runway throughout a revolution');
    }
  }
}
const left = new THREE.Box3().setFromObject(roots[0], true);
const right = new THREE.Box3().setFromObject(roots[1], true);
assert.ok(right.min.x - left.max.x >= 0, 'Facing cars must not overlap at physics contact');
assert.ok(right.min.x - left.max.x < 0.005, 'The visual collision must occur at the bumpers');
assert.deepEqual(new THREE.Box3().setFromObject(scene, true), original, 'Preparing cars must not mutate the cached GLB');
const otherAngle = cars[1].wheels[0].pivot.rotation.x;
rollMomentumWheels(cars[0].wheels, 1, 1);
assert.equal(cars[1].wheels[0].pivot.rotation.x, otherAngle, 'The two cars must have independent wheel pivots');
rollMomentumWheels(cars[0].wheels, 0, 1);
assert.equal(cars[0].wheels[0].pivot.rotation.x, 0, 'Reset must restore wheel pose');

let scenarios = 0;
for (const kind of ['sticky', 'springy']) for (const m1 of [0.8, 1.3, 1.8]) for (const m2 of [0.8, 1.3, 1.8]) {
  for (const u1 of [0.4, 0.6, 0.8, 1]) for (const u2 of [0, -0.35]) for (const dt of [1 / 120, 1 / 30, 0.05]) {
    const state = { x1: -1.05, x2: 0.15, v1: u1, v2: u2, collided: false };
    const momentum = m1 * u1 + m2 * u2;
    const energy = (m1 * u1 ** 2 + m2 * u2 ** 2) / 2;
    let hits = 0;
    for (let time = 0; time < 5; time += dt) {
      if (advanceMomentum(state, dt, kind, m1, m2)) hits++;
      assert.ok(state.x2 - state.x1 >= CONTACT_GAP - 1e-9, 'Cars must never interpenetrate');
      assert.ok(Math.abs(m1 * state.v1 + m2 * state.v2 - momentum) < 1e-9, 'Momentum must be conserved');
      if (kind === 'springy') assert.ok(Math.abs((m1 * state.v1 ** 2 + m2 * state.v2 ** 2) / 2 - energy) < 1e-9);
      else if (state.collided) assert.ok(Math.abs(state.x2 - state.x1 - CONTACT_GAP) < 1e-9);
    }
    assert.equal(hits, 1, 'Resolve a collision exactly once');
    scenarios++;
  }
}

// One frame crosses contact: it must spend the remaining time at the new speed.
const crossing = { x1: 0, x2: CONTACT_GAP + 0.01, v1: 1, v2: 0, collided: false };
advanceMomentum(crossing, 0.05, 'sticky', 1, 1);
assert.ok(Math.abs(crossing.x1 - 0.03) < 1e-9);
console.log(`Real GLB ground/contact/wheel checks and ${scenarios} collision scenarios passed.`);
