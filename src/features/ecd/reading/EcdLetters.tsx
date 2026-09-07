import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Volume2 } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { ToonScene } from "./ToonScene";
import { PHONICS_ALPHABET } from "./phonicsAlphabet";
import { playLetterIntro } from "./phonicsVoice";
import { stopReadingVoice } from "./readingVoice";

/**
 * Meet the Letters — "A is for apple".
 *
 * This is the teaching half of phonics, and it is deliberately separate from
 * the puzzle: a game cannot announce "B is for ball" and then ask the child
 * which letter ball starts with. Here nothing is hidden and nothing is scored.
 * The letter is shown big, the picture and the whole word are on display, and
 * the child moves at their own pace.
 */

const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

export const EcdLetters: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const entry = PHONICS_ALPHABET[index];

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => {
      ecdSounds.releaseIntro();
      stopReadingVoice();
    };
  }, []);

  // Say the letter as soon as it arrives; the big letter beats along with it.
  useEffect(() => {
    setSpeaking(true);
    playLetterIntro(entry, () => setSpeaking(false));
    return () => setSpeaking(false);
  }, [entry]);

  const step = (delta: number) => {
    ecdSounds.play("buttonClick");
    ecdSounds.play("swipe", 0.8);
    setIndex((current) => (current + delta + PHONICS_ALPHABET.length) % PHONICS_ALPHABET.length);
  };

  const jumpTo = (position: number) => {
    ecdSounds.play("buttonClick");
    setIndex(position);
  };

  // Inside an activity the tune sits right back out of the way.
  return (
    <EcdShell musicBed={0.04}>
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-16 pt-[72px] sm:pt-[84px]">
        <h1
          className="px-12 text-center text-[26px] leading-[1.1] text-white drop-shadow-[0_3px_0_rgba(6,102,124,0.45)] sm:px-16 sm:text-[38px]"
          style={headingFont}
        >
          Meet the Letters
        </h1>

        <div className="relative mt-5 w-full max-w-[820px] sm:mt-6">
          <div className="overflow-hidden rounded-[26px] border-[7px] border-white bg-[#3fd0f7] shadow-[0_10px_0_rgba(6,102,124,0.22),0_22px_40px_rgba(2,74,104,0.28)] sm:rounded-[32px] sm:border-[9px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[760/560] lg:aspect-[760/520]">
              <div className="absolute inset-0">
                <ToonScene />
              </div>

              {/* top bar */}
              <div className="absolute left-[3%] top-[4%] z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    ecdSounds.play("buttonClick");
                    navigate("/ecd/reading");
                  }}
                  aria-label="Back to reading topics"
                  className="flex h-[clamp(28px,4.6vw,40px)] w-[clamp(28px,4.6vw,40px)] items-center justify-center rounded-full bg-[#2f8fe0] text-white shadow-[0_3px_0_rgba(6,60,104,0.4)] active:translate-y-[2px] active:shadow-none"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    ecdSounds.play("buttonClick");
                    setSpeaking(true);
                    playLetterIntro(entry, () => setSpeaking(false));
                  }}
                  aria-label={`Say ${entry.letter} is for ${entry.word.toLowerCase()} again`}
                  className="flex h-[clamp(28px,4.6vw,40px)] w-[clamp(28px,4.6vw,40px)] items-center justify-center rounded-full bg-white/90 text-[#2f8fe0] shadow-[0_3px_0_rgba(6,60,104,0.3)] active:translate-y-[2px] active:shadow-none"
                >
                  <Volume2 size={20} />
                </button>
              </div>

              {/* the letter, big enough to trace with a finger */}
              <div className="absolute left-[6%] top-[46%] w-[30%] -translate-y-1/2">
                <div
                  className={`flex w-full flex-col items-center justify-center rounded-[20px] bg-white/95 shadow-[0_6px_0_rgba(6,102,124,0.22)] ${
                    speaking ? "ecd-beat" : ""
                  }`}
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <span
                    className="leading-none text-[#ff9f1c] text-[clamp(46px,11vw,104px)]"
                    style={{
                      ...headingFont,
                      textShadow:
                        "3px 3px 0 rgba(0,0,0,0.14), -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff",
                    }}
                  >
                    {entry.letter}
                    <span className="text-[0.62em] text-[#3fa9f5]">{entry.letter.toLowerCase()}</span>
                  </span>
                  <span
                    className="mt-1 text-[clamp(11px,2vw,18px)] text-[#66727e]"
                    style={headingFont}
                  >
                    says {entry.notation}
                  </span>
                </div>
              </div>

              {/* the picture and the whole word — nothing hidden here */}
              <div className="absolute right-[6%] top-[12%] flex w-[52%] flex-col items-center">
                <div className="flex h-[clamp(70px,14vw,128px)] w-[clamp(96px,20vw,176px)] items-center justify-center rounded-full bg-white shadow-[0_6px_0_rgba(6,102,124,0.16)]">
                  <span
                    key={entry.letter}
                    className={`${entry.motion === "fly" ? "ecd-fly" : "ecd-wiggle"} text-[clamp(32px,7vw,62px)] leading-none`}
                    role="img"
                    aria-label={entry.word}
                  >
                    {entry.emoji}
                  </span>
                </div>

                <div className="mt-[6%] flex w-full flex-nowrap items-center justify-center gap-[clamp(3px,0.9vw,9px)]">
                  {entry.word.split("").map((letter, position) => (
                    <span
                      key={`${entry.word}-${position}`}
                      className={`flex min-w-0 flex-1 basis-0 items-center justify-center rounded-[8px] text-[clamp(12px,3vw,28px)] text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] ${
                        position === entry.blankIndex ? "bg-[#3fa9f5]" : "bg-[#ff9f1c]"
                      }`}
                      style={{ ...headingFont, aspectRatio: "13 / 15", maxWidth: 46 }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>

              {/* step through the alphabet */}
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous letter"
                className="absolute bottom-[5%] left-[6%] flex h-[clamp(34px,5.4vw,50px)] w-[clamp(34px,5.4vw,50px)] items-center justify-center rounded-full border-[3px] border-white bg-[#2f2fbe] text-white shadow-[0_4px_0_rgba(6,60,104,0.45)] active:translate-y-[3px] active:shadow-none"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next letter"
                className="absolute bottom-[5%] right-[6%] flex h-[clamp(34px,5.4vw,50px)] w-[clamp(34px,5.4vw,50px)] items-center justify-center rounded-full border-[3px] border-white bg-[#ff9f1c] text-white shadow-[0_4px_0_rgba(120,70,10,0.45)] active:translate-y-[3px] active:shadow-none"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>

        <p
          className="mt-4 text-center text-[15px] text-white/90 drop-shadow-[0_2px_0_rgba(6,102,124,0.35)] sm:text-[18px]"
          style={headingFont}
        >
          {entry.letter} is for {entry.word.toLowerCase()}
        </p>

        <div className="mt-4 flex w-full max-w-[820px] flex-wrap justify-center gap-1.5 sm:gap-2">
          {PHONICS_ALPHABET.map((item, position) => (
            <button
              key={item.letter}
              type="button"
              onClick={() => jumpTo(position)}
              aria-label={`Meet the letter ${item.letter}`}
              aria-current={position === index ? "true" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-[10px] text-[15px] transition-transform hover:scale-110 sm:h-10 sm:w-10 sm:text-[17px] ${
                position === index
                  ? "bg-[#ff9f1c] text-white shadow-[0_4px_0_#c9741a]"
                  : "bg-white/90 text-[#2b7f92] shadow-[0_3px_0_rgba(6,102,124,0.28)]"
              }`}
              style={headingFont}
            >
              {item.letter}
            </button>
          ))}
        </div>
      </div>
    </EcdShell>
  );
};

export default EcdLetters;
