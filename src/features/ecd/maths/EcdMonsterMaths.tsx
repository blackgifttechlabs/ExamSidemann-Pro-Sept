import joinCues from "../../../data/ecdAdditionJoinCues.json";
import React, { useEffect, useRef, useState } from "react";
import { MathsBoard, FinishCard, headingFont } from "./MathsBoard";
import { playMathsLine, stopMathsVoice } from "./mathsVoice";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { MONSTER_FEEDBACK, MONSTER_INTROS, monsterRounds, type MonsterOperation } from "./monsterMathsData";

/** Original leaf-eared and antenna monsters, drawn locally so no assets are required. */
export const PicnicMonster = ({ variant = 0, hidden = false, walking = false }: { variant?: number; hidden?: boolean; walking?: boolean }) => (
  <svg viewBox="0 0 100 110" className="h-full w-full overflow-visible" aria-hidden="true">
    <g className={hidden ? "monster-hidden" : walking ? "monster-stride" : "monster-bob"} style={{ animationDelay: `${variant * -0.23}s` }}>
      <ellipse cx="50" cy="101" rx="28" ry="5" fill="#24345a" opacity=".15" />
      {variant % 2 ? <path d="M35 30 Q15 0 23 6 Q47 10 45 30 M60 30 Q84 0 82 13 L72 38" fill="#f9b733" /> : <><path d="M50 29V10" stroke="#268779" strokeWidth="5" /><circle cx="50" cy="9" r="7" fill="#ffe27d" /></>}
      <path d="M24 73L12 66M76 73L88 61" stroke={variant % 2 ? "#b05a23" : "#218c7b"} strokeWidth="10" strokeLinecap="round" />
      <path className="monster-foot-left" d="M37 87L31 101" stroke={variant % 2 ? "#b05a23" : "#218c7b"} strokeWidth="10" strokeLinecap="round" />
      <path className="monster-foot-right" d="M64 87L72 100" stroke={variant % 2 ? "#b05a23" : "#218c7b"} strokeWidth="10" strokeLinecap="round" />
      <rect x="20" y="26" width="60" height="66" rx={variant % 2 ? 22 : 30} fill={variant % 2 ? "#ffbf58" : "#55d8bd"} stroke={variant % 2 ? "#db852b" : "#269c91"} strokeWidth="3" />
      <ellipse cx="36" cy="39" rx="10" ry="4" fill="white" opacity=".35" />
      {[37, 63].map(x => <g key={x}><ellipse cx={x} cy="53" rx="11" ry="13" fill="white" /><circle cx={x + 2} cy="55" r="5" fill="#253650" /><circle cx={x + 3} cy="53" r="2" fill="white" /></g>)}
      <path d="M35 73Q50 91 66 72Z" fill="#473451" /><path d="M44 76H53L49 82Z" fill="white" />
      <circle cx="28" cy="69" r="5" fill="#ff879f" /><circle cx="73" cy="69" r="5" fill="#ff879f" />
    </g>
    {hidden && <><path d="M13 96Q3 68 29 75Q37 54 53 73Q79 55 80 80Q100 77 89 100Z" fill="#71996d" /><text x="50" y="93" textAnchor="middle" fill="white" fontSize="17">zzz</text></>}
  </svg>
);

/** The supplied walk cycle is a video so every monster can stop independently. */
const DownloadedMonster = ({ walking, source = "/images/ecd/maths/monsters/headphones-walk.mp4", stillAt = 3.4, flip = true }: { walking: boolean; source?: string; stillAt?: number; flip?: boolean }) => {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const playing = walking && !reducedMotion;
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const player = video.current;
    if (!player || failed) return;
    let active = true;
    const syncPlayback = () => {
      if (!active || player.readyState < 1) return;
      player.muted = true;
      if (playing) {
        player.currentTime = 0;
        void player.play().catch(() => {
          // The user can still count a standing character if video is blocked.
          if (active) { player.pause(); player.currentTime = stillAt; }
        });
      } else {
        player.pause();
        player.currentTime = stillAt;
      }
    };
    player.addEventListener("loadedmetadata", syncPlayback);
    syncPlayback();
    return () => {
      active = false;
      player.removeEventListener("loadedmetadata", syncPlayback);
      player.pause();
    };
  }, [playing, failed, source, stillAt]);
  if (failed) return <PicnicMonster variant={1} walking={playing} />;
  return <video ref={video} src={source}
    data-walk-cycle={playing ? "playing" : "standing"} muted loop playsInline preload="auto"
    disablePictureInPicture aria-hidden="true" tabIndex={-1} onError={() => setFailed(true)}
    className="h-full w-full object-contain"
    style={{ transform: flip ? "scaleX(-1)" : undefined, maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent), linear-gradient(to bottom, transparent, black 4%, black 96%, transparent)", maskComposite: "intersect" }} />;
};

