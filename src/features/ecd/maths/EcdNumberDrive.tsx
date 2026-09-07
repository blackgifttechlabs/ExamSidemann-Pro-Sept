import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { sayNumber, stopNumberVoice } from "../../../lib/audio/numberVoice";
import { EcdCelebration } from "../EcdCelebration";
import { DRIVE_LEVELS, decoyFor, levelNumbers } from "./numberDrive";
import {
  playCorrectResponse,
  playSuccessCue,
  stopReadingVoice,
} from "../reading/readingVoice";

/**
 * Number Drive.
 *
 * The child steers a car down a road while numbered blocks come towards them
 * two at a time, one in each lane. Driving into the one that carries the next
 * number in the count collects it; the other turns red. The tally along the
 * top fills in as they go, so the run of numbers is always in front of them.
 *
 * The blocks fall on a CSS animation rather than a physics loop, and the hit is
 * resolved when they arrive. That makes the game forgiving in exactly the way a
 * four-year-old needs — position the car as they approach, no reflex required —
 * and it costs nothing while the tab is in the background.
 */

const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

type Pair = {
  /** Rises each round so React remounts the blocks and restarts the descent. */
  key: number;
  target: number;
  decoy: number;
  /** Which lane holds the number the child needs. */
  targetLane: 0 | 1;
};

type Verdict = "none" | "right" | "wrong";

const buildPair = (key: number, target: number, decoy: number): Pair => ({
  key,
  target,
  decoy,
  targetLane: Math.random() < 0.5 ? 0 : 1,
});

/** The car, seen from above. */
const Car: React.FC = () => (
  <svg viewBox="0 0 120 190" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdCarBody" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#c9302c" />
        <stop offset="26%" stopColor="#f4443d" />
        <stop offset="55%" stopColor="#ff6b5e" />
        <stop offset="100%" stopColor="#b52a25" />
      </linearGradient>
      <linearGradient id="ecdCarGlass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dff3ff" />
        <stop offset="100%" stopColor="#7fb6d6" />
      </linearGradient>
    </defs>

    {/* wheels */}
    <rect x="4" y="36" width="18" height="38" rx="7" fill="#22252a" />
    <rect x="98" y="36" width="18" height="38" rx="7" fill="#22252a" />
    <rect x="4" y="118" width="18" height="38" rx="7" fill="#22252a" />
    <rect x="98" y="118" width="18" height="38" rx="7" fill="#22252a" />

    {/* body */}
    <rect x="12" y="10" width="96" height="170" rx="30" fill="url(#ecdCarBody)" />
    <rect x="12" y="10" width="96" height="170" rx="30" fill="none" stroke="#8f1f1b" strokeWidth="2" />

    {/* windscreen, roof and rear window */}
    <path d="M26 46 q34 -16 68 0 l-6 24 q-28 -10 -56 0 Z" fill="url(#ecdCarGlass)" />
    <rect x="26" y="78" width="68" height="44" rx="12" fill="#e8524b" />
    <path d="M26 148 q34 14 68 0 l-6 -22 q-28 9 -56 0 Z" fill="url(#ecdCarGlass)" opacity="0.9" />

    {/* mirrors, lights and a racing stripe */}
    <rect x="6" y="58" width="10" height="9" rx="3" fill="#a8231e" />
    <rect x="104" y="58" width="10" height="9" rx="3" fill="#a8231e" />
    <rect x="24" y="12" width="20" height="10" rx="5" fill="#fff6cf" />
    <rect x="76" y="12" width="20" height="10" rx="5" fill="#fff6cf" />
    <rect x="26" y="168" width="20" height="8" rx="4" fill="#ff9a92" />
    <rect x="74" y="168" width="20" height="8" rx="4" fill="#ff9a92" />
    <rect x="56" y="80" width="8" height="40" rx="4" fill="#ffffff" opacity="0.55" />
  </svg>
);

