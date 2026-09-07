# Narration audio scripts — O Level Physics practicals

Everything below is already wired up in the app. The code expects these exact
files at these exact paths. Record or generate them, drop them in, and the
**Explain** menu, the **Show me** walkthrough and the **Tinashe** guide button
all start working immediately — no code changes needed.

If a file is missing the app does not crash: that clip is simply silent and the
walkthrough moves on when its step timer runs out.

---

## How it works (same design as Photosynthesis)

Each experiment has a small floating bar over the 3D scene with two controls:

| Control | What it does |
| --- | --- |
| **Explain ▾** | Drop-down list of every clip. Tap one to play it, tap again to pause, tap again to resume. |
| **Tinashe** | Switches to Play (walk-around) mode and plays `tinashe_intro.mp3` — the guide greeting the learner. |
| **Show me** (inside the Explain menu) | Runs the whole experiment automatically: intro clip → each step clip while the 3D scene performs that step → closing clip → opens the write-up. |

While **Show me** is running the bar swaps to **Pause** / **Stop** buttons and a
status pill appears at the top of the scene.

A step only advances when **both** the voice clip has finished **and** the step's
animation time has passed, so the scene never runs ahead of the voice.

### Timing guidance

Each step has an animation time budget listed in the tables below. Aim for a clip
**at or just under** that length:

- If your clip is **shorter**, the scene finishes the action and waits — fine, just a small pause.
- If your clip is **longer**, the scene waits for you — also fine, the status pill shows "finishing explanation".

So the budgets are targets, not hard limits. Anything within a couple of seconds is good.

---

## Captions, the pointing hand and the on-screen ruler

**Projectile Motion, Hooke's Law and the Simple Pendulum** go further than the
timing guidance above: they do not guess how long a clip is, they measure it.

`scripts/generate_narration_captions.mjs` runs ffmpeg silence detection over
each recorded MP3, works out which stretches contain speech, and lays the words
of the script across them. Every caption line therefore starts on the end of a
pause the narrator actually took, and every word has a real timestamp. That data
drives four things at once:

- the **big captions** along the bottom of the scene, which highlight the word
  being spoken,
- the **pointing hand**, which sits on whatever the current line is about — the
  cannon, the bob, the spring, or a control in the panel. On a slider it rides
  the thumb, so the learner watches the launch angle actually being dragged from
  thirty to sixty degrees rather than just seeing where it lives,
- the **on-screen ruler**: a labelled dimension line drawn between two points
  for exactly as long as the line that asked for it. "Measured from the top all
  the way down to the middle of the bob" draws that measurement, "not to the top
  of the bob" draws the wrong one for contrast, and both clear themselves when
  the sentence ends, and
- the **walkthrough timing** — step lengths and the moment the scene acts are
  read from the same file, off the audio's own clock, so pausing the narration
  pauses the demonstration too.

### Script files

| Experiment | Script | Generated |
| --- | --- | --- |
| Projectile Motion | `scripts/narration/projectile-motion.captions.json` | `src/lib/audio/narration/projectileMotion.ts` |
| Hooke's Law | `scripts/narration/hookes-law.captions.json` | `src/lib/audio/narration/hookesLaw.ts` |
| Simple Pendulum | `scripts/narration/simple-pendulum.captions.json` | `src/lib/audio/narration/simplePendulum.ts` |

Each line may carry a `focus`:

- `selector` — a `data-experiment-tour` name, e.g. `projectile-angle`,
  `hooke-record`, `pendulum-stopwatch`. Mobile and desktop copies of a control
  share one name; whichever is on screen wins.
- `sceneAnchor` — a named point in the 3D scene. Projectile: `cannon`, `muzzle`,
  `grid`, `apex`, `ball`, `landing`, `launchGround`, `apexGround`. Hooke's Law:
  `springTop`, `spring`, `naturalBottom`, `springBottom`, `mass`, `ruler`.
  Pendulum: `pivot`, `bob`, `bobRest`, `bobTop`, `string`.
- `label` — the short chip that rides with the hand.
- `measure` — `{ from, to, axis, label }` over two scene anchors. `axis` is
  `vertical`, `horizontal` or `direct`.

