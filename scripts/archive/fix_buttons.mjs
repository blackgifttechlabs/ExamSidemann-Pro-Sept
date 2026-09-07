import fs from 'fs';
import path from 'path';

const files = [
    'src/features/courses/polytechnic/nc-it/computer-networking/ComputerNetworking.tsx',
    'src/features/courses/polytechnic/nc-it/computer-security/ComputerSecurity.tsx'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf-8');

    // Make 'Outcomes' appear as a button:
    content = content.replace(
        /className=\{`flex items-center gap-2 text-sm font-medium px-3 py-1\.5 rounded-\[5px\] \$\{isDarkMode \? "hover:bg-\[#2d2d2d\] text-gray-300" : "hover:bg-gray-200 text-gray-700"\}`\}/g,
        'className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all text-white ${isDarkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#003153] hover:bg-[#003153]/90"}`}'
    );

    // Remove the Mark Done button from mobile top bar
    const mobileMarkDoneRegex = /<div className="flex items-center gap-2">\s*<button onClick=\{handleToggleComplete\}[^>]+>\s*<CheckCircle[^>]+>\s*<span>\{isCompleted \? 'Done' : 'Mark Done'\}<\/span>\s*<\/button>\s*<\/div>/g;
    content = content.replace(mobileMarkDoneRegex, '');

    // Remove the Mark as Done button from main navbar
    const mainMarkDoneRegex = /<div className="flex items-center gap-3">\s*<button onClick=\{handleToggleComplete\}[^>]+>\s*<CheckCircle[^>]+>\s*<span>\{isCompleted \? 'Completed' : 'Mark as Done'\}<\/span>\s*<\/button>\s*<\/div>/g;
    content = content.replace(mainMarkDoneRegex, '');

    fs.writeFileSync(file, content, 'utf-8');
    console.log("Updated", file);
}
