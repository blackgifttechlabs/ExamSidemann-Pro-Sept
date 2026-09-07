# Yippie maths — voice recording scripts

Every spoken line in the ten maths games is already wired up.
**Drop a file with the right name into the right folder and it starts playing.**
A line that has not been recorded yet is read aloud by the browser's own robot
voice instead — nothing breaks and nothing is silent — so these can be recorded
a few at a time, in any order.

## Where the files go

```
public/sounds/ecd/maths/<game>/intro.mp3            said once when the game opens
public/sounds/ecd/maths/<game>/<round>.mp3          the teaching line for that round
public/sounds/ecd/maths/<game>/prompts/<round>.mp3  the question for that round
```

Create every folder in one go:

```bash
mkdir -p public/sounds/ecd/maths/{present-count,star-wish,trace-numbers,wake-up,subitise,one-more,count-back,cave-add,ten-frame,above-below}/prompts
```

## Already recorded — do not record these again

| What | Where it lives |
|---|---|
| "Yes! You did it!" and the other four praises | `public/sounds/ecd/phonics/feedback/correct-1…5.mp3` |
| "Ooh, not that one…" and the other four try-agains | `public/sounds/ecd/phonics/feedback/tryagain-1…5.mp3` |
| The right / wrong chimes and the finish line | `public/sounds/ecd/phonics/feedback/success.mp3`, `wrong.mp3`, `finished.mp3` |
| The numbers **one to twenty**, spoken | `public/sounds/ecd/maths/numbers.mp3` (one take, sliced by `npm run numbers:map`) |

Those are shared with the reading games, so every maths game already praises,
encourages and counts in the same voice. See `docs/ECD_READING_VOICE_SCRIPTS.md`.

## How to record them

| | |
|---|---|
| **Format** | MP3, 128 kbps mono is plenty |
| **Level** | Normalise to about −6 dB peak |
| **Trim** | No silence at the front — the line must start the instant it is triggered |
| **Length** | Intros 5–8 s, teaching lines 4–7 s, prompts 2–4 s |
| **Voice** | The same warm, bright, unhurried voice as the reading games. Smile while you read — it is audible |
| **Pace** | Leave a real beat before a number. "One more than four is……?" — the pause is where the child answers |

**The tags in square brackets are performance directions, not words.**
`[giggles]` means actually giggle; `[ribbit]` means make the sound. They are
stripped out automatically when the robot voice stands in, so never read them
aloud.

**Numbers are never spelled out in these lines.** Where a game needs to say
"four" as it counts, it plays the slice out of `numbers.mp3` instead, so the
counting voice is identical everywhere. Read the scripts exactly as written and
that will take care of itself.

---

## 1 · Present Party
**Folder:** `public/sounds/ecd/maths/present-count/` · **Play it at:** `/ecd/maths/present-count`
*Teaches:* Counting a set of 1 to 5 things, one touch per thing, then saying how many there were.

**`present-count/intro.mp3`** — heard once, as the game opens

> [excited gasp] Gerald has brought a pile of presents! Tap a box to open it, then touch each toy to count. Here we go!

### 1 × duck · `duck`

**`present-count/duck.mp3`**

> [rustling paper, delighted giggle] Ooh! Just one little duck. Touch him and count with me.

**`present-count/prompts/duck.mp3`**

> Touch the duck. How many ducks are in the box?

### 2 × teddies · `teddy`

**`present-count/teddy.mp3`**

> [happy gasp] Teddy bears! Touch one, then the other, and count them out loud.

**`present-count/prompts/teddy.mp3`**

> Touch each teddy. How many teddies?

### 3 × balls · `ball`

**`present-count/ball.mp3`**

> [bouncy laugh] Balls! Bouncy, bouncy balls. Touch every single one as you count.

**`present-count/prompts/ball.mp3`**

> Touch each ball. How many balls are there?

### 4 × cars · `car`

**`present-count/car.mp3`**

> [car noises, giggles] Brrrm! Little cars. Touch them one at a time — do not miss one!

**`present-count/prompts/car.mp3`**

> Touch each car. How many cars?

### 5 × cupcakes · `cupcake`

**`present-count/cupcake.mp3`**

> [gasp, then a slurp] Cupcakes! Yum. Let us count every one before we eat them.

