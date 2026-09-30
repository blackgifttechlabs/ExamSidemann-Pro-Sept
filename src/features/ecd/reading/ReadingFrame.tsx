import React from "react";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

export const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

const blob = (style: React.CSSProperties) => (
  <div aria-hidden="true" className="pointer-events-none absolute z-0 hidden lg:block" style={style} />
);

/** The shared page: white top bar, progress bar, soft shapes, centred content. */
export const ReadingFrame: React.FC<{
  title: string;
  icon: string;
  progress: number;
  found: number;
  total: number;
  muted: boolean;
  onToggleMute: () => void;
  onBack: () => void;
  children: React.ReactNode;
}> = ({ title, icon, progress, found, total, muted, onToggleMute, onBack, children }) => (
  <main
    className="relative z-10 flex min-h-[100svh] w-full flex-col overflow-hidden bg-[#f8fbfc] text-[#26313b] lg:bg-[radial-gradient(circle_at_50%_36%,rgba(255,255,255,.98)_0_20%,rgba(255,255,255,.72)_45%,transparent_68%),linear-gradient(180deg,#f8fdfe_0%,#f7fcfd_100%)]"
    style={headingFont}
  >
    <header className="sticky top-0 z-20 flex h-[68px] items-center border-b border-[#dce8ec] bg-white px-3 lg:px-8">
      <div className="flex w-full items-center gap-2 lg:mx-auto lg:grid lg:max-w-[1440px] lg:grid-cols-[300px_minmax(280px,1fr)_300px] lg:gap-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:justify-self-start lg:gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to reading topics"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#078da4] transition-colors hover:bg-[#e8f8fb] active:bg-[#d8f2f6]"
          >
            <ChevronLeft size={32} />
          </button>
          <span className="hidden text-[27px] lg:block" aria-hidden="true">{icon}</span>
          <h1 className="min-w-0 flex-1 truncate text-center text-[20px] text-[#185c6c] sm:text-[22px] lg:flex-none lg:text-left">
            {title}
          </h1>
        </div>
        <div className="hidden w-[min(420px,100%)] justify-self-center lg:block">
          <div className="h-[13px] overflow-hidden rounded-full bg-[#dcecee]">
            <div className="h-full rounded-full bg-[#10c9d1] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-5 lg:justify-self-end">
          <div className="hidden items-center gap-2 text-[17px] text-[#176d7f] lg:flex" aria-label={`${found} of ${total} correct`}>
            <span className="text-[26px] text-[#ffc928]" aria-hidden="true">★</span>
            <span>{found}/{total}</span>
          </div>
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[#176d7f] transition-colors hover:bg-[#e8f8fb] active:bg-[#d8f2f6]"
          >
            {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>
    </header>

    <div className="h-[7px] w-full bg-[#dbe9ec] lg:hidden">
      <div className="h-full rounded-r-full bg-[#11bfd5] transition-all" style={{ width: `${progress}%` }} />
    </div>

    {blob({ width: 180, height: 145, left: -55, top: 68, borderRadius: "42% 58% 64% 36% / 48% 40% 60% 52%", background: "linear-gradient(145deg,#baf9fb,#e0fcfd)", transform: "rotate(-13deg)" })}
    {blob({ width: 180, height: 145, right: -65, top: 55, borderRadius: "46% 54% 30% 70% / 60% 35% 65% 40%", background: "linear-gradient(145deg,#e9d9ff,#d7c4ff)", transform: "rotate(15deg)" })}
    {blob({ width: 280, height: 190, left: -80, bottom: -80, borderRadius: "46% 54% 60% 40% / 40% 60% 40% 60%", background: "linear-gradient(145deg,#baf9fb,#d9fcfd)", transform: "rotate(15deg)" })}
    {blob({ width: 250, height: 210, right: -80, bottom: -80, borderRadius: "50% 50% 40% 60% / 48% 35% 65% 52%", background: "linear-gradient(145deg,#eadbff,#d8c4ff)", transform: "rotate(-12deg)" })}

    <section className="relative z-[2] mx-auto flex w-full max-w-[760px] flex-1 flex-col px-5 pb-8 pt-5 sm:px-9 lg:w-[min(760px,calc(100%-48px))] lg:px-0 lg:pt-6">
      {children}
    </section>
  </main>
);

/** The "Ready?" screen before a game begins. */
export const ReadingStart: React.FC<{ emoji: string; title: string; button: string; onStart: () => void }> = ({ emoji, title, button, onStart }) => (
  <div className="flex flex-1 flex-col items-center justify-center text-center">
    <div className="grid h-[200px] w-[200px] place-items-center rounded-full border-2 border-[#66eaf0] bg-gradient-to-b from-[#e7fbff] to-[#c9f4fa] shadow-[inset_0_-7px_0_#b5e9f0,0_12px_30px_rgba(10,137,157,.13)]">
      <span className="text-[104px] leading-none drop-shadow-[0_8px_5px_rgba(0,0,0,.12)]" aria-hidden="true">{emoji}</span>
    </div>
    <h2 className="mt-8 text-[clamp(29px,8vw,40px)] leading-[1.16] text-[#253a42]">{title}</h2>
    <button
      type="button"
      onClick={onStart}
      className="mt-8 rounded-full bg-[#ff9f1c] px-10 py-4 text-[22px] text-white shadow-[0_6px_0_#c66b00] active:translate-y-1 active:shadow-none"
    >
      {button}
    </button>
  </div>
);

/** The "Well done" screen. */
export const ReadingDone: React.FC<{ emoji: string; title: string; text: string; onRestart: () => void; onBack: () => void }> = ({ emoji, title, text, onRestart, onBack }) => (
  <div className="flex flex-1 flex-col items-center justify-center text-center">
    <div className="text-[88px]">{emoji}</div>
    <h2 className="mt-4 text-[34px] text-[#176d7f]">{title}</h2>
    <p className="mt-2 text-[#6d7f85]">{text}</p>
    <button type="button" onClick={onRestart} className="mt-8 rounded-full bg-[#10bcd2] px-8 py-4 text-white shadow-[0_6px_0_#078da4] active:translate-y-1 active:shadow-none">
      Play again
    </button>
    <button type="button" onClick={onBack} className="mt-5 text-[#176d7f] underline">
      Back to learning path
    </button>
  </div>
);

/** Previous and Skip. */
export const ReadingControls: React.FC<{ canPrev: boolean; onPrev: () => void; onSkip: () => void }> = ({ canPrev, onPrev, onSkip }) => (
  <div className="mt-9 grid grid-cols-2 gap-4 lg:mx-auto lg:mt-8 lg:w-[min(620px,100%)] lg:gap-[18px]">
    <button
      type="button"
      disabled={!canPrev}
      onClick={onPrev}
      className="rounded-2xl border-2 border-[#b9dfe5] bg-white px-5 py-3.5 text-[16px] text-[#176d7f] shadow-[0_5px_0_#b9dfe5] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40 lg:min-h-[58px] lg:text-[17px]"
    >
      Previous
    </button>
    <button
      type="button"
      onClick={onSkip}
      className="rounded-2xl bg-[#10bcd2] px-5 py-3.5 text-[16px] text-white shadow-[0_5px_0_#078da4] active:translate-y-1 active:shadow-none lg:min-h-[58px] lg:text-[17px]"
    >
      Skip
    </button>
  </div>
);

export const Listen: React.FC<{ onClick: () => void; label: string }> = ({ onClick, label }) => (
  <button type="button" onClick={onClick} aria-label={label} className="mx-auto mt-3 flex items-center gap-2 rounded-full px-3 py-2 text-[14px] text-[#698087] lg:mt-2 lg:text-[15px]">
    <Volume2 size={18} className="text-[#0eb1c8]" /> Tap to listen
  </button>
);

export const choiceClass = (state: "idle" | "right" | "wrong") =>
  `relative flex min-w-0 items-center justify-center border-[3px] shadow-[0_6px_0_#cdd9dc] transition active:translate-y-1 active:shadow-none ${
    state === "right" ? "border-[#18b969] bg-[#ddf9e9]" : "border-[#dbe5e8] bg-white"
  } ${state === "wrong" ? "ecd-shake border-[#e8534f] bg-[#fff0ef]" : ""}`;
