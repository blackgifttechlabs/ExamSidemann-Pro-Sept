import fs from 'fs';
import path from 'path';

const files = [
    'src/features/courses/polytechnic/nc-it/computer-networking/ComputerNetworking.tsx',
    'src/features/courses/polytechnic/nc-it/computer-security/ComputerSecurity.tsx',
    'src/features/courses/polytechnic/nc-it/national-studies/NationalStudies.tsx',
    'src/features/courses/polytechnic/nc-it/database-concepts/DatabaseConcepts.tsx',
    'src/features/courses/polytechnic/nc-it/programming-concepts/ProgrammingConcepts.tsx',
    'src/features/courses/polytechnic/nc-it/programming-concepts/proframmingconcepts.tsx'
];

for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf-8');

    const iconRegex = /<div\s+className=\{`p-1\.5[^>]+`\}>\s*<BookOpen[^>]+>\s*<\/div>/;
    if (iconRegex.test(content)) {
        content = content.replace(iconRegex, '');
    }

    const iconRegex2 = /<div\s+className=\{`p-[0-9.]+[^`]+`\}>\s*<BookOpen[^>]+>\s*<\/div>/;
    if (iconRegex2.test(content)) {
        content = content.replace(iconRegex2, '');
    }

    const h1Regex = /<h1 className="font-semibold text-base sm:text-lg tracking-tight[^"]*">/g;
    content = content.replace(h1Regex, '<h1 className="font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">');
    
    const h1Regex2 = /<h1 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter[^"]*">/g;
    content = content.replace(h1Regex2, '<h1 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter whitespace-nowrap">');

    content = content.replace(/w-full px-4 sm:px-8 md:px-12 py-8 /g, 'w-full px-0 sm:px-8 md:px-12 py-0 sm:py-8 ');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated", filePath);
}
