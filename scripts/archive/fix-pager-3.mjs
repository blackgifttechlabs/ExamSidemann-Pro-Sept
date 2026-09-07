import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';

[2, 3].forEach(n => {
  let file = loc + '/LearningOutcome' + n + '.tsx';
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  
  let i = lines.length - 1;
  while(i >= 0 && !lines[i].includes('YOU\'VE GOT THIS')) { i--; }
  
  if (i >= 0) {
      // Find the next </SectionPager> and that should be </div>
      for (let j = i; j < lines.length; j++) {
          if (lines[j].includes('</SectionPager>')) {
              // The first one we encounter after YOU'VE GOT THIS is the inner div closing
              lines[j] = lines[j].replace('</SectionPager>', '</div>');
              break;
          }
      }
  }

  fs.writeFileSync(file, lines.join('\n'));
});
