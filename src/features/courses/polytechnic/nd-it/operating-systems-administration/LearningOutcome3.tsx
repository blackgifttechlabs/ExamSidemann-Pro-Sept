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
  Layers,
  Box,
  Terminal,
  GitBranch,
  Database,
  AlertTriangle,
  FileText,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  Table,
  Settings,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'memory-management', label: 'Memory Mgmt' },
  { id: 'swapping', label: 'Swapping' },
  { id: 'allocation', label: 'Allocation' },
  { id: 'paging', label: 'Paging' },
  { id: 'fragmentation', label: 'Fragmentation' },
  { id: 'segmentation', label: 'Segmentation' },
  { id: 'swapping-vs-paging', label: 'Swapping vs Paging' },
  { id: 'segmentation-vs-paging', label: 'Seg vs Paging' },
  { id: 'fragmentation-performance', label: 'Frag & Perf' },
  { id: 'virtual-memory', label: 'Virtual Memory' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'Virtual memory allows a computer to use more memory than physically available by using disk space as an extension of RAM. This is why your computer can run large applications even with limited RAM.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding paging and segmentation is crucial for system design. Paging offers fixed-size blocks and eliminates external fragmentation, while segmentation provides logical grouping but can suffer from external fragmentation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Paging divides memory into fixed-size pages (like a grid), while segmentation divides memory into logical segments (like chapters in a book).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse swapping with paging. Swapping moves entire processes in and out of memory, while paging moves fixed-size pages. Swapping is coarser and more expensive.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Virtual memory allows a computer to use more memory than physically available by using disk space as an extension of RAM. This is why your computer can run large applications even with limited RAM.',
      },
      {
        title: 'Pro Tip',
        text: 'Understanding paging and segmentation is crucial for system design. Paging offers fixed-size blocks and eliminates external fragmentation, while segmentation provides logical grouping but can suffer from external fragmentation.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the difference: Paging divides memory into fixed-size pages (like a grid), while segmentation divides memory into logical segments (like chapters in a book).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse swapping with paging. Swapping moves entire processes in and out of memory, while paging moves fixed-size pages. Swapping is coarser and more expensive.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <MemoryStick size={14} className="inline mr-1" /> LEARNING OUTCOME 3
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Memory Management &{' '}
            <span className="text-purple-300 font-bold italic">
              Virtual Memory
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master memory allocation, paging, segmentation, swapping, virtual memory, fragmentation, and thrashing.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <MemoryStick size={14} className="inline mr-1" /> Memory Allocation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layers size={14} className="inline mr-1" /> Paging &amp; Segmentation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <HardDrive size={14} className="inline mr-1" /> Virtual Memory
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
                placeholder="Search for a concept, paging, fragmentation..."
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
            {/* Memory Management */}
            <div
              ref={(el) => {
                sectionRefs.current['memory-management'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Memory Management
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Memory management is the process of allocating and deallocating memory to various programs and processes. It ensures efficient utilization of memory resources, preventing conflicts and maximizing system performance.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Importance of Memory Management</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Efficient Resource Utilization:</strong> Proper memory management ensures that memory is allocated to processes as needed and reclaimed when no longer required.</li>
                  <li><strong>Process Isolation:</strong> Memory management isolates processes from each other, preventing one process from interfering with the memory of another.</li>
                  <li><strong>Security:</strong> It helps protect sensitive information by controlling access to memory regions.</li>
                  <li><strong>Performance:</strong> Efficient memory management can significantly improve system performance by reducing memory access time and minimizing page faults.</li>
                  <li><strong>Stability:</strong> It helps prevent system crashes by avoiding memory leaks and other memory-related issues.</li>
                  <li><strong>Flexibility:</strong> Memory management allows for dynamic allocation and deallocation of memory, enabling flexible and efficient use of resources.</li>
                  <li><strong>Multitasking:</strong> It enables multiple processes to run concurrently by allocating and managing memory for each process.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Memory Management Techniques</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Fixed Partitioning:</strong> Memory is divided into fixed-size partitions. Each partition can hold only one process at a time.</li>
                  <li><strong>Dynamic Partitioning:</strong> Memory is allocated to processes as needed, creating partitions of various sizes.</li>
                  <li><strong>Paging:</strong> Memory is divided into fixed-size pages, and processes are divided into equal-sized segments. Pages are loaded into physical memory as needed.</li>
                  <li><strong>Segmentation:</strong> Memory is divided into variable-sized segments, and processes are divided into logical segments. Segments are loaded into physical memory as needed.</li>
                  <li><strong>Virtual Memory:</strong> An illusion of a larger memory space than physically available. It combines paging and segmentation techniques to efficiently manage memory.</li>
                </ul>
              </div>
            </div>

            {/* Memory Swapping */}
            <div
              ref={(el) => {
                sectionRefs.current['swapping'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Memory Swapping
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Memory swapping, also known as paging or swapping, is a memory management technique used by operating systems to temporarily move inactive processes or parts of processes from main memory (RAM) to secondary storage (like a hard disk) to free up physical memory for active processes.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Benefits of Memory Swapping</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Increased Physical Memory:</strong> By moving inactive processes to secondary storage, more physical memory becomes available for active processes.</li>
                  <li><strong>Enhanced Multitasking:</strong> Memory swapping allows the system to run more processes concurrently than would be possible with the physical memory alone.</li>
                  <li><strong>Efficient Resource Utilization:</strong> By dynamically allocating and deallocating memory, memory swapping helps optimize resource utilization.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-teal-600 dark:text-teal-400">Process of Memory Swapping</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Process Selection:</strong> The operating system selects a process to be swapped out, typically based on factors like memory usage, priority, and recent activity.</li>
                  <li><strong>Page Table Update:</strong> The operating system updates the page table of the selected process to indicate that the pages have been swapped out to secondary storage.</li>
                  <li><strong>Page Transfer:</strong> The pages of the selected process are transferred from main memory to secondary storage.</li>
                  <li><strong>Frame Allocation:</strong> The freed memory frames are allocated to other processes that require additional memory.</li>
                  <li><strong>Page Fault:</strong> When a process attempts to access a page that has been swapped out, a page fault occurs.</li>
                  <li><strong>Page Retrieval:</strong> The operating system retrieves the required page from secondary storage and loads it into a free memory frame.</li>
                  <li><strong>Page Table Update:</strong> The page table of the process is updated to reflect the new location of the page in main memory.</li>
                  <li><strong>Process Resumption:</strong> The process can now continue its execution, accessing the required page from main memory.</li>
                </ul>
              </div>
            </div>

            {/* Memory Allocation */}
            <div
              ref={(el) => {
                sectionRefs.current['allocation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Memory Allocation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Memory allocation is the process of assigning memory space to programs and data structures during program execution. It ensures that processes have the necessary memory to operate correctly and efficiently.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">Memory Allocation Techniques</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Static Memory Allocation:</strong> Memory is allocated at compile time. The size of memory blocks is fixed and known in advance. Simple to implement but less flexible.</li>
                  <li><strong>Stack Memory Allocation:</strong> Memory is allocated on a stack data structure. Functions allocate memory for local variables when they are called. Memory is automatically deallocated when the function returns. Efficient but limited in size.</li>
                  <li><strong>Heap Memory Allocation:</strong> Memory is allocated dynamically at runtime using functions like malloc or new. More flexible but requires manual memory management.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">Memory Allocation Strategies</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>First-Fit:</strong> Searches the free memory list for the first block that is large enough.</li>
                  <li><strong>Best-Fit:</strong> Searches for the smallest block that is large enough.</li>
                  <li><strong>Worst-Fit:</strong> Allocates the largest block.</li>
                  <li><strong>Buddy System:</strong> Divides memory into blocks of equal size and splits when necessary.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Memory Deallocation</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Releasing memory that is no longer needed to avoid memory leaks.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Memory Management Considerations</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Fragmentation:</strong> Over time, memory allocation can lead to fragmentation, where small blocks of free memory are scattered.</li>
                  <li><strong>Memory Leaks:</strong> Failure to deallocate memory can lead to memory leaks.</li>
                  <li><strong>Performance:</strong> The choice of memory allocation technique can impact system performance.</li>
                </ul>
              </div>
            </div>

            {/* Memory Paging */}
            <div
              ref={(el) => {
                sectionRefs.current['paging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Memory Paging
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Memory paging is a memory management technique where physical memory is divided into fixed-size blocks called frames, and logical memory is divided into equal-sized blocks called pages. When a process needs to access a particular memory location, the operating system translates the logical address into a physical address. If the required page is not present in physical memory (a page fault occurs), the operating system loads the page from secondary storage (like a hard disk) into a free frame.
                </p>
              </div>
            </div>

            {/* Memory Fragmentation */}
            <div
              ref={(el) => {
                sectionRefs.current['fragmentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Memory Fragmentation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Memory fragmentation occurs when memory is allocated and deallocated in a way that leaves small, unusable blocks of memory scattered throughout the memory space. This can significantly impact system performance.
                </p>
                <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Internal fragmentation:</strong> This occurs when a process is allocated a larger block of memory than it actually needs. The unused portion of the block is wasted.</li>
                  <li><strong>External fragmentation:</strong> This occurs when there is enough free memory to satisfy a request but it is not contiguous. The free memory is fragmented into small, non-contiguous blocks.</li>
                </ul>
              </div>
            </div>

            {/* Memory Segmentation */}
            <div
              ref={(el) => {
                sectionRefs.current['segmentation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Memory Segmentation
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Memory segmentation is a memory management technique that divides memory into variable-sized segments, each containing a specific logical unit of a program. These segments can be of different sizes and can be loaded into non-contiguous physical memory locations.
                </p>
              </div>
            </div>

            {/* Swapping vs Paging Table */}
            <div
              ref={(el) => {
                sectionRefs.current['swapping-vs-paging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Swapping vs. Paging
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Swapping</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { feature: "Basic Unit", swapping: "Entire process", paging: "Fixed-size pages" },
                      { feature: "Memory Allocation", swapping: "Contiguous blocks of memory", paging: "Non-contiguous pages" },
                      { feature: "Page Table", swapping: "Not required", paging: "Required for address translation" },
                      { feature: "Performance Overhead", swapping: "Higher overhead due to larger data transfers", paging: "Lower overhead due to smaller data transfers" },
                      { feature: "Memory Utilization", swapping: "Less efficient, as entire processes are swapped", paging: "More efficient, as only the necessary pages are swapped" },
                      { feature: "Fragmentation", swapping: "External fragmentation", paging: "Internal fragmentation" },
                      { feature: "Complexity", swapping: "Simpler to implement", paging: "More complex to implement" }
                    ].map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.swapping}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.paging}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Segmentation vs Paging Table */}
            <div
              ref={(el) => {
                sectionRefs.current['segmentation-vs-paging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Segmentation vs. Paging
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Feature</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Segmentation</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Paging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[
                      { feature: "Memory Division", seg: "Variable-sized segments", pag: "Fixed-size pages" },
                      { feature: "Address Translation", seg: "Segment table and page table", pag: "Page table only" },
                      { feature: "Memory Allocation", seg: "Contiguous or non-contiguous", pag: "Non-contiguous" },
                      { feature: "Fragmentation", seg: "External fragmentation", pag: "Internal fragmentation" },
                      { feature: "Flexibility", seg: "More flexible for program structure", pag: "Less flexible for program structure" },
                      { feature: "Performance", seg: "Can be less efficient due to larger page table", pag: "More efficient due to smaller page table" }
                    ].map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300">{item.feature}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.seg}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.pag}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fragmentation and System Performance */}
            <div
              ref={(el) => {
                sectionRefs.current['fragmentation-performance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Fragmentation and System Performance
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Fragmentation can significantly impact system performance in the following ways:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Increased memory access time:</strong> When memory is fragmented, the operating system may need to search through multiple non-contiguous memory blocks to find the required data, increasing access time.</li>
                  <li><strong>Reduced memory utilization:</strong> Fragmentation can lead to wasted memory, as small, non-contiguous blocks of memory may not be usable for larger processes.</li>
                  <li><strong>Increased overhead:</strong> The operating system may need to spend more time managing fragmented memory, reducing system responsiveness.</li>
                </ul>
              </div>
            </div>

            {/* Virtual Memory */}
            <div
              ref={(el) => {
                sectionRefs.current['virtual-memory'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Virtual Memory
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Virtual memory is a memory management technique that gives an application the illusion of having more memory than is physically available. It achieves this by storing parts of a program in secondary storage (like a hard disk) and swapping them into physical memory as needed.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Demand Paging</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Demand paging loads pages into physical memory only when they are needed, reducing the amount of physical memory required.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-green-600 dark:text-green-400">Page Swapping</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Page swapping moves pages between physical memory and secondary storage. When a page fault occurs, the operating system selects a page to be swapped out and loads the required page into the freed frame.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Thrashing</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Thrashing occurs when the system spends more time swapping pages between physical memory and secondary storage than executing processes. This can significantly degrade system performance.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">To avoid thrashing, the operating system can use:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Page Replacement Algorithms:</strong> FIFO, LRU, Optimal.</li>
                  <li><strong>Increasing Physical Memory:</strong> Adding more RAM.</li>
                  <li><strong>Reducing the Degree of Multiprogramming:</strong> Running fewer processes concurrently.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Memory Insight
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
                  <span>Key Techniques</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Comparison Tables</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">2</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Memory management is critical for system performance and stability.
                Understand the trade-offs between paging, segmentation, and swapping.
                Know how fragmentation affects memory utilization and how virtual
                memory extends physical memory. These concepts are fundamental in
                operating systems and computer architecture.
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
                <strong className="text-white">Memory Management</strong> – allocates and deallocates memory, ensuring efficient utilization, isolation, and security.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Swapping</strong> – moves entire processes between RAM and disk to free up memory; has high overhead.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Paging</strong> – divides memory into fixed-size pages, reduces external fragmentation, uses page tables.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Segmentation</strong> – divides memory into logical segments, provides flexibility but can cause external fragmentation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Virtual Memory</strong> – extends physical memory using disk space; uses demand paging and page swapping; thrashing occurs when swapping dominates execution.
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
            Sidemann Academic Registry • Operating Systems – Memory Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;