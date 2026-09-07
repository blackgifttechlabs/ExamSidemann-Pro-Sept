import fs from 'fs';

const dbFile = 'src/features/courses/polytechnic/nc-it/database-concepts/DatabaseConcepts.tsx';
if (fs.existsSync(dbFile)) {
    let content = fs.readFileSync(dbFile, 'utf-8');

    // Make 'Outcomes' appear as a button in same style:
    content = content.replace(
        /className="lg:hidden p-2 text-gray-500 dark:text-gray-300 hover:text-\[#003153\] dark:hover:text-white transition-all flex items-center gap-2 shrink-0 border border-gray-200 dark:border-white\/10 px-3 py-1\.5"/g,
        'className={`lg:hidden flex items-center gap-2 text-sm font-bold px-4 py-2 shadow-sm transition-all text-white ${isDarkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#003153] hover:bg-[#003153]/90"}`}'
    );

    const markOutcomeDoneRegex = /<button onClick=\{handleToggleComplete\}[^>]+>[\s\S]*?<\/button>/;
    content = content.replace(markOutcomeDoneRegex, '');

    fs.writeFileSync(dbFile, content, 'utf-8');
}

const progFile = 'src/features/courses/polytechnic/nc-it/programming-concepts/proframmingconcepts.tsx';
if (fs.existsSync(progFile)) {
    let content = fs.readFileSync(progFile, 'utf-8');

    const markOutcomeDoneRegex = /<button\s*onClick=\{[^}]+\}\s*className="px-8 py-4[^>]+>[\s\S]*?<\/button>/g;
    content = content.replace(markOutcomeDoneRegex, '');

    fs.writeFileSync(progFile, content, 'utf-8');
}
