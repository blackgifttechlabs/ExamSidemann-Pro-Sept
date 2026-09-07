import fs from 'fs';
import path from 'path';

const dir = './components/courses/polytechnic/nc-it/database-concepts';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove the leftover lines completely
  content = content.replace(/    const borderColor = colorMap\[color\] \|\| colorMap\.blue;\n    return[^;]+;\n  };\n/g, '');

  fs.writeFileSync(filePath, content);
}
console.log('Fixed syntax block.');
