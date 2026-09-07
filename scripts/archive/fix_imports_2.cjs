const fs = require('fs');

const walkSync = (dir, filelist = []) => {
    try {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(dir + '/' + file).isDirectory()
                ? walkSync(dir + '/' + file, filelist)
                : filelist.concat(dir + '/' + file);
        });
    } catch(e) {}
    return filelist;
};

let files = walkSync('.').filter(f => (f.includes('shona') || f.includes('national-studies')) && f.endsWith('.tsx'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Find everything between "import {" and "} from 'lucide-react'"
    let regex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/m;
    let match = regex.exec(content);
    if (match) {
        let tokens = match[1].split(',').map(t => t.trim()).filter(t => t);
        let cleanTokens = [];
        let aliases = [];
        for (let t of tokens) {
            if (t.includes(' as ')) { aliases.push(t); }
            else { cleanTokens.push(t); }
        }
        
        let uniqueTokens = [...new Set(cleanTokens)];
        let uniqueAliases = [...new Set(aliases)];
        
        if (file.includes('national-studies')) {
            if (!uniqueTokens.includes('Map')) uniqueTokens.push('Map');
            if (!uniqueTokens.includes('Shield')) uniqueTokens.push('Shield');
            if (!uniqueTokens.includes('Flag')) uniqueTokens.push('Flag');
        } else if (file.includes('shona')) {
            if (!uniqueTokens.includes('Globe')) uniqueTokens.push('Globe');
            if (!uniqueTokens.includes('BookOpen')) uniqueTokens.push('BookOpen');
            if (!uniqueAliases.includes('BookOpen as Log')) uniqueAliases.push('BookOpen as Log');
        }
        
        let finalTokens = [...uniqueTokens, ...uniqueAliases];
        let newImport = \`import { \${finalTokens.join(', ')} } from 'lucide-react';\`;
        
        content = content.replace(regex, newImport);
        
        // Sometimes the original file had multiple import { ... } from 'lucide-react' because of our previous script.
        // Let's remove any subsequent ones just in case.
        let firstMatchIndex = content.indexOf('lucide-react');
        let remainingContent = content.substring(firstMatchIndex + 15);
        remainingContent = remainingContent.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/mg, '');
        
        content = content.substring(0, firstMatchIndex + 15) + remainingContent;
        
        fs.writeFileSync(file, content);
    }
}
