import React, { useEffect, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { ArtGlyph, FinishCard, MathsBoard, MathsScene, headingFont } from "./MathsBoard";
import { STAR_INTRO, STAR_ROUNDS, type StarRound } from "./gameData";
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
 * Wish on the Stars — reading numerals and putting them in counting order.
 *
 * The stars are scattered on purpose. Ordered left to right a child can finish
 * the round without reading a single numeral; scattered, the only way through
 * is to find the one that says "1", then the one that says "2". Each star
 * joins to the last with a line, so the finished round is a constellation the
 * child drew by counting.
 */

const GAME = "star-wish";

const say = (round: StarRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: StarRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

/** The night sky the stars hang in. */
const NightScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdNightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1b1f6b" />
        <stop offset="60%" stopColor="#3b3fa0" />
        <stop offset="100%" stopColor="#7a5bc4" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdNightSky)" />
    {/* far stars */}
    {Array.from({ length: 46 }).map((_, index) => (
      <circle
        key={index}
        cx={(index * 137) % 800}
        cy={(index * 89) % 360}
        r={index % 5 === 0 ? 2.6 : 1.5}
        fill="#ffffff"
        opacity={0.45 + ((index % 4) * 0.12)}
      />
    ))}
    {/* the moon */}
    <circle cx="700" cy="86" r="46" fill="#fff4c2" />
    <circle cx="684" cy="76" r="9" fill="#f0e2a6" />
    <circle cx="712" cy="102" r="6" fill="#f0e2a6" />
    {/* hills below */}
    <path d="M-20 420 q 140 -78 280 -6 t 280 -12 t 280 34 L820 500 L-20 500 Z" fill="#2b2f74" />
    <path d="M-20 460 q 180 -52 360 -4 t 300 6 L820 500 L-20 500 Z" fill="#1d2058" />
  </svg>
);

export const EcdStarWish: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [got, setGot] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = STAR_ROUNDS[index];
  const complete = got >= round.count;

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: STAR_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setGot(0);
    setWrong(null);
    say(round, () => ask(round));
  }, [index, finished]);

  /** Stars must be touched in counting order; anything else is a gentle no. */
  const touch = (value: number) => {
    if (complete) return;

    if (value !== got + 1) {
      setWrong(value);
      playWrongResponse();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    const next = got + 1;
    setGot(next);
    ecdSounds.play("sparkle");

    if (next < round.count) {
      sayNumber(next);
      return;
    }

    // The wish comes true: the constellation lights up, then the next sky.
    setScore((current) => current + 1);
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);
    sayNumber(next, 1, () =>
      playCorrectResponse(() => {
        ecdSounds.play("swipe", 0.8);
        if (index + 1 >= STAR_ROUNDS.length) {
          setFinished(true);
          playFinish();
        } else {
          setIndex((current) => current + 1);
        }
      }),
    );
  };

  const restart = () => {
    ecdSounds.play("buttonClick");
    setScore(0);
    setFinished(false);
    setIndex(0);
  };

  return (
    <MathsBoard
      title="Wish on the Stars"
      badge={finished ? `${score}/${STAR_ROUNDS.length}` : `${index + 1}/${STAR_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again to make more wishes."
          : `Find the star that says ${Math.min(got + 1, round.count)} — then keep counting.`
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/night-sky.png">
        <NightScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={STAR_ROUNDS.length}
          onAgain={restart}
          line={`You made ${score} wishes come true!`}
        />
      ) : (
        <>
          {/* the line joining the stars that have been counted */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {round.positions.slice(0, Math.max(0, got - 1)).map((position, step) => {
              const to = round.positions[step + 1];
              return (
                <line
                  key={step}
                  x1={position.x}
                  y1={position.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#ffe14d"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              );
            })}
          </svg>

          {round.positions.map((position, step) => {
            const value = step + 1;
            const lit = value <= got;
            const isNext = value === got + 1;
            return (
              /* Placement on the wrapper, animation on the button: the beat and
                 the shake both animate `transform`, and would otherwise wipe out
                 the translate that centres the star on its spot. */
              <div
                key={value}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <button
                  type="button"
                  onClick={() => touch(value)}
                  disabled={complete}
                  aria-label={`Star ${value}`}
                  className={`flex min-h-[64px] min-w-[64px] items-center justify-center transition-transform ${
                    lit ? "scale-110" : "hover:scale-110 active:scale-95"
                  } ${isNext ? "ecd-beat" : ""} ${wrong === value ? "ecd-shake" : ""}`}
                >
                  <span className="relative flex items-center justify-center">
                    <ArtGlyph
                      art={`/images/ecd/maths/elements/star-${lit ? "lit" : "dim"}.png`}
                      emoji="⭐"
                      className={`h-[clamp(64px,15vw,126px)] w-[clamp(64px,15vw,126px)] ${
                        lit
                          ? "drop-shadow-[0_0_22px_rgba(255,225,77,0.95)]"
                          : "opacity-70 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                      }`}
                    />
                    <span
                      className="absolute text-[clamp(22px,4.5vw,40px)] text-[#4a3200]"
                      style={headingFont}
                    >
                      {value}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </>
      )}
    </MathsBoard>
  );
};

export default EcdStarWish;
