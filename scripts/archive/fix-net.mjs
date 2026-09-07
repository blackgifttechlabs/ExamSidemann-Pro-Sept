import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';
let fc = fs.readFileSync(loc + '/LearningOutcome4.tsx', 'utf8');
if (!fc.includes('Network,')) {
    fc = fc.replace(/import \{/, 'import { Network, ');
    fs.writeFileSync(loc + '/LearningOutcome4.tsx', fc);
}
