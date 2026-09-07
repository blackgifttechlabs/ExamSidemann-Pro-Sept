import fs from 'fs';

let content = fs.readFileSync('./components/courses/polytechnic/nc-it/module1/LearningOutcome5.tsx', 'utf8');

const replacement = `<div className="w-full bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full py-8 sm:py-12 md:py-16 px-[10px] sm:px-6 md:px-[30px] animate-dropdown-reveal space-y-10 md:space-y-14 text-left">
        
        {/* Polished Header */}
        <header className={\`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \${isDarkMode ? 'bg-slate-950' : 'bg-slate-900'}\`}>
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-[10px] md:p-8 items-center px-[10px] md:px-6 py-12 sm:px-12 sm:py-16">
            {/* Left Side Content */}
            <div className="flex flex-col items-start gap-[10px] md:p-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                COMPUTER SYSTEMS MAINTENANCE
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Simply Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 italic">Learning</span>
              </h1>
              
              <p className="text-xl sm:text-2xl font-medium text-blue-100 max-w-2xl leading-relaxed">
                Step-by-step guides to master standard computer repair and hardware optimization. Learning Outcome 5 focuses on <span className="text-white font-bold underline decoration-blue-400">Monitoring & Troubleshooting</span>.
              </p>

              <div className="flex flex-wrap items-center gap-[10px] md:p-6 mt-4">
                <div className="flex items-center gap-2 text-blue-200">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">System Diagnostics</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Performance Checks</span>
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Wrench className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">Fault Rectification</span>
                </div>
              </div>
            </div>

            {/* Right Side Illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <div className="relative group w-full max-w-lg">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2">
                      <Activity className="w-3 h-3 text-blue-500" />
                      sys_monitor
                    </div>
                  </div>
                  <div className="p-6 h-64 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm"><div className="text-[10px] uppercase font-bold text-gray-500 mb-1">CPU Load</div><div className="text-xl font-mono text-white font-black">24%</div><div className="w-full h-1 bg-gray-700 mt-2 rounded"><div className="w-[24%] h-full bg-blue-500 rounded"></div></div></div>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm"><div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Memory</div><div className="text-xl font-mono text-white font-black">4.2<span className="text-sm">GB</span></div><div className="w-full h-1 bg-gray-700 mt-2 rounded"><div className="w-[42%] h-full bg-purple-500 rounded"></div></div></div>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-sm flex items-center justify-between"><div className="flex items-center gap-3"><HardDrive className="text-gray-400 w-5 h-5" /><div><div className="text-xs font-bold text-gray-100">Disk Storage</div><div className="text-[10px] text-gray-500">Secondary Drive</div></div></div><span className="text-xs font-mono font-bold text-green-500 border border-green-500/30 bg-green-500/10 px-2 py-0.5 rounded">HEALTHY</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Introduction */}
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-6 border border-gray-200 dark:border-white/10 rounded-2xl mb-12 shadow-sm">
            <span className="text-blue-500 shrink-0"><CheckCircle size={32} /></span>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-lg leading-relaxed italic">
                Proactive maintenance protocols and systematic fault rectification for modern computing environments.
            </p>
        </div>`;

content = content.replace(/<div className="w-full space-y-10 md:space-y-14 text-left animate-dropdown-reveal px-\[\20px\]">[\s\S]*?<\/div>\s*<\/header>\s*<div className="bg-gray-50 dark:bg-white\/5 p-6 border border-gray-200 dark:border-white\/10">\s*<p className="text-gray-700 dark:text-gray-300 font-black text-sm md:text-lg uppercase tracking-widest leading-relaxed italic">\s*Proactive maintenance protocols and systematic fault rectification for modern computing environments.\s*<\/p>\s*<\/div>/g, replacement);

content += '\n</div>';

fs.writeFileSync('./components/courses/polytechnic/nc-it/module1/LearningOutcome5.tsx', content);
