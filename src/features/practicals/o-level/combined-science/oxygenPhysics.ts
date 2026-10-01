/** Dimensions are scene metres. Gas amount is expressed at atmospheric pressure. */
export const OXYGEN_APPARATUS = {
  beakerRadius: 0.405,
  reservoirLevel: 0.66,
  tubeMouth: 0.48,
  tubeRadius: 0.058,
  tubeStraightLength: 0.60,
  stemTip: 0.29,
} as const;
const ATMOSPHERE = 101325;
const WATER_DENSITY = 998;
const GRAVITY = 9.81;
const area = Math.PI * OXYGEN_APPARATUS.tubeRadius ** 2;
export const TUBE_CAPACITY = area * OXYGEN_APPARATUS.tubeStraightLength
  + 2 / 3 * Math.PI * OXYGEN_APPARATUS.tubeRadius ** 3;
export function tubeWaterVolume(height: number) {
  const radius = OXYGEN_APPARATUS.tubeRadius;
  const straight = OXYGEN_APPARATUS.tubeStraightLength;
  const h = Math.max(0, Math.min(straight + radius, height));
  const domeHeight = Math.max(0, h - straight);
  return area * Math.min(h, straight) + Math.PI * (radius ** 2 * domeHeight - domeHeight ** 3 / 3);
}
/** PV is conserved while gas pressure balances the water head in the inverted tube. */
export function gasWaterEquilibrium(amount: number) {
  const referenceVolume = Math.max(0, Math.min(1, amount)) * TUBE_CAPACITY;
  let low = 0, high = OXYGEN_APPARATUS.tubeStraightLength + OXYGEN_APPARATUS.tubeRadius;
  for (let i = 0; i < 36; i++) {
    const height = (low + high) / 2;
    const displacedVolume = TUBE_CAPACITY - tubeWaterVolume(height);
    const reservoirLevel = OXYGEN_APPARATUS.reservoirLevel + displacedVolume / (Math.PI * OXYGEN_APPARATUS.beakerRadius ** 2);
    const pressure = ATMOSPHERE + WATER_DENSITY * GRAVITY * (reservoirLevel - OXYGEN_APPARATUS.tubeMouth - height);
    if (pressure * displacedVolume > ATMOSPHERE * referenceVolume) low = height;
    else high = height;
  }
  const waterHeight = (low + high) / 2;
  const gasVolume = TUBE_CAPACITY - tubeWaterVolume(waterHeight);
  const reservoirLevel = OXYGEN_APPARATUS.reservoirLevel + gasVolume / (Math.PI * OXYGEN_APPARATUS.beakerRadius ** 2);
  return { waterHeight, gasVolume, reservoirLevel,
    pressure: ATMOSPHERE + WATER_DENSITY * GRAVITY * (reservoirLevel - OXYGEN_APPARATUS.tubeMouth - waterHeight) };
}
/** Exact integration of buoyant ascent with linear drag; stable across frame rates. */
export function advanceOxygenBubble(y: number, velocity: number, radius: number, seconds: number) {
  const dt = Math.max(0, seconds);
  const terminal = 0.14 + Math.max(0.001, radius) * 9;
  const relaxation = 0.15;
  const decay = Math.exp(-dt / relaxation);
  return { y: y + terminal * dt + (velocity - terminal) * relaxation * (1 - decay),
    velocity: terminal + (velocity - terminal) * decay };
}
