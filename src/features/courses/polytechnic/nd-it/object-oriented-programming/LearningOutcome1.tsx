import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  GraduationCap,
  Rocket,
  Brain,
  ChevronRight,
  Terminal,
  Database,
  Layout,
  CheckCircle,
  Clock,
  BookOpen,
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
  RefreshCw,
  Search,
  Cpu,
  HardDrive,
  Server,
  Network,
  Shield,
  Lock,
  Key,
  UserCheck,
  UserX,
  Cloud,
  GitBranch,
  Zap,
  Wifi,
  Trash2,
  Upload,
  Download,
  CloudOff,
  HardDrive as HardDriveIcon,
  Lightbulb,
  BarChart3,
  FileText,
  FileCode,
  GitPullRequest,
  Package,
  Box,
  Coffee,
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'structure', label: 'Structure' },
  { id: 'visual-studio', label: 'Visual Studio' },
  { id: 'errors', label: 'Errors' },
  { id: 'dotnet-framework', label: '.NET Framework' },
  { id: 'dotnet-architecture', label: '.NET Architecture' },
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
        text: 'C# was originally codenamed "Cool" (C-like Object Oriented Language) during development at Microsoft.',
      },
      {
        title: 'Pro Tip',
        text: 'The .NET Framework includes the Common Language Runtime (CLR) which provides automatic memory management through garbage collection.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the program structure: using → namespace → class → Main() → statements.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse compile-time errors (syntax) with runtime errors (exceptions). They require different handling strategies.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'C# was originally codenamed "Cool" (C-like Object Oriented Language) during development at Microsoft.',
      },
      {
        title: 'Pro Tip',
        text: 'The .NET Framework includes the Common Language Runtime (CLR) which provides automatic memory management through garbage collection.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the program structure: using → namespace → class → Main() → statements.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse compile-time errors (syntax) with runtime errors (exceptions). They require different handling strategies.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Copy to clipboard
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  // ─── Quiz state ──────────────────────────────────────────────────────────
  const [quiz1Answer, setQuiz1Answer] = useState<number | null>(null);
  const [quiz2Answer, setQuiz2Answer] = useState<number | null>(null);
  const [quiz3Answer, setQuiz3Answer] = useState<number | null>(null);
  const [quiz4Answer, setQuiz4Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch(quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
    }
  };

  // ─── Code Snippets (unchanged content) ────────────────────────────────
  const commentsCode = `// This is a single-line comment
    /* This is a multi-line comment
       You can use it to explain complex parts of your code */`;
  const usingDirectiveCode = `using System; // Using the System namespace
    // Now you can use functionalities like Console.WriteLine()`;
  const namespaceCode = `namespace MyProgramNamespace // Defining a custom namespace
    {
     // Your program code goes here
    }`;
  const classDefinitionCode = `public class MyClass // Public means accessible from anywhere
    {
      // Properties (data)
      public string Name { get; set; }
      public int Age { get; } // Read-only property
    
      // Methods (functions)
      public void Greet()
      {
        Console.WriteLine("Hello from MyClass!");
      }
    }`;
  const mainMethodCode = `static void Main(string[] args) // Main method
    {
      // Your program logic goes here
      Console.WriteLine("This is the main method!");
    
      // Creating an object of MyClass
      MyClass obj = new MyClass();
      obj.Greet(); // Calling the Greet() method
    }`;
  const methodBodyCode = `public void DoSomething(int number)
    {
      if (number > 10) // Conditional statement
      {
        Console.WriteLine("Number is greater than 10!");
      }
      else
      {
        Console.WriteLine("Number is 10 or less.");
      }
    
      for (int i = 0; i < 5; i++) // Loop statement
      {
        Console.WriteLine("Value of i: {0}", i);
      }
    }`;
  const tryCatchExampleCode = `try
    {
      // Code that might throw an error (e.g., division by zero)
      int result = 10 / 0;
      Console.WriteLine("Result: {0}", result);
    }
    catch (DivideByZeroException ex)
    {
      Console.WriteLine("Error: Division by zero!");
      Console.WriteLine("Exception details: {0}", ex.Message);
    }`;

  // ─── Table Component ──────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-[#121212]">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 dark:bg-[#1a1a1a]">
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
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#121212]' : 'bg-slate-50 dark:bg-[#1a1a1a]'}>
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

  // ─── Code Block ──────────────────────────────────────────────────────────
  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => {
    const highlightSyntax = (code: string): React.ReactNode => {
      let escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const placeholders: Record<string, string> = {};
      let counter = 0;

      // Extract comments
      escaped = escaped.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
        const key = `__COMMENT_${counter++}__`;
        placeholders[key] = `<span class="text-[#57A64A] dark:text-[#6a9955] italic">${match}</span>`;
        return key;
      });

      // Extract strings
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
        'switch', 'case', 'break', 'continue', 'default'
      ];
      const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
      escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

      // Primitive types
      const types = [
        'int', 'string', 'double', 'bool', 'char', 'float', 'decimal', 'long',
        'short', 'byte', 'sbyte', 'uint', 'ulong', 'ushort', 'object', 'var'
      ];
      const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
      escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

      // Classes / library types
      const classes = [
        'Console', 'Math', 'Program', 'Person', 'MyClass', 'DivideByZeroException',
        'FormatException', 'Exception', 'Convert', 'System'
      ];
      const classRegex = new RegExp(`\\b(${classes.join('|')})\\b`, 'g');
      escaped = escaped.replace(classRegex, '<span class="text-[#0d9488] dark:text-[#4EC9B0]">$1</span>');

      // Methods (words followed by '(')
      escaped = escaped.replace(/(?<![<>"'])\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-[#DCDCAA]">$1</span>');

      // Numbers
      escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#16a34a] dark:text-[#b5cea8]">$1</span>');

      // Restore placeholders
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

    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
          <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
          <button
            onClick={() => copyToClipboard(code, id)}
            className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
          >
            {copiedId === id ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-slate-50 dark:bg-[#0a0a0b] p-4 overflow-x-auto">
          {highlightSyntax(code)}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Code size={14} className="inline mr-1" /> C# AND .NET
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Evolution: C# and .NET
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the evolution of C# and .NET, the structure of a C# program,
            the Visual Studio IDE, error handling, and the .NET Framework architecture.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Code size={14} className="inline mr-1" /> C#
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> .NET
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
                placeholder="Search for a concept, version, or code snippet..."
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
          <div ref={listContainerRef} className="space-y-12">
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introduction to C# and .NET
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    C# and .NET have come a long way since their debut, making them a powerful duo for application development. This learning outcome covers their evolution, the structure of C# programs, the Visual Studio IDE, error handling, and the .NET Framework architecture. Together, these form the foundation for building robust applications on the Microsoft platform.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of C# as the language you speak (like English) and .NET as the library of books and resources you use to build things. The Visual Studio IDE is your workshop where you bring everything together.
                </p>
              </div>
            </div>

            {/* Evolution */}
            <div
              ref={(el) => {
                sectionRefs.current['evolution'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evolution of C# and .NET
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Early Days (2002): A Simple Melody</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">C# 1.0 and .NET Framework 1.0: Fresh on the scene, C# aimed to be a modern, object-oriented language inspired by C++, Java, and Delphi. It offered a familiar feel for developers while introducing new features. .NET Framework provided a foundation of libraries and tools for building Windows applications.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Getting Groovy (2005-2010): The Rise of Features</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">C# 2.0 and .NET Framework 2.0 brought generics, nullable types, and partial types. C# 3.0 and .NET Framework 3.5 introduced lambda expressions, extension methods, and automatic properties.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Modern Moves (2012-2019): Embracing Change</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">C# 4.0 introduced async programming and improved interoperability. C# 5.0 refined async. C# 6.0 added expression-bodied members. C# 7.0 brought pattern matching and out variables. C# 8.0 introduced nullable reference types and switch expressions.</p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">The Future's Bright (2019-Present): A Continuous Groove</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300">C# 9.0 and .NET 5 brought top-level statements and records. C# 10 and .NET 6 introduced minimal interfaces and global usings. .NET transitioned from Windows-only to cross-platform (Windows, macOS, Linux).</p>
                </div>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which version of C# introduced lambda expressions and extension methods?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 2)} /> a) C# 2.0
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 2)} /> b) C# 3.0
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 2)} /> c) C# 4.0
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 2 ? '✅ Correct! C# 3.0 introduced lambdas and extension methods.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Structure of a C# Program */}
            <div
              ref={(el) => {
                sectionRefs.current['structure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Structure of a C# Program
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Comments</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Comments are lines ignored by the compiler but included for human understanding. They help explain the code's purpose.</p>
                  <CodeBlock code={commentsCode} title="C#" id="comments" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Using Directive</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">The using directive imports specific namespaces, grouping related functionalities (e.g., System for basic functionalities).</p>
                  <CodeBlock code={usingDirectiveCode} title="C#" id="using" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Namespace</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">A namespace is a container for classes, interfaces, and other elements. It helps organise code and avoid naming conflicts.</p>
                  <CodeBlock code={namespaceCode} title="C#" id="namespace" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Class Definition</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">A class is a blueprint for creating objects. It defines properties (data) and methods (functions).</p>
                  <CodeBlock code={classDefinitionCode} title="C#" id="classdef" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Main( ) Method</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">The Main() method is the entry point of a C# program. Execution starts from here.</p>
                  <CodeBlock code={mainMethodCode} title="C#" id="mainmethod" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Method Body Statements</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Method bodies contain the actual code executed when the method is called – variable declarations, conditionals, loops, and expressions.</p>
                  <CodeBlock code={methodBodyCode} title="C#" id="methodbody" />
                </div>
              </div>
            </div>

            {/* Visual Studio IDE */}
            <div
              ref={(el) => {
                sectionRefs.current['visual-studio'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Visual Studio IDE
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Visual Studio, made by Microsoft, is an Integrated Development Environment (IDE) specifically designed to streamline the software development process. It's like a developer's all-in-one workstation.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Code Editing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Powerful code editor with syntax highlighting, code completion, and code refactoring. Supports C#, C++, Python, JavaScript, and more.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Debugging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Step through code line by line, inspect variables, and set breakpoints to pause execution at specific points.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Project Management</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Organise code, resources, and configurations. Create solutions grouping related projects and manage dependencies.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Building and Deployment</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Build code into executable programs or deploy to web servers. Manage build configurations and packaging.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Version Control Integration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Integrates seamlessly with Git, allowing you to track changes, collaborate, and revert to previous versions.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Visual Designers (Optional)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Drag-and-drop UI elements for graphical applications (Windows desktop, mobile apps).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Extensibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Extend functionality with extensions from a vast marketplace, adding new features and language support.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Multiple Editions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Free Community edition for individuals and open-source; Professional and Enterprise for larger teams and complex projects.</p>
                </div>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which Visual Studio feature allows you to step through code line by line?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) Code Editing
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) Debugging
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) Building and Deployment
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Debugging allows stepping through code.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Errors in C# */}
            <div
              ref={(el) => {
                sectionRefs.current['errors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Errors in C#
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Running into errors is inevitable, but C# provides mechanisms to gracefully handle them. Here's a breakdown of error types and handling.</p>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">Types of Errors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Compile-Time Errors</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Detected during compilation – syntax mistakes, logical errors in code structure, referencing non-existent classes/methods. Fixed before running.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Runtime Errors (Exceptions)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Occur while executing – division by zero, accessing non-existent array index, network failures. Can crash if not handled.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Handling Errors with try-catch</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">C# provides a structured approach using try-catch blocks:</p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li><strong>try Block:</strong> Code that might throw an error.</li>
                <li><strong>catch Block:</strong> Catches specific exceptions; multiple catch blocks for different exception types.</li>
              </ul>
              <CodeBlock code={tryCatchExampleCode} title="C#" id="trycatch" />

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">💡 Key Points</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Anticipate errors and wrap them in try-catch. Multiple catch blocks for specific exceptions – order matters (specific before broad). Use finally block for code that always runs (e.g., closing files).</p>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which type of error is detected during compilation before the program runs?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 0)} /> a) Compile-Time Error
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 0)} /> b) Runtime Error (Exception)
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 0 ? '✅ Correct! Compile-time errors are detected before execution.' : '❌ Incorrect. The correct answer is a.'}
                  </div>
                )}
              </div>
            </div>

            {/* .NET Framework */}
            <div
              ref={(el) => {
                sectionRefs.current['dotnet-framework'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                .NET Framework: Foundation for Windows Applications
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">The .NET Framework, developed by Microsoft, is a software development platform for building Windows applications. It provides a comprehensive set of tools and functionalities.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Definition</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">The .NET Framework is a managed runtime environment (MRE) that includes:</p>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Common Language Runtime (CLR):</strong> Execution engine managing memory, garbage collection, security, thread execution. Allows cross-language interoperability.</li>
                  <li><strong>.NET Framework Class Library (FCL):</strong> Vast collection of pre-written classes for file system access, networking, database interaction, UI development.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Implementations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Windows-Only Implementation (Original)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Traditional .NET Framework, tightly coupled with Windows. Leverages Windows features for optimal performance. Go-to for Windows desktop applications, web services.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">.NET: The Cross-Platform Evolution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Successor to .NET Framework. Cross-platform – runs on Windows, macOS, Linux, and web browsers. Shares core concepts but provides more flexibility.</p>
                </div>
              </div>

              <Table
                headers={["Feature", ".NET Framework", ".NET"]}
                rows={[
                  ["Platform", "Windows Only", "Windows, macOS, Linux, WebAssembly"],
                  ["Focus", "Windows development", "Cross-platform development"],
                  ["CLR", "Included", "Included as separate component (dotnet.exe)"],
                  ["Class Library", ".NET Framework Class Library (FCL)", "Variety of .NET libraries (e.g., .NET Standard)"],
                  ["Development Tools", "Visual Studio (Windows only)", "Visual Studio (all platforms), .NET CLI"],
                ]}
                title="Comparison"
              />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Choosing Between .NET Framework and .NET</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">For Windows-specific development, .NET Framework is solid. For cross-platform needs, .NET is better. Consider your project requirements.</p>
              </div>
            </div>

            {/* .NET Architecture */}
            <div
              ref={(el) => {
                sectionRefs.current['dotnet-architecture'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                .NET Framework Architecture
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">Common Language Runtime (CLR)</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Heart of the .NET Framework – managed runtime environment. Provides:</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Memory Management:</strong> Automatic garbage collection – prevents memory leaks.</li>
                    <li><strong>Security:</strong> Code access control and sandboxing.</li>
                    <li><strong>Thread Management:</strong> Creation, scheduling, synchronization.</li>
                    <li><strong>Just-In-Time (JIT) Compilation:</strong> Compiles code to machine code at runtime.</li>
                    <li><strong>Cross-Language Interoperability (CLI):</strong> Allows .NET languages to interact.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">.NET Framework Class Library (FCL)</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive library of pre-written, reusable code:</p>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>File System Access</li>
                    <li>Networking</li>
                    <li>Database Interaction</li>
                    <li>User Interface Development (Windows Forms, WPF)</li>
                    <li>Data Structures and Algorithms</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Advantages and Disadvantages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Rich Class Library (FCL)</li>
                    <li>Mature and Stable</li>
                    <li>Security Focus (CLR)</li>
                    <li>Good Performance (JIT)</li>
                    <li>Seamless Integration with Visual Studio</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Limited Platform Support (Windows-only)</li>
                    <li>Vendor Lock-In (Microsoft)</li>
                    <li>Steeper Learning Curve</li>
                    <li>Potential Licensing Costs</li>
                  </ul>
                </div>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What does the CLR provide in the .NET Framework?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 2)} /> a) Just the class library
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 2)} /> b) Only garbage collection
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 2)} /> c) Memory management, security, thread management, JIT compilation, and cross-language interoperability
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 2 ? '✅ Correct! The CLR provides all these services.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know C# Evolution Highlights</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">2002: C# 1.0 (managed code, basic OOP); 2005-2007: generics, LINQ, lambdas; 2012-2019: async/await, pattern matching; 2020-2021: records, top-level, global usings.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Program Structure Order</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">using → namespace → class → Main() → statements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Error Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Compile-time (syntax) vs Runtime (exceptions). Try-catch handles runtime errors.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 .NET Framework vs .NET</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">.NET Framework is Windows-only; .NET (5+) is cross-platform (Windows, macOS, Linux).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 CLR and FCL</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">CLR = execution engine (memory, security, threads, JIT). FCL = class library (pre-written code).</p>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-lg text-indigo-800 dark:text-indigo-300 mb-4">📋 Quick Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">C# Evolution</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">4 eras</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Program Structure</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">5 parts</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Error Types</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">.NET Components</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">CLR, FCL</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">.NET vs .NET Framework</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Cross-platform vs Windows</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Code. Debug. Innovate. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 C# Insight
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
                  <span>C# Versions Covered</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10+</span>
                </li>
                <li className="flex justify-between">
                  <span>Code Snippets</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                C# and .NET are constantly evolving. Focus on understanding the core concepts – program structure, error handling, and the CLR/FCL. Remember the key differences between .NET Framework and .NET. Practice writing small programs to solidify your understanding.
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
                <strong className="text-white">C# and .NET</strong> have evolved from Windows-only to cross-platform, with C# 1.0 through to C# 10 introducing modern features like lambdas, async/await, pattern matching, and records.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">A C# program</strong> follows a structure: using directives → namespace → class → Main() method → statements.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Visual Studio</strong> is a powerful IDE providing code editing, debugging, project management, and version control integration.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Errors</strong> are of two types: compile-time (syntax) and runtime (exceptions). Use try-catch blocks to handle exceptions gracefully.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The .NET Framework</strong> consists of the CLR (execution engine) and FCL (class library). .NET is the cross-platform successor to the Windows-only .NET Framework.
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
            Sidemann Academic Registry • Evolution: C# and .NET 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;