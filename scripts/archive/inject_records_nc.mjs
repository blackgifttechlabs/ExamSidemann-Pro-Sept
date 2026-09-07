import fs from 'fs';
import path from 'path';

const viewerPath = path.join(process.cwd(), 'src/features/courses/DynamicModuleViewer.tsx');
let content = fs.readFileSync(viewerPath, 'utf-8');

const importsLines = [];
const renderLines = [];

const subjectsData = [
  { dir: 'archiving', name: 'Archiving', prefix: 'Arch' },
  { dir: 'classification-of-records', name: 'Classification of Records', prefix: 'ClassRec' },
  { dir: 'digital-conv-mail-management', name: 'Digital & Conv. Mail Management', prefix: 'DigMail' },
  { dir: 'digital-filing', name: 'Digital Filing', prefix: 'DigFil' },
  { dir: 'reception-management', name: 'Reception Management', prefix: 'RecMan' },
  { dir: 'records-preservation', name: 'Records Preservation', prefix: 'RecPres' },
  { dir: 'reprography', name: 'Reprography', prefix: 'Repro' },
  { dir: 'workplace-communication', name: 'Workplace Communication', prefix: 'WorkComRm' },
  { dir: 'national-studies', name: 'National Studies', prefix: 'NatStuRm' },
  { dir: 'entrepreneurial-skills-dev', name: 'Entrepreneurial Skills Dev.', prefix: 'EntrepRm' }
];

for (const s of subjectsData) {
  importsLines.push(`// NC Records Management - ${s.name}`);
  for (let i = 1; i <= 6; i++) {
    importsLines.push(`import { LearningOutcome${i} as ${s.prefix}LO${i} } from './courses/polytechnic/records-nc/${s.dir}/LearningOutcome${i}';`);
  }
}

renderLines.push(`    if (level === 'NC Records Management' || level === 'records-nc') {`);
for (const s of subjectsData) {
  renderLines.push(`        if (subject === '${s.name}') {`);
  for (let i = 1; i <= 6; i++) {
    renderLines.push(`            if (activeLO === ${i}) return <${s.prefix}LO${i} />;`);
  }
  renderLines.push(`        }`);
}
renderLines.push(`    }`);

// insert imports before `interface DynamicModuleViewerProps`
const importTarget = 'interface DynamicModuleViewerProps {';
content = content.replace(importTarget, importsLines.join('\n') + '\n\n' + importTarget);

// insert render block before `if (['Form 1',`
const renderTarget = "    if (['Form 1', 'Form 2', 'Form 3', 'Form 4'].includes(level) && subject === 'Shona') {";
content = content.replace(renderTarget, renderLines.join('\n') + '\n\n' + renderTarget);

fs.writeFileSync(viewerPath, content);
console.log('Injected records-nc into DynamicModuleViewer.tsx');
