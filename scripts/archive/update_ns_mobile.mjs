import fs from 'fs';
import path from 'path';

const file = 'src/features/courses/polytechnic/nc-it/national-studies/NationalStudies.tsx';

if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');

    // Replace the mobile topbar buttons area entirely
    content = content.replace(
        /<div className=\{`h-14 px-4 py-3 flex flex-wrap items-center justify-between shrink-0 border-b \$\{isDarkMode \? "bg-\[#252526\] border-\[#404040\]" : "bg-\[#f8f9fa\] border-gray-200"\}`\}>[\s\S]*?<\/div>\n\s*<\/div>\n\s*<div id="lesson-scroll-area"/,
        `<div className={\`lg:hidden h-14 border-b flex items-center justify-between px-4 shrink-0 sticky top-0 z-10 \${isDarkMode ? 'bg-[#1e1e1e]/90 border-[#404040] backdrop-blur-md' : 'bg-[#f4f4f5]/90 border-gray-200 backdrop-blur-md'}\`}>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={\`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all text-white \${isDarkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#003153] hover:bg-[#003153]/90"}\`}
                >
                    <LayoutDashboard size={18} />
                    <span>Outcomes</span>
                </button>
            </div>
            <div id="lesson-scroll-area"`
    );

    fs.writeFileSync(file, content, 'utf-8');
    console.log("Updated", file);
}
