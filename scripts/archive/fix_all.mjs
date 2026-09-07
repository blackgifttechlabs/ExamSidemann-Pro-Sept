import fs from 'fs';
import path from 'path';

let dmvContent = fs.readFileSync('src/features/courses/DynamicModuleViewer.tsx', 'utf-8');

let replaced = false;
if (!dmvContent.includes('id="prevBtn"')) {
    dmvContent = dmvContent.replace(
        /\{pagerState && pagerState\.totalPages > 1 && \(\s+<div className="flex items-center gap-2 md:gap-4 z-10">/,
        `{!pagerState ? (
                        <div className="flex items-center gap-2 md:gap-4 z-10">
                            <button className="pagination-btn disabled px-3 py-1 text-xs md:text-sm bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors" id="prevBtn" disabled>Previous</button>
                        </div>
                    ) : pagerState.totalPages > 1 && (
                      <div className="flex items-center gap-2 md:gap-4 z-10">`
    );
    replaced = true;
}

const sidebarLogic = `else if (subject === 'Web Development' || subject === 'Information Security' || subject === 'Operating Systems Administration') {
                      unitLabel = \`Learning Outcome \${num}\`;
                  }`;

if (!dmvContent.includes("Web Development' || subject === 'Information Security'")) {
    dmvContent = dmvContent.replace(
        /else if \(subject === 'Computer Systems Maintenance'\) \{/,
        sidebarLogic + '\n                  } else if (subject === \'Computer Systems Maintenance\') {'
    );
    replaced = true;
}

if (replaced) fs.writeFileSync('src/features/courses/DynamicModuleViewer.tsx', dmvContent);

function createPlaceholder(subjectDir, title, loNum) {
    const filePath = `src/features/courses/polytechnic/nd-it/${subjectDir}/LearningOutcome${loNum}.tsx`;
    if (!fs.existsSync(filePath)) {
        const content = `import React from 'react';

export const LearningOutcome${loNum}: React.FC = () => {
    return (
        <div className="w-full py-8 px-[30px] min-h-screen">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 flex flex-col sm:flex-row items-center justify-center gap-3"><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Learning Outcome ${loNum}</span></h1>
                <p className="text-xl text-gray-500">${title} - Hardcoded Learning Outcome tags</p>
            </header>
            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-bold">Topic Placeholder</h2>
                    <p>This is a generated placeholder replacing the old unit-based naming convention manually.</p>
                    <div className="pagination-targets">
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LearningOutcome${loNum};
`;
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, content);
    } else {
        let fileContent = fs.readFileSync(filePath, 'utf-8');
        let oldContent = fileContent;
        fileContent = fileContent.replace(/Unit (\d+)/g, 'Learning Outcome $1');
        if (oldContent !== fileContent) {
            fs.writeFileSync(filePath, fileContent);
        }
    }
}

for (let i = 1; i <= 8; i++) createPlaceholder('operating-systems-administration', 'Operating Systems Administration', i);
for (let i = 1; i <= 8; i++) createPlaceholder('web-development', 'Web Development', i);
for (let i = 1; i <= 7; i++) createPlaceholder('information-security', 'Information Security', i);

const heroBlock = `
      {/* DESCRIPTIVE HERO BLOCK */}
      <div className="w-full max-w-5xl mx-auto mb-10 p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl shadow-2xl relative overflow-hidden my-6">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">System Architecture & Methodologies</h2>
        <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-3xl">
          Explore the specific lifecycle, design patterns, and methodologies required to master this domain. This module focuses on systematic approaches, professional standards, and real-world implementation strategies used by modern engineering teams.
        </p>
      </div>
      {/* END DESCRIPTIVE HERO BLOCK */}
`;

function injectHero(subjectDir) {
    const dir = `src/features/courses/polytechnic/nd-it/${subjectDir}`;
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f.startsWith('LearningOutcome'));
    for (const f of files) {
        const fp = path.join(dir, f);
        let content = fs.readFileSync(fp, 'utf-8');
        if (content.includes('DESCRIPTIVE HERO BLOCK') || content.includes('specific lifecycle, design patterns')) continue;

        if (content.includes('</header>')) {
            content = content.replace('</header>', '</header>' + heroBlock);
            fs.writeFileSync(fp, content);
        } else if (content.includes('<div className="space-y-')) {
            content = content.replace(/<div className="space-y-[^"]+">/, heroBlock + '\n      $&');
            fs.writeFileSync(fp, content);
        } else {
            console.log("Could not find insertion point in", fp);
        }
    }
}

injectHero('software-engineering');
injectHero('hardware-administration');
injectHero('object-oriented-programming');

console.log("Fixes applied successfully.");
