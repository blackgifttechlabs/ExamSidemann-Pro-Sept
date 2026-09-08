import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { EcdShell } from "../EcdShell";
import { ToonScene } from "./ToonScene";
import { playCorrectResponse, playFinish, playReadingLine, playWrongResponse, stopReadingVoice } from "./readingVoice";
import { SIGHT_WORD_ROUNDS, SIGHT_WORDS_INTRO, sightWordPromptUrl, sightWordsIntroUrl } from "./sightWords";

const font = { fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif', fontWeight: 800 } as const;

export const EcdSightWords: React.FC = () => {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const round = SIGHT_WORD_ROUNDS[index];
  const choices = useMemo(() => {
    const offset = index % round.choices.length;
    return [...round.choices.slice(offset), ...round.choices.slice(0, offset)];
  }, [index, round]);

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => {
      ecdSounds.releaseIntro();
      stopReadingVoice();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const sayPrompt = () => playReadingLine(sightWordPromptUrl(round.id), round.script);
  const begin = () => {
    ecdSounds.play("buttonClick");
    setStarted(true);
    playReadingLine(sightWordsIntroUrl, SIGHT_WORDS_INTRO, sayPrompt);
  };
  const pick = (choice: string) => {
    if (solved) return;
    ecdSounds.play("buttonClick");
    if (choice.toLowerCase() !== round.word.toLowerCase()) {
      setWrong(choice);
      playWrongResponse();
      timer.current = setTimeout(() => setWrong(null), 900);
      return;
    }
    setSolved(true);
    setCelebrating(true);
    timer.current = setTimeout(() => setCelebrating(false), 2600);
    playCorrectResponse(() => {
      setSolved(false);
      if (index + 1 === SIGHT_WORD_ROUNDS.length) {
        setFinished(true);
        playFinish();
      } else setIndex(value => value + 1);
    });
  };
  useEffect(() => {
    if (started && index > 0 && !finished) sayPrompt();
  }, [index]);
  const restart = () => { setIndex(0); setFinished(false); setSolved(false); setStarted(false); };

  return <EcdShell musicBed={0.04}>
    <EcdCelebration show={celebrating} />
    <EcdReaction show={wrong !== null} kind="try-again" label="A monster says try again" />
    <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-12 pt-4">
      <div className="flex w-full items-center gap-3">
        <button type="button" onClick={() => navigate("/ecd/reading")} aria-label="Back to reading topics" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f8fe0] text-white shadow-[0_3px_0_#185f9c]"><ChevronLeft /></button>
        <h1 className="text-[24px] text-white drop-shadow-[0_3px_0_rgba(6,102,124,.45)] sm:text-[30px]" style={font}>Sight Words</h1>
      </div>
      <div className="relative mt-5 w-full max-w-[820px] overflow-hidden rounded-[30px] border-[8px] border-white bg-[#3fd0f7] shadow-[0_14px_35px_rgba(2,74,104,.3)]">
        <div className="relative aspect-[4/3] min-h-[470px] w-full"><ToonScene />
          {!started ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-white/15 px-6 text-center">
            <div className="text-7xl">⚡</div><h2 className="text-4xl text-white drop-shadow-[0_3px_0_#16758a]" style={font}>Ready, word spotter?</h2>
            <button type="button" onClick={begin} className="ecd-pill bg-[#ff9f1c] px-8 py-4 text-2xl shadow-[0_6px_0_#c66b00]" style={font}>Let’s play!</button>
          </div> : finished ? <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-[28px] bg-white/95 px-9 py-7 shadow-[0_8px_0_rgba(6,102,124,.25)]"><div className="text-6xl">🏆</div><h2 className="text-3xl text-[#26313b]" style={font}>Sight word superstar!</h2>
              <div className="mt-5 flex gap-3"><button type="button" onClick={restart} className="ecd-pill bg-[#2f2fbe] px-5 py-3 shadow-[0_5px_0_#21218f]" style={font}>Play again</button><button type="button" onClick={() => navigate("/ecd/reading")} className="ecd-pill bg-[#12b45c] px-5 py-3 shadow-[0_5px_0_#087d40]" style={font}>More topics</button></div>
            </div>
          </div> : <>
            <div className="absolute left-4 top-4 flex items-center gap-2"><span className="rounded-full bg-[#2f8fe0] px-4 py-2 text-white" style={font}>{index + 1}/{SIGHT_WORD_ROUNDS.length}</span><button type="button" onClick={sayPrompt} aria-label="Hear the words again" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2f8fe0]"><Volume2 /></button></div>
            <div className="absolute inset-x-[5%] top-[15%] flex flex-col items-center"><span className="text-7xl" aria-hidden="true">{round.emoji}</span><div className="mt-3 rounded-[24px] bg-white/95 px-7 py-4 text-center text-[clamp(24px,5vw,42px)] text-[#26313b] shadow-[0_6px_0_rgba(6,102,124,.18)]" style={font}>{round.sentence}</div><p className="mt-3 rounded-full bg-[#fff35c] px-5 py-2 text-lg text-[#714800]" style={font}>Tap the missing word</p></div>
            <div className="absolute inset-x-[5%] bottom-[12%] flex justify-center gap-3">{choices.map(choice => {
              const correct = choice.toLowerCase() === round.word.toLowerCase();
              return <button key={choice} type="button" disabled={solved} onClick={() => pick(choice)} className={`min-w-[25%] rounded-[20px] border-4 border-white px-4 py-5 text-[clamp(24px,5vw,42px)] shadow-[0_7px_0_rgba(0,0,0,.2)] transition ${solved && correct ? "scale-110 bg-[#12b45c] text-white" : "bg-[#ff9f1c] text-white hover:scale-105"} ${wrong === choice ? "ecd-shake bg-[#e8534f]" : ""}`} style={font}>{choice}{solved && correct && <Check className="ml-2 inline" />}</button>;
            })}</div>
          </>}
        </div>
      </div>
    </div>
  </EcdShell>;
};

export default EcdSightWords;
