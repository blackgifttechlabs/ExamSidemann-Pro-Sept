import fs from 'fs';
import path from 'path';

const dir = './components/courses/polytechnic/nc-it/database-concepts';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace containerClasses
  content = content.replace(/const containerClasses = [\s\S]*?;/g, `const containerClasses = 'w-full pt-4 pb-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-[#fdfdfd] dark:bg-[#050505] min-h-screen text-gray-900 dark:text-gray-100 font-sans leading-relaxed';`);

  // Replace sectionHeaderClasses
  content = content.replace(/const sectionHeaderClasses = [\s\S]*?;/g, `const sectionHeaderClasses = 'text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 tracking-tight uppercase border-b-2 border-gray-100 dark:border-white/5 pb-2';`);

  // Replace cardClasses definition
  content = content.replace(/const cardClasses = [\s\S]*?;/g, `const cardClasses = (color: string) => 'py-4 md:py-6 mb-8 border-l-4 ' + (color === 'blue' ? 'border-blue-500' : color === 'green' ? 'border-green-500' : color === 'purple' ? 'border-purple-500' : color === 'orange' ? 'border-orange-500' : 'border-indigo-500') + ' pl-4 sm:pl-6';`);

  // Remove backgrounds and borders and shadows from generic divs
  // bg-white, bg-gray-*, bg-blue-*, etc.
  content = content.replace(/bg-(white|black|gray|blue|indigo|purple|emerald|teal|green|yellow|orange|amber|red)-[0-9]{2,3}(\/[0-9]+)?/g, '');
  content = content.replace(/bg-\[#[a-fA-F0-9]+\](\/[0-9]+)?/g, '');
  content = content.replace(/dark:bg-[a-zA-Z0-9-\[\]\/]+/g, '');
  content = content.replace(/border-[a-zA-Z0-9-\[\]\/]+/g, ''); // removes borders
  content = content.replace(/dark:border-[a-zA-Z0-9-\[\]\/]+/g, ''); // removes dark borders
  content = content.replace(/border /g, ' '); // removes bare 'border'
  content = content.replace(/shadow-[a-z2]+ /g, ' '); // removes shadow-xl, shadow-lg, shadow-sm
  content = content.replace(/shadow /g, ' ');
  content = content.replace(/rounded-[a-[z2]+ /g, ' '); // removes rounded-xl, rounded-2xl
  content = content.replace(/rounded /g, ' ');

  // Fix up multiple spaces
  content = content.replace(/\s+/g, ' ');

  // Re-format file basic structure
  content = content.replace(/export const /g, '\nexport const ');
  content = content.replace(/return \(/g, '\n  return (');
  content = content.replace(/<header/g, '\n      <header');
  content = content.replace(/<section/g, '\n        <section');
  
  // Re-add border to section header classes because the overly aggressive regex might have stripped it
  content = content.replace(/const sectionHeaderClasses = 'text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 tracking-tight uppercase  pb-2';/g, 
  `const sectionHeaderClasses = 'text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 tracking-tight uppercase border-b-2 border-gray-100 dark:border-white/5 pb-2';`);
  
  // Actually, string replacement is risky. Let's do it via targeted script.
  fs.writeFileSync(filePath, content);
}

console.log('Processed files');