### To re-record a clip

1. Drop the new MP3 in the experiment's `public/sounds/…` folder.
2. Edit the matching line list in its `*.captions.json` if the words changed.
3. Run `node scripts/generate_narration_captions.mjs` to rebuild all three, or
   pass one script path to rebuild just that experiment.

Nothing else needs touching — step budgets, cue points, captions and the hand
all follow. The remaining experiments still use the hand-set budgets in their
tables below; add a `*.captions.json` for them when their audio is recorded.

### Recording settings

- **Format:** MP3, 128 kbps, mono is fine
- **Voice:** warm, unhurried, Zimbabwean-English friendly. Tinashe is a helpful older student, not a lecturer.
- **Pace:** slower than normal speech. These are learners reading in a second language.
- **Language rule:** short sentences. One idea per sentence. Explain any word that is not everyday English the first time it is used.

---

# 1. Projectile Motion

**Folder:** `public/sounds/projectile-motion/`
**Route:** `/practicals/olevel/physics/projectile-motion`

**Recorded — timings are measured, not budgeted.** See "Captions and the pointing
hand" below. The lengths in this table are what the current recordings actually
are; the walkthrough reads them from the generated caption file, so re-recording
a clip and re-running the generator retimes the scene automatically.

| # | Save as | Menu label | Recorded |
| --- | --- | --- | --- |
| — | `intro.mp3` | Introduction | 34.7 s |
| — | `tinashe_intro.mp3` | (Tinashe button) | 21.8 s |
| 1 | `step1_setup.mp3` | Step 1: The cannon and the grid | 24.4 s |
| 2 | `step2_set_angle.mp3` | Step 2: Choose the angle | 27.6 s |
| 3 | `step3_launch.mp3` | Step 3: Launch it | 27.5 s |
| 4 | `step4_results.mp3` | Step 4: Read the results | 27.2 s |
| 5 | `step5_best_angle.mp3` | Step 5: The best angle | 36.8 s |
| — | `experiment_complete.mp3` | (plays at the end) | 32.8 s |

### `intro.mp3`
> Welcome to the projectile motion experiment. A projectile is any object that is thrown or fired, and then moves only under gravity. A ball, a stone, a bullet — they all follow the same curved path. In this experiment you fire a ball from a cannon. You choose the angle and the speed. Then you watch how far it goes, how high it rises, and how long it stays in the air.

### `tinashe_intro.mp3`
> Hello, I am Tinashe. Welcome to the lab. You can walk around the cannon and look at it from any side. Use the keys to move, and move your mouse to look around. Take your time. When you are ready, set your angle and fire.

### `step1_setup.mp3`
> First, look at what is in front of you. There is a cannon on the left. In front of it there is a grid on the ground. The grid helps you measure how far the ball lands. The cannon is set at forty five degrees, and the speed is twelve metres per second.

### `step2_set_angle.mp3`
> Now choose the angle. The angle is how far the cannon points upwards. Watch. At thirty degrees the cannon is low, so the ball will stay close to the ground. At sixty degrees the cannon is high, so the ball will go up high but not very far. Let us put it back to forty five degrees.

### `step3_launch.mp3`
> Now fire the cannon. Watch the shape of the path. It goes up, it curves over at the top, and it comes down. That curved shape is called a parabola. Notice that the ball keeps moving forward the whole time. Gravity only pulls it down. It does not slow the forward movement.

### `step4_results.mp3`
> Now read your results. The range is how far the ball travelled along the ground. The maximum height is the highest point it reached. The time of flight is how long it stayed in the air. Write all three numbers in your table. Change only one thing at a time, so your test is fair.

### `step5_best_angle.mp3`
> Now let us find the best angle. Watch three shots with the same speed. First, thirty degrees. It lands quite close. Next, forty five degrees. Look, that one went the furthest. Now sixty degrees. It went very high, but it came down closer again. So for the same speed, forty five degrees gives the longest range. Remember that, it is a common exam question.

