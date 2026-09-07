import React, { useState, useEffect, useRef } from 'react';
import { HighlightedCode } from './CodeHighlighter';
import { useLessonState } from '../../../lessonProgress';
import {
  ShieldCheck,
  BookOpen,
  Terminal,
  Code2,
  Layers,
  Cpu,
  Search,
  ClipboardList,
  Info,
  ArrowRight,
  Download,
  RefreshCw,
  HelpCircle,
  CheckCircle,
  Rocket,
  Brain,
  FileCode,
  Code,
  Database,
  ChevronUp,
  X,
  Sparkles,
  BookMarked,
  Target,
  Users,
  Scale,
  AlertTriangle,
  Globe,
  Swords,
  HeartHandshake,
  Flag,
  Box,
  Workflow,
  ListChecks,
  LayoutGrid,
  Server,
  Repeat,
  Zap,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// VS CODE TYPING ANIMATION COMPONENT (optional, can keep if needed)
// ──────────────────────────────────────────────────────────────────────────────
const VSCodeTyping: React.FC<{ code: string }> = ({ code }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsTyping(true);
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isTyping) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(code.slice(0, i));
      i++;
      if (i > code.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [isTyping, code]);

  return (
    <div ref={containerRef} className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden shadow-2xl font-mono text-xs md:text-sm my-8">
      <div className="bg-[#252526] px-4 py-2 flex items-center justify-between border-b border-[#333]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          <Terminal size={12} /> example.cpp — Visual Studio Code
        </span>
      </div>
      <div className="p-4 md:p-6 flex gap-4 min-h-[300px]">
        <div className="text-gray-500 text-right select-none border-r border-[#333] pr-4 leading-relaxed opacity-50">
          {code.split('\n').map((_, idx) => (
            <div key={idx}>{idx + 1}</div>
          ))}
        </div>
        <div className="flex-1 text-gray-300 whitespace-pre-wrap leading-relaxed relative">
          <HighlightedCode code={displayedCode} />
          <span className="w-2 h-4 bg-blue-500 absolute inline-block ml-0.5 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'oop-features', label: 'OOP Features' },
  { id: 'software-architecture', label: 'Software Architecture' },
  { id: 'programming-paradigms', label: 'Paradigms' },
  { id: 'justifying-oop', label: 'Justifying OOP' },
  { id: 'methodologies', label: 'Methodologies' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'Object-Oriented Programming (OOP) models real-world entities using objects that encapsulate data and behavior.',
      },
      {
        title: 'Pro Tip',
        text: 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "EIPA" – Encapsulation, Inheritance, Polymorphism, Abstraction – the core features of OOP.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse Abstraction with Encapsulation. Encapsulation is about hiding data; Abstraction is about hiding implementation details.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Object-Oriented Programming (OOP) models real-world entities using objects that encapsulate data and behavior.',
      },
      {
        title: 'Pro Tip',
        text: 'The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember "EIPA" – Encapsulation, Inheritance, Polymorphism, Abstraction – the core features of OOP.',
      },
      {
        title: 'Common Mistake',
        text: 'Do not confuse Abstraction with Encapsulation. Encapsulation is about hiding data; Abstraction is about hiding implementation details.',
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
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30'
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
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 3{' '}
            <span className="text-purple-300 font-bold italic">
              Features of OOP &amp; Paradigms
            </span>
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl leading-relaxed">
            Master the four pillars of Object-Oriented Programming, explore
            software architecture styles, compare programming paradigms, and
            understand software development methodologies.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-purple-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Box size={14} className="inline mr-1" /> OOP
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cpu size={14} className="inline mr-1" /> Architecture
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-purple-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, paradigm, or methodology..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-purple-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-purple-200" />
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
                Introduction to Features of OOP
              </h2>

              <div className="p-4 sm:p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Object-Oriented Programming (OOP) is a programming paradigm
                    that organizes code around objects – which contain data and
                    methods. This learning outcome covers the four pillars of
                    OOP, software architecture, programming paradigms, and
                    methodologies that guide software development.
                  </p>
</div>
            </div>

            {/* OOP Features */}
            <div
              ref={(el) => {
                sectionRefs.current['oop-features'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Features of OOP
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Box size={14} /> Encapsulation
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Bundling data (attributes) and methods that operate on that data within a single unit (class). Promotes data hiding, ensuring data integrity.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Layers size={14} /> Inheritance
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Creating new classes (subclasses) that inherit properties and behaviors from existing classes (parent classes). Promotes code reusability and hierarchy.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <Zap size={14} /> Polymorphism
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ability of objects of different classes to respond to the same method call in different ways. Achieved through method overriding.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ShieldCheck size={14} /> Abstraction
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Providing a simplified view of an object or set of functionalities, hiding underlying implementation details.</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Data Hiding vs Abstraction</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li><span className="font-bold">Data hiding</span> is a specific aspect of encapsulation that restricts direct access to an object's data.</li>
                  <li><span className="font-bold">Abstraction</span> is broader – it includes data hiding but also simplifies the user's view of an object's functionalities.</li>
                </ul>
              </div>
            </div>

            {/* Software Architecture */}
            <div
              ref={(el) => {
                sectionRefs.current['software-architecture'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Software Architecture
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Software architecture refers to the high-level structure of a software system. It defines the overall organization of the system, including components, interfaces, relationships, and constraints.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cpu size={14} /> Components
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">The building blocks of the system, often represented as modules, services, or subsystems.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Workflow size={14} /> Interfaces
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Communication channels between components, defining how they interact and exchange data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ListChecks size={14} /> Relationships
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">How components are connected and how they depend on each other.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck size={14} /> Constraints
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Rules and guidelines that govern the design and development of the system (performance, security, scalability).</p>
                </div>
              </div>

              <div className="p-4 bg-purple-600 text-white rounded-xl mt-4">
                <h4 className="text-sm font-bold">Why Architecture Matters</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Provides a roadmap</li>
                  <li>Promotes modularity</li>
                  <li>Ensures scalability</li>
                  <li>Improves maintainability</li>
                  <li>Reduces risks</li>
                </ul>
              </div>

              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight mt-6">
                Common Architecture Styles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Layers size={14} /> Layered Architecture
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organizes the system into horizontal layers, each with a specific responsibility (presentation, business logic, data access).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Server size={14} /> Microservices Architecture
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Decomposes the system into small, independent services that communicate through APIs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid size={14} /> Client-Server Architecture
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Separates the user interface (client) from the core functionality (server).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap size={14} /> Event-Driven Architecture
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Relies on events to trigger actions and interactions between components.</p>
                </div>
              </div>
            </div>

            {/* Programming Paradigms */}
            <div
              ref={(el) => {
                sectionRefs.current['programming-paradigms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Programming Paradigms
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Imperative Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focuses on providing a sequence of instructions that the computer executes one after another. Like a detailed recipe.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Beginner-friendly</li>
                        <li>Precise control</li>
                        <li>Efficient for low-level</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Scalability issues</li>
                        <li>Error-prone</li>
                        <li>Focus on "how"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Procedural Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Builds on imperative programming by introducing procedures (functions) – reusable blocks of code.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Modular code</li>
                        <li>Reduced redundancy</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Complex dependencies</li>
                        <li>Scattered data</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Object-Oriented Programming (OOP)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organizes code around objects that encapsulate data and methods.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Modular & reusable</li>
                        <li>Data hiding</li>
                        <li>Real-world modeling</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Steeper learning curve</li>
                        <li>Over-engineering risk</li>
                        <li>Performance overhead</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Functional Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Treats computation as evaluating mathematical functions. Emphasizes immutability and avoids side effects.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Immutability (fewer bugs)</li>
                        <li>Parallelization</li>
                        <li>Declarative style</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Learning curve</li>
                        <li>Not ideal for mutable state</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Logic Programming</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focuses on defining relationships and rules to solve problems – specify rules, computer figures out steps.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Declarative approach</li>
                        <li>Elegance for rule-based</li>
                        <li>Logic reasoning</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Limited applicability</li>
                        <li>Debugging challenges</li>
                        <li>Performance issues</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight mt-6">
                Paradigm Comparison Table
              </h3>
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212] mt-2">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-purple-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Paradigm</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Strengths</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Weaknesses</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Examples</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Imperative</td><td className="p-3">Straightforward, precise control</td><td className="p-3">Complex for large projects, error-prone</td><td className="p-3">C, Assembly</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Procedural</td><td className="p-3">Modular, reduces redundancy</td><td className="p-3">Complex dependencies, scattered data</td><td className="p-3">C++, Java (partial)</td></tr>
                    <tr><td className="p-3 font-bold">OOP</td><td className="p-3">Modular, data hiding, real-world modeling</td><td className="p-3">Steeper curve, over-engineering risk</td><td className="p-3">Java, C++, Python</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Functional</td><td className="p-3">Fewer bugs, parallelization, concise</td><td className="p-3">Less intuitive, not ideal for mutable state</td><td className="p-3">Haskell, Scala</td></tr>
                    <tr><td className="p-3 font-bold">Logic</td><td className="p-3">Declarative, rule-based elegance</td><td className="p-3">Limited expressibility, debugging challenges</td><td className="p-3">Prolog, ASP</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Justifying OOP */}
            <div
              ref={(el) => {
                sectionRefs.current['justifying-oop'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Justifying OOP over Other Paradigms
              </h2>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Modular Code and Reusability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organizing code into classes improves maintainability and reusability compared to procedural programming.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Encapsulation and Data Hiding</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Controlled access protects data integrity – a significant advantage over procedural programming where data can be scattered.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Modeling Real-World Entities</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Objects naturally model entities like users, products, or bank accounts – the code more closely resembles the problem domain.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Inheritance and Polymorphism</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Inheritance promotes code reuse; polymorphism enhances maintainability and can simplify complex interactions.</p>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mt-4">
                <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Drawbacks to Consider</h4>
                <ul className="list-disc pl-5 text-sm text-slate-700 dark:text-slate-300 space-y-1">
                  <li>Steeper learning curve</li>
                  <li>Over-engineering for smaller projects</li>
                  <li>Performance overhead from object creation</li>
                </ul>
              </div>
            </div>

            {/* Methodologies */}
            <div
              ref={(el) => {
                sectionRefs.current['methodologies'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Methodologies
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Methodologies provide a structured approach to complete a project – a roadmap outlining steps, practices, and tools to achieve a specific goal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Improved Project Management</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Provides a clear structure for planning, execution, and monitoring.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Enhanced Efficiency</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Streamlines processes, avoids unnecessary work, optimizes workflows.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Increased Predictability</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Helps predict project timelines and resource requirements.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight mt-6">
                Popular Software Development Methodologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ListChecks size={14} /> Waterfall
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sequential approach – each phase (requirements, design, development, testing) completed before the next.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap size={14} /> Agile
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Iterative and incremental – requirements refined and delivered in short sprints.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Repeat size={14} /> Scrum
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Agile framework using sprints, backlog management, and daily stand-ups.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid size={14} /> Kanban
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Visual approach using boards and cards to represent workflow stages, promoting continuous flow.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tight mt-6">
                Categorizing Methodologies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">By Development Lifecycle</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Sequential</span> – linear, step-by-step (Waterfall)</li>
                    <li><span className="font-bold">Iterative/Incremental</span> – broken into smaller iterations (Agile)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">By Project Management Style</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Predictive</span> – upfront planning, well-defined scope (Waterfall)</li>
                    <li><span className="font-bold">Adaptive</span> – acknowledges that requirements may change (Agile)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">By Level of Formality</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Structured</span> – detailed processes (Waterfall)</li>
                    <li><span className="font-bold">Lightweight</span> – flexibility, core practices only (Agile)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">By Project Type</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li><span className="font-bold">Software Development</span> – designed for software (Waterfall, Agile)</li>
                    <li><span className="font-bold">General Project Management</span> – applies to various types (PRINCE2)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exam Tips */}
            <div
              ref={(el) => {
                sectionRefs.current['exam-tips'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Final Exam Tips
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">📌 Know the Four Pillars</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Encapsulation, Inheritance, Polymorphism, Abstraction – be able to define each with an example.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">📌 Compare Paradigms</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know strengths and weaknesses of imperative, procedural, OOP, functional, and logic programming.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">📌 Understand Architecture</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know layered, microservices, client-server, and event-driven architectures with examples.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400">📌 Connect Concepts</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show how OOP features relate to software architecture and methodology choices.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Design it. Build it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-purple-100 dark:border-purple-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  💡 OOP Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-purple-500 dark:text-purple-400" />
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
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>OOP Pillars</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">4</span>
                </li>
                <li className="flex justify-between">
                  <span>Programming Paradigms</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Object-Oriented Programming helps you model real-world problems
                effectively. Understanding the paradigms and methodologies gives
                you the tools to choose the right approach for any project.
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
          className="w-12 h-12 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-purple-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-300 font-bold">•</span>
              <span>
                <strong className="text-white">OOP features</strong> – Encapsulation, Inheritance, Polymorphism, Abstraction – are the foundation of object-oriented design.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 font-bold">•</span>
              <span>
                <strong className="text-white">Software architecture</strong> defines the high-level structure of a system – components, interfaces, relationships, and constraints.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 font-bold">•</span>
              <span>
                <strong className="text-white">Programming paradigms</strong> include imperative, procedural, OOP, functional, and logic – each with strengths and weaknesses.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 font-bold">•</span>
              <span>
                <strong className="text-white">OOP vs other paradigms</strong> – OOP offers modularity, data hiding, and real-world modeling, but has a steeper learning curve.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-300 font-bold">•</span>
              <span>
                <strong className="text-white">Methodologies</strong> like Waterfall, Agile, Scrum, and Kanban provide structured approaches to project management.
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
            Sidemann Academic Registry • NC IT Programming Registry 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
