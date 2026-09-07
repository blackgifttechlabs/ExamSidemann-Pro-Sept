/**
 * Every maths game's rounds, and every line it says.
 *
 * The rounds and their scripts live together in one place so the spoken lines
 * can be checked against the maths at a glance — and so
 * `docs/ECD_MATHS_VOICE_SCRIPTS.md` has a single source to be kept in step
 * with. The `id` on a round is also the basename of its recording:
 *
 *   `public/sounds/ecd/maths/<game>/<id>.mp3`          — the teaching line
 *   `public/sounds/ecd/maths/<game>/prompts/<id>.mp3`  — the question
 *
 * Until a file exists the browser's own voice reads the script, so every game
 * is fully playable today.
 */

/** The two lines almost every round owns. */
export interface SpokenRound {
  /** Stable id — also the recorded file's basename. */
  id: string;
  /** Said when the round opens: what is happening, and what it teaches. */
  script: string;
  /** The question itself, repeated by the speaker button. */
  prompt: string;
}

/* ------------------------------------------------------------------ 1 · Present Party
   Counting a set of 1 to 5 objects, one tap per object, then naming how many
   there were. The one-to-one touch is the whole point: a child who counts
   without touching counts the same teddy twice. */

export interface PresentRound extends SpokenRound {
  /** How many things are in the box. */
  count: number;
  /** The thing itself, one per round so the count is not the only thing that changes. */
  emoji: string;
  /** Plural, as the voice says it. */
  word: string;
}

export const PRESENT_INTRO =
  "[excited gasp] Gerald has brought a pile of presents! Tap a box to open it, then touch each toy to count. Here we go!";

export const PRESENT_ROUNDS: PresentRound[] = [
  {
    id: "duck",
    count: 1,
    emoji: "🦆",
    word: "duck",
    script: "[rustling paper, delighted giggle] Ooh! Just one little duck. Touch him and count with me.",
    prompt: "Touch the duck. How many ducks are in the box?",
  },
  {
    id: "teddy",
    count: 2,
    emoji: "🧸",
    word: "teddies",
    script: "[happy gasp] Teddy bears! Touch one, then the other, and count them out loud.",
    prompt: "Touch each teddy. How many teddies?",
  },
  {
    id: "ball",
    count: 3,
    emoji: "⚽",
    word: "balls",
    script: "[bouncy laugh] Balls! Bouncy, bouncy balls. Touch every single one as you count.",
    prompt: "Touch each ball. How many balls are there?",
  },
  {
    id: "car",
    count: 4,
    emoji: "🚗",
    word: "cars",
    script: "[car noises, giggles] Brrrm! Little cars. Touch them one at a time — do not miss one!",
    prompt: "Touch each car. How many cars?",
  },
  {
    id: "cupcake",
    count: 5,
    emoji: "🧁",
    word: "cupcakes",
    script: "[gasp, then a slurp] Cupcakes! Yum. Let us count every one before we eat them.",
    prompt: "Touch each cupcake. How many cupcakes?",
  },
  {
    id: "drum",
    count: 4,
    emoji: "🥁",
    word: "drums",
    script: "[drum roll, laughs] Boom, boom! Look at all these drums. Touch each one and count.",
    prompt: "Touch each drum. How many drums?",
  },
];

/* ------------------------------------------------------------------ 2 · Wish on the Stars
   Number recognition and forward order. The numerals are on the stars, so the
   child has to read them rather than just tap left to right — the stars are
   deliberately scattered, never in a line. */

export interface StarRound extends SpokenRound {
  /** How high this round counts. */
  count: number;
  /** Where each star sits, as a percentage of the board, index 0 = star one. */
  positions: { x: number; y: number }[];
}

export const STAR_INTRO =
  "[soft, magical whisper] Look up! The wishing stars are out. Touch them in counting order and your wish will come true.";

