const fs = require('fs');
const path = require('path');

const dir = 'src/features/courses/polytechnic/nc-it/national-studies';
const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Add isDarkMode hook
    if (!content.includes('MutationObserver')) {
        content = content.replace(
            `const [isDarkMode, setIsDarkMode] = React.useState(false);`,
            `const [isDarkMode, setIsDarkMode] = React.useState(false);\n  React.useEffect(() => {\n    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));\n    checkDarkMode();\n    const observer = new MutationObserver(checkDarkMode);\n    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });\n    return () => observer.disconnect();\n  }, []);`
        );
    }
    
    // Replace typical colors to match SQLPractice
    // Backgrounds
    content = content.replace(/dark:bg-\[#0a0a0a\]/g, 'dark:bg-[#1e1e1e]');
    content = content.replace(/dark:bg-\[#111\]/g, 'dark:bg-[#252526]');
    // Borders
    content = content.replace(/dark:border-white\/10/g, 'dark:border-[#404040]');
    content = content.replace(/dark:border-white\/5/g, 'dark:border-[#404040]');
    // Brand colors
    content = content.replace(/border-\[#003153\]/g, 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400');
    // Wait, replacing 'border-[#003153]' with text color might be bad if it's just a border.
    content = content.replace(/border-\[#003153\]/g, 'border-indigo-600 dark:border-indigo-500');
    content = content.replace(/text-\[#003153\]/g, 'text-indigo-600 dark:text-indigo-400');
    content = content.replace(/bg-\[#003153\]/g, 'bg-indigo-600 dark:bg-indigo-500');
    content = content.replace(/bg-gray-800/g, 'bg-[#252526]');
    content = content.replace(/bg-gray-700/g, 'bg-[#1e1e1e]');

    // Adjust specific text colors
    content = content.replace(/text-gray-[67]00 dark:text-gray-[34]00/g, 'text-gray-600 dark:text-gray-300');

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('done');
