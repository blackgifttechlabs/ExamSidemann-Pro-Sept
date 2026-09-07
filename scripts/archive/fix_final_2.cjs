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

let invalid = ['Core', 'Icons', 'Necessary', 'Aliases', 'Base', 'Standard', 'Functional', 'Data'];

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');

    let match = content.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/);
    if (match) {
        let inside = match[1];
        let words = inside.split(',').map(w => w.trim()).filter(w => w);
        let finalTokens = [];
        for (let word of words) {
            let parts = word.split(' ').map(p => p.trim()).filter(p => p);
            if (parts.length === 1) {
                if (!invalid.includes(parts[0])) finalTokens.push(parts[0]);
            } else if (parts.length === 3 && parts[1] === 'as') {
                finalTokens.push(parts.join(' '));
            } else {
                // something weird, just push valid uppercase identifiers
                for (let p of parts) {
                    if (p.match(/^[A-Z][A-Za-z0-9]+$/) && !invalid.includes(p)) finalTokens.push(p);
                }
            }
        }
        
        let uniqueTokens = [...new Set(finalTokens)];
        
        // add back necessary tokens
        if (file.includes('national-studies')) {
            if (!uniqueTokens.includes('Map')) uniqueTokens.push('Map');
            if (!uniqueTokens.includes('Shield')) uniqueTokens.push('Shield');
            if (!uniqueTokens.includes('Flag')) uniqueTokens.push('Flag');
        } else if (file.includes('shona')) {
            if (!uniqueTokens.includes('Globe')) uniqueTokens.push('Globe');
            if (!uniqueTokens.includes('BookOpen')) uniqueTokens.push('BookOpen');
        }

        let newImport = "import { " + uniqueTokens.join(', ') + " } from 'lucide-react';";
        content = content.replace(match[0], newImport);
        fs.writeFileSync(file, content);
    }
}
