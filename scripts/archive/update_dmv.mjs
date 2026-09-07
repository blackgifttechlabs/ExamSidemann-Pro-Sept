import fs from 'fs';

const file = 'src/features/courses/DynamicModuleViewer.tsx';
if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');

    content = content.replace(
        /<button \s*onClick=\{\(\) => setIsSidebarOpen\(true\)\} \s*className=\{`lg:hidden p-1\.5 mr-2 rounded-md transition-colors \$\{isDarkMode \? "hover:bg-\[#404040\] text-gray-400 hover:text-white" : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"\}`\}\s*>\s*<List size=\{18\} \/>\s*<\/button>/,
        `<button 
            onClick={() => setIsSidebarOpen(true)}
            className={\`lg:hidden flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-[5px] shadow-sm transition-all text-white mr-2 \${isDarkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#003153] hover:bg-[#003153]/90"}\`}
        >
            <LayoutDashboard size={18} />
            <span>Outcomes</span>
        </button>`
    );

    fs.writeFileSync(file, content, 'utf-8');
    console.log("Updated DynamicModuleViewer");
}
