# Yippie phonics — voice recording scripts

> Updated recording list: [ECD recording checklist](ECD_RECORDING_CHECKLIST.md). WAV and MP3 are supported with the same filename stem. Restart development or rebuild after adding files. The checklist includes the new Addition and Subtraction games and individual number clips.

Every spoken line in the Phonics & Letter Sounds game is already wired up.
**Drop a file with the right name into the right folder and it starts playing.**
A line that has not been recorded yet is read aloud by the browser's own robot
voice instead — nothing breaks, nothing is silent, so the letters can be
recorded a few at a time.

## Where the files go

```
public/sounds/ecd/phonics/letters/<letter>.mp3     the "A is for apple" line
public/sounds/ecd/phonics/prompts/<letter>.mp3     the "which letter says…" line
public/sounds/ecd/phonics/feedback/<name>.mp3      right / wrong / finished
```

Create the folders first:

```bash
mkdir -p public/sounds/ecd/phonics/letters public/sounds/ecd/phonics/prompts public/sounds/ecd/phonics/feedback
```

## How to record them

| | |
|---|---|
| **Format** | MP3, 128 kbps mono is plenty |
| **Level** | Normalise to about −6 dB peak |
| **Trim** | No silence at the front — the line should start the instant it is triggered |
| **Length** | Letter lines 4–7 s, prompts 3–5 s, feedback 1.5–3 s |
| **Voice** | Warm, bright, slower than normal speech. Smile while you read — it is audible |

**The tags in square brackets are performance directions, not words.** `[giggles]`
means actually giggle there; `[oink oink]` means make the sound. They are stripped
out automatically when the robot voice stands in, so never read them aloud.

Sounds are written between slashes the way phonics teachers print them: `/a/` is
the sound the letter makes, not its name. Say the **sound**, never "ay".

---

## The letters

Each letter needs **two** files: the introduction and the question.

### A — Apple 🍎 · sound /a/

**`letters/a.mp3`**

> A is for apple! [giggles] Let's practise the /a/ sound together. Open your mouth wide and say, ah-ah-apple!

**`prompts/a.mp3`**

> Which letter says /a/? [whispers] Listen closely… ah, ah, ah. Can you spot it?

### B — Ball ⚽ · sound /b/

**`letters/b.mp3`**

> B is for ball! [boing sound] Pop your lips together like this — buh! Now bounce it with me: buh-buh-ball!

**`prompts/b.mp3`**

> Which letter says /b/? [taps softly] Buh, buh, buh — point to the one that pops!

### C — Cat 🐱 · sound /k/

**`letters/c.mp3`**

> C is for cat! [playful meow, then giggles] The /k/ sound hides right at the back of your throat. Ready? kuh-kuh-cat!

**`prompts/c.mp3`**

> Which letter says /k/? [whispers] Kuh, kuh, kuh. Which letter is hiding it?

### D — Dog 🐶 · sound /d/

**`letters/d.mp3`**

> D is for dog! [happy bark, laughs] Tap your tongue behind your top teeth — duh! Say it with me: duh-duh-dog!

**`prompts/d.mp3`**

> Which letter says /d/? [giggles] Duh, duh, duh — tap the right one!

### E — Egg 🥚 · sound /e/

**`letters/e.mp3`**

> E is for egg! [gasps] Careful — don't drop it! [giggles] Smile a little and say, eh-eh-egg!

**`prompts/e.mp3`**

> Which letter says /e/? [whispers] Eh, eh, eh. Show me where it is!

### F — Fish 🐟 · sound /f/

**`letters/f.mp3`**

> F is for fish! [blows bubbles] Put your top teeth on your bottom lip and blow — fff! Now: fff-fff-fish!

**`prompts/f.mp3`**

> Which letter says /f/? [blows softly] Fff, fff, fff — can you find it?

### G — Goat 🐐 · sound /g/

**`letters/g.mp3`**

> G is for goat! [laughs] Oh no, that goat is nibbling my hat! Growl it from your throat: guh-guh-goat!

**`prompts/g.mp3`**

