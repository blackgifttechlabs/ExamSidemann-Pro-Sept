import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Volume2 } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";
import { PHONICS_ALPHABET, type PhonicsLetter } from "./phonicsAlphabet";
import { ToonScene } from "./ToonScene";
import { playLetterPrompt } from "./phonicsVoice";
import {
  DEFAULT_READING_DUCK,
  playCorrectResponse,
  playFinish,
  playWrongResponse,
  setReadingDuckLevel,
  stopReadingVoice,
} from "./readingVoice";

/**
 * Phonics & Letter Sounds — all twenty-six letters.
 *
 * A picture appears in a thought cloud, its word sits underneath with one tile
 * empty, and the mascot holds three letters. The child taps the letter that
 * makes the sound the word starts with (or, for X, ends with).
 *
 * The pictures are emoji rather than image files: they need no assets, they
 * never 404 on a slow phone, and they scale to any tile size. Every spoken
 * line has a recorded clip and a written script — see `phonicsVoice` for how
 * one falls back to the other, and `docs/ECD_READING_VOICE_SCRIPTS.md` for the
 * recording sheet.
 */

const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

/** Shuffle the three choices so the answer is not always in the same slot. */
const choicesFor = (entry: PhonicsLetter, seed: number) => {
  const letters = [entry.letter, ...entry.decoys];
  // A fixed rotation keeps the order stable across re-renders of one letter
  // while still moving the answer around from letter to letter.
  const offset = seed % letters.length;
  return [...letters.slice(offset), ...letters.slice(0, offset)];
};

