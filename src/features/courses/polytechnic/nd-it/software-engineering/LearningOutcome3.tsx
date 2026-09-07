import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Code,
  Shield,
  Users,
  Target,
  ClipboardList,
  Calendar,
  DollarSign,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Monitor,
  Cpu,
  Layers,
  FileText,
  CheckCircle,
  TrendingUp,
  GitBranch,
  Terminal,
  Database,
  Table,
  Box,
  Layout,
  Eye,
  Link2,
  Zap,
  Globe,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'dotnet', label: '.NET Framework' },
  { id: 'modularity', label: 'Modularity' },
  { id: 'ide', label: 'Choosing IDE' },
  { id: 'compiling', label: 'Compiling' },
  { id: 'testing', label: 'Testing' },
  { id: 'integration-needs', label: 'Integration Needs' },
  { id: 'integration-challenges', label: 'Challenges' },
  { id: 'integration-testing', label: 'Integration Testing' },
  { id: 'integration-types', label: 'Integration Types' },
  { id: 'data-formats', label: 'Data Formats' },
  { id: 'practice-questions', label: 'Practice Qs' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The .NET Framework was released by Microsoft in 2002. It was designed to allow developers to write code in multiple languages that could all run on the same platform.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing an IDE, prioritise the features you use most. Visual Studio Code is lightweight and extensible, while Visual Studio offers comprehensive .NET integration.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 testing levels as UISA: Unit, Integration, System, Acceptance. Each level tests a larger scope than the previous one.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse data formats. XML is verbose and hierarchical; JSON is compact and key-value; CSV is flat and simple. Choose based on your use case.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The .NET Framework was released by Microsoft in 2002. It was designed to allow developers to write code in multiple languages that could all run on the same platform.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing an IDE, prioritise the features you use most. Visual Studio Code is lightweight and extensible, while Visual Studio offers comprehensive .NET integration.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 4 testing levels as UISA: Unit, Integration, System, Acceptance. Each level tests a larger scope than the previous one.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse data formats. XML is verbose and hierarchical; JSON is compact and key-value; CSV is flat and simple. Choose based on your use case.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Helper for table rows
  const rowBg = (index: number) => {
    const even = index % 2 === 0;
    return isDarkMode 
      ? (even ? 'bg-gray-800' : 'bg-gray-750') 
      : (even ? 'bg-white' : 'bg-gray-50');
  };
  const theadBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> SOFTWARE ENGINEERING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Tools, Testing &amp; Integration
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master the .NET Framework, modularity, IDEs, compilation, software testing, integration strategies, and data formats.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Box size={14} className="inline mr-1" /> .NET Framework
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CheckCircle size={14} className="inline mr-1" /> Testing
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Link2 size={14} className="inline mr-1" /> Integration
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, .NET, testing, integration..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Section 1: .NET Framework */}
            <div
              ref={(el) => {
                sectionRefs.current['dotnet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The .NET Framework
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The .NET Framework is a software development platform by Microsoft that provides tools, libraries, and services for building applications across web, desktop, mobile, and more.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">5 Key Components</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-red-600 dark:text-red-400">CLR</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Common Language Runtime – heart of .NET, manages execution</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-green-600 dark:text-green-400">FCL</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Framework Class Library – pre‑written reusable code</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-blue-600 dark:text-blue-400">CTS</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Common Type System – standardises data types across languages</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                    <span className="font-bold text-amber-600 dark:text-amber-400">CLS</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Common Language Specification – minimum language standard</p>
                  </div>
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm sm:col-span-2">
                    <span className="font-bold text-teal-600 dark:text-teal-400">ASP.NET</span>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Web application framework built on .NET</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300"><span className="font-bold">7 Reasons</span> .NET is important: Cross‑Language Development, Rich Class Library, Improved Security, Simplified Deployment, Large Community, Maturity &amp; Stability, Integration with Microsoft Technologies.</p>
                </div>
              </div>
            </div>

            {/* Section 2: Benefits of Modularity */}
            <div
              ref={(el) => {
                sectionRefs.current['modularity'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Benefits of Modularity
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modularity divides a program into smaller, independent, focused modules. Key benefits:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'Improved Maintainability',
                    'Enhanced Reusability',
                    'Better Code Organisation',
                    'Easier Testing',
                    'Promotes Teamwork',
                    'Reduced Complexity',
                    'Improved Scalability',
                    'Error Localisation',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Choosing an IDE */}
            <div
              ref={(el) => {
                sectionRefs.current['ide'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Choosing an IDE
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  An IDE provides everything needed to write, test, and debug code. Popular IDEs: Visual Studio, VS Code, Eclipse, IntelliJ, PyCharm.
                </p>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">8 Factors to Consider</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Supported Languages',
                    'Features',
                    'Cost',
                    'Learning Curve',
                    'Customisation',
                    'Community & Support',
                    'Platform Compatibility',
                    'Target Platform',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Compiling and Running */}
            <div
              ref={(el) => {
                sectionRefs.current['compiling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Compiling and Running a Program
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Source code → Compiler → Machine Code → Executable → Run.
                </p>
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Feature</th>
                        <th className="border p-2 text-left font-bold">Compiler</th>
                        <th className="border p-2 text-left font-bold">Interpreter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Translation', 'Before execution (whole program)', 'During execution (line by line)'],
                        ['Output', 'Executable file', 'No separate file'],
                        ['Speed', 'Faster execution', 'Slower execution'],
                        ['Errors', 'All reported before running', 'Found when line reached'],
                        ['Examples', 'C, C++, C#, Go', 'Python, JavaScript, Ruby'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 5: Software Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Systematic evaluation to find errors, verify requirements, improve quality, and prevent user issues.
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">4 Objectives</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {['Identify Bugs', 'Verify Requirements', 'Improve Quality', 'Prevent User Issues'].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</div>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">4 Levels of Testing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs"><span className="font-bold">Unit</span> – individual functions</div>
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs"><span className="font-bold">Integration</span> – module interactions</div>
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs"><span className="font-bold">System</span> – complete system</div>
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs"><span className="font-bold">Acceptance</span> – user validation</div>
                </div>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">2 Types: Manual vs Automated</h4>
              </div>
            </div>

            {/* Section 6: Needs for Module Integration */}
            <div
              ref={(el) => {
                sectionRefs.current['integration-needs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Needs for Module Integration
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  After individual modules are built and tested, they must be integrated into a complete system.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    'Functionality Completion',
                    'Data Exchange',
                    'Error Handling Consistency',
                    'Performance Optimisation',
                    'Scalability',
                    'Maintainability',
                    'Reusability',
                    'Testing Efficiency',
                  ].map(item => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 7: Integration Challenges and Solutions */}
            <div
              ref={(el) => {
                sectionRefs.current['integration-challenges'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Integration Challenges and Solutions
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="space-y-3">
                  {[
                    { challenge: 'Interface Incompatibility', solution: 'Define standardised interface contracts before development' },
                    { challenge: 'Dependency Issues', solution: 'Create a clear integration plan with dependency hierarchy' },
                    { challenge: 'Unexpected Errors', solution: 'Implement robust error handling at all integration points' },
                    { challenge: 'Performance Bottlenecks', solution: 'Optimise protocols, use caching, profile bottlenecks' },
                    { challenge: 'Versioning Conflicts', solution: 'Use semantic versioning, maintain compatibility matrices' },
                    { challenge: 'Testing Complexity', solution: 'Develop a comprehensive integration testing strategy' },
                    { challenge: 'Documentation Gaps', solution: 'Require complete documentation before integration' },
                  ].map(({ challenge, solution }, idx) => (
                    <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">{challenge}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">✓ {solution}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 8: Integration Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['integration-testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Integration Testing
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tests interactions between modules. Catches interface mismatches, data passing errors, and timing problems.
                </p>
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Type</th>
                        <th className="border p-2 text-left font-bold">Direction</th>
                        <th className="border p-2 text-left font-bold">Replaces with</th>
                        <th className="border p-2 text-left font-bold">Best for</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Top‑Down', 'High → Low', 'Stubs', 'Testing architecture early'],
                        ['Bottom‑Up', 'Low → High', 'Drivers', 'Building reliable foundations'],
                        ['Big Bang', 'All at once', 'Nothing', 'Small, simple systems'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                          <td className="border p-2">{item[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300"><span className="font-bold">3 Benefits:</span> Identifies inter‑module issues, verifies system functionality, improves system reliability.</p>
                </div>
              </div>
            </div>

            {/* Section 9: Types of Software Integration */}
            <div
              ref={(el) => {
                sectionRefs.current['integration-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Software Integration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Star (Hub‑and‑Spoke)</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Central hub, all modules communicate through it. Simple but single point of failure.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Horizontal (Bus/ESB)</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Shared message bus. Publish/subscribe. Scalable, loosely coupled, more complex.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Vertical</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Integrates applications within a specific business domain. Streamlines processes but can cause vendor lock‑in.</p>
                </div>
              </div>
            </div>

            {/* Section 10: Data Formats */}
            <div
              ref={(el) => {
                sectionRefs.current['data-formats'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Formats for Integration
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Common formats for data exchange between modules:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { name: 'XML', desc: 'Verbose, tag‑based, hierarchical, self‑describing' },
                    { name: 'JSON', desc: 'Lightweight, key‑value, web APIs, human‑readable' },
                    { name: 'CSV', desc: 'Simple, flat, compatible with spreadsheets' },
                    { name: 'EDI', desc: 'Structured business documents, machine‑to‑machine' },
                    { name: 'Protobuf', desc: 'Binary, compact, high‑performance, Google' },
                  ].map(({ name, desc }) => (
                    <div key={name} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                      <span className="font-bold">{name}</span> – {desc}
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full text-sm border-collapse">
                    <thead className={theadBg}>
                      <tr>
                        <th className="border p-2 text-left font-bold">Format</th>
                        <th className="border p-2 text-left font-bold">Type</th>
                        <th className="border p-2 text-left font-bold">Size</th>
                        <th className="border p-2 text-left font-bold">Best Used For</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['XML', 'Text', 'Large', 'Enterprise systems'],
                        ['JSON', 'Text', 'Medium', 'Web APIs'],
                        ['CSV', 'Text', 'Small', 'Tabular data'],
                        ['EDI', 'Text', 'Medium', 'Business docs'],
                        ['Protobuf', 'Binary', 'Very small', 'High‑performance'],
                      ].map((item, idx) => (
                        <tr key={item[0]} className={rowBg(idx)}>
                          <td className="border p-2 font-bold">{item[0]}</td>
                          <td className="border p-2">{item[1]}</td>
                          <td className="border p-2">{item[2]}</td>
                          <td className="border p-2">{item[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 11: Practice Questions */}
            <div
              ref={(el) => {
                sectionRefs.current['practice-questions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practice Questions
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Q1. Describe FOUR components of the .NET Framework.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">CLR (runtime), FCL (class library), CTS (type system), ASP.NET (web framework).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Q2. List and explain FOUR benefits of modularity.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Maintainability, reusability, easier testing, promotes teamwork.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Q3. Describe the 4 levels of software testing.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Unit → Integration → System → Acceptance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Q4. Compare XML, JSON, and CSV data formats.</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">XML=verbosem hierarchical; JSON=compact, key‑value; CSV=flat, simple.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Tooling Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>.NET Components</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Testing Levels</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Software engineering is about tools, processes, and quality. Master the .NET Framework, choose the right IDE, understand compilation vs interpretation, implement thorough testing at all levels, and know how to integrate modules effectively. These practical skills are what employers value most.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">.NET Framework</strong> – CLR, FCL, CTS, CLS, and ASP.NET form the foundation for building cross‑language, cross‑platform applications.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Modularity</strong> – improves maintainability, reusability, testability, and team collaboration; high cohesion and low coupling are key.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing</strong> – 4 levels: Unit, Integration, System, Acceptance. Manual and automated testing each have their place.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Integration</strong> – Top‑Down, Bottom‑Up, and Big Bang approaches. Star, Bus, and Vertical architectures each solve different integration needs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Data Formats</strong> – XML (verbose, hierarchical), JSON (compact, web APIs), CSV (flat, simple), EDI (business docs), Protobuf (binary, high‑performance).
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Software Engineering – Tools &amp; Testing 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;