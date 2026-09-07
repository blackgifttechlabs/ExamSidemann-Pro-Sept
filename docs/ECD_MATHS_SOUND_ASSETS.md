# Yippie maths — sound effects to find, and where to save them

Every sound effect in the ten maths games is already wired up in code. Nothing
else needs changing: **drop a file with the right name into the right folder and
it starts playing.** A file that is not there yet is simply silent — no errors,
no broken games — so they can be collected a few at a time.

> The spoken lines are separate and live in
> `docs/ECD_MATHS_VOICE_SCRIPTS.md`. This sheet is only about sound *effects*.

## Where the files go

```
public/sounds/ecd/maths/effects/<file-name>.mp3
```

Create the folder first:

```bash
mkdir -p public/sounds/ecd/maths/effects
```

## What the files should be like

| | |
|---|---|
| **Format** | MP3, 128 kbps mono is plenty |
| **Level** | Normalise to about −6 dB peak; the code sets its own volume per effect |
| **Trim** | No silence at the start — an effect must fire the instant it is triggered |
| **One-shots** | Short: 0.15 s – 1.2 s. These fire dozens of times in a session, so anything long or musical becomes maddening fast |
| **Loops** | 2 – 6 s and **seamless** — the end must join back onto the start with no click |
| **Tone** | Cartoon, warm, playful. Nothing metallic, nothing startling, no alarms, no harsh buzzers. A four-year-old is holding this device close to their face |

## Where to look

- [pixabay.com/sound-effects](https://pixabay.com/sound-effects/) — free for commercial use, no attribution needed. Everything below is findable there.
- [freesound.org](https://freesound.org) — bigger library, but **check the licence on each file**; some need credit.
- [mixkit.co/free-sound-effects](https://mixkit.co/free-sound-effects/) — smaller, free, cartoon-heavy.

On Pixabay, put the words below into the search box exactly as written. Where a
row has several search terms, they are in the order worth trying — the first is
usually closest. Filter by **duration: short (under 1 minute)** and sort by
**relevant**, then audition with the little play button before downloading.

---

## The list

`Type` is **one-shot** (plays once) or **loop** (plays until the action stops).

### Used everywhere

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `count-pop.mp3` | one-shot | One small bright pop, like a finger popping out of a cheek. This is the sound of *one thing being counted*, so it must be tiny — under 0.25 s — and identical every time. | `pop`, `bubble pop`, `cartoon pop`, `mouth pop` |
| `sparkle.mp3` | one-shot | A rising magic twinkle — glockenspiel or celeste, three or four notes going up. Used for a star lighting, a cave brightening, a right answer feeling magical. 0.6–1.2 s. | `magic sparkle`, `twinkle`, `magic chime`, `fairy sparkle` |

### 1 · Present Party

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `present-open.mp3` | one-shot | Paper tearing and a ribbon coming loose, ending with a small cheerful reveal. Crinkly, not violent. Under 1 s. | `unwrap gift`, `paper tear`, `opening present`, `gift wrap rustle` |

### 4 · Wake the Sleepy Yippies

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `snore.mp3` | **loop** | A comic cartoon snore, in and out, gentle and funny rather than gross. It runs quietly under the whole screen while anyone is still asleep, so it must loop with no click and no obvious "here it goes again" moment. 3–5 s. | `cartoon snore`, `funny snoring`, `snore loop`, `sleeping snore` |
| `wake-up.mp3` | one-shot | A small squeaky yawn-and-stretch — a creature waking up happy. Cute, high, under 0.8 s. Never a shout. | `cartoon yawn`, `waking up sound`, `cute squeak`, `character wake up` |

### 5 · Quick Eyes

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `cage-open.mp3` | one-shot | A little latch clicking and a light door swinging open. Wooden or plastic, definitely not a prison clang. Under 0.8 s. | `cage open`, `latch open`, `small door open`, `cartoon door creak` |
| `meow.mp3` | one-shot | One happy, friendly kitten meow. Bright and short — a thank-you, not a complaint. Under 0.8 s. | `kitten meow`, `happy cat meow`, `cute meow`, `cat meow short` |

### 6 · Hoppy's River Hop

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `hop.mp3` | one-shot | A springy cartoon boing for a frog jumping. Comic, bouncy, under 0.5 s. | `cartoon boing`, `jump sound`, `spring boing`, `hop sound effect` |
| `splash.mp3` | one-shot | A small, soft plop into water — a pebble, not a belly flop. This plays on a **wrong** answer, so it has to read as funny, never as failure. Under 0.6 s. | `water plop`, `small splash`, `pebble in water`, `cartoon splash` |

### 7 · Rocket Countdown

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `rocket.mp3` | one-shot | A rocket leaving the pad: a whoosh with a bit of rumble that fades as it climbs. Triumphant, not military. 1.5–3 s — this one is allowed to be longer, it plays once at the very end. | `rocket launch`, `rocket whoosh`, `spaceship launch`, `cartoon rocket` |

### 8 · Cave of Glowing Orbs

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `orb.mp3` | one-shot | A soft magical "pick up" — a glowing thing being collected in a game. One note, slight shimmer, under 0.5 s. Fires once per orb, so keep it small. | `magic pickup`, `collect item`, `game coin pickup`, `magic orb` |

### 9 · Fill the Ten Frame

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `counter-drop.mp3` | one-shot | A smooth wooden or glass counter landing in a shallow box. A single satisfying click-thud. Under 0.4 s. | `wooden click`, `checker piece drop`, `marble drop`, `board game piece` |

### 3 · Trace the Numbers

| Save as | Type | What it should sound like | Pixabay search terms |
|---|---|---|---|
| `pencil.mp3` | **loop** | Pencil or crayon on paper, moving steadily. Runs only while the finger is actually tracing, and stops the moment it lifts, so it must be even all the way through with no scribbling flourish. 2–4 s, seamless. | `pencil writing loop`, `pencil on paper`, `drawing sound`, `crayon writing` |

---

## Already there — do not go looking for these

| File | Used for |
|---|---|
| `public/sounds/ecd/effects/buttonclick.mp3` | Every button in every maths game |
| `public/sounds/ecd/effects/swipingsound.mp3` | Moving to the next round |
| `public/sounds/ecd/intros/toon-sound1.mp3` | The tune under everything |
| `public/sounds/ecd/phonics/feedback/success.mp3` · `wrong.mp3` | The right / wrong chimes |
| `public/sounds/ecd/maths/numbers.mp3` | The counting voice, one to twenty |

---

## Checking your work

```bash
ls public/sounds/ecd/maths/effects
```

Then run the site and play a game. If an effect is missing you simply hear
nothing where it should have been — the game carries on. The names the code
looks for are listed in `src/lib/audio/ecdSounds.ts`; they are lower-case and
hyphenated, and the extension is `.mp3`.

## The count

**13 files.** Two shared, one per game for most of them, and two apiece for
Wake the Sleepy Yippies, Quick Eyes and Hoppy's River Hop.
