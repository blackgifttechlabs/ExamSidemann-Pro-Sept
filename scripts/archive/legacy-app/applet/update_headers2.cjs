const fs = require('fs');
const path = require('path');

const dir = path.join('/app/applet', 'src/features/courses/polytechnic/nc-it/programming-concepts');
let files = fs.readdirSync(dir).filter(f => f.startsWith('LearningOutcome') && f.endsWith('.tsx'));

const titles = {
  1: "System and User Requirements",
  2: "Flowcharts and Pseudocode",
  3: "Features of OOP",
  4: "Variable Definitions",
  5: "Data and File Structures",
  6: "Arrays and Pointers",
  7: "Object-Oriented Programming"
};

const shortTitles = {
  1: "Requirements",
  2: "Flowcharts",
  3: "OOP_Features",
  4: "Variables",
  5: "Data_Structures",
  6: "Pointers",
  7: "OOP"
};

for (const file of files) {
  const numMatches = file.match(/LearningOutcome(\d+)/);
  if (!numMatches) continue;
  const num = numMatches[1];
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Add state, useEffect imports if not present
  if (!content.includes('useState') || !content.includes('useEffect')) {
     content = content.replace(/import React(.*?);/, "import React, { useState, useEffect } from 'react';");
  }

  // Add Lucide icons
  const requiredIcons = ['CheckCircle', 'Rocket', 'Brain', 'FileCode', 'Code', 'Database', 'Cpu'];
  requiredIcons.forEach(icon => {
    if (!content.includes(icon) && !content.includes(\` \${icon},\`) && !content.includes(\`\${icon} \`)) {
      content = content.replace(/import \\{([^}]+)\\} from 'lucide-react';/, (match, p1) => {
        return \`import { \${icon}, \${p1} } from 'lucide-react';\`;
      });
    }
  });

  // Extract or Replace the header
  const headerRegex = /\\{\\/\\* Header( | section consistent with previous academic style \\*\\/)[\\s\\S]*?<\\/header>/;
  
  const title = titles[num] || \`Topic \${num}\`;
  const shortTitle = shortTitles[num] || \`Topic\`;
  
  const newHeader = \`{/* New Polished Header */}
      <header className={\\\`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\\\`}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          {/* Left Side Content */}
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-blue-900/20">
              <Code className="w-4 h-4" />
              PROGRAMMING CONCEPTS
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Simply Easy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 italic">Learning</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Step-by-step tutorials to build practical programming skills. Learning Outcome \${num} focuses on <span className="text-white font-bold underline decoration-blue-400">\${title}</span>.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4">
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
                <span className="font-semibold">AI Assisted</span>
              </div>
            </div>
          </div>

          {/* Right Side Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              {/* Code Window Container */}
              <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                {/* Window Header */}
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    <FileCode className="w-3 h-3 text-blue-400" />
                    lo\${num}_\${shortTitle.toLowerCase().replace(/\\s+/g, '_')}.cpp
                  </div>
                </div>
                
                {/* Code Body */}
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">1</span>
                    <span className="text-blue-400 font-bold">#include</span>
                    <span className="text-green-400">&lt;iostream&gt;</span>
                  </div>
                  <div className="flex gap-4 ml-6">
                    <span className="text-gray-600 select-none">2</span>
                    <span className="text-blue-400 font-bold">int</span>
                    <span className="text-white">main() \\{\`{\`\\}</span>
                  </div>
                  <div className="flex gap-4 ml-10">
                    <span className="text-gray-600 select-none">3</span>
                    <span className="text-gray-500 italic">// Learn \${title}</span>
                  </div>
                  <div className="flex gap-4 ml-6">
                    <span className="text-gray-600 select-none">4</span>
                    <span className="text-white">\\{\`}\`\\}</span>
                  </div>
                  
                  {/* Blinking Cursor */}
                  <div className="flex gap-4 ml-10 mt-4">
                    <span className="text-gray-600 select-none">5</span>
                    <div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div>
                  </div>
                </div>
              </div>

              {/* Floating Element 1 */}
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce duration-[3000ms]">
                <Cpu className="w-8 h-8 text-blue-400" />
              </div>

              {/* Floating Element 2 */}
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]">
                <Code className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </header>\`;

  content = content.replace(headerRegex, newHeader);

  // Add isDarkMode hook into the component if missing
  const componentRegex = new RegExp(\`export const LearningOutcome\${num}: React\\\\.FC = \\\\(\\\\) => \\\\{\\\\n\`);
  if (content.match(componentRegex)) {
    if (!content.includes('const [isDarkMode, setIsDarkMode] = useState')) {
        const hooksStr = \`export const LearningOutcome\${num}: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

\`;
        content = content.replace(componentRegex, hooksStr);
    }
  }

  fs.writeFileSync(fullPath, content);
  console.log('Updated', file);
}