export const EcdPhonics: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  /** True while the answer letter is being shown off after a correct pick. */
  const [revealing, setRevealing] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const entry = PHONICS_ALPHABET[index];
  const choices = useMemo(() => choicesFor(entry, index), [entry, index]);

  useEffect(() => {
    ecdSounds.retainIntro();
    // The whole puzzle is "which sound is this?", so the music goes almost
    // silent under every line here rather than merely quiet.
    setReadingDuckLevel(0.02);
    return () => {
      setReadingDuckLevel(DEFAULT_READING_DUCK);
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopReadingVoice();
    };
  }, []);

  // Only the question is asked here. "A is for apple" belongs to Meet the
  // Letters — saying it in the puzzle would hand the child the answer.
  useEffect(() => {
    if (finished) return;
    playLetterPrompt(entry);
  }, [entry, finished]);

  const goTo = (next: number) => {
    if (party.current) clearTimeout(party.current);
    setSolved(false);
    setRevealing(false);
    setWrongLetter(null);
    setFinished(false);
    setIndex(next);
  };

  const pick = (letter: string) => {
    if (solved) return;
    ecdSounds.play("buttonClick");

    if (letter !== entry.letter) {
      setWrongLetter(letter);
      // The buzz, then the spoken try-again, each waiting for the last.
      playWrongResponse();
      window.setTimeout(() => setWrongLetter(null), 600);
      return;
    }

    setSolved(true);
    setRevealing(true);
    setFound((current) => (current.includes(letter) ? current : [...current, letter]));
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);

    // Success chime, then the spoken well-done, and only once both have
    // actually finished does the next letter arrive. Nothing is cut off, and a
    // child who moves on early cancels the chain rather than racing it.
    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      setSolved(false);
      setRevealing(false);
      if (index + 1 >= PHONICS_ALPHABET.length) {
        setFinished(true);
        playFinish();
      } else {
        setIndex((current) => current + 1);
      }
    });
  };

  const restart = () => {
    ecdSounds.play("buttonClick");
    setFound([]);
    goTo(0);
  };

  // Inside an activity the tune sits right back out of the way.
  return (
    <EcdShell musicBed={0.04}>
      <EcdCelebration show={celebrating} />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-16 pt-[72px] sm:pt-[84px]">
        <h1
          className="px-12 text-center text-[26px] leading-[1.1] text-white drop-shadow-[0_3px_0_rgba(6,102,124,0.45)] sm:px-16 sm:text-[38px]"
          style={headingFont}
        >
          Phonics &amp; Letter Sounds
        </h1>

        <div className="relative mt-5 w-full max-w-[820px] sm:mt-6">
          <div className="overflow-hidden rounded-[26px] border-[7px] border-white bg-[#3fd0f7] shadow-[0_10px_0_rgba(6,102,124,0.22),0_22px_40px_rgba(2,74,104,0.28)] sm:rounded-[32px] sm:border-[9px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[760/560] lg:aspect-[760/520]">
              <div className="absolute inset-0">
                <ToonScene />
              </div>

              {/* level bar */}
              <div className="absolute left-[3%] top-[4%] flex items-center gap-2">
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
                <span
                  className="rounded-full bg-[#2f8fe0] px-[clamp(10px,1.6vw,16px)] py-[clamp(4px,0.8vw,8px)] text-[clamp(12px,1.8vw,17px)] text-white shadow-[0_3px_0_rgba(6,60,104,0.4)]"
                  style={headingFont}
                >
                  {finished ? `${found.length}/${PHONICS_ALPHABET.length}` : entry.letter}
                </span>
                {!finished && (
                  <button
                    type="button"
                    onClick={() => {
                      ecdSounds.play("buttonClick");
                      playLetterPrompt(entry);
                    }}
                    aria-label={`Hear the sound for ${entry.word} again`}
                    className="flex h-[clamp(28px,4.6vw,40px)] w-[clamp(28px,4.6vw,40px)] items-center justify-center rounded-full bg-white/90 text-[#2f8fe0] shadow-[0_3px_0_rgba(6,60,104,0.3)] active:translate-y-[2px] active:shadow-none"
                  >
                    <Volume2 size={20} />
                  </button>
                )}
              </div>



              {finished ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <div className="rounded-[26px] bg-white/95 px-8 py-6 shadow-[0_8px_0_rgba(6,102,124,0.25)]">
                    <p className="text-[clamp(22px,4vw,34px)] text-[#26313b]" style={headingFont}>
                      Well done! 🎉
                    </p>
                    <p className="mt-1 text-[clamp(14px,2.2vw,20px)] text-[#66727e]" style={headingFont}>
                      You found {found.length} of {PHONICS_ALPHABET.length} letter sounds.
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={restart}
                        className="ecd-pill bg-[#2f2fbe] px-5 py-2.5 text-[clamp(13px,2vw,18px)] shadow-[0_5px_0_#21218f]"
                        style={headingFont}
                      >
                        Play again
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          ecdSounds.play("buttonClick");
                          navigate("/ecd/reading");
                        }}
                        className="ecd-pill bg-[#12b45c] px-5 py-2.5 text-[clamp(13px,2vw,18px)] shadow-[0_5px_0_#0a8442]"
                        style={headingFont}
                      >
                        More topics
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* the picture, in its thought cloud */}
                  <div className="absolute left-[6%] right-[26%] top-[7%] flex justify-center">
                    <div className="relative">
                      <div className="flex h-[clamp(74px,15vw,132px)] w-[clamp(104px,21vw,186px)] items-center justify-center rounded-full bg-white shadow-[0_6px_0_rgba(6,102,124,0.16)]">
                        <span
                          key={entry.letter}
                          className={`${entry.motion === "fly" ? "ecd-fly" : "ecd-wiggle"} text-[clamp(34px,7.5vw,66px)] leading-none`}
                          role="img"
                          aria-label={entry.word}
                        >
                          {entry.emoji}
                        </span>
                      </div>
                      <span className="absolute -bottom-[10px] left-[22%] h-[14px] w-[14px] rounded-full bg-white" />
                      <span className="absolute -bottom-[22px] left-[14%] h-[9px] w-[9px] rounded-full bg-white" />
                    </div>
                  </div>

                  {/* the answer letter, raised as the reward for finding it */}
                  {revealing && (
                    <span
                      key={`${entry.letter}-rise`}
                      className="ecd-rise pointer-events-none absolute left-[20%] top-[36%] -translate-x-1/2 -translate-y-1/2 text-[clamp(70px,15vw,150px)] leading-none text-[#ff9f1c]"
                      style={{
                        ...headingFont,
                        textShadow:
                          "3px 3px 0 rgba(0,0,0,0.18), -3px -3px 0 #fff, 3px -3px 0 #fff, -3px 3px 0 #fff, 3px 3px 0 #fff",
                      }}
                      aria-hidden="true"
                    >
                      {entry.letter}
                    </span>
                  )}

                  {/* the word, first tile waiting to be filled */}
                  {/* One row, never wrapped: the tiles share the width between
                      them, so an eight-letter word shrinks to fit instead of
                      spilling a letter onto the grass. */}
                  <div className="absolute left-[5%] right-[25%] top-[46%] flex flex-nowrap items-center justify-center gap-[clamp(3px,0.9vw,9px)]">
                    {entry.word.split("").map((letter, position) => {
                      const isBlank = position === entry.blankIndex;
                      const filled = !isBlank || solved;
                      return (
                        <span
                          key={`${entry.word}-${position}`}
                          className={`flex min-w-0 flex-1 basis-0 items-center justify-center rounded-[8px] text-[clamp(12px,3vw,28px)] text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-colors ${
                            filled ? "bg-[#ff9f1c]" : "bg-[#3fa9f5]"
                          }`}
                          style={{ ...headingFont, aspectRatio: "13 / 15", maxWidth: 46 }}
                        >
                          {filled ? letter : ""}
                        </span>
                      );
                    })}
                  </div>

                  {/* the mascot, holding the three letters */}
                  <div className="absolute bottom-[8%] right-[7%] top-[16%] flex w-[17%] min-w-[58px] flex-col items-center">
                    <div className="relative flex h-full w-full flex-col items-center justify-center gap-[6%] rounded-[26px] bg-[#12b45c] px-[6%] shadow-[0_6px_0_#0a8442]">
                      {/* hat */}
                      <span className="absolute -top-[9%] left-1/2 h-[7%] w-[70%] -translate-x-1/2 rounded-full bg-[#2f3b45]" />
                      <span className="absolute -top-[15%] left-1/2 h-[8%] w-[42%] -translate-x-1/2 rounded-t-[8px] bg-[#2f3b45]" />

                      {/* face */}
                      <span className="absolute left-1/2 top-[4%] flex -translate-x-1/2 gap-[7px]">
                        <span className="h-[7px] w-[7px] rounded-full bg-[#0a5c31]" />
                        <span className="h-[7px] w-[7px] rounded-full bg-[#0a5c31]" />
                      </span>
                      <span className="absolute left-1/2 top-[8.5%] h-[6px] w-[16px] -translate-x-1/2 rounded-b-full border-b-[3px] border-[#0a5c31]" />

                      {/* arms */}
                      <span className="absolute -left-[22%] top-[36%] h-[8%] w-[26%] rounded-full bg-[#12b45c]" />
                      <span className="absolute -left-[26%] top-[22%] h-[18%] w-[7%] rounded-full bg-[#12b45c]" />
                      <span className="absolute -right-[22%] top-[46%] h-[8%] w-[26%] rounded-full bg-[#12b45c]" />
                      <span className="absolute -right-[26%] top-[32%] h-[18%] w-[7%] rounded-full bg-[#12b45c]" />

                      {choices.map((letter) => (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => pick(letter)}
                          disabled={solved}
                          aria-label={`Letter ${letter}`}
                          className={`flex aspect-square w-full max-w-[56px] items-center justify-center rounded-[10px] text-[clamp(15px,3.2vw,28px)] text-white shadow-[0_4px_0_rgba(0,0,0,0.22)] transition-transform active:translate-y-[3px] active:shadow-none ${
                            solved && letter === entry.letter
                              ? "bg-[#ff9f1c] scale-110"
                              : "bg-[#3fa9f5] hover:scale-105"
                          } ${wrongLetter === letter ? "ecd-shake bg-[#e8534f]" : ""}`}
                          style={headingFont}
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[14px] text-white/90 drop-shadow-[0_2px_0_rgba(6,102,124,0.35)]" style={headingFont}>
          {finished
            ? "Tap play again for another go."
            : `Which letter says “${entry.phoneme}”?`}
        </p>

        {/* the whole alphabet, so any letter can be practised on its own */}
        <div className="mt-4 flex w-full max-w-[820px] flex-wrap justify-center gap-1.5 sm:gap-2">
          {PHONICS_ALPHABET.map((item, position) => {
            const isCurrent = position === index && !finished;
            const isFound = found.includes(item.letter);
            return (
              <button
                key={item.letter}
                type="button"
                onClick={() => {
                  ecdSounds.play("buttonClick");
                  goTo(position);
                }}
                aria-label={`Practise the letter ${item.letter}`}
                aria-current={isCurrent ? "true" : undefined}
                className={`relative flex h-9 w-9 items-center justify-center rounded-[10px] text-[15px] transition-transform hover:scale-110 sm:h-10 sm:w-10 sm:text-[17px] ${
                  isCurrent
                    ? "bg-[#ff9f1c] text-white shadow-[0_4px_0_#c9741a]"
                    : "bg-white/90 text-[#2b7f92] shadow-[0_3px_0_rgba(6,102,124,0.28)]"
                }`}
                style={headingFont}
              >
                {item.letter}
                {isFound && !isCurrent && (
                  <Check
                    size={12}
                    strokeWidth={4}
                    className="absolute -right-1 -top-1 rounded-full bg-[#12b45c] p-[1px] text-white"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </EcdShell>
  );
};

export default EcdPhonics;
