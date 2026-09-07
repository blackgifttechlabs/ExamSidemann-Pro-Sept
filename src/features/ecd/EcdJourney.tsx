import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ecdSounds } from "../../lib/audio/ecdSounds";
import { EcdShell } from "./EcdShell";

/**
 * "Choose your journey" — the second Yippie screen.
 *
 * One framed scene: hills and pine trees behind, a grass field holding the two
 * subject panels, and a road along the bottom that Gerald idles on in his car.
 * Everything inside the frame is positioned in percentages over an SVG
 * landscape, so the whole picture scales from a phone to a desktop without the
 * panels drifting off the grass.
 */

const JOURNEY_KEY = "yippie_journey";

const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

/** One pine tree; the scene plants a row of these at varying sizes. */
const Pine: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <rect x="-7" y="60" width="14" height="34" rx="5" fill="#8a5a33" />
    <path d="M0 -46 L34 26 L-34 26 Z" fill="#2f8f52" />
    <path d="M0 -18 L40 62 L-40 62 Z" fill="#37a35d" />
    <path d="M0 -46 L34 26 L0 26 Z" fill="#2a8049" />
    <path d="M0 -18 L40 62 L0 62 Z" fill="#319554" />
  </g>
);

/** The landscape behind the panels: sky, ranges, trees, field and road. */
const JourneyScene: React.FC = () => (
  <svg
    viewBox="0 0 1200 628"
    preserveAspectRatio="xMidYMid slice"
    className="h-full w-full"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ecdJourneySky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7fd8f5" />
        <stop offset="100%" stopColor="#d8f4fb" />
      </linearGradient>
      <linearGradient id="ecdJourneyField" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7ed957" />
        <stop offset="100%" stopColor="#4fb63a" />
      </linearGradient>
    </defs>

    <rect width="1200" height="628" fill="url(#ecdJourneySky)" />

    {/* far range */}
    <path d="M-40 250 L150 96 L300 214 L430 118 L610 250 Z" fill="#4e9e6b" />
    <path d="M560 250 L720 110 L860 210 L1010 108 L1240 250 L1240 260 L560 260 Z" fill="#4e9e6b" />
    <path d="M150 96 L228 160 L150 210 Z" fill="#8fd3a4" opacity="0.55" />
    <path d="M720 110 L790 170 L720 216 Z" fill="#8fd3a4" opacity="0.55" />
    <path d="M1010 108 L1078 168 L1010 214 Z" fill="#8fd3a4" opacity="0.55" />

    {/* near hills */}
    <path d="M-40 268 Q 180 176 420 262 T 900 250 T 1240 274 L1240 340 L-40 340 Z" fill="#3f9e55" />

    {/* field */}
    <path d="M-40 300 Q 300 262 600 296 T 1240 288 L1240 628 L-40 628 Z" fill="url(#ecdJourneyField)" />

    {/* tree line */}
    <g>
      <Pine x={70} y={236} scale={0.92} />
      <Pine x={168} y={252} scale={0.72} />
      <Pine x={250} y={230} scale={0.56} />
      <Pine x={962} y={230} scale={0.6} />
      <Pine x={1046} y={250} scale={0.8} />
      <Pine x={1140} y={238} scale={0.95} />
    </g>

    {/* grass tufts */}
    <g fill="#3fa63c" opacity="0.75">
      {[
        [120, 372], [318, 400], [520, 368], [742, 404], [934, 372], [1104, 396],
      ].map(([x, y], index) => (
        <path
          key={index}
          d={`M${x} ${y} q 6 -18 12 0 q 8 -22 14 0 q 7 -16 12 0 z`}
        />
      ))}
    </g>

    {/* road */}
    <rect x="-40" y="500" width="1280" height="14" fill="#9fe08a" />
    <rect x="-40" y="512" width="1280" height="130" fill="#4a545c" />
    <rect x="-40" y="512" width="1280" height="7" fill="#5d6a73" />
    <g fill="#ffffff">
      {Array.from({ length: 13 }).map((_, index) => (
        <rect key={index} x={-20 + index * 100} width="56" y="572" height="9" rx="4" />
      ))}
    </g>
  </svg>
);

type Journey = {
  id: "reading" | "math";
  label: string;
  glyph: string;
  /** Colours for the panel behind the glyph and for the pill beneath it. */
  panel: string;
  panelEdge: string;
  pill: string;
  pillShadow: string;
  shape: "circle" | "pentagon";
  glyphColors: string[];
  /** Journeys without a route are drawn locked rather than hidden. */
  route?: string;
};

const JOURNEYS: Journey[] = [
  {
    id: "reading",
    label: "Reading",
    glyph: "ABC",
    panel: "#3ea8f5",
    panelEdge: "#1c7fd0",
    pill: "linear-gradient(180deg, #4a4fe0 0%, #2f2fbe 100%)",
    pillShadow: "0 6px 0 #21218f",
    shape: "circle",
    glyphColors: ["#ff4d6d", "#ffc93c", "#43d17c"],
    route: "/ecd/reading",
  },
  {
    id: "math",
    label: "Math",
    glyph: "123",
    panel: "#e83fd0",
    panelEdge: "#b715a2",
    pill: "linear-gradient(180deg, #e23fd2 0%, #b3159f 100%)",
    pillShadow: "0 6px 0 #7d0d6f",
    shape: "pentagon",
    glyphColors: ["#ffe14d", "#4ad3ff", "#ffffff"],
    route: "/ecd/maths",
  },
];

