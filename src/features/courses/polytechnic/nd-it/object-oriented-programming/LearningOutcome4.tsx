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
  Parentheses as ParenthesesIcon, // Avoid keyword collisions
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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'ui-ux', label: 'UI vs UX' },
  { id: 'design-principles', label: 'Design Principles' },
  { id: 'layout-hierarchy', label: 'Layout & Hierarchy' },
  { id: 'interaction-design', label: 'Interaction Design' },
  { id: 'branding', label: 'Branding' },
  { id: 'information-architecture', label: 'Information Architecture' },
  { id: 'responsive-adaptive', label: 'Responsive & Adaptive' },
  { id: 'controls-components', label: 'Controls & Components' },
  { id: 'data-binding', label: 'Data Binding & Validation' },
  { id: 'gui-architecture', label: 'GUI Architecture' },
  { id: 'menus-toolbars', label: 'Menus & Toolbars' },
  { id: 'dialogue-boxes', label: 'Dialogue Boxes' },
  { id: 'cheat-sheet', label: 'Cheat Sheet' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
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
        text: 'UI (User Interface) is about the visual elements users interact with, while UX (User Experience) encompasses the entire journey and emotional response.',
      },
      {
        title: 'Pro Tip',
        text: 'The order of UI design principles: Simplicity, Consistency, Usability, Feedback, Accessibility, Visual Hierarchy, Aesthetics.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "SCUFAVA" – Simplicity, Consistency, Usability, Feedback, Accessibility, Visual Hierarchy, Aesthetics.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse responsive design (one layout that reflows) with adaptive design (multiple distinct layouts for different screen sizes).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'UI (User Interface) is about the visual elements users interact with, while UX (User Experience) encompasses the entire journey and emotional response.',
      },
      {
        title: 'Pro Tip',
        text: 'The order of UI design principles: Simplicity, Consistency, Usability, Feedback, Accessibility, Visual Hierarchy, Aesthetics.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "SCUFAVA" – Simplicity, Consistency, Usability, Feedback, Accessibility, Visual Hierarchy, Aesthetics.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse responsive design (one layout that reflows) with adaptive design (multiple distinct layouts for different screen sizes).',
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
      'Console', 'Math', 'Program', 'Person', 'MyClass', 'DivideByZeroException',
      'FormatException', 'Exception', 'Convert', 'System', 'Shape', 'Circle', 'Rectangle',
      'List', 'Button', 'EventArgs', 'EventHandler', 'MessageBox', 'DialogResult'
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
          className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          {copiedId === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-slate-50 dark:bg-slate-900 p-4 overflow-x-auto">
        {highlightSyntax(code)}
      </div>
    </div>
  );

  const messageBoxCode = `// Simple Info Message
MessageBox.Show("Operation completed successfully.", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);

// Confirmation Dialog
DialogResult result = MessageBox.Show("Are you sure you want to proceed?", "Confirm", MessageBoxButtons.YesNo, MessageBoxIcon.Question);
if (result == DialogResult.Yes)
{
    // User clicked Yes
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Paintbrush size={14} className="inline mr-1" /> GUI DEVELOPMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              Develop GUIs in C#
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master GUI development in C#: UI/UX principles, responsive design,
            controls, data binding, validation, and building professional
            desktop applications with WinForms, WPF, and Xamarin.Forms.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Paintbrush size={14} className="inline mr-1" /> UI/UX
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <CodeBranch size={14} className="inline mr-1" /> Responsive
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
                placeholder="Search for a concept, control, or term..."
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
                Introduction to GUI Development in C#
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Graphical User Interface (GUI) development in C# allows
                    you to build professional desktop and cross-platform
                    applications. This learning outcome covers UI/UX principles,
                    responsive design, controls, data binding, validation, and
                    the architecture of GUI applications.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of UI as the buttons, dials, and levers in a car. UX
                  is the entire driving experience, including comfort, ease of
                  navigation, and how effectively you reach your destination.
                </p>
              </div>
            </div>

            {/* UI vs UX */}
            <div
              ref={(el) => {
                sectionRefs.current['ui-ux'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Distinguishing UI and UX
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Paintbrush size={14} /> User Interface (UI)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The visual elements and functionalities that a user interacts with – buttons, menus, text boxes, icons, visual layout. It's about the "look and feel" of the product.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Smile size={14} /> User Experience (UX)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The user's overall perception and experience while interacting with a product – usability, ease of use, information architecture, interaction design, accessibility, and emotions evoked.</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Analogy</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">UI is the buttons, dials, and levers in a car. UX is the entire driving experience.</p>
              </div>
            </div>

            {/* Design Principles */}
            <div
              ref={(el) => {
                sectionRefs.current['design-principles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                UI Design Principles
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Simplicity and Clarity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Keep the UI clean and uncluttered. Users should understand the layout and functionality at a glance.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Consistency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Maintain consistency in UI elements, layout, terminology, and visual style across the entire product.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Usability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Design for intuitiveness. Users should accomplish tasks easily and efficiently with minimal effort.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Feedback</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provide clear and timely feedback about user actions – visual cues, sounds, or messages.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Accessibility</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ensure the UI is usable by people with disabilities – color contrast, keyboard navigation, screen reader compatibility.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Visual Hierarchy</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Use size, color, and spacing to guide users' attention towards important information and functionality.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-pink-600 dark:text-pink-400">Aesthetics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create a visually appealing UI that aligns with brand identity and resonates with the target audience.</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">💡 How UI Contributes to UX</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">A well-designed UI is a significant contributor to a positive UX. When UI elements are clear, usable, and aesthetically pleasing, users interact smoothly and efficiently.</p>
              </div>
            </div>

            {/* Layout and Hierarchy */}
            <div
              ref={(el) => {
                sectionRefs.current['layout-hierarchy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Layout and Visual Hierarchy
              </h2>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-2">
                Layout
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Balance and Proportion</span> – Arrange UI elements in a balanced and proportionate manner. Consider the "rule of thirds."</li>
                <li><span className="font-bold">White Space</span> – Use white space effectively to separate elements, improve readability, and avoid clutter.</li>
                <li><span className="font-bold">Responsiveness</span> – Design UIs to adapt and render well on various screen sizes.</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Visual Hierarchy
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Prioritization</span> – Use size, color, and contrast to guide attention towards important elements.</li>
                <li><span className="font-bold">Grouping</span> – Group related elements together using proximity, borders, or background color.</li>
                <li><span className="font-bold">Scanning Patterns</span> – Consider F-shaped and Z-pattern scanning patterns.</li>
              </ul>
            </div>

            {/* Interaction Design */}
            <div
              ref={(el) => {
                sectionRefs.current['interaction-design'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interaction Design
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Interaction Design focuses on creating engaging and effective
                interactions between users and digital products. Key areas include:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>User research – understanding user needs, goals, and mental models.</li>
                <li>Information architecture (IA) – organizing content and functionality.</li>
                <li>User interface (UI) design – creating visual elements and layouts.</li>
                <li>Usability – ensuring the product is easy and efficient to use.</li>
                <li>User experience (UX) – designing the overall experience.</li>
              </ul>
            </div>

            {/* Branding */}
            <div
              ref={(el) => {
                sectionRefs.current['branding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Branding and Visual Identity
              </h2>

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Branding</span> – core values, personality, and messaging of a product or company.</li>
                <li><span className="font-bold">Visual identity</span> – tangible expression through logo, typography, color palette, imagery, and graphic design.</li>
              </ul>
            </div>

            {/* Information Architecture */}
            <div
              ref={(el) => {
                sectionRefs.current['information-architecture'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Information Architecture (IA)
              </h2>

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">IA</span> – the art and science of organizing content within a digital product.</li>
                <li><span className="font-bold">Findable</span> – users can easily locate information.</li>
                <li><span className="font-bold">Understandable</span> – organization is clear and logical.</li>
                <li><span className="font-bold">Usable</span> – users can navigate efficiently.</li>
                <li><span className="font-bold">User-centered</span> – designed based on user needs.</li>
              </ul>
            </div>

            {/* Responsive and Adaptive */}
            <div
              ref={(el) => {
                sectionRefs.current['responsive-adaptive'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Responsive and Adaptive Design
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Responsive Design</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Adapts the layout and UI elements to fit different screen sizes while maintaining a single codebase. Layouts reflow dynamically.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Adaptive Design</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Employs multiple distinct layouts specifically designed for predefined screen size categories (breakpoints).</p>
                </div>
              </div>

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">Layout Managers</span> – Grid, StackPanel, DockPanel, FlowLayoutPanel, TableLayoutPanel</li>
                <li><span className="font-bold">Responsive Fonts/Sizing</span> – Use relative sizes instead of fixed pixels</li>
                <li><span className="font-bold">Media Queries</span> – For web-based C# applications (ASP.NET, Blazor, MVC)</li>
                <li><span className="font-bold">Testing</span> – Test across diverse devices, screen sizes, and orientations</li>
              </ul>
            </div>

            {/* Controls and Components */}
            <div
              ref={(el) => {
                sectionRefs.current['controls-components'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Controls and Components
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">WinForms Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Standard controls (Button, TextBox, Label, ListBox) for desktop apps with a familiar Windows look and feel.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">WPF Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Modern controls (Button, TextBlock, ItemsControl) with advanced layout using XAML. Supports data templating and styling.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Xamarin.Forms Controls</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Cross-platform controls (Button, Entry, ListView) rendered natively on Android, iOS, and UWP.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">Custom Components</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create reusable components by inheriting from existing controls or composing multiple controls together.</p>
                </div>
              </div>
            </div>

            {/* Data Binding */}
            <div
              ref={(el) => {
                sectionRefs.current['data-binding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Binding and Validation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Data Binding</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Establishes a connection between UI controls and underlying data sources. Changes in data automatically update the UI (two-way binding). Simplifies keeping UI and data synchronized.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Validation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ensures user input conforms to expected rules, data types, and formats. Provides mechanisms for displaying validation errors to the user.</p>
                </div>
              </div>
            </div>

            {/* GUI Architecture */}
            <div
              ref={(el) => {
                sectionRefs.current['gui-architecture'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Basic Architecture of GUI Applications
              </h2>

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">UI Framework</span> – Foundation (WinForms, WPF, Xamarin.Forms, MAUI)</li>
                <li><span className="font-bold">Forms/Windows/Pages</span> – Top-level containers for UI elements</li>
                <li><span className="font-bold">Controls</span> – Reusable UI elements (buttons, labels, text boxes)</li>
                <li><span className="font-bold">Events</span> – Mechanisms (Click, TextChanged) that notify about user interactions</li>
                <li><span className="font-bold">Event Handlers</span> – Methods in C# code that execute when events occur</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Features of GUI Frameworks
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li><span className="font-bold">Layout Management</span> – Tools for arranging controls responsively</li>
                <li><span className="font-bold">Data Binding</span> – Synchronize UI and data sources</li>
                <li><span className="font-bold">Validation</span> – Systems for validating user input</li>
                <li><span className="font-bold">Accessibility</span> – Support for assistive technologies</li>
                <li><span className="font-bold">Styling and Theming</span> – Consistent visual appearance</li>
              </ul>
            </div>

            {/* Menus and Toolbars */}
            <div
              ref={(el) => {
                sectionRefs.current['menus-toolbars'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Menus and Toolbars
              </h2>

              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-4">
                <li><span className="font-bold">Menus</span> – Hierarchical structures (MenuStrip, Menu) at the top of a window offering categorized commands (File, Edit, View).</li>
                <li><span className="font-bold">Toolbars</span> – Rows of buttons providing quick icon-based access to frequently used commands.</li>
                <li><span className="font-bold">Context Menus</span> – Menus that appear on right-click, offering actions relevant to the context.</li>
              </ul>
            </div>

            {/* Dialogue Boxes */}
            <div
              ref={(el) => {
                sectionRefs.current['dialogue-boxes'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Dialogue Boxes
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Dialogue boxes are secondary windows that appear on top of the main
                application window, typically requiring user interaction before
                returning control (modal). They are used to:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Display information (alerts)</li>
                <li>Get user input (file save dialogue, settings)</li>
                <li>Confirm actions ("Are you sure?")</li>
              </ul>

              <h3 className="text-lg font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight mt-6">
                Creating Dialogue Boxes in C#
              </h3>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-2">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Using MessageBox</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">The easiest way for simple messages and confirmations. Provides standard icons and button combinations.</p>
                <CodeBlock code={messageBoxCode} title="C# (MessageBox)" id="messageBox" />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Custom Dialogue Boxes</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Create a new Form (WinForms), Window (WPF), or ContentPage (Xamarin.Forms). Show modally using ShowDialog() or Navigation.PushModalAsync().</p>
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <p className="text-xs text-slate-600 dark:text-slate-400"><span className="font-bold">Choosing the Right Approach:</span> MessageBox is sufficient for simple alerts. Custom dialogues are needed for complex input or custom layouts.</p>
                </div>
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <p className="text-xs text-slate-600 dark:text-slate-400"><span className="font-bold">Additional Considerations:</span> Modality (modal vs non-modal) and Result Communication (how the dialogue returns information).</p>
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
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">UI vs UX</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">UI:</span> Visual elements (buttons, layout)</li>
                    <li><span className="font-bold">UX:</span> Entire user experience (emotions, ease of use)</li>
                    <li>Analogy: UI = car controls; UX = driving experience</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">UI Design Principles</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Simplicity</li>
                    <li>Consistency</li>
                    <li>Usability</li>
                    <li>Feedback</li>
                    <li>Accessibility</li>
                    <li>Visual Hierarchy</li>
                    <li>Aesthetics</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Responsive vs Adaptive</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">Responsive:</span> Single layout, reflows dynamically</li>
                    <li><span className="font-bold">Adaptive:</span> Multiple distinct layouts for breakpoints</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">GUI Architecture</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Framework (WinForms, WPF, Xamarin)</li>
                    <li>Forms/Windows/Pages</li>
                    <li>Controls, Events, Event Handlers</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Dialogue Boxes</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li><span className="font-bold">MessageBox</span> for simple alerts/confirmations</li>
                    <li><span className="font-bold">Custom Forms/Windows</span> for complex input</li>
                    <li>Modal vs non-modal</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Key Framework Features</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400">
                    <li>Layout Management</li>
                    <li>Data Binding</li>
                    <li>Validation</li>
                    <li>Accessibility</li>
                    <li>Styling / Theming</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <Lightbulb size={16} /> Exam Tip
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300">Be ready to distinguish UI from UX, list UI design principles, compare responsive vs adaptive design, describe GUI architecture, and explain how to use MessageBox and custom dialogue boxes in C#. Remember that data binding keeps UI and data synchronized, and validation ensures correct input.</p>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Design it. Build it. Ship it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 GUI Insight
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
                  <span>UI Design Principles</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>GUI Frameworks</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">3</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                GUI development is about creating intuitive, responsive, and
                accessible interfaces. Master the principles, controls, and
                architecture, and you'll build applications that users love.
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
                <strong className="text-white">UI vs UX</strong> – UI is the visual interface; UX is the entire user journey and emotional response. Both are essential for great applications.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">UI Design Principles</strong> – Simplicity, Consistency, Usability, Feedback, Accessibility, Visual Hierarchy, Aesthetics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Responsive vs Adaptive</strong> – Responsive uses one layout that reflows; Adaptive uses multiple distinct layouts for different screen sizes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">GUI Architecture</strong> – Framework → Forms/Windows → Controls → Events → Event Handlers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Dialogue Boxes</strong> – MessageBox for simple alerts; custom Forms/Windows for complex input. Data binding synchronizes UI and data; validation ensures correct input.
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
            Sidemann Academic Registry • GUI Development in C# 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;