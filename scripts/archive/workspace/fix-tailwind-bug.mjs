import fs from 'fs';
import path from 'path';

const dir = './components/courses/polytechnic/nc-it/database-concepts';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  content = content.replace(/sm:pl-6\/30/g, 'sm:pl-6 bg-gray-50/50 dark:bg-white/5');

  fs.writeFileSync(filePath, content);
}
console.log('Fixed Tailwind Class');
