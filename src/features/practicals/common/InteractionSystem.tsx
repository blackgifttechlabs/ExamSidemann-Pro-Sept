import * as THREE from "three";

export interface Interactable {
  id: string;
  position: THREE.Vector3;
  radius: number;
  label: string;
  icon?: string;
  hold?: boolean;
  disabled?: boolean;
  onActivate: () => void;
  onRelease?: () => void;
}

// Picks the best interactable currently within reach and roughly in front of
// the player. Used every frame by both the desktop "press E" prompt and the
// mobile contextual action button, so both input paths agree on a target.
export function resolveActiveInteractable(
  interactables: Interactable[],
  playerPosition: THREE.Vector3,
  lookDirection: THREE.Vector3,
  maxLookAngle = 1.05
): Interactable | null {
  let best: Interactable | null = null;
  let bestScore = Infinity;

  for (const item of interactables) {
    if (item.disabled) continue;
    const toItem = item.position.clone().sub(playerPosition);
    const distance = toItem.length();
    if (distance > item.radius) continue;
    if (distance > 0.0001) toItem.normalize();
    const angle = Math.acos(THREE.MathUtils.clamp(toItem.dot(lookDirection), -1, 1));
    if (angle > maxLookAngle) continue;
    const score = distance + angle * 0.6;
    if (score < bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return best;
}