### `experiment_complete.mp3`
> Well done, you have finished the experiment. Remember the three main points. One, a projectile follows a curved path called a parabola. Two, the range, the height and the time all depend on the angle and the speed. Three, for the same speed, forty five degrees gives the greatest range. Your write-up is opening now, so you can check your work.

---

# 2. Hooke's Law

**Folder:** `public/sounds/hookes-law/`
**Route:** `/practicals/olevel/physics/hookes-law`

| # | Save as | Menu label | Budget |
| --- | --- | --- | --- |
| — | `intro.mp3` | Introduction | — |
| — | `tinashe_intro.mp3` | (Tinashe button) | — |
| 1 | `step1_setup.mp3` | Step 1: Set up the spring | 9 s |
| 2 | `step2_add_load.mp3` | Step 2: Add the first load | 12 s |
| 3 | `step3_more_loads.mp3` | Step 3: Add more loads | 17 s |
| 4 | `step4_graph.mp3` | Step 4: The load-extension graph | 12 s |
| 5 | `step5_elastic_limit.mp3` | Step 5: The elastic limit | 14 s |
| — | `experiment_complete.mp3` | (plays at the end) | — |

### `intro.mp3`
> Welcome to the Hooke's law experiment. Hooke's law is about springs. It says that when you pull a spring, the amount it stretches depends on how hard you pull. Pull twice as hard, and it stretches twice as much. In this experiment you hang weights on a spring and measure how much it stretches each time.

### `tinashe_intro.mp3`
> Hello, I am Tinashe. Come closer and look at the spring. You can walk right up to it. There is a ruler next to the spring so you can read the length. When you are ready, start adding your weights, one at a time.

### `step1_setup.mp3`
> First look at the spring. It is hanging with nothing on it. This length is called the natural length. Write it down. Every stretch you measure later is counted from this length.

### `step2_add_load.mp3`
> Now hang the first weight on the spring. Watch it bounce, and then settle. Wait until it stops moving before you read the ruler. The extra length is called the extension. Extension is the new length minus the natural length. Record the weight and the extension.

### `step3_more_loads.mp3`
> Now keep adding weights, one at a time. Each time, wait for the spring to settle, then read the ruler and record it. Watch what is happening. Every time we add the same extra weight, the spring stretches by the same extra amount. That is the important pattern. Equal loads give equal extensions.

### `step4_graph.mp3`
> Now look at your graph. Load is on the up axis and extension is along the bottom. Your points make a straight line through the start. A straight line through the origin means the two things are proportional. That is Hooke's law. The steepness of the line tells you how stiff the spring is.

### `step5_elastic_limit.mp3`
> Now watch carefully. I am going to add a very heavy load. Look at the spring. It has stretched too far. Now when I take the weight off, the spring does not go back to its old length. It stays longer. The point where this starts is called the elastic limit. Past the elastic limit, Hooke's law no longer works.

### `experiment_complete.mp3`
> Well done, you have finished the experiment. Remember three things. One, extension is the new length minus the natural length. Two, load and extension are proportional, so the graph is a straight line through the origin. Three, this is only true up to the elastic limit. After that the spring is damaged and stays stretched. Your write-up is opening now.

---

# 3. Simple Pendulum

**Folder:** `public/sounds/simple-pendulum/`
**Route:** `/practicals/olevel/physics/pendulum`

| # | Save as | Menu label | Budget |
| --- | --- | --- | --- |
| — | `intro.mp3` | Introduction | — |
| — | `tinashe_intro.mp3` | (Tinashe button) | — |
| 1 | `step1_setup.mp3` | Step 1: Set up the pendulum | 11 s |
| 2 | `step2_measure_length.mp3` | Step 2: Measure the length | 12 s |
| 3 | `step3_swing_and_time.mp3` | Step 3: Swing it and time it | 16 s |
| 4 | `step4_find_period.mp3` | Step 4: Work out the period | 14 s |
| 5 | `step5_change_length.mp3` | Step 5: Change the length | 15 s |
| 6 | `step6_find_g.mp3` | Step 6: Find g from the graph | 16 s |
| — | `experiment_complete.mp3` | (plays at the end) | — |

