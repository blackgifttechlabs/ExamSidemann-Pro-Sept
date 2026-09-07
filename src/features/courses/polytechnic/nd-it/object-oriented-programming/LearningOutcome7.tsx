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
  Parentheses,
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
  BatteryLow,
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
  File,
  FileText,
  Database,
  Table,
  List as ListIcon,
  FileJson,
  FileCode,
  Play,
  GraduationCap,
  Lightbulb as LightbulbIcon,
  File as FileIcon,
  Folder,
  FolderOpen,
  FilePlus,
  FileMinus,
  FileEdit,
  FileSearch,
  HardDrive,
  Server,
  Network,
  Cloud as CloudIcon,
  Save,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Film,
  Youtube,
  LockIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'file-handling', label: 'File Handling' },
  { id: 'writing-files', label: 'Writing Files' },
  { id: 'reading-files', label: 'Reading Files' },
  { id: 'appending-files', label: 'Appending' },
  { id: 'listbox-load', label: 'ListBox Load' },
  { id: 'database-setup', label: 'DB Setup' },
  { id: 'interface-method', label: 'Interface' },
  { id: 'connection-class', label: 'Connection' },
  { id: 'form-connection', label: 'Form Connection' },
  { id: 'exam-tips', label: 'Tips' },
  { id: 'cheat-sheet', label: 'Cheat Sheet' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'StreamWriter and StreamReader are the main classes for file handling in C#. Always wrap them in using blocks to ensure files are closed automatically.',
      },
      {
        title: 'Pro Tip',
        text: 'When connecting to MS Access, use the OLEDB provider: Provider=Microsoft.ACE.OLEDB.12.0 for .accdb files.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: StreamWriter = "Pen" (writing), StreamReader = "Eyes" (reading). The using block is like a "smart assistant" that closes the file for you.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to check if a file exists using File.Exists() before trying to read it – otherwise your program will crash.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'StreamWriter and StreamReader are the main classes for file handling in C#. Always wrap them in using blocks to ensure files are closed automatically.',
      },
      {
        title: 'Pro Tip',
        text: 'When connecting to MS Access, use the OLEDB provider: Provider=Microsoft.ACE.OLEDB.12.0 for .accdb files.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: StreamWriter = "Pen" (writing), StreamReader = "Eyes" (reading). The using block is like a "smart assistant" that closes the file for you.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to check if a file exists using File.Exists() before trying to read it – otherwise your program will crash.',
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
      'string', 'StreamWriter', 'StreamReader', 'File', 'DataTable', 'OleDbConnection',
      'OleDbCommand', 'OleDbDataAdapter', 'MessageBox', 'ListBox', 'IDataHandler',
      'AccessService', 'Form', 'Form1', 'Random', 'List', 'DataGridView'
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
      'Console', 'Math', 'Program', 'Exception', 'Array', 'StreamReader',
      'StreamWriter', 'File', 'MessageBox', 'ListBox', 'DataTable',
      'OleDbConnection', 'OleDbCommand', 'OleDbDataAdapter', 'IDataHandler',
      'AccessService', 'Form', 'Form1', 'Random', 'List', 'DataGridView'
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
  const writeFileExample = `string myFile = "students.txt";

// 2. Open the "Pen" (StreamWriter) inside a 'using' block
// The 'using' block ensures the file is closed automatically when done
using (StreamWriter writer = new StreamWriter(myFile))
{
    // 3. Write lines of text
    writer.WriteLine("Student Name: John Moyo");
    writer.WriteLine("Course: ICT");
    
    // Show a message to the user
    MessageBox.Show("File has been created and saved!");
}`;

  const readFileExample = `string myFile = "students.txt";

// 1. Always check if the file exists first so the program doesn't crash
if (File.Exists(myFile))
{
    // 2. Open the "Eyes" (StreamReader)
    using (StreamReader reader = new StreamReader(myFile))
    {
        string line;
        // 3. Read line by line until there is nothing left (null)
        while ((line = reader.ReadLine()) != null)
        {
            // Show each line in a popup box
            MessageBox.Show("Reading from file: " + line);
        }
    }
}`;

  const appendFileExample = `string myFile = "students.txt";

// The 'true' here is the magic button for APPENDING
using (StreamWriter writer = new StreamWriter(myFile, true))
{
    writer.WriteLine("Student Name: Sarah Gumede");
    MessageBox.Show("New student added to the bottom of the list!");
}`;

  const listBoxExample = `// Clear the listbox first so we don't show duplicates
listBox1.Items.Clear();

if (File.Exists("students.txt"))
{
    // Read all lines at once into an array (a list)
    string[] allLines = File.ReadAllLines("students.txt");

    // Loop through that list and add them to the ListBox
    foreach (string item in allLines)
    {
        listBox1.Items.Add(item);
    }
}`;

  const interfaceExample = `using System.Data; // Needed for DataTables

public interface IDataHandler
{
    // Rule 1: Must be able to get all data to show in the GridView
    DataTable ReadData();

    // Rule 2: Must be able to save a new name
    void SaveData(string name);
}`;

  const connectionClassExample = `using System;
using System.Data;
using System.Data.OleDb; // OLEDB is for MS Access

public class AccessService : IDataHandler
{
    // 1. The Connection String (The Address of your file)
    // Note: Provider=Microsoft.ACE.OLEDB.12.0 is standard for .accdb files
    string connString = @"Provider=Microsoft.ACE.OLEDB.12.0;Data Source=C:\\YourPath\\CollegeDB.accdb";

    public DataTable ReadData()
    {
        using (OleDbConnection conn = new OleDbConnection(connString))
        {
            DataTable dt = new DataTable();
            string query = "SELECT * FROM Students";
            OleDbDataAdapter adapter = new OleDbDataAdapter(query, conn);
            adapter.Fill(dt); // Fill the virtual table with database data
            return dt;
        }
    }

    public void SaveData(string name)
    {
        using (OleDbConnection conn = new OleDbConnection(connString))
        {
            conn.Open();
            string query = "INSERT INTO Students (StudentName) VALUES ('" + name + "')";
            OleDbCommand cmd = new OleDbCommand(query, conn);
            cmd.ExecuteNonQuery(); // Execute the save
        }
    }
}`;

  const formCodeExample = `public partial class Form1 : Form
{
    // Create a link to our Interface and Class
    IDataHandler db = new AccessService();

    // When the form opens, show the data in the "Database View" (DataGridView)
    private void Form1_Load(object sender, EventArgs e)
    {
        dgvStudents.DataSource = db.ReadData();
    }

    private void btnSave_Click(object sender, EventArgs e)
    {
        // 1. Save what is in the textbox
        db.SaveData(txtName.Text);
        
        // 2. Refresh the view so the new name appears immediately
        dgvStudents.DataSource = db.ReadData();
        
        MessageBox.Show("Student saved to MS Access!");
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
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> FILE HANDLING & DATABASE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 7{' '}
            <span className="text-indigo-300 font-bold italic">
              File Handling &amp; MS Access
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master file handling with StreamReader and StreamWriter, and learn
            how to connect C# Windows Forms to MS Access databases using the
            Interface Method – essential skills for the HEXCO Zimbabwe curriculum.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileText size={14} className="inline mr-1" /> File Handling
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Database size={14} className="inline mr-1" /> MS Access
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
                placeholder="Search for a concept, StreamReader, or connection..."
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
                Introduction to File Handling &amp; MS Access in C#
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This is a complete, step-by-step educational guide for
                    beginners. We will cover File Handling and MS Access Database
                    Connectivity using Windows Forms, specifically tailored for
                    the HEXCO Zimbabwe curriculum.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  A text file is like a physical notebook kept in a drawer (your
                  hard drive). To write in it, you need a Pen (StreamWriter). To
                  read it, you need your Eyes (StreamReader). To touch the notebook,
                  you need to open the drawer (Stream).
                </p>
              </div>
            </div>

            {/* File Handling Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['file-handling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                File Handling – Working with Text Files
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Pen size={14} /> StreamWriter
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The "Pen" – used to write data to a file. Creates a new file or overwrites an existing one.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <EyeIcon size={14} /> StreamReader
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The "Eyes" – used to read data from a file. Reads line by line or all at once.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                   <LockIcon size={14} /> using Block
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Automatically closes the file when done – prevents memory leaks and file locks.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">⚠️ Important: The Toolbox</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Before writing any file code, add this line at the top of your script: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">using System.IO;</code> – This stands for Input/Output.</p>
              </div>
            </div>

            {/* Writing Files */}
            <div
              ref={(el) => {
                sectionRefs.current['writing-files'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Writing a New File – The "Overwriter"
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                This process creates a brand new file. If the file already exists,
                it deletes everything inside and starts fresh. Useful for creating
                a new list of students.
              </p>

              <CodeBlock code={writeFileExample} title="C# – Writing to a File" id="writeFile" />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">💡 Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">StreamWriter</span> – opens a file for writing.</li>
                  <li><span className="font-bold">using</span> block – ensures the file is closed automatically.</li>
                  <li><span className="font-bold">WriteLine</span> – writes a line of text to the file.</li>
                  <li><span className="font-bold">MessageBox</span> – shows a confirmation to the user.</li>
                </ul>
              </div>
            </div>

            {/* Reading Files */}
            <div
              ref={(el) => {
                sectionRefs.current['reading-files'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Reading a File – The "Display"
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                This process opens a file and reads it line by line. We use a
                while loop because we don't know how many names are in the notebook.
              </p>

              <CodeBlock code={readFileExample} title="C# – Reading from a File" id="readFile" />

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">💡 Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">File.Exists</span> – always check if the file exists first to prevent crashes.</li>
                  <li><span className="font-bold">StreamReader</span> – opens a file for reading.</li>
                  <li><span className="font-bold">ReadLine</span> – reads one line at a time; returns null when the end is reached.</li>
                  <li><span className="font-bold">while</span> loop – continues until all lines are read.</li>
                </ul>
              </div>
            </div>

            {/* Appending Files */}
            <div
              ref={(el) => {
                sectionRefs.current['appending-files'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Appending Data – The "Updater"
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                What if you want to add a 3rd student to your list without deleting
                the first two? You use Append. By adding <code>true</code> inside
                the brackets, you tell C# to "go to the end of the file and keep writing."
              </p>

              <CodeBlock code={appendFileExample} title="C# – Appending to a File" id="appendFile" />

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">💡 Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">true</span> – the second parameter tells StreamWriter to append instead of overwrite.</li>
                  <li>Existing content is preserved – new content is added at the end.</li>
                </ul>
              </div>
            </div>

            {/* ListBox Load */}
            <div
              ref={(el) => {
                sectionRefs.current['listbox-load'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Loading File Data into a ListBox
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                In exams, you are often asked to show file data in a UI element
                like a ListBox. This example reads all lines from a file and
                adds them to a ListBox control.
              </p>

              <CodeBlock code={listBoxExample} title="C# – Loading Data into a ListBox" id="listBox" />

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">💡 Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">Items.Clear()</span> – clears the ListBox before loading new data.</li>
                  <li><span className="font-bold">File.ReadAllLines</span> – reads all lines into a string array.</li>
                  <li><span className="font-bold">foreach</span> – loops through each line and adds it to the ListBox.</li>
                </ul>
              </div>
            </div>

            {/* Database Setup */}
            <div
              ref={(el) => {
                sectionRefs.current['database-setup'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                MS Access Database Setup
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Step 1: Create the MS Access Database
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Open MS Access.</li>
                <li>Click <span className="font-bold">Blank Database</span>.</li>
                <li>Name it <code>CollegeDB.accdb</code> and save it in a folder you can find (like Documents).</li>
                <li>Create a Table named <code>Students</code>.</li>
                <li>Add two columns: <code>ID</code> (AutoNumber) and <code>StudentName</code> (Short Text).</li>
                <li>Add 2 or 3 names manually, then Close Access. (C# cannot talk to the database if Access is still open).</li>
              </ul>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 mt-4">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">⚠️ Important</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Close MS Access before running your C# application – otherwise, the file will be locked and your connection will fail.</p>
              </div>
            </div>

            {/* Interface Method */}
            <div
              ref={(el) => {
                sectionRefs.current['interface-method'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Interface Method – The Job Description
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                In Visual Studio, right-click your Project → Add → New Item → Interface.
                Name it <code>IDataHandler.cs</code>. The interface is just a list
                of rules. It says: "Any class that handles my data MUST have these
                two functions."
              </p>

              <CodeBlock code={interfaceExample} title="C# – IDataHandler Interface" id="interface" />

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">💡 Why Use an Interface?</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>Defines a contract – any class that implements it must have these methods.</li>
                  <li>Allows swapping data sources (e.g., MS Access → SQL Server) without changing the UI.</li>
                  <li>Promotes loose coupling and better code organization.</li>
                </ul>
              </div>
            </div>

            {/* Connection Class */}
            <div
              ref={(el) => {
                sectionRefs.current['connection-class'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Connection Class – The Worker
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Create a new Class named <code>AccessService.cs</code>. This class
                will use OleDb (the language for MS Access). This class does the
                actual work of opening the "drawer" and talking to the database.
              </p>

              <CodeBlock code={connectionClassExample} title="C# – AccessService Class" id="connectionClass" />

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mt-4">
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400">💡 Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">OleDbConnection</span> – connects to the MS Access database.</li>
                  <li><span className="font-bold">OleDbDataAdapter</span> – fills a DataTable with query results.</li>
                  <li><span className="font-bold">OleDbCommand</span> – executes SQL commands (INSERT, UPDATE, DELETE).</li>
                  <li><span className="font-bold">using</span> block – ensures the connection is closed automatically.</li>
                </ul>
              </div>
            </div>

            {/* Form Connection */}
            <div
              ref={(el) => {
                sectionRefs.current['form-connection'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Connecting the Buttons in Windows Forms
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Go to your Form Design. Add: a DataGridView (rename it to
                <code>dgvStudents</code>), a TextBox (rename it to <code>txtName</code>),
                and a Button (rename it to <code>btnSave</code>).
              </p>

              <CodeBlock code={formCodeExample} title="C# – Form Code" id="formCode" />

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">💡 Key Points</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li><span className="font-bold">IDataHandler db</span> – creates an instance of the AccessService class.</li>
                  <li><span className="font-bold">Form1_Load</span> – loads data into the DataGridView when the form opens.</li>
                  <li><span className="font-bold">btnSave_Click</span> – saves data and refreshes the view.</li>
                </ul>
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
                Final Tips for HEXCO Students
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Settings size={14} /> The Click Path
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">In Visual Studio, to add the database connection tools, go to Tools → NuGet Package Manager → Manage Packages for Solution and search for <code>System.Data.OleDb</code> if it's not working.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Table size={14} /> The "View"
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The DataGridView is your best friend. Its <code>.DataSource</code> property is what links the C# code to the visual table.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle size={14} /> MS Access Errors
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">If it says "Provider not registered," you might need to install the "Microsoft Access Database Engine" or change your project from Any CPU to x86 in the Project Properties.</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Youtube size={16} /> Recommended Video Tutorial
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Since most tutorials use SQL Server, it is hard to find a perfect
                  MS Access Interface one. However, this video shows the exact
                  process of connecting MS Access to C# WinForms and showing it
                  in a DataGridView.
                </p>
                <div className="mt-3 bg-slate-900 dark:bg-black rounded-xl overflow-hidden shadow-xl aspect-video">
                  <iframe
                    className="w-full h-full min-h-[250px]"
                    src="https://www.youtube.com/embed/EK1vGOaGGy8"
                    title="How to Connect MS Access Database to C# Windows Forms"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <span className="font-bold">Note:</span> To make it the "Interface Method," simply take the connection code shown in the video and put it inside a class as we did in Step 3.
                </p>
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
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">File Streams</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><code>StreamWriter</code> – write to file</li>
                    <li><code>StreamReader</code> – read from file</li>
                    <li><code>using</code> block auto-closes</li>
                    <li><code>File.Exists()</code> check before reading</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Appending vs Overwriting</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><code>new StreamWriter(file)</code> – overwrites</li>
                    <li><code>new StreamWriter(file, true)</code> – appends</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">MS Access Connection</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>OleDbConnection, OleDbCommand, OleDbDataAdapter</li>
                    <li>Connection string: <code>Provider=Microsoft.ACE.OLEDB.12.0;Data Source=path</code></li>
                    <li>Always close connection (use <code>using</code>)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Interface Method</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Define an interface with CRUD method signatures</li>
                    <li>Implement in a separate class</li>
                    <li>Call through interface reference</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">DataGridView</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Set <code>.DataSource = DataTable</code></li>
                    <li>Refresh after insert: reassign <code>DataSource</code></li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Common Errors</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>"Provider not registered" → install Access Database Engine or compile as x86</li>
                    <li>File not found → check path and <code>File.Exists</code></li>
                    <li>Database locked → close Access before running app</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Lightbulb size={16} /> Exam Tip
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Always check if a file exists before reading it. For databases, always wrap connections in <code>using</code> blocks to ensure they are closed. The Interface Method is a common exam requirement – remember to define the interface first, then implement it in a separate class, and finally use that class in your form.</p>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Read it. Write it. Connect it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 File & DB Insight
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
                  <span>File Classes</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>DB Steps</span>
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
                File handling and database connectivity are essential skills for
                any C# developer. Master StreamReader, StreamWriter, and the
                Interface Method for MS Access – they will appear in your exams
                and in real-world projects.
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
                <strong className="text-white">StreamWriter</strong> writes to files (the "Pen"). <strong>StreamReader</strong> reads from files (the "Eyes"). Always use <code>using</code> blocks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Appending</strong> – use <code>new StreamWriter(file, true)</code> to add to the end of a file without overwriting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">MS Access connection</strong> uses OleDb with the Provider <code>Microsoft.ACE.OLEDB.12.0</code>. Always close connections with <code>using</code> blocks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Interface Method</strong> – define an interface (IDataHandler), implement it in a class (AccessService), then use it in your form for loose coupling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">DataGridView</strong> – set <code>.DataSource</code> to a DataTable to display data. Refresh by reassigning after inserts.
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
            Sidemann Academic Registry • C# File Handling & MS Access 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;