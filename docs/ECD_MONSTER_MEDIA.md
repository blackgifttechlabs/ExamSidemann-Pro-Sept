# Monster counting media

- `public/images/ecd/maths/monsters/mother-laughing.png`: generated with the built-in imagegen tool. Final prompt: “A cheerful cartoon mother monster laughing, turquoise and gold, full body isolated on a transparent background, friendly rounded children's storybook illustration. No text.” The UI presents it as a rounded portrait.
- `public/images/ecd/maths/elements/glitter-butterfly.png`: generated with the built-in imagegen tool and displayed at different sizes and hue rotations. Final prompt: “One beautiful colorful cartoon butterfly with sparkling golden wing details, open wings, symmetrical front view, luminous turquoise purple and pink, isolated on genuinely transparent background. Polished children’s counting-game reward sprite. No text, no border, no other objects.”
- `public/sounds/ecd/maths/effects/monster-success.mp3`: **success 1**, Leszek_Szary / freesound_community, Pixabay, downloaded 2026-09-10. Source: https://pixabay.com/sound-effects/film-special-effects-success-1-6297/ . License: https://pixabay.com/service/license-summary/ . Public download: https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3 . Unmodified MP3.
- `public/sounds/ecd/maths/effects/monster-giggle.wav`: original synthesized cartoon giggle; five voiced harmonic pulses with descending pitches, vibrato and vowel formants. 24 kHz mono, 16-bit PCM, 1.65 seconds. This is a synthesized effect, not a recorded actor.

## Timing and measurement

FFmpeg `silencedetect` (-40 dB, 50 ms) and `volumedetect` measured the success clip at 3.36 seconds, with 58 ms of opening silence, 115 ms of trailing silence, mean -22.3 dBFS and peak -4.2 dBFS. Its waveform has a bright attack followed by a natural decay; it is not trimmed or looped. Success narration begins on audio completion so the decay is preserved.

Counting waits for both the question narration and monster arrivals. Each visible number advances only after its recorded voice completes, with 260 ms between steps. Halfway through counts greater than one, a 350 ms pause introduces the giggle; the mother portrait bobs during the effect, followed by a 450 ms pause before counting resumes. Zero is spoken explicitly when no monsters remain. Replay and unmount cancel pending counting callbacks and audio. Decorative motion stops with the device's reduced-motion preference.

## Validation

Browser checks at 375 px and 1100 px verified the monster number labels against actual audio playback order, giggle placement, and success narration following the clip. Additional checks covered replay during a prompt and after a wrong answer, five subtraction rounds including zero, next-round narration, seven butterfly sprites per answer click, reduced motion, and navigation away during narration. Free-fall diagrams have no inline SVG labels and no page overflow at 375 px. The laptop columns were verified to move in opposite directions and stop under reduced motion.