### `intro.mp3`
> Welcome to the simple pendulum experiment. A simple pendulum is just a small heavy ball on a string. When you pull it to one side and let go, it swings back and forth. In this experiment you time those swings. Then you use them to work out g, the acceleration due to gravity.

### `tinashe_intro.mp3`
> Hello, I am Tinashe. This is the pendulum. The ball at the bottom is called the bob. You can walk around it and watch it swing from any side. There is a stopwatch on the bench for your timing. Take your time and watch carefully.

### `step1_setup.mp3`
> First look at the setup. There is a stand, a string, and a heavy ball called the bob. The string is held tightly at the top so it cannot slip. The bob must be able to swing freely, without hitting anything.

### `step2_measure_length.mp3`
> Now measure the length. This is important. The length is measured from the top, where the string is held, all the way down to the middle of the bob. Not to the top of the bob. To the middle. Watch as the length changes. A short string, and a long string. We will start at eighty centimetres.

### `step3_swing_and_time.mp3`
> Now pull the bob a small distance to one side, and let it go. Keep the angle small, under ten degrees, or the results will not be accurate. Do not push it, just release it. Now start the stopwatch. Do not time only one swing. One swing is too fast to time by hand. Instead, count twenty complete swings.

### `step4_find_period.mp3`
> Now stop the stopwatch and work out the period. The period is the time for one complete swing, and we call it capital T. To find it, take your total time and divide it by twenty. Dividing by twenty makes your answer much more accurate, because your reaction time is shared over twenty swings instead of one.

### `step5_change_length.mp3`
> Now change the length and do it again. Here is a short pendulum, forty centimetres. Watch how quickly it swings. Now a long one, one hundred and twenty centimetres. It swings much more slowly. So a longer pendulum has a longer period. Repeat this for at least five different lengths.

### `step6_find_g.mp3`
> Now make your graph. Do not plot T against length, because that gives a curve, and curves are hard to use. Instead, square each period first, and plot T squared against the length. That gives a straight line. Now measure the gradient of your line. Finally, g is four times pi squared, divided by that gradient. You should get a number close to nine point eight.

### `experiment_complete.mp3`
> Well done, you have finished the experiment. Remember four things. One, measure the length to the middle of the bob. Two, keep the swing small. Three, time twenty swings and divide by twenty. Four, plot T squared against length to get a straight line, and use the gradient to find g. Your write-up is opening now.

---

# 4. Density of an Irregular Solid

**Folder:** `public/sounds/density-irregular/`
**Route:** `/practicals/olevel/physics/density`

> The **Show me** walkthrough uses the jagged granite rock, because that is the
> solid whose volume can only be found by displacement.

| # | Save as | Menu label | Budget |
| --- | --- | --- | --- |
| — | `intro.mp3` | Introduction | — |
| — | `tinashe_intro.mp3` | (Tinashe button) | — |
| 1 | `step1_setup.mp3` | Step 1: What is on the bench | 12 s |
| 2 | `step2_measure_mass.mp3` | Step 2: Measure the mass | 13 s |
| 3 | `step3_first_volume.mp3` | Step 3: First water reading | 12 s |
| 4 | `step4_lower_solid.mp3` | Step 4: Lower the solid in | 13 s |
| 5 | `step5_second_volume.mp3` | Step 5: Second water reading | 13 s |
| 6 | `step6_calculate.mp3` | Step 6: Calculate the density | 16 s |
| — | `experiment_complete.mp3` | (plays at the end) | — |

### `intro.mp3`
> Welcome to the density experiment. Density tells you how heavy something is for its size. To find density you need two things: the mass, and the volume. For a neat shape like a box you can measure the sides and calculate the volume. But this rock has a rough, jagged shape. You cannot measure it with a ruler. So we use water instead.

### `tinashe_intro.mp3`
> Hello, I am Tinashe. On this bench you have a balance, a measuring cylinder with water, and some solids on the tray. Walk up to any of them to use them. Start with the rock, it is the interesting one. Its shape is too rough to measure with a ruler.

