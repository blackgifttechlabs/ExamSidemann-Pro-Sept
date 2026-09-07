import fs from 'fs';

// Zap fixes
['3', '4', '5'].forEach(num => {
  let f = `./components/courses/polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome${num}.tsx`;
  let content = fs.readFileSync(f, 'utf8');
  
  // Clean wrong import
  content = content.replace(`import { Zap, AdSense } from '../../../../AdSense';`, `import { AdSense } from '../../../../AdSense';`);
  
  let p = content.indexOf('lucide-react');
  if (p !== -1) {
    let start = content.lastIndexOf('import {', p);
    let s = content.substring(start, p);
    if (!s.includes('Zap')) {
       let rep = s.replace('import { ', 'import { Zap, ');
       content = content.substring(0, start) + rep + content.substring(p);
    }
  }

  fs.writeFileSync(f, content);
});

// For LearningOutcome5 for Monitor
let f = './components/courses/polytechnic/nc-it/computer-networking/LearningOutcome5.tsx';
let c = fs.readFileSync(f, 'utf8');
c = c.replace(/Monitor,(.*\n.*Monitor)/g, '$1');
fs.writeFileSync(f, c);