export const STAR_ROUNDS: StarRound[] = [
  {
    id: "three",
    count: 3,
    positions: [
      { x: 26, y: 58 },
      { x: 50, y: 32 },
      { x: 74, y: 56 },
    ],
    script: "[whispers] Three little stars are twinkling. Start at one.",
    prompt: "Touch star one, then two, then three.",
  },
  {
    id: "four",
    count: 4,
    positions: [
      { x: 20, y: 40 },
      { x: 42, y: 66 },
      { x: 62, y: 30 },
      { x: 80, y: 62 },
    ],
    script: "[twinkling giggle] Four stars now, and they are hiding all over the sky!",
    prompt: "Find one, two, three, four — in order!",
  },
  {
    id: "five",
    count: 5,
    positions: [
      { x: 16, y: 62 },
      { x: 34, y: 34 },
      { x: 52, y: 60 },
      { x: 70, y: 30 },
      { x: 86, y: 56 },
    ],
    script: "[amazed] Five wishing stars! Read the number on each one before you touch it.",
    prompt: "Touch them one, two, three, four, five.",
  },
  {
    id: "five-high",
    count: 5,
    positions: [
      { x: 24, y: 30 },
      { x: 46, y: 58 },
      { x: 66, y: 28 },
      { x: 34, y: 70 },
      { x: 80, y: 52 },
    ],
    script: "[playful] These ones are being cheeky and hiding. Look carefully at the numbers!",
    prompt: "Which star says one? Start there.",
  },
];

/* ------------------------------------------------------------------ 3 · Trace the Numbers
   Number formation. Each numeral is one or two strokes, drawn in the order a
   child should write them, with the pencil following the finger. */

export interface TraceRound extends SpokenRound {
  /** The numeral being written. */
  value: number;
  /**
   * The strokes, in writing order, as SVG paths in a 0 0 100 160 box. Two
   * strokes means lift the pencil once — which is exactly what four needs.
   */
  strokes: string[];
}

export const TRACE_INTRO =
  "[cheerful] Time to write our numbers! Put your finger on the big green dot and follow the dashes. I will help you.";

export const TRACE_ROUNDS: TraceRound[] = [
  {
    id: "zero",
    value: 0,
    strokes: ["M50 24 C 28 24 22 52 22 80 C 22 108 28 136 50 136 C 72 136 78 108 78 80 C 78 52 72 24 50 24"],
    script: "[softly] Zero! Zero means none at all. Start at the top and go all the way round.",
    prompt: "Trace zero. Round and round, back to the top.",
  },
  {
    id: "one",
    value: 1,
    strokes: ["M32 44 L54 24 L54 136"],
    script: "[bright] Number one! One is easy — a little slide down, then straight down.",
    prompt: "Trace the number one. Down, down, down!",
  },
  {
    id: "two",
    value: 2,
    strokes: ["M24 46 C 24 22 50 16 66 24 C 84 34 80 58 62 74 L24 136 L82 136"],
    script: "[playful] Number two! Around like a swan, then slide down and across the water.",
    prompt: "Trace the number two. Around, down, and across!",
  },
  {
    id: "three",
    value: 3,
    strokes: [
      "M26 42 C 32 22 62 18 74 32 C 86 46 74 66 52 70 C 78 70 90 88 84 108 C 76 132 42 138 26 122",
    ],
    script: "[giggles] Number three! Two little tummies, one on top of the other.",
    prompt: "Trace three. Around the top, around the bottom!",
  },
  {
    id: "four",
    value: 4,
    strokes: ["M66 24 L24 96 L84 96", "M66 56 L66 136"],
    script: "[counting rhythm] Number four! Down, across… then lift your finger and go down again.",
    prompt: "Trace four. Down, across, lift, down!",
  },
  {
    id: "five",
    value: 5,
    strokes: ["M78 26 L36 26 L30 74 C 52 60 78 68 84 92 C 90 118 66 140 34 128"],
    script: "[bright] Number five! Down the back, round the big tummy, then a hat on top.",
    prompt: "Trace five. Down, around, and a hat!",
  },
];

/* ------------------------------------------------------------------ 4 · Wake the Sleepy Yippies
   Counting *out* a set of a given size — a different skill from counting a set
   you are given, and the one children find harder. */

export interface WakeRound extends SpokenRound {
  /** How many the child must wake. */
  ask: number;
  /** How many are asleep in the nest altogether. */
  total: number;
}

export const WAKE_INTRO =
  "[whispers] Shhh… the Yippies are all fast asleep. [comic snore] We need to wake up just the right number. Poke them gently!";

