import React, { useCallback, useEffect, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { FinishCard, MathsBoard, MathsScene, headingFont } from "./MathsBoard";
import { TRACE_INTRO, TRACE_ROUNDS, type TraceRound } from "./gameData";
import {
  playCorrectResponse,
  playFinish,
  playMathsLine,
  sayNumber,
  stopMathsVoice,
  stopNumberVoice,
} from "./mathsVoice";

/**
 * Trace the Numbers — writing 0 to 5 with a finger.
 *
 * The numeral is a set of strokes in the order a child should write them, and
 * the finger has to travel *along* the stroke: checkpoints are sampled from the
 * real path, and one is only ticked off once the ones before it have been. That
 * is what makes this handwriting practice rather than a colouring-in — you
 * cannot finish a four by scribbling over it.
 *
 * Every round opens by drawing itself once, because a four-year-old copies what
 * they have just watched far more reliably than what they have been told.
 */

const GAME = "trace-numbers";

/** How many checkpoints a stroke is cut into, and how near counts as "on it". */
const CHECKPOINTS = 26;
const REACH = 15;

const say = (round: TraceRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: TraceRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

type Point = { x: number; y: number };

/** The farm table the writing paper sits on. */
const FarmScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdFarmSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8fe3ff" />
        <stop offset="100%" stopColor="#d9f6ff" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdFarmSky)" />
    <circle cx="96" cy="80" r="44" fill="#ffd54a" />
    {/* rolling field */}
    <path d="M-20 300 q 200 -70 400 -10 t 440 -14 L820 500 L-20 500 Z" fill="#7ed957" />
    <path d="M-20 372 q 220 -50 420 4 t 420 -12 L820 500 L-20 500 Z" fill="#4fb63a" />
    {/* flowers along the field */}
    {[60, 180, 300, 520, 640, 760].map((x, index) => (
      <g key={x} transform={`translate(${x} ${420 + (index % 3) * 18})`}>
        <rect x="-2" y="0" width="4" height="26" fill="#2f8f3a" />
        <circle cx="0" cy="-4" r="9" fill={["#ff6b8b", "#ffd54a", "#ff9f1c"][index % 3]} />
        <circle cx="0" cy="-4" r="3.5" fill="#fff6cf" />
      </g>
    ))}
  </svg>
);

