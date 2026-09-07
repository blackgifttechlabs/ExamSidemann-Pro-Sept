# Addition voice recordings

Monster Picnic at `/ecd/maths/addition` uses twelve generated WAV clips: the intro, eight addition questions, correct-answer praise, encouragement, and the finish line.

The generation settings live in `scripts/config/ecd-addition-tts.json`:

- Model: `gemini-3.1-flash-tts-preview` (no automatic model fallback).
- Voice: Puck.
- Style: **Promo/Hype** — high energy, punchy consonants, elongated vowels on excitement words.
- Delivery: a playful children's game host, with clear numbers and kind retry feedback.
- Files: mono, 24 kHz, 16-bit PCM WAV; trimmed outer silence and consistent loudness.

Gemini uses natural-language direction for this style; it is stored in the director's notes of every generation prompt, rather than an API parameter named `Promo/Hype`. See [Google's speech-generation guide](https://ai.google.dev/gemini-api/docs/speech-generation#control-speech-style-with-prompts).

## Generate or update

Keep `GEMINI_API_KEY` in the project-root `.env`. The generator loads it directly on the local machine. The game plays static WAV files and does not call Gemini or need a key in the browser.

```bash
# See the exact lines and which ones need generation; no API calls.
npm run ecd:audio:addition -- --dry-run

# Generate missing or changed clips, then refresh the app's audio index.
npm run ecd:audio:addition

# Intentionally regenerate one clip, for example to try a different delivery.
npm run ecd:audio:addition -- --clip=intro --force

# Run the ECD checks.
npm run ecd:verify
```

Generation requires Node 20.12+ and FFmpeg/FFprobe. It sends the addition scripts to Google's Gemini API and uses the API account's available quota. Existing matching files are skipped, so rerunning resumes an interrupted batch. Generation is never run automatically by development or production builds.

The exact wording comes from `src/features/ecd/maths/monsterMathsData.ts`. Update wording there, or change the saved voice/style settings, then run generation again. `public/sounds/ecd/maths/addition/generation.json` records the model, style, script, duration, and hash for each finished recording. It contains no credentials.

The generator refreshes `src/data/ecdAudioAssets.json` automatically. The game's intro, question replay, answer feedback, next-round question, and finish actions already use these exact paths. Start the game with **Let's play!** to enable audio through a user gesture. Build and deploy again when publishing updated audio.

## Walking monsters

The initial group waits in the picnic scene. At the start of the second spoken sentence, the additional monsters walk in from the right using the supplied headphone monster walk cycle, with staggered arrivals. Each cycle pauses independently on a standing frame as that monster arrives. Answer buttons become available after they arrive. The question-replay button restarts both narration and movement.

Recorded audio uses playback-time cues in `src/data/ecdAdditionJoinCues.json`, measured from the pause after the first sentence. Buffering does not advance this cue. Browser narration uses sentence/word boundaries; when a browser supplies no boundaries or has no voice, completion still triggers the joining sequence. Reduced-motion settings show the joined group without the walk.

The audio generator refreshes these timing cues after addition generation. After manually replacing addition recordings, run `node scripts/buildEcdAdditionCues.mjs` and check the timing: it identifies the first long sentence pause, so substantially different delivery may need an adjusted cue.

[Subtraction recordings](ECD_SUBTRACTION_AUDIO.md) use the same voice and style.

## Supplied monster artwork

The walking character comes from the user's `Monster Walk Cycle.gif` in Downloads (800×600, 140 frames). Its original file is unchanged. A cropped, web-ready H.264 copy lives at `public/images/ecd/maths/monsters/headphones-walk.mp4`. The surrounding scene matches the decoded blue background (`#87b3e4`), with a small edge fade to hide compression seams. The character faces toward the waiting group using a horizontal CSS flip.

Unlike an animated GIF, the video can pause. Each monster plays only during its own movement and seeks to the planted-feet frame at **3.4 seconds** on arrival. Waiting monsters and reduced-motion mode use that same still pose. Leaving the game pauses all players.

Walking speed is calibrated to the supplied GIF's planted-foot motion, rather than a fixed travel duration. The game measures the rendered monster and the distance from the scene's entrance, then calculates the travel time. The video remains at normal speed.
