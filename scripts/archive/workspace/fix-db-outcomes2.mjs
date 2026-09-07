import fs from 'fs';
import path from 'path';

const dir = './components/courses/polytechnic/nc-it/database-concepts';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace containerClasses
  content = content.replace(
    /const containerClasses = [^;]+;/,
    `const containerClasses = 'w-full py-4 sm:py-6 px-4 md:px-8 bg-transparent min-h-screen text-gray-900 dark:text-gray-100 font-sans leading-relaxed';`
  );

  // Replace sectionHeaderClasses
  content = content.replace(
    /const sectionHeaderClasses = [^;]+;/,
    `const sectionHeaderClasses = 'text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-12 mb-6 tracking-tight uppercase border-b border-gray-200 dark:border-white/10 pb-2 w-full';`
  );

  // Replace cardClasses
  content = content.replace(
    /const cardClasses = [^}]+};\n/,
    `const cardClasses = (color: string) => 'py-4 md:py-6 mb-8 border-l-4 ' + (color === 'orange' ? 'border-orange-500' : color === 'purple' ? 'border-purple-500' : color === 'green' ? 'border-green-500' : 'border-blue-500') + ' pl-4 sm:pl-6 bg-gray-50/30 dark:bg-white/5 rounded-none';\n`
  );

  // Replace the header
  content = content.replace(
    /<header className=\{`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \$\{isDarkMode \? 'bg-indigo-950' : 'bg-indigo-900'\}`\}>[\s\S]*?<\/header>/,
    `<header className="mb-10 sm:mb-12 border-b border-gray-200 dark:border-white/10 pb-6 sm:pb-8">
        <div className="flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">
            <DatabaseIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            DATABASE CONCEPTS
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tighter">
            Learning Outcome ${file.replace(/[^0-9]/g, '')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Detailed study notes and theoretical curriculum covering core concepts, standardized modules, and database fundamentals.
          </p>
        </div>
      </header>`
  );

  // Remove box-like styles but keep the tags
  content = content.replace(/ bg-white dark:bg-\[#0[a-fdA-FD]+\]/g, '');
  content = content.replace(/ bg-white/g, '');
  content = content.replace(/ dark:bg-\[#111\]/g, '');
  content = content.replace(/ shadow-[a-z2]+/g, '');
  content = content.replace(/ shadow-sm/g, '');
  content = content.replace(/ shadow-lg/g, '');
  content = content.replace(/ shadow-xl/g, '');
  content = content.replace(/ shadow-2xl/g, '');
  content = content.replace(/ shadow /g, ' ');
  content = content.replace(/ rounded-[a-z2A-Z0-9]+/g, '');
  
  // Replace subheaders
  content = content.replace(/text-xl font-black text-\[#003153\] dark:text-blue-400 uppercase tracking-widest/g, 'text-lg sm:text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight');
  content = content.replace(/text-sm font-black text-\[#003153\] dark:text-blue-400 uppercase tracking-widest/g, 'text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight');
  
  // Specific removal for things like bg-blue-50, etc.
  content = content.replace(/ bg-[a-z]+-50/g, '');
  content = content.replace(/ dark:bg-[a-z]+-900\/[0-9]+/g, '');
  content = content.replace(/ border-[a-z]+-100/g, '');
  content = content.replace(/ dark:border-[a-z]+-800/g, '');
  content = content.replace(/ border border-gray-100/g, '');
  content = content.replace(/ border border-gray-200/g, '');
  content = content.replace(/ border /g, '');
  content = content.replace(/ dark:border-white\/5/g, '');
  content = content.replace(/ dark:border-white\/10/g, '');
  content = content.replace(/ bg-gray-50/g, '');
  content = content.replace(/ dark:bg-black\/20/g, '');
  content = content.replace(/ dark:bg-white\/5/g, '');
  
  // Fix the big dark sections
  content = content.replace(/bg-\[#111\] text-white/g, 'border-l-4 border-gray-800 dark:border-gray-500 pl-4 sm:pl-6 py-4');
  content = content.replace(/bg-\[#003153\] p-10 text-white/g, 'border-t border-b border-gray-200 dark:border-white/10 py-8 my-10');
  content = content.replace(/bg-blue-50 dark:bg-blue-900\/10/g, '');
  
  // Some padding removals to just have clean flow
  content = content.replace(/ p-4/g, '');
  content = content.replace(/ p-5/g, '');
  content = content.replace(/ p-6/g, '');
  content = content.replace(/ p-8/g, '');
  content = content.replace(/ p-10/g, '');
  

  fs.writeFileSync(filePath, content);
}
console.log('Update Complete.');
