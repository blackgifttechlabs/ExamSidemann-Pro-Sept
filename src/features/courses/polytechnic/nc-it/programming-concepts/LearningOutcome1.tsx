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
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// VS CODE TYPING ANIMATION COMPONENT (kept as is)
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
          <Terminal size={12} /> main.cpp — Visual Studio Code
        </span>
      </div>
      <div className="p-4 md:p-6 flex gap-4 min-h-[300px]">
        <div className="text-gray-600 text-right select-none border-r border-[#333] pr-4 leading-relaxed">
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
// IMAGE HELPER (kept as is)
// ──────────────────────────────────────────────────────────────────────────────
const RegistryImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const directLink = src.replace('file/d/', 'uc?export=view&id=').replace('/view?usp=sharing', '');
  return (
    <div className="my-10 bg-white dark:bg-[#0d0d0d] border-2 border-gray-100 dark:border-white/5 p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="text-[#003153]" size={16} />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alt} Registry Entry</span>
      </div>
      <img src={directLink} alt={alt} className="w-full h-auto object-contain max-h-[600px] border border-gray-100 dark:border-white/5" />
      <div className="mt-4 p-3 bg-gray-50 dark:bg-black/40 text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] flex items-center justify-between">
        <span>Reference ID: {src.split('/').pop()?.slice(0, 10)}</span>
        <span className="text-[#003153]">Verified Document</span>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'definitions', label: 'Definitions' },
  { id: 'explanation', label: 'Explanation' },
  { id: 'differences', label: 'Differences' },
  { id: 'fact-finding', label: 'Fact-Finding' },
  { id: 'inputs-outputs', label: 'Inputs/Processes/Outputs' },
  { id: 'off-the-shelf', label: 'Off-the-Shelf' },
  { id: 'walkthroughs', label: 'Walkthroughs' },
  { id: 'flowcharts', label: 'Flowcharts & Algorithms' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'converting', label: 'Converting Designs' },
  { id: 'exam-tips', label: 'Tips' },
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
        text: 'User requirements describe what users need; system requirements describe how the system will be built to meet those needs.',
      },
      {
        title: 'Pro Tip',
        text: 'Fact-finding methods like interviews, observation, and questionnaires help gather essential information for system design.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember IPO: Input → Process → Output – the fundamental flow of any program.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse algorithms with pseudocode. An algorithm is step-by-step logic; pseudocode is a way to write algorithms using code-like keywords.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'User requirements describe what users need; system requirements describe how the system will be built to meet those needs.',
      },
      {
        title: 'Pro Tip',
        text: 'Fact-finding methods like interviews, observation, and questionnaires help gather essential information for system design.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember IPO: Input → Process → Output – the fundamental flow of any program.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse algorithms with pseudocode. An algorithm is step-by-step logic; pseudocode is a way to write algorithms using code-like keywords.',
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
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
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
            <Code size={14} className="inline mr-1" /> PROGRAMMING CONCEPTS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 1{' '}
            <span className="text-emerald-300 font-bold italic">
              System &amp; User Requirements
            </span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Master the foundational concepts of programming: user vs. system
            requirements, fact-finding methods, inputs, processes, outputs,
            algorithms, pseudocode, and more.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-blue-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Brain size={14} className="inline mr-1" /> Logic
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileCode size={14} className="inline mr-1" /> C++
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-blue-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, definition, or method..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-blue-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-blue-200" />
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
            {/* Definitions */}
            <div
              ref={(el) => {
                sectionRefs.current['definitions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Definitions
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400">User Requirements</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Statements that describe what a user needs or wants a system to do in order to achieve their goals. They are written in plain language that the target users can understand.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">System Requirements</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detailed specifications for how the system will be built to meet the user requirements. These requirements are typically written for developers and engineers and use technical language.</p>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div
              ref={(el) => {
                sectionRefs.current['explanation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Explanation
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                User requirements focus on the <span className="font-bold">"what"</span> – what the user wants the system to accomplish. They describe the features and functionalities that will be valuable to the user. System requirements, on the other hand, focus on the <span className="font-bold">"how"</span> – how the system will be built to deliver the functionalities outlined in the user requirements. They delve into technical aspects like programming languages, hardware specifications, and security measures.
              </p>

              <div className="p-4 bg-gray-50 dark:bg-[#121212] rounded-xl border border-slate-200 dark:border-slate-700 mt-4">
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Example</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><span className="font-bold">User Requirement:</span> A library user wants to be able to search for books by title, author, or keyword.</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><span className="font-bold">System Requirement:</span> The library search system shall be able to query a database of books based on user-provided keywords, titles, or authors and return a list of relevant books within 2 seconds.</p>
              </div>
            </div>

            {/* Differences */}
            <div
              ref={(el) => {
                sectionRefs.current['differences'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Differences
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">Here's a table summarizing the key differences between user requirements and system requirements:</p>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm bg-white dark:bg-[#121212]">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">Feature</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">User Requirements</th>
                      <th className="p-3 font-bold uppercase tracking-widest text-[10px]">System Requirements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    <tr><td className="p-3 font-bold">Focus</td><td className="p-3">User needs and goals</td><td className="p-3">System capabilities and constraints</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Language</td><td className="p-3">Plain language</td><td className="p-3">Technical language</td></tr>
                    <tr><td className="p-3 font-bold">Audience</td><td className="p-3">End users</td><td className="p-3">Developers and engineers</td></tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/30"><td className="p-3 font-bold">Level of Detail</td><td className="p-3">High level overview</td><td className="p-3">Specific and measurable</td></tr>
                    <tr><td className="p-3 font-bold">Example</td><td className="p-3 italic">"The system should allow users to upload photos."</td><td className="p-3 italic">"The system shall support image uploads in JPEG and PNG formats, with a maximum file size of 10 MB."</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fact-Finding Methods */}
            <div
              ref={(el) => {
                sectionRefs.current['fact-finding'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Fact-Finding Methods
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Fact-finding methods are tools used to gather information in a structured way. They are widely used in business analysis, system development, and research.
              </p>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Examining Documentation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reviewing existing documents, reports, and records to gain insights into current processes, policies, and data.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Easy access</li>
                        <li>Historical perspective</li>
                        <li>Saves time</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>May be outdated</li>
                        <li>Limited scope</li>
                        <li>Quality varies</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Interviewing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Conducting one-on-one or group discussions to gather information directly from stakeholders.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>In-depth exploration</li>
                        <li>Clarification</li>
                        <li>Build rapport</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Time-consuming</li>
                        <li>Interviewer bias</li>
                        <li>Costly</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Observation</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Watching people perform tasks in their work environment to understand processes and identify potential issues.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Firsthand understanding</li>
                        <li>Identifies bottlenecks</li>
                        <li>Captures nonverbal cues</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Time-consuming</li>
                        <li>Reactivity effect</li>
                        <li>Observer bias</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Questionnaires</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Standardized surveys with predetermined questions used to gather information from a large group of people.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Cost-effective</li>
                        <li>Large sample</li>
                        <li>Anonymity</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Limited follow-up</li>
                        <li>Low response rates</li>
                        <li>Question design bias</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Research</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Reviewing existing studies, reports, and data related to the topic to gain background knowledge and industry trends.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Broader context</li>
                        <li>Saves time</li>
                        <li>Identifies best practices</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>May not be directly applicable</li>
                        <li>Quality varies</li>
                        <li>Time-consuming</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inputs, Processes, Outputs */}
            <div
              ref={(el) => {
                sectionRefs.current['inputs-outputs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Identifying Inputs, Processes, and Outputs
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Download size={14} /> Inputs
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Data or instructions that a program receives from the user or another source. Types: user input, sensor data, file data, network data.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                    <RefreshCw size={14} /> Processes
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Steps or instructions that transform input data into desired output. Types: calculations, data manipulation, control flow, function calls.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <ArrowRight size={14} /> Outputs
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Results generated by the program after processing inputs. Types: displayed information, saved data, returned values, device control.</p>
                </div>
              </div>
            </div>

            {/* Off-the-Shelf Solutions */}
            <div
              ref={(el) => {
                sectionRefs.current['off-the-shelf'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Alternative Solutions: Off-the-Shelf
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Purchasing Off-the-Shelf Software</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Buying pre-built software that caters to general business needs. Minimal customization required.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Cost-effective</li>
                        <li>Faster implementation</li>
                        <li>Vendor support</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Limited customization</li>
                        <li>Integration challenges</li>
                        <li>Vendor lock-in</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Outsourcing Software Development</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Hiring an external company to develop custom software tailored to your specific needs.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Scalability</li>
                        <li>Access to expertise</li>
                        <li>Cost-effectiveness (potentially)</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Communication challenges</li>
                        <li>Loss of control</li>
                        <li>Intellectual property concerns</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">In-House Development</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Building the software within your organization using your own employees or a dedicated in-house development team.</p>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs font-bold text-green-600 dark:text-green-400">Advantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Full control</li>
                        <li>Scalability</li>
                        <li>Integration ease</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs font-bold text-red-600 dark:text-red-400">Disadvantages</p>
                      <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-3">
                        <li>Higher upfront cost</li>
                        <li>Longer development time</li>
                        <li>Resource dependence</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Walkthroughs */}
            <div
              ref={(el) => {
                sectionRefs.current['walkthroughs'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Walkthroughs
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 What Are Walkthroughs?
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                A walkthrough is a structured meeting where a team collaboratively examines a process, document, software application, or task. It involves systematically stepping through each element, identifying potential issues, and discussing improvement opportunities.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Why Are Walkthroughs Done?
              </h3>
              <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1 mt-2">
                <li>Early problem identification</li>
                <li>Improved quality</li>
                <li>Knowledge sharing</li>
                <li>Enhanced communication</li>
                <li>Stakeholder buy-in</li>
              </ul>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 User Involvement in Solving Business Problems
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">User Perspective</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Users provide valuable insights into how they actually use or experience a process.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Usability Testing</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Walkthroughs can uncover potential difficulties users might encounter.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Improved Solutions</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">User input ensures solutions truly address their needs.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400">Increased User Satisfaction</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Involving users leads to solutions that resonate with real-world needs.</p>
                </div>
              </div>
            </div>

            {/* Flowcharts, Algorithms, and Pseudocode */}
            <div
              ref={(el) => {
                sectionRefs.current['flowcharts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Flowcharts, Algorithms, and Pseudocode
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Flowcharts</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A visual representation of a program's logic using symbols like boxes, diamonds, and arrows. Shows the flow of execution, decision points, and processing steps.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">How to Create:</p>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                      <li>Define Start and End</li>
                      <li>Identify Steps (rectangular boxes)</li>
                      <li>Decision Points (diamonds)</li>
                      <li>Connect steps with arrows</li>
                      <li>Add Inputs and Outputs</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Example: Even/Odd Flowchart</p>
                    <RegistryImage src="https://drive.google.com/file/d/1vqyxCearKrqLa_IFriO8xOTg8SBp3oGZ/view?usp=sharing" alt="Even/Odd Flowchart" />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Algorithms</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A step-by-step procedure that outlines the solution to a problem. Defines clear instructions for achieving a specific task.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">How to Create:</p>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                      <li>Identify the Problem</li>
                      <li>Break Down the Steps</li>
                      <li>Use Precise Language</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Example: Even/Odd Algorithm</p>
                    <RegistryImage src="https://drive.google.com/file/d/1dWVG1qoxtbxisJDNB45xoiML7m8fszdk/view?usp=sharing" alt="Even/Odd Algorithm" />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-red-600 dark:text-red-400">Pseudocode</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">A way of writing an algorithm using keywords and phrases that resemble a programming language, but without strict syntax rules.</p>
                  <div className="mt-2 p-2 bg-gray-50 dark:bg-[#121212] rounded">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">How to Create:</p>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4">
                      <li>Use Keywords (if, else, while, for)</li>
                      <li>Mimic Programming Language</li>
                      <li>Focus on Readability</li>
                    </ul>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Example: Even/Odd Pseudocode</p>
                    <RegistryImage src="https://drive.google.com/file/d/1oBseuvuwbgDCnPUL59rhuzNW8u-UC5Ur/view?usp=sharing" alt="Even/Odd Pseudocode" />
                  </div>
                </div>
              </div>
            </div>

            {/* Algorithms (in depth) */}
            <div
              ref={(el) => {
                sectionRefs.current['algorithms'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Algorithms
              </h2>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-2">
                1 Definition
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                An algorithm is a finite sequence of precise instructions that provide a clear and unambiguous solution to a specific problem. It acts as a roadmap, guiding the computer through the necessary steps to achieve the desired outcome.
              </p>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                2 Characteristics of a Well-Defined Algorithm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Finitude</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Finite number of steps – must eventually terminate.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Unambiguity</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Each step clear and single interpretation.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Definiteness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Steps definite, no improvisation.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Input</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Clearly defines expected input type.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Output</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Produces a well-defined output.</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Effectiveness</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Efficient and solves problem reasonably.</p>
                </div>
              </div>

              <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tight mt-6">
                3 Examples of Algorithms
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Sorting Algorithms</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Search Algorithms</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Mathematical Algorithms</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#121212] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Decision-Making Algorithms</p>
                </div>
              </div>
            </div>

            {/* Converting Program Designs */}
            <div
              ref={(el) => {
                sectionRefs.current['converting'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Converting Program Designs
              </h2>

              <div className="space-y-6 mt-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Algorithm to C++ Code</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Translating high-level algorithm steps into C++ syntax.</p>
                  <div className="mt-2">
                    <RegistryImage src="https://drive.google.com/file/d/1RaDlVHQlJ3WWn_AocSy0nzHmSyvdzbmI/view?usp=sharing" alt="Factorial Algorithm" />
                    <VSCodeTyping code={`#include <iostream>\nusing namespace std;\nint main() {\n  int n, factorial = 1;\n  cout << "Enter a non-negative integer: ";\n  cin >> n;\n  if (n < 0) {\n    cout << "Error: Factorial is not defined for negative numbers." << endl;\n    return 1; // Indicate error\n  }\n  for (int i = 1; i <= n; ++i) {\n    factorial *= i;\n  }\n  cout << "The factorial of " << n << " is: " << factorial << endl;\n  return 0;\n}`} />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Pseudocode to C++ Code</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Translating pseudocode into C++ syntax.</p>
                  <div className="mt-2">
                    <RegistryImage src="https://drive.google.com/file/d/1pAB7IWuN5Pao9Z0TRre5OR9DAvqnZ8Yj/view?usp=sharing" alt="Pseudocode Visualization" />
                    <VSCodeTyping code={`#include <iostream>\nusing namespace std;\nint main() {\n  int number1, number2;\n  cout << "Enter the first number: ";\n  cin >> number1;\n  cout << "Enter the second number: ";\n  cin >> number2;\n  if (number1 > number2) {\n    cout << number1 << " is greater than " << number2 << endl;\n  } else {\n    cout << number2 << " is greater than " << number1 << endl;\n  }\n  return 0;\n}`} />
                  </div>
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
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Understand the "Why"</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Focus on understanding concepts, not just memorizing definitions. Be able to explain in your own words.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Use Examples</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">For every concept (user vs system requirements, fact-finding, IPO), have a real-world example ready.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Practice Flowcharts and Pseudocode</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Be able to draw a flowchart and write pseudocode for a simple problem like calculating area, checking even/odd, or finding the larger of two numbers.</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">📌 Connect Concepts</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Show how requirements lead to algorithms, which lead to code – demonstrate the full development cycle.</p>
                </div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Understand it. Own it. Build software. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  💡 Programming Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-blue-500 dark:text-blue-400" />
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
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Fact-Finding Methods</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Algorithm Characteristics</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Programming is about solving problems. Start by understanding
                user needs, then design system requirements, then build algorithms,
                and finally code. Master the process, and the rest follows.
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
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">User requirements</strong> describe what users need in plain language; <strong>system requirements</strong> describe how the system will be built using technical specifications.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Fact-finding methods</strong> – interviewing, observation, questionnaires, documentation review, and research – help gather essential information for system design.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">IPO model</strong> – Input, Process, Output – is the fundamental flow of any program. Inputs are data received, processes transform it, outputs are the results.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Algorithms</strong> are step-by-step solutions; <strong>flowcharts</strong> visually represent them; <strong>pseudocode</strong> writes them in code-like language. All are tools for planning before coding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-300 font-bold">•</span>
              <span>
                <strong className="text-white">Converting designs</strong> to code involves translating algorithm/pseudocode steps into C++ syntax. Practice with simple problems like factorial, even/odd, or larger of two numbers.
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

export default LearningOutcome1;