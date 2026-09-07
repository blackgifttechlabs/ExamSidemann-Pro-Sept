# Generating the ECD voice library

```bash
# Generate Gemini versions of English reading/phonics, then all missing maths voices.
npm run ecd:audio:all

# Only English reading and phonics.
npm run ecd:audio:reading

# Inspect the plan without calling Gemini.
npm run ecd:audio:all -- --dry-run
```

The generator reads all spoken lines and filenames from `docs/ECD_RECORDING_CHECKLIST.json`, which is regenerated from the activity data. It uses **Gemini 3.1 Flash TTS Preview**, **Puck**, and **Promo/Hype**, with deliberately slower, clearer phonics and number pronunciation. The saved direction is in `scripts/config/ecd-library-tts.json`.

English reading receives new WAV recordings even where older MP3 files exist; WAV takes precedence in the player. Maths recordings already present are preserved. Completed work is tracked by script/configuration signatures and file hashes in `public/sounds/ecd/library-generation.json`. Rerunning skips unchanged completed clips. The recording index is refreshed after each completed or failed batch, so saved clips are playable even if quota stops a batch.

Place keys in `.env` as `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3`, and so on. Duplicate values are removed. A key with exhausted daily quota or unavailable access is replaced by the next configured key. Temporary rate limits are retried first. If every key is unavailable, the command stops with the provider's quota reason; add available quota/keys and run it again. Keys are never written to generation metadata or logs.

Missing recordings continue to use browser narration. Generation is not run during build or development startup; those commands only refresh the recording index. See [the recording checklist](ECD_RECORDING_CHECKLIST.md) for exact scripts and paths.
