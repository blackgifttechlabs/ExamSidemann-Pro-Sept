import fs from 'fs';
import path from 'path';

const subjects = [
  { dir: 'preservation-management', count: 5, name: 'Preservation Management' },
  { dir: 'database-analysis-and-design', count: 4, name: 'Database Analysis & Design' },
  { dir: 'information-literacy', count: 5, name: 'Information Literacy' },
  { dir: 'records-centre-management', count: 6, name: 'Records Centre Management' },
  { dir: 'reprographics', count: 5, name: 'Reprographics' },
  { dir: 'archives-administration', count: 6, name: 'Archives Administration' },
  { dir: 'indigenous-knowledge-systems-mgmt', count: 5, name: 'Indigenous Knowledge Systems Mgmt.' },
  { dir: 'records-and-info-services-automation', count: 4, name: 'Records & Info Services Automation' },
  { dir: 'research-methods-in-info-science', count: 5, name: 'Research Methods in Info Science' }
];

const basePath = 'src/features/courses/polytechnic/records-nd';

subjects.forEach(subject => {
  const fullDir = path.join(basePath, subject.dir);
  if (!fs.existsSync(fullDir)) {
    fs.mkdirSync(fullDir, { recursive: true });
  }

  for (let i = 1; i <= subject.count; i++) {
    const content = `import React from 'react';
import { BookOpen, CheckCircle, Brain, FileText } from 'lucide-react';

export const LearningOutcome${i} = () => {
    return (
        <div className="p-6 bg-white min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Learning Outcome ${i}</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-start gap-4 shadow-sm border border-gray-100">
                <BookOpen className="text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">Objectives</h3>
                    <p className="text-gray-600">By the end of this topic, you should be able to master the core principles of ${subject.name}.</p>
                </div>
            </div>

            <div className="space-y-6">
                <section>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> Introduction</h3>
                    <p className="text-gray-700 leading-relaxed">
                        This section covers the introductory concepts of ${subject.name}.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CheckCircle size={20} /> Key Concepts</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Concept 1 for LO${i}</li>
                        <li>Concept 2 for LO${i}</li>
                        <li>Concept 3 for LO${i}</li>
                    </ul>
                </section>

                <section className="bg-indigo-50 p-4 rounded-lg">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-indigo-800"><Brain size={20} /> Knowledge Check</h3>
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                            <p className="font-semibold mb-2">Question 1:</p>
                            <p className="text-gray-700">What is the primary goal of this topic?</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
`;
    fs.writeFileSync(path.join(fullDir, `LearningOutcome${i}.tsx`), content);
  }
});
