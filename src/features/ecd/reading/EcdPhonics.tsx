import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, Volume2, VolumeX } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { PHONICS_ALPHABET, type PhonicsLetter } from "./phonicsAlphabet";
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
  const [muted, setMuted] = useState(() => ecdSounds.isMuted());
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

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

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    ecdSounds.setMuted(next);
    if (!next) ecdSounds.play("buttonClick");
  };

  // Inside an activity the tune sits right back out of the way.
  return (
    <EcdShell musicBed={0.04} showSound={false}>
      <EcdCelebration show={celebrating} />
      <EcdReaction show={wrongLetter !== null} kind="try-again" label="A monster says try again" />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-16 pt-4 sm:pt-6 lg:pt-4">
        {/* back button + title + mute — outside the card, one row, pinned to the left edge */}
        <div className="flex w-full items-center justify-between gap-3 pl-[5px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                ecdSounds.play("buttonClick");
                navigate("/ecd/reading");
              }}
              aria-label="Back to reading topics"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2f8fe0] text-white shadow-[0_3px_0_rgba(6,60,104,0.4)] active:translate-y-[2px] active:shadow-none sm:h-10 sm:w-10"
            >
              <ChevronLeft size={20} />
            </button>
            <h1
              className="text-left text-[20px] leading-none text-white drop-shadow-[0_3px_0_rgba(6,102,124,0.45)] sm:text-[28px]"
              style={headingFont}
            >
              Phonics &amp; Letter Sounds
            </h1>
          </div>

          <button
            type="button"
            onClick={toggleMuted}
            aria-pressed={muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#2f8fe0] shadow-[0_3px_0_rgba(6,60,104,0.3)] active:translate-y-[2px] active:shadow-none sm:h-10 sm:w-10"
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        <p
          className="mt-3 text-center text-[20px] leading-none text-[#fff35c] drop-shadow-[0_2px_0_rgba(6,102,124,0.55)] sm:text-[24px]"
          style={headingFont}
        >
          {finished
            ? "Tap play again for another go."
            : `Which letter says “${entry.phoneme}”?`}
        </p>

        {/* rail — glassmorphic, one row, current letter stands out, every letter
            jumpable — same markup as the Meet the Letters rail so both pages match */}
        <div className="mt-4 flex w-full max-w-[820px] flex-nowrap items-center gap-3 overflow-x-auto scroll-smooth rounded-2xl border border-white/30 bg-white/15 px-3 py-2 shadow-[0_8px_32px_rgba(0,40,60,0.18)] backdrop-blur-md sm:gap-3.5 sm:px-4 sm:py-2.5 lg:max-w-[1200px] lg:overflow-visible lg:gap-3 lg:px-4 lg:py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PHONICS_ALPHABET.map((item, position) => {
            const isCurrent = position === index && !finished;
            const isFound = found.includes(item.letter);
            return (
              <button
                key={item.letter}
                ref={isCurrent ? activeRef : undefined}
                type="button"
                onClick={() => {
                  ecdSounds.play("buttonClick");
                  goTo(position);
                }}
                aria-label={`Practise the letter ${item.letter}`}
                aria-current={isCurrent ? "true" : undefined}
                className={`relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-[16px] transition-all duration-200 sm:h-12 sm:w-12 sm:text-[18px] lg:aspect-square lg:h-auto lg:w-auto lg:min-w-0 lg:max-w-[54px] lg:flex-1 lg:shrink lg:basis-0 lg:text-[20px] ${
                  isCurrent
                    ? "scale-110 bg-gradient-to-br from-[#ffb648] to-[#ff9f1c] text-white shadow-[0_0_0_4px_rgba(255,159,28,0.28)]"
                    : "bg-white/15 text-white/85 hover:scale-110 hover:bg-white/30"
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

        <div className="relative mt-5 w-full max-w-[820px] sm:mt-6">
          <div className="overflow-hidden rounded-[26px] border-[7px] border-white bg-[#3fd0f7] shadow-[0_10px_0_rgba(6,102,124,0.22),0_22px_40px_rgba(2,74,104,0.28)] sm:rounded-[32px] sm:border-[9px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[760/560] lg:aspect-[760/520]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url(/images/ecd/backgrounds/kids1.jpeg)" }}
              />

              {/* level bar */}
              <div className="absolute left-[3%] top-[4%] flex items-center gap-2">
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
                  <div className="absolute left-[5%] right-[25%] top-[46%] flex flex-nowrap items-center justify-center gap-[clamp(4px,1.1vw,12px)]">
                    {entry.word.split("").map((letter, position) => {
                      const isBlank = position === entry.blankIndex;
                      const filled = !isBlank || solved;
                      return (
                        <span
                          key={`${entry.word}-${position}`}
                          className={`flex min-w-0 flex-1 basis-0 items-center justify-center rounded-[10px] text-[clamp(18px,4.5vw,40px)] text-white shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-colors ${
                            filled ? "bg-[#ff9f1c]" : "bg-[#3fa9f5]"
                          }`}
                          style={{ ...headingFont, aspectRatio: "13 / 15", maxWidth: 64 }}
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

                      {choices.map((letter, choiceIndex) => (
                        <button
                          key={letter}
                          type="button"
                          onClick={() => pick(letter)}
                          disabled={solved}
                          aria-label={`Letter ${letter}`}
                          style={{
                            ...headingFont,
                            animationDelay:
                              wrongLetter === letter ? undefined : `${choiceIndex * 0.35}s`,
                          }}
                          className={`relative flex aspect-square w-full max-w-[64px] items-center justify-center overflow-hidden rounded-full text-[clamp(20px,4.4vw,38px)] text-white shadow-[0_10px_18px_rgba(0,40,70,0.4),inset_0_3px_6px_rgba(255,255,255,0.55),inset_0_-6px_10px_rgba(0,0,0,0.12)] transition-transform active:translate-y-[3px] active:shadow-none ${
                            wrongLetter === letter
                              ? "ecd-shake bg-gradient-to-br from-[#f68b86] via-[#e8534f] to-[#b23430]"
                              : solved && letter === entry.letter
                              ? "ecd-hover scale-110 bg-gradient-to-br from-[#fff3c4] via-[#ff9f1c] to-[#c9741a]"
                              : "ecd-hover bg-gradient-to-br from-[#eaf9ff] via-[#3fa9f5] to-[#1c7fd1] hover:scale-105"
                          }`}
                        >
                          {/* glossy highlight, like light catching the top of a soap bubble */}
                          <span className="pointer-events-none absolute left-[16%] top-[10%] h-[32%] w-[38%] rounded-full bg-white/70 blur-[2px]" />
                          <span className="pointer-events-none absolute inset-0 rounded-full border border-white/40" />
                          <span className="relative">{letter}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </EcdShell>
  );
};

export default EcdPhonics;
