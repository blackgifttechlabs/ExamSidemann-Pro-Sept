import React, { useEffect, useMemo, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { FinishCard, MathsBoard, MathsScene, NumberChoices, headingFont } from "./MathsBoard";
import { CAVE_INTRO, CAVE_ROUNDS, type AddRound } from "./gameData";
import {
  playCorrectResponse,
  playFinish,
  playMathsLine,
  playWrongResponse,
  sayNumber,
  stopMathsVoice,
  stopNumberVoice,
} from "./mathsVoice";

/**
 * Cave of Glowing Orbs — addition as putting two groups together.
 *
 * Two piles sit on two ledges. Every orb the child touches floats up into the
 * bowl and takes the next number in the count, so the second pile is counted
 * *on* from the first rather than started again at one — which is the whole
 * idea behind adding, and the habit that survives into arithmetic.
 *
 * The cave brightens as the orbs are gathered, so the child can see the sum
 * growing before any numeral is involved. The written sum only appears once
 * every orb is in the bowl.
 */

const GAME = "cave-add";

const say = (round: AddRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: AddRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

const choicesFor = (total: number) => {
  const options = new Set<number>([total]);
  let offset = 1;
  while (options.size < 3) {
    if (total - offset >= 1) options.add(total - offset);
    if (options.size < 3) options.add(total + offset);
    offset += 1;
  }
  return [...options].sort((a, b) => a - b);
};

/** The cave itself: rock, ledges and a pool below. */
const CaveScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <radialGradient id="ecdCaveGlow" cx="50%" cy="46%" r="60%">
        <stop offset="0%" stopColor="#4b4f8f" />
        <stop offset="100%" stopColor="#171a3a" />
      </radialGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdCaveGlow)" />
    {/* stalactites */}
    {[40, 130, 220, 320, 470, 580, 680, 760].map((x, index) => (
      <path
        key={x}
        d={`M${x - 26} 0 L${x + 26} 0 L${x} ${60 + (index % 4) * 26} Z`}
        fill="#2a2d5c"
      />
    ))}
    {/* ledges */}
    <path d="M-20 330 q 120 -30 250 -6 L230 400 L-20 400 Z" fill="#2a2d5c" />
    <path d="M560 324 q 130 -26 280 2 L820 400 L560 400 Z" fill="#2a2d5c" />
    {/* pool */}
    <path d="M-20 452 q 200 -30 420 -6 t 420 -12 L820 500 L-20 500 Z" fill="#243070" />
  </svg>
);