> Which letter says /g/? [playful growl] Guh, guh, guh. Which one is it?

### H — Hat 🎩 · sound /h/

**`letters/h.mp3`**

> H is for hat! [giggles] Breathe warm air onto your hands — hhh! Then say it with me: hhh-hhh-hat!

**`prompts/h.mp3`**

> Which letter says /h/? [breathes out] Hhh, hhh, hhh — point to it!

### I — Insect 🐛 · sound /i/

**`letters/i.mp3`**

> I is for insect! [tiny buzzing, then giggles] It's tickling my nose! Keep it short and quick: ih-ih-insect!

**`prompts/i.mp3`**

> Which letter says /i/? [tiny buzz] Ih, ih, ih. Where is it hiding?

### J — Juice 🧃 · sound /j/

**`letters/j.mp3`**

> J is for juice! [slurping sound] Mmm, yummy! [laughs] Push the sound out with your lips: juh-juh-juice!

**`prompts/j.mp3`**

> Which letter says /j/? [giggles] Juh, juh, juh — which letter shall we pick?

### K — Kite 🪁 · sound /k/

**`letters/k.mp3`**

> K is for kite! [whoosh] Up, up, up it goes into the sky! Say it with me: kuh-kuh-kite!

**`prompts/k.mp3`**

> Which letter says /k/? [whoosh] Kuh, kuh, kuh. Show me!

### L — Lion 🦁 · sound /l/

**`letters/l.mp3`**

> L is for lion! [big roar, then giggles] Don't worry, he's a friendly one. Lift your tongue up high: lll-lll-lion!

**`prompts/l.mp3`**

> Which letter says /l/? [soft roar] Lll, lll, lll — can you see it?

### M — Moon 🌙 · sound /m/

**`letters/m.mp3`**

> M is for moon! [yawns] It's sleepy time way up there. Close your lips and hum with me: mmm-mmm-moon!

**`prompts/m.mp3`**

> Which letter says /m/? [hums] Mmm, mmm, mmm. Which one is it?

### N — Nose 👃 · sound /n/

**`letters/n.mp3`**

> N is for nose! [pretend sneeze, then laughs] Bless you! Tongue up, and hum through your nose: nnn-nnn-nose!

**`prompts/n.mp3`**

> Which letter says /n/? [hums through nose] Nnn, nnn, nnn — point to the right one!

### O — Orange 🍊 · sound /o/

**`letters/o.mp3`**

> O is for orange! [giggles] Make your mouth into a big round O, just like the fruit: oh-oh-orange!

**`prompts/o.mp3`**

> Which letter says /o/? [whispers] Oh, oh, oh. Which letter is round like your mouth?

### P — Pig 🐷 · sound /p/

**`letters/p.mp3`**

> P is for pig! [oink oink, laughs] Puff the air right off your lips — puh! Now: puh-puh-pig!

**`prompts/p.mp3`**

> Which letter says /p/? [puffs] Puh, puh, puh — find it for me!

### Q — Queen 👑 · sound /kw/

**`letters/q.mp3`**

> Q is for queen! [trumpet fanfare, then giggles] Q always brings her friend U along. Say it royally: kwuh-kwuh-queen!

**`prompts/q.mp3`**

> Which letter says /kw/? [tiny fanfare] Kwuh, kwuh, kwuh. Where's the royal one?

### R — Rain 🌧️ · sound /r/

**`letters/r.mp3`**

> R is for rain! [pitter-patter sounds] Splish, splash! Curl your tongue back and rumble: rrr-rrr-rain!

**`prompts/r.mp3`**

> Which letter says /r/? [rumbles] Rrr, rrr, rrr — can you hear which one?

### S — Sun ☀️ · sound /s/

**`letters/s.mp3`**

> S is for sun! [giggles] Hide your tongue behind your teeth and hiss like a little snake: sss-sss-sun!

**`prompts/s.mp3`**

> Which letter says /s/? [hisses softly] Sss, sss, sss. Point to the snake sound!

### T — Tree 🌳 · sound /t/

**`letters/t.mp3`**