**`present-count/prompts/cupcake.mp3`**

> Touch each cupcake. How many cupcakes?

### 4 × drums · `drum`

**`present-count/drum.mp3`**

> [drum roll, laughs] Boom, boom! Look at all these drums. Touch each one and count.

**`present-count/prompts/drum.mp3`**

> Touch each drum. How many drums?

## 2 · Wish on the Stars
**Folder:** `public/sounds/ecd/maths/star-wish/` · **Play it at:** `/ecd/maths/star-wish`
*Teaches:* Reading numerals and touching them in counting order.

**`star-wish/intro.mp3`** — heard once, as the game opens

> [soft, magical whisper] Look up! The wishing stars are out. Touch them in counting order and your wish will come true.

### counts to 3 · `three`

**`star-wish/three.mp3`**

> [whispers] Three little stars are twinkling. Start at one.

**`star-wish/prompts/three.mp3`**

> Touch star one, then two, then three.

### counts to 4 · `four`

**`star-wish/four.mp3`**

> [twinkling giggle] Four stars now, and they are hiding all over the sky!

**`star-wish/prompts/four.mp3`**

> Find one, two, three, four — in order!

### counts to 5 · `five`

**`star-wish/five.mp3`**

> [amazed] Five wishing stars! Read the number on each one before you touch it.

**`star-wish/prompts/five.mp3`**

> Touch them one, two, three, four, five.

### counts to 5 · `five-high`

**`star-wish/five-high.mp3`**

> [playful] These ones are being cheeky and hiding. Look carefully at the numbers!

**`star-wish/prompts/five-high.mp3`**

> Which star says one? Start there.

## 3 · Trace the Numbers
**Folder:** `public/sounds/ecd/maths/trace-numbers/` · **Play it at:** `/ecd/maths/trace-numbers`
*Teaches:* Writing the numerals 0 to 5 with a finger, in the correct stroke order.

**`trace-numbers/intro.mp3`** — heard once, as the game opens

> [cheerful] Time to write our numbers! Put your finger on the big green dot and follow the dashes. I will help you.

### the numeral 0 · `zero`

**`trace-numbers/zero.mp3`**

> [softly] Zero! Zero means none at all. Start at the top and go all the way round.

**`trace-numbers/prompts/zero.mp3`**

> Trace zero. Round and round, back to the top.

### the numeral 1 · `one`

**`trace-numbers/one.mp3`**

> [bright] Number one! One is easy — a little slide down, then straight down.

**`trace-numbers/prompts/one.mp3`**

> Trace the number one. Down, down, down!

### the numeral 2 · `two`

**`trace-numbers/two.mp3`**

> [playful] Number two! Around like a swan, then slide down and across the water.

**`trace-numbers/prompts/two.mp3`**

> Trace the number two. Around, down, and across!

### the numeral 3 · `three`

**`trace-numbers/three.mp3`**

> [giggles] Number three! Two little tummies, one on top of the other.

**`trace-numbers/prompts/three.mp3`**

> Trace three. Around the top, around the bottom!

### the numeral 4 · `four`

**`trace-numbers/four.mp3`**

> [counting rhythm] Number four! Down, across… then lift your finger and go down again.

**`trace-numbers/prompts/four.mp3`**

> Trace four. Down, across, lift, down!

### the numeral 5 · `five`

**`trace-numbers/five.mp3`**

> [bright] Number five! Down the back, round the big tummy, then a hat on top.

**`trace-numbers/prompts/five.mp3`**

> Trace five. Down, around, and a hat!

## 4 · Wake the Sleepy Yippies
**Folder:** `public/sounds/ecd/maths/wake-up/` · **Play it at:** `/ecd/maths/wake-up`
*Teaches:* Counting OUT a set of a given size — being asked for four and stopping at four.

**`wake-up/intro.mp3`** — heard once, as the game opens

> [whispers] Shhh… the Yippies are all fast asleep. [comic snore] We need to wake up just the right number. Poke them gently!

### wake 2 of 4 · `two`

**`wake-up/two.mp3`**

> [whispering] Two Yippies are wanted for breakfast. Just two!

**`wake-up/prompts/two.mp3`**

> Wake up two Yippies, then ring the bell.

### wake 3 of 5 · `three`

**`wake-up/three.mp3`**

