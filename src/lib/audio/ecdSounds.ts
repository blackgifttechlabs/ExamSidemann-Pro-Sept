import { resolveEcdAudio } from "./ecdAudioAssets";
/**
 * Sound for the Yippie (ECD) welcome screen.
 *
 * Deliberately separate from `labSounds`: that player is keyed to files under
 * `/sounds/lab/` and tuned for overlapping practical effects, while this one
 * owns a single looping intro tune plus two short interface effects.
 *
 * Files live under `public/sounds/ecd/`. A missing file is not an error — every
 * `play()` swallows the failure — so the screen keeps working if an asset is
 * still being recorded.
 */

export const ECD_SOUND_BASE = "/sounds/ecd";

export const ECD_SOUNDS = {
  /** The tune that plays while the welcome question is on screen. */
  intro: "intros/toon-sound1.mp3",
  /** Fired on every button press. */
  buttonClick: "effects/buttonclick.mp3",
  /** Fired when the card swaps for the next one. */
  swipe: "effects/swipingsound.mp3",
  /** The ignition, heard once as the driving game opens. */
  carStart: "car/car-starting.mp3",
  /** The engine, looping under the driving game. */
  carMove: "car/car-moving.mp3",
  /** The bump when the car hits the wrong number. */
  carCrash: "car/car-crash.wav",

  /* ------------------------------------------------ the maths games.
     Every one of these is optional: a file that has not been found yet is
     simply silent. See `docs/ECD_MATHS_SOUND_ASSETS.md` for what to look for
     and where to save it. */
  /** A small bright pop, played on each object as it is counted. */
  countPop: "maths/effects/count-pop.mp3",
  /** A magic twinkle, for stars and for a wish coming true. */
  sparkle: "maths/effects/sparkle.mp3",
  /** Paper and ribbon: a present being opened. */
  presentOpen: "maths/effects/present-open.mp3",
  /** A comic little snore, looping under the sleeping Yippies. */
  snore: "maths/effects/snore.mp3",
  /** The squeaky yawn of a Yippie being woken up. */
  wakeUp: "maths/effects/wake-up.mp3",
  /** A springy boing as Hoppy jumps to the next lily pad. */
  hop: "maths/effects/hop.mp3",
  /** A small splash, for a hop that lands in the river. */
  splash: "maths/effects/splash.mp3",
  /** A glowing orb being picked up in the cave. */
  orb: "maths/effects/orb.mp3",
  /** A cage door swinging open and a happy cat let out. */
  cageOpen: "maths/effects/cage-open.mp3",
  /** Pencil on paper, looping while a number is being traced. */
  pencil: "maths/effects/pencil.mp3",
  /** The rocket leaving the pad at the end of a countdown. */
  rocket: "maths/effects/rocket.mp3",
  /** A wooden counter dropping into the ten frame. */
  counterDrop: "maths/effects/counter-drop.mp3",
  /** One friendly meow, for a freed cat. */
  meow: "maths/effects/meow.mp3",
} as const;

export type EcdSoundName = keyof typeof ECD_SOUNDS;

/**
 * How loud each effect sits by default, so the level lives in one place rather
 * than at every call site. The click is a constant companion — it fires on
 * every tap — so it is deliberately well under the sounds that carry meaning.
 */
const ECD_SOUND_VOLUME: Partial<Record<EcdSoundName, number>> = {
  buttonClick: 0.5,
  carStart: 0.6,
  carMove: 0.32,
  carCrash: 0.7,
  countPop: 0.55,
  sparkle: 0.5,
  presentOpen: 0.6,
  snore: 0.28,
  wakeUp: 0.6,
  hop: 0.55,
  splash: 0.5,
  orb: 0.5,
  cageOpen: 0.55,
  pencil: 0.3,
  rocket: 0.6,
  counterDrop: 0.5,
  meow: 0.55,
};

export const ecdSoundUrl = (name: EcdSoundName) => resolveEcdAudio(`${ECD_SOUND_BASE}/${ECD_SOUNDS[name]}`);

const MUTE_KEY = "yippie_muted";

type Pool = { elements: HTMLAudioElement[]; next: number };

