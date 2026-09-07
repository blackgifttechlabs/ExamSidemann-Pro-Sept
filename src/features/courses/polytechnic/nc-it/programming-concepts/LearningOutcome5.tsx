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
  { id: 'data-structures', label: 'Data Structures' },
  { id: 'arrays', label: 'Arrays' },
  { id: 'linked-lists', label: 'Linked Lists' },
  { id: 'stacks-queues', label: 'Stacks & Queues' },
  { id: 'trees-graphs', label: 'Trees & Graphs' },
  { id: 'file-structures', label: 'File Structures' },
  { id: 'file-operations', label: 'File Operations' },
  { id: 'exam-tips', label: 'Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'Data structures are specialized formats for organizing, processing, and storing data efficiently.',
      },
      {
        title: 'Pro Tip',
        text: 'Choose the right data structure for your problem – arrays for fast access, linked lists for dynamic size, trees for hierarchical data.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "FIFO" for queues (First In, First Out) and "LIFO" for stacks (Last In, First Out).',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse file structures with data structures. File structures organize data on disk; data structures organize data in memory.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Data structures are specialized formats for organizing, processing, and storing data efficiently.',
      },
      {
        title: 'Pro Tip',
        text: 'Choose the right data structure for your problem – arrays for fast access, linked lists for dynamic size, trees for hierarchical data.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "FIFO" for queues (First In, First Out) and "LIFO" for stacks (Last In, First Out).',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse file structures with data structures. File structures organize data on disk; data structures organize data in memory.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Data &amp; File Structures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master essential data structures (arrays, linked lists, stacks,
            queues, trees, graphs) and file structures – the foundation for
            efficient data organization and storage.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> Data Structures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDrive size={14} className="inline mr-1" /> File Structures
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
                placeholder="Search for a structure, operation, or concept..."
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
                Introduction to Data &amp; File Structures
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Data structures and file structures are the backbone of
                    efficient programming. Data structures organize data in
                    memory for fast access and manipulation. File structures
                    organize data on persistent storage (disks) for long-term
                    retention. This learning outcome covers both.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Database size={14} /> Data Structures
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organize data in memory (RAM). Examples: arrays, linked lists, stacks, queues, trees, graphs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <HardDrive size={14} /> File Structures
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organize data on disk (persistent storage). Examples: text files, binary files, sequential files, random-access files.</p>
                </div>
              </div>
            </div>

            {/* Data Structures Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['data-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Structures Overview
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">data structure</span> is a specialized format for organizing, processing, retrieving, and storing data. Choosing the right data structure is critical for program performance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Linear Data Structures</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Arrays</span> – fixed size, contiguous memory</li>
                    <li><span className="font-bold">Linked Lists</span> – dynamic size, non-contiguous</li>
                    <li><span className="font-bold">Stacks</span> – LIFO (Last In, First Out)</li>
                    <li><span className="font-bold">Queues</span> – FIFO (First In, First Out)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Non-Linear Data Structures</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Trees</span> – hierarchical, parent-child relationships</li>
                    <li><span className="font-bold">Graphs</span> – networks of nodes and edges</li>
                    <li><span className="font-bold">Hash Tables</span> – key-value pairs</li>
                    <li><span className="font-bold">Heaps</span> – priority queues</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Why Data Structures Matter</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold">Efficiency</span> – correct structure reduces time and memory usage</li>
                  <li><span className="font-bold">Organization</span> – makes code cleaner and more maintainable</li>
                  <li><span className="font-bold">Scalability</span> – enables handling of large datasets</li>
                  <li><span className="font-bold">Abstraction</span> – hides implementation complexity</li>
                </ul>
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
                Arrays
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An <span className="font-bold">array</span> is a collection of elements of the same data type, stored in contiguous memory locations. Elements are accessed using an index.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Fast random access – O(1) time</li>
                    <li>Cache-friendly – contiguous memory</li>
                    <li>Simple to use</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Fixed size – cannot grow dynamically</li>
                    <li>Insertion/deletion is slow – O(n)</li>
                    <li>Wasted memory if underutilized</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="arrays.cpp" code={`#include <iostream>
using namespace std;

int main() {
  // Declaration and initialization
  int numbers[5] = {10, 20, 30, 40, 50};
  
  // Accessing elements
  cout << "First element: " << numbers[0] << endl;
  cout << "Third element: " << numbers[2] << endl;
  
  // Modifying elements
  numbers[4] = 100;
  
  // Iterating through array
  for (int i = 0; i < 5; i++) {
    cout << "numbers[" << i << "] = " << numbers[i] << endl;
  }
  
  // Multi-dimensional array (2D)
  int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
  cout << "Matrix[1][2] = " << matrix[1][2] << endl;
  
  return 0;
}`} />
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 When to Use Arrays</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Use arrays when you know the maximum size in advance, need fast random access, and the data is of the same type.</p>
              </div>
            </div>

            {/* Linked Lists */}
            <div
              ref={(el) => {
                sectionRefs.current['linked-lists'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Linked Lists
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A <span className="font-bold">linked list</span> is a linear data structure where each element (node) contains a data field and a pointer/reference to the next node in the sequence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Dynamic size – grows/shrinks as needed</li>
                    <li>Fast insertion/deletion – O(1) at head</li>
                    <li>Memory efficient – no pre-allocation</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>No random access – O(n) to access an element</li>
                    <li>Extra memory for pointers</li>
                    <li>Not cache-friendly</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Singly Linked List</span><br />Each node points to the next node.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Doubly Linked List</span><br />Each node points to next and previous.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Circular Linked List</span><br />Last node points back to head.
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="linked_list.cpp" code={`#include <iostream>
using namespace std;

struct Node {
  int data;
  Node* next;
};

class LinkedList {
private:
  Node* head;
public:
  LinkedList() : head(nullptr) {}
  
  void insertAtHead(int value) {
    Node* newNode = new Node{value, head};
    head = newNode;
  }
  
  void display() {
    Node* current = head;
    while (current != nullptr) {
      cout << current->data << " -> ";
      current = current->next;
    }
    cout << "null" << endl;
  }
};

int main() {
  LinkedList list;
  list.insertAtHead(30);
  list.insertAtHead(20);
  list.insertAtHead(10);
  list.display(); // 10 -> 20 -> 30 -> null
  return 0;
}`} />
              </div>
            </div>

            {/* Stacks and Queues */}
            <div
              ref={(el) => {
                sectionRefs.current['stacks-queues'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Stacks &amp; Queues
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Stacks (LIFO)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Last In, First Out – like a stack of plates.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Push</span> – add element to top</li>
                    <li><span className="font-bold">Pop</span> – remove element from top</li>
                    <li><span className="font-bold">Peek/Top</span> – view top element</li>
                    <li>Applications: undo/redo, function call stack, expression evaluation</li>
                  </ul>
                  <VSCodeTyping fileName="stack.cpp" code={`#include <iostream>
#include <stack>
using namespace std;

int main() {
  stack<int> s;
  s.push(10);
  s.push(20);
  s.push(30);
  cout << "Top: " << s.top() << endl; // 30
  s.pop();
  cout << "Top after pop: " << s.top() << endl; // 20
  return 0;
}`} />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Queues (FIFO)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">First In, First Out – like a queue at a bank.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Enqueue</span> – add element to back</li>
                    <li><span className="font-bold">Dequeue</span> – remove element from front</li>
                    <li><span className="font-bold">Front</span> – view front element</li>
                    <li>Applications: print spooling, task scheduling, BFS</li>
                  </ul>
                  <VSCodeTyping fileName="queue.cpp" code={`#include <iostream>
#include <queue>
using namespace std;

int main() {
  queue<int> q;
  q.push(10);
  q.push(20);
  q.push(30);
  cout << "Front: " << q.front() << endl; // 10
  q.pop();
  cout << "Front after pop: " << q.front() << endl; // 20
  return 0;
}`} />
                </div>
              </div>
            </div>

            {/* Trees and Graphs */}
            <div
              ref={(el) => {
                sectionRefs.current['trees-graphs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Trees &amp; Graphs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Trees</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A non-linear data structure with a hierarchical structure – each node has a parent and zero or more children.</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Root</span> – topmost node</li>
                    <li><span className="font-bold">Leaf</span> – node with no children</li>
                    <li><span className="font-bold">Binary Tree</span> – each node has at most 2 children</li>
                    <li><span className="font-bold">BST</span> – left child &lt; parent &lt; right child</li>
                    <li>Applications: file systems, HTML DOM, decision trees</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Graphs</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A non-linear data structure consisting of nodes (vertices) and edges (connections).</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><span className="font-bold">Directed</span> – edges have direction</li>
                    <li><span className="font-bold">Undirected</span> – edges have no direction</li>
                    <li><span className="font-bold">Weighted</span> – edges have values/costs</li>
                    <li>Applications: social networks, maps/navigation, network routing</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="bst.cpp" code={`#include <iostream>
using namespace std;

struct Node {
  int data;
  Node* left;
  Node* right;
  Node(int val) : data(val), left(nullptr), right(nullptr) {}
};

class BST {
private:
  Node* root;
  
  Node* insert(Node* node, int value) {
    if (node == nullptr) return new Node(value);
    if (value < node->data) node->left = insert(node->left, value);
    else node->right = insert(node->right, value);
    return node;
  }
  
public:
  BST() : root(nullptr) {}
  
  void insert(int value) {
    root = insert(root, value);
  }
};

int main() {
  BST tree;
  tree.insert(50);
  tree.insert(30);
  tree.insert(70);
  tree.insert(20);
  tree.insert(40);
  tree.insert(60);
  tree.insert(80);
  return 0;
}`} />
              </div>
            </div>

            {/* File Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['file-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                File Structures
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold">File structures</span> define how data is organized and stored on persistent storage devices (disks, SSDs). They enable long-term data retention and retrieval.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Text Files</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Human-readable ASCII/Unicode characters</li>
                    <li>Lines separated by newline characters</li>
                    <li>Used for: configuration, logs, source code</li>
                    <li>Easy to edit and view</li>
                    <li>Larger file size than binary</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Binary Files</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Raw binary data (bytes)</li>
                    <li>Not human-readable</li>
                    <li>Used for: images, audio, video, compiled code</li>
                    <li>More compact and efficient</li>
                    <li>Faster read/write operations</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Sequential Files</span><br />Data stored in order, accessed sequentially.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Random-Access Files</span><br />Direct access to any record using an index/key.
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-bold">Indexed Files</span><br />Uses an index to speed up record retrieval.
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Choosing a File Structure</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold">Text files</span> – for human-readable data, configuration, logs</li>
                  <li><span className="font-bold">Binary files</span> – for large datasets, performance-critical applications</li>
                  <li><span className="font-bold">Sequential</span> – when data is processed in order</li>
                  <li><span className="font-bold">Random-access</span> – when specific records need quick retrieval</li>
                </ul>
              </div>
            </div>

            {/* File Operations */}
            <div
              ref={(el) => {
                sectionRefs.current['file-operations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                File Operations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Opening a File</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Use <code>fopen()</code> in C or <code>ifstream</code>/<code>ofstream</code> in C++.</p>
                  <div className="bg-slate-900 text-green-400 p-2 rounded font-mono text-xs mt-1">
                    FILE* fp = fopen("data.txt", "r");
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Reading from a File</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Read data using <code>fscanf()</code>, <code>fgets()</code>, or <code>getline()</code>.</p>
                  <div className="bg-slate-900 text-green-400 p-2 rounded font-mono text-xs mt-1">
                    fscanf(fp, "%d", &amp;num);
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Writing to a File</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Write data using <code>fprintf()</code> or <code>&lt;&lt;</code> operator.</p>
                  <div className="bg-slate-900 text-green-400 p-2 rounded font-mono text-xs mt-1">
                    fprintf(fp, "%d\n", num);
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Closing a File</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Always close files to free resources.</p>
                  <div className="bg-slate-900 text-green-400 p-2 rounded font-mono text-xs mt-1">
                    fclose(fp);
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <VSCodeTyping fileName="file_operations.cpp" code={`#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
  // Writing to a file
  ofstream outFile("example.txt");
  if (outFile.is_open()) {
    outFile << "Hello, file!" << endl;
    outFile << "Line 2" << endl;
    outFile.close();
    cout << "File written successfully." << endl;
  }
  
  // Reading from a file
  ifstream inFile("example.txt");
  if (inFile.is_open()) {
    string line;
    while (getline(inFile, line)) {
      cout << line << endl;
    }
    inFile.close();
  }
  
  // Appending to a file
  ofstream appendFile("example.txt", ios::app);
  if (appendFile.is_open()) {
    appendFile << "Appended line" << endl;
    appendFile.close();
  }
  
  return 0;
}`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Common File Modes</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><code>"r"</code> – read only</li>
                    <li><code>"w"</code> – write (overwrites)</li>
                    <li><code>"a"</code> – append</li>
                    <li><code>"r+"</code> – read and write</li>
                    <li><code>"w+"</code> – read and write (overwrites)</li>
                    <li><code>"a+"</code> – read and append</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Common File Errors</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>File not found</li>
                    <li>Permission denied</li>
                    <li>Disk full</li>
                    <li>File already open</li>
                    <li>Invalid file format</li>
                  </ul>
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know the Basic Data Structures</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Understand arrays, linked lists, stacks, queues, trees, and graphs – their operations, time complexities, and use cases.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Understand LIFO vs FIFO</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Stacks are LIFO (Last In, First Out); Queues are FIFO (First In, First Out). Know real-world examples for each.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Compare Data Structures</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to compare arrays vs linked lists, and trees vs graphs – advantages and disadvantages.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 File Operations</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know the difference between text and binary files, and the standard file operations: open, read, write, close.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Practice Code Writing</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be ready to write code for basic operations on arrays, linked lists, stacks, queues, and file I/O.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Structure it. Store it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Structure Insight
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
                  <span>Data Structures</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>File Types</span>
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
                Choosing the right data structure or file structure is critical
                for program efficiency. Understand the trade-offs and apply the
                best structure for each problem.
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
                <strong className="text-white">Data structures</strong> organize data in memory – arrays (fixed), linked lists (dynamic), stacks (LIFO), queues (FIFO), trees (hierarchical), graphs (networks).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Arrays</strong> – fast O(1) access, fixed size. <strong>Linked Lists</strong> – dynamic size, O(n) access.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Trees</strong> – hierarchical data (file systems, HTML). <strong>Graphs</strong> – networks (social, maps, routing).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File structures</strong> – text files (human-readable), binary files (compact). Sequential, random-access, and indexed files.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File operations</strong> – open, read, write, close. Always check for errors and close files properly.
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

export default LearningOutcome5;
