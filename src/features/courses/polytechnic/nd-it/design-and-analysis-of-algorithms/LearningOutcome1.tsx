import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Code,
  GitBranch,
  Layers,
  Database,
  GraduationCap,
  Lightbulb,
  Search,
  X,
  RefreshCw,
  ChevronUp,
  BookOpen,
  Copy,
  Check,
  Table,
  List,
  Lock,
  Unlock,
  Smartphone,
  Laptop,
  XCircle,
  Flag,
  User,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'paradigms', label: 'Paradigms' },
  { id: 'oop', label: 'OOP Concepts' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'data-structures', label: 'Data Structures' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bruteForceAttempt, setBruteForceAttempt] = useState(0);
  const [bruteForceRejected, setBruteForceRejected] = useState<number[]>([]);
  const [bruteForceSolved, setBruteForceSolved] = useState(false);
  const [bruteForceFinalCount, setBruteForceFinalCount] = useState<number | null>(null);
  const bruteForceStateRef = useRef({ current: 0, solved: false });

  // Brute Force animation: a hacker's laptop tries every PIN in sequence, starting from 0000, until it finds 1234
  useEffect(() => {
    const target = 1234;
    const start = 0;
    bruteForceStateRef.current = { current: start, solved: false };

    const finishRun = (attemptsUsed: number) => {
      bruteForceStateRef.current.solved = true;
      setBruteForceSolved(true);
      setBruteForceFinalCount(attemptsUsed);
      setTimeout(() => {
        bruteForceStateRef.current = { current: start, solved: false };
        setBruteForceSolved(false);
        setBruteForceFinalCount(null);
        setBruteForceRejected([]);
        setBruteForceAttempt(start);
      }, 2600);
    };

    const interval = setInterval(() => {
      const state = bruteForceStateRef.current;
      if (state.solved) return;
      setBruteForceAttempt(state.current);
      if (state.current === target) {
        finishRun(target - start + 1);
        return;
      }
      setBruteForceRejected(prev => [...prev.slice(-4), state.current]);
      state.current += 1;
    }, 90);

    (bruteForceStateRef as any).jumpToEnd = () => {
      const state = bruteForceStateRef.current;
      if (state.solved) return;
      const attemptsUsed = target - state.current + 1;
      setBruteForceAttempt(target);
      finishRun(attemptsUsed);
    };

    return () => clearInterval(interval);
  }, []);

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
        text: 'Object‑oriented programming was invented in the 1960s with the Simula language, long before it became mainstream in the 1990s.',
      },
      {
        title: 'Pro Tip',
        text: 'Inheritance promotes code reusability, but favour composition over inheritance for more flexible designs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of OOP: A PIE – Abstraction, Polymorphism, Inheritance, Encapsulation.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse algorithms with data structures. Algorithms are step‑by‑step procedures; data structures are ways to store and organise data.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Object‑oriented programming was invented in the 1960s with the Simula language, long before it became mainstream in the 1990s.',
      },
      {
        title: 'Pro Tip',
        text: 'Inheritance promotes code reusability, but favour composition over inheritance for more flexible designs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of OOP: A PIE – Abstraction, Polymorphism, Inheritance, Encapsulation.',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse algorithms with data structures. Algorithms are step‑by‑step procedures; data structures are ways to store and organise data.',
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

  // ─── Syntax highlighting (adapted from original) ───────────────────────
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
      'using', 'namespace', 'class', 'public', 'private', 'protected', 'static',
      'void', 'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'try',
      'catch', 'finally', 'throw', 'override', 'virtual', 'abstract', 'new',
      'this', 'get', 'set', 'var', 'const', 'null', 'true', 'false', 'struct',
      'interface', 'enum', 'base', 'in', 'out', 'as', 'is', 'typeof',
      'switch', 'case', 'break', 'continue', 'default', 'delete', 'include',
      'define', 'std', 'endl', 'cout'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = [
      'int', 'string', 'double', 'bool', 'char', 'float', 'decimal', 'long',
      'short', 'byte', 'sbyte', 'uint', 'ulong', 'ushort', 'object', 'var',
      'vector'
    ];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Classes / library types
    const classes = [
      'Console', 'Math', 'Program', 'Person', 'MyClass', 'DivideByZeroException',
      'FormatException', 'Exception', 'Convert', 'System', 'Circle', 'Cylinder',
      'Shape', 'Rectangle', 'Triangle', 'BankAccount', 'string'
    ];
    const classRegex = new RegExp(`\\b(${classes.join('|')})\\b`, 'g');
    escaped = escaped.replace(classRegex, '<span class="text-[#0d9488] dark:text-[#4EC9B0]">$1</span>');

    // Methods
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

  // ─── OOP code example ──────────────────────────────────────────────────
  const oopCode = `#include <iostream>
#include <vector>

// Encapsulation: Data and methods are bundled into a class
class Circle {
private:
  double radius;
public:
  void setRadius(double r) { radius = r; }
  double getArea() { return 3.14159 * radius * radius; }
};

// Inheritance: Cylinder inherits from Circle
class Cylinder : public Circle {
private:
  double height;
public:
  void setHeight(double h) { height = h; }
  double getVolume() { return getArea() * height; }
};

// Polymorphism: Different shapes with a common interface
class Shape {
public:
  virtual void draw() = 0; // Pure virtual function
};

class Rectangle : public Shape {
public:
  void draw() override { std::cout << "Drawing a rectangle\\n"; }
};

class Triangle : public Shape {
public:
  void draw() override { std::cout << "Drawing a triangle\\n"; }
};

// Data Abstraction: Hiding implementation details
class BankAccount {
private:
  double balance;
public:
  void deposit(double amount) { balance += amount; }
  void withdraw(double amount) {
    if (balance >= amount) { balance -= amount; }
    else { std::cout << "Insufficient funds!\\n"; }
  }
  double getBalance() const { return balance; }
};

int main() {
  // Encapsulation Demo
  Circle circle;
  circle.setRadius(5.0);
  std::cout << "Circle area: " << circle.getArea() << std::endl;

  // Inheritance Demo
  Cylinder cylinder;
  cylinder.setRadius(3.0);
  cylinder.setHeight(10.0);
  std::cout << "Cylinder volume: " << cylinder.getVolume() << std::endl;

  // Polymorphism Demo
  std::vector<Shape*> shapes = {new Rectangle(), new Triangle()};
  for (Shape* shape : shapes) {
    shape->draw();
  }
  for (Shape* shape : shapes) { delete shape; }
  shapes.clear();

  // Data Abstraction Demo
  BankAccount account;
  account.deposit(1000.0);
  account.withdraw(500.0);
  std::cout << "Account balance: " << account.getBalance() << std::endl;

  return 0;
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> PROGRAMMING FUNDAMENTALS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Programming Paradigms & Data Structures
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master core computing concepts: programming paradigms, OOP,
            algorithms, and data structures. Build a strong foundation for
            efficient and maintainable software development.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> Paradigms
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> OOP
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
                placeholder="Search for a concept, algorithm, or data structure..."
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
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Programming Paradigms
              </h2>

              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                  Official Definition
                </p>
                <p className="text-base md:text-lg font-bold text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  A programming paradigm is a fundamental style or approach to organising code. It shapes how data is structured and how operations are performed.
                </p>
              </div>

              <div className="mt-4 p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4">
                  Types of Programming Paradigms
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Imperative Programming
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      The programmer writes an explicit sequence of instructions that tell the computer exactly what to do and in what order. Control flow structures like loops and conditionals direct how the program moves from one step to the next.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Object-Oriented Programming (OOP)
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Code is organised around objects that combine data and the behaviours that act on that data. This makes programs easier to model, reuse, and maintain as they grow larger.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Functional Programming
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Programs are built by combining functions rather than changing shared data. Data is treated as immutable, which helps avoid unexpected side effects and makes code easier to test.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Event-Driven Programming
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      The program remains idle until an event occurs, such as a user clicking a button or a message arriving, and then runs the code linked to that event. This approach is common in graphical interfaces and networked systems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 2: OOP Concepts ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['oop'] = el; }}
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Object‑Oriented Programming Concepts
              </h2>

              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                  Official Definition
                </p>
                <p className="text-base md:text-lg font-bold text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  Object-oriented programming is a paradigm that organises software around objects, which bundle data and the behaviours that act on that data, rather than around a sequence of instructions.
                </p>
              </div>

              <div className="mt-4 p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4">
                  Key Concepts
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Encapsulation
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Data and the methods that operate on it are bundled together within a class, with internal details hidden from outside code. This prevents accidental modification and enforces controlled access through defined interfaces.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Polymorphism
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Objects of different types can be treated through a common interface, allowing the same method call to behave differently depending on the object. This enables more generic and flexible code, such as through method overriding.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Inheritance
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      A derived class acquires the properties and behaviours of a base class, allowing shared functionality to be reused rather than rewritten. This creates hierarchical relationships between related classes.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Data Abstraction
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Unnecessary implementation details are hidden, exposing only a simplified view of an object's functionality. This reduces complexity for anyone using the class and lets them focus on essential features.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Class and Object
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      A class is a blueprint that defines the structure and behaviour shared by its instances. An object is an individual instance of a class, with its own independent state.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mt-2 mb-3">
                Difference Between OOP and POP (Procedural)
              </h3>
              <div className="mt-2">
                <Table
                  headers={["OOP", "POP"]}
                  rows={[
                    ["Groups related data and actions together inside objects.", "Keeps data and functions separate from each other."],
                    ["Data is hidden inside objects and protected from outside changes.", "Data is usually stored in variables that any part of the program can access."],
                    ["Code is built using classes and objects.", "Code is built using a list of steps and functions."],
                    ["New classes can reuse and extend existing ones through inheritance.", "Reusing code means copying or calling the same functions again."],
                    ["Easier to change and grow without breaking other parts of the program.", "Harder to change safely as the program gets bigger, since everything shares the same data."],
                    ["Often reacts to events, like a button click.", "Usually runs in a fixed order, from top to bottom."],
                  ]}
                />
              </div>

 
            </div>

            {/* ─── Section 3: Algorithms ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['algorithms'] = el; }}
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Algorithms
              </h2>

              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                  Official Definition
                </p>
                <p className="text-base md:text-lg font-bold text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  An algorithm is a sequence of well-defined instructions used to solve a specific problem or perform a task. Algorithms are the backbone of problem-solving in computer science and software development.
                </p>
              </div>

              <div className="mt-4 p-6 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <svg viewBox="0 0 480 420" className="w-full max-w-md" xmlns="http://www.w3.org/2000/svg">
                  {/* START */}
                  <rect x="180" y="10" width="120" height="44" rx="10" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />
                  <text x="240" y="37" textAnchor="middle" fill="white" fontSize="15" fontWeight="700">START</text>

                  <line x1="240" y1="54" x2="240" y2="80" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* Step 1 */}
                  <rect x="140" y="82" width="200" height="44" rx="10" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />
                  <text x="240" y="109" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Step 1: Input Data</text>

                  <line x1="240" y1="126" x2="240" y2="155" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* Condition diamond */}
                  <polygon points="240,157 320,205 240,253 160,205" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />
                  <text x="240" y="200" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Condition</text>
                  <text x="240" y="216" textAnchor="middle" fill="white" fontSize="13" fontWeight="700">Met?</text>

                  {/* YES branch (left, down to Step 2) */}
                  <text x="115" y="200" textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="700">YES</text>
                  <line x1="160" y1="205" x2="95" y2="205" stroke="#334155" strokeWidth="2" />
                  <line x1="95" y1="205" x2="95" y2="290" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* NO branch (right, down to END) */}
                  <text x="365" y="200" textAnchor="middle" fill="#1e293b" fontSize="13" fontWeight="700">NO</text>
                  <line x1="320" y1="205" x2="385" y2="205" stroke="#334155" strokeWidth="2" />
                  <line x1="385" y1="205" x2="385" y2="290" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" />

                  {/* Step 2: Process */}
                  <rect x="25" y="292" width="140" height="44" rx="10" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />
                  <text x="95" y="319" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">Step 2: Process</text>

                  {/* END: Result */}
                  <rect x="315" y="292" width="140" height="44" rx="10" fill="#4f46e5" stroke="#3730a3" strokeWidth="2" />
                  <text x="385" y="319" textAnchor="middle" fill="white" fontSize="14" fontWeight="700">END: Result</text>

                  {/* Loop back from Step 2 to Condition */}
                  <path d="M 95 292 L 95 205 L 160 205" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 3" markerEnd="url(#arrow)" />

                  <defs>
                    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
                    </marker>
                  </defs>
                </svg>
                <p className="mt-4 text-center text-base md:text-lg font-bold text-black dark:text-white leading-snug max-w-sm">
                  A clear list of instructions computers follow, step by step, to reach a goal.
                </p>
              </div>

              <div className="mt-4 p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4">
                  Characteristics
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Finiteness
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      An algorithm must come to an end after a limited number of steps. It cannot run forever, even in the worst-case scenario.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Definiteness
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Every step must be precisely and unambiguously defined, leaving no room for interpretation. Anyone following the steps should arrive at the same result.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Effectiveness
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Each step must be simple enough to actually be carried out, whether by a person or a computer. There is no vague or impossible instruction.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Input and Output
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      An algorithm can take zero or more inputs to work with, but it must always produce at least one output. The output is the result of processing the input.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Correctness
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      A correct algorithm produces the expected, accurate output for every valid input it is given. This is what makes it trustworthy to use.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mt-2 mb-3">
                Types of Algorithms
              </h3>
              <div className="mt-4 p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Brute Force
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Tries every possible solution until the correct one is found. It is simple to understand and implement, but often slow for large problems.
                    </p>

                    <style>{`
                      @keyframes shakeDeny {
                        0%, 100% { transform: translateX(0); }
                        20% { transform: translateX(-4px); }
                        40% { transform: translateX(4px); }
                        60% { transform: translateX(-4px); }
                        80% { transform: translateX(4px); }
                      }
                      .brute-shake { animation: shakeDeny 0.4s ease-in-out; }
                      @keyframes bruteBinaryFlow { from { transform: translateY(-50%); } to { transform: translateY(0); } }
                      .brute-binary-column { animation: bruteBinaryFlow 3s linear infinite; }
                      .brute-binary-column:nth-child(even) { animation-direction: reverse; }
                      .brute-hacker-title { font-family: "Courier New", monospace; letter-spacing: .12em; text-shadow: 0 0 7px #4ade80; }
                      @media (prefers-reduced-motion: reduce) { .brute-binary-column, .brute-shake { animation: none; } }
                    `}</style>

                    <div className="mx-auto mt-3 grid max-w-[340px] grid-cols-[3rem_minmax(0,1fr)_3rem] items-center gap-2">
                      {/* Vertical list of rejected PINs, with the successful PIN pinned at the bottom */}
                      <div className="flex min-w-0 flex-col">
                        <div className="flex flex-col-reverse gap-1 h-24 justify-start overflow-hidden">
                          {bruteForceRejected.map((pin, i) => (
                            <span
                              key={i}
                              className="flex items-center justify-between text-[10px] font-mono bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 px-1.5 py-0.5 rounded"
                            >
                              {String(pin).padStart(4, '0')} <XCircle size={10} />
                            </span>
                          ))}
                        </div>
                        {bruteForceSolved && (
                          <span className="flex items-center justify-between text-[10px] font-mono bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded mt-1 font-bold">
                            {String(bruteForceAttempt).padStart(4, '0')} <Check size={10} />
                          </span>
                        )}
                      </div>

                      {/* Laptop */}
                      <div className="mx-auto flex w-full max-w-40 flex-col items-center">
                        <div className="relative h-24 w-[calc(100%_-_16px)] overflow-hidden rounded-t-md border-4 border-b-0 border-slate-700 bg-[#020b06]" role="img" aria-label={bruteForceSolved ? 'Laptop: password found' : 'Laptop: hacking password with scrolling green binary digits'}>
                          <div className="absolute inset-0 flex justify-around overflow-hidden text-[9px] leading-3 text-green-400/60" aria-hidden="true">
                            {Array.from({ length: 12 }, (_, column) => (
                              <div key={column} className="brute-binary-column flex flex-col font-mono" style={{ animationDuration: `${2.4 + column % 4 * .6}s`, animationDelay: `${column * -.37}s` }}>
                                {Array.from({ length: 32 }, (_, row) => <span key={row}>{(row * 7 + column * 3 + Math.floor(row / 3)) % 2}</span>)}
                              </div>
                            ))}
                          </div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <p className="brute-hacker-title bg-black/85 px-2 py-1 text-[10px] font-black uppercase text-green-300">{bruteForceSolved ? 'Password found' : 'Hacking password'}</p>
                            <p className="bg-black/85 px-2 font-mono text-[10px] text-green-400">{String(bruteForceAttempt).padStart(4, '0')}</p>
                          </div>
                        </div>
                        <div className="h-2 w-[calc(100%_-_16px)] rounded-b-md border-2 border-t-0 border-slate-700 bg-slate-800" />
                        <div className="h-1 w-full rounded-b bg-slate-700" />
                      </div>

                      {/* Lock */}
                      <div
                        key={bruteForceAttempt}
                        className={`w-12 h-12 rounded-xl border-4 flex items-center justify-center shrink-0 transition-colors duration-200 ${
                          bruteForceSolved
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-red-500 bg-red-500/10 brute-shake'
                        }`}
                      >
                        {bruteForceSolved ? (
                          <Unlock size={24} className="text-emerald-400" />
                        ) : (
                          <Lock size={24} className="text-red-400" />
                        )}
                      </div>
                    </div>

                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                      {bruteForceSolved && bruteForceFinalCount !== null
                        ? `The algorithm tried ${bruteForceFinalCount} combinations before it found the correct password.`
                        : 'Brute force is trying every combination.'}
                    </p>
                    {!bruteForceSolved && (
                      <button
                        onClick={() => (bruteForceStateRef as any).jumpToEnd?.()}
                        className="block mx-auto mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Jump to end
                      </button>
                    )}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Greedy
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Makes the best choice available at each step without looking ahead. This is fast, but the overall result is not always the best possible one.
                    </p>

                    <div className="mt-3 flex justify-center">
                      <svg viewBox="0 0 300 260" className="w-full max-w-[280px]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <marker id="arrowGreedy" markerWidth="3" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
                            <path d="M0,0 L3,1.5 L0,3 Z" fill="#4f46e5" />
                          </marker>
                          <marker id="arrowGreyGreedy" markerWidth="3" markerHeight="3" refX="2.5" refY="1.5" orient="auto">
                            <path d="M0,0 L3,1.5 L0,3 Z" fill="#94a3b8" />
                          </marker>
                        </defs>

                        {/* Start node, top */}
                        <circle cx="150" cy="15" r="9" fill="#1e293b" />
                        <text x="150" y="5" textAnchor="middle" fontSize="10" fill="#1e293b" fontWeight="700">Start</text>

                        {/* Level 1: Start -> B (right, not chosen, grey, continues to goal) */}
                        <line x1="150" y1="15" x2="230" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#arrowGreyGreedy)" />
                        <text x="210" y="55" fontSize="11" fill="#64748b" fontWeight="700">5 km</text>

                        {/* Level 1: Start -> A (left, chosen, indigo) */}
                        <line x1="150" y1="15" x2="70" y2="85" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrowGreedy)" />
                        <text x="90" y="55" fontSize="11" fill="#4f46e5" fontWeight="700">2 km</text>

                        {/* A node */}
                        <circle cx="70" cy="90" r="6" fill="#4f46e5" />

                        {/* A -> C stub (not chosen, unexplored option) */}
                        <line x1="70" y1="90" x2="25" y2="130" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                        <circle cx="20" cy="135" r="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="18" y="150" fontSize="9" fill="#94a3b8">6 km</text>

                        {/* A -> D (chosen, indigo) */}
                        <line x1="70" y1="90" x2="115" y2="150" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrowGreedy)" />
                        <text x="100" y="125" fontSize="11" fill="#4f46e5" fontWeight="700">3 km</text>

                        {/* D node */}
                        <circle cx="115" cy="155" r="6" fill="#4f46e5" />

                        {/* D -> E stub (not chosen, unexplored option) */}
                        <line x1="115" y1="155" x2="75" y2="195" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                        <circle cx="70" cy="200" r="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="55" y="215" fontSize="9" fill="#94a3b8">7 km</text>

                        {/* D -> F (chosen, indigo, ends dead end) */}
                        <line x1="115" y1="155" x2="150" y2="215" stroke="#4f46e5" strokeWidth="3" markerEnd="url(#arrowGreedy)" />
                        <text x="140" y="190" fontSize="11" fill="#4f46e5" fontWeight="700">2 km</text>

                        {/* Dead end marker */}
                        <circle cx="150" cy="222" r="13" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
                        <line x1="145" y1="217" x2="155" y2="227" stroke="#ef4444" strokeWidth="2" />
                        <line x1="155" y1="217" x2="145" y2="227" stroke="#ef4444" strokeWidth="2" />
                        <text x="150" y="248" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="700">Dead end</text>

                        {/* B node (right branch, not chosen) */}
                        <circle cx="230" cy="90" r="6" fill="#94a3b8" />

                        {/* B -> Goal (grey dashed, continues to actual goal) */}
                        <line x1="230" y1="90" x2="230" y2="205" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="5 4" markerEnd="url(#arrowGreyGreedy)" />
                        <text x="238" y="150" fontSize="11" fill="#64748b" fontWeight="700">9 km</text>

                        {/* Goal flag */}
                        <circle cx="230" cy="215" r="13" fill="#f0fdf4" stroke="#94a3b8" strokeWidth="2" />
                        <g transform="translate(224,206)">
                          <path d="M0 0 V16 M0 0 H10 L7 3.5 L10 7 H0" stroke="#64748b" strokeWidth="1.5" fill="none" />
                        </g>
                        <text x="230" y="240" textAnchor="middle" fontSize="10" fill="#64748b" fontWeight="700">Goal</text>

                        {/* Moving dot walking the greedy path */}
                        <circle r="6" fill="#4f46e5">
                          <animateMotion dur="3s" repeatCount="indefinite" path="M150,15 L70,85 L115,150 L150,215" />
                        </circle>
                      </svg>
                    </div>
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 pl-4">
                      Greedy always picks the best-looking option at every branch without worrying about the future — even though a longer path might have actually reached the goal.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Recursive
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Solves a problem by having the algorithm call itself on smaller versions of the same problem. It continues until it reaches a case simple enough to solve directly.
                    </p>

                                                            <style>{`
                      @keyframes pzc-s1-fade { 0% {opacity:0} 3% {opacity:1} 90% {opacity:1} 96% {opacity:0} 100% {opacity:0} }
                      @keyframes pzc-s1-cut { 0%,4% {stroke-dashoffset:1} 8% {stroke-dashoffset:0} 90% {stroke-dashoffset:0} 96%,100% {stroke-dashoffset:1} }
                      @keyframes pzc-fly1 {
                        0%,8% { opacity:0; transform:translate(0,0) scale(1); }
                        9%     { opacity:1; transform:translate(0,-22px) scale(1.05); }
                        12%    { opacity:1; transform:translate(65px,-8px) scale(1.05); }
                        13%,100% { opacity:0; transform:translate(65px,0) scale(1); }
                      }

                      @keyframes pzc-s2-fade { 0%,11% {opacity:0} 15% {opacity:1} 90% {opacity:1} 96%,100% {opacity:0} }
                      @keyframes pzc-s2-cut { 0%,16% {stroke-dashoffset:1} 20% {stroke-dashoffset:0} 90% {stroke-dashoffset:0} 96%,100% {stroke-dashoffset:1} }
                      @keyframes pzc-fly2 {
                        0%,20% { opacity:0; transform:translate(0,0) scale(1); }
                        21%    { opacity:1; transform:translate(0,-22px) scale(1.05); }
                        24%    { opacity:1; transform:translate(65px,-8px) scale(1.05); }
                        25%,100% { opacity:0; transform:translate(65px,0) scale(1); }
                      }

                      @keyframes pzc-s3-fade { 0%,23% {opacity:0} 27% {opacity:1} 90% {opacity:1} 96%,100% {opacity:0} }
                      @keyframes pzc-s3-cut { 0%,28% {stroke-dashoffset:1} 32% {stroke-dashoffset:0} 90% {stroke-dashoffset:0} 96%,100% {stroke-dashoffset:1} }
                      @keyframes pzc-fly3 {
                        0%,32% { opacity:0; transform:translate(0,0) scale(1); }
                        33%    { opacity:1; transform:translate(0,-22px) scale(1.05); }
                        36%    { opacity:1; transform:translate(65px,-8px) scale(1.05); }
                        37%,100% { opacity:0; transform:translate(65px,0) scale(1); }
                      }

                      @keyframes pzc-s4-fade { 0%,35% {opacity:0} 39% {opacity:1} 90% {opacity:1} 96%,100% {opacity:0} }
                      @keyframes pzc-s4-cut { 0%,40% {stroke-dashoffset:1} 44% {stroke-dashoffset:0} 90% {stroke-dashoffset:0} 96%,100% {stroke-dashoffset:1} }
                      @keyframes pzc-fly4 {
                        0%,44% { opacity:0; transform:translate(0,0) scale(1); }
                        45%    { opacity:1; transform:translate(0,-22px) scale(1.05); }
                        48%    { opacity:1; transform:translate(65px,-8px) scale(1.05); }
                        49%,100% { opacity:0; transform:translate(65px,0) scale(1); }
                      }

                      @keyframes pzc-s5-fade { 0%,47% {opacity:0} 51% {opacity:1} 90% {opacity:1} 96%,100% {opacity:0} }
                      @keyframes pzc-s5-check {
                        0%,52% { opacity:0; transform:scale(0.6); }
                        56%    { opacity:1; transform:scale(1.15); }
                        60%    { opacity:1; transform:scale(1); }
                        90%    { opacity:1; transform:scale(1); }
                        96%,100% { opacity:0; transform:scale(0.6); }
                      }

                      .pzc-wrap { position:relative; }
                      .pzc-s1 { animation: pzc-s1-fade 18s linear infinite; }
                      .pzc-s1-cut { animation: pzc-s1-cut 18s linear infinite; }
                      .pzc-fly1 { animation: pzc-fly1 18s linear infinite; transform-origin: 35px 55px; }
                      .pzc-s2 { animation: pzc-s2-fade 18s linear infinite; }
                      .pzc-s2-cut { animation: pzc-s2-cut 18s linear infinite; }
                      .pzc-fly2 { animation: pzc-fly2 18s linear infinite; transform-origin: 100px 55px; }
                      .pzc-s3 { animation: pzc-s3-fade 18s linear infinite; }
                      .pzc-s3-cut { animation: pzc-s3-cut 18s linear infinite; }
                      .pzc-fly3 { animation: pzc-fly3 18s linear infinite; transform-origin: 165px 55px; }
                      .pzc-s4 { animation: pzc-s4-fade 18s linear infinite; }
                      .pzc-s4-cut { animation: pzc-s4-cut 18s linear infinite; }
                      .pzc-fly4 { animation: pzc-fly4 18s linear infinite; transform-origin: 230px 55px; }
                      .pzc-s5 { animation: pzc-s5-fade 18s linear infinite; }
                      .pzc-s5-check { animation: pzc-s5-check 18s linear infinite; transform-origin: 295px 55px; }
                    `}</style>

                    <div className="mt-3 flex justify-center pzc-wrap">
                      <svg viewBox="0 0 340 130" className="w-full max-w-[320px]" xmlns="http://www.w3.org/2000/svg">
                        {/* guide tracks */}
                        <line x1="59" y1="55" x2="76" y2="55" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1="124" y1="55" x2="141" y2="55" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1="189" y1="55" x2="206" y2="55" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                        <line x1="254" y1="55" x2="271" y2="55" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

                        {/* Station 1: whole pizza */}
                        <g className="pzc-s1">
                          <circle cx="35" cy="55" r="24" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                          <text x="35" y="98" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="700">Whole</text>
                        </g>
                        <line x1="35" y1="31" x2="35" y2="79" stroke="#b45309" strokeWidth="2" pathLength="1" strokeDasharray="1" className="pzc-s1-cut" />

                        {/* Flyer 1: copy lifts off station 1, carries to station 2 */}
                        <g className="pzc-fly1">
                          <circle cx="35" cy="55" r="17" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="35" y1="38" x2="35" y2="72" stroke="#b45309" strokeWidth="1.5" />
                        </g>

                        {/* Station 2: 2 slices (inherits station 1's cut) */}
                        <g className="pzc-s2">
                          <circle cx="100" cy="55" r="24" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                          <line x1="100" y1="31" x2="100" y2="79" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <text x="100" y="98" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="700">2 slices</text>
                        </g>
                        <line x1="76" y1="55" x2="124" y2="55" stroke="#b45309" strokeWidth="2" pathLength="1" strokeDasharray="1" className="pzc-s2-cut" />

                        {/* Flyer 2 */}
                        <g className="pzc-fly2">
                          <circle cx="100" cy="55" r="17" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="100" y1="38" x2="100" y2="72" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="83" y1="55" x2="117" y2="55" stroke="#b45309" strokeWidth="1.5" />
                        </g>

                        {/* Station 3: 4 slices (inherits station 2's cut) */}
                        <g className="pzc-s3">
                          <circle cx="165" cy="55" r="24" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                          <line x1="165" y1="31" x2="165" y2="79" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <line x1="141" y1="55" x2="189" y2="55" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <text x="165" y="98" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="700">4 slices</text>
                        </g>
                        <line x1="148" y1="38" x2="182" y2="72" stroke="#b45309" strokeWidth="1.5" pathLength="1" strokeDasharray="1" className="pzc-s3-cut" />
                        <line x1="182" y1="38" x2="148" y2="72" stroke="#b45309" strokeWidth="1.5" pathLength="1" strokeDasharray="1" className="pzc-s3-cut" />

                        {/* Flyer 3 */}
                        <g className="pzc-fly3">
                          <circle cx="165" cy="55" r="17" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="165" y1="38" x2="165" y2="72" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="148" y1="55" x2="182" y2="55" stroke="#b45309" strokeWidth="1.5" />
                        </g>

                        {/* Station 4: 8 slices (inherits station 3's diagonal cut) */}
                        <g className="pzc-s4">
                          <circle cx="230" cy="55" r="24" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                          <line x1="230" y1="31" x2="230" y2="79" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <line x1="206" y1="55" x2="254" y2="55" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <line x1="213" y1="38" x2="247" y2="72" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <line x1="247" y1="38" x2="213" y2="72" stroke="#b45309" strokeWidth="1.5" opacity="0.7" />
                          <text x="230" y="98" textAnchor="middle" fontSize="8" fill="#1e293b" fontWeight="700">8 slices</text>
                        </g>
                        <line x1="208" y1="46" x2="252" y2="64" stroke="#b45309" strokeWidth="1.2" pathLength="1" strokeDasharray="1" className="pzc-s4-cut" />
                        <line x1="221" y1="33" x2="239" y2="77" stroke="#b45309" strokeWidth="1.2" pathLength="1" strokeDasharray="1" className="pzc-s4-cut" />
                        <line x1="239" y1="33" x2="221" y2="77" stroke="#b45309" strokeWidth="1.2" pathLength="1" strokeDasharray="1" className="pzc-s4-cut" />
                        <line x1="252" y1="46" x2="208" y2="64" stroke="#b45309" strokeWidth="1.2" pathLength="1" strokeDasharray="1" className="pzc-s4-cut" />

                        {/* Flyer 4 */}
                        <g className="pzc-fly4">
                          <circle cx="230" cy="55" r="17" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="230" y1="38" x2="230" y2="72" stroke="#b45309" strokeWidth="1.5" />
                          <line x1="213" y1="55" x2="247" y2="55" stroke="#b45309" strokeWidth="1.5" />
                        </g>

                        {/* Station 5: 16 slices — base case, bite-sized, stop */}
                        <g className="pzc-s5">
                          <circle cx="295" cy="55" r="24" fill="#dcfce7" stroke="#22c55e" strokeWidth="2.5" />
                          <line x1="295" y1="31" x2="295" y2="79" stroke="#16a34a" strokeWidth="1.2" />
                          <line x1="271" y1="55" x2="319" y2="55" stroke="#16a34a" strokeWidth="1.2" />
                          <line x1="278" y1="38" x2="312" y2="72" stroke="#16a34a" strokeWidth="1.2" />
                          <line x1="312" y1="38" x2="278" y2="72" stroke="#16a34a" strokeWidth="1.2" />
                          <line x1="273" y1="46" x2="317" y2="64" stroke="#16a34a" strokeWidth="1" />
                          <line x1="286" y1="33" x2="304" y2="77" stroke="#16a34a" strokeWidth="1" />
                          <line x1="304" y1="33" x2="286" y2="77" stroke="#16a34a" strokeWidth="1" />
                          <line x1="317" y1="46" x2="273" y2="64" stroke="#16a34a" strokeWidth="1" />
                          <text x="295" y="98" textAnchor="middle" fontSize="8" fill="#16a34a" fontWeight="700">16 slices</text>
                        </g>
                        <g className="pzc-s5-check">
                          <circle cx="295" cy="55" r="12" fill="#22c55e" />
                          <path d="M289,55 L293,59 L302,49" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <text x="295" y="115" textAnchor="middle" fontSize="7.5" fill="#16a34a" fontWeight="700" className="pzc-s5-check">
                          base case — stop
                        </text>
                      </svg>
                    </div>
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 pl-4">
                      Each stage runs the exact same instruction — "cut this piece in half" — calling itself again on its own output, smaller each time, until the base case (bite-sized) stops the calls and the recursion unwinds.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Backtracking
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Explores possible paths toward a solution and abandons ("backtracks" from) any path that leads to a dead end. It then tries a different path instead.
                    </p>

                    <style>{`
                      @keyframes mz-start { 0%,2% {stroke-dashoffset:1} 4% {stroke-dashoffset:0} 96% {stroke-dashoffset:0} 100% {stroke-dashoffset:1} }

                      @keyframes mz-fork1A { 0%,4% {opacity:0; transform:scale(0.6)} 5.5% {opacity:1; transform:scale(1.3)} 7% {opacity:1; transform:scale(1)} 19% {opacity:1} 22%,100% {opacity:0} }
                      @keyframes mz-branch1 { 0%,7% {stroke-dashoffset:1} 19% {stroke-dashoffset:0} 22% {stroke-dashoffset:0} 24% {stroke-dashoffset:1} 100% {stroke-dashoffset:1} }
                      @keyframes mz-deadend1 { 0%,18% {opacity:0; transform:scale(0.5)} 20% {opacity:1; transform:scale(1.2)} 22% {opacity:1; transform:scale(1)} 24% {opacity:0} 100% {opacity:0} }
                      @keyframes mz-backtrack1 { 0%,22% {opacity:0} 23% {opacity:1} 26% {opacity:1} 27%,100% {opacity:0} }
                      @keyframes mz-fork1B { 0%,24% {opacity:0; transform:scale(0.6)} 25.5% {opacity:1; transform:scale(1.3)} 27% {opacity:1; transform:scale(1)} 31% {opacity:1} 33%,100% {opacity:0} }
                      @keyframes mz-continue1 { 0%,27% {stroke-dashoffset:1} 32% {stroke-dashoffset:0} 100% {stroke-dashoffset:0} }

                      @keyframes mz-fork2A { 0%,32% {opacity:0; transform:scale(0.6)} 33.5% {opacity:1; transform:scale(1.3)} 35% {opacity:1; transform:scale(1)} 47% {opacity:1} 50%,100% {opacity:0} }
                      @keyframes mz-branch2 { 0%,35% {stroke-dashoffset:1} 47% {stroke-dashoffset:0} 50% {stroke-dashoffset:0} 52% {stroke-dashoffset:1} 100% {stroke-dashoffset:1} }
                      @keyframes mz-deadend2 { 0%,46% {opacity:0; transform:scale(0.5)} 48% {opacity:1; transform:scale(1.2)} 50% {opacity:1; transform:scale(1)} 52% {opacity:0} 100% {opacity:0} }
                      @keyframes mz-backtrack2 { 0%,50% {opacity:0} 51% {opacity:1} 54% {opacity:1} 55%,100% {opacity:0} }
                      @keyframes mz-fork2B { 0%,52% {opacity:0; transform:scale(0.6)} 53.5% {opacity:1; transform:scale(1.3)} 55% {opacity:1; transform:scale(1)} 59% {opacity:1} 61%,100% {opacity:0} }
                      @keyframes mz-continue2 { 0%,55% {stroke-dashoffset:1} 60% {stroke-dashoffset:0} 100% {stroke-dashoffset:0} }

                      @keyframes mz-fork3A { 0%,60% {opacity:0; transform:scale(0.6)} 61.5% {opacity:1; transform:scale(1.3)} 63% {opacity:1; transform:scale(1)} 75% {opacity:1} 78%,100% {opacity:0} }
                      @keyframes mz-branch3 { 0%,63% {stroke-dashoffset:1} 75% {stroke-dashoffset:0} 78% {stroke-dashoffset:0} 80% {stroke-dashoffset:1} 100% {stroke-dashoffset:1} }
                      @keyframes mz-deadend3 { 0%,74% {opacity:0; transform:scale(0.5)} 76% {opacity:1; transform:scale(1.2)} 78% {opacity:1; transform:scale(1)} 80% {opacity:0} 100% {opacity:0} }
                      @keyframes mz-backtrack3 { 0%,78% {opacity:0} 79% {opacity:1} 82% {opacity:1} 83%,100% {opacity:0} }
                      @keyframes mz-fork3B { 0%,80% {opacity:0; transform:scale(0.6)} 81.5% {opacity:1; transform:scale(1.3)} 83% {opacity:1; transform:scale(1)} 89% {opacity:1} 91%,100% {opacity:0} }
                      @keyframes mz-continue3 { 0%,83% {stroke-dashoffset:1} 90% {stroke-dashoffset:0} 100% {stroke-dashoffset:0} }

                      @keyframes mz-goal { 0%,89% {opacity:0; transform:scale(0.5)} 92% {opacity:1; transform:scale(1.25)} 94% {opacity:1; transform:scale(1)} 100% {opacity:1; transform:scale(1)} }

                      .mz-wrap { position:relative; }
                      .mz-start-seg { animation: mz-start 26s linear infinite; }
                      .mz-fork1A-pulse { animation: mz-fork1A 26s linear infinite; transform-origin: 30px 90px; }
                      .mz-branch1-seg { animation: mz-branch1 26s linear infinite; }
                      .mz-deadend1-mark { animation: mz-deadend1 26s linear infinite; transform-origin: 150px 140px; }
                      .mz-backtrack1-lbl { animation: mz-backtrack1 26s linear infinite; }
                      .mz-fork1B-pulse { animation: mz-fork1B 26s linear infinite; transform-origin: 30px 90px; }
                      .mz-continue1-seg { animation: mz-continue1 26s linear infinite; }

                      .mz-fork2A-pulse { animation: mz-fork2A 26s linear infinite; transform-origin: 30px 150px; }
                      .mz-branch2-seg { animation: mz-branch2 26s linear infinite; }
                      .mz-deadend2-mark { animation: mz-deadend2 26s linear infinite; transform-origin: 90px 200px; }
                      .mz-backtrack2-lbl { animation: mz-backtrack2 26s linear infinite; }
                      .mz-fork2B-pulse { animation: mz-fork2B 26s linear infinite; transform-origin: 30px 150px; }
                      .mz-continue2-seg { animation: mz-continue2 26s linear infinite; }

                      .mz-fork3A-pulse { animation: mz-fork3A 26s linear infinite; transform-origin: 30px 200px; }
                      .mz-branch3-seg { animation: mz-branch3 26s linear infinite; }
                      .mz-deadend3-mark { animation: mz-deadend3 26s linear infinite; transform-origin: 205px 145px; }
                      .mz-backtrack3-lbl { animation: mz-backtrack3 26s linear infinite; }
                      .mz-fork3B-pulse { animation: mz-fork3B 26s linear infinite; transform-origin: 30px 200px; }
                      .mz-continue3-seg { animation: mz-continue3 26s linear infinite; }

                      .mz-goal-mark { animation: mz-goal 26s linear infinite; transform-origin: 270px 240px; }

                      @keyframes mz-fork1-dot { 0%,3% {opacity:0} 4% {opacity:1} 100% {opacity:1} }
                      @keyframes mz-fork2-dot { 0%,31% {opacity:0} 32% {opacity:1} 100% {opacity:1} }
                      @keyframes mz-fork3-dot { 0%,59% {opacity:0} 60% {opacity:1} 100% {opacity:1} }
                      .mz-fork1-dot { animation: mz-fork1-dot 26s linear infinite; }
                      .mz-fork2-dot { animation: mz-fork2-dot 26s linear infinite; }
                      .mz-fork3-dot { animation: mz-fork3-dot 26s linear infinite; }
                    `}</style>

                    <div className="mt-3 rounded-lg bg-slate-950 p-3 flex justify-center mz-wrap">
                      <svg viewBox="0 0 300 270" className="w-full max-w-[280px]" xmlns="http://www.w3.org/2000/svg">
                        {/* ── Maze walls: one connected corridor system — trunk plus 3 dead-end branches, fully drawn upfront; only the tracer below animates through it ── */}
                        <g stroke="#22ff77" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" fill="none">
                          <path d="M30,22 L30,240 L270,240" />
                          <path d="M30,90 L150,90 L150,140" />
                          <path d="M30,150 L90,150 L90,200" />
                          <path d="M30,200 L205,200 L205,145" />
                        </g>
                        <g stroke="#0b1220" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none">
                          <path d="M30,22 L30,240 L270,240" />
                          <path d="M30,90 L150,90 L150,140" />
                          <path d="M30,150 L90,150 L90,200" />
                          <path d="M30,200 L205,200 L205,145" />
                        </g>

                        {/* ── Start marker ── */}
                        <circle cx="30" cy="22" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
                        <text x="30" y="9" textAnchor="middle" fontSize="8" fill="#f59e0b" fontWeight="700">Start</text>
                        <line x1="30" y1="22" x2="30" y2="90" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="mz-start-seg" />

                        {/* ── Fork 1 ── */}
                        <circle cx="30" cy="90" r="5" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" className="mz-fork1-dot" />
                        <circle cx="30" cy="90" r="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mz-fork1A-pulse" />
                        <path d="M30,90 L150,90 L150,140" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" className="mz-branch1-seg" />
                        <g className="mz-deadend1-mark">
                          <circle cx="150" cy="140" r="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
                          <line x1="146" y1="136" x2="154" y2="144" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                          <line x1="154" y1="136" x2="146" y2="144" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </g>
                        <text x="150" y="160" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="700" className="mz-deadend1-mark">DEAD END</text>
                        <text x="90" y="80" textAnchor="middle" fontSize="7" fill="#fca5a5" fontWeight="700" className="mz-backtrack1-lbl">↩ backtrack</text>
                        <circle cx="30" cy="90" r="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mz-fork1B-pulse" />
                        <line x1="30" y1="90" x2="30" y2="150" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="mz-continue1-seg" />

                        {/* ── Fork 2 ── */}
                        <circle cx="30" cy="150" r="5" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" className="mz-fork2-dot" />
                        <circle cx="30" cy="150" r="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mz-fork2A-pulse" />
                        <path d="M30,150 L90,150 L90,200" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" className="mz-branch2-seg" />
                        <g className="mz-deadend2-mark">
                          <circle cx="90" cy="200" r="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
                          <line x1="86" y1="196" x2="94" y2="204" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                          <line x1="94" y1="196" x2="86" y2="204" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </g>
                        <text x="90" y="220" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="700" className="mz-deadend2-mark">DEAD END</text>
                        <text x="60" y="140" textAnchor="middle" fontSize="7" fill="#fca5a5" fontWeight="700" className="mz-backtrack2-lbl">↩ backtrack</text>
                        <circle cx="30" cy="150" r="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mz-fork2B-pulse" />
                        <line x1="30" y1="150" x2="30" y2="200" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" className="mz-continue2-seg" />

                        {/* ── Fork 3 ── */}
                        <circle cx="30" cy="200" r="5" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" className="mz-fork3-dot" />
                        <circle cx="30" cy="200" r="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mz-fork3A-pulse" />
                        <path d="M30,200 L205,200 L205,145" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" className="mz-branch3-seg" />
                        <g className="mz-deadend3-mark">
                          <circle cx="205" cy="145" r="10" fill="#450a0a" stroke="#ef4444" strokeWidth="2" />
                          <line x1="201" y1="141" x2="209" y2="149" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                          <line x1="209" y1="141" x2="201" y2="149" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                        </g>
                        <text x="205" y="128" textAnchor="middle" fontSize="7" fill="#ef4444" fontWeight="700" className="mz-deadend3-mark">DEAD END</text>
                        <text x="115" y="190" textAnchor="middle" fontSize="7" fill="#fca5a5" fontWeight="700" className="mz-backtrack3-lbl">↩ backtrack</text>
                        <circle cx="30" cy="200" r="5" fill="none" stroke="#f59e0b" strokeWidth="2.5" className="mz-fork3B-pulse" />
                        <path d="M30,200 L30,240 L270,240" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" className="mz-continue3-seg" />

                        {/* ── Goal ── */}
                        <g className="mz-goal-mark">
                          <circle cx="270" cy="240" r="12" fill="#052e16" stroke="#22c55e" strokeWidth="2" />
                          <path d="M270,233 V247 M270,233 H278 L275,236.5 L278,240 H270" stroke="#22c55e" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                        </g>
                        <text x="270" y="260" textAnchor="middle" fontSize="7" fill="#22c55e" fontWeight="700" className="mz-goal-mark">GOAL</text>
                      </svg>
                    </div>
                    <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 pl-4">
                      At each of the three forks, a dead-end branch is tried first and abandoned — the path is undone back to the fork — before the correct direction is tried, until the goal is reached.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Divide and Conquer
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Breaks a large problem down into smaller, similar subproblems, solves each one recursively, and then combines the results into a final answer.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Dynamic Programming
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Stores the results of subproblems that repeat, so they don't have to be recalculated every time. This makes the algorithm much faster on problems with overlapping work.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Data Structures ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['data-structures'] = el; }}
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Data Structures
              </h2>

              <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                  Official Definition
                </p>
                <p className="text-base md:text-lg font-bold text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  A data structure is a way of organising and storing data in memory so that it can be accessed and manipulated efficiently. It defines how individual pieces of data relate to one another.
                </p>
              </div>

              <div className="mt-4 p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4">
                  Advantages
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Efficient Memory Use
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      A good data structure stores information in a way that avoids wasting memory, which matters more as the amount of data grows.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Improved Performance
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Choosing the right structure makes algorithms run faster, since some structures are built for quick searching, sorting, or updating.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Better Organisation
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Data structures give programmers a clear, predictable way to arrange data, which makes programs easier to read and reason about.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Reusability
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Common data structures like lists and trees can be reused across many different programs and problems, saving time and effort.
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mt-2 mb-3">
                Linear vs Non-Linear
              </h3>
              <div className="mt-2">
                <Table
                  headers={["Linear", "Non-Linear"]}
                  rows={[
                    ["Data is arranged one after another, in a single sequence.", "Data is not arranged in a simple sequence and can branch or connect in multiple ways."],
                    ["Elements are accessed one at a time, in order.", "Elements can be reached through several different paths."],
                    ["Examples include arrays, lists, stacks, and queues.", "Examples include trees, graphs, and maps."],
                    ["Traversal simply moves from one end to the other.", "Traversal needs special methods, such as depth-first or breadth-first search."],
                  ]}
                />
              </div>

              <hr className="my-6 border-t border-slate-200 dark:border-slate-700" />

              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mt-2 mb-3">
                Static vs Dynamic
              </h3>
              <div className="mt-2">
                <Table
                  headers={["Static", "Dynamic"]}
                  rows={[
                    ["Memory is set aside before the program runs, at compile time.", "Memory is set aside while the program is running, at runtime."],
                    ["The size is fixed and cannot change once created.", "The size can grow or shrink as the program needs."],
                    ["Less flexible, since space must be decided in advance.", "More flexible, since space adjusts automatically to the data."],
                    ["Arrays are a common example.", "Linked lists, stacks, queues, trees, and graphs are common examples."],
                  ]}
                />
              </div>

              <div className="mt-6 p-5 bg-white dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-lg font-bold text-black dark:text-white mb-4">
                  Major Operations
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Insertion
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Adds a new element into the data structure, either at a specific position or wherever the structure allows.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Deletion
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Removes an existing element from the data structure, freeing up its space for other data.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Search
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Looks through the data structure to find a specific element, using a method suited to how the data is organised.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Traversal
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Visits every element in the data structure, usually to display them or apply an operation to each one.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Update
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Changes the value of an element that already exists within the data structure.
                    </p>
                  </div>
                  <div>
                    <p className="flex gap-2 text-base font-bold text-black dark:text-white leading-relaxed">
                      <span>•</span> Sorting
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                      Rearranges the elements into a specific order, such as ascending or descending, to make searching and processing easier.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 5: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Paradigms & OOP</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Imperative:</strong> Step‑by‑step commands</li>
                    <li><strong>OOP:</strong> Objects with data + methods</li>
                    <li><strong>Functional:</strong> Functions as building blocks</li>
                    <li><strong>Event‑Driven:</strong> Reactive to events</li>
                    <li><strong>Encapsulation:</strong> Data hiding</li>
                    <li><strong>Polymorphism:</strong> Many forms</li>
                    <li><strong>Inheritance:</strong> Parent‑child classes</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Algorithms</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Finite:</strong> Terminates</li>
                    <li><strong>Definite:</strong> Clear steps</li>
                    <li><strong>Effective:</strong> Executable</li>
                    <li><strong>Input/Output:</strong> Takes input, produces output</li>
                    <li><strong>Brute Force:</strong> Try all solutions</li>
                    <li><strong>Greedy:</strong> Locally optimal choices</li>
                    <li><strong>Divide & Conquer:</strong> Break down, combine</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Data Structures</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Linear:</strong> Arrays, Lists, Stacks, Queues</li>
                    <li><strong>Non‑Linear:</strong> Trees, Graphs, Maps</li>
                    <li><strong>Static:</strong> Fixed size (e.g., Array)</li>
                    <li><strong>Dynamic:</strong> Variable size (e.g., List)</li>
                    <li><strong>Operations:</strong> Insert, Delete, Search, Traverse</li>
                    <li><strong>Goal:</strong> Efficient memory & performance</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Compare and contrast OOP and POP" or "Explain the advantages of using data structures" are common questions. Focus on real‑world applications and clear, structured answers.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Practice it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Programming Insight
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
                  <span>OOP Pillars</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Data Structure Types</span>
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
                The choice of paradigm, algorithm, and data structure dramatically affects your program's
                efficiency, maintainability, and clarity. Always consider the problem domain before deciding.
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
                <strong className="text-white">Programming paradigms</strong> shape how we structure code – choose the right one for the problem.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">OOP concepts</strong> (Encapsulation, Polymorphism, Inheritance, Abstraction) promote reusable and maintainable software.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Algorithms</strong> are step‑by‑step procedures; understanding their characteristics and types helps in solving problems efficiently.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Data structures</strong> organise data for efficient access and manipulation – choose wisely based on usage patterns.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from understanding core concepts and being able to compare and contrast different approaches.
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
            Sidemann Academic Registry • Programming Paradigms & Data Structures 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
