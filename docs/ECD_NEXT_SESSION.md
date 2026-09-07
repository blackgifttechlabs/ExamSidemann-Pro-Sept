# ECD handoff — 7 September 2026

## Finished

- Addition uses the supplied headphone monster. Travel speed follows measured planted-foot speed at the rendered size (about 40 px/s in the tested phone layout).
- Arriving monsters play their walk cycle only while moving, then pause individually at the standing frame. The scene matches the video background.
- Replaying a question restarts narration and the walk. Reduced motion shows standing monsters. All eight rounds, finish, and restart passed browser checks.
- The supplied runner appears on the finish screen; the second walker is converted and ready for reuse. Original downloads are unchanged.
- Addition and subtraction each have all 12 required recordings connected. Subtraction reuses the three identical addition feedback performances and has nine newly generated activity-specific clips.
- The broader library batch generated and connected 23 new English WAV clips: letters A–K and their questions, plus the L introduction. WAV headers, content hashes, and playback paths were checked.

## Generation still required

215 requested recordings remain: 60 English Gemini replacements and 155 missing maths/number recordings. Existing English MP3 recordings remain available where they have not yet been replaced; other unrecorded lines still use browser narration.

The final generation attempt stopped because all three configured Gemini keys returned the daily project/model free-tier quota error. No further API process is running. Completed WAV files and per-clip generation metadata are saved.

When quota is available, run:

```bash
npm run ecd:audio:all
```

This resumes without regenerating unchanged completed clips. Its next new clip is `phonics/prompts/l.wav`. Additional available keys can be placed in `.env` as `GEMINI_API_KEY_4`, `_5`, etc. The generator skips unavailable keys, retains the selected Gemini 3.1 Flash TTS Preview model, and uses Puck with the saved Promo/Hype direction.

After generation:

```bash
npm run ecd:verify
```

See [generation instructions](ECD_AUDIO_GENERATION.md), [recording checklist](ECD_RECORDING_CHECKLIST.md), and [addition audio/animation notes](ECD_ADDITION_AUDIO.md).
