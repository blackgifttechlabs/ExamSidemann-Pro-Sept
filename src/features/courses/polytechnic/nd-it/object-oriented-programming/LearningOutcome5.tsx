import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Flag,
  BookOpen,
  PenTool,
  Type,
  Hash,
  Clock,
  MapPin,
  Link2,
  CheckCircle,
  X,
  ArrowRight,
  CornerDownRight,
  Award,
  Briefcase,
  MessageCircle,
  FileSpreadsheet,
  Pen,
  Book,
  Target,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  Lightbulb,
  UserCheck,
  Building,
  Globe,
  Download,
  Upload,
  Settings,
  HelpCircle,
  AlertTriangle,
  CheckSquare,
  Square,
  MinusCircle,
  PlusCircle,
  ExternalLink,
  Eye as EyeIcon,
  EyeOff,
  MessageSquare,
  List,
  Layout,
  Grid,
  Layers,
  Cpu,
  Coffee,
  Zap,
  Heart,
  Star,
  Sun,
  Moon,
  Cloud,
  Wind,
  Thermometer,
  Droplet,
  Smile,
  Frown,
  Meh,
  Quote,
  Braces,
  Brackets,
  Parentheses as ParenthesesIcon, // Avoid keyword collision
  Slash,
  Asterisk,
  AtSign,
  DollarSign,
  Percent,
  Plus,
  Minus,
  Divide,
  Equal,
  Link,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Home,
  Search,
  Menu,
  Settings as SettingsIcon,
  Bell,
  BellRing,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Headphones,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryWarning as BatteryLow, // Lucide equivalent
  Wifi,
  WifiOff,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  ChevronUp,
  Sparkles,
  BookMarked,
  RefreshCw,
  X as XIcon,
  Paintbrush,
  Compass as DraftingCompass, // Lucide equivalent
  MousePointerClick as HandPointer, // Lucide equivalent
  BadgeCheck as Trademark, // Lucide equivalent
  Network as Sitemap, // Lucide equivalent
  Shapes,
  Film,
  Smartphone as Mobile, // Lucide equivalent
  Boxes as Cubes, // Lucide equivalent
  Database as DatabaseIcon,
  GitBranch as CodeBranch, // Lucide equivalent
  Landmark as Archway, // Lucide equivalent
  Wrench as Toolbox, // Lucide equivalent
  Menu as Bars, // Lucide equivalent
  MessageSquareMore as CommentDots, // Lucide equivalent
  GraduationCap,
  Lightbulb as LightbulbIcon,
  AlertTriangle as ExclamationTriangle, // Lucide equivalent
  ShieldCheck as ShieldAlt, // Lucide equivalent
  Tag,
  UserPlus,
  ListTodo as Tasks, // Lucide equivalent
  Layers as LayerGroup, // Lucide equivalent
  Code,
  RefreshCw as SyncAlt, // Lucide equivalent
  ArrowDownCircle as ArrowAltCircleDown, // Lucide equivalent
  ArrowRightCircle as ArrowAltCircleRight, // Lucide equivalent
  TrendingUp as ChartLine, // Lucide equivalent
  List as ListUl, // Lucide equivalent
  StepForward,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'exceptions', label: 'Exceptions' },
  { id: 'exception-handling', label: 'Exception Handling' },
  { id: 'exception-hierarchy', label: 'Exception Hierarchy' },
  { id: 'exception-types', label: 'Exception Types' },
  { id: 'user-defined-exceptions', label: 'User-Defined' },
  { id: 'exception-procedures', label: 'Procedures' },
  { id: 'programming-constructs', label: 'Constructs' },
  { id: 'three-constructs', label: 'Three Constructs' },
  { id: 'selection', label: 'Selection' },
  { id: 'multiple-nested', label: 'Multiple & Nested' },
  { id: 'iteration', label: 'Iteration' },
  { id: 'dowhile', label: 'do-while' },
  { id: 'while', label: 'while' },
  { id: 'for', label: 'for' },
  { id: 'foreach', label: 'foreach' },
  { id: 'examples', label: 'Examples' },
  { id: 'break-continue', label: 'break & continue' },
  { id: 'cheat-sheet', label: 'Cheat Sheet' },
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
        text: 'In C#, all exceptions inherit from the System.Exception class. You can create custom exceptions by inheriting from this class.',
      },
      {
        title: 'Pro Tip',
        text: 'Always catch specific exceptions before general ones. The first matching catch block is executed when an exception is thrown.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three programming constructs: Sequence, Selection, Repetition – "SSR" – the foundation of all programming logic.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t use a generic catch (Exception ex) block as your first catch block – always catch more specific exceptions first.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'In C#, all exceptions inherit from the System.Exception class. You can create custom exceptions by inheriting from this class.',
      },
      {
        title: 'Pro Tip',
        text: 'Always catch specific exceptions before general ones. The first matching catch block is executed when an exception is thrown.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three programming constructs: Sequence, Selection, Repetition – "SSR" – the foundation of all programming logic.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t use a generic catch (Exception ex) block as your first catch block – always catch more specific exceptions first.',
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

  // ─── Syntax Highlighting ──────────────────────────────────────────────────
  const highlightSyntax = (code: string): React.ReactNode => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const placeholders: Record<string, string> = {};
    let counter = 0;

    escaped = escaped.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
      const key = `__COMMENT_${counter++}__`;
      placeholders[key] = `<span class="text-[#57A64A] dark:text-[#6a9955] italic">${match}</span>`;
      return key;
    });

    escaped = escaped.replace(/(".*?"|'.*?'|`.*?`)/g, (match) => {
      const key = `__STRING_${counter++}__`;
      placeholders[key] = `<span class="text-[#D69D85] dark:text-[#ce9178]">${match}</span>`;
      return key;
    });

    const keywords = [
      'using', 'namespace', 'class', 'public', 'private', 'protected', 'static',
      'void', 'return', 'if', 'else', 'for', 'foreach', 'while', 'do', 'try',
      'catch', 'finally', 'throw', 'override', 'virtual', 'abstract', 'new',
      'this', 'get', 'set', 'var', 'const', 'null', 'true', 'false', 'struct',
      'interface', 'enum', 'base', 'in', 'out', 'as', 'is', 'typeof',
      'switch', 'case', 'break', 'continue', 'default', 'event', 'delegate',
      'MessageBox', 'DialogResult'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    const types = [
      'int', 'string', 'double', 'bool', 'char', 'float', 'decimal', 'long',
      'short', 'byte', 'sbyte', 'uint', 'ulong', 'ushort', 'object', 'var'
    ];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    const classes = [
      'Console', 'Math', 'Program', 'Exception', 'DivideByZeroException',
      'NullReferenceException', 'ArgumentException', 'ArgumentNullException',
      'IndexOutOfRangeException', 'FormatException', 'OverflowException',
      'OutOfMemoryException', 'StackOverflowException', 'TypeLoadException',
      'InvalidDataFormatException', 'MyProcessor', 'StreamReader', 'Random',
      'List', 'GuessingGame', 'Example', 'FileNotFoundException',
      'InvalidOperationException', 'ArithmeticException', 'ArrayIndexOutOfRangeException'
    ];
    const classRegex = new RegExp(`\\b(${classes.join('|')})\\b`, 'g');
    escaped = escaped.replace(classRegex, '<span class="text-[#0d9488] dark:text-[#4EC9B0]">$1</span>');

    escaped = escaped.replace(/(?<![<>"'])\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-[#DCDCAA]">$1</span>');

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

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-sm"
        >
          {copiedId === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 p-4 overflow-x-auto">
        {highlightSyntax(code)}
      </div>
    </div>
  );

  // ─── Code Examples ──────────────────────────────────────────────────────────
  const divideByZeroExample = `using System;
public class Example
{
    public static void Main()
    {
        int numerator = 10;
        int denominator = 0; // Potentially problematic
        try
        {
            int result = numerator / denominator; // Could throw a DivideByZeroException
            Console.WriteLine("Result: {0}", result);
        }
        catch (DivideByZeroException ex)
        {
            Console.WriteLine("Error: Division by zero attempted.");
            Console.WriteLine("Exception details: {0}", ex.Message);
        }
        Console.WriteLine("Program execution continues.");
    }
}`;

  const customExceptionExample = `public class InvalidDataFormatException : Exception
{
    public InvalidDataFormatException(string message) : base(message)
    {
    }
}
public class MyProcessor
{
    public void ProcessData(string data)
    {
        try
        {
            // Data processing logic (potentially throwing an exception)
            if (!ValidateData(data))
            {
                throw new InvalidDataFormatException("Data format is invalid.");
            }
        }
        catch (InvalidDataFormatException ex)
        {
            Console.WriteLine("Error: {0}", ex.Message);
            // Handle invalid data format (e.g., log the error, provide user instructions)
        }
    }
    private bool ValidateData(string data)
    {
        // Implement data validation logic
        return true; // Replace with actual validation
    }
}`;

  const customExceptionFull = `public class InvalidDataFormatException : Exception
{
    public string InvalidData { get; private set; }
    public InvalidDataFormatException(string message, string invalidData) : base(message)
    {
        InvalidData = invalidData;
    }
}`;

  const tryCatchExample = `try
{
    int result = numerator / denominator;
    Console.WriteLine("Result: {0}", result);
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("Error: Division by zero attempted.");
}
catch (Exception ex) // Catch-all for other exceptions (optional)
{
    Console.WriteLine("An unexpected error occurred: {0}", ex.Message);
}`;

  const finallyExample = `StreamReader reader = null;
try
{
    reader = new StreamReader("myfile.txt");
    // Read from the file
}
catch (FileNotFoundException ex)
{
    Console.WriteLine("File not found: {0}", ex.Message);
}
finally
{
    if (reader != null)
    {
        reader.Close(); // Ensure file is closed even if an exception occurs
    }
}`;

  const multipleConstructs = `int age = 25; // Data type and variable
string name = "Alice";
if (age >= 18) // Control flow (if statement)
{
    Console.WriteLine(name + " is eligible to vote.");
}
else
{
    Console.WriteLine(name + " is not yet eligible to vote.");
}`;

  const sequenceExample = `int x = 10;
int y = 20;
int sum = x + y;
Console.WriteLine("The sum is: {0}", sum);`;

  const selectionExample = `int age = 25;
if (age >= 18) {
    Console.WriteLine("You are eligible to vote.");
} else {
    Console.WriteLine("You are not eligible to vote.");
}`;

  const repetitionExample = `for (int i = 0; i < 5; i++) {
    Console.WriteLine("Iteration: {0}", i);
}`;

  const ifElseSwitchExample = `int age = 25;
string grade = "B";
if (age >= 18)
{
    Console.WriteLine("You are an adult.");
}
else
{
    Console.WriteLine("You are not an adult.");
}
switch (grade)
{
    case "A":
        Console.WriteLine("Excellent work!");
        break;
    case "B":
        Console.WriteLine("Good job.");
        break;
    case "C":
        Console.WriteLine("You can do better.");
        break;
    default:
        Console.WriteLine("Invalid grade.");
        break;
}`;

  const singleIfExample = `int number = 10;
if (number > 0)
{
    Console.WriteLine("The number is positive.");
}`;

  const doubleIfExample = `int age = 25;
if (age >= 18)
{
    Console.WriteLine("You are an adult.");
}
else
{
    Console.WriteLine("You are not an adult.");
}`;

  const switchExample = `char grade = 'B';
switch (grade)
{
    case 'A':
        Console.WriteLine("Excellent work!");
        break;
    case 'B':
        Console.WriteLine("Good job.");
        break;
    case 'C':
        Console.WriteLine("You can do better.");
        break;
    default:
        Console.WriteLine("Invalid grade.");
        break;
}`;

  const nestedSelectionExample = `int age = 25;
bool isCitizen = true;
if (age >= 18)
{
    if (isCitizen)
    {
        Console.WriteLine("You are eligible to vote.");
    }
    else
    {
        Console.WriteLine("You are not eligible to vote (not a citizen).");
    }
}
else
{
    Console.WriteLine("You are not eligible to vote (under 18).");
}`;

  const forWhileExample = `for (int i = 1; i <= 5; i++)
{
    Console.WriteLine(i);
}
string input = "";
while (input.ToLower() != "exit")
{
    Console.Write("Enter a word (or 'exit' to quit): ");
    input = Console.ReadLine();
    if (input.ToLower() != "exit")
    {
        Console.WriteLine("You entered: {0}", input);
    }
}`;

  const guessingGame = `public class GuessingGame
{
    public static void Main(string[] args)
    {
        int secretNumber = new Random().Next(1, 101); // Generate random number between 1 and 100
        int guess;
        int numGuesses = 0;
        Console.WriteLine("Welcome to the Guessing Game!");
        do
        {
            // Get valid user input (number between 1 and 100)
            do
            {
                Console.Write("Guess a number between 1 and 100: ");
            } while (!int.TryParse(Console.ReadLine(), out guess) || guess < 1 || guess > 100);
            numGuesses++;
            if (guess > secretNumber)
            {
                Console.WriteLine("Too high! Guess again.");
            }
            else if (guess < secretNumber)
            {
                Console.WriteLine("Too low! Guess again.");
            }
        } while (guess != secretNumber);
        Console.WriteLine("Congratulations! You guessed the number in {0} tries.", numGuesses);
    }
}`;

  const doWhileExample = `int number = 0;
do
{
    Console.WriteLine("Enter a positive integer: ");
    number = int.Parse(Console.ReadLine()); // Read user input and convert to integer
} while (number <= 0); // Keep looping until a positive number is entered
Console.WriteLine("You entered: {0}", number);`;

  const whileExample = `int count = 1;
while (count <= 5)
{
    Console.WriteLine("Count: {0}", count);
    count++; // Increment count by 1
}`;

  const forLoopExample = `for (int i = 1; i <= 5; i++) // i = 1, i <= 5, i++
{
    Console.WriteLine("Iteration: {0}", i);
}`;

  const foreachExample = `string[] names = { "Alice", "Bob", "Charlie" };
foreach (string name in names)
{
    Console.WriteLine("Hello, {0}!", name);
}`;

  const foreachAverageExample = `int[] numbers = { 10, 20, 30, 40, 50 };
double sum = 0;
foreach (int number in numbers)
{
    sum += number; // Add each element to the sum
}
double average = sum / (double)numbers.Length; // Calculate average
Console.WriteLine("The average of the numbers is: {0:F2}", average);`;

  const reverseStringExample = `string originalString = "Hello World!";
string reversedString = "";
for (int i = originalString.Length - 1; i >= 0; i--)
{
    reversedString += originalString[i];
}
Console.WriteLine("Original String: {0}", originalString);
Console.WriteLine("Reversed String: {0}", reversedString);`;

  const maxArrayExample = `int[] numbers = { 5, 12, 3, 18, 7 };
int maxValue = numbers[0]; // Assume first element as initial max
int i = 1;
while (i < numbers.Length)
{
    if (numbers[i] > maxValue)
    {
        maxValue = numbers[i];
    }
    i++;
}
Console.WriteLine("The maximum value in the array is: {0}", maxValue);`;

  const sumListExample = `List<int> numbers = new List<int>() { 2, 4, 6, 8 };
int sum = 0;
foreach (int number in numbers)
{
    sum += number;
}
Console.WriteLine("The sum of the elements in the list is: {0}", sum);`;

  const breakExample = `for (int i = 0; i < 10; i++)
{
    if (i == 5)
    {
        Console.WriteLine("Reached number 5, exiting loop.");
        break;
    }
    Console.WriteLine(i);
}`;

  const continueExample = `for (int i = 0; i < 10; i++)
{
    if (i % 2 == 0) // Skip even numbers
    {
        continue;
    }
    Console.WriteLine(i);
}`;

  const firstPrimeExample = `int[] numbers = { 10, 13, 15, 17, 20 };
for (int i = 0; i < numbers.Length; i++)
{
    int num = numbers[i]; // Current number
    bool isPrime = true; // Assume prime initially
    // Check divisibility by 2 (special case)
    if (num % 2 == 0 && num > 2)
    {
        isPrime = false;
        break; // Exit loop if divisible by 2 (except 2)
    }
    // Check for divisibility by odd numbers up to the square root
    for (int j = 3; j * j <= num; j += 2)
    {
        if (num % j == 0)
        {
            isPrime = false;
            break; // Exit inner loop and main loop if not prime
        }
    }
    if (isPrime)
    {
        Console.WriteLine("The first prime number is: {0}", num);
        break; // Exit the main loop once a prime is found
    }
}`;

  const skipNegativeExample = `List<int> numbers = new List<int>() { -2, 5, 10, -3, 8 };
foreach (int number in numbers)
{
    if (number < 0)
    {
        continue; // Skip negative numbers
    }
    Console.WriteLine("Positive number: {0}", number);
}`;

  const limitIterationsExample = `for (int i = 0; i < 10; i++)
{
    Console.WriteLine("Iteration: {0}", i);
    if (i == 5)
    {
        Console.WriteLine("Reached iteration 5, stopping loop.");
        break;
    }
}`;

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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
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
            <Code size={14} className="inline mr-1" /> C# PROGRAMMING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 5{' '}
            <span className="text-rose-300 font-bold italic">
              Exception Handling &amp; Flow Control
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master exception handling, decision making, and flow control in C#.
            Learn about try-catch-finally, custom exceptions, selection and
            iteration constructs, and the break/continue statements.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ExclamationTriangle size={14} className="inline mr-1" /> Exceptions
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CodeBranch size={14} className="inline mr-1" /> Flow Control
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, exception, or loop type..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
                Introduction to Exception Handling &amp; Flow Control in C#
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Exception handling and flow control are fundamental to
                    writing robust C# applications. Exception handling prevents
                    crashes and enables graceful error recovery. Flow control
                    (selection and iteration) allows programs to make decisions
                    and repeat actions. This learning outcome covers both areas
                    comprehensively.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Exception handling is like an airbag in a car – it deploys
                  when something goes wrong to protect you. Flow control is
                  like choosing which road to take and when to stop at traffic
                  lights. Both are essential for safe and efficient travel.
                </p>
              </div>
            </div>

            {/* Exceptions */}
            <div
              ref={(el) => {
                sectionRefs.current['exceptions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Understanding Exceptions in C# Programs
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 What Are Exceptions?
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Disrupt</span> – the normal flow of program execution due to unexpected events or errors.</li>
                <li><span className="font-bold">Represent</span> – a signal that something went wrong, requiring attention.</li>
                <li><span className="font-bold">Allow</span> – for controlled error handling, preventing program crashes.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Types of Exceptions
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">System-Generated</span> – Thrown automatically by the .NET runtime (e.g., NullReferenceException, DivideByZeroException, FileNotFoundException).</li>
                <li><span className="font-bold">User-Defined</span> – Created by developers to signal specific error conditions.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                3 Errors vs Exceptions
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Errors</span> – Broader term for any problem that hinders a program from functioning correctly.</li>
                <li><span className="font-bold">Exceptions</span> – Specific type of error that interrupts program execution and can be handled using exception handling mechanisms.</li>
              </ul>

              <div className="mt-4">
                <CodeBlock code={divideByZeroExample} title="C# – Handling DivideByZeroException" id="divideByZero" />
              </div>
            </div>

            {/* Exception Handling */}
            <div
              ref={(el) => {
                sectionRefs.current['exception-handling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Exception Handling
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 Importance of Exception Handling
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Prevents Program Crashes</span> – Gracefully handles unexpected conditions.</li>
                <li><span className="font-bold">Improves Code Maintainability</span> – Isolates error handling logic.</li>
                <li><span className="font-bold">Enhances Code Readability</span> – Clarifies normal flow vs exception flow.</li>
                <li><span className="font-bold">Facilitates Error Recovery</span> – Allows targeted recovery actions.</li>
                <li><span className="font-bold">Increases Code Reusability</span> – Components can signal errors without relying on specific error-checking logic.</li>
              </ul>
            </div>

            {/* Exception Hierarchy */}
            <div
              ref={(el) => {
                sectionRefs.current['exception-hierarchy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Exception Hierarchy
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 System.Exception – The Base Class
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                All exceptions in the .NET Framework inherit from <code className="bg-slate-100 dark:bg-slate-800 px-1">System.Exception</code>.
                This base class provides common properties like <code>Message</code>,
                <code>StackTrace</code>, and <code>InnerException</code>.
              </p>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Common CLR Exceptions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                  <li>ArgumentException</li>
                  <li>ArgumentNullException</li>
                  <li>ArithmeticException</li>
                  <li>ArrayIndexOutOfRangeException</li>
                  <li>DivideByZeroException</li>
                  <li>FormatException</li>
                </ul>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                  <li>IndexOutOfRangeException</li>
                  <li>InvalidOperationException</li>
                  <li>NullReferenceException</li>
                  <li>OutOfMemoryException</li>
                  <li>OverflowException</li>
                  <li>StackOverflowException</li>
                </ul>
              </div>

              <div className="mt-4">
                <CodeBlock code={customExceptionExample} title="C# – Custom Exception Example" id="customException" />
              </div>
            </div>

            {/* Exception Types */}
            <div
              ref={(el) => {
                sectionRefs.current['exception-types'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Types of Exceptions
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 System-Generated Exceptions
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Thrown automatically by the .NET runtime due to various error
                scenarios. Examples: DivideByZeroException, NullReferenceException,
                ArgumentNullException, IndexOutOfRangeException, FormatException.
              </p>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Application-Specific Exceptions
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Custom exceptions derived from <code>System.Exception</code> to
                represent errors specific to your application's domain. Allows
                for more granular error handling tailored to your program's logic.
              </p>

              <div className="mt-4">
                <CodeBlock code={customExceptionFull} title="C# – Custom Exception with Properties" id="customExceptionFull" />
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                3 Why Use Exceptions?
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Prevents program crashes</li>
                <li>Improves code maintainability</li>
                <li>Enhances code readability</li>
                <li>Facilitates error recovery</li>
                <li>Increases code reusability</li>
              </ul>
            </div>

            {/* User-Defined Exceptions */}
            <div
              ref={(el) => {
                sectionRefs.current['user-defined-exceptions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Creating User-Defined Exceptions in C#
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Step-by-Step Process
              </h3>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Inherit from System.Exception</h4>
                  <CodeBlock code={`public class MyCustomException : Exception
{
    // ... your custom exception details here
}`} title="C#" id="inheritException" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Define Constructors (Optional)</h4>
                  <CodeBlock code={`public MyCustomException() { }
public MyCustomException(string message) : base(message) { }
public MyCustomException(string message, Exception innerException) : base(message, innerException) { }`} title="C#" id="constructors" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Add Properties (Optional)</h4>
                  <CodeBlock code={customExceptionFull} title="C#" id="propertiesException" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Throw the Exception</h4>
                  <CodeBlock code={`if (data.Length == 0)
{
    throw new InvalidDataFormatException("Data cannot be empty.", data);
}`} title="C#" id="throwException" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Handle the Exception</h4>
                  <CodeBlock code={`try
{
    ProcessData(data);
}
catch (InvalidDataFormatException ex)
{
    Console.WriteLine("Error: {0}", ex.Message);
    Console.WriteLine("Invalid data: {0}", ex.InvalidData);
    // Perform other error handling actions
}`} title="C#" id="catchException" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Best Practices</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>Choose meaningful names for your custom exception classes.</li>
                  <li>Provide informative messages in the exception constructors.</li>
                  <li>Consider including properties to store relevant error details.</li>
                  <li>Document your custom exceptions.</li>
                </ul>
              </div>
            </div>

            {/* Exception Procedures */}
            <div
              ref={(el) => {
                sectionRefs.current['exception-procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Exception Handling Procedures
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Identify Potential Exceptions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Analyze your code to identify possible scenarios where errors or invalid conditions might arise.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Use try...catch Blocks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The fundamental construct for handling exceptions.</p>
                  <CodeBlock code={tryCatchExample} title="C#" id="tryCatchBlock" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Exception Handling in catch Blocks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Each catch block specifies the type of exception it can handle.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Prioritize catch Blocks</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">List more specific exception types before more general ones.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Optional finally Block</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Always executed, regardless of whether an exception is thrown or not.</p>
                  <CodeBlock code={finallyExample} title="C#" id="finallyBlock" />
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Best Practices</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>Use specific catch blocks for common system-generated exceptions.</li>
                  <li>Consider creating custom exception classes for application-specific errors.</li>
                  <li>Avoid using a generic catch (Exception ex) block as the first catch block.</li>
                  <li>Provide informative error messages.</li>
                  <li>Don't rely solely on exception handling for program flow control.</li>
                </ul>
              </div>
            </div>

            {/* Programming Constructs */}
            <div
              ref={(el) => {
                sectionRefs.current['programming-constructs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Programming Constructs in C#
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Programming constructs are the fundamental building blocks of any
                programming language. They provide a structured way to organize
                code, control its flow, and define reusable components.
              </p>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Types of Programming Constructs
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Data Types and Variables</li>
                <li>Operators</li>
                <li>Expressions</li>
                <li>Control Flow Statements</li>
                <li>Functions and Methods</li>
                <li>Classes and Objects</li>
                <li>Arrays and Collections</li>
                <li>Exception Handling</li>
                <li>Namespaces</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Importance of Programming Constructs
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Readability</li>
                <li>Maintainability</li>
                <li>Reusability</li>
                <li>Error Handling</li>
                <li>Program Flow Control</li>
                <li>Data Organization</li>
              </ul>

              <div className="mt-4">
                <CodeBlock code={multipleConstructs} title="C# – Multiple Constructs Example" id="multipleConstructs" />
              </div>
            </div>

            {/* Three Constructs */}
            <div
              ref={(el) => {
                sectionRefs.current['three-constructs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Three Fundamental Programming Constructs
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Sequence</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The most basic construct – statements executed one after another in the order they appear.</p>
                  <CodeBlock code={sequenceExample} title="C#" id="sequence" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Selection (Decision Making)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Allows your program to make choices based on conditions. Common statements: if...else, switch, ternary operator.</p>
                  <CodeBlock code={selectionExample} title="C#" id="selection" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Repetition (Iteration)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Enables code to be executed multiple times. Common statements: for, while, do-while, foreach.</p>
                  <CodeBlock code={repetitionExample} title="C#" id="repetition" />
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Memory Trick</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Remember "SSR" – Sequence, Selection, Repetition – the foundation of all programming logic.</p>
              </div>
            </div>

            {/* Selection */}
            <div
              ref={(el) => {
                sectionRefs.current['selection'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Selection (Decision Making) in C#
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Types of Selection Statements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">if...else</span> – Most common, allows branching based on a condition.</li>
                <li><span className="font-bold">switch</span> – Multi-way branching based on a single variable's value.</li>
                <li><span className="font-bold">Ternary Operator (?:)</span> – Compact conditional assignment.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Importance of Selection
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Real-world simulation</li>
                <li>Flexible program behavior</li>
                <li>Error handling</li>
                <li>Input validation</li>
                <li>Data processing</li>
              </ul>

              <div className="mt-4">
                <CodeBlock code={ifElseSwitchExample} title="C# – if...else and switch" id="ifElseSwitch" />
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Single Selection (if)
              </h3>
              <CodeBlock code={singleIfExample} title="C#" id="singleIf" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Double Selection (if...else)
              </h3>
              <CodeBlock code={doubleIfExample} title="C#" id="doubleIf" />

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Key Difference</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">Single Selection (if):</span> One execution path based on a condition being true.</li>
                  <li><span className="font-bold">Double Selection (if...else):</span> Two execution paths – one for true, one for false.</li>
                </ul>
              </div>
            </div>

            {/* Multiple and Nested Selection */}
            <div
              ref={(el) => {
                sectionRefs.current['multiple-nested'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Multiple Selection and Nested Selection
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Multiple Selection (switch)
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Used when you have a multi-way branching based on a single
                variable's value being compared to different cases.
              </p>
              <CodeBlock code={switchExample} title="C#" id="switchExample" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Nested Selection
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Involves placing an if or else block within another if or else block.
              </p>
              <CodeBlock code={nestedSelectionExample} title="C#" id="nestedSelection" />

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Choosing the Right Construct</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>Use <span className="font-bold">switch</span> for efficient multi-way branching based on a single variable's value.</li>
                  <li>Use <span className="font-bold">nested selection</span> for more complex decision-making involving multiple conditions.</li>
                </ul>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><span className="font-bold">Remember:</span> Indentation is crucial for readability. Use break statements judiciously within switch cases.</p>
              </div>
            </div>

            {/* Iteration */}
            <div
              ref={(el) => {
                sectionRefs.current['iteration'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Iteration (Repetition) in C#
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Types of Iteration Statements
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">for</span> – Known number of iterations, controlled by a counter variable.</li>
                <li><span className="font-bold">while</span> – Executes as long as a condition remains true.</li>
                <li><span className="font-bold">do...while</span> – Similar to while, but executes at least once.</li>
                <li><span className="font-bold">foreach</span> – Iterates through elements in a collection.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Importance of Iteration
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Data Processing</li>
                <li>Calculations</li>
                <li>User Interaction</li>
                <li>Game Development</li>
                <li>General Automation</li>
              </ul>

              <div className="mt-4">
                <CodeBlock code={forWhileExample} title="C# – for and while Loops" id="forWhile" />
                <CodeBlock code={guessingGame} title="C# – Guessing Game (do-while)" id="guessingGame" />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Choosing the Right Loop</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">for</span> – known number of iterations.</li>
                  <li><span className="font-bold">while</span> – condition-based, may never execute.</li>
                  <li><span className="font-bold">do-while</span> – condition-based, executes at least once.</li>
                  <li><span className="font-bold">foreach</span> – iterating through collections.</li>
                </ul>
              </div>
            </div>

            {/* do-while */}
            <div
              ref={(el) => {
                sectionRefs.current['dowhile'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The do...while Loop
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Syntax
              </h3>
              <CodeBlock code={`do
{
    // code to be executed
} while (condition);`} title="C#" id="doWhileSyntax" />

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li>Unlike a while loop, the do...while loop guarantees that the code block executes <span className="font-bold">at least once</span>, even if the condition is initially false.</li>
                <li>Often used in scenarios where some initial action needs to be performed before the condition is evaluated.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Example
              </h3>
              <CodeBlock code={doWhileExample} title="C#" id="doWhileExample" />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">When to Use do...while</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>When you need to ensure the code block executes at least once.</li>
                  <li>Common scenarios include priming loops and reading user input until valid.</li>
                </ul>
              </div>
            </div>

            {/* while */}
            <div
              ref={(el) => {
                sectionRefs.current['while'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The while Loop
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Syntax
              </h3>
              <CodeBlock code={`while (condition)
{
    // code to be executed
}`} title="C#" id="whileSyntax" />

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li>The code block within the loop will only execute if the condition is initially true.</li>
                <li>Essential to have a condition that eventually evaluates to false to prevent infinite loops.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Example
              </h3>
              <CodeBlock code={whileExample} title="C#" id="whileExample" />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">When to Use while</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Use while loops when you don't know the exact number of iterations beforehand, but the loop continues as long as a specific condition is met.</p>
              </div>
            </div>

            {/* for */}
            <div
              ref={(el) => {
                sectionRefs.current['for'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The for Loop
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Syntax
              </h3>
              <CodeBlock code={`for (initialization; condition; increment/decrement)
{
    // code to be executed
}`} title="C#" id="forSyntax" />

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">Initialization:</span> executed only once at the beginning.</li>
                <li><span className="font-bold">Condition:</span> evaluated before each iteration.</li>
                <li><span className="font-bold">Increment/Decrement:</span> executed after each iteration.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Example
              </h3>
              <CodeBlock code={forLoopExample} title="C#" id="forExample" />

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Additional Features</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>You can omit any of the three expressions.</li>
                  <li>You can have multiple initialization statements separated by commas.</li>
                  <li>The increment/decrement expression can be any valid statement.</li>
                </ul>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><span className="font-bold">When to Use:</span> When you know the exact number of iterations needed beforehand.</p>
              </div>
            </div>

            {/* foreach */}
            <div
              ref={(el) => {
                sectionRefs.current['foreach'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The foreach Loop
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Syntax
              </h3>
              <CodeBlock code={`foreach (var element in collection)
{
    // code to be executed for each element
}`} title="C#" id="foreachSyntax" />

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li>Automatically handles iterating through all elements in the collection.</li>
                <li>No need to manage a loop counter variable.</li>
                <li>More readable and maintainable for collections.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Example
              </h3>
              <CodeBlock code={foreachExample} title="C#" id="foreachExample" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Example – Calculating Average
              </h3>
              <CodeBlock code={foreachAverageExample} title="C#" id="foreachAverage" />

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Why foreach is Preferred Here</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>We're not concerned with the specific index of each element.</li>
                  <li>foreach provides a concise and readable way to access each number.</li>
                  <li>Avoids the need for a loop counter variable, making the code more maintainable.</li>
                </ul>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2"><span className="font-bold">When to Use:</span> Whenever you need to process or access elements in a collection in sequence.</p>
              </div>
            </div>

            {/* Examples */}
            <div
              ref={(el) => {
                sectionRefs.current['examples'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practical Examples
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Reversing a String</h4>
                  <CodeBlock code={reverseStringExample} title="C#" id="reverseString" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Finding the Maximum Value in an Array</h4>
                  <CodeBlock code={maxArrayExample} title="C#" id="maxArray" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Summing Elements in a List</h4>
                  <CodeBlock code={sumListExample} title="C#" id="sumList" />
                </div>
              </div>
            </div>

            {/* break and continue */}
            <div
              ref={(el) => {
                sectionRefs.current['break-continue'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                break and continue Statements
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">break</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Terminates the loop prematurely, causing it to exit immediately.</p>
                  <CodeBlock code={breakExample} title="C#" id="breakExample" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">continue</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Skips the remaining code within the current iteration and jumps to the next iteration.</p>
                  <CodeBlock code={continueExample} title="C#" id="continueExample" />
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">break</span> can be used with any type of loop.</li>
                  <li><span className="font-bold">continue</span> is primarily used with for and while loops.</li>
                  <li>Use these statements judiciously to avoid infinite loops or unintended behavior.</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Practical Examples with break and continue
              </h3>
              <div className="space-y-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Finding the First Prime Number</h4>
                  <CodeBlock code={firstPrimeExample} title="C#" id="firstPrime" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Skipping Negative Numbers</h4>
                  <CodeBlock code={skipNegativeExample} title="C#" id="skipNegative" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Limiting Iterations</h4>
                  <CodeBlock code={limitIterationsExample} title="C#" id="limitIterations" />
                </div>
              </div>
            </div>

            {/* Cheat Sheet */}
            <div
              ref={(el) => {
                sectionRefs.current['cheat-sheet'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Master Exam Cheat Sheet
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Exception Handling</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>try → catch → finally</li>
                    <li>Specific catch blocks before general</li>
                    <li>Custom exceptions inherit from Exception</li>
                    <li>Finally always executes</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Three Constructs</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Sequence (linear execution)</li>
                    <li>Selection (if, else, switch)</li>
                    <li>Repetition (for, while, do-while, foreach)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Loop Types</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>for – known count</li>
                    <li>while – condition at start</li>
                    <li>do-while – at least once</li>
                    <li>foreach – collections</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">break vs continue</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>break – exit loop entirely</li>
                    <li>continue – skip current iteration</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Common Exceptions</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>NullReferenceException</li>
                    <li>DivideByZeroException</li>
                    <li>IndexOutOfRangeException</li>
                    <li>FormatException</li>
                    <li>ArgumentException</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Selection Types</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Single (if)</li>
                    <li>Double (if-else)</li>
                    <li>Multiple (switch)</li>
                    <li>Nested (if inside if)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Lightbulb size={16} /> Exam Tip
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Be ready to explain exception handling (try-catch-finally), create custom exceptions, differentiate between break/continue, write loops (for, while, do-while, foreach), and use selection statements (if, if-else, switch). Remember the sequence, selection, repetition triad.</p>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Code it. Handle it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 C# Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Loop Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Selection Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">4</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Exception handling and flow control are essential for writing
                robust C# applications. Master try-catch-finally, custom
                exceptions, loops, and selection statements to build reliable
                and maintainable code.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exception handling</strong> uses try-catch-finally blocks to prevent crashes and enable graceful error recovery.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Custom exceptions</strong> inherit from System.Exception and allow domain-specific error signaling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Three constructs</strong> – Sequence (linear), Selection (if/switch), Repetition (loops) – form the foundation of all programming logic.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Loop types</strong> – for (known count), while (condition at start), do-while (at least once), foreach (collections).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">break vs continue</strong> – break exits the loop entirely; continue skips the current iteration and moves to the next.
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
            Sidemann Academic Registry • C# Exception Handling & Flow Control 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;