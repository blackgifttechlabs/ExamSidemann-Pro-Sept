import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2 } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdCelebration } from "../EcdCelebration";

/**
 * The shared board every maths game is played on.
 *
 * One frame, one level bar, one finish card — so the ten games read as one
 * world rather than ten separate apps, and a game file only has to describe
 * the thing that makes it different: what is on the grass and what a tap does.
 */

export const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

/**
 * A picture that removes itself if it has not been drawn yet.
 *
 * Every game is built to be fully playable before a single PNG exists: the art
 * layers *over* a drawn-in-code fallback, so a missing file leaves the shapes
 * showing rather than a broken-image icon.
 */
export const EcdArt: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}> = ({ src, alt = "", className, style, fallback }) => {
  const [missing, setMissing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (missing) return <>{fallback ?? null}</>;
  return (
    <>
      {!loaded && fallback}
      <img
        src={src}
        alt={alt}
        aria-hidden={alt ? undefined : "true"}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setMissing(true)}
        className={className}
        style={style}
      />
    </>
  );
};

/**
 * The scene behind a game: the painted background if it exists, the game's own
 * drawn-in-code backdrop underneath it either way.
 */
export const MathsScene: React.FC<{ art: string; children: React.ReactNode }> = ({
  art,
  children,
}) => (
  <div className="absolute inset-0 overflow-hidden">
    {children}
    <EcdArt src={art} className="absolute inset-0 h-full w-full object-cover" />
  </div>
);

/**
 * One thing on the board — a teddy, a star, an orb — drawn with its supplied
 * artwork. The parent carries the accessible label without placing an emoji
 * underneath transparent parts of the image.
 */
export const ArtGlyph: React.FC<{
  art: string;
  emoji: string;
  /** Sizes the glyph; pass a font size, the art fills the box. */
  className?: string;
  label?: string;
}> = ({ art, className, label }) => (
  <span
    className={`relative inline-flex items-center justify-center leading-none ${className ?? ""}`}
    role="img"
    aria-label={label}
    aria-hidden={label ? undefined : "true"}
  >
    <EcdArt src={art} className="absolute inset-0 h-full w-full object-contain" />
  </span>
);

/** Code-drawn game pieces used where no bitmap exists. They deliberately use
 * gradients, highlights and a deep base shadow so they read as chunky toys. */
export const CssPresent: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`relative inline-block aspect-square rounded-[18%] bg-gradient-to-br from-[#ff718d] via-[#f23861] to-[#b9143d] shadow-[inset_8px_9px_12px_rgba(255,255,255,.42),inset_-8px_-10px_12px_rgba(91,5,36,.28),0_12px_0_#951437,0_18px_22px_rgba(43,11,31,.32)] ${className}`}
  >
    <span className="absolute inset-y-0 left-[39%] w-[22%] bg-gradient-to-r from-[#ffc92f] via-[#fff080] to-[#e99c08] shadow-[inset_2px_0_2px_rgba(255,255,255,.55)]" />
    <span className="absolute inset-x-0 top-[39%] h-[22%] bg-gradient-to-b from-[#fff080] via-[#ffc92f] to-[#e99c08]" />
    <span className="absolute left-1/2 top-0 h-[34%] w-[34%] -translate-x-[82%] -translate-y-[48%] rotate-[-24deg] rounded-[60%_15%_60%_20%] bg-gradient-to-br from-[#fff080] to-[#eea309] shadow-[0_5px_0_#c77b05]" />
    <span className="absolute left-1/2 top-0 h-[34%] w-[34%] -translate-x-[18%] -translate-y-[48%] rotate-[24deg] rounded-[15%_60%_20%_60%] bg-gradient-to-bl from-[#fff080] to-[#eea309] shadow-[0_5px_0_#c77b05]" />
    <span className="absolute left-[8%] top-[7%] h-[12%] w-[48%] rotate-[-7deg] rounded-full bg-white/35" />
  </span>
);

