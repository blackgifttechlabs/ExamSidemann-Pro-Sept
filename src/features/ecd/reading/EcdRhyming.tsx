import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, Volume2 } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";
import { ToonScene } from "./ToonScene";
import {
  RHYME_ROUNDS,
  rhymeIntroUrl,
  rhymePromptUrl,
  type RhymeCard,
  type RhymeRound,
} from "./rhymingWords";
import {
  playCorrectResponse,
  playFinish,
  playReadingLine,
  playWrongResponse,
  stopReadingVoice,
} from "./readingVoice";

/**
 * Rhyming Words.
 *
 * The word to match sits in a thought cloud at the top; three picture cards
 * lie on the grass below and exactly one of them rhymes. Getting it right
 * shows the chunk the two words share — cat and hat are both `-at` — which is
 * the bridge from hearing a rhyme to reading a word family.
 *
 * Same world, mascot and voice engine as the phonics game; see `readingVoice`
 * for how a recorded clip falls back to the browser's own voice.
 */

const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

/** Move the answer around from round to round without reshuffling on re-render. */
const cardsFor = (round: RhymeRound, seed: number): RhymeCard[] => {
  const cards = [round.match, ...round.decoys];
  const offset = seed % cards.length;
  return [...cards.slice(offset), ...cards.slice(0, offset)];
};

/**
 * Two ways to play.
 *
 * In **practise** the round opens with the teaching line — "cat… hat, can you
 * hear it?" — which names the rhyme before asking for it. In **test** only the
 * question is played, so the child has to hear the match for themselves. The
 * two use different recordings; nothing is hidden or revealed in the pictures.
 */
type Mode = "practise" | "test";

const MODE_KEY = "yippie_rhyming_mode";

const playIntro = (round: RhymeRound, onEnd?: () => void) =>
  playReadingLine(rhymeIntroUrl(round.id), round.script, onEnd);
const playPrompt = (round: RhymeRound, onEnd?: () => void) =>
  playReadingLine(rhymePromptUrl(round.id), round.prompt, onEnd);

/** What a round says when it opens, for the mode in play. */
const openRound = (round: RhymeRound, mode: Mode) => {
  if (mode === "test") {
    playPrompt(round);
    return;
  }
  // The question follows the teaching line only once it has actually
  // finished, so neither is ever clipped.
  playIntro(round, () => playPrompt(round));
};

