import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Download,
  Maximize2,
  X,
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
  Smartphone,
  Server,
  Briefcase,
  Calculator,
  Globe,
  Layout,
  RefreshCw,
  Users,
  ClipboardList,
  Search,
  ChevronUp,
  Trophy,
  Target,
  GraduationCap,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// INTERACTIVE IMAGE COMPONENT (unchanged, preserved)
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
        className="relative group cursor-pointer inline-block overflow-hidden bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-lg w-full rounded-xl"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105 max-h-[300px] mx-auto p-4"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
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
          <img src={src} alt={alt} className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-pop-bounce bg-white p-4 rounded" />
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
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'system-software', label: 'System SW' },
  { id: 'os-functions', label: 'OS Functions' },
  { id: 'application-software', label: 'App SW' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'business', label: 'Business' },
  { id: 'summary', label: 'Summary' },
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
        text: 'The first software "bug" was literally a moth! In 1947, a moth got trapped in a computer relay, causing a malfunction. Grace Hopper coined the term "debugging."',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep your operating system and drivers updated. Updates include security patches that protect your computer from hackers and malware.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the difference: "System Software" runs the computer, "Application Software" runs the tasks you want to do. SS = System, App = Task.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people think "software" and "hardware" are interchangeable. Hardware is physical (the computer itself); software is instructions (programs that run on it).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first software "bug" was literally a moth! In 1947, a moth got trapped in a computer relay, causing a malfunction. Grace Hopper coined the term "debugging."',
      },
      {
        title: 'Pro Tip',
        text: 'Always keep your operating system and drivers updated. Updates include security patches that protect your computer from hackers and malware.',
      },
      {
        title: 'Memory Trick',
        text: 'To remember the difference: "System Software" runs the computer, "Application Software" runs the tasks you want to do. SS = System, App = Task.',
      },
      {
        title: 'Common Mistake',
        text: 'Many people think "software" and "hardware" are interchangeable. Hardware is physical (the computer itself); software is instructions (programs that run on it).',
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Cpu size={14} className="inline mr-1" /> COMPUTER SYSTEMS MAINTENANCE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 4{' '}
            <span className="text-amber-300 font-bold italic">
              The Soul of the Machine
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Explore the invisible intelligence that brings hardware to life.
            Learn about system software, operating systems, application software,
            deployment, and how software powers businesses.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 7 sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              🖥️ Interactive images
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Layout size={14} className="inline mr-1" /> Software focus
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
                placeholder="Search for a software type or concept..."
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
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex items-center gap-3 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                  If the hardware we studied earlier is the "Body" of the
                  computer, then Software is the "Soul" or the "Intelligence."
                </p>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Imagine a high-end smartphone with no apps and no operating
                system—it's just a shiny piece of glass and metal that does
                nothing. Software is what breathes life into the machine,
                allowing it to follow your commands, play your music, and help
                you pass your exams. In this lesson, we will learn how software
                is organized, how it's put into use (deployed), and how it helps
                businesses run smoothly.
              </p>
              <InteractiveImage
                src="https://i.ibb.co/qLR4p32F/Most-Famous-Social-Media-and-Their-Logos.png"
                alt="Social Media and Software Logos"
              />
            </div>

            {/* 1. What is Computer Software? */}
            <div
              ref={(el) => {
                sectionRefs.current['system-software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                What is Computer Software?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                      Definition
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Software is a set of invisible instructions, data, or
                      programs that tell the hardware exactly what to do.
                    </p>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    <strong>Explanation:</strong> You cannot touch software with
                    your hands, but you can see its results on the screen. It is
                    broadly divided into two teams: System Software (the
                    foundation) and Application Software (the tools).
                  </p>
                </div>
                <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-r-xl">
                  <p className="text-sm md:text-base font-bold italic text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>Example:</strong> Think of a Television. The internal
                    circuits that make the TV turn on and show a menu are the
                    "System Software." The specific movie or football match you
                    choose to watch is the "Application."
                  </p>
                </div>
              </div>
            </div>

            {/* 2. System Software */}
            <div
              ref={(el) => {
                sectionRefs.current['os-functions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                System Software: The Foundation
              </h2>
              <div className="p-5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px] block mb-1">
                    Definition
                  </strong>
                  This software manages the computer hardware and provides a
                  platform for other programs to run. Without it, the computer
                  cannot function.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Monitor size={14} /> Operating System (OS)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    The "Boss" of the computer. It manages the CPU, memory, and
                    files.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic">
                    Examples: Windows 11, Android, macOS.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <RefreshCw size={14} /> Device Drivers
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Small "translator" programs. They help the OS talk to
                    hardware like printers.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic">
                    Example: Installing a driver for a new printer.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} /> Utility Software
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    The "Maintenance Crew." They keep the computer healthy.
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic">
                    Example: Antivirus software that cleans up viruses.
                  </p>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-2">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <Database size={14} /> Firmware
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    Permanent software built into the hardware (like the BIOS).
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase italic">
                    Example: The first instructions when you flip the power
                    switch.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Operating System Functions & Types */}
            <div
              ref={(el) => {
                sectionRefs.current['application-software'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Operating System (OS) Functions &amp; Types
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                The OS is the most important software you will ever use. It
                performs four main jobs:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {[
                  {
                    t: "Resource Management",
                    d: "Deciding which app gets to use the CPU or RAM.",
                  },
                  {
                    t: "Process Management",
                    d: "Making sure your music doesn't stop when you open a browser.",
                  },
                  {
                    t: "File Management",
                    d: "Organizing your folders so you can find your files.",
                  },
                  {
                    t: "User Interface (UI)",
                    d: "Giving you icons and buttons to click (GUI).",
                  },
                ].map((job, i) => (
                  <div
                    key={i}
                    className="p-4 bg-indigo-600 text-white text-center flex flex-col justify-center gap-1 rounded-xl shadow-md"
                  >
                    <h5 className="text-[10px] font-bold uppercase tracking-widest">
                      {job.t}
                    </h5>
                    <p className="text-[9px] font-medium opacity-80">{job.d}</p>
                  </div>
                ))}
              </div>

              {/* PC OS */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Monitor size={20} className="text-indigo-500" /> 1. Personal
                  Computers (Desktop &amp; Laptop)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                  Designed for multitasking, complex software, and productivity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <InteractiveImage
                      src="https://i.ibb.co/gFFPWpFd/Windows-rgb-Blue-D.webp"
                      alt="Microsoft Windows"
                    />
                    <p className="text-xs font-bold text-center uppercase tracking-widest text-slate-400">
                      Microsoft Windows: The most widely used desktop OS.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <InteractiveImage
                      src="https://i.ibb.co/Kz5j3rgg/images-q-tbn-ANd9-Gc-Qjd-Zpve5-J-Xe1-T8-IGosgo-Bc-AE6-IJ7y-vbx0-Q-s.jpg"
                      alt="Apple macOS"
                    />
                    <p className="text-xs font-bold text-center uppercase tracking-widest text-slate-400">
                      macOS: Apple’s exclusive OS for Macs.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <InteractiveImage
                      src="https://i.ibb.co/Q3HjPyFq/https-dev-to-uploads-s3-amazonaws-com-uploads-articles-gxlqa8x598fcl888zcnm.webp"
                      alt="Linux Distributions"
                    />
                    <p className="text-xs font-bold text-center uppercase tracking-widest text-slate-400">
                      Linux Distributions: Open-source systems for developers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile OS */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Smartphone size={20} className="text-indigo-500" /> 2. Mobile
                  Devices (Smartphones &amp; Tablets)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                  Optimized for touchscreens, battery efficiency, and app-based
                  usage.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <InteractiveImage
                      src="https://i.ibb.co/mrSY5xcv/android-logo-font1.png"
                      alt="Google Android"
                    />
                    <p className="text-xs font-bold text-center uppercase tracking-widest text-slate-400">
                      Android: Open-source platform by Google.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <InteractiveImage
                      src="https://i.ibb.co/CKrJWYcp/1679993657690-e-2147483647-v-beta-t-1p2nvqe5-I9l46-Fw-MBh5m-GXC5-jggv-ASz1-CRnsc-Asyx8.jpg"
                      alt="Apple iOS"
                    />
                    <p className="text-xs font-bold text-center uppercase tracking-widest text-slate-400">
                      iOS / iPadOS: Apple’s closed-source system.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <InteractiveImage
                      src="https://i.ibb.co/QFHWThM5/images-q-tbn-ANd9-Gc-Srp-Rcg-On-Jhzu-Ilxvum-Mo-TYfb-BGAig-Wsg6-Q-s.jpg"
                      alt="Huawei HarmonyOS"
                    />
                    <p className="text-xs font-bold text-center uppercase tracking-widest text-slate-400">
                      HarmonyOS: Huawei's operating system.
                    </p>
                  </div>
                </div>
              </div>

              {/* Server OS */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                  <Server size={20} className="text-indigo-500" /> 3. Servers
                  &amp; Supercomputers
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                  Systems prioritizing stability, security, and handling
                  thousands of users.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <InteractiveImage
                    src="https://i.ibb.co/xSRgjw6y/rta-Image-eid-ka44u000000o-R0z-feoid-00-N4u000004-LDXp-refid-0-EM4u000009-Auo9.jpg"
                    alt="Linux Server"
                  />
                  <InteractiveImage
                    src="https://i.ibb.co/mrP6GMsR/images-q-tbn-ANd9-Gc-Ti1-VQSVpv0t4-B4-Zl-UVj-Tkk-IPVe3-J8df-Dr-Kw-Q-s.jpg"
                    alt="Debian"
                  />
                  <InteractiveImage
                    src="https://i.ibb.co/BV2bP9C8/images-q-tbn-ANd9-Gc-Sb-XDW-Ji-Bs-Z0y-Rhp-R-0croy-Vh-2h-Ngxq-Scd-A-s.png"
                    alt="CentOS"
                  />
                  <InteractiveImage
                    src="https://i.ibb.co/WNZng9rx/images-q-tbn-ANd9-Gc-SXll-L-a-GM7-Gz-Kb2r-QM8-Xkv7-PPYowm-1-REMw-s.png"
                    alt="Windows Server"
                  />
                  <InteractiveImage
                    src="https://i.ibb.co/9kdTTdpM/Unix-Administration.jpg"
                    alt="UNIX"
                  />
                </div>
              </div>

              {/* Different OS Types */}
              <div className="mt-6 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-700 rounded-xl">
                <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">
                  Different OS for Different Jobs:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      t: "Multitasking OS",
                      d: "Let's you do many things at once (like Windows).",
                    },
                    {
                      t: "Network OS (NOS)",
                      d: "Designed to manage many computers in an office (like Windows Server).",
                    },
                    {
                      t: "Real-Time OS (RTOS)",
                      d: "Used in things that must be perfect and fast, like an airplane's landing system.",
                    },
                    {
                      t: "Mobile OS",
                      d: "Optimized for your phone's battery and touch screen (Android/iOS).",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 p-4 bg-white dark:bg-black/40 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <div className="shrink-0 pt-0.5">
                        <ChevronRight size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-slate-900 dark:text-white">
                          {item.t}
                        </h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {item.d}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-r-xl">
                <p className="text-sm md:text-base font-bold italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Example:</strong> When you use your phone to listen to
                  music while chatting on WhatsApp, the Mobile OS is multitasking
                  and managing the battery so the phone doesn't die.
                </p>
              </div>
            </div>

            {/* 4. Application Software */}
            <div
              ref={(el) => {
                sectionRefs.current['deployment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Application Software: The Tools
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-blue-600 dark:text-blue-400 uppercase tracking-widest text-[10px] block mb-1">
                  Definition
                </strong>
                Programs designed to help the user perform specific tasks.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Word Processing
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    For typing letters/essays (e.g., Microsoft Word).
                  </p>
                  <div className="flex gap-3">
                    <InteractiveImage
                      src="https://i.ibb.co/nNKtnQxg/Word.jpg"
                      alt="MS Word"
                    />
                    <InteractiveImage
                      src="https://i.ibb.co/DNx4R08/logo-lockup-docs-icon-vertical-ela.png"
                      alt="Google Docs"
                    />
                  </div>
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Spreadsheets
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    For math and budgets (e.g., Microsoft Excel).
                  </p>
                  <InteractiveImage
                    src="https://i.ibb.co/KcLPmcj7/images-q-tbn-ANd9-Gc-R2a1-R86-GLKd8hg-UQy4-Rxson-TC7-SX5n3-Ep-Ozw-s.jpg"
                    alt="Excel"
                  />
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Databases
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    For storing lists of thousands of students (e.g., Microsoft
                    Access).
                  </p>
                  <InteractiveImage
                    src="https://i.ibb.co/5gNQg8YH/1751320881-1726577729-databases-logos.webp"
                    alt="Databases"
                  />
                </div>
                <div className="p-5 bg-white dark:bg-[#121212] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm space-y-3">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    Web Browsers
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    For surfing the internet (e.g., Google Chrome).
                  </p>
                  <InteractiveImage
                    src="https://i.ibb.co/Jw34gbjD/28-20160303121856-3990381-medium.jpg"
                    alt="Chrome"
                  />
                </div>
              </div>

              <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-r-xl">
                <p className="text-sm md:text-base font-bold italic text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong>Example:</strong> If you want to calculate the total
                  marks for a class of 50 students, you would use a Spreadsheet
                  application because it does the math for you automatically.
                </p>
              </div>
            </div>

            {/* 5. Deploying Software */}
            <div
              ref={(el) => {
                sectionRefs.current['business'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deploying Software (The Launch)
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Deploying software means taking a program and making it ready
                for people to use. It's like opening a new shop—you don't just
                open the door; you have to prepare first.
              </p>

              <div className="space-y-3 mt-4">
                {[
                  {
                    t: "Preparation",
                    d: "Planning how the software will be installed and backing up data so nothing gets lost.",
                  },
                  {
                    t: "Testing",
                    d: "Trying the software in a 'practice' area to find bugs.",
                  },
                  {
                    t: "User Acceptance Testing (UAT)",
                    d: "Asking the real users, 'Does this work the way you need it to?'",
                  },
                  {
                    t: "Deployment",
                    d: "Actually installing it.",
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
                      <h4 className="text-xs font-bold uppercase text-slate-900 dark:text-white tracking-widest">
                        {step.t}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {step.d}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-5 bg-slate-900 text-white rounded-xl text-center">
                <p className="text-sm md:text-base font-bold italic leading-relaxed">
                  <strong>Example:</strong> A school installing a new "Results
                  Management System" on all the teachers' computers at once.
                </p>
              </div>
            </div>

            {/* 6. Software in the Business World */}
            <div
              ref={(el) => {
                sectionRefs.current['summary'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software in the Business World
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Computers aren't just for games; they run the world's businesses!
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Users size={20} className="text-blue-500" /> Management and
                    Human Resources (HR)
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      <strong className="text-blue-600">Recruitment:</strong>{' '}
                      Companies use software to find and hire the best workers.
                    </li>
                    <li className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      <strong className="text-blue-600">Payroll:</strong>{' '}
                      Software that calculates how much money an employee gets at
                      the end of the month after tax.
                    </li>
                  </ul>
                  <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-r-xl">
                    <p className="text-xs font-bold italic text-slate-700 dark:text-slate-300">
                      Example: Using Belina Payroll to ensure every worker gets
                      paid their correct salary on time.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Calculator size={20} className="text-purple-500" /> Accounting
                    Concepts
                  </h3>
                  <ul className="space-y-3">
                    <li className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      <strong className="text-purple-600">The Accounting Cycle:</strong>{' '}
                      An 8-step process of recording every dollar that comes in
                      and goes out.
                    </li>
                    <li className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      <strong className="text-purple-600">Bank Reconciliation:</strong>{' '}
                      Using software to make sure your "Accounting Book" matches
                      your actual bank account.
                    </li>
                    <li className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      <strong className="text-purple-600">Depreciation:</strong>{' '}
                      Tracking how a computer loses value over time.
                    </li>
                  </ul>
                  <div className="p-4 bg-slate-50 dark:bg-black/20 rounded-r-xl">
                    <p className="text-xs font-bold italic text-slate-700 dark:text-slate-300">
                      Example: A shop owner in Harare uses QuickBooks to see if
                      they made a profit or a loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Checklist */}
            <div className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="p-8 bg-slate-900 text-white rounded-xl shadow-2xl">
                <h2 className="text-xl md:text-3xl font-bold uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <ClipboardList size={28} className="text-yellow-500" /> Summary
                  Checklist for Students
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "System Software: The 'Boss' (OS, Drivers).",
                    "Application Software: The 'Tools' (Word, Excel, Games).",
                    "Operating System: Manages the computer's 'brain' and 'muscles'.",
                    "Deployment: Prepare → Test → Install.",
                    "Business Tools: Payroll and Accounting software keep the money flowing correctly.",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <CheckCircle size={18} className="text-green-500 shrink-0" />
                      <span className="text-xs md:text-sm font-bold uppercase tracking-widest">
                        {item}
                      </span>
                    </div>
                  ))}
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
                  💡 Software Tip
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
                  <span>Software Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Interactive Images</span>
                  <span className="font-bold text-green-600 dark:text-green-400">8+</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Software is the invisible force that makes hardware useful.
                Without system software, the computer won't run. Without
                application software, you can't do anything with it.
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
                <strong className="text-white">Software Definition:</strong> Set
                of instructions that tells hardware what to do. It's the
                "Intelligence" of the machine.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">System Software:</strong> The
                foundation – OS, Drivers, Utilities, Firmware. Without it, the
                computer cannot function.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Application Software:</strong> The
                tools – Word Processing, Spreadsheets, Databases, Browsers. They
                help you do specific tasks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">OS Functions:</strong> Resource
                Management, Process Management, File Management, User Interface.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Business Software:</strong>{' '}
                Payroll, Accounting, and HR software power companies and keep
                money flowing correctly.
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

export default LearningOutcome4;
