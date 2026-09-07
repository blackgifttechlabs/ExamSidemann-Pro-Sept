# Headphone monster

`headphones-walk.mp4` is the user's supplied `Monster Walk Cycle.gif`, converted for browser-controlled playback. The original in Downloads is unchanged.

Source: 800×600 GIF, 140 frames, 5.6 seconds. The conversion crops unused blue margins and saves a 240×352 H.264 video:

```bash
ffmpeg -i 'Monster Walk Cycle.gif' \
  -vf 'crop=300:440:240:80,scale=240:352:flags=lanczos' \
  -an -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p \
  -movflags +faststart headphones-walk.mp4
```

The game flips it horizontally to face the waiting group and pauses at 3.4 seconds on arrival. Its decoded blue backdrop matches the scene; a narrow edge fade hides compression seams. Playback is muted and disabled while standing or when reduced motion is requested.

## Other supplied characters

| Download | Prepared asset | Use |
| --- | --- | --- |
| `runniing.gif` | `cap-run.mp4` | Victory runner on the monster maths finish screen; respects reduced motion. |
| `walking2.gif` | `friendly-walk.mp4` | Prepared as an alternate walking character for a future activity. |
| `winning.gif` | Original remains in Downloads | Reviewed as a reference; it carries a wine glass, so it is not used in the ECD finish screen. |

The runner and alternate walker retain their original motion, encoded at 400×300 as muted H.264 clips. Their source files are unchanged.

## Footstep timing

The headphone monster's planted foot moves backward at approximately 200 source pixels per second, equivalent to 160 pixels per second in the 240-pixel-wide converted clip. The game scales that speed to the actual rendered video width. Travel duration is distance divided by this rendered foot speed, keeping the same gait across phone and desktop layouts. The video stays at its native playback rate and each character stops separately on arrival.
