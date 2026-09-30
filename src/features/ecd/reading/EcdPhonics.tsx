import React, { useEffect, useMemo, useRef, useState } from "react";
import { useEcdNavigate as useNavigate } from "../ecdNav";
import { Check } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { PHONICS_ALPHABET, type PhonicsLetter } from "./phonicsAlphabet";
import { playLetterPrompt } from "./phonicsVoice";
import { ReadingFrame, ReadingDone, ReadingControls, Listen, choiceClass } from "./ReadingFrame";
import {
  DEFAULT_READING_DUCK,
  applyReadingMute,
  playCorrectResponse,
  playFinish,
  playWrongResponse,
  setReadingDuckLevel,
  stopReadingVoice,
} from "./readingVoice";

const choicesFor = (entry: PhonicsLetter, seed: number) => {
  const letters = [entry.letter, ...entry.decoys];
  const offset = seed % letters.length;
  return [...letters.slice(offset), ...letters.slice(0, offset)];
};

const MIST = "linear-gradient(to_right,transparent_0,#000_36px,#000_calc(100%_-_36px),transparent_100%)";

export const EcdPhonics: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongLetter, setWrongLetter] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [muted, setMuted] = useState(() => ecdSounds.isMuted());
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const entry = PHONICS_ALPHABET[index];
  const choices = useMemo(() => choicesFor(entry, index), [entry, index]);
  const progress = finished ? 100 : ((index + 1) / PHONICS_ALPHABET.length) * 100;

  useEffect(() => {
    ecdSounds.retainIntro();
    setReadingDuckLevel(0.02);
    return () => {
      setReadingDuckLevel(DEFAULT_READING_DUCK);
      ecdSounds.releaseIntro();
      if (party.current) clearTimeout(party.current);
      stopReadingVoice();
    };
  }, []);

  // Only the question is asked here. "A is for apple" would give the answer away.
  useEffect(() => {
    if (!finished) playLetterPrompt(entry);
  }, [entry, finished]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const goTo = (next: number) => {
    if (party.current) clearTimeout(party.current);
    setSolved(false);
    setWrongLetter(null);
    setFinished(false);
    setIndex(next);
  };
  const nextRound = () => {
    if (index + 1 >= PHONICS_ALPHABET.length) {
      setFinished(true);
      playFinish();
    } else goTo(index + 1);
  };
  const pick = (letter: string) => {
    if (solved) return;
    ecdSounds.play("buttonClick");
    if (letter !== entry.letter) {
      setWrongLetter(letter);
      playWrongResponse();
      window.setTimeout(() => setWrongLetter(null), 600);
      return;
    }
    setSolved(true);
    setFound((c) => (c.includes(letter) ? c : [...c, letter]));
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 3000);
    playCorrectResponse(() => {
      ecdSounds.play("swipe", 0.8);
      setSolved(false);
      nextRound();
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
    applyReadingMute(next);
    if (!next) ecdSounds.play("buttonClick");
  };

  return (
    <EcdShell musicBed={0.04} showClouds={false} showSound={false}>
      <EcdCelebration show={celebrating} />
      <EcdReaction show={wrongLetter !== null} kind="try-again" label="A monster says try again" />
      <ReadingFrame
        title="Phonics & Letter Sounds"
        icon="🔤"
        progress={progress}
        found={found.length}
        total={PHONICS_ALPHABET.length}
        muted={muted}
        onToggleMute={toggleMuted}
        onBack={() => { ecdSounds.play("buttonClick"); navigate("/ecd/reading"); }}
      >
        {!finished ? (
          <>
            <div className={`flex w-full flex-nowrap items-center gap-3 overflow-x-auto scroll-smooth px-10 py-3 [mask-image:${MIST}] [-webkit-mask-image:${MIST}] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
              {PHONICS_ALPHABET.map((item, position) => {
                const isCurrent = position === index;
                return (
                  <button
                    key={item.letter}
                    ref={isCurrent ? activeRef : undefined}
                    type="button"
                    onClick={() => { ecdSounds.play("buttonClick"); goTo(position); }}
                    aria-label={`Practise the letter ${item.letter}`}
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[16px] transition-all duration-200 sm:h-12 sm:w-12 sm:text-[18px] ${
                      isCurrent
                        ? "scale-110 bg-gradient-to-br from-[#ffb648] to-[#ff9f1c] text-white shadow-[0_0_0_4px_rgba(255,159,28,0.28)]"
                        : "bg-[#e8f8fb] text-[#176d7f] hover:scale-110 hover:bg-[#d8f2f6]"
                    }`}
                  >
                    {item.letter}
                    {found.includes(item.letter) && !isCurrent && (
                      <Check size={12} strokeWidth={4} className="absolute -right-1 -top-1 rounded-full bg-[#12b45c] p-[1px] text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <h2 className="mt-6 text-center text-[clamp(29px,8vw,40px)] leading-[1.16] text-[#253a42] lg:text-[clamp(34px,3vw,46px)] lg:leading-[1.08]">
              Which letter says<br />
              <span className="mt-2 inline-block text-[#09a9c1]">“{entry.phoneme}”?</span>
            </h2>
            <Listen onClick={() => { ecdSounds.play("buttonClick"); playLetterPrompt(entry); }} label={`Hear the sound for ${entry.word} again`} />

            <div className="relative mx-auto mt-5 grid h-[220px] w-[220px] place-items-center rounded-[42%] bg-gradient-to-b from-[#e7fbff] to-[#c9f4fa] shadow-[inset_0_-7px_0_#b5e9f0,0_12px_30px_rgba(10,137,157,.13)] lg:mt-3 lg:h-[205px] lg:w-[205px] lg:rounded-full lg:border-2 lg:border-[#66eaf0]">
              <span key={entry.letter} className={`${entry.motion === "fly" ? "ecd-fly" : "ecd-wiggle"} text-[124px] leading-none drop-shadow-[0_8px_5px_rgba(0,0,0,.12)] lg:text-[112px]`} role="img" aria-label={entry.word}>
                {entry.emoji}
              </span>
              <span className="absolute -bottom-3 rounded-full bg-[#176d7f] px-5 py-2 text-[18px] tracking-[.12em] text-white shadow-[0_4px_0_#0e4f5d]">{entry.word}</span>
            </div>

            <div className="mx-auto mt-9 flex max-w-full flex-nowrap items-center justify-center gap-[clamp(4px,1.1vw,10px)]">
              {entry.word.split("").map((letter, position) => {
                const filled = position !== entry.blankIndex || solved;
                return (
                  <span key={`${entry.word}-${position}`} className={`flex h-[clamp(34px,8vw,48px)] w-[clamp(28px,7vw,40px)] items-center justify-center rounded-[10px] text-[clamp(18px,4.5vw,28px)] transition-colors ${filled ? "bg-[#ff9f1c] text-white shadow-[0_4px_0_#c9741a]" : "border-2 border-dashed border-[#66eaf0] bg-[#e7fbff]"}`}>
                    {filled ? letter : ""}
                  </span>
                );
              })}
            </div>

            {solved && <div className="mx-auto mt-5 rounded-full bg-[#fff0bd] px-5 py-2 text-[#a86700]">{entry.letter} is for {entry.word}</div>}

            <div className="mt-8 grid grid-cols-3 place-items-center gap-2 sm:gap-5 lg:mt-9 lg:gap-6" aria-label="Choose a letter">
              {choices.map((letter) => {
                const correct = letter === entry.letter;
                const state = wrongLetter === letter ? "wrong" : solved && correct ? "right" : "idle";
                return (
                  <button key={letter} type="button" disabled={solved} onClick={() => pick(letter)} aria-label={`Letter ${letter}`}
                    className={`${choiceClass(state)} aspect-square w-full max-w-[142px] rounded-full lg:aspect-auto lg:h-[112px] lg:max-w-[190px] lg:rounded-[38px]`}>
                    {solved && correct && <Check size={20} className="absolute right-[10%] top-[10%] rounded-full bg-[#18b969] p-[2px] text-white" />}
                    <span className={`text-[clamp(44px,13vw,64px)] leading-none ${solved && correct ? "text-[#11884e]" : "text-[#176d7f]"}`}>{letter}</span>
                  </button>
                );
              })}
            </div>

            <ReadingControls canPrev={index > 0} onPrev={() => { ecdSounds.play("buttonClick"); goTo(index - 1); }} onSkip={() => { ecdSounds.play("buttonClick"); nextRound(); }} />
          </>
        ) : (
          <ReadingDone emoji={"\u{1F389}"} title="Well done!" text={`You found ${found.length} of ${PHONICS_ALPHABET.length} letter sounds.`} onRestart={restart} onBack={() => navigate("/ecd/reading")} />
        )}
      </ReadingFrame>
    </EcdShell>
  );
};

export default EcdPhonics;