/** One roadside tree. It sits in a verge column, so it is always on grass. */
const Tree: React.FC<{ top: number; scale: number }> = ({ top, scale }) => (
  <div
    className="absolute left-1/2 -translate-x-1/2"
    style={{ top: `${top}%`, width: `${74 * scale}%`, aspectRatio: "1 / 1" }}
  >
    <svg viewBox="0 0 60 60" className="h-full w-full">
      <ellipse cx="32" cy="46" rx="22" ry="9" fill="#0b5f2e" opacity="0.3" />
      <circle cx="30" cy="30" r="20" fill="#1f8f45" />
      <circle cx="22" cy="24" r="13" fill="#28a854" />
      <circle cx="38" cy="26" r="12" fill="#177a3a" />
      <circle cx="30" cy="38" r="11" fill="#22994b" />
    </svg>
  </div>
);

/** One verge: grass, and a line of trees rolling down it. */
const Verge: React.FC<{ side: "left" | "right" }> = ({ side }) => (
  <div
    className={`absolute inset-y-0 w-[16%] ${
      side === "left"
        ? "left-0 bg-gradient-to-l from-[#2f8f4a] to-[#46b063]"
        : "right-0 bg-gradient-to-r from-[#2f8f4a] to-[#46b063]"
    }`}
  >
    <div className="ecd-drive-scenery absolute inset-0">
      {(side === "left" ? [4, 26, 48, 70, 92, 114] : [14, 36, 58, 80, 102, 124]).map(
        (top, index) => (
          <Tree key={top} top={top} scale={1 - (index % 3) * 0.14} />
        ),
      )}
    </div>
  </div>
);

