import React from "react";

/**
 * The reward for getting one right.
 *
 * Confetti falls over the screen, a star pops, and one character, Gerald,
 * rises up in the middle. A soft mist covers the bottom half of the screen
 * while he shows, so he stands out clearly. Nothing here takes pointer
 * events, so the game underneath keeps working.
 */

const CONFETTI_COLOURS = [
  "#ff4d6d",
  "#ffc93c",
  "#43d17c",
  "#3fa9f5",
  "#c77dff",
  "#ff9f1c",
];

/** Fixed so the burst is identical every time rather than jittering per render. */
const CONFETTI = Array.from({ length: 28 }, (_, index) => ({
  left: (index * 37) % 100,
  delay: (index % 7) * 0.09,
  duration: 1.5 + ((index * 13) % 9) / 10,
  drift: ((index * 29) % 60) - 30,
  size: 7 + ((index * 11) % 7),
  round: index % 3 === 0,
  colour: CONFETTI_COLOURS[index % CONFETTI_COLOURS.length],
}));

export const EcdCelebration: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="ecd-party pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes ecdConfettiFall {
          0% { transform: translate3d(0, -12vh, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate3d(var(--drift), 108vh, 0) rotate(720deg); opacity: 0.9; }
        }
        @keyframes ecdStarPop {
          0% { transform: scale(0.2); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes ecdGeraldRise {
          0% { transform: translate(-50%, 100%) rotate(-6deg); }
          22% { transform: translate(-50%, 0) rotate(4deg); }
          34% { transform: translate(-50%, 3%) rotate(-3deg); }
          46% { transform: translate(-50%, 0) rotate(2deg); }
          80% { transform: translate(-50%, 0) rotate(-1deg); }
          100% { transform: translate(-50%, 100%) rotate(-6deg); }
        }
        @keyframes ecdMistFade {
          0% { opacity: 0; }
          18% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        .ecd-confetti { animation: ecdConfettiFall linear forwards; }
        .ecd-star { animation: ecdStarPop 1.1s ease-out forwards; }
        .ecd-gerald { animation: ecdGeraldRise 2.6s cubic-bezier(0.34, 1.3, 0.5, 1) forwards; }
        .ecd-mist { animation: ecdMistFade 2.6s ease-in-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .ecd-confetti, .ecd-star, .ecd-gerald, .ecd-mist { animation: none; }
          .ecd-party { display: none; }
        }
      `}</style>

      {/* mist: from the middle of the screen down, thickest at the bottom */}
      <div
        className="ecd-mist absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 45%, rgba(255,255,255,0) 100%)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          maskImage: "linear-gradient(to top, #000 55%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, #000 55%, transparent 100%)",
        }}
      />

      {CONFETTI.map((piece, index) => (
        <span
          key={index}
          className="ecd-confetti absolute top-0 block"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.round ? piece.size : piece.size * 1.8,
            background: piece.colour,
            borderRadius: piece.round ? "9999px" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            ["--drift" as string]: `${piece.drift}px`,
          }}
        />
      ))}

      {/* a starburst over the middle of the board */}
      <span className="ecd-star absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 text-[clamp(60px,12vw,140px)] leading-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]">
        ⭐
      </span>

      {/* Gerald, the only character, rising up in the middle */}
      <img
        src="/images/ecd/gerald-cheer.png"
        alt=""
        className="ecd-gerald absolute bottom-0 left-1/2 h-[44vh] max-h-[420px] w-auto origin-bottom drop-shadow-[0_10px_16px_rgba(0,40,60,0.35)]"
      />
    </div>
  );
};

export default EcdCelebration;
