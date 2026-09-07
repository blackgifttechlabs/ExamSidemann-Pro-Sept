import fs from 'fs';

function addImports(file) {
  let content = fs.readFileSync(file, 'utf8');
  ['Brain', 'Rocket', 'Terminal', 'CheckCircle', 'Network'].forEach(item => {
    if (!content.includes(`${item},`) && !content.includes(` ${item} `)) {
      content = content.replace(/import \{/, `import { ${item}, `);
    }
  });
  fs.writeFileSync(file, content);
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => {
  addImports(`${loc}/LearningOutcome${n}.tsx`);
});
