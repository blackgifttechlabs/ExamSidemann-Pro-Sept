import React, { useEffect, useState } from "react";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { ecdSounds } from "../../lib/audio/ecdSounds";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * The shared chrome for every Yippie (ECD) screen: the flat cyan sky, the
 * bouncing cloud bank along the floor, the sound toggle, and the stylesheet
 * that the parchment cards, inputs and chunky buttons are built from.
 *
 * Both the welcome screen and the journey chooser render inside this, so the
 * two pages cannot drift apart visually.
 */

type CloudProps = {
  x: number;
  y: number;
  scale: number;
  fill: string;
  delay?: number;
};

/**
 * The bounce lives on an outer wrapper: a CSS `transform` on an SVG element
 * overrides its `transform` *attribute*, so animating the same node that
 * carries the placement transform would stack every cloud on the origin.
 */
const Cloud: React.FC<CloudProps> = ({ x, y, scale, fill, delay = 0 }) => (
  <g className="ecd-cloud" style={{ animationDelay: `${delay}s` }}>
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g fill={fill}>
        <circle cx="78" cy="86" r="78" />
        <circle cx="196" cy="56" r="106" />
        <circle cx="322" cy="94" r="72" />
        <circle cx="408" cy="120" r="52" />
        <rect x="0" y="104" width="460" height="240" rx="72" />
      </g>
    </g>
  </g>
);

