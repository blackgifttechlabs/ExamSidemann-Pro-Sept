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
  Monitor,
  Settings,
  Bug,
  Beaker,
  GitMerge,
  FileCode,
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
  { id: 'vs-components', label: 'VS Components' },
  { id: 'vs-pros-cons', label: 'Pros & Cons' },
  { id: 'event-driven', label: 'Event-Driven' },
  { id: 'event-pub-sub', label: 'Publish & Subscribe' },
  { id: 'gui-development', label: 'GUI Development' },
  { id: 'source-control', label: 'Source Control' },
  { id: 'project-types', label: 'Project Types' },
  { id: 'debugging', label: 'Debugging' },
  { id: 'unit-testing', label: 'Unit Testing' },
  { id: 'mocking', label: 'Mocking' },
  { id: 'tdd', label: 'TDD' },
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
        text: 'Visual Studio was first released in 1997 as "Visual Studio 97" – it has evolved into one of the most powerful IDEs available.',
      },
      {
        title: 'Pro Tip',
        text: 'Use F9 to set breakpoints and F10/F11 to step through code – these are the most essential debugging shortcuts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember TDD as "Red, Green, Refactor" – Write a failing test (Red), make it pass (Green), then improve the code (Refactor).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse Event (the notification) with Delegate (the type-safe function pointer that defines event handler signatures).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Visual Studio was first released in 1997 as "Visual Studio 97" – it has evolved into one of the most powerful IDEs available.',
      },
      {
        title: 'Pro Tip',
        text: 'Use F9 to set breakpoints and F10/F11 to step through code – these are the most essential debugging shortcuts.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember TDD as "Red, Green, Refactor" – Write a failing test (Red), make it pass (Green), then improve the code (Refactor).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse Event (the notification) with Delegate (the type-safe function pointer that defines event handler signatures).',
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

  const buttonEventCode = `public class Button
{
  // Declare the event using the built-in EventHandler delegate
  public event EventHandler Click;

  // Method to raise the event (often protected and virtual)
  protected virtual void OnClick(EventArgs e)
  {
      // Check if there are any subscribers before raising
      Click?.Invoke(this, e);
  }

  // Simulate the action that triggers the event
   public void PerformClick()
   {
       Console.WriteLine("Button physically clicked...");
       OnClick(EventArgs.Empty); // Raise the Click event
   }
}`;

  const eventHandlerCode = `public class MyForm
{
    private Button _myButton;

    public MyForm()
    {
        _myButton = new Button();
        // Subscribe the HandleButtonClick method to the button's Click event
        _myButton.Click += HandleButtonClick;
    }

    // Event Handler method - must match EventHandler delegate signature
    private void HandleButtonClick(object sender, EventArgs e)
    {
        Console.WriteLine("The button was clicked! Responding in the form.");
        // Add logic here to update the form, etc.
    }

    // Example of how to unsubscribe (e.g., when the form is closing)
    public void Cleanup()
    {
         _myButton.Click -= HandleButtonClick;
    }
}`;

  const buttonClickCode = `public partial class Form1 : Form
{
    public Form1()
    {
        InitializeComponent(); // Method from Form1.Designer.cs
    }

    private void button1_Click(object sender, EventArgs e)
    {
        // Code to execute when button1 is clicked
        MessageBox.Show("Button clicked!", "Message");
        // Example: Update a label's text
        // label1.Text = "You clicked the button!";
    }
}`;

  const consoleAppCode = `using System;

namespace MyConsoleApp // Namespace for organization
{
    class Program
    {
        // Entry point of the application
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");

            // You can access command-line arguments via the 'args' array
            if (args.Length > 0)
            {
                Console.WriteLine($"First argument: {args[0]}");
            }

            Console.ReadKey(); // Pause console before closing (optional)
        }
    }
}`;

  const unitTestCode = `using Xunit; // Add Xunit namespace

// Class containing the code to test
public class Calculator
{
    public int Add(int a, int b) { return a + b; }
}

// Test class
public class CalculatorTests
{
    [Fact] // Attribute marking this as a test method
    public void Add_TwoPositiveNumbers_ReturnsCorrectSum()
    {
        // Arrange: Set up the test
        var calculator = new Calculator();
        int number1 = 5;
        int number2 = 3;
        int expectedSum = 8;

        // Act: Perform the action to test
        int actualSum = calculator.Add(number1, number2);

        // Assert: Verify the result
        Assert.Equal(expectedSum, actualSum);
    }

    // Add more test methods for different scenarios (negatives, zero, etc.)
}`;

  const moqTestCode = `using Moq;         // Add Moq namespace
using Xunit;

// Interfaces/Classes being tested/mocked
public interface IEmailService
{
    void SendOrderConfirmation(int orderId);
}

public class OrderProcessor
{
    private readonly IEmailService _emailService;

    public OrderProcessor(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void ProcessOrder(int orderId)
    {
        // ... processing logic ...
        _emailService.SendOrderConfirmation(orderId); // Call the dependency
    }
}

// Test Class
public class OrderProcessorTests
{
    [Fact]
    public void ProcessOrder_CallsEmailService()
    {
        // Arrange: Create a mock of the dependency
        var mockEmailService = new Mock<IEmailService>();
        int testOrderId = 123;

        // Setup the mock (optional, needed if the method returns something or has complex logic)
        // mockEmailService.Setup(service => service.SendOrderConfirmation(testOrderId)); // Basic setup if needed

        // Inject the mock object into the class under test
        var orderProcessor = new OrderProcessor(mockEmailService.Object);

        // Act: Call the method being tested
        orderProcessor.ProcessOrder(testOrderId);

        // Assert: Verify that the mock's method was called as expected
        mockEmailService.Verify(
            service => service.SendOrderConfirmation(testOrderId),
            Times.Once() // Ensure it was called exactly once
        );
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
        'switch', 'case', 'break', 'continue', 'default', 'event', 'delegate'
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
        'List', 'ArgumentOutOfRangeException', 'Button', 'EventArgs', 'EventHandler',
        'MyForm', 'Form', 'MessageBox', 'Calculator', 'OrderProcessor', 'IEmailService'
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Monitor size={14} className="inline mr-1" /> VISUAL STUDIO IDE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Visual Studio IDE: Your Development Workstation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the Visual Studio IDE – from components and project types to
            event-driven programming, debugging, testing, mocking, and
            Test-Driven Development.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Monitor size={14} className="inline mr-1" /> IDE
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Bug size={14} className="inline mr-1" /> Debugging
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
                placeholder="Search for a component, shortcut, or concept..."
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
                Introduction to Visual Studio IDE
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Visual Studio is a powerful Integrated Development Environment (IDE) from Microsoft, primarily designed for building applications on the Windows platform using .NET technologies. It offers a comprehensive set of tools and functionalities to streamline the development process – from writing and debugging code to testing and deploying applications.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of Visual Studio like a professional workshop for developers. It has all the tools you need in one place – a workbench (code editor), a toolbox (toolbox window), a filing system (Solution Explorer), and quality control tools (debugger, test runner).
                </p>
              </div>
            </div>

            {/* VS Components */}
            <div
              ref={(el) => {
                sectionRefs.current['vs-components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Visual Studio IDE Components
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Menus</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Provide access to a wide range of commands – File, Edit, View, Project, Build, Debug, Team, Test, Window, Help.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Toolbars</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Quick access icons for frequently used commands (Save, Start Debugging, Build). Customisable.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Solution Explorer</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hierarchical tree view of your solution, projects, files, references, and dependencies.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Code Editor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Main area for writing code – syntax highlighting, IntelliSense, code navigation, refactoring, error indicators.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Properties Window</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Displays and allows modification of properties for the currently selected item.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Output Window</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows build messages, compilation results, errors, warnings, and debug output.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Error List</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Structured list of errors, warnings, and messages – double-click to navigate to the problematic code.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Command Window / Terminal</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Integrated terminal (PowerShell, Developer Command Prompt) for command-line tools.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Additional Notes</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">The specific layout and available windows vary based on the chosen profile (Web Development, General), project type, and user customisation. Visual Studio is highly extensible through a marketplace of extensions.</p>
              </div>

              {/* Quiz 1 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which window in Visual Studio displays a hierarchical tree view of your solution and projects?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 0, 2)} /> a) Properties Window
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 1, 2)} /> b) Output Window
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz1" onChange={() => checkAnswer(1, 2, 2)} /> c) Solution Explorer
                  </label>
                </div>
                {showQuiz1Result && (
                  <div className={`mt-2 p-2 rounded ${quiz1Answer === 2 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz1Answer === 2 ? '✅ Correct! Solution Explorer shows the solution and project hierarchy.' : '❌ Incorrect. The correct answer is c.'}
                  </div>
                )}
              </div>
            </div>

            {/* Pros and Cons */}
            <div
              ref={(el) => {
                sectionRefs.current['vs-pros-cons'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Visual Studio IDE – Pros and Cons
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Rich Feature Set:</strong> Comprehensive tools for editing, debugging, testing, building, and deployment.</li>
                    <li><strong>Integration with Microsoft Ecosystem:</strong> Excellent integration with .NET, Azure, SQL Server.</li>
                    <li><strong>Large Community & Resources:</strong> Extensive documentation, tutorials, forums, and extensions.</li>
                    <li><strong>Advanced Code Editing & IntelliSense:</strong> Syntax highlighting, code completion, refactoring, code analysis.</li>
                    <li><strong>Powerful Debugging Tools:</strong> Industry-leading debugger with breakpoints, step-through, variable inspection.</li>
                    <li><strong>Integrated Version Control:</strong> Built-in Git and Azure DevOps support.</li>
                    <li><strong>Visual Designers:</strong> Drag-and-drop UI design for Windows Forms, WPF.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li><strong>Cost:</strong> Professional and Enterprise editions have licensing costs (Community is free).</li>
                    <li><strong>Resource Intensive:</strong> Can consume significant system resources (RAM, CPU).</li>
                    <li><strong>Primarily Windows-Focused:</strong> While VS for Mac exists, the richest experience is on Windows.</li>
                    <li><strong>Complexity & Learning Curve:</strong> The sheer number of features can be overwhelming for beginners.</li>
                    <li><strong>Potential Vendor Lock-In:</strong> Heavy reliance on VS features might make migration challenging.</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">Visual Studio remains a top-tier IDE, especially for developers working within the Microsoft ecosystem. The free Community edition provides immense value for individuals and open-source projects.</p>
            </div>

            {/* Event-Driven Programming */}
            <div
              ref={(el) => {
                sectionRefs.current['event-driven'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Event-Driven Programming (EDP)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Event-driven programming is a paradigm where the flow of the program is determined by events – user actions (mouse clicks, key presses), sensor outputs, or messages from other programs. Instead of following a linear sequence, the program waits for events and then executes specific code (event handlers) in response.
                </p>
              </div>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Events</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A notification or signal sent by an object (event source/publisher) to indicate that something significant has happened. In C#, events are declared with the <code>event</code> keyword, typically associated with a delegate type.</p>
                  <CodeBlock code={buttonEventCode} title="C#" id="buttonEvent" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Delegates</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A type that represents references to methods with a specific parameter list and return type – a type-safe function pointer. Events use delegates to define the required signature for event handler methods. The most common is <code>System.EventHandler</code>.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">EDP Implementation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Objects (subscribers) attach event handlers to another object's event using <code>+=</code>. When the publisher raises the event, all subscribed handlers are executed. This creates loose coupling – the publisher doesn't need to know about subscribers.</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Benefits of EDP</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                  <li><strong>Responsiveness:</strong> Ideal for GUIs – reacts immediately to user input.</li>
                  <li><strong>Loose Coupling:</strong> Publishers and subscribers are independent, making the system more modular.</li>
                  <li><strong>Flexibility:</strong> Multiple subscribers can react to the same event.</li>
                </ul>
              </div>
            </div>

            {/* Event Publishing, Subscribing, and Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['event-pub-sub'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Event Publishing, Subscribing, and Handling
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Event Publishing (Raising an Event)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The object that owns the event (publisher) is responsible for raising it when the appropriate condition occurs – typically within a <code>protected virtual</code> method (e.g., <code>OnEventName</code>) that allows derived classes to override the raising logic. The <code>?.Invoke()</code> syntax safely raises the event only if there are subscribers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Event Subscribing (Attaching a Handler)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">An object (subscriber) provides an event handler method matching the delegate signature, then attaches it to the publisher's event using the <code>+=</code> operator. It can unsubscribe using <code>-=</code>.</p>
                  <CodeBlock code={eventHandlerCode} title="C#" id="eventHandler" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Event Handling</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">The execution of the subscribed event handler method(s) when the event is raised. The <code>sender</code> argument identifies the object that raised the event; the <code>EventArgs</code> argument carries specific event data (or a custom class derived from it).</p>
                </div>
              </div>
            </div>

            {/* GUI Development */}
            <div
              ref={(el) => {
                sectionRefs.current['gui-development'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                GUI Development Process (Windows Forms)
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Create a New Windows Forms Application</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">File → New → Project → "Windows Forms App (.NET Framework)" or "Windows Forms App" (.NET Core/.NET 5+).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Design the User Interface</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Open the form designer. Drag and drop controls from the Toolbox onto the design surface. Use the Properties window to change appearance and behavior.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Write Event Handler Code</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Double-click a control to generate the default event handler (e.g., Button's Click). Write the code that executes when the event occurs.</p>
                  <CodeBlock code={buttonClickCode} title="C#" id="buttonClick" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Compile and Run</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Press F5 or click the "Start" button to build and run your application. Test the UI elements.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Font Changes and Design Principles</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use the Properties window to change fonts for consistent styling. Consider design principles: Clarity, Consistency, Feedback, Simplicity.</p>
                </div>
              </div>

              {/* Quiz 2 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> What is the easiest way to create an event handler for a Button's Click event in Windows Forms?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 0, 1)} /> a) Manually write code in the Form constructor
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 1, 1)} /> b) Double-click the button in the designer
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz2" onChange={() => checkAnswer(2, 2, 1)} /> c) Right-click the button and select "Add Event"
                  </label>
                </div>
                {showQuiz2Result && (
                  <div className={`mt-2 p-2 rounded ${quiz2Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz2Answer === 1 ? '✅ Correct! Double-clicking a control generates the default event handler.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Source Control */}
            <div
              ref={(el) => {
                sectionRefs.current['source-control'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Integrating Source Control with Visual Studio
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Setting Up Source Control</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Git is the de facto standard. Initialize a repository when creating a new project, or use the Git menu to add an existing project to source control. Connect to remote services like GitHub, Azure DevOps, or GitLab.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Version Control Basics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Use the Git Changes window to view uncommitted changes. Stage changes, write a commit message, and click Commit Staged. Use Push to upload commits to the remote repository and Pull to fetch changes from others.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Branching</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Creates an independent line of development for features or bug fixes without disrupting the main codebase. Create a branch from the Git Changes window or status bar indicator.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Merging</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Merge a completed branch back into the target branch. Visual Studio provides tools to resolve conflicts if changes affect the same code lines.</p>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Benefits of Source Control</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                  <li>Collaboration: Multiple developers work concurrently.</li>
                  <li>History Tracking: Complete history of changes.</li>
                  <li>Reversibility: Easily revert to previous versions.</li>
                  <li>Experimentation: Safely try new ideas on branches.</li>
                  <li>Backup: Remote repositories serve as offsite backups.</li>
                </ul>
              </div>
            </div>

            {/* Project Types */}
            <div
              ref={(el) => {
                sectionRefs.current['project-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Project Types and Templates in Visual Studio
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Console App</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Text-based command-line applications. Simple structure, good for learning core C# and algorithms.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Class Library</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Creates reusable code libraries (.dll files) that can be referenced by other projects.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Windows Forms App</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Traditional Windows desktop applications with GUI using a drag-and-drop designer.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">WPF App</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Visually rich, modern Windows desktop applications using XAML for UI design.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">ASP.NET Core Web App / API</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Modern, cross-platform web applications, web APIs, or interactive web UIs using C#.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Unit Test Project</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hold unit tests for your application code using frameworks like MSTest, NUnit, or xUnit.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Console Application Structure</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">.csproj file (project metadata) + Program.cs (entry point – <code>static void Main(string[] args)</code>).</p>
                <CodeBlock code={consoleAppCode} title="C# (Program.cs)" id="consoleApp" />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Benefits of Using Templates</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                  <li>Quick Start: Pre-configured project structure.</li>
                  <li>Best Practices: Templates follow recommended patterns.</li>
                  <li>Focus: Get straight to writing code, not configuring projects.</li>
                </ul>
              </div>
            </div>

            {/* Debugging */}
            <div
              ref={(el) => {
                sectionRefs.current['debugging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Using Breakpoints and Stepping Through Code
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Breakpoints</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Markers that pause program execution at a specific line. Set by clicking in the left margin (or F9). Conditional breakpoints allow pausing only when a condition is met (right-click → Conditions).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Step Over (F10)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Executes the current line. If it's a method call, it executes the entire method without stepping into its details.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Step Into (F11)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Executes the current line. If it's a method call, the debugger enters that method, allowing you to debug it line by line.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Step Out (Shift+F11)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Executes the rest of the current method and returns to the line where it was called.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Continue (F5)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Resumes normal execution until the next breakpoint is hit or the program ends.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Inspecting Variables</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Hover over variables to see values. Locals Window (variables in scope), Autos Window (used in current/previous statements), Watch Windows (specific expressions), Immediate Window (evaluate expressions).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Call Stack Window</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Shows the sequence of method calls that led to the current execution point. Essential for understanding how your program got to its current state.</p>
                </div>
              </div>

              {/* Quiz 3 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> Which keyboard shortcut is used to Step Into a method call during debugging?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 0, 1)} /> a) F10
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 1, 1)} /> b) F11
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz3" onChange={() => checkAnswer(3, 2, 1)} /> c) F5
                  </label>
                </div>
                {showQuiz3Result && (
                  <div className={`mt-2 p-2 rounded ${quiz3Answer === 1 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz3Answer === 1 ? '✅ Correct! F11 is Step Into.' : '❌ Incorrect. The correct answer is b.'}
                  </div>
                )}
              </div>
            </div>

            {/* Unit Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['unit-testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Unit Testing C# Programs
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Unit testing involves testing individual, isolated components (methods or classes) of your code to verify they work correctly.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Popular C# Frameworks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">MSTest</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Microsoft's built-in framework, well-integrated with Visual Studio.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">NUnit</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A widely used, mature, open-source framework, originally ported from Java's JUnit.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">xUnit.net</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">A modern, open-source framework focused on simplicity and extensibility, popular in the .NET community.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">AAA Pattern</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><strong>Arrange:</strong> Set up preconditions and inputs (create objects, initialise variables).</li>
                  <li><strong>Act:</strong> Execute the specific method or code unit being tested.</li>
                  <li><strong>Assert:</strong> Verify the outcome matches the expected result using assertion methods (e.g., <code>Assert.Equal</code>, <code>Assert.IsTrue</code>).</li>
                </ul>
              </div>

              <CodeBlock code={unitTestCode} title="C# (XUnit Test)" id="unitTest" />

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Benefits of Unit Testing</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                  <li>Verify code correctness.</li>
                  <li>Facilitate refactoring with confidence.</li>
                  <li>Improve code design (testable code tends to be more modular).</li>
                  <li>Act as documentation for code behavior.</li>
                  <li>Enable automated testing in CI/CD pipelines.</li>
                </ul>
              </div>
            </div>

            {/* Mocking */}
            <div
              ref={(el) => {
                sectionRefs.current['mocking'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Mocking Objects and Dependencies with Moq
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">When unit testing, you often want to isolate the class being tested from its external dependencies (like database connections, web services, or complex classes). Mocking frameworks, like Moq, allow you to create "fake" or simulated versions of these dependencies.</p>
              </div>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Why Use Mocking?</h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><strong>Isolation:</strong> Test the unit in isolation, without worrying about the behavior or state of real dependencies.</li>
                <li><strong>Control:</strong> Define exactly how the dependency should behave during the test.</li>
                <li><strong>Speed & Reliability:</strong> Avoid slow or unreliable external calls (network, database).</li>
                <li><strong>Testability:</strong> Enables testing code that interacts with difficult-to-instantiate dependencies.</li>
              </ul>

              <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight mt-6">Moq Framework</h3>
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">A popular, open-source mocking library for .NET. Uses a fluent API (method chaining) and lambda expressions for easy setup. Typically mocks interfaces or virtual members. Install via NuGet: <code>Install-Package Moq</code></p>
              </div>

              <CodeBlock code={moqTestCode} title="C# (Moq Test)" id="moqTest" />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 mt-4">
                <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">📝 Key Moq Parts</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                  <li><code>new Mock&lt;T&gt;()</code> – create a mock of the interface/class.</li>
                  <li><code>.Object</code> – get the mocked instance.</li>
                  <li><code>.Setup(...)</code> – define behavior (e.g., return values).</li>
                  <li><code>.Verify(...)</code> – assert that a method was called as expected.</li>
                </ul>
              </div>
            </div>

            {/* TDD */}
            <div
              ref={(el) => {
                sectionRefs.current['tdd'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Test-Driven Development (TDD) in C#
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">Test-Driven Development (TDD) is an iterative software development process where tests are written BEFORE the production code. The workflow follows the "Red-Green-Refactor" cycle.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Red</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Write a failing unit test that defines a desired improvement or new function. The test should fail because the code doesn't exist yet.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Green</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Write the minimum amount of production code necessary to make the failing test pass. Focus solely on passing the test, even if the code isn't perfect.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Refactor</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Improve the production code (and potentially test code) by removing duplication, improving clarity, and optimising performance, ensuring all tests still pass.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Benefits of TDD</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Design Guidance: Encourages better, more testable designs.</li>
                    <li>Safety Net: Provides confidence when refactoring.</li>
                    <li>Early Bug Detection: Catches bugs immediately.</li>
                    <li>Documentation: Tests serve as executable documentation.</li>
                    <li>Reduces Debugging Time: Failures point directly to the recently added code.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Challenges of TDD</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                    <li>Learning Curve: Requires discipline and a shift in thinking.</li>
                    <li>Mocking Complexity: Can require extensive use of mocking.</li>
                    <li>Test Maintenance: Tests need to be maintained alongside production code.</li>
                    <li>Initial Pace: Might feel slower initially compared to writing code first.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">📝 Exam Tip</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">TDD, combined with unit testing frameworks and mocking, is a powerful methodology for building high-quality, reliable, and maintainable C# applications. Remember: Red → Green → Refactor.</p>
              </div>

              {/* Quiz 4 */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Quick Quiz</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><strong>Question:</strong> In TDD, what is the first step of the Red-Green-Refactor cycle?</p>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 0, 0)} /> a) Write a failing test (Red)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 1, 0)} /> b) Write production code (Green)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <input type="radio" name="quiz4" onChange={() => checkAnswer(4, 2, 0)} /> c) Refactor the code
                  </label>
                </div>
                {showQuiz4Result && (
                  <div className={`mt-2 p-2 rounded ${quiz4Answer === 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    {quiz4Answer === 0 ? '✅ Correct! Red is the first step – write a failing test.' : '❌ Incorrect. The correct answer is a.'}
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
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Visual Studio Components</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Menus, Toolbars, Solution Explorer, Code Editor, Properties, Output, Error List, Terminal – know what each does.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Event-Driven Programming</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Events (notifications) + Delegates (type-safe function pointers) + Subscribers (attached with +=) = loose coupling.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Debugging Shortcuts</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">F9 (breakpoint), F10 (Step Over), F11 (Step Into), Shift+F11 (Step Out), F5 (Continue).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Project Types</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Console App, Class Library, Windows Forms, WPF, ASP.NET Core, Unit Test Project.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Testing & TDD</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Unit testing frameworks (xUnit, NUnit, MSTest); AAA pattern (Arrange, Act, Assert); TDD (Red-Green-Refactor).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Mocking with Moq</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Mock interfaces/dependencies to isolate the unit under test – use <code>Mock&lt;T&gt;</code>, <code>.Object</code>, <code>.Setup</code>, <code>.Verify</code>.</p>
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <h3 className="font-bold text-lg text-indigo-800 dark:text-indigo-300 mb-4">📋 Quick Cheat Sheet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">VS Components</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Debugging Shortcuts</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">TDD Steps</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Red, Green, Refactor</span>
                  </div>
                  <div className="flex justify-between p-3 bg-white dark:bg-[#121212] rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">AAA Pattern</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Arrange, Act, Assert</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Debug. Test. Refactor. Deploy. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 IDE Insight
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
                  <span>Debugging Shortcuts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Testing Frameworks</span>
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
                Visual Studio is a powerful tool, but it's the developer who makes it work. Focus on understanding the core components, debugging workflows, and testing practices. Practice writing unit tests and using breakpoints – these skills are essential for professional development.
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
                <strong className="text-white">Visual Studio</strong> is a comprehensive IDE with key components: Menus, Toolbars, Solution Explorer, Code Editor, Properties, Output, Error List, and Terminal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Event-driven programming</strong> uses Events (notifications) and Delegates (type-safe function pointers) to enable loose coupling and responsiveness.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Debugging</strong> relies on breakpoints (F9) and stepping – Step Over (F10), Step Into (F11), Step Out (Shift+F11), and Continue (F5).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Unit testing</strong> frameworks (xUnit, NUnit, MSTest) follow the AAA pattern: Arrange, Act, Assert.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">TDD</strong> (Test-Driven Development) follows the Red-Green-Refactor cycle – write a failing test, make it pass, then refactor.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mocking</strong> with Moq isolates units from dependencies, enabling focused and reliable tests.
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
            Sidemann Academic Registry • Visual Studio IDE 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
