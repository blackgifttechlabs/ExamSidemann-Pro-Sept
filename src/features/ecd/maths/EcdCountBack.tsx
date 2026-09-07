import React, { useEffect, useMemo, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { CssRocket, FinishCard, MathsBoard, MathsScene, NumberChoices, headingFont } from "./MathsBoard";
import { COUNTBACK_INTRO, COUNTBACK_ROUNDS, type CountBackRound } from "./gameData";
import {
  countAloud,
  playCorrectResponse,
  playFinish,
  playMathsLine,
  playWrongResponse,
  stopMathsVoice,
  stopNumberVoice,
} from "./mathsVoice";

/**
 * Rocket Countdown — counting backwards.
 *
 * Counting back is much harder than counting on, and it is what makes taking
 * away possible later. A countdown is the one place in a small child's life
 * where backwards counting already has a job to do, so that is the setting:
 * fix the missing number and the rocket climbs a little further up the sky.
 *
 * Once the blank is filled the whole run is read aloud in order, so the child
 * hears the sequence they have just completed rather than only their answer.
 */

const GAME = "count-back";

const say = (round: CountBackRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: CountBackRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

/** The number that belongs in the gap, worked out from its neighbours. */
const answerFor = (round: CountBackRound) => {
  const blank = round.sequence.indexOf(null);
  const before = round.sequence[blank - 1];
  const after = round.sequence[blank + 1];
  if (typeof before === "number") return before - 1;
  if (typeof after === "number") return after + 1;
  return 0;
};

/** Three numerals to choose from, all of them plausible in a countdown. */
const choicesFor = (answer: number) => {
  const options = new Set<number>([answer]);
  let offset = 1;
  while (options.size < 3) {
    if (answer - offset >= 0) options.add(answer - offset);
    if (options.size < 3 && answer + offset <= 10) options.add(answer + offset);
    offset += 1;
  }
  return [...options].sort((a, b) => b - a);
};

/** The launch pad, with the sky above it. */
const LaunchScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdLaunchSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#131a52" />
        <stop offset="55%" stopColor="#3b56b8" />
        <stop offset="100%" stopColor="#f2a45c" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdLaunchSky)" />
    {Array.from({ length: 30 }).map((_, index) => (
      <circle key={index} cx={(index * 149) % 800} cy={(index * 53) % 260} r="1.8" fill="#ffffff" opacity="0.7" />
    ))}
    {/* desert launch site */}
    <path d="M-20 420 q 180 -34 360 -6 t 460 -10 L820 500 L-20 500 Z" fill="#c98a4b" />
    <rect y="466" width="800" height="34" fill="#a86e37" />
    {/* the gantry */}
    <g stroke="#5d6a73" strokeWidth="7" fill="none">
      <path d="M566 452 L566 250" />
      <path d="M566 250 L620 250" />
      <path d="M566 300 L610 300" />
      <path d="M566 360 L610 360" />
    </g>
  </svg>
);

export const EcdCountBack: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [filled, setFilled] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [reading, setReading] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = COUNTBACK_ROUNDS[index];
  const answer = useMemo(() => answerFor(round), [round]);
  const choices = useMemo(() => choicesFor(answer), [answer]);
  const blank = round.sequence.indexOf(null);

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: COUNTBACK_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setFilled(null);
    setWrong(null);
    setReading(null);
    say(round, () => ask(round));
  }, [index, finished]);

  const pick = (value: number) => {
    if (filled !== null) return;
    ecdSounds.play("buttonClick");

    if (value !== answer) {
      setWrong(value);
      playWrongResponse();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    setFilled(value);
    setScore((current) => current + 1);
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);

    // Read the whole countdown back, lighting each number as it is said.
    const full = round.sequence.map((item) => (item === null ? value : item)) as number[];
    countAloud(
      full,
      (spoken) => setReading(spoken),
      () => {
        setReading(null);
        const last = index + 1 >= COUNTBACK_ROUNDS.length;
        if (last) {
          setLaunched(true);
          ecdSounds.play("rocket");
        }
        playCorrectResponse(() => {
          ecdSounds.play("swipe", 0.8);
          if (last) {
            setFinished(true);
            playFinish();
          } else {
            setIndex((current) => current + 1);
          }
        });
      },
    );
  };

  const restart = () => {
    ecdSounds.play("buttonClick");
    setScore(0);
    setLaunched(false);
    setFinished(false);
    setIndex(0);
  };

  // The rocket climbs a step for every countdown that has been fixed.
  const height = 6 + (score / COUNTBACK_ROUNDS.length) * 46;

  return (
    <MathsBoard
      title="Rocket Countdown"
      badge={finished ? `${score}/${COUNTBACK_ROUNDS.length}` : `${index + 1}/${COUNTBACK_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Blast off! Tap play again for another launch."
          : "Which number is missing from the countdown? Tap it."
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/launch-pad.png">
        <LaunchScene />
      </MathsScene>

      {/* the rocket, climbing as the countdowns are fixed */}
      <div
        className={`pointer-events-none absolute left-[76%] z-10 -translate-x-1/2 transition-all ${
          launched ? "duration-[2200ms] ease-in" : "duration-700 ease-out"
        }`}
        style={{ bottom: `${launched ? 92 : height}%` }}
      >
        <CssRocket className="h-[clamp(100px,20vw,170px)] w-[clamp(72px,14vw,120px)]" />
      </div>

      {finished ? (
        <FinishCard
          score={score}
          total={COUNTBACK_ROUNDS.length}
          onAgain={restart}
          line={`You fixed ${score} countdowns and launched the rocket!`}
        />
      ) : (
        <>
          {/* the countdown strip */}
          <div className="absolute inset-x-[4%] top-[26%] flex items-center justify-center gap-[clamp(4px,1.6vw,16px)]">
            {round.sequence.map((item, slot) => {
              const value = item === null ? filled : item;
              const isBlank = slot === blank;
              return (
                <span
                  key={slot}
                  className={`flex h-[clamp(60px,12vw,100px)] w-[clamp(60px,12vw,100px)] items-center justify-center rounded-[20px] border-[4px] text-[clamp(28px,6vw,50px)] shadow-[0_7px_0_rgba(0,0,0,0.22)] transition-transform ${
                    isBlank && filled === null
                      ? "ecd-beat border-dashed border-white bg-white/25 text-white"
                      : "border-white bg-white/95 text-[#26313b]"
                  } ${reading !== null && reading === value ? "scale-110 border-[#ff9f1c] bg-[#ff9f1c] text-white" : ""}`}
                  style={headingFont}
                >
                  {value ?? "?"}
                </span>
              );
            })}
          </div>

          <div className="absolute inset-x-0 bottom-[8%]">
            <NumberChoices
              choices={choices}
              onPick={pick}
              wrong={wrong}
              solved={filled}
              disabled={filled !== null}
            />
          </div>
        </>
      )}
    </MathsBoard>
  );
};

export default EcdCountBack;
