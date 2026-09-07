import fs from 'fs';

let content = fs.readFileSync('./components/courses/polytechnic/nc-it/computer-networking/LearningOutcome2.tsx', 'utf8');
content = content.replace('Map, Monitor, Activity', 'Map, Activity');
fs.writeFileSync('./components/courses/polytechnic/nc-it/computer-networking/LearningOutcome2.tsx', content);

content = fs.readFileSync('./components/courses/polytechnic/nc-it/computer-networking/LearningOutcome5.tsx', 'utf8');
content = content.replace('Monitor, Search', 'Search');
fs.writeFileSync('./components/courses/polytechnic/nc-it/computer-networking/LearningOutcome5.tsx', content);

// Zap fixes
['3', '4', '5'].forEach(num => {
  let f = `./components/courses/polytechnic/nc-it/entrepreneurship-skills-development/LearningOutcome${num}.tsx`;
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(`import { Zap, `, `import { `);
  
  if (!content.includes('Zap,')) {
    content = content.replace('import { ', 'import { Zap, ');
  }
  fs.writeFileSync(f, content);
});
