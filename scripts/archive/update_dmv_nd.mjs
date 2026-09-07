import fs from 'fs';
import path from 'path';

const file = 'src/features/courses/DynamicModuleViewer.tsx';
let content = fs.readFileSync(file, 'utf-8');

const subjects = [
  { dir: 'preservation-management', count: 5, prefix: 'NdPres', name: 'Preservation Management' },
  { dir: 'database-analysis-and-design', count: 4, prefix: 'NdDb', name: 'Database Analysis & Design' },
  { dir: 'information-literacy', count: 5, prefix: 'NdInfoLit', name: 'Information Literacy' },
  { dir: 'records-centre-management', count: 6, prefix: 'NdRecCent', name: 'Records Centre Management' },
  { dir: 'reprographics', count: 5, prefix: 'NdRepro', name: 'Reprographics' },
  { dir: 'archives-administration', count: 6, prefix: 'NdArch', name: 'Archives Administration' },
  { dir: 'indigenous-knowledge-systems-mgmt', count: 5, prefix: 'NdIndig', name: 'Indigenous Knowledge Systems Mgmt.' },
  { dir: 'records-and-info-services-automation', count: 4, prefix: 'NdRecAuto', name: 'Records & Info Services Automation' },
  { dir: 'research-methods-in-info-science', count: 5, prefix: 'NdResMeth', name: 'Research Methods in Info Science' }
];

let imports = '';
subjects.forEach(subject => {
  imports += `\n// ND Records & Information Management - ${subject.name}\n`;
  for(let i=1; i<=subject.count; i++) {
    imports += `import { LearningOutcome${i} as ${subject.prefix}LO${i} } from './courses/polytechnic/records-nd/${subject.dir}/LearningOutcome${i}';\n`;
  }
});

// insert imports
const importTargetBytes = `import { LearningOutcome6 as NdRecInfoLO6 } from './courses/polytechnic/records-nd/records-and-information-management/LearningOutcome6';`;
content = content.replace(importTargetBytes, importTargetBytes + '\n' + imports);

let logicBlocks = '';
subjects.forEach(subject => {
  logicBlocks += `        if (subject === '${subject.name}') {\n`;
  for(let i=1; i<=subject.count; i++) {
    logicBlocks += `            if (activeLO === ${i}) return <${subject.prefix}LO${i} />;\n`;
  }
  logicBlocks += `        }\n`;
});

const logicTargetBytes = `        if (subject === 'Records & Information Management') {
            if (activeLO === 1) return <NdRecInfoLO1 />;
            if (activeLO === 2) return <NdRecInfoLO2 />;
            if (activeLO === 3) return <NdRecInfoLO3 />;
            if (activeLO === 4) return <NdRecInfoLO4 />;
            if (activeLO === 5) return <NdRecInfoLO5 />;
            if (activeLO === 6) return <NdRecInfoLO6 />;
        }`;

content = content.replace(logicTargetBytes, logicTargetBytes + '\n' + logicBlocks);

fs.writeFileSync(file, content);
console.log('done updating dmv');

