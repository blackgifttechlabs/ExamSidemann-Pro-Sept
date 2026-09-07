"use client";

import { useEffect, useId, useMemo, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { ExperimentRecord } from "../../../data/experimentRegistry";
import { labSounds } from "../../../lib/audio/labSounds";

/* ============================================================================
   EthelIntro — dimensional lab-mascot intro with gesture-synced dialogue and
   real voiced audio per beat. Detects first-time vs returning visitors via
   localStorage and picks the matching script + audio clips automatically.
   Typing speed syncs to actual audio duration; mouth only moves while the
   clip is actually playing.
   ============================================================================ */

type Gesture = "wave" | "point" | "think" | "lean" | "open" | "nod" | "laugh" | "idle";

interface WordCue {
  word: string;
  startMs: number;
  endMs: number;
}

interface Beat {
  gesture: Gesture;
  text: string;
  audioSrc: string;
  fallbackHoldMs: number; // only used if audio fails to load/play
  wordCues?: readonly WordCue[];
}

const STORAGE_KEY = "examsidemann_visited";

// Script beats below follow a problem -> solution -> payoff arc:
// [intrigue] -> [desire] -> [information] -> [inspiration] -> [confident]
const FIRST_TIME_SCRIPT: Beat[] = [
  {
    gesture: "lean",
    text: "Have you ever noticed that most schools can't afford proper experiment apparatus?",
    audioSrc: "/sounds/welcome-experiment-1.wav",
    fallbackHoldMs: 3400,
  },
  {
    gesture: "nod",
    text: "But you still need to pass your Combined Science exam.",
    audioSrc: "/sounds/welcome-experiment-2.wav",
    fallbackHoldMs: 2200,
  },
  {
    gesture: "wave",
    text: "Don't worry — I'm Tinashe, your lab partner inside ExamSidemann. I'll help you understand every experiment step by step. You can even switch to game mode and move freely around the lab doing experiments.",
    audioSrc: "/sounds/welcome-experiment-3.wav",
    fallbackHoldMs: 6200,
  },
  {
    gesture: "laugh",
    text: "Had limited time in your school lab? Here, you experiment until you're tired.",
    audioSrc: "/sounds/welcome-experiment-4.wav",
    fallbackHoldMs: 3200,
  },
  {
    gesture: "point",
    text: "Let me show you what I'm talking about.",
    audioSrc: "/sounds/welcome-experiment-5.wav",
    fallbackHoldMs: 1800,
  },
];

const RETURNING_SCRIPT: Beat[] = [
  {
    gesture: "wave",
    text: "Hey! I'm Tinashe, good to see you again. Let's get back into the lab.",
    audioSrc: "/sounds/returing1.wav",
    fallbackHoldMs: 5700,
    // Timed from the real 5.68 s recording. Keeping these as word cues
    // preserves the audible pauses instead of spreading every character
    // evenly across the clip.
    wordCues: [
      { word: "Hey!", startMs: 435, endMs: 890 },
      { word: "I'm", startMs: 1235, endMs: 1415 },
      { word: "Tinashe,", startMs: 1445, endMs: 2035 },
      { word: "good", startMs: 2335, endMs: 2490 },
      { word: "to", startMs: 2490, endMs: 2549 },
      { word: "see", startMs: 2549, endMs: 2730 },
      { word: "you", startMs: 2730, endMs: 2880 },
      { word: "again.", startMs: 2880, endMs: 3100 },
      { word: "Let's", startMs: 3723, endMs: 3960 },
      { word: "get", startMs: 3960, endMs: 4140 },
      { word: "back", startMs: 4140, endMs: 4470 },
      { word: "into", startMs: 4509, endMs: 4800 },
      { word: "the", startMs: 4800, endMs: 4920 },
      { word: "lab.", startMs: 4920, endMs: 5370 },
    ],
  },
];

/* ---------------------------------------------------------------------------
   Cookie/localStorage helper — safe for SSR, resilient to blocked storage
--------------------------------------------------------------------------- */
function useVisitorScript(): { script: Beat[]; ready: boolean } {
  const [script, setScript] = useState<Beat[]>(FIRST_TIME_SCRIPT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const hasVisited = window.localStorage.getItem(STORAGE_KEY);
      if (hasVisited) {
        setScript(RETURNING_SCRIPT);
      } else {
        setScript(FIRST_TIME_SCRIPT);
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } catch {
      // storage blocked (private mode, etc.) — default to first-time script
      setScript(FIRST_TIME_SCRIPT);
    } finally {
      setReady(true);
    }
  }, []);

  return { script, ready };
}

type PlaybackMode = "pending" | "audio" | "fallback";

function timedWordsAt(cues: readonly WordCue[], elapsedMs: number) {
  const visibleWords: string[] = [];

  for (const cue of cues) {
    if (elapsedMs < cue.startMs) break;

    const duration = Math.max(1, cue.endMs - cue.startMs);
    const progress = Math.min(1, Math.max(0, (elapsedMs - cue.startMs) / duration));
    const visibleCharacters =
      elapsedMs >= cue.endMs
        ? cue.word.length
        : Math.max(1, Math.ceil(cue.word.length * progress));

    visibleWords.push(cue.word.slice(0, visibleCharacters));
    if (visibleCharacters < cue.word.length) break;
  }

  return visibleWords.join(" ");
}