export const EcdShell: React.FC<{
  children: React.ReactNode;
  /**
   * Where the background tune should rest on this screen, as a fraction of
   * full. The chooser screens leave it playing properly; an activity passes a
   * low value so the tune slides back and stays out of the way.
   */
  musicBed?: number;
  /** Where the top-left back button goes. Omit it and no button is drawn. */
  backTo?: string;
  /** Decorative cloud bank. Games disable it so their artwork owns the screen. */
  showClouds?: boolean;
  /**
   * Content for the middle of the top bar. A screen that needs the space —
   * a score, a level, a run of numbers — passes it here and takes the row over
   * from the greeting, which would otherwise crowd it out.
   */
  topRow?: React.ReactNode;
}> = ({ children, musicBed = 1, backTo, showClouds = true, topRow }) => {
  const [muted, setMuted] = useState(() => ecdSounds.isMuted());
  const navigate = useNavigate();

  // Slide to this screen's level on arrival. There is deliberately no reset on
  // the way out: every Yippie screen renders this shell and declares its own
  // level, so the screen being entered always sets it. Resetting here as well
  // would ramp the tune up and straight back down when moving between two
  // activities, which is audible as a wobble.
  useEffect(() => {
    ecdSounds.setIntroBed(musicBed);
  }, [musicBed]);
  const { user, userProfile } = useAuth();

  // Once a learner is signed in their name rides along in the corner, so a
  // parent can see at a glance whose account is open.
  const learnerName =
    userProfile?.firstName?.trim() || user?.displayName?.trim().split(/\s+/)[0] || "";

  const toggleMuted = () => {
    const next = !muted;
    setMuted(next);
    ecdSounds.setMuted(next);
    if (!next) ecdSounds.play("buttonClick");
  };

  return (
    <section className="ecd-stage relative flex min-h-[100svh] w-full flex-col items-center overflow-hidden bg-[#6fe3f1]">
      <style>{`
        .ecd-stage { --fold: 34px; --notch: 15px; }
        @media (max-width: 640px) {
          .ecd-stage { --fold: 24px; --notch: 11px; }
        }
        @keyframes ecdBounce {
          0%   { transform: translateY(0) scale(1, 1); }
          15%  { transform: translateY(-22px) scale(0.97, 1.06); }
          34%  { transform: translateY(0) scale(1.05, 0.94); }
          52%  { transform: translateY(-11px) scale(0.99, 1.03); }
          70%  { transform: translateY(0) scale(1.03, 0.97); }
          85%  { transform: translateY(-4px) scale(1, 1.01); }
          100% { transform: translateY(0) scale(1, 1); }
        }
        @keyframes ecdCardIn {
          0% { opacity: 0; transform: translateY(18px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        /* Squash lands on the base of each puff, so the bank keeps its footing
           on the bottom edge while the tops bob. */
        .ecd-cloud {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: ecdBounce 3.4s cubic-bezier(0.34, 1.32, 0.5, 1) infinite;
        }
        .ecd-card-wrap { animation: ecdCardIn 0.5s cubic-bezier(0.23, 1, 0.32, 1) both; }
        .ecd-card {
          background: #f6e7c8;
          clip-path: polygon(
            var(--fold) 0,
            calc(100% - var(--notch)) 0,
            100% var(--notch),
            100% calc(100% - var(--fold)),
            calc(100% - var(--fold)) 100%,
            var(--notch) 100%,
            0 calc(100% - var(--notch)),
            0 var(--fold)
          );
        }
        .ecd-fold { position: absolute; background: #dfc79a; }
        .ecd-fold-tl { top: 0; left: 0; width: var(--fold); height: var(--fold); clip-path: polygon(0 0, 100% 0, 0 100%); }
        .ecd-fold-br { bottom: 0; right: 0; width: var(--fold); height: var(--fold); clip-path: polygon(100% 0, 100% 100%, 0 100%); }
        .ecd-fold-tr { top: 0; right: 0; width: var(--notch); height: var(--notch); clip-path: polygon(0 0, 100% 0, 100% 100%); }
        .ecd-fold-bl { bottom: 0; left: 0; width: var(--notch); height: var(--notch); clip-path: polygon(0 0, 0 100%, 100% 100%); }
        .ecd-btn {
          background: linear-gradient(180deg, #fcfcfc 0%, #ededed 55%, #d9d9d9 100%);
          border: 2px solid #b4b4b4;
          box-shadow: 0 4px 0 #a6a6a6, 0 7px 12px rgba(0, 0, 0, 0.18);
          color: #33323a;
        }
        .ecd-btn:hover { background: linear-gradient(180deg, #ffffff 0%, #f3f3f3 55%, #e2e2e2 100%); }
        .ecd-btn:active, .ecd-btn[data-pressed="true"] {
          transform: translateY(4px);
          box-shadow: 0 0 0 #a6a6a6, 0 2px 6px rgba(0, 0, 0, 0.18);
        }
        .ecd-btn:focus-visible { outline: 3px solid #3f3f47; outline-offset: 0; }
        .ecd-input {
          height: 54px;
          background: #fffaf0;
          border: 2px solid #d9c39a;
          box-shadow: inset 0 2px 4px rgba(120, 96, 45, 0.16);
          font-family: "Nunito", "Plus Jakarta Sans", sans-serif;
          font-weight: 800;
        }
        .ecd-input:focus { border-color: #8a7a55; box-shadow: inset 0 2px 4px rgba(120, 96, 45, 0.16), 0 0 0 3px rgba(138, 122, 85, 0.28); }
        /* ---------------------------------------- journey chooser */
        .ecd-pentagon {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        @keyframes ecdIdle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(-0.8deg); }
          60% { transform: translateY(-1px) rotate(0.6deg); }
        }
        @keyframes ecdHover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-9px); }
        }
        .ecd-idle { animation: ecdIdle 1.6s ease-in-out infinite; }
        .ecd-hover { animation: ecdHover 3.2s ease-in-out infinite; }
        .ecd-pill {
          border-radius: 9999px;
          color: #ffffff;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.22);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
        }
        .ecd-pill:active { transform: translateY(5px); box-shadow: none !important; }
        .ecd-pill:focus-visible { outline: 3px solid #ffffff; outline-offset: 3px; }
        @keyframes ecdShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .ecd-shake { animation: ecdShake 0.4s ease-in-out; }
        @keyframes ecdRise {
          0% { transform: translate(-50%, 10%) scale(0.55); opacity: 0; }
          25% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
          75% { transform: translate(-50%, -62%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -80%) scale(0.94); opacity: 0; }
        }
        .ecd-rise { animation: ecdRise 3.6s ease-out forwards; }
        /* The picture is the thing a pre-reader looks at, so it never sits
           quite still: a slow tilt and bob, with a bigger hop as it arrives. */
        @keyframes ecdWiggle {
          0% { transform: scale(0.4) rotate(-12deg); }
          14% { transform: scale(1.18) rotate(7deg); }
          24% { transform: scale(1) rotate(0deg); }
          46% { transform: translateY(-8%) rotate(-6deg) scale(1.04); }
          68% { transform: translateY(0) rotate(5deg) scale(1); }
          86% { transform: translateY(-4%) rotate(-3deg) scale(1.02); }
          100% { transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes ecdBeat {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.06); }
          70% { transform: scale(0.98); }
        }
        .ecd-wiggle { display: inline-block; animation: ecdWiggle 3.2s ease-in-out infinite; }
        /* A kite does not sit in a bubble. It lifts out, loops around the
           scene and settles back where it started. */
        @keyframes ecdFly {
          0%, 8% { transform: translate(0, 0) rotate(0deg) scale(1); }
          16% { transform: translate(-30%, -130%) rotate(-20deg) scale(1.12); }
          30% { transform: translate(-250%, -70%) rotate(14deg) scale(0.95); }
          44% { transform: translate(-330%, 90%) rotate(-14deg) scale(0.88); }
          58% { transform: translate(-190%, 210%) rotate(18deg) scale(0.94); }
          72% { transform: translate(-20%, 170%) rotate(-10deg) scale(1.02); }
          86% { transform: translate(40%, 40%) rotate(8deg) scale(1.08); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        /* ---------------------------------------------- number drive */
        @keyframes ecdDriveDown {
          from { top: -34%; }
          to { top: 60%; }
        }
        .ecd-drive-block { animation: ecdDriveDown linear forwards; }

        @keyframes ecdDriveLane {
          from { background-position-y: 0; }
          to { background-position-y: 120px; }
        }
        .ecd-drive-lane {
          background-image: repeating-linear-gradient(
            to bottom,
            #f2f5f7 0 44px,
            transparent 44px 120px
          );
          background-size: 9px 120px;
          background-position: center 0;
          background-repeat: repeat-y;
          animation: ecdDriveLane 0.8s linear infinite;
        }

        /* The trees are laid out one spacing apart and travel exactly one
           spacing, so the loop has no seam. */
        @keyframes ecdDriveScenery {
          from { transform: translateY(-22%); }
          to { transform: translateY(0%); }
        }
        .ecd-drive-scenery { animation: ecdDriveScenery 2.6s linear infinite; }

        .ecd-fly {
          display: inline-block;
          position: relative;
          z-index: 20;
          animation: ecdFly 7s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        .ecd-beat { animation: ecdBeat 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ecd-cloud, .ecd-card-wrap, .ecd-idle, .ecd-hover, .ecd-shake, .ecd-rise,
          .ecd-wiggle, .ecd-beat, .ecd-fly, .ecd-drive-lane, .ecd-drive-scenery { animation: none; }
        }
      `}</style>

      {/* The top bar: back on the left, the screen's own business in the
          middle, sound on the right. */}
      <div className="absolute inset-x-0 top-4 z-20 flex items-center gap-2 px-4 sm:top-6 sm:px-6">
        {backTo && (
          <button
            type="button"
            onClick={() => {
              ecdSounds.play("buttonClick");
              navigate(backTo);
            }}
            aria-label="Go back"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 text-[#2b7f92] shadow-[0_3px_0_rgba(6,102,124,0.28)] transition-transform hover:scale-105 active:translate-y-[2px] active:shadow-none"
          >
            <ArrowLeft size={22} />
          </button>
        )}

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 sm:gap-2">
          {topRow}
        </div>

        {!topRow && learnerName && (
          <span
            className="max-w-[46vw] shrink truncate rounded-full bg-white/85 px-4 py-2 text-[14px] text-[#1d6f80] shadow-[0_3px_0_rgba(6,102,124,0.28)] sm:max-w-none sm:text-[16px]"
            style={{ fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif', fontWeight: 800 }}
          >
            Hi, {learnerName}!
          </span>
        )}

        <button
          type="button"
          onClick={toggleMuted}
          aria-pressed={muted}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 text-[#2b7f92] shadow-[0_3px_0_rgba(6,102,124,0.28)] transition-transform hover:scale-105 active:translate-y-[2px] active:shadow-none"
        >
          {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      </div>

      {/* cloud bank — the SVG covers the whole stage and is anchored to the
          bottom edge, so the clouds sit on the floor of any viewport shape.
          Every puff overlaps its neighbours and runs past the bottom of the
          viewBox, so the bank reads as one unbroken shelf with no sky showing
          through between the clouds. */}
      {showClouds && <div className="pointer-events-none absolute inset-0">
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMax slice"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* far bank */}
          <g>
            <rect x="-200" y="900" width="1840" height="160" fill="#dbf6fc" />
            <Cloud x={-160} y={842} scale={0.8} fill="#dbf6fc" delay={0} />
            <Cloud x={190} y={854} scale={0.86} fill="#dbf6fc" delay={2.4} />
            <Cloud x={560} y={836} scale={0.9} fill="#dbf6fc" delay={1.2} />
            <Cloud x={910} y={852} scale={0.82} fill="#dbf6fc" delay={3.4} />
            <Cloud x={1230} y={844} scale={0.86} fill="#dbf6fc" delay={1.9} />
          </g>
          {/* near bank */}
          <g>
            <rect x="-200" y="936" width="1840" height="120" fill="#ffffff" />
            <Cloud x={-220} y={880} scale={0.95} fill="#ffffff" delay={1.6} />
            <Cloud x={160} y={898} scale={0.82} fill="#ffffff" delay={3.2} />
            <Cloud x={470} y={872} scale={1} fill="#ffffff" delay={0.8} />
            <Cloud x={850} y={892} scale={0.88} fill="#ffffff" delay={2.8} />
            <Cloud x={1170} y={878} scale={0.95} fill="#ffffff" delay={0.4} />
          </g>
        </svg>
      </div>}

      {children}
    </section>
  );
};

export default EcdShell;
