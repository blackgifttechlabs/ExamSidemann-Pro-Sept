import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('text-align: left')) {
  css += '\nbody { text-align: left; }';
  fs.writeFileSync('src/index.css', css);
}
