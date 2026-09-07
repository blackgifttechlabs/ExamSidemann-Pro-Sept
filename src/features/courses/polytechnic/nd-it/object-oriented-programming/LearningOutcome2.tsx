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
  Box, // Replaced Cube
  Layers,
  Key as KeyIcon,
  Wrench, // Replaced Tool
} from 'lucide-react';
import { AdSense } from '../../../../analytics/AdSense';
import { useLessonState } from '../../../lessonProgress';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'class-object', label: 'Class vs Object' },
  { id: 'constructors', label: 'Constructors & Destructors' },
  { id: 'access-modifiers', label: 'Access Modifiers' },
  { id: 'encapsulation', label: 'Encapsulation' },
  { id: 'inheritance', label: 'Inheritance' },
  { id: 'polymorphism', label: 'Polymorphism' },
  { id: 'exam-tips', label: 'Exam Tips' },
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
        text: 'A class is a blueprint; an object is an instance. Think of a cookie cutter (class) and the actual cookies (objects).',
      },
      {
        title: 'Pro Tip',
        text: 'Use encapsulation to hide internal state and expose only necessary methods – it improves maintainability and reduces bugs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of OOP: Encapsulation, Inheritance, Polymorphism – "EIP".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse constructors (initialize objects) with destructors (clean up unmanaged resources). Constructors are called with `new`; destructors are called by the garbage collector.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A class is a blueprint; an object is an instance. Think of a cookie cutter (class) and the actual cookies (objects).',
      },
      {
        title: 'Pro Tip',
        text: 'Use encapsulation to hide internal state and expose only necessary methods – it improves maintainability and reduces bugs.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of OOP: Encapsulation, Inheritance, Polymorphism – "EIP".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse constructors (initialize objects) with destructors (clean up unmanaged resources). Constructors are called with `new`; destructors are called by the garbage collector.',
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
  const [quiz5Answer, setQuiz5Answer] = useState<number | null>(null);

  const [showQuiz1Result, setShowQuiz1Result] = useState(false);
  const [showQuiz2Result, setShowQuiz2Result] = useState(false);
  const [showQuiz3Result, setShowQuiz3Result] = useState(false);
  const [showQuiz4Result, setShowQuiz4Result] = useState(false);
  const [showQuiz5Result, setShowQuiz5Result] = useState(false);

  const checkAnswer = (quizNumber: number, selectedAnswer: number, correctAnswer: number) => {
    switch(quizNumber) {
      case 1: setQuiz1Answer(selectedAnswer); setShowQuiz1Result(true); break;
      case 2: setQuiz2Answer(selectedAnswer); setShowQuiz2Result(true); break;
      case 3: setQuiz3Answer(selectedAnswer); setShowQuiz3Result(true); break;
      case 4: setQuiz4Answer(selectedAnswer); setShowQuiz4Result(true); break;
      case 5: setQuiz5Answer(selectedAnswer); setShowQuiz5Result(true); break;
    }
  };

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

  // ─── Code Snippets ──────────────────────────────────────────────────────

  const classVsObjectCode = `public class Car // Class definition (blueprint)
{
  public string Model { get; set; } // Property (data)
  public int Year { get; set; } // Property (data)

  public void StartEngine() // Method (function)
  {
    Console.WriteLine("Engine started!");
  }
}

// ... in another part of the code (e.g., Main method) ...
Car myCar = new Car(); // Creating an object of the Car class
myCar.Model = "Tesla Model S"; // Assigning values to object properties
myCar.Year = 2024;
myCar.StartEngine(); // Calling a method on the object`;

  const constructorCode = `public class Car
{
  public string Model { get; set; }
  public int Year { get; set; }

  // Constructor with parameters
  public Car(string model, int year)
  {
    Model = model; // Initialize Model property
    Year = year;   // Initialize Year property
    Console.WriteLine($"A {Year} {Model} was created!");
  }
}

// ... later in the code ...
Car myCar = new Car("Ford Mustang", 2020); // Constructor is called here`;

  const accessPublicCode = `public class MyClass
{
  public string PublicData = "Accessible Everywhere";
}`;

  const accessPrivateCode = `public class MyClass
{
  private int _secretCounter = 0; // Only accessible inside MyClass

  public void IncrementCounter()
  {
    _secretCounter++; // OK, accessed from within the class
  }
}`;

  const accessProtectedCode = `public class BaseClass
{
  protected string FamilySecret = "Shared within family";
}

public class DerivedClass : BaseClass
{
  public void RevealSecret()
  {
    Console.WriteLine(FamilySecret); // OK, accessed from derived class
  }
}`;

  const accessInternalCode = `// In MyLibrary.dll
internal class HelperUtility
{
  // ... utility methods ...
}`;

  const shapeExampleCode = `using System;
using System.Collections.Generic;

// Base class (Encapsulation: private fields, public properties/methods)
public abstract class Shape
{
    // Encapsulated data (can only be accessed via property)
    private string _color;

    public string Color
    {
        get { return _color; }
        protected set { _color = value; } // Protected set allows derived classes to set color
    }

    // Constructor
    public Shape(string color)
    {
        this.Color = color;
    }

    // Abstract method - must be implemented by derived classes (Polymorphism)
    public abstract double GetArea();

    // Virtual method - can be optionally overridden (Polymorphism)
    public virtual void DisplayInfo()
    {
        Console.WriteLine($"Color: {Color}");
    }
}

// Derived class (Inheritance)
public class Circle : Shape
{
    public double Radius { get; private set; } // Encapsulated property

    // Constructor calls base constructor
    public Circle(string color, double radius) : base(color)
    {
        Radius = radius;
    }

    // Override abstract method (Polymorphism)
    public override double GetArea()
    {
        return Math.PI * Radius * Radius;
    }

    // Override virtual method (Polymorphism)
    public override void DisplayInfo()
    {
        base.DisplayInfo(); // Call base method
        Console.WriteLine($"Type: Circle, Radius: {Radius}");
    }
}

// Another derived class (Inheritance)
public class Rectangle : Shape
{
    public double Width { get; private set; }
    public double Height { get; private set; }

    public Rectangle(string color, double width, double height) : base(color)
    {
        Width = width;
        Height = height;
    }

    public override double GetArea()
    {
        return Width * Height;
    }

    public override void DisplayInfo()
    {
        base.DisplayInfo();
        Console.WriteLine($"Type: Rectangle, Width: {Width}, Height: {Height}");
    }
}

public class Program
{
    static void Main(string[] args)
    {
        List<Shape> shapes = new List<Shape>();
        shapes.Add(new Circle("Red", 5.0));
        shapes.Add(new Rectangle("Blue", 4.0, 6.0));
        shapes.Add(new Circle("Green", 2.5));

        Console.WriteLine("--- Shape Details ---");
        foreach (Shape shape in shapes)
        {
            shape.DisplayInfo(); // Polymorphic call to DisplayInfo
            Console.WriteLine($"Area: {shape.GetArea():F2}"); // Polymorphic call to GetArea
            Console.WriteLine("--------------------");
        }
    }
}`;

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
        'FormatException', 'Exception', 'Convert', 'System', 'Shape', 'Circle', 'Rectangle',
        'List', 'ArgumentOutOfRangeException'
      ];
      const classRegex = new RegExp(`\\b(${classes.join('|')})\\b`, 'g');
      escaped = escaped.replace(classRegex, '<span class="text-[#0d9488] dark:text-[#4EC9B0]">$1</span>');

      // Methods (run last)
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Box size={14} className="inline mr-1" /> OBJECT-ORIENTED PROGRAMMING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              OOP Principles in C#
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the core principles of object‑oriented programming: classes,
            objects, constructors, access modifiers, encapsulation, inheritance,
            and polymorphism – all applied in C#.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Box size={14} className="inline mr-1" /> Classes
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
                placeholder="Search for a concept, access modifier, or code snippet..."
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
                Introduction to Object‑Oriented Programming in C#
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Object‑oriented programming (OOP) is a programming paradigm that organises code around "objects" – data structures that contain both data (properties) and behaviour (methods). C# is a fully object‑oriented language, and mastering its OOP principles is essential for building maintainable, scalable applications.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of OOP like building a house. You have a blueprint (class) that defines the structure (properties) and functionality (methods). You then build actual houses (objects) from that blueprint – each house can have different colours or furniture, but they all follow the same design.
                </p>
              </div>
            </div>

            {/* Class vs Object */}
            <div
              ref={(el) => {
                sectionRefs.current['class-object'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Class vs Object
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Class</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A class is a blueprint or template that defines properties (data) and methods (functions) for objects. It's a reusable specification – like a cookie cutter.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Object</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">An object is an instance of a class – a concrete entity with actual data. You can create many objects from one class, each with its own values.</p>
                </div>
              </div>

              <Table
                headers={["Feature", "Class", "Object"]}
                rows={[
                  ["Represents", "Blueprint or template", "Concrete instance"],
                  ["Reusability", "Reusable", "Not reusable (multiple objects from same class)"],
                  ["Properties", "Defines data fields", "Holds values for those fields"],
                  ["Methods", "Defines functions", "Can execute those functions"],
                ]}
                title="Class vs Object"
              />

              <CodeBlock code={classVsObjectCode} title="C#" id="classVsObject" />

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">In the example, <code>Car</code> is the class (blueprint), and <code>myCar</code> is an object (instance) created from that class.</p>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which of the following is an instance of a class?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 1)} /> a) Class definition
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 1)} /> b) Object created with `new`
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 1)} /> c) A method
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 1 ? '✅ Correct! An object is an instance created with `new`.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Constructors and Destructors */}
            <div
              ref={(el) => {
                sectionRefs.current['constructors'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Constructors and Destructors
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Constructor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A special method called automatically when an object is created with `new`. It initialises the object's state. Has the same name as the class and no return type.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Destructor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A special method (`~ClassName`) used to clean up unmanaged resources before the object is garbage‑collected. Cannot be called explicitly; execution is non‑deterministic.</p>
                </div>
              </div>

              <CodeBlock code={constructorCode} title="C#" id="constructor" />

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Recommended Pattern</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">For deterministic cleanup of managed resources, implement the <code>IDisposable</code> interface and use the `using` statement – it's preferred over relying solely on destructors.</p>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the purpose of a constructor in C#?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) To clean up resources
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) To initialise an object's state
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) To define methods
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Constructors initialise object state.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Access Modifiers */}
            <div
              ref={(el) => {
                sectionRefs.current['access-modifiers'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Access Modifiers
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Access modifiers control the visibility of types and members. They enforce encapsulation by restricting access to internal implementation details.</p>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">public</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessible from any code in the same assembly or another assembly that references it. Most permissive.</p>
                  <CodeBlock code={accessPublicCode} title="C#" id="accessPublic" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">private</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessible only within the same class or struct. Default for members if no modifier specified.</p>
                  <CodeBlock code={accessPrivateCode} title="C#" id="accessPrivate" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">protected</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessible within the same class or in derived classes.</p>
                  <CodeBlock code={accessProtectedCode} title="C#" id="accessProtected" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">internal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessible within the same assembly (project/DLL). Default for top‑level types.</p>
                  <CodeBlock code={accessInternalCode} title="C#" id="accessInternal" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">protected internal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessible within the same assembly OR from derived classes in another assembly.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">private protected</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Accessible only within the same assembly and by derived classes in that assembly. Most restrictive combination.</p>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which access modifier allows a member to be accessed only within the same class?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) public
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) private
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 1)} /> c) protected
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! private restricts access to the same class.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Encapsulation */}
            <div
              ref={(el) => {
                sectionRefs.current['encapsulation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Encapsulation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Encapsulation is the bundling of data (fields) and methods that operate on that data within a single unit – the class. It also involves hiding internal state (using private fields) and exposing a public interface (properties/methods) to control access and maintain integrity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Benefits</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Control & Integrity:</strong> Prevents invalid state.</li>
                    <li><strong>Simplicity:</strong> Hides complexity from users.</li>
                    <li><strong>Maintainability:</strong> Changes to internals don't affect external code.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Implementation</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Use <code>private</code> fields for data.</li>
                    <li>Provide <code>public</code> properties (get/set) or methods to access/modify them.</li>
                    <li>Validate input in setters to ensure consistency.</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">The <code>Shape</code> example below demonstrates encapsulation: the <code>_color</code> field is private, exposed via a public property with controlled access.</p>
            </div>

            {/* Inheritance */}
            <div
              ref={(el) => {
                sectionRefs.current['inheritance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Inheritance
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Inheritance allows a class (derived) to acquire properties and methods from another class (base). It represents an "is‑a" relationship (e.g., a <code>Dog</code> is an <code>Animal</code>). It promotes code reuse and forms the basis for polymorphism.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Types in C#</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Single class inheritance (one base class)</li>
                    <li>Multiple interface implementation</li>
                    <li>Multilevel (A → B → C)</li>
                    <li>Hierarchical (multiple classes from one base)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Benefits</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Code reusability</li>
                    <li>Extensibility</li>
                    <li>Foundation for polymorphism</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">In the <code>Shape</code> example, <code>Circle</code> and <code>Rectangle</code> inherit from <code>Shape</code>, gaining its <code>Color</code> property and the requirement to implement <code>GetArea()</code>.</p>
            </div>

            {/* Polymorphism */}
            <div
              ref={(el) => {
                sectionRefs.current['polymorphism'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Polymorphism
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Polymorphism means "many forms". It allows objects of different classes (related by inheritance) to respond to the same method call in their own way. Two main types: compile‑time (overloading) and runtime (overriding).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Static (Compile‑time)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Method overloading (same name, different params)</li>
                    <li>Operator overloading</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Dynamic (Runtime)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Method overriding with <code>virtual</code> and <code>override</code></li>
                    <li>Abstract methods</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">In the <code>Shape</code> example, <code>GetArea()</code> is abstract (forcing override) and <code>DisplayInfo()</code> is virtual (allowing optional override). In <code>Main</code>, calling <code>shape.GetArea()</code> on a <code>List&lt;Shape&gt;</code> invokes the correct implementation for each object – runtime polymorphism.</p>
            </div>

            {/* Complete Example */}
            <div
              ref={(el) => {
                sectionRefs.current['encapsulation'] = el; // reuse for combined example
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Putting It All Together – Shape Example
              </h2>

              <CodeBlock code={shapeExampleCode} title="C#" id="shapeExample" />

              <div className="p-4 bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Explanation</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                  <li><strong>Encapsulation:</strong> <code>_color</code> private, exposed via property; dimensions private with <code>private set</code>.</li>
                  <li><strong>Inheritance:</strong> <code>Circle</code> and <code>Rectangle</code> inherit from <code>Shape</code>.</li>
                  <li><strong>Polymorphism:</strong> <code>GetArea()</code> abstract overridden; <code>DisplayInfo()</code> virtual overridden; runtime dispatch in <code>Main</code>.</li>
                </ul>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which OOP principle is demonstrated when a derived class provides its own implementation of a base class method?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 2)} /> a) Encapsulation
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 2)} /> b) Inheritance
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 2)} /> c) Polymorphism
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 2 ? '✅ Correct! Polymorphism allows overriding methods to provide specific behaviour.' : '❌ Incorrect. The correct answer is c.'}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Know Class vs Object</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Class = blueprint; object = instance. Be able to explain with an analogy.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Access Modifiers</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">public, private, protected, internal – know the level of access each provides.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Three Pillars</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Encapsulation, Inheritance, Polymorphism – know definitions and examples.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Constructor vs Destructor</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Constructor initializes; destructor cleans up unmanaged resources. Destructors are non‑deterministic.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Polymorphism Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Static (overloading) vs Dynamic (overriding) – be ready to give examples.</p>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-lg text-indigo-800 dark:text-indigo-300 mb-4">📋 Quick Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Class vs Object</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Blueprint vs Instance</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Access Modifiers</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">5 levels</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">OOP Pillars</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Encapsulation, Inheritance, Polymorphism</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Constructor</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Initializes object</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Destructor</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Cleans unmanaged resources</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Design. Encapsulate. Reuse. Extend. 🧩</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 OOP Insight
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
                  <span>Access Modifiers</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>OOP Pillars</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Object‑oriented programming is about modeling real‑world entities and their relationships. Focus on understanding the "why" behind each principle – encapsulation protects integrity, inheritance promotes reuse, polymorphism enables flexibility. Practice writing small classes and linking them together to solidify your understanding.
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
                <strong className="text-white">A class</strong> is a blueprint; an <strong>object</strong> is an instance created from that class. Each object has its own state.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Access modifiers</strong> control visibility: <code>public</code>, <code>private</code>, <code>protected</code>, <code>internal</code>, and combinations – they enforce encapsulation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Encapsulation</strong> bundles data and methods, hiding internal details and protecting integrity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Inheritance</strong> allows code reuse and establishes "is‑a" relationships, enabling polymorphism.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Polymorphism</strong> gives objects the ability to respond to the same method call in different ways – through overloading (static) or overriding (dynamic).
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
            Sidemann Academic Registry • OOP Principles in C# 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;