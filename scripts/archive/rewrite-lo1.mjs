import fs from 'fs';

const file = './components/courses/polytechnic/nd-it/network-administration/LearningOutcome1.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Remove the custom header entirely!
// The entire header from <div className="w-full ..."> to </header>
// Actually, let's just find the first {currentPage === 1 && ( and replace everything before it with the standard <SectionPager>.
// Wait, the new start of the component should be exactly like LO2.

const standardStart = `export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const containerClasses = isDarkMode ? 'w-full py-8 text-white bg-[#1e1e1e]' : 'w-full py-8 text-gray-900 bg-[#fcfdfc]';

  return (
<div className={containerClasses}>
      <div className="w-full animate-dropdown-reveal space-y-10 md:space-y-14 text-left p-4 md:p-8">
      
      {/* Polished Header */}
      <header className={\`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl \${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}\`}>
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 px-6 py-12 md:py-20 md:px-12 flex flex-col items-center text-center">
                   
          {/* Main Title Area */}
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-white tracking-tight leading-tight mb-6 animate-fade-in-up">
            Network <span className="text-indigo-300">Site Survey</span>
          </h1>

          {/* Subtitle / Objective */}
          <p className="text-lg md:text-2xl text-indigo-100/90 max-w-3xl font-medium leading-relaxed mb-10 animate-fade-in-up delay-150">
             Introduction to site surveys and the systematic process of gathering information before physical deployment.
          </p>

          <div className="h-1 w-24 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur-sm opacity-80 animate-fade-in-up delay-200"></div>
        </div>
      </header>

      <SectionPager>
`;

const matchStart = txt.match(/export const LearningOutcome1: React\.FC = \(\) => \{[\s\S]*?\{currentPage === 1 && \(\s*<div className="space-y-10 animate-fade-in-up">/);
if (matchStart) {
   txt = txt.replace(matchStart[0], standardStart);
}

// Now replace all other `{currentPage === X && ( <div className="space-y-10 animate-fade-in-up">` with nothing
txt = txt.replace(/\{currentPage === \d+ && \(\s*<div className="space-y-10 animate-fade-in-up">/g, '');

// Replace all closing `</div>\n      )}` corresponding to those pages with nothing
// since we removed the `{currentPage === X && (`
txt = txt.replace(/<\/div>\s*\)\}/g, '');

// Remove the manual <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">...</div>
const navMatch = txt.match(/\{\/\* Navigation Buttons \*\/\}(.|\n)*?<\/div>\s*<\/div>\s*\);\s*\};\s*$/);
if (navMatch) {
    txt = txt.replace(navMatch[0], `</SectionPager>\n      </div>\n    </div>\n  );\n};\n`);
} else {
    // try finding just the end
    const idx = txt.lastIndexOf('{/* Navigation Buttons */}');
    if (idx !== -1) {
        txt = txt.substring(0, idx) + `</SectionPager>\n      </div>\n    </div>\n  );\n};\n`;
    }
}

fs.writeFileSync(file, txt);
