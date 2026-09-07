const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    try {
        fs.readdirSync(dir).forEach(file => {
            filelist = fs.statSync(path.join(dir, file)).isDirectory()
                ? walkSync(path.join(dir, file), filelist)
                : filelist.concat(path.join(dir, file));
        });
    } catch(e) {}
    return filelist;
};

let files = walkSync('.').filter(f => (f.includes('shona') || f.includes('national-studies')) && f.endsWith('.tsx'));

console.log("Found files:", files.length);

const DB_CONTAINER_CLASSES = `  const containerClasses = isDarkMode
    ? 'w-full py-8 sm:py-12 md:py-16 px-[30px] bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 min-h-screen relative'
    : 'w-full py-8 sm:py-12 md:py-16 px-[30px] bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen relative';`;

const OLD_CONTAINER_CLASSES_NASS = /const containerClasses = isDarkMode[\s\S]*?bg-white min-h-screen';/g;

for (let file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // 1. NASS FILES
    if (file.includes('national-studies')) {
        content = content.replace(OLD_CONTAINER_CLASSES_NASS, DB_CONTAINER_CLASSES);
        
        let headerRegex = /<header className="border-b-8[^>]*>[\s\S]*?<\/header>/g;
        let match = headerRegex.exec(content);
        if (match) {
            let oldHeader = match[0];
            let h1Match = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(oldHeader);
            let pMatch = /<p[^>]*>([\s\S]*?)<\/p>/.exec(oldHeader);
            let spanMatch = /<span[^>]*>([\s\S]*?)<\/span>/.exec(oldHeader);

            let title = h1Match ? h1Match[1].trim().replace(/<br\/>/g, ' ') : "Learning Outcome";
            let subtitle = pMatch ? pMatch[1].trim() : "Comprehensive Student Notebook";
            let subject = spanMatch ? spanMatch[1].replace(/National and Strategic Studies • /, '').trim() : "National Studies";
            
            let newHeader = `
      {/* New Polished Interactive Header */}
      <header className={\`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Map className="w-4 h-4" />
              NASS: ${subject}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Simply Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 italic">Learning</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Step-by-step tutorials tracking the syllabus. This outcome focuses on <span className="text-white font-bold underline decoration-emerald-400">${title}</span>.
            </p>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    module.docs
                  </div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">National_Strategy;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">"${title}";</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">PRINT</span><span className="text-white">"${subtitle}";</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Shield className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Flag className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>`;
            content = content.replace(oldHeader, newHeader);
            if(!content.includes('Map,')) content = content.replace(/import {/, 'import { Map, Shield, Flag,');
        }

        // Fix root classes and H2
        content = content.replace(/<div className="w-full [^>]*?space-y-16[^>]*">/, '<div className={containerClasses}>');
        content = content.replace(/<div className="w-full max-w-7xl mx-auto space-y-16 text-left animate-dropdown-reveal pb-40 px-4 md:px-6">/, '<div className={containerClasses}>');
        
        let oldH2 = /<h2 className="text-2xl md:text-3xl font-black uppercase text-gray-900 dark:text-white">/g;
        let oldH2Alt = /<h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white">/g;
        content = content.replace(oldH2, '<h2 className={sectionHeaderClasses}>');
        content = content.replace(oldH2Alt, '<h2 className={sectionHeaderClasses}>');
        
        fs.writeFileSync(file, content);
    } 
    // 2. SHONA FILES
    else if (file.includes('shona')) {
        let isSetup = content.includes('isDarkMode');
        
        let headerRegex = /<header className="border-b-4[^>]*>[\s\S]*?<\/header>/g;
        let match = headerRegex.exec(content);
        
        if (!isSetup) {
            content = content.replace(/export const (.*?): React\.FC.*?=> {/, (m) => {
                return `${m}
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

${DB_CONTAINER_CLASSES}

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 pb-3 border-b-4 border-indigo-500 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 pb-3 border-b-4 border-indigo-600 inline-block relative group uppercase mt-12';

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
    return \`\${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-xl shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl \${borderColor}\`;
  };
`;
            });
        }
        
        if (match) {
            let oldHeader = match[0];
            let h1Match = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(oldHeader);
            let pMatch = /<p[^>]*>([\s\S]*?)<\/p>/.exec(oldHeader);
            
            let title = h1Match ? h1Match[1].trim() : "Chidzidzo";
            let subtitle = pMatch ? pMatch[1].trim() : "Gwaro rino rakanyorwa nhanho nenhanho kuitira kuti mudzidzi agone unyanzvi hwekunyora nenzira yakajeka.";

            let newHeader = `
      {/* New Polished Shona Header */}
      <header className={\`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\`}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <BookOpen className="w-4 h-4" />
              SHONA FORM 1
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Kudzidza ChiShona <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 italic">Zviri Nyore</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Dzidza nemufaro. Gwaro rino rinotarisa nezve <span className="text-white font-bold underline decoration-emerald-400">${title}</span>.
            </p>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    shona.txt
                  </div>
                </div>
                
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">1</span>
                    <span className="text-emerald-400 font-bold">DZIDZASO</span>
                    <span className="text-white">"${title}";</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">2</span>
                    <span className="text-cyan-400 font-bold">DZIMWE</span>
                    <span className="text-white">"${subtitle}";</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <span className="text-gray-600 select-none">3</span>
                    <div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>`;
            
            content = content.replace(oldHeader, newHeader);
        }
        
        // Replace H2s (various forms)
        let h2Regex = /<h2 className="text-lg md:text-[23]xl font-black text-gray-900 dark:text-white uppercase tracking-tight[^"]*">/g;
        let h2Regex2 = /<h2 className="text-lg md:text-[23]xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">/g;
        let h2Regex3 = /<h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight text-center mb-[^"]*">/g;
        let h2Regex4 = /<h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-[^"]*">/g;
        let h2Regex5 = /<h2 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">/g;

        content = content.replace(h2Regex, '<h2 className={sectionHeaderClasses}>');
        content = content.replace(h2Regex2, '<h2 className={sectionHeaderClasses}>');
        content = content.replace(h2Regex3, '<h2 className={sectionHeaderClasses}>');
        content = content.replace(h2Regex4, '<h2 className={sectionHeaderClasses}>');
        content = content.replace(h2Regex5, '<h2 className={sectionHeaderClasses}>');
        

        // Replace article/div with containerClasses
        content = content.replace(/<article className="w-full[^>]*">/, '<div className={containerClasses}>');
        content = content.replace(/<\/article>/g, '</div>');
        
        fs.writeFileSync(file, content);
    }
}
