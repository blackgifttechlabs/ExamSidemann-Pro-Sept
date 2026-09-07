import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  Globe,
  Server,
  Monitor,
  Smartphone,
  Tablet,
  Layers,
  Box,
  Terminal,
  GitBranch,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  BookOpen,
  AlertTriangle,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'os-overview', label: 'OS Overview' },
  { id: 'os-structures', label: 'OS Structures' },
  { id: 'computer-system', label: 'Computer System' },
  { id: 'interrupts', label: 'Interrupts' },
  { id: 'interrupt-management', label: 'Interrupt Mgmt' },
  { id: 'context-switching', label: 'Context Switching' },
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
        text: 'The first operating systems were batch systems that ran one job at a time. Modern OSes support multitasking, multi‑user environments, and virtual memory.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding OS structures (monolithic, layered, micro‑kernel) helps you appreciate how different OSes are designed and why they have different performance and security characteristics.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference between hardware and software interrupts: hardware interrupts come from devices (like keyboards), software interrupts come from running programs (like system calls).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse interrupts with exceptions. Exceptions are synchronous events caused by the executing instruction (e.g., division by zero), while interrupts are asynchronous external events.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first operating systems were batch systems that ran one job at a time. Modern OSes support multitasking, multi‑user environments, and virtual memory.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding OS structures (monolithic, layered, micro‑kernel) helps you appreciate how different OSes are designed and why they have different performance and security characteristics.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference between hardware and software interrupts: hardware interrupts come from devices (like keyboards), software interrupts come from running programs (like system calls).',
      },
      {
        title: 'Common Mistake',
        text: 'Don’t confuse interrupts with exceptions. Exceptions are synchronous events caused by the executing instruction (e.g., division by zero), while interrupts are asynchronous external events.',
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

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

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> LEARNING OUTCOME 1
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Operating Systems &{' '}
            <span className="text-emerald-300 font-bold italic">
              System Architecture
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master OS fundamentals, goals, functions, evolution, types, structures, interrupts, and context switching.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cpu size={14} className="inline mr-1" /> OS Management
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> System Structures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Zap size={14} className="inline mr-1" /> Interrupts
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
                placeholder="Search for a concept, interrupt, context switch..."
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
            {/* OS Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['os-overview'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Operating System Overview
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    An operating system (OS) is a software program that manages computer hardware and software resources, providing a user interface and platform for running applications. It acts as an intermediary between the user and the computer's hardware.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Goals of an OS</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Efficiency:</strong> Maximize utilization of CPU, memory, and I/O.</li>
                  <li><strong>Convenience:</strong> Provide a user‑friendly interface.</li>
                  <li><strong>Reliability:</strong> Ensure stability and minimize crashes.</li>
                  <li><strong>Responsiveness:</strong> Deliver timely responses.</li>
                  <li><strong>Security:</strong> Protect resources and data from unauthorized access.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Functions of an OS</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Process Management:</strong> Creation, scheduling, termination of processes.</li>
                  <li><strong>Memory Management:</strong> Allocation and deallocation of memory.</li>
                  <li><strong>File System Management:</strong> Organizing and managing files.</li>
                  <li><strong>I/O Management:</strong> Controlling input/output devices.</li>
                  <li><strong>Device Management:</strong> Managing hardware devices.</li>
                  <li><strong>Security Management:</strong> Implementing security measures.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Evolution of OS</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  From batch systems to command‑line interfaces, then to graphical user interfaces (GUIs). Modern OSes support networking, multitasking, and security.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Types of OS</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Batch, Multiprogramming, Multitasking, Multi‑user, Real‑Time, Distributed.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Examples of OS</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Windows, macOS, Linux, Android, iOS.</li>
                </ul>
              </div>
            </div>

            {/* OS Structures */}
            <div
              ref={(el) => {
                sectionRefs.current['os-structures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Operating System Structures
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <strong>Simple Structure:</strong> All components tightly integrated into a single program. Easy to design but lacks modularity.
                  </li>
                  <li>
                    <strong>Monolithic Structure:</strong> Entire OS kernel is one large program. Efficient but difficult to modify.
                  </li>
                  <li>
                    <strong>Layered Structure:</strong> Divided into layers, each providing services to the layer above. Promotes modularity but may have performance overhead.
                  </li>
                  <li>
                    <strong>Micro‑Kernel Structure:</strong> Minimal kernel, other services as user‑level processes. Better security and modularity.
                  </li>
                  <li>
                    <strong>Exo‑Kernel Structure:</strong> Even more services moved out of the kernel for greater flexibility.
                  </li>
                  <li>
                    <strong>Virtual Machines:</strong> Isolated environments running multiple OSes on one physical machine.
                  </li>
                </ul>
              </div>
            </div>

            {/* Computer System Structure */}
            <div
              ref={(el) => {
                sectionRefs.current['computer-system'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Computer System Structure
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Basic Components</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Processor:</strong> Executes instructions.</li>
                  <li><strong>Memory:</strong> Stores data and instructions (RAM, secondary storage).</li>
                  <li><strong>Peripheral Devices:</strong> Keyboards, mice, monitors, printers, network interfaces.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Registers and Memory</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Registers:</strong> High‑speed storage within the CPU for temporary data and addresses.</li>
                  <li><strong>Memory:</strong> Organized into cells with unique addresses; accessed via address bus.</li>
                </ul>
              </div>
            </div>

            {/* Interrupts */}
            <div
              ref={(el) => {
                sectionRefs.current['interrupts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interrupts
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Definition</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  An interrupt is a signal sent to the CPU to request immediate attention, pausing the current task to handle the urgent event.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Hardware vs Software Interrupts</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Hardware:</strong> Generated by external devices (keyboard, mouse, disk).</li>
                  <li><strong>Software:</strong> Generated by software instructions (system calls, exceptions).</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">CPU Response to Interrupts</h3>
                <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Receive interrupt signal.</li>
                  <li>Pause current task, save state (registers, program counter).</li>
                  <li>Transfer control to interrupt handler (ISR).</li>
                  <li>ISR identifies source and performs necessary actions.</li>
                  <li>Restore CPU state and return to interrupted task.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Interrupt Handling in Modern OS</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modern OSes use prioritization, scheduling, and masking to handle interrupts efficiently, ensuring critical tasks are addressed promptly.
                </p>
              </div>
            </div>

            {/* Interrupt Management */}
            <div
              ref={(el) => {
                sectionRefs.current['interrupt-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Interrupt Management
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Interrupt Masking</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Temporarily disabling specific interrupts to allow the CPU to focus on critical tasks without interruption.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Interrupt Prioritization</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Assigning priority levels to interrupts so that more critical interrupts (e.g., device overflow) are handled first.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">Interrupt Scheduling</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Deciding when to handle interrupts; low‑priority interrupts may be delayed if the CPU is busy.
                </p>
              </div>
            </div>

            {/* Context Switching */}
            <div
              ref={(el) => {
                sectionRefs.current['context-switching'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Context Switching
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Context switching is the process of saving the state of one process (or thread) and loading the state of another. This enables multitasking and efficient CPU utilization. When an interrupt occurs, the OS performs a context switch to save the current process state and load the interrupt handler. After handling the interrupt, another context switch may restore the original process.
                </p>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    Key point: Context switching is essential for multitasking and interrupt handling, but it introduces overhead.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 OS Insight
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
                  <span>OS Goals</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>OS Structures</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Interrupt Concepts</span>
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
                The OS is the backbone of any computer system. Master the fundamentals:
                goals, functions, evolution, types, and structures. Understand how interrupts
                work and why context switching is crucial for multitasking. These concepts
                are essential for system programming, performance tuning, and exam success.
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
                <strong className="text-white">Operating System</strong> – manages hardware and software, provides user interface, and ensures efficiency, convenience, reliability, responsiveness, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">OS Structures</strong> – include simple, monolithic, layered, micro‑kernel, exo‑kernel, and virtual machines, each with trade‑offs in performance, modularity, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Computer System</strong> – consists of processor, memory, and peripheral devices; registers are fast storage within the CPU.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Interrupts</strong> – signals that pause the CPU to handle urgent events (hardware or software). They are managed via masking, prioritization, and scheduling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Context Switching</strong> – saves and restores process states, enabling multitasking and interrupt handling, but introduces overhead.
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
            Sidemann Academic Registry • Operating Systems – Fundamentals 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;