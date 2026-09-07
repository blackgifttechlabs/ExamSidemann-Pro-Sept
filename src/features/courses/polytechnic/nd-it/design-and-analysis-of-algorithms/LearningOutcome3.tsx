import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  ChartLine,
  Clock,
  HardDrive,
  ChartBar,
  Bolt,
  Microchip,
  Database,
  Code,
  Terminal,
  GitBranch,
  Lightbulb,
  GraduationCap,
  Table,
  List,
  Copy,
  Check,
  Search,
  X,
  RefreshCw,
  ChevronUp,
  BookOpen,
  Layers,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'complexity', label: 'Complexity' },
  { id: 'big-o', label: 'Big O' },
  { id: 'common', label: 'Common Complexities' },
  { id: 'calculating', label: 'Calculating' },
  { id: 'space', label: 'Space' },
  { id: 'examples', label: 'Examples' },
  { id: 'exam-tips', label: 'Exam Tips' },
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
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
        text: 'Big O notation was introduced by Paul Bachmann and Edmund Landau in the 1890s and popularised in computer science by Donald Knuth.',
      },
      {
        title: 'Pro Tip',
        text: 'When comparing algorithms, focus on the dominant term – it tells you how performance scales as input grows.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: O(1) is like a direct hit, O(log n) is like flipping a phonebook, O(n) is like reading every page.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t forget to consider both time and space complexity – sometimes a faster algorithm uses much more memory.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Big O notation was introduced by Paul Bachmann and Edmund Landau in the 1890s and popularised in computer science by Donald Knuth.',
      },
      {
        title: 'Pro Tip',
        text: 'When comparing algorithms, focus on the dominant term – it tells you how performance scales as input grows.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: O(1) is like a direct hit, O(log n) is like flipping a phonebook, O(n) is like reading every page.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t forget to consider both time and space complexity – sometimes a faster algorithm uses much more memory.',
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
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
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

  // ─── Copy to clipboard ──────────────────────────────────────────────────
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Syntax highlighting (same as LO1) ────────────────────────────────
  const highlightSyntax = (code: string): React.ReactNode => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const placeholders: Record<string, string> = {};
    let counter = 0;

    // Comments
    escaped = escaped.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
      const key = `__COMMENT_${counter++}__`;
      placeholders[key] = `<span class="text-[#57A64A] dark:text-[#6a9955] italic">${match}</span>`;
      return key;
    });

    // Strings
    escaped = escaped.replace(/(".*?"|'.*?'|`.*?`)/g, (match) => {
      const key = `__STRING_${counter++}__`;
      placeholders[key] = `<span class="text-[#D69D85] dark:text-[#ce9178]">${match}</span>`;
      return key;
    });

    // Keywords
    const keywords = [
      'int', 'void', 'char', 'double', 'float', 'if', 'else', 'return', 'for',
      'while', 'do', 'break', 'continue', 'switch', 'case', 'default', 'class',
      'struct', 'public', 'private', 'protected', 'namespace', 'using', 'include',
      'define', 'endl', 'cout', 'cin', 'new', 'delete', 'this', 'virtual', 'override',
      'static', 'const', 'enum', 'template', 'typename', 'try', 'catch', 'throw',
      'swap'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Methods (words followed by '(')
    escaped = escaped.replace(/(?<![<>"'])\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-[#DCDCAA]">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#16a34a] dark:text-[#b5cea8]">$1</span>');

    Object.keys(placeholders).forEach(key => {
      escaped = escaped.replace(key, placeholders[key]);
    });

    const lines = escaped.split('\n');
    return lines.map((line, idx) => (
      <div key={idx} className="flex min-h-[1.5rem] hover:bg-gray-100/50 dark:hover:bg-gray-700/30 rounded-md transition-colors">
        <span className="text-right w-8 select-none text-gray-400 dark:text-gray-500 text-xs pr-3 mr-3 border-r border-gray-200 dark:border-gray-700 shrink-0">
          {idx + 1}
        </span>
        <pre
          className="m-0 flex-1 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: line || ' ' }}
        />
      </div>
    ));
  };

  // ─── CodeBlock component ────────────────────────────────────────────────
  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          {copiedId === id ? <Check size={12} /> : <Copy size={12} />}
          {copiedId === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-white dark:bg-[#0a0a0b] p-4 overflow-x-auto">
        {highlightSyntax(code)}
      </div>
    </div>
  );

  // ─── Table component ────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0a0a0b]' : 'bg-slate-50 dark:bg-[#121212]'}>
              {row.map((cell, j) => (
                <td key={j} className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Code snippets ──────────────────────────────────────────────────────
  const bubbleSortCode = `void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`;

  // ─── Data for tables ────────────────────────────────────────────────────
  const complexityRows = [
    ['O(1)', 'Constant', 'Accessing array element'],
    ['O(log n)', 'Logarithmic', 'Binary search'],
    ['O(n)', 'Linear', 'Linear search, array traversal'],
    ['O(n log n)', 'Linearithmic', 'Merge sort, quicksort (average)'],
    ['O(n²)', 'Quadratic', 'Bubble sort, selection sort'],
    ['O(n³)', 'Cubic', 'Matrix multiplication (naive)'],
    ['O(2ⁿ)', 'Exponential', 'Recursive Fibonacci (naive)'],
  ];

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <ChartLine size={14} className="inline mr-1" /> ALGORITHM COMPLEXITY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Algorithm Complexity
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master time and space complexity, Big O notation, algorithm analysis,
            and complexity calculations to write efficient, scalable code.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Clock size={14} className="inline mr-1" /> Time
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDrive size={14} className="inline mr-1" /> Space
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, notation, or algorithm..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-indigo-200" />
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
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Algorithm Complexity
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold">Algorithm complexity</span> refers to the computational resources
                    (typically time and space) required by an algorithm as a function of the input size. It helps
                    us predict performance, compare algorithms, and make informed design decisions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Time Complexity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Measures the amount of time an algorithm takes to execute as a function of the input size. Expressed using Big O notation.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Space Complexity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Measures the amount of memory an algorithm uses as a function of the input size. Also expressed using Big O notation.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Need for Algorithm Analysis</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Performance prediction:</strong> Predict performance for different input sizes.</li>
                  <li><strong>Algorithm comparison:</strong> Compare efficiency of different algorithms.</li>
                  <li><strong>Resource optimization:</strong> Identify bottlenecks and optimize resource usage.</li>
                  <li><strong>Problem‑solving insights:</strong> Understand the nature of problems.</li>
                  <li><strong>Algorithm design:</strong> Guide the design of efficient algorithms.</li>
                  <li><strong>Theoretical foundations:</strong> Form the theoretical foundation of computer science.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 2: Complexity Details ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['complexity'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Time vs Space & Cases
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Time vs Space</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Time complexity measures how runtime scales with input size; space complexity measures how memory usage scales.
                  Often there is a trade‑off – a faster algorithm may use more memory (e.g., caching) and vice versa.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Algorithm Complexity Cases</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Best case:</strong> Minimum time/space for a given input size. Often a theoretical bound.</li>
                  <li><strong>Worst case:</strong> Maximum time/space for a given input size. Useful for worst‑case performance guarantees.</li>
                  <li><strong>Average case:</strong> Expected time/space assuming a random distribution of inputs. A more realistic measure.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 3: Big O Notation ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['big-o'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Big O Notation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Big O notation is a mathematical way to describe how an algorithm's performance (usually its runtime)
                  grows as the input size increases. It focuses on the worst‑case scenario and ignores constant factors
                  and lower‑order terms, giving us a simplified way to compare algorithms.
                </p>
                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    Common notations: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Common Complexities ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['common'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Common Time & Space Complexities
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Time Complexities</h4>
                <Table
                  headers={["Notation", "Name", "Example"]}
                  rows={complexityRows}
                  title="Common Time Complexities"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Space Complexities</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>O(1) – Constant:</strong> Fixed amount of extra space (e.g., bubble sort, iterative algorithms).</li>
                  <li><strong>O(log n) – Logarithmic:</strong> Space grows logarithmically (e.g., recursive divide‑and‑conquer with small stack).</li>
                  <li><strong>O(n) – Linear:</strong> Space grows linearly (e.g., merge sort, storing a copy of input).</li>
                  <li><strong>O(n²) – Quadratic:</strong> Space grows quadratically (e.g., storing a matrix).</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 5: Calculating Time Complexity ────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['calculating'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Calculating Time Complexity
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Steps</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Identify the Input Size (n):</strong> Determine what represents the input size for the specific algorithm.</li>
                  <li><strong>Identify the Basic Operations:</strong> Pinpoint fundamental operations (arithmetic, comparisons, assignments, etc.).</li>
                  <li><strong>Analyze the Loop Structure:</strong> Nested loops multiply iterations; single loops count iterations.</li>
                  <li><strong>Determine the Dominant Term:</strong> Find the term that grows fastest as n increases.</li>
                  <li><strong>Apply Big O Notation:</strong> Ignore constant factors and lower‑order terms; express using Big O.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Example: Bubble Sort</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Let's analyse the time complexity of the bubble sort algorithm:</p>
                <CodeBlock code={bubbleSortCode} title="bubble_sort.cpp" id="bubbleSort" />
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Input Size:</strong> n (number of elements)</li>
                  <li><strong>Basic Operations:</strong> Comparisons and swaps.</li>
                  <li><strong>Loop Analysis:</strong> Nested loops contribute O(n²).</li>
                  <li><strong>Big O Notation:</strong> O(n²).</li>
                </ul>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">This means that as n increases, the runtime grows quadratically.</p>
              </div>
            </div>

            {/* ─── Section 6: Space Complexity ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['space'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Analysing Space Complexity
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Space complexity measures the amount of extra memory an algorithm uses as a function of the input size.
                </p>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4">Steps to Analyse Space Complexity</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Identify Auxiliary Space:</strong> Determine extra space used beyond the input data (variables, data structures, call stack).</li>
                  <li><strong>Express in Big O Notation:</strong> Represent auxiliary space as a function of input size.</li>
                </ol>
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4">Example: Bubble Sort</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">For bubble sort, the auxiliary space used is constant: loop variables (i, j) and a temporary variable for swapping. Therefore, space complexity is O(1).</p>
              </div>
            </div>

            {/* ─── Section 7: Examples (Q&A) ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['examples'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Examples (Q&A)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Time Complexity</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Q:</strong> Linear search?<br /><strong>A:</strong> O(n)</li>
                    <li><strong>Q:</strong> Binary search?<br /><strong>A:</strong> O(log n)</li>
                    <li><strong>Q:</strong> Merge sort?<br /><strong>A:</strong> O(n log n)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Space Complexity</h4>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Q:</strong> Iterative bubble sort?<br /><strong>A:</strong> O(1)</li>
                    <li><strong>Q:</strong> Recursive Fibonacci?<br /><strong>A:</strong> O(n) (call stack)</li>
                    <li><strong>Q:</strong> Merge sort?<br /><strong>A:</strong> O(n) (temporary array)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 8: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Time Complexities</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>O(1):</strong> Constant (array access)</li>
                    <li><strong>O(log n):</strong> Logarithmic (binary search)</li>
                    <li><strong>O(n):</strong> Linear (linear search)</li>
                    <li><strong>O(n log n):</strong> Linearithmic (merge sort)</li>
                    <li><strong>O(n²):</strong> Quadratic (bubble sort)</li>
                    <li><strong>O(2ⁿ):</strong> Exponential (naive Fibonacci)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Space Complexities</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>O(1):</strong> Constant (bubble sort)</li>
                    <li><strong>O(log n):</strong> Logarithmic (some divide‑and‑conquer)</li>
                    <li><strong>O(n):</strong> Linear (merge sort, recursive Fibonacci)</li>
                    <li><strong>O(n²):</strong> Quadratic (matrix storage)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Key Analysis Steps</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Identify input size (n)</li>
                    <li>Count basic operations</li>
                    <li>Analyse loops (nested = multiply)</li>
                    <li>Find dominant term</li>
                    <li>Express in Big O</li>
                    <li>Consider best/worst/average cases</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Compare the time complexity of different sorting algorithms" or "Explain why binary search is O(log n)"
                      are common questions. Focus on understanding the growth rates and how to derive them from the
                      algorithm's structure.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Analyse it. Optimise it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Complexity Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Common Notations</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Complexity Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Complexity analysis is essential for building scalable systems. Always consider both time and space,
                and remember that real‑world performance also depends on constants and hardware – but Big O gives
                you the big picture.
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
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Algorithm complexity</strong> measures resource usage as input size grows – both time and space matter.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Big O notation</strong> describes worst‑case growth, ignoring constants and lower‑order terms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common complexities</strong> range from O(1) (constant) to O(2ⁿ) (exponential) – understand the differences.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Analysing complexity</strong> involves identifying input size, basic operations, loops, and the dominant term.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from practicing with examples and understanding how to derive complexities from code.
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
            Sidemann Academic Registry • Algorithm Complexity 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;