import React, { useId } from 'react';

/**
 * The furniture every Practical Labs hero is built from: squared paper, a soft
 * light from the top corner, a lit edge along the bottom, and — where there is
 * no subject illustration to carry the corner — a flask in line art.
 *
 * Every fade is an SVG mask rather than a CSS `mask-image`. These heroes are
 * sticky on the landing page, and a CSS-masked layer inside a sticky element
 * composites as a black block.
 */

/** Squared paper, fading out before it reaches the controls. */
export const HeroGridPaper: React.FC<{ className?: string }> = ({ className }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full opacity-[0.28] ${className ?? ''}`}
    >
      <defs>
        <pattern id={`${id}-grid`} width="30" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="rgba(255,255,255,.55)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="0.12" cy="0" r="1.1">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.68" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id}-grid)`}
        mask={`url(#${id}-mask)`}
      />
    </svg>
  );
};

/** Light falling in from the top corner, behind everything else. */
export const HeroGlow: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        'radial-gradient(70% 130% at 88% -20%, rgba(255,255,255,.28), transparent 62%)',
    }}
  />
);

/** The lit edge along the bottom of the hero, brightest under the title. */
export const HeroEdgeLight: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
  />
);

/**
 * A flask with the bubbles still rising off it, and a slow orbit beside it.
 * Drawn rather than photographed so it stays crisp at any size and costs
 * nothing to load, and faded out at the bottom so it never crosses a control.
 */
export const HeroLabMotif: React.FC<{ className?: string }> = ({ className }) => {
  const id = useId().replace(/:/g, '');
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -top-4 right-[-46px] w-[165px] opacity-40 sm:right-[-6px] sm:top-0 sm:w-[250px] sm:opacity-60 lg:w-[300px] ${
        className ?? ''
      }`}
    >
      <style>{`
        @keyframes practicalsBubble {
          0%   { transform: translateY(0);     opacity: 0; }
          18%  { opacity: .9; }
          100% { transform: translateY(-34px); opacity: 0; }
        }
        @keyframes practicalsOrbit { to { transform: rotate(360deg); } }
        .practicals-bubble { animation: practicalsBubble 4.4s ease-in-out infinite; }
        .practicals-orbit {
          transform-origin: 196px 52px;
          animation: practicalsOrbit 26s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .practicals-bubble, .practicals-orbit { animation: none; }
        }
      `}</style>
      <svg viewBox="0 0 260 180" fill="none" className="h-auto w-full">
        <defs>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect x="0" y="0" width="260" height="180" fill={`url(#${id}-fade)`} />
          </mask>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          <g stroke="rgba(255,255,255,.55)" strokeWidth="1.6" strokeLinecap="round">
            {/* Conical flask */}
            <path d="M96 26h30M104 26v26L74 128a12 12 0 0 0 11 17h56a12 12 0 0 0 11-17l-30-76V26" />
            {/* The level it is filled to, and the marks up the neck */}
            <path d="M83 108h55" strokeOpacity=".8" />
            <path d="M104 40h8M104 52h8M104 64h8" strokeOpacity=".55" />
            {/* Test tube alongside */}
            <path d="M178 96h20M182 96v42a8 8 0 0 0 16 0V96" strokeOpacity=".5" />
            <path d="M182 124h16" strokeOpacity=".45" />
          </g>
          <g fill="rgba(255,255,255,.35)">
            <circle className="practicals-bubble" cx="104" cy="118" r="3.4" />
            <circle
              className="practicals-bubble"
              cx="118"
              cy="124"
              r="2.4"
              style={{ animationDelay: '1.5s' }}
            />
            <circle
              className="practicals-bubble"
              cx="128"
              cy="120"
              r="2.8"
              style={{ animationDelay: '2.9s' }}
            />
          </g>
          {/* A slow orbit, so the corner is never quite still */}
          <g
            className="practicals-orbit"
            stroke="rgba(255,255,255,.4)"
            strokeWidth="1.4"
            fill="none"
          >
            <ellipse cx="196" cy="52" rx="42" ry="17" />
            <ellipse cx="196" cy="52" rx="42" ry="17" transform="rotate(60 196 52)" />
            <ellipse cx="196" cy="52" rx="42" ry="17" transform="rotate(120 196 52)" />
          </g>
          <circle cx="196" cy="52" r="4" fill="rgba(255,255,255,.75)" />
        </g>
      </svg>
    </div>
  );
};