export const EcdMonsterMaths = ({ operation }: { operation: MonsterOperation }) => {
  const rounds = monsterRounds(operation);
  const [index, setIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [joinStage, setJoinStage] = useState<"waiting" | "walking" | "joined">("waiting");
  const [walkVersion, setWalkVersion] = useState(0);
  const [walkingMonsters, setWalkingMonsters] = useState<number[]>([]);
  const [walkMotion, setWalkMotion] = useState({ distance: 280, duration: 6500 });
  const picnicScene = useRef<HTMLDivElement>(null);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);
  const joining = operation === "addition" && joinStage !== "joined";
  const clearWalk = () => {
    if (walkTimer.current) clearTimeout(walkTimer.current);
    walkTimer.current = null;
  };
  const round = rounds[index];
  const say = (id: string, script: string) => playMathsLine(operation, { id, script });
  useEffect(() => {
    ecdSounds.retainIntro();
    return () => { clearWalk(); stopMathsVoice(); ecdSounds.releaseIntro(); };
  }, []);
  const ask = (question: typeof round) => {
    clearWalk();
    setWrong(null);
    setWalkVersion(version => version + 1);
    setWalkingMonsters([]);
    setJoinStage("waiting");
    const beginWalk = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setJoinStage("joined");
        return;
      }
      const scene = picnicScene.current;
      const firstArrival = scene?.querySelector<HTMLElement>('[data-monster="arriving"]');
      const sceneBounds = scene?.getBoundingClientRect();
      const actorBounds = firstArrival?.getBoundingClientRect();
      // The planted foot in the supplied GIF travels backward at about 200
      // source pixels/s, or 160 px/s in our 240px-wide converted video.
      // Move forward at that same rendered speed to keep the foot on the ground.
      const renderedWidth = actorBounds ? Math.min(actorBounds.width, actorBounds.height * 240 / 352) : 58;
      const pixelsPerSecond = 160 * renderedWidth / 240;
      const distance = sceneBounds && actorBounds ? Math.max(actorBounds.width, sceneBounds.right - actorBounds.left + 4) : 280;
      const duration = Math.round(distance / pixelsPerSecond * 1000);
      setWalkMotion({ distance, duration });
      setJoinStage("walking");
      walkTimer.current = setTimeout(() => {
        setJoinStage("joined");
        walkTimer.current = null;
      }, duration + (question.b - 1) * 160);
    };
    playMathsLine(operation, { id: `prompts/${question.id}`, script: question.script }, undefined,
      operation === "addition" ? {
        atSeconds: (joinCues as Record<string, number>)[question.id] ?? 2.3,
        atCharacter: question.script.indexOf(". ") + 2,
        onCue: beginWalk,
      } : undefined);
  };
  const start = () => {
    setStarted(true);
    playMathsLine(operation, { id: "intro", script: MONSTER_INTROS[operation] }, () => ask(round));
  };
  const pick = (value: number) => {
    if (locked.current || joining) return;
    if (value !== round.answer) {
      setWrong(value);
      say("retry", MONSTER_FEEDBACK.retry);
      return;
    }
    locked.current = true;
    setWrong(null);
    setSolved(true);
    ecdSounds.play("sparkle");
    say("correct", MONSTER_FEEDBACK.correct);
  };
  const next = () => {
    if (index === rounds.length - 1) {
      setFinished(true);
      say("finished", MONSTER_FEEDBACK.finished);
    } else {
      const upcoming = rounds[index + 1];
      setIndex(index + 1);
      setSolved(false);
      locked.current = false;
      ask(upcoming);
    }
  };
  return <MathsBoard title={operation === "addition" ? "Addition · Monster Picnic" : "Subtraction · Hide and Seek"}
    badge={`${finished ? rounds.length : index + 1}/${rounds.length}`} celebrating={solved && !finished}
    onReplay={started && !finished ? () => solved ? say("correct", MONSTER_FEEDBACK.correct) : ask(round) : undefined}>
    <style>{`
      @keyframes monsterBob { 0%,100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-5px) rotate(3deg); } }
      .monster-bob { transform-origin: 50% 95%; animation: monsterBob 2s ease-in-out infinite; }
      .monster-hidden { opacity: .2; transform: translateY(12px) scale(.85); transform-origin: center; transition: all .6s; }
      @keyframes monsterWalkIn { from { transform: translateX(var(--walk-distance, 280px)); } to { transform: translateX(0); } }
      @keyframes monsterStride { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
      @keyframes monsterLeftStep { 0%,100% { transform: rotate(-26deg); } 50% { transform: rotate(26deg); } }
      @keyframes monsterRightStep { 0%,100% { transform: rotate(26deg); } 50% { transform: rotate(-26deg); } }
      .monster-arriving { animation: monsterWalkIn var(--walk-duration, 6500ms) linear both; animation-delay: var(--walk-delay, 0ms); }
      .monster-stride { animation: monsterStride .28s linear infinite; transform-origin: 50% 85%; }
      .monster-stride .monster-foot-left { transform-origin: 37px 87px; animation: monsterLeftStep .28s linear infinite; }
      .monster-stride .monster-foot-right { transform-origin: 64px 87px; animation: monsterRightStep .28s linear infinite; }
      .monster-answer:focus-visible { outline: 4px solid #fff; outline-offset: 3px; }
      @media(prefers-reduced-motion:reduce) { .monster-bob, .monster-arriving, .monster-stride, .monster-foot-left, .monster-foot-right { animation:none !important; } .monster-hidden { transition:none; } }
    `}</style>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#7862c9,#303d79_70%)]" />
    <div className="absolute -left-16 bottom-0 h-52 w-72 rounded-full bg-[#50aa96]/30" />
    {finished ? <FinishCard mascot={<div className="h-28 w-40 overflow-hidden rounded-3xl bg-[#e3e3e3]" role="img" aria-label="A happy monster running a victory lap"><DownloadedMonster walking source="/images/ecd/maths/monsters/cap-run.mp4" stillAt={0} flip={false} /></div>} score={rounds.length} total={rounds.length} line="You helped every monster!" onAgain={() => {
      clearWalk(); setWalkingMonsters([]); setJoinStage("waiting"); stopMathsVoice(); setIndex(0); setSolved(false); setWrong(null); setFinished(false); setStarted(false); locked.current = false;
    }} /> : <div className="absolute inset-x-0 bottom-4 top-[128px] overflow-y-auto px-4 pb-8" style={headingFont}>
      <div className="mx-auto flex max-w-[650px] flex-col items-center gap-4">
        {!started ? <><div className="h-40 w-40"><PicnicMonster /></div><p className="text-center text-2xl text-white">{operation === "addition" ? "Join the monster picnic!" : "Who is hiding in the garden?"}</p><button className="ecd-btn rounded-2xl px-8 py-4 text-2xl" onClick={start}>Let’s play!</button></> : <>
          <div className="rounded-full bg-white px-8 py-2 text-[clamp(30px,7vw,52px)] text-[#303d79]" aria-label={`${round.a} ${operation === "addition" ? "plus" : "take away"} ${round.b} equals ${solved ? round.answer : "what"}`}>
            {round.a} {operation === "addition" ? "+" : "−"} {round.b} = <span className="text-[#b44184]">{solved ? round.answer : "?"}</span>
          </div>
          <div key={`${round.id}-${walkVersion}`} data-join-stage={operation === "addition" ? joinStage : undefined} className="w-full overflow-hidden rounded-3xl border-4 border-white/70 bg-[#fff5db] p-3 shadow-[0_7px_0_#bb9ccc]">
            <p className="mb-2 text-center text-sm text-[#47406f]">{operation === "addition" ? `${round.a} ${round.a === 1 ? "friend" : "friends"} + ${round.b} ${round.b === 1 ? "friend joining" : "friends joining"}` : `${round.a} friends − ${round.b} hiding`}</p>
            <div ref={picnicScene} style={{ "--walk-distance": `${walkMotion.distance}px`, "--walk-duration": `${walkMotion.duration}ms` } as React.CSSProperties} className={`relative rounded-2xl px-2 pb-3 pt-2 ${operation === "addition" ? "bg-[#87b3e4]" : "bg-gradient-to-b from-[#e7f5d5] to-[#badfaf]"}`}>
              {operation !== "addition" && <div className="pointer-events-none absolute inset-x-0 bottom-3 h-5 rounded-full bg-[#ebd39b]/70" aria-hidden="true" />}
              <div className="relative grid grid-cols-5 gap-1" role="img" aria-label={operation === "addition" ? `${round.a} monsters; ${round.b} headphone monsters ${joinStage === "joined" ? "have joined them" : "are joining them"}` : `${round.a} monsters, with ${round.b} hidden behind bushes`}>
                {Array.from({ length: operation === "addition" ? round.a + round.b : round.a }, (_, n) => {
                  const incoming = operation === "addition" && n >= round.a;
                  return <div key={n} data-monster={incoming ? "arriving" : "waiting"}
                    onAnimationStart={event => {
                      if (event.animationName === "monsterWalkIn" && event.target === event.currentTarget) setWalkingMonsters(current => [...current.filter(value => value !== n), n]);
                    }}
                    onAnimationEnd={event => {
                      if (event.animationName === "monsterWalkIn" && event.target === event.currentTarget) setWalkingMonsters(current => current.filter(value => value !== n));
                    }}
                    style={{ "--walk-delay": `${Math.max(0, n - round.a) * 160}ms`, visibility: incoming && joinStage === "waiting" ? "hidden" : "visible" } as React.CSSProperties}
                    className={`mx-auto h-[clamp(86px,22vw,140px)] w-full max-w-[94px] ${incoming && joinStage === "walking" ? "monster-arriving" : ""}`}>
                    {operation === "addition" ? <DownloadedMonster walking={incoming && joinStage === "walking" && walkingMonsters.includes(n)} /> : <PicnicMonster hidden={n >= round.answer} />}
                  </div>;
                })}
              </div>
            </div>
          </div>
          <p className="text-center text-lg text-white" role="status" aria-live="polite">{solved ? "You did it! The monsters are cheering!" : wrong !== null ? "Count the visible monsters. Try again!" : joining ? joinStage === "walking" ? "Here come our friends!" : "Watch our friends join the picnic!" : operation === "addition" ? "How many altogether?" : "How many are left?"}</p>
          <div className="grid w-full grid-cols-3 gap-3">
            {round.choices.map(value => <button key={value} disabled={solved || joining} onClick={() => pick(value)} aria-label={`Answer ${value}`}
              className={`monster-answer min-h-[68px] rounded-2xl border-2 border-white/50 py-2 text-[clamp(30px,6vw,46px)] shadow-[0_5px_0_#222c59] transition-transform active:translate-y-1 ${joining ? "opacity-60" : ""} ${solved && value === round.answer ? "bg-[#70e4ae] text-[#174c3b]" : wrong === value ? "bg-[#ffd4df] text-[#833350]" : "bg-[#d8d0ff] text-[#3d356b]"}`}>{value}</button>)}
          </div>
          {solved && <button onClick={next} className="ecd-btn rounded-2xl px-8 py-3 text-xl">{index === rounds.length - 1 ? "Finish ★" : "Next monsters →"}</button>}
        </>}
      </div>
    </div>}
  </MathsBoard>;
};