export const WAKE_ROUNDS: WakeRound[] = [
  {
    id: "one",
    ask: 1,
    total: 3,
    script: "[very quiet] Start with just one Yippie. One little poke!",
    prompt: "Wake up one Yippie, then ring the bell.",
  },
  {
    id: "two",
    ask: 2,
    total: 4,
    script: "[whispering] Two Yippies are wanted for breakfast. Just two!",
    prompt: "Wake up two Yippies, then ring the bell.",
  },
  {
    id: "three",
    ask: 3,
    total: 5,
    script: "[whispering, giggling] Three Yippies are going out to play. Only three!",
    prompt: "Wake up three Yippies, then ring the bell.",
  },
  {
    id: "four",
    ask: 4,
    total: 6,
    script: "[excited whisper] Four Yippies for the band! Count as you poke.",
    prompt: "Wake up four Yippies, then ring the bell.",
  },
  {
    id: "five",
    ask: 5,
    total: 6,
    script: "[whispering] Five Yippies are going swimming. Careful — that is nearly all of them!",
    prompt: "Wake up five Yippies, then ring the bell.",
  },
  {
    id: "six",
    ask: 6,
    total: 6,
    script: "[laughs] Breakfast is ready! This time wake up every single one.",
    prompt: "Wake up six Yippies, then ring the bell.",
  },
];

/* ------------------------------------------------------------------ 5 · Quick Eyes
   Subitising: seeing how many without counting. The dots hold still, but the
   patterns are the dice patterns a child will meet all their life. */

export interface SubitiseRound extends SpokenRound {
  count: number;
  /** `dice` uses the pip layout; `scatter` breaks it up so the pattern is not memorised. */
  pattern: "dice" | "scatter" | "line";
}

export const SUBITISE_INTRO =
  "[urgent, playful] Oh no! The kittens are stuck in cages. [meow] Look quickly, say how many, and the door pops open!";

export const SUBITISE_ROUNDS: SubitiseRound[] = [
  { id: "two", count: 2, pattern: "dice", script: "[playful] Start with two dots. Quick eyes!", prompt: "How many dots?" },
  {
    id: "three",
    count: 3,
    pattern: "dice",
    script: "[quick and bright] Quick eyes ready? Do not count — just look!",
    prompt: "How many dots? Say it fast!",
  },
  { id: "four", count: 4, pattern: "scatter", script: "[giggles] These dots are all over the place. Look at the whole picture.", prompt: "How many dots?" },
  { id: "five", count: 5, pattern: "dice", script: "[excited] Ooh, this one is bigger. Just look at the shape!", prompt: "How many dots? Quick!" },
  { id: "six", count: 6, pattern: "dice", script: "[amazed] Two rows of three! Can you see it without counting?", prompt: "How many dots altogether?" },
  { id: "seven", count: 7, pattern: "scatter", script: "[encouraging] Bigger now. Try five and two more.", prompt: "How many dots?" },
  { id: "eight", count: 8, pattern: "line", script: "[bright] Four and four. Look at the two rows!", prompt: "How many dots?" },
  { id: "ten", count: 10, pattern: "line", script: "[cheering] The last kitten! Five on top, five below.", prompt: "How many dots? Set that kitten free!" },
];

/* ------------------------------------------------------------------ 6 · Hoppy's River Hop
   One more. Hoppy only jumps to the lily pad that is one bigger than the one
   she is on, so "one more" is a move rather than a fact to be recited. */

export interface HopRound extends SpokenRound {
  /** The pad Hoppy is standing on. */
  from: number;
}

export const HOP_INTRO =
  "[cheerful ribbit] This is Hoppy! She wants to cross the river, but she can only jump to the pad that is ONE MORE. Will you help her?";

