import fs from 'fs';
import path from 'path';

const coursesDirs = [
    'src/features/courses/polytechnic/nc-it/computer-networking',
    'src/features/courses/polytechnic/nc-it/computer-security'
];

const newContainerBodyHeader = `
  const containerClasses = isDarkMode
    ? 'w-full py-6 sm:py-12 md:py-16 px-3 sm:px-[30px] bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 min-h-screen relative'
    : 'w-full py-6 sm:py-12 md:py-16 px-3 sm:px-[30px] bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen relative';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 pb-3 border-b-4 border-indigo-500 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 pb-3 border-b-4 border-indigo-600 inline-block relative group uppercase mt-12';

  const examTipClasses = isDarkMode
    ? 'bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-[5px] my-5'
    : 'bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-[5px] my-5';

  const cardClasses = (color) => {
    const colorMap = {
      blue: 'border-l-8 border-blue-500',
      green: 'border-l-8 border-green-500',
      purple: 'border-l-8 border-purple-500',
      amber: 'border-l-8 border-amber-500',
      red: 'border-l-8 border-red-500',
      indigo: 'border-l-8 border-indigo-500',
    };
    const borderColor = colorMap[color] || colorMap.blue;
    return \`\${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-[5px] shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl \${borderColor}\`;
  };

  const rowBg = (alt) => isDarkMode ? (alt ? 'bg-[#1e1e1e]' : 'bg-[#252526]') : (alt ? 'bg-[#f8f9fa]' : 'bg-white');
  const theadBg = isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-100';
`;

function getHeaderHTML(courseCode, loNumber) {
return `      {/* HEADER SECTION */}
      
      {/* New Polished Interactive Header */}
      <header className={\`relative w-full mb-12 rounded-[5px] overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Map className="w-4 h-4" />
              ${courseCode === 'NET' ? 'NCN: Module LO' + loNumber : 'NCS: Module LO' + loNumber}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Simply Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 italic">Learning</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Step-by-step tutorials tracking the syllabus. This outcome focuses on <span className="text-white font-bold underline decoration-emerald-400">Learning Outcome ${loNumber}</span>.
            </p>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    module.docs
                  </div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">${courseCode}_Strategy;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">"Learning Outcome ${loNumber}";</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">PRINT</span><span className="text-white">"Comprehensive Student Notebook";</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Shield className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Flag className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>`;
}

function processFile(filePath, courseCode) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const m = filePath.match(/LearningOutcome(\d+)\.tsx/);
    if (!m) return;
    const loNumber = m[1];

    if (!content.includes('Map')) {
        content = content.replace(/import\s+\{\s*/, 'import { Map, Flag, Shield, ');
    } else {
        if (!content.includes('Flag')) {
            content = content.replace(/import\s+\{\s*/, 'import { Flag, Shield, ');
        }
    }

    // replace old section headers
    let regexClasses = /const sectionHeaderClasses = .*?(?=return\s*\()/s;
    if (regexClasses.test(content)) {
        content = content.replace(regexClasses, newContainerBodyHeader + "\n\n  ");
    }

    // Since regexes are complicated, find the start of the `return (...)` and the ending `</div></div>` or similar
    let startRetIdx = content.indexOf('return (');
    if (startRetIdx !== -1) {
        let afterRet = content.slice(startRetIdx);
        // Find inside where we can put the new header.
        
        let replaceHeader = false;
        
        // Pattern 1:
        let p1 = /<div className="w-full bg-slate-50[^>]*>[\s\S]*?<div className="w-full py-8[^>]*>[\s\S]*?(?:\{\/\*\s*Header\s*\*\/\})?[\s\S]*?<div className="w-full text-left mb-12">[\s\S]*?<\/div>/s;
        let p2 = /<div className="w-full bg-gradient-[^>]*>[\s\S]*?<div className="w-full py-8[^>]*>[\s\S]*?(?:\{\/\*\s*Header\s*\*\/\})?[\s\S]*?<div className="w-full text-left mb-12">[\s\S]*?<\/div>/s;
        
        const headerMarkup = `    <div className={containerClasses}>\n` + getHeaderHTML(courseCode, loNumber);

        if (p1.test(afterRet)) {
            afterRet = afterRet.replace(p1, headerMarkup);
            replaceHeader = true;
        } else if (p2.test(afterRet)) {
            afterRet = afterRet.replace(p2, headerMarkup);
            replaceHeader = true;
        }
        
        if (replaceHeader) {
            content = content.slice(0, startRetIdx) + afterRet;
            // Now remove one extra closing </div> because we replaced 2 opening divs with 1
            let divs = 0;
            // A simple hack: since we know we removed one outer div layer, find the very last </div> before possible <AdSense /> or just eof and remove it.
            // Actually it's easier to use a regex the end of return block.
            content = content.replace(/<\/div>\s*(?:<AdSense[^>]*>\s*<\/AdSense>\s*)?<\/div>\s*\)\s*;\s*}/s, '</div>\n      {/* AdSense Could Be Here */}\n    </div>\n  );\n}');
        } else {
             console.log("No matching header divs in " + filePath);
        }
    }

    content = content.replace(/rounded-lg/g, 'rounded-[5px]');
    content = content.replace(/rounded-xl/g, 'rounded-[5px]');
    content = content.replace(/rounded-2xl/g, 'rounded-[5px]');
    content = content.replace(/prose-lg/g, 'prose-sm sm:prose-base');

    fs.writeFileSync(filePath, content, 'utf-8');
}

for (const dir of coursesDirs) {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));
        for (const file of files) {
            const courseCode = dir.includes('networking') ? 'NET' : 'SEC';
            processFile(path.join(dir, file), courseCode);
            console.log(`Updated ${file} in ${dir}`);
        }
    }
}
