import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { useEcdNavigate as useNavigate } from "../ecdNav";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { EcdShell } from "../EcdShell";
import { ReadingFrame, ReadingStart, ReadingDone, ReadingControls, Listen, choiceClass } from "./ReadingFrame";
import { applyReadingMute, playCorrectResponse, playFinish, playReadingLine, playWrongResponse, stopReadingVoice } from "./readingVoice";
import { SIGHT_WORD_ROUNDS, SIGHT_WORDS_INTRO, sightWordPromptUrl, sightWordsIntroUrl } from "./sightWords";

export const EcdSightWords: React.FC = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [muted, setMuted] = useState(() => ecdSounds.isMuted());
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introSaysPrompt = useRef(false);
  const round = SIGHT_WORD_ROUNDS[index];
  const choices = useMemo(() => {
    const offset = index % round.choices.length;
    return [...round.choices.slice(offset), ...round.choices.slice(0, offset)];
  }, [index, round]);
  const progress = finished ? 100 : ((index + 1) / SIGHT_WORD_ROUNDS.length) * 100;

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => {
      ecdSounds.releaseIntro();
      stopReadingVoice();
      if (party.current) clearTimeout(party.current);
      if (wrongTimer.current) clearTimeout(wrongTimer.current);
    };
  }, []);

  const sayPrompt = () => playReadingLine(sightWordPromptUrl(round.id), round.script);
  useEffect(() => {
    if (!started || finished) return;
    if (introSaysPrompt.current) { introSaysPrompt.current = false; return; }
    sayPrompt();
  }, [index, started]);

  const begin = () => {
    ecdSounds.play("buttonClick");
    introSaysPrompt.current = true;
    setStarted(true);
    playReadingLine(sightWordsIntroUrl, SIGHT_WORDS_INTRO, sayPrompt);
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
    if (index + 1 >= SIGHT_WORD_ROUNDS.length) { setFinished(true); playFinish(); }
    else goTo(index + 1);
  };
  const pick = (choice: string) => {
    if (solved) return;
    ecdSounds.play("buttonClick");
    if (choice.toLowerCase() !== round.word.toLowerCase()) {
      setWrong(choice);
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

  const [before, after] = round.sentence.split("___");

  return (
    <EcdShell musicBed={0.04} showClouds={false} showSound={false}>
      <EcdCelebration show={celebrating} />
      <EcdReaction show={wrong !== null} kind="try-again" label="A monster says try again" />
      <ReadingFrame
        title="Sight Words"
        icon="⚡"
        progress={started ? progress : 0}
        found={found.length}
        total={SIGHT_WORD_ROUNDS.length}
        muted={muted}
        onToggleMute={toggleMuted}
        onBack={() => navigate("/ecd/reading")}
      >
        {!started ? (
          <ReadingStart emoji="⚡" title="Ready, word spotter?" button="Let’s play!" onStart={begin} />
        ) : finished ? (
          <ReadingDone emoji="🏆" title="Sight word superstar!" text={`You found ${found.length} of ${SIGHT_WORD_ROUNDS.length} words.`} onRestart={restart} onBack={() => navigate("/ecd/reading")} />
        ) : (
          <>
            <h2 className="mt-2 text-center text-[clamp(29px,8vw,40px)] leading-[1.16] text-[#253a42] lg:text-[clamp(34px,3vw,46px)]">
              Which word is <span className="text-[#09a9c1]">missing?</span>
            </h2>
            <Listen onClick={() => { ecdSounds.play("buttonClick"); sayPrompt(); }} label="Hear the words again" />

            <div className="mx-auto mt-4 grid h-[180px] w-[180px] place-items-center rounded-full border-2 border-[#66eaf0] bg-gradient-to-b from-[#e7fbff] to-[#c9f4fa] shadow-[inset_0_-7px_0_#b5e9f0,0_12px_30px_rgba(10,137,157,.13)]">
              <span key={round.id} className="ecd-wiggle text-[96px] leading-none drop-shadow-[0_8px_5px_rgba(0,0,0,.12)]" role="img" aria-label={round.word}>{round.emoji}</span>
            </div>

            <div className="mx-auto mt-8 flex max-w-full flex-wrap items-center justify-center gap-x-3 rounded-[28px] border-2 border-[#dbe5e8] bg-white px-7 py-5 text-[clamp(26px,6vw,40px)] text-[#26313b] shadow-[0_6px_0_#cdd9dc]">
              <span>{before}</span>
              <span className={`inline-block min-w-[80px] border-b-4 px-2 text-center ${solved ? "border-[#18b969] text-[#11884e]" : "border-dashed border-[#66eaf0] text-transparent"}`}>{solved ? round.word : "…"}</span>
              <span>{after}</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-5" aria-label="Choose a word">
              {choices.map((choice) => {
                const correct = choice.toLowerCase() === round.word.toLowerCase();
                const state = wrong === choice ? "wrong" : solved && correct ? "right" : "idle";
                return (
                  <button key={choice} type="button" disabled={solved} onClick={() => pick(choice)} className={`${choiceClass(state)} h-[96px] rounded-[30px] text-[clamp(26px,7vw,40px)] text-[#176d7f] lg:h-[112px]`}>
                    {solved && correct && <Check size={20} className="absolute right-[10%] top-[10%] rounded-full bg-[#18b969] p-[2px] text-white" />}
                    {choice}
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

export default EcdSightWords;
