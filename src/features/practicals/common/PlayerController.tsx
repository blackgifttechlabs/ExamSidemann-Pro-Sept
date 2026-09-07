"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

export interface PlayerBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

interface PlayerControllerProps {
  bounds: PlayerBounds;
  obstacles?: PlayerBounds[];
  spawn: THREE.Vector3;
  eyeHeight?: number;
  initialYaw?: number;
  initialPitch?: number;
  speed?: number;
  isMobile: boolean;
  enabled: boolean;
  moveVector: React.MutableRefObject<{ x: number; y: number }>;
  onUpdate: (position: THREE.Vector3, lookDirection: THREE.Vector3) => void;
}

const OBSTACLE_MARGIN = 0.55;

const clampToBounds = (pos: THREE.Vector3, bounds: PlayerBounds, obstacles?: PlayerBounds[]) => {
  pos.x = THREE.MathUtils.clamp(pos.x, bounds.minX, bounds.maxX);
  pos.z = THREE.MathUtils.clamp(pos.z, bounds.minZ, bounds.maxZ);

  // Push the player out to the nearest edge of any solid obstacle (e.g. the
  // bench) instead of letting them walk straight through it — this is what
  // makes "walk around the table" mean something.
  obstacles?.forEach((box) => {
    const minX = box.minX - OBSTACLE_MARGIN;
    const maxX = box.maxX + OBSTACLE_MARGIN;
    const minZ = box.minZ - OBSTACLE_MARGIN;
    const maxZ = box.maxZ + OBSTACLE_MARGIN;
    if (pos.x <= minX || pos.x >= maxX || pos.z <= minZ || pos.z >= maxZ) return;
    const distLeft = pos.x - minX;
    const distRight = maxX - pos.x;
    const distNear = pos.z - minZ;
    const distFar = maxZ - pos.z;
    const nearest = Math.min(distLeft, distRight, distNear, distFar);
    if (nearest === distLeft) pos.x = minX;
    else if (nearest === distRight) pos.x = maxX;
    else if (nearest === distNear) pos.z = minZ;
    else pos.z = maxZ;
  });
};

// Shared free-roam movement: keyboard + pointer-lock look on desktop, a
// virtual-joystick vector + touch-drag look on mobile. Only ever moves the
// camera and reports position/look direction back out — callers decide what
// that unlocks (interaction range, etc).
export function PlayerController({
  bounds,
  obstacles,
  spawn,
  eyeHeight = 1.35,
  initialYaw = Math.PI,
  initialPitch = 0,
  speed = 3.6,
  isMobile,
  enabled,
  moveVector,
  onUpdate,
}: PlayerControllerProps) {
  const { camera } = useThree();
  const keysRef = useRef<Record<string, boolean>>({});
  const positionRef = useRef(spawn.clone());
  const yawRef = useRef(Math.PI);
  const pitchRef = useRef(0);
  const touchLookRef = useRef({ active: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    if (!enabled) return;
    positionRef.current.copy(spawn);
    yawRef.current = initialYaw;
    pitchRef.current = THREE.MathUtils.clamp(initialPitch, -0.8, 0.8);
    camera.rotation.order = "YXZ";
    camera.rotation.set(pitchRef.current, yawRef.current, 0);
    camera.position.set(spawn.x, eyeHeight, spawn.z);
  }, [camera, enabled, eyeHeight, initialPitch, initialYaw, spawn]);

  useEffect(() => {
    if (!enabled || isMobile) return;
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keysRef.current = {};
    };
  }, [enabled, isMobile]);

  useEffect(() => {
    if (!enabled || !isMobile) return;
    const half = () => window.innerWidth / 2;
    const onTouchStart = (e: TouchEvent) => {
      const target = e.target;
      if (
        target instanceof Element &&
        target.closest(
          "button,input,select,textarea,[data-mobile-experiment-controls='true'],[data-virtual-joystick='true']"
        )
      ) {
        return;
      }
      const touch = Array.from(e.touches).find((t) => t.clientX > half());
      if (!touch) return;
      touchLookRef.current = { active: true, lastX: touch.clientX, lastY: touch.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touchLookRef.current.active) return;
      const touch = Array.from(e.touches).find((t) => t.clientX > half());
      if (!touch) return;
      const dx = touch.clientX - touchLookRef.current.lastX;
      const dy = touch.clientY - touchLookRef.current.lastY;
      touchLookRef.current.lastX = touch.clientX;
      touchLookRef.current.lastY = touch.clientY;
      yawRef.current -= dx * 0.0038;
      pitchRef.current = THREE.MathUtils.clamp(pitchRef.current - dy * 0.0038, -0.8, 0.8);
    };
    const onTouchEnd = () => {
      touchLookRef.current.active = false;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled, isMobile]);

  useFrame((_, delta) => {
    if (!enabled) return;
    const keys = keysRef.current;
    let forward = 0;
    let strafe = 0;

    if (!isMobile) {
      if (keys["KeyW"] || keys["ArrowUp"]) forward += 1;
      if (keys["KeyS"] || keys["ArrowDown"]) forward -= 1;
      if (keys["KeyD"] || keys["ArrowRight"]) strafe += 1;
      if (keys["KeyA"] || keys["ArrowLeft"]) strafe -= 1;
      yawRef.current = camera.rotation.y;
    } else {
      forward = moveVector.current.y;
      strafe = moveVector.current.x;
      camera.rotation.order = "YXZ";
      camera.rotation.y = yawRef.current;
      camera.rotation.x = pitchRef.current;
    }

    const magnitude = Math.hypot(forward, strafe);
    if (magnitude > 1) {
      forward /= magnitude;
      strafe /= magnitude;
    }

    if (magnitude > 0.001) {
      const sinYaw = Math.sin(yawRef.current);
      const cosYaw = Math.cos(yawRef.current);
      const next = positionRef.current.clone();
      next.x += (-sinYaw * forward + cosYaw * strafe) * speed * delta;
      next.z += (-cosYaw * forward - sinYaw * strafe) * speed * delta;
      clampToBounds(next, bounds, obstacles);
      positionRef.current.copy(next);
    }

    camera.position.set(positionRef.current.x, eyeHeight, positionRef.current.z);

    const lookDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    onUpdate(positionRef.current, lookDirection);
  });

  return isMobile ? null : <PointerLockControls makeDefault />;
}