> [whispering, giggling] Three Yippies are going out to play. Only three!

**`wake-up/prompts/three.mp3`**

> Wake up three Yippies, then ring the bell.

### wake 1 of 4 · `one`

**`wake-up/one.mp3`**

> [very quiet] Just one Yippie this time. One little poke!

**`wake-up/prompts/one.mp3`**

> Wake up one Yippie, then ring the bell.

### wake 4 of 6 · `four`

**`wake-up/four.mp3`**

> [excited whisper] Four Yippies for the band! Count as you poke.

**`wake-up/prompts/four.mp3`**

> Wake up four Yippies, then ring the bell.

### wake 5 of 6 · `five`

**`wake-up/five.mp3`**

> [whispering] Five Yippies are going swimming. Careful — that is nearly all of them!

**`wake-up/prompts/five.mp3`**

> Wake up five Yippies, then ring the bell.

### wake 6 of 6 · `six`

**`wake-up/six.mp3`**

> [laughs] Breakfast is ready! This time wake up every single one.

**`wake-up/prompts/six.mp3`**

> Wake up six Yippies, then ring the bell.

## 5 · Quick Eyes
**Folder:** `public/sounds/ecd/maths/subitise/` · **Play it at:** `/ecd/maths/subitise`
*Teaches:* Subitising — seeing how many without counting one by one.

**`subitise/intro.mp3`** — heard once, as the game opens

> [urgent, playful] Oh no! The kittens are stuck in cages. [meow] Look quickly, say how many, and the door pops open!

### 3 dots, dice pattern · `three`

**`subitise/three.mp3`**

> [quick and bright] Quick eyes ready? Do not count — just look!

**`subitise/prompts/three.mp3`**

> How many dots? Say it fast!

### 2 dots, dice pattern · `two`

**`subitise/two.mp3`**

> [playful] Here comes another cage. Quick eyes!

**`subitise/prompts/two.mp3`**

> How many dots?

### 5 dots, dice pattern · `five`

**`subitise/five.mp3`**

> [excited] Ooh, this one is bigger. Just look at the shape!

**`subitise/prompts/five.mp3`**

> How many dots? Quick!

### 4 dots, scatter pattern · `four`

**`subitise/four.mp3`**

> [giggles] These dots are all over the place. Look at the whole picture.

**`subitise/prompts/four.mp3`**

> How many dots?

### 6 dots, dice pattern · `six`

**`subitise/six.mp3`**

> [amazed] Two rows of three! Can you see it without counting?

**`subitise/prompts/six.mp3`**

> How many dots altogether?

### 7 dots, scatter pattern · `seven`

**`subitise/seven.mp3`**

> [encouraging] Bigger now. Try five and two more.

**`subitise/prompts/seven.mp3`**

> How many dots?

### 8 dots, line pattern · `eight`

**`subitise/eight.mp3`**

> [bright] Four and four. Look at the two rows!

**`subitise/prompts/eight.mp3`**

> How many dots?

### 10 dots, line pattern · `ten`

**`subitise/ten.mp3`**

> [cheering] The last kitten! Five on top, five below.

**`subitise/prompts/ten.mp3`**

> How many dots? Set that kitten free!

## 6 · Hoppy's River Hop
**Folder:** `public/sounds/ecd/maths/one-more/` · **Play it at:** `/ecd/maths/one-more`
*Teaches:* One more — counting on by one.

**`one-more/intro.mp3`** — heard once, as the game opens

> [cheerful ribbit] This is Hoppy! She wants to cross the river, but she can only jump to the pad that is ONE MORE. Will you help her?

### one more than 1 · `one`

**`one-more/one.mp3`**

> [ribbit] Hoppy is on pad one. One more than one is…?

**`one-more/prompts/one.mp3`**

> Which pad is one more than one?

### one more than 2 · `two`

**`one-more/two.mp3`**

> [splashing giggle] Now she is on two. Count on: two… then?

**`one-more/prompts/two.mp3`**

> Which pad is one more than two?

### one more than 3 · `three`

**`one-more/three.mp3`**

> [ribbit] Pad three! What comes straight after three?

**`one-more/prompts/three.mp3`**

> Which pad is one more than three?

### one more than 4 · `four`

**`one-more/four.mp3`**

> [encouraging] Four. Say the next number in the count.

