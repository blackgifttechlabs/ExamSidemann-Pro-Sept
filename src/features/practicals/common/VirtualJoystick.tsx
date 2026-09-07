"use client";

import { useCallback, useRef, useState } from "react";

interface VirtualJoystickProps {
  onChange: (vector: { x: number; y: number }) => void;
  size?: number;
}

// A self-contained touch joystick: drag from the base and it reports a
// normalized {x, y} vector (y positive = forward) until released.
export function VirtualJoystick({ onChange, size = 108 }: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const activeTouchId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const updateFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const base = baseRef.current;
      if (!base) return;
      const rect = base.getBoundingClientRect();
      const radius = rect.width / 2;
      const dx = clientX - (rect.left + radius);
      const dy = clientY - (rect.top + radius);
      const dist = Math.min(1, Math.hypot(dx, dy) / radius);
      const angle = Math.atan2(dy, dx);
      const nx = Math.cos(angle) * dist;
      const ny = Math.sin(angle) * dist;
      setKnob({ x: nx * radius * 0.5, y: ny * radius * 0.5 });
      onChange({ x: nx, y: -ny });
    },
    [onChange]
  );

  const reset = useCallback(() => {
    activeTouchId.current = null;
    setKnob({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 });
  }, [onChange]);

  const handleStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      activeTouchId.current = touch.identifier;
      updateFromPoint(touch.clientX, touch.clientY);
    },
    [updateFromPoint]
  );

  const handleMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (activeTouchId.current === null) return;
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === activeTouchId.current);
      if (!touch) return;
      updateFromPoint(touch.clientX, touch.clientY);
    },
    [updateFromPoint]
  );

  const handleEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const stillDown = Array.from(e.touches).some((t) => t.identifier === activeTouchId.current);
      if (stillDown) return;
      reset();
    },
    [reset]
  );

  return (
    <div
      ref={baseRef}
      data-virtual-joystick="true"
      aria-label="Move around"
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      style={{ width: size, height: size }}
      className="pointer-events-auto relative shrink-0 touch-none select-none rounded-full border border-white/25 bg-black/35 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/45 bg-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}
