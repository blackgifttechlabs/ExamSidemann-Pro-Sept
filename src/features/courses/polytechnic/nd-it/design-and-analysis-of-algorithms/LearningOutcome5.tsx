import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Layers,
  ArrowUp,
  ArrowDown,
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
  Search,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'stack', label: 'Stack' },
  { id: 'stack-ops', label: 'Stack Ops' },
  { id: 'stack-impl', label: 'Stack Impl' },
  { id: 'stack-apps', label: 'Stack Apps' },
  { id: 'queue', label: 'Queue' },
  { id: 'queue-ops', label: 'Queue Ops' },
  { id: 'queue-impl', label: 'Queue Impl' },
  { id: 'circular', label: 'Circular Queue' },
  { id: 'priority', label: 'Priority Queue' },
  { id: 'queue-apps', label: 'Queue Apps' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'exam-tips', label: 'Exam Tips' },
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
        text: 'The undo/redo feature in most applications is implemented using two stacks – one for undo, one for redo.',
      },
      {
        title: 'Pro Tip',
        text: 'Use a queue when you need to process elements in the order they arrive – like task scheduling or breadth‑first search.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: Stack = LIFO (Last In First Out) – like a stack of plates. Queue = FIFO (First In First Out) – like a queue of people.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse circular queue with priority queue – they serve different purposes: circular for space efficiency, priority for ordering by priority.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The undo/redo feature in most applications is implemented using two stacks – one for undo, one for redo.',
      },
      {
        title: 'Pro Tip',
        text: 'Use a queue when you need to process elements in the order they arrive – like task scheduling or breadth‑first search.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: Stack = LIFO (Last In First Out) – like a stack of plates. Queue = FIFO (First In First Out) – like a queue of people.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse circular queue with priority queue – they serve different purposes: circular for space efficiency, priority for ordering by priority.',
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
      'define', 'endl', 'cout', 'cin', 'main', 'bool', 'const', 'new', 'delete',
      'virtual', 'override', 'final', 'template', 'typename', 'auto', 'static',
      'constexpr', 'try', 'catch', 'throw', 'std', 'vector', 'queue', 'cerr'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string', 'vector'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Preprocessor
    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');

    // Known functions (like push, pop, etc.)
    const functions = [
      'push', 'pop', 'peek', 'isEmpty', 'isFull', 'size', 'enqueue', 'dequeue',
      'exampleStdQueue', 'exampleFixedSizeQueue'
    ];
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
  const stackCode = `// Stack implementation using an array
#include <iostream>
#include <vector> // For dynamic array resizing (optional, but good practice)

class StackArray {
private:
    int top;
    std::vector<int> arr; // Dynamic array (more flexible)
    int maxSize; // Maximum size of the stack

public:
    StackArray(int size = 100) : top(-1), maxSize(size) {}

    bool isEmpty() const {
        return top == -1;
    }

    bool isFull() const {
        return top == maxSize - 1;
    }

    void push(int value) {
        if (isFull()) {
            std::cerr << "Stack Overflow!" << std::endl;
            return;
        }
        arr.push_back(value);
        top++;
        std::cout << value << " pushed onto the stack" << std::endl;
    }

    int pop() {
        if (isEmpty()) {
            std::cerr << "Stack Underflow!" << std::endl;
            return -1;
        }
        int poppedValue = arr[top];
        arr.pop_back();
        top--;
        return poppedValue;
    }

    int peek() const {
        if (isEmpty()) {
            std::cerr << "Stack is Empty!" << std::endl;
            return -1;
        }
        return arr[top];
    }

    int size() const {
        return top + 1;
    }
};

// Stack implementation using a linked list
class Node {
public:
    int data;
    Node* next;

    Node(int value) : data(value), next(nullptr) {}
};

class StackLinkedList {
private:
    Node* head;

public:
    StackLinkedList() : head(nullptr) {}

    bool isEmpty() const {
        return head == nullptr;
    }

    void push(int value) {
        Node* newNode = new Node(value);
        newNode->next = head;
        head = newNode;
        std::cout << value << " pushed onto the stack" << std::endl;
    }

    int pop() {
        if (isEmpty()) {
            std::cerr << "Stack Underflow!" << std::endl;
            return -1;
        }
        int poppedValue = head->data;
        Node* temp = head;
        head = head->next;
        delete temp;
        return poppedValue;
    }

    int peek() const {
        if (isEmpty()) {
            std::cerr << "Stack is Empty!" << std::endl;
            return -1;
        }
        return head->data;
    }

    int size() const {
        int count = 0;
        Node* current = head;
        while(current != nullptr) {
            count++;
            current = current->next;
        }
        return count;
    }
};

int main() {
    StackArray stackArr;
    stackArr.push(10);
    stackArr.push(20);
    std::cout << "Top element: " << stackArr.peek() << std::endl;
    std::cout << "Popped element: " << stackArr.pop() << std::endl;
    std::cout << "Stack size: " << stackArr.size() << std::endl;

    StackLinkedList stackList;
    stackList.push(100);
    stackList.push(200);
    std::cout << "Top element: " << stackList.peek() << std::endl;
    std::cout << "Popped element: " << stackList.pop() << std::endl;
    std::cout << "Stack size: " << stackList.size() << std::endl;

    return 0;
}`;

  const queueCode = `#include <iostream>
#include <queue>   // For using the standard queue
#include <vector>  // For implementing a fixed-size queue

// Example using std::queue (dynamic size)
void exampleStdQueue() {
    std::queue<int> q;

    // Enqueue
    q.push(10);
    q.push(20);
    q.push(30);

    // Peek
    std::cout << "Front element: " << q.front() << std::endl; // Output: 10

    // Dequeue
    std::cout << "Dequeued element: " << q.front() << std::endl;
    q.pop();

    // IsEmpty
    if (q.empty()) {
        std::cout << "Queue is empty" << std::endl;
    } else {
        std::cout << "Queue is not empty" << std::endl; // Output: Queue is not empty
    }

    // Size
    std::cout << "Queue size: " << q.size() << std::endl; // Output: 2
}

// Example of a fixed-size circular queue using a vector
void exampleFixedSizeQueue() {
    const int maxSize = 5;
    std::vector<int> q(maxSize);
    int front = 0;
    int rear = -1;
    int size = 0;

    // Lambda functions for operations
    auto isFull = [&]() { return size == maxSize; };
    auto isEmpty = [&]() { return size == 0; };
    
    auto enqueue = [&](int value) {
        if (isFull()) {
            std::cerr << "Queue is full!" << std::endl;
            return;
        }
        rear = (rear + 1) % maxSize; // Wrap around
        q[rear] = value;
        size++;
        std::cout << value << " enqueued" << std::endl;
    };
    
    auto dequeue = [&]() {
        if (isEmpty()) {
            std::cerr << "Queue is empty!" << std::endl;
            return -1;
        }
        int value = q[front];
        front = (front + 1) % maxSize; // Wrap around
        size--;
        return value;
    };

    auto peek = [&]() {
         if (isEmpty()) {
            std::cerr << "Queue is empty!" << std::endl;
            return -1;
        }
        return q[front];
    };

    enqueue(10);
    enqueue(20);
    enqueue(30);

    std::cout << "Front element: " << peek() << std::endl;
    std::cout << "Dequeued element: " << dequeue() << std::endl;
}

int main() {
    std::cout << "--- Example using std::queue ---" << std::endl;
    exampleStdQueue();

    std::cout << "\\n--- Example using fixed-size circular queue ---" << std::endl;
    exampleFixedSizeQueue();

    return 0;
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Layers size={14} className="inline mr-1" /> STACK & QUEUE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Simply Easy Stack & Queue
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the fundamentals of stack (LIFO) and queue (FIFO) data structures:
            operations, implementations, applications, and advanced variants like circular
            and priority queues.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ArrowUp size={14} className="inline mr-1" /> Stack
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ArrowDown size={14} className="inline mr-1" /> Queue
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
                placeholder="Search for a concept, operation, or application..."
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
                Introduction to Stack & Queue
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold">Stacks</span> and <span className="font-bold">queues</span> are
                    fundamental linear data structures that differ in how elements are added and removed.
                    A stack follows <strong>LIFO</strong> (Last‑In‑First‑Out), while a queue follows
                    <strong> FIFO</strong> (First‑In‑First‑Out). They are building blocks for many algorithms
                    and real‑world systems.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Stack (LIFO)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Elements are added and removed from the same end (top). Like a stack of plates – you take the top plate first.</p>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Analogy: Stack of plates, browser back button</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Queue (FIFO)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Elements are added at the rear and removed from the front. Like a queue of people – the first in line is served first.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Analogy: Queue at a ticket counter, print queue</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 2: Stack ──────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Stack (LIFO)
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A stack is a linear data structure that follows the <strong>Last‑In‑First‑Out (LIFO)</strong>
                  principle. The last element added is the first to be removed. Stacks are used in function call
                  management, undo/redo, expression evaluation, and many other areas.
                </p>
              </div>
            </div>

            {/* ─── Section 3: Stack Operations ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack-ops'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Key Operations on a Stack
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Push</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adds an element to the top of the stack.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Pop</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Removes the top element from the stack.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Peek / Top</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Returns the top element without removing it.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">IsEmpty / IsFull</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Checks if the stack is empty or full (for fixed‑size implementations).</p>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Stack Implementation ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack-impl'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Implementation of a Stack
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  A stack can be implemented using an array (static or dynamic) or a linked list. Below is a C++
                  example showing both approaches.
                </p>
                <CodeBlock code={stackCode} title="stack_implementation.cpp" id="stackCode" />
              </div>
            </div>

            {/* ─── Section 5: Stack Applications ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['stack-apps'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Applications of Stacks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Function Call Stack (recursion)</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Undo/Redo functionality</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Backtracking algorithms (e.g., maze solving)</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Expression evaluation (infix, postfix, prefix)</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Browser history (back/forward)</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Balancing parentheses / syntax checking</span>
                </div>
              </div>
            </div>

            {/* ─── Section 6: Queue ───────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Queue (FIFO)
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A queue is a linear data structure that follows the <strong>First‑In‑First‑Out (FIFO)</strong>
                  principle. The first element added is the first to be removed. Queues are used in task scheduling,
                  breadth‑first search, buffering, and many other scenarios.
                </p>
              </div>
            </div>

            {/* ─── Section 7: Queue Operations ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue-ops'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Queue Operations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Enqueue</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adds an element to the rear of the queue.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Dequeue</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Removes the front element from the queue.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Peek / Front</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Returns the front element without removing it.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">IsEmpty</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Checks if the queue is empty.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 8: Queue Implementation ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue-impl'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Implementation of a Queue
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  A queue can be implemented using an array (often circular) or a linked list. The C++ Standard
                  Library provides <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">std::queue</code>.
                  Below is an example showing both the standard library and a manual circular queue.
                </p>
                <CodeBlock code={queueCode} title="queue_implementation.cpp" id="queueCode" />
              </div>
            </div>

            {/* ─── Section 9: Circular Queue ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['circular'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Circular Queue
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A circular queue connects the last position back to the first, allowing efficient reuse of array
                  space and avoiding the need to shift elements. It is also known as a <strong>ring buffer</strong>.
                  The <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">exampleFixedSizeQueue</code>
                  in the code above demonstrates a circular queue using a vector.
                </p>
              </div>
            </div>

            {/* ─── Section 10: Priority Queue ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['priority'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Priority Queue
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A priority queue is a queue where each element has a priority. Elements are dequeued in order of
                  priority (highest first). It is often implemented using a <strong>heap</strong> data structure,
                  providing O(log n) insertion and O(log n) removal.
                </p>
                <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Use cases:</strong> Dijkstra's algorithm, Huffman coding, scheduling tasks with priorities.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Section 11: Queue Applications ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['queue-apps'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Applications of Queues
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <Table
                  headers={["Application", "Description"]}
                  rows={[
                    ["Breadth‑First Search (BFS)", "Explore graph nodes level by level."],
                    ["Print Queue", "Manage print jobs in a printer."],
                    ["Task Scheduling", "Schedule tasks in operating systems."],
                    ["Simulation", "Simulate real‑world systems like traffic lights or bank queues."],
                    ["Keyboard Buffer", "Store keystrokes temporarily."],
                    ["Call Center Queues", "Manage incoming calls."],
                    ["Producer‑Consumer Problem", "Coordinate between processes or threads that produce and consume data."],
                  ]}
                  title="Queue Applications"
                />
              </div>
            </div>

            {/* ─── Section 12: Comparison Table ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Stack vs Queue Comparison
              </h2>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <Table
                  headers={["Feature", "Stack", "Queue"]}
                  rows={[
                    ["Access Order", "LIFO", "FIFO"],
                    ["Primary Operations", "Push, Pop, Peek", "Enqueue, Dequeue, Peek"],
                    ["Real‑world Analogy", "Stack of plates", "Queue of people"],
                    ["Common Use Cases", "Function calls, undo/redo, expression evaluation", "Print queues, task scheduling, BFS"],
                    ["Time Complexity (basic)", "O(1)", "O(1)"],
                  ]}
                  title="Stack vs Queue"
                />
              </div>
            </div>

            {/* ─── Section 13: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Stack (LIFO)</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Push:</strong> add to top</li>
                    <li><strong>Pop:</strong> remove from top</li>
                    <li><strong>Peek:</strong> view top</li>
                    <li><strong>IsEmpty:</strong> check empty</li>
                    <li>Applications: function calls, undo/redo, expression evaluation</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Queue (FIFO)</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Enqueue:</strong> add to rear</li>
                    <li><strong>Dequeue:</strong> remove from front</li>
                    <li><strong>Peek:</strong> view front</li>
                    <li><strong>IsEmpty:</strong> check empty</li>
                    <li>Applications: BFS, print queues, task scheduling</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Variants & Complexity</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Circular Queue:</strong> efficient space usage</li>
                    <li><strong>Priority Queue:</strong> element priority (heap)</li>
                    <li><strong>Time:</strong> O(1) for basic operations</li>
                    <li><strong>Space:</strong> O(n) for storage</li>
                    <li>Implementations: array, linked list, STL containers</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Compare stack and queue" or "Explain the applications of stacks and queues" are common
                      questions. Emphasise LIFO vs FIFO and give real‑world examples to illustrate each.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Push it. Pop it. Enqueue it. Dequeue it. Master it. 🚀</p>
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
                <strong className="text-white">Stack</strong> follows LIFO (Last‑In‑First‑Out) – operations:
                Push, Pop, Peek. Ideal for recursion, undo/redo, and expression evaluation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Queue</strong> follows FIFO (First‑In‑First‑Out) – operations:
                Enqueue, Dequeue, Peek. Used in BFS, task scheduling, and buffering.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Implementations</strong> include arrays (static/dynamic) and
                linked lists. The STL provides <code className="bg-white/10 px-1 rounded">std::stack</code> and
                <code className="bg-white/10 px-1 rounded">std::queue</code>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Variants</strong> – circular queue (efficient space) and priority
                queue (ordered by priority, implemented with heap).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from understanding the principles,
                comparing them, and knowing real‑world applications.
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
            Sidemann Academic Registry • Simply Easy Stack & Queue 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;