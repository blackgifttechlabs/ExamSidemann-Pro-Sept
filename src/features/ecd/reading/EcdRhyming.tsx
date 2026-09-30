import React, { useEffect, useMemo, useRef, useState } from "react";
import { useEcdNavigate as useNavigate } from "../ecdNav";
import { Check, ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { RHYME_ROUNDS, rhymeIntroUrl, rhymePromptUrl, type RhymeCard, type RhymeRound } from "./rhymingWords";
import { playCorrectResponse, playFinish, playReadingLine, playWrongResponse, stopReadingVoice, applyReadingMute } from "./readingVoice";

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
  const [muted, setMuted] = useState(() => ecdSounds.isMuted());
  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    ecdSounds.setMuted(next);
    applyReadingMute(next);
    if (!next) ecdSounds.play("buttonClick");
  };
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
    <main className="ecd-rhyme-page relative z-10 flex min-h-[100svh] w-full flex-col bg-[#f8fbfc] text-[#26313b]" style={headingFont}>
      <style>{`
        /* -----------------------------------------------------------
           Rhyming Words desktop presentation
           Mobile/tablet keeps the original compact activity.
        ----------------------------------------------------------- */

        .ecd-rhyme-page {
          overflow: hidden;
        }

        .ecd-rhyme-header-inner {
          width: 100%;
        }

        .ecd-rhyme-score {
          display: none;
        }

        .ecd-rhyme-decor {
          display: none;
        }

        @media (min-width: 1024px) {
          .ecd-rhyme-page {
            min-height: 100vh;
            background:
              radial-gradient(circle at 50% 36%, rgba(255,255,255,.98) 0 20%, rgba(255,255,255,.72) 45%, transparent 68%),
              linear-gradient(180deg, #f8fdfe 0%, #f7fcfd 100%);
          }

          /* Full-width top navigation */
          .ecd-rhyme-header {
            height: 68px !important;
            padding: 0 32px !important;
          }

          .ecd-rhyme-header-inner {
            display: grid;
            grid-template-columns: 300px minmax(280px, 1fr) 300px;
            align-items: center;
            gap: 32px;
            max-width: 1440px;
            margin: 0 auto;
          }

          .ecd-rhyme-title-area {
            justify-self: start;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .ecd-rhyme-title-area h1 {
            flex: none !important;
            font-size: 20px !important;
            text-align: left !important;
          }

          .ecd-rhyme-book {
            display: grid !important;
          }

          .ecd-rhyme-desktop-progress {
            display: block !important;
            width: min(420px, 100%);
            justify-self: center;
          }

          .ecd-rhyme-mobile-progress {
            display: none;
          }

          .ecd-rhyme-menu-area {
            justify-self: end;
            display: flex;
            align-items: center;
            gap: 22px;
          }

          .ecd-rhyme-score {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #176d7f;
            font-size: 17px;
            font-weight: 900;
          }

          /* Decorative background */
          .ecd-rhyme-decor {
            display: block;
            position: absolute;
            z-index: 0;
            pointer-events: none;
            user-select: none;
          }

          .ecd-rhyme-blob-tl {
            width: 180px;
            height: 145px;
            left: -55px;
            top: 68px;
            border-radius: 42% 58% 64% 36% / 48% 40% 60% 52%;
            background: linear-gradient(145deg,#baf9fb,#e0fcfd);
            transform: rotate(-13deg);
          }

          .ecd-rhyme-blob-tr {
            width: 180px;
            height: 145px;
            right: -65px;
            top: 55px;
            border-radius: 46% 54% 30% 70% / 60% 35% 65% 40%;
            background: linear-gradient(145deg,#e9d9ff,#d7c4ff);
            transform: rotate(15deg);
          }

          .ecd-rhyme-blob-bl {
            width: 280px;
            height: 190px;
            left: -80px;
            bottom: -80px;
            border-radius: 46% 54% 60% 40% / 40% 60% 40% 60%;
            background: linear-gradient(145deg,#baf9fb,#d9fcfd);
            transform: rotate(15deg);
          }

          .ecd-rhyme-blob-br {
            width: 250px;
            height: 210px;
            right: -80px;
            bottom: -80px;
            border-radius: 50% 50% 40% 60% / 48% 35% 65% 52%;
            background: linear-gradient(145deg,#eadbff,#d8c4ff);
            transform: rotate(-12deg);
          }

          .ecd-rhyme-star {
            font-size: 38px;
            color: #ffc928;
            line-height: 1;
            filter: drop-shadow(0 3px 2px rgba(226,163,0,.18));
          }

          .ecd-rhyme-star-left {
            left: 6.5%;
            top: 64%;
          }

          .ecd-rhyme-star-right {
            right: 5%;
            top: 34%;
          }

          .ecd-rhyme-paw {
            color: #baf5f5;
            font-size: 48px;
            line-height: 1;
            opacity: .9;
          }

          .ecd-rhyme-paw-left {
            left: 8%;
            top: 23%;
            transform: rotate(-18deg);
          }

          .ecd-rhyme-paw-right {
            right: 9%;
            top: 45%;
            transform: rotate(18deg);
          }

          /* Main activity */
          .ecd-rhyme-content {
            position: relative;
            z-index: 2;
            width: min(760px, calc(100% - 48px));
            margin: 0 auto;
            padding: 24px 0 30px !important;
          }

          .ecd-rhyme-question {
            margin-top: 0 !important;
            font-size: clamp(34px, 3vw, 46px) !important;
            line-height: 1.08 !important;
          }

          .ecd-rhyme-listen {
            margin-top: 8px !important;
            font-size: 15px !important;
          }

          .ecd-rhyme-target {
            width: 205px !important;
            height: 205px !important;
            margin-top: 14px !important;
            border-radius: 50% !important;
            border: 2px solid #66eaf0;
            background:
              radial-gradient(circle at 50% 38%, #e2ffff 0%, #c9fbfc 48%, #a8f4f6 100%) !important;
            box-shadow:
              inset 0 -10px 0 rgba(47,214,222,.14),
              0 10px 25px rgba(0,179,193,.12) !important;
          }

          .ecd-rhyme-target-emoji {
            font-size: 112px !important;
          }

          .ecd-rhyme-target-label {
            bottom: -15px !important;
            padding: 8px 25px !important;
            font-size: 18px !important;
          }

          .ecd-rhyme-choices {
            margin-top: 44px !important;
            gap: 24px !important;
          }

          .ecd-rhyme-choice {
            aspect-ratio: auto !important;
            width: 100% !important;
            max-width: 190px !important;
            height: 112px !important;
            border-radius: 38px !important;
            gap: 3px !important;
            border-width: 2px !important;
            box-shadow:
              0 7px 0 #d3e5e8,
              0 13px 20px rgba(33,105,116,.08) !important;
          }

          .ecd-rhyme-choice-emoji {
            font-size: 52px !important;
          }

          .ecd-rhyme-choice-word {
            font-size: 16px !important;
          }

          .ecd-rhyme-controls {
            width: min(620px, 100%);
            margin: 32px auto 0 !important;
            gap: 18px !important;
          }

          .ecd-rhyme-controls button {
            min-height: 58px;
            font-size: 17px !important;
          }
        }

        @media (min-width: 1400px) and (min-height: 800px) {
          .ecd-rhyme-content {
            padding-top: 34px !important;
          }

          .ecd-rhyme-target {
            width: 220px !important;
            height: 220px !important;
          }

          .ecd-rhyme-target-emoji {
            font-size: 122px !important;
          }

          .ecd-rhyme-choice {
            max-width: 200px !important;
            height: 120px !important;
          }
        }
      `}</style>
      <header className="ecd-rhyme-header sticky top-0 z-20 flex h-[68px] items-center border-b border-[#dce8ec] bg-white px-3">
        <div className="ecd-rhyme-header-inner">
          <div className="ecd-rhyme-title-area">
            <button type="button" onClick={() => navigate("/ecd/reading")} aria-label="Back to English path" className="grid h-12 w-12 place-items-center rounded-full text-[#078da4] transition-colors hover:bg-[#e8f8fb] active:bg-[#d8f2f6]"><ChevronLeft size={32}/></button>
            <span className="ecd-rhyme-book hidden text-[27px]" aria-hidden="true">📖</span>
            <h1 className="flex-1 text-center text-[22px] text-[#185c6c]">Rhyming Words</h1>
          </div>

          <div className="ecd-rhyme-desktop-progress hidden">
            <div className="h-[13px] overflow-hidden rounded-full bg-[#dcecee]">
              <div className="h-full rounded-full bg-[#10c9d1] transition-all duration-300" style={{ width: `${finished ? 100 : ((index + 1) / RHYME_ROUNDS.length) * 100}%` }}/>
            </div>
          </div>

          <div className="ecd-rhyme-menu-area">
            <div className="ecd-rhyme-score" aria-label={`${found.length} of ${RHYME_ROUNDS.length} correct`}>
              <span className="text-[26px] text-[#ffc928]" aria-hidden="true">★</span>
              <span>{found.length}/{RHYME_ROUNDS.length}</span>
            </div>

            <button type="button" onClick={toggleMute} aria-pressed={muted} aria-label={muted ? "Turn sound on" : "Turn sound off"} className="grid h-12 w-12 place-items-center rounded-full text-[#176d7f] active:bg-[#e8f8fb]">{muted ? <VolumeX size={24}/> : <Volume2 size={24}/>}</button>
          </div>
        </div>
      </header>

      <div className="ecd-rhyme-mobile-progress h-[7px] w-full bg-[#dbe9ec]"><div className="h-full rounded-r-full bg-[#11bfd5] transition-all" style={{ width: `${finished ? 100 : ((index + 1) / RHYME_ROUNDS.length) * 100}%` }}/></div>

      <div className="ecd-rhyme-decor ecd-rhyme-blob-tl"/>
      <div className="ecd-rhyme-decor ecd-rhyme-blob-tr"/>
      <div className="ecd-rhyme-decor ecd-rhyme-blob-bl"/>
      <div className="ecd-rhyme-decor ecd-rhyme-blob-br"/>

      <div className="ecd-rhyme-decor ecd-rhyme-star ecd-rhyme-star-left">★</div>
      <div className="ecd-rhyme-decor ecd-rhyme-star ecd-rhyme-star-right">★</div>
      <div className="ecd-rhyme-decor ecd-rhyme-paw ecd-rhyme-paw-left">🐾</div>
      <div className="ecd-rhyme-decor ecd-rhyme-paw ecd-rhyme-paw-right">🐾</div>

      <section className="ecd-rhyme-content flex flex-1 flex-col px-5 pb-7 pt-7 sm:px-9">
        {!finished ? <>
          <h2 className="ecd-rhyme-question mt-3 text-center text-[clamp(29px,8vw,40px)] leading-[1.16] text-[#253a42]">Which word rhymes with<br/><span className="mt-2 inline-block text-[#09a9c1]">"{round.target.word.toLowerCase()}"?</span></h2>
          <button type="button" onClick={() => openRound(round, mode)} className="ecd-rhyme-listen mx-auto mt-3 flex items-center gap-2 rounded-full px-3 py-2 text-[14px] text-[#698087]"><Volume2 size={18} className="text-[#0eb1c8]"/> Tap to listen</button>

          <div className="ecd-rhyme-target relative mx-auto mt-5 grid h-[220px] w-[220px] place-items-center rounded-[42%] bg-gradient-to-b from-[#e7fbff] to-[#c9f4fa] shadow-[inset_0_-7px_0_#b5e9f0,0_12px_30px_rgba(10,137,157,.13)]">
            <span className="ecd-rhyme-target-emoji text-[124px] leading-none drop-shadow-[0_8px_5px_rgba(0,0,0,.12)]" role="img" aria-label={round.target.word}>{round.target.emoji}</span>
            <span className="ecd-rhyme-target-label absolute -bottom-3 rounded-full bg-[#176d7f] px-5 py-2 text-[18px] tracking-[.12em] text-white shadow-[0_4px_0_#0e4f5d]">{round.target.word}</span>
          </div>

          {solved && <div className="mx-auto mt-6 rounded-full bg-[#fff0bd] px-5 py-2 text-[#a86700]">{round.target.word} + {round.match.word} = {round.family}</div>}

          <div className="ecd-rhyme-choices mt-10 grid grid-cols-3 place-items-center gap-2 sm:gap-5" aria-label="Choose a rhyming word">
            {cards.map((card) => {
              const correct = card.word === round.match.word;
              return <button key={card.word} type="button" disabled={solved} onClick={() => pick(card)} aria-label={card.word} className={`ecd-rhyme-choice relative flex aspect-square w-full max-w-[142px] min-w-0 flex-col items-center justify-center gap-1 rounded-full border-[3px] shadow-[0_6px_0_#cdd9dc] transition active:translate-y-1 active:shadow-none ${solved && correct ? "border-[#18b969] bg-[#ddf9e9]" : "border-[#dbe5e8] bg-white"} ${wrongWord === card.word ? "ecd-shake border-[#e8534f] bg-[#fff0ef]" : ""}`}>
                {solved && correct && <Check size={20} className="absolute right-[10%] top-[10%] rounded-full bg-[#18b969] p-[2px] text-white"/>}
                <span className="ecd-rhyme-choice-emoji text-[clamp(38px,11vw,58px)] leading-none" aria-hidden="true">{card.emoji}</span>
                <span className={`ecd-rhyme-choice-word text-[12px] tracking-[.08em] sm:text-[15px] ${solved && correct ? "text-[#11884e]" : "text-[#51636a]"}`}>{card.word}</span>
              </button>;
            })}
          </div>

          <div className="ecd-rhyme-controls mt-10 grid grid-cols-2 gap-4">
            <button type="button" disabled={index === 0} onClick={() => { ecdSounds.play("buttonClick"); goTo(index - 1); }} className="rounded-2xl border-2 border-[#b9dfe5] bg-white px-5 py-3.5 text-[16px] text-[#176d7f] shadow-[0_5px_0_#b9dfe5] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
            <button type="button" onClick={() => { ecdSounds.play("buttonClick"); nextRound(); }} className="rounded-2xl bg-[#10bcd2] px-5 py-3.5 text-[16px] text-white shadow-[0_5px_0_#078da4] active:translate-y-1 active:shadow-none">Skip</button>
          </div>
        </> : <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="text-[88px]">{"\u{1F389}"}</div>
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
