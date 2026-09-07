const fs = require('fs');
const path = require('path');

const dir = 'courses/form-1/shona';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/dark:text-blue-400/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('done running cleanups on shona colors');