export const CssLilyPad: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`relative inline-block aspect-[1.18/1] rounded-[50%] bg-[radial-gradient(circle_at_34%_25%,#a6f56a_0%,#42c53c_42%,#11812c_78%,#07551e_100%)] shadow-[inset_7px_7px_8px_rgba(255,255,255,.38),inset_-8px_-10px_10px_rgba(0,63,22,.35),0_9px_0_#07551e,0_15px_18px_rgba(0,30,50,.45)] ${className}`}
  >
    <span className="absolute bottom-[-2%] left-[44%] h-[50%] w-[22%] origin-bottom -rotate-[5deg] bg-[#0b6b25] [clip-path:polygon(48%_100%,0_0,100%_0)]" />
    <span className="absolute left-[10%] top-[9%] h-[17%] w-[48%] -rotate-[10deg] rounded-full bg-white/25 blur-[1px]" />
  </span>
);

export const CssRocket: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span aria-hidden="true" className={`relative inline-block ${className}`}>
    <span className="absolute inset-x-[22%] inset-y-[4%] rounded-[52%_52%_34%_34%] bg-gradient-to-r from-[#cbd5e1] via-white to-[#aab6c5] shadow-[inset_5px_2px_7px_white,inset_-7px_-3px_8px_rgba(40,55,75,.28),0_9px_12px_rgba(0,0,0,.28)]" />
    <span className="absolute left-[28%] right-[28%] top-0 h-[32%] rounded-[70%_70%_30%_30%] bg-gradient-to-r from-[#d21e3f] via-[#ff5f71] to-[#a70f2b]" />
    <span className="absolute left-1/2 top-[34%] h-[22%] w-[28%] -translate-x-1/2 rounded-full border-[3px] border-[#1c5d91] bg-gradient-to-br from-[#a9ecff] to-[#2375b5] shadow-[inset_3px_3px_4px_white]" />
    <span className="absolute bottom-[10%] left-[3%] h-[38%] w-[30%] -skew-y-[18deg] rounded-l-full bg-gradient-to-b from-[#ff6678] to-[#b50f31]" />
    <span className="absolute bottom-[10%] right-[3%] h-[38%] w-[30%] skew-y-[18deg] rounded-r-full bg-gradient-to-b from-[#ff6678] to-[#b50f31]" />
    <span className="absolute bottom-[-22%] left-1/2 h-[35%] w-[30%] -translate-x-1/2 rounded-[45%_45%_70%_70%] bg-gradient-to-b from-[#fff36a] via-[#ff9d19] to-[#ed3b1c] shadow-[0_0_18px_#ffb01f]" />
  </span>
);

/** The row of numerals a child picks their answer from. */
export const NumberChoices: React.FC<{
  choices: number[];
  onPick: (value: number) => void;
  /** The one that was just picked and was wrong, so it can shake. */
  wrong?: number | null;
  /** Set once the round is solved, so the right one can glow. */
  solved?: number | null;
  disabled?: boolean;
}> = ({ choices, onPick, wrong = null, solved = null, disabled = false }) => (
  <div className="flex items-end justify-center gap-[clamp(10px,2.8vw,28px)]">
    {choices.map((value) => (
      <button
        key={value}
        type="button"
        disabled={disabled}
        onClick={() => onPick(value)}
        aria-label={`Choose ${value}`}
        className={`flex h-[clamp(60px,13vw,104px)] w-[clamp(60px,13vw,104px)] items-center justify-center rounded-[22px] border-[4px] text-[clamp(30px,7vw,54px)] shadow-[0_8px_0_rgba(0,0,0,0.22)] transition-transform active:translate-y-[4px] active:shadow-none ${
          solved === value
            ? "scale-110 border-[#0a8442] bg-[#12b45c] text-white"
            : "border-white bg-white/95 text-[#26313b] hover:scale-105"
        } ${wrong === value ? "ecd-shake border-[#b23b37] bg-[#e8534f] text-white" : ""}`}
        style={headingFont}
      >
        {value}
      </button>
    ))}
  </div>
);