> T is for tree! [tick-tock sound] Tap your tongue quick and light: tuh-tuh-tree!

**`prompts/t.mp3`**

> Which letter says /t/? [tap tap] Tuh, tuh, tuh — which letter is it?

### U — Umbrella ☂️ · sound /u/

**`letters/u.mp3`**

> U is for umbrella! [rain drops, then laughs] Up it goes — now we're dry! Short and soft: uh-uh-umbrella!

**`prompts/u.mp3`**

> Which letter says /u/? [whispers] Uh, uh, uh. Show me the one!

### V — Van 🚐 · sound /v/

**`letters/v.mp3`**

> V is for van! [engine vroom, giggles] Buzz your lip and your teeth together: vvv-vvv-van!

**`prompts/v.mp3`**

> Which letter says /v/? [buzzes] Vvv, vvv, vvv — which letter drives the van?

### W — Water 💧 · sound /w/

**`letters/w.mp3`**

> W is for water! [splash, then laughs] Oops, you got me! Round your lips like a kiss: wuh-wuh-water!

**`prompts/w.mp3`**

> Which letter says /w/? [giggles] Wuh, wuh, wuh. Which one is it?

### X — Fox 🦊 · sound /ks/

**`letters/x.mp3`**

> X is for fox! [sly giggle] Now here's a secret — X likes to sit at the *end* of the word. Listen closely: fo-ks, ks-ks-fox!

**`prompts/x.mp3`**

> Which letter makes the /ks/ sound at the end? [whispers] Ks, ks, ks — find it!

### Y — Yoyo 🪀 · sound /y/

**`letters/y.mp3`**

> Y is for yoyo! [whee! then giggles] Down it goes and up it comes! Stretch your tongue: yuh-yuh-yoyo!

**`prompts/y.mp3`**

> Which letter says /y/? [whee] Yuh, yuh, yuh. Can you point to it?

### Z — Zebra 🦓 · sound /z/

**`letters/z.mp3`**

> Z is for zebra! [buzzes like a bee, then laughs] Buzz it with your voice switched on: zzz-zzz-zebra!

**`prompts/z.mp3`**

> Which letter says /z/? [buzzes like a bee] Zzz, zzz, zzz — which one is buzzing?

---

## When the child picks the right letter

One of these is chosen at random, so record all five — hearing the same cheer
every time gets old fast.

**`feedback/correct-1.mp3`**

> [claps and laughs] Yes! You did it! That's the one!

**`feedback/correct-2.mp3`**

> [cheers] Woo-hoo! You are a super sound finder!

**`feedback/correct-3.mp3`**

> [giggles] Brilliant! Your listening ears are working perfectly!

**`feedback/correct-4.mp3`**

> [happy gasp] Wow! That is exactly right! High five!

**`feedback/correct-5.mp3`**

> [laughs] Yes, yes, yes! You are getting so good at this!

---

## When the child picks the wrong letter

Warm and playful, never disappointed. The child should want to try again.

**`feedback/tryagain-1.mp3`**

> [gentle giggle] Ooh, not that one. Have a listen again — you can do it!

**`feedback/tryagain-2.mp3`**

> [warmly] So close! Let's use our listening ears one more time.

**`feedback/tryagain-3.mp3`**

> [playful hmm] Hmm, that letter makes a different sound. Try again!

**`feedback/tryagain-4.mp3`**

> [encouraging] Nearly there, my friend. Have another go!

**`feedback/tryagain-5.mp3`**

> [soft chuckle] Oops! No problem at all. Let's try once more!

---

## When all twenty-six letters are done

**`feedback/finished.mp3`**

> [cheers and claps] Hooray! You found all the sounds! [giggles] You are a reading star. Shall we play again?

---

## Checking your work

Run the site, open `/ecd/reading/phonics`, and step through the alphabet strip
along the bottom. Any letter still read by the robot voice has no file yet, or
the file name does not match. Names are lower-case and the extension is `.mp3`.

The scripts themselves live in `src/features/ecd/reading/phonicsAlphabet.ts` —
edit them there and this sheet can be regenerated from the same wording, so the
two can never disagree.
