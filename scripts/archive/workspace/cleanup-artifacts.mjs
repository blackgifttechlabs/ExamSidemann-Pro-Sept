import fs from 'fs';
import path from 'path';

const dir = './components/courses/polytechnic/nc-it/database-concepts';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  content = content.replace(/p-4\/5border-white\/10/g, 'border-l-2 border-white/10 pl-3 my-2');
  content = content.replace(/h-320\/10-full/g, 'h-32');
  // I should also look for anything ending in 0/10
  content = content.replace(/0\/10/g, '');
  content = content.replace(/border-white\/100/g, 'border-white/10');

  // Let's also check for other messed up classes 
  content = content.replace(/className="[^"]*"/g, (match) => {
     let c = match.replace(/ p-8/g, ' ');
     c = c.replace(/ shadow-lg/g, '');
     c = c.replace(/ rounded-xl/g, '');
     c = c.replace(/ rounded-2xl/g, '');
     c = c.replace(/ border-l-4 border-gray-800 dark:border-gray-500 pl-4 sm:pl-6 py-4 relative overflow-hidden/g, ' border-l-4 border-gray-800 dark:border-gray-500 pl-4 sm:pl-6 py-4 my-8');
     c = c.replace(/\s+/g, ' '); // Clean up multiple spaces
     return c;
  });

  fs.writeFileSync(filePath, content);
}
console.log('Cleaned up artifacts.');
