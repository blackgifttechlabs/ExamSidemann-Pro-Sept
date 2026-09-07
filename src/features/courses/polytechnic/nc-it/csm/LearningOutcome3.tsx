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
  Monitor,
  Disc,
  Tablet,
  ChevronRight,
  Terminal,
  Search,
  X,
  ChevronUp,
  RefreshCw,
  Trophy,
  Target,
  GraduationCap,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE IMAGE COMPONENT (unchanged, kept as-is)
// ──────────────────────────────────────────────────────────────────────────────
interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

const InteractiveImage: React.FC<InteractiveImageProps> = ({ src, alt, className = "" }) => {
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
    <div className={`my-4 ${className}`}>
      <div
        className="relative group cursor-pointer inline-block overflow-hidden bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-lg w-full rounded-xl"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 max-h-[300px] mx-auto"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 dark:bg-black/80 p-2 rounded-full shadow-xl">
            <ChevronUp size={20} className="text-[#003153] dark:text-white rotate-45" />
          </div>
        </div>
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
// DATA: Learning Outcome 3 – Sections for Navigation
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'media', label: 'Storage Media' },
  { id: 'internal-external', label: 'Internal vs External' },
  { id: 'hierarchy', label: 'Memory Hierarchy' },
  { id: 'organization', label: 'File Organization' },
  { id: 'access', label: 'Access Methods' },
  { id: 'choosing', label: 'Choosing Storage' },
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
        text: 'The first hard disk drive was introduced by IBM in 1956. It stored 5MB of data and weighed over a ton!',
      },
      {
        title: 'Pro Tip',
        text: 'For the fastest computer experience, install your operating system on an SSD and use an HDD for storing large files like movies and backups.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: RAM is like a "desk" – you put things on it while you work. Storage is like a "bookshelf" – you keep things there permanently.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people think "storage" and "memory" mean the same thing. Storage (HDD/SSD) is permanent; memory (RAM) is temporary.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first hard disk drive was introduced by IBM in 1956. It stored 5MB of data and weighed over a ton!',
      },
      {
        title: 'Pro Tip',
        text: 'For the fastest computer experience, install your operating system on an SSD and use an HDD for storing large files like movies and backups.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember: RAM is like a "desk" – you put things on it while you work. Storage is like a "bookshelf" – you keep things there permanently.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people think "storage" and "memory" mean the same thing. Storage (HDD/SSD) is permanent; memory (RAM) is temporary.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> COMPUTER SYSTEMS MAINTENANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              The Memory Bank
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master storage media, memory hierarchy, file organization, and access
            methods. Learn the difference between internal and external memory,
            and how to choose the right storage for every situation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 6 sections
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
                placeholder="Search for a storage type or concept..."
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
                  Have you ever wondered why some computers take five minutes to
                  turn on while others start instantly? Or why your phone
                  suddenly tells you, "Storage Full," just when you're about to
                  take a perfect photo? In this lesson, we are exploring the
                  Computer's Memory Bank.
                </p>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                If the CPU is the "Brain" that thinks, Storage is the "Library"
                where all the books (your photos, music, and apps) are kept.
                Understanding storage is the secret to making your computer fast,
                reliable, and powerful. Let's learn how to choose the right
                "shelves" for your digital library!
              </p>
            </div>

            {/* 1. Storage Media */}
            <div
              ref={(el) => {
                sectionRefs.current['media'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Storage Media: The Physical Devices
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Storage media are the physical things that hold your data. We
                group them by the technology they use to "remember" information.
              </p>

              {/* A. Magnetic */}
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <HardDrive size={22} className="text-indigo-500" /> A. Magnetic
                  Storage (The Hard Drive)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Definition
                      </p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Devices that use magnetic patterns on spinning disks to
                        store data.
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Explanation:</strong> Imagine an old record player.
                      Inside a Hard Disk Drive (HDD), there are circular plates
                      spinning very fast, and a tiny "needle" (the read/write
                      head) moves over them to save or read your files.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      <strong>Example:</strong> Most older desktop computers use
                      an HDD to store huge amounts of data, like 1,000 movies,
                      because it is very cheap for the amount of space you get.
                    </p>
                  </div>
                  <div>
                    <InteractiveImage
                      src="https://i.ibb.co/nqRQ9Hd0/6368e10deff48b70857f8436-500gb-2-5-34-sata-hard-drive-disk.jpg"
                      alt="Hard Disk Drive (HDD) Component"
                    />
                  </div>
                </div>
              </div>

              {/* B. Solid-State */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Zap size={22} className="text-indigo-500" /> B. Solid-State
                  Storage (The Speed King)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Definition
                      </p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Devices that use flash memory chips (electricity) instead
                        of moving parts to store data.
                      </p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong>Explanation:</strong> A Solid-State Drive (SSD) is
                      like a giant version of the memory card in your phone.
                      Because nothing has to "spin," it is incredibly fast.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                      <strong>Example:</strong> If you put your Windows or
                      Android operating system on an SSD, the computer will turn
                      on in seconds instead of minutes.
                    </p>
                  </div>
                  <div>
                    <InteractiveImage
                      src="https://i.ibb.co/Swk1GZPF/ssd-c900an500g-d.jpg"
                      alt="Solid State Drive (SSD) Component"
                    />
                  </div>
                </div>
              </div>

              {/* C. Optical */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Disc size={22} className="text-indigo-500" /> C. Optical
                  Storage (The Laser Discs)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Definition
                      </p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Plastic discs where data is written and read using a
                        laser beam.
                      </p>
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5 font-medium">
                      <li>
                        <strong>CD-ROM:</strong> Holds about 700MB. Good for
                        music.
                      </li>
                      <li>
                        <strong>DVD-ROM:</strong> Holds about 4.7GB. Good for
                        movies.
                      </li>
                      <li>
                        <strong>CD-RW / DVD-RW:</strong> The "RW" stands for
                        Re-Writable. You can erase them and use them again.
                      </li>
                      <li>
                        <strong>Blu-ray:</strong> The biggest of all, used for
                        High-Definition (HD) movies.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <InteractiveImage
                      src="https://i.ibb.co/yBcwhXPV/cd-3d3431794411979618825.jpg"
                      alt="Optical Disc Media"
                    />
                  </div>
                </div>
              </div>

              {/* D. Flash Memory */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Tablet size={22} className="text-indigo-500" /> D. Flash
                  Memory (The Portable Choice)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                        Definition
                      </p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Small, portable storage that can be electronically erased
                        and rewritten.
                      </p>
                    </div>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-5 font-medium">
                      <li>
                        <strong>USB Flash Drive:</strong> Also called a "Thumb
                        Drive" or "Memory Stick."
                      </li>
                      <li>
                        <strong>Memory Card (SD/microSD):</strong> The tiny chips
                        used in cameras and smartphones.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <InteractiveImage
                      src="https://i.ibb.co/3YhKykKN/20240708-44133fe2f67746adbfc0565141094321.webp"
                      alt="Flash Memory Storage Devices"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Internal vs External */}
            <div
              ref={(el) => {
                sectionRefs.current['internal-external'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Internal vs. External Memory
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                It is very important to know the difference between the memory
                the computer needs to run and the memory you use to save files.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    Internal Memory (RAM/Main Memory)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    This is inside the computer. It is Volatile (it forgets
                    everything when the power is cut). It is used for the work
                    you are doing right now.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    External Memory (Secondary Storage)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-2">
                    This is Non-Volatile (it remembers forever). This includes
                    your HDD, SSD, and USB sticks. It is for long-term storage.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl">
                <p className="text-sm md:text-base font-bold italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Example:</strong> Think of RAM as your open notebook on
                  your lap while you study. Think of External Memory as the big
                  bookshelf in your room where you put the notebook when you are
                  finished.
                </p>
              </div>

              {/* Comparison Table */}
              <div className="mt-6 overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#121212] shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
                  <div className="flex flex-col">
                    <div className="bg-indigo-600 text-white p-4 text-center">
                      <h4 className="text-base font-bold uppercase tracking-widest">
                        External Memory (HDD, SSD)
                      </h4>
                    </div>
                    <div className="p-4 space-y-4 flex-1">
                      <InteractiveImage
                        src="https://i.ibb.co/nqRQ9Hd0/6368e10deff48b70857f8436-500gb-2-5-34-sata-hard-drive-disk.jpg"
                        alt="HDD"
                        className="!my-0"
                      />
                      <InteractiveImage
                        src="https://i.ibb.co/Swk1GZPF/ssd-c900an500g-d.jpg"
                        alt="SSD"
                        className="!my-0"
                      />
                      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest pt-2">
                        Secondary Storage Devices
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-purple-600 text-white p-4 text-center">
                      <h4 className="text-base font-bold uppercase tracking-widest">
                        Internal Memory (RAM)
                      </h4>
                    </div>
                    <div className="p-4 space-y-4 flex-1">
                      <InteractiveImage
                        src="https://i.ibb.co/Kj50h09q/ram.png"
                        alt="RAM"
                        className="!my-0"
                      />
                      <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest pt-2">
                        Primary Memory Module
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Memory Hierarchy */}
            <div
              ref={(el) => {
                sectionRefs.current['hierarchy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                The Computer Memory Hierarchy
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Not all memory is created equal. Some are fast but expensive;
                others are slow but huge. We organize them in a Pyramid.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  {[
                    {
                      t: "Registers (Top)",
                      c: "Inside the CPU. Fastest and most expensive. Holds almost nothing.",
                      color: "text-orange-500",
                    },
                    {
                      t: "Cache",
                      c: "Very fast, sits next to the CPU.",
                      color: "text-orange-400",
                    },
                    {
                      t: "Main Memory (RAM)",
                      c: "The 'Work Desk.'",
                      color: "text-yellow-500",
                    },
                    {
                      t: "Secondary Storage (Bottom)",
                      c: "HDDs and SSDs. Slowest but holds everything.",
                      color: "text-blue-500",
                    },
                  ].map((level, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                    >
                      <div className="shrink-0 pt-0.5">
                        <ChevronRight className={level.color} size={18} />
                      </div>
                      <div>
                        <h4 className={`font-bold uppercase text-xs ${level.color} tracking-widest`}>
                          {level.t}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {level.c}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <InteractiveImage
                    src="https://i.ibb.co/5hYr0XvK/hierachy.png"
                    alt="Computer Memory Hierarchy Pyramid"
                  />
                </div>
              </div>
            </div>

            {/* 4. File Organization */}
            <div
              ref={(el) => {
                sectionRefs.current['organization'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                File Organization: How we arrange the "Books"
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                How does the computer find one specific photo among 10,000
                others? It uses "File Organization."
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Sequential
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1 italic">
                    Files are stored one after another. To find the last file,
                    you must pass all the others. (Like a cassette tape).
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Indexed Sequential (ISAM)
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1 italic">
                    Like a book with a Table of Contents. You look at the index
                    first, then jump to the right page.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Direct (Random) Organization
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1 italic">
                    Every file has a specific "address." You can go straight to
                    it without looking at anything else.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Hashing
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mt-1 italic">
                    A math formula calculates exactly where the file should be
                    kept. It is the fastest way to find a file in a huge list.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. File Access Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['access'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                File Access Methods: How we get the data
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-sm font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">
                    Sequential Access
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                    You must start at the beginning and read through everything.
                  </p>
                  <div className="mt-2 p-2 bg-white/40 dark:bg-black/20 text-xs font-bold italic uppercase opacity-60 rounded">
                    Example: Playing a song on an old cassette tape.
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-sm font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">
                    Direct Access
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                    You can jump to any part of the file instantly.
                  </p>
                  <div className="mt-2 p-2 bg-white/40 dark:bg-black/20 text-xs font-bold italic uppercase opacity-60 rounded">
                    Example: Jumping to minute 50 of a movie on a DVD or Netflix.
                  </div>
                </div>

                <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <h4 className="text-sm font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">
                    Indexed Access
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1">
                    You look at a "Map" (the Index) to see where the data is,
                    then use Direct Access to get there.
                  </p>
                </div>
              </div>
            </div>

            {/* 6. Choosing Storage */}
            <div
              ref={(el) => {
                sectionRefs.current['choosing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                How to Choose the Best Storage (Criteria)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                When you go to a computer shop in town, use these rules to pick
                your storage:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                {[
                  {
                    t: "Capacity",
                    d: "Do you need a lot of space? Choose HDD.",
                  },
                  {
                    t: "Speed",
                    d: "Do you want the computer to be fast? Choose SSD.",
                  },
                  {
                    t: "Portability",
                    d: "Do you need to carry files to school? Choose USB Flash.",
                  },
                  {
                    t: "Cost",
                    d: "Are you on a tight budget? Choose HDD.",
                  },
                  {
                    t: "Durability",
                    d: "Do you travel a lot? Choose SSD.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-center hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <h5 className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                      {item.t}
                    </h5>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1">
                      {item.d}
                    </p>
                  </div>
                ))}
              </div>

              {/* Summary Table */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3 mb-4">
                  <BookOpen size={22} className="text-indigo-500" /> Summary
                  Table for Students
                </h3>
                <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Media
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Best For...
                        </th>
                        <th className="p-3 font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest text-[10px]">
                          Why?
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                          HDD
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Backups &amp; Movies
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium italic">
                          Cheap and holds a lot.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                          SSD
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Windows &amp; Apps
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium italic">
                          Very fast and makes the PC smooth.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                          Flash
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Moving Files
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium italic">
                          Small and fits in your pocket.
                        </td>
                      </tr>
                      <tr className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/5 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white uppercase">
                          Optical
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          Software/Movies
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400 font-medium italic">
                          Good for permanent, cheap physical copies.
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
                  💡 Storage Tip
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
                  <span>Storage Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Interactive Images</span>
                  <span className="font-bold text-green-600 dark:text-green-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Choosing the right storage depends on what you need: speed
                (SSD), capacity (HDD), portability (Flash), or durability (SSD).
                Always match the storage to the task.
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
                <strong className="text-white">Storage Media:</strong> Magnetic
                (HDD), Solid‑State (SSD), Optical (CD/DVD/Blu‑ray), Flash (USB,
                SD cards).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Internal vs External:</strong>{' '}
                Internal (RAM) is volatile and temporary; External (HDD/SSD) is
                non‑volatile and permanent.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Memory Hierarchy:</strong> Registers
                → Cache → RAM → Secondary Storage – from fastest/expensive to
                slowest/cheap.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">File Organization:</strong> Sequential,
                Indexed, Direct, Hashing – different ways to arrange and find
                files.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Choosing Storage:</strong> Consider
                Capacity, Speed, Portability, Cost, and Durability.
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

export default LearningOutcome3;
