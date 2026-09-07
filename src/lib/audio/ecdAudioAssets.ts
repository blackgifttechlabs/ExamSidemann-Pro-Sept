import assets from "../../data/ecdAudioAssets.json";
const index: Record<string, string> = assets;
/** Refreshed before development/build. WAV wins when both formats exist. */
export const recordedEcdAudio = (url: string): string | undefined => index[url.replace(/\.(mp3|wav)$/i, "")];
export const resolveEcdAudio = (url: string) => recordedEcdAudio(url) ?? url;