export const HOP_ROUNDS: HopRound[] = [
  { id: "one", from: 1, script: "[ribbit] Hoppy is on pad one. One more than one is…?", prompt: "Which pad is one more than one?" },
  { id: "two", from: 2, script: "[splashing giggle] Now she is on two. Count on: two… then?", prompt: "Which pad is one more than two?" },
  { id: "three", from: 3, script: "[ribbit] Pad three! What comes straight after three?", prompt: "Which pad is one more than three?" },
  { id: "four", from: 4, script: "[encouraging] Four. Say the next number in the count.", prompt: "Which pad is one more than four?" },
  { id: "five", from: 5, script: "[excited] Halfway! One more than five is…?", prompt: "Which pad is one more than five?" },
  { id: "six", from: 6, script: "[ribbit ribbit] Six. Keep counting on!", prompt: "Which pad is one more than six?" },
  { id: "seven", from: 7, script: "[whispers] Nearly there. One more than seven!", prompt: "Which pad is one more than seven?" },
  { id: "eight", from: 8, script: "[cheering] Last jump! One more than eight and she is home!", prompt: "Which pad is one more than eight?" },
];

/* ------------------------------------------------------------------ 7 · Rocket Countdown
   Counting backwards, which is much harder than counting forwards and is what
   makes taking away possible later. */

export interface CountBackRound extends SpokenRound {
  /** The run of numbers, with the missing one written as null. */
  sequence: (number | null)[];
}

export const COUNTBACK_INTRO =
  "[rocket rumble, excited] The rocket is ready to blast off! But the countdown has a number missing. Can you fix it?";

export const COUNTBACK_ROUNDS: CountBackRound[] = [
  { id: "r3", sequence: [5, 4, 3, null], script: "[whispers] Five, four, three… and then?", prompt: "What comes after three when we count back?" },
  { id: "r2", sequence: [8, null, 6, 5], script: "[counting backwards] Eight… hmm, then six. Something is missing!", prompt: "Which number goes between eight and six?" },
  { id: "r1", sequence: [10, 9, null, 7], script: "[counting] Ten, nine… oh no, what comes next?", prompt: "Which number is missing? Ten, nine, what, seven?" },
  { id: "r4", sequence: [7, 6, null, 4], script: "[rocket engine hum] Seven, six… quick, the number is missing!", prompt: "Which number is missing? Seven, six, what, four?" },
  { id: "r5", sequence: [null, 3, 2, 1], script: "[playful] We are counting down to blast off. What do we start on?", prompt: "Which number comes before three?" },
  { id: "r6", sequence: [10, null, 8, 7], script: "[deep countdown voice] Ten… something… eight, seven!", prompt: "Which number goes between ten and eight?" },
];

/* ------------------------------------------------------------------ 8 · Cave of Glowing Orbs
   Addition as putting two groups together and counting them all. Nothing is
   written as a sum until after the child has counted — the picture first,
   then the numeral. */

export interface AddRound extends SpokenRound {
  a: number;
  b: number;
}

export const CAVE_INTRO =
  "[echoing whisper] It is dark in here! [gasp] Look — glowing orbs. If we put both piles together the cave lights up. Tap the piles!";

export const CAVE_ROUNDS: AddRound[] = [
  { id: "a2-1", a: 2, b: 1, script: "[echo] Two orbs here… and one over there.", prompt: "Put them together. How many orbs altogether?" },
  { id: "a3-2", a: 3, b: 2, script: "[echo, excited] Three orbs and two orbs! Count them all.", prompt: "How many orbs altogether?" },
  { id: "a4-1", a: 4, b: 1, script: "[whispers] Four glowing orbs, and one little one.", prompt: "How many orbs altogether?" },
  { id: "a3-3", a: 3, b: 3, script: "[amazed] Three and three! Both piles are the same.", prompt: "How many orbs altogether?" },
  { id: "a5-2", a: 5, b: 2, script: "[echo] Five here, two there. Start at five and count on.", prompt: "How many orbs altogether?" },
  { id: "a4-4", a: 4, b: 4, script: "[cheering echo] Four and four — the brightest one yet!", prompt: "How many orbs altogether?" },
];

/* ------------------------------------------------------------------ 9 · Fill the Ten Frame
   The same addition, on the ten frame a child will use right through infant
   school: two colours in ten boxes, so the total can be seen as well as counted. */

export const FRAME_INTRO =
  "[bright] Here is our ten frame — ten little boxes. Drop in the blue stones first, then the yellow ones, and see what we get!";

