import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';

[2, 3, 4].forEach(n => {
  let file = loc + '/LearningOutcome' + n + '.tsx';
  let c = fs.readFileSync(file, 'utf8');
  
  if (c.includes('SectionPager')) {
    // Remove the injected pagerCode
    c = c.replace(/const SectionPager(.|\n)*?\};\n/m, ''); // Wait, the regex might remove too much or too little
  }
  
  // It's probably safer to just rewrite the file content from scratch? Too risky.
  // Let's use string manipulation accurately.
});
