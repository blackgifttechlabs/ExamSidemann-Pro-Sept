import React from "react";

/**
 * The toon landscape every reading game sits in front of: sky, water bands,
 * rolling hills, lollipop trees, flowers and a few clouds. Shared so the games
 * feel like one world rather than a set of separate screens.
 */
export const ToonScene: React.FC = () => (
  <svg
    viewBox="0 0 760 560"
    preserveAspectRatio="xMidYMid slice"
    className="h-full w-full"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ecdToonSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3fd0f7" />
        <stop offset="100%" stopColor="#8fe8fb" />
      </linearGradient>
    </defs>

    <rect width="760" height="560" fill="url(#ecdToonSky)" />

    {/* stacked water-like bands, as in a level backdrop */}
    <path d="M-20 250 q 60 -34 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 L800 330 L-20 330 Z" fill="#6ee0fa" />
    <path d="M-20 292 q 60 -34 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 L800 380 L-20 380 Z" fill="#9deefc" />

    {/* hills */}
    <path d="M-20 372 q 70 -46 140 0 t 140 0 t 140 0 t 140 0 t 140 0 L800 560 L-20 560 Z" fill="#2ed06a" />
    <path d="M-20 424 q 62 -42 124 0 t 124 0 t 124 0 t 124 0 t 124 0 L800 560 L-20 560 Z" fill="#14b85a" />

    {/* lollipop trees */}
    <g>
      {[
        [118, 372, 1], [612, 366, 0.86], [318, 420, 0.72], [694, 428, 0.64],
      ].map(([x, y, scale], index) => (
        <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
          <rect x="-4" y="0" width="8" height="46" rx="4" fill="#0d8f45" />
          <ellipse cx="0" cy="-14" rx="17" ry="24" fill="#0d9c4c" />
        </g>
      ))}
    </g>

    {/* flowers and pebbles on the grass */}
    <g>
      {[
        [86, 494], [246, 470], [430, 500], [566, 476], [706, 502],
      ].map(([x, y], index) => (
        <g key={index} transform={`translate(${x} ${y})`}>
          <circle cx="0" cy="0" r="5" fill="#ffffff" />
          <circle cx="-8" cy="0" r="5" fill="#ffffff" />
          <circle cx="8" cy="0" r="5" fill="#ffffff" />
          <circle cx="0" cy="-8" r="5" fill="#ffffff" />
          <circle cx="0" cy="0" r="3.4" fill="#ffd54a" />
        </g>
      ))}
    </g>

    {/* little clouds up in the sky */}
    <g fill="#ffffff" opacity="0.9">
      {[
        [84, 96, 1], [656, 74, 0.8], [520, 150, 0.6],
      ].map(([x, y, scale], index) => (
        <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
          <circle cx="0" cy="0" r="13" />
          <circle cx="18" cy="-6" r="17" />
          <circle cx="38" cy="2" r="12" />
          <rect x="-2" y="2" width="42" height="16" rx="8" />
        </g>
      ))}
    </g>
  </svg>
);

export default ToonScene;