export const EcdJourney: React.FC = () => {
  const navigate = useNavigate();

  // Same tune as the welcome screen; the refcount keeps it playing straight
  // through the hand-over instead of restarting it.
  useEffect(() => {
    ecdSounds.retainIntro();
    return () => ecdSounds.releaseIntro();
  }, []);

  const choose = (journey: Journey) => {
    if (!journey.route) return;
    ecdSounds.play("buttonClick");
    ecdSounds.play("swipe", 0.8);
    try {
      localStorage.setItem(JOURNEY_KEY, journey.id);
    } catch {
      /* private browsing — the choice just will not be remembered */
    }
    navigate(journey.route);
  };

  return (
    <EcdShell backTo="/">
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-16 pt-[72px] sm:pt-[84px]">
        <h1
          className="px-12 text-center text-[30px] leading-[1.1] text-white drop-shadow-[0_3px_0_rgba(6,102,124,0.45)] sm:px-16 sm:text-[44px]"
          style={headingFont}
        >
          Choose your journey
        </h1>

        {/* framed scene — the car hangs off the left edge, so the frame keeps
            its own padding rather than clipping him */}
        <div className="relative mt-5 w-full max-w-[940px] sm:mt-7">
          <div className="overflow-hidden rounded-[26px] border-[7px] border-white bg-[#7fd8f5] shadow-[0_10px_0_rgba(6,102,124,0.22),0_22px_40px_rgba(2,74,104,0.28)] sm:rounded-[32px] sm:border-[9px]">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[1200/628]">
              <div className="absolute inset-0">
                <JourneyScene />
              </div>

              {/* Gerald on his scooter, rolling in beside the maths panel. He
                  is hidden on a phone: the board is only so wide, and the two
                  choices earn that space before a bystander does. */}
              <img
                src="/images/ecd/gerald1.png"
                alt=""
                aria-hidden="true"
                className="ecd-hover pointer-events-none absolute bottom-[22%] left-[73%] hidden h-[38%] w-auto -translate-x-1/2 drop-shadow-[0_10px_10px_rgba(0,60,20,0.28)] sm:block sm:h-[42%]"
              />

              {/* the two journeys */}
              <div className="absolute inset-x-0 top-[7%] flex items-start justify-center gap-[8%] px-[5%] sm:pl-[6%] sm:pr-[24%]">
                {JOURNEYS.map((journey) => (
                  <div
                    key={journey.id}
                    className={`flex w-[42%] max-w-[180px] flex-col items-center sm:w-[30%] ${
                      journey.route ? "" : "opacity-60 grayscale"
                    }`}
                  >
                    <div
                      className={`ecd-hover flex w-full items-center justify-center ${
                        journey.shape === "circle" ? "rounded-full" : "ecd-pentagon"
                      }`}
                      style={{
                        aspectRatio: "1 / 1",
                        background: journey.panel,
                        border: journey.shape === "circle" ? `5px solid ${journey.panelEdge}` : "none",
                        animationDelay: journey.id === "math" ? "1.4s" : "0s",
                      }}
                      aria-hidden="true"
                    >
                      <span
                        className="flex items-center justify-center text-[clamp(26px,6vw,54px)] leading-none"
                        style={headingFont}
                      >
                        {journey.glyph.split("").map((character, index) => (
                          <span
                            key={character}
                            className="inline-block"
                            style={{
                              color: journey.glyphColors[index % journey.glyphColors.length],
                              transform: `rotate(${index * 9 - 9}deg) translateY(${index === 1 ? "-6px" : "0"})`,
                              textShadow:
                                "2px 2px 0 rgba(0,0,0,0.22), -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff",
                            }}
                          >
                            {character}
                          </span>
                        ))}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => choose(journey)}
                      disabled={!journey.route}
                      aria-disabled={!journey.route}
                      title={journey.route ? undefined : "Coming soon"}
                      className={`ecd-pill mt-[8%] w-full max-w-[210px] whitespace-nowrap px-2 py-[3%] text-[clamp(11px,2.2vw,22px)] sm:px-4 ${
                        journey.route ? "" : "cursor-not-allowed"
                      }`}
                      style={{
                        ...headingFont,
                        background: journey.pill,
                        boxShadow: journey.pillShadow,
                      }}
                    >
                      {journey.route ? journey.label : `${journey.label} · Soon`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gerald idling on the road, breaking out of the frame like a sticker.
              The bob lives on the wrapper because the CSS animation's transform
              would otherwise overwrite the horizontal flip on the image. */}
          <div className="ecd-idle pointer-events-none absolute bottom-[-2%] left-[-3%] w-[27%] max-w-[230px] sm:left-[-5%]">
            <img
              src="/images/ecd/geraldincar.png"
              alt="Gerald waving from his little red car"
              style={{ transform: "scaleX(-1)" }}
              className="w-full drop-shadow-[0_12px_12px_rgba(0,40,60,0.32)]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            ecdSounds.play("buttonClick");
            navigate("/");
          }}
          className="ecd-btn mt-7 h-[48px] w-full max-w-[186px] rounded-[10px] text-[16px] uppercase tracking-[0.01em] transition-all duration-100 sm:h-[52px] sm:text-[18px]"
          style={headingFont}
        >
          Home
        </button>
      </div>
    </EcdShell>
  );
};

export default EcdJourney;
