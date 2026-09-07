import fs from 'fs';
const files = [
  './components/courses/polytechnic/nc-it/computer-security/LearningOutcome1.tsx',
  './components/courses/polytechnic/nc-it/computer-security/LearningOutcome2.tsx',
  './components/courses/polytechnic/nc-it/computer-security/LearningOutcome3.tsx'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('ShieldCheck,')) {
    content = content.replace('Shield,', 'Shield, ShieldCheck,');
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
