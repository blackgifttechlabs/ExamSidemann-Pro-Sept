import { phonicsLetterVoiceUrl, phonicsPromptVoiceUrl, type PhonicsLetter } from "./phonicsAlphabet";
import { playReadingLine } from "./readingVoice";

/** The two spoken lines each letter owns. Everything else lives in readingVoice. */

/** "A is for apple! …" — `onEnd` fires when the line finishes, however it finishes. */
export const playLetterIntro = (entry: PhonicsLetter, onEnd?: () => void) =>
  playReadingLine(phonicsLetterVoiceUrl(entry.letter), entry.script, onEnd);

/** "Which letter says /a/? …" */
export const playLetterPrompt = (entry: PhonicsLetter, onEnd?: () => void) =>
  playReadingLine(phonicsPromptVoiceUrl(entry.letter), entry.prompt, onEnd);
