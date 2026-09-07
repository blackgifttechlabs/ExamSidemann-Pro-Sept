import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Wrench,
  Search,
  ClipboardList,
  Microchip,
  MemoryStick,
  HardDrive,
  Keyboard,
  Mouse,
  Monitor,
  Fan,
  Lightbulb,
  GraduationCap,
  Table,
  List,
  Copy,
  Check,
  Brain,
  Sparkles,
  RefreshCw,
  ChevronUp,
  BookOpen,
  X,
  Layers,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'process', label: 'Process' },
  { id: 'common-problems', label: 'Common Problems' },
  { id: 'ram-cmos', label: 'RAM & CMOS' },
  { id: 'os-bsod', label: 'OS & BSOD' },
  { id: 'toolkit', label: 'Toolkit' },
  { id: 'microprocessor', label: 'Microprocessor' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'freezing', label: 'Freezing Guide' },
  { id: 'boot-issues', label: 'Boot Issues' },
  { id: 'quick-fixes', label: 'Quick Fixes' },
  { id: 'diagnostics', label: 'Diagnostics' },
  { id: 'testing', label: 'Testing' },
  { id: 'deploying', label: 'Deploying' },
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
        text: 'The first computer bug was an actual moth found in a relay of the Harvard Mark II computer in 1947.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with the simplest fixes first – check cables, restart, and listen for beep codes before opening the case.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the troubleshooting order: Symptom → Theory → Test → Fix → Verify → Prevent.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the "verify" step – many technicians fix a problem but create another issue in the process.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer bug was an actual moth found in a relay of the Harvard Mark II computer in 1947.',
      },
      {
        title: 'Pro Tip',
        text: 'Always start with the simplest fixes first – check cables, restart, and listen for beep codes before opening the case.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the troubleshooting order: Symptom → Theory → Test → Fix → Verify → Prevent.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t skip the "verify" step – many technicians fix a problem but create another issue in the process.',
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

  // ─── Syntax highlighting (kept for potential future code blocks) ──────
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
      'int', 'void', 'char', 'double', 'float', 'if', 'else', 'return', 'for',
      'while', 'do', 'break', 'continue', 'switch', 'case', 'default', 'class',
      'struct', 'public', 'private', 'protected', 'namespace', 'using', 'include',
      'define', 'endl', 'cout', 'cin', 'main', 'bool', 'const', 'new', 'delete',
      'virtual', 'override', 'final', 'template', 'typename', 'auto', 'static',
      'constexpr', 'try', 'catch', 'throw', 'std', 'vector', 'cerr'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string', 'Node'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');
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

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Wrench size={14} className="inline mr-1" /> HARDWARE TROUBLESHOOTING
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              Hardware Troubleshooting
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the art of hardware troubleshooting: systematic diagnosis,
            common hardware problems, microprocessor fundamentals, and professional
            repair methodology.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Troubleshooting
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Microchip size={14} className="inline mr-1" /> Hardware
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
                placeholder="Search for a concept, tool, or problem..."
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
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                What is Hardware Troubleshooting?
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Hardware troubleshooting is the process of <span className="font-bold">playing detective</span> to figure out
                    what physical part of the computer is causing a problem, and then fixing it. The goal is simple:
                    <span className="font-bold"> find out what's wrong and fix it</span> so the computer works properly again.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  When we say "hardware," we mean the physical stuff you can touch — the motherboard, RAM, hard drive,
                  keyboard, monitor, and so on. If any of these breaks, gets loose, or stops working, that's a hardware
                  problem.
                </p>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold">Key takeaway:</span> Sometimes the fix is as simple as plugging a cable back in.
                  Sometimes you need to replace a component. Either way, you follow a clear set of steps so you don't
                  randomly start pulling things apart and making things worse.
                </p>
              </div>
            </div>

            {/* ─── Section 2: Troubleshooting Process ───────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['process'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Hardware Troubleshooting Process
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 italic mb-4">
                Think of this like a recipe. You follow the steps in order, and by the end you hopefully have a working
                computer instead of a cake.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Identify the Problem</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Understand the symptoms clearly. Is the computer not turning on? Black screen? Making noise? Freezing?
                    Write down exactly what is happening, when it happens, and whether anything changed recently.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Establish a Theory of Probable Cause</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Use your knowledge and common sense. If the computer won't turn on, maybe the power cable is loose.
                    If it's overheating, maybe there's dust blocking the fans. Start with the simplest, most common causes.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Test the Theory</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Test one thing at a time. Check cables, remove a RAM stick, try a different monitor. If you change
                    five things at once and it works, you won't know which change fixed it. Be systematic.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Plan & Implement the Solution</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once you've found the cause, figure out the fix. Replace the faulty RAM, clean the dust, update the
                    driver. If the problem is beyond your ability, don't be ashamed to call in a professional.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h4 className="text-xs font-bold text-teal-600 dark:text-teal-400">Verify & Prevent</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Test the whole system to make sure the original problem is gone AND you didn't create a new one.
                    Also think about prevention — recommend regular cleaning, suggest a surge protector, etc. Good
                    technicians prevent future problems too.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Section 3: Common Hardware Problems ──────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['common-problems'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Common Hardware Problems
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Computer Won't Turn On</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded">
                      <span className="font-bold text-orange-600 dark:text-orange-400 block text-xs">Power Supply Issues</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">The PSU converts wall power to computer power. Check cables, try different socket, inspect cable for damage.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded">
                      <span className="font-bold text-orange-600 dark:text-orange-400 block text-xs">Loose Internal Connections</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Open the case and reseat all cable connections firmly. This solves more problems than you'd think.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded">
                      <span className="font-bold text-orange-600 dark:text-orange-400 block text-xs">Faulty Motherboard, CPU, or RAM</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Major component failure. Try swapping components to isolate. May need professional help.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Computer Turns On But Doesn't Work Properly</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded">
                      <span className="font-bold text-yellow-600 dark:text-yellow-400 block text-xs">No Display (Black Screen)</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Check monitor cables, try different monitor, reseat graphics card.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded">
                      <span className="font-bold text-yellow-600 dark:text-yellow-400 block text-xs">Strange Noises or Overheating</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Clean dust from fans and vents. Ensure proper airflow around the computer.</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded">
                      <span className="font-bold text-yellow-600 dark:text-yellow-400 block text-xs">Slow Performance or Freezing</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Check RAM usage, scan for malware, run disk check, update drivers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── Section 4: RAM & CMOS ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['ram-cmos'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                RAM & CMOS Errors
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Insufficient Memory (RAM)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    RAM is your computer's short-term working memory. If you run out, the computer slows down, freezes,
                    and crashes programs.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Symptoms:</strong> Frequent freezing, slow multitasking, programs crashing</li>
                    <li><strong>Fix:</strong> Close unused programs, disable startup apps, add more RAM</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">CMOS Error</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    CMOS stores important settings like date/time and BIOS configurations on the motherboard. It's
                    powered by a small battery (CR2032).
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Symptoms:</strong> Freezing during bootup, incorrect date/time resetting</li>
                    <li><strong>Fix:</strong> Reset CMOS using motherboard jumper or replace the battery</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 5: Missing OS & BSOD ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['os-bsod'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Missing OS & Blue Screen of Death
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Missing Operating System</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    The computer can't find the OS, usually because the hard drive isn't detected or the boot order is wrong.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Fixes:</strong> Check boot order in BIOS, reseat HDD cables, test drive</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Blue Screen of Death (BSOD)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Windows crashes with a blue screen when it encounters a critical error it can't recover from.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Fixes:</strong> Update drivers, run SFC /scannow, check hardware</li>
                    <li><strong>Tip:</strong> The error code displayed on screen helps diagnose the cause</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 6: IT Technician's Toolkit ────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['toolkit'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The IT Technician's Toolkit
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  "Anti-Static Wrist Strap: Prevents static electricity from damaging sensitive components.",
                  "Precision Screwdriver Set: Covers Phillips, flathead, Torx, and other screw types.",
                  "Flashlight: Helps see clearly inside dark computer cases.",
                  "Digital Multimeter: Tests power supply voltage and electrical continuity.",
                  "Compressed Air Duster: Safely blows dust out of fans, vents, and heatsinks.",
                  "Cable Tester: Quickly checks if Ethernet and other cables are working.",
                  "USB Flash Drive: Bootable drives loaded with diagnostic tools or OS installers.",
                  "Laptop Caddy: Keeps tools organized and protected when traveling.",
                  "Zip Ties and Velcro: Cable management keeps wires neat and out of fans.",
                  "Notebook and Pen: Document what you did — useful for future reference."
                ].map((tool, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Section 7: Microprocessor ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['microprocessor'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Understanding the Microprocessor
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">What is a Microprocessor?</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  The microprocessor (CPU) is the brain of the computer. It takes instructions from programs, processes
                  them, and makes things happen. Think of it like the conductor of an orchestra — coordinating all the
                  musicians (components) to create music (output) together.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Registers</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tiny storage spaces inside the CPU holding data being actively processed. Think of them as the conductor's music stand.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Accumulator:</strong> Temporarily stores calculation results</li>
                    <li><strong>Program Counter:</strong> Tracks which instruction is next</li>
                    <li><strong>Instruction Register:</strong> Holds current instruction</li>
                    <li><strong>Data Registers:</strong> Hold values used in calculations</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Buses</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sets of wires that carry data and addresses between components.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Data Bus:</strong> Carries actual data</li>
                    <li><strong>Address Bus:</strong> Carries memory addresses</li>
                    <li><strong>Control Bus:</strong> Carries control signals</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">ALU</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The Arithmetic Logic Unit does calculations and comparisons — the muscle of the microprocessor.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Control Unit</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manages operations by sending read/write signals and I/O control signals to other components.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Memory Referencing</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  When the CPU needs data, it specifies the memory address. Two registers are involved:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <li><strong>MAR (Memory Address Register):</strong> Holds the address (location) of data</li>
                  <li><strong>MDR (Memory Data Register):</strong> Holds the actual data being transferred</li>
                </ul>
                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-800/30 rounded">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <strong>Types of data movement:</strong> Load (memory → register), Store (register → memory),
                    Register-to-Register (between registers)
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Section 8: Manufacturer Comparison ────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['comparison'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Comparing Microprocessor Manufacturers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Intel</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Founded 1968. x86 architecture standard. Core i3/i5/i7/i9 for consumers, Xeon for servers. Market leader.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">AMD</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Founded 1969. Ryzen series competitive with Intel. Great price-to-performance ratio.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Motorola</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Founded 1955. 68000 series powered early Macs. Now focused on embedded systems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Cyrix</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Founded 1988. Made x86-compatible processors. Acquired by VIA Technologies in 1997.</p>
                </div>
              </div>
            </div>

            {/* ─── Section 9: Freezing Computer Guide ────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['freezing'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Resolving a Freezing or Slow Computer
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Start with the basics:</strong> Restart the computer (clears temporary data). Close unused programs. Check Task Manager for resource hogs.</li>
                  <li><strong>Scan for malware:</strong> Run an antivirus scan — viruses often run invisibly in the background.</li>
                  <li><strong>Clean up the disk:</strong> Use Disk Cleanup to remove temporary files and free up space.</li>
                  <li><strong>Defragment (HDD only):</strong> On traditional hard drives, defragmentation improves speed. <span className="italic">Do NOT defragment SSDs.</span></li>
                  <li><strong>Update everything:</strong> Keep Windows and drivers updated, especially graphics card drivers.</li>
                  <li><strong>Check hardware:</strong> Monitor RAM usage, check hard drive health, clean dust for overheating.</li>
                  <li><strong>Seek professional help</strong> if none of the above resolves the issue.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 10: Boot Issues ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['boot-issues'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Computer Failing to Boot
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Check power and display first:</strong> Is it plugged in? Is the monitor cable connected? Try a different monitor.</li>
                  <li><strong>Listen for beep codes:</strong> POST (Power-On Self-Test) communicates errors through beep patterns. Consult the motherboard manual.</li>
                  <li><strong>Check boot order in BIOS:</strong> Make sure the hard drive is set as the first boot device.</li>
                  <li><strong>Reseat all cables:</strong> Open the case and firmly reconnect all data and power cables.</li>
                  <li><strong>Boot from USB:</strong> Try booting from a bootable USB drive to test if the internal drive is the problem.</li>
                  <li><strong>Reset CMOS:</strong> If BIOS settings are causing boot failure, reset to defaults using the motherboard jumper.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 11: Quick Fixes ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['quick-fixes'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Noisy Hard Drive & Quick Fixes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">Noisy Hard Drive</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Grinding, clicking, or constant whirring often means the drive is physically failing.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Immediate action:</strong> Back up all important data right now</li>
                    <li><strong>Software:</strong> Run disk check, defragment (HDD only)</li>
                    <li><strong>Clean:</strong> Check for dust causing overheating</li>
                    <li><strong>Final step:</strong> Replace the failing drive</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-lime-600 dark:text-lime-400">Keyboard Keys Not Working</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Physical:</strong> Blow out debris, check USB connection, try different port</li>
                    <li><strong>Software:</strong> Update/reinstall driver, restart computer</li>
                    <li><strong>Final:</strong> Replace keyboard if faulty</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400">Video Card (Graphics) Faults</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Drivers:</strong> Update graphics drivers first</li>
                    <li><strong>Software:</strong> Check for program conflicts</li>
                    <li><strong>Hardware:</strong> Check for overheating, clean dust, replace thermal paste</li>
                    <li><strong>Final:</strong> Replace if failing</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-fuchsia-600 dark:text-fuchsia-400">Mouse, Touchpad & USB Ports</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li><strong>Mouse:</strong> Check connection, batteries, receiver, driver</li>
                    <li><strong>Touchpad:</strong> Check enable/disable toggle, clean surface, update driver</li>
                    <li><strong>USB:</strong> Try different port, clean debris, update drivers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 12: Diagnostics ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['diagnostics'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Fan, Memory & Screen Diagnostics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400">Fan Problems</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Clean dust first</li>
                    <li>Check fan power connection</li>
                    <li>Check BIOS fan speed settings</li>
                    <li>Replace physically damaged fan</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Memory (RAM) Problems</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Run Windows Memory Diagnostic</li>
                    <li>Test each stick individually</li>
                    <li>Reseat RAM firmly</li>
                    <li>Test with known-working RAM</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400">Screen/Monitor Problems</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Check and reconnect cables</li>
                    <li>Try different cable</li>
                    <li>Check monitor menu settings</li>
                    <li>Update graphics drivers</li>
                    <li>Test with different monitor</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 13: Testing ────────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['testing'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Testing and Verifying Repaired Hardware
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Develop test criteria:</strong> Define what "working correctly" means for this hardware.</li>
                  <li><strong>Visual inspection:</strong> Check seating, cables, and physical condition.</li>
                  <li><strong>Run diagnostics:</strong> Use manufacturer or OS built-in diagnostic tools.</li>
                  <li><strong>Benchmark testing:</strong> Run performance tests and compare with expected scores.</li>
                  <li><strong>Stress testing:</strong> Push hardware hard to reveal instability, overheating, or errors.</li>
                  <li><strong>Document everything:</strong> Record tests, results, and pass/fail status for future reference.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 14: Deploying ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['deploying'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deploying, Condemning & Disposing of Hardware
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Deploying Repaired Hardware</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Clean and reassemble</li>
                    <li>Reinstall software</li>
                    <li>Restore data from backup</li>
                    <li>Final test in actual environment</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Condemning Unrepairable Hardware</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Document the problem and attempts</li>
                    <li>Destroy sensitive data</li>
                    <li>Justify why it's beyond repair</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-yellow-600 dark:text-yellow-400">Responsible Disposal</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400 mt-2">
                    <li>Follow organizational policy</li>
                    <li>Use certified e-waste recycling</li>
                    <li>Maintain disposal documentation</li>
                    <li>Handle hazardous materials properly</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ─── Section 15: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Troubleshooting Process</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>1. Identify the problem (symptoms)</li>
                    <li>2. Establish a theory (educated guess)</li>
                    <li>3. Test the theory (one thing at a time)</li>
                    <li>4. Plan & implement solution</li>
                    <li>5. Verify functionality & prevent recurrence</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Common Problems & Fixes</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>No power:</strong> Check cables, PSU, internal connections</li>
                    <li><strong>No display:</strong> Monitor/cable, graphics card reseat</li>
                    <li><strong>Slow/freezing:</strong> RAM, malware, disk cleanup, defrag (HDD)</li>
                    <li><strong>BSOD:</strong> Driver update, SFC scan, hardware check</li>
                    <li><strong>Missing OS:</strong> Boot order, reseat HDD cables</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Microprocessor Basics</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>CPU:</strong> Brain of computer</li>
                    <li><strong>Registers:</strong> Storage inside CPU</li>
                    <li><strong>ALU:</strong> Does calculations</li>
                    <li><strong>Control Unit:</strong> Manages operations</li>
                    <li><strong>Buses:</strong> Data, Address, Control</li>
                    <li><strong>MAR/MDR:</strong> Memory referencing</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Explain the steps of hardware troubleshooting" or "What would you do if a computer displays a BSOD?"
                      are common questions. Don't just memorise steps — understand the reasoning behind each step. Explain
                      in your own words and use real-life analogies where possible.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Diagnose it. Fix it. Verify it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Troubleshooting Insight
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
                  <span>Troubleshooting Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Toolkit Items</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                You do NOT need to memorise every detail word for word. What examiners want to see is that you actually
                <span className="font-bold"> understand</span> what's being talked about. Explain things in your own
                words — even if it's "C-level English," that's completely fine! If you understood it, you can explain it.
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
                <strong className="text-white">Hardware troubleshooting</strong> is a systematic process of
                identifying, diagnosing, and fixing physical computer problems.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The 5-step process</strong> – Identify, Theory, Test, Fix, Verify
                – ensures thorough and methodical repairs.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Common problems</strong> include no power, no display, freezing,
                BSOD, and missing OS – each with specific diagnostic approaches.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">The microprocessor (CPU)</strong> is the computer's brain,
                with registers, ALU, control unit, and buses working together.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from understanding the reasoning
                behind steps, not just memorising them. Explain concepts in your own words.
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
            Sidemann Academic Registry • Hardware Troubleshooting 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;