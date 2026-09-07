import fs from 'fs';
let content = fs.readFileSync('./components/courses/polytechnic/nc-it/module1/LearningOutcome5.tsx', 'utf8');

// I need to add another </div>
content = content.replace('      </section>\n    </div>\n  );\n};\n', '      </section>\n    </div>\n  </div>\n  );\n};\n');
fs.writeFileSync('./components/courses/polytechnic/nc-it/module1/LearningOutcome5.tsx', content);