### `step1_setup.mp3`
> First look at what is on the bench. There is an electronic balance for measuring mass. There is a measuring cylinder with water in it. And there is a tray of solids. Look at the grey rock. It has a rough, jagged shape, with no flat sides. That is why we call it an irregular solid.

### `step2_measure_mass.mp3`
> First we find the mass. Make sure the rock is completely dry, then place it gently on the balance. Wait for the number to settle, then read it. Write this down as the mass in grams. Always find the mass before you put the solid in the water, because a wet solid weighs more.

### `step3_first_volume.mp3`
> Now take the rock off the balance and look at the measuring cylinder. Read the water level before you put anything in. Bend down so your eye is level with the water. The surface curves a little, and that curve is called the meniscus. Always read the bottom of the curve. Write this down as the first volume.

### `step4_lower_solid.mp3`
> Now lower the rock into the water. Lower it slowly, using a thread, so the water does not splash out. If water splashes out you have lost some of your reading and you must start again. Make sure the rock is completely under the water. If any part is sticking out, the reading will be too small.

### `step5_second_volume.mp3`
> Now read the water level again. It has gone up. Read the bottom of the curve again, with your eye level. Write this down as the second volume. The water went up because the rock pushed it out of the way. The rock takes up space, and the water has to go somewhere.

### `step6_calculate.mp3`
> Now do the calculation. First, the volume of the rock is the second reading minus the first reading. This is called the volume by displacement. Now, density is mass divided by volume. So take your mass in grams and divide it by that volume in centimetres cubed. Your answer is in grams per centimetre cubed.

### `experiment_complete.mp3`
> Well done, you have finished the experiment. Remember four things. One, find the mass while the solid is still dry. Two, read the bottom of the curve with your eye level. Three, the volume of the solid is the second reading minus the first reading. Four, density is mass divided by volume. Your write-up is opening now.

---

## Checklist

Copy your finished files here:

```
public/sounds/
├── projectile-motion/
│   ├── intro.mp3
│   ├── tinashe_intro.mp3
│   ├── step1_setup.mp3
│   ├── step2_set_angle.mp3
│   ├── step3_launch.mp3
│   ├── step4_results.mp3
│   ├── step5_best_angle.mp3
│   └── experiment_complete.mp3
├── hookes-law/
│   ├── intro.mp3
│   ├── tinashe_intro.mp3
│   ├── step1_setup.mp3
│   ├── step2_add_load.mp3
│   ├── step3_more_loads.mp3
│   ├── step4_graph.mp3
│   ├── step5_elastic_limit.mp3
│   └── experiment_complete.mp3
├── simple-pendulum/
│   ├── intro.mp3
│   ├── tinashe_intro.mp3
│   ├── step1_setup.mp3
│   ├── step2_measure_length.mp3
│   ├── step3_swing_and_time.mp3
│   ├── step4_find_period.mp3
│   ├── step5_change_length.mp3
│   ├── step6_find_g.mp3
│   └── experiment_complete.mp3
└── density-irregular/
    ├── intro.mp3
    ├── tinashe_intro.mp3
    ├── step1_setup.mp3
    ├── step2_measure_mass.mp3
    ├── step3_first_volume.mp3
    ├── step4_lower_solid.mp3
    ├── step5_second_volume.mp3
    ├── step6_calculate.mp3
    └── experiment_complete.mp3
```

**Total: 34 clips.**

The folders already exist in the repo, so you can drop files straight in.

### Adjusting timing after recording

If a clip turns out much longer or shorter than its budget, the step budgets live
next to each step in the sim files, as `durationMs`:

| Experiment | File |
| --- | --- |
| Projectile Motion | `src/features/practicals/o-level/physics-experiments/ProjectileMotion.tsx` |
| Hooke's Law | `src/features/practicals/o-level/physics-experiments/HookesLaw.tsx` |
| Simple Pendulum | `src/features/practicals/o-level/physics-experiments/Pendulum.tsx` |
| Density | `src/features/practicals/o-level/physics-experiments/Density.tsx` |

Search for `walkthroughSteps` in any of them.
