# Subtraction voice recordings

`/ecd/maths/subtraction` uses twelve WAV files under `public/sounds/ecd/maths/subtraction/`: one intro, eight questions, and three feedback clips.

The voice matches Addition: **Gemini 3.1 Flash TTS Preview**, **Puck**, **Promo/Hype**. The style direction is saved in `scripts/config/ecd-subtraction-tts.json`. The correct, retry, and finished lines use the identical existing Gemini performances from Addition; their provenance is recorded in `generation.json`.

```bash
# Preview work without using API quota.
npm run ecd:audio:subtraction -- --dry-run

# Generate missing/changed clips and automatically connect completed recordings.
npm run ecd:audio:subtraction

# Intentionally replace a specific clip.
npm run ecd:audio:subtraction -- --clip=prompts/2-1 --force
```

The generator loads `GEMINI_API_KEY` from `.env`. It uses the selected model without falling back to a different model, and resumes safely after an interrupted batch. A daily quota error requires available quota on the configured Gemini project. The game continues to use browser narration for any unrecorded question.

Run `npm run ecd:verify` for playback/cue checks. Recording status and every script appear in [the complete recording checklist](ECD_RECORDING_CHECKLIST.md).
