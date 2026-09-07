const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    try {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
                ? walkSync(path.join(dir, file), filelist)
                : filelist.concat(path.join(dir, file));
        });
    } catch(e) {}
    return filelist;
};

let files = walkSync('.').filter(f => (f.includes('shona') || f.includes('national-studies')) && f.endsWith('.tsx'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix duplicate imports in NASS
    if (file.includes('national-studies')) {
        let lines = content.split('\n');
        let importLines = lines.slice(0, 20);
        let nonImportLines = lines.slice(20);
        
        for (let i = 0; i < importLines.length; i++) {
            if (importLines[i].startsWith('import {') && importLines[i].includes('lucide-react')) {
                // If single line
                let fullImport = importLines[i];
                let match = /\\{([\\s\\S]+?)\\}/.exec(fullImport);
                if (match) {
                    let tokens = match[1].split(',').map(t => t.trim()).filter(t => t);
                    let uniqueTokens = [...new Set(tokens)];
                    if (!uniqueTokens.includes('Map')) uniqueTokens.push('Map');
                    if (!uniqueTokens.includes('Shield')) uniqueTokens.push('Shield');
                    if (!uniqueTokens.includes('Flag')) uniqueTokens.push('Flag');
                    
                    let newImport = "import { " + uniqueTokens.join(', ') + " } from 'lucide-react';";
                    importLines[i] = newImport;
                }
            } else if (importLines[i].startsWith('import {')) {
                // Multiline
                let fullImport = importLines[i];
                let j = i + 1;
                while (j < importLines.length && !fullImport.includes('} from')) {
                    fullImport += ' ' + importLines[j];
                    j++;
                }
                if (fullImport.includes('lucide-react')) {
                    let match = /\\{([\\s\\S]+?)\\}/.exec(fullImport);
                    if (match) {
                        let tokens = match[1].split(',').map(t => t.trim()).filter(t => t);
                        let uniqueTokens = [...new Set(tokens)];
                        if (!uniqueTokens.includes('Map')) uniqueTokens.push('Map');
                        if (!uniqueTokens.includes('Shield')) uniqueTokens.push('Shield');
                        if (!uniqueTokens.includes('Flag')) uniqueTokens.push('Flag');
                        
                        let newImport = "import { " + uniqueTokens.join(', ') + " } from 'lucide-react';";
                        importLines.splice(i, j - i, newImport);
                    }
                }
            }
        }
        content = importLines.join('\n') + '\n' + nonImportLines.join('\n');
    }
    
    // Fix duplicate imports in Shona
    if (file.includes('shona')) {
        let lines = content.split('\n');
        let importLines = lines.slice(0, 15);
        let nonImportLines = lines.slice(15);
        
        for (let i = 0; i < importLines.length; i++) {
            if (importLines[i].startsWith('import {') && importLines[i].includes('lucide-react')) {
                let fullImport = importLines[i];
                let match = /\\{([\\s\\S]+?)\\}/.exec(fullImport);
                if (match) {
                    let tokens = match[1].split(',').map(t => t.trim()).filter(t => t);
                    let cleanTokens = [];
                    let aliases = [];
                    for(let t of tokens) {
                        if(t.includes(' as ')) { aliases.push(t); }
                        else { cleanTokens.push(t); }
                    }
                    let uniqueTokens = [...new Set(cleanTokens)];
                    if (!uniqueTokens.includes('Globe')) uniqueTokens.push('Globe');
                    if (!uniqueTokens.includes('BookOpen')) uniqueTokens.push('BookOpen');
                    
                    let uniqueAliases = [...new Set(aliases)];
                    if (!uniqueAliases.includes('BookOpen as Log')) uniqueAliases.push('BookOpen as Log');
                    
                    let finalTokens = [...uniqueTokens, ...uniqueAliases];
                    
                    let newImport = "import { " + finalTokens.join(', ') + " } from 'lucide-react';";
                    importLines[i] = newImport;
                }
            } else if (importLines[i].startsWith('import {')) {
                let fullImport = importLines[i];
                let j = i + 1;
                while (j < importLines.length && !fullImport.includes('} from')) {
                    fullImport += ' ' + importLines[j];
                    j++;
                }
                if (fullImport.includes('lucide-react')) {
                    let match = /\\{([\\s\\S]+?)\\}/.exec(fullImport);
                    if (match) {
                        let tokens = match[1].split(',').map(t => t.trim()).filter(t => t);
                        let cleanTokens = [];
                        let aliases = [];
                        for(let t of tokens) {
                            if(t.includes(' as ')) { aliases.push(t); }
                            else { cleanTokens.push(t); }
                        }
                        let uniqueTokens = [...new Set(cleanTokens)];
                        if (!uniqueTokens.includes('Globe')) uniqueTokens.push('Globe');
                        if (!uniqueTokens.includes('BookOpen')) uniqueTokens.push('BookOpen');
                        
                        let uniqueAliases = [...new Set(aliases)];
                        if (!uniqueAliases.includes('BookOpen as Log')) uniqueAliases.push('BookOpen as Log');
                        
                        let finalTokens = [...uniqueTokens, ...uniqueAliases];
                        
                        let newImport = "import { " + finalTokens.join(', ') + " } from 'lucide-react';";
                        importLines.splice(i, j - i, newImport);
                    }
                }
            }
        }
        content = importLines.join('\n') + '\n' + nonImportLines.join('\n');
    }

    fs.writeFileSync(file, content);
}
