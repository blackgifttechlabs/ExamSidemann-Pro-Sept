import fs from 'fs';

function balanceDivsInComponents(file) {
  let content = fs.readFileSync(file, 'utf8');

  const returnRegex = /return\s*\(\s*([\s\S]*?)\s*\)\s*;/g;
  
  content = content.replace(returnRegex, (match, body) => {
    const openDivs = (body.match(/<div(\s|>)/g) || []).length;
    const closeDivs = (body.match(/<\/div>/g) || []).length;
    
    if (closeDivs < openDivs) {
      let missing = openDivs - closeDivs;
      let appender = '';
      for (let i = 0; i < missing; i++) {
        appender += '    </div>\\n';
      }
      return 'return (\\n' + body + '\\n' + appender + '  );';
    }
    
    return match;
  });

  fs.writeFileSync(file, content);
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => {
  balanceDivsInComponents('./components/courses/polytechnic/nd-it/network-administration/LearningOutcome' + n + '.tsx');
});