export const FRAME_ROUNDS: AddRound[] = [
  { id: "f3-2", a: 3, b: 2, script: "[cheerful] Put in three blue stones… then two yellow ones.", prompt: "How many stones are in the frame altogether?" },
  { id: "f5-1", a: 5, b: 1, script: "[happy] Five blue fills the whole top row. Then just one yellow.", prompt: "How many stones altogether?" },
  { id: "f4-3", a: 4, b: 3, script: "[bright] Four blue, then three yellow. Fill the top row first!", prompt: "How many stones altogether?" },
  { id: "f2-6", a: 2, b: 6, script: "[playful] Only two blue this time — but six yellow!", prompt: "How many stones altogether?" },
  { id: "f7-2", a: 7, b: 2, script: "[encouraging] Seven blue. That is more than a row! Then two yellow.", prompt: "How many stones altogether?" },
  { id: "f5-5", a: 5, b: 5, script: "[excited gasp] Five and five — I think this one fills every box!", prompt: "How many stones altogether?" },
];

/* ------------------------------------------------------------------ 10 · Above and Below
   Position words. Every round shows the same three places — above, on and
   under — so the word is the only thing the child has to work out. */

export type Place = "above" | "on" | "under";

export interface PositionRound extends SpokenRound {
  /** What the objects are arranged around — the game draws it. */
  furniture: string;
  /** Exactly one object in each place. */
  items: { place: Place; emoji: string; word: string }[];
  target: Place;
}

export const POSITION_INTRO =
  "[curious] Let us play a looking game! Some things are ABOVE, some are ON, and some are hiding UNDER. Listen carefully!";

export const POSITION_ROUNDS: PositionRound[] = [
  {
    id: "table-above",
    furniture: "table",
    items: [
      { place: "above", emoji: "🎈", word: "balloon" },
      { place: "on", emoji: "🍎", word: "apple" },
      { place: "under", emoji: "🐱", word: "cat" },
    ],
    target: "above",
    script: "[playful] Look at the table. A balloon, an apple and a sleepy cat.",
    prompt: "Tap the thing that is ABOVE the table.",
  },
  {
    id: "table-under",
    furniture: "table",
    items: [
      { place: "above", emoji: "🦋", word: "butterfly" },
      { place: "on", emoji: "🍰", word: "cake" },
      { place: "under", emoji: "🐶", word: "dog" },
    ],
    target: "under",
    script: "[giggles] Someone is hiding down low. Have a look!",
    prompt: "Tap the thing that is UNDER the table.",
  },
  {
    id: "shelf-on",
    furniture: "shelf",
    items: [
      { place: "above", emoji: "🕊️", word: "bird" },
      { place: "on", emoji: "📚", word: "books" },
      { place: "under", emoji: "🧦", word: "socks" },
    ],
    target: "on",
    script: "[bright] Here is a shelf. Something is sitting right on top of it.",
    prompt: "Tap the thing that is ON the shelf.",
  },
  {
    id: "box-above",
    furniture: "box",
    items: [
      { place: "above", emoji: "🪁", word: "kite" },
      { place: "on", emoji: "🐤", word: "chick" },
      { place: "under", emoji: "🐭", word: "mouse" },
    ],
    target: "above",
    script: "[wind sound, laughs] A kite up in the sky, a chick on the box, and a mouse under it!",
    prompt: "Tap the thing that is ABOVE the box.",
  },
  {
    id: "chair-under",
    furniture: "chair",
    items: [
      { place: "above", emoji: "☁️", word: "cloud" },
      { place: "on", emoji: "🧸", word: "teddy" },
      { place: "under", emoji: "⚽", word: "ball" },
    ],
    target: "under",
    script: "[whispers] Where did that ball roll to? Look down low!",
    prompt: "Tap the thing that is UNDER the chair.",
  },
  {
    id: "shelf-on-2",
    furniture: "shelf",
    items: [
      { place: "above", emoji: "🌙", word: "moon" },
      { place: "on", emoji: "🪴", word: "plant" },
      { place: "under", emoji: "🥾", word: "boots" },
    ],
    target: "on",
    script: "[soft] Night time! The moon is up, the plant is resting, the boots are put away.",
    prompt: "Tap the thing that is ON the shelf.",
  },
];
