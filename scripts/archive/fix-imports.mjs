import fs from 'fs';
const filesServerMonitor = [
  './components/courses/polytechnic/nc-it/computer-networking/LearningOutcome2.tsx',
  './components/courses/polytechnic/nc-it/computer-networking/LearningOutcome3.tsx',
  './components/courses/polytechnic/nc-it/computer-networking/LearningOutcome4.tsx',
  './components/courses/polytechnic/nc-it/computer-networking/LearningOutcome5.tsx'
];
filesServerMonitor.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import {') || content.includes('import { ')) {
     // replace 'import { ' with 'import { Server, Monitor, '
     content = content.replace('import { ', 'import { Server, Monitor, ');
     fs.writeFileSync(file, content);
     console.log('Fixed Server, Monitor:', file);
  }
});

const filesZap = [
  './components/courses/polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome3.tsx',
  './components/courses/polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome4.tsx',
  './components/courses/polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome5.tsx'
];
filesZap.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import {') || content.includes('import { ')) {
     content = content.replace('import { ', 'import { Zap, ');
     fs.writeFileSync(file, content);
     console.log('Fixed Zap:', file);
  }
});
