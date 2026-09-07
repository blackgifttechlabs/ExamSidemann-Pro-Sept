/** Generate the selected monster maths recordings. Never runs during build. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const scope = args.find(arg => arg.startsWith('--scope='))?.slice(8);
if (scope && !['all', 'reading', 'missing'].includes(scope)) throw new Error('Scope must be all, reading or missing.');
const operation = args.find(arg => arg.startsWith('--operation='))?.slice(12) ?? 'addition';
if (!['addition', 'subtraction'].includes(operation)) throw new Error('Operation must be addition or subtraction.');
const config = JSON.parse(fs.readFileSync(path.join(root, `scripts/config/ecd-${scope ? "library" : operation}-tts.json`), 'utf8'));
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const clipOption = args.find(arg => arg.startsWith('--clip='));
if (args.some(arg => !['--force', '--dry-run'].includes(arg) && !arg.startsWith('--clip=') && !arg.startsWith('--operation=') && !arg.startsWith('--scope='))) {
  throw new Error(`Usage: npm run ecd:audio:${operation} -- [--dry-run] [--force] [--clip=intro]`);
}
const source = fs.readFileSync(path.join(root, 'src/features/ecd/maths/monsterMathsData.ts'), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const data = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
let clips = [
  { id: 'intro', script: data.MONSTER_INTROS[operation] },
  ...data.monsterRounds(operation).map(round => ({ id: `prompts/${round.id}`, script: round.script })),
  ...Object.entries(data.MONSTER_FEEDBACK).map(([id, script]) => ({ id, script })),
];
if (scope) {
  const rows = JSON.parse(fs.readFileSync(path.join(root, 'docs/ECD_RECORDING_CHECKLIST.json'), 'utf8'));
  const assets = JSON.parse(fs.readFileSync(path.join(root, 'src/data/ecdAudioAssets.json'), 'utf8'));
  const isReading = row => /\/(phonics|reading)\//.test(row.file);
  clips = rows.filter(row => {
    const recorded = assets[row.file.replace(/^public/, '').replace(/\.wav$/, '')];
    return scope === 'reading' ? isReading(row) : scope === 'missing' ? !recorded : isReading(row) || !recorded;
  }).sort((a,b) => Number(isReading(b)) - Number(isReading(a))).map(row => ({ id: row.file.replace('public/sounds/ecd/', '').replace(/\.wav$/, ''), script: row.script }));
}
const selected = clipOption ? clips.filter(clip => clip.id === clipOption.slice(7)) : clips;
if (!selected.length && clipOption) throw new Error('Unknown clip ID. Use intro, correct, retry, finished, or prompts/1-1, for example.');
const directory = path.join(root, scope ? "public/sounds/ecd" : `public/sounds/ecd/maths/${operation}`);
const manifestFile = path.join(directory, scope ? 'library-generation.json' : 'generation.json');
const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : { clips: {} };
const signature = clip => createHash('sha256').update(JSON.stringify({ config, script: clip.script })).digest('hex');
const outputFile = clip => path.join(directory, `${clip.id}.wav`);
const alreadyGenerated = clip => {
  const file = outputFile(clip);
  if (!fs.existsSync(file) || manifest.clips[clip.id]?.signature !== signature(clip)) return false;
  return manifest.clips[clip.id].sha256 === createHash('sha256').update(fs.readFileSync(file)).digest('hex');
};
const promptFor = clip => `# AUDIO PROFILE\nA single upbeat children's game host.\n\n# DIRECTOR'S NOTES\nStyle: ${config.style}. ${config.styleDirection}\n${config.audienceDirection}\nPerform only the transcript below, exactly as written. Do not speak these directions, headings, or bracketed performance cues. Bracketed cues describe delivery. No extra words, music, sound effects, or second speaker.\n\n# TRANSCRIPT\n${clip.script}`;
console.log(`${scope ?? operation} TTS: ${config.model}; ${config.voice}; ${config.style}; ${selected.length} clips.`);
if (dryRun) {
  for (const clip of selected) console.log(`${alreadyGenerated(clip) && !force ? 'Keep' : 'Generate'} ${clip.id}.wav: ${clip.script}`);
  process.exit(0);
}
// Read the server-side key without exposing it to the browser or logging it.
if (fs.existsSync(path.join(root, '.env'))) process.loadEnvFile(path.join(root, '.env'));
const apiKeys = [...new Set(Object.entries(process.env).filter(([name]) => /^(?:VITE_)?GEMINI_API_KEY(?:_\d+)?$/.test(name)).map(([, value]) => value?.trim()).filter(Boolean))];
if (!apiKeys.length) throw new Error('Set GEMINI_API_KEY (and optional GEMINI_API_KEY_2, _3, etc.) in .env.');
let keyIndex = 0;
for (const command of ['ffmpeg', 'ffprobe']) {
  if (spawnSync(command, ['-version'], { stdio: 'ignore' }).status !== 0) throw new Error(`${command} must be installed.`);
}
const safeError = error => apiKeys.reduce((message, key) => message.replaceAll(key, '[redacted]'), String(error?.message ?? error)).replace(/AIza[\w-]+/g, '[redacted]');

function wavFromPcm(pcm, mimeType) {
  if (pcm.subarray(0, 4).toString() === 'RIFF') return pcm;
  if (!/^audio\/(L16|pcm)/i.test(mimeType ?? '') || pcm.length % 2) throw new Error('Unexpected audio format from Gemini.');
  const rate = Number(mimeType.match(/rate=(\d+)/)?.[1] ?? 24000);
  const channels = Number(mimeType.match(/channels=(\d+)/)?.[1] ?? 1);
  const wav = Buffer.alloc(44 + pcm.length);
  wav.write('RIFF'); wav.writeUInt32LE(36 + pcm.length, 4); wav.write('WAVE', 8);
  wav.write('fmt ', 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channels, 22); wav.writeUInt32LE(rate, 24);
  wav.writeUInt32LE(rate * channels * 2, 28); wav.writeUInt16LE(channels * 2, 32);
  wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(pcm.length, 40);
  pcm.copy(wav, 44);
  return wav;
}
async function generate(clip) {
  while (keyIndex < apiKeys.length) {
  const apiKey = apiKeys[keyIndex];
  for (let attempt = 1; attempt <= 3; attempt++) {
    let response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: AbortSignal.timeout(120000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptFor(clip) }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voice } } },
          },
        }),
      });
    } catch (error) {
      // Network restrictions and timeouts should be visible, not silently billed again.
      throw new Error(`Gemini network request failed: ${safeError(error)}`);
    }
    const result = await response.json();
    if (!response.ok) {
      const quotas = (result.error?.details ?? []).flatMap(detail => detail.violations ?? []).map(violation => violation.quotaId).filter(Boolean);
      const message = `Gemini HTTP ${response.status}: ${safeError(result.error?.message ?? response.statusText)}${quotas.length ? ` Quota IDs: ${quotas.join(', ')}` : ''}`;
      if ((response.status === 429 && /limit:\s*0|daily|per.?day/i.test(message)) || response.status === 403 || response.status === 401 || /API_KEY_INVALID/.test(JSON.stringify(result.error?.details ?? []))) {
        keyIndex++;
        if (keyIndex >= apiKeys.length) throw new Error(`All ${apiKeys.length} configured Gemini keys are unavailable. Last response: ${message}`);
        console.log(`Key quota/access unavailable; continuing with configured key ${keyIndex + 1}/${apiKeys.length}.`);
        break;
      }
      if ((response.status === 429 || response.status >= 500) && attempt < 3) {
        console.log(`Temporary Gemini HTTP ${response.status} for ${clip.id}; retry ${attempt}/2 in 20 seconds.`);
        await delay(20000);
        continue;
      }
      throw new Error(message);
    }
    const candidate = result.candidates?.[0];
    if (candidate?.finishReason !== 'STOP') throw new Error(`Incomplete generation for ${clip.id}: ${candidate?.finishReason ?? 'no candidate'}.`);
    const parts = candidate.content?.parts?.filter(part => part.inlineData?.data).map(part => part.inlineData) ?? [];
    if (!parts.length) throw new Error(`Gemini returned no audio for ${clip.id}.`);
    return { wav: wavFromPcm(Buffer.concat(parts.map(part => Buffer.from(part.data, 'base64'))), parts[0].mimeType), model: result.modelVersion ?? config.model };
  }
  }
  throw new Error('No configured Gemini key has available quota.');
}
// These three lines are identical in both games. Reuse the original generated
// performance, preserving its provenance, rather than spending quota to repeat it.
if (!scope && operation === 'subtraction' && !force) {
  const additionDirectory = path.join(root, 'public/sounds/ecd/maths/addition');
  const additionManifestFile = path.join(additionDirectory, 'generation.json');
  const additionManifest = fs.existsSync(additionManifestFile) ? JSON.parse(fs.readFileSync(additionManifestFile, 'utf8')) : { clips: {} };
  for (const clip of selected.filter(clip => Object.hasOwn(data.MONSTER_FEEDBACK, clip.id))) {
    const previous = additionManifest.clips[clip.id];
    const previousFile = path.join(additionDirectory, `${clip.id}.wav`);
    if (fs.existsSync(outputFile(clip)) || !previous || !fs.existsSync(previousFile)) continue;
    const bytes = fs.readFileSync(previousFile);
    if (previous.script !== clip.script || previous.model !== config.model || previous.voice !== config.voice || previous.style !== config.style || createHash('sha256').update(bytes).digest('hex') !== previous.sha256) continue;
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(outputFile(clip), bytes);
    manifest.clips[clip.id] = { ...previous, signature: signature(clip), sourceSignature: previous.signature, reusedFrom: `/sounds/ecd/maths/addition/${clip.id}.wav` };
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`Reused matching ${clip.id}.wav from addition.`);
  }
}
let failure;
try {
  for (const clip of selected) {
    if (!force && alreadyGenerated(clip)) { console.log(`Keep ${clip.id}.wav (unchanged).`); continue; }
    if (!force && fs.existsSync(outputFile(clip)) && !manifest.clips[clip.id]) {
      throw new Error(`${clip.id}.wav already exists without generation metadata. Use --force to replace it intentionally.`);
    }
    console.log(`Generating ${clip.id}.wav…`);
    const result = await generate(clip);
    fs.mkdirSync(path.dirname(outputFile(clip)), { recursive: true });
    const rawFile = outputFile(clip) + '.raw.wav';
    const stagedFile = outputFile(clip) + '.staged.wav';
    try {
      fs.writeFileSync(rawFile, result.wav);
      const filter = `silenceremove=start_periods=1:start_duration=0.02:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_duration=0.06:start_threshold=-50dB,areverse,loudnorm=I=${config.output.loudnessLufs}:TP=${config.output.truePeakDb}:LRA=11,apad=pad_dur=0.12`;
      const converted = spawnSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', rawFile, '-af', filter, '-ar', String(config.output.sampleRate), '-ac', '1', '-c:a', 'pcm_s16le', stagedFile], { encoding: 'utf8' });
      if (converted.status !== 0) throw new Error('FFmpeg could not prepare ' + clip.id);
      const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'json', stagedFile], { encoding: 'utf8' });
      const seconds = Number(JSON.parse(probe.stdout).format?.duration);
      const words = clip.script.replace(/\[[^\]]*\]/g, '').trim().split(/\s+/).length;
      if (!Number.isFinite(seconds) || seconds < Math.max(0.7, words / 5) || seconds > Math.max(15, words * 1.5)) throw new Error(`Suspicious clip duration for ${clip.id}: ${seconds}s; output not saved.`);
      const contents = fs.readFileSync(stagedFile);
      fs.renameSync(stagedFile, outputFile(clip));
      manifest.clips[clip.id] = { script: clip.script, model: result.model, voice: config.voice, style: config.style, generatedAt: new Date().toISOString(), seconds, signature: signature(clip), sha256: createHash('sha256').update(contents).digest('hex') };
      fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
      console.log(`Saved ${clip.id}.wav (${seconds.toFixed(2)}s).`);
    } finally {
      fs.rmSync(rawFile, { force: true }); fs.rmSync(stagedFile, { force: true });
    }
  }
} catch (error) { failure = safeError(error); }
// Even an interrupted batch wires up the successfully completed recordings.
const prepared = spawnSync(process.execPath, ['scripts/prepareEcdAudio.mjs'], { cwd: root, stdio: 'inherit' });
if (!scope && operation === 'addition') {
  const cues = spawnSync(process.execPath, ['scripts/buildEcdAdditionCues.mjs'], { cwd: root, stdio: 'inherit' });
  if (cues.status !== 0) failure ??= 'Could not refresh the addition animation cues.';
}
if (failure) { console.error(failure); process.exitCode = 1; }
else if (prepared.status !== 0) { console.error('Could not refresh the audio index.'); process.exitCode = 1; }
else console.log(scope ? `ECD ${scope} recordings generated and indexed.` : `${operation} recordings generated and connected to /ecd/maths/${operation}.`);
