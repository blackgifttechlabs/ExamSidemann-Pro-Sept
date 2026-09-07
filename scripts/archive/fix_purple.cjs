const fs = require('fs');
const glob = require('glob'); // maybe not installed, let's use custom walk

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

let files = walkSync('./courses/form-1/shona').filter(f => f.endsWith('.tsx'));

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/bg-indigo-600 dark:bg-indigo-500\/5/g, 'bg-indigo-50 dark:bg-indigo-500/5');
    
    // Also let's fix any border-indigo-600 dark:border-indigo-500/10 if it's there
    newContent = newContent.replace(/border-indigo-600 dark:border-indigo-500\/10/g, 'border-indigo-200 dark:border-indigo-500/10');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
    }
}
