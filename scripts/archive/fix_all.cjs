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
    let lines = content.split('\n');
    let newLines = [];
    let inImport = false;
    let importTokens = [];
    let importStart = -1;

    for (let i = 0; i < lines.length; i++) {
        if (!inImport && lines[i].includes('import {') && lines[i].includes('lucide-react')) {
            inImport = true;
            importStart = i;
        }

        if (inImport) {
            let matches = lines[i].match(/[A-Za-z0-9_]+/g);
            if (matches) {
                matches.forEach(m => {
                    if (m !== 'import' && m !== 'from' && m !== 'lucide' && m !== 'react' && m !== 'lucide-react') {
                        importTokens.push(m);
                    }
                });
            }
            if (lines[i].includes("} from 'lucide-react'")) {
                inImport = false;
                
                // Process tokens to handle aliases correctly (A as B)
                let finalSet = new Set();
                for (let j = 0; j < importTokens.length; j++) {
                    if (importTokens[j+1] === 'as' && importTokens[j+2]) {
                        finalSet.add(importTokens[j] + ' as ' + importTokens[j+2]);
                        j += 2; // skip
                    } else if (importTokens[j] !== 'as') { // ignore rogue 'as'
                        finalSet.add(importTokens[j]);
                    }
                }
                
                // Add required ones
                if (file.includes('national-studies')) {
                   finalSet.add('Map');
                   finalSet.add('Shield');
                   finalSet.add('Flag');
                }
                if (file.includes('shona')) {
                   finalSet.add('Globe');
                   finalSet.add('BookOpen');
                   finalSet.add('BookOpen as Log');
                }
                
                // Also exclude false words that are not icons
                let blacklist = ['Base', 'Icons', 'Necessary', 'Aliases', 'Lucide'];
                let cleanSet = [...finalSet].filter(t => {
                   let name = t.split(' ')[0];
                   return !blacklist.includes(name);
                });

                newLines.push("import { " + cleanSet.join(', ') + " } from 'lucide-react';");
            }
        } else {
            // Check for previous remaining single-line imports and remove them if we already did one
            if (lines[i].includes('lucide-react') && importStart !== -1) {
                // skip it as it's duplicate
            } else {
                newLines.push(lines[i]);
            }
        }
    }
    fs.writeFileSync(file, newLines.join('\n'));
}
