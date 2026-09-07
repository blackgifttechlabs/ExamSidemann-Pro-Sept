/**
 * The maths journey's topics.
 *
 * Same rule as the reading list and the practical labs: nothing is hidden.
 * Every game a child will ever meet is on the board from day one, and the ones
 * that are not built yet are drawn greyed out rather than left off.
 *
 * Card art lives at `public/images/ecd/maths/topics/<id>.png` — see
 * `docs/ECD_MATHS_IMAGE_PROMPTS.md` for the picture to draw for each one.
 */

export interface MathsTopic {
  id: string;
  title: string;
  /** One line a parent can read aloud, and the skill it teaches. */
  blurb: string;
  emoji: string;
  /** Tailwind classes for the card's colour band and ring. */
  tint: string;
  ring: string;
  /** Only unlocked topics are playable; the rest render disabled. */
  route?: string;
  /** Art file to use, when it is not named for the topic id. */
  imageId?: string;
}

export const mathsTopicImage = (topic: { id: string; imageId?: string }) =>
  `/images/ecd/maths/topics/${topic.imageId ?? topic.id}.png`;

export const MATHS_TOPICS: MathsTopic[] = [
  { id: "addition", title: "Addition · Monster Picnic", blurb: "Count two groups of monsters together", emoji: "👾", tint: "bg-[#bcb0f4]", ring: "ring-[#8270c1]", route: "/ecd/maths/addition" },
  { id: "subtraction", title: "Subtraction · Hide and Seek", blurb: "Find how many monsters are left", emoji: "👾", tint: "bg-[#8bdfc7]", ring: "ring-[#409f91]", route: "/ecd/maths/subtraction" },
  {
    id: "present-count",
    title: "Present Party",
    blurb: "Open the boxes and count 1 to 5",
    emoji: "🎁",
    tint: "bg-[#ff8fa3]",
    ring: "ring-[#d5546c]",
    route: "/ecd/maths/present-count",
  },
  {
    id: "star-wish",
    title: "Wish on the Stars",
    blurb: "Touch the stars in counting order",
    emoji: "⭐",
    tint: "bg-[#c9a3f5]",
    ring: "ring-[#8f5fd1]",
    route: "/ecd/maths/star-wish",
  },
  {
    id: "trace-numbers",
    title: "Trace the Numbers",
    blurb: "Write 0 to 5 with your finger",
    emoji: "✏️",
    tint: "bg-[#ffd54a]",
    ring: "ring-[#e0a800]",
    route: "/ecd/maths/trace-numbers",
  },
  {
    id: "wake-up",
    title: "Wake the Sleepy Yippies",
    blurb: "Poke exactly the right number awake",
    emoji: "😴",
    tint: "bg-[#8ad7ff]",
    ring: "ring-[#2b90c9]",
    route: "/ecd/maths/wake-up",
  },
  {
    id: "subitise",
    title: "Quick Eyes",
    blurb: "See how many without counting",
    emoji: "🐱",
    tint: "bg-[#ffa94d]",
    ring: "ring-[#d97a1f]",
    route: "/ecd/maths/subitise",
  },
  {
    id: "one-more",
    title: "Hoppy's River Hop",
    blurb: "Find the number that is one more",
    emoji: "🐸",
    tint: "bg-[#7ee08a]",
    ring: "ring-[#3fa855]",
    route: "/ecd/maths/one-more",
  },
  {
    id: "count-back",
    title: "Rocket Countdown",
    blurb: "Count backwards from ten",
    emoji: "🚀",
    tint: "bg-[#8ad7c8]",
    ring: "ring-[#3f9e8c]",
    route: "/ecd/maths/count-back",
  },
  {
    id: "cave-add",
    title: "Cave of Glowing Orbs",
    blurb: "Put two groups together to add",
    emoji: "🔮",
    tint: "bg-[#a3b6f5]",
    ring: "ring-[#5f76d1]",
    route: "/ecd/maths/cave-add",
  },
  {
    id: "ten-frame",
    title: "Fill the Ten Frame",
    blurb: "Build the sum on a ten frame",
    emoji: "🧺",
    tint: "bg-[#9be36f]",
    ring: "ring-[#5fae35]",
    route: "/ecd/maths/ten-frame",
  },
  {
    id: "above-below",
    title: "Above and Below",
    blurb: "Find what is above, below and under",
    emoji: "🔎",
    tint: "bg-[#f5a3d1]",
    ring: "ring-[#c75ba0]",
    route: "/ecd/maths/above-below",
  },
  {
    id: "number-drive",
    title: "Number Drive",
    blurb: "Drive and collect the numbers in order",
    emoji: "🚗",
    tint: "bg-[#ffd08a]",
    ring: "ring-[#d99a3a]",
    route: "/ecd/maths/number-drive",
  },
  {
    id: "shapes",
    title: "Shape Hunt",
    blurb: "Circles, squares and triangles",
    emoji: "🔺",
    tint: "bg-[#6fc9f5]",
    ring: "ring-[#2b90c9]",
  },
  {
    id: "sorting",
    title: "Sort and Match",
    blurb: "Put the same things together",
    emoji: "🧦",
    tint: "bg-[#ffb3c1]",
    ring: "ring-[#d5546c]",
  },
  {
    id: "measuring",
    title: "Big, Small, Long, Short",
    blurb: "Compare and measure things",
    emoji: "📏",
    tint: "bg-[#d7c9a3]",
    ring: "ring-[#a08f5f]",
  },
];
