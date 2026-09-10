import assets from "../../data/ecdAudioAssets.json";
const index: Record<string, string> = assets;
/** Refreshed before development/build, honoring config/ecd-audio-preferences.json. */
export const recordedEcdAudio = (url: string): string | undefined => index[url.replace(/\.(mp3|wav)$/i, "")];
export const resolveEcdAudio = (url: string) => recordedEcdAudio(url) ?? url;
