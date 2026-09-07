import React, { useState, useEffect, useRef } from 'react';
import { HighlightedCode } from './CodeHighlighter';
import { useLessonState } from '../../../lessonProgress';
import {
  ShieldCheck,
  BookOpen,
  Terminal,
  Code2,
  Layers,
  Cpu,
  Search,
  ClipboardList,
  Info,
  ArrowRight,
  Download,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
  Binary,
  Calculator,
  Zap,
  Database,
  FileText,
  Layout,
  ListChecks,
  Smartphone,
  Globe,
  Box,
  GitBranch,
  CheckCircle,
  Rocket,
  Brain,
  FileCode,
  Code,
  ChevronUp,
  X,
  Sparkles,
  BookMarked,
  Target,
  Users,
  Scale,
  AlertTriangle as AlertTriangleIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// VS Code Typing Animation Component (kept as is)
// ──────────────────────────────────────────────────────────────────────────────
const VSCodeTyping: React.FC<{ code: string; fileName: string }> = ({ code, fileName }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsTyping(true);
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(code.slice(0, i));
      i++;
      if (i > code.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [isTyping, code]);

  return (
    <div ref={containerRef} className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-2xl font-mono text-xs md:text-sm my-8">
      <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          <Terminal size={12} /> {fileName} — Visual Studio Code
        </span>
      </div>
      <div className="p-4 md:p-6 flex gap-4 min-h-[150px]">
        <div className="text-gray-500 text-right select-none border-r border-[#333] pr-4 leading-relaxed opacity-50">
          {code.split('\n').map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>
        <div className="flex-1 text-gray-300 whitespace-pre-wrap leading-relaxed relative">
          <HighlightedCode code={displayedCode} />
          <span className="w-2 h-4 bg-blue-500 absolute inline-block ml-0.5 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'program-structure', label: 'Program Structure' },
  { id: 'fundamentals', label: 'Fundamental Concepts' },
  { id: 'errors', label: 'Programming Errors' },
  { id: 'identifiers', label: 'Identifiers' },
  { id: 'data-types', label: 'Data Types' },
  { id: 'operators', label: 'Operators' },
  { id: 'functions', label: 'Functions' },
  { id: 'control-structures', label: 'Control Structures' },
  { id: 'data-structures', label: 'Data Structures' },
  { id: 'files', label: 'Files' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'C++ variables must be declared before use – specify a data type and a unique name.',
      },
      {
        title: 'Pro Tip',
        text: 'Use meaningful variable names that describe the purpose of the data, e.g., "studentCount" instead of "x".',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "IPO" – Input, Process, Output – the fundamental flow of any program.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "=" (assignment) with "==" (equality comparison). One sets a value, the other checks equality.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'C++ variables must be declared before use – specify a data type and a unique name.',
      },
      {
        title: 'Pro Tip',
        text: 'Use meaningful variable names that describe the purpose of the data, e.g., "studentCount" instead of "x".',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "IPO" – Input, Process, Output – the fundamental flow of any program.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse "=" (assignment) with "==" (equality comparison). One sets a value, the other checks equality.',
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
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200 dark:shadow-cyan-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Variable Definitions
            </span>
          </h1>
          <p className="text-lg text-cyan-100 max-w-2xl leading-relaxed">
            Master C++ program structure, data types, operators, functions,
            control structures, and file I/O – build a solid foundation for
            writing clean, efficient code.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-cyan-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Binary size={14} className="inline mr-1" /> Data Types
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> C++
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-cyan-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, operator, or function..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-cyan-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-cyan-200" />
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
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to Variable Definitions
              </h2>

              <div className="p-4 sm:p-5 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In C++, variables are named storage locations that hold data.
                    This learning outcome covers the complete structure of a C++
                    program, fundamental programming concepts, data types,
                    operators, functions, control structures, and file handling.
                  </p>
</div>
            </div>

            {/* Program Structure */}
            <div
              ref={(el) => {
                sectionRefs.current['program-structure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                C++ Program Structure
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A well-structured C++ program is organized into logical components
                that enhance readability, maintainability, and modularity.
              </p>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Preprocessor Directives (# lines)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Start with <code className="bg-slate-100 dark:bg-slate-800 px-1">#</code> symbol – instructions to the preprocessor.</li>
                    <li><code className="bg-slate-100 dark:bg-slate-800 px-1">#include</code> – includes header files.</li>
                    <li><code className="bg-slate-100 dark:bg-slate-800 px-1">#define</code> – defines macros (named constants).</li>
                    <li><code className="bg-slate-100 dark:bg-slate-800 px-1">#ifdef / #ifndef / #endif</code> – conditional compilation.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Global Declarations</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Variables and functions declared outside any function body – accessible anywhere. Use sparingly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Functions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Building blocks of C++ programs – encapsulate specific tasks. <code>main()</code> is the entry point.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Local Declarations</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Variables declared within a function or block – only accessible inside that scope.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Valid C++ Statements</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Instructions ending with a semicolon (;). E.g., assignments, conditionals, loops.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Comments</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Single-line (<code>//</code>) or multi-line (<code>/* ... */</code>) – ignored by compiler, used for documentation.</p>
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="main.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int number;
  cout << "Enter a number: ";
  cin >> number;
  cout << "You entered: " << number << endl;
  return 0;
}`} />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Info size={14} /> Key Points
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Use meaningful variable/function names.</li>
                  <li>Follow consistent indentation.</li>
                  <li>Break down complex tasks into functions.</li>
                  <li>Add comments to explain non-obvious code.</li>
                  <li>Balance global vs. local declarations.</li>
                </ul>
              </div>
            </div>

            {/* Fundamental Concepts */}
            <div
              ref={(el) => {
                sectionRefs.current['fundamentals'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Fundamental Programming Concepts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Data Types</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Building blocks – integers, floating-point, characters, booleans, strings, arrays, structures/objects.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Variables</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Named storage locations – declared with type and name. Rules: start with letter/underscore, case-sensitive, no keywords.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Operators</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Symbols that perform operations (arithmetic, comparison, logical, assignment).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Expressions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Combinations of variables, operators, constants, and function calls that evaluate to a value.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Control Flow</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Determines execution order – conditional statements (if, else if, else), loops (for, while, do-while), switch.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Functions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reusable blocks of code – take arguments, return values, promote modularity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Comments</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Single-line or multi-line – for human explanation, ignored by compiler.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Input / Output</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>cin / cout</code> in C++, <code>input / print</code> in Python, <code>scanf / printf</code> in C.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Memory Management</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Allocating and deallocating memory – manual (C/C++) vs. automatic (Python/Java).</p>
                </div>
              </div>
            </div>

            {/* Programming Errors */}
            <div
              ref={(el) => {
                sectionRefs.current['errors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Programming Errors
              </h2>

              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Syntax Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Violate grammatical rules – missing semicolons, mismatched parentheses, typos. Compiler identifies them.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Runtime Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Occur during execution – division by zero, out-of-bounds array access, null pointer dereference. Program may crash.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Logical Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Flaws in program logic – wrong output or unexpected behavior. Hardest to detect.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Linker Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Occur during linking – missing libraries or mismatched function declarations.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Semantic Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Violate language conventions but not caught by compiler – e.g., assigning incompatible types.</p>
                </div>
              </div>
            </div>

            {/* Identifiers */}
            <div
              ref={(el) => {
                sectionRefs.current['identifiers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifiers
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An identifier is a name given to program elements – variables, functions, constants, classes, etc. It uniquely identifies that element.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Types of Identifiers</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Predefined:</span> defined by the language (keywords like <code>int</code>, <code>float</code>, <code>if</code>, or library functions).</li>
                    <li><span className="font-bold">User-Defined:</span> created by the programmer for variables, functions, etc.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Naming Rules</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>First character: letter or underscore</li>
                    <li>Subsequent: letters, numbers, underscores</li>
                    <li>Case-sensitive (<code>age</code> vs <code>Age</code>)</li>
                    <li>Cannot use reserved keywords</li>
                    <li>Choose meaningful names</li>
                    <li>Avoid generic names like <code>x</code>, <code>y</code> in large scopes</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-900 text-white rounded-xl mt-4">
                <h4 className="text-xs font-bold text-purple-400">Variable vs Constant</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div><span className="font-bold text-cyan-400">Variable Identifiers:</span> can change value during execution (e.g., <code>total</code>, <code>average</code>).</div>
                  <div><span className="font-bold text-amber-400">Constant Identifiers:</span> hold fixed values, declared with <code>const</code> (e.g., <code>PI</code>, <code>MAX_VALUE</code>).</div>
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="identifier_example.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int age;
  double accountBalance;
  const double PI = 3.14159;
  cout << "Enter your age: ";
  cin >> age;
  cout << "You are " << age << " years old." << endl;
  return 0;
}`} />
              </div>
            </div>

            {/* Data Types */}
            <div
              ref={(el) => {
                sectionRefs.current['data-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Types
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Define the kind of values a variable can hold and the operations that can be performed on them.
              </p>

              <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tight mt-6">
                Standard Data Types
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Integers</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>int</code>, <code>short</code>, <code>long</code>, <code>long long</code> – whole numbers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Floating-Point</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>float</code>, <code>double</code> – numbers with decimals.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Character &amp; Bool</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>char</code> – single character (1 byte). <code>bool</code> – true/false.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tight mt-6">
                User-Defined Data Types
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Arrays</span> – collections of same type, accessed by index (e.g., <code>int numbers[10];</code>).</li>
                <li><span className="font-bold">Structures</span> – groups of variables of different types under one name.</li>
                <li><span className="font-bold">Classes</span> – like structures, with encapsulation (data hiding) and member functions.</li>
              </ul>
            </div>

            {/* Operators */}
            <div
              ref={(el) => {
                sectionRefs.current['operators'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Operators
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Operators are symbols that perform specific operations on data (operands) in C++ expressions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Arithmetic</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code></p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Assignment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>=</code>, <code>+=</code>, <code>-=</code>, etc.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Relational</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code></p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Logical</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>&&</code>, <code>||</code>, <code>!</code></p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Ternary</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>condition ? expr_if_true : expr_if_false</code></p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Comma</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Evaluates multiple expressions, returns the rightmost value.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Dot / Member</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accesses members of objects/structures (<code>.</code>).</p>
                </div>
              </div>
            </div>

            {/* Functions */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Functions
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A function is a reusable block of code that performs a specific task.
              </p>

              <div className="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Benefits</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>Code Reusability</span>
                  <span>Modularity</span>
                  <span>Readability</span>
                  <span>Reduced Errors</span>
                  <span>Organization</span>
                  <span>Information Hiding</span>
                  <span>Easier Debugging</span>
                  <span>Testability</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Predefined Functions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Standard library functions like <code>cout</code>, <code>cin</code>, <code>sqrt</code>, <code>strlen</code>.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">User-Defined Functions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Created by the programmer to perform a specific task.
                  </p>
                  <code className="mt-2 block rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 overflow-x-auto">
                    {'return_type function_name(parameter_list) { statements }'}
                  </code>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Example: <code>{'double calculateArea(double length, double width)'}</code>
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="calculate_area.cpp" code={`#include <iostream>
using namespace std;

double calculateArea(double length, double width) {
  return length * width;
}

int main() {
  double rectLength = 5.0;
  double rectWidth = 3.0;
  double area = calculateArea(rectLength, rectWidth);
  cout << "Area of the rectangle: " << area << endl;
  return 0;
}`} />
              </div>

              <div className="space-y-6 mt-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Void vs. Value-Returning Functions</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs mt-2">
                      <thead><tr className="bg-slate-50 dark:bg-slate-800/30"><th className="p-2 font-bold">Feature</th><th className="p-2 font-bold">Void</th><th className="p-2 font-bold">Value-Returning</th></tr></thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr><td className="p-2 font-bold">Return Type</td><td className="p-2"><code>void</code></td><td className="p-2">Any data type</td></tr>
                        <tr><td className="p-2 font-bold">Returns a Value</td><td className="p-2">No</td><td className="p-2">Yes</td></tr>
                        <tr><td className="p-2 font-bold">Typical Use</td><td className="p-2">Actions (printing)</td><td className="p-2">Calculations</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Parameter Passing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">C++ uses <span className="font-bold">pass-by-value</span> – a copy of the argument is passed (original unchanged).</p>
                  <VSCodeTyping fileName="parameter_passing.cpp" code={`void modifyValue(int num) {
  num = 10;
}
int main() {
  int x = 5;
  modifyValue(x);
  cout << x << endl; // Output: 5
}`} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use <span className="font-bold">references</span> to modify the original variable.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Variable Scope</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Global</span> – accessible anywhere.</li>
                    <li><span className="font-bold">Function</span> – inside a function.</li>
                    <li><span className="font-bold">Block</span> – inside <code>{ }</code>.</li>
                  </ul>
                  <VSCodeTyping fileName="scope_example.cpp" code={`int globalVar = 10;
void outerFunction() {
  int localVar = 20;
  if (true) {
    int blockVar = 30;
    cout << blockVar << endl; // OK
  }
  // cout << blockVar << endl; // Error
  cout << localVar << endl; // OK
  cout << globalVar << endl; // OK
}`} />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Function Prototype vs. Definition</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs mt-2">
                      <thead><tr className="bg-slate-50 dark:bg-slate-800/30"><th className="p-2 font-bold">Feature</th><th className="p-2 font-bold">Prototype</th><th className="p-2 font-bold">Definition</th></tr></thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr><td className="p-2 font-bold">Purpose</td><td className="p-2">Declaration</td><td className="p-2">Implementation</td></tr>
                        <tr><td className="p-2 font-bold">Location</td><td className="p-2">Before first call</td><td className="p-2">After all other code</td></tr>
                        <tr><td className="p-2 font-bold">Body</td><td className="p-2">No body</td><td className="p-2">Has body <code>{ }</code></td></tr>
                        <tr><td className="p-2 font-bold">Semicolon</td><td className="p-2">Yes</td><td className="p-2">No</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Function Overloading</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Multiple functions with the same name but different parameters.</p>
                  <VSCodeTyping fileName="overloading.cpp" code={`double calculateArea(double length, double width) {
  return length * width;
}
double calculateArea(double side) {
  return side * side;
}
int main() {
  cout << calculateArea(5.0, 3.0) << endl;
  cout << calculateArea(4.0) << endl;
}`} />
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">Cannot overload based on return type alone.</p>
                </div>
              </div>
            </div>

            {/* Control Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['control-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                C++ Control Structures
              </h2>

              <div className="space-y-6 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Sequence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Statements executed in order.</p>
                  <VSCodeTyping fileName="sequence.cpp" code={`#include <iostream>
using namespace std;
int main() {
  int num1, num2, sum;
  cin >> num1 >> num2;
  sum = num1 + num2;
  cout << "Sum: " << sum << endl;
  return 0;
}`} />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Selection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>if</code>, <code>if-else</code>, <code>else if</code>, <code>switch</code> – choose between alternatives.</p>
                  <VSCodeTyping fileName="selection.cpp" code={`#include <iostream>
using namespace std;
int main() {
  int age;
  cin >> age;
  if (age >= 18) cout << "Eligible to vote." << endl;
  else cout << "Not eligible." << endl;
  return 0;
}`} />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Iteration (Looping)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><code>for</code>, <code>while</code>, <code>do-while</code> – repeat code.</p>
                  <VSCodeTyping fileName="iteration.cpp" code={`#include <iostream>
using namespace std;
int main() {
  int n;
  cin >> n;
  for (int i = 1; i <= n; i++) {
    cout << "Student " << i << endl;
  }
  return 0;
}`} />
                </div>
              </div>
            </div>

            {/* Data Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['data-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Structures
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Definition</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">A specialized format for organizing, processing, retrieving, and storing data efficiently.</p>
              </div>

              <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tight mt-6">
                Arrays
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Store a collection of elements of the same data type under a single name.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-900 text-white rounded-lg font-mono text-xs">
                  <p className="text-gray-400">// 1D Array</p>
                  <p>int numbers[10];</p>
                  <p className="text-gray-400 mt-2">// 2D Array</p>
                  <p>int matrix[3][2];</p>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Accessing Elements</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Index starts at 0.</p>
                  <code className="text-sm text-blue-600 dark:text-blue-400">numbers[2] = 100;</code>
                </div>
              </div>
              <VSCodeTyping fileName="averages.cpp" code={`#include <iostream>
using namespace std;
int main() {
  int scores[5], sum=0;
  for (int i=0; i<5; i++) { cin >> scores[i]; sum += scores[i]; }
  cout << "Average: " << (double)sum/5 << endl;
  return 0;
}`} />

              <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tight mt-6">
                Structures (Structs)
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                User-defined data type that groups variables of different types under one name.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Organization</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Integrity</span>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Efficiency</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tight mt-6">
                Classes
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Blueprint for real-world entities – encapsulates data and behavior.
              </p>
              <VSCodeTyping fileName="bank_account.cpp" code={`#include <iostream>
using namespace std;
class BankAccount {
private:
  string name;
  double balance;
public:
  BankAccount(string n, double b=0) : name(n), balance(b) {}
  void deposit(double a) { balance += a; }
  bool withdraw(double a) {
    if (balance >= a) { balance -= a; return true; }
    return false;
  }
  double getBalance() const { return balance; }
};
int main() {
  BankAccount account("John Doe");
  account.deposit(100);
  if (account.withdraw(50)) cout << "New balance: $" << account.getBalance() << endl;
  return 0;
}`} />
            </div>

            {/* Files */}
            <div
              ref={(el) => {
                sectionRefs.current['files'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Files
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                File streams allow programs to interact with external storage – reading from and writing to files.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Text Files</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Human-readable ASCII characters. Used for settings, logs, source code.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Binary Files</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Raw binary data – not human-readable. Used for images, audio, compiled code.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-tight mt-6">
                File Stream Operations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">ifstream</span><br />Read from file
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">ofstream</span><br />Write to file
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">fstream</span><br />Both read &amp; write
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">ios</span><br />Base class
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="file_io.cpp" code={`#include <iostream>
#include <fstream>
using namespace std;

int main() {
  ofstream outputFile("new_file.txt");
  if (outputFile.is_open()) {
    outputFile << "Hello, file!" << endl;
    outputFile.close();
  }
  ifstream inputFile("data.txt");
  if (inputFile.is_open()) {
    string line;
    while (getline(inputFile, line)) {
      cout << line << endl;
    }
    inputFile.close();
  }
  return 0;
}`} />
              </div>
            </div>

            {/* Exam Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['exam-tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Exam Tips
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">📌 Know the C++ Program Structure</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand preprocessor directives, global declarations, the <code>main()</code> function, local declarations, and statements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">📌 Differentiate Error Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to identify syntax, runtime, logical, linker, and semantic errors with examples.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">📌 Master Operators</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Arithmetic, assignment, relational, logical, and ternary operators – know their precedence and usage.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">📌 Practice Writing Functions</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to write functions with parameters, return values, and understand pass-by-value vs. pass-by-reference.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">📌 Understand Control Structures</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sequence, selection (if/else, switch), and iteration (for, while, do-while) – be able to trace and write code.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Code it. Debug it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="rounded-2xl border border-cyan-100 dark:border-cyan-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400">💡 C++ Insight</h3>
                <button onClick={refreshRandomTip} className="p-1.5 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transition-colors">
                  <RefreshCw size={16} className="text-cyan-500 dark:text-cyan-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{randomTip.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{randomTip.text}</p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📊 Quick Stats</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between"><span>Sections</span><span className="font-bold text-cyan-600 dark:text-cyan-400">{SECTION_TABS.length}</span></li>
                <li className="flex justify-between"><span>Data Types</span><span className="font-bold text-cyan-600 dark:text-cyan-400">3 Standard + User-Defined</span></li>
                <li className="flex justify-between"><span>Error Types</span><span className="font-bold text-cyan-600 dark:text-cyan-400">5</span></li>
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">📝 Remember</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">Variables are the building blocks of any program. Master their declaration, scope, and usage, and everything else will follow.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => { const scrollArea = document.getElementById('lesson-scroll-area'); if (scrollArea) { scrollArea.scrollTo({ top: 0, behavior: 'smooth' }); } else { window.scrollTo({ top: 0, behavior: 'smooth' }); } }} className="w-12 h-12 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center">
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-cyan-100 text-sm">
            <li className="flex items-start gap-2"><span className="text-cyan-300 font-bold">•</span><span><strong className="text-white">C++ program structure</strong> – preprocessor directives, globals, <code>main()</code>, locals, statements, comments.</span></li>
            <li className="flex items-start gap-2"><span className="text-cyan-300 font-bold">•</span><span><strong className="text-white">Data types</strong> – integers, floating-point, char, bool, arrays, structures, classes.</span></li>
            <li className="flex items-start gap-2"><span className="text-cyan-300 font-bold">•</span><span><strong className="text-white">Operators</strong> – arithmetic, assignment, relational, logical, ternary, comma, dot.</span></li>
            <li className="flex items-start gap-2"><span className="text-cyan-300 font-bold">•</span><span><strong className="text-white">Functions</strong> – reusable blocks, pass-by-value, scope, prototypes, overloading.</span></li>
            <li className="flex items-start gap-2"><span className="text-cyan-300 font-bold">•</span><span><strong className="text-white">Control structures</strong> – sequence, selection (if/switch), iteration (for/while/do-while).</span></li>
            <li className="flex items-start gap-2"><span className="text-cyan-300 font-bold">•</span><span><strong className="text-white">Data structures</strong> – arrays, structs, classes. File I/O – reading and writing text/binary files.</span></li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">Sidemann Academic Registry • NC IT Programming Registry 1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
