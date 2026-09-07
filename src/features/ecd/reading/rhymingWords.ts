/**
 * Rhyming Words — the pairs the game asks for, and the lines it says.
 *
 * A picture and its word appear at the top; three picture cards sit below and
 * exactly one of them rhymes. Every round carries the two scripts a voice
 * artist records from — see `docs/ECD_READING_VOICE_SCRIPTS.md` — and falls
 * back to the browser's own voice until the clips exist.
 */

export interface RhymeCard {
  word: string;
  emoji: string;
}

export interface RhymeRound {
  /** A stable id, used for the recorded file names. */
  id: string;
  /** The word the child has to find a rhyme for. */
  target: RhymeCard;
  /** The card that rhymes with the target. */
  match: RhymeCard;
  /** Two cards that do not rhyme. */
  decoys: [RhymeCard, RhymeCard];
  /** The chunk the pair shares, shown after a correct answer. */
  family: string;
  /** Said when the round opens. */
  script: string;
  /** The question, repeated by the speaker button. */
  prompt: string;
}

export const RHYME_ROUNDS: RhymeRound[] = [
  {
    id: "cat",
    target: { word: "CAT", emoji: "🐱" },
    match: { word: "HAT", emoji: "🎩" },
    decoys: [{ word: "SUN", emoji: "☀️" }, { word: "DOG", emoji: "🐶" }],
    family: "-at",
    script:
      "Look, a cat! [playful meow, giggles] Words that rhyme sound the same at the end. Listen: cat… hat. Can you hear it?",
    prompt: "Which one rhymes with cat? [whispers] Cat… caaat. Find the one that matches!",
  },
  {
    id: "dog",
    target: { word: "DOG", emoji: "🐶" },
    match: { word: "FROG", emoji: "🐸" },
    decoys: [{ word: "CAKE", emoji: "🎂" }, { word: "STAR", emoji: "⭐" }],
    family: "-og",
    script:
      "Here comes a dog! [happy bark, laughs] Now listen to the ending: dog… frog. They sound the same!",
    prompt: "Which one rhymes with dog? [whispers] Dog… ogg, ogg. Which one hops along?",
  },
  {
    id: "sun",
    target: { word: "SUN", emoji: "☀️" },
    match: { word: "BUN", emoji: "🍞" },
    decoys: [{ word: "FISH", emoji: "🐟" }, { word: "TREE", emoji: "🌳" }],
    family: "-un",
    script:
      "The sun is shining! [giggles] Sun… bun. Ooh, that makes me hungry! Listen to the ending sound.",
    prompt: "Which one rhymes with sun? [whispers] Sun… un, un, un. Which one is it?",
  },
  {
    id: "bee",
    target: { word: "BEE", emoji: "🐝" },
    match: { word: "TREE", emoji: "🌳" },
    decoys: [{ word: "CAR", emoji: "🚗" }, { word: "MOON", emoji: "🌙" }],
    family: "-ee",
    script:
      "A busy little bee! [buzzing, then giggles] Bee… tree. Both end with that long eee sound!",
    prompt: "Which one rhymes with bee? [whispers] Bee… eee, eee. Point to it!",
  },
  {
    id: "star",
    target: { word: "STAR", emoji: "⭐" },
    match: { word: "CAR", emoji: "🚗" },
    decoys: [{ word: "BALL", emoji: "⚽" }, { word: "CAKE", emoji: "🎂" }],
    family: "-ar",
    script:
      "Twinkle, twinkle, little star! [sings softly, giggles] Star… car. Listen to that arr at the end!",
    prompt: "Which one rhymes with star? [whispers] Star… arr, arr. Which one drives away?",
  },
  {
    id: "mouse",
    target: { word: "MOUSE", emoji: "🐭" },
    match: { word: "HOUSE", emoji: "🏠" },
    decoys: [{ word: "SNAKE", emoji: "🐍" }, { word: "BOAT", emoji: "⛵" }],
    family: "-ouse",
    script:
      "A tiny mouse! [squeaks, then laughs] Where does he live? Mouse… house! They rhyme beautifully.",
    prompt: "Which one rhymes with mouse? [whispers] Mouse… ouse, ouse. Can you find it?",
  },
  {
    id: "snake",
    target: { word: "SNAKE", emoji: "🐍" },
    match: { word: "CAKE", emoji: "🎂" },
    decoys: [{ word: "PIG", emoji: "🐷" }, { word: "MOON", emoji: "🌙" }],
    family: "-ake",
    script:
      "Sssss, a snake! [playful hiss, giggles] Snake… cake. Now that is a rhyme worth eating!",
    prompt: "Which one rhymes with snake? [whispers] Snake… ake, ake. Which one is yummy?",
  },
  {
    id: "goat",
    target: { word: "GOAT", emoji: "🐐" },
    match: { word: "BOAT", emoji: "⛵" },
    decoys: [{ word: "HAT", emoji: "🎩" }, { word: "BEE", emoji: "🐝" }],
    family: "-oat",
    script:
      "A hungry goat! [laughs] Goat… boat. Imagine a goat sailing a boat! [giggles] Listen to the ending.",
    prompt: "Which one rhymes with goat? [whispers] Goat… oat, oat. Which one floats?",
  },
  {
    id: "ball",
    target: { word: "BALL", emoji: "⚽" },
    match: { word: "WALL", emoji: "🧱" },
    decoys: [{ word: "FISH", emoji: "🐟" }, { word: "DOG", emoji: "🐶" }],
    family: "-all",
    script:
      "Bounce, bounce, a ball! [boing sound, giggles] Ball… wall. Careful where you kick it!",
    prompt: "Which one rhymes with ball? [whispers] Ball… all, all. Point to the right one!",
  },
  {
    id: "fox",
    target: { word: "FOX", emoji: "🦊" },
    match: { word: "BOX", emoji: "📦" },
    decoys: [{ word: "SUN", emoji: "☀️" }, { word: "TREE", emoji: "🌳" }],
    family: "-ox",
    script:
      "A sneaky fox! [sly giggle] Where is he hiding? Fox… box! Those endings sound just the same.",
    prompt: "Which one rhymes with fox? [whispers] Fox… ox, ox. Which one can he hide in?",
  },
];

/** Where the recorded clip for a round's opening line lives. */
export const rhymeIntroUrl = (id: string) => `/sounds/ecd/reading/rhyming/${id}.mp3`;

/** Where the recorded clip for a round's question lives. */
export const rhymePromptUrl = (id: string) => `/sounds/ecd/reading/rhyming/prompts/${id}.mp3`;
