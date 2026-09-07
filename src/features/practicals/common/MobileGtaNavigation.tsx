"use client";

import { useCallback, useEffect, useState, type MutableRefObject } from "react";
import { VirtualJoystick } from "./VirtualJoystick";

const MOBILE_EXPERIMENT_QUERY =
  "(max-width: 639px), (orientation: landscape) and (max-height: 700px) and (hover: none) and (pointer: coarse)";

export function useMobileExperimentViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(MOBILE_EXPERIMENT_QUERY);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isMobile;
}

interface MobileGtaNavigationProps {
  moveVector: MutableRefObject<{ x: number; y: number }>;
}

export function MobileGtaNavigation({ moveVector }: MobileGtaNavigationProps) {
  const handleMove = useCallback(
    (vector: { x: number; y: number }) => {
      moveVector.current = vector;
    },
    [moveVector],
  );

  useEffect(
    () => () => {
      moveVector.current = { x: 0, y: 0 };
    },
    [moveVector],
  );

  return (
    <div
      data-mobile-gta-navigation="true"
      className="pointer-events-none absolute inset-x-0 bottom-[4.6rem] z-[60] flex items-end justify-between px-3"
    >
      <div className="pointer-events-auto">
        <VirtualJoystick onChange={handleMove} size={94} />
      </div>

      <div className="mr-1 flex flex-col items-center gap-1 text-white/80">
        <div className="grid h-[74px] w-[74px] place-items-center rounded-full border border-white/20 bg-black/20 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="relative h-8 w-8">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/65" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/65" />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80" />
          </div>
        </div>
        <div className="rounded-full border border-white/15 bg-slate-950/65 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em]">
          Swipe to look
        </div>
      </div>
    </div>
  );
}
