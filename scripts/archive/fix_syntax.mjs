import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.join(dir, file);
      if (fs.statSync(file).isDirectory()) {
        results = results.concat(walk(file));
      } else {
        if (file.endsWith('.tsx')) results.push(file);
      }
    });
  } catch (e) {}
  return results;
}

const files = walk('./components/courses/polytechnic/nc-it');
let count = 0;
for (let file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  if (content.includes('</div>div>')) {
      content = content.replace(/<\/div>div>/g, '</div>');
      changed = true;
  }
  
  if (changed) {
      fs.writeFileSync(file, content);
      count++;
  }
}
console.log('Fixed:', count);
