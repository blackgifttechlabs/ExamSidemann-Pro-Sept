import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
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
  Terminal,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  GraduationCap,
  Download,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE IMAGE COMPONENT (unchanged, kept as-is)
// ──────────────────────────────────────────────────────────────────────────────
interface InteractiveImageProps {
  src: string;
  alt: string;
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${alt.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(src, '_blank');
    }
  };

  return (
    <div className="my-6">
      <div
        className="relative group cursor-pointer inline-block overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-lg max-w-[400px] rounded-xl"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-xl">
            <ChevronUp size={20} className="text-[#003153] dark:text-white rotate-45" />
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md rounded"
        >
          <Download size={12} /> Download
        </button>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{alt}</span>
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <button className="absolute top-8 right-8 p-3 text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={32} />
          </button>
          <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-pop-bounce" />
          <div className="mt-8 text-center">
            <h4 className="text-white font-black uppercase tracking-[0.2em] mb-4">{alt}</h4>
            <button
              onClick={handleDownload}
              className="px-10 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-transform rounded"
            >
              Save Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ──────────────────────────────────────────────────────────────────────────────
interface Question {
  id: number;
  question: string;
  answer: React.ReactNode;
}

interface Section {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  details: string[];
  examples: React.ReactNode;
  questions: Question[];
}

// ──────────────────────────────────────────────────────────────────────────────
// DATA: Learning Outcome 1 – Sections for Navigation
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'structure', label: 'Structure' },
  { id: 'cpu', label: 'CPU' },
  { id: 'memory', label: 'Memory' },
  { id: 'storage', label: 'Storage' },
  { id: 'connecting', label: 'Connecting' },
  { id: 'testing', label: 'Testing' },
  { id: 'maintaining', label: 'Maintaining' },
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
        text: 'The first computer mouse was made of wood! It was invented in 1964 by Douglas Engelbart and had only one button.',
      },
      {
        title: 'Pro Tip',
        text: 'When building a PC, always ground yourself by touching a metal part of the case before handling components to avoid static damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: RAM is "Random Access Memory" – think of it as a desk where you keep what you\'re working on right now. ROM is "Read-Only Memory" – think of it as a book that never changes.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse storage (HDD/SSD) with memory (RAM). Storage is permanent; memory is temporary. You save files to storage, but you run programs in memory.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first computer mouse was made of wood! It was invented in 1964 by Douglas Engelbart and had only one button.',
      },
      {
        title: 'Pro Tip',
        text: 'When building a PC, always ground yourself by touching a metal part of the case before handling components to avoid static damage.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: RAM is "Random Access Memory" – think of it as a desk where you keep what you\'re working on right now. ROM is "Read-Only Memory" – think of it as a book that never changes.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people confuse storage (HDD/SSD) with memory (RAM). Storage is permanent; memory is temporary. You save files to storage, but you run programs in memory.',
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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> COMPUTER SYSTEMS MAINTENANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              System Fundamentals
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master the core components of a computer system: CPU, main memory,
            secondary storage, and how they connect. Learn system structure,
            functional testing, and maintenance standards.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 7 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              ⚙️ Interactive diagrams
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Practical
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
                placeholder="Search for a topic or component..."
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
                  Welcome to the exciting world of Computer Systems! Imagine
                  having a superpower that allows you to calculate millions of
                  math problems in a second, remember every book ever written,
                  and talk to someone across the world instantly. That superpower
                  is a computer.
                </p>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Whether it is the phone in your pocket or the laptop on a desk, a
                computer is a tool that extends the power of the human mind. By
                learning how these machines are built, you are not just learning
                about "boxes and wires"—you are learning how to control the most
                powerful tool ever created by man.
              </p>
            </div>

            {/* 1. Computer System Structure */}
            <div
              ref={(el) => {
                sectionRefs.current['structure'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Computer System Structure
              </h2>
              <InteractiveImage
                src="https://i.ibb.co/20RW3Jdb/computer-system-structure.png"
                alt="Computer System Structure"
              />
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mt-4">
                A computer system's structure is the way its different parts are
                built and how they talk to each other to get a job done. It is a
                combination of <strong>Hardware</strong> (the physical parts you
                can touch) and <strong>Software</strong> (the invisible programs).
              </p>
              <div className="mt-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">
                  Technical Definition
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  "A computer system is a collection of hardware and software
                  components that work together to process data and provide a
                  result."
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-5 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} /> Explanation
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    Think of a computer as a team. The CPU is the leader, the
                    Memory is the workspace, and the Storage is the filing
                    cabinet. None of them can do the job alone; they must be
                    structured to work together.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <ArrowRight size={14} /> Example
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    When you use a computer to write a letter, the keyboard
                    (Input) sends letters to the CPU (Brain), which stores them
                    temporarily in RAM (Memory) and then saves them permanently
                    to the Hard Drive (Storage) so you can print it later
                    (Output).
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Central Processing Unit */}
            <div
              ref={(el) => {
                sectionRefs.current['cpu'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Central Processing Unit (CPU)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The CPU is the most important part of any computer. It is often
                called the "Brain" because it performs every single action the
                computer takes.
              </p>
              <div className="mt-4 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl">
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1">
                  Definition
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  "The CPU is the electronic circuitry that executes instructions
                  of a computer program by performing basic arithmetic, logic,
                  and control operations."
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-5 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Arithmetic Logic Unit (ALU)
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    This is the calculator. It does the math (like adding
                    numbers) and logic (deciding if one thing is equal to
                    another).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Control Unit (CU)
                  </h4>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    This is the traffic policeman. It tells the rest of the
                    computer how to respond to the instructions it has received.
                  </p>
                </div>
              </div>
              <div className="mt-4 p-5 bg-slate-900 text-white rounded-xl shadow-lg">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  Logic Scenario
                </h4>
                <p className="text-sm font-medium italic opacity-90 leading-relaxed mt-1">
                  "If you are playing a video game and you press the 'Jump'
                  button, the Control Unit receives that signal and tells the ALU
                  to calculate the new height of your character on the screen."
                </p>
              </div>
              <InteractiveImage
                src="https://i.ibb.co/YF5SSxLP/cpu.png"
                alt="Central Processing Unit"
              />
            </div>

            {/* 3. Main Memory */}
            <div
              ref={(el) => {
                sectionRefs.current['memory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Main Memory (Primary Memory)
              </h2>
              <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Main memory is the workspace of the computer. It is the place
                  where data stays while the CPU is currently working on it.
                </p>
                <p className="mt-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    Primary Memory Definition:
                  </strong>{' '}
                  High-speed storage that is directly accessible by the CPU. Most
                  primary memory is "volatile," meaning it needs electricity to
                  keep the information.
                </p>
              </div>

              {/* RAM */}
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Layers className="text-indigo-500" size={20} /> A. RAM
                  (Random Access Memory)
                </h3>
                <InteractiveImage
                  src="https://i.ibb.co/Kj50h09q/ram.png"
                  alt="RAM"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                      Definition
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                      A fast, temporary storage area used to hold data and
                      programs that are currently running.
                    </p>
                  </div>
                  <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                      Analogy
                    </span>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-1">
                      RAM is like a student’s desk. You put the books you are
                      reading right now on the desk. When you turn off the light
                      and leave, the desk is cleared.
                    </p>
                  </div>
                </div>
              </div>

              {/* ROM */}
              <div className="mt-8 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Database className="text-indigo-500" size={20} /> B. ROM
                  (Read-Only Memory)
                </h3>
                <InteractiveImage
                  src="https://i.ibb.co/jv7Gp0f0/images-q-tbn-ANd9-Gc-Rd-Dkd-NH8-LDk9aw-Qd6-NXU3yxsrtzn-Fk5-Xiu7-Q-s.jpg"
                  alt="ROM"
                />
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px] block mb-1">
                      Definition
                    </strong>
                    A type of memory that contains permanent data that cannot be
                    easily changed. It is "non-volatile," meaning it stays there
                    even when the power is off.
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-3">
                    <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px] block mb-1">
                      Example
                    </strong>
                    When you first press the power button on your computer, the
                    ROM provides the "BIOS" instructions that tell the computer
                    how to wake up.
                  </p>
                </div>
              </div>

              {/* Cache */}
              <div className="mt-8 space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Zap className="text-indigo-500" size={20} /> C. Cache Memory
                </h3>
                <div className="p-5 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    <strong className="text-orange-600 dark:text-orange-400 uppercase tracking-widest text-[10px] block mb-1">
                      Definition
                    </strong>
                    A very small, extremely fast type of memory located inside or
                    very close to the CPU.
                  </p>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    <strong>Explanation:</strong> Cache acts as a "buffer" or a
                    shortcut. It stores the data the CPU uses most often so the
                    CPU doesn't have to wait for the slower RAM.
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Secondary Storage */}
            <div
              ref={(el) => {
                sectionRefs.current['storage'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Secondary Storage
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Since Primary Memory (RAM) forgets everything when the power goes
                out, we need a "warehouse" to keep our files forever. This is
                Secondary Storage.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                    A. Magnetic Disk (HDD)
                  </h4>
                  <InteractiveImage
                    src="https://i.ibb.co/nqRQ9Hd0/6368e10deff48b70857f8436-500gb-2-5-34-sata-hard-drive-disk.jpg"
                    alt="Magnetic Disk (HDD)"
                  />
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium italic mt-2">
                    <strong>Example:</strong> A standard office computer usually
                    has a 1 Terabyte HDD inside it to store thousands of photos
                    and documents cheaply.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                    B. Solid-State Drive (SSD)
                  </h4>
                  <InteractiveImage
                    src="https://i.ibb.co/Swk1GZPF/ssd-c900an500g-d.jpg"
                    alt="Solid-State Drive (SSD)"
                  />
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium italic mt-2">
                    <strong>Example:</strong> High-end laptops use SSDs so that
                    they can turn on in 5 seconds instead of 1 minute, because
                    the SSD can read data much faster than a spinning HDD.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                    C. Magnetic Tape
                  </h4>
                  <InteractiveImage
                    src="https://i.ibb.co/MDcysBmV/transparent-cassette-magnetic-tape-recorder-260nw-1697188258.jpg"
                    alt="Magnetic Tape"
                  />
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium italic mt-2">
                    <strong>Example:</strong> Large banks use Magnetic Tape to
                    keep records of every transaction made over the last 50
                    years. It is slow to read but lasts a very long time.
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                  Summary of Key Characteristics
                </h3>
                <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Type
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Technology
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Access Time
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Advantages
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Disadvantages
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          HDD
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Magnetic platters
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Slower
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Inexpensive, high capacity
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 italic">
                          Slow access, physical damage prone
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          SSD
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Flash memory
                        </td>
                        <td className="p-3 text-green-600 font-bold">Fastest</td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Fast access, durable, low power
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 italic">
                          More expensive per GB
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          Tape
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Magnetic tape
                        </td>
                        <td className="p-3 text-orange-500 font-bold">
                          Slowest
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Cost-effective for archival
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 italic">
                          Slow sequential access, wear prone
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 5. Connecting Hardware Components */}
            <div
              ref={(el) => {
                sectionRefs.current['connecting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Connecting Computer Hardware Components
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Building a computer is like building a Lego set. Each piece has a
                specific place where it must be plugged in.
              </p>
              <div className="mt-4 grid gap-3">
                {[
                  {
                    t: 'Prepare the Case',
                    d: "Use 'standoffs' (small spacers) to keep the motherboard from touching the metal case.",
                  },
                  {
                    t: 'Install the CPU',
                    d: 'Place it gently into the socket. Align the small gold triangle on the corner of the CPU with the triangle on the socket.',
                  },
                  {
                    t: 'Install RAM',
                    d: 'Push the sticks into the slots until the clips click.',
                  },
                  {
                    t: 'Power Supply (PSU)',
                    d: "This is the 'heart' that pumps electricity. Connect the thick 24-pin cable to the motherboard.",
                  },
                  {
                    t: 'Storage',
                    d: 'Plug the SATA cables from the HDD/SSD into the motherboard ports.',
                  },
                  {
                    t: 'Cable Management',
                    d: "Tie cables together using zip-ties so they don't block the cooling fans.",
                  },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">
                        {step.t}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {step.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Functional Testing */}
            <div
              ref={(el) => {
                sectionRefs.current['testing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Functional Testing
              </h2>
              <div className="p-6 bg-slate-900 text-white rounded-xl shadow-lg space-y-4">
                <p className="text-sm md:text-base font-medium italic opacity-90 leading-relaxed">
                  <strong className="text-blue-400 uppercase tracking-widest text-[10px] block mb-1">
                    Definition
                  </strong>
                  "A type of 'Black-Box' testing that checks if the system does
                  what it is supposed to do based on the requirements."
                </p>
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  <div>
                    <h4 className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
                      The Logic
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      In Black-Box testing, we don't look at the code or the
                      wires inside. We only look at:{' '}
                      <strong>Input → Result</strong>.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">
                      Example Case
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      If you click the "Save" icon in a Word document, the
                      functional test passes if a file actually appears on your
                      hard drive. If nothing happens, the test fails.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Maintaining Operational Standards */}
            <div
              ref={(el) => {
                sectionRefs.current['maintaining'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Maintaining Operational Standards
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                To keep a computer running like new, you must perform regular
                "check-ups."
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[
                  {
                    t: 'Computer Diagnosis',
                    d: "Using software to check if the hardware is failing. Example: Running a 'Battery Health Report' on a laptop.",
                  },
                  {
                    t: 'Manage Disk Space',
                    d: "Deleting old files. Example: If your Hard Drive is 99% full, the computer will become very slow.",
                  },
                  {
                    t: 'Update Operating System',
                    d: "Installing updates from Microsoft or Apple. They include 'Security Patches' that stop hackers.",
                  },
                  {
                    t: 'Antivirus',
                    d: "Scanning for 'malware' (bad software). Example: Setting your computer to scan every Friday at 4 PM.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                  >
                    <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
                      {item.t}
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Table */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                  Summary Table for Revision
                </h3>
                <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Component
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Type
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Volatile?
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Purpose
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          CPU
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Processor
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          N/A
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                          Performs calculations and manages data.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          RAM
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Primary Memory
                        </td>
                        <td className="p-3 text-blue-600 font-bold tracking-widest">
                          YES
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                          Holds the apps you are currently using.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          ROM
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Primary Memory
                        </td>
                        <td className="p-3 text-orange-500 font-bold tracking-widest">
                          NO
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                          Holds the startup instructions.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          SSD / HDD
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Secondary Storage
                        </td>
                        <td className="p-3 text-orange-500 font-bold tracking-widest">
                          NO
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                          Stores files, photos, and apps permanently.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white">
                          Cache
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Primary Memory
                        </td>
                        <td className="p-3 text-blue-600 font-bold tracking-widest">
                          YES
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                          Super-fast shortcut for the CPU.
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                  💡 Tech Tip
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
                  <span>Key Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Interactive Images</span>
                  <span className="font-bold text-green-600 dark:text-green-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                A computer is only as good as its weakest component. Regular
                maintenance, proper testing, and understanding the structure are
                essential for long‑term reliability.
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
                <strong className="text-white">System Structure:</strong> Hardware
                + Software work together to process data and produce results.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">CPU:</strong> The "brain" – contains
                ALU (calculator) and CU (traffic controller).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Memory:</strong> RAM (temporary,
                volatile), ROM (permanent, non‑volatile), Cache (super‑fast
                shortcut).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Storage:</strong> HDD (cheap, slow),
                SSD (fast, durable), Tape (archival, cost‑effective).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Testing &amp; Maintenance:</strong>{' '}
                Functional testing verifies requirements; regular check‑ups keep
                systems healthy.
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
            Sidemann Academic Registry • Standard IT Maintenance 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
