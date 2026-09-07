/**
 * The phonics alphabet: one entry per letter, A to Z.
 *
 * Each letter carries the word and picture the game shows, the sound it makes,
 * and the narration script a voice artist records from. The recorded clip is
 * looked up by letter — `public/sounds/ecd/phonics/a.mp3` and so on — and where
 * a clip has not been recorded yet the page falls back to the browser's own
 * speech synthesis, so every letter is playable from day one.
 *
 * The scripts themselves live here rather than only in the docs so the two can
 * never drift apart; `docs/ECD_READING_VOICE_SCRIPTS.md` is generated from the
 * same wording for the person holding the microphone.
 */

export interface PhonicsLetter {
  letter: string;
  /** The word the picture shows. */
  word: string;
  emoji: string;
  /** The sound, written the way it is said aloud. */
  phoneme: string;
  /** The sound written the way phonics teachers print it. */
  notation: string;
  /** Which tile in the word is left blank for the child to fill. */
  blankIndex: number;
  /** The two wrong letters offered alongside the right one. */
  decoys: [string, string];
  /** The narration script, with performance tags for the recording session. */
  script: string;
  /** The question the game asks before the child picks a letter. */
  prompt: string;
  /**
   * How the picture behaves. Most just bob on the spot; a word for something
   * that actually travels can be given its own move, and the picture then
   * leaves its bubble and comes back.
   */
  motion?: "fly";
}

