import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Search,
  SortAsc,
  ChartBar,
  Code,
  Terminal,
  GitBranch,
  Lightbulb,
  GraduationCap,
  Table,
  List,
  Copy,
  Check,
  Brain,
  RefreshCw,
  ChevronUp,
  BookOpen,
  X,
  Layers,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'searching', label: 'Searching' },
  { id: 'search-comparison', label: 'Search Comparison' },
  { id: 'sorting', label: 'Sorting' },
  { id: 'sorting-comparison', label: 'Sort Comparison' },
  { id: 'exam-tips', label: 'Exam Tips' },
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
        text: 'Binary search is one of the most efficient searching algorithms, but it requires the data to be sorted first.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a sorting algorithm, consider stability and whether the data is partially sorted – adaptive algorithms like Insertion Sort can be faster in practice.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Linear search is like looking for a book on an unsorted shelf; binary search is like flipping through a sorted dictionary.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t forget that binary search only works on sorted arrays. Applying it to unsorted data will produce incorrect results.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Binary search is one of the most efficient searching algorithms, but it requires the data to be sorted first.',
      },
      {
        title: 'Pro Tip',
        text: 'When choosing a sorting algorithm, consider stability and whether the data is partially sorted – adaptive algorithms like Insertion Sort can be faster in practice.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Linear search is like looking for a book on an unsorted shelf; binary search is like flipping through a sorted dictionary.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t forget that binary search only works on sorted arrays. Applying it to unsorted data will produce incorrect results.',
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
      'main'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Preprocessor directives
    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');

    // Known functions (like linearSearch, binarySearch)
    const functions = ['linearSearch', 'binarySearch'];
    const funcRegex = new RegExp(`\\b(${functions.join('|')})\\b`, 'g');
    escaped = escaped.replace(funcRegex, '<span class="text-[#DCDCAA]">$1</span>');

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
  const linearSearchCode = `#include <iostream>
using namespace std;

int linearSearch(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i; // Return the index of the target
        }
    }
    return -1; // Target not found
}

int main() {
    int arr[] = {2, 4, 6, 8, 10};
    int target = 6;
    int size = sizeof(arr) / sizeof(arr[0]);
    int result = linearSearch(arr, size, target);
    if (result != -1) {
        cout << "Element found at index: " << result << endl;
    } else {
        cout << "Element not found" << endl;
    }
    return 0;
}`;

  const binarySearchCode = `#include <iostream>
using namespace std;

int binarySearch(int arr[], int l, int r, int x) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == x) return m;
        if (arr[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
    int arr[] = {2, 3, 4, 10, 40};
    int x = 10;
    int n = sizeof(arr) / sizeof(arr[0]);
    int result = binarySearch(arr, 0, n - 1, x);
    if (result == -1) cout << "Element is not present in array" << endl;
    else cout << "Element is present at index " << result << endl;
    return 0;
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Search size={14} className="inline mr-1" /> SEARCHING & SORTING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Simply Easy Search & Sort
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the fundamentals of searching and sorting algorithms: linear
            search, binary search, bubble sort, selection sort, merge sort, and
            more. Understand their complexities and when to use each.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Search size={14} className="inline mr-1" /> Searching
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <SortAsc size={14} className="inline mr-1" /> Sorting
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
                placeholder="Search for an algorithm, complexity, or concept..."
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
                Introduction to Searching & Sorting
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold">Searching</span> is finding a specific element within a collection;
                    <span className="font-bold"> sorting</span> is arranging elements in a specific order.
                    Both are fundamental operations in computer science, with applications in data retrieval,
                    database systems, and algorithm design.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Searching is like finding a book in a library. If books are unsorted (linear search), you check
                  every shelf. If they are sorted alphabetically (binary search), you can skip large sections.
                  Sorting is like arranging the books so you can find them faster next time.
                </p>
              </div>
            </div>

            {/* ─── Section 2: Searching ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['searching'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Searching Algorithms
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Searching algorithms find a specific element within a data collection. The choice depends on
                whether the data is sorted and the size of the collection.
              </p>

              <div className="mt-4 space-y-6">
                {/* Linear Search */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Linear Search</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Sequentially examines each element until the target is found or the end is reached.
                    Works on unsorted data.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>Start from beginning, compare each element</li>
                    <li>If match found, return index; else continue</li>
                    <li>If end reached, return -1 (not found)</li>
                  </ul>
                  <div className="mt-3">
                    <CodeBlock code={linearSearchCode} title="linear_search.cpp" id="linearSearch" />
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>Time Complexity:</strong> Best O(1), Worst O(n), Average O(n/2)</p>
                    <p><strong>Space Complexity:</strong> O(1)</p>
                  </div>
                </div>

                {/* Binary Search */}
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Binary Search</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Works on sorted arrays by repeatedly dividing the search interval in half.
                    Much faster than linear search for large datasets.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <li>Find middle element, compare with target</li>
                    <li>If match found, return index</li>
                    <li>If middle {'>'} target, search left half; else right half</li>
                    <li>Repeat until found or interval empty</li>
                  </ul>
                  <div className="mt-3">
                    <CodeBlock code={binarySearchCode} title="binary_search.cpp" id="binarySearch" />
                  </div>
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    <p><strong>Time Complexity:</strong> O(log n) – best, worst, average</p>
                    <p><strong>Space Complexity:</strong> O(1) (iterative version)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 3: Search Comparison ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['search-comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Comparison of Searching Algorithms
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <Table
                  headers={["Feature", "Linear Search", "Binary Search"]}
                  rows={[
                    ["Time complexity (worst)", "O(n)", "O(log n)"],
                    ["Space complexity", "O(1)", "O(1)"],
                    ["Precondition", "None", "Sorted collection"],
                    ["Efficiency", "Less efficient for large collections", "Much more efficient for large sorted collections"],
                    ["Use cases", "Unsorted or small collections", "Large sorted collections"],
                  ]}
                  title="Searching Algorithms Comparison"
                />
              </div>
            </div>

            {/* ─── Section 4: Sorting ─────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['sorting'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Sorting Algorithms
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Sorting arranges elements in a specific order (ascending or descending). Different algorithms
                have different properties: in-place vs extra space, stable vs unstable, adaptive vs non-adaptive.
              </p>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Sorting Algorithm Properties</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>In‑Place:</strong> Sorts within original array, using O(1) extra space. Examples: Bubble, Selection, Insertion, Heap, Quick.</li>
                  <li><strong>Not In‑Place:</strong> Requires additional space (usually O(n)). Example: Merge Sort.</li>
                  <li><strong>Stable:</strong> Maintains relative order of equal elements. Examples: Bubble, Insertion, Merge.</li>
                  <li><strong>Unstable:</strong> Does not preserve relative order. Examples: Selection, Shell, Heap, Quick.</li>
                  <li><strong>Adaptive:</strong> Takes advantage of initial order to improve performance. Examples: Bubble, Insertion, Shell.</li>
                  <li><strong>Non‑Adaptive:</strong> Performs same operations regardless of input. Examples: Selection, Merge, Heap.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Bubble Sort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Repeatedly steps through list, swaps adjacent elements if out of order. Largest "bubble" to the end. O(n²) time, O(1) space, stable, adaptive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Selection Sort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Finds minimum in unsorted portion and swaps with first element. O(n²) time, O(1) space, unstable, non‑adaptive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Insertion Sort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Builds sorted array one element at a time by inserting each into correct position. O(n²) worst, O(n) best, O(1) space, stable, adaptive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Shell Sort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Improvement on Insertion Sort by comparing elements far apart, then reducing gap. O(n²) worst, O(n<sup>1.5</sup>) avg, O(1) space, unstable, adaptive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Merge Sort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Divide‑and‑conquer: recursively splits, sorts, merges. O(n log n) time, O(n) space, stable, non‑adaptive.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Heap Sort</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Uses binary heap; builds heap, extracts max and places at end. O(n log n) time, O(1) space, unstable, non‑adaptive.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 5: Sorting Comparison ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['sorting-comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Comparison of Sorting Algorithms
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <Table
                  headers={["Algorithm", "In‑place", "Stable", "Adaptive", "Time (worst)", "Time (avg)", "Time (best)", "Space"]}
                  rows={[
                    ["Bubble Sort", "Yes", "Yes", "Yes", "O(n²)", "O(n²)", "O(n)", "O(1)"],
                    ["Selection Sort", "Yes", "No", "No", "O(n²)", "O(n²)", "O(n²)", "O(1)"],
                    ["Insertion Sort", "Yes", "Yes", "Yes", "O(n²)", "O(n²)", "O(n)", "O(1)"],
                    ["Shell Sort", "Yes", "No", "Yes", "O(n²)", "O(n<sup>1.5</sup>)", "O(n)", "O(1)"],
                    ["Merge Sort", "No", "Yes", "No", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)"],
                    ["Heap Sort", "Yes", "No", "No", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)"],
                  ]}
                  title="Sorting Algorithms Comparison"
                />
              </div>
            </div>

            {/* ─── Section 6: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Searching</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Linear Search:</strong> O(n), unsorted, simple</li>
                    <li><strong>Binary Search:</strong> O(log n), requires sorted array</li>
                    <li><strong>Precondition:</strong> Binary search needs sorted data</li>
                    <li><strong>Space:</strong> Both O(1) iterative</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Sorting (O(n²) algorithms)</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Bubble:</strong> stable, adaptive, O(n) best</li>
                    <li><strong>Selection:</strong> unstable, non‑adaptive, O(n²) always</li>
                    <li><strong>Insertion:</strong> stable, adaptive, O(n) best</li>
                    <li><strong>Shell:</strong> unstable, adaptive, O(n<sup>1.5</sup>) avg</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Sorting (O(n log n) algorithms)</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Merge:</strong> stable, not in‑place, O(n) space</li>
                    <li><strong>Heap:</strong> unstable, in‑place, O(1) space</li>
                    <li><strong>Quick:</strong> average O(n log n), in‑place, unstable</li>
                    <li>Choose based on stability, space, and data size</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Compare linear and binary search" or "Explain the properties of stable and in‑place sorting"
                      are common questions. Know the trade‑offs: time vs. space, stability, and adaptiveness.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Search it. Sort it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Search & Sort Insight
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
                  <span>Searching Algorithms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Sorting Algorithms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Sorting is often a prerequisite for efficient searching. Choose algorithms based on data size,
                initial order, stability requirements, and memory constraints. Practice implementing them to
                truly understand their behaviour.
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
                <strong className="text-white">Searching</strong> finds an element in a collection – linear (O(n))
                for unsorted data, binary (O(log n)) for sorted data.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Sorting</strong> arranges elements – algorithms differ in time/space
                complexity, stability, and adaptiveness.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">In‑place vs not in‑place</strong> affects memory usage; stable vs
                unstable affects relative order of equal elements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Choosing the right algorithm</strong> depends on data size, initial
                order, and resource constraints – there is no one‑size‑fits‑all.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> requires understanding trade‑offs and being
                able to compare algorithms by their properties.
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
            Sidemann Academic Registry • Simply Easy Search & Sort 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;