export const EcdTraceNumbers: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [stroke, setStroke] = useState(0);
  const [reached, setReached] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [demo, setDemo] = useState<Point | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const checkpoints = useRef<Point[]>([]);
  const drawing = useRef(false);
  const frame = useRef<number | null>(null);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = TRACE_ROUNDS[index];
  const strokeDone = reached >= CHECKPOINTS;
  const roundDone = strokeDone && stroke + 1 >= round.strokes.length;

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: TRACE_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      if (frame.current) cancelAnimationFrame(frame.current);
      ecdSounds.stopLoop("pencil");
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  /**
   * Cut the current stroke into checkpoints, then run the pencil along it once
   * so the child sees the shape being written before they try it.
   */
  const prepareStroke = useCallback(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    checkpoints.current = Array.from({ length: CHECKPOINTS }, (_, step) => {
      const point = path.getPointAtLength((length * (step + 1)) / CHECKPOINTS);
      return { x: point.x, y: point.y };
    });
    setReached(0);

    if (frame.current) cancelAnimationFrame(frame.current);
    const startedAt = performance.now();
    const runFor = 1500;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / runFor);
      const point = path.getPointAtLength(length * progress);
      setDemo({ x: point.x, y: point.y });
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        frame.current = null;
        setDemo(null);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  // A new numeral: say what it is, then show how it is written.
  useEffect(() => {
    if (finished) return;
    setStroke(0);
    setReached(0);
    say(round, () => ask(round));
  }, [index, finished]);

  // Re-measure whenever the stroke on screen changes.
  useEffect(() => {
    if (finished) return;
    const id = window.setTimeout(prepareStroke, 60);
    return () => window.clearTimeout(id);
  }, [index, stroke, finished, prepareStroke]);

  /** Screen coordinates → the numeral's own 100 × 160 grid. */
  const toLocal = (event: React.PointerEvent): Point | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(matrix.inverse());
    return { x: local.x, y: local.y };
  };

  /**
   * Mark off every checkpoint the finger has passed.
   *
   * Only checkpoints at or after the next one count, so the stroke has to be
   * travelled in the right direction — but jumping ahead a little is forgiven,
   * because a fast finger between two frames really has crossed that ground.
   */
  const advance = (point: Point) => {
    const points = checkpoints.current;
    let next = reached;
    for (let step = reached; step < points.length; step += 1) {
      const target = points[step];
      const distance = Math.hypot(target.x - point.x, target.y - point.y);
      if (distance <= REACH) next = step + 1;
      else if (step > next + 2) break;
    }
    if (next === reached) return;

    setReached(next);
    if (next >= CHECKPOINTS) finishStroke();
  };

  const finishStroke = () => {
    drawing.current = false;
    ecdSounds.stopLoop("pencil");

    if (stroke + 1 < round.strokes.length) {
      ecdSounds.play("countPop");
      window.setTimeout(() => setStroke((current) => current + 1), 400);
      return;
    }

    // The numeral is written: say it, celebrate it, move on.
    setScore((current) => current + 1);
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);
    ecdSounds.play("sparkle");
    sayNumber(round.value, 1, () =>
      playCorrectResponse(() => {
        ecdSounds.play("swipe", 0.8);
        if (index + 1 >= TRACE_ROUNDS.length) {
          setFinished(true);
          playFinish();
        } else {
          setIndex((current) => current + 1);
        }
      }),
    );
  };

  const onDown = (event: React.PointerEvent) => {
    if (roundDone) return;
    const point = toLocal(event);
    if (!point) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    ecdSounds.startLoop("pencil");
    advance(point);
  };

  const onMove = (event: React.PointerEvent) => {
    if (!drawing.current || roundDone) return;
    const point = toLocal(event);
    if (point) advance(point);
  };

  const onUp = () => {
    drawing.current = false;
    ecdSounds.stopLoop("pencil");
  };

  const restart = () => {
    ecdSounds.play("buttonClick");
    setScore(0);
    setFinished(false);
    setIndex(0);
  };

  const start = checkpoints.current[0];
  const progress = reached / CHECKPOINTS;

  return (
    <MathsBoard
      title="Trace the Numbers"
      badge={finished ? `${score}/${TRACE_ROUNDS.length}` : `${index + 1}/${TRACE_ROUNDS.length}`}
      onReplay={
        finished
          ? undefined
          : () => {
              setReached(0);
              prepareStroke();
              ask(round);
            }
      }
      replayLabel="Show me how again"
      celebrating={celebrating}
      hint={
        finished
          ? "Tap play again to write them all once more."
          : round.strokes.length > 1
            ? `Writing ${round.value} — stroke ${stroke + 1} of ${round.strokes.length}. Follow the dots!`
            : `Put your finger on the green dot and follow the dashes to write ${round.value}.`
      }
    >
      <MathsScene art="/images/ecd/maths/backgrounds/farm-desk.png">
        <FarmScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={TRACE_ROUNDS.length}
          onAgain={restart}
          line={`You wrote ${score} numbers all by yourself!`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center gap-[4%] px-[6%] pt-[8%]">
          {/* the writing paper */}
          <div className="relative flex h-[82%] items-center justify-center rounded-[18px] border-[5px] border-white bg-[#fffaf0] px-[2%] shadow-[0_8px_0_rgba(6,102,124,0.2)]">
            <svg
              ref={svgRef}
              viewBox="0 0 100 160"
              className="h-full w-auto touch-none"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
              role="application"
              aria-label={`Trace the number ${round.value}`}
            >
              {/* the strokes already finished stay solid */}
              {round.strokes.slice(0, stroke).map((path, step) => (
                <path
                  key={step}
                  d={path}
                  fill="none"
                  stroke="#2f8fe0"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {/* the stroke being written: a pale groove to travel along… */}
              <path
                ref={pathRef}
                d={round.strokes[stroke]}
                pathLength={1}
                fill="none"
                stroke="#efe3c8"
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* …dashes along it showing the way… */}
              <path
                d={round.strokes[stroke]}
                pathLength={1}
                fill="none"
                stroke="#c9b283"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="0.012 0.028"
              />
              {/* …and the ink laid down as the finger travels. Nothing is drawn
                  before the first checkpoint, or the round line cap would leave
                  a blob of ink sitting on the starting dot. */}
              {progress > 0 && (
                <path
                  d={round.strokes[stroke]}
                  pathLength={1}
                  fill="none"
                  stroke="#2f8fe0"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={`${progress} 1`}
                />
              )}

              {/* where to start */}
              {start && reached === 0 && (
                <g>
                  <circle cx={start.x} cy={start.y} r="11" fill="#12b45c" opacity="0.35" className="ecd-beat" />
                  <circle cx={start.x} cy={start.y} r="6" fill="#12b45c" />
                </g>
              )}

              {/* the pencil showing how it is done */}
              {demo && (
                <g>
                  <circle cx={demo.x} cy={demo.y} r="9" fill="#ff9f1c" opacity="0.45" />
                  <circle cx={demo.x} cy={demo.y} r="5" fill="#ff9f1c" />
                </g>
              )}
            </svg>
          </div>

          {/* the numeral being written, printed big beside the paper */}
          <div className="flex flex-col items-center">
            <span
              className="text-[clamp(60px,15vw,140px)] leading-none text-white drop-shadow-[0_5px_0_rgba(6,102,124,0.45)]"
              style={headingFont}
            >
              {round.value}
            </span>
            <span
              className="mt-1 rounded-full bg-white/90 px-3 py-1 text-[clamp(11px,2.2vw,18px)] text-[#2b7f92] shadow-[0_3px_0_rgba(6,102,124,0.24)]"
              style={headingFont}
            >
              {["zero", "one", "two", "three", "four", "five"][round.value] ?? round.value}
            </span>
          </div>
        </div>
      )}
    </MathsBoard>
  );
};

export default EcdTraceNumbers;
