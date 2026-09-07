import fs from 'fs';

function balance(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Let's remove the literal backslashes n that might have been injected
  content = content.replace(/\\n/g, '\n');

  // We find components by looking for "return (" until "); "
  // Wait, regex might match from one return ( to a completely different );
  // Instead, let's process each component by splitting at "};"
  
  // Actually, I can just use a simple regex for the broken components that I KNOW are broken!
  
  const returnRegex = /return\s*\(\s*([\s\S]*?)\s*\)\s*;/g;
  
  content = content.replace(returnRegex, (match, body) => {
    const openDivs = (body.match(/<div(\s|>)/g) || []).length;
    const closeDivs = (body.match(/<\/div>/g) || []).length;
    
    if (closeDivs < openDivs) {
      let missing = openDivs - closeDivs;
      let appender = '';
      for (let i = 0; i < missing; i++) {
        appender += '    </div>\n';
      }
      return 'return (\n' + body + '\n' + appender + '  );';
    }
    
    return match;
  });

  fs.writeFileSync(file, content);
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => {
  balance(loc + '/LearningOutcome' + n + '.tsx');
});
