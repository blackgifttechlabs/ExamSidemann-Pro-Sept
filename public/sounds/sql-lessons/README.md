# SQL Teach Me voice clips

One folder per lesson, one MP3 per step:

```
public/sounds/sql-lessons/<lesson-id>/<step-id>.mp3
```

**The filename must be the step id exactly — hyphens, never underscores.**
`add-column.mp3` is played; `add_column.mp3` is silently ignored, because the player looks the clip up by
step id and nothing else. `node scripts/build_sql_lesson_captions.mjs` now fails and names any clip that
does not match a step, so run it after adding recordings.

The exact list of folders, filenames and the words to say is in
[`docs/SQL_TEACH_ME_SCRIPTS.md`](../../../docs/SQL_TEACH_ME_SCRIPTS.md), which is generated from the lesson
JSON by `node scripts/build_sql_lesson_captions.mjs`.

After dropping clips in here, run:

```
node scripts/generate_narration_captions.mjs scripts/narration/sql-lessons.captions.json
```

That measures each recording with ffmpeg and rewrites `lib/audio/narration/sqlLessons.ts`, which is what
puts the captions, the typing of the SQL and the press of the Run button on the narrator's actual words.

Clips that are not here yet fall back to estimated timings, so the lessons already run — silently — and
each recording you add takes over for its own clip only.
