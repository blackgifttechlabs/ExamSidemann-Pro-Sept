import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'src/features/courses/polytechnic/records-nc');

const subjects = [
  { dir: 'archiving', name: 'Archiving' },
  { dir: 'classification-of-records', name: 'Classification of Records' },
  { dir: 'digital-conv-mail-management', name: 'Digital & Conv. Mail Management' },
  { dir: 'digital-filing', name: 'Digital Filing' },
  { dir: 'reception-management', name: 'Reception Management' },
  { dir: 'records-preservation', name: 'Records Preservation' },
  { dir: 'reprography', name: 'Reprography' },
  { dir: 'workplace-communication', name: 'Workplace Communication' },
  { dir: 'national-studies', name: 'National Studies' },
  { dir: 'entrepreneurial-skills-dev', name: 'Entrepreneurial Skills Dev.' }
];

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

for (const subject of subjects) {
  const subjectDir = path.join(baseDir, subject.dir);
  if (!fs.existsSync(subjectDir)) {
    fs.mkdirSync(subjectDir, { recursive: true });
  }

  for (let i = 1; i <= 6; i++) {
    const filePath = path.join(subjectDir, `LearningOutcome${i}.tsx`);
    const content = `import React from 'react';

export const LearningOutcome${i}: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl min-h-[50vh]">
      <h1 className="text-3xl font-black mb-6 text-gray-900 dark:text-white uppercase">
        Learning Outcome ${i}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        Detailed content for ${subject.name} - Learning Outcome ${i} will be added here.
      </p>
    </div>
  );
};
`;
    fs.writeFileSync(filePath, content);
  }
}
console.log("Done");
