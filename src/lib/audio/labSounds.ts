/**
 * Sound effects for the 3D practicals.
 *
 * This is deliberately separate from `experimentNarrator`: the narrator owns one
 * element and only ever plays one voice clip at a time, while effects are short,
 * overlapping and fire-and-forget.
 *
 * Every effect below maps to one file under `public/sounds/lab/`. A missing file
 * is not an error — `play()` swallows the failure — so the experiments keep
 * working while the recordings are still being collected. See
 * `docs/LAB_SOUND_ASSETS.md` for what each file should contain.
 */

export const LAB_SOUND_BASE = "/sounds/lab";

/** Every effect the practicals can ask for, and the file that provides it. */
export const LAB_SOUNDS = {
  /* -------------------------------------------------- interface and progress */
  uiClick: "ui-click.mp3",
  uiToggle: "ui-toggle.mp3",
  panelOpen: "panel-open.mp3",
  stepComplete: "step-complete.mp3",
  experimentComplete: "experiment-complete.mp3",
  readingRecorded: "reading-recorded.mp3",
  errorBuzz: "error-buzz.mp3",

  /* -------------------------------------------------------- trolleys and carts */
  trolleyRoll: "trolley-roll.mp3",
  trolleyRelease: "trolley-release.mp3",
  trolleyCollisionSoft: "trolley-collision-soft.mp3",
  trolleyCollisionHard: "trolley-collision-hard.mp3",
  trolleyStop: "trolley-stop.mp3",
  tickerTimer: "ticker-timer.mp3",
  lightGateBeep: "light-gate-beep.mp3",

  /* --------------------------------------------------------------- mechanics */
  springStretch: "spring-stretch.mp3",
  massHooked: "mass-hooked.mp3",
  pendulumSwing: "pendulum-swing.mp3",
  objectDropSoft: "object-drop-soft.mp3",
  objectDropMetal: "object-drop-metal.mp3",
  pulleyRatchet: "pulley-ratchet.mp3",
  ruleBalanceClick: "rule-balance-click.mp3",

  /* ------------------------------------------------------- liquids and glass */
  waterPour: "water-pour.mp3",
  waterSplash: "water-splash.mp3",
  dropletDrip: "droplet-drip.mp3",
  glassClink: "glass-clink.mp3",
  bubbleRelease: "bubble-release.mp3",
  stirring: "stirring.mp3",
  tapSqueak: "tap-squeak.mp3",

  /* ----------------------------------------------------------- heat and gas */
  bunsenIgnite: "bunsen-ignite.mp3",
  bunsenFlame: "bunsen-flame.mp3",
  waterBoil: "water-boil.mp3",
  gasHiss: "gas-hiss.mp3",
  pumpStroke: "pump-stroke.mp3",

  /* ------------------------------------------------- electricity and magnets */
  switchClick: "switch-click.mp3",
  currentHum: "current-hum.mp3",
  lampOn: "lamp-on.mp3",
  sparkDischarge: "spark-discharge.mp3",
  magnetSnap: "magnet-snap.mp3",
  magnetSlide: "magnet-slide.mp3",
  compassSettle: "compass-settle.mp3",

  /* ------------------------------------------------------------- lab ambience */
  labAmbience: "lab-ambience.mp3",
  paperRustle: "paper-rustle.mp3",
  footstep: "footstep.mp3",
} as const;

export type LabSoundName = keyof typeof LAB_SOUNDS;

export function labSoundUrl(name: LabSoundName) {
  return `${LAB_SOUND_BASE}/${LAB_SOUNDS[name]}`;
}

export interface LabSoundOptions {
  /** 0–1, multiplied by the master volume. */
  volume?: number;
  /** Playback rate — handy for pitching a collision up as speed rises. */
  rate?: number;
  /** Loop until `stop()` is called. Looping sounds are one-per-name. */
  loop?: boolean;
  /**
   * Ignore the request if the same effect started less than this many
   * milliseconds ago. Stops rapid triggers turning into a machine-gun.
   */
  throttleMs?: number;
}

