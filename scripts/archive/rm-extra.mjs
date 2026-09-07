import fs from 'fs';
let content = fs.readFileSync('./components/courses/polytechnic/nc-it/module1/LearningOutcome5.tsx', 'utf8');
content = content.replace('</div>\n  );\n};\n</div>', '  );\n};\n');
fs.writeFileSync('./components/courses/polytechnic/nc-it/module1/LearningOutcome5.tsx', content);
