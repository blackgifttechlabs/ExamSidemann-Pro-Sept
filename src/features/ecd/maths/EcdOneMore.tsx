import React, { useEffect, useMemo, useRef, useState } from "react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { ArtGlyph, CssLilyPad, FinishCard, MathsBoard, MathsScene, headingFont } from "./MathsBoard";
import { HOP_INTRO, HOP_ROUNDS, type HopRound } from "./gameData";
import {
  playCorrectResponse,
  playFinish,
  playMathsLine,
  playWrongResponse,
  sayNumber,
  stopMathsVoice,
  stopNumberVoice,
} from "./mathsVoice";

const GAME = "one-more";
const PADS = 10;

const say = (round: HopRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: round.id, script: round.script }, onEnd);
const ask = (round: HopRound, onEnd?: () => void) =>
  playMathsLine(GAME, { id: `prompts/${round.id}`, script: round.prompt }, onEnd);

const padSpot = (value: number) => ({
  x: 8 + ((value - 1) * 84) / (PADS - 1),
  y: 63 + Math.sin(value * 1.15) * 8,
});

/** A more realistic 3D river scene with depth gradients and sun reflections. */
const RiverScene: React.FC = () => (
  <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ecdRiverSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#76d6f5" />
        <stop offset="100%" stopColor="#c8f1ff" />
      </linearGradient>
      {/* 3D Deep water effect */}
      <linearGradient id="ecdRiverWater" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e98c7" />
        <stop offset="25%" stopColor="#157ca6" />
        <stop offset="100%" stopColor="#0b4863" />
      </linearGradient>
      {/* Sun glint on water */}
      <radialGradient id="waterGlow" cx="50%" cy="20%" r="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
      {/* 3D Shadow for the bank */}
      <linearGradient id="bankShadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="800" height="500" fill="url(#ecdRiverSky)" />
    
    {/* Far bank with 3D rolling hills */}
    <path d="M-20 220 q 150 -50 300 -10 t 300 -30 t 240 10 L820 300 L-20 300 Z" fill="#3a9627" />
    <path d="M-20 210 q 200 -46 400 -8 t 440 -18 L820 300 L-20 300 Z" fill="#4fb63a" />
    
    {/* The water body */}
    <rect y="252" width="800" height="248" fill="url(#ecdRiverWater)" />
    <rect y="252" width="800" height="248" fill="url(#waterGlow)" />
    <rect y="252" width="800" height="15" fill="url(#bankShadow)" />

    {/* Gamified smooth flowing ripples */}
    {[270, 310, 360, 420, 470].map((y, index) => (
      <path
        key={y}
        d={`M-100 ${y} q 60 -10 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`}
        className="animate-ripple"
        style={{ animationDelay: `${index * -0.8}s` }}
        fill="none"
        stroke="#ffffff"
        strokeWidth={index > 2 ? "3" : "2"}
        strokeLinecap="round"
        opacity={0.35 - index * 0.05}
      />
    ))}
    
    {/* Reeds with depth */}
    {[30, 66, 742, 776].map((x, index) => (
      <g key={x} transform={`translate(${x} 480)`}>
        <path d="M0 0 q -6 -50 2 -80" fill="none" stroke="#1d6625" strokeWidth="8" strokeLinecap="round" />
        <path d="M0 0 q -6 -50 2 -80" fill="none" stroke="#2f8f3a" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx={index % 2 === 0 ? 4 : -2} cy="-84" rx="7" ry="15" fill="#5e381b" />
        <ellipse cx={index % 2 === 0 ? 2 : -4} cy="-84" rx="3" ry="12" fill="#8a5a33" />
      </g>
    ))}
  </svg>
);

export const EcdOneMore: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [at, setAt] = useState(HOP_ROUNDS[0].from);
  const [wrong, setWrong] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [lastJump, setLastJump] = useState<number | null>(null);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = HOP_ROUNDS[index];
  const target = round.from + 1;
  const spot = useMemo(() => padSpot(at), [at]);

  useEffect(() => {
    ecdSounds.retainIntro();
    playMathsLine(GAME, { id: "intro", script: HOP_INTRO });
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopMathsVoice();
      stopNumberVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    setAt(round.from);
    setWrong(null);
    setLocked(false);
    say(round, () => ask(round));
  }, [index, finished, round]);

  const jumpTo = (value: number) => {
    if (locked) return;
    ecdSounds.play("buttonClick");

    if (value !== target) {
      setWrong(value);
      ecdSounds.play("splash");
      playWrongResponse();
      window.setTimeout(() => setWrong(null), 600);
      return;
    }

    setLocked(true);
    setAt(value);
    setScore((current) => current + 1);
    setCelebrating(true);
    ecdSounds.play("hop");
    
    setLastJump(value);
    setTimeout(() => {
      setLastJump((current) => (current === value ? null : current));
    }, 1500);

    party.current = setTimeout(() => setCelebrating(false), 3000);

    sayNumber(value, 1, () =>
      playCorrectResponse(() => {
        ecdSounds.play("swipe", 0.8);
        if (index + 1 >= HOP_ROUNDS.length) {
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
    setAt(HOP_ROUNDS[0].from);
  };

  return (
    <MathsBoard
      title="Hoppy's River Hop"
      badge={finished ? `${score}/${HOP_ROUNDS.length}` : `${index + 1}/${HOP_ROUNDS.length}`}
      onReplay={finished ? undefined : () => ask(round)}
      celebrating={celebrating}
      hint={
        finished
          ? "Hoppy is home! Tap play again to cross once more."
          : `Hoppy is on ${round.from}. Tap the pad that is one more.`
      }
    >
      <style>{`
        @keyframes ripple {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-15px); }
        }
        .animate-ripple {
          animation: ripple 5s infinite ease-in-out;
        }
        @keyframes padFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes hoppyIdle {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.04) translateY(-3px); }
        }
        .animate-hoppy-idle {
          animation: hoppyIdle 2s infinite ease-in-out;
        }
        @keyframes flyUpOut {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { transform: translateY(-30px) scale(1.2); opacity: 1; }
          80% { transform: translateY(-80px) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
        }
        .animate-fly-up {
          animation: flyUpOut 1.5s ease-out forwards;
        }
        @keyframes popInUI {
          0% { transform: scale(0.7) translateY(-20px); opacity: 0; }
          60% { transform: scale(1.05) translateY(5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-ui {
          animation: popInUI 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes splashRing {
          0% { transform: scale(0.2); opacity: 1; border-width: 10px; }
          100% { transform: scale(2.5); opacity: 0; border-width: 0px; }
        }
        .animate-splash {
          animation: splashRing 0.5s ease-out forwards;
        }
        /* Thick 3D Text Effect */
        .text-3d {
          text-shadow: 0px 4px 0px #0a3d16, 0px 8px 10px rgba(0,0,0,0.4);
        }
      `}</style>

      <MathsScene art="/images/ecd/maths/backgrounds/river.png">
        <RiverScene />
      </MathsScene>

      {finished ? (
        <FinishCard
          score={score}
          total={HOP_ROUNDS.length}
          onAgain={restart}
          line={`Hoppy hopped all the way across — ${score} perfect jumps!`}
        />
      ) : (
        <>
          {/* Highly Visual 3D Gamified Prompt (No long reading needed!) */}
          <div className="absolute inset-x-0 top-[8%] z-30 flex justify-center pointer-events-none">
            <div key={round.from} className="animate-pop-ui flex flex-col items-center">
              
              {/* Shiny 3D Game Banner */}
              <div className="relative flex items-center justify-center gap-[clamp(8px,2vw,16px)] rounded-full bg-gradient-to-b from-[#4bc0d9] to-[#1d7fb8] px-[clamp(20px,4vw,40px)] py-[clamp(10px,2vw,20px)] shadow-[0_8px_0_#11547a,0_15px_20px_rgba(0,40,60,0.5)] border-4 border-[#8fe3ff]">
                
                {/* Glossy top highlight */}
                <div className="absolute inset-0 top-0 h-1/2 w-full rounded-t-full bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

                {/* Current Number */}
                <div className="relative flex items-center justify-center bg-white rounded-full w-[clamp(40px,8vw,70px)] h-[clamp(40px,8vw,70px)] shadow-[inset_0_-4px_0_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.3)]">
                  <span className="text-[clamp(24px,5vw,40px)] text-[#0b4863]" style={headingFont}>
                    {round.from}
                  </span>
                </div>

                <span className="text-[clamp(28px,6vw,48px)] font-black text-white drop-shadow-[0_4px_0_#11547a]">+1</span>
                
                {/* The "What's Next?" Target */}
                <div className="relative flex items-center justify-center bg-[#0b4863]/40 border-[3px] border-dashed border-white/70 rounded-full w-[clamp(40px,8vw,70px)] h-[clamp(40px,8vw,70px)] shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)]">
                  <span className="text-[clamp(28px,5vw,44px)] text-[#ffde00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] animate-pulse" style={headingFont}>
                    ?
                  </span>
                </div>
              </div>

              {/* Little helper tag to gently guide */}
              <div className="mt-4 rounded-full bg-black/40 px-4 py-1 backdrop-blur-sm">
                <span className="text-[clamp(12px,2vw,18px)] text-white font-bold tracking-widest uppercase shadow-sm">
                  Find the next number!
                </span>
              </div>

            </div>
          </div>

          {/* "+1" Floating Point Animation (Video Game Style) */}
          {lastJump && (
            <div
              className="absolute pointer-events-none z-40"
              style={{ left: `${padSpot(lastJump).x}%`, top: `${padSpot(lastJump).y}%` }}
            >
              <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-[100%] animate-fly-up">
                {/* Glowing Starburst Behind Text */}
                <div className="absolute w-[80px] h-[80px] bg-yellow-300/40 rounded-full blur-xl"></div>
                <span className="text-[clamp(36px,7vw,64px)] font-black text-[#ffea00] drop-shadow-[0_5px_0_#d45d00]" style={headingFont}>
                  +1
                </span>
              </div>
            </div>
          )}

          {/* The lily pads */}
          {Array.from({ length: PADS }).map((_, step) => {
            const value = step + 1;
            const here = value === at;
            const nearby = Math.abs(value - round.from) <= 1;
            const place = padSpot(value);
            return (
              <div
                key={value}
                className="absolute z-10"
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
              >
                <div className="-translate-x-1/2 -translate-y-1/2">
                  <div
                    style={{
                      animation: `padFloat ${3.5 + (value % 2)}s infinite ease-in-out`,
                      animationDelay: `${value * 0.15}s`
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => jumpTo(value)}
                      disabled={locked || here || !nearby}
                      aria-label={`Lily pad ${value}`}
                      className={`group relative flex min-h-[58px] min-w-[68px] items-center justify-center transition-all duration-150 ease-out ${
                        here ? "" : "hover:scale-105 active:scale-95 active:translate-y-[6px]"
                      } ${nearby ? "opacity-100" : "scale-75 opacity-25"} ${wrong === value ? "ecd-shake" : ""}`}
                    >
                      {/* Splash Effect on Error */}
                      {wrong === value && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                          <div className="w-[140%] h-[140%] rounded-full border-cyan-300 animate-splash"></div>
                        </div>
                      )}

                      <span className="relative flex items-center justify-center z-10">
                        {/* Glow for Active/Current Lily Pad */}
                        {here && (
                          <div className="absolute w-[120%] h-[120%] rounded-full bg-white/40 animate-pulse blur-lg z-0"></div>
                        )}
                        
                        <CssLilyPad className="relative z-10 h-[clamp(58px,11vw,104px)] transition-all" />

                        {/* Thick 3D Number Text on the Pad */}
                        <span
                          className={`absolute z-20 text-[clamp(20px,4.5vw,36px)] text-white text-3d transition-all ${
                             !here && "group-active:translate-y-[2px] group-active:text-shadow-[0px_2px_0px_#0a3d16,0px_4px_5px_rgba(0,0,0,0.4)]"
                          }`}
                          style={headingFont}
                        >
                          {value}
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Hoppy with Idle Animations */}
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[135%] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <div className={`${locked ? "" : "animate-hoppy-idle"}`}>
              <ArtGlyph
                art="/images/ecd/maths/characters/hoppy.png"
                emoji="🐸"
                className="h-[clamp(54px,11vw,102px)] w-[clamp(54px,11vw,102px)] drop-shadow-[0_10px_10px_rgba(0,40,60,0.4)]"
                label="Hoppy the frog"
              />
            </div>
          </div>
        </>
      )}
    </MathsBoard>
  );
};

export default EcdOneMore;
