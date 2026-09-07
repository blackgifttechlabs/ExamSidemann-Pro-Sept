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
  LayoutGrid as ThLarge, // Lucide equivalent
  Edit3 as Edit, // Lucide equivalent
  ArrowDownWideNarrow as SortAmountDown, // Lucide equivalent
  Puzzle as PuzzlePiece, // Lucide equivalent
  Settings2 as Cogs, // Lucide equivalent
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'importance', label: 'Importance' },
  { id: 'creating-arrays', label: 'Creating Arrays' },
  { id: 'manipulating-arrays', label: 'Manipulating' },
  { id: 'sorting-searching', label: 'Sorting & Searching' },
  { id: 'structures', label: 'Structures' },
  { id: 'defining-structures', label: 'Defining Structures' },
  { id: 'nested-structures', label: 'Nested Structures' },
  { id: 'structures-arrays', label: 'Structures & Arrays' },
  { id: 'passing-arrays', label: 'Passing Arrays' },
  { id: 'modularization', label: 'Modularization' },
  { id: 'functions', label: 'Functions' },
  { id: 'overloading', label: 'Overloading' },
  { id: 'cheat-sheet', label: 'Cheat Sheet' },
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
        text: 'Arrays in C# are reference types – when you pass an array to a function, changes affect the original array.',
      },
      {
        title: 'Pro Tip',
        text: 'Use the `Length` property to get the number of elements in an array. For multi-dimensional arrays, use `GetLength(dimension)`.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: arrays are fixed-size, zero-indexed, reference types. Structures are value types that can group different data types.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse jagged arrays (int[][]) with multi-dimensional arrays (int[,]). Jagged arrays are arrays of arrays; multi-dimensional are rectangular.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Arrays in C# are reference types – when you pass an array to a function, changes affect the original array.',
      },
      {
        title: 'Pro Tip',
        text: 'Use the `Length` property to get the number of elements in an array. For multi-dimensional arrays, use `GetLength(dimension)`.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: arrays are fixed-size, zero-indexed, reference types. Structures are value types that can group different data types.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse jagged arrays (int[][]) with multi-dimensional arrays (int[,]). Jagged arrays are arrays of arrays; multi-dimensional are rectangular.',
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
      'Array', 'Book', 'Point', 'Student', 'Address', 'Customer', 'Calculator',
      'Random', 'List', 'String', 'Convert'
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
  const averageTemperatureExample = `// Daily temperatures
int[] temperatures = { 15, 18, 20, 22, 25, 23, 21, 19, 17, 16 };
double total = 0;
for (int i = 0; i < temperatures.Length; i++)
{
    total += temperatures[i]; // Add each temperature to the total
}
double averageTemperature = total / temperatures.Length;
Console.WriteLine("The average temperature for the month is: {0:F2} degrees Celsius", averageTemperature);`;

  const oneDimInitExample = `// Array with initial values
int[] numbers = { 10, 20, 30, 40, 50 };`;
  const oneDimSizeExample = `// Array with size 5, initially filled with zeros
int[] scores = new int[5];
scores[0] = 95;
scores[1] = 88;
// ... assign values to other elements`;
  const twoDimInitExample = `// Matrix with initial values
int[,] matrix = {
    { 1, 2, 3 },
    { 4, 5, 6 },
    { 7, 8, 9 }
};`;
  const twoDimSizeExample = `// 3 rows, 4 columns, initially filled with zeros
int[,] table = new int[3, 4];
table[0, 0] = 11;
table[1, 2] = 22;
// ... assign values to other elements`;
  const jaggedExample = `// Array of 3 arrays (size of each unknown yet)
int[][] jaggedArray = new int[3][];
// First row with 3 elements
jaggedArray[0] = new int[] { 1, 3, 5 };
// Second row with 2 elements
jaggedArray[1] = new int[] { 2, 4 };
// Third row with 4 elements
jaggedArray[2] = new int[] { 7, 8, 9, 10 };`;

  const accessingElements = `int[] numbers = { 10, 20, 30 };
// Access the first element (value 10)
int firstElement = numbers[0];`;
  const modifyingElements = `// Change the second element from 20 to 50
numbers[1] = 50;`;
  const forLoopIteration = `for (int i = 0; i < numbers.Length; i++)
{
    Console.WriteLine("Element {0}: {1}", i + 1, numbers[i]);
}`;
  const foreachLoopIteration = `foreach (int number in numbers)
{
    Console.WriteLine(number);
}`;
  const searchingElements = `// Find the index of 20 (returns -1 if not found)
int index = Array.IndexOf(numbers, 20);`;
  const sortingElements = `// Sorts numbers in ascending order
Array.Sort(numbers);`;
  const reversingLoop = `// Using a loop
for (int i = 0; i < numbers.Length / 2; i++)
{
    int temp = numbers[i];
    numbers[i] = numbers[numbers.Length - 1 - i];
    numbers[numbers.Length - 1 - i] = temp;
}
// Using Array.Reverse
Array.Reverse(numbers); // Reverses the order in-place`;
  const copyingArray = `int[] copy = new int[numbers.Length];
// Copy elements to a new array
Array.Copy(numbers, copy, numbers.Length);
// Or, assign individually
for (int i = 0; i < numbers.Length; i++)
{
    copy[i] = numbers[i];
}`;

  const sortNumbers = `int[] numbers = { 5, 2, 8, 1, 3 };
// Sort elements in ascending order (default behavior)
Array.Sort(numbers);
Console.WriteLine("Sorted numbers: {0}", string.Join(", ", numbers));
// Output: 1, 2, 3, 5, 8`;

  const customSort = `string[] names = { "Alice", "Charlie", "Bob" };
// Function to compare names by length (ascending order)
int CompareByNameLength(string a, string b)
{
    return a.Length.CompareTo(b.Length); // Compare string lengths
}
Array.Sort(names, CompareByNameLength); // Use custom comparison function
Console.WriteLine("Sorted names by length: {0}", string.Join(", ", names));
// Output: Bob, Alice, Charlie`;

  const searchExample = `int[] numbers = { 10, 20, 30, 20, 40 };
// Find the first occurrence of 20
int firstIndex = Array.IndexOf(numbers, 20);
// Find the last occurrence of 20 (if present)
int lastIndex = Array.LastIndexOf(numbers, 20);
Console.WriteLine("First index of 20: {0}", firstIndex); // Output: 1
Console.WriteLine("Last index of 20: {0}", lastIndex); // Output: 3 (if not found, returns -1)`;

  const structDefinition = `struct Book
{
    public string Title;
    public string Author;
    public int YearPublished;

    // Optional method to display book information
    public void PrintDetails() 
    {
        Console.WriteLine("Title: {0}", Title);
        Console.WriteLine("Author: {0}", Author);
        Console.WriteLine("Year Published: {0}", YearPublished);
    }
}

class Program
{
    static void Main()
    {
        // Create a Book structure instance and assign values
        Book myBook; 
        myBook.Title = "The Hitchhiker's Guide to the Galaxy";
        myBook.Author = "Douglas Adams";
        myBook.YearPublished = 1979;

        // Call the PrintDetails method
        myBook.PrintDetails();
    }
}`;

  const nestedStructs = `struct Address
{
    public string Street;
    public string City;
    public string State;
    public string ZipCode;
}

struct Customer
{
    public string Name;
    public string Email;
    public Address BillingAddress; // Nested structure member
}

// Accessing Nested Member Variables:
Customer customer1 = new Customer();
customer1.Name = "John Doe";
customer1.Email = "john.doe@example.com";
customer1.BillingAddress.Street = "123 Main St";
customer1.BillingAddress.City = "Anytown";`;

  const arrayOfStructs = `struct Point { public int X; public int Y; }
// Array to hold 5 Point structures
Point[] points = new Point[5];
// Access and modify elements
points[0].X = 10;
points[0].Y = 20;`;

  const structWithArray = `struct Student
{
    public string Name;
    public int[] Scores; // Array of integer scores
}
Student student1;
student1.Name = "Alice";
// Assign scores to the array member
student1.Scores = new int[3] { 90, 85, 92 };`;

  const passArrayToFunction = `void ModifyArray(int[] numbers)
{
    numbers[0] = 100; // Modify the first element
}
int[] myNumbers = { 1, 2, 3 };
ModifyArray(myNumbers);
Console.WriteLine("Modified array: {0}", string.Join(", ", myNumbers));
// Output: 100, 2, 3`;

  const functionDefinition = `public double CalculateArea(int length, int width)
{
    return length * width;
}

// Invocation
double area = CalculateArea(5, 10);
Console.WriteLine("Area: {0}", area);`;

  const functionOverloading = `class Calculator
{
    public int Add(int x, int y)
    {
        return x + y;
    }

    public double Add(double x, double y)
    {
        return x + y;
    }

    public string Add(string message1, string message2)
    {
        return message1 + message2;
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
      <header className="bg-[#134e4a] dark:bg-[#042f2e] border-b border-teal-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <ThLarge size={14} className="inline mr-1" /> C# ARRAYS & STRUCTURES
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 6{' '}
            <span className="text-cyan-300 font-bold italic">
              Arrays &amp; Structures in C#
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master arrays, structures, and modularization in C#. Learn to
            create and manipulate one-dimensional, multi-dimensional, and
            jagged arrays, define and use structures, and write modular code
            with functions.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ThLarge size={14} className="inline mr-1" /> Arrays
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cubes size={14} className="inline mr-1" /> Structures
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
                placeholder="Search for a concept, array type, or method..."
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
                Introduction to Arrays &amp; Structures in C#
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Arrays and structures are fundamental building blocks in C#
                    programming. Arrays provide efficient storage for collections
                    of the same type, while structures allow you to group related
                    data of different types. This learning outcome covers both
                    topics comprehensively.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  An array is like a row of lockers – each locker holds one item,
                  and you access it by its number. A structure is like a filing
                  cabinet drawer – it holds different types of information about
                  one thing (like a person's name, age, and address).
                </p>
              </div>
            </div>

            {/* Importance of Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['importance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Importance of Using Arrays
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Arrays are fundamental data structures that provide a structured
                way to store a fixed-size collection of elements of the same data
                type.
              </p>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Advantages of Arrays
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Efficient Data Management</span> – Fast access and retrieval using index.</li>
                <li><span className="font-bold">Improved Memory Usage</span> – Single block of memory allocation.</li>
                <li><span className="font-bold">Code Readability</span> – Clear structure for related data.</li>
                <li><span className="font-bold">Iteration and Processing</span> – Well-suited for loops and processing sequences.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Common Use Cases
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Storing lists of items (names, scores, prices)</li>
                <li>Representing multidimensional data (matrices, grids)</li>
                <li>Simulating sequences (animation frames, time series)</li>
                <li>Creating lookup tables</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Key Points to Consider
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Fixed Size</span> – Determine size before creating.</li>
                <li><span className="font-bold">Accessing Elements</span> – Stay within bounds (0 to Length-1).</li>
                <li><span className="font-bold">Reference Types</span> – Passing array passes reference, not copy.</li>
              </ul>

              <div className="mt-4">
                <CodeBlock code={averageTemperatureExample} title="C# – Average Temperature" id="avgTemp" />
              </div>
            </div>

            {/* Creating Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['creating-arrays'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Creating Arrays in C#
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 One-Dimensional Arrays
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Store a collection of elements of the same data type in a contiguous memory block.
              </p>
              <div className="space-y-2 mt-2">
                <CodeBlock code={oneDimInitExample} title="C# – Initialization" id="oneDimInit" />
                <CodeBlock code={oneDimSizeExample} title="C# – Specifying Size" id="oneDimSize" />
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Two-Dimensional Arrays (Multidimensional)
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Represent a grid-like structure with rows and columns.
              </p>
              <div className="space-y-2 mt-2">
                <CodeBlock code={twoDimInitExample} title="C# – 2D Initialization" id="twoDimInit" />
                <CodeBlock code={twoDimSizeExample} title="C# – 2D Specifying Size" id="twoDimSize" />
              </div>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                3 Jagged Arrays
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Arrays of arrays where each inner array can have a different size.
              </p>
              <CodeBlock code={jaggedExample} title="C# – Jagged Array" id="jagged" />

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Accessing Elements</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">1D:</span> <code>arrayName[index]</code></li>
                  <li><span className="font-bold">2D:</span> <code>arrayName[rowIndex, columnIndex]</code></li>
                  <li><span className="font-bold">Jagged:</span> <code>jaggedArray[rowIndex][columnIndexWithinInnerArray]</code></li>
                </ul>
              </div>
            </div>

            {/* Manipulating Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['manipulating-arrays'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Manipulating Arrays
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Accessing Elements</h4>
                  <CodeBlock code={accessingElements} title="C#" id="accessElements" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Modifying Elements</h4>
                  <CodeBlock code={modifyingElements} title="C#" id="modifyElements" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Iterating – for loop</h4>
                  <CodeBlock code={forLoopIteration} title="C#" id="forIteration" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Iterating – foreach loop</h4>
                  <CodeBlock code={foreachLoopIteration} title="C#" id="foreachIteration" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Searching</h4>
                  <CodeBlock code={searchingElements} title="C#" id="searchElements" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Sorting</h4>
                  <CodeBlock code={sortingElements} title="C#" id="sortElements" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Reversing</h4>
                  <CodeBlock code={reversingLoop} title="C#" id="reverseElements" />
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Copying Arrays</h4>
                  <CodeBlock code={copyingArray} title="C#" id="copyArray" />
                </div>
              </div>
            </div>

            {/* Sorting and Searching */}
            <div
              ref={(el) => {
                sectionRefs.current['sorting-searching'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Sorting and Searching Arrays
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 Sorting Arrays
              </h3>
              <CodeBlock code={sortNumbers} title="C# – Array.Sort" id="sortNumbers" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Sorting with Custom Comparison
              </h3>
              <CodeBlock code={customSort} title="C# – Custom Sort" id="customSort" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                3 Searching Arrays
              </h3>
              <CodeBlock code={searchExample} title="C# – IndexOf/LastIndexOf" id="searchExample" />
            </div>

            {/* Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Structures – User-Defined Value Types
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Structures are user-defined data types that group related variables
                of various data types under a single unit. They act as value types –
                a copy is created when passed around or assigned.
              </p>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Importance of Structures
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Data Organization</span> – Group related data cohesively.</li>
                <li><span className="font-bold">Memory Efficiency</span> – Efficient for small datasets.</li>
                <li><span className="font-bold">Custom Value Types</span> – Define custom value types with behavior.</li>
                <li><span className="font-bold">Passing by Value</span> – Copy is passed, original unchanged.</li>
              </ul>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-4">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-orange-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Arrays</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Structures</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Data Type</td><td className="p-3">Fixed-size collection, same type</td><td className="p-3">Group of possibly different types</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Value vs Reference</td><td className="p-3">Reference type</td><td className="p-3">Value type</td></tr>
                    <tr><td className="p-3 font-bold">Passing Mechanism</td><td className="p-3">Passes reference</td><td className="p-3">Passes copy</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Inheritance</td><td className="p-3">Can inherit</td><td className="p-3">Cannot inherit</td></tr>
                    <tr><td className="p-3 font-bold">Default Constructor</td><td className="p-3">Has default</td><td className="p-3">No default (needs explicit)</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Methods</td><td className="p-3">Generally don't have</td><td className="p-3">Can optionally have</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Defining Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['defining-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Defining and Instantiating Structures
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 Defining a Structure
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Use the <code>struct</code> keyword.</li>
                <li>Give it a meaningful name.</li>
                <li>Declare member variables of different data types.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Instantiating a Structure
              </h3>
              <CodeBlock code={structDefinition} title="C# – Struct Definition" id="structDefinition" />
            </div>

            {/* Nested Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['nested-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Nested Structures
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Nested structures allow you to create complex data hierarchies by
                placing structures within other structures.
              </p>

              <CodeBlock code={nestedStructs} title="C# – Nested Structures" id="nestedStructs" />
            </div>

            {/* Structures and Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['structures-arrays'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Structures and Arrays
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 Array of Structures
              </h3>
              <CodeBlock code={arrayOfStructs} title="C#" id="arrayOfStructs" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Structure with an Array Member
              </h3>
              <CodeBlock code={structWithArray} title="C#" id="structWithArray" />
            </div>

            {/* Passing Arrays */}
            <div
              ref={(el) => {
                sectionRefs.current['passing-arrays'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Passing Arrays to Functions
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Arrays in C# are reference types. When you pass an array to a
                function, you're passing a reference (memory location) to the
                array's data. Changes made to the array elements within the
                function will be reflected in the original array.
              </p>

              <CodeBlock code={passArrayToFunction} title="C#" id="passArray" />
            </div>

            {/* Modularization */}
            <div
              ref={(el) => {
                sectionRefs.current['modularization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Modularization
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Benefits of Modularization
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Improved Code Organization</span> – Easier to understand and maintain.</li>
                <li><span className="font-bold">Enhanced Maintainability</span> – Modify specific modules without affecting others.</li>
                <li><span className="font-bold">Reusability</span> – Code can be used in different parts of the program.</li>
                <li><span className="font-bold">Reduced Complexity</span> – Compartmentalizes different aspects.</li>
              </ul>
            </div>

            {/* Functions */}
            <div
              ref={(el) => {
                sectionRefs.current['functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Defining and Invoking Functions
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                1 Defining Functions
              </h3>
              <CodeBlock code={`access_modifier return_type function_name(parameter_list)
{
    // Function body containing statements and logic
    return value_to_return; // Optional return statement
}`} title="C#" id="functionSyntax" />

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                2 Invoking Functions
              </h3>
              <CodeBlock code={functionDefinition} title="C#" id="functionDef" />
            </div>

            {/* Overloading */}
            <div
              ref={(el) => {
                sectionRefs.current['overloading'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Function Overloading
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Function overloading allows you to define multiple functions with
                the same name but different parameter lists (number, types, or
                order of parameters). The compiler determines which function to
                call based on the arguments provided.
              </p>

              <CodeBlock code={functionOverloading} title="C#" id="overloading" />
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
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Arrays</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>Fixed-size, same type</li>
                    <li>Zero-indexed</li>
                    <li>Reference type</li>
                    <li>Use <code>Length</code> property</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Array Methods</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><code>Sort()</code>, <code>Reverse()</code></li>
                    <li><code>IndexOf()</code>, <code>LastIndexOf()</code></li>
                    <li><code>Copy()</code></li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Multidimensional</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>2D: <code>int[,] matrix</code></li>
                    <li>Jagged: <code>int[][] jagged</code></li>
                    <li>Access: <code>[row,col]</code> vs <code>[row][col]</code></li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Structures (struct)</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Value type (copy on pass)</li>
                    <li>Group different types</li>
                    <li>Can have methods</li>
                    <li>No default constructor</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Functions</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Overloading (same name, different parameters)</li>
                    <li>Return type, parameters</li>
                    <li>Modularization benefits</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Passing Arrays</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Reference type – changes affect original</li>
                    <li>No copy of data is made</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Lightbulb size={16} /> Exam Tip
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Be ready to create and manipulate one‑dimensional, two‑dimensional, and jagged arrays. Know the difference between arrays (reference type) and structures (value type). Understand function overloading and the benefits of modularization. Remember that arrays have a fixed size and use zero‑based indexing.</p>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Organize it. Structure it. Reuse it. 🚀</p>
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
                  <span>Array Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </li>
                <li className="flex justify-between">
                  <span>Array Methods</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Arrays store collections of the same type efficiently; structures
                group different types together. Master both to build organized,
                maintainable, and efficient C# applications.
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
                <strong className="text-white">Arrays</strong> are fixed-size,
                zero-indexed, reference-type collections of the same data type.
                Use <code>Length</code> for size and <code>Array.Sort()</code>,
                <code>Array.Reverse()</code>, <code>Array.IndexOf()</code> for manipulation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Multi-dimensional arrays</strong> –
                2D (<code>int[,]</code>) for rectangular grids; jagged arrays
                (<code>int[][]</code>) for arrays of arrays with varying sizes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Structures (struct)</strong> are
                value types that group different data types. They are copied when
                passed and cannot inherit from other structures.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Function overloading</strong> allows
                multiple functions with the same name but different parameter
                lists – the compiler selects the right one based on arguments.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Modularization</strong> improves
                code organization, maintainability, reusability, and reduces
                complexity – essential for professional software development.
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
            Sidemann Academic Registry • C# Arrays & Structures 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome6;