import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { ArtGlyph, FinishCard, MathsBoard, MathsScene, headingFont } from "./MathsBoard";
import { WAKE_INTRO, WAKE_ROUNDS, type WakeRound } from "./gameData";
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
 * Wake the Sleepy Yippies — counting *out* a set of a given size.
 *
 * Being handed four things and counting them is one skill; being asked for
 * four and stopping at four is a harder one, and it is the one that shows a
 * child has understood what the number means. So here the number is given
 * first and the child produces the set: poke four awake, then ring the bell.
 *
 * A poked Yippie can be patted back to sleep, which matters — a four-year-old
 * who over-counts should be able to fix it themselves rather than be told off
 * by a buzzer.
 */

const GAME = "wake-up";

const say = (round: WakeRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: WakeRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

/** The moonlit nest the Yippies sleep in. */
const NestScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdNestSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2b2f74" />
        <stop offset="100%" stopColor="#6a5fb8" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdNestSky)" />
    <circle cx="120" cy="90" r="40" fill="#fff4c2" />
    {Array.from({ length: 26 }).map((_, index) => (
      <circle key={index} cx={(index * 173) % 800} cy={(index * 61) % 300} r="1.8" fill="#ffffff" opacity="0.6" />
    ))}
    {/* the nest: a big soft mound of blankets */}
    <path d="M-20 380 q 160 -110 420 -80 t 420 60 L820 500 L-20 500 Z" fill="#8a6bd1" />
    <path d="M-20 424 q 200 -70 400 -20 t 440 20 L820 500 L-20 500 Z" fill="#a487e0" />
    <path d="M40 470 q 120 -40 240 -6 t 240 -10" fill="none" stroke="#c2aaf0" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const EcdWakeUp: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [awake, setAwake] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = WAKE_ROUNDS[index];

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: WAKE_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      ecdSounds.stopLoop("snore");
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setAwake([]);
    setLocked(false);
    say(round, () => ask(round));
  }, [index, finished]);

  // The snoring runs whenever anybody is still asleep.
  useEffect(() => {
    if (finished || awake.length >= round.total) {
      ecdSounds.stopLoop("snore");
      return;
    }
    ecdSounds.startLoop("snore");
  }, [awake, round, finished]);

  const poke = (position: number) => {
    if (locked) return;

    if (awake.includes(position)) {
      // Patted back to sleep — the count comes back down with them.
      setAwake((current) => current.filter((item) => item !== position));
      ecdSounds.play("countPop", 0.35);
      return;
    }

    const next = [...awake, position];
    setAwake(next);
    ecdSounds.play("wakeUp");
    sayNumber(next.length);
  };

  const ringBell = () => {
    if (locked) return;
    ecdSounds.play("buttonClick");

    if (awake.length !== round.ask) {
      // Not a failure, a recount: say what they have, then ask again.
      playWrongResponse(() => ask(round));
      return;
    }

    setLocked(true);
    setScore((current) => current + 1);
    setCelebrating(true);
    ecdSounds.stopLoop("snore");
    party.current = setTimeout(() => setCelebrating(false), 3000);

    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      if (index + 1 >= WAKE_ROUNDS.length) {
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
      title="Wake the Sleepy Yippies"
      badge={finished ? `${score}/${WAKE_ROUNDS.length}` : `${index + 1}/${WAKE_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again to tuck them in and start over."
          : `Wake up ${round.ask}. Poke one again to let it go back to sleep, then ring the bell.`
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/yippie-nest.png">
        <NestScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={WAKE_ROUNDS.length}
          onAgain={restart}
          line={`You counted out ${score} sets of Yippies!`}
        />
      ) : (
        <>
          {/* how many are wanted, always on screen */}
          <div className="absolute inset-x-0 top-[16%] flex justify-center">
            <span
              className="rounded-full bg-white/90 px-[clamp(12px,2.6vw,24px)] py-[clamp(4px,1vw,10px)] text-[clamp(14px,3vw,28px)] text-[#2b7f92] shadow-[0_4px_0_rgba(6,102,124,0.24)]"
              style={headingFont}
            >
              Wake up {round.ask} · awake: {awake.length}
            </span>
          </div>

          {/* the nest */}
          <div className="absolute inset-x-[5%] top-[34%] flex flex-wrap items-center justify-center gap-[clamp(4px,1.6vw,16px)]">
            {Array.from({ length: round.total }).map((_, position) => {
              const isAwake = awake.includes(position);
              return (
                <button
                  key={position}
                  type="button"
                  onClick={() => poke(position)}
                  disabled={locked}
                  aria-label={isAwake ? "Let this Yippie sleep again" : "Wake this Yippie"}
                  aria-pressed={isAwake}
                  className={`relative flex items-center justify-center transition-transform ${
                    isAwake ? "-translate-y-[6%] scale-110" : "hover:scale-105 active:scale-95"
                  }`}
                >
                  <ArtGlyph
                    art={`/images/ecd/maths/characters/yippie-${isAwake ? "awake" : "asleep"}.png`}
                    emoji={isAwake ? "🥰" : "😴"}
                    className="h-[clamp(62px,13vw,116px)] w-[clamp(62px,13vw,116px)] drop-shadow-[0_7px_9px_rgba(0,10,40,0.35)]"
                  />
                  {!isAwake && (
                    <span
                      className="ecd-hover absolute -right-[8%] -top-[14%] text-[clamp(11px,2.2vw,20px)] text-white/85"
                      style={headingFont}
                      aria-hidden="true"
                    >
                      z z
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* the bell that says "I have finished counting" */}
          <div className="absolute inset-x-0 bottom-[7%] flex justify-center">
            <button
              type="button"
              onClick={ringBell}
              disabled={locked}
              className="ecd-pill flex items-center gap-2 bg-[#ff9f1c] px-[clamp(14px,3vw,28px)] py-[clamp(7px,1.5vw,14px)] text-[clamp(13px,2.6vw,22px)] shadow-[0_6px_0_#c9741a] disabled:opacity-60"
              style={headingFont}
            >
              <Bell size={20} />
              Ring the bell
            </button>
          </div>
        </>
      )}
    </MathsBoard>
  );
};

export default EcdWakeUp;