export const EcdNumberDrive: React.FC = () => {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [collected, setCollected] = useState<number[]>([]);
  const [carLane, setCarLane] = useState<0 | 1>(0);
  const [pair, setPair] = useState<Pair | null>(null);
  const [verdict, setVerdict] = useState<Verdict>("none");
  const [celebrating, setCelebrating] = useState(false);
  const [finished, setFinished] = useState(false);
  const roadRef = useRef<HTMLDivElement>(null);
  const carLaneRef = useRef<0 | 1>(0);
  const roundKey = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const level = DRIVE_LEVELS[levelIndex];
  const numbers = levelNumbers(level);
  const nextNumber = numbers[collected.length];

  // The animation callback reads the lane at the moment of impact, so it has to
  // come from a ref — a closure would hold whichever lane was current when the
  // round began.
  useEffect(() => {
    carLaneRef.current = carLane;
  }, [carLane]);

  const remember = (timer: ReturnType<typeof setTimeout>) => {
    timers.current.push(timer);
    return timer;
  };

  useEffect(() => {
    ecdSounds.retainIntro();
    // Turn the key, and let the engine take over once it has finished.
    let running = true;
    ecdSounds.play("carStart", undefined, () => {
      if (running) ecdSounds.startLoop("carMove");
    });
    return () => {
      running = false;
      ecdSounds.stopLoop("carMove");
      ecdSounds.releaseIntro();
      stopReadingVoice();
      stopNumberVoice();
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  /** Send the next pair of blocks down the road. */
  const sendPair = useCallback(() => {
    const target = levelNumbers(DRIVE_LEVELS[levelIndex])[collected.length];
    if (target === undefined) return;
    roundKey.current += 1;
    setVerdict("none");
    setPair(buildPair(roundKey.current, target, decoyFor(target, DRIVE_LEVELS[levelIndex])));
    // Say the number they are looking for as the blocks set off.
    sayNumber(target);
  }, [levelIndex, collected.length]);

  useEffect(() => {
    if (finished || pair) return;
    remember(setTimeout(sendPair, 600));
  }, [finished, pair, sendPair]);

  /** The blocks have reached the car: see which lane it is sitting in. */
  const resolve = () => {
    if (!pair) return;
    const hitTarget = carLaneRef.current === pair.targetLane;

    if (!hitTarget) {
      // A crash says it better than a buzzer here: the car has hit the wrong
      // block, and that is the whole message.
      setVerdict("wrong");
      ecdSounds.play("carCrash");
      remember(
        setTimeout(() => {
          setPair(null);
          setVerdict("none");
        }, 1100),
      );
      return;
    }

    setVerdict("right");
    const nowCollected = [...collected, pair.target];
    setCollected(nowCollected);

    const levelDone = nowCollected.length >= numbers.length;

    // Name the number they just caught first — that is the thing being learnt —
    // and only once it has been said does the celebration start. The block has
    // already turned green, so the tap still feels answered straight away.
    sayNumber(pair.target, 1, () => {
      setCelebrating(true);
      remember(setTimeout(() => setCelebrating(false), 2200));

      if (levelDone) {
        // End of a level: the full spoken well-done, then on to the next.
        playCorrectResponse(() => {
          if (levelIndex + 1 >= DRIVE_LEVELS.length) {
            setFinished(true);
            return;
          }
          setLevelIndex((current) => current + 1);
          setCollected([]);
          setPair(null);
          setVerdict("none");
        });
        setPair(null);
        return;
      }

      playSuccessCue();
      remember(
        setTimeout(() => {
          setPair(null);
          setVerdict("none");
        }, 1100),
      );
    });
  };



  /** Steering: drag or tap anywhere on the road, or use the arrow keys. */
  const steerFromPointer = (clientX: number) => {
    const box = roadRef.current?.getBoundingClientRect();
    if (!box) return;
    setCarLane(clientX < box.left + box.width / 2 ? 0 : 1);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setCarLane(0);
      if (event.key === "ArrowRight") setCarLane(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const restart = () => {
    ecdSounds.play("buttonClick");
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setLevelIndex(0);
    setCollected([]);
    setPair(null);
    setVerdict("none");
    setFinished(false);
  };

  const blockFor = (lane: 0 | 1) => {
    if (!pair) return null;
    const isTarget = lane === pair.targetLane;
    const value = isTarget ? pair.target : pair.decoy;
    const struck = verdict !== "none" && lane === carLane;
    const wrongHit = struck && verdict === "wrong";
    const rightHit = struck && verdict === "right";

    return (
      <div
        className={`ecd-drive-block absolute top-0 flex items-center justify-center rounded-[14px] border-4 text-white ${
          wrongHit
            ? "border-[#8c1f1a] bg-[#e0322b]"
            : rightHit
              ? "border-[#0a7a3c] bg-[#17b45c]"
              : "border-[#1b4f8a] bg-[#2f8fe0]"
        }`}
        style={{
          left: lane === 0 ? "27%" : "73%",
          transform: "translateX(-50%)",
          width: "min(40%, 148px)",
          aspectRatio: "1 / 1",
          fontSize: "clamp(26px, 7vw, 54px)",
          boxShadow: "0 8px 0 rgba(0,0,0,0.22)",
          animationDuration: `${level.travelSeconds}s`,
          animationPlayState: verdict === "none" ? "running" : "paused",
          ...headingFont,
        }}
        onAnimationEnd={lane === 0 ? resolve : undefined}
      >
        {value}
      </div>
    );
  };

  return (
    <EcdShell
      musicBed={0.04}
      backTo="/ecd/maths"
      showClouds={false}
      topRow={
        <>
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2f8fe0] text-[18px] text-white shadow-[0_3px_0_rgba(6,60,104,0.4)]"
            style={headingFont}
            aria-label={`Level ${level.number}`}
          >
            {level.number}
          </span>

          {/* The count so far. The tiles share the row between them, so a
              six-number level shrinks to fit rather than wrapping. */}
          {numbers.map((value, position) => {
            const done = position < collected.length;
            const isNext = position === collected.length;
            return (
              <span
                key={value}
                className={`flex min-w-0 flex-1 basis-0 items-center justify-center rounded-[10px] text-[clamp(16px,4.4vw,28px)] shadow-[0_3px_0_rgba(0,0,0,0.2)] ${
                  done
                    ? "bg-[#17b45c] text-white"
                    : isNext
                      ? "bg-[#ff9f1c] text-white"
                      : "bg-white/85 text-[#2b7f92]"
                }`}
                style={{ ...headingFont, aspectRatio: "1 / 1", maxWidth: 56 }}
              >
                {done || isNext ? value : "?"}
              </span>
            );
          })}
        </>
      }
    >
      <EcdCelebration show={celebrating} />

      {/* The road is the screen. Grass runs to both edges, the driving lanes
          stay a sane width in the middle, and everything else floats over it. */}
      <div
        ref={roadRef}
        className="absolute inset-0 touch-none select-none bg-[#3f9e55]"
        onPointerDown={(event) => steerFromPointer(event.clientX)}
        onPointerMove={(event) => {
          if (event.buttons > 0) steerFromPointer(event.clientX);
        }}
        role="application"
        aria-label="Drive the car into the block showing the next number"
      >
        <Verge side="left" />
        <Verge side="right" />

        {/* the tarmac, centred and kept to a drivable width on a big screen */}
        <div className="absolute inset-y-0 left-1/2 w-[68%] max-w-[560px] -translate-x-1/2">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3b4148] via-[#51585f] to-[#3b4148]">
            <div className="absolute inset-y-0 left-0 w-[10px] bg-[#e9eef2]" />
            <div className="absolute inset-y-0 right-0 w-[10px] bg-[#e9eef2]" />
            <div className="ecd-drive-lane absolute inset-0" />
          </div>

          {/* the numbered blocks */}
          {pair && (
            <div key={pair.key} className="pointer-events-none absolute inset-0">
              {blockFor(0)}
              {blockFor(1)}
            </div>
          )}

          {/* the car */}
          <div
            className="absolute bottom-[19%] h-[17%] max-h-[190px] w-[34%] max-w-[132px] -translate-x-1/2 transition-[left] duration-200 ease-out"
            style={{ left: carLane === 0 ? "27%" : "73%" }}
          >
            <Car />
          </div>
        </div>
      </div>

      {/* everything that floats over the road */}
      <div className="pointer-events-none relative z-10 flex min-h-[100svh] w-full flex-col items-center px-4 pb-6 pt-[72px] sm:pt-[84px]">
        <div className="flex-1" />

        <p
          className="mb-3 rounded-full bg-black/35 px-4 py-1.5 text-center text-[15px] text-white sm:text-[17px]"
          style={headingFont}
        >
          {finished
            ? "You counted all the way to twenty."
            : `Drive into ${nextNumber ?? ""}`}
        </p>

        {/* steering, docked along the bottom */}
        <div className="pointer-events-auto flex w-full max-w-[520px] items-center gap-4">
          <button
            type="button"
            onClick={() => setCarLane(0)}
            aria-label="Steer left"
            className={`flex h-16 flex-1 items-center justify-center rounded-[18px] text-[#1d6f80] shadow-[0_5px_0_rgba(6,102,124,0.35)] transition-transform active:translate-y-[4px] active:shadow-none ${
              carLane === 0 ? "bg-white" : "bg-white/75"
            }`}
          >
            <ChevronLeft size={34} />
          </button>
          <button
            type="button"
            onClick={() => setCarLane(1)}
            aria-label="Steer right"
            className={`flex h-16 flex-1 items-center justify-center rounded-[18px] text-[#1d6f80] shadow-[0_5px_0_rgba(6,102,124,0.35)] transition-transform active:translate-y-[4px] active:shadow-none ${
              carLane === 1 ? "bg-white" : "bg-white/75"
            }`}
          >
            <ChevronLeft size={34} className="rotate-180" />
          </button>
        </div>
      </div>

      {finished && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 px-6 text-center">
          <div className="rounded-[24px] bg-white/95 px-7 py-6 shadow-[0_8px_0_rgba(6,102,124,0.25)]">
            <p className="text-[clamp(20px,4vw,32px)] text-[#26313b]" style={headingFont}>
              All the way to 20!
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={restart}
                className="ecd-pill bg-[#2f2fbe] px-5 py-2.5 text-[16px] shadow-[0_5px_0_#21218f]"
                style={headingFont}
              >
                Drive again
              </button>
              <button
                type="button"
                onClick={() => {
                  ecdSounds.play("buttonClick");
                  navigate("/ecd/maths");
                }}
                className="ecd-pill bg-[#12b45c] px-5 py-2.5 text-[16px] shadow-[0_5px_0_#0a8442]"
                style={headingFont}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </EcdShell>
  );
};

export default EcdNumberDrive;
