import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, Volume2 } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { RHYME_ROUNDS, rhymeIntroUrl, rhymePromptUrl, type RhymeCard, type RhymeRound } from "./rhymingWords";
import { playCorrectResponse, playFinish, playReadingLine, playWrongResponse, stopReadingVoice } from "./readingVoice";

const headingFont = { fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif', fontWeight: 800 } as const;
const cardsFor = (round: RhymeRound, seed: number): RhymeCard[] => {
  const cards = [round.match, ...round.decoys];
  const offset = seed % cards.length;
  return [...cards.slice(offset), ...cards.slice(0, offset)];
};
type Mode = "practise" | "test";
const MODE_KEY = "yippie_rhyming_mode";
const playIntro = (round: RhymeRound, onEnd?: () => void) => playReadingLine(rhymeIntroUrl(round.id), round.script, onEnd);
const playPrompt = (round: RhymeRound, onEnd?: () => void) => playReadingLine(rhymePromptUrl(round.id), round.prompt, onEnd);
const openRound = (round: RhymeRound, mode: Mode) => mode === "test" ? playPrompt(round) : playIntro(round, () => playPrompt(round));

export const EcdRhyming: React.FC = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongWord, setWrongWord] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [mode, setMode] = useState<Mode>(() => {
    try { return localStorage.getItem(MODE_KEY) === "test" ? "test" : "practise"; } catch { return "practise"; }
  });
  const party = useRef<ReturnType<typeof setTimeout> | null>(null);
  const round = RHYME_ROUNDS[index];
  const cards = useMemo(() => cardsFor(round, index), [round, index]);

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => { ecdSounds.releaseIntro(); if (party.current) clearTimeout(party.current); stopReadingVoice(); };
  }, []);
  useEffect(() => { if (!finished) openRound(round, mode); }, [round, finished, mode]);

  const goTo = (next: number) => {
    if (party.current) clearTimeout(party.current);
    setSolved(false); setWrongWord(null); setFinished(false); setIndex(next);
  };
  const nextRound = () => {
    if (index + 1 >= RHYME_ROUNDS.length) { setFinished(true); playFinish(); }
    else goTo(index + 1);
  };
  const pick = (card: RhymeCard) => {
    if (solved) return;
    ecdSounds.play("buttonClick");
    if (card.word !== round.match.word) {
      setWrongWord(card.word); playWrongResponse();
      window.setTimeout(() => setWrongWord(null), 600);
      return;
    }
    setSolved(true);
    setFound((current) => current.includes(round.id) ? current : [...current, round.id]);
    setCelebrating(true);
    party.current = setTimeout(() => setCelebrating(false), 2600);
    playCorrectResponse(() => { ecdSounds.play("swipe", .8); setSolved(false); nextRound(); });
  };
  const chooseMode = (next: Mode) => {
    if (next === mode) return;
    ecdSounds.play("buttonClick"); setMode(next);
    try { localStorage.setItem(MODE_KEY, next); } catch { /* no persistence in private mode */ }
  };
  const restart = () => { ecdSounds.play("buttonClick"); setFound([]); goTo(0); };

  return <EcdShell musicBed={0.04} showClouds={false} showSound={false}>
    <EcdCelebration show={celebrating}/>
    <EcdReaction show={wrongWord !== null} kind="try-again" label="A monster says try again"/>
    <main className="relative z-10 flex min-h-[100svh] w-full max-w-[620px] flex-col bg-[#f8fbfc] text-[#26313b]" style={headingFont}>
      <header className="sticky top-0 z-20 flex h-[68px] items-center gap-3 border-b border-[#dce8ec] bg-white px-4">
        <button type="button" onClick={() => navigate("/ecd/reading")} aria-label="Back to English path" className="grid h-11 w-11 place-items-center rounded-full text-[#176d7f] active:bg-[#e8f8fb]"><ChevronLeft size={29}/></button>
        <h1 className="flex-1 text-center text-[22px] text-[#185c6c]">Rhyming Words</h1>
        <button type="button" onClick={() => openRound(round, mode)} aria-label="Hear the question again" className="grid h-11 w-11 place-items-center rounded-full text-[#13b8cf] active:bg-[#e8f8fb]"><Volume2 size={24}/></button>
      </header>

      <div className="h-[7px] w-full bg-[#dbe9ec]"><div className="h-full rounded-r-full bg-[#11bfd5] transition-all" style={{ width: `${finished ? 100 : ((index + 1) / RHYME_ROUNDS.length) * 100}%` }}/></div>

      <section className="flex flex-1 flex-col px-5 pb-7 pt-7 sm:px-9">
        {!finished ? <>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-[#e4f8fb] px-3 py-1 text-[12px] font-black tracking-wide text-[#078da4]">QUESTION {index + 1} OF {RHYME_ROUNDS.length}</span>
            <div className="flex rounded-full bg-[#eaf1f3] p-1 text-[12px]">
              {(["practise","test"] as const).map((option) => <button key={option} type="button" onClick={() => chooseMode(option)} className={`rounded-full px-3 py-1.5 capitalize ${mode === option ? "bg-white text-[#078da4] shadow-sm" : "text-[#75858b]"}`}>{option === "test" ? "Test me" : option}</button>)}
            </div>
          </div>

          <h2 className="mt-8 text-center text-[clamp(25px,7vw,34px)] leading-tight text-[#253a42]">Which word rhymes with<br/><span className="text-[#09a9c1]">"{round.target.word.toLowerCase()}"?</span></h2>
          <button type="button" onClick={() => openRound(round, mode)} className="mx-auto mt-3 flex items-center gap-2 rounded-full px-3 py-2 text-[14px] text-[#698087]"><Volume2 size={18} className="text-[#0eb1c8]"/> Tap to listen</button>

          <div className="relative mx-auto mt-5 grid h-[190px] w-[190px] place-items-center rounded-[42%] bg-gradient-to-b from-[#e7fbff] to-[#c9f4fa] shadow-[inset_0_-7px_0_#b5e9f0,0_12px_30px_rgba(10,137,157,.13)]">
            <span className="text-[98px] leading-none drop-shadow-[0_8px_5px_rgba(0,0,0,.12)]" role="img" aria-label={round.target.word}>{round.target.emoji}</span>
            <span className="absolute -bottom-3 rounded-full bg-[#176d7f] px-5 py-2 text-[18px] tracking-[.12em] text-white shadow-[0_4px_0_#0e4f5d]">{round.target.word}</span>
          </div>

          {solved && <div className="mx-auto mt-6 rounded-full bg-[#fff0bd] px-5 py-2 text-[#a86700]">{round.target.word} + {round.match.word} = {round.family}</div>}

          <div className="mt-9 grid grid-cols-3 gap-3 sm:gap-5" aria-label="Choose a rhyming word">
            {cards.map((card) => {
              const correct = card.word === round.match.word;
              return <button key={card.word} type="button" disabled={solved} onClick={() => pick(card)} aria-label={card.word} className={`relative flex min-w-0 flex-col items-center gap-2 rounded-[22px] border-2 px-2 py-4 shadow-[0_5px_0_#cdd9dc] transition active:translate-y-1 active:shadow-none ${solved && correct ? "border-[#18b969] bg-[#ddf9e9]" : "border-[#dbe5e8] bg-white"} ${wrongWord === card.word ? "ecd-shake border-[#e8534f] bg-[#fff0ef]" : ""}`}>
                {solved && correct && <Check size={18} className="absolute right-2 top-2 rounded-full bg-[#18b969] p-[2px] text-white"/>}
                <span className="text-[clamp(40px,12vw,58px)] leading-none" aria-hidden="true">{card.emoji}</span>
                <span className={`text-[13px] tracking-[.08em] sm:text-[15px] ${solved && correct ? "text-[#11884e]" : "text-[#51636a]"}`}>{card.word}</span>
              </button>;
            })}
          </div>

          <button type="button" onClick={() => { ecdSounds.play("buttonClick"); nextRound(); }} className="mx-auto mt-8 rounded-full px-7 py-3 text-[15px] text-[#839197] underline decoration-2 underline-offset-4">Skip</button>
        </> : <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="text-[88px]">í ¼í¾‰</div>
          <h2 className="mt-4 text-[34px] text-[#176d7f]">Well done!</h2>
          <p className="mt-2 text-[#6d7f85]">You matched {found.length} of {RHYME_ROUNDS.length} rhymes.</p>
          <button type="button" onClick={restart} className="mt-8 rounded-full bg-[#10bcd2] px-8 py-4 text-white shadow-[0_6px_0_#078da4]">Play again</button>
          <button type="button" onClick={() => navigate("/ecd/reading")} className="mt-5 text-[#176d7f] underline">Back to learning path</button>
        </div>}
      </section>
    </main>
  </EcdShell>;
};

export default EcdRhyming;
