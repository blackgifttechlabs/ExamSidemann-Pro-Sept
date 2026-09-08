import React, { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdCelebration } from "../EcdCelebration";
import { EcdReaction } from "../EcdReaction";
import { EcdShell } from "../EcdShell";
import { ToonScene } from "./ToonScene";
import { CVC_INTRO, CVC_ROUNDS, cvcIntroUrl, cvcPromptUrl } from "./cvcWords";
import { playCorrectResponse, playFinish, playReadingLine, playWrongResponse, stopReadingVoice } from "./readingVoice";

const font = { fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif', fontWeight: 800 } as const;
export const EcdCvcWords: React.FC = () => {
  const navigate = useNavigate();
  const [started,setStarted]=useState(false), [index,setIndex]=useState(0), [solved,setSolved]=useState(false), [finished,setFinished]=useState(false), [celebrate,setCelebrate]=useState(false);
  const [wrong,setWrong]=useState<string|null>(null); const timer=useRef<ReturnType<typeof setTimeout>|null>(null); const round=CVC_ROUNDS[index];
  useEffect(()=>{ecdSounds.retainIntro();return()=>{ecdSounds.releaseIntro();stopReadingVoice();if(timer.current)clearTimeout(timer.current);};},[]);
  const speak=()=>playReadingLine(cvcPromptUrl(round.id),round.script);
  useEffect(()=>{if(started&&index>0&&!finished)speak();},[index]);
  const begin=()=>{setStarted(true);ecdSounds.play("buttonClick");playReadingLine(cvcIntroUrl,CVC_INTRO,speak);};
  const pick=(word:string)=>{if(solved)return;ecdSounds.play("buttonClick");if(word!==round.word){setWrong(word);playWrongResponse();timer.current=setTimeout(()=>setWrong(null),900);return;}setSolved(true);setCelebrate(true);timer.current=setTimeout(()=>setCelebrate(false),2600);playCorrectResponse(()=>{setSolved(false);if(index+1===CVC_ROUNDS.length){setFinished(true);playFinish();}else setIndex(v=>v+1);});};
  const restart=()=>{setIndex(0);setFinished(false);setSolved(false);setStarted(false);};
  return <EcdShell musicBed={0.035}><EcdCelebration show={celebrate}/><EcdReaction show={wrong!==null} kind="try-again" label="A monster says try again"/><div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-12 pt-4">
    <div className="flex w-full items-center gap-3"><button type="button" onClick={()=>navigate("/ecd/reading")} aria-label="Back to reading topics" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f8fe0] text-white shadow-[0_3px_0_#185f9c]"><ChevronLeft/></button><h1 className="text-[24px] text-white drop-shadow-[0_3px_0_rgba(6,102,124,.45)] sm:text-[30px]" style={font}>CVC Words</h1></div>
    <div className="relative mt-5 w-full max-w-[820px] overflow-hidden rounded-[30px] border-[8px] border-white bg-[#3fd0f7] shadow-[0_14px_35px_rgba(2,74,104,.3)]"><div className="relative aspect-[4/3] min-h-[470px] w-full"><ToonScene/>
      {!started?<div className="absolute inset-0 flex flex-col items-center justify-center gap-5 text-center"><div className="text-7xl">🧩</div><h2 className="text-4xl text-white drop-shadow-[0_3px_0_#16758a]" style={font}>Ready to blend sounds?</h2><button type="button" onClick={begin} className="ecd-pill bg-[#ff9f1c] px-8 py-4 text-2xl shadow-[0_6px_0_#c66b00]" style={font}>Let’s blend!</button></div>
      :finished?<div className="absolute inset-0 flex items-center justify-center text-center"><div className="rounded-[28px] bg-white/95 px-9 py-7 shadow-[0_8px_0_rgba(6,102,124,.25)]"><div className="text-6xl">🌟</div><h2 className="text-3xl text-[#26313b]" style={font}>Brilliant blending!</h2><div className="mt-5 flex gap-3"><button type="button" onClick={restart} className="ecd-pill bg-[#2f2fbe] px-5 py-3 shadow-[0_5px_0_#21218f]" style={font}>Play again</button><button type="button" onClick={()=>navigate("/ecd/reading")} className="ecd-pill bg-[#12b45c] px-5 py-3 shadow-[0_5px_0_#087d40]" style={font}>More topics</button></div></div></div>
      :<><div className="absolute left-4 top-4 flex gap-2"><span className="rounded-full bg-[#2f8fe0] px-4 py-2 text-white" style={font}>{index+1}/{CVC_ROUNDS.length}</span><button type="button" onClick={speak} aria-label="Hear the sounds again" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2f8fe0]"><Volume2/></button></div>
      <div className="absolute inset-x-0 top-[14%] flex flex-col items-center"><p className="rounded-full bg-[#fff35c] px-6 py-2 text-[clamp(25px,5vw,44px)] tracking-[.18em] text-[#714800]" style={font}>{round.sounds}</p><div className="mt-2 text-5xl">➜</div><p className="rounded-[20px] bg-white/95 px-7 py-2 text-[clamp(24px,5vw,42px)] text-[#26313b]" style={font}>{solved?round.word:"?"}</p></div>
      <div className="absolute inset-x-[4%] bottom-[9%] flex justify-center gap-3">{round.choices.map(choice=><button key={choice.word} type="button" disabled={solved} onClick={()=>pick(choice.word)} className={`flex min-w-[27%] flex-col items-center rounded-[20px] border-4 border-white bg-[#ff9f1c] px-3 py-3 text-white shadow-[0_7px_0_rgba(0,0,0,.2)] transition hover:scale-105 ${solved&&choice.word===round.word?"scale-110 bg-[#12b45c]":""} ${wrong===choice.word?"ecd-shake bg-[#e8534f]":""}`}><span className="text-5xl">{choice.emoji}</span><span className="text-2xl" style={font}>{choice.word}{solved&&choice.word===round.word&&<Check className="ml-1 inline"/>}</span></button>)}</div></>}
    </div></div></div></EcdShell>;
};
export default EcdCvcWords;
