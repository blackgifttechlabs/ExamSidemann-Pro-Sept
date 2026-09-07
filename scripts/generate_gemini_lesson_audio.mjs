import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const [, , inputArg, outputArg, voiceName = 'Kore'] = process.argv;
if (!inputArg || !outputArg) {
  throw new Error('Usage: node generate_gemini_lesson_audio.mjs <script.txt> <output.mp3> [voice]');
}

const apiKeys = [
  process.env.GEMINI_API_KEY_3,
  process.env.VITE_GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_2,
  process.env.VITE_GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY,
  process.env.VITE_GEMINI_API_KEY,
].map((value) => String(value || '').trim()).filter(Boolean);

if (!apiKeys.length) throw new Error('No Gemini API key is configured.');

const transcript = readFileSync(resolve(inputArg), 'utf8').trim();
const models = [
  'gemini-3.1-flash-tts-preview',
  'gemini-2.5-flash-preview-tts',
  'gemini-2.5-pro-preview-tts',
];

const wavFromPcm = (pcm, sampleRate = 24000) => {
  const wav = Buffer.alloc(44 + pcm.length);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + pcm.length, 4);
  wav.write('WAVE', 8);
  wav.write('fmt ', 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate * 2, 28);
  wav.writeUInt16LE(2, 32);
  wav.writeUInt16LE(16, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(pcm.length, 40);
  pcm.copy(wav, 44);
  return wav;
};

let audioPart;
let selectedModel;
let lastError = 'Gemini returned no audio.';

outer: for (const model of models) {
  for (const apiKey of [...new Set(apiKeys)]) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: transcript }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        },
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok || data?.error) {
      lastError = data?.error?.message || `Gemini request failed with status ${response.status}.`;
      continue;
    }
    audioPart = data?.candidates?.[0]?.content?.parts?.find((part) => part?.inlineData?.data)?.inlineData;
    if (audioPart?.data) {
      selectedModel = model;
      break outer;
    }
  }
}

if (!audioPart?.data) throw new Error(lastError);

const rawAudio = Buffer.from(audioPart.data, 'base64');
const wavAudio = rawAudio.subarray(0, 4).toString() === 'RIFF' ? rawAudio : wavFromPcm(rawAudio);
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'gemini-lesson-audio-'));
const temporaryWav = join(temporaryDirectory, 'narration.wav');
writeFileSync(temporaryWav, wavAudio);

const outputPath = resolve(outputArg);
const conversion = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', temporaryWav, '-codec:a', 'libmp3lame', '-b:a', '128k', outputPath], { encoding: 'utf8' });
rmSync(temporaryDirectory, { recursive: true, force: true });

if (conversion.status !== 0) throw new Error(conversion.stderr || 'FFmpeg could not encode the narration.');
console.log(`Generated ${outputPath} with ${selectedModel} and voice ${voiceName}.`);
