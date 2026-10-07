import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import { MissingOsScreen, BsodScreen } from './HardwareScreens';
import { ToolkitCards } from './ToolkitCards';
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
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
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
        <span className="text-right w-8 select-none text-gray-400 dark:text-gray-500 text-sm pr-3 mr-3 border-r border-gray-200 dark:border-gray-700 shrink-0">
          {idx + 1}
        </span>
        <pre
          className="m-0 flex-1 overflow-x-auto text-sm md:text-base font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: line || ' ' }}
        />
      </div>
    ));
  };

  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
        <span className="text-base font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-sm transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
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
      <table className="w-full border-collapse text-base">
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
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
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
          <div className="mt-4 flex flex-wrap items-center gap-3 text-base text-indigo-100">
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
        <div className="grid grid-cols-1 gap-8">
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

              <div className="space-y-2 p-4 sm:p-5 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="font-bold">Hardware troubleshooting</span> is finding and fixing problems with the physical parts of a computer.
                </p>
                <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  It involves checking components like RAM, cables, the keyboard, and monitor.
                </p>
                <p className="text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  The goal is to identify the problem and fix it so the computer works properly.
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

              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Think of troubleshooting like <strong>following a recipe</strong>. You follow the steps to find and fix the problem.
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Identify the Problem</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Find out what is wrong.
                  <br />
                  For example: <strong>Is the computer not turning on, showing a black screen, or freezing?</strong>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Find the Possible Cause</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Think about what could be causing the problem.
                  <br />
                  For example: <strong>A loose power cable or too much dust.</strong>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Test the Cause</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Check if your idea is correct.
                  <br />
                  For example: <strong>Check the cables or test the RAM.</strong>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Fix the Problem</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Once you find the cause, fix it.
                  <br />
                  For example: <strong>Connect the cable, clean the computer, or replace the faulty part.</strong>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Check and Prevent</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Test the computer again to make sure it works.
                  <br />
                  Then take steps to <strong>prevent the problem from happening again</strong>.
                </p>
              </div>
            </div>

            {/* ─── Section 3: Common Hardware Problems ──────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['common-problems'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Common Computer Hardware Problems
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Computer Won't Turn On</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Power Supply Problems</span>
                      <p className="pl-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">The computer needs electricity to work. Check that the power cable is connected properly and that the wall socket is working. If the cable is damaged or the power supply is faulty, the computer may not turn on.</p>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Loose Internal Connections</span>
                      <p className="pl-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Inside the computer, different parts are connected using cables. A loose cable can stop the computer from working. Turn off the computer and check that the cables are firmly connected.</p>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Faulty Motherboard, CPU, or RAM</span>
                      <p className="pl-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Sometimes an important computer part may be damaged. A faulty RAM, CPU, or motherboard can prevent the computer from starting. These problems may require testing the parts or getting help from a technician.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Computer Turns On but Doesn't Work Properly</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">No Display (Black Screen)</span>
                      <p className="pl-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">The computer may turn on but show nothing on the monitor. Check that the monitor is switched on and that its cable is connected correctly. You can also try another monitor or check the graphics card.</p>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Strange Noises or Overheating</span>
                      <p className="pl-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">A computer may make unusual noises when a fan is damaged or when something is loose. Dust can also block the fans and cause the computer to become too hot. Clean the dust and make sure there is enough space around the computer for air to flow.</p>
                    </div>
                    <div>
                      <span className="block text-base font-bold text-slate-900 dark:text-white before:mr-2 before:content-['•']">Slow Performance or Freezing</span>
                      <p className="pl-4 text-base text-slate-700 dark:text-slate-300 leading-relaxed">A computer may become slow or freeze when there is not enough RAM, when the storage is almost full, or when there is a virus. Check the computer&apos;s memory and storage, scan for viruses, and make sure the drivers are updated.</p>
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
                RAM &amp; CMOS Errors
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Insufficient Memory (RAM)</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>RAM</strong> is the computer&apos;s temporary memory. It helps the computer run programs and perform different tasks at the same time. When there is not enough RAM, the computer may become slow or stop responding.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    <li><strong>Symptoms:</strong> The computer becomes slow, freezes often, or programs close unexpectedly.</li>
                    <li><strong>Cause:</strong> Too many programs may be running at the same time, or the computer may not have enough RAM.</li>
                    <li><strong>Fix:</strong> Close programs you are not using, disable unnecessary programs that start with the computer, or add more RAM.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">CMOS Error</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>CMOS</strong> stores important computer settings, such as the date, time, and BIOS settings. It uses a small battery on the motherboard, usually called a <strong>CR2032 battery</strong>.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    <li><strong>Symptoms:</strong> The computer may show a CMOS error when starting, the date and time may keep changing, or the computer may have problems starting.</li>
                    <li><strong>Cause:</strong> The CMOS battery may be weak or dead, or the CMOS settings may have become incorrect.</li>
                    <li><strong>Fix:</strong> Reset the CMOS settings or replace the CMOS battery with a new one.</li>
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
                Missing Operating System &amp; Blue Screen of Death
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Missing Operating System</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                    An <strong>Operating System (OS)</strong>, such as Windows, is the main software that allows the computer to work. When the computer cannot find the operating system, it cannot start normally.
                  </p>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                    This can happen when the <strong>hard drive or SSD is not detected</strong>, the drive has a problem, or the computer is trying to start from the wrong device.
                  </p>
                  <MissingOsScreen />
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    <li><strong>Symptoms:</strong> The computer may display a message such as <strong>&quot;Operating System Not Found&quot;</strong> or <strong>&quot;Missing Operating System.&quot;</strong></li>
                    <li><strong>Cause:</strong> The hard drive may be disconnected or faulty, or the boot order in the BIOS may be incorrect.</li>
                    <li><strong>Fix:</strong> Check the boot order in the BIOS, make sure the hard drive cables are connected properly, and test the drive for problems.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Blue Screen of Death (BSOD)</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                    The <strong>Blue Screen of Death (BSOD)</strong> happens when Windows encounters a serious problem that it cannot recover from. Windows stops working to prevent further problems and displays a blue screen.
                  </p>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                    The problem can be caused by <strong>faulty hardware, damaged system files, or incorrect drivers</strong>.
                  </p>
                  <BsodScreen />
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-2">
                    <li><strong>Symptoms:</strong> The computer suddenly stops working and shows a blue screen with an error message or code. It may then restart automatically.</li>
                    <li><strong>Cause:</strong> Faulty hardware, damaged Windows files, or problematic device drivers.</li>
                    <li><strong>Fix:</strong> Update drivers, check the computer hardware, and use tools such as <code>SFC /scannow</code> to check and repair damaged Windows system files.</li>
                    <li><strong>Tip:</strong> Write down the <strong>error code</strong> shown on the blue screen. It can help identify what caused the problem.</li>
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

              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                These are common tools used by IT technicians to <strong>check, repair, clean, and maintain computers</strong>.
              </p>

              <ToolkitCards />
            </div>

            {/* ─── Section 7: Microprocessor ──────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['microprocessor'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Understanding the Microprocessor
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">What is a Microprocessor?</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">The <strong>microprocessor (CPU)</strong> is the brain of the computer. It <strong>processes instructions and controls what the computer does</strong>.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/cpu.webp"
                    alt="What is a Microprocessor? illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Registers</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2"><strong>Registers</strong> are small storage areas inside the CPU. They temporarily hold data and instructions while the CPU is working.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Accumulator:</strong> Stores calculation results.</li>
                    <li><strong>Program Counter (PC):</strong> Keeps track of the next instruction.</li>
                    <li><strong>Instruction Register (IR):</strong> Holds the instruction currently being used.</li>
                    <li><strong>Data Registers:</strong> Hold data being processed.</li>
                  </ul>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/registers.webp"
                    alt="Registers illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Buses</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2"><strong>Buses</strong> are pathways that carry information between the CPU, memory, and other components.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Data Bus:</strong> Carries data.</li>
                    <li><strong>Address Bus:</strong> Carries the location of data in memory.</li>
                    <li><strong>Control Bus:</strong> Carries control signals.</li>
                  </ul>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/buses.webp"
                    alt="Buses illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">ALU</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">The <strong>Arithmetic Logic Unit (ALU)</strong> performs <strong>calculations and comparisons</strong>.</p>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">For example, it can add numbers or compare two values.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/alu.webp"
                    alt="ALU illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Control Unit</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">The <strong>Control Unit (CU)</strong> controls the activities of the CPU. It tells other parts of the computer <strong>what to do and when to do it</strong>.</p>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/control-unit.webp"
                    alt="Control Unit illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Memory Referencing</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">When the CPU needs information from memory, it uses a <strong>memory address</strong> to find it.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>MAR:</strong> Holds the address where the data is located.</li>
                    <li><strong>MDR:</strong> Holds the actual data being transferred.</li>
                  </ul>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/memory-referencing.webp"
                    alt="Memory Referencing illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
                </div>
                <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Types of Data Movement</h3>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Load:</strong> Data moves from <strong>memory → register</strong>.</li>
                    <li><strong>Store:</strong> Data moves from <strong>register → memory</strong>.</li>
                    <li><strong>Register-to-Register:</strong> Data moves from <strong>one register → another register</strong>.</li>
                  </ul>
                  <img
                    src="/images/courses/nd-it/hardware-administration/learning-outcome-1/data-movement.webp"
                    alt="Types of Data Movement illustration"
                    width={384}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto mt-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
                  />
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

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full min-w-[640px] border-collapse text-base text-slate-800 dark:text-slate-200">
                  <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
                    <tr>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-bold">Point</th>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-bold">Intel</th>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-bold">AMD</th>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-bold">Motorola</th>
                      <th className="border border-slate-200 dark:border-slate-700 p-3 text-left font-bold">Cyrix</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 p-3 font-bold">1. Founded</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">1968</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">1969</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">1955</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">1988</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 p-3 font-bold">2. Main processors</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Core i3, i5, i7, i9, Xeon</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Ryzen, EPYC</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">68000 series</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">6x86, MediaGX</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 p-3 font-bold">3. Main use</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">PCs and servers</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">PCs and servers</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Early Macs and embedded systems</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Low-cost PCs</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 p-3 font-bold">4. Main strength</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">High performance and reliability</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Good price-to-performance</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Early processor technology</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Affordable processors</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 dark:border-slate-700 p-3 font-bold">5. Company status</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Major CPU manufacturer</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Major CPU manufacturer</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Mainly embedded technology</td>
                      <td className="border border-slate-200 dark:border-slate-700 p-3">Acquired by VIA Technologies</td>
                    </tr>
                  </tbody>
                </table>
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

              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                When a computer becomes <strong>slow or freezes</strong>, follow these steps to find and fix the problem.
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Restart the Computer</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Restarting can clear temporary problems and free up memory. Also close programs that you are not using.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Check Task Manager</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Open <strong>Task Manager</strong> to see which programs are using a lot of <strong>RAM or CPU</strong>. Close programs that are not needed.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Scan for Viruses</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Run an <strong>antivirus scan</strong>. Viruses and other malware can run in the background and make the computer slow.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Clean Up the Disk</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Remove <strong>temporary and unnecessary files</strong> to free up storage space. A full hard drive can make the computer slower.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Defragment the Hard Drive</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">For a traditional <strong>HDD</strong>, defragmenting can improve performance. <strong>Do not defragment an SSD</strong>, because it does not need it.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">6. Update the Computer</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Keep <strong>Windows and device drivers</strong> updated. Updates can fix problems and improve performance.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">7. Check the Hardware</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Check the amount of <strong>RAM</strong>, the health of the hard drive, and the computer&apos;s temperature. Clean dust from fans if the computer is overheating.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">8. Get Professional Help</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">If the computer is still slow or freezing after trying these steps, <strong>ask a qualified technician</strong> to check it.</p>
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

              <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                When a computer <strong>fails to boot</strong>, it may not start Windows or may not start at all. Follow these steps to find the problem.
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Check Power and Display</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Make sure the computer is <strong>plugged in and receiving power</strong>. Check that the monitor is switched on and its cable is connected correctly. You can also try another monitor.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Listen for Beep Codes</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">When a computer starts, it performs a <strong>POST (Power-On Self-Test)</strong>. Beeps may indicate a hardware problem. The meaning of the beeps depends on the motherboard.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Check the Boot Order</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Enter the <strong>BIOS</strong> and check the boot order. Make sure the hard drive or SSD containing the operating system is selected as the correct boot device.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Check the Cables</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Turn off the computer and check the cables inside. Make sure the <strong>power and data cables</strong> connected to the hard drive, motherboard, and other components are firmly connected.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Try a Bootable USB</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">Use a <strong>bootable USB drive</strong> to see if the computer can start from another device. If it works, the internal hard drive or operating system may have a problem.</p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">6. Reset the CMOS</h3>
                <p className="pl-5 text-base text-slate-700 dark:text-slate-300 leading-relaxed">If incorrect BIOS settings are stopping the computer from starting, <strong>reset the CMOS</strong>. This returns the BIOS settings to their default values.</p>
              </div>
            </div>

            {/* ─── Section 11: Quick Fixes ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['quick-fixes'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Common Hardware Problems &amp; Quick Fixes
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Noisy Hard Drive</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">A hard drive that makes <strong>clicking, grinding, or unusual sounds</strong> may be failing.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Back up data:</strong> Save important files immediately.</li>
                    <li><strong>Check the disk:</strong> Run a disk check to look for errors.</li>
                    <li><strong>Check for dust:</strong> Dust can cause overheating.</li>
                    <li><strong>Replace the drive:</strong> If the drive is failing, replace it with a new one.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Keyboard Keys Not Working</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">Some keys may stop working because of <strong>dirt, connection problems, or software issues</strong>.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Clean it:</strong> Remove dust and dirt from the keyboard.</li>
                    <li><strong>Check connection:</strong> Make sure the USB cable is connected properly.</li>
                    <li><strong>Update driver:</strong> Update or reinstall the keyboard driver.</li>
                    <li><strong>Replace it:</strong> Replace the keyboard if it is damaged.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Video Card (Graphics) Problems</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">A faulty graphics card can cause <strong>display problems, crashes, or poor graphics</strong>.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Update drivers:</strong> Install the latest graphics driver.</li>
                    <li><strong>Check for overheating:</strong> Clean dust from the graphics card and fans.</li>
                    <li><strong>Check software:</strong> Some programs may cause graphics problems.</li>
                    <li><strong>Replace it:</strong> Replace the graphics card if it is faulty.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Mouse, Touchpad &amp; USB Ports</h3>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-2">These devices may stop working because of <strong>connection, driver, or dirt problems</strong>.</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    <li><strong>Mouse:</strong> Check the cable, batteries, receiver, and driver.</li>
                    <li><strong>Touchpad:</strong> Make sure it is enabled and clean the surface.</li>
                    <li><strong>USB ports:</strong> Try another USB port and remove any dirt or dust.</li>
                    <li><strong>Update drivers:</strong> Install the correct drivers if the devices are not detected.</li>
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

              <div className="space-y-4">
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Fan Problems</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li>Clean dust first</li>
                    <li>Check fan power connection</li>
                    <li>Check BIOS fan speed settings</li>
                    <li>Replace physically damaged fan</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Memory (RAM) Problems</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li>Run Windows Memory Diagnostic</li>
                    <li>Test each stick individually</li>
                    <li>Reseat RAM firmly</li>
                    <li>Test with known-working RAM</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Screen/Monitor Problems</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
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

              <div className="py-2">
                <ul className="list-disc pl-5 space-y-2 text-base text-slate-600 dark:text-slate-400">
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

              <div className="space-y-4">
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Deploying Repaired Hardware</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li>Clean and reassemble</li>
                    <li>Reinstall software</li>
                    <li>Restore data from backup</li>
                    <li>Final test in actual environment</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Condemning Unrepairable Hardware</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
                    <li>Document the problem and attempts</li>
                    <li>Destroy sensitive data</li>
                    <li>Justify why it's beyond repair</li>
                  </ul>
                </div>
                <div className="py-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Responsible Disposal</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400 mt-2">
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
                <div className="py-2">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">📌 Troubleshooting Process</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400">
                    <li>1. Identify the problem (symptoms)</li>
                    <li>2. Establish a theory (educated guess)</li>
                    <li>3. Test the theory (one thing at a time)</li>
                    <li>4. Plan & implement solution</li>
                    <li>5. Verify functionality & prevent recurrence</li>
                  </ul>
                </div>
                <div className="py-2">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">📌 Common Problems & Fixes</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400">
                    <li><strong>No power:</strong> Check cables, PSU, internal connections</li>
                    <li><strong>No display:</strong> Monitor/cable, graphics card reseat</li>
                    <li><strong>Slow/freezing:</strong> RAM, malware, disk cleanup, defrag (HDD)</li>
                    <li><strong>BSOD:</strong> Driver update, SFC scan, hardware check</li>
                    <li><strong>Missing OS:</strong> Boot order, reseat HDD cables</li>
                  </ul>
                </div>
                <div className="py-2">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">📌 Microprocessor Basics</p>
                  <ul className="list-disc pl-5 space-y-1 text-base text-slate-600 dark:text-slate-400">
                    <li><strong>CPU:</strong> Brain of computer</li>
                    <li><strong>Registers:</strong> Storage inside CPU</li>
                    <li><strong>ALU:</strong> Does calculations</li>
                    <li><strong>Control Unit:</strong> Manages operations</li>
                    <li><strong>Buses:</strong> Data, Address, Control</li>
                    <li><strong>MAR/MDR:</strong> Memory referencing</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-base font-bold text-slate-800 dark:text-slate-300">Exam Tip</p>
                    <p className="text-base text-slate-700 dark:text-slate-300">
                      "Explain the steps of hardware troubleshooting" or "What would you do if a computer displays a BSOD?"
                      are common questions. Don't just memorise steps — understand the reasoning behind each step. Explain
                      in your own words and use real-life analogies where possible.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-slate-800 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Diagnose it. Fix it. Verify it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
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
        <div className="mt-8 p-6 bg-slate-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-base">
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