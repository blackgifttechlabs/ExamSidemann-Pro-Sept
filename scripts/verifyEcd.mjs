import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const load = source => import('data:text/javascript;base64,' + Buffer.from(compile(source)).toString('base64'));
const { monsterRounds } = await load(fs.readFileSync('src/features/ecd/maths/monsterMathsData.ts', 'utf8'));
for (const op of ['addition', 'subtraction']) {
  const rounds = monsterRounds(op);
  assert.equal(rounds.length, 8);
  assert.equal(new Set(rounds.map(r => r.id)).size, rounds.length);
  for (const r of rounds) {
    assert.equal(r.answer, op === 'addition' ? r.a + r.b : r.a - r.b);
    assert.ok(r.answer >= 0 && r.answer <= 10);
    assert.equal(new Set(r.choices).size, 6);
    assert.equal(r.choices.filter(n => n === r.answer).length, 1);
    assert.ok(r.choices.every(n => n >= 0 && n <= 10));
    for (const name of [`intro`, `prompts/${r.id}`, 'correct', 'retry', 'finished']) {
      assert.ok(fs.readFileSync('docs/ECD_RECORDING_CHECKLIST.md', 'utf8').includes(`maths/${op}/${name}.wav`));
    }
  }
}
const resolverSource = fs.readFileSync('src/lib/audio/ecdAudioAssets.ts', 'utf8').replace(/^import .*;\n/m, 'const assets = { "/sounds/ecd/test": "/sounds/ecd/test.wav", "/sounds/ecd/legacy": "/sounds/ecd/legacy.mp3" };\n');
const { resolveEcdAudio } = await load(resolverSource);
assert.equal(resolveEcdAudio('/sounds/ecd/test.mp3'), '/sounds/ecd/test.wav');
assert.equal(resolveEcdAudio('/sounds/ecd/legacy.wav'), '/sounds/ecd/legacy.mp3');
assert.equal(resolveEcdAudio('/sounds/ecd/missing.mp3'), '/sounds/ecd/missing.mp3');
const audios = [], spoken = [];
globalThis.window = { speechSynthesis: { cancel() {}, speak(line) { spoken.push(line); } } };
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
globalThis.Audio = class {
  constructor(url) { this.url = url; audios.push(this); }
  pause() {}
  play() { return Promise.resolve(); }
};
const source = fs.readFileSync('src/features/ecd/reading/readingVoice.ts', 'utf8').replace(/^import .*;\n/gm, '');
const voice = await load('const ecdSounds = { duckIntro() {}, restoreIntro() {} }; const resolveEcdAudio = url => url.replace(/\\.mp3$/, ".wav");\n' + source);
let done = 0;
voice.playReadingLine('/sounds/ecd/test.mp3', '[happy] Hello!', () => done++);
assert.equal(audios[0].url, '/sounds/ecd/test.wav');
voice.playReadingLine('/sounds/ecd/new.mp3', 'New line', () => done++);
audios[0].onerror();
assert.equal(spoken.length, 0, 'Cancelled audio must never start stale speech');
audios[1].onerror(); audios[1].onerror();
assert.equal(spoken.length, 1, 'Missing recording must fall back only once');
spoken[0].onend();
assert.equal(done, 1);
voice.playReadingLine('/sounds/ecd/cancel.mp3', 'Cancelled', () => done++);
voice.stopReadingVoice(); audios[2].onended(); audios[2].onerror();
assert.equal(done, 1); assert.equal(spoken.length, 1);
// Recorded cue uses playback time, so buffering cannot start the walk early.
let cues = 0;
voice.playReadingLine('/sounds/ecd/timed.mp3', 'Two are here. One joins them.', undefined, { atSeconds: 2.2, atCharacter: 14, onCue: () => cues++ });
const timed = audios.at(-1);
timed.currentTime = 1.8; timed.ontimeupdate(); assert.equal(cues, 0);
timed.currentTime = 2.3; timed.ontimeupdate(); timed.ontimeupdate(); assert.equal(cues, 1);
timed.onended(); assert.equal(cues, 1, 'End event must not replay the cue');
voice.playReadingLine('/sounds/ecd/stale.mp3', 'Old line', undefined, { atSeconds: 1, atCharacter: 2, onCue: () => cues++ });
const stale = audios.at(-1);
voice.stopReadingVoice(); stale.currentTime = 3; stale.ontimeupdate(); stale.onended();
assert.equal(cues, 1, 'Leaving a game must cancel its pending animation cue');
voice.playReadingLine('/sounds/ecd/speech.mp3', 'Two are here. One joins them.', undefined, { atSeconds: 2.2, atCharacter: 14, onCue: () => cues++ });
audios.at(-1).onerror();
const fallback = spoken.at(-1);
fallback.onboundary({ charIndex: 0 }); assert.equal(cues, 1);
fallback.onboundary({ charIndex: 14 }); assert.equal(cues, 2);
fallback.onend(); assert.equal(cues, 2);
voice.playReadingLine('/sounds/ecd/no-boundary.mp3', 'Two are here. One joins them.', undefined, { atSeconds: 2.2, atCharacter: 14, onCue: () => cues++ });
audios.at(-1).onerror(); spoken.at(-1).onend();
assert.equal(cues, 3, 'Speech engines without word events must still let the game progress');
const joinCues = JSON.parse(fs.readFileSync('src/data/ecdAdditionJoinCues.json', 'utf8'));
for (const round of monsterRounds('addition')) assert.ok(joinCues[round.id] > 1 && joinCues[round.id] < 3.5);
console.log('ECD checks passed: arithmetic, recording coverage, WAV playback, timed and speech cues, fallback and cancellation.');
