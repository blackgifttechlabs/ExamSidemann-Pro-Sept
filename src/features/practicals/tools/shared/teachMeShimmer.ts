/**
 * The shimmering "Teach me" pill, shared by the IT labs and the SQL console so
 * the button reads the same everywhere. Drop `<style>{TEACH_ME_SHIMMER_CSS}</style>`
 * next to the button and give it the `teachme-btn` class.
 */
export const TEACH_ME_SHIMMER_CSS = `
  .teachme-btn {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    color: #fff;
    /* Three loops, all continuous. A single sweep with a pause between passes
       left the button looking flat most of the time — whichever lab you were
       on read as "the one that is not shining". */
    background-image: linear-gradient(110deg, #4338ca, #7c3aed, #a855f7, #7c3aed, #4338ca);
    background-size: 300% 100%;
    animation:
      teachmeFlow 6s linear infinite,
      teachmeGlow 2.6s ease-in-out infinite;
  }
  /* The bright band a skeleton loader uses, run over the button. */
  .teachme-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 30%,
      rgba(255, 255, 255, 0.65) 50%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: translateX(-120%);
    animation: teachmeSweep 2.2s linear infinite;
    pointer-events: none;
  }
  .teachme-btn > * {
    position: relative;
    z-index: 2;
  }
  .teachme-btn:hover { filter: brightness(1.1); }

  @keyframes teachmeFlow {
    0%   { background-position: 0% 50%; }
    100% { background-position: 300% 50%; }
  }
  @keyframes teachmeGlow {
    0%, 100% { box-shadow: 0 0 8px rgba(124, 58, 237, 0.5); }
    50%      { box-shadow: 0 0 20px rgba(168, 85, 247, 0.9); }
  }
  @keyframes teachmeSweep {
    0%   { transform: translateX(-120%); }
    100% { transform: translateX(220%); }
  }
  /* Looping motion is exactly what this setting is for: hold everything still
     and leave the button on its brightest colours. */
  @media (prefers-reduced-motion: reduce) {
    .teachme-btn { animation: none; background-position: 50% 50%; box-shadow: 0 0 12px rgba(124, 58, 237, 0.6); }
    .teachme-btn::after { animation: none; opacity: 0; }
  }
`;
