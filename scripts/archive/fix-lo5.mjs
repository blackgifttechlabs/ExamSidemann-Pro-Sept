import fs from 'fs';
let f = './components/courses/polytechnic/nc-it/computer-networking/LearningOutcome5.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace('ListChecks, Smartphone, Monitor, Info, ClipboardList', 'ListChecks, Smartphone, Info, ClipboardList');
fs.writeFileSync(f, c);
