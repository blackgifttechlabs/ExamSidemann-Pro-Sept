/**
 * The reading journey's ten topics.
 *
 * Following the same rule as the practical labs: nothing is hidden, only
 * greyed out. A child (and the parent beside them) can see the whole path
 * ahead, with everything past the first stop locked until it is built.
 */

export interface ReadingTopic {
  id: string;
  title: string;
  /** One line a four-year-old's parent can read aloud. */
  blurb: string;
  emoji: string;
  /** Tailwind classes for the card's colour band. */
  tint: string;
  ring: string;
  /** Only unlocked topics are playable; the rest render disabled. */
  route?: string;
  /** Art file to use, when it is not named for the topic id. */
  imageId?: string;
}

/**
 * The card artwork. Files are named for the topic id, so a new topic only
 * needs its picture dropped in at `public/images/ecd/topics/<id>.png`.
 */
export const readingTopicImage = (topic: { id: string; imageId?: string }) =>
  `/images/ecd/topics/${topic.imageId ?? topic.id}.png`;

export const READING_TOPICS: ReadingTopic[] = [
  {
    id: "letters",
    title: "Meet the Letters",
    blurb: "A is for apple, B is for ball",
    emoji: "🔡",
    tint: "bg-[#8ad7ff]",
    ring: "ring-[#2b90c9]",
    route: "/ecd/reading/letters",
  },
  {
    id: "phonics",
    title: "Phonics & Letter Sounds",
    blurb: "Find the letter that makes the sound",
    emoji: "🔤",
    tint: "bg-[#ffd54a]",
    ring: "ring-[#e0a800]",
    route: "/ecd/reading/phonics",
  },
  {
    id: "rhyming",
    title: "Rhyming Words",
    blurb: "Find the pairs that sound alike",
    emoji: "🐸",
    tint: "bg-[#7ee08a]",
    ring: "ring-[#3fa855]",
    route: "/ecd/reading/rhyming",
  },
  {
    id: "sight-words",
    title: "Sight Words",
    blurb: "Snap up the words we just know",
    emoji: "⚡",
    tint: "bg-[#ffa94d]",
    ring: "ring-[#d97a1f]",
  },
  {
    id: "cvc",
    title: "CVC Words",
    blurb: "Blend p – i – g into pig",
    emoji: "🧩",
    tint: "bg-[#6fc9f5]",
    ring: "ring-[#2b90c9]",
  },
  {
    id: "opposites",
    title: "Opposites",
    blurb: "Match hot with cold",
    emoji: "🔥",
    tint: "bg-[#ff8fa3]",
    ring: "ring-[#d5546c]",
  },
  {
    id: "sequencing",
    title: "Story Sequencing",
    blurb: "Put the pictures in order",
    emoji: "🌱",
    tint: "bg-[#9be36f]",
    ring: "ring-[#5fae35]",
  },
  {
    id: "word-families",
    title: "Word Families",
    blurb: "Meet the -at family",
    emoji: "🏠",
    tint: "bg-[#c9a3f5]",
    ring: "ring-[#8f5fd1]",
  },
  {
    id: "syllables",
    title: "Syllable Counting",
    blurb: "Clap din – o – saur",
    emoji: "👏",
    tint: "bg-[#ffd08a]",
    ring: "ring-[#d99a3a]",
  },
  {
    id: "sentences",
    title: "Sentence Building",
    blurb: "Build “The dog runs”",
    emoji: "🧱",
    tint: "bg-[#8ad7c8]",
    ring: "ring-[#3f9e8c]",
  },
  {
    id: "comprehension",
    title: "Reading Quizzes",
    blurb: "Read a story, then play",
    emoji: "🎯",
    tint: "bg-[#f5a3d1]",
    ring: "ring-[#c75ba0]",
  },
];
