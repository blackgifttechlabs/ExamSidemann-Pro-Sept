import React, { useEffect, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { ArtGlyph, EcdArt, FinishCard, MathsBoard, MathsScene, headingFont } from "./MathsBoard";
import { POSITION_INTRO, POSITION_ROUNDS, type Place, type PositionRound } from "./gameData";
import {
  playCorrectResponse,
  playFinish,
  playMathsLine,
  playWrongResponse,
  stopMathsVoice,
  stopNumberVoice,
} from "./mathsVoice";

/**
 * Above and Below — the position words.
 *
 * This is maths, even though nothing is counted: above, on and under are the
 * words a child needs before they can be told where to put a number, read a
 * graph, or follow any instruction in a maths lesson at all.
 *
 * Every round shows the same three places around one piece of furniture, so
 * the only thing that changes is the word being asked for. That is deliberate —
 * a child working out both the layout and the word at once learns neither.
 */

const GAME = "above-below";

const say = (round: PositionRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: PositionRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

/**
 * How high up the board each place sits — the top edge of the object.
 *
 * These three are pinned to the furniture below: `on` ends exactly where the
 * table top starts, and `under` sits between the legs. A child arguing that the
 * apple is not really *on* the table would be right, and would stop believing
 * the word.
 */
const PLACE_POSITION: Record<Place, React.CSSProperties> = {
  above: { top: "30%", transform: "translateX(-50%)" },
  // The furniture PNG has transparent padding above it. Its visible top is at
  // about 59% of the board, so the object is bottom-anchored to that surface.
  on: { top: "59%", transform: "translate(-50%, -100%)" },
  under: { top: "60%", transform: "translateX(-50%)" },
};

const PLACE_WORD: Record<Place, string> = {
  above: "ABOVE",
  on: "ON",
  under: "UNDER",
};

/**
 * The furniture, drawn rather than borrowed from the emoji font.
 *
 * There is no table emoji — the nearest is a chair — and a picture that does
 * not match the word being taught is worse than no picture at all. Each shape
 * puts its top surface at the same height, so the object resting "on" it lands
 * in the right place whichever piece of furniture the round uses.
 */
const Furniture: React.FC<{ word: string }> = ({ word }) => (
  <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
    {word === "shelf" ? (
      <g>
        <rect x="18" y="12" width="164" height="16" rx="4" fill="#c98a4b" />
        <path d="M40 28 L40 52 L58 28 Z" fill="#a86e37" />
        <path d="M160 28 L160 52 L142 28 Z" fill="#a86e37" />
      </g>
    ) : word === "box" ? (
      <g>
        <rect x="36" y="12" width="128" height="82" rx="6" fill="#c98a4b" />
        <rect x="36" y="12" width="128" height="14" rx="6" fill="#a86e37" />
        <rect x="94" y="12" width="12" height="82" fill="#b87c40" />
        <rect x="46" y="94" width="16" height="12" rx="4" fill="#8a5a33" />
        <rect x="138" y="94" width="16" height="12" rx="4" fill="#8a5a33" />
      </g>
    ) : word === "chair" ? (
      <g>
        <rect x="52" y="12" width="96" height="14" rx="4" fill="#c98a4b" />
        <rect x="132" y="-46" width="16" height="60" rx="5" fill="#a86e37" />
        <rect x="132" y="-34" width="16" height="10" fill="#c98a4b" />
        <rect x="58" y="26" width="13" height="76" rx="5" fill="#a86e37" />
        <rect x="129" y="26" width="13" height="76" rx="5" fill="#a86e37" />
      </g>
    ) : (
      <g>
        <rect x="14" y="12" width="172" height="16" rx="5" fill="#c98a4b" />
        <rect x="30" y="28" width="15" height="78" rx="5" fill="#a86e37" />
        <rect x="155" y="28" width="15" height="78" rx="5" fill="#a86e37" />
      </g>
    )}
  </svg>
);

/** The only positional object without a PNG. Kept in code so the answer can
 * never disappear while preserving the same glossy, dimensional style. */
const Balloon: React.FC = () => (
  <span className="relative block h-full w-full" aria-hidden="true">
    <span className="absolute left-1/2 top-[4%] h-[72%] w-[62%] -translate-x-1/2 rounded-[50%_50%_46%_46%] bg-[radial-gradient(circle_at_30%_24%,#fff_0%,#ff8bc5_12%,#f52b93_48%,#a90d61_100%)] shadow-[inset_-8px_-9px_10px_rgba(91,0,48,.3),0_9px_10px_rgba(50,20,40,.28)]" />
    <span className="absolute left-1/2 top-[70%] h-[12%] w-[12%] -translate-x-1/2 rotate-45 bg-[#b91469]" />
    <span className="absolute left-1/2 top-[78%] h-[22%] w-[3px] -translate-x-1/2 bg-[#72534c]" />
  </span>
);

/** A plain bright room, so nothing competes with the three objects. */
const RoomScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdRoomWall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe9c2" />
        <stop offset="100%" stopColor="#ffd79a" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdRoomWall)" />
    {/* a window on the wall */}
    <g transform="translate(96 70)">
      <rect width="150" height="120" rx="10" fill="#8fe3ff" stroke="#ffffff" strokeWidth="9" />
      <path d="M75 0 L75 120 M0 60 L150 60" stroke="#ffffff" strokeWidth="7" />
    </g>
    {/* skirting and floor */}
    <rect y="404" width="800" height="96" fill="#c98a4b" />
    <rect y="396" width="800" height="14" fill="#a86e37" />
  </svg>
);

