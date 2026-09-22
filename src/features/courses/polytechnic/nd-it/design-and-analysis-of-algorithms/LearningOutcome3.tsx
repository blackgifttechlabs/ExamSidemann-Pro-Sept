import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import { ComplexityVisualizerSVG } from './ComplexityVisualizerSVG';
import { BigONotationGrid } from './BigONotationGrid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
const SPACE_BUDGET_MB = 1024; // 1 GB budget — makes growth concrete instead of abstract

const SpaceComplexityVisualizer = () => {
  const maxN = 32;
  const [n, setN] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setN((prev) => (prev >= maxN ? 1 : prev + 1));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const series = [
    { key: "O(1)", name: "Constant", color: "bg-emerald-500", fn: () => 4, explanation: "Fixed 4MB no matter how big the input gets." },
    { key: "O(log n)", name: "Logarithmic", color: "bg-blue-500", fn: (x: number) => 4 * Math.log2(x + 1), explanation: "Grows, but so slowly it barely touches the budget." },
    { key: "O(n)", name: "Linear", color: "bg-amber-500", fn: (x: number) => 4 * x, explanation: "Grows in a straight line with the input." },
    { key: "O(n²)", name: "Quadratic", color: "bg-red-500", fn: (x: number) => 4 * x * x, explanation: "Grows so fast it can blow straight through the budget." },
  ];

  const formatMB = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`);

  return (
    <div className="w-full max-w-4xl rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0a0a0b] p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Input size (n): <span className="text-slate-900 dark:text-slate-100">{n}</span> · Memory budget: 1 GB
        </span>
        <span className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400">
          <RefreshCw size={12} className="animate-spin" style={{ animationDuration: "2s" }} /> looping
        </span>
      </div>
      <div className="space-y-4">
        {series.map((item) => {
          const usedMB = item.fn(n);
          const overBudget = usedMB > SPACE_BUDGET_MB;
          const widthPct = Math.min(100, (usedMB / SPACE_BUDGET_MB) * 100);
          const remainingMB = Math.max(0, SPACE_BUDGET_MB - usedMB);

          return (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm flex-wrap">
                <span className="font-bold text-slate-900 dark:text-slate-100">{item.key} — {item.name}</span>
                <span className="text-slate-600 dark:text-slate-400">{item.explanation}</span>
              </div>
              <div className="relative h-8 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700">
                <div
                  className={`h-full rounded-lg transition-all duration-300 ease-linear ${overBudget ? "bg-red-600 animate-pulse" : item.color}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={overBudget ? "font-bold text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}>
                  {overBudget ? `Over budget by ${formatMB(usedMB - SPACE_BUDGET_MB)}!` : `Used: ${formatMB(usedMB)}`}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  {overBudget ? "0 MB remaining" : `${formatMB(remainingMB)} remaining`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LearningOutcome3: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMoreExamples, setShowMoreExamples] = useState(false);

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

  // ─── Inline code highlighter (for short expressions inside prose) ──────
  const highlightInline = (code: string): React.ReactNode => {
    const tokens = code.split(/([+\-*/=\[\]().,]|\s+)/g).filter((t) => t !== '');
    return tokens.map((tok, i) => {
      if (/^\s+$/.test(tok)) return tok;
      if (/^[+\-*/=]$/.test(tok)) {
        return <span key={i} className="text-pink-500 dark:text-pink-400 font-semibold">{tok}</span>;
      }
      if (/^[\[\]().,]$/.test(tok)) {
        return <span key={i} className="text-slate-400 dark:text-slate-500">{tok}</span>;
      }
      if (/^\d+$/.test(tok)) {
        return <span key={i} className="text-emerald-600 dark:text-[#b5cea8] font-semibold">{tok}</span>;
      }
      if (/^(i|j|k)$/.test(tok)) {
        return <span key={i} className="text-amber-600 dark:text-amber-400 font-semibold">{tok}</span>;
      }
      return <span key={i} className="text-sky-600 dark:text-[#4ec9b0] font-semibold">{tok}</span>;
    });
  };

  // ─── Inline math tokens (for n, n², O(...) inside prose) ───────────────
  const MathN = () => (
    <span className="font-mono italic font-semibold text-sky-600 dark:text-[#4ec9b0]">n</span>
  );
  const MathN2 = () => (
    <>
      <MathN />
      <sup className="font-mono font-semibold text-sky-600 dark:text-[#4ec9b0]">2</sup>
    </>
  );
  const BigONotation = ({ inner }: { inner: React.ReactNode }) => (
    <>
      <span className="font-mono font-semibold text-purple-600 dark:text-purple-400">O</span>
      <span className="font-mono text-slate-400 dark:text-slate-500">(</span>
      {inner}
      <span className="font-mono text-slate-400 dark:text-slate-500">)</span>
    </>
  );

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

  type AnalysisLine = { code: string; cost: React.ReactNode; note: string };
  type AnalysisBoardProps = {
    title: string;
    description: string;
    code: string;
    fileName: string;
    id: string;
    lines: AnalysisLine[];
    total: React.ReactNode;
    simplification: React.ReactNode;
    answer: React.ReactNode;
    keyIdea: string;
  };

  const AnalysisBoard = ({
    title,
    description,
    code,
    fileName,
    id,
    lines,
    total,
    simplification,
    answer,
    keyIdea,
  }: AnalysisBoardProps) => (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      <CodeBlock code={code} title={fileName} id={id} />
      <div
        className="rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-[#fdfaf3] dark:bg-[#1a1a1a] p-5 space-y-5"
        style={{ fontFamily: "'Kalam', cursive" }}
      >
        <div>
          <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">
            Step 1: Count the cost of each part
          </h4>
          <ol className="space-y-2 text-base md:text-lg text-slate-800 dark:text-slate-200">
            {lines.map((line, index) => (
              <li key={line.code} className="flex flex-wrap items-baseline gap-2">
                <span>{index + 1}.</span>
                <code className="font-mono not-italic text-sky-700 dark:text-cyan-300">{highlightInline(line.code)}</code>
                <span className="text-slate-500 dark:text-slate-400">→</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{line.cost}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 italic">{line.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="pt-5 border-t border-slate-300/70 dark:border-slate-700">
          <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">
            Step 2: Determine the total cost
          </h4>
          <p className="text-lg text-slate-800 dark:text-slate-200">Now combine the costs, keeping the dominant term:</p>
          <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 pl-4 mt-2">T(<MathN />) = {total}</p>
          <p className="text-2xl font-bold pl-4 mt-1 flex flex-wrap items-center gap-3">
            <span className="text-slate-400">=</span>
            <span className="inline-block px-3 py-1 border-2 border-red-500 rounded-md text-red-600 dark:text-red-400">
              {simplification}
            </span>
            <span className="text-sm italic text-slate-500 dark:text-slate-400 font-sans">(dominant term)</span>
          </p>
        </div>

        <div className="pt-5 border-t border-slate-300/70 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">Final Answer:</h4>
            <div className="inline-block px-5 py-2 border-2 border-emerald-600 rounded-lg text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {answer}
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">Key idea:</h4>
            <p className="text-lg text-slate-800 dark:text-slate-200">{keyIdea}</p>
          </div>
        </div>
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
      <table className={`w-full border-collapse text-sm ${title === "Common Time Complexities" ? "text-left" : ""}`}>
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

  const linearSearchCode = `int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`;

  const binarySearchCode = `int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`;

  const selectionSortCode = `void selectionSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`;

  const matrixMultiplyCode = `void multiply(int a[][N], int b[][N], int c[][N], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            for (int k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}`;

  const fibonacciCode = `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
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
        <div className="grid grid-cols-1 gap-8">
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Algorithm Complexity
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold">Algorithm complexity</span> is a way to measure how fast an algorithm
                    runs and how much memory it uses, based on how much input you give it. The bigger the input,
                    the more time or memory it might need — complexity tells us how much more.
                  </p>
                </div>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                There are two things we look at when judging an algorithm:
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Time Complexity</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Time complexity tells you how the running time of an algorithm grows as you give it more input.
                  <br />
                  More input usually means more time - this tells you how much more.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Space Complexity</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Space complexity tells you how much extra memory an algorithm needs as you give it more input.
                  <br />
                  More input can mean more memory - this tells you how much more.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">See It In Action</h3>
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  Watch how the number of steps (bar height) grows differently for each type as the input size (n) increases.
                </p>
                <ComplexityVisualizerSVG />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Need for Algorithm Analysis</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-slate-700 dark:text-slate-300">
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
                Best & Worst Cases (Time and Space)
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  A faster algorithm can sometimes use more memory, and a memory-saving algorithm can sometimes be slower.
                  <br />
                  This push and pull between time and space is called a trade-off.
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                An algorithm does not always take the same amount of time or space every time it runs - it depends on the input. That is why we talk about three different cases:
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Best Case</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The best case is when everything goes right and the algorithm finishes as fast as possible.
                  <br />
                  <strong>Example:</strong> searching for an item that happens to be the very first one you check.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Worst Case</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The worst case is when everything takes the longest possible time or the most possible space.
                  <br />
                  <strong>Example:</strong> searching for an item that happens to be the very last one you check, or is not there at all.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Average Case</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The average case is what usually happens - not the luckiest run, and not the unluckiest run.
                  <br />
                  This is often the most realistic way to judge how an algorithm performs.
                </p>
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

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  Big O notation is just a short way of writing down how slow (or fast) an algorithm gets as you give it
                  more input. Instead of exact numbers, it describes the pattern of growth – and it always describes the
                  worst case, so you know the maximum time or space you could ever need.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="mt-4 mb-2 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  Time Complexity
                </h3>

                <p className="text-left text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Here are the notations you will see most often, from fastest to slowest:
                </p>

                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-200">
                    Time Complexities
                  </div>
                  <table className="w-full border-collapse text-left text-sm text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
                      <tr>
                        <th className="px-3 py-2 text-left align-left font-semibold">Complexity</th>
                        <th className="px-3 py-2 text-left align-left font-semibold">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['O(1)', 'The work stays the same no matter how big the input gets.'],
                        ['O(log n)', 'The work keeps shrinking by half each step, so it grows very slowly.'],
                        ['O(n)', 'The work grows in a straight line as the input grows.'],
                        ['O(n log n)', 'The work grows a bit faster than linear because of repeated splitting and combining.'],
                        ['O(n²)', 'The work grows much faster, usually from checking many pairs.'],
                        ['O(2ⁿ)', 'The work doubles each time the input gets one bigger, which becomes huge very quickly.'],
                      ].map(([complexity, meaning], index) => (
                        <tr
                          key={complexity}
                          className={index % 2 === 0 ? 'bg-white dark:bg-[#0a0a0b]' : 'bg-slate-50 dark:bg-[#121212]'}
                        >
                          <td className="px-3 py-2 text-left align-left font-semibold text-slate-900 dark:text-slate-100">{complexity}</td>
                          <td className="px-3 py-2 text-left align-left">{meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 className="mt-8 pt-8 mb-4 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Visualizing How Time Complexity Grows
              </h3>

              <div className="w-full max-w-4xl">
                <BigONotationGrid />
              </div>
            </div>

            {/* ─── Section 4: Common Complexities ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['common'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                  Space Complexity
                </h2>

                <p className="text-left text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Space complexity tells us how much extra memory an algorithm needs while it runs.
                  Less extra memory usually means the algorithm is easier to run on a computer.
                </p>

                <Table
                  headers={["Notation", "Name", "Simple explanation"]}
                  rows={[
                    ["O(1)", "Constant", "Uses the same small amount of extra memory."],
                    ["O(log n)", "Logarithmic", "Uses a small amount of memory that grows slowly."],
                    ["O(n)", "Linear", "Uses more memory as the input gets bigger."],
                    ["O(n²)", "Quadratic", "Uses much more memory as the input gets bigger."],
                  ]}
                  title="Common Space Complexities"
                />

                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  Visualizing Space Complexity Growth
                </h3>

                <SpaceComplexityVisualizer />

              </div>

            </div>

            {/* ─── Section 5: Calculating Time Complexity ────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['calculating'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6"
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                  Calculating Time Complexity
                </h2>
                <ul className="space-y-1.5 text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5">
                  <li>Every algorithm can be scored using a simple set of rules, and that score is written as Big O.</li>
                  <li>We do this because it lets us predict how slow an algorithm will get as the input grows, without ever having to actually run the code.</li>
                  <li>To find that score, work through the five steps below, in order, every time — they will always lead you to the same kind of answer, explained further down.</li>
                </ul>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white uppercase">
                Examples
              </h3>

              <div className="p-4 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-900/10">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                  Consider the algorithm below. Determine its time complexity, showing all steps of your analysis.
                </p>
                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <SyntaxHighlighter
                    language="cpp"
                    style={isDarkMode ? oneDark : oneLight}
                    showLineNumbers
                    wrapLines
                    customStyle={{ margin: 0, padding: '12px 0', fontSize: '0.875rem', lineHeight: '1.5' }}
                    codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
                  >
                    {`int sum = 0;
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n; j++) {
        sum = sum + arr[i] * arr[j];
    }
}`}
                  </SyntaxHighlighter>
                </div>
              </div>

              <div
                className="rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-[#fdfaf3] dark:bg-[#1a1a1a] p-5 space-y-6"
                style={{ fontFamily: "'Kalam', cursive" }}
              >
                <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');`}</style>

                <div>
                  <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">
                    Step 1: Count the cost of each part
                  </h4>
                  <ol className="space-y-2 text-lg text-slate-800 dark:text-slate-200">
                    <li className="flex flex-wrap items-baseline gap-2">
                      <span>1.</span>
                      <code className="font-mono not-italic">{highlightInline('int sum = 0;')}</code>
                      <span className="text-slate-500 dark:text-slate-400">→</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold"><BigONotation inner="1" /></span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic">(constant time)</span>
                    </li>
                    <li className="flex flex-wrap items-baseline gap-2">
                      <span>2.</span>
                      <code className="font-mono not-italic">{highlightInline('for (int i = 0; i < n; i++)')}</code>
                      <span className="text-slate-500 dark:text-slate-400">→</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold"><BigONotation inner={<MathN />} /></span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic">(runs n times)</span>
                    </li>
                    <li className="flex flex-wrap items-baseline gap-2">
                      <span>3.</span>
                      <code className="font-mono not-italic">{highlightInline('for (int j = 0; j < n; j++)')}</code>
                      <span className="text-slate-500 dark:text-slate-400">→</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold"><BigONotation inner={<MathN />} /> per <MathN /></span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic">(runs n times for each i)</span>
                    </li>
                    <li className="flex flex-wrap items-baseline gap-2">
                      <span>4.</span>
                      <code className="font-mono not-italic">{highlightInline('sum = sum + arr[i] * arr[j];')}</code>
                      <span className="text-slate-500 dark:text-slate-400">→</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold"><BigONotation inner="1" /></span>
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic">(constant time, but executed n × n times)</span>
                    </li>
                  </ol>
                </div>

                <div className="pt-6 border-t border-slate-300/70 dark:border-slate-700">
                  <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">
                    Step 2: Determine the total cost
                  </h4>
                  <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                    The inner statement (line 4) runs <MathN /> times for each <em className="italic">i</em>, and the outer loop runs <MathN /> times.
                  </p>
                  <p className="text-lg text-slate-800 dark:text-slate-200 mt-2">So, the nested loops together cost:</p>
                  <p className="flex flex-wrap items-baseline gap-2 text-2xl font-bold text-pink-600 dark:text-pink-400 pl-4 mt-1">
                    <MathN /> × <MathN /> = <MathN2 />
                  </p>
                  <p className="text-lg text-slate-800 dark:text-slate-200 mt-3">Now add the other parts (sequentially):</p>
                  <p className="flex flex-wrap items-baseline gap-2 text-2xl font-bold text-indigo-700 dark:text-indigo-400 pl-4 mt-1">
                    T(<MathN />) = <BigONotation inner="1" /> + <BigONotation inner={<MathN />} /> + <BigONotation inner={<MathN2 />} />
                  </p>
                  <p className="text-2xl font-bold pl-4 mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-slate-400">=</span>
                    <span className="inline-block px-3 py-1 border-2 border-red-500 rounded-md text-red-600 dark:text-red-400">
                      <BigONotation inner={<MathN2 />} />
                    </span>
                    <span className="text-sm italic text-slate-500 dark:text-slate-400 font-sans">(the n² term dominates)</span>
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-300/70 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">
                      Final Answer:
                    </h4>
                    <div className="inline-block px-6 py-3 border-2 border-emerald-600 rounded-lg text-3xl font-bold text-emerald-700 dark:text-emerald-400">
                      <BigONotation inner={<MathN2 />} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 underline decoration-2 mb-3">
                      Key idea:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-lg text-slate-800 dark:text-slate-200">
                      <li>Sequential statements → add their costs.</li>
                      <li>Nested loops → multiply their costs.</li>
                      <li>Here: <MathN /> × <MathN /> = <MathN2 />, so the overall complexity is <BigONotation inner={<MathN2 />} />.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setShowMoreExamples((prev) => !prev)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold text-sm transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                >
                  <span>{showMoreExamples ? "Hide extra examples" : "View 5 more examples"}</span>
                  <span className={`transition-transform ${showMoreExamples ? "rotate-180" : ""}`}>▾</span>
                </button>

                {showMoreExamples && (
                  <div className="mt-4 space-y-6">
                    <AnalysisBoard
                      title="Worked Example: Linear Search"
                      description="Applying the five steps above to linear search:"
                      code={linearSearchCode}
                      fileName="linear_search.cpp"
                      id="linearSearch"
                      lines={[
                        { code: 'int low = 0;', cost: <BigONotation inner="1" />, note: '(constant time)' },
                        { code: 'for (int i = 0; i < n; i++)', cost: <BigONotation inner={<MathN />} />, note: '(runs n times)' },
                        { code: 'if (arr[i] == target)', cost: <BigONotation inner="1" />, note: '(checked up to n times)' },
                        { code: 'return i;', cost: <BigONotation inner="1" />, note: '(constant time)' },
                      ]}
                      total={<><BigONotation inner="1" /> + <BigONotation inner={<MathN />} /></>}
                      simplification={<BigONotation inner={<MathN />} />}
                      answer={<BigONotation inner={<MathN />} />}
                      keyIdea="A single loop checks at most n elements, so the dominant cost is linear."
                    />

                    <AnalysisBoard
                      title="Worked Example: Binary Search"
                      description="Applying the five steps above to binary search:"
                      code={binarySearchCode}
                      fileName="binary_search.cpp"
                      id="binarySearch"
                      lines={[
                        { code: 'int low = 0, high = n - 1;', cost: <BigONotation inner="1" />, note: '(constant time)' },
                        { code: 'while (low <= high)', cost: <BigONotation inner="log n" />, note: '(range is halved)' },
                        { code: 'if (arr[mid] == target)', cost: <BigONotation inner="1" />, note: '(per pass)' },
                        { code: 'low = mid + 1 or high = mid - 1', cost: <BigONotation inner="log n" />, note: '(repeats per pass)' },
                      ]}
                      total={<BigONotation inner="log n" />}
                      simplification={<BigONotation inner="log n" />}
                      answer={<BigONotation inner="log n" />}
                      keyIdea="Halving the search range each time gives logarithmic growth."
                    />

                    <AnalysisBoard
                      title="Worked Example: Selection Sort"
                      description="Applying the five steps above to selection sort:"
                      code={selectionSortCode}
                      fileName="selection_sort.cpp"
                      id="selectionSort"
                      lines={[
                        { code: 'int minIdx = i;', cost: <BigONotation inner="1" />, note: '(constant time)' },
                        { code: 'for (int i = 0; i < n - 1; i++)', cost: <BigONotation inner={<MathN />} />, note: '(outer loop)' },
                        { code: 'for (int j = i + 1; j < n; j++)', cost: <BigONotation inner={<MathN />} />, note: '(per i)' },
                        { code: 'if (arr[j] < arr[minIdx])', cost: <BigONotation inner="1" />, note: '(executed n × n times)' },
                      ]}
                      total={<><BigONotation inner={<MathN />} /> × <BigONotation inner={<MathN />} /></>}
                      simplification={<BigONotation inner={<MathN2 />} />}
                      answer={<BigONotation inner={<MathN2 />} />}
                      keyIdea="Nested loops multiply their costs: n × n becomes n²."
                    />

                    <AnalysisBoard
                      title="Worked Example: Matrix Multiplication"
                      description="Applying the five steps above to matrix multiplication:"
                      code={matrixMultiplyCode}
                      fileName="matrix_multiply.cpp"
                      id="matrixMultiply"
                      lines={[
                        { code: 'for (int i = 0; i < n; i++)', cost: <BigONotation inner={<MathN />} />, note: '(first loop)' },
                        { code: 'for (int j = 0; j < n; j++)', cost: <BigONotation inner={<MathN />} />, note: '(per i)' },
                        { code: 'for (int k = 0; k < n; k++)', cost: <BigONotation inner={<MathN />} />, note: '(per i and j)' },
                        { code: 'c[i][j] += a[i][k] * b[k][j];', cost: <BigONotation inner="1" />, note: '(constant operation)' },
                      ]}
                      total={<><BigONotation inner={<MathN />} /> × <BigONotation inner={<MathN />} /> × <BigONotation inner={<MathN />} /></>}
                      simplification={<BigONotation inner={<><MathN /><sup>3</sup></>} />}
                      answer={<BigONotation inner={<><MathN /><sup>3</sup></>} />}
                      keyIdea="Three nested loops multiply to n³, so the algorithm is cubic."
                    />

                    <AnalysisBoard
                      title="Worked Example: Fibonacci (Naive Recursive)"
                      description="Applying the five steps above to naive recursive Fibonacci:"
                      code={fibonacciCode}
                      fileName="fibonacci.cpp"
                      id="fibonacci"
                      lines={[
                        { code: 'if (n <= 1) return n;', cost: <BigONotation inner="1" />, note: '(base case)' },
                        { code: 'fib(n - 1)', cost: <BigONotation inner={<MathN />} />, note: '(recursive branch)' },
                        { code: 'fib(n - 2)', cost: <BigONotation inner={<MathN />} />, note: '(second branch)' },
                        { code: 'return fib(n - 1) + fib(n - 2);', cost: <BigONotation inner="2ⁿ" />, note: '(branching call tree)' },
                      ]}
                      total={<BigONotation inner="2ⁿ" />}
                      simplification={<BigONotation inner="2ⁿ" />}
                      answer={<BigONotation inner="2ⁿ" />}
                      keyIdea="Two recursive calls branch repeatedly, causing exponential growth."
                    />
                  </div>
                )}
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
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4"><strong>Example:</strong> Bubble Sort</h4>
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