import React, { useEffect, useMemo, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { FinishCard, MathsBoard, MathsScene, NumberChoices, headingFont } from "./MathsBoard";
import { FRAME_INTRO, FRAME_ROUNDS, type AddRound } from "./gameData";
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
 * Fill the Ten Frame — the same addition, on the frame they will use at school.
 *
 * Ten boxes in two rows of five. The blue stones go in first and the yellow
 * ones carry on from where they stopped, so the child both counts on *and*
 * sees the answer's shape: seven is a full row and two more, every time, and
 * that picture is what later turns into knowing it without counting.
 *
 * Stones always land in the next box along, so the standard left-to-right,
 * top-row-first order is built in rather than being something to remember.
 */

const GAME = "ten-frame";
const CELLS = 10;

const say = (round: AddRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: AddRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

const choicesFor = (total: number) => {
  const options = new Set<number>([total]);
  let offset = 1;
  while (options.size < 3) {
    if (total - offset >= 1) options.add(total - offset);
    if (options.size < 3 && total + offset <= 10) options.add(total + offset);
    offset += 1;
  }
  return [...options].sort((a, b) => a - b);
};

/** A bright table top, so the frame reads as a real thing on a real table. */
const TableScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdFrameWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bff0d0" />
        <stop offset="100%" stopColor="#8fe0b6" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdFrameWall)" />
    <rect y="360" width="800" height="140" fill="#e3b877" />
    <rect y="352" width="800" height="14" fill="#c99a58" />
    {/* a jar of stones on the table */}
    <g transform="translate(710 300)">
      <rect x="-34" y="0" width="68" height="58" rx="12" fill="#d9f2ff" opacity="0.85" />
      <rect x="-34" y="-10" width="68" height="14" rx="7" fill="#a8d8ee" />
      <circle cx="-14" cy="26" r="10" fill="#3fa9f5" />
      <circle cx="10" cy="34" r="10" fill="#ffd54a" />
      <circle cx="0" cy="12" r="9" fill="#3fa9f5" />
    </g>
  </svg>
);

export const EcdTenFrame: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [placed, setPlaced] = useState(0);
  const [wrong, setWrong] = useState<number | null>(null);
  const [solved, setSolved] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = FRAME_ROUNDS[index];
  const total = round.a + round.b;
  const choices = useMemo(() => choicesFor(total), [total]);
  const stage: "blue" | "yellow" | "choose" =
    placed < round.a ? "blue" : placed < total ? "yellow" : "choose";

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: FRAME_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setPlaced(0);
    setWrong(null);
    setSolved(null);
    say(round, () => ask(round));
  }, [index, finished]);

  /** Drop the next stone into the next box, and count it out loud. */
  const drop = () => {
    if (placed >= total) return;
    const next = placed + 1;
    setPlaced(next);
    ecdSounds.play("counterDrop");
    sayNumber(next, 1, () => {
      if (next === total) ask(round);
    });
  };

  const pick = (value: number) => {
    if (stage !== "choose" || solved !== null) return;
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
    party.current = setTimeout(() => setCelebrating(false), 3000);

    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      if (index + 1 >= FRAME_ROUNDS.length) {
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
      title="Fill the Ten Frame"
      badge={finished ? `${score}/${FRAME_ROUNDS.length}` : `${index + 1}/${FRAME_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again to fill the frame once more."
          : stage === "blue"
            ? `Tap the frame to drop in ${round.a} blue stones.`
            : stage === "yellow"
              ? `Now ${round.b} yellow stones — keep counting on!`
              : `${round.a} + ${round.b} — how many stones altogether?`
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/stone-table.png">
        <TableScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={FRAME_ROUNDS.length}
          onAgain={restart}
          line={`You built ${score} sums on the ten frame!`}
        />
      ) : (
        <>
          {/* what is being asked for right now */}
          <div className="absolute inset-x-0 top-[15%] flex justify-center">
            <span
              className="rounded-full bg-white/90 px-[clamp(12px,2.6vw,24px)] py-[clamp(4px,1vw,10px)] text-[clamp(13px,2.8vw,26px)] text-[#2b7f92] shadow-[0_4px_0_rgba(6,102,124,0.24)]"
              style={headingFont}
            >
              {stage === "blue"
                ? `${round.a} blue · ${placed} in`
                : stage === "yellow"
                  ? `${round.b} yellow · ${placed} in`
                  : `${round.a} + ${round.b} = ?`}
            </span>
          </div>

          {/* the ten frame */}
          <div className="absolute inset-x-[8%] top-[30%] flex justify-center">
            <div className="grid w-full max-w-[560px] grid-cols-5 gap-[clamp(3px,0.8vw,8px)] rounded-[14px] border-[4px] border-[#5d6a73] bg-white/90 p-[clamp(3px,0.8vw,8px)]">
              {Array.from({ length: CELLS }).map((_, cell) => {
                const full = cell < placed;
                const isBlue = cell < round.a;
                const isNext = cell === placed && placed < total;
                return (
                  <button
                    key={cell}
                    type="button"
                    onClick={drop}
                    disabled={placed >= total}
                    aria-label={full ? `Box ${cell + 1}, filled` : `Box ${cell + 1}, empty`}
                    className={`flex aspect-[1/1] items-center justify-center rounded-[8px] border-2 border-[#5d6a73]/50 bg-[#f4f7f9] transition-transform ${
                      isNext ? "ecd-beat border-[#ff9f1c]" : ""
                    } ${placed < total ? "hover:scale-105 active:scale-95" : ""}`}
                  >
                    {full && (
                      <span
                        className={`h-[76%] w-[76%] rounded-full shadow-[0_3px_0_rgba(0,0,0,0.25)] ${
                          isBlue ? "bg-[#3fa9f5]" : "bg-[#ffd54a]"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {stage === "choose" && (
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

export default EcdTenFrame;
