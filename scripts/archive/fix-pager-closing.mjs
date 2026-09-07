import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';

[2, 3, 4].forEach(n => {
  let file = loc + '/LearningOutcome' + n + '.tsx';
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  
  // Find the exact line with the closing div
  let lastCloseDivIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes(');')) {
      // Find the three </div> right above this
      if (lines[i-1].includes('</div>') && lines[i-2].includes('</div>') && lines[i-3].includes('</div>')) {
        lines[i-3] = lines[i-3].replace('</div>', '</SectionPager>');
        break;
      } else if (lines[i-1].includes('</div>') && lines[i-3].includes('</div>')) {
        // Just find the third one up
        let count = 0;
        for (let j = i - 1; j >= 0; j--) {
           if (lines[j].includes('</div>')) {
               count++;
               if (count === 3) {
                   lines[j] = lines[j].replace('</div>', '</SectionPager>');
                   break;
               }
           }
        }
        break;
      }
    }
  }

  let finalContent = lines.join('\n');
  fs.writeFileSync(file, finalContent);
});
