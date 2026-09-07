import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';
let fc = fs.readFileSync(loc + '/LearningOutcome4.tsx', 'utf8');

// Fix the react import
fc = fc.replace(/import \{ Network, /, 'import { ');

// Add it to lucide-react
fc = fc.replace(/import \{ Rocket,/, 'import { Network, Rocket,');

fs.writeFileSync(loc + '/LearningOutcome4.tsx', fc);
