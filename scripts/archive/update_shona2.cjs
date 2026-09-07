const fs = require('fs');
const path = require('path');

const dir = 'src/features/courses/polytechnic/nc-it/national-studies';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace gradient background strings in LearningOutcome1 to LearningOutcome6
    content = content.replace(/bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950/g, 'bg-[#1e1e1e]');
    content = content.replace(/bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50/g, 'bg-white');

    // Make borders / backgrounds match DB admin containers
    content = content.replace(/bg-gray-200/g, 'bg-gray-100');
    content = content.replace(/bg-gray-50/g, 'bg-[#f8f9fa]');

    // Replace typical colors to match SQLPractice
    // Backgrounds
    content = content.replace(/dark:bg-\[#0a0a0a\]/g, 'dark:bg-[#1e1e1e]');
    content = content.replace(/dark:bg-\[#111\]/g, 'dark:bg-[#252526]');
    // Borders
    content = content.replace(/dark:border-white\/10/g, 'dark:border-[#404040]');
    content = content.replace(/dark:border-white\/5/g, 'dark:border-[#404040]');
    // Brand colors
    content = content.replace(/border-\[#003153\]/g, 'border-indigo-600 dark:border-indigo-500');
    content = content.replace(/text-\[#003153\]/g, 'text-indigo-600 dark:text-indigo-400');
    content = content.replace(/text-gray-[67]00 dark:text-gray-[34]00/g, 'text-gray-600 dark:text-gray-300');
    content = content.replace(/bg-\[#003153\]/g, 'bg-indigo-600 dark:bg-indigo-500');

    // If there is any bg-gray-800 or similar
    content = content.replace(/bg-gray-800/g, 'bg-[#252526]');
    content = content.replace(/bg-gray-700/g, 'bg-[#1e1e1e]');

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('done running updates on gradient and colors');