export const EcdRhyming: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [mode, setMode] = useState<Mode>(() => {
    try {
      return localStorage.getItem(MODE_KEY) === "test" ? "test" : "practise";
    } catch {
      return "practise";
    }
  });
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);

  const round = RHYME_ROUNDS[index];
  const cards = useMemo(() => cardsFor(round, index), [round, index]);

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => {
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopReadingVoice();
    };
  }, []);

  useEffect(() => {
    if (finished) return;
    openRound(round, mode);
  }, [round, finished, mode]);

  const goTo = (next: number) => {
    if (party.current) clearTimeout(party.current);
    setSolved(false);
    setWrongWord(null);
    setFinished(false);
    setIndex(next);
  };

  const pick = (card: RhymeCard) => {
    if (solved) return;
    ecdSounds.play("buttonClick");

    if (card.word !== round.match.word) {
      setWrongWord(card.word);
      // The buzz, then the spoken try-again, each waiting for the last.
      playWrongResponse();
      window.setTimeout(() => setWrongWord(null), 600);
      return;
    }

    setSolved(true);
    setFound((current) => (current.includes(round.id) ? current : [...current, round.id]));
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);

    // Success chime, then the spoken well-done, and only once both have
    // actually finished does the next pair arrive.
    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      setSolved(false);
      if (index + 1 >= RHYME_ROUNDS.length) {
        setFinished(true);
        playFinish();
      } else {
        setIndex((current) => current + 1);
      }
    });
  };

  const chooseMode = (next: Mode) => {
    if (next === mode) return;
    ecdSounds.play("buttonClick");
    setMode(next);
    try {
      localStorage.setItem(MODE_KEY, next);
    } catch {
      /* private browsing — the choice just will not be remembered */
    }
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
          Rhyming Words
        </h1>

        {/* Practise tells you the rhyme; test makes you find it. */}
        <div
          className="mt-3 flex items-center gap-1 rounded-full bg-white/25 p-1"
          role="group"
          aria-label="How to play"
        >
          {(["practise", "test"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => chooseMode(option)}
              aria-pressed={mode === option}
              className={`rounded-full px-4 py-1.5 text-[14px] transition-colors sm:px-5 sm:text-[16px] ${
                mode === option
                  ? "bg-white text-[#1d6f80] shadow-[0_3px_0_rgba(6,102,124,0.28)]"
                  : "text-white/90 hover:text-white"
              }`}
              style={headingFont}
            >
              {option === "practise" ? "Practise" : "Test me"}
            </button>
          ))}
        </div>

        <div className="relative mt-5 w-full max-w-[820px] sm:mt-6">
          <div className="overflow-hidden rounded-[26px] border-[7px] border-white bg-[#3fd0f7] shadow-[0_10px_0_rgba(6,102,124,0.22),0_22px_40px_rgba(2,74,104,0.28)] sm:rounded-[32px] sm:border-[9px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[760/560] lg:aspect-[760/520]">
              <div className="absolute inset-0">
                <ToonScene />
              </div>

              {/* level bar */}
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
                <span
                  className="rounded-full bg-[#2f8fe0] px-[clamp(10px,1.6vw,16px)] py-[clamp(4px,0.8vw,8px)] text-[clamp(12px,1.8vw,17px)] text-white shadow-[0_3px_0_rgba(6,60,104,0.4)]"
                  style={headingFont}
                >
                  {finished ? `${found.length}/${RHYME_ROUNDS.length}` : index + 1}
                </span>
                {!finished && (
                  <button
                    type="button"
                    onClick={() => {
                      ecdSounds.play("buttonClick");
                      openRound(round, mode);
                    }}
                    aria-label={`Hear the question about ${round.target.word} again`}
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
                      You matched {found.length} of {RHYME_ROUNDS.length} rhymes.
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
                  {/* the word to rhyme with, in its thought cloud */}
                  <div className="absolute inset-x-0 top-[9%] flex justify-center">
                    <div className="relative">
                      <div className="flex flex-col items-center justify-center rounded-[36px] bg-white px-[clamp(14px,3vw,26px)] py-[clamp(6px,1.4vw,12px)] shadow-[0_6px_0_rgba(6,102,124,0.16)]">
                        <span
                          className="text-[clamp(30px,6.4vw,58px)] leading-none"
                          role="img"
                          aria-label={round.target.word}
                        >
                          {round.target.emoji}
                        </span>
                        <span
                          className="mt-1 text-[clamp(14px,2.6vw,24px)] tracking-[0.06em] text-[#26313b]"
                          style={headingFont}
                        >
                          {round.target.word}
                        </span>
                      </div>
                      <span className="absolute -bottom-[9px] left-[26%] h-[12px] w-[12px] rounded-full bg-white" />
                      <span className="absolute -bottom-[20px] left-[18%] h-[8px] w-[8px] rounded-full bg-white" />
                    </div>
                  </div>

                  {/* the shared ending, revealed once the pair is found */}
                  {solved && (
                    <div className="absolute inset-x-0 top-[49%] flex justify-center">
                      <span
                        className="rounded-full bg-[#ff9f1c] px-[clamp(10px,2vw,18px)] py-[clamp(3px,0.8vw,7px)] text-[clamp(12px,2.2vw,20px)] text-white shadow-[0_4px_0_rgba(0,0,0,0.18)]"
                        style={headingFont}
                      >
                        {round.target.word} · {round.match.word} · {round.family}
                      </span>
                    </div>
                  )}

                  {/* the three cards to choose from */}
                  <div className="absolute inset-x-[4%] bottom-[11%] flex items-end justify-center gap-[clamp(6px,2vw,20px)]">
                    {cards.map((card) => {
                      const isAnswer = card.word === round.match.word;
                      return (
                        <button
                          key={card.word}
                          type="button"
                          onClick={() => pick(card)}
                          disabled={solved}
                          aria-label={card.word}
                          className={`flex w-[26%] max-w-[150px] flex-col items-center gap-1 rounded-[14px] border-[3px] px-1 py-[clamp(5px,1.4vw,12px)] shadow-[0_5px_0_rgba(0,0,0,0.2)] transition-transform active:translate-y-[3px] active:shadow-none ${
                            solved && isAnswer
                              ? "scale-110 border-[#c9741a] bg-[#ff9f1c]"
                              : "border-white bg-white/95 hover:scale-105"
                          } ${wrongWord === card.word ? "ecd-shake border-[#b23b37] bg-[#e8534f]" : ""}`}
                        >
                          <span
                            className="text-[clamp(24px,5.2vw,46px)] leading-none"
                            role="img"
                            aria-hidden="true"
                          >
                            {card.emoji}
                          </span>
                          <span
                            className={`text-[clamp(11px,2vw,18px)] tracking-[0.05em] ${
                              solved && isAnswer ? "text-white" : "text-[#26313b]"
                            } ${wrongWord === card.word ? "text-white" : ""}`}
                            style={headingFont}
                          >
                            {card.word}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <p
          className="mt-4 text-center text-[14px] text-white/90 drop-shadow-[0_2px_0_rgba(6,102,124,0.35)]"
          style={headingFont}
        >
          {finished
            ? "Tap play again for another go."
            : mode === "practise"
              ? `Listen: ${round.target.word.toLowerCase()}… which one sounds the same?`
              : `Which word rhymes with “${round.target.word}”?`}
        </p>

        {/* every pair, so any rhyme can be practised on its own */}
        <div className="mt-4 flex w-full max-w-[820px] flex-wrap justify-center gap-1.5 sm:gap-2">
          {RHYME_ROUNDS.map((item, position) => {
            const isCurrent = position === index && !finished;
            const isFound = found.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  ecdSounds.play("buttonClick");
                  goTo(position);
                }}
                aria-label={`Practise the ${item.target.word} rhyme`}
                aria-current={isCurrent ? "true" : undefined}
                className={`relative flex h-10 items-center gap-1 rounded-[12px] px-2.5 text-[13px] transition-transform hover:scale-110 sm:text-[15px] ${
                  isCurrent
                    ? "bg-[#ff9f1c] text-white shadow-[0_4px_0_#c9741a]"
                    : "bg-white/90 text-[#2b7f92] shadow-[0_3px_0_rgba(6,102,124,0.28)]"
                }`}
                style={headingFont}
              >
                <span aria-hidden="true">{item.target.emoji}</span>
                <span>{item.family}</span>
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

export default EcdRhyming;