class EcdSoundPlayer {
  private pools = new Map<EcdSoundName, Pool>();
  private loops = new Map<EcdSoundName, HTMLAudioElement>();
  private intro: HTMLAudioElement | null = null;
  private introWanted = false;
  private fade: ReturnType<typeof setInterval> | null = null;
  private gestureArmed = false;
  private muted = false;

  /**
   * The tune's level is three things multiplied together:
   *
   *  - `introVolume` — how loud the tune is at full strength.
   *  - `bedLevel`    — where it rests on the screen you are on. Out on the
   *                    topic list it plays properly; inside a topic it sits
   *                    right back so the activity is what you hear.
   *  - `duckedTo`    — where it goes while a line is being spoken, if at all.
   *
   * Every move between them is ramped, never stepped.
   */
  private introVolume = 0.55;
  private bedLevel = 1;
  private duckedTo: number | null = null;
  private duckRamp: ReturnType<typeof setInterval> | null = null;

  /**
   * How many mounted screens want the tune. The Yippie pages hand over to each
   * other, and React can mount the next screen before the previous one
   * unmounts (or the other way round), so a plain start/stop pair would either
   * cut the music off or leave it playing after the child has left. Counting
   * holders keeps it playing across the handover and stops it on the way out.
   */
  private holders = 0;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.muted = localStorage.getItem(MUTE_KEY) === "1";
      } catch {
        /* private browsing — default to sound on */
      }
    }
  }

  isMuted() {
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch {
      /* private browsing — the preference just will not persist */
    }
    if (muted) {
      this.loops.forEach((audio) => audio.pause());
      this.stopIntro({ fade: false });
    } else if (this.introWanted) {
      this.startIntro();
    }
  }

  private pool(name: EcdSoundName) {
    let pool = this.pools.get(name);
    if (!pool) {
      pool = {
        // Two elements so a quick double-tap does not cut itself off.
        elements: Array.from({ length: 2 }, () => {
          const audio = new Audio(ecdSoundUrl(name));
          audio.preload = "auto";
          return audio;
        }),
        next: 0,
      };
      this.pools.set(name, pool);
    }
    return pool;
  }

  /**
   * Slide the tune down under a spoken line, and back up afterwards.
   *
   * Narration is the point of these games — a child cannot pick out "/a/, ah,
   * ah" over a jaunty loop at full volume — so the music drops to a few percent
   * of its level while anyone is talking: present enough that the world has not
   * gone dead, quiet enough to be no competition for a phoneme. The move is
   * ramped rather than stepped so it reads as the music making way, not as a
   * glitch.
   */
  duckIntro(level = 0.04) {
    this.duckedTo = level;
    this.rampIntroTo(this.introVolume * level, 700);
  }

  restoreIntro() {
    this.duckedTo = null;
    this.rampIntroTo(this.introVolume * this.bedLevel, 900);
  }

  /**
   * Where the tune rests on the screen you are on, as a fraction of full.
   * Entering an activity slides it down over a second or so; leaving slides it
   * back up. A step would sound like a fault, so this never steps.
   */
  setIntroBed(level: number) {
    const next = Math.min(1, Math.max(0, level));
    if (next === this.bedLevel) return;
    this.bedLevel = next;
    // A line being spoken owns the level until it finishes; it will settle to
    // the new bed on its own.
    if (this.duckedTo === null) {
      this.rampIntroTo(this.introVolume * this.bedLevel, 1100);
    }
  }

  /** Ease the tune to a new level over `ms`, rather than jumping to it. */
  private rampIntroTo(target: number, ms = 900) {
    const audio = this.intro;
    if (!audio) return;

    if (this.duckRamp) {
      clearInterval(this.duckRamp);
      this.duckRamp = null;
    }

    const to = Math.min(1, Math.max(0, target));
    const from = audio.volume;
    if (Math.abs(to - from) < 0.002) {
      audio.volume = to;
      return;
    }

    const startedAt = Date.now();
    this.duckRamp = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / ms);
      // easeInOutQuad: no audible corner at either end of the slide
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      audio.volume = Math.min(1, Math.max(0, from + (to - from) * eased));
      if (progress >= 1 && this.duckRamp) {
        clearInterval(this.duckRamp);
        this.duckRamp = null;
      }
    }, 30);
  }

  /** Called on mount by any screen that wants the tune playing. */
  retainIntro() {
    this.holders += 1;
    this.startIntro();
  }

  /** Called on unmount; the tune stops once the last screen has let go. */
  releaseIntro() {
    this.holders = Math.max(0, this.holders - 1);
    if (this.holders === 0) this.stopIntro();
  }

  /**
   * Start an effect looping — an engine, a hum, anything that runs under a
   * screen rather than punctuating it. Calling it twice is harmless.
   */
  startLoop(name: EcdSoundName, volume = ECD_SOUND_VOLUME[name] ?? 1) {
    if (this.muted || typeof window === "undefined") return;

    let audio = this.loops.get(name);
    if (!audio) {
      audio = new Audio(ecdSoundUrl(name));
      audio.preload = "auto";
      audio.loop = true;
      this.loops.set(name, audio);
    }
    audio.volume = Math.min(1, Math.max(0, volume));
    if (audio.paused) {
      void audio.play().catch(() => {
        /* missing file, or autoplay is still blocked */
      });
    }
  }

  stopLoop(name: EcdSoundName) {
    const audio = this.loops.get(name);
    if (!audio) return;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {
      /* not seekable — pausing is enough */
    }
  }

  /**
   * Fire-and-forget effect.
   *
   * `onEnd` fires when the clip finishes — or straight away if it cannot play
   * at all, so a caller waiting to start the next sound is never left hanging
   * on a file that has not been recorded yet.
   */
  play(name: EcdSoundName, volume = ECD_SOUND_VOLUME[name] ?? 1, onEnd?: () => void) {
    if (this.muted || typeof window === "undefined") {
      onEnd?.();
      return;
    }

    const pool = this.pool(name);
    const audio = pool.elements[pool.next];
    pool.next = (pool.next + 1) % pool.elements.length;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      onEnd?.();
    };
    audio.onended = finish;
    audio.onerror = finish;

    audio.volume = Math.min(1, Math.max(0, volume));
    try {
      audio.currentTime = 0;
    } catch {
      /* not seekable yet — playing from wherever it is is fine for an effect */
    }
    void audio.play().catch(finish);
  }

  /**
   * Start the intro tune. Browsers block audio until the page has been
   * interacted with, so a rejected play arms a one-shot gesture listener and
   * tries again the moment the child touches the screen.
   */
  startIntro(volume = this.introVolume) {
    this.introWanted = true;
    this.introVolume = volume;
    if (this.muted || typeof window === "undefined") return;

    if (this.fade) {
      clearInterval(this.fade);
      this.fade = null;
    }

    if (!this.intro) {
      this.intro = new Audio(ecdSoundUrl("intro"));
      this.intro.preload = "auto";
      this.intro.loop = true;
    }
    this.intro.volume = Math.min(1, Math.max(0, volume * (this.duckedTo ?? this.bedLevel)));
    void this.intro.play().catch(() => this.armGesture());
  }

  private armGesture() {
    if (this.gestureArmed || typeof window === "undefined") return;
    this.gestureArmed = true;

    const retry = () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      this.gestureArmed = false;
      if (this.introWanted) this.startIntro();
    };

    window.addEventListener("pointerdown", retry, { once: true });
    window.addEventListener("keydown", retry, { once: true });
  }

  /** Stop the intro, easing it out so it does not clip mid-note. */
  stopIntro({ fade = true }: { fade?: boolean } = {}) {
    this.introWanted = false;
    this.holders = 0;
    const audio = this.intro;
    if (!audio) return;

    if (this.fade) {
      clearInterval(this.fade);
      this.fade = null;
    }

    if (!fade) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    const step = audio.volume / 8;
    this.fade = setInterval(() => {
      audio.volume = Math.max(0, audio.volume - step);
      if (audio.volume <= 0.01) {
        if (this.fade) clearInterval(this.fade);
        this.fade = null;
        audio.pause();
        audio.currentTime = 0;
      }
    }, 50);
  }
}

export const ecdSounds = new EcdSoundPlayer();