/* ---------------------------------------------------------------------------
   Audio-clock typewriter — the returning greeting uses measured word timings,
   including the real pauses in the recording. Other clips still scale evenly
   to their known duration. If autoplay is blocked, a local animation clock
   provides the same visual fallback without leaving the panel empty.
--------------------------------------------------------------------------- */
function useTypewriter({
  text,
  targetDurationMs,
  fallbackDurationMs,
  wordCues,
  playbackMode,
  audioTimeMs,
}: {
  text: string;
  targetDurationMs: number | null;
  fallbackDurationMs: number;
  wordCues?: readonly WordCue[];
  playbackMode: PlaybackMode;
  audioTimeMs: number;
}) {
  const [fallbackElapsedMs, setFallbackElapsedMs] = useState(0);

  useEffect(() => {
    setFallbackElapsedMs(0);
    if (playbackMode !== "fallback") return;

    let frame = 0;
    const startedAt = performance.now();
    const update = (now: number) => {
      const elapsed = Math.min(fallbackDurationMs, now - startedAt);
      setFallbackElapsedMs(elapsed);
      if (elapsed < fallbackDurationMs) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [text, playbackMode, fallbackDurationMs]);

  const elapsedMs =
    playbackMode === "audio"
      ? audioTimeMs
      : playbackMode === "fallback"
        ? fallbackElapsedMs
        : 0;

  const shown = useMemo(() => {
    if (!text.length || playbackMode === "pending") return "";
    if (wordCues?.length) return timedWordsAt(wordCues, elapsedMs);

    // Leave a small trailing buffer so uncued dialogue completes naturally
    // just before its final audio frame.
    const fullDuration =
      playbackMode === "audio" && targetDurationMs
        ? targetDurationMs
        : fallbackDurationMs;
    const usableDuration = Math.max(300, fullDuration - 200);
    const progress = Math.min(1, Math.max(0, elapsedMs / usableDuration));
    return text.slice(0, Math.ceil(text.length * progress));
  }, [
    audioTimeMs,
    elapsedMs,
    fallbackDurationMs,
    playbackMode,
    targetDurationMs,
    text,
    wordCues,
  ]);

  return { shown, done: shown === text };
}

/* ---------------------------------------------------------------------------
   Tinashe — a rigged lab partner.

   The old figure was a stack of independent CSS keyframe loops with both arms
   snapped between fixed rotations, which is exactly what made it read as a
   puppet. Everything below runs off a single requestAnimationFrame loop:

     - every joint is a light spring, so a gesture overshoots a little and
       settles instead of sliding linearly into place;
     - forearms are softer springs than shoulders, so the hand drags behind the
       shoulder the way a real limb does (overlapping action);
     - a gesture plays its stroke and then relaxes part-way back toward rest
       while it is held, rather than freezing at full extension;
     - the jaw runs a syllable envelope with real consonant closures and feeds
       back into the head and brows, so speech moves the whole face at once;
     - blinks, gaze saccades and idle sway are irregular, never on a loop.

   Reduced motion collapses all of it to one static, correctly posed frame.
--------------------------------------------------------------------------- */

type HandShape = "open" | "point" | "relaxed";

interface Pose {
  lShoulder: number;
  lElbow: number;
  rShoulder: number;
  rElbow: number;
  tilt: number; // head roll, degrees
  turn: number; // head yaw, fake-3d px of parallax
  nod: number; // head pitch, px
  brow: number; // -1 furrowed .. 1 raised
  smile: number; // 0 neutral .. 1 broad
  hand: HandShape;
}

// Shoulder angles: 0deg hangs straight down, negative swings the viewer-right
// arm outward and up, positive does the same for the viewer-left arm.
const REST_POSE: Pose = {
  lShoulder: 9,
  lElbow: 13,
  rShoulder: -9,
  rElbow: -13,
  tilt: 0,
  turn: 0,
  nod: 0,
  brow: 0,
  smile: 0.42,
  hand: "relaxed",
};

const POSES: Record<Gesture, Pose> = {
  idle: REST_POSE,
  wave: {
    lShoulder: 13,
    lElbow: 17,
    rShoulder: -142,
    rElbow: -22,
    tilt: 5,
    turn: 1.2,
    nod: -1,
    brow: 0.7,
    smile: 0.85,
    hand: "open",
  },
  point: {
    lShoulder: 11,
    lElbow: 15,
    rShoulder: -72,
    rElbow: -14,
    tilt: 3,
    turn: 2.4,
    nod: 0,
    brow: 0.45,
    smile: 0.5,
    hand: "point",
  },
  think: {
    lShoulder: 15,
    lElbow: 28,
    rShoulder: -170,
    rElbow: -65,
    tilt: -7,
    turn: -2.2,
    nod: 1,
    brow: -0.45,
    smile: 0.18,
    hand: "relaxed",
  },
  lean: {
    lShoulder: 21,
    lElbow: 27,
    rShoulder: -21,
    rElbow: -31,
    tilt: 6,
    turn: 2,
    nod: 1.5,
    brow: 0.35,
    smile: 0.5,
    hand: "open",
  },
  open: {
    lShoulder: 52,
    lElbow: 23,
    rShoulder: -52,
    rElbow: -23,
    tilt: 0,
    turn: 0,
    nod: -1,
    brow: 0.8,
    smile: 0.7,
    hand: "open",
  },
  nod: {
    lShoulder: 11,
    lElbow: 15,
    rShoulder: -13,
    rElbow: -19,
    tilt: 1,
    turn: 0,
    nod: 0,
    brow: 0.2,
    smile: 0.55,
    hand: "relaxed",
  },
  laugh: {
    lShoulder: 27,
    lElbow: 35,
    rShoulder: 18,
    rElbow: 38,
    tilt: -6,
    turn: -1,
    nod: -2,
    brow: 0.9,
    smile: 1,
    hand: "relaxed",
  },
};

interface Spring {
  x: number;
  v: number;
}

const makeSpring = (x = 0): Spring => ({ x, v: 0 });

function stepSpring(s: Spring, target: number, stiffness: number, damping: number, dt: number) {
  s.v += ((target - s.x) * stiffness - s.v * damping) * dt;
  s.x += s.v * dt;
}

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Cheap layered noise — three incommensurable sines read as unrepeating drift.
function wander(t: number, seed: number) {
  return (
    Math.sin(t * 0.61 + seed) * 0.6 +
    Math.sin(t * 1.43 + seed * 2.7) * 0.28 +
    Math.sin(t * 2.87 + seed * 4.3) * 0.12
  );
}

function createRig() {
  return {
    lShoulder: makeSpring(REST_POSE.lShoulder),
    lElbow: makeSpring(REST_POSE.lElbow),
    rShoulder: makeSpring(REST_POSE.rShoulder),
    rElbow: makeSpring(REST_POSE.rElbow),
    tilt: makeSpring(0),
    turn: makeSpring(0),
    nod: makeSpring(0),
    brow: makeSpring(0),
    smile: makeSpring(REST_POSE.smile),
    jaw: makeSpring(0.02),
    gazeX: makeSpring(0),
    gazeY: makeSpring(0),
    antenna: makeSpring(0),
    jawTarget: 0.02,
    nextSyllableAt: 0,
    gazeTargetX: 0,
    gazeTargetY: 0,
    nextSaccadeAt: 0,
    blinkAt: 1.6,
    blinkStart: -10,
    blinkPending: false,
    lastT: 0,
  };
}

/* Hand — palm plus fingers, drawn in the forearm's local space so it inherits
   the whole arm chain. `mirror` flips it for the viewer-left arm. */
function Hand({ shape, svgId, mirror = false }: { shape: HandShape; svgId: string; mirror?: boolean }) {
  const skin = `url(#${svgId}-skin)`;
  const skinSide = `url(#${svgId}-skin-side)`;

  return (
    <g transform={`translate(0 23)${mirror ? " scale(-1 1)" : ""}`}>
      <ellipse cx="0" cy="0" rx="9.6" ry="9" fill={skin} stroke="#075e46" strokeWidth="1.7" />
      <ellipse cx="-2.6" cy="-3.4" rx="3.4" ry="2.2" fill="#effff7" opacity=".26" />

      {shape === "point" ? (
        <>
          <rect x="-3.1" y="3" width="6.2" height="19" rx="3.1" fill={skin} stroke="#075e46" strokeWidth="1.6" />
          <rect
            x="-11.4"
            y="-2.4"
            width="4.8"
            height="10"
            rx="2.4"
            fill={skinSide}
            stroke="#075e46"
            strokeWidth="1.4"
            transform="rotate(-36 -9 2.6)"
          />
        </>
      ) : shape === "open" ? (
        <>
          <rect
            x="-7.8"
            y="3.4"
            width="5"
            height="12.4"
            rx="2.5"
            fill={skinSide}
            stroke="#075e46"
            strokeWidth="1.4"
            transform="rotate(-9 -5.3 3.4)"
          />
          <rect x="-2.6" y="4.4" width="5.2" height="13.4" rx="2.6" fill={skinSide} stroke="#075e46" strokeWidth="1.4" />
          <rect
            x="2.8"
            y="3.4"
            width="5"
            height="12"
            rx="2.5"
            fill={skinSide}
            stroke="#075e46"
            strokeWidth="1.4"
            transform="rotate(9 5.3 3.4)"
          />
          <rect
            x="-11.6"
            y="-2.6"
            width="4.8"
            height="9.6"
            rx="2.4"
            fill={skinSide}
            stroke="#075e46"
            strokeWidth="1.4"
            transform="rotate(-34 -9.2 2.2)"
          />
        </>
      ) : (
        <>
          <path d="M-6.4 4.6 Q-8 10.4 -3.6 11.6" fill="none" stroke="#8ce7bf" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M-1 6 Q-1.6 11.6 2.4 12.2" fill="none" stroke="#6ad9a9" strokeWidth="4.3" strokeLinecap="round" />
          <path d="M4.4 4.6 Q5.6 9.8 2.6 11.4" fill="none" stroke="#48c391" strokeWidth="4.1" strokeLinecap="round" />
          <path
            d="M-9.6 -1.6 Q-12 2.4 -8.6 5"
            fill="none"
            stroke="#7fe2b7"
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        </>
      )}
    </g>
  );
}

function EthelFigure({ gesture, isTalking }: { gesture: Gesture; isTalking: boolean }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const reactId = useId();
  const svgId = useMemo(() => `tinashe${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`, [reactId]);

  const gestureRef = useRef(gesture);
  const talkingRef = useRef(isTalking);
  const gestureStartRef = useRef(0);
  const rigRef = useRef(createRig());

  const rootRef = useRef<SVGGElement>(null);
  const torsoRef = useRef<SVGGElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const gazeLeftRef = useRef<SVGGElement>(null);
  const gazeRightRef = useRef<SVGGElement>(null);
  const browRef = useRef<SVGGElement>(null);
  const lidLeftRef = useRef<SVGGElement>(null);
  const lidRightRef = useRef<SVGGElement>(null);
  const lArmRef = useRef<SVGGElement>(null);
  const lForeRef = useRef<SVGGElement>(null);
  const rArmRef = useRef<SVGGElement>(null);
  const rForeRef = useRef<SVGGElement>(null);
  const antennaLeftRef = useRef<SVGGElement>(null);
  const antennaRightRef = useRef<SVGGElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const mouthClipRef = useRef<SVGPathElement>(null);
  const teethRef = useRef<SVGPathElement>(null);
  const tongueRef = useRef<SVGEllipseElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  // Held so the reduced-motion path can repaint its single frame on demand.
  const paintRef = useRef<((t: number, dt: number) => void) | null>(null);

  // Gesture changes restart the stroke clock, which is what drives the
  // accents (the wave swing, the pointing push, the laugh shake).
  useEffect(() => {
    gestureRef.current = gesture;
    gestureStartRef.current = performance.now() / 1000;
  }, [gesture]);

  useEffect(() => {
    talkingRef.current = isTalking;
  }, [isTalking]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener?.("change", updatePreference);
    return () => mediaQuery.removeEventListener?.("change", updatePreference);
  }, []);

  useEffect(() => {
    const rig = rigRef.current;
    let frame = 0;

    const paint = (t: number, dt: number) => {
      const gestureName = gestureRef.current;
      const pose = POSES[gestureName] ?? REST_POSE;
      const talking = talkingRef.current;
      const gt = Math.max(0, t - gestureStartRef.current);

      // A held gesture eases part-way back toward rest instead of staying
      // locked at full extension — the relaxation phase of a real gesture.
      const relax = reduceMotion ? 0 : clamp((gt - 1.4) / 2, 0, 1) * 0.12;
      let lShoulder = lerp(pose.lShoulder, REST_POSE.lShoulder, relax);
      let lElbow = lerp(pose.lElbow, REST_POSE.lElbow, relax);
      let rShoulder = lerp(pose.rShoulder, REST_POSE.rShoulder, relax);
      let rElbow = lerp(pose.rElbow, REST_POSE.rElbow, relax);
      let tilt = pose.tilt;
      let turn = pose.turn;
      let nod = pose.nod;
      let brow = pose.brow;
      let bodyShake = 0;

      if (!reduceMotion) {
        switch (gestureName) {
          case "wave": {
            // Waves come in bursts with a slight pause between them, and the
            // shoulder carries a fraction of the forearm's swing.
            const ramp = clamp((gt - 0.22) * 2.6, 0, 1);
            const burst = 0.55 + 0.45 * Math.cos(gt * 1.6);
            const swing = Math.sin(gt * 8.4) * 15 * ramp * burst;
            rElbow += swing;
            rShoulder += swing * 0.22;
            tilt += Math.sin(gt * 8.4) * 0.6 * ramp;
            break;
          }
          case "point": {
            const push = Math.sin(gt * 2.2) * 2.6 * clamp(gt * 1.5, 0, 1);
            rShoulder += push;
            rElbow -= push * 0.6;
            turn += push * 0.14;
            break;
          }
          case "think": {
            rElbow += Math.sin(gt * 3.5) * 1.8;
            tilt += Math.sin(gt * 0.9) * 1.2;
            break;
          }
          case "nod": {
            // Nods arrive in short clusters rather than one endless bounce.
            const cluster = Math.max(0, Math.sin(gt * 1.15));
            nod += cluster * cluster * Math.sin(gt * 5.6) * 3.6;
            tilt += cluster * Math.sin(gt * 5.6) * 0.7;
            break;
          }
          case "laugh": {
            const shake = Math.sin(gt * 15.5) * (0.6 + 0.4 * Math.cos(gt * 2.2));
            nod += shake * 1.6;
            tilt += shake * 0.9;
            bodyShake = shake * 1.3;
            break;
          }
          default:
            break;
        }

        // Idle life — nothing ever sits perfectly still.
        lShoulder += wander(t, 1.7) * 2.2;
        rShoulder += wander(t, 4.1) * 2.2;
        lElbow += wander(t, 3.3) * 1.6;
        rElbow += wander(t, 5.9) * 1.6;
        tilt += wander(t, 2.3) * 1.5;
        turn += wander(t, 6.2) * 1.1;
      }

      /* ---- speech: syllable envelope, consonant closures, head feedback --- */
      if (reduceMotion) {
        rig.jawTarget = talking ? 0.36 : 0.03;
      } else if (talking) {
        if (t >= rig.nextSyllableAt) {
          const closure = Math.random() < 0.2;
          rig.jawTarget = closure ? 0.02 + Math.random() * 0.06 : 0.3 + Math.random() * 0.7;
          rig.nextSyllableAt = t + (closure ? 0.05 + Math.random() * 0.06 : 0.085 + Math.random() * 0.115);
          // Stressed syllables push the head down a touch, like real emphasis.
          if (rig.jawTarget > 0.74) rig.nod.v += 26;
        }
      } else {
        rig.jawTarget = 0.02;
        rig.nextSyllableAt = 0;
      }
      if (gestureName === "laugh") rig.jawTarget = Math.max(rig.jawTarget, 0.55);

      const speech = rig.jaw.x;
      brow += speech * 0.28;
      nod += speech * 0.9;

      /* ---- solve every joint ------------------------------------------- */
      if (reduceMotion) {
        rig.lShoulder.x = lShoulder;
        rig.lElbow.x = lElbow;
        rig.rShoulder.x = rShoulder;
        rig.rElbow.x = rElbow;
        rig.tilt.x = tilt;
        rig.turn.x = turn;
        rig.nod.x = nod;
        rig.brow.x = brow;
        rig.smile.x = pose.smile;
        rig.jaw.x = rig.jawTarget;
        rig.gazeX.x = 1.2;
        rig.gazeY.x = 0;
        rig.antenna.x = tilt;
      } else {
        stepSpring(rig.lShoulder, lShoulder, 120, 15, dt);
        stepSpring(rig.rShoulder, rShoulder, 120, 15, dt);
        // Softer elbows lag the shoulder — the hand arrives last.
        stepSpring(rig.lElbow, lElbow, 78, 12, dt);
        stepSpring(rig.rElbow, rElbow, 78, 12, dt);
        stepSpring(rig.tilt, tilt, 150, 20, dt);
        stepSpring(rig.turn, turn, 150, 20, dt);
        stepSpring(rig.nod, nod, 190, 17, dt);
        stepSpring(rig.brow, brow, 200, 24, dt);
        stepSpring(rig.smile, pose.smile, 80, 16, dt);
        stepSpring(rig.jaw, rig.jawTarget, 1300, 52, dt);
        // The antenna spring trails the head, giving free secondary motion.
        stepSpring(rig.antenna, rig.tilt.x, 60, 8, dt);

        /* ---- gaze: saccades, mostly toward the learner and the caption --- */
        if (t >= rig.nextSaccadeAt) {
          rig.nextSaccadeAt = t + 0.7 + Math.random() * 2.3;
          const towardPanel = Math.random() < 0.62;
          rig.gazeTargetX = towardPanel ? 1.3 + Math.random() * 1.7 : (Math.random() * 2 - 1) * 3.2;
          rig.gazeTargetY = (Math.random() * 2 - 1) * 1.8 + (gestureName === "think" ? -2.6 : 0);
        }
        stepSpring(rig.gazeX, rig.gazeTargetX, 520, 40, dt);
        stepSpring(rig.gazeY, rig.gazeTargetY, 520, 40, dt);

        /* ---- blinks: irregular, with the occasional double blink --------- */
        if (t >= rig.blinkAt) {
          rig.blinkStart = t;
          if (rig.blinkPending) {
            rig.blinkPending = false;
            rig.blinkAt = t + 2.6 + Math.random() * 4;
          } else if (Math.random() < 0.28) {
            rig.blinkPending = true;
            rig.blinkAt = t + 0.26;
          } else {
            rig.blinkAt = t + 2.6 + Math.random() * 4;
          }
        }
      }

      const blinkPhase = (t - rig.blinkStart) / 0.14;
      const blink = !reduceMotion && blinkPhase >= 0 && blinkPhase <= 1 ? Math.sin(blinkPhase * Math.PI) ** 0.55 : 0;
      // Happy expressions ride with the lids a little lower.
      const lid = clamp(Math.max(blink, rig.smile.x * 0.14), 0, 1);

      /* ---- write the frame ---------------------------------------------- */
      const breath = reduceMotion ? 0 : Math.sin(t * 1.4);
      const bob = reduceMotion ? 0 : breath * 1.5 + wander(t, 9.4) * 0.7 + bodyShake;
      const sway = reduceMotion ? 0 : wander(t * 0.4, 5.5) * 2.4;

      rootRef.current?.setAttribute("transform", `translate(${sway.toFixed(2)} ${bob.toFixed(2)})`);
      torsoRef.current?.setAttribute(
        "transform",
        `translate(128 206) scale(${(1 + breath * 0.008).toFixed(4)} ${(1 + breath * 0.015).toFixed(4)}) translate(-128 -206)`,
      );
      headRef.current?.setAttribute(
        "transform",
        `translate(${(rig.turn.x * 0.5).toFixed(2)} ${rig.nod.x.toFixed(2)}) rotate(${rig.tilt.x.toFixed(2)} 128 128)`,
      );
      faceRef.current?.setAttribute(
        "transform",
        `translate(${rig.turn.x.toFixed(2)} ${(rig.nod.x * 0.16).toFixed(2)})`,
      );

      const antennaLag = ((rig.tilt.x - rig.antenna.x) * 2.4).toFixed(2);
      antennaLeftRef.current?.setAttribute("transform", `rotate(${antennaLag} 112 54)`);
      antennaRightRef.current?.setAttribute("transform", `rotate(${antennaLag} 144 54)`);

      const gaze = `translate(${rig.gazeX.x.toFixed(2)} ${rig.gazeY.x.toFixed(2)})`;
      gazeLeftRef.current?.setAttribute("transform", gaze);
      gazeRightRef.current?.setAttribute("transform", gaze);
      browRef.current?.setAttribute("transform", `translate(0 ${(-rig.brow.x * 3.4).toFixed(2)})`);
      lidLeftRef.current?.setAttribute("transform", `translate(0 ${(lid * 33).toFixed(2)})`);
      lidRightRef.current?.setAttribute("transform", `translate(0 ${(lid * 33).toFixed(2)})`);

      lArmRef.current?.setAttribute("transform", `translate(94 145) rotate(${rig.lShoulder.x.toFixed(2)})`);
      lForeRef.current?.setAttribute("transform", `translate(0 26) rotate(${rig.lElbow.x.toFixed(2)})`);
      rArmRef.current?.setAttribute("transform", `translate(162 145) rotate(${rig.rShoulder.x.toFixed(2)})`);
      rForeRef.current?.setAttribute("transform", `translate(0 26) rotate(${rig.rElbow.x.toFixed(2)})`);

      /* ---- mouth: jaw drop plus lip corners, redrawn every frame -------- */
      const jaw = clamp(rig.jaw.x, 0, 1);
      const smile = clamp(rig.smile.x, 0, 1);
      const halfW = 20 - jaw * 3.4;
      const cornerY = 112 - smile * 3.6;
      const midTop = 112 + smile * 1.6 - jaw * 1.2;
      const lipCtrl = 2 * midTop - cornerY;
      const depth = 2.2 + jaw * 14;
      const bottom = cornerY + depth;
      const d =
        `M${(128 - halfW).toFixed(1)} ${cornerY.toFixed(1)} ` +
        `Q128 ${lipCtrl.toFixed(1)} ${(128 + halfW).toFixed(1)} ${cornerY.toFixed(1)} ` +
        `Q${(128 + halfW * 0.8).toFixed(1)} ${(bottom * 1.0).toFixed(1)} 128 ${(bottom + 1).toFixed(1)} ` +
        `Q${(128 - halfW * 0.8).toFixed(1)} ${bottom.toFixed(1)} ${(128 - halfW).toFixed(1)} ${cornerY.toFixed(1)} Z`;
      mouthRef.current?.setAttribute("d", d);
      mouthClipRef.current?.setAttribute("d", d);

      const teeth =
        `M${(128 - halfW + 2).toFixed(1)} ${(cornerY + 0.4).toFixed(1)} ` +
        `Q128 ${(lipCtrl + 0.6).toFixed(1)} ${(128 + halfW - 2).toFixed(1)} ${(cornerY + 0.4).toFixed(1)} ` +
        `L${(128 + halfW - 2).toFixed(1)} ${(cornerY + 5).toFixed(1)} ` +
        `Q128 ${(lipCtrl + 5.4).toFixed(1)} ${(128 - halfW + 2).toFixed(1)} ${(cornerY + 5).toFixed(1)} Z`;
      teethRef.current?.setAttribute("d", teeth);
      teethRef.current?.setAttribute("opacity", clamp(0.3 + jaw * 0.7, 0, 1).toFixed(2));

      if (tongueRef.current) {
        tongueRef.current.setAttribute("cx", "128");
        tongueRef.current.setAttribute("cy", (bottom - 2.6).toFixed(1));
        tongueRef.current.setAttribute("rx", (halfW * 0.62).toFixed(1));
        tongueRef.current.setAttribute("ry", (2.4 + jaw * 3.4).toFixed(1));
        tongueRef.current.setAttribute("opacity", clamp(jaw * 1.2, 0, 1).toFixed(2));
      }

      if (shadowRef.current) {
        const squash = 1 - bob * 0.02;
        shadowRef.current.style.transform = `translateX(-50%) scaleX(${squash.toFixed(3)})`;
        shadowRef.current.style.opacity = (0.42 - bob * 0.02).toFixed(3);
      }
    };

    paintRef.current = paint;

    if (reduceMotion) {
      // One correctly posed frame, no loop.
      paint(performance.now() / 1000, 1 / 60);
      return;
    }

    rig.lastT = performance.now() / 1000;
    const tick = (nowMs: number) => {
      const t = nowMs / 1000;
      const dt = clamp(t - rig.lastT, 1 / 240, 1 / 30);
      rig.lastT = t;
      paint(t, dt);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion]);

  // With motion reduced there is no loop to pick the change up, so each new
  // gesture (and the mouth opening or closing) repaints that one frame.
  useEffect(() => {
    if (!reduceMotion) return;
    paintRef.current?.(performance.now() / 1000, 1 / 60);
  }, [reduceMotion, gesture, isTalking]);

  const handShape = (POSES[gesture] ?? REST_POSE).hand;
  const happyEyes = gesture === "laugh";
  const skin = `url(#${svgId}-skin)`;
  const skinSide = `url(#${svgId}-skin-side)`;

  return (
    <div className="tinashe-intro-figure relative h-[clamp(15rem,34vw,24rem)] w-[clamp(15rem,34vw,24rem)] shrink-0">
      <style>{`
        @keyframes ethelThinkFloat {
          0%, 100% { opacity: .5; transform: translateY(0) scale(.9); }
          50% { opacity: 1; transform: translateY(-4px) scale(1); }
        }
        @keyframes ethelGlow {
          0%, 100% { opacity: .5; }
          50% { opacity: .85; }
        }
        .ethel-think-bubble { animation: ethelThinkFloat 2s ease-in-out infinite; }
        .ethel-glow { animation: ethelGlow 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ethel-think-bubble, .ethel-glow { animation: none !important; }
        }
      `}</style>

      {/* layered contact shadow gives the character a place in the room */}
      <div
        ref={shadowRef}
        className="absolute bottom-1 left-1/2 h-[7%] w-[52%] -translate-x-1/2 rounded-full bg-black/45 blur-md"
      />
      <div className="absolute bottom-2 left-1/2 h-[2.8%] w-[34%] -translate-x-1/2 rounded-full bg-emerald-950/70 blur-sm" />

      {/* soft rim light separates Tinashe from the darker lab */}
      <div className="ethel-glow pointer-events-none absolute inset-3 rounded-full bg-[radial-gradient(circle_at_42%_40%,rgba(167,243,208,.26),rgba(16,185,129,.12)_44%,transparent_70%)] blur-xl" />

      <svg
        viewBox="0 0 256 256"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Tinashe, a friendly green lab partner, speaking and gesturing"
      >
        <defs>
          <radialGradient id={`${svgId}-skin`} cx="34%" cy="23%" r="82%">
            <stop offset="0%" stopColor="#b9f6d7" />
            <stop offset="31%" stopColor="#61d8a5" />
            <stop offset="72%" stopColor="#15966d" />
            <stop offset="100%" stopColor="#087052" />
          </radialGradient>
          <linearGradient id={`${svgId}-skin-side`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#86e7bd" />
            <stop offset="56%" stopColor="#22aa79" />
            <stop offset="100%" stopColor="#076448" />
          </linearGradient>
          <radialGradient id={`${svgId}-belly`} cx="38%" cy="24%" r="78%">
            <stop offset="0%" stopColor="#d6fae8" stopOpacity=".85" />
            <stop offset="55%" stopColor="#91e8be" stopOpacity=".68" />
            <stop offset="100%" stopColor="#46b98a" stopOpacity=".3" />
          </radialGradient>
          <radialGradient id={`${svgId}-cheek`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fb9cae" stopOpacity=".58" />
            <stop offset="100%" stopColor="#fb9cae" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${svgId}-eye`} cx="38%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="78%" stopColor="#eefcf5" />
            <stop offset="100%" stopColor="#b9ddcd" />
          </radialGradient>
          <radialGradient id={`${svgId}-iris`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#65f3bd" />
            <stop offset="58%" stopColor="#087e60" />
            <stop offset="100%" stopColor="#034537" />
          </radialGradient>
          <linearGradient id={`${svgId}-horn`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d9fff0" />
            <stop offset="48%" stopColor="#69d7ad" />
            <stop offset="100%" stopColor="#147a5a" />
          </linearGradient>
          <linearGradient id={`${svgId}-mouth`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b1028" />
            <stop offset="100%" stopColor="#140914" />
          </linearGradient>
          <linearGradient id={`${svgId}-tongue`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be3158" />
          </linearGradient>
          <filter id={`${svgId}-soft-shadow`} x="-35%" y="-35%" width="170%" height="180%">
            <feDropShadow dx="1.8" dy="4" stdDeviation="3.2" floodColor="#011e16" floodOpacity=".48" />
          </filter>
          <filter id={`${svgId}-face-depth`} x="-20%" y="-20%" width="140%" height="145%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#064e3b" floodOpacity=".34" />
          </filter>
          <clipPath id={`${svgId}-eye-l`}>
            <ellipse cx="110" cy="89" rx="13.5" ry="15" />
          </clipPath>
          <clipPath id={`${svgId}-eye-r`}>
            <ellipse cx="146" cy="89" rx="13.5" ry="15" />
          </clipPath>
          <clipPath id={`${svgId}-mouth-clip`}>
            <path ref={mouthClipRef} d="M108 112 Q128 116 148 112 Q138 116 128 117 Q118 116 108 112 Z" />
          </clipPath>
        </defs>

        {/* legs and feet stay planted — only the upper body carries the bob */}
        <path d="M104 200 C101 214 101 224 106 229 C111 233 120 231 121 224 L122 200 Z" fill={skinSide} stroke="#075e46" strokeWidth="2" />
        <path d="M134 200 L135 224 C136 231 145 233 150 229 C155 224 155 214 152 200 Z" fill={skinSide} stroke="#075e46" strokeWidth="2" />
        <path d="M104 224 C93 228 91 237 101 240 C109 242 124 240 127 233 C128 227 119 223 113 224 Z" fill={skin} stroke="#064e3b" strokeWidth="2" filter={`url(#${svgId}-soft-shadow)`} />
        <path d="M143 224 C137 223 128 227 129 233 C132 240 147 242 155 240 C165 237 163 228 152 224 Z" fill={skinSide} stroke="#064e3b" strokeWidth="2" filter={`url(#${svgId}-soft-shadow)`} />
        <path d="M99 234 Q106 231 112 236 M114 236 Q121 231 127 234" fill="none" stroke="#b9f6d7" strokeOpacity=".5" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M131 234 Q138 231 144 236 M146 236 Q153 231 159 234" fill="none" stroke="#9aeac7" strokeOpacity=".42" strokeWidth="1.5" strokeLinecap="round" />

        <g ref={rootRef}>
          {/* viewer-left arm, behind the torso */}
          <g ref={lArmRef} transform="translate(94 145)">
            <path
              d="M-8.4 -6 C-11.4 5 -10.4 17 -8.4 26 C-3.4 29.4 3.4 29.4 8.4 26 C10.4 17 11.4 5 8.4 -6 C3.4 -9.4 -3.4 -9.4 -8.4 -6 Z"
              fill={skinSide}
              stroke="#075e46"
              strokeWidth="2"
            />
            <g ref={lForeRef} transform="translate(0 26)">
              <path
                d="M-7.2 -5 C-9.4 5 -8.4 15 -6.4 21 C-2.4 24 2.4 24 6.4 21 C8.4 15 9.4 5 7.2 -5 C2.4 -8 -2.4 -8 -7.2 -5 Z"
                fill={skinSide}
                stroke="#075e46"
                strokeWidth="1.9"
              />
              <Hand shape={handShape} svgId={svgId} mirror />
            </g>
          </g>

          {/* short neck tucked behind the head and torso */}
          <path d="M116 108 H140 V136 H116 Z" fill="#0d8562" opacity=".95" />

          {/* breathing torso */}
          <g ref={torsoRef} filter={`url(#${svgId}-soft-shadow)`}>
            <path
              d="M128 126 C104 126 92 137 89 152 C85 168 86 187 90 199 C95 211 110 216 128 216 C146 216 161 211 166 199 C170 187 171 168 167 152 C164 137 152 126 128 126 Z"
              fill={skin}
              stroke="#064e3b"
              strokeWidth="2.6"
            />
            <ellipse cx="128" cy="177" rx="26" ry="29" fill={`url(#${svgId}-belly)`} stroke="#50c795" strokeOpacity=".4" strokeWidth="1.3" />
            <path d="M98 141 C104 133 112 129 121 128 C106 137 99 152 98 170 C94 160 94 149 98 141 Z" fill="#e5fff3" opacity=".22" />
            <path d="M162 146 C170 166 167 190 154 203 C165 195 170 181 170 166 C170 158 167 152 162 146 Z" fill="#045f46" opacity=".2" />
            {/* head occlusion keeps the neck from reading as a flat sticker */}
            <ellipse cx="128" cy="130" rx="27" ry="8" fill="#04352a" opacity=".22" />
          </g>

          {/* head — rolls, turns and pitches as one unit */}
          <g ref={headRef}>
            {/* ear fins */}
            <path d="M86 82 C70 74 61 80 63 91 C66 101 78 104 90 98 Z" fill={skinSide} stroke="#075e46" strokeWidth="1.7" />
            <path d="M170 82 C186 74 195 80 193 91 C190 101 178 104 166 98 Z" fill={skinSide} stroke="#075e46" strokeWidth="1.7" />

            {/* soft antennae with ball tips — they lag the head for free
                secondary motion instead of being rigid horns */}
            <g ref={antennaLeftRef}>
              <path d="M112 54 C109 44 108 36 110 29" fill="none" stroke="#12855f" strokeWidth="4.4" strokeLinecap="round" />
              <circle cx="110" cy="26" r="5.6" fill={`url(#${svgId}-horn)`} stroke="#076047" strokeWidth="1.5" />
              <ellipse cx="108.4" cy="24" rx="1.9" ry="1.3" fill="#effff8" opacity=".8" />
            </g>
            <g ref={antennaRightRef}>
              <path d="M144 54 C147 44 148 36 146 29" fill="none" stroke="#12855f" strokeWidth="4.4" strokeLinecap="round" />
              <circle cx="146" cy="26" r="5.6" fill={`url(#${svgId}-horn)`} stroke="#076047" strokeWidth="1.5" />
              <ellipse cx="144.4" cy="24" rx="1.9" ry="1.3" fill="#effff8" opacity=".8" />
            </g>

            <ellipse cx="128" cy="88" rx="45" ry="42" fill={skin} stroke="#064e3b" strokeWidth="2.6" filter={`url(#${svgId}-soft-shadow)`} />
            <path d="M94 62 C102 50 114 45 126 49 C108 55 97 68 94 84 C90 76 91 68 94 62 Z" fill="#e5fff3" opacity=".26" />
            <path d="M166 68 C173 84 170 104 158 116 C169 110 174 96 173 84 C173 78 170 72 166 68 Z" fill="#045f46" opacity=".18" />

            {/* face — parallax-shifted a couple of px so head turns read as 3d */}
            <g ref={faceRef}>
              <circle cx="100" cy="104" r="14" fill={`url(#${svgId}-cheek)`} />
              <circle cx="156" cy="104" r="14" fill={`url(#${svgId}-cheek)`} />

              {happyEyes ? (
                <>
                  <path d="M98 92 Q110 80 122 92" stroke="#073f32" strokeWidth="4.2" fill="none" strokeLinecap="round" />
                  <path d="M134 92 Q146 80 158 92" stroke="#073f32" strokeWidth="4.2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <g filter={`url(#${svgId}-face-depth)`}>
                  <g clipPath={`url(#${svgId}-eye-l)`}>
                    <ellipse cx="110" cy="89" rx="13.5" ry="15" fill={`url(#${svgId}-eye)`} />
                    <g ref={gazeLeftRef}>
                      <circle cx="112" cy="91" r="7.8" fill={`url(#${svgId}-iris)`} />
                      <circle cx="112" cy="91" r="3.6" fill="#021c16" />
                      <circle cx="108.9" cy="87.4" r="2.5" fill="white" />
                      <circle cx="114.4" cy="94" r="1" fill="#cffff0" opacity=".75" />
                    </g>
                    <g ref={lidLeftRef}>
                      <path d="M92 44 H128 V68 Q110 76 92 68 Z" fill={skin} />
                      <path d="M92 68 Q110 76 128 68" fill="none" stroke="#0b6b50" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                  </g>
                  <g clipPath={`url(#${svgId}-eye-r)`}>
                    <ellipse cx="146" cy="89" rx="13.5" ry="15" fill={`url(#${svgId}-eye)`} />
                    <g ref={gazeRightRef}>
                      <circle cx="148" cy="91" r="7.8" fill={`url(#${svgId}-iris)`} />
                      <circle cx="148" cy="91" r="3.6" fill="#021c16" />
                      <circle cx="144.9" cy="87.4" r="2.5" fill="white" />
                      <circle cx="150.4" cy="94" r="1" fill="#cffff0" opacity=".75" />
                    </g>
                    <g ref={lidRightRef}>
                      <path d="M128 44 H164 V68 Q146 76 128 68 Z" fill={skin} />
                      <path d="M128 68 Q146 76 164 68" fill="none" stroke="#0b6b50" strokeWidth="1.6" strokeLinecap="round" />
                    </g>
                  </g>
                  <ellipse cx="110" cy="89" rx="13.5" ry="15" fill="none" stroke="#0b6b50" strokeWidth="1.2" />
                  <ellipse cx="146" cy="89" rx="13.5" ry="15" fill="none" stroke="#0b6b50" strokeWidth="1.2" />
                </g>
              )}

              {/* brows ride with speech and expression */}
              <g ref={browRef}>
                <path d="M97 67 Q110 59.5 123 66.5" fill="none" stroke="#075a43" strokeWidth="2.9" strokeLinecap="round" />
                <path d="M133 66.5 Q146 59.5 159 67" fill="none" stroke="#075a43" strokeWidth="2.9" strokeLinecap="round" />
              </g>

              {/* muzzle and nostrils */}
              <path d="M128 98 C125 103 124 108 128 110 C132 108 131 103 128 98 Z" fill="#39b181" opacity=".5" />
              <ellipse cx="123.6" cy="109" rx="2" ry="1.3" fill="#07503e" opacity=".7" />
              <ellipse cx="132.4" cy="109" rx="2" ry="1.3" fill="#07503e" opacity=".7" />

              {/* mouth — the path is rebuilt every frame from the jaw value */}
              <g filter={`url(#${svgId}-face-depth)`}>
                <path
                  ref={mouthRef}
                  d="M108 112 Q128 116 148 112 Q138 116 128 117 Q118 116 108 112 Z"
                  fill={`url(#${svgId}-mouth)`}
                  stroke="#063f32"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <g clipPath={`url(#${svgId}-mouth-clip)`}>
                  <ellipse ref={tongueRef} cx="128" cy="116" rx="12" ry="2.6" fill={`url(#${svgId}-tongue)`} opacity="0" />
                  <path ref={teethRef} d="M110 112 Q128 115 146 112 L146 117 Q128 120 110 117 Z" fill="#fffdf1" opacity=".35" />
                </g>
              </g>
            </g>
          </g>

          {/* viewer-right arm, in front — it can reach the chin and the face */}
          <g ref={rArmRef} transform="translate(162 145)">
            <path
              d="M-8.4 -6 C-11.4 5 -10.4 17 -8.4 26 C-3.4 29.4 3.4 29.4 8.4 26 C10.4 17 11.4 5 8.4 -6 C3.4 -9.4 -3.4 -9.4 -8.4 -6 Z"
              fill={skin}
              stroke="#075e46"
              strokeWidth="2"
            />
            <g ref={rForeRef} transform="translate(0 26)">
              <path
                d="M-7.2 -5 C-9.4 5 -8.4 15 -6.4 21 C-2.4 24 2.4 24 6.4 21 C8.4 15 9.4 5 7.2 -5 C2.4 -8 -2.4 -8 -7.2 -5 Z"
                fill={skin}
                stroke="#075e46"
                strokeWidth="1.9"
              />
              <Hand shape={handShape} svgId={svgId} />
            </g>
          </g>
        </g>
      </svg>

      {/* thought bubbles for "think" gesture */}
      {gesture === "think" && (
        <div className="ethel-think-bubble pointer-events-none absolute -top-3 right-2 flex flex-col items-end gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-200/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-200/70" />
          <span className="h-5 w-5 rounded-full border border-emerald-200/60 bg-emerald-900/40" />
        </div>
      )}

      {/* little "ha ha" marks for the "laugh" gesture */}
      {gesture === "laugh" && (
        <div className="pointer-events-none absolute -top-2 right-0 flex gap-1 text-emerald-200/80">
          <span className="text-lg font-black">ha</span>
          <span className="text-sm font-black opacity-70">ha</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Low-cost lab backdrop — code-native shapes only, kept deliberately soft so
   the character and captions remain the visual and accessibility focus.
--------------------------------------------------------------------------- */
function IntroLabBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* tiled back wall and ceiling wash */}
      <div
        className="absolute inset-x-0 top-0 h-[68%] opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(110,231,183,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(110,231,183,.045) 1px,transparent 1px),linear-gradient(180deg,#0a251c 0%,#071a14 100%)",
          backgroundSize: "54px 42px,54px 42px,100% 100%",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-emerald-100/[.035] to-transparent" />

      {/* ceiling light panels */}
      <div className="absolute left-[14%] top-3 h-2 w-28 -skew-x-12 rounded-full bg-emerald-100/25 shadow-[0_0_28px_rgba(167,243,208,.2)] sm:w-44" />
      <div className="absolute right-[12%] top-3 h-2 w-24 skew-x-12 rounded-full bg-emerald-100/20 shadow-[0_0_28px_rgba(167,243,208,.16)] sm:w-40" />

      {/* frosted laboratory window with quiet exterior light */}
      <div className="absolute right-[7%] top-[15%] hidden h-28 w-48 overflow-hidden rounded-sm border-[5px] border-[#173a2e]/80 bg-gradient-to-br from-cyan-100/10 via-emerald-100/[.045] to-slate-950/20 opacity-45 shadow-[inset_0_0_26px_rgba(167,243,208,.08),0_5px_25px_rgba(0,0,0,.25)] sm:block">
        <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-[#173a2e]/85" />
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[#173a2e]/85" />
        <div className="absolute -right-4 -top-5 h-20 w-20 rounded-full bg-emerald-100/10 blur-xl" />
        <div className="absolute bottom-2 left-4 h-9 w-2 rounded-t-full bg-emerald-950/50" />
        <div className="absolute bottom-2 left-7 h-14 w-3 rounded-t-full bg-emerald-950/40" />
      </div>

      {/* distant glassware bench */}
      <svg className="absolute bottom-[28%] left-[-2.5rem] hidden h-40 w-64 opacity-45 md:block" viewBox="0 0 260 160">
        <rect x="0" y="112" width="248" height="10" rx="2" fill="#456b5c" />
        <rect x="16" y="121" width="8" height="39" fill="#173d30" />
        <rect x="220" y="121" width="8" height="39" fill="#173d30" />
        <path d="M38 44 V89 L25 111 H72 L58 89 V44" fill="#5ee6ba" fillOpacity=".13" stroke="#86e8c7" strokeOpacity=".55" strokeWidth="2" />
        <path d="M30 101 Q48 91 67 101 L72 111 H25 Z" fill="#28c99a" fillOpacity=".35" />
        <path d="M103 54 V78 L84 111 H139 L120 78 V54" fill="#7de7c5" fillOpacity=".11" stroke="#a7f3d0" strokeOpacity=".45" strokeWidth="2" />
        <path d="M89 102 Q111 91 134 102 L139 111 H84 Z" fill="#38bdf8" fillOpacity=".24" />
        <rect x="164" y="47" width="23" height="64" rx="7" fill="#67e8f9" fillOpacity=".1" stroke="#a5f3fc" strokeOpacity=".42" strokeWidth="2" />
        <path d="M165 87 H186 V105 Q176 111 165 105 Z" fill="#fbbf24" fillOpacity=".25" />
      </svg>

      {/* distant instrument screen */}
      <div className="absolute bottom-[38%] right-[3%] hidden w-48 rounded-lg border border-emerald-200/10 bg-[#061510]/70 p-2 opacity-50 shadow-2xl md:block">
        <div className="mb-2 flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-300/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300/60" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/60" />
        </div>
        <svg viewBox="0 0 180 58" className="h-14 w-full rounded bg-emerald-950/60">
          <path d="M3 40 C20 40 20 18 37 24 S58 47 75 35 S97 13 115 26 S142 45 177 14" fill="none" stroke="#6ee7b7" strokeOpacity=".62" strokeWidth="2" />
          <path d="M3 47 H177 M3 30 H177 M3 13 H177" stroke="#6ee7b7" strokeOpacity=".08" />
        </svg>
      </div>

      {/* floor plane and perspective seams */}
      <div className="absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-b from-[#0a2119] to-[#020a08]" />
      <div
        className="absolute inset-x-0 bottom-0 h-[34%] opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(90deg,transparent 49.7%,rgba(110,231,183,.2) 50%,transparent 50.3%),repeating-linear-gradient(0deg,transparent 0 38px,rgba(110,231,183,.1) 39px 40px)",
          transform: "perspective(340px) rotateX(58deg) scale(1.45)",
          transformOrigin: "bottom center",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_34%,rgba(1,8,6,.55)_100%)]" />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Speech panel — typewriter text beside Tinashe with a beat progress trail.
   Typing speed is passed in from actual audio duration when known.
--------------------------------------------------------------------------- */
function SpeechPanel({
  text,
  index,
  total,
  targetDurationMs,
  fallbackDurationMs,
  wordCues,
  playbackMode,
  audioTimeMs,
}: {
  text: string;
  index: number;
  total: number;
  targetDurationMs: number | null;
  fallbackDurationMs: number;
  wordCues?: readonly WordCue[];
  playbackMode: PlaybackMode;
  audioTimeMs: number;
}) {
  const { shown, done } = useTypewriter({
    text,
    targetDurationMs,
    fallbackDurationMs,
    wordCues,
    playbackMode,
    audioTimeMs,
  });

  return (
    <div className="tinashe-speech-panel relative w-full min-w-0 max-w-2xl flex-1">
      <style>{`
        @keyframes speechIn {
          from { opacity: 0; transform: translate3d(-14px, 8px, 0) scale(.97); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes caretBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes voiceGlow {
          0%, 100% { opacity: .55; transform: scale(.85); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tinashe-voice-dot { animation: none !important; }
        }
        @media (orientation: landscape) and (max-height: 520px) {
          .tinashe-intro-shell { padding-block: .75rem !important; }
          .tinashe-intro-layout {
            min-height: 100%;
            flex-direction: row !important;
            align-items: flex-end !important;
            gap: 1rem !important;
          }
          .tinashe-intro-figure {
            width: min(39vw, 58vh) !important;
            height: min(39vw, 58vh) !important;
          }
          .tinashe-speech-bubble {
            min-height: 7.5rem !important;
            padding: .9rem 1.15rem !important;
          }
          .tinashe-speech-copy {
            font-size: clamp(.88rem, 2.25vw, 1.1rem) !important;
            line-height: 1.4 !important;
          }
          .tinashe-tail-top { display: none !important; }
          .tinashe-tail-side { display: block !important; }
        }
      `}</style>

      {/* Layered tails give the bubble thickness from both responsive layouts. */}
      <div className="tinashe-tail-top absolute -top-3 left-1/2 z-10 h-6 w-6 -translate-x-1/2 rotate-45 rounded-[5px] border-l border-t border-emerald-100/35 bg-gradient-to-br from-[#1c493a] to-[#102a20] shadow-[-5px_-5px_14px_rgba(0,0,0,.22)] sm:hidden" />
      <div className="tinashe-tail-side absolute -left-3 top-14 z-10 hidden h-7 w-7 rotate-45 rounded-[6px] border-b border-l border-emerald-100/35 bg-gradient-to-tr from-[#102a20] to-[#1b4436] shadow-[-7px_7px_18px_rgba(0,0,0,.34)] sm:block" />

      <div
        key={index}
        className="tinashe-speech-bubble relative isolate flex min-h-[10.5rem] flex-col justify-center overflow-hidden rounded-[2rem] border border-emerald-100/35 bg-[linear-gradient(145deg,rgba(27,72,57,.97)_0%,rgba(9,31,23,.98)_62%,rgba(3,16,12,.99)_100%)] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,.18),inset_0_-18px_34px_rgba(0,0,0,.24),0_22px_60px_rgba(0,0,0,.45),0_0_38px_rgba(16,185,129,.16)] backdrop-blur-xl sm:px-8 sm:py-7"
        style={{ animation: "speechIn .38s cubic-bezier(.2,.8,.2,1) both" }}
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-100/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-36 w-52 rounded-full bg-emerald-500/[.07] blur-3xl" />
        <div className="pointer-events-none absolute inset-[5px] rounded-[1.7rem] border border-white/[.045]" />

        <div className="relative mb-3 flex items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100/20 bg-white/[.065] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_5px_16px_rgba(0,0,0,.16)]">
            <span
              className="tinashe-voice-dot h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_11px_rgba(110,231,183,.9)]"
              style={{ animation: playbackMode === "audio" ? "voiceGlow .8s ease-in-out infinite" : "none" }}
            />
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-emerald-100/80">
              Tinashe
            </span>
          </div>
        </div>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {text}
        </span>
        <p
          className="tinashe-speech-copy relative min-h-[3.2em] text-[clamp(1rem,1.7vw,1.45rem)] font-semibold leading-[1.55] text-emerald-50 [text-shadow:0_2px_12px_rgba(0,0,0,.42)]"
          aria-hidden="true"
        >
          {shown}
          {!done && <span style={{ animation: "caretBlink 0.8s step-start infinite" }}>▍</span>}
        </p>
        <div className="pointer-events-none absolute inset-x-10 bottom-1.5 h-px bg-gradient-to-r from-transparent via-emerald-100/10 to-transparent" />
      </div>

      {/* beat progress dots */}
      {total > 1 && (
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-emerald-300" : i < index ? "w-1.5 bg-emerald-300/60" : "w-1.5 bg-emerald-300/15"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Main export — EthelIntro
   Advances beats based on the actual audio clip finishing (onended), with a
   fallback timer in case a clip fails to load or play (e.g. autoplay block).
   Tracks real audio duration (for typewriter sync) and play state (for the
   mouth) via the audio element's own events.
   ============================================================================ */
export function EthelIntro({
  onComplete,
  experiment,
}: {
  onComplete?: () => void;
  experiment?: ExperimentRecord;
}) {
  const { script, ready } = useVisitorScript();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>("pending");
  const [audioTimeMs, setAudioTimeMs] = useState(0);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const finishedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const advancedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsTalking(false);
    setLeaving(true);
    window.setTimeout(() => onComplete?.(), 400);
  }, [onComplete]);

  const advance = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setIndex((i) => {
      if (i + 1 < script.length) return i + 1;
      finish();
      return i;
    });
  }, [script.length, finish]);

  // (re)start playback + fallback timer whenever the beat changes
  useEffect(() => {
    if (!ready) return;
    advancedRef.current = false;
    setDurationMs(null);
    setAudioTimeMs(0);
    setPlaybackMode("pending");
    const beat = script[index];
    if (!beat) return;
    let cancelled = false;
    let fallbackTalkTimer = 0;

    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);

    const audioEl = audioRef.current;
    if (audioEl) {
      audioEl.src = beat.audioSrc;
      audioEl.currentTime = 0;
      audioEl.play().catch(() => {
        if (cancelled) return;
        // autoplay blocked or file missing — fall back to a fixed hold,
        // and drive the mouth with a synthetic "talking" window instead
        setPlaybackMode("fallback");
        setIsTalking(true);
        fallbackTalkTimer = window.setTimeout(() => setIsTalking(false), beat.fallbackHoldMs);
        fallbackTimerRef.current = window.setTimeout(advance, beat.fallbackHoldMs);
      });
    } else {
      setPlaybackMode("fallback");
      setIsTalking(true);
      fallbackTalkTimer = window.setTimeout(() => setIsTalking(false), beat.fallbackHoldMs);
      fallbackTimerRef.current = window.setTimeout(advance, beat.fallbackHoldMs);
    }

    // hard safety net: never get stuck longer than fallbackHoldMs + 3s
    const safetyTimer = window.setTimeout(advance, beat.fallbackHoldMs + 3000);

    return () => {
      cancelled = true;
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      if (fallbackTalkTimer) window.clearTimeout(fallbackTalkTimer);
      window.clearTimeout(safetyTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, index, script]);

  // requestAnimationFrame reads the media element's clock directly, so visual
  // timing remains correct after buffering, a slow frame, or a resumed tab.
  useEffect(() => {
    if (playbackMode !== "audio") return;

    let frame = 0;
    const updateAudioClock = () => {
      const audioEl = audioRef.current;
      if (!audioEl) return;
      setAudioTimeMs(audioEl.currentTime * 1000);
      if (!audioEl.paused && !audioEl.ended) {
        frame = window.requestAnimationFrame(updateAudioClock);
      }
    };

    frame = window.requestAnimationFrame(updateAudioClock);
    return () => window.cancelAnimationFrame(frame);
  }, [index, playbackMode]);

  const handleLoadedMetadata = useCallback(() => {
    const audioEl = audioRef.current;
    if (audioEl && Number.isFinite(audioEl.duration)) {
      setDurationMs(audioEl.duration * 1000);
    }
  }, []);

  const skip = useCallback(() => {
    audioRef.current?.pause();
    finish();
  }, [finish]);

  if (!ready) return null;

  const beat = script[index];
  const mascotIsSpeaking =
    playbackMode === "audio" && beat.wordCues?.length
      ? isTalking &&
        beat.wordCues.some(
          (cue) => audioTimeMs >= cue.startMs - 45 && audioTimeMs <= cue.endMs + 55,
        )
      : isTalking;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Introduction from Tinashe, your lab partner"
      className={`tinashe-intro-shell absolute inset-0 z-[200] flex items-center justify-center overflow-x-hidden overflow-y-auto overscroll-contain bg-[#04120d] px-4 py-10 text-white transition-opacity duration-400 sm:px-6 sm:py-8 lg:px-10 lg:py-12 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <IntroLabBackdrop />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(16,185,129,.15),transparent_55%),radial-gradient(circle_at_75%_30%,rgba(52,211,153,.09),transparent_50%)]" />

      <div className="tinashe-intro-layout relative z-10 flex min-h-full w-full max-w-6xl flex-col items-center justify-center gap-4 sm:flex-row sm:items-end sm:gap-6 lg:gap-12">
        <EthelFigure gesture={beat.gesture} isTalking={mascotIsSpeaking} />
        <div className="flex w-full min-w-0 max-w-2xl flex-1 flex-col gap-4">
          {experiment && (
            <section className="rounded-2xl border border-emerald-100/25 bg-emerald-950/75 px-5 py-4 shadow-xl backdrop-blur-sm sm:px-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                {experiment.level} {experiment.subject} · {experiment.resourceType ?? "Interactive experiment"}
              </p>
              <h1 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                {experiment.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-emerald-50/90">
                {experiment.description}
              </p>
              <p className="mt-2 text-xs leading-5 text-emerald-100/75">
                Follow the on-screen procedure, record your observations or measurements, compare the result with the expected relationship, and review possible sources of error. In a physical laboratory, follow your teacher&apos;s instructions and the stated safety precautions.
              </p>
            </section>
          )}
          <SpeechPanel
            text={beat.text}
            index={index}
            total={script.length}
            targetDurationMs={durationMs}
            fallbackDurationMs={beat.fallbackHoldMs}
            wordCues={beat.wordCues}
            playbackMode={playbackMode}
            audioTimeMs={audioTimeMs}
          />
        </div>
      </div>

      {/* hidden audio element, source swapped per beat */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          setAudioTimeMs(audioRef.current?.currentTime ? audioRef.current.currentTime * 1000 : 0);
          setPlaybackMode("audio");
          setIsTalking(true);
        }}
        onPause={() => setIsTalking(false)}
        onEnded={() => {
          const audioEl = audioRef.current;
          if (audioEl && Number.isFinite(audioEl.duration)) {
            setAudioTimeMs(audioEl.duration * 1000);
          }
          setIsTalking(false);
          advance();
        }}
        className="hidden"
      />

      <button
        onClick={skip}
        aria-label="Skip Tinashe's introduction"
        className="absolute right-4 top-4 z-20 rounded-full border border-emerald-300/25 bg-emerald-900/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-100/80 backdrop-blur transition hover:bg-emerald-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:right-5 sm:top-5"
      >
        Skip
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Back-compat wrappers, so existing page imports keep working
--------------------------------------------------------------------------- */
export function ExperimentSceneLoader({ onComplete }: { label?: string; onComplete?: () => void }) {
  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return null;
}

export function ExperimentSceneGate({
  children,
  label: _label,
}: {
  children: ReactNode;
  label?: string;
}) {
  // Every practical is mounted inside this gate, so it is the one place that can
  // guarantee no looping effect (rolling wheels, a burner, bubbling) is left
  // running after the learner navigates away.
  useEffect(() => () => labSounds.stopAll(), []);

  return (
    <div className="relative h-full min-h-0 w-full">
      {children}
    </div>
  );
}
