import fs from 'fs';
let f = './components/courses/polytechnic/nd-it/network-administration/LearningOutcome1.tsx';
let txt = fs.readFileSync(f, 'utf8');
txt = txt.replace('        </SectionPager>\n      )}\n\n      {/* Navigation Buttons */}', '        </div>\n      )}\n\n      {/* Navigation Buttons */}');
fs.writeFileSync(f, txt);
