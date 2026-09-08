export interface CvcRound { id: string; word: string; sounds: string; emoji: string; choices: { word: string; emoji: string }[]; script: string; }

export const CVC_INTRO = "[excited] Welcome, sound blender! Listen to three letter sounds, push them together, and tap the word they make!";
export const CVC_ROUNDS: CvcRound[] = [
  { id: "cat", word: "cat", sounds: "c · a · t", emoji: "🐱", choices: [{word:"cat",emoji:"🐱"},{word:"dog",emoji:"🐶"},{word:"sun",emoji:"☀️"}], script: "[rhythmically] C, a, t. Push the sounds together: cat! Which one is cat?" },
  { id: "dog", word: "dog", sounds: "d · o · g", emoji: "🐶", choices: [{word:"pig",emoji:"🐷"},{word:"dog",emoji:"🐶"},{word:"hen",emoji:"🐔"}], script: "[rhythmically] D, o, g. Push the sounds together: dog! Which one is dog?" },
  { id: "pig", word: "pig", sounds: "p · i · g", emoji: "🐷", choices: [{word:"cup",emoji:"🥤"},{word:"pig",emoji:"🐷"},{word:"map",emoji:"🗺️"}], script: "[rhythmically] P, i, g. Push the sounds together: pig! Which one is pig?" },
  { id: "sun", word: "sun", sounds: "s · u · n", emoji: "☀️", choices: [{word:"sun",emoji:"☀️"},{word:"bed",emoji:"🛏️"},{word:"cat",emoji:"🐱"}], script: "[rhythmically] S, u, n. Push the sounds together: sun! Which one is sun?" },
  { id: "hen", word: "hen", sounds: "h · e · n", emoji: "🐔", choices: [{word:"dog",emoji:"🐶"},{word:"map",emoji:"🗺️"},{word:"hen",emoji:"🐔"}], script: "[rhythmically] H, e, n. Push the sounds together: hen! Which one is hen?" },
  { id: "cup", word: "cup", sounds: "c · u · p", emoji: "🥤", choices: [{word:"pig",emoji:"🐷"},{word:"cup",emoji:"🥤"},{word:"sun",emoji:"☀️"}], script: "[rhythmically] C, u, p. Push the sounds together: cup! Which one is cup?" },
  { id: "map", word: "map", sounds: "m · a · p", emoji: "🗺️", choices: [{word:"map",emoji:"🗺️"},{word:"hen",emoji:"🐔"},{word:"bed",emoji:"🛏️"}], script: "[rhythmically] M, a, p. Push the sounds together: map! Which one is map?" },
  { id: "bed", word: "bed", sounds: "b · e · d", emoji: "🛏️", choices: [{word:"cat",emoji:"🐱"},{word:"bed",emoji:"🛏️"},{word:"cup",emoji:"🥤"}], script: "[rhythmically] B, e, d. Push the sounds together: bed! Which one is bed?" },
];
export const cvcIntroUrl = "/sounds/ecd/reading/cvc/intro.mp3";
export const cvcPromptUrl = (id: string) => `/sounds/ecd/reading/cvc/prompts/${id}.mp3`;
