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
  Network,
  FolderTree,
  HardDrive,
  Server,
  Folder,
  File,
  FolderOpen,
  Table,
  Grid,
  Pointer,
  MemoryStick,
  ArrowRight as ArrowRightIcon,
  Save,
  FileText as FileTextIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// VS Code Typing Animation Component
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
  { id: 'arrays', label: 'Arrays' },
  { id: 'multidimensional-arrays', label: 'Multi-D Arrays' },
  { id: 'pointers', label: 'Pointers' },
  { id: 'pointer-arithmetic', label: 'Pointer Arithmetic' },
  { id: 'array-pointer-relationship', label: 'Arrays & Pointers' },
  { id: 'dynamic-memory', label: 'Dynamic Memory' },
  { id: 'file-handling', label: 'File Handling' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome6: React.FC = () => {
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
        text: 'An array name is actually a pointer to the first element of the array.',
      },
      {
        title: 'Pro Tip',
        text: 'Pointers allow you to directly manipulate memory addresses – powerful but requires careful handling to avoid errors.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: a pointer holds an address; dereferencing gives the value at that address.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse `int* p` with `int *p` – both are valid but mean the same: p is a pointer to an int.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'An array name is actually a pointer to the first element of the array.',
      },
      {
        title: 'Pro Tip',
        text: 'Pointers allow you to directly manipulate memory addresses – powerful but requires careful handling to avoid errors.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: a pointer holds an address; dereferencing gives the value at that address.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse `int* p` with `int *p` – both are valid but mean the same: p is a pointer to an int.',
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
                ? 'bg-teal-600 text-white shadow-md shadow-teal-200 dark:shadow-teal-900/30'
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Arrays &amp; Pointers
            </span>
          </h1>
          <p className="text-lg text-teal-100 max-w-2xl leading-relaxed">
            Master arrays (including multi-dimensional), pointers, pointer
            arithmetic, the relationship between arrays and pointers, dynamic
            memory allocation, and file handling in C++.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-teal-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Binary size={14} className="inline mr-1" /> Arrays
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Pointer size={14} className="inline mr-1" /> Pointers
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-teal-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, syntax, or function..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-teal-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-teal-200" />
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
                Introduction to Arrays &amp; Pointers
              </h2>

              <div className="p-4 sm:p-5 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Arrays and pointers are fundamental building blocks in C/C++.
                    Arrays allow you to store collections of data, while pointers
                    give you direct access to memory addresses. Together, they
                    form the basis for dynamic data structures and efficient
                    memory management.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Binary size={14} /> Arrays
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contiguous collection of elements of the same type. Fixed size (static) or dynamic (heap).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Pointer size={14} /> Pointers
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Variables that store memory addresses. Enable dynamic memory, efficient parameter passing, and data structure implementation.</p>
                </div>
              </div>
            </div>

            {/* Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['arrays'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Arrays in C++
              </h2>

              <h3 className="text-lg font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tight mt-2">
                1 Declaration and Initialization
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An array is a collection of elements of the same data type stored in contiguous memory locations.
              </p>
              <div className="overflow-x-auto mt-2">
                <VSCodeTyping fileName="array_declaration.cpp" code={`#include <iostream>
using namespace std;

int main() {
  // Declaration without initialization
  int numbers[5];
  
  // Declaration with initialization
  int scores[3] = {90, 85, 78};
  
  // Partial initialization (remaining elements set to 0)
  int values[5] = {10, 20};
  
  // Size inferred from initializer list
  int marks[] = {60, 70, 80, 90};
  
  return 0;
}`} />
              </div>

              <h3 className="text-lg font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tight mt-6">
                2 Accessing and Modifying Elements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Elements are accessed using an index starting from 0.</li>
                <li>Modify elements by assigning a new value to the index.</li>
                <li>Out-of-bounds access leads to undefined behavior (buffer overflow).</li>
              </ul>
              <VSCodeTyping fileName="array_access.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int arr[4] = {5, 10, 15, 20};
  
  // Accessing
  cout << "First element: " << arr[0] << endl;
  cout << "Third element: " << arr[2] << endl;
  
  // Modifying
  arr[1] = 100;
  
  // Looping through array
  for (int i = 0; i < 4; i++) {
    cout << "arr[" << i << "] = " << arr[i] << endl;
  }
  
  return 0;
}`} />
            </div>

            {/* Multi-Dimensional Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['multidimensional-arrays'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Multi-Dimensional Arrays
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Arrays can have more than one dimension. The most common is a 2D array (matrix).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">2D Array Declaration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {'int matrix[3][4]; // 3 rows, 4 columns'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Initialization</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {'int matrix[2][3] = {{1,2,3}, {4,5,6}};'}
                  </p>
                </div>
              </div>

              <VSCodeTyping fileName="2d_array.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int matrix[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12}
  };
  
  // Accessing an element
  cout << "matrix[1][2] = " << matrix[1][2] << endl; // 7
  
  // Looping through 2D array
  for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 4; j++) {
      cout << matrix[i][j] << " ";
    }
    cout << endl;
  }
  
  return 0;
}`} />
            </div>

            {/* Pointers */}
            <div
              ref={(el) => {
                sectionRefs.current['pointers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Pointers
              </h2>

              <h3 className="text-lg font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tight mt-2">
                1 What is a Pointer?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A pointer is a variable that stores the memory address of another variable. It "points" to the location in memory where data is stored.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Declaration</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">int* ptr;</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Pointer to an integer.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Address-of Operator</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">&amp;variable</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Gets the address of a variable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Dereferencing</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">*ptr</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Accesses the value at the address stored in ptr.</p>
                </div>
              </div>

              <VSCodeTyping fileName="pointers_basics.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int num = 42;
  int* ptr = &num;  // ptr stores the address of num
  
  cout << "Value of num: " << num << endl;
  cout << "Address of num: " << &num << endl;
  cout << "Value stored in ptr: " << ptr << endl;
  cout << "Value pointed to by ptr: " << *ptr << endl;
  
  // Changing value through pointer
  *ptr = 100;
  cout << "New value of num: " << num << endl;
  
  return 0;
}`} />
            </div>

            {/* Pointer Arithmetic */}
            <div
              ref={(el) => {
                sectionRefs.current['pointer-arithmetic'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Pointer Arithmetic
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Pointers can be incremented, decremented, and compared. The arithmetic is scaled by the size of the data type the pointer points to.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Increment</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">ptr++;</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Moves to the next element of the type.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Decrement</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">ptr--;</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Moves to the previous element.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Difference</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">ptr2 - ptr1</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Number of elements between two pointers.</p>
                </div>
              </div>

              <VSCodeTyping fileName="pointer_arithmetic.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int arr[] = {10, 20, 30, 40, 50};
  int* ptr = arr; // points to first element
  
  cout << "arr[0] = " << *ptr << endl;
  ptr++; // move to next element
  cout << "arr[1] = " << *ptr << endl;
  ptr += 2; // move two elements forward
  cout << "arr[3] = " << *ptr << endl;
  
  // Looping using pointer
  for (int* p = arr; p < arr + 5; p++) {
    cout << *p << " ";
  }
  cout << endl;
  
  return 0;
}`} />
            </div>

            {/* Arrays and Pointers Relationship */}
            <div
              ref={(el) => {
                sectionRefs.current['array-pointer-relationship'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Arrays and Pointers Relationship
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                In C++, an array name is actually a pointer to the first element. This relationship enables pointer arithmetic on arrays.
              </p>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Key Insight</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">The array name <code>arr</code> is equivalent to <code>&amp;arr[0]</code>.</p>
              </div>

              <VSCodeTyping fileName="array_pointer.cpp" code={`#include <iostream>
using namespace std;

int main() {
  int arr[5] = {1, 2, 3, 4, 5};
  
  // Array name is a pointer to first element
  int* ptr = arr; // same as &arr[0]
  
  cout << "arr[0] = " << *ptr << endl;
  cout << "arr[2] = " << *(ptr + 2) << endl;
  
  // Accessing array elements using pointer arithmetic
  for (int i = 0; i < 5; i++) {
    cout << *(arr + i) << " "; // arr[i] is equivalent
  }
  cout << endl;
  
  // Demonstrating equivalence
  cout << "arr[3] = " << arr[3] << endl;
  cout << "*(arr+3) = " << *(arr+3) << endl;
  cout << "ptr[3] = " << ptr[3] << endl; // pointer can be indexed like array
  
  return 0;
}`} />
            </div>

            {/* Dynamic Memory Allocation */}
            <div
              ref={(el) => {
                sectionRefs.current['dynamic-memory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Dynamic Memory Allocation
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Dynamic memory allows you to allocate memory at runtime using <code>new</code> and release it with <code>delete</code>.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Single Variable</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">int* p = new int;</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Allocates memory for one int.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Array</h4>
                  <code className="text-sm text-slate-600 dark:text-slate-400">int* arr = new int[10];</code>
                  <p className="text-sm text-slate-500 dark:text-slate-500">Allocates memory for an array of 10 ints.</p>
                </div>
              </div>

              <VSCodeTyping fileName="dynamic_memory.cpp" code={`#include <iostream>
using namespace std;

int main() {
  // Single variable
  int* p = new int;
  *p = 42;
  cout << "Value: " << *p << endl;
  delete p;
  
  // Dynamic array
  int size;
  cout << "Enter array size: ";
  cin >> size;
  int* arr = new int[size];
  
  for (int i = 0; i < size; i++) {
    arr[i] = i * 10;
  }
  
  for (int i = 0; i < size; i++) {
    cout << "arr[" << i << "] = " << arr[i] << endl;
  }
  
  delete[] arr; // free the memory
  
  return 0;
}`} />
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">⚠️ Important</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>Always <code>delete</code> or <code>delete[]</code> memory allocated with <code>new</code>.</li>
                  <li>Failure to free memory leads to memory leaks.</li>
                  <li>Using freed memory leads to undefined behavior.</li>
                </ul>
              </div>
            </div>

            {/* File Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['file-handling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                File Handling
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                File handling allows programs to read from and write to external files. This is essential for data persistence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Save size={14} /> Writing to a File
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Include <code>&lt;fstream&gt;</code>.</li>
                    <li>Create an <code>ofstream</code> object.</li>
                    <li>Open file with <code>open()</code> or constructor.</li>
                    <li>Use <code>&lt;&lt;</code> to write data.</li>
                    <li>Close file with <code>close()</code>.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <FileTextIcon size={14} /> Reading from a File
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Include <code>&lt;fstream&gt;</code>.</li>
                    <li>Create an <code>ifstream</code> object.</li>
                    <li>Open file with <code>open()</code> or constructor.</li>
                    <li>Use <code>&gt;&gt;</code> or <code>getline()</code> to read.</li>
                    <li>Check if file opened successfully.</li>
                    <li>Close file.</li>
                  </ul>
                </div>
              </div>

              <VSCodeTyping fileName="file_handling.cpp" code={`#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // Writing to a file
  ofstream outFile("data.txt");
  if (outFile.is_open()) {
    outFile << "Hello, file!" << endl;
    outFile << "Line 2" << endl;
    outFile.close();
    cout << "File written successfully." << endl;
  } else {
    cout << "Unable to open file for writing." << endl;
  }
  
  // Reading from a file
  ifstream inFile("data.txt");
  if (inFile.is_open()) {
    string line;
    while (getline(inFile, line)) {
      cout << "Read: " << line << endl;
    }
    inFile.close();
  } else {
    cout << "Unable to open file for reading." << endl;
  }
  
  return 0;
}`} />
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
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">📌 Understand Array Indexing</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Remember arrays start at index 0. The last element is at index size-1. Out-of-bounds is a common bug.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">📌 Master Pointer Syntax</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the difference between <code>int* p</code> (pointer), <code>&amp;var</code> (address), and <code>*p</code> (dereference).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">📌 Relationship Between Arrays and Pointers</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">An array name decays to a pointer to the first element. Use pointer arithmetic to traverse arrays.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">📌 Dynamic Memory</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Use <code>new</code> and <code>delete</code> for single variables, <code>new[]</code> and <code>delete[]</code> for arrays. Always free memory to avoid leaks.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">📌 File I/O Operations</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know how to open, read, write, and close files. Check if the file opened successfully.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Point to it. Store it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-teal-100 dark:border-teal-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  💡 Pointer Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-teal-500 dark:text-teal-400" />
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
                  <span className="font-bold text-teal-600 dark:text-teal-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Array Types</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">2 (1D, 2D)</span>
                </li>
                <li className="flex justify-between">
                  <span>Pointer Operators</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Arrays and pointers are closely related. Mastering them unlocks
                dynamic data structures and efficient memory management – essential
                for systems programming and performance-critical applications.
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
          className="w-12 h-12 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-xl shadow-lg hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-teal-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Arrays</strong> – fixed-size collections of same-type elements; accessed via index.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Multi-dimensional arrays</strong> – matrices and higher dimensions (e.g., <code>int matrix[3][4]</code>).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pointers</strong> – store memory addresses; use <code>&amp;</code> for address, <code>*</code> for dereferencing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Pointer arithmetic</strong> – increment, decrement, and difference are scaled by element size.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Arrays and pointers</strong> – an array name is a pointer to the first element; <code>arr[i]</code> equals <code>*(arr+i)</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dynamic memory</strong> – use <code>new</code>/<code>delete</code> for runtime allocation; always free memory.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-300 font-bold">•</span>
              <span>
                <strong className="text-white">File handling</strong> – <code>ifstream</code> for reading, <code>ofstream</code> for writing; always check if files are opened.
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

export default LearningOutcome6;
