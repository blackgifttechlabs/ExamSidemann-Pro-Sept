const fs = require('fs');
const path = require('path');

const dir = 'src/features/courses/polytechnic/records-nd/preservation-management';

const generateLO = (num, title, subtitle, concepts, themeColor) => {
  return \`import React from 'react';
import {
  FolderTree, Target, Shield, ListChecks, Type, BookOpen, Focus, Minimize, FileText,
  CheckCircle, Database, Server, HardDrive, Archive, AlertCircle, Sun, Cloud, Zap, Droplet, Thermometer,
  ShieldCheck, RefreshCw, Layers
} from 'lucide-react';

export const LearningOutcome\${num} = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const containerClasses = isDarkMode
    ? 'w-full py-6 sm:py-12 md:py-16 px-[5px] sm:px-[30px] bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 min-h-screen relative'
    : 'w-full py-6 sm:py-12 md:py-16 px-[5px] sm:px-[30px] bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen relative';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 pb-3 border-b-4 border-\${themeColor}-500 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 pb-3 border-b-4 border-\${themeColor}-600 inline-block relative group uppercase mt-12';

  const cardClasses = (borderColor) => {
    return \\\`\${isDarkMode ? 'bg-[#252526]' : 'bg-white'} rounded-[5px] shadow-lg p-6 mb-6 transform transition-all duration-300 hover:shadow-xl border-l-8 \${borderColor}\\\`;
  };

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className={\\\`relative w-full mb-12 rounded-[5px] overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\\\`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-\${themeColor}-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-\${themeColor}-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Records & Information Management: Module LO\${num}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: \`\${title}\` }}>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              \${subtitle}
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">preservation_lo\${num}.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">INIT</span><span className="text-white">Module;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">LOAD</span><span className="text-white">Concepts;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">3</span><div className="w-2 h-5 bg-\${themeColor}-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== MAIN CONTENT ========== */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 border-l-8 border-\${themeColor}-600 dark:border-\${themeColor}-500 text-\${themeColor}-600 dark:text-\${themeColor}-400 pl-6">
            <h2 className={sectionHeaderClasses}>Core Principles</h2>
          </div>
          
          <div className={cardClasses('border-\${themeColor}-500')}>
            <h3 className="text-xl font-bold mb-2 flex flex-row items-center gap-2"><ListChecks size={20} /> Advanced Applications</h3>
            <ul className="list-disc pl-5 space-y-2">
              \${concepts.map(c => \`<li><strong>\${c.title}:</strong> \${c.desc}</li>\`).join('\\n              ')}
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t-4 border-\${themeColor}-600 dark:border-\${themeColor}-500 text-\${themeColor}-600 dark:text-\${themeColor}-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome \${num}</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">PRESERVE. CONSERVE. RESTORE. 📜</p>
        </footer>

      </div>
    </div>
  );
};
\`
}

const lo2 = generateLO(
  2,
  'Environmental Control <span className=\\\\"text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 italic\\\\">& Storage Guidelines</span>',
  'Mastering optimal temperature, humidity, lighting, and air quality configurations to prolong archival materials.',
  [
    { title: 'HVAC Strategies', desc: 'Implementing highly regulated heating, ventilation, and air conditioning for stable records environments.' },
    { title: 'Pest Management', desc: 'Non-toxic approaches and integrated pest management (IPM) structures to deter biological decay.' },
    { title: 'Lux & UV Thresholds', desc: 'Understanding lighting limits to prevent photo-oxidation fading in paper and textiles.' },
    { title: 'Storage Enclosures', desc: 'Selecting acid-free bounding, specialized shelving, and isolating acidic materials.' }
  ],
  'emerald'
);

const lo3 = generateLO(
  3,
  'Disaster Preparedness <span className=\\\\"text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-orange-300 italic\\\\">& Recovery Planning</span>',
  'Developing proactive emergency strategies and crisis mitigation techniques for records facilities.',
  [
    { title: 'Risk Assessment', desc: 'Identifying local structural, environmental, and geological threats to records installations.' },
    { title: 'Emergency Response Frameworks', desc: 'Establishing action protocols, communication trees, and offsite supply lists.' },
    { title: 'Salvage Operations', desc: 'Methods for freezing waterlogged paper, halting mold outbreaks, and vacuum drying.' },
    { title: 'Continuity of Operations', desc: 'Maintaining vital business access while the primary facility undergoes severe restorations.' }
  ],
  'red'
);

const lo4 = generateLO(
  4,
  'Digital Preservation <span className=\\\\"text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 italic\\\\">& Format Migration</span>',
  'Securing digital assets against bit-rot, hardware obsolescence, and format degradation over decades.',
  [
    { title: 'Bit-Level Preservation', desc: 'Checksum validations, parity checks, and redundancy models (LOCKSS).' },
    { title: 'Format Migration', desc: 'Transferring data streams to newer formats before the older software environments become inaccessible.' },
    { title: 'Emulation', desc: 'Recreating legacy hardware environments using modern hypervisors to view archaic file structures.' },
    { title: 'Trusted Digital Repositories', desc: 'Adhering to ISO 16363 standards for sustainable long-term digital retention.' }
  ],
  'blue'
);

const lo5 = generateLO(
  5,
  'Preservation Policies <span className=\\\\"text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 italic\\\\">& Ethical Considerations</span>',
  'The governance, legal structures, and moral imperatives guiding long-term archiving and asset culling.',
  [
    { title: 'Retention Scheduling', desc: 'Aligning preservation efforts with legal holding periods and historical significance weights.' },
    { title: 'Ethical Treatments', desc: 'The Principle of Reversibility and balancing artifact integrity with usability demands.' },
    { title: 'Policy Codification', desc: 'Drafting enforceable directives on handling protocols, budget allocations, and auditing.' },
    { title: 'Cultural Sensitivities', desc: 'Managing Indigenous knowledge frameworks, repatriation, and restricted ceremonial documentation.' }
  ],
  'purple'
);

fs.writeFileSync(path.join(dir, 'LearningOutcome2.tsx'), lo2);
fs.writeFileSync(path.join(dir, 'LearningOutcome3.tsx'), lo3);
fs.writeFileSync(path.join(dir, 'LearningOutcome4.tsx'), lo4);
fs.writeFileSync(path.join(dir, 'LearningOutcome5.tsx'), lo5);
