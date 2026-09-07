import fs from 'fs';

function fixFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // I will replace all \`</div>\n    </div>\n  );\n};\` with \`</div>\n  );\n};\`.
  content = content.replace(/<\/div>\s*<\/div>\s*\)\s*;\s*\}\s*;/g, "</div>\n  );\n};");
  
  // Wait! The very LAST one in the file is for LearningOutcome2 which ACTUALLY NEEDS two </div>!
  // Because I added a \`<div className={containerClasses}><div className="animate-dropdown-reveal...` at the top of LearningOutcome2 component.
  // Actually, I replaced ONE div with TWO divs. So at the end of the file, we need TWO `</div>`.
  // So I will just append a </div> at the very end.
  // Actually, let's revert all to `</div>\n  );\n};` then add an extra `</div>` just before the LAST `);\n};`.
  
  let parts = content.split(');\\n};');
  // it might be );\\n}; or );\\r\\n};
  
  content = content.replace(/<\/div>\s*<\/div>\s*\)\s*;/g, '</div>\n  );');
  
  // Find the last occurrence of ');' and insert '</div>' before it.
  const lastIndex = content.lastIndexOf(');');
  if (lastIndex !== -1) {
    content = content.substring(0, lastIndex) + '</div>\n  ' + content.substring(lastIndex);
  }

  fs.writeFileSync(file, content);
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => {
  fixFile(`${loc}/LearningOutcome${n}.tsx`);
});
