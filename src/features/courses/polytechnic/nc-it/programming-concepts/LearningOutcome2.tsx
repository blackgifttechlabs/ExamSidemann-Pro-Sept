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
  CheckCircle,
  Rocket,
  Brain,
  FileCode,
  Code,
  Database,
  ChevronUp,
  X,
  Sparkles,
  BookMarked,
  Target,
  Users,
  Scale,
  AlertTriangle,
  Globe,
  Swords,
  HeartHandshake,
  Flag,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// VS CODE TYPING ANIMATION COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
const VSCodeTyping: React.FC<{ code: string }> = ({ code }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsTyping(true);
      },
      { threshold: 0.5 }
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
    }, 15);
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
          <Terminal size={12} /> odd-even.cpp — Visual Studio Code
        </span>
      </div>
      <div className="p-4 md:p-6 flex gap-4 min-h-[300px]">
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
// IMAGE REGISTRY HELPER
// ──────────────────────────────────────────────────────────────────────────────
const RegistryImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  return (
    <div className="my-10 bg-white dark:bg-[#0d0d0d] border-2 border-gray-100 dark:border-white/5 p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="text-[#003153]" size={16} />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alt} Registry Document</span>
      </div>
      <img src={src} alt={alt} className="w-full h-auto object-contain max-h-[600px] border border-gray-100 dark:border-white/5 bg-white p-2" />
      <div className="mt-4 p-3 bg-gray-50 dark:bg-black/40 text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center justify-between">
        <span>Flowchart visualization unit</span>
        <span className="text-[#003153]">Verified logic</span>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'symbols', label: 'Symbols' },
  { id: 'constructs', label: 'Constructs' },
  { id: 'converting', label: 'Converting' },
  { id: 'compiler', label: 'Compiler' },
  { id: 'pseudocode', label: 'Pseudocode' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'Flowcharts use symbols like rectangles (process), diamonds (decisions), and parallelograms (input/output) to visually represent program logic.',
      },
      {
        title: 'Pro Tip',
        text: 'Pseudocode is a bridge between algorithms and actual code – it uses code-like keywords but ignores strict syntax, making it easier to plan before coding.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three programming constructs: Sequence (steps in order), Selection (decisions), Iteration (loops).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a flowchart with an algorithm. A flowchart is a visual diagram; an algorithm is a step-by-step written procedure. Pseudocode is a middle ground.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Flowcharts use symbols like rectangles (process), diamonds (decisions), and parallelograms (input/output) to visually represent program logic.',
      },
      {
        title: 'Pro Tip',
        text: 'Pseudocode is a bridge between algorithms and actual code – it uses code-like keywords but ignores strict syntax, making it easier to plan before coding.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three programming constructs: Sequence (steps in order), Selection (decisions), Iteration (loops).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a flowchart with an algorithm. A flowchart is a visual diagram; an algorithm is a step-by-step written procedure. Pseudocode is a middle ground.',
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
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

  const codeExample = `#include <iostream>
using namespace std;

int main() {
  int number;
  cout << "Enter a number: ";
  cin >> number;
  
  // Check if even or odd
  if (number % 2 == 0) {
    cout << number << " is even." << endl;
  } else {
    cout << number << " is odd." << endl;
  }
  
  return 0;
}`;

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Flowcharts &amp; Pseudocode
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master flowchart symbols, sequence/selection/iteration constructs,
            converting logic to C++ code, installing a compiler, and writing
            pseudocode to plan your programs effectively.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> Logic
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileCode size={14} className="inline mr-1" /> Flowcharts
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a symbol, concept, or term..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-blue-200" />
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
                Introduction to Flowcharts &amp; Pseudocode
              </h2>

              <div className="p-4 sm:p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Flowcharts and pseudocode are essential tools for planning
                    programs before writing actual code. They help you visualize
                    logic, identify errors early, and communicate your design
                    clearly. This learning outcome covers symbols, constructs,
                    conversion to C++, compiler installation, and pseudocode.
                  </p>
</div>
            </div>

            {/* Symbols */}
            <div
              ref={(el) => {
                sectionRefs.current['symbols'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Flowchart Symbols
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Matching Symbols with Functions</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Here's the matching of flowchart symbols with their functions:</p>
                <RegistryImage src="https://i.ibb.co/VcDVXgGR/flo1.png" alt="Flowchart Symbols Matching" />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Key Symbols</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold text-slate-900 dark:text-white">Terminal</span> – Oval shape, indicates start or end.</li>
                  <li><span className="font-bold text-slate-900 dark:text-white">Process</span> – Rectangle, represents a calculation or operation.</li>
                  <li><span className="font-bold text-slate-900 dark:text-white">Input/Output</span> – Parallelogram, for reading input or displaying output.</li>
                  <li><span className="font-bold text-slate-900 dark:text-white">Decision</span> – Diamond, for conditional branching (if/else).</li>
                  <li><span className="font-bold text-slate-900 dark:text-white">Flow Arrow</span> – Shows the sequence of steps.</li>
                  <li><span className="font-bold text-slate-900 dark:text-white">Subroutine</span> – Rectangle with vertical lines, for function calls.</li>
                </ul>
              </div>
            </div>

            {/* Constructs */}
            <div
              ref={(el) => {
                sectionRefs.current['constructs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Programming Constructs in Flowcharts
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Sequence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Steps executed in order, one after another. Symbols: rectangles connected by arrows.</p>
                  <RegistryImage src="https://i.ibb.co/W4bjt75t/flo2.png" alt="Sequence Flowchart Example" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Selection</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Decision point where program chooses between two paths. Uses diamond (decision) and rectangles.</p>
                  <RegistryImage src="https://i.ibb.co/JwTjTRyL/flo3.png" alt="Selection Flowchart Example" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Iteration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Loop that repeats steps based on a condition. Uses diamond and rectangles; the flow creates a cycle.</p>
                  <RegistryImage src="https://i.ibb.co/KZJw0W3/flo4.png" alt="Iteration Flowchart Example" />
                </div>
              </div>
            </div>

            {/* Converting */}
            <div
              ref={(el) => {
                sectionRefs.current['converting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Converting Flowchart Logic to C++ Code
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Step-by-Step Process</h3>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2 mt-2">
                  <li><span className="font-bold">Analyze the flowchart</span> – understand purpose, symbols, flow of execution.</li>
                  <li><span className="font-bold">Translate steps:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><span className="font-bold">Input:</span> Use <code className="bg-slate-100 dark:bg-slate-800 px-1">cin</code></li>
                      <li><span className="font-bold">Processing:</span> Use operators, loops, or conditionals</li>
                      <li><span className="font-bold">Decision:</span> Use <code className="bg-slate-100 dark:bg-slate-800 px-1">if</code> statements</li>
                      <li><span className="font-bold">Output:</span> Use <code className="bg-slate-100 dark:bg-slate-800 px-1">cout</code></li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Example: Even or Odd</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Consider the flowchart that checks if a number is even or odd.</p>
                <RegistryImage src="https://i.ibb.co/7Drhdsg/flo6.png" alt="Even or Odd Flowchart" />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">Here's the equivalent C++ code:</p>
                <VSCodeTyping code={codeExample} />
                <div className="mt-4 p-3 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Explanation</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Include <code>iostream</code> for input/output.</li>
                    <li>Declare <code>number</code> to store user input.</li>
                    <li>Prompt and read using <code>cin</code>.</li>
                    <li><code>if</code> statement checks <code>number % 2 == 0</code> for even.</li>
                    <li><code>else</code> for odd.</li>
                    <li>Output result using <code>cout</code>.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Info size={14} /> Tips for Complex Flowcharts
                </h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Break down complex flowcharts into smaller sub-functions.</li>
                  <li>Use comments in your code to explain sections.</li>
                  <li>Test with different input values.</li>
                </ul>
              </div>
            </div>

            {/* Compiler */}
            <div
              ref={(el) => {
                sectionRefs.current['compiler'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                How to Install a C++ Compiler (Dev-C++)
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    Download Dev-C++ Installer
                  </h4>
                  <ul className="list-disc pl-8 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                    <li>Visit official Dev-C++ website (search "Dev-C++ download").</li>
                    <li>Download the latest stable version for Windows.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    Run the Installer
                  </h4>
                  <ul className="list-disc pl-8 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                    <li>Double-click the downloaded executable.</li>
                    <li>Follow on-screen instructions: language, license, destination folder, components.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    Complete Installation
                  </h4>
                  <ul className="list-disc pl-8 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                    <li>Progress bar reaches 100%.</li>
                    <li>Option to create desktop shortcut or launch immediately.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    Verification
                  </h4>
                  <ul className="list-disc pl-8 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-1">
                    <li>Launch Dev-C++.</li>
                    <li>Create a simple "Hello, World!" program to test.</li>
                    <li>Explore online tutorials to get familiar.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Pseudocode */}
            <div
              ref={(el) => {
                sectionRefs.current['pseudocode'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Pseudocode
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Definition</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pseudocode is a way of representing the logic of an algorithm in a format that resembles a programming language, but without strict syntax rules. It uses keywords and phrases common across languages, making it easier to understand the overall flow.</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Key Characteristics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Readability</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Clear and understandable, focuses on core logic.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Informality</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Doesn't adhere to strict syntax; allows natural language.</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                      <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Flexibility</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Can be adapted to resemble the target programming language.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pseudocode vs Algorithm</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs mt-2">
                      <thead>
                        <tr className="bg-blue-50 dark:bg-blue-900/20">
                          <th className="p-2 font-bold text-slate-700 dark:text-slate-300">Feature</th>
                          <th className="p-2 font-bold text-slate-700 dark:text-slate-300">Algorithm</th>
                          <th className="p-2 font-bold text-slate-700 dark:text-slate-300">Pseudocode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr><td className="p-2 font-bold">Level of Detail</td><td className="p-2">High-level description</td><td className="p-2">More detailed, but less than code</td></tr>
                        <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-2 font-bold">Specificity</td><td className="p-2">Language-independent</td><td className="p-2">May resemble a specific language</td></tr>
                        <tr><td className="p-2 font-bold">Focus</td><td className="p-2">Problem-solving approach</td><td className="p-2">Detailed instructions, not actual code</td></tr>
                        <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-2 font-bold">Implementation</td><td className="p-2">Not directly translatable</td><td className="p-2">Easily translated into code</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Example: Algorithm</h4>
                    <div className="p-3 bg-gray-50 dark:bg-[#121212] rounded border border-slate-200 dark:border-slate-700 text-sm">
                      <p>Start</p>
                      <p>Declare num1, num2</p>
                      <p>Prompt user for two numbers</p>
                      <p>Read num1 and num2</p>
                      <p>Compare: if num1 {'>'} num2, max = num1 else max = num2</p>
                      <p>Display max</p>
                      <p>End</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Example: Pseudocode</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto">
                      <pre>{`FUNCTION FindMax(num1, num2)
    IF num1 > num2 THEN
        max = num1
    ELSE
        max = num2
    END IF
    DISPLAY max
END FUNCTION`}</pre>
                    </div>
                  </div>
                </div>
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
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Know Your Symbols</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to identify and explain the purpose of each flowchart symbol (terminal, process, decision, input/output, arrows).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Practice Constructs</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Draw flowcharts for sequence, selection, and iteration – and be ready to explain how they translate to C++ (if, if-else, loops).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Convert Flowcharts to Code</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Practice converting a given flowchart into C++ code, and vice versa. The even/odd example is a classic.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Understand Pseudocode</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the difference between pseudocode and algorithms. Be able to write pseudocode for a simple problem.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Draw it. Code it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Flowchart Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Flowchart Symbols</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Programming Constructs</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Flowcharts and pseudocode are your blueprints. They save time,
                prevent errors, and make complex logic manageable. Master them
                to become a better programmer.
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
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Flowchart symbols</strong> – terminal, process, input/output, decision, arrows, and subroutine – each have a specific purpose in representing program logic.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Three programming constructs</strong> – Sequence (order), Selection (decisions), Iteration (loops) – form the building blocks of all algorithms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Converting flowcharts</strong> to C++ involves translating each symbol into corresponding code: input (cin), process (operators/loops), decision (if/else), output (cout).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pseudocode</strong> is a middle ground between algorithms and code – it uses code-like keywords but ignores strict syntax, making planning easier.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Compiler installation</strong> – Dev-C++ is a popular C++ compiler for Windows; follow the steps to download, install, and verify.
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
            Sidemann Academic Registry • NC IT Programming Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;