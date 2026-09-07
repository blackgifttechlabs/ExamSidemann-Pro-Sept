"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { SceneAnchorPoints } from "./ExperimentNarrationCaptions";

/**
 * Projects named points in the 3D scene onto the screen every frame so the
 * narration hand can point at the cannon, the muzzle or the ball itself and
 * stay on them while the camera moves and the barrel swings.
 *
 * Drop it inside the experiment's `<Canvas>`. It renders nothing.
 */
export function NarrationSceneAnchors({
  anchorsRef,
  pointsRef,
}: {
  /** World positions, refreshed by the experiment on each render. */
  anchorsRef: MutableRefObject<Record<string, THREE.Vector3>>;
  /** Written every frame: screen positions in viewport pixels. */
  pointsRef: MutableRefObject<SceneAnchorPoints>;
}) {
  const { camera, gl } = useThree();
  const projected = new THREE.Vector3();

  useFrame(() => {
    const rect = gl.domElement.getBoundingClientRect();
    const next: SceneAnchorPoints = {};

    for (const [name, position] of Object.entries(anchorsRef.current)) {
      projected.copy(position).project(camera);
      const x = rect.left + ((projected.x + 1) / 2) * rect.width;
      const y = rect.top + ((1 - projected.y) / 2) * rect.height;
      // z leaves [-1, 1] once the point is behind the camera or past the far plane.
      const onScreen =
        projected.z > -1 &&
        projected.z < 1 &&
        x > rect.left - 40 &&
        x < rect.right + 40 &&
        y > rect.top - 40 &&
        y < rect.bottom + 40;
      next[name] = { x, y, visible: onScreen };
    }

    pointsRef.current = next;
  });

  return null;
}