**`one-more/prompts/four.mp3`**

> Which pad is one more than four?

### one more than 5 · `five`

**`one-more/five.mp3`**

> [excited] Halfway! One more than five is…?

**`one-more/prompts/five.mp3`**

> Which pad is one more than five?

### one more than 6 · `six`

**`one-more/six.mp3`**

> [ribbit ribbit] Six. Keep counting on!

**`one-more/prompts/six.mp3`**

> Which pad is one more than six?

### one more than 7 · `seven`

**`one-more/seven.mp3`**

> [whispers] Nearly there. One more than seven!

**`one-more/prompts/seven.mp3`**

> Which pad is one more than seven?

### one more than 8 · `eight`

**`one-more/eight.mp3`**

> [cheering] Last jump! One more than eight and she is home!

**`one-more/prompts/eight.mp3`**

> Which pad is one more than eight?

## 7 · Rocket Countdown
**Folder:** `public/sounds/ecd/maths/count-back/` · **Play it at:** `/ecd/maths/count-back`
*Teaches:* Counting backwards, and finding a missing number in a sequence.

**`count-back/intro.mp3`** — heard once, as the game opens

> [rocket rumble, excited] The rocket is ready to blast off! But the countdown has a number missing. Can you fix it?

### 10, 9, __, 7 · `r1`

**`count-back/r1.mp3`**

> [counting] Ten, nine… oh no, what comes next?

**`count-back/prompts/r1.mp3`**

> Which number is missing? Ten, nine, what, seven?

### 8, __, 6, 5 · `r2`

**`count-back/r2.mp3`**

> [counting backwards] Eight… hmm, then six. Something is missing!

**`count-back/prompts/r2.mp3`**

> Which number goes between eight and six?

### 5, 4, 3, __ · `r3`

**`count-back/r3.mp3`**

> [whispers] Five, four, three… and then?

**`count-back/prompts/r3.mp3`**

> What comes after three when we count back?

### 7, 6, __, 4 · `r4`

**`count-back/r4.mp3`**

> [rocket engine hum] Seven, six… quick, the number is missing!

**`count-back/prompts/r4.mp3`**

> Which number is missing? Seven, six, what, four?

### __, 3, 2, 1 · `r5`

**`count-back/r5.mp3`**

> [playful] We are counting down to blast off. What do we start on?

**`count-back/prompts/r5.mp3`**

> Which number comes before three?

### 10, __, 8, 7 · `r6`

**`count-back/r6.mp3`**

> [deep countdown voice] Ten… something… eight, seven!

**`count-back/prompts/r6.mp3`**

> Which number goes between ten and eight?

## 8 · Cave of Glowing Orbs
**Folder:** `public/sounds/ecd/maths/cave-add/` · **Play it at:** `/ecd/maths/cave-add`
*Teaches:* Addition as putting two groups together and counting on.

**`cave-add/intro.mp3`** — heard once, as the game opens

> [echoing whisper] It is dark in here! [gasp] Look — glowing orbs. If we put both piles together the cave lights up. Tap the piles!

### 2 + 1 · `a2-1`

**`cave-add/a2-1.mp3`**

> [echo] Two orbs here… and one over there.

**`cave-add/prompts/a2-1.mp3`**

> Put them together. How many orbs altogether?

### 3 + 2 · `a3-2`

**`cave-add/a3-2.mp3`**

> [echo, excited] Three orbs and two orbs! Count them all.

**`cave-add/prompts/a3-2.mp3`**

> How many orbs altogether?

### 4 + 1 · `a4-1`

**`cave-add/a4-1.mp3`**

> [whispers] Four glowing orbs, and one little one.

**`cave-add/prompts/a4-1.mp3`**

> How many orbs altogether?

### 3 + 3 · `a3-3`

**`cave-add/a3-3.mp3`**

> [amazed] Three and three! Both piles are the same.

**`cave-add/prompts/a3-3.mp3`**

> How many orbs altogether?

### 5 + 2 · `a5-2`

**`cave-add/a5-2.mp3`**

> [echo] Five here, two there. Start at five and count on.

**`cave-add/prompts/a5-2.mp3`**

> How many orbs altogether?

### 4 + 4 · `a4-4`

**`cave-add/a4-4.mp3`**

> [cheering echo] Four and four — the brightest one yet!

