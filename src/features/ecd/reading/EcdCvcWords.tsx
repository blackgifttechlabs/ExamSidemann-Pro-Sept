import React, { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useEcdNavigate as useNavigate } from "../ecdNav";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { EcdShell } from "../EcdShell";
import { ReadingFrame, ReadingStart, ReadingDone, ReadingControls, Listen, choiceClass } from "./ReadingFrame";
import { CVC_INTRO, CVC_ROUNDS, cvcIntroUrl, cvcPromptUrl } from "./cvcWords";
import { applyReadingMute, playCorrectResponse, playFinish, playReadingLine, playWrongResponse, stopReadingVoice } from "./readingVoice";

export const EcdCvcWords: React.FC = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [muted, setMuted] = useState(() => ecdSounds.isMuted());
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introSaysPrompt = useRef(false);
  const round = CVC_ROUNDS[index];
  const progress = finished ? 100 : ((index + 1) / CVC_ROUNDS.length) * 100;

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => {
      ecdSounds.releaseIntro();
      stopReadingVoice();
      if (party.current) clearTimeout(party.current);
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
    };
  }, []);

  const speak = () => playReadingLine(cvcPromptUrl(round.id), round.script);
  useEffect(() => {
    if (!started || finished) return;
    if (introSaysPrompt.current) { introSaysPrompt.current = false; return; }
    speak();
  }, [index, started]);

  const begin = () => {
    ecdSounds.play("buttonClick");
    introSaysPrompt.current = true;
    setStarted(true);
    playReadingLine(cvcIntroUrl, CVC_INTRO, speak);
  };
  const goTo = (next: number) => {
    if (party.current) clearTimeout(party.current);
    setCelebrating(false);
    setSolved(false);
    setWrong(null);
    setFinished(false);
    setIndex(next);
  };
  const nextRound = () => {
    if (index + 1 >= CVC_ROUNDS.length) { setFinished(true); playFinish(); }
    else goTo(index + 1);
  };
  const pick = (word: string) => {
    if (solved) return;
    ecdSounds.play("buttonClick");
    if (word !== round.word) {
      setWrong(word);
      playWrongResponse();
      wrongTimer.current = setTimeout(() => setWrong(null), 900);
      return;
    }
    setSolved(true);
    setFound((c) => (c.includes(round.id) ? c : [...c, round.id]));
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 2600);
    playCorrectResponse(() => { setSolved(false); nextRound(); });
  };
  const restart = () => { ecdSounds.play("buttonClick"); setFound([]); goTo(0); };
  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    ecdSounds.setMuted(next);
    applyReadingMute(next);
    if (!next) ecdSounds.play("buttonClick");
  };

  return (
    <EcdShell musicBed={0.035} showClouds={false} showSound={false}>
      <EcdCelebration show={celebrating} />
      <EcdReaction show={wrong !== null} kind="try-again" label="A monster says try again" />
      <ReadingFrame
        title="CVC Words"
        icon="🧩"
        progress={started ? progress : 0}
        found={found.length}
        total={CVC_ROUNDS.length}
        muted={muted}
        onToggleMute={toggleMuted}
        onBack={() => navigate("/ecd/reading")}
      >
        {!started ? (
          <ReadingStart emoji="🧩" title="Ready to blend sounds?" button="Let’s blend!" onStart={begin} />
        ) : finished ? (
          <ReadingDone emoji="🌟" title="Brilliant blending!" text={`You blended ${found.length} of ${CVC_ROUNDS.length} words.`} onRestart={restart} onBack={() => navigate("/ecd/reading")} />
        ) : (
          <>
            <h2 className="mt-2 text-center text-[clamp(29px,8vw,40px)] leading-[1.16] text-[#253a42] lg:text-[clamp(34px,3vw,46px)]">
              Which word do these <span className="text-[#09a9c1]">sounds make?</span>
            </h2>
            <Listen onClick={() => { ecdSounds.play("buttonClick"); speak(); }} label="Hear the sounds again" />

            <div className="relative mx-auto mt-5 grid h-[200px] w-[200px] place-items-center rounded-full border-2 border-[#66eaf0] bg-gradient-to-b from-[#e7fbff] to-[#c9f4fa] shadow-[inset_0_-7px_0_#b5e9f0,0_12px_30px_rgba(10,137,157,.13)]">
              <span key={round.id} className="ecd-wiggle text-[42px] tracking-[.14em] text-[#176d7f]">{round.sounds}</span>
              <span className="absolute -bottom-3 min-w-[80px] rounded-full bg-[#176d7f] px-6 py-2 text-center text-[20px] tracking-[.12em] text-white shadow-[0_4px_0_#0e4f5d]">
                {solved ? round.word : "?"}
              </span>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-5" aria-label="Choose a word">
              {round.choices.map((choice) => {
                const correct = choice.word === round.word;
                const state = wrong === choice.word ? "wrong" : solved && correct ? "right" : "idle";
                return (
                  <button key={choice.word} type="button" disabled={solved} onClick={() => pick(choice.word)} aria-label={choice.word} className={`${choiceClass(state)} flex-col gap-1 rounded-[34px] py-4 lg:h-[132px]`}>
                    {solved && correct && <Check size={20} className="absolute right-[10%] top-[10%] rounded-full bg-[#18b969] p-[2px] text-white" />}
                    <span className="text-[clamp(40px,11vw,58px)] leading-none" aria-hidden="true">{choice.emoji}</span>
                    <span className={`text-[clamp(14px,4vw,18px)] tracking-[.08em] ${solved && correct ? "text-[#11884e]" : "text-[#51636a]"}`}>{choice.word}</span>
                  </button>
                );
              })}
            </div>

            <ReadingControls canPrev={index > 0} onPrev={() => { ecdSounds.play("buttonClick"); goTo(index - 1); }} onSkip={() => { ecdSounds.play("buttonClick"); nextRound(); }} />
          </>
        )}
      </ReadingFrame>
    </EcdShell>
  );
};

export default EcdCvcWords;
