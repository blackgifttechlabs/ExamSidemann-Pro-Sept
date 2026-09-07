import fs from 'fs';
import path from 'path';

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf-8');

    // Make the title truncated
    content = content.replace(
        /<h1 className="font-semibold text-base sm:text-lg tracking-tight">\s+([\s\S]*?)\s+<\/h1>/,
        '<h1 className="font-semibold text-base sm:text-lg tracking-tight truncate max-w-[130px] sm:max-w-none">\n              $1\n            </h1>'
    );

    // Make the registry badge wrap and change to Module
    // Wait, the regex needs to match the span and its content
    const spanRegex = /<span\s+className={`ml-2 px-2 py-0.5 text-\[10px\] uppercase font-bold tracking-widest rounded-full \${([^}]+)}`}\s*>\s*NC Registry\s*<\/span>/;
    const match = content.match(spanRegex);
    if (match) {
        content = content.replace(spanRegex, `<span\n              className={\`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full shrink-0 whitespace-nowrap \${$1}\`}\n            >\n              NC Module\n            </span>`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log("Updated", filePath);
}

processFile('src/features/courses/polytechnic/nc-it/computer-networking/ComputerNetworking.tsx');
processFile('src/features/courses/polytechnic/nc-it/computer-security/ComputerSecurity.tsx');
processFile('src/features/courses/polytechnic/nc-it/national-studies/NationalStudies.tsx');
processFile('src/features/courses/polytechnic/nc-it/database-concepts/DatabaseConcepts.tsx');
processFile('src/features/courses/polytechnic/nc-it/programming-concepts/ProgrammingConcepts.tsx');

