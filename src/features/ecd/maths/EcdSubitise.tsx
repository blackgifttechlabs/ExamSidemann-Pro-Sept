import React, { useEffect, useMemo, useRef, useState } from "react";
import { Eye } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { ArtGlyph, FinishCard, MathsBoard, MathsScene, NumberChoices, headingFont } from "./MathsBoard";
import { SUBITISE_INTRO, SUBITISE_ROUNDS, type SubitiseRound } from "./gameData";
import {
  playCorrectResponse,
  playFinish,
  playMathsLine,
  playWrongResponse,
  stopMathsVoice,
  stopNumberVoice,
} from "./mathsVoice";

/**
 * Quick Eyes — subitising, which is seeing how many without counting.
 *
 * The dots are shown for a couple of seconds and then covered. That short look
 * is the whole exercise: given long enough, any child will count one by one,
 * and counting one by one is the thing this game exists to grow out of. The
 * blanket can always be lifted for another peek, so a child who needs longer
 * gets it without being stuck.
 *
 * The patterns are the dice and ten-frame arrangements they will meet for the
 * rest of their lives, so what they are learning to recognise is worth knowing.
 */

const GAME = "subitise";

/** How long the dots stay up, and how long a peek lasts. */
const LOOK_MS = 2200;
const PEEK_MS = 900;

const say = (round: SubitiseRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: SubitiseRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

/** Where the dots sit in a 100 × 100 card, by pattern. */
const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[26, 26], [50, 50], [74, 74]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[30, 22], [70, 22], [30, 50], [70, 50], [30, 78], [70, 78]],
};

/** A fixed scatter per count — random-looking, but the same every time. */
const scatter = (count: number): [number, number][] =>
  Array.from({ length: count }, (_, index) => {
    const angle = (index * 137.5 * Math.PI) / 180;
    const radius = 14 + (index % 3) * 12 + (count > 6 ? 6 : 0);
    return [50 + Math.cos(angle) * radius, 50 + Math.sin(angle) * radius * 0.92] as [number, number];
  });

/** Two rows, five to a row — the ten-frame arrangement. */
const rows = (count: number): [number, number][] => {
  const top = Math.min(5, count);
  const bottom = count - top;
  const place = (many: number, y: number): [number, number][] =>
    Array.from({ length: many }, (_, index) => [
      50 + (index - (many - 1) / 2) * 17,
      y,
    ] as [number, number]);
  return bottom === 0 ? place(top, 50) : [...place(top, 34), ...place(bottom, 68)];
};

const dotsFor = (round: SubitiseRound): [number, number][] => {
  if (round.pattern === "dice" && DICE[round.count]) return DICE[round.count];
  if (round.pattern === "scatter") return scatter(round.count);
  return rows(round.count);
};

/** Three numerals around the answer, never below one. */
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

/** The shelter the cages are stacked in. */
const ShelterScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdShelterWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6ad3e8" />
        <stop offset="100%" stopColor="#bff0f8" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdShelterWall)" />
    {/* a wooden floor and skirting */}
    <rect y="400" width="800" height="100" fill="#e3b877" />
    <rect y="392" width="800" height="14" fill="#c99a58" />
    {Array.from({ length: 10 }).map((_, index) => (
      <rect key={index} x={index * 84} y="406" width="4" height="94" fill="#d3a869" />
    ))}
    {/* paw prints wandering across the wall */}
    {[[110, 150], [200, 110], [620, 140], [700, 96]].map(([x, y], index) => (
      <g key={index} opacity="0.25" fill="#ffffff" transform={`translate(${x} ${y})`}>
        <ellipse cx="0" cy="0" rx="13" ry="10" />
        <circle cx="-12" cy="-12" r="4.5" />
        <circle cx="-2" cy="-16" r="4.5" />
        <circle cx="9" cy="-13" r="4.5" />
      </g>
    ))}
  </svg>
);

