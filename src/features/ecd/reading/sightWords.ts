export interface SightWordRound {
  id: string;
  word: string;
  emoji: string;
  sentence: string;
  choices: string[];
  script: string;
}

export const SIGHT_WORDS_INTRO =
  "[excited] Welcome, word spotter! Sight words are words we learn to know in a snap. Listen, look at the sentence, and tap the missing word!";

export const SIGHT_WORD_ROUNDS: SightWordRound[] = [
  { id: "the", word: "the", emoji: "🐱", sentence: "___ cat is sleeping.", choices: ["the", "and", "is"], script: "[brightly] The. The cat is sleeping. Which word is the?" },
  { id: "i", word: "I", emoji: "🤸", sentence: "___ can jump.", choices: ["a", "I", "to"], script: "[playfully] I. I can jump. Which word is I?" },
  { id: "can", word: "can", emoji: "🐦", sentence: "The bird ___ fly.", choices: ["see", "can", "my"], script: "[with energy] Can. The bird can fly. Which word is can?" },
  { id: "see", word: "see", emoji: "🌈", sentence: "I ___ a rainbow.", choices: ["go", "we", "see"], script: "[amazed] See. I see a rainbow. Which word is see?" },
  { id: "like", word: "like", emoji: "🍎", sentence: "I ___ apples.", choices: ["like", "the", "go"], script: "[happily] Like. I like apples. Which word is like?" },
  { id: "my", word: "my", emoji: "🧸", sentence: "This is ___ teddy.", choices: ["we", "my", "can"], script: "[warmly] My. This is my teddy. Which word is my?" },
  { id: "we", word: "we", emoji: "🛝", sentence: "___ play together.", choices: ["see", "the", "we"], script: "[cheerfully] We. We play together. Which word is we?" },
  { id: "go", word: "go", emoji: "🚌", sentence: "Let us ___ home.", choices: ["go", "like", "I"], script: "[excited] Go. Let us go home. Which word is go?" },
];

export const sightWordsIntroUrl = "/sounds/ecd/reading/sight-words/intro.mp3";
export const sightWordPromptUrl = (id: string) => `/sounds/ecd/reading/sight-words/prompts/${id}.mp3`;