export const EcdCaveAdd: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [gathered, setGathered] = useState<string[]>([]);
  const [asking, setAsking] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [solved, setSolved] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = CAVE_ROUNDS[index];
  const total = round.a + round.b;
  const choices = useMemo(() => choicesFor(total), [total]);

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: CAVE_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setGathered([]);
    setAsking(false);
    setWrong(null);
    setSolved(null);
    say(round, () => ask(round));
  }, [index, finished]);

  /** Touching an orb sends it to the bowl and gives it the next number. */
  const gather = (key: string) => {
    if (asking || gathered.includes(key)) return;
    const next = [...gathered, key];
    setGathered(next);
    ecdSounds.play("orb");
    sayNumber(next.length, 1, () => {
      if (next.length === total) {
        setAsking(true);
        ask(round);
      }
    });
  };

  const pick = (value: number) => {
    if (!asking || solved !== null) return;
    ecdSounds.play("buttonClick");

    if (value !== total) {
      setWrong(value);
      playWrongResponse();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    setSolved(value);
    setScore((current) => current + 1);
    setCelebrating(true);
    ecdSounds.play("sparkle");
    party.current = setTimeout(() => setCelebrating(false), 3000);

    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      if (index + 1 >= CAVE_ROUNDS.length) {
        setFinished(true);
        playFinish();
      } else {
        setIndex((current) => current + 1);
      }
    });
  };

  const restart = () => {
    ecdSounds.play("buttonClick");
    setScore(0);
    setFinished(false);
    setIndex(0);
  };

  /** One pile of orbs on its ledge. */
  const Pile: React.FC<{ side: "a" | "b"; many: number }> = ({ side, many }) => (
    <div
      className={`absolute bottom-[34%] flex w-[30%] flex-wrap items-center justify-center gap-[clamp(3px,1vw,10px)] ${
        side === "a" ? "left-[4%]" : "right-[4%]"
      }`}
    >
      {Array.from({ length: many }).map((_, position) => {
        const key = `${side}${position}`;
        const taken = gathered.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => gather(key)}
            disabled={taken || asking}
            aria-label={`Glowing orb ${position + 1}`}
            className={`h-[clamp(46px,8vw,68px)] w-[clamp(46px,8vw,68px)] rounded-full border-[3px] border-white/50 transition-all ${
              taken
                ? "scale-50 opacity-0"
                : side === "a"
                  ? "ecd-game-float bg-[radial-gradient(circle_at_30%_24%,#ffffff_0%,#8cedff_24%,#29bedf_62%,#087f9d_100%)] shadow-[inset_-5px_-6px_7px_rgba(0,68,97,.35),0_0_20px_7px_rgba(92,225,255,0.55)] hover:scale-110 active:scale-95"
                  : "ecd-game-float bg-[radial-gradient(circle_at_30%_24%,#ffffff_0%,#ffe986_24%,#ffc525_62%,#d78805_100%)] shadow-[inset_-5px_-6px_7px_rgba(112,59,0,.3),0_0_20px_7px_rgba(255,213,74,0.5)] hover:scale-110 active:scale-95"
            }`}
          />
        );
      })}
    </div>
  );

  const brightness = gathered.length / total;

  return (
    <MathsBoard
      title="Cave of Glowing Orbs"
      badge={finished ? `${score}/${CAVE_ROUNDS.length}` : `${index + 1}/${CAVE_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again to light the cave once more."
          : asking
            ? `${round.a} and ${round.b} — how many orbs altogether?`
            : "Touch every orb to float it into the bowl."
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/cave.png">
        <CaveScene />
      </MathsScene>

      {/* the cave lighting up as the orbs are gathered */}
      <div
        className="pointer-events-none absolute inset-0 bg-[#fff3c4] transition-opacity duration-500"
        style={{ opacity: brightness * 0.22 }}
        aria-hidden="true"
      />

      {finished ? (
        <FinishCard
          score={score}
          total={CAVE_ROUNDS.length}
          onAgain={restart}
          line={`You lit up the cave ${score} times!`}
        />
      ) : (
        <>
          <Pile side="a" many={round.a} />
          <Pile side="b" many={round.b} />

          {/* the bowl in the middle, filling with light */}
          <div className="absolute inset-x-0 top-[24%] flex flex-col items-center">
            <div
              className="flex h-[clamp(58px,14vw,120px)] w-[clamp(58px,14vw,120px)] items-center justify-center rounded-full border-[4px] border-[#6f7bd6] bg-[#1d2050] transition-shadow"
              style={{ boxShadow: `0 0 ${brightness * 40}px ${brightness * 14}px rgba(255,225,120,0.6)` }}
            >
              <span
                className="text-[clamp(20px,5vw,44px)] text-[#ffe14d]"
                style={headingFont}
              >
                {gathered.length}
              </span>
            </div>

            {/* the sum, written only once the counting is done */}
            {asking && (
              <span
                className="mt-[clamp(6px,1.4vw,14px)] rounded-full bg-white/90 px-[clamp(10px,2.4vw,22px)] py-[clamp(3px,0.9vw,8px)] text-[clamp(14px,3vw,28px)] text-[#2b7f92] shadow-[0_4px_0_rgba(6,102,124,0.24)]"
                style={headingFont}
              >
                {round.a} + {round.b} = ?
              </span>
            )}
          </div>

          {asking && (
            <div className="absolute inset-x-0 bottom-[7%]">
              <NumberChoices
                choices={choices}
                onPick={pick}
                wrong={wrong}
                solved={solved}
                disabled={solved !== null}
              />
            </div>
          )}
        </>
      )}
    </MathsBoard>
  );
};

export default EcdCaveAdd;
