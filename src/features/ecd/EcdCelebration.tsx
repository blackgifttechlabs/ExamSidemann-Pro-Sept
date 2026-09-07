import React from "react";

/**
 * The reward for getting one right.
 *
 * Confetti bursts over the whole viewport and two delighted children lean in
 * from the left and right edges — only partly on screen, as though they had
 * run up to watch. It sits above everything and takes no pointer events, so
 * the game underneath keeps working while it plays.
 *
 * The children are the illustrated Gerald artwork rather than shapes drawn in
 * code: a hand-drawn character reads as a character, and a four-year-old can
 * tell the difference instantly.
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
        @keyframes ecdPeekLeft {
          0% { transform: translate3d(-100%, 0, 0) rotate(-8deg); }
          22% { transform: translate3d(-16%, 0, 0) rotate(6deg); }
          32% { transform: translate3d(-22%, 0, 0) rotate(-4deg); }
          44% { transform: translate3d(-16%, 0, 0) rotate(3deg); }
          80% { transform: translate3d(-18%, 0, 0) rotate(-2deg); }
          100% { transform: translate3d(-100%, 0, 0) rotate(-8deg); }
        }
        @keyframes ecdPeekRight {
          0% { transform: translate3d(100%, 0, 0) rotate(8deg); }
          22% { transform: translate3d(16%, 0, 0) rotate(-6deg); }
          32% { transform: translate3d(22%, 0, 0) rotate(4deg); }
          44% { transform: translate3d(16%, 0, 0) rotate(-3deg); }
          80% { transform: translate3d(18%, 0, 0) rotate(2deg); }
          100% { transform: translate3d(100%, 0, 0) rotate(8deg); }
        }
        @keyframes ecdStarPop {
          0% { transform: scale(0.2); opacity: 0; }
          40% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .ecd-confetti { animation: ecdConfettiFall linear forwards; }
        .ecd-peek-left { animation: ecdPeekLeft 2.6s cubic-bezier(0.34, 1.3, 0.5, 1) forwards; }
        .ecd-peek-right { animation: ecdPeekRight 2.6s cubic-bezier(0.34, 1.3, 0.5, 1) forwards; }
        .ecd-star { animation: ecdStarPop 1.1s ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .ecd-confetti, .ecd-peek-left, .ecd-peek-right, .ecd-star { animation: none; }
          .ecd-party { display: none; }
        }
      `}</style>

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
      <span className="ecd-star absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-[clamp(60px,12vw,140px)] leading-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]">
        ⭐
      </span>

      {/* the children leaning in from either edge */}
      <img
        src="/images/ecd/gerald-cheer.png"
        alt=""
        className="ecd-peek-left absolute bottom-0 left-0 h-[38vh] max-h-[420px] w-auto origin-bottom-left drop-shadow-[0_10px_16px_rgba(0,40,60,0.35)] sm:h-[46vh]"
      />
      <img
        src="/images/ecd/gerald1.png"
        alt=""
        style={{ transform: "scaleX(-1)" }}
        className="ecd-peek-right absolute bottom-0 right-0 h-[34vh] max-h-[380px] w-auto origin-bottom-right drop-shadow-[0_10px_16px_rgba(0,40,60,0.35)] sm:h-[42vh]"
      />
    </div>
  );
};

export default EcdCelebration;
