# Lab sound effects — what to record and where to save it

Every sound effect in the 3D practicals is already wired up in code. Nothing else
needs changing: **drop a file with the right name into the right folder and it
starts playing.** A file that is not there yet is simply silent — no errors, no
broken experiments — so you can add them a few at a time.

## Where the files go

```
public/sounds/lab/<file-name>.mp3
```

That folder is the only place the effects are loaded from. Create it if it is not
there yet:

```bash
mkdir -p public/sounds/lab
```

> The narrator's voice clips are separate and stay where they are
> (`public/sounds/photosynthesis/`, `public/sounds/hookes-law/`, and so on) —
> see `docs/NARRATION_AUDIO_SCRIPTS.md`. This file is only about sound *effects*.

## What the files should be like

| | |
|---|---|
| **Format** | MP3, 128 kbps mono is plenty |
| **Level** | Normalise to about −6 dB peak; the code sets its own volume per effect |
| **Trim** | No silence at the start — an effect must fire the instant it is triggered |
| **One-shots** | Short: 0.1 s – 1.5 s |
| **Loops** | 2 – 6 s and **seamless** (the end must join back onto the start with no click) |

Free sources that allow commercial use: [freesound.org](https://freesound.org)
(check each licence), [pixabay.com/sound-effects](https://pixabay.com/sound-effects/),
[mixkit.co/free-sound-effects](https://mixkit.co/free-sound-effects/). You can
also just record them on a phone in a real lab — that usually sounds better.

---

## The full list

`Type` is **one-shot** (plays once) or **loop** (plays until the action stops).

### Interface and progress — heard on every experiment

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `ui-click.mp3` | one-shot | A soft, dry button click. Think a mouse click with a little body to it — not a sharp tick. ~80 ms. | The big Run / Reset / Demo buttons at the bottom of the control panel. |
| `ui-toggle.mp3` | one-shot | A small two-tone blip, slightly brighter than the click. Like flicking a light switch on a mixing desk. ~120 ms. | Switching between **Learning** and **Doing**, and un-muting the sound button. |
| `panel-open.mp3` | one-shot | A very quiet paper-ish "shff" or soft drawer slide. Must be subtle — it fires often. ~150 ms. | Expanding or collapsing a group in the side control panel. |
| `step-complete.mp3` | one-shot | A short, happy two- or three-note rise. Like finishing a level step in a game. ~400 ms. | Finishing one step of the experiment procedure. |
| `experiment-complete.mp3` | one-shot | A fuller, warmer little fanfare — four or five notes rising. ~1.2 s. | Finishing the whole experiment. |
| `reading-recorded.mp3` | one-shot | A single clean confirming "ping" or pen-tick. ~200 ms. | Recording a reading into the results table (every experiment that has one). |
| `error-buzz.mp3` | one-shot | A low, short, polite buzz. Not harsh or alarming — this is a school app. ~250 ms. | An action that cannot be done yet. |

### Trolleys and the runway — Force & Motion, Conservation of Momentum, Inclined Plane

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `trolley-roll.mp3` | **loop** | Small hard rubber wheels rolling on a wooden board. A low continuous rumble with a bit of grain in it. The code speeds it up and makes it louder as the trolley accelerates, so record it at a **steady medium speed**. 3 – 4 s, seamless. | The whole time a trolley is moving. |
| `trolley-release.mp3` | one-shot | A hand letting go of a trolley: a light finger-off-metal tap followed by the first bit of roll. ~300 ms. | The moment the trolley is released. |
| `trolley-collision-soft.mp3` | one-shot | A dull, dead thud — a pin driving into cork. No ring at all. ~200 ms. | A sticky (pin-and-cork) collision. Louder and higher-pitched the faster they hit. |
| `trolley-collision-hard.mp3` | one-shot | A bright metallic clack with a short spring "boing" ringing after it. ~400 ms. | A springy (buffer) collision, where the trolleys bounce apart. |
| `trolley-stop.mp3` | one-shot | The trolley hitting the end stop and settling — a soft wooden knock. ~250 ms. | A run ends. |
| `ticker-timer.mp3` | **loop** | The mains-driven ticker-tape timer: a fast, even mechanical buzz-rattle, about 50 taps a second — it reads as a continuous buzzing hum. 2 – 3 s, seamless. | The whole time the ticker tape is being printed. |
| `light-gate-beep.mp3` | one-shot | A short, clean electronic beep, like a shop scanner. ~120 ms. | A trolley's card blade breaks a light gate beam. |

### Mechanics — Hooke's Law, Pendulum, Moments, Pulleys, Terminal Velocity

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `spring-stretch.mp3` | one-shot | A steel spring being pulled — a low creak with a faint ring. ~500 ms. | The spring is stretched by a new load. |
| `mass-hooked.mp3` | one-shot | A small metal slotted mass being hung on a hook: a light metallic "clink-tap". ~250 ms. | A mass is added to the hanger. |
| `pendulum-swing.mp3` | **loop** | A very soft rhythmic air "woosh", one per swing. Almost inaudible — atmosphere, not an effect. 4 s, seamless. | The pendulum is swinging. |
| `object-drop-soft.mp3` | one-shot | Something light landing on a bench top — a soft dull tap. ~200 ms. | A non-metal object is put down. |
| `object-drop-metal.mp3` | one-shot | A metal block set down on a bench — a solid clunk with a tiny ring. ~300 ms. | A metal specimen or mass is put down. |
| `pulley-ratchet.mp3` | one-shot | A pulley wheel turning under load: a short squeaky creak. ~400 ms. | The pulley system is worked. |
| `rule-balance-click.mp3` | one-shot | A wooden metre rule tipping and settling on a knife edge — a light wooden knock. ~200 ms. | The metre rule tips or balances. |

### Liquids and glassware — Titration, Osmosis, Density, Separation, Food Tests

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `water-pour.mp3` | one-shot | Water poured from a beaker into another — a steady glugging pour. ~1.5 s. | Liquid is transferred. |
| `water-splash.mp3` | one-shot | A solid dropped into a measuring cylinder of water — a compact "plop" with a bit of splash. ~400 ms. | An object is lowered into water (displacement). |
| `droplet-drip.mp3` | one-shot | One drop from a burette hitting liquid — a small, high "plink". ~150 ms. | Each drop added during a titration. |
| `glass-clink.mp3` | one-shot | Two pieces of glassware touching — a light, bright clink. ~250 ms. | Glassware is picked up or set down. |
| `bubble-release.mp3` | **loop** | Gas bubbling steadily up through water. Even and gentle, not a rolling boil. 3 s, seamless. | Bubbles are being given off (pondweed, rates of reaction). |
| `stirring.mp3` | one-shot | A glass rod stirring liquid in a beaker — a soft swirl with occasional glass taps. ~1 s. | The mixture is stirred. |
| `tap-squeak.mp3` | one-shot | A burette tap being turned — a short rubbery squeak. ~250 ms. | The burette tap is opened. |

### Heat and gases — Specific Heat, Heating Curves, Expansion, Boyle's Law

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `bunsen-ignite.mp3` | one-shot | Gas tap opening, then a soft "whumph" as the flame catches. ~600 ms. | Heating is started. |
| `bunsen-flame.mp3` | **loop** | A Bunsen burner burning steadily — a soft, even roaring hiss. 4 s, seamless. | The whole time heating is on. |
| `water-boil.mp3` | **loop** | Water at a rolling boil — bubbling with a bit of hiss. 4 s, seamless. | Water reaches boiling point. |
| `gas-hiss.mp3` | one-shot | Gas escaping through a narrow tube — a short sharp hiss. ~500 ms. | Gas is released. |
| `pump-stroke.mp3` | one-shot | One stroke of a foot or bicycle pump — a squeeze then a hiss. ~500 ms. | Each pump of the Boyle's Law apparatus. |

### Electricity and magnetism — Resistance, Rheostat, Resistors, Electrostatics, Magnets

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `switch-click.mp3` | one-shot | A knife switch or lab tapping key closing — a firm, crisp metallic click. ~120 ms. | The circuit is closed or opened. |
| `current-hum.mp3` | **loop** | A quiet low mains hum, around 50 Hz. Very subtle. 3 s, seamless. | Current is flowing. |
| `lamp-on.mp3` | one-shot | A filament lamp lighting — a tiny "tink" plus a whisper of a rising hum. ~250 ms. | The lamp lights up. |
| `spark-discharge.mp3` | one-shot | A small static spark — a sharp dry crack. ~200 ms. | Charge jumps or is shared by contact. |
| `magnet-snap.mp3` | one-shot | A magnet snapping onto steel — a fast, satisfying metallic "clack". ~200 ms. | A specimen is attracted to the magnet. |
| `magnet-slide.mp3` | one-shot | A magnet stroked along a steel bar, or a rod rubbed on cloth — a dry sliding rasp. ~500 ms. | A stroking or rubbing action. |
| `compass-settle.mp3` | one-shot | A plotting compass needle swinging and settling — a faint tick with a whisper of movement. ~400 ms. | A field line is plotted. |

### Room atmosphere

| File name | Type | What it should sound like | When it plays |
|---|---|---|---|
| `lab-ambience.mp3` | **loop** | A quiet school lab: distant air handling, a faint room tone. No voices, no music. 10 – 20 s, seamless. | Available for a background bed. |
| `paper-rustle.mp3` | one-shot | Paper being handled or cut — a short crisp rustle. ~400 ms. | Ticker tape is cut into strips, or a results sheet is handled. |
| `footstep.mp3` | one-shot | One footstep on a hard lab floor. ~200 ms. | Walking around in **Doing** mode. |

---

## Quick checklist

```
public/sounds/lab/
├── ui-click.mp3                    ├── spring-stretch.mp3
├── ui-toggle.mp3                   ├── mass-hooked.mp3
├── panel-open.mp3                  ├── pendulum-swing.mp3
├── step-complete.mp3               ├── object-drop-soft.mp3
├── experiment-complete.mp3         ├── object-drop-metal.mp3
├── reading-recorded.mp3            ├── pulley-ratchet.mp3
├── error-buzz.mp3                  ├── rule-balance-click.mp3
│                                   │
├── trolley-roll.mp3                ├── water-pour.mp3
├── trolley-release.mp3             ├── water-splash.mp3
├── trolley-collision-soft.mp3      ├── droplet-drip.mp3
├── trolley-collision-hard.mp3      ├── glass-clink.mp3
├── trolley-stop.mp3                ├── bubble-release.mp3
├── ticker-timer.mp3                ├── stirring.mp3
├── light-gate-beep.mp3             ├── tap-squeak.mp3
│                                   │
├── bunsen-ignite.mp3               ├── switch-click.mp3
├── bunsen-flame.mp3                ├── current-hum.mp3
├── water-boil.mp3                  ├── lamp-on.mp3
├── gas-hiss.mp3                    ├── spark-discharge.mp3
├── pump-stroke.mp3                 ├── magnet-snap.mp3
│                                   ├── magnet-slide.mp3
├── lab-ambience.mp3                ├── compass-settle.mp3
├── paper-rustle.mp3
└── footstep.mp3
```

## Testing what you have added

1. `npm run dev`, open any practical.
2. Click once anywhere first — browsers block audio until the page has been
   clicked, so the very first sound of a session will not play otherwise.
3. The speaker button in the experiment header mutes and un-mutes everything.

## Adding a new effect

1. Add a line to `LAB_SOUNDS` in `src/lib/audio/labSounds.ts` — the key is the name
   you call it by, the value is the file name.
2. Call it: `labSounds.play("yourNewSound", { volume: 0.5 })`, or
   `labSounds.loop(...)` / `labSounds.stop(...)` for a looping one.
3. Add a row to this file so whoever records it knows what it should be.

Useful options: `volume` (0–1), `rate` (pitch/speed — the collision sounds use
this to get higher the harder the hit), `throttleMs` (ignore repeats fired within
that many milliseconds, so a fast action does not machine-gun).
