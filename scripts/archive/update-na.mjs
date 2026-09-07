import fs from 'fs';

function updateHeader(file, titleColor, learningObj, desc, iconName) {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to match the old header format
  // This varies a little bit per file, but generally it's:
  // return (
  //   <div className="w-full ...">
  //     {/* HEADER */}
  //     <header ...>
  //     ...
  //     </header>
  
  const headerRegex = /<div className="w-full.*?">\s*(?:\{\/\*\s*HEADER\s*\*\/\})?\s*<header[\s\S]*?<\/header>/m;

  const match = content.match(headerRegex);
  if (!match) {
    console.log(`Could not find header in ${file}`);
    return false;
  }

  // Get the outer div classes to replace it with containerClasses nicely
  const replacement = `<div className={containerClasses}>
      <div className="w-full animate-dropdown-reveal space-y-10 md:space-y-14 text-left">
      
      {/* Polished Header */}
      <header className={\`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\`}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-[10px] md:p-8 items-center px-[10px] md:px-6 py-12 sm:px-12 sm:py-16">
          {/* Left Side Content */}
          <div className="flex flex-col items-start gap-[10px] md:p-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-900/20">
              <Network className="w-4 h-4" />
              NETWORK ADMINISTRATION
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Simply Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 italic">Learning</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Step-by-step tutorials to build practical networking skills with confidence. Learning Outcome focuses on <span className="text-white font-bold underline decoration-blue-400">${learningObj}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-[10px] md:p-6 mt-4">
              <div className="flex items-center gap-2 text-indigo-200">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Beginner Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <Rocket className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Practical Projects</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">AI Assisted Learning</span>
              </div>
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    <Terminal className="w-3 h-3 text-blue-400" />
                    network_admin.sh
                  </div>
                </div>
                
                <div className="p-6 font-mono text-sm space-y-4 h-64 flex flex-col justify-center">
                  <div className="flex gap-2 text-gray-400">
                    <span className="text-green-500">admin@network:~$</span> 
                    <span className="text-gray-200">ping -c 4 192.168.1.1</span>
                  </div>
                  <div className="flex gap-2 text-gray-500">
                    PING 192.168.1.1: 56 data bytes<br/>
                    64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.034 ms<br/>
                    64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=0.035 ms<br/>
                  </div>
                  <div className="flex gap-2 text-gray-400 mt-2">
                    <span className="text-green-500">admin@network:~$</span> 
                    <span className="text-gray-200 animate-pulse">_</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Introduction */}
      <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 rounded-2xl mb-12 shadow-sm">
          <span className="text-indigo-500 shrink-0"><CheckCircle size={32} /></span>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-lg leading-relaxed italic">
              ${desc}
          </p>
      </div>`;

  content = content.replace(headerRegex, replacement);

  // We also need to add a closing DIV at the end before `);` 
  // since we added a wrapper `<div className="w-full animate-dropdown-reveal...` inside the containerClasses.
  // Actually, wait, the original was:
  // return ( <div className="...">
  // So we just replaced `<div className="...">` with `<div className={containerClasses}><div className="...">`.
  // Which means one extra `</div>` is needed right before `);`
  content = content.replace(/<\/div>\s*\)\s*;\s*\n?\s*\}\s*;/g, "</div>\n    </div>\n  );\n};");
  
  // ensure Network, Terminal, CheckCircle, Brain, Rocket are imported from lucide-react if not already
  
  fs.writeFileSync(file, content);
  console.log('Fixed', file);
  return true;
}

const loc = './components/courses/polytechnic/nd-it/network-administration';

updateHeader(`${loc}/LearningOutcome2.tsx`, 'purple-600', 'Configuration', 'How to configure and maintain physical network equipment.', 'Network');
updateHeader(`${loc}/LearningOutcome3.tsx`, 'amber-600', 'Monitoring & Evaluation', 'Examine network traffic, health, and evaluate performance parameters.', 'Activity');
updateHeader(`${loc}/LearningOutcome4.tsx`, 'emerald-600', 'Maintenance & Reporting', 'Network maintenance routines and creating professional status reports.', 'ShieldCheck');