**`cave-add/prompts/a4-4.mp3`**

> How many orbs altogether?

## 9 · Fill the Ten Frame
**Folder:** `public/sounds/ecd/maths/ten-frame/` · **Play it at:** `/ecd/maths/ten-frame`
*Teaches:* The same addition on a ten frame, so the answer has a shape as well as a number.

**`ten-frame/intro.mp3`** — heard once, as the game opens

> [bright] Here is our ten frame — ten little boxes. Drop in the blue stones first, then the yellow ones, and see what we get!

### 3 + 2 · `f3-2`

**`ten-frame/f3-2.mp3`**

> [cheerful] Put in three blue stones… then two yellow ones.

**`ten-frame/prompts/f3-2.mp3`**

> How many stones are in the frame altogether?

### 4 + 3 · `f4-3`

**`ten-frame/f4-3.mp3`**

> [bright] Four blue, then three yellow. Fill the top row first!

**`ten-frame/prompts/f4-3.mp3`**

> How many stones altogether?

### 5 + 1 · `f5-1`

**`ten-frame/f5-1.mp3`**

> [happy] Five blue fills the whole top row. Then just one yellow.

**`ten-frame/prompts/f5-1.mp3`**

> How many stones altogether?

### 2 + 6 · `f2-6`

**`ten-frame/f2-6.mp3`**

> [playful] Only two blue this time — but six yellow!

**`ten-frame/prompts/f2-6.mp3`**

> How many stones altogether?

### 7 + 2 · `f7-2`

**`ten-frame/f7-2.mp3`**

> [encouraging] Seven blue. That is more than a row! Then two yellow.

**`ten-frame/prompts/f7-2.mp3`**

> How many stones altogether?

### 5 + 5 · `f5-5`

**`ten-frame/f5-5.mp3`**

> [excited gasp] Five and five — I think this one fills every box!

**`ten-frame/prompts/f5-5.mp3`**

> How many stones altogether?

## 10 · Above and Below
**Folder:** `public/sounds/ecd/maths/above-below/` · **Play it at:** `/ecd/maths/above-below`
*Teaches:* Position words: above, on and under.

**`above-below/intro.mp3`** — heard once, as the game opens

> [curious] Let us play a looking game! Some things are ABOVE, some are ON, and some are hiding UNDER. Listen carefully!

### above the table · `table-above`

**`above-below/table-above.mp3`**

> [playful] Look at the table. A balloon, an apple and a sleepy cat.

**`above-below/prompts/table-above.mp3`**

> Tap the thing that is ABOVE the table.

### under the table · `table-under`

**`above-below/table-under.mp3`**

> [giggles] Someone is hiding down low. Have a look!

**`above-below/prompts/table-under.mp3`**

> Tap the thing that is UNDER the table.

### on the shelf · `shelf-on`

**`above-below/shelf-on.mp3`**

> [bright] Here is a shelf. Something is sitting right on top of it.

**`above-below/prompts/shelf-on.mp3`**

> Tap the thing that is ON the shelf.

### above the box · `box-above`

**`above-below/box-above.mp3`**

> [wind sound, laughs] A kite up in the sky, a chick on the box, and a mouse under it!

**`above-below/prompts/box-above.mp3`**

> Tap the thing that is ABOVE the box.

### under the chair · `chair-under`

**`above-below/chair-under.mp3`**

> [whispers] Where did that ball roll to? Look down low!

**`above-below/prompts/chair-under.mp3`**

> Tap the thing that is UNDER the chair.

### on the shelf · `shelf-on-2`

**`above-below/shelf-on-2.mp3`**

> [soft] Night time! The moon is up, the plant is resting, the boots are put away.

**`above-below/prompts/shelf-on-2.mp3`**

> Tap the thing that is ON the shelf.

---

## Checking your work

Run the site, open `/ecd/maths` and play through a game. Anything still read by
the flat robot voice has no file yet, or the file name does not match — names
are lower-case, hyphenated, and the extension is `.mp3`.

## The count

| | Files |
|---|---|
| Intros | 10 |
| Teaching lines | 62 |
| Prompts | 62 |
| **Total to record** | **134** |

The scripts live beside the code in `src/features/ecd/maths/gameData.ts`. Edit
the wording there and this sheet can be regenerated from it, so the two can
never disagree.
