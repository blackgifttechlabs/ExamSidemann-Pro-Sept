import fs from 'fs';
import path from 'path';

const file = 'src/features/courses/polytechnic/nc-it/national-studies/NationalStudies.tsx';

if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');

    // Remove the Mark as Done button from main navbar
    const mainMarkDoneRegex = /<div className="flex items-center gap-3">\s*<button onClick=\{handleToggleComplete\}[^>]+>\s*<CheckCircle[^>]+>\s*<span>\{isCompleted \? 'Completed' : 'Mark as Done'\}<\/span>\s*<\/button>\s*<\/div>/g;
    content = content.replace(mainMarkDoneRegex, '');

    fs.writeFileSync(file, content, 'utf-8');
    console.log("Updated", file);
}
