import fs from 'fs';
import path from 'path';

const coursesDirs = [
    'src/features/courses/polytechnic/nc-it/computer-networking',
    'src/features/courses/polytechnic/nc-it/computer-security'
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove the inner wrapper div `      <div className="w-full py-8... text-left">` inside `return (` 
    let startRetIdx = content.indexOf('return (');
    if (startRetIdx === -1) return;

    // Pattern to match the first two divs up to `<header`
    // We want to replace `<div className="w-full bg-gradient..."><div className="w-full py-8... text-left">` with `<div className={containerClasses}>`
    // Some files might have `<div className="w-full bg-slate-50..."><div className="w-full py-8... text-left">`
    let headMatch = content.slice(startRetIdx).match(/return\s*\(\s*<div[^>]*>\s*<div[^>]*>/);
    if (!headMatch) {
       console.log("No outer divs match for " + filePath);
       return;
    }
    
    // We also need to remove the matching `</div></div>` at the end and replace it with `</div>`
    // First, let's just do it cleanly:
    
    // Replace the opening tags
    content = content.replace(/return\s*\(\s*<div[^>]*>\s*<div[^>]*>/, 'return (\n    <div className={containerClasses}>');
    
    // Replace the closing tags: `</div>\n      </div>\n    </div>` -> `</div>\n    </div>`
    // Often there's a `<div className="w-full py-8 ... \s*</div>` the innermost div
    let lastDivsRegex = /<\/div>\s*<\/div>\s*\)\s*;\s*\}/s;
    if (lastDivsRegex.test(content)) {
        content = content.replace(lastDivsRegex, '</div>\n  );\n}');
    }

    fs.writeFileSync(filePath, content, 'utf-8');
}

for (const dir of coursesDirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));
        for (const file of files) {
            processFile(path.join(dir, file));
            console.log(`Updated wrapper divs in ${file} in ${dir}`);
        }
    }
}
