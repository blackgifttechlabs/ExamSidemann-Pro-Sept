import fs from 'fs';

const loc = './components/courses/polytechnic/nd-it/network-administration';

[2, 3, 4].forEach(n => {
  let file = loc + '/LearningOutcome' + n + '.tsx';
  let lines = fs.readFileSync(file, 'utf8').split('\n');
  
  // Restore QuestionReveal / ToolCard if we messed it up at the top of the file
  for (let i = 0; i < lines.length; i++) {
    // If it's inside QuestionReveal or somewhere else
    if (i < 500 && lines[i].includes('</SectionPager>')) {
      lines[i] = lines[i].replace('</SectionPager>', '</div>');
    }
  }

  // Now properly add </SectionPager> at the VERY END.
  // We know it's missing at the end because the script bypassed it.
  // The structure at the end of LearningOutcome2 is:
  /*
1337: 
1338:       </div>
1339:   </div>
1340:     </div>
1341:   );
1342: };
  */
  // So we just find the last "</div>" that closes the prose.
  // We'll search backwards from the bottom for "</div>" and replace the *third* one we find.
  let divCount = 0;
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 200); i--) {
      if (lines[i].includes('</div>')) {
          divCount++;
          if (divCount === 3) {
              lines[i] = lines[i].replace('</div>', '</SectionPager>');
              break; // ONLY the third one!
          }
      }
  }

  fs.writeFileSync(file, lines.join('\n'));
});
