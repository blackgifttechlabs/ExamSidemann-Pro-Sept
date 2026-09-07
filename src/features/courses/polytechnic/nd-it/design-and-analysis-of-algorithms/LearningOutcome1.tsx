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
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Programming Paradigms
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A <span className="font-bold">programming paradigm</span> is a fundamental style or approach to
                    organising code. Different paradigms dictate how data is structured and how operations are
                    performed. Understanding these paradigms helps you choose the right tool for the job and write
                    cleaner, more maintainable software.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Imperative Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focuses on describing the sequence of steps (commands) to be executed. Variables store data, and control flow (if‑else, loops) guides execution.</p>
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: C, Python (procedural style)</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Object‑Oriented Programming (OOP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Models the real world as objects with properties (data) and behaviours (methods). Promotes code reusability through inheritance and encapsulation.</p>
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Java, C++, Python</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Functional Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Emphasises functions as building blocks. Avoids side effects, treats data as immutable. Functions are first‑class citizens.</p>
                  <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: Haskell, Lisp, JavaScript (functional style)</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Event‑Driven Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reactive – waits for events (clicks, network messages) and responds. Common in GUIs and server‑side systems.</p>
                  <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Example: JavaScript (browser), Node.js</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 2: OOP Concepts ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['oop'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Object‑Oriented Programming Concepts
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Encapsulation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bundling data and methods within a class, hiding internal details. Prevents accidental modification and enforces controlled access.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Polymorphism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Objects of different types can be treated as the same type. Enables generic code and dynamic behaviour (e.g., method overriding).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Inheritance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A class (derived) acquires properties and behaviours from another class (base). Promotes code reusability and hierarchical relationships.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Data Abstraction</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hiding unnecessary details and providing a simplified view. Reduces complexity and focuses on essential features.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Class and Object</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A <strong>class</strong> is a blueprint; an <strong>object</strong> is an instance of a class with its own state.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                Difference Between OOP and POP (Procedural)
              </h3>
              <div className="mt-2">
                <Table
                  headers={["Feature", "OOP", "POP"]}
                  rows={[
                    ["Focus", "Objects and their interactions", "Sequence of instructions"],
                    ["Data", "Encapsulated within objects", "Stored in variables"],
                    ["Code Organization", "Classes and objects", "Procedures and functions"],
                    ["Abstraction", "Inheritance and polymorphism", "Procedures and functions"],
                    ["Reusability", "Promoted via inheritance", "Promoted via modularisation"],
                    ["Modularity", "Encouraged by classes", "Encouraged by procedures"],
                    ["Control Flow", "Often event‑driven or message‑based", "Primarily sequential"],
                    ["Side Effects", "Minimised through encapsulation", "May be more prevalent"],
                  ]}
                />
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">
                C++ Example Demonstrating OOP Concepts
              </h3>
              <div className="mt-2">
                <CodeBlock code={oopCode} title="C++ OOP Example" id="oop-example" />
              </div>
            </div>

            {/* ─── Section 3: Algorithms ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['algorithms'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Algorithms
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">What is an Algorithm?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">A sequence of well‑defined instructions to solve a specific problem or perform a task. In computer science, algorithms are the backbone of problem‑solving and software development.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Characteristics</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Finiteness:</strong> Terminates after finite steps</li>
                    <li><strong>Definiteness:</strong> Each step precisely defined</li>
                    <li><strong>Effectiveness:</strong> Each step executable</li>
                    <li><strong>Input:</strong> Zero or more inputs</li>
                    <li><strong>Output:</strong> At least one output</li>
                    <li><strong>Correctness:</strong> Produces correct output for valid inputs</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Systematic problem‑solving</li>
                    <li>Efficient solutions</li>
                    <li>Clarity and understanding</li>
                    <li>Reusability across contexts</li>
                    <li>Automation capability</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Types of Algorithms</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Brute Force:</strong> Try all solutions – simple but often inefficient.</li>
                  <li><strong>Greedy:</strong> Make locally optimal choices; may not be globally optimal.</li>
                  <li><strong>Recursive:</strong> Call itself on smaller subproblems.</li>
                  <li><strong>Backtracking:</strong> Explore paths and backtrack on dead ends.</li>
                  <li><strong>Divide and Conquer:</strong> Split, solve recursively, combine.</li>
                  <li><strong>Dynamic Programming:</strong> Store results of overlapping subproblems to avoid recomputation.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 4: Data Structures ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['data-structures'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Data Structures
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">What is a Data Structure?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">A way to organise and store data in memory so it can be accessed and manipulated efficiently. It defines the relationship between data elements.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Advantages</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Efficient memory utilisation</li>
                  <li>Improved algorithm performance</li>
                  <li>Better code organisation</li>
                  <li>Enhanced code reusability</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mb-2">
                    Linear vs Non‑Linear
                  </h3>
                  <Table
                    headers={["Feature", "Linear", "Non‑Linear"]}
                    rows={[
                      ["Arrangement", "Sequential", "Not sequential"],
                      ["Access", "One after another", "Multiple ways"],
                      ["Examples", "Arrays, Lists, Stacks, Queues", "Trees, Graphs, Maps"],
                      ["Traversal", "Linear fashion", "Various (DFS, BFS)"],
                    ]}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mb-2">
                    Static vs Dynamic
                  </h3>
                  <Table
                    headers={["Feature", "Static", "Dynamic"]}
                    rows={[
                      ["Memory allocation", "Compile time", "Runtime"],
                      ["Size", "Fixed", "Variable"],
                      ["Flexibility", "Less flexible", "More flexible"],
                      ["Examples", "Arrays", "Linked Lists, Stacks, Queues, Trees, Graphs"],
                    ]}
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Major Operations</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Insertion:</strong> Add a new element</li>
                  <li><strong>Deletion:</strong> Remove an element</li>
                  <li><strong>Search:</strong> Find a specific element</li>
                  <li><strong>Traversal:</strong> Visit all elements</li>
                  <li><strong>Update:</strong> Modify an existing element</li>
                  <li><strong>Sorting:</strong> Arrange in a specific order</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 5: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
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
