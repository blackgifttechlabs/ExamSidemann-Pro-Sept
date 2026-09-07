const fs = require('fs');
let file = './components/courses/polytechnic/nc-it/national-studies/LearningOutcome2.tsx';
let content = fs.readFileSync(file, 'utf8');

let lines = content.split('\n');
let start = -1;
let end = -1;
for(let i=0; i<30; i++) {
    if(lines[i].includes('import {') && lines[i].includes('// Base Icons')) start = i;
    if(lines[i].includes('} from \'lucide-react\';')) end = i;
}

if(start !== -1 && end !== -1) {
    let raw = lines.slice(start, end+1).join(' ');
    // let's parse words starting with uppercase
    let words = raw.match(/[A-Z][a-zA-Z0-9]+/g);
    let unique = [...new Set(words)];
    
    // Some words to filter out if they are not Lucide icons
    let toRemove = ['React', 'Base', 'Icons', 'Necessary', 'Aliases', 'MountIcon', 'HeartFilled', 'CrownIcon', 'Lucide'];
    unique = unique.filter(w => !toRemove.includes(w));
    
    if (!unique.includes('Map')) unique.push('Map');
    if (!unique.includes('Shield')) unique.push('Shield');
    if (!unique.includes('Flag')) unique.push('Flag');

    let newImport = "import { " + unique.join(', ') + ", Crown as CrownIcon, Mountain as MountIcon } from 'lucide-react';";
    lines.splice(start, end-start+1, newImport);
    fs.writeFileSync(file, lines.join('\n'));
} else {
    // If it was mangled to a single line already
    let newStart = -1;
    for(let i=0; i<30; i++) {
        if(lines[i].startsWith('import {') && lines[i].includes('lucide-react')) {
            newStart = i;
            break;
        }
    }
    if(newStart !== -1) {
        let raw = lines[newStart];
        let words = raw.match(/[A-Z][a-zA-Z0-9]+/g);
        let unique = [...new Set(words)];
        
        let toRemove = ['React', 'Base', 'Icons', 'Necessary', 'Aliases', 'MountIcon', 'HeartFilled', 'CrownIcon', 'Lucide', 'Heart', 'Pen', 'Map'];
        unique = unique.filter(w => !toRemove.includes(w));
        
        unique.push('Heart');
        unique.push('Pen');
        unique.push('Map');
        if (!unique.includes('Shield')) unique.push('Shield');
        if (!unique.includes('Flag')) unique.push('Flag');

        let newImport = "import { " + unique.join(', ') + ", Crown as CrownIcon, Mountain as MountIcon } from 'lucide-react';";
        lines[newStart] = newImport;
        fs.writeFileSync(file, lines.join('\n'));
    }
}
