import fs from 'fs';
import path from 'path';

function findFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            findFiles(filePath, fileList);
        } else if (filePath.endsWith('.tsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const tsxFiles = findFiles('src/features/courses/polytechnic');
for (const filePath of tsxFiles) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    if (content.match(/px-4(?:\s+)sm:px-8/g)) {
        content = content.replace(/px-4(?:\s+)sm:px-8/g, 'px-0 sm:px-8');
        changed = true;
    }
    if (content.match(/px-3(?:\s+)sm:px-\[30px\]/g)) {
        content = content.replace(/px-3(?:\s+)sm:px-\[30px\]/g, 'px-0 sm:px-[30px]');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log("Updated padding in", filePath);
    }
}
