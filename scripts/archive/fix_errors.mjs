import fs from 'fs';
import path from 'path';

// Fix duplicate 'Shield'
const dirs = [
    'src/features/courses/polytechnic/nc-it/computer-networking',
    'src/features/courses/polytechnic/nc-it/computer-security'
];

for (const dir of dirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));
        for (const file of files) {
            const filePath = path.join(dir, file);
            let content = fs.readFileSync(filePath, 'utf-8');
            // A simple hack: replace "Shield, Shield" with "Shield,"
            // Actually: Map, Flag, Shield are added. We can find all instances of Map, Flag, Shield.
            
            // Wait, what if there are MULTIPLE import { ... } from 'lucide-react' lines?
            // Let's merge them or just deduplicate each one.
            const importMatches = Array.from(content.matchAll(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/gs));
            
            if (importMatches.length > 1) {
                // merge them
                const allImports = [];
                for (const match of importMatches) {
                    allImports.push(...match[1].split(',').map(s => s.trim()).filter(Boolean));
                }
                const uniqueImports = Array.from(new Set(allImports));
                content = content.replace(importMatches[0][0], `import { ${uniqueImports.join(', ')} } from 'lucide-react'`);
                for (let i = 1; i < importMatches.length; i++) {
                    content = content.replace(importMatches[i][0] + (content.charAt(importMatches[i].index + importMatches[i][0].length) === ';' ? ';' : ''), '');
                }
            } else if (importMatches.length === 1) {
               const importsStr = importMatches[0][1];
               const importsArr = importsStr.split(',').map(s => s.trim()).filter(Boolean);
               const uniqueImports = Array.from(new Set(importsArr));
               content = content.replace(importMatches[0][0], `import { ${uniqueImports.join(', ')} } from 'lucide-react'`);
            }
            
            fs.writeFileSync(filePath, content, 'utf-8');
        }
    }
}

// Fix ComputerSecurity imports
const csFile = 'src/features/courses/polytechnic/nc-it/computer-security/ComputerSecurity.tsx';
let csContent = fs.readFileSync(csFile, 'utf-8');
csContent = csContent.replace(/import\s+\{\s*LearningOutcome[45]\s*\}\s*from\s+['"]\.\/LearningOutcome[45]['"];?\n/g, '');
csContent = csContent.replace(/case 4:\s*return\s*<LearningOutcome4\s*\/>;\s*\n/g, '');
csContent = csContent.replace(/case 5:\s*return\s*<LearningOutcome5\s*\/>;\s*\n/g, '');
fs.writeFileSync(csFile, csContent, 'utf-8');
