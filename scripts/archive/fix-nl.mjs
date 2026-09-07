import fs from 'fs';

function fixNewlines(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\n/g, '\n');
  fs.writeFileSync(file, content);
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => {
  fixNewlines(loc + '/LearningOutcome' + n + '.tsx');
});
