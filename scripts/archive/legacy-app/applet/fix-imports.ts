import * as fs from 'fs';

const files = [
  '/app/applet/components/courses/polytechnic/records-nc/digital-filing/LearningOutcome1.tsx',
  '/app/applet/components/courses/polytechnic/records-nc/digital-filing/LearningOutcome2.tsx',
  '/app/applet/components/courses/polytechnic/records-nc/digital-filing/LearningOutcome3.tsx',
  '/app/applet/components/courses/polytechnic/records-nc/digital-filing/LearningOutcome4.tsx',
  '/app/applet/components/courses/polytechnic/records-nc/digital-conv-mail-management/LearningOutcome1.tsx',
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');

  // get all tags used
  const matches = [...code.matchAll(/<([A-Z][a-zA-Z0-9]*)/g)].map(m => m[1]);
  const tags = new Set(matches);
  const usedTags = Array.from(tags).filter(t => t !== 'div' && t !== 'p' && t !== 'h1' && t !== 'h2' && t !== 'h3' && t !== 'ul' && t !== 'li' && t !== 'span' && t !== 'header' && t !== 'section' && t !== 'table' && t !== 'thead' && t !== 'tbody' && t !== 'tr' && t !== 'th' && t !== 'td' && t !== 'React' && t !== 'strong');
  
  if (usedTags.length === 0) continue;

  const validIcons = usedTags.filter(t => !['TableWrapper'].includes(t)); // Ignore custom components 
  
  // Clean up any occurrences of missing/wrong tags by mapping them to known working Lucide icons
  const mappings = {
    'FolderTreeIcon': 'FolderTree',
    'EditIcon': 'Edit',
    'TargetIcon': 'Target',
    'HashIcon': 'Hash',
    'ShieldIcon': 'Shield',
    'ListChecksIcon': 'ListChecks',
    'LayoutIcon': 'Layout',
    'Alphabet': 'Type', // Approximation
    'Text': 'FileText',
    'ScissorsIcon': 'Scissors',
    'Paperclip': 'Paperclip',
    'ArchiveIcon': 'Archive',
    'CloudIcon': 'Cloud',
    'Scale': 'Scale',
  };

  for (const [wrong, correct] of Object.entries(mappings)) {
    if (validIcons.includes(wrong) && !validIcons.includes(correct)) {
       validIcons.push(correct);
    }
    // replace in code too
    code = code.replace(new RegExp(`<${wrong}`, 'g'), `<${correct}`);
  }
  
  const finalIcons = validIcons.filter(t => !(t in mappings)); // Remove the wrongly named ones from imports

  const importStatement = `import {\n  ` + finalIcons.join(', ') + `\n} from 'lucide-react';`;

  // remove the old huge lucide import
  code = code.replace(/import \{(.|\n)*?\} \s*from\s+['"]lucide-react['"];/m, importStatement);
  fs.writeFileSync(file, code);
}