export const PHONICS_ALPHABET: PhonicsLetter[] = [
  {
    letter: "A", word: "APPLE", emoji: "🍎", phoneme: "ah", notation: "/a/", blankIndex: 0, decoys: ["E", "O"],
    script: "A is for apple! [giggles] Let's practise the /a/ sound together. Open your mouth wide and say, ah-ah-apple!",
    prompt:
      "Which letter says /a/? [whispers] Listen closely… ah, ah, ah. Can you spot it?",
  },
  {
    letter: "B", word: "BALL", emoji: "⚽", phoneme: "buh", notation: "/b/", blankIndex: 0, decoys: ["D", "P"],
    script: "B is for ball! [boing sound] Pop your lips together like this — buh! Now bounce it with me: buh-buh-ball!",
    prompt:
      "Which letter says /b/? [taps softly] Buh, buh, buh — point to the one that pops!",
  },
  {
    letter: "C", word: "CAT", emoji: "🐱", phoneme: "kuh", notation: "/k/", blankIndex: 0, decoys: ["S", "M"],
    script: "C is for cat! [playful meow, then giggles] The /k/ sound hides right at the back of your throat. Ready? kuh-kuh-cat!",
    prompt:
      "Which letter says /k/? [whispers] Kuh, kuh, kuh. Which letter is hiding it?",
  },
  {
    letter: "D", word: "DOG", emoji: "🐶", phoneme: "duh", notation: "/d/", blankIndex: 0, decoys: ["B", "T"],
    script: "D is for dog! [happy bark, laughs] Tap your tongue behind your top teeth — duh! Say it with me: duh-duh-dog!",
    prompt:
      "Which letter says /d/? [giggles] Duh, duh, duh — tap the right one!",
  },
  {
    letter: "E", word: "EGG", emoji: "🥚", phoneme: "eh", notation: "/e/", blankIndex: 0, decoys: ["A", "I"],
    script: "E is for egg! [gasps] Careful — don't drop it! [giggles] Smile a little and say, eh-eh-egg!",
    prompt:
      "Which letter says /e/? [whispers] Eh, eh, eh. Show me where it is!",
  },
  {
    letter: "F", word: "FISH", emoji: "🐟", phoneme: "fff", notation: "/f/", blankIndex: 0, decoys: ["V", "S"],
    script: "F is for fish! [blows bubbles] Put your top teeth on your bottom lip and blow — fff! Now: fff-fff-fish!",
    prompt:
      "Which letter says /f/? [blows softly] Fff, fff, fff — can you find it?",
  },
  {
    letter: "G", word: "GOAT", emoji: "🐐", phoneme: "guh", notation: "/g/", blankIndex: 0, decoys: ["C", "J"],
    script: "G is for goat! [laughs] Oh no, that goat is nibbling my hat! Growl it from your throat: guh-guh-goat!",
    prompt:
      "Which letter says /g/? [playful growl] Guh, guh, guh. Which one is it?",
  },
  {
    letter: "H", word: "HAT", emoji: "🎩", phoneme: "hhh", notation: "/h/", blankIndex: 0, decoys: ["N", "K"],
    script: "H is for hat! [giggles] Breathe warm air onto your hands — hhh! Then say it with me: hhh-hhh-hat!",
    prompt:
      "Which letter says /h/? [breathes out] Hhh, hhh, hhh — point to it!",
  },
  {
    letter: "I", word: "INSECT", emoji: "🐛", phoneme: "ih", notation: "/i/", blankIndex: 0, decoys: ["E", "A"],
    script: "I is for insect! [tiny buzzing, then giggles] It's tickling my nose! Keep it short and quick: ih-ih-insect!",
    prompt:
      "Which letter says /i/? [tiny buzz] Ih, ih, ih. Where is it hiding?",
  },
  {
    letter: "J", word: "JUICE", emoji: "🧃", phoneme: "juh", notation: "/j/", blankIndex: 0, decoys: ["G", "Y"],
    script: "J is for juice! [slurping sound] Mmm, yummy! [laughs] Push the sound out with your lips: juh-juh-juice!",
    prompt:
      "Which letter says /j/? [giggles] Juh, juh, juh — which letter shall we pick?",
  },
  {
    letter: "K", word: "KITE", emoji: "🪁", phoneme: "kuh", notation: "/k/", blankIndex: 0, decoys: ["T", "C"],
    motion: "fly",
    script: "K is for kite! [whoosh] Up, up, up it goes into the sky! Say it with me: kuh-kuh-kite!",
    prompt:
      "Which letter says /k/? [whoosh] Kuh, kuh, kuh. Show me!",
  },
  {
    letter: "L", word: "LION", emoji: "🦁", phoneme: "lll", notation: "/l/", blankIndex: 0, decoys: ["R", "N"],
    script: "L is for lion! [big roar, then giggles] Don't worry, he's a friendly one. Lift your tongue up high: lll-lll-lion!",
    prompt:
      "Which letter says /l/? [soft roar] Lll, lll, lll — can you see it?",
  },
  {
    letter: "M", word: "MOON", emoji: "🌙", phoneme: "mmm", notation: "/m/", blankIndex: 0, decoys: ["N", "W"],
    script: "M is for moon! [yawns] It's sleepy time way up there. Close your lips and hum with me: mmm-mmm-moon!",
    prompt:
      "Which letter says /m/? [hums] Mmm, mmm, mmm. Which one is it?",
  },
  {
    letter: "N", word: "NOSE", emoji: "👃", phoneme: "nnn", notation: "/n/", blankIndex: 0, decoys: ["M", "H"],
    script: "N is for nose! [pretend sneeze, then laughs] Bless you! Tongue up, and hum through your nose: nnn-nnn-nose!",
    prompt:
      "Which letter says /n/? [hums through nose] Nnn, nnn, nnn — point to the right one!",
  },
  {
    letter: "O", word: "ORANGE", emoji: "🍊", phoneme: "oh", notation: "/o/", blankIndex: 0, decoys: ["A", "U"],
    script: "O is for orange! [giggles] Make your mouth into a big round O, just like the fruit: oh-oh-orange!",
    prompt:
      "Which letter says /o/? [whispers] Oh, oh, oh. Which letter is round like your mouth?",
  },
  {
    letter: "P", word: "PIG", emoji: "🐷", phoneme: "puh", notation: "/p/", blankIndex: 0, decoys: ["B", "D"],
    script: "P is for pig! [oink oink, laughs] Puff the air right off your lips — puh! Now: puh-puh-pig!",
    prompt:
      "Which letter says /p/? [puffs] Puh, puh, puh — find it for me!",
  },
  {
    letter: "Q", word: "QUEEN", emoji: "👑", phoneme: "kwuh", notation: "/kw/", blankIndex: 0, decoys: ["K", "G"],
    script: "Q is for queen! [trumpet fanfare, then giggles] Q always brings her friend U along. Say it royally: kwuh-kwuh-queen!",
    prompt:
      "Which letter says /kw/? [tiny fanfare] Kwuh, kwuh, kwuh. Where's the royal one?",
  },
  {
    letter: "R", word: "RAIN", emoji: "🌧️", phoneme: "rrr", notation: "/r/", blankIndex: 0, decoys: ["L", "W"],
    script: "R is for rain! [pitter-patter sounds] Splish, splash! Curl your tongue back and rumble: rrr-rrr-rain!",
    prompt:
      "Which letter says /r/? [rumbles] Rrr, rrr, rrr — can you hear which one?",
  },
  {
    letter: "S", word: "SUN", emoji: "☀️", phoneme: "sss", notation: "/s/", blankIndex: 0, decoys: ["Z", "F"],
    script: "S is for sun! [giggles] Hide your tongue behind your teeth and hiss like a little snake: sss-sss-sun!",
    prompt:
      "Which letter says /s/? [hisses softly] Sss, sss, sss. Point to the snake sound!",
  },
  {
    letter: "T", word: "TREE", emoji: "🌳", phoneme: "tuh", notation: "/t/", blankIndex: 0, decoys: ["D", "K"],
    script: "T is for tree! [tick-tock sound] Tap your tongue quick and light: tuh-tuh-tree!",
    prompt:
      "Which letter says /t/? [tap tap] Tuh, tuh, tuh — which letter is it?",
  },
  {
    letter: "U", word: "UMBRELLA", emoji: "☂️", phoneme: "uh", notation: "/u/", blankIndex: 0, decoys: ["O", "A"],
    script: "U is for umbrella! [rain drops, then laughs] Up it goes — now we're dry! Short and soft: uh-uh-umbrella!",
    prompt:
      "Which letter says /u/? [whispers] Uh, uh, uh. Show me the one!",
  },
  {
    letter: "V", word: "VAN", emoji: "🚐", phoneme: "vvv", notation: "/v/", blankIndex: 0, decoys: ["F", "W"],
    script: "V is for van! [engine vroom, giggles] Buzz your lip and your teeth together: vvv-vvv-van!",
    prompt:
      "Which letter says /v/? [buzzes] Vvv, vvv, vvv — which letter drives the van?",
  },
  {
    letter: "W", word: "WATER", emoji: "💧", phoneme: "wuh", notation: "/w/", blankIndex: 0, decoys: ["V", "M"],
    script: "W is for water! [splash, then laughs] Oops, you got me! Round your lips like a kiss: wuh-wuh-water!",
    prompt:
      "Which letter says /w/? [giggles] Wuh, wuh, wuh. Which one is it?",
  },
  {
    letter: "X", word: "FOX", emoji: "🦊", phoneme: "ks", notation: "/ks/", blankIndex: 2, decoys: ["S", "K"],
    script: "X is for fox! [sly giggle] Now here's a secret — X likes to sit at the *end* of the word. Listen closely: fo-ks, ks-ks-fox!",
    prompt:
      "Which letter makes the /ks/ sound at the end? [whispers] Ks, ks, ks — find it!",
  },
  {
    letter: "Y", word: "YOYO", emoji: "🪀", phoneme: "yuh", notation: "/y/", blankIndex: 0, decoys: ["J", "W"],
    script: "Y is for yoyo! [whee! then giggles] Down it goes and up it comes! Stretch your tongue: yuh-yuh-yoyo!",
    prompt:
      "Which letter says /y/? [whee] Yuh, yuh, yuh. Can you point to it?",
  },
  {
    letter: "Z", word: "ZEBRA", emoji: "🦓", phoneme: "zzz", notation: "/z/", blankIndex: 0, decoys: ["S", "X"],
    script: "Z is for zebra! [buzzes like a bee, then laughs] Buzz it with your voice switched on: zzz-zzz-zebra!",
    prompt:
      "Which letter says /z/? [buzzes like a bee] Zzz, zzz, zzz — which one is buzzing?",
  },
];

/** Where the recorded clip for a letter's introduction lives. */
export const phonicsLetterVoiceUrl = (letter: string) =>
  `/sounds/ecd/phonics/letters/${letter.toLowerCase()}.mp3`;

/** Where the recorded clip for a letter's "which letter says…" prompt lives. */
export const phonicsPromptVoiceUrl = (letter: string) =>
  `/sounds/ecd/phonics/prompts/${letter.toLowerCase()}.mp3`;
