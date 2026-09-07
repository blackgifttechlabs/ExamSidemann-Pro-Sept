import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Cpu,
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
  Activity,
  Layers,
  GitBranch,
  AlertCircle,
  Share2,
  Zap,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  Table,
  Settings,
  AlertTriangle,
  MinusCircle,
  PlusCircle,
  BoxIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'process-management', label: 'Process Mgmt' },
  { id: 'definition', label: 'Definition' },
  { id: 'creation-termination', label: 'Creation & Term' },
  { id: 'pcb', label: 'PCB' },
  { id: 'lifecycle', label: 'Life Cycle' },
  { id: 'windows-linux', label: 'Windows & Linux' },
  { id: 'commands', label: 'Commands' },
  { id: 'cpu-scheduling', label: 'CPU Scheduling' },
  { id: 'ipc', label: 'IPC' },
  { id: 'synchronization', label: 'Synchronization' },
  { id: 'deadlock', label: 'Deadlock' },
];

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
        text: 'A process is more than just a program – it includes the program counter, registers, and stack. The OS manages processes using a Process Control Block (PCB).',
      },
      {
        title: 'Pro Tip',
        text: 'CPU scheduling algorithms like Round Robin and Shortest Job First are critical for system performance. Understand their trade-offs for exams.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait – they spell "M-H-N-C".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a process with a thread. A process is an instance of a program, while a thread is a lightweight unit of execution within a process.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'A process is more than just a program – it includes the program counter, registers, and stack. The OS manages processes using a Process Control Block (PCB).',
      },
      {
        title: 'Pro Tip',
        text: 'CPU scheduling algorithms like Round Robin and Shortest Job First are critical for system performance. Understand their trade-offs for exams.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait – they spell "M-H-N-C".',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse a process with a thread. A process is an instance of a program, while a thread is a lightweight unit of execution within a process.',
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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> OPERATING SYSTEMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 2{' '}
            <span className="text-sky-300 font-bold italic">
              Simply Easy Processes
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Process Management — creation, scheduling, synchronization, and deadlock handling in operating systems.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Activity size={14} className="inline mr-1" /> Process Lifecycle
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> CPU Scheduling
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Share2 size={14} className="inline mr-1" /> IPC &amp; Sync
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
                placeholder="Search for a concept, scheduling, deadlock..."
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
            {/* Process Management Overview */}
            <div
              ref={(el) => {
                sectionRefs.current['process-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Process Management Overview
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Process management is the core of any operating system. It involves
                    creating, scheduling, synchronizing, and terminating processes.
                    Understanding these concepts is essential for system programming
                    and performance optimization.
                  </p>
</div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  A process is like a recipe being executed by a chef. The OS is the kitchen manager
                  who assigns resources (ingredients, stoves) and decides which recipe to cook next.
                </p>
              </div>
            </div>

            {/* Process Definition */}
            <div
              ref={(el) => {
                sectionRefs.current['definition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Definition
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A process is an instance of a program in execution. It's a dynamic entity
                  that requires system resources like CPU time, memory, and I/O devices to
                  perform its tasks. Key characteristics include:
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Program Counter:</span> Points to the next instruction to be executed.</li>
                  <li><span className="font-bold">Registers:</span> Stores temporary data used in calculations.</li>
                  <li><span className="font-bold">Stack:</span> Manages function calls and local variables.</li>
                  <li><span className="font-bold">Heap:</span> Dynamically allocates memory during program execution.</li>
                </ul>
              </div>
            </div>

            {/* Process Creation and Termination */}
            <div
              ref={(el) => {
                sectionRefs.current['creation-termination'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Creation and Termination
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <PlusCircle size={16} /> Process Creation
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>System call: A program requests the OS to create a new process.</li>
                    <li>OS allocates resources: Memory, CPU time, and other resources are assigned.</li>
                    <li>New process is created: A new process control block (PCB) is created to manage the process's state.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <MinusCircle size={16} /> Process Termination
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Normal termination: The process completes its execution.</li>
                    <li>Abnormal termination: The process crashes or is killed by the OS.</li>
                    <li>OS reclaims resources: The OS deallocates the resources used by the terminated process.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Process Control Block (PCB) */}
            <div
              ref={(el) => {
                sectionRefs.current['pcb'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Control Block (PCB)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  The PCB is a data structure that contains information about a process, including:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Process ID (PID): A unique identifier.</li>
                    <li>Process State: Current state (running, ready, waiting, etc.).</li>
                    <li>Program Counter: Points to the next instruction.</li>
                    <li>Registers: Stores the process's registers.</li>
                    <li>Memory Limits: Defines the memory allocated to the process.</li>
                    <li>Open Files: List of open files.</li>
                  </ul>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Parent Process: The process that created the current process.</li>
                    <li>Child Processes: List of child processes.</li>
                    <li>Priority: Determines the process's importance.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Process Life Cycle */}
            <div
              ref={(el) => {
                sectionRefs.current['lifecycle'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Life Cycle
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A process goes through different states during its lifetime:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                    <strong className="text-blue-700 dark:text-blue-400">New</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">The process is being created.</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg text-center">
                    <strong className="text-green-700 dark:text-green-400">Ready</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Waiting to be assigned to a CPU.</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg text-center">
                    <strong className="text-purple-700 dark:text-purple-400">Running</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Currently executing on a CPU.</p>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg text-center">
                    <strong className="text-amber-700 dark:text-amber-400">Waiting</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Waiting for an event (e.g., I/O operation).</p>
                  </div>
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg text-center">
                    <strong className="text-red-700 dark:text-red-400">Terminated</strong>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Finished execution.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Management in Windows and Linux */}
            <div
              ref={(el) => {
                sectionRefs.current['windows-linux'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Management in Windows and Linux
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <BoxIcon size={16} /> Windows
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Task Manager: Visualizes running processes, CPU usage, memory usage, and network activity.</li>
                    <li>Command Prompt: Uses commands like <code>tasklist</code>, <code>taskkill</code>, and <code>start</code>.</li>
                    <li>PowerShell: A more powerful command-line interface for advanced process management tasks.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Terminal size={16} /> Linux
                  </h3>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Terminal: Uses commands like <code>ps</code>, <code>top</code>, <code>kill</code>, and <code>nice</code>.</li>
                    <li>Graphical User Interface (GUI): Provides a visual interface for process management (e.g., GNOME, KDE).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Commonly Used Commands and Tools */}
            <div
              ref={(el) => {
                sectionRefs.current['commands'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Commonly Used Commands and Tools
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><code>ps</code>: Lists running processes.</li>
                    <li><code>top</code>: Displays real-time system information, including process usage.</li>
                    <li><code>kill</code>: Terminates a process.</li>
                    <li><code>nice</code>: Changes a process's priority.</li>
                    <li><code>renice</code>: Changes the priority of running processes.</li>
                  </ul>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><code>tasklist</code>: Lists running processes in Windows.</li>
                    <li><code>taskkill</code>: Terminates a process in Windows.</li>
                    <li>Task Manager: Visualizes and manages processes in Windows.</li>
                    <li>Activity Monitor: Visualizes and manages processes in macOS.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CPU Scheduling */}
            <div
              ref={(el) => {
                sectionRefs.current['cpu-scheduling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                CPU Scheduling
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  CPU scheduling is the process of determining which process should be executed next on a CPU.
                  The goal is to optimize resource utilization and system performance.
                </p>

                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-4">Types of Scheduling</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Long-term scheduling:</span> Determines which processes are admitted into the system.</li>
                  <li><span className="font-bold">Short-term scheduling:</span> Selects the next process to be executed by the CPU.</li>
                  <li><span className="font-bold">Medium-term scheduling:</span> Swaps out processes to secondary storage to free up memory.</li>
                </ul>

                <h3 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 mt-4">Process Scheduling Algorithms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong>First-Come, First-Served (FCFS):</strong> Processes are executed in the order they arrive in the ready queue.
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong>Shortest Job First (SJF):</strong> The process with the shortest estimated burst time is executed first.
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong>Priority Scheduling:</strong> Processes are assigned priorities, and the highest-priority process is executed first.
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong>Round Robin:</strong> Each process is allocated a fixed time slice.
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong>Shortest Remaining Time First (SRTF):</strong> Similar to SJF but considers the remaining burst time of processes.
                  </div>
                </div>
              </div>
            </div>

            {/* Inter-Process Communication (IPC) */}
            <div
              ref={(el) => {
                sectionRefs.current['ipc'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Inter-Process Communication (IPC)
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Inter-process communication (IPC) is a mechanism that allows different processes to communicate and synchronize their activities.
                </p>
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 mt-4">Common IPC Mechanisms:</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Pipes:</span> A unidirectional communication channel that allows data to flow from one process to another.</li>
                  <li><span className="font-bold">Message Queues:</span> A queue of messages that can be accessed by multiple processes.</li>
                  <li><span className="font-bold">Shared Memory:</span> A block of memory that can be accessed by multiple processes.</li>
                  <li><span className="font-bold">Semaphores:</span> A synchronization mechanism that controls access to shared resources.</li>
                  <li><span className="font-bold">Sockets:</span> A network programming interface that allows processes to communicate over a network.</li>
                </ul>
              </div>
            </div>

            {/* Process Synchronization */}
            <div
              ref={(el) => {
                sectionRefs.current['synchronization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Process Synchronization
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Process synchronization is the coordination of multiple processes or threads that access shared resources to ensure data consistency and prevent race conditions.
                </p>

                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-4">Types of Process Synchronization</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Mutual Exclusion:</span> Ensures that only one process can access a shared resource at a time.</li>
                  <li><span className="font-bold">Cooperation:</span> Involves coordination among processes to achieve a common goal.</li>
                </ul>

                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-4">Critical Section</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A critical section is a code segment that accesses shared resources. It's crucial to ensure that only one process enters the critical section at a time to avoid race conditions.
                </p>

                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-4">Synchronization Mechanisms</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Semaphores:</span> A semaphore is an integer variable that can be accessed only through two atomic operations: wait and signal.</li>
                  <li><span className="font-bold">Mutexes:</span> A mutex (mutual exclusion) is a synchronization primitive that allows only one thread to access a shared resource at a time.</li>
                  <li><span className="font-bold">Monitors:</span> A high-level synchronization construct that encapsulates shared data and the procedures that operate on it.</li>
                  <li><span className="font-bold">Spinlocks:</span> A low-level synchronization primitive that continuously checks a lock variable until it becomes available.</li>
                </ul>
              </div>
            </div>

            {/* Deadlock in Operating Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['deadlock'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deadlock in Operating Systems
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Deadlock is a situation in which two or more processes are blocked indefinitely, waiting for each other to release resources. This can occur when processes compete for shared resources and the system fails to allocate resources in a way that prevents circular waiting.
                </p>

                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mt-4">Conditions for Deadlock</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Four necessary conditions must hold:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Mutual Exclusion:</span> At least one resource must be held in a non-sharable mode.</li>
                  <li><span className="font-bold">Hold and Wait:</span> A process holds at least one resource and is waiting to acquire additional resources held by others.</li>
                  <li><span className="font-bold">No Preemption:</span> Resources cannot be forcibly taken away from a process holding them.</li>
                  <li><span className="font-bold">Circular Wait:</span> A circular chain of two or more processes exists.</li>
                </ul>

                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mt-4">Strategies for Handling Deadlock</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-red-700 dark:text-red-400">Deadlock Prevention:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Resource Ordering</li>
                      <li>Resource Allocation Policies</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-red-700 dark:text-red-400">Deadlock Avoidance:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Banker's Algorithm</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-red-700 dark:text-red-400">Deadlock Detection:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Resource Allocation Graph</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                    <strong className="text-red-700 dark:text-red-400">Deadlock Recovery:</strong>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Process Termination</li>
                      <li>Resource Preemption</li>
                    </ul>
                  </div>
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
                  💡 Process Insight
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
                  <span>Key Concepts</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Scheduling Algos</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Process management is the heart of an OS. Master the lifecycle,
                scheduling algorithms, IPC, synchronization, and deadlock handling.
                These topics are fundamental for any system-level programming interview
                or exam.
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
                <strong className="text-white">Process</strong> – an instance of a program in execution,
                with its own PCB, program counter, and registers.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">CPU Scheduling</strong> – algorithms like FCFS, SJF,
                Priority, Round Robin, and SRTF determine which process runs next.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">IPC</strong> – mechanisms like pipes, message queues,
                shared memory, and semaphores enable process communication.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Synchronization</strong> – ensures data consistency
                using mutexes, semaphores, monitors, and spinlocks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Deadlock</strong> – occurs when four conditions
                (Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait) are met.
                Prevention, avoidance, detection, and recovery are key strategies.
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
            Sidemann Academic Registry • Operating Systems – Process Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;