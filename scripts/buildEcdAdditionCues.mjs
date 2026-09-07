/** Locate the first sentence break in the existing addition recordings.
 * The generated prompts all say the initial group first, then the joining group.
 * A >=300ms gap after 1s identifies that sentence boundary in these recordings.
 * Regenerate after replacing recordings; spot-check if the delivery changes.
 */
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const cues = {};
for (const name of fs.readdirSync('public/sounds/ecd/maths/addition/prompts')) {
 if (!name.endsWith('.wav')) continue;
 const r = spawnSync('ffmpeg',['-hide_banner','-i',`public/sounds/ecd/maths/addition/prompts/${name}`,'-af','silencedetect=noise=-35dB:d=0.3','-f','null','-'],{encoding:'utf8'});
 if (r.status !== 0) throw new Error(`FFmpeg could not measure ${name}`);
 const end = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map(m=>Number(m[1])).find(n=>n>1 && n<3.5);
 if (!end) throw new Error(`Missing sentence break: ${name}`);
 cues[name.replace('.wav','')] = Number(end.toFixed(3));
}
fs.writeFileSync('src/data/ecdAdditionJoinCues.json', JSON.stringify(cues,null,2)+'\n');
console.log(`Updated ${Object.keys(cues).length} addition walking cues from recording pauses.`);