export const EcdSubitise: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showing, setShowing] = useState(true);
  const [wrong, setWrong] = useState<number | null>(null);
  const [solved, setSolved] = useState<number | null>(null);
  const [freed, setFreed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = SUBITISE_ROUNDS[index];
  const dots = useMemo(() => dotsFor(round), [round]);
  const choices = useMemo(() => choicesFor(round.count), [round]);

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: SUBITISE_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (hide.current) clearTimeout(hide.current);
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  /** Show the dots for a moment, then pull the blanket over them. */
  const flash = (ms: number) => {
    if (hide.current) clearTimeout(hide.current);
    setShowing(true);
    hide.current = setTimeout(() => setShowing(false), ms);
  };

  useEffect(() => {
    if (finished) return;
    setWrong(null);
    setSolved(null);
    flash(LOOK_MS);
    say(round, () => ask(round));
  }, [index, finished]);

  const pick = (value: number) => {
    if (solved !== null) return;
    ecdSounds.play("buttonClick");

    if (value !== round.count) {
      setWrong(value);
      // A wrong answer earns another look — the point is the seeing, not the guess.
      playWrongResponse(() => flash(PEEK_MS));
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    setSolved(value);
    setShowing(true);
    setFreed((current) => current + 1);
    setCelebrating(true);
    ecdSounds.play("cageOpen");
    window.setTimeout(() => ecdSounds.play("meow"), 380);
    party.current = setTimeout(() => setCelebrating(false), 3000);

    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      if (index + 1 >= SUBITISE_ROUNDS.length) {
        setFinished(true);
        playFinish();
      } else {
        setIndex((current) => current + 1);
      }
    });
  };

  const restart = () => {
    ecdSounds.play("buttonClick");
    setFreed(0);
    setFinished(false);
    setIndex(0);
  };

  return (
    <MathsBoard
      title="Quick Eyes"
      badge={finished ? `${freed}/${SUBITISE_ROUNDS.length}` : `${index + 1}/${SUBITISE_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again to free them all over again."
          : showing
            ? "Look — do not count! How many dots?"
            : "Tap the blanket for another peek, then tap the number."
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/cat-shelter.png">
        <ShelterScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={freed}
          total={SUBITISE_ROUNDS.length}
          onAgain={restart}
          line={`You set ${freed} kittens free with your quick eyes!`}
        />
      ) : (
        <>
          {/* the cage, and the dot card inside it */}
          <div className="absolute inset-x-0 top-[15%] flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (showing) return;
                ecdSounds.play("buttonClick");
                flash(PEEK_MS);
              }}
              aria-label={showing ? "The dots" : "Peek at the dots again"}
              className="relative flex h-[clamp(120px,30vw,230px)] w-[clamp(120px,30vw,230px)] items-center justify-center rounded-[22px] border-[6px] border-[#8a6a3f] bg-white shadow-[0_8px_0_rgba(60,40,10,0.35)]"
            >
              <svg viewBox="0 0 100 100" className="h-full w-full p-[4%]" aria-hidden="true">
                {dots.map(([x, y], dot) => (
                  <circle
                    key={dot}
                    cx={x}
                    cy={y}
                    r="8.4"
                    fill="#2f2fbe"
                    opacity={showing ? 1 : 0}
                    style={{ transition: "opacity 180ms ease" }}
                  />
                ))}
              </svg>

              {/* the blanket over the cage */}
              {!showing && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-[16px] bg-[#e05fbd] text-white">
                  <Eye size={26} />
                  <span className="text-[clamp(11px,2.2vw,18px)]" style={headingFont}>
                    Peek
                  </span>
                </span>
              )}

              {/* the bars, so it reads as a cage rather than a card */}
              {!solved && (
                <span className="pointer-events-none absolute inset-0 flex items-stretch justify-between px-[8%]" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, bar) => (
                    <span key={bar} className="w-[4px] rounded-full bg-[#8a6a3f]/70" />
                  ))}
                </span>
              )}
            </button>
          </div>

          {/* the kitten waiting to be let out */}
          <div className="absolute left-[8%] bottom-[10%] flex flex-col items-center">
            <ArtGlyph
              art={`/images/ecd/maths/characters/kitten-${solved !== null ? "free" : "caged"}.png`}
              emoji={solved !== null ? "😻" : "🐱"}
              className={`h-[clamp(62px,13vw,112px)] w-[clamp(62px,13vw,112px)] ${
                solved !== null ? "ecd-hover" : ""
              }`}
              label="kitten"
            />
            <span
              className="mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[clamp(10px,2vw,16px)] text-[#2b7f92]"
              style={headingFont}
            >
              free: {freed}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-[8%]">
            <NumberChoices
              choices={choices}
              onPick={pick}
              wrong={wrong}
              solved={solved}
              disabled={solved !== null}
            />
          </div>
        </>
      )}
    </MathsBoard>
  );
};

export default EcdSubitise;
