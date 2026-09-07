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

    // Super simple and dirty string replacements for the exact duplicate lines
    let match = content.match(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/);
    if (match) {
        let inside = match[1];
        let words = inside.match(/[A-Za-z0-9_]+/g);
        if (words) {
            let s = new Set();
            let finalTokens = [];
            for (let i = 0; i < words.length; i++) {
                if (words[i+1] === 'as' && words[i+2]) {
                    let full = words[i] + ' as ' + words[i+2];
                    if (!s.has(full)) {
                        s.add(full);
                        finalTokens.push(full);
                    }
                    i += 2;
                } else if (!s.has(words[i]) && words[i] !== 'as') {
                    // Let's filter out some common comment words that crept into the import
                    let invalid = ['Core', 'Icons', 'Necessary', 'Aliases', 'Base'];
                    if (!invalid.includes(words[i])) {
                        s.add(words[i]);
                        finalTokens.push(words[i]);
                    }
                }
            }
            
            let newImport = "import { " + finalTokens.join(', ') + " } from 'lucide-react';";
            content = content.replace(match[0], newImport);
            
            // Remove any other duplicated lucide-react imports that were accidentally appended
            let firstMatchIndex = content.indexOf('lucide-react');
            let remainingContent = content.substring(firstMatchIndex + 15);
            remainingContent = remainingContent.replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"];/mg, '');
            content = content.substring(0, firstMatchIndex + 15) + remainingContent;

            fs.writeFileSync(file, content);
        }
    }
}
