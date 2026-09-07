import fs from 'fs';
import path from 'path';

const dir = './components/courses/polytechnic/nc-it/database-concepts';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  content = content.replace(
    /const containerClasses = [^;]+;/,
    `const containerClasses = 'w-full py-2 sm:py-4 px-2 sm:px-4 md:px-6 lg:px-8 bg-transparent text-gray-900 dark:text-gray-100 font-sans leading-relaxed';`
  );

  content = content.replace(
    /const sectionHeaderClasses = [^;]+;/,
    `const sectionHeaderClasses = 'text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-10 mb-4 uppercase border-b border-gray-200 dark:border-white/10 pb-2 w-full';`
  );

  fs.writeFileSync(filePath, content);
}
console.log('Padding reduced');