type Pool = { elements: HTMLAudioElement[]; next: number };

/**
 * Small pooled player. Each effect keeps a handful of audio elements so the same
 * sound can overlap with itself (two trolleys colliding, several bubbles) rather
 * than restarting and cutting itself off.
 */
class LabSoundPlayer {
  private pools = new Map<LabSoundName, Pool>();
  private loops = new Map<LabSoundName, HTMLAudioElement>();
  private lastPlayed = new Map<LabSoundName, number>();
  private masterVolume = 0.7;
  private muted = false;

  /** Browsers block audio until the user has interacted with the page. */
  private unlocked = false;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.stopAll();
  }

  isMuted() {
    return this.muted;
  }

  setVolume(volume: number) {
    this.masterVolume = Math.min(1, Math.max(0, volume));
  }

  getVolume() {
    return this.masterVolume;
  }

  /** Call from any user gesture; after this, effects are allowed to sound. */
  unlock() {
    this.unlocked = true;
  }

  private pool(name: LabSoundName, size: number) {
    let pool = this.pools.get(name);
    if (!pool) {
      const url = labSoundUrl(name);
      pool = {
        elements: Array.from({ length: size }, () => {
          const audio = new Audio(url);
          audio.preload = "auto";
          return audio;
        }),
        next: 0,
      };
      this.pools.set(name, pool);
    }
    return pool;
  }

  play(name: LabSoundName, options: LabSoundOptions = {}) {
    if (this.muted || typeof window === "undefined") return;

    const now = performance.now();
    if (options.throttleMs) {
      const last = this.lastPlayed.get(name) ?? -Infinity;
      if (now - last < options.throttleMs) return;
    }
    this.lastPlayed.set(name, now);

    if (options.loop) {
      this.loop(name, options);
      return;
    }

    const pool = this.pool(name, 4);
    const audio = pool.elements[pool.next];
    pool.next = (pool.next + 1) % pool.elements.length;

    audio.loop = false;
    audio.volume = Math.min(1, Math.max(0, (options.volume ?? 1) * this.masterVolume));
    audio.playbackRate = options.rate ?? 1;
    try {
      audio.currentTime = 0;
    } catch {
      /* Not yet seekable — playing from wherever it is is fine for an effect. */
    }
    void audio.play().catch(() => {
      /* Missing file, or the page has not been interacted with yet. */
    });
  }

  /** Start (or update) a looping sound such as rolling wheels or a flame. */
  loop(name: LabSoundName, options: LabSoundOptions = {}) {
    if (this.muted || typeof window === "undefined") return;

    let audio = this.loops.get(name);
    if (!audio) {
      audio = new Audio(labSoundUrl(name));
      audio.preload = "auto";
      audio.loop = true;
      this.loops.set(name, audio);
    }
    audio.volume = Math.min(1, Math.max(0, (options.volume ?? 1) * this.masterVolume));
    audio.playbackRate = options.rate ?? 1;
    if (audio.paused) {
      void audio.play().catch(() => {
        /* Missing file, or autoplay is still blocked. */
      });
    }
  }

  /** Fade-free stop for a looping sound. */
  stop(name: LabSoundName) {
    const audio = this.loops.get(name);
    if (!audio) return;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {
      /* Nothing loaded yet. */
    }
  }

  stopAll() {
    this.loops.forEach((audio) => {
      audio.pause();
      try {
        audio.currentTime = 0;
      } catch {
        /* Nothing loaded yet. */
      }
    });
    this.pools.forEach((pool) => pool.elements.forEach((audio) => audio.pause()));
  }

  /** True once a user gesture has happened, so effects will actually sound. */
  isUnlocked() {
    return this.unlocked;
  }
}

export const labSounds = new LabSoundPlayer();

if (typeof window !== "undefined") {
  const unlock = () => labSounds.unlock();
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}
