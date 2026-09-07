import React, { useEffect, useMemo, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { ArtGlyph, CssPresent, FinishCard, MathsBoard, MathsScene, NumberChoices, headingFont } from "./MathsBoard";
import { PRESENT_INTRO, PRESENT_ROUNDS, type PresentRound } from "./gameData";
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
 * Present Party — counting a set of one to five things.
 *
 * A wrapped box opens and the toys spill out in a row. The child has to
 * *touch* each toy as they count it: the tap is what makes the number spoken,
 * so one-to-one correspondence is built into the mechanic rather than being
 * something we hope happens. Only once every toy has been touched are they
 * asked how many there were, which is the step from counting to cardinality.
 */

const GAME = "present-count";

const say = (round: PresentRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: PresentRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

/** Three numerals to choose from, one of them right, never below one. */
const choicesFor = (count: number) => {
  const options = new Set<number>([count]);
  let offset = 1;
  while (options.size < 3) {
    if (count - offset >= 1) options.add(count - offset);
    if (options.size < 3) options.add(count + offset);
    offset += 1;
  }
  return [...options].sort((a, b) => a - b);
};

/** The party room the presents are opened in. */
const PartyScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdPartyWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe3f1" />
        <stop offset="100%" stopColor="#ffc7e2" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdPartyWall)" />
    {/* bunting */}
    <path d="M-10 40 Q 200 90 400 46 T 810 60" fill="none" stroke="#d98cb6" strokeWidth="5" />
    {["#ff6b8b", "#ffc93c", "#43d17c", "#3fa9f5", "#c77dff", "#ff9f1c", "#ff6b8b", "#43d17c"].map(
      (colour, index) => {
        const x = 40 + index * 100;
        const y = 52 + Math.sin(index * 0.9) * 16;
        return <path key={index} d={`M${x - 22} ${y} L${x + 22} ${y} L${x} ${y + 52} Z`} fill={colour} />;
      },
    )}
    {/* floor */}
    <rect y="382" width="800" height="118" fill="#f6d9a8" />
    <rect y="382" width="800" height="12" fill="#e0bd85" />
    {Array.from({ length: 9 }).map((_, index) => (
      <rect key={index} x={index * 96} y="394" width="4" height="106" fill="#e6c896" />
    ))}
  </svg>
);

export const EcdPresentCount: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"closed" | "counting" | "choose">("closed");
  const [touched, setTouched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const [solved, setSolved] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = PRESENT_ROUNDS[index];
  const choices = useMemo(() => choicesFor(round.count), [round]);

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: PRESENT_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  // Each new box introduces itself, then waits to be opened.
  useEffect(() => {
    if (finished) return;
    setPhase("closed");
    setTouched([]);
    setWrong(null);
    setSolved(null);
  }, [index, finished]);

  const openBox = () => {
    if (phase !== "closed") return;
    ecdSounds.play("presentOpen");
    setPhase("counting");
    say(round, () => ask(round));
  };

  /** Touching a toy counts it — and says its number out loud. */
  const touch = (position: number) => {
    if (phase !== "counting" || touched.includes(position)) return;
    const next = [...touched, position];
    setTouched(next);
    ecdSounds.play("countPop");
    sayNumber(next.length, 1, () => {
      if (next.length === round.count) {
        setPhase("choose");
        ask(round);
      }
    });
  };

  const pick = (value: number) => {
    if (phase !== "choose" || solved !== null) return;
    ecdSounds.play("buttonClick");

    if (value !== round.count) {
      setWrong(value);
      playWrongResponse();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    setSolved(value);
    setScore((current) => current + 1);
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);

    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      if (index + 1 >= PRESENT_ROUNDS.length) {
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

  return (
    <MathsBoard
      title="Present Party"
      badge={finished ? `${score}/${PRESENT_ROUNDS.length}` : `${index + 1}/${PRESENT_ROUNDS.length}`}
      onReplay={finished ? undefined : () => (phase === "closed" ? say(round) : ask(round))}
      replayLabel="Hear the question again"
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again for another pile of presents."
          : phase === "closed"
            ? "Tap the present to open it."
            : phase === "counting"
              ? `Touch each ${round.word.replace(/s$/, "")} — one touch, one number.`
              : `How many ${round.word}? Tap the number.`
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/party-room.png">
        <PartyScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={PRESENT_ROUNDS.length}
          onAgain={restart}
          line={`You counted ${score} presents all by yourself!`}
        />
      ) : (
        <>
          {phase === "closed" ? (
            /* The bob lives on the inner button: a CSS animation's transform
               would otherwise overwrite the centring translate on the wrapper. */
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={openBox}
                aria-label="Open the present"
                className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
              >
                <CssPresent className="aspect-square h-[clamp(140px,31vw,240px)]" />
              </button>
            </div>
          ) : (
            <>
              {/* the toys, in a row, waiting to be touched one at a time */}
              <div className="absolute inset-x-[6%] top-[26%] z-10 flex flex-wrap items-center justify-center gap-[clamp(4px,1.6vw,16px)]">
                {Array.from({ length: round.count }).map((_, position) => {
                  const order = touched.indexOf(position) + 1;
                  const counted = order > 0;
                  return (
                    <button
                      key={position}
                      type="button"
                      onClick={() => touch(position)}
                      disabled={phase !== "counting" || counted}
                      aria-label={`${round.word} number ${position + 1}`}
                      className={`relative flex min-h-[64px] min-w-[64px] items-center justify-center rounded-[18px] p-[clamp(4px,1vw,10px)] transition-transform ${
                        counted ? "scale-95 opacity-95" : "ecd-game-float hover:scale-110 active:scale-95"
                      }`}
                    >
                      <ArtGlyph
                        art={`/images/ecd/maths/elements/${round.id}.png`}
                        emoji={round.emoji}
                        className="h-[clamp(64px,13vw,112px)] w-[clamp(64px,13vw,112px)] drop-shadow-[0_8px_8px_rgba(0,40,60,0.25)]"
                      />
                      {counted && (
                        <span
                          className="absolute -right-1 -top-1 flex h-[clamp(20px,4.4vw,34px)] w-[clamp(20px,4.4vw,34px)] items-center justify-center rounded-full bg-[#12b45c] text-[clamp(11px,2.6vw,20px)] text-white shadow-[0_3px_0_#0a8442]"
                          style={headingFont}
                        >
                          {order}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* the counted-so-far tally, so the run of numbers is always visible */}
              <div className="absolute inset-x-0 top-[57%] z-10 flex justify-center">
                <span
                  className="rounded-full bg-white/90 px-[clamp(10px,2.4vw,20px)] py-[clamp(3px,0.9vw,8px)] text-[clamp(13px,2.6vw,24px)] text-[#2b7f92] shadow-[0_4px_0_rgba(6,102,124,0.24)]"
                  style={headingFont}
                >
                  {touched.length === 0
                    ? "Touch to count…"
                    : Array.from({ length: touched.length }, (_, i) => i + 1).join(" · ")}
                </span>
              </div>

              {phase === "choose" && (
                <div className="absolute inset-x-0 bottom-[8%] z-10">
                  <NumberChoices choices={choices} onPick={pick} wrong={wrong} solved={solved} disabled={solved !== null} />
                </div>
              )}
            </>
          )}
        </>
      )}
    </MathsBoard>
  );
};

export default EcdPresentCount;
