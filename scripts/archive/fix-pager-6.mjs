import fs from 'fs';
let f = './components/courses/polytechnic/nd-it/network-administration/LearningOutcome1.tsx';
let lines = fs.readFileSync(f, 'utf8').split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
   if (lines[i].includes('</SectionPager>')) {
       lines[i] = lines[i].replace('</SectionPager>', '</div>');
   }
}
fs.writeFileSync(f, lines.join('\n'));