export const EcdAboveBelow: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [wrong, setWrong] = useState<Place | null>(null);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = POSITION_ROUNDS[index];

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: POSITION_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setWrong(null);
    setSolved(false);
    say(round, () => ask(round));
  }, [index, finished]);

  const pick = (place: Place) => {
    if (solved) return;
    ecdSounds.play("buttonClick");

    if (place !== round.target) {
      setWrong(place);
      playWrongResponse();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    setSolved(true);
    setScore((current) => current + 1);
    setCelebrating(true);
    ecdSounds.play("sparkle");
    party.current = setTimeout(() => setCelebrating(false), 3000);

    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      if (index + 1 >= POSITION_ROUNDS.length) {
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
      title="Above and Below"
      badge={finished ? `${score}/${POSITION_ROUNDS.length}` : `${index + 1}/${POSITION_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again for another looking game."
          : `Tap the thing that is ${PLACE_WORD[round.target]} the ${round.furniture}.`
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/play-room.png">
        <RoomScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={POSITION_ROUNDS.length}
          onAgain={restart}
          line={`You found ${score} of them. Good looking!`}
        />
      ) : (
        <>
          {/* the word being asked for, big enough to be the point of the screen */}
          <div className="absolute inset-x-0 top-[clamp(104px,15%,136px)] z-10 flex justify-center">
            <span
              className="rounded-full bg-[#e05fbd] px-[clamp(14px,3vw,28px)] py-[clamp(4px,1vw,10px)] text-[clamp(14px,3.2vw,30px)] text-white shadow-[0_5px_0_#a83b8c]"
              style={headingFont}
            >
              {PLACE_WORD[round.target]} the {round.furniture}
            </span>
          </div>

          {/* Only one furniture layer is shown. The code version is a loading
              and missing-image fallback, never an underlay behind the PNG. */}
          <div
            className="pointer-events-none absolute left-1/2 top-[50%] h-[28%] w-[38%] max-w-[300px] -translate-x-1/2"
            role="img"
            aria-label={round.furniture}
          >
            <EcdArt
              src={`/images/ecd/maths/elements/${round.furniture}.png`}
              className="absolute inset-0 h-full w-full object-contain"
              fallback={<Furniture word={round.furniture} />}
            />
          </div>

          {/* the three things: one above, one on, one under */}
          {round.items.map((item) => (
            /* Placement outside, movement inside: the float and the shake both
               animate `transform`, which would wipe out the centring translate
               if they shared an element with it. */
            <div
              key={item.place}
              className="absolute left-1/2 z-10"
              style={PLACE_POSITION[item.place]}
            >
              <button
                type="button"
                onClick={() => pick(item.place)}
                disabled={solved}
                aria-label={`${item.word}, ${item.place} the ${round.furniture}`}
                className={`flex items-center justify-center transition-transform ${
                  solved && item.place === round.target ? "scale-125" : "hover:scale-110 active:scale-95"
                } ${wrong === item.place ? "ecd-shake" : ""} ${item.place === "above" ? "ecd-hover" : ""}`}
              >
                {item.word === "balloon" ? (
                  <span className="h-[clamp(72px,14vw,124px)] w-[clamp(72px,14vw,124px)]">
                    <Balloon />
                  </span>
                ) : (
                  <ArtGlyph
                    art={`/images/ecd/maths/elements/${item.word}.png`}
                    emoji={item.emoji}
                    className="h-[clamp(62px,13vw,116px)] w-[clamp(62px,13vw,116px)] drop-shadow-[0_8px_8px_rgba(0,40,60,0.28)]"
                    label={item.word}
                  />
                )}
              </button>
            </div>
          ))}
        </>
      )}
    </MathsBoard>
  );
};

export default EcdAboveBelow;
