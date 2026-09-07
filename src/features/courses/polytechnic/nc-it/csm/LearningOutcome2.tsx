import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Download,
  Maximize2,
  X,
  Terminal,
  Cpu,
  Layers,
  HardDrive,
  CheckCircle,
  Info,
  Zap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Database,
  BookOpen,
  FileText,
  Monitor,
  Search,
  FolderOpen,
  FileCheck,
  Repeat,
  Route,
  Workflow,
  Binary,
  Hash,
  Utensils,
  PlayCircle,
  ExternalLink,
  Rocket,
  RefreshCw,
  MousePointer,
  HelpCircle,
  Navigation,
  List,
  Trash2,
  AlertCircle,
  ChevronUp,
  Trophy,
  Target,
  GraduationCap,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE TYPEWRITER TERMINAL COMPONENT (unchanged)
// ──────────────────────────────────────────────────────────────────────────────
const TypewriterTerminal: React.FC<{ commands: { cmd: string; result: string[] }[] }> = ({
  commands,
}) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let timeout: any;
    const currentFullCmd = commands[index].cmd;

    if (isTyping) {
      if (displayText.length < currentFullCmd.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullCmd.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
          setShowResult(true);
        }, 500);
      }
    } else {
      timeout = setTimeout(() => {
        setShowResult(false);
        setDisplayText('');
        setIsTyping(true);
        setIndex((prev) => (prev + 1) % commands.length);
      }, 4000);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, index, commands]);

  return (
    <div className="bg-[#0c0c0c] border-2 border-gray-800 rounded-xl shadow-2xl overflow-hidden font-mono text-sm w-full my-6">
      <div className="bg-[#1a1a1a] px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff7400]/100/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
          Command Prompt - Session 2.1
        </span>
      </div>
      <div className="p-4 md:p-6 min-h-[220px]">
        <div className="flex items-center gap-2 text-green-500 mb-2">
          <span>C:\Users\PowerUser&gt;</span>
          <span className="text-white">{displayText}</span>
          <span className="w-2 h-4 bg-white animate-pulse"></span>
        </div>
        {showResult && (
          <div className="animate-dropdown-reveal space-y-1">
            {commands[index].result.map((line, i) => (
              <div key={i} className="text-gray-400 text-xs md:text-sm">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// VIDEO EMBED COMPONENT (unchanged)
// ──────────────────────────────────────────────────────────────────────────────
const VideoEmbed: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const embedUrl = url
    .replace('/view?usp=drive_link', '/preview')
    .replace('/view?usp=sharing', '/preview');
  return (
    <div className="my-6 group">
      <div className="flex items-center gap-2 mb-2">
        <PlayCircle className="text-orange-500" size={18} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>
      <div className="relative aspect-video w-full bg-black border border-gray-200 dark:border-slate-700 rounded-xl shadow-md overflow-hidden">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full border-none"
          allow="autoplay"
          title={title}
        ></iframe>
      </div>
    </div>
  );
};

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

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const terminalExamples = [
    { cmd: 'wmic csproduct get name', result: ['Name', 'HP 250 G7 Notebook PC'] },
    { cmd: 'cd Pictures', result: ['C:\\Users\\PowerUser\\Pictures>'] },
    {
      cmd: 'dir',
      result: [
        'Directory of C:\\Users\\PowerUser',
        '12/05/2025  10:00 AM    <DIR>          Documents',
        '12/05/2025  11:45 AM    <DIR>          Downloads',
        '12/05/2025  02:15 PM            15,420 notes.txt',
      ],
    },
    { cmd: 'cls', result: ['[Screen Cleared]'] },
  ];

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
        text: 'The Command Prompt has been part of Windows since 1985! It was originally called "MS-DOS Prompt" and was the main way people used computers before Windows had a graphical interface.',
      },
      {
        title: 'Pro Tip',
        text: 'You can use the "Tab" key in Command Prompt to auto‑complete file and folder names. Type the first few letters and press Tab to cycle through matches.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the Data Processing Cycle: "Input → Process → Output → Store" – think of it as "I POSS" (Input, Process, Output, Store, Store).',
      },
      {
        title: 'Common Mistake',
        text: 'Many students confuse "del" and "erase" – they do the same thing! Both permanently delete files from the command line with no Recycle Bin.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The Command Prompt has been part of Windows since 1985! It was originally called "MS-DOS Prompt" and was the main way people used computers before Windows had a graphical interface.',
      },
      {
        title: 'Pro Tip',
        text: 'You can use the "Tab" key in Command Prompt to auto‑complete file and folder names. Type the first few letters and press Tab to cycle through matches.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the Data Processing Cycle: "Input → Process → Output → Store" – think of it as "I POSS" (Input, Process, Output, Store, Store).',
      },
      {
        title: 'Common Mistake',
        text: 'Many students confuse "del" and "erase" – they do the same thing! Both permanently delete files from the command line with no Recycle Bin.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Section tabs
  const SECTION_TABS = [
    { id: 'model', label: 'System Model' },
    { id: 'cmd', label: 'CMD Codes' },
    { id: 'cycle', label: 'Data Cycle' },
    { id: 'interconnect', label: 'Interconnect' },
    { id: 'datarep', label: 'Data Rep' },
    { id: 'conversions', label: 'Conversions' },
  ];

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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> COMPUTER SYSTEMS MAINTENANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Power User Protocols
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Learn to identify your system model, master essential Command Prompt
            codes, understand the data processing cycle, and conquer number
            systems from binary to hexadecimal.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 6 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⌨️ Interactive terminal
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Terminal size={14} className="inline mr-1" /> Pro tips
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
                placeholder="Search for a command, concept, or conversion..."
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
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Introduction */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  Welcome to Learning Outcome 2! Now that you know what a
                  computer is, it is time to learn how to talk to it and
                  understand its secret language.
                </p>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Imagine you have a new friend—to help them, you first need to
                know their name (System Model). To give them orders, you need to
                know their language (Command Prompt). And to understand how they
                think, you need to learn their math (Binary).
              </p>
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-xs md:text-sm border-t border-slate-200 dark:border-slate-700 pt-4">
                <Rocket size={18} />
                <span>
                  By the end of this lesson, you will move from being a basic
                  user to a "Power User" who knows exactly what is happening
                  under the hood!
                </span>
              </div>
            </div>

            {/* 1. Determining Your Computer System Model */}
            <div
              ref={(el) => {
                sectionRefs.current['model'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Determining Your Computer System Model
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Every computer has a specific "Identity" or Model Name. You need
                this to buy a new battery, fix a screen, or download special
                drivers that make your sound or video work.
              </p>

              <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Definition
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  "The System Model is the specific name or number given to a
                  computer by its manufacturer (like HP, Dell, or Lenovo)."
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-lg mb-3">
                    <Monitor size={20} />
                  </div>
                  <h4 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest underline underline-offset-4">
                    Method A: System Information
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 font-medium mt-2">
                    <li>Press Windows Key + S</li>
                    <li>Type "System Information"</li>
                    <li>Look for "System Model"</li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center rounded-lg mb-3">
                    <Terminal size={20} />
                  </div>
                  <h4 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest underline underline-offset-4">
                    Method B: Command Prompt
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 font-medium mt-2">
                    <li>Open CMD</li>
                    <li>
                      Type:{' '}
                      <code className="bg-black text-green-400 px-1 text-[9px]">
                        wmic csproduct get name
                      </code>
                    </li>
                  </ul>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center rounded-lg mb-3">
                    <Zap size={20} />
                  </div>
                  <h4 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest underline underline-offset-4">
                    Method C: PowerShell
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4 font-medium mt-2">
                    <li>Open PowerShell</li>
                    <li>
                      Type:{' '}
                      <code className="bg-black text-blue-400 px-1 text-[9px]">
                        Get-WmiObject Win32_ComputerSystemProduct | Select-Object
                        Name
                      </code>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-5 bg-slate-900 text-white rounded-xl shadow-lg">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  Practical Example
                </h4>
                <p className="text-sm font-medium italic opacity-90 leading-relaxed mt-1">
                  "If you go to a shop to buy a charger, you don't just say 'I
                  have an HP.' You say, 'I have an HP 250 G7.' That specific name
                  is the System Model."
                </p>
              </div>

              <VideoEmbed
                url="https://drive.google.com/file/d/10nkoRMdWUslDoQ72fCmw9Ya8bBPZrS5v/view?usp=drive_link"
                title="Video Guide: Methods A & B"
              />
              <VideoEmbed
                url="https://drive.google.com/file/d/18WrsLBoKWSPyFzseKpRIPQx6UBrbNuGV/view?usp=drive_link"
                title="Video Guide 2: PowerShell Method"
              />
            </div>

            {/* 2. Essential Command Prompt (CMD) Codes */}
            <div
              ref={(el) => {
                sectionRefs.current['cmd'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Essential Command Prompt (CMD) Codes
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Before we had mice and colorful icons, people talked to
                computers by typing text. This is the Command Prompt – a secret
                "back door" into the computer’s brain.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    Technical Definition
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-1">
                    "The Command Prompt is a command-line interpreter that allows
                    you to give direct text instructions to the Operating
                    System."
                  </p>
                </div>
                <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-widest flex items-center gap-2">
                    <Utensils size={14} /> Explanation
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                    Think of the Command Prompt as a waiter in a restaurant.
                    Instead of pointing at a picture of food, you write down
                    exactly what you want on a piece of paper and hand it over.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-6 bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-xl shadow-xl">
                <p className="text-sm md:text-base font-bold leading-relaxed italic opacity-90">
                  "While most people use a mouse to click on icons, CMD lets you
                  talk directly to your computer using text. It's faster, more
                  powerful, and—honestly—makes you look like a pro."
                </p>
                <div className="mt-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-300"> Power User Secret
                </div>
              </div>

              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center mt-8">
                Here is a breakdown of those essential commands, made simple.
              </p>

              {/* Navigation Commands */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Navigation size={22} className="text-indigo-500" /> Navigation:
                  Moving Around
                </h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                    Imagine your computer is a giant house. Folders are rooms. To
                    do anything, you first have to "walk" into the right room.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <code className="text-blue-600 dark:text-blue-400 font-bold text-base block mb-1">
                      cd [Folder Name]
                    </code>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Change Directory
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <strong>What it does:</strong> Opens a folder.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 italic mt-1">
                      <strong>Example:</strong> cd Pictures
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <code className="text-blue-600 dark:text-blue-400 font-bold text-base block mb-1">
                      cd ..
                    </code>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      The "Back" Button
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <strong>What it does:</strong> Takes you back to the
                      previous folder.
                    </p>
                    <p className="text-xs text-blue-500 dark:text-blue-400 font-bold mt-1">
                      <strong>Tip:</strong> Think of the two dots as "eyes"
                      looking back.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <code className="text-blue-600 dark:text-blue-400 font-bold text-base block mb-1">
                      cd /
                    </code>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      System Reset
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      <strong>What it does:</strong> Jump straight back to the
                      C: drive.
                    </p>
                  </div>
                </div>
              </div>

              {/* Listing Commands */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <List size={22} className="text-indigo-500" /> Listing: Seeing
                  What's There
                </h3>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  If you walk into a dark room, you need to turn on the light to
                  see what's on the floor.
                </p>
                <div className="p-6 bg-[#0c0c0c] rounded-xl shadow-xl">
                  <code className="text-2xl font-bold text-green-500 block mb-1">
                    dir
                  </code>
                  <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-4">
                    Directory
                  </p>
                  <p className="text-sm font-bold text-white mb-4">
                    What it does: Lists every file and folder in your current
                    location.
                  </p>
                  <div className="p-3 bg-white/5 border border-white/10 rounded text-xs italic">
                    <strong className="text-green-400">Pro Tip:</strong> If
                    there are too many files to read, type{' '}
                    <strong>dir /w</strong> to see them in a wide, organized
                    grid.
                  </div>
                </div>
              </div>

              {/* Live Simulation */}
              <div className="mt-8">
                <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.3em] text-center mb-3">
                  Interactive Interface Simulation
                </h4>
                <TypewriterTerminal commands={terminalExamples} />
              </div>

              {/* Managing Files */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <FileCheck size={22} className="text-indigo-500" /> Managing
                  Files: Taking Action
                </h3>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  This is where you actually get work done.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <code className="text-base font-bold text-purple-600 dark:text-purple-400 block mb-1">
                      copy [filename] [destination]
                    </code>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>What it does:</strong> Clones a file.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 italic mt-1">
                      <strong>Example:</strong> copy notes.txt D:\
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <code className="text-base font-bold text-purple-600 dark:text-purple-400 block mb-1">
                      ren [old name] [new name]
                    </code>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>What it does:</strong> Changes a name without
                      changing the file content.
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 rounded-xl shadow-sm relative overflow-hidden">
                  <Trash2 className="absolute -right-4 -bottom-4 text-red-500/20" size={120} />
                  <code className="text-2xl font-bold text-red-600 dark:text-red-400 block mb-1">
                    del [filename]
                  </code>
                  <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} /> The Warning
                  </p>
                  <p className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    "In the regular Windows world, deleted files go to the
                    Recycle Bin. In CMD, they disappear forever. Use this like a
                    sharp pair of scissors!"
                  </p>
                </div>
              </div>

              {/* Beginner Table */}
              <div className="mt-8 space-y-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3"> More Useful
                  Commands for Beginners
                </h4>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  To really get comfortable, you should know these three
                  "quality of life" commands:
                </p>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse min-w-[500px] text-xs">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          Command
                        </th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          What it does
                        </th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          Why use it?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors font-mono">
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                          cls
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          Clears the screen
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-500 italic font-sans">
                          When your screen gets messy with text, this wipes it
                          clean.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors font-mono">
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                          mkdir [name]
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          Makes a new folder
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-500 italic font-sans">
                          Quickly create a folder without right-clicking.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors font-mono">
                        <td className="p-3 font-bold text-blue-600 dark:text-blue-400">
                          help
                        </td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          Shows all commands
                        </td>
                        <td className="p-3 text-slate-500 dark:text-slate-500 italic font-sans">
                          If you get stuck, this lists everything the computer
                          can do.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-white dark:bg-[#121212] rounded-r-xl shadow-sm">
                  <p className="text-sm font-medium italic text-slate-600 dark:text-slate-400">
                    "Example: If you want to see every single hidden file on your
                    USB drive, you would type <strong>dir</strong> in the Command
                    Prompt. It shows you things that the normal Windows folders
                    might hide."
                  </p>
                </div>
              </div>
            </div>

            {/* 3. The Data Processing Cycle */}
            <div
              ref={(el) => {
                sectionRefs.current['cycle'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Data Processing Cycle
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                A computer might seem like it is doing magic, but it is actually
                just following a specific four-step loop: Input → Processing →
                Output → Storage.
              </p>

              <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  Definition
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  "The sequence of steps a computer uses to turn 'raw data'
                  (unorganized facts) into 'useful information' (the finished
                  product)."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[
                  {
                    t: '1. Input (The Starting Point)',
                    icon: Download,
                    d: "Input is how you give information to the computer. Without input, the computer has nothing to work on.",
                    a: 'Collecting raw data.',
                    ex: 'Pressing keys on a keyboard to write a letter.',
                    hw: 'Keyboard, Mouse, Microphone, Scanner.',
                  },
                  {
                    t: '2. Processing (The Thinking Phase)',
                    icon: Cpu,
                    d: "This happens inside the 'brain' of the computer, known as the CPU. It takes the input and follows instructions to change it into something else.",
                    a: 'Transforming the data.',
                    ex: 'The CPU calculates how the letter "A" should look.',
                    hw: 'CPU, RAM.',
                  },
                  {
                    t: '3. Output (The Result)',
                    icon: ArrowRight,
                    d: "Output is how the computer shows you what it has done. It translates the computer's 'thinking' back into a form humans can understand.",
                    a: 'Presenting the information.',
                    ex: 'The word "Hello" appearing on your screen.',
                    hw: 'Monitor, Printer, Speakers.',
                  },
                  {
                    t: '4. Storage (The Memory)',
                    icon: Database,
                    d: "If you turn the computer off, the work in 'Processing' disappears. Storage is how the computer keeps that information permanently.",
                    a: 'Keeping data for later use.',
                    ex: 'Clicking the Save icon.',
                    hw: 'HDD, SSD, USB Flash Drive.',
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col h-full"
                  >
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                      <step.icon size={24} />
                    </div>
                    <h4 className="text-[11px] font-bold uppercase text-slate-900 dark:text-white mb-2 tracking-tighter leading-tight">
                      {step.t}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                      {step.d}
                    </p>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <div>
                        <span className="text-[8px] font-bold uppercase text-indigo-600 dark:text-indigo-400 block">
                          Hardware
                        </span>
                        <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                          {step.hw}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sadza Analogy */}
              <div className="mt-6 p-6 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <Utensils className="text-orange-600" size={32} />
                  <h3 className="text-xl font-bold uppercase text-orange-800 dark:text-orange-400">
                    The "Cooking Sadza" Analogy
                  </h3>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic mb-4">
                  To make this easier to remember, compare it to preparing a
                  meal:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-white/40 dark:bg-black/20 rounded">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Input
                    </span>
                    <p className="text-xs font-bold uppercase tracking-tight">
                      Raw ingredients (Mealie-meal and water).
                    </p>
                  </div>
                  <div className="p-3 bg-white/40 dark:bg-black/20 rounded">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Processing
                    </span>
                    <p className="text-xs font-bold uppercase tracking-tight">
                      Boiling and stirring the pot.
                    </p>
                  </div>
                  <div className="p-3 bg-white/40 dark:bg-black/20 rounded">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Output
                    </span>
                    <p className="text-xs font-bold uppercase tracking-tight">
                      The finished plate of Sadza.
                    </p>
                  </div>
                  <div className="p-3 bg-white/40 dark:bg-black/20 rounded">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">
                      Storage
                    </span>
                    <p className="text-xs font-bold uppercase tracking-tight">
                      Leftovers in the fridge.
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Table */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Repeat size={20} className="text-indigo-500" /> Summary Table
                  for Quick Reference
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          Phase
                        </th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          Purpose
                        </th>
                        <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                          Common Example
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase tracking-widest">
                          Input
                        </td>
                        <td className="p-3">To enter data</td>
                        <td className="p-3">Typing a password</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase tracking-widest">
                          Processing
                        </td>
                        <td className="p-3">To calculate or change data</td>
                        <td className="p-3">Checking if the password is correct</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase tracking-widest">
                          Output
                        </td>
                        <td className="p-3">To show the result</td>
                        <td className="p-3">Seeing the "Welcome" screen</td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold uppercase tracking-widest">
                          Storage
                        </td>
                        <td className="p-3">To save for later</td>
                        <td className="p-3">Saving a photo to a folder</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 4. Interconnection Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['interconnect'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interconnection Structures
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Inside the computer, the parts (CPU, RAM, Hard Drive) need to
                send messages to each other. They use two main types of "roads."
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-500 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center rounded-lg">
                      <Route size={24} />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">
                      A. Bus-Based
                    </h3>
                  </div>
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    Definition
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">
                    "A single, shared communication path that all components plug
                    into."
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    <strong>Explanation:</strong> Imagine a Kombi (Bus) on a
                    single-lane road. Only one person can talk at a time. If the
                    RAM is talking to the CPU, the Hard Drive has to wait its
                    turn. It is cheap but can get slow (a bottleneck).
                  </p>
                </div>

                <div className="p-6 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-purple-500 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center rounded-lg">
                      <Workflow size={24} />
                    </div>
                    <h3 className="text-lg font-bold uppercase tracking-tight">
                      B. Point-to-Point
                    </h3>
                  </div>
                  <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    Definition
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-bold">
                    "A direct, private connection between two components."
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    <strong>Explanation:</strong> This is like having a private
                    car on a multi-lane highway. The CPU has its own private road
                    to the RAM, and another private road to the Graphics Card. No
                    one has to wait! This is what modern, fast computers use.
                  </p>
                </div>
              </div>

              <VideoEmbed
                url="https://drive.google.com/file/d/1SH0y9I_YLA8TxVAAfOFYHc86pFZ4RlAD/view?usp=sharing"
                title="Interconnection Structures Guide"
              />
            </div>

            {/* 5. Data Representation */}
            <div
              ref={(el) => {
                sectionRefs.current['datarep'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Data Representation (Number Systems)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Computers are made of tiny switches. A switch can only be ON or
                OFF. Because of this, computers don't understand "1, 2, 3... 9."
                They only understand "0" (Off) and "1" (On). This is called
                Binary.
              </p>

              <div className="mt-4 overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[400px] text-xs">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        System
                      </th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        Base
                      </th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        Digits
                      </th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">
                        Why we use it?
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold uppercase">Decimal</td>
                      <td className="p-3 font-mono">10</td>
                      <td className="p-3 font-mono">0 to 9</td>
                      <td className="p-3 text-slate-500 dark:text-slate-500 font-bold italic">
                        Used by humans (we have 10 fingers).
                      </td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold uppercase">Binary</td>
                      <td className="p-3 font-mono">2</td>
                      <td className="p-3 font-mono">0, 1</td>
                      <td className="p-3 text-slate-500 dark:text-slate-500 font-bold italic">
                        The "Native Language" of computers.
                      </td>
                    </tr>
                    <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                      <td className="p-3 font-bold uppercase">Hexadecimal</td>
                      <td className="p-3 font-mono">16</td>
                      <td className="p-3 font-mono">0-9 and A-F</td>
                      <td className="p-3 text-slate-500 dark:text-slate-500 font-bold italic">
                        A shorthand way for techies to read long binary codes.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">
                  "Example: The number <strong>A</strong> in Hexadecimal actually
                  means 10. Since we ran out of single numbers, we start using
                  letters (A=10, B=11, C=12, D=13, E=14, F=15)."
                </p>
              </div>

              {/* Binary Translator Graphic */}
              <div className="mt-4 p-8 bg-slate-900 rounded-xl flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                <div className="shrink-0 text-center space-y-2">
                  <div className="text-6xl md:text-8xl font-bold text-blue-500">5</div>
                  <div className="w-10 h-1 bg-blue-500 mx-auto"></div>
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Human Input
                  </span>
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-lg">
                    The Binary Translator
                  </div>
                  <p className="text-slate-400 text-sm font-bold leading-relaxed uppercase tracking-widest opacity-80">
                    The number '5' being converted to binary.
                  </p>
                  <div className="flex justify-center md:justify-start gap-3">
                    {[0, 1, 0, 1].map((bit, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 bg-white flex items-center justify-center font-bold text-2xl text-black rounded shadow-lg shadow-blue-500/20"
                      >
                        {bit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm md:text-base text-slate-700 dark:text-slate-300 font-bold italic pl-4">
                Computers do not understand the numbers 0 through 9 like we do.
                They only understand "On" and "Off," which we represent as 1 and
                0.
              </p>
            </div>

            {/* 6. Practical Conversions */}
            <div
              ref={(el) => {
                sectionRefs.current['conversions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Practical Conversions
              </h2>

              {/* Step 1 */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    1
                  </div>
                  Decimal to Binary (The "Divide by 2" Game)
                </h3>
                <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Binary is a base-2 system (only 0 and 1). To convert a
                    standard number (Decimal) to Binary, you divide by 2
                    repeatedly and track the remainders.
                  </p>
                  <div className="p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl font-mono text-xs md:text-sm space-y-2">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">
                      Example: Convert 23 to Binary
                    </p>
                    <p className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Step 1: 23 ÷ 2 = 11</span>
                      <span className="text-orange-500 font-bold">
                        remainder of 1
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Step 2: 11 ÷ 2 = 5</span>
                      <span className="text-orange-500 font-bold">
                        remainder of 1
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Step 3: 5 ÷ 2 = 2</span>
                      <span className="text-orange-500 font-bold">
                        remainder of 1
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Step 4: 2 ÷ 2 = 1</span>
                      <span className="text-orange-500 font-bold">
                        remainder of 0
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <span>Step 5: 1 ÷ 2 = 0</span>
                      <span className="text-orange-500 font-bold">
                        remainder of 1
                      </span>
                    </p>
                    <div className="pt-4 text-center">
                      <div className="p-2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded mb-2">
                        The Final Step: Read the remainders from the bottom to
                        the top.
                      </div>
                      <div className="text-4xl md:text-6xl font-bold text-blue-600 tracking-[0.5em]">
                        Result: 10111
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    2
                  </div>
                  Binary to Decimal (The "Power" Method)
                </h3>
                <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-4">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    To turn a binary string like 10111 back into a normal number,
                    we use a "positional" table. Every slot from right to left
                    doubles in value: 1, 2, 4, 8, 16, 32, and so on.
                  </p>
                  <p className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-center">
                    Example: Convert 10111 back to Decimal
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse bg-white dark:bg-[#121212] font-mono border border-slate-200 dark:border-slate-700 rounded">
                      <tbody>
                        <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b dark:border-slate-800">
                          <td className="p-3 text-[10px] font-bold uppercase text-slate-400">
                            Binary Digit
                          </td>
                          <td className="p-3 font-bold text-xl">1</td>
                          <td className="p-3 font-bold text-xl">0</td>
                          <td className="p-3 font-bold text-xl">1</td>
                          <td className="p-3 font-bold text-xl">1</td>
                          <td className="p-3 font-bold text-xl">1</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-[10px] font-bold uppercase text-slate-400">
                            Value (Power of 2)
                          </td>
                          <td className="p-3 font-bold text-blue-600">16</td>
                          <td className="p-3 font-bold text-blue-600">8</td>
                          <td className="p-3 font-bold text-blue-600">4</td>
                          <td className="p-3 font-bold text-blue-600">2</td>
                          <td className="p-3 font-bold text-blue-600">1</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="p-5 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded text-center font-mono space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Calculation:
                      </span>
                      <p className="text-sm md:text-base">
                        (1 × 16) + (0 × 8) + (1 × 4) + (1 × 2) + (1 × 1)
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">
                        Math:
                      </span>
                      <p className="text-sm md:text-base">
                        16 + 0 + 4 + 2 + 1 = 23
                      </p>
                    </div>
                    <div className="pt-2">
                      <div className="text-3xl md:text-5xl font-bold text-purple-600 uppercase tracking-tighter leading-none">
                        Result: 23
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    3
                  </div>
                  Decimal to Hexadecimal (The "Divide by 16" Game)
                </h3>
                <div className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl space-y-6">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Hexadecimal is used by computers to shorten long binary
                    strings. It uses 0-9 and then letters A-F for numbers 10-15.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] border-b pb-2">
                        The Hex Code Key:
                      </h4>
                      <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
                        {['10=A', '11=B', '12=C', '13=D', '14=E', '15=F'].map(
                          (k) => (
                            <div
                              key={k}
                              className="bg-slate-100 dark:bg-black p-2 border border-slate-200 dark:border-slate-700 rounded"
                            >
                              {k}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3 font-mono text-xs md:text-sm">
                      <p className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                        Example: Convert 287 to Hexadecimal
                      </p>
                      <p className="pb-1 border-b dark:border-slate-700 flex justify-between">
                        <span>Step 1: 287 ÷ 16 = 17</span>
                        <span className="text-orange-500 font-bold">
                          remainder of 15 (F)
                        </span>
                      </p>
                      <p className="pb-1 border-b dark:border-slate-700 flex justify-between">
                        <span>Step 2: 17 ÷ 16 = 1</span>
                        <span className="text-orange-500 font-bold">
                          remainder of 1
                        </span>
                      </p>
                      <p className="pb-1 border-b dark:border-slate-700 flex justify-between">
                        <span>Step 3: 1 ÷ 16 = 0</span>
                        <span className="text-orange-500 font-bold">
                          remainder of 1
                        </span>
                      </p>
                      <div className="pt-4 text-center">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                          Read from bottom to top
                        </div>
                        <div className="text-3xl font-bold text-blue-600 uppercase tracking-widest">
                          Result: 11F
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <VideoEmbed
                url="https://drive.google.com/file/d/1IDEFabfl38UEwYV0uV9nVUdWpDpiVTSt/view?usp=sharing"
                title="Supplementary Video: Number System Conversions"
              />

              {/* Pro Tips Panel */}
              <div className="mt-8 p-8 bg-gradient-to-r from-indigo-900 to-blue-900 text-white rounded-xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rotate-45 translate-x-16 -translate-y-16"></div>
                <div className="flex items-center gap-4 mb-6">
                  <Rocket className="text-orange-400" size={40} />
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter leading-none">
                    🚀 Pro-User Tips for Conversions
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 flex items-center justify-center font-bold rounded">
                        1
                      </div>
                      <h4 className="text-orange-400 font-bold uppercase text-sm tracking-widest">
                        Even vs. Odd
                      </h4>
                    </div>
                    <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 border-l-2 border-white/20 pl-4 italic">
                      "In Binary, if a number is Even, it will always end in 0.
                      If it is Odd, it will always end in 1."
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 flex items-center justify-center font-bold rounded">
                        2
                      </div>
                      <h4 className="text-orange-400 font-bold uppercase text-sm tracking-widest">
                        The Power of 16
                      </h4>
                    </div>
                    <p className="text-sm md:text-base font-medium leading-relaxed opacity-90 border-l-2 border-white/20 pl-4 italic">
                      "Hexadecimal is very common in 'Color Codes.' For example,
                      White is #FFFFFF."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Power User Tip
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
                  <span>CMD Commands</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    8+
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Number Systems</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    3
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The Command Prompt is your direct line to the operating system.
                Use it wisely – a single command can make or break your system.
                Always double‑check before pressing Enter!
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
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">System Model:</strong> Every
                computer has a unique model name – use System Information, CMD,
                or PowerShell to find it.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">CMD Commands:</strong> Master{' '}
                <code className="bg-white/20 px-1 rounded text-[10px]">cd</code>,{' '}
                <code className="bg-white/20 px-1 rounded text-[10px]">dir</code>,{' '}
                <code className="bg-white/20 px-1 rounded text-[10px]">copy</code>,{' '}
                <code className="bg-white/20 px-1 rounded text-[10px]">del</code>, and
                more to control your system like a pro.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Data Processing Cycle:</strong>{' '}
                Input → Processing → Output → Storage – every computer follows
                this loop.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Number Systems:</strong> Binary
                (base‑2), Decimal (base‑10), Hexadecimal (base‑16) – each has a
                specific purpose in computing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Conversions:</strong> Divide by 2
                for Decimal → Binary; use positional values for Binary → Decimal;
                divide by 16 for Decimal → Hex.
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
            Sidemann Academic Registry • Learning Outcome 2 • Production 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;