/** Shown over the board once every round has been played. */
export const FinishCard: React.FC<{
  score: number;
  total: number;
  onAgain: () => void;
  /** What the child actually did, in their own terms. */
  line?: string;
}> = ({ score, total, onAgain, line }) => {
  const navigate = useNavigate();
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="rounded-[26px] bg-white/95 px-8 py-6 shadow-[0_8px_0_rgba(6,102,124,0.25)]">
        <p className="text-[clamp(22px,4vw,34px)] text-[#26313b]" style={headingFont}>
          Well done!
        </p>
        <p className="mt-1 text-[clamp(14px,2.2vw,20px)] text-[#66727e]" style={headingFont}>
          {line ?? `You got ${score} of ${total}.`}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAgain}
            className="ecd-pill bg-[#2f2fbe] px-5 py-2.5 text-[clamp(13px,2vw,18px)] shadow-[0_5px_0_#21218f]"
            style={headingFont}
          >
            Play again
          </button>
          <button
            type="button"
            onClick={() => {
              ecdSounds.play("buttonClick");
              navigate("/ecd/maths");
            }}
            className="ecd-pill bg-[#12b45c] px-5 py-2.5 text-[clamp(13px,2vw,18px)] shadow-[0_5px_0_#0a8442]"
            style={headingFont}
          >
            More games
          </button>
        </div>
      </div>
    </div>
  );
};

export const MathsBoard: React.FC<{
  title: string;
  /** What sits in the level bar — usually "3/8" or the level number. */
  badge: React.ReactNode;
  /** Repeats the current question. Omit it and no speaker button is drawn. */
  onReplay?: () => void;
  replayLabel?: string;
  celebrating?: boolean;
  /** The line under the frame, for the grown-up reading over the shoulder. */
  hint?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  title,
  badge,
  onReplay,
  replayLabel = "Hear the question again",
  celebrating = false,
  hint,
  children,
}) => {
  // Inside a game the tune sits right back out of the way of the voice.
  return (
    <EcdShell
      musicBed={0.04}
      backTo="/ecd/maths"
      showClouds={false}
      topRow={(
        <h1
          className="truncate px-2 text-center text-[clamp(18px,4vw,30px)] leading-none text-white drop-shadow-[0_3px_0_rgba(6,102,124,0.45)]"
          style={headingFont}
        >
          {title}
        </h1>
      )}
    >
      <EcdCelebration show={celebrating} />

      <style>{`
        @keyframes ecdObjectFloat { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-7px) rotate(1deg); } }
        @keyframes ecdObjectPop { 0% { transform: scale(.72); opacity: 0; } 70% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .ecd-game-float { animation: ecdObjectFloat 2.5s ease-in-out infinite; }
        .ecd-game-pop { animation: ecdObjectPop .42s cubic-bezier(.2,.9,.3,1.25) both; }
        @media (prefers-reduced-motion: reduce) { .ecd-game-float, .ecd-game-pop { animation: none !important; } }
      `}</style>

      {/* The game artwork is the page: no card, outer frame, or cloud bank. */}
      <div className="absolute inset-0 z-10 overflow-hidden bg-[#3fd0f7]">
        {children}

        <div className="absolute left-4 top-[72px] z-20 flex items-center gap-2 sm:left-6 sm:top-[84px]">
          <span
            className="rounded-full bg-[#2f8fe0] px-[clamp(13px,2vw,20px)] py-[clamp(7px,1vw,10px)] text-[clamp(15px,2.2vw,20px)] text-white shadow-[0_4px_0_rgba(6,60,104,0.4)]"
            style={headingFont}
          >
            {badge}
          </span>
          {onReplay && (
            <button
              type="button"
              onClick={() => {
                ecdSounds.play("buttonClick");
                onReplay();
              }}
              aria-label={replayLabel}
              className="flex h-[clamp(42px,6vw,54px)] w-[clamp(42px,6vw,54px)] items-center justify-center rounded-full bg-white/95 text-[#2f8fe0] shadow-[0_4px_0_rgba(6,60,104,0.3)] active:translate-y-[2px] active:shadow-none"
            >
              <Volume2 size={20} />
            </button>
          )}
        </div>

        {hint && (
          <p
            className="pointer-events-none absolute bottom-4 left-1/2 z-20 max-w-[calc(100%_-_1.5rem)] -translate-x-1/2 rounded-full bg-slate-950/60 px-[clamp(16px,3vw,28px)] py-[clamp(8px,1.4vw,12px)] text-center text-[clamp(15px,2.2vw,20px)] leading-tight text-white shadow-lg backdrop-blur-sm sm:bottom-6"
            style={headingFont}
          >
            {hint}
          </p>
        )}
      </div>
    </EcdShell>
  );
};

export default MathsBoard;
