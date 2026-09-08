import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const lesson = process.argv[2];
if (!['meet-letters', 'phonics', 'rhyming', 'sight-words', 'cvc'].includes(lesson)) {
  throw new Error('Unknown reading lesson.');
}

const rows = JSON.parse(fs.readFileSync('docs/ECD_RECORDING_CHECKLIST.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('public/sounds/ecd/library-generation.json', 'utf8'));
const belongs = {
  'meet-letters': file => file.includes('/phonics/letters/') || file.includes('/phonics/feedback/'),
  phonics: file => file.includes('/phonics/prompts/') || file.includes('/phonics/feedback/'),
  rhyming: file => file.includes('/reading/rhyming/') || file.includes('/phonics/feedback/'),
  'sight-words': file => file.includes('/reading/sight-words/'),
  cvc: file => file.includes('/reading/cvc/'),
}[lesson];
const expected = rows.filter(row => belongs(row.file));
const missing = [];

for (const row of expected) {
  const id = row.file.replace('public/sounds/ecd/', '').replace(/\.wav$/, '');
  const file = path.resolve(row.file);
  const record = manifest.clips[id];
  if (!fs.existsSync(file) || !record) {
    missing.push(id);
    continue;
  }
  const bytes = fs.readFileSync(file);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, `${id}: hash mismatch`);
  assert.equal(record.script, row.script, `${id}: script changed after generation`);
  assert.equal(record.model, 'gemini-3.1-flash-tts-preview', `${id}: wrong model`);
  assert.equal(record.voice, 'Puck', `${id}: wrong voice`);
  assert.equal(record.style, 'Promo/Hype', `${id}: wrong style`);
  const probe = spawnSync('ffprobe', [
    '-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,channels,bits_per_sample',
    '-of', 'json', file,
  ], { encoding: 'utf8' });
  assert.equal(probe.status, 0, `${id}: unreadable audio`);
  const stream = JSON.parse(probe.stdout).streams?.[0];
  assert.equal(stream?.codec_name, 'pcm_s16le', `${id}: expected PCM WAV`);
  assert.equal(stream?.sample_rate, '24000', `${id}: expected 24 kHz`);
  assert.equal(stream?.channels, 1, `${id}: expected mono`);
}

if (missing.length) {
  console.error(`${lesson} is incomplete: ${missing.length} generated WAV files missing.`);
  for (const id of missing) console.error(`- ${id}`);
  process.exit(1);
}

console.log(`${lesson} complete: ${expected.length} generated Gemini WAV files verified.`);
